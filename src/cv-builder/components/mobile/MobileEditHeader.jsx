import { useEffect, useMemo, useRef } from "react";
import { computeStrength, STEP_META } from "../../utils/cvStrength";

// Ring geometry (SVG keeps it crisp at any pixel density).
const R = 26;
const C = 2 * Math.PI * R;

// ── MOBILE EDIT HEADER ──
// CV strength ring with the single most valuable next step, ATS shortcuts,
// and a step rail where finished sections earn a tick.
export default function MobileEditHeader({ cv, template, step, setStep, entitlement, onAts }) {
  const strength = useMemo(() => computeStrength(cv, template), [cv, template]);
  const railRef = useRef(null);

  // Keep the active step chip in view as the user moves through the form.
  useEffect(() => {
    const chip = railRef.current?.querySelector(`[data-step="${step}"]`);
    if (!chip || !railRef.current) return;
    const rail = railRef.current;
    rail.scrollTo({ left: chip.offsetLeft - rail.clientWidth / 2 + chip.clientWidth / 2, behavior: "smooth" });
  }, [step]);

  const goNext = () => {
    if (!strength.next) return;
    setStep(strength.next.step);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="mapp-edit">
      <section className={`mapp-strength mapp-strength--${strength.level.tone}`} aria-label="CV strength">
        <div className="mapp-strength__ring" role="img" aria-label={`CV strength ${strength.score} percent`}>
          <svg viewBox="0 0 64 64" width="64" height="64">
            <circle cx="32" cy="32" r={R} className="mapp-strength__track" />
            <circle
              cx="32" cy="32" r={R}
              className="mapp-strength__value"
              strokeDasharray={C}
              strokeDashoffset={C * (1 - strength.score / 100)}
            />
          </svg>
          <span>{strength.score}<small>%</small></span>
        </div>

        <div className="mapp-strength__text">
          <span className="mapp-strength__eyebrow">CV strength</span>
          <strong>{strength.level.name}</strong>
          {strength.next ? (
            <button className="mapp-strength__next" onClick={goNext}>
              {strength.next.label}
              <span className="mapp-strength__gain">+{strength.next.gain}%</span>
              <i className="fas fa-chevron-right"></i>
            </button>
          ) : (
            <span className="mapp-strength__done"><i className="fas fa-medal"></i> Every section is filled in</span>
          )}
        </div>
      </section>

      <div className="mapp-ats">
        <button className="mapp-ats__btn" onClick={onAts}>
          <span className="mapp-ats__icon mapp-tone--green"><i className="fas fa-gauge-high"></i></span>
          <span className="mapp-ats__text">
            <strong>ATS score</strong>
            <small>See how recruiters' software reads it</small>
          </span>
          {!entitlement?.premium && <i className="fas fa-crown mapp-ats__crown" aria-label="Premium"></i>}
        </button>
        <button className="mapp-ats__btn" onClick={onAts}>
          <span className="mapp-ats__icon mapp-tone--violet"><i className="fas fa-wand-magic-sparkles"></i></span>
          <span className="mapp-ats__text">
            <strong>AI rewrite</strong>
            <small>Stronger bullets in one tap</small>
          </span>
          {!entitlement?.premium && <i className="fas fa-crown mapp-ats__crown" aria-label="Premium"></i>}
        </button>
      </div>

      <div className="mapp-steps" ref={railRef} role="tablist" aria-label="CV sections">
        {STEP_META.map((s, i) => {
          const done = strength.steps[i];
          const active = step === i;
          return (
            <button
              key={s.label}
              data-step={i}
              role="tab"
              aria-selected={active}
              className={`mapp-step ${active ? "mapp-step--active" : ""} ${done ? "mapp-step--done" : ""}`}
              onClick={() => setStep(i)}
            >
              <span className={`mapp-step__icon mapp-tone--${s.tone}`}>
                <i className={`fas ${s.icon}`}></i>
                {done && <span className="mapp-step__tick" aria-label="complete"><i className="fas fa-check"></i></span>}
              </span>
              <span className="mapp-step__label">{s.label}</span>
            </button>
          );
        })}
      </div>

      <div className="mapp-steps__progress" aria-hidden="true">
        <span>Step {step + 1} of {STEP_META.length}</span>
        <span className="mapp-steps__bar"><span style={{ width: `${((step + 1) / STEP_META.length) * 100}%` }} /></span>
      </div>
    </div>
  );
}
