/**
 * MATHEMATICS · MONTH 6 · MODULE 22 · FACTORISATION, FORMULAE AND ALGEBRAIC FRACTIONS
 *
 * CLIENT-SAFE. Atom shape and house style: see ma-01-place-value.js.
 */

export const SECTION_ID = "ma-s22-factorisation-formulae";

export const LESSONS = [
  {
    id: "ma-l3-a1",
    moduleId: "ma-22-factorisation-formulae",
    sectionId: SECTION_ID,
    skillGroup: "L3-A1",
    order: 1,
    title: "Factorisation",
    subtitle: "Grouping, difference of two squares, and quadratic trinomials",
    estimatedMinutes: 50,
    intro: "Factorising is expanding in reverse. It is the single algebra skill that quadratic equations, algebraic fractions and calculus all depend on, so practise it until it is automatic.",

    atoms: [
      {
        id: "a-ma-l3-a1-1",
        title: "Factorising by grouping",
        explain: "With four terms, group them into two pairs that each have a common factor. Factorise each pair; the two brackets should match. Then take the matching bracket out.",
        example:
          "  ax + 3a + 2x + 6\n    = a(x + 3) + 2(x + 3)\n    = (a + 2)(x + 3)\n\n  xy − 5x + 2y − 10\n    = x(y − 5) + 2(y − 5)\n    = (x + 2)(y − 5)",
        mistake: "Stopping at a(x + 3) + 2(x + 3). That is still a sum: take (x + 3) out to finish.",
        drill: { skill: "L3-A1.1", count: 3 },
      },
      {
        id: "a-ma-l3-a1-2",
        title: "Difference of two squares",
        explain: "a² − b² = (a + b)(a − b). Spot two perfect squares with a minus between them. It also makes some calculations easy.",
        example:
          "  x² − 49 = (x + 7)(x − 7)\n  9x² − 16 = (3x + 4)(3x − 4)\n  2x² − 50 = 2(x² − 25) = 2(x + 5)(x − 5)\n\n  73² − 27² = (73 + 27)(73 − 27) = 100 × 46 = 4 600",
        mistake: "Trying to factorise a SUM of squares, x² + 49. It does not factorise.",
        drill: { skill: "L3-A1.2", count: 4 },
      },
      {
        id: "a-ma-l3-a1-3",
        title: "Factorising quadratic trinomials",
        explain:
          "A QUADRATIC expression has x² as its highest power, like x² + 7x + 12. For x² + bx + c, find two numbers that MULTIPLY to c and ADD to b; they go in the brackets. For ax² + bx + c, find two numbers that multiply to a × c and add to b, split the middle term with them, and factorise by grouping.",
        table: {
          caption: "Signs tell you where to look.",
          headers: ["c", "b", "The two numbers"],
          rows: [
            ["positive", "positive", "both positive"],
            ["positive", "negative", "both negative"],
            ["negative", "either", "one positive, one negative"],
          ],
        },
        example:
          "  x² + 7x + 12:   3 × 4 = 12, 3 + 4 = 7    →  (x + 3)(x + 4)\n  x² − 2x − 15:   −5 × 3 = −15, −5 + 3 = −2  →  (x − 5)(x + 3)\n\n  2x² + 7x + 3:   a × c = 6;  6 × 1 = 6, 6 + 1 = 7\n    = 2x² + 6x + x + 3 = 2x(x + 3) + 1(x + 3) = (2x + 1)(x + 3)",
        mistake: "Getting the signs the wrong way round. Expand your answer to check the middle term.",
        drill: { skill: "L3-A1.3", count: 5 },
      },
      {
        id: "a-ma-l3-a1-4",
        title: "Simplifying by factorising",
        explain: "To simplify an algebraic fraction, factorise the top and the bottom completely, then cancel brackets that are common to both. You may only cancel factors, never single terms.",
        example: "  (x² − 9)/(x + 3) = (x + 3)(x − 3)/(x + 3) = x − 3\n\n  (x² + 5x + 6)/(x² + x − 2) = (x + 2)(x + 3)/((x + 2)(x − 1)) = (x + 3)/(x − 1)",
        mistake: "Cancelling the x² terms: (x² + 5x + 6)/(x² + x − 2) is not (5x + 6)/(x − 2). Factorise first.",
        drill: { skill: "L3-A1.4", count: 4 },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  {
    id: "ma-l3-a3",
    moduleId: "ma-22-factorisation-formulae",
    sectionId: SECTION_ID,
    skillGroup: "L3-A3",
    order: 2,
    title: "Formulae",
    subtitle: "Changing the subject with powers and roots, and substituting",
    estimatedMinutes: 30,
    intro: "A formula is a rule written with letters. Rearranging it and substituting into it are the two things every science subject will ask of you.",

    atoms: [
      {
        id: "a-ma-l3-a3-1",
        title: "Changing the subject with powers and roots",
        explain:
          "Get the term containing the new subject on its own first. If the subject is squared, take the square root of both sides at the end. If it is under a square root, square both sides.",
        example:
          "  A = πr².   Make r the subject.\n    r² = A/π\n    r = √(A/π)\n\n  T = 2π√(l/g).   Make l the subject.\n    T/(2π) = √(l/g)\n    T²/(4π²) = l/g\n    l = gT²/(4π²)",
        mistake: "Halving instead of square-rooting: r² = A/π gives r = √(A/π), not r = A/(2π).",
        drill: { skill: "L3-A3.1", count: 3 },
      },
      {
        id: "a-ma-l3-a3-2",
        title: "Substituting into formulae",
        explain: "Replace each letter by its value, in brackets if negative, and evaluate with BODMAS. Square before multiplying; multiply before adding.",
        example: "  s = ut + ½at²,  u = 4, a = 3, t = 6\n    s = 4 × 6 + ½ × 3 × 36 = 24 + 54 = 78\n\n  1/f = 1/u + 1/v,  u = 12, v = 6\n    1/f = 1/12 + 2/12 = 3/12  →  f = 4",
        mistake: "Squaring the whole of at: ½at² means ½ × a × t², not ½ × (at)².",
        drill: { skill: "L3-A3.2", count: 4 },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  {
    id: "ma-l3-a5",
    moduleId: "ma-22-factorisation-formulae",
    sectionId: SECTION_ID,
    skillGroup: "L3-A5",
    order: 3,
    title: "Algebraic Fractions",
    subtitle: "Adding, subtracting, multiplying and dividing",
    estimatedMinutes: 30,
    intro: "Algebraic fractions follow exactly the rules of number fractions. Only the factors look different.",

    atoms: [
      {
        id: "a-ma-l3-a5-1",
        title: "Adding and subtracting algebraic fractions",
        explain: "Find a common denominator, rewrite each fraction over it, then add or subtract the numerators. Put every numerator in brackets: a minus sign in front of a fraction applies to its WHOLE numerator.",
        example:
          "  (x + 1)/3 + (x − 2)/4\n    = [4(x + 1) + 3(x − 2)]/12\n    = (4x + 4 + 3x − 6)/12\n    = (7x − 2)/12\n\n  (x + 1)/3 − (x − 2)/4 = [4(x + 1) − 3(x − 2)]/12 = (x + 10)/12",
        mistake: "Subtracting only the first term of the second numerator: −3(x − 2) is −3x + 6, not −3x − 6.",
        drill: { skill: "L3-A5.1", count: 4 },
      },
      {
        id: "a-ma-l3-a5-2",
        title: "Multiplying and dividing algebraic fractions",
        explain: "Multiply the tops and the bottoms, cancelling common factors first. To divide, multiply by the reciprocal of the second fraction.",
        example: "  4x/9 × 3/(2x²) = 12x/(18x²) = 2/(3x)\n\n  2x/5 ÷ 4x²/15 = 2x/5 × 15/(4x²) = 30x/(20x²) = 3/(2x)",
        mistake: "Turning the first fraction over when dividing. Only the second one is inverted.",
        drill: { skill: "L3-A5.2", count: 3 },
      },
      {
        id: "a-ma-review-22",
        title: "Mixed review",
        explain: "One question on each earlier skill.",
        drill: { review: ["L3-N1.1", "L3-N2.1", "L3-N3.2", "L2-A1.2", "L2-A2.2"], count: 5 },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
