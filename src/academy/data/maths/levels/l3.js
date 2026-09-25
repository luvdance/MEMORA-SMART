import { a, ALL, WN } from "./shorthand.js";

/**
 * LEVEL 3 · JSS3 — ALGEBRA POWER AND BECE READINESS
 *
 * L3 completes junior secondary and makes the student fluent in the two
 * algebra skills almost every senior topic relies on: factorising, and
 * simultaneous equations. It ends with a BECE-style mock.
 */
export const L3_MODULES = [
  {
    code: "L3-N1",
    level: "L3",
    strand: "N",
    title: "Number bases",
    summary: "Base two generalised. Any base, in both directions, including finding an unknown base.",
    needs: ["L2-N4.2"],
    atoms: [
      a("Converting between any bases", "convert a number between any two bases from 2 to 10", { exams: ALL }),
      a("Arithmetic in any base", "add, subtract and multiply in a given base", { exams: ALL }),
      a("Finding an unknown base", "form and solve an equation to find an unknown base", { exams: ALL }),
    ],
  },
  {
    code: "L3-N2",
    level: "L3",
    strand: "N",
    title: "Commercial arithmetic 2",
    summary: "The money maths an adult actually meets: compound interest, tax, hire purchase and exchange rates.",
    needs: ["L2-N2.4"],
    atoms: [
      a("Compound interest year by year", "calculate compound interest by working through one year at a time", { exams: ALL }),
      a("VAT and income tax", "calculate VAT and income tax, including tax on a banded income", { exams: ALL }),
      a("Hire purchase", "calculate the total cost and the extra cost of buying on hire purchase", { exams: WN }),
      a("Foreign exchange", "convert between currencies using a given rate, in both directions", { exams: ALL }),
    ],
  },
  {
    code: "L3-N3",
    level: "L3",
    strand: "N",
    title: "Errors and variation, introduced",
    summary: "How wrong a measurement can be, and the first formal treatment of one quantity depending on another.",
    needs: ["L1-N5.3", "L2-N3.3"],
    atoms: [
      a("Absolute and percentage error", "find the absolute error and the percentage error in a measurement", { exams: ALL }),
      a("Direct and inverse variation", "write and use k as a constant of variation for direct and inverse variation", { exams: ALL }),
    ],
  },
  {
    code: "L3-A1",
    level: "L3",
    strand: "A",
    title: "Factorisation",
    summary: "Every factorising technique the senior syllabus uses, in the order they build on each other.",
    because: "Quadratics, algebraic fractions, curve sketching and calculus all reduce to factorising at some point. A gap here surfaces four times later.",
    needs: ["L2-A1.3"],
    atoms: [
      a("Factorising by grouping", "factorise a four-term expression by grouping in pairs", { exams: ALL }),
      a("Difference of two squares", "recognise and factorise a difference of two squares", { exams: ALL }),
      a("Factorising quadratic trinomials", "factorise a quadratic trinomial, including where the coefficient of x squared is not 1", { exams: ALL }),
      a("Simplifying by factorising", "simplify an algebraic fraction by factorising the top and bottom first", { exams: ALL }),
    ],
  },
  {
    code: "L3-A2",
    level: "L3",
    strand: "A",
    title: "Simultaneous linear equations",
    summary: "Two unknowns, three methods, and the judgement about which method a given pair invites.",
    needs: ["L2-A2.3", "L2-A3.3"],
    atoms: [
      a("Elimination", "solve a pair of simultaneous equations by elimination", { exams: ALL }),
      a("Substitution", "solve a pair of simultaneous equations by substitution", { exams: ALL }),
      a("Graphical solution", "solve a pair of simultaneous equations by drawing both lines and reading the intersection", { exams: ALL }),
      a("Word problems", "form a pair of simultaneous equations from a worded problem and solve them", { exams: ALL }),
    ],
  },
  {
    code: "L3-A3",
    level: "L3",
    strand: "A",
    title: "Formulae",
    summary: "Rearranging when the letter you want is trapped under a root, a square or a denominator.",
    needs: ["L2-A2.3", "L3-A1.2"],
    atoms: [
      a("Changing the subject with powers and roots", "make a letter the subject when it appears squared or under a root", { exams: ALL }),
      a("Substituting into formulae", "substitute into a formula accurately, including with negative and decimal values", { exams: ALL }),
    ],
  },
  {
    code: "L3-A4",
    level: "L3",
    strand: "A",
    title: "Inequalities 1",
    summary: "Solving like an equation, with one rule that is different and is the one everybody forgets.",
    needs: ["L2-A2.2", "L1-N6.3"],
    atoms: [
      a("Solving linear inequalities", "solve a linear inequality, reversing the sign when multiplying or dividing by a negative", { exams: ALL }),
      a("Showing solutions on a number line", "show an inequality solution on a number line with the correct open or closed circle", { exams: ALL }),
    ],
  },
  {
    code: "L3-A5",
    level: "L3",
    strand: "A",
    title: "Algebraic fractions 1",
    summary: "Fraction arithmetic with letters. Same rules as L1-N3, and the same failures when L1-N3 was never solid.",
    needs: ["L1-N3.2", "L2-A1.4"],
    atoms: [
      a("Adding and subtracting algebraic fractions", "add and subtract algebraic fractions with monomial denominators using the LCM", { exams: ALL }),
      a("Multiplying and dividing algebraic fractions", "multiply and divide algebraic fractions, cancelling before multiplying", { exams: ALL }),
    ],
  },
  {
    code: "L3-G1",
    level: "L3",
    strand: "G",
    title: "Similarity and enlargement",
    summary: "Same shape, different size — and what that does to lengths, and later to areas and volumes.",
    needs: ["L2-G1.2", "L2-N3.1"],
    atoms: [
      a("Identifying similar shapes", "decide whether two shapes are similar and state the corresponding sides", { exams: ALL }),
      a("Scale factor for lengths", "use a scale factor to find a missing length in a pair of similar shapes", { exams: ALL }),
      a("Enlargement from a centre", "enlarge a shape from a given centre by a given scale factor", { exams: WN }),
    ],
  },
  {
    code: "L3-T1",
    level: "L3",
    strand: "T",
    title: "Pythagoras and the trigonometric ratios",
    summary: "The right-angled triangle, completely. Everything in the trigonometry strand grows out of this module.",
    needs: ["L3-G1.2", "L3-A3.1"],
    atoms: [
      a("Pythagoras theorem", "find any side of a right-angled triangle using Pythagoras", { exams: ALL }),
      a("Defining sine, cosine and tangent", "identify the opposite, adjacent and hypotenuse and write the three ratios", { exams: ALL }),
      a("Finding sides and angles", "find an unknown side or angle in a right-angled triangle using the correct ratio", { exams: ALL }),
      a("Elevation and depression", "solve angle of elevation and depression problems, starting from a labelled diagram", { exams: ALL }),
    ],
  },
  {
    code: "L3-G2",
    level: "L3",
    strand: "G",
    title: "Surface area and volume",
    summary: "The curved solids, and capacity in the units a Nigerian shop actually sells in.",
    needs: ["L2-G3.3"],
    atoms: [
      a("Cylinder", "find the surface area and volume of a cylinder, open or closed", { exams: ALL }),
      a("Cone and pyramid", "find the surface area and volume of a cone and a pyramid, distinguishing slant height from vertical height", { exams: ALL }),
      a("Capacity in litres", "convert between cubic centimetres, cubic metres and litres and solve capacity problems", { exams: ALL }),
    ],
  },
  {
    code: "L3-S1",
    level: "L3",
    strand: "S",
    title: "Statistics 3",
    summary: "The three averages from a frequency table, and the judgement about which one a situation calls for.",
    needs: ["L2-S1.3"],
    atoms: [
      a("Averages from a frequency table", "find the mean, median and mode from a frequency table", { exams: ALL }),
      a("Choosing the best average", "choose the most appropriate average for a data set and justify the choice", { exams: ALL }),
      a("Interpreting charts", "interpret a chart or table in context and answer a question about what it shows", { exams: ALL }),
    ],
  },
];

export default L3_MODULES;
