/**
 * MATHEMATICS · MONTH 5 · MODULE 20 · STATISTICS AND FIRST PROBABILITY
 *
 * CLIENT-SAFE. Atom shape and house style: see ma-01-place-value.js.
 */

export const SECTION_ID = "ma-s20-statistics-probability";

export const LESSONS = [
  {
    id: "ma-l2-s1",
    moduleId: "ma-20-statistics-probability",
    sectionId: SECTION_ID,
    skillGroup: "L2-S1",
    order: 1,
    title: "Grouped Data, Pie Charts and the Mean",
    subtitle: "Class intervals, sector angles, and the mean from a frequency table",
    estimatedMinutes: 40,
    intro: "With a lot of data, group it into classes. With categories, show them on a pie chart. With a frequency table, find the mean without listing every value.",

    atoms: [
      {
        id: "a-ma-l2-s1-1",
        title: "Grouping data into classes",
        explain:
          "A CLASS INTERVAL such as 10 – 19 groups values together. Its CLASS LIMITS are 10 and 19. For whole-number data its CLASS BOUNDARIES are 9.5 and 19.5, halfway to the next classes. The CLASS WIDTH is upper boundary − lower boundary. The CLASS MARK is the midpoint, (10 + 19) ÷ 2 = 14.5.",
        table: {
          caption: "The class 20 – 29.",
          headers: ["Term", "Value"],
          rows: [
            ["Class limits", "20 and 29"],
            ["Class boundaries", "19.5 and 29.5"],
            ["Class width", "29.5 − 19.5 = 10"],
            ["Class mark (midpoint)", "(20 + 29) ÷ 2 = 24.5"],
          ],
        },
        mistake: "Taking the width as 29 − 20 = 9. Use the boundaries: 29.5 − 19.5 = 10.",
        drill: { skill: "L2-S1.1", count: 4 },
      },
      {
        id: "a-ma-l2-s1-2",
        title: "Pie charts",
        explain: "A pie chart shows each category as a sector of a circle. The whole circle, 360°, stands for the total. Sector angle = frequency ÷ total × 360°.",
        example:
          "  60 students: 15 rice, 25 beans, 20 yam\n    rice:  15/60 × 360 = 90°\n    beans: 25/60 × 360 = 150°\n    yam:   20/60 × 360 = 120°      check: 90 + 150 + 120 = 360 ✓\n\n  A 72° sector out of 90 people: 72/360 × 90 = 18 people",
        mistake: "Using 100 instead of 360. A pie chart angle is a fraction of 360°.",
        drill: { skill: "L2-S1.2", count: 4 },
      },
      {
        id: "a-ma-l2-s1-3",
        title: "Mean from a frequency table",
        explain: "Multiply each value x by its frequency f, add these products to get Σfx, and divide by the total frequency Σf. (Σ, sigma, means 'add up all of'.)",
        example:
          "  x │ 1   2   3   4\n  f │ 3   5   8   4      Σf = 20\n  fx│ 3  10  24  16      Σfx = 53\n\n  Mean = 53 ÷ 20 = 2.65",
        mistake: "Dividing by the number of columns (4) instead of the total frequency (20).",
        drill: { skill: "L2-S1.3", count: 4 },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  {
    id: "ma-l2-s2",
    moduleId: "ma-20-statistics-probability",
    sectionId: SECTION_ID,
    skillGroup: "L2-S2",
    order: 2,
    title: "First Probability",
    subtitle: "Outcomes, experiments and theoretical probability",
    estimatedMinutes: 35,
    intro: "Probability measures how likely something is, on a scale from 0 (impossible) to 1 (certain). It is always a fraction, decimal or percentage between those two.",

    atoms: [
      {
        id: "a-ma-l2-s2-1",
        title: "Outcomes and the sample space",
        explain: "An OUTCOME is one possible result. The SAMPLE SPACE is the list of all possible outcomes. For two dice, draw a 6 by 6 grid: 36 outcomes. For coins, list them: HH, HT, TH, TT.",
        example:
          "  Two coins:   HH, HT, TH, TT         4 outcomes\n  Coin + die:  H1 ... H6, T1 ... T6   12 outcomes\n\n  Two dice, total 7:\n    (1,6) (2,5) (3,4) (4,3) (5,2) (6,1)  →  6 of the 36",
        mistake: "Counting HT and TH as one outcome. They are different: first coin H, second T; or first T, second H.",
        drill: { skill: "L2-S2.1", count: 3 },
      },
      {
        id: "a-ma-l2-s2-2",
        title: "Experimental probability",
        explain: "EXPERIMENTAL probability (relative frequency) = number of times the event happened ÷ number of trials. The more trials, the closer it gets to the true probability. Expected number = probability × number of trials.",
        example: "  A pin lands point-up 36 times in 120 drops.\n    P(point-up) ≈ 36/120 = 3/10\n    In 500 drops, expect 3/10 × 500 = 150 point-up.",
        mistake: "Writing the fraction upside down: the successes go on top.",
        drill: { skill: "L2-S2.2", count: 3 },
      },
      {
        id: "a-ma-l2-s2-3",
        title: "Theoretical probability",
        explain: "When all outcomes are equally likely: P(event) = number of favourable outcomes ÷ total number of outcomes. P(not A) = 1 − P(A). An impossible event has probability 0; a certain one has probability 1.",
        example:
          "  Bag: 4 red, 5 blue, 3 green (12 balls).\n    P(red) = 4/12 = 1/3\n    P(not red) = 1 − 1/3 = 2/3\n    P(red or green) = 7/12\n    P(yellow) = 0",
        mistake: "Dividing by the number of OTHER outcomes: P(red) is 4/12, not 4/8.",
        drill: { skill: "L2-S2.3", count: 4 },
      },
      {
        id: "a-ma-review-20",
        title: "Mixed review",
        explain: "One question on each earlier skill.",
        drill: { review: ["L2-G3.1", "L2-G3.3", "L2-G4.2", "L2-G2.3", "L1-S1.3"], count: 5 },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
