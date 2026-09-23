import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import AcademyNav from "../components/AcademyNav";
import AcademyFooter from "../components/AcademyFooter";
import { useAuth } from "../../context/AuthContext";
import { getAllProgress } from "../services/academyService";
import { ERROR_CODES, reportError } from "../services/errors";
import { getCourseOutline } from "../data/lessons/index.js";
import { certificationState } from "../data/certification";
import "../academy.css";

/**
 * THE FINAL CERTIFICATION EXAM
 *
 * Three screens in one page: a briefing, the paper, and the result.
 *
 * WHAT THIS COMPONENT DELIBERATELY DOES NOT KNOW
 * It has no item bank, no answer key and no marking logic. It asks the server
 * for a paper, collects responses, and posts them back to be marked. That is
 * not a convenience — the bank and the key live in lib/academy/finalExam/ and
 * `npm run validate:content` fails the build if anything under src/ imports
 * them, because a certification exam whose answers ship to the browser is not
 * a certification exam.
 *
 * THE SEED IS THE WHOLE PROTOCOL
 * On start the server issues a seed and the paper it produces. The client keeps
 * that seed in sessionStorage alongside the answers, so a reload — or a phone
 * that drops its connection halfway through — resumes the SAME paper rather
 * than dealing a fresh one. Grading sends the seed back and the server
 * re-derives the identical paper to mark against, so the client is never
 * trusted about which questions it was asked.
 *
 * Restored state is treated as untrusted: a seed that no longer serves, or
 * answers for items that are not on the paper, are discarded rather than
 * allowed to wedge the page.
 */

const API = "/api/academy/final-exam";
const STORE = "mst-final-exam-attempt";


/* ── The case stimulus, as a plain scrollable table ─────────────────────
 * Not the interactive ExcelGrid: that component self-checks and reveals its
 * own expected values, which is right for practice and wrong for an exam.
 */
function CaseTable({ columns, rows }) {
  const numeric = (v) => typeof v === "number";
  return (
    <div className="ac-fx__tablewrap">
      <table className="ac-fx__table">
        <thead>
          <tr>
            <th className="ac-fx__rowno" scope="col">
              #
            </th>
            {columns.map((c) => (
              <th key={c} scope="col">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              <td className="ac-fx__rowno">{i + 2}</td>
              {row.map((v, j) => (
                <td key={j} className={numeric(v) ? "is-num" : undefined}>
                  {numeric(v) ? v.toLocaleString() : v}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function CaseBrief({ kase, open, onToggle }) {
  return (
    <section className="ac-fx__case">
      <button
        type="button"
        className="ac-fx__casehead"
        onClick={onToggle}
        aria-expanded={open}
      >
        <span>
          <strong>{kase.company}</strong>
          <span className="ac-fx__sector">{kase.sector}</span>
        </span>
        <i className={`fas fa-chevron-${open ? "up" : "down"}`} aria-hidden="true" />
      </button>
      {open && (
        <div className="ac-fx__casebody">
          <p className="ac-fx__brief">{kase.brief}</p>
          <CaseTable columns={kase.columns} rows={kase.rows} />
          {kase.note && <p className="ac-fx__note">{kase.note}</p>}
          <p className="ac-fx__rowhint">
            Row numbers are shown so you can write cell ranges. Row 1 holds the
            column headings, so the data runs from row 2 to row{" "}
            {kase.rows.length + 1}.
          </p>
        </div>
      )}
    </section>
  );
}

/* ── One question ───────────────────────────────────────────────────────── */
function Item({ item, index, value, onChange }) {
  return (
    <li className="ac-fx__item" id={`fx-item-${item.id}`}>
      <div className="ac-fx__itemhead">
        <span className="ac-fx__num">{index + 1}</span>
        <p className="ac-fx__prompt">{item.prompt}</p>
      </div>

      {item.type === "mcq" && (
        <ul className="ac-fx__options">
          {item.options.map((o) => (
            <li key={o.id}>
              <label className={`ac-fx__option ${value === o.id ? "is-picked" : ""}`}>
                <input
                  type="radio"
                  name={item.id}
                  value={o.id}
                  checked={value === o.id}
                  onChange={() => onChange(item.id, o.id)}
                />
                <span>{o.text}</span>
              </label>
            </li>
          ))}
        </ul>
      )}

      {item.type === "formula" && (
        <div className="ac-fx__answer">
          <label htmlFor={`in-${item.id}`}>
            The formula for cell <code>{item.target}</code>
          </label>
          <input
            id={`in-${item.id}`}
            className="ac-fx__formula"
            type="text"
            inputMode="text"
            spellCheck={false}
            autoComplete="off"
            placeholder="=..."
            value={value || ""}
            onChange={(e) => onChange(item.id, e.target.value)}
          />
          <p className="ac-fx__hint">
            {item.hintRange ? `Ranges you need: ${item.hintRange}. ` : ""}
            Marked on whether the formula returns the right value, so any
            working construction counts. A typed number does not.
          </p>
        </div>
      )}

      {item.type === "predict" && (
        <div className="ac-fx__answer">
          {item.preamble && (
            <>
              <span className="ac-fx__codelabel">How the frame was built</span>
              <pre className="ac-fx__code is-preamble">{item.preamble.trim()}</pre>
            </>
          )}
          <span className="ac-fx__codelabel">The code</span>
          <pre className="ac-fx__code">{item.code}</pre>
          <label htmlFor={`in-${item.id}`}>What does it print?</label>
          <textarea
            id={`in-${item.id}`}
            className="ac-fx__output"
            rows={Math.min(12, Math.max(3, (item.lines || 3) + 1))}
            spellCheck={false}
            placeholder="One line per line of output…"
            value={value || ""}
            onChange={(e) => onChange(item.id, e.target.value)}
          />
          <p className="ac-fx__hint">
            Spacing between columns is not marked; the values and the number of
            lines are.
          </p>
        </div>
      )}
    </li>
  );
}

/* ── Result ─────────────────────────────────────────────────────────────── */
function Result({ result, onRetake }) {
  const VERDICT = {
    pass: "You passed.",
    "below-overall": "Not passed — your overall score is below the pass mark.",
    "domain-floor":
      "Not passed. Your overall score cleared the pass mark, but one or more sections fell below the minimum.",
    "below-both":
      "Not passed — your overall score is below the pass mark, and some sections fell below the minimum.",
  };

  return (
    <div className="ac-fx__result">
      <div className={`ac-fx__verdict ${result.passed ? "is-pass" : "is-fail"}`}>
        <span className="ac-fx__score">{result.score}%</span>
        <div>
          <strong>{VERDICT[result.verdict] || "Result"}</strong>
          <p>
            {result.correctCount} of {result.total} correct · pass mark{" "}
            {result.passMark}% · every section must reach{" "}
            {result.domainMinimum}%
          </p>
        </div>
      </div>

      {/* A certificate is shown only when one was actually WRITTEN. A pass
          whose record failed says so instead of implying a credential the
          student does not have. */}
      {result.certificate?.issued && (
        <div className="ac-fx__cert">
          <i className="fas fa-award" aria-hidden="true" />
          <div>
            <strong>{result.certificate.name}</strong>
            <p>
              {result.certificate.covers} · issued by{" "}
              {result.certificate.issuer}
            </p>
            {result.certificate.id && (
              <p className="ac-fx__certid">
                Certificate number <code>{result.certificate.id}</code>
                {result.certificate.reissued && " · already on your record"}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Withheld on purpose: the paper was passed but the course was not
          finished. Distinguished from a failure to allocate a number, because
          the two need completely different things from the candidate. */}
      {result.passed && result.certificateWithheld && (
        <div className="ac-fx__cert is-withheld">
          <i className="fas fa-lock" aria-hidden="true" />
          <div>
            <strong>You passed the paper. The certificate is not issued.</strong>
            <p>
              {result.certificateWithheld.reason === "course-incomplete" ? (
                <>
                  The certificate states that you completed the course, so it is
                  only issued once you have.
                  {typeof result.certificateWithheld.passedModules === "number" && (
                    <>
                      {" "}
                      You have passed{" "}
                      {result.certificateWithheld.passedModules} of{" "}
                      {result.certificateWithheld.requiredModules} required
                      modules.
                    </>
                  )}{" "}
                  This result stays on your record — finish the remaining
                  modules and the certificate is issued without resitting.
                </>
              ) : (
                <>
                  We could not confirm your course progress just now, so nothing
                  has been issued. Your result is saved. Reload your profile in a
                  moment, or contact us if it does not appear.
                </>
              )}
            </p>
          </div>
        </div>
      )}

      {result.passed && !result.certificate?.issued && !result.certificateWithheld && (
        <div className="ac-fx__cert is-pending">
          <i className="fas fa-hourglass-half" aria-hidden="true" />
          <div>
            <strong>You passed, but the certificate is not issued yet</strong>
            <p>
              Your result was graded correctly.{" "}
              {result.recorded
                ? "It is on your record, but the certificate number could not be allocated. Contact support and quote your score."
                : "It could not be saved to your record — sign in again and resubmit, or contact support."}
            </p>
          </div>
        </div>
      )}

      {!result.recorded && !result.passed && (
        <p className="ac-fx__hint">
          This attempt was graded but not saved to your record.
        </p>
      )}

      <h3 className="ac-fx__subhead">Section by section</h3>
      <ul className="ac-fx__domains">
        {result.domains.map((d) => (
          <li key={d.id} className={d.met ? "is-met" : "is-short"}>
            <div className="ac-fx__domainrow">
              <span className="ac-fx__domainname">{d.name}</span>
              <span className="ac-fx__domainscore">
                {d.correct}/{d.total} · {d.score}%
              </span>
            </div>
            <div className="ac-fx__bar">
              <span style={{ width: `${d.score}%` }} />
            </div>
          </li>
        ))}
      </ul>

      {result.missedSkills?.length > 0 && (
        <>
          <h3 className="ac-fx__subhead">Where you lost marks</h3>
          <ul className="ac-fx__skills">
            {result.missedSkills.slice(0, 8).map((s) => (
              <li key={s.skill}>
                {s.skill}
                {s.count > 1 && <em> ×{s.count}</em>}
              </li>
            ))}
          </ul>
        </>
      )}

      {result.review?.length > 0 && (
        <>
          <h3 className="ac-fx__subhead">Revisit these before retaking</h3>
          <ul className="ac-fx__review">
            {result.review.map((m) => (
              <li key={m}>{m}</li>
            ))}
          </ul>
        </>
      )}

      <p className="ac-fx__nokey">
        Individual questions and their answers are not shown. The exam
        re-randomises on every attempt, so there is nothing to memorise — the
        sections above tell you what to study.
      </p>

      <div className="ac-fx__actions">
        <button type="button" className="ac-btn ac-btn--primary" onClick={onRetake}>
          Take a new exam
        </button>
        <Link className="ac-btn ac-btn--ghost" to="/academy/learn">
          Back to the course
        </Link>
      </div>
    </div>
  );
}

/* ── Page ───────────────────────────────────────────────────────────────── */
export default function FinalExam() {
  const { user } = useAuth();

  const [briefing, setBriefing] = useState(null);
  const [paper, setPaper] = useState(null);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [phase, setPhase] = useState("loading"); // loading | brief | sitting | done
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);
  const [openCase, setOpenCase] = useState(null);
  const [secondsLeft, setSecondsLeft] = useState(null);
  const [confirmSubmit, setConfirmSubmit] = useState(false);
  const [readiness, setReadiness] = useState(null);
  // Until the check has run we do not know, and not knowing must read as
  // locked rather than as open.
  const [readinessChecked, setReadinessChecked] = useState(false);
  /* The gate. Anything other than a confirmed "ready" is locked, so a failed
     progress read, an unfinished course and a course with no exam all close
     the door rather than leaving it ajar. The server checks this again before
     issuing a certificate — see checkEligibility in finalExam/record.js —
     because this one runs in a browser. */
  const locked = readiness?.state !== "ready";

  const topRef = useRef(null);

  /* Briefing, plus a restored attempt if one is in flight. */
  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        const res = await fetch(API);
        if (!res.ok) throw new Error(`Briefing unavailable (${res.status})`);
        const data = await res.json();
        if (!alive) return;
        setBriefing(data);

        const saved = readStored();
        if (saved) {
          const resumed = await fetch(`${API}?seed=${saved.seed}`);
          if (resumed.ok) {
            const p = await resumed.json();
            if (!alive) return;
            setPaper(p);
            // Keep only answers that belong to items on this paper.
            const valid = new Set(p.items.map((i) => i.id));
            const kept = {};
            for (const [k, v] of Object.entries(saved.answers || {})) {
              if (valid.has(k)) kept[k] = v;
            }
            setAnswers(kept);
            setOpenCase(p.cases[0]?.id ?? null);
            setSecondsLeft(
              Math.max(
                0,
                saved.endsAt
                  ? Math.round((saved.endsAt - Date.now()) / 1000)
                  : p.durationMinutes * 60
              )
            );
            setPhase("sitting");
            return;
          }
          clearStored();
        }
        setPhase("brief");
      } catch (err) {
        if (alive) {
          setError(reportError("exam:resume", err).message);
          setPhase("brief");
        }
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  /* Has the candidate finished the course?
   *
   * THIS IS NOW A LOCK, NOT A WARNING. It was advisory, on the reasoning that
   * somebody already working in data might reasonably want to sit the exam
   * early. But a certificate that can be attempted before the course does not
   * certify the course, and the certificate is a claim made to an employer.
   *
   * It also did not work. The old check read `p.assessmentPassed || p.completed`
   * and no progress document has ever carried either field — recordAssessment
   * writes the result nested under `assessment`. So the set of passed lessons
   * was always empty, every module was always outstanding, and every candidate
   * was warned they had finished nothing no matter how much they had done.
   *
   * `certificationState` now owns that definition, so this page and the
   * profile can never disagree about whether somebody is eligible. */
  useEffect(() => {
    if (!user || !briefing) return;
    let alive = true;
    getAllProgress(user.uid, briefing.courseId)
      .then((progress) => {
        if (!alive) return;
        setReadiness(
          certificationState({
            courseId: briefing.courseId,
            outline: getCourseOutline(briefing.courseId),
            progressByLesson: progress || {},
          })
        );
      })
      // A failed read must not silently unlock the exam, so an unknown state
      // is treated as locked rather than as ready.
      .catch(() => setReadiness({ state: "locked", outstanding: [], percent: 0 }))
      .finally(() => {
        if (alive) setReadinessChecked(true);
      });
    return () => {
      alive = false;
    };
  }, [user, briefing]);

  /* The clock. Submits once when it runs out, which is what a timed exam
   * means — but a dropped connection must not lose the attempt, so answers
   * are already persisted on every keystroke. */
  useEffect(() => {
    if (phase !== "sitting" || secondsLeft === null) return;
    if (secondsLeft <= 0) {
      submit(true);
      return;
    }
    const t = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, secondsLeft]);

  function readStored() {
    try {
      const raw = sessionStorage.getItem(STORE);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      return Number.isFinite(parsed?.seed) ? parsed : null;
    } catch {
      return null;
    }
  }
  function writeStored(next) {
    try {
      sessionStorage.setItem(STORE, JSON.stringify(next));
    } catch {
      /* private mode, or storage is full — the attempt still works in memory */
    }
  }
  function clearStored() {
    try {
      sessionStorage.removeItem(STORE);
    } catch {
      /* nothing to do */
    }
  }

  const start = useCallback(async () => {
    // Belt and braces. The button is not rendered while locked, so reaching
    // here means the state changed underneath us or somebody called it
    // directly from the console. Either way, do not serve a paper.
    if (locked) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`${API}?start=1`);
      if (!res.ok) throw new Error(`Could not start the exam (${res.status})`);
      const p = await res.json();
      const endsAt = Date.now() + p.durationMinutes * 60 * 1000;
      setPaper(p);
      setAnswers({});
      setResult(null);
      setOpenCase(p.cases[0]?.id ?? null);
      setSecondsLeft(p.durationMinutes * 60);
      setPhase("sitting");
      writeStored({ seed: p.seed, answers: {}, endsAt });
      topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    } catch (err) {
      setError(reportError("exam:start", err, ERROR_CODES.UNAVAILABLE).message);
    } finally {
      setBusy(false);
    }
  }, [locked]);

  const change = useCallback(
    (itemId, value) => {
      setAnswers((prev) => {
        const next = { ...prev, [itemId]: value };
        const saved = readStored();
        writeStored({
          seed: paper?.seed,
          answers: next,
          endsAt: saved?.endsAt,
        });
        return next;
      });
    },
    [paper]
  );

  async function submit(auto = false) {
    if (!paper || busy) return;
    setBusy(true);
    setError(null);
    try {
      // The server identifies the candidate from this token, not from
      // anything in the body — so the attempt is written to the right record
      // and cannot be written to anyone else's.
      const headers = { "Content-Type": "application/json" };
      try {
        const token = await user?.getIdToken?.();
        if (token) headers.Authorization = `Bearer ${token}`;
      } catch {
        // Submitting without a token still grades; it just will not record.
      }

      const res = await fetch(API, {
        method: "POST",
        headers,
        body: JSON.stringify({ seed: paper.seed, answers }),
      });
      if (!res.ok) {
        // The API's message describes the request. The candidate needs to
        // know their answers are safe and that they can submit again.
        const failure = new Error("exam-submit-failed");
        failure.code = "unavailable";
        throw failure;
      }
      const marked = await res.json();
      setResult(marked);
      setPhase("done");
      clearStored();
      topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    } catch (err) {
      setError(
        `${reportError("exam:submit", err, ERROR_CODES.UNAVAILABLE).message} Your answers are still here — nothing has been lost.`
      );
      if (auto) setSecondsLeft(0);
    } finally {
      setBusy(false);
      setConfirmSubmit(false);
    }
  }

  const answeredCount = useMemo(
    () =>
      paper
        ? paper.items.filter((i) => {
            const a = answers[i.id];
            return a !== undefined && a !== null && String(a).trim() !== "";
          }).length
        : 0,
    [paper, answers]
  );

  const clock = useMemo(() => {
    if (secondsLeft === null) return null;
    const m = Math.floor(Math.max(0, secondsLeft) / 60);
    const s = Math.max(0, secondsLeft) % 60;
    return `${m}:${String(s).padStart(2, "0")}`;
  }, [secondsLeft]);

  return (
    // The `academy` class carries the --ac-* design tokens, so every rule in
    // academy-exam.css that references one depends on it being here.
    <div className="academy ac-fx">
      <AcademyNav />

      <main className="ac-fx__main" ref={topRef}>
        {error && (
          <p className="ac-fx__error" role="alert">
            <i className="fas fa-circle-exclamation" aria-hidden="true" /> {error}
          </p>
        )}

        {phase === "loading" && <p className="ac-boot">Loading the exam…</p>}

        {/* ── Briefing ── */}
        {phase === "brief" && briefing && (
          <div className="ac-fx__brief-screen">
            <header className="ac-fx__hero">
              <span className="ac-fx__kicker">Final certification exam</span>
              <h1>{briefing.title}</h1>
              <p>{briefing.subtitle}</p>
            </header>

            <ul className="ac-fx__facts">
              <li>
                <strong>{briefing.itemCount}</strong>
                <span>questions</span>
              </li>
              <li>
                <strong>{briefing.durationMinutes} min</strong>
                <span>time limit</span>
              </li>
              <li>
                <strong>{briefing.passMark}%</strong>
                <span>to pass</span>
              </li>
              <li>
                <strong>{briefing.domainMinimum}%</strong>
                <span>minimum per section</span>
              </li>
            </ul>

            <div className="ac-fx__panel">
              <h2>How this exam is built</h2>
              <p>
                Your paper is generated for you. Two candidates sitting at the
                same time answer different questions — but every paper draws
                the same number of questions from each section below, at the
                same spread of difficulty, so all results mean the same thing.
                There is nothing to memorise, and every retake is a new paper.
              </p>
              <p>
                Most questions are built on real company case studies: a brief
                from a stakeholder, a table of data, and the question they
                actually need answered. Some ask you to write a working Excel
                formula; some give you Python code and ask what it prints.
              </p>
            </div>

            <h2 className="ac-fx__subhead">What is examined</h2>
            <ul className="ac-fx__sections">
              {briefing.domains.map((d) => (
                <li key={d.id}>
                  <div className="ac-fx__domainrow">
                    <strong>{d.name}</strong>
                    <span className="ac-fx__count">{d.items} questions</span>
                  </div>
                  <ul>
                    {d.covers.map((c) => (
                      <li key={c}>{c}</li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>

            {/* The gate. Locked until every module the exam covers has been
                passed, and explicit about what is left rather than saying
                "not yet" and leaving the candidate to work out why. */}
            {!readinessChecked ? (
              <p className="ac-fx__checking">
                <i className="fas fa-spinner fa-spin" aria-hidden="true" />{" "}
                Checking your progress…
              </p>
            ) : locked ? (
              <div className="ac-fx__locked">
                <div className="ac-fx__lockedhead">
                  <i className="fas fa-lock" aria-hidden="true" />
                  <div>
                    <strong>The exam is not open to you yet</strong>
                    <p>
                      It certifies the whole of {briefing.courseTitle}, so it
                      opens once you have passed every module it covers. There
                      is no waiting period and no approval to ask for: it
                      unlocks the moment you finish.
                    </p>
                  </div>
                </div>

                <div className="ac-fx__lockedbar" aria-hidden="true">
                  <span style={{ width: `${readiness?.percent || 0}%` }} />
                </div>
                <p className="ac-fx__lockedcount">
                  {readiness?.doneCount ?? 0} of {readiness?.requiredCount ?? 0}{" "}
                  required modules passed
                </p>

                {readiness?.outstanding?.length > 0 && (
                  <details className="ac-fx__outstanding">
                    <summary>
                      {readiness.outstanding.length} module
                      {readiness.outstanding.length === 1 ? "" : "s"} still to pass
                    </summary>
                    <ul>
                      {readiness.outstanding.map((title) => (
                        <li key={title}>{title}</li>
                      ))}
                    </ul>
                  </details>
                )}

                <div className="ac-fx__actions">
                  <Link className="ac-btn ac-btn--primary" to="/academy/learn">
                    Carry on with the course
                    <i className="fas fa-arrow-right" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            ) : (
              <>
                <p className="ac-fx__ready">
                  <i className="fas fa-circle-check" aria-hidden="true" /> You
                  have passed every module this exam covers. It is open to you.
                </p>

                <div className="ac-fx__actions">
                  <button
                    type="button"
                    className="ac-btn ac-btn--primary"
                    onClick={start}
                    disabled={busy}
                  >
                    {busy ? "Generating your paper…" : "Start the exam"}
                  </button>
                  <Link className="ac-btn ac-btn--ghost" to="/academy/learn">
                    Not yet — back to the course
                  </Link>
                </div>
                <p className="ac-fx__nokey">
                  The clock starts when you press Start. Your answers are saved
                  as you go, so a reload or a dropped connection will not lose
                  them.
                </p>
              </>
            )}
          </div>
        )}

        {/* ── Sitting the paper ── */}
        {phase === "sitting" && paper && (
          <div className="ac-fx__sitting">
            <div className="ac-fx__statusbar">
              <span className="ac-fx__progresstext">
                {answeredCount} of {paper.itemCount} answered
              </span>
              <div className="ac-fx__progress">
                <span
                  style={{ width: `${(answeredCount / paper.itemCount) * 100}%` }}
                />
              </div>
              <span
                className={`ac-fx__clock ${secondsLeft <= 300 ? "is-low" : ""}`}
              >
                <i className="fas fa-clock" aria-hidden="true" /> {clock}
              </span>
            </div>

            {paper.cases.length > 0 && (
              <>
                <h2 className="ac-fx__subhead">
                  Case studies on your paper
                  <span className="ac-fx__count">
                    {paper.cases.length}{" "}
                    {paper.cases.length === 1 ? "company" : "companies"}
                  </span>
                </h2>
                <p className="ac-fx__casehint">
                  Open a brief to read it and see its data. They stay available
                  for the whole exam.
                </p>
                {paper.cases.map((c) => (
                  <CaseBrief
                    key={c.id}
                    kase={c}
                    open={openCase === c.id}
                    onToggle={() => setOpenCase(openCase === c.id ? null : c.id)}
                  />
                ))}
              </>
            )}

            <ol className="ac-fx__items">
              {paper.items.map((item, i) => {
                const kase = item.caseId
                  ? paper.cases.find((c) => c.id === item.caseId)
                  : null;
                const prev = i > 0 ? paper.items[i - 1].caseId : undefined;
                const showHeading = kase && item.caseId !== prev;
                return (
                  <li key={item.id} className="ac-fx__itemwrap">
                    {showHeading && (
                      <p className="ac-fx__itemcase">
                        <i className="fas fa-folder-open" aria-hidden="true" />{" "}
                        {kase.company}
                        <button
                          type="button"
                          className="ac-fx__jump"
                          onClick={() => setOpenCase(item.caseId)}
                        >
                          show the data
                        </button>
                      </p>
                    )}
                    <ol className="ac-fx__bare">
                      <Item
                        item={item}
                        index={i}
                        value={answers[item.id]}
                        onChange={change}
                      />
                    </ol>
                  </li>
                );
              })}
            </ol>

            <div className="ac-fx__submit">
              {answeredCount < paper.itemCount && (
                <p className="ac-fx__hint">
                  {paper.itemCount - answeredCount} unanswered. An unanswered
                  question scores zero, so a considered guess is always better.
                </p>
              )}
              {confirmSubmit ? (
                <>
                  <p className="ac-fx__confirm">
                    Submit for marking? You cannot change your answers
                    afterwards.
                  </p>
                  <div className="ac-fx__actions">
                    <button
                      type="button"
                      className="ac-btn ac-btn--primary"
                      onClick={() => submit()}
                      disabled={busy}
                    >
                      {busy ? "Marking…" : "Yes, submit"}
                    </button>
                    <button
                      type="button"
                      className="ac-btn ac-btn--ghost"
                      onClick={() => setConfirmSubmit(false)}
                    >
                      Keep working
                    </button>
                  </div>
                </>
              ) : (
                <button
                  type="button"
                  className="ac-btn ac-btn--primary"
                  onClick={() => setConfirmSubmit(true)}
                  disabled={busy}
                >
                  Submit my exam
                </button>
              )}
            </div>
          </div>
        )}

        {/* ── Result ── */}
        {phase === "done" && result && (
          <Result
            result={result}
            onRetake={() => {
              setPhase("brief");
              setResult(null);
              setPaper(null);
              setAnswers({});
              setSecondsLeft(null);
            }}
          />
        )}
      </main>

      <AcademyFooter />
    </div>
  );
}
