import { a, ALL, WN, JAMB_ONLY } from "./shorthand.js";

/**
 * LEVEL 6 · SS3 — FINAL TOPICS AND EXAM MASTERY
 *
 * Part A finishes the syllabus. Part B stops teaching content and starts
 * training for the paper: translating word problems, answering objectives at
 * speed, writing Paper 2 working that earns method marks, and full timed
 * mocks with a recovery loop attached to them.
 *
 * JAMB-only atoms are tagged, so a student not writing UTME Mathematics can
 * skip them honestly instead of being told everything is compulsory.
 */
export const L6_MODULES = [
  /* ── Part A · content ────────────────────────────────────────────── */
  {
    code: "L6-C1",
    level: "L6",
    strand: "C",
    title: "Matrices and determinants",
    summary: "Arrays as objects you can add and multiply, and the determinant that decides whether a system has one answer.",
    needs: ["L3-A2.1"],
    atoms: [
      a("Order and types of matrix", "state the order of a matrix and identify square, identity and null matrices", { exams: ALL }),
      a("Adding and subtracting matrices", "add and subtract matrices, and say when it is impossible", { exams: ALL }),
      a("Multiplying matrices", "multiply matrices, checking the orders are compatible first", { exams: ALL }),
      a("Determinant and inverse of a 2x2", "find the determinant and the inverse of a two by two matrix", { exams: ALL }),
      a("Solving equations with matrices", "solve simultaneous equations using the inverse matrix, and find a three by three determinant", { exams: ALL }),
    ],
  },
  {
    code: "L6-G1",
    level: "L6",
    strand: "G",
    title: "Vectors",
    summary: "Quantities with a direction, in component form and as position vectors.",
    needs: ["L5-G2.1", "L4-T1.1"],
    atoms: [
      a("Representing vectors", "write a vector as a directed line segment and in component form", { exams: WN }),
      a("Magnitude and direction", "find the magnitude and the direction of a vector", { exams: WN }),
      a("Adding, subtracting and scaling", "add, subtract and multiply vectors by a scalar", { exams: WN }),
      a("Position vectors", "use position vectors to find a vector between two points and prove simple results", { exams: WN }),
    ],
  },
  {
    code: "L6-G2",
    level: "L6",
    strand: "G",
    title: "Transformations",
    summary: "The four transformations, performed and — the part that carries the marks — fully described.",
    needs: ["L3-G1.3", "L5-G2.4"],
    atoms: [
      a("Reflection", "reflect a point or a shape in a given line and state the image", { exams: WN }),
      a("Rotation", "rotate a shape about a given centre through a given angle", { exams: WN }),
      a("Translation and enlargement", "translate by a vector and enlarge from a centre, including a negative scale factor", { exams: WN }),
      a("Describing a transformation fully", "describe a transformation completely, giving every piece of information the mark scheme requires", { exams: WN }),
    ],
  },
  {
    code: "L6-G3",
    level: "L6",
    strand: "G",
    title: "The Earth as a sphere",
    summary: "Latitude and longitude, distances along circles, and the time difference that follows from the longitude.",
    needs: ["L4-G1.1", "L4-T1.2"],
    atoms: [
      a("Latitude and longitude", "locate a point by latitude and longitude and describe the circles involved", { exams: ALL }),
      a("Distance along a meridian or parallel", "find the distance between two points along a meridian or a parallel of latitude", { exams: ALL }),
      a("Time and longitude", "find the time difference between two places from their longitudes", { exams: ALL }),
    ],
  },
  {
    code: "L6-C2",
    level: "L6",
    strand: "C",
    title: "Differentiation",
    summary: "The gradient of a curve at a point, from the limit that defines it to the maximum and minimum it finds.",
    needs: ["L4-A2.4", "L5-G2.2"],
    atoms: [
      a("Limits and the gradient of a curve", "explain a limit and what the gradient at a point means", { exams: ALL }),
      a("Differentiating from first principles", "differentiate a simple function from first principles", { exams: ALL }),
      a("The power rule", "differentiate a polynomial using the power rule", { exams: ALL }),
      a("Differentiating sine, cosine and tangent", "differentiate the three trigonometric functions", { exams: JAMB_ONLY }),
      a("Rates of change", "use the derivative as a rate of change, including velocity and acceleration", { exams: ALL }),
      a("Maxima and minima", "find turning points, decide which is which, and solve an optimisation problem", { exams: ALL }),
    ],
  },
  {
    code: "L6-C3",
    level: "L6",
    strand: "C",
    title: "Integration",
    summary: "Differentiation run backwards, and the area it measures.",
    needs: ["L6-C2.3"],
    atoms: [
      a("Integration as the reverse", "integrate a polynomial and explain the constant of integration", { exams: ALL }),
      a("Definite integrals", "evaluate a definite integral", { exams: ALL }),
      a("Area under a curve", "find the area under a curve, handling area below the axis correctly", { exams: ALL }),
      a("Integrating simple trigonometric functions", "integrate sine and cosine", { exams: JAMB_ONLY }),
    ],
  },
  {
    code: "L6-A1",
    level: "L6",
    strand: "A",
    title: "Polynomials",
    summary: "Division, the factor and remainder theorems, and cubics. JAMB only.",
    needs: ["L3-A1.3", "L4-A1.1"],
    atoms: [
      a("Multiplying and dividing polynomials", "multiply polynomials and divide one polynomial by another", { exams: JAMB_ONLY }),
      a("The remainder theorem", "find a remainder using the remainder theorem", { exams: JAMB_ONLY }),
      a("The factor theorem and cubics", "use the factor theorem to factorise a cubic completely", { exams: JAMB_ONLY }),
      a("Sketching cubic graphs", "sketch a cubic from its factorised form", { exams: JAMB_ONLY }),
    ],
  },
  {
    code: "L6-N1",
    level: "L6",
    strand: "N",
    title: "Binary operations",
    summary: "An operation defined by a rule you have never seen, tested for the four properties. JAMB only.",
    needs: ["L1-A1.3", "L4-N2.3"],
    atoms: [
      a("Closure, commutativity, associativity, distributivity", "test a defined operation for each of the four properties", { exams: JAMB_ONLY }),
      a("Identity and inverse elements", "find the identity element and the inverse of an element under a defined operation", { exams: JAMB_ONLY }),
    ],
  },
  {
    code: "L6-S1",
    level: "L6",
    strand: "S",
    title: "Permutations and combinations",
    summary: "Counting arrangements and selections, and knowing which of the two a question is asking for. JAMB only.",
    needs: ["L5-S3.2"],
    atoms: [
      a("Linear and circular arrangements", "count linear and circular arrangements", { exams: JAMB_ONLY }),
      a("Repeated objects", "count arrangements when some objects are identical", { exams: JAMB_ONLY }),
      a("Selections with nCr", "count selections with nCr and tell a selection from an arrangement", { exams: JAMB_ONLY }),
    ],
  },

  /* ── Part B · exam mastery ───────────────────────────────────────── */
  {
    code: "L6-E1",
    level: "L6",
    strand: "A",
    title: "Word-problem translation lab",
    summary: "Five word problems a day, and no solving until the setup has been checked. Setting up is the marked skill.",
    because: "Failure to translate word problems into mathematical statements and diagrams is the single most repeated complaint in the Chief Examiners reports, from 2014 to the present.",
    needs: ["L1-A1.4", "L1-N3.4", "L3-A2.4"],
    examMastery: true,
    atoms: [
      a("Finding the key words", "underline the quantities and the relationships in a worded problem and name the unknown", { exams: ALL }),
      a("Drawing the model", "draw the bar model or diagram that the problem describes, before writing any algebra", { exams: ALL }),
      a("Writing the equation", "write the equation or equations the model shows, and check them against the words", { exams: ALL }),
    ],
  },
  {
    code: "L6-E2",
    level: "L6",
    strand: "N",
    title: "Objective speed drills",
    summary: "Ten questions in twelve minutes, on screen. Paper 1 and UTME give no method marks, so only the answer and the clock count.",
    needs: ["L6-E1.3"],
    examMastery: true,
    atoms: [
      a("Pacing", "answer ten objectives in twelve minutes and know when to abandon a question", { exams: ALL }),
      a("Elimination and substitution", "use the options themselves — eliminate, substitute, estimate — to reach the answer faster", { exams: ALL }),
      a("On-screen CBT practice", "work accurately in a computer-based format, including on-screen rough work", { exams: ALL }),
    ],
  },
  {
    code: "L6-E3",
    level: "L6",
    strand: "A",
    title: "Paper 2 technique",
    summary: "The marks that have nothing to do with knowing the maths: working shown, units stated, accuracy kept, graphs labelled.",
    needs: ["L6-E1.3"],
    examMastery: true,
    atoms: [
      a("Showing full working", "set out working so that method marks are earned even when the final answer is wrong", { exams: WN }),
      a("Units and degree of accuracy", "state units and keep full accuracy until the final step, then round as instructed", { exams: WN }),
      a("Labelling graphs and diagrams", "label a graph or diagram to the standard the mark scheme requires", { exams: WN }),
      a("Choosing Section B questions", "choose which of the optional questions to answer within the first three minutes", { exams: WN }),
    ],
  },
  {
    code: "L6-E4",
    level: "L6",
    strand: "N",
    title: "Full timed mocks",
    summary: "Whole papers under exam conditions, alternating WAEC and NECO style with JAMB CBT style.",
    needs: ["L6-E2.3", "L6-E3.4"],
    examMastery: true,
    atoms: [
      a("WAEC and NECO full mock", "sit a full four-hour paper under exam conditions and finish it", { exams: WN }),
      a("JAMB CBT mock", "sit a full UTME-style computer-based mock to time", { exams: JAMB_ONLY }),
    ],
  },
  {
    code: "L6-E5",
    level: "L6",
    strand: "N",
    title: "Weak-topic recovery",
    summary: "After every mock, the platform lists each atom that scored below 70% and sends the student back through it before the next mock.",
    needs: ["L6-E4.1"],
    examMastery: true,
    atoms: [
      a("Reading your own mock", "turn a mock result into a list of atoms, not a list of feelings about the score", { exams: ALL }),
      a("Re-mastering a weak atom", "re-master every atom below 70% and prove it on a fresh check before the next mock", { exams: ALL }),
    ],
  },
];

export default L6_MODULES;
