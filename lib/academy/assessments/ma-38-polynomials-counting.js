/**
 * ASSESSMENTS · MATHEMATICS · MODULE 38 · POLYNOMIALS, PERMUTATIONS AND COMBINATIONS
 * SERVER ONLY. See ma-01-place-value.js for how these are written.
 */

export const ASSESSMENTS = {
  "ma-l6-a1": {
    lessonId: "ma-l6-a1",
    passMark: 70,
    questions: [
      {
        id: "ma38-1",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-l6-a1-1",
        prompt: "Divide x³ − 7x + 6 by (x − 1).",
        options: [
          { id: "a", text: "x² + x − 6" },
          { id: "b", text: "x² − x − 6" },
          { id: "c", text: "x² − 6" },
          { id: "d", text: "x² + x + 6" },
        ],
        correct: "a",
        explanation: "(x − 1)(x² + x − 6) = x³ + x² − 6x − x² − x + 6 = x³ − 7x + 6.",
        whyWrong: {
          b: "Check by multiplying back: (x − 1)(x² − x − 6) = x³ − 2x² − 5x + 6.",
          c: "The x² term is missing from the dividend, so write it as 0x² and divide carefully.",
          d: "The constant must give +6 when multiplied by −1: so it is −6.",
        },
      },
      {
        id: "ma38-2",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-l6-a1-2",
        prompt: "Find the remainder when 2x³ − x² + 3x − 4 is divided by (x − 2).",
        options: [
          { id: "a", text: "14" },
          { id: "b", text: "−30" },
          { id: "c", text: "−4" },
          { id: "d", text: "0" },
        ],
        correct: "a",
        explanation: "f(2) = 16 − 4 + 6 − 4 = 14.",
        whyWrong: {
          b: "That is f(−2). (x − 2) = 0 when x = +2.",
          c: "That is only the constant term.",
          d: "A zero remainder would make (x − 2) a factor. Work out f(2).",
        },
      },
      {
        id: "ma38-3",
        type: "mcq",
        difficulty: 3,
        atomId: "a-ma-l6-a1-3",
        prompt: "(x − 2) is a factor of x³ + kx² − x + 6. Find k.",
        options: [
          { id: "a", text: "−3" },
          { id: "b", text: "3" },
          { id: "c", text: "−6" },
          { id: "d", text: "12" },
        ],
        correct: "a",
        explanation: "f(2) = 8 + 4k − 2 + 6 = 12 + 4k = 0, so k = −3.",
        whyWrong: {
          b: "12 + 4k = 0 gives k = −3. Watch the sign.",
          c: "That divides 12 by 2 instead of by 4: k is multiplied by 2² = 4.",
          d: "12 is the other terms added up; solve 12 + 4k = 0 for k.",
        },
      },
      {
        id: "ma38-4",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-l6-a1-4",
        prompt: "Where does y = (x + 2)(x − 1)(x − 4) cross the y-axis?",
        options: [
          { id: "a", text: "y = 8" },
          { id: "b", text: "y = −8" },
          { id: "c", text: "y = 0" },
          { id: "d", text: "y = −3" },
        ],
        correct: "a",
        explanation: "x = 0: (2)(−1)(−4) = 8.",
        whyWrong: {
          b: "Two negatives multiply to a positive: (−1)(−4) = +4.",
          c: "y = 0 is where it crosses the x-AXIS. The y-axis is where x = 0.",
          d: "That adds the constants. Multiply them.",
        },
      },
    ],
  },

  "ma-l6-s1": {
    lessonId: "ma-l6-s1",
    passMark: 70,
    questions: [
      {
        id: "ma38-5",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-l6-s1-1",
        prompt: "In how many ways can 6 people sit around a round table?",
        options: [
          { id: "a", text: "120" },
          { id: "b", text: "720" },
          { id: "c", text: "6" },
          { id: "d", text: "360" },
        ],
        correct: "a",
        explanation: "Circular: (6 − 1)! = 5! = 120.",
        whyWrong: {
          b: "That is 6!, for a straight line. Around a table, fix one person first.",
          c: "That counts the people, not the arrangements.",
          d: "That divides 6! by 2, which is for a necklace that can be turned over.",
        },
      },
      {
        id: "ma38-6",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-l6-s1-2",
        prompt: "How many different arrangements are there of the letters of ABUJA?",
        options: [
          { id: "a", text: "60" },
          { id: "b", text: "120" },
          { id: "c", text: "24" },
          { id: "d", text: "30" },
        ],
        correct: "a",
        explanation: "5 letters with A twice: 5!/2! = 120/2 = 60.",
        whyWrong: {
          b: "That treats the two A's as different. Divide by 2!.",
          c: "That is 4!. There are 5 letters.",
          d: "That divides by 4. Only A repeats, twice: divide by 2!.",
        },
      },
      {
        id: "ma38-7",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-l6-s1-3",
        prompt: "In how many ways can a committee of 3 be chosen from 8 people?",
        options: [
          { id: "a", text: "56" },
          { id: "b", text: "336" },
          { id: "c", text: "24" },
          { id: "d", text: "11" },
        ],
        correct: "a",
        explanation: "⁸C₃ = 8 × 7 × 6 ÷ 3! = 336 ÷ 6 = 56.",
        whyWrong: {
          b: "That is ⁸P₃, which counts orders. A committee has no order.",
          c: "That is 8 × 3.",
          d: "That is 8 + 3.",
        },
      },
      {
        id: "ma38-8",
        type: "mcq",
        difficulty: 3,
        atomId: "a-ma-l6-s1-3",
        prompt: "2 boys are chosen from 5 and 2 girls from 4. In how many ways can this be done?",
        options: [
          { id: "a", text: "60" },
          { id: "b", text: "16" },
          { id: "c", text: "126" },
          { id: "d", text: "20" },
        ],
        correct: "a",
        explanation: "⁵C₂ × ⁴C₂ = 10 × 6 = 60.",
        whyWrong: {
          b: "That adds 10 and 6. Both choices happen together: multiply.",
          c: "That is ⁹C₄, which ignores the 2 boys and 2 girls condition.",
          d: "That is 5 × 4.",
        },
      },
    ],
  },
};

export default ASSESSMENTS;
