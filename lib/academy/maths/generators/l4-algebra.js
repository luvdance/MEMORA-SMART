import { item, trap, num, frac, expr, byTier } from "./kit.js";
import { simplify, fracText, gcd } from "../rng.js";
import { sn, poly, plainPoly, br } from "./format.js";

/**
 * GENERATORS · LEVEL 4 · QUADRATIC EQUATIONS, QUADRATIC GRAPHS, VARIATION
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Contains every answer for L4-A1, L4-A2 and L4-A3.
 * ═════════════════════════════════════════════════════════════════════════
 *
 * Roots are typed as a list and marked by value, so "3/2, -4" and
 * "-4, 1.5" are both right. Irrational roots are asked to 2 decimal places
 * with a tolerance of half a unit in the last place.
 */

export const generators = {};

const roots = (extra = {}) => ({ kind: "list", placeholder: "e.g. 3, -5", ...extra });
const coords = { kind: "coordinates", placeholder: "e.g. (2, -1)" };
const r2 = (x) => Math.round(x * 100) / 100;

/* ── L4-A1.1 · Solving by factorising ───────────────────────────────── */

generators["L4-A1.1"] = (r, tier) => {
  const a = tier === "exam" ? r.int(2, 3) : 1;
  const p = r.intExcept(-9, 9, [0]);
  const q = r.intExcept(-9, 9, [0]);
  if (a > 1 && gcd(a, Math.abs(p)) !== 1) return generators["L4-A1.1"](r, "stretch");
  // (a x + p)(x + q) = 0  →  x = −p/a, x = −q
  const b = a * q + p;
  const c = p * q;
  const shown = `${poly([a, "x²"], [b, "x"], [c, ""])} = 0`;
  const rootA = fracText(...simplify(-p, a));
  return item({
    skill: "Solving a quadratic equation by factorising",
    prompt: `Solve ${shown}.\n\nGive both roots, separated by a comma.`,
    input: roots(),
    answer: [rootA, String(-q)],
    hints: ["Factorise the left-hand side.", `${poly([a, "x²"], [b, "x"], [c, ""])} = ${br(a, p)}${br(1, q)}`, "If two factors multiply to 0, one of them must be 0: set each bracket equal to 0."],
    solution: [`${br(a, p)}${br(1, q)} = 0`, `${poly([a, "x"], [p, ""])} = 0  →  x = ${sn(rootA)}`, `${poly([1, "x"], [q, ""])} = 0  →  x = ${sn(-q)}`],
    traps: [trap("signs-of-brackets", [fracText(...simplify(p, a)), String(q)], "The roots have the OPPOSITE signs to the numbers in the brackets: x + 3 = 0 gives x = −3.")],
  });
};

/* ── L4-A1.2 · Completing the square ────────────────────────────────── */

generators["L4-A1.2"] = (r, tier) => {
  const h = r.intExcept(-6, 6, [0]);
  const k = r.intExcept(-15, 12, [0]);
  // x² + 2h x + (h² + k) = (x + h)² + k
  const b = 2 * h;
  const c = h * h + k;
  if (tier === "build" || r.chance(0.5)) {
    return item({
      skill: "Writing a quadratic in completed-square form",
      prompt: `Write ${poly([1, "x²"], [b, "x"], [c, ""])} in the form (x + p)² + q. Give p and q, in that order.`,
      input: roots({ placeholder: "p, q" }),
      ordered: true,
      answer: [String(h), String(k)],
      hints: ["Halve the coefficient of x to get p.", `p = ${sn(b)} ÷ 2 = ${sn(h)}`, `(x + ${sn(h)})² = x² ${b < 0 ? "−" : "+"} ${Math.abs(b)}x + ${h * h}, so q = ${c} − ${h * h} = ${sn(k)}.`],
      solution: [`p = ${sn(b)}/2 = ${sn(h)}`, `(x ${h < 0 ? "−" : "+"} ${Math.abs(h)})² = x² ${b < 0 ? "−" : "+"} ${Math.abs(b)}x + ${h * h}`, `q = ${c} − ${h * h} = ${sn(k)}`],
      traps: [trap("did-not-halve", [String(b), String(c - b * b)], "p is HALF the coefficient of x.")],
    });
  }
  // solve (x + h)² = −k when −k > 0
  if (k >= 0) return generators["L4-A1.2"](r, "build");
  const s = Math.sqrt(-k);
  const x1 = r2(-h + s);
  const x2 = r2(-h - s);
  return item({
    skill: "Solving a quadratic by completing the square",
    prompt: `Solve ${poly([1, "x²"], [b, "x"], [c, ""])} = 0 by completing the square. Give both roots to 2 decimal places.`,
    input: roots(),
    answer: [String(x1), String(x2)],
    tolerance: 0.006,
    hints: [`Write it as (x ${h < 0 ? "−" : "+"} ${Math.abs(h)})² ${k < 0 ? "−" : "+"} ${Math.abs(k)} = 0.`, `(x ${h < 0 ? "−" : "+"} ${Math.abs(h)})² = ${-k}`, `x ${h < 0 ? "−" : "+"} ${Math.abs(h)} = ±√${-k}`],
    solution: [`(x ${h < 0 ? "−" : "+"} ${Math.abs(h)})² = ${-k}`, `x = ${sn(-h)} ± √${-k}`, `x = ${x1} or x = ${x2}`],
    traps: [trap("only-positive-root", [String(x1)], "A square root gives TWO values, ± . There are two roots.")],
  });
};

/* ── L4-A1.3 · The quadratic formula ────────────────────────────────── */

generators["L4-A1.3"] = (r, tier) => {
  let a;
  let b;
  let c;
  let disc;
  do {
    a = byTier(tier, { build: 1, stretch: r.int(1, 3), exam: r.int(2, 5) });
    b = r.intExcept(-9, 9, [0]);
    c = r.intExcept(-9, 9, [0]);
    disc = b * b - 4 * a * c;
  } while (disc <= 0 || Number.isInteger(Math.sqrt(disc)));
  const x1 = r2((-b + Math.sqrt(disc)) / (2 * a));
  const x2 = r2((-b - Math.sqrt(disc)) / (2 * a));
  return item({
    skill: "Solving with the quadratic formula",
    prompt: `Solve ${poly([a, "x²"], [b, "x"], [c, ""])} = 0 using the formula. Give both roots to 2 decimal places.`,
    input: roots(),
    answer: [String(x1), String(x2)],
    tolerance: 0.006,
    hints: ["x = (−b ± √(b² − 4ac)) / 2a", `a = ${a}, b = ${sn(b)}, c = ${sn(c)}`, `b² − 4ac = ${b * b} − ${4 * a * c} = ${disc}`],
    solution: [`b² − 4ac = ${b * b} − 4(${a})(${sn(c)}) = ${disc}`, `x = (${sn(-b)} ± √${disc}) / ${2 * a}`, `x = ${x1} or x = ${x2}`],
    traps: [trap("sign-of-b", [String(r2((b + Math.sqrt(disc)) / (2 * a))), String(r2((b - Math.sqrt(disc)) / (2 * a)))], "The formula starts with −b. With b = " + sn(b) + ", −b = " + sn(-b) + "."), trap("divided-by-a-only", [String(r2((-b + Math.sqrt(disc)) / a)), String(r2((-b - Math.sqrt(disc)) / a))], "The whole of −b ± √(b² − 4ac) is divided by 2a, not by a.")],
  });
};

/* ── L4-A1.4 · Forming an equation from roots ───────────────────────── */

generators["L4-A1.4"] = (r, tier) => {
  const fraction = tier === "exam" && r.chance(0.6);
  if (!fraction) {
    const p = r.intExcept(-9, 9, [0]);
    const q = r.intExcept(-9, 9, [0, p]);
    const answer = plainPoly([1, "x^2"], [-(p + q), "x"], [p * q, ""]);
    return item({
      skill: "Forming a quadratic equation from its roots",
      prompt: `Form the quadratic equation, in the form x² + bx + c = 0, whose roots are ${sn(p)} and ${sn(q)}.`,
      input: { kind: "expression", placeholder: "e.g. x^2 + 2x - 15 = 0", keys: ["^", "(", ")", "-", "="] },
      answer,
      exact: "expanded",
      hints: ["If the roots are p and q, the equation is (x − p)(x − q) = 0.", `(x − ${p < 0 ? `(${sn(p)})` : p})(x − ${q < 0 ? `(${sn(q)})` : q}) = ${br(1, -p)}${br(1, -q)} = 0`, "Expand the brackets."],
      solution: [`${br(1, -p)}${br(1, -q)} = 0`, `${poly([1, "x²"], [-(p + q), "x"], [p * q, ""])} = 0`],
      traps: [trap("signs-not-flipped", plainPoly([1, "x^2"], [p + q, "x"], [p * q, ""]), "A root of p gives the factor (x − p): the sign changes.")],
    });
  }
  const [n, d] = r.pick([[2, 3], [1, 2], [3, 4], [-1, 3], [5, 2], [-2, 5]]);
  const q = r.intExcept(-5, 5, [0]);
  // (d x − n)(x − q) = 0
  const A = d;
  const B = -(d * q + n);
  const C = n * q;
  return item({
    skill: "Forming a quadratic equation with a fractional root",
    prompt: `Form the quadratic equation with integer coefficients whose roots are ${fracText(n, d).replace("-", "−")} and ${sn(q)}.`,
    input: { kind: "expression", placeholder: "e.g. 3x^2 + x - 2 = 0", keys: ["^", "(", ")", "-", "="] },
    answer: plainPoly([A, "x^2"], [B, "x"], [C, ""]),
    exact: "expanded",
    hints: [`A root of ${fracText(n, d)} gives the factor (${d}x ${n < 0 ? "+" : "−"} ${Math.abs(n)}), to keep the coefficients whole.`, `(${d}x ${n < 0 ? "+" : "−"} ${Math.abs(n)})${br(1, -q)} = 0`, "Expand."],
    solution: [`(${d}x ${n < 0 ? "+" : "−"} ${Math.abs(n)})${br(1, -q)} = 0`, `${poly([A, "x²"], [B, "x"], [C, ""])} = 0`],
    traps: [],
  });
};

/* ── L4-A1.5 · Sum and product of roots ─────────────────────────────── */

generators["L4-A1.5"] = (r, tier) => {
  const a = r.int(1, 4);
  const b = r.intExcept(-9, 9, [0]);
  const c = r.intExcept(-9, 9, [0]);
  const sum = simplify(-b, a);
  const product = simplify(c, a);
  const ask = r.pick(byTier(tier, { build: ["sum", "product"], stretch: ["sum", "product", "squares"], exam: ["squares", "reciprocals"] }));
  const S = -b / a;
  const P = c / a;
  const spec = {
    sum: { q: "α + β", a: fracText(...sum), s: [`α + β = −b/a = ${sn(-b)}/${a}`], t: trap("sign", fracText(...simplify(b, a)), "α + β = −b/a: note the minus sign.") },
    product: { q: "αβ", a: fracText(...product), s: [`αβ = c/a = ${sn(c)}/${a}`], t: trap("used-b", fracText(...simplify(b, a)), "The product is c/a; the sum uses b.") },
    squares: { q: "α² + β²", a: fracText(...simplify(b * b - 2 * a * c, a * a)), s: [`α² + β² = (α + β)² − 2αβ`, `= (${fracText(...sum)})² − 2(${fracText(...product)}) = ${fracText(...simplify(b * b - 2 * a * c, a * a))}`], t: trap("forgot-2ab", fracText(...simplify(b * b, a * a)), "(α + β)² = α² + 2αβ + β², so subtract 2αβ.") },
    reciprocals: { q: "1/α + 1/β", a: fracText(...simplify(-b, c)), s: [`1/α + 1/β = (α + β)/(αβ) = (${fracText(...sum)}) ÷ (${fracText(...product)}) = ${fracText(...simplify(-b, c))}`], t: trap("upside-down", fracText(...simplify(c, -b)), "1/α + 1/β = (α + β)/αβ: the sum goes on TOP.") },
  }[ask];
  return item({
    skill: "Sum and product of roots",
    prompt: `α and β are the roots of ${poly([a, "x²"], [b, "x"], [c, ""])} = 0. Without solving, find ${spec.q}.`,
    input: frac(),
    answer: spec.a,
    hints: ["For ax² + bx + c = 0: α + β = −b/a and αβ = c/a.", `Here α + β = ${fracText(...sum)} and αβ = ${fracText(...product)}.`, spec.s[0]],
    solution: spec.s,
    traps: [spec.t],
  });
};

/* ── L4-A2 · Quadratic graphs ───────────────────────────────────────── */

function quad(r) {
  const p = r.int(-4, 4);
  const q = r.intExcept(-4, 5, [p]);
  // y = (x − p)(x − q) = x² − (p + q)x + pq
  return { p, q, b: -(p + q), c: p * q };
}

generators["L4-A2.1"] = (r, tier) => {
  const { b, c } = quad(r);
  const xs = [-2, -1, 0, 1, 2, 3];
  const ys = xs.map((x) => x * x + b * x + c);
  return item({
    skill: "A table of values for a quadratic",
    prompt: `Complete the table of values for y = ${poly([1, "x²"], [b, "x"], [c, ""])}.\n\nx:  ${xs.map(sn).join(",  ")}\n\nType the y values in order.`,
    input: { kind: "list", placeholder: "six values", ordered: true },
    ordered: true,
    answer: ys.map(String),
    hints: ["Square x FIRST: (−2)² = 4, not −4.", `x = −2: y = 4 ${b < 0 ? "+" : "−"} ${Math.abs(2 * b)} ${c < 0 ? "−" : "+"} ${Math.abs(c)}`, "The values should be symmetrical about the turning point."],
    solution: xs.map((x, i) => `x = ${sn(x)}: y = ${sn(ys[i])}`),
    traps: [trap("negative-square", xs.map((x) => -Math.abs(x) * x + b * x + c).map(String), "(−2)² is +4. A square is never negative.")].filter((t) => t.is.join() !== ys.map(String).join()),
  });
};

generators["L4-A2.2"] = (r, tier) => {
  const { p, q, b, c } = quad(r);
  const ask = r.pick(byTier(tier, { build: ["roots"], stretch: ["roots", "turning"], exam: ["turning", "min-value", "axis"] }));
  const tx = (p + q) / 2;
  const ty = tx * tx + b * tx + c;
  if (ask === "roots") {
    return item({
      skill: "Reading roots from a quadratic graph",
      prompt: `The graph of y = ${poly([1, "x²"], [b, "x"], [c, ""])} is drawn. Where does it cut the x-axis? Give both x values.`,
      input: roots(),
      answer: [String(p), String(q)],
      hints: ["The graph cuts the x-axis where y = 0.", `Solve ${poly([1, "x²"], [b, "x"], [c, ""])} = 0.`, "Factorise."],
      solution: [`${br(1, -p)}${br(1, -q)} = 0`, `x = ${sn(p)} or x = ${sn(q)}`],
      traps: [trap("y-intercept", [String(c)], "That is where it cuts the y-axis. The roots are where y = 0.")],
    });
  }
  if (ask === "axis") {
    return item({
      skill: "The axis of symmetry",
      prompt: `What is the equation of the axis of symmetry of y = ${poly([1, "x²"], [b, "x"], [c, ""])}? Type the x value.`,
      input: num(),
      answer: tx,
      hints: ["The axis of symmetry is halfway between the roots.", "Or use x = −b/(2a).", `x = ${sn(-b)}/2`],
      solution: [`x = −b/(2a) = ${sn(-b)}/2 = ${tx}`],
      traps: [trap("forgot-half", -b, "x = −b/(2a): divide by 2a, not by a.")],
    });
  }
  return item({
    skill: ask === "min-value" ? "The minimum value of a quadratic" : "The turning point of a quadratic",
    prompt: ask === "min-value" ? `What is the minimum value of y = ${poly([1, "x²"], [b, "x"], [c, ""])}?` : `Find the coordinates of the turning point of y = ${poly([1, "x²"], [b, "x"], [c, ""])}.`,
    input: ask === "min-value" ? num() : coords,
    answer: ask === "min-value" ? ty : `(${tx}, ${ty})`,
    hints: ["The turning point lies on the axis of symmetry, x = −b/(2a).", `x = ${sn(-b)}/2 = ${tx}`, `y = (${tx})² ${b < 0 ? "−" : "+"} ${Math.abs(b)}(${tx}) ${c < 0 ? "−" : "+"} ${Math.abs(c)} = ${ty}`],
    solution: [`x = ${tx}`, `y = ${ty}`, ask === "min-value" ? `Minimum value of y = ${ty}` : `Turning point (${tx}, ${ty})`],
    traps: ask === "min-value" ? [trap("gave-x", tx, "That is the x value where the minimum happens. The minimum VALUE is y.")] : [trap("swapped", `(${ty}, ${tx})`, "Give (x, y).")],
  });
};

generators["L4-A2.3"] = (r, tier) => {
  const { p, q } = quad(r);
  // Choose the meeting points p and q and the line first, then build the
  // curve so that curve − line = (x − p)(x − q).
  const m = r.intExcept(-3, 3, [0]);
  const k = r.int(-6, 6);
  const B = -(p + q) + m;
  const C = p * q + k;
  // curve y = x² + B x + C, line y = m x + k, meeting where x² + (B − m)x + (C − k) = 0 → roots p, q
  return item({
    skill: "Where a line meets a curve",
    prompt: `The curve y = ${poly([1, "x²"], [B, "x"], [C, ""])} and the line y = ${poly([m, "x"], [k, ""])} are drawn. Find the x-coordinates of the points where they meet.`,
    input: roots(),
    answer: [String(p), String(q)],
    hints: ["At the meeting points the y values are equal.", `${poly([1, "x²"], [B, "x"], [C, ""])} = ${poly([m, "x"], [k, ""])}`, `${poly([1, "x²"], [B - m, "x"], [C - k, ""])} = 0`],
    solution: [`${poly([1, "x²"], [B - m, "x"], [C - k, ""])} = 0`, `${br(1, -p)}${br(1, -q)} = 0`, `x = ${sn(p)} or x = ${sn(q)}`],
    traps: [],
  });
};

generators["L4-A2.4"] = (r, tier) => {
  const x1 = r.int(-4, 2);
  const x2 = x1 + r.int(2, 5);
  const m = r.intExcept(-6, 6, [0]);
  const y1 = r.int(-10, 10);
  const y2 = y1 + m * (x2 - x1);
  if (tier === "build" || r.chance(0.5)) {
    return item({
      skill: "The gradient from two points on a tangent",
      prompt: `A tangent drawn to a curve passes through (${sn(x1)}, ${sn(y1)}) and (${sn(x2)}, ${sn(y2)}). Find its gradient.`,
      input: num(),
      answer: m,
      hints: ["Gradient = change in y ÷ change in x (rise over run).", `Change in y = ${sn(y2)} − ${y1 < 0 ? `(${sn(y1)})` : y1} = ${sn(y2 - y1)}`, `Change in x = ${sn(x2)} − ${x1 < 0 ? `(${sn(x1)})` : x1} = ${x2 - x1}`],
      solution: [`Gradient = ${sn(y2 - y1)} ÷ ${x2 - x1} = ${sn(m)}`],
      traps: [trap("upside-down", Math.round(((x2 - x1) / (y2 - y1)) * 100) / 100, "Gradient = change in Y ÷ change in X, not the other way round.")],
    });
  }
  const a = r.int(-4, 4);
  return item({
    skill: "The gradient of y = x² at a point",
    prompt: `The tangent to y = x² at x = ${sn(a)} is drawn. Using the tangent through (${sn(a)}, ${a * a}) and (${sn(a + 1)}, ${a * a + 2 * a}), find the gradient of the curve at x = ${sn(a)}.`,
    input: num(),
    answer: 2 * a,
    hints: ["The gradient of a curve at a point is the gradient of its tangent there.", `Change in y = ${a * a + 2 * a} − ${a * a} = ${sn(2 * a)}`, "Change in x = 1."],
    solution: [`Gradient = ${sn(2 * a)} ÷ 1 = ${sn(2 * a)}`, "(For y = x² the gradient at x = a is always 2a: calculus in Month 10 proves why.)"],
    traps: [trap("gave-y", a * a, "That is the y value at the point, not the gradient.")],
  });
};

/* ── L4-A3 · Variation ──────────────────────────────────────────────── */

generators["L4-A3.1"] = (r, tier) => {
  const type = r.pick(byTier(tier, { build: ["square", "inverse"], stretch: ["square", "inverse-square", "root"], exam: ["inverse-square", "root", "cube"] }));
  const k = r.int(2, 6);
  const f = { square: (x) => k * x * x, inverse: (x) => (k * 60) / x, "inverse-square": (x) => (k * 144) / (x * x), root: (x) => k * Math.sqrt(x), cube: (x) => k * x ** 3 }[type];
  const xsPool = { square: [2, 3, 4, 5, 6], inverse: [2, 3, 4, 5, 6, 10, 12], "inverse-square": [2, 3, 4, 6, 12], root: [4, 9, 16, 25, 36, 49], cube: [1, 2, 3, 4] }[type];
  const [x1, x2] = r.sample(xsPool, 2);
  const y1 = f(x1);
  const y2 = f(x2);
  const words = { square: "y varies as the square of x", inverse: "y varies inversely as x", "inverse-square": "y varies inversely as the square of x", root: "y varies as the square root of x", cube: "y varies as the cube of x" }[type];
  const law = { square: "y = kx²", inverse: "y = k/x", "inverse-square": "y = k/x²", root: "y = k√x", cube: "y = kx³" }[type];
  return item({
    skill: "Variation with powers and roots",
    prompt: `${words}. When x = ${x1}, y = ${y1}. Find y when x = ${x2}.`,
    input: num(),
    answer: Math.round(y2 * 100) / 100,
    tolerance: 0.01,
    hints: [`Write the law: ${law}.`, `Find k from x = ${x1}, y = ${y1}.`, `Then put x = ${x2} into the law with that k.`],
    solution: [law, `k = ${type === "inverse" ? `${y1} × ${x1}` : type === "inverse-square" ? `${y1} × ${x1}²` : type === "root" ? `${y1} ÷ √${x1}` : `${y1} ÷ ${x1}${type === "cube" ? "³" : "²"}`} = ${type === "inverse" ? k * 60 : type === "inverse-square" ? k * 144 : k}`, `y = ${Math.round(y2 * 100) / 100}`],
    traps: [trap("used-direct", Math.round(((y1 / x1) * x2) * 100) / 100, `The law is ${law}, not y = kx. Use the power or root the question gives.`)],
  });
};

generators["L4-A3.2"] = (r, tier) => {
  if (r.chance(0.5)) {
    // joint: z ∝ x y  or  z ∝ x / y
    const k = r.int(2, 6);
    const inverseY = tier !== "build" && r.chance(0.5);
    const [x1, y1, x2, y2] = inverseY ? [r.int(2, 6), r.pick([2, 3, 4]), r.int(2, 9), r.pick([2, 3, 6])] : [r.int(2, 6), r.int(2, 6), r.int(2, 9), r.int(2, 9)];
    const z = (x, y) => (inverseY ? (k * 12 * x) / y : k * x * y);
    return item({
      skill: inverseY ? "Joint variation: z ∝ x/y" : "Joint variation: z ∝ xy",
      prompt: `z varies directly as x and ${inverseY ? "inversely" : "directly"} as y. When x = ${x1} and y = ${y1}, z = ${z(x1, y1)}. Find z when x = ${x2} and y = ${y2}.`,
      input: num(),
      answer: Math.round(z(x2, y2) * 100) / 100,
      tolerance: 0.01,
      hints: [`z = k${inverseY ? "x/y" : "xy"}`, `k = ${z(x1, y1)} ${inverseY ? `× ${y1} ÷ ${x1}` : `÷ (${x1} × ${y1})`} = ${inverseY ? k * 12 : k}`, `z = ${inverseY ? k * 12 : k} × ${x2}${inverseY ? ` ÷ ${y2}` : ` × ${y2}`}`],
      solution: [`z = k${inverseY ? "x/y" : "xy"}, k = ${inverseY ? k * 12 : k}`, `z = ${Math.round(z(x2, y2) * 100) / 100}`],
      traps: [],
    });
  }
  // partial: y = a + bx through two points
  const a = r.int(500, 3000);
  const b = r.int(20, 200);
  const [x1, x2, x3] = r.sample([10, 20, 30, 40, 50, 60], 3);
  return item({
    skill: "Partial variation: y = a + bx",
    prompt: `The cost C of a party is partly fixed and partly varies as the number of guests n. For ${x1} guests it costs ₦${(a + b * x1).toLocaleString("en-US")}; for ${x2} guests ₦${(a + b * x2).toLocaleString("en-US")}. Find the cost for ${x3} guests.`,
    input: num(),
    answer: a + b * x3,
    hints: ["C = a + bn, where a is the fixed part.", `Subtract the two equations: ${b * (x2 - x1)} = ${x2 - x1}b, so b = ${b}.`, `Then a = ${a + b * x1} − ${b} × ${x1} = ${a}.`],
    solution: [`a + ${x1}b = ${a + b * x1}`, `a + ${x2}b = ${a + b * x2}`, `b = ${b}, a = ${a}`, `C = ${a} + ${b} × ${x3} = ${a + b * x3}`],
    traps: [trap("direct-only", Math.round(((a + b * x1) / x1) * x3), "This is PARTIAL variation: there is a fixed part. C is not simply proportional to n.")],
  });
};

generators["L4-A3.3"] = (r, tier) => {
  const [desc, lawText, f, unit, xs, ask] = r.pick([
    ["The distance d a stone falls varies as the square of the time t. It falls 20 m in 2 s.", "d = kt², k = 5", (t) => 5 * t * t, "m", [3, 4, 5], (x) => `How far does it fall in ${x} s?`],
    ["The time t to do a job varies inversely as the number of workers n. 6 workers take 10 days.", "t = k/n, k = 60", (n) => 60 / n, "days", [4, 5, 12], (x) => `How long do ${x} workers take?`],
    ["The volume V of a gas varies inversely as the pressure P. V = 300 cm³ when P = 2 atmospheres.", "V = k/P, k = 600", (pp) => 600 / pp, "cm³", [3, 4, 5], (x) => `Find V when P = ${x} atmospheres.`],
    ["The area A of a circle varies as the square of its radius r. A = 12.5 cm² when r = 2 cm.", "A = kr², k = 3.125", (rr) => 3.125 * rr * rr, "cm²", [4, 6, 8], (x) => `Find A when r = ${x} cm.`],
  ]);
  const x = r.pick(xs);
  const answer = Math.round(f(x) * 100) / 100;
  return item({
    skill: "A variation problem in context",
    prompt: `${desc} ${ask(x)}`,
    input: num({ unit }),
    answer,
    tolerance: 0.01,
    hints: ["Write the law with a constant k.", "Use the pair of values given to find k.", lawText],
    solution: [lawText, `Answer: ${answer} ${unit}`],
    traps: [],
  });
};

export default generators;
