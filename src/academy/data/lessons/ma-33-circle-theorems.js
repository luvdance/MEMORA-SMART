/**
 * MATHEMATICS · MONTH 9 · MODULE 33 · CIRCLE THEOREMS
 *
 * CLIENT-SAFE. Atom shape and house style: see ma-01-place-value.js.
 */

export const SECTION_ID = "ma-s33-circle-theorems";

export const LESSONS = [
  {
    id: "ma-l5-g1",
    moduleId: "ma-33-circle-theorems",
    sectionId: SECTION_ID,
    skillGroup: "L5-G1",
    order: 1,
    title: "Circle Theorems",
    subtitle: "Eight facts that unlock every circle question",
    estimatedMinutes: 60,
    intro: "Every circle question in WAEC and JAMB is solved with the same short list of theorems. Learn each one with its picture and its reason, because Paper 2 gives marks for the reason.",

    atoms: [
      {
        id: "a-ma-l5-g1-1",
        title: "Chords and the centre",
        explain: "The perpendicular from the centre to a chord BISECTS the chord. This makes a right-angled triangle: the radius is the hypotenuse, and the other two sides are the half-chord and the distance from the centre. Equal chords are the same distance from the centre.",
        table: [
          ["Fact", "Use"],
          ["Perpendicular from centre bisects chord", "half-chord² + distance² = radius²"],
          ["Equal chords", "equidistant from the centre"],
        ],
        example: "  Chord 16 cm, radius 10 cm\n    half-chord = 8\n    d² = 10² − 8² = 36  →  d = 6 cm",
        mistake: "Using the whole chord in Pythagoras. The right angle is made with HALF the chord.",
        drill: { skill: "L5-G1.1", count: 3 },
      },
      {
        id: "a-ma-l5-g1-2",
        title: "Angle at the centre",
        explain: "The angle an arc subtends at the CENTRE is TWICE the angle it subtends at any point on the remaining circumference. Reason to write: 'angle at centre = 2 × angle at circumference'.",
        example: "  Angle ACB = 35° at the circumference\n    Angle AOB = 70° at the centre\n\n  Reflex angle at the centre 260°  →  angle at circumference 130°",
        mistake: "Halving when you should double. The centre angle is always the BIGGER one.",
        drill: { skill: "L5-G1.2", count: 3 },
      },
      {
        id: "a-ma-l5-g1-3",
        title: "Angle in a semicircle",
        explain: "An angle at the circumference standing on a DIAMETER is 90°. It is the centre-angle theorem with a centre angle of 180°.",
        example: "  AB is a diameter, C on the circle, angle CAB = 32°\n    angle ACB = 90°\n    angle CBA = 180 − 90 − 32 = 58°",
        mistake: "Missing the diameter. Whenever a triangle has a diameter as one side and its third corner on the circle, mark the right angle first.",
        drill: { skill: "L5-G1.3", count: 3 },
      },
      {
        id: "a-ma-l5-g1-4",
        title: "Angles in the same segment",
        explain: "Angles at the circumference standing on the SAME arc, on the same side of the chord, are EQUAL. Trace the two lines from each angle back to the circle: if they land on the same two points, the angles are equal.",
        example: "  Angle ADB = 41°\n    angle ACB stands on the same arc AB  →  41°",
        mistake: "Doubling. Only the CENTRE angle is double; two circumference angles on one arc are equal.",
        drill: { skill: "L5-G1.4", count: 3 },
      },
      {
        id: "a-ma-l5-g1-5",
        title: "Cyclic quadrilaterals",
        explain: "A CYCLIC quadrilateral has all four corners on a circle. Its OPPOSITE angles add up to 180°. So an EXTERIOR angle equals the INTERIOR OPPOSITE angle.",
        table: [
          ["Fact", "Reason to write"],
          ["A + C = 180°, B + D = 180°", "opposite angles of a cyclic quadrilateral"],
          ["Exterior angle = interior opposite angle", "exterior angle of a cyclic quadrilateral"],
        ],
        example: "  Angle A = 105°  →  angle C = 75°\n  DC extended to E: angle BCE = angle A = 105°",
        mistake: "Saying opposite angles are EQUAL. They are SUPPLEMENTARY: they add to 180°.",
        drill: { skill: "L5-G1.5", count: 3 },
      },
      {
        id: "a-ma-l5-g1-6",
        title: "Tangents",
        explain: "A TANGENT touches the circle at one point and is perpendicular to the radius there. Two tangents from the same outside point are EQUAL in length, and the line to the centre bisects the angle between them.",
        example: "  OP = 13, radius 5, tangent from P touches at T\n    angle OTP = 90°  →  PT² = 13² − 5² = 144  →  PT = 12\n\n  Angle AOB = 130° between radii to the points of contact\n    angle APB = 360 − 90 − 90 − 130 = 50°",
        mistake: "Adding the squares. OP is the hypotenuse because it is opposite the right angle at T.",
        drill: { skill: "L5-G1.6", count: 3 },
      },
      {
        id: "a-ma-l5-g1-7",
        title: "The alternate segment theorem",
        explain: "The angle between a tangent and a chord at the point of contact EQUALS the angle in the ALTERNATE segment: the angle at the circumference on the other side of the chord.",
        example: "  Tangent at A, chord AB, angle between them 58°\n    any angle ACB in the other segment = 58°",
        mistake: "Picking the angle in the same segment. The matching angle is across the chord, on the far side.",
        drill: { skill: "L5-G1.7", count: 3 },
      },
      {
        id: "a-ma-l5-g1-8",
        title: "Intersecting chords",
        explain: "When two chords AB and CD cross at X inside a circle, the products of their parts are equal: AX × XB = CX × XD.",
        example: "  AX = 6, XB = 4, CX = 3\n    6 × 4 = 3 × XD  →  XD = 8",
        mistake: "Setting the sums equal. It is the PRODUCTS of the two parts of each chord.",
        drill: { skill: "L5-G1.8", count: 3 },
      },
      {
        id: "a-ma-review-33",
        title: "Mixed review",
        explain: "One question on each earlier skill.",
        drill: { review: ["L5-A1.1", "L5-A2.4", "L5-A4.3", "L5-N1.3", "L4-T1.1"], count: 5 },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
