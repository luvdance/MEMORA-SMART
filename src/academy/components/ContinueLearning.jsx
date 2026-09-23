import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCatalogEntry } from "../data/catalog";
import { getCourseLessons, getResumeLesson } from "../data/lessons";
import { listEnrollments } from "../data/enrollment";
import { getEnrollments } from "../services/academyService";

/**
 * "CONTINUE LEARNING" — the first thing a returning learner sees
 *
 * Renders nothing at all for a visitor who is signed out or has never
 * enrolled, so the landing page is unchanged for them.
 *
 * ── ONE COURSE, OR SEVERAL ───────────────────────────────────────────────
 * A student may hold any number of enrolments, and the component behaves
 * differently depending on how many:
 *
 *   one course     the button goes straight into it. Asking somebody to pick
 *                  from a list of one is a pointless extra click.
 *
 *   several        the button OPENS THE LIST. Every course they have started
 *                  is shown with its own progress and its own continue
 *                  action, and they choose.
 *
 * It used to resolve to a single course and offer "and 2 other courses" as a
 * footnote linking away to another page. That guessed on the learner's behalf
 * and then hid the alternatives behind a navigation, which is the wrong way
 * round: when the answer is genuinely ambiguous, ask.
 *
 * The most recently active course is still listed first, so the common case
 * of carrying on with what you were doing is one click away either way.
 *
 * `onResolved` reports whether the learner has a course in progress, so the
 * page can stop offering "Enroll now" to someone it should be welcoming back.
 * It fires once the answer is known — never optimistically — because flashing
 * an onboarding button at an enrolled learner and then taking it away is worse
 * than a moment's wait.
 */
export default function ContinueLearning({ user, onResolved }) {
  // undefined = still checking, [] = checked and none
  const [courses, setCourses] = useState(undefined);
  const [picking, setPicking] = useState(false);

  useEffect(() => {
    if (!user) {
      onResolved?.(false);
      return;
    }
    let alive = true;
    // Back to "checking" if the learner signs in while on the page, so the
    // hero hides "Enroll now" until it knows.
    onResolved?.(null);

    (async () => {
      try {
        const list = await getEnrollments(user.uid);
        if (!alive) return;
        const resolved = listEnrollments(list, {
          getCatalogEntry,
          getCourseLessons,
          getResumeLesson,
        });
        setCourses(resolved);
        onResolved?.(resolved.length > 0);
      } catch {
        // A read that fails must not leave the page thinking they are new and
        // push them back through onboarding. Show nothing extra, say nothing
        // about why — there is no action for them to take here.
        if (!alive) return;
        setCourses([]);
        onResolved?.(false);
      }
    })();

    return () => {
      alive = false;
    };
    // onResolved is a callback from the page; re-running on its identity
    // would refetch on every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  if (!user || !courses?.length) return null;

  const [primary] = courses;
  const several = courses.length > 1;

  return (
    <section className="ac-continue" aria-label="Continue learning">
      <div className="ac-continue__body">
        <span className="ac-continue__kicker">
          <i className="fas fa-rotate-right" aria-hidden="true" />
          {several
            ? `Welcome back · ${courses.length} courses`
            : primary.finished
            ? "Course complete"
            : "Welcome back"}
        </span>

        {/* With several courses the heading names the student's position
            rather than one course, because no single course is "the" one
            until they say so. */}
        <h2 className="ac-continue__course">
          {several ? "Pick up where you left off" : primary.title}
        </h2>

        {!several && (
          <>
            <div
              className="ac-continue__bar"
              role="progressbar"
              aria-valuenow={primary.percent}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`${primary.percent}% of ${primary.title} complete`}
            >
              <span style={{ width: `${primary.percent}%` }} />
            </div>

            <p className="ac-continue__meta">
              <strong>{primary.percent}% complete</strong>
              {primary.lesson && (
                <>
                  {" · "}Next: <span>{primary.lesson.title}</span>
                </>
              )}
            </p>
          </>
        )}

        {several && (
          <p className="ac-continue__meta">
            You are enrolled on {courses.length} courses. Choose the one you want
            to carry on with.
          </p>
        )}
      </div>

      <div className="ac-continue__actions">
        {several ? (
          <button
            className="ac-btn ac-btn--primary ac-btn--lg"
            onClick={() => setPicking((open) => !open)}
            aria-expanded={picking}
            aria-controls="ac-continue-courses"
          >
            {picking ? "Hide my courses" : "Continue learning"}
            <i
              className={`fas fa-chevron-${picking ? "up" : "down"}`}
              aria-hidden="true"
            />
          </button>
        ) : (
          <Link className="ac-btn ac-btn--primary ac-btn--lg" to={primary.href}>
            {primary.finished
              ? "Review course"
              : primary.started
              ? "Continue learning"
              : "Start learning"}
            <i className="fas fa-arrow-right" aria-hidden="true" />
          </Link>
        )}
      </div>

      {/* The picker. Rendered only when there is a real choice to make. */}
      {several && picking && (
        <ul className="ac-continue__list" id="ac-continue-courses">
          {courses.map((course) => (
            <li key={course.slug} className="ac-continue__item">
              <div className="ac-continue__itemhead">
                {course.icon && (
                  <i className={`${course.icon} ac-continue__itemicon`} aria-hidden="true" />
                )}
                <div>
                  <h3 className="ac-continue__itemtitle">{course.title}</h3>
                  <p className="ac-continue__itemmeta">
                    {course.finished
                      ? "Complete"
                      : course.started
                      ? `${course.completedCount} of ${course.totalLessons} lessons`
                      : "Not started yet"}
                    {course.lesson && !course.finished && (
                      <>
                        {" · "}Next: <span>{course.lesson.title}</span>
                      </>
                    )}
                  </p>
                </div>
              </div>

              <div
                className="ac-continue__bar ac-continue__bar--sm"
                role="progressbar"
                aria-valuenow={course.percent}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`${course.percent}% of ${course.title} complete`}
              >
                <span style={{ width: `${course.percent}%` }} />
              </div>

              <div className="ac-continue__itemactions">
                <span className="ac-continue__percent">{course.percent}%</span>
                <Link className="ac-btn ac-btn--primary" to={course.href}>
                  {course.finished
                    ? "Review"
                    : course.started
                    ? "Continue"
                    : "Start"}
                  <i className="fas fa-arrow-right" aria-hidden="true" />
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
