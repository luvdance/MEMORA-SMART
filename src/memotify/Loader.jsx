import { useId } from "react";
import mark from "../assets/memotify/mark.png";

/**
 * The Memotify loader: the brand mark inside a ring that sweeps from the
 * logo's blue to its violet.
 *
 * Imported straight into App.jsx as the fallback while the Memotify bundle
 * downloads, before memotify.css exists, so it carries its own styles. Keep it
 * small: everything here ships in the main bundle.
 */
const CSS = `
.mfl { display: grid; place-items: center; align-content: center; gap: 14px; padding: 34px 16px; color: #4c4975; font: 500 15px/1.4 "Hanken Grotesk", system-ui, sans-serif; text-align: center; }
.mfl--page { min-height: 100vh; min-height: 100dvh; background: #f6f4fb; }
.mfl__ring { position: relative; width: var(--mfl-size); height: var(--mfl-size); }
.mfl__ring svg { position: absolute; inset: 0; width: 100%; height: 100%; animation: mfl-spin 1.1s linear infinite; }
.mfl__ring img { position: absolute; inset: 0; margin: auto; width: 54%; height: auto; animation: mfl-breathe 2.2s ease-in-out infinite; }
.mfl p { margin: 0; }
@keyframes mfl-spin { to { transform: rotate(360deg); } }
@keyframes mfl-breathe { 0%, 100% { transform: scale(0.94); } 50% { transform: scale(1); } }
@media (prefers-reduced-motion: reduce) {
  .mfl__ring svg { animation-duration: 3s; }
  .mfl__ring img { animation: none; }
}`;

export default function Loader({ label = "Loading", page = false, size = page ? 84 : 52 }) {
  const gradient = `mfl-${useId().replace(/:/g, "")}`;
  return (
    <div className={`mfl ${page ? "mfl--page" : ""}`} role="status" aria-live="polite">
      <style>{CSS}</style>
      <div className="mfl__ring" style={{ "--mfl-size": `${size}px` }} aria-hidden="true">
        <svg viewBox="0 0 100 100">
          <defs>
            <linearGradient id={gradient} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#6699FF" />
              <stop offset="100%" stopColor="#9D00FF" />
            </linearGradient>
          </defs>
          <circle cx="50" cy="50" r="45" fill="none" stroke="#e3e0f0" strokeWidth="6" />
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke={`url(#${gradient})`}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray="88 195"
          />
        </svg>
        <img src={mark} alt="" />
      </div>
      <p>{label}</p>
    </div>
  );
}
