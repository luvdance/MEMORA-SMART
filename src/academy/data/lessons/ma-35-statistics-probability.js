/**
 * MATHEMATICS · MONTH 9 · MODULE 35 · CUMULATIVE FREQUENCY, DISPERSION AND PROBABILITY
 *
 * CLIENT-SAFE. Atom shape and house style: see ma-01-place-value.js.
 */

export const SECTION_ID = "ma-s35-statistics-probability";

export const LESSONS = [
  {
    id: "ma-l5-s1",
    moduleId: "ma-35-statistics-probability",
    sectionId: SECTION_ID,
    skillGroup: "L5-S1",
    order: 1,
    title: "Cumulative Frequency and the Ogive",
    subtitle: "Running totals, the S-curve, and reading it",
    estimatedMinutes: 45,
    intro: "A cumulative frequency is a running total. Plotted against the upper class boundaries it makes an S-shaped curve, the ogive, from which the median and quartiles are read.",

    atoms: [
      {
        id: "a-ma-l5-s1-1",
        title: "Cumulative frequency tables",
        explain: "Add a column of running totals: each cumulative frequency is that class's frequency plus all those above it. Add a column of UPPER CLASS BOUNDARIES: halfway between the end of one class and the start of the next.",
        table: [
          ["Marks", "f", "Upper boundary", "Cum. f"],
          ["1–10", "4", "10.5", "4"],
          ["11–20", "7", "20.5", "11"],
          ["21–30", "9", "30.5", "20"],
        ],
        example: "  The last cumulative frequency is the total, 20. Check it.",
        mistake: "Using 10 instead of 10.5. The class 1–10 includes marks up to 10.5 once rounding is allowed for.",
        drill: { skill: "L5-S1.1", count: 3 },
      },
      {
        id: "a-ma-l5-s1-2",
        title: "Drawing the ogive",
        explain: "Plot cumulative frequency (up) against UPPER CLASS BOUNDARY (across). Start the curve at the lower boundary of the first class with cumulative frequency 0. Join with a smooth curve.",
        example: "  Points: (0.5, 0), (10.5, 4), (20.5, 11), (30.5, 20)",
        mistake: "Plotting at the class midpoints. Midpoints are for the frequency polygon; the ogive uses upper boundaries.",
        drill: { skill: "L5-S1.2", count: 3 },
      },
      {
        id: "a-ma-l5-s1-3",
        title: "Median, quartiles and percentiles",
        explain: "For a total of n: the median is at n/2, the lower quartile Q1 at n/4, the upper quartile Q3 at 3n/4, and the pth percentile at p% of n. Read across from that height to the curve, then down. Interquartile range = Q3 − Q1; semi-interquartile range = half of it. Without a graph, estimate by going the right fraction of the way through the class.",
        example: "  Table above, n = 20: median at the 10th value\n    class 11–20: 4 before it, 7 in it, width 10\n    median = 10.5 + (10 − 4)/7 × 10 = 19.1",
        mistake: "Reading across from n/2 to the AXIS instead of the curve. Go across to the curve, then down.",
        drill: { skill: "L5-S1.3", count: 3 },
      },
      {
        id: "a-ma-l5-s1-4",
        title: "Answering questions from the ogive",
        explain: "The cumulative frequency at a mark counts everyone BELOW it. 'How many passed?' = total − number below the pass mark. 'What pass mark lets the top 20% through?' = read across at 80% of n.",
        example: "  n = 60, 42 scored below 50\n    passed = 60 − 42 = 18\n  Top 25%: read the mark at 45 (75% of 60)",
        mistake: "Giving the number below the mark when the question asks for those above it.",
        drill: { skill: "L5-S1.4", count: 3 },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  {
    id: "ma-l5-s2",
    moduleId: "ma-35-statistics-probability",
    sectionId: SECTION_ID,
    skillGroup: "L5-S2",
    order: 2,
    title: "Measures of Dispersion",
    subtitle: "How spread out the data is",
    estimatedMinutes: 45,
    intro: "Two classes can have the same mean and very different spreads. Range, mean deviation, variance and standard deviation measure that spread.",

    atoms: [
      {
        id: "a-ma-l5-s2-1",
        title: "Range and mean deviation",
        explain: "RANGE = largest − smallest. MEAN DEVIATION = the average distance from the mean, ignoring signs: Σ|x − x̄| ÷ n.",
        example: "  2, 4, 6, 8, 10: mean 6\n    distances 4, 2, 0, 2, 4  →  sum 12\n    mean deviation = 12/5 = 2.4\n    range = 10 − 2 = 8",
        mistake: "Keeping the signs: the deviations x − x̄ always add to 0. Use their sizes.",
        drill: { skill: "L5-S2.1", count: 3 },
      },
      {
        id: "a-ma-l5-s2-2",
        title: "Variance",
        explain: "VARIANCE = the average of the SQUARED deviations: Σ(x − x̄)² ÷ n. Squaring removes the signs and punishes big deviations more.",
        table: [
          ["x", "x − x̄", "(x − x̄)²"],
          ["2", "−4", "16"],
          ["4", "−2", "4"],
          ["6", "0", "0"],
          ["8", "2", "4"],
          ["10", "4", "16"],
        ],
        example: "  Σ(x − x̄)² = 40\n    variance = 40/5 = 8",
        mistake: "Squaring the total of the deviations (0² = 0). Square EACH deviation, then add.",
        drill: { skill: "L5-S2.2", count: 3 },
      },
      {
        id: "a-ma-l5-s2-3",
        title: "Standard deviation",
        explain: "STANDARD DEVIATION = √variance. It is in the same units as the data. A shortcut: SD = √(Σx²/n − x̄²).",
        example: "  Variance 8  →  SD = √8 = 2.83\n  Check by shortcut: Σx² = 220; 220/5 − 36 = 8 ✓",
        mistake: "Stopping at the variance. The standard deviation is its square root.",
        drill: { skill: "L5-S2.3", count: 3 },
      },
      {
        id: "a-ma-l5-s2-4",
        title: "Standard deviation from a frequency table",
        explain: "With frequencies: x̄ = Σfx/Σf and SD = √(Σf(x − x̄)²/Σf) = √(Σfx²/Σf − x̄²). For grouped classes, use the class MIDPOINTS as x.",
        example: "  x: 1, 2, 3   f: 2, 5, 3   Σf = 10\n    Σfx = 2 + 10 + 9 = 21  →  x̄ = 2.1\n    Σfx² = 2 + 20 + 27 = 49\n    SD = √(4.9 − 4.41) = √0.49 = 0.7",
        mistake: "Using Σfx² where it should be (Σfx)². They are different: square first, then multiply by f.",
        drill: { skill: "L5-S2.4", count: 3 },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  {
    id: "ma-l5-s3",
    moduleId: "ma-35-statistics-probability",
    sectionId: SECTION_ID,
    skillGroup: "L5-S3",
    order: 3,
    title: "Probability Rules",
    subtitle: "OR means add, AND means multiply",
    estimatedMinutes: 50,
    intro: "Two rules do almost all the work: the addition rule for 'or' and the multiplication rule for 'and'. A tree diagram organises both.",

    atoms: [
      {
        id: "a-ma-l5-s3-1",
        title: "The addition rule",
        explain: "MUTUALLY EXCLUSIVE events cannot happen together: P(A or B) = P(A) + P(B). If they CAN overlap, subtract the overlap once: P(A or B) = P(A) + P(B) − P(A and B).",
        example: "  Die: P(2 or 5) = 1/6 + 1/6 = 1/3\n  Card: P(king or heart) = 4/52 + 13/52 − 1/52 = 16/52 = 4/13",
        mistake: "Counting the king of hearts twice. Overlapping events need the subtraction.",
        drill: { skill: "L5-S3.1", count: 3 },
      },
      {
        id: "a-ma-l5-s3-2",
        title: "The multiplication rule",
        explain: "INDEPENDENT events do not affect each other: P(A and B) = P(A) × P(B). P(not A) = 1 − P(A).",
        example: "  P(Ada passes) = 2/3, P(Bola passes) = 3/4\n    both pass: 2/3 × 3/4 = 1/2\n    neither:   1/3 × 1/4 = 1/12",
        mistake: "Adding for 'and'. AND means multiply; multiplying two probabilities makes the answer smaller, as it should.",
        drill: { skill: "L5-S3.2", count: 3 },
      },
      {
        id: "a-ma-l5-s3-3",
        title: "With and without replacement",
        explain: "WITH replacement, the second pick sees the same bag: the events are independent. WITHOUT replacement, the second pick has one fewer item, and one fewer of whatever came out first.",
        example: "  5 red, 3 blue; two picks, both red\n    with:    5/8 × 5/8 = 25/64\n    without: 5/8 × 4/7 = 20/56 = 5/14",
        mistake: "Reducing only the top. Without replacement, the total goes down by 1 as well.",
        drill: { skill: "L5-S3.3", count: 3 },
      },
      {
        id: "a-ma-l5-s3-4",
        title: "Tree diagrams",
        explain: "Draw a branch for each outcome at each stage, write the probability on it, and check each set of branches adds to 1. MULTIPLY along a path; ADD the paths that give what you want.",
        example: "  5 red, 3 blue, without replacement: one of each\n    RB: 5/8 × 3/7 = 15/56\n    BR: 3/8 × 5/7 = 15/56\n    total 30/56 = 15/28",
        mistake: "Taking one path only. 'One of each' can happen in two orders.",
        drill: { skill: "L5-S3.4", count: 3 },
      },
      {
        id: "a-ma-l5-s3-5",
        title: "At least and at most",
        explain: "P(at least one) = 1 − P(none). It is much faster than adding every case. 'At most one' = P(none) + P(exactly one).",
        example: "  A die thrown 3 times; at least one six\n    P(no six) = (5/6)³ = 125/216\n    P(at least one) = 91/216",
        mistake: "Multiplying 1/6 three times. That is a six EVERY time, not at least once.",
        drill: { skill: "L5-S3.5", count: 3 },
      },
      {
        id: "a-ma-review-35",
        title: "Mixed review",
        explain: "One question on each earlier skill.",
        drill: { review: ["L5-G2.1", "L5-G2.3", "L5-T1.2", "L5-T1.3", "L5-G1.8"], count: 5 },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
