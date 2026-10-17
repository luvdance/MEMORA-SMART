/**
 * FINAL CERTIFICATION EXAM — OBJECT ORIENTED PROGRAMMING (JAVASCRIPT)
 *
 * The test specification, in the same shape as the Data Analysis blueprint
 * (../blueprint.js), so the assembler and grader treat both identically: the
 * SHAPE of every paper is fixed here, the CONTENT is drawn per candidate.
 *
 * Five domains follow the course's own arc, logic first. Every `predict` item
 * in the bank is RUN in Node by `npm run validate:content` and its stated
 * output compared with what Node actually prints, the same discipline the
 * lessons are held to.
 */

export const DOMAINS = [
  {
    id: "j1-logic",
    name: "Programming logic and problem solving",
    short: "Logic",
    items: { core: 4, advanced: 2 },
    covers: [
      "Algorithms, pseudocode and flowcharts",
      "Sequence, selection and iteration",
      "Dry-run tables and boundary cases",
      "Decomposition and debugging strategy",
    ],
    review: ["js-w1-foundations", "js-w2-logic"],
  },
  {
    id: "j2-language",
    name: "JavaScript fundamentals",
    short: "Fundamentals",
    items: { core: 4, advanced: 2 },
    covers: [
      "Variables, types and type coercion",
      "Operators, equality and truthiness",
      "Conditions, loops and control flow",
      "Strings and numbers",
    ],
    review: ["js-w3-intro", "js-w4-types", "js-w5-control"],
  },
  {
    id: "j3-functions-data",
    name: "Functions, scope and data structures",
    short: "Functions & data",
    items: { core: 4, advanced: 2 },
    covers: [
      "Functions, parameters, return values and arrow functions",
      "Arrays and map, filter, reduce",
      "Scope, hoisting and closures",
      "References versus copies, Sets and Maps",
    ],
    review: ["js-w6-functions", "js-w7-arrays-strings", "js-w8-objects", "js-w9-scope-debugging"],
  },
  {
    id: "j4-oop",
    name: "Objects, classes and object-oriented design",
    short: "OOP",
    items: { core: 4, advanced: 2 },
    covers: [
      "Objects, methods and this",
      "Classes, constructors and instances",
      "Prototypes and inheritance",
      "Encapsulation and private fields",
    ],
    review: ["js-w8-objects", "js-w13-advanced"],
  },
  {
    id: "j5-browser-react",
    name: "The browser, asynchronous code and React",
    short: "Browser & React",
    items: { core: 4, advanced: 2 },
    covers: [
      "The DOM, events and storage",
      "Promises, async/await and the event loop",
      "fetch and API error states",
      "Git, modules and React components, props and state",
    ],
    review: ["js-w10-dom", "js-w11-events-storage", "js-w12-apis", "js-w14-tooling", "js-w15-react"],
  },
];

export const BLUEPRINT = {
  id: "mst-js-final",
  version: "2026.1",
  courseId: "javascript",
  courseCode: "JS-101",
  courseTitle: "Object Oriented Programming (JavaScript)",
  title: "Memora Smart Certification — Object Oriented Programming (JavaScript)",
  subtitle: "Logic · JavaScript · OOP · Browser & React",
  /** What the briefing page says about the kinds of question on the paper. */
  briefingNote:
    "Some questions show you a short JavaScript program and ask exactly what it prints: every one of them has been run in Node, so the expected output is what JavaScript really does. The rest test reasoning: logic, design and debugging decisions.",

  requiresModules: [
    "js-w1-foundations",
    "js-w2-logic",
    "js-w3-intro",
    "js-w4-types",
    "js-w5-control",
    "js-w6-functions",
    "js-w7-arrays-strings",
    "js-w8-objects",
    "js-w9-scope-debugging",
    "js-w10-dom",
    "js-w11-events-storage",
    "js-w12-apis",
    "js-w13-advanced",
    "js-w14-tooling",
    "js-w15-react",
    "js-w16-capstone",
  ],

  domains: DOMAINS,
  passMark: 70,
  domainMinimum: 50,
  durationMinutes: 75,
  attemptLimit: null,
  /** No company case studies on this paper: each question stands alone. */
  caseRange: { min: 0, max: 0 },

  certificate: {
    issuer: "Memora Smart Technologies",
    name: "Object Oriented Programming (JavaScript)",
    covers: "Programming logic • JavaScript • Browser & APIs • OOP • React",
    idFormat: "MST-CERT-2026-000001",
  },
};

export default BLUEPRINT;
