import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    // Save where they were trying to go
    return <Navigate to="/auth" state={{ from: location.pathname }} replace />;
  }

  return children;
}