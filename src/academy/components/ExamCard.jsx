/**
 * Professional exam card.
 *
 * Shown inside the lesson player and on the profile. The point is motivational:
 * a learner who can see that this module is building toward a real, externally
 * recognised certification has a reason to keep going past the last lesson.
 *
 * It is deliberately honest that these are NOT Memora exams. We link out to
 * the provider and never imply we administer, score or sell them.
 */
export default function ExamCard({ exam, variant = "full", readiness = null }) {
  if (!exam) return null;

  return (
    <aside className={`ac-exam ac-exam--${variant}`}>
      <div className="ac-exam__head">
        <span className="ac-exam__icon" style={{ color: exam.accent }}>
          <i className={exam.icon} aria-hidden="true" />
        </span>
        <div>
          <span className="ac-exam__eyebrow">Industry certification</span>
          <h3 className="ac-exam__name">{exam.name}</h3>
          <p className="ac-exam__meta">
            <span className="ac-exam__code">{exam.code}</span>
            {exam.provider}
            {exam.edition ? ` · ${exam.edition}` : ""}
          </p>
        </div>
      </div>

      <p className="ac-exam__summary">{exam.summary}</p>

      {readiness && (
        <div className={`ac-readiness ac-readiness--${readiness.band}`}>
          <div className="ac-readiness__row">
            <span className="ac-readiness__label">Your readiness</span>
            <strong>{readiness.label}</strong>
          </div>
          <div className="ac-readiness__bar">
            <div
              className="ac-readiness__fill"
              style={{ width: `${readiness.percent}%` }}
            />
          </div>
          <p className="ac-readiness__detail">
            {readiness.modulesDone} of {readiness.modulesTotal} preparing modules
            complete
            {readiness.averageScore !== null
              ? ` · ${readiness.averageScore}% average score`
              : ""}
            .{" "}
            {readiness.heldBackByScores
              ? "Your scores are passing but thin. Retake a few assessments before booking."
              : readiness.band === "ready"
              ? "You are in good shape to book this."
              : readiness.remaining.length > 0
              ? "Finish the remaining modules to get there."
              : ""}
          </p>
        </div>
      )}

      {variant === "full" && (
        <>
          <span className="ac-note__label">What it tests</span>
          <ul className="ac-exam__list">
            {exam.validates.map((item) => (
              <li key={item}>
                <i className="fas fa-check" aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
        </>
      )}

      {exam.note && <p className="ac-exam__note">{exam.note}</p>}

      <div className="ac-exam__foot">
        <a
          className="ac-btn ac-btn--ghost"
          href={exam.url}
          target="_blank"
          rel="noopener noreferrer"
        >
          Official exam page
          <i className="fas fa-arrow-up-right-from-square" aria-hidden="true" />
        </a>
        <span className="ac-exam__disclaimer">
          Awarded by {exam.provider}, not by Memora Smart. Booked and paid for
          directly with them.
        </span>
      </div>
    </aside>
  );
}
