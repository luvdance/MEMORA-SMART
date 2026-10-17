/**
 * ASSESSMENTS · MATHEMATICS · MODULE 24 · PYTHAGORAS, TRIGONOMETRY, VOLUME AND AVERAGES
 * SERVER ONLY. See ma-01-place-value.js for how these are written.
 */

export const ASSESSMENTS = {
  "ma-l3-t1": {
    lessonId: "ma-l3-t1",
    passMark: 70,
    questions: [
      {
        id: "ma24-1",
        type: "mcq",
        difficulty: 1,
        atomId: "a-ma-l3-t1-1",
        prompt: "A ladder 10 m long leans against a wall with its foot 6 m from the wall. How high up the wall does it reach?",
        options: [
          { id: "a", text: "8 m" },
          { id: "b", text: "11.7 m" },
          { id: "c", text: "4 m" },
          { id: "d", text: "16 m" },
        ],
        correct: "a",
        explanation: "The ladder is the hypotenuse. h² = 10² − 6² = 100 − 36 = 64, so h = 8 m.",
        whyWrong: {
          b: "That adds the squares. The ladder is the HYPOTENUSE, so subtract: 100 − 36.",
          c: "That subtracts the lengths, not their squares.",
          d: "That adds the lengths.",
        },
      },
      {
        id: "ma24-2",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-l3-t1-2",
        prompt: "In a right-angled triangle, the side opposite θ is 8 and the hypotenuse is 17. What is tan θ?",
        options: [
          { id: "a", text: "8/17" },
          { id: "b", text: "8/15" },
          { id: "c", text: "15/8" },
          { id: "d", text: "15/17" },
        ],
        correct: "b",
        explanation: "Adjacent = √(17² − 8²) = √225 = 15. tan θ = opposite/adjacent = 8/15.",
        whyWrong: {
          a: "That is sin θ, opposite/hypotenuse.",
          c: "That is adjacent/opposite, upside down.",
          d: "That is cos θ, adjacent/hypotenuse.",
        },
      },
      {
        id: "ma24-3",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-l3-t1-3",
        prompt: "In a right-angled triangle the hypotenuse is 20 cm and one angle is 30°. What is the side opposite the 30° angle?",
        options: [
          { id: "a", text: "10 cm" },
          { id: "b", text: "17.3 cm" },
          { id: "c", text: "11.5 cm" },
          { id: "d", text: "40 cm" },
        ],
        correct: "a",
        explanation: "sin 30° = x/20, so x = 20 × sin 30° = 20 × 0.5 = 10 cm.",
        whyWrong: {
          b: "That uses cos 30°, which gives the ADJACENT side.",
          c: "That uses tan 30° with the hypotenuse.",
          d: "That divides by sin 30°. Multiply: x = 20 sin 30°.",
        },
      },
      {
        id: "ma24-4",
        type: "mcq",
        difficulty: 3,
        atomId: "a-ma-l3-t1-4",
        prompt: "From a point 30 m from the foot of a building, the angle of elevation of the top is 45°. How tall is the building?",
        options: [
          { id: "a", text: "30 m" },
          { id: "b", text: "21.2 m" },
          { id: "c", text: "42.4 m" },
          { id: "d", text: "15 m" },
        ],
        correct: "a",
        explanation: "h = 30 tan 45° = 30 × 1 = 30 m.",
        whyWrong: {
          b: "That uses sin 45°. Height and ground distance are opposite and adjacent: use tan.",
          c: "That is the length of the line of sight, the hypotenuse.",
          d: "tan 45° = 1, not 0.5.",
        },
      },
    ],
  },

  "ma-l3-g2": {
    lessonId: "ma-l3-g2",
    passMark: 70,
    questions: [
      {
        id: "ma24-5",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-l3-g2-1",
        prompt: "Find the total surface area of a closed cylinder of radius 7 cm and height 5 cm. Take π = 22/7.",
        options: [
          { id: "a", text: "220 cm²" },
          { id: "b", text: "528 cm²" },
          { id: "c", text: "374 cm²" },
          { id: "d", text: "770 cm²" },
        ],
        correct: "b",
        explanation: "Curved: 2 × 22/7 × 7 × 5 = 220. Ends: 2 × 22/7 × 49 = 308. Total 528 cm².",
        whyWrong: {
          a: "That is the curved surface only. Add the two circular ends.",
          c: "That adds only ONE end. A closed cylinder has two.",
          d: "That is the volume, πr²h.",
        },
      },
      {
        id: "ma24-6",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-l3-g2-2",
        prompt: "A cone has base radius 7 cm and height 12 cm. Find its volume. Take π = 22/7.",
        options: [
          { id: "a", text: "616 cm³" },
          { id: "b", text: "1 848 cm³" },
          { id: "c", text: "264 cm³" },
          { id: "d", text: "308 cm³" },
        ],
        correct: "a",
        explanation: "V = ⅓ × 22/7 × 49 × 12 = ⅓ × 1 848 = 616 cm³.",
        whyWrong: {
          b: "That forgets the ⅓. It is the volume of the cylinder.",
          c: "That is πrh, which is not a volume. V = ⅓πr²h.",
          d: "That uses ⅙ instead of ⅓.",
        },
      },
      {
        id: "ma24-7",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-l3-g2-3",
        prompt: "A tank measures 2 m by 1.5 m by 1 m. How many litres does it hold?",
        options: [
          { id: "a", text: "3 litres" },
          { id: "b", text: "3 000 litres" },
          { id: "c", text: "300 litres" },
          { id: "d", text: "3 000 000 litres" },
        ],
        correct: "b",
        explanation: "Volume = 3 m³, and 1 m³ = 1 000 litres, so 3 000 litres.",
        whyWrong: {
          a: "That is in m³. Multiply by 1 000 for litres.",
          c: "1 m³ = 1 000 litres, not 100.",
          d: "That is in cm³: 3 m³ = 3 000 000 cm³.",
        },
      },
      {
        id: "ma24-11",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-l3-g2-2",
        prompt: "A pyramid has a square base of side 6 cm and a perpendicular height of 10 cm. Find its volume.",
        options: [
          { id: "a", text: "120 cm³" },
          { id: "b", text: "360 cm³" },
          { id: "c", text: "60 cm³" },
          { id: "d", text: "20 cm³" },
        ],
        correct: "a",
        explanation: "V = ⅓ × base area × height = ⅓ × 36 × 10 = 120 cm³.",
        whyWrong: {
          b: "That forgets the ⅓: it is the volume of the cuboid on the same base.",
          c: "That multiplies the base side by the height, 6 × 10, without squaring the side or taking a third.",
          d: "That uses ⅓ × 6 × 10, the base side instead of the base area 36.",
        },
      },
    ],
  },

  "ma-l3-s1": {
    lessonId: "ma-l3-s1",
    passMark: 70,
    questions: [
      {
        id: "ma24-8",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-l3-s1-1",
        prompt: "x: 0, 1, 2, 3, 4   f: 3, 7, 5, 4, 1. Find the median.",
        options: [
          { id: "a", text: "1" },
          { id: "b", text: "2" },
          { id: "c", text: "1.5" },
          { id: "d", text: "5" },
        ],
        correct: "c",
        explanation: "Σf = 20. Median = 10.5th value. Cumulative: 3, 10, 15, 19, 20. The 10th value is 1 and the 11th is 2, so the median is 1.5.",
        whyWrong: {
          a: "The 10th value is 1, but with 20 values the median is the 10.5th: halfway between the 10th (1) and the 11th (2).",
          b: "The 11th value is 2, but the median is halfway between the 10th and 11th values.",
          d: "That is a frequency. The median is a value of x.",
        },
      },
      {
        id: "ma24-9",
        type: "mcq",
        difficulty: 1,
        atomId: "a-ma-l3-s1-2",
        prompt: "Which average best describes the typical number of children per family if one family in the survey has 14 children and the rest have between 1 and 4?",
        options: [
          { id: "a", text: "Mean" },
          { id: "b", text: "Median" },
          { id: "c", text: "Range" },
          { id: "d", text: "Total" },
        ],
        correct: "b",
        explanation: "The family with 14 children is an outlier that pulls the mean up. The median is not affected by it.",
        whyWrong: {
          a: "The extreme value 14 drags the mean upward, away from the typical family.",
          c: "The range measures spread, not an average.",
          d: "A total is not an average.",
        },
      },
      {
        id: "ma24-10",
        type: "mcq",
        difficulty: 1,
        atomId: "a-ma-l3-s1-3",
        prompt: "A pie chart sector for 'cycle' has an angle of 72°. What percentage of people cycle?",
        options: [
          { id: "a", text: "72%" },
          { id: "b", text: "20%" },
          { id: "c", text: "36%" },
          { id: "d", text: "5%" },
        ],
        correct: "b",
        explanation: "72 ÷ 360 × 100 = 20%.",
        whyWrong: {
          a: "That is the angle, not the percentage.",
          c: "That divides by 200. The whole circle is 360°.",
          d: "That is 360 ÷ 72, upside down.",
        },
      },
      {
        id: "ma24-12",
        type: "mcq",
        difficulty: 1,
        atomId: "a-ma-l3-s1-1",
        prompt: "x: 10, 20, 30, 40   f: 4, 9, 6, 1. What is the mode?",
        options: [
          { id: "a", text: "20" },
          { id: "b", text: "9" },
          { id: "c", text: "25" },
          { id: "d", text: "40" },
        ],
        correct: "a",
        explanation: "The highest frequency is 9, for x = 20. So the mode is 20.",
        whyWrong: {
          b: "9 is the frequency. The mode is the VALUE with that frequency.",
          c: "That is the middle of the x values, not the most frequent.",
          d: "40 is the largest value, but it occurs only once.",
        },
      },
    ],
  },
};

export default ASSESSMENTS;
