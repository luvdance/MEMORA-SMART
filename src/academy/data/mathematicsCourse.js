/**
 * MATHEMATICS: ELEMENTARY TO UNIVERSITY READY
 *
 * Course content is DATA, never markup. This object is the single source of
 * truth for every Academy surface that describes the course, and it mirrors
 * the shape of dataAnalysisCourse.js and cybersecurityCourse.js exactly, which
 * is why the catalog, the curriculum sidebar, the lesson player, the progress
 * engine and the stats band all render it without a single change.
 *
 *   courses/{courseId}
 *     └── modules/{moduleId}          (month + order)
 *           └── lessons/{lessonId}
 *                 └── atoms/{atomId}
 *
 * ── THE FIRST MONTH IS NOT MATHEMATICS ───────────────────────────────────
 * Month 1 opens with a module that contains no sums at all. That is the most
 * deliberate decision in this curriculum.
 *
 * Most people who struggle with this subject did not fail at algebra. They
 * arrived at algebra carrying a gap from four years earlier, were taught
 * procedures with no meaning attached, were timed on speed and concluded they
 * were slow, and were eventually told, gently, that some people are simply not
 * mathematics people. By the time they meet a quadratic, the problem is no
 * longer the quadratic.
 *
 * A course that opens with a sum speaks only to the students who were already
 * fine. So this one opens by saying what the subject is, where it turns up in
 * an ordinary life, why it went wrong, and how to study it so that it works
 * this time. Then it starts, at the bottom, and assumes nothing.
 *
 * ── BOTTOM UP, AND ALL THE WAY UP ────────────────────────────────────────
 * Months 1 and 2 are below JSS1: what numbers are, what the instructions
 * mean, how the operations behave. Months 3 to 8 cover the whole JSS1 to SS3
 * syllabus for WAEC, NECO and JAMB. Month 9 does two things school does not:
 * exam technique taught as a skill in its own right, and a bridge module that
 * introduces the notation, the rigour and the habits of proof that a 100 level
 * university course opens with.
 *
 * ── ON THE ATOM COUNTS ───────────────────────────────────────────────────
 * `atoms` is a PLANNING figure: how many individual concepts the module
 * breaks into. What is actually written lives in the lesson registry
 * (src/academy/data/lessons/index.js), and every Academy surface that quotes a
 * real number reads it from there via getAuthoredStats(). The two are separate
 * on purpose so the platform can always tell a learner the truth about which
 * modules are ready.
 */

export const MATHEMATICS_COURSE = {
  id: "mathematics",
  slug: "mathematics",
  title: "Mathematics",
  subtitle: "Elementary to university ready",
  tagline:
    "Start below JSS1, finish past SS3. WAEC, NECO and JAMB with confidence, and ready for university mathematics.",
  description:
    "A nine month programme that rebuilds mathematics from the ground up. It opens with no sums at all: what the subject actually is, where it turns up in an ordinary day, the real reasons it goes wrong for so many people, and the rules that make studying it work. Then it starts at the bottom, with what the instructions mean and what kinds of numbers there are, and works through number, fractions, algebra, geometry, trigonometry, statistics and calculus in the order each one depends on the last. Every idea is explained in plain English, shown with worked examples, drilled with questions generated fresh every time, and assessed before the next one opens. It ends with a certification exam and a bridge module that puts you inside a university lecture rather than at the end of secondary school. No prior confidence required.",

  status: "live", // "live" | "coming-soon" | "draft"
  level: "Elementary to university ready",
  durationMonths: 9,
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
   * The exams this course is built against. Unlike the tools in the other
   * courses these are not software, but they play the same role: the thing the
   * learner is working towards, named, so the curriculum can be checked
   * against it rather than asserted.
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
      blurb: "The same core as WAEC, with the differences in instruction flagged where they matter.",
      icon: "fas fa-file-lines",
      accent: "#0f766e",
    },
    {
      id: "jamb",
      name: "JAMB UTME",
      short: "JAMB",
      blurb: "Computer based, objective only, no method marks. Speed and accuracy trained directly.",
      icon: "fas fa-bolt",
      accent: "#c2410c",
    },
    {
      id: "university",
      name: "University bridge",
      short: "Uni bridge",
      blurb: "Function notation, limits stated properly, and the difference between an example and a proof.",
      icon: "fas fa-graduation-cap",
      accent: "#7c3aed",
    },
  ],

  outcomes: [
    "Read a mathematics question and know exactly what it is instructing you to do",
    "Work fluently with number, fractions, ratio and percentage without a calculator",
    "Do algebra as reasoning rather than as remembered moves: expand, factorise, solve, rearrange",
    "Turn a worded problem into a diagram and then into an equation, the single most reported weakness in WAEC scripts",
    "Handle geometry, mensuration, trigonometry, statistics and introductory calculus to SS3 standard",
    "Sit WAEC, NECO and JAMB from one curriculum, with each paper's technique trained separately",
    "Walk into a university mathematics course already fluent in its notation and standards of proof",
    "Earn the Memora Smart Certification in Mathematics by passing the final certification exam",
  ],

  audience: [
    "JSS and SS students who want to stop guessing and start understanding",
    "SS3 and private candidates preparing for WAEC, NECO or JAMB",
    "Students who passed maths on a calendar and know there are gaps underneath",
    "Anyone who was told they are not a mathematics person and was actually missing primary level fluency",
    "School leavers who want to arrive at university mathematics already able to read it",
  ],

  requirements: [
    "A phone, tablet or laptop with an internet connection",
    "Paper and a pen. Written working is part of the method, not an optional extra",
    "A ruler, a protractor and a pair of compasses from Month 5 onwards",
    "A WAEC approved scientific calculator from Month 7 onwards",
    "No prior confidence and no prior grade. Month 1 assumes nothing.",
  ],

  /**
   * MONTHS → MODULES.
   * Four modules a month, one a week, in the order each depends on the last.
   */
  months: [
    /* ═══════════════════════════════════════════════════════════════════
       MONTH 1 · STARTING MATHEMATICS
       ═══════════════════════════════════════════════════════════════════ */
    {
      month: 1,
      title: "Starting Mathematics",
      focus: "Foundations",
      summary:
        "Before any sums. What the subject actually is, why it matters in an ordinary life, why it went wrong for so many people, and how to study it so that it works this time. Then the two things everything else rests on: what the instructions mean, and what kinds of numbers there are.",
      modules: [
        {
          id: "ma-m1-welcome",
          order: 1,
          title: "Starting Mathematics",
          summary:
            "What mathematics actually is, where it lives in an ordinary Nigerian day, the real reasons it feels hard, and the eight rules that decide whether studying it works.",
          atoms: 20,
          topics: [
            "What mathematics is, and what it is not",
            "Why arithmetic is one room in a large house",
            "Mathematics as a language for saying exactly what you mean",
            "Money, time, measurement and judgement in an ordinary day",
            "The trades and careers that quietly run on it",
            "Why gaps compound in this subject and in no other",
            "Procedures without meaning, and what happens when you forget a step",
            "Speed mistaken for ability",
            "Mathematics anxiety, and what it does to working memory",
            "The myth of the mathematics person",
            "The eight rules for learning mathematics",
            "How this course works, and what is expected of you",
          ],
        },
        {
          id: "ma-m1-language",
          order: 2,
          title: "The Language of Mathematics",
          summary:
            "What the question is telling you to do. Evaluate, simplify, solve, express, hence — each one is a specific instruction, and students lose marks answering the wrong one.",
          atoms: 22,
          topics: [
            "Why the wording is not decoration",
            "Evaluate: find the numerical value",
            "Simplify: same value, tidier form",
            "Solve: find the unknown that makes it true",
            "Express and write in the form",
            "Hence, and hence or otherwise",
            "Show that, prove, deduce",
            "Correct to, in its lowest terms, leaving your answer in surd form",
            "Terms, factors, coefficients and expressions",
            "The equals sign, and what it does not mean",
            "Reading a question twice before writing",
          ],
        },
        {
          id: "ma-m1-numbers",
          order: 3,
          title: "What Kinds of Numbers There Are",
          summary:
            "Counting numbers, zero, negatives, fractions and the numbers that cannot be written as a fraction at all. The family tree of number, and why each branch had to be invented.",
          atoms: 20,
          topics: [
            "Counting numbers and natural numbers",
            "Zero, the number that took centuries to accept",
            "Whole numbers",
            "Even and odd",
            "Why negatives had to be invented",
            "Integers and the number line",
            "Fractions as numbers between the whole numbers",
            "Rational numbers, and decimals as a second notation for them",
            "Terminating and recurring decimals",
            "The numbers that are not fractions: root two and pi",
            "Real numbers, and the family tree in one picture",
            "The symbols N, Z, Q and R",
            "Why knowing the kind of number tells you what to expect of the answer",
          ],
        },
        {
          id: "ma-m1-place-value",
          order: 4,
          title: "Place Value and Whole Numbers",
          summary:
            "What a digit is worth depends on where it sits. Everything numerical rests on this, and it is the first thing to go missing.",
          atoms: 20,
          topics: [
            "Digits, numerals and numbers",
            "Place and value",
            "Reading and writing numbers to billions",
            "Ordering and comparing",
            "Rounding to the nearest 10, 100 and 1000",
            "Number lines",
            "Roman numerals and why place value beat them",
          ],
        },
      ],
    },

    /* ═══════════════════════════════════════════════════════════════════
       MONTH 2 · HOW NUMBERS WORK
       ═══════════════════════════════════════════════════════════════════ */
    {
      month: 2,
      title: "How Numbers Work",
      focus: "Number",
      summary:
        "The four operations to fluency, the order they must be done in, the rules they obey, numbers below zero, and how every number is built out of factors. This is the month that decides whether algebra will make sense later.",
      modules: [
        {
          id: "ma-m2-operations",
          order: 5,
          title: "The Four Operations and BODMAS",
          summary:
            "Addition, subtraction, multiplication and division to fluency — then the order they must be done in, and why the order is not a matter of opinion.",
          atoms: 24,
          topics: [
            "Addition and subtraction with regrouping",
            "Times tables to instant recall",
            "Long multiplication",
            "Long division and interpreting a remainder",
            "Word problems: which operation does this need",
            "BODMAS, rank by rank",
            "Why 2 + 3 × 4 is 14 and not 20",
            "Using brackets to say what you mean",
            "Checking an answer by estimating first",
          ],
        },
        {
          id: "ma-m2-properties",
          order: 6,
          title: "How the Operations Behave",
          summary:
            "The rules the four operations obey. These look obvious with numbers, and they are the entire reason algebra is allowed to work at all.",
          atoms: 20,
          topics: [
            "Commutative: when order does not matter, and when it does",
            "Associative: when grouping does not matter",
            "Distributive: multiplying over a bracket",
            "Why the distributive law is expanding and factorising",
            "Identity elements: zero for adding, one for multiplying",
            "Inverse operations, and undoing",
            "Additive and multiplicative inverses",
            "Closure: staying inside a set of numbers",
            "Using the properties to calculate faster in your head",
            "Why these rules are what let letters stand for numbers",
          ],
        },
        {
          id: "ma-m2-negatives",
          order: 7,
          title: "Directed Numbers",
          summary:
            "Negatives as positions and as movements. The sign rules are not arbitrary, they are not to be memorised as rules, and getting them right here prevents a great deal of trouble in algebra.",
          atoms: 20,
          topics: [
            "Negative numbers on the number line",
            "Ordering negatives, and why minus eighteen is less than minus three",
            "Adding a directed number as a movement",
            "Subtracting a directed number",
            "Why subtracting a negative adds",
            "Multiplying and dividing directed numbers",
            "Why two negatives multiply to a positive",
            "The sign rules for adding are not the sign rules for multiplying",
            "Temperature, altitude, debt and bank balances",
            "Brackets around negative values when substituting",
          ],
        },
        {
          id: "ma-m2-factors",
          order: 8,
          title: "Factors, Multiples and Primes",
          summary:
            "How numbers are built. HCF, LCM, prime factorisation, simplifying fractions and later surds all start in this module.",
          atoms: 22,
          topics: [
            "Factors and factor pairs",
            "Multiples",
            "Divisibility rules",
            "Prime numbers, and why 1 is not one",
            "Prime factorisation and index form",
            "Highest common factor",
            "Lowest common multiple",
            "Deciding whether a word problem needs HCF or LCM",
            "Squares, cubes and their roots",
          ],
        },
      ],
    },

    /* ═══════════════════════════════════════════════════════════════════
       MONTH 3 · PARTS OF A WHOLE
       ═══════════════════════════════════════════════════════════════════ */
    {
      month: 3,
      title: "Parts of a Whole",
      focus: "Number",
      summary:
        "One quantity, three notations, and the topic examiners still report as broken in SS3 scripts. Meaning first, then arithmetic, then the commercial maths every adult actually uses.",
      modules: [
        {
          id: "ma-m3-fractions",
          order: 9,
          title: "Fractions",
          summary:
            "A fraction is a number with a position on a line, not a pair of numbers with a bar between them. Get that right and the arithmetic follows.",
          atoms: 24,
          topics: [
            "A fraction as a picture: bar models and number lines",
            "Numerator, denominator and what each one tells you",
            "Equivalent fractions and lowest terms",
            "Comparing and ordering fractions",
            "Adding and subtracting with a common denominator",
            "Multiplying fractions",
            "Dividing by multiplying by the reciprocal, and why that works",
            "Mixed numbers and improper fractions",
            "Fraction of a quantity",
            "Word problems with bar models",
          ],
        },
        {
          id: "ma-m3-decimals",
          order: 10,
          title: "Decimals and Money",
          summary:
            "Place value carried to the right of the point, then applied to naira and kobo — the numbers students handle every day and still lose marks on.",
          atoms: 20,
          topics: [
            "Decimal place value to thousandths",
            "Reading decimals correctly (0.8 is bigger than 0.75)",
            "Adding and subtracting by lining up the point",
            "Multiplying and dividing decimals",
            "Converting fractions to decimals and back",
            "Recurring decimals",
            "Naira and kobo, cost and change",
          ],
        },
        {
          id: "ma-m3-percentages",
          order: 11,
          title: "Percentages",
          summary:
            "Per cent means per hundred. Everything in this module is that one sentence applied carefully, including the commercial arithmetic WAEC keeps flagging.",
          atoms: 22,
          topics: [
            "Percentage as a fraction over a hundred",
            "Converting between fractions, decimals and percentages",
            "Percentage of a quantity",
            "Expressing one quantity as a percentage of another",
            "Percentage increase and decrease",
            "Profit, loss and discount",
            "Simple interest",
            "Percentage error",
          ],
        },
        {
          id: "ma-m3-approximation",
          order: 12,
          title: "Approximation and Degree of Accuracy",
          summary:
            "Rounding, significant figures, estimation, and the habit of knowing roughly what the answer should be before you calculate it.",
          atoms: 18,
          topics: [
            "Rounding to decimal places",
            "Significant figures, including leading zeros",
            "Why premature rounding costs marks",
            "Estimating by rounding to one significant figure",
            "Upper and lower bounds",
            "Reading the accuracy a question demands",
          ],
        },
      ],
    },

    /* ═══════════════════════════════════════════════════════════════════
       MONTH 4 · RELATIONSHIPS AND FIRST ALGEBRA
       ═══════════════════════════════════════════════════════════════════ */
    {
      month: 4,
      title: "Relationships and First Algebra",
      focus: "Algebra",
      summary:
        "Comparing quantities, measuring them, working with numbers below zero — and then the moment a letter starts standing for a number. Everything algebraic in the next five months starts here.",
      modules: [
        {
          id: "ma-m4-ratio",
          order: 13,
          title: "Ratio, Rate and Proportion",
          summary:
            "Comparing two quantities, and what happens to one when the other changes.",
          atoms: 20,
          topics: [
            "Ratio notation and simplifying",
            "Sharing a quantity in a given ratio",
            "The unitary method",
            "Direct proportion",
            "Inverse proportion",
            "Rates: speed, distance and time",
            "Scale and scale drawing",
          ],
        },
        {
          id: "ma-m4-measurement",
          order: 14,
          title: "Measurement, Perimeter and Area",
          summary:
            "Units and instruments, then the two measurements every mensuration question in the course is built from. Unit slips are named in the examiners' reports every year.",
          atoms: 22,
          topics: [
            "Metric units and converting between them",
            "Which way the number moves, and why",
            "Reading rulers, scales and clocks",
            "Time, timetables and elapsed time",
            "Perimeter of rectangles and compound shapes",
            "Area of rectangles, triangles, parallelograms and trapeziums",
            "Area of compound shapes",
            "Units squared, and the marks lost for omitting them",
          ],
        },
        {
          id: "ma-m4-patterns",
          order: 15,
          title: "Number Patterns and Sequences",
          summary:
            "Spotting a rule in a run of numbers and writing it down. The first real act of generalisation, and the thing algebra is for.",
          atoms: 20,
          topics: [
            "Describing a pattern in words",
            "Continuing a sequence, and justifying the next term",
            "Term to term rules",
            "Position to term rules, and why they are more useful",
            "Finding the nth term of a linear sequence",
            "Square, cube and triangular number sequences",
            "Patterns made of shapes, and counting them",
            "Where a pattern is a formula waiting to be written",
            "Checking a rule against a term you did not use to build it",
          ],
        },
        {
          id: "ma-m4-algebra1",
          order: 16,
          title: "Algebraic Expressions and Simple Equations",
          summary:
            "A letter is a number you do not know yet. Terms, substitution, and the balance method that solves every linear equation there is.",
          atoms: 24,
          topics: [
            "Using a letter for an unknown",
            "Terms, coefficients and constants",
            "Collecting like terms",
            "Substitution, including negative values",
            "Writing an expression from a worded statement",
            "The balance method",
            "One-step and two-step equations",
            "Checking a solution by substituting back",
            "Forming an equation from a word problem",
          ],
        },
      ],
    },

    /* ═══════════════════════════════════════════════════════════════════
       MONTH 5 · POWERS, MONEY, GRAPHS AND SHAPE
       ═══════════════════════════════════════════════════════════════════ */
    {
      month: 5,
      title: "Powers, Money, Graphs and Shape",
      focus: "Number & Geometry",
      summary:
        "Indices and standard form, the commercial arithmetic of adult life, the Cartesian plane, and the angle rules every later geometry topic depends on.",
      modules: [
        {
          id: "ma-m5-indices",
          order: 17,
          title: "Indices and Standard Form",
          summary:
            "Powers as shorthand, the laws that follow from what a power means, and the notation science uses for the very large and the very small.",
          atoms: 20,
          topics: [
            "What an index means",
            "The laws of indices, derived rather than memorised",
            "Zero and negative indices",
            "Fractional indices and roots",
            "Standard form, large and small",
            "Calculating in standard form",
          ],
        },
        {
          id: "ma-m5-commercial",
          order: 18,
          title: "Commercial Arithmetic",
          summary:
            "Interest, tax, hire purchase and exchange rates. Named in the Chief Examiners' weakness lists more often than almost any other topic at this level.",
          atoms: 22,
          topics: [
            "Simple interest and rearranging the formula",
            "Compound interest year by year",
            "Compound interest by formula",
            "Depreciation",
            "VAT and income tax",
            "Hire purchase",
            "Foreign exchange",
            "Commission, discount and sales tax",
          ],
        },
        {
          id: "ma-m5-graphs",
          order: 19,
          title: "The Cartesian Plane and Linear Graphs",
          summary:
            "Plotting, tables of values, straight lines and reading a real situation off a graph. Graph questions are lost on the drawing, not on the algebra.",
          atoms: 22,
          topics: [
            "Coordinates in all four quadrants",
            "Choosing and labelling a scale",
            "Tables of values",
            "Drawing a straight-line graph",
            "Gradient and intercept",
            "y = mx + c",
            "Distance-time and conversion graphs",
            "Reading values off a graph honestly",
          ],
        },
        {
          id: "ma-m5-angles",
          order: 20,
          title: "Angles, Polygons and Construction",
          summary:
            "Measuring, drawing and the angle rules that let you chase a missing angle across a diagram — then ruler-and-compass construction, where the arcs are part of the answer.",
          atoms: 24,
          topics: [
            "Types of angle",
            "Measuring and drawing with a protractor",
            "Angles on a line, at a point, vertically opposite",
            "Parallel lines: alternate, corresponding, co-interior",
            "Angle sum of a triangle and the exterior angle",
            "Interior and exterior angles of polygons",
            "Bisecting a line and an angle",
            "Constructing 90°, 60°, 45°, 30°",
            "Constructing triangles from given data",
            "Bearings and bearings diagrams",
          ],
        },
      ],
    },

    /* ═══════════════════════════════════════════════════════════════════
       MONTH 6 · ALGEBRA POWER
       ═══════════════════════════════════════════════════════════════════ */
    {
      month: 6,
      title: "Algebra Power and BECE Readiness",
      focus: "Algebra",
      summary:
        "Expansion, factorisation and simultaneous equations — the skills almost every senior topic reduces to at some point. Ends with a full BECE-style mock.",
      modules: [
        {
          id: "ma-m6-expansion",
          order: 21,
          title: "Expansion and Factorisation",
          summary:
            "Brackets in both directions. Factorising is the single most reused algebra skill in the senior syllabus.",
          atoms: 24,
          topics: [
            "Expanding single brackets",
            "Expanding double brackets",
            "Common factors",
            "Factorising by grouping",
            "Difference of two squares",
            "Quadratic trinomials",
            "Trinomials where the leading coefficient is not 1",
            "Simplifying algebraic fractions by factorising",
          ],
        },
        {
          id: "ma-m6-equations",
          order: 22,
          title: "Linear and Simultaneous Equations",
          summary:
            "Equations with brackets and fractions, two unknowns, three methods, and the judgement about which method a given pair invites.",
          atoms: 22,
          topics: [
            "Equations with brackets",
            "Equations with fractions",
            "Elimination",
            "Substitution",
            "Graphical solution",
            "Forming simultaneous equations from a word problem",
            "Checking both equations, not just one",
          ],
        },
        {
          id: "ma-m6-inequalities",
          order: 23,
          title: "Inequalities, Formulae and Variation",
          summary:
            "Solving like an equation with one rule that is different, rearranging when the letter you want is trapped, and quantities that depend on each other.",
          atoms: 22,
          topics: [
            "Inequality notation",
            "Solving linear inequalities",
            "The rule everyone forgets: multiplying by a negative",
            "Showing solutions on a number line",
            "Changing the subject of a formula",
            "Subjects trapped under powers and roots",
            "Direct, inverse, joint and partial variation",
            "Finding the constant first, every time",
          ],
        },
        {
          id: "ma-m6-bece",
          order: 24,
          type: "project",
          title: "Number Bases and BECE Mock",
          summary:
            "Counting in bases other than ten, then a full junior-certificate mock under exam conditions with the recovery loop attached.",
          atoms: 20,
          topics: [
            "Why base ten is a choice",
            "Counting and converting in base 2",
            "Converting between any bases",
            "Arithmetic in a given base",
            "Finding an unknown base",
            "Full BECE-style mock, objective and theory",
            "Reading your own mock as a list of atoms",
          ],
        },
      ],
    },

    /* ═══════════════════════════════════════════════════════════════════
       MONTH 7 · THE SENIOR NUMBER SYSTEM
       ═══════════════════════════════════════════════════════════════════ */
    {
      month: 7,
      title: "The Senior Number System",
      focus: "Number & Algebra",
      summary:
        "The heaviest-weighted strand on the senior papers, almost completely: modular arithmetic, logarithms, surds, sets, logic — and the quadratic in all four of its forms.",
      modules: [
        {
          id: "ma-m7-modular",
          order: 25,
          title: "Modular Arithmetic and Number Theory",
          summary:
            "Clock arithmetic. A WAEC and NECO topic that rewards understanding and punishes memorisation.",
          atoms: 18,
          topics: [
            "Remainders and congruence",
            "Adding and subtracting modulo n",
            "Multiplying modulo n",
            "Multiplication tables modulo n",
            "Solving simple modular equations",
            "Days of the week and repeating cycles",
          ],
        },
        {
          id: "ma-m7-logs-surds",
          order: 26,
          title: "Logarithms and Surds",
          summary:
            "A logarithm is an index question asked backwards. A surd is an exact irrational kept exact. Both are taught from what they mean, not as rule sheets.",
          atoms: 24,
          topics: [
            "Indices and logarithms as the same statement",
            "The laws of logarithms",
            "Four-figure log and antilog tables",
            "Change of base",
            "Solving logarithmic equations",
            "Simplifying surds",
            "Adding, subtracting and multiplying surds",
            "Rationalising a denominator, including with a conjugate",
          ],
        },
        {
          id: "ma-m7-sets-logic",
          order: 27,
          title: "Sets and Logical Reasoning",
          summary:
            "Notation, the operations, the Venn diagram that turns a worded problem into arithmetic — and the logic topic WAEC and NECO examine and JAMB does not.",
          atoms: 22,
          topics: [
            "Set notation and types of set",
            "Union, intersection and complement",
            "Two-set Venn problems",
            "Three-set Venn problems, centre first",
            "Statements and truth values",
            "Negation, including with quantifiers",
            "Implication, converse, inverse, contrapositive",
            "Testing an argument for validity",
          ],
        },
        {
          id: "ma-m7-quadratics",
          order: 28,
          title: "Quadratic Equations and Graphs",
          summary:
            "Four routes to the same roots, the two facts about roots that make the hardest questions quick, and the parabola drawn to the standard the mark scheme expects.",
          atoms: 26,
          topics: [
            "Solving by factorising",
            "Completing the square",
            "The quadratic formula",
            "The discriminant and the nature of the roots",
            "Forming an equation from given roots",
            "Sum and product of roots",
            "Drawing a quadratic graph",
            "Reading roots, maximum and minimum",
            "Line and curve intersections",
            "Tangent and gradient at a point",
          ],
        },
      ],
    },

    /* ═══════════════════════════════════════════════════════════════════
       MONTH 8 · SHAPE, ANGLE AND DATA
       ═══════════════════════════════════════════════════════════════════ */
    {
      month: 8,
      title: "Shape, Angle and Data",
      focus: "Geometry, Trigonometry & Statistics",
      summary:
        "Most of Paper 2 Section B: mensuration, circle theorems, coordinate geometry, trigonometry, bearings, cumulative frequency and probability. Every module carries a diagram-drawing lesson of its own.",
      modules: [
        {
          id: "ma-m8-mensuration",
          order: 29,
          title: "Mensuration and Similar Figures",
          summary:
            "Circles, prisms, cones, frustums and composite solids — and what a scale factor does to an area and to a volume.",
          atoms: 26,
          topics: [
            "Circumference and area of a circle",
            "Arc length, sector and segment",
            "Surface area and volume of prisms and cylinders",
            "Cones, pyramids and slant height",
            "Spheres and hemispheres",
            "Frustums and composite solids",
            "Similar shapes and scale factor",
            "Areas and volumes of similar figures",
            "Capacity in litres",
          ],
        },
        {
          id: "ma-m8-circle-coord",
          order: 30,
          title: "Circle Theorems and Coordinate Geometry",
          summary:
            "Eight circle theorems, each on its own, because a student who knows seven will fail the question that needs the eighth. Then algebra applied to the plane.",
          atoms: 26,
          topics: [
            "Chord and perpendicular from the centre",
            "Angle at the centre is twice the angle at the circumference",
            "Angle in a semicircle",
            "Angles in the same segment",
            "Cyclic quadrilaterals",
            "Tangent and radius, and equal tangents",
            "Alternate segment theorem",
            "Intersecting chords",
            "Distance, midpoint and gradient",
            "Equation of a straight line",
            "Parallel and perpendicular lines",
          ],
        },
        {
          id: "ma-m8-trig",
          order: 31,
          title: "Trigonometry and Bearings",
          summary:
            "The right-angled triangle completely, then the ratios freed from it, then the bearings problems that are triangle problems in disguise.",
          atoms: 26,
          topics: [
            "Pythagoras' theorem",
            "Sine, cosine and tangent defined",
            "Finding sides and angles",
            "Angles of elevation and depression",
            "Exact values for 30°, 45° and 60°",
            "Ratios from 0° to 360° and the sign of each",
            "Graphs of sine and cosine",
            "The sine rule and the ambiguous case",
            "The cosine rule",
            "Area of a triangle with ½ab sin C",
            "Bearings and distance problems",
          ],
        },
        {
          id: "ma-m8-stats",
          order: 32,
          title: "Statistics and Probability",
          summary:
            "Collecting, drawing, averaging and spreading data — then chance, from a single event to tree diagrams and 'at least'.",
          atoms: 26,
          topics: [
            "Frequency tables and grouped data",
            "Bar charts, pie charts and histograms",
            "Mean, median and mode, and choosing between them",
            "Mean of grouped data and the assumed mean",
            "Cumulative frequency tables",
            "Drawing an ogive and reading quartiles",
            "Range, mean deviation, variance and standard deviation",
            "Probability of a single event",
            "Addition and multiplication rules",
            "With and without replacement",
            "Tree diagrams, 'at least' and 'at most'",
          ],
        },
      ],
    },

    /* ═══════════════════════════════════════════════════════════════════
       MONTH 9 · SS3, THE EXAM, AND WHAT COMES AFTER
       ═══════════════════════════════════════════════════════════════════ */
    {
      month: 9,
      title: "Finishing the Syllabus, the Exam, and University",
      focus: "Calculus & Exam Mastery",
      summary:
        "The last of the syllabus, then two things school does not teach: exam technique as a skill in its own right, and the notation, rigour and habits of proof that a 100-level mathematics course opens with.",
      modules: [
        {
          id: "ma-m9-calculus",
          order: 33,
          title: "Sequences, Matrices, Vectors and Calculus",
          summary:
            "The remaining SS3 content: progressions, matrices, vectors, transformations, and the differentiation and integration both WAEC and JAMB examine.",
          atoms: 28,
          topics: [
            "Arithmetic progressions and their sums",
            "Geometric progressions and sum to infinity",
            "Matrices, determinants and inverses",
            "Solving simultaneous equations with matrices",
            "Vectors in component form and position vectors",
            "Reflection, rotation, translation and enlargement",
            "Describing a transformation fully",
            "Limits and the gradient of a curve",
            "Differentiation from first principles and the power rule",
            "Rates of change, maxima and minima",
            "Integration and the area under a curve",
          ],
        },
        {
          id: "ma-m9-advanced",
          order: 34,
          title: "Advanced and Exam-Specific Topics",
          summary:
            "The topics that appear on one paper and not another, marked so a candidate sitting only UTME or only WAEC can see what applies to them.",
          atoms: 22,
          topics: [
            "Binary operations and their properties (JAMB)",
            "Identity and inverse elements (JAMB)",
            "Polynomials, factor and remainder theorems (JAMB)",
            "Permutations and combinations (JAMB)",
            "Differentiating and integrating trigonometric functions (JAMB)",
            "Latitude, longitude and the Earth as a sphere",
            "Financial arithmetic: annuities, shares and bonds (WAEC/NECO)",
            "Loci and their intersections",
          ],
        },
        {
          id: "ma-m9-exam",
          order: 35,
          type: "project",
          title: "Exam Mastery — WAEC, NECO and JAMB",
          summary:
            "Technique as a taught skill. Translating word problems, answering objectives at speed, writing Paper 2 working that earns method marks, and full timed mocks with a recovery loop.",
          atoms: 24,
          topics: [
            "Reading a word problem: key words, diagram, equation",
            "The translation lab: setting up before solving",
            "Objective speed drills and elimination",
            "Computer-based testing and on-screen rough work",
            "Paper 2 technique: showing working that earns method marks",
            "Units, accuracy and labelling",
            "Choosing which Section B questions to answer",
            "Full timed WAEC and NECO mocks",
            "Full timed JAMB CBT mocks",
            "Turning a mock result into a list of weak atoms",
          ],
        },
        {
          id: "ma-m9-bridge",
          order: 36,
          type: "capstone",
          title: "The University Bridge",
          summary:
            "What a 100-level lecturer assumes on day one and secondary school never said. Notation, definitions, limits stated properly, and the difference between an example and a proof.",
          atoms: 24,
          topics: [
            "Sets, notation and quantifiers as a university writes them",
            "Functions: domain, codomain, range, injective and surjective",
            "Composite and inverse functions",
            "Why a counterexample disproves and an example does not prove",
            "Direct proof, proof by contradiction, proof by induction",
            "Limits, stated properly rather than by intuition",
            "Continuity and differentiability, informally but honestly",
            "Sigma notation and series",
            "Radians, and why calculus abandons degrees",
            "Reading a university textbook and a lecture slide",
            "What MTH 101 actually opens with",
          ],
        },
      ],
    },
  ],

  capstone: {
    title: "The University Bridge",
    summary:
      "The final module is the capstone, and it is deliberately not another mock. Anyone can finish a secondary syllabus and still be unable to read a university lecture slide. This one puts you in front of the notation, the definitions and the standards of proof a 100-level mathematics course opens with, so the first week of university is revision rather than a shock.",
    deliverables: [
      "A written proof of a simple statement, by each of the three methods",
      "A worked set of function problems in full university notation",
      "A limit evaluated and justified, not guessed from a table",
      "A reflective note on the three atoms you found hardest and why",
    ],
  },

  certificate: {
    issuer: "Memora Smart Technologies",
    name: "Mathematics — Elementary to University-Ready",
    covers: "WAEC • NECO • JAMB • University bridge",
    idFormat: "MST-CERT-2026-000001",
    requirements: [
      "Complete every required lesson",
      "Pass every required assessment at 70% or above",
      "Complete the BECE-style and WAEC-style mocks",
      "Pass the final certification exam at 70% overall, with at least 50% in every domain",
    ],
  },
};

/** Rules the assessment + progression engine enforces. Same as every course. */
export const ASSESSMENT_RULES = {
  defaultPassMark: 70,
  questionsPerLesson: [4, 6],
  attemptLimit: null, // null = unlimited retries
  lockNextLessonUntilPassed: true,
};

export default MATHEMATICS_COURSE;
