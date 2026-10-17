/**
 * MATHEMATICS · MONTH 1 · MODULE 4 · DECIMALS, MONEY, SQUARES AND ROOTS
 *
 * CLIENT-SAFE. Atom shape and house style: see ma-01-place-value.js.
 *
 * Decimals come before roots on purpose: estimating a square root to one
 * decimal place needs decimal place value, and the skill map says so.
 */

export const SECTION_ID = "ma-s04-decimals-roots";

export const LESSONS = [
  {
    id: "ma-l0-n5",
    moduleId: "ma-04-decimals-roots",
    sectionId: SECTION_ID,
    skillGroup: "L0-N5",
    order: 1,
    title: "Decimals and Money",
    subtitle: "Place value after the point, adding and subtracting, naira and kobo, fractions as decimals",
    estimatedMinutes: 40,
    intro: "A decimal is place value carried on past the ones: tenths, hundredths, thousandths. Money is the decimal you already use every day.",

    atoms: [
      {
        id: "a-ma-l0-n5-1",
        title: "Decimal place value",
        explain:
          "The DECIMAL POINT separates the whole number from the parts. The places after it are worth tenths, hundredths and thousandths, each ten times smaller than the place on its left.",
        table: {
          caption: "Places after the point, in 3.475.",
          headers: ["Digit", "Place", "Value", "As a fraction"],
          rows: [
            ["4", "tenths", "0.4", "4/10"],
            ["7", "hundredths", "0.07", "7/100"],
            ["5", "thousandths", "0.005", "5/1000"],
          ],
        },
        example:
          "  WHICH IS LARGER, 0.5 OR 0.45?\n\n    Give both the same number of places:\n    0.50 and 0.45\n    50 hundredths > 45 hundredths, so 0.5 is larger.",
        visual: { kind: "placeChart", number: 3.475, decimals: 3 },
        mistake: "Thinking more digits means a bigger decimal. 0.45 is smaller than 0.5. Compare place by place after the point.",
        drill: { skill: "L0-N5.1", count: 4 },
      },
      {
        id: "a-ma-l0-n5-2",
        title: "Adding and subtracting decimals",
        explain:
          "Line up the decimal points, one under the other. Fill empty places with zeros. Then add or subtract column by column, exactly as with whole numbers, keeping the point in the same column.",
        example:
          "    12.50          8.00\n  +  3.75        − 2.35\n  ───────        ──────\n    16.25          5.65",
        visual: { kind: "columnSum", a: 12.5, b: 3.75, operation: "add" },
        mistake: "Lining up the last digits instead of the points. 12.5 + 3.75 is not 12.5 + 0.375.",
        drill: { skill: "L0-N5.2", count: 4 },
      },
      {
        id: "a-ma-l0-n5-3",
        title: "Naira and kobo",
        explain: "100 kobo make ₦1, so kobo are hundredths of a naira. ₦3.50 is 3 naira and 50 kobo. Work out the total cost first, then subtract it from the money paid to get the change.",
        example:
          "  ₦12.75 = 12 naira 75 kobo = 1 275 kobo\n  ₦3.5   = ₦3.50 = 3 naira 50 kobo   (not 5 kobo)\n\n  3 loaves at ₦850 each, paid with ₦5 000:\n    cost:    3 × 850 = ₦2 550\n    change:  5 000 − 2 550 = ₦2 450",
        mistake: "Reading ₦3.5 as 3 naira 5 kobo. The 5 is in the tenths place: it is 50 kobo.",
        drill: { skill: "L0-N5.3", count: 4 },
      },
      {
        id: "a-ma-l0-n5-4",
        title: "Fractions to decimals",
        explain: "A fraction is a division: 3/8 means 3 ÷ 8. Divide to get the decimal. A denominator of 10, 100 or 1000 converts directly.",
        table: {
          caption: "Fractions worth knowing as decimals.",
          headers: ["Fraction", "Decimal", "Fraction", "Decimal"],
          rows: [
            ["1/2", "0.5", "1/5", "0.2"],
            ["1/4", "0.25", "1/8", "0.125"],
            ["3/4", "0.75", "1/10", "0.1"],
            ["1/3", "0.333...", "2/3", "0.666..."],
          ],
        },
        example:
          "  3/8 = 3 ÷ 8\n\n    3.000 ÷ 8:  30 ÷ 8 = 3 r 6,  60 ÷ 8 = 7 r 4,  40 ÷ 8 = 5\n    3/8 = 0.375\n\n  27/100 = 0.27        9/1000 = 0.009",
        mistake: "Writing 3/8 as 3.8. The fraction bar means divide: 3 ÷ 8 = 0.375.",
        drill: { skill: "L0-N5.4", count: 4 },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },
  {
    id: "ma-l0-n6",
    moduleId: "ma-04-decimals-roots",
    sectionId: SECTION_ID,
    skillGroup: "L0-N6",
    order: 2,
    title: "Squares, Cubes and Roots",
    subtitle: "A number times itself, and the way back",
    estimatedMinutes: 35,
    intro: "Squares and roots are used in area, Pythagoras' theorem, indices, surds and the quadratic formula. Know them instantly.",

    atoms: [
      {
        id: "a-ma-l0-n6-1",
        title: "Square numbers and square roots",
        explain:
          "To square a number, multiply it by itself: 7² = 7 × 7 = 49. The square root undoes squaring: √49 = 7, because 7 × 7 = 49. A number whose square root is a whole number is a perfect square.",
        table: {
          caption: "The squares to learn by heart.",
          headers: ["n", "n²", "n", "n²"],
          rows: [
            ["1", "1", "11", "121"],
            ["2", "4", "12", "144"],
            ["3", "9", "13", "169"],
            ["4", "16", "14", "196"],
            ["5", "25", "15", "225"],
            ["6", "36", "16", "256"],
            ["7", "49", "17", "289"],
            ["8", "64", "18", "324"],
            ["9", "81", "19", "361"],
            ["10", "100", "20", "400"],
          ],
        },
        example:
          "  13² = 13 × 13 = 169\n  √196 = 14         because 14 × 14 = 196\n  30² = 900         (3² = 9, then two zeros)\n  √3 600 = 60       (√36 = 6, √100 = 10)",
        mistake: "Doubling instead of squaring. 5² is 5 × 5 = 25, not 5 × 2 = 10.",
        drill: { skill: "L0-N6.1", count: 5 },
      },
      {
        id: "a-ma-l0-n6-2",
        title: "Cube numbers and cube roots",
        explain: "To cube a number, use it three times in a multiplication: 4³ = 4 × 4 × 4 = 64. The cube root undoes cubing: ∛64 = 4.",
        table: {
          caption: "The cubes from 1 to 10.",
          headers: ["n", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
          rows: [["n³", "1", "8", "27", "64", "125", "216", "343", "512", "729", "1 000"]],
        },
        example: "  5³ = 5 × 5 × 5 = 25 × 5 = 125\n  ∛343 = 7         because 7 × 7 × 7 = 343",
        mistake: "Multiplying by 3. 4³ is 4 × 4 × 4 = 64, not 4 × 3 = 12.",
        drill: { skill: "L0-N6.2", count: 4 },
      },
      {
        id: "a-ma-l0-n6-3",
        title: "Estimating square roots",
        explain:
          "To estimate the square root of a number that is not a perfect square, find the perfect squares on either side. The root lies between their roots, nearer the one whose square is closer. Check by squaring your estimate.",
        example:
          "  ESTIMATE √50\n\n    49 < 50 < 64\n    so 7 < √50 < 8\n\n    50 is just 1 past 49, out of a gap of 15.\n    √50 ≈ 7.1\n\n    Check: 7.1² = 50.41   ✓ close",
        visual: { kind: "numberLine", from: 6, to: 9, marks: [7, 7.1, 8] },
        mistake: "Halving. √50 is not 25. A square root is the number that multiplies by ITSELF to give 50.",
        drill: { skill: "L0-N6.3", count: 4 },
      },
      {
        id: "a-ma-review-04",
        title: "Mixed review",
        explain: "One question on each earlier skill. Get each one right before moving on.",
        drill: { review: ["L0-N3.3", "L0-N4.2", "L0-N4.3", "L0-N4.4", "L0-N2.4"], count: 5 },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
