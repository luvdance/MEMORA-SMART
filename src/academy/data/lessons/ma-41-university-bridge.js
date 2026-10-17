/**
 * MATHEMATICS · MONTH 10 · MODULE 41 · THE UNIVERSITY BRIDGE
 *
 * CLIENT-SAFE. Atom shape and house style: see ma-01-place-value.js.
 *
 * Beyond WAEC and JAMB: the notation and standard of proof that a first-year
 * university mathematics course assumes on day one.
 */

export const SECTION_ID = "ma-s41-university-bridge";

export const LESSONS = [
  {
    id: "ma-l6-u1",
    moduleId: "ma-41-university-bridge",
    sectionId: SECTION_ID,
    skillGroup: "L6-U1",
    order: 1,
    title: "Functions, the Binomial Theorem and Partial Fractions",
    subtitle: "The algebra a 100 level course starts with",
    estimatedMinutes: 55,
    intro: "Functions are the language of university mathematics. This lesson sharpens f(x) notation and adds two tools used constantly: the binomial expansion and partial fractions.",

    atoms: [
      {
        id: "a-ma-l6-u1-1",
        title: "Domain and range",
        explain: "The DOMAIN is the set of inputs allowed; the RANGE is the set of outputs produced. Exclude any x that divides by zero or square-roots a negative.",
        table: [
          ["f(x)", "Domain", "Range"],
          ["1/(x − 2)", "x ≠ 2", "f(x) ≠ 0"],
          ["√(x + 3)", "x ≥ −3", "f(x) ≥ 0"],
          ["(x − 1)² + 4", "all real x", "f(x) ≥ 4"],
        ],
        example: "  f(x) = 5/(x + 4): undefined at x = −4, so the domain is x ≠ −4",
        mistake: "Mixing the two: the domain is about x, the range is about f(x).",
        drill: { skill: "L6-U1.1", count: 3 },
      },
      {
        id: "a-ma-l6-u1-2",
        title: "Composite and inverse functions",
        explain: "f(g(x)), also written fg(x), means do g FIRST, then f. The INVERSE f⁻¹ undoes f: write y = f(x), make x the subject, then swap the letters. Only a one-to-one function has an inverse.",
        example: "  f(x) = 2x + 1, g(x) = x²\n    fg(x) = 2x² + 1,  gf(x) = (2x + 1)²\n    f⁻¹: y = 2x + 1 → x = (y − 1)/2 → f⁻¹(x) = (x − 1)/2",
        mistake: "Reading fg(x) as 'f first'. The function nearest x acts first.",
        drill: { skill: "L6-U1.2", count: 3 },
      },
      {
        id: "a-ma-l6-u1-3",
        title: "The binomial expansion",
        explain: "(a + b)ⁿ = Σ ⁿCᵣ aⁿ⁻ʳ bʳ, for r = 0 to n. The coefficients are row n of PASCAL'S TRIANGLE. The term in xʳ of (1 + kx)ⁿ is ⁿCᵣ (kx)ʳ.",
        table: [
          ["n", "Coefficients"],
          ["2", "1 2 1"],
          ["3", "1 3 3 1"],
          ["4", "1 4 6 4 1"],
          ["5", "1 5 10 10 5 1"],
        ],
        example: "  (1 + 2x)⁴ = 1 + 4(2x) + 6(2x)² + 4(2x)³ + (2x)⁴\n            = 1 + 8x + 24x² + 32x³ + 16x⁴",
        mistake: "Writing 6 × 2x² instead of 6 × (2x)² = 24x². The whole term is raised to the power.",
        drill: { skill: "L6-U1.3", count: 3 },
      },
      {
        id: "a-ma-l6-u1-4",
        title: "Partial fractions",
        explain: "Reverse the adding of fractions: (px + q)/((x − a)(x − b)) = A/(x − a) + B/(x − b). Multiply through by the denominator, then substitute x = a and x = b to find A and B quickly.",
        example: "  (5x − 1)/((x − 1)(x + 1)) = A/(x − 1) + B/(x + 1)\n    5x − 1 = A(x + 1) + B(x − 1)\n    x = 1: 4 = 2A → A = 2;   x = −1: −6 = −2B → B = 3",
        mistake: "Substituting into the original fraction (division by zero). Substitute into the line with no fractions.",
        drill: { skill: "L6-U1.4", count: 3 },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  {
    id: "ma-l6-u2",
    moduleId: "ma-41-university-bridge",
    sectionId: SECTION_ID,
    skillGroup: "L6-U2",
    order: 2,
    title: "Proof, Radians, Identities and Complex Numbers",
    subtitle: "Thinking like a mathematician",
    estimatedMinutes: 70,
    intro: "At university, 'show that' means PROVE. This lesson gives the standard of proof, the notation, and the number system that the first lectures assume.",

    atoms: [
      {
        id: "a-ma-l6-u2-1",
        title: "Proof and counterexample",
        explain: "Examples can never prove a claim about ALL numbers; one COUNTEREXAMPLE disproves it. A direct proof uses letters: write an even number as 2m and an odd number as 2m + 1.",
        example: "  Claim: the sum of two odd numbers is even.\n    (2m + 1) + (2n + 1) = 2(m + n + 1), a multiple of 2 ✓\n  Claim: every prime is odd. Counterexample: 2.",
        mistake: "Checking five cases and writing 'proved'. Five cases are evidence, not proof.",
        drill: { skill: "L6-U2.1", count: 3 },
      },
      {
        id: "a-ma-l6-u2-2",
        title: "Sigma notation",
        explain: "Σ (sigma) means 'add up'. Σ f(r) for r = 1 to n means f(1) + f(2) + … + f(n). A linear f(r) gives an arithmetic series.",
        example: "  Σ (3r + 1), r = 1 to 5 = 4 + 7 + 10 + 13 + 16 = 50\n  As an AP: 5/2 × (4 + 16) = 50",
        mistake: "Starting at r = 0 when the sum says r = 1.",
        drill: { skill: "L6-U2.2", count: 3 },
      },
      {
        id: "a-ma-l6-u2-3",
        title: "Proof by induction",
        explain: "To prove a statement for every n ≥ 1: (1) BASE CASE: show it is true for n = 1. (2) INDUCTIVE STEP: assume it is true for n = k, and show it follows for n = k + 1. (3) CONCLUDE: true for 1, so for 2, so for 3, and so on.",
        example: "  Σ r = n(n + 1)/2\n    n = 1: 1 = 1 × 2/2 ✓\n    assume Σ to k = k(k + 1)/2\n    Σ to k + 1 = k(k + 1)/2 + (k + 1) = (k + 1)(k + 2)/2 ✓",
        mistake: "Assuming the result for k + 1. You assume it for k and PROVE it for k + 1.",
        drill: { skill: "L6-U2.3", count: 3 },
      },
      {
        id: "a-ma-l6-u2-4",
        title: "Radians",
        explain: "A RADIAN is the angle where the arc equals the radius. π radians = 180°. In radians, arc length s = rθ and sector area = ½r²θ: no 360 and no π needed.",
        table: [
          ["Degrees", "Radians"],
          ["30°", "π/6"],
          ["45°", "π/4"],
          ["60°", "π/3"],
          ["90°", "π/2"],
          ["180°", "π"],
          ["360°", "2π"],
        ],
        example: "  150° = 150 × π/180 = 5π/6\n  r = 8, θ = 1.5: s = 12, area = ½ × 64 × 1.5 = 48",
        mistake: "Using s = rθ with θ in degrees. The formula only works in radians.",
        drill: { skill: "L6-U2.4", count: 3 },
      },
      {
        id: "a-ma-l6-u2-5",
        title: "Trigonometric identities",
        explain: "An IDENTITY is true for every value of x. The two to know: sin²x + cos²x = 1 (from Pythagoras) and tan x = sin x/cos x. To prove one, start from one side and transform it into the other.",
        example: "  sin x = 5/13, x acute: cos²x = 1 − 25/169 = 144/169 → cos x = 12/13\n  Prove (1 − cos²x)/sin x ≡ sin x:  LHS = sin²x/sin x = sin x ✓",
        mistake: "Working on both sides at once and meeting in the middle. Transform one side only.",
        drill: { skill: "L6-U2.5", count: 3 },
      },
      {
        id: "a-ma-l6-u2-6",
        title: "Complex numbers",
        explain: "Define i with i² = −1. A COMPLEX number is a + bi: a is the real part, b the imaginary part. Add and multiply like brackets, replacing i² by −1. A quadratic with a negative discriminant has two complex roots.",
        example: "  (2 + 3i)(1 − i) = 2 − 2i + 3i − 3i² = 2 + i + 3 = 5 + i\n  x² − 4x + 13 = 0: x = (4 ± √−36)/2 = 2 ± 3i",
        mistake: "Writing 3i² as 3. i² = −1, so −3i² = +3.",
        drill: { skill: "L6-U2.6", count: 3 },
      },
      {
        id: "a-ma-review-41",
        title: "Mixed review",
        explain: "One question on each earlier skill.",
        drill: { review: ["L6-C2.5", "L6-C3.1", "L6-E1.3", "L6-A1.4", "L6-G1.4"], count: 5 },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
