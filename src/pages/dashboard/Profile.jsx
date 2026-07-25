import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { updateProfile, sendPasswordResetEmail, } from "firebase/auth";
import { auth } from "../../firebase";
import DashboardLayout from "../../components/DashboardLayout";
import { getUserDoc } from "../../utils/userService";

export default function Profile() {
  const { user } = useAuth();
  const fileRef = useRef();
  const navigate = useNavigate();

  const [name, setName] = useState(user?.displayName || "");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [website, setWebsite] = useState("");
  const [photo, setPhoto] = useState(user?.photoURL || null);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [planData, setPlanData] = useState(null);
  const [passwordResetSent, setPasswordResetSent] = useState(false);
  const [passwordResetError, setPasswordResetError] = useState("");
  const [sendingReset, setSendingReset] = useState(false);

  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setPhoto(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    setSaving(true);
    setSuccess(false);
    try {
      await updateProfile(auth.currentUser, {
        displayName: name,
        photoURL: photo,
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    }
    setSaving(false);
  };

  const initial = name?.charAt(0).toUpperCase() || "U";

  //password reset handler
  const handlePasswordReset = async () => {
  if (!user?.email) return;
  setSendingReset(true);
  setPasswordResetError("");
  setPasswordResetSent(false);
  try {
    await sendPasswordResetEmail(auth, user.email, {
      url: `${window.location.origin}/auth`,
    });
    setPasswordResetSent(true);
  } catch (err) {
    setPasswordResetError(
      err.code === "auth/too-many-requests"
        ? "Too many attempts. Please wait a few minutes and try again."
        : "Failed to send reset email. Please try again."
    );
  }
  setSendingReset(false);
};

  useEffect(() => {
    if (user?.uid) {
      getUserDoc(user.uid).then(setPlanData);
    }
  }, [user]);

  return (
    <DashboardLayout title="Profile" subtitle="Manage your personal information">
      <div className="dash-profile">

        {/* MOBILE-ONLY BACK BUTTON */}
        <button className="dash-back-btn" onClick={() => navigate("/dashboard")}>
          <i className="fas fa-arrow-left"></i>
          <span>Back to Dashboard</span>
        </button>

        <div className="dash-profile__header">
          <h2>Your Profile</h2>
          <p>Update your details — your photo and info will be used across all Memora apps including your CV.</p>
        </div>

        {/* PHOTO & NAME */}
        <div className="dash-profile__card">
          <h3><i className="fas fa-user"></i> Personal Details</h3>

          <div className="dash-profile__photo-row">
            <div className="dash-profile__photo">
              {photo ? <img src={photo} alt="profile" /> : initial}
            </div>
            <div className="dash-profile__photo-actions">
              <h4>Profile Photo</h4>
              <p>This photo will appear on your CV and across all apps.</p>
              <button className="dash-profile__upload-btn" onClick={() => fileRef.current.click()}>
                <i className="fas fa-upload"></i> Upload Photo
              </button>
              <input
                type="file"
                accept="image/*"
                ref={fileRef}
                onChange={handlePhoto}
                style={{ display: "none" }}
              />
            </div>
          </div>

          <div className="dash-profile__grid">
            <div className="dash-profile__field">
              <label>Full Name</label>
              <input className="dash-profile__input" value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" />
            </div>
            <div className="dash-profile__field">
              <label>Email Address</label>
              <input className="dash-profile__input" value={user?.email || ""} disabled style={{ opacity: 0.6, cursor: "not-allowed" }} />
            </div>
            <div className="dash-profile__field">
              <label>Phone Number</label>
              <input className="dash-profile__input" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+234 800 000 0000" />
            </div>
            <div className="dash-profile__field">
              <label>Location / Address</label>
              <input className="dash-profile__input" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Lagos, Nigeria" />
            </div>
            <div className="dash-profile__field">
              <label>LinkedIn URL</label>
              <input className="dash-profile__input" value={linkedin} onChange={(e) => setLinkedin(e.target.value)} placeholder="linkedin.com/in/yourname" />
            </div>
            <div className="dash-profile__field">
              <label>Website / Portfolio</label>
              <input className="dash-profile__input" value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="yourwebsite.com" />
            </div>
          </div>

          <button className="dash-profile__save" onClick={handleSave} disabled={saving}>
            {saving
              ? <><i className="fas fa-spinner fa-spin"></i> Saving...</>
              : <><i className="fas fa-save"></i> Save Changes</>
            }
          </button>

          {success && (
            <div className="dash-profile__success">
              <i className="fas fa-check-circle"></i>
              Profile updated successfully! Your CV will now use this information.
            </div>
          )}
        </div>

        {/* PAYMENTS & PLAN */}
<div className="dash-profile__card dash-profile__card--payments">
  <h3><i className="fas fa-credit-card"></i> Payments & Plan</h3>

  {planData ? (
    <div className="dash-profile__plan-row">
      <div className="dash-profile__plan-info">
        <div className={`dash-profile__plan-badge ${
          planData.isPro
            ? "dash-profile__plan-badge--pro"
            : planData.paidDownloads > 0
            ? "dash-profile__plan-badge--credits"
            : planData.freeCVUsed
            ? "dash-profile__plan-badge--exhausted"
            : "dash-profile__plan-badge--free"
        }`}>
          <i className={`fas fa-${
            planData.isPro ? "bolt"
              : planData.paidDownloads > 0 ? "coins"
              : planData.freeCVUsed ? "lock"
              : "gift"
          }`}></i>
          {planData.isPro
            ? "Memora Pro"
            : planData.paidDownloads > 0
            ? `${planData.paidDownloads} credit${planData.paidDownloads !== 1 ? "s" : ""}`
            : planData.freeCVUsed
            ? "Free (used)"
            : "Free"}
        </div>
        <p className="dash-profile__plan-sub">
          {planData.isPro
            ? "Unlimited downloads"
            : planData.paidDownloads > 0
            ? "Use anytime — no expiry"
            : planData.freeCVUsed
            ? "Upgrade or buy a download to continue"
            : "1 free download available"}
        </p>
      </div>

      <button
        className="dash-profile__payments-btn"
        onClick={() => navigate("/dashboard/payments")}
      >
        View Payments <i className="fas fa-arrow-right"></i>
      </button>
    </div>
  ) : (
    <div style={{ color: "#888", fontSize: "0.875rem" }}>
      <i className="fas fa-spinner fa-spin"></i> Loading plan...
    </div>
  )}

  <div className="dash-profile__plan-help">
    <i className="fas fa-info-circle"></i>
    <span>Paid but no access yet? Tap "View Payments" to verify.</span>
  </div>
</div>

        {/* PASSWORD */}
        <div className="dash-profile__card">
          <h3><i className="fas fa-lock"></i> Security</h3>
          <div className="dash-profile__grid">
            <div className="dash-profile__field">
              <label>New Password</label>
              <input className="dash-profile__input" type="password" placeholder="••••••••" />
            </div>
            <div className="dash-profile__field">
              <label>Confirm Password</label>
              <input className="dash-profile__input" type="password" placeholder="••••••••" />
            </div>
          </div>
          {/* Password reset */}
          <div style={{ marginTop: 16 }}>
            <button
              className="dash-profile__save"
              onClick={handlePasswordReset}
              disabled={sendingReset}
              style={{ opacity: sendingReset ? 0.7 : 1 }}
            >
              {sendingReset ? (
                <><i className="fas fa-circle-notch fa-spin"></i> Sending...</>
              ) : (
                <><i className="fas fa-key"></i> Reset Password via Email</>
              )}
            </button>

            {passwordResetSent && (
              <div style={{
                marginTop: 10,
                padding: "10px 14px",
                background: "#f0fdf4",
                border: "1px solid #86efac",
                borderRadius: 10,
                fontSize: "0.82rem",
                color: "#16a34a",
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}>
                <i className="fas fa-check-circle"></i>
                Password reset email sent to <b>{user?.email}</b>. Check your inbox.
              </div>
            )}

            {passwordResetError && (
              <div style={{
                marginTop: 10,
                padding: "10px 14px",
                background: "#fef2f2",
                border: "1px solid #fca5a5",
                borderRadius: 10,
                fontSize: "0.82rem",
                color: "#dc2626",
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}>
                <i className="fas fa-exclamation-circle"></i>
                {passwordResetError}
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}