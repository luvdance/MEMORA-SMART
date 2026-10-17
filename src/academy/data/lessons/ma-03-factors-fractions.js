/**
 * MATHEMATICS · MONTH 1 · MODULE 3 · FACTORS, PRIMES AND FRACTIONS
 *
 * CLIENT-SAFE. Atom shape and house style: see ma-01-place-value.js.
 */

export const SECTION_ID = "ma-s03-factors-fractions";

export const LESSONS = [
  {
    id: "ma-l0-n3",
    moduleId: "ma-03-factors-fractions",
    sectionId: SECTION_ID,
    skillGroup: "L0-N3",
    order: 1,
    title: "Factors, Multiples and Primes",
    subtitle: "How whole numbers are built",
    estimatedMinutes: 40,
    intro:
      "Factors, multiples and primes describe how numbers are built from other numbers. Fractions, HCF and LCM, algebraic factorisation and surds all start here.",

    atoms: [
      {
        id: "a-ma-l0-n3-1",
        title: "Factors",
        explain:
          "A factor of a number divides it exactly, with no remainder. Factors come in pairs that multiply to the number. Find them by testing 1, 2, 3, ... and stop when the pairs meet in the middle.",
        example:
          "  FACTORS OF 36\n\n    1 × 36\n    2 × 18\n    3 × 12\n    4 × 9\n    5 × ?    (36 ÷ 5 is not exact)\n    6 × 6    ← the pairs meet. Stop.\n\n    Factors: 1, 2, 3, 4, 6, 9, 12, 18, 36",
        visual: { kind: "factorPairs", n: 36 },
        mistake: "Stopping early or forgetting the partner in a pair. Every factor you find gives you a second one for free: 4 gives 9.",
        drill: { skill: "L0-N3.1", count: 4 },
      },
      {
        id: "a-ma-l0-n3-2",
        title: "Multiples",
        explain:
          "The multiples of a number are its times table: n × 1, n × 2, n × 3, and so on forever. A number has only a few factors, all no bigger than itself, but infinitely many multiples, all at least as big as itself.",
        table: {
          caption: "Factors and multiples of 12, side by side.",
          headers: ["", "Of 12", "How many?"],
          rows: [
            ["Factors", "1, 2, 3, 4, 6, 12", "A few. All ≤ 12"],
            ["Multiples", "12, 24, 36, 48, 60, ...", "Endless. All ≥ 12"],
          ],
        },
        example:
          "  FIRST FIVE MULTIPLES OF 7:  7, 14, 21, 28, 35\n\n  IS 84 A MULTIPLE OF 6?\n    84 ÷ 6 = 14 exactly, so yes: 84 = 6 × 14.",
        mistake: "Mixing the two words up. 3 is a FACTOR of 12. 12 is a MULTIPLE of 3.",
        drill: { skill: "L0-N3.2", count: 4 },
      },
      {
        id: "a-ma-l0-n3-3",
        title: "Prime numbers",
        explain:
          "A prime number has exactly two factors: 1 and itself. 1 is not prime, because it has only one factor. 2 is the only even prime. To test a number, divide it by the primes 2, 3, 5, 7, ... stopping once the prime times itself is bigger than the number. If none divides exactly, it is prime.",
        table: {
          caption: "The 25 primes below 100.",
          headers: ["Range", "Primes"],
          rows: [
            ["1 to 20", "2, 3, 5, 7, 11, 13, 17, 19"],
            ["21 to 50", "23, 29, 31, 37, 41, 43, 47"],
            ["51 to 100", "53, 59, 61, 67, 71, 73, 79, 83, 89, 97"],
          ],
        },
        example:
          "  IS 91 PRIME?\n    11 × 11 = 121 is bigger than 91, so test 2, 3, 5, 7.\n    91 ÷ 7 = 13 exactly.  91 = 7 × 13.  NOT prime.\n\n  IS 97 PRIME?\n    Test 2, 3, 5, 7: none divides exactly.\n    97 is PRIME.",
        visual: { kind: "sieve", upTo: 100 },
        mistake: "Calling every odd number prime. 9, 15, 21, 27, 33, 39, 49, 51, 57, 63, 69, 77, 81, 87, 91 and 93 are all odd and none is prime.",
        drill: { skill: "L0-N3.3", count: 4 },
      },
      {
        id: "a-ma-l0-n3-4",
        title: "Divisibility rules",
        explain: "You can tell whether a number divides by 2, 3, 4, 5, 6, 8, 9, 10 or 11 without dividing, by looking at its digits.",
        table: {
          caption: "A number is divisible by ...",
          headers: ["By", "If", "Example"],
          rows: [
            ["2", "the last digit is even", "738"],
            ["3", "the digit sum divides by 3", "741: 7+4+1 = 12"],
            ["4", "the last two digits divide by 4", "1 316: 16 ÷ 4 = 4"],
            ["5", "the last digit is 0 or 5", "2 345"],
            ["6", "it divides by both 2 and 3", "534: even, digit sum 12"],
            ["8", "the last three digits divide by 8", "5 112: 112 ÷ 8 = 14"],
            ["9", "the digit sum divides by 9", "4 527: 4+5+2+7 = 18"],
            ["10", "the last digit is 0", "980"],
            ["11", "alternating digit sum divides by 11", "2 728: 2−7+2−8 = −11"],
          ],
        },
        visual: { kind: "divisibilityTable" },
        mistake: "Testing 6 with only one rule. 26 is even but not divisible by 6; 15 has digit sum 6 but is odd. It must pass BOTH tests.",
        drill: { skill: "L0-N3.4", count: 4 },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  {
    id: "ma-l0-n4",
    moduleId: "ma-03-factors-fractions",
    sectionId: SECTION_ID,
    skillGroup: "L0-N4",
    order: 2,
    title: "What a Fraction Is",
    subtitle: "Parts of a whole, equivalent fractions, comparing, and a fraction of an amount",
    estimatedMinutes: 40,
    intro: "A fraction is a whole cut into equal parts, with some of the parts taken. Everything in this lesson follows from that picture.",

    atoms: [
      {
        id: "a-ma-l0-n4-1",
        title: "A fraction as a picture",
        explain:
          "In the fraction 3/4, the bottom number, the DENOMINATOR, says the whole is cut into 4 equal parts. The top number, the NUMERATOR, says 3 of those parts are taken. The parts must be equal.",
        table: {
          caption: "Reading a fraction.",
          headers: ["Fraction", "Cut into", "Taken", "Said as"],
          rows: [
            ["1/2", "2 equal parts", "1", "one half"],
            ["1/3", "3 equal parts", "1", "one third"],
            ["3/4", "4 equal parts", "3", "three quarters"],
            ["2/5", "5 equal parts", "2", "two fifths"],
          ],
        },
        visual: { kind: "barModel", parts: 5, shaded: 2, label: "2/5 shaded" },
        mistake: "Counting parts that are not equal. A loaf cut into one big piece and two small pieces is not cut into thirds.",
        drill: { skill: "L0-N4.1", count: 4 },
      },
      {
        id: "a-ma-l0-n4-2",
        title: "Equivalent fractions",
        explain:
          "Multiplying or dividing the numerator and denominator by the SAME number gives an equivalent fraction: the same amount, cut differently. To simplify a fraction to its lowest terms, divide both by the biggest number that divides them both.",
        example:
          "  1/2 = 2/4 = 4/8 = 50/100\n  (top and bottom multiplied by the same number each time)\n\n  SIMPLIFY 18/24\n    The biggest number dividing 18 and 24 is 6.\n    18 ÷ 6 = 3,  24 ÷ 6 = 4\n    18/24 = 3/4\n\n  FILL THE GAP   2/3 = ?/15\n    3 × 5 = 15, so 2 × 5 = 10.    2/3 = 10/15",
        visual: { kind: "equivalentBars", fractions: [[1, 2], [2, 4], [4, 8]] },
        mistake: "Adding the same number to top and bottom. 1/2 is not equal to 2/3: you must MULTIPLY or DIVIDE both.",
        drill: { skill: "L0-N4.2", count: 4 },
      },
      {
        id: "a-ma-l0-n4-3",
        title: "Comparing fractions",
        explain:
          "With the same denominator, the bigger numerator is the bigger fraction. Otherwise, rewrite both with a common denominator and then compare the numerators.",
        example:
          "  WHICH IS LARGER, 3/4 OR 5/7?\n\n    Common denominator 28:\n    3/4 = 21/28      5/7 = 20/28\n    21 > 20, so 3/4 is larger.\n\n  SAME NUMERATOR:  1/3 or 1/5?\n    Thirds are bigger pieces than fifths, so 1/3 > 1/5.",
        visual: { kind: "fractionBars", parts: [[3, 4], [5, 7]] },
        mistake: "Thinking a bigger denominator means a bigger fraction. 1/8 is smaller than 1/2: more pieces means smaller pieces.",
        drill: { skill: "L0-N4.3", count: 4 },
      },
      {
        id: "a-ma-l0-n4-4",
        title: "A fraction of a quantity",
        explain: "To find a fraction of an amount, divide by the denominator to get one part, then multiply by the numerator.",
        example:
          "  3/5 OF ₦2 000\n\n    one fifth:     2 000 ÷ 5 = 400\n    three fifths:  400 × 3   = ₦1 200\n\n  2/3 OF 45 MANGOES\n\n    45 ÷ 3 = 15,   15 × 2 = 30 mangoes",
        visual: { kind: "barModel", parts: 5, shaded: 3, total: 2000, label: "3/5 of ₦2 000" },
        mistake: "Dividing by the numerator. 3/5 of 2 000 is not 2 000 ÷ 3. Divide by the BOTTOM number, multiply by the top.",
        drill: { skill: "L0-N4.4", count: 4 },
      },
      {
        id: "a-ma-review-03",
        title: "Mixed review",
        explain: "One question on each earlier skill. Mixing them is what makes them last.",
        drill: { review: ["L0-N1.2", "L0-N2.1", "L0-N2.3", "L0-N2.4", "L0-N3.1"], count: 5 },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
