import { item, trap, num, frac, expr, byTier } from "./kit.js";
import { simplify, fracText } from "../rng.js";

/**
 * GENERATORS · LEVEL 2 · INDICES AND STANDARD FORM
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Contains every answer for L2-N1.
 * ═════════════════════════════════════════════════════════════════════════
 */

export const generators = {};

const sup = (n) => String(n).replace(/-/g, "⁻").replace(/\d/g, (d) => "⁰¹²³⁴⁵⁶⁷⁸⁹"[d]);

/* ── L2-N1.1 · Laws of indices ──────────────────────────────────────── */

generators["L2-N1.1"] = (r, tier) => {
  const law = r.pick(["multiply", "divide", "power"]);
  const letter = r.pick(["x", "a", "y", "p"]);

  if (tier === "build") {
    const m = r.int(2, 7);
    const n = r.int(2, 6);
    const base = r.pick([2, 3, 5]);
    if (law === "power") {
      return item({
        skill: "A power of a power",
        prompt: `Simplify (${letter}${sup(m)})${sup(n)}, giving your answer as a single power of ${letter}.`,
        input: expr(),
        answer: `${letter}^${m * n}`,
        hints: ["(aᵐ)ⁿ means aᵐ multiplied by itself n times.", "So the powers MULTIPLY.", `${m} × ${n} = ${m * n}`],
        solution: [`(${letter}${sup(m)})${sup(n)} is ${n} lots of ${letter}${sup(m)} multiplied together.`, `Multiply the powers: ${m} × ${n} = ${m * n}, so the answer is ${letter}${sup(m * n)}.`],
        traps: [trap("added-powers", `${letter}^${m + n}`, `That adds the powers. For a power of a power, multiply them: ${letter}${sup(m * n)}.`)],
      });
    }
    if (law === "divide") {
      const big = m + n;
      return item({
        skill: "Dividing powers of the same base",
        prompt: `Simplify ${base}${sup(big)} ÷ ${base}${sup(n)}, and give the answer as a number.`,
        input: num(),
        answer: base ** m,
        hints: ["aᵐ ÷ aⁿ = aᵐ⁻ⁿ: subtract the powers.", `${big} − ${n} = ${m}`, `${base}${sup(m)} = ?`],
        solution: [`${base}${sup(big)} ÷ ${base}${sup(n)} = ${base}${sup(m)}`, `${base}${sup(m)} = ${base ** m}`],
        traps: [trap("divided-powers", base ** (big / n), "That divides the powers. When dividing, SUBTRACT them.")],
      });
    }
    return item({
      skill: "Multiplying powers of the same base",
      prompt: `Simplify ${letter}${sup(m)} × ${letter}${sup(n)}, giving your answer as a single power of ${letter}.`,
      input: expr(),
      answer: `${letter}^${m + n}`,
      hints: ["aᵐ × aⁿ = aᵐ⁺ⁿ: add the powers.", `${letter}${sup(m)} is ${m} ${letter}'s multiplied together, ${letter}${sup(n)} is ${n} more.`, `${m} + ${n} = ${m + n}`],
      solution: [`${letter}${sup(m)} × ${letter}${sup(n)} = ${letter}${sup(m + n)}`],
      traps: [trap("multiplied-powers", `${letter}^${m * n}`, "That multiplies the powers. When multiplying powers of the same base, ADD them.")],
    });
  }

  const c1 = r.int(2, 6);
  const c2 = r.int(2, 5);
  const m = r.int(3, 8);
  const n = r.int(2, m - 1);
  if (law === "multiply") {
    return item({
      skill: "Multiplying terms with coefficients and powers",
      prompt: `Simplify ${c1}${letter}${sup(m)} × ${c2}${letter}${sup(n)}.`,
      input: expr(),
      answer: `${c1 * c2}${letter}^${m + n}`,
      hints: ["Multiply the numbers. Add the powers of the letter.", `${c1} × ${c2} = ${c1 * c2}`, `${m} + ${n} = ${m + n}`],
      solution: [`Numbers: ${c1} × ${c2} = ${c1 * c2}`, `Powers: ${letter}${sup(m)} × ${letter}${sup(n)} = ${letter}${sup(m + n)}`, `Answer: ${c1 * c2}${letter}${sup(m + n)}`],
      traps: [trap("added-coefficients", `${c1 + c2}${letter}^${m + n}`, `The numbers MULTIPLY: ${c1} × ${c2} = ${c1 * c2}. Only the powers are added.`), trap("multiplied-powers", `${c1 * c2}${letter}^${m * n}`, "Add the powers when multiplying, do not multiply them.")],
    });
  }
  if (law === "divide") {
    const top = c1 * c2;
    return item({
      skill: "Dividing terms with coefficients and powers",
      prompt: `Simplify ${top}${letter}${sup(m)} ÷ ${c2}${letter}${sup(n)}.`,
      input: expr(),
      answer: `${c1}${letter}^${m - n}`,
      hints: ["Divide the numbers. Subtract the powers.", `${top} ÷ ${c2} = ${c1}`, `${m} − ${n} = ${m - n}`],
      solution: [`${top} ÷ ${c2} = ${c1}`, `${letter}${sup(m)} ÷ ${letter}${sup(n)} = ${letter}${sup(m - n)}`, `Answer: ${c1}${letter}${sup(m - n)}`],
      traps: [trap("subtracted-coefficients", `${top - c2}${letter}^${m - n}`, `Divide the numbers: ${top} ÷ ${c2} = ${c1}.`)],
    });
  }
  const k = r.int(2, 3);
  return item({
    skill: "Raising a term with a coefficient to a power",
    prompt: `Simplify (${c2}${letter}${sup(n)})${sup(k)}.`,
    input: expr(),
    answer: `${c2 ** k}${letter}^${n * k}`,
    hints: ["Everything inside the bracket is raised to the power.", `The number: ${c2}${sup(k)} = ${c2 ** k}.`, `The letter: multiply the powers, ${n} × ${k} = ${n * k}.`],
    solution: [`${c2}${sup(k)} = ${c2 ** k}`, `(${letter}${sup(n)})${sup(k)} = ${letter}${sup(n * k)}`, `Answer: ${c2 ** k}${letter}${sup(n * k)}`],
    traps: [trap("coefficient-not-powered", `${c2}${letter}^${n * k}`, `The ${c2} is inside the bracket too, so it is raised to the power ${k}: ${c2 ** k}.`), trap("coefficient-multiplied", `${c2 * k}${letter}^${n * k}`, `${c2}${sup(k)} means ${c2} multiplied by itself ${k} times, not ${c2} × ${k}.`)],
  });
};

/* ── L2-N1.2 · Zero and negative indices ────────────────────────────── */

generators["L2-N1.2"] = (r, tier) => {
  const kind = r.pick(byTier(tier, { build: ["zero", "negative"], stretch: ["negative", "negative-fraction"], exam: ["negative-fraction", "mixed"] }));

  if (kind === "zero") {
    const base = r.pick([5, 17, 243, "x", "(3/4)", "2y"]);
    return item({
      skill: "Anything (except 0) to the power 0 is 1",
      prompt: `Evaluate ${base}⁰.`,
      input: num(),
      answer: 1,
      hints: ["a⁰ = 1 for any a that is not 0.", "Why: a³ ÷ a³ = a⁰ by the division law, and anything divided by itself is 1.", "So the answer does not depend on the base."],
      solution: [`a⁰ = 1, so ${base}⁰ = 1.`],
      traps: [trap("gave-zero", 0, "a⁰ is 1, not 0. a³ ÷ a³ = a⁰, and any number divided by itself is 1.")],
    });
  }
  if (kind === "negative") {
    const base = r.pick([2, 3, 4, 5, 10]);
    const n = r.int(1, base === 10 ? 3 : base > 3 ? 2 : 4);
    const denom = base ** n;
    return item({
      skill: "A negative index means a reciprocal",
      prompt: `Evaluate ${base}${sup(-n)}. Give your answer as a fraction.`,
      input: frac(),
      answer: `1/${denom}`,
      hints: ["a⁻ⁿ = 1/aⁿ.", `So ${base}${sup(-n)} = 1/${base}${sup(n)}.`, `${base}${sup(n)} = ${denom}`],
      solution: [`${base}${sup(-n)} = 1/${base}${sup(n)} = 1/${denom}`],
      traps: [trap("negative-number", -denom, "A negative INDEX does not make the answer negative. It means 'one over': 1/" + denom + "."), trap("times-minus", base * -n, "The index is not multiplied by the base. a⁻ⁿ = 1/aⁿ.")],
    });
  }
  if (kind === "negative-fraction") {
    const [p, q] = r.pick([[2, 3], [3, 4], [2, 5], [1, 2], [3, 5]]);
    const n = r.int(1, 3);
    const [a, b] = simplify(q ** n, p ** n);
    return item({
      skill: "A negative power of a fraction",
      prompt: `Evaluate (${p}/${q})${sup(-n)}. Give your answer as a fraction.`,
      input: frac(),
      answer: fracText(a, b),
      hints: ["A negative index turns the fraction upside down.", `(${p}/${q})${sup(-n)} = (${q}/${p})${sup(n)}`, `Raise top and bottom to the power ${n}.`],
      solution: [`(${p}/${q})${sup(-n)} = (${q}/${p})${sup(n)} = ${q ** n}/${p ** n}`],
      traps: [trap("did-not-flip", `${p ** n}/${q ** n}`, "A negative index means flip the fraction first.")],
    });
  }
  const base = r.pick([2, 3, 5]);
  const m = r.int(2, 4);
  const n = r.int(m + 1, m + 3);
  const answer = `1/${base ** (n - m)}`;
  return item({
    skill: "Combining the laws with a negative result",
    prompt: `Evaluate ${base}${sup(m)} ÷ ${base}${sup(n)}. Give your answer as a fraction.`,
    input: frac(),
    answer,
    hints: ["Subtract the powers.", `${m} − ${n} = ${m - n}`, `${base}${sup(m - n)} = 1/${base}${sup(n - m)}`],
    solution: [`${base}${sup(m)} ÷ ${base}${sup(n)} = ${base}${sup(m - n)} = 1/${base ** (n - m)}`],
    traps: [trap("negative-number", -(base ** (n - m)), "A negative index means 'one over', not a negative number.")],
  });
};

/* ── L2-N1.3 · Fractional indices ───────────────────────────────────── */

const ROOTABLE = [
  [4, 2, 2], [9, 2, 3], [16, 2, 4], [25, 2, 5], [36, 2, 6], [49, 2, 7], [64, 2, 8], [81, 2, 9], [100, 2, 10],
  [8, 3, 2], [27, 3, 3], [64, 3, 4], [125, 3, 5], [1000, 3, 10],
  [16, 4, 2], [81, 4, 3], [32, 5, 2],
];

generators["L2-N1.3"] = (r, tier) => {
  const [base, n, root] = r.pick(tier === "build" ? ROOTABLE.slice(0, 14) : ROOTABLE);
  // The power m must not be a multiple of the root n, or the index is not in
  // lowest terms (64^(3/3) is just 64^1).
  let m = tier === "build" ? 1 : r.int(1, 3);
  while (m > 1 && m % n === 0) m -= 1;
  const negative = tier === "exam" && r.chance(0.5);
  const value = root ** m;
  const answer = negative ? `1/${value}` : String(value);
  const shownIndex = `${negative ? "-" : ""}${m}/${n}`;
  return item({
    skill: "Fractional indices as roots and powers",
    prompt: `Evaluate ${base}^(${shownIndex}).`,
    input: negative ? frac() : num(),
    answer,
    hints: [
      `The BOTTOM of the fraction is the root: ${base}^(1/${n}) = ${n === 2 ? "√" : n === 3 ? "∛" : `the ${n}th root of `}${base}.`,
      `The TOP is the power. Take the root first, it keeps the numbers small: ${n === 2 ? "√" : `${n}th root of `}${base} = ${root}.`,
      `${root}${sup(m)} = ${value}${negative ? `, and the minus sign means 1 over that.` : "."}`,
    ],
    solution: [`${base}^(1/${n}) = ${root}`, m > 1 ? `${root}${sup(m)} = ${value}` : null, negative ? `Negative index: 1/${value}` : null, `Answer: ${answer}`].filter(Boolean),
    traps: [
      trap("multiplied-by-index", Math.round(base * (m / n) * 100) / 100 * (negative ? -1 : 1), `A fractional index is not multiplication. ${base}^(${m}/${n}) means the ${n === 2 ? "square" : n === 3 ? "cube" : `${n}th`} root, then the power ${m}.`),
      m > 1 ? trap("root-and-power-swapped", Math.round(Math.pow(base, n / m) * 100) / 100, `The bottom of the index is the root and the top is the power, not the other way round.`) : null,
    ].filter(Boolean),
  });
};

/* ── L2-N1.4 · Equations involving indices ──────────────────────────── */

generators["L2-N1.4"] = (r, tier) => {
  const kind = r.pick(byTier(tier, { build: ["simple"], stretch: ["simple", "linear-index"], exam: ["different-bases", "linear-index", "reciprocal"] }));

  if (kind === "simple" || kind === "linear-index") {
    const base = r.pick([2, 3, 5]);
    const x = r.int(1, 5);
    const k = kind === "simple" ? 0 : r.int(1, 3);
    const total = base ** (x + k);
    const shown = k ? `${base}^(x + ${k})` : `${base}^x`;
    return item({
      skill: "Solving by writing both sides as powers of the same base",
      prompt: `Solve ${shown} = ${total}.`,
      input: num(),
      answer: x,
      hints: [`Write ${total} as a power of ${base}.`, `${total} = ${base}${sup(x + k)}`, k ? `So x + ${k} = ${x + k}.` : `So x = ${x}.`],
      solution: [`${total} = ${base}${sup(x + k)}`, `${shown} = ${base}${sup(x + k)}`, k ? `x + ${k} = ${x + k}, so x = ${x}` : `x = ${x}`],
      traps: [trap("divided", Math.round((total / base) * 100) / 100, `x is a power, not a multiplier. Write ${total} as ${base} to some power.`), k ? trap("forgot-shift", x + k, `That is x + ${k}. Subtract ${k}.`) : null].filter(Boolean),
    });
  }
  if (kind === "reciprocal") {
    const base = r.pick([2, 3, 4]);
    const n = r.int(2, 3);
    return item({
      skill: "An index equation with a fraction on one side",
      prompt: `Solve ${base}^x = 1/${base ** n}.`,
      input: num(),
      answer: -n,
      hints: [`1/${base ** n} = 1/${base}${sup(n)}.`, "A fraction 1/aⁿ is a⁻ⁿ.", `So ${base}^x = ${base}${sup(-n)}.`],
      solution: [`1/${base ** n} = ${base}${sup(-n)}`, `x = ${-n}`],
      traps: [trap("dropped-sign", n, "1 over a power means a NEGATIVE index: x is negative.")],
    });
  }
  // big^x = target, where both are powers of one prime root: 4^x = 32, 27^x = 9.
  const root = r.pick([2, 3, 5]);
  const pb = root === 5 ? 2 : r.int(2, 3);
  const big = root ** pb;
  let t;
  do t = r.int(1, root === 2 ? 7 : 4);
  while (t === pb);
  const target = root ** t;
  const [an, ad] = simplify(t, pb);
  const answer = fracText(an, ad);
  return item({
    skill: "Index equations with different bases",
    prompt: `Solve ${big}^x = ${target}. Give x as a whole number or a fraction.`,
    input: frac(),
    answer,
    hints: [`Write both sides as powers of ${root}: ${big} = ${root}${sup(pb)} and ${target} = ${root}${sup(t)}.`, `So ${root}^(${pb}x) = ${root}${sup(t)}, and the powers must be equal.`, `${pb}x = ${t}`],
    solution: [`${big}^x = (${root}${sup(pb)})^x = ${root}^(${pb}x)`, `${target} = ${root}${sup(t)}`, `${pb}x = ${t}, so x = ${answer}`],
    traps: [trap("divided-numbers", Math.round((target / big) * 1000) / 1000, `x is a power, not a multiplier. Write both sides as powers of ${root}.`), trap("upside-down", fracText(...simplify(pb, t)), `${pb}x = ${t} gives x = ${t}/${pb}, not ${pb}/${t}.`)],
  });
};

/* ── L2-N1.5 · Writing standard form ────────────────────────────────── */

function standardOf(r, tier) {
  const big = r.chance(0.5);
  const digits = r.int(2, 4);
  let mantissaDigits = String(r.int(1, 9));
  for (let i = 1; i < digits; i += 1) mantissaDigits += String(r.int(0, 9));
  const mantissa = Number(`${mantissaDigits[0]}.${mantissaDigits.slice(1)}`);
  const exponent = big ? r.int(byTier(tier, { build: 3, stretch: 5, exam: 6 }), byTier(tier, { build: 6, stretch: 9, exam: 11 })) : -r.int(byTier(tier, { build: 2, stretch: 3, exam: 4 }), byTier(tier, { build: 4, stretch: 6, exam: 8 }));
  const value = Number((mantissa * 10 ** exponent).toPrecision(digits));
  return { mantissa, exponent, value };
}

function plain(value) {
  if (Math.abs(value) >= 1) return value.toLocaleString("en-US");
  return value.toFixed(12).replace(/0+$/, "");
}

generators["L2-N1.5"] = (r, tier) => {
  const { mantissa, exponent, value } = standardOf(r, tier);
  const answer = `${mantissa} x 10^${exponent}`;

  if (tier !== "build" && r.chance(0.35)) {
    return item({
      skill: "Reading a number in standard form",
      prompt: `Write ${mantissa} × 10${sup(exponent)} as an ordinary number.`,
      input: num(),
      answer: value,
      hints: [exponent > 0 ? "A positive power of 10 makes the number BIG: move the point to the right." : "A negative power of 10 makes the number SMALL: move the point to the left.", `Move it ${Math.abs(exponent)} places.`, "Fill empty places with zeros."],
      solution: [`Move the point ${Math.abs(exponent)} places to the ${exponent > 0 ? "right" : "left"}.`, `${mantissa} × 10${sup(exponent)} = ${plain(value)}`],
      traps: [trap("wrong-direction", Number((mantissa * 10 ** -exponent).toPrecision(6)), "The point moved the wrong way. A positive power makes the number bigger, a negative one smaller.")],
    });
  }
  return item({
    skill: "Writing a number in standard form",
    prompt: `Write ${plain(value)} in standard form.`,
    input: num({ placeholder: "e.g. 3.5 x 10^-4" }),
    answer,
    exact: "standard-form",
    hints: ["Standard form is A × 10ⁿ, with A at least 1 and less than 10.", `A = ${mantissa}. Count how many places the point moves to get from ${mantissa} to ${plain(value)}.`, `It moves ${Math.abs(exponent)} places ${exponent > 0 ? "right, so n is positive" : "left, so n is negative"}.`],
    solution: [`A = ${mantissa}`, `The point moves ${Math.abs(exponent)} places, so n = ${exponent}.`, `${plain(value)} = ${mantissa} × 10${sup(exponent)}`],
    traps: [
      trap("sign-of-index", `${mantissa} x 10^${-exponent}`, exponent < 0 ? "A number less than 1 needs a NEGATIVE power of 10." : "A number bigger than 10 needs a POSITIVE power of 10."),
      trap("not-between-1-and-10", `${Number((mantissa * 10).toFixed(6))} x 10^${exponent - 1}`, "That has the right value, but the first number must be at least 1 and less than 10."),
    ],
    accept: [`${mantissa}*10^${exponent}`],
  });
};

/* ── L2-N1.6 · Calculating in standard form ─────────────────────────── */

generators["L2-N1.6"] = (r, tier) => {
  const a = r.int(2, 9);
  const b = r.int(2, 9);
  const m = r.int(2, 6);
  let n = byTier(tier, { build: r.int(2, 6), stretch: r.int(-5, 6), exam: r.int(-8, 8) });
  if (n === 0) n = -3;
  const multiply = r.chance(0.6);

  // Multiplying: a × b may reach 10 or more and need adjusting. Dividing: the
  // first number is a × b, so the quotient is exactly a, already in range.
  const mant = multiply ? a * b : a;
  const exp = multiply ? m + n : m - n;
  const shift = mant >= 10 ? 1 : 0;
  const finalMant = shift ? mant / 10 : mant;
  const finalExp = exp + shift;
  const answer = `${finalMant} x 10^${finalExp}`;
  const working = multiply
    ? [`(${a} × ${b}) × 10^(${m} + ${n}) = ${mant} × 10${sup(exp)}`]
    : [`(${a * b} ÷ ${b}) × 10^(${m} − ${n}) = ${mant} × 10${sup(exp)}`];
  if (shift) working.push(`${mant} is not less than 10: ${mant} = ${finalMant} × 10, so the answer is ${finalMant} × 10${sup(finalExp)}`);

  const wrongPower = multiply ? m * n + shift : m + n + shift;
  return item({
    skill: multiply ? "Multiplying numbers in standard form" : "Dividing numbers in standard form",
    prompt: `Work out (${multiply ? a : a * b} × 10${sup(m)}) ${multiply ? "×" : "÷"} (${b} × 10${sup(n)}). Give your answer in standard form.`,
    input: num({ placeholder: "e.g. 1.2 x 10^9" }),
    answer,
    exact: "standard-form",
    hints: [multiply ? "Multiply the numbers, and ADD the powers of 10." : "Divide the numbers, and SUBTRACT the powers of 10.", working[0], "Check the first number is at least 1 and less than 10; if not, adjust the power."],
    solution: [...working, `Answer: ${finalMant} × 10${sup(finalExp)}`],
    traps: [
      shift ? trap("not-adjusted", `${mant} x 10^${exp}`, `The value is right, but ${mant} is not less than 10. Write it as ${finalMant} × 10${sup(finalExp)}.`) : null,
      wrongPower !== finalExp ? trap(multiply ? "powers-multiplied" : "powers-added", `${finalMant} x 10^${wrongPower}`, multiply ? "Powers of 10 ADD when you multiply; they do not multiply." : "Powers of 10 SUBTRACT when you divide; they do not add.") : null,
    ].filter(Boolean),
  });
};

export default generators;
