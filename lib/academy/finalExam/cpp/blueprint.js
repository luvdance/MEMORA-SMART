/**
 * FINAL CERTIFICATION EXAM — C++ PROGRAMMING
 *
 * The test specification, in the same shape as the other blueprints, so the
 * assembler and grader treat every exam identically: the SHAPE of every paper
 * is fixed here, the CONTENT is drawn per candidate from ./bank.js.
 *
 * Five domains, one per phase of the course. Every `predict` item is
 * COMPILED AND RUN with g++ by `npm run validate:content`, and its stated
 * output compared with what the program really prints, the same discipline
 * the lessons are held to.
 */

export const DOMAINS = [
  {
    id: "c1-foundations",
    name: "Programming foundations",
    short: "Foundations",
    items: { core: 4, advanced: 2 },
    covers: [
      "How C++ becomes a program; syntax and errors",
      "Types, variables, constants, cin and cout",
      "Operators, precedence, conversion and integer division",
      "Conditions, switch, loops, break and continue",
    ],
    review: ["cp-m1-intro", "cp-m2-variables", "cp-m3-operators", "cp-m4-control"],
  },
  {
    id: "c2-core",
    name: "Functions, collections and text",
    short: "Core skills",
    items: { core: 4, advanced: 2 },
    covers: [
      "Functions, parameters, return values, scope and overloading",
      "Pass-by-value and pass-by-reference; recursion",
      "Arrays, 2D arrays and vector",
      "string, getline and the input buffer",
    ],
    review: ["cp-m5-functions", "cp-m6-arrays", "cp-m7-strings"],
  },
  {
    id: "c3-objects",
    name: "Memory and object-oriented programming",
    short: "Memory & OOP",
    items: { core: 4, advanced: 2 },
    covers: [
      "Addresses, pointers, references and nullptr",
      "The stack, the heap, new, delete and memory bugs",
      "Classes, encapsulation, constructors, this and static",
      "Inheritance, virtual functions, abstract classes and composition",
    ],
    review: ["cp-m8-pointers", "cp-m9-classes", "cp-m10-inheritance"],
  },
  {
    id: "c4-tools",
    name: "Exceptions, files, the STL and algorithms",
    short: "Advanced tools",
    items: { core: 4, advanced: 2 },
    covers: [
      "Validation, exceptions and the standard exception classes",
      "File streams, appending, records and CSV",
      "Templates, containers, iterators, algorithms and lambdas",
      "Big O, searching, sorting, linked structures and hashing",
    ],
    review: ["cp-m11-exceptions-files", "cp-m12-templates-stl", "cp-m13-dsa"],
  },
  {
    id: "c5-professional",
    name: "Modern C++ and professional practice",
    short: "Professional",
    items: { core: 4, advanced: 2 },
    covers: [
      "auto, const correctness, move semantics and smart pointers",
      "RAII, copy and move operations, optional and string_view",
      "Debugging, test design, assertions and project structure",
      "CMake, Git, refactoring and secure coding",
    ],
    review: ["cp-m14-modern", "cp-m15-debugging", "cp-m16-capstone"],
  },
];

export const BLUEPRINT = {
  id: "mst-cp-final",
  version: "2026.1",
  courseId: "cpp",
  courseCode: "CP-101",
  courseTitle: "C++ Programming",
  title: "Memora Smart Certification — C++ Programming",
  subtitle: "Foundations · Core skills · Memory & OOP · Advanced tools · Professional practice",
  /** What the briefing page says about the kinds of question on the paper. */
  briefingNote:
    "Some questions show you a short C++ program and ask exactly what it prints: every one of them has been compiled with g++ and run, so the expected output is what C++ really does. The rest test reasoning: memory, design, debugging, testing and security decisions.",

  requiresModules: [
    "cp-m1-intro",
    "cp-m2-variables",
    "cp-m3-operators",
    "cp-m4-control",
    "cp-m5-functions",
    "cp-m6-arrays",
    "cp-m7-strings",
    "cp-m8-pointers",
    "cp-m9-classes",
    "cp-m10-inheritance",
    "cp-m11-exceptions-files",
    "cp-m12-templates-stl",
    "cp-m13-dsa",
    "cp-m14-modern",
    "cp-m15-debugging",
    "cp-m16-capstone",
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
    name: "C++ Programming",
    covers: "Foundations • Functions, arrays & strings • Memory & OOP • STL & algorithms • Modern C++ & testing",
    idFormat: "MST-CERT-2026-000001",
  },
};

export default BLUEPRINT;
