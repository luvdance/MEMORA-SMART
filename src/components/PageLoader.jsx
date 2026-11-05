import { useEffect, useState } from "react";

/**
 * The site-wide loader, shown while a page's code downloads.
 *
 * Every route in App.jsx is lazy, so this is the first thing a visitor sees
 * on a cold load and between pages. It ships in the main bundle before any
 * page stylesheet exists, so it carries its own styles and no images. Keep it
 * small.
 *
 * Two details matter more than the spinner:
 *
 *   - It waits DELAY ms before appearing. Most page chunks arrive faster than
 *     that once cached, and a loader that flashes for one frame reads as a
 *     glitch, not as speed.
 *   - After SLOW ms it says so. On a slow connection a spinner with no words
 *     looks the same as a broken page, and people leave broken pages.
 */
const DELAY = 180;
const SLOW = 6000;

const CSS = `
.mpl { position: fixed; inset: 0; z-index: 50; display: grid; place-items: center; align-content: center; gap: 16px; padding: 24px 16px; background: #f7f8fc; color: #4c5370; font: 500 15px/1.45 Inter, system-ui, -apple-system, sans-serif; text-align: center; animation: mpl-in .25s ease both; }
.mpl--inline { position: static; min-height: 60vh; background: transparent; }
.mpl__ring { width: 56px; height: 56px; border-radius: 50%; background: conic-gradient(from 0deg, rgba(86,109,255,0) 0deg, #566dff 200deg, #a026ff 360deg); -webkit-mask: radial-gradient(farthest-side, transparent calc(100% - 6px), #000 calc(100% - 5px)); mask: radial-gradient(farthest-side, transparent calc(100% - 6px), #000 calc(100% - 5px)); animation: mpl-spin .9s linear infinite; }
.mpl__bar { position: fixed; top: 0; left: 0; right: 0; height: 3px; overflow: hidden; background: rgba(86,109,255,.12); }
.mpl__bar::after { content: ""; position: absolute; inset: 0; width: 40%; background: linear-gradient(90deg, #566dff, #a026ff); animation: mpl-slide 1.2s ease-in-out infinite; }
.mpl__label { margin: 0; font-weight: 600; color: #0d1130; }
.mpl__hint { margin: 0; max-width: 300px; font-size: 13.5px; color: #7a819b; }
@keyframes mpl-spin { to { transform: rotate(360deg); } }
@keyframes mpl-slide { from { transform: translateX(-100%); } to { transform: translateX(250%); } }
@keyframes mpl-in { from { opacity: 0; } }
@media (prefers-reduced-motion: reduce) { .mpl__ring { animation-duration: 2.4s; } .mpl__bar::after { animation-duration: 2.4s; } }
`;

export default function PageLoader({ label = "Loading", inline = false }) {
  const [visible, setVisible] = useState(false);
  const [slow, setSlow] = useState(false);

  useEffect(() => {
    const show = setTimeout(() => setVisible(true), DELAY);
    const late = setTimeout(() => setSlow(true), SLOW);
    return () => {
      clearTimeout(show);
      clearTimeout(late);
    };
  }, []);

  if (!visible) return null;

  return (
    <div className={`mpl ${inline ? "mpl--inline" : ""}`} role="status" aria-live="polite">
      <style>{CSS}</style>
      <div className="mpl__bar" aria-hidden="true" />
      <div className="mpl__ring" aria-hidden="true" />
      <p className="mpl__label">{label}…</p>
      {slow && (
        <p className="mpl__hint">
          Still loading. Your connection seems slow, so this can take a few more seconds.
        </p>
      )}
    </div>
  );
}
