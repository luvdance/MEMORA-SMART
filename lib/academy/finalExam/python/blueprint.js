/**
 * FINAL CERTIFICATION EXAM — PYTHON PROGRAMMING
 *
 * The test specification, in the same shape as the other blueprints, so the
 * assembler and grader treat every exam identically: the SHAPE of every paper
 * is fixed here, the CONTENT is drawn per candidate from ./bank.js.
 *
 * Five domains follow the course's four phases, with the large final phase
 * split in two. Every `predict` item is RUN in CPython by
 * `npm run validate:content` and its stated output compared with what Python
 * actually prints, the same discipline the lessons are held to.
 */

export const DOMAINS = [
  {
    id: "p1-foundations",
    name: "Programming foundations",
    short: "Foundations",
    items: { core: 4, advanced: 2 },
    covers: [
      "Algorithms, pseudocode and flowcharts",
      "Syntax, print() and input()",
      "Variables, types and conversion",
      "Operators, precedence and truthiness",
    ],
    review: ["pp-m1-foundations", "pp-m2-syntax-io", "pp-m3-variables", "pp-m4-operators", "pp-a1-score-calculator"],
  },
  {
    id: "p2-control",
    name: "Control flow and functions",
    short: "Control & functions",
    items: { core: 4, advanced: 2 },
    covers: [
      "if, elif, else and boundaries",
      "while and for loops, range(), break and continue",
      "Functions, parameters, return values and scope",
      "Default and keyword arguments, recursion",
    ],
    review: ["pp-m5-conditions", "pp-m6-loops", "pp-m7-functions"],
  },
  {
    id: "p3-data",
    name: "Strings, collections and iteration",
    short: "Data",
    items: { core: 4, advanced: 2 },
    covers: [
      "Indexing, slicing and string methods",
      "Lists, tuples, sets and dictionaries",
      "Mutability, aliasing and copying",
      "Comprehensions, enumerate, zip and sorting by key",
    ],
    review: ["pp-m8-strings", "pp-m9-collections", "pp-m10-iteration", "pp-a2-student-system"],
  },
  {
    id: "p4-software",
    name: "Files, errors, objects and modules",
    short: "Software",
    items: { core: 4, advanced: 2 },
    covers: [
      "Files, CSV, JSON and pathlib",
      "Exceptions, raising and handling errors",
      "Classes, inheritance, properties and dataclasses",
      "Modules, packages, virtual environments and Git",
    ],
    review: ["pp-m11-files", "pp-m12-exceptions", "pp-m13-oop", "pp-m14-modules", "pp-m15-practices", "pp-a3-finance-tracker"],
  },
  {
    id: "p5-engineering",
    name: "Algorithms, testing, data and services",
    short: "Engineering",
    items: { core: 4, advanced: 2 },
    covers: [
      "Searching, sorting, data structures and Big-O",
      "Unit tests, mocking and type hints",
      "SQL, sqlite3 and parameterised queries",
      "HTTP, APIs, automation and security",
    ],
    review: ["pp-m16-dsa", "pp-m17-testing", "pp-m18-databases", "pp-m19-apis", "pp-m20-automation"],
  },
];

export const BLUEPRINT = {
  id: "mst-py-final",
  version: "2026.1",
  courseId: "python",
  courseCode: "PY-101",
  courseTitle: "Python Programming",
  title: "Memora Smart Certification — Python Programming",
  subtitle: "Foundations · Control · Data · Software · Engineering",
  /** What the briefing page says about the kinds of question on the paper. */
  briefingNote:
    "Some questions show you a short Python program and ask exactly what it prints: every one of them has been run in Python, so the expected output is what Python really does. The rest test reasoning: design, debugging, testing and security decisions.",

  requiresModules: [
    "pp-m1-foundations",
    "pp-m2-syntax-io",
    "pp-m3-variables",
    "pp-m4-operators",
    "pp-a1-score-calculator",
    "pp-m5-conditions",
    "pp-m6-loops",
    "pp-m7-functions",
    "pp-m8-strings",
    "pp-m9-collections",
    "pp-m10-iteration",
    "pp-a2-student-system",
    "pp-m11-files",
    "pp-m12-exceptions",
    "pp-m13-oop",
    "pp-m14-modules",
    "pp-m15-practices",
    "pp-a3-finance-tracker",
    "pp-m16-dsa",
    "pp-m17-testing",
    "pp-m18-databases",
    "pp-m19-apis",
    "pp-m20-automation",
  ],

  domains: DOMAINS,
  passMark: 70,
  domainMinimum: 50,
  durationMinutes: 75,
  attemptLimit: null,
  /** No case studies on this paper: each question stands alone. */
  caseRange: { min: 0, max: 0 },

  certificate: {
    issuer: "Memora Smart Technologies",
    name: "Python Programming",
    covers: "Programming foundations • Core Python • Files, errors & OOP • Testing, SQL & APIs • Automation",
    idFormat: "MST-CERT-2026-000001",
  },
};

export default BLUEPRINT;
