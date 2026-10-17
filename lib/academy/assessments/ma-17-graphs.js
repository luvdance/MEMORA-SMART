/**
 * ASSESSMENTS · MATHEMATICS · MODULE 17 · COORDINATES AND STRAIGHT-LINE GRAPHS
 * SERVER ONLY. See ma-01-place-value.js for how these are written.
 */

export const ASSESSMENTS = {
  "ma-l2-a3": {
    lessonId: "ma-l2-a3",
    passMark: 70,
    questions: [
      {
        id: "ma17-1",
        type: "mcq",
        difficulty: 1,
        atomId: "a-ma-l2-a3-1",
        prompt: "In which quadrant does the point (4, −7) lie?",
        options: [
          { id: "a", text: "First" },
          { id: "b", text: "Second" },
          { id: "c", text: "Third" },
          { id: "d", text: "Fourth" },
        ],
        correct: "d",
        explanation: "x is positive (right) and y is negative (down): the fourth quadrant, bottom right.",
        whyWrong: {
          a: "The first quadrant needs y positive as well.",
          b: "The second quadrant is (−, +): x would be negative.",
          c: "The third quadrant is (−, −): x would be negative.",
        },
      },
      {
        id: "ma17-2",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-l2-a3-2",
        prompt: "For y = 5 − 3x, what is y when x = −2?",
        options: [
          { id: "a", text: "−1" },
          { id: "b", text: "11" },
          { id: "c", text: "0" },
          { id: "d", text: "6" },
        ],
        correct: "b",
        explanation: "y = 5 − 3(−2) = 5 + 6 = 11.",
        whyWrong: {
          a: "That uses 3 × 2 = 6 and subtracts it: −3 × (−2) is +6.",
          c: "That treats −3x as −3 + x: 5 − 3 + (−2). 3x means 3 × x.",
          d: "That leaves out the 5: y = 5 + 6 = 11.",
        },
      },
      {
        id: "ma17-3",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-l2-a3-3",
        prompt: "Where does the line y = 4x − 12 cross the x-axis?",
        options: [
          { id: "a", text: "(0, −12)" },
          { id: "b", text: "(3, 0)" },
          { id: "c", text: "(−3, 0)" },
          { id: "d", text: "(0, 3)" },
        ],
        correct: "b",
        explanation: "On the x-axis y = 0: 4x − 12 = 0, so x = 3. The point is (3, 0).",
        whyWrong: {
          a: "That is where it crosses the y-axis (x = 0).",
          c: "4x = 12 gives x = 3, positive.",
          d: "The x-axis point has y = 0, written (x, 0).",
        },
      },
      {
        id: "ma17-4",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-l2-a3-3",
        prompt: "Which point lies on the line y = 2x + 3?",
        options: [
          { id: "a", text: "(2, 6)" },
          { id: "b", text: "(−1, 1)" },
          { id: "c", text: "(3, 8)" },
          { id: "d", text: "(0, 2)" },
        ],
        correct: "b",
        explanation: "x = −1: y = 2(−1) + 3 = 1. So (−1, 1) is on the line.",
        whyWrong: {
          a: "x = 2 gives y = 7, not 6.",
          c: "x = 3 gives y = 9, not 8.",
          d: "x = 0 gives y = 3, not 2.",
        },
      },
      {
        id: "ma17-5",
        type: "mcq",
        difficulty: 3,
        atomId: "a-ma-l2-a3-4",
        prompt: "A cyclist rides 30 km in 2 hours, rests for 1 hour, then rides 18 km in 1 hour. What is her average speed for the whole trip?",
        options: [
          { id: "a", text: "16 km/h" },
          { id: "b", text: "12 km/h" },
          { id: "c", text: "24 km/h" },
          { id: "d", text: "16.5 km/h" },
        ],
        correct: "b",
        explanation: "Total distance 48 km, total time 4 h including the rest: 48 ÷ 4 = 12 km/h.",
        whyWrong: {
          a: "That leaves out the hour of rest: 48 ÷ 3. Average speed uses the total time.",
          c: "That averages the two distances. Speed = total distance ÷ total time.",
          d: "That averages the speeds 15 and 18. Use total distance ÷ total time.",
        },
      },
    ],
  },
};

export default ASSESSMENTS;
