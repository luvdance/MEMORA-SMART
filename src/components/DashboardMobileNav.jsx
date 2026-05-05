import { useNavigate, useLocation, Link } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

export default function DashboardMobileNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    if (!window.confirm("Are you sure you want to logout?")) return;
    try {
      await signOut(auth);
      navigate("/");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const isActive = (path) => {
    if (path === "/dashboard") {
      return location.pathname === "/dashboard" || location.pathname === "/dashboard/";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="dash-mobile-nav">

      <Link
        to="/dashboard"
        className={`dash-mobile-nav__item ${
          location.pathname === "/dashboard" || location.pathname === "/dashboard/"
            ? "dash-mobile-nav__item--active"
            : ""
        }`}
      >
        <i className="fas fa-home"></i>
        <span>Home</span>
      </Link>

      <Link
        to="/dashboard/my-works"
        className={`dash-mobile-nav__item ${isActive("/dashboard/my-works") ? "dash-mobile-nav__item--active" : ""}`}
      >
        <i className="fas fa-folder-open"></i>
        <span>My Works</span>
      </Link>

      <Link
        to="/dashboard/cv-builder"
        className={`dash-mobile-nav__item ${isActive("/dashboard/cv-builder") ? "dash-mobile-nav__item--active" : ""}`}
      >
        <i className="fas fa-file-alt"></i>
        <span>CV Builder</span>
      </Link>

      <Link
        to="/dashboard/profile"
        className={`dash-mobile-nav__item ${isActive("/dashboard/profile") ? "dash-mobile-nav__item--active" : ""}`}
      >
        <i className="fas fa-user"></i>
        <span>Profile</span>
      </Link>

      <button
        className="dash-mobile-nav__item dash-mobile-nav__item--logout"
        onClick={handleLogout}
      >
        <i className="fas fa-sign-out-alt"></i>
        <span>Logout</span>
      </button>

    </nav>
  );
}