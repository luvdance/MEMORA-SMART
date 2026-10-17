import { item, trap, num, byTier } from "./kit.js";

/**
 * GENERATORS · LEVEL 1 · ANGLES, NAMING SHAPES, SYMMETRY
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Contains every answer for L1-G3, L1-G1.1 and L1-G1.4.
 * ═════════════════════════════════════════════════════════════════════════
 *
 * Classification items are choices, because the skill IS choosing the right
 * name. Every angle-fact item is a typed number.
 */

export const generators = {};

const choice = (options) => ({ kind: "choice", options });

/* ── L1-G3.1 · Classifying angles ───────────────────────────────────── */

const ANGLE_TYPES = ["acute", "right", "obtuse", "straight", "reflex"];

function angleType(a) {
  if (a < 90) return "acute";
  if (a === 90) return "right";
  if (a < 180) return "obtuse";
  if (a === 180) return "straight";
  return "reflex";
}

generators["L1-G3.1"] = (r, tier) => {
  const pool = byTier(tier, {
    build: [r.int(10, 80), 90, r.int(100, 170), 180, r.int(190, 350)],
    stretch: [r.int(85, 89), r.int(91, 95), r.int(175, 179), r.int(181, 190), 90, 180],
    exam: [r.int(181, 359), r.int(91, 179), r.int(1, 89), 270],
  });
  const a = r.pick(pool);
  const answer = angleType(a);
  const near = { acute: "right", right: "acute", obtuse: a < 135 ? "acute" : "straight", straight: "obtuse", reflex: "obtuse" }[answer];
  return item({
    skill: "Naming an angle by its size",
    prompt: `What type of angle is ${a}°?`,
    input: choice(ANGLE_TYPES),
    answer,
    hints: ["Acute: less than 90°. Right: exactly 90°. Obtuse: between 90° and 180°.", "Straight: exactly 180°. Reflex: between 180° and 360°.", `Compare ${a}° with 90° and 180°.`],
    solution: [`${a}° is ${a < 90 ? "less than 90°" : a === 90 ? "exactly 90°" : a < 180 ? "between 90° and 180°" : a === 180 ? "exactly 180°" : "more than 180°"}.`, `So it is ${answer === "acute" || answer === "obtuse" ? "an" : "a"} ${answer} angle.`],
    traps: [trap(`said-${near}`, near, `${a}° is ${answer}, not ${near}. Check it against 90° and 180°.`)],
  });
};

/* ── L1-G3.2 · Measuring and drawing angles ─────────────────────────── */

generators["L1-G3.2"] = (r, tier) => {
  if (tier === "exam" || (tier === "stretch" && r.chance(0.5))) {
    const h = r.int(1, 11);
    const answer = Math.min(h * 30, 360 - h * 30);
    return item({
      skill: "Angles on a clock face",
      prompt: `What is the smaller angle between the hands of a clock at exactly ${h} o'clock?`,
      input: num({ unit: "°" }),
      answer,
      hints: ["A full turn is 360° and the clock face has 12 hours.", "So each hour mark is 360 ÷ 12 = 30° apart.", `At ${h} o'clock the hands are ${h} hour marks apart (or ${12 - h} the other way).`],
      solution: [`Each hour = 30°.`, `${h} × 30 = ${h * 30}°${h > 6 ? `, and the other way round is ${360 - h * 30}°` : ""}.`, `Smaller angle: ${answer}°.`],
      traps: [h > 6 ? trap("took-reflex", h * 30, "That is the larger angle, the reflex one. The question asks for the smaller.") : null, trap("used-five-degrees", h * 5, "Each hour mark is 360 ÷ 12 = 30°, not 5°. (5 is the number of minutes between marks.)")].filter(Boolean),
    });
  }

  const inner = r.int(2, 16) * 10 + r.pick([0, 5]);
  const outer = 180 - inner;
  const onOuterZero = r.chance(0.5);
  const answer = onOuterZero ? outer : inner;
  return item({
    skill: "Reading the correct scale on a protractor",
    prompt: `One arm of an angle lies along the ZERO of the protractor's ${onOuterZero ? "OUTER" : "INNER"} scale. The other arm crosses the protractor where the inner scale reads ${inner}° and the outer scale reads ${outer}°.\n\nWhat is the size of the angle?`,
    input: num({ unit: "°" }),
    answer,
    hints: ["A protractor has two scales, running in opposite directions.", "Use the scale whose ZERO the first arm lies on.", `The first arm is on the zero of the ${onOuterZero ? "outer" : "inner"} scale, so read the ${onOuterZero ? "outer" : "inner"} scale.`],
    solution: [`Start from the zero the arm lies on: the ${onOuterZero ? "outer" : "inner"} scale.`, `Read the same scale where the other arm crosses: ${answer}°.`, `Check: ${answer}° is ${answer < 90 ? "acute" : answer === 90 ? "right" : "obtuse"}, and the angle should look ${answer < 90 ? "acute" : "obtuse"}.`],
    traps: [trap("wrong-scale", onOuterZero ? inner : outer, `That is the other scale. Read the scale that starts at 0 on the first arm: ${answer}°.`)],
  });
};

/* ── L1-G3.3 · Angles on a line, at a point, vertically opposite ───── */

generators["L1-G3.3"] = (r, tier) => {
  const kind = r.pick(byTier(tier, { build: ["line", "point", "vertical"], stretch: ["line", "point", "line-algebra"], exam: ["line-algebra", "point-algebra", "vertical-algebra"] }));

  if (kind === "line") {
    const a = r.int(20, 80);
    const b = r.int(20, 160 - a - 10);
    const x = 180 - a - b;
    return item({
      skill: "Angles on a straight line add up to 180°",
      prompt: `Three angles lie together on a straight line: ${a}°, ${b}° and x.\n\nFind x.`,
      input: num({ unit: "°" }),
      answer: x,
      hints: ["Angles on a straight line add up to 180°.", `${a} + ${b} + x = 180`, `x = 180 − ${a + b}`],
      solution: [`Angles on a straight line: ${a} + ${b} + x = 180`, `x = 180 − ${a + b} = ${x}°`],
      traps: [trap("used-360", 360 - a - b, "That uses 360°. Angles on a straight LINE add up to 180°; 360° is for angles round a point.")],
    });
  }
  if (kind === "point") {
    const a = r.int(60, 140);
    const b = r.int(40, 120);
    const c = r.int(30, 100);
    const x = 360 - a - b - c;
    if (x < 20) return generators["L1-G3.3"](r, tier);
    return item({
      skill: "Angles round a point add up to 360°",
      prompt: `Four angles meet at a point: ${a}°, ${b}°, ${c}° and x.\n\nFind x.`,
      input: num({ unit: "°" }),
      answer: x,
      hints: ["Angles round a point add up to 360°.", `${a} + ${b} + ${c} + x = 360`, `x = 360 − ${a + b + c}`],
      solution: [`${a} + ${b} + ${c} = ${a + b + c}`, `x = 360 − ${a + b + c} = ${x}°`],
      traps: [trap("used-180", 180 - a - b - c, "Angles round a POINT add up to 360°, not 180°.")],
    });
  }
  if (kind === "vertical") {
    const a = r.int(25, 155);
    const askOpposite = r.chance(0.5);
    return item({
      skill: "Vertically opposite angles are equal",
      prompt: `Two straight lines cross. One of the four angles is ${a}°.\n\nFind the angle ${askOpposite ? "vertically opposite it" : "next to it, on the same straight line"}.`,
      input: num({ unit: "°" }),
      answer: askOpposite ? a : 180 - a,
      hints: ["When two lines cross, opposite angles are equal.", "Neighbouring angles lie on a straight line, so they add up to 180°.", askOpposite ? "Opposite: equal." : `Next to it: 180 − ${a}.`],
      solution: [askOpposite ? `Vertically opposite angles are equal: ${a}°.` : `Angles on a straight line: 180 − ${a} = ${180 - a}°.`],
      traps: [trap(askOpposite ? "used-line" : "used-opposite", askOpposite ? 180 - a : a, askOpposite ? "That is the angle next to it. Vertically OPPOSITE angles are equal." : "That is the opposite angle. The one NEXT to it shares a straight line, so they add to 180°.")],
    });
  }

  // algebraic versions: choose x first so the answer is a whole number
  const p = r.int(2, 5);
  const q = r.int(1, 4);
  const x = r.int(10, 30);
  if (kind === "line-algebra") {
    const c = 180 - (p + q) * x;
    if (c <= 0) return generators["L1-G3.3"](r, "build");
    return item({
      skill: "Forming an equation from angles on a line",
      prompt: `Angles of ${p}x, ${q}x and ${c}° lie together on a straight line.\n\nFind x.`,
      input: num(),
      answer: x,
      hints: ["Angles on a straight line add up to 180°.", `${p}x + ${q}x + ${c} = 180`, `${p + q}x = ${180 - c}`],
      solution: [`${p}x + ${q}x + ${c} = 180`, `${p + q}x = ${180 - c}`, `x = ${180 - c} ÷ ${p + q} = ${x}`],
      traps: [trap("gave-angle", p * x, `That is the size of the ${p}x angle. The question asks for x itself.`)],
    });
  }
  if (kind === "point-algebra") {
    const c = 360 - (p + q + 1) * x;
    if (c <= 0) return generators["L1-G3.3"](r, "build");
    return item({
      skill: "Forming an equation from angles round a point",
      prompt: `Angles of ${p}x, ${q}x, x and ${c}° meet at a point.\n\nFind x.`,
      input: num(),
      answer: x,
      hints: ["Angles round a point add up to 360°.", `${p}x + ${q}x + x + ${c} = 360`, `${p + q + 1}x = ${360 - c}`],
      solution: [`${p + q + 1}x + ${c} = 360`, `${p + q + 1}x = ${360 - c}`, `x = ${x}`],
      traps: c < 180 ? [trap("used-180", Math.round(((180 - c) / (p + q + 1)) * 100) / 100, "Round a POINT the total is 360°, not 180°.")] : [],
    });
  }
  const k = r.int(5, 40);
  const coef = r.int(2, 4);
  const opp = coef * x + k;
  return item({
    skill: "Forming an equation from vertically opposite angles",
    prompt: `Two straight lines cross. One angle is ${coef}x + ${k}° and the angle vertically opposite it is ${opp}°.\n\nFind x.`,
    input: num(),
    answer: x,
    hints: ["Vertically opposite angles are equal.", `${coef}x + ${k} = ${opp}`, `${coef}x = ${opp - k}`],
    solution: [`${coef}x + ${k} = ${opp}`, `${coef}x = ${opp - k}`, `x = ${x}`],
    traps: opp + k < 180 ? [trap("added-to-180", Math.round(((180 - opp - k) / coef) * 100) / 100, "Vertically opposite angles are EQUAL. They do not add up to 180°.")] : [],
  });
};

/* ── L1-G1.1 · Triangles and quadrilaterals ─────────────────────────── */

const TRIANGLES = ["equilateral", "isosceles", "scalene", "right-angled"];
const QUADS = ["square", "rectangle", "rhombus", "parallelogram", "trapezium", "kite"];
const POLYGONS = [[5, "pentagon"], [6, "hexagon"], [7, "heptagon"], [8, "octagon"], [9, "nonagon"], [10, "decagon"]];

generators["L1-G1.1"] = (r, tier) => {
  const kind = r.pick(byTier(tier, { build: ["tri", "quad"], stretch: ["tri", "quad", "poly"], exam: ["quad", "quad", "poly"] }));

  if (kind === "tri") {
    const [desc, answer, why] = r.pick([
      ["all three sides equal", "equilateral", "All three sides equal means equilateral, and then all three angles are 60°."],
      ["exactly two sides equal", "isosceles", "Two equal sides means isosceles. The angles opposite those sides are equal too."],
      ["no two sides equal", "scalene", "No equal sides means scalene."],
      ["one angle of exactly 90°", "right-angled", "A 90° angle makes it right-angled."],
      ["two equal angles of 50°", "isosceles", "Two equal angles mean the two sides opposite them are equal: isosceles."],
    ]);
    return item({
      skill: "Naming a triangle from its properties",
      prompt: `A triangle has ${desc}. What type of triangle is it?`,
      input: choice(TRIANGLES),
      answer,
      hints: ["Equilateral: 3 equal sides. Isosceles: 2 equal sides. Scalene: no equal sides.", "Right-angled: one angle of 90°.", "Equal angles sit opposite equal sides."],
      solution: [why],
      traps: [answer === "isosceles" ? trap("said-equilateral", "equilateral", "Equilateral needs ALL THREE sides equal. Two equal sides is isosceles.") : trap("said-isosceles", answer === "equilateral" ? "isosceles" : "equilateral", why)],
    });
  }

  if (kind === "quad") {
    const [desc, answer, why, near] = r.pick([
      ["four equal sides and four right angles", "square", "Four equal sides AND four right angles: a square.", "rhombus"],
      ["four equal sides but no right angles", "rhombus", "Four equal sides without right angles is a rhombus.", "square"],
      ["two pairs of equal opposite sides and four right angles, but not all sides equal", "rectangle", "Opposite sides equal with right angles: a rectangle.", "parallelogram"],
      ["two pairs of parallel sides, opposite sides equal, and no right angles", "parallelogram", "Two pairs of parallel sides without right angles: a parallelogram.", "rectangle"],
      ["exactly one pair of parallel sides", "trapezium", "Exactly one pair of parallel sides: a trapezium.", "parallelogram"],
      ["two pairs of equal ADJACENT sides and one line of symmetry through two corners", "kite", "Equal sides next to each other, not opposite: a kite.", "rhombus"],
      ["diagonals that are equal and cross at right angles, and all sides equal", "square", "All sides equal with equal diagonals: a square (a rhombus has unequal diagonals).", "rhombus"],
    ]);
    return item({
      skill: "Naming a quadrilateral from its properties",
      prompt: `A quadrilateral has ${desc}. What is it?`,
      input: choice(QUADS),
      answer,
      hints: ["Count the pairs of parallel sides first: two pairs, one pair, or none.", "Then check: are all sides equal? are there right angles?", "A square is a special rectangle AND a special rhombus. Choose the most exact name."],
      solution: [why],
      traps: [trap(`said-${near}`, near, why)],
    });
  }

  const [n, name] = r.pick(POLYGONS);
  const regular = r.chance(0.5);
  return item({
    skill: "Naming a polygon by its number of sides",
    prompt: regular ? `A regular polygon has ${n} equal sides and ${n} equal angles. What is it called?` : `What is the name of a polygon with ${n} sides?`,
    input: choice(POLYGONS.map((p) => p[1])),
    answer: name,
    hints: ["Penta 5, hexa 6, hepta 7, octa 8, nona 9, deca 10.", "An octopus has 8 arms.", `Find the prefix that means ${n}.`],
    solution: [`A ${n}-sided polygon is a ${name}.`],
    traps: [trap("off-by-one", POLYGONS.find((p) => p[0] === n + 1)?.[1] ?? POLYGONS.find((p) => p[0] === n - 1)[1], `That name is for a polygon with a different number of sides. ${n} sides is a ${name}.`)],
  });
};

/* ── L1-G1.4 · Symmetry ─────────────────────────────────────────────── */

const SYMMETRY = [
  ["square", 4, 4],
  ["rectangle", 2, 2],
  ["rhombus", 2, 2],
  ["parallelogram", 0, 2],
  ["kite", 1, 1],
  ["isosceles trapezium", 1, 1],
  ["equilateral triangle", 3, 3],
  ["isosceles triangle", 1, 1],
  ["scalene triangle", 0, 1],
  ["regular pentagon", 5, 5],
  ["regular hexagon", 6, 6],
  ["regular octagon", 8, 8],
];

generators["L1-G1.4"] = (r, tier) => {
  const pool = tier === "build" ? SYMMETRY.slice(0, 8) : SYMMETRY;
  const [shape, lines, order] = r.pick(pool);
  const askLines = r.chance(0.5);
  const answer = askLines ? lines : order;
  const KNOWN = {
    parallelogram: [2, "A parallelogram has NO lines of symmetry: folding along a diagonal does not fit. It does have rotational symmetry of order 2."],
    rectangle: [4, "The diagonals of a rectangle are not lines of symmetry: fold along one and the corners miss. A rectangle has 2."],
    rhombus: [4, "A rhombus has 2 lines of symmetry, its two diagonals. The lines through the middles of its sides are not lines of symmetry."],
  };
  const [wrong, wrongSays] =
    askLines && KNOWN[shape]
      ? KNOWN[shape]
      : askLines
        ? [lines + 1, `Count again: a ${shape} has ${lines} line${lines === 1 ? "" : "s"} of symmetry.`]
        : [order === 1 ? 0 : order - 1, order === 1 ? "Every shape fits onto itself after a full turn, so the order is never less than 1." : `Count the positions in one full turn: a ${shape} has rotational symmetry of order ${order}.`];
  return item({
    skill: askLines ? "Counting lines of symmetry" : "Finding the order of rotational symmetry",
    prompt: askLines ? `How many lines of symmetry does a ${shape} have?` : `What is the order of rotational symmetry of a ${shape}?`,
    input: num(),
    answer,
    hints: askLines
      ? ["A line of symmetry folds the shape exactly onto itself.", "Diagonals are only lines of symmetry when the shape is a square or a rhombus.", "A regular polygon with n sides has n lines of symmetry."]
      : ["Count how many times the shape looks exactly the same during one full turn.", "Every shape fits onto itself at least once (after a full turn), so the order is at least 1.", "A regular polygon with n sides has rotational symmetry of order n."],
    solution: [askLines ? `A ${shape} has ${lines} line${lines === 1 ? "" : "s"} of symmetry.` : `A ${shape} looks the same ${order} time${order === 1 ? "" : "s"} in a full turn: order ${order}.`],
    traps: [trap("common-miscount", wrong, wrongSays)],
  });
};

export default generators;
