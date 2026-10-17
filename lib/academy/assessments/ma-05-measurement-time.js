/**
 * ASSESSMENTS · MATHEMATICS · MODULE 5 · MEASUREMENT AND TIME
 * SERVER ONLY. See ma-01-place-value.js for how these are written.
 */

export const ASSESSMENTS = {
  "ma-l0-g1": {
    lessonId: "ma-l0-g1",
    passMark: 70,
    questions: [
      {
        id: "ma05-1",
        type: "mcq",
        difficulty: 1,
        atomId: "a-ma-l0-g1-1",
        prompt: "Convert 2.4 km to metres.",
        options: [
          { id: "a", text: "240 m" },
          { id: "b", text: "2 400 m" },
          { id: "c", text: "24 000 m" },
          { id: "d", text: "0.0024 m" },
        ],
        correct: "b",
        explanation: "1 km = 1 000 m, and km to m is bigger to smaller, so multiply: 2.4 × 1 000 = 2 400 m.",
        whyWrong: {
          a: "That multiplies by 100. There are 1 000 metres in a kilometre.",
          c: "That multiplies by 10 000. There are 1 000 metres in a kilometre.",
          d: "That divides. Going to a smaller unit means MORE of them, so multiply.",
        },
      },
      {
        id: "ma05-2",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-l0-g1-2",
        prompt: "A scale has numbered marks at 40 kg and 50 kg, with 4 equal small divisions between them. The pointer is 3 small divisions past 40 kg. What is the reading?",
        options: [
          { id: "a", text: "43 kg" },
          { id: "b", text: "47.5 kg" },
          { id: "c", text: "47 kg" },
          { id: "d", text: "45 kg" },
        ],
        correct: "b",
        explanation: "One division = (50 − 40) ÷ 4 = 2.5 kg. Three divisions = 7.5 kg. Reading: 40 + 7.5 = 47.5 kg.",
        whyWrong: {
          a: "That counts each division as 1 kg. Work out what one division is worth first: 10 ÷ 4 = 2.5 kg.",
          c: "Close, but each division is 2.5 kg, not 2 kg or 3 kg: 3 × 2.5 = 7.5.",
          d: "45 kg would be halfway, 2 divisions along. The pointer is 3 divisions along.",
        },
      },
      {
        id: "ma05-3",
        type: "mcq",
        difficulty: 1,
        atomId: "a-ma-l0-g1-3",
        prompt: "Find the perimeter of a rectangular field 15 m long and 8 m wide.",
        options: [
          { id: "a", text: "23 m" },
          { id: "b", text: "120 m" },
          { id: "c", text: "46 m" },
          { id: "d", text: "38 m" },
        ],
        correct: "c",
        explanation: "P = 2 × (15 + 8) = 2 × 23 = 46 m.",
        whyWrong: {
          a: "That adds only one length and one width. The perimeter goes all the way round: two of each.",
          b: "That is 15 × 8, the area. Perimeter is found by adding.",
          d: "That is 15 + 15 + 8. A rectangle has two widths as well.",
        },
      },
      {
        id: "ma05-4",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-l0-g1-4",
        prompt: "A plot 12 m by 9 m has a 5 m by 4 m corner taken for a shed. What area is left?",
        options: [
          { id: "a", text: "88 m²" },
          { id: "b", text: "108 m²" },
          { id: "c", text: "128 m²" },
          { id: "d", text: "42 m²" },
        ],
        correct: "a",
        explanation: "Whole plot: 12 × 9 = 108 m². Shed: 5 × 4 = 20 m². Left: 108 − 20 = 88 m².",
        whyWrong: {
          b: "That is the whole plot. The shed's 20 m² must be taken away.",
          c: "That ADDS the shed. The shed area is removed, so subtract.",
          d: "That is the perimeter of the plot, a length. Area is found by multiplying.",
        },
      },
      {
        id: "ma05-5",
        type: "mcq",
        difficulty: 3,
        atomId: "a-ma-l0-g1-4",
        prompt: "A room is 4 m long and 350 cm wide. What is its area in m²?",
        options: [
          { id: "a", text: "1 400 m²" },
          { id: "b", text: "14 m²" },
          { id: "c", text: "15 m²" },
          { id: "d", text: "140 m²" },
        ],
        correct: "b",
        explanation: "Convert first: 350 cm = 3.5 m. Area = 4 × 3.5 = 14 m².",
        whyWrong: {
          a: "That multiplies 4 m by 350 cm without converting. Both lengths must be in metres.",
          c: "That is 2 × (4 + 3.5), the perimeter. Area is length × width.",
          d: "That treats 350 cm as 35 m. 350 cm = 3.5 m.",
        },
      },
    ],
  },

  "ma-l0-g2": {
    lessonId: "ma-l0-g2",
    passMark: 70,
    questions: [
      {
        id: "ma05-6",
        type: "mcq",
        difficulty: 1,
        atomId: "a-ma-l0-g2-1",
        prompt: "How many minutes are there in 4 hours 15 minutes?",
        options: [
          { id: "a", text: "415" },
          { id: "b", text: "255" },
          { id: "c", text: "240" },
          { id: "d", text: "19" },
        ],
        correct: "b",
        explanation: "4 × 60 = 240, and 240 + 15 = 255 minutes.",
        whyWrong: {
          a: "That counts an hour as 100 minutes. An hour has 60.",
          c: "That is 4 hours only. Add the 15 minutes.",
          d: "That adds 4 and 15. Each hour is 60 minutes.",
        },
      },
      {
        id: "ma05-7",
        type: "mcq",
        difficulty: 1,
        atomId: "a-ma-l0-g2-2",
        prompt: "Write 9:20 pm in 24-hour time.",
        options: [
          { id: "a", text: "09:20" },
          { id: "b", text: "19:20" },
          { id: "c", text: "21:20" },
          { id: "d", text: "20:20" },
        ],
        correct: "c",
        explanation: "pm, so add 12 to the hour: 9 + 12 = 21. The time is 21:20.",
        whyWrong: {
          a: "09:20 is in the morning. For pm times add 12 to the hour.",
          b: "That adds 10. Add 12: 9 + 12 = 21.",
          d: "That adds 11. Add 12: 9 + 12 = 21.",
        },
      },
      {
        id: "ma05-8",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-l0-g2-2",
        prompt: "Write 00:40 in 12-hour time.",
        options: [
          { id: "a", text: "12:40 am" },
          { id: "b", text: "12:40 pm" },
          { id: "c", text: "0:40 pm" },
          { id: "d", text: "10:40 am" },
        ],
        correct: "a",
        explanation: "The 00 hour is the first hour after midnight, which is written 12 am. So 00:40 is 12:40 am.",
        whyWrong: {
          b: "12:40 pm is 40 minutes after noon, which is 12:40 on the 24-hour clock.",
          c: "The 12-hour clock has no 0 hour. The hour after midnight is 12 am.",
          d: "00:40 is forty minutes after midnight, not 10:40.",
        },
      },
      {
        id: "ma05-9",
        type: "mcq",
        difficulty: 3,
        atomId: "a-ma-l0-g2-3",
        prompt: "A flight leaves at 22:45 and takes 3 h 30 min. What time does it land?",
        options: [
          { id: "a", text: "26:15" },
          { id: "b", text: "01:15" },
          { id: "c", text: "02:15" },
          { id: "d", text: "25:75" },
        ],
        correct: "c",
        explanation: "22:45 + 3 h = 01:45 (passing midnight). 01:45 + 30 min = 02:15.",
        whyWrong: {
          a: "The clock goes back to 00 after 23:59. 26:15 is 02:15 the next day.",
          b: "That adds only 2 h 30 min. 22:45 + 3 h = 01:45, then + 30 min = 02:15.",
          d: "That adds hours and minutes like ordinary numbers. Minutes stop at 59 and hours restart after 23.",
        },
      },
      {
        id: "ma05-10",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-l0-g2-3",
        prompt: "A meeting runs from 09:35 to 13:10. How long is it?",
        options: [
          { id: "a", text: "3 h 35 min" },
          { id: "b", text: "3 h 75 min" },
          { id: "c", text: "4 h 35 min" },
          { id: "d", text: "3 h 25 min" },
        ],
        correct: "a",
        explanation: "09:35 → 10:00 is 25 min, 10:00 → 13:00 is 3 h, 13:00 → 13:10 is 10 min. Total 3 h 35 min.",
        whyWrong: {
          b: "That subtracts as if an hour had 100 minutes (13.10 − 9.35). Count up instead.",
          c: "One hour too many. From 10:00 to 13:00 is 3 hours, and the minutes add to 35.",
          d: "Count the minutes again: 25 to reach 10:00, plus 10 after 13:00, makes 35.",
        },
      },
    ],
  },
};

export default ASSESSMENTS;
