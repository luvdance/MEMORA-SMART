/**
 * ASSESSMENTS · MATHEMATICS · MODULE 26 · LOGARITHMS AND SURDS
 * SERVER ONLY. See ma-01-place-value.js for how these are written.
 */

export const ASSESSMENTS = {
  "ma-l4-n3": {
    lessonId: "ma-l4-n3",
    passMark: 70,
    questions: [
      {
        id: "ma26-1",
        type: "mcq",
        difficulty: 1,
        atomId: "a-ma-l4-n3-1",
        prompt: "Evaluate log₃ 81.",
        options: [
          { id: "a", text: "27" },
          { id: "b", text: "4" },
          { id: "c", text: "3" },
          { id: "d", text: "9" },
        ],
        correct: "b",
        explanation: "3⁴ = 81, so log₃ 81 = 4.",
        whyWrong: {
          a: "That divides 81 by 3. A logarithm is a POWER.",
          c: "3³ = 27, not 81.",
          d: "9 is √81. The question asks for the power of 3.",
        },
      },
      {
        id: "ma26-2",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-l4-n3-2",
        prompt: "Simplify log 8 + log 125 without tables.",
        options: [
          { id: "a", text: "log 133" },
          { id: "b", text: "3" },
          { id: "c", text: "1000" },
          { id: "d", text: "2" },
        ],
        correct: "b",
        explanation: "log 8 + log 125 = log (8 × 125) = log 1 000 = 3.",
        whyWrong: {
          a: "Adding logs MULTIPLIES the numbers: log (8 × 125), not log (8 + 125).",
          c: "log 1 000 = 3. 1 000 is the number, not its logarithm.",
          d: "log 1 000 is 3, since 10³ = 1 000.",
        },
      },
      {
        id: "ma26-3",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-l4-n3-4",
        prompt: "Evaluate log₉ 27.",
        options: [
          { id: "a", text: "2/3" },
          { id: "b", text: "3" },
          { id: "c", text: "3/2" },
          { id: "d", text: "18" },
        ],
        correct: "c",
        explanation: "9 = 3² and 27 = 3³. log₉ 27 = log 27/log 9 = 3 log 3 / 2 log 3 = 3/2.",
        whyWrong: {
          a: "That is log₂₇ 9, upside down. The number goes on top: log 27 / log 9.",
          b: "9³ = 729, not 27.",
          d: "That subtracts. Write both as powers of 3.",
        },
      },
      {
        id: "ma26-4",
        type: "mcq",
        difficulty: 3,
        atomId: "a-ma-l4-n3-5",
        prompt: "Solve log₂ (x + 3) + log₂ (x − 3) = 4.",
        options: [
          { id: "a", text: "x = 5" },
          { id: "b", text: "x = ±5" },
          { id: "c", text: "x = 25" },
          { id: "d", text: "x = 8" },
        ],
        correct: "a",
        explanation: "log₂ (x + 3)(x − 3) = 4, so x² − 9 = 16, x² = 25, x = ±5. Reject −5 (log of a negative), so x = 5.",
        whyWrong: {
          b: "x = −5 makes x − 3 negative, and the log of a negative number is undefined.",
          c: "That is x². Take the square root.",
          d: "That treats log₂ (x + 3) + log₂ (x − 3) as log₂ 2x. Combine to log₂ (x² − 9).",
        },
      },
    ],
  },

  "ma-l4-n4": {
    lessonId: "ma-l4-n4",
    passMark: 70,
    questions: [
      {
        id: "ma26-5",
        type: "mcq",
        difficulty: 1,
        atomId: "a-ma-l4-n4-1",
        prompt: "Simplify √98.",
        options: [
          { id: "a", text: "7√2" },
          { id: "b", text: "2√7" },
          { id: "c", text: "49√2" },
          { id: "d", text: "9.9" },
        ],
        correct: "a",
        explanation: "98 = 49 × 2, so √98 = √49 × √2 = 7√2.",
        whyWrong: {
          b: "That is √28. Take the square factor 49 outside: √49 = 7.",
          c: "√49 = 7, not 49.",
          d: "That is a rounded decimal. Leave it as an exact surd.",
        },
      },
      {
        id: "ma26-6",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-l4-n4-2",
        prompt: "Simplify √75 − √12.",
        options: [
          { id: "a", text: "√63" },
          { id: "b", text: "3√3" },
          { id: "c", text: "7√3" },
          { id: "d", text: "3" },
        ],
        correct: "b",
        explanation: "√75 = 5√3 and √12 = 2√3. 5√3 − 2√3 = 3√3.",
        whyWrong: {
          a: "√a − √b is not √(a − b). Simplify each surd first.",
          c: "That ADDS them: 5√3 + 2√3. The sign is minus.",
          d: "The √3 does not disappear: 5√3 − 2√3 = 3√3.",
        },
      },
      {
        id: "ma26-7",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-l4-n4-3",
        prompt: "Simplify (5 + √3)(5 − √3).",
        options: [
          { id: "a", text: "22" },
          { id: "b", text: "28" },
          { id: "c", text: "25 − √3" },
          { id: "d", text: "22 − 10√3" },
        ],
        correct: "a",
        explanation: "(a + b)(a − b) = a² − b² = 25 − 3 = 22.",
        whyWrong: {
          b: "(√3)² = 3 is SUBTRACTED: 25 − 3.",
          c: "(√3)² = 3, not √3.",
          d: "The middle terms +5√3 and −5√3 cancel.",
        },
      },
      {
        id: "ma26-8",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-l4-n4-4",
        prompt: "Rationalise the denominator of 10/√5.",
        options: [
          { id: "a", text: "2√5" },
          { id: "b", text: "10√5" },
          { id: "c", text: "2" },
          { id: "d", text: "√50" },
        ],
        correct: "a",
        explanation: "10/√5 × √5/√5 = 10√5/5 = 2√5.",
        whyWrong: {
          b: "After multiplying by √5/√5, the bottom is 5: divide by it.",
          c: "That cancels √5 with 5, which are not equal.",
          d: "√50 = 5√2, a different value.",
        },
      },
    ],
  },
};

export default ASSESSMENTS;
