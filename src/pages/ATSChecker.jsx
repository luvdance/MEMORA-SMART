import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./ATSChecker.css";

export default function ATSChecker() {
  const navigate = useNavigate();
  const fileInputRef = useRef();

  const [inputMode, setInputMode] = useState("upload"); // "upload" | "paste"
  const [cvText, setCvText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [fileName, setFileName] = useState("");
  const [parsing, setParsing] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

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

  const handleReset = () => {
    setResult(null);
    setCvText("");
    setJobDescription("");
    setFileName("");
    setError("");
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

  return (
    <div className="ats">
      <div className="ats__container">

        {/* HEADER */}
        <header className="ats__header">
          <button className="ats__back" onClick={() => navigate("/")}>
            <i className="fas fa-arrow-left"></i> Home
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
                - Lead a team of 3 marketing associates
                - Report directly to the VP of Marketing`}
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

            {/* CTA */}
            <div className="ats__cta-card">
              <h2>Fix all of this in 5 minutes</h2>
              <p>
                Use Memora Smart's AI builder to rewrite your CV with these 
                improvements automatically applied. 5 ATS-friendly templates 
                built for Nigerians.
              </p>
              <div className="ats__cta-actions">
                <button
                  className="ats__cta-btn ats__cta-btn--primary"
                  onClick={() => navigate("/cv-builder")}
                >
                  <i className="fas fa-bolt"></i> Build My Optimized CV
                </button>
                <button
                  className="ats__cta-btn ats__cta-btn--secondary"
                  onClick={handleReset}
                >
                  <i className="fas fa-redo"></i> Check Another CV
                </button>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}