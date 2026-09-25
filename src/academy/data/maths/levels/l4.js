import { a, ALL, WN } from "./shorthand.js";

/**
 * LEVEL 4 · SS1 — THE SENIOR NUMBER SYSTEM AND QUADRATICS
 *
 * L4 covers the heaviest-weighted exam strand, Number and Numeration, almost
 * completely, and introduces the quadratic. By the end of it a student can
 * already answer a large share of WAEC Paper 1.
 */
export const L4_MODULES = [
  {
    code: "L4-N1",
    level: "L4",
    strand: "N",
    title: "Number bases, in full",
    summary: "Bases with fractional parts, base equations, and bases inside word problems.",
    needs: ["L3-N1.3"],
    atoms: [
      a("Fractional parts between bases", "convert numbers with a fractional part between bases", { exams: ALL }),
      a("Base equations", "solve an equation where the base itself is the unknown", { exams: ALL }),
      a("Bases in word problems", "apply base conversion inside a worded problem", { exams: ALL }),
    ],
  },
  {
    code: "L4-N2",
    level: "L4",
    strand: "N",
    title: "Modular arithmetic",
    summary: "Clock arithmetic. A WAEC and NECO topic that rewards understanding over memory.",
    needs: ["L0-N2.3", "L3-N1.2"],
    atoms: [
      a("Remainders mod n", "find the remainder of a number modulo n and write it in the standard form", { exams: WN }),
      a("Adding and subtracting mod n", "add and subtract in modulo arithmetic", { exams: WN }),
      a("Multiplying mod n", "multiply in modulo arithmetic and build a multiplication table mod n", { exams: WN }),
      a("Modular equations and cycles", "solve a simple modular equation and apply it to days of the week and repeating cycles", { exams: WN }),
    ],
  },
  {
    code: "L4-N3",
    level: "L4",
    strand: "N",
    title: "Logarithms",
    summary: "An index question asked backwards. Taught from indices, not as a separate set of rules to memorise.",
    needs: ["L2-N1.4"],
    atoms: [
      a("Indices and logarithms linked", "rewrite an index statement as a logarithm and back again", { exams: ALL }),
      a("Laws of logarithms", "use the product, quotient and power laws of logarithms", { exams: ALL }),
      a("Log and antilog tables", "use four-figure log and antilog tables to evaluate an expression", { exams: WN }),
      a("Change of base", "change the base of a logarithm", { exams: ALL }),
      a("Solving log equations", "solve an equation involving logarithms and check for invalid solutions", { exams: ALL }),
    ],
  },
  {
    code: "L4-N4",
    level: "L4",
    strand: "N",
    title: "Surds",
    summary: "Exact irrational numbers, kept exact. Rationalising is the skill examiners test hardest.",
    needs: ["L1-N2.1", "L2-N1.1"],
    atoms: [
      a("Simplifying surds", "simplify a surd by extracting the largest square factor", { exams: ALL }),
      a("Adding and subtracting surds", "add and subtract surds by simplifying to like surds first", { exams: ALL }),
      a("Multiplying surds", "multiply surds, including brackets containing surds", { exams: ALL }),
      a("Rationalising denominators", "rationalise a denominator, including one of the form a plus root b, using the conjugate", { exams: ALL }),
    ],
  },
  {
    code: "L4-N5",
    level: "L4",
    strand: "N",
    title: "Sets",
    summary: "Notation, the operations, and the Venn diagram that turns a worded problem into arithmetic.",
    needs: ["L0-N3.1", "L1-A1.4"],
    atoms: [
      a("Set notation and types of sets", "use set notation and identify finite, infinite, empty, subset and universal sets", { exams: ALL }),
      a("Union, intersection and complement", "find the union, intersection and complement of sets", { exams: ALL }),
      a("Two-set Venn problems", "solve a two-set Venn diagram problem from a worded description", { exams: ALL }),
      a("Three-set Venn problems", "solve a three-set Venn diagram problem, filling the centre region first", { exams: ALL }),
    ],
  },
  {
    code: "L4-N6",
    level: "L4",
    strand: "N",
    title: "Logical reasoning",
    summary: "Statements, negation, implication, and testing an argument. WAEC and NECO only.",
    needs: ["L4-N5.2"],
    atoms: [
      a("Statements", "decide whether a sentence is a logical statement and give its truth value", { exams: WN }),
      a("Negation", "write the negation of a statement, including one with a quantifier", { exams: WN }),
      a("Implication, converse and contrapositive", "write the converse, inverse and contrapositive of an implication", { exams: WN }),
      a("Testing arguments with Venn diagrams", "test the validity of an argument using a Venn diagram", { exams: WN }),
    ],
  },
  {
    code: "L4-A1",
    level: "L4",
    strand: "A",
    title: "Quadratic equations",
    summary: "Four routes to the same roots, and the two facts about roots that make the hardest questions quick.",
    needs: ["L3-A1.3", "L4-N4.1"],
    atoms: [
      a("Solving by factorising", "solve a quadratic equation by factorising", { exams: ALL }),
      a("Completing the square", "solve a quadratic by completing the square, and use it to find the turning point", { exams: ALL }),
      a("The quadratic formula", "solve a quadratic with the formula and interpret the discriminant", { exams: ALL }),
      a("Forming an equation from roots", "write the quadratic equation with given roots", { exams: ALL }),
      a("Sum and product of roots", "use the sum and product of roots without solving the equation", { exams: ALL }),
    ],
  },
  {
    code: "L4-A2",
    level: "L4",
    strand: "A",
    title: "Quadratic graphs",
    summary: "The parabola as a drawing with marks attached: scale, plotting, roots, turning point and tangent.",
    because: "Graph questions carry a lot of marks and are lost on the drawing, not the algebra — wrong scale, unlabelled axes, points joined with a ruler.",
    needs: ["L2-A3.3", "L4-A1.2"],
    atoms: [
      a("Drawing a quadratic graph", "build a table of values and draw a smooth parabola with a suitable scale", { exams: WN }),
      a("Reading roots, maximum and minimum", "read the roots and the turning point off the graph", { exams: WN }),
      a("Line and curve intersections", "solve a quadratic and a linear equation simultaneously by drawing both", { exams: WN }),
      a("Tangent and gradient", "draw a tangent at a point and estimate the gradient from it", { exams: WN }),
    ],
  },
  {
    code: "L4-A3",
    level: "L4",
    strand: "A",
    title: "Variation",
    summary: "All four kinds, with the constant found first every single time.",
    needs: ["L3-N3.2", "L3-A3.1"],
    atoms: [
      a("Direct and inverse variation", "solve direct and inverse variation problems by finding k first", { exams: ALL }),
      a("Joint and partial variation", "set up and solve joint and partial variation, including a two-equation partial case", { exams: ALL }),
      a("Applied variation problems", "translate a worded variation problem into a formula and answer it", { exams: ALL }),
    ],
  },
  {
    code: "L4-G1",
    level: "L4",
    strand: "G",
    title: "Mensuration",
    summary: "Sectors, cones, frustums and composite solids — and the area and volume factors of similar figures.",
    needs: ["L3-G2.3", "L2-G3.1"],
    atoms: [
      a("Arc length and sector area", "find arc length, sector area and segment area", { exams: ALL }),
      a("Sector to cone", "relate the sector of a circle to the curved surface of a cone", { exams: ALL }),
      a("Frustums and composite solids", "find the volume and surface area of a frustum and of a composite solid", { exams: ALL }),
      a("Areas and volumes of similar figures", "use the square and cube of the scale factor for areas and volumes", { exams: ALL }),
    ],
  },
  {
    code: "L4-G2",
    level: "L4",
    strand: "G",
    title: "Triangles and polygons",
    summary: "Congruence, the special quadrilaterals, and the two theorems that carry most of the geometry proof marks.",
    needs: ["L2-G1.3", "L3-G1.3"],
    atoms: [
      a("Triangle congruence", "prove two triangles congruent, quoting the correct condition", { exams: ALL }),
      a("Special quadrilaterals", "use the properties of parallelograms, rhombuses, kites and trapeziums in a proof", { exams: ALL }),
      a("The intercept theorem", "apply the intercept theorem to find a missing length", { exams: ALL }),
      a("Similar triangle problems", "solve problems using similar triangles, including inside a larger figure", { exams: ALL }),
    ],
  },
  {
    code: "L4-G3",
    level: "L4",
    strand: "G",
    title: "Loci",
    summary: "The set of all points that satisfy a condition, constructed rather than described.",
    needs: ["L2-G2.4"],
    atoms: [
      a("The four standard loci", "construct the four standard loci accurately", { exams: ALL }),
      a("Intersecting loci", "find the point or points satisfying two loci at once", { exams: ALL }),
    ],
  },
  {
    code: "L4-T1",
    level: "L4",
    strand: "T",
    title: "Trigonometry beyond 90 degrees",
    summary: "The ratios leave the right-angled triangle and become functions of any angle.",
    needs: ["L3-T1.4", "L2-A3.4"],
    atoms: [
      a("Ratios from 0 to 360 degrees", "find sine, cosine and tangent of any angle from 0 to 360 degrees and get the sign right", { exams: ALL }),
      a("Exact values", "use the exact values for 30, 45 and 60 degrees without a calculator", { exams: ALL }),
      a("Graphs of sine and cosine", "draw and read the graphs of sine and cosine", { exams: ALL }),
    ],
  },
  {
    code: "L4-S1",
    level: "L4",
    strand: "S",
    title: "Data presentation",
    summary: "Grouped data drawn properly, and the three averages when the raw values are gone.",
    needs: ["L3-S1.3"],
    atoms: [
      a("Histograms and frequency polygons", "draw a histogram with correct class boundaries and a frequency polygon", { exams: ALL }),
      a("Averages of grouped data", "find the mean, the modal class and the median class of grouped data", { exams: ALL }),
      a("Assumed mean", "calculate a mean using an assumed mean and say why it helps", { exams: ALL }),
    ],
  },
];

export default L4_MODULES;
