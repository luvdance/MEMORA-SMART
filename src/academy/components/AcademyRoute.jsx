import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { ensureStudent } from "../services/academyService";
import { ERROR_CODES, reportError } from "../services/errors";

/**
 * Guard for every signed-in Academy page.
 *
 * ── THIS IS THE SIGN-UP STEP ─────────────────────────────────────────────
 * Beyond the usual auth check it guarantees the Student entity exists, with a
 * Memora ID, for anybody who reaches any signed-in Academy page. That is what
 * makes sign-up a separate thing from enrolment: you become a student by
 * arriving, not by committing to a course.
 *
 * It also means people who registered before the Academy launched are given a
 * Memora ID on their first visit, so no backfill script is ever needed.
 *
 * Enrolment is a different operation entirely — see data/enrollment.js.
 */
export default function AcademyRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();
  const [student, setStudent] = useState(null);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) return;
    let alive = true;

    ensureStudent(user)
      .then((record) => {
        if (!alive) return;
        setStudent(record);
        setStatus("ready");
      })
      .catch((err) => {
        if (!alive) return;
        // The real error goes to the console; only the safe shape reaches
        // state, so there is no path by which it can be rendered.
        setError(reportError("ensureStudent", err, ERROR_CODES.NO_STUDENT_RECORD));
        setStatus("error");
      });

    return () => {
      alive = false;
    };
  }, [user]);

  // `idle` covers the frame between the user arriving and the effect running,
  // so there is no flash of the signed-out state.
  if (loading || (user && (status === "idle" || status === "loading"))) {
    return (
      <div className="academy ac-boot">
        <i className="fas fa-spinner fa-spin" aria-hidden="true" />
        <p>Loading your Academy…</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" state={{ from: location.pathname }} replace />;
  }

  if (status === "error") {
    return (
      <div className="academy ac-boot ac-boot--error">
        <i className="fas fa-triangle-exclamation" aria-hidden="true" />
        <h2>{error?.title}</h2>
        <p>{error?.message}</p>
        <div className="ac-boot__actions">
          {error?.canRetry && (
            <button
              className="ac-btn ac-btn--primary"
              onClick={() => window.location.reload()}
            >
              Try again
            </button>
          )}
          <a className="ac-btn ac-btn--ghost" href="/academy">
            Back to the Academy
          </a>
        </div>
        {/* The internal code, for support. Meaningless to an attacker and the
            one thing that makes a help request answerable. */}
        <span className="ac-boot__code">Reference {error?.code}</span>
      </div>
    );
  }

  return typeof children === "function" ? children(student) : children;
}
