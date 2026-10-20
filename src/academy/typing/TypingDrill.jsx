import { memo, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { applyKey, createRun, finishRun, runStats } from "./engine.js";
import { FINGERS, charLabel, describeStroke, strokeFor } from "./keyboard.js";
import useKeyCapture from "./useKeyCapture";
import VirtualKeyboard, { FingerLegend } from "./VirtualKeyboard";
import { sound } from "./music.js";

/**
 * THE DRILL — one run of typing against a text.
 *
 * Used by lessons (strict mode, guided), speed tests (free mode, timed) and
 * practice. It owns the run, the sounds and the guidance; the parent only
 * hears about the finished result through onFinish.
 *
 * GUIDANCE (see curriculum.js for why it fades):
 *   full   next key + finger always shown
 *   hint   keyboard lights up only after HESITATION_MS without a key, or
 *          after a mistake — help arrives exactly when the learner is stuck
 *   blind  no keyboard; the finger name appears after a hesitation instead
 */

const HESITATION_MS = 1300;
const COMBO_STEP = 25;

/* Text is split into words so that each can be memoised: at speed a
   keystroke changes one word, and re-rendering 2,000 characters for it
   would be the slowest thing on the page. */
function splitWords(text) {
  const words = [];
  let start = 0;
  for (let i = 0; i < text.length; i++) {
    if (text[i] === " " || text[i] === "\n") {
      if (i > start) words.push([start, i]);
      words.push([i, i + 1]);
      start = i + 1;
    }
  }
  if (start < text.length) words.push([start, text.length]);
  return words;
}

const MARK_CODE = { "": ".", ok: "o", fixed: "f", bad: "b", auto: "a" };
const MARK_NAME = { o: "ok", f: "fixed", b: "bad", a: "auto" };

/* Props are strings so React.memo's shallow compare actually skips words
   whose state did not change. */
/** What render needs from a run, copied so it can never change underneath. */
function snapshot(run) {
  return {
    pos: run.pos,
    marks: run.marks.slice(),
    typed: run.typed.slice(),
    done: run.done,
    started: run.startedAt !== null,
    combo: run.combo,
    stats: runStats(run),
  };
}

const Word = memo(function Word({ text, start, marks, typed, caret, mode }) {
  const chars = [];
  const typedChars = typed ? typed.split("\u0001") : [];
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    const m = MARK_NAME[marks[i]];
    const cls = ["ty-ch"];
    if (m) cls.push(`is-${m}`);
    if (caret === i) cls.push("is-caret");
    if (ch === " ") cls.push("is-space");
    // In free mode a wrong key shows what was typed over the expected letter.
    const shown = ch === "\n" ? "↵" : ch === " " ? " " : ch;
    chars.push(
      <span key={i} className={cls.join(" ")} data-i={start + i}>
        {shown}
        {mode === "free" && m === "bad" && typedChars[i] && typedChars[i] !== ch && ch !== " " && (
          <span className="ty-ch__typed">{typedChars[i] === " " ? "·" : typedChars[i]}</span>
        )}
      </span>
    );
    if (ch === "\n") chars.push(<br key={`br${i}`} />);
  }
  const isSpace = text === " " || text === "\n";
  return <span className={isSpace ? "ty-gap" : "ty-word"}>{chars}</span>;
});

export default function TypingDrill({
  text,
  mode = "strict",
  autoIndent = false,
  guide = "full",
  timeLimit = 0,
  theme = "focus",
  title,
  subtitle,
  onFinish,
  onRestart,
  showLegend = false,
  extraHud,
  onProgress,
  autoStartMusic = true,
}) {
  // The run is mutable and lives in a ref, touched only by handlers and
  // effects. Render reads `view`, an immutable snapshot taken after each key
  // and on each clock tick, so React always sees a new value when it changes.
  const runRef = useRef(null);
  const getRun = useCallback(() => {
    if (!runRef.current) runRef.current = createRun(text, { mode, autoIndent });
    return runRef.current;
  }, [text, mode, autoIndent]);
  const [view, setView] = useState(() => snapshot(createRun(text, { mode, autoIndent })));
  const [hesitating, setHesitating] = useState(false);
  const [pressed, setPressed] = useState(null);
  const [toast, setToast] = useState(null);
  const [shake, setShake] = useState(false);
  const hesitateTimer = useRef(null);
  const pressTimer = useRef(null);
  const shakeTimer = useRef(null);
  const finishedRef = useRef(false);
  const innerRef = useRef(null);

  const words = useMemo(() => splitWords(text), [text]);
  const refresh = useCallback(() => setView(snapshot(getRun())), [getRun]);

  const armHesitation = useCallback(() => {
    clearTimeout(hesitateTimer.current);
    setHesitating(false);
    hesitateTimer.current = setTimeout(() => setHesitating(true), HESITATION_MS);
  }, []);

  useEffect(() => {
    // Help arrives if the learner sits on the first key, too.
    hesitateTimer.current = setTimeout(() => setHesitating(true), HESITATION_MS);
    return () => {
      clearTimeout(hesitateTimer.current);
      clearTimeout(pressTimer.current);
      clearTimeout(shakeTimer.current);
    };
  }, []);

  // Music only while a run is live, and never before the first key: that is
  // the user gesture browsers require, and silence before it is polite.
  useEffect(
    () => () => {
      if (autoStartMusic) sound().stopMusic();
    },
    [autoStartMusic]
  );

  const finish = useCallback(() => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    clearTimeout(hesitateTimer.current);
    if (autoStartMusic) sound().stopMusic();
    const run = getRun();
    onFinish?.(runStats(run), run);
  }, [getRun, onFinish, autoStartMusic]);

  // Live clock for the timer and the WPM readout.
  useEffect(() => {
    if (!view.started || view.done) return;
    const id = setInterval(() => {
      const run = getRun();
      if (timeLimit && performance.now() - run.startedAt >= timeLimit * 1000) {
        finishRun(run, run.startedAt + timeLimit * 1000);
        refresh();
        finish();
        return;
      }
      refresh();
    }, 200);
    return () => clearInterval(id);
  }, [view.started, view.done, timeLimit, getRun, refresh, finish]);

  const onKey = useCallback(
    (key, code) => {
      if (key === "Escape") {
        onRestart?.();
        return;
      }
      const run = getRun();
      if (run.done) return;
      const first = run.startedAt === null;
      const { result, done } = applyKey(run, key);
      if (result === "ignored") return;

      if (first && result !== "back" && autoStartMusic) {
        sound().playTheme(theme, { intensity: 1 });
      }

      if (code) {
        setPressed({ id: code, wrong: result === "error" });
        clearTimeout(pressTimer.current);
        pressTimer.current = setTimeout(() => setPressed(null), 140);
      }

      if (result === "ok") {
        sound().key(run.combo);
        if (run.combo > 0 && run.combo % COMBO_STEP === 0) {
          sound().combo(run.combo / COMBO_STEP);
          setToast({ id: run.combo, text: `${run.combo} combo!` });
        }
        sound().setIntensity(run.combo >= 60 ? 3 : run.combo >= 20 ? 2 : 1);
      } else if (result === "error") {
        sound().error();
        sound().setIntensity(1);
        setShake(true);
        clearTimeout(shakeTimer.current);
        shakeTimer.current = setTimeout(() => setShake(false), 160);
      }

      armHesitation();
      refresh();
      onProgress?.(run);
      if (done) finish();
    },
    [getRun, theme, armHesitation, refresh, finish, onRestart, onProgress, autoStartMusic]
  );

  const { focused, focus, inputProps } = useKeyCapture(onKey, { active: !view.done });

  // Keep the caret on the second visible line by sliding the text up. Written
  // straight to the node: it is a measurement of layout, and routing it
  // through state would cost a second render on every keystroke.
  useLayoutEffect(() => {
    const inner = innerRef.current;
    if (!inner) return;
    const caret = inner.querySelector(".is-caret") || inner.querySelector(`[data-i="${Math.max(0, view.pos - 1)}"]`);
    if (!caret) return;
    const lineH = caret.offsetHeight || 40;
    inner.style.transform = `translateY(${-Math.max(0, caret.offsetTop - lineH * 1.1)}px)`;
  }, [view.pos]);

  const stats = view.stats;
  const nextChar = view.pos < text.length ? text[view.pos] : null;
  const stroke = nextChar != null ? strokeFor(nextChar) : null;
  const lastWrong = view.marks[view.pos] === "bad";

  const showKeyboard = guide !== "blind";
  const highlight = guide === "full" || hesitating || lastWrong;
  const showFinger = (guide === "full" || hesitating || lastWrong) && stroke;

  const remaining = timeLimit ? Math.max(0, timeLimit - stats.ms / 1000) : null;
  const clock = remaining !== null ? remaining : stats.ms / 1000;
  const clockText = `${Math.floor(clock / 60)}:${String(Math.floor(clock % 60)).padStart(2, "0")}`;

  return (
    <div className="ty-drill">
      {(title || subtitle) && (
        <header className="ty-drill__head">
          {title && <h2>{title}</h2>}
          {subtitle && <p>{subtitle}</p>}
        </header>
      )}

      <div className="ty-hud" role="status" aria-live="off">
        <div className="ty-hud__item">
          <span>WPM</span>
          <strong>{Math.round(stats.wpm)}</strong>
        </div>
        <div className="ty-hud__item">
          <span>Accuracy</span>
          <strong className={stats.accuracy < 90 ? "is-low" : ""}>{Math.round(stats.accuracy)}%</strong>
        </div>
        <div className="ty-hud__item">
          <span>{timeLimit ? "Time left" : "Time"}</span>
          <strong>{clockText}</strong>
        </div>
        <div className="ty-hud__item">
          <span>Combo</span>
          <strong className={view.combo >= COMBO_STEP ? "is-hot" : ""}>
            {view.combo}
            {view.combo >= COMBO_STEP && <i className="fas fa-fire" aria-hidden="true" />}
          </strong>
        </div>
        {extraHud}
        <div className="ty-hud__progress" aria-hidden="true">
          <div style={{ width: `${timeLimit ? (1 - remaining / timeLimit) * 100 : stats.progress * 100}%` }} />
        </div>
      </div>

      <div
        className={`ty-stage ${shake ? "is-shake" : ""} ${focused || view.done ? "" : "is-blurred"} ${autoIndent ? "is-code" : ""}`}
        onClick={focus}
      >
        <input {...inputProps} />
        <div className="ty-text">
          <div className="ty-text__inner" ref={innerRef}>
            {words.map(([a, b]) => {
              const caret = view.pos >= a && view.pos < b && !view.done ? view.pos - a : -1;
              return (
                <Word
                  key={a}
                  text={text.slice(a, b)}
                  start={a}
                  marks={view.marks.slice(a, b).map((m) => MARK_CODE[m]).join("")}
                  typed={mode === "free" ? view.typed.slice(a, b).join("\u0001") : ""}
                  caret={caret}
                  mode={mode}
                />
              );
            })}
          </div>
        </div>
        {!focused && !view.done && (
          <button type="button" className="ty-stage__focus" onClick={focus}>
            <i className="fas fa-keyboard" aria-hidden="true" />
            {!view.started ? "Click here, then start typing" : "Paused — click to continue"}
          </button>
        )}
        {toast && (
          <span className="ty-toast" key={toast.id} onAnimationEnd={() => setToast(null)}>
            {toast.text}
          </span>
        )}
      </div>

      <div className="ty-guide">
        <span className="ty-guide__next">
          {nextChar != null && (
            <>
              Next: <kbd>{charLabel(nextChar)}</kbd>
            </>
          )}
        </span>
        {showFinger ? (
          <span className="ty-guide__finger" style={{ "--finger": FINGERS[stroke.finger].color }}>
            <span className="ty-fingers__dot" />
            {describeStroke(nextChar)}
          </span>
        ) : (
          <span className="ty-guide__eyes">
            <i className="fas fa-eye" aria-hidden="true" /> Eyes on the screen — not the keys
          </span>
        )}
        <span className="ty-guide__esc">
          <kbd>Esc</kbd> restart
        </span>
      </div>

      {showKeyboard && (
        <VirtualKeyboard
          nextChar={nextChar}
          highlight={highlight}
          pressed={pressed?.id}
          wrong={pressed?.wrong}
        />
      )}
      {showKeyboard && showLegend && <FingerLegend active={stroke?.finger} />}
    </div>
  );
}
