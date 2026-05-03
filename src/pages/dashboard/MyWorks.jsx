import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import DashboardLayout from "../../components/DashboardLayout";
import { getUserCVs, deleteCV } from "../../cv-builder/utils/cvService";

const TEMPLATE_NAMES = ["Classic Pro", "Modern Edge", "Executive Plus"];
const TEMPLATE_COLORS = ["#2563eb", "#0f766e", "#7c3aed"];

function timeAgo(timestamp) {
  if (!timestamp) return "Just now";
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  const diff = Math.floor((Date.now() - date.getTime()) / 1000);
  if (diff < 60) return "Just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export default function MyWorks() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [cvs, setCvs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(null);
  const [shareUrl, setShareUrl] = useState("");
  const [showShareModal, setShowShareModal] = useState(false);
  const [activeTab, setActiveTab] = useState("cvs");

  useEffect(() => {
    if (user) {
      getUserCVs(user.uid)
        .then(setCvs)
        .finally(() => setLoading(false));
    }
  }, [user]);

  const handleDelete = async (id) => {
    setDeleting(id);
    try {
      await deleteCV(id);
      setCvs((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      console.error(err);
    }
    setDeleting(null);
    setShowDeleteModal(null);
  };

  const handleShare = (id) => {
    const url = `${window.location.origin}/cv/${id}`;
    setShareUrl(url);
    setShowShareModal(true);
  };

  const copyLink = () => {
    navigator.clipboard.writeText(shareUrl);
  };

  return (
    <DashboardLayout title="My Works" subtitle="All your saved projects in one place">

      {/* TABS */}
      <div className="myworks__tabs">
        {[
          { key: "cvs", label: "CVs", icon: "fas fa-file-alt" },
          { key: "websites", label: "Websites", icon: "fas fa-laptop-code", soon: true },
          { key: "apps", label: "Mobile Apps", icon: "fas fa-mobile-alt", soon: true },
          { key: "data", label: "Data Projects", icon: "fas fa-chart-line", soon: true },
        ].map((t) => (
          <button
            key={t.key}
            className={`myworks__tab ${activeTab === t.key ? "myworks__tab--active" : ""}`}
            onClick={() => !t.soon && setActiveTab(t.key)}
          >
            <i className={t.icon}></i>
            {t.label}
            {t.soon && <span className="myworks__tab-soon">Soon</span>}
          </button>
        ))}
      </div>

      {/* CVs TAB */}
      {activeTab === "cvs" && (
        <div>
          <div className="myworks__header">
            <h2 className="myworks__section-title">
              My CVs <span className="myworks__count">{cvs.length}</span>
            </h2>
            <button
              className="myworks__new-btn"
              onClick={() => navigate("/dashboard/cv-builder")}
            >
              <i className="fas fa-plus"></i> New CV
            </button>
          </div>

          {loading ? (
            <div className="myworks__loading">
              <i className="fas fa-spinner fa-spin"></i>
              <p>Loading your CVs...</p>
            </div>
          ) : cvs.length === 0 ? (
            <div className="myworks__empty">
              <div className="myworks__empty-icon">
                <i className="fas fa-file-alt"></i>
              </div>
              <h3>No CVs yet</h3>
              <p>Create your first CV and save it to see it here.</p>
              <button
                className="myworks__new-btn"
                onClick={() => navigate("/dashboard/cv-builder")}
              >
                <i className="fas fa-plus"></i> Create My First CV
              </button>
            </div>
          ) : (
            <div className="myworks__grid">
              {cvs.map((cv) => (
                <div key={cv.id} className="myworks__card">
                  {/* COLOR BAR */}
                  <div
                    className="myworks__card-bar"
                    style={{ background: cv.accent || TEMPLATE_COLORS[cv.template] || "#6699FF" }}
                  />

                  {/* CARD CONTENT */}
                  <div className="myworks__card-body">
                    <div className="myworks__card-icon">
                      <i className="fas fa-file-alt"></i>
                    </div>
                    <div className="myworks__card-info">
                      <h3>{cv.title || "Untitled CV"}</h3>
                      <span className="myworks__card-template">
                        {TEMPLATE_NAMES[cv.template] || "Classic Pro"}
                      </span>
                      <span className="myworks__card-time">
                        <i className="fas fa-clock"></i> {timeAgo(cv.updatedAt)}
                      </span>
                    </div>
                  </div>

                  {/* ACTIONS */}
                  <div className="myworks__card-actions">
                    <button
                      className="myworks__action-btn myworks__action-btn--primary"
                      onClick={() => navigate(`/cv/${cv.id}`)}
                    >
                      <i className="fas fa-edit"></i> Open
                    </button>
                    <button
                      className="myworks__action-btn"
                      onClick={() => handleShare(cv.id)}
                    >
                      <i className="fas fa-share-alt"></i> Share
                    </button>
                    <button
                      className="myworks__action-btn myworks__action-btn--danger"
                      onClick={() => setShowDeleteModal(cv.id)}
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </div>
              ))}

              {/* NEW CV CARD */}
              <div
                className="myworks__card myworks__card--new"
                onClick={() => navigate("/dashboard/cv-builder")}
              >
                <div className="myworks__card-new-inner">
                  <div className="myworks__new-icon">
                    <i className="fas fa-plus"></i>
                  </div>
                  <p>Create New CV</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* DELETE CONFIRM MODAL */}
      {showDeleteModal && (
        <div className="cvb-modal" onClick={() => setShowDeleteModal(null)}>
          <div className="cvb-modal__box" onClick={(e) => e.stopPropagation()}>
            <div className="cvb-modal__icon cvb-modal__icon--lock">
              <i className="fas fa-trash"></i>
            </div>
            <h3>Delete CV?</h3>
            <p>This action cannot be undone. Your CV will be permanently deleted from the cloud.</p>
            <div className="cvb-modal__actions">
              <button
                className="myworks__delete-confirm"
                onClick={() => handleDelete(showDeleteModal)}
                disabled={deleting === showDeleteModal}
              >
                {deleting === showDeleteModal
                  ? <><i className="fas fa-spinner fa-spin"></i> Deleting...</>
                  : <><i className="fas fa-trash"></i> Yes, Delete</>
                }
              </button>
              <button
                className="cvb-modal__close"
                onClick={() => setShowDeleteModal(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SHARE MODAL */}
      {showShareModal && (
        <div className="cvb-modal" onClick={() => setShowShareModal(false)}>
          <div className="cvb-modal__box" onClick={(e) => e.stopPropagation()}>
            <div className="cvb-modal__icon">
              <i className="fas fa-share-alt"></i>
            </div>
            <h3>Share this CV</h3>
            <p>Anyone with this link can view and edit this CV. They'll need to log in to download it.</p>
            <div className="cvb-modal__link-row">
              <input className="cvb-modal__link-input" value={shareUrl} readOnly />
              <button className="cvb-modal__copy-btn" onClick={copyLink}>
                <i className="fas fa-copy"></i> Copy
              </button>
            </div>
            <div className="cvb-modal__actions">
              <button className="cvb-modal__close" onClick={() => setShowShareModal(false)}>
                Done
              </button>
            </div>
          </div>
        </div>
      )}

    </DashboardLayout>
  );
}