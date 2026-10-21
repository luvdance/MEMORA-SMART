/**
 * FINAL CERTIFICATION EXAM — REACT DEVELOPMENT
 *
 * The test specification, in the same shape as the other blueprints, so the
 * assembler and grader treat every exam identically: the SHAPE of every paper
 * is fixed here, the CONTENT is drawn per candidate.
 *
 * Five domains follow the course's sixteen modules. Every `predict` item in
 * the bank is plain JavaScript (the language React is written in) and is RUN
 * in Node by `npm run validate:content`, its stated output compared with what
 * Node actually prints.
 */

export const DOMAINS = [
  {
    id: "r1-foundations",
    name: "Foundations, JSX, components and events",
    short: "Components",
    items: { core: 4, advanced: 2 },
    covers: [
      "The JavaScript React is built on",
      "Vite projects, JSX and its rules",
      "Components, props, children and composition",
      "Lists, keys, conditional rendering and events",
    ],
    review: ["rx-m0-foundations", "rx-m1-intro", "rx-m2-components", "rx-m3-rendering"],
  },
  {
    id: "r2-state",
    name: "State, forms, Hooks and architecture",
    short: "State & Hooks",
    items: { core: 4, advanced: 2 },
    covers: [
      "useState, snapshots and immutable updates",
      "Controlled forms and validation",
      "Effects, cleanup, refs and custom Hooks",
      "Context, reducers and choosing where state lives",
    ],
    review: ["rx-m4-state", "rx-m5-forms", "rx-m6-hooks", "rx-m7-architecture"],
  },
  {
    id: "r3-apps",
    name: "Routing and server data",
    short: "Routing & data",
    items: { core: 4, advanced: 2 },
    covers: [
      "React Router: routes, params, layouts and protection",
      "REST, fetch, request states and API services",
      "Tokens, expired sessions and CORS",
      "TanStack Query: caching and invalidation",
    ],
    review: ["rx-m8-routing", "rx-m9-apis"],
  },
  {
    id: "r4-ui-types",
    name: "Styling, accessibility and TypeScript",
    short: "UI & TypeScript",
    items: { core: 4, advanced: 2 },
    covers: [
      "CSS Modules, Tailwind, tokens and themes",
      "Responsive and accessible interfaces",
      "Typed props, Hooks and API responses",
      "Generics, unions and narrowing",
    ],
    review: ["rx-m10-styling", "rx-m11-typescript"],
  },
  {
    id: "r5-production",
    name: "Security, testing, performance and deployment",
    short: "Production",
    items: { core: 4, advanced: 2 },
    covers: [
      "Authentication, authorization and frontend security",
      "Testing with Vitest and React Testing Library",
      "Performance, memoization and code splitting",
      "Git, CI/CD and deployment",
    ],
    review: ["rx-m12-auth", "rx-m13-testing", "rx-m14-performance", "rx-m15-deployment"],
  },
];

export const BLUEPRINT = {
  id: "mst-rx-final",
  version: "2026.1",
  courseId: "react",
  courseCode: "WD-201",
  courseTitle: "React Development",
  title: "Memora Smart Certification — React Development",
  subtitle: "Components · State & Hooks · Routing & Data · UI & TypeScript · Production",
  /** What the briefing page says about the kinds of question on the paper. */
  briefingNote:
    "Some questions show a short JavaScript program and ask exactly what it prints: every one has been run in Node, so the expected output is what JavaScript really does. The rest test judgement about React code: components, state, effects, routing, data, types, security, testing and performance.",

  requiresModules: [
    "rx-m0-foundations",
    "rx-m1-intro",
    "rx-m2-components",
    "rx-m3-rendering",
    "rx-m4-state",
    "rx-m5-forms",
    "rx-m6-hooks",
    "rx-m7-architecture",
    "rx-m8-routing",
    "rx-m9-apis",
    "rx-m10-styling",
    "rx-m11-typescript",
    "rx-m12-auth",
    "rx-m13-testing",
    "rx-m14-performance",
    "rx-m15-deployment",
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
    name: "React Development",
    covers: "Components & state • Hooks & forms • Routing & server data • Styling & TypeScript • Security, testing, performance & deployment",
    idFormat: "MST-CERT-2026-000001",
  },
};

export default BLUEPRINT;
