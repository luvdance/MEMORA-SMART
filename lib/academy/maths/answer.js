import { gcd, simplify, tidy } from "./rng.js";

/**
 * MARKING A TYPED MATHEMATICAL ANSWER
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY.
 * ═════════════════════════════════════════════════════════════════════════
 *
 * Multiple choice is the wrong instrument for most of this course. A student
 * who can pick 3/4 from four options has not shown they can produce 3/4, and
 * WAEC Paper 2 and every real use of mathematics ask them to produce it. So
 * almost every item here takes a typed answer, which means the platform has
 * to mark typed answers the way a human marker does.
 *
 * A human marker accepts 0.75, 3/4, 6/8 and "3 over 4" as the same number,
 * accepts 1,250 with or without the comma, accepts "12 cm" where "12" was
 * asked for, and does NOT accept 0.8 for 0.75 however close it looks. The
 * rules below are an attempt to be exactly that generous and no more.
 *
 * ── THE ONE DELIBERATE STRICTNESS ────────────────────────────────────────
 * When an atom is ABOUT a form — simplifying to lowest terms, rounding to two
 * decimal places, giving an answer in standard form — the form is the skill,
 * and accepting an equivalent value would mark the student correct for the
 * thing they failed to do. Those items set `exact`, and the checker then
 * requires the form as well as the value, with feedback that says which of the
 * two was missing.
 */

/* ── Reading what the student typed ──────────────────────────────────── */

const SUPERSCRIPTS = { "⁰": "0", "¹": "1", "²": "2", "³": "3", "⁴": "4", "⁵": "5", "⁶": "6", "⁷": "7", "⁸": "8", "⁹": "9" };

/**
 * Everything that is noise rather than mathematics: currency symbols, commas
 * used as thousand separators, the various dashes and slashes phones produce,
 * and the word "over" that students type when they cannot find the slash.
 */
export function clean(raw) {
  if (raw === null || raw === undefined) return "";
  let s = String(raw).trim().toLowerCase();

  s = s.replace(/[₦$£€]/g, "");
  s = s.replace(/[−–—]/g, "-"); // minus sign, en dash, em dash
  s = s.replace(/[×]/g, "*").replace(/[÷]/g, "/");
  s = s.replace(/[⁄∕]/g, "/"); // fraction slash, division slash
  s = s.replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹]/g, (c) => `^${SUPERSCRIPTS[c]}`);
  s = s.replace(/\bover\b/g, "/");
  s = s.replace(/\s*(:|\/|\^)\s*/g, "$1");
  // Thousand separators only: a comma between digits with three following.
  s = s.replace(/(\d),(?=\d{3}\b)/g, "$1");
  s = s.replace(/\s+/g, " ").trim();
  return s;
}

/** Strip a trailing unit so "12 cm" can be marked against 12. */
export function splitUnit(text) {
  const m = clean(text).match(/^(-?[\d.,/\s]+)\s*([a-z°%²³\s]*)$/);
  if (!m) return { value: clean(text), unit: "" };
  return { value: m[1].trim(), unit: m[2].replace(/\s+/g, "") };
}

/**
 * Parse a number in any of the forms a student legitimately writes it:
 * 3, -3, 0.75, 3/4, -3/4, 2 3/4 (a mixed number), 1/2+1/4 is NOT accepted —
 * an unevaluated expression is not an answer.
 */
export function parseNumber(raw) {
  const s = clean(raw).replace(/\s*%$/, "");
  if (!s) return null;

  // Mixed number: "2 3/4"
  const mixed = s.match(/^(-?\d+)\s+(\d+)\/(\d+)$/);
  if (mixed) {
    const whole = Number(mixed[1]);
    const n = Number(mixed[2]);
    const d = Number(mixed[3]);
    if (!d) return null;
    const sign = whole < 0 ? -1 : 1;
    return { value: whole + sign * (n / d), numerator: whole * d + sign * n, denominator: d, form: "mixed" };
  }

  // Vulgar fraction
  const frac = s.match(/^(-?\d+)\/(-?\d+)$/);
  if (frac) {
    const n = Number(frac[1]);
    const d = Number(frac[2]);
    if (!d) return null;
    return { value: n / d, numerator: n, denominator: d, form: "fraction" };
  }

  // Standard form typed as 3.2x10^5 or 3.2e5
  const std = s.match(/^(-?\d*\.?\d+)\s*(?:\*|x)?\s*10\^(-?\d+)$/);
  if (std) {
    const value = Number(std[1]) * Math.pow(10, Number(std[2]));
    return { value, mantissa: Number(std[1]), exponent: Number(std[2]), form: "standard" };
  }

  if (!/^-?\d*\.?\d+(e-?\d+)?$/.test(s)) return null;
  const value = Number(s);
  if (!Number.isFinite(value)) return null;

  const decimals = (s.split(".")[1] || "").replace(/e.*/, "").length;
  return { value, decimals, form: decimals ? "decimal" : "integer" };
}

/** Is the fraction the student typed in its lowest terms? */
export function inLowestTerms(parsed) {
  if (!parsed?.denominator) return false;
  return gcd(Math.abs(parsed.numerator), Math.abs(parsed.denominator)) === 1;
}

/* ── A tiny expression evaluator ─────────────────────────────────────── */

/**
 * Shunting-yard, then evaluate. Deliberately NOT `eval` or `new Function`:
 * this runs on the server against a string a user typed, and handing that to
 * the JavaScript parser is a remote code execution bug with extra steps.
 *
 * Supports + - * / ^, brackets, unary minus, implicit multiplication (3x,
 * 2(x+1)) and single-letter variables. That covers everything the algebra
 * atoms in this course ask a student to type.
 */
const PRECEDENCE = { "+": 1, "-": 1, "*": 2, "/": 2, "^": 3 };

function tokenise(text) {
  const s = clean(text).replace(/\s+/g, "");
  const tokens = [];
  let i = 0;

  while (i < s.length) {
    const c = s[i];
    if (/[0-9.]/.test(c)) {
      let j = i;
      while (j < s.length && /[0-9.]/.test(s[j])) j += 1;
      tokens.push({ type: "num", value: Number(s.slice(i, j)) });
      i = j;
      continue;
    }
    if (/[a-z]/.test(c)) {
      tokens.push({ type: "var", value: c });
      i += 1;
      continue;
    }
    if ("+-*/^()".includes(c)) {
      tokens.push({ type: "op", value: c });
      i += 1;
      continue;
    }
    return null; // something we do not understand: refuse rather than guess
  }

  // Implicit multiplication, inserted where a value is followed by a value.
  const out = [];
  for (let k = 0; k < tokens.length; k += 1) {
    const t = tokens[k];
    const prev = out[out.length - 1];
    const startsValue = t.type !== "op" || t.value === "(";
    const endsValue = prev && (prev.type !== "op" || prev.value === ")");
    if (prev && endsValue && startsValue) out.push({ type: "op", value: "*" });
    out.push(t);
  }
  return out;
}

function toRpn(tokens) {
  const output = [];
  const ops = [];
  let previous = null;

  for (const t of tokens) {
    if (t.type === "num" || t.type === "var") {
      output.push(t);
    } else if (t.value === "(") {
      ops.push(t);
    } else if (t.value === ")") {
      while (ops.length && ops[ops.length - 1].value !== "(") output.push(ops.pop());
      if (!ops.length) return null;
      ops.pop();
    } else {
      // Unary minus: a minus with nothing usable before it.
      const unary =
        t.value === "-" &&
        (!previous || (previous.type === "op" && previous.value !== ")"));
      if (unary) {
        output.push({ type: "num", value: 0 });
        ops.push({ type: "op", value: "-" });
      } else {
        while (
          ops.length &&
          ops[ops.length - 1].value !== "(" &&
          PRECEDENCE[ops[ops.length - 1].value] >= PRECEDENCE[t.value] &&
          t.value !== "^"
        ) {
          output.push(ops.pop());
        }
        ops.push(t);
      }
    }
    previous = t;
  }

  while (ops.length) {
    const op = ops.pop();
    if (op.value === "(") return null;
    output.push(op);
  }
  return output;
}

/** Evaluate an expression at given variable values. Returns null if unusable. */
export function evaluate(text, values = {}) {
  const tokens = tokenise(text);
  if (!tokens || !tokens.length) return null;
  const rpn = toRpn(tokens);
  if (!rpn) return null;

  const stack = [];
  for (const t of rpn) {
    if (t.type === "num") stack.push(t.value);
    else if (t.type === "var") {
      if (!(t.value in values)) return null;
      stack.push(values[t.value]);
    } else {
      const b = stack.pop();
      const a = stack.pop();
      if (a === undefined || b === undefined) return null;
      if (t.value === "+") stack.push(a + b);
      else if (t.value === "-") stack.push(a - b);
      else if (t.value === "*") stack.push(a * b);
      else if (t.value === "/") stack.push(b === 0 ? NaN : a / b);
      else if (t.value === "^") stack.push(Math.pow(a, b));
    }
  }
  return stack.length === 1 && Number.isFinite(stack[0]) ? stack[0] : null;
}

/** Which single letters appear in an expression. */
export function variablesIn(text) {
  const tokens = tokenise(text) || [];
  return [...new Set(tokens.filter((t) => t.type === "var").map((t) => t.value))];
}

/**
 * Are two algebraic expressions the same expression?
 *
 * Compared by evaluating both at several awkward points rather than by
 * rearranging them symbolically. 2(x+3) and 2x+6 agree everywhere; 2x+6 and
 * 2x+5 disagree immediately. Points are chosen to avoid 0 and 1, where far too
 * many wrong answers accidentally agree with right ones.
 */
export function sameExpression(given, expected, variables = ["x"]) {
  const points = [2, 3, -4, 7, 0.5, -1.5];
  let checked = 0;

  for (const p of points) {
    const values = {};
    variables.forEach((v, i) => {
      values[v] = p + i * 1.3;
    });
    const g = evaluate(given, values);
    const e = evaluate(expected, values);
    if (e === null) return false;
    if (g === null) return false;
    if (Math.abs(g - e) > 1e-6 * Math.max(1, Math.abs(e))) return false;
    checked += 1;
  }
  return checked >= 4;
}

/* ── The checker ─────────────────────────────────────────────────────── */

/**
 * Mark one typed answer against one item.
 *
 * `spec` is the item's `input` block plus its `answer`:
 *   kind      "number" | "fraction" | "ratio" | "list" | "text" | "choice" |
 *             "expression" | "coordinates"
 *   answer    the canonical answer
 *   accept    extra strings that are also right
 *   exact     "lowest-terms" | "decimals:2" | "standard-form" | "integer"
 *   tolerance absolute tolerance for a numeric answer (default: exact to 1e-9)
 *   unit      the unit expected, if the item asks for one
 *
 * Returns { correct, reason, normalised }. `reason` is a machine code the
 * grader turns into feedback — "right value, wrong form" is a different thing
 * to say than "wrong", and a student who rounded to three decimals when two
 * were asked for should be told which of the two they got wrong.
 */
export function check(given, spec) {
  const kind = spec.kind || "number";
  const raw = clean(given);
  if (!raw) return { correct: false, reason: "blank", normalised: "" };

  const accepted = (spec.accept || []).map(clean);
  if (accepted.includes(raw)) return { correct: true, reason: "accepted", normalised: raw };

  switch (kind) {
    case "choice":
    case "text":
      return checkText(raw, spec);
    case "list":
      return checkList(raw, spec);
    case "ratio":
      return checkRatio(raw, spec);
    case "coordinates":
      return checkCoordinates(raw, spec);
    case "expression":
      return checkExpression(raw, spec);
    case "fraction":
    case "number":
    default:
      return checkNumber(raw, spec);
  }
}

function checkText(raw, spec) {
  const want = clean(spec.answer);
  const normal = raw.replace(/[.\s]+$/, "");
  return {
    correct: normal === want || normal === want.replace(/[.\s]+$/, ""),
    reason: "text",
    normalised: normal,
  };
}

function checkNumber(raw, spec) {
  const { value: bare, unit } = spec.unit ? splitUnit(raw) : { value: raw, unit: "" };
  const parsed = parseNumber(bare);
  if (!parsed) return { correct: false, reason: "unreadable", normalised: raw };

  const target =
    typeof spec.answer === "number" ? spec.answer : parseNumber(spec.answer)?.value;
  if (target === undefined || target === null) {
    return { correct: false, reason: "unreadable", normalised: raw };
  }

  const tolerance = spec.tolerance ?? Math.max(1e-9, Math.abs(target) * 1e-9);
  const valueRight = Math.abs(parsed.value - target) <= tolerance;

  if (!valueRight) return { correct: false, reason: "value", normalised: raw, parsed };

  // The value is right. Is the FORM the one the atom is about?
  if (spec.exact === "lowest-terms" && parsed.denominator && !inLowestTerms(parsed)) {
    return { correct: false, reason: "not-simplified", normalised: raw, parsed };
  }
  if (spec.exact === "integer" && !Number.isInteger(parsed.value)) {
    return { correct: false, reason: "not-integer", normalised: raw, parsed };
  }
  if (spec.exact?.startsWith("decimals:")) {
    const want = Number(spec.exact.split(":")[1]);
    if ((parsed.decimals ?? 0) !== want) {
      return { correct: false, reason: "wrong-dp", normalised: raw, parsed, want };
    }
  }
  if (spec.exact === "standard-form") {
    if (parsed.form !== "standard" || Math.abs(parsed.mantissa) < 1 || Math.abs(parsed.mantissa) >= 10) {
      return { correct: false, reason: "not-standard-form", normalised: raw, parsed };
    }
  }
  if (spec.unit && unit && unit !== clean(spec.unit).replace(/\s+/g, "")) {
    return { correct: false, reason: "wrong-unit", normalised: raw, parsed, unit };
  }

  return { correct: true, reason: "value", normalised: raw, parsed };
}

function checkList(raw, spec) {
  const split = (t) =>
    String(t)
      .split(/[,;\s]+/)
      .map((p) => clean(p))
      .filter(Boolean);

  const given = split(raw);
  const want = Array.isArray(spec.answer) ? spec.answer.map(String).map(clean) : split(spec.answer);

  if (given.length !== want.length) {
    return {
      correct: false,
      reason: given.length < want.length ? "list-short" : "list-long",
      normalised: given.join(", "),
      count: given.length,
      wanted: want.length,
    };
  }

  const same = spec.ordered
    ? given.every((v, i) => v === want[i])
    : [...given].sort().join("|") === [...want].sort().join("|");

  return { correct: same, reason: "list", normalised: given.join(", ") };
}

function checkRatio(raw, spec) {
  const parts = raw.split(":").map((p) => parseNumber(p)?.value);
  const want = String(spec.answer).split(":").map(Number);
  if (parts.length !== want.length || parts.some((p) => p === undefined || p === null)) {
    return { correct: false, reason: "unreadable", normalised: raw };
  }

  // Same ratio, possibly unsimplified — a distinction the atom decides.
  const scale = parts[0] / want[0];
  const proportional =
    Number.isFinite(scale) && scale > 0 && parts.every((p, i) => Math.abs(p - want[i] * scale) < 1e-9);

  if (!proportional) return { correct: false, reason: "value", normalised: raw };

  if (spec.exact === "lowest-terms") {
    const whole = parts.every(Number.isInteger);
    const divisor = parts.reduce((g, p) => gcd(g, Math.abs(p)), 0);
    if (!whole || divisor !== 1) {
      return { correct: false, reason: "not-simplified", normalised: raw };
    }
  }
  return { correct: true, reason: "ratio", normalised: raw };
}

function checkCoordinates(raw, spec) {
  const nums = raw.replace(/[()]/g, "").split(/[,\s]+/).filter(Boolean).map((p) => parseNumber(p)?.value);
  const want = String(spec.answer).replace(/[()]/g, "").split(/[,\s]+/).filter(Boolean).map(Number);
  if (nums.length !== want.length || nums.some((n) => n === undefined || n === null)) {
    return { correct: false, reason: "unreadable", normalised: raw };
  }
  const tolerance = spec.tolerance ?? 1e-9;
  const ok = nums.every((n, i) => Math.abs(n - want[i]) <= tolerance);
  // Swapping x and y is common enough to be worth naming rather than just
  // marking wrong.
  if (!ok && nums.length === 2 && Math.abs(nums[0] - want[1]) <= tolerance && Math.abs(nums[1] - want[0]) <= tolerance) {
    return { correct: false, reason: "coordinates-swapped", normalised: raw };
  }
  return { correct: ok, reason: "coordinates", normalised: raw };
}

function checkExpression(raw, spec) {
  const variables = spec.variables || variablesIn(String(spec.answer));
  if (!variables.length) return checkNumber(raw, spec);
  const same = sameExpression(raw, String(spec.answer), variables);
  if (!same) return { correct: false, reason: "value", normalised: raw };
  if (spec.exact === "factorised" && !/\(/.test(raw)) {
    return { correct: false, reason: "not-factorised", normalised: raw };
  }
  if (spec.exact === "expanded" && /\(/.test(raw)) {
    return { correct: false, reason: "not-expanded", normalised: raw };
  }
  return { correct: true, reason: "expression", normalised: raw };
}

/* ── Feedback for the marking reasons, not for the mathematics ───────── */

/**
 * What to say when the answer was rejected for a reason that is about form or
 * about reading the question, rather than about the mathematics. The
 * mathematics-specific feedback comes from the item's own traps; these are the
 * things that are true of every item in the course.
 */
export const REASON_NOTES = {
  blank: "Nothing was entered. An answer you are unsure of is worth more than a blank, both here and in the exam.",
  unreadable:
    "That could not be read as a number. Write it as a plain number, a fraction like 3/4, or a mixed number like 2 3/4 — no words and no working.",
  "not-simplified":
    "The value is right, but this atom is about giving a fraction in its LOWEST TERMS. Divide the top and the bottom by their highest common factor.",
  "not-integer": "The value is right but the answer to this question has to be a whole number.",
  "wrong-dp":
    "The value is right but it is not rounded to the number of decimal places the question asked for. In the exam, the degree of accuracy is part of the answer.",
  "not-standard-form":
    "The value is right but it is not in standard form. Standard form needs a number from 1 up to (but not including) 10, multiplied by a power of ten.",
  "wrong-unit": "The number is right but the unit is not the one asked for. Check the conversion before you write it down.",
  "coordinates-swapped":
    "Those are the right two numbers the wrong way round. Coordinates are always (across, up) — x first.",
  "not-factorised": "That is equal to the right expression, but the question asked for it FACTORISED — as a product of brackets.",
  "not-expanded": "That is equal to the right expression, but the question asked for it EXPANDED, with the brackets multiplied out.",
  "list-short": "Part of the list is missing. Work through them in order so none is skipped.",
  "list-long": "There are more items in that list than there should be. One of them does not belong.",
};

export { simplify, tidy };
