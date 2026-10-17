/**
 * MATHEMATICS · MONTH 7 · MODULE 28 · QUADRATIC EQUATIONS, GRAPHS AND VARIATION
 *
 * CLIENT-SAFE. Atom shape and house style: see ma-01-place-value.js.
 */

export const SECTION_ID = "ma-s28-quadratics-variation";

export const LESSONS = [
  {
    id: "ma-l4-a1",
    moduleId: "ma-28-quadratics-variation",
    sectionId: SECTION_ID,
    skillGroup: "L4-A1",
    order: 1,
    title: "Quadratic Equations",
    subtitle: "Factorising, completing the square, the formula, and the roots",
    estimatedMinutes: 55,
    intro: "A QUADRATIC equation has an x² term: ax² + bx + c = 0. It usually has two solutions, called ROOTS. Three methods find them; the third always works.",

    atoms: [
      {
        id: "a-ma-l4-a1-1",
        title: "Solving by factorising",
        explain: "Rearrange so one side is 0, factorise, then use the NULL FACTOR LAW: if ab = 0, then a = 0 or b = 0. Set each bracket equal to 0.",
        example: "  x² − x − 12 = 0\n    (x − 4)(x + 3) = 0\n    x = 4 or x = −3\n\n  2x² + 5x − 3 = 0\n    (2x − 1)(x + 3) = 0\n    x = 1/2 or x = −3",
        mistake: "Dividing both sides by x: from x² = 5x you lose the root x = 0. Write x² − 5x = 0, x(x − 5) = 0, x = 0 or 5.",
        drill: { skill: "L4-A1.1", count: 5 },
      },
      {
        id: "a-ma-l4-a1-2",
        title: "Completing the square",
        explain: "x² + bx = (x + b/2)² − (b/2)². Use it to write a quadratic as (x + p)² + q, which shows its lowest point and lets you solve any quadratic by taking square roots.",
        example: "  x² + 6x + 2 = (x + 3)² − 9 + 2 = (x + 3)² − 7\n\n  Solve x² + 6x + 2 = 0:\n    (x + 3)² = 7\n    x + 3 = ±√7\n    x = −3 ± √7 = −0.35 or −5.65",
        mistake: "Forgetting the ±: a square root has a positive and a negative value, so there are two roots.",
        drill: { skill: "L4-A1.2", count: 3 },
      },
      {
        id: "a-ma-l4-a1-3",
        title: "The quadratic formula",
        explain: "For ax² + bx + c = 0, x = (−b ± √(b² − 4ac)) / 2a. The DISCRIMINANT b² − 4ac decides the roots: positive, two real roots; zero, one repeated root; negative, no real roots.",
        example: "  2x² − 3x − 4 = 0:  a = 2, b = −3, c = −4\n    b² − 4ac = 9 + 32 = 41\n    x = (3 ± √41) / 4 = 2.35 or −0.85",
        mistake: "Dividing only √(b² − 4ac) by 2a. The whole of −b ± √(...) is divided by 2a.",
        drill: { skill: "L4-A1.3", count: 4 },
      },
      {
        id: "a-ma-l4-a1-4",
        title: "Forming an equation from roots",
        explain: "If the roots are p and q, the equation is (x − p)(x − q) = 0, which expands to x² − (p + q)x + pq = 0. For a fractional root such as 2/3, use the factor (3x − 2) to keep the coefficients whole.",
        example: "  Roots 3 and −5:   (x − 3)(x + 5) = 0  →  x² + 2x − 15 = 0\n  Roots 2/3 and −1: (3x − 2)(x + 1) = 0  →  3x² + x − 2 = 0",
        mistake: "Keeping the sign of the root in the bracket: a root of −5 gives (x + 5), not (x − 5).",
        drill: { skill: "L4-A1.4", count: 3 },
      },
      {
        id: "a-ma-l4-a1-5",
        title: "Sum and product of roots",
        explain: "If α and β are the roots of ax² + bx + c = 0, then α + β = −b/a and αβ = c/a. Other symmetric expressions are built from these two.",
        table: {
          caption: "Useful identities.",
          headers: ["Expression", "In terms of α + β and αβ"],
          rows: [
            ["α² + β²", "(α + β)² − 2αβ"],
            ["1/α + 1/β", "(α + β)/αβ"],
            ["(α − β)²", "(α + β)² − 4αβ"],
          ],
        },
        example: "  2x² − 5x + 1 = 0:  α + β = 5/2,  αβ = 1/2\n    α² + β² = 25/4 − 1 = 21/4",
        mistake: "Missing the minus in α + β = −b/a.",
        drill: { skill: "L4-A1.5", count: 3 },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  {
    id: "ma-l4-a2",
    moduleId: "ma-28-quadratics-variation",
    sectionId: SECTION_ID,
    skillGroup: "L4-A2",
    order: 2,
    title: "Quadratic Graphs",
    subtitle: "Drawing, roots, turning points, intersections and gradients",
    estimatedMinutes: 40,
    intro: "The graph of y = ax² + bx + c is a smooth U-shaped curve called a PARABOLA. Everything about the equation can be read off it.",

    atoms: [
      {
        id: "a-ma-l4-a2-1",
        title: "Drawing a quadratic graph",
        explain: "Make a table of values, plot the points, and join them with a SMOOTH curve, never straight lines. If a > 0 the curve opens upwards (a minimum); if a < 0 it opens downwards (a maximum).",
        example: "  y = x² − 2x − 3\n    x │ −2  −1   0   1   2   3   4\n    y │  5   0  −3  −4  −3   0   5",
        mistake: "Squaring a negative x as a negative: (−2)² = 4, so the curve rises on BOTH sides.",
        drill: { skill: "L4-A2.1", count: 3 },
      },
      {
        id: "a-ma-l4-a2-2",
        title: "Roots, maximum and minimum",
        explain: "The ROOTS of ax² + bx + c = 0 are where the curve cuts the x-axis. The TURNING POINT is the lowest (or highest) point; it lies on the AXIS OF SYMMETRY x = −b/(2a), halfway between the roots.",
        example: "  y = x² − 2x − 3\n    roots: x = −1 and x = 3\n    axis of symmetry: x = 1\n    turning point: (1, −4), the minimum value of y is −4",
        mistake: "Giving the x-coordinate when asked for the minimum value. The minimum VALUE is the y-coordinate.",
        drill: { skill: "L4-A2.2", count: 4 },
      },
      {
        id: "a-ma-l4-a2-3",
        title: "Line and curve intersections",
        explain: "Where a line meets a curve, both equations give the same y. Set them equal and solve. Graphically, the x-coordinates of the crossing points are the solutions.",
        example: "  y = x² − 2x − 3 and y = x + 1\n    x² − 2x − 3 = x + 1\n    x² − 3x − 4 = 0  →  (x − 4)(x + 1) = 0  →  x = 4 or x = −1",
        mistake: "Reading the y-values of the crossing points when the question asks for the solutions of the equation in x.",
        drill: { skill: "L4-A2.3", count: 3 },
      },
      {
        id: "a-ma-l4-a2-4",
        title: "Tangent and gradient",
        explain:
          "The GRADIENT of a straight line is change in y ÷ change in x. The gradient of a curve at a point is the gradient of the TANGENT there: the straight line that just touches the curve at that point. Draw it, pick two points on it far apart, and calculate.",
        example: "  A tangent passes through (1, 2) and (4, 11).\n    gradient = (11 − 2) ÷ (4 − 1) = 9 ÷ 3 = 3",
        mistake: "Dividing change in x by change in y. It is always RISE over RUN: y on top.",
        drill: { skill: "L4-A2.4", count: 3 },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  {
    id: "ma-l4-a3",
    moduleId: "ma-28-quadratics-variation",
    sectionId: SECTION_ID,
    skillGroup: "L4-A3",
    order: 3,
    title: "Variation",
    subtitle: "Direct, inverse, joint and partial",
    estimatedMinutes: 35,
    intro: "Variation describes how one quantity depends on others. Every variation problem has the same three steps: write the law with k, find k, use it.",

    atoms: [
      {
        id: "a-ma-l4-a3-1",
        title: "Direct and inverse variation with powers",
        explain: "y can vary with a power or root of x, directly or inversely. Write the law, find k from the pair of values given, then substitute.",
        table: {
          caption: "The laws.",
          headers: ["Words", "Law"],
          rows: [
            ["y varies as the square of x", "y = kx²"],
            ["y varies inversely as x", "y = k/x"],
            ["y varies inversely as the square of x", "y = k/x²"],
            ["y varies as the square root of x", "y = k√x"],
          ],
        },
        example: "  y ∝ 1/x², y = 9 when x = 2:   k = 36,   so when x = 3, y = 4",
        mistake: "Using y = kx when the question says 'the square of x'.",
        drill: { skill: "L4-A3.1", count: 4 },
      },
      {
        id: "a-ma-l4-a3-2",
        title: "Joint and partial variation",
        explain: "In JOINT variation, a quantity varies with two others at once: z = kxy, or z = kx/y. In PARTIAL variation, part is fixed and part varies: y = a + bx, with two constants found from two pairs of values.",
        example:
          "  z ∝ x/y,  z = 6 when x = 4, y = 2:   k = 3,  so z = 3x/y\n\n  Cost = a + bn.  20 guests ₦9 000, 40 guests ₦15 000\n    subtract: 20b = 6 000 → b = 300,  a = 3 000\n    60 guests: 3 000 + 300 × 60 = ₦21 000",
        mistake: "Treating partial variation as direct: double the guests does not double the cost, because of the fixed part.",
        drill: { skill: "L4-A3.2", count: 3 },
      },
      {
        id: "a-ma-l4-a3-3",
        title: "Applied variation problems",
        explain: "Turn the words into a law: 'varies as' means multiply by k, 'inversely' means divide, 'square' or 'square root' tells you the power. Then find k and answer the question.",
        example: "  The distance a stone falls varies as the square of the time. It falls 45 m in 3 s.\n    d = kt²,  45 = 9k → k = 5\n    In 4 s: d = 5 × 16 = 80 m",
        mistake: "Forgetting to square the time when substituting.",
        drill: { skill: "L4-A3.3", count: 3 },
      },
      {
        id: "a-ma-review-28",
        title: "Mixed review",
        explain: "One question on each earlier skill.",
        drill: { review: ["L4-N5.3", "L4-N6.3", "L4-N3.1", "L3-A1.3", "L3-N3.2"], count: 5 },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
