/**
 * MATHEMATICS · MONTH 2 · MODULE 8 · FRACTIONS: ALL FOUR OPERATIONS
 *
 * CLIENT-SAFE. Atom shape and house style: see ma-01-place-value.js.
 */

export const SECTION_ID = "ma-s08-fractions";

export const LESSONS = [
  {
    id: "ma-l1-n3",
    moduleId: "ma-08-fractions",
    sectionId: SECTION_ID,
    skillGroup: "L1-N3",
    order: 1,
    title: "Fractions: All Four Operations",
    subtitle: "Adding, subtracting, multiplying, dividing, mixed numbers and word problems",
    estimatedMinutes: 50,
    intro: "Fractions appear inside ratio, percentages, probability, algebraic fractions and calculus. Four rules, each with a reason.",

    atoms: [
      {
        id: "a-ma-l1-n3-1",
        title: "Adding and subtracting unlike fractions",
        explain:
          "You can only add or subtract fractions when the pieces are the same size, that is, when the denominators are equal. So rewrite both fractions over a common denominator (the LCM of the denominators), then add or subtract the numerators. Simplify at the end.",
        example:
          "  2/3 + 3/4\n    LCM(3, 4) = 12\n    2/3 = 8/12,   3/4 = 9/12\n    8/12 + 9/12 = 17/12 = 1 5/12\n\n  5/6 − 1/4\n    LCM(6, 4) = 12\n    10/12 − 3/12 = 7/12",
        visual: { kind: "fractionBars", parts: [[2, 3], [3, 4]], operation: "add" },
        mistake: "Adding the tops and the bottoms: 2/3 + 3/4 is not 5/7. That answer is less than 3/4 alone, which cannot be right.",
        drill: { skill: "L1-N3.1", count: 5 },
      },
      {
        id: "a-ma-l1-n3-2",
        title: "Multiplying and dividing fractions",
        explain:
          "To multiply, multiply the numerators and multiply the denominators. Cancel common factors first to keep numbers small. To divide, multiply by the RECIPROCAL of the second fraction, which is that fraction turned upside down.",
        table: {
          caption: "The two rules.",
          headers: ["Operation", "Rule", "Example"],
          rows: [
            ["a/b × c/d", "(a × c) / (b × d)", "3/4 × 8/9 = 24/36 = 2/3"],
            ["a/b ÷ c/d", "a/b × d/c", "2/3 ÷ 4/5 = 2/3 × 5/4 = 10/12 = 5/6"],
          ],
          note: "Why divide by multiplying? 3 ÷ 1/4 asks how many quarters fit into 3. Each whole holds 4 quarters, so 3 × 4 = 12.",
        },
        example: "  CANCEL FIRST\n    3/4 × 8/9:  3 and 9 share 3, 4 and 8 share 4\n    = 1/1 × 2/3 = 2/3",
        mistake: "Turning the FIRST fraction upside down, or both. Only the fraction you are dividing BY is turned over.",
        drill: { skill: "L1-N3.2", count: 5 },
      },
      {
        id: "a-ma-l1-n3-3",
        title: "Mixed numbers",
        explain:
          "A MIXED NUMBER has a whole part and a fraction part, like 2 3/4. An IMPROPER FRACTION has a numerator bigger than its denominator, like 11/4. To multiply or divide, always change mixed numbers to improper fractions first.",
        example:
          "  2 3/4 = (2 × 4 + 3)/4 = 11/4\n  17/5  = 17 ÷ 5 = 3 remainder 2 = 3 2/5\n\n  ADD:       1 2/3 + 2 1/2 = 3 + 2/3 + 1/2 = 3 + 7/6 = 4 1/6\n  MULTIPLY:  1 1/2 × 2 2/3 = 3/2 × 8/3 = 24/6 = 4",
        visual: { kind: "mixedBars", whole: 2, numerator: 3, denominator: 4 },
        mistake: "Multiplying the whole parts and the fraction parts separately: 1 1/2 × 2 2/3 is not 2 2/6. Convert first.",
        drill: { skill: "L1-N3.3", count: 4 },
      },
      {
        id: "a-ma-l1-n3-4",
        title: "Fraction word problems with bar models",
        explain:
          "Draw a bar for the whole amount. Cut it into the parts the fraction describes. When a second fraction is 'of the remainder', cut only what is left, not the whole bar.",
        example:
          "  Ngozi has ₦12 000. She spends 1/4 on transport,\n  then 2/3 of the REMAINDER on food. How much is left?\n\n    Transport: 1/4 of 12 000 = 3 000\n    Remainder: 12 000 − 3 000 = 9 000\n    Food:      2/3 of 9 000 = 6 000\n    Left:      9 000 − 6 000 = ₦3 000",
        visual: { kind: "barModel", parts: 4, shaded: 1, total: 12000, label: "1/4 on transport" },
        mistake: "Taking the second fraction of the WHOLE. 2/3 of ₦12 000 is ₦8 000, but the question says 2/3 of what remains.",
        drill: { skill: "L1-N3.4", count: 4 },
      },
      {
        id: "a-ma-review-08",
        title: "Mixed review",
        explain: "One question on each earlier skill.",
        drill: { review: ["L1-N2.2", "L1-N2.3", "L1-N6.2", "L1-N6.3", "L0-N4.2"], count: 5 },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
