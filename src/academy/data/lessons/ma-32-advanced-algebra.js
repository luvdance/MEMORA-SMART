/**
 * MATHEMATICS · MONTH 8 · MODULE 32 · ADVANCED ALGEBRA
 *
 * CLIENT-SAFE. Atom shape and house style: see ma-01-place-value.js.
 */

export const SECTION_ID = "ma-s32-advanced-algebra";

export const LESSONS = [
  {
    id: "ma-l5-a1",
    moduleId: "ma-32-advanced-algebra",
    sectionId: SECTION_ID,
    skillGroup: "L5-A1",
    order: 1,
    title: "Simultaneous Equations: Linear and Quadratic",
    subtitle: "Where a line meets a curve",
    estimatedMinutes: 30,
    intro: "When one equation is linear and the other quadratic, substitution is the method: it turns the pair into one quadratic equation.",

    atoms: [
      {
        id: "a-ma-l5-a1-1",
        title: "One linear and one quadratic",
        explain: "Make y (or x) the subject of the LINEAR equation and substitute it into the quadratic. Solve the quadratic, then put each x back into the linear equation to find its y. There are usually two pairs of answers.",
        example: "  y = x + 1 and x² + y² = 25\n    x² + (x + 1)² = 25\n    2x² + 2x − 24 = 0  →  x² + x − 12 = 0  →  x = 3 or −4\n    y = 4 or −3\n    Solutions: (3, 4) and (−4, −3)",
        mistake: "Substituting x back into the quadratic and getting extra values of y. Use the LINEAR equation.",
        drill: { skill: "L5-A1.1", count: 4 },
      },
      {
        id: "a-ma-l5-a1-2",
        title: "Word problems",
        explain: "A sum and a product, or a perimeter and an area, give one linear and one quadratic equation. Substitute, solve, and check that the answers make sense (lengths must be positive).",
        example: "  Perimeter 30 cm, area 56 cm²:\n    l + w = 15, lw = 56\n    l(15 − l) = 56  →  l² − 15l + 56 = 0  →  l = 7 or 8\n    The rectangle is 8 cm by 7 cm.",
        mistake: "Using the full perimeter as l + w. The perimeter is 2(l + w).",
        drill: { skill: "L5-A1.2", count: 3 },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  {
    id: "ma-l5-a2",
    moduleId: "ma-32-advanced-algebra",
    sectionId: SECTION_ID,
    skillGroup: "L5-A2",
    order: 2,
    title: "Inequalities in Two Variables and Linear Programming",
    subtitle: "Regions, corners, and the best value",
    estimatedMinutes: 45,
    intro: "An inequality in x and y describes a region of the plane. Several together describe a region with corners, and the best value of a profit or cost is always at one of those corners.",

    atoms: [
      {
        id: "a-ma-l5-a2-1",
        title: "Linear inequalities in two variables",
        explain: "Draw the boundary line as if it were an equation: SOLID for ≤ or ≥ (the line is included), BROKEN for < or >. Then test a point not on the line, such as (0, 0): if it satisfies the inequality, its side is the region.",
        example: "  y < 2x + 1\n    boundary y = 2x + 1, broken\n    test (0, 0): 0 < 1 ✓  → the side containing the origin",
        mistake: "Drawing a solid line for a strict inequality. < and > exclude the line itself.",
        drill: { skill: "L5-A2.1", count: 3 },
      },
      {
        id: "a-ma-l5-a2-2",
        title: "Simultaneous inequalities",
        explain: "The region satisfying several inequalities is where all their regions overlap. WAEC convention: shade the UNWANTED side of each line, so the region left clear is the answer.",
        example: "  x ≥ 0, y ≥ 0, x + y ≤ 4\n    a triangle with corners (0, 0), (4, 0), (0, 4)\n    whole-number points inside: 15",
        mistake: "Mixing conventions: say clearly whether the shaded part is wanted or unwanted.",
        drill: { skill: "L5-A2.2", count: 3 },
      },
      {
        id: "a-ma-l5-a2-3",
        title: "Linear programming",
        explain: "To maximise or minimise an expression such as P = 3x + 2y over a region, work out P at every CORNER of the region. The largest value is the maximum and the smallest is the minimum.",
        example: "  Corners (0, 0), (6, 0), (4, 3), (0, 5);  P = 30x + 20y\n    P = 0, 180, 180, 100\n    Maximum P = 180",
        mistake: "Testing points in the middle of the region. The best value is always at a corner.",
        drill: { skill: "L5-A2.3", count: 3 },
      },
      {
        id: "a-ma-l5-a2-4",
        title: "Quadratic inequalities",
        explain: "Factorise and find the critical values. For an upward parabola, the expression is NEGATIVE between the roots and POSITIVE outside them.",
        example: "  x² − x − 6 < 0\n    (x − 3)(x + 2) < 0\n    −2 < x < 3\n\n  x² − x − 6 > 0  →  x < −2 or x > 3",
        mistake: "Writing −2 > x > 3 for the 'outside' case. It is two separate pieces: x < −2 OR x > 3.",
        drill: { skill: "L5-A2.4", count: 3 },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  {
    id: "ma-l5-a3",
    moduleId: "ma-32-advanced-algebra",
    sectionId: SECTION_ID,
    skillGroup: "L5-A3",
    order: 3,
    title: "Algebraic Fractions 2",
    subtitle: "Binomial denominators, undefined values and equations",
    estimatedMinutes: 35,
    intro: "With brackets in the denominators, the common denominator is the product of the brackets, and some values of x become forbidden.",

    atoms: [
      {
        id: "a-ma-l5-a3-1",
        title: "Binomial denominators",
        explain: "To add a/(x + p) and b/(x + q), use the common denominator (x + p)(x + q): multiply each numerator by the OTHER bracket.",
        example: "  3/(x + 1) + 2/(x − 2)\n    = [3(x − 2) + 2(x + 1)] / [(x + 1)(x − 2)]\n    = (5x − 4)/[(x + 1)(x − 2)]",
        mistake: "Adding the tops and adding the bottoms: 5/(2x − 1) is wrong.",
        drill: { skill: "L5-A3.1", count: 3 },
      },
      {
        id: "a-ma-l5-a3-2",
        title: "Undefined values",
        explain: "Division by zero has no meaning, so a fraction is UNDEFINED wherever its denominator is zero. Factorise the denominator and set each factor to zero.",
        example: "  (x + 4)/(x² − 9) is undefined when x² − 9 = 0: x = 3 or x = −3",
        mistake: "Setting the numerator to zero. That makes the fraction equal 0, which is fine.",
        drill: { skill: "L5-A3.2", count: 3 },
      },
      {
        id: "a-ma-l5-a3-3",
        title: "Equations with algebraic fractions",
        explain: "Multiply through by the common denominator, or cross-multiply when there is one fraction on each side. Then solve, and reject any answer that makes a denominator zero.",
        example: "  3/(x + 1) = 2/(x − 2)\n    3(x − 2) = 2(x + 1)\n    3x − 6 = 2x + 2  →  x = 8",
        mistake: "Keeping an answer that makes a denominator zero. Always check.",
        drill: { skill: "L5-A3.3", count: 3 },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  {
    id: "ma-l5-a4",
    moduleId: "ma-32-advanced-algebra",
    sectionId: SECTION_ID,
    skillGroup: "L5-A4",
    order: 4,
    title: "Functions and Relations",
    subtitle: "Mappings, rules and function notation",
    estimatedMinutes: 30,
    intro: "A RELATION pairs inputs with outputs. A FUNCTION is a relation where every input has exactly one output. f(x) is the output when the input is x.",

    atoms: [
      {
        id: "a-ma-l5-a4-1",
        title: "Types of mapping",
        explain: "ONE-TO-ONE: each input has its own output. MANY-TO-ONE: different inputs share an output. ONE-TO-MANY: an input has several outputs. MANY-TO-MANY: both. Only one-to-one and many-to-one are FUNCTIONS.",
        example: "  {(1, 3), (2, 5), (3, 7)}     one-to-one, a function\n  {(−2, 4), (2, 4), (3, 9)}    many-to-one, a function\n  {(4, 2), (4, −2)}            one-to-many, NOT a function",
        mistake: "Calling a many-to-one mapping 'not a function'. Repeated outputs are allowed; repeated inputs with different outputs are not.",
        drill: { skill: "L5-A4.1", count: 3 },
      },
      {
        id: "a-ma-l5-a4-2",
        title: "Finding the rule",
        explain: "Look at how the outputs change as the inputs go up by 1. A constant change d means f(x) = dx + c; find c from one pair. Changes that grow suggest a square.",
        example: "  1 → 5, 2 → 8, 3 → 11, 4 → 14\n    +3 each time: f(x) = 3x + c;  f(1) = 5 → c = 2\n    f(x) = 3x + 2",
        mistake: "Writing f(x) = x + 3 because the outputs 'go up in 3s'. Going up by 3 means 3x.",
        drill: { skill: "L5-A4.2", count: 3 },
      },
      {
        id: "a-ma-l5-a4-3",
        title: "Evaluating functions",
        explain: "To find f(a), replace every x in the rule with a, in brackets. To solve f(x) = k, set the rule equal to k and solve for x.",
        example: "  f(x) = 2x² − 3x + 1\n    f(−2) = 2(4) − 3(−2) + 1 = 8 + 6 + 1 = 15\n  g(x) = 4x − 7 = 13  →  x = 5",
        mistake: "Squaring before putting in brackets: 2(−2)² is 2 × 4 = 8, not (2 × −2)² = 16.",
        drill: { skill: "L5-A4.3", count: 4 },
      },
      {
        id: "a-ma-review-32",
        title: "Mixed review",
        explain: "One question on each earlier skill.",
        drill: { review: ["L5-N1.2", "L5-N1.3", "L5-N2.1", "L4-A1.3", "L4-A2.3"], count: 5 },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
