/**
 * ASSESSMENTS · MATHEMATICS · MODULE 14 · INDICES AND STANDARD FORM
 * SERVER ONLY. See ma-01-place-value.js for how these are written.
 */

export const ASSESSMENTS = {
  "ma-l2-n1": {
    lessonId: "ma-l2-n1",
    passMark: 70,
    questions: [
      {
        id: "ma14-1",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-l2-n1-1",
        prompt: "Simplify (2x³)⁴ ÷ 4x⁵.",
        options: [
          { id: "a", text: "4x⁷" },
          { id: "b", text: "2x⁷" },
          { id: "c", text: "4x²" },
          { id: "d", text: "16x⁷" },
        ],
        correct: "a",
        explanation: "(2x³)⁴ = 16x¹². Then 16x¹² ÷ 4x⁵ = 4x⁷.",
        whyWrong: {
          b: "That uses 2⁴ = 8. 2⁴ = 2 × 2 × 2 × 2 = 16, so (2x³)⁴ = 16x¹².",
          c: "That uses (x³)⁴ = x⁷. A power of a power multiplies: x¹².",
          d: "That forgets to divide 16 by 4.",
        },
      },
      {
        id: "ma14-2",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-l2-n1-2",
        prompt: "Evaluate 5⁰ + 4⁻¹.",
        options: [
          { id: "a", text: "1 1/4" },
          { id: "b", text: "−4" },
          { id: "c", text: "1/4" },
          { id: "d", text: "−3" },
        ],
        correct: "a",
        explanation: "5⁰ = 1 and 4⁻¹ = 1/4. So 1 + 1/4 = 1 1/4.",
        whyWrong: {
          b: "That treats 5⁰ as 0 and 4⁻¹ as −4. Any number to the power 0 is 1, and a negative index means 'one over'.",
          c: "That treats 5⁰ as 0. Any non-zero number to the power 0 is 1.",
          d: "That treats 4⁻¹ as −4. A negative index means 1/4.",
        },
      },
      {
        id: "ma14-3",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-l2-n1-3",
        prompt: "Evaluate 27^(−2/3).",
        options: [
          { id: "a", text: "−9" },
          { id: "b", text: "1/9" },
          { id: "c", text: "−18" },
          { id: "d", text: "9" },
        ],
        correct: "b",
        explanation: "27^(1/3) = 3. 3² = 9. The negative index gives 1/9.",
        whyWrong: {
          a: "A negative index means 'one over', not a negative answer.",
          c: "That multiplies 27 by −2/3. A fractional index is a root and a power.",
          d: "27^(2/3) = 9, but the index is NEGATIVE: 1/9.",
        },
      },
      {
        id: "ma14-4",
        type: "mcq",
        difficulty: 3,
        atomId: "a-ma-l2-n1-4",
        prompt: "Solve 8ˣ = 32.",
        options: [
          { id: "a", text: "x = 4" },
          { id: "b", text: "x = 5/3" },
          { id: "c", text: "x = 3/5" },
          { id: "d", text: "x = 24" },
        ],
        correct: "b",
        explanation: "8 = 2³ and 32 = 2⁵. So 2^(3x) = 2⁵, giving 3x = 5 and x = 5/3.",
        whyWrong: {
          a: "That divides 32 by 8. x is a power, not a multiplier.",
          c: "3x = 5 gives x = 5/3, not 3/5.",
          d: "That subtracts 8 from 32. Write both sides as powers of 2.",
        },
      },
      {
        id: "ma14-5",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-l2-n1-6",
        prompt: "Work out (3 × 10⁴) × (5 × 10⁻⁷) in standard form.",
        options: [
          { id: "a", text: "15 × 10⁻³" },
          { id: "b", text: "1.5 × 10⁻²" },
          { id: "c", text: "1.5 × 10⁻³" },
          { id: "d", text: "1.5 × 10¹¹" },
        ],
        correct: "b",
        explanation: "3 × 5 = 15 and 10⁴ × 10⁻⁷ = 10⁻³. 15 × 10⁻³ = 1.5 × 10⁻².",
        whyWrong: {
          a: "Equal in value, but 15 is not less than 10, so it is not standard form.",
          c: "Adjusting 15 to 1.5 means ADDING 1 to the power: −3 + 1 = −2.",
          d: "That subtracts the powers: 4 − (−7) = 11. When multiplying, add them: 4 + (−7) = −3.",
        },
      },
    ],
  },
};

export default ASSESSMENTS;
