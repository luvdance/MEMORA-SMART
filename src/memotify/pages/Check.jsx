import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import useSEO from "../../hooks/useSEO";
import Shell, { useMe, useRequireSignIn } from "../Shell";
import { api } from "../api";
import { Notice, Spinner } from "../Bits";
import { longDate } from "../format";
import { SKILLS, skillLabel } from "../data/skills";
import { ArrowLeft, ArrowRight, ClockCountdown, SealCheck } from "../icons";

/**
 * A timed skill check. The clock and the paper live on the server, so this
 * page is only a view of them: a reload resumes the same paper with the time
 * that is really left, and answers are kept in this browser so a dropped
 * connection doesn't cost anyone their work.
 */
const draftKey = (skill) => `memotifyCheck:${skill}`;

function loadDraft(skill) {
  try {
    return JSON.parse(localStorage.getItem(draftKey(skill))) || {};
  } catch {
    return {};
  }
}

function saveDraft(skill, answers) {
  try {
    localStorage.setItem(draftKey(skill), JSON.stringify(answers));
  } catch {
    /* The answers still live in memory. */
  }
}

function clearDraft(skill) {
  try {
    localStorage.removeItem(draftKey(skill));
  } catch {
    /* Nothing to clear. */
  }
}

export default function Check() {
  const { skill } = useParams();
  const { signedIn, authLoading, reloadMe } = useMe();
  const signIn = useRequireSignIn();
  useSEO({ title: `${skillLabel(skill)} check — Memotify`, description: "A timed Memotify skill check." });

  const [stage, setStage] = useState("brief"); // brief | paper | wait | held | result
  const [paper, setPaper] = useState(null);
  const [info, setInfo] = useState(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const begin = async () => {
    if (!signedIn) return signIn();
    setBusy(true);
    setError("");
    try {
      const started = await api("check-start", { body: { skill } });
      if (started.status === "open") {
        setPaper(started);
        setStage("paper");
      } else {
        setInfo(started);
        setStage(started.status);
      }
    } catch (err) {
      setError(err.message);
    }
    setBusy(false);
    return undefined;
  };

  const finish = useCallback(
    async (answers) => {
      const result = await api("check-submit", { body: { skill, answers } });
      clearDraft(skill);
      setInfo(result);
      setStage("result");
      reloadMe();
    },
    [skill, reloadMe]
  );

  if (!SKILLS[skill]?.check) {
    return (
      <Shell>
        <Notice title="There is no check for that skill yet" action={<Link className="mf-link" to="/memotify/passport">Back to your Passport</Link>} />
      </Shell>
    );
  }
  if (authLoading) return <Shell><Spinner /></Shell>;

  if (stage === "paper") {
    return (
      <Shell tabs={false}>
        <Paper skill={skill} paper={paper} onFinish={finish} />
      </Shell>
    );
  }

  return (
    <Shell>
      <div className="mf-brief">
        <Link className="mf-back" to="/memotify/passport"><ArrowLeft size={18} /> Passport</Link>

        {stage === "brief" && (
          <>
            <h1>{skillLabel(skill)} check</h1>
            <ul className="mf-brief__facts">
              <li><b>12</b> questions</li>
              <li><b>15</b> minutes</li>
              <li><b>70%</b> to pass</li>
            </ul>
            <ul className="mf-brief__rules">
              <li>The clock starts when you press begin, and keeps running if you leave.</li>
              <li>If you don't pass, you can sit it again after 7 days. Leaving a paper unfinished counts as a sitting.</li>
              <li>A pass goes on your Passport for 18 months, with your score.</li>
              <li>Find a quiet spot and a good connection. Work alone: this only helps you if it's true.</li>
            </ul>
            {error && <Notice tone="warn">{error}</Notice>}
            <button type="button" className="mf-btn mf-btn--wide" disabled={busy} onClick={begin}>
              {busy ? "Starting" : signedIn ? "Begin the check" : "Sign in to begin"}
            </button>
          </>
        )}

        {stage === "wait" && (
          <Notice
            title="You can sit this again soon"
            action={SKILLS[skill].course && <Link className="mf-link" to={`/academy/enroll/${SKILLS[skill].course}`}>Prepare in the Academy</Link>}
          >
            Your next attempt opens on {longDate(info.retryAt)}.
          </Notice>
        )}

        {stage === "held" && (
          <Notice title="You already hold this one" action={<Link className="mf-link" to="/memotify/passport">See your Passport</Link>}>
            You passed with {info.score}% on {longDate(info.passedAt)}.
          </Notice>
        )}

        {stage === "result" && <Result skill={skill} result={info} />}
      </div>
    </Shell>
  );
}

function Result({ skill, result }) {
  if (result.passed) {
    return (
      <div className="mf-result">
        <div className="mf-stamp mf-stamp--verified mf-stamp--big">
          <span className="mf-stamp__tier">Verified</span>
          <strong>{skillLabel(skill)}</strong>
          <span className="mf-stamp__line">{result.score}%</span>
        </div>
        <h1>That's on your Passport now</h1>
        <p>Every job that asks for {skillLabel(skill)} now counts this as proof.</p>
        <Link className="mf-btn mf-btn--wide" to={`/memotify/jobs?skill=${skill}`}>
          See jobs that need it <ArrowRight size={18} weight="bold" />
        </Link>
      </div>
    );
  }
  return (
    <div className="mf-result">
      <h1>{result.timedOut ? "Time ran out" : `${result.score}%. Not this time`}</h1>
      <p>
        You needed 70%. You can sit it again from {longDate(result.retryAt)}, with different questions.
        {result.timedOut ? " Answers sent after the clock stops can't be marked." : ""}
      </p>
      {SKILLS[skill].course && (
        <Link className="mf-btn mf-btn--wide" to={`/academy/enroll/${SKILLS[skill].course}`}>Prepare in the Academy</Link>
      )}
      <Link className="mf-link" to="/memotify/passport">Back to your Passport</Link>
    </div>
  );
}

function Paper({ skill, paper, onFinish }) {
  const [answers, setAnswers] = useState(() => loadDraft(skill));
  const [left, setLeft] = useState(() => paper.expiresAt - Date.now());
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const answersRef = useRef(answers);
  const sentRef = useRef(false);

  const set = (id, value) => {
    const next = { ...answersRef.current, [id]: value };
    answersRef.current = next;
    saveDraft(skill, next);
    setAnswers(next);
  };

  const send = async () => {
    if (sentRef.current) return;
    sentRef.current = true;
    setSending(true);
    setError("");
    try {
      await onFinish(answersRef.current);
    } catch (err) {
      sentRef.current = false;
      setSending(false);
      setError(`${err.message} Your answers are safe here. Try again.`);
    }
  };

  // The timer outlives renders, so it reaches the latest send through a ref.
  const sendRef = useRef(send);
  useEffect(() => {
    sendRef.current = send;
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const remaining = paper.expiresAt - Date.now();
      setLeft(remaining);
      if (remaining <= 0) {
        clearInterval(timer);
        sendRef.current();
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [paper.expiresAt]);

  const answered = paper.items.filter((item) => answers[item.id]).length;
  const seconds = Math.max(0, Math.floor(left / 1000));
  const clock = `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;

  return (
    <form
      className="mf-paper"
      onSubmit={(e) => {
        e.preventDefault();
        send();
      }}
    >
      <div className={`mf-paper__bar ${seconds < 120 ? "is-low" : ""}`}>
        <span>{skillLabel(skill)}</span>
        <span>{answered}/{paper.items.length}</span>
        <b><ClockCountdown size={18} weight="bold" /> {clock}</b>
      </div>

      {paper.items.map((item, i) => (
        <fieldset key={item.id} className="mf-q">
          <legend><span>{i + 1}</span> {item.prompt}</legend>
          {item.preamble && <pre className="mf-code">{item.preamble}</pre>}
          {item.code && <pre className="mf-code">{item.code}</pre>}
          {item.type === "mcq" ? (
            item.options.map((option) => (
              <label key={option.id} className={`mf-opt ${answers[item.id] === option.id ? "is-on" : ""}`}>
                <input
                  type="radio"
                  name={item.id}
                  checked={answers[item.id] === option.id}
                  onChange={() => set(item.id, option.id)}
                />
                <span>{option.text}</span>
              </label>
            ))
          ) : (
            <textarea
              className="mf-input mf-input--code"
              rows={Math.max(2, item.lines)}
              spellCheck={false}
              autoCapitalize="off"
              autoCorrect="off"
              aria-label="Your answer"
              value={answers[item.id] || ""}
              onChange={(e) => set(item.id, e.target.value)}
            />
          )}
        </fieldset>
      ))}

      {error && <Notice tone="warn">{error}</Notice>}
      <button type="submit" className="mf-btn mf-btn--wide" disabled={sending}>
        {sending ? "Marking" : <><SealCheck size={18} weight="fill" /> Submit my answers</>}
      </button>
    </form>
  );
}
