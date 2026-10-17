/**
 * MATHEMATICS · MONTH 3 · MODULE 10 · THE NUMBER SYSTEM AND RATIO
 *
 * CLIENT-SAFE. Atom shape and house style: see ma-01-place-value.js.
 */

export const SECTION_ID = "ma-s10-number-system-ratio";

export const LESSONS = [
  {
    id: "ma-l1-n7",
    moduleId: "ma-10-number-system-ratio",
    sectionId: SECTION_ID,
    skillGroup: "L1-N7",
    order: 1,
    title: "The Number System",
    subtitle: "Natural numbers, integers, rational, irrational and real numbers",
    estimatedMinutes: 30,
    intro: "Every number you have met so far belongs to a family. WAEC names the families and uses their symbols, so learn them once.",

    atoms: [
      {
        id: "a-ma-l1-n7-1",
        title: "Natural numbers, whole numbers and integers",
        explain:
          "NATURAL numbers are the counting numbers. WHOLE numbers are the natural numbers with 0. INTEGERS are the whole numbers together with their negatives. Each family contains the one before it.",
        table: {
          caption: "The first three families.",
          headers: ["Family", "Symbol", "Members"],
          rows: [
            ["Natural numbers", "N", "1, 2, 3, 4, ..."],
            ["Whole numbers", "W", "0, 1, 2, 3, ..."],
            ["Integers", "Z", "..., −2, −1, 0, 1, 2, ..."],
          ],
        },
        example: "  From  −4,  0,  2.5,  7,  3/4,  −1:\n    natural:  7\n    whole:    0, 7\n    integers: −4, 0, 7, −1\n    (2.5 and 3/4 are in none of these)",
        mistake: "Counting 0 as a natural number. The natural numbers start at 1; 0 is a whole number.",
        drill: { skill: "L1-N7.1", count: 4 },
      },
      {
        id: "a-ma-l1-n7-2",
        title: "Rational and irrational numbers",
        explain:
          "A RATIONAL number can be written as a fraction a/b of two integers, with b not 0. Its decimal either stops or repeats. An IRRATIONAL number cannot be written that way: its decimal goes on forever without repeating. The square root of any whole number that is not a perfect square is irrational, and so is π.",
        table: {
          caption: "Rational or irrational?",
          headers: ["Number", "Type", "Why"],
          rows: [
            ["−5", "rational", "−5/1"],
            ["0.75", "rational", "3/4"],
            ["0.333...", "rational", "1/3 (repeating decimal)"],
            ["√49", "rational", "= 7"],
            ["√7", "irrational", "7 is not a perfect square"],
            ["π", "irrational", "never ends, never repeats"],
            ["22/7", "rational", "a fraction; only close to π"],
          ],
        },
        mistake: "Calling every square root irrational. √49 = 7 and √(9/4) = 3/2 are rational. Work the root out first.",
        drill: { skill: "L1-N7.2", count: 5 },
      },
      {
        id: "a-ma-l1-n7-3",
        title: "Real numbers on the number line",
        explain:
          "The rational and irrational numbers together make the REAL numbers, R. Every real number has a place on the number line. To place or compare them, change each to a decimal to two or three places.",
        example:
          "  N ⊂ W ⊂ Z ⊂ Q ⊂ R      (Q is the rationals)\n\n  √20: 16 < 20 < 25, so 4 < √20 < 5\n  −√20 therefore lies between −5 and −4\n\n  Which is larger, π or 22/7?\n    π = 3.14159...,  22/7 = 3.14285...\n    22/7 is slightly larger.",
        visual: { kind: "numberLine", from: -5, to: 5, marks: [-4.47, -0.75, 1.41, 3.14] },
        mistake: "Thinking −√20 is between −4 and −3 because √20 is 'about 4'. √20 is between 4 and 5, so −√20 is between −5 and −4.",
        drill: { skill: "L1-N7.3", count: 4 },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  {
    id: "ma-l2-n3",
    moduleId: "ma-10-number-system-ratio",
    sectionId: SECTION_ID,
    skillGroup: "L2-N3",
    order: 2,
    title: "Ratio, Proportion and Speed",
    subtitle: "Sharing, the unitary method, direct and inverse proportion, speed",
    estimatedMinutes: 45,
    intro: "A ratio compares quantities. A rate compares different units, like naira per kilogram or kilometres per hour. Both are fractions in disguise.",

    atoms: [
      {
        id: "a-ma-l2-n3-1",
        title: "Simplifying and sharing in a ratio",
        explain:
          "A RATIO a : b compares two quantities in the same unit. Simplify it like a fraction, dividing both parts by their HCF. To share an amount in a ratio, add the parts, find one part, then multiply.",
        example:
          "  SIMPLIFY 45 : 60     HCF 15  →  3 : 4\n  SIMPLIFY 2 m : 50 cm  →  200 : 50  →  4 : 1\n\n  SHARE ₦56 000 IN THE RATIO 3 : 4\n    total parts: 3 + 4 = 7\n    one part:    56 000 ÷ 7 = 8 000\n    shares:      3 × 8 000 = ₦24 000,   4 × 8 000 = ₦32 000\n    check:       24 000 + 32 000 = 56 000  ✓",
        visual: { kind: "barModel", parts: 7, shaded: 3, total: 56000, label: "3 : 4" },
        mistake: "Dividing by one part of the ratio. Sharing in 3 : 4 means 7 equal parts, so divide by 7, not by 3 or 4.",
        drill: { skill: "L2-N3.1", count: 4 },
      },
      {
        id: "a-ma-l2-n3-2",
        title: "The unitary method",
        explain: "Find the value of ONE first, then multiply up to the number you want.",
        example:
          "  5 kg of rice cost ₦7 500. Find the cost of 8 kg.\n    1 kg: 7 500 ÷ 5 = ₦1 500\n    8 kg: 1 500 × 8 = ₦12 000",
        mistake: "Multiplying before dividing and getting lost. Always go to ONE first.",
        drill: { skill: "L2-N3.2", count: 4 },
      },
      {
        id: "a-ma-l2-n3-3",
        title: "Direct and inverse proportion",
        explain:
          "In DIRECT proportion, both quantities go up together: double one, double the other. In INVERSE proportion, one goes up as the other goes down: double the workers, halve the days. For inverse proportion, the PRODUCT stays the same.",
        table: {
          caption: "Spot the type before calculating.",
          headers: ["Type", "Example", "Method"],
          rows: [
            ["Direct", "more people, more flour", "unitary: find one, multiply"],
            ["Inverse", "more workers, fewer days", "work out the total (workers × days), then divide"],
          ],
        },
        example:
          "  6 workers take 10 days. How long do 4 workers take?\n    Total work: 6 × 10 = 60 worker-days\n    4 workers: 60 ÷ 4 = 15 days\n    (fewer workers → more days ✓)",
        mistake: "Treating inverse proportion as direct: 4 workers do not take 4/6 × 10 = 6.7 days. Ask: should the answer go up or down?",
        drill: { skill: "L2-N3.3", count: 4 },
      },
      {
        id: "a-ma-l2-n3-4",
        title: "Speed, distance and time",
        explain: "Speed is distance per unit of time. The three are linked by one formula, which can be rearranged.",
        table: {
          caption: "The three forms.",
          headers: ["Find", "Formula"],
          rows: [
            ["Speed", "speed = distance ÷ time"],
            ["Distance", "distance = speed × time"],
            ["Time", "time = distance ÷ speed"],
          ],
          note: "Units must match: km and hours give km/h. Change minutes to hours first: 45 min = 45/60 h = 0.75 h.",
        },
        example:
          "  240 km in 3 h:        speed = 240 ÷ 3 = 80 km/h\n  65 km/h for 2.5 h:    distance = 65 × 2.5 = 162.5 km\n  150 km at 60 km/h:    time = 150 ÷ 60 = 2.5 h = 2 h 30 min",
        mistake: "Writing 2.5 h as 2 h 50 min. 0.5 of an hour is 30 minutes.",
        drill: { skill: "L2-N3.4", count: 4 },
      },
      {
        id: "a-ma-review-10",
        title: "Mixed review",
        explain: "One question on each earlier skill.",
        drill: { review: ["L1-N4.1", "L1-N4.2", "L1-N5.1", "L1-N5.2", "L1-N3.4"], count: 5 },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
