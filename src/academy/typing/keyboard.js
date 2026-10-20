/**
 * KEYBOARD MODEL — US ANSI layout with the standard touch-typing finger map.
 *
 * Touch typing is a fixed contract between a key and a finger. The tutor's
 * whole job is to make that contract automatic, so every key here knows which
 * finger owns it, and every shifted character knows which Shift to use: the
 * one on the OPPOSITE hand, so one hand never has to do both.
 *
 * Pure data and pure functions — no DOM — so the engine self-test can import it.
 */

export const FINGERS = {
  lp: { name: "Left pinky", hand: "left", color: "#e879a6" },
  lr: { name: "Left ring", hand: "left", color: "#f59e0b" },
  lm: { name: "Left middle", hand: "left", color: "#22c55e" },
  li: { name: "Left index", hand: "left", color: "#3b82f6" },
  ri: { name: "Right index", hand: "right", color: "#8b5cf6" },
  rm: { name: "Right middle", hand: "right", color: "#14b8a6" },
  rr: { name: "Right ring", hand: "right", color: "#f97316" },
  rp: { name: "Right pinky", hand: "right", color: "#ec4899" },
  th: { name: "Thumb", hand: "both", color: "#94a3b8" },
};

// [id, base, shifted, finger, width]
const ROWS = [
  [
    ["Backquote", "`", "~", "lp"], ["Digit1", "1", "!", "lp"], ["Digit2", "2", "@", "lr"],
    ["Digit3", "3", "#", "lm"], ["Digit4", "4", "$", "li"], ["Digit5", "5", "%", "li"],
    ["Digit6", "6", "^", "li"], ["Digit7", "7", "&", "ri"], ["Digit8", "8", "*", "rm"],
    ["Digit9", "9", "(", "rr"], ["Digit0", "0", ")", "rp"], ["Minus", "-", "_", "rp"],
    ["Equal", "=", "+", "rp"], ["Backspace", "⌫", null, "rp", 2],
  ],
  [
    ["Tab", "Tab", null, "lp", 1.5], ["KeyQ", "q", "Q", "lp"], ["KeyW", "w", "W", "lr"],
    ["KeyE", "e", "E", "lm"], ["KeyR", "r", "R", "li"], ["KeyT", "t", "T", "li"],
    ["KeyY", "y", "Y", "ri"], ["KeyU", "u", "U", "ri"], ["KeyI", "i", "I", "rm"],
    ["KeyO", "o", "O", "rr"], ["KeyP", "p", "P", "rp"], ["BracketLeft", "[", "{", "rp"],
    ["BracketRight", "]", "}", "rp"], ["Backslash", "\\", "|", "rp", 1.5],
  ],
  [
    ["CapsLock", "Caps", null, "lp", 1.8], ["KeyA", "a", "A", "lp"], ["KeyS", "s", "S", "lr"],
    ["KeyD", "d", "D", "lm"], ["KeyF", "f", "F", "li"], ["KeyG", "g", "G", "li"],
    ["KeyH", "h", "H", "ri"], ["KeyJ", "j", "J", "ri"], ["KeyK", "k", "K", "rm"],
    ["KeyL", "l", "L", "rr"], ["Semicolon", ";", ":", "rp"], ["Quote", "'", '"', "rp"],
    ["Enter", "Enter", null, "rp", 2.2],
  ],
  [
    ["ShiftLeft", "Shift", null, "lp", 2.35], ["KeyZ", "z", "Z", "lp"], ["KeyX", "x", "X", "lr"],
    ["KeyC", "c", "C", "lm"], ["KeyV", "v", "V", "li"], ["KeyB", "b", "B", "li"],
    ["KeyN", "n", "N", "ri"], ["KeyM", "m", "M", "ri"], ["Comma", ",", "<", "rm"],
    ["Period", ".", ">", "rr"], ["Slash", "/", "?", "rp"], ["ShiftRight", "Shift", null, "rp", 2.85],
  ],
  [["Space", "", null, "th", 6.5]],
];

export const LAYOUT = ROWS.map((row, r) =>
  row.map(([id, base, shift, finger, width = 1]) => ({ id, base, shift, finger, width, row: r }))
);

/** The home-row keys the fingers return to. F and J carry the tactile bumps. */
export const HOME_KEYS = new Set(["KeyA", "KeyS", "KeyD", "KeyF", "KeyJ", "KeyK", "KeyL", "Semicolon"]);
export const BUMP_KEYS = new Set(["KeyF", "KeyJ"]);

const CHAR_MAP = new Map();
for (const row of LAYOUT) {
  for (const key of row) {
    if (key.id === "Space") {
      CHAR_MAP.set(" ", { key, shift: false });
      continue;
    }
    if (key.id === "Enter") {
      CHAR_MAP.set("\n", { key, shift: false });
      continue;
    }
    if (key.base && key.base.length === 1) CHAR_MAP.set(key.base, { key, shift: false });
    if (key.shift) CHAR_MAP.set(key.shift, { key, shift: true });
  }
}

export const KEY_BY_ID = new Map(LAYOUT.flat().map((k) => [k.id, k]));

/**
 * How to type one character: which key, which finger, and which Shift.
 * Returns null for characters that are not on the keyboard (they are never
 * put in a drill, but custom text may contain them).
 */
export function strokeFor(ch) {
  const hit = CHAR_MAP.get(ch);
  if (!hit) return null;
  const { key, shift } = hit;
  const hand = FINGERS[key.finger].hand;
  // Opposite-hand Shift. Thumb keys never need one.
  const shiftKey = shift ? (hand === "left" ? "ShiftRight" : "ShiftLeft") : null;
  return { keyId: key.id, finger: key.finger, shift, shiftKey };
}

export function isTypable(ch) {
  return CHAR_MAP.has(ch);
}

/** Human description used in hints: "Right pinky + Left Shift". */
export function describeStroke(ch) {
  const s = strokeFor(ch);
  if (!s) return "";
  const finger = FINGERS[s.finger].name;
  if (!s.shift) return finger;
  return `${finger} + ${s.shiftKey === "ShiftLeft" ? "left" : "right"} Shift (${
    s.shiftKey === "ShiftLeft" ? "left" : "right"
  } pinky)`;
}

/** Display label for a character in hints and stats. */
export function charLabel(ch) {
  if (ch === " ") return "Space";
  if (ch === "\n") return "Enter";
  return ch;
}
