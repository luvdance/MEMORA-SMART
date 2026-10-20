/**
 * TYPING ENGINE — the scoring core.
 *
 * Pure functions over a plain `run` object, so the same maths drives lessons,
 * speed tests, the race and the self-test. A run is mutated in place by
 * applyKey() (a keystroke arrives every ~100ms at speed, and copying a few
 * hundred marks each time buys nothing) and the component re-renders on a
 * counter.
 *
 * DEFINITIONS — the industry-standard ones, so a score here means what the
 * same number means on an employer's typing test:
 *   word        5 characters, spaces and punctuation included
 *   WPM (net)   correctly typed characters / 5 / minutes
 *   raw WPM     every character typed / 5 / minutes
 *   accuracy    correct keystrokes / all keystrokes. Fixing a mistake does
 *               NOT give the keystroke back — the error still happened.
 *
 * MODES
 *   strict  the cursor waits on the correct key (the learning mode: you
 *           cannot skip past an error, so every mistake is noticed)
 *   free    every key is entered and Backspace corrects (the test mode)
 */

export function createRun(text, { mode = "strict", autoIndent = false } = {}) {
  const run = {
    text,
    mode,
    autoIndent,
    pos: 0,
    marks: new Array(text.length).fill(""), // "" | ok | fixed | bad | auto
    typed: new Array(text.length).fill(""),
    erred: new Uint8Array(text.length),
    keystrokes: 0,
    correctStrokes: 0,
    errors: 0,
    combo: 0,
    bestCombo: 0,
    startedAt: null,
    endedAt: null,
    lastAt: null,
    log: [], // { t, exp, got, ok, dt }
    done: false,
  };
  skipAuto(run);
  return run;
}

/** In code drills, indentation after a newline is filled in automatically. */
function skipAuto(run) {
  if (!run.autoIndent) return;
  while (run.pos < run.text.length && run.pos > 0 && run.text[run.pos - 1] === "\n") {
    let p = run.pos;
    while (p < run.text.length && run.text[p] === " ") {
      run.marks[p] = "auto";
      p++;
    }
    if (p === run.pos) break;
    run.pos = p;
  }
}

/**
 * Feed one key. `key` is a single character, "\n" for Enter, or "Backspace".
 * Returns what happened, so the caller can play the right sound:
 *   { result: "ok" | "error" | "back" | "ignored", done }
 */
export function applyKey(run, key, now = performance.now()) {
  if (run.done) return { result: "ignored", done: true };

  if (key === "Backspace") {
    if (run.mode !== "free" || run.pos === 0) return { result: "ignored", done: false };
    let p = run.pos - 1;
    while (p > 0 && run.marks[p] === "auto") p--;
    run.marks[p] = "";
    run.typed[p] = "";
    run.pos = p;
    return { result: "back", done: false };
  }

  if (key.length !== 1) return { result: "ignored", done: false };

  if (run.startedAt === null) {
    run.startedAt = now;
    run.lastAt = now;
  }
  const dt = now - run.lastAt;
  run.lastAt = now;

  const exp = run.text[run.pos];
  const ok = key === exp;
  run.keystrokes++;
  run.log.push({ t: now - run.startedAt, exp, got: key, ok, dt });

  if (ok) {
    run.correctStrokes++;
    run.combo++;
    run.bestCombo = Math.max(run.bestCombo, run.combo);
  } else {
    run.errors++;
    run.combo = 0;
    run.erred[run.pos] = 1;
  }

  if (run.mode === "strict") {
    if (ok) {
      run.marks[run.pos] = run.erred[run.pos] ? "fixed" : "ok";
      run.pos++;
      skipAuto(run);
    } else {
      run.marks[run.pos] = "bad";
    }
  } else {
    run.typed[run.pos] = key;
    run.marks[run.pos] = ok ? (run.erred[run.pos] ? "fixed" : "ok") : "bad";
    run.pos++;
    skipAuto(run);
  }

  if (run.pos >= run.text.length) {
    run.done = true;
    run.endedAt = now;
  }
  return { result: ok ? "ok" : "error", done: run.done };
}

/** End a timed run early (the clock ran out). */
export function finishRun(run, now = performance.now()) {
  if (run.done) return;
  run.done = true;
  run.endedAt = run.startedAt === null ? now : now;
}

export function elapsedMs(run, now = performance.now()) {
  if (run.startedAt === null) return 0;
  return (run.endedAt ?? now) - run.startedAt;
}

const round1 = (n) => Math.round(n * 10) / 10;

/**
 * The scorecard. Safe to call mid-run for live numbers.
 */
export function runStats(run, now = performance.now()) {
  const ms = elapsedMs(run, now);
  const minutes = ms / 60000;
  let correctChars = 0;
  let typedChars = 0;
  for (let i = 0; i < run.pos; i++) {
    const m = run.marks[i];
    if (m === "auto") continue;
    typedChars++;
    if (m === "ok" || m === "fixed") correctChars++;
  }
  // Strict mode counts every key pressed toward raw speed.
  if (run.mode === "strict") typedChars = run.keystrokes;

  const wpm = minutes > 0 ? correctChars / 5 / minutes : 0;
  const raw = minutes > 0 ? typedChars / 5 / minutes : 0;
  const accuracy = run.keystrokes ? (run.correctStrokes / run.keystrokes) * 100 : 100;

  return {
    wpm: round1(wpm),
    raw: round1(raw),
    accuracy: round1(accuracy),
    correctChars,
    keystrokes: run.keystrokes,
    errors: run.errors,
    ms,
    bestCombo: run.bestCombo,
    consistency: consistency(run),
    progress: run.text.length ? run.pos / run.text.length : 0,
  };
}

/**
 * WPM for each second of the run — the line on the results chart.
 */
export function wpmTimeline(run) {
  if (!run.log.length) return [];
  const seconds = Math.max(1, Math.ceil(run.log[run.log.length - 1].t / 1000));
  const buckets = new Array(seconds).fill(0);
  const errs = new Array(seconds).fill(0);
  for (const e of run.log) {
    const s = Math.min(seconds - 1, Math.floor(e.t / 1000));
    if (e.ok) buckets[s]++;
    else errs[s]++;
  }
  // Rolling cumulative WPM reads better than a jagged per-second burst.
  let cum = 0;
  return buckets.map((n, i) => {
    cum += n;
    return { second: i + 1, wpm: round1(cum / 5 / ((i + 1) / 60)), burst: round1(n * 12), errors: errs[i] };
  });
}

/**
 * Consistency: how even the rhythm is, from the coefficient of variation
 * (cv) of the gaps between keystrokes, mapped through 1 − tanh so it falls
 * smoothly instead of hitting zero as soon as cv passes 1. A metronome
 * scores 100; typical human typing lands around 50–75.
 */
function consistency(run) {
  const gaps = run.log.slice(1).map((e) => e.dt).filter((d) => d > 0 && d < 3000);
  if (gaps.length < 5) return 100;
  const mean = gaps.reduce((a, b) => a + b, 0) / gaps.length;
  const sd = Math.sqrt(gaps.reduce((a, b) => a + (b - mean) ** 2, 0) / gaps.length);
  const cv = sd / mean;
  return Math.round(100 * (1 - Math.tanh(cv + cv ** 3 / 3 + cv ** 5 / 5)));
}

/**
 * Per-character results from one run: { ch: { hits, misses, ms } }.
 * `ms` sums reaction time on correct strokes, for "slowest keys".
 */
export function keyResults(run) {
  const out = {};
  for (const e of run.log) {
    if (!e.exp) continue;
    const k = (out[e.exp] ||= { hits: 0, misses: 0, ms: 0 });
    if (e.ok) {
      k.hits++;
      if (e.dt > 0 && e.dt < 3000) k.ms += e.dt;
    } else k.misses++;
  }
  return out;
}

/** Merge a run's key results into lifetime totals. */
export function mergeKeyStats(total = {}, add = {}) {
  const out = { ...total };
  for (const [ch, v] of Object.entries(add)) {
    const t = out[ch] || { hits: 0, misses: 0, ms: 0 };
    out[ch] = { hits: t.hits + v.hits, misses: t.misses + v.misses, ms: t.ms + v.ms };
  }
  return out;
}

/** Keys missed most often, as a share of attempts. Ignores rarely tried keys. */
export function weakestKeys(keyStats = {}, count = 6, minAttempts = 8) {
  return Object.entries(keyStats)
    .filter(([ch, v]) => ch !== " " && v.hits + v.misses >= minAttempts)
    .map(([ch, v]) => ({
      ch,
      errorRate: v.misses / (v.hits + v.misses),
      avgMs: v.hits ? v.ms / v.hits : 0,
      attempts: v.hits + v.misses,
    }))
    .sort((a, b) => b.errorRate - a.errorRate || b.avgMs - a.avgMs)
    .slice(0, count);
}

/* ── XP, levels, speed tiers ─────────────────────────────────────────────── */

/**
 * XP for a finished run. Correct words, scaled hard by accuracy so that
 * mashing keys earns almost nothing: at 80% accuracy the multiplier is 0.
 */
export function xpForRun({ correctChars, accuracy }, bonus = 0) {
  const words = correctChars / 5;
  const accFactor = Math.max(0, (accuracy - 80) / 20); // 80% → 0, 100% → 1
  return Math.round(words * (0.4 + accFactor * 1.6)) + bonus;
}

/** Typing levels. XP needed for level n is 60·n^1.7, rounded. */
export function typingLevel(xp = 0) {
  const need = (n) => Math.round(60 * Math.pow(n, 1.7));
  let level = 1;
  while (xp >= need(level)) level++;
  const floor = level === 1 ? 0 : need(level - 1);
  const ceil = need(level);
  return {
    level,
    title: LEVEL_TITLES[Math.min(LEVEL_TITLES.length - 1, Math.floor((level - 1) / 3))],
    into: xp - floor,
    span: ceil - floor,
    toNext: ceil - xp,
    percent: Math.round(((xp - floor) / (ceil - floor)) * 100),
  };
}

const LEVEL_TITLES = [
  "Keyboard Cadet",
  "Home Row Hero",
  "Key Explorer",
  "Rhythm Keeper",
  "Swift Fingers",
  "Touch Typist",
  "Keystroke Ninja",
  "Speed Master",
  "Grandmaster",
];

/**
 * Speed tiers — the number an employer asks about. Only runs of 60 seconds or
 * more at 95%+ accuracy count, because that is how hiring tests measure it.
 */
export const SPEED_TIERS = [
  { min: 0, name: "Hunt & Peck", note: "Still looking at the keys. Start the path at lesson one." },
  { min: 20, name: "Learner", note: "Fingers know their keys. Keep the eyes up." },
  { min: 30, name: "Steady", note: "Comfortable for everyday email and chat." },
  { min: 40, name: "Touch Typist", note: "The average professional. Meets most admin and data-entry requirements." },
  { min: 55, name: "Professional", note: "Above most office roles' requirement of 45–50 WPM." },
  { min: 70, name: "Expert", note: "Fast enough for transcription and support roles." },
  { min: 90, name: "Elite", note: "Top few percent of typists." },
  { min: 110, name: "Legend", note: "Competition speed." },
];

export const VERIFIED_ACCURACY = 95;
export const VERIFIED_MIN_SECONDS = 60;

export function speedTier(wpm = 0) {
  let tier = SPEED_TIERS[0];
  for (const t of SPEED_TIERS) if (wpm >= t.min) tier = t;
  const next = SPEED_TIERS.find((t) => t.min > wpm) || null;
  return { ...tier, next };
}

export function isVerifiedRun(stats) {
  return stats.accuracy >= VERIFIED_ACCURACY && stats.ms >= VERIFIED_MIN_SECONDS * 1000 - 50;
}
