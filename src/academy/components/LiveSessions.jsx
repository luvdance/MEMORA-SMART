import {
  formatSessionTime,
  getPastSessions,
  getSessionState,
  getUpcomingSessions,
} from "../data/liveSessions";

/**
 * Scheduled live classes.
 *
 * Shows a real empty state when nothing is scheduled rather than inventing a
 * timetable. Times render in the learner's own timezone, because "6pm" means
 * nothing without knowing whose 6pm.
 */
export default function LiveSessions({ courseId = null, compact = false }) {
  const upcoming = getUpcomingSessions(courseId);
  const past = compact ? [] : getPastSessions(courseId);

  if (upcoming.length === 0 && past.length === 0) {
    return (
      <div className="ac-live ac-live--empty">
        <i className="fas fa-video" aria-hidden="true" />
        <div>
          <strong>No live class scheduled right now</strong>
          <p>
            Live sessions run alongside the lessons for questions and worked
            examples. When one is booked it appears here, with the time shown in
            your own timezone.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="ac-live">
      {upcoming.map((session) => {
        const when = formatSessionTime(session);
        const state = getSessionState(session);

        return (
          <article className={`ac-live__item is-${state}`} key={session.id}>
            <div className="ac-live__when">
              <span className="ac-live__date">{when.date}</span>
              <strong>{when.time}</strong>
              <em>{when.relative}</em>
            </div>

            <div className="ac-live__body">
              {state === "live" && (
                <span className="ac-live__badge">
                  <span className="ac-live__dot" aria-hidden="true" />
                  Live now
                </span>
              )}
              <h3>{session.title}</h3>
              <p>{session.summary}</p>
              <span className="ac-live__host">
                <i className="fas fa-user" aria-hidden="true" />
                {session.host} · {session.minutes} min
              </span>
            </div>

            <div className="ac-live__action">
              {session.joinUrl ? (
                <a
                  className={`ac-btn ${state === "live" ? "ac-btn--primary" : "ac-btn--ghost"}`}
                  href={session.joinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {state === "live" ? "Join now" : "Join link"}
                </a>
              ) : (
                <span className="ac-live__pending">Link sent before the class</span>
              )}
            </div>
          </article>
        );
      })}

      {past.length > 0 && (
        <>
          <span className="ac-note__label">Recordings</span>
          {past.map((session) => (
            <article className="ac-live__item is-ended" key={session.id}>
              <div className="ac-live__when">
                <span className="ac-live__date">
                  {formatSessionTime(session).date}
                </span>
              </div>
              <div className="ac-live__body">
                <h3>{session.title}</h3>
                <p>{session.summary}</p>
              </div>
              <div className="ac-live__action">
                <a
                  className="ac-btn ac-btn--ghost"
                  href={session.recordingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Watch recording
                </a>
              </div>
            </article>
          ))}
        </>
      )}
    </div>
  );
}
