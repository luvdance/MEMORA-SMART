import { item, trap, num, frac, byTier } from "./kit.js";
import { simplify, fracText, naira } from "../rng.js";
import { sn } from "./format.js";

/**
 * GENERATORS · LEVEL 5 · SEQUENCES AND SERIES, FINANCIAL ARITHMETIC
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Contains every answer for L5-N1 and L5-N2.
 * ═════════════════════════════════════════════════════════════════════════
 */

export const generators = {};

const choice = (options) => ({ kind: "choice", options });
const r2 = (x) => Math.round(x * 100) / 100;

/* ── L5-N1 · Sequences and series ───────────────────────────────────── */

generators["L5-N1.1"] = (r, tier) => {
  const kind = r.pick(["AP", "GP", "neither"]);
  let terms;
  if (kind === "AP") {
    const a = r.int(-10, 20);
    const d = r.intExcept(-7, 9, [0]);
    terms = [0, 1, 2, 3].map((i) => a + i * d);
  } else if (kind === "GP") {
    const a = r.pick([1, 2, 3, 4, 5]);
    const ratio = r.pick([2, 3, -2, 0.5]);
    terms = [0, 1, 2, 3].map((i) => a * ratio ** i);
  } else {
    const start = r.int(1, 5);
    terms = [start, start + 1, start + 3, start + 6];
  }
  return item({
    skill: "Recognising arithmetic and geometric progressions",
    prompt: `Is the sequence ${terms.map(sn).join(", ")}, ... an arithmetic progression (AP), a geometric progression (GP), or neither?`,
    input: choice(["AP", "GP", "neither"]),
    answer: kind,
    hints: ["An AP adds the same COMMON DIFFERENCE each time: check the differences.", "A GP multiplies by the same COMMON RATIO each time: check the ratios.", `Differences: ${terms.slice(1).map((t, i) => sn(t - terms[i])).join(", ")}`],
    solution: [`Differences: ${terms.slice(1).map((t, i) => sn(t - terms[i])).join(", ")}`, kind === "GP" ? `Ratios: ${terms.slice(1).map((t, i) => sn(t / terms[i])).join(", ")}` : null, `So it is ${kind === "neither" ? "neither" : `a ${kind}`}.`].filter(Boolean),
    traps: [trap("wrong-type", kind === "AP" ? "GP" : kind === "GP" ? "AP" : "AP", "Check BOTH the differences and the ratios before deciding.")],
  });
};

generators["L5-N1.2"] = (r, tier) => {
  const a = r.int(-10, 25);
  const d = r.intExcept(-6, 8, [0]);
  const kind = r.pick(byTier(tier, { build: ["term"], stretch: ["term", "which-term"], exam: ["two-terms", "which-term"] }));
  const T = (n) => a + (n - 1) * d;
  if (kind === "term") {
    const n = r.int(10, 40);
    return item({
      skill: "The nth term of an AP",
      prompt: `Find the ${n}th term of the AP ${[1, 2, 3].map(T).map(sn).join(", ")}, ...`,
      input: num(),
      answer: T(n),
      hints: ["Tₙ = a + (n − 1)d", `a = ${sn(a)}, d = ${sn(d)}`, `T${n} = ${sn(a)} + ${n - 1} × ${d < 0 ? `(${sn(d)})` : d}`],
      solution: [`T${n} = ${sn(a)} + ${n - 1}(${sn(d)}) = ${sn(T(n))}`],
      traps: [trap("used-n", a + n * d, "It is (n − 1)d, not nd: the first term has had no difference added yet.")],
    });
  }
  if (kind === "which-term") {
    const n = r.int(8, 30);
    return item({
      skill: "Which term of an AP has a given value",
      prompt: `Which term of the AP ${[1, 2, 3].map(T).map(sn).join(", ")}, ... is ${sn(T(n))}?`,
      input: num(),
      answer: n,
      hints: ["Set a + (n − 1)d equal to the value.", `${sn(a)} + (n − 1)(${sn(d)}) = ${sn(T(n))}`, `(n − 1) = ${sn(T(n) - a)} ÷ ${sn(d)}`],
      solution: [`(n − 1)(${sn(d)}) = ${sn(T(n) - a)}`, `n − 1 = ${n - 1}`, `n = ${n}`],
      traps: [trap("forgot-plus-one", n - 1, "That is n − 1. Add 1.")],
    });
  }
  const p = r.int(2, 6);
  const q = p + r.int(3, 8);
  return item({
    skill: "Finding the first term and difference from two terms",
    prompt: `The ${p}th term of an AP is ${sn(T(p))} and the ${q}th term is ${sn(T(q))}. Find the first term.`,
    input: num(),
    answer: a,
    hints: ["Write both terms as a + (n − 1)d.", `Subtracting: ${q - p}d = ${sn(T(q) - T(p))}, so d = ${sn(d)}.`, `a = ${sn(T(p))} − ${p - 1}(${sn(d)})`],
    solution: [`a + ${p - 1}d = ${sn(T(p))}`, `a + ${q - 1}d = ${sn(T(q))}`, `d = ${sn(d)}, a = ${sn(a)}`],
    traps: [trap("gave-d", d, "That is the common difference. The question asks for the first term.")],
  });
};

generators["L5-N1.3"] = (r, tier) => {
  const a = r.int(-5, 20);
  const d = r.intExcept(-4, 6, [0]);
  const n = r.int(8, 30);
  const S = (n / 2) * (2 * a + (n - 1) * d);
  if (tier === "exam" && r.chance(0.5)) {
    const l = a + (n - 1) * d;
    return item({
      skill: "Sum of an AP from its first and last terms",
      prompt: `An AP has first term ${sn(a)}, last term ${sn(l)} and ${n} terms. Find its sum.`,
      input: num(),
      answer: S,
      hints: ["Sₙ = n/2 (a + l)", `${n}/2 × (${sn(a)} + ${sn(l)})`, `${n / 2} × ${sn(a + l)}`],
      solution: [`S = ${n}/2 × (${sn(a)} + ${sn(l)}) = ${sn(S)}`],
      traps: [trap("forgot-half", n * (a + l), "Sₙ = n/2 (a + l): do not forget to halve.")],
    });
  }
  return item({
    skill: "Sum of an AP",
    prompt: `Find the sum of the first ${n} terms of the AP ${[0, 1, 2].map((i) => a + i * d).map(sn).join(", ")}, ...`,
    input: num(),
    answer: S,
    hints: ["Sₙ = n/2 [2a + (n − 1)d]", `a = ${sn(a)}, d = ${sn(d)}, n = ${n}`, `${n}/2 × [${2 * a} + ${n - 1} × ${sn(d)}]`],
    solution: [`S = ${n}/2 × [2(${sn(a)}) + ${n - 1}(${sn(d)})]`, `= ${n / 2} × ${sn(2 * a + (n - 1) * d)} = ${sn(S)}`],
    traps: [trap("nth-term", a + (n - 1) * d, "That is the nth TERM. The question asks for the SUM of n terms.")],
  });
};

generators["L5-N1.4"] = (r, tier) => {
  const a = r.pick([1, 2, 3, 5, 6]);
  const ratio = r.pick(byTier(tier, { build: [2, 3], stretch: [2, 3, -2], exam: [-2, 3, 0.5, -3] }));
  const kind = r.pick(byTier(tier, { build: ["term"], stretch: ["term", "ratio"], exam: ["term", "sum"] }));
  const T = (n) => a * ratio ** (n - 1);
  if (kind === "ratio") {
    return item({
      skill: "The common ratio of a GP",
      prompt: `Find the common ratio of the GP ${[1, 2, 3].map(T).map(sn).join(", ")}, ...`,
      input: frac(),
      answer: fracText(...simplify(ratio * 2, 2)),
      hints: ["r = any term ÷ the term before it.", `${sn(T(2))} ÷ ${sn(T(1))}`, "Check with the next pair."],
      solution: [`r = ${sn(T(2))} ÷ ${sn(T(1))} = ${sn(ratio)}`],
      traps: [trap("difference", T(2) - T(1), "That is a DIFFERENCE. In a GP you divide.")],
    });
  }
  if (kind === "sum") {
    const n = r.int(4, 7);
    const S = (a * (ratio ** n - 1)) / (ratio - 1);
    return item({
      skill: "Sum of a GP",
      prompt: `Find the sum of the first ${n} terms of the GP ${[1, 2, 3].map(T).map(sn).join(", ")}, ...`,
      input: num(),
      answer: r2(S),
      tolerance: 0.01,
      hints: ["Sₙ = a(rⁿ − 1)/(r − 1)", `a = ${a}, r = ${sn(ratio)}, n = ${n}`, `${a}(${sn(ratio)}^${n} − 1)/(${sn(ratio)} − 1)`],
      solution: [`S = ${a}(${r2(ratio ** n)} − 1)/(${sn(ratio - 1)}) = ${r2(S)}`],
      traps: [trap("nth-term", r2(T(n)), "That is the nth term, not the sum.")],
    });
  }
  const n = r.int(5, 9);
  return item({
    skill: "The nth term of a GP",
    prompt: `Find the ${n}th term of the GP ${[1, 2, 3].map(T).map(sn).join(", ")}, ...`,
    input: num(),
    answer: r2(T(n)),
    tolerance: 0.001,
    hints: ["Tₙ = arⁿ⁻¹", `a = ${a}, r = ${sn(ratio)}`, `T${n} = ${a} × (${sn(ratio)})^${n - 1}`],
    solution: [`T${n} = ${a} × (${sn(ratio)})^${n - 1} = ${sn(r2(T(n)))}`],
    traps: [trap("used-n", r2(a * ratio ** n), "The power is n − 1, not n.")],
  });
};

generators["L5-N1.5"] = (r, tier) => {
  if (r.chance(0.5)) {
    const a = r.int(2, 30);
    const [p, q] = r.pick([[1, 2], [1, 3], [2, 3], [1, 4], [3, 4], [-1, 2], [-1, 3]]);
    const [sn_, sd] = simplify(a * q, q - p);
    return item({
      skill: "Sum to infinity of a GP",
      prompt: `Find the sum to infinity of the GP with first term ${a} and common ratio ${fracText(p, q).replace("-", "−")}.`,
      input: frac(),
      answer: fracText(sn_, sd),
      hints: ["The sum to infinity exists when −1 < r < 1.", "S∞ = a / (1 − r)", `${a} ÷ (1 − ${fracText(p, q)}) = ${a} ÷ ${fracText(...simplify(q - p, q))}`],
      solution: [`S∞ = ${a}/(1 − ${fracText(p, q)}) = ${a} × ${q}/${q - p} = ${fracText(sn_, sd)}`],
      traps: [trap("plus-r", fracText(...simplify(a * q, q + p)), "S∞ = a/(1 − r): SUBTRACT r from 1.")],
    });
  }
  const start = r.int(20, 60) * 1000;
  const rise = r.int(2, 10) * 1000;
  const years = r.int(5, 12);
  const total = (years / 2) * (2 * start + (years - 1) * rise);
  const askTotal = r.chance(0.5);
  return item({
    skill: "An AP word problem",
    prompt: `A worker earns ${naira(start)} in the first year and gets a rise of ${naira(rise)} every year. ${askTotal ? `How much does she earn altogether in ${years} years?` : `What is her salary in year ${years}?`}`,
    input: num(),
    answer: askTotal ? total : start + (years - 1) * rise,
    hints: [`The salaries form an AP with a = ${start} and d = ${rise}.`, askTotal ? "Total = Sₙ = n/2 [2a + (n − 1)d]." : "Year n salary = Tₙ = a + (n − 1)d.", `n = ${years}`],
    solution: askTotal ? [`S = ${years}/2 × [${2 * start} + ${years - 1} × ${rise}] = ${naira(total)}`] : [`T = ${start} + ${years - 1} × ${rise} = ${naira(start + (years - 1) * rise)}`],
    traps: [trap(askTotal ? "last-salary" : "total", askTotal ? start + (years - 1) * rise : total, askTotal ? "That is the final salary; the question asks for the total of all the years." : "That is the total; the question asks for one year's salary.")],
  });
};

/* ── L5-N2 · Financial arithmetic ───────────────────────────────────── */

generators["L5-N2.1"] = (r, tier) => {
  const P = r.int(2, 50) * 10000;
  const R = r.pick([5, 8, 10, 12, 15]);
  const n = r.int(2, byTier(tier, { build: 3, stretch: 5, exam: 8 }));
  const A = P * (1 + R / 100) ** n;
  const askCI = r.chance(0.4);
  const answer = Math.round((askCI ? A - P : A) * 100) / 100;
  return item({
    skill: "Compound interest by formula",
    prompt: `Find the ${askCI ? "compound interest" : "amount"} when ${naira(P)} is invested for ${n} years at ${R}% per annum compound interest. Give your answer to the nearest kobo.`,
    input: num(),
    answer,
    tolerance: 0.5,
    hints: ["A = P(1 + R/100)ⁿ", `A = ${P} × ${1 + R / 100}^${n}`, askCI ? "Compound interest = A − P." : "Calculate."],
    solution: [`A = ${P} × ${1 + R / 100}^${n} = ${r2(A)}`, askCI ? `CI = ${r2(A)} − ${P} = ${r2(A - P)}` : null].filter(Boolean),
    traps: [trap("simple-interest", r2(askCI ? (P * R * n) / 100 : P + (P * R * n) / 100), "That is SIMPLE interest. Compound interest grows: use (1 + R/100)ⁿ.")],
  });
};

generators["L5-N2.2"] = (r, tier) => {
  const P = r.int(5, 60) * 50000;
  const R = r.pick([10, 15, 20, 25]);
  const n = r.int(2, 5);
  const V = P * (1 - R / 100) ** n;
  return item({
    skill: "Depreciation (reducing balance)",
    prompt: `A car bought for ${naira(P)} depreciates by ${R}% of its value each year. Find its value after ${n} years.`,
    input: num(),
    answer: r2(V),
    tolerance: 0.5,
    hints: ["Each year the value is multiplied by (1 − R/100).", `V = ${P} × ${1 - R / 100}^${n}`, "Calculate."],
    solution: [`V = ${P} × ${1 - R / 100}^${n} = ${naira(r2(V))}`],
    traps: [trap("straight-line", P - (P * R * n) / 100, "That takes the SAME amount off every year. Depreciation here is a percentage of the CURRENT value each year.")],
  });
};

generators["L5-N2.3"] = (r, tier) => {
  const pay = r.int(2, 20) * 10000;
  const R = r.pick([5, 10, 20]);
  const n = r.int(2, 4);
  // Annuity: equal deposits at the END of each year, compound interest
  const FV = pay * (((1 + R / 100) ** n - 1) / (R / 100));
  if (tier === "build" || r.chance(0.6)) {
    return item({
      skill: "The amount of an annuity",
      prompt: `${naira(pay)} is paid into an account at the end of every year for ${n} years, at ${R}% compound interest. How much is in the account straight after the last payment?`,
      input: num(),
      answer: r2(FV),
      tolerance: 0.5,
      hints: ["Each payment earns interest for a different number of years: the last one earns none.", `Amount = ${pay}[(1.${String(R).padStart(2, "0")})^${n} − 1] ÷ ${R / 100}`, "Or add the payments one year at a time."],
      solution: [`= ${pay} × [(${1 + R / 100})^${n} − 1] / ${R / 100}`, `= ${naira(r2(FV))}`],
      traps: [trap("no-interest", pay * n, "That ignores the interest earned on the earlier payments.")],
    });
  }
  const loan = r.int(5, 40) * 100000;
  const i = R / 100;
  const instal = (loan * i) / (1 - (1 + i) ** -n);
  return item({
    skill: "Amortising a loan",
    prompt: `A loan of ${naira(loan)} is repaid in ${n} equal yearly instalments at ${R}% compound interest. Find each instalment, to the nearest naira.`,
    input: num(),
    answer: Math.round(instal),
    tolerance: 1,
    hints: ["Instalment = P × i / (1 − (1 + i)⁻ⁿ)", `i = ${i}, n = ${n}`, `${loan} × ${i} / (1 − ${1 + i}^−${n})`],
    solution: [`= ${loan} × ${i} / (1 − ${1 + i}^−${n}) = ${naira(Math.round(instal))}`],
    traps: [trap("no-interest", Math.round(loan / n), "That splits the loan equally but ignores the interest.")],
  });
};

generators["L5-N2.4"] = (r, tier) => {
  const kind = r.pick(byTier(tier, { build: ["dividend"], stretch: ["dividend", "bond"], exam: ["yield", "bond"] }));
  const shares = r.int(2, 40) * 100;
  const nominal = r.pick([1, 2, 5]);
  const rate = r.pick([5, 8, 10, 12, 15]);
  if (kind === "dividend") {
    return item({ skill: "Dividends on shares", prompt: `A company declares a dividend of ${rate}% on its ₦${nominal} shares. How much does an investor with ${shares} shares receive?`, input: num(), answer: (shares * nominal * rate) / 100, hints: ["The dividend is a percentage of the NOMINAL (face) value.", `Nominal value held = ${shares} × ₦${nominal} = ₦${shares * nominal}`, `${rate}% of that`], solution: [`${rate}% of ₦${shares * nominal} = ${naira((shares * nominal * rate) / 100)}`], traps: [trap("per-share", (nominal * rate) / 100, "That is the dividend on ONE share.")] });
  }
  if (kind === "yield") {
    const market = nominal * r.pick([1.5, 2, 2.5]);
    const y = r2((nominal * rate) / market);
    return item({ skill: "The yield on shares", prompt: `₦${nominal} shares paying a ${rate}% dividend are bought at a market price of ₦${market} each. What is the yield (return on the money invested), as a percentage?`, input: num({ unit: "%" }), answer: y, tolerance: 0.01, hints: ["Dividend per share = rate × nominal value.", `${rate}% of ₦${nominal} = ₦${(nominal * rate) / 100}`, `Yield = dividend ÷ price paid × 100 = ${(nominal * rate) / 100} ÷ ${market} × 100`], solution: [`Yield = ${(nominal * rate) / 100}/${market} × 100 = ${y}%`], traps: [trap("gave-rate", rate, "The dividend rate is on the nominal value. The yield is on what you PAID.")] });
  }
  const face = r.int(1, 20) * 100000;
  const years = r.int(2, 5);
  return item({ skill: "Interest on a bond", prompt: `A government bond with face value ${naira(face)} pays ${rate}% interest per year. How much interest is paid over ${years} years?`, input: num(), answer: (face * rate * years) / 100, hints: ["Bond interest is a fixed percentage of the face value each year.", `One year: ${rate}% of ${face} = ${(face * rate) / 100}`, `× ${years}`], solution: [`${(face * rate) / 100} × ${years} = ${naira((face * rate * years) / 100)}`], traps: [trap("one-year", (face * rate) / 100, `That is one year. Multiply by ${years}.`)] });
};

generators["L5-N2.5"] = (r, tier) => {
  if (r.chance(0.5)) {
    const price = r.int(4, 80) * 2000;
    return item({ skill: "VAT at 7.5%", prompt: `A generator costs ${naira(price)} before VAT at 7.5%. How much VAT is charged?`, input: num(), answer: price * 0.075, hints: ["VAT = 7.5% of the price.", `${price} × 7.5 ÷ 100`, "Calculate."], solution: [`VAT = ${naira(price * 0.075)}`], traps: [trap("total", price * 1.075, "That is the total price. The question asks for the VAT only.")] });
  }
  const shares = r.int(5, 50) * 100;
  const nominal = r.pick([1, 2]);
  const rate = r.pick([10, 15, 20]);
  const tax = 10;
  const gross = (shares * nominal * rate) / 100;
  return item({ skill: "Net dividend after tax", prompt: `An investor holds ${shares} ₦${nominal} shares. A ${rate}% dividend is declared, and ${tax}% withholding tax is deducted. How much does the investor actually receive?`, input: num(), answer: gross * 0.9, hints: [`Gross dividend = ${rate}% of ₦${shares * nominal} = ₦${gross}`, `Tax = ${tax}% of ₦${gross}`, "Net = gross − tax."], solution: [`Gross = ₦${gross}`, `Tax = ₦${gross * 0.1}`, `Net = ${naira(gross * 0.9)}`], traps: [trap("gross", gross, "Take off the withholding tax.")] });
};

export default generators;
