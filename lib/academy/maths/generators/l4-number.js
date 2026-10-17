import { item, trap, num, frac, text, expr, byTier } from "./kit.js";
import { simplify, fracText } from "../rng.js";
import { sn } from "./format.js";

/**
 * GENERATORS · LEVEL 4 · BASES IN FULL, MODULAR ARITHMETIC, LOGARITHMS, SURDS
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Contains every answer for L4-N1 to L4-N4.
 * ═════════════════════════════════════════════════════════════════════════
 */

export const generators = {};

const SUB = "₀₁₂₃₄₅₆₇₈₉";
const sub = (b) => String(b).replace(/\d/g, (d) => SUB[d]);
const mod = (a, n) => ((a % n) + n) % n;

/* ── L4-N1.1 · Fractional parts between bases ───────────────────────── */

generators["L4-N1.1"] = (r, tier) => {
  const b = r.pick(byTier(tier, { build: [2], stretch: [2, 4, 5], exam: [2, 3, 4, 5, 8] }));
  const whole = r.int(1, b === 2 ? 15 : b * b);
  const places = b === 2 ? r.int(1, 3) : 1;
  const fracDigits = Array.from({ length: places }, () => r.int(0, b - 1));
  if (fracDigits.every((d) => d === 0)) fracDigits[places - 1] = 1;
  const fracValue = fracDigits.reduce((s, d, i) => s + d / b ** (i + 1), 0);
  const value = whole + fracValue;
  const numeral = `${whole.toString(b)}.${fracDigits.join("")}`;
  if (tier === "build" || r.chance(0.6)) {
    return item({
      skill: "A base numeral with a fractional part, to base ten",
      prompt: `Convert ${numeral}${sub(b)} to base ten.`,
      input: num(),
      answer: value,
      hints: [`After the point, the places are worth 1/${b}, 1/${b * b}, ...`, `Whole part: ${whole.toString(b)}${sub(b)} = ${whole}.`, `Fraction part: ${fracDigits.map((d, i) => `${d}/${b ** (i + 1)}`).join(" + ")}`],
      solution: [`${whole.toString(b)}${sub(b)} = ${whole}`, `.${fracDigits.join("")}${sub(b)} = ${fracDigits.map((d, i) => `${d}/${b ** (i + 1)}`).join(" + ")} = ${fracValue}`, `Total: ${value}`],
      traps: [trap("decimal-places", Number(`${whole}.${fracDigits.join("")}`), `The digits after the point are worth 1/${b}, 1/${b * b}, ..., not tenths and hundredths.`)],
    });
  }
  // base ten fraction to base b: multiply the fractional part by b repeatedly
  const steps = [];
  let f = fracValue;
  const out = [];
  for (let i = 0; i < places; i += 1) {
    const prod = f * b;
    const d = Math.floor(prod + 1e-9);
    steps.push(`${Math.round(f * 10000) / 10000} × ${b} = ${Math.round(prod * 10000) / 10000} → digit ${d}`);
    out.push(d);
    f = prod - d;
  }
  const answer = `${whole.toString(b)}.${out.join("")}`;
  return item({
    skill: "A base ten number with a fractional part, to another base",
    prompt: `Convert ${value} (base ten) to base ${b}.`,
    input: text({ placeholder: "e.g. 101.11" }),
    answer,
    accept: [`${answer}${sub(b)}`, `${answer} base ${b}`],
    hints: [`Whole part: convert ${whole} by repeated division by ${b}.`, `Fraction part: MULTIPLY by ${b} repeatedly; each whole number you get is the next digit.`, steps[0]],
    solution: [`${whole} = ${whole.toString(b)}${sub(b)}`, ...steps, `${value} = ${answer}${sub(b)}`],
    traps: [],
  });
};

/* ── L4-N1.2 · Base equations ───────────────────────────────────────── */

generators["L4-N1.2"] = (r, tier) => {
  if (tier === "build" || r.chance(0.5)) {
    const b = r.int(4, 9);
    const d2 = r.int(1, b - 1);
    const y = r.int(0, b - 1);
    const d0 = r.int(0, b - 1);
    const value = d2 * b * b + y * b + d0;
    return item({
      skill: "Finding a missing digit",
      prompt: `Find the digit y if ${d2}y${d0}${sub(b)} = ${value} (base ten).`,
      input: num(),
      answer: y,
      hints: [`${d2}y${d0}${sub(b)} = ${d2}×${b}² + y×${b} + ${d0}.`, `${d2 * b * b} + ${b}y + ${d0} = ${value}`, `${b}y = ${value - d2 * b * b - d0}`],
      solution: [`${d2 * b * b} + ${b}y + ${d0} = ${value}`, `${b}y = ${value - d2 * b * b - d0}`, `y = ${y}`],
      traps: [],
    });
  }
  // a1 a0 + c1 c0 = d1 d0 in base b, with a carry: the unknown base is a0 + c0 − d0
  const b = r.int(5, 9);
  let a0;
  let c0;
  do {
    a0 = r.int(1, b - 1);
    c0 = r.int(1, b - 1);
  } while (a0 + c0 < b);
  const a1 = r.int(1, Math.floor((b - 2) / 2));
  const c1 = r.int(1, Math.floor((b - 2) / 2));
  const d0 = a0 + c0 - b;
  const d1 = a1 + c1 + 1;
  return item({
    skill: "Finding the base that makes a sum true",
    prompt: `Find the base b in which ${a1}${a0} + ${c1}${c0} = ${d1}${d0}.`,
    input: num(),
    answer: b,
    hints: ["Write every numeral in place-value form with b.", `(${a1}b + ${a0}) + (${c1}b + ${c0}) = ${d1}b + ${d0}`, "Collect the b terms on one side and solve."],
    solution: [`${a1 + c1}b + ${a0 + c0} = ${d1}b + ${d0}`, `${a0 + c0 - d0} = ${d1 - a1 - c1}b`, `b = ${b}`],
    traps: [trap("base-ten-sum", 10, "In base ten the sum would be different. Write each numeral with b and solve.")],
  });
};

/* ── L4-N1.3 · Bases in word problems ───────────────────────────────── */

generators["L4-N1.3"] = (r, tier) => {
  const b = r.int(4, 9);
  const a = r.int(b + 1, b * b - 1);
  const c = r.int(2, Math.min(9, b - 1));
  const productStr = (a * c).toString(b);
  const aStr = a.toString(b);
  return item({
    skill: "Identifying the base from a calculation",
    prompt: `In which base is the calculation ${aStr} × ${c} = ${productStr} correct?`,
    input: num(),
    answer: b,
    hints: ["Every digit must be less than the base, so the base is bigger than the largest digit shown.", "Try bases just above the largest digit: convert both sides to base ten and compare.", `In base ${b}: ${aStr} = ${a}, and ${a} × ${c} = ${a * c}.`],
    solution: [`In base ${b}: ${aStr}${sub(b)} = ${a}`, `${a} × ${c} = ${a * c}`, `${a * c} = ${productStr}${sub(b)} ✓`],
    traps: [trap("ten", 10, "The calculation is false in base ten: check it.")],
  });
};

/* ── L4-N2 · Modular arithmetic ─────────────────────────────────────── */

const MARKET_DAYS = ["Eke", "Orie", "Afor", "Nkwo"];
const WEEK = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

generators["L4-N2.1"] = (r, tier) => {
  const n = r.int(3, 12);
  const a = byTier(tier, { build: r.int(n + 1, 99), stretch: r.int(100, 999), exam: -r.int(1, 60) });
  const answer = mod(a, n);
  return item({
    skill: "Remainders: a mod n",
    prompt: `Find ${sn(a)} mod ${n}.`,
    input: num(),
    answer,
    hints: [`a mod ${n} is the remainder when a is divided by ${n}, always from 0 to ${n - 1}.`, a < 0 ? `For a negative number, add ${n} until you reach the range 0 to ${n - 1}.` : `${a} ÷ ${n} = ${Math.floor(a / n)} remainder ...`, a < 0 ? `${a} + ${n * Math.ceil(-a / n)} = ${answer}` : `${n} × ${Math.floor(a / n)} = ${n * Math.floor(a / n)}`],
    solution: a < 0 ? [`${a} + ${n * Math.ceil(-a / n)} = ${answer}`, `${sn(a)} ≡ ${answer} (mod ${n})`] : [`${a} = ${n} × ${Math.floor(a / n)} + ${answer}`, `${a} ≡ ${answer} (mod ${n})`],
    traps: [a < 0 ? trap("negative-remainder", -mod(-a, n) || null, `A remainder mod ${n} is always between 0 and ${n - 1}. Add ${n} to make it so.`) : trap("gave-quotient", Math.floor(a / n), "That is how many times it divides. The answer is the REMAINDER.")].filter((t) => t.is !== null && t.is !== 0),
  });
};

generators["L4-N2.2"] = (r, tier) => {
  const n = r.int(4, 12);
  const a = r.int(1, n - 1);
  const b = r.int(1, n - 1);
  const subtract = tier !== "build" && r.chance(0.5);
  const answer = mod(subtract ? a - b : a + b, n);
  if (tier === "exam" && r.chance(0.5)) {
    const start = r.int(0, 3);
    const days = r.int(10, 200);
    const end = MARKET_DAYS[(start + days) % 4];
    return item({
      skill: "Modular arithmetic in the four-day market week",
      prompt: `The Igbo market week has four days: Eke, Orie, Afor, Nkwo, then back to Eke. Today is ${MARKET_DAYS[start]}. Which market day will it be in ${days} days?`,
      input: { kind: "choice", options: MARKET_DAYS },
      answer: end,
      hints: ["The days repeat every 4: this is arithmetic mod 4.", `${days} mod 4 = ${days % 4}.`, `Count ${days % 4} days on from ${MARKET_DAYS[start]}.`],
      solution: [`${days} = 4 × ${Math.floor(days / 4)} + ${days % 4}`, `${days % 4} days after ${MARKET_DAYS[start]} is ${end}.`],
      traps: [trap("off-by-one", MARKET_DAYS[(start + days + 1) % 4], "Count on from today: after 1 day it is the NEXT market day.")],
    });
  }
  return item({
    skill: subtract ? "Subtraction mod n" : "Addition mod n",
    prompt: `Work out ${a} ${subtract ? "−" : "+"} ${b} (mod ${n}).`,
    input: num(),
    answer,
    hints: [`Work it out normally: ${a} ${subtract ? "−" : "+"} ${b} = ${subtract ? a - b : a + b}.`, `Then reduce mod ${n}: the answer must be from 0 to ${n - 1}.`, subtract && a < b ? `A negative result: add ${n}.` : `Subtract ${n} if the result is ${n} or more.`],
    solution: [`${a} ${subtract ? "−" : "+"} ${b} = ${subtract ? a - b : a + b}`, `≡ ${answer} (mod ${n})`],
    traps: [trap("not-reduced", subtract ? a - b : a + b, `Reduce the answer mod ${n}: it must be between 0 and ${n - 1}.`)],
  });
};

generators["L4-N2.3"] = (r, tier) => {
  const n = r.int(5, 12);
  const a = r.int(2, n - 1);
  const b = r.int(2, n - 1);
  const answer = mod(a * b, n);
  return item({
    skill: "Multiplication mod n",
    prompt: `Work out ${a} × ${b} (mod ${n}).`,
    input: num(),
    answer,
    hints: [`${a} × ${b} = ${a * b}.`, `Divide by ${n} and keep the remainder.`, `${a * b} = ${n} × ${Math.floor((a * b) / n)} + ${answer}`],
    solution: [`${a} × ${b} = ${a * b}`, `${a * b} ≡ ${answer} (mod ${n})`],
    traps: [trap("not-reduced", a * b, `Reduce mod ${n}.`)],
  });
};

generators["L4-N2.4"] = (r, tier) => {
  if (r.chance(0.5)) {
    const n = r.pick([5, 7, 11]);
    const a = r.int(2, n - 1);
    const x = r.int(1, n - 1);
    const b = mod(a * x, n);
    return item({
      skill: "Solving a modular equation",
      prompt: `Solve ${a}x ≡ ${b} (mod ${n}), where x is one of 0, 1, ..., ${n - 1}.`,
      input: num(),
      answer: x,
      hints: [`Try each value of x from 0 to ${n - 1}.`, `Work out ${a}x mod ${n} for each.`, `Which one gives ${b}?`],
      solution: [`${a} × ${x} = ${a * x} ≡ ${b} (mod ${n})`, `x = ${x}`],
      traps: [trap("divided", Math.round((b / a) * 100) / 100, `Dividing does not work in modular arithmetic: try each x from 0 to ${n - 1}.`)],
    });
  }
  const start = r.int(0, 6);
  const days = r.int(20, 400);
  return item({
    skill: "Cycles of days",
    prompt: `Today is ${WEEK[start]}. What day of the week will it be in ${days} days?`,
    input: { kind: "choice", options: WEEK },
    answer: WEEK[(start + days) % 7],
    hints: ["Days of the week repeat every 7: work mod 7.", `${days} mod 7 = ${days % 7}.`, `Count ${days % 7} days on from ${WEEK[start]}.`],
    solution: [`${days} = 7 × ${Math.floor(days / 7)} + ${days % 7}`, `${days % 7} days after ${WEEK[start]} is ${WEEK[(start + days) % 7]}.`],
    traps: [trap("off-by-one", WEEK[(start + days + 1) % 7], "Count on carefully: 1 day after Monday is Tuesday.")],
  });
};

/* ── L4-N3 · Logarithms ─────────────────────────────────────────────── */

generators["L4-N3.1"] = (r, tier) => {
  const base = r.pick([2, 3, 5, 10]);
  const k = byTier(tier, { build: r.int(1, 4), stretch: r.int(-3, 4), exam: r.int(-3, 5) });
  const kind = tier === "exam" && r.chance(0.4) ? "fractional" : "power";
  if (kind === "fractional") {
    const [bb, p, q] = r.pick([[8, 2, 3], [27, 1, 3], [4, 3, 2], [9, 3, 2], [16, 3, 4], [32, 2, 5]]);
    const root = Math.round(Math.pow(bb, 1 / q));
    const arg = root ** p;
    return item({
      skill: "A logarithm with a fractional answer",
      prompt: `Evaluate log${sub(bb)} ${arg}.`,
      input: frac(),
      answer: fracText(...simplify(p, q)),
      hints: [`log${sub(bb)} ${arg} = x means ${bb}ˣ = ${arg}.`, `Write both as powers of ${root}: ${bb} = ${root}^${q}, ${arg} = ${root}^${p}.`, `${q}x = ${p}`],
      solution: [`${bb}ˣ = ${arg}`, `${root}^(${q}x) = ${root}^${p}`, `x = ${fracText(...simplify(p, q))}`],
      traps: [trap("upside-down", fracText(...simplify(q, p)), `${q}x = ${p} gives x = ${p}/${q}.`)],
    });
  }
  const arg = base ** k;
  const shownArg = k < 0 ? `1/${base ** -k}` : String(arg);
  return item({
    skill: "A logarithm as an index",
    prompt: `Evaluate log${sub(base)} ${shownArg}.`,
    input: num(),
    answer: k,
    hints: [`log${sub(base)} N asks: what power of ${base} gives N?`, k < 0 ? `1/${base ** -k} = ${base}^(−${-k})` : `${base}^? = ${arg}`, `So the answer is the index.`],
    solution: [`${base}^${k} = ${shownArg}`, `log${sub(base)} ${shownArg} = ${k}`],
    traps: [trap("divided", Math.round((arg / base) * 100) / 100, "A logarithm is a POWER, not a quotient."), k < 0 ? trap("dropped-sign", -k, "1 over a power means a NEGATIVE index.") : null].filter(Boolean),
  });
};

generators["L4-N3.2"] = (r, tier) => {
  const kind = r.pick(byTier(tier, { build: ["add", "subtract"], stretch: ["add", "subtract", "power"], exam: ["power", "mixed"] }));
  if (kind === "add") {
    const [a, b, total] = r.pick([[2, 50, 100], [4, 25, 100], [8, 125, 1000], [5, 20, 100], [20, 50, 1000], [25, 40, 1000]]);
    return item({ skill: "log a + log b = log ab", prompt: `Evaluate log ${a} + log ${b} without tables (log means log base 10).`, input: num(), answer: Math.round(Math.log10(total)), hints: ["log a + log b = log (a × b).", `${a} × ${b} = ${total}`, `log ${total} = ?`], solution: [`log ${a} + log ${b} = log ${total} = ${Math.round(Math.log10(total))}`], traps: [trap("added-inside", Math.round(Math.log10(a + b) * 1000) / 1000, "log a + log b is log of the PRODUCT, not the sum.")] });
  }
  if (kind === "subtract") {
    const base = r.pick([2, 3]);
    const k = r.int(2, 5);
    const d = r.pick([3, 5, 7]);
    const a = base ** k * d;
    return item({ skill: "log a − log b = log (a/b)", prompt: `Evaluate log${sub(base)} ${a} − log${sub(base)} ${d}.`, input: num(), answer: k, hints: ["log a − log b = log (a ÷ b).", `${a} ÷ ${d} = ${base ** k}`, `log${sub(base)} ${base ** k} = ?`], solution: [`= log${sub(base)} (${a} ÷ ${d}) = log${sub(base)} ${base ** k} = ${k}`], traps: [trap("subtracted-inside", Math.round((Math.log(a - d) / Math.log(base)) * 1000) / 1000, "log a − log b is log of the QUOTIENT a/b.")] });
  }
  if (kind === "power") {
    // n log x + log y, chosen so x^n × y is 100 or 1000
    const [x, n, y, total] = r.pick([[5, 2, 4, 100], [2, 2, 25, 100], [2, 3, 125, 1000], [5, 3, 8, 1000], [10, 2, 10, 1000]]);
    const val = Math.round(Math.log10(total));
    return item({
      skill: "n log a = log aⁿ",
      prompt: `Evaluate ${n} log ${x} + log ${y} without tables (log means log base 10).`,
      input: num(),
      answer: val,
      hints: [`${n} log ${x} = log ${x}${"⁰¹²³⁴⁵"[n]} = log ${x ** n}.`, `log ${x ** n} + log ${y} = log ${x ** n * y}`, `log ${total} = ${val}`],
      solution: [`${n} log ${x} = log ${x ** n}`, `log ${x ** n} + log ${y} = log ${total} = ${val}`],
      traps: [trap("multiplied-number", Math.round(Math.log10(n * x * y) * 1000) / 1000, `${n} log ${x} is log ${x}^${n}, not log (${n} × ${x}).`)],
    });
  }
  // log a + 2 log b − log c, to 3 decimal places
  const [a, b, c] = r.pick([[8, 5, 4], [2, 25, 5], [4, 50, 2], [3, 10, 6]]);
  const inside = (a * b * b) / c;
  const answer = Math.round(Math.log10(inside) * 1000) / 1000;
  return item({
    skill: "Combining the laws of logarithms",
    prompt: `Express log ${a} + 2 log ${b} − log ${c} as a single logarithm, then evaluate it to 3 decimal places.`,
    input: num(),
    answer,
    tolerance: 0.0015,
    hints: ["2 log b = log b².", `= log (${a} × ${b * b} ÷ ${c})`, `= log ${inside}`],
    solution: [`log ${a} + log ${b * b} − log ${c} = log (${a} × ${b * b} ÷ ${c}) = log ${inside} = ${answer}`],
    traps: [trap("no-square", Math.round(Math.log10((a * b * 2) / c) * 1000) / 1000, "2 log b = log b², not log 2b.")],
  });
};

generators["L4-N3.3"] = (r, tier) => {
  const exp = byTier(tier, { build: r.int(0, 4), stretch: r.int(-3, 5), exam: r.int(-4, 5) });
  const mant = r.int(1000, 9999) / 1000;
  const value = Number((mant * 10 ** exp).toPrecision(4));
  const characteristic = exp;
  const show = value >= 1 ? value.toLocaleString("en-US") : value.toFixed(Math.abs(exp) + 3);
  if (r.chance(0.6)) {
    return item({
      skill: "The characteristic of a logarithm",
      prompt: `What is the characteristic (whole-number part) of log ${show}? For a negative characteristic such as 3̄ (bar 3), type −3.`,
      input: num(),
      answer: characteristic,
      hints: ["Write the number in standard form: A × 10ⁿ.", "The characteristic is n, the power of 10.", `${show} = ${mant} × 10^${exp}`],
      solution: [`${show} = ${mant} × 10^${exp}`, `Characteristic = ${exp}${exp < 0 ? ` (written ${-exp}̄)` : ""}`],
      traps: [trap("counted-digits", String(Math.floor(value)).length, "The characteristic is the power of 10 in standard form, one less than the number of digits before the point for numbers above 1."), exp < 0 ? trap("positive", -exp, "Numbers less than 1 have a NEGATIVE characteristic (bar notation).") : null].filter((t) => t && t.is !== characteristic),
    });
  }
  const a = r.int(12, 99) / 10;
  const b = r.int(12, 99) / 10;
  const p = Math.round(a * b * 100) / 100;
  return item({
    skill: "Multiplying using logarithms",
    prompt: `Using log ${a} = ${Math.log10(a).toFixed(4)} and log ${b} = ${Math.log10(b).toFixed(4)}, find ${a} × ${b} to 2 decimal places by logarithms.`,
    input: num(),
    answer: p,
    tolerance: 0.02,
    hints: ["log (a × b) = log a + log b.", `${Math.log10(a).toFixed(4)} + ${Math.log10(b).toFixed(4)} = ${(Math.log10(a) + Math.log10(b)).toFixed(4)}`, "The antilog of that sum is the product: 10 to that power."],
    solution: [`log a + log b = ${(Math.log10(a) + Math.log10(b)).toFixed(4)}`, `antilog = ${p}`],
    traps: [trap("added-numbers", Math.round((a + b) * 100) / 100, "Adding logs MULTIPLIES the numbers. The answer is a × b.")],
  });
};

generators["L4-N3.4"] = (r, tier) => {
  const [base, arg, p, q] = r.pick([[4, 8, 3, 2], [8, 4, 2, 3], [9, 27, 3, 2], [27, 9, 2, 3], [4, 32, 5, 2], [16, 8, 3, 4], [25, 125, 3, 2]]);
  if (tier !== "build" && r.chance(0.4)) {
    const a = r.pick([2, 3, 5, 7]);
    const b = r.pick([3, 5, 7, 11].filter((v) => v !== a));
    return item({ skill: "log_b a × log_a b = 1", prompt: `Evaluate log${sub(a)} ${b} × log${sub(b)} ${a}.`, input: num(), answer: 1, hints: ["Change both to base 10.", `(log ${b}/log ${a}) × (log ${a}/log ${b})`, "Everything cancels."], solution: [`= (log ${b}/log ${a}) × (log ${a}/log ${b}) = 1`], traps: [] });
  }
  const [n, d] = simplify(p, q);
  return item({
    skill: "Change of base",
    prompt: `Evaluate log${sub(base)} ${arg} as a fraction.`,
    input: frac(),
    answer: fracText(n, d),
    hints: ["Change of base: logₐ N = log N / log a (any base will do).", `Both ${base} and ${arg} are powers of the same number.`, `log${sub(base)} ${arg} = ${p}/${q}`],
    solution: [`${base} and ${arg} are powers of ${Math.round(Math.pow(base, 1 / q))}`, `log${sub(base)} ${arg} = ${p}/${q}`],
    traps: [trap("upside-down", fracText(...simplify(q, p)), "That is log of the base to the base of the number: the fraction is upside down.")],
  });
};

generators["L4-N3.5"] = (r, tier) => {
  const kind = r.pick(byTier(tier, { build: ["log-to-x", "find-base"], stretch: ["log-to-x", "combine"], exam: ["combine", "exponential"] }));
  if (kind === "log-to-x") {
    const base = r.pick([2, 3, 5]);
    const k = r.int(2, 5);
    return item({ skill: "Solving log x = k", prompt: `Solve log${sub(base)} x = ${k}.`, input: num(), answer: base ** k, hints: ["Rewrite as an index: x = base^k.", `x = ${base}^${k}`, "Work it out."], solution: [`x = ${base}^${k} = ${base ** k}`], traps: [trap("multiplied", base * k, `log${sub(base)} x = ${k} means x = ${base}^${k}, not ${base} × ${k}.`)] });
  }
  if (kind === "find-base") {
    const b = r.int(2, 6);
    const k = r.int(2, 4);
    return item({ skill: "Finding the base of a logarithm", prompt: `Solve log_x ${b ** k} = ${k}.`, input: num(), answer: b, hints: [`x^${k} = ${b ** k}`, `Take the ${k === 2 ? "square" : k === 3 ? "cube" : `${k}th`} root.`, `x = ${b}`], solution: [`x^${k} = ${b ** k}`, `x = ${b}`], traps: [trap("divided", (b ** k) / k, "x is the base: x to the power k equals the number.")] });
  }
  if (kind === "combine") {
    // log x + log (x + p) = log q  →  x² + px − q = 0, x positive
    const x = r.int(2, 9);
    const p = r.int(1, 6);
    const q = x * (x + p);
    return item({ skill: "Combining logs to form an equation", prompt: `Solve log x + log (x + ${p}) = log ${q}.`, input: num(), answer: x, hints: ["log x + log (x + p) = log x(x + p).", `x(x + ${p}) = ${q}, so x² + ${p}x − ${q} = 0.`, "Factorise. A logarithm needs a POSITIVE argument, so reject any negative root."], solution: [`x² + ${p}x − ${q} = 0`, `(x − ${x})(x + ${x + p}) = 0`, `x = ${x} (x = −${x + p} is rejected: log of a negative is undefined)`], traps: [trap("kept-negative", -(x + p), "A logarithm of a negative number is undefined, so that root must be rejected.")] });
  }
  const base = r.pick([2, 3, 5]);
  const target = r.pick([7, 10, 12, 20, 30].filter((t) => t !== base));
  const x = Math.round((Math.log(target) / Math.log(base)) * 1000) / 1000;
  return item({ skill: "Solving an exponential equation with logarithms", prompt: `Solve ${base}^x = ${target}, giving x to 3 decimal places.`, input: num(), answer: x, tolerance: 0.0015, hints: ["Take logs of both sides: x log " + base + " = log " + target + ".", `x = log ${target} / log ${base}`, `= ${Math.log10(target).toFixed(4)} / ${Math.log10(base).toFixed(4)}`], solution: [`x log ${base} = log ${target}`, `x = log ${target}/log ${base} = ${x}`], traps: [trap("divided-numbers", Math.round((target / base) * 1000) / 1000, "Divide the LOGS, not the numbers: x = log " + target + " / log " + base + ".")] });
};

/* ── L4-N4 · Surds ──────────────────────────────────────────────────── */

const SQUAREFREE = [2, 3, 5, 6, 7, 10, 11];
const surd = (k, n) => (k === 1 ? `√${n}` : `${k}√${n}`);

generators["L4-N4.1"] = (r, tier) => {
  const n = r.pick(SQUAREFREE);
  const k = r.int(2, byTier(tier, { build: 5, stretch: 7, exam: 9 }));
  const outside = tier === "exam" && r.chance(0.5) ? r.int(2, 4) : 1;
  const inside = k * k * n;
  return item({
    skill: "Simplifying a surd",
    prompt: `Simplify ${outside === 1 ? "" : outside}√${inside}.`,
    input: expr({ placeholder: "e.g. 3√2" }),
    answer: surd(outside * k, n),
    exact: "surd-simplest",
    hints: [`Find the largest square number that divides ${inside}.`, `${inside} = ${k * k} × ${n}`, `√${inside} = √${k * k} × √${n} = ${k}√${n}`],
    solution: [`√${inside} = √(${k * k} × ${n}) = ${k}√${n}`, outside > 1 ? `${outside} × ${k}√${n} = ${surd(outside * k, n)}` : null].filter(Boolean),
    traps: [trap("not-largest-square", surd(outside * (k / (k % 2 === 0 ? 2 : 1)), n * (k % 2 === 0 ? 4 : 1)), "Use the LARGEST square factor, or the surd is not fully simplified.")],
  });
};

generators["L4-N4.2"] = (r, tier) => {
  const n = r.pick([2, 3, 5]);
  const a = r.int(1, 5);
  const b = r.int(2, 5);
  const subtract = r.chance(0.4);
  const k1 = r.int(1, 3);
  const total = subtract ? k1 * a - b : k1 * a + b;
  if (total === 0) return generators["L4-N4.2"](r, "build");
  const first = `${k1 === 1 ? "" : k1}√${a * a * n}`;
  const second = `√${b * b * n}`;
  return item({
    skill: subtract ? "Subtracting surds" : "Adding surds",
    prompt: `Simplify ${first} ${subtract ? "−" : "+"} ${second}.`,
    input: expr({ placeholder: "e.g. 7√2" }),
    answer: surd(total, n).replace(/^-?1√/, (m) => m.replace("1", "")),
    exact: "surd-simplest",
    hints: ["Only LIKE surds can be added: simplify each first so they have the same root.", `√${a * a * n} = ${a}√${n} and √${b * b * n} = ${b}√${n}.`, `${k1 * a}√${n} ${subtract ? "−" : "+"} ${b}√${n}`],
    solution: [`${first} = ${k1 * a}√${n}`, `${second} = ${b}√${n}`, `${k1 * a}√${n} ${subtract ? "−" : "+"} ${b}√${n} = ${surd(total, n)}`],
    traps: [trap("added-under-root", `√${subtract ? Math.abs(k1 * k1 * a * a * n - b * b * n) : k1 * k1 * a * a * n + b * b * n}`, "√a + √b is NOT √(a + b). Simplify each surd, then add like terms.")],
  });
};

generators["L4-N4.3"] = (r, tier) => {
  const kind = r.pick(byTier(tier, { build: ["simple"], stretch: ["simple", "conjugate"], exam: ["conjugate", "square"] }));
  if (kind === "simple") {
    const [a, b] = r.pick([[6, 15], [8, 2], [12, 3], [10, 15], [6, 8], [14, 21], [5, 20], [18, 2], [3, 15], [2, 10]]);
    const prod = a * b;
    let out = 1;
    let rest = prod;
    for (let k = 2; k * k <= rest; k += 1) while (rest % (k * k) === 0) { rest /= k * k; out *= k; }
    const answer = rest === 1 ? String(out) : surd(out, rest);
    return item({
      skill: "Multiplying surds",
      prompt: `Simplify √${a} × √${b}.`,
      input: expr({ placeholder: "e.g. 3√10" }),
      answer,
      exact: "surd-simplest",
      hints: ["√a × √b = √(ab).", `√${a} × √${b} = √${prod}`, "Then simplify the surd."],
      solution: [`√${a} × √${b} = √${prod}`, `= ${answer}`],
      traps: [trap("added", `√${a + b}`, "Multiply under the root: √a × √b = √(ab).")],
    });
  }
  if (kind === "conjugate") {
    const a = r.int(2, 6);
    const n = r.pick([2, 3, 5, 7].filter((v) => v !== a * a));
    const value = a * a - n;
    return item({
      skill: "Multiplying conjugate surds",
      prompt: `Simplify (${a} + √${n})(${a} − √${n}).`,
      input: num(),
      answer: value,
      hints: ["This is (x + y)(x − y) = x² − y².", `${a}² − (√${n})²`, `${a * a} − ${n}`],
      solution: [`= ${a}² − (√${n})² = ${a * a} − ${n} = ${value}`],
      traps: [trap("missed-square", a * a - Math.round(Math.sqrt(n) * 100) / 100, `(√${n})² = ${n}, not √${n}.`)],
    });
  }
  const a = r.int(1, 4);
  const n = r.pick([2, 3, 5]);
  return item({
    skill: "Squaring a surd expression",
    prompt: `Expand (${a} + √${n})².`,
    input: expr({ placeholder: "e.g. 7 + 4√3" }),
    answer: `${a * a + n} + ${2 * a}√${n}`,
    hints: ["(x + y)² = x² + 2xy + y².", `x = ${a}, y = √${n}`, `${a * a} + 2 × ${a} × √${n} + ${n}`],
    solution: [`= ${a * a} + ${2 * a}√${n} + ${n}`, `= ${a * a + n} + ${2 * a}√${n}`],
    traps: [trap("missed-middle", String(a * a + n), "The middle term 2xy is missing: (x + y)² is not x² + y².")],
  });
};

generators["L4-N4.4"] = (r, tier) => {
  if (tier === "exam" && r.chance(0.5)) {
    // a² > n so the denominator after rationalising is a positive whole number
    const a = r.int(2, 4);
    const n = r.pick([2, 3, 5, 6, 7, 10, 11].filter((v) => v < a * a));
    const den = a * a - n;
    return item({
      skill: "Rationalising with the conjugate",
      prompt: `Rationalise the denominator of 1/(${a} − √${n}).`,
      input: expr({ placeholder: "e.g. (3 + √2)/7" }),
      answer: den === 1 ? `${a} + √${n}` : `(${a} + √${n})/${den}`,
      exact: "rationalised",
      hints: [`Multiply top and bottom by the conjugate, ${a} + √${n}.`, `Bottom: (${a} − √${n})(${a} + √${n}) = ${a * a} − ${n} = ${den}.`, `Top: ${a} + √${n}.`],
      solution: [`× (${a} + √${n})/(${a} + √${n})`, `= (${a} + √${n})/(${a * a} − ${n})`, den === 1 ? `= ${a} + √${n}` : `= (${a} + √${n})/${den}`],
      traps: [trap("wrong-conjugate", `(${a} - √${n})/${den}`, `Multiply by the CONJUGATE, ${a} + √${n}: change the sign between the terms.`)],
    });
  }
  const n = r.pick([2, 3, 5, 6, 7]);
  const k = r.int(1, 4) * n;
  const coef = k / n;
  return item({
    skill: "Rationalising a denominator √n",
    prompt: `Rationalise the denominator of ${k}/√${n}.`,
    input: expr({ placeholder: "e.g. 2√3" }),
    answer: coef === 1 ? `√${n}` : `${coef}√${n}`,
    exact: "rationalised",
    hints: [`Multiply top and bottom by √${n}.`, `${k}√${n} / ${n}`, `${k} ÷ ${n} = ${coef}`],
    solution: [`${k}/√${n} × √${n}/√${n} = ${k}√${n}/${n} = ${coef === 1 ? "" : coef}√${n}`],
    traps: [trap("left-root-bottom", `${k}√${n}`, `After multiplying by √${n}/√${n}, the bottom is ${n}: divide by it.`)],
  });
};

export default generators;
