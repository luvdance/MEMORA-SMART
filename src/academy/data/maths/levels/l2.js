import { a, ALL, WN } from "./shorthand.js";

/**
 * LEVEL 2 · JSS2 — MONEY, GRAPHS AND GEOMETRY RULES
 *
 * The maths of everyday money, the Cartesian plane, and the angle rules that
 * every later geometry topic depends on. Commercial arithmetic starts here
 * rather than in SS1 because simple interest is still a named weakness in the
 * WAEC reports, and a topic first met in SS2 has three years to become solid.
 */
export const L2_MODULES = [
  {
    code: "L2-N1",
    level: "L2",
    strand: "N",
    title: "Indices and standard form",
    summary: "Powers as shorthand, and the notation science uses for very large and very small numbers.",
    needs: ["L1-N2.1", "L1-N5.2"],
    atoms: [
      a("Laws of indices", "multiply, divide and raise powers using the laws of indices", { exams: ALL }),
      a("Zero and negative indices", "use zero and negative indices, and explain what a negative index means", { exams: ALL }),
      a("Writing standard form", "write a large or small number in standard form, and read one back", { exams: ALL }),
      a("Calculating in standard form", "multiply and divide numbers in standard form and give the answer in standard form", { exams: ALL }),
    ],
  },
  {
    code: "L2-N2",
    level: "L2",
    strand: "N",
    title: "Commercial arithmetic 1",
    summary: "Profit, loss, interest, discount and commission — percentage put to work in a market.",
    because: "Simple interest and commercial arithmetic appear in the Chief Examiners' weakness lists more often than almost anything else at this level.",
    needs: ["L1-N4.3"],
    atoms: [
      a("Profit and loss percent", "calculate profit or loss as a percentage, and know what it is a percentage of", { exams: ALL }),
      a("Simple interest", "use I = PRT/100, and rearrange it to find any of the four quantities", { exams: ALL }),
      a("Discount and commission", "calculate a discount, a marked price and a commission", { exams: ALL }),
      a("Market problems", "solve multi-step shopping and market problems involving percentage", { exams: ALL }),
    ],
  },
  {
    code: "L2-N3",
    level: "L2",
    strand: "N",
    title: "Ratio, rate and proportion",
    summary: "Comparing two quantities, and what happens to one when the other changes.",
    needs: ["L1-N3.2", "L1-N4.2"],
    atoms: [
      a("Simplifying and sharing in a ratio", "simplify a ratio and share a quantity in a given ratio", { exams: ALL }),
      a("The unitary method", "solve a proportion problem by finding the value of one unit first", { exams: ALL }),
      a("Direct and inverse proportion", "tell direct from inverse proportion in a worded problem and solve either", { exams: ALL }),
      a("Speed, distance and time", "calculate speed, distance or time, converting units where the question requires it", { exams: ALL }),
    ],
  },
  {
    code: "L2-N4",
    level: "L2",
    strand: "N",
    title: "Binary operations in base two",
    summary: "Multiplication in base 2, and the first move between bases other than ten.",
    needs: ["L1-N1.4"],
    atoms: [
      a("Multiplying in base two", "multiply binary numbers", { exams: ALL }),
      a("Binary to other small bases", "convert between base 2 and other small bases", { exams: ALL }),
    ],
  },
  {
    code: "L2-A1",
    level: "L2",
    strand: "A",
    title: "Expanding and factorising",
    summary: "Brackets in both directions. Factorising is the single most reused algebra skill in the senior syllabus.",
    needs: ["L1-A1.4"],
    atoms: [
      a("Expanding single brackets", "expand a single bracket, including with a negative outside it", { exams: ALL }),
      a("Expanding double brackets", "expand two brackets and collect the result", { exams: ALL }),
      a("Factorising by common factor", "take out the highest common factor of an expression", { exams: ALL }),
      a("Simplifying simple algebraic fractions", "cancel common factors in a simple algebraic fraction", { exams: ALL }),
    ],
  },
  {
    code: "L2-A2",
    level: "L2",
    strand: "A",
    title: "Linear equations",
    summary: "Equations with brackets and fractions, and the first rearranging of a formula.",
    needs: ["L1-A2.3", "L2-A1.1"],
    atoms: [
      a("Equations with brackets", "solve a linear equation containing brackets", { exams: ALL }),
      a("Equations with fractions", "clear fractions from an equation by multiplying through by the LCM", { exams: ALL }),
      a("Changing the subject", "make a different letter the subject of a simple formula", { exams: ALL }),
    ],
  },
  {
    code: "L2-A3",
    level: "L2",
    strand: "A",
    title: "Graphs",
    summary: "The Cartesian plane, tables of values, and reading a real situation off a line.",
    because: "Drawing and reading graphs is reported as poorly attempted every single year. It is a drawing skill as much as an algebraic one.",
    needs: ["L1-N6.1", "L2-A2.1"],
    atoms: [
      a("Plotting points", "plot and read coordinates in all four quadrants", { exams: ALL }),
      a("Tables of values", "build a table of values for a linear equation", { exams: ALL }),
      a("Drawing straight-line graphs", "draw a straight-line graph from a table, with a sensible scale and labelled axes", { exams: ALL }),
      a("Reading real-life graphs", "read and interpret a distance-time or conversion graph, including its gradient", { exams: ALL }),
    ],
  },
  {
    code: "L2-G1",
    level: "L2",
    strand: "G",
    title: "Angles and parallel lines",
    summary: "The rules that let you chase an angle across a diagram, and the polygon formulas that follow from them.",
    needs: ["L1-G3.3"],
    atoms: [
      a("Angles on parallel lines", "use alternate, corresponding and co-interior angles, naming the rule each time", { exams: ALL }),
      a("Angles in a triangle", "use the angle sum of a triangle and the exterior angle theorem", { exams: ALL }),
      a("Angles in polygons", "find the interior and exterior angles of a regular polygon and the angle sum of any polygon", { exams: ALL }),
    ],
  },
  {
    code: "L2-G2",
    level: "L2",
    strand: "G",
    title: "Construction",
    summary: "Ruler and compasses only. Construction marks are part of the answer and are marked as such.",
    because: "Geometric construction is named in the 2012 report and is still lost marks: candidates measure instead of constructing, or rub out the arcs.",
    needs: ["L1-G3.2"],
    atoms: [
      a("Bisecting a line", "construct the perpendicular bisector of a line segment", { exams: WN }),
      a("Bisecting an angle", "bisect an angle with compasses, leaving the arcs visible", { exams: WN }),
      a("Constructing standard angles", "construct 90, 60, 45 and 30 degree angles", { exams: WN }),
      a("Constructing triangles", "construct a triangle from given sides and angles, and copy a given angle", { exams: WN }),
    ],
  },
  {
    code: "L2-G3",
    level: "L2",
    strand: "G",
    title: "Circles and compound shapes",
    summary: "The circle formulas, and areas and volumes built out of shapes already known.",
    needs: ["L1-G1.3", "L1-G2.3"],
    atoms: [
      a("Circumference and area of a circle", "find the circumference and area of a circle, and work backwards from either to the radius", { exams: ALL }),
      a("Area of compound shapes", "find the area of a shape made from rectangles, triangles and parts of circles", { exams: ALL }),
      a("Volume of prisms and cylinders", "find the volume of a prism and a cylinder using cross-section times length", { exams: ALL }),
    ],
  },
  {
    code: "L2-G4",
    level: "L2",
    strand: "G",
    title: "Scale drawing and bearings",
    summary: "Turning a description into an accurate diagram — the step where most bearings marks are actually won or lost.",
    because: "Bearings diagrams are a named weakness. Students who can do the trigonometry still lose the marks because the diagram was wrong.",
    needs: ["L2-G2.4", "L2-N3.2"],
    atoms: [
      a("Using a scale", "use a scale to convert between a drawing and real distances", { exams: ALL }),
      a("Compass and three-figure bearings", "state a bearing as a three-figure bearing and convert from compass directions", { exams: ALL }),
      a("Drawing a bearings diagram", "draw an accurate bearings diagram from a worded description, with north lines at every point", { exams: ALL }),
    ],
  },
  {
    code: "L2-S1",
    level: "L2",
    strand: "S",
    title: "Statistics 2",
    summary: "Grouping, the pie chart, and the mean of a frequency distribution.",
    needs: ["L1-S1.3"],
    atoms: [
      a("Grouping data into classes", "group raw data into classes and state the class boundaries", { exams: ALL }),
      a("Pie charts", "draw and read a pie chart, converting between frequency, percentage and angle", { exams: ALL }),
      a("Mean from a frequency table", "find the mean from a frequency table using the sum of fx over the sum of f", { exams: ALL }),
    ],
  },
  {
    code: "L2-S2",
    level: "L2",
    strand: "S",
    title: "Probability 1",
    summary: "Chance as a number between 0 and 1, from both experiment and theory.",
    needs: ["L1-N3.2", "L1-S1.1"],
    atoms: [
      a("Outcomes and the sample space", "list the outcomes of a simple experiment and count the sample space", { exams: ALL }),
      a("Experimental probability", "calculate relative frequency from an experiment and use it as an estimate", { exams: ALL }),
      a("Theoretical probability", "calculate the theoretical probability of a single event with coins, dice and a bag of balls", { exams: ALL }),
    ],
  },
];

export default L2_MODULES;
