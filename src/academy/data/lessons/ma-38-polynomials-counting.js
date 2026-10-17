/**
 * MATHEMATICS · MONTH 10 · MODULE 38 · POLYNOMIALS, PERMUTATIONS AND COMBINATIONS
 *
 * CLIENT-SAFE. Atom shape and house style: see ma-01-place-value.js.
 */

export const SECTION_ID = "ma-s38-polynomials-counting";

export const LESSONS = [
  {
    id: "ma-l6-a1",
    moduleId: "ma-38-polynomials-counting",
    sectionId: SECTION_ID,
    skillGroup: "L6-A1",
    order: 1,
    title: "Polynomials",
    subtitle: "Division, the remainder and factor theorems, cubics (JAMB)",
    estimatedMinutes: 45,
    intro: "A POLYNOMIAL is a sum of whole-number powers of x with number coefficients. Its DEGREE is the highest power: a cubic has degree 3.",

    atoms: [
      {
        id: "a-ma-l6-a1-1",
        title: "Multiplying and dividing",
        explain: "A POLYNOMIAL adds whole-number powers of x, such as 2x³ − x + 5. To multiply polynomials, multiply every term by every term and collect. To divide by (x − a), use long division: divide the leading terms, multiply back, subtract, bring down, repeat.",
        example: "  (x³ − 2x² − 5x + 6) ÷ (x − 1)\n    x² : x²(x − 1) = x³ − x²       leaves −x² − 5x\n    −x : −x(x − 1) = −x² + x       leaves −6x + 6\n    −6 : −6(x − 1) = −6x + 6       leaves 0\n    Quotient x² − x − 6",
        mistake: "Forgetting a missing power. Write x³ + 0x² − 7x + 6 so the columns line up.",
        drill: { skill: "L6-A1.1", count: 3 },
      },
      {
        id: "a-ma-l6-a1-2",
        title: "The remainder theorem",
        explain: "When f(x) is divided by (x − a), the REMAINDER is f(a). For (ax − b), it is f(b/a). No division needed.",
        example: "  f(x) = x³ + 2x − 5 divided by (x + 2)\n    f(−2) = −8 − 4 − 5 = −17",
        mistake: "Substituting +2 for (x + 2). Set the divisor to zero: x = −2.",
        drill: { skill: "L6-A1.2", count: 3 },
      },
      {
        id: "a-ma-l6-a1-3",
        title: "The factor theorem and cubics",
        explain: "If f(a) = 0, then (x − a) is a FACTOR. To factorise a cubic: try small whole numbers that divide the constant until one gives 0, divide by that factor, then factorise the quadratic left over.",
        example: "  f(x) = x³ − 6x² + 11x − 6\n    f(1) = 1 − 6 + 11 − 6 = 0  →  (x − 1) is a factor\n    f(x) = (x − 1)(x² − 5x + 6) = (x − 1)(x − 2)(x − 3)",
        mistake: "Trying values at random. Only divisors of the constant term can be whole-number roots.",
        drill: { skill: "L6-A1.3", count: 3 },
      },
      {
        id: "a-ma-l6-a1-4",
        title: "Sketching cubics",
        explain: "From y = k(x − p)(x − q)(x − r): it crosses the x-axis at p, q and r, and the y-axis at x = 0. If k > 0 it rises to the right (comes from bottom-left); if k < 0 it falls to the right.",
        example: "  y = (x + 1)(x − 2)(x − 3)\n    x-intercepts −1, 2, 3\n    y-intercept (1)(−2)(−3) = 6\n    k = 1 > 0: bottom-left to top-right",
        mistake: "Losing a sign in the y-intercept. Put x = 0 into EVERY bracket and multiply carefully.",
        drill: { skill: "L6-A1.4", count: 3 },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  {
    id: "ma-l6-s1",
    moduleId: "ma-38-polynomials-counting",
    sectionId: SECTION_ID,
    skillGroup: "L6-S1",
    order: 2,
    title: "Permutations and Combinations",
    subtitle: "Counting without listing (JAMB)",
    estimatedMinutes: 45,
    intro: "n! (n FACTORIAL) = n × (n − 1) × … × 2 × 1, with 0! = 1. It counts the ways to arrange n different things in a row. ORDER MATTERS → permutation. ORDER DOES NOT MATTER → combination.",

    atoms: [
      {
        id: "a-ma-l6-s1-1",
        title: "Arrangements",
        explain: "n different things in a line: n!. In a CIRCLE: (n − 1)!, since turning the whole circle changes nothing. r things from n, in order: ⁿPᵣ = n!/(n − r)!.",
        table: [
          ["Situation", "Count"],
          ["5 books in a row", "5! = 120"],
          ["5 people round a table", "4! = 24"],
          ["Chair and secretary from 8", "⁸P₂ = 8 × 7 = 56"],
        ],
        example: "  Two people must stand together among 5: tie them as one block\n    4! × 2 = 48",
        mistake: "Using n! for a circle. Fix one person first: (n − 1)!.",
        drill: { skill: "L6-S1.1", count: 3 },
      },
      {
        id: "a-ma-l6-s1-2",
        title: "Repeated objects",
        explain: "If some objects are identical, divide by the factorial of each repeat count: n!/(p! q! …). Swapping two identical letters gives the same word.",
        example: "  LETTER: 6 letters, E × 2, T × 2\n    6!/(2! 2!) = 720/4 = 180",
        mistake: "Dividing by 2 instead of 2! × 2! when two different letters repeat.",
        drill: { skill: "L6-S1.2", count: 3 },
      },
      {
        id: "a-ma-l6-s1-3",
        title: "Selections: ⁿCᵣ",
        explain: "Choosing r from n where order does not matter: ⁿCᵣ = n!/(r!(n − r)!). For a team, a committee or a handful, use C. For posts, positions or a queue, use P. Separate choices that happen together are MULTIPLIED.",
        example: "  Team of 3 from 7: ⁷C₃ = 35\n  2 men from 5 and 1 woman from 4: ⁵C₂ × ⁴C₁ = 10 × 4 = 40",
        mistake: "Using P for a committee. {Ada, Bola} and {Bola, Ada} are the same committee.",
        drill: { skill: "L6-S1.3", count: 3 },
      },
      {
        id: "a-ma-review-38",
        title: "Mixed review",
        explain: "One question on each earlier skill.",
        drill: { review: ["L6-G1.2", "L6-G2.2", "L6-G3.2", "L6-N1.2", "L6-C1.5"], count: 5 },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
