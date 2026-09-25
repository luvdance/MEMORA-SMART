import { a, ALL, WN } from "./shorthand.js";

/**
 * LEVEL 5 · SS2 — CIRCLES, TRIGONOMETRY AND DATA
 *
 * L5 holds most of the Paper 2 Section B material: circle theorems, the sine
 * and cosine rules, bearings, cumulative frequency and probability. These are
 * exactly the topics Chief Examiners describe as poorly attempted, so every
 * module here carries a diagram-drawing atom of its own rather than assuming
 * the diagram is the easy part.
 */
export const L5_MODULES = [
  {
    code: "L5-N1",
    level: "L5",
    strand: "N",
    title: "Sequences and series",
    summary: "Patterns made formal: the nth term, the sum, and the word problems both hide inside.",
    needs: ["L1-A1.4", "L2-A2.3"],
    atoms: [
      a("Finding a pattern", "describe a number pattern in words and continue it", { exams: ALL }),
      a("Arithmetic progressions", "find the nth term of an AP and use it", { exams: ALL }),
      a("Sum of an AP", "find the sum of the first n terms of an AP", { exams: ALL }),
      a("Geometric progressions", "find the nth term and the sum of a GP", { exams: ALL }),
      a("Sum to infinity and AP/GP word problems", "find the sum to infinity of a convergent GP and solve AP and GP word problems", { exams: ALL }),
    ],
  },
  {
    code: "L5-N2",
    level: "L5",
    strand: "N",
    title: "Financial arithmetic",
    summary: "Compound interest by formula, depreciation, annuities, and the capital-market vocabulary WAEC expects.",
    needs: ["L3-N2.4", "L5-N1.4"],
    atoms: [
      a("Compound interest by formula", "use the compound interest formula and compare it with the year-by-year method", { exams: ALL }),
      a("Depreciation", "calculate depreciation by the reducing balance method", { exams: WN }),
      a("Amortisation and annuities", "explain and calculate a simple annuity and an amortised repayment", { exams: WN }),
      a("Shares, bonds and capital market instruments", "describe shares, bonds and debentures and say how each returns money", { exams: WN }),
      a("Dividends and VAT", "calculate a dividend and the VAT on a transaction", { exams: ALL }),
    ],
  },
  {
    code: "L5-A1",
    level: "L5",
    strand: "A",
    title: "Simultaneous equations 2",
    summary: "One linear, one quadratic — solved by substitution, every time.",
    needs: ["L3-A2.2", "L4-A1.3"],
    atoms: [
      a("One linear and one quadratic", "solve a linear and a quadratic equation simultaneously by substitution", { exams: ALL }),
      a("Word problems", "form and solve a linear and quadratic pair from a worded problem", { exams: ALL }),
    ],
  },
  {
    code: "L5-A2",
    level: "L5",
    strand: "A",
    title: "Inequalities 2",
    summary: "Inequalities in two variables, shaded regions, and quadratic inequalities.",
    needs: ["L3-A4.2", "L4-A1.1", "L2-A3.3"],
    atoms: [
      a("Linear inequalities in two variables", "draw the boundary line and shade the region an inequality describes", { exams: ALL }),
      a("Simultaneous inequalities", "shade the region satisfying several inequalities at once and identify it clearly", { exams: ALL }),
      a("Quadratic inequalities", "solve a quadratic inequality and state the solution set", { exams: ALL }),
    ],
  },
  {
    code: "L5-A3",
    level: "L5",
    strand: "A",
    title: "Algebraic fractions 2",
    summary: "Binomial denominators, undefined values, and equations that contain fractions with letters in them.",
    needs: ["L3-A5.2", "L3-A1.4"],
    atoms: [
      a("Binomial denominators", "add and simplify algebraic fractions with binomial denominators", { exams: WN }),
      a("Undefined values", "state the values of the variable for which a fraction is undefined", { exams: WN }),
      a("Equations with algebraic fractions", "solve an equation containing algebraic fractions and reject invalid roots", { exams: WN }),
    ],
  },
  {
    code: "L5-A4",
    level: "L5",
    strand: "A",
    title: "Functions and relations",
    summary: "Mappings, the rule behind one, and function notation used properly.",
    needs: ["L1-A1.3", "L2-A3.1"],
    atoms: [
      a("Types of mapping", "identify one-to-one, many-to-one, one-to-many and onto mappings", { exams: WN }),
      a("Finding the rule", "find the rule of a mapping from a table of values", { exams: WN }),
      a("Evaluating functions", "evaluate a function, including a composite value, in function notation", { exams: ALL }),
    ],
  },
  {
    code: "L5-G1",
    level: "L5",
    strand: "G",
    title: "Circle theorems",
    summary: "Eight theorems, each as its own atom, because a student who knows seven will fail the question that needs the eighth.",
    because: "Circle theorems are named as poorly attempted in the 2012 report and in every report since. The failure is almost always naming the wrong theorem, not arithmetic.",
    needs: ["L4-G2.2", "L2-G3.1"],
    atoms: [
      a("Chord properties", "use the perpendicular from the centre to a chord", { exams: ALL }),
      a("Angle at the centre", "use the angle at the centre being twice the angle at the circumference", { exams: ALL }),
      a("Angle in a semicircle", "use the angle in a semicircle being a right angle", { exams: ALL }),
      a("Angles in the same segment", "use angles in the same segment being equal", { exams: ALL }),
      a("Cyclic quadrilaterals", "use opposite angles of a cyclic quadrilateral being supplementary", { exams: ALL }),
      a("Tangent and radius", "use the tangent being perpendicular to the radius, and equal tangents from a point", { exams: ALL }),
      a("Alternate segment theorem", "use the alternate segment theorem", { exams: ALL }),
      a("Intersecting chords", "use the intersecting chords theorem", { exams: ALL }),
    ],
  },
  {
    code: "L5-G2",
    level: "L5",
    strand: "G",
    title: "Coordinate geometry",
    summary: "Algebra applied to the plane: distance, midpoint, gradient and the equation of a line.",
    needs: ["L2-A3.4", "L3-T1.1"],
    atoms: [
      a("Distance and midpoint", "find the distance between two points and the midpoint of the segment joining them", { exams: ALL }),
      a("Gradient", "find the gradient of a line from two points and interpret its sign", { exams: ALL }),
      a("Equation of a line", "write the equation of a line from a point and a gradient, or from two points", { exams: ALL }),
      a("Parallel and perpendicular lines", "decide whether two lines are parallel or perpendicular from their gradients", { exams: ALL }),
    ],
  },
  {
    code: "L5-T1",
    level: "L5",
    strand: "T",
    title: "Solving triangles",
    summary: "Triangles without a right angle, and the bearings problems that are really triangle problems in disguise.",
    needs: ["L4-T1.2", "L2-G4.3"],
    atoms: [
      a("The sine rule", "apply the sine rule to find a side or an angle, and recognise the ambiguous case", { exams: ALL }),
      a("The cosine rule", "apply the cosine rule and know which of the two forms a question needs", { exams: ALL }),
      a("Area of a triangle", "find the area of a triangle using half ab sin C", { exams: ALL }),
      a("Bearings and distance", "solve a bearings and distance problem by drawing the triangle and solving it", { exams: ALL }),
      a("Elevation and depression in 2D", "solve two-stage elevation and depression problems", { exams: ALL }),
    ],
  },
  {
    code: "L5-S1",
    level: "L5",
    strand: "S",
    title: "Cumulative frequency",
    summary: "The ogive, drawn correctly, and everything that can be read off it.",
    because: "Cumulative frequency tables and ogives are explicitly named in the 2025 reports as a topic candidates attempt badly.",
    needs: ["L4-S1.2"],
    atoms: [
      a("Cumulative frequency tables", "build a cumulative frequency table with the correct upper class boundaries", { exams: ALL }),
      a("Drawing an ogive", "draw an ogive, plotting against upper class boundaries and using a sensible scale", { exams: ALL }),
      a("Reading quartiles and percentiles", "read the median, quartiles, percentiles and interquartile range from an ogive", { exams: ALL }),
      a("Interpreting in context", "answer a worded question, such as a pass mark or a top percentage, from an ogive", { exams: ALL }),
    ],
  },
  {
    code: "L5-S2",
    level: "L5",
    strand: "S",
    title: "Dispersion",
    summary: "How spread out the data is, which is the question an average cannot answer.",
    needs: ["L4-S1.3"],
    atoms: [
      a("Range and mean deviation", "find the range and the mean deviation of a data set", { exams: ALL }),
      a("Variance", "find the variance of ungrouped data", { exams: ALL }),
      a("Standard deviation, ungrouped", "find the standard deviation of ungrouped data", { exams: ALL }),
      a("Standard deviation, grouped", "find the standard deviation of grouped data from a frequency table", { exams: ALL }),
    ],
  },
  {
    code: "L5-S3",
    level: "L5",
    strand: "S",
    title: "Probability 2",
    summary: "Combined events. The whole module turns on one question: and, or, and whether the first event changed the second.",
    needs: ["L2-S2.3", "L1-N3.2"],
    atoms: [
      a("The addition rule", "use the addition rule for mutually exclusive events, and adjust it when they are not", { exams: ALL }),
      a("The multiplication rule", "use the multiplication rule for independent events", { exams: ALL }),
      a("With and without replacement", "calculate probabilities with and without replacement, and see what changes", { exams: ALL }),
      a("Tree diagrams", "draw a tree diagram for a two-stage experiment and use it", { exams: ALL }),
      a("At least and at most", "handle at least and at most problems, usually through the complement", { exams: ALL }),
    ],
  },
];

export default L5_MODULES;
