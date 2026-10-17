/**
 * MATHEMATICS · MONTH 6 · MODULE 23 · SIMULTANEOUS EQUATIONS, INEQUALITIES AND SIMILARITY
 *
 * CLIENT-SAFE. Atom shape and house style: see ma-01-place-value.js.
 */

export const SECTION_ID = "ma-s23-simultaneous-inequalities-similarity";

export const LESSONS = [
  {
    id: "ma-l3-a2",
    moduleId: "ma-23-simultaneous-inequalities-similarity",
    sectionId: SECTION_ID,
    skillGroup: "L3-A2",
    order: 1,
    title: "Simultaneous Linear Equations",
    subtitle: "Elimination, substitution, graphs and word problems",
    estimatedMinutes: 45,
    intro: "Two unknowns need two equations. 'Simultaneously' means finding the one pair (x, y) that makes BOTH true at once.",

    atoms: [
      {
        id: "a-ma-l3-a2-1",
        title: "Elimination",
        explain:
          "Make the coefficients of one letter the same size in both equations, by multiplying one or both equations. If the signs are the same, SUBTRACT the equations; if they are opposite, ADD them. That letter disappears. Solve for the other, then substitute back.",
        example:
          "  2x + 3y = 13   ... (1)\n  5x − 2y = 4    ... (2)\n\n  (1) × 2:  4x + 6y = 26\n  (2) × 3: 15x − 6y = 12\n  Add:     19x = 38   →  x = 2\n  In (1):  4 + 3y = 13  →  y = 3\n  Check in (2): 10 − 6 = 4 ✓",
        mistake: "Subtracting when the signs are opposite. +6y and −6y cancel by ADDING.",
        drill: { skill: "L3-A2.1", count: 4 },
      },
      {
        id: "a-ma-l3-a2-2",
        title: "Substitution",
        explain: "When one equation already gives one letter in terms of the other (y = ...), put that expression into the other equation in place of the letter, in brackets.",
        example: "  y = 2x − 1\n  3x + 2y = 12\n\n  3x + 2(2x − 1) = 12\n  3x + 4x − 2 = 12\n  7x = 14  →  x = 2,   y = 2(2) − 1 = 3",
        mistake: "Forgetting the brackets: 3x + 2 × 2x − 1 loses the −2 from multiplying out.",
        drill: { skill: "L3-A2.2", count: 3 },
      },
      {
        id: "a-ma-l3-a2-3",
        title: "Graphical solution",
        explain: "Draw both lines on the same axes. The solution is the point where they cross, because only that point lies on both lines. Two parallel lines never cross: then there is no solution.",
        example: "  y = x + 1 and y = 7 − x cross where x + 1 = 7 − x\n    2x = 6  →  x = 3,  y = 4.   Solution (3, 4).",
        mistake: "Reading the crossing point as (y, x). Read across first: x, then up: y.",
        drill: { skill: "L3-A2.3", count: 3 },
      },
      {
        id: "a-ma-l3-a2-4",
        title: "Simultaneous equation word problems",
        explain: "Choose a letter for each unknown. Write one equation for each fact in the question. Solve, then answer in words with units.",
        example:
          "  3 pens and 2 rulers cost ₦700. 1 pen and 4 rulers cost ₦900.\n    3p + 2r = 700,   p + 4r = 900\n    From the second: p = 900 − 4r\n    3(900 − 4r) + 2r = 700  →  2 700 − 10r = 700  →  r = 200\n    p = 900 − 800 = 100\n    A pen costs ₦100 and a ruler ₦200.",
        mistake: "Stopping after one unknown when the question asks for the other.",
        drill: { skill: "L3-A2.4", count: 3 },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  {
    id: "ma-l3-a4",
    moduleId: "ma-23-simultaneous-inequalities-similarity",
    sectionId: SECTION_ID,
    skillGroup: "L3-A4",
    order: 2,
    title: "Linear Inequalities",
    subtitle: "Solving them, and showing them on a number line",
    estimatedMinutes: 30,
    intro: "An inequality has a whole range of solutions, not one. Solve it like an equation, with one extra rule.",

    atoms: [
      {
        id: "a-ma-l3-a4-1",
        title: "Solving linear inequalities",
        explain:
          "The signs: < less than, > greater than, ≤ less than or equal to, ≥ greater than or equal to. Solve as an equation, doing the same to both sides. The one extra rule: when you multiply or divide both sides by a NEGATIVE number, reverse the inequality sign.",
        example:
          "  3x − 4 > 11\n    3x > 15   →   x > 5\n\n  5 − 2x ≤ 13\n    −2x ≤ 8\n    x ≥ −4      (divided by −2, so ≤ became ≥)\n\n  Check: x = 0 satisfies 5 − 0 ≤ 13 ✓, and 0 ≥ −4 ✓",
        mistake: "Forgetting to reverse the sign when dividing by a negative. −2x ≤ 8 gives x ≥ −4, not x ≤ −4.",
        drill: { skill: "L3-A4.1", count: 5 },
      },
      {
        id: "a-ma-l3-a4-2",
        title: "Showing solutions on a number line",
        explain: "Draw a circle at the end value. An OPEN circle means the value is not included (< or >). A CLOSED (filled) circle means it is included (≤ or ≥). Draw the line in the direction of the solutions.",
        example:
          "  x > 2:        ○───────→       open circle at 2, arrow right\n  x ≤ −1:  ←───●                  closed circle at −1, arrow left\n  −2 < x ≤ 3:   ○──────●         integers: −1, 0, 1, 2, 3",
        mistake: "Including an end value that has a strict sign: −2 < x does not include −2.",
        drill: { skill: "L3-A4.2", count: 3 },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  {
    id: "ma-l3-g1",
    moduleId: "ma-23-simultaneous-inequalities-similarity",
    sectionId: SECTION_ID,
    skillGroup: "L3-G1",
    order: 3,
    title: "Similarity and Enlargement",
    subtitle: "Same shape, different size",
    estimatedMinutes: 35,
    intro: "Two shapes are SIMILAR when one is an exact enlargement of the other. Every length is multiplied by the same scale factor and every angle stays the same.",

    atoms: [
      {
        id: "a-ma-l3-g1-1",
        title: "Identifying similar shapes",
        explain: "Similar shapes have equal corresponding angles and corresponding sides in the same ratio. Triangles are similar as soon as two pairs of angles are equal. Other shapes need their side ratios checked.",
        example: "  Rectangle 4 × 6 and rectangle 6 × 9:\n    6/4 = 1.5 and 9/6 = 1.5  →  similar\n  Rectangle 4 × 6 and rectangle 6 × 8:\n    6/4 = 1.5 but 8/6 = 1.33  →  not similar",
        mistake: "Adding the same amount instead of multiplying: a 4 × 6 rectangle and a 6 × 8 rectangle both add 2, but they are not similar.",
        drill: { skill: "L3-G1.1", count: 3 },
      },
      {
        id: "a-ma-l3-g1-2",
        title: "Scale factor for lengths",
        explain: "The SCALE FACTOR is new length ÷ old length, using a pair of corresponding sides. Multiply any old length by it to get the matching new length.",
        example: "  AB = 6 cm corresponds to PQ = 15 cm: scale factor 15/6 = 2.5\n  BC = 8 cm, so QR = 8 × 2.5 = 20 cm",
        mistake: "Pairing sides that do not correspond. Match the sides opposite equal angles.",
        drill: { skill: "L3-G1.2", count: 4 },
      },
      {
        id: "a-ma-l3-g1-3",
        title: "Enlargement from a centre",
        explain:
          "An ENLARGEMENT with centre C and scale factor k moves each point P so that its image is k times as far from C, along the same line. A fractional k makes it smaller. A negative k puts the image on the opposite side of C, upside down.",
        example:
          "  Centre (1, 2), scale factor 3, P(3, 3)\n    C → P = (2, 1)\n    × 3   = (6, 3)\n    image = (1 + 6, 2 + 3) = (7, 5)\n\n  Centre (0, 0), scale factor −2, P(2, 1): image (−4, −2)",
        mistake: "Enlarging from the origin when the centre is somewhere else. Always measure from the centre.",
        drill: { skill: "L3-G1.3", count: 3 },
      },
      {
        id: "a-ma-review-23",
        title: "Mixed review",
        explain: "One question on each earlier skill.",
        drill: { review: ["L3-A1.3", "L3-A1.2", "L3-A3.1", "L3-A5.1", "L3-N1.2"], count: 5 },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
