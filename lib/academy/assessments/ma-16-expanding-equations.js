/**
 * ASSESSMENTS · MATHEMATICS · MODULE 16 · BRACKETS AND LINEAR EQUATIONS
 * SERVER ONLY. See ma-01-place-value.js for how these are written.
 */

export const ASSESSMENTS = {
  "ma-l2-a1": {
    lessonId: "ma-l2-a1",
    passMark: 70,
    questions: [
      {
        id: "ma16-1",
        type: "mcq",
        difficulty: 1,
        atomId: "a-ma-l2-a1-1",
        prompt: "Expand and simplify 5(x − 2) − 2(x − 3).",
        options: [
          { id: "a", text: "3x − 4" },
          { id: "b", text: "3x − 16" },
          { id: "c", text: "3x − 13" },
          { id: "d", text: "7x − 16" },
        ],
        correct: "a",
        explanation: "5x − 10 − 2x + 6 = 3x − 4.",
        whyWrong: {
          b: "−2 × (−3) is +6, not −6. A negative outside changes the sign of every term inside.",
          c: "That expands −2(x − 3) as −2x − 3, multiplying only the first term.",
          d: "That adds 5x and 2x. The second bracket is subtracted.",
        },
      },
      {
        id: "ma16-2",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-l2-a1-2",
        prompt: "Expand (2x + 3)(x − 4).",
        options: [
          { id: "a", text: "2x² − 12" },
          { id: "b", text: "2x² − 5x − 12" },
          { id: "c", text: "2x² + 11x − 12" },
          { id: "d", text: "2x² − 8x − 12" },
        ],
        correct: "b",
        explanation: "2x × x = 2x², 2x × (−4) = −8x, 3 × x = 3x, 3 × (−4) = −12. Collect: 2x² − 5x − 12.",
        whyWrong: {
          a: "The two middle products are missing.",
          c: "The middle products are −8x and +3x, which collect to −5x.",
          d: "One middle product, 3 × x = 3x, is missing.",
        },
      },
      {
        id: "ma16-3",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-l2-a1-2",
        prompt: "Expand (x − 7)².",
        options: [
          { id: "a", text: "x² + 49" },
          { id: "b", text: "x² − 49" },
          { id: "c", text: "x² − 14x + 49" },
          { id: "d", text: "x² − 7x + 49" },
        ],
        correct: "c",
        explanation: "(x − 7)(x − 7) = x² − 7x − 7x + 49 = x² − 14x + 49.",
        whyWrong: {
          a: "Squaring each term misses the middle term, −14x.",
          b: "x² − 49 is (x − 7)(x + 7), the difference of two squares.",
          d: "There are TWO middle products of −7x each: −14x.",
        },
      },
      {
        id: "ma16-4",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-l2-a1-3",
        prompt: "Factorise completely 12x² − 18x.",
        options: [
          { id: "a", text: "6(2x² − 3x)" },
          { id: "b", text: "6x(2x − 3)" },
          { id: "c", text: "3x(4x − 6)" },
          { id: "d", text: "x(12x − 18)" },
        ],
        correct: "b",
        explanation: "HCF of 12x² and 18x is 6x. 12x² ÷ 6x = 2x and 18x ÷ 6x = 3, so 6x(2x − 3).",
        whyWrong: {
          a: "Not complete: x is still common to both terms inside.",
          c: "Not complete: 4x and 6 still share 2. The HCF is 6x.",
          d: "Not complete: 12 and 18 share 6.",
        },
      },
      {
        id: "ma16-5",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-l2-a1-4",
        prompt: "Simplify (8x + 12)/4.",
        options: [
          { id: "a", text: "2x + 12" },
          { id: "b", text: "2x + 3" },
          { id: "c", text: "8x + 3" },
          { id: "d", text: "5x" },
        ],
        correct: "b",
        explanation: "Divide every term by 4: 8x ÷ 4 = 2x and 12 ÷ 4 = 3.",
        whyWrong: {
          a: "Only the first term was divided. Divide every term by 4.",
          c: "Only the second term was divided.",
          d: "8x and 12 are unlike terms and cannot be combined.",
        },
      },
    ],
  },

  "ma-l2-a2": {
    lessonId: "ma-l2-a2",
    passMark: 70,
    questions: [
      {
        id: "ma16-6",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-l2-a2-1",
        prompt: "Solve 4(x + 3) = 2(x − 1).",
        options: [
          { id: "a", text: "x = −7" },
          { id: "b", text: "x = 7" },
          { id: "c", text: "x = −2.5" },
          { id: "d", text: "x = −6.5" },
        ],
        correct: "a",
        explanation: "4x + 12 = 2x − 2, so 2x = −14 and x = −7.",
        whyWrong: {
          b: "A sign was lost moving 12 across: 2x = −2 − 12 = −14.",
          c: "That expands 4(x + 3) as 4x + 3, multiplying only the x.",
          d: "That expands 2(x − 1) as 2x − 1, multiplying only the x.",
        },
      },
      {
        id: "ma16-7",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-l2-a2-2",
        prompt: "Solve x/2 − x/5 = 6.",
        options: [
          { id: "a", text: "x = 20" },
          { id: "b", text: "x = 2" },
          { id: "c", text: "x = −20" },
          { id: "d", text: "x = 60" },
        ],
        correct: "a",
        explanation: "× 10: 5x − 2x = 60, so 3x = 60 and x = 20.",
        whyWrong: {
          b: "That clears the fractions but leaves the 6 alone. Every term must be multiplied by 10: 5x − 2x = 60.",
          c: "The terms are 5x − 2x = 3x, positive.",
          d: "That stops at 3x = 60. Divide by 3.",
        },
      },
      {
        id: "ma16-8",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-l2-a2-3",
        prompt: "Make r the subject of A = πr².",
        options: [
          { id: "a", text: "r = A/π²" },
          { id: "b", text: "r = √(A/π)" },
          { id: "c", text: "r = √A/π" },
          { id: "d", text: "r = A/(2π)" },
        ],
        correct: "b",
        explanation: "Divide by π: r² = A/π. Then take the square root of both sides: r = √(A/π).",
        whyWrong: {
          a: "π is not squared; r is. Divide by π, then square root.",
          c: "The square root must cover the whole of A/π, not just A.",
          d: "Undo a square with a square root, not by dividing by 2.",
        },
      },
      {
        id: "ma16-9",
        type: "mcq",
        difficulty: 3,
        atomId: "a-ma-l2-a2-2",
        prompt: "Solve (2x − 1)/3 = (x + 4)/2.",
        options: [
          { id: "a", text: "x = 14" },
          { id: "b", text: "x = 5" },
          { id: "c", text: "x = 2.75" },
          { id: "d", text: "x = −14" },
        ],
        correct: "a",
        explanation: "Cross-multiply: 2(2x − 1) = 3(x + 4). 4x − 2 = 3x + 12, so x = 14.",
        whyWrong: {
          b: "That multiplies only the first term of each bracket: 4x − 1 = 3x + 4.",
          c: "That cross-multiplies the wrong way: 3(2x − 1) = 2(x + 4) gives 4x = 11.",
          d: "A sign was lost: 4x − 3x = 12 + 2 = 14.",
        },
      },
    ],
  },
};

export default ASSESSMENTS;
