import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import useSEO from "../../hooks/useSEO";
import AcademyNav from "../components/AcademyNav";
import AcademyFooter from "../components/AcademyFooter";
import BetaBadge from "../components/BetaBadge";
import {
  CATALOG,
  STATUS_LABELS,
  BETA_NOTE,
  getCourseStats,
} from "../data/catalog";
import {
  getAuthoredStats,
  getCourseLessons,
  getResumeLesson,
} from "../data/lessons";
import { calculateProgress, getEnrollments } from "../services/academyService";
import { startAcademyJourney } from "../services/intent";
import "../academy.css";

/** Stable empty list for the signed-out case, so memos are not invalidated. */
const EMPTY = [];

/**
 * CHOOSE A COURSE — START IT, OR CONTINUE ONE
 *
 * This page exists because "Enroll now" used to mean "enroll in Data
 * Analysis". That was fine while one course was open and wrong the moment a
 * second one is: a learner pressing a button labelled Enroll should be told
 * what they are enrolling in, not assigned it.
 *
 * THE FLOW
 *   Enroll now  →  this page  →  Start course / Continue, on the one you want
 *
 * A COURSE ALREADY BEGUN SAYS CONTINUE, not Start, and shows how far in the
 * learner is. Offering "Start course" to someone forty lessons deep implies
 * it would restart them — and Continue goes to their RESUME point, not to the
 * enrolment page, so the button does what its label says.
 *
 * THE ACTION IS ON THE CARD, deliberately. An earlier version used a radio
 * per course and one commit bar at the foot of the page, which meant choosing
 * the first course and then scrolling past ten others to press a second
 * button. One button, beside the thing it acts on, is fewer decisions and no
 * scrolling.
 *
 * THE COURSE CODE IS NOT SHOWN. Every course carries one (DA-101 and so on)
 * and the enrolment records it, but it is an internal handle — not something
 * a learner should have to read or quote. They need the course NAME; the
 * system needs the code, and it has it either way.
 *
 * COURSES THAT ARE NOT OPEN ARE STILL LISTED, and have no button. A hidden
 * course reads as a missing one, and this Academy's posture is to show the
 * real state: "In development" means being written now, "Planned" means on
 * the roadmap without a date.
 */
export default function AcademyEnrollChoose() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // null = not looked yet. The signed-out case is DERIVED rather than stored:
  // setting it inside the effect meant a synchronous setState there, which is
  // the pattern react-hooks/set-state-in-effect exists to prevent. A
  // signed-out visitor is never enrolled in anything, so the answer is known
  // without a read.
  const [fetched, setFetched] = useState(null);
  // Memoised so the empty array is a stable reference — otherwise a fresh []
  // each render invalidates the byCourse memo below on every pass.
  const enrollments = useMemo(() => (user ? fetched : EMPTY), [user, fetched]);

  useSEO({ title: "Choose your course — Memora Smart Academy" });

  useEffect(() => {
    if (!user) return;
    let alive = true;
    (async () => {
      try {
        const list = await getEnrollments(user.uid);
        if (alive) setFetched(list || []);
      } catch {
        // Treating a failed read as "no enrolments" would offer Start to
        // someone mid-course, so this is the last resort rather than the
        // first assumption.
        if (alive) setFetched([]);
      }
    })();
    return () => {
      alive = false;
    };
  }, [user]);

  // Open courses first, then in development, then planned — the order a
  // learner can actually act on.
  const ordered = useMemo(() => {
    const rank = { open: 0, next: 1, planned: 2 };
    return [...CATALOG].sort(
      (a, b) => (rank[a.status] ?? 3) - (rank[b.status] ?? 3)
    );
  }, []);

  const byCourse = useMemo(() => {
    const map = new Map();
    for (const e of enrollments || []) map.set(e.courseId, e);
    return map;
  }, [enrollments]);

  const openCount = ordered.filter((c) => c.status === "open").length;
  const startedCount = (enrollments || []).length;
  const checking = user && enrollments === null;

  return (
    <div className="academy ac-choose">
      <AcademyNav />

      <main className="ac-section">
        <div className="ac-container">
          <header className="ac-choose__head">
            <span className="ac-kicker">
              <i className="fas fa-list-check" aria-hidden="true" />
              {startedCount > 0 ? "Your courses" : "Enrollment"}
            </span>
            <h1 className="ac-h2">
              {startedCount > 0 ? "Continue, or start something new" : "Choose your course"}
            </h1>
            <p className="ac-body">
              {openCount === 1
                ? "One course is open right now. The rest are listed honestly: in development means it is being written, planned means it is on the roadmap without a date."
                : `${openCount} courses are open right now. You can take more than one — anything you have already begun shows your progress below.`}
            </p>
          </header>

          <ul className="ac-choose__list">
            {ordered.map((entry) => {
              const isOpen = entry.status === "open";
              const stats = isOpen ? getCourseStats(entry.course) : null;
              const authored = isOpen ? getAuthoredStats(entry.slug) : null;

              const enrollment = byCourse.get(entry.id) || null;
              const started = Boolean(enrollment);
              const done = enrollment?.completedLessons?.length || 0;
              const total = isOpen ? getCourseLessons(entry.slug).length : 0;
              const percent = started
                ? calculateProgress(entry.slug, enrollment.completedLessons || [])
                : 0;
              const finished = started && percent === 100;

              /* Continue goes to where they actually left off. Sending them to
                 the enrolment page instead would be a button that does not do
                 what it says. */
              const resume = started ? getResumeLesson(entry.slug, enrollment) : null;

              return (
                <li key={entry.id}>
                  <article
                    className={`ac-choose__card ${isOpen ? "" : "is-locked"} ${
                      started ? "is-started" : ""
                    }`}
                  >
                    <div className="ac-choose__body">
                      <div className="ac-choose__top">
                        {started && (
                          <span className="ac-choose__enrolled">
                            <i
                              className={finished ? "fas fa-circle-check" : "fas fa-bookmark"}
                              aria-hidden="true"
                            />
                            {finished ? "Completed" : "In progress"}
                          </span>
                        )}
                        <BetaBadge beta={entry.beta} note={BETA_NOTE} />
                        <span className={`ac-status ac-status--${entry.status}`}>
                          {STATUS_LABELS[entry.status]}
                        </span>
                      </div>

                      <h2 className="ac-choose__title">
                        <i className={entry.icon} aria-hidden="true" />
                        {entry.title}
                      </h2>
                      {entry.subtitle && (
                        <p className="ac-choose__sub">{entry.subtitle}</p>
                      )}
                      <p className="ac-choose__summary">{entry.summary}</p>

                      {/* Progress replaces the course blurb stats once there
                          is real progress to report — a learner mid-course
                          cares how far they are, not how long it is. */}
                      {started && total > 0 ? (
                        <div className="ac-choose__progress">
                          <div className="ac-choose__bar">
                            <span style={{ width: `${percent}%` }} />
                          </div>
                          <p className="ac-choose__progresstext">
                            <strong>{percent}% complete</strong> · {done} of{" "}
                            {total} lessons
                            {resume && !finished && (
                              <> · next up {resume.title}</>
                            )}
                          </p>
                        </div>
                      ) : (
                        isOpen &&
                        authored && (
                          <p className="ac-choose__stats">
                            {authored.lessons} lessons · {authored.atoms} concepts
                            {stats?.months ? ` · ${stats.months} months` : ""}
                          </p>
                        )
                      )}

                      {entry.covers?.length > 0 && (
                        <div className="ac-choose__covers">
                          {entry.covers.map((c) => (
                            <span key={c}>{c}</span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* The action, beside the course it belongs to. The slug is
                        passed explicitly, so the system records exactly this
                        course — no default and no guessing. */}
                    <div className="ac-choose__action">
                      {!isOpen ? (
                        <span className="ac-choose__locked">Not open yet</span>
                      ) : checking ? (
                        /* Never flash "Start course" at someone who is
                           mid-course; wait the moment it takes to know. */
                        <button type="button" className="ac-btn ac-btn--ghost" disabled>
                          Checking…
                        </button>
                      ) : started ? (
                        <button
                          type="button"
                          className="ac-btn ac-btn--primary"
                          onClick={() =>
                            navigate(
                              resume
                                ? `/academy/learn/${entry.slug}/${resume.id}`
                                : "/academy/learn"
                            )
                          }
                        >
                          {finished ? "Review course" : "Continue"}
                          <i className="fas fa-arrow-right" aria-hidden="true" />
                        </button>
                      ) : (
                        <button
                          type="button"
                          className="ac-btn ac-btn--primary"
                          onClick={() =>
                            startAcademyJourney(navigate, user, entry.slug)
                          }
                        >
                          Start course
                          <i className="fas fa-arrow-right" aria-hidden="true" />
                        </button>
                      )}
                    </div>
                  </article>
                </li>
              );
            })}
          </ul>

          <div className="ac-choose__foot">
            <Link className="ac-btn ac-btn--ghost" to="/academy/courses">
              Compare the courses in detail
            </Link>
            {!user && (
              <p className="ac-choose__note">
                <i className="fas fa-circle-info" aria-hidden="true" />
                You will create your account next. The course you picked is
                remembered through sign-up, so you land straight on it.
              </p>
            )}
          </div>
        </div>
      </main>

      <AcademyFooter />
    </div>
  );
}
