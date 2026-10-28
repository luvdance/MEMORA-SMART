import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import CVBuilder from "../CVBuilder";

// /admin/cv/:cvId — the CV builder in admin mode, for reviewing and
// correcting a user's saved CV. Only accounts with the `admin` custom claim
// get in; Firestore rules enforce the same claim on the actual reads/writes.
export default function AdminCVEditor() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [allowed, setAllowed] = useState(null);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      navigate("/auth", { state: { from: window.location.pathname } });
      return;
    }
    user.getIdTokenResult().then((token) => {
      if (token.claims.admin === true) setAllowed(true);
      else navigate("/dashboard");
    });
  }, [user, loading, navigate]);

  if (!allowed) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <i className="fas fa-spinner fa-spin" style={{ fontSize: "2rem", color: "#9D00FF" }}></i>
      </div>
    );
  }
  return <CVBuilder adminMode />;
}
