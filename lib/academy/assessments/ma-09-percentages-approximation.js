/**
 * ASSESSMENTS · MATHEMATICS · MODULE 9 · PERCENTAGES AND APPROXIMATION
 * SERVER ONLY. See ma-01-place-value.js for how these are written.
 */

export const ASSESSMENTS = {
  "ma-l1-n4": {
    lessonId: "ma-l1-n4",
    passMark: 70,
    questions: [
      {
        id: "ma09-1",
        type: "mcq",
        difficulty: 1,
        atomId: "a-ma-l1-n4-1",
        prompt: "Write 3/8 as a percentage.",
        options: [
          { id: "a", text: "38%" },
          { id: "b", text: "37.5%" },
          { id: "c", text: "0.375%" },
          { id: "d", text: "26.7%" },
        ],
        correct: "b",
        explanation: "3/8 × 100 = 300/8 = 37.5%.",
        whyWrong: {
          a: "That just joins the digits. Multiply the fraction by 100: 3/8 × 100 = 37.5.",
          c: "0.375 is the decimal. Multiply by 100 to get the percentage.",
          d: "That is 8/3 × 10. Divide 3 by 8, then multiply by 100.",
        },
      },
      {
        id: "ma09-2",
        type: "mcq",
        difficulty: 1,
        atomId: "a-ma-l1-n4-1",
        prompt: "Write 45% as a fraction in its lowest terms.",
        options: [
          { id: "a", text: "45/100" },
          { id: "b", text: "9/20" },
          { id: "c", text: "4/5" },
          { id: "d", text: "0.45" },
        ],
        correct: "b",
        explanation: "45% = 45/100. Divide top and bottom by 5: 9/20.",
        whyWrong: {
          a: "Correct value, but not in lowest terms: 45 and 100 share 5.",
          c: "4/5 = 80%. Write 45 over 100 first.",
          d: "That is the decimal, not a fraction.",
        },
      },
      {
        id: "ma09-3",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-l1-n4-2",
        prompt: "A school has 1 240 students. 15% walk to school. How many walk?",
        options: [
          { id: "a", text: "82.7" },
          { id: "b", text: "186" },
          { id: "c", text: "124" },
          { id: "d", text: "1 054" },
        ],
        correct: "b",
        explanation: "1 240 × 15 ÷ 100 = 186. Mentally: 10% = 124, 5% = 62, 15% = 186.",
        whyWrong: {
          a: "That divides by 15. Multiply by 15, then divide by 100.",
          c: "That is 10%. Add the 5% (62) to get 15%.",
          d: "That is the 85% who do NOT walk.",
        },
      },
      {
        id: "ma09-4",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-l1-n4-3",
        prompt: "Express 300 g as a percentage of 1.2 kg.",
        options: [
          { id: "a", text: "25%" },
          { id: "b", text: "250%" },
          { id: "c", text: "400%" },
          { id: "d", text: "2.5%" },
        ],
        correct: "a",
        explanation: "Same units first: 1.2 kg = 1 200 g. 300/1 200 × 100 = 25%.",
        whyWrong: {
          b: "That uses 1.2 kg as 120 g. 1.2 kg = 1 200 g.",
          c: "That is 1 200/300 × 100, upside down. The quantity asked about, 300 g, goes on top.",
          d: "That uses 1.2 kg as 12 000 g. 1.2 kg = 1 200 g.",
        },
      },
    ],
  },

  "ma-l1-n5": {
    lessonId: "ma-l1-n5",
    passMark: 70,
    questions: [
      {
        id: "ma09-5",
        type: "mcq",
        difficulty: 1,
        atomId: "a-ma-l1-n5-1",
        prompt: "Round 7.8961 to 2 decimal places.",
        options: [
          { id: "a", text: "7.89" },
          { id: "b", text: "7.90" },
          { id: "c", text: "7.9" },
          { id: "d", text: "7.896" },
        ],
        correct: "b",
        explanation: "Keep 7.89, the next digit is 6, so round up: 7.90. The zero shows 2 decimal places.",
        whyWrong: {
          a: "The next digit is 6, which rounds UP.",
          c: "Same value, but 2 decimal places must show 2 digits after the point: 7.90.",
          d: "That is 3 decimal places.",
        },
      },
      {
        id: "ma09-6",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-l1-n5-2",
        prompt: "Round 0.050 74 to 3 significant figures.",
        options: [
          { id: "a", text: "0.051" },
          { id: "b", text: "0.0507" },
          { id: "c", text: "0.050" },
          { id: "d", text: "0.05074" },
        ],
        correct: "b",
        explanation: "The first significant figure is the 5. Three s.f.: 5, 0, 7. Next digit 4 → down: 0.0507.",
        whyWrong: {
          a: "That is 2 s.f. Count from the 5: 5, 0, 7 are three figures.",
          c: "That counts the leading zero as significant. Leading zeros never count.",
          d: "That is 4 significant figures.",
        },
      },
      {
        id: "ma09-7",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-l1-n5-2",
        prompt: "Round 586 420 to 2 significant figures.",
        options: [
          { id: "a", text: "59" },
          { id: "b", text: "590 000" },
          { id: "c", text: "580 000" },
          { id: "d", text: "586 000" },
        ],
        correct: "b",
        explanation: "First two s.f.: 5 and 8 (hundred thousands and ten thousands). The next digit is 6, so up: 590 000. The zeros keep the size.",
        whyWrong: {
          a: "The value must keep its size. 586 420 is about 590 thousand, not 59.",
          c: "The next digit is 6, which rounds up.",
          d: "That is 3 s.f.",
        },
      },
      {
        id: "ma09-8",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-l1-n5-3",
        prompt: "By rounding each number to 1 significant figure, estimate (39.6 × 5.12) ÷ 0.198.",
        options: [
          { id: "a", text: "1 000" },
          { id: "b", text: "100" },
          { id: "c", text: "40" },
          { id: "d", text: "10 000" },
        ],
        correct: "a",
        explanation: "40 × 5 ÷ 0.2 = 200 ÷ 0.2 = 1 000.",
        whyWrong: {
          b: "200 ÷ 0.2 is 1 000, not 100. Dividing by 0.2 is the same as multiplying by 5.",
          c: "That multiplies by 0.2 instead of dividing.",
          d: "Check 0.198: to 1 s.f. it is 0.2, not 0.02.",
        },
      },
    ],
  },
};

export default ASSESSMENTS;
