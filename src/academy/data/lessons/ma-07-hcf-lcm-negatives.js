/**
 * MATHEMATICS · MONTH 2 · MODULE 7 · HCF, LCM AND DIRECTED NUMBERS
 *
 * CLIENT-SAFE. Atom shape and house style: see ma-01-place-value.js.
 */

export const SECTION_ID = "ma-s07-hcf-lcm-negatives";

export const LESSONS = [
  {
    id: "ma-l1-n2",
    moduleId: "ma-07-hcf-lcm-negatives",
    sectionId: SECTION_ID,
    skillGroup: "L1-N2",
    order: 1,
    title: "Prime Factors, HCF and LCM",
    subtitle: "Breaking numbers into primes, and the two numbers that come out",
    estimatedMinutes: 45,
    intro: "Every whole number above 1 is a product of primes in exactly one way. Once you have the primes, the HCF, the LCM and even square roots follow.",

    atoms: [
      {
        id: "a-ma-l1-n2-1",
        title: "Prime factorisation",
        explain:
          "A PRODUCT is the answer to a multiplication. Every whole number above 1 can be written as a product of primes in exactly one way. Find them with a factor tree: split the number into any two factors, and keep splitting until every branch ends in a prime. Write repeated primes as powers.",
        example:
          "  360\n  ├─ 2 × 180\n  │      ├─ 2 × 90\n  │      │     ├─ 2 × 45\n  │      │     │     ├─ 3 × 15\n  │      │     │     │     └─ 3 × 5\n\n  360 = 2 × 2 × 2 × 3 × 3 × 5 = 2³ × 3² × 5",
        visual: { kind: "factorTree", n: 360 },
        mistake: "Stopping at a number that is not prime, such as 9 or 15. Every branch must end in a prime.",
        drill: { skill: "L1-N2.1", count: 4 },
      },
      {
        id: "a-ma-l1-n2-2",
        title: "Highest common factor (HCF)",
        explain:
          "The HCF of two numbers is the biggest number that divides both. From the prime factors: take the primes the numbers SHARE, each with the LOWER power, and multiply.",
        example:
          "  HCF OF 72 AND 120\n\n    72  = 2³ × 3²\n    120 = 2³ × 3  × 5\n\n    shared: 2 (lower power 2³) and 3 (lower power 3¹)\n    HCF = 2³ × 3 = 24",
        visual: { kind: "hcfLcmVenn", a: 72, b: 120 },
        mistake: "Taking the higher powers, or including a prime only one number has. The HCF must divide BOTH numbers.",
        drill: { skill: "L1-N2.2", count: 4 },
      },
      {
        id: "a-ma-l1-n2-3",
        title: "Lowest common multiple (LCM)",
        explain:
          "The LCM of two numbers is the smallest number both divide into. From the prime factors: take EVERY prime that appears, each with the HIGHER power, and multiply. Useful check: HCF × LCM = the two numbers multiplied together.",
        example:
          "  LCM OF 72 AND 120\n\n    72  = 2³ × 3²\n    120 = 2³ × 3  × 5\n\n    every prime, higher power: 2³, 3², 5\n    LCM = 8 × 9 × 5 = 360\n\n  Check: 24 × 360 = 8 640 = 72 × 120  ✓",
        mistake: "Just multiplying the two numbers. 72 × 120 = 8 640 is a common multiple, but not the LOWEST one.",
        drill: { skill: "L1-N2.3", count: 4 },
      },
      {
        id: "a-ma-l1-n2-4",
        title: "HCF and LCM word problems",
        explain: "Decide which one the question needs before calculating. Things happening together again, or the smallest amount that fits several sizes, need the LCM. Sharing into the largest equal groups needs the HCF.",
        table: {
          caption: "Which one?",
          headers: ["The problem says", "Use"],
          rows: [
            ["together again, next time, smallest number that ...", "LCM"],
            ["largest, greatest, equal groups, same number in each", "HCF"],
          ],
        },
        example:
          "  Two bells ring every 12 and 18 minutes. They ring together at 8:00.\n    LCM(12, 18) = 36 → together again at 8:36.\n\n  48 oranges and 60 mangoes are packed so every bag is identical.\n    HCF(48, 60) = 12 bags, each with 4 oranges and 5 mangoes.",
        mistake: "Using the HCF for 'together again'. 12 and 18 have HCF 6, but the bells do not ring together after 6 minutes.",
        drill: { skill: "L1-N2.4", count: 3 },
      },
      {
        id: "a-ma-l1-n2-5",
        title: "Square and cube roots by prime factors",
        explain: "To find the square root of a large perfect square, write it as prime factors and HALVE every power. For a cube root, divide every power by 3.",
        example:
          "  √1 764\n    1 764 = 2² × 3² × 7²\n    √1 764 = 2 × 3 × 7 = 42\n\n  ∛2 744\n    2 744 = 2³ × 7³\n    ∛2 744 = 2 × 7 = 14",
        mistake: "Multiplying each prime once whatever its power. √(2⁴ × 3²) is 2² × 3 = 12, not 2 × 3 = 6.",
        drill: { skill: "L1-N2.5", count: 3 },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  {
    id: "ma-l1-n6",
    moduleId: "ma-07-hcf-lcm-negatives",
    sectionId: SECTION_ID,
    skillGroup: "L1-N6",
    order: 2,
    title: "Directed Numbers",
    subtitle: "Negative numbers and the sign rules",
    estimatedMinutes: 40,
    intro: "A directed number has a direction as well as a size: above or below zero, gain or loss. Every sign rule comes from moving along a number line.",

    atoms: [
      {
        id: "a-ma-l1-n6-1",
        title: "Integers on a number line",
        explain:
          "INTEGERS are the whole numbers and their negatives: ..., −3, −2, −1, 0, 1, 2, 3, ... Numbers to the left on the number line are smaller. So −7 is smaller than −2, even though 7 is bigger than 2.",
        example: "  −7 < −2 < 0 < 3\n\n  Ascending:  −9, −4, −1, 0, 2, 5\n  Descending: 5, 2, 0, −1, −4, −9",
        visual: { kind: "numberLine", from: -8, to: 8, marks: [-7, -2, 3] },
        mistake: "Ordering negatives by their size without the sign. −9 is the smallest of −9, −4, −1, because it is furthest left.",
        drill: { skill: "L1-N6.1", count: 3 },
      },
      {
        id: "a-ma-l1-n6-2",
        title: "Adding and subtracting negatives",
        explain:
          "Start at the first number. Adding a positive moves right; adding a negative moves left. Subtracting is the opposite: subtracting a negative moves RIGHT, so taking away a negative is the same as adding.",
        table: {
          caption: "The rules, from moving along the line.",
          headers: ["Written", "Same as", "Example"],
          rows: [
            ["a + (−b)", "a − b", "5 + (−8) = −3"],
            ["a − (−b)", "a + b", "−2 − (−6) = 4"],
            ["−a − b", "move further left", "−5 − 3 = −8"],
          ],
        },
        example: "  −3 + 5 = 2       start at −3, move 5 right\n  4 − 7 = −3       start at 4, move 7 left\n  −2 − (−6) = 4    taking away a debt of 6 leaves you 6 better off",
        visual: { kind: "numberLine", from: -6, to: 6, jump: { from: -3, to: 2 } },
        mistake: "Thinking two negatives always make a positive in adding. −5 + (−3) is −8: you move further left.",
        drill: { skill: "L1-N6.2", count: 4 },
      },
      {
        id: "a-ma-l1-n6-3",
        title: "Multiplying and dividing negatives",
        explain: "Multiply or divide the numbers as usual, then fix the sign: SAME signs give a positive answer, DIFFERENT signs give a negative answer.",
        table: {
          caption: "The sign rules for × and ÷.",
          headers: ["Signs", "Answer", "Example"],
          rows: [
            ["+ and +", "+", "6 × 3 = 18"],
            ["− and −", "+", "−6 × −3 = 18"],
            ["+ and −", "−", "6 × −3 = −18"],
            ["− and +", "−", "−20 ÷ 5 = −4"],
          ],
          note: "Count the negatives: an even number of them gives +, an odd number gives −. So (−2)³ = −8 but (−2)⁴ = 16.",
        },
        visual: { kind: "signTable" },
        mistake: "Using the multiplication rule for addition. −4 × −3 = 12, but −4 + −3 = −7.",
        drill: { skill: "L1-N6.3", count: 4 },
      },
      {
        id: "a-ma-l1-n6-4",
        title: "Directed numbers in context",
        explain: "Temperatures below zero, heights below sea level, and money owed are all negative. A rise or deposit adds; a fall or withdrawal subtracts.",
        example:
          "  Temperature −5 °C rises by 12 °C:   −5 + 12 = 7 °C\n  Account −₦2 000, then ₦3 500 paid in: −2 000 + 3 500 = ₦1 500\n  Difference between 8 °C and −3 °C:   8 − (−3) = 11 °C",
        mistake: "Finding the gap between a positive and a negative by subtracting the sizes: from −3 to 8 is 11 degrees, not 5.",
        drill: { skill: "L1-N6.4", count: 3 },
      },
      {
        id: "a-ma-review-07",
        title: "Mixed review",
        explain: "One question on each earlier skill.",
        drill: { review: ["L1-N1.3", "L1-N1.4", "L0-S1.2", "L0-G2.1", "L0-N6.2"], count: 5 },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
