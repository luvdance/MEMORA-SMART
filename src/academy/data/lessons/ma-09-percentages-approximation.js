/**
 * MATHEMATICS · MONTH 3 · MODULE 9 · PERCENTAGES AND APPROXIMATION
 *
 * CLIENT-SAFE. Atom shape and house style: see ma-01-place-value.js.
 */

export const SECTION_ID = "ma-s09-percentages-approximation";

export const LESSONS = [
  {
    id: "ma-l1-n4",
    moduleId: "ma-09-percentages-approximation",
    sectionId: SECTION_ID,
    skillGroup: "L1-N4",
    order: 1,
    title: "Percentages",
    subtitle: "Fractions, decimals and percentages, and percentages of amounts",
    estimatedMinutes: 35,
    intro: "Per cent means 'out of a hundred'. Every percentage question is a fraction question with a denominator of 100.",

    atoms: [
      {
        id: "a-ma-l1-n4-1",
        title: "Fractions, decimals and percentages",
        explain:
          "A PERCENTAGE is a number out of 100: 35% = 35/100 = 0.35. To change a fraction or decimal to a percentage, multiply by 100. To change a percentage to a decimal, divide by 100. To change it to a fraction, put it over 100 and simplify.",
        table: {
          caption: "Equivalents to know by heart.",
          headers: ["Fraction", "Decimal", "Percentage"],
          rows: [
            ["1/2", "0.5", "50%"],
            ["1/4", "0.25", "25%"],
            ["3/4", "0.75", "75%"],
            ["1/5", "0.2", "20%"],
            ["1/10", "0.1", "10%"],
            ["1/8", "0.125", "12.5%"],
            ["1/3", "0.333...", "33 1/3%"],
          ],
        },
        example: "  7/20 → 7/20 × 100 = 35%\n  0.045 → 0.045 × 100 = 4.5%\n  64% → 64/100 = 16/25\n  8% → 0.08   (not 0.8)",
        visual: { kind: "fdpBar", fraction: [3, 4] },
        mistake: "Writing 8% as 0.8. Divide by 100: 8% = 0.08.",
        drill: { skill: "L1-N4.1", count: 4 },
      },
      {
        id: "a-ma-l1-n4-2",
        title: "Percentage of a quantity",
        explain: "To find a percentage of an amount, multiply the amount by the percentage and divide by 100. For mental work, build it from 10% and 1%.",
        example:
          "  35% OF ₦18 000\n    18 000 × 35 ÷ 100 = ₦6 300\n\n  MENTALLY: 10% = 1 800, so 30% = 5 400\n            5% = 900\n            35% = 5 400 + 900 = 6 300",
        visual: { kind: "percentBar", percent: 35 },
        mistake: "Dividing by the percentage. 35% of 18 000 is not 18 000 ÷ 35.",
        drill: { skill: "L1-N4.2", count: 4 },
      },
      {
        id: "a-ma-l1-n4-3",
        title: "One quantity as a percentage of another",
        explain: "Write the first quantity as a fraction of the second, then multiply by 100. Both quantities must be in the same unit.",
        example:
          "  42 out of 60 in a test:\n    42/60 × 100 = 70%\n\n  45 cm as a percentage of 2 m:\n    2 m = 200 cm\n    45/200 × 100 = 22.5%",
        mistake: "Putting the numbers the wrong way round: 60/42 × 100 = 142.9%. The quantity you are asked ABOUT goes on top.",
        drill: { skill: "L1-N4.3", count: 4 },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  {
    id: "ma-l1-n5",
    moduleId: "ma-09-percentages-approximation",
    sectionId: SECTION_ID,
    skillGroup: "L1-N5",
    order: 2,
    title: "Approximation",
    subtitle: "Decimal places, significant figures and estimating",
    estimatedMinutes: 35,
    intro: "Exams tell you how accurate an answer must be: 'correct to 2 decimal places', 'to 3 significant figures'. The accuracy is part of the answer.",

    atoms: [
      {
        id: "a-ma-l1-n5-1",
        title: "Decimal places",
        explain:
          "To round to n DECIMAL PLACES (d.p.), keep n digits after the point. Look at the next digit: 5 or more, round up; 4 or less, leave it. Keep any zeros that are needed to show the accuracy.",
        example:
          "  3.4672 to 2 d.p.\n    keep 3.46, next digit 7 → up → 3.47\n\n  12.995 to 2 d.p.\n    keep 12.99, next digit 5 → up → 13.00   (write both zeros)\n\n  0.0438 to 1 d.p. → 0.0",
        mistake: "Dropping the zeros: 12.995 to 2 d.p. is 13.00, not 13. The two zeros show the answer is accurate to 2 decimal places.",
        drill: { skill: "L1-N5.1", count: 4 },
      },
      {
        id: "a-ma-l1-n5-2",
        title: "Significant figures",
        explain:
          "SIGNIFICANT FIGURES (s.f.) count from the first non-zero digit. Zeros at the start of a decimal are never significant. Round at the right place, then fill with zeros up to the decimal point so the size stays the same.",
        table: {
          caption: "Which digits count?",
          headers: ["Number", "Significant figures", "First s.f."],
          rows: [
            ["4 730", "4, 7, 3 (the final 0 holds the place)", "4 (thousands)"],
            ["0.00562", "5, 6, 2", "5 (thousandths)"],
            ["30.07", "3, 0, 0, 7", "3 (tens)"],
          ],
        },
        example:
          "  47 382 to 2 s.f. → 47 000      (zeros keep the size)\n  0.004 816 to 2 s.f. → 0.0048\n  2.996 to 3 s.f. → 3.00",
        visual: { kind: "sigFigStrip", value: 0.004816, sf: 2 },
        mistake: "Counting the leading zeros, or forgetting the place-holding zeros. 47 382 to 2 s.f. is 47 000, not 47.",
        drill: { skill: "L1-N5.2", count: 4 },
      },
      {
        id: "a-ma-l1-n5-3",
        title: "Estimating",
        explain: "To estimate, round every number to 1 significant figure and calculate. Use an estimate to check that an exact answer is the right size.",
        example:
          "  ESTIMATE 48.7 × 21.3\n    ≈ 50 × 20 = 1 000\n    (exact: 1 037.31 — the estimate confirms the size)\n\n  ESTIMATE 612 ÷ 0.29\n    ≈ 600 ÷ 0.3 = 2 000",
        visual: { kind: "estimateStrip", a: 48.7, b: 21.3 },
        mistake: "Rounding to the nearest whole number instead of 1 s.f.: 48.7 × 21.3 ≈ 49 × 21 is too hard to do in your head, which defeats the point.",
        drill: { skill: "L1-N5.3", count: 4 },
      },
      {
        id: "a-ma-review-09",
        title: "Mixed review",
        explain: "One question on each earlier skill.",
        drill: { review: ["L1-N3.1", "L1-N3.2", "L1-N3.3", "L1-N2.4", "L1-N6.4"], count: 5 },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
