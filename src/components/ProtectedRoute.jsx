import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";


// Anyone created BEFORE this date is grandfathered (no verification required)
const VERIFICATION_ENFORCEMENT_DATE = new Date("2026-05-08T00:00:00Z").getTime();

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        flexDirection: "column",
        gap: "12px",
        fontFamily: "'Neulis', 'Raleway', sans-serif"
      }}>
        <i className="fas fa-spinner fa-spin" style={{ fontSize: "2rem", color: "#9D00FF" }}></i>
        <p style={{ color: "#888" }}>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" state={{ from: location.pathname }} replace />;
  }

  // Grandfathering: existing users skip verification check
  const userCreatedAt = user.metadata?.creationTime
    ? new Date(user.metadata.creationTime).getTime()
    : 0;
  const isExistingUser = userCreatedAt < VERIFICATION_ENFORCEMENT_DATE;

  // Block only NEW unverified users
  if (!user.emailVerified && !isExistingUser) {
    return <Navigate to="/auth" state={{ from: location.pathname }} replace />;
  }

  return children;
}