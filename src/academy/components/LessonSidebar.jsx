import { Link } from "react-router-dom";

/**
 * Curriculum tree.
 *
 * Shows the whole course, not just what is written — a learner should be able
 * to see where they are going. Modules still being authored are marked as such
 * instead of being hidden, because a hidden module reads as a missing one.
 */
export default function LessonSidebar({
  outline,
  slug,
  currentLessonId,
  progressMap,
  open,
  onClose,
}) {
  return (
    <>
      <aside className={`ac-curric ${open ? "is-open" : ""}`}>
        <div className="ac-curric__top">
          <strong>Curriculum</strong>
          <button onClick={onClose} aria-label="Close curriculum">
            <i className="fas fa-xmark" aria-hidden="true" />
          </button>
        </div>

        <div className="ac-curric__scroll">
          {outline.map((month) => (
            <section key={month.month} className="ac-curric__month">
              <h3>
                <span>Month {month.month}</span>
                {month.title}
              </h3>

              {month.modules.map((module) => (
                <div
                  key={module.id}
                  className={`ac-curric__module ${module.ready ? "" : "is-pending"}`}
                >
                  <h4>
                    {module.title}
                    {!module.ready && <em>Being written</em>}
                  </h4>

                  {module.ready ? (
                    <ul>
                      {module.lessons.map((lesson) => {
                        const progress = progressMap?.[lesson.id];
                        const passed = progress?.assessment?.passed;
                        const started = (progress?.atomsCompleted?.length || 0) > 0;
                        const current = lesson.id === currentLessonId;

                        return (
                          <li key={lesson.id}>
                            <Link
                              to={`/academy/learn/${slug}/${lesson.id}`}
                              className={`ac-curric__lesson ${
                                current ? "is-current" : ""
                              } ${passed ? "is-done" : ""}`}
                              onClick={onClose}
                            >
                              <i
                                className={
                                  passed
                                    ? "fas fa-circle-check"
                                    : started
                                    ? "fas fa-circle-half-stroke"
                                    : "far fa-circle"
                                }
                                aria-hidden="true"
                              />
                              <span>
                                {lesson.title}
                                <em>
                                  {lesson.atomCount} atoms · {lesson.estimatedMinutes} min
                                </em>
                              </span>
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  ) : (
                    <p className="ac-curric__planned">
                      {module.plannedAtoms} atoms planned
                    </p>
                  )}
                </div>
              ))}
            </section>
          ))}
        </div>
      </aside>

      {open && <div className="ac-curric__scrim" onClick={onClose} />}
    </>
  );
}
