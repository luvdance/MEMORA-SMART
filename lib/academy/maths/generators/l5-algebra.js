import { item, trap, num, expr, byTier } from "./kit.js";
import { simplify, fracText } from "../rng.js";
import { sn, poly, plainPoly, br, pbr } from "./format.js";

/**
 * GENERATORS · LEVEL 5 · SIMULTANEOUS EQUATIONS 2, INEQUALITIES 2,
 * ALGEBRAIC FRACTIONS 2, FUNCTIONS
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Contains every answer for L5-A1 to L5-A4.
 * ═════════════════════════════════════════════════════════════════════════
 */

export const generators = {};

const choice = (options) => ({ kind: "choice", options });
const listIn = (extra = {}) => ({ kind: "list", placeholder: "e.g. 3, -1", ...extra });
const INEQ_KEYS = ["<", ">", "≤", "≥", "-"];

/* ── L5-A1 · One linear and one quadratic ───────────────────────────── */

generators["L5-A1.1"] = (r, tier) => {
  // y = x² + bx + c and y = mx + k, meeting at x = p and x = q
  const p = r.int(-4, 4);
  const q = r.intExcept(-4, 5, [p]);
  const m = r.intExcept(-3, 3, [0]);
  const k = r.int(-5, 5);
  const B = -(p + q) + m;
  const C = p * q + k;
  if (tier !== "build" && r.chance(0.5)) {
    // ask for the y-values too
    const ys = [m * p + k, m * q + k];
    return item({
      skill: "Solving one linear and one quadratic equation",
      prompt: `Solve simultaneously: y = ${poly([1, "x²"], [B, "x"], [C, ""])} and y = ${poly([m, "x"], [k, ""])}. Give the two y-values.`,
      input: listIn(),
      answer: ys.map(String),
      hints: ["Substitute the line into the curve: set the two expressions for y equal.", `${poly([1, "x²"], [B - m, "x"], [C - k, ""])} = 0`, "Find x, then put each x into the LINEAR equation for y."],
      solution: [`${poly([1, "x²"], [B - m, "x"], [C - k, ""])} = 0  →  x = ${sn(p)} or ${sn(q)}`, `y = ${sn(ys[0])} or ${sn(ys[1])}`],
      traps: [trap("gave-x", [String(p), String(q)], "Those are the x-values. The question asks for y.")],
    });
  }
  return item({
    skill: "Solving one linear and one quadratic equation",
    prompt: `Solve simultaneously: y = ${poly([1, "x²"], [B, "x"], [C, ""])} and y = ${poly([m, "x"], [k, ""])}. Give the two x-values.`,
    input: listIn(),
    answer: [String(p), String(q)],
    hints: ["Set the two expressions for y equal.", `${poly([1, "x²"], [B, "x"], [C, ""])} = ${poly([m, "x"], [k, ""])}`, `${poly([1, "x²"], [B - m, "x"], [C - k, ""])} = 0`],
    solution: [`${poly([1, "x²"], [B - m, "x"], [C - k, ""])} = 0`, `${br(1, -p)}${br(1, -q)} = 0`, `x = ${sn(p)} or x = ${sn(q)}`],
    traps: [trap("signs", [String(-p), String(-q)], "The roots have the opposite signs to the numbers in the brackets.")],
  });
};

generators["L5-A1.2"] = (r, tier) => {
  const a = r.int(3, 12);
  const b = r.int(2, a - 1);
  const kind = r.pick(["rectangle", "numbers"]);
  if (kind === "rectangle") {
    return item({
      skill: "A word problem with one linear and one quadratic equation",
      prompt: `A rectangle has a perimeter of ${2 * (a + b)} cm and an area of ${a * b} cm². Find its length and width.`,
      input: listIn({ placeholder: "length, width" }),
      answer: [String(a), String(b)],
      hints: [`l + w = ${a + b} and lw = ${a * b}.`, `Substitute w = ${a + b} − l: l(${a + b} − l) = ${a * b}.`, `l² − ${a + b}l + ${a * b} = 0`],
      solution: [`l + w = ${a + b},  lw = ${a * b}`, `l² − ${a + b}l + ${a * b} = 0`, `l = ${a}, w = ${b}`],
      traps: [trap("perimeter-as-sum", [String(2 * a), String(2 * b)], "The perimeter is 2(l + w), so l + w is HALF the perimeter.")],
    });
  }
  return item({
    skill: "A word problem with one linear and one quadratic equation",
    prompt: `The sum of two positive numbers is ${a + b} and the sum of their squares is ${a * a + b * b}. Find the two numbers.`,
    input: listIn(),
    answer: [String(a), String(b)],
    hints: [`x + y = ${a + b} and x² + y² = ${a * a + b * b}.`, `Put y = ${a + b} − x into the second equation.`, `2x² − ${2 * (a + b)}x + ${(a + b) ** 2 - (a * a + b * b)} = 0`],
    solution: [`x² + (${a + b} − x)² = ${a * a + b * b}`, `x = ${a} or ${b}`, `The numbers are ${a} and ${b}.`],
    traps: [],
  });
};

/* ── L5-A2 · Inequalities 2 ─────────────────────────────────────────── */

generators["L5-A2.1"] = (r, tier) => {
  const m = r.intExcept(-3, 3, [0]);
  const c = r.int(-4, 4);
  const sign = r.pick(["<", ">", "≤", "≥"]);
  const kind = r.pick(byTier(tier, { build: ["test"], stretch: ["test", "boundary"], exam: ["boundary", "test"] }));
  if (kind === "boundary") {
    return item({
      skill: "Drawing the boundary of an inequality",
      prompt: `When the region y ${sign} ${poly([m, "x"], [c, ""])} is shown on a graph, should the boundary line be solid or broken (dashed)?`,
      input: choice(["solid", "broken"]),
      answer: sign === "≤" || sign === "≥" ? "solid" : "broken",
      hints: ["A SOLID line means points on the line are included (≤ or ≥).", "A BROKEN (dashed) line means they are not included (< or >).", `The sign here is ${sign}.`],
      solution: [sign === "≤" || sign === "≥" ? "Points on the line satisfy it, so the line is solid." : "Points on the line do NOT satisfy a strict inequality, so the line is broken."],
      traps: [trap("swapped", sign === "≤" || sign === "≥" ? "broken" : "solid", "Solid for ≤ and ≥; broken for < and >.")],
    });
  }
  const px = r.int(-3, 3);
  const py = r.int(-5, 5);
  const lhs = py;
  const rhs = m * px + c;
  const holds = { "<": lhs < rhs, ">": lhs > rhs, "≤": lhs <= rhs, "≥": lhs >= rhs }[sign];
  return item({
    skill: "Testing a point in an inequality",
    prompt: `Does the point (${sn(px)}, ${sn(py)}) lie in the region y ${sign} ${poly([m, "x"], [c, ""])}?`,
    input: choice(["yes", "no"]),
    answer: holds ? "yes" : "no",
    hints: ["Substitute the coordinates into the inequality.", `Right-hand side: ${poly([m, "x"], [c, ""]).replace("x", `(${sn(px)})`)} = ${sn(rhs)}`, `Is ${sn(py)} ${sign} ${sn(rhs)}?`],
    solution: [`${sn(py)} ${sign} ${sn(rhs)} is ${holds ? "true" : "false"}`, holds ? "So the point is in the region." : "So the point is not in the region."],
    traps: [trap("opposite", holds ? "no" : "yes", "Substitute carefully and check the direction of the sign.")],
  });
};

generators["L5-A2.2"] = (r, tier) => {
  // Integer points with x ≥ 0, y ≥ 0, x + y ≤ s, and y ≤ t
  const s = r.int(3, 6);
  const t = r.int(1, s - 1);
  let count = 0;
  for (let x = 0; x <= s; x += 1) for (let y = 0; y <= t; y += 1) if (x + y <= s) count += 1;
  return item({
    skill: "Points satisfying several inequalities",
    prompt: `How many points with WHOLE-NUMBER coordinates satisfy all of: x ≥ 0, y ≥ 0, x + y ≤ ${s} and y ≤ ${t}?`,
    input: num(),
    answer: count,
    hints: ["Work row by row: fix y = 0, 1, 2, ... up to the allowed maximum.", `For each y, x can go from 0 to ${s} − y.`, `y = 0 gives ${s + 1} points; y = 1 gives ${s} points; ...`],
    solution: Array.from({ length: t + 1 }, (_, y) => `y = ${y}: ${s - y + 1} points`).concat(`Total: ${count}`),
    traps: [trap("ignored-y-limit", ((s + 1) * (s + 2)) / 2, `Do not forget y ≤ ${t}.`)].filter((tt) => tt.is !== count),
  });
};

generators["L5-A2.3"] = (r, tier) => {
  const corners = [[0, 0], [r.int(3, 8), 0], [r.int(2, 5), r.int(2, 6)], [0, r.int(3, 8)]];
  const a = r.int(2, 9) * 10;
  const b = r.int(2, 9) * 10;
  const maximise = r.chance(0.7);
  const values = corners.map(([x, y]) => a * x + b * y);
  const best = maximise ? Math.max(...values) : Math.min(...values.slice(1));
  return item({
    skill: "Linear programming at the corners",
    prompt: `The feasible region has corners ${corners.map(([x, y]) => `(${x}, ${y})`).join(", ")}. Find the ${maximise ? "maximum" : "minimum (excluding the origin)"} value of P = ${a}x + ${b}y.`,
    input: num(),
    answer: best,
    hints: ["The maximum and minimum of a linear expression over a region occur at its CORNERS.", "Work out P at each corner.", values.map((v, i) => `(${corners[i].join(", ")}): ${v}`).join(";  ")],
    solution: [...values.map((v, i) => `P(${corners[i].join(", ")}) = ${v}`), `${maximise ? "Maximum" : "Minimum"} = ${best}`],
    traps: [trap("wrong-extreme", maximise ? Math.min(...values.slice(1)) : Math.max(...values), maximise ? "That is the smallest value. The question asks for the maximum." : "That is the largest value.")],
  });
};

generators["L5-A2.4"] = (r, tier) => {
  const p = r.int(-6, 3);
  const q = p + r.int(2, 7);
  const lessThan = r.chance(0.5);
  const b = -(p + q);
  const c = p * q;
  const shown = `${poly([1, "x²"], [b, "x"], [c, ""])} ${lessThan ? "<" : ">"} 0`;
  const answer = lessThan ? `${p} < x < ${q}` : `x < ${p} or x > ${q}`;
  const acceptVariants = lessThan
    ? [`${p}<x<${q}`, `${p} < x < ${q}`]
    : [`x<${p} or x>${q}`, `x < ${p} or x > ${q}`, `x<${p}, x>${q}`, `x < ${p}, x > ${q}`, `x>${q} or x<${p}`, `x > ${q} or x < ${p}`];
  return item({
    skill: "Solving a quadratic inequality",
    prompt: `Solve ${shown}.`,
    input: { kind: "text", placeholder: lessThan ? "e.g. -2 < x < 3" : "e.g. x < -2 or x > 3", keys: INEQ_KEYS },
    answer,
    accept: acceptVariants,
    hints: [`Factorise: ${br(1, -p)}${br(1, -q)} ${lessThan ? "<" : ">"} 0.`, `The critical values are x = ${sn(p)} and x = ${sn(q)}.`, lessThan ? "The parabola opens upward, so it is BELOW zero BETWEEN the roots." : "The parabola opens upward, so it is ABOVE zero OUTSIDE the roots."],
    solution: [`${br(1, -p)}${br(1, -q)} ${lessThan ? "<" : ">"} 0`, lessThan ? `${sn(p)} < x < ${sn(q)}` : `x < ${sn(p)} or x > ${sn(q)}`],
    traps: [trap("between-outside-swapped", lessThan ? `x < ${p} or x > ${q}` : `${p} < x < ${q}`, lessThan ? "A product < 0 means the factors have opposite signs: x lies BETWEEN the roots." : "A product > 0 means both factors have the same sign: x lies OUTSIDE the roots.")],
  });
};

/* ── L5-A3 · Algebraic fractions 2 ──────────────────────────────────── */

generators["L5-A3.1"] = (r, tier) => {
  const a = r.int(1, 5);
  const b = r.int(1, 5);
  const p = r.intExcept(-6, 6, [0]);
  const q = r.intExcept(-6, 6, [0, p]);
  const adding = r.chance(0.6);
  const s = adding ? 1 : -1;
  // a/(x + p) ± b/(x + q) = [a(x + q) ± b(x + p)] / ((x + p)(x + q))
  const numX = a + s * b;
  const numC = a * q + s * b * p;
  const numerator = plainPoly([numX, "x"], [numC, ""]);
  return item({
    skill: adding ? "Adding fractions with binomial denominators" : "Subtracting fractions with binomial denominators",
    prompt: `Simplify ${a}/${br(1, p)} ${adding ? "+" : "−"} ${b}/${br(1, q)} as a single fraction.`,
    input: expr({ placeholder: "e.g. (3x + 4)/((x + 1)(x + 2))" }),
    answer: `(${numerator})/(${pbr(1, p)}${pbr(1, q)})`,
    hints: [`The common denominator is ${br(1, p)}${br(1, q)}.`, `Numerator: ${a}${br(1, q)} ${adding ? "+" : "−"} ${b}${br(1, p)}`, "Expand and collect, keeping the minus on BOTH terms if subtracting."],
    solution: [`= [${a}${br(1, q)} ${adding ? "+" : "−"} ${b}${br(1, p)}] / [${br(1, p)}${br(1, q)}]`, `= (${poly([numX, "x"], [numC, ""])}) / [${br(1, p)}${br(1, q)}]`],
    traps: [trap("added-tops-bottoms", `${a + s * b}/(2x + ${p + q})`, "Never add tops and bottoms. Use a common denominator.")],
  });
};

generators["L5-A3.2"] = (r, tier) => {
  const p = r.int(1, 7);
  const kind = r.pick(byTier(tier, { build: ["linear"], stretch: ["linear", "dots"], exam: ["dots", "trinomial"] }));
  if (kind === "linear") {
    const sgn = r.chance(0.5) ? 1 : -1;
    return item({
      skill: "When an algebraic fraction is undefined",
      prompt: `For what value of x is (x + 1)/${br(1, sgn * p)} undefined?`,
      input: num(),
      answer: -sgn * p,
      hints: ["A fraction is undefined when its denominator is ZERO.", `${poly([1, "x"], [sgn * p, ""])} = 0`, `x = ${sn(-sgn * p)}`],
      solution: [`${poly([1, "x"], [sgn * p, ""])} = 0 when x = ${sn(-sgn * p)}`],
      traps: [trap("numerator-zero", -1, "When the TOP is zero the fraction is 0, which is fine. It is undefined when the BOTTOM is zero.")],
    });
  }
  if (kind === "dots") {
    return item({
      skill: "Values that make a fraction undefined",
      prompt: `For which values of x is (2x + 3)/(x² − ${p * p}) undefined?`,
      input: listIn(),
      answer: [String(p), String(-p)],
      hints: ["Set the denominator equal to zero.", `x² − ${p * p} = 0`, `(x + ${p})(x − ${p}) = 0`],
      solution: [`x² = ${p * p}`, `x = ${p} or x = −${p}`],
      traps: [trap("one-root", [String(p)], `x² = ${p * p} has TWO solutions, ±${p}.`)],
    });
  }
  const q = r.intExcept(-6, 6, [0, p, -p]);
  return item({
    skill: "Values that make a fraction undefined",
    prompt: `For which values of x is 5/(${poly([1, "x²"], [-(p + q), "x"], [p * q, ""])}) undefined?`,
    input: listIn(),
    answer: [String(p), String(q)],
    hints: ["The denominator must not be zero.", `Factorise it: ${br(1, -p)}${br(1, -q)}`, "Each bracket equal to zero gives a value."],
    solution: [`${br(1, -p)}${br(1, -q)} = 0`, `x = ${sn(p)} or x = ${sn(q)}`],
    traps: [],
  });
};

generators["L5-A3.3"] = (r, tier) => {
  // a/(x + p) = b/(x + q) → a(x + q) = b(x + p) → (a − b)x = bp − aq
  let a;
  let b;
  let p;
  let q;
  let x;
  do {
    a = r.int(1, 6);
    b = r.intExcept(1, 7, [a]);
    x = r.int(-6, 9);
    p = r.int(-5, 5);
    q = (b * (x + p)) / a - x;
  } while (!Number.isInteger(q) || x + p === 0 || x + q === 0 || q === p);
  return item({
    skill: "Solving an equation with algebraic fractions",
    prompt: `Solve ${a}/${br(1, p)} = ${b}/${br(1, q)}.`,
    input: num(),
    answer: x,
    hints: ["Cross-multiply.", `${a}${br(1, q)} = ${b}${br(1, p)}`, `${poly([a, "x"], [a * q, ""])} = ${poly([b, "x"], [b * p, ""])}`],
    solution: [`${a}${br(1, q)} = ${b}${br(1, p)}`, `${poly([a - b, "x"])} = ${sn(b * p - a * q)}`, `x = ${sn(x)}`, `Check: neither denominator is zero at x = ${sn(x)}.`],
    traps: [],
  });
};

/* ── L5-A4 · Functions and relations ────────────────────────────────── */

generators["L5-A4.1"] = (r, tier) => {
  const [pairs, answer] = r.pick([
    ["(1, 3), (2, 5), (3, 7)", "one-to-one"],
    ["(1, 4), (2, 4), (3, 9)", "many-to-one"],
    ["(4, 2), (4, −2), (9, 3)", "one-to-many"],
    ["(1, 2), (1, 3), (2, 2)", "many-to-many"],
    ["(−2, 4), (2, 4), (3, 9)", "many-to-one"],
    ["(a, 1), (b, 2), (c, 3)", "one-to-one"],
  ]);
  return item({
    skill: "Types of mapping",
    prompt: `What type of mapping is {${pairs}}?`,
    input: choice(["one-to-one", "many-to-one", "one-to-many", "many-to-many"]),
    answer,
    hints: ["Look at the inputs (first numbers) and the outputs (second numbers).", "Does any input go to more than one output? Does any output come from more than one input?", "A FUNCTION is one-to-one or many-to-one: every input has exactly one output."],
    solution: [`{${pairs}} is ${answer}${answer === "one-to-one" || answer === "many-to-one" ? ", so it is a function" : ", so it is not a function"}.`],
    traps: [trap("reversed", answer === "many-to-one" ? "one-to-many" : answer === "one-to-many" ? "many-to-one" : answer === "one-to-one" ? "many-to-one" : "one-to-many", "Read from left (inputs) to right (outputs).")],
  });
};

generators["L5-A4.2"] = (r, tier) => {
  const m = r.intExcept(-5, 6, [0]);
  const c = r.int(-8, 8);
  const quad = tier === "exam" && r.chance(0.5);
  const f = quad ? (x) => x * x + c : (x) => m * x + c;
  const xs = [1, 2, 3, 4];
  return item({
    skill: "Finding the rule of a mapping",
    prompt: `A function maps ${xs.map((x) => `${x} → ${sn(f(x))}`).join(", ")}. Find the rule f(x).`,
    input: expr({ placeholder: "e.g. 3x + 2" }),
    answer: quad ? plainPoly([1, "x^2"], [c, ""]) : plainPoly([m, "x"], [c, ""]),
    hints: ["Look at how the output changes as the input goes up by 1.", quad ? "The differences are not constant: try squaring." : `The output goes up by ${sn(m)} each time, so the rule starts ${sn(m)}x.`, quad ? `x² gives 1, 4, 9, 16. Compare with the outputs.` : `${sn(m)} × 1 = ${sn(m)}; the output is ${sn(f(1))}, so add ${sn(c)}.`],
    solution: [quad ? `f(x) = ${poly([1, "x²"], [c, ""])}` : `f(x) = ${poly([m, "x"], [c, ""])}`, `Check: f(4) = ${sn(f(4))} ✓`],
    traps: [],
  });
};

generators["L5-A4.3"] = (r, tier) => {
  const a = r.intExcept(-4, 4, [0]);
  const b = r.int(-6, 6);
  const c = r.int(-9, 9);
  const x = r.int(-4, 4);
  const kind = r.pick(byTier(tier, { build: ["linear"], stretch: ["quad"], exam: ["quad", "solve"] }));
  if (kind === "solve") {
    const m = r.intExcept(-5, 5, [0]);
    const k = r.int(-8, 8);
    const target = m * x + k;
    return item({ skill: "Solving f(x) = value", prompt: `f(x) = ${poly([m, "x"], [k, ""])}. Find x if f(x) = ${sn(target)}.`, input: num(), answer: x, hints: ["Set the rule equal to the value.", `${poly([m, "x"], [k, ""])} = ${sn(target)}`, "Solve for x."], solution: [`${poly([m, "x"])} = ${sn(target - k)}`, `x = ${sn(x)}`], traps: [trap("evaluated", m * target + k, "That works out f(value). The question gives f(x) and asks for x.")] });
  }
  if (kind === "linear") {
    return item({ skill: "Evaluating a function", prompt: `f(x) = ${poly([a, "x"], [c, ""])}. Find f(${sn(x)}).`, input: num(), answer: a * x + c, hints: ["Replace every x with the value, in brackets.", `f(${sn(x)}) = ${sn(a)}(${sn(x)}) ${c < 0 ? "−" : "+"} ${Math.abs(c)}`, "Calculate."], solution: [`f(${sn(x)}) = ${sn(a * x + c)}`], traps: [trap("sign", -a * x + c, "Check the sign of the product.")] });
  }
  const val = a * x * x + b * x + c;
  return item({
    skill: "Evaluating a quadratic function",
    prompt: `f(x) = ${poly([a, "x²"], [b, "x"], [c, ""])}. Find f(${sn(x)}).`,
    input: num(),
    answer: val,
    hints: ["Substitute in brackets and square first.", `(${sn(x)})² = ${x * x}`, `${sn(a)}(${x * x}) ${b < 0 ? "−" : "+"} ${Math.abs(b)}(${sn(x)}) ${c < 0 ? "−" : "+"} ${Math.abs(c)}`],
    solution: [`f(${sn(x)}) = ${sn(a * x * x)} ${b * x < 0 ? "−" : "+"} ${Math.abs(b * x)} ${c < 0 ? "−" : "+"} ${Math.abs(c)} = ${sn(val)}`],
    traps: [trap("negative-square", -a * x * x + b * x + c, "A square is never negative: (−2)² = 4.")].filter((t) => t.is !== val),
  });
};

export default generators;
