import { item, trap, num, frac, byTier } from "./kit.js";
import { simplify, fracText } from "../rng.js";
import { sn } from "./format.js";

/**
 * GENERATORS · LEVEL 3 · SIMILARITY, PYTHAGORAS AND TRIGONOMETRY,
 * SURFACE AREA AND VOLUME, STATISTICS 3
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Contains every answer for L3-G1, L3-T1, L3-G2 and L3-S1.
 * ═════════════════════════════════════════════════════════════════════════
 *
 * Trigonometry answers are marked to a stated accuracy with a tolerance of
 * half a unit in the last place, which is how an examiner marks them.
 */

export const generators = {};

const coords = { kind: "coordinates", placeholder: "e.g. (6, -2)" };
const rad = (d) => (d * Math.PI) / 180;
const deg = (x) => (x * 180) / Math.PI;
const r1 = (x) => Math.round(x * 10) / 10;
const TRIPLES = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25], [6, 8, 10], [9, 12, 15], [20, 21, 29], [9, 40, 41]];

/* ── L3-G1 · Similarity and enlargement ─────────────────────────────── */

generators["L3-G1.1"] = (r, tier) => {
  const a = r.int(2, 8);
  const b = r.int(a + 1, 12);
  const k = r.pick([1.5, 2, 2.5, 3]);
  const similar = r.chance(0.5);
  const c = a * k;
  const d = similar ? b * k : b * k + r.pick([1, 2, -1]);
  const shape = r.pick(["rectangles", "triangles with two pairs of sides"]);
  return item({
    skill: "Deciding whether two shapes are similar",
    prompt: shape === "rectangles" ? `Rectangle A is ${a} cm by ${b} cm. Rectangle B is ${c} cm by ${d} cm. Are they similar?` : `Two right-angled triangles have shorter sides ${a} cm and ${b} cm, and ${c} cm and ${d} cm. Are they similar?`,
    input: { kind: "choice", options: ["yes", "no"] },
    answer: similar ? "yes" : "no",
    hints: ["Similar shapes have the same shape: every length is multiplied by the same scale factor.", `${c} ÷ ${a} = ${c / a}`, `Is ${d} ÷ ${b} the same? ${r1(d / b)}`],
    solution: [`${c} ÷ ${a} = ${c / a}`, `${d} ÷ ${b} = ${Math.round((d / b) * 1000) / 1000}`, similar ? "The scale factors are equal, so the shapes are similar." : "The scale factors differ, so the shapes are not similar."],
    traps: [trap("added-not-multiplied", similar ? "no" : "yes", "Similar means MULTIPLIED by the same factor, not increased by the same amount. Compare the ratios.")],
  });
};

generators["L3-G1.2"] = (r, tier) => {
  const k = r.pick(byTier(tier, { build: [2, 3], stretch: [1.5, 2.5, 3], exam: [0.5, 1.5, 2.5, 4] }));
  const a = r.int(2, 10) * 2;
  const b = r.int(2, 10) * 2;
  return item({
    skill: "Finding a missing length using the scale factor",
    prompt: `Triangle ABC is similar to triangle PQR, with AB corresponding to PQ and BC to QR. AB = ${a} cm, PQ = ${a * k} cm and BC = ${b} cm. Find QR.`,
    input: num({ unit: "cm" }),
    answer: b * k,
    hints: ["Corresponding sides are in the same ratio.", `Scale factor = PQ ÷ AB = ${a * k} ÷ ${a} = ${k}`, `QR = ${b} × ${k}`],
    solution: [`Scale factor = ${a * k} ÷ ${a} = ${k}`, `QR = ${b} × ${k} = ${b * k} cm`],
    traps: [trap("added-difference", b + (a * k - a), `Similar shapes are MULTIPLIED by the scale factor, not increased by the same amount.`), trap("divided", Math.round((b / k) * 100) / 100, "The scale factor takes ABC to PQR, so multiply.")],
  });
};

generators["L3-G1.3"] = (r, tier) => {
  const k = r.pick(byTier(tier, { build: [2, 3], stretch: [2, 3, 0.5], exam: [-1, -2, 2, 3, 0.5] }));
  const centre = tier === "build" ? [0, 0] : [r.int(-3, 3), r.int(-3, 3)];
  const P = [r.int(-4, 6), r.int(-4, 6)];
  const img = [centre[0] + k * (P[0] - centre[0]), centre[1] + k * (P[1] - centre[1])];
  const c = `(${sn(centre[0])}, ${sn(centre[1])})`;
  return item({
    skill: "Enlargement from a centre",
    prompt: `The point P(${sn(P[0])}, ${sn(P[1])}) is enlarged with centre ${c} and scale factor ${sn(k)}. Find the image of P.`,
    input: coords,
    answer: `(${img[0]}, ${img[1]})`,
    hints: ["Find the movement from the centre to P.", `Centre → P: (${sn(P[0] - centre[0])}, ${sn(P[1] - centre[1])}).`, `Multiply that by ${sn(k)} and add it to the centre.${k < 0 ? " A negative scale factor puts the image on the OTHER side of the centre." : ""}`],
    solution: [`Centre → P = (${sn(P[0] - centre[0])}, ${sn(P[1] - centre[1])})`, `× ${sn(k)} = (${sn(k * (P[0] - centre[0]))}, ${sn(k * (P[1] - centre[1]))})`, `Image = ${c} + that = (${sn(img[0])}, ${sn(img[1])})`],
    traps: centre[0] || centre[1] ? [trap("from-origin", `(${k * P[0]}, ${k * P[1]})`, `That enlarges from the origin. The centre is ${c}: measure from it.`)] : [],
  });
};

/* ── L3-T1 · Pythagoras and the trigonometric ratios ────────────────── */

generators["L3-T1.1"] = (r, tier) => {
  const useTriple = tier === "build" || r.chance(0.5);
  const findHyp = r.chance(0.55);
  let a;
  let b;
  let c;
  if (useTriple) {
    const t = r.pick(TRIPLES);
    const m = tier === "build" ? 1 : r.pick([1, 2, 3]);
    [a, b, c] = t.map((v) => v * m);
  } else {
    a = r.int(3, 15);
    b = r.int(3, 15);
    c = Math.sqrt(a * a + b * b);
  }
  if (findHyp) {
    const answer = useTriple ? c : r1(c);
    return item({
      skill: "Pythagoras: finding the hypotenuse",
      prompt: `A right-angled triangle has shorter sides of ${a} cm and ${b} cm. Find the hypotenuse${useTriple ? "" : ", to 1 decimal place"}.`,
      input: num({ unit: "cm" }),
      answer,
      tolerance: useTriple ? undefined : 0.05,
      hints: ["The HYPOTENUSE is the longest side, opposite the right angle.", "c² = a² + b²", `c² = ${a * a} + ${b * b} = ${a * a + b * b}`],
      solution: [`c² = ${a}² + ${b}² = ${a * a + b * b}`, `c = √${a * a + b * b} = ${useTriple ? c : `${c.toFixed(3)}... ≈ ${answer}`} cm`],
      traps: [trap("added-sides", a + b, "Pythagoras adds the SQUARES of the sides, then takes the square root."), trap("forgot-root", a * a + b * b, "That is c². Take the square root.")],
    });
  }
  const hypShown = useTriple ? c : Math.round(c);
  const legAns = useTriple ? a : r1(Math.sqrt(hypShown * hypShown - b * b));
  return item({
    skill: "Pythagoras: finding a shorter side",
    prompt: `A right-angled triangle has hypotenuse ${hypShown} cm and one shorter side ${b} cm. Find the other side${useTriple ? "" : ", to 1 decimal place"}.`,
    input: num({ unit: "cm" }),
    answer: legAns,
    tolerance: useTriple ? undefined : 0.05,
    hints: ["The hypotenuse is the longest side: c² = a² + b².", `So a² = c² − b².`, `a² = ${hypShown * hypShown} − ${b * b} = ${hypShown * hypShown - b * b}`],
    solution: [`a² = ${hypShown}² − ${b}² = ${hypShown * hypShown - b * b}`, `a = √${hypShown * hypShown - b * b} ≈ ${legAns} cm`],
    traps: [trap("added-squares", r1(Math.sqrt(hypShown * hypShown + b * b)), "To find a SHORTER side, subtract the squares: the hypotenuse is the longest side.")],
  });
};

generators["L3-T1.2"] = (r, tier) => {
  const [o, a, h] = r.pick(TRIPLES).map((v) => v * (tier === "build" ? 1 : r.pick([1, 2])));
  const ratio = r.pick(["sin", "cos", "tan"]);
  const [n, d] = ratio === "sin" ? simplify(o, h) : ratio === "cos" ? simplify(a, h) : simplify(o, a);
  const wrong = ratio === "sin" ? simplify(a, h) : ratio === "cos" ? simplify(o, h) : simplify(a, o);
  return item({
    skill: "Sine, cosine and tangent as ratios of sides",
    prompt: `In a right-angled triangle, for the angle θ: the opposite side is ${o} cm, the adjacent side is ${a} cm and the hypotenuse is ${h} cm. Write ${ratio} θ as a fraction in its lowest terms.`,
    input: frac(),
    answer: fracText(n, d),
    exact: "lowest-terms",
    hints: ["SOH CAH TOA: sin = Opposite/Hypotenuse, cos = Adjacent/Hypotenuse, tan = Opposite/Adjacent.", `${ratio} θ = ${ratio === "sin" ? "opposite/hypotenuse" : ratio === "cos" ? "adjacent/hypotenuse" : "opposite/adjacent"}`, "Simplify the fraction."],
    solution: [`${ratio} θ = ${ratio === "sin" ? `${o}/${h}` : ratio === "cos" ? `${a}/${h}` : `${o}/${a}`} = ${fracText(n, d)}`],
    traps: [trap("wrong-pair", fracText(...wrong), "Check SOH CAH TOA: which two sides does this ratio use?")],
  });
};

generators["L3-T1.3"] = (r, tier) => {
  const findAngle = tier !== "build" && r.chance(0.5);
  if (findAngle) {
    const o = r.int(3, 15);
    const a = r.int(3, 15);
    const ang = r1(deg(Math.atan(o / a)));
    return item({
      skill: "Finding an angle with an inverse ratio",
      prompt: `In a right-angled triangle, the side opposite θ is ${o} cm and the side adjacent to θ is ${a} cm. Find θ to 1 decimal place.`,
      input: num({ unit: "°" }),
      answer: ang,
      tolerance: 0.05,
      hints: ["Opposite and adjacent: use tan.", `tan θ = ${o}/${a}`, `θ = tan⁻¹(${o}/${a}) on the calculator (in degree mode).`],
      solution: [`tan θ = ${o}/${a} = ${(o / a).toFixed(4)}`, `θ = tan⁻¹(${(o / a).toFixed(4)}) = ${ang}°`],
      traps: [trap("swapped", r1(deg(Math.atan(a / o))), "That is tan⁻¹(adjacent/opposite), the OTHER angle. tan θ = opposite/adjacent.")],
    });
  }
  const angle = r.int(15, 75);
  const known = r.int(5, 30);
  const kind = r.pick(["opp-from-hyp", "adj-from-hyp", "opp-from-adj"]);
  const spec = {
    "opp-from-hyp": { q: `the hypotenuse is ${known} cm. Find the side OPPOSITE the angle`, a: known * Math.sin(rad(angle)), f: `x = ${known} sin ${angle}°`, wrong: known * Math.cos(rad(angle)) },
    "adj-from-hyp": { q: `the hypotenuse is ${known} cm. Find the side ADJACENT to the angle`, a: known * Math.cos(rad(angle)), f: `x = ${known} cos ${angle}°`, wrong: known * Math.sin(rad(angle)) },
    "opp-from-adj": { q: `the side adjacent to it is ${known} cm. Find the side OPPOSITE the angle`, a: known * Math.tan(rad(angle)), f: `x = ${known} tan ${angle}°`, wrong: known / Math.tan(rad(angle)) },
  }[kind];
  return item({
    skill: "Finding a side with sine, cosine or tangent",
    prompt: `In a right-angled triangle, one angle is ${angle}° and ${spec.q}, to 1 decimal place.`,
    input: num({ unit: "cm" }),
    answer: r1(spec.a),
    tolerance: 0.05,
    hints: ["Label the sides opposite, adjacent and hypotenuse from the angle.", "Pick the ratio that links the side you know with the side you want.", spec.f],
    solution: [spec.f, `x = ${r1(spec.a)} cm`],
    traps: [trap("wrong-ratio", r1(spec.wrong), "That uses the wrong ratio. Check which sides SOH CAH TOA links.")],
  });
};

generators["L3-T1.4"] = (r, tier) => {
  const angle = r.int(20, 65);
  const dist = r.int(10, 80);
  const depression = r.chance(0.5);
  const findHeight = tier === "build" || r.chance(0.6);
  if (findHeight) {
    const h = r1(dist * Math.tan(rad(angle)));
    return item({
      skill: depression ? "Angle of depression" : "Angle of elevation",
      prompt: depression
        ? `From the top of a cliff, the angle of depression of a boat ${dist} m from the foot of the cliff is ${angle}°. Find the height of the cliff, to 1 decimal place.`
        : `From a point ${dist} m from the foot of a tower, the angle of elevation of the top is ${angle}°. Find the height of the tower, to 1 decimal place.`,
      input: num({ unit: "m" }),
      answer: h,
      tolerance: 0.05,
      hints: [depression ? "The angle of depression from the top equals the angle of elevation from the boat (alternate angles)." : "The angle of ELEVATION is measured up from the horizontal.", "The height is OPPOSITE the angle and the distance is ADJACENT: use tan.", `h = ${dist} tan ${angle}°`],
      solution: [`tan ${angle}° = h / ${dist}`, `h = ${dist} × tan ${angle}° = ${h} m`],
      traps: [trap("used-sin", r1(dist * Math.sin(rad(angle))), "The height and the ground distance are opposite and adjacent: use tan, not sin.")],
    });
  }
  const h = r.int(10, 60);
  const ang = r1(deg(Math.atan(h / dist)));
  return item({
    skill: "Finding an angle of elevation",
    prompt: `A pole ${h} m tall stands on level ground. Find the angle of elevation of its top from a point ${dist} m from its foot, to 1 decimal place.`,
    input: num({ unit: "°" }),
    answer: ang,
    tolerance: 0.05,
    hints: ["Draw it: height opposite the angle, ground distance adjacent.", `tan θ = ${h}/${dist}`, `θ = tan⁻¹(${h}/${dist})`],
    solution: [`tan θ = ${h}/${dist}`, `θ = ${ang}°`],
    traps: [trap("inverted", r1(deg(Math.atan(dist / h))), "tan θ = opposite/adjacent = height/distance, not the other way round.")],
  });
};

/* ── L3-G2 · Surface area and volume ────────────────────────────────── */

generators["L3-G2.1"] = (r, tier) => {
  const r7 = 7 * r.int(1, 3);
  const h = r.int(3, 20);
  const kind = r.pick(byTier(tier, { build: ["curved", "volume"], stretch: ["curved", "total"], exam: ["total", "open-top"] }));
  const curved = (2 * 22 * r7 * h) / 7;
  const circle = (22 * r7 * r7) / 7;
  const spec = {
    curved: { q: "the CURVED surface area", a: curved, s: [`Curved = 2πrh = 2 × 22/7 × ${r7} × ${h} = ${curved}`], t: trap("added-ends", curved + 2 * circle, "Curved surface only: the two flat ends are not included.") },
    volume: { q: "the VOLUME", a: circle * h, s: [`V = πr²h = 22/7 × ${r7}² × ${h} = ${circle * h}`], t: trap("used-curved", curved, "That is the curved surface area. Volume = πr²h.") },
    total: { q: "the TOTAL surface area (closed at both ends)", a: curved + 2 * circle, s: [`Curved = ${curved}`, `Two ends = 2 × 22/7 × ${r7}² = ${2 * circle}`, `Total = ${curved + 2 * circle}`], t: trap("one-end", curved + circle, "A closed cylinder has TWO circular ends.") },
    "open-top": { q: "the total outside surface area of the tank, which is open at the top", a: curved + circle, s: [`Curved = ${curved}`, `One base = ${circle}`, `Total = ${curved + circle}`], t: trap("two-ends", curved + 2 * circle, "The tank is OPEN at the top: only one circular end.") },
  }[kind];
  return item({
    skill: "Surface area and volume of a cylinder",
    prompt: `A cylinder has radius ${r7} cm and height ${h} cm. Find ${spec.q}. Take π = 22/7.`,
    input: num({ unit: kind === "volume" ? "cm³" : "cm²" }),
    answer: spec.a,
    hints: ["Unrolled, the curved surface is a rectangle: 2πr wide and h high.", "Each flat end is a circle of area πr².", spec.s[0]],
    solution: spec.s,
    traps: [spec.t],
  });
};

generators["L3-G2.2"] = (r, tier) => {
  const kind = r.pick(byTier(tier, { build: ["pyramid", "cone-volume"], stretch: ["cone-volume", "cone-curved"], exam: ["cone-curved", "cone-slant", "pyramid"] }));
  if (kind === "pyramid") {
    const s = r.int(3, 12);
    const h = r.int(2, 12) * 3;
    return item({
      skill: "Volume of a pyramid",
      prompt: `A pyramid has a square base of side ${s} cm and a perpendicular height of ${h} cm. Find its volume.`,
      input: num({ unit: "cm³" }),
      answer: (s * s * h) / 3,
      hints: ["Volume of any pyramid or cone = ⅓ × base area × height.", `Base area = ${s}² = ${s * s}`, `⅓ × ${s * s} × ${h}`],
      solution: [`V = ⅓ × ${s * s} × ${h} = ${(s * s * h) / 3} cm³`],
      traps: [trap("forgot-third", s * s * h, "A pyramid is ONE THIRD of the prism with the same base and height.")],
    });
  }
  const [rr, hh, ll] = r.pick([[3, 4, 5], [5, 12, 13], [6, 8, 10], [7, 24, 25], [9, 12, 15], [8, 15, 17]]);
  if (kind === "cone-volume") {
    const r7 = 7 * r.int(1, 2);
    const h = r.int(1, 6) * 3;
    return item({
      skill: "Volume of a cone",
      prompt: `A cone has base radius ${r7} cm and height ${h} cm. Find its volume. Take π = 22/7.`,
      input: num({ unit: "cm³" }),
      answer: (22 * r7 * r7 * h) / 21,
      hints: ["V = ⅓πr²h", `πr² = 22/7 × ${r7 * r7} = ${(22 * r7 * r7) / 7}`, `⅓ × ${(22 * r7 * r7) / 7} × ${h}`],
      solution: [`V = ⅓ × 22/7 × ${r7}² × ${h} = ${(22 * r7 * r7 * h) / 21} cm³`],
      traps: [trap("forgot-third", (22 * r7 * r7 * h) / 7, "A cone is ONE THIRD of the cylinder with the same base and height.")],
    });
  }
  if (kind === "cone-slant") {
    return item({
      skill: "The slant height of a cone",
      prompt: `A cone has base radius ${rr} cm and perpendicular height ${hh} cm. Find its slant height.`,
      input: num({ unit: "cm" }),
      answer: ll,
      hints: ["The radius, the height and the slant height form a right-angled triangle.", "The slant height is the hypotenuse: l² = r² + h².", `l² = ${rr * rr} + ${hh * hh}`],
      solution: [`l² = ${rr}² + ${hh}² = ${ll * ll}`, `l = ${ll} cm`],
      traps: [trap("added", rr + hh, "Use Pythagoras: l² = r² + h².")],
    });
  }
  return item({
    skill: "Curved surface area of a cone",
    prompt: `A cone has base radius ${rr} cm and perpendicular height ${hh} cm. Find its curved surface area, using π = 3.142, to 1 decimal place.`,
    input: num({ unit: "cm²" }),
    answer: Math.round(3.142 * rr * ll * 10) / 10,
    tolerance: 0.1,
    hints: ["Curved surface = πrl, where l is the SLANT height.", `l = √(${rr}² + ${hh}²) = ${ll}`, `3.142 × ${rr} × ${ll}`],
    solution: [`l = √(${rr * rr} + ${hh * hh}) = ${ll}`, `Curved area = πrl = 3.142 × ${rr} × ${ll} = ${Math.round(3.142 * rr * ll * 10) / 10} cm²`],
    traps: [trap("used-height", Math.round(3.142 * rr * hh * 10) / 10, "Use the SLANT height l, not the perpendicular height.")],
  });
};

generators["L3-G2.3"] = (r, tier) => {
  const kind = r.pick(byTier(tier, { build: ["cm3", "box"], stretch: ["box", "m3"], exam: ["m3", "cylinder-cups"] }));
  if (kind === "cm3") {
    const v = r.int(2, 90) * 250;
    return item({ skill: "cm³ to litres", prompt: `A container holds ${v.toLocaleString("en-US")} cm³. How many litres is that?`, input: num({ unit: "litres" }), answer: v / 1000, hints: ["1 litre = 1 000 cm³.", "Divide by 1 000.", `${v} ÷ 1 000`], solution: [`${v} ÷ 1 000 = ${v / 1000} litres`], traps: [trap("divided-100", v / 100, "1 litre is 1 000 cm³, not 100.")] });
  }
  if (kind === "box") {
    const [l, w, h] = [r.int(2, 6) * 10, r.int(2, 5) * 10, r.int(1, 4) * 10];
    return item({ skill: "The capacity of a box in litres", prompt: `A water tank measures ${l} cm by ${w} cm by ${h} cm. How many litres does it hold when full?`, input: num({ unit: "litres" }), answer: (l * w * h) / 1000, hints: ["Volume first, in cm³.", `${l} × ${w} × ${h} = ${l * w * h} cm³`, "1 litre = 1 000 cm³."], solution: [`V = ${l * w * h} cm³`, `= ${(l * w * h) / 1000} litres`], traps: [trap("not-converted", l * w * h, "That is in cm³. Divide by 1 000 for litres.")] });
  }
  if (kind === "m3") {
    const [l, w, h] = [r.int(2, 6), r.int(1, 4), r.pick([1, 1.5, 2])];
    return item({ skill: "m³ to litres", prompt: `A reservoir measures ${l} m by ${w} m by ${h} m. How many litres does it hold?`, input: num({ unit: "litres" }), answer: l * w * h * 1000, hints: ["1 m³ = 1 000 litres.", `V = ${l * w * h} m³`, "Multiply by 1 000."], solution: [`V = ${l * w * h} m³ = ${l * w * h * 1000} litres`], traps: [trap("used-cm-rule", (l * w * h) / 1000, "1 m³ is 1 000 LITRES (a cubic metre is a big box). Multiply.")] });
  }
  const r7 = 7;
  const h = r.int(2, 6) * 10;
  const vol = (22 * r7 * r7 * h) / 7;
  const cup = r.pick([154, 220, 308]);
  return item({ skill: "How many cups fill a container", prompt: `A cylindrical pot has radius 7 cm and height ${h} cm. How many full cups of ${cup} cm³ can be poured from it? Take π = 22/7.`, input: num(), answer: Math.floor(vol / cup), hints: ["Volume of the pot: πr²h.", `22/7 × 49 × ${h} = ${vol} cm³`, `${vol} ÷ ${cup}, rounded DOWN to whole cups.`], solution: [`Pot: ${vol} cm³`, `${vol} ÷ ${cup} = ${Math.round((vol / cup) * 100) / 100}`, `Full cups: ${Math.floor(vol / cup)}`], traps: Number.isInteger(vol / cup) ? [] : [trap("rounded-up", Math.ceil(vol / cup), "The last cup would not be full: round DOWN.")] });
};

/* ── L3-S1 · Statistics 3 ───────────────────────────────────────────── */

generators["L3-S1.1"] = (r, tier) => {
  const xs = byTier(tier, { build: [1, 2, 3, 4, 5], stretch: [0, 1, 2, 3, 4, 5], exam: [10, 11, 12, 13, 14, 15] });
  const fs = xs.map(() => r.int(1, 9));
  const total = fs.reduce((a, b) => a + b, 0);
  const ask = r.pick(["mode", "median"]);
  if (ask === "mode") {
    const max = Math.max(...fs);
    if (fs.filter((f) => f === max).length > 1) return generators["L3-S1.1"](r, tier === "build" ? "stretch" : "build");
    const mode = xs[fs.indexOf(max)];
    return item({
      skill: "The mode from a frequency table",
      prompt: `Find the mode of this distribution.\n\nx:   ${xs.join("   ")}\nf:   ${fs.join("   ")}`,
      input: num(),
      answer: mode,
      hints: ["The mode is the VALUE with the highest frequency.", `The highest frequency is ${max}.`, "Which x has that frequency?"],
      solution: [`Highest frequency: ${max}, for x = ${mode}.`, `Mode = ${mode}`],
      traps: [trap("gave-frequency", max, "That is the frequency. The mode is the VALUE of x that occurs most.")],
    });
  }
  let cum = 0;
  const cums = fs.map((f) => (cum += f));
  const pos = (total + 1) / 2;
  const valueAt = (p) => xs[cums.findIndex((c) => c >= p)];
  const median = Number.isInteger(pos) ? valueAt(pos) : (valueAt(Math.floor(pos)) + valueAt(Math.ceil(pos))) / 2;
  return item({
    skill: "The median from a frequency table",
    prompt: `Find the median of this distribution.\n\nx:   ${xs.join("   ")}\nf:   ${fs.join("   ")}`,
    input: num(),
    answer: median,
    hints: [`There are ${total} values. The median is the ${Number.isInteger(pos) ? `${pos}th` : `${Math.floor(pos)}th and ${Math.ceil(pos)}th`} value.`, `Running totals of f: ${cums.join(", ")}`, "Find the first running total that reaches that position."],
    solution: [`Σf = ${total}; median position = (${total} + 1) ÷ 2 = ${pos}`, `Cumulative frequencies: ${cums.join(", ")}`, `Median = ${median}`],
    traps: [trap("middle-x", (xs[0] + xs[xs.length - 1]) / 2, "That is the middle of the x values, ignoring how often each occurs. Use the cumulative frequencies.")],
  });
};

generators["L3-S1.2"] = (r, tier) => {
  const [situation, answer, why] = r.pick([
    ["Monthly salaries in a small company: ₦80k, ₦85k, ₦90k, ₦95k and the owner's ₦2m. Which average best describes a typical salary?", "median", "One huge value (an outlier) drags the mean up; the median is not affected by it."],
    ["A shoe shop wants to know which size to stock most of.", "mode", "The most common size is the one most customers need: that is the mode."],
    ["The favourite colours of 30 pupils are recorded. Which average can be used?", "mode", "Colours are not numbers, so there is no mean or median: only the mode makes sense."],
    ["Test scores of a class are spread evenly with no extreme values. Which average uses every score?", "mean", "The mean uses every value, which is ideal when there are no outliers."],
    ["House prices in a town include a few mansions worth far more than the rest. Which average is least affected?", "median", "Extreme values pull the mean; the median depends only on the middle."],
  ]);
  return item({
    skill: "Choosing the best average",
    prompt: situation,
    input: { kind: "choice", options: ["mean", "median", "mode"] },
    answer,
    hints: ["Mean: uses every value, but is pulled by extreme values.", "Median: the middle, not affected by extremes.", "Mode: the most common, and the only one for data that is not numbers."],
    solution: [why],
    traps: [trap("default-mean", answer === "mean" ? "median" : "mean", why)],
  });
};

generators["L3-S1.3"] = (r, tier) => {
  const total = r.pick([200, 240, 300, 360, 400, 600]);
  const pct = r.pick([10, 15, 20, 25, 30, 35, 40]);
  const kind = r.pick(byTier(tier, { build: ["pct-to-count"], stretch: ["pct-to-count", "angle-to-pct"], exam: ["angle-to-pct", "difference"] }));
  if (kind === "pct-to-count") {
    return item({ skill: "Reading a percentage chart", prompt: `A chart shows that ${pct}% of the ${total} students in a school walk to school. How many students walk?`, input: num(), answer: (pct * total) / 100, hints: [`${pct}% of ${total}`, `${total} × ${pct} ÷ 100`, "Multiply, then divide by 100."], solution: [`${pct}% of ${total} = ${(pct * total) / 100}`], traps: [trap("gave-percent", pct, "That is the percentage. Find that percentage of the total.")] });
  }
  if (kind === "angle-to-pct") {
    const angle = (pct / 100) * 360;
    return item({ skill: "From a pie chart angle to a percentage", prompt: `On a pie chart, the sector for 'bus' has an angle of ${angle}°. What percentage of people travel by bus?`, input: num({ unit: "%" }), answer: pct, hints: ["The whole circle, 360°, is 100%.", `${angle}/360 × 100`, `= ${pct}`], solution: [`${angle} ÷ 360 × 100 = ${pct}%`], traps: [trap("gave-angle", angle, "That is the angle. Convert it: angle ÷ 360 × 100.")] });
  }
  const p2 = r.pick([5, 10, 15, 20].filter((v) => v !== pct));
  return item({ skill: "Comparing two parts of a chart", prompt: `In a survey of ${total} people, ${pct}% prefer rice and ${p2}% prefer yam. How many MORE people prefer ${pct > p2 ? "rice" : "yam"}?`, input: num(), answer: (Math.abs(pct - p2) * total) / 100, hints: ["Find each number, or find the difference in percentages first.", `${Math.abs(pct - p2)}% of ${total}`, `${total} × ${Math.abs(pct - p2)} ÷ 100`], solution: [`Difference = ${Math.abs(pct - p2)}% of ${total} = ${(Math.abs(pct - p2) * total) / 100}`], traps: [trap("gave-percent-difference", Math.abs(pct - p2), "That is the difference in PERCENTAGE points. Turn it into a number of people.")] });
};

export default generators;
