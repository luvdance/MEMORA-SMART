import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import CVNavbar from "../cv-builder/components/CVNavbar";
import CVForm from "../cv-builder/components/CVForm";
import CVPreview from "../cv-builder/components/CVPreview";
import { MobileAppBar, MobileTabBar, MobilePreviewBar } from "../cv-builder/components/mobile/MobileShell";
import MobileDesignPanel from "../cv-builder/components/mobile/MobileDesignPanel";
import MobileMoreSheet from "../cv-builder/components/mobile/MobileMoreSheet";
import "../cv-builder/CVMobile.css";
import { emptyCV, ACCENT, defaultFormat, defaultTheme, DEFAULT_SECTION_ORDER } from "../cv-builder/utils/constants";
import { saveCV, loadCV, adminSaveCV } from "../cv-builder/utils/cvService";
import { shrinkPhoto } from "../cv-builder/utils/imageCompress";
import { useAuth } from "../context/AuthContext";
import { useEntitlement, consumeDownload } from "../cv-builder/utils/cvAccess";
import { PLANS, formatResetIn, describeEntitlement, toMillis } from "../cv-builder/utils/plans";
import { isPremiumTemplate, PREMIUM_TEMPLATES } from "../cv-builder/utils/templateMeta";
import { mergeOptimizedCV } from "../cv-builder/utils/cvText";
import CVAtsPanel from "../cv-builder/components/CVAtsPanel";
import { doc as fsDoc, getDoc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import PaywallModal from "../components/PaywallModal";
import "../cv-builder/CVBuilder.css";
import { printCV } from "../cv-builder/utils/printEngine";
import { downloadCVPdf } from "../cv-builder/utils/pdfEngine";
import PaymentRequery from "../components/PaymentRequery";
import { track } from "../utils/analytics";
import { TEMPLATE_INFO } from "../cv-builder/utils/sampleCV";
import cvLogo from "../assets/cv logo.png";
import FormatPanel from "../cv-builder/components/FormatPanel";
import SectionOrderPanel from "../cv-builder/components/SectionOrderPanel";

const LOCAL_KEY = "memora_cv_draft";

// adminMode: opened from the admin panel (/admin/cv/:cvId) to review and
// correct a user's saved CV. Saves go straight to the user's document.
export default function CVBuilder({ adminMode = false }) {
  const { cvId: urlCvId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [showOptimizedBanner, setShowOptimizedBanner] = useState(false);

  // ── DRAFT RESTORE ── (never in admin mode: that's the admin's own draft)
  const getSavedDraft = () => {
    if (adminMode) return null;
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

  //isMobile state
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 900);
  // ── MOBILE UI STATE ──
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  //PAYWALL
  const [pendingAction, setPendingAction] = useState(null); // "print" | "download" | "ats" | null
  const [paywallReason, setPaywallReason] = useState("upgrade");
  const [paywallEntitlement, setPaywallEntitlement] = useState(null);
  const [showRequery, setShowRequery] = useState(false);
  const [downloadToast, setDownloadToast] = useState(null); // { text, tone }

  // ── PLAN ──
  const liveEntitlement = useEntitlement(user);
  // Admins reviewing a CV get every tool; the server lets admins through too.
  const entitlement = adminMode && liveEntitlement
    ? { ...liveEntitlement, premium: true, canUseAi: true }
    : liveEntitlement;

  // ── ATS TOOLS & AI OPTIMIZE ──
  const [showAts, setShowAts] = useState(false);
  const [preOptimizeCV, setPreOptimizeCV] = useState(null); // for Undo

  // ── ADMIN / SUPPORT EDITS ──
  const [adminInfo, setAdminInfo] = useState(null); // admin mode: { ownerId, ownerEmail, ownerName, title }
  const [remoteUpdate, setRemoteUpdate] = useState(null); // owner side: newer admin edit
  const adminSyncedAtRef = useRef(0);

  const previewRef = useRef();

  //ACCENT FIRE
  // ── SYNC ACCENT TO TEMPLATE DEFAULT WHEN TEMPLATE CHANGES ──
  // Skipped once when a saved CV is loaded, so its own accent isn't overwritten.
  const keepAccentRef = useRef(false);
useEffect(() => {
  if (keepAccentRef.current) {
    keepAccentRef.current = false;
    return;
  }
  const templateDefault = TEMPLATE_INFO[template]?.accent;
  if (templateDefault) {
    setAccent(templateDefault);
  }
}, [template]);

//isMobile useEffect
useEffect(() => {
  const handleResize = () => setIsMobile(window.innerWidth <= 900);
  window.addEventListener("resize", handleResize);
  return () => window.removeEventListener("resize", handleResize);
}, []);


  // ── AUTO-SAVE TO LOCALSTORAGE ──
  useEffect(() => {
    if (urlCvId) return;
    try {
      localStorage.setItem(LOCAL_KEY, JSON.stringify({
        cv, template, accent, format, sectionOrder, theme
      }));
    } catch (e) {}
  }, [cv, template, accent, format, sectionOrder, theme, urlCvId]);

  // ── APPLY A SAVED CV DOCUMENT TO THE EDITOR ──
  const applySavedCV = (data) => {
    setCV(data.data);
    if (data.template !== undefined && data.template !== template) keepAccentRef.current = true;
    setTemplate(data.template ?? 0);
    if (data.accent) setAccent(data.accent);
    if (data.format) setFormat(data.format);
    if (data.sectionOrder) setSectionOrder(data.sectionOrder);
    if (data.theme) setTheme(data.theme);
    adminSyncedAtRef.current = toMillis(data.adminEditedAt) || 0;
  };

  // ── LOAD CV FROM URL ID ──
  useEffect(() => {
    if (!urlCvId) return;
    loadCV(urlCvId).then(async (data) => {
      if (!data) return;
      applySavedCV(data);
      setCvId(urlCvId);
      if (adminMode) {
        // Admins edit someone else's CV: no "Clear", and show whose it is.
        setIsOwner(false);
        let owner = {};
        try {
          const snap = await getDoc(fsDoc(db, "users", data.ownerId));
          owner = snap.exists() ? snap.data() : {};
        } catch (err) {
          console.error("Could not load CV owner:", err);
        }
        setAdminInfo({
          ownerId: data.ownerId,
          ownerEmail: owner.email || "",
          ownerName: owner.name || owner.displayName || "",
          title: data.title || "My CV",
        });
      } else {
        setIsOwner(user?.uid === data.ownerId);
      }
    }).catch((err) => console.error("Could not load CV:", err));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlCvId, user?.uid, adminMode]);

  // ── LIVE: SUPPORT EDITED THIS CV ──
  // When an admin corrects the CV while its owner has it open, offer the
  // update instead of letting the owner's next save silently overwrite it.
  useEffect(() => {
    if (adminMode || !cvId || !user?.uid || !isOwner) return undefined;
    return onSnapshot(
      fsDoc(db, "cvs", cvId),
      (snap) => {
        if (!snap.exists() || snap.metadata.hasPendingWrites) return;
        const data = snap.data();
        const editedAt = toMillis(data.adminEditedAt) || 0;
        if (data.lastEditedBy === "admin" && editedAt > adminSyncedAtRef.current) {
          setRemoteUpdate({ id: snap.id, ...data });
        }
      },
      () => {},
    );
  }, [adminMode, cvId, user?.uid, isOwner]);

  const acceptRemoteUpdate = () => {
    if (!remoteUpdate) return;
    applySavedCV(remoteUpdate);
    setRemoteUpdate(null);
    track("cv_support_update_accepted");
  };

  const dismissRemoteUpdate = () => {
    adminSyncedAtRef.current = toMillis(remoteUpdate?.adminEditedAt) || Date.now();
    setRemoteUpdate(null);
  };

  // ── PHONES: each new form step starts at the top ──
  useEffect(() => {
    if (isMobile) window.scrollTo({ top: 0, behavior: "smooth" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  // ── BODY SCROLL LOCK ──
  useEffect(() => {
    document.body.style.overflow = showMoreMenu ? "hidden" : "";
  }, [showMoreMenu]);

  // ── LOAD OPTIMIZED CV FROM ATS CHECKER ──
useEffect(() => {
  const isOptimized = searchParams.get("optimized") === "true";
  if (!isOptimized) return;

  try {
    const optimizedRaw = localStorage.getItem("optimized_cv");
    if (!optimizedRaw) return;

    const optimizedCV = JSON.parse(optimizedRaw);

    setCV(prev => mergeOptimizedCV(prev, optimizedCV));

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

  // ── DOWNLOAD TOAST ──
  const toastTimer = useRef(null);
  const showToast = (text, tone = "success", ms = 5000) => {
    clearTimeout(toastTimer.current);
    setDownloadToast({ text, tone });
    toastTimer.current = setTimeout(() => setDownloadToast(null), ms);
  };

  const describeDownload = (kind, ent) => {
    if (kind === "premium") return "Downloading. Premium: unlimited downloads.";
    if (kind === "credit") {
      return `Used 1 download credit. ${ent.credits} credit${ent.credits !== 1 ? "s" : ""} left.`;
    }
    const { used, limit, remaining, resetsAt } = ent.free;
    return remaining > 0
      ? `Free download ${used} of ${limit} used today. ${remaining} left.`
      : `Free download ${used} of ${limit} used today. Resets ${formatResetIn(resetsAt)}.`;
  };

  // ── OPEN THE PAYWALL ──
  const openPaywall = (reason, ent = entitlement, action = null) => {
    setPaywallReason(reason);
    setPaywallEntitlement(ent);
    setPendingAction(action);
    track("paywall_shown", { reason, action });
    setShowPaywall(true);
  };

  // ── PRINT / DOWNLOAD ──
  // The server decides and records every download (free allowance, credits,
  // Premium), so the count can't be skipped from the browser.
  const runDownload = async (action, { afterPayment = false } = {}) => {
    const doIt = async () => {
      if (action === "print") await triggerPrint();
      else await triggerPdfDownload();
    };

    if (adminMode) {
      await doIt();
      return;
    }
    if (!user) {
      setShowDownloadGate(true);
      return;
    }

    if (action === "download") setPdfLoading(true);
    // Print had no visible feedback, so any wait looked like a freeze.
    if (action === "print") showToast("Preparing your CV for printing...", "success", 20000);
    let result;
    try {
      result = await consumeDownload(user, { template, cvId });
    } catch (err) {
      result = { ok: false, reason: "error", error: err.message };
    }
    if (action === "download") setPdfLoading(false);

    if (result.ok) {
      showToast(describeDownload(result.kind, result.entitlement), "success");
      await doIt();
      return;
    }
    if (result.reason === "auth_required") {
      // We already know they're signed in here, so the server couldn't verify
      // the session: show why instead of a misleading "Login to Download".
      showToast(result.error || "Your sign-in couldn't be verified. Please sign out and back in, then try again.", "error", 10000);
      return;
    }
    if (result.reason === "daily_limit" || result.reason === "premium_template") {
      if (afterPayment) {
        // Paid, but the plan hasn't reached the server yet.
        showToast("Your payment is still being confirmed. Use 'Verify payment' if access doesn't start in a minute.", "error", 8000);
        setPendingAction(action);
        setShowRequery(true);
        return;
      }
      openPaywall(result.reason, result.entitlement, action);
      return;
    }
    showToast(
      `We couldn't check your download allowance${result.error ? ` (${result.error})` : ""}. Please check your connection and try again.`,
      "error",
      8000,
    );
  };

  const handlePrint = () => runDownload("print");
  const handleDownloadPDF = () => runDownload("download");

const triggerPrint = async () => {
  try {
    await printCV({ previewRef, cv, theme, format });
  } catch (err) {
    console.error("Print failed:", err);
    showToast("Printing couldn't start. Please try Download instead.", "error", 8000);
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
  // verify-payment usually grants the plan before this runs; if it didn't, the
  // webhook will within seconds, so wait briefly before resuming.
  const handlePaymentSuccess = async (plan, result) => {
    track("payment_completed", { plan });
    setShowPaywall(false);
    const action = pendingAction;
    setPendingAction(null);
    showToast(`${PLANS[plan]?.name || "Premium"} is active. Thank you!`, "success");

    if (!action) return;
    if (result?.grant !== "granted" && result?.grant !== "already_processed") {
      await new Promise((r) => setTimeout(r, 4000));
    }
    if (action === "ats") {
      setShowAts(true);
      return;
    }
    await runDownload(action, { afterPayment: true });
  };

  // ── AI OPTIMIZE (in-builder) ──
  const applyOptimized = (optimized) => {
    setPreOptimizeCV(cv);
    setCV(prev => mergeOptimizedCV(prev, optimized));
    setShowOptimizedBanner(true);
  };

  const undoOptimize = () => {
    if (!preOptimizeCV) return;
    setCV(preOptimizeCV);
    setPreOptimizeCV(null);
    setShowOptimizedBanner(false);
    track("builder_optimize_undone");
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
      // Drafts made before uploads were compressed can hold a multi-MB photo,
      // which Firestore rejects ("invalid nested entity").
      const photo = await shrinkPhoto(cv.photo);
      const cvData = photo === cv.photo ? cv : { ...cv, photo };
      if (cvData !== cv) setCV(p => ({ ...p, photo }));

      if (adminMode) {
        if (!cvId || !adminInfo?.ownerId) throw new Error("CV not loaded yet");
        await adminSaveCV({
          cvId,
          ownerId: adminInfo.ownerId,
          cvData,
          template,
          accent,
          format,
          sectionOrder,
          theme,
          title: adminInfo.title,
        });
        setSaveStatus("saved");
        setTimeout(() => setSaveStatus(""), 3000);
        setSaving(false);
        return;
      }

      const id = await saveCV({
        cvId,
        userId: user.uid,
        cvData,
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
      setSaving(false);
      return id;
    } catch (err) {
      console.error(err);
      setSaveStatus("error");
      setTimeout(() => setSaveStatus(""), 3000);
    }
    setSaving(false);
    return null;
  };

  // ── SHARE ──
  const handleShare = async () => {
    // Use the id save returns: `cvId` in this closure is still the old value.
    const id = cvId || await handleSave();
    if (!id) return;
    const url = `${window.location.origin}/cv/${id}`;
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

  return (
    <div className="cvb">

      {!isMobile && (
        <CVNavbar
          cv={cv}
          cvId={cvId}
          template={template} setTemplate={setTemplate}
          accent={accent} setAccent={setAccent}
          entitlement={entitlement}
          onPlan={() => (entitlement?.premium ? navigate("/dashboard/payments") : openPaywall("upgrade"))}
          adminMode={adminMode}
          sectionOrder={sectionOrder}
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
          theme={theme}
          showFormat={showFormat}
          setShowFormat={setShowFormat}
          showOrder={showOrder}
          setShowOrder={setShowOrder}
        />
        )}

      {isMobile && (
        <MobileAppBar
          cv={cv}
          cvId={cvId}
          saveStatus={saveStatus}
          saving={saving}
          onSave={handleSave}
          onHome={() => navigate(adminMode ? "/admin" : "/dashboard", adminMode ? { state: { tab: "cvs" } } : undefined)}
          user={user}
          entitlement={entitlement}
          onPlan={() => (entitlement?.premium ? navigate("/dashboard/payments") : openPaywall("upgrade"))}
          adminMode={adminMode}
        />
      )}

      {/* ADMIN MODE: whose CV this is */}
      {adminMode && (
        <div className="cvb-notice cvb-notice--admin">
          <i className="fas fa-user-shield"></i>
          <div className="cvb-notice__text">
            <strong>Admin editing{adminInfo ? `: ${adminInfo.ownerName || adminInfo.ownerEmail || adminInfo.ownerId}` : "..."}</strong>
            <span>
              {adminInfo?.ownerEmail && adminInfo?.ownerName ? `${adminInfo.ownerEmail} · ` : ""}
              Saving writes straight to this user's CV. They see it next time they open it, or right away if it's open.
            </span>
          </div>
          <button className="cvb-notice__btn" onClick={() => navigate("/admin", { state: { tab: "cvs" } })}>
            <i className="fas fa-arrow-left"></i> Back to admin
          </button>
        </div>
      )}

      {/* OWNER: support corrected this CV while it was open */}
      {remoteUpdate && (
        <div className="cvb-notice cvb-notice--info" role="status">
          <i className="fas fa-user-edit"></i>
          <div className="cvb-notice__text">
            <strong>Memora support updated this CV</strong>
            <span>{remoteUpdate.adminNote || "Load the corrected version to see the changes."}</span>
          </div>
          <button className="cvb-notice__btn cvb-notice__btn--primary" onClick={acceptRemoteUpdate}>Load update</button>
          <button className="cvb-notice__btn" onClick={dismissRemoteUpdate}>Keep mine</button>
        </div>
      )}

      {showOptimizedBanner && (
      <div className="cv-optimized-banner">
        <div className="cv-optimized-banner__icon">
          <i className="fas fa-magic"></i>
        </div>
        <div className="cv-optimized-banner__text">
          <strong>Your CV has been optimized by AI ✨</strong>
          <p>Review the changes below — edit anything before downloading.</p>
        </div>
        {preOptimizeCV && (
          <button className="cvb-notice__btn" onClick={undoOptimize}>
            <i className="fas fa-undo"></i> Undo
          </button>
        )}
        <button
          className="cv-optimized-banner__close"
          onClick={() => { setShowOptimizedBanner(false); setPreOptimizeCV(null); }}
          aria-label="Close"
        >
          <i className="fas fa-times"></i>
        </button>
      </div>
    )}

    {/* ATS QUICK ACTIONS + PLAN STATUS (desktop; phones get them on the Edit tab) */}
    {!isMobile && (
    <div className="cvb__ats-actions">
      <div className="cvb__ats-actions-label">
        <i className="fas fa-bolt"></i>
        <span>ATS Tools</span>
        {!entitlement?.premium && (
          <span className="cvb__premium-tag"><i className="fas fa-crown"></i> Premium</span>
        )}
      </div>
      <div className="cvb__ats-actions-buttons">
        <button
          className="cvb__ats-btn"
          onClick={() => setShowAts(true)}
        >
          <i className="fas fa-search"></i>
          <span>Check ATS Score</span>
        </button>
        <button
          className="cvb__ats-btn cvb__ats-btn--secondary"
          onClick={() => setShowAts(true)}
        >
          <i className="fas fa-magic"></i>
          <span>Optimize with AI</span>
        </button>
      </div>
      {user && entitlement && !adminMode && (
        <button
          className={`cvb__plan-chip ${entitlement.premium ? "cvb__plan-chip--pro" : ""}`}
          onClick={() => (entitlement.premium ? navigate("/dashboard/payments") : openPaywall("upgrade"))}
          title={describeEntitlement(entitlement).sub}
        >
          <i className={`fas fa-${describeEntitlement(entitlement).icon}`}></i>
          {entitlement.premium
            ? <span>{describeEntitlement(entitlement).label}</span>
            : <span>Free · {entitlement.free.used} of {entitlement.free.limit} downloads used today</span>}
        </button>
      )}
    </div>
    )}

    {/* PREMIUM TEMPLATE NOTICE (free users) */}
    {isPremiumTemplate(template) && !entitlement?.premium && !adminMode && (
      <div className="cvb-notice cvb-notice--premium">
        <i className="fas fa-crown"></i>
        <div className="cvb-notice__text">
          <strong>{TEMPLATE_INFO[template]?.name} is a Premium template</strong>
          <span>Edit and preview it for free. Downloading it needs a Premium plan.</span>
        </div>
        <button className="cvb-notice__btn cvb-notice__btn--primary" onClick={() => openPaywall("premium_template")}>
          See plans
        </button>
        <button
          className="cvb-notice__btn"
          onClick={() => setTemplate(TEMPLATE_INFO.findIndex((_, i) => !PREMIUM_TEMPLATES.includes(i)))}
        >
          Use a free template
        </button>
      </div>
    )}

      <div className="cvb__body" data-active-tab={tab}>

        {isMobile && tab === "design" && (
          <MobileDesignPanel
            cv={cv}
            template={template} setTemplate={setTemplate}
            accent={accent} setAccent={setAccent}
            theme={theme} setTheme={setTheme}
            format={format} setFormat={setFormat}
            sectionOrder={sectionOrder} setSectionOrder={setSectionOrder}
            entitlement={entitlement}
          />
        )}

        {isMobile && tab === "preview" && (
          <MobilePreviewBar
            templateName={TEMPLATE_INFO[template]?.name || "Template"}
            locked={isPremiumTemplate(template) && !entitlement?.premium}
            onChange={() => setTab("design")}
          />
        )}

        <CVForm
          cv={cv} setCV={setCV}
          template={template}
          step={step} setStep={setStep}
          tab={tab}
          entitlement={entitlement}
          onAts={() => setShowAts(true)}
          isMobile={isMobile}
          onFinish={() => {
            if (isMobile) { setTab("preview"); window.scrollTo({ top: 0 }); }
            else showToast("Your CV is ready. Download it or print it from the top bar.", "success");
          }}
        />

        {/* Always mounted: Print and Download copy this preview, whatever tab is showing. */}
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

      {/* ── FOOTER (desktop) ── */}
      {!isMobile && (
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
      )}

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

      {/* ── PAYWALL MODAL (daily limit, Premium template or Premium feature) ── */}
      {showPaywall && (
        <PaywallModal
          reason={paywallReason}
          entitlement={paywallEntitlement || entitlement}
          onClose={(action) => {
            setShowPaywall(false);
            if (action === "requery") setShowRequery(true);
            else setPendingAction(null);
          }}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}

      {showRequery && (
        <PaymentRequery
          onClose={() => { setShowRequery(false); setPendingAction(null); }}
          onSuccess={() => {
            setShowRequery(false);
            // Re-attempt their pending action
            const action = pendingAction;
            setPendingAction(null);
            if (action === "ats") setShowAts(true);
            else if (action) runDownload(action, { afterPayment: true });
          }}
        />
      )}

      {/* ── IN-BUILDER ATS CHECK & AI OPTIMIZE ── */}
      <CVAtsPanel
        open={showAts}
        onClose={() => setShowAts(false)}
        cv={cv}
        user={user}
        entitlement={entitlement}
        onRequireAuth={() => { setShowAts(false); setShowDownloadGate(true); }}
        onUpgrade={(reason) => { setShowAts(false); openPaywall(reason, entitlement, "ats"); }}
        onApplyOptimized={applyOptimized}
      />

      {/* ── DOWNLOAD TOAST ("1 of 5 used") ── */}
      <div
        className={`cvb-dl-toast ${downloadToast ? "cvb-dl-toast--show" : ""} ${downloadToast?.tone === "error" ? "cvb-dl-toast--error" : ""}`}
        role="status"
        aria-live="polite"
      >
        {downloadToast && (
          <>
            <i className={`fas fa-${downloadToast.tone === "error" ? "exclamation-circle" : "check-circle"}`}></i>
            <span>{downloadToast.text}</span>
            {downloadToast.tone !== "error" && entitlement && !entitlement.premium && (
              <button onClick={() => { setDownloadToast(null); openPaywall("upgrade"); }}>Go unlimited</button>
            )}
          </>
        )}
      </div>

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

      {/* ── MOBILE TAB BAR + MORE SHEET ── */}
      {isMobile && (
        <>
          <MobileTabBar
            tab={tab}
            setTab={(t) => { setTab(t); window.scrollTo({ top: 0 }); }}
            onDownload={handleDownloadPDF}
            pdfLoading={pdfLoading}
            onMore={() => setShowMoreMenu(v => !v)}
            moreOpen={showMoreMenu}
          />
          <MobileMoreSheet
            open={showMoreMenu}
            onClose={() => setShowMoreMenu(false)}
            user={user}
            entitlement={entitlement}
            isOwner={isOwner}
            adminMode={adminMode}
            actions={{
              ats: () => setShowAts(true),
              print: handlePrint,
              share: handleShare,
              save: handleSave,
              design: () => { setTab("design"); window.scrollTo({ top: 0 }); },
              works: () => navigate("/dashboard/my-works"),
              payments: () => navigate("/dashboard/payments"),
              dashboard: () => navigate("/dashboard"),
              admin: () => navigate("/admin", { state: { tab: "cvs" } }),
              upgrade: () => openPaywall("upgrade"),
              signIn: () => navigate("/auth", { state: { from: window.location.pathname } }),
              clear: () => setShowClearModal(true),
            }}
          />
        </>
      )}

{/* Mobile Format Sheet */}
{showFormat && isMobile && (
  <>
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.4)",
        zIndex: 490,
        backdropFilter: "blur(2px)",
      }}
      onClick={() => setShowFormat(false)}
    />
    <div className="cvb__mobile-panel-sheet">
      <div className="cvb__mobile-panel-header">
        <span><i className="fas fa-sliders-h"></i> Format</span>
        <button onClick={() => setShowFormat(false)}>
          <i className="fas fa-times"></i>
        </button>
      </div>
      <div className="cvb__mobile-panel-body">
        <FormatPanel format={format} setFormat={setFormat} />
      </div>
    </div>
  </>
)}

{/* Mobile Reorder Sheet */}
{showOrder && isMobile && (
  <>
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.4)",
        zIndex: 490,
        backdropFilter: "blur(2px)",
      }}
      onClick={() => setShowOrder(false)}
    />
    <div className="cvb__mobile-panel-sheet">
      <div className="cvb__mobile-panel-header">
        <span><i className="fas fa-arrows-alt-v"></i> Reorder Sections</span>
        <button onClick={() => setShowOrder(false)}>
          <i className="fas fa-times"></i>
        </button>
      </div>
      <div className="cvb__mobile-panel-body">
        <SectionOrderPanel
          sectionOrder={sectionOrder}
          setSectionOrder={setSectionOrder}
          template={template}
        />
      </div>
    </div>
  </>
)}
    </div>
  );
}