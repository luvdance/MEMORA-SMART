import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import AcademyNav from "../components/AcademyNav";
import AcademyFooter from "../components/AcademyFooter";
import { getCatalogEntry } from "../data/catalog";
import { getCourseLessons, getAuthoredStats } from "../data/lessons";
import { enroll, getStudent, saveProfile } from "../services/academyService";
import { isProfileComplete } from "../data/onboarding";
import OnboardingForm from "../components/OnboardingForm";
import "../academy.css";

/**
 * Enrollment + welcome.
 *
 * The one moment the Memora ID is presented properly. Most platforms drop you
 * straight into lesson one; showing the learner they now have a permanent
 * academic identity is what makes this feel like an institution rather than a
 * video library.
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

  /**
   * Enrolment happens FIRST, then the questions.
   *
   * Deliberately that order. Putting a form between a learner and the course
   * they just asked for is how you lose them, and if they close the tab
   * halfway through the form they should still be enrolled rather than
   * stranded. So the enrolment is committed immediately and the profile step
   * is shown afterwards — skippable, and offered again next time.
   */
  useEffect(() => {
    if (!user || !entry) return;
    let alive = true;

    (async () => {
      try {
        await enroll(user, slug);
        const record = await getStudent(user.uid);
        if (!alive) return;
        setStudent(record);
        setStatus(isProfileComplete(record?.profile) ? "ready" : "profile");
      } catch (err) {
        if (!alive) return;
        console.error("Enrollment failed", err);
        setError(err);
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
    } catch {
      // They are already enrolled, so a failure here must not look like a
      // failed enrolment. Let them retry or skip.
      setFormError(
        "Your details could not be saved, but you are enrolled. Try again, or skip and do it from your profile."
      );
    } finally {
      setSaving(false);
    }
  };

  if (!entry) {
    return (
      <div className="academy">
        <AcademyNav />
        <main className="ac-section">
          <div className="ac-container ac-empty">
            <h1 className="ac-h2">That course does not exist</h1>
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

  return (
    <div className="academy">
      <AcademyNav />

      <main className="ac-section">
        <div className="ac-container ac-welcome">
          {status === "working" && (
            <div className="ac-welcome__card">
              <i className="fas fa-spinner fa-spin ac-welcome__spinner" aria-hidden="true" />
              <h1>Setting up your place…</h1>
              <p>Issuing your Memora ID and enrolling you on {entry.title}.</p>
            </div>
          )}

          {status === "error" && (
            <div className="ac-welcome__card">
              <i className="fas fa-triangle-exclamation ac-welcome__spinner" aria-hidden="true" />
              <h1>We could not complete your enrollment</h1>
              <p>
                {error?.code === "permission-denied"
                  ? "The Academy security rules have not been deployed yet. Deploy firestore.rules and try again."
                  : error?.message}
              </p>
              <button className="ac-btn ac-btn--ghost" onClick={() => window.location.reload()}>
                Try again
              </button>
            </div>
          )}

          {/* Enrolled, but we have not met them yet. */}
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
              <span className="ac-kicker">Welcome to the Academy</span>
              <h1>
                Welcome,{" "}
                {(student?.displayName || user?.displayName || "").split(" ")[0] ||
                  "student"}
                .
              </h1>

              <div className="ac-idcard">
                <span className="ac-idcard__label">Your Memora ID</span>
                <strong className="ac-mono ac-idcard__value">
                  {student?.memoraId || "—"}
                </strong>
                <span className="ac-idcard__note">
                  This is yours permanently. It identifies you on every course you
                  take and on every certificate you earn.
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
                {first ? "Start your first lesson" : "Go to My Learning"}
                <i className="fas fa-arrow-right" aria-hidden="true" />
              </button>
            </div>
          )}
        </div>
      </main>

      <AcademyFooter />
    </div>
  );
}
