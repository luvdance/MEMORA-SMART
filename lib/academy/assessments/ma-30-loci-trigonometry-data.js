/**
 * ASSESSMENTS · MATHEMATICS · MODULE 30 · LOCI, TRIGONOMETRY TO 360° AND GROUPED DATA
 * SERVER ONLY. See ma-01-place-value.js for how these are written.
 */

export const ASSESSMENTS = {
  "ma-l4-g3": {
    lessonId: "ma-l4-g3",
    passMark: 70,
    questions: [
      {
        id: "ma30-1",
        type: "mcq",
        difficulty: 1,
        atomId: "a-ma-l4-g3-1",
        prompt: "What is the locus of points equidistant from two fixed points X and Y?",
        options: [
          { id: "a", text: "The perpendicular bisector of XY" },
          { id: "b", text: "A circle through X and Y" },
          { id: "c", text: "A line parallel to XY" },
          { id: "d", text: "The bisector of the angle at X" },
        ],
        correct: "a",
        explanation: "Every point on the perpendicular bisector of XY is the same distance from X as from Y.",
        whyWrong: {
          b: "Points on a circle are a fixed distance from its CENTRE, not from X and Y equally.",
          c: "A parallel line is a fixed distance from the line XY.",
          d: "An angle bisector is equidistant from two LINES, not two points.",
        },
      },
      {
        id: "ma30-2",
        type: "mcq",
        difficulty: 1,
        atomId: "a-ma-l4-g3-1",
        prompt: "A goat is tied to a post with a 4 m rope. What is the locus of the furthest points it can reach?",
        options: [
          { id: "a", text: "A circle, centre the post, radius 4 m" },
          { id: "b", text: "A straight line 4 m long" },
          { id: "c", text: "Two parallel lines 4 m apart" },
          { id: "d", text: "A square of side 4 m" },
        ],
        correct: "a",
        explanation: "Points a fixed distance from a point form a circle centred on that point.",
        whyWrong: {
          b: "The goat can move in every direction, not just one.",
          c: "Parallel lines are the locus for a fixed distance from a LINE.",
          d: "The corners of a square are further than 4 m from the centre.",
        },
      },
      {
        id: "ma30-3",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-l4-g3-2",
        prompt: "P and Q are 10 cm apart. How many points are 4 cm from P and equidistant from P and Q?",
        options: [
          { id: "a", text: "0" },
          { id: "b", text: "1" },
          { id: "c", text: "2" },
          { id: "d", text: "4" },
        ],
        correct: "a",
        explanation: "The perpendicular bisector is 5 cm from P. A circle of radius 4 cm around P does not reach it, so there are 0 points.",
        whyWrong: {
          b: "One point needs the radius to equal 5 cm exactly, so the circle just touches.",
          c: "Two points need the radius to be more than 5 cm.",
          d: "A circle and a line meet at most twice.",
        },
      },
      {
        id: "ma30-4",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-l4-g3-1",
        prompt: "What is the locus of points 2 cm from a straight line l?",
        options: [
          { id: "a", text: "Two lines parallel to l, each 2 cm from it" },
          { id: "b", text: "One line parallel to l, 2 cm away" },
          { id: "c", text: "A circle of radius 2 cm" },
          { id: "d", text: "The perpendicular bisector of l" },
        ],
        correct: "a",
        explanation: "There is a parallel line 2 cm away on EACH side of l.",
        whyWrong: {
          b: "Points 2 cm away on the other side count too.",
          c: "A circle is for a fixed distance from a POINT.",
          d: "That is for points equidistant from the two ends of a segment.",
        },
      },
    ],
  },

  "ma-l4-t1": {
    lessonId: "ma-l4-t1",
    passMark: 70,
    questions: [
      {
        id: "ma30-5",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-l4-t1-1",
        prompt: "Without tables, find cos 120°.",
        options: [
          { id: "a", text: "−0.5" },
          { id: "b", text: "0.5" },
          { id: "c", text: "−0.866" },
          { id: "d", text: "0.866" },
        ],
        correct: "a",
        explanation: "120° is in the 2nd quadrant, where cos is negative. Related angle 60°: cos 120° = −cos 60° = −0.5.",
        whyWrong: {
          b: "The size is right but cos is NEGATIVE in the 2nd quadrant.",
          c: "That is −sin 60°. The related ratio is cos 60° = 0.5.",
          d: "That is sin 60°, and the sign is wrong too.",
        },
      },
      {
        id: "ma30-6",
        type: "mcq",
        difficulty: 3,
        atomId: "a-ma-l4-t1-1",
        prompt: "Find all θ between 0° and 360° for which cos θ = −0.5.",
        options: [
          { id: "a", text: "120° and 240°" },
          { id: "b", text: "60° and 300°" },
          { id: "c", text: "120° only" },
          { id: "d", text: "150° and 210°" },
        ],
        correct: "a",
        explanation: "Related angle 60°. cos is negative in the 2nd and 3rd quadrants: 180 − 60 = 120° and 180 + 60 = 240°.",
        whyWrong: {
          b: "Those give cos θ = +0.5.",
          c: "There are two angles: the 3rd quadrant gives 240° as well.",
          d: "Those use a related angle of 30°. cos 60° = 0.5, so the related angle is 60°.",
        },
      },
      {
        id: "ma30-7",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-l4-t1-2",
        prompt: "Find the exact value of tan 60° × sin 30°.",
        options: [
          { id: "a", text: "√3/2" },
          { id: "b", text: "√3" },
          { id: "c", text: "1/2" },
          { id: "d", text: "3/2" },
        ],
        correct: "a",
        explanation: "tan 60° = √3 and sin 30° = 1/2, so the product is √3/2.",
        whyWrong: {
          b: "That forgets to multiply by sin 30° = 1/2.",
          c: "That treats tan 60° as 1. tan 60° = √3.",
          d: "That uses tan 60° = 3. It is √3.",
        },
      },
      {
        id: "ma30-8",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-l4-t1-3",
        prompt: "What is the minimum value of y = 2 cos x − 3?",
        options: [
          { id: "a", text: "−5" },
          { id: "b", text: "−1" },
          { id: "c", text: "−3" },
          { id: "d", text: "−2" },
        ],
        correct: "a",
        explanation: "2 cos x runs from −2 to 2, so y runs from −2 − 3 = −5 to 2 − 3 = −1. Minimum −5.",
        whyWrong: {
          b: "That is the MAXIMUM, 2 − 3.",
          c: "That is the value when cos x = 0, not the minimum.",
          d: "That forgets the − 3.",
        },
      },
    ],
  },

  "ma-l4-s1": {
    lessonId: "ma-l4-s1",
    passMark: 70,
    questions: [
      {
        id: "ma30-9",
        type: "mcq",
        difficulty: 1,
        atomId: "a-ma-l4-s1-1",
        prompt: "In a frequency polygon, where is the point for the class 40–49 (frequency 7) plotted?",
        options: [
          { id: "a", text: "(44.5, 7)" },
          { id: "b", text: "(40, 7)" },
          { id: "c", text: "(49.5, 7)" },
          { id: "d", text: "(7, 44.5)" },
        ],
        correct: "a",
        explanation: "Points go at the class midpoint, (40 + 49) ÷ 2 = 44.5, with height the frequency 7.",
        whyWrong: {
          b: "40 is the lower class limit. Use the midpoint.",
          c: "49.5 is the upper class boundary. Use the midpoint.",
          d: "The coordinates are swapped: x is the midpoint, y the frequency.",
        },
      },
      {
        id: "ma30-10",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-l4-s1-2",
        prompt: "Classes 1–5, 6–10, 11–15 have frequencies 2, 5, 3. Estimate the mean.",
        options: [
          { id: "a", text: "8.5" },
          { id: "b", text: "8" },
          { id: "c", text: "28.3" },
          { id: "d", text: "6.5" },
        ],
        correct: "a",
        explanation: "Midpoints 3, 8, 13. Σfx = 6 + 40 + 39 = 85. Σf = 10. Mean = 85 ÷ 10 = 8.5.",
        whyWrong: {
          b: "That is the middle midpoint. The frequencies are not equal.",
          c: "That divides Σfx by 3, the number of classes. Divide by Σf = 10.",
          d: "That uses the lower class limits 1, 6, 11.",
        },
      },
      {
        id: "ma30-11",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-l4-s1-3",
        prompt: "With an assumed mean A = 25, Σfd = −30 and Σf = 40. What is the mean?",
        options: [
          { id: "a", text: "24.25" },
          { id: "b", text: "−0.75" },
          { id: "c", text: "25.75" },
          { id: "d", text: "−5" },
        ],
        correct: "a",
        explanation: "Mean = A + Σfd/Σf = 25 + (−30/40) = 25 − 0.75 = 24.25.",
        whyWrong: {
          b: "That is Σfd/Σf only. Add the assumed mean.",
          c: "Σfd is negative, so the mean is BELOW 25.",
          d: "That subtracts 30 from 25.",
        },
      },
      {
        id: "ma30-12",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-l4-s1-2",
        prompt: "Classes 0–9, 10–19, 20–29, 30–39 have frequencies 3, 8, 12, 5. Which is the modal class?",
        options: [
          { id: "a", text: "20–29" },
          { id: "b", text: "10–19" },
          { id: "c", text: "30–39" },
          { id: "d", text: "12" },
        ],
        correct: "a",
        explanation: "The highest frequency, 12, belongs to the class 20–29.",
        whyWrong: {
          b: "Its frequency, 8, is not the highest.",
          c: "Its frequency, 5, is not the highest.",
          d: "12 is the frequency. The modal class is the class.",
        },
      },
    ],
  },
};

export default ASSESSMENTS;
