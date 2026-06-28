import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import TemplateGallery from "./TemplateGallery";
import "../CVBuilder.css";

const features = [
  { icon: "fas fa-magic", title: "AI-Powered Writing", desc: "Let Claude AI write your summary, objectives and job responsibilities for you in seconds." },
  { icon: "fas fa-bolt", title: "Free ATS Score Checker", desc: "Find out if your CV passes recruiter software — and get an AI rewrite of the weak parts." },
  { icon: "fas fa-paint-brush", title: "9 Pro Templates", desc: "Classic Pro, Modern Edge, Executive Plus, Minimal Clean, Creative Side, Corporate Bold, Traditional Profile, Editorial Modern, Modern Timeline." },
  { icon: "fas fa-palette", title: "Full Customization", desc: "Accent colors, fonts, spacing, section order — make it truly yours." },
  { icon: "fas fa-file-pdf", title: "PDF Export", desc: "Download a print-ready A4 PDF of your CV instantly with one click." },
  { icon: "fas fa-save", title: "Save & Retrieve", desc: "Create an account to save your CV to the cloud and update it anytime." },
];

export default function CVLanding() {
  const navigate = useNavigate();
  const { user, logout, register } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleBuildCV = () => {
    if (user) {
      navigate("/dashboard/cv-builder");
    } else {
      navigate("/auth", { state: { from: "/dashboard/cv-builder" } });
    }
  };

  const handleSelectTemplate = () => {
    // Templates are picked inside the builder; just route them there
    handleBuildCV();
  };

  const handleCreateAccount = () => {
    if (user) {
      navigate("/dashboard");
    } else {
      navigate("/auth", { state: { from: "/dashboard" } });
    }
  };

  const handleLogin = () => {
    if (user) {
      navigate("/dashboard");
    } else {
      navigate("/auth", { state: { from: "/dashboard" } });
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const handleRegister = async () => {
    setError("");
    if (!name || !email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setLoading(true);
    try {
      await register(name, email, password);
      setSuccess(true);
      setTimeout(() => navigate("/dashboard/cv-builder"), 1500);
    } catch (err) {
      setError(
        err.code === "auth/email-already-in-use" ? "An account with this email already exists." :
        err.code === "auth/weak-password" ? "Password should be at least 6 characters." :
        err.code === "auth/invalid-email" ? "Please enter a valid email address." :
        "Something went wrong. Please try again."
      );
    }
    setLoading(false);
  };

  return (
    <div className="cvl">

      {/* SVG GRADIENT DEFS */}
      <svg width="0" height="0" style={{ position: "absolute" }}>
        <defs>
          <linearGradient id="atsGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#22c55e" />
            <stop offset="100%" stopColor="#4ade80" />
          </linearGradient>
        </defs>
      </svg>

      {/* NAVBAR */}
<nav className="cvl__nav">
  <div className="cvl__nav-left">
    <div className="cvl__nav-links">
      <a href="#templates">Templates</a>
      <a href="#features">Features</a>
      <a href="#how">How it Works</a>
    </div>
  </div>

  <div className="cvl__nav-right">
    <button
      className="cvl__nav-ats-link"
      onClick={() => navigate("/ats-check")}
    >
      <i className="fas fa-bolt"></i>
      <span>Free ATS Check</span>
    </button>

    {user ? (
      <div className="cvl__nav-user">
        <button className="cvl__btn-primary cvl__btn-sm" onClick={handleBuildCV}>
          Build CV <i className="fas fa-arrow-right"></i>
        </button>

        <div className="cvl__nav-account">
          <button
            className="cvl__nav-account-trigger"
            onClick={() => setShowAccountMenu(!showAccountMenu)}
          >
            <span className="cvl__nav-avatar">
              {(user.displayName || user.email || "U").charAt(0).toUpperCase()}
            </span>
            <i className={`fas fa-chevron-down cvl__nav-chevron ${showAccountMenu ? "cvl__nav-chevron--open" : ""}`}></i>
          </button>

          {showAccountMenu && (
            <>
              <div className="cvl__nav-account-backdrop" onClick={() => setShowAccountMenu(false)} />
              <div className="cvl__nav-account-menu">
                <div className="cvl__nav-account-name">
                  {user.displayName || user.email}
                </div>
                <button onClick={() => { setShowAccountMenu(false); navigate("/dashboard"); }}>
                  <i className="fas fa-th-large"></i> Dashboard
                </button>
                <button onClick={() => { setShowAccountMenu(false); handleLogout(); }} className="cvl__nav-account-danger">
                  <i className="fas fa-sign-out-alt"></i> Log Out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    ) : (
      <div className="cvl__nav-auth">
        <button className="cvl__btn-text" onClick={handleLogin}>Log In</button>
        <button className="cvl__btn-primary cvl__btn-sm" onClick={handleCreateAccount}>
          Sign Up <i className="fas fa-arrow-right"></i>
        </button>
      </div>
    )}
  </div>
</nav>

      {/* HERO */}
      <section className="cvl__hero">
        <div className="cvl__hero-overlay"></div>
        <div className="cvl__hero-content">
          <div className="cvl__hero-badge">
            <i className="fas fa-magic"></i> AI-Powered CV Builder
          </div>
          <h1>
            Build a <span className="cvl__gradient-text">Professional CV</span><br />
            in Minutes
          </h1>
          <p>
            Create stunning, recruiter-ready CVs with the help of AI. Choose from 9 real
            templates you can preview below, customize your colors, and download a perfect
            PDF — all in one place.
          </p>
          <div className="cvl__hero-btns">
            <button className="cvl__btn-primary cvl__btn-lg" onClick={handleBuildCV}>
              <i className="fas fa-file-alt"></i>
              {user ? "Go to CV Builder" : "Build My CV Now"}
            </button>
            <button className="cvl__btn-outline cvl__btn-lg" onClick={() => document.getElementById("templates")?.scrollIntoView({ behavior: "smooth" })}>
              <i className="fas fa-eye"></i>
              See the Templates
            </button>
          </div>
          <div className="cvl__hero-stats">
            <div className="cvl__stat"><span>Modern</span><p>Templates</p></div>
            <div className="cvl__stat-divider"></div>
            <div className="cvl__stat"><span>AI</span><p>Powered Writing</p></div>
            <div className="cvl__stat-divider"></div>
            <div className="cvl__stat"><span>Free</span><p>ATS Score Check</p></div>
          </div>
        </div>
        <div className="cvl__hero-visual">
          <div className="cvl__cv-mockup">
            <div className="cvl__mockup-header"></div>
            <div className="cvl__mockup-line cvl__mockup-line--title"></div>
            <div className="cvl__mockup-line cvl__mockup-line--sub"></div>
            <div className="cvl__mockup-section">
              <div className="cvl__mockup-label"></div>
              <div className="cvl__mockup-line"></div>
              <div className="cvl__mockup-line cvl__mockup-line--short"></div>
            </div>
            <div className="cvl__mockup-section">
              <div className="cvl__mockup-label"></div>
              <div className="cvl__mockup-line"></div>
              <div className="cvl__mockup-line"></div>
              <div className="cvl__mockup-line cvl__mockup-line--short"></div>
            </div>
            <div className="cvl__mockup-skills">
              <div className="cvl__mockup-skill"></div>
              <div className="cvl__mockup-skill"></div>
              <div className="cvl__mockup-skill"></div>
            </div>
          </div>
          <div className="cvl__badge cvl__badge--ai">
            <i className="fas fa-magic"></i> AI Writing
          </div>
          <div className="cvl__badge cvl__badge--pdf">
            <i className="fas fa-file-pdf"></i> PDF Ready
          </div>
          <div className="cvl__badge cvl__badge--templates">
            <i className="fas fa-paint-brush"></i> 9 Templates
          </div>
        </div>
      </section>

      {/* ATS SCORE CTA */}
      <section className="cvl__ats-cta">
        <div className="cvl__ats-cta-inner">
          <div className="cvl__ats-cta-content">
            <span className="cvl__ats-badge">
              <i className="fas fa-bolt"></i> NEW · 100% FREE
            </span>
            <h2>
              Is your CV <span className="cvl__gradient-text">invisible</span> to recruiters?
            </h2>
            <p>
              <strong>75% of Nigerian companies</strong> use Applicant Tracking Systems.
              Your CV gets filtered by software <strong>before</strong> a human ever sees it.
              Find out your ATS score in 10 seconds — then let AI rewrite the weak parts for you.
            </p>
            <div className="cvl__ats-features">
              <div className="cvl__ats-feature">
                <i className="fas fa-check"></i> Upload PDF, DOCX, or paste text
              </div>
              <div className="cvl__ats-feature">
                <i className="fas fa-check"></i> Score 0-100 with detailed breakdown
              </div>
              <div className="cvl__ats-feature">
                <i className="fas fa-check"></i> AI rewrites weak sections automatically
              </div>
              <div className="cvl__ats-feature">
                <i className="fas fa-check"></i> No signup required to check your score
              </div>
            </div>
            <button
              className="cvl__ats-btn"
              onClick={() => navigate("/ats-check")}
            >
              <i className="fas fa-bolt"></i> Check My ATS Score Free
              <i className="fas fa-arrow-right" style={{ marginLeft: 4 }}></i>
            </button>
            <p className="cvl__ats-trust">
              <i className="fas fa-lock"></i> Your CV is analyzed once and never stored
            </p>
          </div>

          <div className="cvl__ats-visual">
            <div className="cvl__ats-gauge">
              <svg viewBox="0 0 200 200">
                <circle cx="100" cy="100" r="85" className="cvl__ats-gauge-bg" />
                <circle cx="100" cy="100" r="85" className="cvl__ats-gauge-fill" />
              </svg>
              <div className="cvl__ats-gauge-center">
                <div className="cvl__ats-gauge-score">87</div>
                <div className="cvl__ats-gauge-label">ATS Score</div>
              </div>
            </div>
            <div className="cvl__ats-tag cvl__ats-tag--good">
              <i className="fas fa-check-circle"></i> ATS Friendly
            </div>
            <div className="cvl__ats-tag cvl__ats-tag--metric">
              <i className="fas fa-chart-line"></i> Strong Keywords
            </div>
          </div>
        </div>
      </section>

      {/* TEMPLATE GALLERY — REAL PREVIEWS */}
      <section className="cvl__gallery" id="templates">
        <div className="cvl__section-label">See Before You Sign Up</div>
        <h2>9 Real Templates — <span className="cvl__gradient-text">No Guesswork</span></h2>
        <p className="cvl__section-sub">
          These are the actual templates in the builder, rendered live with sample data.
          Click any preview to see it full-size before you commit.
        </p>
        <TemplateGallery onSelectTemplate={handleSelectTemplate} />
      </section>

      {/* FEATURES */}
      <section className="cvl__features" id="features">
        <div className="cvl__section-label">What You Get</div>
        <h2>Everything You Need to <span className="cvl__gradient-text">Stand Out</span></h2>
        <p className="cvl__section-sub">Our CV builder is packed with smart features to help you land your next opportunity.</p>
        <div className="cvl__features-grid">
          {features.map((f, i) => (
            <div className="cvl__feature-card" key={i}>
              <div className="cvl__feature-icon">
                <i className={f.icon}></i>
              </div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="cvl__how" id="how">
        <div className="cvl__section-label">Simple Process</div>
        <h2>How It <span className="cvl__gradient-text">Works</span></h2>
        <div className="cvl__steps">
          {[
            { num: "01", icon: "fas fa-bolt", title: "Check Your ATS Score", desc: "Upload your current CV (or skip this) to see exactly what's holding you back — free, no signup." },
            { num: "02", icon: "fas fa-paint-brush", title: "Pick a Template", desc: "Choose from 9 professional designs, previewed live, and customize your accent color." },
            { num: "03", icon: "fas fa-magic", title: "Let AI Fill It In", desc: "Use AI to write summaries, objectives and job responsibilities — or optimize your whole CV in one click." },
            { num: "04", icon: "fas fa-download", title: "Download PDF", desc: "Export a polished, print-ready PDF with one click." },
          ].map((s, i) => (
            <div className="cvl__step" key={i}>
              <div className="cvl__step-num">{s.num}</div>
              <div className="cvl__step-icon"><i className={s.icon}></i></div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* REGISTER CTA */}
      {!user ? (
        <section className="cvl__register">
          <div className="cvl__register-content">
            <h2>Save Your CV to the Cloud</h2>
            <p>Create a free account to store your CV, retrieve it anytime, and keep it updated as you grow in your career.</p>

            <div className="cvl__register-form">
              <input
                type="text"
                placeholder="Full Name"
                className="cvl__input"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <input
                type="email"
                placeholder="Email Address"
                className="cvl__input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="password"
                placeholder="Password (min 6 characters)"
                className="cvl__input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              {error && (
                <div style={{
                  background: "#fff1f1", border: "1px solid #fca5a5", color: "#dc2626",
                  padding: "10px 14px", borderRadius: "10px", fontSize: "0.82rem",
                  display: "flex", alignItems: "center", gap: "8px",
                }}>
                  <i className="fas fa-exclamation-circle"></i> {error}
                </div>
              )}

              {success && (
                <div style={{
                  background: "#f0fdf4", border: "1px solid #86efac", color: "#16a34a",
                  padding: "10px 14px", borderRadius: "10px", fontSize: "0.82rem",
                  display: "flex", alignItems: "center", gap: "8px",
                }}>
                  <i className="fas fa-check-circle"></i> Account created! Redirecting to CV Builder...
                </div>
              )}

              <button
                className="cvl__btn-primary cvl__btn-lg"
                onClick={handleRegister}
                disabled={loading}
                style={{ opacity: loading ? 0.7 : 1, cursor: loading ? "not-allowed" : "pointer" }}
              >
                {loading ? (
                  <><i className="fas fa-spinner fa-spin"></i> Creating Account...</>
                ) : (
                  <><i className="fas fa-user-plus"></i> Create Free Account</>
                )}
              </button>
            </div>

            <p className="cvl__register-skip">
              Already have an account?{" "}
              <span onClick={handleLogin}>Log in here →</span>
            </p>
            <p className="cvl__register-skip">
              Just want to try it?{" "}
              <span onClick={handleBuildCV}>Skip and build without saving →</span>
            </p>
          </div>
        </section>
      ) : (
        <section className="cvl__register">
          <div className="cvl__register-content">
            <h2>You're All Set, <span className="cvl__gradient-text">{user.displayName || "Friend"}!</span></h2>
            <p>Your account is ready. Jump into the CV builder or manage your work from your dashboard.</p>
            <div style={{ display: "flex", gap: "14px", justifyContent: "center", marginTop: "24px" }}>
              <button className="cvl__btn-primary cvl__btn-lg" onClick={handleBuildCV}>
                <i className="fas fa-file-alt"></i> Go to CV Builder
              </button>
              <button className="cvl__btn-outline cvl__btn-lg" onClick={() => navigate("/dashboard")}>
                <i className="fas fa-th-large"></i> Dashboard
              </button>
            </div>
          </div>
        </section>
      )}

      {/* FOOTER */}
      <footer className="cvl__footer">
        <p>© 2026 CV Builder · <span className="cvl__gradient-text">Memora Smart Technologies</span></p>
        <button className="cvl__back-home" onClick={() => navigate("/")}>
          <i className="fas fa-home"></i> Back to Main Site
        </button>
      </footer>
    </div>
  );
}