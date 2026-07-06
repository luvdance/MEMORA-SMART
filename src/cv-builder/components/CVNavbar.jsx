import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TEMPLATES, ACCENT, FONT_OPTIONS, THEME_PRESETS } from "../utils/constants";
import { TEMPLATE_INFO } from "../utils/sampleCV";
import cvLogo from "../../assets/cv logo.png";

// Template groups for the dropdown
const TEMPLATE_GROUPS = [
  {
    label: "Classic",
    templates: [0, 2, 5, 6, 9], // Classic Pro, Executive Plus, Corporate Bold, Traditional, Compact Pro
  },
  {
    label: "Modern",
    templates: [1, 8, 7, 11], // Modern Edge, Modern Timeline, Editorial Modern, Horizon
  },
  {
    label: "Signature",
    templates: [3, 4, 10, 12], // Minimal Clean, Creative Side, Bold Statement, Refined
  },
];

export default function CVNavbar({
  template, setTemplate, accent, setAccent,
  tab, setTab, onPrint, onDownload, pdfLoading,
  onSave, onShare, onClear,
  saving, saveStatus, isOwner, user,
  format, setFormat, theme, setTheme, onOpenCustomize,
}) {
  const navigate = useNavigate();
  const upd = (key, val) => setFormat((f) => ({ ...f, [key]: val }));

  const [showTemplateDropdown, setShowTemplateDropdown] = useState(false);
  const [showMoreDropdown, setShowMoreDropdown] = useState(false);
  const [showFormatPanel, setShowFormatPanel] = useState(false);
  const [showOrderPanel, setShowOrderPanel] = useState(false);

  const closeAll = () => {
    setShowTemplateDropdown(false);
    setShowMoreDropdown(false);
  };

  const currentTemplateName = TEMPLATES[template] || "Select Template";
  const currentAccent = TEMPLATE_INFO[template]?.accent || accent;

  return (
    <>
      <nav className="cvnav">

        {/* ── LEFT — Brand ── */}
        <div className="cvnav__left">
          <button
            className="cvnav__brand"
            onClick={() => navigate("/cv-builder")}
            aria-label="Back to CV Builder home"
          >
            <img src={cvLogo} alt="Memora" className="cvnav__logo" />
          </button>
        </div>

        {/* ── CENTER — Design tools ── */}
        <div className="cvnav__center">

          {/* Template picker */}
          <div className="cvnav__dropdown-wrap" onBlur={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget)) setShowTemplateDropdown(false);
          }}>
            <button
              className="cvnav__template-btn"
              onClick={() => { setShowTemplateDropdown(v => !v); setShowMoreDropdown(false); }}
              aria-expanded={showTemplateDropdown}
              aria-haspopup="listbox"
            >
              <span
                className="cvnav__template-dot"
                style={{ background: TEMPLATE_INFO[template]?.accent || accent }}
              />
              <span className="cvnav__template-name">{currentTemplateName}</span>
              <i className={`fas fa-chevron-down cvnav__chevron ${showTemplateDropdown ? "cvnav__chevron--open" : ""}`}></i>
            </button>

            {showTemplateDropdown && (
              <div className="cvnav__template-dropdown" role="listbox">
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
                          role="option"
                          aria-selected={template === idx}
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
                aria-label={`Set accent to ${color}`}
                title={color}
              />
            ))}
          </div>

          <div className="cvnav__divider" />

          {/* Format */}
          <button
            className={`cvnav__tool-btn ${showFormatPanel ? "cvnav__tool-btn--active" : ""}`}
            onClick={() => { onOpenCustomize(); closeAll(); }}
          >
            <i className="fas fa-sliders-h"></i>
            <span>Format</span>
          </button>

        </div>

        {/* ── RIGHT — Output actions ── */}
        <div className="cvnav__right">

          {/* Save status */}
          {saveStatus && (
            <span className={`cvnav__save-status ${saveStatus === "saved" ? "cvnav__save-status--saved" : saveStatus === "error" ? "cvnav__save-status--error" : ""}`}>
              {saveStatus === "saving" && <><i className="fas fa-circle-notch fa-spin"></i> Saving</>}
              {saveStatus === "saved" && <><i className="fas fa-check"></i> Saved</>}
              {saveStatus === "error" && <><i className="fas fa-exclamation-circle"></i> Error</>}
            </span>
          )}

          {/* Save */}
          {isOwner && (
            <button
              className="cvnav__action-btn"
              onClick={onSave}
              disabled={saving}
              title="Save CV"
            >
              <i className="fas fa-save"></i>
              <span>Save</span>
            </button>
          )}

          {/* Share */}
          <button
            className="cvnav__action-btn"
            onClick={onShare}
            title="Share CV"
          >
            <i className="fas fa-share-alt"></i>
            <span>Share</span>
          </button>

          {/* Download — primary CTA */}
          <button
            className="cvnav__download-btn"
            onClick={onDownload}
            disabled={pdfLoading}
            title="Download PDF"
          >
            {pdfLoading ? (
              <><i className="fas fa-circle-notch fa-spin"></i> <span>Generating...</span></>
            ) : (
              <><i className="fas fa-download"></i> <span>Download</span></>
            )}
          </button>

          {/* ⋯ More — Print, About, Clear */}
          <div className="cvnav__dropdown-wrap" onBlur={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget)) setShowMoreDropdown(false);
          }}>
            <button
              className="cvnav__more-btn"
              onClick={() => { setShowMoreDropdown(v => !v); setShowTemplateDropdown(false); }}
              aria-label="More options"
              aria-expanded={showMoreDropdown}
              aria-haspopup="menu"
            >
              <i className="fas fa-ellipsis-h"></i>
            </button>

            {showMoreDropdown && (
              <div className="cvnav__more-dropdown" role="menu">
                <button
                  className="cvnav__more-item"
                  onClick={() => { onPrint(); setShowMoreDropdown(false); }}
                  role="menuitem"
                >
                  <i className="fas fa-print"></i> Print
                </button>
                <button
                  className="cvnav__more-item"
                  onClick={() => { navigate("/"); setShowMoreDropdown(false); }}
                  role="menuitem"
                >
                  <i className="fas fa-info-circle"></i> About
                </button>
                <div className="cvnav__more-divider" />
                <button
                  className="cvnav__more-item cvnav__more-item--danger"
                  onClick={() => { onClear(); setShowMoreDropdown(false); }}
                  role="menuitem"
                >
                  <i className="fas fa-trash"></i> Clear CV
                </button>
              </div>
            )}
          </div>

        </div>

        {/* ── MOBILE TABS ── */}
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
            onClick={() => { setShowMoreDropdown(v => !v); }}
          >
            <i className="fas fa-ellipsis-h"></i>
            <span>More</span>
          </button>
        </div>

        {/* Mobile more dropdown */}
        {showMoreDropdown && (
          <div className="cvnav__mobile-more" role="menu">
            <button className="cvnav__mobile-more-item" onClick={() => { setShowTemplateDropdown(v => !v); setShowMoreDropdown(false); }}>
              <i className="fas fa-paint-brush"></i> Change Template
            </button>
            <button className="cvnav__mobile-more-item" onClick={() => { onOpenCustomize(); setShowMoreDropdown(false); }}>
              <i className="fas fa-sliders-h"></i> Format
            </button>
            <button className="cvnav__mobile-more-item" onClick={() => { onShare(); setShowMoreDropdown(false); }}>
              <i className="fas fa-share-alt"></i> Share
            </button>
            <button className="cvnav__mobile-more-item" onClick={() => { onPrint(); setShowMoreDropdown(false); }}>
              <i className="fas fa-print"></i> Print
            </button>
            <div className="cvnav__more-divider" />
            <button className="cvnav__mobile-more-item cvnav__more-item--danger" onClick={() => { onClear(); setShowMoreDropdown(false); }}>
              <i className="fas fa-trash"></i> Clear CV
            </button>
          </div>
        )}

      </nav>

      {/* Mobile template dropdown (full-width sheet) */}
      {showTemplateDropdown && (
        <div className="cvnav__mobile-template-sheet">
          <div className="cvnav__mobile-sheet-header">
            <span>Choose Template</span>
            <button onClick={() => setShowTemplateDropdown(false)}>
              <i className="fas fa-times"></i>
            </button>
          </div>
          {TEMPLATE_GROUPS.map((group) => (
            <div key={group.label} style={{ marginBottom: 12 }}>
              <div className="cvnav__template-group-label" style={{ padding: "0 16px" }}>{group.label}</div>
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
                  {template === idx && <i className="fas fa-check" style={{ marginLeft: "auto", color: "#9D00FF" }}></i>}
                </button>
              ))}
            </div>
          ))}
        </div>
      )}
    </>
  );
}