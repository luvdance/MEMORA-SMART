/**
 * FINAL CERTIFICATION EXAM — RESPONSIVE WEB DEVELOPMENT
 *
 * The test specification, in the same shape as the other blueprints, so the
 * assembler and grader treat every exam identically: the SHAPE of every paper
 * is fixed here, the CONTENT is drawn per candidate.
 *
 * Five domains follow the course's six phases. Every `predict` item in the
 * bank is RUN in Node by `npm run validate:content` and its stated output
 * compared with what Node actually prints.
 */

export const DOMAINS = [
  {
    id: "w1-html",
    name: "HTML, semantics, forms and accessibility",
    short: "HTML",
    items: { core: 4, advanced: 2 },
    covers: [
      "How the web works: requests, URLs and files",
      "Document structure and semantic elements",
      "Links, images and tables",
      "Forms, labels and accessible markup",
    ],
    review: ["wd-m1-web", "wd-m2-environment", "wd-m3-html", "wd-m4-semantic", "wd-m5-forms-a11y", "wd-p1-projects"],
  },
  {
    id: "w2-css",
    name: "CSS, layout and responsive design",
    short: "CSS & layout",
    items: { core: 4, advanced: 2 },
    covers: [
      "Selectors, the cascade and specificity",
      "The box model, Flexbox and Grid",
      "Mobile-first media queries and fluid layouts",
      "Modern CSS and design fundamentals",
    ],
    review: ["wd-m6-css", "wd-m7-styling", "wd-m8-box-model", "wd-m9-layout", "wd-m10-responsive", "wd-m11-modern-css", "wd-m12-design", "wd-p2-projects"],
  },
  {
    id: "w3-js",
    name: "JavaScript programming",
    short: "JavaScript",
    items: { core: 4, advanced: 2 },
    covers: [
      "Variables, types, conditions and loops",
      "Functions and scope",
      "Arrays, objects and strings",
      "Errors and problem solving",
    ],
    review: ["wd-m13-programming", "wd-m14-conditions", "wd-m15-loops", "wd-m16-functions", "wd-m17-arrays-objects", "wd-m18-strings-errors", "wd-m19-problem-solving", "wd-p3-projects"],
  },
  {
    id: "w4-browser",
    name: "The DOM, events, storage and APIs",
    short: "DOM & APIs",
    items: { core: 4, advanced: 2 },
    covers: [
      "Selecting and changing the DOM safely",
      "Events and form validation",
      "localStorage and JSON",
      "fetch, async/await and modules",
    ],
    review: ["wd-m20-dom", "wd-m21-events", "wd-m22-validation", "wd-m23-storage", "wd-m24-async-apis", "wd-m25-modern-js", "wd-p4-projects"],
  },
  {
    id: "w5-professional",
    name: "Professional workflow, quality and deployment",
    short: "Professional",
    items: { core: 4, advanced: 2 },
    covers: [
      "Git, GitHub, npm and Vite",
      "Testing, linting and debugging",
      "Deployment, accessibility, SEO and performance",
      "Security, maintenance and client work",
    ],
    review: ["wd-m26-git", "wd-m27-tooling", "wd-m28-quality", "wd-p5-projects", "wd-m29-deployment", "wd-m30-performance", "wd-m31-security", "wd-m32-portfolio", "wd-c-capstone"],
  },
];

export const BLUEPRINT = {
  id: "mst-wd-final",
  version: "2026.1",
  courseId: "web-development",
  courseCode: "WD-101",
  courseTitle: "Responsive Web Development",
  title: "Memora Smart Certification — Responsive Web Development",
  subtitle: "HTML · CSS & Responsive Design · JavaScript · DOM & APIs · Professional Workflow",
  /** What the briefing page says about the kinds of question on the paper. */
  briefingNote:
    "Some questions show you a short JavaScript program and ask exactly what it prints: every one of them has been run in Node, so the expected output is what JavaScript really does. The rest test judgement: markup, layout, accessibility, debugging and professional decisions.",

  requiresModules: [
    "wd-m1-web",
    "wd-m2-environment",
    "wd-m3-html",
    "wd-m4-semantic",
    "wd-m5-forms-a11y",
    "wd-p1-projects",
    "wd-m6-css",
    "wd-m7-styling",
    "wd-m8-box-model",
    "wd-m9-layout",
    "wd-m10-responsive",
    "wd-m11-modern-css",
    "wd-m12-design",
    "wd-p2-projects",
    "wd-m13-programming",
    "wd-m14-conditions",
    "wd-m15-loops",
    "wd-m16-functions",
    "wd-m17-arrays-objects",
    "wd-m18-strings-errors",
    "wd-m19-problem-solving",
    "wd-p3-projects",
    "wd-m20-dom",
    "wd-m21-events",
    "wd-m22-validation",
    "wd-m23-storage",
    "wd-m24-async-apis",
    "wd-m25-modern-js",
    "wd-p4-projects",
    "wd-m26-git",
    "wd-m27-tooling",
    "wd-m28-quality",
    "wd-p5-projects",
    "wd-m29-deployment",
    "wd-m30-performance",
    "wd-m31-security",
    "wd-m32-portfolio",
    "wd-c-capstone",
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
    name: "Responsive Web Development",
    covers: "HTML • CSS & responsive design • JavaScript • DOM & APIs • Professional workflow & deployment",
    idFormat: "MST-CERT-2026-000001",
  },
};

export default BLUEPRINT;
