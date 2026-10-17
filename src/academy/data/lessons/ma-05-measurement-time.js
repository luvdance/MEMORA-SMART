/**
 * MATHEMATICS · MONTH 2 · MODULE 5 · MEASUREMENT AND TIME
 *
 * CLIENT-SAFE. Atom shape and house style: see ma-01-place-value.js.
 */

export const SECTION_ID = "ma-s05-measurement-time";

export const LESSONS = [
  {
    id: "ma-l0-g1",
    moduleId: "ma-05-measurement-time",
    sectionId: SECTION_ID,
    skillGroup: "L0-G1",
    order: 1,
    title: "Measurement",
    subtitle: "Metric units, reading scales, perimeter and area",
    estimatedMinutes: 40,
    intro: "Every mensuration question in this course is built from four things: the right unit, an accurate reading, the distance round a shape, and the space inside it.",

    atoms: [
      {
        id: "a-ma-l0-g1-1",
        title: "Metric conversion",
        explain:
          "Metric units go up in steps of 10, 100 or 1 000. To change to a SMALLER unit, multiply (there will be more of them). To change to a BIGGER unit, divide.",
        table: {
          caption: "The conversions to know.",
          headers: ["Measures", "Conversion"],
          rows: [
            ["Length", "10 mm = 1 cm,  100 cm = 1 m,  1 000 m = 1 km"],
            ["Mass", "1 000 mg = 1 g,  1 000 g = 1 kg,  1 000 kg = 1 tonne"],
            ["Capacity", "1 000 ml = 1 litre"],
          ],
        },
        example:
          "  3.5 km  → m     bigger to smaller, × 1 000   = 3 500 m\n  450 cm  → m     smaller to bigger, ÷ 100     = 4.5 m\n  2 750 g → kg    smaller to bigger, ÷ 1 000   = 2.75 kg\n  0.6 l   → ml    bigger to smaller, × 1 000   = 600 ml",
        visual: { kind: "unitLadder", family: "length" },
        mistake: "Going the wrong way. 450 cm cannot be 45 000 m: a metre is bigger than a centimetre, so there must be FEWER metres.",
        drill: { skill: "L0-G1.1", count: 4 },
      },
      {
        id: "a-ma-l0-g1-2",
        title: "Reading instruments",
        explain:
          "Before reading a scale, find what one small division is worth: the difference between two numbered marks, divided by the number of small divisions between them. Then count divisions from the last numbered mark.",
        example:
          "  WEIGHING SCALE: marks at 200 g and 300 g, 5 small divisions between.\n    One division = (300 − 200) ÷ 5 = 20 g\n    Pointer 3 divisions past 200:  200 + 3 × 20 = 260 g\n\n  RULER: 7 cm and 4 small marks = 7.4 cm  (each mark is 1 mm = 0.1 cm)",
        visual: [
          { kind: "scale", major: 100, divisions: 5, notches: 3 },
          { kind: "ruler", cm: 7, mm: 4 },
        ],
        mistake: "Assuming every small division is worth 1. On a scale numbered in hundreds with 5 divisions, each one is worth 20.",
        drill: { skill: "L0-G1.2", count: 4 },
      },
      {
        id: "a-ma-l0-g1-3",
        title: "Perimeter",
        explain:
          "The PERIMETER is the total distance all the way round a shape. Add the lengths of all the sides. For a rectangle, perimeter = 2 × (length + width). For a compound shape, work out any missing sides first.",
        example:
          "  RECTANGLE 12 cm by 7 cm\n    P = 2 × (12 + 7) = 2 × 19 = 38 cm\n\n  L-SHAPE: a 10 m by 7 m rectangle with a 4 m by 3 m corner cut out\n    Sides: 10, 7, 6, 3, 4, 4   (10 − 4 = 6 and 7 − 3 = 4)\n    P = 10 + 7 + 6 + 3 + 4 + 4 = 34 m",
        visual: { kind: "lshape", width: 10, height: 7, cutWidth: 4, cutHeight: 3 },
        mistake: "Multiplying the sides. Length × width measures the space inside, which is the next idea. Perimeter is a length, found by adding.",
        drill: { skill: "L0-G1.3", count: 4 },
      },
      {
        id: "a-ma-l0-g1-4",
        title: "Area of rectangles",
        explain:
          "AREA is the amount of flat surface inside a shape, measured in square units: cm², m², km². Area of a rectangle = length × width. For a compound shape, split it into rectangles and add, or take a small rectangle away from a big one.",
        example:
          "  RECTANGLE 8 cm by 5 cm\n    A = 8 × 5 = 40 cm²\n\n  L-SHAPE: 10 m by 7 m, with a 4 m by 3 m corner removed\n    A = 10 × 7 − 4 × 3 = 70 − 12 = 58 m²\n\n  LAND is measured in hectares:  1 hectare = 10 000 m²\n    A farm 250 m by 200 m = 50 000 m² = 5 hectares",
        visual: { kind: "areaGrid", width: 8, height: 5 },
        mistake: "Writing cm instead of cm², or multiplying lengths in different units. Convert to the same unit first: 2 m by 50 cm is 200 cm × 50 cm.",
        drill: { skill: "L0-G1.4", count: 4 },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  {
    id: "ma-l0-g2",
    moduleId: "ma-05-measurement-time",
    sectionId: SECTION_ID,
    skillGroup: "L0-G2",
    order: 2,
    title: "Time",
    subtitle: "Units of time, the 24-hour clock, and elapsed time",
    estimatedMinutes: 30,
    intro: "Time counts in sixties, not tens. Every journey, timetable and speed question depends on handling that correctly.",

    atoms: [
      {
        id: "a-ma-l0-g2-1",
        title: "Units of time",
        explain:
          "To change to a smaller unit, multiply. To change to a bigger unit, divide. A year has 365 days, or 366 in a LEAP YEAR, which is any year that divides exactly by 4 (century years must divide by 400).",
        table: {
          caption: "Units of time.",
          headers: ["", "Equals"],
          rows: [
            ["1 minute", "60 seconds"],
            ["1 hour", "60 minutes = 3 600 seconds"],
            ["1 day", "24 hours"],
            ["1 week", "7 days"],
            ["1 year", "365 days (366 in a leap year) = 12 months = 52 weeks and 1 day"],
          ],
        },
        example: "  3 h 25 min in minutes:  3 × 60 + 25 = 205 min\n  2024 ÷ 4 = 506 exactly, so 2024 is a leap year: 366 days",
        mistake: "Counting time in hundreds. 1.5 hours is 1 hour 30 minutes, not 1 hour 50 minutes.",
        drill: { skill: "L0-G2.1", count: 4 },
      },
      {
        id: "a-ma-l0-g2-2",
        title: "The 12-hour and 24-hour clock",
        explain:
          "The 24-hour clock numbers the hours from 00 (midnight) to 23. For pm times, add 12 to the hour, except 12 pm, which stays 12. For 12 am, write 00.",
        table: {
          caption: "The same times on both clocks.",
          headers: ["12-hour", "24-hour"],
          rows: [
            ["12:15 am", "00:15"],
            ["7:30 am", "07:30"],
            ["12:00 noon", "12:00"],
            ["3:45 pm", "15:45"],
            ["11:05 pm", "23:05"],
          ],
        },
        visual: { kind: "clock", hour: 3, minute: 45 },
        mistake: "Forgetting the 12 for afternoon times (3:45 pm is 15:45, not 03:45), or writing midnight as 24:15. The hour after midnight is 00.",
        drill: { skill: "L0-G2.2", count: 4 },
      },
      {
        id: "a-ma-l0-g2-3",
        title: "Elapsed time",
        explain: "To find how long something takes, count UP from the start time: to the next whole hour, then whole hours, then the minutes left. To find a finishing time, add the hours, then the minutes, carrying 60 minutes into an hour.",
        example:
          "  14:50 TO 17:25\n    14:50 → 15:00   10 min\n    15:00 → 17:00   2 h\n    17:00 → 17:25   25 min\n    Total: 2 h 35 min = 155 min\n\n  08:50 + 5 h 55 min\n    08:50 + 5 h  = 13:50\n    13:50 + 10 min = 14:00, + 45 min = 14:45",
        visual: { kind: "timeLine", from: "14:50", to: "17:25" },
        mistake: "Subtracting times like ordinary numbers: 17:25 − 14:50 is not 2.75 hours or 275 minutes. Count up instead.",
        drill: { skill: "L0-G2.3", count: 4 },
      },
      {
        id: "a-ma-review-05",
        title: "Mixed review",
        explain: "One question on each earlier skill.",
        drill: { review: ["L0-N5.2", "L0-N5.3", "L0-N5.4", "L0-N6.1", "L0-N4.4"], count: 5 },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
