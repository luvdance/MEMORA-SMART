import { useState } from "react";
import { BANDS, byScannerScore, prioritise, scoreRisk } from "../../../lib/academy/cyber/risk";

/**
 * PRIORITISE THE FINDINGS — the meeting, not the scanner.
 *
 * The lesson most vulnerability training fails to teach: a scanner's severity
 * score is not your risk. CVSS describes a vulnerability in the abstract. Risk
 * is that vulnerability on YOUR system, with your exposure and your data. A
 * 9.8 on an internal test box nobody can reach matters less than a 6.5 on the
 * payment server facing the internet, and an analyst who cannot say that in a
 * meeting will spend a career patching the wrong things first.
 *
 * So every finding here carries both a CVSS score and a context, and the
 * learner assigns a band. Sorting by CVSS alone fails on purpose. When the
 * attempt is marked, the two orderings are shown side by side: what the
 * scanner told you to do, and what you should actually do first.
 */
export default function RiskGrid({
  brief,
  findings = [],
  successMessage,
  onSolved,
  alreadySolved = false,
  readOnly = false,
}) {
  const [placements, setPlacements] = useState(() =>
    alreadySolved || readOnly
      ? Object.fromEntries(findings.map((f) => [f.id, f.expected]))
      : {}
  );
  const [result, setResult] = useState(() =>
    alreadySolved
      ? { ok: true, message: "You already ranked these correctly. The two orderings are below." }
      : null
  );

  const place = (id, band) => {
    if (readOnly) return;
    setPlacements((prev) => ({ ...prev, [id]: band }));
    setResult(null);
  };

  const check = () => {
    const scored = scoreRisk(findings, placements);
    if (scored.ok) {
      setResult({ ok: true, message: successMessage || scored.message });
      onSolved?.();
      return;
    }
    setResult({ ok: false, message: scored.message });
  };

  return (
    <div className="ac-risk">
      <div className="ac-risk__task">
        <span className="ac-note__label">{readOnly ? "The findings" : "Set the priority"}</span>
        <p>{brief}</p>
      </div>

      <div className="ac-risk__list">
        {findings.map((finding) => {
          const chosen = placements[finding.id];
          const settled = result?.ok;
          const wrong = result && !result.ok && chosen && chosen !== finding.expected;
          return (
            <div
              key={finding.id}
              className={`ac-risk__finding ${settled ? "is-settled" : ""} ${wrong ? "is-wrong" : ""}`}
            >
              <div className="ac-risk__facts">
                <h4>{finding.title}</h4>
                <div className="ac-risk__meta">
                  <span className="ac-risk__cvss" title="What the scanner said">
                    CVSS {finding.cvss.toFixed(1)}
                  </span>
                  <span className="ac-risk__exposure">{finding.exposure}</span>
                  {finding.dataAtRisk && (
                    <span className="ac-risk__data">{finding.dataAtRisk}</span>
                  )}
                </div>
              </div>

              <div className="ac-risk__bands" role="group" aria-label={`Priority for ${finding.title}`}>
                {BANDS.map((band) => (
                  <button
                    key={band.id}
                    type="button"
                    className={`ac-risk__band ac-risk__band--${band.id} ${
                      chosen === band.id ? "is-chosen" : ""
                    }`}
                    onClick={() => place(finding.id, band.id)}
                    disabled={readOnly}
                    aria-pressed={chosen === band.id}
                  >
                    {band.label}
                  </button>
                ))}
              </div>

              {(settled || readOnly) && <p className="ac-risk__why">{finding.why}</p>}
            </div>
          );
        })}
      </div>

      {!readOnly && (
        <div className="ac-risk__check">
          <button className="ac-risk__btn" onClick={check}>
            Check my priorities
          </button>
          {result && (
            <p className={`ac-risk__feedback ${result.ok ? "is-ok" : "is-bad"}`} role="status">
              {result.message}
            </p>
          )}
        </div>
      )}

      {(result?.ok || readOnly) && (
        <div className="ac-risk__compare">
          <div>
            <span className="ac-risk__comparelabel">What the scanner ordered</span>
            <ol>
              {byScannerScore(findings).map((f) => (
                <li key={f.id}>
                  <strong>{f.cvss.toFixed(1)}</strong> {f.title}
                </li>
              ))}
            </ol>
          </div>
          <div>
            <span className="ac-risk__comparelabel">What you fix first</span>
            <ol>
              {prioritise(findings).map((f) => (
                <li key={f.id}>
                  <span className={`ac-risk__tag ac-risk__tag--${f.expected}`}>
                    {BANDS.find((b) => b.id === f.expected)?.label}
                  </span>{" "}
                  {f.title}
                </li>
              ))}
            </ol>
          </div>
        </div>
      )}
    </div>
  );
}
