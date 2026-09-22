import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCatalogEntry } from "../data/catalog";
import { getCourseLessons, getResumeLesson } from "../data/lessons";
import { pickContinue } from "../data/continueLearning";
import { getEnrollments } from "../services/academyService";

/**
 * "CONTINUE LEARNING" — the first thing a returning learner sees
 *
 * Renders nothing at all for a visitor who is signed out or has never
 * enrolled, so the landing page is unchanged for them.
 *
 * `onResolved` reports whether the learner has a course in progress, so the
 * page can stop offering "Enroll now" to someone it should be welcoming back.
 * It fires once the answer is known — never optimistically — because
 * flashing an onboarding button at an enrolled learner and then taking it
 * away is worse than a moment's wait.
 */
export default function ContinueLearning({ user, onResolved }) {
  const [target, setTarget] = useState(undefined); // undefined = still checking

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
        const picked = pickContinue(list, {
          getCatalogEntry,
          getCourseLessons,
          getResumeLesson,
        });
        setTarget(picked);
        onResolved?.(Boolean(picked));
      } catch {
        // A read that fails must not leave the page thinking they are new
        // and push them back through onboarding. Show nothing extra.
        if (!alive) return;
        setTarget(null);
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

  if (!user || !target) return null;

  return (
    <section className="ac-continue" aria-label="Continue learning">
      <div className="ac-continue__body">
        <span className="ac-continue__kicker">
          <i className="fas fa-rotate-right" aria-hidden="true" />
          {target.finished ? "Course complete" : "Welcome back"}
        </span>

        <h2 className="ac-continue__course">{target.title}</h2>

        <div
          className="ac-continue__bar"
          role="progressbar"
          aria-valuenow={target.percent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${target.percent}% of ${target.title} complete`}
        >
          <span style={{ width: `${target.percent}%` }} />
        </div>

        <p className="ac-continue__meta">
          <strong>{target.percent}% complete</strong>
          {target.lesson && (
            <>
              {" · "}Next: <span>{target.lesson.title}</span>
            </>
          )}
        </p>
      </div>

      <div className="ac-continue__actions">
        <Link className="ac-btn ac-btn--primary ac-btn--lg" to={target.href}>
          {target.finished ? "Review course" : "Continue learning"}
          <i className="fas fa-arrow-right" aria-hidden="true" />
        </Link>
        {target.otherCount > 0 && (
          <Link className="ac-continue__all" to="/academy/learn">
            {target.otherCount === 1
              ? "and 1 other course"
              : `and ${target.otherCount} other courses`}
          </Link>
        )}
      </div>
    </section>
  );
}
