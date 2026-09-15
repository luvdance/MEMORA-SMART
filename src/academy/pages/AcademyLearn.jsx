import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import useSEO from "../../hooks/useSEO";
import AcademyNav from "../components/AcademyNav";
import AcademyFooter from "../components/AcademyFooter";
import StudentStats from "../components/StudentStats";
import LiveSessions from "../components/LiveSessions";
import { CATALOG, getCatalogEntry } from "../data/catalog";
import { getCourseLessons, getResumeLesson } from "../data/lessons";
import {
  calculateProgress,
  getAllProgress,
  getEnrollments,
  getStudent,
} from "../services/academyService";
import "../academy.css";

/**
 * MY LEARNING
 *
 * This page answers one question before anything else: what do I do right now.
 * Most academy homes open with a grid of course cards and leave the learner to
 * find their own place again — which is exactly where returning students drop
 * off. The resume card is the entire design.
 */
export default function AcademyLearn() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [student, setStudent] = useState(null);
  const [enrollments, setEnrollments] = useState([]);
  const [progressByCourse, setProgressByCourse] = useState({});
  const [loading, setLoading] = useState(true);

  useSEO({ title: "My Learning — Memora Smart Academy" });

  useEffect(() => {
    if (!user) return;
    let alive = true;

    (async () => {
      try {
        const [record, list] = await Promise.all([
          getStudent(user.uid),
          getEnrollments(user.uid),
        ]);
        if (!alive) return;

        const progress = {};
        for (const enrollment of list) {
          progress[enrollment.courseId] = await getAllProgress(
            user.uid,
            enrollment.courseId
          );
        }
        if (!alive) return;

        setStudent(record);
        setEnrollments(list);
        setProgressByCourse(progress);
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [user]);

  // The single most recently active enrollment drives the resume card
  const active = useMemo(() => {
    if (!enrollments.length) return null;
    const enrollment = enrollments[0];
    const entry = getCatalogEntry(enrollment.courseId);
    if (!entry) return null;

    const lessons = getCourseLessons(enrollment.courseId);
    const completed = enrollment.completedLessons || [];
    const lesson = getResumeLesson(enrollment.courseId, enrollment);

    const lessonProgress = lesson
      ? progressByCourse[enrollment.courseId]?.[lesson.id]
      : null;

    return {
      enrollment,
      entry,
      lesson,
      percent: calculateProgress(enrollment.courseId, completed),
      atomsDone: lessonProgress?.atomsCompleted?.length || 0,
      totalLessons: lessons.length,
      completedCount: completed.length,
      finished: !lesson,
    };
  }, [enrollments, progressByCourse]);

  const firstName =
    (student?.displayName || user?.displayName || "").split(" ")[0] || "there";

  const openCourses = CATALOG.filter((c) => c.status === "open");
  const notEnrolled = openCourses.filter(
    (c) => !enrollments.some((e) => e.courseId === c.slug)
  );

  return (
    <div className="academy">
      <AcademyNav />

      <main className="ac-section ac-section--learn">
        <div className="ac-container">
          <header className="ac-learn__head">
            <div>
              <span className="ac-kicker">My Learning</span>
              <h1 className="ac-h2">Welcome back, {firstName}.</h1>
            </div>
            {student?.memoraId && (
              <Link to="/academy/profile" className="ac-learn__id">
                <span>Memora ID</span>
                <strong className="ac-mono">{student.memoraId}</strong>
              </Link>
            )}
          </header>

          {loading && (
            <div className="ac-boot ac-boot--inline">
              <i className="fas fa-spinner fa-spin" aria-hidden="true" />
              <p>Loading your progress…</p>
            </div>
          )}

          {!loading && (
            <>
              {/* ── RESUME ── */}
              {active && !active.finished && active.lesson && (
                <section className="ac-resume">
                  <div className="ac-resume__body">
                    <span className="ac-resume__eyebrow">
                      Continue where you left off
                    </span>
                    <h2>{active.entry.title}</h2>
                    <p className="ac-resume__crumb">
                      {active.lesson.monthTitle} › {active.lesson.moduleTitle} ›{" "}
                      <strong>{active.lesson.title}</strong>
                    </p>

                    <div className="ac-resume__bar">
                      <div
                        className="ac-resume__fill"
                        style={{ width: `${active.percent}%` }}
                      />
                    </div>
                    <p className="ac-resume__meta">
                      {active.percent}% complete · {active.completedCount} of{" "}
                      {active.totalLessons} lessons ·{" "}
                      {active.atomsDone > 0
                        ? `atom ${active.atomsDone + 1} of ${active.lesson.atoms.length}`
                        : `${active.lesson.atoms.length} atoms · ~${active.lesson.estimatedMinutes} min`}
                    </p>
                  </div>

                  <button
                    className="ac-btn ac-btn--light ac-btn--lg"
                    onClick={() =>
                      navigate(
                        `/academy/learn/${active.entry.slug}/${active.lesson.id}`
                      )
                    }
                  >
                    Continue
                    <i className="fas fa-arrow-right" aria-hidden="true" />
                  </button>
                </section>
              )}

              {/* ── ALL WRITTEN CONTENT FINISHED ── */}
              {active && active.finished && (
                <section className="ac-resume ac-resume--done">
                  <div className="ac-resume__body">
                    <span className="ac-resume__eyebrow">Up to date</span>
                    <h2>You have finished every lesson written so far</h2>
                    <p className="ac-resume__crumb">
                      {active.completedCount} of {active.totalLessons} lessons in{" "}
                      {active.entry.title}. More modules are being written — your
                      progress is saved and waiting.
                    </p>
                  </div>
                  <Link className="ac-btn ac-btn--light ac-btn--lg" to="/academy/profile">
                    See your progress
                  </Link>
                </section>
              )}

              {/* ── NOT ENROLLED YET ── */}
              {!active && (
                <section className="ac-resume ac-resume--empty">
                  <div className="ac-resume__body">
                    <span className="ac-resume__eyebrow">Get started</span>
                    <h2>Choose your first course</h2>
                    <p className="ac-resume__crumb">
                      You have a Memora ID and no enrollment yet. Pick a course
                      below and your first lesson opens immediately.
                    </p>
                  </div>
                </section>
              )}

              {/* ── STATS ── */}
              {student && <StudentStats student={student} />}

              {/* ── LIVE CLASSES ── */}
              <section className="ac-learn__section">
                <h2 className="ac-learn__title">Live classes</h2>
                <LiveSessions />
              </section>

              {/* ── ENROLLED COURSES ── */}
              {enrollments.length > 0 && (
                <section className="ac-learn__section">
                  <h2 className="ac-learn__title">Your courses</h2>
                  <div className="ac-mycourses">
                    {enrollments.map((enrollment) => {
                      const entry = getCatalogEntry(enrollment.courseId);
                      if (!entry) return null;
                      const percent = calculateProgress(
                        enrollment.courseId,
                        enrollment.completedLessons || []
                      );
                      return (
                        <article className="ac-mycourse" key={enrollment.courseId}>
                          <div className="ac-mycourse__ring" data-percent={percent}>
                            <svg viewBox="0 0 44 44" aria-hidden="true">
                              <circle cx="22" cy="22" r="19" className="ac-ring__track" />
                              <circle
                                cx="22"
                                cy="22"
                                r="19"
                                className="ac-ring__value"
                                style={{
                                  strokeDasharray: `${(percent / 100) * 119.4} 119.4`,
                                }}
                              />
                            </svg>
                            <span>{percent}%</span>
                          </div>
                          <div className="ac-mycourse__body">
                            <h3>{entry.title}</h3>
                            <p>
                              {(enrollment.completedLessons || []).length} of{" "}
                              {getCourseLessons(enrollment.courseId).length} lessons
                              complete
                            </p>
                          </div>
                          <button
                            className="ac-btn ac-btn--ghost"
                            onClick={() => {
                              const target = getResumeLesson(
                                enrollment.courseId,
                                enrollment
                              );
                              navigate(
                                target
                                  ? `/academy/learn/${enrollment.courseId}/${target.id}`
                                  : `/academy/profile`
                              );
                            }}
                          >
                            {percent === 100 ? "Review" : "Resume"}
                          </button>
                        </article>
                      );
                    })}
                  </div>
                </section>
              )}

              {/* ── AVAILABLE COURSES ── */}
              {notEnrolled.length > 0 && (
                <section className="ac-learn__section">
                  <h2 className="ac-learn__title">
                    {enrollments.length ? "Also available" : "Open courses"}
                  </h2>
                  <div className="ac-catalog">
                    {notEnrolled.map((entry) => (
                      <article className="ac-cc ac-cc--open" key={entry.id}>
                        <div className="ac-cc__top">
                          <span className="ac-cc__icon">
                            <i className={entry.icon} aria-hidden="true" />
                          </span>
                          <span className="ac-status ac-status--open">Open now</span>
                        </div>
                        <h3 className="ac-cc__title">{entry.title}</h3>
                        <p className="ac-cc__subtitle">{entry.subtitle}</p>
                        <p className="ac-cc__summary">{entry.summary}</p>
                        <button
                          className="ac-btn ac-btn--primary ac-cc__cta"
                          onClick={() => navigate(`/academy/enroll/${entry.slug}`)}
                        >
                          Enroll and start
                          <i className="fas fa-arrow-right" aria-hidden="true" />
                        </button>
                      </article>
                    ))}
                  </div>
                </section>
              )}
            </>
          )}
        </div>
      </main>

      <AcademyFooter />
    </div>
  );
}
