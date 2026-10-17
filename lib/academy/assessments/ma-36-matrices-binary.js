/**
 * ASSESSMENTS · MATHEMATICS · MODULE 36 · MATRICES AND BINARY OPERATIONS
 * SERVER ONLY. See ma-01-place-value.js for how these are written.
 */

export const ASSESSMENTS = {
  "ma-l6-c1": {
    lessonId: "ma-l6-c1",
    passMark: 70,
    questions: [
      {
        id: "ma36-1",
        type: "mcq",
        difficulty: 1,
        atomId: "a-ma-l6-c1-1",
        prompt: "What is the order of the matrix (2 5 1 ; 0 3 4)?",
        options: [
          { id: "a", text: "2 × 3" },
          { id: "b", text: "3 × 2" },
          { id: "c", text: "6" },
          { id: "d", text: "2 × 2" },
        ],
        correct: "a",
        explanation: "2 rows and 3 columns: order 2 × 3.",
        whyWrong: {
          b: "Rows come first: 2 rows, 3 columns.",
          c: "That is the number of entries. The order is rows × columns.",
          d: "Each row has 3 entries, so there are 3 columns.",
        },
      },
      {
        id: "ma36-2",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-l6-c1-3",
        prompt: "Find (1 2 ; 3 4)(2 0 ; 1 3).",
        options: [
          { id: "a", text: "(4 6 ; 10 12)" },
          { id: "b", text: "(2 0 ; 3 12)" },
          { id: "c", text: "(2 4 ; 10 14)" },
          { id: "d", text: "(3 2 ; 4 7)" },
        ],
        correct: "a",
        explanation: "Row × column: 1×2 + 2×1 = 4, 1×0 + 2×3 = 6, 3×2 + 4×1 = 10, 3×0 + 4×3 = 12.",
        whyWrong: {
          b: "That multiplies matching entries. Use row × column.",
          c: "That is the product the other way round, BA. Order matters.",
          d: "That adds the matrices.",
        },
      },
      {
        id: "ma36-3",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-l6-c1-4",
        prompt: "Find the determinant of (5 3 ; 4 2).",
        options: [
          { id: "a", text: "−2" },
          { id: "b", text: "22" },
          { id: "c", text: "2" },
          { id: "d", text: "14" },
        ],
        correct: "a",
        explanation: "ad − bc = 5 × 2 − 3 × 4 = 10 − 12 = −2.",
        whyWrong: {
          b: "That adds the products. It is ad MINUS bc.",
          c: "That is bc − ad. Leading diagonal first.",
          d: "That adds all four entries.",
        },
      },
      {
        id: "ma36-4",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-l6-c1-4",
        prompt: "Find the inverse of (3 1 ; 5 2).",
        options: [
          { id: "a", text: "(2 −1 ; −5 3)" },
          { id: "b", text: "(3 −1 ; −5 2)" },
          { id: "c", text: "(2 1 ; 5 3)" },
          { id: "d", text: "(−2 1 ; 5 −3)" },
        ],
        correct: "a",
        explanation: "Determinant = 6 − 5 = 1. Swap 3 and 2, negate 1 and 5, divide by 1: (2 −1 ; −5 3).",
        whyWrong: {
          b: "The leading diagonal entries must be SWAPPED.",
          c: "The other two entries must change sign.",
          d: "The signs are the wrong way round: negate b and c, not a and d.",
        },
      },
      {
        id: "ma36-5",
        type: "mcq",
        difficulty: 3,
        atomId: "a-ma-l6-c1-5",
        prompt: "Find the determinant of (2 1 0 ; 1 3 1 ; 0 1 2).",
        options: [
          { id: "a", text: "8" },
          { id: "b", text: "12" },
          { id: "c", text: "10" },
          { id: "d", text: "−8" },
        ],
        correct: "a",
        explanation: "2(3×2 − 1×1) − 1(1×2 − 1×0) + 0 = 2 × 5 − 2 = 8.",
        whyWrong: {
          b: "That adds the middle term. The signs are + − +.",
          c: "That stops after the first term.",
          d: "That puts − + − across the top row. It starts with +.",
        },
      },
    ],
  },

  "ma-l6-n1": {
    lessonId: "ma-l6-n1",
    passMark: 70,
    questions: [
      {
        id: "ma36-6",
        type: "mcq",
        difficulty: 1,
        atomId: "a-ma-l6-n1-1",
        prompt: "a ∗ b = a + b + ab. Find 2 ∗ 3.",
        options: [
          { id: "a", text: "11" },
          { id: "b", text: "6" },
          { id: "c", text: "5" },
          { id: "d", text: "30" },
        ],
        correct: "a",
        explanation: "2 + 3 + 2 × 3 = 5 + 6 = 11.",
        whyWrong: {
          b: "That is ab alone. Add a + b as well.",
          c: "That is a + b alone. Add ab as well.",
          d: "That multiplies (a + b) by ab. The rule adds them.",
        },
      },
      {
        id: "ma36-7",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-l6-n1-1",
        prompt: "a ∘ b = 2a − b on the real numbers. Is ∘ commutative?",
        options: [
          { id: "a", text: "No: 1 ∘ 2 = 0 but 2 ∘ 1 = 3" },
          { id: "b", text: "Yes: both sides use a and b" },
          { id: "c", text: "Yes: 2a − b = 2b − a" },
          { id: "d", text: "No: it is not closed" },
        ],
        correct: "a",
        explanation: "One counterexample is enough: 1 ∘ 2 = 2 − 2 = 0, 2 ∘ 1 = 4 − 1 = 3.",
        whyWrong: {
          b: "Using the same letters does not make the results equal. Test it.",
          c: "2a − b and 2b − a are different expressions, unless a = b.",
          d: "2a − b is always real, so it IS closed. Commutativity fails for another reason.",
        },
      },
      {
        id: "ma36-8",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-l6-n1-2",
        prompt: "a ∗ b = a + b + 3 on the real numbers. Find the identity element.",
        options: [
          { id: "a", text: "−3" },
          { id: "b", text: "0" },
          { id: "c", text: "3" },
          { id: "d", text: "1" },
        ],
        correct: "a",
        explanation: "a ∗ e = a: a + e + 3 = a, so e = −3.",
        whyWrong: {
          b: "0 is the identity for ordinary addition. Here a ∗ 0 = a + 3.",
          c: "a ∗ 3 = a + 6, not a.",
          d: "1 is the identity for ordinary multiplication.",
        },
      },
      {
        id: "ma36-9",
        type: "mcq",
        difficulty: 3,
        atomId: "a-ma-l6-n1-2",
        prompt: "a ∗ b = a + b − 4, with identity 4. Find the inverse of 9.",
        options: [
          { id: "a", text: "−1" },
          { id: "b", text: "−9" },
          { id: "c", text: "1/9" },
          { id: "d", text: "−5" },
        ],
        correct: "a",
        explanation: "9 ∗ x = 4: 9 + x − 4 = 4, so x = −1.",
        whyWrong: {
          b: "That is the inverse under ordinary addition. Use this rule.",
          c: "That is the inverse under ordinary multiplication.",
          d: "That sets 9 ∗ x equal to 0. It must equal the identity, 4.",
        },
      },
    ],
  },
};

export default ASSESSMENTS;
