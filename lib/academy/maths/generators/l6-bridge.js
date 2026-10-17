import { item, trap, num, frac, list, expr, choice, byTier } from "./kit.js";
import { simplify, fracText, naira, NAMES } from "../rng.js";
import { sn, poly, plainPoly } from "./format.js";

/**
 * GENERATORS · LEVEL 6 · WORD PROBLEMS AND THE UNIVERSITY BRIDGE
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Contains every answer for L6-E1, L6-U1 and L6-U2.
 * ═════════════════════════════════════════════════════════════════════════
 */

export const generators = {};

const F = (n, d) => fracText(...simplify(n, d));
const fact = (n) => (n <= 1 ? 1 : n * fact(n - 1));
const nCr = (n, k) => fact(n) / (fact(k) * fact(n - k));
const brk = (r) => `(x ${r > 0 ? "−" : "+"} ${Math.abs(r)})`;

/* ── L6-E1 · Word problems ──────────────────────────────────────────── */

generators["L6-E1.1"] = (r, tier) => {
  const k = r.int(2, 5);
  const c = r.int(2, 12);
  const [p1, p2] = r.shuffle(NAMES).slice(0, 2);
  const cases = [
    { q: `${p1} is ${c} years older than ${k} times ${p2}'s age. If ${p2} is b years old, write ${p1}'s age.`, a: `${k}b + ${c}`, t: `${k}(b + ${c})`, ts: `"${c} years older than ${k} times" means multiply first, then add ${c}.` },
    { q: `A number n is multiplied by ${k} and the result is reduced by ${c}. Write the result.`, a: `${k}n - ${c}`, t: `${c} - ${k}n`, ts: `"Reduced by ${c}" means subtract ${c} FROM the product.` },
    { q: `${p1} has ₦m. ${p2} has ₦${c * 100} less than ${k} times as much. How much does ${p2} have, in naira?`, a: `${k}m - ${c * 100}`, t: `${c * 100} - ${k}m`, ts: `"Less than" reverses the order: ${k} times as much, then take away ${c * 100}.` },
    { q: `The sum of a number x and ${c}, divided by ${k}. Write it.`, a: `(x + ${c})/${k}`, t: `x + ${c}/${k}`, ts: "The SUM is divided, so it needs brackets." },
  ];
  const cs = r.pick(cases);
  return item({
    skill: "Turning words into algebra",
    prompt: cs.q,
    input: expr({ placeholder: "e.g. 3b + 4" }),
    answer: cs.a,
    hints: ["Underline the unknown and the operations.", "'Times' multiplies, 'more/older' adds, 'less/reduced by' subtracts, 'of a sum' needs brackets.", "Build it in the order the operations happen."],
    solution: [cs.a.replace(/-/g, "−")],
    traps: [trap("order", cs.t, cs.ts)],
  });
};

generators["L6-E1.2"] = (r, tier) => {
  const kind = r.pick(byTier(tier, { build: ["difference", "ratio"], stretch: ["difference", "ratio", "fraction"], exam: ["fraction", "ratio", "difference"] }));
  if (kind === "difference") {
    const small = r.int(5, 40);
    const d = r.int(3, 20);
    return item({
      skill: "Bar model: a sum and a difference",
      prompt: `A ${2 * small + d} m rope is cut into two pieces. One piece is ${d} m longer than the other. How long is the shorter piece?`,
      input: num({ unit: "m" }),
      answer: small,
      hints: ["Draw two bars: one is the short piece, the other is the same plus an extra bit.", `Remove the extra ${d} m: two equal bars make ${2 * small} m.`, "Halve it."],
      solution: [`(${2 * small + d} − ${d}) ÷ 2 = ${small} m`],
      traps: [trap("no-remove", (2 * small + d) / 2, "Take off the extra piece BEFORE halving."), trap("longer", small + d, "That is the longer piece.")],
    });
  }
  if (kind === "ratio") {
    const [a, b] = r.pick([[2, 3], [3, 5], [1, 4], [4, 5], [3, 7]]);
    const unit = r.int(2, 15) * 100;
    const total = (a + b) * unit;
    const [p1, p2] = r.shuffle(NAMES).slice(0, 2);
    return item({
      skill: "Bar model: sharing in a ratio",
      prompt: `${naira(total)} is shared between ${p1} and ${p2} in the ratio ${a} : ${b}. How much more does ${p2} get than ${p1}, in naira?`,
      input: num({ unit: "₦" }),
      answer: (b - a) * unit,
      hints: [`Draw ${a} bars for ${p1} and ${b} for ${p2}: ${a + b} equal bars.`, `One bar = ${total} ÷ ${a + b} = ${unit}.`, `${p2} has ${b - a} more bars.`],
      solution: [`One part = ${unit}`, `Difference = ${b - a} × ${unit} = ${(b - a) * unit}`],
      traps: [trap("gave-share", b * unit, `That is ${p2}'s whole share. The question asks how much MORE.`)],
    });
  }
  const [n, d] = r.pick([[1, 3], [2, 5], [1, 4], [3, 8], [2, 7]]);
  const left = r.int(3, 12) * (d - n);
  const whole = (left / (d - n)) * d;
  return item({
    skill: "Bar model: a fraction then the rest",
    prompt: `A trader sold ${n}/${d} of her oranges in the morning and had ${left} left. How many did she start with?`,
    input: num(),
    answer: whole,
    hints: [`Draw a bar in ${d} equal parts; ${n} are sold, ${d - n} are left.`, `${d - n} parts = ${left}, so one part = ${left / (d - n)}.`, `All ${d} parts.`],
    solution: [`One part = ${left / (d - n)}`, `Start = ${d} × ${left / (d - n)} = ${whole}`],
    traps: [trap("fraction-of-left", Math.round((left * d) / n), `${left} is what is LEFT: ${d - n} parts, not ${n}.`)].filter((t) => t.is !== whole),
  });
};

generators["L6-E1.3"] = (r, tier) => {
  const kind = r.pick(byTier(tier, { build: ["consecutive"], stretch: ["consecutive", "tickets"], exam: ["tickets", "age"] }));
  if (kind === "consecutive") {
    const n = r.int(3, 40);
    const k = r.pick([3, 4]);
    const even = r.chance(0.4);
    const step = even ? 2 : 1;
    const start = even ? 2 * n : n;
    const sum = Array.from({ length: k }, (_, i) => start + i * step).reduce((a, b) => a + b, 0);
    return item({
      skill: "Consecutive numbers",
      prompt: `The sum of ${k} consecutive ${even ? "even numbers" : "whole numbers"} is ${sum}. Find the smallest.`,
      input: num(),
      answer: start,
      hints: [`Call the smallest n. The others are ${Array.from({ length: k - 1 }, (_, i) => `n + ${(i + 1) * step}`).join(", ")}.`, `${k}n + ${(step * k * (k - 1)) / 2} = ${sum}`, "Solve for n."],
      solution: [`${k}n = ${sum - (step * k * (k - 1)) / 2}`, `n = ${start}`],
      traps: [trap("mean", sum / k, "That is the middle (the mean). The question asks for the smallest.")].filter((t) => Number.isInteger(t.is) && t.is !== start),
    });
  }
  if (kind === "tickets") {
    const pa = r.pick([500, 800, 1000, 1500]);
    const pc = r.pick([200, 300, 400]);
    const adults = r.int(5, 40);
    const kids = r.int(5, 40);
    return item({
      skill: "Two unknowns from two facts",
      prompt: `Adult tickets cost ₦${pa} and child tickets ₦${pc}. ${adults + kids} tickets were sold for ${naira(pa * adults + pc * kids)}. How many adult tickets were sold?`,
      input: num(),
      answer: adults,
      hints: ["Let a = adults, c = children.", `a + c = ${adults + kids} and ${pa}a + ${pc}c = ${pa * adults + pc * kids}.`, `Substitute c = ${adults + kids} − a.`],
      solution: [`${pa}a + ${pc}(${adults + kids} − a) = ${pa * adults + pc * kids}`, `${pa - pc}a = ${(pa - pc) * adults}`, `a = ${adults}`],
      traps: [trap("children", kids, "That is the number of CHILD tickets.")].filter(() => kids !== adults),
    });
  }
  const child = r.int(4, 15);
  const k = r.pick([3, 4, 5]);
  const yrs = r.int(2, 10);
  const parent = k * child;
  const ratio = (parent + yrs) / (child + yrs);
  if (!Number.isInteger(ratio)) return generators["L6-E1.3"](r, "stretch");
  return item({
    skill: "Age problems",
    prompt: `A mother is ${k} times as old as her son. In ${yrs} years she will be ${ratio} times as old as he will be. How old is the son now?`,
    input: num(),
    answer: child,
    hints: [`Son now: s. Mother now: ${k}s.`, `In ${yrs} years: ${k}s + ${yrs} = ${ratio}(s + ${yrs}).`, "Expand and solve."],
    solution: [`${k}s + ${yrs} = ${ratio}s + ${ratio * yrs}`, `${k - ratio}s = ${ratio * yrs - yrs}`, `s = ${child}`],
    traps: [trap("mother", parent, "That is the mother's age.")],
  });
};

/* ── L6-U1 · Functions, binomial, partial fractions ─────────────────── */

generators["L6-U1.1"] = (r, tier) => {
  const a = r.intExcept(-6, 6, [0]);
  const kind = r.pick(byTier(tier, { build: ["excluded", "sqrt"], stretch: ["excluded", "sqrt", "range"], exam: ["range", "sqrt", "excluded"] }));
  if (kind === "excluded") {
    return item({
      skill: "A value outside the domain",
      prompt: `f(x) = ${r.int(1, 9)}/${brk(a)}. Which real value of x must be excluded from the domain?`,
      input: num(),
      answer: a,
      hints: ["Division by zero is undefined.", `Set the denominator to zero: ${brk(a)} = 0.`, "Solve."],
      solution: [`x = ${sn(a)} is excluded`],
      traps: [trap("sign", -a, `${brk(a)} = 0 when x = ${sn(a)}.`)],
    });
  }
  if (kind === "sqrt") {
    return item({
      skill: "The domain of a square root",
      prompt: `f(x) = √${brk(a)}. What is the smallest x in the domain (over the real numbers)?`,
      input: num(),
      answer: a,
      hints: ["You cannot square-root a negative number in the reals.", `Need ${brk(a)} ≥ 0.`, `x ≥ ${sn(a)}`],
      solution: [`Domain: x ≥ ${sn(a)}`],
      traps: [trap("sign", -a, `${brk(a)} ≥ 0 means x ≥ ${sn(a)}.`)],
    });
  }
  const p = r.pick([1, 2, 3]);
  const h = r.int(-4, 4);
  const k = r.int(-8, 8);
  return item({
    skill: "The range of a quadratic function",
    prompt: `f(x) = ${p === 1 ? "" : p}(x ${h < 0 ? "+" : "−"} ${Math.abs(h)})² ${k < 0 ? "−" : "+"} ${Math.abs(k)}, for all real x. The range is f(x) ≥ m. Find m.`,
    input: num(),
    answer: k,
    hints: ["A square is never negative: its least value is 0.", `The bracket is 0 when x = ${sn(h)}.`, "So the least value of f is the constant."],
    solution: [`Least value ${sn(k)}: range f(x) ≥ ${sn(k)}`],
    traps: [trap("gave-x", h, "That is where the least value happens. The range is about the OUTPUT.")].filter(() => h !== k),
  });
};

generators["L6-U1.2"] = (r, tier) => {
  const a = r.intExcept(-4, 5, [0, 1, -1]);
  const b = r.int(-6, 6);
  const c = r.intExcept(-4, 5, [0]);
  const d = r.int(-6, 6);
  const kind = r.pick(byTier(tier, { build: ["value"], stretch: ["value", "fg"], exam: ["fg", "inverse"] }));
  const f = poly([a, "x"], [b, ""]);
  const g = poly([c, "x"], [d, ""]);
  if (kind === "value") {
    const x = r.int(-3, 4);
    const gx = c * x + d;
    return item({
      skill: "Evaluating a composite function",
      prompt: `f(x) = ${f} and g(x) = ${g}. Find f(g(${sn(x)})).`,
      input: num(),
      answer: a * gx + b,
      hints: ["Work from the inside out: g first.", `g(${sn(x)}) = ${sn(gx)}.`, `f(${sn(gx)}) = ${a}(${sn(gx)}) ${b < 0 ? "−" : "+"} ${Math.abs(b)}`],
      solution: [`g(${sn(x)}) = ${sn(gx)}`, `f(${sn(gx)}) = ${sn(a * gx + b)}`],
      traps: [trap("wrong-order", c * (a * x + b) + d, "That is g(f(x)). f(g(x)) does g FIRST.")],
    });
  }
  if (kind === "fg") {
    return item({
      skill: "Finding f(g(x))",
      prompt: `f(x) = ${f} and g(x) = ${g}. Find f(g(x)) in the form px + q.`,
      input: expr(),
      answer: plainPoly([a * c, "x"], [a * d + b, ""]),
      hints: ["Replace every x in f with the whole of g(x).", `f(g(x)) = ${a}(${g}) ${b < 0 ? "−" : "+"} ${Math.abs(b)}`, "Expand and collect."],
      solution: [`= ${poly([a * c, "x"], [a * d + b, ""])}`],
      traps: [trap("wrong-order", plainPoly([a * c, "x"], [c * b + d, ""]), "That is g(f(x)). Put g INSIDE f.")],
    });
  }
  return item({
    skill: "The inverse of a linear function",
    prompt: `f(x) = ${f}. Find f⁻¹(x).`,
    input: expr({ placeholder: "e.g. (x - 3)/2" }),
    answer: `(x ${b < 0 ? "+" : "-"} ${Math.abs(b)})/(${a})`,
    hints: [`Write y = ${f}.`, "Make x the subject.", "Then swap the letters: replace y with x."],
    solution: [`y = ${f}  →  x = (y ${b < 0 ? "+" : "−"} ${Math.abs(b)})/${sn(a)}`, `f⁻¹(x) = (x ${b < 0 ? "+" : "−"} ${Math.abs(b)})/${sn(a)}`],
    traps: [trap("reciprocal", `1/(${plainPoly([a, "x"], [b, ""])})`, "f⁻¹ is the INVERSE function, not 1/f(x)."), trap("wrong-order", `x/${a} ${b < 0 ? "+" : "-"} ${Math.abs(b)}`, "Undo in REVERSE order: subtract first, then divide.")],
  });
};

generators["L6-U1.3"] = (r, tier) => {
  const n = byTier(tier, { build: r.int(3, 5), stretch: r.int(4, 7), exam: r.int(5, 8) });
  const k = r.intExcept(-3, 3, [0, 1]);
  const rr = r.int(1, Math.min(3, n - 1));
  const coef = nCr(n, rr) * k ** rr;
  return item({
    skill: "A coefficient in a binomial expansion",
    prompt: `Find the coefficient of x${rr === 1 ? "" : `^${rr}`} in the expansion of (1 ${k < 0 ? "−" : "+"} ${Math.abs(k)}x)^${n}.`,
    input: num(),
    answer: coef,
    hints: [`The term in x^${rr} is ⁿCᵣ (${sn(k)}x)^${rr}, with n = ${n}, r = ${rr}.`, `${n}C${rr} = ${nCr(n, rr)}`, `(${sn(k)})^${rr} = ${sn(k ** rr)}`],
    solution: [`${nCr(n, rr)} × ${sn(k ** rr)} = ${sn(coef)}`],
    traps: [trap("no-power", nCr(n, rr) * k, `The ${sn(k)} is raised to the power ${rr} too.`), trap("no-ncr", k ** rr, `Multiply by ${n}C${rr} as well.`)],
  });
};

generators["L6-U1.4"] = (r, tier) => {
  const a = r.intExcept(-4, 4, [0]);
  const b = r.intExcept(-4, 4, [0, a]);
  const A = r.intExcept(-5, 5, [0]);
  const B = r.intExcept(-5, 5, [0]);
  // A/(x − a) + B/(x − b) = [(A + B)x − (Ab + Ba)] / ((x − a)(x − b))
  const top = poly([A + B, "x"], [-(A * b + B * a), ""]);
  return item({
    skill: "Partial fractions",
    prompt: `Express (${top}) / [${brk(a)}${brk(b)}] as A/${brk(a)} + B/${brk(b)}. Give A, B.`,
    input: list({ placeholder: "A, B" }),
    answer: `${A}, ${B}`,
    ordered: true,
    hints: [`${top} = A${brk(b)} + B${brk(a)}`, `Put x = ${sn(a)}: the B term vanishes.`, `Put x = ${sn(b)}: the A term vanishes.`],
    solution: [`x = ${sn(a)}: ${sn((A + B) * a - (A * b + B * a))} = A(${sn(a - b)}) → A = ${sn(A)}`, `x = ${sn(b)}: ${sn((A + B) * b - (A * b + B * a))} = B(${sn(b - a)}) → B = ${sn(B)}`],
    traps: [trap("swapped", `${B}, ${A}`, "A goes over the first bracket, B over the second.")].filter(() => A !== B),
  });
};

/* ── L6-U2 · Proof, sigma, induction, radians, identities, complex ──── */

const CLAIMS = [
  { claim: "Every odd number greater than 1 is prime.", yes: "9", no: ["7", "11", "13", "5", "3"] },
  { claim: "x² > x for every real number x.", yes: "1/2", no: ["2", "3", "−1", "5"] },
  { claim: "n² + n + 1 is prime for every whole number n ≥ 1.", yes: "4", no: ["1", "2", "3", "5"] },
  { claim: "The sum of two prime numbers is always even.", yes: "2 + 3", no: ["3 + 5", "5 + 7", "7 + 11", "3 + 3"] },
  { claim: "If a² = b² then a = b.", yes: "a = 3, b = −3", no: ["a = 2, b = 2", "a = 0, b = 0", "a = 5, b = 5"] },
  { claim: "Every number divisible by 4 is divisible by 8.", yes: "12", no: ["16", "8", "24", "32"] },
];

const SERIES = [
  { s: "r", f: (k) => (k * (k + 1)) / 2, step: "k + 1" },
  { s: "(2r − 1)", f: (k) => k * k, step: "2k + 1" },
  { s: "r²", f: (k) => (k * (k + 1) * (2 * k + 1)) / 6, step: "(k + 1)^2" },
  { s: "r³", f: (k) => ((k * (k + 1)) / 2) ** 2, step: "(k + 1)^3" },
  { s: "2r", f: (k) => k * (k + 1), step: "2k + 2" },
];

generators["L6-U2.1"] = (r, tier) => {
  const c = r.pick(CLAIMS);
  const opts = r.shuffle([c.yes, ...r.shuffle(c.no).slice(0, 3)]);
  return item({
    skill: "Disproving with a counterexample",
    prompt: `Claim: ${c.claim} Which of these is a counterexample?`,
    input: choice(opts),
    answer: c.yes,
    hints: ["A counterexample is ONE case where the claim is false.", "Test each option against the claim.", "Examples that agree with the claim prove nothing."],
    solution: [`${c.yes} makes the claim false, so the claim is disproved.`],
    traps: [],
  });
};

generators["L6-U2.2"] = (r, tier) => {
  const a = r.intExcept(-3, 5, [0]);
  const b = r.int(-5, 6);
  const n = byTier(tier, { build: r.int(3, 6), stretch: r.int(5, 12), exam: r.int(10, 30) });
  const sum = (a * n * (n + 1)) / 2 + b * n;
  const first = a + b;
  return item({
    skill: "Evaluating a sum in sigma notation",
    prompt: `Evaluate the sum Σ (${poly([a, "r"], [b, ""])}) for r = 1 to ${n}.`,
    input: num(),
    answer: sum,
    hints: ["Σ means add the expression for r = 1, 2, 3, … up to the top number.", `It is an AP: first term ${sn(first)}, last term ${sn(a * n + b)}, ${n} terms.`, `Sum = ${n}/2 × (${sn(first)} + ${sn(a * n + b)})`],
    solution: [`= ${n}/2 × (${sn(first)} + ${sn(a * n + b)}) = ${sn(sum)}`],
    traps: [trap("last-term", a * n + b, "That is the LAST term. Σ adds all of them.")],
  });
};

generators["L6-U2.3"] = (r, tier) => {
  const s = r.pick(SERIES);
  if (tier === "build" || r.chance(0.35)) {
    const n = r.int(3, 6);
    return item({
      skill: "Checking a formula for a value of n",
      prompt: `Check the formula for Σ ${s.s} (r = 1 to n) at n = ${n}: what is the value of the sum?`,
      input: num(),
      answer: s.f(n),
      hints: ["Write out each term and add.", "Then check the formula gives the same.", "The base case of an induction proof is this check at n = 1."],
      solution: [`Sum = ${s.f(n)}`],
      traps: [],
    });
  }
  return item({
    skill: "The inductive step",
    prompt: `In proving a formula for Σ ${s.s} (r = 1 to n) by induction, you assume it for n = k. What term must be ADDED to the sum to reach n = k + 1? Write it in terms of k.`,
    input: expr({ placeholder: "e.g. 2k + 1" }),
    answer: s.step,
    variables: ["k"],
    hints: ["The sum to k + 1 is the sum to k plus ONE more term.", "That term is the expression with r replaced by k + 1.", `Replace r in ${s.s} with (k + 1).`],
    solution: [`Next term: ${s.step.replace("^2", "²").replace("^3", "³")}`],
    traps: [trap("used-k", s.step === "k + 1" ? "k" : s.s.replace(/r/g, "k").replace(/[()]/g, "").replace("²", "^2").replace("³", "^3").replace("−", "-"), "That is the k-th term, already in the sum. Add the (k + 1)th.")],
  });
};

generators["L6-U2.4"] = (r, tier) => {
  const kind = r.pick(byTier(tier, { build: ["to-rad", "to-deg"], stretch: ["to-rad", "to-deg", "arc"], exam: ["arc", "to-rad", "to-deg"] }));
  const d = r.pick([30, 45, 60, 90, 120, 135, 150, 180, 210, 240, 270, 300, 315, 360]);
  const [n, den] = simplify(d, 180);
  const piText = `${n === 1 ? "" : n}π${den === 1 ? "" : `/${den}`}`;
  if (kind === "to-rad") {
    return item({
      skill: "Degrees to radians",
      prompt: `Convert ${d}° to radians, as a multiple of π.`,
      input: expr({ placeholder: "e.g. 2π/3", keys: ["π", "/"] }),
      answer: piText,
      hints: ["180° = π radians.", `Multiply by π/180: ${d} × π/180.`, "Simplify the fraction."],
      solution: [`${d}° = ${piText}`],
      traps: [],
    });
  }
  if (kind === "to-deg") {
    return item({
      skill: "Radians to degrees",
      prompt: `Convert ${piText} radians to degrees.`,
      input: num({ unit: "°" }),
      answer: d,
      hints: ["π radians = 180°.", `Replace π with 180°.`, `${n} × 180 ÷ ${den}`],
      solution: [`${piText} = ${d}°`],
      traps: [],
    });
  }
  const rad = r.pick([0.5, 1.2, 1.5, 2, 2.5, 0.8]);
  const radius = r.int(3, 20);
  return item({
    skill: "Arc length s = rθ",
    prompt: `Find the length of the arc of a circle of radius ${radius} cm that subtends ${rad} radians at the centre.`,
    input: num({ unit: "cm" }),
    answer: Math.round(radius * rad * 100) / 100,
    hints: ["With θ in RADIANS, arc length s = rθ.", `${radius} × ${rad}`, "No π or 360 needed: that is the point of radians."],
    solution: [`s = ${radius} × ${rad} = ${Math.round(radius * rad * 100) / 100} cm`],
    traps: [trap("degree-formula", Math.round(((rad / 360) * 2 * Math.PI * radius) * 100) / 100, "θ is in radians here. s = rθ directly.")],
  });
};

generators["L6-U2.5"] = (r, tier) => {
  const [a, b, c] = r.pick([[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25]]);
  const given = r.pick(["sin", "cos"]);
  const want = r.pick(given === "sin" ? ["cos", "tan"] : ["sin", "tan"]);
  const val = { sin: [a, c], cos: [b, c], tan: [a, b] };
  if (tier === "exam" && r.chance(0.4)) {
    const id = r.pick([
      { q: "(1 − cos²x)/sin x", a: "sin x", opts: ["sin x", "cos x", "1", "tan x"] },
      { q: "sin x / tan x", a: "cos x", opts: ["cos x", "sin²x", "tan x", "1"] },
      { q: "sin²x + cos²x + tan x cos x", a: "1 + sin x", opts: ["1 + sin x", "1 + cos x", "2", "sin x"] },
      { q: "(1 − sin²x)/cos x", a: "cos x", opts: ["cos x", "sin x", "1", "sec x"] },
    ]);
    return item({
      skill: "Simplifying with identities",
      prompt: `Simplify ${id.q}.`,
      input: choice(r.shuffle(id.opts)),
      answer: id.a,
      hints: ["sin²x + cos²x = 1, so 1 − cos²x = sin²x and 1 − sin²x = cos²x.", "tan x = sin x / cos x.", "Replace, then cancel."],
      solution: [`${id.q} = ${id.a}`],
      traps: [],
    });
  }
  return item({
    skill: "Using sin²x + cos²x = 1",
    prompt: `x is acute and ${given} x = ${val[given][0]}/${val[given][1]}. Find ${want} x.`,
    input: frac(),
    answer: F(...val[want]),
    hints: ["sin²x + cos²x = 1, or draw the right-angled triangle.", `The sides are ${a}, ${b}, ${c}.`, "sin = opp/hyp, cos = adj/hyp, tan = opp/adj."],
    solution: [`${want} x = ${F(...val[want])}`],
    traps: [trap("upside-down", F(val[want][1], val[want][0]), "Check which side goes on top.")],
  });
};

generators["L6-U2.6"] = (r, tier) => {
  if (tier !== "build" && r.chance(0.5)) {
    const p = r.int(-4, 4);
    const q = r.int(1, 5);
    return item({
      skill: "A quadratic with complex roots",
      prompt: `Solve x² ${-2 * p < 0 ? "−" : "+"} ${Math.abs(2 * p)}x + ${p * p + q * q} = 0. The roots are p ± qi: give p, q (q positive).`,
      input: list({ placeholder: "p, q" }),
      answer: `${p}, ${q}`,
      ordered: true,
      hints: [`Discriminant = ${4 * p * p} − ${4 * (p * p + q * q)} = ${-4 * q * q}, negative.`, `√(${-4 * q * q}) = ${2 * q}i, since i² = −1.`, `x = (${sn(2 * p)} ± ${2 * q}i)/2`],
      solution: [`x = ${sn(p)} ± ${q}i`],
      traps: [trap("sign", `${-p}, ${q}`, "x = −b/2a: watch the sign of b.")].filter(() => p !== 0),
    });
  }
  const [a, b, c, d] = [r.intExcept(-5, 6, [0]), r.intExcept(-5, 6, [0]), r.intExcept(-5, 6, [0]), r.intExcept(-5, 6, [0])];
  const mult = tier !== "build" || r.chance(0.5);
  const res = mult ? [a * c - b * d, a * d + b * c] : [a + c, b + d];
  const z = (x, y) => `(${sn(x)} ${y < 0 ? "−" : "+"} ${Math.abs(y)}i)`;
  return item({
    skill: mult ? "Multiplying complex numbers" : "Adding complex numbers",
    prompt: `Find ${z(a, b)} ${mult ? "×" : "+"} ${z(c, d)} in the form p + qi. Give p, q.`,
    input: list({ placeholder: "p, q" }),
    answer: `${res[0]}, ${res[1]}`,
    ordered: true,
    hints: [mult ? "Expand like brackets, then use i² = −1." : "Add the real parts; add the imaginary parts.", mult ? `Real: ${sn(a)}×${sn(c)} − ${sn(b)}×${sn(d)}` : `Real: ${sn(a)} + ${sn(c)}`, mult ? `Imaginary: ${sn(a)}×${sn(d)} + ${sn(b)}×${sn(c)}` : `Imaginary: ${sn(b)} + ${sn(d)}`],
    solution: [`= ${sn(res[0])} ${res[1] < 0 ? "−" : "+"} ${Math.abs(res[1])}i`],
    traps: mult ? [trap("i-squared", `${a * c + b * d}, ${a * d + b * c}`, "i² = −1, so the bd term is SUBTRACTED from the real part.")] : [],
  });
};

export default generators;
