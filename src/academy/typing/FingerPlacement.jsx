import { useCallback, useRef, useState } from "react";
import { FINGERS } from "./keyboard.js";
import useKeyCapture from "./useKeyCapture";
import VirtualKeyboard, { FingerLegend } from "./VirtualKeyboard";
import TypingDrill from "./TypingDrill";
import { sound } from "./music.js";

/**
 * FINGER PLACEMENT — the very first lesson, before any drill.
 *
 * Every later lesson assumes the hands start on the home row. If that is
 * never shown, learners invent their own placement (two index fingers,
 * hovering hands) and every drill after it trains the wrong habit. So this
 * lesson shows the position, makes the learner FEEL it (the F and J bumps),
 * has them press each home key with the correct finger, explains the finger
 * zones, and ends with a short eyes-up check.
 */

/* ── The hands-on-keyboard diagram ─────────────────────────────────────── */

const U = 50; // key size
const G = 6; // gap
const STEP = U + G;
const ROWS = [
  { y: 0, x0: 20, keys: [..."QWERTYUIOP["] },
  { y: STEP, x0: 20 + U * 0.3, keys: [..."ASDFGHJKL;'"] },
  { y: STEP * 2, x0: 20 + U * 0.8, keys: [..."ZXCVBNM,./"] },
];
const keyX = (row, i) => ROWS[row].x0 + i * STEP + U / 2;
const HOME_Y = ROWS[1].y + U / 2;
const SPACE = { x: keyX(2, 2), y: STEP * 3, w: keyX(2, 7) - keyX(2, 2) + U };

// Each home finger: the home-row key index it rests on.
const LEFT = [
  { id: "lp", key: 0, label: "A" },
  { id: "lr", key: 1, label: "S" },
  { id: "lm", key: 2, label: "D" },
  { id: "li", key: 3, label: "F" },
];
const RIGHT = [
  { id: "ri", key: 6, label: "J" },
  { id: "rm", key: 7, label: "K" },
  { id: "rr", key: 8, label: "L" },
  { id: "rp", key: 9, label: ";" },
];

function Hand({ fingers, side, active, pulse }) {
  const tips = fingers.map((f) => ({ ...f, x: keyX(1, f.key), y: HOME_Y }));
  const xs = tips.map((t) => t.x);
  const palmX = (Math.min(...xs) + Math.max(...xs)) / 2;
  const palmTop = ROWS[2].y + U + 70;
  // Knuckles sit a little closer together than the fingertips, and the
  // middle finger reaches furthest, as on a real hand.
  const bases = tips.map((t, i) => ({
    x: palmX + (t.x - palmX) * 0.82,
    y: palmTop + [14, 4, 0, 6][side === "left" ? i : 3 - i],
  }));
  const spaceLeft = SPACE.x - U / 2;
  const thumbBase = { x: palmX + (side === "left" ? 78 : -78), y: palmTop + 34 };
  const thumbTip = { x: spaceLeft + SPACE.w * (side === "left" ? 0.3 : 0.7), y: SPACE.y + U / 2 };
  const thumbActive = active === "th";

  return (
    <g className={`ty-hand ty-hand--${side}`}>
      <rect x={palmX - 100} y={palmTop - 6} width={200} height={110} rx={46} className="ty-hand__palm" />
      <line x1={thumbBase.x} y1={thumbBase.y} x2={thumbTip.x} y2={thumbTip.y} className="ty-hand__finger" />
      <circle cx={thumbTip.x} cy={thumbTip.y} r={thumbActive ? 15 : 12} fill={FINGERS.th.color} className={`ty-hand__tip ${thumbActive ? "is-active" : ""}`} />
      {tips.map((t, i) => {
        const isActive = active === t.id;
        const isPulse = pulse?.includes(t.label);
        return (
          <g key={t.id}>
            <line x1={bases[i].x} y1={bases[i].y} x2={t.x} y2={t.y} className="ty-hand__finger" />
            <circle
              cx={t.x}
              cy={t.y}
              r={isActive ? 19 : 16}
              fill={FINGERS[t.id].color}
              className={`ty-hand__tip ${isActive ? "is-active" : ""} ${isPulse ? "is-pulse" : ""}`}
            />
            <text x={t.x} y={t.y + 5} textAnchor="middle" className="ty-hand__label">
              {t.label}
            </text>
          </g>
        );
      })}
    </g>
  );
}

export function HandsDiagram({ active, pulse, showNames = true }) {
  const width = ROWS[1].x0 + 11 * STEP + 20;
  const height = ROWS[2].y + U + 70 + 140;
  const all = [...LEFT, ...RIGHT];
  return (
    <svg className="ty-hands" viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Both hands resting on the home row: left fingers on A S D F, right fingers on J K L semicolon, thumbs on the space bar.">
      {ROWS.map((row, r) =>
        row.keys.map((k, i) => {
          const home = r === 1 && all.some((f) => f.key === i);
          const bump = r === 1 && (k === "F" || k === "J");
          return (
            <g key={`${r}${k}`}>
              <rect x={keyX(r, i) - U / 2} y={row.y} width={U} height={U} rx="8" className={`ty-hands__key ${home ? "is-home" : ""}`} />
              {/* Home keys are labelled by the fingertip resting on them. */}
              {!home && (
                <text x={keyX(r, i)} y={row.y + 18} textAnchor="middle" className="ty-hands__cap">
                  {k}
                </text>
              )}
              {bump && <rect x={keyX(r, i) - 8} y={row.y + U - 6} width="16" height="3" rx="1.5" className={`ty-hands__bump ${pulse?.includes(k) ? "is-pulse" : ""}`} />}
            </g>
          );
        })
      )}
      <rect x={SPACE.x - U / 2} y={SPACE.y} width={SPACE.w} height={U} rx="8" className={`ty-hands__key ${active === "th" ? "is-home" : ""}`} />
      <text x={SPACE.x - U / 2 + SPACE.w / 2} y={SPACE.y + U / 2 + 4} textAnchor="middle" className="ty-hands__cap">
        SPACE
      </text>
      <Hand fingers={LEFT} side="left" active={active} pulse={pulse} />
      <Hand fingers={RIGHT} side="right" active={active} pulse={pulse} />
      {showNames && (
        <>
          <text x={keyX(1, 1.5)} y={height - 12} textAnchor="middle" className="ty-hands__side">Left hand</text>
          <text x={keyX(1, 7.5)} y={height - 12} textAnchor="middle" className="ty-hands__side">Right hand</text>
        </>
      )}
    </svg>
  );
}

/* ── The lesson ────────────────────────────────────────────────────────── */

const SEQUENCE = [
  { key: "a", finger: "lp" },
  { key: "s", finger: "lr" },
  { key: "d", finger: "lm" },
  { key: "f", finger: "li" },
  { key: "j", finger: "ri" },
  { key: "k", finger: "rm" },
  { key: "l", finger: "rr" },
  { key: ";", finger: "rp" },
  { key: " ", finger: "th" },
];

const POSTURE = [
  { icon: "fas fa-chair", text: "Sit up straight with your feet flat on the floor and your back against the chair." },
  { icon: "fas fa-up-down", text: "Keep the keyboard at elbow height; your elbows bent at about a right angle, close to your body." },
  { icon: "fas fa-hand", text: "Float your wrists just above the desk. Do not rest your palms while typing." },
  { icon: "fas fa-hand-point-down", text: "Curve your fingers gently, like holding a small ball. Strike with the fingertips." },
  { icon: "fas fa-display", text: "Place the screen about an arm's length away, the top at eye level — and keep your eyes on it." },
];

const STEPS = ["Sit ready", "Home row", "Feel the bumps", "Each finger", "Finger zones", "Eyes-up check"];

export default function FingerPlacement({ checkText, onComplete }) {
  const [step, setStep] = useState(0);
  const [bumps, setBumps] = useState([]); // keys found in the bumps step
  const [seqIndex, setSeqIndex] = useState(0);
  const [miss, setMiss] = useState(null);
  const [checkKey, setCheckKey] = useState(0);
  const missTimer = useRef(null);

  const bumpsDone = bumps.includes("f") && bumps.includes("j");
  const seqDone = seqIndex >= SEQUENCE.length;
  const canNext = (step !== 2 || bumpsDone) && (step !== 3 || seqDone);

  const flashMiss = (text) => {
    setMiss(text);
    clearTimeout(missTimer.current);
    missTimer.current = setTimeout(() => setMiss(null), 1600);
  };

  const onKey = useCallback(
    (key) => {
      const k = key.toLowerCase();
      if (step === 2) {
        if (k === "f" || k === "j") {
          sound().key(bumps.length * 4);
          setBumps((b) => (b.includes(k) ? b : [...b, k]));
        } else {
          sound().error();
          flashMiss("Only F and J have bumps — find them by touch, then press F and J.");
        }
      }
      if (step === 3 && !seqDone) {
        const want = SEQUENCE[seqIndex];
        if (k === want.key) {
          sound().key(seqIndex * 3);
          setSeqIndex((i) => i + 1);
          if (seqIndex + 1 === SEQUENCE.length) sound().combo(2);
        } else {
          sound().error();
          flashMiss(`That was ${key === " " ? "Space" : `"${key}"`}. Use your ${FINGERS[want.finger].name.toLowerCase()} on ${want.key === " " ? "Space" : want.key.toUpperCase()}.`);
        }
      }
    },
    [step, bumps.length, seqIndex, seqDone]
  );

  const { focus, inputProps } = useKeyCapture(onKey, { active: step === 2 || step === 3 });

  const current = step === 3 && !seqDone ? SEQUENCE[seqIndex] : null;
  const go = (n) => {
    setStep(n);
    setMiss(null);
    // The key steps each mount a fresh input; give it focus so the learner
    // can press keys straight away.
    setTimeout(focus, 0);
  };

  return (
    <div className="ty-place">
      <ol className="ty-place__steps" aria-label="Lesson steps">
        {STEPS.map((s, i) => (
          <li key={s} className={i === step ? "is-current" : i < step ? "is-done" : ""}>
            <span>{i < step ? <i className="fas fa-check" aria-hidden="true" /> : i + 1}</span>
            {s}
          </li>
        ))}
      </ol>

      {step === 0 && (
        <section className="ty-place__card">
          <h2>Before you type: sit ready</h2>
          <p>Speed comes from a relaxed, repeatable position. Set this up once and your fingers will always know where they are.</p>
          <ul className="ty-posture">
            {POSTURE.map((p) => (
              <li key={p.text}>
                <i className={p.icon} aria-hidden="true" />
                {p.text}
              </li>
            ))}
          </ul>
        </section>
      )}

      {step === 1 && (
        <section className="ty-place__card">
          <h2>The home row: A S D F — J K L ;</h2>
          <p>
            This is where your fingers live. Every other key is a short reach from here, and after every reach the finger comes
            straight back.
          </p>
          <HandsDiagram />
          <ul className="ty-place__facts">
            <li><strong>Left hand:</strong> pinky on <kbd>A</kbd>, ring on <kbd>S</kbd>, middle on <kbd>D</kbd>, index on <kbd>F</kbd>.</li>
            <li><strong>Right hand:</strong> index on <kbd>J</kbd>, middle on <kbd>K</kbd>, ring on <kbd>L</kbd>, pinky on <kbd>;</kbd>.</li>
            <li><strong>Thumbs</strong> rest lightly on the <kbd>Space</kbd> bar. Use whichever thumb is comfortable.</li>
            <li><kbd>G</kbd> and <kbd>H</kbd> are left empty — your index fingers stretch sideways to reach them.</li>
          </ul>
        </section>
      )}

      {step === 2 && (
        <section className="ty-place__card" onClick={focus}>
          <input {...inputProps} />
          <h2>Feel the bumps on F and J</h2>
          <p>
            Look at the screen, not your keyboard. Run your index fingers over the keys until you feel the small raised lines on{" "}
            <kbd>F</kbd> and <kbd>J</kbd>. That is how you find home without looking — in the dark, or mid-sentence.
          </p>
          <HandsDiagram pulse={["F", "J"]} showNames={false} />
          <p className="ty-place__task">
            <i className="fas fa-hand-point-right" aria-hidden="true" /> Without looking down, press <kbd>F</kbd> with your left index finger and{" "}
            <kbd>J</kbd> with your right index finger.
            <span className="ty-place__ticks">
              <span className={bumps.includes("f") ? "is-on" : ""}>F {bumps.includes("f") && <i className="fas fa-check" aria-hidden="true" />}</span>
              <span className={bumps.includes("j") ? "is-on" : ""}>J {bumps.includes("j") && <i className="fas fa-check" aria-hidden="true" />}</span>
            </span>
          </p>
        </section>
      )}

      {step === 3 && (
        <section className="ty-place__card" onClick={focus}>
          <input {...inputProps} />
          <h2>One finger, one key</h2>
          <p>Rest all eight fingers on the home row. Press each key the diagram shows, using only the highlighted finger.</p>
          <HandsDiagram active={current?.finger} showNames={false} />
          <p className="ty-place__task" aria-live="polite">
            {current ? (
              <>
                Press <kbd>{current.key === " " ? "Space" : current.key.toUpperCase()}</kbd> with your{" "}
                <strong style={{ color: FINGERS[current.finger].color }}>{FINGERS[current.finger].name.toLowerCase()}</strong>
                {current.finger === "th" ? "." : ", then let it rest back on its key."}
              </>
            ) : (
              <>
                <i className="fas fa-circle-check" aria-hidden="true" /> Every finger knows its home. Next: where each finger reaches.
              </>
            )}
          </p>
          <div className="ty-place__progress" aria-hidden="true">
            {SEQUENCE.map((s, i) => (
              <span key={s.key} className={i < seqIndex ? "is-on" : i === seqIndex ? "is-current" : ""} style={{ "--finger": FINGERS[s.finger].color }}>
                {s.key === " " ? "␣" : s.key.toUpperCase()}
              </span>
            ))}
          </div>
        </section>
      )}

      {step === 4 && (
        <section className="ty-place__card">
          <h2>Finger zones</h2>
          <p>
            Each finger owns a slanted column of keys, shown by colour. Reach from home with that finger only, press, and come straight
            back to the home row.
          </p>
          <VirtualKeyboard highlight={false} />
          <FingerLegend />
          <ul className="ty-place__facts">
            <li>Index fingers do the most work: two columns each — <kbd>R T F G V B</kbd> on the left, <kbd>Y U H J N M</kbd> on the right.</li>
            <li>Capitals: hold <kbd>Shift</kbd> with the pinky of the <strong>opposite</strong> hand to the letter.</li>
            <li><kbd>Enter</kbd>, <kbd>Backspace</kbd> and most punctuation belong to the right pinky.</li>
            <li>Lost your place? Feel for the bumps on <kbd>F</kbd> and <kbd>J</kbd> and everything else follows.</li>
          </ul>
        </section>
      )}

      {step === 5 && (
        <section className="ty-place__card ty-place__card--check">
          <h2>Eyes-up check</h2>
          <p>Hands on the home row, eyes on this screen. Type the line below — the keyboard will only light up if you hesitate.</p>
          <TypingDrill
            key={checkKey}
            text={checkText}
            mode="strict"
            guide="hint"
            theme="focus"
            onFinish={onComplete}
            onRestart={() => setCheckKey((k) => k + 1)}
          />
        </section>
      )}

      {miss && (
        <p className="ty-place__miss" role="alert">
          <i className="fas fa-circle-exclamation" aria-hidden="true" /> {miss}
        </p>
      )}

      {step < 5 && (
        <div className="ty-place__nav">
          {step > 0 ? (
            <button type="button" className="ac-btn ac-btn--ghost" onClick={() => go(step - 1)}>
              <i className="fas fa-arrow-left" aria-hidden="true" /> Back
            </button>
          ) : (
            <span />
          )}
          <button type="button" className="ac-btn ac-btn--primary ac-btn--lg" disabled={!canNext} onClick={() => go(step + 1)}>
            {canNext ? (step === 4 ? "Start the check" : "Next") : step === 2 ? "Press F and J" : "Press each key"}
            <i className="fas fa-arrow-right" aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  );
}
