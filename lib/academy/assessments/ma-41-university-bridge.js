/**
 * ASSESSMENTS · MATHEMATICS · MODULE 41 · THE UNIVERSITY BRIDGE
 * SERVER ONLY. See ma-01-place-value.js for how these are written.
 */

export const ASSESSMENTS = {
  "ma-l6-u1": {
    lessonId: "ma-l6-u1",
    passMark: 70,
    questions: [
      {
        id: "ma41-1",
        type: "mcq",
        difficulty: 1,
        atomId: "a-ma-l6-u1-1",
        prompt: "Find the domain of f(x) = √(x − 5) over the real numbers.",
        options: [
          { id: "a", text: "x ≥ 5" },
          { id: "b", text: "x ≥ −5" },
          { id: "c", text: "x > 5" },
          { id: "d", text: "All real x" },
        ],
        correct: "a",
        explanation: "Need x − 5 ≥ 0, so x ≥ 5. √0 = 0 is allowed.",
        whyWrong: {
          b: "x − 5 ≥ 0 gives x ≥ +5.",
          c: "x = 5 gives √0 = 0, which is fine: include it.",
          d: "x below 5 gives the square root of a negative.",
        },
      },
      {
        id: "ma41-2",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-l6-u1-2",
        prompt: "f(x) = 3x − 1 and g(x) = x + 2. Find fg(x), meaning f(g(x)).",
        options: [
          { id: "a", text: "3x + 5" },
          { id: "b", text: "3x + 1" },
          { id: "c", text: "3x² + 5x − 2" },
          { id: "d", text: "4x + 1" },
        ],
        correct: "a",
        explanation: "f(x + 2) = 3(x + 2) − 1 = 3x + 5.",
        whyWrong: {
          b: "That is gf(x) = (3x − 1) + 2. In fg, g acts first.",
          c: "That multiplies f and g. Composition substitutes one into the other.",
          d: "That adds f and g.",
        },
      },
      {
        id: "ma41-3",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-l6-u1-2",
        prompt: "Find the inverse of f(x) = 4x + 3.",
        options: [
          { id: "a", text: "(x − 3)/4" },
          { id: "b", text: "1/(4x + 3)" },
          { id: "c", text: "x/4 − 3" },
          { id: "d", text: "(x + 3)/4" },
        ],
        correct: "a",
        explanation: "y = 4x + 3 → x = (y − 3)/4 → f⁻¹(x) = (x − 3)/4.",
        whyWrong: {
          b: "f⁻¹ is the inverse FUNCTION, not the reciprocal.",
          c: "Undo in reverse order: subtract 3 first, then divide by 4.",
          d: "Undoing + 3 means subtracting 3.",
        },
      },
      {
        id: "ma41-4",
        type: "mcq",
        difficulty: 3,
        atomId: "a-ma-l6-u1-3",
        prompt: "Find the coefficient of x² in the expansion of (1 + 3x)⁵.",
        options: [
          { id: "a", text: "90" },
          { id: "b", text: "30" },
          { id: "c", text: "15" },
          { id: "d", text: "10" },
        ],
        correct: "a",
        explanation: "⁵C₂ (3x)² = 10 × 9x² = 90x².",
        whyWrong: {
          b: "That uses 3 instead of 3² = 9.",
          c: "That is 5 × 3.",
          d: "That is ⁵C₂ alone; multiply by 3².",
        },
      },
      {
        id: "ma41-5",
        type: "mcq",
        difficulty: 3,
        atomId: "a-ma-l6-u1-4",
        prompt: "(5x + 1)/((x − 1)(x + 2)) = A/(x − 1) + B/(x + 2). Find A and B.",
        options: [
          { id: "a", text: "A = 2, B = 3" },
          { id: "b", text: "A = 3, B = 2" },
          { id: "c", text: "A = 6, B = 9" },
          { id: "d", text: "A = −2, B = −3" },
        ],
        correct: "a",
        explanation: "5x + 1 = A(x + 2) + B(x − 1). x = 1: 6 = 3A → A = 2. x = −2: −9 = −3B → B = 3.",
        whyWrong: {
          b: "A belongs over (x − 1): find it by putting x = 1.",
          c: "Those are 3A and −3B. Divide to get A and B.",
          d: "Check the signs: −9 = −3B gives B = +3.",
        },
      },
    ],
  },

  "ma-l6-u2": {
    lessonId: "ma-l6-u2",
    passMark: 70,
    questions: [
      {
        id: "ma41-6",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-l6-u2-1",
        prompt: "Claim: n² − n + 11 is prime for every whole number n ≥ 1. Which n is a counterexample?",
        options: [
          { id: "a", text: "11" },
          { id: "b", text: "3" },
          { id: "c", text: "5" },
          { id: "d", text: "10" },
        ],
        correct: "a",
        explanation: "n = 11: 121 − 11 + 11 = 121 = 11 × 11, not prime.",
        whyWrong: {
          b: "n = 3 gives 17, which is prime.",
          c: "n = 5 gives 31, which is prime.",
          d: "n = 10 gives 101, which is prime.",
        },
      },
      {
        id: "ma41-7",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-l6-u2-3",
        prompt: "What is the first step of a proof by induction?",
        options: [
          { id: "a", text: "Show the statement is true for n = 1" },
          { id: "b", text: "Assume the statement is true for every n" },
          { id: "c", text: "Check n = 1, 2 and 3, then conclude" },
          { id: "d", text: "Assume it is true for n = k + 1" },
        ],
        correct: "a",
        explanation: "The base case comes first; then assume for k and prove for k + 1.",
        whyWrong: {
          b: "That assumes what you are trying to prove.",
          c: "Checking cases is evidence, not proof.",
          d: "You assume for k and PROVE for k + 1.",
        },
      },
      {
        id: "ma41-8",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-l6-u2-4",
        prompt: "Convert 240° to radians.",
        options: [
          { id: "a", text: "4π/3" },
          { id: "b", text: "3π/4" },
          { id: "c", text: "2π/3" },
          { id: "d", text: "4π/5" },
        ],
        correct: "a",
        explanation: "240 × π/180 = 4π/3.",
        whyWrong: {
          b: "That is 180/240 × π, upside down. Multiply by π/180.",
          c: "That is 120°.",
          d: "That is 144°.",
        },
      },
      {
        id: "ma41-9",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-l6-u2-5",
        prompt: "x is acute and cos x = 8/17. Find sin x.",
        options: [
          { id: "a", text: "15/17" },
          { id: "b", text: "8/15" },
          { id: "c", text: "9/17" },
          { id: "d", text: "17/15" },
        ],
        correct: "a",
        explanation: "sin²x = 1 − 64/289 = 225/289, so sin x = 15/17.",
        whyWrong: {
          b: "That is tan x upside down. sin = opposite/hypotenuse.",
          c: "That is 1 − cos x. The identity uses squares.",
          d: "sin x cannot be more than 1.",
        },
      },
      {
        id: "ma41-10",
        type: "mcq",
        difficulty: 3,
        atomId: "a-ma-l6-u2-6",
        prompt: "Find (3 + 2i)(1 + 4i).",
        options: [
          { id: "a", text: "−5 + 14i" },
          { id: "b", text: "11 + 14i" },
          { id: "c", text: "3 + 8i" },
          { id: "d", text: "4 + 6i" },
        ],
        correct: "a",
        explanation: "3 + 12i + 2i + 8i² = 3 + 14i − 8 = −5 + 14i.",
        whyWrong: {
          b: "That treats i² as +1. i² = −1.",
          c: "That multiplies only the real parts and only the imaginary parts.",
          d: "That adds them.",
        },
      },
    ],
  },
};

export default ASSESSMENTS;
