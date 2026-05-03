import logo from "../assets/memora logo.PNG";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleApps = () => {
    if (user) {
      navigate("/dashboard");
    } else {
      navigate("/auth", { state: { from: "/dashboard" } });
    }
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        
        {/* Logo */}
        <div className="logo">
          <img src={logo} alt="memora logo" />
          <h2>Memora Smart <span className="tech">Technologies...</span></h2>
        </div>
        {/* Center Links */}
        <ul className="nav-links">
          <li><a href="#">Home</a></li>
          <li><a href="#">Academy</a></li>
          <li><a href="#">Projects</a></li>
          <li><a onClick={handleApps} style={{ cursor: "pointer" }}>Apps</a></li>
          <li><a href="#about">About Us</a></li>
        </ul>
        {/* Right Auth Buttons */}
        <div className="nav-auth">
          {user ? (
            <>
              <span className="login-btn">
                Hi, {user.displayName || user.email}
              </span>
              <button className="signup-btn" onClick={logout}>
                <i className="fas fa-sign-out-alt"></i>
                <span>Log Out</span>
              </button>
            </>
          ) : (
            <>
              <a className="login-btn" onClick={() => navigate("/auth")} style={{ cursor: "pointer" }}>
                Login
              </a>
              <a className="signup-btn" onClick={() => navigate("/auth")} style={{ cursor: "pointer" }}>
                <i className="fas fa-plus"></i>
                <span>Signup</span>
              </a>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
export default Navbar;