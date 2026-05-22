import { useState, useEffect } from "react";
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
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Email existence check
  const [emailStatus, setEmailStatus] = useState(null); // null | 'checking' | 'exists' | 'available' | 'google-only'

  // Forgot password modal
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotSuccess, setForgotSuccess] = useState(false);

  // Email verification screen
  const [showVerifyScreen, setShowVerifyScreen] = useState(false);
  const [verifyEmail, setVerifyEmail] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);
  const [resendSuccess, setResendSuccess] = useState(false);

const {
  user,
  register,
  login,
  loginWithGoogle,
  logout,
  resendVerification,
  resetPassword,
  checkEmail,
} = useAuth();

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/dashboard";

  // ── Show success on verified redirect ──
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("verified") === "true") {
      setError("");
      window.history.replaceState({}, "", "/auth");
    }
  }, [location]);

  // ── Resend cooldown timer ──
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setTimeout(() => setResendCooldown((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [resendCooldown]);

  // ── Debounced email existence check (signup mode only) ──
  useEffect(() => {
    if (!email || !email.includes("@") || isLogin) {
      setEmailStatus(null);
      return;
    }

    // ── Auto-redirect when user logs in successfully ──
useEffect(() => {
  if (user && !showVerifyScreen) {
    // For unverified new users, don't auto-redirect — they need to see verify screen
    const userCreatedAt = user.metadata?.creationTime
      ? new Date(user.metadata.creationTime).getTime()
      : 0;
    const ENFORCEMENT_DATE = new Date("2026-05-08T00:00:00Z").getTime();
    const isExistingUser = userCreatedAt < ENFORCEMENT_DATE;

    if (user.emailVerified || isExistingUser) {
      navigate(from, { replace: true });
    }
  }
}, [user, showVerifyScreen, from, navigate]);

    setEmailStatus("checking");
    const t = setTimeout(async () => {
      const methods = await checkEmail(email);
      if (methods.length === 0) {
        setEmailStatus("available");
      } else if (methods.includes("google.com") && !methods.includes("password")) {
        setEmailStatus("google-only");
      } else {
        setEmailStatus("exists");
      }
    }, 600);

    return () => clearTimeout(t);
  }, [email, isLogin, checkEmail]);

  // ── EMAIL/PASSWORD SUBMIT ──
const handleSubmit = async () => {
  setError("");
  setLoading(true);
  try {
    if (isLogin) {
      const result = await login(email, password);

      // Grandfathering: existing users (registered before enforcement date) skip verification
      const userCreatedAt = result.user.metadata?.creationTime
        ? new Date(result.user.metadata.creationTime).getTime()
        : 0;
      const ENFORCEMENT_DATE = new Date("2026-05-08T00:00:00Z").getTime();
      const isExistingUser = userCreatedAt < ENFORCEMENT_DATE;

      // Only block NEW unverified users
      if (!result.user.emailVerified && !isExistingUser) {
        setVerifyEmail(result.user.email);
        setShowVerifyScreen(true);
        setLoading(false);
        return;
      }
      
    } else {
      // Pre-check before creating account
      if (emailStatus === "exists" || emailStatus === "google-only") {
        setError(
          emailStatus === "google-only"
            ? "This email is registered with Google. Please use 'Continue with Google' to sign in."
            : "An account with this email already exists. Please log in instead."
        );
        setLoading(false);
        return;
      }
      await register(name, email, password);
      // Show verify screen
      setVerifyEmail(email);
      setShowVerifyScreen(true);
      setResendCooldown(60);
    }
  } catch (err) {
    setError(getAuthError(err));
  }
  setLoading(false);
};

  // ── GOOGLE SIGN IN ──
  const handleGoogleSignIn = async () => {
    setError("");
    setLoading(true);
    try {
      await loginWithGoogle();
    } catch (err) {
      if (err.code === "auth/popup-closed-by-user" || err.code === "auth/cancelled-popup-request") {
        // Silent fail
      } else {
        setError(getAuthError(err));
      }
    }
    setLoading(false);
  };

  // ── FORGOT PASSWORD ──
  const handleForgotPassword = async () => {
    if (!forgotEmail || !forgotEmail.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }
    setForgotLoading(true);
    setError("");
    try {
      await resetPassword(forgotEmail);
      setForgotSuccess(true);
    } catch (err) {
      setError(getAuthError(err));
    }
    setForgotLoading(false);
  };

  const closeForgotModal = () => {
    setShowForgotModal(false);
    setForgotEmail("");
    setForgotSuccess(false);
    setError("");
  };

  // ── RESEND VERIFICATION ──
  const handleResendVerification = async () => {
    setResendSuccess(false);
    setError("");
    try {
      await resendVerification();
      setResendSuccess(true);
      setResendCooldown(60);
    } catch (err) {
      setError(getAuthError(err));
    }
  };

  // ── BACK FROM VERIFY SCREEN (also signs out so they can log in again) ──
  const handleBackFromVerify = async () => {
    try {
      await logout();
    } catch {}
    setShowVerifyScreen(false);
    setIsLogin(true);
    setEmail("");
    setPassword("");
    setError("");
    setResendSuccess(false);
  };

  // ── ERROR FORMATTER ──
  const getAuthError = (err) => {
    const code = err.code || "";
    switch (code) {
      case "auth/user-not-found":
        return "No account found with this email. Sign up instead?";
      case "auth/wrong-password":
      case "auth/invalid-credential":
        return "Incorrect email or password.";
      case "auth/email-already-in-use":
        return "An account with this email already exists.";
      case "auth/weak-password":
        return "Password should be at least 6 characters.";
      case "auth/invalid-email":
        return "Please enter a valid email address.";
      case "auth/popup-blocked":
        return "Popup blocked. Please allow popups and try again.";
      case "auth/network-request-failed":
        return "Network error. Check your internet connection.";
      case "auth/too-many-requests":
        return "Too many attempts. Try again later.";
      default:
        return err.message || "Something went wrong. Please try again.";
    }
  };

  // ─────────────────────────────────────────────────
  // VERIFY EMAIL SCREEN
  // ─────────────────────────────────────────────────
  if (showVerifyScreen) {
    return (
      <div className="auth">
        <div className="auth__right" style={{ width: "100%" }}>
          <div className="auth__form-box">
            <div className="auth__verify-icon">
              <i className="fas fa-envelope-open-text"></i>
            </div>
            <h2>Verify your email</h2>
            <p className="auth__form-sub">
              We've sent a verification link to:
            </p>
            <div className="auth__verify-email">{verifyEmail}</div>
            <p className="auth__verify-text">
              Click the link in the email to activate your account. Don't forget to check your spam folder.
            </p>

            {resendSuccess && (
              <div className="auth__success">
                <i className="fas fa-check-circle"></i> Verification email sent again!
              </div>
            )}

            {error && (
              <div className="auth__error">
                <i className="fas fa-exclamation-circle"></i> {error}
              </div>
            )}

            <button
              className="auth__submit"
              onClick={handleResendVerification}
              disabled={resendCooldown > 0}
            >
              {resendCooldown > 0
                ? <><i className="fas fa-clock"></i> Resend in {resendCooldown}s</>
                : <><i className="fas fa-paper-plane"></i> Resend Verification Email</>
              }
            </button>

            <button
              className="auth__verify-back"
              onClick={handleBackFromVerify}
            >
              <i className="fas fa-arrow-left"></i> Back to login
            </button>

            <p className="auth__verify-hint">
              Already verified? <span onClick={() => window.location.reload()}>Refresh page</span>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────
  // MAIN AUTH PAGE
  // ─────────────────────────────────────────────────
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

          {/* GOOGLE SIGN IN BUTTON */}
          <button
            className="auth__google-btn"
            onClick={handleGoogleSignIn}
            disabled={loading}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
              <g fill="none" fillRule="evenodd">
                <path d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
                <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
                <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
                <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
              </g>
            </svg>
            <span>Continue with Google</span>
          </button>

          {/* DIVIDER */}
          <div className="auth__divider">
            <span>or {isLogin ? "log in with email" : "sign up with email"}</span>
          </div>

          {/* TOGGLE */}
          <div className="auth__toggle">
            <button
              className={`auth__toggle-btn ${isLogin ? "auth__toggle-btn--active" : ""}`}
              onClick={() => { setIsLogin(true); setError(""); setEmailStatus(null); }}
            >
              Log In
            </button>
            <button
              className={`auth__toggle-btn ${!isLogin ? "auth__toggle-btn--active" : ""}`}
              onClick={() => { setIsLogin(false); setError(""); }}
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
              <div className={`auth__input-wrap ${
                emailStatus === "exists" || emailStatus === "google-only" ? "auth__input-wrap--warning" : ""
              } ${
                emailStatus === "available" ? "auth__input-wrap--success" : ""
              }`}>
                <i className="fas fa-envelope"></i>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {emailStatus === "checking" && (
                  <i className="fas fa-spinner fa-spin auth__field-status"></i>
                )}
                {emailStatus === "available" && (
                  <i className="fas fa-check-circle auth__field-status auth__field-status--success"></i>
                )}
                {(emailStatus === "exists" || emailStatus === "google-only") && (
                  <i className="fas fa-exclamation-circle auth__field-status auth__field-status--warning"></i>
                )}
              </div>

              {/* Email status messages */}
              {!isLogin && emailStatus === "exists" && (
                <div className="auth__field-msg auth__field-msg--warning">
                  This email is already registered.
                  <span onClick={() => { setIsLogin(true); setError(""); }}> Log in instead?</span>
                </div>
              )}
              {!isLogin && emailStatus === "google-only" && (
                <div className="auth__field-msg auth__field-msg--warning">
                  This email is registered via Google.
                  <span onClick={handleGoogleSignIn}> Continue with Google?</span>
                </div>
              )}
              {!isLogin && emailStatus === "available" && (
                <div className="auth__field-msg auth__field-msg--success">
                  <i className="fas fa-check"></i> Email is available
                </div>
              )}
            </div>

            <div className="auth__field">
              <label>Password</label>
              <div className="auth__input-wrap">
                <i className="fas fa-lock"></i>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="auth__password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  <i className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
                </button>
              </div>

              {isLogin && (
                <div className="auth__forgot-link" onClick={() => {
                  setForgotEmail(email);
                  setShowForgotModal(true);
                  setForgotSuccess(false);
                  setError("");
                }}>
                  Forgot password?
                </div>
              )}
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
            disabled={loading || (!isLogin && (emailStatus === "exists" || emailStatus === "google-only"))}
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
            <span onClick={() => { setIsLogin(!isLogin); setError(""); setEmailStatus(null); }}>
              {isLogin ? "Sign Up" : "Log In"}
            </span>
          </p>
        </div>
      </div>

      {/* FORGOT PASSWORD MODAL */}
      {showForgotModal && (
        <div className="auth__modal" onClick={closeForgotModal}>
          <div className="auth__modal-box" onClick={(e) => e.stopPropagation()}>
            {!forgotSuccess ? (
              <>
                <div className="auth__modal-icon">
                  <i className="fas fa-key"></i>
                </div>
                <h3>Reset your password</h3>
                <p>Enter your email and we'll send you a link to reset your password.</p>
                <div className="auth__field" style={{ marginTop: 16 }}>
                  <div className="auth__input-wrap">
                    <i className="fas fa-envelope"></i>
                    <input
                      type="email"
                      placeholder="you@example.com"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                    />
                  </div>
                </div>

                {error && (
                  <div className="auth__error">
                    <i className="fas fa-exclamation-circle"></i> {error}
                  </div>
                )}

                <div className="auth__modal-actions">
                  <button
                    className="auth__submit"
                    onClick={handleForgotPassword}
                    disabled={forgotLoading}
                  >
                    {forgotLoading ? (
                      <><i className="fas fa-spinner fa-spin"></i> Sending...</>
                    ) : (
                      <><i className="fas fa-paper-plane"></i> Send Reset Link</>
                    )}
                  </button>
                  <button className="auth__modal-cancel" onClick={closeForgotModal}>
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="auth__modal-icon auth__modal-icon--success">
                  <i className="fas fa-check"></i>
                </div>
                <h3>Check your email</h3>
                <p>We've sent a password reset link to <strong>{forgotEmail}</strong>. The link expires in 1 hour.</p>
                <button className="auth__submit" onClick={closeForgotModal}>
                  Got it
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}