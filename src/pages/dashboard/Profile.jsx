import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { updateProfile } from "firebase/auth";
import { auth } from "../../firebase";
import DashboardLayout from "../../components/DashboardLayout";

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
          <button className="dash-profile__save" style={{ marginTop: 16 }}>
            <i className="fas fa-key"></i> Update Password
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}