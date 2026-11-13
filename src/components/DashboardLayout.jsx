import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import DashboardSidebar from "./DashboardSidebar";
import DashboardMobileNav from "./DashboardMobileNav";
import { peekReturnTrip, clearReturnTrip } from "../cv-builder/utils/returnTrip";

/**
 * Someone who came here from a Memotify job (in this tab) gets a one-tap way
 * back to it on every dashboard page, so checking a CV never loses the job.
 */
function MemotifyReturn() {
  const navigate = useNavigate();
  const [trip, setTrip] = useState(peekReturnTrip);
  if (!trip) return null;
  return (
    <div className="dash-return" role="region" aria-label="Back to Memotify">
      <button type="button" className="dash-return__go" onClick={() => navigate(trip.path)}>
        <i className="fas fa-arrow-left" aria-hidden="true"></i>
        <span>Back to <strong>{trip.label}</strong> on Memotify</span>
      </button>
      <button
        type="button"
        className="dash-return__close"
        aria-label="Hide this link"
        onClick={() => { clearReturnTrip(); setTrip(null); }}
      >
        <i className="fas fa-times" aria-hidden="true"></i>
      </button>
    </div>
  );
}

export default function DashboardLayout({ children, title, subtitle }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  const initial = user?.displayName
    ? user.displayName.charAt(0).toUpperCase()
    : user?.email?.charAt(0).toUpperCase();

  return (
    <div className="dash">
      <DashboardSidebar />
      <div className="dash-main">
        {/* Top Bar */}
        <div className="dash-topbar">
          <div className="dash-topbar__left">
            <h2>{title || "Dashboard"}</h2>
            <p>{subtitle || "Welcome to your workspace"}</p>
          </div>
          <div className="dash-topbar__right">
            <button
              className="dash-topbar__home"
              onClick={() => navigate("/")}
              aria-label="Main Site"
              title="Main Site"
            >
              <i className="fas fa-home"></i>
              {/* span so the mobile rule can collapse this to an icon-only button */}
              <span>Main Site</span>
            </button>
            <div
              className="dash-topbar__avatar"
              onClick={() => navigate("/dashboard/profile")}
            >
              {user?.photoURL
                ? <img src={user.photoURL} alt="avatar" />
                : initial
              }
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="dash-content">
          <MemotifyReturn />
          {children}
        </div>
      </div>
      <DashboardMobileNav />
    </div>
  );
}