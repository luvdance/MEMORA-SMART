/**
 * MATHEMATICS · MONTH 2 · MODULE 6 · READING DATA, LARGE NUMBERS AND BASE TWO
 *
 * CLIENT-SAFE. Atom shape and house style: see ma-01-place-value.js.
 */

export const SECTION_ID = "ma-s06-data-base-two";

export const LESSONS = [
  {
    id: "ma-l0-s1",
    moduleId: "ma-06-data-base-two",
    sectionId: SECTION_ID,
    skillGroup: "L0-S1",
    order: 1,
    title: "Reading Data",
    subtitle: "Tables, timetables, bar charts and pictograms",
    estimatedMinutes: 30,
    intro: "Every statistics question begins by getting the right number out of a table or a chart. Find the row, find the column, read the scale.",

    atoms: [
      {
        id: "a-ma-l0-s1-1",
        title: "Reading tables and timetables",
        explain:
          "In a table, find the ROW for the thing you are asked about and the COLUMN for the quantity, and read the cell where they meet. For a timetable, a journey time is the later time minus the earlier time, counted up as in the time lesson.",
        example:
          "  BUS        Depart Enugu   Arrive Awka   Arrive Onitsha\n  Morning       07:15          08:05          08:50\n  Afternoon     13:40          14:35          15:20\n\n  Afternoon bus, Enugu to Onitsha:\n    13:40 → 14:00 = 20 min, 14:00 → 15:20 = 80 min\n    Total 100 min = 1 h 40 min",
        visual: {
          kind: "table",
          headers: ["Bus", "Enugu", "Awka", "Onitsha"],
          rows: [["Morning", "07:15", "08:05", "08:50"], ["Afternoon", "13:40", "14:35", "15:20"]],
        },
        mistake: "Reading along the wrong row. Put a finger on the row and another on the column before reading the cell.",
        drill: { skill: "L0-S1.1", count: 3 },
      },
      {
        id: "a-ma-l0-s1-2",
        title: "Reading bar charts and pictograms",
        explain:
          "On a bar chart, first read the scale on the axis: how much is each gridline worth? Then read the top of each bar across to the axis. On a pictogram, check the KEY: one symbol may stand for 5 or 10 items, and half a symbol for half that.",
        example:
          "  Gridlines every 5 students.\n  Maths bar reaches 35, English bar reaches 20.\n    How many more chose Maths?  35 − 20 = 15\n\n  Pictogram key: ● = 4 mangoes.\n  A row of ●●● and half a ● shows 3 × 4 + 2 = 14 mangoes.",
        visual: {
          kind: "barChart",
          axisStep: 5,
          data: [
            { label: "Maths", value: 35 },
            { label: "English", value: 20 },
            { label: "Science", value: 25 },
            { label: "Art", value: 10 },
          ],
        },
        mistake: "Assuming each gridline is worth 1, or ignoring the pictogram key. Read the scale first.",
        drill: { skill: "L0-S1.2", count: 3 },
      },
      {
        id: "a-ma-l0-s1-3",
        title: "Answering from data",
        explain:
          "Before calculating, decide exactly what the question needs: one cell, a total along a row, a difference between two values, or a comparison. Words like 'altogether', 'more than' and 'highest' tell you which.",
        table: {
          caption: "The question word tells you the operation.",
          headers: ["The question says", "You need"],
          rows: [
            ["How many ... altogether / in total", "Add the values"],
            ["How many more / fewer", "Subtract the smaller from the larger"],
            ["Highest / lowest / most", "Compare, then name it"],
            ["What fraction of all ...", "One value ÷ the total"],
          ],
        },
        mistake: "Answering a different question: giving Maths' score when asked who scored highest in total.",
        drill: { skill: "L0-S1.3", count: 3 },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  {
    id: "ma-l1-n1",
    moduleId: "ma-06-data-base-two",
    sectionId: SECTION_ID,
    skillGroup: "L1-N1",
    order: 2,
    title: "Large Numbers and Base Two",
    subtitle: "Millions to trillions, then counting in twos",
    estimatedMinutes: 40,
    intro: "Place value works the same way however far left you go, and it works in any base. Base two, the language of every computer, is the first one to learn.",

    atoms: [
      {
        id: "a-ma-l1-n1-1",
        title: "Numbers to trillions",
        explain:
          "Each group name is a thousand times the one before: thousand, million, billion, trillion. A number like ₦2.5 billion means 2.5 lots of a billion: multiply, then write it in figures.",
        table: {
          caption: "The large-number groups.",
          headers: ["Name", "In figures", "Zeros"],
          rows: [
            ["One thousand", "1 000", "3"],
            ["One million", "1 000 000", "6"],
            ["One billion", "1 000 000 000", "9"],
            ["One trillion", "1 000 000 000 000", "12"],
          ],
        },
        example:
          "  ₦2.5 billion = 2 500 000 000\n  ₦0.8 million = 800 000\n  Three trillion, forty billion and six = 3 040 000 000 006",
        mistake: "Losing a group of zeros. Check by counting: a billion has 9 zeros, three groups of three.",
        drill: { skill: "L1-N1.1", count: 3 },
      },
      {
        id: "a-ma-l1-n1-2",
        title: "Counting in base two",
        explain:
          "Base ten uses ten digits and each place is worth 10 times the one on its right. Base two, also called BINARY, uses only the digits 0 and 1, and each place is worth 2 times the one on its right: 1, 2, 4, 8, 16, 32, ...",
        table: {
          caption: "Counting from 0 to 8 in base two.",
          headers: ["Base ten", "0", "1", "2", "3", "4", "5", "6", "7", "8"],
          rows: [["Base two", "0", "1", "10", "11", "100", "101", "110", "111", "1000"]],
        },
        example: "  Adding 1 in base two:  a 0 becomes 1.\n  A 1 becomes 0 and carries 1 to the left.\n\n    1011 + 1 = 1100",
        mistake: "Writing a 2 in a base two number. 1 + 1 in base two is 10: write 0, carry 1.",
        drill: { skill: "L1-N1.2", count: 3 },
      },
      {
        id: "a-ma-l1-n1-3",
        title: "Converting between base ten and base two",
        explain:
          "Base ten to base two: divide by 2 again and again, writing down each remainder, until you reach 0. Read the remainders from the BOTTOM up. Base two to base ten: multiply each digit by its place value and add.",
        example:
          "  13 TO BASE TWO\n    13 ÷ 2 = 6 r 1\n     6 ÷ 2 = 3 r 0\n     3 ÷ 2 = 1 r 1\n     1 ÷ 2 = 0 r 1      read upwards ↑\n    13 = 1101₂\n\n  10110₂ TO BASE TEN\n    16  8  4  2  1\n     1  0  1  1  0\n    16 + 4 + 2 = 22",
        mistake: "Reading the remainders from the top down. The first remainder is the ones digit, so it goes at the RIGHT.",
        drill: { skill: "L1-N1.3", count: 4 },
      },
      {
        id: "a-ma-l1-n1-4",
        title: "Adding and subtracting in base two",
        explain: "Line the numbers up on the right and work column by column, exactly as in base ten, but carry or borrow in twos.",
        table: {
          caption: "The whole addition table for base two.",
          headers: ["Sum", "Result", "Write", "Carry"],
          rows: [
            ["0 + 0", "0", "0", "0"],
            ["0 + 1", "1", "1", "0"],
            ["1 + 1", "10", "0", "1"],
            ["1 + 1 + 1", "11", "1", "1"],
          ],
        },
        example:
          "    1011          (11)\n  +  110          ( 6)\n  ──────\n   10001          (17)  ✓\n\n    1100          (12)\n  −  101          ( 5)\n  ──────\n     111          ( 7)  ✓\n  Borrowing 1 from the left gives 2 in this column: 10 − 1 = 1.",
        mistake: "Adding as in base ten. 1011 + 110 is not 1121: there is no digit 2 in base two.",
        drill: { skill: "L1-N1.4", count: 4 },
      },
      {
        id: "a-ma-review-06",
        title: "Mixed review",
        explain: "One question on each earlier skill.",
        drill: { review: ["L0-G1.1", "L0-G1.3", "L0-G1.4", "L0-G2.2", "L0-G2.3"], count: 5 },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
