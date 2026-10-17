import { item, trap, num, frac, list, expr, choice, byTier } from "./kit.js";
import { simplify, fracText } from "../rng.js";
import { sn, poly, plainPoly } from "./format.js";

/**
 * GENERATORS · LEVEL 6 · POLYNOMIALS, COUNTING, DIFFERENTIATION, INTEGRATION
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Contains every answer for L6-A1, L6-S1, L6-C2 and L6-C3.
 * ═════════════════════════════════════════════════════════════════════════
 *
 * Integration items are built BACKWARDS: the answer F(x) is chosen with whole
 * coefficients and the question asks for ∫F'(x) dx, so no student ever has
 * to type x³/3 to be right. Indefinite integrals are marked with
 * exact: "plus-c", which requires the constant.
 */

export const generators = {};

const F = (n, d) => fracText(...simplify(n, d));
const fact = (n) => (n <= 1 ? 1 : n * fact(n - 1));
const nPr = (n, k) => fact(n) / fact(n - k);
const nCr = (n, k) => nPr(n, k) / fact(k);
/** Cubic display from coefficients [a3, a2, a1, a0]. */
const cubic = ([a, b, c, d]) => poly([a, "x³"], [b, "x²"], [c, "x"], [d, ""]);
const pCubic = ([a, b, c, d]) => plainPoly([a, "x³"], [b, "x²"], [c, "x"], [d, ""]);
const at = ([a, b, c, d], x) => a * x ** 3 + b * x ** 2 + c * x + d;
const expandRoots = (p, q, s) => [1, -(p + q + s), p * q + q * s + p * s, -p * q * s];
const brk = (r) => (r === 0 ? "x" : `(x ${r > 0 ? "−" : "+"} ${Math.abs(r)})`);

/* ── L6-A1 · Polynomials ────────────────────────────────────────────── */

generators["L6-A1.1"] = (r, tier) => {
  const a = r.intExcept(-5, 5, [0]);
  const p = r.int(-5, 5);
  const q = r.intExcept(-6, 6, [0]);
  const prod = [1, p - a, q - a * p, -a * q];
  if (tier === "build" || r.chance(0.4)) {
    return item({
      skill: "Multiplying polynomials",
      prompt: `Expand ${brk(a)}(${poly([1, "x²"], [p, "x"], [q, ""])}).`,
      input: expr({ placeholder: "e.g. x^3 - 2x^2 + 5" }),
      answer: pCubic(prod),
      exact: "expanded",
      hints: ["Multiply EACH term of the first bracket by EACH term of the second.", `x × (${poly([1, "x²"], [p, "x"], [q, ""])}) = ${poly([1, "x³"], [p, "x²"], [q, "x"])}`, `${sn(-a)} × (${poly([1, "x²"], [p, "x"], [q, ""])}) = ${poly([-a, "x²"], [-a * p, "x"], [-a * q, ""])}; collect like terms.`],
      solution: [`= ${cubic(prod)}`],
      traps: [trap("ends-only", plainPoly([1, "x³"], [-a * q, ""]), "Every pair of terms must be multiplied, not just the first and last.")],
    });
  }
  return item({
    skill: "Dividing a polynomial",
    prompt: `Divide ${cubic(prod)} by ${brk(a)}. Give the quotient.`,
    input: expr({ placeholder: "e.g. x^2 + 3x - 4" }),
    answer: plainPoly([1, "x²"], [p, "x"], [q, ""]),
    hints: ["Long division: divide the leading term x³ by x to get x², multiply back, subtract, bring down.", `First term x²; x²${brk(a)} = ${poly([1, "x³"], [-a, "x²"])}.`, `Continue: the next term is ${sn(p)}x.`],
    solution: [`${cubic(prod)} = ${brk(a)}(${poly([1, "x²"], [p, "x"], [q, ""])})`],
    traps: [],
  });
};

generators["L6-A1.2"] = (r, tier) => {
  const co = [r.int(1, 3), r.int(-5, 5), r.int(-6, 6), r.int(-9, 9)];
  const a = r.intExcept(-3, 3, [0]);
  if (tier === "exam" && r.chance(0.5)) {
    const val = co[0] / 8 + co[1] / 4 + co[2] / 2 + co[3];
    return item({
      skill: "Remainder on dividing by (2x − 1)",
      prompt: `Find the remainder when f(x) = ${cubic(co)} is divided by (2x − 1).`,
      input: frac(),
      answer: F(Math.round(val * 8), 8),
      hints: ["Remainder theorem: the remainder on dividing by (ax − b) is f(b/a).", "2x − 1 = 0 when x = 1/2.", `f(1/2) = ${co[0]}/8 + ${sn(co[1])}/4 + ${sn(co[2])}/2 + ${sn(co[3])}`],
      solution: [`f(1/2) = ${F(Math.round(val * 8), 8)}`],
      traps: [trap("used-1", at(co, 1), "The root of 2x − 1 is x = 1/2, not 1."), trap("used-minus-half", F(Math.round(at(co, -0.5) * 8), 8), "Set 2x − 1 = 0: x = +1/2.")],
    });
  }
  return item({
    skill: "The remainder theorem",
    prompt: `Find the remainder when f(x) = ${cubic(co)} is divided by ${brk(a)}.`,
    input: num(),
    answer: at(co, a),
    hints: ["The remainder on dividing f(x) by (x − a) is f(a).", `${brk(a)} = 0 when x = ${sn(a)}.`, `f(${sn(a)}) = ${co[0]}(${sn(a)})³ + ${sn(co[1])}(${sn(a)})² + ${sn(co[2])}(${sn(a)}) + ${sn(co[3])}`],
    solution: [`f(${sn(a)}) = ${sn(at(co, a))}`],
    traps: [trap("wrong-sign", at(co, -a), `Set the divisor to zero: x = ${sn(a)}, not ${sn(-a)}.`)],
  });
};

generators["L6-A1.3"] = (r, tier) => {
  const [p, q, s] = r.shuffle([-4, -3, -2, -1, 1, 2, 3, 4, 5]).slice(0, 3);
  if (tier === "exam" && r.chance(0.5)) {
    const a = r.intExcept(-3, 3, [0]);
    const k = r.int(-5, 5);
    const c = r.int(-8, 8);
    const d = -(a ** 3 + k * a * a + c * a);
    return item({
      skill: "Finding an unknown coefficient",
      prompt: `${brk(a)} is a factor of x³ + kx² ${c < 0 ? "−" : "+"} ${Math.abs(c)}x ${d < 0 ? "−" : "+"} ${Math.abs(d)}. Find k.`,
      input: num(),
      answer: k,
      hints: [`Factor theorem: f(${sn(a)}) = 0.`, `(${sn(a)})³ + k(${sn(a)})² + ${sn(c)}(${sn(a)}) + ${sn(d)} = 0`, `${sn(a ** 3 + c * a + d)} + ${a * a}k = 0`],
      solution: [`${a * a}k = ${sn(-(a ** 3 + c * a + d))}`, `k = ${sn(k)}`],
      traps: [trap("wrong-root", F(-((-a) ** 3 + c * -a + d), a * a), `${brk(a)} = 0 when x = ${sn(a)}.`)],
    });
  }
  const co = expandRoots(p, q, s);
  return item({
    skill: "Factorising a cubic",
    prompt: `${brk(p)} is a factor of f(x) = ${cubic(co)}. Find the other two roots of f(x) = 0.`,
    input: list({ placeholder: "e.g. 2, -3" }),
    answer: `${q}, ${s}`,
    hints: [`Divide f(x) by ${brk(p)} to get a quadratic.`, `The quadratic is ${poly([1, "x²"], [-(q + s), "x"], [q * s, ""])}.`, "Factorise it and set each factor to zero."],
    solution: [`f(x) = ${brk(p)}${brk(q)}${brk(s)}`, `Other roots: ${sn(q)} and ${sn(s)}`],
    traps: [trap("signs", `${-q}, ${-s}`, "A factor (x − 3) gives the root +3. Change the sign from the bracket.")],
  });
};

generators["L6-A1.4"] = (r, tier) => {
  const [p, q, s] = r.shuffle([-4, -3, -2, -1, 1, 2, 3, 4]).slice(0, 3);
  const lead = tier === "build" ? 1 : r.pick([1, -1, 2]);
  const kind = r.pick(byTier(tier, { build: ["roots", "y"], stretch: ["roots", "y", "end"], exam: ["y", "end", "roots"] }));
  const eq = `y = ${lead === 1 ? "" : lead === -1 ? "−" : lead}${brk(p)}${brk(q)}${brk(s)}`;
  if (kind === "roots") {
    return item({
      skill: "Where a cubic crosses the x-axis",
      prompt: `Where does ${eq} cross the x-axis? List the x-values.`,
      input: list({ placeholder: "e.g. -2, 1, 3" }),
      answer: `${p}, ${q}, ${s}`,
      hints: ["The curve crosses the x-axis where y = 0.", "A product is zero when one of its factors is zero.", "Each bracket (x − a) gives x = a."],
      solution: [`x = ${sn(p)}, ${sn(q)}, ${sn(s)}`],
      traps: [trap("signs", `${-p}, ${-q}, ${-s}`, "(x − 3) = 0 gives x = +3. Change the sign.")],
    });
  }
  if (kind === "y") {
    const y0 = lead * -p * -q * -s;
    return item({
      skill: "Where a cubic crosses the y-axis",
      prompt: `Where does ${eq} cross the y-axis? Give the y-value.`,
      input: num(),
      answer: y0,
      hints: ["The y-axis is x = 0.", "Put x = 0 into every bracket.", `${lead === 1 ? "" : `${lead} × `}(${sn(-p)})(${sn(-q)})(${sn(-s)})`],
      solution: [`y = ${sn(y0)}`],
      traps: [trap("sign", -y0, "Multiply the signs carefully: three negatives make a negative.")],
    });
  }
  return item({
    skill: "The shape of a cubic",
    prompt: `For ${eq}, what happens to y as x becomes very large and positive?`,
    input: choice(["y → +∞", "y → −∞"]),
    answer: lead > 0 ? "y → +∞" : "y → −∞",
    hints: ["For large x, the x³ term dominates.", `The coefficient of x³ is ${sn(lead)}.`, "Positive leading coefficient: rises to the right. Negative: falls to the right."],
    solution: [`Leading coefficient ${sn(lead)}: ${lead > 0 ? "y → +∞" : "y → −∞"}`],
    traps: [],
  });
};

/* ── L6-S1 · Permutations and combinations ──────────────────────────── */

generators["L6-S1.1"] = (r, tier) => {
  const kind = r.pick(byTier(tier, { build: ["line", "npr"], stretch: ["line", "circle", "npr"], exam: ["circle", "npr", "together"] }));
  const n = r.int(4, 7);
  if (kind === "line") {
    return item({
      skill: "Arrangements in a line",
      prompt: `In how many ways can ${n} different books be arranged on a shelf?`,
      input: num(),
      answer: fact(n),
      hints: [`${n} choices for the first place, ${n - 1} for the second, and so on.`, `${n}! = ${Array.from({ length: n }, (_, i) => n - i).join(" × ")}`, "Multiply."],
      solution: [`${n}! = ${fact(n)}`],
      traps: [trap("added", (n * (n + 1)) / 2, "MULTIPLY the choices for each place, do not add them.")],
    });
  }
  if (kind === "circle") {
    return item({
      skill: "Arrangements in a circle",
      prompt: `In how many ways can ${n} people sit around a round table?`,
      input: num(),
      answer: fact(n - 1),
      hints: ["Around a circle, rotating everyone one seat gives the same arrangement.", "Fix one person, then arrange the rest.", `(${n} − 1)!`],
      solution: [`(${n} − 1)! = ${fact(n - 1)}`],
      traps: [trap("line", fact(n), "That is a line. In a circle, fix one person first: (n − 1)!")],
    });
  }
  if (kind === "together") {
    return item({
      skill: "Two people who must sit together",
      prompt: `In how many ways can ${n} people stand in a line if two particular people must stand together?`,
      input: num(),
      answer: 2 * fact(n - 1),
      hints: ["Tie the two together as one block: now there are n − 1 items.", `${n - 1}! arrangements of the items.`, "The two inside the block can swap: × 2."],
      solution: [`${n - 1}! × 2 = ${2 * fact(n - 1)}`],
      traps: [trap("no-swap", fact(n - 1), "The pair can stand in 2 orders inside their block: × 2.")],
    });
  }
  const k = r.int(2, Math.min(4, n - 1));
  return item({
    skill: "Arranging some of the objects",
    prompt: `In how many ways can a president, a secretary${k > 2 ? ", a treasurer" : ""}${k > 3 ? " and a PRO" : ""} be chosen from ${n + 2} candidates?`,
    input: num(),
    answer: nPr(n + 2, k),
    hints: ["The posts are different, so ORDER matters: an arrangement.", `ⁿPᵣ = n!/(n − r)! with n = ${n + 2}, r = ${k}.`, Array.from({ length: k }, (_, i) => n + 2 - i).join(" × ")],
    solution: [`${n + 2}P${k} = ${nPr(n + 2, k)}`],
    traps: [trap("combination", nCr(n + 2, k), "The posts are different, so order matters: use ⁿPᵣ, not ⁿCᵣ.")],
  });
};

const WORDS = [
  ["BANANA", 60], ["LETTER", 180], ["COFFEE", 180], ["ADDRESS", 420], ["NIGERIA", 2520],
  ["ABUJA", 60], ["STATISTICS", 50400], ["MISSISSIPPI", 34650], ["SUCCESS", 420], ["EFFECT", 180],
];

generators["L6-S1.2"] = (r, tier) => {
  const [w, ans] = r.pick(byTier(tier, { build: WORDS.slice(0, 6), stretch: WORDS, exam: WORDS.slice(3) }));
  const counts = {};
  for (const c of w) counts[c] = (counts[c] || 0) + 1;
  const reps = Object.entries(counts).filter(([, k]) => k > 1);
  return item({
    skill: "Arrangements with repeated letters",
    prompt: `How many different arrangements are there of the letters of ${w}?`,
    input: num(),
    answer: ans,
    hints: [`${w.length} letters, so start with ${w.length}!.`, `Repeated: ${reps.map(([c, k]) => `${c} × ${k}`).join(", ")}.`, `Divide by ${reps.map(([, k]) => `${k}!`).join(" × ")}.`],
    solution: [`${w.length}! ÷ (${reps.map(([, k]) => `${k}!`).join(" × ")}) = ${ans}`],
    traps: [trap("no-divide", fact(w.length), "Swapping two identical letters gives the same word. Divide by the factorial of each repeat.")],
  });
};

generators["L6-S1.3"] = (r, tier) => {
  if (tier === "exam" && r.chance(0.6)) {
    const men = r.int(4, 8);
    const women = r.int(3, 7);
    const m = r.int(1, 3);
    const w = r.int(1, 3);
    return item({
      skill: "Selections from two groups",
      prompt: `A committee of ${m} men and ${w} women is chosen from ${men} men and ${women} women. In how many ways can it be done?`,
      input: num(),
      answer: nCr(men, m) * nCr(women, w),
      hints: [`Choose the men: ${men}C${m} = ${nCr(men, m)}.`, `Choose the women: ${women}C${w} = ${nCr(women, w)}.`, "Both must happen: multiply."],
      solution: [`${nCr(men, m)} × ${nCr(women, w)} = ${nCr(men, m) * nCr(women, w)}`],
      traps: [trap("added", nCr(men, m) + nCr(women, w), "Both choices are made together: MULTIPLY."), trap("pooled", nCr(men + women, m + w), "That ignores how many must be men and how many women.")],
    });
  }
  const n = r.int(5, 12);
  const k = r.int(2, Math.min(5, n - 2));
  return item({
    skill: "Selections with nCr",
    prompt: `In how many ways can a team of ${k} be chosen from ${n} players?`,
    input: num(),
    answer: nCr(n, k),
    hints: ["A team is a selection: order does not matter.", `ⁿCᵣ = n!/(r!(n − r)!) with n = ${n}, r = ${k}.`, `${nPr(n, k)} ÷ ${k}!`],
    solution: [`${n}C${k} = ${nCr(n, k)}`],
    traps: [trap("permutation", nPr(n, k), "That counts different ORDERS as different teams. Divide by r!.")],
  });
};

/* ── L6-C2 · Differentiation ────────────────────────────────────────── */

generators["L6-C2.1"] = (r, tier) => {
  const a = r.intExcept(-5, 6, [0]);
  const b = r.intExcept(-5, 6, [a]);
  const exam = tier !== "build";
  return item({
    skill: "Evaluating a limit by factorising",
    prompt: exam
      ? `Evaluate the limit as x → ${sn(a)} of (${poly([1, "x²"], [-(a + b), "x"], [a * b, ""])}) / ${brk(a)}.`
      : `Evaluate the limit as x → ${sn(a)} of (x² − ${a * a}) / ${brk(a)}.`,
    input: num(),
    answer: exam ? a - b : 2 * a,
    hints: ["Substituting directly gives 0/0, which has no meaning. Factorise first.", exam ? `The top is ${brk(a)}${brk(b)}.` : `x² − ${a * a} = ${brk(a)}${brk(-a)}.`, "Cancel the common bracket, then substitute."],
    solution: exam ? [`= ${brk(b)} after cancelling`, `= ${sn(a)} ${b < 0 ? "+" : "−"} ${Math.abs(b)} = ${sn(a - b)}`] : [`= ${brk(-a)} after cancelling`, `= ${sn(a)} + ${sn(a)} = ${sn(2 * a)}`],
    traps: [trap("zero", 0, "0/0 is not 0. Factorise and cancel first.")],
  });
};

generators["L6-C2.2"] = (r, tier) => {
  const a = r.intExcept(-4, 5, [0]);
  const b = r.int(-6, 6);
  const c = r.int(-9, 9);
  return item({
    skill: "Differentiating from first principles",
    prompt: `From first principles, find dy/dx for y = ${poly([a, "x²"], [b, "x"], [c, ""])}.`,
    input: expr({ placeholder: "e.g. 6x - 1" }),
    answer: plainPoly([2 * a, "x"], [b, ""]),
    hints: ["dy/dx = limit as h → 0 of [f(x + h) − f(x)] / h.", `f(x + h) − f(x) = ${poly([2 * a, "xh"], [a, "h²"], [b, "h"])}`, `Divide by h: ${poly([2 * a, "x"], [a, "h"], [b, ""])}. Now let h → 0.`],
    solution: [`[f(x + h) − f(x)]/h = ${poly([2 * a, "x"], [a, "h"], [b, ""])}`, `As h → 0: dy/dx = ${poly([2 * a, "x"], [b, ""])}`],
    traps: [trap("kept-constant", plainPoly([2 * a, "x"], [b, ""], [c, ""]), "The constant cancels in f(x + h) − f(x). Its derivative is 0.")].filter(() => c !== 0),
  });
};

generators["L6-C2.3"] = (r, tier) => {
  const co = [r.int(-3, 4), r.int(-5, 5), r.int(-8, 8), r.int(-9, 9)];
  if (co[0] === 0) co[0] = 2;
  const d = [3 * co[0], 2 * co[1], co[2]];
  if (tier === "exam" && r.chance(0.6)) {
    const x = r.int(-3, 3);
    const g = d[0] * x * x + d[1] * x + d[2];
    return item({
      skill: "The gradient of a curve at a point",
      prompt: `Find the gradient of y = ${cubic(co)} at the point where x = ${sn(x)}.`,
      input: num(),
      answer: g,
      hints: ["Differentiate, then substitute.", `dy/dx = ${poly([d[0], "x²"], [d[1], "x"], [d[2], ""])}`, `At x = ${sn(x)}: ${d[0]}(${sn(x)})² + ${sn(d[1])}(${sn(x)}) + ${sn(d[2])}`],
      solution: [`dy/dx = ${poly([d[0], "x²"], [d[1], "x"], [d[2], ""])}`, `= ${sn(g)} at x = ${sn(x)}`],
      traps: [trap("y-value", at(co, x), "That is the y-value. The gradient is dy/dx at that x.")].filter((t) => t.is !== g),
    });
  }
  return item({
    skill: "The power rule",
    prompt: `Differentiate y = ${cubic(co)}.`,
    input: expr({ placeholder: "e.g. 6x^2 - 4x + 1" }),
    answer: plainPoly([d[0], "x²"], [d[1], "x"], [d[2], ""]),
    hints: ["d/dx (axⁿ) = naxⁿ⁻¹: bring the power down, reduce it by one.", "A constant differentiates to 0.", `x³ → 3x², x² → 2x, x → 1`],
    solution: [`dy/dx = ${poly([d[0], "x²"], [d[1], "x"], [d[2], ""])}`],
    traps: [trap("power-not-reduced", plainPoly([d[0], "x³"], [d[1], "x²"], [d[2], "x"]), "Bring the power down AND reduce it by one.")],
  });
};

generators["L6-C2.4"] = (r, tier) => {
  const k = r.int(2, 7);
  const f = r.pick([
    { q: `${k} sin x`, a: `${k} cos x`, opts: [`${k} cos x`, `−${k} cos x`, `${k} sin x`, `−${k} sin x`] },
    { q: `${k} cos x`, a: `−${k} sin x`, opts: [`−${k} sin x`, `${k} sin x`, `${k} cos x`, `−${k} cos x`] },
    { q: `sin x + cos x`, a: `cos x − sin x`, opts: [`cos x − sin x`, `cos x + sin x`, `sin x − cos x`, `−cos x − sin x`] },
    { q: `tan x`, a: `sec²x`, opts: [`sec²x`, `cot x`, `−sec²x`, `cos²x`] },
    { q: `sin ${k}x`, a: `${k} cos ${k}x`, opts: [`${k} cos ${k}x`, `cos ${k}x`, `−${k} cos ${k}x`, `${k} sin ${k}x`] },
  ]);
  return item({
    skill: "Differentiating trigonometric functions",
    prompt: `Differentiate y = ${f.q}.`,
    input: choice(r.shuffle(f.opts)),
    answer: f.a,
    hints: ["d/dx sin x = cos x.", "d/dx cos x = −sin x (the minus belongs to cos).", "d/dx tan x = sec²x; for sin kx, multiply by k."],
    solution: [`dy/dx = ${f.a}`],
    traps: [],
  });
};

generators["L6-C2.5"] = (r, tier) => {
  const p = r.int(1, 6);
  const q = r.int(1, 12);
  const T = r.int(1, 5);
  const v = 3 * T * T - 2 * p * T + q;
  const acc = 6 * T - 2 * p;
  const askAcc = tier !== "build" && r.chance(0.5);
  return item({
    skill: askAcc ? "Acceleration from displacement" : "Velocity from displacement",
    prompt: `A particle moves so that its displacement after t seconds is s = ${poly([1, "t³"], [-p, "t²"], [q, "t"])} metres. Find its ${askAcc ? "acceleration" : "velocity"} when t = ${T}.`,
    input: num({ unit: askAcc ? "m/s²" : "m/s" }),
    answer: askAcc ? acc : v,
    hints: ["Velocity v = ds/dt.", askAcc ? "Acceleration a = dv/dt: differentiate twice." : `v = ${poly([3, "t²"], [-2 * p, "t"], [q, ""])}`, askAcc ? `a = ${poly([6, "t"], [-2 * p, ""])}` : `Substitute t = ${T}.`],
    solution: askAcc ? [`v = ${poly([3, "t²"], [-2 * p, "t"], [q, ""])}`, `a = ${poly([6, "t"], [-2 * p, ""])} = ${sn(acc)} m/s²`] : [`v = ${poly([3, "t²"], [-2 * p, "t"], [q, ""])} = ${sn(v)} m/s`],
    traps: [trap("displacement", T ** 3 - p * T * T + q * T, "That is the displacement s. Differentiate to get velocity."), askAcc ? trap("velocity", v, "That is the velocity. Differentiate again for acceleration.") : null].filter(Boolean),
  });
};

generators["L6-C2.6"] = (r, tier) => {
  const kind = r.pick(byTier(tier, { build: ["quadratic"], stretch: ["quadratic", "cubic"], exam: ["cubic", "optimise"] }));
  if (kind === "quadratic") {
    const a = r.pick([1, 2, 3, -1, -2]);
    const h = r.int(-4, 4);
    const k = r.int(-9, 9);
    const max = a < 0;
    return item({
      skill: max ? "The maximum value of a quadratic" : "The minimum value of a quadratic",
      prompt: `Find the ${max ? "maximum" : "minimum"} value of y = ${poly([a, "x²"], [-2 * a * h, "x"], [a * h * h + k, ""])}.`,
      input: num(),
      answer: k,
      hints: ["At a turning point, dy/dx = 0.", `dy/dx = ${poly([2 * a, "x"], [-2 * a * h, ""])} = 0 → x = ${sn(h)}`, `Substitute x = ${sn(h)} into y.`],
      solution: [`x = ${sn(h)}`, `y = ${sn(k)}`],
      traps: [trap("gave-x", h, "That is the x-value of the turning point. The question asks for y.")].filter(() => h !== k),
    });
  }
  if (kind === "cubic") {
    const h = r.int(1, 3);
    const c = r.int(-5, 5);
    const maxY = 2 * h ** 3 + c;
    return item({
      skill: "The maximum point of a cubic",
      prompt: `Find the maximum value of y = ${poly([1, "x³"], [-3 * h * h, "x"], [c, ""])}.`,
      input: num(),
      answer: maxY,
      hints: [`dy/dx = 3x² − ${3 * h * h} = 0 → x = ±${h}.`, `d²y/dx² = 6x: negative at x = −${h}, so that is the maximum.`, `y at x = −${h}`],
      solution: [`Turning points x = ±${h}`, `Maximum at x = −${h}: y = ${sn(maxY)}`],
      traps: [trap("minimum", -2 * h ** 3 + c, "That is the MINIMUM, at x = +h. d²y/dx² < 0 marks the maximum.")],
    });
  }
  const L = 4 * r.int(5, 30);
  return item({
    skill: "Optimisation",
    prompt: `A farmer has ${L} m of fencing to enclose a rectangle against a straight wall (the wall forms one side). Find the largest area possible.`,
    input: num({ unit: "m²" }),
    answer: (L * L) / 8,
    hints: [`Let the two sides touching the wall be x. The third side is ${L} − 2x.`, `A = x(${L} − 2x) = ${L}x − 2x². dA/dx = ${L} − 4x = 0.`, `x = ${L / 4}`],
    solution: [`x = ${L / 4} m, other side ${L / 2} m`, `A = ${(L * L) / 8} m²`],
    traps: [trap("square", (L / 4) ** 2, "That is a square with all four sides fenced. Only three sides need fencing here.")],
  });
};

/* ── L6-C3 · Integration ────────────────────────────────────────────── */

generators["L6-C3.1"] = (r, tier) => {
  const A = [r.intExcept(-3, 3, [0]), r.int(-4, 4), r.int(-7, 7)];
  const integrand = [3 * A[0], 2 * A[1], A[2]];
  return item({
    skill: "Integrating a polynomial",
    prompt: `Find ∫ (${poly([integrand[0], "x²"], [integrand[1], "x"], [integrand[2], ""])}) dx.`,
    input: expr({ placeholder: "e.g. 2x^3 - x^2 + 5x + c" }),
    answer: `${plainPoly([A[0], "x³"], [A[1], "x²"], [A[2], "x"])} + c`,
    exact: "plus-c",
    hints: ["∫ xⁿ dx = xⁿ⁺¹/(n + 1): raise the power by one, then divide by the new power.", `∫ ${integrand[0]}x² dx = ${integrand[0]}x³/3 = ${poly([A[0], "x³"])}`, "Every indefinite integral ends + c."],
    solution: [`= ${poly([A[0], "x³"], [A[1], "x²"], [A[2], "x"])} + c`],
    traps: [trap("differentiated", `${plainPoly([2 * integrand[0], "x"], [integrand[1], ""])} + c`, "That differentiates. Integration raises the power.")],
  });
};

generators["L6-C3.2"] = (r, tier) => {
  const A = [r.int(-2, 2), r.int(-3, 3), r.int(-6, 6)];
  if (A.every((x) => x === 0)) A[2] = 3;
  const Fx = (x) => A[0] * x ** 3 + A[1] * x ** 2 + A[2] * x;
  const a = r.int(-2, 1);
  const b = a + r.int(1, 3);
  const integrand = [3 * A[0], 2 * A[1], A[2]];
  return item({
    skill: "Definite integrals",
    prompt: `Evaluate ∫ from ${sn(a)} to ${sn(b)} of (${poly([integrand[0], "x²"], [integrand[1], "x"], [integrand[2], ""])}) dx.`,
    input: num(),
    answer: Fx(b) - Fx(a),
    hints: [`Integrate: F(x) = ${poly([A[0], "x³"], [A[1], "x²"], [A[2], "x"])}. No + c needed: it cancels.`, `F(${sn(b)}) = ${sn(Fx(b))}, F(${sn(a)}) = ${sn(Fx(a))}`, "Top limit minus bottom limit."],
    solution: [`[${poly([A[0], "x³"], [A[1], "x²"], [A[2], "x"])}] from ${sn(a)} to ${sn(b)} = ${sn(Fx(b))} − ${sn(Fx(a))} = ${sn(Fx(b) - Fx(a))}`],
    traps: [trap("reversed", Fx(a) - Fx(b), "It is F(top) − F(bottom).")],
  });
};

generators["L6-C3.3"] = (r, tier) => {
  const p = r.int(-4, 2);
  const q = p + r.int(1, 5);
  const w = q - p;
  return item({
    skill: "Area between a curve and the x-axis",
    prompt: `Find the area enclosed by the curve y = ${poly([1, "x²"], [-(p + q), "x"], [p * q, ""])} and the x-axis.`,
    input: frac(),
    answer: F(w ** 3, 6),
    hints: [`The curve crosses the x-axis at x = ${sn(p)} and x = ${sn(q)}: those are the limits.`, "Between the roots the curve is BELOW the axis, so the integral comes out negative.", "Area is the size: drop the minus sign."],
    solution: [`∫ from ${sn(p)} to ${sn(q)} = −${F(w ** 3, 6)}`, `Area = ${F(w ** 3, 6)} square units`],
    traps: [trap("negative", F(-(w ** 3), 6), "An area cannot be negative. The curve is below the axis; take the size.")],
  });
};

generators["L6-C3.4"] = (r, tier) => {
  const k = r.int(2, 6);
  const f = r.pick([
    { q: `∫ ${k} cos x dx`, a: `${k} sin x + c`, opts: [`${k} sin x + c`, `−${k} sin x + c`, `${k} cos x + c`, `−${k} cos x + c`] },
    { q: `∫ ${k} sin x dx`, a: `−${k} cos x + c`, opts: [`−${k} cos x + c`, `${k} cos x + c`, `${k} sin x + c`, `−${k} sin x + c`] },
    { q: `∫ from 0 to π/2 of cos x dx`, a: "1", opts: ["1", "0", "−1", "π/2"] },
    { q: `∫ from 0 to π of sin x dx`, a: "2", opts: ["2", "0", "1", "−2"] },
  ]);
  return item({
    skill: "Integrating sine and cosine",
    prompt: `Find ${f.q}.`,
    input: choice(r.shuffle(f.opts)),
    answer: f.a,
    hints: ["∫ cos x dx = sin x + c.", "∫ sin x dx = −cos x + c (the minus moves to the answer).", "Check by differentiating your answer."],
    solution: [`${f.q} = ${f.a}`],
    traps: [],
  });
};

export default generators;
