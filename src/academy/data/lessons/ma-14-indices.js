/**
 * MATHEMATICS · MONTH 4 · MODULE 14 · INDICES AND STANDARD FORM
 *
 * CLIENT-SAFE. Atom shape and house style: see ma-01-place-value.js.
 */

export const SECTION_ID = "ma-s14-indices";

export const LESSONS = [
  {
    id: "ma-l2-n1",
    moduleId: "ma-14-indices",
    sectionId: SECTION_ID,
    skillGroup: "L2-N1",
    order: 1,
    title: "Indices and Standard Form",
    subtitle: "The laws of indices, zero, negative and fractional powers, and standard form",
    estimatedMinutes: 55,
    intro:
      "In aⁿ, a is the BASE and n is the INDEX (or power): n copies of a multiplied together. Every law in this lesson comes from that one meaning, so you can rebuild any of them in seconds.",

    atoms: [
      {
        id: "a-ma-l2-n1-1",
        title: "Laws of indices",
        explain: "Powers of the SAME base combine by three laws. Each one is just counting how many copies of the base are multiplied.",
        table: {
          caption: "The three laws.",
          headers: ["Law", "In symbols", "Example", "Why"],
          rows: [
            ["Multiply: add the powers", "aᵐ × aⁿ = aᵐ⁺ⁿ", "x⁵ × x³ = x⁸", "5 x's then 3 more x's"],
            ["Divide: subtract the powers", "aᵐ ÷ aⁿ = aᵐ⁻ⁿ", "x⁷ ÷ x³ = x⁴", "3 x's cancel"],
            ["Power of a power: multiply", "(aᵐ)ⁿ = aᵐⁿ", "(x³)² = x⁶", "two lots of 3 x's"],
          ],
          note: "Numbers in front are dealt with separately: 3x⁴ × 5x² = 15x⁶, and (2x³)³ = 8x⁹.",
        },
        example: "  12a⁷ ÷ 4a³ = (12 ÷ 4) a⁷⁻³ = 3a⁴\n  (3y²)³ = 3³ × y⁶ = 27y⁶",
        mistake: "Multiplying the powers when multiplying terms: x⁵ × x³ is x⁸, not x¹⁵. Multiply the powers only for a power of a power.",
        drill: { skill: "L2-N1.1", count: 5 },
      },
      {
        id: "a-ma-l2-n1-2",
        title: "Zero and negative indices",
        explain: "Following the division law down past zero gives the meaning of the zero and negative powers.",
        table: {
          caption: "Zero and negative powers.",
          headers: ["Rule", "Example", "Why"],
          rows: [
            ["a⁰ = 1", "7⁰ = 1", "a³ ÷ a³ = a⁰, and anything ÷ itself = 1"],
            ["a⁻ⁿ = 1/aⁿ", "2⁻³ = 1/8", "a² ÷ a⁵ = a⁻³ = 1/a³"],
            ["(a/b)⁻ⁿ = (b/a)ⁿ", "(2/3)⁻² = 9/4", "flip, then raise to the power"],
          ],
        },
        example: "  2⁵, 2⁴, 2³, 2², 2¹, 2⁰, 2⁻¹, 2⁻²\n  32, 16,  8,  4,  2,  1,  1/2, 1/4\n  Each step left to right divides by 2.",
        mistake: "Making the answer negative: 2⁻³ is 1/8, a small positive number, not −8.",
        drill: { skill: "L2-N1.2", count: 4 },
      },
      {
        id: "a-ma-l2-n1-3",
        title: "Fractional indices",
        explain: "A fractional index is a root and a power together. The BOTTOM of the fraction is the root, the TOP is the power. Take the root first to keep the numbers small.",
        table: {
          caption: "Fractional powers.",
          headers: ["Rule", "Example"],
          rows: [
            ["a^(1/n) = ⁿ√a", "27^(1/3) = ∛27 = 3"],
            ["a^(m/n) = (ⁿ√a)ᵐ", "8^(2/3) = (∛8)² = 2² = 4"],
            ["a^(−m/n) = 1 / a^(m/n)", "16^(−3/4) = 1/(⁴√16)³ = 1/8"],
          ],
        },
        mistake: "Multiplying by the index: 8^(2/3) is not 8 × 2/3. It is the cube root of 8, squared.",
        drill: { skill: "L2-N1.3", count: 5 },
      },
      {
        id: "a-ma-l2-n1-4",
        title: "Equations involving indices",
        explain: "If aˣ = aʸ then x = y. So write both sides as powers of the SAME base, then set the powers equal.",
        example:
          "  2^(x + 1) = 32\n    32 = 2⁵   →   x + 1 = 5   →   x = 4\n\n  9ˣ = 27\n    9 = 3², 27 = 3³   →   3^(2x) = 3³   →   2x = 3   →   x = 3/2\n\n  4ˣ = 1/16\n    1/16 = 4⁻²   →   x = −2",
        mistake: "Dividing: 2ˣ = 32 does not give x = 16. x is a power: 2⁵ = 32, so x = 5.",
        drill: { skill: "L2-N1.4", count: 4 },
      },
      {
        id: "a-ma-l2-n1-5",
        title: "Writing standard form",
        explain: "STANDARD FORM writes a number as A × 10ⁿ, where A is at least 1 and less than 10 and n is a whole number. Count how many places the decimal point moves.",
        example:
          "  375 300 000   = 3.753 × 10⁸      (point moves 8 places)\n  0.000 035     = 3.5 × 10⁻⁵       (point moves 5 places the other way)\n  6.02 × 10⁴    = 60 200\n  7.1 × 10⁻³    = 0.0071",
        mistake: "Writing 37.53 × 10⁷. The value is right but A must be less than 10.",
        drill: { skill: "L2-N1.5", count: 4 },
      },
      {
        id: "a-ma-l2-n1-6",
        title: "Calculating in standard form",
        explain: "Multiply or divide the numbers, and add or subtract the powers of 10 by the laws of indices. If the number part is no longer between 1 and 10, adjust it.",
        example:
          "  (4 × 10⁵) × (6 × 10³) = 24 × 10⁸ = 2.4 × 10⁹\n  (8.4 × 10⁶) ÷ (2 × 10⁻²) = 4.2 × 10⁸",
        mistake: "Leaving 24 × 10⁸ as the answer. It is equal, but not standard form: 24 = 2.4 × 10, so add 1 to the power.",
        drill: { skill: "L2-N1.6", count: 4 },
      },
      {
        id: "a-ma-review-14",
        title: "Mixed review",
        explain: "One question on each earlier skill.",
        drill: { review: ["L1-S1.3", "L1-G2.3", "L1-N2.1", "L0-N6.2", "L1-N5.2"], count: 5 },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
