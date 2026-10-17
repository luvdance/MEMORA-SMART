import { item, trap, num, list, choice, byTier } from "./kit.js";
import { sn } from "./format.js";

/**
 * GENERATORS · LEVEL 6 · VECTORS, TRANSFORMATIONS, THE EARTH AS A SPHERE
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Contains every answer for L6-G1, L6-G2 and L6-G3.
 * ═════════════════════════════════════════════════════════════════════════
 *
 * A column vector is typed like a coordinate pair, (x, y), with x on top.
 * Earth items use R = 6400 km and π = 22/7, as WAEC does.
 */

export const generators = {};

const r1 = (x) => Math.round(x * 10) / 10;
const deg = (x) => (x * 180) / Math.PI;
const rad = (d) => (d * Math.PI) / 180;
const coords = (placeholder = "e.g. (3, −1)") => ({ kind: "coordinates", placeholder });
const pt = (x, y) => `(${x}, ${y})`;
const show = (x, y) => `(${sn(x)}, ${sn(y)})`;
const vec = (x, y) => `(${sn(x)} ; ${sn(y)})`;
const TRIPLES = [[3, 4, 5], [5, 12, 13], [6, 8, 10], [8, 15, 17], [4, 3, 5], [12, 5, 13]];

/* ── L6-G1 · Vectors ────────────────────────────────────────────────── */

generators["L6-G1.1"] = (r, tier) => {
  const [x1, y1, x2, y2] = [r.int(-6, 6), r.int(-6, 6), r.int(-6, 6), r.int(-6, 6)];
  return item({
    skill: "A vector between two points",
    prompt: `A is ${show(x1, y1)} and B is ${show(x2, y2)}. Write the column vector AB as (x, y), top number first.`,
    input: coords(),
    answer: pt(x2 - x1, y2 - y1),
    hints: ["AB = B − A: how far across and how far up to get FROM A TO B.", `Across: ${sn(x2)} − ${sn(x1)}`, `Up: ${sn(y2)} − ${sn(y1)}`],
    solution: [`AB = ${vec(x2 - x1, y2 - y1)}`],
    traps: [trap("backwards", pt(x1 - x2, y1 - y2), "That is BA. AB goes from A to B: B − A."), trap("added", pt(x1 + x2, y1 + y2), "Subtract the coordinates, B − A; do not add them.")],
  });
};

generators["L6-G1.2"] = (r, tier) => {
  const [a, b, m] = r.pick(TRIPLES);
  const sx = r.pick([1, -1]);
  const sy = r.pick([1, -1]);
  if (tier !== "exam" || r.chance(0.4)) {
    return item({
      skill: "The magnitude of a vector",
      prompt: `Find the magnitude of the vector ${vec(sx * a, sy * b)}.`,
      input: num(),
      answer: m,
      hints: ["|v| = √(x² + y²): Pythagoras on the components.", `(${sn(sx * a)})² + (${sn(sy * b)})² = ${a * a + b * b}`, `√${a * a + b * b}`],
      solution: [`|v| = √(${a * a} + ${b * b}) = ${m}`],
      traps: [trap("added", Math.abs(sx * a + sy * b), "Square the components, add, then square-root."), trap("no-root", m * m, "That is |v|². Take the square root.")],
    });
  }
  const x = r.int(1, 9) * sx;
  const y = r.int(1, 9) * sy;
  const bearing = r1((deg(Math.atan2(x, y)) + 360) % 360);
  return item({
    skill: "The direction of a vector as a bearing",
    prompt: `A displacement is ${vec(x, y)} km, with x east and y north. Find its bearing, to 1 decimal place.`,
    input: num({ unit: "°" }),
    answer: bearing,
    tolerance: 0.06,
    hints: ["Sketch it: x is east, y is north. Bearings are measured clockwise from north.", `The acute angle from the north–south line is tan⁻¹(${Math.abs(x)}/${Math.abs(y)}) = ${r1(deg(Math.atan(Math.abs(x) / Math.abs(y))))}°.`, "Use the quadrant to turn it into a three-figure bearing."],
    solution: [`Acute angle ${r1(deg(Math.atan(Math.abs(x) / Math.abs(y))))}°`, `Bearing ${bearing}°`],
    traps: [trap("from-east", r1(deg(Math.atan(Math.abs(y) / Math.abs(x)))), "That angle is measured from the east–west line. Bearings start from NORTH.")],
  });
};

generators["L6-G1.3"] = (r, tier) => {
  const a = [r.int(-5, 6), r.int(-5, 6)];
  const b = [r.int(-5, 6), r.int(-5, 6)];
  const p = byTier(tier, { build: 1, stretch: r.int(2, 3), exam: r.int(2, 4) });
  const q = byTier(tier, { build: r.pick([1, -1]), stretch: r.pick([1, -1, -2]), exam: r.pick([-2, -3, 2, 3]) });
  const res = [p * a[0] + q * b[0], p * a[1] + q * b[1]];
  const label = `${p === 1 ? "" : p}a ${q < 0 ? "−" : "+"} ${Math.abs(q) === 1 ? "" : Math.abs(q)}b`;
  return item({
    skill: "Combining vectors",
    prompt: `a = ${vec(...a)} and b = ${vec(...b)}. Find ${label}, as (x, y).`,
    input: coords(),
    answer: pt(...res),
    hints: ["Multiply each component by its scalar, then add the matching components.", `${p}a = ${vec(p * a[0], p * a[1])}, ${q}b = ${vec(q * b[0], q * b[1])}`, "Add top with top, bottom with bottom."],
    solution: [`${label} = ${vec(...res)}`],
    traps: [trap("sign-slip", pt(p * a[0] - q * b[0], p * a[1] - q * b[1]), "Watch the sign in front of b.")],
  });
};

generators["L6-G1.4"] = (r, tier) => {
  const A = [r.int(-6, 6), r.int(-6, 6)];
  const m = byTier(tier, { build: 1, stretch: r.int(1, 2), exam: r.int(1, 3) });
  const n = byTier(tier, { build: 1, stretch: r.int(1, 3), exam: r.int(1, 3) });
  const k = m + n;
  const B = [A[0] + k * r.intExcept(-3, 3, [0]), A[1] + k * r.int(-3, 3)];
  const P = [A[0] + (m * (B[0] - A[0])) / k, A[1] + (m * (B[1] - A[1])) / k];
  const mid = m === n;
  return item({
    skill: mid ? "The position vector of a midpoint" : "Dividing a line in a ratio",
    prompt: mid
      ? `A and B have position vectors ${vec(...A)} and ${vec(...B)}. Find the position vector of the midpoint of AB, as (x, y).`
      : `A and B have position vectors ${vec(...A)} and ${vec(...B)}. P lies on AB with AP : PB = ${m} : ${n}. Find the position vector of P, as (x, y).`,
    input: coords(),
    answer: pt(...P),
    hints: ["OP = OA + AP: start at A and go part of the way to B.", `AB = ${vec(B[0] - A[0], B[1] - A[1])}`, `AP = ${m}/${k} of AB`],
    solution: [`AB = ${vec(B[0] - A[0], B[1] - A[1])}`, `AP = ${m}/${k} AB = ${vec(P[0] - A[0], P[1] - A[1])}`, `OP = ${vec(...P)}`],
    traps: [trap("forgot-OA", pt(P[0] - A[0], P[1] - A[1]), "That is AP. Add OA to get the POSITION vector of P."), mid ? trap("no-half", pt(A[0] + B[0], A[1] + B[1]), "Halve the sum: OM = ½(a + b).") : trap("wrong-part", pt(A[0] + (n * (B[0] - A[0])) / k, A[1] + (n * (B[1] - A[1])) / k), `AP is ${m} parts of ${k}, measured from A.`)],
  });
};

/* ── L6-G2 · Transformations ────────────────────────────────────────── */

const REFLECT = [
  { name: "the x-axis", f: (x, y) => [x, -y], hint: "In the x-axis, x stays and y changes sign." },
  { name: "the y-axis", f: (x, y) => [-x, y], hint: "In the y-axis, y stays and x changes sign." },
  { name: "the line y = x", f: (x, y) => [y, x], hint: "In y = x, the coordinates swap." },
  { name: "the line y = −x", f: (x, y) => [-y, -x], hint: "In y = −x, swap the coordinates and change both signs." },
];

generators["L6-G2.1"] = (r, tier) => {
  const x = r.intExcept(-7, 7, [0]);
  const y = r.intExcept(-7, 7, [0, x, -x]);
  let mirror;
  if (tier === "exam" && r.chance(0.6)) {
    const k = r.intExcept(-4, 4, [0]);
    mirror = r.chance(0.5)
      ? { name: `the line x = ${sn(k)}`, f: (a, b) => [2 * k - a, b], hint: `Distance from x = ${sn(k)} is ${Math.abs(x - k)}; go the same distance the other side.` }
      : { name: `the line y = ${sn(k)}`, f: (a, b) => [a, 2 * k - b], hint: `Distance from y = ${sn(k)} is ${Math.abs(y - k)}; go the same distance the other side.` };
  } else mirror = r.pick(byTier(tier, { build: REFLECT.slice(0, 2), stretch: REFLECT, exam: REFLECT.slice(2) }));
  const img = mirror.f(x, y);
  return item({
    skill: "Reflection",
    prompt: `Find the image of P${show(x, y)} after a reflection in ${mirror.name}.`,
    input: coords(),
    answer: pt(...img),
    hints: ["The mirror line is the perpendicular bisector of P and its image.", mirror.hint, "Check: the image is the same distance from the line as P."],
    solution: [`P' = ${show(...img)}`],
    traps: [trap("wrong-axis", pt(-img[0], -img[1]), "That reflects in the other line. Check which coordinate the mirror leaves alone.")],
  });
};

generators["L6-G2.2"] = (r, tier) => {
  const x = r.intExcept(-6, 6, [0]);
  const y = r.intExcept(-6, 6, [0]);
  const turn = r.pick(byTier(tier, { build: ["90a", "180"], stretch: ["90a", "90c", "180"], exam: ["90a", "90c", "180"] }));
  const [a, b] = tier === "exam" ? [r.int(-3, 3), r.int(-3, 3)] : [0, 0];
  const dx = x - a;
  const dy = y - b;
  const rot = { "90a": [-dy, dx], "90c": [dy, -dx], 180: [-dx, -dy] }[turn];
  const img = [a + rot[0], b + rot[1]];
  const wrong = { "90a": [dy, -dx], "90c": [-dy, dx], 180: [dx, -dy] }[turn];
  const words = { "90a": "90° anticlockwise", "90c": "90° clockwise", 180: "180°" }[turn];
  const centre = a === 0 && b === 0 ? "the origin" : show(a, b);
  return item({
    skill: "Rotation",
    prompt: `P${show(x, y)} is rotated ${words} about ${centre}. Find its image.`,
    input: coords(),
    answer: pt(...img),
    hints: [centre === "the origin" ? "Rules about O: 90° anticlockwise (x, y) → (−y, x); 90° clockwise (x, y) → (y, −x); 180° (x, y) → (−x, −y)." : `Move the centre to the origin: P relative to the centre is ${show(dx, dy)}.`, centre === "the origin" ? "Apply the rule for this turn." : "Rotate that about the origin using the rules.", centre === "the origin" ? "Check with a sketch: which quadrant should the image be in?" : `Add the centre ${show(a, b)} back on.`],
    solution: [centre === "the origin" ? `P' = ${show(...img)}` : `Relative: ${show(dx, dy)} → ${show(...rot)}`, centre === "the origin" ? null : `P' = ${show(...img)}`].filter(Boolean),
    traps: [trap("wrong-direction", pt(a + wrong[0], b + wrong[1]), "That turns the other way. Anticlockwise is the opposite direction to a clock's hands.")],
  });
};

generators["L6-G2.3"] = (r, tier) => {
  const x = r.int(-5, 6);
  const y = r.int(-5, 6);
  if (tier === "build" && r.chance(0.5)) {
    const t = [r.intExcept(-6, 6, [0]), r.intExcept(-6, 6, [0])];
    return item({
      skill: "Translation",
      prompt: `P${show(x, y)} is translated by the vector ${vec(...t)}. Find its image.`,
      input: coords(),
      answer: pt(x + t[0], y + t[1]),
      hints: ["A translation adds the vector: top number to x, bottom to y.", `${sn(x)} + ${sn(t[0])}`, `${sn(y)} + ${sn(t[1])}`],
      solution: [`P' = ${show(x + t[0], y + t[1])}`],
      traps: [trap("subtracted", pt(x - t[0], y - t[1]), "Add the vector; do not subtract it.")],
    });
  }
  const k = r.pick(byTier(tier, { build: [2, 3], stretch: [2, 3, -1, -2], exam: [-2, -3, 2, 3, -0.5] }));
  const [a, b] = tier === "build" ? [0, 0] : [r.int(-3, 3), r.int(-3, 3)];
  const img = [a + k * (x - a), b + k * (y - b)];
  const centre = a === 0 && b === 0 ? "the origin" : show(a, b);
  return item({
    skill: "Enlargement",
    prompt: `P${show(x, y)} is enlarged by scale factor ${sn(k)} from centre ${centre}. Find its image.`,
    input: coords(),
    answer: pt(...img),
    hints: ["Image = centre + k × (P − centre).", `P − centre = ${show(x - a, y - b)}`, `× ${sn(k)} = ${show(k * (x - a), k * (y - b))}, then add the centre.`],
    solution: [`P' = ${show(a, b)} + ${sn(k)} × ${show(x - a, y - b)} = ${show(...img)}`],
    traps: centre === "the origin" ? [] : [trap("from-origin", pt(k * x, k * y), "That enlarges from the origin. Measure from the given centre.")],
  });
};

generators["L6-G2.4"] = (r, tier) => {
  const x = r.intExcept(1, 6, []);
  const y = r.intExcept(1, 6, [x]);
  const kind = r.pick(byTier(tier, { build: ["translation", "scale"], stretch: ["scale", "which"], exam: ["which", "scale"] }));
  if (kind === "translation") {
    const t = [r.intExcept(-5, 5, [0]), r.intExcept(-5, 5, [0])];
    return item({
      skill: "Describing a translation",
      prompt: `A translation maps ${show(x, y)} to ${show(x + t[0], y + t[1])}. Give the translation vector as (x, y).`,
      input: coords(),
      answer: pt(...t),
      hints: ["The vector is image − object.", `${sn(x + t[0])} − ${x}`, `${sn(y + t[1])} − ${y}`],
      solution: [`Vector ${vec(...t)}`],
      traps: [trap("backwards", pt(-t[0], -t[1]), "Image minus object, not object minus image.")],
    });
  }
  if (kind === "scale") {
    const k = r.pick([2, 3, -2, -3, -1]);
    return item({
      skill: "Finding the scale factor",
      prompt: `An enlargement with centre the origin maps ${show(x, y)} to ${show(k * x, k * y)}. Find the scale factor.`,
      input: num(),
      answer: k,
      hints: ["From the centre, every distance is multiplied by k.", `${sn(k * x)} ÷ ${x}`, "A negative k puts the image on the other side of the centre."],
      solution: [`k = ${sn(k * x)} ÷ ${x} = ${sn(k)}`],
      traps: k < 0 ? [trap("dropped-sign", -k, "The image is on the OTHER side of the centre, so the scale factor is negative.")] : [],
    });
  }
  const cases = [
    { img: [y, x], ans: "reflection in y = x" },
    { img: [-y, x], ans: "rotation 90° anticlockwise about O" },
    { img: [y, -x], ans: "rotation 90° clockwise about O" },
    { img: [-x, -y], ans: "rotation 180° about O" },
    { img: [x, -y], ans: "reflection in the x-axis" },
    { img: [-x, y], ans: "reflection in the y-axis" },
  ];
  const c = r.pick(cases);
  const options = [c.ans, ...r.shuffle(cases.filter((d) => d !== c).map((d) => d.ans)).slice(0, 3)];
  return item({
    skill: "Naming the transformation",
    prompt: `A single transformation maps ${show(x, y)} to ${show(...c.img)}, and every other point in the same pattern. Which transformation is it?`,
    input: choice(r.shuffle(options)),
    answer: c.ans,
    hints: ["Compare the coordinates: did they swap? Did any sign change?", "Swap only → y = x. One sign change → reflection in an axis. Swap and one sign change → a quarter turn. Both signs change → a half turn.", "Test your choice on the point."],
    solution: [`${show(x, y)} → ${show(...c.img)}: ${c.ans}`],
    traps: [],
  });
};

/* ── L6-G3 · The Earth as a sphere ──────────────────────────────────── */

const ns = (lat) => `${Math.abs(lat)}°${lat >= 0 ? "N" : "S"}`;
const ew = (lng) => `${Math.abs(lng)}°${lng >= 0 ? "E" : "W"}`;
const R = 6400;

generators["L6-G3.1"] = (r, tier) => {
  const lat = r.chance(0.5);
  const a = r.intExcept(-70, 70, [0]);
  const sameSide = tier === "build" || r.chance(0.4);
  const b = sameSide ? Math.sign(a) * r.intExcept(5, 75, [Math.abs(a)]) : -Math.sign(a) * r.int(5, 75);
  const diff = Math.abs(a - b);
  const label = lat ? ns : ew;
  return item({
    skill: lat ? "Difference in latitude" : "Difference in longitude",
    prompt: `Find the difference in ${lat ? "latitude" : "longitude"} between ${label(a)} and ${label(b)}.`,
    input: num({ unit: "°" }),
    answer: diff,
    hints: [lat ? "Same hemisphere (both N or both S): subtract." : "Same side (both E or both W): subtract.", lat ? "Opposite hemispheres: ADD, because the equator lies between them." : "Opposite sides: ADD, because the Greenwich meridian lies between them.", `${Math.abs(a)} ${Math.sign(a) === Math.sign(b) ? "−" : "+"} ${Math.abs(b)}`],
    solution: [`Difference = ${diff}°`],
    traps: [trap(Math.sign(a) === Math.sign(b) ? "added" : "subtracted", Math.sign(a) === Math.sign(b) ? Math.abs(a) + Math.abs(b) : Math.abs(Math.abs(a) - Math.abs(b)), Math.sign(a) === Math.sign(b) ? "Both are on the same side: subtract." : "They are on opposite sides: add.")],
  });
};

generators["L6-G3.2"] = (r, tier) => {
  const meridian = tier === "build" || r.chance(0.4);
  const theta = r.pick([10, 15, 20, 30, 35, 40, 45, 60, 70, 75, 90]);
  if (meridian) {
    const d = (theta / 360) * 2 * (22 / 7) * R;
    const lat1 = r.int(0, 30);
    return item({
      skill: "Distance along a meridian",
      prompt: `P is at (${lat1}°N, 12°E) and Q is due north at (${lat1 + theta}°N, 12°E). Find the distance PQ along the meridian, to the nearest km. Take R = 6400 km and π = 22/7.`,
      input: num({ unit: "km" }),
      answer: Math.round(d),
      tolerance: 1,
      hints: ["A meridian is a great circle, radius R.", `Angle between P and Q at the centre = ${theta}°.`, `Distance = ${theta}/360 × 2 × 22/7 × 6400`],
      solution: [`PQ = ${theta}/360 × 2πR = ${Math.round(d)} km`],
      traps: [trap("no-two", Math.round(d / 2), "Circumference is 2πR, not πR.")],
    });
  }
  const lat = r.pick([30, 45, 60, r.int(20, 70)]);
  const lng1 = r.int(-40, 20);
  const lng2 = lng1 + theta;
  const d = (theta / 360) * 2 * (22 / 7) * R * Math.cos(rad(lat));
  return item({
    skill: "Distance along a parallel of latitude",
    prompt: `X is at (${lat}°N, ${ew(lng1)}) and Y is at (${lat}°N, ${ew(lng2)}). Find the distance XY along the parallel of latitude, to the nearest km. Take R = 6400 km and π = 22/7.`,
    input: num({ unit: "km" }),
    answer: Math.round(d),
    tolerance: 1,
    hints: [`The parallel at ${lat}°N is a small circle of radius R cos ${lat}°.`, `Difference in longitude = ${theta}°.`, `Distance = ${theta}/360 × 2 × 22/7 × 6400 × cos ${lat}°`],
    solution: [`r = 6400 cos ${lat}° = ${r1(R * Math.cos(rad(lat)))} km`, `XY = ${theta}/360 × 2πr = ${Math.round(d)} km`],
    traps: [trap("no-cos", Math.round((theta / 360) * 2 * (22 / 7) * R), "A parallel of latitude is a SMALL circle: multiply R by cos(latitude).")],
  });
};

generators["L6-G3.3"] = (r, tier) => {
  const a = r.int(-60, 60);
  let b = r.int(-60, 60);
  while (b === a) b = r.int(-60, 60);
  const diff = Math.abs(a - b);
  const mins = diff * 4;
  if (tier === "build" || r.chance(0.5)) {
    return item({
      skill: "Time difference from longitude",
      prompt: `What is the difference in local time, in minutes, between places at ${ew(a)} and ${ew(b)}?`,
      input: num({ unit: "minutes" }),
      answer: mins,
      hints: ["The Earth turns 360° in 24 hours: 15° per hour, which is 1° every 4 minutes.", `Difference in longitude = ${diff}°.`, `${diff} × 4`],
      solution: [`${diff}° × 4 = ${mins} minutes`],
      traps: [trap("times-15", diff * 15, "15° is ONE HOUR. Each degree is 4 minutes.")],
    });
  }
  const startH = r.int(6, 14);
  const east = b > a;
  const total = startH * 60 + (east ? mins : -mins);
  const hh = Math.floor((((total % 1440) + 1440) % 1440) / 60);
  const mm = (((total % 1440) + 1440) % 1440) % 60;
  const hhmm = `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
  const wrongTotal = startH * 60 + (east ? -mins : mins);
  const wh = Math.floor((((wrongTotal % 1440) + 1440) % 1440) / 60);
  const wm = (((wrongTotal % 1440) + 1440) % 1440) % 60;
  return item({
    skill: "Local time at another longitude",
    prompt: `It is ${String(startH).padStart(2, "0")}:00 local time at ${ew(a)}. What is the local time at ${ew(b)}? Give it as hh:mm (24-hour).`,
    input: { kind: "text", placeholder: "e.g. 14:20" },
    answer: hhmm,
    hints: ["1° of longitude = 4 minutes of time.", `Difference ${diff}° = ${mins} minutes.`, "EAST is AHEAD (the sun rises there first): add. West is behind: subtract."],
    solution: [`${mins} minutes ${east ? "ahead" : "behind"}`, `Local time ${hhmm}`],
    traps: [trap("wrong-way", `${String(wh).padStart(2, "0")}:${String(wm).padStart(2, "0")}`, "East is ahead, west is behind. You went the wrong way.")],
  });
};

export default generators;
