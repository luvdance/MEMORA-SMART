import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import CVNavbar from "../cv-builder/components/CVNavbar";
import CVForm from "../cv-builder/components/CVForm";
import CVPreview from "../cv-builder/components/CVPreview";
import { emptyCV, ACCENT, defaultFormat, defaultTheme, DEFAULT_SECTION_ORDER } from "../cv-builder/utils/constants";
import { saveCV, loadCV } from "../cv-builder/utils/cvService";
import { useAuth } from "../context/AuthContext";
import "../cv-builder/CVBuilder.css";
import { printCV } from "../cv-builder/utils/printEngine";
import { downloadCVPdf } from "../cv-builder/utils/pdfEngine";
import CVQuickDesign from "../cv-builder/components/CVQuickDesign";

const LOCAL_KEY = "memora_cv_draft";

export default function CVBuilder() {
  const { cvId: urlCvId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const getSavedDraft = () => {
    try {
      const saved = localStorage.getItem(LOCAL_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return null;
  };
  const draft = getSavedDraft();

  const [cv, setCV] = useState(draft?.cv || emptyCV);
  const [template, setTemplate] = useState(draft?.template ?? 0);
  const [accent, setAccent] = useState(draft?.accent || ACCENT[0]);
  const [format, setFormat] = useState(draft?.format || defaultFormat);
  const [theme, setTheme] = useState(draft?.theme || defaultTheme);
  const [sectionOrder, setSectionOrder] = useState(draft?.sectionOrder || DEFAULT_SECTION_ORDER);
  const [step, setStep] = useState(0);
  const [tab, setTab] = useState("form");
  const [cvId, setCvId] = useState(urlCvId || null);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState("");
  const [shareUrl, setShareUrl] = useState("");
  const [showShareModal, setShowShareModal] = useState(false);
  const [showDownloadGate, setShowDownloadGate] = useState(false);
  const [showClearModal, setShowClearModal] = useState(false);
  const [showCustomizeSheet, setShowCustomizeSheet] = useState(false);  // ← NEW
  const [isOwner, setIsOwner] = useState(true);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  const previewRef = useRef();

  const openMore = () => setShowMoreMenu(true);
  const closeMore = () => setShowMoreMenu(false);

  const handlePrint = () => {
    printCV({ previewRef, cv, theme, format });
  };

  const handleDownloadPDF = async () => {
    if (!user) {
      setShowDownloadGate(true);
      return;
    }
    setPdfLoading(true);
    try {
      await downloadCVPdf({ previewRef, cv, theme, format });
    } catch (err) {
      console.error(err);
      alert(err.message || "PDF download failed. Please try the Print option instead.");
    }
    setPdfLoading(false);
  };

  useEffect(() => {
    if (urlCvId) return;
    try {
      localStorage.setItem(LOCAL_KEY, JSON.stringify({
        cv, template, accent, format, sectionOrder, theme
      }));
    } catch (e) {}
  }, [cv, template, accent, format, sectionOrder, theme, urlCvId]);

  useEffect(() => {
    if (urlCvId) {
      loadCV(urlCvId).then((data) => {
        if (data) {
          setCV(data.data);
          setTemplate(data.template);
          setAccent(data.accent);
          if (data.format) setFormat(data.format);
          if (data.sectionOrder) setSectionOrder(data.sectionOrder);
          if (data.theme) setTheme(data.theme);
          setCvId(urlCvId);
          setIsOwner(user?.uid === data.ownerId);
        }
      });
    }
  }, [urlCvId, user]);

  // Lock body scroll when bottom sheet open
 useEffect(() => {
    document.body.style.overflow = (showCustomizeSheet || showMoreMenu) ? "hidden" : "";
  }, [showCustomizeSheet, showMoreMenu]);

  const handleSave = async () => {
    if (!user) {
      navigate("/auth", { state: { from: `/dashboard/cv-builder` } });
      return;
    }
    setSaving(true);
    setSaveStatus("saving");
    try {
      const id = await saveCV({
        cvId,
        userId: user.uid,
        cvData: cv,
        template,
        accent,
        format,
        sectionOrder,
        theme,
        title: cv.name ? `${cv.name}'s CV` : "My CV",
      });
      setCvId(id);
      setSaveStatus("saved");
      window.history.replaceState(null, "", `/cv/${id}`);
      setTimeout(() => setSaveStatus(""), 3000);
    } catch (err) {
      console.error(err);
      setSaveStatus("error");
      setTimeout(() => setSaveStatus(""), 3000);
    }
    setSaving(false);
  };

  const handleShare = async () => {
    if (!cvId) await handleSave();
    const url = `${window.location.origin}/cv/${cvId}`;
    setShareUrl(url);
    setShowShareModal(true);
  };

  const copyLink = () => {
  navigator.clipboard.writeText(shareUrl);
  setCopied(true);
  setTimeout(() => setCopied(false), 2000);
};

  const handleClear = () => {
    setCV(emptyCV);
    setTemplate(0);
    setAccent(ACCENT[0]);
    setFormat(defaultFormat);
    setTheme(defaultTheme);
    setSectionOrder(DEFAULT_SECTION_ORDER);
    setStep(0);
    setCvId(null);
    localStorage.removeItem(LOCAL_KEY);
    setShowClearModal(false);
    window.history.replaceState(null, "", `/dashboard/cv-builder`);
  };

  const openCustomize = () => setShowCustomizeSheet(true);
  const closeCustomize = () => setShowCustomizeSheet(false);

  return (
    <div className="cvb">

      <CVNavbar
        template={template} setTemplate={setTemplate}
        accent={accent} setAccent={setAccent}
        tab={tab} setTab={setTab}
        onPrint={handlePrint}
        onDownload={handleDownloadPDF}
        pdfLoading={pdfLoading}
        onSave={handleSave}
        onShare={handleShare}
        onClear={() => setShowClearModal(true)}
        saving={saving}
        saveStatus={saveStatus}
        isOwner={isOwner}
        user={user}
        format={format}
        setFormat={setFormat}
        theme={theme}
        setTheme={setTheme}
        onOpenCustomize={openCustomize}
      />

      <div className="cvb__body" data-active-tab={tab}>

        <CVQuickDesign
          template={template} setTemplate={setTemplate}
          accent={accent} setAccent={setAccent}
          theme={theme} setTheme={setTheme}
          sectionOrder={sectionOrder} setSectionOrder={setSectionOrder}
          format={format} setFormat={setFormat}
        />

        <CVForm
          cv={cv} setCV={setCV}
          template={template}
          step={step} setStep={setStep}
          tab={tab}
        />

        <CVPreview
          cv={cv} accent={accent}
          template={template}
          previewRef={previewRef}
          tab={tab}
          format={format}
          setFormat={setFormat}
          sectionOrder={sectionOrder}
          setSectionOrder={setSectionOrder}
          theme={theme}
        />

      </div>

      {/* ── MOBILE BOTTOM SHEET (Customize) ── */}
      <div className={`cvb-bottom-sheet-backdrop ${showCustomizeSheet ? "open" : ""}`} onClick={closeCustomize}></div>
      <div className={`cvb-bottom-sheet ${showCustomizeSheet ? "open" : ""}`}>
        <div className="cvb-bottom-sheet-header">
          <h3>Customize CV</h3>
          <button className="cvb-bottom-sheet-close" onClick={closeCustomize}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        <div className="cvb-bottom-sheet-body">

          {/* Template selector */}
          <div className="cv-fmt-group">
            <span className="cv-fmt-group-label">Template</span>
            <select
              value={template}
              onChange={(e) => setTemplate(Number(e.target.value))}
            >
              <option value={0}>Classic Pro</option>
              <option value={1}>Modern Edge</option>
              <option value={2}>Executive Plus</option>
              <option value={3}>Minimal Clean</option>
              <option value={4}>Creative Side</option>
              <option value={5}>Corporate Bold</option>
              <option value={6}>Traditional Profile</option>
            </select>
          </div>

          {/* Accent color */}
          <div className="cv-fmt-group">
            <span className="cv-fmt-group-label">Accent Color</span>
            <input
              type="color"
              value={accent}
              onChange={(e) => setAccent(e.target.value)}
            />
          </div>

          {/* Theme colors */}
          <div className="cv-fmt-group">
            <span className="cv-fmt-group-label">Background</span>
            <input
              type="color"
              value={theme.bg}
              onChange={(e) => setTheme({ ...theme, bg: e.target.value })}
            />
          </div>

          <div className="cv-fmt-group">
            <span className="cv-fmt-group-label">Text Color</span>
            <input
              type="color"
              value={theme.text}
              onChange={(e) => setTheme({ ...theme, text: e.target.value })}
            />
          </div>

          {/* Font family */}
          <div className="cv-fmt-group">
            <span className="cv-fmt-group-label">Font</span>
            <select
              value={format.fontFamily}
              onChange={(e) => setFormat({ ...format, fontFamily: e.target.value })}
            >
              <option value="Source Serif 4">Georgia (Serif)</option>
              <option value="Inter">Helvetica (Sans)</option>
              <option value="Source Sans 3">Calibri</option>
              <option value="EB Garamond">Garamond</option>
              <option value="Cormorant Garamond">Palatino</option>
              <option value="DM Sans">Verdana</option>
              <option value="Manrope">Trebuchet</option>
              <option value="Lora">Lora</option>
            </select>
          </div>

          {/* Name size */}
          <div className="cv-fmt-group">
            <span className="cv-fmt-group-label">Name Size: {format.nameFontSize}px</span>
            <input
              type="range"
              min="14"
              max="36"
              value={format.nameFontSize}
              onChange={(e) => setFormat({ ...format, nameFontSize: Number(e.target.value) })}
            />
          </div>

          {/* Body size */}
          <div className="cv-fmt-group">
            <span className="cv-fmt-group-label">Body Size: {format.bodyFontSize}px</span>
            <input
              type="range"
              min="8"
              max="14"
              value={format.bodyFontSize}
              onChange={(e) => setFormat({ ...format, bodyFontSize: Number(e.target.value) })}
            />
          </div>

          {/* Heading size */}
          <div className="cv-fmt-group">
            <span className="cv-fmt-group-label">Heading Size: {format.headingFontSize}px</span>
            <input
              type="range"
              min="9"
              max="16"
              value={format.headingFontSize}
              onChange={(e) => setFormat({ ...format, headingFontSize: Number(e.target.value) })}
            />
          </div>

          {/* Spacing */}
          <div className="cv-fmt-group">
            <span className="cv-fmt-group-label">Page Padding: {format.pagePadding}px</span>
            <input
              type="range"
              min="12"
              max="48"
              value={format.pagePadding}
              onChange={(e) => setFormat({ ...format, pagePadding: Number(e.target.value) })}
            />
          </div>

          {/* Line height */}
          <div className="cv-fmt-group">
            <span className="cv-fmt-group-label">Line Spacing: {format.lineHeight}</span>
            <input
              type="range"
              min="1"
              max="2"
              step="0.1"
              value={format.lineHeight}
              onChange={(e) => setFormat({ ...format, lineHeight: Number(e.target.value) })}
            />
          </div>

          {/* Style toggles */}
          <div className="cv-fmt-group">
            <span className="cv-fmt-group-label">Heading Style</span>
            <div className="cv-fmt-row">
              <button
                className={`cv-fmt-style-btn ${format.headingBold ? "active" : ""}`}
                onClick={() => setFormat({ ...format, headingBold: !format.headingBold })}
                style={{ fontWeight: 700 }}
              >
                Bold
              </button>
              <button
                className={`cv-fmt-style-btn ${format.headingItalic ? "active" : ""}`}
                onClick={() => setFormat({ ...format, headingItalic: !format.headingItalic })}
                style={{ fontStyle: "italic" }}
              >
                Italic
              </button>
              <button
                className={`cv-fmt-style-btn ${format.headingUppercase ? "active" : ""}`}
                onClick={() => setFormat({ ...format, headingUppercase: !format.headingUppercase })}
              >
                AA
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* ── EXISTING MODALS ── */}
      {showClearModal && (
        <div className="cvb-modal" onClick={() => setShowClearModal(false)}>
          <div className="cvb-modal__box" onClick={(e) => e.stopPropagation()}>
            <div className="cvb-modal__icon cvb-modal__icon--lock">
              <i className="fas fa-eraser"></i>
            </div>
            <h3>Clear CV?</h3>
            <p>This will erase all content in the CV builder including your local draft. This cannot be undone.</p>
            <div className="cvb-modal__actions">
              <button className="myworks__delete-confirm" onClick={handleClear}>
                <i className="fas fa-eraser"></i> Yes, Clear Everything
              </button>
              <button className="cvb-modal__close" onClick={() => setShowClearModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

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
              <button className={`cvb-modal__copy-btn ${copied ? "cvb-modal__copy-btn--copied" : ""}`} onClick={copyLink}>
                {copied ? (
                  <>
                    <i className="fas fa-check"></i> Copied!
                  </>
                ) : (
                  <>
                    <i className="fas fa-copy"></i> Copy
                  </>
                )}
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

      {showDownloadGate && (
        <div className="cvb-modal" onClick={() => setShowDownloadGate(false)}>
          <div className="cvb-modal__box" onClick={(e) => e.stopPropagation()}>
            <div className="cvb-modal__icon cvb-modal__icon--lock">
              <i className="fas fa-lock"></i>
            </div>
            <h3>Login to Download</h3>
            <p>You need a free Memora account to download your CV. Your progress will be saved automatically.</p>
            <div className="cvb-modal__actions">
              <button className="cvb-modal__primary" onClick={() => navigate("/auth", { state: { from: window.location.pathname } })}>
                <i className="fas fa-user-plus"></i> Create Free Account
              </button>
              <button className="cvb-modal__close" onClick={() => setShowDownloadGate(false)}>
                Maybe Later
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════
    MOBILE BOTTOM NAVIGATION BAR
══════════════════════════════════════ */}
<nav className="cvb-bottom-nav">
  <button
    className={`cvb-bottom-nav__item ${tab === "form" ? "cvb-bottom-nav__item--active" : ""}`}
    onClick={() => setTab("form")}
  >
    <i className="fas fa-edit"></i>
    <span>Form</span>
  </button>

  <button
    className={`cvb-bottom-nav__item ${tab === "preview" ? "cvb-bottom-nav__item--active" : ""}`}
    onClick={() => setTab("preview")}
  >
    <i className="fas fa-eye"></i>
    <span>Preview</span>
  </button>

  <button
    className={`cvb-bottom-nav__item ${saveStatus === "saved" ? "cvb-bottom-nav__item--saved" : ""} ${saving ? "cvb-bottom-nav__item--saving" : ""}`}
    onClick={handleSave}
    disabled={saving}
  >
    {saving ? (
      <i className="fas fa-spinner fa-spin"></i>
    ) : saveStatus === "saved" ? (
      <i className="fas fa-check-circle"></i>
    ) : (
      <i className="fas fa-save"></i>
    )}
    <span>{saving ? "Saving" : saveStatus === "saved" ? "Saved" : "Save"}</span>
  </button>

  <button
    className="cvb-bottom-nav__item cvb-bottom-nav__item--download"
    onClick={handleDownloadPDF}
    disabled={pdfLoading}
  >
    {pdfLoading ? (
      <i className="fas fa-spinner fa-spin"></i>
    ) : (
      <i className="fas fa-download"></i>
    )}
    <span>{pdfLoading ? "..." : "Download"}</span>
  </button>

  <button
    className={`cvb-bottom-nav__item ${showMoreMenu ? "cvb-bottom-nav__item--active" : ""}`}
    onClick={openMore}
  >
    <i className="fas fa-ellipsis-h"></i>
    <span>More</span>
  </button>
</nav>

{/* ══════════════════════════════════════
    MORE MENU SHEET
══════════════════════════════════════ */}
<div
  className={`cvb-more-backdrop ${showMoreMenu ? "cvb-more-backdrop--open" : ""}`}
  onClick={closeMore}
></div>

<div className={`cvb-more-sheet ${showMoreMenu ? "cvb-more-sheet--open" : ""}`}>
  <div className="cvb-more-sheet__header">
    <h3 className="cvb-more-sheet__title">More options</h3>
    <button className="cvb-more-sheet__close" onClick={closeMore}>
      <i className="fas fa-times"></i>
    </button>
  </div>

  <div className="cvb-more-sheet__list">

    <button
      className="cvb-more-sheet__item"
      onClick={() => { closeMore(); openCustomize(); }}
    >
      <span className="cvb-more-sheet__item-icon">
        <i className="fas fa-sliders-h"></i>
      </span>
      <div className="cvb-more-sheet__item-text">
        <p className="cvb-more-sheet__item-label">Customize</p>
        <p className="cvb-more-sheet__item-sub">Fonts, sizes, spacing & colors</p>
      </div>
      <i className="fas fa-chevron-right" style={{ color: "#ccc", fontSize: "0.8rem" }}></i>
    </button>

    <button
      className="cvb-more-sheet__item"
      onClick={() => { closeMore(); handleShare(); }}
    >
      <span className="cvb-more-sheet__item-icon">
        <i className="fas fa-share-alt"></i>
      </span>
      <div className="cvb-more-sheet__item-text">
        <p className="cvb-more-sheet__item-label">Share CV</p>
        <p className="cvb-more-sheet__item-sub">Get a public link to share</p>
      </div>
      <i className="fas fa-chevron-right" style={{ color: "#ccc", fontSize: "0.8rem" }}></i>
    </button>

    <button
      className="cvb-more-sheet__item"
      onClick={() => { closeMore(); handlePrint(); }}
    >
      <span className="cvb-more-sheet__item-icon">
        <i className="fas fa-print"></i>
      </span>
      <div className="cvb-more-sheet__item-text">
        <p className="cvb-more-sheet__item-label">Print</p>
        <p className="cvb-more-sheet__item-sub">Open browser print dialog</p>
      </div>
      <i className="fas fa-chevron-right" style={{ color: "#ccc", fontSize: "0.8rem" }}></i>
    </button>

    <button
      className="cvb-more-sheet__item"
      onClick={() => { closeMore(); navigate("/cv-builder"); }}
    >
      <span className="cvb-more-sheet__item-icon">
        <i className="fas fa-info-circle"></i>
      </span>
      <div className="cvb-more-sheet__item-text">
        <p className="cvb-more-sheet__item-label">About CV Builder</p>
        <p className="cvb-more-sheet__item-sub">Learn more & view tutorial</p>
      </div>
      <i className="fas fa-chevron-right" style={{ color: "#ccc", fontSize: "0.8rem" }}></i>
    </button>

    {isOwner && (
      <>
        <div className="cvb-more-sheet__divider"></div>

        <button
          className="cvb-more-sheet__item cvb-more-sheet__item--danger"
          onClick={() => { closeMore(); setShowClearModal(true); }}
        >
          <span className="cvb-more-sheet__item-icon">
            <i className="fas fa-eraser"></i>
          </span>
          <div className="cvb-more-sheet__item-text">
            <p className="cvb-more-sheet__item-label">Clear CV</p>
            <p className="cvb-more-sheet__item-sub">Erase all content (cannot be undone)</p>
          </div>
        </button>
      </>
    )}

  </div>
</div>

    </div>
  );
}