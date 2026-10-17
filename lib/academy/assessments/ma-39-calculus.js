/**
 * ASSESSMENTS · MATHEMATICS · MODULE 39 · CALCULUS
 * SERVER ONLY. See ma-01-place-value.js for how these are written.
 */

export const ASSESSMENTS = {
  "ma-l6-c2": {
    lessonId: "ma-l6-c2",
    passMark: 70,
    questions: [
      {
        id: "ma39-1",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-l6-c2-1",
        prompt: "Evaluate the limit as x → 2 of (x² − 4)/(x − 2).",
        options: [
          { id: "a", text: "4" },
          { id: "b", text: "0" },
          { id: "c", text: "2" },
          { id: "d", text: "It does not exist" },
        ],
        correct: "a",
        explanation: "(x − 2)(x + 2)/(x − 2) = x + 2 → 4.",
        whyWrong: {
          b: "0/0 is not 0. Factorise and cancel first.",
          c: "That is the value x approaches. After cancelling, substitute into x + 2.",
          d: "The limit exists: cancel (x − 2), then substitute.",
        },
      },
      {
        id: "ma39-2",
        type: "mcq",
        difficulty: 1,
        atomId: "a-ma-l6-c2-3",
        prompt: "Differentiate y = 4x³ − 3x² + 7.",
        options: [
          { id: "a", text: "12x² − 6x" },
          { id: "b", text: "12x² − 6x + 7" },
          { id: "c", text: "4x² − 3x" },
          { id: "d", text: "12x³ − 6x²" },
        ],
        correct: "a",
        explanation: "4 × 3x² − 3 × 2x + 0 = 12x² − 6x.",
        whyWrong: {
          b: "A constant differentiates to 0.",
          c: "That reduces the powers without bringing them down as multipliers.",
          d: "That brings the powers down but does not reduce them.",
        },
      },
      {
        id: "ma39-3",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-l6-c2-4",
        prompt: "Differentiate y = cos x.",
        options: [
          { id: "a", text: "−sin x" },
          { id: "b", text: "sin x" },
          { id: "c", text: "−cos x" },
          { id: "d", text: "cos x" },
        ],
        correct: "a",
        explanation: "d/dx cos x = −sin x.",
        whyWrong: {
          b: "The derivative of cos x carries a minus sign.",
          c: "Differentiating cos gives sin, not cos.",
          d: "That leaves the function unchanged.",
        },
      },
      {
        id: "ma39-4",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-l6-c2-5",
        prompt: "s = 2t³ − 5t metres. Find the velocity when t = 2.",
        options: [
          { id: "a", text: "19 m/s" },
          { id: "b", text: "6 m/s" },
          { id: "c", text: "24 m/s" },
          { id: "d", text: "7 m/s" },
        ],
        correct: "a",
        explanation: "v = 6t² − 5 = 24 − 5 = 19 m/s.",
        whyWrong: {
          b: "That is the displacement s at t = 2.",
          c: "That is the acceleration 12t at t = 2.",
          d: "That forgets to square t: 6 × 2 − 5.",
        },
      },
      {
        id: "ma39-5",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-l6-c2-6",
        prompt: "Find the minimum value of y = x² − 6x + 11.",
        options: [
          { id: "a", text: "2" },
          { id: "b", text: "3" },
          { id: "c", text: "11" },
          { id: "d", text: "38" },
        ],
        correct: "a",
        explanation: "dy/dx = 2x − 6 = 0 → x = 3. y = 9 − 18 + 11 = 2.",
        whyWrong: {
          b: "That is where the minimum is (x = 3). The minimum VALUE is y.",
          c: "That is y at x = 0, not at the turning point.",
          d: "That substitutes x = −3. dy/dx = 0 gives x = +3.",
        },
      },
    ],
  },

  "ma-l6-c3": {
    lessonId: "ma-l6-c3",
    passMark: 70,
    questions: [
      {
        id: "ma39-6",
        type: "mcq",
        difficulty: 1,
        atomId: "a-ma-l6-c3-1",
        prompt: "Find ∫ (6x² + 4x) dx.",
        options: [
          { id: "a", text: "2x³ + 2x² + c" },
          { id: "b", text: "12x + 4" },
          { id: "c", text: "2x³ + 2x²" },
          { id: "d", text: "6x³ + 4x² + c" },
        ],
        correct: "a",
        explanation: "6x³/3 + 4x²/2 + c = 2x³ + 2x² + c.",
        whyWrong: {
          b: "That differentiates. Integration raises the power.",
          c: "The constant of integration is missing.",
          d: "Raise the power AND divide by the new power.",
        },
      },
      {
        id: "ma39-7",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-l6-c3-2",
        prompt: "Evaluate ∫ from 0 to 2 of 3x² dx.",
        options: [
          { id: "a", text: "8" },
          { id: "b", text: "12" },
          { id: "c", text: "6" },
          { id: "d", text: "24" },
        ],
        correct: "a",
        explanation: "[x³] from 0 to 2 = 8 − 0 = 8.",
        whyWrong: {
          b: "That substitutes into 3x² without integrating.",
          c: "That integrates 3x² as 3x. Raise the power: x³.",
          d: "That uses 3x³: divide by the new power, 3.",
        },
      },
      {
        id: "ma39-8",
        type: "mcq",
        difficulty: 3,
        atomId: "a-ma-l6-c3-3",
        prompt: "Find the area enclosed by y = x² − 1 and the x-axis.",
        options: [
          { id: "a", text: "4/3" },
          { id: "b", text: "−4/3" },
          { id: "c", text: "2/3" },
          { id: "d", text: "2" },
        ],
        correct: "a",
        explanation: "Roots ±1. ∫ from −1 to 1 = [x³/3 − x] = −2/3 − 2/3 = −4/3. Area = 4/3.",
        whyWrong: {
          b: "An area is never negative. The curve is below the axis: take the size.",
          c: "That covers only half the region, from 0 to 1.",
          d: "That is the distance between the roots, not the area.",
        },
      },
      {
        id: "ma39-9",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-l6-c3-4",
        prompt: "Find ∫ sin x dx.",
        options: [
          { id: "a", text: "−cos x + c" },
          { id: "b", text: "cos x + c" },
          { id: "c", text: "−sin x + c" },
          { id: "d", text: "sin x + c" },
        ],
        correct: "a",
        explanation: "d/dx (−cos x) = sin x, so ∫ sin x dx = −cos x + c.",
        whyWrong: {
          b: "d/dx cos x = −sin x. The minus belongs in the answer.",
          c: "Integrating sin gives cos, not sin.",
          d: "That leaves the function unchanged.",
        },
      },
    ],
  },
};

export default ASSESSMENTS;
