import { item, trap, num, list, byTier } from "./kit.js";
import { grouped, naira, NAMES, GOODS, PLACES, gcd, lcm, primeFactors, simplify, tidy } from "../rng.js";

/**
 * GENERATORS · LEVEL 1 · THE NUMBER MODULES
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Contains every answer for L1-N2 to L1-N6.
 * ═════════════════════════════════════════════════════════════════════════
 *
 * The fraction module here is the most heavily trapped in the whole course,
 * and deliberately so. Chief Examiners are still reporting fraction errors in
 * SS3 scripts, which means these mistakes survive five years of schooling.
 * They survive because they are never NAMED: a student who writes
 * 1/2 + 1/3 = 2/5 is told it is wrong, not told that they added the
 * denominators and that adding denominators is adding the SIZE of the pieces
 * rather than the number of them.
 */

export const generators = {};

/* ═══════════════════════════════════════════════════════════════════════
   L1-N2 · FACTORS, HCF AND LCM
   ═══════════════════════════════════════════════════════════════════════ */

const indexForm = (n) => {
  const counts = {};
  for (const p of primeFactors(n)) counts[p] = (counts[p] || 0) + 1;
  return Object.entries(counts)
    .map(([p, k]) => (k === 1 ? p : `${p}^${k}`))
    .join(" × ");
};

generators["L1-N2.1"] = (r, tier) => {
  const n = r.pick(
    byTier(tier, {
      build: [12, 18, 20, 24, 30, 36],
      stretch: [72, 84, 90, 120, 126, 150],
      exam: [216, 252, 360, 396, 504, 540],
    })
  );
  const factors = primeFactors(n);

  return item({
    skill: "Breaking a number into primes with a factor tree",
    prompt: `Write ${n} as a product of its PRIME factors.\n\nList the primes, smallest first, repeating any that appear more than once.`,
    input: list({ placeholder: "e.g. 2, 2, 3" }),
    answer: factors,
    ordered: true,
    hints: [
      "Start dividing by the smallest prime that goes in, and keep going.",
      `Does 2 go into ${n}? Keep dividing by 2 while it does, then move to 3, then 5, then 7.`,
      `${n} = 2 × ${n / 2}, if ${n} is even. Carry on breaking down the right-hand number.`,
    ],
    solution: [
      ...(() => {
        const steps = [];
        let m = n;
        for (const p of factors) {
          steps.push(`${m} ÷ ${p} = ${m / p}`);
          m /= p;
        }
        return steps;
      })(),
      `So ${n} = ${factors.join(" × ")}`,
      `In index form: ${n} = ${indexForm(n)}`,
    ],
    traps: [
      trap(
        "not-all-prime",
        [...new Set(factors)],
        "You have listed each prime once. A prime factorisation repeats a prime as many times as it divides in — 12 is 2 × 2 × 3, not 2 × 3."
      ),
      trap(
        "used-composites",
        [2, n / 2],
        `${n / 2} is not prime — it can be broken down further. Keep going until every number on your list is prime.`,
        "L0-N3.3"
      ),
    ],
  });
};

generators["L1-N2.2"] = (r, tier) => {
  const base = r.int(2, 12);
  const x = base * r.int(2, 9);
  const y = base * r.intExcept(2, 9, [Math.floor(x / base)]);
  const third = tier === "exam" ? base * r.int(2, 11) : null;
  const numbers = third ? [x, y, third] : [x, y];
  const answer = numbers.reduce((g, n) => gcd(g, n));

  return item({
    skill: "Highest common factor from the prime factorisations",
    prompt: `Find the HCF of ${numbers.join(" and ")}.`,
    input: num(),
    answer,
    hints: [
      "HCF means the biggest number that divides into ALL of them exactly.",
      `Write each as a product of primes: ${numbers.map((n) => `${n} = ${indexForm(n)}`).join(";  ")}`,
      "Take only the primes that appear in EVERY list, each to the lowest power it appears to, and multiply them.",
    ],
    solution: [
      ...numbers.map((n) => `${n} = ${indexForm(n)}`),
      "Take the primes common to all of them, each to the LOWEST power.",
      `HCF = ${answer}`,
      `Check: ${numbers.map((n) => `${n} ÷ ${answer} = ${n / answer}`).join(",  ")} — all whole numbers.`,
    ],
    traps: [
      trap(
        "gave-lcm",
        numbers.reduce((l, n) => lcm(l, n)),
        `That is the LCM, not the HCF. The HCF is the biggest number that goes INTO all of them, so it is never bigger than the smallest number you started with. The LCM is the smallest number they all go into, and it is never smaller than the largest.`,
        "L1-N2.3"
      ),
      trap("multiplied-them", numbers.reduce((p, n) => p * n), "You multiplied the numbers together. That gives a common multiple, not a common factor."),
      trap("a-common-factor", answer > 2 ? 2 : 1, "That does divide into all of them, but it is not the HIGHEST one that does. Compare the full prime factorisations and take every prime they share."),
    ],
  });
};

generators["L1-N2.3"] = (r, tier) => {
  const x = byTier(tier, { build: r.int(4, 12), stretch: r.int(8, 20), exam: r.int(12, 30) });
  const y = byTier(tier, { build: r.int(4, 12), stretch: r.int(9, 24), exam: r.int(14, 36) });
  const answer = lcm(x, y);

  return item({
    skill: "Lowest common multiple, and why it is not the product",
    prompt: `Find the LCM of ${x} and ${y}.`,
    input: num(),
    answer,
    hints: [
      "LCM is the smallest number that BOTH go into.",
      `List the multiples of the bigger one — ${Math.max(x, y)}, ${Math.max(x, y) * 2}, ${Math.max(x, y) * 3}… — and stop at the first that the other one also divides.`,
      `Or: LCM = (${x} × ${y}) ÷ HCF, and the HCF of ${x} and ${y} is ${gcd(x, y)}.`,
    ],
    solution: [
      `${x} = ${indexForm(x)},  ${y} = ${indexForm(y)}`,
      "Take every prime that appears in either, to the HIGHEST power it appears to.",
      `LCM = ${answer}`,
      gcd(x, y) > 1
        ? `Note ${x} × ${y} = ${x * y}, which is ${x * y / answer} times too big. That is because they share a factor of ${gcd(x, y)}.`
        : `Here ${x} and ${y} share no factors, so the LCM happens to be ${x} × ${y}.`,
    ],
    traps: [
      trap(
        "multiplied-them",
        x * y,
        gcd(x, y) > 1
          ? `You multiplied them. ${x} × ${y} = ${x * y} IS a common multiple, but not the LOWEST one — it counts the shared factor of ${gcd(x, y)} twice. Divide by the HCF: ${x * y} ÷ ${gcd(x, y)} = ${answer}.`
          : "Multiplying works here only because these two share no factors. It is not the method — when the numbers do share a factor it gives an answer that is too big."
      ),
      trap("gave-hcf", gcd(x, y), "That is the HCF — the biggest number that goes into both. The LCM is the smallest number both go into, so it is at least as big as the larger of the two.", "L1-N2.2"),
    ],
    scaffold: [
      { prompt: `Step 1. Write out the first six multiples of ${x}.`, input: list(), answer: [1, 2, 3, 4, 5, 6].map((k) => x * k), hint: `Keep adding ${x}.` },
      { prompt: `Step 2. Write out the first six multiples of ${y}.`, input: list(), answer: [1, 2, 3, 4, 5, 6].map((k) => y * k), hint: `Keep adding ${y}.` },
      { prompt: "Step 3. What is the SMALLEST number that appears in both lists?", input: num(), answer, hint: "Look for the first number the two lists have in common." },
    ],
  });
};

generators["L1-N2.4"] = (r, tier) => {
  const wantsLcm = r.chance();
  const who = r.sample(NAMES, 2);

  if (wantsLcm) {
    const x = r.int(4, byTier(tier, { build: 10, stretch: 14, exam: 20 }));
    const y = r.intExcept(5, byTier(tier, { build: 12, stretch: 18, exam: 28 }), [x]);
    const answer = lcm(x, y);
    return item({
      skill: "Deciding that a word problem needs the LCM",
      prompt: `Two church bells ring together at 6:00 a.m. One then rings every ${x} minutes and the other every ${y} minutes.\n\nAfter how many minutes do they next ring TOGETHER?`,
      input: num({ placeholder: "minutes" }),
      answer,
      hints: [
        "Each bell rings at its own multiples: one at 6, 12, 18… the other at 8, 16, 24…",
        "You are looking for a time that appears on BOTH lists.",
        `The first time both lists meet is the LCM of ${x} and ${y}.`,
      ],
      solution: [
        `Bell one rings at multiples of ${x}. Bell two rings at multiples of ${y}.`,
        `They ring together at a common multiple, and the NEXT time is the lowest one.`,
        `LCM of ${x} and ${y} = ${answer}`,
        `So they next ring together after ${answer} minutes.`,
      ],
      traps: [
        trap(
          "used-hcf",
          gcd(x, y),
          `You used the HCF. Ask which way the answer should go: the bells cannot ring together SOONER than either of them rings at all, so the answer must be at least ${Math.max(x, y)}. An answer smaller than both numbers is the signal that you needed the LCM, not the HCF.`,
          "L1-N2.3"
        ),
        trap("multiplied", x * y, gcd(x, y) > 1 ? `${x} × ${y} is a time they ring together, but not the FIRST one. Divide by their HCF.` : "Multiplying happens to work when the two share no factors, but it is not the reason — the LCM is what the question is asking for."),
      ],
    });
  }

  const g = r.int(6, byTier(tier, { build: 12, stretch: 18, exam: 24 }));
  const a = g * r.int(2, byTier(tier, { build: 5, stretch: 7, exam: 11 }));
  const b = g * r.intExcept(2, byTier(tier, { build: 6, stretch: 8, exam: 13 }), []);
  const answer = gcd(a, b);
  return item({
    skill: "Deciding that a word problem needs the HCF",
    prompt: `${who[0]} has ${a} oranges and ${b} mangoes. They are to be packed into bags so that every bag has the SAME number of oranges and the SAME number of mangoes, with nothing left over.\n\nWhat is the largest number of bags possible?`,
    input: num({ placeholder: "bags" }),
    answer,
    hints: [
      "The number of bags has to divide exactly into both totals.",
      "So you are looking for a common FACTOR of the two numbers.",
      `The largest one is the HCF of ${a} and ${b}.`,
    ],
    solution: [
      `The number of bags must divide ${a} exactly and ${b} exactly.`,
      `HCF of ${a} and ${b} = ${answer}`,
      `So ${answer} bags, each with ${a / answer} oranges and ${b / answer} mangoes.`,
    ],
    traps: [
      trap(
        "used-lcm",
        lcm(a, b),
        `You used the LCM. Check the size: you cannot make more bags than you have fruit. When the answer must divide INTO the numbers given, it is the HCF; when the answer must be something the numbers divide into, it is the LCM.`,
        "L1-N2.2"
      ),
      trap("added", a + b, "That is the total number of fruits, not the number of bags."),
    ],
  });
};

/* ═══════════════════════════════════════════════════════════════════════
   L1-N3 · FRACTIONS
   ═══════════════════════════════════════════════════════════════════════ */

generators["L1-N3.1"] = (r, tier) => {
  const d1 = r.pick(byTier(tier, { build: [2, 3, 4], stretch: [4, 5, 6, 8], exam: [6, 8, 9, 10, 12] }));
  const d2 = r.pick(byTier(tier, { build: [3, 4, 6], stretch: [6, 8, 9, 10], exam: [8, 10, 12, 15, 16] }).filter((d) => d !== d1)) || d1 + 1;
  const n1 = r.int(1, d1 - 1);
  const n2 = r.int(1, d2 - 1);
  const adding = r.chance(0.6);

  const common = lcm(d1, d2);
  const top1 = (n1 * common) / d1;
  const top2 = (n2 * common) / d2;
  const rawTop = adding ? top1 + top2 : Math.abs(top1 - top2);
  const [sn, sd] = simplify(rawTop, common);

  const left = adding || top1 >= top2 ? `${n1}/${d1}` : `${n2}/${d2}`;
  const right = adding || top1 >= top2 ? `${n2}/${d2}` : `${n1}/${d1}`;

  return item({
    skill: "Adding or subtracting fractions over a common denominator",
    prompt: `Work out ${left} ${adding ? "+" : "−"} ${right}.\n\nGive your answer as a fraction in its lowest terms.`,
    input: { kind: "fraction", placeholder: "e.g. 5/6" },
    answer: `${sn}/${sd}`,
    exact: "lowest-terms",
    accept: sd === 1 ? [String(sn)] : [],
    visual: { kind: "fractionBars", parts: [[n1, d1], [n2, d2]], operation: adding ? "add" : "subtract" },
    hints: [
      "You cannot add halves to thirds any more than you can add goats to chairs. Make the pieces the same size first.",
      `The LCM of ${d1} and ${d2} is ${common}, so rewrite both over ${common}.`,
      `${n1}/${d1} = ${top1}/${common} and ${n2}/${d2} = ${top2}/${common}. Now ${adding ? "add" : "subtract"} the TOPS only.`,
    ],
    solution: [
      `Common denominator: LCM of ${d1} and ${d2} is ${common}.`,
      `${n1}/${d1} = ${top1}/${common}`,
      `${n2}/${d2} = ${top2}/${common}`,
      `${top1}/${common} ${adding ? "+" : "−"} ${top2}/${common} = ${rawTop}/${common}`,
      rawTop / common === sn / sd && rawTop !== sn
        ? `Simplify: ${rawTop}/${common} = ${sn}/${sd}`
        : `In lowest terms: ${sn}/${sd}`,
    ],
    traps: [
      trap(
        "added-denominators",
        adding ? `${n1 + n2}/${d1 + d2}` : `${Math.abs(n1 - n2)}/${Math.abs(d1 - d2) || 1}`,
        `You ${adding ? "added" : "subtracted"} the tops AND the bottoms. The bottom number says how big each piece is; the top says how many you have. ${adding ? "Adding" : "Subtracting"} the bottoms changes the size of the pieces halfway through the sum, which is why the answer comes out wrong — check it against the picture: ${n1}/${d1} alone is already ${tidy(n1 / d1, 3)}, so the answer cannot be ${tidy((n1 + n2) / (d1 + d2), 3)}.`
      ),
      trap(
        "kept-denominator",
        `${adding ? n1 + n2 : Math.abs(n1 - n2)}/${common}`,
        "You used the right common denominator but did not convert the TOPS to match it. When the bottom is multiplied, the top must be multiplied by the same amount, or the fraction has changed value."
      ),
      trap("not-simplified", `${rawTop}/${common}`, "The arithmetic is right. Now finish the job: the answer has to be in its LOWEST terms, and this one still has a common factor.", "L0-N4.2"),
    ],
    scaffold: [
      { prompt: `Step 1. What is the LCM of ${d1} and ${d2}?`, input: num(), answer: common, hint: "The smallest number both denominators go into." },
      { prompt: `Step 2. Rewrite ${n1}/${d1} over ${common}. What is the new numerator?`, input: num(), answer: top1, hint: `${common} ÷ ${d1} = ${common / d1}, so multiply the top by ${common / d1}.` },
      { prompt: `Step 3. Rewrite ${n2}/${d2} over ${common}. What is the new numerator?`, input: num(), answer: top2, hint: `${common} ÷ ${d2} = ${common / d2}, so multiply the top by ${common / d2}.` },
      { prompt: `Step 4. Now ${adding ? "add" : "subtract"} the numerators and write the answer in lowest terms.`, input: { kind: "fraction" }, answer: `${sn}/${sd}`, hint: `${top1} ${adding ? "+" : "−"} ${top2} over ${common}, then simplify.` },
    ],
  });
};

generators["L1-N3.2"] = (r, tier) => {
  const multiplying = r.chance(0.5);
  const d1 = r.int(2, byTier(tier, { build: 6, stretch: 9, exam: 12 }));
  const d2 = r.int(2, byTier(tier, { build: 6, stretch: 9, exam: 12 }));
  const n1 = r.int(1, d1 - 1);
  const n2 = r.int(1, d2 - 1);

  const rawTop = multiplying ? n1 * n2 : n1 * d2;
  const rawBottom = multiplying ? d1 * d2 : d1 * n2;
  const [sn, sd] = simplify(rawTop, rawBottom);

  return item({
    skill: multiplying ? "Multiplying fractions straight across" : "Dividing by multiplying by the reciprocal",
    prompt: `Work out ${n1}/${d1} ${multiplying ? "×" : "÷"} ${n2}/${d2}.\n\nGive your answer as a fraction in its lowest terms.`,
    input: { kind: "fraction" },
    answer: `${sn}/${sd}`,
    exact: "lowest-terms",
    accept: sd === 1 ? [String(sn)] : [],
    hints: [
      multiplying
        ? "Multiplying is the easy one: tops together, bottoms together. No common denominator needed."
        : "Dividing by a fraction is the same as multiplying by it upside down.",
      multiplying
        ? `${n1} × ${n2} on the top, ${d1} × ${d2} on the bottom.`
        : `Flip the second fraction: ${n2}/${d2} becomes ${d2}/${n2}, and change ÷ to ×.`,
      `That gives ${rawTop}/${rawBottom}. Now simplify.`,
    ],
    solution: multiplying
      ? [
          `${n1}/${d1} × ${n2}/${d2} = (${n1} × ${n2}) / (${d1} × ${d2}) = ${rawTop}/${rawBottom}`,
          `In lowest terms: ${sn}/${sd}`,
        ]
      : [
          `Dividing by ${n2}/${d2} is multiplying by its reciprocal, ${d2}/${n2}.`,
          `Why: dividing asks "how many of these fit into that?", and ${n2}/${d2} fits into 1 exactly ${d2}/${n2} times.`,
          `${n1}/${d1} × ${d2}/${n2} = ${rawTop}/${rawBottom}`,
          `In lowest terms: ${sn}/${sd}`,
        ],
    traps: [
      multiplying
        ? trap(
            "found-common-denominator",
            `${(n1 * lcm(d1, d2)) / d1 + (n2 * lcm(d1, d2)) / d2}/${lcm(d1, d2)}`,
            "You used a common denominator. That is for ADDING and subtracting. To multiply, go straight across — tops together, bottoms together."
          )
        : trap(
            "flipped-the-first",
            `${d1 * n2}/${n1 * d2}`,
            "You flipped the wrong fraction. It is the one you are dividing BY — the second one — that gets turned upside down."
          ),
      trap(
        "divided-straight-across",
        multiplying ? `${simplify(n1 * d2, d1 * n2)[0]}/${simplify(n1 * d2, d1 * n2)[1]}` : `${simplify(n1 * n2, d1 * d2)[0]}/${simplify(n1 * n2, d1 * d2)[1]}`,
        multiplying
          ? "That is what you would get by dividing. Read the sign again."
          : "You went straight across as if it were a multiplication. For division, flip the second fraction first."
      ),
      trap("not-simplified", `${rawTop}/${rawBottom}`, "Right value, not yet in lowest terms. Divide top and bottom by their HCF.", "L0-N4.2"),
    ],
  });
};

generators["L1-N3.3"] = (r, tier) => {
  const d = r.int(2, byTier(tier, { build: 5, stretch: 8, exam: 12 }));
  const w1 = r.int(1, byTier(tier, { build: 3, stretch: 6, exam: 9 }));
  const n1 = r.int(1, d - 1);
  const w2 = r.int(1, byTier(tier, { build: 2, stretch: 5, exam: 8 }));
  const n2 = r.int(1, d - 1);

  const imp1 = w1 * d + n1;
  const imp2 = w2 * d + n2;
  const total = imp1 + imp2;
  const [sn, sd] = simplify(total, d);
  const whole = Math.floor(sn / sd);
  const rest = sn % sd;

  return item({
    skill: "Converting mixed numbers to improper fractions and back",
    prompt: `Work out ${w1} ${n1}/${d} + ${w2} ${n2}/${d}.\n\nGive your answer as a mixed number.`,
    input: { kind: "fraction", placeholder: "e.g. 3 1/4" },
    answer: rest === 0 ? String(whole) : `${whole} ${rest}/${sd}`,
    accept: [`${sn}/${sd}`],
    hints: [
      "Turn both into improper fractions first: whole × bottom, plus the top.",
      `${w1} ${n1}/${d} = ${imp1}/${d} and ${w2} ${n2}/${d} = ${imp2}/${d}.`,
      `Add the tops: ${imp1} + ${imp2} = ${total}, over ${d}. Now convert back.`,
    ],
    solution: [
      `${w1} ${n1}/${d} = (${w1} × ${d} + ${n1})/${d} = ${imp1}/${d}`,
      `${w2} ${n2}/${d} = (${w2} × ${d} + ${n2})/${d} = ${imp2}/${d}`,
      `${imp1}/${d} + ${imp2}/${d} = ${total}/${d}`,
      `${total} ÷ ${d} = ${Math.floor(total / d)} remainder ${total % d}`,
      `So the answer is ${rest === 0 ? whole : `${whole} ${rest}/${sd}`}.`,
    ],
    traps: [
      trap(
        "left-improper",
        `${total}/${d}`,
        "Right value, but the question asked for a MIXED number. Divide the top by the bottom: the quotient is the whole part and the remainder stays over the same denominator."
      ),
      trap(
        "added-wholes-and-tops-separately",
        `${w1 + w2} ${n1 + n2}/${d}`,
        n1 + n2 >= d
          ? `You added the whole parts and the fraction parts separately and left ${n1 + n2}/${d} as it stands. But ${n1 + n2}/${d} is more than a whole one, so that extra whole has to be carried across into the whole-number part.`
          : "Adding the parts separately works here, but check whether the fraction part came to more than one whole — when it does, it has to be carried."
      ),
      trap("multiplied-whole-by-top", `${w1 * n1 + w2 * n2}/${d}`, `To make ${w1} ${n1}/${d} improper you multiply the whole by the BOTTOM and add the top: ${w1} × ${d} + ${n1}. You multiplied by the top instead.`),
    ],
  });
};

generators["L1-N3.4"] = (r, tier) => {
  const d = r.pick([3, 4, 5, 6, 8]);
  const n = r.int(1, d - 1);
  const remainingFraction = byTier(tier, { build: null, stretch: [1, 2], exam: [2, 3] });
  const who = r.pick(NAMES);
  const good = r.pick(GOODS);

  if (!remainingFraction) {
    const total = r.int(3, 20) * d;
    const spent = (total / d) * n;
    return item({
      skill: "A one-step fraction word problem, drawn as a bar",
      prompt: `${who} had ${grouped(total)} ${good.name}. ${who} sold ${n}/${d} of them.\n\nHow many were sold?`,
      input: num(),
      answer: spent,
      visual: { kind: "barModel", parts: d, shaded: n, total, label: `${grouped(total)} ${good.name}` },
      hints: [
        `Draw the bar in ${d} equal parts, with the whole bar worth ${grouped(total)}.`,
        `One part = ${grouped(total)} ÷ ${d} = ${grouped(total / d)}.`,
        `${n} parts were sold.`,
      ],
      solution: [
        `The bar is ${grouped(total)}, cut into ${d} equal parts.`,
        `One part = ${grouped(total)} ÷ ${d} = ${grouped(total / d)}`,
        `${n} parts = ${n} × ${grouped(total / d)} = ${grouped(spent)}`,
      ],
      traps: [
        trap("gave-remainder", total - spent, "That is how many were LEFT. Read the question again — it asks how many were sold."),
        trap("one-part", total / d, `That is one part out of ${d}. ${n} parts were sold, so multiply by ${n}.`),
      ],
    });
  }

  // Two-stage: a fraction of what is left after a first fraction is taken.
  const [n2, d2] = [remainingFraction[0], remainingFraction[1] + 1];
  const parts = d * d2;
  const total = r.int(2, 9) * parts;
  const first = (total / d) * n;
  const left = total - first;
  const second = (left / d2) * n2;
  const finalLeft = left - second;

  return item({
    skill: "A two-stage fraction problem, where the second fraction is of what is LEFT",
    prompt: `${who} had ${naira(total)}. ${who} spent ${n}/${d} of it on transport, then ${n2}/${d2} of the REMAINDER on food.\n\nHow much is left?`,
    input: num({ placeholder: "naira, digits only" }),
    answer: finalLeft,
    accept: [grouped(finalLeft), naira(finalLeft)],
    visual: { kind: "barModel", parts: d, shaded: n, total, label: naira(total), stage2: { of: d2, take: n2 } },
    hints: [
      "Draw one bar. Take the transport slice off it first, and then work only on what is left.",
      `Transport: ${n}/${d} of ${naira(total)} = ${naira(first)}. That leaves ${naira(left)}.`,
      `Food is ${n2}/${d2} of ${naira(left)} — NOT of ${naira(total)}.`,
    ],
    solution: [
      `Transport: ${n}/${d} × ${naira(total)} = ${naira(first)}`,
      `Remainder: ${naira(total)} − ${naira(first)} = ${naira(left)}`,
      `Food: ${n2}/${d2} × ${naira(left)} = ${naira(second)}`,
      `Left: ${naira(left)} − ${naira(second)} = ${naira(finalLeft)}`,
    ],
    traps: [
      trap(
        "second-fraction-of-total",
        total - first - (total / d2) * n2,
        `You took the food fraction out of the ORIGINAL amount. The question says ${n2}/${d2} "of the remainder" — after transport there was only ${naira(left)} left, and the food fraction is of that.`
      ),
      trap("added-the-fractions", total - (total * (n / d + n2 / d2)), `You added ${n}/${d} and ${n2}/${d2} and took both out of the original. That only works when both fractions are of the SAME whole, and the second one here is not.`),
      trap("gave-amount-spent", first + second, "That is how much was SPENT altogether. The question asks how much is left."),
    ],
  });
};

/* ═══════════════════════════════════════════════════════════════════════
   L1-N4 · DECIMALS AND PERCENTAGES
   ═══════════════════════════════════════════════════════════════════════ */

generators["L1-N4.1"] = (r, tier) => {
  const table = [
    [1, 2, 0.5, 50], [1, 4, 0.25, 25], [3, 4, 0.75, 75], [1, 5, 0.2, 20],
    [2, 5, 0.4, 40], [3, 5, 0.6, 60], [1, 10, 0.1, 10], [3, 10, 0.3, 30],
    [7, 10, 0.7, 70], [1, 8, 0.125, 12.5], [3, 8, 0.375, 37.5], [1, 20, 0.05, 5],
    [1, 25, 0.04, 4], [9, 20, 0.45, 45], [7, 8, 0.875, 87.5], [11, 20, 0.55, 55],
  ];
  const pool = tier === "build" ? table.slice(0, 9) : table;
  const [n, d, dec, pct] = r.pick(pool);
  const direction = r.pick(["to-percent", "to-decimal", "to-fraction"]);

  if (direction === "to-percent") {
    return item({
      skill: "Fraction to percentage",
      prompt: `Write ${n}/${d} as a percentage.`,
      input: num({ placeholder: "% — number only" }),
      answer: pct,
      hints: ["Per cent means 'out of a hundred'.", `So rewrite ${n}/${d} with 100 underneath, or work out ${n} ÷ ${d} first.`, `${n} ÷ ${d} = ${dec}. Now multiply by 100.`],
      solution: [`${n}/${d} = ${n} ÷ ${d} = ${dec}`, `${dec} × 100 = ${pct}%`],
      traps: [
        trap("gave-decimal", dec, "That is the decimal. To turn a decimal into a percentage, multiply by 100 — the percentage is how many hundredths it is."),
        trap("divided-backwards", tidy((d / n) * 100), `You divided the wrong way. ${n}/${d} means ${n} ÷ ${d}, top divided by bottom.`),
      ],
    });
  }

  if (direction === "to-decimal") {
    return item({
      skill: "Percentage to decimal",
      prompt: `Write ${pct}% as a decimal.`,
      input: num(),
      answer: dec,
      hints: ["Per cent means 'out of 100'.", `So ${pct}% is ${pct}/100.`, "Dividing by 100 moves every digit two places to the right."],
      solution: [`${pct}% = ${pct}/100`, `${pct} ÷ 100 = ${dec}`],
      traps: [
        trap("moved-one-place", tidy(pct / 10), "You divided by 10. Per cent is out of ONE HUNDRED, so divide by 100 — two places, not one."),
        trap("multiplied", tidy(pct * 100), "You multiplied by 100. Going from a percentage to a decimal makes the number smaller, so it is a division."),
      ],
    });
  }

  return item({
    skill: "Percentage to fraction in lowest terms",
    prompt: `Write ${pct}% as a fraction in its lowest terms.`,
    input: { kind: "fraction" },
    answer: `${n}/${d}`,
    exact: "lowest-terms",
    hints: [`Start by writing it over 100: ${pct}/100.`, "Now simplify by dividing top and bottom by their HCF.", `${Number.isInteger(pct) ? `The HCF of ${pct} and 100 is ${gcd(pct, 100)}.` : "Multiply top and bottom by 10 first to clear the decimal."}`],
    solution: [
      `${pct}% = ${pct}/100`,
      Number.isInteger(pct)
        ? `Divide top and bottom by ${gcd(pct, 100)}: ${n}/${d}`
        : `Multiply top and bottom by 10: ${pct * 10}/1000, then simplify to ${n}/${d}`,
    ],
    traps: [trap("left-over-100", `${pct}/100`, "Right value, but not in lowest terms. Divide top and bottom by their highest common factor.", "L0-N4.2")],
  });
};

generators["L1-N4.2"] = (r, tier) => {
  const pct = r.pick(byTier(tier, { build: [10, 20, 25, 50], stretch: [5, 15, 35, 60, 75], exam: [12.5, 17.5, 37.5, 62.5, 85] }));
  const base = byTier(tier, { build: r.int(2, 40) * 100, stretch: r.int(5, 90) * 200, exam: r.int(12, 95) * 500 });
  const answer = tidy((pct / 100) * base);
  const who = r.pick(NAMES);
  const place = r.pick(PLACES);

  return item({
    skill: "Finding a percentage of an amount",
    prompt: `A school in ${place} has ${grouped(base)} students. ${pct}% of them travel by bus.\n\nHow many students travel by bus?`,
    input: num(),
    answer,
    accept: [grouped(answer)],
    hints: [
      "Per cent means 'out of a hundred', so this is a fraction of the total.",
      `${pct}% = ${tidy(pct / 100)}.`,
      `Multiply: ${tidy(pct / 100)} × ${grouped(base)}.`,
    ],
    solution: [
      `${pct}% = ${pct}/100 = ${tidy(pct / 100)}`,
      `${tidy(pct / 100)} × ${grouped(base)} = ${grouped(answer)}`,
      `Sense check: ${pct}% is ${pct < 50 ? "less" : pct === 50 ? "exactly" : "more"} than half, and ${grouped(answer)} is ${pct < 50 ? "less" : pct === 50 ? "exactly" : "more"} than half of ${grouped(base)}.`,
    ],
    traps: [
      trap("forgot-to-divide-by-100", tidy(pct * base), `You multiplied by ${pct} instead of by ${pct}%. A percentage has to be turned into a fraction or a decimal first — divide by 100.`),
      trap("gave-remainder", tidy(base - answer), `That is the number who do NOT travel by bus. ${who} would want the other figure — read which group the question names.`),
    ],
    scaffold: [
      { prompt: `Step 1. Write ${pct}% as a decimal.`, input: num(), answer: tidy(pct / 100), hint: "Divide by 100 — move the digits two places right." },
      { prompt: `Step 2. Now multiply that by ${grouped(base)}.`, input: num(), answer, hint: `${tidy(pct / 100)} × ${grouped(base)}` },
    ],
  });
};

generators["L1-N4.3"] = (r, tier) => {
  const total = byTier(tier, { build: r.pick([20, 25, 40, 50]), stretch: r.pick([60, 75, 80, 120]), exam: r.pick([160, 240, 320, 450]) });
  const part = r.int(1, total - 1);
  const answer = tidy((part / total) * 100, 2);
  const who = r.pick(NAMES);

  return item({
    skill: "Expressing one quantity as a percentage of another",
    prompt: `${who} scored ${part} out of ${total} in a test.\n\nWhat percentage is that? Give your answer to 1 decimal place if it is not exact.`,
    input: num({ placeholder: "% — number only" }),
    answer,
    tolerance: 0.06,
    hints: [
      "Which number is the WHOLE? That one goes on the bottom.",
      `${part}/${total}, then turn the fraction into a percentage.`,
      `${part} ÷ ${total} × 100.`,
    ],
    solution: [
      `The whole is ${total}, so the fraction is ${part}/${total}.`,
      `${part} ÷ ${total} = ${tidy(part / total, 4)}`,
      `× 100 = ${answer}%`,
    ],
    traps: [
      trap(
        "upside-down",
        tidy((total / part) * 100, 2),
        `You divided the wrong way round: ${total} ÷ ${part} instead of ${part} ÷ ${total}. The quantity that represents the WHOLE always goes underneath. A part of a whole cannot be more than 100%, so an answer above 100 is the signal.`
      ),
      trap("forgot-the-100", tidy(part / total, 4), "That is the fraction as a decimal. Multiply by 100 to make it a percentage."),
    ],
  });
};

/* ═══════════════════════════════════════════════════════════════════════
   L1-N5 · APPROXIMATION
   ═══════════════════════════════════════════════════════════════════════ */

generators["L1-N5.1"] = (r, tier) => {
  const dp = byTier(tier, { build: 1, stretch: 2, exam: r.int(2, 3) });
  const digits = Array.from({ length: dp + 3 }, () => r.int(0, 9));
  // Force a decider digit that is not 5, so the item never depends on a
  // rounding convention the student has not been taught.
  if (digits[dp] === 5) digits[dp] = r.pick([4, 6]);
  const whole = r.int(1, 99);
  const value = Number(`${whole}.${digits.join("")}`);
  // Kept as a STRING. `exact: decimals:n` counts the digits the student typed,
  // and Number("12.30") is 12.3 — an answer key that would fail its own item.
  const answer = value.toFixed(dp);

  return item({
    skill: "Rounding to a stated number of decimal places",
    prompt: `Round ${value} to ${dp} decimal place${dp === 1 ? "" : "s"}.`,
    input: num(),
    exact: `decimals:${dp}`,
    answer,
    hints: [
      `Count ${dp} digit${dp === 1 ? "" : "s"} after the point and draw a line there.`,
      `The digit just after the line is ${digits[dp]}.`,
      `${digits[dp] >= 5 ? "5 or more, so round the last kept digit UP" : "Less than 5, so leave the last kept digit as it is"}.`,
    ],
    solution: [
      `Keep ${dp} decimal place${dp === 1 ? "" : "s"}: ${whole}.${digits.slice(0, dp).join("")} | ${digits.slice(dp).join("")}`,
      `The first digit after the cut is ${digits[dp]}.`,
      `${digits[dp] >= 5 ? "Round up" : "Round down"}, so the answer is ${answer}.`,
    ],
    traps: [
      trap("truncated", `${whole}.${digits.slice(0, dp).join("")}`, digits[dp] >= 5 ? "You cut the number off instead of rounding it. The digit after the cut was 5 or more, so the last digit you kept goes up by one." : "Here cutting happens to give the right value, but it is not the method — check the digit after the cut every time."),
      trap("rounded-too-far", value.toFixed(Math.max(0, dp - 1)), `You rounded to ${dp - 1} decimal place${dp - 1 === 1 ? "" : "s"}. Count the places carefully: the question asked for ${dp}.`),
      trap("chain-rounded", Number(value.toFixed(dp + 1)).toFixed(dp), "You rounded in stages — to the next place first, then again. Round ONCE, from the original number. Rounding twice can push an answer past where it should be, and this is exactly what the examiners mean by premature rounding."),
    ],
  });
};

generators["L1-N5.2"] = (r, tier) => {
  const sf = byTier(tier, { build: 2, stretch: 3, exam: r.int(2, 3) });
  const small = tier === "exam" && r.chance(0.5);
  const raw = small
    ? Number(`0.00${r.int(1000, 9999)}`)
    : r.int(10000, 999999) / (r.chance() ? 1 : 100);

  const answer = Number(Number(raw).toPrecision(sf));

  return item({
    skill: "Rounding to significant figures, including leading zeros",
    prompt: `Round ${raw} to ${sf} significant figure${sf === 1 ? "" : "s"}.`,
    input: num(),
    answer,
    tolerance: Math.abs(answer) * 1e-9,
    hints: [
      "Significant figures are counted from the FIRST NON-ZERO digit, wherever it is.",
      small
        ? "Leading zeros do not count. In 0.00432 the first significant figure is the 4."
        : "Count from the left, starting at the first digit that is not zero.",
      `Count ${sf} of them, then look at the very next digit to decide up or down.`,
    ],
    solution: [
      `First significant figure: ${String(raw).replace(/^[0.]+/, "")[0]}`,
      `Count ${sf} significant figure${sf === 1 ? "" : "s"} from there, then round using the next digit.`,
      `Answer: ${answer}`,
      small ? "The zeros before the first significant figure are place-holders. They are not significant, but they must stay in the answer." : "Zeros after the last significant figure hold the place value and must stay.",
    ],
    traps: [
      trap(
        "counted-leading-zeros",
        small ? Number(Number(raw).toPrecision(Math.max(1, sf - 2))) : Number(Number(raw).toPrecision(sf + 1)),
        small
          ? "You counted the zeros at the front as significant figures. They are not — they only hold the place. Start counting at the first digit that is not a zero."
          : "You have kept one figure too many. Count the significant figures again from the first non-zero digit."
      ),
      trap("used-decimal-places", Number(raw.toFixed(sf)), `You rounded to ${sf} DECIMAL PLACES instead of ${sf} significant figures. Decimal places are counted after the point; significant figures are counted from the first non-zero digit, wherever that is.`, "L1-N5.1"),
    ],
  });
};

generators["L1-N5.3"] = (r, tier) => {
  const a = r.int(180, 9800) / (tier === "build" ? 1 : 10);
  const b = r.int(18, 95) / (tier === "exam" ? 10 : 1);
  const roundedA = Number(Number(a).toPrecision(1));
  const roundedB = Number(Number(b).toPrecision(1));
  const estimate = tidy(roundedA * roundedB);

  return item({
    skill: "Estimating by rounding to 1 significant figure first",
    prompt: `ESTIMATE the value of ${a} × ${b} by rounding each number to 1 significant figure.\n\nGive the estimate, not the exact answer.`,
    input: num(),
    answer: estimate,
    hints: [
      "Round each number to one significant figure FIRST, then multiply.",
      `${a} to 1 s.f. is ${roundedA}, and ${b} to 1 s.f. is ${roundedB}.`,
      `Now multiply ${roundedA} × ${roundedB}.`,
    ],
    solution: [
      `${a} ≈ ${roundedA} (1 s.f.)`,
      `${b} ≈ ${roundedB} (1 s.f.)`,
      `Estimate: ${roundedA} × ${roundedB} = ${grouped(estimate)}`,
      `The exact answer is ${grouped(tidy(a * b))}, so the estimate is the right size — which is all an estimate is for. It catches an answer that is ten or a hundred times out.`,
    ],
    traps: [
      trap("gave-exact", tidy(a * b), "That is the exact answer. The question asked for an ESTIMATE — round each number to one significant figure first. The point of estimating is to have a rough figure ready BEFORE you calculate, so you notice if the real answer comes out the wrong size."),
      trap("rounded-after", Number(Number(a * b).toPrecision(1)), "You worked it out exactly and then rounded. Estimating means rounding FIRST, which is what makes it something you can do in your head."),
    ],
  });
};

/* ═══════════════════════════════════════════════════════════════════════
   L1-N6 · DIRECTED NUMBERS
   ═══════════════════════════════════════════════════════════════════════ */

generators["L1-N6.1"] = (r, tier) => {
  const count = byTier(tier, { build: 4, stretch: 5, exam: 6 });
  const values = r.sample(
    [-18, -15, -12, -9, -7, -5, -3, -1, 0, 2, 4, 6, 8, 11, 14, 17],
    count
  );
  const ascending = r.chance();
  const sorted = [...values].sort((x, y) => (ascending ? x - y : y - x));

  return item({
    skill: "Ordering negative numbers by position, not by size",
    prompt: `Arrange these in ${ascending ? "ASCENDING" : "DESCENDING"} order:\n\n${values.join("   ·   ")}`,
    input: list(),
    answer: sorted,
    ordered: true,
    visual: { kind: "numberLine", from: -20, to: 20, marks: values },
    hints: [
      "Picture them on a number line. The further LEFT, the smaller.",
      "Every negative number is smaller than every positive one.",
      "Among negatives, the one with the biggest digits is the SMALLEST: −18 is less than −3.",
    ],
    solution: [
      "On a number line, smaller means further to the left.",
      `${ascending ? "Ascending" : "Descending"}: ${sorted.join(", ")}`,
      "−18 is less than −3 because it is further from zero on the left-hand side. Debt works the same way: owing ₦18,000 is a worse position than owing ₦3,000.",
    ],
    traps: [
      trap(
        "sorted-by-size",
        [...values].sort((x, y) => (ascending ? Math.abs(x) - Math.abs(y) : Math.abs(y) - Math.abs(x))),
        "You ordered by how big the digits are, ignoring the minus signs. On the number line −9 sits to the LEFT of −2, so −9 is the smaller of the two even though 9 is bigger than 2."
      ),
    ],
  });
};

generators["L1-N6.2"] = (r, tier) => {
  const range = byTier(tier, { build: 9, stretch: 20, exam: 45 });
  const a = r.int(-range, range);
  const b = r.intExcept(-range, range, [0]);
  const subtracting = r.chance(0.5);
  const answer = subtracting ? a - b : a + b;
  const shown = subtracting
    ? `${a} − (${b})`
    : `${a} + (${b})`;

  return item({
    skill: "Adding and subtracting directed numbers as movements",
    prompt: `Work out ${shown}.`,
    input: num(),
    answer,
    visual: { kind: "numberLine", from: Math.min(a, answer) - 3, to: Math.max(a, answer) + 3, jump: { from: a, to: answer } },
    hints: [
      `Start at ${a} on the number line.`,
      subtracting
        ? `Subtracting ${b} means moving ${b < 0 ? "RIGHT" : "left"} — taking away a negative moves you up.`
        : `Adding ${b} means moving ${b < 0 ? "left" : "right"}.`,
      `Move ${Math.abs(b)} place${Math.abs(b) === 1 ? "" : "s"} ${(subtracting ? -b : b) > 0 ? "right" : "left"} from ${a}.`,
    ],
    solution: [
      `Start at ${a}.`,
      subtracting
        ? `− (${b}) is a movement of ${-b}, so move ${Math.abs(b)} to the ${-b > 0 ? "right" : "left"}.`
        : `+ (${b}) is a movement of ${b}, so move ${Math.abs(b)} to the ${b > 0 ? "right" : "left"}.`,
      `Land on ${answer}.`,
      subtracting && b < 0 ? "Two minus signs next to each other make a plus: taking away a debt leaves you better off." : "",
    ].filter(Boolean),
    traps: [
      trap(
        "ignored-signs",
        subtracting ? a - Math.abs(b) : a + Math.abs(b),
        `You treated ${b} as if it were ${Math.abs(b)}. The sign in front of a number is part of the number, and ${b < 0 ? "a negative moves you LEFT when added and RIGHT when subtracted" : "it changes which way you travel"}.`
      ),
      trap("wrong-direction", subtracting ? a + b : a - b, subtracting ? "You added when the question said subtract. Subtracting a negative moves you to the right, but subtracting a positive moves you left — check which you have." : "You subtracted when the question said add."),
    ],
  });
};

generators["L1-N6.3"] = (r, tier) => {
  const range = byTier(tier, { build: 9, stretch: 12, exam: 15 });
  const a = r.intExcept(-range, range, [0, 1, -1]);
  const b = r.intExcept(-range, range, [0, 1, -1]);
  const dividing = r.chance(0.4);
  const product = a * b;
  const answer = dividing ? a : product;

  const prompt = dividing
    ? `Work out (${product}) ÷ (${b}).`
    : `Work out (${a}) × (${b}).`;

  return item({
    skill: "The sign of a product or quotient",
    prompt,
    input: num(),
    answer,
    hints: [
      "Work out the sign first, then the digits.",
      "Same signs give a positive answer. Different signs give a negative one.",
      dividing
        ? `${product} and ${b} have ${product * b > 0 ? "the SAME" : "DIFFERENT"} signs, so the answer is ${product * b > 0 ? "positive" : "negative"}.`
        : `${a} and ${b} have ${a * b > 0 ? "the SAME" : "DIFFERENT"} signs, so the answer is ${a * b > 0 ? "positive" : "negative"}.`,
    ],
    solution: [
      dividing
        ? `Signs: ${product} ÷ ${b} — ${product * b > 0 ? "same signs, so positive" : "different signs, so negative"}.`
        : `Signs: ${a} × ${b} — ${a * b > 0 ? "same signs, so positive" : "different signs, so negative"}.`,
      dividing
        ? `Digits: ${Math.abs(product)} ÷ ${Math.abs(b)} = ${Math.abs(answer)}`
        : `Digits: ${Math.abs(a)} × ${Math.abs(b)} = ${Math.abs(answer)}`,
      `Answer: ${answer}`,
      "Why two negatives make a positive: −3 × 4 is 'take away three lots of four', so −3 × −4 is 'take away three lots of a debt of four', which leaves you twelve better off.",
    ],
    traps: [
      trap("wrong-sign", -answer, `The digits are right and the sign is wrong. ${dividing ? product : a} and ${b} have ${(dividing ? product * b : a * b) > 0 ? "the SAME sign, so the answer is positive" : "DIFFERENT signs, so the answer is negative"}.`),
      trap(
        "added-instead",
        dividing ? product + b : a + b,
        "You added rather than multiplying. The sign rules for adding are completely different from the sign rules for multiplying, which is why it matters to notice which operation you are doing before you start.",
        "L1-N6.2"
      ),
    ],
  });
};

generators["L1-N6.4"] = (r, tier) => {
  const kind = r.pick(["temperature", "balance"]);

  if (kind === "temperature") {
    const start = r.int(byTier(tier, { build: -9, stretch: -15, exam: -28 }), 5);
    const drop = r.int(4, byTier(tier, { build: 14, stretch: 22, exam: 40 }));
    const answer = start - drop;
    return item({
      skill: "Directed numbers in a temperature context",
      prompt: `At midnight the temperature on a mountain was ${start}°C. By 4 a.m. it had fallen by ${drop}°C.\n\nWhat was the temperature at 4 a.m.?`,
      input: num({ placeholder: "°C" }),
      answer,
      visual: { kind: "numberLine", from: answer - 4, to: Math.max(start, 0) + 4, jump: { from: start, to: answer }, unit: "°C" },
      hints: ["Fallen means it went DOWN — move left on the scale.", `Start at ${start} and go down ${drop}.`, `${start} − ${drop}`],
      solution: [`${start} − ${drop} = ${answer}`, `So the temperature was ${answer}°C.`],
      traps: [
        trap("added", start + drop, "A fall means the temperature went DOWN. Subtract the drop rather than adding it."),
        trap("ignored-sign", Math.abs(start) - drop, `The starting temperature was ${start}°C, below zero. Starting from a negative and going down takes you further below zero, not back towards it.`),
      ],
    });
  }

  const start = -r.int(2, byTier(tier, { build: 16, stretch: 40, exam: 90 })) * 500;
  const paidIn = r.int(3, byTier(tier, { build: 30, stretch: 90, exam: 200 })) * 500;
  const answer = start + paidIn;
  const who = r.pick(NAMES);

  return item({
    skill: "Directed numbers in a money context",
    prompt: `${who}'s account is overdrawn by ${naira(-start)}, shown on the statement as ${grouped(start)}. ${who} then pays in ${naira(paidIn)}.\n\nWhat is the new balance? Use a negative number if the account is still overdrawn.`,
    input: num({ placeholder: "naira, digits only" }),
    answer,
    accept: [grouped(answer)],
    hints: [
      `Overdrawn means the balance is negative: ${grouped(start)}.`,
      "Paying in moves the balance to the RIGHT along the number line.",
      `${grouped(start)} + ${grouped(paidIn)}`,
    ],
    solution: [
      `Starting balance: ${grouped(start)}`,
      `Pay in: + ${grouped(paidIn)}`,
      `New balance: ${grouped(answer)}${answer < 0 ? " — still overdrawn." : answer === 0 ? " — exactly clear." : " — now in credit."}`,
    ],
    traps: [
      trap("subtracted", start - paidIn, "Paying money IN increases the balance. You subtracted, which is what a withdrawal would do."),
      trap("ignored-overdraft", paidIn, `You forgot the account started ${naira(-start)} overdrawn. The money paid in has to clear that debt first.`),
    ],
  });
};

export default generators;
