import { item, trap, num, frac, byTier } from "./kit.js";
import { simplify, fracText, gcd } from "../rng.js";

/**
 * GENERATORS · LEVEL 2 · CIRCLES, SCALE AND BEARINGS, STATISTICS, PROBABILITY
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Contains every answer for L2-G3, L2-G4, L2-S1 and L2-S2.
 * ═════════════════════════════════════════════════════════════════════════
 *
 * Circle items say "take π = 22/7" and use radii that are multiples of 7, so
 * the answer is exact. That is how WAEC Paper 1 sets them.
 */

export const generators = {};

const choice = (options) => ({ kind: "choice", options });
const three = (b) => String(((b % 360) + 360) % 360).padStart(3, "0");

/* ── L2-G3.1 · Circumference and area of a circle ───────────────────── */

generators["L2-G3.1"] = (r, tier) => {
  const r7 = 7 * r.int(1, byTier(tier, { build: 3, stretch: 5, exam: 6 }));
  const useDiameter = tier !== "build" && r.chance(0.4);
  const kind = r.pick(byTier(tier, { build: ["circ", "area"], stretch: ["circ", "area", "radius-from-circ"], exam: ["area", "radius-from-area", "radius-from-circ"] }));
  const C = (2 * 22 * r7) / 7;
  const A = (22 * r7 * r7) / 7;
  const given = useDiameter ? `diameter ${2 * r7} cm` : `radius ${r7} cm`;

  if (kind === "circ") {
    return item({
      skill: "Circumference of a circle",
      prompt: `Find the circumference of a circle of ${given}. Take π = 22/7.`,
      input: num({ unit: "cm" }),
      answer: C,
      hints: ["Circumference = 2πr = πd.", useDiameter ? `The radius is half the diameter: ${r7} cm.` : `r = ${r7}`, `2 × 22/7 × ${r7}`],
      solution: [`C = 2πr = 2 × 22/7 × ${r7} = ${C} cm`],
      traps: [trap("used-area", A, "That is the area, πr². Circumference is 2πr."), trap("forgot-two", C / 2, "That is πr. Circumference is 2πr (or π × diameter).")],
    });
  }
  if (kind === "area") {
    return item({
      skill: "Area of a circle",
      prompt: `Find the area of a circle of ${given}. Take π = 22/7.`,
      input: num({ unit: "cm²" }),
      answer: A,
      hints: ["Area = πr².", useDiameter ? `Use the RADIUS: ${2 * r7} ÷ 2 = ${r7} cm.` : `r = ${r7}`, `22/7 × ${r7} × ${r7}`],
      solution: [`A = πr² = 22/7 × ${r7}² = ${A} cm²`],
      traps: [trap("used-circumference", C, "That is the circumference. Area = πr²."), useDiameter ? trap("used-diameter", (22 * 4 * r7 * r7) / 7, "That uses the diameter as the radius. Halve it first.") : trap("2r-not-r2", (22 * 2 * r7) / 7, "r² means r × r, not 2 × r.")],
    });
  }
  if (kind === "radius-from-circ") {
    return item({
      skill: "Finding the radius from the circumference",
      prompt: `A circle has a circumference of ${C} cm. Find its radius. Take π = 22/7.`,
      input: num({ unit: "cm" }),
      answer: r7,
      hints: ["C = 2πr, so r = C ÷ 2π.", `2π = 44/7`, `${C} ÷ 44/7 = ${C} × 7/44`],
      solution: [`r = C ÷ 2π = ${C} × 7/44 = ${r7} cm`],
      traps: [trap("gave-diameter", 2 * r7, "That is the diameter. The radius is half of it.")],
    });
  }
  return item({
    skill: "Finding the radius from the area",
    prompt: `A circle has an area of ${A} cm². Find its radius. Take π = 22/7.`,
    input: num({ unit: "cm" }),
    answer: r7,
    hints: ["A = πr², so r² = A ÷ π.", `${A} × 7/22 = ${r7 * r7}`, `r = √${r7 * r7}`],
    solution: [`r² = ${A} × 7/22 = ${r7 * r7}`, `r = √${r7 * r7} = ${r7} cm`],
    traps: [trap("forgot-root", r7 * r7, "That is r². Take the square root.")],
  });
};

/* ── L2-G3.2 · Area of compound shapes ──────────────────────────────── */

generators["L2-G3.2"] = (r, tier) => {
  const kind = r.pick(byTier(tier, { build: ["rect-semicircle"], stretch: ["rect-semicircle", "ring"], exam: ["ring", "rect-minus-circle", "rect-semicircle"] }));
  const r7 = 7 * r.int(1, 3);
  if (kind === "rect-semicircle") {
    const len = r.int(10, 30);
    const semi = (22 * r7 * r7) / 7 / 2;
    const rect = len * 2 * r7;
    return item({
      skill: "A rectangle with a semicircle on one end",
      prompt: `A shape is a rectangle ${len} cm by ${2 * r7} cm with a semicircle on one of the ${2 * r7} cm sides. Find its total area. Take π = 22/7.`,
      input: num({ unit: "cm²" }),
      answer: rect + semi,
      hints: ["Split the shape into a rectangle and a semicircle.", `The semicircle's diameter is ${2 * r7} cm, so its radius is ${r7} cm.`, `Semicircle = ½ × 22/7 × ${r7}² = ${semi}`],
      solution: [`Rectangle: ${len} × ${2 * r7} = ${rect}`, `Semicircle: ½ × 22/7 × ${r7}² = ${semi}`, `Total: ${rect + semi} cm²`],
      traps: [trap("full-circle", rect + 2 * semi, "That adds a WHOLE circle. It is a semicircle: half."), trap("radius-as-diameter", rect + (22 * 4 * r7 * r7) / 7 / 2, `The radius is half the ${2 * r7} cm side.`)],
    });
  }
  if (kind === "ring") {
    const R = r7 + 7;
    const area = (22 * (R * R - r7 * r7)) / 7;
    return item({
      skill: "The area of a ring between two circles",
      prompt: `A circular path runs round a pond. The pond has radius ${r7} m and the outer edge of the path has radius ${R} m. Find the area of the path. Take π = 22/7.`,
      input: num({ unit: "m²" }),
      answer: area,
      hints: ["Path = big circle − small circle.", `22/7 × ${R}² − 22/7 × ${r7}²`, `= 22/7 × (${R * R} − ${r7 * r7})`],
      solution: [`22/7 × ${R * R} − 22/7 × ${r7 * r7} = 22/7 × ${R * R - r7 * r7} = ${area} m²`],
      traps: [trap("subtracted-radii", (22 * 49) / 7, "You cannot subtract the radii and square the difference. Subtract the two AREAS.")],
    });
  }
  const side = 2 * r7 + r.int(2, 6) * 2;
  const area = side * side - (22 * r7 * r7) / 7;
  return item({
    skill: "A square with a circle cut out",
    prompt: `A circle of radius ${r7} cm is cut from a square sheet of side ${side} cm. What area of the sheet is left? Take π = 22/7.`,
    input: num({ unit: "cm²" }),
    answer: area,
    hints: ["Left = square − circle.", `Square: ${side}² = ${side * side}`, `Circle: 22/7 × ${r7}² = ${(22 * r7 * r7) / 7}`],
    solution: [`${side * side} − ${(22 * r7 * r7) / 7} = ${area} cm²`],
    traps: [trap("added", side * side + (22 * r7 * r7) / 7, "The circle is CUT OUT: subtract its area.")],
  });
};

/* ── L2-G3.3 · Volume of prisms and cylinders ───────────────────────── */

generators["L2-G3.3"] = (r, tier) => {
  if (tier === "build" || r.chance(0.5)) {
    const b = r.int(3, 12);
    const h = r.int(2, 10) * 2;
    const len = r.int(5, 20);
    const area = (b * h) / 2;
    return item({
      skill: "Volume of a triangular prism",
      prompt: `A triangular prism has a triangular cross-section with base ${b} cm and height ${h} cm. The prism is ${len} cm long. Find its volume.`,
      input: num({ unit: "cm³" }),
      answer: area * len,
      hints: ["Volume of a prism = area of cross-section × length.", `Triangle: ½ × ${b} × ${h} = ${area} cm²`, `${area} × ${len}`],
      solution: [`Cross-section: ½ × ${b} × ${h} = ${area} cm²`, `V = ${area} × ${len} = ${area * len} cm³`],
      traps: [trap("forgot-half", b * h * len, "The cross-section is a triangle: ½ × base × height.")],
    });
  }
  const r7 = 7 * r.int(1, 3);
  const h = r.int(3, 15);
  const V = (22 * r7 * r7 * h) / 7;
  return item({
    skill: "Volume of a cylinder",
    prompt: `Find the volume of a cylinder of radius ${r7} cm and height ${h} cm. Take π = 22/7.`,
    input: num({ unit: "cm³" }),
    answer: V,
    hints: ["A cylinder is a prism with a circular cross-section: V = πr²h.", `Circle: 22/7 × ${r7}² = ${(22 * r7 * r7) / 7}`, `× ${h}`],
    solution: [`V = πr²h = 22/7 × ${r7}² × ${h} = ${V} cm³`],
    traps: [trap("2r-not-r2", (22 * 2 * r7 * h) / 7, "r² means r × r, not 2r.")],
  });
};

/* ── L2-G4 · Scale and bearings ─────────────────────────────────────── */

generators["L2-G4.1"] = (r, tier) => {
  const scale = r.pick(byTier(tier, { build: [100, 1000, 50000], stretch: [25000, 50000, 200000], exam: [25000, 250000, 500000] }));
  const cm = r.int(2, 12) + (tier === "build" ? 0 : r.pick([0, 0.5]));
  const realCm = cm * scale;
  const toKm = realCm >= 100000;
  const answer = toKm ? realCm / 100000 : realCm / 100;
  if (r.chance(0.5)) {
    return item({
      skill: "From a scale drawing to real distance",
      prompt: `A map has a scale of 1 : ${scale.toLocaleString("en-US")}. Two towns are ${cm} cm apart on the map. How far apart are they really, in ${toKm ? "km" : "m"}?`,
      input: num({ unit: toKm ? "km" : "m" }),
      answer,
      hints: [`1 cm on the map is ${scale.toLocaleString("en-US")} cm in real life.`, `${cm} × ${scale.toLocaleString("en-US")} = ${realCm.toLocaleString("en-US")} cm`, toKm ? "1 km = 100 000 cm." : "1 m = 100 cm."],
      solution: [`${cm} × ${scale} = ${realCm} cm`, `${realCm} cm = ${answer} ${toKm ? "km" : "m"}`],
      traps: [trap("not-converted", realCm, `That is in centimetres. Convert to ${toKm ? "km (÷ 100 000)" : "m (÷ 100)"}.`)],
    });
  }
  return item({
    skill: "From a real distance to a scale drawing",
    prompt: `A map has a scale of 1 : ${scale.toLocaleString("en-US")}. A road is ${answer} ${toKm ? "km" : "m"} long. How long is it on the map, in cm?`,
    input: num({ unit: "cm" }),
    answer: cm,
    hints: [`Change ${answer} ${toKm ? "km" : "m"} to cm first.`, `${answer} ${toKm ? "km" : "m"} = ${realCm.toLocaleString("en-US")} cm`, `Divide by ${scale.toLocaleString("en-US")}.`],
    solution: [`${answer} ${toKm ? "km" : "m"} = ${realCm} cm`, `${realCm} ÷ ${scale} = ${cm} cm`],
    traps: [trap("multiplied", answer * scale, "To go from real life to the map, DIVIDE by the scale.")],
  });
};

generators["L2-G4.2"] = (r, tier) => {
  const kind = r.pick(byTier(tier, { build: ["compass-to-three"], stretch: ["compass-to-three", "back"], exam: ["back", "three-to-compass", "compass-to-three"] }));
  if (kind === "back") {
    const b = r.int(10, 350);
    const back = (b + 180) % 360;
    return item({
      skill: "Back bearings",
      prompt: `The bearing of B from A is ${three(b)}°. Find the bearing of A from B.`,
      input: num({ unit: "°", placeholder: "e.g. 245" }),
      answer: back,
      hints: ["The bearing back is the opposite direction: add or subtract 180°.", b < 180 ? "Since the bearing is less than 180°, ADD 180°." : "Since the bearing is more than 180°, SUBTRACT 180°.", `${b} ${b < 180 ? "+" : "−"} 180`],
      solution: [`${b} ${b < 180 ? "+" : "−"} 180 = ${back}`, `Bearing of A from B = ${three(back)}°`],
      traps: [trap("same-bearing", b, "Going back the other way is the opposite direction, 180° round."), trap("from-360", 360 - b, "Back bearings differ by 180°, not 'take from 360'.")],
    });
  }
  const angle = r.int(5, 85);
  const [ns, ew] = [r.pick(["N", "S"]), r.pick(["E", "W"])];
  const bearing = ns === "N" ? (ew === "E" ? angle : 360 - angle) : ew === "E" ? 180 - angle : 180 + angle;
  if (kind === "three-to-compass") {
    return item({
      skill: "Three-figure bearing to compass bearing",
      prompt: `Write the bearing ${three(bearing)}° as a compass bearing, like N40°E.`,
      input: { kind: "text", placeholder: "e.g. S35°W" },
      answer: `${ns}${angle}°${ew}`,
      accept: [`${ns}${angle}${ew}`, `${ns} ${angle}° ${ew}`, `${ns}${angle} ${ew}`, `${ns} ${angle} ${ew}`],
      hints: ["Compass bearings are measured from North or South, towards East or West.", bearing <= 90 ? "Between 000° and 090°: N...E." : bearing <= 180 ? "Between 090° and 180°: S...E, angle = 180 − bearing." : bearing <= 270 ? "Between 180° and 270°: S...W, angle = bearing − 180." : "Between 270° and 360°: N...W, angle = 360 − bearing.", `The angle is ${angle}°.`],
      solution: [`${three(bearing)}° = ${ns}${angle}°${ew}`],
      traps: [],
    });
  }
  return item({
    skill: "Compass bearing to three-figure bearing",
    prompt: `Write the compass bearing ${ns}${angle}°${ew} as a three-figure bearing.`,
    input: num({ unit: "°", placeholder: "e.g. 215" }),
    answer: bearing,
    hints: ["Three-figure bearings are measured CLOCKWISE from North.", `${ns}${angle}°${ew}: start facing ${ns === "N" ? "North" : "South"} and turn ${angle}° towards ${ew === "E" ? "East" : "West"}.`, ns === "N" ? (ew === "E" ? `= ${angle}°` : `= 360 − ${angle}`) : ew === "E" ? `= 180 − ${angle}` : `= 180 + ${angle}`],
    solution: [`${ns}${angle}°${ew} = ${three(bearing)}°`],
    traps: [trap("wrong-quadrant", angle, `${angle}° is only right for N${angle}°E. Measure clockwise from North all the way round.`)],
  });
};

generators["L2-G4.3"] = (r, tier) => {
  const b1 = r.int(20, 160);
  const turn = r.int(30, 120);
  const b2 = (b1 + turn) % 360;
  if (tier === "build" || r.chance(0.5)) {
    return item({
      skill: "The angle between two bearings",
      prompt: `From a port, ship P sails on a bearing of ${three(b1)}° and ship Q on a bearing of ${three(b2)}°. What is the angle between their paths?`,
      input: num({ unit: "°" }),
      answer: turn,
      hints: ["Both bearings are measured clockwise from the same North line.", "The angle between the paths is the difference between the bearings.", `${b2} − ${b1}`],
      solution: [`${three(b2)}° − ${three(b1)}° = ${turn}°`],
      traps: [trap("added", b1 + b2, "Subtract the bearings to find the angle between them.")],
    });
  }
  // angle inside the triangle at the turning point: bearing out then back
  const inside = (180 - turn + 360) % 360;
  return item({
    skill: "An angle inside a bearings diagram",
    prompt: `A boat sails from A to B on a bearing of ${three(b1)}°, then turns and sails from B to C on a bearing of ${three(b2)}°. Find angle ABC, the angle at B between BA and BC.`,
    input: num({ unit: "°" }),
    answer: inside,
    hints: ["Draw a North line at B.", `The bearing of A from B is the back bearing: ${three((b1 + 180) % 360)}°.`, `Angle ABC = the difference between ${three((b1 + 180) % 360)}° and ${three(b2)}°.`],
    solution: [`Back bearing of A from B: ${three((b1 + 180) % 360)}°`, `Angle ABC = ${Math.abs(((b1 + 180) % 360) - b2)}°${Math.abs(((b1 + 180) % 360) - b2) > 180 ? ` → the reflex way round, so 360 − that = ${inside}°` : ""}`],
    traps: [trap("used-turn", turn, "That is how far the boat turned, not the angle inside the triangle at B. Use the back bearing of A from B.")],
  });
};

/* ── L2-S1 · Grouped data, pie charts, mean from a frequency table ──── */

generators["L2-S1.1"] = (r, tier) => {
  const width = r.pick([5, 10, 10, 20]);
  const lo = r.int(1, 8) * width;
  const hi = lo + width - 1;
  const ask = r.pick(byTier(tier, { build: ["midpoint", "width"], stretch: ["midpoint", "lower-boundary", "width"], exam: ["upper-boundary", "lower-boundary", "midpoint"] }));
  const spec = {
    midpoint: { q: `What is the class mark (midpoint) of the class ${lo} – ${hi}?`, a: (lo + hi) / 2, s: [`(${lo} + ${hi}) ÷ 2 = ${(lo + hi) / 2}`], t: [trap("lower-plus-half-width", lo + width / 2, `Use (lower + upper) ÷ 2 with the class limits: (${lo} + ${hi}) ÷ 2.`)] },
    width: { q: `What is the width of the class ${lo} – ${hi}?`, a: width, s: [`Boundaries ${lo - 0.5} and ${hi + 0.5}`, `Width = ${hi + 0.5} − ${lo - 0.5} = ${width}`], t: [trap("limits-difference", hi - lo, `${hi} − ${lo} = ${hi - lo}, but the class runs from ${lo - 0.5} to ${hi + 0.5}: width ${width}.`)] },
    "lower-boundary": { q: `What is the lower class boundary of the class ${lo} – ${hi}?`, a: lo - 0.5, s: [`Boundaries sit halfway between classes: ${lo} − 0.5 = ${lo - 0.5}`], t: [trap("gave-limit", lo, `${lo} is the lower class LIMIT. The boundary is halfway to the class below: ${lo - 0.5}.`)] },
    "upper-boundary": { q: `What is the upper class boundary of the class ${lo} – ${hi}?`, a: hi + 0.5, s: [`${hi} + 0.5 = ${hi + 0.5}`], t: [trap("gave-limit", hi, `${hi} is the upper class LIMIT. The boundary is ${hi + 0.5}.`)] },
  }[ask];
  return item({
    skill: "Class marks, boundaries and widths",
    prompt: spec.q,
    input: num(),
    answer: spec.a,
    hints: ["Class limits are the numbers written; class boundaries lie halfway between one class and the next.", `For whole-number data, ${lo} – ${hi} has boundaries ${lo - 0.5} and ${hi + 0.5}.`, spec.s[0]],
    solution: spec.s,
    traps: spec.t,
  });
};

generators["L2-S1.2"] = (r, tier) => {
  const total = r.pick([36, 40, 60, 72, 90, 120, 180]);
  const freq = r.pick([...Array(Math.floor(total / 4)).keys()].map((k) => k + 1).filter((f) => (f * 360) % total === 0 && f < total / 2));
  const angle = (freq * 360) / total;
  if (r.chance(0.5)) {
    return item({
      skill: "Finding a sector angle for a pie chart",
      prompt: `In a survey of ${total} people, ${freq} chose rice. What angle should the rice sector have on a pie chart?`,
      input: num({ unit: "°" }),
      answer: angle,
      hints: ["A whole pie chart is 360°.", `Rice is ${freq} out of ${total}.`, `${freq}/${total} × 360`],
      solution: [`${freq}/${total} × 360 = ${angle}°`],
      traps: [trap("percent-not-degrees", Math.round((freq / total) * 10000) / 100, "That is a percentage. A pie chart angle is a fraction of 360°.")],
    });
  }
  return item({
    skill: "Reading a frequency from a pie chart",
    prompt: `A pie chart shows how ${total} students travel to school. The sector for 'walk' has an angle of ${angle}°. How many students walk?`,
    input: num(),
    answer: freq,
    hints: [`360° stands for all ${total} students.`, `So 1° stands for ${total}/360 of a student.`, `${angle}/360 × ${total}`],
    solution: [`${angle}/360 × ${total} = ${freq}`],
    traps: [trap("gave-angle", angle, "That is the angle. Turn it into a number of students: angle ÷ 360 × total.")],
  });
};

generators["L2-S1.3"] = (r, tier) => {
  const xs = byTier(tier, { build: [1, 2, 3, 4, 5], stretch: [10, 11, 12, 13, 14, 15], exam: [0, 1, 2, 3, 4, 5] });
  let fs;
  let sumF;
  let sumFx;
  do {
    fs = xs.map(() => r.int(1, 9));
    sumF = fs.reduce((a, b) => a + b, 0);
    sumFx = xs.reduce((s, x, i) => s + x * fs[i], 0);
  } while (!Number.isInteger((sumFx / sumF) * 100));
  const mean = Math.round((sumFx / sumF) * 100) / 100;
  return item({
    skill: "The mean from a frequency table",
    prompt: `Find the mean of this distribution. Give your answer to 2 decimal places if needed.\n\nx:   ${xs.join("   ")}\nf:   ${fs.join("   ")}`,
    input: num(),
    answer: mean,
    tolerance: 0.005,
    hints: ["Multiply each value by its frequency: fx.", `Σfx = ${xs.map((x, i) => `${x}×${fs[i]}`).join(" + ")} = ${sumFx}`, `Mean = Σfx ÷ Σf = ${sumFx} ÷ ${sumF}`],
    solution: [`Σfx = ${sumFx}`, `Σf = ${sumF}`, `Mean = ${sumFx} ÷ ${sumF} = ${mean}`],
    traps: [trap("divided-by-classes", Math.round((sumFx / xs.length) * 100) / 100, `Divide by the total FREQUENCY, ${sumF}, not by the number of different values.`), trap("mean-of-x", (xs[0] + xs[xs.length - 1]) / 2, "That ignores the frequencies. Each value counts as many times as its frequency.")],
  });
};

/* ── L2-S2 · Probability 1 ──────────────────────────────────────────── */

generators["L2-S2.1"] = (r, tier) => {
  const [desc, total, eventDesc, count] = r.pick(
    byTier(tier, {
      build: [["two coins are tossed", 4, "the number of possible outcomes", 4], ["a coin is tossed and a die is thrown", 12, "the number of possible outcomes", 12], ["three coins are tossed", 8, "the number of possible outcomes", 8]],
      stretch: [["two dice are thrown", 36, "the number of outcomes with a total of 7", 6], ["two coins are tossed", 4, "the number of outcomes with exactly one head", 2], ["two dice are thrown", 36, "the number of outcomes with a total of 10", 3]],
      exam: [["two dice are thrown", 36, "the number of outcomes where both dice show the same number", 6], ["three coins are tossed", 8, "the number of outcomes with at least two heads", 4], ["two dice are thrown", 36, "the number of outcomes with a total of more than 9", 6]],
    })
  );
  return item({
    skill: "Counting outcomes in a sample space",
    prompt: `When ${desc}, what is ${eventDesc}?`,
    input: num(),
    answer: count,
    hints: ["List the SAMPLE SPACE: every possible outcome.", "For two dice, draw a 6 × 6 grid of totals. For coins, list HH, HT, TH, TT, ...", `There are ${total} outcomes in all. Count the ones that fit.`],
    solution: [`Sample space: ${total} outcomes.`, `Outcomes that fit: ${count}.`],
    traps: [trap("forgot-order", count === 2 ? 1 : count - 1, "HT and TH are different outcomes, and so are (3, 4) and (4, 3). Count both.")],
  });
};

generators["L2-S2.2"] = (r, tier) => {
  const trials = r.pick([50, 80, 100, 120, 200, 250]);
  const hits = r.int(Math.round(trials * 0.1), Math.round(trials * 0.6));
  const [a, b] = simplify(hits, trials);
  if (tier === "build" || r.chance(0.5)) {
    return item({
      skill: "Experimental probability (relative frequency)",
      prompt: `A drawing pin is dropped ${trials} times and lands point-up ${hits} times. What is the experimental probability of landing point-up? Give a fraction in its lowest terms.`,
      input: frac(),
      answer: fracText(a, b),
      exact: "lowest-terms",
      hints: ["Experimental probability = number of times it happened ÷ number of trials.", `${hits}/${trials}`, `Simplify: divide by ${gcd(hits, trials)}.`],
      solution: [`${hits}/${trials} = ${fracText(a, b)}`],
      traps: [trap("upside-down", fracText(b, a), "Successes go on top, trials on the bottom.")],
    });
  }
  const more = r.pick([300, 500, 600, 1000]);
  const expected = (hits / trials) * more;
  if (!Number.isInteger(expected)) return generators["L2-S2.2"](r, "build");
  return item({
    skill: "Expected frequency from an experiment",
    prompt: `A drawing pin landed point-up ${hits} times in ${trials} drops. How many times would you expect it to land point-up in ${more} drops?`,
    input: num(),
    answer: expected,
    hints: [`Probability ≈ ${hits}/${trials}.`, "Expected number = probability × number of trials.", `${hits}/${trials} × ${more}`],
    solution: [`${hits}/${trials} × ${more} = ${expected}`],
    traps: [trap("added", hits + more, "Multiply the probability by the number of trials.")],
  });
};

generators["L2-S2.3"] = (r, tier) => {
  const red = r.int(2, 9);
  const blue = r.int(2, 9);
  const green = r.int(1, 7);
  const total = red + blue + green;
  const ask = r.pick(byTier(tier, { build: ["red", "blue"], stretch: ["not-red", "red-or-green"], exam: ["not-blue", "red-or-green", "yellow"] }));
  const spec = {
    red: [red, "red"],
    blue: [blue, "blue"],
    "not-red": [total - red, "not red"],
    "not-blue": [total - blue, "not blue"],
    "red-or-green": [red + green, "red or green"],
    yellow: [0, "yellow"],
  }[ask];
  const [n, d] = spec[0] === 0 ? [0, 1] : simplify(spec[0], total);
  return item({
    skill: "Theoretical probability",
    prompt: `A bag holds ${red} red, ${blue} blue and ${green} green balls. One ball is picked at random. What is the probability that it is ${spec[1]}? Give a fraction in its lowest terms.`,
    input: frac(),
    answer: fracText(n, d),
    exact: spec[0] === 0 ? undefined : "lowest-terms",
    hints: ["P(event) = number of favourable outcomes ÷ total number of outcomes.", `Total balls: ${total}.`, ask.startsWith("not") ? "P(not A) = 1 − P(A)." : ask === "yellow" ? "There are no yellow balls: it is impossible." : `Favourable: ${spec[0]}.`],
    solution: [`Favourable: ${spec[0]}. Total: ${total}.`, `P = ${spec[0]}/${total}${spec[0] && fracText(n, d) !== `${spec[0]}/${total}` ? ` = ${fracText(n, d)}` : ""}`],
    traps: [spec[0] ? trap("over-other-colours", fracText(...simplify(spec[0], total - spec[0] || 1)), "Divide by the TOTAL number of balls, not by the number of the other colours.") : trap("impossible-not-zero", `1/${total}`, "An impossible event has probability 0.")],
  });
};

export default generators;
