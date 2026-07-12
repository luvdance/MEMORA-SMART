import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { TEMPLATES, ACCENT, FONT_OPTIONS, THEME_PRESETS } from "../utils/constants";
import { TEMPLATE_INFO } from "../utils/sampleCV";
import cvLogo from "../../assets/cv logo.png";

const TEMPLATE_GROUPS = [
  {
    label: "Classic",
    templates: [0, 2, 5, 6, 9],
  },
  {
    label: "Modern",
    templates: [1, 8, 7, 11],
  },
  {
    label: "Signature",
    templates: [3, 4, 10, 12, 13, 14],
  },
];

export default function CVNavbar({
  template, setTemplate, accent, setAccent,
  tab, setTab, onPrint, onDownload, pdfLoading,
  onSave, onShare, onClear,
  saving, saveStatus, isOwner, user,
  format, setFormat, theme, setTheme,
  showFormat, setShowFormat,
  showOrder, setShowOrder,
}) {
  const navigate = useNavigate();
  const [showTemplateDropdown, setShowTemplateDropdown] = useState(false);
  const [showMoreDropdown, setShowMoreDropdown] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 900);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 900);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleClick = (e) => {
      if (
        !e.target.closest(".cvnav__dropdown-wrap") &&
        !e.target.closest(".cvnav__more-btn") &&
        !e.target.closest(".cvnav__mobile-more") &&
        !e.target.closest(".cvnav__tab")
      ) {
        setShowTemplateDropdown(false);
        setShowMoreDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <>
      {/* ══════════════════════════════
          TOP NAVBAR
      ══════════════════════════════ */}
      <nav className="cvnav">

        {/* LEFT — Brand + User */}
        <div className="cvnav__left">
          <button
            className="cvnav__brand"
            onClick={() => navigate("/cv-builder")}
            aria-label="CV Builder home"
          >
            <img src={cvLogo} alt="Memora" className="cvnav__logo" />
            <div className="cvnav__brand-text">
              <span className="cvnav__brand-name">Memora</span>
              <span className="cvnav__brand-sub">CV Builder</span>
            </div>
          </button>

          {user && (
            <div className="cvnav__user-identity">
              <div className="cvnav__user-avatar">
                {(user.displayName || user.email || "U").charAt(0).toUpperCase()}
              </div>
              <span className="cvnav__user-name">
                {user.displayName
                  ? user.displayName.split(" ")[0]
                  : user.email?.split("@")[0]}
              </span>
            </div>
          )}
        </div>

        {/* MOBILE ONLY — dashboard back button */}
        <button
          className="cvnav__mobile-back"
          onClick={() => navigate("/dashboard")}
        >
          <i className="fas fa-th-large"></i>
          <span>Dashboard</span>
        </button>

        {/* CENTER — Design tools (desktop only) */}
        <div className="cvnav__center">

          {/* Template picker */}
          <div className="cvnav__dropdown-wrap">
            <button
              className="cvnav__template-btn"
              onClick={() => {
                setShowTemplateDropdown(v => !v);
                setShowMoreDropdown(false);
              }}
              aria-expanded={showTemplateDropdown}
            >
              <span
                className="cvnav__template-dot"
                style={{ background: TEMPLATE_INFO[template]?.accent || accent }}
              />
              <span className="cvnav__template-name">
                {TEMPLATES[template] || "Template"}
              </span>
              <i className={`fas fa-chevron-down cvnav__chevron ${showTemplateDropdown ? "cvnav__chevron--open" : ""}`}></i>
            </button>

            {showTemplateDropdown && !isMobile && (
              <div className="cvnav__template-dropdown">
                <div className="cvnav__template-grid">
                  {TEMPLATE_GROUPS.map((group) => (
                    <div key={group.label} className="cvnav__template-col">
                      <div className="cvnav__template-group-label">{group.label}</div>
                      {group.templates.map((idx) => (
                        <button
                          key={idx}
                          className={`cvnav__template-option ${template === idx ? "cvnav__template-option--active" : ""}`}
                          onClick={() => {
                            setTemplate(idx);
                            setAccent(TEMPLATE_INFO[idx]?.accent || ACCENT[0]);
                            setShowTemplateDropdown(false);
                          }}
                        >
                          <span
                            className="cvnav__template-dot"
                            style={{ background: TEMPLATE_INFO[idx]?.accent || "#6699FF" }}
                          />
                          <span>{TEMPLATES[idx]}</span>
                        </button>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Color accent dots */}
          <div className="cvnav__accent-wrap">
            <span className="cvnav__accent-label">Color</span>
            {ACCENT.map((color) => (
              <button
                key={color}
                className={`cvnav__accent-dot ${accent === color ? "cvnav__accent-dot--active" : ""}`}
                style={{ background: color }}
                onClick={() => setAccent(color)}
                title={color}
                aria-label={`Set accent to ${color}`}
              />
            ))}
          </div>

          <div className="cvnav__divider" />

          {/* Format */}
          <button
            className={`cvnav__tool-btn ${showFormat ? "cvnav__tool-btn--active" : ""}`}
            onClick={() => {
              setShowFormat(v => !v);
              setShowOrder(false);
            }}
          >
            <i className="fas fa-sliders-h"></i>
            <span>Format</span>
          </button>

          {/* Reorder */}
          <button
            className={`cvnav__tool-btn ${showOrder ? "cvnav__tool-btn--active" : ""}`}
            onClick={() => {
              setShowOrder(v => !v);
              setShowFormat(false);
            }}
          >
            <i className="fas fa-arrows-alt-v"></i>
            <span>Reorder</span>
          </button>

        </div>

        {/* RIGHT — Actions (desktop only) */}
        <div className="cvnav__right">

          {saveStatus && (
            <span className={`cvnav__save-status ${
              saveStatus === "saved" ? "cvnav__save-status--saved" :
              saveStatus === "error" ? "cvnav__save-status--error" : ""
            }`}>
              {saveStatus === "saving" && <><i className="fas fa-circle-notch fa-spin"></i> Saving</>}
              {saveStatus === "saved" && <><i className="fas fa-check"></i> Saved</>}
              {saveStatus === "error" && <><i className="fas fa-exclamation-circle"></i> Error</>}
            </span>
          )}

          {isOwner && (
            <button
              className="cvnav__action-btn"
              onClick={onSave}
              disabled={saving}
            >
              <i className="fas fa-save"></i>
              <span>Save</span>
            </button>
          )}

          <button className="cvnav__action-btn" onClick={onShare}>
            <i className="fas fa-share-alt"></i>
            <span>Share</span>
          </button>

          <button
            className="cvnav__action-btn"
            onClick={() => navigate("/dashboard")}
          >
            <i className="fas fa-th-large"></i>
            <span>Dashboard</span>
          </button>

          {/* Print — primary desktop CTA */}
          <button
            className="cvnav__download-btn"
            onClick={onPrint}
          >
            <i className="fas fa-print"></i>
            <span>Print / PDF</span>
          </button>

          {/* ⋯ More */}
          <div className="cvnav__dropdown-wrap">
            <button
              className="cvnav__more-btn"
              onClick={() => {
                setShowMoreDropdown(v => !v);
                setShowTemplateDropdown(false);
              }}
              aria-label="More options"
            >
              <i className="fas fa-ellipsis-h"></i>
            </button>

            {showMoreDropdown && !isMobile && (
              <div className="cvnav__more-dropdown">
                <button
                  className="cvnav__more-item"
                  onClick={() => { onDownload(); setShowMoreDropdown(false); }}
                >
                  <i className="fas fa-download"></i> Download PDF
                </button>
                <button
                  className="cvnav__more-item"
                  onClick={() => { navigate("/cv-builder"); setShowMoreDropdown(false); }}
                >
                  <i className="fas fa-info-circle"></i> About
                </button>
                <div className="cvnav__more-divider" />
                <button
                  className="cvnav__more-item cvnav__more-item--danger"
                  onClick={() => { onClear(); setShowMoreDropdown(false); }}
                >
                  <i className="fas fa-trash"></i> Clear CV
                </button>
              </div>
            )}
          </div>

        </div>
      </nav>

      {/* ══════════════════════════════
          MOBILE BOTTOM TABS (one, clean)
      ══════════════════════════════ */}
      <div className="cvnav__mobile-tabs">
        <button
          className={`cvnav__tab ${tab === "form" ? "cvnav__tab--active" : ""}`}
          onClick={() => setTab("form")}
        >
          <i className="fas fa-edit"></i>
          <span>Form</span>
        </button>

        <button
          className={`cvnav__tab ${tab === "preview" ? "cvnav__tab--active" : ""}`}
          onClick={() => setTab("preview")}
        >
          <i className="fas fa-eye"></i>
          <span>Preview</span>
        </button>

        <button
          className="cvnav__tab"
          onClick={onSave}
          disabled={saving}
        >
          <i className="fas fa-save"></i>
          <span>Save</span>
        </button>

        {/* Download — primary mobile CTA */}
        <button
          className="cvnav__tab cvnav__tab--download"
          onClick={onDownload}
          disabled={pdfLoading}
        >
          {pdfLoading ? (
            <><i className="fas fa-circle-notch fa-spin"></i><span>Wait...</span></>
          ) : (
            <><i className="fas fa-download"></i><span>Download</span></>
          )}
        </button>

        <button
          className="cvnav__tab"
          onClick={() => setShowMoreDropdown(v => !v)}
        >
          <i className="fas fa-ellipsis-h"></i>
          <span>More</span>
        </button>
      </div>

      {/* Mobile More — backdrop */}
      {showMoreDropdown && isMobile && (
        <div
          style={{ position: "fixed", inset: 0, zIndex: 398 }}
          onClick={() => setShowMoreDropdown(false)}
        />
      )}

      {/* Mobile More — menu */}
      {showMoreDropdown && isMobile && (
        <div className="cvnav__mobile-more">
          <button
            className="cvnav__mobile-more-item"
            onClick={() => { navigate("/dashboard"); setShowMoreDropdown(false); }}
          >
            <i className="fas fa-th-large"></i> Dashboard
          </button>
          <button
            className="cvnav__mobile-more-item"
            onClick={() => { navigate("/dashboard/works"); setShowMoreDropdown(false); }}
          >
            <i className="fas fa-folder-open"></i> My Works
          </button>

          <div className="cvnav__more-divider" />

          <button
            className="cvnav__mobile-more-item"
            onClick={() => { onPrint(); setShowMoreDropdown(false); }}
          >
            <i className="fas fa-print"></i> Print
          </button>
          <button
            className="cvnav__mobile-more-item"
            onClick={() => { onShare(); setShowMoreDropdown(false); }}
          >
            <i className="fas fa-share-alt"></i> Share
          </button>

          <div className="cvnav__more-divider" />

          <button
            className="cvnav__mobile-more-item cvnav__more-item--danger"
            onClick={() => { onClear(); setShowMoreDropdown(false); }}
          >
            <i className="fas fa-trash"></i> Clear CV
          </button>
        </div>
      )}

      {/* Mobile Template Sheet */}
      {showTemplateDropdown && isMobile && (
        <div className="cvnav__mobile-template-sheet">
          <div className="cvnav__mobile-sheet-header">
            <span>Choose Template</span>
            <button onClick={() => setShowTemplateDropdown(false)}>
              <i className="fas fa-times"></i>
            </button>
          </div>
          {TEMPLATE_GROUPS.map((group) => (
            <div key={group.label} style={{ marginBottom: 12 }}>
              <div
                className="cvnav__template-group-label"
                style={{ padding: "0 16px 4px" }}
              >
                {group.label}
              </div>
              {group.templates.map((idx) => (
                <button
                  key={idx}
                  className={`cvnav__mobile-template-option ${template === idx ? "cvnav__template-option--active" : ""}`}
                  onClick={() => {
                    setTemplate(idx);
                    setAccent(TEMPLATE_INFO[idx]?.accent || ACCENT[0]);
                    setShowTemplateDropdown(false);
                  }}
                >
                  <span
                    className="cvnav__template-dot"
                    style={{ background: TEMPLATE_INFO[idx]?.accent || "#6699FF" }}
                  />
                  <span>{TEMPLATES[idx]}</span>
                  {template === idx && (
                    <i
                      className="fas fa-check"
                      style={{ marginLeft: "auto", color: "#9D00FF" }}
                    ></i>
                  )}
                </button>
              ))}
            </div>
          ))}
        </div>
      )}
    </>
  );
}