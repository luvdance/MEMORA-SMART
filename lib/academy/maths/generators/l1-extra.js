import { item, trap, num, text, byTier } from "./kit.js";
import { grouped, primeFactors } from "../rng.js";

/**
 * GENERATORS · LEVEL 1 · LARGE NUMBERS, BASE TWO, ROOTS BY PRIME FACTORS
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Contains every answer for L1-N1 and L1-N2.5.
 * ═════════════════════════════════════════════════════════════════════════
 *
 * Binary answers are TEXT, never numbers: "1100" typed into a number box would
 * be marked as one thousand one hundred. The checker compares the digits.
 */

export const generators = {};

const WORDS = ["", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"];
const TENS = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];

function upTo999(n) {
  const h = Math.floor(n / 100);
  const rest = n % 100;
  const parts = [];
  if (h) parts.push(`${WORDS[h]} hundred`);
  if (rest) {
    const t = rest < 20 ? WORDS[rest] : `${TENS[Math.floor(rest / 10)]}${rest % 10 ? `-${WORDS[rest % 10]}` : ""}`;
    parts.push(h ? `and ${t}` : t);
  }
  return parts.join(" ");
}

/** BigInt-safe words for numbers up to 999 trillion. */
function inWordsBig(n) {
  const groups = [["trillion", 10n ** 12n], ["billion", 10n ** 9n], ["million", 10n ** 6n], ["thousand", 1000n]];
  let left = BigInt(n);
  const parts = [];
  for (const [name, size] of groups) {
    const g = left / size;
    if (g > 0n) parts.push(`${upTo999(Number(g))} ${name}`);
    left %= size;
  }
  if (left > 0n) parts.push(left < 100n && parts.length ? `and ${upTo999(Number(left))}` : upTo999(Number(left)));
  return parts.join(", ");
}

const groupedBig = (n) => BigInt(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

generators["L1-N1.1"] = (r, tier) => {
  const kind = r.pick(byTier(tier, { build: ["words", "zeros"], stretch: ["words", "decimal-billions"], exam: ["words", "decimal-billions"] }));

  if (kind === "zeros") {
    const pick = r.pick([["million", 6], ["billion", 9], ["trillion", 12]]);
    return item({
      skill: "How many zeros each large number has",
      prompt: `How many zeros are there in one ${pick[0]} written in figures?`,
      input: num(),
      answer: pick[1],
      hints: ["Each group name adds three more zeros.", "One thousand has 3 zeros, one million has 6.", "Thousand 3, million 6, billion 9, trillion 12."],
      solution: [`One ${pick[0]} = 1${",000".repeat(pick[1] / 3)}`, `That is ${pick[1]} zeros.`],
      traps: [trap("off-by-group", pick[1] - 3, "That is one group too few. Thousand has 3 zeros, million 6, billion 9, trillion 12.")],
    });
  }

  if (kind === "decimal-billions") {
    const whole = r.int(1, 9);
    const tenth = r.int(1, 9);
    const unit = r.pick([["million", 6], ["billion", 9], ["trillion", 12]]);
    const value = BigInt(whole * 10 + tenth) * 10n ** BigInt(unit[1] - 1);
    return item({
      skill: "Writing a large number given with a decimal and a word",
      prompt: `A contract is worth ₦${whole}.${tenth} ${unit[0]}. Write this amount in figures.`,
      input: num(),
      answer: Number(value),
      hints: [`1 ${unit[0]} = 1 followed by ${unit[1]} zeros.`, `${whole}.${tenth} ${unit[0]} = ${whole} ${unit[0]} + ${tenth} tenths of a ${unit[0]}.`, `${whole}.${tenth} × ${groupedBig(10n ** BigInt(unit[1]))}`],
      solution: [`${whole} ${unit[0]} = ${groupedBig(BigInt(whole) * 10n ** BigInt(unit[1]))}`, `0.${tenth} ${unit[0]} = ${groupedBig(BigInt(tenth) * 10n ** BigInt(unit[1] - 1))}`, `Total: ${groupedBig(value)}`],
      traps: [trap("joined-digits", Number(`${whole}${tenth}${"0".repeat(unit[1])}`), `That is ${whole}${tenth} ${unit[0]}, ten times too big. ${whole}.${tenth} ${unit[0]} is ${groupedBig(value)}.`)],
    });
  }

  const digits = byTier(tier, { build: r.int(10, 12), stretch: r.int(11, 13), exam: r.int(12, 15) });
  let s = String(r.int(1, 9));
  for (let i = 1; i < digits; i += 1) s += r.chance(0.35) ? "0" : String(r.int(0, 9));
  const n = BigInt(s);
  return item({
    skill: "Writing a number up to trillions from words",
    prompt: `Write this number in figures:\n\n${inWordsBig(n)}`,
    input: num(),
    answer: Number(n),
    hints: ["Work group by group: trillions, billions, millions, thousands, ones.", "After the first group, every group has exactly three digits. Fill empty places with zeros.", "Write the first group, then three digits for each named group after it."],
    solution: [`${inWordsBig(n)}`, `= ${groupedBig(n)}`],
    traps: [],
  });
};

/* ── Base two ────────────────────────────────────────────────────────── */

const bin = (n) => n.toString(2);
const binAccept = (b) => [`${b}₂`, `${b} base 2`, `${b}base2`, `(${b})2`, `${b}_2`];

generators["L1-N1.2"] = (r, tier) => {
  const kind = r.pick(byTier(tier, { build: ["next", "place"], stretch: ["next", "place", "count"], exam: ["next", "count"] }));

  if (kind === "place") {
    const k = r.int(2, byTier(tier, { build: 5, stretch: 7, exam: 7 }));
    return item({
      skill: "The place values in base two",
      prompt: `In base two, the places from the right are worth 1, 2, 4, ... What is the place value of the ${k + 1}${["st", "nd", "rd"][k] || "th"} place from the right?`,
      input: num(),
      answer: 2 ** k,
      hints: ["In base ten each place is worth 10 times the one on its right. In base two it is 2 times.", "1, 2, 4, 8, 16, 32, 64, ...", `Double ${k} times, starting from 1.`],
      solution: [`Places: ${Array.from({ length: k + 1 }, (_, i) => 2 ** i).join(", ")}`, `The ${k + 1}th place is worth ${2 ** k}.`],
      traps: [trap("base-ten-places", 10 ** k, `That is a base TEN place value. In base two each place doubles: the answer is ${2 ** k}.`), trap("added-two", 2 * k + 1, `Each place DOUBLES, it does not go up by 2. The answer is ${2 ** k}.`)],
    });
  }

  if (kind === "count") {
    const start = r.int(4, byTier(tier, { build: 12, stretch: 20, exam: 40 }));
    const answer = [start, start + 1, start + 2, start + 3].map(bin);
    return item({
      skill: "Counting in base two",
      prompt: `Write the next three numbers in this base two count:\n\n${bin(start)}₂, ...\n\nType all four, starting with ${bin(start)}, separated by commas.`,
      input: { kind: "list", placeholder: "separate with commas" },
      ordered: true,
      answer,
      hints: ["Base two only uses the digits 0 and 1.", "Adding 1: a 0 becomes 1. A 1 becomes 0 and you carry 1 to the left.", `${bin(start)} + 1 = ${bin(start + 1)}`],
      solution: answer.map((b, i) => `${b}₂ = ${start + i}`),
      traps: [],
    });
  }

  const n = r.int(3, byTier(tier, { build: 15, stretch: 31, exam: 63 }));
  const next = bin(n + 1);
  const naive = String(Number(bin(n)) + 1);
  return item({
    skill: "Counting on by one in base two",
    prompt: `What number comes straight after ${bin(n)}₂ in base two?`,
    input: text({ placeholder: "e.g. 1010" }),
    answer: next,
    accept: binAccept(next),
    hints: ["Only 0 and 1 are allowed in base two.", "1 + 1 = 10 in base two: write 0 and carry 1.", "Add 1 to the last digit and carry as often as you need to."],
    solution: [`${bin(n)}₂ is ${n} in base ten.`, `${n} + 1 = ${n + 1}, which is ${next}₂.`],
    traps: [trap("base-ten-add", naive, `${naive} contains a digit 2, which does not exist in base two. 1 + 1 = 10: write 0 and carry. The answer is ${next}.`)],
  });
};

generators["L1-N1.3"] = (r, tier) => {
  const n = r.int(byTier(tier, { build: 5, stretch: 20, exam: 40 }), byTier(tier, { build: 31, stretch: 100, exam: 255 }));
  const b = bin(n);

  if (r.chance(0.5)) {
    const steps = [];
    let left = n;
    while (left > 0) {
      steps.push(`${left} ÷ 2 = ${Math.floor(left / 2)} remainder ${left % 2}`);
      left = Math.floor(left / 2);
    }
    const reversed = [...b].reverse().join("");
    return item({
      skill: "Base ten to base two by repeated division",
      prompt: `Convert ${n} (base ten) to base two.`,
      input: text({ placeholder: "e.g. 1011" }),
      answer: b,
      accept: binAccept(b),
      hints: ["Divide by 2 again and again, writing down each remainder.", "Stop when you reach 0.", "Read the remainders from the BOTTOM up."],
      solution: [...steps, `Remainders from the bottom up: ${b}₂`],
      traps: reversed !== b ? [trap("read-top-down", reversed, `Those are the remainders read from the top down. Read them from the bottom up: ${b}.`)] : [],
    });
  }

  const digitSum = [...b].filter((d) => d === "1").length;
  const terms = [...b].map((d, i) => `${d} × ${2 ** (b.length - 1 - i)}`);
  return item({
    skill: "Base two to base ten by place value",
    prompt: `Convert ${b}₂ to base ten.`,
    input: num(),
    answer: n,
    hints: ["Write the place values over the digits: ..., 16, 8, 4, 2, 1, from the right.", "Multiply each digit by its place value.", "Add up the place values that have a 1 under them."],
    solution: [terms.join(" + "), `= ${n}`],
    traps: [
      trap("added-digits", digitSum, `That adds the digits. Each 1 is worth its PLACE VALUE: ${terms.join(" + ")} = ${n}.`),
      trap("read-as-base-ten", Number(b), `${b} read as an ordinary number is not its value. In base two, the places are 1, 2, 4, 8, ...`),
    ],
  });
};

generators["L1-N1.4"] = (r, tier) => {
  const hi = byTier(tier, { build: 15, stretch: 31, exam: 63 });
  const adding = tier === "build" ? true : r.chance(0.5);
  let a = r.int(3, hi);
  let c = r.int(2, hi);
  if (!adding && c > a) [a, c] = [c, a];
  if (!adding && c === a) a += 3;
  const result = adding ? a + c : a - c;
  const answer = bin(result);
  const naive = adding ? String(Number(bin(a)) + Number(bin(c))) : null;

  return item({
    skill: adding ? "Adding in base two, carrying in twos" : "Subtracting in base two, borrowing a two",
    prompt: `Work out ${bin(a)}₂ ${adding ? "+" : "−"} ${bin(c)}₂, giving your answer in base two.`,
    input: text({ placeholder: "e.g. 10110" }),
    answer,
    accept: binAccept(answer),
    hints: adding
      ? ["Line the numbers up on the right and add column by column.", "0 + 1 = 1,  1 + 1 = 10 (write 0, carry 1),  1 + 1 + 1 = 11 (write 1, carry 1).", `Check: ${bin(a)}₂ = ${a} and ${bin(c)}₂ = ${c}, so the answer is ${a + c} in base ten.`]
      : ["Line the numbers up on the right and subtract column by column.", "When you take 1 from 0, borrow from the left: the borrowed 1 is worth 2 in this column, so 10 − 1 = 1.", `Check: ${bin(a)}₂ = ${a} and ${bin(c)}₂ = ${c}, so the answer is ${a - c} in base ten.`],
    solution: [`${bin(a)}₂ = ${a},  ${bin(c)}₂ = ${c}`, `${a} ${adding ? "+" : "−"} ${c} = ${result}`, `${result} = ${answer}₂`, "Working in columns gives the same answer directly, carrying or borrowing in twos."],
    traps: naive && /[2-9]/.test(naive) ? [trap("added-as-base-ten", naive, `${naive} has a digit bigger than 1, which cannot happen in base two. 1 + 1 = 10: write 0 and carry 1. The answer is ${answer}.`)] : [],
  });
};

/* ── L1-N2.5 · Roots by prime factors ───────────────────────────────── */

generators["L1-N2.5"] = (r, tier) => {
  const cube = tier !== "build" && r.chance(0.4);
  const k = cube ? 3 : 2;
  const pool = cube ? [2, 3, 5] : [2, 3, 5, 7];
  let root = 1;
  const chosen = r.sample(pool, cube ? 2 : r.int(2, 3));
  for (const p of chosen) root *= p ** r.int(1, cube ? 1 : 2);
  if (root < 6) root *= 2;
  const n = root ** k;
  const factors = primeFactors(n);
  const counts = {};
  for (const p of factors) counts[p] = (counts[p] || 0) + 1;
  const indexForm = Object.entries(counts).map(([p, c]) => `${p}${c > 1 ? `^${c}` : ""}`).join(" × ");
  const rootForm = Object.entries(counts).map(([p, c]) => `${p}${c / k > 1 ? `^${c / k}` : ""}`).join(" × ");
  const distinct = Object.keys(counts).map(Number).reduce((a, b) => a * b, 1);

  return item({
    skill: cube ? "Cube root from the prime factors" : "Square root from the prime factors",
    prompt: `Use prime factors to find ${cube ? "∛" : "√"}${grouped(n)}.`,
    input: num(),
    answer: root,
    hints: [
      `Write ${grouped(n)} as a product of prime factors.`,
      cube ? "Group the primes in threes. Each group of three gives one prime in the root." : "Pair the primes up. Each pair gives one prime in the root.",
      `${grouped(n)} = ${indexForm}`,
    ],
    solution: [`${grouped(n)} = ${indexForm}`, cube ? "Divide each power by 3." : "Halve each power.", `${cube ? "∛" : "√"}${grouped(n)} = ${rootForm} = ${grouped(root)}`],
    traps: [
      trap("halved", n / 2, `A ${cube ? "cube" : "square"} root is not ${cube ? "a third" : "half"}. Group the prime factors in ${cube ? "threes" : "pairs"} instead.`),
      trap("distinct-primes", distinct, `That multiplies each prime once. Take one prime from each ${cube ? "group of three" : "PAIR"}: ${rootForm} = ${grouped(root)}.`),
    ],
  });
};

/* ═══════════════════════════════════════════════════════════════════════
   L1-N7 · THE NUMBER SYSTEM
   ═══════════════════════════════════════════════════════════════════════ */

/**
 * A pool of numbers with their membership of N, W and Z. Written as the
 * student will type them, with a plain hyphen for minus because the checker
 * normalises − to - anyway.
 */
const SET_POOL = [
  { s: "-12", n: false, w: false, z: true },
  { s: "-7", n: false, w: false, z: true },
  { s: "-3", n: false, w: false, z: true },
  { s: "-1", n: false, w: false, z: true },
  { s: "0", n: false, w: true, z: true },
  { s: "1", n: true, w: true, z: true },
  { s: "4", n: true, w: true, z: true },
  { s: "9", n: true, w: true, z: true },
  { s: "15", n: true, w: true, z: true },
  { s: "2.5", n: false, w: false, z: false },
  { s: "-0.5", n: false, w: false, z: false },
  { s: "3/4", n: false, w: false, z: false },
  { s: "-2/3", n: false, w: false, z: false },
];

generators["L1-N7.1"] = (r, tier) => {
  const want = r.pick(byTier(tier, { build: ["n", "z"], stretch: ["n", "w", "z"], exam: ["w", "z", "z-not-n"] }));
  let chosen;
  let answer;
  do {
    chosen = r.sample(SET_POOL, 6);
    const test = { n: (x) => x.n, w: (x) => x.w, z: (x) => x.z, "z-not-n": (x) => x.z && !x.n }[want];
    answer = chosen.filter(test).map((x) => x.s);
  } while (answer.length === 0 || answer.length === chosen.length);
  const label = {
    n: "NATURAL numbers (N)",
    w: "WHOLE numbers",
    z: "INTEGERS (Z)",
    "z-not-n": "numbers that are INTEGERS but NOT natural numbers",
  }[want];
  const display = chosen.map((x) => x.s.replace("-", "−")).join(",   ");
  const naturals = chosen.filter((x) => x.n).map((x) => x.s);
  const integers = chosen.filter((x) => x.z).map((x) => x.s);

  return item({
    skill: "Sorting numbers into natural numbers, whole numbers and integers",
    prompt: `From this list, write down all the ${label}:\n\n${display}\n\nSeparate them with commas.`,
    input: { kind: "list", placeholder: "separate with commas" },
    answer,
    hints: [
      "Natural numbers are the counting numbers 1, 2, 3, ... Whole numbers add 0. Integers add the negative whole numbers.",
      "Fractions and decimals that are not whole are in none of these three sets.",
      "Go through the list one number at a time and test it.",
    ],
    solution: [
      `N = {1, 2, 3, ...}, whole numbers = {0, 1, 2, ...}, Z = {..., −2, −1, 0, 1, 2, ...}`,
      `The ${label.toLowerCase()} here: ${answer.join(", ").replace(/-/g, "−")}`,
    ],
    traps: [
      want === "n" && chosen.some((x) => x.s === "0") ? trap("zero-natural", [...naturals, "0"], "0 is not a natural number. The natural numbers start at 1. Whole numbers include 0.") : null,
      want === "z" ? trap("integers-positive-only", naturals.length ? chosen.filter((x) => x.w).map((x) => x.s) : null, "Integers include the NEGATIVE whole numbers as well.") : null,
      want === "n" ? trap("natural-as-integer", integers, "Natural numbers are only the counting numbers 1, 2, 3, ... Negatives and 0 are integers but not natural numbers.") : null,
    ].filter(Boolean),
  });
};

const RATIONALITY = {
  build: [
    ["√16", "rational", "√16 = 4, a whole number, and every whole number is a fraction (4/1)."],
    ["√49", "rational", "√49 = 7 = 7/1."],
    ["√7", "irrational", "7 is not a perfect square, so √7 is a decimal that never ends and never repeats."],
    ["√10", "irrational", "10 is not a perfect square, so √10 never ends and never repeats."],
    ["3/8", "rational", "It is already a fraction of two integers."],
    ["0.75", "rational", "0.75 = 3/4."],
    ["−5", "rational", "−5 = −5/1."],
  ],
  stretch: [
    ["0.333...", "rational", "A recurring decimal is rational: 0.333... = 1/3."],
    ["π", "irrational", "π never ends and never repeats. 22/7 is only an approximation."],
    ["22/7", "rational", "22/7 is a fraction of two integers. It is close to π but it is not π."],
    ["√2", "irrational", "2 is not a perfect square."],
    ["√25", "rational", "√25 = 5."],
    ["0.121212...", "rational", "A repeating decimal is rational: 0.1212... = 12/99 = 4/33."],
  ],
  exam: [
    ["√8 × √2", "rational", "√8 × √2 = √16 = 4."],
    ["√(9/4)", "rational", "√(9/4) = 3/2."],
    ["√12", "irrational", "12 is not a perfect square: √12 = 2√3."],
    ["2 + √3", "irrational", "A rational number plus an irrational number is irrational."],
    ["0.1010010001...", "irrational", "The pattern grows (one more 0 each time), so it never repeats."],
    ["√0.25", "rational", "√0.25 = 0.5 = 1/2."],
  ],
};

generators["L1-N7.2"] = (r, tier) => {
  const [shown, answer, why] = r.pick(RATIONALITY[tier] || RATIONALITY.build);
  const other = answer === "rational" ? "irrational" : "rational";
  return item({
    skill: "Deciding whether a number is rational or irrational",
    prompt: `Is ${shown} rational or irrational?`,
    input: { kind: "choice", options: ["rational", "irrational"] },
    answer,
    hints: [
      "A RATIONAL number can be written as a fraction a/b of two integers (b ≠ 0). Its decimal either ends or repeats.",
      "An IRRATIONAL number cannot: its decimal goes on forever without repeating. √ of a non-square, and π, are the usual examples.",
      shown.includes("√") ? "Work out or simplify the root first. Is the result a whole number or a fraction?" : "Can you write it as one integer over another?",
    ],
    solution: [why, `So ${shown} is ${answer}.`],
    traps: [trap(`said-${other}`, other, `${why} So it is ${answer}, not ${other}.`)],
  });
};

generators["L1-N7.3"] = (r, tier) => {
  if (tier === "build" || r.chance(0.5)) {
    const n = r.int(byTier(tier, { build: 5, stretch: 10, exam: 20 }), byTier(tier, { build: 60, stretch: 120, exam: 200 }));
    if (Number.isInteger(Math.sqrt(n))) return generators["L1-N7.3"](r, tier);
    const negative = tier !== "build" && r.chance(0.5);
    const lo = Math.floor(Math.sqrt(n));
    const answer = negative ? [-(lo + 1), -lo] : [lo, lo + 1];
    return item({
      skill: "Placing a root on the number line between two integers",
      prompt: `${negative ? "−" : ""}√${n} lies between which two consecutive integers?\n\nType the smaller one first.`,
      input: { kind: "list", placeholder: "e.g. -5, -4" },
      ordered: true,
      answer,
      hints: [`${lo}² = ${lo * lo} and ${lo + 1}² = ${(lo + 1) ** 2}.`, `So √${n} is between ${lo} and ${lo + 1}.`, negative ? "With a minus sign the order flips: the smaller integer is the more negative one." : "Smaller first."],
      solution: [`${lo * lo} < ${n} < ${(lo + 1) ** 2}, so ${lo} < √${n} < ${lo + 1}.`, negative ? `Therefore ${-(lo + 1)} < −√${n} < ${-lo}.` : `Answer: ${lo}, ${lo + 1}`],
      traps: negative ? [trap("did-not-flip", [-lo, -(lo + 1)], `On the negative side the more negative number is smaller. −√${n} is between ${-(lo + 1)} and ${-lo}, with ${-(lo + 1)} first.`)] : [],
    });
  }

  const pairs = [
    ["π", Math.PI, "3.1", 3.1],
    ["π", Math.PI, "22/7", 22 / 7],
    ["√2", Math.SQRT2, "1.4", 1.4],
    ["√50", Math.sqrt(50), "7.1", 7.1],
    ["√10", Math.sqrt(10), "3 1/6", 3 + 1 / 6],
    ["2/3", 2 / 3, "0.67", 0.67],
    ["−√5", -Math.sqrt(5), "−2.2", -2.2],
    ["−3/4", -0.75, "−0.7", -0.7],
  ];
  const [aLabel, aVal, bLabel, bVal] = r.pick(pairs);
  const flip = r.chance(0.5);
  const options = flip ? [bLabel, aLabel] : [aLabel, bLabel];
  const answer = aVal > bVal ? aLabel : bLabel;
  return item({
    skill: "Comparing real numbers on the number line",
    prompt: `Which is larger: ${options[0]} or ${options[1]}?`,
    input: { kind: "choice", options },
    answer,
    hints: ["Turn both into decimals to two or three places.", `${aLabel} ≈ ${aVal.toFixed(3)}`, `${bLabel} = ${bVal.toFixed(3)}`],
    solution: [`${aLabel} ≈ ${aVal.toFixed(3)} and ${bLabel} = ${bVal.toFixed(3)}.`, `The larger is ${answer}${aVal < 0 ? " (nearer zero on the negative side)" : ""}.`],
    traps: [trap("picked-smaller", answer === aLabel ? bLabel : aLabel, `Compare the decimals: ${aLabel} ≈ ${aVal.toFixed(3)} and ${bLabel} = ${bVal.toFixed(3)}.${aVal < 0 ? " With negatives, the one nearer zero is larger." : ""}`)],
  });
};

export default generators;
