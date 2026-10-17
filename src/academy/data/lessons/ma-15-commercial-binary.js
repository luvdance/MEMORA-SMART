/**
 * MATHEMATICS · MONTH 4 · MODULE 15 · COMMERCIAL ARITHMETIC AND BINARY MULTIPLICATION
 *
 * CLIENT-SAFE. Atom shape and house style: see ma-01-place-value.js.
 */

export const SECTION_ID = "ma-s15-commercial-binary";

export const LESSONS = [
  {
    id: "ma-l2-n2",
    moduleId: "ma-15-commercial-binary",
    sectionId: SECTION_ID,
    skillGroup: "L2-N2",
    order: 1,
    title: "Commercial Arithmetic",
    subtitle: "Profit and loss, simple interest, discount and commission",
    estimatedMinutes: 45,
    intro: "Every one of these is a percentage of something. The only question each time is: a percentage of WHAT?",

    atoms: [
      {
        id: "a-ma-l2-n2-1",
        title: "Profit and loss per cent",
        explain:
          "The COST PRICE (C.P.) is what the trader paid. The SELLING PRICE (S.P.) is what the customer paid. Profit or loss per cent is always worked out on the COST price.",
        table: {
          caption: "The formulas.",
          headers: ["", "Formula"],
          rows: [
            ["Profit", "S.P. − C.P."],
            ["Loss", "C.P. − S.P."],
            ["Profit %", "profit ÷ C.P. × 100"],
            ["Loss %", "loss ÷ C.P. × 100"],
          ],
        },
        example:
          "  Bought for ₦2 500, sold for ₦3 000.\n    Profit = ₦500.   Profit % = 500 ÷ 2 500 × 100 = 20%\n\n  Bought for ₦4 000. Sell at what price for 15% profit?\n    15% of 4 000 = 600.   S.P. = 4 000 + 600 = ₦4 600",
        mistake: "Dividing by the selling price. 500 ÷ 3 000 × 100 = 16.7% is wrong: profit per cent is on the COST price.",
        drill: { skill: "L2-N2.1", count: 4 },
      },
      {
        id: "a-ma-l2-n2-2",
        title: "Simple interest",
        explain:
          "SIMPLE INTEREST is paid only on the PRINCIPAL, the amount first borrowed or saved. I = PRT/100, where R is the rate per cent per year and T is the time in years. The AMOUNT is principal plus interest.",
        table: {
          caption: "One formula, four questions.",
          headers: ["Find", "Formula"],
          rows: [
            ["Interest", "I = PRT/100"],
            ["Principal", "P = 100I/(RT)"],
            ["Rate", "R = 100I/(PT)"],
            ["Time", "T = 100I/(PR)"],
          ],
        },
        example:
          "  ₦50 000 for 3 years at 8%:\n    I = 50 000 × 8 × 3 ÷ 100 = ₦12 000\n    Amount = 50 000 + 12 000 = ₦62 000\n\n  18 months is 1.5 years: T = 1.5",
        mistake: "Using months as years: 18 months is T = 1.5, not T = 18.",
        drill: { skill: "L2-N2.2", count: 4 },
      },
      {
        id: "a-ma-l2-n2-3",
        title: "Discount and commission",
        explain:
          "A DISCOUNT is a reduction on the MARKED price, usually given as a percentage of it. COMMISSION is a payment to a sales agent, a percentage of the value of what they sell.",
        example:
          "  Marked ₦15 000, 20% discount:\n    discount = 3 000,  customer pays ₦12 000\n\n  5% commission on sales of ₦240 000:\n    commission = 240 000 × 5 ÷ 100 = ₦12 000",
        mistake: "Giving the discount as the answer when the question asks what the customer pays.",
        drill: { skill: "L2-N2.3", count: 4 },
      },
      {
        id: "a-ma-l2-n2-4",
        title: "Market problems",
        explain:
          "Real questions combine steps: a bulk price, a selling price per item, a percentage. Write down C.P. and S.P. for the SAME quantity first. When the profit per cent and the selling price are known, the selling price is (100 + profit %)% of the cost price.",
        example:
          "  24 tins bought for ₦9 600, sold at ₦600 each:\n    S.P. = 24 × 600 = 14 400.   Profit = 4 800\n    Profit % = 4 800 ÷ 9 600 × 100 = 50%\n\n  Sold for ₦6 000 at a 25% profit. Find C.P.\n    6 000 is 125% of C.P.   C.P. = 6 000 × 100 ÷ 125 = ₦4 800",
        mistake: "Taking 25% off the selling price: 6 000 − 1 500 = 4 500 is wrong, because the 25% was of the cost price.",
        drill: { skill: "L2-N2.4", count: 4 },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  {
    id: "ma-l2-n4",
    moduleId: "ma-15-commercial-binary",
    sectionId: SECTION_ID,
    skillGroup: "L2-N4",
    order: 2,
    title: "Base Two Multiplication and Other Bases",
    subtitle: "Multiplying in binary, and converting to bases 3 to 8",
    estimatedMinutes: 25,
    intro: "Multiplying in base two is easier than in base ten: the only table is 0 and 1. Other small bases work by the same repeated division.",

    atoms: [
      {
        id: "a-ma-l2-n4-1",
        title: "Multiplying in base two",
        explain: "Multiply as in base ten: one row for each digit of the bottom number, shifted one place left each time. In base two each row is either 0 or a copy of the top number. Then add the rows in base two.",
        example:
          "      1101          (13)\n    ×   11          ( 3)\n    ──────\n      1101          1101 × 1\n     11010          1101 × 1, shifted\n    ──────\n    100111          (39) ✓",
        mistake: "Adding the rows as in base ten. 1101 + 11010 in base two carries at 2, not at 10.",
        drill: { skill: "L2-N4.1", count: 3 },
      },
      {
        id: "a-ma-l2-n4-2",
        title: "Binary to other small bases",
        explain: "To change from base two to another base, go through base ten: first find the base ten value, then divide by the new base repeatedly and read the remainders from the bottom up.",
        example:
          "  11010₂ TO BASE 5\n    11010₂ = 16 + 8 + 2 = 26\n    26 ÷ 5 = 5 r 1\n     5 ÷ 5 = 1 r 0\n     1 ÷ 5 = 0 r 1\n    11010₂ = 101₅",
        mistake: "Stopping at base ten. 26 is the value in base ten; the question wants it in base 5.",
        drill: { skill: "L2-N4.2", count: 3 },
      },
      {
        id: "a-ma-review-15",
        title: "Mixed review",
        explain: "One question on each earlier skill.",
        drill: { review: ["L2-N1.1", "L2-N1.3", "L2-N1.5", "L1-N1.3", "L1-N4.3"], count: 5 },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
