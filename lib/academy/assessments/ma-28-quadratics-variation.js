/**
 * ASSESSMENTS · MATHEMATICS · MODULE 28 · QUADRATIC EQUATIONS, GRAPHS AND VARIATION
 * SERVER ONLY. See ma-01-place-value.js for how these are written.
 */

export const ASSESSMENTS = {
  "ma-l4-a1": {
    lessonId: "ma-l4-a1",
    passMark: 70,
    questions: [
      {
        id: "ma28-1",
        type: "mcq",
        difficulty: 1,
        atomId: "a-ma-l4-a1-1",
        prompt: "Solve x² + 2x − 15 = 0.",
        options: [
          { id: "a", text: "x = 3 or x = −5" },
          { id: "b", text: "x = −3 or x = 5" },
          { id: "c", text: "x = 15" },
          { id: "d", text: "x = 3 or x = 5" },
        ],
        correct: "a",
        explanation: "(x − 3)(x + 5) = 0, so x = 3 or x = −5.",
        whyWrong: {
          b: "Those are the numbers in the brackets. The roots have the OPPOSITE signs.",
          c: "A quadratic needs factorising, and usually has two roots.",
          d: "3 × 5 = 15, but the constant is −15, so one root is negative.",
        },
      },
      {
        id: "ma28-2",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-l4-a1-3",
        prompt: "What is the discriminant of 3x² − 4x + 5 = 0, and what does it tell you?",
        options: [
          { id: "a", text: "−44: no real roots" },
          { id: "b", text: "76: two real roots" },
          { id: "c", text: "−44: two real roots" },
          { id: "d", text: "0: one repeated root" },
        ],
        correct: "a",
        explanation: "b² − 4ac = 16 − 60 = −44. A negative discriminant means no real roots.",
        whyWrong: {
          b: "That adds 4ac. b² − 4ac = 16 − 4(3)(5) = 16 − 60.",
          c: "A negative discriminant means there are NO real roots: you cannot square-root a negative.",
          d: "16 − 60 is not 0.",
        },
      },
      {
        id: "ma28-3",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-l4-a1-4",
        prompt: "Form the quadratic equation whose roots are −2 and 7.",
        options: [
          { id: "a", text: "x² − 5x − 14 = 0" },
          { id: "b", text: "x² + 5x − 14 = 0" },
          { id: "c", text: "x² − 5x + 14 = 0" },
          { id: "d", text: "x² + 9x − 14 = 0" },
        ],
        correct: "a",
        explanation: "(x + 2)(x − 7) = x² − 5x − 14 = 0.",
        whyWrong: {
          b: "That uses (x − 2)(x + 7): the signs of the roots were not changed.",
          c: "The product of the roots is −14, so the constant is −14.",
          d: "The middle coefficient is −(sum of roots) = −5.",
        },
      },
      {
        id: "ma28-4",
        type: "mcq",
        difficulty: 3,
        atomId: "a-ma-l4-a1-5",
        prompt: "α and β are the roots of x² − 6x + 4 = 0. Find α² + β².",
        options: [
          { id: "a", text: "28" },
          { id: "b", text: "36" },
          { id: "c", text: "32" },
          { id: "d", text: "44" },
        ],
        correct: "a",
        explanation: "α + β = 6 and αβ = 4. α² + β² = 6² − 2 × 4 = 36 − 8 = 28.",
        whyWrong: {
          b: "That is (α + β)². Subtract 2αβ.",
          c: "That subtracts αβ once. It is 2αβ = 8.",
          d: "That ADDS 2αβ. (α + β)² = α² + 2αβ + β², so subtract.",
        },
      },
    ],
  },

  "ma-l4-a2": {
    lessonId: "ma-l4-a2",
    passMark: 70,
    questions: [
      {
        id: "ma28-5",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-l4-a2-2",
        prompt: "Find the turning point of y = x² − 6x + 5.",
        options: [
          { id: "a", text: "(3, −4)" },
          { id: "b", text: "(−3, 32)" },
          { id: "c", text: "(3, 5)" },
          { id: "d", text: "(6, 5)" },
        ],
        correct: "a",
        explanation: "x = −b/(2a) = 6/2 = 3. y = 9 − 18 + 5 = −4. Turning point (3, −4).",
        whyWrong: {
          b: "x = −b/(2a) = −(−6)/2 = +3.",
          c: "Substitute x = 3 into the whole equation: 9 − 18 + 5 = −4.",
          d: "Divide −b by 2a: 6/2 = 3, not 6.",
        },
      },
      {
        id: "ma28-6",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-l4-a2-3",
        prompt: "The curve y = x² − 4 and the line y = 3x are drawn. At what values of x do they meet?",
        options: [
          { id: "a", text: "x = 4 or x = −1" },
          { id: "b", text: "x = −4 or x = 1" },
          { id: "c", text: "x = 2 or x = −2" },
          { id: "d", text: "x = 3 or x = 0" },
        ],
        correct: "a",
        explanation: "x² − 4 = 3x, so x² − 3x − 4 = 0, (x − 4)(x + 1) = 0, x = 4 or x = −1.",
        whyWrong: {
          b: "The signs are swapped: (x − 4)(x + 1) = 0 gives x = 4 and x = −1.",
          c: "Those are where the curve meets the x-axis, not the line.",
          d: "Set the two expressions for y equal and solve.",
        },
      },
      {
        id: "ma28-7",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-l4-a2-4",
        prompt: "A tangent to a curve passes through (2, 5) and (6, −3). What is its gradient?",
        options: [
          { id: "a", text: "−2" },
          { id: "b", text: "2" },
          { id: "c", text: "−1/2" },
          { id: "d", text: "0.5" },
        ],
        correct: "a",
        explanation: "Gradient = (−3 − 5)/(6 − 2) = −8/4 = −2.",
        whyWrong: {
          b: "The y-value goes DOWN from 5 to −3, so the gradient is negative.",
          c: "That is change in x over change in y, upside down.",
          d: "Gradient = change in y ÷ change in x = −8 ÷ 4.",
        },
      },
      {
        id: "ma28-8",
        type: "mcq",
        difficulty: 1,
        atomId: "a-ma-l4-a2-1",
        prompt: "For y = x² − 3x, what is y when x = −2?",
        options: [
          { id: "a", text: "10" },
          { id: "b", text: "2" },
          { id: "c", text: "−2" },
          { id: "d", text: "−10" },
        ],
        correct: "a",
        explanation: "(−2)² − 3(−2) = 4 + 6 = 10.",
        whyWrong: {
          b: "That uses (−2)² = −4: −4 + 6 = 2. A square is never negative: (−2)² = +4.",
          c: "That subtracts 6: 4 − 6. But −3 × (−2) = +6, so add it.",
          d: "Both signs are wrong: (−2)² = +4 and −3(−2) = +6.",
        },
      },
    ],
  },

  "ma-l4-a3": {
    lessonId: "ma-l4-a3",
    passMark: 70,
    questions: [
      {
        id: "ma28-9",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-l4-a3-1",
        prompt: "y varies inversely as the square of x. y = 8 when x = 3. Find y when x = 6.",
        options: [
          { id: "a", text: "2" },
          { id: "b", text: "4" },
          { id: "c", text: "32" },
          { id: "d", text: "16" },
        ],
        correct: "a",
        explanation: "y = k/x². k = 8 × 9 = 72. y = 72/36 = 2.",
        whyWrong: {
          b: "That is inverse variation with x, not x². Doubling x divides y by 4.",
          c: "That is direct variation with x². 'Inversely' means divide.",
          d: "That is direct variation with x.",
        },
      },
      {
        id: "ma28-10",
        type: "mcq",
        difficulty: 3,
        atomId: "a-ma-l4-a3-2",
        prompt: "A taxi fare is partly fixed and partly varies with distance. 5 km costs ₦1 500 and 12 km costs ₦2 900. What does 20 km cost?",
        options: [
          { id: "a", text: "₦4 500" },
          { id: "b", text: "₦6 000" },
          { id: "c", text: "₦4 833" },
          { id: "d", text: "₦4 000" },
        ],
        correct: "a",
        explanation: "F = a + bd. 7b = 1 400, so b = 200 and a = 1 500 − 1 000 = 500. F = 500 + 200 × 20 = ₦4 500.",
        whyWrong: {
          b: "That treats the fare as directly proportional to distance: 1 500 ÷ 5 × 20.",
          c: "That uses direct proportion from the 12 km fare: 2 900 ÷ 12 × 20.",
          d: "That uses only the distance part, 200 × 20, and forgets the fixed ₦500.",
        },
      },
      {
        id: "ma28-11",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-l4-a3-3",
        prompt: "The area of a circle varies as the square of its radius. A circle of radius 3 cm has area 28.26 cm². What is the area when the radius is 6 cm?",
        options: [
          { id: "a", text: "113.04 cm²" },
          { id: "b", text: "56.52 cm²" },
          { id: "c", text: "84.78 cm²" },
          { id: "d", text: "254.34 cm²" },
        ],
        correct: "a",
        explanation: "A = kr². k = 28.26 ÷ 9 = 3.14. A = 3.14 × 36 = 113.04 cm².",
        whyWrong: {
          b: "That doubles the area. Doubling r multiplies r² by 4.",
          c: "That multiplies by 3. (6/3)² = 4.",
          d: "That multiplies by 9 (3²). The radius doubles, so the area multiplies by 2² = 4.",
        },
      },
      {
        id: "ma28-12",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-l4-a3-2",
        prompt: "z varies jointly as x and y. z = 24 when x = 2 and y = 3. Find z when x = 5 and y = 4.",
        options: [
          { id: "a", text: "80" },
          { id: "b", text: "20" },
          { id: "c", text: "60" },
          { id: "d", text: "43.2" },
        ],
        correct: "a",
        explanation: "z = kxy. 24 = k × 6, so k = 4. z = 4 × 5 × 4 = 80.",
        whyWrong: {
          b: "That forgets k: it is 5 × 4 alone. Find k = 4 first.",
          c: "That varies with x only: 24 ÷ 2 × 5 = 60. Joint variation uses x AND y.",
          d: "That uses z = k(x + y): k = 24 ÷ 5 = 4.8, then 4.8 × 9. Jointly means multiply x and y.",
        },
      },
    ],
  },
};

export default ASSESSMENTS;
