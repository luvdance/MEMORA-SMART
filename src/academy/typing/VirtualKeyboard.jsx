import { memo } from "react";
import { BUMP_KEYS, FINGERS, HOME_KEYS, LAYOUT, strokeFor } from "./keyboard.js";

/**
 * The on-screen keyboard.
 *
 * Every key wears its finger's colour, so the finger map is learned by
 * looking at the SCREEN — never at the real keyboard. The next key and the
 * Shift to pair with it light up when guidance is on.
 *
 * `heat` switches it into a heatmap of error rates for the stats view.
 */
function VirtualKeyboard({ nextChar, highlight = true, pressed, wrong, heat, compact = false }) {
  const stroke = nextChar != null ? strokeFor(nextChar) : null;
  const target = highlight && stroke ? stroke.keyId : null;
  const shiftTarget = highlight && stroke?.shift ? stroke.shiftKey : null;

  return (
    <div className={`ty-kb ${compact ? "ty-kb--compact" : ""} ${heat ? "ty-kb--heat" : ""}`} aria-hidden="true">
      {LAYOUT.map((row, r) => (
        <div className="ty-kb__row" key={r}>
          {row.map((key) => {
            const finger = FINGERS[key.finger];
            const classes = ["ty-key"];
            if (HOME_KEYS.has(key.id)) classes.push("is-home");
            if (BUMP_KEYS.has(key.id)) classes.push("has-bump");
            if (key.id === target || key.id === shiftTarget) classes.push("is-target");
            if (pressed === key.id) classes.push(wrong ? "is-wrong" : "is-pressed");
            if (key.base?.length > 1 || key.id === "Space") classes.push("is-mod");

            let style = { "--finger": finger.color, flexGrow: key.width };
            let title;
            if (heat) {
              const stats = [key.base, key.shift].map((c) => heat[c]).filter(Boolean);
              const hits = stats.reduce((n, s) => n + s.hits, 0);
              const misses = stats.reduce((n, s) => n + s.misses, 0);
              const rate = hits + misses ? misses / (hits + misses) : null;
              if (rate !== null) {
                // One hue, light → dark, capped at a 20% error rate.
                const t = Math.min(1, rate / 0.2);
                style = { ...style, "--heat": t.toFixed(2) };
                classes.push("has-heat");
                if (t > 0.55) classes.push("is-dark");
                title = `${key.base}: ${(rate * 100).toFixed(1)}% errors over ${hits + misses} presses`;
              }
            }

            return (
              <div className={classes.join(" ")} style={style} key={key.id} title={title}>
                {key.shift && !compact && <span className="ty-key__shift">{key.shift}</span>}
                <span className="ty-key__base">{key.id === "Space" ? "" : key.base.toUpperCase()}</span>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

export default memo(VirtualKeyboard);

/** The finger legend shown under the keyboard in early lessons. */
export function FingerLegend({ active }) {
  return (
    <ul className="ty-fingers" aria-label="Finger colours">
      {Object.entries(FINGERS)
        .filter(([id]) => id !== "th")
        .map(([id, f]) => (
          <li key={id} className={active === id ? "is-active" : ""} style={{ "--finger": f.color }}>
            <span className="ty-fingers__dot" />
            {f.name}
          </li>
        ))}
    </ul>
  );
}
