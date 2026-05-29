import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./ATSChecker.css";
import { track } from "../utils/analytics";
import { useEffect } from "react"; 
import { useAuth } from "../context/AuthContext";

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

  //cv optimizer state
  const [optimizing, setOptimizing] = useState(false);
  const [optimizeError, setOptimizeError] = useState("");

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

  const maxSize = 5 * 1024 * 1024;
  if (file.size > maxSize) {
    setError("File too large. Max 5MB.");
    return;
  }

  setError("");
  setParsing(true);
  setFileName(file.name);

  try {
    const ext = file.name.toLowerCase().split(".").pop();
    let text = "";

    if (ext === "pdf") {
      text = await parsePdfInBrowser(file);
    } else if (ext === "docx" || ext === "doc") {
      // Send DOCX to server (mammoth works fine on Vercel)
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
      throw new Error("Unsupported file type. Upload PDF, DOCX, or TXT.");
    }

    if (!text || text.trim().length < 100) {
      throw new Error("Could not extract enough text. Is your CV image-only or scanned?");
    }

    setCvText(text);
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

  const handleAnalyze = async () => {
    if (!cvText || cvText.trim().length < 100) {
      setError("Please provide a complete CV (at least 100 characters)");
      return;
    }

    track("ats_check_started", { hasJobDescription: !!jobDescription.trim() });
    setError("");
    setAnalyzing(true);
    setResult(null);

    try {
      const res = await fetch("/api/ats-score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cvText: cvText.trim(),
          jobDescription: jobDescription.trim(),
        }),
      });

      const data = await res.json();

        if (data.success) {
        setResult(data);
        track("ats_check_completed", { score: data.overallScore, rating: data.rating });
        // Save to localStorage
        try {
            localStorage.setItem("ats_last_result", JSON.stringify(data));
            localStorage.setItem("ats_last_cv", cvText);
            localStorage.setItem("ats_last_jd", jobDescription || "");
            localStorage.setItem("ats_last_date", new Date().toISOString());
            setSavedCvText(cvText);
        } catch (e) {
            console.warn("Could not save to localStorage:", e);
        }
        
        setTimeout(() => {
            document.getElementById("ats-results")?.scrollIntoView({ behavior: "smooth" });
        }, 100);
        } else {
        setError(data.error || "Analysis failed");
        }
    } catch (err) {
      setError("Network error: " + err.message);
    }

    setAnalyzing(false);
  };

 //handle optimize
 const handleOptimize = async () => {
  // Use cvText OR savedCvText as fallback
  const textToOptimize = cvText || savedCvText;

  if (!textToOptimize) {
    setOptimizeError("No CV text found. Please re-upload or paste your CV.");
    return;
  }
  if (!result) {
    setOptimizeError("No analysis result. Please run an ATS check first.");
    return;
  }

  // AUTH GATE — must be signed in
  if (!user) {
    track("ats_optimize_auth_gate_shown", { score: result.overallScore });
    // Save state so they can resume after login
    localStorage.setItem("pending_optimize", JSON.stringify({
      cvText: textToOptimize,   // ← was cvText
      improvements: result.topImprovements || [],
      atsScore: result.overallScore,
      jobDescription: jobDescription || "",
    }));
    setShowAuthGate(true);
    return;
  }

  track("ats_optimize_started", { score: result.overallScore });
  setOptimizing(true);
  setOptimizeError("");

  try {
    const res = await fetch("/api/optimize-cv", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        cvText: textToOptimize,   // ← was cvText
        improvements: result.topImprovements || [],
        atsScore: result.overallScore,
        jobDescription: jobDescription || "",
      }),
    });

    const data = await res.json();
    //data success
    if (data.success && data.cv) {
      localStorage.setItem("optimized_cv", JSON.stringify(data.cv));
      localStorage.setItem("optimized_cv_source", JSON.stringify({
        previousScore: result.overallScore,
        timestamp: new Date().toISOString(),
      }));

      track("ats_optimize_completed", { score: result.overallScore });
      navigate("/dashboard/cv-builder?optimized=true");
    } else {
      setOptimizeError(data.error || "Optimization failed. Please try again.");
      track("ats_optimize_failed");
    }
  } catch (err) {
    setOptimizeError("Network error: " + err.message);
    track("ats_optimize_failed");
  }

  setOptimizing(false);
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

  const getRatingEmoji = (rating) => {
    switch (rating) {
      case "Excellent": return "🎯";
      case "Good": return "👍";
      case "Needs Work": return "⚠️";
      case "Critical": return "🚨";
      default: return "📄";
    }
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

    // Trigger optimization with saved data
    setOptimizing(true);
    setOptimizeError("");
    track("ats_optimize_resumed_after_signup");

    fetch("/api/optimize-cv", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(pending),
    })
      .then(res => res.json())
      .then(data => {
        if (data.success && data.cv) {
          localStorage.setItem("optimized_cv", JSON.stringify(data.cv));
          localStorage.setItem("optimized_cv_source", JSON.stringify({
            previousScore: pending.atsScore,
            timestamp: new Date().toISOString(),
          }));
          track("ats_optimize_completed", { score: pending.atsScore, resumed: true });
          navigate("/dashboard/cv-builder?optimized=true");
        } else {
          setOptimizeError(data.error || "Optimization failed. Please try again.");
          setOptimizing(false);
        }
      })
      .catch(err => {
        setOptimizeError("Network error: " + err.message);
        setOptimizing(false);
      });
  } catch (err) {
    console.error("Resume optimization failed:", err);
  }
}, [user]);

  return (
    <div className="ats">
      <div className="ats__container">

        {/* HEADER */}
        <header className="ats__header">
          <button className="ats__back" onClick={() => navigate("/cv-builder")}>
            <i className="fas fa-arrow-left"></i> Back to CV Builder
        </button>
          <div className="ats__hero">
            <div className="ats__hero-badge">FREE TOOL</div>
            <h1>Is your CV invisible to ATS?</h1>
            <p>
              75% of Nigerian companies use Applicant Tracking Systems. 
              Your CV gets filtered by software <strong>before</strong> a 
              human sees it. Find out your score in 10 seconds.
            </p>
          </div>
        </header>

        {/* INPUT SECTION */}
        {!result && (
          <div className="ats__input-section">

            {/* MODE TABS */}
            <div className="ats__mode-tabs">
              <button
                className={`ats__mode-tab ${inputMode === "upload" ? "ats__mode-tab--active" : ""}`}
                onClick={() => setInputMode("upload")}
              >
                <i className="fas fa-file-upload"></i> Upload File
              </button>
              <button
                className={`ats__mode-tab ${inputMode === "paste" ? "ats__mode-tab--active" : ""}`}
                onClick={() => setInputMode("paste")}
              >
                <i className="fas fa-paste"></i> Paste Text
              </button>
            </div>

            {/* UPLOAD MODE */}
            {inputMode === "upload" && (
              <div className="ats__upload-zone">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.docx,.doc,.txt"
                  onChange={handleFileUpload}
                  style={{ display: "none" }}
                />
                {parsing ? (
                  <div className="ats__upload-state">
                    <i className="fas fa-spinner fa-spin"></i>
                    <p>Reading your CV...</p>
                  </div>
                ) : fileName ? (
                  <div className="ats__upload-state">
                    <i className="fas fa-file-check" style={{ color: "#16a34a" }}></i>
                    <p><strong>{fileName}</strong></p>
                    <span>Successfully loaded</span>
                  </div>
                ) : (
                  <div
                    className="ats__upload-state"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <i className="fas fa-cloud-upload-alt"></i>
                    <p>Click to upload your CV</p>
                    <span>PDF, DOCX, or TXT • Max 5MB</span>
                  </div>
                )}
              </div>
            )}

            {/* PASTE MODE */}
            {inputMode === "paste" && (
              <div className="ats__paste-zone">
                <label>Paste your CV text</label>
                <textarea
                  value={cvText}
                  onChange={(e) => setCvText(e.target.value)}
                  placeholder="Paste the full text of your CV here..."
                  rows={12}
                />
                <div className="ats__char-count">
                  {cvText.length} characters {cvText.length < 100 && "(minimum 100)"}
                </div>
              </div>
            )}

            {/* OPTIONAL JOB DESCRIPTION */}
            <div className="ats__job-section">
              <label>
                <i className="fas fa-bullseye"></i> Target Job Description 
                <span className="ats__optional">(optional — but boosts accuracy 3x)</span>
                </label>
                <p className="ats__hint">
                Copy the entire job posting from LinkedIn, Jobberman, or wherever you found it. 
                The more detail, the more accurate your match score.
                </p>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder={`Paste the full job description here. Example:

Job Title: Marketing Manager
Company: Andela Nigeria
Location: Lagos, Hybrid

We are seeking an experienced Marketing Manager to lead our brand growth initiatives. The ideal candidate will:

- 5+ years experience in digital marketing
- Strong skills in SEO, content strategy, paid ads
- Proven track record managing budgets of ₦5M+
- Experience with HubSpot, Google Analytics, Meta Ads
- Bachelor's degree in Marketing or related field

Responsibilities:
- Develop and execute marketing campaigns
- Manage social media presence across platforms
- Lead a team of 3 marketing associates`}
                rows={8}
                />
            </div>

            {error && (
              <div className="ats__error">
                <i className="fas fa-exclamation-circle"></i> {error}
              </div>
            )}

            <button
              className="ats__analyze-btn"
              onClick={handleAnalyze}
              disabled={analyzing || !cvText || cvText.trim().length < 100}
            >
              {analyzing ? (
                <><i className="fas fa-spinner fa-spin"></i> Analyzing your CV...</>
              ) : (
                <><i className="fas fa-magic"></i> Get My ATS Score</>
              )}
            </button>

            <p className="ats__privacy">
              <i className="fas fa-lock"></i> Your CV is analyzed once and not stored.
            </p>
          </div>
        )}

        {/* RESULTS */}
        {result && (
          <div id="ats-results" className="ats__results">

            {result && savedCvText && cvText !== savedCvText && (
            <div className="ats__saved-banner">
                <i className="fas fa-history"></i>
                <span>
                Showing your last analyzed CV from{" "}
                {(() => {
                    try {
                    const d = new Date(localStorage.getItem("ats_last_date"));
                    return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
                    } catch { return "earlier"; }
                })()}
                </span>
                <button onClick={handleReset}>
                <i className="fas fa-times"></i> Start fresh
                </button>
            </div>
            )}
            {/* SCORE GAUGE */}
            <div className="ats__score-card">
              <div className="ats__score-gauge">
                <svg viewBox="0 0 200 200" className="ats__gauge-svg">
                  <circle cx="100" cy="100" r="85" className="ats__gauge-bg" />
                  <circle
                    cx="100" cy="100" r="85"
                    className="ats__gauge-progress"
                    style={{
                      stroke: getScoreColor(result.overallScore),
                      strokeDasharray: `${(result.overallScore / 100) * 534} 534`,
                    }}
                  />
                </svg>
                
                <div className="ats__gauge-text">
                  <div className="ats__gauge-score" style={{ color: getScoreColor(result.overallScore) }}>
                    {result.overallScore}
                  </div>
                  <div className="ats__gauge-label">out of 100</div>
                </div>
              </div>
              <div className="ats__rating">
                <span>{getRatingEmoji(result.rating)}</span>
                <h2>{result.rating}</h2>
              </div>
            </div>

            {/* DOWNLOAD ACTIONS */}
            <div className="ats__download-actions">
              <button
                className="ats__download-btn"
                onClick={handleDownloadReport}
              >
                <i className="fas fa-file-pdf"></i> Download Report as PDF
              </button>
              <button
                className="ats__download-btn ats__download-btn--secondary"
                onClick={() => window.print()}
              >
                <i className="fas fa-print"></i> Print Report
              </button>
              <button
                className="ats__download-btn ats__download-btn--secondary"
                onClick={handleReset}
              >
                <i className="fas fa-redo"></i> Check New CV
              </button>
            </div>

            {/* CATEGORIES */}
            <div className="ats__categories">
              <h3>Score Breakdown</h3>
              <div className="ats__categories-grid">
                {[
                  { key: "structure", label: "Structure & Formatting", icon: "th-list" },
                  { key: "keywords", label: "Keywords & Relevance", icon: "key" },
                  { key: "achievements", label: "Achievements & Metrics", icon: "chart-line" },
                  { key: "summary", label: "Professional Summary", icon: "align-left" },
                  { key: "contact", label: "Contact & Essentials", icon: "id-card" },
                ].map(c => {
                  const cat = result.categories?.[c.key];
                  if (!cat) return null;
                  const pct = (cat.score / cat.max) * 100;
                  return (
                    <div key={c.key} className="ats__category-card">
                      <div className="ats__category-header">
                        <i className={`fas fa-${c.icon}`}></i>
                        <span>{c.label}</span>
                      </div>
                      <div className="ats__category-bar">
                        <div
                          className="ats__category-bar-fill"
                          style={{
                            width: `${pct}%`,
                            background: getScoreColor(pct),
                          }}
                        ></div>
                      </div>
                      <div className="ats__category-meta">
                        <strong>{cat.score}/{cat.max}</strong>
                        <span>{cat.feedback}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* TOP IMPROVEMENTS */}
            <div className="ats__improvements">
              <h3>🎯 Top 5 Improvements (in priority order)</h3>
              {result.topImprovements?.map((imp, i) => (
                <div key={i} className="ats__improvement-card">
                  <div className="ats__improvement-num">{i + 1}</div>
                  <div className="ats__improvement-body">
                    <h4>{imp.title}</h4>
                    <p>{imp.description}</p>
                    {imp.example && (
                      <div className="ats__improvement-example">
                        <strong>Example:</strong> {imp.example}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* STRENGTHS */}
            {result.strengths?.length > 0 && (
              <div className="ats__strengths">
                <h3>✅ What's Working</h3>
                <ul>
                  {result.strengths.map((s, i) => <li key={i}>{s}</li>)}
                </ul>
              </div>
            )}

            {/* RED FLAGS */}
            {result.atsRedFlags?.length > 0 && (
              <div className="ats__redflags">
                <h3>🚨 ATS Red Flags</h3>
                <ul>
                  {result.atsRedFlags.map((f, i) => <li key={i}>{f}</li>)}
                </ul>
              </div>
            )}

            {/* CTA — OPTIMIZE */}
            <div className="ats__cta-card">
              <h2>Fix all of this automatically in 30 seconds ⚡</h2>
              <p>
                Let AI apply every improvement above to your CV. We'll rewrite weak sections,
                add quantified achievements, and structure it for ATS — then load it into the
                Memora CV builder ready to download.
              </p>

              {optimizeError && (
                <div className="ats__optimize-error">
                  <i className="fas fa-exclamation-circle"></i> {optimizeError}
                </div>
              )}

              <div className="ats__cta-actions">
                <button
                  className="ats__cta-btn ats__cta-btn--primary ats__cta-btn--optimize"
                  onClick={handleOptimize}
                  disabled={optimizing}
                >
                  {optimizing ? (
                    <>
                      <i className="fas fa-spinner fa-spin"></i> AI is rewriting your CV...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-magic"></i> Optimize My CV with AI
                    </>
                  )}
                </button>
                <button
                  className="ats__cta-btn ats__cta-btn--secondary"
                  onClick={() => {
                    track("ats_build_manual_clicked");
                    navigate("/cv-builder");
                  }}
                  disabled={optimizing}
                >
                  <i className="fas fa-edit"></i> I'll Build Manually
                </button>
              </div>

              <p className="ats__cta-hint">
                <i className="fas fa-info-circle"></i>
                Your CV stays editable in the builder — review and adjust anything before downloading.
              </p>
            </div>

          </div>
        )}

      {/* AUTH GATE MODAL */}
{showAuthGate && (
  <div className="ats__auth-gate" onClick={() => setShowAuthGate(false)}>
    <div className="ats__auth-gate-box" onClick={(e) => e.stopPropagation()}>
      <button
        className="ats__auth-gate-close"
        onClick={() => setShowAuthGate(false)}
        aria-label="Close"
      >
        <i className="fas fa-times"></i>
      </button>

      <div className="ats__auth-gate-icon">
        <i className="fas fa-magic"></i>
      </div>

      <h2>Save your optimized CV ✨</h2>
      <p>
        Sign up free in 30 seconds and we'll rewrite your CV with all the 
        improvements automatically. Your CV will be ready to download.
      </p>

      <div className="ats__auth-gate-perks">
        <div className="ats__auth-gate-perk">
          <i className="fas fa-check"></i> AI rewrites your weak sections
        </div>
        <div className="ats__auth-gate-perk">
          <i className="fas fa-check"></i> 7 ATS-friendly templates
        </div>
        <div className="ats__auth-gate-perk">
          <i className="fas fa-check"></i> First download free
        </div>
        <div className="ats__auth-gate-perk">
          <i className="fas fa-check"></i> First 50 paying customers: 6 CVs for ₦3,500
        </div>
      </div>

      <button
        className="ats__auth-gate-btn"
        onClick={() => {
          track("ats_optimize_auth_gate_signup_clicked");
          navigate("/auth", { state: { from: "/ats-check" } });
        }}
      >
        <i className="fas fa-user-plus"></i> Create Free Account
      </button>

      <p className="ats__auth-gate-login">
        Already have an account?{" "}
        <span onClick={() => {
          track("ats_optimize_auth_gate_login_clicked");
          navigate("/auth", { state: { from: "/ats-check" } });
        }}>
          Log in
        </span>
      </p>
    </div>
  </div>
)}
      </div>
    </div>
  );
}