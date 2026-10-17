/**
 * ASSESSMENTS · MATHEMATICS · MODULE 8 · FRACTIONS: ALL FOUR OPERATIONS
 * SERVER ONLY. See ma-01-place-value.js for how these are written.
 */

export const ASSESSMENTS = {
  "ma-l1-n3": {
    lessonId: "ma-l1-n3",
    passMark: 70,
    questions: [
      {
        id: "ma08-1",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-l1-n3-1",
        prompt: "Work out 3/5 + 1/3.",
        options: [
          { id: "a", text: "4/8" },
          { id: "b", text: "14/15" },
          { id: "c", text: "4/15" },
          { id: "d", text: "1/2" },
        ],
        correct: "b",
        explanation: "LCM(5, 3) = 15. 3/5 = 9/15 and 1/3 = 5/15. 9/15 + 5/15 = 14/15.",
        whyWrong: {
          a: "That adds the tops and the bottoms. Use a common denominator first.",
          c: "The denominator is right but the numerators were not converted: 3/5 = 9/15 and 1/3 = 5/15.",
          d: "That is 4/8 simplified, which comes from adding tops and bottoms.",
        },
      },
      {
        id: "ma08-2",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-l1-n3-1",
        prompt: "Work out 7/8 − 1/6.",
        options: [
          { id: "a", text: "6/2" },
          { id: "b", text: "17/24" },
          { id: "c", text: "6/24" },
          { id: "d", text: "3/4" },
        ],
        correct: "b",
        explanation: "LCM(8, 6) = 24. 7/8 = 21/24 and 1/6 = 4/24. 21/24 − 4/24 = 17/24.",
        whyWrong: {
          a: "That subtracts the tops and the bottoms separately. Use a common denominator.",
          c: "That subtracts 7 − 1 over 24 without converting the numerators.",
          d: "Check the conversion: 7/8 = 21/24, 1/6 = 4/24, so 21 − 4 = 17.",
        },
      },
      {
        id: "ma08-3",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-l1-n3-2",
        prompt: "Work out 3/4 ÷ 9/10.",
        options: [
          { id: "a", text: "27/40" },
          { id: "b", text: "6/5" },
          { id: "c", text: "5/6" },
          { id: "d", text: "40/27" },
        ],
        correct: "c",
        explanation: "3/4 ÷ 9/10 = 3/4 × 10/9 = 30/36 = 5/6.",
        whyWrong: {
          a: "That multiplies instead of dividing. Turn the second fraction over first.",
          b: "That turned the first fraction over: 4/3 × 9/10. Only the divisor is turned over.",
          d: "That turned BOTH fractions over. Only the one you divide by is turned over: 3/4 × 10/9.",
        },
      },
      {
        id: "ma08-4",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-l1-n3-3",
        prompt: "Work out 2 1/2 × 1 3/5.",
        options: [
          { id: "a", text: "2 3/10" },
          { id: "b", text: "4" },
          { id: "c", text: "4 1/10" },
          { id: "d", text: "1 9/16" },
        ],
        correct: "b",
        explanation: "Convert first: 2 1/2 = 5/2 and 1 3/5 = 8/5. 5/2 × 8/5 = 40/10 = 4.",
        whyWrong: {
          a: "That multiplies the wholes (2 × 1) and the fractions (1/2 × 3/5) separately. Convert to improper fractions first.",
          c: "That ADDS the two mixed numbers: 2 1/2 + 1 3/5 = 4 1/10. The sign is ×.",
          d: "That divides: 5/2 ÷ 8/5 = 25/16. The sign is ×: 5/2 × 8/5 = 4.",
        },
      },
      {
        id: "ma08-5",
        type: "mcq",
        difficulty: 3,
        atomId: "a-ma-l1-n3-4",
        prompt: "A trader had 120 bags of rice. She sold 1/3 of them on Monday and 3/4 of the REMAINDER on Tuesday. How many bags are left?",
        options: [
          { id: "a", text: "20" },
          { id: "b", text: "30" },
          { id: "c", text: "60" },
          { id: "d", text: "80" },
        ],
        correct: "a",
        explanation: "Monday: 1/3 of 120 = 40, leaving 80. Tuesday: 3/4 of 80 = 60, leaving 20.",
        whyWrong: {
          b: "That skips Monday and takes 1/4 of all 120. Monday's sale comes first, leaving 80.",
          c: "60 is how many were sold on Tuesday. The question asks how many are left.",
          d: "80 is what was left after Monday. Tuesday's sale of 60 still has to come off.",
        },
      },
    ],
  },
};

export default ASSESSMENTS;
