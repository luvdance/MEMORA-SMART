import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import { getAllCVs } from "../../cv-builder/utils/cvService";
import { TEMPLATES, defaultFormat, resolveTheme, migrateCV, normalizeSectionOrder } from "../../cv-builder/utils/constants";
import { isPremiumTemplate } from "../../cv-builder/utils/templateMeta";
import {
  ClassicPro, ModernEdge, ExecutivePlus, MinimalClean, CreativeSide, CorporateBold, TraditionalProfile,
  EditorialModern, ModernTimeline, CompactPro, BoldStatement, Horizon, Refined, SignatureEdge, DarkGeo, Summit,
} from "../../cv-builder/components/CVTemplates";

const TEMPLATE_COMPONENTS = [ClassicPro, ModernEdge, ExecutivePlus, MinimalClean, CreativeSide, CorporateBold, TraditionalProfile, EditorialModern, ModernTimeline, CompactPro, BoldStatement, Horizon, Refined, SignatureEdge, DarkGeo, Summit];

function formatDate(ts) {
  if (!ts) return "—";
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

// Read-only rendering of a saved CV, scaled to fit the modal.
function CVQuickPreview({ cvDoc }) {
  const Template = TEMPLATE_COMPONENTS[cvDoc.template] || ClassicPro;
  const theme = resolveTheme(cvDoc.theme);
  return (
    <div className="admin-cvs__preview-scale">
      <div className="admin-cvs__preview-page" style={{ background: theme.bg }}>
        <Template
          cv={migrateCV(cvDoc.data) || {}}
          accent={cvDoc.accent || "#2563eb"}
          format={{ ...defaultFormat, ...(cvDoc.format || {}) }}
          sectionOrder={normalizeSectionOrder(cvDoc.sectionOrder)}
          theme={theme}
        />
      </div>
    </div>
  );
}

export default function AdminCVs() {
  const navigate = useNavigate();
  const [cvs, setCvs] = useState([]);
  const [owners, setOwners] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all"); // all | support | premium
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [list, usersSnap] = await Promise.all([getAllCVs(), getDocs(collection(db, "users"))]);
        if (cancelled) return;
        const map = {};
        usersSnap.docs.forEach(d => { map[d.id] = d.data(); });
        setOwners(map);
        setCvs(list);
      } catch (err) {
        console.error("Admin CVs load failed:", err);
        if (!cancelled) setError(err.message);
      }
      if (!cancelled) setLoading(false);
    })();
    return () => { cancelled = true; };
  }, []);

  const rows = useMemo(() => {
    const q = search.trim().toLowerCase();
    return cvs.filter(cv => {
      if (filter === "support" && cv.lastEditedBy !== "admin") return false;
      if (filter === "premium" && !isPremiumTemplate(cv.template)) return false;
      if (!q) return true;
      const owner = owners[cv.ownerId] || {};
      return [cv.title, cv.data?.name, cv.data?.jobTitle, owner.email, owner.name, TEMPLATES[cv.template], cv.id]
        .some(v => String(v || "").toLowerCase().includes(q));
    });
  }, [cvs, owners, search, filter]);

  const stats = useMemo(() => ({
    total: cvs.length,
    support: cvs.filter(c => c.lastEditedBy === "admin").length,
    downloads: cvs.reduce((n, c) => n + (c.downloadCount || 0), 0),
    owners: new Set(cvs.map(c => c.ownerId)).size,
  }), [cvs]);

  return (
    <>
      <div className="admin__stats">
        {[
          { label: "Saved CVs", value: stats.total, color: "#6699FF", icon: "file-alt" },
          { label: "CV Owners", value: stats.owners, color: "#9D00FF", icon: "users" },
          { label: "Downloads", value: stats.downloads, color: "#16a34a", icon: "download" },
          { label: "Edited by Support", value: stats.support, color: "#f59e0b", icon: "user-edit" },
        ].map(s => (
          <div key={s.label} className="admin__stat-card">
            <i className={`fas fa-${s.icon}`} style={{ color: s.color }}></i>
            <div className="admin__stat-value" style={{ color: s.color }}>{s.value}</div>
            <div className="admin__stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="admin__controls">
        <div className="admin__search">
          <i className="fas fa-search"></i>
          <input
            placeholder="Search by owner email, name, CV title or template..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="admin__filter">
          {[["all", "All"], ["support", "Edited by support"], ["premium", "Premium templates"]].map(([key, label]) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`admin__filter-btn ${filter === key ? "admin__filter-btn--active" : ""}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="admin__loading">
          <i className="fas fa-spinner fa-spin"></i>
          <p>Loading CVs...</p>
        </div>
      ) : error ? (
        <div className="admin__empty">
          <div>⚠️</div>
          <p>Could not load CVs: {error}</p>
        </div>
      ) : rows.length === 0 ? (
        <div className="admin__empty">
          <div>📄</div>
          <p>No CVs match your search</p>
        </div>
      ) : (
        <div className="admin__list">
          {rows.map(cv => {
            const owner = owners[cv.ownerId] || {};
            return (
              <div key={cv.id} className="admin__user-card">
                <div className="admin__user-avatar">
                  {(cv.data?.name || owner.name || owner.email || "?").charAt(0).toUpperCase()}
                </div>
                <div className="admin__user-info">
                  <div className="admin__user-name">
                    {cv.data?.name || cv.title || "Untitled CV"}
                    {cv.data?.jobTitle ? <span className="admin-cvs__job"> · {cv.data.jobTitle}</span> : null}
                  </div>
                  <div className="admin__user-meta">
                    <span>{owner.email || cv.ownerId}</span>
                    <span>•</span>
                    <span>
                      {TEMPLATES[cv.template] || "Template"}
                      {isPremiumTemplate(cv.template) && <i className="fas fa-crown admin-cvs__crown" title="Premium template"></i>}
                    </span>
                    <span>•</span>
                    <span>Updated {formatDate(cv.updatedAt)}</span>
                    <span>•</span>
                    <span>{cv.downloadCount || 0} download{cv.downloadCount === 1 ? "" : "s"}</span>
                  </div>
                </div>
                {cv.lastEditedBy === "admin" && (
                  <div className="admin__badge admin__badge--pending" title={`Edited ${formatDate(cv.adminEditedAt)}`}>
                    Support edit
                  </div>
                )}
                <div className="admin__user-actions">
                  <button className="admin__action-btn" title="Quick preview" onClick={() => setPreview(cv)}>
                    <i className="fas fa-eye"></i>
                  </button>
                  <button
                    className="admin__action-btn admin__action-btn--primary admin-cvs__edit-btn"
                    title="Open and edit this CV"
                    onClick={() => navigate(`/admin/cv/${cv.id}`)}
                  >
                    <i className="fas fa-pen"></i> Edit
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {preview && (
        <div className="admin__modal-backdrop" onClick={() => setPreview(null)}>
          <div className="admin__modal admin-cvs__modal" onClick={(e) => e.stopPropagation()}>
            <button className="admin__modal-close" onClick={() => setPreview(null)} aria-label="Close">
              <i className="fas fa-times"></i>
            </button>
            <h2>{preview.data?.name || preview.title || "Untitled CV"}</h2>
            <p>
              {(owners[preview.ownerId] || {}).email || preview.ownerId} · {TEMPLATES[preview.template]} · Updated {formatDate(preview.updatedAt)}
            </p>
            <CVQuickPreview cvDoc={preview} />
            <div className="admin-cvs__modal-actions">
              <button
                className="admin__action-btn admin__action-btn--primary"
                onClick={() => navigate(`/admin/cv/${preview.id}`)}
              >
                <i className="fas fa-pen"></i> Open & edit
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
