import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./AuthPage.css";

const perks = [
  { icon: "fas fa-file-alt", title: "CV Builder", desc: "Create, save and manage professional CVs anytime." },
  { icon: "fas fa-laptop-code", title: "Web Projects", desc: "Track and manage your web development projects." },
  { icon: "fas fa-robot", title: "AI Tools", desc: "Access all AI-powered tools with one account." },
  { icon: "fas fa-cloud", title: "Cloud Storage", desc: "All your work saved securely in the cloud." },
];

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Go back to where they came from or home
  const from = location.state?.from || "/dashboard";

  const handleSubmit = async () => {
    setError("");
    setLoading(true);
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register(name, email, password);
      }
      navigate(from, { replace: true });
    } catch (err) {
      setError(
        err.code === "auth/user-not-found" ? "No account found with this email." :
        err.code === "auth/wrong-password" ? "Incorrect password." :
        err.code === "auth/email-already-in-use" ? "An account with this email already exists." :
        err.code === "auth/weak-password" ? "Password should be at least 6 characters." :
        "Something went wrong. Please try again."
      );
    }
    setLoading(false);
  };

  return (
    <div className="auth">
      {/* LEFT — PERKS */}
      <div className="auth__left">
        <div className="auth__left-content">
          <div className="auth__logo" onClick={() => navigate("/")}>
            <i className="fas fa-long-arrow-alt-left"></i>
            <span>Back to Home</span>
          </div>
          <h1>One Account.<br /><span className="auth__gradient-text">All Our Tools.</span></h1>
          <p>Create a free account and unlock access to everything we offer — CV builder, AI tools, project tracking and more.</p>
          <div className="auth__perks">
            {perks.map((p, i) => (
              <div className="auth__perk" key={i}>
                <div className="auth__perk-icon">
                  <i className={p.icon}></i>
                </div>
                <div>
                  <h4>{p.title}</h4>
                  <p>{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT — FORM */}
      <div className="auth__right">
        <div className="auth__form-box">
          <h2>{isLogin ? "Welcome Back" : "Create Account"}</h2>
          <p className="auth__form-sub">
            {isLogin ? "Log in to access your account and tools." : "Sign up free and start building today."}
          </p>

          {/* TOGGLE */}
          <div className="auth__toggle">
            <button
              className={`auth__toggle-btn ${isLogin ? "auth__toggle-btn--active" : ""}`}
              onClick={() => setIsLogin(true)}
            >
              Log In
            </button>
            <button
              className={`auth__toggle-btn ${!isLogin ? "auth__toggle-btn--active" : ""}`}
              onClick={() => setIsLogin(false)}
            >
              Sign Up
            </button>
          </div>

          {/* FIELDS */}
          <div className="auth__fields">
            {!isLogin && (
              <div className="auth__field">
                <label>Full Name</label>
                <div className="auth__input-wrap">
                  <i className="fas fa-user"></i>
                  <input
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>
            )}
            <div className="auth__field">
              <label>Email Address</label>
              <div className="auth__input-wrap">
                <i className="fas fa-envelope"></i>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            <div className="auth__field">
              <label>Password</label>
              <div className="auth__input-wrap">
                <i className="fas fa-lock"></i>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
          </div>

          {error && (
            <div className="auth__error">
              <i className="fas fa-exclamation-circle"></i> {error}
            </div>
          )}

          <button
            className="auth__submit"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <><i className="fas fa-spinner fa-spin"></i> Please wait...</>
            ) : isLogin ? (
              <><i className="fas fa-sign-in-alt"></i> Log In</>
            ) : (
              <><i className="fas fa-user-plus"></i> Create Account</>
            )}
          </button>

          <p className="auth__switch">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <span onClick={() => setIsLogin(!isLogin)}>
              {isLogin ? "Sign Up" : "Log In"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}