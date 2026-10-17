/**
 * ASSESSMENTS · MATHEMATICS · MODULE 31 · SEQUENCES, SERIES AND FINANCIAL ARITHMETIC
 * SERVER ONLY. See ma-01-place-value.js for how these are written.
 */

export const ASSESSMENTS = {
  "ma-l5-n1": {
    lessonId: "ma-l5-n1",
    passMark: 70,
    questions: [
      {
        id: "ma31-1",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-l5-n1-2",
        prompt: "Find the 25th term of the AP 7, 11, 15, ...",
        options: [
          { id: "a", text: "103" },
          { id: "b", text: "107" },
          { id: "c", text: "100" },
          { id: "d", text: "175" },
        ],
        correct: "a",
        explanation: "T₂₅ = 7 + 24 × 4 = 7 + 96 = 103.",
        whyWrong: {
          b: "That uses 25 × 4. It is (n − 1)d = 24 × 4.",
          c: "That is 25 × 4 alone, without the first term.",
          d: "That is 25 × 7.",
        },
      },
      {
        id: "ma31-2",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-l5-n1-3",
        prompt: "Find the sum of the first 30 terms of the AP 2, 5, 8, ...",
        options: [
          { id: "a", text: "1 365" },
          { id: "b", text: "89" },
          { id: "c", text: "1 395" },
          { id: "d", text: "2 730" },
        ],
        correct: "a",
        explanation: "S₃₀ = 30/2 × [2(2) + 29 × 3] = 15 × 91 = 1 365.",
        whyWrong: {
          b: "That is the 30th TERM, 2 + 29 × 3. The question asks for the sum.",
          c: "That uses 30 × 3 for (n − 1)d: 15 × 93. It is 29 × 3.",
          d: "That forgets to halve: Sₙ = n/2 [...].",
        },
      },
      {
        id: "ma31-3",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-l5-n1-4",
        prompt: "Find the 6th term of the GP 5, 10, 20, ...",
        options: [
          { id: "a", text: "160" },
          { id: "b", text: "320" },
          { id: "c", text: "30" },
          { id: "d", text: "60" },
        ],
        correct: "a",
        explanation: "T₆ = 5 × 2⁵ = 5 × 32 = 160.",
        whyWrong: {
          b: "That uses 2⁶. The power is n − 1 = 5.",
          c: "That treats it as an AP adding 5. A GP multiplies.",
          d: "That uses 5 × 2 × 6. The ratio is raised to a power.",
        },
      },
      {
        id: "ma31-4",
        type: "mcq",
        difficulty: 3,
        atomId: "a-ma-l5-n1-5",
        prompt: "Find the sum to infinity of the GP 27 + 9 + 3 + 1 + ...",
        options: [
          { id: "a", text: "40.5" },
          { id: "b", text: "40" },
          { id: "c", text: "20.25" },
          { id: "d", text: "81" },
        ],
        correct: "a",
        explanation: "r = 1/3. S∞ = 27/(1 − 1/3) = 27 ÷ 2/3 = 40.5.",
        whyWrong: {
          b: "That adds only the four terms shown. The terms carry on for ever.",
          c: "That uses 1 + r on the bottom: 27 ÷ 4/3. It is 1 − r.",
          d: "That divides by 1/3 instead of by (1 − 1/3).",
        },
      },
    ],
  },

  "ma-l5-n2": {
    lessonId: "ma-l5-n2",
    passMark: 70,
    questions: [
      {
        id: "ma31-5",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-l5-n2-1",
        prompt: "Find the amount when ₦50 000 is invested for 2 years at 20% compound interest.",
        options: [
          { id: "a", text: "₦72 000" },
          { id: "b", text: "₦70 000" },
          { id: "c", text: "₦22 000" },
          { id: "d", text: "₦60 000" },
        ],
        correct: "a",
        explanation: "A = 50 000 × 1.2² = 50 000 × 1.44 = ₦72 000.",
        whyWrong: {
          b: "That is simple interest: 50 000 + 2 × 10 000.",
          c: "That is the compound interest, not the amount.",
          d: "That is one year only.",
        },
      },
      {
        id: "ma31-6",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-l5-n2-2",
        prompt: "A machine worth ₦800 000 depreciates by 25% a year. What is it worth after 2 years?",
        options: [
          { id: "a", text: "₦450 000" },
          { id: "b", text: "₦400 000" },
          { id: "c", text: "₦600 000" },
          { id: "d", text: "₦200 000" },
        ],
        correct: "a",
        explanation: "V = 800 000 × 0.75² = 800 000 × 0.5625 = ₦450 000.",
        whyWrong: {
          b: "That takes 25% of the ORIGINAL value off twice. The second year's loss is 25% of ₦600 000.",
          c: "That is after one year.",
          d: "That is one year's LOSS (25% of ₦800 000), not the value left.",
        },
      },
      {
        id: "ma31-7",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-l5-n2-4",
        prompt: "An investor holds 2 000 ₦1 shares. A 15% dividend is declared. How much is paid to the investor before tax?",
        options: [
          { id: "a", text: "₦300" },
          { id: "b", text: "₦30" },
          { id: "c", text: "₦2 300" },
          { id: "d", text: "₦3 000" },
        ],
        correct: "a",
        explanation: "Nominal value held = ₦2 000. 15% of ₦2 000 = ₦300.",
        whyWrong: {
          b: "15% of 2 000 is 300, not 30.",
          c: "That adds the dividend to the nominal value.",
          d: "That uses 150%. 15% of 2 000 = 300.",
        },
      },
      {
        id: "ma31-8",
        type: "mcq",
        difficulty: 3,
        atomId: "a-ma-l5-n2-3",
        prompt: "₦10 000 is saved at the end of each year for 2 years at 10% compound interest. How much is there just after the second payment?",
        options: [
          { id: "a", text: "₦21 000" },
          { id: "b", text: "₦20 000" },
          { id: "c", text: "₦22 000" },
          { id: "d", text: "₦24 200" },
        ],
        correct: "a",
        explanation: "The first ₦10 000 earns one year's interest: 11 000. Add the second payment: ₦21 000.",
        whyWrong: {
          b: "That ignores the interest on the first payment.",
          c: "That gives the second payment interest too, but it was only just paid in.",
          d: "That compounds ₦20 000 for two years, as if both were paid at the start.",
        },
      },
    ],
  },
};

export default ASSESSMENTS;
