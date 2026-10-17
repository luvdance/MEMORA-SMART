import { item, trap, num, text, byTier } from "./kit.js";
import { naira, NAMES } from "../rng.js";

/**
 * GENERATORS · LEVEL 3 · NUMBER BASES, COMMERCIAL ARITHMETIC 2, ERROR AND VARIATION
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Contains every answer for L3-N1, L3-N2 and L3-N3.
 * ═════════════════════════════════════════════════════════════════════════
 */

export const generators = {};

const SUB = "₀₁₂₃₄₅₆₇₈₉";
const sub = (b) => String(b).replace(/\d/g, (d) => SUB[d]);
const inBase = (n, b) => n.toString(b);
const baseAccept = (s, b) => [`${s}${sub(b)}`, `${s} base ${b}`, `${s}base${b}`, `(${s})${b}`, `${s}_${b}`];

/** Place-value expansion of a numeral in base b, for the working. */
function expand(numeral, b) {
  const SUP = "⁰¹²³⁴⁵⁶⁷⁸⁹";
  const digits = [...numeral];
  return digits
    .map((d, i) => {
      const power = digits.length - 1 - i;
      if (power === 0) return d;
      if (power === 1) return `${d}×${b}`;
      return `${d}×${b}${String(power).replace(/\d/g, (p) => SUP[p])}`;
    })
    .join(" + ");
}

/* ── L3-N1.1 · Converting between any bases ─────────────────────────── */

generators["L3-N1.1"] = (r, tier) => {
  const from = r.pick(byTier(tier, { build: [10], stretch: [3, 4, 5, 6, 10], exam: [3, 4, 5, 6, 7, 8] }));
  let to;
  do to = r.pick([2, 3, 4, 5, 6, 7, 8, 9, 10]);
  while (to === from);
  const n = r.int(byTier(tier, { build: 20, stretch: 30, exam: 50 }), byTier(tier, { build: 120, stretch: 250, exam: 400 }));
  const source = inBase(n, from);
  const answer = inBase(n, to);
  const steps = [];
  if (from !== 10) steps.push(`${source}${sub(from)} = ${expand(source, from)} = ${n} (base ten)`);
  if (to !== 10) {
    let left = n;
    while (left > 0) {
      steps.push(`${left} ÷ ${to} = ${Math.floor(left / to)} r ${left % to}`);
      left = Math.floor(left / to);
    }
    steps.push(`Remainders from the bottom up: ${answer}${sub(to)}`);
  }
  return item({
    skill: "Converting between any two bases",
    prompt: from === 10 ? `Convert ${n} (base ten) to base ${to}.` : `Convert ${source}${sub(from)} to base ${to}.`,
    input: to === 10 ? num() : text({ placeholder: "digits only" }),
    answer: to === 10 ? n : answer,
    accept: to === 10 ? [] : baseAccept(answer, to),
    hints: [
      from !== 10 && to !== 10 ? "Go through base ten: convert to base ten first, then to the new base." : from !== 10 ? "Multiply each digit by its place value (powers of the base) and add." : `Divide by ${to} repeatedly and record the remainders.`,
      from !== 10 ? `${source}${sub(from)} = ${n} in base ten.` : `First division: ${n} ÷ ${to} = ${Math.floor(n / to)} r ${n % to}.`,
      to !== 10 ? "Read the remainders from the BOTTOM up." : "Add up the place values.",
    ],
    solution: steps.length ? steps : [`${n}`],
    traps: [
      to !== 10 && answer.length > 1 ? trap("read-top-down", [...answer].reverse().join(""), "Read the remainders from the bottom up.") : null,
      from !== 10 && to !== 10 ? trap("stopped-at-ten", String(n), `${n} is the base TEN value. Now convert it to base ${to}.`) : null,
      from !== 10 && to === 10 ? trap("read-as-ten", Number(source), `${source} in base ${from} is not the number ${source}. Use the place values ${from}², ${from}, 1.`) : null,
    ].filter(Boolean),
  });
};

/* ── L3-N1.2 · Arithmetic in any base ───────────────────────────────── */

generators["L3-N1.2"] = (r, tier) => {
  const b = r.pick(byTier(tier, { build: [5, 6, 8], stretch: [3, 4, 5, 7, 8], exam: [3, 4, 5, 6, 7, 8, 9] }));
  const op = r.pick(byTier(tier, { build: ["+", "−"], stretch: ["+", "−", "×"], exam: ["×", "−", "+"] }));
  let x = r.int(b * 2, b ** 3 - 1);
  let y = op === "×" ? r.int(2, b * 2) : r.int(b, b ** 3 - 1);
  if (op === "−" && y > x) [x, y] = [y, x];
  if (op === "−" && y === x) x += b;
  const value = op === "+" ? x + y : op === "−" ? x - y : x * y;
  const answer = inBase(value, b);
  const sx = inBase(x, b);
  const sy = inBase(y, b);
  const naive = op === "+" ? String(Number(sx) + Number(sy)) : op === "−" ? String(Number(sx) - Number(sy)) : String(Number(sx) * Number(sy));
  return item({
    skill: `${op === "+" ? "Adding" : op === "−" ? "Subtracting" : "Multiplying"} in base ${b}`,
    prompt: `Work out ${sx}${sub(b)} ${op} ${sy}${sub(b)}, giving your answer in base ${b}.`,
    input: text({ placeholder: "digits only" }),
    answer,
    accept: baseAccept(answer, b),
    hints: [
      op === "−" ? `Work in columns. When you borrow, the borrowed 1 is worth ${b} in the column to the right.` : `Work in columns. Whenever a column reaches ${b} or more, carry: ${b} in a column makes 1 in the next.`,
      `Check by converting: ${sx}${sub(b)} = ${x} and ${sy}${sub(b)} = ${y} in base ten.`,
      `${x} ${op} ${y} = ${value} in base ten, which you can convert back to check.`,
    ],
    solution: [`${sx}${sub(b)} = ${x},  ${sy}${sub(b)} = ${y}`, `${x} ${op} ${y} = ${value}`, `${value} in base ${b} = ${answer}${sub(b)}`, `Working directly in columns, carrying or borrowing ${b}, gives the same digits.`],
    traps: naive !== answer && /^\d+$/.test(naive) ? [trap("worked-in-base-ten", naive, `That works as if the numbers were base ten. In base ${b} you carry or borrow ${b}, not 10.`)] : [],
  });
};

/* ── L3-N1.3 · Finding an unknown base ──────────────────────────────── */

generators["L3-N1.3"] = (r, tier) => {
  const b = r.int(byTier(tier, { build: 5, stretch: 4, exam: 4 }), 9);
  const quadratic = tier !== "build" && r.chance(0.6);
  if (!quadratic) {
    const d1 = r.int(1, b - 1);
    const d0 = r.int(0, b - 1);
    const value = d1 * b + d0;
    return item({
      skill: "Finding an unknown base from a two-digit numeral",
      prompt: `Find b if ${d1}${d0}_b = ${value} (base ten).`,
      input: num(),
      answer: b,
      hints: [`${d1}${d0}_b means ${d1} × b + ${d0}.`, `${d1}b + ${d0} = ${value}`, `${d1}b = ${value - d0}`],
      solution: [`${d1}b + ${d0} = ${value}`, `${d1}b = ${value - d0}`, `b = ${b}`],
      traps: [trap("read-digits", d1 + d0, "The digits are not added: the first digit is worth b each.")],
    });
  }
  const [c2, c1, c0] = [1, r.int(0, Math.min(3, b - 1)), r.int(1, b - 1)];
  const value = c2 * b * b + c1 * b + c0;
  return item({
    skill: "Finding an unknown base from a quadratic",
    prompt: `Find b if ${c2}${c1}${c0}_b = ${value} (base ten).`,
    input: num(),
    answer: b,
    hints: [`${c2}${c1}${c0}_b = b² + ${c1}b + ${c0}.`, `b² + ${c1}b + ${c0} = ${value}, so b² + ${c1}b − ${value - c0} = 0.`, "Solve the quadratic, or try whole numbers bigger than every digit. The base must be a positive whole number."],
    solution: [`b² + ${c1}b + ${c0} = ${value}`, `b² + ${c1}b − ${value - c0} = 0`, `Try b = ${b}: ${b * b} + ${c1 * b} + ${c0} = ${value} ✓`, `b = ${b}`],
    traps: [],
  });
};

/* ── L3-N2.1 · Compound interest year by year ───────────────────────── */

generators["L3-N2.1"] = (r, tier) => {
  const R = r.pick(byTier(tier, { build: [10, 20], stretch: [5, 10, 20], exam: [5, 10, 15, 20] }));
  const years = byTier(tier, { build: 2, stretch: r.int(2, 3), exam: 3 });
  const P = r.int(1, 20) * 10000;
  let amount = P;
  const steps = [];
  for (let y = 1; y <= years; y += 1) {
    const interest = (amount * R) / 100;
    steps.push(`Year ${y}: interest = ${R}% of ${amount.toLocaleString("en-US")} = ${interest.toLocaleString("en-US")}; amount = ${(amount + interest).toLocaleString("en-US")}`);
    amount += interest;
  }
  amount = Math.round(amount * 100) / 100;
  const askInterest = r.chance(0.4);
  const answer = askInterest ? Math.round((amount - P) * 100) / 100 : amount;
  const simple = P + (P * R * years) / 100;
  return item({
    skill: "Compound interest, year by year",
    prompt: `${naira(P)} is invested at ${R}% per annum COMPOUND interest. Find the ${askInterest ? "compound interest" : "amount"} after ${years} years.`,
    input: num(),
    answer,
    tolerance: 0.01,
    hints: ["Compound interest is added to the principal at the end of each year, and the next year's interest is on the new total.", `Year 1: ${R}% of ${P.toLocaleString("en-US")} = ${((P * R) / 100).toLocaleString("en-US")}.`, `Add it on, then take ${R}% of the new amount for year 2.`],
    solution: [...steps, askInterest ? `Compound interest = ${amount.toLocaleString("en-US")} − ${P.toLocaleString("en-US")} = ${answer.toLocaleString("en-US")}` : `Amount = ${naira(amount)}`],
    traps: [trap("used-simple", askInterest ? simple - P : simple, "That is SIMPLE interest. With compound interest, each year's interest is earned on the growing amount."), trap(askInterest ? "gave-amount" : "gave-interest", askInterest ? amount : Math.round((amount - P) * 100) / 100, askInterest ? "That is the amount. The interest is amount − principal." : "That is the interest only. The amount includes the principal.")],
  });
};

/* ── L3-N2.2 · VAT and income tax ───────────────────────────────────── */

generators["L3-N2.2"] = (r, tier) => {
  if (r.chance(0.55)) {
    const rate = 7.5;
    const price = r.int(2, 80) * 400;
    const vat = (price * rate) / 100;
    const reverse = tier === "exam" && r.chance(0.5);
    if (reverse) {
      const total = price + vat;
      return item({
        skill: "Finding the price before VAT",
        prompt: `A fridge costs ${naira(total)} including VAT at ${rate}%. What was the price before VAT?`,
        input: num(),
        answer: price,
        hints: ["The price including VAT is 107.5% of the price before VAT.", `Price = ${total} ÷ 1.075`, "Do not just take 7.5% off the total."],
        solution: [`${total} = 107.5% of the price`, `Price = ${total} × 100 ÷ 107.5 = ${naira(price)}`],
        traps: [trap("took-off-total", Math.round((total - (total * rate) / 100) * 100) / 100, "The 7.5% was added to the ORIGINAL price, so taking 7.5% of the total off is wrong. Divide by 1.075.")],
      });
    }
    return item({
      skill: "Adding VAT",
      prompt: `A phone costs ${naira(price)} before VAT. VAT is charged at ${rate}%. What is the price including VAT?`,
      input: num(),
      answer: price + vat,
      hints: [`VAT = ${rate}% of the price.`, `${rate}% of ${price} = ${vat}`, "Add it to the price."],
      solution: [`VAT = ${price} × ${rate} ÷ 100 = ${vat}`, `Total = ${price} + ${vat} = ${naira(price + vat)}`],
      traps: [trap("vat-only", vat, "That is the VAT alone. Add it to the price.")],
    });
  }
  const salary = r.int(10, 60) * 100000;
  const allowance = r.int(2, 8) * 100000;
  const rate = r.pick([5, 10, 15, 20]);
  const taxable = salary - allowance;
  const tax = (taxable * rate) / 100;
  return item({
    skill: "Income tax on taxable income",
    prompt: `${r.pick(NAMES)} earns ${naira(salary)} a year. The tax-free allowance is ${naira(allowance)} and the rest is taxed at ${rate}%. How much tax is paid?`,
    input: num(),
    answer: tax,
    hints: ["Tax is charged only on TAXABLE income: income − allowance.", `${salary} − ${allowance} = ${taxable}`, `${rate}% of ${taxable}`],
    solution: [`Taxable income = ${taxable.toLocaleString("en-US")}`, `Tax = ${rate}% of ${taxable.toLocaleString("en-US")} = ${naira(tax)}`],
    traps: [trap("taxed-whole-salary", (salary * rate) / 100, "The allowance is tax-free. Take it off before working out the tax.")],
  });
};

/* ── L3-N2.3 · Hire purchase ────────────────────────────────────────── */

generators["L3-N2.3"] = (r, tier) => {
  const cash = r.int(10, 60) * 5000;
  const deposit = r.int(2, 5) * 5000;
  const months = r.pick([6, 10, 12, 18, 24]);
  const instalment = r.int(Math.ceil((cash - deposit) / months / 500) + 1, Math.ceil((cash - deposit) / months / 500) + 6) * 500;
  const hp = deposit + months * instalment;
  const askExtra = r.chance(0.5);
  return item({
    skill: "Hire purchase price",
    prompt: `A motorcycle costs ${naira(cash)} cash. On hire purchase you pay a deposit of ${naira(deposit)} and ${months} monthly instalments of ${naira(instalment)}. ${askExtra ? "How much MORE does hire purchase cost than paying cash?" : "What is the total hire purchase price?"}`,
    input: num(),
    answer: askExtra ? hp - cash : hp,
    hints: ["Hire purchase price = deposit + all the instalments.", `${months} × ${instalment} = ${months * instalment}`, askExtra ? `Then subtract the cash price, ${cash}.` : `Add the deposit, ${deposit}.`],
    solution: [`Instalments: ${months} × ${instalment} = ${months * instalment}`, `HP price = ${deposit} + ${months * instalment} = ${naira(hp)}`, askExtra ? `Extra = ${hp} − ${cash} = ${naira(hp - cash)}` : null].filter(Boolean),
    traps: [trap("forgot-deposit", askExtra ? months * instalment - cash : months * instalment, "The deposit is part of what you pay. Add it in.")],
  });
};

/* ── L3-N2.4 · Foreign exchange ─────────────────────────────────────── */

generators["L3-N2.4"] = (r, tier) => {
  const [cur, symbol, rate] = r.pick([["US dollars", "$", r.pick([1500, 1550, 1600])], ["pounds sterling", "£", r.pick([1900, 2000, 2050])], ["CFA francs", "CFA ", r.pick([2.5, 2.4])], ["Ghana cedis", "GH₵", r.pick([100, 120, 125])]]);
  const toNaira = r.chance(0.5);
  if (toNaira) {
    const amount = r.int(2, 60) * (rate < 10 ? 1000 : 10);
    return item({
      skill: "Converting foreign currency to naira",
      prompt: `The exchange rate is ${symbol}1 = ${naira(rate)}. Convert ${symbol}${amount.toLocaleString("en-US")} to naira.`,
      input: num(),
      answer: amount * rate,
      hints: [`Each ${symbol}1 is worth ${naira(rate)}.`, "So multiply.", `${amount} × ${rate}`],
      solution: [`${amount} × ${rate} = ${naira(amount * rate)}`],
      traps: [trap("divided", Math.round((amount / rate) * 100) / 100, "Each unit of foreign currency is worth MORE naira, so multiply.")],
    });
  }
  const units = r.int(2, 60) * (rate < 10 ? 1000 : 10);
  const nairaAmount = units * rate;
  return item({
    skill: "Converting naira to foreign currency",
    prompt: `The exchange rate is ${symbol}1 = ${naira(rate)}. How many ${cur} will ${naira(nairaAmount)} buy?`,
    input: num(),
    answer: units,
    hints: [`Every ${naira(rate)} buys ${symbol}1.`, "So divide the naira by the rate.", `${nairaAmount} ÷ ${rate}`],
    solution: [`${nairaAmount} ÷ ${rate} = ${symbol}${units.toLocaleString("en-US")}`],
    traps: [trap("multiplied", nairaAmount * rate, `Naira to ${cur}: divide by ${rate}.`)],
  });
};

/* ── L3-N3.1 · Absolute and percentage error ────────────────────────── */

generators["L3-N3.1"] = (r, tier) => {
  if (tier !== "build" && r.chance(0.5)) {
    const unit = r.pick([["cm", 1], ["m", 1], ["kg", 0.1], ["s", 0.5]]);
    const step = unit[1];
    const value = Math.round(r.int(20, 200) * step * 10) / 10;
    const half = step / 2;
    const pct = Math.round((half / value) * 100 * 100) / 100;
    return item({
      skill: "Percentage error from the accuracy of a measurement",
      prompt: `A length is measured as ${value} ${unit[0]}, correct to the nearest ${step} ${unit[0]}. Find the greatest possible percentage error, to 2 decimal places.`,
      input: num({ unit: "%" }),
      answer: pct,
      tolerance: 0.006,
      hints: [`The greatest possible error is HALF the unit of measurement: ${half} ${unit[0]}.`, "Percentage error = error ÷ measured value × 100.", `${half} ÷ ${value} × 100`],
      solution: [`Greatest error = ${step} ÷ 2 = ${half}`, `% error = ${half} ÷ ${value} × 100 = ${pct}%`],
      traps: [trap("full-unit", Math.round((step / value) * 10000) / 100, `The error is half the unit, ${half}, not the whole unit.`)],
    });
  }
  const actual = r.int(20, 200);
  const off = r.intExcept(-8, 8, [0]);
  const measured = actual + off;
  const pct = Math.round((Math.abs(off) / actual) * 10000) / 100;
  return item({
    skill: "Absolute and percentage error",
    prompt: `A bag of rice is labelled ${actual} kg but actually weighs ${measured} kg. Find the percentage error, to 2 decimal places if needed.`,
    input: num({ unit: "%" }),
    answer: pct,
    tolerance: 0.006,
    hints: ["Error = |measured − actual|.", `|${measured} − ${actual}| = ${Math.abs(off)}`, `% error = ${Math.abs(off)} ÷ ${actual} × 100`],
    solution: [`Error = ${Math.abs(off)} kg`, `% error = ${Math.abs(off)} ÷ ${actual} × 100 = ${pct}%`],
    traps: [trap("over-measured", Math.round((Math.abs(off) / measured) * 10000) / 100, `Divide by the TRUE (labelled) value, ${actual}.`)],
  });
};

/* ── L3-N3.2 · Direct and inverse variation ─────────────────────────── */

generators["L3-N3.2"] = (r, tier) => {
  const inverse = tier !== "build" && r.chance(0.5);
  const k = r.int(2, 12);
  const x1 = r.int(2, 10);
  const x2 = r.intExcept(2, 15, [x1]);
  if (!inverse) {
    const y1 = k * x1;
    return item({
      skill: "Direct variation: y = kx",
      prompt: `y varies directly as x, and y = ${y1} when x = ${x1}. Find y when x = ${x2}.`,
      input: num(),
      answer: k * x2,
      hints: ["'y varies directly as x' means y = kx for some constant k.", `${y1} = k × ${x1}, so k = ${k}.`, `y = ${k} × ${x2}`],
      solution: [`y = kx`, `${y1} = ${x1}k → k = ${k}`, `y = ${k} × ${x2} = ${k * x2}`],
      traps: [trap("used-inverse", Math.round(((y1 * x1) / x2) * 100) / 100, "That is inverse variation. 'Directly' means y = kx: as x grows, y grows.")],
    });
  }
  const y1 = k * 60 / x1;
  if (!Number.isInteger(y1) || !Number.isInteger((k * 60) / x2)) return generators["L3-N3.2"](r, "build");
  return item({
    skill: "Inverse variation: y = k/x",
    prompt: `y varies inversely as x, and y = ${y1} when x = ${x1}. Find y when x = ${x2}.`,
    input: num(),
    answer: (k * 60) / x2,
    hints: ["'y varies inversely as x' means y = k/x, so xy = k.", `k = ${x1} × ${y1} = ${k * 60}`, `y = ${k * 60} ÷ ${x2}`],
    solution: [`y = k/x`, `k = xy = ${x1} × ${y1} = ${k * 60}`, `y = ${k * 60} ÷ ${x2} = ${(k * 60) / x2}`],
    traps: [trap("used-direct", Math.round(((y1 / x1) * x2) * 100) / 100, "That is direct variation. 'Inversely' means y = k/x: as x grows, y shrinks.")],
  });
};

export default generators;
