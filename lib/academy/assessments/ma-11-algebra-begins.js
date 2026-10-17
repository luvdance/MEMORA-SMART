/**
 * ASSESSMENTS · MATHEMATICS · MODULE 11 · ALGEBRA BEGINS
 * SERVER ONLY. See ma-01-place-value.js for how these are written.
 */

export const ASSESSMENTS = {
  "ma-l1-a1": {
    lessonId: "ma-l1-a1",
    passMark: 70,
    questions: [
      {
        id: "ma11-1",
        type: "mcq",
        difficulty: 1,
        atomId: "a-ma-l1-a1-1",
        prompt: "In 5x² − 3x + 8, what is the coefficient of x?",
        options: [
          { id: "a", text: "3" },
          { id: "b", text: "−3" },
          { id: "c", text: "5" },
          { id: "d", text: "8" },
        ],
        correct: "b",
        explanation: "The x term is −3x. The sign belongs to the term, so the coefficient is −3.",
        whyWrong: {
          a: "The sign in front belongs to the term: the term is −3x.",
          c: "5 is the coefficient of x², a different term.",
          d: "8 is the constant.",
        },
      },
      {
        id: "ma11-2",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-l1-a1-2",
        prompt: "Simplify 6p − 2q + 3 − 4p + 5q − 7.",
        options: [
          { id: "a", text: "2p + 3q − 4" },
          { id: "b", text: "10p + 7q − 10" },
          { id: "c", text: "2p − 3q − 4" },
          { id: "d", text: "1pq" },
        ],
        correct: "a",
        explanation: "p: 6p − 4p = 2p. q: −2q + 5q = 3q. Numbers: 3 − 7 = −4.",
        whyWrong: {
          b: "The signs were dropped: it is −4p, −2q and −7.",
          c: "−2q + 5q = +3q.",
          d: "p terms, q terms and numbers are unlike, so they cannot be combined into one term.",
        },
      },
      {
        id: "ma11-3",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-l1-a1-3",
        prompt: "Find the value of 2a² − 3b when a = −3 and b = 4.",
        options: [
          { id: "a", text: "6" },
          { id: "b", text: "−30" },
          { id: "c", text: "24" },
          { id: "d", text: "30" },
        ],
        correct: "a",
        explanation: "2(−3)² − 3(4) = 2 × 9 − 12 = 18 − 12 = 6.",
        whyWrong: {
          b: "That uses −3² = −9. With brackets, (−3)² = 9.",
          c: "That uses (2 × −3)² = 36, then subtracts 12. Square first, then multiply by 2.",
          d: "That adds 3b instead of subtracting it: 18 + 12.",
        },
      },
      {
        id: "ma11-4",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-l1-a1-4",
        prompt: "Mangoes cost ₦m each. Ade buys 6 mangoes and pays with a ₦1 000 note. Which expression gives his change?",
        options: [
          { id: "a", text: "6m − 1 000" },
          { id: "b", text: "1 000 − 6m" },
          { id: "c", text: "1 000 − m" },
          { id: "d", text: "1 000 + 6m" },
        ],
        correct: "b",
        explanation: "The mangoes cost 6m. Change is what is left from ₦1 000: 1 000 − 6m.",
        whyWrong: {
          a: "That is the wrong way round. Change = money paid − cost.",
          c: "That is the change for one mango. He bought 6.",
          d: "Paying for something reduces the money, so subtract.",
        },
      },
    ],
  },

  "ma-l1-a2": {
    lessonId: "ma-l1-a2",
    passMark: 70,
    questions: [
      {
        id: "ma11-5",
        type: "mcq",
        difficulty: 1,
        atomId: "a-ma-l1-a2-1",
        prompt: "Solve x − 13 = 29.",
        options: [
          { id: "a", text: "x = 16" },
          { id: "b", text: "x = 42" },
          { id: "c", text: "x = −16" },
          { id: "d", text: "x = 377" },
        ],
        correct: "b",
        explanation: "Add 13 to both sides: x = 29 + 13 = 42.",
        whyWrong: {
          a: "That subtracts 13 again. To undo − 13, add 13.",
          c: "That does 13 − 29. Add 13 to both sides.",
          d: "That multiplies. To undo − 13, add 13.",
        },
      },
      {
        id: "ma11-6",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-l1-a2-2",
        prompt: "Solve 4x − 9 = 27.",
        options: [
          { id: "a", text: "x = 4.5" },
          { id: "b", text: "x = 9" },
          { id: "c", text: "x = 18" },
          { id: "d", text: "x = 36" },
        ],
        correct: "b",
        explanation: "+ 9: 4x = 36. ÷ 4: x = 9. Check: 4 × 9 − 9 = 27 ✓.",
        whyWrong: {
          a: "That subtracts 9 instead of adding it: 4x = 18. To undo − 9, add 9.",
          c: "That divides 36 by 2. Divide by the coefficient, 4.",
          d: "That stops at 4x = 36. Divide both sides by 4 to find x.",
        },
      },
      {
        id: "ma11-7",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-l1-a2-2",
        prompt: "Solve x/3 + 5 = 11.",
        options: [
          { id: "a", text: "x = 2" },
          { id: "b", text: "x = 48" },
          { id: "c", text: "x = 18" },
          { id: "d", text: "x = 6" },
        ],
        correct: "c",
        explanation: "− 5: x/3 = 6. × 3: x = 18.",
        whyWrong: {
          a: "That divides 6 by 3. To undo ÷ 3, multiply by 3.",
          b: "That multiplies first: x + 15 = 33. Undo the + 5 first.",
          d: "That stops at x/3 = 6. Multiply both sides by 3.",
        },
      },
      {
        id: "ma11-8",
        type: "mcq",
        difficulty: 3,
        atomId: "a-ma-l1-a2-3",
        prompt: "Three consecutive whole numbers add up to 93. What is the largest?",
        options: [
          { id: "a", text: "30" },
          { id: "b", text: "31" },
          { id: "c", text: "32" },
          { id: "d", text: "33" },
        ],
        correct: "c",
        explanation: "Let them be n, n + 1, n + 2. 3n + 3 = 93, so 3n = 90 and n = 30. The largest is n + 2 = 32.",
        whyWrong: {
          a: "30 is the smallest. The question asks for the largest.",
          b: "31 is the middle one, 93 ÷ 3. The largest is one more.",
          d: "33 would need 31 + 32 + 33 = 96.",
        },
      },
    ],
  },
};

export default ASSESSMENTS;
