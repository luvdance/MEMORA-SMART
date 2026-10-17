/**
 * ASSESSMENTS · MATHEMATICS · MODULE 29 · MENSURATION AND TRIANGLE GEOMETRY
 * SERVER ONLY. See ma-01-place-value.js for how these are written.
 */

export const ASSESSMENTS = {
  "ma-l4-g1": {
    lessonId: "ma-l4-g1",
    passMark: 70,
    questions: [
      {
        id: "ma29-1",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-l4-g1-1",
        prompt: "Find the area of a sector of radius 7 cm and angle 72°. Take π = 22/7.",
        options: [
          { id: "a", text: "30.8 cm²" },
          { id: "b", text: "8.8 cm²" },
          { id: "c", text: "154 cm²" },
          { id: "d", text: "61.6 cm²" },
        ],
        correct: "a",
        explanation: "72/360 × 22/7 × 49 = 1/5 × 154 = 30.8 cm².",
        whyWrong: {
          b: "That is the arc length, 72/360 × 2πr. Area uses πr².",
          c: "That is the whole circle. Take 72/360 of it.",
          d: "That uses 72/180. A full circle is 360°.",
        },
      },
      {
        id: "ma29-2",
        type: "mcq",
        difficulty: 3,
        atomId: "a-ma-l4-g1-2",
        prompt: "A sector of radius 14 cm and angle 180° is folded into a cone. What is the radius of the base of the cone?",
        options: [
          { id: "a", text: "7 cm" },
          { id: "b", text: "14 cm" },
          { id: "c", text: "28 cm" },
          { id: "d", text: "3.5 cm" },
        ],
        correct: "a",
        explanation: "Arc = 180/360 × 2π × 14 = 14π. 2πr = 14π, so r = 7 cm.",
        whyWrong: {
          b: "14 cm is the slant height of the cone, not its base radius.",
          c: "The arc becomes the circumference: 2πr = 14π gives r = 7.",
          d: "That halves twice. 2πr = 14π, so r = 7.",
        },
      },
      {
        id: "ma29-3",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-l4-g1-4",
        prompt: "Two similar cylinders have heights 4 cm and 12 cm. The smaller has volume 50 cm³. Find the volume of the larger.",
        options: [
          { id: "a", text: "1 350 cm³" },
          { id: "b", text: "150 cm³" },
          { id: "c", text: "450 cm³" },
          { id: "d", text: "600 cm³" },
        ],
        correct: "a",
        explanation: "Length ratio 1 : 3, so volume ratio 1 : 27. 50 × 27 = 1 350 cm³.",
        whyWrong: {
          b: "That uses the length ratio. Volumes scale by k³ = 27.",
          c: "That uses k² = 9. Volumes scale by k³.",
          d: "That uses 12 × 50. The scale factor is 12 ÷ 4 = 3.",
        },
      },
      {
        id: "ma29-4",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-l4-g1-3",
        prompt: "Find the volume of a hemisphere of radius 21 cm. Take π = 22/7.",
        options: [
          { id: "a", text: "19 404 cm³" },
          { id: "b", text: "38 808 cm³" },
          { id: "c", text: "2 772 cm³" },
          { id: "d", text: "9 702 cm³" },
        ],
        correct: "a",
        explanation: "⅔ × 22/7 × 21³ = ⅔ × 22/7 × 9 261 = 19 404 cm³.",
        whyWrong: {
          b: "That is a full sphere, ⁴⁄₃πr³.",
          c: "That is the curved surface AREA of the hemisphere, 2πr², not its volume.",
          d: "That uses ⅓ instead of ⅔.",
        },
      },
    ],
  },

  "ma-l4-g2": {
    lessonId: "ma-l4-g2",
    passMark: 70,
    questions: [
      {
        id: "ma29-5",
        type: "mcq",
        difficulty: 1,
        atomId: "a-ma-l4-g2-1",
        prompt: "Which of these does NOT prove two triangles congruent?",
        options: [
          { id: "a", text: "Three pairs of equal sides" },
          { id: "b", text: "Three pairs of equal angles" },
          { id: "c", text: "Two sides and the included angle equal" },
          { id: "d", text: "Right angle, equal hypotenuses and one other equal side" },
        ],
        correct: "b",
        explanation: "Equal angles (AAA) give similar triangles, which can be different sizes.",
        whyWrong: {
          a: "SSS proves congruence.",
          c: "SAS proves congruence.",
          d: "RHS proves congruence.",
        },
      },
      {
        id: "ma29-6",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-l4-g2-2",
        prompt: "In parallelogram PQRS, angle P = 68°. Find angle Q.",
        options: [
          { id: "a", text: "68°" },
          { id: "b", text: "112°" },
          { id: "c", text: "22°" },
          { id: "d", text: "292°" },
        ],
        correct: "b",
        explanation: "Adjacent angles of a parallelogram add to 180°: 180 − 68 = 112°.",
        whyWrong: {
          a: "Angle R, opposite P, is 68°. Q is adjacent to P.",
          c: "That uses 90°. Adjacent angles add to 180°.",
          d: "That uses 360°.",
        },
      },
      {
        id: "ma29-7",
        type: "mcq",
        difficulty: 3,
        atomId: "a-ma-l4-g2-4",
        prompt: "In triangle ABC, DE ∥ BC with D on AB and E on AC. AD = 3 cm, DB = 6 cm and DE = 4 cm. Find BC.",
        options: [
          { id: "a", text: "12 cm" },
          { id: "b", text: "8 cm" },
          { id: "c", text: "7 cm" },
          { id: "d", text: "6 cm" },
        ],
        correct: "a",
        explanation: "AB = 9. Similar triangles: BC = 4 × 9/3 = 12 cm.",
        whyWrong: {
          b: "That uses DB/AD = 2. Use the whole side AB = 9.",
          c: "That adds 3. Similar figures are multiplied by a scale factor.",
          d: "That divides by DB instead of AD: 4 × 9/6. Use BC/DE = AB/AD = 9/3.",
        },
      },
      {
        id: "ma29-8",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-l4-g2-5",
        prompt: "A parallelogram and a triangle stand on the same base and between the same parallels. The triangle has area 35 cm². What is the area of the parallelogram?",
        options: [
          { id: "a", text: "70 cm²" },
          { id: "b", text: "35 cm²" },
          { id: "c", text: "17.5 cm²" },
          { id: "d", text: "105 cm²" },
        ],
        correct: "a",
        explanation: "The triangle is half the parallelogram, so the parallelogram is 2 × 35 = 70 cm².",
        whyWrong: {
          b: "They are not equal: the triangle is HALF the parallelogram.",
          c: "That halves the triangle. The parallelogram is the bigger shape.",
          d: "That uses 3 × 35.",
        },
      },
    ],
  },
};

export default ASSESSMENTS;
