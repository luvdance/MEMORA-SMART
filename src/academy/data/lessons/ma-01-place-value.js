/**
 * MATHEMATICS · MONTH 1 · MODULE 1 · PLACE VALUE
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Drill questions are generated on the server in
 * lib/academy/maths/, and the lesson checks live in lib/academy/assessments/.
 * ─────────────────────────────────────────────────────────────────────────
 *
 * MATHS ATOM SHAPE · A-T-O-M
 *   Anchor    `explain`, plus a `table` when there is a law to write down
 *   Trace     `example` (worked) and `visual` (drawn by MathsVisual)
 *   Operate   `drill`: generated questions on one skill, must be got right
 *   Master    the lesson check, graded on the server
 *   mistake   the one error most worth naming
 *
 * One lesson per skill group, one atom per skill. `skillGroup` on a lesson
 * and `drill.skill` on an atom are what `npm run test:maths` uses to prove
 * every skill is taught, and taught after its prerequisites.
 *
 * HOUSE STYLE: say it once, plainly, then show it. Short sentences.
 */

export const SECTION_ID = "ma-s01-place-value";

export const LESSONS = [
  {
    id: "ma-l0-n1",
    moduleId: "ma-01-place-value",
    sectionId: SECTION_ID,
    skillGroup: "L0-N1",
    order: 1,
    title: "Place Value",
    subtitle: "Reading, writing, ordering and rounding whole numbers",
    estimatedMinutes: 40,
    intro:
      "Every number you will ever write is built from ten digits, and the place a digit sits in decides what it is worth. That single idea runs through decimals, standard form, number bases and every calculation in this course.",

    atoms: [
      {
        id: "a-ma-start",
        title: "How this course works",
        explain:
          "This course takes you from place value to calculus and university proof, in the order each topic depends on the last. Every idea is taught the same way, in four steps. Keep a pen and paper beside you and work every example yourself.",
        table: {
          caption: "The four steps of every atom.",
          headers: ["Step", "What happens"],
          rows: [
            ["Anchor", "The idea or law, stated in a sentence or two"],
            ["Trace", "A worked example and a picture"],
            ["Operate", "Practice questions, new numbers every time, until you get them right"],
            ["Master", "A short check at the end of the lesson. Pass it to open the next lesson"],
          ],
          note: "A wrong answer is never just marked wrong. You are told the exact mistake, shown the working, and given a fresh question of the same kind. Practise as much as you like: the questions never run out.",
        },
        example:
          "  THE TEN MONTH ROAD\n\n  Month 1   Whole numbers, factors, roots, first fractions\n  Month 2   Measure, time, data, HCF/LCM, negatives, fractions\n  Month 3   Percentages, ratio, first algebra, angles, shapes\n  Month 4   Indices, money, brackets and equations\n  Month 5   Graphs, angle rules, circles, bearings, probability\n  Month 6   Bases, factorisation, simultaneous equations, trigonometry\n  Month 7   Logarithms, surds, sets, logic, quadratics\n  Month 8   Mensuration, loci, sequences, advanced algebra\n  Month 9   Circle theorems, coordinate geometry, statistics, matrices\n  Month 10  Vectors, calculus, exam mastery, university bridge",
      },
      {
        id: "a-ma-l0-n1-1",
        title: "Reading and writing whole numbers",
        explain:
          "Every whole number is written with the ten digits 0 to 9. From the right, the digits are grouped in threes: ones, thousands, millions, billions. To read a number, read each group as a number up to 999, then say the group's name.",
        table: {
          caption: "The groups, read from the left.",
          headers: ["Group", "Places in the group", "Example"],
          rows: [
            ["Billions", "hundred billions, ten billions, billions", "2 000 000 000 = two billion"],
            ["Millions", "hundred millions, ten millions, millions", "45 000 000 = forty-five million"],
            ["Thousands", "hundred thousands, ten thousands, thousands", "308 000 = three hundred and eight thousand"],
            ["Ones", "hundreds, tens, ones", "27 = twenty-seven"],
          ],
        },
        example:
          "  READ   4 305 027\n\n    4     → four million\n    305   → three hundred and five thousand\n    027   → and twenty-seven\n\n    Four million, three hundred and five thousand,\n    and twenty-seven.\n\n\n  WRITE  seven thousand and nine\n\n    thousands group:  7\n    ones group:       009\n\n    7 009   (the zeros hold the empty places)",
        visual: { kind: "placeChart", number: 4305027 },
        mistake:
          "Leaving out the zeros. Seven thousand and nine is 7 009, not 79 or 709. After the first group, every group must have exactly three digits.",
        drill: { skill: "L0-N1.1", count: 4 },
      },
      {
        id: "a-ma-l0-n1-2",
        title: "Place and value",
        explain:
          "Each place is worth ten times the place on its right. The value of a digit is the digit multiplied by the value of its place. In 4 705 the 7 is in the hundreds place, so its value is 700.",
        table: {
          caption: "Value of a digit = digit × value of its place.",
          headers: ["Place", "Place value", "The 3 in that place is worth"],
          rows: [
            ["Ones", "1", "3"],
            ["Tens", "10", "30"],
            ["Hundreds", "100", "300"],
            ["Thousands", "1 000", "3 000"],
            ["Ten thousands", "10 000", "30 000"],
            ["Hundred thousands", "100 000", "300 000"],
            ["Millions", "1 000 000", "3 000 000"],
          ],
        },
        example:
          "  6 284 593\n\n  Digit   Place                Value\n    6     millions         6 000 000\n    2     hundred thousands  200 000\n    8     ten thousands       80 000\n    4     thousands            4 000\n    5     hundreds               500\n    9     tens                    90\n    3     ones                     3\n\n  EXPANDED FORM:\n  6 000 000 + 200 000 + 80 000 + 4 000 + 500 + 90 + 3",
        mistake:
          "Giving the digit when the question asks for its value. In 6 284 593 the digit 8 has the VALUE 80 000.",
        drill: { skill: "L0-N1.2", count: 4 },
      },
      {
        id: "a-ma-l0-n1-3",
        title: "Ordering and comparing",
        explain:
          "To compare two whole numbers, count the digits first: more digits means a bigger number. If both have the same number of digits, compare place by place from the left. The first place where they differ decides.",
        table: {
          caption: "The comparison symbols. The wide end faces the bigger number.",
          headers: ["Symbol", "Meaning", "Example"],
          rows: [
            ["<", "is less than", "48 193 < 48 213"],
            [">", "is greater than", "10 002 > 9 870"],
            ["=", "is equal to", "4 000 = 4 thousands"],
          ],
        },
        example:
          "  COMPARE 48 213 and 48 193\n\n    Both have 5 digits.\n    4 = 4,  8 = 8,  then 2 > 1\n    So 48 213 > 48 193.\n\n\n  ORDER   9 870,  10 002,  9 087\n\n    10 002 has 5 digits, so it is the largest.\n    9 870 and 9 087: 9 = 9, then 8 > 0.\n\n    Ascending  (smallest first):  9 087,  9 870,  10 002\n    Descending (largest first):   10 002, 9 870,  9 087",
        visual: { kind: "compareColumns", a: 48213, b: 48193 },
        mistake:
          "Judging by the first digit alone. 9 870 starts with a 9, but 10 002 is bigger because it has more digits.",
        drill: { skill: "L0-N1.3", count: 4 },
      },
      {
        id: "a-ma-l0-n1-4",
        title: "Rounding",
        explain:
          "To round to a place, look only at the digit immediately to its right. If that digit is 5 or more, round up. If it is 4 or less, round down. Every digit after the rounding place becomes 0.",
        example:
          "  ROUND 47 382 TO THE NEAREST THOUSAND\n\n    thousands digit:      7\n    digit to its right:   3   (less than 5)\n    round DOWN  →  47 000\n\n  ROUND 47 382 TO THE NEAREST HUNDRED\n\n    hundreds digit:       3\n    digit to its right:   8   (5 or more)\n    round UP    →  47 400\n\n  ROUND 6 950 TO THE NEAREST HUNDRED\n\n    hundreds digit 9, next digit 5  →  up\n    9 hundreds + 1 = 10 hundreds  →  7 000",
        visual: { kind: "roundingLine", value: 47382, to: 1000 },
        mistake:
          "Rounding in stages: 47 382 → 47 380 → 47 400 → 47 000 gives the right answer here by luck and the wrong one for 7 449 to the nearest thousand. Look once, at the one digit to the right.",
        drill: { skill: "L0-N1.4", count: 4 },
      },
      {
        id: "a-ma-l0-n1-5",
        title: "Roman numerals",
        explain:
          "Roman numerals use seven letters. Write the largest values first and add them. A letter may repeat at most three times in a row. When a smaller letter stands before a larger one, subtract it: there are exactly six of these pairs.",
        table: {
          caption: "The seven symbols and the six subtractive pairs.",
          headers: ["Symbol", "Value", "Subtractive pair", "Value"],
          rows: [
            ["I", "1", "IV", "4"],
            ["V", "5", "IX", "9"],
            ["X", "10", "XL", "40"],
            ["L", "50", "XC", "90"],
            ["C", "100", "CD", "400"],
            ["D", "500", "CM", "900"],
            ["M", "1 000", "", ""],
          ],
        },
        example:
          "  WRITE 1 994\n\n    1 000 + 900 + 90 + 4\n    M     + CM  + XC + IV   =  MCMXCIV\n\n  READ  XLVII\n\n    XL + V + II\n    40 + 5 + 2   =  47",
        mistake:
          "Writing IIII for 4 or IC for 99. Only the six pairs in the table are allowed. 4 is IV, and 99 is 90 + 9 = XCIX.",
        drill: { skill: "L0-N1.5", count: 4 },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
