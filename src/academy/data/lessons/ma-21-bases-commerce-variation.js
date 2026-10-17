/**
 * MATHEMATICS · MONTH 6 · MODULE 21 · NUMBER BASES, COMMERCE AND ERROR
 *
 * CLIENT-SAFE. Atom shape and house style: see ma-01-place-value.js.
 */

export const SECTION_ID = "ma-s21-bases-commerce-variation";

export const LESSONS = [
  {
    id: "ma-l3-n1",
    moduleId: "ma-21-bases-commerce-variation",
    sectionId: SECTION_ID,
    skillGroup: "L3-N1",
    order: 1,
    title: "Number Bases",
    subtitle: "Converting and calculating in any base, and finding an unknown base",
    estimatedMinutes: 40,
    intro: "Base two was the start. Every base works the same way: in base b, the places are worth 1, b, b², b³, ... and the digits run from 0 to b − 1.",

    atoms: [
      {
        id: "a-ma-l3-n1-1",
        title: "Converting between any bases",
        explain:
          "To change base b to base ten, multiply each digit by its place value (a power of b) and add. To change base ten to base b, divide by b repeatedly and read the remainders from the bottom up. Between two bases that are not ten, go through base ten.",
        example:
          "  243₅ TO BASE TEN\n    2×5² + 4×5 + 3 = 50 + 20 + 3 = 73\n\n  73 TO BASE 8\n    73 ÷ 8 = 9 r 1,   9 ÷ 8 = 1 r 1,   1 ÷ 8 = 0 r 1\n    73 = 111₈\n\n  So 243₅ = 111₈",
        mistake: "Writing a digit as large as the base: there is no digit 5 in base 5. The digits are 0 to 4.",
        drill: { skill: "L3-N1.1", count: 4 },
      },
      {
        id: "a-ma-l3-n1-2",
        title: "Arithmetic in any base",
        explain: "Add, subtract and multiply in columns exactly as in base ten, but carry or borrow b instead of 10. Check by converting to base ten.",
        example:
          "  BASE 6:    345₆\n           + 213₆\n           ──────\n            1002₆\n\n    5 + 3 = 8 = 1×6 + 2  →  write 2, carry 1\n    4 + 1 + 1 = 6 = 1×6 + 0  →  write 0, carry 1\n    3 + 2 + 1 = 6  →  write 0, carry 1\n\n  Check: 345₆ = 137, 213₆ = 81, 137 + 81 = 218 = 1002₆ ✓",
        mistake: "Carrying at 10: in base 6, 5 + 3 = 8 is written 12₆ (one six and two), not 8.",
        drill: { skill: "L3-N1.2", count: 4 },
      },
      {
        id: "a-ma-l3-n1-3",
        title: "Finding an unknown base",
        explain: "Write the numeral in place-value form with the base as the unknown b, set it equal to the base ten value, and solve. The base must be a whole number bigger than every digit.",
        example:
          "  Find b if 32_b = 23.\n    3b + 2 = 23  →  b = 7\n\n  Find b if 121_b = 49.\n    b² + 2b + 1 = 49\n    (b + 1)² = 49  →  b + 1 = 7  →  b = 6",
        mistake: "Keeping a negative or fractional solution. A base is a whole number greater than every digit in the numeral.",
        drill: { skill: "L3-N1.3", count: 3 },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  {
    id: "ma-l3-n2",
    moduleId: "ma-21-bases-commerce-variation",
    sectionId: SECTION_ID,
    skillGroup: "L3-N2",
    order: 2,
    title: "Commercial Arithmetic 2",
    subtitle: "Compound interest, VAT and tax, hire purchase, foreign exchange",
    estimatedMinutes: 45,
    intro: "The money calculations of adult life. Each one is a percentage, applied in a particular way.",

    atoms: [
      {
        id: "a-ma-l3-n2-1",
        title: "Compound interest year by year",
        explain:
          "With COMPOUND interest, each year's interest is added to the principal, and next year's interest is earned on the new, larger amount. Work one year at a time.",
        example:
          "  ₦50 000 at 10% compound interest for 3 years\n    Year 1: 10% of 50 000 = 5 000   → 55 000\n    Year 2: 10% of 55 000 = 5 500   → 60 500\n    Year 3: 10% of 60 500 = 6 050   → 66 550\n    Compound interest = 66 550 − 50 000 = ₦16 550\n\n  Simple interest would give only ₦15 000.",
        mistake: "Taking the same interest every year. That is simple interest; compound interest grows each year.",
        drill: { skill: "L3-N2.1", count: 3 },
      },
      {
        id: "a-ma-l3-n2-2",
        title: "VAT and income tax",
        explain:
          "VAT (Value Added Tax) is a percentage added to the price of goods; in Nigeria it is 7.5%. INCOME TAX is charged on TAXABLE income: earnings minus the tax-free allowances.",
        example:
          "  Price ₦40 000 + 7.5% VAT:  VAT = 3 000, total ₦43 000\n  Price including VAT ₦43 000: before VAT = 43 000 ÷ 1.075 = ₦40 000\n\n  Income ₦2 400 000, allowance ₦600 000, tax 10%:\n    taxable = 1 800 000,   tax = ₦180 000",
        mistake: "Taking 7.5% off a price that already includes VAT. The VAT was 7.5% of the smaller, original price: divide by 1.075.",
        drill: { skill: "L3-N2.2", count: 3 },
      },
      {
        id: "a-ma-l3-n2-3",
        title: "Hire purchase",
        explain: "HIRE PURCHASE lets you take goods now and pay over time: a DEPOSIT, then equal INSTALMENTS. Hire purchase price = deposit + all the instalments. It is always more than the cash price; the difference is the cost of paying later.",
        example: "  Cash price ₦250 000. Deposit ₦50 000 + 12 × ₦20 000\n    HP price = 50 000 + 240 000 = ₦290 000\n    Extra cost = 290 000 − 250 000 = ₦40 000",
        mistake: "Leaving out the deposit when totalling the hire purchase price.",
        drill: { skill: "L3-N2.3", count: 3 },
      },
      {
        id: "a-ma-l3-n2-4",
        title: "Foreign exchange",
        explain: "An exchange rate says how much of one currency equals one unit of another. To change foreign money to naira, multiply by the rate. To change naira to foreign money, divide by it.",
        example: "  $1 = ₦1 500\n    $40 → 40 × 1 500 = ₦60 000\n    ₦90 000 → 90 000 ÷ 1 500 = $60",
        mistake: "Multiplying when changing naira into dollars. You get FEWER dollars than naira, so divide.",
        drill: { skill: "L3-N2.4", count: 3 },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  {
    id: "ma-l3-n3",
    moduleId: "ma-21-bases-commerce-variation",
    sectionId: SECTION_ID,
    skillGroup: "L3-N3",
    order: 3,
    title: "Error and First Variation",
    subtitle: "Percentage error, and quantities that vary together",
    estimatedMinutes: 30,
    intro: "No measurement is exact, and many quantities change together in fixed ways. This lesson measures both.",

    atoms: [
      {
        id: "a-ma-l3-n3-1",
        title: "Absolute and percentage error",
        explain:
          "ABSOLUTE ERROR = |measured value − true value|. PERCENTAGE ERROR = error ÷ true value × 100. When a value is rounded, the greatest possible error is half of the unit it was rounded to.",
        example:
          "  Labelled 50 kg, actually 48 kg:\n    error = 2 kg,   % error = 2 ÷ 50 × 100 = 4%\n\n  Measured as 24 cm to the nearest cm:\n    greatest error = 0.5 cm,   % error = 0.5 ÷ 24 × 100 ≈ 2.08%",
        mistake: "Dividing by the measured value instead of the true value.",
        drill: { skill: "L3-N3.1", count: 3 },
      },
      {
        id: "a-ma-l3-n3-2",
        title: "Direct and inverse variation",
        explain:
          "y VARIES DIRECTLY as x when y = kx for a constant k: double x, double y. y VARIES INVERSELY as x when y = k/x: double x, halve y. In both, find k from the values given, then use it.",
        table: {
          caption: "The two first kinds of variation.",
          headers: ["Words", "Symbols", "Equation"],
          rows: [
            ["y varies directly as x", "y ∝ x", "y = kx"],
            ["y varies inversely as x", "y ∝ 1/x", "y = k/x"],
          ],
        },
        example:
          "  y ∝ x, y = 12 when x = 3:   k = 4,   so when x = 7, y = 28\n  y ∝ 1/x, y = 12 when x = 3:  k = 36,  so when x = 9, y = 4",
        mistake: "Using y = kx for inverse variation. 'Inversely' means y = k/x: as one goes up, the other goes down.",
        drill: { skill: "L3-N3.2", count: 4 },
      },
      {
        id: "a-ma-review-21",
        title: "Mixed review",
        explain: "One question on each earlier skill.",
        drill: { review: ["L2-S1.3", "L2-S2.3", "L2-G3.1", "L2-N2.2", "L2-N1.4"], count: 5 },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
