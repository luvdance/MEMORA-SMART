/**
 * MATHEMATICS · MONTH 9 · MODULE 34 · COORDINATE GEOMETRY AND SOLVING TRIANGLES
 *
 * CLIENT-SAFE. Atom shape and house style: see ma-01-place-value.js.
 */

export const SECTION_ID = "ma-s34-coordinates-triangles";

export const LESSONS = [
  {
    id: "ma-l5-g2",
    moduleId: "ma-34-coordinates-triangles",
    sectionId: SECTION_ID,
    skillGroup: "L5-G2",
    order: 1,
    title: "Coordinate Geometry of Straight Lines",
    subtitle: "Distance, midpoint, gradient and equation",
    estimatedMinutes: 40,
    intro: "Two points fix a line. From their coordinates alone you can find how far apart they are, the point halfway, how steep the line is, and its equation.",

    atoms: [
      {
        id: "a-ma-l5-g2-1",
        title: "Distance and midpoint",
        explain: "The DISTANCE between (x₁, y₁) and (x₂, y₂) is Pythagoras on the grid. The MIDPOINT is the average of the x's and the average of the y's.",
        table: [
          ["Formula", ""],
          ["Distance", "√[(x₂ − x₁)² + (y₂ − y₁)²]"],
          ["Midpoint", "((x₁ + x₂)/2, (y₁ + y₂)/2)"],
        ],
        example: "  A(1, 2), B(7, 10)\n    distance = √(6² + 8²) = √100 = 10\n    midpoint = (4, 6)",
        mistake: "Forgetting that (−3)² = 9. Square the differences with their signs in brackets.",
        drill: { skill: "L5-G2.1", count: 4 },
      },
      {
        id: "a-ma-l5-g2-2",
        title: "Gradient",
        explain: "Gradient m = (y₂ − y₁)/(x₂ − x₁): the change in y for each step of 1 in x. Positive goes uphill left to right, negative goes downhill, 0 is horizontal, and a vertical line has no gradient.",
        example: "  (−1, 5) and (3, −3)\n    m = (−3 − 5)/(3 − (−1)) = −8/4 = −2",
        mistake: "Mixing the order: take both differences in the SAME order, second point minus first.",
        drill: { skill: "L5-G2.2", count: 3 },
      },
      {
        id: "a-ma-l5-g2-3",
        title: "The equation of a line",
        explain: "With gradient m and a point (x₁, y₁): y − y₁ = m(x − x₁). Expand and make y the subject to get y = mx + c. With two points, find m first.",
        example: "  Through (2, 7) and (4, 11)\n    m = 4/2 = 2\n    y − 7 = 2(x − 2)  →  y = 2x + 3",
        mistake: "Stopping at y = 2x. The constant c is what places the line through the point.",
        drill: { skill: "L5-G2.3", count: 3 },
      },
      {
        id: "a-ma-l5-g2-4",
        title: "Parallel and perpendicular lines",
        explain: "PARALLEL lines have EQUAL gradients. PERPENDICULAR lines have gradients that multiply to −1: m₁ × m₂ = −1, so m₂ is the negative reciprocal of m₁.",
        example: "  y = 3x − 1\n    parallel gradient 3\n    perpendicular gradient −1/3\n\n  2y = 4x + 5  →  y = 2x + 2.5, gradient 2",
        mistake: "Reading the gradient before making y the subject. In 2y = 4x + 5 the gradient is 2, not 4.",
        drill: { skill: "L5-G2.4", count: 3 },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  {
    id: "ma-l5-t1",
    moduleId: "ma-34-coordinates-triangles",
    sectionId: SECTION_ID,
    skillGroup: "L5-T1",
    order: 2,
    title: "Solving Any Triangle",
    subtitle: "The sine rule, the cosine rule and ½ab sin C",
    estimatedMinutes: 50,
    intro: "SOH CAH TOA needs a right angle. The sine and cosine rules work in ANY triangle. Label the sides with small letters opposite the angles with the same capital: side a is opposite angle A.",

    atoms: [
      {
        id: "a-ma-l5-t1-1",
        title: "The sine rule",
        explain: "a/sin A = b/sin B = c/sin C. Use it when you know a side and its OPPOSITE angle, plus one more side or angle. To find an angle, flip it: sin A/a = sin B/b.",
        table: [
          ["Known", "Rule"],
          ["Two angles and a side", "sine rule"],
          ["Two sides and a non-included angle", "sine rule (watch for two answers)"],
          ["Two sides and the included angle", "cosine rule"],
          ["Three sides", "cosine rule"],
        ],
        example: "  A = 40°, B = 65°, a = 8\n    b = 8 sin 65° / sin 40° = 11.3",
        mistake: "Pairing a side with the wrong angle. Each side goes with the angle OPPOSITE it.",
        drill: { skill: "L5-T1.1", count: 3 },
      },
      {
        id: "a-ma-l5-t1-2",
        title: "The cosine rule",
        explain: "c² = a² + b² − 2ab cos C, to find a side from two sides and the angle BETWEEN them. Rearranged, cos C = (a² + b² − c²)/(2ab) finds an angle from three sides. If cos C is negative, C is obtuse.",
        example: "  a = 5, b = 7, C = 60°\n    c² = 25 + 49 − 70 cos 60° = 74 − 35 = 39  →  c = 6.2\n\n  Sides 3, 5, 7: cos C = (9 + 25 − 49)/30 = −0.5  →  C = 120°",
        mistake: "Doing 74 − 70 first and then multiplying by cos 60°. Work out 2ab cos C completely, then subtract.",
        drill: { skill: "L5-T1.2", count: 3 },
      },
      {
        id: "a-ma-l5-t1-3",
        title: "Area = ½ab sin C",
        explain: "The area of any triangle is half the product of two sides times the sine of the angle BETWEEN them. When C = 90°, sin C = 1 and it becomes ½ × base × height.",
        example: "  Sides 6 and 9, included angle 30°\n    area = ½ × 6 × 9 × sin 30° = 27 × 0.5 = 13.5",
        mistake: "Using an angle that is not between the two sides. The angle must be INCLUDED.",
        drill: { skill: "L5-T1.3", count: 3 },
      },
      {
        id: "a-ma-l5-t1-4",
        title: "Bearings with the sine and cosine rules",
        explain: "Draw a north line at each point. Use the back bearing (add or subtract 180°) and the angles on a straight line to find the angle INSIDE the triangle, then use the cosine or sine rule.",
        example: "  A to B: 10 km on 060°; B to C: 8 km on 150°\n    back bearing B→A = 240°; angle ABC = 240 − 150 = 90°\n    AC = √(100 + 64) = 12.8 km",
        mistake: "Using the bearing as the angle of the triangle. Find the inside angle at the turning point first.",
        drill: { skill: "L5-T1.4", count: 3 },
      },
      {
        id: "a-ma-l5-t1-5",
        title: "Heights and distances",
        explain: "For two angles of elevation or depression from one height, find each horizontal distance with tan, then subtract. For a 3-D problem, find the right-angled triangle in the right plane first.",
        example: "  Cliff 50 m; depressions 45° and 30°\n    near = 50/tan 45° = 50\n    far  = 50/tan 30° = 86.6\n    apart = 36.6 m",
        mistake: "Using the angle of depression at the boat. It equals the angle of elevation from the boat (alternate angles), so the same tan works.",
        drill: { skill: "L5-T1.5", count: 3 },
      },
      {
        id: "a-ma-review-34",
        title: "Mixed review",
        explain: "One question on each earlier skill.",
        drill: { review: ["L5-G1.2", "L5-G1.5", "L5-G1.6", "L5-A3.3", "L4-A1.3"], count: 5 },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
