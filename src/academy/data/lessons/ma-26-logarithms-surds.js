/**
 * MATHEMATICS · MONTH 7 · MODULE 26 · LOGARITHMS AND SURDS
 *
 * CLIENT-SAFE. Atom shape and house style: see ma-01-place-value.js.
 */

export const SECTION_ID = "ma-s26-logarithms-surds";

export const LESSONS = [
  {
    id: "ma-l4-n3",
    moduleId: "ma-26-logarithms-surds",
    sectionId: SECTION_ID,
    skillGroup: "L4-N3",
    order: 1,
    title: "Logarithms",
    subtitle: "Logarithms as indices, their laws, tables, change of base and equations",
    estimatedMinutes: 55,
    intro: "A logarithm answers one question: what power? log₂ 8 = 3 because 2³ = 8. Every law of logarithms is a law of indices written the other way round.",

    atoms: [
      {
        id: "a-ma-l4-n3-1",
        title: "Indices and logarithms linked",
        explain:
          "If aˣ = N then log_a N = x. The LOGARITHM of N to base a is the power you raise a to in order to get N. Logarithms to base 10 are written log N, with no base shown.",
        table: {
          caption: "The same fact, two ways.",
          headers: ["Index form", "Log form"],
          rows: [
            ["2⁵ = 32", "log₂ 32 = 5"],
            ["10³ = 1 000", "log 1 000 = 3"],
            ["3⁻² = 1/9", "log₃ (1/9) = −2"],
            ["8^(2/3) = 4", "log₈ 4 = 2/3"],
            ["a⁰ = 1", "log_a 1 = 0"],
          ],
        },
        mistake: "Dividing: log₂ 32 is not 32 ÷ 2 = 16. It is the POWER of 2 that gives 32.",
        drill: { skill: "L4-N3.1", count: 4 },
      },
      {
        id: "a-ma-l4-n3-2",
        title: "Laws of logarithms",
        explain: "Because logarithms ARE indices, the laws of indices become laws of logarithms. They hold in any base.",
        table: {
          caption: "The three laws.",
          headers: ["Law", "From the index law"],
          rows: [
            ["log (ab) = log a + log b", "multiplying adds powers"],
            ["log (a/b) = log a − log b", "dividing subtracts powers"],
            ["log aⁿ = n log a", "a power of a power multiplies"],
          ],
        },
        example: "  log 2 + log 50 = log 100 = 2\n  log₃ 54 − log₃ 2 = log₃ 27 = 3\n  2 log 5 + log 4 = log 25 + log 4 = log 100 = 2",
        mistake: "Writing log (a + b) = log a + log b. The law is for a PRODUCT, not a sum.",
        drill: { skill: "L4-N3.2", count: 4 },
      },
      {
        id: "a-ma-l4-n3-3",
        title: "Log and antilog tables",
        explain:
          "A logarithm has a CHARACTERISTIC (the whole number part, the power of 10 in standard form) and a MANTISSA (the decimal part, from the tables). For a number less than 1 the characteristic is negative and is written with a bar: log 0.0452 = 2̄.6551. To multiply numbers, add their logs; to divide, subtract; then take the ANTILOG.",
        example:
          "  log 4 520 = 3.6551    (4 520 = 4.52 × 10³: characteristic 3)\n  log 0.0452 = 2̄.6551   (0.0452 = 4.52 × 10⁻²: characteristic −2)\n\n  34.5 × 2.17:\n    log 34.5 = 1.5378,  log 2.17 = 0.3365\n    sum = 1.8743,  antilog = 74.87",
        mistake: "Writing the characteristic of a number less than 1 as positive. 0.0452 is smaller than 1, so its log is negative: 2̄.6551 means −2 + 0.6551.",
        drill: { skill: "L4-N3.3", count: 3 },
      },
      {
        id: "a-ma-l4-n3-4",
        title: "Change of base",
        explain: "log_a N = log N ÷ log a, in any base you like. Use it to evaluate a log to an awkward base, or to compare logs in different bases.",
        example: "  log₄ 8 = log 8 / log 4 = 3 log 2 / 2 log 2 = 3/2\n  log₂ 7 = log 7 / log 2 = 0.8451 / 0.3010 = 2.807\n  log₃ 5 × log₅ 3 = 1",
        mistake: "Turning it upside down: log₄ 8 is log 8 / log 4, the number on top.",
        drill: { skill: "L4-N3.4", count: 3 },
      },
      {
        id: "a-ma-l4-n3-5",
        title: "Solving log equations",
        explain: "Turn a log equation into index form, or combine logs into one and then remove them. For an equation like 3ˣ = 20, take logs of both sides. Always check: a logarithm is only defined for POSITIVE numbers.",
        example:
          "  log₂ x = 5         →  x = 2⁵ = 32\n  log x + log (x + 3) = 1\n    log x(x + 3) = log 10  →  x² + 3x − 10 = 0  →  x = 2 or −5\n    reject −5 (log of a negative)  →  x = 2\n  3ˣ = 20  →  x = log 20 / log 3 = 2.727",
        mistake: "Keeping a root that makes the log of a negative number. Always substitute back.",
        drill: { skill: "L4-N3.5", count: 4 },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  {
    id: "ma-l4-n4",
    moduleId: "ma-26-logarithms-surds",
    sectionId: SECTION_ID,
    skillGroup: "L4-N4",
    order: 2,
    title: "Surds",
    subtitle: "Simplifying, combining, multiplying and rationalising",
    estimatedMinutes: 45,
    intro: "A SURD is a root that cannot be written as a fraction, such as √2 or √12. Leaving answers in surd form keeps them exact, and WAEC often asks for exactly that.",

    atoms: [
      {
        id: "a-ma-l4-n4-1",
        title: "Simplifying surds",
        explain: "√(ab) = √a × √b. To simplify, find the LARGEST perfect square that divides the number under the root and take its root outside.",
        example: "  √72 = √(36 × 2) = 6√2\n  3√50 = 3 × √(25 × 2) = 3 × 5√2 = 15√2\n  √48 = √(16 × 3) = 4√3     (not 2√12: use the largest square)",
        mistake: "Not using the largest square: √72 = 2√18 is not finished, because 18 still contains 9.",
        drill: { skill: "L4-N4.1", count: 4 },
      },
      {
        id: "a-ma-l4-n4-2",
        title: "Adding and subtracting surds",
        explain: "Only LIKE surds, with the same number under the root, can be added or subtracted, just like like terms in algebra. Simplify each surd first to make them alike.",
        example: "  3√2 + 5√2 = 8√2\n  √50 + √18 = 5√2 + 3√2 = 8√2\n  2√12 − √27 = 4√3 − 3√3 = √3",
        mistake: "Adding under the root: √9 + √16 = 3 + 4 = 7, but √25 = 5. So √a + √b is never √(a + b).",
        drill: { skill: "L4-N4.2", count: 4 },
      },
      {
        id: "a-ma-l4-n4-3",
        title: "Multiplying surds",
        explain: "√a × √b = √(ab), and √a × √a = a. Expand brackets containing surds exactly as in algebra. Conjugates (a + √b) and (a − √b) multiply to a² − b, which has no surd left.",
        example: "  √6 × √15 = √90 = 3√10\n  (3 + √2)(3 − √2) = 9 − 2 = 7\n  (1 + √3)² = 1 + 2√3 + 3 = 4 + 2√3",
        mistake: "Squaring a bracket term by term: (1 + √3)² is not 1 + 3. The middle term 2√3 is needed.",
        drill: { skill: "L4-N4.3", count: 4 },
      },
      {
        id: "a-ma-l4-n4-4",
        title: "Rationalising denominators",
        explain: "To RATIONALISE a denominator is to remove the root from it. For a/√b, multiply top and bottom by √b. For a/(c − √b), multiply top and bottom by the conjugate c + √b.",
        example: "  6/√3 = 6√3/3 = 2√3\n  1/(3 − √2) = (3 + √2)/((3 − √2)(3 + √2)) = (3 + √2)/7",
        mistake: "Multiplying only the bottom. Top and bottom must be multiplied by the same thing, or the value changes.",
        drill: { skill: "L4-N4.4", count: 4 },
      },
      {
        id: "a-ma-review-26",
        title: "Mixed review",
        explain: "One question on each earlier skill.",
        drill: { review: ["L2-N1.3", "L2-N1.4", "L4-N2.2", "L4-N1.1", "L3-A1.2"], count: 5 },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
