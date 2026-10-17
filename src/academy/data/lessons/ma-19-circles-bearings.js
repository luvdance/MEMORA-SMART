/**
 * MATHEMATICS · MONTH 5 · MODULE 19 · CIRCLES, COMPOUND SHAPES AND BEARINGS
 *
 * CLIENT-SAFE. Atom shape and house style: see ma-01-place-value.js.
 */

export const SECTION_ID = "ma-s19-circles-bearings";

export const LESSONS = [
  {
    id: "ma-l2-g3",
    moduleId: "ma-19-circles-bearings",
    sectionId: SECTION_ID,
    skillGroup: "L2-G3",
    order: 1,
    title: "Circles, Compound Shapes and Prisms",
    subtitle: "Circumference, area, compound areas, and the volume of prisms and cylinders",
    estimatedMinutes: 45,
    intro: "Every circle has the same ratio of circumference to diameter. That number is π, and the area and volume formulas follow from it.",

    atoms: [
      {
        id: "a-ma-l2-g3-1",
        title: "Circumference and area of a circle",
        explain:
          "The RADIUS r runs from the centre to the edge; the DIAMETER d = 2r goes right across. The CIRCUMFERENCE is the distance round. π (pi) is about 3.142, or 22/7.",
        table: {
          caption: "The two circle formulas.",
          headers: ["Find", "Formula"],
          rows: [
            ["Circumference", "C = 2πr = πd"],
            ["Area", "A = πr²"],
          ],
        },
        example:
          "  Radius 14 cm, π = 22/7:\n    C = 2 × 22/7 × 14 = 88 cm\n    A = 22/7 × 14 × 14 = 616 cm²\n\n  Circumference 44 cm → r = 44 ÷ (2 × 22/7) = 7 cm",
        mistake: "Using the diameter in A = πr². With a diameter of 14 cm, the radius is 7 cm.",
        drill: { skill: "L2-G3.1", count: 5 },
      },
      {
        id: "a-ma-l2-g3-2",
        title: "Area of compound shapes",
        explain: "Split a compound shape into rectangles, triangles, circles and semicircles. Add the pieces that are there; subtract the pieces that are cut out.",
        example:
          "  Rectangle 20 cm by 14 cm with a semicircle on a 14 cm side:\n    rectangle:  20 × 14 = 280\n    semicircle: ½ × 22/7 × 7² = 77\n    total:      357 cm²\n\n  Path round a pond, radii 7 m and 14 m:\n    22/7 × (14² − 7²) = 22/7 × 147 = 462 m²",
        mistake: "Subtracting the radii first for a ring: (14 − 7)² × π is not the path area. Subtract the two AREAS.",
        drill: { skill: "L2-G3.2", count: 4 },
      },
      {
        id: "a-ma-l2-g3-3",
        title: "Volume of prisms and cylinders",
        explain: "A PRISM has the same cross-section all along its length. Volume = area of the cross-section × length. A cylinder is a prism with a circular cross-section: V = πr²h.",
        example:
          "  Triangular prism: cross-section ½ × 6 × 4 = 12 cm², length 15 cm\n    V = 12 × 15 = 180 cm³\n\n  Cylinder: r = 7 cm, h = 10 cm\n    V = 22/7 × 7² × 10 = 1 540 cm³ = 1.54 litres",
        mistake: "Multiplying all the lengths together for a triangular prism. Find the triangle's area first, ½ × base × height.",
        drill: { skill: "L2-G3.3", count: 4 },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  {
    id: "ma-l2-g4",
    moduleId: "ma-19-circles-bearings",
    sectionId: SECTION_ID,
    skillGroup: "L2-G4",
    order: 2,
    title: "Scale Drawing and Bearings",
    subtitle: "Map scales, compass and three-figure bearings, and bearings diagrams",
    estimatedMinutes: 40,
    intro: "A bearing gives a direction as an angle. With a scale it lets you draw any journey, and later, with trigonometry, calculate it.",

    atoms: [
      {
        id: "a-ma-l2-g4-1",
        title: "Using a scale",
        explain: "A scale of 1 : 50 000 means 1 cm on the map is 50 000 cm in real life. Map to real: multiply by the scale. Real to map: divide. Convert units at the end.",
        example:
          "  Scale 1 : 50 000, 6 cm on the map:\n    6 × 50 000 = 300 000 cm = 3 000 m = 3 km\n\n  A 4.5 km road on a 1 : 25 000 map:\n    4.5 km = 450 000 cm,   450 000 ÷ 25 000 = 18 cm",
        mistake: "Forgetting to convert: 300 000 cm is 3 km, not 300 000 km.",
        drill: { skill: "L2-G4.1", count: 4 },
      },
      {
        id: "a-ma-l2-g4-2",
        title: "Compass and three-figure bearings",
        explain:
          "A THREE-FIGURE BEARING is an angle measured CLOCKWISE from North, written with three digits: 045°, 230°. A COMPASS BEARING such as N40°E starts from North or South and turns towards East or West. The BACK BEARING, the way back, differs by 180°.",
        table: {
          caption: "Converting bearings.",
          headers: ["Compass", "Three-figure"],
          rows: [
            ["N35°E", "035°"],
            ["S40°E", "180 − 40 = 140°"],
            ["S25°W", "180 + 25 = 205°"],
            ["N70°W", "360 − 70 = 290°"],
          ],
          note: "Back bearing: add 180° if the bearing is under 180°, subtract 180° if it is over. The bearing of B from A is 060°, so the bearing of A from B is 240°.",
        },
        mistake: "Measuring anticlockwise, or from East. Three-figure bearings always start at North and turn clockwise.",
        drill: { skill: "L2-G4.2", count: 4 },
      },
      {
        id: "a-ma-l2-g4-3",
        title: "Drawing a bearings diagram",
        explain:
          "Draw a North line at EVERY point where a bearing is measured. Mark each bearing clockwise from its own North line. Angles inside the diagram come from the bearings, back bearings, and angles on a straight line.",
        example:
          "  A ship sails from A to B on 070°, then from B to C on 150°.\n    At B, the bearing back to A is 070 + 180 = 250°.\n    Angle ABC = 250 − 150 = 100°.",
        mistake: "Using one North line for the whole diagram. Each point where you turn needs its own North line.",
        drill: { skill: "L2-G4.3", count: 3 },
      },
      {
        id: "a-ma-review-19",
        title: "Mixed review",
        explain: "One question on each earlier skill.",
        drill: { review: ["L2-G1.1", "L2-G1.2", "L2-G1.3", "L2-A3.4", "L1-G1.3"], count: 5 },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
