import { a, ALL, WN, NONE } from "./shorthand.js";

/**
 * LEVEL 1 · JSS1 — NUMBER CONFIDENCE AND FIRST ALGEBRA
 *
 * L1 turns arithmetic into reasoning. Fractions, factors and percentages stop
 * being procedures and become tools, and a letter starts standing for a number.
 *
 * Fractions (L1-N3) get more atoms than any other module at this level, on
 * purpose: examiners are still reporting fraction errors in SS3 scripts, and
 * every one of those students passed JSS1 on a calendar rather than on
 * evidence.
 */
export const L1_MODULES = [
  {
    code: "L1-N1",
    level: "L1",
    strand: "N",
    title: "Large numbers and base two",
    summary:
      "Numbers past the billion, and the first hint that ten is a choice rather than a law of nature.",
    needs: ["L0-N1.4"],
    atoms: [
      a("Numbers to trillions", "read, write and order numbers up to trillions", {
        exams: NONE,
      }),
      a("Counting in base two", "count in base 2 and say what each column is worth", {
        exams: ALL,
      }),
      a(
        "Converting base 10 and base 2",
        "convert a number from base 10 to base 2 and back again",
        { exams: ALL }
      ),
      a(
        "Adding and subtracting in base two",
        "add and subtract binary numbers, carrying and borrowing correctly",
        { exams: ALL }
      ),
    ],
  },

  {
    code: "L1-N2",
    level: "L1",
    strand: "N",
    title: "Factors, HCF and LCM",
    summary:
      "Prime factorisation, and the two numbers you get out of it. Used again in fractions, in algebraic fractions and in surds.",
    needs: ["L0-N3.4"],
    atoms: [
      a(
        "Prime factorisation",
        "write a number as a product of its prime factors using a factor tree, in index form",
        { exams: ALL }
      ),
      a(
        "Highest common factor",
        "find the HCF of two or three numbers from their prime factorisation",
        { exams: ALL }
      ),
      a(
        "Lowest common multiple",
        "find the LCM of two or three numbers, and say why it is not simply their product",
        { exams: ALL }
      ),
      a(
        "HCF and LCM word problems",
        "decide whether a worded problem — bells ringing together, sharing into equal groups — needs the HCF or the LCM",
        { exams: ALL }
      ),
    ],
  },

  {
    code: "L1-N3",
    level: "L1",
    strand: "N",
    title: "Fractions",
    summary:
      "The arithmetic, now that the meaning is secure. This module gets the most time at this level, deliberately.",
    because:
      "A student weak here will later fail algebraic fractions, probability and calculus — and the failure will look as though it belongs to those topics.",
    needs: ["L0-N4.4", "L1-N2.3"],
    atoms: [
      a(
        "Adding and subtracting unlike fractions",
        "add and subtract fractions with different denominators using the LCM",
        { exams: ALL }
      ),
      a(
        "Multiplying and dividing fractions",
        "multiply fractions, and divide by multiplying by the reciprocal — and explain why that works",
        { exams: ALL }
      ),
      a(
        "Mixed numbers",
        "convert between mixed numbers and improper fractions, and calculate with both",
        { exams: ALL }
      ),
      a(
        "Fraction word problems with bar models",
        "draw a bar model for a worded fraction problem and solve it from the drawing",
        { exams: ALL }
      ),
    ],
  },

  {
    code: "L1-N4",
    level: "L1",
    strand: "N",
    title: "Decimals and percentages",
    summary:
      "One quantity, three notations. Fluent movement between them is what makes commercial arithmetic easy two levels later.",
    needs: ["L0-N5.4", "L1-N3.2"],
    atoms: [
      a(
        "Fractions, decimals and percentages",
        "convert freely between all three and recognise the common equivalences on sight",
        { exams: ALL }
      ),
      a(
        "Percentage of a quantity",
        "find a percentage of an amount, with and without a calculator",
        { exams: ALL }
      ),
      a(
        "One quantity as a percentage of another",
        "express one quantity as a percentage of another, and know which of the two goes underneath",
        { exams: ALL }
      ),
    ],
  },

  {
    code: "L1-N5",
    level: "L1",
    strand: "N",
    title: "Approximation",
    summary:
      "Decimal places, significant figures, and the habit of knowing roughly what the answer should be before working it out.",
    because:
      "Premature rounding and the wrong degree of accuracy are named directly in the 2013 Chief Examiner report, and they cost marks on answers that were otherwise correct.",
    needs: ["L0-N1.4", "L1-N4.1"],
    atoms: [
      a("Decimal places", "round a number to a given number of decimal places", {
        exams: ALL,
      }),
      a(
        "Significant figures",
        "round to a given number of significant figures, including for numbers less than one",
        { exams: ALL }
      ),
      a(
        "Estimating first",
        "estimate an answer before calculating, and use the estimate to catch an answer of the wrong size",
        { exams: ALL }
      ),
    ],
  },

  {
    code: "L1-N6",
    level: "L1",
    strand: "N",
    title: "Directed numbers",
    summary:
      "Negatives as positions and as movements. The sign rules are not arbitrary and are not to be memorised as rules.",
    needs: ["L0-N1.3"],
    atoms: [
      a(
        "Integers on a number line",
        "place positive and negative integers on a line and order them",
        { exams: ALL }
      ),
      a(
        "Adding and subtracting negatives",
        "add and subtract directed numbers, reading subtraction as a movement along the line",
        { exams: ALL }
      ),
      a(
        "Multiplying and dividing negatives",
        "multiply and divide directed numbers, and explain the sign of the answer",
        { exams: ALL }
      ),
      a(
        "Directed numbers in context",
        "solve temperature, altitude and bank-balance problems involving negatives",
        { exams: ALL }
      ),
    ],
  },

  {
    code: "L1-A1",
    level: "L1",
    strand: "A",
    title: "Algebraic expressions",
    summary:
      "A letter is a number you do not know yet. Everything algebraic in the next five levels starts in this module.",
    needs: ["L1-N6.3"],
    atoms: [
      a(
        "Letters for unknowns",
        "use a letter for an unknown, and read an algebraic expression aloud correctly",
        { exams: ALL }
      ),
      a(
        "Collecting like terms",
        "simplify an expression by collecting like terms, including terms with negative coefficients",
        { exams: ALL }
      ),
      a(
        "Substitution",
        "substitute values into an expression, including negative values, and evaluate it",
        { exams: ALL }
      ),
      a(
        "Writing an expression from words",
        "turn a worded statement into an algebraic expression",
        { exams: ALL }
      ),
    ],
  },

  {
    code: "L1-A2",
    level: "L1",
    strand: "A",
    title: "Simple equations",
    summary:
      "The balance. Whatever you do to one side you do to the other, and that one idea solves every linear equation there is.",
    needs: ["L1-A1.3"],
    atoms: [
      a(
        "One-step equations",
        "solve a one-step equation by the balance method and check the solution",
        { exams: ALL }
      ),
      a(
        "Two-step equations",
        "solve a two-step equation, undoing the operations in the right order",
        { exams: ALL }
      ),
      a(
        "Equations from word problems",
        "form an equation from a worded problem and solve it",
        { exams: ALL }
      ),
    ],
  },

  {
    code: "L1-G1",
    level: "L1",
    strand: "G",
    title: "Plane shapes",
    summary:
      "Naming, properties, and the four area formulas the whole mensuration strand is built on.",
    needs: ["L0-G1.4"],
    atoms: [
      a(
        "Triangles and quadrilaterals",
        "name triangles and quadrilaterals by their properties rather than by how they look",
        { exams: ALL }
      ),
      a(
        "Perimeter of plane shapes",
        "find the perimeter of triangles, quadrilaterals and compound shapes",
        { exams: ALL }
      ),
      a(
        "Area formulas",
        "find the area of a rectangle, triangle, parallelogram and trapezium, identifying the perpendicular height correctly",
        { exams: ALL }
      ),
    ],
  },

  {
    code: "L1-G2",
    level: "L1",
    strand: "G",
    title: "Solid shapes",
    summary:
      "Three dimensions, counted and unfolded. Nets are what make surface area obvious two levels later.",
    needs: ["L1-G1.3"],
    atoms: [
      a(
        "Faces, edges and vertices",
        "count the faces, edges and vertices of a solid and name it",
        { exams: NONE }
      ),
      a("Nets", "draw the net of a cube and a cuboid, and fold it back mentally", {
        exams: WN,
      }),
      a(
        "Volume of a cuboid",
        "find the volume of a cube and a cuboid, with cubic units written correctly",
        { exams: ALL }
      ),
    ],
  },

  {
    code: "L1-G3",
    level: "L1",
    strand: "G",
    title: "Angles",
    summary:
      "Measuring, drawing, and the three basic rules every later geometry proof leans on.",
    needs: ["L0-G1.2"],
    atoms: [
      a(
        "Classifying angles",
        "classify an angle as acute, right, obtuse, straight or reflex",
        { exams: ALL }
      ),
      a(
        "Measuring and drawing angles",
        "measure and draw an angle with a protractor to the nearest degree",
        { exams: WN }
      ),
      a(
        "Angles on a line and at a point",
        "use angles on a straight line, angles at a point, and vertically opposite angles",
        { exams: ALL }
      ),
    ],
  },

  {
    code: "L1-S1",
    level: "L1",
    strand: "S",
    title: "Data handling",
    summary:
      "Collecting data into a table, drawing it, and the three averages — with the beginnings of judgement about which one to use.",
    needs: ["L0-S1.3", "L1-N3.2"],
    atoms: [
      a("Frequency tables", "collect raw data into a frequency table using tallies", {
        exams: ALL,
      }),
      a(
        "Pictograms and bar charts",
        "draw a pictogram and a bar chart with an honest scale and a labelled axis",
        { exams: ALL }
      ),
      a(
        "Mean, median, mode and range",
        "find the mean, median, mode and range of a small data set",
        { exams: ALL }
      ),
    ],
  },
];

export default L1_MODULES;
