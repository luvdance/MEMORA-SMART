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

const LOCAL_KEY = "memora_cv_draft";

export default function CVBuilder() {
  const { cvId: urlCvId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  // ── LOAD DRAFT FROM LOCALSTORAGE ──
  const getSavedDraft = () => {
    try {
      const saved = localStorage.getItem(LOCAL_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return null;
  };
  const draft = getSavedDraft();

  // ── CV CONTENT STATE ──
  const [cv, setCV] = useState(draft?.cv || emptyCV);

  // ── TEMPLATE STATE ──
  const [template, setTemplate] = useState(draft?.template ?? 0);

  // ── ACCENT COLOR STATE ──
  const [accent, setAccent] = useState(draft?.accent || ACCENT[0]);

  // ── FONT & FORMAT STATE ──
  const [format, setFormat] = useState(draft?.format || defaultFormat);

  // ── THEME STATE ──
  const [theme, setTheme] = useState(draft?.theme || defaultTheme);

  // ── SECTION ORDER STATE ──
  const [sectionOrder, setSectionOrder] = useState(draft?.sectionOrder || DEFAULT_SECTION_ORDER);

  // ── FORM STEP STATE ──
  const [step, setStep] = useState(0);

  // ── TAB STATE ──
  const [tab, setTab] = useState("form");

  // ── CLOUD CV ID STATE ──
  const [cvId, setCvId] = useState(urlCvId || null);

  // ── SAVE LOADING STATE ──
  const [saving, setSaving] = useState(false);

  // ── SAVE STATUS STATE ──
  const [saveStatus, setSaveStatus] = useState("");

  // ── SHARE URL STATE ──
  const [shareUrl, setShareUrl] = useState("");

  // ── MODAL VISIBILITY STATES ──
  const [showShareModal, setShowShareModal] = useState(false);
  const [showDownloadGate, setShowDownloadGate] = useState(false);
  const [showClearModal, setShowClearModal] = useState(false);

  // ── OWNERSHIP STATE ──
  const [isOwner, setIsOwner] = useState(true);

  // ── PDF LOADING STATE ──
  const [pdfLoading, setPdfLoading] = useState(false);

  // ── PDF PREVIEW REF ──
  const previewRef = useRef();

  // ── PRINT HANDLER (browser print) ──
  const handlePrint = () => {
    printCV({ previewRef, cv, theme, format });
  };

  // ── DOWNLOAD PDF HANDLER (puppeteer) ──
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

  // ── SYNC TO LOCALSTORAGE ON EVERY CHANGE ──
  useEffect(() => {
    if (urlCvId) return;
    try {
      localStorage.setItem(LOCAL_KEY, JSON.stringify({
        cv, template, accent, format, sectionOrder, theme
      }));
    } catch (e) {}
  }, [cv, template, accent, format, sectionOrder, theme, urlCvId]);

  // ── LOAD CV FROM FIRESTORE IF SHARED LINK ──
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

  // ── SAVE TO FIRESTORE ──
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

  // ── COPY SHARE LINK ──
  const copyLink = () => {
    navigator.clipboard.writeText(shareUrl);
  };

  // ── CLEAR ALL CV DATA ──
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

  return (
    <div className="cvb">

      {/* ── NAVBAR ── */}
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
      />

      {/* ── MAIN BODY ── */}
      <div className="cvb__body">

        {/* FORM PANEL */}
        <CVForm
          cv={cv} setCV={setCV}
          template={template}
          step={step} setStep={setStep}
          tab={tab}
        />

        {/* PREVIEW PANEL */}
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

      {/* ── CLEAR MODAL ── */}
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

      {/* ── SHARE MODAL ── */}
      {showShareModal && (
        <div className="cvb-modal" onClick={() => setShowShareModal(false)}>
          <div className="cvb-modal__box" onClick={(e) => e.stopPropagation()}>
            <div className="cvb-modal__icon">
              <i className="fas fa-share-alt"></i>
            </div>
            <h3>Share this CV</h3>
            <p>Anyone with this link can view and edit this CV. They'll need to log in to download it.</p>
            <div className="cvb-modal__link-row">
              <input
                className="cvb-modal__link-input"
                value={shareUrl}
                readOnly
              />
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

      {/* ── DOWNLOAD GATE MODAL ── */}
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

    </div>
  );
}