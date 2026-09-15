import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import useSEO from "../../hooks/useSEO";
import AcademyNav from "../components/AcademyNav";
import AcademyFooter from "../components/AcademyFooter";
import StudentStats from "../components/StudentStats";
import { getCatalogEntry } from "../data/catalog";
import { getCourseLessons, getCourseOutline } from "../data/lessons";
import {
  calculateProgress,
  getAllProgress,
  getEnrollments,
  getStudent,
} from "../services/academyService";
import "../academy.css";

/**
 * STUDENT PROFILE
 *
 * The academic record: who you are, your Memora ID, and exactly what you have
 * proved. Everything here is read from real progress documents — nothing is
 * estimated or padded, so a blank profile honestly looks blank.
 */
export default function AcademyProfile() {
  const { user } = useAuth();

  const [student, setStudent] = useState(null);
  const [enrollments, setEnrollments] = useState([]);
  const [progressByCourse, setProgressByCourse] = useState({});
  const [loading, setLoading] = useState(true);

  useSEO({ title: "My Profile — Memora Smart Academy" });

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

  const joined = useMemo(() => {
    const raw = student?.joinedAt;
    if (!raw) return null;
    const date = raw.toDate ? raw.toDate() : new Date(raw);
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }, [student]);

  const initial = (student?.displayName || user?.displayName || user?.email || "S")
    .charAt(0)
    .toUpperCase();

  const averageScore = useMemo(() => {
    const scores = [];
    for (const lessons of Object.values(progressByCourse)) {
      for (const lesson of Object.values(lessons)) {
        if (typeof lesson.assessment?.bestScore === "number") {
          scores.push(lesson.assessment.bestScore);
        }
      }
    }
    if (!scores.length) return null;
    return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
  }, [progressByCourse]);

  return (
    <div className="academy">
      <AcademyNav />

      <main className="ac-section">
        <div className="ac-container">
          {/* ── IDENTITY ── */}
          <header className="ac-profile__head">
            <div className="ac-profile__avatar">
              {user?.photoURL ? (
                <img src={user.photoURL} alt="" />
              ) : (
                <span>{initial}</span>
              )}
            </div>

            <div className="ac-profile__identity">
              <span className="ac-kicker">Student profile</span>
              <h1 className="ac-h2">
                {student?.displayName || user?.displayName || "Your profile"}
              </h1>
              <p className="ac-profile__email">{student?.email || user?.email}</p>
            </div>

            <div className="ac-profile__idcard">
              <span>Memora ID</span>
              <strong className="ac-mono">{student?.memoraId || "—"}</strong>
              {joined && <em>Joined {joined}</em>}
            </div>
          </header>

          {loading && (
            <div className="ac-boot ac-boot--inline">
              <i className="fas fa-spinner fa-spin" aria-hidden="true" />
              <p>Loading your record…</p>
            </div>
          )}

          {!loading && student && (
            <>
              <StudentStats student={student} />

              {/* ── PER-COURSE RECORD ── */}
              <section className="ac-learn__section">
                <h2 className="ac-learn__title">Course record</h2>

                {enrollments.length === 0 && (
                  <div className="ac-empty ac-empty--panel">
                    <p className="ac-body">
                      You are not enrolled on any course yet.
                    </p>
                    <Link className="ac-btn ac-btn--primary" to="/academy#courses">
                      Browse the courses
                    </Link>
                  </div>
                )}

                {enrollments.map((enrollment) => {
                  const entry = getCatalogEntry(enrollment.courseId);
                  if (!entry) return null;

                  const lessons = getCourseLessons(enrollment.courseId);
                  const outline = getCourseOutline(enrollment.courseId);
                  const progress = progressByCourse[enrollment.courseId] || {};
                  const completed = enrollment.completedLessons || [];
                  const percent = calculateProgress(enrollment.courseId, completed);

                  return (
                    <article className="ac-record" key={enrollment.courseId}>
                      <div className="ac-record__head">
                        <div>
                          <h3>{entry.title}</h3>
                          <p>{entry.subtitle}</p>
                        </div>
                        <div className="ac-record__percent">
                          <strong>{percent}%</strong>
                          <span>
                            {completed.length} of {lessons.length} lessons
                          </span>
                        </div>
                      </div>

                      <div className="ac-resume__bar">
                        <div
                          className="ac-resume__fill"
                          style={{ width: `${percent}%` }}
                        />
                      </div>

                      <table className="ac-record__table">
                        <thead>
                          <tr>
                            <th>Lesson</th>
                            <th>Atoms</th>
                            <th>Attempts</th>
                            <th>Best score</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {lessons.map((lesson) => {
                            const p = progress[lesson.id];
                            const atoms = p?.atomsCompleted?.length || 0;
                            const a = p?.assessment;
                            const status = a?.passed
                              ? "Passed"
                              : a?.attempts
                              ? "Not yet passed"
                              : atoms > 0
                              ? "In progress"
                              : "Not started";

                            return (
                              <tr key={lesson.id}>
                                <td>
                                  <Link
                                    to={`/academy/learn/${enrollment.courseId}/${lesson.id}`}
                                  >
                                    {lesson.title}
                                  </Link>
                                  <em>{lesson.moduleTitle}</em>
                                </td>
                                <td>
                                  {atoms}/{lesson.atoms.length}
                                </td>
                                <td>{a?.attempts || 0}</td>
                                <td>
                                  {typeof a?.bestScore === "number"
                                    ? `${a.bestScore}%`
                                    : "—"}
                                </td>
                                <td>
                                  <span
                                    className={`ac-recordstatus ac-recordstatus--${status
                                      .toLowerCase()
                                      .replace(/[^a-z]+/g, "-")}`}
                                  >
                                    {status}
                                  </span>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>

                      {/* Modules still being authored, stated plainly */}
                      {outline.some((m) => m.modules.some((mod) => !mod.ready)) && (
                        <p className="ac-record__pending">
                          <i className="fas fa-circle-info" aria-hidden="true" />
                          Later modules of this programme are still being written.
                          Your progress is measured against the lessons published
                          so far.
                        </p>
                      )}
                    </article>
                  );
                })}
              </section>

              {/* ── CERTIFICATE STATUS ── */}
              <section className="ac-learn__section">
                <h2 className="ac-learn__title">Certification</h2>
                <div className="ac-certstatus">
                  <i className="fas fa-certificate" aria-hidden="true" />
                  <div>
                    <strong>Not yet eligible</strong>
                    <p>
                      A certificate is issued once every required lesson is
                      complete, every assessment is passed, and the capstone is
                      submitted.
                      {averageScore !== null && (
                        <> Your average assessment score so far is {averageScore}%.</>
                      )}
                    </p>
                  </div>
                </div>
              </section>
            </>
          )}
        </div>
      </main>

      <AcademyFooter />
    </div>
  );
}
