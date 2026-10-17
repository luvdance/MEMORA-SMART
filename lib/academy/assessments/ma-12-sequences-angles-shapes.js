/**
 * ASSESSMENTS · MATHEMATICS · MODULE 12 · SEQUENCES, ANGLES AND PLANE SHAPES
 * SERVER ONLY. See ma-01-place-value.js for how these are written.
 */

export const ASSESSMENTS = {
  "ma-l1-a3": {
    lessonId: "ma-l1-a3",
    passMark: 70,
    questions: [
      {
        id: "ma12-1",
        type: "mcq",
        difficulty: 1,
        atomId: "a-ma-l1-a3-1",
        prompt: "What is the next term: 2, 6, 18, 54, ...?",
        options: [
          { id: "a", text: "90" },
          { id: "b", text: "108" },
          { id: "c", text: "162" },
          { id: "d", text: "58" },
        ],
        correct: "c",
        explanation: "Each term is 3 times the one before: 54 × 3 = 162.",
        whyWrong: {
          a: "That adds 36, the last difference. The differences are not equal; the rule is × 3.",
          b: "That doubles. Each term is 3 times the last: 6 = 2 × 3.",
          d: "That adds 4. The terms are multiplied by 3.",
        },
      },
      {
        id: "ma12-2",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-l1-a3-3",
        prompt: "Find the nth term of 7, 10, 13, 16, ...",
        options: [
          { id: "a", text: "n + 3" },
          { id: "b", text: "3n + 4" },
          { id: "c", text: "3n + 7" },
          { id: "d", text: "7n + 3" },
        ],
        correct: "b",
        explanation: "Difference 3, so 3n + c. First term: 3 + c = 7, so c = 4. Check n = 2: 6 + 4 = 10 ✓.",
        whyWrong: {
          a: "Going up in 3s means 3n, not n + 3. Check: n + 3 gives 4, 5, 6, ...",
          c: "Check n = 1: 3 + 7 = 10, not 7. c = first term − difference = 4.",
          d: "That swaps the numbers. The difference, 3, multiplies n.",
        },
      },
      {
        id: "ma12-3",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-l1-a3-3",
        prompt: "The nth term of a sequence is 5n − 2. What is the 20th term?",
        options: [
          { id: "a", text: "98" },
          { id: "b", text: "102" },
          { id: "c", text: "18" },
          { id: "d", text: "23" },
        ],
        correct: "a",
        explanation: "Put n = 20: 5 × 20 − 2 = 100 − 2 = 98.",
        whyWrong: {
          b: "That adds 2. The rule is 5n − 2.",
          c: "That works out 20 − 2 and leaves out the 5. 5n means 5 × n: 100 − 2 = 98.",
          d: "That adds 5 + 20 − 2. 5n means 5 × n.",
        },
      },
      {
        id: "ma12-4",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-l1-a3-4",
        prompt: "What is the next triangular number after 1, 3, 6, 10, 15?",
        options: [
          { id: "a", text: "20" },
          { id: "b", text: "21" },
          { id: "c", text: "25" },
          { id: "d", text: "18" },
        ],
        correct: "b",
        explanation: "Triangular numbers add 2, 3, 4, 5, then 6: 15 + 6 = 21.",
        whyWrong: {
          a: "That adds 5 again. The amount added grows by 1 each time: next is + 6.",
          c: "25 is a square number.",
          d: "That adds 3. The step after + 5 is + 6.",
        },
      },
    ],
  },

  "ma-l1-g3": {
    lessonId: "ma-l1-g3",
    passMark: 70,
    questions: [
      {
        id: "ma12-5",
        type: "mcq",
        difficulty: 1,
        atomId: "a-ma-l1-g3-1",
        prompt: "What type of angle is 215°?",
        options: [
          { id: "a", text: "Obtuse" },
          { id: "b", text: "Reflex" },
          { id: "c", text: "Straight" },
          { id: "d", text: "Acute" },
        ],
        correct: "b",
        explanation: "215° is between 180° and 360°, so it is reflex.",
        whyWrong: {
          a: "Obtuse angles are between 90° and 180°. 215° is more than 180°.",
          c: "A straight angle is exactly 180°.",
          d: "Acute angles are less than 90°.",
        },
      },
      {
        id: "ma12-6",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-l1-g3-2",
        prompt: "What is the smaller angle between the hands of a clock at 8 o'clock?",
        options: [
          { id: "a", text: "240°" },
          { id: "b", text: "40°" },
          { id: "c", text: "120°" },
          { id: "d", text: "80°" },
        ],
        correct: "c",
        explanation: "Each hour mark is 30°. From 8 to 12 the short way is 4 marks: 4 × 30 = 120°.",
        whyWrong: {
          a: "That is 8 × 30, the reflex angle going the long way round.",
          b: "That uses 5° per hour mark. The marks are 360 ÷ 12 = 30° apart.",
          d: "That uses 10° per mark. Each mark is 30°.",
        },
      },
      {
        id: "ma12-7",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-l1-g3-3",
        prompt: "Angles of 2x, 3x and 80° lie on a straight line. Find x.",
        options: [
          { id: "a", text: "20" },
          { id: "b", text: "56" },
          { id: "c", text: "40" },
          { id: "d", text: "52" },
        ],
        correct: "a",
        explanation: "2x + 3x + 80 = 180, so 5x = 100 and x = 20.",
        whyWrong: {
          b: "That uses 360°: 5x = 280. Angles on a straight line add up to 180°.",
          c: "40 is the size of the 2x angle. The question asks for x.",
          d: "Check: 5 × 52 is far more than 100. 5x = 180 − 80 = 100.",
        },
      },
      {
        id: "ma12-8",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-l1-g3-3",
        prompt: "Two straight lines cross. One angle is 4x − 10 and the angle vertically opposite it is 70°. Find x.",
        options: [
          { id: "a", text: "15" },
          { id: "b", text: "20" },
          { id: "c", text: "30" },
          { id: "d", text: "17.5" },
        ],
        correct: "b",
        explanation: "Vertically opposite angles are equal: 4x − 10 = 70, so 4x = 80 and x = 20.",
        whyWrong: {
          a: "That subtracts 10 from 70 instead of adding it. 4x − 10 = 70 gives 4x = 80, not 60.",
          c: "That makes the two angles add up to 180°. Vertically opposite angles are equal.",
          d: "That forgets the − 10: 4x = 70. Add 10 first: 4x = 80.",
        },
      },
    ],
  },

  "ma-l1-g1": {
    lessonId: "ma-l1-g1",
    passMark: 70,
    questions: [
      {
        id: "ma12-9",
        type: "mcq",
        difficulty: 1,
        atomId: "a-ma-l1-g1-1",
        prompt: "A quadrilateral has exactly one pair of parallel sides. What is it?",
        options: [
          { id: "a", text: "Parallelogram" },
          { id: "b", text: "Trapezium" },
          { id: "c", text: "Kite" },
          { id: "d", text: "Rhombus" },
        ],
        correct: "b",
        explanation: "Exactly one pair of parallel sides defines a trapezium.",
        whyWrong: {
          a: "A parallelogram has TWO pairs of parallel sides.",
          c: "A kite has no parallel sides in general.",
          d: "A rhombus has two pairs of parallel sides.",
        },
      },
      {
        id: "ma12-10",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-l1-g1-3",
        prompt: "A triangle has a base of 14 cm, a perpendicular height of 9 cm and a slanting side of 11 cm. What is its area?",
        options: [
          { id: "a", text: "126 cm²" },
          { id: "b", text: "77 cm²" },
          { id: "c", text: "63 cm²" },
          { id: "d", text: "99 cm²" },
        ],
        correct: "c",
        explanation: "Area = ½ × base × perpendicular height = ½ × 14 × 9 = 63 cm².",
        whyWrong: {
          a: "That forgets the ½. A triangle is half of a parallelogram.",
          b: "That uses the slanting side, 11 cm. Only the perpendicular height gives the area.",
          d: "That multiplies the height by the slanting side. Area = ½ × base × perpendicular height.",
        },
      },
      {
        id: "ma12-11",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-l1-g1-3",
        prompt: "A trapezium has parallel sides of 8 m and 14 m and a perpendicular height of 5 m. Find its area.",
        options: [
          { id: "a", text: "55 m²" },
          { id: "b", text: "110 m²" },
          { id: "c", text: "560 m²" },
          { id: "d", text: "27 m²" },
        ],
        correct: "a",
        explanation: "½ × (8 + 14) × 5 = ½ × 22 × 5 = 55 m².",
        whyWrong: {
          b: "That forgets the ½.",
          c: "That multiplies all three lengths. Add the parallel sides first.",
          d: "That adds the three lengths. Area = ½ × (a + b) × h.",
        },
      },
      {
        id: "ma12-12",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-l1-g1-4",
        prompt: "How many lines of symmetry does a rectangle (that is not a square) have?",
        options: [
          { id: "a", text: "4" },
          { id: "b", text: "2" },
          { id: "c", text: "0" },
          { id: "d", text: "1" },
        ],
        correct: "b",
        explanation: "The lines through the midpoints of opposite sides, one across and one down. The diagonals are not lines of symmetry. So 2 lines.",
        whyWrong: {
          a: "The diagonals of a rectangle are not lines of symmetry: fold along one and the corners miss.",
          c: "It folds exactly along the line joining the midpoints of opposite sides, both ways.",
          d: "There are two such lines, one across and one down.",
        },
      },
    ],
  },
};

export default ASSESSMENTS;
