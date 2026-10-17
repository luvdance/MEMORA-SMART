/**
 * MATHEMATICS · MONTH 8 · MODULE 30 · LOCI, TRIGONOMETRY TO 360° AND GROUPED DATA
 *
 * CLIENT-SAFE. Atom shape and house style: see ma-01-place-value.js.
 */

export const SECTION_ID = "ma-s30-loci-trigonometry-data";

export const LESSONS = [
  {
    id: "ma-l4-g3",
    moduleId: "ma-30-loci-trigonometry-data",
    sectionId: SECTION_ID,
    skillGroup: "L4-G3",
    order: 1,
    title: "Loci",
    subtitle: "The four standard loci and where they meet",
    estimatedMinutes: 25,
    intro: "A LOCUS is the set of all points that obey a rule. Four rules cover almost every examination question, and each one gives a shape you can construct.",

    atoms: [
      {
        id: "a-ma-l4-g3-1",
        title: "The four standard loci",
        explain: "Each rule has a standard shape.",
        table: {
          caption: "The four loci.",
          headers: ["Points that are ...", "Locus", "Construct with"],
          rows: [
            ["a fixed distance from a point P", "a circle, centre P", "compasses"],
            ["equidistant from two points A and B", "the perpendicular bisector of AB", "bisecting AB"],
            ["equidistant from two intersecting lines", "the bisectors of the angles between them", "bisecting the angle"],
            ["a fixed distance from a line", "two parallel lines, one on each side", "perpendiculars of that length"],
          ],
        },
        mistake: "Drawing only one parallel line for 'a fixed distance from a line'. There is one on each side.",
        drill: { skill: "L4-G3.1", count: 3 },
      },
      {
        id: "a-ma-l4-g3-2",
        title: "Intersecting loci",
        explain: "When a point must obey two rules at once, draw both loci. The points that satisfy both are where they cross. Count the crossing points: two, one (touching), or none.",
        example: "  A and B are 8 cm apart. Points 5 cm from A and equidistant from A and B.\n    The perpendicular bisector is 4 cm from A.\n    A circle of radius 5 cm about A crosses it twice: 2 points.",
        mistake: "Assuming two loci always meet twice. A circle smaller than the distance to the line does not reach it.",
        drill: { skill: "L4-G3.2", count: 3 },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  {
    id: "ma-l4-t1",
    moduleId: "ma-30-loci-trigonometry-data",
    sectionId: SECTION_ID,
    skillGroup: "L4-T1",
    order: 2,
    title: "Trigonometry from 0° to 360°",
    subtitle: "Related angles, exact values and the sine and cosine graphs",
    estimatedMinutes: 45,
    intro: "Sine, cosine and tangent are defined for every angle, not just acute ones. Each angle beyond 90° has a related acute angle, and a sign that depends on its quadrant.",

    atoms: [
      {
        id: "a-ma-l4-t1-1",
        title: "Ratios from 0° to 360°",
        explain:
          "Find the RELATED ACUTE ANGLE: 180° − θ in the 2nd quadrant, θ − 180° in the 3rd, 360° − θ in the 4th. Then fix the sign with CAST: in the 1st quadrant All are positive, in the 2nd only Sin, in the 3rd only Tan, in the 4th only Cos.",
        table: {
          caption: "CAST.",
          headers: ["Quadrant", "Angles", "Positive"],
          rows: [["1st", "0° to 90°", "All"], ["2nd", "90° to 180°", "Sin"], ["3rd", "180° to 270°", "Tan"], ["4th", "270° to 360°", "Cos"]],
        },
        example: "  sin 150° = +sin 30° = 0.5\n  cos 240° = −cos 60° = −0.5\n  tan 315° = −tan 45° = −1\n\n  sin θ = 0.5 for θ = 30° and 150°",
        mistake: "Forgetting the second solution of an equation. sin θ = 0.5 has two answers between 0° and 360°.",
        drill: { skill: "L4-T1.1", count: 4 },
      },
      {
        id: "a-ma-l4-t1-2",
        title: "Exact values",
        explain: "The ratios of 30°, 45° and 60° come from two triangles: half an equilateral triangle (sides 1, √3, 2) and an isosceles right triangle (sides 1, 1, √2). Know them without tables.",
        table: {
          caption: "Exact values.",
          headers: ["θ", "sin θ", "cos θ", "tan θ"],
          rows: [
            ["30°", "1/2", "√3/2", "√3/3"],
            ["45°", "√2/2", "√2/2", "1"],
            ["60°", "√3/2", "1/2", "√3"],
            ["0°", "0", "1", "0"],
            ["90°", "1", "0", "undefined"],
          ],
        },
        example: "  sin 60° cos 30° − cos 60° sin 30° = (√3/2)(√3/2) − (1/2)(1/2) = 3/4 − 1/4 = 1/2",
        mistake: "Swapping sin and cos of 30° and 60°. sin 30° = cos 60° = 1/2.",
        drill: { skill: "L4-T1.2", count: 4 },
      },
      {
        id: "a-ma-l4-t1-3",
        title: "Graphs of sine and cosine",
        explain:
          "y = sin x and y = cos x are waves that repeat every 360°, always between −1 and 1. y = a sin x stretches the wave so it runs from −a to a. Adding c moves the whole wave up by c.",
        example: "  y = 3 sin x + 1: maximum 3 + 1 = 4 (at 90°), minimum −3 + 1 = −2 (at 270°)\n  y = cos x: 1 at 0°, 0 at 90°, −1 at 180°, 0 at 270°, 1 at 360°",
        mistake: "Forgetting the vertical shift. y = 3 sin x + 1 has maximum 4, not 3.",
        drill: { skill: "L4-T1.3", count: 3 },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  {
    id: "ma-l4-s1",
    moduleId: "ma-30-loci-trigonometry-data",
    sectionId: SECTION_ID,
    skillGroup: "L4-S1",
    order: 3,
    title: "Grouped Data",
    subtitle: "Histograms, frequency polygons, averages and the assumed mean",
    estimatedMinutes: 40,
    intro: "When data are grouped into classes, the exact values are lost. Use each class midpoint as its representative value and estimate the averages from there.",

    atoms: [
      {
        id: "a-ma-l4-s1-1",
        title: "Histograms and frequency polygons",
        explain: "A HISTOGRAM is a bar chart for grouped continuous data: the bars touch, drawn between class boundaries. With equal class widths, bar height = frequency. A FREQUENCY POLYGON joins points plotted at the class midpoints.",
        example: "  Class 20–29, frequency 8:\n    histogram bar from 19.5 to 29.5, height 8\n    polygon point at (24.5, 8)",
        mistake: "Leaving gaps between histogram bars. The data are continuous, so the bars touch.",
        drill: { skill: "L4-S1.1", count: 3 },
      },
      {
        id: "a-ma-l4-s1-2",
        title: "Averages of grouped data",
        explain: "MEAN: multiply each class midpoint x by its frequency f, then mean = Σfx ÷ Σf. MODAL CLASS: the class with the highest frequency. MEDIAN CLASS: the class containing the (Σf ÷ 2)th value, found from running totals.",
        example: "  Class  10–19  20–29  30–39\n  f        4      10      6      Σf = 20\n  x       14.5   24.5   34.5\n  Σfx = 58 + 245 + 207 = 510\n  Mean = 510 ÷ 20 = 25.5;  modal class 20–29",
        mistake: "Using the lower class limits as x. Use the midpoints.",
        drill: { skill: "L4-S1.2", count: 4 },
      },
      {
        id: "a-ma-l4-s1-3",
        title: "The assumed mean",
        explain: "To save arithmetic, choose an ASSUMED MEAN A near the middle. Find d = x − A for each class. Then mean = A + Σfd ÷ Σf.",
        example: "  Using the table above with A = 24.5:\n    d = −10, 0, 10\n    Σfd = −40 + 0 + 60 = 20\n    Mean = 24.5 + 20/20 = 25.5   (the same answer)",
        mistake: "Forgetting to add A back on at the end.",
        drill: { skill: "L4-S1.3", count: 3 },
      },
      {
        id: "a-ma-review-30",
        title: "Mixed review",
        explain: "One question on each earlier skill.",
        drill: { review: ["L4-G1.1", "L4-G1.4", "L4-G2.4", "L3-T1.3", "L4-N4.2"], count: 5 },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
