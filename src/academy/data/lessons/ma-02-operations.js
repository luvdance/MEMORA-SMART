/**
 * MATHEMATICS · MONTH 1 · MODULE 2 · THE FOUR OPERATIONS
 *
 * CLIENT-SAFE. Atom shape and house style: see ma-01-place-value.js.
 */

export const SECTION_ID = "ma-s02-operations";

export const LESSONS = [
  {
    id: "ma-l0-n2",
    moduleId: "ma-02-operations",
    sectionId: SECTION_ID,
    skillGroup: "L0-N2",
    order: 1,
    title: "The Four Operations",
    subtitle: "Tables, long multiplication, long division and BODMAS",
    estimatedMinutes: 45,
    intro:
      "Fast, accurate arithmetic is what every later topic runs on. Tables to instant recall, the two long methods done the same way every time, and the order of operations.",

    atoms: [
      {
        id: "a-ma-l0-n2-1",
        title: "Times tables to instant recall",
        explain:
          "Every table fact from 1 × 1 to 12 × 12 should come back in under three seconds. You need far fewer than 144 facts, because the order does not matter: 7 × 8 is the same as 8 × 7.",
        table: {
          caption: "Shortcuts that turn one fact into another.",
          headers: ["Table", "Shortcut", "Example"],
          rows: [
            ["× 2", "double", "2 × 17 = 34"],
            ["× 4", "double, then double again", "4 × 7 = 14, 28"],
            ["× 5", "half of × 10", "5 × 14 = 140 ÷ 2 = 70"],
            ["× 9", "× 10, then take one lot away", "9 × 7 = 70 − 7 = 63"],
            ["× 11", "× 10, then add one lot", "11 × 8 = 80 + 8 = 88"],
            ["× 12", "× 10 plus × 2", "12 × 7 = 70 + 14 = 84"],
          ],
          note: "Learn the hard core by heart: 6 × 7 = 42, 6 × 8 = 48, 7 × 7 = 49, 7 × 8 = 56, 8 × 8 = 64.",
        },
        visual: { kind: "timesTable", upTo: 12 },
        mistake: "Counting up on fingers every time. Practise until the fact arrives without counting, because a slow fact steals attention from the real problem.",
        drill: { skill: "L0-N2.1", count: 6 },
      },
      {
        id: "a-ma-l0-n2-2",
        title: "Long multiplication",
        explain:
          "To multiply by a two-digit number, multiply by the ones digit, then by the tens digit, and add. The tens digit stands for tens, so that row ends in a zero.",
        example:
          "  346 × 27\n\n      346\n    ×  27\n    ─────\n     2422     346 × 7\n  +  6920     346 × 20  (note the 0)\n    ─────\n     9342\n\n  CHECK THE SIZE: 346 is about 350, 27 is about 30.\n  350 × 30 = 10 500. 9 342 is close, so it is sensible.",
        visual: { kind: "gridMultiply", a: 346, b: 27 },
        mistake: "Forgetting the zero in the second row. 346 × 2 = 692, but the 2 is really 20, so the row is 6 920.",
        drill: { skill: "L0-N2.2", count: 4 },
      },
      {
        id: "a-ma-l0-n2-3",
        title: "Long division with remainders",
        explain:
          "Divide one digit at a time from the left, in four steps that repeat: Divide, Multiply, Subtract, Bring down. Whatever is left at the end is the remainder. In a word problem, decide what the remainder means.",
        example:
          "  7 548 ÷ 6\n\n    7 ÷ 6 = 1, remainder 1   → bring down 5 → 15\n   15 ÷ 6 = 2, remainder 3   → bring down 4 → 34\n   34 ÷ 6 = 5, remainder 4   → bring down 8 → 48\n   48 ÷ 6 = 8, remainder 0\n\n    7 548 ÷ 6 = 1 258\n    Check: 1 258 × 6 = 7 548\n\n\n  100 ÷ 7 = 14 remainder 2\n\n    100 students, 7 to a bench:  15 benches (2 students still need one)\n    100 eggs, packs of 7:        14 full packs (2 eggs left over)",
        mistake: "Ignoring what the remainder means. 100 ÷ 7 = 14 remainder 2, but 100 students need 15 benches, or two of them have nowhere to sit.",
        drill: { skill: "L0-N2.3", count: 4 },
      },
      {
        id: "a-ma-l0-n2-4",
        title: "Order of operations (BODMAS)",
        explain:
          "When a calculation has more than one operation, do them in this order: Brackets, Orders (powers and roots), then Division and Multiplication, then Addition and Subtraction. Division and multiplication rank equally, so work them left to right. The same goes for addition and subtraction.",
        table: {
          caption: "BODMAS.",
          headers: ["Rank", "Operations", "Rule"],
          rows: [
            ["1", "Brackets ( )", "Work inside first"],
            ["2", "Orders: powers ² ³, roots √", "Next"],
            ["3", "Division ÷ and Multiplication ×", "Equal rank: left to right"],
            ["4", "Addition + and Subtraction −", "Equal rank: left to right"],
          ],
        },
        example:
          "  3 + 4 × 2        = 3 + 8           = 11\n  (3 + 4) × 2      = 7 × 2           = 14\n  2 + 3² × 2       = 2 + 9 × 2 = 2 + 18 = 20\n  18 ÷ 3 × 2       = 6 × 2           = 12   (left to right)\n  20 − 8 ÷ 4 × 3   = 20 − 2 × 3 = 20 − 6 = 14",
        visual: { kind: "bodmasTree", expression: "20 − 8 ÷ 4 × 3  →  20 − 2 × 3  →  20 − 6  →  14" },
        mistake: "Working strictly left to right (3 + 4 × 2 = 14), or always doing × before ÷ (18 ÷ 3 × 2 = 3). Multiplication and division are equal: go left to right.",
        drill: { skill: "L0-N2.4", count: 5 },
      },
      {
        id: "a-ma-review-02",
        title: "Mixed review: place value",
        explain: "One question on each skill from Module 1. Mixing old skills in with new ones is what makes them stay.",
        drill: { review: ["L0-N1.1", "L0-N1.2", "L0-N1.3", "L0-N1.4", "L0-N1.5"], count: 5 },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
