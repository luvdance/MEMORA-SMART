/**
 * FINAL CERTIFICATION EXAM — DESIGN AND ANALYSIS OF ALGORITHMS
 *
 * The test specification, in the same shape as the other blueprints, so the
 * assembler and grader treat every exam identically: the SHAPE of every paper
 * is fixed here, the CONTENT is drawn per candidate from ./bank.js.
 *
 * Six domains follow the course's eight phases (the applied Phase 8 is
 * folded into the last domain). Every `predict` item is RUN in CPython by
 * `npm run validate:content` and its stated output compared with what Python
 * actually prints, the same discipline the lessons are held to.
 */

export const DOMAINS = [
  {
    id: "a1-foundations",
    name: "Algorithm foundations and representation",
    short: "Foundations",
    items: { core: 4, advanced: 1 },
    covers: [
      "Characteristics of algorithms and computational thinking",
      "Pseudocode, flowcharts and dry runs",
      "Correctness, logical errors and loop invariants",
      "Best, average and worst cases; empirical analysis",
    ],
    review: ["al-m1-intro", "al-m2-representation", "al-m3-analysis"],
  },
  {
    id: "a2-asymptotic",
    name: "Asymptotic analysis and complexity classes",
    short: "Asymptotics",
    items: { core: 4, advanced: 1 },
    covers: [
      "Deriving time complexity from loops and code",
      "Big O, Big Omega, Big Theta, little o and omega",
      "Proving bounds with witnesses",
      "Comparing growth rates and scalability",
    ],
    review: ["al-m4-time-complexity", "al-m5-notation", "al-m6-classes"],
  },
  {
    id: "a3-structures",
    name: "Space complexity and data structures",
    short: "Structures",
    items: { core: 4, advanced: 1 },
    covers: [
      "Auxiliary space, recursion stacks and in-place algorithms",
      "Arrays, linked lists, stacks and queues",
      "Hash tables, trees, heaps and graphs",
      "Choosing a structure by operation costs",
    ],
    review: ["al-m7-space", "al-m8-data-structures"],
  },
  {
    id: "a4-search-sort",
    name: "Searching and sorting",
    short: "Search & sort",
    items: { core: 4, advanced: 1 },
    covers: [
      "Linear, binary, jump, interpolation and exponential search",
      "Simple sorts, merge sort and quick sort",
      "Heap, counting and radix sort",
      "Stability, in-place sorting and case analysis",
    ],
    review: ["al-m9-searching", "al-m10-sorting"],
  },
  {
    id: "a5-techniques",
    name: "Recursion, divide and conquer, and greedy algorithms",
    short: "Techniques",
    items: { core: 4, advanced: 1 },
    covers: [
      "Recursion, the call stack and recurrence relations",
      "Divide and conquer and the Master Theorem",
      "Greedy algorithms, Huffman coding and minimum spanning trees",
      "When greedy fails, and proving it correct",
    ],
    review: ["al-m11-recursion", "al-m12-divide-conquer", "al-m13-greedy"],
  },
  {
    id: "a6-advanced",
    name: "Dynamic programming, graphs and complexity theory",
    short: "Advanced",
    items: { core: 4, advanced: 1 },
    covers: [
      "Memoization, tabulation and classic DP problems",
      "BFS, DFS, shortest paths and topological sorting",
      "Amortized analysis and optimisation",
      "P, NP, NP-completeness, approximation and real-world applications",
    ],
    review: ["al-m14-dynamic-programming", "al-m15-graphs", "al-m16-complexity", "al-m17-applications", "al-m18-capstone"],
  },
];

export const BLUEPRINT = {
  id: "mst-al-final",
  version: "2026.1",
  courseId: "algorithms",
  courseCode: "AL-101",
  courseTitle: "Design and Analysis of Algorithms",
  title: "Memora Smart Certification — Design and Analysis of Algorithms",
  subtitle: "Foundations · Asymptotics · Structures · Search & sort · Techniques · Advanced",
  /** What the briefing page says about the kinds of question on the paper. */
  briefingNote:
    "Some questions show a short Python program and ask exactly what it prints, usually an operation count or a trace: every one has been run in Python, so the expected output is what really happens. The rest test analysis and design: complexity, proofs, recurrences and choosing the right algorithm.",

  requiresModules: [
    "al-m1-intro",
    "al-m2-representation",
    "al-m3-analysis",
    "al-m4-time-complexity",
    "al-m5-notation",
    "al-m6-classes",
    "al-m7-space",
    "al-m8-data-structures",
    "al-m9-searching",
    "al-m10-sorting",
    "al-m11-recursion",
    "al-m12-divide-conquer",
    "al-m13-greedy",
    "al-m14-dynamic-programming",
    "al-m15-graphs",
    "al-m16-complexity",
    "al-m17-applications",
    "al-m18-capstone",
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
    name: "Design and Analysis of Algorithms",
    covers: "Algorithm design • Asymptotic analysis • Data structures • Searching & sorting • Recursion, greedy & DP • Graphs • Complexity theory",
    idFormat: "MST-CERT-2026-000001",
  },
};

export default BLUEPRINT;
