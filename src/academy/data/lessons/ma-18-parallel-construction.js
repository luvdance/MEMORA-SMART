/**
 * MATHEMATICS · MONTH 5 · MODULE 18 · ANGLE RULES AND CONSTRUCTION
 *
 * CLIENT-SAFE. Atom shape and house style: see ma-01-place-value.js.
 */

export const SECTION_ID = "ma-s18-parallel-construction";

export const LESSONS = [
  {
    id: "ma-l2-g1",
    moduleId: "ma-18-parallel-construction",
    sectionId: SECTION_ID,
    skillGroup: "L2-G1",
    order: 1,
    title: "Angle Rules",
    subtitle: "Parallel lines, triangles and polygons",
    estimatedMinutes: 45,
    intro: "A handful of angle facts, each with a short reason, solve almost every angle question in WAEC and JAMB. Always write the reason next to the number.",

    atoms: [
      {
        id: "a-ma-l2-g1-1",
        title: "Angles on parallel lines",
        explain:
          "PARALLEL lines never meet; arrows mark them on a diagram. A line crossing them is a TRANSVERSAL. It makes three pairs of related angles.",
        table: {
          caption: "Angles made by a transversal across parallel lines.",
          headers: ["Name", "Shape", "Rule"],
          rows: [
            ["Alternate angles", "Z", "equal"],
            ["Corresponding angles", "F", "equal"],
            ["Co-interior (allied) angles", "C or U", "add up to 180°"],
          ],
        },
        example: "  One angle is 72°.\n    alternate angle      = 72°\n    corresponding angle  = 72°\n    co-interior angle    = 180 − 72 = 108°",
        mistake: "Treating co-interior angles as equal. They add up to 180°.",
        drill: { skill: "L2-G1.1", count: 4 },
      },
      {
        id: "a-ma-l2-g1-2",
        title: "Angles in a triangle",
        explain:
          "The three angles of a triangle add up to 180°. The EXTERIOR angle, made by extending one side, equals the sum of the two interior angles opposite it. In an isosceles triangle the two base angles are equal.",
        example:
          "  Why 180°: draw a line through the top corner parallel to the base.\n  The two alternate angles and the top angle make a straight line.\n\n  Angles 48° and 67°: third = 180 − 48 − 67 = 65°\n  Exterior angle opposite 48° and 67° = 48 + 67 = 115°\n  Isosceles, apex 40°: base angles = (180 − 40) ÷ 2 = 70°",
        mistake: "Forgetting there are TWO equal base angles in an isosceles triangle: apex 40° does not leave 140° for one base angle.",
        drill: { skill: "L2-G1.2", count: 4 },
      },
      {
        id: "a-ma-l2-g1-3",
        title: "Angles in polygons",
        explain:
          "A polygon with n sides splits into n − 2 triangles from one corner, so its interior angles add up to (n − 2) × 180°. The exterior angles of ANY polygon add up to 360°. In a regular polygon, each exterior angle is 360° ÷ n, and interior + exterior = 180°.",
        table: {
          caption: "Regular polygons.",
          headers: ["Polygon", "n", "Interior sum", "Each exterior", "Each interior"],
          rows: [
            ["Pentagon", "5", "540°", "72°", "108°"],
            ["Hexagon", "6", "720°", "60°", "120°"],
            ["Octagon", "8", "1 080°", "45°", "135°"],
            ["Decagon", "10", "1 440°", "36°", "144°"],
          ],
        },
        example: "  Each interior angle of a regular polygon is 156°. How many sides?\n    exterior = 180 − 156 = 24°\n    n = 360 ÷ 24 = 15",
        mistake: "Dividing 360° by the INTERIOR angle to find n. Use the exterior angle.",
        drill: { skill: "L2-G1.3", count: 4 },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  {
    id: "ma-l2-g2",
    moduleId: "ma-18-parallel-construction",
    sectionId: SECTION_ID,
    skillGroup: "L2-G2",
    order: 2,
    title: "Construction",
    subtitle: "Ruler and compasses only",
    estimatedMinutes: 40,
    intro:
      "A construction uses only a straight edge and a pair of compasses, with no measuring of angles. Do each one on paper as you read it: WAEC marks the construction lines, so never rub them out.",

    atoms: [
      {
        id: "a-ma-l2-g2-1",
        title: "Bisecting a line",
        explain:
          "To BISECT a line AB: open the compasses to MORE than half of AB. Draw arcs above and below the line from A, then from B without changing the compass width. Join the two points where the arcs cross. This line is the PERPENDICULAR BISECTOR: it cuts AB in half at right angles.",
        example: "  Every point on the perpendicular bisector of AB is the same distance from A as from B.\n  That is why it is used to find the centre of a circle through three points.",
        mistake: "Opening the compasses to half of AB or less: the arcs then do not cross twice.",
        drill: { skill: "L2-G2.1", count: 3 },
      },
      {
        id: "a-ma-l2-g2-2",
        title: "Bisecting an angle",
        explain:
          "To bisect angle ABC: with the compass point on the vertex B, draw an arc cutting BA at P and BC at Q. From P and from Q, with the compasses kept at the same width, draw arcs that cross inside the angle. Join B to the crossing point. Every point on this bisector is the same distance from the two arms.",
        mistake: "Drawing the second pair of arcs from A and C instead of from P and Q, where the first arc cut the arms.",
        drill: { skill: "L2-G2.2", count: 3 },
      },
      {
        id: "a-ma-l2-g2-3",
        title: "Constructing standard angles",
        explain:
          "Every constructible angle comes from two starting points: 60°, from an equilateral triangle (arcs of the same width as the line, from each end of it), and 90°, from a perpendicular. Bisect them, and add them, to get the rest.",
        table: {
          caption: "How the standard angles are made.",
          headers: ["Angle", "Construction"],
          rows: [
            ["60°", "equilateral triangle"],
            ["30°", "bisect 60°"],
            ["90°", "perpendicular (bisect a straight angle)"],
            ["45°", "bisect 90°"],
            ["120°", "two 60° angles"],
            ["75°", "60° + half of the 30° between 60° and 90°"],
            ["105°", "90° + 15°"],
            ["135°", "90° + 45°"],
            ["150°", "180° − 30°"],
          ],
        },
        mistake: "Trying to construct 50° or 70°. Only angles built from 60° and 90° by bisecting and adding can be constructed.",
        drill: { skill: "L2-G2.3", count: 3 },
      },
      {
        id: "a-ma-l2-g2-4",
        title: "Constructing triangles",
        explain:
          "Draw one known side as the base. For three sides (SSS), draw arcs of the other two lengths from its ends; they meet at the third corner. For two sides and the included angle (SAS), construct the angle at one end. For two angles and a side (ASA), construct an angle at each end. A triangle exists only if the two shorter sides together are longer than the longest side.",
        example: "  Sides 4 cm, 5 cm, 10 cm: 4 + 5 = 9 < 10, so no triangle.\n  Sides 4 cm, 5 cm, 8 cm: 4 + 5 = 9 > 8, so the triangle exists.",
        mistake: "Starting without a base line. Every triangle construction begins by drawing one side.",
        drill: { skill: "L2-G2.4", count: 3 },
      },
      {
        id: "a-ma-review-18",
        title: "Mixed review",
        explain: "One question on each earlier skill.",
        drill: { review: ["L2-A3.2", "L2-A3.3", "L1-G3.3", "L1-G1.3", "L2-N1.4"], count: 5 },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
