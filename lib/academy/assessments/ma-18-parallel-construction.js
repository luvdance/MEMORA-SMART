/**
 * ASSESSMENTS · MATHEMATICS · MODULE 18 · ANGLE RULES AND CONSTRUCTION
 * SERVER ONLY. See ma-01-place-value.js for how these are written.
 */

export const ASSESSMENTS = {
  "ma-l2-g1": {
    lessonId: "ma-l2-g1",
    passMark: 70,
    questions: [
      {
        id: "ma18-1",
        type: "mcq",
        difficulty: 1,
        atomId: "a-ma-l2-g1-1",
        prompt: "A transversal crosses two parallel lines. One angle is 64°. What is its co-interior angle?",
        options: [
          { id: "a", text: "64°" },
          { id: "b", text: "116°" },
          { id: "c", text: "26°" },
          { id: "d", text: "296°" },
        ],
        correct: "b",
        explanation: "Co-interior angles add up to 180°: 180 − 64 = 116°.",
        whyWrong: {
          a: "Alternate and corresponding angles are equal; co-interior angles are not.",
          c: "That uses 90°. Co-interior angles add to 180°.",
          d: "That uses 360°. Co-interior angles add to 180°.",
        },
      },
      {
        id: "ma18-2",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-l2-g1-2",
        prompt: "In triangle PQR, angle P = 52° and the exterior angle at R is 118°. Find angle Q.",
        options: [
          { id: "a", text: "66°" },
          { id: "b", text: "62°" },
          { id: "c", text: "10°" },
          { id: "d", text: "170°" },
        ],
        correct: "a",
        explanation: "The exterior angle at R equals P + Q. So Q = 118 − 52 = 66°.",
        whyWrong: {
          b: "62° is the interior angle at R (180 − 118). The question asks for Q.",
          c: "That treats 118° as an interior angle: 180 − 52 − 118. It is the EXTERIOR angle, equal to P + Q.",
          d: "That adds the two angles. Q = exterior − P.",
        },
      },
      {
        id: "ma18-3",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-l2-g1-3",
        prompt: "Find each interior angle of a regular nonagon (9 sides).",
        options: [
          { id: "a", text: "40°" },
          { id: "b", text: "140°" },
          { id: "c", text: "1 260°" },
          { id: "d", text: "160°" },
        ],
        correct: "b",
        explanation: "Exterior = 360 ÷ 9 = 40°. Interior = 180 − 40 = 140°.",
        whyWrong: {
          a: "That is each EXTERIOR angle.",
          c: "That is the SUM of the interior angles, (9 − 2) × 180.",
          d: "That uses 180 ÷ 9 = 20 as the exterior angle. Exterior angles add to 360°.",
        },
      },
      {
        id: "ma18-4",
        type: "mcq",
        difficulty: 3,
        atomId: "a-ma-l2-g1-3",
        prompt: "The interior angles of a polygon add up to 1 440°. How many sides does it have?",
        options: [
          { id: "a", text: "8" },
          { id: "b", text: "10" },
          { id: "c", text: "12" },
          { id: "d", text: "4" },
        ],
        correct: "b",
        explanation: "(n − 2) × 180 = 1 440, so n − 2 = 8 and n = 10.",
        whyWrong: {
          a: "8 is n − 2. Add 2 to find n.",
          c: "A 12-sided polygon has an angle sum of 1 800°.",
          d: "That divides 1 440 by 360. The interior sum is (n − 2) × 180.",
        },
      },
    ],
  },

  "ma-l2-g2": {
    lessonId: "ma-l2-g2",
    passMark: 70,
    questions: [
      {
        id: "ma18-5",
        type: "mcq",
        difficulty: 1,
        atomId: "a-ma-l2-g2-1",
        prompt: "Every point on the perpendicular bisector of AB is ...",
        options: [
          { id: "a", text: "equidistant from A and B" },
          { id: "b", text: "closer to A than to B" },
          { id: "c", text: "on the line AB" },
          { id: "d", text: "at a right angle to A" },
        ],
        correct: "a",
        explanation: "The perpendicular bisector is exactly the set of points the same distance from A and from B.",
        whyWrong: {
          b: "Points closer to A lie on A's side of the bisector, not on it.",
          c: "Only the midpoint of AB lies on both lines.",
          d: "The bisector is at right angles to the LINE AB, not to a point.",
        },
      },
      {
        id: "ma18-6",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-l2-g2-3",
        prompt: "Which of these angles can NOT be constructed with a ruler and compasses alone?",
        options: [
          { id: "a", text: "75°" },
          { id: "b", text: "135°" },
          { id: "c", text: "70°" },
          { id: "d", text: "22.5°" },
        ],
        correct: "c",
        explanation: "75° = 60° + 15°, 135° = 90° + 45°, 22.5° = half of 45°. 70° cannot be made from 60° and 90° by bisecting and adding.",
        whyWrong: {
          a: "75° = 60° plus half of the 30° between 60° and 90°.",
          b: "135° = 90° + 45°.",
          d: "22.5° is 45° bisected, and 45° is 90° bisected.",
        },
      },
      {
        id: "ma18-7",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-l2-g2-4",
        prompt: "Which set of lengths can form a triangle?",
        options: [
          { id: "a", text: "3 cm, 4 cm, 8 cm" },
          { id: "b", text: "5 cm, 5 cm, 10 cm" },
          { id: "c", text: "6 cm, 7 cm, 12 cm" },
          { id: "d", text: "2 cm, 9 cm, 12 cm" },
        ],
        correct: "c",
        explanation: "6 + 7 = 13, which is more than 12. In every other set the two shorter sides do not exceed the longest.",
        whyWrong: {
          a: "3 + 4 = 7 is less than 8: the arcs never meet.",
          b: "5 + 5 = 10 equals the longest side: the 'triangle' is flat.",
          d: "2 + 9 = 11 is less than 12.",
        },
      },
      {
        id: "ma18-8",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-l2-g2-2",
        prompt: "An angle of 130° is bisected. What is each part?",
        options: [
          { id: "a", text: "65°" },
          { id: "b", text: "260°" },
          { id: "c", text: "50°" },
          { id: "d", text: "25°" },
        ],
        correct: "a",
        explanation: "Bisecting halves the angle: 130 ÷ 2 = 65°.",
        whyWrong: {
          b: "Bisecting halves the angle; it does not double it.",
          c: "That is 180 − 130. Bisecting means halving the 130°.",
          d: "That halves 50°, the angle on the other side of the line. Halve 130°.",
        },
      },
    ],
  },
};

export default ASSESSMENTS;
