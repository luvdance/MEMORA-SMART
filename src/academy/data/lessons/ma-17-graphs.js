/**
 * MATHEMATICS · MONTH 5 · MODULE 17 · COORDINATES AND STRAIGHT-LINE GRAPHS
 *
 * CLIENT-SAFE. Atom shape and house style: see ma-01-place-value.js.
 */

export const SECTION_ID = "ma-s17-graphs";

export const LESSONS = [
  {
    id: "ma-l2-a3",
    moduleId: "ma-17-graphs",
    sectionId: SECTION_ID,
    skillGroup: "L2-A3",
    order: 1,
    title: "Coordinates and Straight-Line Graphs",
    subtitle: "Plotting points, tables of values, lines, and real-life graphs",
    estimatedMinutes: 45,
    intro: "A graph turns an equation into a picture. Every point on the line is a pair of numbers that makes the equation true.",

    atoms: [
      {
        id: "a-ma-l2-a3-1",
        title: "Plotting points",
        explain:
          "The CARTESIAN PLANE has a horizontal x-axis and a vertical y-axis crossing at the ORIGIN, (0, 0). A point is written (x, y): x first, how far across; then y, how far up. Left and down are negative. The axes split the plane into four QUADRANTS, numbered anticlockwise from the top right.",
        table: {
          caption: "The four quadrants.",
          headers: ["Quadrant", "Signs", "Example"],
          rows: [
            ["First", "(+, +)", "(3, 4)"],
            ["Second", "(−, +)", "(−3, 4)"],
            ["Third", "(−, −)", "(−3, −4)"],
            ["Fourth", "(+, −)", "(3, −4)"],
          ],
        },
        mistake: "Writing the coordinates the wrong way round. (2, 5) is 2 across and 5 up, not 5 across and 2 up.",
        drill: { skill: "L2-A3.1", count: 4 },
      },
      {
        id: "a-ma-l2-a3-2",
        title: "Tables of values",
        explain: "To draw the graph of an equation, choose some x values, work out y for each, and write them in a table. Each column is a point to plot.",
        example:
          "  y = 2x − 3\n\n    x  │ −2   −1    0    1    2\n    y  │ −7   −5   −3   −1    1\n\n  x = −2:  y = 2(−2) − 3 = −4 − 3 = −7",
        mistake: "Losing a sign with negative x: 2 × (−2) − 3 is −7, not 1.",
        drill: { skill: "L2-A3.2", count: 4 },
      },
      {
        id: "a-ma-l2-a3-3",
        title: "Drawing straight-line graphs",
        explain:
          "An equation of the form y = mx + c always gives a straight line. Plot at least three points from a table and join them with a ruler. The line crosses the y-axis where x = 0, at (0, c). It crosses the x-axis where y = 0. Two lines meet at the point that satisfies both equations.",
        example:
          "  y = 3x − 6\n    crosses the y-axis: x = 0 → (0, −6)\n    crosses the x-axis: 0 = 3x − 6 → x = 2 → (2, 0)\n\n  Does (4, 6) lie on it?  3 × 4 − 6 = 6  ✓ yes",
        mistake: "Joining the points freehand, or plotting only two points. Three points catch a mistake: they must lie in a straight line.",
        drill: { skill: "L2-A3.3", count: 4 },
      },
      {
        id: "a-ma-l2-a3-4",
        title: "Reading real-life graphs",
        explain:
          "On a DISTANCE–TIME graph, a steeper line means a faster speed, and a flat part means the object has stopped. Speed = distance ÷ time for each part. A straight-line CONVERSION graph through the origin shows direct proportion.",
        example:
          "  0 h to 2 h: 0 km to 120 km  → speed 120 ÷ 2 = 60 km/h\n  2 h to 3 h: flat              → stopped for 1 h\n  3 h to 4 h: 120 km to 180 km  → speed 60 km/h\n\n  Average speed for the whole trip = 180 ÷ 4 = 45 km/h",
        mistake: "Leaving out the stop when finding average speed. Average speed = total distance ÷ TOTAL time, stops included.",
        drill: { skill: "L2-A3.4", count: 4 },
      },
      {
        id: "a-ma-review-17",
        title: "Mixed review",
        explain: "One question on each earlier skill.",
        drill: { review: ["L2-A1.2", "L2-A1.3", "L2-A2.1", "L2-A2.3", "L2-N2.4"], count: 5 },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
