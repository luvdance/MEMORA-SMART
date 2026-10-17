/**
 * ASSESSMENTS · MATHEMATICS · MODULE 37 · VECTORS, TRANSFORMATIONS AND THE EARTH AS A SPHERE
 * SERVER ONLY. See ma-01-place-value.js for how these are written.
 */

export const ASSESSMENTS = {
  "ma-l6-g1": {
    lessonId: "ma-l6-g1",
    passMark: 70,
    questions: [
      {
        id: "ma37-1",
        type: "mcq",
        difficulty: 1,
        atomId: "a-ma-l6-g1-1",
        prompt: "A is (2, −1) and B is (5, 3). Find the column vector AB.",
        options: [
          { id: "a", text: "(3 ; 4)" },
          { id: "b", text: "(−3 ; −4)" },
          { id: "c", text: "(7 ; 2)" },
          { id: "d", text: "(3 ; 2)" },
        ],
        correct: "a",
        explanation: "AB = B − A = (5 − 2 ; 3 − (−1)) = (3 ; 4).",
        whyWrong: {
          b: "That is BA = A − B. AB goes from A to B.",
          c: "That adds the coordinates. Subtract: B − A.",
          d: "3 − (−1) = 4, not 2. Subtracting a negative adds.",
        },
      },
      {
        id: "ma37-2",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-l6-g1-2",
        prompt: "Find the magnitude of (−8 ; 15).",
        options: [
          { id: "a", text: "17" },
          { id: "b", text: "7" },
          { id: "c", text: "289" },
          { id: "d", text: "23" },
        ],
        correct: "a",
        explanation: "√((−8)² + 15²) = √(64 + 225) = √289 = 17.",
        whyWrong: {
          b: "That adds the components, −8 + 15. Use Pythagoras.",
          c: "That is the magnitude squared. Take the square root.",
          d: "That adds the sizes, 8 + 15. Use Pythagoras.",
        },
      },
      {
        id: "ma37-3",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-l6-g1-3",
        prompt: "a = (3 ; −2) and b = (1 ; 4). Find 2a − b.",
        options: [
          { id: "a", text: "(5 ; −8)" },
          { id: "b", text: "(7 ; 0)" },
          { id: "c", text: "(2 ; −6)" },
          { id: "d", text: "(5 ; 0)" },
        ],
        correct: "a",
        explanation: "2a = (6 ; −4). 2a − b = (6 − 1 ; −4 − 4) = (5 ; −8).",
        whyWrong: {
          b: "That is 2a + b. Subtract b.",
          c: "That is a − b. a must be doubled first.",
          d: "−4 − 4 = −8, not 0.",
        },
      },
      {
        id: "ma37-4",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-l6-g1-4",
        prompt: "A and B have position vectors a = (2 ; 6) and b = (8 ; −2). Find the position vector of the midpoint of AB.",
        options: [
          { id: "a", text: "(5 ; 2)" },
          { id: "b", text: "(10 ; 4)" },
          { id: "c", text: "(3 ; −4)" },
          { id: "d", text: "(6 ; −8)" },
        ],
        correct: "a",
        explanation: "OM = ½(a + b) = ½(10 ; 4) = (5 ; 2).",
        whyWrong: {
          b: "That is a + b. Halve it.",
          c: "That is ½AB, the step from A to M. Add a to it.",
          d: "That is AB = b − a.",
        },
      },
    ],
  },

  "ma-l6-g2": {
    lessonId: "ma-l6-g2",
    passMark: 70,
    questions: [
      {
        id: "ma37-5",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-l6-g2-1",
        prompt: "Find the image of (4, −3) after a reflection in the line y = x.",
        options: [
          { id: "a", text: "(−3, 4)" },
          { id: "b", text: "(4, 3)" },
          { id: "c", text: "(−4, −3)" },
          { id: "d", text: "(3, −4)" },
        ],
        correct: "a",
        explanation: "Reflection in y = x swaps the coordinates: (−3, 4).",
        whyWrong: {
          b: "That is a reflection in the x-axis.",
          c: "That is a reflection in the y-axis.",
          d: "That is a reflection in y = −x.",
        },
      },
      {
        id: "ma37-6",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-l6-g2-2",
        prompt: "Find the image of (2, 5) after a rotation of 90° anticlockwise about the origin.",
        options: [
          { id: "a", text: "(−5, 2)" },
          { id: "b", text: "(5, −2)" },
          { id: "c", text: "(−2, −5)" },
          { id: "d", text: "(−2, 5)" },
        ],
        correct: "a",
        explanation: "90° anticlockwise: (x, y) → (−y, x) = (−5, 2).",
        whyWrong: {
          b: "That is 90° clockwise.",
          c: "That is a half turn, 180°.",
          d: "That is a reflection in the y-axis.",
        },
      },
      {
        id: "ma37-7",
        type: "mcq",
        difficulty: 3,
        atomId: "a-ma-l6-g2-3",
        prompt: "Find the image of (3, 1) after an enlargement with scale factor 2 and centre (1, 1).",
        options: [
          { id: "a", text: "(5, 1)" },
          { id: "b", text: "(6, 2)" },
          { id: "c", text: "(7, 3)" },
          { id: "d", text: "(−3, 1)" },
        ],
        correct: "a",
        explanation: "P − C = (2, 0). × 2 = (4, 0). Add C: (5, 1).",
        whyWrong: {
          b: "That enlarges from the origin. Measure from the centre (1, 1).",
          c: "That doubles P and then adds the centre. Double P − C, then add C.",
          d: "That uses scale factor −2.",
        },
      },
      {
        id: "ma37-8",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-l6-g2-4",
        prompt: "Which description of a rotation earns full marks?",
        options: [
          { id: "a", text: "Rotation of 90° clockwise about (0, 0)" },
          { id: "b", text: "Rotation of 90°" },
          { id: "c", text: "Turned clockwise about the origin" },
          { id: "d", text: "Rotation about (0, 0)" },
        ],
        correct: "a",
        explanation: "A rotation needs the centre, the angle and the direction.",
        whyWrong: {
          b: "No centre and no direction.",
          c: "No angle.",
          d: "No angle and no direction.",
        },
      },
    ],
  },

  "ma-l6-g3": {
    lessonId: "ma-l6-g3",
    passMark: 70,
    questions: [
      {
        id: "ma37-9",
        type: "mcq",
        difficulty: 1,
        atomId: "a-ma-l6-g3-1",
        prompt: "Find the difference in latitude between 25°N and 40°S.",
        options: [
          { id: "a", text: "65°" },
          { id: "b", text: "15°" },
          { id: "c", text: "40°" },
          { id: "d", text: "25°" },
        ],
        correct: "a",
        explanation: "Opposite sides of the equator: add. 25 + 40 = 65°.",
        whyWrong: {
          b: "That subtracts. On opposite sides of the equator, add.",
          c: "That is only the southern latitude.",
          d: "That is only the northern latitude.",
        },
      },
      {
        id: "ma37-10",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-l6-g3-2",
        prompt: "Two places on the same meridian differ in latitude by 45°. Find the distance between them along the meridian, to the nearest km. (R = 6400 km, π = 22/7)",
        options: [
          { id: "a", text: "5029 km" },
          { id: "b", text: "2514 km" },
          { id: "c", text: "40 229 km" },
          { id: "d", text: "3556 km" },
        ],
        correct: "a",
        explanation: "45/360 × 2 × 22/7 × 6400 = 5028.6 ≈ 5029 km.",
        whyWrong: {
          b: "That uses πR. The circumference is 2πR.",
          c: "That is the whole circumference. Take 45/360 of it.",
          d: "That multiplies by cos 45°. A meridian is a great circle: no cosine.",
        },
      },
      {
        id: "ma37-11",
        type: "mcq",
        difficulty: 3,
        atomId: "a-ma-l6-g3-2",
        prompt: "Find the distance along the parallel of latitude 60°S between longitudes 10°E and 50°E, to the nearest km. (R = 6400 km, π = 22/7)",
        options: [
          { id: "a", text: "2235 km" },
          { id: "b", text: "4470 km" },
          { id: "c", text: "3871 km" },
          { id: "d", text: "1117 km" },
        ],
        correct: "a",
        explanation: "40/360 × 2 × 22/7 × 6400 × cos 60° = 4469.8 × 0.5 = 2235 km.",
        whyWrong: {
          b: "That leaves out cos 60°. A parallel is a small circle.",
          c: "That uses cos 30°. Use the cosine of the latitude, 60°.",
          d: "That halves the answer twice.",
        },
      },
      {
        id: "ma37-12",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-l6-g3-3",
        prompt: "It is 2:00 pm at a town on longitude 0°. What is the local time at a town on longitude 45°E?",
        options: [
          { id: "a", text: "5:00 pm" },
          { id: "b", text: "11:00 am" },
          { id: "c", text: "2:45 pm" },
          { id: "d", text: "2:03 pm" },
        ],
        correct: "a",
        explanation: "45° × 4 minutes = 180 minutes = 3 hours. East is ahead: 5:00 pm.",
        whyWrong: {
          b: "That goes the wrong way. East is AHEAD.",
          c: "That uses 1 minute per degree. It is 4 minutes per degree.",
          d: "That divides by 15 to get minutes. 45 ÷ 15 = 3 HOURS.",
        },
      },
    ],
  },
};

export default ASSESSMENTS;
