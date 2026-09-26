import { item, trap, num, byTier } from "./kit.js";
import { tidy } from "../rng.js";

/**
 * GENERATORS · LEVEL 1 · PLANE SHAPE AND SOLID
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Contains every answer for L1-G1 and L1-G2.3.
 * ═════════════════════════════════════════════════════════════════════════
 *
 * The area formulas are where the marks go, and they go for two reasons that
 * have nothing to do with arithmetic.
 *
 * THE HALF. A triangle is half of the rectangle that boxes it in, and a
 * candidate who forgets the half gets exactly twice the right answer. That is
 * such a specific error that the trap can say so and be believed, and the
 * message points at the picture rather than at the formula, because the formula
 * was not the thing that failed.
 *
 * THE PERPENDICULAR HEIGHT. Every one of these formulas wants the height
 * measured at right angles to the base, and exam diagrams supply a slant side
 * as well, precisely to see whether the candidate knows the difference. Using
 * the slant gives an answer slightly too big, which looks plausible and is
 * wrong, so these items give both numbers and trap the slant explicitly.
 *
 * Perimeter and area are also trapped against each other in both directions,
 * because confusing them is the commonest single error in the whole of
 * mensuration, and the units are the tell: cm against cm squared.
 */

export const generators = {};

/* ═══════════════════════════════════════════════════════════════════════
   L1-G1.2 · PERIMETER OF PLANE SHAPES
   ═══════════════════════════════════════════════════════════════════════ */

generators["L1-G1.2"] = (r, tier) => {
  const shape = r.pick(
    byTier(tier, {
      build: ["square", "triangle"],
      stretch: ["triangle", "parallelogram", "trapezium"],
      exam: ["trapezium", "parallelogram", "polygon"],
    })
  );

  if (shape === "square") {
    const s = r.int(4, 24);
    return item({
      skill: "Perimeter of a square",
      prompt: `A square has sides of ${s} cm.\n\nWhat is its perimeter?`,
      input: num({ placeholder: "cm" }),
      unit: "cm",
      answer: 4 * s,
      visual: { kind: "rectangle", width: s, height: s, label: "perimeter" },
      hints: [
        "Perimeter is the distance all the way round the outside.",
        "A square has four sides and they are all the same length.",
        `So ${s} four times, or 4 × ${s}.`,
      ],
      solution: [`All four sides are ${s} cm.`, `P = 4 × ${s} = ${4 * s} cm`],
      traps: [
        trap(
          "found-area",
          s * s,
          `That is the AREA, the space inside. Perimeter is the distance round the edge, so the sides are added rather than multiplied together. The units tell you which is which: a perimeter is in cm and an area is in cm².`,
          "L1-G1.3"
        ),
        trap("two-sides", 2 * s, "You added two sides. A square has four."),
      ],
    });
  }

  if (shape === "triangle") {
    const a = r.int(5, 18);
    const b = r.int(5, 18);
    const c = r.int(Math.max(2, Math.abs(a - b) + 1), a + b - 1);
    return item({
      skill: "Perimeter of a triangle",
      prompt: `A triangle has sides of ${a} cm, ${b} cm and ${c} cm.\n\nWhat is its perimeter?`,
      input: num({ placeholder: "cm" }),
      unit: "cm",
      answer: a + b + c,
      hints: [
        "Perimeter is the distance all the way round, whatever the shape.",
        "There is no formula to remember here. Add the sides you were given.",
        `${a} + ${b} + ${c}`,
      ],
      solution: [`P = ${a} + ${b} + ${c} = ${a + b + c} cm`],
      traps: [
        trap("two-sides-only", a + b, `You added two of the three sides. A triangle has three, and all three are on the outside of the shape.`),
        trap(
          "used-area-formula",
          tidy((a * b) / 2, 4),
          `You have used an area formula. This question asks for the distance round the outside, which is just the three sides added. Half base times height would give an area, in cm².`,
          "L1-G1.3"
        ),
      ],
    });
  }

  if (shape === "parallelogram") {
    const a = r.int(6, 20);
    const b = r.int(4, 15);
    return item({
      skill: "Perimeter of a parallelogram",
      prompt: `A parallelogram has one pair of sides ${a} cm long and the other pair ${b} cm long.\n\nWhat is its perimeter?`,
      input: num({ placeholder: "cm" }),
      unit: "cm",
      answer: 2 * (a + b),
      hints: [
        "Opposite sides of a parallelogram are equal, so there are two of each length.",
        "Add one of each and double it.",
        `2 × (${a} + ${b})`,
      ],
      solution: [`P = 2 × (${a} + ${b})`, `= 2 × ${a + b} = ${2 * (a + b)} cm`],
      traps: [
        trap("added-once", a + b, "You added one of each pair. A parallelogram has two sides of each length."),
        trap(
          "found-area",
          a * b,
          `That multiplies the two side lengths, which is neither the perimeter nor the area. The area of a parallelogram uses the PERPENDICULAR height, not the slanting side, and the perimeter simply adds the four sides.`,
          "L1-G1.3"
        ),
      ],
    });
  }

  if (shape === "trapezium") {
    const a = r.int(8, 20);
    const b = r.int(3, a - 3);
    const legs = r.int(4, 12);
    return item({
      skill: "Perimeter of a trapezium",
      prompt: `A trapezium has parallel sides of ${a} cm and ${b} cm, and the two other sides are each ${legs} cm.\n\nWhat is its perimeter?`,
      input: num({ placeholder: "cm" }),
      unit: "cm",
      answer: a + b + 2 * legs,
      hints: [
        "Perimeter needs every side, whatever the shape is called.",
        `There are four sides: ${a}, ${b} and two of ${legs}.`,
        `${a} + ${b} + ${legs} + ${legs}`,
      ],
      solution: [`P = ${a} + ${b} + ${legs} + ${legs}`, `= ${a + b + 2 * legs} cm`],
      traps: [
        trap("one-leg", a + b + legs, `Only one of the two equal sides has been counted. The question says the two other sides are EACH ${legs} cm.`),
        trap("parallel-only", a + b, "You added the two parallel sides and stopped. The other two sides are part of the outside as well."),
        trap(
          "used-area-formula",
          tidy(((a + b) / 2) * legs, 4),
          `That is the area formula, half the sum of the parallel sides times the height. This question asks for the distance round the outside, which is the four sides added, and it would be in cm rather than cm².`,
          "L1-G1.3"
        ),
      ],
    });
  }

  // A regular polygon: the perimeter is one side repeated.
  const sides = r.pick([5, 6, 8, 9, 10, 12]);
  const len = r.int(3, 17);
  const names = { 5: "pentagon", 6: "hexagon", 8: "octagon", 9: "nonagon", 10: "decagon", 12: "dodecagon" };
  return item({
    skill: "Perimeter of a regular polygon",
    prompt: `A regular ${names[sides]} has sides of ${len} cm.\n\nWhat is its perimeter?`,
    input: num({ placeholder: "cm" }),
    unit: "cm",
    answer: sides * len,
    hints: [
      "Regular means every side is the same length.",
      `A ${names[sides]} has ${sides} sides.`,
      `${sides} × ${len}`,
    ],
    solution: [`A regular ${names[sides]} has ${sides} equal sides.`, `P = ${sides} × ${len} = ${sides * len} cm`],
    traps: [
      trap("wrong-side-count", (sides - 1) * len, `You used ${sides - 1} sides. A ${names[sides]} has ${sides}.`),
      trap("one-side", len, "That is one side. The perimeter goes all the way round."),
    ],
  });
};

/* ═══════════════════════════════════════════════════════════════════════
   L1-G1.3 · AREA FORMULAS
   ═══════════════════════════════════════════════════════════════════════ */

generators["L1-G1.3"] = (r, tier) => {
  const shape = r.pick(
    byTier(tier, {
      build: ["triangle", "triangle", "parallelogram"],
      stretch: ["triangle", "parallelogram", "trapezium"],
      exam: ["trapezium", "trapezium", "parallelogram"],
    })
  );

  if (shape === "triangle") {
    // An even base keeps the halving clean at build tier.
    const base = tier === "build" ? 2 * r.int(2, 11) : r.int(5, 23);
    const height = r.int(4, 18);
    const slant = height + r.int(1, 4);
    const area = (base * height) / 2;

    return item({
      skill: "Area of a triangle",
      prompt: `A triangle has a base of ${base} cm and a perpendicular height of ${height} cm. Its slanting side measures ${slant} cm.\n\nFind its area.`,
      input: num({ placeholder: "cm²" }),
      unit: "cm²",
      answer: tidy(area, 4),
      visual: { kind: "triangle", base, height, slant },
      hints: [
        "A triangle is exactly half of the rectangle that boxes it in. Draw that rectangle and the formula stops needing to be remembered.",
        "Area = half × base × perpendicular height. The perpendicular height is the one measured at right angles to the base.",
        `Half of ${base} × ${height}. The slanting side of ${slant} cm is not used at all.`,
      ],
      solution: [
        `A = ½ × base × perpendicular height`,
        `= ½ × ${base} × ${height}`,
        `= ½ × ${base * height}`,
        `= ${tidy(area, 4)} cm²`,
      ],
      traps: [
        trap(
          "forgot-the-half",
          base * height,
          `You found the area of the whole RECTANGLE round the triangle. The triangle is half of it, so halve your answer. Getting exactly twice the right answer is the signature of this one error, and it is the commonest mistake in mensuration.`,
          "L1-G1.3"
        ),
        trap(
          "used-slant-height",
          tidy((base * slant) / 2, 4),
          `You used the slanting side of ${slant} cm as the height. Every area formula wants the PERPENDICULAR height, measured at right angles to the base, which here is ${height} cm. The slant is longer than the perpendicular height, which is why this answer comes out slightly too big. Exam diagrams give you the slant on purpose.`,
          "L1-G1.3"
        ),
        trap(
          "found-perimeter",
          base + height + slant,
          `That adds the sides, which gives a distance round the outside rather than a space inside. An area is in cm² because two lengths were multiplied together.`,
          "L1-G1.2"
        ),
      ],
      scaffold: [
        { ask: `Which measurement is the perpendicular height, ${height} or ${slant}?`, answer: String(height), input: num() },
        { ask: `What is base × perpendicular height?`, answer: String(base * height), input: num() },
        { ask: `Now halve it. What is the area in cm²?`, answer: String(tidy(area, 4)), input: num() },
      ],
    });
  }

  if (shape === "parallelogram") {
    const base = r.int(5, 22);
    const height = r.int(4, 16);
    const slant = height + r.int(1, 5);
    const area = base * height;

    return item({
      skill: "Area of a parallelogram",
      prompt: `A parallelogram has a base of ${base} cm and a perpendicular height of ${height} cm. Its slanting side is ${slant} cm.\n\nFind its area.`,
      input: num({ placeholder: "cm²" }),
      unit: "cm²",
      answer: area,
      visual: { kind: "parallelogram", base, height, slant },
      hints: [
        "Cut the triangle off one end of a parallelogram and slide it to the other end. You get a rectangle of exactly the same area.",
        "Area = base × perpendicular height. There is no half here, because the shape IS the rectangle rearranged.",
        `${base} × ${height}. The slanting side of ${slant} cm is not used.`,
      ],
      solution: [
        `Sliding the end triangle across turns it into a rectangle.`,
        `A = base × perpendicular height`,
        `= ${base} × ${height} = ${area} cm²`,
      ],
      traps: [
        trap(
          "used-slant-side",
          base * slant,
          `You multiplied by the slanting side of ${slant} cm. The formula needs the PERPENDICULAR height, ${height} cm, measured at right angles to the base. Picture the rearranged rectangle: its height is the perpendicular one, not the slant.`,
          "L1-G1.3"
        ),
        trap(
          "halved-it",
          tidy(area / 2, 4),
          `You halved, as though this were a triangle. A parallelogram is a whole rectangle rearranged, so there is no half. The half belongs to the triangle, which is half of its surrounding rectangle.`,
          "L1-G1.3"
        ),
        trap(
          "found-perimeter",
          2 * (base + slant),
          `That is the perimeter, the distance round the outside. The question asks for the area, which is a space and is measured in cm².`,
          "L1-G1.2"
        ),
      ],
    });
  }

  // Trapezium
  const a = r.int(6, 20);
  const b = r.int(2, a - 2);
  const height = tier === "build" ? 2 * r.int(2, 8) : r.int(3, 15);
  const area = ((a + b) / 2) * height;

  return item({
    skill: "Area of a trapezium",
    prompt: `A trapezium has parallel sides of ${a} cm and ${b} cm, and a perpendicular height of ${height} cm.\n\nFind its area.`,
    input: num({ placeholder: "cm²" }),
    unit: "cm²",
    answer: tidy(area, 4),
    visual: { kind: "trapezium", top: b, bottom: a, height },
    hints: [
      "Average the two parallel sides first. That average is the width of a rectangle with the same area.",
      "Area = half the sum of the parallel sides, times the perpendicular height.",
      `(${a} + ${b}) ÷ 2 = ${tidy((a + b) / 2, 4)}, then multiply by ${height}.`,
    ],
    solution: [
      `A = ½ × (sum of parallel sides) × height`,
      `= ½ × (${a} + ${b}) × ${height}`,
      `= ½ × ${a + b} × ${height}`,
      `= ${tidy((a + b) / 2, 4)} × ${height}`,
      `= ${tidy(area, 4)} cm²`,
    ],
    traps: [
      trap(
        "forgot-the-half",
        (a + b) * height,
        `You added the parallel sides and multiplied by the height without halving. Halving is what turns the two different widths into one average width, so without it you have counted the shape twice over. Your answer is exactly double.`,
        "L1-G1.3"
      ),
      trap(
        "multiplied-the-sides",
        tidy((a * b * height) / 2, 4),
        `The two parallel sides are ADDED and then halved, not multiplied. The formula is averaging them, because the trapezium is a rectangle whose width is the average of the two.`,
        "L1-G1.3"
      ),
      trap(
        "used-one-side",
        a * height,
        `That uses only the longer parallel side, which is the area of a rectangle that is bigger than the trapezium. The two parallel sides differ, so their average is what the formula needs.`,
        "L1-G1.3"
      ),
    ],
    scaffold: [
      { ask: `What is the sum of the two parallel sides?`, answer: String(a + b), input: num() },
      { ask: `Halve that to get the average width.`, answer: String(tidy((a + b) / 2, 4)), input: num() },
      { ask: `Multiply by the height of ${height}. What is the area in cm²?`, answer: String(tidy(area, 4)), input: num() },
    ],
  });
};

/* ═══════════════════════════════════════════════════════════════════════
   L1-G2.3 · VOLUME OF A CUBOID
   ═══════════════════════════════════════════════════════════════════════ */

generators["L1-G2.3"] = (r, tier) => {
  const l = r.int(...byTier(tier, { build: [2, 9], stretch: [4, 15], exam: [6, 22] }));
  const w = r.int(...byTier(tier, { build: [2, 8], stretch: [3, 12], exam: [4, 18] }));
  const h = r.int(...byTier(tier, { build: [2, 7], stretch: [3, 11], exam: [3, 15] }));
  const volume = l * w * h;
  const surface = 2 * (l * w + l * h + w * h);

  return item({
    skill: "Volume of a cuboid",
    prompt: `A box measures ${l} cm by ${w} cm by ${h} cm.\n\nFind its volume.`,
    input: num({ placeholder: "cm³" }),
    unit: "cm³",
    answer: volume,
    visual: { kind: "cuboid", length: l, width: w, height: h },
    hints: [
      "Volume counts how many unit cubes fit inside. Fill the bottom layer first, then count the layers.",
      `The bottom layer holds ${l} × ${w} = ${l * w} cubes, and there are ${h} layers.`,
      `${l} × ${w} × ${h}`,
    ],
    solution: [
      `Bottom layer: ${l} × ${w} = ${l * w} cubes`,
      `${h} layers of that: ${l * w} × ${h} = ${volume}`,
      `V = ${volume} cm³`,
    ],
    traps: [
      trap(
        "added-instead",
        l + w + h,
        `You added the three measurements. Volume is a space, so the three lengths multiply: each one contributes a direction the box extends in. That is also why the unit is cm³, with three of the centimetres multiplied together.`,
        "L1-G2.3"
      ),
      trap(
        "found-one-face",
        l * w,
        `That is the area of one FACE, which is a flat space in cm². A volume needs the third measurement as well, because it counts how many of those layers are stacked up.`,
        "L1-G1.3"
      ),
      trap(
        "found-surface-area",
        surface,
        `That is the surface area, the total of all six faces, which is in cm². Volume is the space inside, in cm³. Read which one the question asked for.`,
        "L1-G2.3"
      ),
    ],
    scaffold: [
      { ask: `How many cubes fit in the bottom layer? (${l} × ${w})`, answer: String(l * w), input: num() },
      { ask: `How many such layers are stacked up?`, answer: String(h), input: num() },
      { ask: `So what is the volume in cm³?`, answer: String(volume), input: num() },
    ],
  });
};

export default generators;
