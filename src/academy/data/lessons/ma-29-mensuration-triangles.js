/**
 * MATHEMATICS · MONTH 8 · MODULE 29 · MENSURATION AND TRIANGLE GEOMETRY
 *
 * CLIENT-SAFE. Atom shape and house style: see ma-01-place-value.js.
 */

export const SECTION_ID = "ma-s29-mensuration-triangles";

export const LESSONS = [
  {
    id: "ma-l4-g1",
    moduleId: "ma-29-mensuration-triangles",
    sectionId: SECTION_ID,
    skillGroup: "L4-G1",
    order: 1,
    title: "Mensuration",
    subtitle: "Arcs and sectors, cones from sectors, frustums, and similar solids",
    estimatedMinutes: 50,
    intro: "Mensuration means measuring. Every formula here is a fraction of a circle, a combination of solids, or a scale factor applied to one.",

    atoms: [
      {
        id: "a-ma-l4-g1-1",
        title: "Arc length and sector area",
        explain: "A SECTOR with angle θ at the centre is the fraction θ/360 of the whole circle. So its ARC is θ/360 of the circumference and its area is θ/360 of the circle's area. Its perimeter is the arc plus two radii.",
        table: {
          caption: "Sector formulas.",
          headers: ["Measure", "Formula"],
          rows: [["Arc length", "θ/360 × 2πr"], ["Sector area", "θ/360 × πr²"], ["Sector perimeter", "arc + 2r"]],
        },
        example: "  r = 14 cm, θ = 90°, π = 22/7\n    arc = 90/360 × 2 × 22/7 × 14 = 22 cm\n    area = 90/360 × 22/7 × 196 = 154 cm²\n    perimeter = 22 + 28 = 50 cm",
        mistake: "Forgetting the two radii in the perimeter of a sector.",
        drill: { skill: "L4-G1.1", count: 4 },
      },
      {
        id: "a-ma-l4-g1-2",
        title: "Sector to cone",
        explain: "When a sector is folded into a cone, its radius becomes the SLANT HEIGHT l of the cone, and its arc becomes the circumference of the cone's base. The sector's area becomes the cone's curved surface.",
        example: "  Sector: radius 21 cm, angle 120°\n    arc = 120/360 × 2π × 21 = 14π\n    base: 2πr = 14π → r = 7 cm\n    slant height l = 21 cm\n    height h = √(21² − 7²) = √392 ≈ 19.80 cm",
        mistake: "Taking the sector's radius as the cone's base radius. It becomes the slant height.",
        drill: { skill: "L4-G1.2", count: 3 },
      },
      {
        id: "a-ma-l4-g1-3",
        title: "Frustums and composite solids",
        explain: "A FRUSTUM is a cone with its top cut off parallel to the base. Volume of frustum = volume of whole cone − volume of the small cone removed. For a composite solid, split it into simple solids and add or subtract. A hemisphere is half a sphere: V = ⅔πr³.",
        table: {
          caption: "Sphere formulas.",
          headers: ["Measure", "Formula"],
          rows: [["Volume of sphere", "⁴⁄₃πr³"], ["Surface area of sphere", "4πr²"], ["Volume of hemisphere", "⅔πr³"]],
        },
        example: "  Cylinder r = 7, h = 10 with a hemisphere on top (π = 22/7):\n    cylinder = 1 540,  hemisphere = ⅔ × 22/7 × 343 = 718.67\n    total ≈ 2 258.67 cm³",
        mistake: "Using the full sphere for a hemisphere, or adding the small cone instead of subtracting it.",
        drill: { skill: "L4-G1.3", count: 3 },
      },
      {
        id: "a-ma-l4-g1-4",
        title: "Areas and volumes of similar figures",
        explain: "If two shapes are similar with length scale factor k, their AREAS are in the ratio k² and their VOLUMES in the ratio k³.",
        example: "  Lengths 2 : 5\n    areas  4 : 25\n    volumes 8 : 125\n\n  A 2-litre jug and a similar jug twice as tall: 2 × 2³ = 16 litres",
        mistake: "Using the length ratio for areas or volumes. Twice as tall is EIGHT times the volume.",
        drill: { skill: "L4-G1.4", count: 3 },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  {
    id: "ma-l4-g2",
    moduleId: "ma-29-mensuration-triangles",
    sectionId: SECTION_ID,
    skillGroup: "L4-G2",
    order: 2,
    title: "Triangle and Polygon Geometry",
    subtitle: "Congruence, quadrilaterals, the intercept theorem and equal areas",
    estimatedMinutes: 45,
    intro: "These are the theorems WAEC asks you to USE in proofs. State the reason beside every step: the reason earns the mark.",

    atoms: [
      {
        id: "a-ma-l4-g2-1",
        title: "Triangle congruence",
        explain: "CONGRUENT triangles are identical in shape and size. Four conditions prove it: SSS, SAS (the angle between the sides), ASA (two angles and a corresponding side) and RHS (right angle, hypotenuse, side). Three equal angles (AAA) prove only similarity.",
        mistake: "Using two sides and an angle that is NOT between them. That does not fix the triangle.",
        drill: { skill: "L4-G2.1", count: 3 },
      },
      {
        id: "a-ma-l4-g2-2",
        title: "Special quadrilaterals",
        explain: "Use the defining properties as reasons.",
        table: {
          caption: "Properties to quote.",
          headers: ["Shape", "Properties"],
          rows: [
            ["Parallelogram", "opposite sides equal and parallel; opposite angles equal; diagonals bisect each other; adjacent angles add to 180°"],
            ["Rectangle", "parallelogram with right angles; diagonals equal"],
            ["Rhombus", "parallelogram with equal sides; diagonals bisect each other at right angles and bisect the angles"],
            ["Square", "all of the above"],
            ["Kite", "two pairs of equal adjacent sides; one pair of equal opposite angles; diagonals at right angles"],
            ["Trapezium", "one pair of parallel sides; co-interior angles between them add to 180°"],
          ],
        },
        mistake: "Assuming a parallelogram's diagonals are equal. That is true only for rectangles.",
        drill: { skill: "L4-G2.2", count: 3 },
      },
      {
        id: "a-ma-l4-g2-3",
        title: "The intercept theorem",
        explain: "If three or more parallel lines make equal intercepts on one transversal, they make equal intercepts on every transversal. More generally, parallel lines cut transversals in the SAME RATIO.",
        example: "  Parallel lines cut 4 cm and 6 cm on one transversal.\n  On another the first intercept is 6 cm: the second is 6 × 6/4 = 9 cm.",
        mistake: "Assuming the intercepts differ by the same amount on both transversals. They are in the same RATIO.",
        drill: { skill: "L4-G2.3", count: 3 },
      },
      {
        id: "a-ma-l4-g2-4",
        title: "Similar triangle problems",
        explain: "A line drawn parallel to one side of a triangle cuts off a smaller triangle SIMILAR to the whole. Use the whole sides in the ratio: AD/AB = AE/AC = DE/BC.",
        example: "  DE ∥ BC, AD = 4, DB = 6, DE = 5\n    AB = 10, so BC = 5 × 10/4 = 12.5",
        mistake: "Using DB instead of AB. The ratio compares the small triangle with the WHOLE triangle.",
        drill: { skill: "L4-G2.4", count: 3 },
      },
      {
        id: "a-ma-l4-g2-5",
        title: "Parallelograms on the same base",
        explain: "Parallelograms on the same base and between the same parallels are EQUAL in area. A triangle on the same base and between the same parallels as a parallelogram has HALF its area.",
        example: "  Parallelogram ABCD has area 48 cm². Triangle ABE has E on DC.\n    Area of ABE = ½ × 48 = 24 cm²",
        mistake: "Thinking a slanted parallelogram has a bigger area. Same base and same height give the same area.",
        drill: { skill: "L4-G2.5", count: 3 },
      },
      {
        id: "a-ma-review-29",
        title: "Mixed review",
        explain: "One question on each earlier skill.",
        drill: { review: ["L4-A1.1", "L4-A1.3", "L4-A2.2", "L4-A3.1", "L3-G2.2"], count: 5 },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
