/**
 * MATHEMATICS · MONTH 4 · MODULE 16 · BRACKETS AND LINEAR EQUATIONS
 *
 * CLIENT-SAFE. Atom shape and house style: see ma-01-place-value.js.
 */

export const SECTION_ID = "ma-s16-expanding-equations";

export const LESSONS = [
  {
    id: "ma-l2-a1",
    moduleId: "ma-16-expanding-equations",
    sectionId: SECTION_ID,
    skillGroup: "L2-A1",
    order: 1,
    title: "Expanding and Factorising",
    subtitle: "Multiplying out brackets, and putting them back",
    estimatedMinutes: 45,
    intro: "Expanding removes brackets by multiplying. Factorising puts them back by finding what every term shares. They are the same law, the distributive law, read in two directions.",

    atoms: [
      {
        id: "a-ma-l2-a1-1",
        title: "Expanding single brackets",
        explain: "The DISTRIBUTIVE LAW: a(b + c) = ab + ac. Multiply EVERY term inside the bracket by the term outside. A negative outside changes the sign of every term inside.",
        example: "  3(2x − 5) = 6x − 15\n  −2(x − 4) = −2x + 8\n  x(x + 7) = x² + 7x\n  4(x + 2) − 3(x − 1) = 4x + 8 − 3x + 3 = x + 11",
        mistake: "Multiplying only the first term: 3(2x − 5) is not 6x − 5.",
        drill: { skill: "L2-A1.1", count: 5 },
      },
      {
        id: "a-ma-l2-a1-2",
        title: "Expanding double brackets",
        explain: "Each term in the first bracket multiplies each term in the second: four products. Then collect like terms. A squared bracket means the bracket times itself.",
        table: {
          caption: "Results worth knowing by heart.",
          headers: ["Expression", "Expanded"],
          rows: [
            ["(a + b)²", "a² + 2ab + b²"],
            ["(a − b)²", "a² − 2ab + b²"],
            ["(a + b)(a − b)", "a² − b²"],
          ],
        },
        example: "  (x + 3)(x − 5)\n    x × x = x²,   x × (−5) = −5x,   3 × x = 3x,   3 × (−5) = −15\n    = x² − 2x − 15\n\n  (2x − 1)² = (2x − 1)(2x − 1) = 4x² − 4x + 1",
        mistake: "Squaring each term: (x + 3)² is not x² + 9. The middle term 6x is missing.",
        drill: { skill: "L2-A1.2", count: 5 },
      },
      {
        id: "a-ma-l2-a1-3",
        title: "Factorising by a common factor",
        explain: "To FACTORISE, find the highest common factor of every term, numbers and letters, write it outside a bracket, and divide each term by it to get what goes inside. Check by expanding back.",
        example: "  6x + 9 = 3(2x + 3)\n  4x² − 10x = 2x(2x − 5)\n  5ab + 15a = 5a(b + 3)\n\n  Check: 2x(2x − 5) = 4x² − 10x  ✓",
        mistake: "Not taking out ALL of the common factor: 4x² − 10x = 2(2x² − 5x) is not finished, because x is still common.",
        drill: { skill: "L2-A1.3", count: 4 },
      },
      {
        id: "a-ma-l2-a1-4",
        title: "Simplifying simple algebraic fractions",
        explain: "An algebraic fraction simplifies like a number fraction: cancel a FACTOR common to the whole top and the whole bottom. If the top has several terms, divide every term, or factorise it first.",
        example: "  12x⁵ ÷ 4x² = 3x³\n  (6x + 9) ÷ 3 = 2x + 3\n  (5x + 10) ÷ (x + 2) = 5(x + 2) ÷ (x + 2) = 5",
        mistake: "Cancelling one term: in (x + 6)/x you cannot cancel the x's to leave 6. x is a term of the top, not a factor of it.",
        drill: { skill: "L2-A1.4", count: 4 },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  {
    id: "ma-l2-a2",
    moduleId: "ma-16-expanding-equations",
    sectionId: SECTION_ID,
    skillGroup: "L2-A2",
    order: 2,
    title: "Linear Equations",
    subtitle: "Brackets, fractions, and changing the subject",
    estimatedMinutes: 40,
    intro: "The rule never changes: do the same to both sides. Brackets and fractions only add a first step to clear them away.",

    atoms: [
      {
        id: "a-ma-l2-a2-1",
        title: "Equations with brackets",
        explain: "Expand the brackets, collect the letter terms on one side and the numbers on the other, then divide. Moving a term across the equals sign is doing the opposite operation to both sides, so its sign changes.",
        example: "  3(x − 5) = x + 7\n    3x − 15 = x + 7\n    3x − x = 7 + 15\n    2x = 22\n    x = 11\n    Check: 3(11 − 5) = 18 and 11 + 7 = 18  ✓",
        mistake: "Moving a term without changing its sign: 3x − 15 = x + 7 does not give 2x = 7 − 15.",
        drill: { skill: "L2-A2.1", count: 4 },
      },
      {
        id: "a-ma-l2-a2-2",
        title: "Equations with fractions",
        explain: "Multiply EVERY term on both sides by the LCM of the denominators. The fractions disappear and an ordinary equation is left. With one fraction on each side, cross-multiply.",
        example:
          "  x/3 + x/4 = 7          × 12:  4x + 3x = 84  →  x = 12\n\n  (x + 2)/2 = (x − 3)/3   cross-multiply:\n    3(x + 2) = 2(x − 3)\n    3x + 6 = 2x − 6\n    x = −12",
        mistake: "Multiplying only some terms by the LCM. Every term, on both sides, must be multiplied.",
        drill: { skill: "L2-A2.2", count: 4 },
      },
      {
        id: "a-ma-l2-a2-3",
        title: "Changing the subject",
        explain: "The SUBJECT of a formula is the letter on its own on one side. To make a different letter the subject, treat it as the unknown and undo the operations around it, in reverse order, doing the same to both sides.",
        example:
          "  v = u + at.   Make a the subject.\n    v − u = at\n    a = (v − u)/t\n\n  p = 2(l + w).   Make w the subject.\n    p/2 = l + w\n    w = p/2 − l",
        mistake: "Dividing only part of a side: from v − u = at, the answer is a = (v − u)/t, not a = v − u/t.",
        drill: { skill: "L2-A2.3", count: 4 },
      },
      {
        id: "a-ma-review-16",
        title: "Mixed review",
        explain: "One question on each earlier skill.",
        drill: { review: ["L2-N2.1", "L2-N2.2", "L2-N1.2", "L2-N1.6", "L1-A1.4"], count: 5 },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
