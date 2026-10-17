import { item, trap, num, text, byTier } from "./kit.js";
import { naira, NAMES, GOODS, MARKETS } from "../rng.js";

/**
 * GENERATORS · LEVEL 2 · COMMERCIAL ARITHMETIC 1, BINARY MULTIPLICATION
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Contains every answer for L2-N2 and L2-N4.
 * ═════════════════════════════════════════════════════════════════════════
 *
 * Every money answer is whole naira by construction: prices are chosen as
 * multiples that make the percentages come out exactly, because a commerce
 * item whose answer is ₦3,456.7826 is testing a calculator, not the idea.
 */

export const generators = {};

/* ── L2-N2.1 · Profit and loss percent ──────────────────────────────── */

generators["L2-N2.1"] = (r, tier) => {
  const who = r.pick(NAMES);
  const good = r.pick(GOODS);
  const cost = r.int(4, 40) * 500;
  const pct = r.pick(byTier(tier, { build: [10, 20, 25, 50], stretch: [5, 12, 15, 30, 40], exam: [8, 12.5, 15, 35, 45] }));
  const gain = r.chance(0.6);
  const change = (cost * pct) / 100;
  if (!Number.isInteger(change)) return generators["L2-N2.1"](r, "build");
  const sell = gain ? cost + change : cost - change;

  if (tier === "build" || r.chance(0.5)) {
    return item({
      skill: gain ? "Profit per cent" : "Loss per cent",
      prompt: `${who} buys ${good.name} for ${naira(cost)} and sells them for ${naira(sell)}. Find the ${gain ? "profit" : "loss"} per cent.`,
      input: num({ unit: "%" }),
      answer: pct,
      hints: [`${gain ? "Profit" : "Loss"} = ${gain ? "selling price − cost price" : "cost price − selling price"}.`, `${gain ? "Profit" : "Loss"} % = ${gain ? "profit" : "loss"} ÷ COST price × 100.`, `${naira(change)} ÷ ${naira(cost)} × 100`],
      solution: [`${gain ? "Profit" : "Loss"} = ${naira(Math.abs(sell - cost))}`, `${gain ? "Profit" : "Loss"} % = ${change} ÷ ${cost} × 100 = ${pct}%`],
      traps: [trap("over-selling-price", Math.round((change / sell) * 10000) / 100, "Profit and loss per cent are always worked out on the COST price, not the selling price."), trap("gave-amount", change, `That is the ${gain ? "profit" : "loss"} in naira. The question asks for a percentage.`)],
    });
  }
  return item({
    skill: "Selling price from a profit or loss per cent",
    prompt: `${who} buys ${good.name} for ${naira(cost)}. At what price must they be sold to make a ${pct}% ${gain ? "profit" : "loss"}?`,
    input: num(),
    answer: sell,
    hints: [`Find ${pct}% of the cost price.`, `${pct}% of ${naira(cost)} = ${naira(change)}.`, gain ? "Add it to the cost price." : "Take it away from the cost price."],
    solution: [`${pct}% of ${cost} = ${change}`, `Selling price = ${cost} ${gain ? "+" : "−"} ${change} = ${naira(sell)}`],
    traps: [trap("gave-change", change, `That is the ${gain ? "profit" : "loss"} alone. ${gain ? "Add it to" : "Take it from"} the cost price.`), trap("wrong-direction", gain ? cost - change : cost + change, gain ? "A profit means selling for MORE than it cost." : "A loss means selling for LESS than it cost.")],
  });
};

/* ── L2-N2.2 · Simple interest ──────────────────────────────────────── */

generators["L2-N2.2"] = (r, tier) => {
  const P = r.int(2, 40) * 5000;
  const R = r.pick(byTier(tier, { build: [5, 10, 4], stretch: [3, 6, 7.5, 8, 12], exam: [2.5, 4.5, 6, 9, 12.5] }));
  const T = r.pick(byTier(tier, { build: [2, 3, 4, 5], stretch: [2, 3, 1.5, 4], exam: [3, 2.5, 6, 4] }));
  const I = (P * R * T) / 100;
  if (!Number.isInteger(I)) return generators["L2-N2.2"](r, "build");
  const kind = r.pick(byTier(tier, { build: ["interest", "amount"], stretch: ["interest", "amount", "rate"], exam: ["rate", "time", "principal"] }));
  const months = T % 1 ? ` (${T * 12} months)` : "";

  const spec = {
    interest: { prompt: `Find the simple interest on ${naira(P)} for ${T} years${months} at ${R}% per annum.`, answer: I, steps: [`I = PRT/100 = ${P} × ${R} × ${T} ÷ 100 = ${naira(I)}`], traps: [trap("no-hundred", P * R * T, "The rate is a PERCENTAGE: divide by 100."), trap("gave-amount", P + I, "That is the AMOUNT (principal + interest). The question asks for the interest only.")] },
    amount: { prompt: `${naira(P)} is saved for ${T} years${months} at ${R}% per annum simple interest. What is the AMOUNT at the end?`, answer: P + I, steps: [`I = ${P} × ${R} × ${T} ÷ 100 = ${I}`, `Amount = P + I = ${P} + ${I} = ${naira(P + I)}`], traps: [trap("interest-only", I, "That is the interest. The amount is principal + interest.")] },
    rate: { prompt: `${naira(P)} earns ${naira(I)} simple interest in ${T} years${months}. Find the rate per cent per annum.`, answer: R, steps: [`R = 100I / (PT) = 100 × ${I} ÷ (${P} × ${T}) = ${R}%`], traps: [trap("forgot-time", R * T, `Divide by the time as well: the interest was earned over ${T} years.`)] },
    time: { prompt: `How many years will it take ${naira(P)} to earn ${naira(I)} simple interest at ${R}% per annum?`, answer: T, steps: [`T = 100I / (PR) = 100 × ${I} ÷ (${P} × ${R}) = ${T} years`], traps: [trap("forgot-rate", Math.round(((100 * I) / P) * 100) / 100, `Divide by the rate as well: T = 100I ÷ (P × R).`)] },
    principal: { prompt: `What sum of money earns ${naira(I)} simple interest in ${T} years${months} at ${R}% per annum?`, answer: P, steps: [`P = 100I / (RT) = 100 × ${I} ÷ (${R} × ${T}) = ${naira(P)}`], traps: [trap("no-hundred", Math.round((I / (R * T)) * 100) / 100, "Multiply the interest by 100: P = 100I ÷ (R × T).")] },
  }[kind];

  return item({
    skill: "Simple interest: I = PRT/100",
    prompt: spec.prompt,
    input: num({ unit: kind === "rate" ? "%" : kind === "time" ? "years" : undefined }),
    answer: spec.answer,
    hints: ["I = PRT/100: P is the principal, R the rate % per annum, T the time in years.", kind === "interest" || kind === "amount" ? "Put the three numbers in and divide by 100." : "Rearrange: the letter you want = 100I divided by the other two.", spec.steps[0]],
    solution: spec.steps,
    traps: spec.traps,
  });
};

/* ── L2-N2.3 · Discount and commission ──────────────────────────────── */

generators["L2-N2.3"] = (r, tier) => {
  const discount = r.chance(0.6);
  const pct = r.pick(byTier(tier, { build: [10, 20, 25], stretch: [5, 15, 30, 12.5], exam: [7.5, 12.5, 15, 35] }));
  const price = r.int(4, 60) * (pct % 1 ? 800 : 400);
  const amount = (price * pct) / 100;
  if (!Number.isInteger(amount)) return generators["L2-N2.3"](r, "build");

  if (discount) {
    const askPaid = r.chance(0.6);
    return item({
      skill: askPaid ? "Price after a discount" : "Finding the discount per cent",
      prompt: askPaid ? `A phone is marked ${naira(price)}. The shop gives a ${pct}% discount. How much does the customer pay?` : `A phone marked ${naira(price)} is sold for ${naira(price - amount)}. What is the discount per cent?`,
      input: num({ unit: askPaid ? undefined : "%" }),
      answer: askPaid ? price - amount : pct,
      hints: askPaid ? [`Discount = ${pct}% of the marked price.`, `${pct}% of ${naira(price)} = ${naira(amount)}`, "Take the discount off the marked price."] : ["Discount = marked price − selling price.", `= ${naira(amount)}`, "Discount % = discount ÷ MARKED price × 100."],
      solution: askPaid ? [`Discount = ${pct}% of ${price} = ${amount}`, `Pays ${price} − ${amount} = ${naira(price - amount)}`] : [`Discount = ${price} − ${price - amount} = ${amount}`, `${amount} ÷ ${price} × 100 = ${pct}%`],
      traps: askPaid ? [trap("gave-discount", amount, "That is the discount. The customer pays the marked price minus the discount.")] : [trap("over-selling", Math.round((amount / (price - amount)) * 10000) / 100, "A discount per cent is worked out on the MARKED price.")],
    });
  }
  const who = r.pick(NAMES);
  return item({
    skill: "Commission on sales",
    prompt: `${who} earns ${pct}% commission on sales. One month, ${who} sells goods worth ${naira(price * 10)}. How much commission is earned?`,
    input: num(),
    answer: amount * 10,
    hints: ["Commission is a percentage of the value of the sales.", `${pct}% of ${naira(price * 10)}`, `${price * 10} × ${pct} ÷ 100`],
    solution: [`${pct}% of ${price * 10} = ${naira(amount * 10)}`],
    traps: [trap("no-hundred", price * 10 * pct, "Divide by 100: it is a percentage.")],
  });
};

/* ── L2-N2.4 · Market problems ──────────────────────────────────────── */

generators["L2-N2.4"] = (r, tier) => {
  const who = r.pick(NAMES);
  const market = r.pick(MARKETS);
  const kind = r.pick(byTier(tier, { build: ["bulk"], stretch: ["bulk", "cost-from-sell"], exam: ["cost-from-sell", "bulk-loss"] }));

  if (kind === "cost-from-sell") {
    const pct = r.pick([20, 25, 50, 10]);
    const cost = r.int(4, 30) * 1000;
    const sell = cost * (1 + pct / 100);
    return item({
      skill: "Finding the cost price from the selling price",
      prompt: `${who} sells a bicycle at ${market} for ${naira(sell)}, making a ${pct}% profit. What did ${who} pay for it?`,
      input: num(),
      answer: cost,
      hints: ["The profit is a percentage of the COST price, which is unknown.", `So the selling price is ${100 + pct}% of the cost price.`, `Cost = ${sell} ÷ ${(100 + pct) / 100}`],
      solution: [`Selling price = ${100 + pct}% of cost`, `Cost = ${sell} × 100 ÷ ${100 + pct} = ${naira(cost)}`],
      traps: [trap("percent-of-selling", sell - (sell * pct) / 100, `The ${pct}% is of the COST price, not the selling price. Taking ${pct}% off ${naira(sell)} is wrong.`)],
    });
  }
  const count = r.pick([10, 12, 20, 24, 50]);
  const each = r.int(3, 20) * 50;
  const total = r.int(2, 8) * 1000 * (count / 10);
  const revenue = count * each;
  const profit = revenue - total;
  if (profit === 0) return generators["L2-N2.4"](r, "build");
  const pct = Math.round((profit / total) * 10000) / 100;
  const gain = profit > 0;
  return item({
    skill: "A complete market transaction",
    prompt: `${who} buys ${count} tins of tomato paste at ${market} for ${naira(total)} altogether, and sells them at ${naira(each)} each. Find the ${gain ? "profit" : "loss"} per cent. Give your answer to 2 decimal places if it is not exact.`,
    input: num({ unit: "%" }),
    answer: Math.abs(pct),
    tolerance: 0.01,
    hints: [`Selling price of all ${count}: ${count} × ${each}.`, `= ${naira(revenue)}. ${gain ? "Profit" : "Loss"} = ${naira(Math.abs(profit))}.`, `${gain ? "Profit" : "Loss"} % = ${Math.abs(profit)} ÷ ${total} × 100`],
    solution: [`Revenue: ${count} × ${each} = ${revenue}`, `${gain ? "Profit" : "Loss"}: ${naira(Math.abs(profit))}`, `${Math.abs(profit)} ÷ ${total} × 100 = ${Math.abs(pct)}%`],
    traps: [trap("over-selling-price", Math.round((Math.abs(profit) / revenue) * 10000) / 100, `Profit and loss per cent are worked out on the COST price, ${naira(total)}, not on the money taken from selling.`)],
  });
};

/* ── L2-N4 · Base two multiplication and other small bases ─────────── */

const toBase = (n, b) => n.toString(b);

generators["L2-N4.1"] = (r, tier) => {
  const a = r.int(byTier(tier, { build: 3, stretch: 5, exam: 9 }), byTier(tier, { build: 7, stretch: 15, exam: 31 }));
  const b = r.int(2, byTier(tier, { build: 3, stretch: 7, exam: 7 }));
  const answer = toBase(a * b, 2);
  const naive = String(Number(toBase(a, 2)) * Number(toBase(b, 2)));
  return item({
    skill: "Multiplying in base two",
    prompt: `Work out ${toBase(a, 2)}₂ × ${toBase(b, 2)}₂, giving your answer in base two.`,
    input: text({ placeholder: "e.g. 10110" }),
    answer,
    accept: [`${answer}₂`, `${answer} base 2`],
    hints: ["Multiplying by 1 copies the number; multiplying by 0 gives 0.", "Write one row for each 1 in the bottom number, shifted one place left each time, then add in base two.", `Check: ${toBase(a, 2)}₂ = ${a} and ${toBase(b, 2)}₂ = ${b}, so the product is ${a * b}.`],
    solution: [`${toBase(a, 2)}₂ = ${a},  ${toBase(b, 2)}₂ = ${b}`, `${a} × ${b} = ${a * b} = ${answer}₂`, "The long multiplication in base two gives the same digits: rows shifted left, added with carries in twos."],
    traps: /[2-9]/.test(naive) ? [trap("base-ten-multiply", naive, `${naive} contains digits above 1, which cannot appear in base two. Add the shifted rows with base-two carries.`)] : [],
  });
};

generators["L2-N4.2"] = (r, tier) => {
  const target = r.pick(byTier(tier, { build: [3, 4, 5], stretch: [3, 5, 8], exam: [3, 4, 5, 8] }));
  const n = r.int(byTier(tier, { build: 9, stretch: 20, exam: 40 }), byTier(tier, { build: 31, stretch: 63, exam: 120 }));
  const bin = toBase(n, 2);
  const answer = toBase(n, target);
  const steps = [];
  let left = n;
  while (left > 0) {
    steps.push(`${left} ÷ ${target} = ${Math.floor(left / target)} r ${left % target}`);
    left = Math.floor(left / target);
  }
  return item({
    skill: "Converting from base two to another small base",
    prompt: `Convert ${bin}₂ to base ${target}.`,
    input: text({ placeholder: "digits only" }),
    answer,
    accept: [`${answer}${"₀₁₂₃₄₅₆₇₈₉"[target]}`, `${answer} base ${target}`],
    hints: ["Go through base ten: first change the base two number to base ten.", `${bin}₂ = ${n}`, `Now divide ${n} by ${target} repeatedly and read the remainders from the bottom up.`],
    solution: [`${bin}₂ = ${n}`, ...steps, `Remainders from the bottom up: ${answer}`],
    traps: [trap("stopped-at-ten", String(n), `${n} is the base TEN value. Now convert ${n} to base ${target}.`), answer.length > 1 ? trap("read-top-down", [...answer].reverse().join(""), "Read the remainders from the BOTTOM up.") : null].filter(Boolean),
  });
};

export default generators;
