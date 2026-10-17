/**
 * MATHEMATICS · MONTH 3 · MODULE 11 · ALGEBRA BEGINS
 *
 * CLIENT-SAFE. Atom shape and house style: see ma-01-place-value.js.
 */

export const SECTION_ID = "ma-s11-algebra-begins";

export const LESSONS = [
  {
    id: "ma-l1-a1",
    moduleId: "ma-11-algebra-begins",
    sectionId: SECTION_ID,
    skillGroup: "L1-A1",
    order: 1,
    title: "Algebraic Expressions",
    subtitle: "Letters for numbers, like terms, substitution, and writing expressions",
    estimatedMinutes: 40,
    intro: "A letter stands for a number you do not know yet, or one that can change. Every rule of arithmetic still works on it.",

    atoms: [
      {
        id: "a-ma-l1-a1-1",
        title: "Letters for unknowns",
        explain:
          "In algebra a letter stands for a number. 3x means 3 × x. An EXPRESSION like 3x + 5 is built from TERMS, separated by + and − signs. The number in front of a letter is its COEFFICIENT. A term with no letter is a CONSTANT.",
        table: {
          caption: "The parts of 3x − 4y + 7.",
          headers: ["Term", "Coefficient", "Kind"],
          rows: [
            ["3x", "3", "x term"],
            ["−4y", "−4", "y term (the sign belongs to the term)"],
            ["7", "", "constant"],
          ],
        },
        example: "  x + x + x = 3x       (three lots of x)\n  y × y = y²\n  5 × a × b = 5ab\n  x means 1x            (the 1 is not written)",
        visual: { kind: "termStrip", expression: "3x − 4y + 7" },
        mistake: "Leaving the sign behind. In 3x − 4y + 7, the y term is −4y, so the coefficient of y is −4, not 4.",
        drill: { skill: "L1-A1.1", count: 4 },
      },
      {
        id: "a-ma-l1-a1-2",
        title: "Collecting like terms",
        explain:
          "LIKE TERMS have exactly the same letters with the same powers: 3x and 5x are like terms, 3x and 3x² are not. Add or subtract the coefficients of like terms. Unlike terms stay separate.",
        example:
          "  4a + 7b − a + 2b\n    a terms: 4a − a = 3a\n    b terms: 7b + 2b = 9b\n    = 3a + 9b\n\n  5x² + 3x − 2x² + x = 3x² + 4x",
        visual: { kind: "termStrip", expression: "4a + 7b − a + 2b", group: true },
        mistake: "Combining unlike terms: 3a + 9b is not 12ab. Different letters cannot be added into one term.",
        drill: { skill: "L1-A1.2", count: 4 },
      },
      {
        id: "a-ma-l1-a1-3",
        title: "Substitution",
        explain:
          "To SUBSTITUTE, replace each letter with its value in brackets, then work it out with BODMAS. Brackets matter most when the value is negative.",
        example:
          "  Find 3x² − 2x + 1 when x = −2.\n    3(−2)² − 2(−2) + 1\n    = 3 × 4 + 4 + 1\n    = 17\n\n  Note: (−2)² = 4, and 3(−2)² = 3 × 4, not (3 × −2)².",
        visual: { kind: "substitutionStrip", expression: "3x² − 2x + 1", value: -2 },
        mistake: "Squaring before putting in brackets: −2² is read as −(2²) = −4. Write (−2)² = 4.",
        drill: { skill: "L1-A1.3", count: 4 },
      },
      {
        id: "a-ma-l1-a1-4",
        title: "Writing an expression from words",
        explain: "Turn the words into operations one phrase at a time. Choose a letter for the unknown, then build the expression.",
        table: {
          caption: "Common phrases.",
          headers: ["Words", "Expression"],
          rows: [
            ["5 more than n", "n + 5"],
            ["7 less than n", "n − 7"],
            ["n less than 7", "7 − n"],
            ["twice n", "2n"],
            ["half of n", "n/2"],
            ["n pens at ₦150 each, plus ₦200 transport", "150n + 200"],
          ],
        },
        visual: { kind: "translateStrip", phrase: "7 less than three times n", expression: "3n − 7" },
        mistake: "Reversing 'less than'. '7 less than n' means start with n and take 7 away: n − 7, not 7 − n.",
        drill: { skill: "L1-A1.4", count: 4 },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  {
    id: "ma-l1-a2",
    moduleId: "ma-11-algebra-begins",
    sectionId: SECTION_ID,
    skillGroup: "L1-A2",
    order: 2,
    title: "Simple Equations",
    subtitle: "Keeping the balance",
    estimatedMinutes: 35,
    intro: "An equation says two things are equal. Solving it means finding the value of the letter that makes it true, and the one rule is: do the same to both sides.",

    atoms: [
      {
        id: "a-ma-l1-a2-1",
        title: "One-step equations",
        explain:
          "An EQUATION is like a balance: both sides are equal. To find the letter, undo what has been done to it with the inverse operation, and do the same to BOTH sides so they stay equal.",
        table: {
          caption: "Undo with the opposite operation.",
          headers: ["Equation", "Undo", "Solution"],
          rows: [
            ["x + 9 = 23", "− 9 both sides", "x = 14"],
            ["x − 6 = 11", "+ 6 both sides", "x = 17"],
            ["5x = 35", "÷ 5 both sides", "x = 7"],
            ["x/4 = 3", "× 4 both sides", "x = 12"],
          ],
        },
        visual: { kind: "balance", left: "x + 9", right: "23" },
        mistake: "Doing the operation that is shown instead of its opposite: x + 9 = 23 does not give x = 32.",
        drill: { skill: "L1-A2.1", count: 4 },
      },
      {
        id: "a-ma-l1-a2-2",
        title: "Two-step equations",
        explain: "Undo the operations in reverse order: first the + or −, then the × or ÷. Check by putting the answer back in.",
        example:
          "  3x + 7 = 31\n    − 7:   3x = 24\n    ÷ 3:   x = 8\n    check: 3 × 8 + 7 = 31  ✓\n\n  x/5 − 2 = 4\n    + 2:   x/5 = 6\n    × 5:   x = 30",
        mistake: "Dividing first: 3x + 7 = 31 → x + 7 = 10.33 goes wrong. Take away the 7 first.",
        drill: { skill: "L1-A2.2", count: 5 },
      },
      {
        id: "a-ma-l1-a2-3",
        title: "Equations from word problems",
        explain: "Let a letter stand for the unknown. Write the facts as an equation. Solve it. Then answer the question that was asked, with units.",
        example:
          "  Tunde is 6 years older than Kemi. Their ages add up to 34.\n  How old is Kemi?\n\n    Let Kemi be k. Tunde is k + 6.\n    k + (k + 6) = 34\n    2k + 6 = 34\n    2k = 28\n    k = 14      Kemi is 14 (and Tunde is 20).",
        mistake: "Stopping at the value of the letter when the question asks for something else, such as Tunde's age.",
        drill: { skill: "L1-A2.3", count: 4 },
      },
      {
        id: "a-ma-review-11",
        title: "Mixed review",
        explain: "One question on each earlier skill.",
        drill: { review: ["L2-N3.1", "L2-N3.3", "L2-N3.4", "L1-N7.2", "L1-N4.3"], count: 5 },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
