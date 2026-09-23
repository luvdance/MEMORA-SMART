import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import AcademyNav from "../components/AcademyNav";
import AcademyFooter from "../components/AcademyFooter";
import { getCatalogEntry } from "../data/catalog";
import { getCourseLessons, getAuthoredStats } from "../data/lessons";
import {
  enroll,
  getEnrollment,
  getStudent,
  saveProfile,
} from "../services/academyService";
import { ERROR_CODES, reportError, toUserError } from "../services/errors";
import { isProfileComplete } from "../data/onboarding";
import OnboardingForm from "../components/OnboardingForm";
import "../academy.css";

/**
 * ENROLMENT
 *
 * ── WHAT THIS PAGE IS AND IS NOT ─────────────────────────────────────────
 * This page enrols an EXISTING student on ONE course. It does not sign anybody
 * up. By the time it renders, AcademyRoute has already guaranteed the Student
 * entity exists with a Memora ID, because that is the sign-up step and it
 * happens on arrival at any signed-in Academy page.
 *
 * That split matters for the second enrolment. Previously this page created
 * the student as a side effect of enrolling and announced it, so a learner
 * taking their second course was told their Memora ID was being issued — a
 * thing that had already happened months earlier. Now the identity is shown
 * as what it is: something they already have, which every course they take
 * and every certificate they earn hangs off.
 *
 * ── ORDER OF OPERATIONS ──────────────────────────────────────────────────
 * Enrolment commits FIRST, then the profile questions, and deliberately so:
 * putting a form between a learner and the course they just asked for is how
 * you lose them, and closing the tab halfway through the form should leave
 * them enrolled rather than stranded.
 *
 * The profile step belongs to the STUDENT, not to the enrolment, so it is
 * asked once ever. A learner enrolling on their second course goes straight
 * to the confirmation.
 */
export default function AcademyEnroll() {
  const { slug } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const entry = getCatalogEntry(slug);
  const lessons = getCourseLessons(slug);
  const stats = getAuthoredStats(slug);

  const [student, setStudent] = useState(null);
  const [status, setStatus] = useState("working");
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState(null);
  // Distinguishes "welcome to your first course" from "you are on another
  // one". Without it the second enrolment reads like the first.
  const [returning, setReturning] = useState(false);

  useEffect(() => {
    if (!user || !entry) return;
    let alive = true;

    (async () => {
      try {
        // Was this course already theirs? Asked before enrolling, because
        // enroll() is idempotent and would otherwise hide the difference.
        const already = await getEnrollment(user.uid, slug);

        await enroll(user, slug);
        const record = await getStudent(user.uid);
        if (!alive) return;

        setStudent(record);
        setReturning(Boolean(already));
        setStatus(isProfileComplete(record?.profile) ? "ready" : "profile");
      } catch (err) {
        if (!alive) return;
        setError(reportError("enroll", err));
        setStatus("error");
      }
    })();

    return () => {
      alive = false;
    };
  }, [user, slug, entry]);

  const submitProfile = async (answers) => {
    setSaving(true);
    setFormError(null);
    try {
      await saveProfile(user, answers);
      const record = await getStudent(user.uid);
      setStudent(record);
      setStatus("ready");
    } catch (err) {
      // They are already enrolled, so a failure here must never look like a
      // failed enrolment. The message says so explicitly, and says nothing
      // about why the write failed.
      const safe = reportError("saveProfile", err);
      setFormError(
        safe.code === ERROR_CODES.USERNAME_TAKEN
          ? safe.message
          : "You are enrolled, and your details did not save. Try again, or skip and finish this from your profile later."
      );
    } finally {
      setSaving(false);
    }
  };

  if (!entry) {
    const missing = toUserError(null, ERROR_CODES.NOT_FOUND);
    return (
      <div className="academy">
        <AcademyNav />
        <main className="ac-section">
          <div className="ac-container ac-empty">
            <h1 className="ac-h2">{missing.title}</h1>
            <p className="ac-body">{missing.message}</p>
            <a className="ac-btn ac-btn--primary" href="/academy#courses">
              See the courses
            </a>
          </div>
        </main>
        <AcademyFooter />
      </div>
    );
  }

  const first = lessons[0];
  const firstName =
    (student?.displayName || user?.displayName || "").split(" ")[0] || "student";

  return (
    <div className="academy">
      <AcademyNav />

      <main className="ac-section">
        <div className="ac-container ac-welcome">
          {status === "working" && (
            <div className="ac-welcome__card">
              <i className="fas fa-spinner fa-spin ac-welcome__spinner" aria-hidden="true" />
              <h1>Setting up your place…</h1>
              {/* Says only what is happening: a course is being added to an
                  account that already exists. */}
              <p>Adding {entry.title} to your courses.</p>
            </div>
          )}

          {status === "error" && (
            <div className="ac-welcome__card">
              <i className="fas fa-triangle-exclamation ac-welcome__spinner" aria-hidden="true" />
              <h1>{error?.title}</h1>
              <p>{error?.message}</p>
              <div className="ac-welcome__actions">
                {error?.canRetry && (
                  <button
                    className="ac-btn ac-btn--primary"
                    onClick={() => window.location.reload()}
                  >
                    Try again
                  </button>
                )}
                <button
                  className="ac-btn ac-btn--ghost"
                  onClick={() => navigate("/academy/courses")}
                >
                  See the courses
                </button>
              </div>
              <span className="ac-welcome__code">Reference {error?.code}</span>
            </div>
          )}

          {/* Enrolled, and we have not met them yet. A STUDENT-level step,
              asked once ever, not once per course. */}
          {status === "profile" && (
            <OnboardingForm
              email={student?.email || user?.email}
              displayName={student?.displayName || user?.displayName}
              busy={saving}
              error={formError}
              onSubmit={submitProfile}
              onSkip={() => setStatus("ready")}
            />
          )}

          {status === "ready" && (
            <div className="ac-welcome__card">
              <span className="ac-kicker">
                {returning ? "Already enrolled" : "You are enrolled"}
              </span>
              <h1>
                {returning
                  ? `${entry.title} is waiting for you, ${firstName}.`
                  : `You are on ${entry.title}, ${firstName}.`}
              </h1>

              <div className="ac-idcard">
                <span className="ac-idcard__label">Your Memora ID</span>
                <strong className="ac-mono ac-idcard__value">
                  {student?.memoraId || "—"}
                </strong>
                <span className="ac-idcard__note">
                  Yours permanently, across every course you take. Each course is
                  tracked separately under it, and each certificate you earn names
                  the course it was earned on.
                </span>
              </div>

              <div className="ac-welcome__course">
                <h2>{entry.title}</h2>
                <p>{entry.subtitle}</p>
                <div className="ac-welcome__stats">
                  <span>
                    <strong>{stats.lessons}</strong> lessons ready
                  </span>
                  <span>
                    <strong>{stats.atoms}</strong> atoms
                  </span>
                  <span>
                    <strong>~{stats.minutes}</strong> min
                  </span>
                </div>
              </div>

              <ul className="ac-welcome__how">
                <li>
                  <i className="fas fa-cube" aria-hidden="true" />
                  Lessons break into atoms — one concept at a time
                </li>
                <li>
                  <i className="fas fa-clipboard-check" aria-hidden="true" />
                  A short check closes every lesson. 70% to pass
                </li>
                <li>
                  <i className="fas fa-rotate-left" aria-hidden="true" />
                  Retry as often as you need. Failing costs you nothing
                </li>
              </ul>

              <button
                className="ac-btn ac-btn--primary ac-btn--lg ac-btn--block"
                onClick={() =>
                  first
                    ? navigate(`/academy/learn/${slug}/${first.id}`)
                    : navigate("/academy/learn")
                }
              >
                {first
                  ? returning
                    ? "Back to the course"
                    : "Start your first lesson"
                  : "Go to My Learning"}
                <i className="fas fa-arrow-right" aria-hidden="true" />
              </button>

              <button
                className="ac-welcome__browse"
                onClick={() => navigate("/academy/courses")}
              >
                Or take another course as well
              </button>
            </div>
          )}
        </div>
      </main>

      <AcademyFooter />
    </div>
  );
}
