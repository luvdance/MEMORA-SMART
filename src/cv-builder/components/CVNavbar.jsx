import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TEMPLATES, ACCENT } from "../utils/constants";
import { isPremiumTemplate } from "../utils/templateMeta";
import { TEMPLATE_INFO } from "../utils/sampleCV";
import cvLogo from "../../assets/cv logo.png";
import "../CVNavbar.css";

// Template menu groups (every template appears exactly once).
const TEMPLATE_GROUPS = [
  { label: "Classic", templates: [0, 2, 5, 6, 9] },
  { label: "Modern", templates: [1, 8, 7, 11] },
  { label: "Signature", templates: [3, 4, 10, 12, 13, 14] },
];

// ── WEB NAVBAR (desktop) ──
// Phones use the mobile app shell (components/mobile/MobileShell.jsx).
export default function CVNavbar({
  cv, cvId, template, setTemplate, accent, setAccent,
  onPrint, onDownload, pdfLoading, onSave, onShare, onClear,
  saving, saveStatus, isOwner, user, entitlement, onPlan, adminMode,
  showFormat, setShowFormat, showOrder, setShowOrder,
}) {
  const navigate = useNavigate();
  const [menu, setMenu] = useState(null); // "templates" | "account" | null
  const navRef = useRef(null);

  // Close menus on outside click or Escape.
  useEffect(() => {
    if (!menu) return undefined;
    const onDown = (e) => { if (!navRef.current?.contains(e.target)) setMenu(null); };
    const onKey = (e) => { if (e.key === "Escape") setMenu(null); };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [menu]);

  const toggle = (name) => setMenu((m) => (m === name ? null : name));

  const title = cv?.name ? `${cv.name.trim().split(/\s+/)[0]}'s CV` : "Untitled CV";
  let status = { text: cvId ? "Saved to your account" : "Draft on this device", icon: cvId ? "fa-cloud" : "fa-laptop", tone: "" };
  if (saving || saveStatus === "saving") status = { text: "Saving…", icon: "fa-circle-notch fa-spin", tone: "" };
  else if (saveStatus === "saved") status = { text: "All changes saved", icon: "fa-circle-check", tone: "ok" };
  else if (saveStatus === "error") status = { text: "Couldn't save", icon: "fa-triangle-exclamation", tone: "bad" };
  if (adminMode) status = { text: "Admin editing", icon: "fa-user-shield", tone: "" };

  const accents = [...new Set([TEMPLATE_INFO[template]?.accent, ...ACCENT].filter(Boolean))];
  const initial = (user?.displayName || user?.email || "?").charAt(0).toUpperCase();

  return (
    <nav className="wnav" ref={navRef} aria-label="CV builder">
      {/* ── LEFT: brand + document ── */}
      <div className="wnav__left">
        <button className="wnav__brand" onClick={() => navigate("/cv-builder")} aria-label="Memora CV Builder home">
          <img src={cvLogo} alt="" className="wnav__logo" />
        </button>
        <span className="wnav__sep" aria-hidden="true" />
        <div className="wnav__doc">
          <strong>{title}</strong>
          <span className={`wnav__status ${status.tone ? `wnav__status--${status.tone}` : ""}`}>
            <i className={`fas ${status.icon}`}></i> {status.text}
          </span>
        </div>
      </div>

      {/* ── CENTRE: design toolbar ── */}
      <div className="wnav__tools" role="toolbar" aria-label="Design">
        <div className="wnav__menu-wrap">
          <button
            className={`wnav__tool wnav__tool--template ${menu === "templates" ? "wnav__tool--on" : ""}`}
            onClick={() => toggle("templates")}
            aria-expanded={menu === "templates"}
            aria-haspopup="true"
          >
            <i className="fas fa-table-cells-large"></i>
            <span className="wnav__tool-name">{TEMPLATES[template] || "Template"}</span>
            {isPremiumTemplate(template) && <i className="fas fa-crown wnav__crown" aria-label="Premium template"></i>}
            <i className={`fas fa-chevron-down wnav__chev ${menu === "templates" ? "wnav__chev--open" : ""}`}></i>
          </button>

          {menu === "templates" && (
            <div className="wnav__panel wnav__panel--templates" role="menu">
              <div className="wnav__groups">
                {TEMPLATE_GROUPS.map((group) => (
                  <div key={group.label} className="wnav__group">
                    <div className="wnav__group-label">{group.label}</div>
                    {group.templates.map((i) => {
                      const selected = template === i;
                      return (
                        <button
                          key={i}
                          role="menuitemradio"
                          aria-checked={selected}
                          className={`wnav__option ${selected ? "wnav__option--on" : ""}`}
                          onClick={() => {
                            setTemplate(i);
                            setAccent(TEMPLATE_INFO[i]?.accent || ACCENT[0]);
                            setMenu(null);
                          }}
                        >
                          <span className="wnav__option-dot" style={{ background: TEMPLATE_INFO[i]?.accent || "#7c3aed" }} />
                          <span className="wnav__option-name">{TEMPLATES[i]}</span>
                          {isPremiumTemplate(i) && (
                            <i
                              className={`fas fa-crown wnav__option-crown ${entitlement?.premium ? "wnav__option-crown--owned" : ""}`}
                              title="Premium template"
                              aria-label="Premium"
                            ></i>
                          )}
                          {selected && <i className="fas fa-check wnav__option-check" aria-hidden="true"></i>}
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <span className="wnav__tool-sep" aria-hidden="true" />

        <div className="wnav__swatches" role="radiogroup" aria-label="Accent colour">
          {accents.map((c) => (
            <button
              key={c}
              role="radio"
              aria-checked={accent === c}
              className={`wnav__swatch ${accent === c ? "wnav__swatch--on" : ""}`}
              style={{ background: c }}
              onClick={() => setAccent(c)}
              aria-label={`Accent ${c}`}
              title={c}
            />
          ))}
          <label className="wnav__swatch wnav__swatch--custom" title="Custom colour" aria-label="Custom accent colour">
            <input type="color" value={accent} onChange={(e) => setAccent(e.target.value)} />
          </label>
        </div>

        <span className="wnav__tool-sep" aria-hidden="true" />

        <button
          className={`wnav__tool ${showFormat ? "wnav__tool--on" : ""}`}
          onClick={() => { setShowFormat((v) => !v); setShowOrder(false); }}
          aria-pressed={showFormat}
        >
          <i className="fas fa-sliders"></i>
          <span>Format</span>
        </button>
        <button
          className={`wnav__tool ${showOrder ? "wnav__tool--on" : ""}`}
          onClick={() => { setShowOrder((v) => !v); setShowFormat(false); }}
          aria-pressed={showOrder}
        >
          <i className="fas fa-arrow-down-short-wide"></i>
          <span>Reorder</span>
        </button>
      </div>

      {/* ── RIGHT: actions ── */}
      <div className="wnav__right">
        {user && entitlement && !adminMode && (
          <button
            className={`wnav__plan ${entitlement.premium ? "wnav__plan--pro" : entitlement.free.remaining === 0 ? "wnav__plan--empty" : ""}`}
            onClick={onPlan}
            title={entitlement.premium ? "Your Premium plan" : "Free downloads left today"}
          >
            {entitlement.premium
              ? <><i className="fas fa-crown"></i> PRO</>
              : <><i className="fas fa-arrow-down"></i> {entitlement.free.remaining} of {entitlement.free.limit} left</>}
          </button>
        )}

        {(isOwner || adminMode) && (
          <button className="wnav__btn" onClick={onSave} disabled={saving} title="Save (to your account)">
            <i className={`fas ${saving ? "fa-circle-notch fa-spin" : saveStatus === "saved" ? "fa-check" : "fa-cloud-arrow-up"}`}></i>
            <span>Save</span>
          </button>
        )}
        <button className="wnav__btn" onClick={onShare} title="Get a share link">
          <i className="fas fa-share-nodes"></i>
          <span>Share</span>
        </button>

        <div className="wnav__cta">
          <button className="wnav__primary" onClick={onDownload} disabled={pdfLoading}>
            <i className={`fas ${pdfLoading ? "fa-circle-notch fa-spin" : "fa-file-arrow-down"}`}></i>
            <span>{pdfLoading ? "Preparing…" : "Download PDF"}</span>
          </button>
          <button className="wnav__print" onClick={onPrint} title="Print" aria-label="Print">
            <i className="fas fa-print"></i>
          </button>
        </div>

        <div className="wnav__menu-wrap">
          <button
            className={`wnav__avatar ${menu === "account" ? "wnav__avatar--on" : ""}`}
            onClick={() => toggle("account")}
            aria-expanded={menu === "account"}
            aria-haspopup="true"
            aria-label="Account menu"
          >
            {user ? initial : <i className="fas fa-user"></i>}
          </button>

          {menu === "account" && (
            <div className="wnav__panel wnav__panel--account" role="menu">
              {user ? (
                <div className="wnav__who">
                  <span className="wnav__who-avatar">{initial}</span>
                  <div>
                    <strong>{user.displayName || user.email?.split("@")[0]}</strong>
                    <span>{user.email}</span>
                  </div>
                </div>
              ) : (
                <button className="wnav__item wnav__item--strong" role="menuitem" onClick={() => navigate("/auth", { state: { from: window.location.pathname } })}>
                  <i className="fas fa-right-to-bracket"></i> Sign in
                </button>
              )}
              {adminMode && (
                <button className="wnav__item" role="menuitem" onClick={() => navigate("/admin", { state: { tab: "cvs" } })}>
                  <i className="fas fa-user-shield"></i> Back to admin
                </button>
              )}
              <button className="wnav__item" role="menuitem" onClick={() => navigate("/dashboard")}>
                <i className="fas fa-house"></i> Dashboard
              </button>
              <button className="wnav__item" role="menuitem" onClick={() => navigate("/dashboard/my-works")}>
                <i className="fas fa-folder-open"></i> My CVs
              </button>
              <button className="wnav__item" role="menuitem" onClick={() => navigate("/dashboard/payments")}>
                <i className="fas fa-receipt"></i> Plan & payments
              </button>
              {isOwner && !adminMode && (
                <>
                  <div className="wnav__divider" />
                  <button className="wnav__item wnav__item--danger" role="menuitem" onClick={() => { setMenu(null); onClear(); }}>
                    <i className="fas fa-eraser"></i> Clear CV
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
