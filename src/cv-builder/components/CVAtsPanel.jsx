import { useState } from "react";
import { cvApi } from "../utils/cvAccess";
import { PREMIUM_FEATURES } from "../utils/plans";
import { track } from "../../utils/analytics";
import { cvToText } from "../utils/cvText";

function scoreColor(score) {
  if (score >= 80) return "#16a34a";
  if (score >= 60) return "#ca8a04";
  if (score >= 40) return "#ea580c";
  return "#dc2626";
}

const CATEGORY_LABELS = {
  structure: "Structure & formatting",
  keywords: "Keywords & relevance",
  achievements: "Achievements & metrics",
  summary: "Professional summary",
  contact: "Contact & essentials",
};

export default function CVAtsPanel({ open, onClose, cv, user, entitlement, onRequireAuth, onUpgrade, onApplyOptimized }) {
  const [jobDescription, setJobDescription] = useState("");
  const [busy, setBusy] = useState(null); // "check" | "optimize" | null
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [optimizedNote, setOptimizedNote] = useState("");

  if (!open) return null;

  const locked = !entitlement?.premium;

  const handleBlocked = (status, data) => {
    if (status === 401) { onRequireAuth(); return true; }
    if (status === 402) { onUpgrade("premium_feature"); return true; }
    setError(data.error || data.message || "Something went wrong. Please try again.");
    return true;
  };

  const runCheck = async () => {
    if (!user) return onRequireAuth();
    if (locked) return onUpgrade("premium_feature");
    const cvText = cvToText(cv);
    if (cvText.length < 100) {
      setError("Add a bit more to your CV first (summary, experience or skills), then run the check.");
      return;
    }
    setError("");
    setOptimizedNote("");
    setBusy("check");
    track("builder_ats_check_started", { hasJobDescription: !!jobDescription.trim() });
    try {
      const { status, data } = await cvApi("ats-score", user, { cvText, jobDescription: jobDescription.trim() });
      if (status === 200 && data.success) {
        setResult(data);
        track("builder_ats_check_completed", { score: data.overallScore });
      } else {
        handleBlocked(status, data);
      }
    } catch (err) {
      setError("Network error: " + err.message);
    }
    setBusy(null);
  };

  const runOptimize = async () => {
    if (!user) return onRequireAuth();
    if (locked) return onUpgrade("premium_feature");
    const cvText = cvToText(cv);
    if (cvText.length < 100) {
      setError("Add a bit more to your CV first, then optimize.");
      return;
    }
    setError("");
    setBusy("optimize");
    track("builder_optimize_started", { score: result?.overallScore });
    try {
      const { status, data } = await cvApi("optimize", user, {
        cvText,
        improvements: result?.topImprovements || [],
        atsScore: result?.overallScore,
        jobDescription: jobDescription.trim(),
      });
      if (status === 200 && data.success && data.cv) {
        onApplyOptimized(data.cv);
        setOptimizedNote("Your CV has been rewritten. Review it in the form, and use Undo on the banner if you prefer the original.");
        setResult(null);
        track("builder_optimize_completed");
      } else {
        handleBlocked(status, data);
      }
    } catch (err) {
      setError("Network error: " + err.message);
    }
    setBusy(null);
  };

  return (
    <>
      <div className="cv-ats__backdrop" onClick={onClose} />
      <aside className="cv-ats" role="dialog" aria-modal="true" aria-labelledby="cv-ats-title">
        <header className="cv-ats__head">
          <div>
            <h3 id="cv-ats-title"><i className="fas fa-bolt"></i> ATS Tools</h3>
            <p>Score this CV and optimize it without leaving the builder.</p>
          </div>
          <button className="cv-ats__close" onClick={onClose} aria-label="Close">
            <i className="fas fa-times"></i>
          </button>
        </header>

        <div className="cv-ats__body">
          {locked && (
            <div className="cv-ats__locked">
              <div className="cv-ats__locked-icon"><i className="fas fa-crown"></i></div>
              <h4>Premium feature</h4>
              <p>The ATS checker and AI optimizer come with every Premium plan.</p>
              <ul>
                {PREMIUM_FEATURES.map(f => <li key={f}><i className="fas fa-check"></i> {f}</li>)}
              </ul>
              <button className="cv-ats__primary" onClick={() => (user ? onUpgrade("premium_feature") : onRequireAuth())}>
                <i className="fas fa-crown"></i> {user ? "See Premium plans" : "Sign in to continue"}
              </button>
            </div>
          )}

          {!locked && (
            <>
              <label className="cv-ats__label" htmlFor="cv-ats-jd">
                Target job description <span>(optional, but gives a sharper score)</span>
              </label>
              <textarea
                id="cv-ats-jd"
                className="cv-ats__jd"
                rows={4}
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the job advert you're applying for..."
              />

              <div className="cv-ats__actions">
                <button className="cv-ats__primary" onClick={runCheck} disabled={!!busy}>
                  {busy === "check"
                    ? <><i className="fas fa-spinner fa-spin"></i> Checking...</>
                    : <><i className="fas fa-search"></i> {result ? "Re-check score" : "Check ATS score"}</>}
                </button>
                <button className="cv-ats__secondary" onClick={runOptimize} disabled={!!busy}>
                  {busy === "optimize"
                    ? <><i className="fas fa-spinner fa-spin"></i> Optimizing...</>
                    : <><i className="fas fa-magic"></i> Optimize with AI</>}
                </button>
              </div>
              {busy === "optimize" && (
                <p className="cv-ats__hint">Rewriting your summary and bullet points. This takes about 20–40 seconds.</p>
              )}
            </>
          )}

          {error && (
            <div className="cv-ats__error"><i className="fas fa-exclamation-circle"></i> {error}</div>
          )}
          {optimizedNote && (
            <div className="cv-ats__success"><i className="fas fa-check-circle"></i> {optimizedNote}</div>
          )}

          {result && !locked && (
            <div className="cv-ats__result">
              <div className="cv-ats__score">
                <div
                  className="cv-ats__ring"
                  style={{ background: `conic-gradient(${scoreColor(result.overallScore)} ${result.overallScore * 3.6}deg, #eef0f4 0)` }}
                >
                  <span>{result.overallScore}</span>
                </div>
                <div>
                  <strong style={{ color: scoreColor(result.overallScore) }}>{result.rating}</strong>
                  <p>out of 100</p>
                </div>
              </div>

              {result.categories && (
                <div className="cv-ats__cats">
                  {Object.entries(result.categories).map(([key, c]) => (
                    <div key={key} className="cv-ats__cat">
                      <div className="cv-ats__cat-top">
                        <span>{CATEGORY_LABELS[key] || key}</span>
                        <span>{c.score}/{c.max}</span>
                      </div>
                      <div className="cv-ats__bar">
                        <span style={{ width: `${(c.score / c.max) * 100}%`, background: scoreColor((c.score / c.max) * 100) }} />
                      </div>
                      {c.feedback && <p>{c.feedback}</p>}
                    </div>
                  ))}
                </div>
              )}

              {result.topImprovements?.length > 0 && (
                <div className="cv-ats__list">
                  <h4>Top improvements</h4>
                  <ol>
                    {result.topImprovements.map((imp, i) => (
                      <li key={i}>
                        <strong>{imp.title}</strong>
                        <p>{imp.description}</p>
                        {imp.example && <em>{imp.example}</em>}
                      </li>
                    ))}
                  </ol>
                  <button className="cv-ats__secondary cv-ats__secondary--wide" onClick={runOptimize} disabled={!!busy}>
                    <i className="fas fa-magic"></i> Apply these with AI
                  </button>
                </div>
              )}

              {result.atsRedFlags?.length > 0 && (
                <div className="cv-ats__list cv-ats__list--warn">
                  <h4>ATS red flags</h4>
                  <ul>{result.atsRedFlags.map((f, i) => <li key={i}>{f}</li>)}</ul>
                </div>
              )}

              {result.strengths?.length > 0 && (
                <div className="cv-ats__list cv-ats__list--good">
                  <h4>What's working</h4>
                  <ul>{result.strengths.map((s, i) => <li key={i}>{s}</li>)}</ul>
                </div>
              )}
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
