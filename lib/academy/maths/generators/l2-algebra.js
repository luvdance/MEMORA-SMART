import { item, trap, num, frac, expr, byTier } from "./kit.js";
import { gcd, simplify, fracText } from "../rng.js";

/**
 * GENERATORS · LEVEL 2 · BRACKETS AND LINEAR EQUATIONS
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Contains every answer for L2-A1 and L2-A2.
 * ═════════════════════════════════════════════════════════════════════════
 *
 * Expressions are marked by evaluation, so any correct arrangement is
 * accepted. Where the FORM is the skill, `exact` insists on it: an expanded
 * answer may not contain a bracket, a factorised one must.
 */

export const generators = {};

/** Tidy signed term: (3, "x") → "3x", (-1, "x") → "−x", (5, "") → "5". */
function term(c, v, first = false) {
  if (c === 0) return "";
  const sign = c < 0 ? (first ? "−" : " − ") : first ? "" : " + ";
  const size = Math.abs(c) === 1 && v ? "" : String(Math.abs(c));
  return `${sign}${size}${v}`;
}
const poly = (...pairs) => pairs.map(([c, v], i) => term(c, v, i === 0 || pairs.slice(0, i).every(([cc]) => cc === 0))).join("") || "0";
/** Plain-text version for the checker: ^ for powers, - for minus. */
const plainPoly = (...pairs) => poly(...pairs).replace(/−/g, "-").replace(/²/g, "^2");

/** A signed number for display: -6 → −6. */
const sn = (n) => String(n).replace("-", "−");
/** A bracket for display: (x − 6), with the coefficient of x shown only when it is not 1. */
const br = (a, b) => `(${poly([a, "x"], [b, ""])})`;

/* ── L2-A1.1 · Expanding single brackets ────────────────────────────── */

generators["L2-A1.1"] = (r, tier) => {
  const k = byTier(tier, { build: r.int(2, 6), stretch: r.intExcept(-6, 6, [0, 1, -1]), exam: r.intExcept(-7, 7, [0, 1, -1]) });
  const a = r.int(1, 6);
  const b = r.intExcept(-9, 9, [0]);
  const xOutside = tier === "exam" && r.chance(0.5);

  if (xOutside) {
    const shown = `${sn(k)}x${br(a, b)}`;
    const answer = plainPoly([k * a, "x²"], [k * b, "x"]);
    return item({
      skill: "Expanding a bracket with a letter outside",
      prompt: `Expand ${shown}.`,
      input: expr({ placeholder: "e.g. 6x^2 - 15x" }),
      answer,
      exact: "expanded",
      hints: ["Multiply EVERY term inside the bracket by what is outside.", `${k}x × ${a}x = ${k * a}x², and ${k}x × ${b} = ${k * b}x.`, "x × x = x²."],
      solution: [`${poly([k, "x"])} × ${poly([a, "x"])} = ${poly([k * a, "x²"])}`, `${poly([k, "x"])} × ${b < 0 ? `(${sn(b)})` : b} = ${poly([k * b, "x"])}`, `${shown} = ${poly([k * a, "x²"], [k * b, "x"])}`],
      traps: [trap("only-first-term", plainPoly([k * a, "x²"], [b, ""]), "The outside term multiplies EVERY term in the bracket, including the last one."), trap("x-times-x-as-2x", plainPoly([2 * k * a, "x"], [k * b, "x"]), "x × x is x², not 2x.")],
    });
  }

  const shown = `${sn(k)}${br(a, b)}`;
  const answer = plainPoly([k * a, "x"], [k * b, ""]);
  return item({
    skill: "Expanding a single bracket",
    prompt: `Expand ${shown}.`,
    input: expr({ placeholder: "e.g. 6x - 15" }),
    answer,
    exact: "expanded",
    hints: ["Multiply EVERY term inside by the number outside.", `${sn(k)} × ${poly([a, "x"])} = ${poly([k * a, "x"])}`, `${sn(k)} × ${b < 0 ? `(${sn(b)})` : b} = ${sn(k * b)}${k < 0 && b < 0 ? " (negative × negative is positive)" : ""}`],
    solution: [`${sn(k)} × ${poly([a, "x"])} = ${poly([k * a, "x"])}`, `${sn(k)} × ${b < 0 ? `(${sn(b)})` : b} = ${sn(k * b)}`, `${shown} = ${poly([k * a, "x"], [k * b, ""])}`],
    traps: [
      trap("only-first-term", plainPoly([k * a, "x"], [b, ""]), "The number outside multiplies EVERY term in the bracket, not just the first."),
      k < 0 ? trap("sign-of-second", plainPoly([k * a, "x"], [-k * b, ""]), "A negative outside the bracket changes the sign of EVERY term inside.") : null,
    ].filter(Boolean),
  });
};

/* ── L2-A1.2 · Expanding double brackets ────────────────────────────── */

generators["L2-A1.2"] = (r, tier) => {
  const a = tier === "exam" ? r.int(2, 4) : 1;
  const c = tier === "exam" && r.chance(0.5) ? r.int(2, 3) : 1;
  const b = r.intExcept(-9, 9, [0]);
  const d = r.intExcept(-9, 9, [0]);
  const square = tier === "stretch" && r.chance(0.4);
  const [bb, dd, cc] = square ? [b, b, a] : [b, d, c];
  const left = poly([a, "x"], [bb, ""]);
  const right = poly([cc, "x"], [dd, ""]);
  const shown = square ? `(${left})²` : `(${left})(${right})`;
  const x2 = a * cc;
  const x1 = a * dd + bb * cc;
  const k = bb * dd;
  const answer = plainPoly([x2, "x²"], [x1, "x"], [k, ""]);
  return item({
    skill: square ? "Squaring a bracket" : "Expanding two brackets",
    prompt: `Expand and simplify ${shown}.`,
    input: expr({ placeholder: "e.g. x^2 - 2x - 15" }),
    answer,
    exact: "expanded",
    hints: [
      square ? `${shown} means (${left})(${left}). It is NOT ${a === 1 ? "x" : `${a}x`}² + ${bb * bb}.` : "Every term in the first bracket multiplies every term in the second: four products.",
      `First: ${poly([a, "x"])} × ${poly([cc, "x"])} = ${poly([x2, "x²"])}.  Last: ${sn(bb)} × ${sn(dd)} = ${sn(k)}.`,
      `The two middle products: ${poly([a * dd, "x"])} and ${poly([bb * cc, "x"])}, which collect to ${poly([x1, "x"])}.`,
    ],
    solution: [`${poly([a, "x"])} × ${poly([cc, "x"])} = ${poly([x2, "x²"])}`, `${poly([a, "x"])} × ${sn(dd)} = ${poly([a * dd, "x"])}`, `${sn(bb)} × ${poly([cc, "x"])} = ${poly([bb * cc, "x"])}`, `${sn(bb)} × ${sn(dd)} = ${sn(k)}`, `Collect: ${poly([x2, "x²"], [x1, "x"], [k, ""])}`],
    traps: [
      trap("missed-middle", plainPoly([x2, "x²"], [k, ""]), square ? "Squaring a bracket is NOT squaring each term. (a + b)² = a² + 2ab + b²: the middle term is missing." : "Two of the four products are missing. The middle terms come from the outer and inner pairs."),
      a * dd - bb * cc !== x1 ? trap("middle-sign", plainPoly([x2, "x²"], [a * dd - bb * cc, "x"], [k, ""]), "Check the signs of the two middle products before collecting them.") : null,
    ].filter(Boolean),
  });
};

/* ── L2-A1.3 · Factorising by a common factor ───────────────────────── */

generators["L2-A1.3"] = (r, tier) => {
  const withX = tier !== "build" && r.chance(0.6);
  const h = r.int(2, 6);
  let p;
  let q;
  do {
    p = r.int(1, 7);
    q = r.intExcept(-9, 9, [0]);
  } while (gcd(p, Math.abs(q)) !== 1);

  if (withX) {
    // h x (p x + q) = hp x² + hq x
    const shown = poly([h * p, "x²"], [h * q, "x"]);
    const answer = `${h}x(${plainPoly([p, "x"], [q, ""])})`;
    return item({
      skill: "Taking out a common factor that includes a letter",
      prompt: `Factorise completely: ${shown}`,
      input: expr({ placeholder: "e.g. 2x(3x - 5)" }),
      answer,
      exact: "factorised",
      hints: ["Find the HCF of the numbers AND the lowest power of x in every term.", `HCF of ${h * p} and ${Math.abs(h * q)} is ${h}, and every term has an x.`, `Take out ${h}x and divide each term by it.`],
      solution: [`Common factor: ${h}x`, `${h * p}x² ÷ ${h}x = ${p}x,  ${h * q}x ÷ ${h}x = ${q}`, `${shown} = ${h}x(${poly([p, "x"], [q, ""])})`],
      traps: [trap("number-only", `${h}(${plainPoly([p, "x²"], [q, "x"])})`, `Not complete: x is also a common factor. Take out ${h}x.`)],
    });
  }
  const shown = poly([h * p, "x"], [h * q, ""]);
  const answer = `${h}(${plainPoly([p, "x"], [q, ""])})`;
  return item({
    skill: "Taking out a common number factor",
    prompt: `Factorise completely: ${shown}`,
    input: expr({ placeholder: "e.g. 3(2x + 3)" }),
    answer,
    exact: "factorised",
    hints: ["Find the HIGHEST number that divides every term.", `HCF of ${h * p} and ${Math.abs(h * q)} = ${h}`, `Write ${h}( ... ) and divide each term by ${h}.`],
    solution: [`HCF = ${h}`, `${h * p}x ÷ ${h} = ${p}x,  ${h * q} ÷ ${h} = ${q}`, `${shown} = ${h}(${poly([p, "x"], [q, ""])})`],
    traps: [],
  });
};

/* ── L2-A1.4 · Simplifying simple algebraic fractions ───────────────── */

generators["L2-A1.4"] = (r, tier) => {
  const kind = r.pick(byTier(tier, { build: ["monomial", "split"], stretch: ["monomial", "split", "cancel-bracket"], exam: ["cancel-bracket", "monomial"] }));

  if (kind === "monomial") {
    const k = r.int(2, 5);
    const a = r.int(2, 7) * k;
    const b = k;
    const m = r.int(3, 6);
    const n = r.int(1, m - 1);
    return item({
      skill: "Cancelling numbers and powers in a single-term fraction",
      prompt: `Simplify ${a}x${"⁰¹²³⁴⁵⁶"[m]} ÷ ${b}x${n === 1 ? "" : "⁰¹²³⁴⁵⁶"[n]}.`,
      input: expr(),
      answer: `${a / b}x^${m - n}`,
      exact: "no-slash",
      hints: ["Divide the numbers. Subtract the powers of x.", `${a} ÷ ${b} = ${a / b}`, `x${"⁰¹²³⁴⁵⁶"[m]} ÷ x${n === 1 ? "" : "⁰¹²³⁴⁵⁶"[n]} = x${"⁰¹²³⁴⁵⁶"[m - n]}`],
      solution: [`${a} ÷ ${b} = ${a / b}`, `x^${m} ÷ x^${n} = x^${m - n}`, `Answer: ${a / b}x^${m - n}`],
      traps: [trap("divided-powers", `${a / b}x^${m / n}`, "Subtract the powers when dividing; do not divide them.")],
    });
  }
  if (kind === "split") {
    const k = r.int(2, 6);
    const a = r.int(1, 5);
    const b = r.intExcept(-8, 8, [0]);
    const shown = `(${poly([k * a, "x"], [k * b, ""])}) ÷ ${k}`;
    return item({
      skill: "Dividing every term by the denominator",
      prompt: `Simplify ${shown}.`,
      input: expr(),
      answer: plainPoly([a, "x"], [b, ""]),
      exact: "no-slash",
      hints: [`Divide EVERY term on top by ${k}.`, `${k * a}x ÷ ${k} = ${a}x`, `${k * b} ÷ ${k} = ${b}`],
      solution: [`${k * a}x ÷ ${k} = ${a === 1 ? "" : a}x`, `${k * b} ÷ ${k} = ${b}`, `= ${poly([a, "x"], [b, ""])}`],
      traps: [trap("first-term-only", plainPoly([a, "x"], [k * b, ""]), `Divide EVERY term by ${k}, not just the first.`)],
    });
  }
  const k = r.int(2, 7);
  const b = r.intExcept(-8, 8, [0]);
  const bracket = poly([1, "x"], [b, ""]);
  const shown = `(${poly([k, "x"], [k * b, ""])}) ÷ (${bracket})`;
  return item({
    skill: "Factorising the top, then cancelling a bracket",
    prompt: `Simplify ${shown}.`,
    input: expr(),
    answer: String(k),
    exact: "no-slash",
    hints: ["Factorise the top first.", `${poly([k, "x"], [k * b, ""])} = ${k}(${bracket})`, `Now (${bracket}) cancels.`],
    solution: [`${poly([k, "x"], [k * b, ""])} = ${k}(${bracket})`, `${k}(${bracket}) ÷ (${bracket}) = ${k}`],
    traps: [trap("kept-x", `${k}x`, "The whole bracket cancels, x included. Only the ${k} is left.")],
  });
};

/* ── L2-A2.1 · Equations with brackets ──────────────────────────────── */

generators["L2-A2.1"] = (r, tier) => {
  const x = r.intExcept(-6, 12, [0]);
  const a = r.int(2, 6);
  const b = r.intExcept(-8, 8, [0]);
  if (tier === "build") {
    const rhs = a * (x + b);
    return item({
      skill: "Solving an equation with one bracket",
      prompt: `Solve ${a}${br(1, b)} = ${sn(rhs)}.`,
      input: num(),
      answer: x,
      hints: ["Expand the bracket first, or divide both sides by the number outside.", `Divide by ${a}: x ${b < 0 ? "−" : "+"} ${Math.abs(b)} = ${rhs / a}.`, `Then ${b < 0 ? "add" : "subtract"} ${Math.abs(b)}.`],
      solution: [`÷ ${a}: x ${b < 0 ? "−" : "+"} ${Math.abs(b)} = ${rhs / a}`, `x = ${x}`],
      traps: [trap("expanded-first-term-only", Math.round(((rhs - b) / a) * 100) / 100, `Expanding ${a}(x ${b < 0 ? "−" : "+"} ${Math.abs(b)}) gives ${a}x ${a * b < 0 ? "−" : "+"} ${Math.abs(a * b)}: multiply the ${Math.abs(b)} as well.`)],
    });
  }
  // a(x + b) = c(x + d), with x chosen first
  let c;
  do c = r.int(1, 6);
  while (c === a);
  // a x + ab = c x + c·dd: choose x first, then the constant dd that makes it true
  const rhsConst = a * x + a * b - c * x;
  if (rhsConst % c !== 0) return generators["L2-A2.1"](r, "build");
  const dd = rhsConst / c;
  const L = `${a}${br(1, b)}`;
  const R = dd === 0 ? poly([c, "x"]) : c === 1 ? poly([1, "x"], [dd, ""]) : `${c}${br(1, dd)}`;
  return item({
    skill: "Solving an equation with brackets on both sides",
    prompt: `Solve ${L} = ${R}.`,
    input: num(),
    answer: x,
    hints: ["Expand the brackets.", `${poly([a, "x"], [a * b, ""])} = ${poly([c, "x"], [c * dd, ""])}`, "Collect the x terms on one side and the numbers on the other."],
    solution: [`${poly([a, "x"], [a * b, ""])} = ${poly([c, "x"], [c * dd, ""])}`, `${poly([a - c, "x"])} = ${sn(c * dd - a * b)}`, `x = ${sn(x)}`],
    traps: [trap("sign-when-moving", Math.round(((c * dd + a * b) / (a - c)) * 100) / 100, "When a term moves across the equals sign, do the opposite operation to BOTH sides; its sign changes.")],
  });
};

/* ── L2-A2.2 · Equations with fractions ─────────────────────────────── */

generators["L2-A2.2"] = (r, tier) => {
  if (tier === "build") {
    const [p, q] = r.pick([[2, 3], [3, 4], [2, 5], [4, 5], [3, 5]]);
    const L = (p * q) / gcd(p, q);
    const x = L * r.int(1, 6);
    const rhs = x / p + x / q;
    return item({
      skill: "Clearing fractions by multiplying by the LCM",
      prompt: `Solve x/${p} + x/${q} = ${rhs}.`,
      input: num(),
      answer: x,
      hints: [`Multiply EVERY term by the LCM of ${p} and ${q}, which is ${L}.`, `${L/p}x + ${L/q}x = ${rhs * L}`, `${L/p + L/q}x = ${rhs * L}`],
      solution: [`× ${L}: ${L / p}x + ${L / q}x = ${rhs * L}`, `${L / p + L / q}x = ${rhs * L}`, `x = ${x}`],
      traps: [trap("added-denominators", Math.round(((rhs * (p + q)) / 2) * 100) / 100, "x/p + x/q is not 2x/(p + q). Multiply through by the LCM.")],
    });
  }
  // (x + a)/p = (x + b)/q  → q(x + a) = p(x + b) → (q − p)x = pb − qa
  const [p, q] = r.pick([[2, 3], [3, 4], [2, 5], [3, 5], [4, 3], [5, 2]]);
  const a = r.intExcept(-6, 6, [0]);
  const b = r.intExcept(-6, 6, [0]);
  const num_ = p * b - q * a;
  const den = q - p;
  const [n2, d2] = simplify(num_, den);
  const answer = fracText(n2, d2);
  return item({
    skill: "Cross-multiplying an equation with fractions on both sides",
    prompt: `Solve ${br(1, a)}/${p} = ${br(1, b)}/${q}.`,
    input: frac(),
    answer,
    hints: ["Cross-multiply: each numerator times the OTHER denominator.", `${q}${br(1, a)} = ${p}${br(1, b)}`, `${poly([q, "x"], [q * a, ""])} = ${poly([p, "x"], [p * b, ""])}`],
    solution: [...new Set([`${q}${br(1, a)} = ${p}${br(1, b)}`, `${poly([q, "x"], [q * a, ""])} = ${poly([p, "x"], [p * b, ""])}`, `${poly([den, "x"])} = ${sn(num_)}`, `x = ${sn(answer)}`])],
    traps: [trap("bracket-not-multiplied", fracText(...simplify(b - a, den)), "Multiply the WHOLE numerator by the other denominator: both terms in the bracket.")],
  });
};

/* ── L2-A2.3 · Changing the subject ─────────────────────────────────── */

const FORMULAE = [
  { f: "v = u + at", want: "a", answer: "(v - u)/t", steps: ["v − u = at", "a = (v − u)/t"], trap: "(v - u)t" },
  { f: "v = u + at", want: "u", answer: "v - at", steps: ["u = v − at"], trap: "v + at" },
  { f: "p = 2(l + w)", want: "w", answer: "p/2 - l", steps: ["p/2 = l + w", "w = p/2 − l"], trap: "p - 2l" },
  { f: "a = bh/2", want: "h", answer: "2a/b", steps: ["2a = bh", "h = 2a/b"], trap: "a/(2b)" },
  { f: "s = d/t", want: "t", answer: "d/s", steps: ["st = d", "t = d/s"], trap: "ds" },
  { f: "y = mx + c", want: "x", answer: "(y - c)/m", steps: ["y − c = mx", "x = (y − c)/m"], trap: "y/m - c" },
  { f: "c = 5(f - 32)/9", want: "f", answer: "9c/5 + 32", steps: ["9c = 5(f − 32)", "9c/5 = f − 32", "f = 9c/5 + 32"], trap: "9c/5 - 32" },
  { f: "i = prt/100", want: "r", answer: "100i/(pt)", steps: ["100i = prt", "r = 100i/(pt)"], trap: "100ipt" },
];

generators["L2-A2.3"] = (r, tier) => {
  const pool = tier === "build" ? FORMULAE.slice(0, 5) : FORMULAE;
  const F = r.pick(pool);
  return item({
    skill: "Making a different letter the subject",
    prompt: `Make ${F.want} the subject of the formula  ${F.f}

Type the expression that ${F.want} equals.`,
    input: expr({ placeholder: "e.g. (v - u)/t" }),
    answer: F.answer,
    hints: [`Treat ${F.want} as the unknown in an equation.`, "Undo the operations around it in reverse order, doing the same to both sides.", F.steps[0]],
    solution: [F.f, ...F.steps],
    traps: [trap("wrong-inverse", F.trap, "One step used the wrong inverse operation. Undo each operation with its opposite, applied to the WHOLE of each side.")],
  });
};

export default generators;
