/**
 * MATHEMATICS · MONTH 10 · MODULE 37 · VECTORS, TRANSFORMATIONS AND THE EARTH AS A SPHERE
 *
 * CLIENT-SAFE. Atom shape and house style: see ma-01-place-value.js.
 */

export const SECTION_ID = "ma-s37-vectors-transformations";

export const LESSONS = [
  {
    id: "ma-l6-g1",
    moduleId: "ma-37-vectors-transformations",
    sectionId: SECTION_ID,
    skillGroup: "L6-G1",
    order: 1,
    title: "Vectors",
    subtitle: "Size and direction together",
    estimatedMinutes: 40,
    intro: "A SCALAR has size only (5 kg). A VECTOR has size AND direction (5 km north-east). On a grid a vector is written as a column: (3 ; 4) means 3 across and 4 up.",

    atoms: [
      {
        id: "a-ma-l6-g1-1",
        title: "Writing vectors",
        explain: "A vector from A to B is written AB (with an arrow over it), or as a bold letter a. Its COMPONENTS are the steps across and up: AB = B − A. BA is the same length in the opposite direction: BA = −AB.",
        example: "  A(1, 2), B(4, −3)\n    AB = (4 − 1 ; −3 − 2) = (3 ; −5)\n    BA = (−3 ; 5)",
        mistake: "Doing A − B for AB. The vector goes FROM A TO B: end minus start.",
        drill: { skill: "L6-G1.1", count: 3 },
      },
      {
        id: "a-ma-l6-g1-2",
        title: "Magnitude and direction",
        explain: "The MAGNITUDE (length) of (x ; y) is |v| = √(x² + y²). The DIRECTION is an angle: tan θ = y/x from the x-axis, or as a bearing measured clockwise from north, with x as east and y as north.",
        example: "  v = (−5 ; 12)\n    |v| = √(25 + 144) = 13\n\n  (3 ; 3) km: 45° from north → bearing 045°",
        mistake: "Adding the components: |(3 ; 4)| is 5, not 7.",
        drill: { skill: "L6-G1.2", count: 3 },
      },
      {
        id: "a-ma-l6-g1-3",
        title: "Adding, subtracting and scaling",
        explain: "Add or subtract matching components. A SCALAR multiple ka multiplies each component by k: same direction if k > 0, opposite if k < 0. Geometrically, a + b is 'go along a, then along b'.",
        example: "  a = (2 ; −1), b = (−3 ; 4)\n    a + b = (−1 ; 3)\n    2a − 3b = (4 ; −2) − (−9 ; 12) = (13 ; −14)",
        mistake: "Losing a sign: −3b multiplies BOTH components of b by −3.",
        drill: { skill: "L6-G1.3", count: 3 },
      },
      {
        id: "a-ma-l6-g1-4",
        title: "Position vectors",
        explain: "The POSITION VECTOR of a point P is OP, from the origin. Then AB = b − a. The midpoint M of AB has OM = ½(a + b). A point dividing AB in the ratio m : n has OP = a + m/(m + n) × (b − a).",
        example: "  a = (2 ; 1), b = (8 ; 7)\n    midpoint: ½(10 ; 8) = (5 ; 4)\n    AP : PB = 1 : 2  →  OP = (2 ; 1) + ⅓(6 ; 6) = (4 ; 3)",
        mistake: "Giving AP when the question asks for OP. Position vectors start at O.",
        drill: { skill: "L6-G1.4", count: 3 },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  {
    id: "ma-l6-g2",
    moduleId: "ma-37-vectors-transformations",
    sectionId: SECTION_ID,
    skillGroup: "L6-G2",
    order: 2,
    title: "Transformations",
    subtitle: "Reflect, rotate, translate, enlarge, and describe",
    estimatedMinutes: 45,
    intro: "A transformation moves every point of a shape by one rule. The OBJECT is the starting shape; the IMAGE is where it ends up, labelled with a dash: P → P'.",

    atoms: [
      {
        id: "a-ma-l6-g2-1",
        title: "Reflection",
        explain: "A reflection flips a shape in a MIRROR LINE. Each image point is the same distance from the line as its object, on the other side. The shape keeps its size.",
        table: [
          ["Mirror line", "(x, y) →"],
          ["x-axis", "(x, −y)"],
          ["y-axis", "(−x, y)"],
          ["y = x", "(y, x)"],
          ["y = −x", "(−y, −x)"],
          ["x = k", "(2k − x, y)"],
          ["y = k", "(x, 2k − y)"],
        ],
        example: "  P(3, −2) in the line x = 1: 2 to the right of the line → 2 to the left: (−1, −2)",
        mistake: "Changing the wrong sign: reflecting in the x-axis changes the y-coordinate.",
        drill: { skill: "L6-G2.1", count: 3 },
      },
      {
        id: "a-ma-l6-g2-2",
        title: "Rotation",
        explain: "A rotation turns a shape about a CENTRE through an ANGLE, clockwise or anticlockwise. About a centre other than O: subtract the centre, rotate about O, add the centre back.",
        table: [
          ["About O", "(x, y) →"],
          ["90° anticlockwise", "(−y, x)"],
          ["90° clockwise", "(y, −x)"],
          ["180°", "(−x, −y)"],
        ],
        example: "  (4, 1) by 90° anticlockwise about (2, 0)\n    relative: (2, 1) → (−1, 2)\n    add back: (1, 2)",
        mistake: "Mixing up the two quarter turns. Test with (1, 0): anticlockwise 90° takes it to (0, 1).",
        drill: { skill: "L6-G2.2", count: 3 },
      },
      {
        id: "a-ma-l6-g2-3",
        title: "Translation and enlargement",
        explain: "A TRANSLATION slides a shape by a vector: add it. An ENLARGEMENT with centre C and scale factor k sends P to C + k(P − C). k > 1 enlarges, 0 < k < 1 shrinks, and a NEGATIVE k puts the image on the other side of the centre, upside down. Areas are multiplied by k².",
        example: "  (3, 2) translated by (−4 ; 1): (−1, 3)\n  (3, 2) enlarged by −2 from (1, 1): (1, 1) + (−2)(2, 1) = (−3, −1)",
        mistake: "Enlarging from the origin when the centre is somewhere else.",
        drill: { skill: "L6-G2.3", count: 3 },
      },
      {
        id: "a-ma-l6-g2-4",
        title: "Describing a transformation fully",
        explain: "Each transformation needs specific details for full marks.",
        table: [
          ["Transformation", "You must state"],
          ["Reflection", "the mirror line (its equation)"],
          ["Rotation", "centre, angle, direction"],
          ["Translation", "the vector"],
          ["Enlargement", "centre and scale factor"],
        ],
        example: "  (2, 5) → (5, 2), (1, 3) → (3, 1): the coordinates swap\n    Reflection in the line y = x",
        mistake: "Writing 'it turned'. Without the centre, angle and direction, it earns no marks.",
        drill: { skill: "L6-G2.4", count: 3 },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  {
    id: "ma-l6-g3",
    moduleId: "ma-37-vectors-transformations",
    sectionId: SECTION_ID,
    skillGroup: "L6-G3",
    order: 3,
    title: "The Earth as a Sphere",
    subtitle: "Latitude, longitude, distance and time",
    estimatedMinutes: 45,
    intro: "Treat the Earth as a sphere of radius R = 6400 km. Every place is fixed by two angles: its LATITUDE (north or south of the equator) and its LONGITUDE (east or west of the Greenwich meridian).",

    atoms: [
      {
        id: "a-ma-l6-g3-1",
        title: "Latitude and longitude",
        explain: "Circles of LATITUDE (parallels) run east–west; the equator is 0°. Only the equator is a GREAT CIRCLE (centre at the Earth's centre); other parallels are SMALL circles. MERIDIANS (lines of longitude) run north–south through both poles and are all great circles. Same side: subtract the angles. Opposite sides: add.",
        example: "  Latitudes 20°N and 35°S: 20 + 35 = 55° apart\n  Longitudes 15°E and 40°E: 40 − 15 = 25° apart",
        mistake: "Subtracting when the places are on opposite sides of the equator or of Greenwich.",
        drill: { skill: "L6-G3.1", count: 3 },
      },
      {
        id: "a-ma-l6-g3-2",
        title: "Distances on the Earth",
        explain: "Along a MERIDIAN (great circle): distance = θ/360 × 2πR, with θ the difference in latitude. Along a PARALLEL at latitude α: the radius is r = R cos α, so distance = θ/360 × 2πR cos α, with θ the difference in longitude.",
        example: "  Along a meridian, 30°: 30/360 × 2 × 22/7 × 6400 = 3352 km\n  Along 60°N, 30° of longitude: 3352 × cos 60° = 1676 km",
        mistake: "Forgetting cos α on a parallel. Parallels get smaller towards the poles.",
        drill: { skill: "L6-G3.2", count: 3 },
      },
      {
        id: "a-ma-l6-g3-3",
        title: "Longitude and time",
        explain: "The Earth turns 360° in 24 hours: 15° per hour, which is 1° every 4 minutes. Places to the EAST see the sun first, so their clocks are AHEAD.",
        example: "  Lagos 3°E at 12:00. Time at 42°W?\n    45° difference → 180 min = 3 h behind → 09:00",
        mistake: "Adding when going west. West is BEHIND.",
        drill: { skill: "L6-G3.3", count: 3 },
      },
      {
        id: "a-ma-review-37",
        title: "Mixed review",
        explain: "One question on each earlier skill.",
        drill: { review: ["L6-C1.3", "L6-C1.4", "L5-S2.3", "L5-S3.4", "L5-G2.4"], count: 5 },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
