/**
 * MATHEMATICS · MONTH 4 · MODULE 13 · SOLID SHAPES AND DATA HANDLING
 *
 * CLIENT-SAFE. Atom shape and house style: see ma-01-place-value.js.
 */

export const SECTION_ID = "ma-s13-solids-data";

export const LESSONS = [
  {
    id: "ma-l1-g2",
    moduleId: "ma-13-solids-data",
    sectionId: SECTION_ID,
    skillGroup: "L1-G2",
    order: 1,
    title: "Solid Shapes",
    subtitle: "Faces, edges, vertices, nets and the volume of a cuboid",
    estimatedMinutes: 35,
    intro: "A solid has three dimensions: length, width and height. Count its parts, unfold it into a net, and measure the space inside it.",

    atoms: [
      {
        id: "a-ma-l1-g2-1",
        title: "Faces, edges and vertices",
        explain:
          "A FACE is a flat surface, an EDGE is a line where two faces meet, and a VERTEX is a corner. For any solid with flat faces, Euler's formula holds: F + V − E = 2.",
        table: {
          caption: "Common solids.",
          headers: ["Solid", "Faces", "Edges", "Vertices"],
          rows: [
            ["Cube / cuboid", "6", "12", "8"],
            ["Triangular prism", "5", "9", "6"],
            ["Square-based pyramid", "5", "8", "5"],
            ["Tetrahedron (triangular pyramid)", "4", "6", "4"],
            ["Hexagonal prism", "8", "18", "12"],
          ],
          note: "A cylinder has 2 flat faces and 1 curved surface, 2 edges and no vertices. A cone has 1 flat face, 1 curved surface, 1 edge and 1 vertex.",
        },
        example: "  Check the cube with Euler:  F + V − E = 6 + 8 − 12 = 2  ✓\n\n  A solid has 7 faces and 10 vertices. How many edges?\n    E = F + V − 2 = 7 + 10 − 2 = 15",
        mistake: "Counting edges as corners. A cube has 8 corners (vertices) but 12 edges.",
        drill: { skill: "L1-G2.1", count: 4 },
      },
      {
        id: "a-ma-l1-g2-2",
        title: "Nets",
        explain:
          "A NET is a solid unfolded flat: one piece for each face. A cube's net is six squares. A cuboid's net is six rectangles in three matching pairs. The area of a net is the total area of the outside of the solid.",
        table: {
          caption: "Nets of common solids.",
          headers: ["Net", "Folds into"],
          rows: [
            ["6 squares", "cube"],
            ["6 rectangles, 3 matching pairs", "cuboid"],
            ["2 triangles + 3 rectangles", "triangular prism"],
            ["1 square + 4 triangles", "square-based pyramid"],
            ["2 circles + 1 rectangle", "cylinder"],
          ],
        },
        example: "  Cuboid 5 cm by 3 cm by 2 cm: three pairs of rectangles\n    5 × 3 = 15,  5 × 2 = 10,  3 × 2 = 6\n    Net area = 2 × (15 + 10 + 6) = 62 cm²",
        mistake: "Counting each pair of faces once. A cuboid has six faces: every face has a matching one opposite.",
        drill: { skill: "L1-G2.2", count: 3 },
      },
      {
        id: "a-ma-l1-g2-3",
        title: "Volume of a cuboid",
        explain: "VOLUME is the space inside a solid, measured in cubic units: cm³, m³. Volume of a cuboid = length × width × height. A cube of side s has volume s³.",
        example: "  Box 8 cm by 5 cm by 3 cm:  V = 8 × 5 × 3 = 120 cm³\n  Cube of side 4 m:          V = 4³ = 64 m³\n\n  1 litre = 1 000 cm³, so the box holds 0.12 litres.",
        mistake: "Adding the three lengths, or writing cm² for a volume. Volume multiplies three lengths, so the unit is cubed.",
        drill: { skill: "L1-G2.3", count: 4 },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  {
    id: "ma-l1-s1",
    moduleId: "ma-13-solids-data",
    sectionId: SECTION_ID,
    skillGroup: "L1-S1",
    order: 2,
    title: "Data Handling",
    subtitle: "Frequency tables, charts, and the three averages",
    estimatedMinutes: 35,
    intro: "Raw data is a list. A frequency table organises it, a chart shows it, and an average summarises it in one number.",

    atoms: [
      {
        id: "a-ma-l1-s1-1",
        title: "Frequency tables",
        explain: "The FREQUENCY of a value is how many times it occurs. Go through the data once, making a tally mark for each value, then count the tallies. The total frequency is the number of pieces of data.",
        example:
          "  Shoe sizes: 6, 7, 5, 7, 8, 6, 7, 9, 6, 7\n\n  Size   Tally    Frequency\n   5     |            1\n   6     |||          3\n   7     ||||         4\n   8     |            1\n   9     |            1\n                Total 10",
        mistake: "Adding up the values to get the total frequency. The total frequency counts the pieces of data, here 10 students.",
        drill: { skill: "L1-S1.1", count: 3 },
      },
      {
        id: "a-ma-l1-s1-2",
        title: "Pictograms and bar charts",
        explain:
          "Choose a scale or key that fits the data, label both axes, leave gaps between the bars, and make every bar the same width. To find a bar's height, divide the value by the scale.",
        example:
          "  Scale 1 cm : 4 pupils\n    22 pupils → 22 ÷ 4 = 5.5 cm\n\n  Pictogram key ★ = 8 pupils\n    28 pupils → 28 ÷ 8 = 3.5 → ★★★ and half a ★",
        visual: { kind: "barChart", axisStep: 4, data: [{ label: "Mon", value: 22 }, { label: "Tue", value: 16 }, { label: "Wed", value: 28 }] },
        mistake: "Starting the axis at a number other than 0. It exaggerates the differences between bars.",
        drill: { skill: "L1-S1.2", count: 3 },
      },
      {
        id: "a-ma-l1-s1-3",
        title: "Mean, median, mode and range",
        explain: "Three averages, each a different idea of 'typical', and one measure of spread.",
        table: {
          caption: "Averages and range.",
          headers: ["Measure", "How to find it"],
          rows: [
            ["Mean", "add all the values, divide by how many there are"],
            ["Median", "put them in order; the middle value (or halfway between the middle two)"],
            ["Mode", "the value that occurs most often"],
            ["Range", "largest − smallest"],
          ],
        },
        example:
          "  Data: 7, 3, 9, 3, 8\n    Mean:   (7 + 3 + 9 + 3 + 8) ÷ 5 = 30 ÷ 5 = 6\n    Median: 3, 3, 7, 8, 9 → 7\n    Mode:   3\n    Range:  9 − 3 = 6\n\n  Data: 4, 10, 6, 8 → order 4, 6, 8, 10 → median (6 + 8) ÷ 2 = 7",
        mistake: "Finding the median without putting the data in order first.",
        drill: { skill: "L1-S1.3", count: 5 },
      },
      {
        id: "a-ma-review-13",
        title: "Mixed review",
        explain: "One question on each earlier skill.",
        drill: { review: ["L1-A3.3", "L1-G3.3", "L1-G1.3", "L1-A2.2", "L1-N4.2"], count: 5 },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
