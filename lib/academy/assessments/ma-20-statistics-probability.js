/**
 * ASSESSMENTS · MATHEMATICS · MODULE 20 · STATISTICS AND FIRST PROBABILITY
 * SERVER ONLY. See ma-01-place-value.js for how these are written.
 */

export const ASSESSMENTS = {
  "ma-l2-s1": {
    lessonId: "ma-l2-s1",
    passMark: 70,
    questions: [
      {
        id: "ma20-1",
        type: "mcq",
        difficulty: 1,
        atomId: "a-ma-l2-s1-1",
        prompt: "What is the class mark of the class 30 – 39?",
        options: [
          { id: "a", text: "35" },
          { id: "b", text: "34.5" },
          { id: "c", text: "9" },
          { id: "d", text: "29.5" },
        ],
        correct: "b",
        explanation: "Class mark = (30 + 39) ÷ 2 = 34.5.",
        whyWrong: {
          a: "That is 30 plus half of 10. Use (lower limit + upper limit) ÷ 2.",
          c: "9 is the difference of the limits.",
          d: "29.5 is the lower class boundary.",
        },
      },
      {
        id: "ma20-2",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-l2-s1-2",
        prompt: "In a survey of 45 people, 12 chose football. What angle is the football sector on a pie chart?",
        options: [
          { id: "a", text: "12°" },
          { id: "b", text: "96°" },
          { id: "c", text: "26.7°" },
          { id: "d", text: "120°" },
        ],
        correct: "b",
        explanation: "12/45 × 360 = 96°.",
        whyWrong: {
          a: "That is the frequency. Turn it into a fraction of 360°.",
          c: "That is the percentage (12/45 × 100). A pie chart uses 360°.",
          d: "That uses 12/36. The total is 45.",
        },
      },
      {
        id: "ma20-3",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-l2-s1-3",
        prompt: "Find the mean:  x: 2, 3, 4, 5   f: 4, 6, 7, 3",
        options: [
          { id: "a", text: "3.45" },
          { id: "b", text: "17.25" },
          { id: "c", text: "3.5" },
          { id: "d", text: "5" },
        ],
        correct: "a",
        explanation: "Σfx = 8 + 18 + 28 + 15 = 69. Σf = 20. Mean = 69 ÷ 20 = 3.45.",
        whyWrong: {
          b: "That divides by 4, the number of values. Divide by the total frequency, 20.",
          c: "That is the mean of 2, 3, 4, 5, ignoring the frequencies.",
          d: "That divides the total frequency by 4.",
        },
      },
      {
        id: "ma20-4",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-l2-s1-2",
        prompt: "A pie chart of 120 students has a sector of 75° for 'bus'. How many students go by bus?",
        options: [
          { id: "a", text: "75" },
          { id: "b", text: "25" },
          { id: "c", text: "45" },
          { id: "d", text: "20.8" },
        ],
        correct: "b",
        explanation: "75/360 × 120 = 25.",
        whyWrong: {
          a: "75 is the angle, not the number of students.",
          c: "That is 120 − 75, which mixes students with degrees.",
          d: "That uses 75/360 × 100. The total is 120 students.",
        },
      },
    ],
  },

  "ma-l2-s2": {
    lessonId: "ma-l2-s2",
    passMark: 70,
    questions: [
      {
        id: "ma20-5",
        type: "mcq",
        difficulty: 1,
        atomId: "a-ma-l2-s2-1",
        prompt: "Two fair dice are thrown. How many outcomes give a total of 9?",
        options: [
          { id: "a", text: "4" },
          { id: "b", text: "2" },
          { id: "c", text: "9" },
          { id: "d", text: "36" },
        ],
        correct: "a",
        explanation: "(3,6), (4,5), (5,4), (6,3): four outcomes.",
        whyWrong: {
          b: "(3,6) and (6,3) are different outcomes, as are (4,5) and (5,4).",
          c: "That is the total itself, not the number of ways to get it.",
          d: "36 is the size of the whole sample space.",
        },
      },
      {
        id: "ma20-6",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-l2-s2-2",
        prompt: "A coin lands heads 56 times in 80 tosses. How many heads would you expect in 400 tosses at the same rate?",
        options: [
          { id: "a", text: "200" },
          { id: "b", text: "280" },
          { id: "c", text: "456" },
          { id: "d", text: "70" },
        ],
        correct: "b",
        explanation: "Relative frequency = 56/80 = 0.7. Expected = 0.7 × 400 = 280.",
        whyWrong: {
          a: "200 is what a FAIR coin would give. Use the experimental probability, 0.7.",
          c: "That adds 56 and 400.",
          d: "70 is the percentage, 56/80 × 100.",
        },
      },
      {
        id: "ma20-7",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-l2-s2-3",
        prompt: "A bag holds 6 red, 4 white and 5 black beads. One is picked at random. What is the probability it is NOT white?",
        options: [
          { id: "a", text: "4/15" },
          { id: "b", text: "11/15" },
          { id: "c", text: "11/4" },
          { id: "d", text: "4/11" },
        ],
        correct: "b",
        explanation: "15 beads, 4 white. P(not white) = 1 − 4/15 = 11/15.",
        whyWrong: {
          a: "That is P(white).",
          c: "A probability cannot be more than 1. Favourable over TOTAL: 11/15.",
          d: "That divides white by the others. Divide by the total, 15.",
        },
      },
      {
        id: "ma20-8",
        type: "mcq",
        difficulty: 1,
        atomId: "a-ma-l2-s2-3",
        prompt: "A letter is chosen at random from the word MATHEMATICS. What is the probability it is M?",
        options: [
          { id: "a", text: "1/11" },
          { id: "b", text: "2/11" },
          { id: "c", text: "1/8" },
          { id: "d", text: "2/9" },
        ],
        correct: "b",
        explanation: "MATHEMATICS has 11 letters and 2 of them are M. P(M) = 2/11.",
        whyWrong: {
          a: "There are two Ms in MATHEMATICS.",
          c: "That counts the 8 DIFFERENT letters. Every one of the 11 letters can be chosen.",
          d: "That divides by the 9 letters that are not M. Divide by all 11.",
        },
      },
    ],
  },
};

export default ASSESSMENTS;
