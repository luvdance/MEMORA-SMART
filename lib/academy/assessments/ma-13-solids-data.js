/**
 * ASSESSMENTS · MATHEMATICS · MODULE 13 · SOLID SHAPES AND DATA HANDLING
 * SERVER ONLY. See ma-01-place-value.js for how these are written.
 */

export const ASSESSMENTS = {
  "ma-l1-g2": {
    lessonId: "ma-l1-g2",
    passMark: 70,
    questions: [
      {
        id: "ma13-1",
        type: "mcq",
        difficulty: 1,
        atomId: "a-ma-l1-g2-1",
        prompt: "How many edges does a triangular prism have?",
        options: [
          { id: "a", text: "6" },
          { id: "b", text: "9" },
          { id: "c", text: "5" },
          { id: "d", text: "12" },
        ],
        correct: "b",
        explanation: "3 edges on each triangular end (6) and 3 edges joining them: 9. Check: F + V − E = 5 + 6 − 9 = 2.",
        whyWrong: {
          a: "6 is the number of vertices.",
          c: "5 is the number of faces.",
          d: "12 is the number of edges of a cube.",
        },
      },
      {
        id: "ma13-2",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-l1-g2-2",
        prompt: "A net is made of one square and four triangles. Which solid does it fold into?",
        options: [
          { id: "a", text: "Triangular prism" },
          { id: "b", text: "Tetrahedron" },
          { id: "c", text: "Square-based pyramid" },
          { id: "d", text: "Cube" },
        ],
        correct: "c",
        explanation: "A square base with four triangles meeting at a point: a square-based pyramid.",
        whyWrong: {
          a: "A triangular prism's net has two triangles and three rectangles.",
          b: "A tetrahedron's net is four triangles and no square.",
          d: "A cube's net is six squares.",
        },
      },
      {
        id: "ma13-3",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-l1-g2-3",
        prompt: "A tank is 2 m long, 1.5 m wide and 80 cm deep. What is its volume in m³?",
        options: [
          { id: "a", text: "240 m³" },
          { id: "b", text: "2.4 m³" },
          { id: "c", text: "4.3 m³" },
          { id: "d", text: "24 m³" },
        ],
        correct: "b",
        explanation: "80 cm = 0.8 m. V = 2 × 1.5 × 0.8 = 2.4 m³.",
        whyWrong: {
          a: "That uses 80 without converting cm to m.",
          c: "That adds the three lengths. Volume multiplies them.",
          d: "That uses 8 m for 80 cm. 80 cm = 0.8 m.",
        },
      },
      {
        id: "ma13-4",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-l1-g2-2",
        prompt: "What is the total area of the net of a cube with edges of 5 cm?",
        options: [
          { id: "a", text: "125 cm²" },
          { id: "b", text: "25 cm²" },
          { id: "c", text: "150 cm²" },
          { id: "d", text: "100 cm²" },
        ],
        correct: "c",
        explanation: "Six square faces of 5 × 5 = 25 cm²: 6 × 25 = 150 cm².",
        whyWrong: {
          a: "That is the volume, 5³. The net is six squares.",
          b: "That is one face.",
          d: "That counts four faces. A cube has six.",
        },
      },
    ],
  },

  "ma-l1-s1": {
    lessonId: "ma-l1-s1",
    passMark: 70,
    questions: [
      {
        id: "ma13-5",
        type: "mcq",
        difficulty: 1,
        atomId: "a-ma-l1-s1-3",
        prompt: "Find the median of 12, 7, 15, 9, 20, 11.",
        options: [
          { id: "a", text: "15" },
          { id: "b", text: "11.5" },
          { id: "c", text: "12.3" },
          { id: "d", text: "12" },
        ],
        correct: "b",
        explanation: "In order: 7, 9, 11, 12, 15, 20. The middle two are 11 and 12, so the median is 11.5.",
        whyWrong: {
          a: "That is the largest of the two middle numbers of the unsorted list. Sort first.",
          c: "That is the mean (74 ÷ 6). The median is the middle value in order.",
          d: "That takes the middle two of the unsorted list, 15 and 9. Sort the data first.",
        },
      },
      {
        id: "ma13-6",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-l1-s1-3",
        prompt: "The mean of five numbers is 14. Four of them are 10, 18, 12 and 15. What is the fifth?",
        options: [
          { id: "a", text: "14" },
          { id: "b", text: "15" },
          { id: "c", text: "70" },
          { id: "d", text: "13.75" },
        ],
        correct: "b",
        explanation: "Total of five = 5 × 14 = 70. The four add to 55. Fifth = 70 − 55 = 15.",
        whyWrong: {
          a: "The mean is 14, but that does not make the missing number 14.",
          c: "70 is the total of all five numbers.",
          d: "That is the mean of the four you were given.",
        },
      },
      {
        id: "ma13-7",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-l1-s1-1",
        prompt: "Scores: 3, 5, 4, 3, 5, 5, 2, 4, 5, 3. What is the frequency of the score 5?",
        options: [
          { id: "a", text: "5" },
          { id: "b", text: "4" },
          { id: "c", text: "10" },
          { id: "d", text: "20" },
        ],
        correct: "b",
        explanation: "The score 5 appears four times, so its frequency is 4.",
        whyWrong: {
          a: "5 is the score. Its frequency is how many times it appears.",
          c: "10 is the total frequency, the number of scores.",
          d: "That adds the 5s. Frequency counts them.",
        },
      },
      {
        id: "ma13-8",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-l1-s1-2",
        prompt: "On a pictogram, one ● stands for 6 cars. How many symbols show 21 cars?",
        options: [
          { id: "a", text: "21" },
          { id: "b", text: "3" },
          { id: "c", text: "3.5" },
          { id: "d", text: "4" },
        ],
        correct: "c",
        explanation: "21 ÷ 6 = 3.5, so three whole symbols and half a symbol.",
        whyWrong: {
          a: "Each symbol stands for 6 cars, not 1.",
          b: "3 symbols show 18 cars. Half a symbol more shows 3 more.",
          d: "4 symbols show 24 cars, which is too many.",
        },
      },
    ],
  },
};

export default ASSESSMENTS;
