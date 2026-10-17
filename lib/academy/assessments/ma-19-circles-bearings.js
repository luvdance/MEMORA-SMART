/**
 * ASSESSMENTS · MATHEMATICS · MODULE 19 · CIRCLES, COMPOUND SHAPES AND BEARINGS
 * SERVER ONLY. See ma-01-place-value.js for how these are written.
 */

export const ASSESSMENTS = {
  "ma-l2-g3": {
    lessonId: "ma-l2-g3",
    passMark: 70,
    questions: [
      {
        id: "ma19-1",
        type: "mcq",
        difficulty: 1,
        atomId: "a-ma-l2-g3-1",
        prompt: "Find the area of a circle of diameter 28 cm. Take π = 22/7.",
        options: [
          { id: "a", text: "616 cm²" },
          { id: "b", text: "2 464 cm²" },
          { id: "c", text: "88 cm²" },
          { id: "d", text: "176 cm²" },
        ],
        correct: "a",
        explanation: "Radius = 14 cm. A = 22/7 × 14² = 616 cm².",
        whyWrong: {
          b: "That uses the diameter, 28, as the radius.",
          c: "That is the circumference, 2πr = 88 cm.",
          d: "That uses 2r instead of r²: 22/7 × 2 × 28.",
        },
      },
      {
        id: "ma19-2",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-l2-g3-1",
        prompt: "A circular track has a circumference of 132 m. Find its radius. Take π = 22/7.",
        options: [
          { id: "a", text: "42 m" },
          { id: "b", text: "21 m" },
          { id: "c", text: "10.5 m" },
          { id: "d", text: "66 m" },
        ],
        correct: "b",
        explanation: "C = 2πr, so r = 132 ÷ (44/7) = 132 × 7/44 = 21 m.",
        whyWrong: {
          a: "That is the diameter, C ÷ π.",
          c: "That divides by 4π. The circumference is 2πr, so r = C ÷ 2π.",
          d: "That only halves 132. r = C ÷ 2π.",
        },
      },
      {
        id: "ma19-3",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-l2-g3-2",
        prompt: "A circle of radius 7 cm is cut from a square of side 20 cm. Find the area left. Take π = 22/7.",
        options: [
          { id: "a", text: "246 cm²" },
          { id: "b", text: "554 cm²" },
          { id: "c", text: "356 cm²" },
          { id: "d", text: "154 cm²" },
        ],
        correct: "a",
        explanation: "Square 400 cm², circle 22/7 × 49 = 154 cm². 400 − 154 = 246 cm².",
        whyWrong: {
          b: "The circle is cut OUT: subtract it, do not add it.",
          c: "That uses the circumference, 44 cm, instead of the area.",
          d: "154 cm² is the circle itself, the part removed.",
        },
      },
      {
        id: "ma19-4",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-l2-g3-3",
        prompt: "A cylindrical tank has radius 14 cm and height 50 cm. Find its volume in litres. Take π = 22/7.",
        options: [
          { id: "a", text: "30.8 litres" },
          { id: "b", text: "30 800 litres" },
          { id: "c", text: "4.4 litres" },
          { id: "d", text: "61.6 litres" },
        ],
        correct: "a",
        explanation: "V = 22/7 × 14² × 50 = 30 800 cm³. 1 litre = 1 000 cm³, so 30.8 litres.",
        whyWrong: {
          b: "30 800 is in cm³. Divide by 1 000 for litres.",
          c: "That uses 2πrh, the curved surface, not the volume.",
          d: "That uses r × d instead of r²: 22/7 × 14 × 28 × 50.",
        },
      },
    ],
  },

  "ma-l2-g4": {
    lessonId: "ma-l2-g4",
    passMark: 70,
    questions: [
      {
        id: "ma19-5",
        type: "mcq",
        difficulty: 1,
        atomId: "a-ma-l2-g4-1",
        prompt: "On a map with scale 1 : 200 000, two villages are 4.5 cm apart. What is the real distance?",
        options: [
          { id: "a", text: "9 km" },
          { id: "b", text: "90 km" },
          { id: "c", text: "900 m" },
          { id: "d", text: "0.9 km" },
        ],
        correct: "a",
        explanation: "4.5 × 200 000 = 900 000 cm = 9 000 m = 9 km.",
        whyWrong: {
          b: "That divides by 10 000. There are 100 000 cm in a kilometre: 900 000 cm = 9 km.",
          c: "That divides by 1 000. There are 100 cm in a metre: 900 000 cm = 9 000 m.",
          d: "That divides by 1 000 000. There are 100 000 cm in a kilometre.",
        },
      },
      {
        id: "ma19-6",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-l2-g4-2",
        prompt: "Write the compass bearing S35°W as a three-figure bearing.",
        options: [
          { id: "a", text: "035°" },
          { id: "b", text: "145°" },
          { id: "c", text: "215°" },
          { id: "d", text: "325°" },
        ],
        correct: "c",
        explanation: "South is 180°. Turning 35° further towards West, clockwise: 180 + 35 = 215°.",
        whyWrong: {
          a: "035° is N35°E. Measure clockwise from North all the way round.",
          b: "145° is S35°E. West of South is past 180°.",
          d: "325° is N35°W.",
        },
      },
      {
        id: "ma19-7",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-l2-g4-2",
        prompt: "The bearing of Q from P is 290°. What is the bearing of P from Q?",
        options: [
          { id: "a", text: "070°" },
          { id: "b", text: "110°" },
          { id: "c", text: "290°" },
          { id: "d", text: "200°" },
        ],
        correct: "b",
        explanation: "Back bearing: 290 − 180 = 110°.",
        whyWrong: {
          a: "That is 360 − 290. A back bearing differs by 180°.",
          c: "That is the same direction. Going back is the opposite direction.",
          d: "That subtracts 90°. A back bearing differs by 180°.",
        },
      },
      {
        id: "ma19-8",
        type: "mcq",
        difficulty: 3,
        atomId: "a-ma-l2-g4-3",
        prompt: "A man walks from A to B on a bearing of 050°, then from B to C on a bearing of 140°. Find angle ABC.",
        options: [
          { id: "a", text: "90°" },
          { id: "b", text: "50°" },
          { id: "c", text: "190°" },
          { id: "d", text: "130°" },
        ],
        correct: "a",
        explanation: "At B the bearing back to A is 050 + 180 = 230°. Angle ABC = 230 − 140 = 90°.",
        whyWrong: {
          b: "That is the first bearing. Use the back bearing at B.",
          c: "That adds the two bearings.",
          d: "That is 180 − 50. Draw a North line at B and use the back bearing, 230°.",
        },
      },
    ],
  },
};

export default ASSESSMENTS;
