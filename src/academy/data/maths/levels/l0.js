import { a, ALL, NONE } from "./shorthand.js";

/**
 * LEVEL 0 · FOUNDATIONS BRIDGE
 *
 * L0 exists because most secondary students who say they hate maths are
 * missing primary-level fluency, not secondary-level ability. Nobody enters
 * L1 without clearing this, because every level above it assumes fast,
 * accurate arithmetic and a working picture of what a fraction is.
 *
 * Nothing here is examined by name in WAEC, NECO or JAMB. Everything here is
 * assumed by all three.
 */
export const L0_MODULES = [
  {
    code: "L0-N1",
    level: "L0",
    strand: "N",
    title: "Place value",
    summary:
      "What a digit is worth depends on where it sits. Everything numerical rests on this, and it is the first thing to go missing.",
    needs: [],
    atoms: [
      a(
        "Reading and writing whole numbers",
        "read and write any whole number up to billions, in figures and in words",
        { exams: NONE }
      ),
      a(
        "Place and value",
        "name the place of any digit and state its value — the difference that makes the 7 in 4,700 mean seven hundred",
        { exams: NONE }
      ),
      a(
        "Ordering and comparing",
        "order a set of whole numbers and compare two of them with <, > or =",
        { exams: NONE }
      ),
      a(
        "Rounding whole numbers",
        "round to the nearest 10, 100 or 1000, and name the digit that decided it",
        { exams: ALL }
      ),
    ],
  },

  {
    code: "L0-N2",
    level: "L0",
    strand: "N",
    title: "Operation fluency",
    summary:
      "Speed with the four operations is not showing off. A student who spends working memory on 7 x 8 has none left for the problem it sits inside.",
    because:
      "Every timed paper punishes slow arithmetic twice: once in minutes, and again in the errors that hurrying causes.",
    needs: ["L0-N1.2"],
    atoms: [
      a(
        "Times tables to instant recall",
        "recall any table fact from 1 x 1 to 12 x 12 in under three seconds",
        { exams: NONE, drill: true }
      ),
      a(
        "Long multiplication",
        "multiply a three-digit number by a two-digit number, and check the size of the answer",
        { exams: NONE }
      ),
      a(
        "Long division with remainders",
        "divide by a one- or two-digit number and interpret the remainder in context",
        { exams: NONE }
      ),
      a(
        "BODMAS",
        "evaluate an expression with brackets, powers, division, multiplication, addition and subtraction in the correct order",
        { exams: ALL }
      ),
    ],
  },

  {
    code: "L0-N3",
    level: "L0",
    strand: "N",
    title: "Factors and multiples",
    summary:
      "The vocabulary of how numbers are built. HCF, LCM, prime factorisation, simplifying fractions and later surds all start here.",
    needs: ["L0-N2.1"],
    atoms: [
      a(
        "Factors",
        "list every factor of a number in pairs, and know when the list is complete",
        { exams: ALL }
      ),
      a(
        "Multiples",
        "list multiples, and tell a multiple from a factor without hesitating",
        { exams: ALL }
      ),
      a(
        "Primes to 100",
        "identify the prime numbers up to 100, and explain why 1 is not one of them",
        { exams: ALL }
      ),
      a(
        "Divisibility rules",
        "test divisibility by 2, 3, 4, 5, 6, 9 and 10 without doing the division",
        { exams: NONE }
      ),
    ],
  },

  {
    code: "L0-N4",
    level: "L0",
    strand: "N",
    title: "Fraction sense",
    summary:
      "Before any fraction arithmetic, the picture. A fraction is a number with a position on a line, not a pair of numbers with a bar between them.",
    because:
      "Chief Examiners still report fraction errors in SS3 scripts. They are almost always errors of meaning rather than of method.",
    needs: ["L0-N3.1"],
    atoms: [
      a(
        "A fraction as a picture",
        "show any fraction on a bar model and place it on a number line",
        { exams: NONE }
      ),
      a(
        "Equivalent fractions",
        "find equivalent fractions, and simplify a fraction to its lowest terms",
        { exams: ALL }
      ),
      a(
        "Comparing fractions",
        "compare and order fractions with different denominators, and justify the ordering",
        { exams: ALL }
      ),
      a(
        "A fraction of a quantity",
        "find a fraction of an amount, including an amount of money",
        { exams: ALL }
      ),
    ],
  },

  {
    code: "L0-N5",
    level: "L0",
    strand: "N",
    title: "Decimals and money",
    summary:
      "The same place-value idea carried to the right of the point, then applied to the numbers students handle every day.",
    needs: ["L0-N1.2", "L0-N4.2"],
    atoms: [
      a(
        "Decimal place value",
        "read and write decimals to thousandths and say what each digit is worth",
        { exams: ALL }
      ),
      a(
        "Adding and subtracting decimals",
        "add and subtract decimals by lining up the point rather than the last digit",
        { exams: ALL }
      ),
      a(
        "Naira and kobo",
        "calculate with money, work out change, and round to the nearest kobo correctly",
        { exams: NONE }
      ),
      a(
        "Fractions to decimals",
        "convert a simple fraction to a decimal and back, and recognise the common ones on sight",
        { exams: ALL }
      ),
    ],
  },

  {
    code: "L0-G1",
    level: "L0",
    strand: "G",
    title: "Measurement basics",
    summary:
      "Units, instruments, and the two measurements every mensuration question in this course is eventually built from.",
    because:
      "Unit-conversion slips appear in the Chief Examiners' reports year after year, usually as an answer that is right but a thousand times too large.",
    needs: ["L0-N5.2"],
    atoms: [
      a(
        "Metric conversion",
        "convert between mm, cm, m and km, between g and kg, and between ml and litres",
        { exams: ALL }
      ),
      a(
        "Reading instruments",
        "read a ruler, a weighing scale, a measuring cylinder and a clock, including between the marks",
        { exams: NONE }
      ),
      a(
        "Perimeter",
        "find the perimeter of a rectangle and of a shape made from rectangles",
        { exams: ALL }
      ),
      a(
        "Area of rectangles",
        "find the area of a rectangle and of a compound shape, with the units written correctly",
        { exams: ALL }
      ),
    ],
  },

  {
    code: "L0-S1",
    level: "L0",
    strand: "S",
    title: "Reading data",
    summary:
      "Getting an answer out of a table or a chart — the skill every statistics question begins with, and one many students were never actually taught.",
    needs: ["L0-N1.3"],
    // Not a chain: these three are independent readings of the same page.
    chain: false,
    atoms: [
      a(
        "Reading tables and timetables",
        "answer questions from a table or a bus timetable, including questions about elapsed time",
        { exams: ALL, needs: ["L0-G1.2"] }
      ),
      a(
        "Reading bar charts and pictograms",
        "read values off a bar chart and a pictogram, including one with a scaled key",
        { exams: ALL }
      ),
      a(
        "Answering from data",
        "decide which row, column or bar a worded question is actually asking about",
        { exams: ALL }
      ),
    ],
  },
];

export default L0_MODULES;