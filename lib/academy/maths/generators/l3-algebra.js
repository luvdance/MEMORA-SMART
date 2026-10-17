import { item, trap, num, expr, byTier } from "./kit.js";
import { naira, NAMES, GOODS, gcd } from "../rng.js";
import { sn, poly, plainPoly, br, pbr } from "./format.js";

/**
 * GENERATORS · LEVEL 3 · FACTORISATION, SIMULTANEOUS EQUATIONS, FORMULAE,
 * INEQUALITIES, ALGEBRAIC FRACTIONS
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Contains every answer for L3-A1 to L3-A5.
 * ═════════════════════════════════════════════════════════════════════════
 */

export const generators = {};

const coords = { kind: "coordinates", placeholder: "e.g. (3, -2)" };

/* ── L3-A1.1 · Factorising by grouping ──────────────────────────────── */

generators["L3-A1.1"] = (r, tier) => {
  // (a + p)(x + q) = ax + aq + px + pq, written in a mixed order
  const p = r.intExcept(-7, 7, [0]);
  const q = r.intExcept(-7, 7, [0]);
  const shown = tier === "build" ? poly([1, "ax"], [q, "a"], [p, "x"], [p * q, ""]) : poly([1, "xy"], [p, "x"], [q, "y"], [p * q, ""]);
  const answer = tier === "build" ? `${pbr(1, p, "a")}${pbr(1, q, "x")}` : `${pbr(1, q, "x")}${pbr(1, p, "y")}`;
  const display = tier === "build" ? `${br(1, p, "a")}${br(1, q, "x")}` : `${br(1, q, "x")}${br(1, p, "y")}`;
  return item({
    skill: "Factorising four terms by grouping",
    prompt: `Factorise completely: ${shown}`,
    input: expr({ placeholder: "e.g. (a + 2)(x - 3)" }),
    answer,
    exact: "factorised",
    hints: ["Group the four terms into two pairs that share a factor.", "Take the common factor out of each pair. The two brackets left should match.", "Then take the matching bracket out as a common factor."],
    solution: [`${shown}`, "Group in pairs and factor each pair.", `= ${display}`],
    traps: [],
  });
};

/* ── L3-A1.2 · Difference of two squares ────────────────────────────── */

generators["L3-A1.2"] = (r, tier) => {
  if (tier === "exam" && r.chance(0.5)) {
    const a = r.int(30, 99);
    const d = r.int(1, 6);
    const b = a - d;
    return item({
      skill: "Using the difference of two squares to calculate",
      prompt: `Without a calculator, evaluate ${a}² − ${b}².`,
      input: num(),
      answer: a * a - b * b,
      hints: ["a² − b² = (a + b)(a − b).", `(${a} + ${b})(${a} − ${b})`, `${a + b} × ${d}`],
      solution: [`${a}² − ${b}² = (${a} + ${b})(${a} − ${b}) = ${a + b} × ${d} = ${a * a - b * b}`],
      traps: [trap("squared-difference", d * d, "(a − b)² is not a² − b². Use (a + b)(a − b).")],
    });
  }
  const k = tier === "build" ? 1 : r.int(1, 4);
  const m = r.int(1, 9);
  const coef = k * k;
  const shown = `${coef === 1 ? "" : coef}x² − ${m * m}`;
  const answer = `${pbr(k, m)}${pbr(k, -m)}`;
  return item({
    skill: "Factorising a difference of two squares",
    prompt: `Factorise ${shown}.`,
    input: expr({ placeholder: "e.g. (x + 5)(x - 5)" }),
    answer,
    exact: "factorised",
    hints: ["a² − b² = (a + b)(a − b).", `${shown} = (${k === 1 ? "" : k}x)² − ${m}²`, `So a = ${k === 1 ? "" : k}x and b = ${m}.`],
    solution: [`${shown} = (${k === 1 ? "" : k}x)² − ${m}²`, `= ${br(k, m)}${br(k, -m)}`],
    traps: [trap("perfect-square", `${pbr(k, -m)}^2`, "(a − b)² gives a² − 2ab + b², which has a middle term. A difference of two squares is (a + b)(a − b).")],
  });
};

/* ── L3-A1.3 · Factorising quadratic trinomials ─────────────────────── */

generators["L3-A1.3"] = (r, tier) => {
  const a = tier === "exam" ? r.int(2, 4) : 1;
  const p = r.intExcept(-9, 9, [0]);
  const q = r.intExcept(-9, 9, [0]);
  // (ax + p)(x + q) = ax² + (aq + p)x + pq
  const b = a * q + p;
  const c = p * q;
  // (ax + p) must have no common factor, or the trinomial is not fully factorised
  if (a > 1 && gcd(a, Math.abs(p)) !== 1) return generators["L3-A1.3"](r, "stretch");
  const shown = poly([a, "x²"], [b, "x"], [c, ""]);
  const answer = `${pbr(a, p)}${pbr(1, q)}`;
  return item({
    skill: a === 1 ? "Factorising x² + bx + c" : "Factorising ax² + bx + c",
    prompt: `Factorise ${shown}.`,
    input: expr({ placeholder: "e.g. (x + 2)(x - 5)" }),
    answer,
    exact: "factorised",
    hints: a === 1 ? ["Find two numbers that MULTIPLY to the constant and ADD to the coefficient of x.", `Multiply to ${sn(c)}, add to ${sn(b)}.`, `They are ${sn(p)} and ${sn(q)}.`] : ["Multiply a × c, then find two numbers that multiply to it and add to b.", `a × c = ${sn(a * c)}. Two numbers: multiply to ${sn(a * c)}, add to ${sn(b)}: ${sn(a * q)} and ${sn(p)}.`, `Split the middle term: ${poly([a, "x²"], [a * q, "x"], [p, "x"], [c, ""])}, then group.`],
    solution: a === 1 ? [`Two numbers with product ${sn(c)} and sum ${sn(b)}: ${sn(p)} and ${sn(q)}`, `${shown} = ${br(1, p)}${br(1, q)}`] : [`a × c = ${sn(a * c)}; numbers ${sn(a * q)} and ${sn(p)}`, `${poly([a, "x²"], [a * q, "x"], [p, "x"], [c, ""])}`, `= ${a}x${br(1, q)} ${p < 0 ? "−" : "+"} ${Math.abs(p)}${br(1, q)}`, `= ${br(a, p)}${br(1, q)}`],
    traps: [trap("signs-swapped", `${pbr(a, -p)}${pbr(1, -q)}`, "Check the signs: expand your brackets and compare the middle term.")],
  });
};

/* ── L3-A1.4 · Simplifying by factorising ───────────────────────────── */

generators["L3-A1.4"] = (r, tier) => {
  const p = r.intExcept(-8, 8, [0]);
  const q = r.intExcept(-8, 8, [0, p]);
  const kind = r.pick(byTier(tier, { build: ["dots"], stretch: ["dots", "trinomial"], exam: ["trinomial", "two-trinomials"] }));
  if (kind === "dots") {
    const m = Math.abs(p);
    const shown = `(x² − ${m * m}) ÷ (x + ${m})`;
    return item({
      skill: "Cancelling after a difference of two squares",
      prompt: `Simplify ${shown}.`,
      input: expr(),
      answer: `x - ${m}`,
      exact: "no-slash",
      hints: ["Factorise the top first.", `x² − ${m * m} = (x + ${m})(x − ${m})`, `(x + ${m}) cancels.`],
      solution: [`x² − ${m * m} = (x + ${m})(x − ${m})`, `÷ (x + ${m}) leaves x − ${m}`],
      traps: [trap("other-bracket", `x + ${m}`, `That is the bracket that cancels. What is LEFT is (x − ${m}).`)],
    });
  }
  if (kind === "trinomial") {
    const top = poly([1, "x²"], [p + q, "x"], [p * q, ""]);
    return item({
      skill: "Cancelling a common bracket after factorising",
      prompt: `Simplify (${top}) ÷ ${br(1, p)}.`,
      input: expr(),
      answer: plainPoly([1, "x"], [q, ""]),
      exact: "no-slash",
      hints: ["Factorise the top.", `${top} = ${br(1, p)}${br(1, q)}`, `${br(1, p)} cancels.`],
      solution: [`${top} = ${br(1, p)}${br(1, q)}`, `Answer: ${poly([1, "x"], [q, ""])}`],
      traps: [],
    });
  }
  const s = r.intExcept(-8, 8, [0, p, q]);
  const top = poly([1, "x²"], [p + q, "x"], [p * q, ""]);
  const bottom = poly([1, "x²"], [p + s, "x"], [p * s, ""]);
  return item({
    skill: "Simplifying a fraction with two quadratics",
    prompt: `Simplify (${top}) ÷ (${bottom}).`,
    input: expr({ placeholder: "e.g. (x + 2)/(x - 3)" }),
    answer: `${pbr(1, q)}/${pbr(1, s)}`,
    hints: ["Factorise the top and the bottom.", `Top: ${br(1, p)}${br(1, q)}.  Bottom: ${br(1, p)}${br(1, s)}.`, `Cancel ${br(1, p)}.`],
    solution: [`= ${br(1, p)}${br(1, q)} ÷ ${br(1, p)}${br(1, s)}`, `= ${br(1, q)} / ${br(1, s)}`],
    traps: [],
  });
};

/* ── L3-A2 · Simultaneous linear equations ──────────────────────────── */

function pair(r) {
  const x = r.intExcept(-6, 8, [0]);
  const y = r.intExcept(-6, 8, [0]);
  let a1;
  let b1;
  let a2;
  let b2;
  do {
    a1 = r.int(1, 5);
    b1 = r.intExcept(-5, 5, [0]);
    a2 = r.int(1, 5);
    b2 = r.intExcept(-5, 5, [0]);
  } while (a1 * b2 - a2 * b1 === 0);
  return { x, y, a1, b1, c1: a1 * x + b1 * y, a2, b2, c2: a2 * x + b2 * y };
}
const eqn = (a, b, c) => `${poly([a, "x"], [b, "y"])} = ${sn(c)}`;

generators["L3-A2.1"] = (r, tier) => {
  const s = pair(r);
  return item({
    skill: "Solving simultaneous equations by elimination",
    prompt: `Solve simultaneously:\n\n  ${eqn(s.a1, s.b1, s.c1)}\n  ${eqn(s.a2, s.b2, s.c2)}\n\nGive your answer as (x, y).`,
    input: coords,
    answer: `(${s.x}, ${s.y})`,
    hints: ["Multiply one or both equations so that one letter has the same coefficient in both.", `To remove x: multiply the first by ${s.a2} and the second by ${s.a1}.`, "Then subtract (same signs) or add (opposite signs) to eliminate it."],
    solution: [`× ${s.a2}: ${eqn(s.a1 * s.a2, s.b1 * s.a2, s.c1 * s.a2)}`, `× ${s.a1}: ${eqn(s.a1 * s.a2, s.b2 * s.a1, s.c2 * s.a1)}`, `Subtract: ${poly([s.b1 * s.a2 - s.b2 * s.a1, "y"])} = ${sn(s.c1 * s.a2 - s.c2 * s.a1)}  →  y = ${sn(s.y)}`, `Substitute back: x = ${sn(s.x)}`],
    traps: [trap("swapped", `(${s.y}, ${s.x})`, "Give x first, then y.")],
  });
};

generators["L3-A2.2"] = (r, tier) => {
  const x = r.intExcept(-6, 8, [0]);
  const m = r.intExcept(-4, 4, [0]);
  const c = r.int(-6, 6);
  const y = m * x + c;
  const a = r.int(1, 5);
  const b = r.intExcept(-4, 4, [0, -a / m]);
  const rhs = a * x + b * y;
  return item({
    skill: "Solving simultaneous equations by substitution",
    prompt: `Solve simultaneously:\n\n  y = ${poly([m, "x"], [c, ""])}\n  ${eqn(a, b, rhs)}\n\nGive your answer as (x, y).`,
    input: coords,
    answer: `(${x}, ${y})`,
    hints: ["The first equation gives y in terms of x.", `Substitute it into the second: ${a === 1 ? "" : a}x ${b < 0 ? "−" : "+"} ${Math.abs(b)}(${poly([m, "x"], [c, ""])}) = ${sn(rhs)}`, "Solve for x, then use y = ... to find y."],
    solution: [`${a}x + ${b}(${poly([m, "x"], [c, ""])}) = ${rhs}`, `${poly([a + b * m, "x"])} = ${sn(rhs - b * c)}`, `x = ${sn(x)}`, `y = ${poly([m, "x"], [c, ""]).replace("x", `(${sn(x)})`)} = ${sn(y)}`],
    traps: [trap("swapped", `(${y}, ${x})`, "Give x first, then y.")],
  });
};

generators["L3-A2.3"] = (r, tier) => {
  const X = r.int(-4, 5);
  const Y = r.int(-5, 6);
  const m1 = r.intExcept(-3, 3, [0]);
  let m2;
  do m2 = r.intExcept(-3, 3, [0]);
  while (m2 === m1);
  const c1 = Y - m1 * X;
  const c2 = Y - m2 * X;
  return item({
    skill: "The graphical solution of simultaneous equations",
    prompt: `The graphs of y = ${poly([m1, "x"], [c1, ""])} and y = ${poly([m2, "x"], [c2, ""])} are drawn on the same axes. Use their point of intersection to solve the equations simultaneously. Give (x, y).`,
    input: coords,
    answer: `(${X}, ${Y})`,
    hints: ["The solution is the point where the two lines cross.", "Make a table of values for each line, or set the right-hand sides equal.", `${poly([m1, "x"], [c1, ""])} = ${poly([m2, "x"], [c2, ""])}`],
    solution: [`${poly([m1 - m2, "x"])} = ${sn(c2 - c1)}`, `x = ${sn(X)}, y = ${sn(Y)}`, `The lines cross at (${sn(X)}, ${sn(Y)}).`],
    traps: [trap("swapped", `(${Y}, ${X})`, "Coordinates are (x, y).")],
  });
};

generators["L3-A2.4"] = (r, tier) => {
  const who = r.pick(NAMES);
  const [a, b] = r.sample(GOODS, 2);
  const pa = r.int(2, 30) * 50;
  const pb = r.int(2, 30) * 50;
  let m1;
  let n1;
  let m2;
  let n2;
  do {
    [m1, n1, m2, n2] = [r.int(1, 6), r.int(1, 6), r.int(1, 6), r.int(1, 6)];
  } while (m1 * n2 - m2 * n1 === 0);
  const t1 = m1 * pa + n1 * pb;
  const t2 = m2 * pa + n2 * pb;
  const askFirst = r.chance(0.5);
  return item({
    skill: "Simultaneous equations from a word problem",
    prompt: `${who} pays ${naira(t1)} for ${m1} ${a.name} and ${n1} ${b.name}. Another customer pays ${naira(t2)} for ${m2} ${a.name} and ${n2} ${b.name}. Find the price of one of the ${askFirst ? a.name : b.name}.`,
    input: num(),
    answer: askFirst ? pa : pb,
    hints: [`Let one of the ${a.name} cost a and one of the ${b.name} cost b.`, `${m1}a + ${n1}b = ${t1}  and  ${m2}a + ${n2}b = ${t2}`, "Eliminate one letter, solve, then substitute back."],
    solution: [`${m1}a + ${n1}b = ${t1}`, `${m2}a + ${n2}b = ${t2}`, `Solving: a = ${pa}, b = ${pb}`, `One of the ${askFirst ? a.name : b.name} costs ${naira(askFirst ? pa : pb)}.`],
    traps: [trap("gave-other", askFirst ? pb : pa, `That is the price of the ${askFirst ? b.name : a.name}. Check which item the question asks about.`)],
  });
};

/* ── L3-A3 · Formulae ───────────────────────────────────────────────── */

const ROOT_FORMULAE = [
  { f: "v² = u² + 2as", want: "s", answer: "(v^2 - u^2)/(2a)", steps: ["v² − u² = 2as", "s = (v² − u²)/(2a)"], trap: "(v - u)^2/(2a)" },
  { f: "a = πr²", want: "r", answer: "√(a/π)", steps: ["r² = a/π", "r = √(a/π)"], trap: "a/(2π)" },
  { f: "v = πr²h", want: "r", answer: "√(v/(πh))", steps: ["r² = v/(πh)", "r = √(v/(πh))"], trap: "v/(2πh)" },
  { f: "k = ½mv²", want: "v", answer: "√(2k/m)", steps: ["2k = mv²", "v² = 2k/m", "v = √(2k/m)"], trap: "2k/m" },
  { f: "t = 2π√(l/g)", want: "l", answer: "g(t/(2π))^2", steps: ["t/(2π) = √(l/g)", "(t/(2π))² = l/g", "l = g t²/(4π²)"], trap: "gt/(2π)" },
  { f: "y = √(x + c)", want: "x", answer: "y^2 - c", steps: ["y² = x + c", "x = y² − c"], trap: "y - c" },
];

generators["L3-A3.1"] = (r, tier) => {
  const F = r.pick(tier === "build" ? ROOT_FORMULAE.slice(0, 3) : ROOT_FORMULAE);
  return item({
    skill: "Changing the subject when it is squared or under a root",
    prompt: `Make ${F.want} the subject of  ${F.f}\n\nType the expression that ${F.want} equals. Use √ and brackets as needed.`,
    input: expr({ placeholder: "e.g. √(a/π)" }),
    answer: F.answer,
    hints: [`Get ${F.want}² (or the root containing ${F.want}) on its own first.`, "A square is undone by a square root; a square root is undone by squaring.", F.steps[0]],
    solution: [F.f, ...F.steps],
    traps: [trap("wrong-inverse", F.trap, "Undo a square with a square root (and a root by squaring), applied to the whole of the other side.")],
  });
};

generators["L3-A3.2"] = (r, tier) => {
  const pick = r.pick(byTier(tier, { build: ["area", "suvat"], stretch: ["suvat", "celsius", "cone"], exam: ["suvat-s", "celsius", "lens"] }));
  if (pick === "area") {
    const b = r.int(4, 20);
    const h = r.int(3, 15) * 2;
    return item({ skill: "Substituting into a formula", prompt: `The area of a triangle is A = ½bh. Find A when b = ${b} and h = ${h}.`, input: num(), answer: (b * h) / 2, hints: ["Replace each letter with its value.", `A = ½ × ${b} × ${h}`, "Multiply."], solution: [`A = ½ × ${b} × ${h} = ${(b * h) / 2}`], traps: [trap("forgot-half", b * h, "Do not forget the ½.")] });
  }
  if (pick === "suvat" || pick === "suvat-s") {
    const u = r.int(0, 20);
    const a = r.int(1, 6);
    const t = r.int(2, 10);
    if (pick === "suvat") return item({ skill: "Substituting into v = u + at", prompt: `Use v = u + at to find v when u = ${u}, a = ${a} and t = ${t}.`, input: num(), answer: u + a * t, hints: ["Multiply a and t first (BODMAS).", `${a} × ${t} = ${a * t}`, `v = ${u} + ${a * t}`], solution: [`v = ${u} + ${a} × ${t} = ${u + a * t}`], traps: [trap("left-to-right", (u + a) * t, "Multiply before adding: v = u + (a × t).")] });
    const s = u * t + (a * t * t) / 2;
    return item({ skill: "Substituting into s = ut + ½at²", prompt: `Use s = ut + ½at² to find s when u = ${u}, a = ${a} and t = ${t}.`, input: num(), answer: s, hints: ["Square t before multiplying.", `ut = ${u * t}`, `½ × ${a} × ${t}² = ${(a * t * t) / 2}`], solution: [`s = ${u}×${t} + ½×${a}×${t}² = ${u * t} + ${(a * t * t) / 2} = ${s}`], traps: [trap("squared-at", u * t + ((a * t) ** 2) / 2, "Only t is squared, not a × t.")] });
  }
  if (pick === "celsius") {
    const C = r.int(-10, 100);
    const F = (9 * C) / 5 + 32;
    return item({ skill: "Substituting into a conversion formula", prompt: `Use F = 9C/5 + 32 to convert ${C} °C to °F.`, input: num(), answer: F, tolerance: 0.01, hints: ["Work out 9 × C ÷ 5 first.", `9 × ${C} ÷ 5 = ${(9 * C) / 5}`, "Then add 32."], solution: [`F = 9 × ${C} ÷ 5 + 32 = ${F}`], traps: [trap("added-first", (9 * (C + 32)) / 5, "Multiply and divide before adding 32.")] });
  }
  if (pick === "cone") {
    const rr = 7 * r.int(1, 2);
    const h = r.int(3, 12) * 3;
    const V = (22 * rr * rr * h) / 21;
    return item({ skill: "Substituting into V = ⅓πr²h", prompt: `Use V = ⅓πr²h with π = 22/7 to find V when r = ${rr} and h = ${h}.`, input: num(), answer: V, hints: ["Square r first.", `r² = ${rr * rr}`, `⅓ × 22/7 × ${rr * rr} × ${h}`], solution: [`V = ⅓ × 22/7 × ${rr * rr} × ${h} = ${V}`], traps: [trap("forgot-third", V * 3, "Do not forget the ⅓.")] });
  }
  const u = r.pick([10, 12, 15, 20, 30]);
  const v = r.pick([15, 20, 30, 60]);
  const f = Math.round(((u * v) / (u + v)) * 100) / 100;
  return item({ skill: "Substituting into 1/f = 1/u + 1/v", prompt: `Use 1/f = 1/u + 1/v to find f when u = ${u} and v = ${v}. Give f to 2 decimal places if needed.`, input: num(), answer: f, tolerance: 0.006, hints: ["Add the fractions on the right first.", `1/${u} + 1/${v} = ${v + u}/${u * v}`, "Then turn the result upside down to get f."], solution: [`1/f = 1/${u} + 1/${v} = ${u + v}/${u * v}`, `f = ${u * v}/${u + v} = ${f}`], traps: [trap("added-u-v", u + v, "1/f = 1/u + 1/v does not mean f = u + v. Add the fractions, then take the reciprocal.")] });
};

/* ── L3-A4 · Inequalities 1 ─────────────────────────────────────────── */

const INEQ_KEYS = ["<", ">", "≤", "≥", "-"];
const flip = { "<": ">", ">": "<", "≤": "≥", "≥": "≤" };
function ineqAccept(sign, n) {
  const ascii = { "<": "<", ">": ">", "≤": "<=", "≥": ">=" }[sign];
  const value = String(n);
  const rev = { "<": ">", ">": "<", "≤": "≥", "≥": "≤" }[sign];
  const revAscii = { "<": ">", ">": "<", "≤": ">=", "≥": "<=" }[sign];
  return [`x${sign}${value}`, `x ${sign} ${value}`, `x${ascii}${value}`, `x ${ascii} ${value}`, `${value}${rev}x`, `${value} ${rev} x`, `${value}${revAscii}x`, `${value} ${revAscii} x`];
}

generators["L3-A4.1"] = (r, tier) => {
  const x0 = r.int(-6, 9);
  const a = byTier(tier, { build: r.int(2, 6), stretch: r.intExcept(-5, 6, [0, 1]), exam: r.intExcept(-6, 6, [0, 1, -1]) });
  const b = r.int(-9, 9);
  const sign = r.pick(["<", ">", "≤", "≥"]);
  const rhs = a * x0 + b;
  const final = a < 0 ? flip[sign] : sign;
  const answer = `x ${final} ${x0}`;
  return item({
    skill: a < 0 ? "Solving an inequality, reversing the sign for a negative" : "Solving a linear inequality",
    prompt: `Solve ${poly([a, "x"], [b, ""])} ${sign} ${sn(rhs)}.`,
    input: { kind: "text", placeholder: "e.g. x > 3", keys: INEQ_KEYS },
    answer,
    accept: ineqAccept(final, x0),
    hints: ["Solve it like an equation, keeping the inequality sign.", `${b >= 0 ? "Subtract" : "Add"} ${Math.abs(b)} from both sides: ${poly([a, "x"])} ${sign} ${sn(rhs - b)}.`, a < 0 ? "Now divide by a NEGATIVE number: the inequality sign must turn round." : `Divide both sides by ${a}.`],
    solution: [`${poly([a, "x"])} ${sign} ${sn(rhs - b)}`, a < 0 ? `÷ (${sn(a)}), reversing the sign: x ${final} ${sn(x0)}` : `÷ ${a}: x ${final} ${sn(x0)}`],
    traps: a < 0 ? [trap("did-not-flip", `x ${sign} ${x0}`, "Dividing (or multiplying) both sides by a NEGATIVE number reverses the inequality sign.")] : [],
  });
};

generators["L3-A4.2"] = (r, tier) => {
  const lo = r.int(-5, 3);
  const hi = lo + r.int(2, 5);
  const loSign = r.pick(["<", "≤"]);
  const hiSign = r.pick(["<", "≤"]);
  if (tier === "build" || r.chance(0.5)) {
    const ints = [];
    for (let k = lo; k <= hi; k += 1) {
      if ((k > lo || loSign === "≤") && (k < hi || hiSign === "≤")) ints.push(k);
    }
    return item({
      skill: "Listing the integers that satisfy an inequality",
      prompt: `List all the integers x such that ${sn(lo)} ${loSign} x ${hiSign} ${sn(hi)}.`,
      input: { kind: "list", placeholder: "e.g. -1, 0, 1, 2" },
      answer: ints.map(String),
      hints: ["< means the end number is NOT included. ≤ means it IS included.", `Start just above or at ${sn(lo)} and stop just below or at ${sn(hi)}.`, "Do not forget 0 and the negative integers."],
      solution: [`${sn(lo)} is ${loSign === "≤" ? "included" : "not included"}; ${sn(hi)} is ${hiSign === "≤" ? "included" : "not included"}.`, `Integers: ${ints.map(sn).join(", ")}`],
      traps: [trap("ends-wrong", (() => { const all = []; for (let k = lo; k <= hi; k += 1) all.push(String(k)); return all; })(), "Check the ends: a strict < or > leaves the end number out.")],
    });
  }
  const end = r.pick(["<", "≤"]);
  return item({
    skill: "Open and closed circles on a number line",
    prompt: `On a number line, x ${end === "<" ? "<" : "≤"} ${sn(hi)} is shown with a circle at ${sn(hi)} and an arrow to the left. Is the circle open or closed?`,
    input: { kind: "choice", options: ["open", "closed"] },
    answer: end === "<" ? "open" : "closed",
    hints: ["An OPEN (empty) circle means the end number is not included.", "A CLOSED (filled) circle means it is included.", `Is ${sn(hi)} itself included in x ${end} ${sn(hi)}?`],
    solution: [end === "<" ? `${sn(hi)} is not included, so the circle is open.` : `${sn(hi)} is included, so the circle is closed (filled in).`],
    traps: [trap("swapped", end === "<" ? "closed" : "open", "Open = not included (< or >). Closed = included (≤ or ≥).")],
  });
};

/* ── L3-A5 · Algebraic fractions 1 ──────────────────────────────────── */

generators["L3-A5.1"] = (r, tier) => {
  if (tier === "build") {
    const [p, q] = r.pick([[2, 3], [3, 4], [2, 5], [4, 3], [5, 2], [3, 5]]);
    const a = r.int(1, 5);
    const b = r.int(1, 5);
    const L = (p * q) / gcd(p, q);
    return item({
      skill: "Adding algebraic fractions with number denominators",
      prompt: `Simplify ${a === 1 ? "" : a}x/${p} + ${b === 1 ? "" : b}x/${q} as a single fraction.`,
      input: expr({ placeholder: "e.g. 7x/12" }),
      answer: `${(L / p) * a + (L / q) * b}x/${L}`,
      hints: [`Common denominator: the LCM of ${p} and ${q} is ${L}.`, `${a}x/${p} = ${(L / p) * a}x/${L} and ${b}x/${q} = ${(L / q) * b}x/${L}.`, "Add the numerators."],
      solution: [`= ${(L / p) * a}x/${L} + ${(L / q) * b}x/${L}`, `= ${(L / p) * a + (L / q) * b}x/${L}`],
      traps: [trap("added-denominators", `${a + b}x/${p + q}`, "Never add the denominators. Use a common denominator.")],
    });
  }
  // a/(x) ± b/(x + k), or (x + m)/p + (x + n)/q
  const p = r.int(2, 5);
  const q = r.intExcept(2, 6, [p]);
  const m = r.intExcept(-5, 5, [0]);
  const n = r.intExcept(-5, 5, [0]);
  const adding = r.chance(0.6);
  const s = adding ? 1 : -1;
  const L = (p * q) / gcd(p, q);
  const numX = L / p + s * (L / q);
  const numC = (L / p) * m + s * (L / q) * n;
  return item({
    skill: adding ? "Adding fractions with algebraic numerators" : "Subtracting fractions with algebraic numerators",
    prompt: `Simplify ${br(1, m)}/${p} ${adding ? "+" : "−"} ${br(1, n)}/${q} as a single fraction.`,
    input: expr({ placeholder: "e.g. (5x + 3)/6" }),
    answer: `(${plainPoly([numX, "x"], [numC, ""])})/${L}`,
    hints: [`Common denominator ${L}.`, `Multiply each numerator by what its denominator was multiplied by: ${L / p}${br(1, m)} ${adding ? "+" : "−"} ${L / q}${br(1, n)}.`, adding ? "Expand and collect." : "Careful: the minus multiplies BOTH terms of the second bracket."],
    solution: [`= [${L / p}${br(1, m)} ${adding ? "+" : "−"} ${L / q}${br(1, n)}] / ${L}`, `= (${poly([numX, "x"], [numC, ""])})/${L}`],
    traps: adding ? [] : [trap("minus-first-term-only", `(${plainPoly([numX, "x"], [(L / p) * m + (L / q) * n, ""])})/${L}`, "The minus sign applies to the WHOLE second numerator, so it changes the sign of both its terms.")],
  });
};

generators["L3-A5.2"] = (r, tier) => {
  const a = r.int(2, 6);
  const b = r.int(2, 6);
  const c = r.int(2, 6);
  const dividing = tier !== "build" && r.chance(0.5);
  // (a x / b) × (c / (a x²))  =  c / (b x)
  if (!dividing) {
    return item({
      skill: "Multiplying algebraic fractions",
      prompt: `Simplify ${a}x/${b} × ${c}/(${a}x²).`,
      input: expr({ placeholder: "e.g. 3/(2x)" }),
      answer: `${c}/(${b}x)`,
      hints: ["Multiply tops and bottoms, cancelling common factors first.", `${a}x on top cancels with ${a}x² on the bottom, leaving x on the bottom.`, `Left: ${c} on top, ${b}x underneath.`],
      solution: [`= (${a}x × ${c}) / (${b} × ${a}x²)`, `= ${c}/(${b}x)`],
      traps: [trap("lost-x", `${c}/${b}`, `x² ÷ x leaves one x on the bottom.`)],
    });
  }
  return item({
    skill: "Dividing algebraic fractions",
    prompt: `Simplify ${a}x/${b} ÷ ${a * c}x²/${b * b}.`,
    input: expr({ placeholder: "e.g. 3/(2x)" }),
    answer: `${b}/(${c}x)`,
    hints: ["To divide, multiply by the reciprocal of the second fraction.", `${a}x/${b} × ${b * b}/(${a * c}x²)`, "Now cancel common factors."],
    solution: [`= ${a}x/${b} × ${b * b}/(${a * c}x²)`, `= ${b}/(${c}x)`],
    traps: [trap("did-not-flip", `${a * a * c}x^3/${b * b * b}`, "Dividing means multiplying by the reciprocal: turn the second fraction over.")],
  });
};

export default generators;
