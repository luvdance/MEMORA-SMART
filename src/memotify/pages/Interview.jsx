import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import useSEO from "../../hooks/useSEO";
import Shell, { useMe, useRequireSignIn } from "../Shell";
import { api, apiStream, useLoad } from "../api";
import { Notice, Spinner } from "../Bits";
import { ago, longDate } from "../format";
import {
  ArrowLeft, ArrowRight, Keyboard, Microphone, MicrophoneSlash, PaperPlaneTilt, SpeakerHigh, SpeakerSlash, UserSound,
} from "../icons";

/**
 * Interview practice. The list shows jobs the person has applied to; each opens
 * a live room where the interviewer's words stream in and, where the browser
 * allows, are spoken aloud and answered by voice. Speech runs in the browser,
 * so it costs nothing extra and typing always works as the fallback.
 */
const VERDICT = {
  ready: "Ready for this interview",
  nearly: "Nearly there",
  not_yet: "More practice needed",
};

const Recognition = typeof window !== "undefined" ? window.SpeechRecognition || window.webkitSpeechRecognition : null;
const canSpeak = typeof window !== "undefined" && "speechSynthesis" in window;

export function InterviewList() {
  useSEO({ title: "Interview practice — Memotify", description: "Practise live for jobs you've applied to." });
  const { signedIn, authLoading } = useMe();
  const signIn = useRequireSignIn();

  if (authLoading) return <Shell><Spinner /></Shell>;
  if (!signedIn) {
    return (
      <Shell>
        <section className="mf-intro">
          <UserSound size={40} weight="duotone" />
          <h1>Practise the interview before the interview</h1>
          <p>A live mock interview built from the job advert and your CV, with honest feedback at the end.</p>
          <button type="button" className="mf-btn" onClick={signIn}>Sign in to start</button>
        </section>
      </Shell>
    );
  }
  return <Shell><Applied /></Shell>;
}

function Applied() {
  const { data, error, loading } = useLoad("interviews");
  if (loading && !data) return <Spinner label="Loading your interviews" />;
  if (error) return <Notice tone="warn" title="This page did not load">{error.message}</Notice>;

  return (
    <div className="mf-tracker">
      <h1 className="mf-title">Interview practice</h1>
      <p className="mf-panel__sub">{data.left} of {data.limit} practice interviews left this week.</p>

      {data.jobs.length === 0 ? (
        <Notice title="Apply for a job first" action={<Link className="mf-link" to="/memotify/jobs">Find a job</Link>}>
          Practice is built around a real role. Once a job in your tracker is marked Applied, it appears here.
        </Notice>
      ) : (
        <ul className="mf-tracklist">
          {data.jobs.map((job) => (
            <li className="mf-hirejob" key={job.jobId}>
              <Link to={`/memotify/interview/${encodeURIComponent(job.jobId)}`}>
                <h3>{job.title}</h3>
                <p>{job.company}</p>
              </Link>
            </li>
          ))}
        </ul>
      )}

      {data.past.length > 0 && (
        <>
          <h2 className="mf-h2">Past interviews</h2>
          <ul className="mf-tracklist">
            {data.past.map((item) => (
              <li className="mf-hirejob" key={item.id}>
                <Link to={`/memotify/interview/${encodeURIComponent(item.jobId)}?review=${item.id}`}>
                  <h3>{item.title}</h3>
                  <p>{item.verdict ? VERDICT[item.verdict] : "Not finished"} · {ago(item.startedAt)}</p>
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export function InterviewRoom() {
  useSEO({ title: "Practice interview — Memotify", description: "A live mock interview." });
  const { jobId } = useParams();
  const { signedIn, authLoading, me } = useMe();
  const signIn = useRequireSignIn();
  const review = new URLSearchParams(window.location.search).get("review");

  if (authLoading) return <Shell tabs={false}><Spinner /></Shell>;
  if (!signedIn) {
    return (
      <Shell tabs={false}>
        <Notice title="Sign in to practise" action={<button type="button" className="mf-btn" onClick={signIn}>Sign in</button>} />
      </Shell>
    );
  }
  if (review) return <Shell tabs={false}><PastReview id={review} /></Shell>;
  return <Shell tabs={false}><Brief key={jobId} jobId={jobId} me={me} /></Shell>;
}

function PastReview({ id }) {
  const { data, error, loading } = useLoad("interview-view", { id });
  if (loading && !data) return <Spinner label="Opening the review" />;
  if (error) return <Notice tone="warn" title="This review did not load">{error.message}</Notice>;
  if (!data.session.feedback) {
    return <Notice title="This interview wasn't finished" action={<Link className="mf-link" to="/memotify/interview">Back to practice</Link>} />;
  }
  return <Review session={data.session} feedback={data.session.feedback} />;
}

function Brief({ jobId, me }) {
  const { data, error, loading } = useLoad("interview-brief", { jobId });
  const [room, setRoom] = useState(null);
  const [voice, setVoice] = useState(canSpeak);

  if (loading && !data) return <Spinner label="Preparing the room" />;
  if (error) {
    return (
      <Notice tone="warn" title="You can't practise this one yet" action={<Link className="mf-link" to="/memotify/jobs">Back to jobs</Link>}>
        {error.message}
      </Notice>
    );
  }
  if (room) return <Room brief={data} jobId={jobId} resume={room.resume} voice={voice} setVoice={setVoice} cvId={me?.profile?.cvId} />;

  const out = data.left <= 0 && !data.active;
  return (
    <div className="mf-brief">
      <Link className="mf-back" to="/memotify/interview"><ArrowLeft size={18} /> Interview practice</Link>
      <h1>{data.title}</h1>
      <p className="mf-panel__sub">at {data.company}</p>
      <ul className="mf-brief__facts">
        <li><b>{data.questions}</b> questions</li>
        <li><b>15</b> minutes or so</li>
        <li><b>{data.left}</b> left this week</li>
      </ul>
      <ul className="mf-brief__rules">
        <li>The interviewer has read this job advert and your CV, and will follow up on what you say.</li>
        {Recognition ? <li>Answer out loud or by typing. Your browser will ask to use your microphone.</li> : <li>Type your answers. This browser doesn't support speaking them.</li>}
        <li>Treat it as real. You get honest feedback on every answer at the end.</li>
      </ul>
      {canSpeak && (
        <label className="mf-switch">
          <input type="checkbox" checked={voice} onChange={(e) => setVoice(e.target.checked)} />
          <span><b>Interviewer speaks aloud</b>Uses your phone's own voice. Turn it off if you're somewhere quiet.</span>
        </label>
      )}
      {!data.available && <Notice tone="warn">Interview practice is not available right now.</Notice>}
      {out && (
        <Notice tone="warn" title="That's this week's interviews">
          {data.resetsAt ? `Your next one opens on ${longDate(data.resetsAt)}.` : ""}
        </Notice>
      )}
      {data.active ? (
        <button type="button" className="mf-btn mf-btn--wide" onClick={() => setRoom({ resume: data.active })}>
          Resume my interview <ArrowRight size={18} weight="bold" />
        </button>
      ) : (
        <button type="button" className="mf-btn mf-btn--wide" disabled={out || !data.available} onClick={() => setRoom({})}>
          Start the interview <ArrowRight size={18} weight="bold" />
        </button>
      )}
    </div>
  );
}

function Room({ brief, jobId, resume, voice, setVoice, cvId }) {
  const [sessionId, setSessionId] = useState(resume?.id || null);
  const [messages, setMessages] = useState(resume?.messages || []);
  const [live, setLive] = useState("");
  const [asked, setAsked] = useState(resume?.asked || 0);
  const [answer, setAnswer] = useState("");
  const [phase, setPhase] = useState(resume ? "answer" : "asking"); // asking | speaking | answer | reviewing | done | failed
  const [failure, setFailure] = useState("");
  const [listening, setListening] = useState(false);
  const [micError, setMicError] = useState("");
  const [feedback, setFeedback] = useState(null);
  const recognition = useRef(null);
  const spokenBase = useRef("");
  const bottom = useRef(null);
  const voiceRef = useRef(voice);
  const idRef = useRef(sessionId);
  const started = useRef(false);

  useEffect(() => {
    voiceRef.current = voice;
    if (!voice && canSpeak) window.speechSynthesis.cancel();
  }, [voice]);

  useEffect(() => {
    bottom.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, live, phase]);

  // Nothing may keep talking or listening after the page is left.
  useEffect(
    () => () => {
      recognition.current?.abort();
      if (canSpeak) window.speechSynthesis.cancel();
    },
    []
  );

  const stopListening = () => {
    recognition.current?.stop();
    setListening(false);
  };

  const listen = () => {
    if (!Recognition) return;
    setMicError("");
    const rec = new Recognition();
    rec.lang = "en-NG";
    rec.continuous = true;
    rec.interimResults = true;
    spokenBase.current = "";
    rec.onresult = (event) => {
      let said = "";
      for (let i = 0; i < event.results.length; i += 1) said += event.results[i][0].transcript;
      setAnswer(`${spokenBase.current}${said}`);
    };
    rec.onerror = (event) => {
      if (event.error === "not-allowed") setMicError("Microphone blocked. Allow it in your browser, or type your answer.");
      else if (event.error !== "no-speech" && event.error !== "aborted") setMicError("Couldn't hear you. Try again, or type your answer.");
      setListening(false);
    };
    rec.onend = () => setListening(false);
    recognition.current = rec;
    rec.start();
    setListening(true);
  };

  const speak = (text) => {
    if (!voiceRef.current || !canSpeak) {
      setPhase("answer");
      return;
    }
    setPhase("speaking");
    const line = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();
    line.voice = voices.find((v) => v.lang === "en-NG") || voices.find((v) => /^en[-_](GB|ZA|KE)/i.test(v.lang)) || voices.find((v) => /^en/i.test(v.lang)) || null;
    line.rate = 1;
    const ready = () => {
      setPhase("answer");
      if (Recognition) listen();
    };
    line.onend = ready;
    line.onerror = ready;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(line);
  };

  const review = async () => {
    setPhase("reviewing");
    setFailure("");
    try {
      const result = await api("interview-finish", { body: { id: idRef.current } });
      setFeedback(result.feedback);
      setPhase("done");
    } catch (err) {
      setFailure(err.message);
      setPhase("failed-review");
    }
  };

  const run = async (action, body) => {
    setPhase("asking");
    setLive("");
    setFailure("");
    let text = "";
    let finished = false;
    let failed = "";
    try {
      await apiStream(action, body, (event) => {
        if (event.session) {
          idRef.current = event.session;
          setSessionId(event.session);
        }
        if (event.text) {
          text += event.text;
          setLive(text);
        }
        if (event.done) {
          setAsked(event.asked);
          finished = event.finished;
        }
        if (event.error) failed = event.error;
      });
    } catch (err) {
      failed = err.message;
    }

    if (failed) {
      setLive("");
      setFailure(failed);
      setPhase("failed");
      return;
    }
    if (finished) {
      review();
      return;
    }
    setMessages((list) => [...list, { role: "assistant", content: text }]);
    setLive("");
    speak(text);
  };

  useEffect(() => {
    if (resume || started.current) return;
    started.current = true;
    run("interview-start", { jobId, cvId });
    // Runs once: starting an interview must not repeat on a re-render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const send = () => {
    const text = answer.trim();
    if (!text) return;
    stopListening();
    setMessages((list) => [...list, { role: "user", content: text }]);
    setAnswer("");
    run("interview-answer", { id: sessionId, answer: text });
  };

  if (phase === "done" && !feedback) {
    return <Notice title="Interview ended" action={<Link className="mf-link" to="/memotify/interview">Back to practice</Link>} />;
  }
  if (phase === "done") return <Review session={{ title: brief.title, company: brief.company }} feedback={feedback} />;

  return (
    <div className="mf-room">
      <header className="mf-room__head">
        <div className={`mf-room__who ${phase === "speaking" || phase === "asking" ? "is-live" : ""}`} aria-hidden="true">
          <UserSound size={24} weight="fill" />
        </div>
        <div>
          <strong>{brief.company}</strong>
          <span>Question {Math.max(asked, 1)} of {brief.questions}</span>
        </div>
        {canSpeak && (
          <button type="button" className="mf-iconbtn mf-iconbtn--room" onClick={() => setVoice(!voice)} aria-label={voice ? "Mute the interviewer" : "Unmute the interviewer"}>
            {voice ? <SpeakerHigh size={21} /> : <SpeakerSlash size={21} />}
          </button>
        )}
      </header>

      <div className="mf-room__talk" aria-live="polite">
        {messages.map((m, i) => (
          <p key={`${i}-${m.role}`} className={`mf-say mf-say--${m.role}`}>{m.content}</p>
        ))}
        {live && <p className="mf-say mf-say--assistant">{live}</p>}
        {phase === "asking" && !live && <p className="mf-say mf-say--assistant mf-say--wait">…</p>}
        {phase === "reviewing" && <Spinner label="Reviewing your interview. This takes a moment." />}
        <div ref={bottom} />
      </div>

      {phase === "failed" && (
        <Notice
          tone="warn"
          title="We lost the interviewer"
          action={sessionId
            ? <button type="button" className="mf-btn mf-btn--small" onClick={() => run("interview-answer", { id: sessionId })}>Try again</button>
            : <button type="button" className="mf-btn mf-btn--small" onClick={() => run("interview-start", { jobId, cvId })}>Try again</button>}
        >
          {failure}
        </Notice>
      )}
      {phase === "failed-review" && (
        <Notice tone="warn" title="Your review didn't load" action={<button type="button" className="mf-btn mf-btn--small" onClick={review}>Try again</button>}>
          {failure}
        </Notice>
      )}

      {(phase === "answer" || phase === "speaking") && (
        <footer className="mf-room__foot">
          {micError && <p className="mf-note">{micError}</p>}
          {listening && <p className="mf-room__hint"><i /> Listening. Tap the mic when you've finished.</p>}
          <textarea
            className="mf-input"
            rows={3}
            maxLength={2500}
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder={Recognition ? "Speak, or type your answer" : "Type your answer"}
            aria-label="Your answer"
          />
          <div className="mf-room__do">
            {Recognition ? (
              <button
                type="button"
                className={`mf-mic ${listening ? "is-on" : ""}`}
                onClick={() => (listening ? stopListening() : listen())}
                aria-label={listening ? "Stop listening" : "Answer by voice"}
              >
                {listening ? <MicrophoneSlash size={24} weight="fill" /> : <Microphone size={24} weight="fill" />}
              </button>
            ) : (
              <Keyboard size={24} aria-hidden="true" />
            )}
            <button type="button" className="mf-btn mf-btn--grow" disabled={!answer.trim() || phase === "speaking"} onClick={send}>
              <PaperPlaneTilt size={18} weight="fill" /> Send answer
            </button>
          </div>
          {asked > 1 && (
            <button type="button" className="mf-room__end" onClick={() => { stopListening(); review(); }}>
              End now and get feedback
            </button>
          )}
        </footer>
      )}
    </div>
  );
}

function Review({ session, feedback }) {
  return (
    <div className="mf-review">
      <p className="mf-eyebrow">Interview review</p>
      <h1>{VERDICT[feedback.verdict]}</h1>
      <p className="mf-panel__sub">{session.title} at {session.company}</p>
      <p className="mf-review__sum">{feedback.summary}</p>

      {feedback.strengths.length > 0 && (
        <section className="mf-panel">
          <h2>What worked</h2>
          <ul className="mf-review__list">{feedback.strengths.map((item) => <li key={item}>{item}</li>)}</ul>
        </section>
      )}
      {feedback.improve.length > 0 && (
        <section className="mf-panel">
          <h2>What to work on</h2>
          <ul className="mf-review__list">{feedback.improve.map((item) => <li key={item}>{item}</li>)}</ul>
        </section>
      )}

      {feedback.answers.length > 0 && <h2 className="mf-h2">Question by question</h2>}
      {feedback.answers.map((entry) => (
        <section className="mf-panel" key={entry.question}>
          <h3 className="mf-review__q">{entry.question}</h3>
          <p className="mf-panel__sub">{entry.comment}</p>
          <p className="mf-review__better"><b>A stronger answer:</b> {entry.stronger}</p>
        </section>
      ))}

      <Link className="mf-btn mf-btn--wide" to="/memotify/interview">Back to interview practice</Link>
    </div>
  );
}
