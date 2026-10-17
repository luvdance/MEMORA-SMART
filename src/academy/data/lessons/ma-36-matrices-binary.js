/**
 * MATHEMATICS · MONTH 9 · MODULE 36 · MATRICES AND BINARY OPERATIONS
 *
 * CLIENT-SAFE. Atom shape and house style: see ma-01-place-value.js.
 */

export const SECTION_ID = "ma-s36-matrices-binary";

export const LESSONS = [
  {
    id: "ma-l6-c1",
    moduleId: "ma-36-matrices-binary",
    sectionId: SECTION_ID,
    skillGroup: "L6-C1",
    order: 1,
    title: "Matrices and Determinants",
    subtitle: "Arrays you can add, multiply and invert",
    estimatedMinutes: 55,
    intro: "A MATRIX is a rectangular array of numbers in brackets. Matrices give a compact way to write and solve simultaneous equations. Here a matrix is typed row by row with ; between rows: (1 2 ; 3 4) has first row 1 2 and second row 3 4.",

    atoms: [
      {
        id: "a-ma-l6-c1-1",
        title: "Order and types",
        explain: "The ORDER is rows × columns. A SQUARE matrix has as many rows as columns. The IDENTITY matrix I has 1s on the leading diagonal and 0s elsewhere. A NULL matrix is all zeros.",
        table: [
          ["Matrix", "Order", "Type"],
          ["(2 5 1 ; 0 3 4)", "2 × 3", "rectangular"],
          ["(1 0 ; 0 1)", "2 × 2", "identity I"],
          ["(0 0 ; 0 0)", "2 × 2", "null"],
        ],
        example: "  (4 ; 7 ; 2) is a column matrix of order 3 × 1",
        mistake: "Writing columns × rows. Rows come first, always.",
        drill: { skill: "L6-C1.1", count: 3 },
      },
      {
        id: "a-ma-l6-c1-2",
        title: "Adding, subtracting and scaling",
        explain: "Matrices of the SAME order are added or subtracted entry by entry. Multiplying by a number (a scalar) multiplies every entry. Different orders cannot be added.",
        example: "  A = (2 1 ; 0 3), B = (1 4 ; 5 −2)\n    A + B = (3 5 ; 5 1)\n    2A − B = (3 −2 ; −5 8)",
        mistake: "Multiplying only the first row by the scalar. EVERY entry is multiplied.",
        drill: { skill: "L6-C1.2", count: 3 },
      },
      {
        id: "a-ma-l6-c1-3",
        title: "Multiplying matrices",
        explain: "AB exists only when the number of COLUMNS of A equals the number of ROWS of B: (m × n)(n × p) gives m × p. Each entry is ROW of A times COLUMN of B: multiply in pairs and add. In general AB ≠ BA.",
        example: "  (1 2 ; 3 4)(5 6 ; 7 8)\n    top-left  = 1×5 + 2×7 = 19\n    top-right = 1×6 + 2×8 = 22\n    bottom    = 3×5 + 4×7 = 43,  3×6 + 4×8 = 50\n    = (19 22 ; 43 50)",
        mistake: "Multiplying matching entries (1×5, 2×6, ...). Matrix multiplication is always row × column.",
        drill: { skill: "L6-C1.3", count: 3 },
      },
      {
        id: "a-ma-l6-c1-4",
        title: "Determinant and inverse",
        explain: "For M = (a b ; c d), the DETERMINANT |M| = ad − bc. If |M| ≠ 0, the INVERSE is M⁻¹ = 1/|M| × (d −b ; −c a): swap a and d, change the signs of b and c, divide by the determinant. If |M| = 0, M is SINGULAR and has no inverse.",
        example: "  M = (4 3 ; 2 1)\n    |M| = 4 − 6 = −2\n    M⁻¹ = −½ (1 −3 ; −2 4) = (−½ 3/2 ; 1 −2)",
        mistake: "Swapping b and c instead of a and d. Swap the leading diagonal; negate the other.",
        drill: { skill: "L6-C1.4", count: 3 },
      },
      {
        id: "a-ma-l6-c1-5",
        title: "Solving equations; 3 × 3 determinants",
        explain: "Write ax + by = p, cx + dy = q as M(x ; y) = (p ; q). Then (x ; y) = M⁻¹(p ; q). For a 3 × 3 determinant, expand along the top row with signs + − +: each top entry times the 2 × 2 determinant left when its row and column are covered.",
        example: "  2x + y = 7, x − y = 2\n    |M| = −2 − 1 = −3\n    x = (−1×7 − 1×2)/−3 = 3, y = (2×2 − 1×7)/−3 = 1\n\n  |1 2 0 ; 3 1 2 ; 0 1 1| = 1(1 − 2) − 2(3 − 0) + 0 = −7",
        mistake: "Using + + + across the top row. The middle term is SUBTRACTED.",
        drill: { skill: "L6-C1.5", count: 3 },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  {
    id: "ma-l6-n1",
    moduleId: "ma-36-matrices-binary",
    sectionId: SECTION_ID,
    skillGroup: "L6-N1",
    order: 2,
    title: "Binary Operations",
    subtitle: "New rules, tested for the old properties (JAMB)",
    estimatedMinutes: 35,
    intro: "A BINARY OPERATION combines two elements by a stated rule, written with a symbol such as ∗. You follow the rule exactly as written, then test it for the properties ordinary + and × have.",

    atoms: [
      {
        id: "a-ma-l6-n1-1",
        title: "Using and testing an operation",
        explain: "Replace a and b in the rule with the given numbers, doing brackets first. Then test: CLOSED (the answer stays in the set), COMMUTATIVE (a ∗ b = b ∗ a), ASSOCIATIVE ((a ∗ b) ∗ c = a ∗ (b ∗ c)), and DISTRIBUTIVE over another operation. One counterexample (a single case where it fails) proves a property FALSE.",
        example: "  a ∗ b = a + b + 2ab\n    3 ∗ 1 = 3 + 1 + 6 = 10\n    b ∗ a = b + a + 2ba = a ∗ b  →  commutative\n\n  a ∘ b = 2a − b:  1 ∘ 2 = 0, 2 ∘ 1 = 3  →  not commutative",
        mistake: "Testing one pair, getting equal answers, and calling it commutative. Prove it in letters, or find a single pair that fails.",
        drill: { skill: "L6-N1.1", count: 3 },
      },
      {
        id: "a-ma-l6-n1-2",
        title: "Identity and inverse",
        explain: "The IDENTITY e leaves every element unchanged: a ∗ e = a. Solve that for e. The INVERSE of a, a⁻¹, gives the identity: a ∗ a⁻¹ = e. Solve for a⁻¹.",
        example: "  a ∗ b = a + b − 4\n    a + e − 4 = a  →  e = 4\n    inverse of 7: 7 + x − 4 = 4  →  x = 1",
        mistake: "Assuming the identity is 0 or 1. It depends on the rule: solve a ∗ e = a.",
        drill: { skill: "L6-N1.2", count: 3 },
      },
      {
        id: "a-ma-review-36",
        title: "Mixed review",
        explain: "One question on each earlier skill.",
        drill: { review: ["L5-S1.3", "L5-S2.3", "L5-S3.3", "L5-S3.5", "L5-T1.1"], count: 5 },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
