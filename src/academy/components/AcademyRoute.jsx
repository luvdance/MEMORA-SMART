import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { ensureStudent } from "../services/academyService";

/**
 * Guard for every signed-in Academy page.
 *
 * Beyond the usual auth check it guarantees a student record exists — so
 * people who registered before the Academy launched get a Memora ID on their
 * first visit and no backfill script is ever needed.
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
        console.error("Academy: could not create student record", err);
        setError(err);
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
        <h2>We could not open your student record</h2>
        <p>
          {error?.code === "permission-denied"
            ? "The Academy security rules have not been deployed yet. Deploy firestore.rules and reload."
            : error?.message || "Something went wrong."}
        </p>
        <a className="ac-btn ac-btn--primary" href="/academy">
          Back to the Academy
        </a>
      </div>
    );
  }

  return typeof children === "function" ? children(student) : children;
}
