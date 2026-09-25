import { item, trap, num, list, text, choice, byTier } from "./kit.js";
import {
  grouped,
  naira,
  NAMES,
  MARKETS,
  GOODS,
  factorsOf,
  isPrime,
  PRIMES_TO_100,
  gcd,
} from "../rng.js";

/**
 * GENERATORS · LEVEL 0 · THE NUMBER MODULES
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Contains every answer for L0-N1 to L0-N5.
 * ═════════════════════════════════════════════════════════════════════════
 *
 * These are the atoms secondary students are assumed to have and mostly do
 * not. The traps here are drawn from the errors that actually appear: place
 * confused with value, rounding to the wrong column, adding the denominators,
 * and lining decimals up by their last digit.
 */

/* ── Words for numbers, so a prompt can ask for figures ──────────────── */

const ONES = ["", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];
const TEENS = ["ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"];
const TENS = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];

function underThousand(n) {
  const parts = [];
  const hundreds = Math.floor(n / 100);
  const rest = n % 100;
  if (hundreds) parts.push(`${ONES[hundreds]} hundred`);
  if (rest) {
    if (hundreds) parts.push("and");
    if (rest < 10) parts.push(ONES[rest]);
    else if (rest < 20) parts.push(TEENS[rest - 10]);
    else {
      const t = TENS[Math.floor(rest / 10)];
      const o = rest % 10;
      parts.push(o ? `${t}-${ONES[o]}` : t);
    }
  }
  return parts.join(" ");
}

/** A whole number written the way it is read aloud in an exam question. */
export function inWords(n) {
  if (n === 0) return "zero";
  const scales = [
    [1e9, "billion"],
    [1e6, "million"],
    [1e3, "thousand"],
  ];
  const parts = [];
  let rest = n;

  for (const [size, name] of scales) {
    const count = Math.floor(rest / size);
    if (count) {
      parts.push(`${underThousand(count)} ${name}`);
      rest %= size;
    }
  }
  if (rest) {
    if (parts.length && rest < 100) parts.push("and");
    parts.push(underThousand(rest));
  }
  return parts.join(", ").replace(/, and,? /g, " and ");
}

const PLACE_NAMES = [
  "units", "tens", "hundreds", "thousands", "ten thousands",
  "hundred thousands", "millions", "ten millions", "hundred millions",
];

/* ═══════════════════════════════════════════════════════════════════════
   L0-N1 · PLACE VALUE
   ═══════════════════════════════════════════════════════════════════════ */

export const generators = {};

generators["L0-N1.1"] = (r, tier) => {
  const size = byTier(tier, { build: 1e5, stretch: 1e7, exam: 1e9 });
  const n = r.int(Math.floor(size / 10), size - 1);

  return item({
    skill: "Writing a number from the way it is said",
    prompt: `Write this number in figures:\n\n${inWords(n)}`,
    input: num({ placeholder: "digits only" }),
    answer: n,
    accept: [grouped(n)],
    hints: [
      "Build it in blocks of three from the right: units, thousands, millions.",
      `Start with the largest block. "${inWords(n).split(",")[0]}" tells you the leading digits.`,
      "Write each block as three digits, padding with zeros where a part is not mentioned — 'four thousand and six' is 4006, not 406.",
    ],
    solution: [
      `In words: ${inWords(n)}`,
      "Take it block by block, three digits at a time from the right.",
      `In figures: ${grouped(n)}`,
      "Every block except the first must be exactly three digits, which is where the zeros come from.",
    ],
    traps: [
      trap(
        "dropped-zero",
        Number(String(n).replace(/0/g, "")) || 0,
        "You have left out the zeros. A part that is not mentioned in words — no hundreds, no tens — still needs a zero to hold its column open, or every digit to its left slides into the wrong place.",
        "L0-N1.2"
      ),
    ],
  });
};

generators["L0-N1.2"] = (r, tier) => {
  const digits = byTier(tier, { build: 5, stretch: 7, exam: 9 });
  const n = r.int(Math.pow(10, digits - 1), Math.pow(10, digits) - 1);
  const s = String(n);
  const askForPlace = tier === "build" && r.chance(0.4);

  // Never ask for the VALUE of a units digit. Its value IS the digit, so the
  // question cannot distinguish a student who understands place value from
  // one who does not — and the place-versus-value trap would be dead.
  const position = r.int(0, s.length - (askForPlace ? 1 : 2));
  const digit = Number(s[position]);
  const placeIndex = s.length - 1 - position;
  const value = digit * Math.pow(10, placeIndex);

  if (askForPlace) {
    return item({
      skill: "Naming the place a digit sits in",
      prompt: `In the number ${grouped(n)}, which place is the digit ${digit} in?\n\n(It is the ${position + 1}${["st", "nd", "rd"][position] || "th"} digit from the left.)`,
      input: choice(PLACE_NAMES.slice(0, s.length)),
      answer: PLACE_NAMES[placeIndex],
      hints: [
        "Count the places from the RIGHT, not the left: units, tens, hundreds, thousands.",
        `The number has ${s.length} digits, so the leftmost place is ${PLACE_NAMES[s.length - 1]}.`,
        `Counting from the right, this digit has ${placeIndex} digit${placeIndex === 1 ? "" : "s"} after it.`,
      ],
      solution: [
        `${grouped(n)} has ${s.length} digits.`,
        "Places are counted from the right: units, tens, hundreds, thousands, ten thousands, and so on.",
        `This digit has ${placeIndex} digit${placeIndex === 1 ? "" : "s"} to its right, so it is in the ${PLACE_NAMES[placeIndex]} place.`,
      ],
      traps: [],
    });
  }

  return item({
    skill: "The value of a digit, as opposed to the digit itself",
    prompt: `In the number ${grouped(n)}, what is the VALUE of the digit ${digit} in the ${PLACE_NAMES[placeIndex]} place?`,
    input: num(),
    answer: value,
    accept: [grouped(value)],
    hints: [
      "The digit and its value are two different things. The question asks what it is WORTH.",
      `The digit sits in the ${PLACE_NAMES[placeIndex]} place.`,
      `So multiply: ${digit} × ${grouped(Math.pow(10, placeIndex))}.`,
    ],
    solution: [
      `The digit is ${digit}, and it sits in the ${PLACE_NAMES[placeIndex]} place.`,
      `Value = digit × place = ${digit} × ${grouped(Math.pow(10, placeIndex))}`,
      `Value = ${grouped(value)}`,
    ],
    traps: [
      trap(
        "place-vs-value",
        digit,
        `You gave the DIGIT, which is ${digit}. The question asked for its VALUE. A digit is a symbol; its value is what that symbol is worth where it stands. Here it stands in the ${PLACE_NAMES[placeIndex]} place, so it is worth ${digit} × ${grouped(Math.pow(10, placeIndex))} = ${grouped(value)}.`
      ),
      trap(
        "place-off-by-one",
        digit * Math.pow(10, Math.max(0, placeIndex - 1)),
        "You are one column out. Count the places from the RIGHT and remember the first one is units, not tens."
      ),
    ],
  });
};

generators["L0-N1.3"] = (r, tier) => {
  const count = byTier(tier, { build: 3, stretch: 4, exam: 5 });
  const digits = byTier(tier, { build: 4, stretch: 5, exam: 6 });
  const lo = Math.pow(10, digits - 1);
  const hi = Math.pow(10, digits) - 1;

  // Numbers deliberately close together, so the comparison is decided by a
  // middle digit rather than by length — which is where students go wrong.
  const base = r.int(lo, hi - 2000);
  const numbers = r.shuffle(
    Array.from({ length: count }, (_, i) => base + i * r.int(7, 400) + r.int(0, 60))
  );
  const ascending = r.chance();
  const sorted = [...numbers].sort((x, y) => (ascending ? x - y : y - x));

  return item({
    skill: "Ordering numbers by comparing place by place",
    prompt: `Arrange these numbers in ${ascending ? "ASCENDING" : "DESCENDING"} order:\n\n${numbers
      .map(grouped)
      .join("   ·   ")}`,
    input: list({ placeholder: "e.g. 1200, 1350, 1400" }),
    answer: sorted,
    ordered: true,
    hints: [
      ascending ? "Ascending means smallest first." : "Descending means largest first.",
      "They all have the same number of digits here, so length will not decide it.",
      "Compare the leftmost digits. If they are equal, move one place right and compare again.",
    ],
    solution: [
      "All of these have the same number of digits, so compare place by place from the LEFT.",
      "The first place where two numbers differ decides which is bigger. Nothing to the right of it matters.",
      `In ${ascending ? "ascending" : "descending"} order: ${sorted.map(grouped).join(", ")}`,
    ],
    traps: [
      trap(
        "reversed-order",
        [...sorted].reverse(),
        `That is the right ordering the wrong way round. ${ascending ? "Ascending" : "Descending"} means ${ascending ? "smallest" : "largest"} first.`
      ),
    ],
  });
};

generators["L0-N1.4"] = (r, tier) => {
  const to = byTier(tier, { build: 10, stretch: 100, exam: 1000 });
  const digits = byTier(tier, { build: 3, stretch: 4, exam: 5 });
  const n = r.int(Math.pow(10, digits - 1), Math.pow(10, digits) - 1);

  const rounded = Math.round(n / to) * to;
  const decider = Math.floor((n % to) / (to / 10));
  const down = Math.floor(n / to) * to;
  const up = down + to;

  return item({
    skill: "Rounding to a named place, using the digit one place to its right",
    prompt: `Round ${grouped(n)} to the nearest ${grouped(to)}.`,
    input: num(),
    answer: rounded,
    accept: [grouped(rounded)],
    hints: [
      `Find the ${to === 10 ? "tens" : to === 100 ? "hundreds" : "thousands"} digit first, then look at the ONE digit immediately to its right.`,
      `That deciding digit is ${decider}.`,
      `${decider >= 5 ? "It is 5 or more, so round UP" : "It is less than 5, so round DOWN"} — everything to the right becomes zero.`,
    ],
    solution: [
      `${grouped(n)} sits between ${grouped(down)} and ${grouped(up)}.`,
      `Look at the digit immediately to the right of the ${to === 10 ? "tens" : to === 100 ? "hundreds" : "thousands"} place. It is ${decider}.`,
      `${decider >= 5 ? "5 or more rounds up" : "Less than 5 rounds down"}, so the answer is ${grouped(rounded)}.`,
    ],
    traps: [
      trap(
        "rounded-wrong-place",
        Math.round(n / (to / 10)) * (to / 10),
        `You rounded to the nearest ${grouped(to / 10)}, not the nearest ${grouped(to)}. Read which place the question names, then look at the single digit to the RIGHT of that place — nothing further right than that gets a say.`
      ),
      trap(
        "always-up",
        decider >= 5 ? down : up,
        "You rounded the wrong way. Only the one digit immediately to the right decides it: 5 or more goes up, 4 or less goes down. A long tail of large digits after that does not change it."
      ),
    ],
    scaffold: [
      {
        prompt: `Step 1. In ${grouped(n)}, what digit is in the ${to === 10 ? "tens" : to === 100 ? "hundreds" : "thousands"} place?`,
        input: num(),
        answer: Math.floor(n / to) % 10,
        hint: "Count the places from the right: units, tens, hundreds, thousands.",
      },
      {
        prompt: "Step 2. What is the digit immediately to the RIGHT of it? This is the only digit that decides.",
        input: num(),
        answer: decider,
        hint: "One place to the right. Just the one digit.",
      },
      {
        prompt: `Step 3. That digit is ${decider}. So do we round up or down? Type "up" or "down".`,
        input: text(),
        answer: decider >= 5 ? "up" : "down",
        hint: "5 or more rounds up. 4 or less rounds down.",
      },
      {
        prompt: `Step 4. Now write the answer: ${grouped(n)} to the nearest ${grouped(to)}.`,
        input: num(),
        answer: rounded,
        hint: `Everything below the ${to === 10 ? "tens" : to === 100 ? "hundreds" : "thousands"} place becomes zero.`,
      },
    ],
  });
};

/* ═══════════════════════════════════════════════════════════════════════
   L0-N2 · OPERATION FLUENCY
   ═══════════════════════════════════════════════════════════════════════ */

generators["L0-N2.1"] = (r, tier) => {
  const hi = byTier(tier, { build: 9, stretch: 12, exam: 12 });
  const x = r.int(tier === "build" ? 2 : 6, hi);
  const y = r.int(tier === "build" ? 2 : 6, hi);
  const product = x * y;

  return item({
    skill: "Instant recall of a table fact",
    prompt: `${x} × ${y} = ?`,
    input: num({ placeholder: "answer" }),
    answer: product,
    hints: [
      "This one is meant to be recalled, not worked out. If you had to count, that is the fact to drill.",
      `${x} × ${y} is the same as ${y} × ${x}, if that one is easier to remember.`,
      `Try ${x} × ${y - 1} = ${x * (y - 1)}, then add ${x}.`,
    ],
    solution: [`${x} × ${y} = ${product}.`, `And ${y} × ${x} = ${product} too — multiplication does not care about the order.`],
    traps: [
      trap("off-by-one-row", x * (y - 1), `That is ${x} × ${y - 1}. You are one row short — count the groups again.`),
      trap("added-not-multiplied", x + y, `You added instead of multiplying. ${x} × ${y} means ${y} lots of ${x}, not ${x} and ${y} together.`),
    ],
  });
};

generators["L0-N2.2"] = (r, tier) => {
  const a = byTier(tier, { build: r.int(23, 99), stretch: r.int(112, 899), exam: r.int(215, 989) });
  const b = byTier(tier, { build: r.int(12, 29), stretch: r.int(23, 79), exam: r.int(34, 98) });
  const product = a * b;
  const tens = Math.floor(b / 10) * 10;
  const units = b % 10;

  return item({
    skill: "Long multiplication, keeping the columns honest",
    prompt: `Work out ${grouped(a)} × ${b}.`,
    input: num(),
    answer: product,
    accept: [grouped(product)],
    hints: [
      `Split ${b} into ${tens} + ${units} and multiply by each part, then add.`,
      `${a} × ${units} = ${grouped(a * units)}`,
      `${a} × ${tens} = ${grouped(a * tens)}. Now add the two.`,
    ],
    solution: [
      `Split the second number: ${b} = ${tens} + ${units}.`,
      `${grouped(a)} × ${units} = ${grouped(a * units)}`,
      `${grouped(a)} × ${tens} = ${grouped(a * tens)}   (note the zero — this row is tens, not units)`,
      `Add: ${grouped(a * units)} + ${grouped(a * tens)} = ${grouped(product)}`,
    ],
    traps: [
      trap(
        "missing-placeholder-zero",
        a * units + a * Math.floor(b / 10),
        "You forgot the placeholder zero on the second row. When you multiply by the TENS digit you are multiplying by whole tens, so that row must end in a zero — otherwise the whole row is ten times too small."
      ),
      trap("dropped-carry", product - 10 * r.int(1, 9), "Check your carrying. One of the carried digits has gone missing when you added the columns."),
    ],
    scaffold: [
      { prompt: `Step 1. What is ${grouped(a)} × ${units}?`, input: num(), answer: a * units, hint: "Just the units digit of the second number." },
      { prompt: `Step 2. What is ${grouped(a)} × ${tens}? (Remember: multiplying by ${tens}, so the answer ends in a zero.)`, input: num(), answer: a * tens, hint: `Work out ${a} × ${Math.floor(b / 10)} and then put a zero on the end.` },
      { prompt: `Step 3. Add your two answers together.`, input: num(), answer: product, hint: `${grouped(a * units)} + ${grouped(a * tens)}` },
    ],
  });
};

generators["L0-N2.3"] = (r, tier) => {
  const divisor = byTier(tier, { build: r.int(3, 9), stretch: r.int(6, 12), exam: r.int(12, 24) });
  const quotient = byTier(tier, { build: r.int(12, 80), stretch: r.int(40, 250), exam: r.int(60, 400) });
  const remainder = r.int(1, divisor - 1);
  const total = divisor * quotient + remainder;

  const who = r.pick(NAMES);
  const good = r.pick(GOODS);
  const contextual = tier !== "build";

  const prompt = contextual
    ? `${who} has ${grouped(total)} ${good.name} to pack into boxes of ${divisor}.\n\nHow many FULL boxes can be packed?`
    : `Work out ${grouped(total)} ÷ ${divisor}, and give the quotient only (ignore the remainder).`;

  return item({
    skill: contextual ? "Interpreting a remainder in context" : "Long division with a remainder",
    prompt,
    input: num({ placeholder: contextual ? "number of full boxes" : "quotient" }),
    answer: quotient,
    hints: [
      contextual
        ? "A box that is not full is not a full box. The remainder is what is left over, not another box."
        : "Divide from the left, carrying what is left over into the next digit.",
      `How many ${divisor}s fit into ${grouped(total)}?`,
      `${divisor} × ${quotient} = ${grouped(divisor * quotient)}, which leaves ${remainder} over.`,
    ],
    solution: [
      `${grouped(total)} ÷ ${divisor} = ${grouped(quotient)} remainder ${remainder}.`,
      `Check: ${divisor} × ${grouped(quotient)} = ${grouped(divisor * quotient)}, and ${grouped(divisor * quotient)} + ${remainder} = ${grouped(total)}.`,
      contextual
        ? `So ${grouped(quotient)} boxes can be filled completely, with ${remainder} left over.`
        : `The quotient is ${grouped(quotient)}.`,
    ],
    traps: [
      trap(
        "rounded-up-remainder",
        quotient + 1,
        contextual
          ? `You counted the leftover ${remainder} as another box. It is not full, so it does not count. Read carefully whether the question wants full boxes, or every box including a part-filled one.`
          : "That is one too many. Check by multiplying back: it should come to no more than the number you started with."
      ),
      trap("gave-remainder", remainder, "That is the REMAINDER, not the quotient. The quotient is how many times the divisor went in; the remainder is what was left over afterwards."),
    ],
  });
};

generators["L0-N2.4"] = (r, tier) => {
  const a = r.int(2, 9);
  const b = r.int(2, 9);
  const c = r.int(2, 9);
  const d = r.int(2, 6);

  if (tier === "build") {
    const answer = a + b * c;
    return item({
      skill: "Multiplication before addition",
      prompt: `Work out:   ${a} + ${b} × ${c}`,
      input: num(),
      answer,
      hints: [
        "Not left to right. There is an order.",
        "BODMAS: Brackets, Of/Orders, Division and Multiplication, then Addition and Subtraction.",
        `So do ${b} × ${c} first.`,
      ],
      solution: [`${b} × ${c} = ${b * c}`, `${a} + ${b * c} = ${answer}`],
      traps: [
        trap(
          "left-to-right",
          (a + b) * c,
          `You worked left to right: (${a} + ${b}) × ${c}. Multiplication is done before addition, whichever comes first on the page. The only thing that overrides that is a bracket, and there is no bracket here.`
        ),
      ],
    });
  }

  const answer = (a + b) * c - Math.pow(d, 2) / d;
  const stretchAnswer = (a + b) * c - d;

  return item({
    skill: "The full BODMAS order, including a power and a division",
    prompt: `Work out:   (${a} + ${b}) × ${c} − ${d}² ÷ ${d}`,
    input: num(),
    answer: stretchAnswer,
    hints: [
      "Brackets first, then the power, then division and multiplication, then the subtraction last.",
      `(${a} + ${b}) = ${a + b}, and ${d}² = ${d * d}.`,
      `Now ${a + b} × ${c} = ${(a + b) * c}, and ${d * d} ÷ ${d} = ${d}. Subtract.`,
    ],
    solution: [
      `Brackets:  (${a} + ${b}) = ${a + b}`,
      `Order (the power):  ${d}² = ${d * d}`,
      `Multiplication and division, left to right:  ${a + b} × ${c} = ${(a + b) * c},  ${d * d} ÷ ${d} = ${d}`,
      `Subtraction last:  ${(a + b) * c} − ${d} = ${stretchAnswer}`,
      `(Note ${answer === stretchAnswer ? "the same answer either way here" : ""})`.trim(),
    ],
    traps: [
      trap("power-last", (a + b) * c - Math.pow(d / d, 2), "You handled the power in the wrong order. A power is worked out before any multiplication or division around it."),
      trap(
        "subtract-early",
        (a + b) * (c - d * d / d),
        "You subtracted before multiplying. Subtraction is last in BODMAS unless it is inside a bracket."
      ),
    ],
  });
};

/* ═══════════════════════════════════════════════════════════════════════
   L0-N3 · FACTORS AND MULTIPLES
   ═══════════════════════════════════════════════════════════════════════ */

generators["L0-N3.1"] = (r, tier) => {
  const pool = byTier(tier, {
    build: [12, 18, 20, 24, 28, 30],
    stretch: [36, 40, 42, 45, 48, 54, 56],
    exam: [60, 64, 72, 84, 90, 96, 100],
  });
  const n = r.pick(pool);
  const all = factorsOf(n);

  return item({
    skill: "Listing every factor by pairing them off",
    prompt: `List ALL the factors of ${n}.`,
    input: list({ placeholder: "e.g. 1, 2, 3, 6" }),
    answer: all,
    hints: [
      "Work in PAIRS. Start at 1 × the number itself, then try 2, then 3, and so on.",
      "You can stop as soon as the two numbers in a pair meet or cross over.",
      `Try each number in turn: does it divide ${n} exactly? 1 and ${n} are always factors.`,
    ],
    solution: [
      `Pair them off: ${all
        .slice(0, Math.ceil(all.length / 2))
        .map((f) => `${f} × ${n / f}`)
        .join(",  ")}`,
      `Once the pair crosses over (${Math.floor(Math.sqrt(n))} × ${Math.ceil(n / Math.floor(Math.sqrt(n)))}), you have them all.`,
      `Factors of ${n}: ${all.join(", ")}`,
    ],
    traps: [
      trap("forgot-one-and-self", all.slice(1, -1), "You missed 1 and the number itself. Every number has both as factors — that is what makes a prime number prime, that it has ONLY those two."),
      trap("listed-multiples", [n, n * 2, n * 3, n * 4], `Those are MULTIPLES of ${n}, not factors. Factors divide INTO it and are never bigger than it; multiples are what you get by multiplying it and are never smaller.`, "L0-N3.2"),
    ],
  });
};

generators["L0-N3.2"] = (r, tier) => {
  const n = byTier(tier, { build: r.int(3, 9), stretch: r.int(6, 15), exam: r.int(11, 25) });
  const count = byTier(tier, { build: 5, stretch: 6, exam: 8 });
  const multiples = Array.from({ length: count }, (_, i) => n * (i + 1));

  return item({
    skill: "Telling a multiple from a factor",
    prompt: `Write the first ${count} multiples of ${n}.`,
    input: list(),
    answer: multiples,
    ordered: true,
    hints: [
      "A multiple is what you get when you multiply the number by 1, 2, 3, and so on.",
      `Start at ${n} itself — the first multiple of any number is the number.`,
      `${n}, then keep adding ${n}.`,
    ],
    solution: [
      `${n} × 1 = ${n},  ${n} × 2 = ${n * 2},  ${n} × 3 = ${n * 3}, and so on.`,
      `First ${count} multiples: ${multiples.join(", ")}`,
      "Multiples go up forever. Factors stop, because nothing bigger than a number can divide into it.",
    ],
    traps: [
      trap("started-at-double", multiples.map((m) => m + n).slice(0, count), `You started at ${n * 2}. The FIRST multiple of ${n} is ${n} itself: ${n} × 1.`),
      trap("gave-factors", factorsOf(n), `Those are factors of ${n}, not multiples. Factors divide into it; multiples are built out of it.`, "L0-N3.1"),
    ],
  });
};

generators["L0-N3.3"] = (r, tier) => {
  const count = byTier(tier, { build: 4, stretch: 5, exam: 6 });
  const composites = [
    9, 15, 21, 25, 27, 33, 35, 39, 49, 51, 55, 57, 63, 65, 69, 77, 85, 87, 91, 93, 95,
  ];
  const chosenPrimes = r.sample(PRIMES_TO_100.filter((p) => p > 10), Math.ceil(count / 2));
  const chosenComposites = r.sample(composites, count - chosenPrimes.length);
  const mixed = r.shuffle([...chosenPrimes, ...chosenComposites]);
  const primes = mixed.filter(isPrime);

  return item({
    skill: "Testing a number for primeness by trial division",
    prompt: `Which of these numbers are PRIME?\n\n${mixed.join("   ·   ")}`,
    input: list({ placeholder: "list only the primes" }),
    answer: primes,
    hints: [
      "A prime has exactly two factors: 1 and itself.",
      "Test each one against 2, 3, 5 and 7. If none of them divides it, and the number is under 100, it is prime.",
      "Watch for the ones ending in 1 and 3 — 91 looks prime and is 7 × 13.",
    ],
    solution: [
      ...mixed.map((n) => {
        if (isPrime(n)) return `${n} — prime: nothing from 2, 3, 5 or 7 divides it.`;
        const f = factorsOf(n)[1];
        return `${n} = ${f} × ${n / f}, so not prime.`;
      }),
      `Primes: ${primes.join(", ")}`,
    ],
    traps: [
      trap("included-one", [1, ...primes], "1 is not prime. A prime has exactly TWO different factors, and 1 has only one factor — itself. This is a definition, not a technicality: if 1 were prime, prime factorisation would stop being unique."),
      trap("odd-means-prime", mixed.filter((n) => n % 2 === 1), "You listed every ODD number. Odd is not the same as prime — 9, 15, 21 and 91 are all odd and all composite. The only even prime is 2."),
    ],
  });
};

generators["L0-N3.4"] = (r, tier) => {
  const by = r.pick(byTier(tier, { build: [2, 5, 10], stretch: [3, 4, 9], exam: [3, 6, 9] }));
  const digits = byTier(tier, { build: 3, stretch: 4, exam: 5 });
  const n = r.int(Math.pow(10, digits - 1), Math.pow(10, digits) - 1);
  const divisible = n % by === 0;
  const digitSum = String(n).split("").reduce((s, d) => s + Number(d), 0);

  const RULE = {
    2: "the last digit is even",
    3: "the digits add to a multiple of 3",
    4: "the last TWO digits form a multiple of 4",
    5: "the last digit is 0 or 5",
    6: "it passes BOTH the 2 test and the 3 test",
    9: "the digits add to a multiple of 9",
    10: "the last digit is 0",
  };

  return item({
    skill: "Using a divisibility rule instead of dividing",
    prompt: `Is ${grouped(n)} divisible by ${by}?\n\nAnswer "yes" or "no" — use the rule, not a calculator.`,
    input: choice(["yes", "no"]),
    answer: divisible ? "yes" : "no",
    hints: [
      `The test for ${by}: ${RULE[by]}.`,
      by === 3 || by === 9 || by === 6
        ? `Add the digits of ${grouped(n)}.`
        : `Look only at the end of the number.`,
      by === 3 || by === 9
        ? `The digits add to ${digitSum}. Is ${digitSum} a multiple of ${by}?`
        : `Check it against the rule and answer.`,
    ],
    solution: [
      `Rule for ${by}: ${RULE[by]}.`,
      by === 3 || by === 9 || by === 6
        ? `${String(n).split("").join(" + ")} = ${digitSum}, and ${digitSum} ${digitSum % (by === 6 ? 3 : by) === 0 ? "is" : "is not"} a multiple of ${by === 6 ? 3 : by}.`
        : `The end of ${grouped(n)} is ${String(n).slice(-2)}.`,
      `So ${grouped(n)} is ${divisible ? "" : "NOT "}divisible by ${by}.`,
    ],
    traps: [],
  });
};

/* ═══════════════════════════════════════════════════════════════════════
   L0-N4 · FRACTION SENSE
   ═══════════════════════════════════════════════════════════════════════ */

generators["L0-N4.1"] = (r, tier) => {
  const d = r.pick(byTier(tier, { build: [2, 3, 4, 5], stretch: [6, 8, 10], exam: [8, 9, 10, 12] }));
  const n = r.int(1, d - 1);

  return item({
    skill: "Reading a fraction off a bar model",
    prompt: `The bar below is divided into equal parts, and some of them are shaded.\n\nWhat fraction of the bar is shaded? Give your answer as a fraction.`,
    input: { kind: "fraction", placeholder: "e.g. 3/4" },
    answer: `${n}/${d}`,
    tolerance: 1e-9,
    visual: { kind: "barModel", parts: d, shaded: n },
    hints: [
      "Count the total number of equal parts first. That number goes on the BOTTOM.",
      "Then count the shaded parts. That number goes on the top.",
      `There are ${d} parts altogether.`,
    ],
    solution: [
      `The bar is cut into ${d} equal parts, so the denominator is ${d}.`,
      `${n} of them are shaded, so the numerator is ${n}.`,
      `The shaded fraction is ${n}/${d}.`,
      `On a number line from 0 to 1, that sits ${n} steps of size 1/${d} along.`,
    ],
    traps: [
      trap(
        "shaded-over-unshaded",
        `${n}/${d - n}`,
        `You compared shaded to UNSHADED. A fraction compares a part to the WHOLE, so the bottom number is the total number of parts (${d}), not the number left over.`
      ),
      trap("upside-down", `${d}/${n}`, "That is upside down. The total goes underneath, the part goes on top — 3 parts out of 4 is 3/4, never 4/3."),
    ],
  });
};

generators["L0-N4.2"] = (r, tier) => {
  const base = r.pick([[1, 2], [1, 3], [2, 3], [1, 4], [3, 4], [2, 5], [3, 5], [4, 5], [5, 6], [3, 8], [5, 8], [7, 10]]);
  const k = byTier(tier, { build: r.int(2, 4), stretch: r.int(3, 8), exam: r.int(6, 14) });
  const n = base[0] * k;
  const d = base[1] * k;

  return item({
    skill: "Simplifying a fraction by dividing by the HCF",
    prompt: `Simplify ${n}/${d} to its lowest terms.`,
    input: { kind: "fraction", placeholder: "e.g. 3/4" },
    answer: `${base[0]}/${base[1]}`,
    exact: "lowest-terms",
    hints: [
      "Look for a number that divides BOTH the top and the bottom exactly.",
      `Both ${n} and ${d} are divisible by ${gcd(n, d)}.`,
      `Divide top and bottom by ${gcd(n, d)}.`,
    ],
    solution: [
      `The highest common factor of ${n} and ${d} is ${gcd(n, d)}.`,
      `${n} ÷ ${gcd(n, d)} = ${base[0]},  ${d} ÷ ${gcd(n, d)} = ${base[1]}`,
      `So ${n}/${d} = ${base[0]}/${base[1]}.`,
      "The fraction has not changed value — it is the same amount of bar, cut into fewer, bigger pieces.",
    ],
    traps: [
      trap(
        "subtracted-instead",
        `${n - gcd(n, d)}/${d - gcd(n, d)}`,
        "You subtracted from the top and the bottom. Simplifying means DIVIDING both by the same number. Subtracting changes the value of the fraction; dividing does not."
      ),
      trap(
        "partly-simplified",
        `${n / 2}/${d / 2}`,
        "You have simplified, but not all the way. There is still a common factor left. Divide by the HIGHEST common factor, or keep dividing until nothing goes into both.",
        "L0-N3.1"
      ),
    ],
    scaffold: [
      { prompt: `Step 1. List the factors of ${n}.`, input: list(), answer: factorsOf(n), hint: "Work in pairs from 1 upwards." },
      { prompt: `Step 2. List the factors of ${d}.`, input: list(), answer: factorsOf(d), hint: "Work in pairs from 1 upwards." },
      { prompt: "Step 3. What is the HIGHEST number that appears in both lists?", input: num(), answer: gcd(n, d), hint: "Compare the two lists and take the biggest one they share." },
      { prompt: `Step 4. Now divide top and bottom by ${gcd(n, d)} and write the simplified fraction.`, input: { kind: "fraction" }, answer: `${base[0]}/${base[1]}`, hint: `${n} ÷ ${gcd(n, d)} and ${d} ÷ ${gcd(n, d)}.` },
    ],
  });
};

generators["L0-N4.3"] = (r, tier) => {
  const pairs = byTier(tier, {
    build: [[1, 2, 1, 3], [2, 3, 1, 2], [3, 4, 2, 3], [1, 4, 1, 5]],
    stretch: [[3, 5, 5, 8], [4, 7, 5, 9], [5, 6, 7, 9], [2, 7, 3, 10]],
    exam: [[7, 12, 9, 16], [11, 15, 13, 18], [5, 9, 7, 12], [8, 15, 11, 20]],
  });
  const [n1, d1, n2, d2] = r.pick(pairs);
  const left = n1 / d1;
  const right = n2 / d2;
  const bigger = left > right ? `${n1}/${d1}` : `${n2}/${d2}`;
  const common = (d1 * d2) / gcd(d1, d2);

  return item({
    skill: "Comparing fractions with a common denominator",
    prompt: `Which is larger, ${n1}/${d1} or ${n2}/${d2}?\n\nWrite the larger fraction.`,
    input: { kind: "fraction" },
    answer: bigger,
    hints: [
      "You cannot compare fifths with eighths directly. Make the pieces the same size first.",
      `A common denominator for ${d1} and ${d2} is ${common}.`,
      `${n1}/${d1} = ${(n1 * common) / d1}/${common} and ${n2}/${d2} = ${(n2 * common) / d2}/${common}.`,
    ],
    solution: [
      `Common denominator: the LCM of ${d1} and ${d2} is ${common}.`,
      `${n1}/${d1} = ${(n1 * common) / d1}/${common}`,
      `${n2}/${d2} = ${(n2 * common) / d2}/${common}`,
      `${(n1 * common) / d1} ${left > right ? ">" : "<"} ${(n2 * common) / d2}, so ${bigger} is larger.`,
    ],
    traps: [
      trap(
        "bigger-numbers-win",
        n1 + d1 > n2 + d2 ? `${n1}/${d1}` : `${n2}/${d2}`,
        "You went by the size of the digits. That does not work for fractions: 1/2 is larger than 4/9 even though every number in 4/9 is bigger. Make the denominators the same, then compare the tops."
      ),
    ],
  });
};

generators["L0-N4.4"] = (r, tier) => {
  const d = r.pick([3, 4, 5, 6, 8]);
  const n = r.int(1, d - 1);
  const unit = byTier(tier, { build: r.int(2, 12) * d, stretch: r.int(20, 60) * d, exam: r.int(100, 400) * d });
  const answer = (unit / d) * n;
  const who = r.pick(NAMES);
  const money = tier !== "build";

  return item({
    skill: "Finding a fraction of an amount",
    prompt: money
      ? `${who} earns ${naira(unit)} in a week and saves ${n}/${d} of it.\n\nHow much does ${who} save?`
      : `What is ${n}/${d} of ${unit}?`,
    input: num({ placeholder: money ? "amount in naira, digits only" : "answer" }),
    answer,
    accept: [grouped(answer), naira(answer)],
    hints: [
      `To find ${n}/${d} of something, first find ONE ${d === 2 ? "half" : d === 3 ? "third" : d === 4 ? "quarter" : `${d}th`}.`,
      `${unit} ÷ ${d} = ${grouped(unit / d)}`,
      `Now multiply by ${n}.`,
    ],
    solution: [
      `Divide by the bottom: ${grouped(unit)} ÷ ${d} = ${grouped(unit / d)}   (that is one part)`,
      `Multiply by the top: ${grouped(unit / d)} × ${n} = ${grouped(answer)}`,
      money ? `${who} saves ${naira(answer)}.` : `So ${n}/${d} of ${grouped(unit)} is ${grouped(answer)}.`,
    ],
    traps: [
      trap(
        "divided-by-numerator",
        (unit / n) * d,
        `You divided by the TOP number. To find ${n}/${d} of something you divide by the bottom (${d}) to get one part, then multiply by the top (${n}).`
      ),
      trap("one-part-only", unit / d, `That is ${1}/${d} of it — one part. The question asked for ${n} parts, so multiply by ${n}.`),
      trap("gave-remainder-left", unit - answer, `That is the amount LEFT, not the amount ${money ? "saved" : "asked for"}. Read which of the two the question wants.`),
    ],
  });
};

/* ═══════════════════════════════════════════════════════════════════════
   L0-N5 · DECIMALS AND MONEY
   ═══════════════════════════════════════════════════════════════════════ */

const DECIMAL_PLACES = ["tenths", "hundredths", "thousandths"];

generators["L0-N5.1"] = (r, tier) => {
  const dp = byTier(tier, { build: 2, stretch: 3, exam: 3 });
  const whole = r.int(1, 999);
  const decimals = Array.from({ length: dp }, () => r.int(0, 9));
  if (decimals[dp - 1] === 0) decimals[dp - 1] = r.int(1, 9);
  const text_ = `${whole}.${decimals.join("")}`;
  const position = r.int(0, dp - 1);
  const digit = decimals[position];
  const value = digit / Math.pow(10, position + 1);

  return item({
    skill: "Place value to the right of the decimal point",
    prompt: `In ${text_}, what is the VALUE of the digit in the ${DECIMAL_PLACES[position]} place?\n\nGive your answer as a decimal.`,
    input: num(),
    answer: value,
    accept: [`${digit}/${Math.pow(10, position + 1)}`],
    hints: [
      "Going right from the point: tenths, hundredths, thousandths. Each place is ten times smaller than the one before it.",
      `The ${DECIMAL_PLACES[position]} place holds the digit ${digit}.`,
      `So its value is ${digit} ÷ ${Math.pow(10, position + 1)}.`,
    ],
    solution: [
      `Places after the point: tenths, hundredths, thousandths.`,
      `The ${DECIMAL_PLACES[position]} digit is ${digit}.`,
      `Its value is ${digit}/${Math.pow(10, position + 1)} = ${value}`,
    ],
    traps: [
      trap("place-vs-value", digit, `You gave the digit. The question asked what it is WORTH, and a digit in the ${DECIMAL_PLACES[position]} place is worth ${digit} ÷ ${Math.pow(10, position + 1)}.`, "L0-N1.2"),
      trap("counted-from-wrong-end", decimals[dp - 1 - position] / Math.pow(10, position + 1), "Count the decimal places LEFT to RIGHT starting at the point: tenths first, then hundredths, then thousandths."),
    ],
  });
};

generators["L0-N5.2"] = (r, tier) => {
  // The numbers are chosen to have DIFFERENT lengths after the point, because
  // that is the whole failure this atom exists to fix.
  const a = byTier(tier, { build: r.int(10, 99) / 10, stretch: r.int(100, 999) / 100, exam: r.int(1000, 9999) / 100 });
  const b = byTier(tier, { build: r.int(100, 999) / 100, stretch: r.int(10, 99) / 10, exam: r.int(100, 999) / 1000 });
  const adding = r.chance(0.6);
  const [big, small] = a >= b ? [a, b] : [b, a];
  const answer = adding ? Number((a + b).toFixed(4)) : Number((big - small).toFixed(4));

  return item({
    skill: "Adding and subtracting decimals by aligning the point",
    prompt: adding ? `Work out ${a} + ${b}` : `Work out ${big} − ${small}`,
    input: num(),
    answer,
    hints: [
      "Write them one above the other with the decimal POINTS lined up, not the last digits.",
      "Fill the short one out with zeros so both have the same number of decimal places.",
      adding
        ? `${a.toFixed(3)} + ${b.toFixed(3)} — now add column by column.`
        : `${big.toFixed(3)} − ${small.toFixed(3)} — now subtract column by column.`,
    ],
    solution: [
      `Line up the decimal points and pad with zeros:`,
      `   ${adding ? a.toFixed(3) : big.toFixed(3)}`,
      ` ${adding ? "+" : "−"} ${adding ? b.toFixed(3) : small.toFixed(3)}`,
      `   = ${answer}`,
      "The point in the answer sits directly under the points above it.",
    ],
    traps: [
      trap(
        "aligned-right",
        Number(
          (
            (adding ? 1 : -1) *
              Number(String(adding ? b : small).replace(".", "")) /
              Math.pow(10, (String(adding ? a : big).split(".")[1] || "").length) +
            (adding ? a : big)
          ).toFixed(4)
        ),
        "You lined the numbers up by their last digits instead of by the decimal point. 3.5 and 0.42 have to be written as 3.50 and 0.42 — otherwise the 5 tenths ends up added to the 4 hundredths, which are not the same size."
      ),
    ],
    scaffold: [
      { prompt: `Step 1. Write both numbers with 3 decimal places. What is ${adding ? a : big} with 3 decimal places?`, input: num(), answer: Number((adding ? a : big).toFixed(3)), hint: "Add zeros on the end. They do not change the value." },
      { prompt: `Step 2. And ${adding ? b : small} with 3 decimal places?`, input: num(), answer: Number((adding ? b : small).toFixed(3)), hint: "Add zeros on the end." },
      { prompt: `Step 3. Now ${adding ? "add" : "subtract"} them, column by column.`, input: num(), answer, hint: "Keep the point in the same column all the way down." },
    ],
  });
};

generators["L0-N5.3"] = (r, tier) => {
  const good = r.pick(GOODS);
  const count = byTier(tier, { build: r.int(2, 6), stretch: r.int(3, 12), exam: r.int(4, 17) });
  const price = r.int(good.low, good.high);
  const cost = count * price;
  const paid = Math.ceil(cost / 1000) * 1000 + (tier === "exam" ? r.int(0, 4) * 500 : 0);
  const change = paid - cost;
  const who = r.pick(NAMES);
  const market = r.pick(MARKETS);

  return item({
    skill: "Money arithmetic and change",
    prompt: `${who} buys ${count} ${good.name} at ${naira(price)} each at ${market}, and pays with ${naira(paid)}.\n\nHow much change should ${who} get?`,
    input: num({ placeholder: "naira, digits only" }),
    answer: change,
    accept: [grouped(change), naira(change)],
    hints: [
      "Two steps: what the goods cost altogether, then what is left from the money handed over.",
      `${count} × ${naira(price)} = ${naira(cost)}`,
      `Now ${naira(paid)} − ${naira(cost)}.`,
    ],
    solution: [
      `Total cost:  ${count} × ${naira(price)} = ${naira(cost)}`,
      `Change:  ${naira(paid)} − ${naira(cost)} = ${naira(change)}`,
    ],
    traps: [
      trap("gave-cost", cost, "That is what the goods COST. The question asked for the change — what is left from the money handed over."),
      trap("forgot-multiply", paid - price, `You subtracted the price of ONE. There were ${count} of them, so multiply first.`),
    ],
  });
};

generators["L0-N5.4"] = (r, tier) => {
  const pool = byTier(tier, {
    build: [[1, 2], [1, 4], [3, 4], [1, 5], [2, 5]],
    stretch: [[1, 8], [3, 8], [5, 8], [7, 10], [3, 20]],
    exam: [[5, 16], [7, 8], [9, 25], [13, 20], [11, 40]],
  });
  const [n, d] = r.pick(pool);
  const value = n / d;

  return item({
    skill: "A fraction is a division — converting to a decimal",
    prompt: `Write ${n}/${d} as a decimal.`,
    input: num(),
    answer: value,
    hints: [
      "A fraction bar means divide. The top goes INSIDE the division.",
      `So work out ${n} ÷ ${d}.`,
      `${d} does not go into ${n}, so put a point and a zero: ${n}.0 ÷ ${d}.`,
    ],
    solution: [
      `${n}/${d} means ${n} ÷ ${d}.`,
      `${n} ÷ ${d} = ${value}`,
      `Check by going back: ${value} × ${d} = ${n}.`,
    ],
    traps: [
      trap("divided-backwards", d / n, `You divided the wrong way round: ${d} ÷ ${n} instead of ${n} ÷ ${d}. The TOP of the fraction is what gets divided. A proper fraction is less than 1, so if your decimal came out bigger than 1, that is the clue.`),
      trap("wrote-digits", Number(`${n}.${d}`), `You have written the two numbers either side of a point. A fraction is not a decimal spelled differently — it is a division, and you have to carry it out.`),
    ],
  });
};

export default generators;
