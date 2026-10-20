import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getTypingSummary } from "./progress.js";
import { LESSONS, nextLesson } from "./curriculum.js";

/**
 * The Typing Dojo as it appears on My Learning and the profile: the learner's
 * typing level, verified speed and the next lesson, one click from resuming.
 */
export default function TypingDojoCard({ uid, variant = "dashboard" }) {
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    if (!uid) return;
    let alive = true;
    getTypingSummary(uid)
      .then((s) => alive && setSummary(s))
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [uid]);

  const next = summary ? nextLesson(summary.lessons) : LESSONS[0];
  const started = summary && summary.sessions > 0;
  const to = next ? `/academy/typing?view=lesson&lesson=${next.id}` : "/academy/typing?view=test";

  return (
    <section className={`ty-dojocard ty-dojocard--${variant}`}>
      <span className="ty-dojocard__icon" aria-hidden="true">
        <i className="fas fa-keyboard" />
      </span>
      <div className="ty-dojocard__body">
        <span className="ty-dojocard__eyebrow">Typing Dojo</span>
        {started ? (
          <>
            <h3>
              Level {summary.level.level} · {summary.level.title}
            </h3>
            <p>
              {Math.round(summary.bestVerifiedWpm)} WPM verified ({summary.tier.name}) · {summary.lessonsPassed}/{LESSONS.length} lessons ·{" "}
              {summary.achievements} achievements
            </p>
          </>
        ) : (
          <>
            <h3>Learn to type without looking</h3>
            <p>Every course here is faster when your fingers know the keyboard. Lessons, speed tests and arcade games, with music.</p>
          </>
        )}
      </div>
      <div className="ty-dojocard__actions">
        <Link className="ac-btn ac-btn--primary" to={to}>
          {started ? (next ? "Continue" : "Speed test") : "Start typing"} <i className="fas fa-arrow-right" aria-hidden="true" />
        </Link>
        <Link className="ac-btn ac-btn--ghost" to="/academy/typing?view=arcade">
          <i className="fas fa-gamepad" aria-hidden="true" /> Arcade
        </Link>
      </div>
    </section>
  );
}
