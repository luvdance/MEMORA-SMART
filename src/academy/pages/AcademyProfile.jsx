import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import useSEO from "../../hooks/useSEO";
import AcademyNav from "../components/AcademyNav";
import AcademyFooter from "../components/AcademyFooter";
import StudentStats from "../components/StudentStats";
import CourseRecord from "../components/CourseRecord";
import OnboardingForm from "../components/OnboardingForm";
import { ONBOARDING_FIELDS, isProfileComplete } from "../data/onboarding";
import { getCatalogEntry } from "../data/catalog";
import { getCourseLessons, getCourseOutline } from "../data/lessons";
import {
  calculateProgress,
  getAllProgress,
  getCertificates,
  getEnrollments,
  getExamAttempts,
  getStudent,
  saveProfile,
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
  // Plural. Certification is per course, so a student may hold several.
  const [certificates, setCertificates] = useState([]);
  const [examAttempts, setExamAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProfile, setEditingProfile] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileError, setProfileError] = useState(null);

  useSEO({ title: "My Profile — Memora Smart Academy" });

  useEffect(() => {
    if (!user) return;
    let alive = true;

    (async () => {
      try {
        const [record, list, certs, attempts] = await Promise.all([
          getStudent(user.uid),
          getEnrollments(user.uid),
          // Both are server-written and read-only here. A missing one is the
          // normal case for anyone who has not sat the exam, so neither is
          // allowed to fail the page load.
          getCertificates(user.uid).catch(() => []),
          getExamAttempts(user.uid).catch(() => []),
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
        setCertificates(certs);
        setExamAttempts(attempts);
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

  /* Saving re-derives chatEnabled from the age band inside saveProfile, so
     correcting the age band here is what actually turns messaging on. The
     record is re-read rather than patched locally, so what the page shows is
     what the server stored. */
  const submitProfile = async (answers) => {
    setSavingProfile(true);
    setProfileError(null);
    try {
      await saveProfile(user, answers);
      setStudent(await getStudent(user.uid));
      setEditingProfile(false);
    } catch (err) {
      // One mapping table decides what a learner is told, everywhere.
      setProfileError(reportError("saveProfile", err).message);
    } finally {
      setSavingProfile(false);
    }
  };

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

          {/* At a glance. The record-level facts, which StudentStats does not
              cover — it shows XP, level, streak and atoms. Average score used
              to appear only inside the certification line, where it was a
              footnote to a sentence about something else. */}
          {!loading && student && (
            <div className="ac-glance">
              <div className="ac-glance__item">
                <strong>{enrollments.length}</strong>
                <span>{enrollments.length === 1 ? "Course" : "Courses"}</span>
              </div>
              <div className="ac-glance__item">
                <strong>{student.lessonsCompleted || 0}</strong>
                <span>Lessons passed</span>
              </div>
              <div className="ac-glance__item">
                <strong>{averageScore === null ? "—" : `${averageScore}%`}</strong>
                <span>Average score</span>
              </div>
              <div className="ac-glance__item">
                <strong>{certificates.length}</strong>
                <span>
                  {certificates.length === 1 ? "Certificate" : "Certificates"}
                </span>
              </div>
            </div>
          )}

          {loading && (
            <div className="ac-boot ac-boot--inline">
              <i className="fas fa-spinner fa-spin" aria-hidden="true" />
              <p>Loading your record…</p>
            </div>
          )}

          {!loading && student && (
            <>
              <StudentStats student={student} />

              {/* ── MY COURSES ────────────────────────────────────────────
                   Every course the student has enrolled on, each collapsed to
                   a single summary row. Opening one shows that course's
                   journey and its own certification state.

                   Certification is rendered inside each course rather than in
                   a section of its own, because a certificate belongs to an
                   enrolment. A student on two courses has two independent
                   certification states, and one shared line could not have
                   described both. */}
              <section className="ac-learn__section">
                <h2 className="ac-learn__title">
                  My courses
                  {enrollments.length > 0 && (
                    <span className="ac-learn__count">
                      {enrollments.length}
                    </span>
                  )}
                  <Link className="ac-learn__add" to="/academy/enroll">
                    <i className="fas fa-plus" aria-hidden="true" />
                    Add a course
                  </Link>
                </h2>

                {enrollments.length === 0 ? (
                  <div className="ac-empty ac-empty--panel">
                    <i className="fas fa-graduation-cap ac-empty__icon" aria-hidden="true" />
                    <h3>No courses yet</h3>
                    <p className="ac-body">
                      Your Memora ID is ready. Enrol on a course and it appears
                      here, with your progress and your certification tracked
                      separately for each one.
                    </p>
                    <Link className="ac-btn ac-btn--primary" to="/academy/enroll">
                      Browse the courses
                    </Link>
                  </div>
                ) : (
                  <div className="ac-courses">
                    {enrollments.map((enrollment, index) => {
                      const entry = getCatalogEntry(enrollment.courseId);
                      if (!entry) return null;

                      return (
                        <CourseRecord
                          key={enrollment.courseId}
                          courseId={enrollment.courseId}
                          entry={entry}
                          lessons={getCourseLessons(enrollment.courseId)}
                          outline={getCourseOutline(enrollment.courseId)}
                          progress={progressByCourse[enrollment.courseId] || {}}
                          completedLessons={enrollment.completedLessons || []}
                          percent={calculateProgress(
                            enrollment.courseId,
                            enrollment.completedLessons || []
                          )}
                          certificate={
                            certificates.find(
                              (c) => c.courseId === enrollment.courseId
                            ) || null
                          }
                          examAttempts={examAttempts.filter(
                            (a) => a.courseId === enrollment.courseId || !a.courseId
                          )}
                          /* The most recently active course opens on arrival,
                             so the common case needs no click at all. */
                          defaultOpen={index === 0 && enrollments.length === 1}
                        />
                      );
                    })}
                  </div>
                )}
              </section>

              {/* ── YOUR DETAILS ──────────────────────────────────────────
                   Two messages elsewhere tell a learner to fix things "on
                   your profile": the chat gate, and the enrolment form's skip
                   path. Until this section existed neither was true —
                   saveProfile was reachable only from /academy/enroll/:slug,
                   and an enrolled learner is always routed to the lesson
                   player instead. Anyone who skipped the form, or who
                   enrolled before it existed, had messaging off permanently
                   with no way to correct it. */}
              <section className="ac-learn__section">
                <h2 className="ac-learn__title">Your details</h2>

                {editingProfile ? (
                  <OnboardingForm
                    mode="edit"
                    email={student?.email || user?.email}
                    displayName={student?.displayName || user?.displayName}
                    initialValues={student?.profile || null}
                    initialConsent={student?.profile?.analyticsConsent}
                    busy={savingProfile}
                    error={profileError}
                    onSubmit={submitProfile}
                    onSkip={() => {
                      setEditingProfile(false);
                      setProfileError(null);
                    }}
                  />
                ) : (
                  <div className="ac-pdetails">
                    {!isProfileComplete(student?.profile) && (
                      <p className="ac-pdetails__gap">
                        <i className="fas fa-circle-info" aria-hidden="true" />{" "}
                        Some details are missing. Until we know your age band,
                        private messaging stays off on your account.
                      </p>
                    )}

                    <dl className="ac-pdetails__list">
                      {ONBOARDING_FIELDS.map((field) => {
                        const value = student?.profile?.[field.id];
                        const shown = Array.isArray(value)
                          ? value.join(", ")
                          : value;
                        return (
                          <div key={field.id}>
                            <dt>{field.label}</dt>
                            <dd className={shown ? "" : "is-empty"}>
                              {shown || "Not given"}
                            </dd>
                          </div>
                        );
                      })}
                      <div>
                        <dt>Private messaging</dt>
                        <dd>{student?.chatEnabled === true ? "On" : "Off"}</dd>
                      </div>
                    </dl>

                    <button
                      type="button"
                      className="ac-btn ac-btn--ghost"
                      onClick={() => setEditingProfile(true)}
                    >
                      <i className="fas fa-pen" aria-hidden="true" />
                      {isProfileComplete(student?.profile)
                        ? "Edit your details"
                        : "Complete your details"}
                    </button>
                  </div>
                )}
              </section>

            </>
          )}
        </div>
      </main>

      <AcademyFooter />
    </div>
  );
}
