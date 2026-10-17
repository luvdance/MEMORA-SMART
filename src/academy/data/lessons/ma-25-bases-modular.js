/**
 * MATHEMATICS · MONTH 7 · MODULE 25 · NUMBER BASES IN FULL AND MODULAR ARITHMETIC
 *
 * CLIENT-SAFE. Atom shape and house style: see ma-01-place-value.js.
 */

export const SECTION_ID = "ma-s25-bases-modular";

export const LESSONS = [
  {
    id: "ma-l4-n1",
    moduleId: "ma-25-bases-modular",
    sectionId: SECTION_ID,
    skillGroup: "L4-N1",
    order: 1,
    title: "Number Bases in Full",
    subtitle: "Fractional parts, base equations and identifying a base",
    estimatedMinutes: 35,
    intro: "Place value continues after the point in every base. In base b, the places after the point are worth 1/b, 1/b², and so on.",

    atoms: [
      {
        id: "a-ma-l4-n1-1",
        title: "Fractional parts between bases",
        explain:
          "To change a base b fraction to base ten, multiply each digit after the point by 1/b, 1/b², ... and add. To change a base ten fraction to base b, MULTIPLY the fractional part by b repeatedly: the whole number produced each time is the next digit.",
        example:
          "  101.11₂ = 4 + 1 + 1/2 + 1/4 = 5.75\n\n  0.625 TO BASE TWO\n    0.625 × 2 = 1.25  → 1\n    0.25  × 2 = 0.5   → 0\n    0.5   × 2 = 1.0   → 1\n    0.625 = 0.101₂",
        mistake: "Dividing the fractional part. The whole part is found by dividing; the fractional part by MULTIPLYING.",
        drill: { skill: "L4-N1.1", count: 3 },
      },
      {
        id: "a-ma-l4-n1-2",
        title: "Base equations",
        explain: "When a digit or the base itself is unknown, write each numeral in place-value form and solve the equation that results.",
        example:
          "  Find y if 2y3₅ = 73:\n    2 × 25 + 5y + 3 = 73  →  5y = 20  →  y = 4\n\n  Find b if 35 + 24 = 61 in base b:\n    (3b + 5) + (2b + 4) = 6b + 1\n    5b + 9 = 6b + 1  →  b = 8",
        mistake: "Adding the numerals as if they were base ten before setting up the equation.",
        drill: { skill: "L4-N1.2", count: 3 },
      },
      {
        id: "a-ma-l4-n1-3",
        title: "Bases in word problems",
        explain: "To find which base makes a calculation true, note that the base must be bigger than every digit shown. Try the bases above that, converting both sides to base ten, or set up an equation in b.",
        example: "  In which base is 24 × 3 = 120 true?\n    The digits go up to 4, so the base is at least 5.\n    Base 5: 24₅ = 14, 14 × 3 = 42, but 120₅ = 25 + 10 = 35   ✗\n    Base 6: 24₆ = 16, 16 × 3 = 48, and 120₆ = 36 + 12 = 48   ✓\n\n    Or as an equation: 3(2b + 4) = b² + 2b\n    b² − 4b − 12 = 0  →  (b − 6)(b + 2) = 0  →  b = 6",
        mistake: "Trying bases smaller than a digit in the numerals. A digit 4 rules out bases 2, 3 and 4.",
        drill: { skill: "L4-N1.3", count: 3 },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  {
    id: "ma-l4-n2",
    moduleId: "ma-25-bases-modular",
    sectionId: SECTION_ID,
    skillGroup: "L4-N2",
    order: 2,
    title: "Modular Arithmetic",
    subtitle: "Clock arithmetic: remainders, cycles and market days",
    estimatedMinutes: 35,
    intro: "Modular arithmetic counts in a circle, like a clock. After the last number it starts again from 0. Days of the week and market days work exactly this way.",

    atoms: [
      {
        id: "a-ma-l4-n2-1",
        title: "Remainders mod n",
        explain:
          "a mod n is the remainder when a is divided by n, always one of 0, 1, ..., n − 1. We write a ≡ r (mod n), read 'a is congruent to r modulo n'. For a negative number, add n until the result is in range.",
        example: "  47 mod 5:  47 = 9 × 5 + 2,  so 47 ≡ 2 (mod 5)\n  −7 mod 5:  −7 + 10 = 3,     so −7 ≡ 3 (mod 5)",
        mistake: "Giving a negative remainder. In mod 5 the only possible answers are 0, 1, 2, 3, 4.",
        drill: { skill: "L4-N2.1", count: 4 },
      },
      {
        id: "a-ma-l4-n2-2",
        title: "Adding and subtracting mod n",
        explain: "Add or subtract as normal, then reduce the answer mod n. On a clock face of n hours, it is just moving round the clock.",
        example:
          "  8 + 9 (mod 7) = 17 ≡ 3\n  3 − 6 (mod 7) = −3 ≡ 4\n\n  Igbo market days: Eke, Orie, Afor, Nkwo (mod 4).\n  Today is Orie. In 10 days: 10 mod 4 = 2 → Nkwo.",
        mistake: "Forgetting to reduce: 8 + 9 in mod 7 is 3, not 17.",
        drill: { skill: "L4-N2.2", count: 4 },
      },
      {
        id: "a-ma-l4-n2-3",
        title: "Multiplying mod n",
        explain: "Multiply as normal, then reduce mod n. Reducing the numbers first gives the same answer and keeps them small.",
        example: "  6 × 5 (mod 7) = 30 ≡ 2      (30 = 4 × 7 + 2)\n  23 × 19 (mod 5): 23 ≡ 3, 19 ≡ 4, so 3 × 4 = 12 ≡ 2",
        mistake: "Reducing only one of the two numbers and then forgetting to reduce the product.",
        drill: { skill: "L4-N2.3", count: 3 },
      },
      {
        id: "a-ma-l4-n2-4",
        title: "Modular equations and cycles",
        explain: "To solve an equation such as 3x ≡ 2 (mod 7), try each value 0 to n − 1. For questions about repeating cycles (days, shifts, market days), reduce the number of steps mod the length of the cycle.",
        example: "  3x ≡ 2 (mod 7):  3 × 3 = 9 ≡ 2,  so x = 3\n\n  Today is Monday. In 100 days: 100 = 14 × 7 + 2 → Wednesday.",
        mistake: "Dividing: 3x ≡ 2 does not mean x = 2/3. Test each value instead.",
        drill: { skill: "L4-N2.4", count: 3 },
      },
      {
        id: "a-ma-review-25",
        title: "Mixed review",
        explain: "One question on each earlier skill.",
        drill: { review: ["L3-T1.1", "L3-T1.3", "L3-G2.1", "L3-S1.1", "L3-A2.1"], count: 5 },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
