/**
 * ASSESSMENTS · MATHEMATICS · MODULE 25 · NUMBER BASES IN FULL AND MODULAR ARITHMETIC
 * SERVER ONLY. See ma-01-place-value.js for how these are written.
 */

export const ASSESSMENTS = {
  "ma-l4-n1": {
    lessonId: "ma-l4-n1",
    passMark: 70,
    questions: [
      {
        id: "ma25-1",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-l4-n1-1",
        prompt: "Convert 110.01₂ to base ten.",
        options: [
          { id: "a", text: "6.01" },
          { id: "b", text: "6.25" },
          { id: "c", text: "6.5" },
          { id: "d", text: "3.25" },
        ],
        correct: "b",
        explanation: "110₂ = 6. After the point: 0 × 1/2 + 1 × 1/4 = 0.25. Total 6.25.",
        whyWrong: {
          a: "The places after the point are halves and quarters, not tenths and hundredths.",
          c: "The 1 is in the quarters place (second after the point), not the halves place.",
          d: "110₂ = 4 + 2 = 6, not 3.",
        },
      },
      {
        id: "ma25-2",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-l4-n1-2",
        prompt: "Find the digit y if 3y2₄ = 58.",
        options: [
          { id: "a", text: "y = 2" },
          { id: "b", text: "y = 1" },
          { id: "c", text: "y = 4" },
          { id: "d", text: "y = 8" },
        ],
        correct: "a",
        explanation: "3 × 16 + 4y + 2 = 58, so 50 + 4y = 58, 4y = 8 and y = 2.",
        whyWrong: {
          b: "Check: 3 × 16 + 4 × 1 + 2 = 54, not 58.",
          c: "A digit in base 4 can only be 0, 1, 2 or 3.",
          d: "That stops at 4y = 8. Divide by 4.",
        },
      },
      {
        id: "ma25-3",
        type: "mcq",
        difficulty: 3,
        atomId: "a-ma-l4-n1-2",
        prompt: "Find the base b in which 43 + 25 = 101.",
        options: [
          { id: "a", text: "b = 7" },
          { id: "b", text: "b = 8" },
          { id: "c", text: "b = 6" },
          { id: "d", text: "b = 10" },
        ],
        correct: "a",
        explanation: "(4b + 3) + (2b + 5) = b² + 1, so b² − 6b − 7 = 0, (b − 7)(b + 1) = 0, and b = 7.",
        whyWrong: {
          b: "In base 8: 43₈ + 25₈ = 35 + 21 = 56, but 101₈ = 65.",
          c: "In base 6: 43₆ + 25₆ = 27 + 17 = 44, but 101₆ = 37.",
          d: "In base ten 43 + 25 = 68, not 101.",
        },
      },
      {
        id: "ma25-8",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-l4-n1-1",
        prompt: "Convert 0.75 (base ten) to base two.",
        options: [
          { id: "a", text: "0.11₂" },
          { id: "b", text: "0.75₂" },
          { id: "c", text: "0.101₂" },
          { id: "d", text: "0.01₂" },
        ],
        correct: "a",
        explanation: "0.75 × 2 = 1.5 → digit 1; 0.5 × 2 = 1.0 → digit 1. So 0.75 = 0.11₂ (1/2 + 1/4).",
        whyWrong: {
          b: "Base two uses only the digits 0 and 1.",
          c: "0.101₂ = 1/2 + 1/8 = 0.625.",
          d: "0.01₂ = 1/4 = 0.25.",
        },
      },
    ],
  },

  "ma-l4-n2": {
    lessonId: "ma-l4-n2",
    passMark: 70,
    questions: [
      {
        id: "ma25-4",
        type: "mcq",
        difficulty: 1,
        atomId: "a-ma-l4-n2-1",
        prompt: "Find 53 mod 6.",
        options: [
          { id: "a", text: "8" },
          { id: "b", text: "5" },
          { id: "c", text: "53" },
          { id: "d", text: "−1" },
        ],
        correct: "b",
        explanation: "53 = 8 × 6 + 5, so 53 ≡ 5 (mod 6).",
        whyWrong: {
          a: "8 is the quotient. mod gives the REMAINDER.",
          c: "Reduce it: the answer must be 0 to 5.",
          d: "A remainder mod 6 is between 0 and 5, never negative.",
        },
      },
      {
        id: "ma25-5",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-l4-n2-2",
        prompt: "Work out 4 − 9 (mod 7).",
        options: [
          { id: "a", text: "−5" },
          { id: "b", text: "2" },
          { id: "c", text: "5" },
          { id: "d", text: "6" },
        ],
        correct: "b",
        explanation: "4 − 9 = −5. Add 7: −5 + 7 = 2.",
        whyWrong: {
          a: "Reduce it: in mod 7 the answer must be 0 to 6. Add 7.",
          c: "That is 9 − 4. The calculation is 4 − 9.",
          d: "−5 + 7 = 2, not 6.",
        },
      },
      {
        id: "ma25-6",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-l4-n2-3",
        prompt: "Work out 7 × 8 (mod 9).",
        options: [
          { id: "a", text: "2" },
          { id: "b", text: "56" },
          { id: "c", text: "6" },
          { id: "d", text: "15" },
        ],
        correct: "a",
        explanation: "7 × 8 = 56 = 6 × 9 + 2, so 56 ≡ 2 (mod 9).",
        whyWrong: {
          b: "Reduce it mod 9.",
          c: "6 is the quotient, 56 ÷ 9. The remainder is 2.",
          d: "That adds 7 + 8. The operation is ×.",
        },
      },
      {
        id: "ma25-7",
        type: "mcq",
        difficulty: 3,
        atomId: "a-ma-l4-n2-4",
        prompt: "Today is Afor in the four-day market week (Eke, Orie, Afor, Nkwo). Which day will it be in 50 days?",
        options: [
          { id: "a", text: "Eke" },
          { id: "b", text: "Orie" },
          { id: "c", text: "Afor" },
          { id: "d", text: "Nkwo" },
        ],
        correct: "a",
        explanation: "50 = 12 × 4 + 2. Two days after Afor: Nkwo, then Eke.",
        whyWrong: {
          b: "That counts three days on. 50 mod 4 = 2.",
          c: "That would need 50 to be a multiple of 4. It leaves remainder 2.",
          d: "That counts only one day on. 50 mod 4 = 2.",
        },
      },
    ],
  },
};

export default ASSESSMENTS;
