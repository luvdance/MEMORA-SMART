/**
 * MATHEMATICS · MONTH 3 · MODULE 12 · SEQUENCES, ANGLES AND PLANE SHAPES
 *
 * CLIENT-SAFE. Atom shape and house style: see ma-01-place-value.js.
 */

export const SECTION_ID = "ma-s12-sequences-angles-shapes";

export const LESSONS = [
  {
    id: "ma-l1-a3",
    moduleId: "ma-12-sequences-angles-shapes",
    sectionId: SECTION_ID,
    skillGroup: "L1-A3",
    order: 1,
    title: "Patterns and Sequences",
    subtitle: "Continuing, term-to-term rules, the nth term, special sequences",
    estimatedMinutes: 35,
    intro: "A sequence is a list that follows a rule. Find the rule and you can find any term, even the hundredth, without writing out the ones before it.",

    atoms: [
      {
        id: "a-ma-l1-a3-1",
        title: "Continuing a sequence",
        explain:
          "A SEQUENCE is an ordered list of numbers called TERMS. Look at how each term is made from the one before: the same number added each time (a common difference), or the same number multiplied each time (a common ratio).",
        example:
          "  5, 9, 13, 17, ...      + 4 each time   → 21, 25\n  3, 6, 12, 24, ...      × 2 each time   → 48, 96\n  40, 33, 26, 19, ...    − 7 each time   → 12, 5\n  2, 5, 11, 23, ...      × 2 then + 1    → 47, 95",
        mistake: "Assuming every sequence adds. 3, 6, 12, 24 has differences 3, 6, 12, which are not equal: it multiplies by 2.",
        drill: { skill: "L1-A3.1", count: 4 },
      },
      {
        id: "a-ma-l1-a3-2",
        title: "Term-to-term rules",
        explain: "A term-to-term rule says how to get the next term from the one before. Apply it again and again to reach any term you need.",
        example: "  Start at 7, subtract 3 each time:\n    7, 4, 1, −2, −5, −8\n    The 6th term is −8.",
        mistake: "Miscounting terms: the first term is the starting number, so the 6th term needs the rule applied only 5 times.",
        drill: { skill: "L1-A3.2", count: 4 },
      },
      {
        id: "a-ma-l1-a3-3",
        title: "The nth term of a linear sequence",
        explain:
          "If the common difference is d, the nth term is dn + c. Find c by making the first term fit: c = first term − d. Then put in any value of n to find that term.",
        table: {
          caption: "5, 9, 13, 17, ...  (difference 4)",
          headers: ["n", "1", "2", "3", "4", "n"],
          rows: [["4n", "4", "8", "12", "16", "4n"], ["term", "5", "9", "13", "17", "4n + 1"]],
          note: "Each term is 1 more than 4n, so the nth term is 4n + 1. The 50th term is 4 × 50 + 1 = 201.",
        },
        mistake: "Writing n + 4 because the sequence 'goes up in 4s'. Going up by 4 each step means 4 × n: the nth term is 4n + 1.",
        drill: { skill: "L1-A3.3", count: 4 },
      },
      {
        id: "a-ma-l1-a3-4",
        title: "Special sequences",
        explain: "Some sequences are worth knowing by sight, because they appear everywhere.",
        table: {
          caption: "Sequences to recognise.",
          headers: ["Name", "Terms", "nth term"],
          rows: [
            ["Square numbers", "1, 4, 9, 16, 25, ...", "n²"],
            ["Cube numbers", "1, 8, 27, 64, 125, ...", "n³"],
            ["Triangular numbers", "1, 3, 6, 10, 15, ...", "n(n + 1)/2"],
            ["Powers of 2", "1, 2, 4, 8, 16, ...", "2ⁿ⁻¹"],
          ],
          note: "Triangular numbers are the dots in triangles of rows 1, 2, 3, ...: each term adds the next whole number.",
        },
        mistake: "Treating 1, 4, 9, 16 as 'add 3, add 5, add 7' and guessing. Recognise the squares: the next is 5² = 25.",
        drill: { skill: "L1-A3.4", count: 3 },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  {
    id: "ma-l1-g3",
    moduleId: "ma-12-sequences-angles-shapes",
    sectionId: SECTION_ID,
    skillGroup: "L1-G3",
    order: 2,
    title: "Angles",
    subtitle: "Types of angle, measuring, and the three basic angle facts",
    estimatedMinutes: 30,
    intro: "An angle measures turn, in degrees. A full turn is 360°. Three facts about angles carry most of the geometry in this course.",

    atoms: [
      {
        id: "a-ma-l1-g3-1",
        title: "Classifying angles",
        explain: "An angle is named by its size compared with a right angle (90°) and a straight line (180°).",
        table: {
          caption: "The five types.",
          headers: ["Type", "Size"],
          rows: [
            ["Acute", "less than 90°"],
            ["Right", "exactly 90°"],
            ["Obtuse", "between 90° and 180°"],
            ["Straight", "exactly 180°"],
            ["Reflex", "between 180° and 360°"],
          ],
        },
        mistake: "Calling a reflex angle obtuse. Anything bigger than 180° is reflex.",
        drill: { skill: "L1-G3.1", count: 4 },
      },
      {
        id: "a-ma-l1-g3-2",
        title: "Measuring and drawing angles",
        explain:
          "Put the centre of the protractor on the corner of the angle and the zero line along one arm. A protractor has two scales running opposite ways. Read the scale that starts at 0 on that arm. Then check: an acute angle must read less than 90°.",
        example:
          "  One arm on the zero of the INNER scale.\n  The other arm passes 65 (inner) and 115 (outer).\n  Read the inner scale: 65°.  It looks acute ✓\n\n  CLOCK: the 12 hour marks are 360 ÷ 12 = 30° apart.\n  At 4 o'clock the hands make 4 × 30 = 120°.",
        mistake: "Reading the wrong scale and getting 115° for an acute angle. Always estimate first: acute or obtuse?",
        drill: { skill: "L1-G3.2", count: 3 },
      },
      {
        id: "a-ma-l1-g3-3",
        title: "Angles on a line and at a point",
        explain: "Three facts. Angles on a straight line add up to 180°. Angles round a point add up to 360°. When two straight lines cross, VERTICALLY OPPOSITE angles are equal.",
        example:
          "  On a line: 65° + 48° + x = 180°  →  x = 67°\n  At a point: 110° + 95° + 80° + x = 360°  →  x = 75°\n  Crossing lines: one angle 3x + 10, opposite angle 70°\n    3x + 10 = 70  →  x = 20",
        mistake: "Mixing up the totals: 180° is for a straight line, 360° for a full turn round a point.",
        drill: { skill: "L1-G3.3", count: 5 },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  {
    id: "ma-l1-g1",
    moduleId: "ma-12-sequences-angles-shapes",
    sectionId: SECTION_ID,
    skillGroup: "L1-G1",
    order: 3,
    title: "Plane Shapes",
    subtitle: "Naming shapes, perimeter, area and symmetry",
    estimatedMinutes: 45,
    intro: "A plane shape is flat. Name it by its properties, then find its perimeter, its area and its symmetry.",

    atoms: [
      {
        id: "a-ma-l1-g1-1",
        title: "Triangles, quadrilaterals and polygons",
        explain:
          "A POLYGON is a closed shape with straight sides. A REGULAR polygon has all sides equal and all angles equal. Name triangles and quadrilaterals by their properties, not by how they look.",
        table: {
          caption: "The shapes to know.",
          headers: ["Shape", "Properties"],
          rows: [
            ["Equilateral triangle", "3 equal sides, 3 angles of 60°"],
            ["Isosceles triangle", "2 equal sides, 2 equal angles"],
            ["Scalene triangle", "no equal sides"],
            ["Square", "4 equal sides, 4 right angles"],
            ["Rectangle", "opposite sides equal, 4 right angles"],
            ["Rhombus", "4 equal sides, opposite angles equal"],
            ["Parallelogram", "2 pairs of parallel sides, opposite sides equal"],
            ["Trapezium", "exactly 1 pair of parallel sides"],
            ["Kite", "2 pairs of equal adjacent sides"],
            ["Pentagon, hexagon, heptagon, octagon, nonagon, decagon", "5, 6, 7, 8, 9, 10 sides"],
          ],
        },
        mistake: "Saying a square is not a rectangle. A square has every property of a rectangle, plus equal sides.",
        drill: { skill: "L1-G1.1", count: 4 },
      },
      {
        id: "a-ma-l1-g1-2",
        title: "Perimeter of plane shapes",
        explain: "Add all the sides. Use the shape's properties to fill in sides that are not labelled. A regular polygon with n sides of length s has perimeter n × s.",
        example: "  Regular hexagon, side 7 cm:  6 × 7 = 42 cm\n  Parallelogram 9 cm and 5 cm:  2 × (9 + 5) = 28 cm\n  Isosceles triangle 8, 8, 5:   8 + 8 + 5 = 21 cm",
        mistake: "Adding only the labelled sides. A parallelogram labelled 9 cm and 5 cm has four sides: 9, 5, 9, 5.",
        drill: { skill: "L1-G1.2", count: 4 },
      },
      {
        id: "a-ma-l1-g1-3",
        title: "Area formulas",
        explain:
          "The height in every area formula is the PERPENDICULAR height: measured at right angles (a square corner) to the base, not along a slanting side.",
        table: {
          caption: "The four area formulas.",
          headers: ["Shape", "Area", "Why"],
          rows: [
            ["Rectangle", "length × width", "rows of unit squares"],
            ["Parallelogram", "base × perpendicular height", "cut a triangle off one end, move it: a rectangle"],
            ["Triangle", "½ × base × perpendicular height", "half of a parallelogram"],
            ["Trapezium", "½ × (a + b) × h", "a and b are the parallel sides"],
          ],
        },
        example: "  Triangle: base 12 cm, perpendicular height 7 cm, slant side 9 cm\n    A = ½ × 12 × 7 = 42 cm²    (the 9 cm is not used)\n\n  Trapezium: parallel sides 6 cm and 10 cm, height 4 cm\n    A = ½ × (6 + 10) × 4 = 32 cm²",
        visual: { kind: "rectangle", width: 12, height: 7, label: "area" },
        mistake: "Using the slanting side as the height. Only the perpendicular height gives the area.",
        drill: { skill: "L1-G1.3", count: 5 },
      },
      {
        id: "a-ma-l1-g1-4",
        title: "Symmetry",
        explain:
          "A LINE OF SYMMETRY folds a shape exactly onto itself. ROTATIONAL SYMMETRY of order n means the shape looks the same n times in one full turn. A regular polygon with n sides has n lines of symmetry and rotational symmetry of order n.",
        table: {
          caption: "Lines of symmetry and order of rotational symmetry.",
          headers: ["Shape", "Lines", "Order"],
          rows: [
            ["Square", "4", "4"],
            ["Rectangle", "2", "2"],
            ["Rhombus", "2", "2"],
            ["Parallelogram", "0", "2"],
            ["Kite", "1", "1"],
            ["Isosceles trapezium", "1", "1"],
            ["Equilateral triangle", "3", "3"],
            ["Isosceles triangle", "1", "1"],
            ["Regular hexagon", "6", "6"],
          ],
        },
        mistake: "Giving a parallelogram 2 lines of symmetry along its diagonals. Fold it and the corners do not meet: it has none.",
        drill: { skill: "L1-G1.4", count: 4 },
      },
      {
        id: "a-ma-review-12",
        title: "Mixed review",
        explain: "One question on each earlier skill.",
        drill: { review: ["L1-A1.2", "L1-A1.3", "L1-A2.2", "L1-A2.3", "L2-N3.2"], count: 5 },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
