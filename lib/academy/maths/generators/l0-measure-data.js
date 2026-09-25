import { item, trap, num, text, choice, byTier } from "./kit.js";
import { grouped, NAMES, PLACES, tidy } from "../rng.js";

/**
 * GENERATORS · LEVEL 0 · MEASUREMENT AND READING DATA
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Contains every answer for L0-G1 and L0-S1.
 * ═════════════════════════════════════════════════════════════════════════
 *
 * Two modules that look easy and are not. Unit conversion is named in the
 * Chief Examiners' reports every year, and it fails in one specific way — the
 * student multiplies where they should divide and produces an answer that is
 * right but a thousand times too big. Every conversion item here therefore
 * traps that exact reversal and says so by name.
 *
 * The data module exists because a startling number of students who can
 * calculate a mean cannot find the number the question is asking about in the
 * table in front of them.
 */

export const generators = {};

/* ═══════════════════════════════════════════════════════════════════════
   L0-G1 · MEASUREMENT BASICS
   ═══════════════════════════════════════════════════════════════════════ */

/** from → to, with the factor and which way it goes. */
const CONVERSIONS = [
  { from: "mm", to: "cm", factor: 10, down: true },
  { from: "cm", to: "m", factor: 100, down: true },
  { from: "m", to: "km", factor: 1000, down: true },
  { from: "cm", to: "mm", factor: 10, down: false },
  { from: "m", to: "cm", factor: 100, down: false },
  { from: "km", to: "m", factor: 1000, down: false },
  { from: "g", to: "kg", factor: 1000, down: true },
  { from: "kg", to: "g", factor: 1000, down: false },
  { from: "ml", to: "litres", factor: 1000, down: true },
  { from: "litres", to: "ml", factor: 1000, down: false },
];

generators["L0-G1.1"] = (r, tier) => {
  const c = r.pick(CONVERSIONS);
  const value = byTier(tier, {
    build: r.int(1, 9) * c.factor,
    stretch: r.int(11, 99) * (c.factor / 10 || 1),
    exam: tidy(r.int(15, 940) / (c.down ? 1 : 10)),
  });
  const answer = tidy(c.down ? value / c.factor : value * c.factor);

  return item({
    skill: "Converting between metric units in the right direction",
    prompt: `Convert ${grouped(value)} ${c.from} to ${c.to}.`,
    input: num({ placeholder: `answer in ${c.to}` }),
    unit: c.to,
    answer,
    hints: [
      `There are ${grouped(c.factor)} ${c.down ? c.from : c.to} in one ${c.down ? c.to : c.from}.`,
      c.down
        ? `You are going to a BIGGER unit, so the number must get SMALLER. That means dividing.`
        : `You are going to a SMALLER unit, so the number must get BIGGER. That means multiplying.`,
      `So work out ${grouped(value)} ${c.down ? "÷" : "×"} ${grouped(c.factor)}.`,
    ],
    solution: [
      `1 ${c.down ? c.to : c.from} = ${grouped(c.factor)} ${c.down ? c.from : c.to}.`,
      `${c.to} are ${c.down ? "bigger" : "smaller"} than ${c.from}, so the number gets ${c.down ? "smaller" : "bigger"}.`,
      `${grouped(value)} ${c.down ? "÷" : "×"} ${grouped(c.factor)} = ${grouped(answer)}`,
      `Answer: ${grouped(answer)} ${c.to}`,
    ],
    traps: [
      trap(
        "converted-backwards",
        tidy(c.down ? value * c.factor : value / c.factor),
        `You went the wrong way — you ${c.down ? "multiplied" : "divided"} when you should have ${c.down ? "divided" : "multiplied"}. Before touching the numbers, ask one question: is the unit I am moving TO bigger or smaller? Moving to a bigger unit always makes the NUMBER smaller. ${grouped(value)} ${c.from} cannot become ${grouped(c.down ? value * c.factor : value / c.factor)} ${c.to} — that is ${c.down ? "bigger" : "smaller"} than what you started with.`
      ),
      trap(
        "wrong-factor",
        tidy(c.down ? value / (c.factor === 1000 ? 100 : 1000) : value * (c.factor === 1000 ? 100 : 1000)),
        `Right direction, wrong factor. Check it: 10 mm in a cm, 100 cm in a metre, 1000 m in a kilometre, 1000 g in a kilogram, 1000 ml in a litre.`
      ),
    ],
    scaffold: [
      {
        prompt: `Step 1. Which is the bigger unit, ${c.from} or ${c.to}?`,
        input: choice([c.from, c.to]),
        answer: c.down ? c.to : c.from,
        hint: "A kilometre is bigger than a metre. A millimetre is smaller than a centimetre.",
      },
      {
        prompt: `Step 2. You are converting to ${c.to}. Will the NUMBER get bigger or smaller? Type "bigger" or "smaller".`,
        input: text(),
        answer: c.down ? "smaller" : "bigger",
        hint: "Bigger unit means fewer of them, so a smaller number. It takes fewer metres than centimetres to cross the same room.",
      },
      {
        prompt: `Step 3. So do you multiply or divide by ${grouped(c.factor)}? Type "multiply" or "divide".`,
        input: text(),
        answer: c.down ? "divide" : "multiply",
        hint: "Dividing makes a number smaller. Multiplying makes it bigger.",
      },
      {
        prompt: `Step 4. Work it out: ${grouped(value)} ${c.down ? "÷" : "×"} ${grouped(c.factor)}.`,
        input: num(),
        answer,
        hint: `Move the digits ${String(c.factor).length - 1} place${c.factor === 10 ? "" : "s"} ${c.down ? "right" : "left"}.`,
      },
    ],
  });
};

generators["L0-G1.2"] = (r, tier) => {
  const kind = tier === "build" ? r.pick(["ruler", "clock"]) : r.pick(["ruler", "clock", "scale"]);

  if (kind === "clock") {
    const hour = r.int(1, 12);
    const minute = r.pick([0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55]);
    const later = r.pick([25, 40, 45, 50, 70, 90, 100]);
    const endTotal = hour * 60 + minute + later;
    const endHour = Math.floor(endTotal / 60) % 12 || 12;
    const endMinute = endTotal % 60;
    const asked = `${String(endHour).padStart(2, "0")}:${String(endMinute).padStart(2, "0")}`;

    return item({
      skill: "Elapsed time across the hour",
      prompt: `A lesson starts at ${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")} and lasts ${later} minutes.\n\nWhat time does it end? Give your answer as hh:mm.`,
      input: text({ placeholder: "e.g. 10:35" }),
      answer: asked,
      visual: { kind: "clock", hour, minute },
      hints: [
        "Count up to the next whole hour first, then carry on with what is left.",
        `From ${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")} to ${String(hour === 12 ? 1 : hour + 1).padStart(2, "0")}:00 is ${60 - minute} minutes.`,
        `That leaves ${later - (60 - minute) > 0 ? later - (60 - minute) : later} minutes to add on.`,
      ],
      solution: [
        `Start: ${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}, add ${later} minutes.`,
        `Up to the hour: ${60 - minute} minutes.`,
        `Remaining: ${Math.max(0, later - (60 - minute))} minutes past the hour.`,
        `End time: ${asked}`,
      ],
      traps: [
        trap(
          "decimal-hours",
          `${String(hour + Math.floor(later / 60)).padStart(2, "0")}:${String(minute + (later % 60)).padStart(2, "0")}`,
          "You added the minutes without carrying into the next hour. Time is in base 60, not base 100 — 45 minutes plus 30 minutes is 1 hour 15, not 75 past the hour."
        ),
      ],
    });
  }

  if (kind === "scale") {
    const major = r.pick([100, 200, 500]);
    const divisions = r.pick([5, 10]);
    const notches = r.int(1, divisions * 4);
    const reading = (major / divisions) * notches;
    return item({
      skill: "Reading between the marks on a scale",
      prompt: `The weighing scale below has major marks every ${major} g, with ${divisions} small divisions between each pair.\n\nThe pointer is on the ${notches}${notches === 1 ? "st" : notches === 2 ? "nd" : notches === 3 ? "rd" : "th"} small mark after zero. What does it read, in grams?`,
      input: num({ placeholder: "grams" }),
      unit: "g",
      answer: reading,
      visual: { kind: "scale", major, divisions, notches },
      hints: [
        "Work out what ONE small division is worth first.",
        `${major} g split into ${divisions} parts.`,
        `Each small mark is ${major / divisions} g, so multiply by ${notches}.`,
      ],
      solution: [
        `One small division = ${major} ÷ ${divisions} = ${major / divisions} g`,
        `${notches} divisions = ${notches} × ${major / divisions} = ${grouped(reading)} g`,
      ],
      traps: [
        trap("counted-divisions", notches, "That is the number of MARKS, not the reading. Each mark is worth more than one gram — work out what one division is worth first."),
        trap("used-major-mark", notches * major, `You used the major spacing (${major} g) for each small mark. The small marks are the major spacing divided by ${divisions}.`),
      ],
    });
  }

  const cm = r.int(1, 14);
  const mm = r.int(1, 9);
  return item({
    skill: "Reading a ruler to the nearest millimetre",
    prompt: `A pencil is measured against a ruler. Its end lies ${cm} cm and ${mm} mm from zero.\n\nHow long is it, in centimetres?`,
    input: num({ placeholder: "centimetres" }),
    unit: "cm",
    answer: tidy(cm + mm / 10),
    visual: { kind: "ruler", cm, mm },
    hints: [
      "There are 10 mm in 1 cm, so each small mark on the ruler is a tenth of a centimetre.",
      `${mm} mm is ${mm}/10 of a centimetre.`,
      `So the length is ${cm} + 0.${mm} cm.`,
    ],
    solution: [
      `${mm} mm = ${mm / 10} cm`,
      `Total = ${cm} + ${mm / 10} = ${tidy(cm + mm / 10)} cm`,
    ],
    traps: [
      trap("wrote-both-numbers", Number(`${cm}.${mm < 10 ? mm : mm}`) === tidy(cm + mm / 10) ? cm * 10 + mm : Number(`${cm}${mm}`), `That is the length in MILLIMETRES, not centimetres. ${cm * 10 + mm} mm is right, but the question asked for centimetres — divide by 10.`),
    ],
  });
};

generators["L0-G1.3"] = (r, tier) => {
  if (tier === "build") {
    const w = r.int(3, 19);
    const h = r.int(3, 19);
    return item({
      skill: "Perimeter as the distance all the way round",
      prompt: `A rectangle is ${w} cm long and ${h} cm wide.\n\nWhat is its perimeter?`,
      input: num({ placeholder: "cm" }),
      unit: "cm",
      answer: 2 * (w + h),
      visual: { kind: "rectangle", width: w, height: h, label: "perimeter" },
      hints: [
        "Perimeter is the distance all the way round the outside.",
        "A rectangle has two lengths and two widths.",
        `So ${w} + ${h} + ${w} + ${h}, or 2 × (${w} + ${h}).`,
      ],
      solution: [`P = 2 × (length + width)`, `P = 2 × (${w} + ${h}) = 2 × ${w + h} = ${2 * (w + h)} cm`],
      traps: [
        trap("found-area", w * h, `That is the AREA — the space inside. The perimeter is the distance round the outside, so you add the sides rather than multiplying them. Notice the units too: area is cm², perimeter is cm.`, "L0-G1.4"),
        trap("added-once", w + h, "You added one length and one width. A rectangle has two of each."),
      ],
    });
  }

  // An L-shape: two rectangles, with the missing sides to be worked out.
  const a = r.int(6, 16);
  const b = r.int(4, 12);
  const c = r.int(2, a - 2);
  const d = r.int(2, b - 2);
  const perimeter = 2 * (a + b);

  return item({
    skill: "Perimeter of a compound shape",
    prompt: `An L-shaped plot is formed by cutting a ${c} m by ${d} m corner out of an ${a} m by ${b} m rectangle.\n\nWhat is the perimeter of the L-shape, in metres?`,
    input: num({ placeholder: "metres" }),
    unit: "m",
    answer: perimeter,
    visual: { kind: "lshape", width: a, height: b, cutWidth: c, cutHeight: d },
    hints: [
      "Do not try to add the six sides before you know them all. Two of them are not given.",
      "The two sides of the notch replace the two pieces that were cut off — they are exactly as long.",
      "Slide the two notch sides outwards in your mind and the shape becomes the original rectangle again.",
    ],
    solution: [
      "Cutting a rectangular corner out does NOT change the perimeter.",
      `The two new edges (${c} m and ${d} m) exactly replace the two pieces removed.`,
      `So the perimeter is the same as the original rectangle: 2 × (${a} + ${b}) = ${perimeter} m`,
    ],
    traps: [
      trap(
        "subtracted-the-cut",
        perimeter - 2 * (c + d),
        "You subtracted the cut from the perimeter. Cutting a corner out removes two pieces of edge but adds two new ones of exactly the same lengths, so the perimeter is unchanged. It is the AREA that goes down, not the perimeter."
      ),
      trap("found-area", a * b - c * d, "That is the area of the L-shape. The question asked for the perimeter — the distance round the outside."),
    ],
  });
};

generators["L0-G1.4"] = (r, tier) => {
  if (tier === "build") {
    const w = r.int(4, 20);
    const h = r.int(3, 18);
    return item({
      skill: "Area of a rectangle, with square units",
      prompt: `Find the area of a rectangle measuring ${w} cm by ${h} cm.`,
      input: num({ placeholder: "cm²" }),
      unit: "cm²",
      answer: w * h,
      visual: { kind: "rectangle", width: w, height: h, label: "area" },
      hints: ["Area is length times width.", `${w} × ${h}`, "The unit is cm², because you multiplied centimetres by centimetres."],
      solution: [`A = length × width = ${w} × ${h} = ${w * h} cm²`],
      traps: [
        trap("found-perimeter", 2 * (w + h), "That is the PERIMETER, the distance round the edge. Area is the space inside, and it is length × width.", "L0-G1.3"),
      ],
    });
  }

  const a = r.int(8, 20);
  const b = r.int(6, 15);
  const c = r.int(3, a - 4);
  const d = r.int(2, b - 3);
  const area = a * b - c * d;
  const who = r.pick(NAMES);
  const place = r.pick(PLACES);

  return item({
    skill: "Area of a compound shape by splitting or subtracting",
    prompt: `${who} has a plot in ${place} measuring ${a} m by ${b} m. A ${c} m by ${d} m rectangular corner is taken for a storeroom.\n\nWhat area of the plot is left, in square metres?`,
    input: num({ placeholder: "m²" }),
    unit: "m²",
    answer: area,
    visual: { kind: "lshape", width: a, height: b, cutWidth: c, cutHeight: d },
    hints: [
      "Find the area of the whole rectangle first, then take away the part that was removed.",
      `Whole plot: ${a} × ${b} = ${grouped(a * b)} m²`,
      `Storeroom: ${c} × ${d} = ${c * d} m². Subtract.`,
    ],
    solution: [
      `Whole rectangle: ${a} × ${b} = ${grouped(a * b)} m²`,
      `Corner removed: ${c} × ${d} = ${c * d} m²`,
      `Area left: ${grouped(a * b)} − ${c * d} = ${grouped(area)} m²`,
    ],
    traps: [
      trap("forgot-to-subtract", a * b, "That is the area of the WHOLE plot. The storeroom corner has been taken out, so subtract it."),
      trap("subtracted-perimeters", 2 * (a + b) - 2 * (c + d), "You worked with perimeters. The question is about area — the space inside — so multiply the sides rather than adding them."),
    ],
  });
};

/* ═══════════════════════════════════════════════════════════════════════
   L0-S1 · READING DATA
   ═══════════════════════════════════════════════════════════════════════ */

const ROUTES = [
  ["Lagos", "Ibadan", "Ilorin", "Jebba", "Minna", "Abuja"],
  ["Enugu", "Awka", "Onitsha", "Asaba", "Benin", "Ore"],
  ["Kano", "Zaria", "Kaduna", "Jos", "Bauchi", "Gombe"],
];

generators["L0-S1.1"] = (r, tier) => {
  const route = r.pick(ROUTES);
  const stops = route.slice(0, byTier(tier, { build: 4, stretch: 5, exam: 6 }));
  let minutes = r.int(6, 9) * 60 + r.pick([0, 15, 30, 45]);
  const times = stops.map((stop) => {
    const t = minutes;
    minutes += r.int(35, 95);
    return { stop, minutes: t };
  });

  const asHHMM = (m) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
  const rows = times.map((t) => [t.stop, asHHMM(t.minutes)]);

  const i = r.int(0, times.length - 2);
  const j = r.int(i + 1, times.length - 1);
  const gap = times[j].minutes - times[i].minutes;

  return item({
    skill: "Elapsed time from a timetable",
    prompt: `Use the bus timetable below.\n\nHow long does the journey from ${times[i].stop} to ${times[j].stop} take, in minutes?`,
    input: num({ placeholder: "minutes" }),
    answer: gap,
    visual: { kind: "table", headers: ["Stop", "Departs"], rows },
    hints: [
      `Find the two times: ${times[i].stop} and ${times[j].stop}.`,
      `${asHHMM(times[i].minutes)} and ${asHHMM(times[j].minutes)}.`,
      "Count up to the next whole hour, then count the remaining hours and minutes.",
    ],
    solution: [
      `${times[i].stop} departs ${asHHMM(times[i].minutes)}; ${times[j].stop} departs ${asHHMM(times[j].minutes)}.`,
      `That is ${Math.floor(gap / 60)} hour${Math.floor(gap / 60) === 1 ? "" : "s"} ${gap % 60} minutes.`,
      `In minutes: ${Math.floor(gap / 60)} × 60 + ${gap % 60} = ${gap} minutes.`,
    ],
    traps: [
      trap(
        "subtracted-as-decimals",
        Number(String(times[j].minutes - times[i].minutes).replace(/\D/g, "")) === gap
          ? gap + 40
          : Math.abs(
              Number(asHHMM(times[j].minutes).replace(":", "")) -
                Number(asHHMM(times[i].minutes).replace(":", ""))
            ),
        "You subtracted the two times as if they were ordinary numbers. Clock times are not decimals: 10:15 minus 09:50 is 25 minutes, not 65."
      ),
      trap("wrong-rows", times[j].minutes - times[Math.max(0, i - 1)].minutes, "You have read the wrong row. Put a finger on each of the two stops named in the question before doing any arithmetic."),
    ],
  });
};

generators["L0-S1.2"] = (r, tier) => {
  const subjects = r.sample(["Maths", "English", "Biology", "Chemistry", "Civic Ed", "Economics", "Geography"], byTier(tier, { build: 4, stretch: 5, exam: 6 }));
  const scale = byTier(tier, { build: 1, stretch: 5, exam: 10 });
  const data = subjects.map((s) => ({ label: s, value: r.int(2, 18) * scale }));

  const mode = r.pick(["biggest", "difference", "total"]);
  const sorted = [...data].sort((x, y) => y.value - x.value);

  const spec = {
    biggest: {
      prompt: "Which subject had the highest number of students? Write the subject name.",
      input: choice(subjects),
      answer: sorted[0].label,
      hints: ["Find the tallest bar.", "Read across from the top of the tallest bar to the axis.", `Compare ${sorted[0].label} and ${sorted[1].label} carefully.`],
      solution: [`The tallest bar is ${sorted[0].label}, at ${sorted[0].value}.`],
      traps: [],
    },
    difference: {
      prompt: `How many MORE students took ${sorted[0].label} than ${sorted[sorted.length - 1].label}?`,
      input: num(),
      answer: sorted[0].value - sorted[sorted.length - 1].value,
      hints: ["Read both bars off the axis first.", `${sorted[0].label} is ${sorted[0].value}, ${sorted[sorted.length - 1].label} is ${sorted[sorted.length - 1].value}.`, "Now subtract."],
      solution: [
        `${sorted[0].label}: ${sorted[0].value}`,
        `${sorted[sorted.length - 1].label}: ${sorted[sorted.length - 1].value}`,
        `Difference: ${sorted[0].value} − ${sorted[sorted.length - 1].value} = ${sorted[0].value - sorted[sorted.length - 1].value}`,
      ],
      traps: [
        trap("added-instead", sorted[0].value + sorted[sorted.length - 1].value, "You added the two bars. 'How many more' asks for the DIFFERENCE, so subtract."),
        trap("gave-one-bar", sorted[0].value, `That is the height of the ${sorted[0].label} bar on its own. The question asks how much MORE it is than the other one.`),
      ],
    },
    total: {
      prompt: "How many students are shown altogether?",
      input: num(),
      answer: data.reduce((s, d) => s + d.value, 0),
      hints: ["Read every bar and add them.", `Start with ${data[0].label}: ${data[0].value}.`, "Add them one at a time and keep a running total."],
      solution: [
        ...data.map((d) => `${d.label}: ${d.value}`),
        `Total: ${data.map((d) => d.value).join(" + ")} = ${data.reduce((s, d) => s + d.value, 0)}`,
      ],
      traps: [
        trap("counted-bars", data.length, "That is the number of BARS, not the number of students. Each bar stands for a count — read its height and add those."),
      ],
    },
  }[mode];

  return item({
    skill: "Reading values off a bar chart",
    prompt: `The bar chart shows how many students chose each subject.\n\n${spec.prompt}`,
    input: spec.input,
    answer: spec.answer,
    visual: { kind: "barChart", data, axisStep: scale === 1 ? 2 : scale },
    hints: spec.hints,
    solution: spec.solution,
    traps: spec.traps,
  });
};

generators["L0-S1.3"] = (r, tier) => {
  const who = r.sample(NAMES, 4);
  const subjects = ["Maths", "English", "Biology"];
  const rows = who.map((name) => [name, ...subjects.map(() => r.int(35, 95))]);

  const ask = byTier(tier, { build: "one-cell", stretch: "row-total", exam: "who-highest" });

  if (ask === "one-cell") {
    const i = r.int(0, rows.length - 1);
    const j = r.int(0, subjects.length - 1);
    return item({
      skill: "Finding the cell a question is asking about",
      prompt: `The table shows three test scores for four students.\n\nWhat did ${rows[i][0]} score in ${subjects[j]}?`,
      input: num(),
      answer: rows[i][1 + j],
      visual: { kind: "table", headers: ["Student", ...subjects], rows },
      hints: [
        `Find the ROW for ${rows[i][0]} first.`,
        `Then find the COLUMN headed ${subjects[j]}.`,
        "The answer is where that row and that column meet.",
      ],
      solution: [
        `Row: ${rows[i][0]}.`,
        `Column: ${subjects[j]}.`,
        `Where they meet: ${rows[i][1 + j]}.`,
      ],
      traps: [
        trap("read-wrong-column", rows[i][1 + ((j + 1) % subjects.length)], `That is ${rows[i][0]}'s score in a different subject. Track the column heading across with a finger — it is very easy to slip one column.`),
      ],
    });
  }

  if (ask === "row-total") {
    const i = r.int(0, rows.length - 1);
    const total = rows[i].slice(1).reduce((s, v) => s + v, 0);
    return item({
      skill: "Combining several values from one row",
      prompt: `The table shows three test scores for four students.\n\nWhat is ${rows[i][0]}'s total score across all three subjects?`,
      input: num(),
      answer: total,
      visual: { kind: "table", headers: ["Student", ...subjects], rows },
      hints: [`Stay on the row for ${rows[i][0]}.`, `The three scores are ${rows[i].slice(1).join(", ")}.`, "Add all three."],
      solution: [`${rows[i].slice(1).join(" + ")} = ${total}`],
      traps: [
        trap("read-a-column", rows.reduce((s, row) => s + row[1], 0), "You have added a COLUMN instead of a row. A column is one subject across all students; a row is one student across all subjects."),
      ],
    });
  }

  const totals = rows.map((row) => ({ name: row[0], total: row.slice(1).reduce((s, v) => s + v, 0) }));
  const best = [...totals].sort((x, y) => y.total - x.total)[0];

  return item({
    skill: "Answering a comparison question that the table does not answer directly",
    prompt: `The table shows three test scores for four students.\n\nWhich student has the highest TOTAL across the three subjects?`,
    input: choice(who),
    answer: best.name,
    visual: { kind: "table", headers: ["Student", ...subjects], rows },
    hints: [
      "The table does not show totals — you have to work them out.",
      "Add each student's three scores, one row at a time.",
      "Write the four totals down before comparing them.",
    ],
    solution: [
      ...totals.map((t) => `${t.name}: ${t.total}`),
      `Highest total: ${best.name} with ${best.total}.`,
    ],
    traps: [
      trap(
        "highest-single-score",
        rows.reduce((bestRow, row) => (Math.max(...row.slice(1)) > Math.max(...bestRow.slice(1)) ? row : bestRow))[0],
        "You picked the student with the highest single score. The question asks about the TOTAL, and a student can have the top mark in one subject and the lowest total overall."
      ),
    ],
  });
};

export default generators;
