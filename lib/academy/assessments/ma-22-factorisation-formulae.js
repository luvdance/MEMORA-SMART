/**
 * ASSESSMENTS · MATHEMATICS · MODULE 22 · FACTORISATION, FORMULAE AND ALGEBRAIC FRACTIONS
 * SERVER ONLY. See ma-01-place-value.js for how these are written.
 */

export const ASSESSMENTS = {
  "ma-l3-a1": {
    lessonId: "ma-l3-a1",
    passMark: 70,
    questions: [
      {
        id: "ma22-1",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-l3-a1-3",
        prompt: "Factorise x² − 3x − 28.",
        options: [
          { id: "a", text: "(x − 7)(x + 4)" },
          { id: "b", text: "(x + 7)(x − 4)" },
          { id: "c", text: "(x − 14)(x + 2)" },
          { id: "d", text: "(x − 7)(x − 4)" },
        ],
        correct: "a",
        explanation: "Two numbers that multiply to −28 and add to −3: −7 and 4. So (x − 7)(x + 4).",
        whyWrong: {
          b: "That gives +3x in the middle. The signs are the wrong way round.",
          c: "−14 × 2 = −28, but −14 + 2 = −12, not −3.",
          d: "That gives +28 at the end. One number must be negative and one positive.",
        },
      },
      {
        id: "ma22-2",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-l3-a1-2",
        prompt: "Factorise completely 3x² − 75.",
        options: [
          { id: "a", text: "3(x² − 25)" },
          { id: "b", text: "3(x + 5)(x − 5)" },
          { id: "c", text: "(3x + 5)(x − 15)" },
          { id: "d", text: "(√3x + 5√3)(√3x − 5√3)" },
        ],
        correct: "b",
        explanation: "Take out 3: 3(x² − 25). Then x² − 25 is a difference of two squares: 3(x + 5)(x − 5).",
        whyWrong: {
          a: "Not finished: x² − 25 still factorises as a difference of two squares.",
          c: "Expanding gives 3x² − 40x − 75. Take the common factor 3 out first.",
          d: "Equal in value, but always take out the common factor 3 first rather than using surds.",
        },
      },
      {
        id: "ma22-3",
        type: "mcq",
        difficulty: 3,
        atomId: "a-ma-l3-a1-3",
        prompt: "Factorise 3x² + 10x − 8.",
        options: [
          { id: "a", text: "(3x − 2)(x + 4)" },
          { id: "b", text: "(3x + 2)(x − 4)" },
          { id: "c", text: "(3x + 4)(x − 2)" },
          { id: "d", text: "(3x − 4)(x + 2)" },
        ],
        correct: "a",
        explanation: "a × c = −24. Numbers multiplying to −24 and adding to 10: 12 and −2. 3x² + 12x − 2x − 8 = 3x(x + 4) − 2(x + 4) = (3x − 2)(x + 4).",
        whyWrong: {
          b: "Expanding gives 3x² − 10x − 8: the middle sign is wrong.",
          c: "Expanding gives 3x² − 2x − 8.",
          d: "Expanding gives 3x² + 2x − 8.",
        },
      },
      {
        id: "ma22-4",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-l3-a1-4",
        prompt: "Simplify (x² − 16)/(x² − x − 12).",
        options: [
          { id: "a", text: "(x + 4)/(x + 3)" },
          { id: "b", text: "16/(x + 12)" },
          { id: "c", text: "(x − 4)/(x − 3)" },
          { id: "d", text: "4/3" },
        ],
        correct: "a",
        explanation: "Top: (x + 4)(x − 4). Bottom: (x − 4)(x + 3). Cancel (x − 4): (x + 4)/(x + 3).",
        whyWrong: {
          b: "That cancels the x² terms, which are not factors. Factorise first.",
          c: "The bracket that cancels is (x − 4), leaving (x + 4) on top and (x + 3) below.",
          d: "That cancels x's from terms. Only whole brackets cancel.",
        },
      },
    ],
  },

  "ma-l3-a3": {
    lessonId: "ma-l3-a3",
    passMark: 70,
    questions: [
      {
        id: "ma22-5",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-l3-a3-1",
        prompt: "Make v the subject of E = ½mv².",
        options: [
          { id: "a", text: "v = 2E/m" },
          { id: "b", text: "v = √(2E/m)" },
          { id: "c", text: "v = √(E/2m)" },
          { id: "d", text: "v = E/(2m)" },
        ],
        correct: "b",
        explanation: "2E = mv², so v² = 2E/m and v = √(2E/m).",
        whyWrong: {
          a: "That is v². Take the square root.",
          c: "Multiply E by 2 to clear the ½: 2E = mv², not E/2 = mv².",
          d: "Clearing ½ means multiplying by 2, and v² needs a square root.",
        },
      },
      {
        id: "ma22-6",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-l3-a3-2",
        prompt: "Given v² = u² + 2as, find v when u = 5, a = 4 and s = 12.",
        options: [
          { id: "a", text: "11" },
          { id: "b", text: "121" },
          { id: "c", text: "10.05" },
          { id: "d", text: "√96" },
        ],
        correct: "a",
        explanation: "v² = 5² + 2 × 4 × 12 = 25 + 96 = 121, so v = 11.",
        whyWrong: {
          b: "That is v². Take the square root.",
          c: "That uses u instead of u²: v² = 5 + 96 = 101.",
          d: "That leaves out u²: v² = u² + 2as.",
        },
      },
      {
        id: "ma22-7",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-l3-a3-2",
        prompt: "Use 1/f = 1/u + 1/v to find f when u = 20 and v = 30.",
        options: [
          { id: "a", text: "50" },
          { id: "b", text: "12" },
          { id: "c", text: "1/12" },
          { id: "d", text: "25" },
        ],
        correct: "b",
        explanation: "1/f = 1/20 + 1/30 = 3/60 + 2/60 = 5/60 = 1/12, so f = 12.",
        whyWrong: {
          a: "f is not u + v. Add the fractions 1/u and 1/v.",
          c: "That is 1/f. Turn it over to get f.",
          d: "That is the mean of 20 and 30, not the formula.",
        },
      },
      {
        id: "ma22-11",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-l3-a3-1",
        prompt: "Make h the subject of V = πr²h.",
        options: [
          { id: "a", text: "h = V/(πr²)" },
          { id: "b", text: "h = Vπr²" },
          { id: "c", text: "h = V − πr²" },
          { id: "d", text: "h = √(V/π)" },
        ],
        correct: "a",
        explanation: "h is multiplied by πr², so divide both sides by πr²: h = V/(πr²).",
        whyWrong: {
          b: "h is multiplied by πr², so DIVIDE by it to undo that.",
          c: "πr² multiplies h; it is not added to it.",
          d: "That would make r the subject, not h.",
        },
      },
    ],
  },

  "ma-l3-a5": {
    lessonId: "ma-l3-a5",
    passMark: 70,
    questions: [
      {
        id: "ma22-8",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-l3-a5-1",
        prompt: "Simplify (2x + 1)/3 − (x − 4)/2.",
        options: [
          { id: "a", text: "(x + 14)/6" },
          { id: "b", text: "(x − 10)/6" },
          { id: "c", text: "(x + 5)/1" },
          { id: "d", text: "(7x − 10)/6" },
        ],
        correct: "a",
        explanation: "[2(2x + 1) − 3(x − 4)]/6 = (4x + 2 − 3x + 12)/6 = (x + 14)/6.",
        whyWrong: {
          b: "−3(x − 4) is −3x + 12, not −3x − 12. The minus applies to both terms.",
          c: "That subtracts tops and bottoms separately. Use a common denominator.",
          d: "That ADDS the fractions. The sign between them is minus.",
        },
      },
      {
        id: "ma22-9",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-l3-a5-2",
        prompt: "Simplify 6x/5 ÷ 9x²/10.",
        options: [
          { id: "a", text: "4/(3x)" },
          { id: "b", text: "27x³/25" },
          { id: "c", text: "3x/4" },
          { id: "d", text: "4x/3" },
        ],
        correct: "a",
        explanation: "6x/5 × 10/(9x²) = 60x/(45x²) = 4/(3x).",
        whyWrong: {
          b: "That multiplies without turning the second fraction over.",
          c: "That turns the wrong fraction over.",
          d: "x² ÷ x leaves an x on the BOTTOM: 4/(3x).",
        },
      },
      {
        id: "ma22-10",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-l3-a5-1",
        prompt: "Simplify 3/x + 2/(x + 1).",
        options: [
          { id: "a", text: "5/(2x + 1)" },
          { id: "b", text: "(5x + 3)/(x(x + 1))" },
          { id: "c", text: "(5x + 1)/(x(x + 1))" },
          { id: "d", text: "5/(x(x + 1))" },
        ],
        correct: "b",
        explanation: "Common denominator x(x + 1): [3(x + 1) + 2x]/(x(x + 1)) = (5x + 3)/(x(x + 1)).",
        whyWrong: {
          a: "That adds the tops and the bottoms. Use a common denominator.",
          c: "3(x + 1) = 3x + 3, so the constant is 3, not 1.",
          d: "Each numerator must be multiplied by the other denominator first.",
        },
      },
      {
        id: "ma22-12",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-l3-a5-1",
        prompt: "Simplify 2/x − 1/(2x).",
        options: [
          { id: "a", text: "3/(2x)" },
          { id: "b", text: "1/x" },
          { id: "c", text: "3/x" },
          { id: "d", text: "1/(−x)" },
        ],
        correct: "a",
        explanation: "Common denominator 2x: 4/(2x) − 1/(2x) = 3/(2x).",
        whyWrong: {
          b: "That subtracts the tops but keeps x underneath. The denominators must match first: 2/x = 4/(2x).",
          c: "The common denominator is 2x, not x.",
          d: "That subtracts the tops and the bottoms separately.",
        },
      },
    ],
  },
};

export default ASSESSMENTS;
