import { useState } from "react";
import { scoreFindings, safeReason } from "../../../lib/academy/cyber/phish";

/**
 * INSPECT THE MESSAGE — a graded practice.
 *
 * Everybody recognises a phishing email once it is captioned "phishing
 * example". Almost nobody recognises one in their own inbox at eight in the
 * morning. The gap is not knowledge. It is the habit of LOOKING at specific
 * parts of a message before acting on it: the real sending domain, the real
 * link target, the pressure in the wording, the mismatch between who it claims
 * to be and what it is asking for.
 *
 * So the task is not "is this phishing, yes or no". A coin gets that half
 * right. The learner has to mark WHICH parts gave it away, and is marked on
 * false alarms as well as misses — because someone who learns to flag the
 * whole message has learned nothing they can use on a real Monday.
 *
 * The grading lives in lib/academy/cyber/phish.js so the content validator can
 * prove every flagged part carries a reason before the lesson ships.
 */
export default function PhishInspect({
  task,
  message,
  tolerance = 0,
  verdict,
  successMessage,
  onSolved,
  alreadySolved = false,
  readOnly = false,
}) {
  const [picked, setPicked] = useState(() => new Set());
  const [result, setResult] = useState(() =>
    alreadySolved
      ? { ok: true, message: "You already worked this one out. The indicators are marked below." }
      : null
  );
  // Set once an attempt has been marked, so reasons appear on the parts
  // themselves rather than only in a paragraph underneath.
  const [revealed, setRevealed] = useState(alreadySolved || readOnly);

  const toggle = (id) => {
    if (readOnly) return;
    setPicked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
    setResult(null);
  };

  const check = () => {
    if (!picked.size) {
      setResult({ ok: false, message: "Click the parts of this message that would stop you trusting it." });
      return;
    }

    const scored = scoreFindings(message, [...picked], tolerance);
    setRevealed(true);

    if (scored.ok) {
      setResult({ ok: true, message: successMessage || "That is what gives it away, and nothing that does not." });
      onSolved?.();
      return;
    }

    if (scored.falseAlarms.length > tolerance) {
      const part = scored.falseAlarms[0];
      setResult({
        ok: false,
        message: `One of the parts you flagged is ordinary. ${safeReason(part)} Flagging it here means flagging most legitimate mail too, and people who do that stop trusting their own judgement within a week.`,
      });
      return;
    }

    setResult({
      ok: false,
      message: `You found ${scored.found.length} of ${scored.total}. ${scored.missed.length === 1 ? "One more part" : `${scored.missed.length} more parts`} of this message should have stopped you. Look again at what the message is asking you to DO, and at where it is really sending you.`,
    });
  };

  const partClass = (part) => {
    const chosen = picked.has(part.id);
    if (revealed && part.flag) return chosen ? "is-hit" : "is-missed";
    if (revealed && chosen) return "is-false";
    return chosen ? "is-picked" : "";
  };

  const render = (part, kind) => (
    <button
      key={part.id}
      type="button"
      className={`ac-phish__part ac-phish__part--${kind} ${partClass(part)}`}
      onClick={() => toggle(part.id)}
      aria-pressed={picked.has(part.id)}
      disabled={readOnly}
    >
      {kind === "header" ? (
        <span className="ac-phish__row">
          <span className="ac-phish__label">{part.label}</span>
          <span className="ac-phish__value">{part.value}</span>
        </span>
      ) : part.link ? (
        <span className="ac-phish__body">
          <span className="ac-phish__linktext">{part.text}</span>
          <span className="ac-phish__href">
            <i className="fas fa-link" aria-hidden="true" /> {part.link}
          </span>
        </span>
      ) : (
        <span className="ac-phish__body">{part.text}</span>
      )}

      {revealed && part.flag && (
        <span className="ac-phish__why">
          <i className="fas fa-triangle-exclamation" aria-hidden="true" />
          {part.why}
        </span>
      )}
    </button>
  );

  return (
    <div className="ac-phish">
      <div className="ac-phish__task">
        <span className="ac-note__label">
          {readOnly ? "Read the message" : "Inspect the message"}
        </span>
        <p>{task}</p>
      </div>

      <div className="ac-phish__mail">
        <div className="ac-phish__headers">
          {(message.headers || []).map((h) => render(h, "header"))}
        </div>
        <div className="ac-phish__bodywrap">
          {(message.body || []).map((b) => render(b, "body"))}
        </div>
      </div>

      {!readOnly && (
        <div className="ac-phish__check">
          <button className="ac-phish__btn" onClick={check}>
            Check my findings
          </button>
          <span className="ac-phish__count">
            {picked.size} part{picked.size === 1 ? "" : "s"} flagged
          </span>
          {result && (
            <p className={`ac-phish__feedback ${result.ok ? "is-ok" : "is-bad"}`} role="status">
              {result.message}
            </p>
          )}
        </div>
      )}

      {(revealed || readOnly) && verdict && (
        <p className="ac-phish__verdict">
          <i className="fas fa-gavel" aria-hidden="true" />
          {verdict}
        </p>
      )}
    </div>
  );
}
