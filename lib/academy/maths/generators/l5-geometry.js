import { item, trap, num, frac, expr, byTier } from "./kit.js";
import { simplify, fracText, gcd } from "../rng.js";
import { sn, poly, plainPoly } from "./format.js";

/**
 * GENERATORS · LEVEL 5 · CIRCLE THEOREMS, COORDINATE GEOMETRY, SOLVING TRIANGLES
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Contains every answer for L5-G1, L5-G2 and L5-T1.
 * ═════════════════════════════════════════════════════════════════════════
 */

export const generators = {};

const deg = (x) => (x * 180) / Math.PI;
const rad = (d) => (d * Math.PI) / 180;
const r1 = (x) => Math.round(x * 10) / 10;
const r2 = (x) => Math.round(x * 100) / 100;
const coords = { kind: "coordinates", placeholder: "e.g. (3, -1)" };
const TRIPLES = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [6, 8, 10], [7, 24, 25], [9, 12, 15]];

/* ── L5-G1 · Circle theorems ────────────────────────────────────────── */

generators["L5-G1.1"] = (r, tier) => {
  const [a, d, rr] = r.pick(TRIPLES); // half-chord a, distance d, radius rr
  const ask = r.pick(byTier(tier, { build: ["distance"], stretch: ["distance", "chord"], exam: ["chord", "radius"] }));
  const spec = {
    distance: { q: `A chord of length ${2 * a} cm is drawn in a circle of radius ${rr} cm. How far is the chord from the centre?`, a: d, s: [`The perpendicular from the centre bisects the chord: half-chord = ${a}.`, `d² = ${rr}² − ${a}² = ${rr * rr - a * a}`, `d = ${d} cm`], t: trap("full-chord", r2(Math.sqrt(Math.abs(rr * rr - 4 * a * a))) || null, "Use HALF the chord: the perpendicular from the centre bisects it.") },
    chord: { q: `A chord is ${d} cm from the centre of a circle of radius ${rr} cm. Find the length of the chord.`, a: 2 * a, s: [`Half-chord² = ${rr}² − ${d}² = ${a * a}`, `Half-chord = ${a}, chord = ${2 * a} cm`], t: trap("half-only", a, "That is HALF the chord. Double it.") },
    radius: { q: `A chord of length ${2 * a} cm is ${d} cm from the centre of a circle. Find the radius.`, a: rr, s: [`r² = ${a}² + ${d}² = ${rr * rr}`, `r = ${rr} cm`], t: trap("full-chord", r2(Math.sqrt(4 * a * a + d * d)), "Use half the chord in the right-angled triangle.") },
  }[ask];
  return item({
    skill: "The perpendicular from the centre bisects a chord",
    prompt: spec.q,
    input: num({ unit: "cm" }),
    answer: spec.a,
    hints: ["The perpendicular from the centre to a chord BISECTS the chord.", "That makes a right-angled triangle: radius (hypotenuse), half-chord and distance.", spec.s[0]],
    solution: spec.s,
    traps: [spec.t].filter((t) => t.is !== null && t.is !== undefined),
  });
};

generators["L5-G1.2"] = (r, tier) => {
  const circ = r.int(20, 85);
  const toCentre = r.chance(0.5);
  return item({
    skill: "The angle at the centre is twice the angle at the circumference",
    prompt: toCentre ? `An arc subtends an angle of ${circ}° at the circumference. What angle does it subtend at the centre?` : `An arc subtends an angle of ${2 * circ}° at the centre O. Find the angle it subtends at a point on the remaining part of the circumference.`,
    input: num({ unit: "°" }),
    answer: toCentre ? 2 * circ : circ,
    hints: ["The angle at the CENTRE is TWICE the angle at the circumference, standing on the same arc.", toCentre ? "Double it." : "Halve it.", toCentre ? `2 × ${circ}` : `${2 * circ} ÷ 2`],
    solution: [toCentre ? `Angle at centre = 2 × ${circ} = ${2 * circ}°` : `Angle at circumference = ${2 * circ} ÷ 2 = ${circ}°`],
    traps: [trap("wrong-way", toCentre ? circ / 2 : 4 * circ, "The CENTRE angle is the bigger one: twice the circumference angle.")],
  });
};

generators["L5-G1.3"] = (r, tier) => {
  const a = r.int(20, 70);
  return item({
    skill: "The angle in a semicircle is a right angle",
    prompt: `AB is a diameter of a circle and C is a point on the circle. Angle CAB = ${a}°. Find angle CBA.`,
    input: num({ unit: "°" }),
    answer: 90 - a,
    hints: ["The angle in a semicircle is 90°: angle ACB = 90°.", "The angles of triangle ABC add to 180°.", `180 − 90 − ${a}`],
    solution: ["Angle ACB = 90° (angle in a semicircle)", `Angle CBA = 180 − 90 − ${a} = ${90 - a}°`],
    traps: [trap("no-right-angle", 180 - 2 * a, "Angle ACB is 90°, because it stands on the diameter.")],
  });
};

generators["L5-G1.4"] = (r, tier) => {
  const x = r.int(25, 75);
  if (tier === "exam") {
    const y = r.int(30, 70);
    return item({
      skill: "Angles in the same segment, with a triangle",
      prompt: `A, B, C and D lie on a circle, and the chords AC and BD meet at X. Angle BAC = ${x}° and angle ABD = ${y}°. Find angle ACD.`,
      input: num({ unit: "°" }),
      answer: y,
      hints: ["Angles in the same segment, standing on the same arc, are equal.", "Angle ABD and angle ACD both stand on the arc AD.", `So angle ACD = angle ABD.`],
      solution: [`Angle ACD = angle ABD = ${y}° (angles in the same segment)`],
      traps: [trap("used-other", x, "Angle BAC stands on arc BC. Find the angle that stands on the same arc AD.")],
    });
  }
  return item({
    skill: "Angles in the same segment are equal",
    prompt: `P, Q, R and S lie on a circle. Angle PRQ = ${x}°. Find angle PSQ, which stands on the same arc PQ.`,
    input: num({ unit: "°" }),
    answer: x,
    hints: ["Angles standing on the same arc, in the same segment, are equal.", "PRQ and PSQ both stand on arc PQ.", "So they are equal."],
    solution: [`Angle PSQ = angle PRQ = ${x}° (angles in the same segment)`],
    traps: [trap("doubled", 2 * x, "Doubling applies to the angle at the CENTRE. Two circumference angles on the same arc are equal.")],
  });
};

generators["L5-G1.5"] = (r, tier) => {
  const a = r.int(55, 120);
  const ext = tier !== "build" && r.chance(0.5);
  return item({
    skill: ext ? "The exterior angle of a cyclic quadrilateral" : "Opposite angles of a cyclic quadrilateral",
    prompt: ext ? `ABCD is a cyclic quadrilateral. Side DC is extended to E. Angle DAB = ${a}°. Find angle BCE.` : `ABCD is a cyclic quadrilateral with angle A = ${a}°. Find angle C.`,
    input: num({ unit: "°" }),
    answer: ext ? a : 180 - a,
    hints: ["Opposite angles of a cyclic quadrilateral add up to 180°.", ext ? "So the exterior angle at C equals the interior opposite angle at A." : `C = 180 − ${a}`, ext ? `Angle BCE = angle DAB.` : "Subtract."],
    solution: ext ? [`Angle BCD = 180 − ${a} = ${180 - a}°`, `Angle BCE = 180 − ${180 - a} = ${a}° (exterior angle = interior opposite angle)`] : [`A + C = 180°, so C = ${180 - a}°`],
    traps: [trap(ext ? "gave-interior" : "said-equal", 180 - a === (ext ? 180 - a : a) ? null : ext ? 180 - a : a, ext ? "That is the interior angle BCD. The exterior angle is next to it on the straight line." : "Opposite angles of a cyclic quadrilateral add to 180°; they are not equal.")].filter((t) => t.is !== null),
  });
};

generators["L5-G1.6"] = (r, tier) => {
  const kind = r.pick(byTier(tier, { build: ["length"], stretch: ["length", "external-angle"], exam: ["external-angle", "length"] }));
  if (kind === "length") {
    const [t, rr, d] = r.pick(TRIPLES);
    return item({
      skill: "A tangent is perpendicular to the radius",
      prompt: `A point P is ${d} cm from the centre O of a circle of radius ${rr} cm. A tangent from P touches the circle at T. Find the length PT.`,
      input: num({ unit: "cm" }),
      answer: t,
      hints: ["The tangent is perpendicular to the radius at the point of contact: angle OTP = 90°.", "OP is the hypotenuse.", `PT² = ${d}² − ${rr}²`],
      solution: [`Angle OTP = 90°`, `PT² = ${d * d} − ${rr * rr} = ${t * t}`, `PT = ${t} cm`],
      traps: [trap("added", r2(Math.sqrt(d * d + rr * rr)), "OP is the HYPOTENUSE: subtract the squares.")],
    });
  }
  const centre = r.int(60, 150);
  return item({
    skill: "Two tangents from an external point",
    prompt: `Two tangents from an external point P touch a circle, centre O, at A and B. Angle AOB = ${centre}°. Find angle APB.`,
    input: num({ unit: "°" }),
    answer: 180 - centre,
    hints: ["Each tangent is perpendicular to its radius: angles OAP and OBP are 90°.", "The angles of quadrilateral OAPB add to 360°.", `360 − 90 − 90 − ${centre}`],
    solution: [`Angle APB = 360 − 90 − 90 − ${centre} = ${180 - centre}°`],
    traps: [trap("half", centre / 2, "That is the angle at the circumference rule; here use the right angles at A and B.")],
  });
};

generators["L5-G1.7"] = (r, tier) => {
  const a = r.int(30, 80);
  return item({
    skill: "The alternate segment theorem",
    prompt: `TA is a tangent to a circle at A, and AB is a chord. The angle between the tangent TA and the chord AB is ${a}°. C is a point on the circle in the alternate segment. Find angle ACB.`,
    input: num({ unit: "°" }),
    answer: a,
    hints: ["The angle between a tangent and a chord equals the angle in the ALTERNATE segment.", "Angle ACB is in the alternate segment.", "So they are equal."],
    solution: [`Angle ACB = ${a}° (alternate segment theorem)`],
    traps: [trap("supplement", 180 - a, "The alternate segment theorem gives EQUAL angles.")],
  });
};

generators["L5-G1.8"] = (r, tier) => {
  const ax = r.int(2, 9);
  const xb = r.int(2, 9);
  const cx = r.pick([1, 2, 3, 4, 6].filter((v) => (ax * xb) % v === 0));
  const xd = (ax * xb) / cx;
  return item({
    skill: "Intersecting chords",
    prompt: `Chords AB and CD of a circle intersect at X. AX = ${ax} cm, XB = ${xb} cm and CX = ${cx} cm. Find XD.`,
    input: num({ unit: "cm" }),
    answer: xd,
    hints: ["When two chords intersect: AX × XB = CX × XD.", `${ax} × ${xb} = ${cx} × XD`, `XD = ${ax * xb} ÷ ${cx}`],
    solution: [`${ax} × ${xb} = ${cx} × XD`, `XD = ${xd} cm`],
    traps: [trap("added", ax + xb - cx, "The PRODUCTS of the parts are equal, not the sums.")],
  });
};

/* ── L5-G2 · Coordinate geometry ────────────────────────────────────── */

generators["L5-G2.1"] = (r, tier) => {
  const [dx, dy] = r.pick([[3, 4], [5, 12], [6, 8], [8, 15], [4, 3], [12, 5]]);
  const x1 = r.int(-6, 6);
  const y1 = r.int(-6, 6);
  const x2 = x1 + dx * r.pick([1, -1]);
  const y2 = y1 + dy * r.pick([1, -1]);
  if (r.chance(0.5)) {
    return item({
      skill: "The distance between two points",
      prompt: `Find the distance between A(${sn(x1)}, ${sn(y1)}) and B(${sn(x2)}, ${sn(y2)}).`,
      input: num(),
      answer: Math.sqrt(dx * dx + dy * dy),
      hints: ["|AB| = √[(x₂ − x₁)² + (y₂ − y₁)²]", `x₂ − x₁ = ${sn(x2 - x1)}, y₂ − y₁ = ${sn(y2 - y1)}`, `√(${dx * dx} + ${dy * dy})`],
      solution: [`|AB| = √(${(x2 - x1) ** 2} + ${(y2 - y1) ** 2}) = √${dx * dx + dy * dy} = ${Math.sqrt(dx * dx + dy * dy)}`],
      traps: [trap("no-root", dx * dx + dy * dy, "That is the distance squared. Take the square root.")],
    });
  }
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  return item({
    skill: "The midpoint of a line segment",
    prompt: `Find the midpoint of A(${sn(x1)}, ${sn(y1)}) and B(${sn(x2)}, ${sn(y2)}).`,
    input: coords,
    answer: `(${mx}, ${my})`,
    hints: ["Midpoint = ((x₁ + x₂)/2, (y₁ + y₂)/2): the average of the coordinates.", `(${sn(x1)} + ${sn(x2)}) ÷ 2 = ${mx}`, `(${sn(y1)} + ${sn(y2)}) ÷ 2 = ${my}`],
    solution: [`Midpoint = (${mx}, ${my})`],
    traps: [trap("subtracted", `(${(x2 - x1) / 2}, ${(y2 - y1) / 2})`, "ADD the coordinates and halve; do not subtract.")],
  });
};

generators["L5-G2.2"] = (r, tier) => {
  const x1 = r.int(-5, 5);
  const y1 = r.int(-5, 5);
  const dx = r.intExcept(-6, 6, [0]);
  const dy = r.intExcept(-8, 8, [0]);
  const [n, d] = simplify(dy, dx);
  return item({
    skill: "The gradient of a line through two points",
    prompt: `Find the gradient of the line through (${sn(x1)}, ${sn(y1)}) and (${sn(x1 + dx)}, ${sn(y1 + dy)}).`,
    input: frac(),
    answer: fracText(n, d),
    hints: ["m = (y₂ − y₁)/(x₂ − x₁)", `y₂ − y₁ = ${sn(dy)}`, `x₂ − x₁ = ${sn(dx)}`],
    solution: [`m = ${sn(dy)}/${sn(dx)} = ${sn(fracText(n, d))}`],
    traps: [trap("upside-down", fracText(...simplify(dx, dy)), "Gradient is change in y over change in x, not the other way round.")],
  });
};

generators["L5-G2.3"] = (r, tier) => {
  const m = r.intExcept(-4, 5, [0]);
  const c = r.int(-8, 8);
  const x1 = r.int(-4, 4);
  const y1 = m * x1 + c;
  const twoPoints = tier !== "build" && r.chance(0.5);
  const x2 = x1 + r.int(1, 4);
  const y2 = m * x2 + c;
  return item({
    skill: "The equation of a straight line",
    prompt: twoPoints ? `Find the equation of the line through (${sn(x1)}, ${sn(y1)}) and (${sn(x2)}, ${sn(y2)}), in the form y = mx + c.` : `Find the equation of the line with gradient ${sn(m)} passing through (${sn(x1)}, ${sn(y1)}), in the form y = mx + c.`,
    input: expr({ placeholder: "e.g. y = 2x + 3" }),
    answer: plainPoly([m, "x"], [c, ""]),
    hints: [twoPoints ? `First the gradient: (${sn(y2)} − ${sn(y1)}) ÷ (${sn(x2)} − ${sn(x1)}) = ${sn(m)}.` : `y − y₁ = m(x − x₁)`, `y − ${sn(y1)} = ${sn(m)}(x − ${sn(x1)})`, "Expand and make y the subject."],
    solution: [twoPoints ? `m = ${sn(m)}` : null, `y − ${sn(y1)} = ${sn(m)}(x − ${sn(x1)})`, `y = ${poly([m, "x"], [c, ""])}`].filter(Boolean),
    traps: [trap("ignored-point", plainPoly([m, "x"]), "The line must pass through the given point: find c.")],
  });
};

generators["L5-G2.4"] = (r, tier) => {
  const a = r.intExcept(-5, 5, [0]);
  const b = r.int(1, 4);
  const k = r.int(-6, 6);
  // line by = a x + k  → gradient a/b
  const [gn, gd] = simplify(a, b);
  const perp = r.chance(0.6);
  const [pn, pd] = perp ? simplify(-b, a) : [gn, gd];
  return item({
    skill: perp ? "The gradient of a perpendicular line" : "The gradient of a parallel line",
    prompt: `What is the gradient of a line ${perp ? "PERPENDICULAR" : "PARALLEL"} to ${b === 1 ? "" : b}y = ${poly([a, "x"], [k, ""])}?`,
    input: frac(),
    answer: fracText(pn, pd),
    hints: [`Make y the subject: y = ${fracText(gn, gd)}x + ...; the gradient is ${sn(fracText(gn, gd))}.`, "Parallel lines have EQUAL gradients.", "Perpendicular gradients multiply to −1: m₂ = −1/m₁."],
    solution: [`Gradient of the line = ${sn(fracText(gn, gd))}`, perp ? `Perpendicular gradient = −1 ÷ ${sn(fracText(gn, gd))} = ${sn(fracText(pn, pd))}` : `Parallel gradient = ${sn(fracText(gn, gd))}`],
    traps: perp ? [trap("reciprocal-only", fracText(...simplify(b, a)), "Take the NEGATIVE reciprocal: change the sign as well."), trap("negative-only", fracText(...simplify(-a, b)), "Turn the gradient upside down as well as changing its sign.")] : [trap("perpendicular", fracText(...simplify(-b, a)), "Parallel lines have the SAME gradient.")],
  });
};

/* ── L5-T1 · Solving triangles ──────────────────────────────────────── */

generators["L5-T1.1"] = (r, tier) => {
  const A = r.int(30, 80);
  const B = r.int(30, 140 - A);
  const a = r.int(5, 20);
  const findAngle = tier === "exam" && r.chance(0.5);
  const b = (a * Math.sin(rad(B))) / Math.sin(rad(A));
  if (findAngle) {
    const bShown = r1(b);
    const Bcalc = r1(deg(Math.asin((bShown * Math.sin(rad(A))) / a)));
    return item({
      skill: "The sine rule: finding an angle",
      prompt: `In triangle ABC, a = ${a} cm, b = ${bShown} cm and A = ${A}°. Find angle B (acute), to 1 decimal place.`,
      input: num({ unit: "°" }),
      answer: Bcalc,
      tolerance: 0.15,
      hints: ["sin B / b = sin A / a", `sin B = ${bShown} × sin ${A}° ÷ ${a}`, "Then B = sin⁻¹(...)."],
      solution: [`sin B = ${bShown} sin ${A}° / ${a} = ${r2((bShown * Math.sin(rad(A))) / a)}`, `B = ${Bcalc}°`],
      traps: [],
    });
  }
  return item({
    skill: "The sine rule: finding a side",
    prompt: `In triangle ABC, A = ${A}°, B = ${B}° and a = ${a} cm. Find b, to 1 decimal place.`,
    input: num({ unit: "cm" }),
    answer: r1(b),
    tolerance: 0.06,
    hints: ["The sine rule: a/sin A = b/sin B = c/sin C.", `b/sin ${B}° = ${a}/sin ${A}°`, `b = ${a} sin ${B}° / sin ${A}°`],
    solution: [`b = ${a} × sin ${B}° ÷ sin ${A}° = ${r1(b)} cm`],
    traps: [trap("upside-down", r1((a * Math.sin(rad(A))) / Math.sin(rad(B))), "Each side goes with the sine of its OPPOSITE angle: b with sin B.")],
  });
};

generators["L5-T1.2"] = (r, tier) => {
  const a = r.int(4, 15);
  const b = r.int(4, 15);
  const C = r.int(25, 140);
  const c = Math.sqrt(a * a + b * b - 2 * a * b * Math.cos(rad(C)));
  if (tier === "exam" && r.chance(0.5)) {
    const [x, y, z] = [r.int(4, 10), r.int(4, 10), r.int(4, 10)];
    if (x + y <= z || x + z <= y || y + z <= x) return generators["L5-T1.2"](r, "stretch");
    const ang = r1(deg(Math.acos((x * x + y * y - z * z) / (2 * x * y))));
    return item({
      skill: "The cosine rule: finding an angle",
      prompt: `A triangle has sides ${x} cm, ${y} cm and ${z} cm. Find the angle opposite the ${z} cm side, to 1 decimal place.`,
      input: num({ unit: "°" }),
      answer: ang,
      tolerance: 0.06,
      hints: ["cos C = (a² + b² − c²)/(2ab), where c is the side opposite C.", `cos C = (${x * x} + ${y * y} − ${z * z})/(2 × ${x} × ${y})`, `= ${r2((x * x + y * y - z * z) / (2 * x * y))}`],
      solution: [`cos C = ${x * x + y * y - z * z}/${2 * x * y}`, `C = ${ang}°`],
      traps: [],
    });
  }
  return item({
    skill: "The cosine rule: finding a side",
    prompt: `In triangle ABC, a = ${a} cm, b = ${b} cm and C = ${C}°. Find c, to 1 decimal place.`,
    input: num({ unit: "cm" }),
    answer: r1(c),
    tolerance: 0.06,
    hints: ["c² = a² + b² − 2ab cos C", `c² = ${a * a} + ${b * b} − 2 × ${a} × ${b} × cos ${C}°`, "Take the square root at the end."],
    solution: [`c² = ${a * a + b * b} − ${2 * a * b} cos ${C}° = ${r2(c * c)}`, `c = ${r1(c)} cm`],
    traps: [trap("plus", r1(Math.sqrt(a * a + b * b + 2 * a * b * Math.cos(rad(C)))), "The cosine rule SUBTRACTS 2ab cos C.")],
  });
};

generators["L5-T1.3"] = (r, tier) => {
  const a = r.int(4, 20);
  const b = r.int(4, 20);
  const C = r.pick([30, 45, 60, 90, 120, 150, r.int(20, 160)]);
  const area = 0.5 * a * b * Math.sin(rad(C));
  return item({
    skill: "Area of a triangle: ½ab sin C",
    prompt: `Find the area of a triangle with sides ${a} cm and ${b} cm and an included angle of ${C}°, to 1 decimal place.`,
    input: num({ unit: "cm²" }),
    answer: r1(area),
    tolerance: 0.06,
    hints: ["Area = ½ab sin C, where C is the angle BETWEEN sides a and b.", `½ × ${a} × ${b} × sin ${C}°`, `sin ${C}° = ${r2(Math.sin(rad(C)))}`],
    solution: [`Area = ½ × ${a} × ${b} × sin ${C}° = ${r1(area)} cm²`],
    traps: [trap("no-sine", 0.5 * a * b, "½ab is only the area when the angle is 90°. Multiply by sin C."), trap("no-half", r1(a * b * Math.sin(rad(C))), "Do not forget the ½.")].filter((t) => Math.abs(t.is - r1(area)) > 0.06),
  });
};

generators["L5-T1.4"] = (r, tier) => {
  const b1 = r.int(20, 120);
  const turn = r.int(40, 130);
  const b2 = b1 + turn;
  const d1 = r.int(4, 15);
  const d2 = r.int(4, 15);
  const angleB = 180 - turn;
  const dist = Math.sqrt(d1 * d1 + d2 * d2 - 2 * d1 * d2 * Math.cos(rad(angleB)));
  return item({
    skill: "Bearings and distance with the cosine rule",
    prompt: `A ship sails ${d1} km from A to B on a bearing of ${String(b1).padStart(3, "0")}°, then ${d2} km from B to C on a bearing of ${String(b2).padStart(3, "0")}°. How far is C from A, to 1 decimal place?`,
    input: num({ unit: "km" }),
    answer: r1(dist),
    tolerance: 0.06,
    hints: [`At B, the back bearing to A is ${String(b1 + 180).padStart(3, "0")}°.`, `So angle ABC = ${b1 + 180} − ${b2} = ${angleB}°.`, `AC² = ${d1}² + ${d2}² − 2 × ${d1} × ${d2} × cos ${angleB}°`],
    solution: [`Angle ABC = ${angleB}°`, `AC² = ${d1 * d1 + d2 * d2} − ${2 * d1 * d2} cos ${angleB}° = ${r2(dist * dist)}`, `AC = ${r1(dist)} km`],
    traps: [trap("used-turn", r1(Math.sqrt(d1 * d1 + d2 * d2 - 2 * d1 * d2 * Math.cos(rad(turn)))), "The angle inside the triangle at B is 180° minus the turn, not the turn itself.")],
  });
};

generators["L5-T1.5"] = (r, tier) => {
  const h = r.int(30, 120);
  const t1 = r.int(35, 70);
  const t2 = r.int(15, t1 - 8);
  const near = h / Math.tan(rad(t1));
  const far = h / Math.tan(rad(t2));
  return item({
    skill: "Two angles of depression",
    prompt: `From the top of a cliff ${h} m high, the angles of depression of two boats in line with the foot of the cliff are ${t1}° and ${t2}°. How far apart are the boats, to 1 decimal place?`,
    input: num({ unit: "m" }),
    answer: r1(far - near),
    tolerance: 0.15,
    hints: ["Each boat makes a right-angled triangle with the cliff: distance = height ÷ tan(angle).", `Nearer boat: ${h} ÷ tan ${t1}° = ${r1(near)} m`, `Further boat: ${h} ÷ tan ${t2}° = ${r1(far)} m`],
    solution: [`Near: ${r1(near)} m`, `Far: ${r1(far)} m`, `Apart: ${r1(far - near)} m`],
    traps: [trap("one-boat", r1(far), "That is the distance of the further boat from the cliff. Subtract the nearer one.")],
  });
};

export default generators;
