import { item, trap, num, frac, list, choice, byTier } from "./kit.js";
import { simplify, fracText } from "../rng.js";
import { sn } from "./format.js";

/**
 * GENERATORS · LEVEL 5 STATISTICS AND PROBABILITY · LEVEL 6 MATRICES, BINARY OPERATIONS
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Contains every answer for L5-S1, L5-S2, L5-S3, L6-C1, L6-N1.
 * ═════════════════════════════════════════════════════════════════════════
 *
 * Ogive skills are drilled from the cumulative frequency table the ogive is
 * drawn from: reading a quartile off the curve is linear interpolation within
 * a class, so the generator asks for exactly that number.
 */

export const generators = {};

const r1 = (x) => Math.round(x * 10) / 10;
const r2 = (x) => Math.round(x * 100) / 100;
const F = (n, d) => fracText(...simplify(n, d));
/** A rational value as an exact fraction string. */
const Q = (v) => {
  for (let d = 1; d <= 1000; d++) if (Math.abs(v * d - Math.round(v * d)) < 1e-9) return F(Math.round(v * d), d);
  return String(r2(v));
};

/** A grouped table: classes of width w starting at s, with frequencies. */
function groupedTable(r, k = 5) {
  const w = r.pick([10, 10, 5, 20]);
  const s = r.pick([0, w, 2 * w]) + (w === 10 ? 1 : 0);
  const f = Array.from({ length: k }, () => r.int(2, 14));
  const classes = f.map((_, i) => [s + i * w, s + (i + 1) * w - 1]);
  const cf = f.reduce((acc, x) => [...acc, (acc.at(-1) ?? 0) + x], []);
  const table = classes.map(([lo, hi], i) => `${lo}–${hi}: ${f[i]}`).join(" · ");
  return { w, f, classes, cf, table, n: cf.at(-1), ucb: (i) => classes[i][1] + 0.5, lcb: (i) => classes[i][0] - 0.5 };
}

/* ── L5-S1 · Cumulative frequency and the ogive ─────────────────────── */

generators["L5-S1.1"] = (r, tier) => {
  const t = groupedTable(r);
  const i = r.int(1, t.classes.length - 1);
  if (r.chance(0.5)) {
    return item({
      skill: "Cumulative frequency",
      prompt: `Marks (class: frequency): ${t.table}. What is the cumulative frequency of the class ${t.classes[i][0]}–${t.classes[i][1]}?`,
      input: num(),
      answer: t.cf[i],
      hints: ["Cumulative frequency is a running total: add each frequency to all the ones before it.", `Add the frequencies from the first class up to ${t.classes[i][0]}–${t.classes[i][1]}.`, t.f.slice(0, i + 1).join(" + ")],
      solution: [`${t.f.slice(0, i + 1).join(" + ")} = ${t.cf[i]}`],
      traps: [trap("just-frequency", t.f[i], "That is the class's own frequency. Cumulative means add all the classes up to it.")],
    });
  }
  return item({
    skill: "Upper class boundaries",
    prompt: `Marks are grouped ${t.classes.slice(0, 3).map(([a, b]) => `${a}–${b}`).join(", ")}, ... What is the upper class boundary of the class ${t.classes[i][0]}–${t.classes[i][1]}?`,
    input: num(),
    answer: t.ucb(i),
    hints: ["The boundary lies halfway between the end of one class and the start of the next.", `${t.classes[i][1]} and ${t.classes[i][1] + 1}`, `Halfway: ${t.classes[i][1]} + 0.5`],
    solution: [`Upper class boundary = ${t.ucb(i)}`],
    traps: [trap("upper-limit", t.classes[i][1], "That is the class LIMIT. The boundary is halfway to the next class."), trap("next-start", t.classes[i][1] + 1, "That is the start of the next class. The boundary is halfway between.")],
  });
};

generators["L5-S1.2"] = (r, tier) => {
  const t = groupedTable(r);
  const i = r.int(0, t.classes.length - 1);
  return item({
    skill: "Plotting an ogive",
    prompt: `Marks (class: frequency): ${t.table}. To draw the ogive, the cumulative frequency of the class ${t.classes[i][0]}–${t.classes[i][1]} is plotted at which mark?`,
    input: num(),
    answer: t.ucb(i),
    hints: ["An ogive plots cumulative frequency against the UPPER CLASS BOUNDARY.", "By the boundary, all of that class has been counted.", `${t.classes[i][1]} + 0.5`],
    solution: [`Plot at the upper class boundary, ${t.ucb(i)}, with height ${t.cf[i]}.`],
    traps: [trap("mid-point", (t.classes[i][0] + t.classes[i][1]) / 2, "Midpoints are for the frequency polygon. An ogive uses the upper class boundary."), trap("upper-limit", t.classes[i][1], "Use the boundary, not the limit: add 0.5.")],
  });
};

/** The value at position p of n, interpolated within the grouped table. */
function readOff(t, pos) {
  const j = t.cf.findIndex((c) => c >= pos);
  const before = j === 0 ? 0 : t.cf[j - 1];
  return { j, before, value: t.lcb(j) + ((pos - before) / t.f[j]) * t.w };
}

generators["L5-S1.3"] = (r, tier) => {
  let t = groupedTable(r);
  while (t.n % 4 !== 0) t = groupedTable(r);
  const which = r.pick(byTier(tier, { build: ["median"], stretch: ["median", "lower quartile", "upper quartile"], exam: ["interquartile range", "upper quartile", "lower quartile"] }));
  const q = (p) => readOff(t, p * t.n);
  const pick = { median: 0.5, "lower quartile": 0.25, "upper quartile": 0.75 }[which];
  const iqr = q(0.75).value - q(0.25).value;
  const res = which === "interquartile range" ? iqr : q(pick).value;
  const rd = which === "interquartile range" ? q(0.75) : q(pick);
  const pos = (which === "interquartile range" ? 0.75 : pick) * t.n;
  return item({
    skill: "Quartiles from the cumulative frequency",
    prompt: `Marks (class: frequency): ${t.table}. Estimate the ${which}, reading the ogive as straight lines between plotted points. Give your answer to 1 decimal place.`,
    input: num(),
    answer: r1(res),
    tolerance: 0.06,
    hints: [`Total = ${t.n}. The median is at the ${t.n / 2}th value; Q1 at ${t.n / 4}; Q3 at ${(3 * t.n) / 4}.`, `The ${pos}th value is in the class ${t.classes[rd.j][0]}–${t.classes[rd.j][1]}, which starts at ${t.lcb(rd.j)} with ${rd.before} counted before it.`, `${t.lcb(rd.j)} + (${pos} − ${rd.before})/${t.f[rd.j]} × ${t.w}`],
    solution: which === "interquartile range" ? [`Q3 = ${r2(q(0.75).value)}`, `Q1 = ${r2(q(0.25).value)}`, `IQR = ${r1(iqr)}`] : [`${t.lcb(rd.j)} + (${pos} − ${rd.before})/${t.f[rd.j]} × ${t.w} = ${r1(res)}`],
    traps: which === "interquartile range" ? [trap("semi", r1(iqr / 2), "That is the SEMI-interquartile range. The IQR is Q3 − Q1.")] : [trap("lower-limit", t.classes[rd.j][0], "That is only the start of the class. Go part of the way into it.")],
  });
};

generators["L5-S1.4"] = (r, tier) => {
  const t = groupedTable(r);
  const i = r.int(0, t.classes.length - 2);
  const above = r.chance(0.5);
  return item({
    skill: "Interpreting cumulative frequency",
    prompt: `Marks (class: frequency): ${t.table}. ${above ? `The pass mark is ${t.classes[i + 1][0]}. How many candidates passed?` : `How many candidates scored ${t.classes[i][1]} or less?`}`,
    input: num(),
    answer: above ? t.n - t.cf[i] : t.cf[i],
    hints: ["The cumulative frequency at a boundary counts everyone BELOW it.", above ? `Below the pass mark: ${t.cf[i]}. Total: ${t.n}.` : `Read the cumulative frequency at ${t.ucb(i)}.`, above ? "Passed = total − below." : `Add the frequencies up to the class ending ${t.classes[i][1]}.`],
    solution: above ? [`Below ${t.classes[i + 1][0]}: ${t.cf[i]}`, `Passed: ${t.n} − ${t.cf[i]} = ${t.n - t.cf[i]}`] : [`Cumulative frequency at ${t.ucb(i)} = ${t.cf[i]}`],
    traps: above ? [trap("gave-failed", t.cf[i], "That counts those BELOW the pass mark. Subtract from the total.")] : [trap("one-class", t.f[i], "That is one class only. Add all the classes up to it.")],
  });
};

/* ── L5-S2 · Measures of dispersion ─────────────────────────────────── */

/** n integer values with an integer mean. */
function dataSet(r, n) {
  const m = r.int(5, 20);
  const devs = Array.from({ length: n - 1 }, () => r.int(-6, 6));
  const last = -devs.reduce((a, b) => a + b, 0);
  if (Math.abs(last) > 9) return dataSet(r, n);
  const xs = [...devs, last].map((d) => m + d);
  return { m, xs, devs: [...devs, last] };
}

generators["L5-S2.1"] = (r, tier) => {
  const n = byTier(tier, { build: 5, stretch: 6, exam: 7 });
  const { m, xs, devs } = dataSet(r, n);
  if (tier === "build" && r.chance(0.5)) {
    return item({
      skill: "The range",
      prompt: `Find the range of ${xs.join(", ")}.`,
      input: num(),
      answer: Math.max(...xs) - Math.min(...xs),
      hints: ["Range = largest − smallest.", `Largest ${Math.max(...xs)}, smallest ${Math.min(...xs)}.`, "Subtract."],
      solution: [`${Math.max(...xs)} − ${Math.min(...xs)} = ${Math.max(...xs) - Math.min(...xs)}`],
      traps: [trap("first-last", Math.abs(xs.at(-1) - xs[0]), "Use the LARGEST and SMALLEST values, not the first and last.")],
    });
  }
  const md = devs.reduce((a, d) => a + Math.abs(d), 0) / n;
  return item({
    skill: "Mean deviation",
    prompt: `Find the mean deviation of ${xs.join(", ")}, to 2 decimal places where needed.`,
    input: num(),
    answer: r2(md),
    tolerance: 0.006,
    hints: [`The mean is ${m}.`, "Find each distance from the mean, ignoring signs: |x − x̄|.", `Distances: ${devs.map(Math.abs).join(", ")}. Average them.`],
    solution: [`x̄ = ${m}`, `Σ|x − x̄| = ${devs.reduce((a, d) => a + Math.abs(d), 0)}`, `Mean deviation = ${devs.reduce((a, d) => a + Math.abs(d), 0)} ÷ ${n} = ${r2(md)}`],
    traps: [trap("kept-signs", 0, "With signs the deviations always add to 0. Use their sizes |x − x̄|.")],
  });
};

generators["L5-S2.2"] = (r, tier) => {
  const n = byTier(tier, { build: 4, stretch: 5, exam: 6 });
  const { m, xs, devs } = dataSet(r, n);
  const ss = devs.reduce((a, d) => a + d * d, 0);
  return item({
    skill: "Variance",
    prompt: `Find the variance of ${xs.join(", ")}, to 2 decimal places where needed.`,
    input: num(),
    answer: r2(ss / n),
    tolerance: 0.006,
    hints: [`The mean is ${m}.`, "Square each deviation (x − x̄)², then average them.", `Squares: ${devs.map((d) => d * d).join(", ")}; total ${ss}.`],
    solution: [`x̄ = ${m}`, `Σ(x − x̄)² = ${ss}`, `Variance = ${ss} ÷ ${n} = ${r2(ss / n)}`],
    traps: [trap("rooted", r2(Math.sqrt(ss / n)), "That is the standard deviation. Variance is before the square root."), trap("sum-only", ss, "Divide the total by n.")],
  });
};

generators["L5-S2.3"] = (r, tier) => {
  const n = byTier(tier, { build: 4, stretch: 5, exam: 6 });
  const { m, xs, devs } = dataSet(r, n);
  const ss = devs.reduce((a, d) => a + d * d, 0);
  return item({
    skill: "Standard deviation of ungrouped data",
    prompt: `Find the standard deviation of ${xs.join(", ")}, to 2 decimal places.`,
    input: num(),
    answer: r2(Math.sqrt(ss / n)),
    tolerance: 0.006,
    hints: [`The mean is ${m}.`, `Σ(x − x̄)² = ${ss}.`, `SD = √(${ss} ÷ ${n})`],
    solution: [`Variance = ${ss}/${n} = ${r2(ss / n)}`, `SD = √${r2(ss / n)} = ${r2(Math.sqrt(ss / n))}`],
    traps: [trap("no-root", r2(ss / n), "That is the variance. Take the square root.")],
  });
};

generators["L5-S2.4"] = (r, tier) => {
  const xs = [r.int(1, 4)];
  const step = r.pick([1, 2, 5]);
  for (let i = 1; i < 4; i++) xs.push(xs[0] + i * step);
  const f = xs.map(() => r.int(1, 8));
  const N = f.reduce((a, b) => a + b, 0);
  const mean = xs.reduce((a, x, i) => a + x * f[i], 0) / N;
  const sfx2 = xs.reduce((a, x, i) => a + f[i] * x * x, 0);
  const v = sfx2 / N - mean * mean;
  return item({
    skill: "Standard deviation of grouped data",
    prompt: `Find the standard deviation, to 2 decimal places: x = ${xs.join(", ")} with frequencies ${f.join(", ")}.`,
    input: num(),
    answer: r2(Math.sqrt(v)),
    tolerance: 0.006,
    hints: [`Σf = ${N}, Σfx = ${xs.reduce((a, x, i) => a + x * f[i], 0)}, so x̄ = ${r2(mean)}.`, `Σfx² = ${sfx2}.`, "SD = √(Σfx²/Σf − x̄²)"],
    solution: [`x̄ = ${r2(mean)}`, `Variance = ${sfx2}/${N} − ${r2(mean)}² = ${r2(v)}`, `SD = ${r2(Math.sqrt(v))}`],
    traps: [trap("no-root", r2(v), "That is the variance. Take the square root.")],
  });
};

/* ── L5-S3 · Probability rules ──────────────────────────────────────── */

generators["L5-S3.1"] = (r, tier) => {
  const total = r.pick([20, 24, 30, 36, 40]);
  const a = r.int(2, Math.floor(total / 3));
  const b = r.int(2, Math.floor(total / 3));
  const both = tier === "build" ? 0 : r.int(1, Math.min(a, b) - 1 || 1);
  const name = r.pick([["play football", "play basketball"], ["read novels", "read newspapers"], ["take tea", "take coffee"]]);
  return item({
    skill: both ? "The addition rule for events that overlap" : "The addition rule for mutually exclusive events",
    prompt: both
      ? `In a class of ${total}, ${a} students ${name[0]}, ${b} ${name[1]} and ${both} do both. Find the probability that a student chosen at random does at least one of them.`
      : `A bag has ${total} discs: ${a} red, ${b} blue, and the rest white. Find the probability that a disc picked at random is red or blue.`,
    input: frac(),
    answer: F(a + b - both, total),
    hints: [both ? "P(A or B) = P(A) + P(B) − P(A and B)." : "For mutually exclusive events, P(A or B) = P(A) + P(B).", both ? `${a} + ${b} − ${both}` : `${a}/${total} + ${b}/${total}`, "Simplify the fraction."],
    solution: [`P = ${a + b - both}/${total} = ${F(a + b - both, total)}`],
    traps: both ? [trap("double-count", F(a + b, total), "The students who do both were counted twice. Subtract them once.")] : [trap("multiplied", F(a * b, total * total), "'Or' means ADD for mutually exclusive events.")],
  });
};

generators["L5-S3.2"] = (r, tier) => {
  const [p1, q1] = r.pick([[1, 2], [1, 3], [2, 3], [1, 4], [3, 4], [2, 5], [3, 5]]);
  const [p2, q2] = r.pick([[1, 2], [1, 3], [2, 3], [1, 4], [3, 4], [1, 6], [5, 6]]);
  const names = r.pick([["Ada", "Bola"], ["Chidi", "Tunde"], ["Kemi", "Musa"]]);
  const neither = tier !== "build" && r.chance(0.5);
  const ans = neither ? F((q1 - p1) * (q2 - p2), q1 * q2) : F(p1 * p2, q1 * q2);
  return item({
    skill: "The multiplication rule for independent events",
    prompt: `The probability that ${names[0]} passes is ${p1}/${q1} and that ${names[1]} passes is ${p2}/${q2}, independently. Find the probability that ${neither ? "neither passes" : "both pass"}.`,
    input: frac(),
    answer: ans,
    hints: ["For independent events, P(A and B) = P(A) × P(B).", neither ? `P(${names[0]} fails) = 1 − ${p1}/${q1}; P(${names[1]} fails) = 1 − ${p2}/${q2}.` : `${p1}/${q1} × ${p2}/${q2}`, "Simplify."],
    solution: neither ? [`${q1 - p1}/${q1} × ${q2 - p2}/${q2} = ${ans}`] : [`${p1}/${q1} × ${p2}/${q2} = ${ans}`],
    traps: [neither ? trap("one-minus-both", F(q1 * q2 - p1 * p2, q1 * q2), "1 − P(both pass) is 'not both', which includes one passing. Neither = both fail.") : trap("added", F(p1 * q2 + p2 * q1, q1 * q2), "'And' for independent events means MULTIPLY.")],
  });
};

generators["L5-S3.3"] = (r, tier) => {
  const red = r.int(3, 7);
  const blue = r.int(2, 6);
  const n = red + blue;
  const repl = tier === "build" ? r.chance(0.5) : r.chance(0.35);
  const ans = repl ? F(red * red, n * n) : F(red * (red - 1), n * (n - 1));
  return item({
    skill: repl ? "Two picks with replacement" : "Two picks without replacement",
    prompt: `A bag contains ${red} red and ${blue} blue balls. Two balls are picked one after the other ${repl ? "WITH" : "WITHOUT"} replacement. Find the probability that both are red.`,
    input: frac(),
    answer: ans,
    hints: [repl ? "With replacement, the bag is the same for the second pick." : "Without replacement, one red ball and one ball in total have gone before the second pick.", repl ? `${red}/${n} × ${red}/${n}` : `${red}/${n} × ${red - 1}/${n - 1}`, "Simplify."],
    solution: [repl ? `${red}/${n} × ${red}/${n} = ${ans}` : `${red}/${n} × ${red - 1}/${n - 1} = ${ans}`],
    traps: [repl ? trap("removed", F(red * (red - 1), n * (n - 1)), "The ball is put BACK, so nothing changes for the second pick.") : trap("replaced", F(red * red, n * n), "The first ball is NOT put back: one fewer red and one fewer ball.")],
  });
};

generators["L5-S3.4"] = (r, tier) => {
  const red = r.int(2, 6);
  const blue = r.int(2, 6);
  const n = red + blue;
  const repl = r.chance(0.5);
  const d = repl ? n : n - 1;
  const ans = F(2 * red * blue * (repl ? 1 : 1), n * d);
  return item({
    skill: "Tree diagrams: one of each",
    prompt: `A bag has ${red} red and ${blue} blue balls. Two are picked ${repl ? "with" : "without"} replacement. Find the probability of getting one red and one blue (in either order).`,
    input: frac(),
    answer: ans,
    hints: ["A tree has two branches that give one of each: red then blue, and blue then red.", `RB: ${red}/${n} × ${blue}/${d}; BR: ${blue}/${n} × ${red}/${d}`, "Add the two branches."],
    solution: [`P(RB) + P(BR) = ${2 * red * blue}/${n * d} = ${ans}`],
    traps: [trap("one-order", F(red * blue, n * d), "That is red-then-blue only. Blue-then-red also gives one of each: add both branches.")],
  });
};

generators["L5-S3.5"] = (r, tier) => {
  const [p, q] = r.pick([[1, 2], [1, 3], [1, 4], [1, 6], [2, 5]]);
  const k = byTier(tier, { build: 2, stretch: 3, exam: r.int(3, 4) });
  const thing = q === 6 ? "a fair die is thrown and a six" : q === 2 ? "a fair coin is tossed and a head" : `a trial is repeated and success (probability ${p}/${q})`;
  const ans = F(q ** k - (q - p) ** k, q ** k);
  return item({
    skill: "At least once",
    prompt: q === 6 || q === 2 ? `${thing[0].toUpperCase() + thing.slice(1)} is wanted. It is done ${k} times. Find the probability of at least one ${q === 6 ? "six" : "head"}.` : `The probability of success in one trial is ${p}/${q}. Find the probability of at least one success in ${k} independent trials.`,
    input: frac(),
    answer: ans,
    hints: ["At least one = 1 − P(none).", `P(none) = (${q - p}/${q})^${k}`, `1 − ${(q - p) ** k}/${q ** k}`],
    solution: [`P(none) = ${(q - p) ** k}/${q ** k}`, `P(at least one) = ${ans}`],
    traps: [trap("exactly-all", F(p ** k, q ** k), "That is success EVERY time. At least one = 1 − P(none)."), trap("gave-none", F((q - p) ** k, q ** k), "That is P(none). Subtract it from 1.")],
  });
};

/* ── L6-C1 · Matrices ───────────────────────────────────────────────── */

const mat = (m) => `(${m.map((row) => row.map(sn).join(" ")).join(" ; ")})`;
const entries = { ...list({ placeholder: "entries row by row, e.g. 1, 2, 3, 4" }) };

generators["L6-C1.1"] = (r, tier) => {
  const rows = r.int(1, 4);
  const cols = r.int(1, 4);
  const m = Array.from({ length: rows }, () => Array.from({ length: cols }, () => r.int(-5, 9)));
  const askRows = r.chance(0.5);
  return item({
    skill: "The order of a matrix",
    prompt: `A matrix is written row by row, with ; between rows: ${mat(m)}. Its order is m × n. ${askRows ? "What is m, the number of ROWS?" : "What is n, the number of COLUMNS?"}`,
    input: num(),
    answer: askRows ? rows : cols,
    hints: ["The order is rows × columns.", "Rows go across; each ; starts a new row.", `Count the groups separated by ;.`],
    solution: [`${rows} rows and ${cols} columns: order ${rows} × ${cols}.`],
    traps: rows !== cols ? [askRows ? trap("columns", cols, "That counts the COLUMNS. Rows go across, separated by ;.") : trap("rows", rows, "That counts the ROWS. Columns go down: count the entries in one row.")] : [],
  });
};

generators["L6-C1.2"] = (r, tier) => {
  const A = [[r.int(-5, 9), r.int(-5, 9)], [r.int(-5, 9), r.int(-5, 9)]];
  const B = [[r.int(-5, 9), r.int(-5, 9)], [r.int(-5, 9), r.int(-5, 9)]];
  const k = tier === "build" ? 1 : r.int(2, 3);
  const sub = r.chance(0.5);
  const res = A.flat().map((x, i) => (sub ? k * x - B.flat()[i] : k * x + B.flat()[i]));
  return item({
    skill: "Adding and subtracting matrices",
    prompt: `A = ${mat(A)} and B = ${mat(B)}. Find ${k === 1 ? "" : k}A ${sub ? "−" : "+"} B. Enter the four entries row by row.`,
    input: entries,
    answer: res.join(", "),
    ordered: true,
    hints: [k === 1 ? "Add or subtract the entries in the same position." : `First multiply every entry of A by ${k}.`, sub ? "Subtract B's entry from the matching entry." : "Add matching entries.", `Top-left: ${k === 1 ? "" : `${k} × `}${sn(A[0][0])} ${sub ? "−" : "+"} ${sn(B[0][0])} = ${sn(res[0])}`],
    solution: [`${k === 1 ? "" : k}A ${sub ? "−" : "+"} B = ${mat([res.slice(0, 2), res.slice(2)])}`],
    traps: [],
  });
};

generators["L6-C1.3"] = (r, tier) => {
  const A = [[r.int(-3, 5), r.int(-3, 5)], [r.int(-3, 5), r.int(-3, 5)]];
  const B = [[r.int(-3, 5), r.int(-3, 5)], [r.int(-3, 5), r.int(-3, 5)]];
  const P = [0, 1].map((i) => [0, 1].map((j) => A[i][0] * B[0][j] + A[i][1] * B[1][j]));
  const wrong = [0, 1].map((i) => [0, 1].map((j) => A[i][j] * B[i][j]));
  return item({
    skill: "Multiplying 2 × 2 matrices",
    prompt: `A = ${mat(A)} and B = ${mat(B)}. Find AB. Enter the four entries row by row.`,
    input: entries,
    answer: P.flat().join(", "),
    ordered: true,
    hints: ["Each entry of AB is a ROW of A times a COLUMN of B: multiply pairs and add.", `Top-left = (${sn(A[0][0])})(${sn(B[0][0])}) + (${sn(A[0][1])})(${sn(B[1][0])}) = ${sn(P[0][0])}`, `Top-right = row 1 of A with column 2 of B.`],
    solution: [`AB = ${mat(P)}`],
    traps: [trap("entrywise", wrong.flat().join(", "), "Matrices are not multiplied entry by entry. Use row × column.")],
  });
};

generators["L6-C1.4"] = (r, tier) => {
  let a, b, c, d, det;
  do {
    [a, b, c, d] = [r.int(-4, 7), r.int(-4, 7), r.int(-4, 7), r.int(-4, 7)];
    det = a * d - b * c;
  } while (det === 0 || (tier !== "build" && ![1, -1, 2, -2].includes(det)));
  const M = [[a, b], [c, d]];
  if (tier === "build") {
    return item({
      skill: "The determinant of a 2 × 2 matrix",
      prompt: `Find the determinant of ${mat(M)}.`,
      input: num(),
      answer: det,
      hints: ["For (a b ; c d), the determinant is ad − bc.", `(${sn(a)})(${sn(d)}) − (${sn(b)})(${sn(c)})`, `${sn(a * d)} − ${sn(b * c)}`],
      solution: [`|M| = ${sn(a * d)} − ${sn(b * c)} = ${sn(det)}`],
      traps: [trap("added", a * d + b * c, "It is ad MINUS bc."), trap("wrong-diagonal", b * c - a * d, "Leading diagonal first: ad − bc.")],
    });
  }
  const inv = [d, -b, -c, a].map((x) => F(x, det));
  return item({
    skill: "The inverse of a 2 × 2 matrix",
    prompt: `Find the inverse of ${mat(M)}. Enter the four entries row by row (fractions allowed).`,
    input: entries,
    answer: inv.join(", "),
    ordered: true,
    hints: [`Determinant = ${sn(a * d)} − ${sn(b * c)} = ${sn(det)}.`, "Swap a and d, change the signs of b and c.", `Divide every entry by ${sn(det)}.`],
    solution: [`|M| = ${sn(det)}`, `M⁻¹ = 1/${sn(det)} × ${mat([[d, -b], [-c, a]])}`, `= ${mat([inv.slice(0, 2), inv.slice(2)])}`],
    traps: [trap("no-divide", [d, -b, -c, a].join(", "), "Divide every entry by the determinant.")].filter(() => det !== 1),
  });
};

generators["L6-C1.5"] = (r, tier) => {
  if (tier === "exam" && r.chance(0.5)) {
    const M = Array.from({ length: 3 }, () => Array.from({ length: 3 }, () => r.int(-3, 4)));
    const [[a, b, c], [d, e, f], [g, h, i]] = M;
    const det = a * (e * i - f * h) - b * (d * i - f * g) + c * (d * h - e * g);
    return item({
      skill: "The determinant of a 3 × 3 matrix",
      prompt: `Find the determinant of ${mat(M)}.`,
      input: num(),
      answer: det,
      hints: ["Expand along the top row with signs + − +.", `${sn(a)}(${sn(e)}×${sn(i)} − ${sn(f)}×${sn(h)}) − ${sn(b)}(${sn(d)}×${sn(i)} − ${sn(f)}×${sn(g)}) + ${sn(c)}(${sn(d)}×${sn(h)} − ${sn(e)}×${sn(g)})`, `= ${sn(a * (e * i - f * h))} − ${sn(b * (d * i - f * g))} + ${sn(c * (d * h - e * g))}`],
      solution: [`|M| = ${sn(det)}`],
      traps: [trap("all-plus", a * (e * i - f * h) + b * (d * i - f * g) + c * (d * h - e * g), "The middle term takes a MINUS sign: + − +.")],
    });
  }
  let a, b, c, d, det;
  do {
    [a, b, c, d] = [r.int(1, 5), r.intExcept(-4, 4, [0]), r.int(1, 5), r.intExcept(-4, 4, [0])];
    det = a * d - b * c;
  } while (det === 0);
  const x = r.int(-5, 6);
  const y = r.int(-5, 6);
  const p = a * x + b * y;
  const q = c * x + d * y;
  const eq = (u, v, k) => `${u === 1 ? "" : sn(u)}x ${v < 0 ? "−" : "+"} ${Math.abs(v) === 1 ? "" : Math.abs(v)}y = ${sn(k)}`;
  return item({
    skill: "Solving simultaneous equations with matrices",
    prompt: `Use the inverse matrix to solve ${eq(a, b, p)} and ${eq(c, d, q)}. Give x, y.`,
    input: list({ placeholder: "x, y" }),
    answer: `${x}, ${y}`,
    ordered: true,
    hints: [`Write it as ${mat([[a, b], [c, d]])} (x ; y) = (${sn(p)} ; ${sn(q)}).`, `Determinant = ${sn(det)}; inverse = 1/${sn(det)} × ${mat([[d, -b], [-c, a]])}.`, `x = (${sn(d)} × ${sn(p)} − ${sn(b)} × ${sn(q)}) ÷ ${sn(det)}`],
    solution: [`|M| = ${sn(det)}`, `x = (${sn(d * p)} − ${sn(b * q)}) ÷ ${sn(det)} = ${sn(x)}`, `y = (${sn(a * q)} − ${sn(c * p)}) ÷ ${sn(det)} = ${sn(y)}`],
    traps: [trap("swapped", `${y}, ${x}`, "Give x first, then y.")].filter(() => x !== y),
  });
};

/* ── L6-N1 · Binary operations ──────────────────────────────────────── */

const OPS = [
  { rule: (k) => `a ∗ b = a + b + ${k}`, f: (a, b, k) => a + b + k, e: (k) => -k, inv: (a, k) => -2 * k - a, comm: true, assoc: true },
  { rule: (k) => `a ∗ b = a + b − ${k}`, f: (a, b, k) => a + b - k, e: (k) => k, inv: (a, k) => 2 * k - a, comm: true, assoc: true },
  { rule: (k) => `a ∗ b = ab/${k}`, f: (a, b, k) => (a * b) / k, e: (k) => k, inv: (a, k) => (k * k) / a, comm: true, assoc: true, nonzero: true },
  { rule: (k) => `a ∗ b = ${k}a − b`, f: (a, b, k) => k * a - b, comm: false, assoc: false },
  { rule: (k) => `a ∗ b = a + ${k}b`, f: (a, b, k) => a + k * b, comm: false, assoc: false },
];

generators["L6-N1.1"] = (r, tier) => {
  const op = r.pick(OPS);
  const k = r.int(2, 5);
  const [x, y, z] = [r.intExcept(1, 6, []), r.int(1, 6), r.int(1, 6)];
  if (tier === "build" || r.chance(0.4)) {
    const val = op.f(op.f(x, y, k), z, k);
    return item({
      skill: "Evaluating a binary operation",
      prompt: `On the real numbers, ${op.rule(k)}. Evaluate (${x} ∗ ${y}) ∗ ${z}.`,
      input: frac(),
      answer: Q(val),
      hints: ["Work out the bracket first, using the rule.", `${x} ∗ ${y} = ${Q(op.f(x, y, k))}`, `Now use that as a with b = ${z}.`],
      solution: [`${x} ∗ ${y} = ${Q(op.f(x, y, k))}`, `(${x} ∗ ${y}) ∗ ${z} = ${Q(val)}`],
      traps: [trap("right-first", Q(op.f(x, op.f(y, z, k), k)), "Do the BRACKET first: (x ∗ y), then ∗ z.")].filter((t) => t.is !== Q(val)),
    });
  }
  const prop = r.pick(["commutative", "associative"]);
  const yes = prop === "commutative" ? op.comm : op.assoc;
  return item({
    skill: "Testing a property",
    prompt: `On the real numbers, ${op.rule(k)}. Is ∗ ${prop}? Answer yes or no.`,
    input: choice(["yes", "no"]),
    answer: yes ? "yes" : "no",
    hints: [prop === "commutative" ? "Commutative means a ∗ b = b ∗ a for ALL a and b." : "Associative means (a ∗ b) ∗ c = a ∗ (b ∗ c) for ALL a, b, c.", prop === "commutative" ? `Write out b ∗ a using the rule and compare.` : "Expand both sides with the rule and compare.", `Try numbers: ${prop === "commutative" ? `1 ∗ 2 = ${Q(op.f(1, 2, k))}, 2 ∗ 1 = ${Q(op.f(2, 1, k))}` : `(1 ∗ 2) ∗ 3 = ${Q(op.f(op.f(1, 2, k), 3, k))}, 1 ∗ (2 ∗ 3) = ${Q(op.f(1, op.f(2, 3, k), k))}`}`],
    solution: [yes ? `Both sides simplify to the same expression, so ∗ is ${prop}.` : `A single counterexample is enough: the two sides differ, so ∗ is not ${prop}.`],
    traps: [],
  });
};

generators["L6-N1.2"] = (r, tier) => {
  const op = r.pick(OPS.filter((o) => o.e));
  const k = r.int(2, 5);
  const a = r.intExcept(1, 8, [k]);
  const askInv = tier !== "build" && r.chance(0.6);
  if (!askInv) {
    return item({
      skill: "The identity element",
      prompt: `On the real numbers${op.nonzero ? " (excluding 0)" : ""}, ${op.rule(k)}. Find the identity element e.`,
      input: num(),
      answer: op.e(k),
      hints: ["The identity e satisfies a ∗ e = a for every a.", `Write a ∗ e with the rule and set it equal to a.`, "Solve for e."],
      solution: [`a ∗ e = a  →  e = ${sn(op.e(k))}`],
      traps: [trap("zero", 0, "The identity is not always 0. Solve a ∗ e = a with THIS rule.")].filter(() => op.e(k) !== 0),
    });
  }
  return item({
    skill: "The inverse of an element",
    prompt: `On the real numbers${op.nonzero ? " (excluding 0)" : ""}, ${op.rule(k)}, with identity ${sn(op.e(k))}. Find the inverse of ${a}.`,
    input: frac(),
    answer: F(op.inv(a, k) * a, a),
    hints: [`The inverse a⁻¹ satisfies a ∗ a⁻¹ = e = ${sn(op.e(k))}.`, `${a} ∗ x = ${sn(op.e(k))}, using the rule.`, "Solve for x."],
    solution: [`${a} ∗ x = ${sn(op.e(k))}  →  x = ${sn(F(op.inv(a, k) * a, a))}`],
    traps: [trap("negative", -a, "The inverse depends on the identity. Solve a ∗ x = e with this rule."), trap("reciprocal", F(1, a), "The inverse under ∗ is not 1/a unless ∗ is ordinary multiplication.")].filter((t) => t.is !== F(op.inv(a, k) * a, a)),
  });
};

export default generators;
