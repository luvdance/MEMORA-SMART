/**
 * ASSESSMENTS · MATHEMATICS · MODULE 21 · NUMBER BASES, COMMERCE AND ERROR
 * SERVER ONLY. See ma-01-place-value.js for how these are written.
 */

export const ASSESSMENTS = {
  "ma-l3-n1": {
    lessonId: "ma-l3-n1",
    passMark: 70,
    questions: [
      {
        id: "ma21-1",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-l3-n1-1",
        prompt: "Convert 312₄ to base ten.",
        options: [
          { id: "a", text: "54" },
          { id: "b", text: "312" },
          { id: "c", text: "6" },
          { id: "d", text: "39" },
        ],
        correct: "a",
        explanation: "3 × 4² + 1 × 4 + 2 = 48 + 4 + 2 = 54.",
        whyWrong: {
          b: "That reads it as a base ten number. In base 4 the places are 16, 4 and 1.",
          c: "That adds the digits. Each digit is multiplied by its place value.",
          d: "That reads the digits in reverse order: 213₄ = 32 + 4 + 3 = 39.",
        },
      },
      {
        id: "ma21-2",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-l3-n1-2",
        prompt: "Work out 46₇ + 35₇ in base 7.",
        options: [
          { id: "a", text: "81₇" },
          { id: "b", text: "114₇" },
          { id: "c", text: "111₇" },
          { id: "d", text: "104₇" },
        ],
        correct: "b",
        explanation: "6 + 5 = 11 = 1×7 + 4: write 4, carry 1. 4 + 3 + 1 = 8 = 1×7 + 1: write 1, carry 1. Answer 114₇. Check: 34 + 26 = 60 = 49 + 7 + 4 ✓.",
        whyWrong: {
          a: "That adds in base ten. There is no digit 8 in base 7.",
          c: "In the units 6 + 5 = 11, which is one seven and FOUR, not one.",
          d: "Check the sevens column: 4 + 3 + 1 carried = 8 = 1×7 + 1.",
        },
      },
      {
        id: "ma21-3",
        type: "mcq",
        difficulty: 3,
        atomId: "a-ma-l3-n1-3",
        prompt: "Find b if 25_b = 23 (base ten).",
        options: [
          { id: "a", text: "b = 9" },
          { id: "b", text: "b = 4" },
          { id: "c", text: "b = 18" },
          { id: "d", text: "b = 3" },
        ],
        correct: "a",
        explanation: "2b + 5 = 23, so 2b = 18 and b = 9. (It must be bigger than the digit 5.)",
        whyWrong: {
          b: "A base cannot be smaller than a digit in the numeral: 5 is not allowed in base 4.",
          c: "That stops at 2b = 18. Divide by 2.",
          d: "Check: 2 × 3 + 5 = 11, not 23.",
        },
      },
      {
        id: "ma21-4",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-l3-n1-1",
        prompt: "Convert 50 to base 3.",
        options: [
          { id: "a", text: "1212₃" },
          { id: "b", text: "2121₃" },
          { id: "c", text: "1222₃" },
          { id: "d", text: "212₃" },
        ],
        correct: "a",
        explanation: "50 ÷ 3 = 16 r 2, 16 ÷ 3 = 5 r 1, 5 ÷ 3 = 1 r 2, 1 ÷ 3 = 0 r 1. Bottom up: 1212₃. Check: 27 + 18 + 3 + 2 = 50.",
        whyWrong: {
          b: "Those are the remainders read top down. Read from the bottom up.",
          c: "1222₃ = 27 + 18 + 6 + 2 = 53.",
          d: "A digit is missing: 212₃ = 18 + 3 + 2 = 23.",
        },
      },
    ],
  },

  "ma-l3-n2": {
    lessonId: "ma-l3-n2",
    passMark: 70,
    questions: [
      {
        id: "ma21-5",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-l3-n2-1",
        prompt: "Find the compound interest on ₦20 000 for 2 years at 10% per annum.",
        options: [
          { id: "a", text: "₦4 000" },
          { id: "b", text: "₦4 200" },
          { id: "c", text: "₦24 200" },
          { id: "d", text: "₦2 000" },
        ],
        correct: "b",
        explanation: "Year 1: 2 000 → 22 000. Year 2: 10% of 22 000 = 2 200 → 24 200. Interest = 4 200.",
        whyWrong: {
          a: "That is simple interest. Year 2's interest is on ₦22 000, not ₦20 000.",
          c: "That is the amount. The interest is 24 200 − 20 000.",
          d: "That is one year's interest only.",
        },
      },
      {
        id: "ma21-6",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-l3-n2-2",
        prompt: "A laptop costs ₦322 500 including 7.5% VAT. What is its price before VAT?",
        options: [
          { id: "a", text: "₦298 312.50" },
          { id: "b", text: "₦300 000" },
          { id: "c", text: "₦24 187.50" },
          { id: "d", text: "₦346 687.50" },
        ],
        correct: "b",
        explanation: "322 500 is 107.5% of the price. 322 500 ÷ 1.075 = ₦300 000.",
        whyWrong: {
          a: "That takes 7.5% of the TOTAL off. The VAT was 7.5% of the original price.",
          c: "That is 7.5% of the total, not the price.",
          d: "That ADDS 7.5% again.",
        },
      },
      {
        id: "ma21-7",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-l3-n2-3",
        prompt: "A TV costs ₦180 000 cash. On hire purchase: ₦40 000 deposit and 10 monthly instalments of ₦16 000. How much more does hire purchase cost?",
        options: [
          { id: "a", text: "₦20 000" },
          { id: "b", text: "₦200 000" },
          { id: "c", text: "₦160 000" },
          { id: "d", text: "₦−20 000" },
        ],
        correct: "a",
        explanation: "HP price = 40 000 + 10 × 16 000 = 200 000. Extra = 200 000 − 180 000 = ₦20 000.",
        whyWrong: {
          b: "That is the hire purchase price. Subtract the cash price.",
          c: "That leaves out the deposit and compares 160 000 alone.",
          d: "Hire purchase costs more, not less: the deposit must be included.",
        },
      },
      {
        id: "ma21-8",
        type: "mcq",
        difficulty: 1,
        atomId: "a-ma-l3-n2-4",
        prompt: "If £1 = ₦2 000, how many pounds will ₦150 000 buy?",
        options: [
          { id: "a", text: "£75" },
          { id: "b", text: "£300 000 000" },
          { id: "c", text: "£750" },
          { id: "d", text: "£7.50" },
        ],
        correct: "a",
        explanation: "Naira to pounds: divide. 150 000 ÷ 2 000 = £75.",
        whyWrong: {
          b: "That multiplies. Changing naira to pounds gives fewer pounds: divide.",
          c: "That divides by 200. Each £1 costs ₦2 000: 150 000 ÷ 2 000 = 75.",
          d: "That divides by 20 000. Each £1 costs ₦2 000: 150 000 ÷ 2 000 = 75.",
        },
      },
    ],
  },

  "ma-l3-n3": {
    lessonId: "ma-l3-n3",
    passMark: 70,
    questions: [
      {
        id: "ma21-9",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-l3-n3-1",
        prompt: "A bag labelled 25 kg weighs 24 kg. Find the percentage error.",
        options: [
          { id: "a", text: "4%" },
          { id: "b", text: "4.17%" },
          { id: "c", text: "1%" },
          { id: "d", text: "96%" },
        ],
        correct: "a",
        explanation: "Error = 1 kg. % error = 1 ÷ 25 × 100 = 4%.",
        whyWrong: {
          b: "That divides by the measured value, 24. Use the true (labelled) value, 25.",
          c: "1 kg is the absolute error, not the percentage.",
          d: "That is the measured value as a percentage of the true value.",
        },
      },
      {
        id: "ma21-10",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-l3-n3-1",
        prompt: "A length is given as 8 m, correct to the nearest metre. What is the greatest possible error?",
        options: [
          { id: "a", text: "1 m" },
          { id: "b", text: "0.5 m" },
          { id: "c", text: "0.1 m" },
          { id: "d", text: "8.5 m" },
        ],
        correct: "b",
        explanation: "To the nearest metre, the true length is between 7.5 m and 8.5 m, so the greatest error is half a metre.",
        whyWrong: {
          a: "The greatest error is HALF the unit of rounding.",
          c: "The rounding was to the nearest metre, not the nearest 0.1 m.",
          d: "8.5 m is the upper bound of the length, not the error.",
        },
      },
      {
        id: "ma21-11",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-l3-n3-2",
        prompt: "y varies inversely as x. When x = 4, y = 15. Find y when x = 10.",
        options: [
          { id: "a", text: "37.5" },
          { id: "b", text: "6" },
          { id: "c", text: "60" },
          { id: "d", text: "9" },
        ],
        correct: "b",
        explanation: "y = k/x, so k = 4 × 15 = 60. When x = 10, y = 60 ÷ 10 = 6.",
        whyWrong: {
          a: "That treats it as direct variation (15 ÷ 4 × 10).",
          c: "60 is the constant k, not y.",
          d: "That subtracts 6 for an increase of 6 in x. Use y = k/x.",
        },
      },
      {
        id: "ma21-12",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-l3-n3-2",
        prompt: "The cost C of rice varies directly as its mass m. 5 kg costs ₦7 500. Find the cost of 12 kg.",
        options: [
          { id: "a", text: "₦18 000" },
          { id: "b", text: "₦3 125" },
          { id: "c", text: "₦1 500" },
          { id: "d", text: "₦10 500" },
        ],
        correct: "a",
        explanation: "C = km: 7 500 = 5k, so k = 1 500. C = 1 500 × 12 = ₦18 000.",
        whyWrong: {
          b: "That treats it as inverse variation. More rice costs more.",
          c: "₦1 500 is k, the cost of 1 kg.",
          d: "That adds ₦3 000 for 7 more kg. Use C = km.",
        },
      },
    ],
  },
};

export default ASSESSMENTS;
