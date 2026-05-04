import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/memora logo.PNG";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 900) setMenuOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  const handleAppsClick = (e) => {
    e.preventDefault();
    navigate(user ? "/dashboard" : "/auth");
  };

  const handleMobileAppsClick = (e) => {
    e.preventDefault();
    closeMenu();
    navigate(user ? "/dashboard" : "/auth");
  };

  return (
    <>
      <nav className="navbar">
        <div className="nav-container">
          <Link to="/" className="logo" style={{ textDecoration: "none" }}>
            <img src={logo} alt="Memora" />
            <h2>
              MEMORA
              <span className="tech">smart technologies</span>
            </h2>
          </Link>

          <ul className="nav-links">
            <li><a href="#services">Services</a></li>
            <li><a href="#projects">Projects</a></li>
            <li><a href="#about">About</a></li>
            <li><a href="/" onClick={handleAppsClick}>Apps</a></li>
          </ul>

          <div className="nav-auth">
            {user ? (
              <Link to="/dashboard" className="signup-btn">
                <i className="fas fa-user"></i>
                Dashboard
              </Link>
            ) : (
              <>
                <Link to="/auth" className="login-btn">Login</Link>
                <Link to="/auth" className="signup-btn">
                  <i className="fas fa-user-plus"></i>
                  Sign Up
                </Link>
              </>
            )}
          </div>

          <button className="nav-hamburger" onClick={() => setMenuOpen(true)} aria-label="Open menu">
            <i className="fas fa-bars"></i>
          </button>
        </div>
      </nav>

      <div className={`mobile-menu ${menuOpen ? "open" : ""}`}>
        <button className="mobile-menu-close" onClick={closeMenu} aria-label="Close menu">
          <i className="fas fa-times"></i>
        </button>

        <a href="#services" onClick={closeMenu}>Services</a>
        <a href="#projects" onClick={closeMenu}>Projects</a>
        <a href="#about" onClick={closeMenu}>About</a>
        <a href="/" onClick={handleMobileAppsClick}>Apps</a>

        <div className="mobile-menu-auth">
          {user ? (
            <Link to="/dashboard" className="mobile-menu-dashboard" onClick={closeMenu}>
              <i className="fas fa-user"></i>
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link to="/auth" className="mobile-menu-signup" onClick={closeMenu}>
                <i className="fas fa-user-plus"></i>
                Create Account
              </Link>
              <Link to="/auth" className="mobile-menu-login" onClick={closeMenu}>
                Login
              </Link>
            </>
          )}
        </div>
      </div>
    </>
  );
}