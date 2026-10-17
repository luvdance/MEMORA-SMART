/**
 * ASSESSMENTS · MATHEMATICS · MODULE 15 · COMMERCIAL ARITHMETIC AND BINARY MULTIPLICATION
 * SERVER ONLY. See ma-01-place-value.js for how these are written.
 */

export const ASSESSMENTS = {
  "ma-l2-n2": {
    lessonId: "ma-l2-n2",
    passMark: 70,
    questions: [
      {
        id: "ma15-1",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-l2-n2-1",
        prompt: "A trader buys a radio for ₦8 000 and sells it for ₦6 800. Find the loss per cent.",
        options: [
          { id: "a", text: "15%" },
          { id: "b", text: "17.6%" },
          { id: "c", text: "1 200%" },
          { id: "d", text: "85%" },
        ],
        correct: "a",
        explanation: "Loss = 8 000 − 6 800 = 1 200. Loss % = 1 200 ÷ 8 000 × 100 = 15%.",
        whyWrong: {
          b: "That divides by the selling price. Loss per cent is on the cost price.",
          c: "1 200 is the loss in naira, not a percentage.",
          d: "That is the selling price as a percentage of the cost price.",
        },
      },
      {
        id: "ma15-2",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-l2-n2-2",
        prompt: "Find the simple interest on ₦60 000 for 2 years 6 months at 10% per annum.",
        options: [
          { id: "a", text: "₦15 000" },
          { id: "b", text: "₦12 000" },
          { id: "c", text: "₦75 000" },
          { id: "d", text: "₦156 000" },
        ],
        correct: "a",
        explanation: "T = 2.5 years. I = 60 000 × 10 × 2.5 ÷ 100 = ₦15 000.",
        whyWrong: {
          b: "That uses 2 years and ignores the 6 months.",
          c: "That is the amount, principal plus interest.",
          d: "That uses T = 26. 2 years 6 months is 2.5 years.",
        },
      },
      {
        id: "ma15-3",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-l2-n2-2",
        prompt: "At what rate per cent per annum will ₦40 000 earn ₦9 600 simple interest in 3 years?",
        options: [
          { id: "a", text: "24%" },
          { id: "b", text: "8%" },
          { id: "c", text: "12%" },
          { id: "d", text: "0.08%" },
        ],
        correct: "b",
        explanation: "R = 100I/(PT) = 100 × 9 600 ÷ (40 000 × 3) = 8%.",
        whyWrong: {
          a: "That forgets to divide by the time, 3 years.",
          c: "That uses 2 years instead of 3: 960 000 ÷ 80 000 = 12.",
          d: "That forgets the 100 in R = 100I/(PT).",
        },
      },
      {
        id: "ma15-4",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-l2-n2-3",
        prompt: "A shirt marked ₦7 500 is sold at a 12% discount. What does the customer pay?",
        options: [
          { id: "a", text: "₦900" },
          { id: "b", text: "₦6 600" },
          { id: "c", text: "₦7 488" },
          { id: "d", text: "₦8 400" },
        ],
        correct: "b",
        explanation: "Discount = 12% of 7 500 = 900. Pays 7 500 − 900 = ₦6 600.",
        whyWrong: {
          a: "That is the discount, not the price paid.",
          c: "That takes ₦12 off, not 12%.",
          d: "A discount is subtracted, not added.",
        },
      },
      {
        id: "ma15-5",
        type: "mcq",
        difficulty: 3,
        atomId: "a-ma-l2-n2-4",
        prompt: "A generator is sold for ₦96 000 at a profit of 20%. What was its cost price?",
        options: [
          { id: "a", text: "₦76 800" },
          { id: "b", text: "₦80 000" },
          { id: "c", text: "₦115 200" },
          { id: "d", text: "₦19 200" },
        ],
        correct: "b",
        explanation: "96 000 is 120% of the cost price. C.P. = 96 000 × 100 ÷ 120 = ₦80 000.",
        whyWrong: {
          a: "That takes 20% off the selling price. The 20% was of the cost price.",
          c: "That adds 20% to the selling price.",
          d: "That is 20% of the selling price.",
        },
      },
    ],
  },

  "ma-l2-n4": {
    lessonId: "ma-l2-n4",
    passMark: 70,
    questions: [
      {
        id: "ma15-6",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-l2-n4-1",
        prompt: "Work out 111₂ × 101₂.",
        options: [
          { id: "a", text: "100011₂" },
          { id: "b", text: "11211₂" },
          { id: "c", text: "35₂" },
          { id: "d", text: "110011₂" },
        ],
        correct: "a",
        explanation: "111₂ = 7 and 101₂ = 5. 7 × 5 = 35 = 32 + 2 + 1 = 100011₂.",
        whyWrong: {
          b: "That multiplies as in base ten. Base two has no digit 2.",
          c: "35 is the base ten answer. Convert it: 100011₂.",
          d: "110011₂ = 51. A carry went wrong: the answer is 35.",
        },
      },
      {
        id: "ma15-7",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-l2-n4-2",
        prompt: "Convert 10111₂ to base 3.",
        options: [
          { id: "a", text: "212₃" },
          { id: "b", text: "23₃" },
          { id: "c", text: "221₃" },
          { id: "d", text: "211₃" },
        ],
        correct: "a",
        explanation: "10111₂ = 16 + 4 + 2 + 1 = 23. 23 ÷ 3 = 7 r 2, 7 ÷ 3 = 2 r 1, 2 ÷ 3 = 0 r 2. Bottom up: 212₃.",
        whyWrong: {
          b: "23 is the base ten value. Convert it on to base 3.",
          c: "221₃ = 18 + 6 + 1 = 25. Check the base ten value: 23.",
          d: "211₃ = 18 + 3 + 1 = 22, one too few. The first remainder is 23 ÷ 3 = 7 r 2.",
        },
      },
      {
        id: "ma15-8",
        type: "mcq",
        difficulty: 1,
        atomId: "a-ma-l2-n4-1",
        prompt: "What is 1011₂ × 10₂?",
        options: [
          { id: "a", text: "10110₂" },
          { id: "b", text: "1013₂" },
          { id: "c", text: "2022₂" },
          { id: "d", text: "1011₂" },
        ],
        correct: "a",
        explanation: "Multiplying by 10₂ (which is 2) shifts every digit one place left, like × 10 in base ten: 10110₂.",
        whyWrong: {
          b: "There is no digit 3 in base two.",
          c: "That doubles each digit as in base ten. In base two, × 2 shifts the digits left.",
          d: "That multiplies by 1, not by 10₂ = 2.",
        },
      },
      {
        id: "ma15-9",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-l2-n4-2",
        prompt: "Convert 111100₂ to base 8.",
        options: [
          { id: "a", text: "74₈" },
          { id: "b", text: "60₈" },
          { id: "c", text: "47₈" },
          { id: "d", text: "111₈" },
        ],
        correct: "a",
        explanation: "111100₂ = 32 + 16 + 8 + 4 = 60. 60 ÷ 8 = 7 r 4, 7 ÷ 8 = 0 r 7. Bottom up: 74₈.",
        whyWrong: {
          b: "60 is the base ten value. Convert it on to base 8.",
          c: "Those are the remainders read top down. Read from the bottom up: 74.",
          d: "111₈ = 64 + 8 + 1 = 73. Find the base ten value first: 60.",
        },
      },
    ],
  },
};

export default ASSESSMENTS;
