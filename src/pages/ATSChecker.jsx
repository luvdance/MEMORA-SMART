import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./ATSChecker.css";
import { track } from "../utils/analytics";
import { useEffect } from "react"; 
import { useAuth } from "../context/AuthContext";
import PaywallModal from "../components/PaywallModal";
import PaymentRequery from "../components/PaymentRequery";
import { useEntitlement, cvApi } from "../cv-builder/utils/cvAccess";
import { PLANS, FREE_DAILY_DOWNLOADS } from "../cv-builder/utils/plans";
import cvLogo from "../assets/cv logo.png";

export default function ATSChecker() {
  const navigate = useNavigate();
  const fileInputRef = useRef();
  const { user } = useAuth();

  const [inputMode, setInputMode] = useState("upload"); // "upload" | "paste"
  const [cvText, setCvText] = useState(() => {
    try {
      return localStorage.getItem("ats_last_cv") || "";
    } catch {
      return "";
    }
  });
  const [jobDescription, setJobDescription] = useState(() => {
    try {
      return localStorage.getItem("ats_last_jd") || "";
    } catch {
      return "";
    }
  });
  const [fileName, setFileName] = useState("");
  const [parsing, setParsing] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState("");
  const [showAuthGate, setShowAuthGate] = useState(false);
  // ATS checks and AI optimization are Premium features.
  const entitlement = useEntitlement(user);
  const [paywallFor, setPaywallFor] = useState(null); // "analyze" | "optimize" | null
  const [showRequery, setShowRequery] = useState(false);

  //cv optimizer state
  const [optimizing, setOptimizing] = useState(false);
  const [optimizeError, setOptimizeError] = useState("");
  const [optimizeProgress, setOptimizeProgress] = useState("");
  const [analyzeProgress, setAnalyzeProgress] = useState("");

  //parse-progress state
  const [parseProgress, setParseProgress] = useState("");
  
  // Load saved result from localStorage on mount
const [result, setResult] = useState(() => {
  try {
    const saved = localStorage.getItem("ats_last_result");
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
});

// Also restore the input that produced it (so users can re-analyze)
const [savedCvText, setSavedCvText] = useState(() => {
  try {
    return localStorage.getItem("ats_last_cv") || "";
  } catch {
    return "";
  }
});

  const handleFileUpload = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const maxSize = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSize) {
    setError("File too large. Max 10MB.");
    return;
  }

  setError("");
  setParsing(true);
  setFileName(file.name);

  try {
    const ext = file.name.toLowerCase().split(".").pop();
    let text = "";

    if (ext === "pdf") {
      // Browser-side PDF parsing (existing)
      text = await parsePdfInBrowser(file);

    } else if (["jpg", "jpeg", "png", "webp"].includes(ext)) {
      // Image OCR via Claude Vision (NEW)
      text = await parseImageFile(file);

    } else if (ext === "docx" || ext === "doc") {
      // Server-side DOCX parsing (existing)
      const formData = new FormData();
      formData.append("cv", file);
      const res = await fetch("/api/parse-cv", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success) text = data.text;
      else throw new Error(data.error || "Failed to parse DOCX");

    } else if (ext === "txt") {
      text = await file.text();

    } else {
      throw new Error("Unsupported file type. Upload PDF, DOCX, TXT, JPG, or PNG.");
    }

    if (!text || text.trim().length < 50) {
      throw new Error("Could not extract enough text. If this is a scanned image, ensure it's clear and well-lit.");
    }

    setCvText(text);
    setSavedCvText(text);
    setInputMode("paste");

  } catch (err) {
    setError(err.message);
    setFileName("");
  }

  setParsing(false);
};

// Browser-side PDF parser
const parsePdfInBrowser = async (file) => {
  const pdfjsLib = await import("pdfjs-dist/legacy/build/pdf.mjs");
  
  // Set the worker
  pdfjsLib.GlobalWorkerOptions.workerSrc = await import(
    "pdfjs-dist/legacy/build/pdf.worker.mjs?url"
  ).then(m => m.default);

  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  
  let fullText = "";
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const pageText = content.items.map((item) => item.str).join(" ");
    fullText += pageText + "\n";
  }
  
  return fullText.trim();
};

const parseImageFile = async (file) => {
  setParseProgress("Reading image...");
  const formData = new FormData();
  formData.append("cv", file);

  const res = await fetch("/api/parse-cv", {
    method: "POST",
    body: formData,
  });

  const data = await res.json();
  setParseProgress("");

  if (!data.success) {
    throw new Error(data.error || "Could not extract text from image");
  }
  return data.text;
};

  const handleAnalyze = async () => {
  if (!cvText || cvText.trim().length < 100) {
    setError("Please provide a complete CV (at least 100 characters)");
    return;
  }

  if (!user) {
    // Keep what they pasted so it's still here after signing in.
    try {
      localStorage.setItem("ats_last_cv", cvText);
      localStorage.setItem("ats_last_jd", jobDescription || "");
    } catch {
      // Storage blocked (private mode): they'll just paste again.
    }
    track("ats_check_auth_gate_shown");
    setShowAuthGate(true);
    return;
  }
  if (entitlement && !entitlement.premium) {
    track("paywall_shown", { reason: "premium_feature", source: "ats_page" });
    setPaywallFor("analyze");
    return;
  }

  track("ats_check_started", { hasJobDescription: !!jobDescription.trim() });
  setError("");
  setAnalyzing(true);
  setResult(null);
  const progressInterval = startProgressMessages(setAnalyzeProgress, "analyze");

  try {
    const { status, data } = await cvApi("ats-score", user, {
      cvText: cvText.trim(),
      jobDescription: jobDescription.trim(),
    });

    if (status === 401) {
      setShowAuthGate(true);
    } else if (status === 402) {
      setPaywallFor("analyze");
    } else if (data.success) {
      setResult(data);
      track("ats_check_completed", { score: data.overallScore, rating: data.rating });
      try {
        localStorage.setItem("ats_last_result", JSON.stringify(data));
        localStorage.setItem("ats_last_cv", cvText);
        localStorage.setItem("ats_last_jd", jobDescription || "");
        localStorage.setItem("ats_last_date", new Date().toISOString());
        setSavedCvText(cvText);
      } catch (e) {
        console.warn("Could not save to localStorage:", e);
      }

      setAnalyzeProgress("Done! Showing your results...");
      setTimeout(() => {
        document.getElementById("ats-results")?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } else {
      setError(data.error || "Analysis failed");
    }
  } catch (err) {
    setError("Network error: " + err.message);
  }

  clearInterval(progressInterval);
  setAnalyzing(false);
  setAnalyzeProgress("");
};

// Rotate progress messages while AI is working
const startProgressMessages = (setter, type = "optimize") => {
  const optimizeMessages = [
    "Reading your CV carefully...",
    "Identifying weak areas...",
    "Rewriting your professional summary...",
    "Strengthening experience bullets with action verbs...",
    "Adding quantified achievements...",
    "Optimizing keywords for ATS...",
    "Reorganizing for maximum impact...",
    "Polishing the final draft...",
    "Almost done — finalizing structure...",
  ];

  const analyzeMessages = [
    "Reading your CV carefully...",
    "Checking structure & formatting...",
    "Scanning for relevant keywords...",
    "Evaluating achievements & metrics...",
    "Reviewing your professional summary...",
    "Checking contact details...",
    "Comparing against ATS standards...",
    "Generating your top improvements...",
    "Almost done — preparing your report...",
  ];

  const messages = type === "analyze" ? analyzeMessages : optimizeMessages;

  let index = 0;
  setter(messages[0]);

  const interval = setInterval(() => {
    index = (index + 1) % messages.length;
    setter(messages[index]);
  }, 2500);

  return interval;
};

 //handle optimize
 const handleOptimize = async () => {
  const textToOptimize = cvText || savedCvText;

  if (!textToOptimize) {
    setOptimizeError("No CV text found. Please re-upload or paste your CV.");
    return;
  }
  if (!result) {
    setOptimizeError("No analysis result. Please run an ATS check first.");
    return;
  }

  if (!user) {
    track("ats_optimize_auth_gate_shown", { score: result.overallScore });
    localStorage.setItem("pending_optimize", JSON.stringify({
      cvText: textToOptimize,
      improvements: result.topImprovements || [],
      atsScore: result.overallScore,
      jobDescription: jobDescription || "",
    }));
    setShowAuthGate(true);
    return;
  }

  if (entitlement && !entitlement.premium) {
    track("paywall_shown", { reason: "premium_feature", source: "ats_optimize" });
    setPaywallFor("optimize");
    return;
  }

  track("ats_optimize_started", { score: result.overallScore });
  setOptimizing(true);
  setOptimizeError("");
  const progressInterval = startProgressMessages(setOptimizeProgress, "optimize");  // ← START

  try {
    const { status, data } = await cvApi("optimize", user, {
      cvText: textToOptimize,
      improvements: result.topImprovements || [],
      atsScore: result.overallScore,
      jobDescription: jobDescription || "",
    });

    if (status === 402) {
      setPaywallFor("optimize");
    } else if (data.success && data.cv) {
      localStorage.setItem("optimized_cv", JSON.stringify(data.cv));
      localStorage.setItem("optimized_cv_source", JSON.stringify({
        previousScore: result.overallScore,
        timestamp: new Date().toISOString(),
      }));

      track("ats_optimize_completed", { score: result.overallScore });
      setOptimizeProgress("Done! Loading the builder...");
      setTimeout(() => navigate("/dashboard/cv-builder?optimized=true"), 600);
    } else {
      setOptimizeError(data.error || "Optimization failed. Please try again.");
      track("ats_optimize_failed");
    }
  } catch (err) {
    setOptimizeError("Network error: " + err.message);
    track("ats_optimize_failed");
  }

  clearInterval(progressInterval);   // ← STOP
  setOptimizing(false);
  setOptimizeProgress("");
};

  const handleReset = () => {
  setResult(null);
  setCvText("");
  setJobDescription("");
  setFileName("");
  setError("");
  setSavedCvText("");
  try {
    localStorage.removeItem("ats_last_result");
    localStorage.removeItem("ats_last_cv");
    localStorage.removeItem("ats_last_jd");
    localStorage.removeItem("ats_last_date");
  } catch {}
};

  const getScoreColor = (score) => {
    if (score >= 80) return "#16a34a";
    if (score >= 60) return "#eab308";
    if (score >= 40) return "#f97316";
    return "#dc2626";
  };

  const handleDownloadReport = () => {
  // Use browser print dialog (saves as PDF when user chooses "Save as PDF")
  document.body.classList.add("ats-printing");
  window.print();
  // Remove the class after print dialog closes
  setTimeout(() => {
    document.body.classList.remove("ats-printing");
  }, 1000);
};

useEffect(() => {
  track("ats_page_viewed");
}, []);

// Auto-resume optimization if user just signed in
useEffect(() => {
  if (!user) return;
  
  try {
    const pendingRaw = localStorage.getItem("pending_optimize");
    if (!pendingRaw) return;

    const pending = JSON.parse(pendingRaw);
    localStorage.removeItem("pending_optimize");

    setOptimizing(true);
    setOptimizeError("");
    track("ats_optimize_resumed_after_signup");
    const progressInterval = startProgressMessages(setOptimizeProgress, "optimize");   // ← ADD

    cvApi("optimize", user, pending)
      .then(({ status, data }) => {
        clearInterval(progressInterval);   // ← ADD
        if (status === 402) {
          // Signed up, but optimizing needs Premium. Their analysis is still on screen.
          setOptimizing(false);
          setOptimizeProgress("");
          setPaywallFor("optimize");
        } else if (data.success && data.cv) {
          localStorage.setItem("optimized_cv", JSON.stringify(data.cv));
          localStorage.setItem("optimized_cv_source", JSON.stringify({
            previousScore: pending.atsScore,
            timestamp: new Date().toISOString(),
          }));
          track("ats_optimize_completed", { score: pending.atsScore, resumed: true });
          setOptimizeProgress("Done! Loading the builder...");
          setTimeout(() => navigate("/dashboard/cv-builder?optimized=true"), 600);
        } else {
          setOptimizeError(data.error || "Optimization failed. Please try again.");
          setOptimizing(false);
          setOptimizeProgress("");
        }
      })
      .catch(err => {
        clearInterval(progressInterval);   // ← ADD
        setOptimizeError("Network error: " + err.message);
        setOptimizing(false);
        setOptimizeProgress("");
      });
  } catch (err) {
    console.error("Resume optimization failed:", err);
  }
}, [user]);

  // Back goes where the user came from inside the app; a fresh visit (shared
  // link, bookmark) falls back to the CV builder that fits their sign-in state.
  const builderPath = user ? "/dashboard/cv-builder" : "/cv-builder";
  const goBack = () => {
    if (window.history.state?.idx > 0) navigate(-1);
    else navigate(builderPath);
  };

  const [dragOver, setDragOver] = useState(false);
  const onDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer?.files?.[0];
    if (file) handleFileUpload({ target: { files: [file] } });
  };

  const CATEGORY_META = [
    { key: "structure", label: "Structure & formatting", icon: "fa-table-list" },
    { key: "keywords", label: "Keywords & relevance", icon: "fa-key" },
    { key: "achievements", label: "Achievements & metrics", icon: "fa-chart-line" },
    { key: "summary", label: "Professional summary", icon: "fa-align-left" },
    { key: "contact", label: "Contact & essentials", icon: "fa-id-card" },
  ];

  const lastDate = (() => {
    try {
      const d = new Date(localStorage.getItem("ats_last_date"));
      return Number.isNaN(d.getTime()) ? null : d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
    } catch { return null; }
  })();

  return (
    <div className="atsx">
      {/* ── TOP BAR (pinned) ── */}
      <header className="atsx-bar">
        <button className="atsx-bar__back" onClick={goBack} aria-label="Go back">
          <i className="fas fa-chevron-left"></i>
        </button>
        <button className="atsx-bar__brand" onClick={() => navigate("/")} aria-label="Memora home">
          <img src={cvLogo} alt="" />
        </button>
        <div className="atsx-bar__title">
          <strong>ATS Checker</strong>
          <span>Memora CV tools</span>
        </div>
        <nav className="atsx-bar__links" aria-label="CV tools">
          <button onClick={() => navigate(builderPath)}><i className="fas fa-file-lines"></i> <span>CV Builder</span></button>
          {user && <button onClick={() => navigate("/dashboard")}><i className="fas fa-house"></i> <span>Dashboard</span></button>}
          {user && entitlement && (
            <button
              className={`atsx-pill ${entitlement.premium ? "atsx-pill--pro" : ""}`}
              onClick={() => (entitlement.premium ? navigate("/dashboard/payments") : setPaywallFor("analyze"))}
            >
              {entitlement.premium ? <><i className="fas fa-crown"></i> PRO</> : <><i className="fas fa-crown"></i> Go Premium</>}
            </button>
          )}
          {!user && (
            <button className="atsx-bar__signin" onClick={() => navigate("/auth", { state: { from: "/ats-check" } })}>
              Sign in
            </button>
          )}
        </nav>
      </header>

      <main className="atsx-main">
        {/* ── INPUT ── */}
        {!result && (
          <>
            <section className="atsx-hero">
              <span className="atsx-eyebrow"><i className="fas fa-gauge-high"></i> ATS score check</span>
              <h1>See your CV the way hiring software does</h1>
              <p>
                Most employers filter CVs with an Applicant Tracking System before a person reads them.
                Get your score, what's holding it back, and exactly what to fix.
              </p>
              <ul className="atsx-facts">
                <li><i className="fas fa-stopwatch"></i> Results in about 20 seconds</li>
                <li><i className="fas fa-file-pdf"></i> PDF, Word, text or a photo</li>
                <li><i className="fas fa-lock"></i> Analysed once, never stored</li>
              </ul>
            </section>

            <section className="atsx-card">
              <div className="atsx-step">
                <div className="atsx-step__head">
                  <span className="atsx-step__n">1</span>
                  <div>
                    <h2>Your CV</h2>
                    <p>Upload the file you send to employers, or paste its text.</p>
                  </div>
                </div>

                <div className="atsx-seg" role="tablist" aria-label="How to add your CV">
                  <button role="tab" aria-selected={inputMode === "upload"} className={inputMode === "upload" ? "atsx-seg--on" : ""} onClick={() => setInputMode("upload")}>
                    <i className="fas fa-arrow-up-from-bracket"></i> Upload file
                  </button>
                  <button role="tab" aria-selected={inputMode === "paste"} className={inputMode === "paste" ? "atsx-seg--on" : ""} onClick={() => setInputMode("paste")}>
                    <i className="fas fa-paste"></i> Paste text
                  </button>
                </div>

                {inputMode === "upload" && (
                  <div
                    className={`atsx-drop ${dragOver ? "atsx-drop--over" : ""} ${fileName && !parsing ? "atsx-drop--done" : ""}`}
                    onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={onDrop}
                    onClick={() => !parsing && fileInputRef.current?.click()}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => { if ((e.key === "Enter" || e.key === " ") && !parsing) fileInputRef.current?.click(); }}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.webp"
                      onChange={handleFileUpload}
                      hidden
                    />
                    {parsing ? (
                      <>
                        <span className="atsx-drop__icon"><i className="fas fa-circle-notch fa-spin"></i></span>
                        <strong>Reading your CV…</strong>
                        <span>{parseProgress || "Extracting the text"}</span>
                      </>
                    ) : fileName ? (
                      <>
                        <span className="atsx-drop__icon atsx-drop__icon--ok"><i className="fas fa-file-circle-check"></i></span>
                        <strong>{fileName}</strong>
                        <span>Ready to check · click to choose another file</span>
                      </>
                    ) : (
                      <>
                        <span className="atsx-drop__icon"><i className="fas fa-cloud-arrow-up"></i></span>
                        <strong>Drop your CV here, or click to browse</strong>
                        <span>PDF, DOCX, TXT, JPG or PNG, up to 10MB. Scanned CVs work too.</span>
                      </>
                    )}
                  </div>
                )}

                {inputMode === "paste" && (
                  <div className="atsx-field">
                    <textarea
                      value={cvText}
                      onChange={(e) => setCvText(e.target.value)}
                      placeholder="Paste the full text of your CV here…"
                      rows={11}
                    />
                    <span className={`atsx-count ${cvText.trim().length >= 100 ? "atsx-count--ok" : ""}`}>
                      {cvText.trim().length >= 100
                        ? <><i className="fas fa-check"></i> {cvText.length} characters</>
                        : `${cvText.length} / 100 characters minimum`}
                    </span>
                  </div>
                )}
              </div>

              <div className="atsx-step">
                <div className="atsx-step__head">
                  <span className="atsx-step__n">2</span>
                  <div>
                    <h2>Target job <span className="atsx-optional">Optional</span></h2>
                    <p>Paste the job advert to see how well your CV matches it. It makes the score much more accurate.</p>
                  </div>
                </div>
                <div className="atsx-field">
                  <textarea
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="e.g. Marketing Manager at Andela, Lagos (Hybrid). 5+ years in digital marketing; SEO, content strategy and paid ads; HubSpot and Google Analytics…"
                    rows={5}
                  />
                </div>
              </div>

              {error && (
                <div className="atsx-alert atsx-alert--error">
                  <i className="fas fa-circle-exclamation"></i> {error}
                </div>
              )}

              <div className="atsx-submit">
                <button
                  className="atsx-btn atsx-btn--primary atsx-btn--lg"
                  onClick={handleAnalyze}
                  disabled={analyzing || !cvText || cvText.trim().length < 100}
                >
                  {analyzing
                    ? <><i className="fas fa-circle-notch fa-spin"></i> Checking your CV…</>
                    : <><i className="fas fa-gauge-high"></i> Check my ATS score</>}
                </button>
                {!entitlement?.premium && (
                  <span className="atsx-submit__note"><i className="fas fa-crown"></i> Included with Premium, from {PLANS.monthly.priceLabel}/month</span>
                )}
              </div>

              {analyzing && analyzeProgress && (
                <div className="atsx-progress" role="status">
                  <div className="atsx-progress__bar"><span /></div>
                  <span>{analyzeProgress}</span>
                </div>
              )}
            </section>
          </>
        )}

        {/* ── RESULTS ── */}
        {result && (
          <div id="ats-results" className="atsx-results">
            {savedCvText && cvText !== savedCvText && (
              <div className="atsx-alert atsx-alert--info atsx-results__wide">
                <i className="fas fa-clock-rotate-left"></i>
                <span>Showing your last check{lastDate ? ` from ${lastDate}` : ""}.</span>
                <button onClick={handleReset}>Start a new check</button>
              </div>
            )}

            <aside className="atsx-summary">
              <div className="atsx-score">
                <svg viewBox="0 0 120 120" className="atsx-score__ring" aria-hidden="true">
                  <circle cx="60" cy="60" r="52" className="atsx-score__track" />
                  <circle
                    cx="60" cy="60" r="52"
                    className="atsx-score__value"
                    style={{ stroke: getScoreColor(result.overallScore), strokeDasharray: `${(result.overallScore / 100) * 326.7} 326.7` }}
                  />
                </svg>
                <div className="atsx-score__num">
                  <strong style={{ color: getScoreColor(result.overallScore) }}>{result.overallScore}</strong>
                  <span>out of 100</span>
                </div>
              </div>
              <div className="atsx-rating" style={{ color: getScoreColor(result.overallScore) }}>{result.rating}</div>
              <p className="atsx-summary__lead">
                {result.overallScore >= 80
                  ? "Strong. A few refinements will make it stand out."
                  : result.overallScore >= 60
                    ? "Good base. Fix the priorities below to pass more filters."
                    : "Likely to be filtered out. The priorities below will help most."}
              </p>

              {optimizeError && (
                <div className="atsx-alert atsx-alert--error"><i className="fas fa-circle-exclamation"></i> {optimizeError}</div>
              )}

              <button className="atsx-btn atsx-btn--primary atsx-btn--block" onClick={handleOptimize} disabled={optimizing}>
                {optimizing
                  ? <><i className="fas fa-circle-notch fa-spin"></i> Optimizing…</>
                  : <><i className="fas fa-wand-magic-sparkles"></i> Fix it with AI</>}
              </button>
              {optimizing && optimizeProgress && (
                <div className="atsx-progress" role="status">
                  <div className="atsx-progress__bar"><span /></div>
                  <span>{optimizeProgress}</span>
                </div>
              )}
              <p className="atsx-summary__hint">Rewrites your CV with these fixes and opens it in the builder, ready to review.</p>

              <div className="atsx-summary__actions">
                <button
                  className="atsx-btn atsx-btn--ghost"
                  onClick={() => { track("ats_build_manual_clicked"); navigate(builderPath); }}
                  disabled={optimizing}
                >
                  <i className="fas fa-pen"></i> Edit in builder
                </button>
                <button className="atsx-btn atsx-btn--ghost" onClick={handleDownloadReport}>
                  <i className="fas fa-file-arrow-down"></i> Save report
                </button>
                <button className="atsx-btn atsx-btn--ghost" onClick={handleReset}>
                  <i className="fas fa-rotate-right"></i> New check
                </button>
              </div>
            </aside>

            <div className="atsx-detail">
              <section className="atsx-panel">
                <h3>Score breakdown</h3>
                <div className="atsx-cats">
                  {CATEGORY_META.map((c) => {
                    const cat = result.categories?.[c.key];
                    if (!cat) return null;
                    const pct = (cat.score / cat.max) * 100;
                    return (
                      <div key={c.key} className="atsx-cat">
                        <div className="atsx-cat__top">
                          <span><i className={`fas ${c.icon}`}></i> {c.label}</span>
                          <strong>{cat.score}<small>/{cat.max}</small></strong>
                        </div>
                        <div className="atsx-cat__bar"><span style={{ width: `${pct}%`, background: getScoreColor(pct) }} /></div>
                        {cat.feedback && <p>{cat.feedback}</p>}
                      </div>
                    );
                  })}
                </div>
              </section>

              {result.topImprovements?.length > 0 && (
                <section className="atsx-panel">
                  <h3>Top priorities</h3>
                  <ol className="atsx-fixes">
                    {result.topImprovements.map((imp, i) => (
                      <li key={i}>
                        <span className="atsx-fixes__n">{i + 1}</span>
                        <div>
                          <h4>{imp.title}</h4>
                          <p>{imp.description}</p>
                          {imp.example && <div className="atsx-fixes__example"><span>Example</span>{imp.example}</div>}
                        </div>
                      </li>
                    ))}
                  </ol>
                </section>
              )}

              <div className="atsx-duo">
                {result.strengths?.length > 0 && (
                  <section className="atsx-panel atsx-panel--good">
                    <h3><i className="fas fa-circle-check"></i> What's working</h3>
                    <ul>{result.strengths.map((s, i) => <li key={i}>{s}</li>)}</ul>
                  </section>
                )}
                {result.atsRedFlags?.length > 0 && (
                  <section className="atsx-panel atsx-panel--warn">
                    <h3><i className="fas fa-triangle-exclamation"></i> Red flags</h3>
                    <ul>{result.atsRedFlags.map((f, i) => <li key={i}>{f}</li>)}</ul>
                  </section>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {paywallFor && (
        <PaywallModal
          reason="premium_feature"
          entitlement={entitlement}
          onClose={(action) => {
            const pending = paywallFor;
            setPaywallFor(null);
            if (action === "requery") setShowRequery(pending);
          }}
          onPaymentSuccess={() => {
            const pending = paywallFor;
            setPaywallFor(null);
            // Give the payment a moment to reach the server, then carry on.
            setTimeout(() => (pending === "optimize" ? handleOptimize() : handleAnalyze()), 2500);
          }}
        />
      )}

      {showRequery && (
        <PaymentRequery
          onClose={() => setShowRequery(false)}
          onSuccess={() => setShowRequery(false)}
        />
      )}

      {showAuthGate && (
        <div className="atsx-modal" onClick={() => setShowAuthGate(false)}>
          <div className="atsx-modal__box" role="dialog" aria-modal="true" aria-labelledby="atsx-gate-title" onClick={(e) => e.stopPropagation()}>
            <button className="atsx-modal__close" onClick={() => setShowAuthGate(false)} aria-label="Close">
              <i className="fas fa-xmark"></i>
            </button>
            <span className="atsx-modal__icon"><i className="fas fa-user-lock"></i></span>
            <h2 id="atsx-gate-title">Sign in to check your CV</h2>
            <p>Create a free account in 30 seconds. ATS checks and AI fixes come with Memora Premium.</p>
            <ul className="atsx-modal__perks">
              <li><i className="fas fa-check"></i> Your ATS score with clear priorities</li>
              <li><i className="fas fa-check"></i> One-tap AI rewrite into the CV builder</li>
              <li><i className="fas fa-check"></i> {FREE_DAILY_DOWNLOADS} free CV downloads every 24 hours</li>
              <li><i className="fas fa-check"></i> Premium from {PLANS.monthly.priceLabel}/month</li>
            </ul>
            <button
              className="atsx-btn atsx-btn--primary atsx-btn--block"
              onClick={() => {
                track("ats_optimize_auth_gate_signup_clicked");
                navigate("/auth", { state: { from: "/ats-check" } });
              }}
            >
              Create free account
            </button>
            <p className="atsx-modal__login">
              Already have an account?{" "}
              <button onClick={() => {
                track("ats_optimize_auth_gate_login_clicked");
                navigate("/auth", { state: { from: "/ats-check" } });
              }}>Log in</button>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
