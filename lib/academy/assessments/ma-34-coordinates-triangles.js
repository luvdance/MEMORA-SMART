/**
 * ASSESSMENTS · MATHEMATICS · MODULE 34 · COORDINATE GEOMETRY AND SOLVING TRIANGLES
 * SERVER ONLY. See ma-01-place-value.js for how these are written.
 */

export const ASSESSMENTS = {
  "ma-l5-g2": {
    lessonId: "ma-l5-g2",
    passMark: 70,
    questions: [
      {
        id: "ma34-1",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-l5-g2-1",
        prompt: "Find the distance between A(−2, 3) and B(4, −5).",
        options: [
          { id: "a", text: "10" },
          { id: "b", text: "100" },
          { id: "c", text: "2.83" },
          { id: "d", text: "14" },
        ],
        correct: "a",
        explanation: "x₂ − x₁ = 6, y₂ − y₁ = −8. Distance = √(36 + 64) = √100 = 10.",
        whyWrong: {
          b: "That is the distance squared. Take the square root.",
          c: "That ADDS the coordinates: √(2² + (−2)²). Subtract them.",
          d: "That adds 6 and 8. Use Pythagoras.",
        },
      },
      {
        id: "ma34-2",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-l5-g2-2",
        prompt: "Find the gradient of the line through (1, −2) and (5, 10).",
        options: [
          { id: "a", text: "3" },
          { id: "b", text: "1/3" },
          { id: "c", text: "−3" },
          { id: "d", text: "2" },
        ],
        correct: "a",
        explanation: "m = (10 − (−2)) ÷ (5 − 1) = 12 ÷ 4 = 3.",
        whyWrong: {
          b: "That is change in x over change in y. Gradient is y over x.",
          c: "The differences were taken in opposite orders. Use the same order top and bottom.",
          d: "That treats 10 − (−2) as 8. Subtracting a negative adds: 12.",
        },
      },
      {
        id: "ma34-3",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-l5-g2-3",
        prompt: "Find the equation of the line with gradient −2 through (3, 1).",
        options: [
          { id: "a", text: "y = −2x + 7" },
          { id: "b", text: "y = −2x − 5" },
          { id: "c", text: "y = −2x + 1" },
          { id: "d", text: "y = −2x" },
        ],
        correct: "a",
        explanation: "y − 1 = −2(x − 3) = −2x + 6, so y = −2x + 7.",
        whyWrong: {
          b: "That uses (x + 3). The formula is y − y₁ = m(x − x₁).",
          c: "That uses the y-coordinate as c. c is where the line crosses the y-axis.",
          d: "That leaves out c, so the line does not pass through (3, 1).",
        },
      },
      {
        id: "ma34-4",
        type: "mcq",
        difficulty: 3,
        atomId: "a-ma-l5-g2-4",
        prompt: "What is the gradient of a line perpendicular to 3y = 6x − 1?",
        options: [
          { id: "a", text: "−1/2" },
          { id: "b", text: "2" },
          { id: "c", text: "1/2" },
          { id: "d", text: "−2" },
        ],
        correct: "a",
        explanation: "y = 2x − 1/3, gradient 2. Perpendicular gradient = −1/2.",
        whyWrong: {
          b: "That is the gradient of a PARALLEL line.",
          c: "Turn it upside down AND change the sign.",
          d: "Change the sign AND turn it upside down.",
        },
      },
    ],
  },

  "ma-l5-t1": {
    lessonId: "ma-l5-t1",
    passMark: 70,
    questions: [
      {
        id: "ma34-5",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-l5-t1-1",
        prompt: "In triangle ABC, a = 10 cm, A = 30° and B = 45°. Find b, to 1 decimal place.",
        options: [
          { id: "a", text: "14.1 cm" },
          { id: "b", text: "7.1 cm" },
          { id: "c", text: "10.0 cm" },
          { id: "d", text: "15.0 cm" },
        ],
        correct: "a",
        explanation: "b = a sin B / sin A = 10 × 0.7071 ÷ 0.5 = 14.1 cm.",
        whyWrong: {
          b: "That is 10 sin 30° / sin 45°: the sines are upside down.",
          c: "Sides are only equal when the opposite angles are equal.",
          d: "That scales by the angles, 10 × 45/30. Use the SINES of the angles.",
        },
      },
      {
        id: "ma34-6",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-l5-t1-2",
        prompt: "In triangle ABC, a = 5 cm, b = 8 cm and C = 60°. Find c.",
        options: [
          { id: "a", text: "7 cm" },
          { id: "b", text: "11.4 cm" },
          { id: "c", text: "49 cm" },
          { id: "d", text: "9.4 cm" },
        ],
        correct: "a",
        explanation: "c² = 25 + 64 − 2 × 5 × 8 × cos 60° = 89 − 40 = 49, so c = 7 cm.",
        whyWrong: {
          b: "That ADDS 2ab cos C. The cosine rule subtracts it.",
          c: "That is c². Take the square root.",
          d: "That is √89: it leaves out the 2ab cos C term, as if C were 90°.",
        },
      },
      {
        id: "ma34-7",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-l5-t1-3",
        prompt: "Find the area of a triangle with sides 8 cm and 10 cm and an included angle of 150°.",
        options: [
          { id: "a", text: "20 cm²" },
          { id: "b", text: "40 cm²" },
          { id: "c", text: "34.6 cm²" },
          { id: "d", text: "80 cm²" },
        ],
        correct: "a",
        explanation: "Area = ½ × 8 × 10 × sin 150° = 40 × 0.5 = 20 cm².",
        whyWrong: {
          b: "That is ½ × 8 × 10, as if the angle were 90°. Multiply by sin 150°.",
          c: "That uses cos 30° instead of sin 150°.",
          d: "That is 8 × 10 with no ½ and no sine.",
        },
      },
      {
        id: "ma34-8",
        type: "mcq",
        difficulty: 3,
        atomId: "a-ma-l5-t1-5",
        prompt: "From the top of a 40 m cliff, the angles of depression of two boats in line with its foot are 45° and 30°. How far apart are the boats?",
        options: [
          { id: "a", text: "29.3 m" },
          { id: "b", text: "69.3 m" },
          { id: "c", text: "40 m" },
          { id: "d", text: "109.3 m" },
        ],
        correct: "a",
        explanation: "Near: 40 ÷ tan 45° = 40 m. Far: 40 ÷ tan 30° = 69.3 m. Apart: 29.3 m.",
        whyWrong: {
          b: "That is the far boat's distance from the cliff. Subtract the near one.",
          c: "That is the near boat's distance from the cliff.",
          d: "That adds the distances. Both boats are on the same side of the cliff.",
        },
      },
    ],
  },
};

export default ASSESSMENTS;
