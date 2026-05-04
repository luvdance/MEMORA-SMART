import { useNavigate } from "react-router-dom";
import { TEMPLATES, ACCENT, FONT_OPTIONS, THEME_PRESETS } from "../utils/constants";

export default function CVNavbar({
  template, setTemplate, accent, setAccent,
  tab, setTab, onPrint, onDownload, pdfLoading,
  onSave, onShare, onClear,
  saving, saveStatus, isOwner, user,
  format, setFormat, theme, setTheme, onOpenCustomize,
}) {
  const navigate = useNavigate();
  const upd = (key, val) => setFormat((f) => ({ ...f, [key]: val }));

  return (
    <nav className="cv-navbar">

      {/* ══════════════════════════════════════
          TOP BAR — Brand + Action Buttons
      ══════════════════════════════════════ */}
      <div className="cv-navbar__top">

        {/* LEFT: Brand */}
        <div className="cv-navbar__brand">
          <button className="cv-navbar__back" onClick={() => navigate("/dashboard")}>
            <i className="fas fa-long-arrow-alt-left"></i>
            <span className="cv-btn-label">Dashboard</span>
          </button>
          <div className="cv-navbar__divider" />
          <div className="cv-navbar__brand-text">
            <h1 className="cv-navbar__title">
              <i className="fas fa-file-alt"></i> CV Builder
            </h1>
            <p className="cv-navbar__subtitle">AI-Powered · Multiple Templates · PDF Export</p>
          </div>
        </div>

        {/* RIGHT: Action Buttons */}
        <div className="cv-navbar__actions">

          {/* ABOUT */}
          <button className="cv-navbar__btn" onClick={() => navigate("/cv-builder")} title="About">
            <i className="fas fa-info-circle"></i>
            <span className="cv-btn-label">About</span>
          </button>

          {/* SAVE STATUS */}
          {saveStatus === "saved" && (
            <span className="cv-navbar__save-status cv-navbar__save-status--saved">
              <i className="fas fa-check-circle"></i> Saved
            </span>
          )}
          {saveStatus === "saving" && (
            <span className="cv-navbar__save-status">
              <i className="fas fa-spinner fa-spin"></i> Saving...
            </span>
          )}
          {saveStatus === "error" && (
            <span className="cv-navbar__save-status cv-navbar__save-status--error">
              <i className="fas fa-exclamation-circle"></i> Error
            </span>
          )}

          {/* SAVE */}
          {isOwner && (
            <button className="cv-navbar__btn" onClick={onSave} disabled={saving} title="Save">
              <i className="fas fa-save"></i>
              <span className="cv-btn-label">{saving ? "Saving..." : "Save"}</span>
            </button>
          )}

          {/* CLEAR */}
          {isOwner && (
            <button className="cv-navbar__clear" onClick={onClear} title="Clear">
              <i className="fas fa-eraser"></i>
              <span className="cv-btn-label">Clear</span>
            </button>
          )}

          {/* SHARE */}
          <button className="cv-navbar__btn" onClick={onShare} title="Share">
            <i className="fas fa-share-alt"></i>
            <span className="cv-btn-label">Share</span>
          </button>

          {/* PRINT */}
          <button className="cv-navbar__btn" onClick={onPrint} title="Print">
            <i className="fas fa-print"></i>
            <span className="cv-btn-label">Print</span>
          </button>

          {/* DOWNLOAD PDF */}
          <button
            className="cv-navbar__download"
            onClick={onDownload}
            disabled={pdfLoading}
            title="Download PDF"
          >
            {pdfLoading ? (
              <>
                <i className="fas fa-spinner fa-spin"></i>
                <span className="cv-btn-label">Generating...</span>
              </>
            ) : (
              <>
                <i className="fas fa-download"></i>
                <span className="cv-btn-label">Download PDF</span>
              </>
            )}
          </button>

        </div>
      </div>

      {/* ══════════════════════════════════════
          TAB BAR — Form/Preview Toggle + Customize
      ══════════════════════════════════════ */}
      <div className="cv-navbar__tabbar">
        <div className="cv-navbar__tabs">
          <button
            onClick={() => setTab("form")}
            className={`cv-navbar__tab ${tab === "form" ? "cv-navbar__tab--active" : ""}`}
          >
            <i className="fas fa-edit"></i>
            <span>Form</span>
          </button>
          <button
            onClick={() => setTab("preview")}
            className={`cv-navbar__tab ${tab === "preview" ? "cv-navbar__tab--active" : ""}`}
          >
            <i className="fas fa-eye"></i>
            <span>Preview</span>
          </button>
        </div>

        {/* MOBILE-ONLY CUSTOMIZE BUTTON */}
        <button
          onClick={onOpenCustomize}
          className="cvb-mobile-customize-btn"
          title="Customize design"
        >
          <i className="fas fa-sliders-h"></i>
          <span>Customize</span>
        </button>
      </div>

      {/* ══════════════════════════════════════
          DESKTOP FORMAT TOOLBAR (hidden on mobile)
      ══════════════════════════════════════ */}
      <div className="cv-fmt-bar">

        {/* ── ROW 1: DESIGN ── */}
        <div className="cv-fmt-row">
          <span className="cv-fmt-row__label">Design</span>

          {/* TEMPLATE */}
          <div className="cv-fmt-group">
            <span className="cv-fmt-group__label">Template</span>
            <div className="cv-fmt-group__body">
              {TEMPLATES.map((t, i) => (
                <button
                  key={i}
                  onClick={() => setTemplate(i)}
                  className={`cv-fmt-chip ${template === i ? "cv-fmt-chip--active" : ""}`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="cv-fmt-sep" />

          {/* ACCENT */}
          <div className="cv-fmt-group">
            <span className="cv-fmt-group__label">Accent</span>
            <div className="cv-fmt-group__body">
              {ACCENT.map((c, i) => (
                <button
                  key={i}
                  onClick={() => setAccent(c)}
                  className="cv-fmt-dot"
                  style={{
                    background: c,
                    border: accent === c ? "2.5px solid #222" : "2px solid transparent",
                    outline: accent === c ? `2px solid ${c}55` : "none",
                  }}
                />
              ))}
            </div>
          </div>

          <div className="cv-fmt-sep" />

          {/* THEME */}
          <div className="cv-fmt-group">
            <span className="cv-fmt-group__label">Theme</span>
            <div className="cv-fmt-group__body">
              {THEME_PRESETS.map((preset, i) => (
                <button
                  key={i}
                  onClick={() => setTheme({ bg: preset.bg, text: preset.text, sidebar: preset.sidebar })}
                  className="cv-fmt-dot"
                  title={preset.label}
                  style={{
                    background: preset.bg,
                    border: theme.bg === preset.bg ? "2.5px solid #222" : "1px solid #ccc",
                    outline: theme.bg === preset.bg ? "2px solid #9D00FF55" : "none",
                  }}
                />
              ))}
              <div className="cv-fmt-sep cv-fmt-sep--sm" />
              <input
                type="color"
                className="cv-fmt-color-input"
                value={theme.bg}
                onChange={(e) => setTheme(t => ({ ...t, bg: e.target.value }))}
                title="Background"
              />
              <input
                type="color"
                className="cv-fmt-color-input"
                value={theme.text}
                onChange={(e) => setTheme(t => ({ ...t, text: e.target.value }))}
                title="Text color"
              />
              <input
                type="color"
                className="cv-fmt-color-input"
                value={theme.sidebar}
                onChange={(e) => setTheme(t => ({ ...t, sidebar: e.target.value }))}
                title="Sidebar color"
              />
            </div>
          </div>
        </div>

        {/* ── ROW 2: TEXT ── */}
        <div className="cv-fmt-row">
          <span className="cv-fmt-row__label">Text</span>

          {/* FONT FAMILY */}
          <div className="cv-fmt-group">
            <span className="cv-fmt-group__label">Font</span>
            <div className="cv-fmt-group__body">
              <select
                className="cv-fmt-select"
                value={format.fontFamily}
                onChange={(e) => upd("fontFamily", e.target.value)}
              >
                {FONT_OPTIONS.map((f) => (
                  <option key={f.value} value={f.value} style={{ fontFamily: f.value }}>
                    {f.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="cv-fmt-sep" />

          {/* NAME SIZE & STYLE */}
          <div className="cv-fmt-group">
            <span className="cv-fmt-group__label">Name</span>
            <div className="cv-fmt-group__body">
              <button
                className="cv-fmt-step-btn"
                onClick={() => upd("nameFontSize", Math.max(16, format.nameFontSize - 1))}
              >−</button>
              <span className="cv-fmt-step-val">{format.nameFontSize}px</span>
              <button
                className="cv-fmt-step-btn"
                onClick={() => upd("nameFontSize", Math.min(32, format.nameFontSize + 1))}
              >+</button>
              <div className="cv-fmt-sep cv-fmt-sep--sm" />
              <button
                className={`cv-fmt-style-btn ${format.nameBold ? "cv-fmt-style-btn--active" : ""}`}
                onClick={() => upd("nameBold", !format.nameBold)}
                title="Bold"
              >
                <b>B</b>
              </button>
              <button
                className={`cv-fmt-style-btn ${format.nameItalic ? "cv-fmt-style-btn--active" : ""}`}
                onClick={() => upd("nameItalic", !format.nameItalic)}
                title="Italic"
              >
                <em>I</em>
              </button>
            </div>
          </div>

          <div className="cv-fmt-sep" />

          {/* BODY SIZE */}
          <div className="cv-fmt-group">
            <span className="cv-fmt-group__label">Body</span>
            <div className="cv-fmt-group__body">
              <button
                className="cv-fmt-step-btn"
                onClick={() => upd("bodyFontSize", Math.max(8, format.bodyFontSize - 1))}
              >−</button>
              <span className="cv-fmt-step-val">{format.bodyFontSize}px</span>
              <button
                className="cv-fmt-step-btn"
                onClick={() => upd("bodyFontSize", Math.min(14, format.bodyFontSize + 1))}
              >+</button>
            </div>
          </div>

          <div className="cv-fmt-sep" />

          {/* HEADING STYLE */}
          <div className="cv-fmt-group">
            <span className="cv-fmt-group__label">Headings</span>
            <div className="cv-fmt-group__body">
              <button
                className={`cv-fmt-style-btn ${format.headingBold ? "cv-fmt-style-btn--active" : ""}`}
                onClick={() => upd("headingBold", !format.headingBold)}
                title="Bold"
              >
                <b>B</b>
              </button>
              <button
                className={`cv-fmt-style-btn ${format.headingItalic ? "cv-fmt-style-btn--active" : ""}`}
                onClick={() => upd("headingItalic", !format.headingItalic)}
                title="Italic"
              >
                <em>I</em>
              </button>
              <button
                className={`cv-fmt-style-btn ${format.headingUppercase ? "cv-fmt-style-btn--active" : ""}`}
                onClick={() => upd("headingUppercase", !format.headingUppercase)}
                title="Uppercase"
              >
                AA
              </button>
            </div>
          </div>

          <div className="cv-fmt-sep" />

          {/* LINE SPACING */}
          <div className="cv-fmt-group">
            <span className="cv-fmt-group__label">Spacing</span>
            <div className="cv-fmt-group__body">
              <button
                className="cv-fmt-step-btn"
                onClick={() => upd("lineHeight", Math.max(1.2, Math.round((format.lineHeight - 0.1) * 10) / 10))}
              >−</button>
              <span className="cv-fmt-step-val">{format.lineHeight}</span>
              <button
                className="cv-fmt-step-btn"
                onClick={() => upd("lineHeight", Math.min(2.0, Math.round((format.lineHeight + 0.1) * 10) / 10))}
              >+</button>
            </div>
          </div>

        </div>
      </div>
    </nav>
  );
}