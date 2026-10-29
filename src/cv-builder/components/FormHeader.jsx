import { useEffect, useMemo, useRef } from "react";
import { computeStrength, STEP_META } from "../utils/cvStrength";

// Ring geometry (SVG keeps it crisp at any pixel density).
const R = 26;
const C = 2 * Math.PI * R;

// ── FORM HEADER (desktop + phone) ──
// CV strength ring with the single most valuable next step, and a step rail
// where finished sections earn a tick. On phones it also carries the ATS
// shortcuts (desktop has them in the bar above the form).
export default function FormHeader({ cv, template, step, setStep, entitlement, onAts, showTools }) {
  const strength = useMemo(() => computeStrength(cv, template), [cv, template]);
  const railRef = useRef(null);

  // Keep the active step chip in view as the user moves through the form.
  useEffect(() => {
    const rail = railRef.current;
    const chip = rail?.querySelector(`[data-step="${step}"]`);
    if (!chip) return;
    rail.scrollTo({ left: chip.offsetLeft - rail.clientWidth / 2 + chip.clientWidth / 2, behavior: "smooth" });
  }, [step]);

  return (
    <div className="cvf-header">
      <section className={`cvf-strength cvf-strength--${strength.level.tone}`} aria-label="CV strength">
        <div className="cvf-strength__ring" role="img" aria-label={`CV strength ${strength.score} percent`}>
          <svg viewBox="0 0 64 64" width="60" height="60">
            <circle cx="32" cy="32" r={R} className="cvf-strength__track" />
            <circle
              cx="32" cy="32" r={R}
              className="cvf-strength__value"
              strokeDasharray={C}
              strokeDashoffset={C * (1 - strength.score / 100)}
            />
          </svg>
          <span>{strength.score}<small>%</small></span>
        </div>

        <div className="cvf-strength__text">
          <span className="cvf-strength__eyebrow">CV strength</span>
          <strong>{strength.level.name}</strong>
          {strength.next ? (
            <button className="cvf-strength__next" onClick={() => setStep(strength.next.step)}>
              <span>{strength.next.label}</span>
              <span className="cvf-strength__gain">+{strength.next.gain}%</span>
              <i className="fas fa-chevron-right"></i>
            </button>
          ) : (
            <span className="cvf-strength__done"><i className="fas fa-medal"></i> Every section is filled in</span>
          )}
        </div>
      </section>

      {showTools && (
        <div className="cvf-tools">
          <button className="cvf-tools__btn" onClick={onAts}>
            <span className="cvf-tools__icon cvf-tone--green"><i className="fas fa-gauge-high"></i></span>
            <span className="cvf-tools__text">
              <strong>ATS score</strong>
              <small>See how recruiters' software reads it</small>
            </span>
            {!entitlement?.premium && <i className="fas fa-crown cvf-tools__crown" aria-label="Premium"></i>}
          </button>
          <button className="cvf-tools__btn" onClick={onAts}>
            <span className="cvf-tools__icon cvf-tone--violet"><i className="fas fa-wand-magic-sparkles"></i></span>
            <span className="cvf-tools__text">
              <strong>AI rewrite</strong>
              <small>Stronger bullets in one tap</small>
            </span>
            {!entitlement?.premium && <i className="fas fa-crown cvf-tools__crown" aria-label="Premium"></i>}
          </button>
        </div>
      )}

      <div className="cvf-steps" ref={railRef} role="tablist" aria-label="CV sections">
        {STEP_META.map((s, i) => {
          const done = strength.steps[i];
          const active = step === i;
          return (
            <button
              key={s.label}
              data-step={i}
              role="tab"
              aria-selected={active}
              className={`cvf-step ${active ? "cvf-step--active" : ""} ${done ? "cvf-step--done" : ""}`}
              onClick={() => setStep(i)}
            >
              <span className={`cvf-step__icon cvf-tone--${s.tone}`}>
                <i className={`fas ${s.icon}`}></i>
                {done && <span className="cvf-step__tick" aria-label="complete"><i className="fas fa-check"></i></span>}
              </span>
              <span className="cvf-step__label">{s.label}</span>
            </button>
          );
        })}
      </div>

      <div className="cvf-progress" aria-hidden="true">
        <span>Step {step + 1} of {STEP_META.length}</span>
        <span className="cvf-progress__bar"><span style={{ width: `${((step + 1) / STEP_META.length) * 100}%` }} /></span>
        <span>{strength.steps.filter(Boolean).length} done</span>
      </div>
    </div>
  );
}
