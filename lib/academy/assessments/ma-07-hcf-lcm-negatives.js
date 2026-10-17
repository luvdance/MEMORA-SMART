/**
 * ASSESSMENTS · MATHEMATICS · MODULE 7 · HCF, LCM AND DIRECTED NUMBERS
 * SERVER ONLY. See ma-01-place-value.js for how these are written.
 */

export const ASSESSMENTS = {
  "ma-l1-n2": {
    lessonId: "ma-l1-n2",
    passMark: 70,
    questions: [
      {
        id: "ma07-1",
        type: "mcq",
        difficulty: 1,
        atomId: "a-ma-l1-n2-1",
        prompt: "Write 84 as a product of prime factors.",
        options: [
          { id: "a", text: "2² × 3 × 7" },
          { id: "b", text: "4 × 21" },
          { id: "c", text: "2 × 3 × 7" },
          { id: "d", text: "2 × 6 × 7" },
        ],
        correct: "a",
        explanation: "84 = 2 × 42 = 2 × 2 × 21 = 2 × 2 × 3 × 7 = 2² × 3 × 7.",
        whyWrong: {
          b: "4 and 21 are not prime. Keep splitting: 4 = 2 × 2 and 21 = 3 × 7.",
          c: "2 × 3 × 7 = 42. One factor of 2 is missing.",
          d: "6 is not prime: 6 = 2 × 3.",
        },
      },
      {
        id: "ma07-2",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-l1-n2-2",
        prompt: "Find the HCF of 60 and 84.",
        options: [
          { id: "a", text: "6" },
          { id: "b", text: "12" },
          { id: "c", text: "420" },
          { id: "d", text: "4" },
        ],
        correct: "b",
        explanation: "60 = 2² × 3 × 5 and 84 = 2² × 3 × 7. Shared primes with lower powers: 2² × 3 = 12.",
        whyWrong: {
          a: "6 divides both, but it is not the HIGHEST. 12 also divides both.",
          c: "420 is the LCM, the smallest number both divide into.",
          d: "4 divides both, but 3 is a shared prime too: 4 × 3 = 12.",
        },
      },
      {
        id: "ma07-3",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-l1-n2-3",
        prompt: "Find the LCM of 18 and 24.",
        options: [
          { id: "a", text: "432" },
          { id: "b", text: "6" },
          { id: "c", text: "72" },
          { id: "d", text: "36" },
        ],
        correct: "c",
        explanation: "18 = 2 × 3² and 24 = 2³ × 3. Every prime, higher power: 2³ × 3² = 72.",
        whyWrong: {
          a: "18 × 24 is a common multiple but not the lowest. Use the higher power of each prime.",
          b: "6 is the HCF. The LCM is the smallest number both divide into.",
          d: "24 does not divide 36. You need 2³ from 24 as well as 3² from 18.",
        },
      },
      {
        id: "ma07-4",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-l1-n2-4",
        prompt: "Two lights flash every 15 seconds and every 20 seconds. They flash together now. After how many seconds will they next flash together?",
        options: [
          { id: "a", text: "5" },
          { id: "b", text: "35" },
          { id: "c", text: "300" },
          { id: "d", text: "60" },
        ],
        correct: "d",
        explanation: "'Together again' needs the LCM. 15 = 3 × 5 and 20 = 2² × 5. LCM = 2² × 3 × 5 = 60 seconds.",
        whyWrong: {
          a: "5 is the HCF. At 5 seconds neither light has flashed yet.",
          b: "Adding gives no meaning here. You need a time that both 15 and 20 divide into.",
          c: "15 × 20 = 300 works, but they meet sooner, at 60.",
        },
      },
      {
        id: "ma07-5",
        type: "mcq",
        difficulty: 3,
        atomId: "a-ma-l1-n2-5",
        prompt: "Given 3 600 = 2⁴ × 3² × 5², find √3 600.",
        options: [
          { id: "a", text: "30" },
          { id: "b", text: "60" },
          { id: "c", text: "1 800" },
          { id: "d", text: "120" },
        ],
        correct: "b",
        explanation: "Halve every power: 2² × 3 × 5 = 4 × 3 × 5 = 60.",
        whyWrong: {
          a: "That takes each prime once: 2 × 3 × 5. Halving 2⁴ gives 2², not 2.",
          c: "That is half of 3 600. A square root halves the POWERS, not the number.",
          d: "That uses 2³. Half of the power 4 is 2: 2² = 4.",
        },
      },
    ],
  },

  "ma-l1-n6": {
    lessonId: "ma-l1-n6",
    passMark: 70,
    questions: [
      {
        id: "ma07-6",
        type: "mcq",
        difficulty: 1,
        atomId: "a-ma-l1-n6-1",
        prompt: "Which list is in ascending order?",
        options: [
          { id: "a", text: "−1, −4, −9, 0, 3" },
          { id: "b", text: "−9, −4, −1, 0, 3" },
          { id: "c", text: "0, −1, 3, −4, −9" },
          { id: "d", text: "3, 0, −1, −4, −9" },
        ],
        correct: "b",
        explanation: "Ascending means smallest first, and the smallest is furthest left on the number line: −9.",
        whyWrong: {
          a: "−1 is bigger than −4 and −9. Among negatives, the bigger the size, the smaller the number.",
          c: "That is not in any order.",
          d: "That is descending, largest first.",
        },
      },
      {
        id: "ma07-7",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-l1-n6-2",
        prompt: "Work out −7 − (−10).",
        options: [
          { id: "a", text: "−17" },
          { id: "b", text: "3" },
          { id: "c", text: "−3" },
          { id: "d", text: "17" },
        ],
        correct: "b",
        explanation: "Subtracting a negative is adding: −7 − (−10) = −7 + 10 = 3.",
        whyWrong: {
          a: "That treats − (−10) as − 10. Taking away a negative moves RIGHT.",
          c: "That does 7 − 10. The −7 is the starting point: −7 + 10 = 3.",
          d: "That adds the sizes and makes it positive. Start at −7 and move 10 right.",
        },
      },
      {
        id: "ma07-8",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-l1-n6-3",
        prompt: "Work out (−6) × (−4) ÷ (−3).",
        options: [
          { id: "a", text: "8" },
          { id: "b", text: "−8" },
          { id: "c", text: "−24" },
          { id: "d", text: "−7" },
        ],
        correct: "b",
        explanation: "(−6) × (−4) = 24 (same signs). 24 ÷ (−3) = −8 (different signs). Three negatives: odd, so negative.",
        whyWrong: {
          a: "Count the negatives: there are three, an odd number, so the answer is negative.",
          c: "That stops after the multiplication. Divide by −3 as well.",
          d: "That adds −6 + (−4), then works on. The signs are × and ÷.",
        },
      },
      {
        id: "ma07-9",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-l1-n6-4",
        prompt: "At 6 am the temperature in Jos was −2 °C. By noon it was 13 °C. By how much did it rise?",
        options: [
          { id: "a", text: "11 °C" },
          { id: "b", text: "15 °C" },
          { id: "c", text: "−15 °C" },
          { id: "d", text: "13 °C" },
        ],
        correct: "b",
        explanation: "Rise = 13 − (−2) = 13 + 2 = 15 °C. From −2 up to 0 is 2 degrees, then up to 13 is 13 more.",
        whyWrong: {
          a: "That subtracts the sizes, 13 − 2. The gap from −2 to 13 crosses zero: 2 + 13 = 15.",
          c: "A rise is positive. The temperature went up.",
          d: "That ignores the 2 degrees from −2 up to 0.",
        },
      },
    ],
  },
};

export default ASSESSMENTS;
