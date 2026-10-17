/**
 * ASSESSMENTS · MATHEMATICS · MODULE 33 · CIRCLE THEOREMS
 * SERVER ONLY. See ma-01-place-value.js for how these are written.
 */

export const ASSESSMENTS = {
  "ma-l5-g1": {
    lessonId: "ma-l5-g1",
    passMark: 70,
    questions: [
      {
        id: "ma33-1",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-l5-g1-1",
        prompt: "A chord of length 24 cm is in a circle of radius 13 cm. How far is the chord from the centre?",
        options: [
          { id: "a", text: "5 cm" },
          { id: "b", text: "12 cm" },
          { id: "c", text: "17.7 cm" },
          { id: "d", text: "1 cm" },
        ],
        correct: "a",
        explanation: "Half-chord = 12. d² = 13² − 12² = 169 − 144 = 25, so d = 5 cm.",
        whyWrong: {
          b: "That is half the chord, not the distance from the centre.",
          c: "That adds the squares. The radius is the hypotenuse: subtract.",
          d: "That subtracts the lengths, 13 − 12. Subtract the SQUARES, then take the root.",
        },
      },
      {
        id: "ma33-2",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-l5-g1-2",
        prompt: "An arc subtends 38° at a point on the circumference. What angle does it subtend at the centre?",
        options: [
          { id: "a", text: "76°" },
          { id: "b", text: "19°" },
          { id: "c", text: "142°" },
          { id: "d", text: "38°" },
        ],
        correct: "a",
        explanation: "The angle at the centre is twice the angle at the circumference: 2 × 38° = 76°.",
        whyWrong: {
          b: "That halves it. The centre angle is the BIGGER one.",
          c: "That is 180 − 38. The rule is doubling.",
          d: "Equal angles are for two angles at the circumference on the same arc.",
        },
      },
      {
        id: "ma33-3",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-l5-g1-5",
        prompt: "PQRS is a cyclic quadrilateral with angle P = 72°. Find angle R.",
        options: [
          { id: "a", text: "108°" },
          { id: "b", text: "72°" },
          { id: "c", text: "288°" },
          { id: "d", text: "18°" },
        ],
        correct: "a",
        explanation: "Opposite angles of a cyclic quadrilateral add to 180°: R = 180 − 72 = 108°.",
        whyWrong: {
          b: "Opposite angles are supplementary, not equal.",
          c: "That subtracts from 360°. Opposite angles add to 180°.",
          d: "That subtracts from 90°.",
        },
      },
      {
        id: "ma33-4",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-l5-g1-6",
        prompt: "P is 10 cm from the centre O of a circle of radius 6 cm. A tangent from P touches the circle at T. Find PT.",
        options: [
          { id: "a", text: "8 cm" },
          { id: "b", text: "11.7 cm" },
          { id: "c", text: "4 cm" },
          { id: "d", text: "16 cm" },
        ],
        correct: "a",
        explanation: "Angle OTP = 90° (tangent ⊥ radius). PT² = 10² − 6² = 64, so PT = 8 cm.",
        whyWrong: {
          b: "That adds the squares. OP is the hypotenuse: subtract.",
          c: "That subtracts the lengths, 10 − 6.",
          d: "That adds the lengths, 10 + 6.",
        },
      },
      {
        id: "ma33-5",
        type: "mcq",
        difficulty: 3,
        atomId: "a-ma-l5-g1-8",
        prompt: "Chords AB and CD meet at X. AX = 8 cm, XB = 3 cm and CX = 4 cm. Find XD.",
        options: [
          { id: "a", text: "6 cm" },
          { id: "b", text: "7 cm" },
          { id: "c", text: "1.5 cm" },
          { id: "d", text: "32/3 cm" },
        ],
        correct: "a",
        explanation: "AX × XB = CX × XD: 8 × 3 = 4 × XD, so XD = 24 ÷ 4 = 6 cm.",
        whyWrong: {
          b: "That sets the sums equal: 8 + 3 = 4 + XD. It is the products.",
          c: "That pairs the wrong parts: 4 × 3 ÷ 8. Pair the two parts of the SAME chord.",
          d: "That pairs the wrong parts: 8 × 4 ÷ 3.",
        },
      },
    ],
  },
};

export default ASSESSMENTS;
