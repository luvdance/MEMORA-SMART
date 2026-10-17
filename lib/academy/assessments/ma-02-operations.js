/**
 * ASSESSMENTS · MATHEMATICS · MODULE 2 · THE FOUR OPERATIONS
 * SERVER ONLY. See ma-01-place-value.js for how these are written.
 */

export const ASSESSMENTS = {
  "ma-l0-n2": {
    lessonId: "ma-l0-n2",
    passMark: 70,
    questions: [
      {
        id: "ma02-1",
        type: "mcq",
        difficulty: 1,
        atomId: "a-ma-l0-n2-1",
        prompt: "What is 8 × 7?",
        options: [
          { id: "a", text: "54" },
          { id: "b", text: "56" },
          { id: "c", text: "63" },
          { id: "d", text: "15" },
        ],
        correct: "b",
        explanation: "8 × 7 = 56. Shortcut: 8 × 7 is double 4 × 7 = double 28 = 56.",
        whyWrong: {
          a: "54 is 6 × 9. 8 × 7 is 56.",
          c: "63 is 9 × 7, one seven too many.",
          d: "15 is 8 + 7. The sign is ×, not +.",
        },
      },
      {
        id: "ma02-2",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-l0-n2-2",
        prompt: "Work out 245 × 36.",
        options: [
          { id: "a", text: "2 205" },
          { id: "b", text: "8 820" },
          { id: "c", text: "8 720" },
          { id: "d", text: "7 350" },
        ],
        correct: "b",
        explanation: "245 × 6 = 1 470 and 245 × 30 = 7 350. 1 470 + 7 350 = 8 820.",
        whyWrong: {
          a: "That is 1 470 + 735: the zero was left off the tens row. 245 × 3 tens is 7 350, not 735.",
          c: "A carrying slip in the addition. 7 350 + 1 470 = 8 820.",
          d: "That is only the tens row, 245 × 30. The ones row, 245 × 6 = 1 470, still has to be added.",
        },
      },
      {
        id: "ma02-3",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-l0-n2-3",
        prompt: "A school has 230 pupils going on a trip. Each bus holds 45 pupils. How many buses are needed?",
        options: [
          { id: "a", text: "5" },
          { id: "b", text: "5 remainder 5" },
          { id: "c", text: "6" },
          { id: "d", text: "5.1" },
        ],
        correct: "c",
        explanation: "230 ÷ 45 = 5 remainder 5. Five buses carry 225 pupils and 5 are left over, so one more bus is needed: 6 buses.",
        whyWrong: {
          a: "Five buses carry 225. Five pupils would be left behind.",
          b: "That is the division, not the answer. You cannot hire part of a bus, so round up.",
          d: "A remainder of 5 is not 0.1 of a bus, and the answer must be a whole number of buses.",
        },
      },
      {
        id: "ma02-4",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-l0-n2-4",
        prompt: "Evaluate 5 + 3 × 4 − 2.",
        options: [
          { id: "a", text: "30" },
          { id: "b", text: "15" },
          { id: "c", text: "17" },
          { id: "d", text: "11" },
        ],
        correct: "b",
        explanation: "Multiply first: 3 × 4 = 12. Then 5 + 12 − 2 = 15.",
        whyWrong: {
          a: "That works left to right: (5 + 3) × 4 − 2. Multiplication comes before addition.",
          c: "That stops at 5 + 12. The − 2 still has to be done.",
          d: "That works out 4 − 2 first, as if it were in brackets: 5 + 3 × 2 = 11. With no brackets, multiply first.",
        },
      },
      {
        id: "ma02-5",
        type: "mcq",
        difficulty: 3,
        atomId: "a-ma-l0-n2-4",
        prompt: "Evaluate 24 ÷ 4 × 2 + 3².",
        options: [
          { id: "a", text: "12" },
          { id: "b", text: "18" },
          { id: "c", text: "66" },
          { id: "d", text: "21" },
        ],
        correct: "d",
        explanation: "Order first: 3² = 9. Then ÷ and × left to right: 24 ÷ 4 = 6, 6 × 2 = 12. Then 12 + 9 = 21.",
        whyWrong: {
          a: "That stops at 24 ÷ 4 × 2 = 12. The 3² = 9 still has to be added.",
          b: "That uses 3 × 2 = 6 for 3². A square means 3 × 3 = 9.",
          c: "That adds 2 + 9 before multiplying: 6 × 11 = 66. Multiplication comes before addition: 6 × 2 = 12, then 12 + 9 = 21.",
        },
      },
    ],
  },
};

export default ASSESSMENTS;
