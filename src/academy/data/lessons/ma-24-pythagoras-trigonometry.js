/**
 * MATHEMATICS · MONTH 6 · MODULE 24 · PYTHAGORAS, TRIGONOMETRY, VOLUME AND AVERAGES
 *
 * CLIENT-SAFE. Atom shape and house style: see ma-01-place-value.js.
 */

export const SECTION_ID = "ma-s24-pythagoras-trigonometry";

export const LESSONS = [
  {
    id: "ma-l3-t1",
    moduleId: "ma-24-pythagoras-trigonometry",
    sectionId: SECTION_ID,
    skillGroup: "L3-T1",
    order: 1,
    title: "Pythagoras and Trigonometry",
    subtitle: "Right-angled triangles: sides, angles, heights and distances",
    estimatedMinutes: 55,
    intro: "In a right-angled triangle, the three sides are tied together by Pythagoras' theorem, and the sides and angles by three ratios. Together they find any missing length or angle.",

    atoms: [
      {
        id: "a-ma-l3-t1-1",
        title: "Pythagoras' theorem",
        explain:
          "In a right-angled triangle, the HYPOTENUSE c is the longest side, opposite the right angle. PYTHAGORAS' THEOREM: c² = a² + b². To find the hypotenuse, add the squares; to find a shorter side, subtract.",
        table: {
          caption: "Pythagorean triples: whole-number right triangles worth knowing.",
          headers: ["a", "b", "c"],
          rows: [["3", "4", "5"], ["5", "12", "13"], ["8", "15", "17"], ["7", "24", "25"]],
          note: "Multiples work too: 6, 8, 10 and 9, 12, 15.",
        },
        example: "  Legs 9 cm and 12 cm:   c² = 81 + 144 = 225,   c = 15 cm\n  Hypotenuse 13, leg 5:  b² = 169 − 25 = 144,   b = 12\n  Legs 4 and 7:          c² = 16 + 49 = 65,    c = √65 ≈ 8.1",
        mistake: "Adding the squares when you want a SHORTER side. If you know the hypotenuse, subtract.",
        drill: { skill: "L3-T1.1", count: 5 },
      },
      {
        id: "a-ma-l3-t1-2",
        title: "Sine, cosine and tangent",
        explain:
          "Name the sides from the angle θ: OPPOSITE faces it, ADJACENT is next to it (not the hypotenuse), HYPOTENUSE is the longest. The three trigonometric ratios compare pairs of sides. Remember SOH CAH TOA.",
        table: {
          caption: "SOH CAH TOA.",
          headers: ["Ratio", "Definition"],
          rows: [
            ["sin θ", "opposite ÷ hypotenuse"],
            ["cos θ", "adjacent ÷ hypotenuse"],
            ["tan θ", "opposite ÷ adjacent"],
          ],
        },
        example: "  Opposite 5, adjacent 12, hypotenuse 13:\n    sin θ = 5/13,  cos θ = 12/13,  tan θ = 5/12",
        mistake: "Labelling the sides from the right angle instead of from θ. The opposite side is the one facing θ.",
        drill: { skill: "L3-T1.2", count: 4 },
      },
      {
        id: "a-ma-l3-t1-3",
        title: "Finding sides and angles",
        explain:
          "To find a side, pick the ratio that links the side you know with the one you want, write the equation and rearrange. To find an angle, work out the ratio and use the inverse key (sin⁻¹, cos⁻¹, tan⁻¹) on a calculator in DEGREE mode.",
        example:
          "  Hypotenuse 10, angle 35°, find the opposite side x:\n    sin 35° = x/10  →  x = 10 sin 35° = 5.7\n\n  Opposite 7, adjacent 9, find θ:\n    tan θ = 7/9  →  θ = tan⁻¹(0.7778) = 37.9°",
        mistake: "Having the calculator in the wrong angle mode (RAD instead of DEG). sin 30 should give 0.5; if it does not, switch to degrees.",
        drill: { skill: "L3-T1.3", count: 5 },
      },
      {
        id: "a-ma-l3-t1-4",
        title: "Angles of elevation and depression",
        explain:
          "The ANGLE OF ELEVATION is measured UP from the horizontal to an object above you. The ANGLE OF DEPRESSION is measured DOWN from the horizontal to an object below. They are equal, by alternate angles, so draw the horizontal line first and use the right-angled triangle.",
        example:
          "  From 40 m away, the top of a tower is at an elevation of 32°.\n    height = 40 tan 32° = 25.0 m\n\n  From a 60 m cliff, a boat is at a depression of 25°.\n    distance = 60 ÷ tan 25° = 128.7 m",
        mistake: "Measuring the angle from the vertical. Elevation and depression are always measured from the HORIZONTAL.",
        drill: { skill: "L3-T1.4", count: 4 },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  {
    id: "ma-l3-g2",
    moduleId: "ma-24-pythagoras-trigonometry",
    sectionId: SECTION_ID,
    skillGroup: "L3-G2",
    order: 2,
    title: "Surface Area and Volume",
    subtitle: "Cylinders, cones, pyramids and capacity",
    estimatedMinutes: 40,
    intro: "Volume is the space inside a solid. Surface area is the total area of its outside: unfold it into a net and add the pieces.",

    atoms: [
      {
        id: "a-ma-l3-g2-1",
        title: "Cylinder",
        explain: "Unrolled, the curved surface of a cylinder is a rectangle 2πr wide and h high. Each end is a circle.",
        table: {
          caption: "Cylinder formulas.",
          headers: ["Measure", "Formula"],
          rows: [
            ["Curved surface area", "2πrh"],
            ["Total surface area (closed)", "2πrh + 2πr² = 2πr(h + r)"],
            ["Volume", "πr²h"],
          ],
        },
        example: "  r = 7 cm, h = 10 cm, π = 22/7\n    curved = 2 × 22/7 × 7 × 10 = 440 cm²\n    total  = 440 + 2 × 154 = 748 cm²\n    volume = 154 × 10 = 1 540 cm³",
        mistake: "Counting two ends for an open container. A tank open at the top has only one circular end.",
        drill: { skill: "L3-G2.1", count: 4 },
      },
      {
        id: "a-ma-l3-g2-2",
        title: "Cone and pyramid",
        explain:
          "A cone or pyramid holds exactly one third of the prism or cylinder with the same base and height: V = ⅓ × base area × height. A cone's curved surface is πrl, where l is the SLANT height, found by Pythagoras: l² = r² + h².",
        example: "  Cone: r = 6 cm, h = 8 cm\n    l = √(36 + 64) = 10 cm\n    curved area = π × 6 × 10 = 60π ≈ 188.5 cm²\n    volume = ⅓ × π × 36 × 8 = 96π ≈ 301.6 cm³\n\n  Square pyramid: base 9 cm, height 10 cm\n    V = ⅓ × 81 × 10 = 270 cm³",
        mistake: "Using the perpendicular height in πrl. The curved area needs the SLANT height.",
        drill: { skill: "L3-G2.2", count: 4 },
      },
      {
        id: "a-ma-l3-g2-3",
        title: "Capacity in litres",
        explain: "CAPACITY is how much a container holds. 1 litre = 1 000 cm³, and 1 m³ = 1 000 litres.",
        example: "  Tank 50 cm × 40 cm × 30 cm = 60 000 cm³ = 60 litres\n  Reservoir 4 m × 3 m × 2 m = 24 m³ = 24 000 litres",
        mistake: "Dividing m³ by 1 000 to get litres. A cubic metre is large: it holds 1 000 litres, so multiply.",
        drill: { skill: "L3-G2.3", count: 3 },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  {
    id: "ma-l3-s1",
    moduleId: "ma-24-pythagoras-trigonometry",
    sectionId: SECTION_ID,
    skillGroup: "L3-S1",
    order: 3,
    title: "Averages and Interpreting Charts",
    subtitle: "Mode and median from tables, choosing an average, reading charts",
    estimatedMinutes: 30,
    intro: "An average summarises data in one number. Knowing which average to use, and how to read one from a table, matters as much as calculating it.",

    atoms: [
      {
        id: "a-ma-l3-s1-1",
        title: "Averages from a frequency table",
        explain:
          "MODE: the value with the highest frequency. MEDIAN: with n values in order, the median is the ((n + 1) ÷ 2)th; use running totals of the frequencies (cumulative frequency) to find which value that is. MEAN: Σfx ÷ Σf.",
        example:
          "  x │ 1   2   3   4   5\n  f │ 2   5   8   3   2      Σf = 20\n  cumulative: 2, 7, 15, 18, 20\n\n  Mode = 3 (frequency 8)\n  Median: (20 + 1) ÷ 2 = 10.5th value. The 8th to 15th values are all 3, so the median is 3.",
        mistake: "Giving the frequency as the mode. The mode is the VALUE, 3, not how often it occurs, 8.",
        drill: { skill: "L3-S1.1", count: 4 },
      },
      {
        id: "a-ma-l3-s1-2",
        title: "Choosing the best average",
        explain: "The MEAN uses every value but is pulled by extreme values (outliers). The MEDIAN ignores extremes. The MODE is the only average for data that are not numbers, such as colours.",
        table: {
          caption: "Which average?",
          headers: ["Situation", "Best average"],
          rows: [
            ["Data with an extreme value (salaries with one huge one)", "median"],
            ["Non-numerical data (favourite food)", "mode"],
            ["The most popular size to stock", "mode"],
            ["Evenly spread data, every value should count", "mean"],
          ],
        },
        mistake: "Always using the mean. One ₦2 million salary among ₦90 000 ones makes the mean useless as a 'typical' salary.",
        drill: { skill: "L3-S1.2", count: 3 },
      },
      {
        id: "a-ma-l3-s1-3",
        title: "Interpreting charts",
        explain: "To answer from a chart, change what it shows into what the question asks: a percentage into a number (percentage × total ÷ 100), or a pie chart angle into a percentage (angle ÷ 360 × 100).",
        example: "  25% of 480 students walk:  480 × 25 ÷ 100 = 120 students\n  A 54° sector:  54 ÷ 360 × 100 = 15%",
        mistake: "Answering with the percentage when the question asks how many people.",
        drill: { skill: "L3-S1.3", count: 3 },
      },
      {
        id: "a-ma-review-24",
        title: "Mixed review",
        explain: "One question on each earlier skill.",
        drill: { review: ["L3-A2.1", "L3-A4.1", "L3-G1.2", "L3-A1.4", "L2-G3.3"], count: 5 },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
