import { item, trap, num, frac, expr, byTier } from "./kit.js";
import { simplify, fracText } from "../rng.js";
import { sn } from "./format.js";

/**
 * GENERATORS · LEVEL 4 · MENSURATION, TRIANGLES AND POLYGONS, LOCI,
 * TRIGONOMETRY TO 360°, GROUPED DATA
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Contains every answer for L4-G1, L4-G2, L4-G3, L4-T1, L4-S1.
 * ═════════════════════════════════════════════════════════════════════════
 */

export const generators = {};

const choice = (options) => ({ kind: "choice", options });
const P = 22 / 7;
const r2 = (x) => Math.round(x * 100) / 100;

/* ── L4-G1 · Mensuration ────────────────────────────────────────────── */

generators["L4-G1.1"] = (r, tier) => {
  const r7 = 7 * r.int(1, 3);
  const theta = r.pick(byTier(tier, { build: [90, 180, 60], stretch: [45, 120, 135, 270], exam: [36, 72, 150, 210, 315] }));
  const arc = (theta / 360) * 2 * P * r7;
  const area = (theta / 360) * P * r7 * r7;
  const ask = r.pick(byTier(tier, { build: ["arc", "area"], stretch: ["arc", "area", "perimeter"], exam: ["perimeter", "area", "angle"] }));
  if (ask === "angle") {
    return item({
      skill: "Finding the angle of a sector from its arc",
      prompt: `An arc of a circle of radius ${r7} cm has length ${r2(arc)} cm. Find the angle it subtends at the centre. Take π = 22/7.`,
      input: num({ unit: "°" }),
      answer: theta,
      tolerance: 0.5,
      hints: ["Arc length = θ/360 × 2πr.", `Circumference = 2 × 22/7 × ${r7} = ${r2(2 * P * r7)}`, `θ = ${r2(arc)} ÷ ${r2(2 * P * r7)} × 360`],
      solution: [`θ/360 = ${r2(arc)} ÷ ${r2(2 * P * r7)}`, `θ = ${theta}°`],
      traps: [trap("used-area", Math.round((arc / (P * r7 * r7)) * 360), "Compare the arc with the CIRCUMFERENCE 2πr, not the area.")],
    });
  }
  const spec = {
    arc: { q: "the length of the arc", a: arc, unit: "cm", s: [`Arc = ${theta}/360 × 2 × 22/7 × ${r7} = ${r2(arc)} cm`], t: trap("used-area-formula", r2(area), "Arc length uses 2πr, not πr².") },
    area: { q: "the area of the sector", a: area, unit: "cm²", s: [`Area = ${theta}/360 × 22/7 × ${r7}² = ${r2(area)} cm²`], t: trap("used-arc-formula", r2(arc), "Sector area uses πr², not 2πr.") },
    perimeter: { q: "the perimeter of the sector", a: arc + 2 * r7, unit: "cm", s: [`Arc = ${r2(arc)}`, `Perimeter = arc + 2 radii = ${r2(arc)} + ${2 * r7} = ${r2(arc + 2 * r7)} cm`], t: trap("arc-only", r2(arc), "The perimeter of a sector includes the two straight radii as well as the arc.") },
  }[ask];
  return item({
    skill: ask === "area" ? "Area of a sector" : ask === "perimeter" ? "Perimeter of a sector" : "Length of an arc",
    prompt: `A sector of a circle of radius ${r7} cm has an angle of ${theta}° at the centre. Find ${spec.q}. Take π = 22/7, and give your answer to 2 decimal places if needed.`,
    input: num({ unit: spec.unit }),
    answer: r2(spec.a),
    tolerance: 0.01,
    hints: [`A sector is the fraction θ/360 = ${theta}/360 of the whole circle.`, ask === "area" ? "Sector area = θ/360 × πr²." : "Arc length = θ/360 × 2πr.", spec.s[0]],
    solution: spec.s,
    traps: [spec.t],
  });
};

generators["L4-G1.2"] = (r, tier) => {
  const R = 7 * r.int(1, 3);
  const theta = r.pick([90, 120, 180, 216, 240, 270]);
  const rBase = (R * theta) / 360;
  const ask = r.pick(byTier(tier, { build: ["radius", "slant"], stretch: ["radius", "curved"], exam: ["curved", "height"] }));
  if (ask === "slant") {
    return item({ skill: "Folding a sector into a cone: the slant height", prompt: `A sector of radius ${R} cm and angle ${theta}° is folded to make a cone. What is the slant height of the cone?`, input: num({ unit: "cm" }), answer: R, hints: ["The two straight edges of the sector join up.", "Each one runs from the point of the cone to its rim.", "That is the slant height."], solution: [`Slant height = radius of the sector = ${R} cm`], traps: [trap("used-base-radius", rBase, "That is the radius of the cone's BASE. The slant height is the radius of the sector.")] });
  }
  if (ask === "height") {
    const h = Math.sqrt(R * R - rBase * rBase);
    return item({ skill: "The height of a cone made from a sector", prompt: `A sector of radius ${R} cm and angle ${theta}° is folded into a cone. Find the perpendicular height of the cone, to 2 decimal places.`, input: num({ unit: "cm" }), answer: r2(h), tolerance: 0.01, hints: [`Base radius r = ${R} × ${theta}/360 = ${rBase}.`, `Slant height l = ${R}.`, `h² = l² − r² = ${R * R} − ${rBase * rBase}`], solution: [`r = ${rBase}, l = ${R}`, `h = √(${R * R} − ${rBase * rBase}) = ${r2(h)} cm`], traps: [trap("added-squares", r2(Math.sqrt(R * R + rBase * rBase)), "The slant height is the hypotenuse: subtract the squares.")] });
  }
  if (ask === "curved") {
    const area = (theta / 360) * P * R * R;
    return item({ skill: "Curved surface area of a cone from a sector", prompt: `A sector of radius ${R} cm and angle ${theta}° is folded into a cone. Find the curved surface area of the cone. Take π = 22/7.`, input: num({ unit: "cm²" }), answer: r2(area), tolerance: 0.01, hints: ["The curved surface of the cone IS the sector.", "So find the area of the sector.", `${theta}/360 × 22/7 × ${R}²`], solution: [`Curved surface = sector area = ${r2(area)} cm²`], traps: [trap("whole-circle", r2(P * R * R), "Only the sector becomes the cone, not the whole circle.")] });
  }
  return item({
    skill: "Folding a sector into a cone: the base radius",
    prompt: `A sector of radius ${R} cm and angle ${theta}° is folded to form a cone. Find the radius of the base of the cone.`,
    input: num({ unit: "cm" }),
    answer: rBase,
    hints: ["The ARC of the sector becomes the circumference of the cone's base.", `Arc = ${theta}/360 × 2π × ${R}`, `2πr = arc, so r = ${R} × ${theta}/360`],
    solution: [`2πr = ${theta}/360 × 2π × ${R}`, `r = ${R} × ${theta}/360 = ${rBase} cm`],
    traps: [trap("slant-as-radius", R, "That is the slant height. The base radius comes from the arc length.")],
  });
};

generators["L4-G1.3"] = (r, tier) => {
  if (tier === "build" || r.chance(0.5)) {
    const r7 = 7 * r.int(1, 2);
    const h = r.int(3, 12);
    const V = P * r7 * r7 * h + (2 / 3) * P * r7 ** 3;
    return item({
      skill: "Volume of a composite solid",
      prompt: `A solid is a cylinder of radius ${r7} cm and height ${h} cm with a hemisphere of the same radius on top. Find its volume. Take π = 22/7, to 2 decimal places.`,
      input: num({ unit: "cm³" }),
      answer: r2(V),
      tolerance: 0.01,
      hints: ["Volume = cylinder + hemisphere.", `Cylinder: πr²h = ${r2(P * r7 * r7 * h)}`, `Hemisphere: ⅔πr³ = ${r2((2 / 3) * P * r7 ** 3)}`],
      solution: [`Cylinder = ${r2(P * r7 * r7 * h)}`, `Hemisphere = ${r2((2 / 3) * P * r7 ** 3)}`, `Total = ${r2(V)} cm³`],
      traps: [trap("full-sphere", r2(P * r7 * r7 * h + (4 / 3) * P * r7 ** 3), "A hemisphere is HALF a sphere: ⅔πr³, not ⁴⁄₃πr³.")],
    });
  }
  // frustum: big cone height H radius R, small cone cut off, similar with ratio k
  // Scale factor ½ keeps every length shown exact, so a student working from
  // the printed numbers gets exactly the marked answer.
  const R = 7 * r.int(2, 3);
  const H = r.int(2, 4) * 6;
  const k = 0.5;
  const rs = R * k;
  const hs = H * k;
  const Vf = (1 / 3) * P * (R * R * H - rs * rs * hs);
  return item({
    skill: "Volume of a frustum",
    prompt: `A cone of base radius ${R} cm and height ${H} cm has its top cut off parallel to the base, ${H - hs} cm above the base, leaving a frustum. The top face has radius ${r2(rs)} cm. Find the volume of the frustum, to 2 decimal places. Take π = 22/7.`,
    input: num({ unit: "cm³" }),
    answer: r2(Vf),
    tolerance: 0.05,
    hints: ["Frustum = big cone − small cone that was cut off.", `Small cone: radius ${r2(rs)}, height ${r2(hs)}.`, `⅓π(${R}² × ${H} − ${r2(rs)}² × ${r2(hs)})`],
    solution: [`Big cone: ⅓π × ${R}² × ${H} = ${r2((1 / 3) * P * R * R * H)}`, `Small cone: ⅓π × ${r2(rs)}² × ${r2(hs)} = ${r2((1 / 3) * P * rs * rs * hs)}`, `Frustum = ${r2(Vf)} cm³`],
    traps: [trap("big-cone", r2((1 / 3) * P * R * R * H), "Subtract the small cone that was removed.")],
  });
};

generators["L4-G1.4"] = (r, tier) => {
  const k = r.pick(byTier(tier, { build: [2, 3], stretch: [2, 3, 1.5], exam: [1.5, 2.5, 4] }));
  const volume = tier !== "build" && r.chance(0.5);
  const base = r.int(2, 20) * (volume ? 1 : 2);
  const answer = volume ? base * k ** 3 : base * k ** 2;
  return item({
    skill: volume ? "Volumes of similar solids" : "Areas of similar figures",
    prompt: volume ? `Two similar jugs have heights in the ratio 1 : ${k}. The smaller holds ${base} litres. How much does the larger hold?` : `Two similar triangles have corresponding sides in the ratio 1 : ${k}. The smaller has area ${base} cm². Find the area of the larger.`,
    input: num({ unit: volume ? "litres" : "cm²" }),
    answer: r2(answer),
    tolerance: 0.01,
    hints: ["If lengths are multiplied by k, areas are multiplied by k² and volumes by k³.", volume ? `k³ = ${r2(k ** 3)}` : `k² = ${r2(k ** 2)}`, `${base} × ${volume ? r2(k ** 3) : r2(k ** 2)}`],
    solution: [volume ? `Volume scale factor = ${k}³ = ${r2(k ** 3)}` : `Area scale factor = ${k}² = ${r2(k ** 2)}`, `${base} × ${volume ? r2(k ** 3) : r2(k ** 2)} = ${r2(answer)}`],
    traps: [trap("used-length-ratio", r2(base * k), `Lengths scale by ${k}, but ${volume ? "volumes by k³" : "areas by k²"}.`), volume ? trap("used-area-ratio", r2(base * k * k), "Volumes scale by k³, not k².") : null].filter(Boolean),
  });
};

/* ── L4-G2 · Triangles and polygons ─────────────────────────────────── */

generators["L4-G2.1"] = (r, tier) => {
  const [given, answer] = r.pick([
    ["three pairs of equal sides", "SSS"],
    ["two pairs of equal sides and the angle between them equal", "SAS"],
    ["two pairs of equal angles and the side between them equal", "ASA"],
    ["right angles, equal hypotenuses and one other pair of equal sides", "RHS"],
    ["three pairs of equal angles only", "not necessarily congruent"],
    ["two pairs of equal sides and a non-included angle equal", "not necessarily congruent"],
  ]);
  return item({
    skill: "Conditions for congruent triangles",
    prompt: `Two triangles have ${given}. Are they congruent, and by which condition?`,
    input: choice(["SSS", "SAS", "ASA", "RHS", "not necessarily congruent"]),
    answer,
    hints: ["SSS: three sides. SAS: two sides and the INCLUDED angle. ASA (or AAS): two angles and a corresponding side. RHS: right angle, hypotenuse, side.", "Three equal angles only give similar triangles, which can be different sizes.", "Two sides and an angle NOT between them do not fix the triangle."],
    solution: [answer === "not necessarily congruent" ? "This information does not fix the triangle: the triangles could differ." : `They are congruent by ${answer}.`],
    traps: [trap(answer === "not necessarily congruent" ? "aaa-congruent" : "missed-condition", answer === "not necessarily congruent" ? "ASA" : "not necessarily congruent", answer === "not necessarily congruent" ? "Equal angles alone give SIMILAR triangles; they need not be the same size." : `${given} is enough: ${answer}.`)],
  });
};

generators["L4-G2.2"] = (r, tier) => {
  const shape = r.pick(byTier(tier, { build: ["parallelogram", "rhombus"], stretch: ["parallelogram", "rhombus", "kite"], exam: ["rhombus", "kite", "trapezium"] }));
  const a = r.int(35, 80);
  const spec = {
    parallelogram: { q: `In parallelogram ABCD, angle A = ${a}°. Find angle B.`, ans: 180 - a, why: "Adjacent angles of a parallelogram are co-interior angles between parallel sides: they add to 180°.", wrong: a },
    rhombus: { q: `In rhombus ABCD, angle ABD = ${a}°, where BD is a diagonal. Find angle BAD.`, ans: 180 - 2 * a, why: "In a rhombus all sides are equal, so triangle ABD is isosceles (AB = AD): angle ADB = angle ABD.", wrong: 180 - a },
    kite: { q: `In kite ABCD with AB = AD and CB = CD, angle B = ${a + 40}° and angle C = ${a}°. Find angle A.`, ans: 360 - 2 * (a + 40) - a, why: "A kite has one pair of equal opposite angles, at B and D, between the unequal sides. The four angles add to 360°.", wrong: 360 - (a + 40) - a },
    trapezium: { q: `In trapezium ABCD, AB ∥ DC and angle D = ${a}°. Find angle A.`, ans: 180 - a, why: "A and D are co-interior angles between the parallel sides AB and DC: they add to 180°.", wrong: a },
  }[shape];
  return item({
    skill: "Angle properties of special quadrilaterals",
    prompt: spec.q,
    input: num({ unit: "°" }),
    answer: spec.ans,
    hints: ["The angles of any quadrilateral add up to 360°.", spec.why, "Sketch the shape and mark the equal sides and parallel sides."],
    solution: [spec.why, `Answer: ${spec.ans}°`],
    traps: [trap("wrong-property", spec.wrong, spec.why)],
  });
};

generators["L4-G2.3"] = (r, tier) => {
  const a = r.int(2, 9);
  const b = r.int(2, 9);
  const c = r.int(2, 9);
  return item({
    skill: "The intercept theorem",
    prompt: `Three parallel lines cut two transversals. On the first transversal the intercepts are ${a} cm and ${b} cm. On the second, the first intercept is ${a * c / 2} cm. Find the second intercept on the second transversal.`,
    input: num({ unit: "cm" }),
    answer: (b * c) / 2,
    tolerance: 0.001,
    hints: ["Parallel lines cut any two transversals in the SAME ratio.", `${a} : ${b} = ${(a * c) / 2} : x`, `x = ${b} × ${(a * c) / 2} ÷ ${a}`],
    solution: [`${a}/${b} = ${(a * c) / 2}/x`, `x = ${(b * c) / 2} cm`],
    traps: [trap("added-difference", b + ((a * c) / 2 - a), "The intercepts are in the same RATIO, not separated by the same difference.")],
  });
};

generators["L4-G2.4"] = (r, tier) => {
  const AD = r.int(2, 8);
  const DB = r.int(2, 8);
  const DE = r.int(3, 12);
  const AB = AD + DB;
  const BC = (DE * AB) / AD;
  return item({
    skill: "Similar triangles inside a figure",
    prompt: `In triangle ABC, D lies on AB and E on AC with DE ∥ BC. AD = ${AD} cm, DB = ${DB} cm and DE = ${DE} cm. Find BC${Number.isInteger(BC) ? "" : ", to 2 decimal places"}.`,
    input: num({ unit: "cm" }),
    answer: r2(BC),
    tolerance: 0.01,
    hints: ["DE ∥ BC makes triangles ADE and ABC similar.", `The ratio uses the WHOLE side: AB = ${AD} + ${DB} = ${AB}.`, `BC/DE = AB/AD`],
    solution: [`AB = ${AB}`, `BC = ${DE} × ${AB}/${AD} = ${r2(BC)} cm`],
    traps: [trap("used-db", r2((DE * DB) / AD), `Use AB (the whole side, ${AB} cm), not DB.`)],
  });
};

generators["L4-G2.5"] = (r, tier) => {
  const base = r.int(4, 15);
  const height = r.int(3, 12);
  const kind = r.pick(["triangle", "parallelogram"]);
  if (kind === "triangle") {
    return item({
      skill: "A triangle and a parallelogram on the same base",
      prompt: `Parallelogram ABCD has area ${base * height} cm². Triangle ABE has the same base AB, with E on the line DC. Find the area of triangle ABE.`,
      input: num({ unit: "cm²" }),
      answer: (base * height) / 2,
      hints: ["They share the base AB and lie between the same parallels AB and DC, so they have the same height.", "A triangle on the same base and between the same parallels as a parallelogram has HALF its area.", `${base * height} ÷ 2`],
      solution: [`Area of triangle = ½ × area of parallelogram = ${(base * height) / 2} cm²`],
      traps: [trap("same-area", base * height, "A triangle has HALF the area of a parallelogram on the same base and between the same parallels.")],
    });
  }
  return item({
    skill: "Parallelograms on the same base",
    prompt: `Parallelograms ABCD and ABEF are on the same base AB = ${base} cm and between the same parallel lines, which are ${height} cm apart. What is the area of ABEF?`,
    input: num({ unit: "cm²" }),
    answer: base * height,
    hints: ["Parallelograms on the same base and between the same parallels have equal areas.", "Area = base × perpendicular height.", `${base} × ${height}`],
    solution: [`Area = ${base} × ${height} = ${base * height} cm², the same as ABCD`],
    traps: [trap("halved", (base * height) / 2, "It is a parallelogram, not a triangle: no ½.")],
  });
};

/* ── L4-G3 · Loci ───────────────────────────────────────────────────── */

generators["L4-G3.1"] = (r, tier) => {
  const [desc, answer] = r.pick([
    ["points 4 cm from a fixed point P", "a circle, centre P, radius 4 cm"],
    ["points equidistant from two fixed points A and B", "the perpendicular bisector of AB"],
    ["points equidistant from two intersecting lines", "the bisectors of the angles between the lines"],
    ["points 3 cm from a straight line l", "two lines parallel to l, 3 cm on either side"],
  ]);
  const options = ["a circle, centre P, radius 4 cm", "the perpendicular bisector of AB", "the bisectors of the angles between the lines", "two lines parallel to l, 3 cm on either side"];
  return item({
    skill: "The four standard loci",
    prompt: `What is the locus of ${desc}?`,
    input: choice(options),
    answer,
    hints: ["A LOCUS is the set of all points obeying a rule.", "Fixed distance from a POINT: a circle. Fixed distance from a LINE: parallel lines.", "Equidistant from two POINTS: the perpendicular bisector. Equidistant from two LINES: the angle bisector."],
    solution: [`The locus is ${answer}.`],
    traps: [trap("mixed-up", answer === options[1] ? options[2] : options[1], "Two POINTS give a perpendicular bisector; two LINES give an angle bisector.")],
  });
};

generators["L4-G3.2"] = (r, tier) => {
  const AB = r.int(4, 12);
  const rad = r.pick([AB / 2 - 1, AB / 2, AB / 2 + r.int(1, 3)]);
  const count = rad > AB / 2 ? 2 : rad === AB / 2 ? 1 : 0;
  return item({
    skill: "Intersecting loci",
    prompt: `A and B are ${AB} cm apart. How many points are ${rad} cm from A AND equidistant from A and B?`,
    input: num(),
    answer: count,
    hints: [`Points ${rad} cm from A: a circle of radius ${rad} centred at A.`, `Points equidistant from A and B: the perpendicular bisector of AB, which is ${AB / 2} cm from A.`, "Compare the radius with that distance: does the circle reach the line?"],
    solution: [`The perpendicular bisector is ${AB / 2} cm from A.`, count === 2 ? `${rad} > ${AB / 2}: the circle crosses the line twice.` : count === 1 ? `${rad} = ${AB / 2}: the circle just touches the line once.` : `${rad} < ${AB / 2}: the circle does not reach the line.`, `Points: ${count}`],
    traps: [trap("always-two", count === 2 ? 1 : 2, "Compare the radius with the distance from A to the bisector, half of AB.")],
  });
};

/* ── L4-T1 · Trigonometry to 360° ───────────────────────────────────── */

const SPECIAL = { 30: [0.5, Math.sqrt(3) / 2, 1 / Math.sqrt(3)], 45: [Math.SQRT1_2, Math.SQRT1_2, 1], 60: [Math.sqrt(3) / 2, 0.5, Math.sqrt(3)] };

generators["L4-T1.1"] = (r, tier) => {
  const quadrant = r.int(2, 4);
  const acute = r.pick([30, 45, 60]);
  const angle = quadrant === 2 ? 180 - acute : quadrant === 3 ? 180 + acute : 360 - acute;
  const fn = r.pick(["sin", "cos", "tan"]);
  const base = SPECIAL[acute][["sin", "cos", "tan"].indexOf(fn)];
  const positive = (fn === "sin" && quadrant <= 2) || (fn === "cos" && (quadrant === 1 || quadrant === 4)) || (fn === "tan" && (quadrant === 1 || quadrant === 3));
  if (tier === "exam" && fn === "sin" && r.chance(0.6)) {
    const value = r.pick([0.5, -0.5]);
    const sols = value > 0 ? [30, 150] : [210, 330];
    return item({
      skill: "Solving a trigonometric equation from 0° to 360°",
      prompt: `Find all values of θ between 0° and 360° for which sin θ = ${value}.`,
      input: { kind: "list", placeholder: "e.g. 30, 150" },
      answer: sols.map(String),
      hints: ["sin⁻¹(0.5) = 30° is the acute related angle.", "Sine is positive in the 1st and 2nd quadrants, negative in the 3rd and 4th.", value > 0 ? "θ = 30° and 180° − 30°." : "θ = 180° + 30° and 360° − 30°."],
      solution: [`Related angle 30°. sin is ${value > 0 ? "positive: quadrants 1 and 2" : "negative: quadrants 3 and 4"}.`, `θ = ${sols.join("° and ")}°`],
      traps: [trap("one-answer", [String(sols[0])], "There are TWO angles between 0° and 360° with this sine.")],
    });
  }
  const answer = r2((positive ? 1 : -1) * base);
  return item({
    skill: "Trigonometric ratios of angles beyond 90°",
    prompt: `Without a calculator, use the related acute angle to find ${fn} ${angle}°, to 2 decimal places.`,
    input: num(),
    answer,
    tolerance: 0.006,
    hints: [`The related acute angle is ${acute}°.`, "CAST: in the 1st quadrant All are positive, in the 2nd only Sin, in the 3rd only Tan, in the 4th only Cos.", `${angle}° is in quadrant ${quadrant}, so ${fn} is ${positive ? "positive" : "negative"}.`],
    solution: [`Related angle: ${acute}°`, `Quadrant ${quadrant}: ${fn} ${positive ? "+" : "−"}`, `${fn} ${angle}° = ${positive ? "" : "−"}${fn} ${acute}° = ${answer}`],
    traps: [trap("wrong-sign", -answer, `Check the sign with CAST: in quadrant ${quadrant}, ${fn} is ${positive ? "positive" : "negative"}.`)],
  });
};

generators["L4-T1.2"] = (r, tier) => {
  const items = byTier(tier, {
    build: [["sin 30°", "1/2", "frac"], ["cos 60°", "1/2", "frac"], ["tan 45°", "1", "frac"], ["cos 30°", "√3/2", "expr"], ["sin 60°", "√3/2", "expr"]],
    stretch: [["tan 60°", "√3", "expr"], ["tan 30°", "√3/3", "expr"], ["sin 45°", "√2/2", "expr"], ["sin 30° + cos 60°", "1", "frac"], ["2 sin 30° cos 30°", "√3/2", "expr"]],
    exam: [["sin 60° cos 30° − cos 60° sin 30°", "1/2", "frac"], ["tan² 60°", "3", "frac"], ["(1 − cos 60°)/sin 60°", "√3/3", "expr"], ["sin² 45° + cos² 45°", "1", "frac"], ["tan 30° × tan 60°", "1", "frac"]],
  });
  const [q, answer, kind] = r.pick(items);
  return item({
    skill: "Exact trigonometric values",
    prompt: `Without tables or a calculator, find the exact value of ${q}. Give surds in simplest form, with a rational denominator.`,
    input: kind === "frac" ? frac() : expr({ placeholder: "e.g. √3/2" }),
    answer,
    exact: kind === "expr" ? "rationalised" : undefined,
    hints: ["From the half-equilateral triangle (sides 1, √3, 2): sin 30° = 1/2, cos 30° = √3/2, tan 30° = 1/√3 = √3/3.", "sin 60° = √3/2, cos 60° = 1/2, tan 60° = √3. From the isosceles right triangle: sin 45° = cos 45° = √2/2, tan 45° = 1.", "Substitute the exact values, then simplify."],
    solution: [`${q} = ${answer}`],
    traps: [],
  });
};

generators["L4-T1.3"] = (r, tier) => {
  const a = r.int(1, 5);
  const c = byTier(tier, { build: 0, stretch: r.int(-3, 3), exam: r.int(-4, 4) });
  const fn = r.pick(["sin", "cos"]);
  const ask = r.pick(["max", "min", "value"]);
  const shown = `y = ${a === 1 ? "" : a}${fn} x${c === 0 ? "" : c > 0 ? ` + ${c}` : ` − ${-c}`}`;
  if (ask === "value") {
    const x = r.pick([0, 90, 180, 270, 360]);
    const v = Math.round(a * (fn === "sin" ? Math.sin((x * Math.PI) / 180) : Math.cos((x * Math.PI) / 180))) + c;
    return item({ skill: "Reading a value from a sine or cosine graph", prompt: `For ${shown}, find y when x = ${x}°.`, input: num(), answer: v, hints: [`${fn} ${x}° = ${Math.round(fn === "sin" ? Math.sin((x * Math.PI) / 180) : Math.cos((x * Math.PI) / 180))}`, `Multiply by ${a}${c ? `, then ${c > 0 ? "add" : "subtract"} ${Math.abs(c)}` : ""}.`, "Key values: sin 0 = 0, sin 90 = 1, sin 270 = −1; cos 0 = 1, cos 180 = −1."], solution: [`y = ${v}`], traps: [] });
  }
  const answer = ask === "max" ? a + c : -a + c;
  return item({
    skill: "Maximum and minimum of a sine or cosine graph",
    prompt: `What is the ${ask === "max" ? "maximum" : "minimum"} value of ${shown}?`,
    input: num(),
    answer,
    hints: [`${fn} x is always between −1 and 1.`, `So ${a}${fn} x is between −${a} and ${a}.`, c ? `Then ${c > 0 ? "add" : "subtract"} ${Math.abs(c)}.` : "There is nothing added."],
    solution: [`${a}${fn} x ranges from −${a} to ${a}`, `${ask === "max" ? "Maximum" : "Minimum"} = ${ask === "max" ? a : -a} ${c >= 0 ? "+" : "−"} ${Math.abs(c)} = ${answer}`],
    traps: [trap("forgot-shift", ask === "max" ? a : -a, c ? `Do not forget the ${c > 0 ? "+" : "−"} ${Math.abs(c)}.` : "Check the amplitude.")].filter((t) => t.is !== answer),
  });
};

/* ── L4-S1 · Grouped data ───────────────────────────────────────────── */

function groupedTable(r, tier) {
  const width = r.pick([5, 10]);
  const start = r.int(1, 4) * width;
  const classes = Array.from({ length: 5 }, (_, i) => [start + i * width, start + (i + 1) * width - 1]);
  const fs = classes.map(() => r.int(2, 12));
  return { width, classes, fs, mids: classes.map(([a, b]) => (a + b) / 2) };
}
const tableText = (classes, fs) => `Class:      ${classes.map(([a, b]) => `${a}–${b}`).join("   ")}\nFrequency:  ${fs.join("     ")}`;

generators["L4-S1.1"] = (r, tier) => {
  const { classes, fs, mids, width } = groupedTable(r, tier);
  const i = r.int(0, 4);
  if (r.chance(0.5)) {
    return item({
      skill: "Plotting a frequency polygon",
      prompt: `${tableText(classes, fs)}\n\nA frequency polygon is drawn. What is the x-coordinate of the point plotted for the class ${classes[i][0]}–${classes[i][1]}?`,
      input: num(),
      answer: mids[i],
      hints: ["A frequency polygon joins points plotted at the class MIDPOINTS.", "Midpoint = (lower limit + upper limit) ÷ 2.", `(${classes[i][0]} + ${classes[i][1]}) ÷ 2`],
      solution: [`Midpoint = ${mids[i]}`, `The point is (${mids[i]}, ${fs[i]}).`],
      traps: [trap("lower-limit", classes[i][0], "Points are plotted at the midpoint of the class, not its lower limit.")],
    });
  }
  return item({
    skill: "Reading a histogram",
    prompt: `${tableText(classes, fs)}\n\nOn a histogram with equal class widths of ${width}, how tall is the bar for the class ${classes[i][0]}–${classes[i][1]}?`,
    input: num(),
    answer: fs[i],
    hints: ["With equal class widths, the height of each bar is the frequency.", "The bars touch: the horizontal axis is continuous, using class boundaries.", `Read the frequency of ${classes[i][0]}–${classes[i][1]}.`],
    solution: [`Height = frequency = ${fs[i]}`],
    traps: [trap("gave-midpoint", mids[i], "That is the class midpoint. The bar height is the frequency.")],
  });
};

generators["L4-S1.2"] = (r, tier) => {
  const { classes, fs, mids } = groupedTable(r, tier);
  const ask = r.pick(byTier(tier, { build: ["modal", "mean"], stretch: ["mean", "median-class"], exam: ["mean", "median-class"] }));
  const sumF = fs.reduce((a, b) => a + b, 0);
  const sumFx = fs.reduce((s, f, i) => s + f * mids[i], 0);
  if (ask === "modal") {
    const max = Math.max(...fs);
    if (fs.filter((f) => f === max).length > 1) return generators["L4-S1.2"](r, "stretch");
    const ci = fs.indexOf(max);
    return item({ skill: "The modal class", prompt: `${tableText(classes, fs)}\n\nWhich is the modal class? Give its lower limit.`, input: num(), answer: classes[ci][0], hints: ["The modal class has the highest frequency.", `Highest frequency: ${max}.`, "Give the lower limit of that class."], solution: [`Modal class: ${classes[ci][0]}–${classes[ci][1]}`], traps: [trap("gave-frequency", max, "That is the frequency. Give the class.")] });
  }
  if (ask === "median-class") {
    const pos = sumF / 2;
    let cum = 0;
    let ci = 0;
    for (; ci < fs.length; ci += 1) { cum += fs[ci]; if (cum >= pos) break; }
    return item({ skill: "The median class", prompt: `${tableText(classes, fs)}\n\nWhich class contains the median? Give its lower limit.`, input: num(), answer: classes[ci][0], hints: [`Total frequency = ${sumF}; the median is about the ${pos}th value.`, "Add the frequencies in order until the running total reaches that position.", `Cumulative: ${fs.reduce((a, f) => [...a, (a[a.length - 1] || 0) + f], []).join(", ")}`], solution: [`Median position ≈ ${pos}`, `Median class: ${classes[ci][0]}–${classes[ci][1]}`], traps: [] });
  }
  const mean = r2(sumFx / sumF);
  return item({
    skill: "Mean of grouped data",
    prompt: `${tableText(classes, fs)}\n\nEstimate the mean, to 2 decimal places.`,
    input: num(),
    answer: mean,
    tolerance: 0.006,
    hints: ["Use each class MIDPOINT as x.", `Midpoints: ${mids.join(", ")}`, `Mean = Σfx ÷ Σf = ${sumFx} ÷ ${sumF}`],
    solution: [`Σfx = ${sumFx}`, `Σf = ${sumF}`, `Mean = ${mean}`],
    traps: [trap("lower-limits", r2(fs.reduce((s, f, i) => s + f * classes[i][0], 0) / sumF), "Use the class MIDPOINTS, not the lower limits.")],
  });
};

generators["L4-S1.3"] = (r, tier) => {
  const { classes, fs, mids } = groupedTable(r, tier);
  const A = mids[2];
  const ds = mids.map((m) => m - A);
  const sumF = fs.reduce((a, b) => a + b, 0);
  const sumFd = fs.reduce((s, f, i) => s + f * ds[i], 0);
  const askSum = r.chance(0.4);
  const mean = r2(A + sumFd / sumF);
  return item({
    skill: "The assumed mean method",
    prompt: `${tableText(classes, fs)}\n\nUsing an assumed mean A = ${A}, ${askSum ? "find Σfd, where d = x − A and x is the class midpoint" : "find the mean, to 2 decimal places"}.`,
    input: num(),
    answer: askSum ? sumFd : mean,
    tolerance: askSum ? undefined : 0.006,
    hints: ["d = midpoint − A for each class.", `d: ${ds.map(sn).join(", ")}`, askSum ? "Multiply each d by its frequency and add." : `Mean = A + Σfd/Σf = ${A} + ${sumFd}/${sumF}`],
    solution: [`d = ${ds.map(sn).join(", ")}`, `Σfd = ${sumFd}`, askSum ? `Σfd = ${sumFd}` : `Mean = ${A} + ${sumFd}/${sumF} = ${mean}`],
    traps: askSum ? [] : [trap("forgot-A", r2(sumFd / sumF), "Add the assumed mean A back on: mean = A + Σfd/Σf.")],
  });
};

export default generators;
