import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import DashboardSidebar from "./DashboardSidebar";
import DashboardMobileNav from "./DashboardMobileNav";

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
            <button className="dash-topbar__home" onClick={() => navigate("/")}>
              <i className="fas fa-home"></i> Main Site
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
          {children}
        </div>
      </div>
      <DashboardMobileNav />
    </div>
  );
}