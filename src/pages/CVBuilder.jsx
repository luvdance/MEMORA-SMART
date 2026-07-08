import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import CVNavbar from "../cv-builder/components/CVNavbar";
import CVForm from "../cv-builder/components/CVForm";
import CVPreview from "../cv-builder/components/CVPreview";
import CVQuickDesign from "../cv-builder/components/CVQuickDesign";
import { emptyCV, ACCENT, defaultFormat, defaultTheme, DEFAULT_SECTION_ORDER } from "../cv-builder/utils/constants";
import { saveCV, loadCV } from "../cv-builder/utils/cvService";
import { useAuth } from "../context/AuthContext";
import { checkDownloadAccess, recordDownload } from "../utils/userService";
import PaywallModal from "../components/PaywallModal";
import "../cv-builder/CVBuilder.css";
import { printCV } from "../cv-builder/utils/printEngine";
import { downloadCVPdf } from "../cv-builder/utils/pdfEngine";
import PaymentRequery from "../components/PaymentRequery";
import { track } from "../utils/analytics";
import { TEMPLATE_INFO } from "../cv-builder/utils/sampleCV";
import cvLogo from "../assets/cv logo.png";

const LOCAL_KEY = "memora_cv_draft";

export default function CVBuilder() {
  const { cvId: urlCvId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [showOptimizedBanner, setShowOptimizedBanner] = useState(false);

  // ── DRAFT RESTORE ──
  const getSavedDraft = () => {
    try {
      const saved = localStorage.getItem(LOCAL_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return null;
  };
  const draft = getSavedDraft();

  // ── CV STATE ──
  const [cv, setCV] = useState(draft?.cv || emptyCV);
  const [template, setTemplate] = useState(draft?.template ?? 0);
  const [accent, setAccent] = useState(draft?.accent || ACCENT[0]);
  const [format, setFormat] = useState(draft?.format || defaultFormat);
  const [theme, setTheme] = useState(draft?.theme || defaultTheme);
  const [sectionOrder, setSectionOrder] = useState(draft?.sectionOrder || DEFAULT_SECTION_ORDER);
  const [step, setStep] = useState(0);
  const [tab, setTab] = useState("form");
  const [cvId, setCvId] = useState(urlCvId || null);
  const [isOwner, setIsOwner] = useState(true);

  //format button
  const [showFormat, setShowFormat] = useState(false);
  const [showOrder, setShowOrder] = useState(false);

  // ── SAVE STATE ──
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState("");

  // ── DOWNLOAD STATE ──
  const [pdfLoading, setPdfLoading] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);

  // ── MODAL STATE ──
  const [shareUrl, setShareUrl] = useState("");
  const [showShareModal, setShowShareModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showDownloadGate, setShowDownloadGate] = useState(false);
  const [showClearModal, setShowClearModal] = useState(false);

  // ── MOBILE UI STATE ──
  const [showCustomizeSheet, setShowCustomizeSheet] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  //PAYWALL
  const [pendingAction, setPendingAction] = useState(null); // "print" | "download" | null
  const [showRequery, setShowRequery] = useState(false);

  const previewRef = useRef();

  //ACCENT FIRE
  // ── SYNC ACCENT TO TEMPLATE DEFAULT WHEN TEMPLATE CHANGES ──
useEffect(() => {
  const templateDefault = TEMPLATE_INFO[template]?.accent;
  if (templateDefault) {
    setAccent(templateDefault);
  }
}, [template]);

  // ── AUTO-SAVE TO LOCALSTORAGE ──
  useEffect(() => {
    if (urlCvId) return;
    try {
      localStorage.setItem(LOCAL_KEY, JSON.stringify({
        cv, template, accent, format, sectionOrder, theme
      }));
    } catch (e) {}
  }, [cv, template, accent, format, sectionOrder, theme, urlCvId]);

  // ── LOAD CV FROM URL ID ──
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

  // ── BODY SCROLL LOCK ──
  useEffect(() => {
    document.body.style.overflow = (showCustomizeSheet || showMoreMenu) ? "hidden" : "";
  }, [showCustomizeSheet, showMoreMenu]);

  // ── LOAD OPTIMIZED CV FROM ATS CHECKER ──
useEffect(() => {
  const isOptimized = searchParams.get("optimized") === "true";
  if (!isOptimized) return;

  try {
    const optimizedRaw = localStorage.getItem("optimized_cv");
    if (!optimizedRaw) return;

    const optimizedCV = JSON.parse(optimizedRaw);

    setCV(prev => ({
      ...prev,
      ...optimizedCV,
      experience: optimizedCV.experience?.length ? optimizedCV.experience : prev.experience,
      education: optimizedCV.education?.length ? optimizedCV.education : prev.education,
      certifications: optimizedCV.certifications?.length ? optimizedCV.certifications : prev.certifications,
    }));

    setShowOptimizedBanner(true);
    track("optimized_cv_loaded");

    // Clean up
    localStorage.removeItem("optimized_cv");
    localStorage.removeItem("optimized_cv_source");
    window.history.replaceState({}, "", "/dashboard/cv-builder");

    setTimeout(() => setShowOptimizedBanner(false), 8000);
  } catch (err) {
    console.error("Failed to load optimized CV:", err);
  }
}, [searchParams]);

  // ── PRINT ──
  const handlePrint = async () => {
  if (!user) {
    setShowDownloadGate(true);
    return;
  }
  try {
    const access = await checkDownloadAccess(user.uid);
    if (access.canDownload) {
      await recordDownload(user.uid, access);
      triggerPrint();
    } else {
      setPendingAction("print");
      track("paywall_shown", { action: "download" });
      setShowPaywall(true);
    }
  } catch (err) {
    console.error("Print access check failed:", err);
    triggerPrint();
  }
};

const triggerPrint = () => {
  printCV({ previewRef, cv, theme, format });
};

  // ── DOWNLOAD PDF (with paywall check) ──
  const handleDownloadPDF = async () => {
  if (!user) {
    setShowDownloadGate(true);
    return;
  }
  try {
    const access = await checkDownloadAccess(user.uid);
    if (access.canDownload) {
      await recordDownload(user.uid, access);
      await triggerPdfDownload();
    } else {
      setPendingAction("download"); 
      track("paywall_shown", { action: "download" });
      setShowPaywall(true);
    }
  } catch (err) {
    console.error("Download access check failed:", err);
    await triggerPdfDownload();
  }
};

  // ── TRIGGER ACTUAL PDF DOWNLOAD ──
  const triggerPdfDownload = async () => {
    setPdfLoading(true);
    try {
      await downloadCVPdf({ previewRef, cv, theme, format });
    } catch (err) {
      console.error(err);
      alert(err.message || "PDF download failed. Please try the Print option instead.");
    }
    setPdfLoading(false);
  };

  // ── PAYMENT SUCCESS HANDLER ──
  const handlePaymentSuccess = (type, result) => {
  track("payment_completed", { type });
  setShowPaywall(false);
  const action = pendingAction;
  setPendingAction(null);

  // Wait for webhook, then verify
  setTimeout(async () => {
    try {
      const access = await checkDownloadAccess(user.uid);
      if (access.canDownload) {
        await recordDownload(user.uid, access);
        if (action === "print") triggerPrint();
        else await triggerPdfDownload();
      } else {
        // Webhook didn't fire — try requerying with the reference
        if (result?.reference) {
          try {
            const requeryRes = await fetch("/api/requery-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                reference: result.reference,
                userId: user.uid,
              }),
            });
            const requeryData = await requeryRes.json();
            
            if (requeryData.success) {
              // Try the action again
              setTimeout(async () => {
                const newAccess = await checkDownloadAccess(user.uid);
                if (newAccess.canDownload) {
                  await recordDownload(user.uid, newAccess);
                  if (action === "print") triggerPrint();
                  else await triggerPdfDownload();
                }
              }, 1000);
            } else {
              alert("Your payment is processing. Please use 'Verify Payment' if access doesn't activate in a few minutes.");
              setShowRequery(true);
            }
          } catch (err) {
            console.error("Auto-requery failed:", err);
            setShowRequery(true);
          }
        } else {
          setShowRequery(true);
        }
      }
    } catch (err) {
      console.error(err);
      setShowRequery(true);
    }
  }, 2000);
};

  // ── SAVE ──
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

  // ── SHARE ──
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

  // ── CLEAR ──
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

  // ── MOBILE SHEET HANDLERS ──
  const openCustomize = () => setShowCustomizeSheet(true);
  const closeCustomize = () => setShowCustomizeSheet(false);
  const openMore = () => setShowMoreMenu(true);
  const closeMore = () => setShowMoreMenu(false);

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
        showFormat={showFormat}
        setShowFormat={setShowFormat}
        showOrder={showOrder}
        setShowOrder={setShowOrder}
      />

      {showOptimizedBanner && (
      <div className="cv-optimized-banner">
        <div className="cv-optimized-banner__icon">
          <i className="fas fa-magic"></i>
        </div>
        <div className="cv-optimized-banner__text">
          <strong>Your CV has been optimized by AI ✨</strong>
          <p>Review the changes below — edit anything before downloading. Pick a template on the right.</p>
        </div>
        <button
          className="cv-optimized-banner__close"
          onClick={() => setShowOptimizedBanner(false)}
          aria-label="Close"
        >
          <i className="fas fa-times"></i>
        </button>
      </div>
    )}

    {/* ATS QUICK ACTIONS */}
    <div className="cvb__ats-actions">
      <div className="cvb__ats-actions-label">
        <i className="fas fa-bolt"></i>
        <span>ATS Tools</span>
      </div>
      <div className="cvb__ats-actions-buttons">
        <button
          className="cvb__ats-btn"
          onClick={() => navigate("/ats-check")}
        >
          <i className="fas fa-search"></i>
          <span>Check ATS Score</span>
        </button>
        <button
          className="cvb__ats-btn cvb__ats-btn--secondary"
          onClick={() => navigate("/ats-check")}
        >
          <i className="fas fa-magic"></i>
          <span>Optimize with AI</span>
        </button>
      </div>
    </div>

      <div className="cvb__body" data-active-tab={tab}>

        {/* MOBILE-ONLY QUICK DESIGN PANEL */}
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
          showFormat={showFormat}
          setShowFormat={setShowFormat}
          showOrder={showOrder}
          setShowOrder={setShowOrder}
        />

      </div>

      {/* ── CUSTOMIZE BOTTOM SHEET ── */}
      <div
        className={`cvb-bottom-sheet-backdrop ${showCustomizeSheet ? "open" : ""}`}
        onClick={closeCustomize}
      ></div>
      <div className={`cvb-bottom-sheet ${showCustomizeSheet ? "open" : ""}`}>
        <div className="cvb-bottom-sheet-header">
          <h3>Customize CV</h3>
          <button className="cvb-bottom-sheet-close" onClick={closeCustomize}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        <div className="cvb-bottom-sheet-body">

          <div className="cv-fmt-group">
            <span className="cv-fmt-group-label">Template</span>
            <select value={template} onChange={(e) => setTemplate(Number(e.target.value))}>
              <option value={0}>Classic Pro</option>
              <option value={1}>Modern Edge</option>
              <option value={2}>Executive Plus</option>
              <option value={3}>Minimal Clean</option>
              <option value={4}>Creative Side</option>
              <option value={5}>Corporate Bold</option>
              <option value={6}>Traditional Profile</option>
              <option value={7}>Editorial Modern</option>
              <option value={8}>Modern Timeline</option>
              <option value={9}>Compact Pro</option>
              <option value={10}>Bold Statement</option>
              <option value={11}>Horizon</option>
              <option value={12}>Refined</option>
            </select>
          </div>

          <div className="cv-fmt-group">
            <span className="cv-fmt-group-label">Accent Color</span>
            <input type="color" value={accent} onChange={(e) => setAccent(e.target.value)} />
          </div>

          <div className="cv-fmt-group">
            <span className="cv-fmt-group-label">Background</span>
            <input type="color" value={theme.bg} onChange={(e) => setTheme({ ...theme, bg: e.target.value })} />
          </div>

          <div className="cv-fmt-group">
            <span className="cv-fmt-group-label">Text Color</span>
            <input type="color" value={theme.text} onChange={(e) => setTheme({ ...theme, text: e.target.value })} />
          </div>

          <div className="cv-fmt-group">
            <span className="cv-fmt-group-label">Font</span>
            <select value={format.fontFamily} onChange={(e) => setFormat({ ...format, fontFamily: e.target.value })}>
              <option value="Georgia, 'Source Serif 4', serif">Georgia</option>
              <option value="'Helvetica Neue', Helvetica, 'Inter', sans-serif">Helvetica</option>
              <option value="Calibri, 'Source Sans 3', 'Trebuchet MS', sans-serif">Calibri</option>
              <option value="Garamond, 'EB Garamond', 'Times New Roman', serif">Garamond</option>
              <option value="Arial, 'Inter', sans-serif">Arial</option>
              <option value="'Palatino Linotype', Palatino, 'Cormorant Garamond', serif">Palatino</option>
              <option value="Verdana, 'DM Sans', Geneva, sans-serif">Verdana</option>
              <option value="'Trebuchet MS', 'Manrope', sans-serif">Trebuchet</option>
            </select>
          </div>

          <div className="cv-fmt-group">
            <span className="cv-fmt-group-label">Name Size: {format.nameFontSize}px</span>
            <input type="range" min="14" max="36" value={format.nameFontSize}
              onChange={(e) => setFormat({ ...format, nameFontSize: Number(e.target.value) })} />
          </div>

          <div className="cv-fmt-group">
            <span className="cv-fmt-group-label">Body Size: {format.bodyFontSize}px</span>
            <input type="range" min="8" max="14" value={format.bodyFontSize}
              onChange={(e) => setFormat({ ...format, bodyFontSize: Number(e.target.value) })} />
          </div>

          <div className="cv-fmt-group">
            <span className="cv-fmt-group-label">Heading Size: {format.headingFontSize}px</span>
            <input type="range" min="9" max="16" value={format.headingFontSize}
              onChange={(e) => setFormat({ ...format, headingFontSize: Number(e.target.value) })} />
          </div>

          <div className="cv-fmt-group">
            <span className="cv-fmt-group-label">Page Padding: {format.pagePadding}px</span>
            <input type="range" min="12" max="48" value={format.pagePadding}
              onChange={(e) => setFormat({ ...format, pagePadding: Number(e.target.value) })} />
          </div>

          <div className="cv-fmt-group">
            <span className="cv-fmt-group-label">Line Spacing: {format.lineHeight}</span>
            <input type="range" min="1" max="2" step="0.1" value={format.lineHeight}
              onChange={(e) => setFormat({ ...format, lineHeight: Number(e.target.value) })} />
          </div>

          <div className="cv-fmt-group">
            <span className="cv-fmt-group-label">Heading Style</span>
            <div className="cv-fmt-row">
              <button
                className={`cv-fmt-style-btn ${format.headingBold ? "active" : ""}`}
                onClick={() => setFormat({ ...format, headingBold: !format.headingBold })}
                style={{ fontWeight: 700 }}
              >Bold</button>
              <button
                className={`cv-fmt-style-btn ${format.headingItalic ? "active" : ""}`}
                onClick={() => setFormat({ ...format, headingItalic: !format.headingItalic })}
                style={{ fontStyle: "italic" }}
              >Italic</button>
              <button
                className={`cv-fmt-style-btn ${format.headingUppercase ? "active" : ""}`}
                onClick={() => setFormat({ ...format, headingUppercase: !format.headingUppercase })}
              >AA</button>
            </div>
          </div>

        </div>
      </div>

      {/* ── FOOTER ── */}
      <footer className="cvnav__footer">
        <div className="cvnav__footer-left">
          <img src={cvLogo} alt="Memora" className="cvnav__footer-logo" />
          <span className="cvnav__footer-brand">Memora Smart CV</span>
          <span className="cvnav__footer-dot">·</span>
          <span className="cvnav__footer-copy">© {new Date().getFullYear()} Memora Smart Technologies</span>
        </div>
        <div className="cvnav__footer-right">
          {saveStatus === "saved" && (
            <span className="cvnav__footer-saved">
              <i className="fas fa-check-circle"></i> All changes saved
            </span>
          )}
          {saveStatus === "saving" && (
            <span className="cvnav__footer-saving">
              <i className="fas fa-circle-notch fa-spin"></i> Saving...
            </span>
          )}
          <span className="cvnav__footer-hint">
            <i className="fas fa-lock"></i> Your CV is private and secure
          </span>
        </div>
      </footer>

      {/* ── CLEAR MODAL ── */}
      {showClearModal && (
        <div className="cvb-modal" onClick={() => setShowClearModal(false)}>
          <div className="cvb-modal__box" onClick={(e) => e.stopPropagation()}>
            <div className="cvb-modal__icon cvb-modal__icon--lock">
              <i className="fas fa-eraser"></i>
            </div>
            <h3>Clear CV?</h3>
            <p>This will erase all content including your local draft. This cannot be undone.</p>
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

      {/* ── SHARE MODAL ── */}
      {showShareModal && (
        <div className="cvb-modal" onClick={() => setShowShareModal(false)}>
          <div className="cvb-modal__box" onClick={(e) => e.stopPropagation()}>
            <div className="cvb-modal__icon">
              <i className="fas fa-share-alt"></i>
            </div>
            <h3>Share this CV</h3>
            <p>Anyone with this link can view this CV. They'll need to log in to download it.</p>
            <div className="cvb-modal__link-row">
              <input className="cvb-modal__link-input" value={shareUrl} readOnly />
              <button
                className={`cvb-modal__copy-btn ${copied ? "cvb-modal__copy-btn--copied" : ""}`}
                onClick={copyLink}
              >
                {copied ? (
                  <><i className="fas fa-check"></i> Copied!</>
                ) : (
                  <><i className="fas fa-copy"></i> Copy</>
                )}
              </button>
            </div>
            <div className="cvb-modal__actions">
              <button className="cvb-modal__close" onClick={() => setShowShareModal(false)}>Done</button>
            </div>
          </div>
        </div>
      )}

      {/* ── LOGIN GATE (unauthenticated download attempt) ── */}
      {showDownloadGate && (
        <div className="cvb-modal" onClick={() => setShowDownloadGate(false)}>
          <div className="cvb-modal__box" onClick={(e) => e.stopPropagation()}>
            <div className="cvb-modal__icon cvb-modal__icon--lock">
              <i className="fas fa-lock"></i>
            </div>
            <h3>Login to Download</h3>
            <p>You need a free Memora account to download your CV. Your progress will be saved automatically.</p>
            <div className="cvb-modal__actions">
              <button
                className="cvb-modal__primary"
                onClick={() => navigate("/auth", { state: { from: window.location.pathname } })}
              >
                <i className="fas fa-user-plus"></i> Create Free Account
              </button>
              <button className="cvb-modal__close" onClick={() => setShowDownloadGate(false)}>
                Maybe Later
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── PAYWALL MODAL (authenticated but free CV used) ── */}
      {showPaywall && (
        <PaywallModal
          onClose={(action) => {
            setShowPaywall(false);
            if (action === "requery") setShowRequery(true);
          }}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}

      {showRequery && (
        <PaymentRequery
          onClose={() => setShowRequery(false)}
          onSuccess={() => {
            setShowRequery(false);
            // Re-attempt their pending action
            handlePaymentSuccess();
          }}
        />
      )}

      {/* ── SAVE TOAST ── */}
      <div className={`cvb-toast ${
        saveStatus === "saving" ? "cvb-toast--show" :
        saveStatus === "saved" ? "cvb-toast--show cvb-toast--success" :
        saveStatus === "error" ? "cvb-toast--show cvb-toast--error" : ""
      }`}>
        {saveStatus === "saving" && (
          <><i className="fas fa-spinner fa-spin"></i><span>Saving your CV...</span></>
        )}
        {saveStatus === "saved" && (
          <><i className="fas fa-check-circle"></i><span>CV saved successfully!</span></>
        )}
        {saveStatus === "error" && (
          <><i className="fas fa-exclamation-circle"></i><span>Save failed. Try again.</span></>
        )}
      </div>

      {/* ── MOBILE BOTTOM NAV ── */}
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

      {/* ── MORE MENU BACKDROP ── */}
      <div
        className={`cvb-more-backdrop ${showMoreMenu ? "cvb-more-backdrop--open" : ""}`}
        onClick={closeMore}
      ></div>

      {/* ── MORE MENU SHEET ── */}
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
            onClick={() => { closeMore(); setTimeout(() => openCustomize(), 350); }}
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
            onClick={() => { closeMore(); setTimeout(() => handleShare(), 350); }}
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
            onClick={() => { closeMore(); setTimeout(() => handlePrint(), 350); }}
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
            onClick={() => { closeMore(); navigate("/pricing"); }}
          >
            <span className="cvb-more-sheet__item-icon">
              <i className="fas fa-bolt"></i>
            </span>
            <div className="cvb-more-sheet__item-text">
              <p className="cvb-more-sheet__item-label">Upgrade to Pro</p>
              <p className="cvb-more-sheet__item-sub">Unlimited downloads — ₦7,500/mo</p>
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