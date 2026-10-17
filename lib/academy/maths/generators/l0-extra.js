import { item, trap, num, text, list, byTier } from "./kit.js";
import { grouped } from "../rng.js";

/**
 * GENERATORS · LEVEL 0 · ROMAN NUMERALS, SQUARES AND ROOTS, TIME
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Contains every answer for L0-N1.5, L0-N6 and L0-G2.
 * ═════════════════════════════════════════════════════════════════════════
 */

export const generators = {};

/* ═══════════════════════════════════════════════════════════════════════
   L0-N1.5 · ROMAN NUMERALS
   ═══════════════════════════════════════════════════════════════════════ */

const ROMAN = [
  [1000, "M"], [900, "CM"], [500, "D"], [400, "CD"],
  [100, "C"], [90, "XC"], [50, "L"], [40, "XL"],
  [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"],
];

export function toRoman(n) {
  let out = "";
  let left = n;
  for (const [value, symbol] of ROMAN) {
    while (left >= value) {
      out += symbol;
      left -= value;
    }
  }
  return out;
}

/** The same number written with no subtractive pairs: 4 as IIII, 9 as VIIII. */
function additiveOnly(n) {
  const plain = [[1000, "M"], [500, "D"], [100, "C"], [50, "L"], [10, "X"], [5, "V"], [1, "I"]];
  let out = "";
  let left = n;
  for (const [value, symbol] of plain) {
    while (left >= value) {
      out += symbol;
      left -= value;
    }
  }
  return out;
}

/** Read every symbol as positive, ignoring the subtractive rule. */
function readAllAdded(roman) {
  const v = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
  return [...roman].reduce((s, c) => s + v[c], 0);
}

/** The place-value pieces of n, written out: 1994 → ["1000 = M", "900 = CM", ...]. */
function romanSteps(n) {
  const steps = [];
  const parts = [1000, 100, 10, 1].map((p) => Math.floor((n % (p * 10)) / p) * p).filter(Boolean);
  for (const part of parts) steps.push(`${grouped(part)} = ${toRoman(part)}`);
  return steps;
}

/** A number whose Roman form uses at least one subtractive pair. */
function interestingNumber(r, max) {
  for (let i = 0; i < 40; i += 1) {
    const n = r.int(4, max);
    if (/IV|IX|XL|XC|CD|CM/.test(toRoman(n))) return n;
  }
  return Math.min(max, 49);
}

generators["L0-N1.5"] = (r, tier) => {
  const max = byTier(tier, { build: 100, stretch: 1000, exam: 3999 });
  const n = interestingNumber(r, max);
  const roman = toRoman(n);
  const toRomanWay = r.chance(0.5);

  if (toRomanWay) {
    const lazy = additiveOnly(n);
    return item({
      skill: "Writing a number in Roman numerals, place by place",
      prompt: `Write ${grouped(n)} in Roman numerals.`,
      input: text({ placeholder: "e.g. XLIV" }),
      answer: roman,
      hints: [
        "Split the number into thousands, hundreds, tens and ones, and write each part on its own.",
        "4, 9, 40, 90, 400 and 900 use a SUBTRACTIVE pair: a smaller symbol written before a larger one (IV, IX, XL, XC, CD, CM).",
        `The pieces are ${romanSteps(n).map((s) => s.split(" = ")[0]).join(" + ")}.`,
      ],
      solution: [...romanSteps(n), `Put the pieces together, largest first: ${roman}.`],
      traps: [
        trap("no-subtractive", lazy, `Each symbol may be repeated at most three times in a row. ${lazy} uses a symbol four times; the rule is to write 4 as IV, 9 as IX, 40 as XL, 90 as XC and so on. The answer is ${roman}.`),
      ],
    });
  }

  const misread = readAllAdded(roman);
  return item({
    skill: "Reading Roman numerals, including subtractive pairs",
    prompt: `Write ${roman} as an ordinary number.`,
    input: num(),
    answer: n,
    hints: [
      "I = 1, V = 5, X = 10, L = 50, C = 100, D = 500, M = 1000.",
      "Read from left to right. If a symbol is SMALLER than the one after it, subtract it instead of adding it.",
      `Split it into pieces: ${romanSteps(n).map((s) => s.split(" = ")[1]).join(" | ")}.`,
    ],
    solution: [...romanSteps(n).map((s) => s.split(" = ").reverse().join(" = ")), `Total: ${grouped(n)}.`],
    traps: [
      trap("added-every-symbol", misread, `You added every symbol. When a smaller symbol comes BEFORE a larger one, it is subtracted: IV is 4, not 6, and XC is 90, not 110. The answer is ${grouped(n)}.`),
    ],
  });
};

/* ═══════════════════════════════════════════════════════════════════════
   L0-N6 · SQUARES, CUBES AND ROOTS
   ═══════════════════════════════════════════════════════════════════════ */

generators["L0-N6.1"] = (r, tier) => {
  const hi = byTier(tier, { build: 12, stretch: 20, exam: 20 });
  const n = tier === "exam" && r.chance(0.5) ? r.pick([30, 40, 50, 60, 70, 80, 90]) : r.int(2, hi);
  const sq = n * n;

  if (r.chance(0.5)) {
    return item({
      skill: "Squaring a number",
      prompt: `Work out ${n}².`,
      input: num(),
      answer: sq,
      hints: [
        "The small 2 means: multiply the number by ITSELF.",
        `${n}² = ${n} × ${n}.`,
        n % 10 === 0 ? `${n / 10} × ${n / 10} = ${(n / 10) ** 2}, then put the two zeros back.` : `Work out ${n} × ${n}.`,
      ],
      solution: [`${n}² = ${n} × ${n} = ${grouped(sq)}`],
      traps: [trap("doubled", n * 2, `${n}² means ${n} × ${n}, not ${n} × 2. Squaring is not doubling. The answer is ${grouped(sq)}.`)],
    });
  }

  return item({
    skill: "Finding the square root of a perfect square",
    prompt: `Find √${grouped(sq)}.`,
    input: num(),
    answer: n,
    hints: [
      "The square root asks: what number, multiplied by itself, gives this?",
      `Try numbers near the answer: which number times itself is ${grouped(sq)}?`,
      n % 10 === 0 ? `${grouped(sq)} = ${(n / 10) ** 2} hundreds. √${(n / 10) ** 2} = ${n / 10}, and √100 = 10.` : `${n - 1}² = ${(n - 1) ** 2} and ${n + 1}² = ${(n + 1) ** 2}. It is between them.`,
    ],
    solution: [`${n} × ${n} = ${grouped(sq)}`, `So √${grouped(sq)} = ${n}.`],
    traps: [trap("halved", sq / 2, `A square root is not half. Half of ${grouped(sq)} is ${grouped(sq / 2)}, but √${grouped(sq)} is the number that multiplies by itself to give ${grouped(sq)}: ${n}.`)],
  });
};

generators["L0-N6.2"] = (r, tier) => {
  const n = r.int(2, byTier(tier, { build: 5, stretch: 10, exam: 10 }));
  const cube = n ** 3;

  if (r.chance(0.5)) {
    return item({
      skill: "Cubing a number",
      prompt: `Work out ${n}³.`,
      input: num(),
      answer: cube,
      hints: [
        "The small 3 means: multiply three of the number together.",
        `${n}³ = ${n} × ${n} × ${n}.`,
        `${n} × ${n} = ${n * n}. Now multiply that by ${n}.`,
      ],
      solution: [`${n} × ${n} = ${n * n}`, `${n * n} × ${n} = ${grouped(cube)}`],
      traps: [
        trap("tripled", n * 3, `${n}³ means ${n} × ${n} × ${n}, not ${n} × 3. The answer is ${grouped(cube)}.`),
        trap("squared-instead", n * n, `That is ${n}², two of them multiplied. A cube needs THREE: ${n} × ${n} × ${n} = ${grouped(cube)}.`),
      ],
    });
  }

  return item({
    skill: "Finding the cube root of a perfect cube",
    prompt: `Find ∛${grouped(cube)}  (the cube root of ${grouped(cube)}).`,
    input: num(),
    answer: n,
    hints: [
      "The cube root asks: what number, used three times in a multiplication, gives this?",
      "Know the cubes: 8, 27, 64, 125, 216, 343, 512, 729, 1000.",
      `Try ${n}: ${n} × ${n} × ${n} = ?`,
    ],
    solution: [`${n} × ${n} × ${n} = ${grouped(cube)}`, `So ∛${grouped(cube)} = ${n}.`],
    traps: [trap("divided-by-three", Math.round((cube / 3) * 100) / 100, `A cube root is not a third. ∛${grouped(cube)} is the number that, multiplied by itself three times, gives ${grouped(cube)}: ${n}.`)],
  });
};

generators["L0-N6.3"] = (r, tier) => {
  let n;
  do n = r.int(5, byTier(tier, { build: 99, stretch: 200, exam: 400 }));
  while (Number.isInteger(Math.sqrt(n)));
  const lo = Math.floor(Math.sqrt(n));
  const hi = lo + 1;

  if (tier === "build") {
    return item({
      skill: "Placing a square root between two whole numbers",
      prompt: `√${n} lies between which two consecutive whole numbers?\n\nType the smaller one first, e.g. 4, 5`,
      input: list(),
      ordered: true,
      answer: [lo, hi],
      hints: [
        "Find the square numbers either side of the number under the root.",
        `Square numbers near ${n}: ${lo - 1 > 0 ? `${(lo - 1) ** 2}, ` : ""}${lo * lo}, ${hi * hi}${hi + 1 <= 25 ? `, ${(hi + 1) ** 2}` : ""}.`,
        `${lo}² = ${lo * lo} and ${hi}² = ${hi * hi}, and ${n} is between them.`,
      ],
      solution: [`${lo}² = ${lo * lo}`, `${hi}² = ${hi * hi}`, `${lo * lo} < ${n} < ${hi * hi}, so ${lo} < √${n} < ${hi}.`],
      traps: [trap("halved", [Math.floor(n / 2), Math.floor(n / 2) + 1], "A square root is not half the number. Look for the two SQUARE numbers either side of it.")],
    });
  }

  const estimate = Math.round(Math.sqrt(n) * 10) / 10;
  return item({
    skill: "Estimating a square root to one decimal place",
    prompt: `Estimate √${n} to 1 decimal place, without a calculator.`,
    input: num(),
    answer: estimate,
    tolerance: 0.1,
    hints: [
      `First trap it: ${lo}² = ${lo * lo} and ${hi}² = ${hi * hi}.`,
      `${n} is ${n - lo * lo} of the way from ${lo * lo} to ${hi * hi}, a gap of ${hi * hi - lo * lo}.`,
      `So √${n} is roughly ${lo} + ${n - lo * lo}/${hi * hi - lo * lo}. Check by squaring your estimate.`,
    ],
    solution: [
      `${lo}² = ${lo * lo} and ${hi}² = ${hi * hi}, so √${n} is between ${lo} and ${hi}.`,
      `${n} is ${n - lo * lo} out of ${hi * hi - lo * lo} of the way along, about ${(((n - lo * lo) / (hi * hi - lo * lo)) * 10).toFixed(0)} tenths.`,
      `Check: ${estimate}² = ${(estimate * estimate).toFixed(2)}, close to ${n}.`,
      `√${n} ≈ ${estimate}`,
    ],
    traps: [trap("halved", n / 2, `A square root is not half the number. Half of ${n} is ${n / 2}; √${n} is between ${lo} and ${hi}.`)],
  });
};

/* ═══════════════════════════════════════════════════════════════════════
   L0-G2 · TIME
   ═══════════════════════════════════════════════════════════════════════ */

const pad = (n) => String(n).padStart(2, "0");
const clock24 = (mins) => `${pad(Math.floor(mins / 60) % 24)}:${pad(mins % 60)}`;
function clock12(mins) {
  const h24 = Math.floor(mins / 60) % 24;
  const m = mins % 60;
  const suffix = h24 < 12 ? "am" : "pm";
  const h = h24 % 12 === 0 ? 12 : h24 % 12;
  return `${h}:${pad(m)} ${suffix}`;
}

generators["L0-G2.1"] = (r, tier) => {
  const kinds = byTier(tier, {
    build: ["h-min", "min-s", "day-h", "week-day"],
    stretch: ["h-min", "min-s", "day-h", "week-day", "min-h", "mixed"],
    exam: ["mixed", "min-h", "year-day", "h-s"],
  });
  const kind = r.pick(kinds);

  if (kind === "year-day") {
    const leap = r.chance(0.5);
    const year = leap ? r.pick([2024, 2028, 2032, 2036]) : r.pick([2025, 2026, 2027, 2029]);
    const days = leap ? 366 : 365;
    return item({
      skill: "Days in a year, and leap years",
      prompt: `How many days are there in the year ${year}?`,
      input: num(),
      answer: days,
      hints: [
        "An ordinary year has 365 days. A leap year has 366, because February gets a 29th day.",
        "A year is a leap year if it divides exactly by 4 (century years must divide by 400).",
        `Is ${year} ÷ 4 a whole number?`,
      ],
      solution: [`${year} ÷ 4 = ${year / 4}${leap ? ", a whole number, so it is a leap year" : ", not a whole number, so it is not a leap year"}.`, `${days} days.`],
      traps: [trap(leap ? "missed-leap" : "false-leap", leap ? 365 : 366, leap ? `${year} divides exactly by 4, so it is a leap year with 366 days.` : `${year} does not divide exactly by 4, so it is an ordinary year with 365 days.`)],
    });
  }

  const table = {
    "h-min": () => { const h = r.int(2, 12); return { q: `How many minutes are there in ${h} hours?`, a: h * 60, steps: [`1 hour = 60 minutes`, `${h} × 60 = ${h * 60} minutes`], wrong: h * 100 }; },
    "min-s": () => { const m = r.int(2, 15); return { q: `How many seconds are there in ${m} minutes?`, a: m * 60, steps: [`1 minute = 60 seconds`, `${m} × 60 = ${m * 60} seconds`], wrong: m * 100 }; },
    "day-h": () => { const d = r.int(2, 7); return { q: `How many hours are there in ${d} days?`, a: d * 24, steps: [`1 day = 24 hours`, `${d} × 24 = ${d * 24} hours`], wrong: d * 12 }; },
    "week-day": () => { const w = r.int(2, 12); return { q: `How many days are there in ${w} weeks?`, a: w * 7, steps: [`1 week = 7 days`, `${w} × 7 = ${w * 7} days`], wrong: w * 5 }; },
    "min-h": () => { const h = r.int(2, 9); return { q: `Write ${h * 60} minutes in hours.`, a: h, steps: [`60 minutes = 1 hour`, `${h * 60} ÷ 60 = ${h} hours`], wrong: (h * 60) / 100 }; },
    "h-s": () => { const h = r.int(2, 5); return { q: `How many seconds are there in ${h} hours?`, a: h * 3600, steps: [`1 hour = 60 minutes = 60 × 60 = 3,600 seconds`, `${h} × 3,600 = ${grouped(h * 3600)} seconds`], wrong: h * 60 }; },
    mixed: () => { const h = r.int(1, 5); const m = r.int(5, 55); return { q: `Write ${h} hours ${m} minutes in minutes.`, a: h * 60 + m, steps: [`${h} hours = ${h} × 60 = ${h * 60} minutes`, `${h * 60} + ${m} = ${h * 60 + m} minutes`], wrong: h * 100 + m }; },
  }[kind]();

  return item({
    skill: "Converting between units of time",
    prompt: table.q,
    input: num(),
    answer: table.a,
    hints: [
      "60 seconds = 1 minute, 60 minutes = 1 hour, 24 hours = 1 day, 7 days = 1 week.",
      "To go to a SMALLER unit, multiply. To go to a BIGGER unit, divide.",
      table.steps[0],
    ],
    solution: table.steps,
    traps: [trap("counted-in-hundreds", table.wrong, "Time does not count in hundreds or tens. There are 60 minutes in an hour, 60 seconds in a minute and 24 hours in a day.")],
  });
};

generators["L0-G2.2"] = (r, tier) => {
  const pickTime = () => {
    if (tier !== "build" && r.chance(0.35)) return r.pick([0, 12 * 60]) + r.int(1, 59); // just after midnight or noon
    return r.int(0, 23) * 60 + r.pick([0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55]);
  };
  const mins = pickTime();
  const t24 = clock24(mins);
  const t12 = clock12(mins);
  const h24 = Math.floor(mins / 60);

  if (r.chance(0.5)) {
    return item({
      skill: "12-hour to 24-hour time",
      prompt: `Write ${t12} in 24-hour time.`,
      input: text({ placeholder: "e.g. 14:30" }),
      answer: t24,
      accept: [t24.replace(":", ""), t24.replace(":", "."), `${t24} hrs`, `${t24.replace(":", "")} hrs`, `${t24.replace(":", "")}hrs`],
      hints: [
        "The 24-hour clock counts the hours from midnight: 00 to 23.",
        "am times keep their hour (but 12 am becomes 00). pm times add 12 (but 12 pm stays 12).",
        h24 >= 12 ? `It is pm, so the hour is ${h24 % 12 === 0 ? 12 : h24 % 12} + ${h24 === 12 ? 0 : 12}.` : `It is am${h24 === 0 ? ", and 12 am is the 00 hour" : ""}.`,
      ],
      solution: [h24 >= 12 ? `pm: ${h24 === 12 ? "12 pm stays as 12" : `${h24 - 12} + 12 = ${h24}`}` : h24 === 0 ? "12 am is the first hour after midnight: 00" : `am: the hour stays ${pad(h24)}`, `${t12} = ${t24}`],
      traps: [
        trap("forgot-twelve", h24 > 12 ? `${pad(h24 - 12)}:${pad(mins % 60)}` : null, `In the afternoon and evening you add 12 to the hour. ${t12} is ${t24}.`),
        trap("midnight-as-24", h24 === 0 ? `24:${pad(mins % 60)}` : null, `The hour after midnight is written 00, not 24. ${t12} is ${t24}.`),
      ],
    });
  }

  return item({
    skill: "24-hour to 12-hour time",
    prompt: `Write ${t24} in 12-hour time, with am or pm.`,
    input: text({ placeholder: "e.g. 2:30 pm" }),
    answer: t12,
    accept: [t12.replace(" ", ""), t12.replace(":", "."), t12.replace(":", ".").replace(" ", ""), t12.replace("am", "a.m.").replace("pm", "p.m.")],
    hints: [
      "Hours 00 to 11 are am. Hours 12 to 23 are pm.",
      "For hours 13 to 23, take 12 away. The 00 hour is 12 am and the 12 hour is 12 pm.",
      `The hour here is ${pad(h24)}.`,
    ],
    solution: [h24 > 12 ? `${h24} − 12 = ${h24 - 12}, and it is pm` : h24 === 12 ? "The 12 hour is just after noon: 12 pm" : h24 === 0 ? "The 00 hour is just after midnight: 12 am" : `${pad(h24)} is before noon: am`, `${t24} = ${t12}`],
    traps: [
      trap("wrong-half", t12.endsWith("am") ? t12.replace("am", "pm") : t12.replace("pm", "am"), `Check am and pm: hours 00 to 11 are am (morning), 12 to 23 are pm. ${t24} is ${t12}.`),
    ],
  });
};

generators["L0-G2.3"] = (r, tier) => {
  const start = r.int(5, 20) * 60 + r.pick([5, 10, 15, 20, 25, 35, 40, 45, 50, 55]);
  const duration = byTier(tier, { build: r.int(1, 3) * 60 + r.pick([10, 20, 25, 35, 40, 50]), stretch: r.int(2, 6) * 60 + r.pick([15, 25, 35, 45, 55]), exam: r.int(4, 9) * 60 + r.pick([5, 25, 45, 55]) });
  const finish = start + duration;
  const crossesMidnight = finish >= 24 * 60;
  const dh = Math.floor(duration / 60);
  const dm = duration % 60;

  if (r.chance(0.5)) {
    const toNextHour = 60 - (start % 60);
    return item({
      skill: "Finding a finishing time",
      prompt: `A bus leaves at ${clock24(start)} and the journey takes ${dh} h ${dm} min. At what time does it arrive? Give the 24-hour time.`,
      input: text({ placeholder: "e.g. 14:30" }),
      answer: clock24(finish),
      accept: [clock24(finish).replace(":", ""), clock24(finish).replace(":", ".")],
      hints: [
        "Add the hours first, then the minutes.",
        "When the minutes reach 60, that is one more hour. Never write more than 59 minutes.",
        `${clock24(start)} + ${dh} h = ${clock24(start + dh * 60)}. Now add ${dm} minutes, counting up to the next hour first.`,
      ],
      solution: [
        `${clock24(start)} + ${dh} h = ${clock24(start + dh * 60)}`,
        dm >= toNextHour
          ? `${clock24(start + dh * 60)} + ${toNextHour} min = ${clock24(start + dh * 60 + toNextHour)}, then + ${dm - toNextHour} min = ${clock24(finish)}`
          : `${clock24(start + dh * 60)} + ${dm} min = ${clock24(finish)}`,
        crossesMidnight ? "It passed midnight, so the hour starts again from 00." : `It arrives at ${clock24(finish)}.`,
      ],
      traps: [
        trap("minutes-over-60", `${pad(Math.floor(start / 60) + dh)}:${pad((start % 60) + dm)}`, `Minutes only go up to 59. ${(start % 60) + dm} minutes is ${Math.floor(((start % 60) + dm) / 60)} hour and ${((start % 60) + dm) % 60} minutes, so carry the hour. The answer is ${clock24(finish)}.`),
      ],
    });
  }

  const decimalWrong = (Math.floor(finish / 60) * 100 + (finish % 60)) - (Math.floor(start / 60) * 100 + (start % 60));
  const nextHour = start + (60 - (start % 60));
  const lastHour = finish - (finish % 60);
  const wholeHours = Math.round((lastHour - nextHour) / 60);
  return item({
    skill: "Finding a duration",
    prompt: `A lesson starts at ${clock24(start)} and ends at ${clock24(finish % (24 * 60))}${crossesMidnight ? " the next day" : ""}. How long is it, in MINUTES?`,
    input: num({ unit: "min" }),
    answer: duration,
    hints: [
      "Count up from the start time to the next whole hour, then whole hours, then the minutes left.",
      "Do NOT subtract the times like ordinary numbers: an hour has 60 minutes, not 100.",
      `From ${clock24(start)} to ${clock24(start + (60 - (start % 60)))} is ${60 - (start % 60)} minutes.`,
    ],
    solution: [
      `${clock24(start)} → ${clock24(nextHour)}: ${60 - (start % 60)} min`,
      wholeHours > 0 ? `${clock24(nextHour)} → ${clock24(lastHour)}: ${wholeHours} h = ${wholeHours * 60} min` : null,
      finish % 60 ? `${clock24(lastHour)} → ${clock24(finish)}: ${finish % 60} min` : null,
      `Total: ${duration} minutes (${dh} h ${dm} min).`,
    ].filter(Boolean),
    traps: [
      trap("subtracted-as-decimals", decimalWrong, `You subtracted the times as if an hour had 100 minutes. Count up instead: the answer is ${duration} minutes.`),
      trap("gave-hours-only", dh, `The question asks for MINUTES. ${dh} h ${dm} min = ${dh} × 60 + ${dm} = ${duration} minutes.`),
    ],
  });
};

export default generators;
