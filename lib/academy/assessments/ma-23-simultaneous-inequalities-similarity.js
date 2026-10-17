/**
 * ASSESSMENTS · MATHEMATICS · MODULE 23 · SIMULTANEOUS EQUATIONS, INEQUALITIES AND SIMILARITY
 * SERVER ONLY. See ma-01-place-value.js for how these are written.
 */

export const ASSESSMENTS = {
  "ma-l3-a2": {
    lessonId: "ma-l3-a2",
    passMark: 70,
    questions: [
      {
        id: "ma23-1",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-l3-a2-1",
        prompt: "Solve simultaneously: x + y = 10 and x − y = 4.",
        options: [
          { id: "a", text: "x = 7, y = 3" },
          { id: "b", text: "x = 3, y = 7" },
          { id: "c", text: "x = 14, y = −4" },
          { id: "d", text: "x = 5, y = 5" },
        ],
        correct: "a",
        explanation: "Add: 2x = 14, so x = 7. Then y = 10 − 7 = 3. Check: 7 − 3 = 4 ✓.",
        whyWrong: {
          b: "Check the second equation: 3 − 7 = −4, not 4. The values are swapped.",
          c: "That adds the right-hand sides but forgets to divide by 2.",
          d: "5 + 5 = 10, but 5 − 5 = 0, not 4.",
        },
      },
      {
        id: "ma23-2",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-l3-a2-1",
        prompt: "Solve simultaneously: 3x + 2y = 16 and 2x − y = 6.",
        options: [
          { id: "a", text: "x = 4, y = 2" },
          { id: "b", text: "x = 2, y = 5" },
          { id: "c", text: "x = 4, y = −2" },
          { id: "d", text: "x = 28/7, y = 10" },
        ],
        correct: "a",
        explanation: "Second × 2: 4x − 2y = 12. Add to the first: 7x = 28, x = 4. Then 2(4) − y = 6, so y = 2.",
        whyWrong: {
          b: "Check the second equation: 4 − 5 = −1, not 6.",
          c: "Check the first equation: 12 − 4 = 8, not 16. y is positive.",
          d: "x = 28/7 = 4 is right, but y must satisfy 2x − y = 6: y = 2.",
        },
      },
      {
        id: "ma23-3",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-l3-a2-2",
        prompt: "Solve: y = 3x − 2 and 2x + y = 13.",
        options: [
          { id: "a", text: "x = 3, y = 7" },
          { id: "b", text: "x = 2.2, y = 4.6" },
          { id: "c", text: "x = 7, y = 3" },
          { id: "d", text: "x = 15, y = 43" },
        ],
        correct: "a",
        explanation: "2x + (3x − 2) = 13, so 5x = 15, x = 3, and y = 3(3) − 2 = 7.",
        whyWrong: {
          b: "That uses 5x = 11, dropping the sign of the −2. 2x + 3x − 2 = 13 gives 5x = 15.",
          c: "The values are swapped: give x first.",
          d: "That stops at 5x = 15. Divide by 5.",
        },
      },
      {
        id: "ma23-4",
        type: "mcq",
        difficulty: 3,
        atomId: "a-ma-l3-a2-4",
        prompt: "2 bags of rice and 3 bags of beans cost ₦34 000. 1 bag of rice and 2 bags of beans cost ₦20 000. What does one bag of beans cost?",
        options: [
          { id: "a", text: "₦6 000" },
          { id: "b", text: "₦8 000" },
          { id: "c", text: "₦7 000" },
          { id: "d", text: "₦12 000" },
        ],
        correct: "a",
        explanation: "2r + 3b = 34 000 and r + 2b = 20 000. Double the second: 2r + 4b = 40 000. Subtract: b = 6 000 (and r = 8 000). One bag of beans costs ₦6 000.",
        whyWrong: {
          b: "₦8 000 is a bag of rice. The question asks for beans.",
          c: "Check: 2r + 3b with b = 7 000 does not satisfy both equations.",
          d: "That is two bags of beans.",
        },
      },
    ],
  },

  "ma-l3-a4": {
    lessonId: "ma-l3-a4",
    passMark: 70,
    questions: [
      {
        id: "ma23-5",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-l3-a4-1",
        prompt: "Solve 7 − 3x < 19.",
        options: [
          { id: "a", text: "x > −4" },
          { id: "b", text: "x < −4" },
          { id: "c", text: "x > 4" },
          { id: "d", text: "x < 4" },
        ],
        correct: "a",
        explanation: "−3x < 12. Dividing by −3 reverses the sign: x > −4.",
        whyWrong: {
          b: "Dividing by a NEGATIVE number reverses the inequality sign.",
          c: "−3x < 12 gives −4, not 4: 12 ÷ (−3) = −4.",
          d: "Both the sign of the number and the direction are wrong: x > −4.",
        },
      },
      {
        id: "ma23-6",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-l3-a4-2",
        prompt: "List the integers that satisfy −3 ≤ x < 2.",
        options: [
          { id: "a", text: "−3, −2, −1, 0, 1" },
          { id: "b", text: "−2, −1, 0, 1" },
          { id: "c", text: "−3, −2, −1, 0, 1, 2" },
          { id: "d", text: "−2, −1, 0, 1, 2" },
        ],
        correct: "a",
        explanation: "≤ includes −3; < excludes 2. So −3, −2, −1, 0, 1.",
        whyWrong: {
          b: "−3 ≤ x INCLUDES −3.",
          c: "x < 2 does NOT include 2.",
          d: "Both ends are wrong: −3 is in, 2 is out.",
        },
      },
      {
        id: "ma23-7",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-l3-a4-1",
        prompt: "Solve 2(x + 3) ≥ 5x − 9.",
        options: [
          { id: "a", text: "x ≤ 5" },
          { id: "b", text: "x ≥ 5" },
          { id: "c", text: "x ≤ 4" },
          { id: "d", text: "x ≤ −1" },
        ],
        correct: "a",
        explanation: "2x + 6 ≥ 5x − 9, so 15 ≥ 3x, giving x ≤ 5.",
        whyWrong: {
          b: "15 ≥ 3x means 3x is at most 15: x ≤ 5.",
          c: "That expands 2(x + 3) as 2x + 3, giving 12 ≥ 3x. Multiply both terms in the bracket by 2.",
          d: "That moves −9 across without changing its sign: −3x ≥ 3. It should be 6 + 9 = 15 ≥ 3x.",
        },
      },
      {
        id: "ma23-11",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-l3-a4-1",
        prompt: "Solve 4x + 3 ≤ 2x + 11.",
        options: [
          { id: "a", text: "x ≤ 4" },
          { id: "b", text: "x ≥ 4" },
          { id: "c", text: "x ≤ 7" },
          { id: "d", text: "x ≤ 2.33" },
        ],
        correct: "a",
        explanation: "4x − 2x ≤ 11 − 3, so 2x ≤ 8 and x ≤ 4.",
        whyWrong: {
          b: "Only dividing by a NEGATIVE number reverses the sign. Here you divide by 2.",
          c: "That adds 3 to 11 instead of subtracting: 2x ≤ 14.",
          d: "That divides by 6, adding 4x and 2x. Collect x terms by subtracting: 4x − 2x.",
        },
      },
    ],
  },

  "ma-l3-g1": {
    lessonId: "ma-l3-g1",
    passMark: 70,
    questions: [
      {
        id: "ma23-8",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-l3-g1-2",
        prompt: "Triangles ABC and XYZ are similar. AB = 4 cm, XY = 10 cm and BC = 6 cm. Find YZ.",
        options: [
          { id: "a", text: "15 cm" },
          { id: "b", text: "12 cm" },
          { id: "c", text: "2.4 cm" },
          { id: "d", text: "60 cm" },
        ],
        correct: "a",
        explanation: "Scale factor = 10 ÷ 4 = 2.5. YZ = 6 × 2.5 = 15 cm.",
        whyWrong: {
          b: "That adds 6 cm (the difference between 10 and 4). Similar shapes are multiplied, not added to.",
          c: "That divides by the scale factor. XYZ is the larger triangle.",
          d: "That multiplies 6 by 10 without dividing by 4.",
        },
      },
      {
        id: "ma23-9",
        type: "mcq",
        difficulty: 3,
        atomId: "a-ma-l3-g1-3",
        prompt: "The point (4, 1) is enlarged with centre (1, 1) and scale factor 2. What is the image?",
        options: [
          { id: "a", text: "(8, 2)" },
          { id: "b", text: "(7, 1)" },
          { id: "c", text: "(9, 3)" },
          { id: "d", text: "(10, 1)" },
        ],
        correct: "b",
        explanation: "Centre to point: (3, 0). Doubled: (6, 0). Image = (1 + 6, 1 + 0) = (7, 1).",
        whyWrong: {
          a: "That enlarges from the origin. The centre is (1, 1).",
          c: "That doubles the point and the centre: 2 × (4, 1) + (1, 1). Double the distance FROM the centre.",
          d: "That adds the doubled distance (6, 0) to the POINT. Add it to the CENTRE: (1, 1) + (6, 0) = (7, 1).",
        },
      },
      {
        id: "ma23-10",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-l3-g1-1",
        prompt: "Which rectangle is similar to a 6 cm by 9 cm rectangle?",
        options: [
          { id: "a", text: "8 cm by 11 cm" },
          { id: "b", text: "10 cm by 15 cm" },
          { id: "c", text: "9 cm by 12 cm" },
          { id: "d", text: "12 cm by 15 cm" },
        ],
        correct: "b",
        explanation: "10/6 = 5/3 and 15/9 = 5/3: the same scale factor.",
        whyWrong: {
          a: "Adding 2 to each side does not keep the shape: 8/6 ≠ 11/9.",
          c: "9/6 = 1.5 but 12/9 = 1.33.",
          d: "12/6 = 2 but 15/9 = 1.67.",
        },
      },
      {
        id: "ma23-12",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-l3-g1-2",
        prompt: "A model car is built to a scale of 1 : 20. The model is 18 cm long. How long is the real car?",
        options: [
          { id: "a", text: "3.6 m" },
          { id: "b", text: "0.9 m" },
          { id: "c", text: "36 m" },
          { id: "d", text: "38 cm" },
        ],
        correct: "a",
        explanation: "Real length = 18 × 20 = 360 cm = 3.6 m.",
        whyWrong: {
          b: "That divides by 20. The real car is bigger, so multiply.",
          c: "360 cm is 3.6 m, not 36 m.",
          d: "That adds 20. A scale factor multiplies.",
        },
      },
    ],
  },
};

export default ASSESSMENTS;
