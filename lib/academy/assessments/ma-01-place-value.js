/**
 * ASSESSMENTS · MATHEMATICS · MODULE 1 · PLACE VALUE
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Never import this from anything under src/.
 * ═════════════════════════════════════════════════════════════════════════
 *
 * The Master step of the lesson. Five questions, one or more per skill, each
 * wrong option the answer a specific mistake produces, and each `whyWrong`
 * naming that mistake. Options are shuffled when served.
 */

export const ASSESSMENTS = {
  "ma-l0-n1": {
    lessonId: "ma-l0-n1",
    passMark: 70,
    questions: [
      {
        id: "ma01-1",
        type: "mcq",
        difficulty: 1,
        atomId: "a-ma-l0-n1-1",
        prompt: "Write seven million, forty thousand and five in figures.",
        options: [
          { id: "a", text: "7 400 005" },
          { id: "b", text: "7 040 005" },
          { id: "c", text: "7 040 050" },
          { id: "d", text: "740 005" },
        ],
        correct: "b",
        explanation: "Millions group: 7. Thousands group: 040. Ones group: 005. Together: 7 040 005.",
        whyWrong: {
          a: "That is seven million, four hundred thousand and five. Forty thousand is 040 in the thousands group.",
          c: "That ends in fifty. Five in the ones group is 005.",
          d: "A group is missing. Seven million needs three groups after the 7: 7 _ _ _ _ _ _.",
        },
      },
      {
        id: "ma01-2",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-l0-n1-2",
        prompt: "What is the value of the digit 6 in 3 462 518?",
        options: [
          { id: "a", text: "6" },
          { id: "b", text: "6 000" },
          { id: "c", text: "60 000" },
          { id: "d", text: "600 000" },
        ],
        correct: "c",
        explanation: "Reading from the right: 8 ones, 1 ten, 5 hundreds, 2 thousands, 6 ten thousands. 6 × 10 000 = 60 000.",
        whyWrong: {
          a: "6 is the digit. The question asks for its value: the digit times the value of its place.",
          b: "The thousands digit is 2. The 6 is one place further left, in the ten thousands.",
          d: "The hundred thousands digit is 4. The 6 is one place to its right.",
        },
      },
      {
        id: "ma01-3",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-l0-n1-3",
        prompt: "Which list is in ASCENDING order?",
        options: [
          { id: "a", text: "9 870, 9 087, 10 002" },
          { id: "b", text: "10 002, 9 870, 9 087" },
          { id: "c", text: "9 087, 10 002, 9 870" },
          { id: "d", text: "9 087, 9 870, 10 002" },
        ],
        correct: "d",
        explanation: "Ascending means smallest first. 10 002 has the most digits, so it is last. Of 9 087 and 9 870, the hundreds digit decides: 0 < 8.",
        whyWrong: {
          a: "9 870 is larger than 9 087: compare the hundreds digits, 8 and 0.",
          b: "That is descending order, largest first.",
          c: "10 002 has five digits, so it is larger than both four-digit numbers and belongs last.",
        },
      },
      {
        id: "ma01-4",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-l0-n1-4",
        prompt: "Round 63 548 to the nearest thousand.",
        options: [
          { id: "a", text: "64 000" },
          { id: "b", text: "63 000" },
          { id: "c", text: "63 500" },
          { id: "d", text: "60 000" },
        ],
        correct: "a",
        explanation: "The thousands digit is 3. The digit to its right is 5, so round up: 64 000.",
        whyWrong: {
          b: "The deciding digit is 5, and 5 rounds UP.",
          c: "That is 63 548 to the nearest hundred. The question asks for the nearest thousand.",
          d: "That is the nearest ten thousand.",
        },
      },
      {
        id: "ma01-5",
        type: "mcq",
        difficulty: 3,
        atomId: "a-ma-l0-n1-5",
        prompt: "What is MCMXC as an ordinary number?",
        options: [
          { id: "a", text: "2 110" },
          { id: "b", text: "1 910" },
          { id: "c", text: "1 990" },
          { id: "d", text: "1 190" },
        ],
        correct: "c",
        explanation: "M = 1 000, CM = 900, XC = 90. Total 1 990.",
        whyWrong: {
          a: "That adds every letter. C before M means 900, and X before C means 90.",
          b: "XC is 90, not 10. The X is subtracted from the C.",
          d: "CM is 900, not 100 + 90. Split the numeral into M | CM | XC.",
        },
      },
    ],
  },
};

export default ASSESSMENTS;
