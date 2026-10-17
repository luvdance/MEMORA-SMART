/**
 * MATHEMATICS: PRIMARY TO UNIVERSITY READY
 *
 * Course content is DATA, never markup. This object is the single source of
 * truth for every Academy surface that describes the course, and it mirrors
 * the shape of dataAnalysisCourse.js and cybersecurityCourse.js, so the
 * catalog, curriculum sidebar, lesson player, progress engine and stats band
 * render it unchanged.
 *
 *   courses/{courseId}
 *     └── modules/{moduleId}          (month + order)
 *           └── lessons/{lessonId}    one lesson per SKILL GROUP
 *                 └── atoms/{atomId}  one atom per SKILL
 *
 * ── HOW THE COURSE IS BUILT ──────────────────────────────────────────────
 *
 * The skill map (src/academy/data/maths/atomMap.js) lists every skill from
 * primary place value to university proof, each with its prerequisites. This
 * outline places those skill groups into modules. `skillGroups` on a module is
 * the link, and `npm run test:maths` fails if:
 *
 *   · any skill in the map is not taught by some module, or is taught twice;
 *   · any lesson drills a skill before every one of its prerequisites has
 *     been taught. That is the course's logical order, checked rather than
 *     claimed.
 *
 * ── EVERY ATOM IS A-T-O-M ────────────────────────────────────────────────
 *
 *   Anchor    the idea or law, stated in a sentence or two (`explain`, and a
 *             `table` when there is a law to write down)
 *   Trace     worked examples and a picture (`example`, `visual`)
 *   Operate   generated practice that must be got right (`drill`): fresh
 *             numbers every time, the mistake named, a twin question after a
 *             miss, and a step-by-step scaffold after two
 *   Master    the lesson check, graded on the server
 *
 * Little talk, a lot of mathematics. The syllabus coverage is checked against
 * the WAEC/NECO General Mathematics and JAMB UTME Mathematics syllabuses: every
 * examined topic has a skill, and every skill has a home in this outline.
 *
 * ── ON THE ATOM COUNTS ───────────────────────────────────────────────────
 * `atoms` is a PLANNING figure. What is actually written lives in the lesson
 * registry, and every surface that quotes a real number reads it from there,
 * so a learner is always told the truth about which modules are ready.
 */

export const MATHEMATICS_COURSE = {
  id: "mathematics",
  slug: "mathematics",
  title: "Mathematics",
  subtitle: "Primary to university ready",
  tagline:
    "Start at place value, finish at calculus and proof. Every WAEC, NECO and JAMB topic, taught in the order each one depends on the last.",
  description:
    "A ten month programme that rebuilds mathematics from the first idea upwards: whole numbers, the four operations, fractions and decimals, then every topic of the JSS and SSS syllabus, then a bridge into university mathematics. Every concept is stated plainly with its law, shown in worked examples, and then practised on questions generated fresh every time, so you can practise as much as you want and never run out. A wrong answer is never just marked wrong: you are told the exact mistake, shown the working, and given a new question of the same kind. Each lesson ends with a check you must pass before the next one opens.",

  status: "live", // "live" | "coming-soon" | "draft"
  level: "Primary to university ready",
  durationMonths: 10,
  hoursPerWeek: "5 to 7",
  language: "English",
  instructor: {
    name: "Memora Smart Academy",
    role: "Mastery curriculum",
  },

  access: {
    accessType: "free",
    price: 0,
    currency: "NGN",
    enrollmentStatus: "open",
  },

  /**
   * The exams this course is built against. They play the role tools play in
   * the other courses: the thing the learner is working towards, named, so the
   * curriculum can be checked against it.
   */
  tools: [
    {
      id: "waec",
      name: "WAEC / WASSCE",
      short: "WAEC",
      blurb: "Paper 1 objectives and Paper 2 theory, including the written working that earns method marks.",
      icon: "fas fa-file-pen",
      accent: "#1d4ed8",
    },
    {
      id: "neco",
      name: "NECO SSCE",
      short: "NECO",
      blurb: "The same core syllabus as WAEC, examined in the same two papers.",
      icon: "fas fa-file-lines",
      accent: "#0f766e",
    },
    {
      id: "jamb",
      name: "JAMB UTME",
      short: "JAMB",
      blurb: "Computer based, objective only. Includes the JAMB-only topics: polynomials, binary operations, permutations, calculus of trigonometric functions.",
      icon: "fas fa-bolt",
      accent: "#c2410c",
    },
    {
      id: "university",
      name: "University bridge",
      short: "Uni bridge",
      blurb: "Functions, the binomial expansion, partial fractions, complex numbers, radians and proof by induction.",
      icon: "fas fa-graduation-cap",
      accent: "#7c3aed",
    },
  ],

  outcomes: [
    "Calculate fluently with whole numbers, fractions, decimals, percentages and ratios, without a calculator",
    "Use the laws of indices, logarithms and surds accurately",
    "Expand, factorise, solve and rearrange: linear, simultaneous and quadratic equations, inequalities and algebraic fractions",
    "Handle geometry, mensuration, construction, loci, circle theorems, coordinate geometry and trigonometry to SS3 standard",
    "Present and analyse data: averages, cumulative frequency, dispersion and probability",
    "Work with sets, logic, number bases, modular arithmetic, sequences, matrices, vectors and transformations",
    "Differentiate and integrate, and apply both to rates of change, maxima, minima and areas",
    "Sit WAEC, NECO and JAMB with every examined topic practised, and start university mathematics already fluent",
  ],

  audience: [
    "Anyone starting from scratch, at any age",
    "JSS and SS students who want to stop guessing and start understanding",
    "SS3 and private candidates preparing for WAEC, NECO or JAMB",
    "School leavers who want to arrive at university mathematics prepared",
  ],

  requirements: [
    "A phone, tablet or laptop with an internet connection",
    "Paper and a pen. Working on paper is part of the method",
    "A ruler, a protractor and a pair of compasses from Month 5",
    "A scientific calculator from Month 7",
  ],

  /**
   * MONTHS → MODULES → SKILL GROUPS.
   * Each skill group in `skillGroups` becomes one lesson, in the order listed.
   */
  months: [
    /* ═══════════════════════════════════════════════════════════════════
       MONTH 1 · WHOLE NUMBERS
       ═══════════════════════════════════════════════════════════════════ */
    {
      month: 1,
      title: "Whole Numbers",
      focus: "Number",
      summary:
        "The foundation everything else stands on: place value, the four operations and BODMAS, factors and primes, first fractions, decimals and money, and squares and roots.",
      modules: [
        {
          id: "ma-01-place-value",
          order: 1,
          title: "Place Value",
          summary: "How a digit's position gives it its value. Reading, writing, ordering and rounding whole numbers, and Roman numerals.",
          skillGroups: ["L0-N1"],
          atoms: 6,
          topics: [
            "How this course works",
            "Reading and writing whole numbers",
            "Place and value",
            "Ordering and comparing",
            "Rounding",
            "Roman numerals",
          ],
        },
        {
          id: "ma-02-operations",
          order: 2,
          title: "The Four Operations",
          summary: "Times tables to instant recall, long multiplication, long division, and the order of operations (BODMAS).",
          skillGroups: ["L0-N2"],
          atoms: 5,
          topics: ["Times tables", "Long multiplication", "Long division with remainders", "BODMAS"],
        },
        {
          id: "ma-03-factors-fractions",
          order: 3,
          title: "Factors, Primes and Fractions",
          summary: "Factors, multiples, primes and divisibility tests, then what a fraction is, equivalent fractions, comparing them, and a fraction of a quantity.",
          skillGroups: ["L0-N3", "L0-N4"],
          atoms: 8,
          topics: [
            "Factors",
            "Multiples",
            "Prime numbers",
            "Divisibility rules",
            "A fraction as a picture",
            "Equivalent fractions",
            "Comparing fractions",
            "A fraction of a quantity",
          ],
        },
        {
          id: "ma-04-decimals-roots",
          order: 4,
          title: "Decimals, Money, Squares and Roots",
          summary: "Decimal place value, adding and subtracting decimals, naira and kobo, fractions as decimals, then square numbers, cube numbers and their roots.",
          skillGroups: ["L0-N5", "L0-N6"],
          atoms: 9,
          topics: [
            "Decimal place value",
            "Adding and subtracting decimals",
            "Naira and kobo",
            "Fractions to decimals",
            "Squares and square roots",
            "Cubes and cube roots",
            "Estimating square roots",
          ],
        },
      ],
    },

    /* ═══════════════════════════════════════════════════════════════════
       MONTH 2 · MEASURE, DATA AND NUMBER TOOLS
       ═══════════════════════════════════════════════════════════════════ */
    {
      month: 2,
      title: "Measure, Data and Number Tools",
      focus: "Number & Measure",
      summary:
        "Units, time and reading data, then the JSS1 number toolkit: base two, prime factorisation, HCF and LCM, directed numbers, and all four operations on fractions.",
      modules: [
        {
          id: "ma-05-measurement-time",
          order: 5,
          title: "Measurement and Time",
          summary: "Metric units, reading instruments, perimeter and area of rectangles, then units of time, the 24-hour clock and elapsed time.",
          skillGroups: ["L0-G1", "L0-G2"],
          atoms: 8,
          topics: [
            "Metric conversion",
            "Reading instruments",
            "Perimeter",
            "Area of rectangles",
            "Units of time",
            "The 24-hour clock",
            "Elapsed time",
          ],
        },
        {
          id: "ma-06-data-base-two",
          order: 6,
          title: "Reading Data, Large Numbers and Base Two",
          summary: "Reading tables, timetables and bar charts, then numbers to trillions and counting, converting and adding in base two.",
          skillGroups: ["L0-S1", "L1-N1"],
          atoms: 8,
          topics: [
            "Reading tables and timetables",
            "Reading bar charts and pictograms",
            "Answering from data",
            "Numbers to trillions",
            "Counting in base two",
            "Converting between base ten and base two",
            "Adding and subtracting in base two",
          ],
        },
        {
          id: "ma-07-hcf-lcm-negatives",
          order: 7,
          title: "HCF, LCM and Directed Numbers",
          summary: "Prime factorisation, HCF, LCM and roots by prime factors, then negative numbers and the sign rules.",
          skillGroups: ["L1-N2", "L1-N6"],
          atoms: 10,
          topics: [
            "Prime factorisation",
            "Highest common factor",
            "Lowest common multiple",
            "HCF and LCM word problems",
            "Roots by prime factors",
            "Integers on a number line",
            "Adding and subtracting negatives",
            "Multiplying and dividing negatives",
            "Directed numbers in context",
          ],
        },
        {
          id: "ma-08-fractions",
          order: 8,
          title: "Fractions: All Four Operations",
          summary: "Adding and subtracting unlike fractions, multiplying and dividing, mixed numbers, and fraction word problems.",
          skillGroups: ["L1-N3"],
          atoms: 5,
          topics: [
            "Adding and subtracting unlike fractions",
            "Multiplying and dividing fractions",
            "Mixed numbers",
            "Fraction word problems",
          ],
        },
      ],
    },

    /* ═══════════════════════════════════════════════════════════════════
       MONTH 3 · PERCENTAGES, RATIO AND FIRST ALGEBRA
       ═══════════════════════════════════════════════════════════════════ */
    {
      month: 3,
      title: "Percentages, Ratio and First Algebra",
      focus: "Number & Algebra",
      summary:
        "Percentages and approximation, the number system and ratio, then letters for numbers, equations, sequences, angles and plane shapes.",
      modules: [
        {
          id: "ma-09-percentages-approximation",
          order: 9,
          title: "Percentages and Approximation",
          summary: "Converting fractions, decimals and percentages, percentages of quantities, decimal places, significant figures and estimation.",
          skillGroups: ["L1-N4", "L1-N5"],
          atoms: 7,
          topics: [
            "Fractions, decimals and percentages",
            "Percentage of a quantity",
            "One quantity as a percentage of another",
            "Decimal places",
            "Significant figures",
            "Estimating",
          ],
        },
        {
          id: "ma-10-number-system-ratio",
          order: 10,
          title: "The Number System and Ratio",
          summary: "Natural numbers, integers, rational and irrational numbers, then ratio, the unitary method, proportion and speed.",
          skillGroups: ["L1-N7", "L2-N3"],
          atoms: 8,
          topics: [
            "Natural numbers, whole numbers and integers",
            "Rational and irrational numbers",
            "Real numbers on the number line",
            "Ratio and sharing",
            "The unitary method",
            "Direct and inverse proportion",
            "Speed, distance and time",
          ],
        },
        {
          id: "ma-11-algebra-begins",
          order: 11,
          title: "Algebra Begins",
          summary: "Letters for unknowns, like terms, substitution, writing expressions from words, and solving one- and two-step equations.",
          skillGroups: ["L1-A1", "L1-A2"],
          atoms: 8,
          topics: [
            "Letters for unknowns",
            "Collecting like terms",
            "Substitution",
            "Writing an expression from words",
            "One-step equations",
            "Two-step equations",
            "Equations from word problems",
          ],
        },
        {
          id: "ma-12-sequences-angles-shapes",
          order: 12,
          title: "Sequences, Angles and Plane Shapes",
          summary: "Number patterns and the nth term, the basic angle facts, and the properties, perimeters, areas and symmetry of plane shapes.",
          skillGroups: ["L1-A3", "L1-G3", "L1-G1"],
          atoms: 12,
          topics: [
            "Continuing a sequence",
            "Term-to-term rules",
            "The nth term",
            "Special sequences",
            "Classifying angles",
            "Measuring and drawing angles",
            "Angles on a line and at a point",
            "Triangles and quadrilaterals",
            "Perimeter of plane shapes",
            "Area formulas",
            "Symmetry",
          ],
        },
      ],
    },

    /* ═══════════════════════════════════════════════════════════════════
       MONTH 4 · INDICES, MONEY AND ALGEBRA
       ═══════════════════════════════════════════════════════════════════ */
    {
      month: 4,
      title: "Indices, Money and Algebra",
      focus: "Number & Algebra",
      summary:
        "Solids and data handling, the laws of indices and standard form, profit, loss and simple interest, and expanding brackets and solving linear equations.",
      modules: [
        {
          id: "ma-13-solids-data",
          order: 13,
          title: "Solid Shapes and Data Handling",
          summary: "Faces, edges, vertices, nets and the volume of a cuboid, then frequency tables, bar charts, and the mean, median, mode and range.",
          skillGroups: ["L1-G2", "L1-S1"],
          atoms: 7,
          topics: [
            "Faces, edges and vertices",
            "Nets",
            "Volume of a cuboid",
            "Frequency tables",
            "Pictograms and bar charts",
            "Mean, median, mode and range",
          ],
        },
        {
          id: "ma-14-indices",
          order: 14,
          title: "Indices and Standard Form",
          summary: "The laws of indices, zero, negative and fractional indices, equations involving indices, and standard form.",
          skillGroups: ["L2-N1"],
          atoms: 7,
          topics: [
            "Laws of indices",
            "Zero and negative indices",
            "Fractional indices",
            "Equations involving indices",
            "Writing standard form",
            "Calculating in standard form",
          ],
        },
        {
          id: "ma-15-commercial-binary",
          order: 15,
          title: "Commercial Arithmetic and Binary Multiplication",
          summary: "Profit and loss percent, simple interest, discount and commission, then multiplying in base two and converting to other small bases.",
          skillGroups: ["L2-N2", "L2-N4"],
          atoms: 7,
          topics: [
            "Profit and loss percent",
            "Simple interest",
            "Discount and commission",
            "Market problems",
            "Multiplying in base two",
            "Binary to other small bases",
          ],
        },
        {
          id: "ma-16-expanding-equations",
          order: 16,
          title: "Brackets and Linear Equations",
          summary: "Expanding single and double brackets, factorising by a common factor, simple algebraic fractions, and linear equations with brackets and fractions.",
          skillGroups: ["L2-A1", "L2-A2"],
          atoms: 8,
          topics: [
            "Expanding single brackets",
            "Expanding double brackets",
            "Factorising by common factor",
            "Simplifying algebraic fractions",
            "Equations with brackets",
            "Equations with fractions",
            "Changing the subject",
          ],
        },
      ],
    },

    /* ═══════════════════════════════════════════════════════════════════
       MONTH 5 · GRAPHS AND GEOMETRY
       ═══════════════════════════════════════════════════════════════════ */
    {
      month: 5,
      title: "Graphs and Geometry",
      focus: "Algebra & Geometry",
      summary:
        "The Cartesian plane and straight-line graphs, angles on parallel lines and in polygons, construction, circles, scale drawing and bearings, statistics and first probability.",
      modules: [
        {
          id: "ma-17-graphs",
          order: 17,
          title: "Coordinates and Straight-Line Graphs",
          summary: "Plotting points, tables of values, drawing straight-line graphs and reading real-life graphs.",
          skillGroups: ["L2-A3"],
          atoms: 5,
          topics: ["Plotting points", "Tables of values", "Drawing straight-line graphs", "Reading real-life graphs"],
        },
        {
          id: "ma-18-parallel-construction",
          order: 18,
          title: "Angle Rules and Construction",
          summary: "Alternate, corresponding and co-interior angles, angles in triangles and polygons, then constructions with ruler and compasses.",
          skillGroups: ["L2-G1", "L2-G2"],
          atoms: 8,
          topics: [
            "Angles on parallel lines",
            "Angles in a triangle",
            "Angles in polygons",
            "Bisecting a line",
            "Bisecting an angle",
            "Constructing standard angles",
            "Constructing triangles",
          ],
        },
        {
          id: "ma-19-circles-bearings",
          order: 19,
          title: "Circles, Compound Shapes and Bearings",
          summary: "Circumference and area of a circle, compound areas, prisms and cylinders, scale drawing and bearings.",
          skillGroups: ["L2-G3", "L2-G4"],
          atoms: 7,
          topics: [
            "Circumference and area of a circle",
            "Area of compound shapes",
            "Volume of prisms and cylinders",
            "Using a scale",
            "Compass and three-figure bearings",
            "Drawing a bearings diagram",
          ],
        },
        {
          id: "ma-20-statistics-probability",
          order: 20,
          title: "Statistics and First Probability",
          summary: "Grouping data, pie charts and the mean from a frequency table, then outcomes, experimental and theoretical probability.",
          skillGroups: ["L2-S1", "L2-S2"],
          atoms: 7,
          topics: [
            "Grouping data into classes",
            "Pie charts",
            "Mean from a frequency table",
            "Outcomes and the sample space",
            "Experimental probability",
            "Theoretical probability",
          ],
        },
      ],
    },

    /* ═══════════════════════════════════════════════════════════════════
       MONTH 6 · ALGEBRA POWER (JSS3)
       ═══════════════════════════════════════════════════════════════════ */
    {
      month: 6,
      title: "Algebra Power",
      focus: "Algebra",
      summary:
        "Number bases, compound interest and errors; factorisation, formulae and algebraic fractions; simultaneous equations and inequalities; similarity, Pythagoras, trigonometry and volume.",
      modules: [
        {
          id: "ma-21-bases-commerce-variation",
          order: 21,
          title: "Number Bases, Commerce and Error",
          summary: "Converting and calculating in any base, compound interest, VAT, hire purchase, foreign exchange, percentage error and first variation.",
          skillGroups: ["L3-N1", "L3-N2", "L3-N3"],
          atoms: 10,
          topics: [
            "Converting between any bases",
            "Arithmetic in any base",
            "Finding an unknown base",
            "Compound interest year by year",
            "VAT and income tax",
            "Hire purchase",
            "Foreign exchange",
            "Absolute and percentage error",
            "Direct and inverse variation",
          ],
        },
        {
          id: "ma-22-factorisation-formulae",
          order: 22,
          title: "Factorisation, Formulae and Algebraic Fractions",
          summary: "Grouping, difference of two squares and quadratic trinomials, changing the subject, and operations on algebraic fractions.",
          skillGroups: ["L3-A1", "L3-A3", "L3-A5"],
          atoms: 9,
          topics: [
            "Factorising by grouping",
            "Difference of two squares",
            "Factorising quadratic trinomials",
            "Simplifying by factorising",
            "Changing the subject with powers and roots",
            "Substituting into formulae",
            "Adding and subtracting algebraic fractions",
            "Multiplying and dividing algebraic fractions",
          ],
        },
        {
          id: "ma-23-simultaneous-inequalities-similarity",
          order: 23,
          title: "Simultaneous Equations, Inequalities and Similarity",
          summary: "Elimination, substitution and graphical solution, linear inequalities on a number line, and similar shapes and enlargement.",
          skillGroups: ["L3-A2", "L3-A4", "L3-G1"],
          atoms: 10,
          topics: [
            "Elimination",
            "Substitution",
            "Graphical solution",
            "Simultaneous equation word problems",
            "Solving linear inequalities",
            "Inequalities on a number line",
            "Identifying similar shapes",
            "Scale factor for lengths",
            "Enlargement from a centre",
          ],
        },
        {
          id: "ma-24-pythagoras-trigonometry",
          order: 24,
          title: "Pythagoras, Trigonometry, Volume and Averages",
          summary: "Pythagoras' theorem, sine, cosine and tangent, elevation and depression, cylinders, cones and pyramids, and averages from frequency tables.",
          skillGroups: ["L3-T1", "L3-G2", "L3-S1"],
          atoms: 11,
          topics: [
            "Pythagoras' theorem",
            "Sine, cosine and tangent",
            "Finding sides and angles",
            "Elevation and depression",
            "Cylinders",
            "Cones and pyramids",
            "Capacity in litres",
            "Averages from a frequency table",
            "Choosing the best average",
            "Interpreting charts",
          ],
        },
      ],
    },

    /* ═══════════════════════════════════════════════════════════════════
       MONTH 7 · THE SENIOR NUMBER SYSTEM (SS1)
       ═══════════════════════════════════════════════════════════════════ */
    {
      month: 7,
      title: "The Senior Number System",
      focus: "Number & Algebra",
      summary:
        "Number bases in full and modular arithmetic, logarithms and surds, sets and logical reasoning, and the quadratic equation, its graph, and variation.",
      modules: [
        {
          id: "ma-25-bases-modular",
          order: 25,
          title: "Number Bases in Full and Modular Arithmetic",
          summary: "Fractional parts between bases, base equations and word problems, then arithmetic modulo n.",
          skillGroups: ["L4-N1", "L4-N2"],
          atoms: 8,
          topics: [
            "Fractional parts between bases",
            "Base equations",
            "Bases in word problems",
            "Remainders mod n",
            "Adding and subtracting mod n",
            "Multiplying mod n",
            "Modular equations and cycles",
          ],
        },
        {
          id: "ma-26-logarithms-surds",
          order: 26,
          title: "Logarithms and Surds",
          summary: "Logarithms as indices, the laws of logarithms, change of base and log equations, then simplifying, combining and rationalising surds.",
          skillGroups: ["L4-N3", "L4-N4"],
          atoms: 10,
          topics: [
            "Indices and logarithms linked",
            "Laws of logarithms",
            "Log and antilog tables",
            "Change of base",
            "Solving log equations",
            "Simplifying surds",
            "Adding and subtracting surds",
            "Multiplying surds",
            "Rationalising denominators",
          ],
        },
        {
          id: "ma-27-sets-logic",
          order: 27,
          title: "Sets and Logical Reasoning",
          summary: "Set notation, union, intersection and complement, two- and three-set Venn problems, then statements, negation and implication.",
          skillGroups: ["L4-N5", "L4-N6"],
          atoms: 9,
          topics: [
            "Set notation and types of sets",
            "Union, intersection and complement",
            "Two-set Venn problems",
            "Three-set Venn problems",
            "Statements",
            "Negation",
            "Implication, converse and contrapositive",
            "Testing arguments with Venn diagrams",
          ],
        },
        {
          id: "ma-28-quadratics-variation",
          order: 28,
          title: "Quadratic Equations, Graphs and Variation",
          summary: "Solving by factorising, completing the square and the formula, sum and product of roots, quadratic graphs, and every kind of variation.",
          skillGroups: ["L4-A1", "L4-A2", "L4-A3"],
          atoms: 13,
          topics: [
            "Solving by factorising",
            "Completing the square",
            "The quadratic formula",
            "Forming an equation from roots",
            "Sum and product of roots",
            "Drawing a quadratic graph",
            "Roots, maximum and minimum",
            "Line and curve intersections",
            "Tangent and gradient",
            "Direct and inverse variation",
            "Joint and partial variation",
            "Applied variation problems",
          ],
        },
      ],
    },

    /* ═══════════════════════════════════════════════════════════════════
       MONTH 8 · GEOMETRY, SEQUENCES AND ADVANCED ALGEBRA (SS1–SS2)
       ═══════════════════════════════════════════════════════════════════ */
    {
      month: 8,
      title: "Geometry, Sequences and Advanced Algebra",
      focus: "Geometry & Algebra",
      summary:
        "Arcs, sectors and solids, congruence and similar triangles, loci, trigonometry to 360 degrees, grouped data, AP and GP, financial arithmetic, and advanced algebra.",
      modules: [
        {
          id: "ma-29-mensuration-triangles",
          order: 29,
          title: "Mensuration and Triangle Geometry",
          summary: "Arc length, sectors, cones from sectors, frustums, similar solids, then congruence, quadrilaterals, the intercept theorem and equal-area theorems.",
          skillGroups: ["L4-G1", "L4-G2"],
          atoms: 10,
          topics: [
            "Arc length and sector area",
            "Sector to cone",
            "Frustums and composite solids",
            "Areas and volumes of similar figures",
            "Triangle congruence",
            "Special quadrilaterals",
            "The intercept theorem",
            "Similar triangle problems",
            "Parallelograms on the same base",
          ],
        },
        {
          id: "ma-30-loci-trigonometry-data",
          order: 30,
          title: "Loci, Trigonometry to 360° and Grouped Data",
          summary: "The four standard loci, trigonometric ratios from 0° to 360°, exact values and graphs, histograms and averages of grouped data.",
          skillGroups: ["L4-G3", "L4-T1", "L4-S1"],
          atoms: 9,
          topics: [
            "The four standard loci",
            "Intersecting loci",
            "Ratios from 0° to 360°",
            "Exact values",
            "Graphs of sine and cosine",
            "Histograms and frequency polygons",
            "Averages of grouped data",
            "Assumed mean",
          ],
        },
        {
          id: "ma-31-sequences-finance",
          order: 31,
          title: "Sequences, Series and Financial Arithmetic",
          summary: "Arithmetic and geometric progressions, their sums and sum to infinity, then compound interest, depreciation, annuities, shares and bonds.",
          skillGroups: ["L5-N1", "L5-N2"],
          atoms: 11,
          topics: [
            "Finding a pattern",
            "Arithmetic progressions",
            "Sum of an AP",
            "Geometric progressions",
            "Sum to infinity",
            "Compound interest by formula",
            "Depreciation",
            "Amortisation and annuities",
            "Shares, bonds and capital markets",
            "Dividends and VAT",
          ],
        },
        {
          id: "ma-32-advanced-algebra",
          order: 32,
          title: "Advanced Algebra",
          summary: "One linear and one quadratic equation, inequalities in two variables and linear programming, quadratic inequalities, harder algebraic fractions, and functions.",
          skillGroups: ["L5-A1", "L5-A2", "L5-A3", "L5-A4"],
          atoms: 13,
          topics: [
            "One linear and one quadratic",
            "Simultaneous word problems",
            "Inequalities in two variables",
            "Simultaneous inequalities",
            "Linear programming",
            "Quadratic inequalities",
            "Binomial denominators",
            "Undefined values",
            "Equations with algebraic fractions",
            "Types of mapping",
            "Finding the rule",
            "Evaluating functions",
          ],
        },
      ],
    },

    /* ═══════════════════════════════════════════════════════════════════
       MONTH 9 · CIRCLES, TRIANGLES, DATA AND MATRICES (SS2)
       ═══════════════════════════════════════════════════════════════════ */
    {
      month: 9,
      title: "Circles, Triangles, Data and Matrices",
      focus: "Geometry, Statistics & Matrices",
      summary:
        "The circle theorems, coordinate geometry, the sine and cosine rules, cumulative frequency, dispersion and probability, matrices and binary operations.",
      modules: [
        {
          id: "ma-33-circle-theorems",
          order: 33,
          title: "Circle Theorems",
          summary: "Every circle theorem in the syllabus, from chord properties to the alternate segment theorem and intersecting chords.",
          skillGroups: ["L5-G1"],
          atoms: 9,
          topics: [
            "Chord properties",
            "Angle at the centre",
            "Angle in a semicircle",
            "Angles in the same segment",
            "Cyclic quadrilaterals",
            "Tangent and radius",
            "Alternate segment theorem",
            "Intersecting chords",
          ],
        },
        {
          id: "ma-34-coordinates-triangles",
          order: 34,
          title: "Coordinate Geometry and Solving Triangles",
          summary: "Distance, midpoint, gradient and the equation of a line, then the sine rule, cosine rule, area of a triangle and bearings problems.",
          skillGroups: ["L5-G2", "L5-T1"],
          atoms: 10,
          topics: [
            "Distance and midpoint",
            "Gradient",
            "Equation of a line",
            "Parallel and perpendicular lines",
            "The sine rule",
            "The cosine rule",
            "Area of a triangle",
            "Bearings and distance",
            "Elevation and depression in 2D",
          ],
        },
        {
          id: "ma-35-statistics-probability",
          order: 35,
          title: "Cumulative Frequency, Dispersion and Probability",
          summary: "Ogives, quartiles and percentiles, range, mean deviation, variance and standard deviation, and the addition and multiplication rules of probability.",
          skillGroups: ["L5-S1", "L5-S2", "L5-S3"],
          atoms: 14,
          topics: [
            "Cumulative frequency tables",
            "Drawing an ogive",
            "Quartiles and percentiles",
            "Interpreting in context",
            "Range and mean deviation",
            "Variance",
            "Standard deviation, ungrouped",
            "Standard deviation, grouped",
            "The addition rule",
            "The multiplication rule",
            "With and without replacement",
            "Tree diagrams",
            "At least and at most",
          ],
        },
        {
          id: "ma-36-matrices-binary",
          order: 36,
          title: "Matrices and Binary Operations",
          summary: "Order, addition and multiplication of matrices, determinants, inverses and solving equations, then binary operations, identity and inverse elements.",
          skillGroups: ["L6-C1", "L6-N1"],
          atoms: 8,
          topics: [
            "Order and types of matrix",
            "Adding and subtracting matrices",
            "Multiplying matrices",
            "Determinant and inverse",
            "Solving equations with matrices",
            "Properties of binary operations",
            "Identity and inverse elements",
          ],
        },
      ],
    },

    /* ═══════════════════════════════════════════════════════════════════
       MONTH 10 · CALCULUS, THE EXAMS AND UNIVERSITY (SS3+)
       ═══════════════════════════════════════════════════════════════════ */
    {
      month: 10,
      title: "Calculus, the Exams and University",
      focus: "Calculus & Exam Mastery",
      summary:
        "Vectors, transformations and the Earth as a sphere, polynomials and counting, differentiation and integration, exam technique, and the bridge to university mathematics.",
      modules: [
        {
          id: "ma-37-vectors-transformations",
          order: 37,
          title: "Vectors, Transformations and the Earth",
          summary: "Vectors in component form, reflection, rotation, translation and enlargement, then latitude, longitude and distance on the Earth.",
          skillGroups: ["L6-G1", "L6-G2", "L6-G3"],
          atoms: 12,
          topics: [
            "Representing vectors",
            "Magnitude and direction",
            "Adding, subtracting and scaling",
            "Position vectors",
            "Reflection",
            "Rotation",
            "Translation and enlargement",
            "Describing a transformation fully",
            "Latitude and longitude",
            "Distance along a meridian or parallel",
            "Time and longitude",
          ],
        },
        {
          id: "ma-38-polynomials-counting",
          order: 38,
          title: "Polynomials, Permutations and Combinations",
          summary: "Dividing polynomials, the remainder and factor theorems, cubic graphs, then arrangements and selections.",
          skillGroups: ["L6-A1", "L6-S1"],
          atoms: 8,
          topics: [
            "Multiplying and dividing polynomials",
            "The remainder theorem",
            "The factor theorem and cubics",
            "Sketching cubic graphs",
            "Linear and circular arrangements",
            "Repeated objects",
            "Selections with nCr",
          ],
        },
        {
          id: "ma-39-calculus",
          order: 39,
          title: "Differentiation and Integration",
          summary: "Limits, first principles, the power rule, trigonometric derivatives, rates of change and turning points, then integration, definite integrals and area.",
          skillGroups: ["L6-C2", "L6-C3"],
          atoms: 11,
          topics: [
            "Limits and the gradient of a curve",
            "Differentiating from first principles",
            "The power rule",
            "Differentiating sine, cosine and tangent",
            "Rates of change",
            "Maxima and minima",
            "Integration as the reverse",
            "Definite integrals",
            "Area under a curve",
            "Integrating sine and cosine",
          ],
        },
        {
          id: "ma-40-exam-mastery",
          order: 40,
          type: "project",
          title: "Exam Mastery: WAEC, NECO and JAMB",
          summary: "Translating word problems, objective speed and elimination, Paper 2 technique, timed mocks and weak-topic recovery.",
          skillGroups: ["L6-E1", "L6-E2", "L6-E3", "L6-E4", "L6-E5"],
          atoms: 15,
          topics: [
            "Word-problem translation",
            "Objective speed and elimination",
            "Paper 2 technique",
            "Full timed mocks",
            "Weak-topic recovery",
          ],
        },
        {
          id: "ma-41-university-bridge",
          order: 41,
          type: "capstone",
          title: "The University Bridge",
          summary: "Functions, the binomial expansion, partial fractions, sigma notation, proof, induction, identities, radians and complex numbers.",
          skillGroups: ["L6-U1", "L6-U2"],
          atoms: 11,
          topics: [
            "Domain and range",
            "Composite and inverse functions",
            "The binomial expansion",
            "Partial fractions",
            "Proof and counterexample",
            "Sigma notation",
            "Proof by induction",
            "Radians",
            "Trigonometric identities",
            "Complex numbers",
          ],
        },
      ],
    },
  ],

  capstone: {
    title: "The University Bridge",
    summary:
      "The last module puts you in front of the algebra, notation and standard of proof a 100 level mathematics course opens with, so the first week of university is revision rather than a shock.",
    deliverables: [
      "Composite and inverse functions in full notation",
      "A binomial expansion and a partial fraction decomposition",
      "A proof by induction",
      "Arithmetic with complex numbers",
    ],
  },

  certificate: {
    issuer: "Memora Smart Technologies",
    name: "Mathematics — Primary to University-Ready",
    covers: "WAEC • NECO • JAMB • University bridge",
    idFormat: "MST-CERT-2026-000001",
    requirements: [
      "Complete every required lesson",
      "Pass every required assessment at 70% or above",
      "Pass the final certification exam at 70% overall, with at least 50% in every domain",
    ],
  },
};

/**
 * Every maths module id, in teaching order. The lesson registry, the content
 * validator and the term checker all read this, so a new module is added in
 * exactly one place: the outline above.
 */
export const MATHS_MODULE_IDS = MATHEMATICS_COURSE.months.flatMap((m) => m.modules.map((mod) => mod.id));

/** Rules the assessment + progression engine enforces. Same as every course. */
export const ASSESSMENT_RULES = {
  defaultPassMark: 70,
  questionsPerLesson: [4, 6],
  attemptLimit: null, // null = unlimited retries
  lockNextLessonUntilPassed: true,
};

export default MATHEMATICS_COURSE;
