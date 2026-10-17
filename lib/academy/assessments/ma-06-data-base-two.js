/**
 * ASSESSMENTS · MATHEMATICS · MODULE 6 · READING DATA, LARGE NUMBERS AND BASE TWO
 * SERVER ONLY. See ma-01-place-value.js for how these are written.
 */

export const ASSESSMENTS = {
  "ma-l0-s1": {
    lessonId: "ma-l0-s1",
    passMark: 70,
    questions: [
      {
        id: "ma06-1",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-l0-s1-1",
        prompt: "A bus leaves Ibadan at 10:45 and reaches Lagos at 13:20. How long is the journey?",
        options: [
          { id: "a", text: "2 h 35 min" },
          { id: "b", text: "3 h 25 min" },
          { id: "c", text: "2 h 75 min" },
          { id: "d", text: "3 h 35 min" },
        ],
        correct: "a",
        explanation: "10:45 → 11:00 is 15 min, 11:00 → 13:00 is 2 h, 13:00 → 13:20 is 20 min. Total 2 h 35 min.",
        whyWrong: {
          b: "That subtracts the hours (13 − 10 = 3) without counting the minutes properly. Count up from 10:45.",
          c: "That subtracts as if an hour had 100 minutes: 13.20 − 10.45. Count up instead.",
          d: "One hour too many. 11:00 to 13:00 is 2 hours.",
        },
      },
      {
        id: "ma06-2",
        type: "mcq",
        difficulty: 1,
        atomId: "a-ma-l0-s1-2",
        prompt: "On a bar chart the gridlines go up in 4s. The Football bar ends 2 gridlines above 20. How many chose football?",
        options: [
          { id: "a", text: "22" },
          { id: "b", text: "28" },
          { id: "c", text: "24" },
          { id: "d", text: "26" },
        ],
        correct: "b",
        explanation: "Each gridline is worth 4. Two gridlines above 20: 20 + 2 × 4 = 28.",
        whyWrong: {
          a: "That counts each gridline as 1. They go up in 4s.",
          c: "That is only one gridline above 20.",
          d: "That counts each gridline as 3. The scale goes up in 4s.",
        },
      },
      {
        id: "ma06-3",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-l0-s1-2",
        prompt: "In a pictogram, ★ = 6 cars. The row for Monday shows ★★★★ and half a ★. How many cars is that?",
        options: [
          { id: "a", text: "4.5" },
          { id: "b", text: "24" },
          { id: "c", text: "27" },
          { id: "d", text: "30" },
        ],
        correct: "c",
        explanation: "4 whole stars = 4 × 6 = 24. Half a star = 3. Total 27 cars.",
        whyWrong: {
          a: "That counts the symbols. Use the key: each ★ stands for 6 cars.",
          b: "That leaves out the half star, which is worth 3.",
          d: "That counts the half star as a whole one.",
        },
      },
      {
        id: "ma06-4",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-l0-s1-3",
        prompt: "Scores: Ada — Maths 70, English 55, Science 60. Bayo — Maths 65, English 72, Science 58. Who has the higher TOTAL?",
        options: [
          { id: "a", text: "Ada, because she has the highest Maths score" },
          { id: "b", text: "Bayo, with 195 against Ada's 185" },
          { id: "c", text: "Ada, with 195 against Bayo's 185" },
          { id: "d", text: "They are equal" },
        ],
        correct: "b",
        explanation: "Ada: 70 + 55 + 60 = 185. Bayo: 65 + 72 + 58 = 195. Bayo is higher.",
        whyWrong: {
          a: "The question asks about the TOTAL, not one subject.",
          c: "The totals are the other way round. Add each row again.",
          d: "185 and 195 are not equal.",
        },
      },
    ],
  },

  "ma-l1-n1": {
    lessonId: "ma-l1-n1",
    passMark: 70,
    questions: [
      {
        id: "ma06-5",
        type: "mcq",
        difficulty: 1,
        atomId: "a-ma-l1-n1-1",
        prompt: "Write ₦4.2 billion in figures.",
        options: [
          { id: "a", text: "₦42 000 000 000" },
          { id: "b", text: "₦4 200 000" },
          { id: "c", text: "₦4 200 000 000" },
          { id: "d", text: "₦4 000 000 002" },
        ],
        correct: "c",
        explanation: "1 billion = 1 000 000 000. 4.2 × 1 000 000 000 = 4 200 000 000.",
        whyWrong: {
          a: "That is 42 billion, ten times too big.",
          b: "That is 4.2 million. A billion is a thousand millions.",
          d: "The .2 is two tenths of a billion, 200 000 000, not 2.",
        },
      },
      {
        id: "ma06-6",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-l1-n1-3",
        prompt: "Convert 25 to base two.",
        options: [
          { id: "a", text: "10011₂" },
          { id: "b", text: "11001₂" },
          { id: "c", text: "11010₂" },
          { id: "d", text: "1111₂" },
        ],
        correct: "b",
        explanation: "25 ÷ 2 = 12 r 1, 12 ÷ 2 = 6 r 0, 6 ÷ 2 = 3 r 0, 3 ÷ 2 = 1 r 1, 1 ÷ 2 = 0 r 1. Bottom up: 11001. Check: 16 + 8 + 1 = 25.",
        whyWrong: {
          a: "Those are the remainders read from the top down. Read them from the bottom up.",
          c: "11010₂ = 16 + 8 + 2 = 26, one too many.",
          d: "1111₂ = 8 + 4 + 2 + 1 = 15.",
        },
      },
      {
        id: "ma06-7",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-l1-n1-3",
        prompt: "Convert 101101₂ to base ten.",
        options: [
          { id: "a", text: "4" },
          { id: "b", text: "45" },
          { id: "c", text: "101 101" },
          { id: "d", text: "53" },
        ],
        correct: "b",
        explanation: "Place values 32, 16, 8, 4, 2, 1. Digits 1 0 1 1 0 1: 32 + 8 + 4 + 1 = 45.",
        whyWrong: {
          a: "That adds the digits. Each 1 is worth its place value.",
          c: "That reads it as a base ten number. In base two the places are 1, 2, 4, 8, 16, 32.",
          d: "Check which places hold a 1: 32, 8, 4 and 1, not 32, 16, 4 and 1.",
        },
      },
      {
        id: "ma06-8",
        type: "mcq",
        difficulty: 3,
        atomId: "a-ma-l1-n1-4",
        prompt: "Work out 1101₂ + 111₂.",
        options: [
          { id: "a", text: "1212₂" },
          { id: "b", text: "10100₂" },
          { id: "c", text: "10010₂" },
          { id: "d", text: "11100₂" },
        ],
        correct: "b",
        explanation: "1101₂ = 13 and 111₂ = 7. 13 + 7 = 20 = 10100₂. In columns: 1+1 = 10, carry; 0+1+1 = 10, carry; 1+1+1 = 11, carry; 1+1 = 10.",
        whyWrong: {
          a: "That adds as in base ten. Base two has no digit 2: 1 + 1 = 10.",
          c: "10010₂ = 18. A carry was dropped: the total is 13 + 7 = 20.",
          d: "11100₂ = 28. Check the carries column by column.",
        },
      },
    ],
  },
};

export default ASSESSMENTS;
