/**
 * ASSESSMENTS · MATHEMATICS · MODULE 10 · THE NUMBER SYSTEM AND RATIO
 * SERVER ONLY. See ma-01-place-value.js for how these are written.
 */

export const ASSESSMENTS = {
  "ma-l1-n7": {
    lessonId: "ma-l1-n7",
    passMark: 70,
    questions: [
      {
        id: "ma10-1",
        type: "mcq",
        difficulty: 1,
        atomId: "a-ma-l1-n7-1",
        prompt: "Which of these is an integer but NOT a natural number?",
        options: [
          { id: "a", text: "5" },
          { id: "b", text: "−2" },
          { id: "c", text: "1/2" },
          { id: "d", text: "0.7" },
        ],
        correct: "b",
        explanation: "−2 is a whole number with a negative sign, so it is an integer. Natural numbers are 1, 2, 3, ..., so it is not natural.",
        whyWrong: {
          a: "5 is an integer AND a natural number.",
          c: "1/2 is not a whole number, so it is not an integer.",
          d: "0.7 is not a whole number, so it is not an integer.",
        },
      },
      {
        id: "ma10-2",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-l1-n7-2",
        prompt: "Which of these numbers is irrational?",
        options: [
          { id: "a", text: "√36" },
          { id: "b", text: "0.666..." },
          { id: "c", text: "√11" },
          { id: "d", text: "22/7" },
        ],
        correct: "c",
        explanation: "11 is not a perfect square, so √11 never ends and never repeats.",
        whyWrong: {
          a: "√36 = 6, which is rational.",
          b: "A repeating decimal is rational: 0.666... = 2/3.",
          d: "22/7 is a fraction of two integers, so it is rational. It is only an approximation to π.",
        },
      },
      {
        id: "ma10-3",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-l1-n7-3",
        prompt: "Between which two consecutive integers does −√40 lie?",
        options: [
          { id: "a", text: "6 and 7" },
          { id: "b", text: "−6 and −5" },
          { id: "c", text: "−7 and −6" },
          { id: "d", text: "−20 and −19" },
        ],
        correct: "c",
        explanation: "36 < 40 < 49, so 6 < √40 < 7. Therefore −7 < −√40 < −6.",
        whyWrong: {
          a: "That is where √40 lies. The number is negative.",
          b: "√40 is more than 6, since 6² = 36 < 40. So −√40 is less than −6.",
          d: "That uses half of 40. A square root is not half.",
        },
      },
      {
        id: "ma10-8",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-l1-n7-3",
        prompt: "Which list is in ascending order?",
        options: [
          { id: "a", text: "−√2, −1, 3/4, √2, π" },
          { id: "b", text: "−1, −√2, 3/4, √2, π" },
          { id: "c", text: "−√2, −1, √2, 3/4, π" },
          { id: "d", text: "π, √2, 3/4, −1, −√2" },
        ],
        correct: "a",
        explanation: "As decimals: −√2 ≈ −1.41, −1, 3/4 = 0.75, √2 ≈ 1.41, π ≈ 3.14. Smallest first gives list a.",
        whyWrong: {
          b: "−√2 ≈ −1.41 is further left than −1, so it is smaller and comes first.",
          c: "√2 ≈ 1.41 is bigger than 3/4 = 0.75, so 3/4 comes first.",
          d: "That is descending order, largest first.",
        },
      },
    ],
  },

  "ma-l2-n3": {
    lessonId: "ma-l2-n3",
    passMark: 70,
    questions: [
      {
        id: "ma10-4",
        type: "mcq",
        difficulty: 1,
        atomId: "a-ma-l2-n3-1",
        prompt: "Simplify the ratio 1.5 kg : 600 g.",
        options: [
          { id: "a", text: "1.5 : 600" },
          { id: "b", text: "5 : 2" },
          { id: "c", text: "1 : 400" },
          { id: "d", text: "2 : 5" },
        ],
        correct: "b",
        explanation: "Same units: 1 500 g : 600 g. HCF 300: 5 : 2.",
        whyWrong: {
          a: "The units are different. Change 1.5 kg to 1 500 g first.",
          c: "That treats both as the same unit without converting.",
          d: "That reverses the order. The first quantity, 1.5 kg, comes first.",
        },
      },
      {
        id: "ma10-5",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-l2-n3-1",
        prompt: "₦45 000 is shared between Ada and Bisi in the ratio 4 : 5. How much does Bisi get?",
        options: [
          { id: "a", text: "₦25 000" },
          { id: "b", text: "₦20 000" },
          { id: "c", text: "₦11 250" },
          { id: "d", text: "₦9 000" },
        ],
        correct: "a",
        explanation: "4 + 5 = 9 parts. One part = 45 000 ÷ 9 = 5 000. Bisi: 5 × 5 000 = ₦25 000.",
        whyWrong: {
          b: "That is Ada's share, 4 parts.",
          c: "That divides by 4. Divide by the total number of parts, 9.",
          d: "That divides by 5. Divide by the total number of parts, 9.",
        },
      },
      {
        id: "ma10-6",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-l2-n3-3",
        prompt: "8 men can tile a hall in 15 days. How many days would 12 men take, working at the same rate?",
        options: [
          { id: "a", text: "22.5" },
          { id: "b", text: "10" },
          { id: "c", text: "11" },
          { id: "d", text: "19" },
        ],
        correct: "b",
        explanation: "Inverse proportion: total work = 8 × 15 = 120 man-days. 120 ÷ 12 = 10 days.",
        whyWrong: {
          a: "That treats it as direct proportion. More men should take FEWER days.",
          c: "That subtracts 4 days for 4 more men. Use the total work: 120 ÷ 12.",
          d: "More men take fewer days, not more.",
        },
      },
      {
        id: "ma10-7",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-l2-n3-4",
        prompt: "A car travels 135 km in 1 h 30 min. What is its average speed?",
        options: [
          { id: "a", text: "103.8 km/h" },
          { id: "b", text: "90 km/h" },
          { id: "c", text: "45 km/h" },
          { id: "d", text: "202.5 km/h" },
        ],
        correct: "b",
        explanation: "1 h 30 min = 1.5 h. Speed = 135 ÷ 1.5 = 90 km/h.",
        whyWrong: {
          a: "That uses 1.3 h for 1 h 30 min. 30 minutes is 0.5 of an hour.",
          c: "That is 135 ÷ 3. The time is 1.5 hours.",
          d: "That multiplies by the time. Speed = distance ÷ time.",
        },
      },
    ],
  },
};

export default ASSESSMENTS;
