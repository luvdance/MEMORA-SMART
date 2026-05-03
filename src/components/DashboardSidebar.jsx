import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/memora logo.PNG";

const navItems = [
  { label: "Overview", icon: "fas fa-th-large", path: "/dashboard" },
  { label: "My Works", icon: "fas fa-folder-open", path: "/dashboard/my-works" },
];

const apps = [
  { label: "CV Builder", icon: "fas fa-file-alt", path: "/dashboard/cv-builder", tag: "Live" },
  { label: "Website Builder", icon: "fas fa-laptop-code", path: "/dashboard/web-builder", tag: "Soon" },
  { label: "Mobile App Builder", icon: "fas fa-mobile-alt", path: "/dashboard/app-builder", tag: "Soon" },
  { label: "Data Analysis", icon: "fas fa-chart-line", path: "/dashboard/data-analysis", tag: "Soon" },
  { label: "AI Automation", icon: "fas fa-robot", path: "/dashboard/ai-automation", tag: "Soon" },
];

const account = [
  { label: "Profile", icon: "fas fa-user", path: "/dashboard/profile" },
  { label: "Settings", icon: "fas fa-cog", path: "/dashboard/settings" },
];

export default function DashboardSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const isActive = (path) => location.pathname === path;

  const initial = user?.displayName
    ? user.displayName.charAt(0).toUpperCase()
    : user?.email?.charAt(0).toUpperCase();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <aside className="dash-sidebar">
      {/* Brand */}
      <div className="dash-sidebar__brand">
        <div className="dash-sidebar__brand-icon">
          <img src ={logo}/>
        </div>
        <div className="dash-sidebar__brand-text">
          <h3>Memora</h3>
          <span>Smart Technologies</span>
        </div>
      </div>

      {/* User */}
      <div className="dash-sidebar__user">
        <div className="dash-sidebar__avatar">
          {user?.photoURL
            ? <img src={user.photoURL} alt="avatar" />
            : initial
          }
        </div>
        <div className="dash-sidebar__user-info">
          <h4>{user?.displayName || "User"}</h4>
          <span>Free Account</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="dash-sidebar__nav">
        {/* Main */}
        <div className="dash-sidebar__section-label">Main</div>
        {navItems.map((item) => (
          <button
            key={item.path}
            className={`dash-sidebar__link ${isActive(item.path) ? "dash-sidebar__link--active" : ""}`}
            onClick={() => navigate(item.path)}
          >
            <i className={item.icon}></i>
            <span>{item.label}</span>
          </button>
        ))}

        {/* Apps */}
        <div className="dash-sidebar__section-label">Apps</div>
        {apps.map((item) => (
          <button
            key={item.path}
            className={`dash-sidebar__link ${isActive(item.path) ? "dash-sidebar__link--active" : ""}`}
            onClick={() => item.tag !== "Soon" && navigate(item.path)}
          >
            <i className={item.icon}></i>
            <span>{item.label}</span>
            <span className={`dash-sidebar__badge ${item.tag === "Soon" ? "dash-sidebar__badge--soon" : ""}`}>
              {item.tag}
            </span>
          </button>
        ))}

        {/* Account */}
        <div className="dash-sidebar__section-label">Account</div>
        {account.map((item) => (
          <button
            key={item.path}
            className={`dash-sidebar__link ${isActive(item.path) ? "dash-sidebar__link--active" : ""}`}
            onClick={() => navigate(item.path)}
          >
            <i className={item.icon}></i>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Bottom */}
      <div className="dash-sidebar__bottom">
        <button className="dash-sidebar__link" onClick={() => navigate("/")}>
          <i className="fas fa-home"></i>
          <span>Main Site</span>
        </button>
        <button className="dash-sidebar__logout" onClick={handleLogout}>
          <i className="fas fa-sign-out-alt"></i>
          <span>Log Out</span>
        </button>
      </div>
    </aside>
  );
}