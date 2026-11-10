/**
 * FINAL CERTIFICATION EXAM — UI/UX DESIGN
 *
 * The test specification, in the same shape as the other blueprints, so the
 * assembler and grader treat every exam identically: the SHAPE of every paper
 * is fixed here, the CONTENT is drawn per candidate from ./bank.js.
 *
 * Six domains follow the course's six phases. Every item is a judgement or
 * calculation question; calculation items (contrast ratios, usability
 * metrics, RICE, pricing) were worked from the same formulas the course's
 * labs check in the browser.
 */

export const DOMAINS = [
  {
    id: "u1-foundations",
    name: "UI/UX foundations, design thinking and visual design",
    short: "Foundations",
    items: { core: 4, advanced: 1 },
    covers: [
      "UI versus UX, the designer's role and the design process",
      "Design thinking, problem statements and assumptions",
      "Colour, typography, hierarchy and contrast",
      "White space, grids and spacing systems",
    ],
    review: ["ux-m1-intro", "ux-m2-design-thinking", "ux-m3-visual"],
  },
  {
    id: "u2-ux",
    name: "User research, structure and interaction design",
    short: "UX design",
    items: { core: 4, advanced: 1 },
    covers: [
      "Research methods, interviews, surveys and bias",
      "Personas, journeys, information architecture and tree testing",
      "User flows, forms, feedback and states",
      "Mental models, the laws of UX and Gestalt",
    ],
    review: ["ux-m4-research", "ux-m5-personas-ia", "ux-m6-interaction"],
  },
  {
    id: "u3-ui",
    name: "Figma, wireframing and responsive interfaces",
    short: "UI design",
    items: { core: 4, advanced: 1 },
    covers: [
      "Frames, constraints, components, variants and Auto Layout",
      "Wireframe fidelity, layout structures and interface types",
      "Breakpoints, fluid layouts, navigation and touch targets",
      "Material Design and Apple's Human Interface Guidelines",
    ],
    review: ["ux-m7-figma", "ux-m8-wireframing", "ux-m9-responsive"],
  },
  {
    id: "u4-validation",
    name: "Prototyping, usability testing and design systems",
    short: "Prototypes & systems",
    items: { core: 4, advanced: 1 },
    covers: [
      "Prototype fidelity, interactions, overlays and animation",
      "Usability testing, metrics, SUS and heuristic evaluation",
      "Design tokens, atomic design and component architecture",
      "Variants, states, naming and documentation",
    ],
    review: ["ux-m10-prototyping", "ux-m11-usability", "ux-m12-design-systems"],
  },
  {
    id: "u5-practice",
    name: "Accessibility, ethics and developer handoff",
    short: "Professional practice",
    items: { core: 4, advanced: 1 },
    covers: [
      "WCAG, POUR, contrast, keyboard and screen readers",
      "Inclusive design, literacy, language and dark patterns",
      "HTML, CSS, Flexbox and Grid for designers",
      "Specifications, assets, QA and Agile collaboration",
    ],
    review: ["ux-m13-accessibility", "ux-m14-handoff"],
  },
  {
    id: "u6-product-career",
    name: "Product design and the design career",
    short: "Product & career",
    items: { core: 4, advanced: 1 },
    covers: [
      "Strategy, requirements, prioritisation and MVPs",
      "Dashboards, FinTech, data visualisation and AI interfaces",
      "Portfolios and case studies",
      "Clients, pricing, proposals and interviews",
    ],
    review: ["ux-m15-product", "ux-m16-career"],
  },
];

export const BLUEPRINT = {
  id: "mst-ux-final",
  version: "2026.1",
  courseId: "uiux-design",
  courseCode: "UX-101",
  courseTitle: "UI/UX Design",
  title: "Memora Smart Certification — UI/UX Design",
  subtitle: "Foundations · UX · UI · Prototypes & systems · Professional practice · Product & career",
  /** What the briefing page says about the kinds of question on the paper. */
  briefingNote:
    "Questions test design judgement: choosing research methods, structuring products, designing interactions and interfaces, testing, accessibility and working with developers and clients. Some ask you to calculate a contrast-based decision, a usability metric, a prioritisation score or a project price; they use exactly the formulas taught in the course.",

  requiresModules: [
    "ux-m1-intro",
    "ux-m2-design-thinking",
    "ux-m3-visual",
    "ux-m4-research",
    "ux-m5-personas-ia",
    "ux-m6-interaction",
    "ux-m7-figma",
    "ux-m8-wireframing",
    "ux-m9-responsive",
    "ux-m10-prototyping",
    "ux-m11-usability",
    "ux-m12-design-systems",
    "ux-m13-accessibility",
    "ux-m14-handoff",
    "ux-m15-product",
    "ux-m16-career",
  ],

  domains: DOMAINS,
  passMark: 70,
  domainMinimum: 50,
  durationMinutes: 60,
  attemptLimit: null,
  /** No case studies on this paper: each question stands alone. */
  caseRange: { min: 0, max: 0 },

  certificate: {
    issuer: "Memora Smart Technologies",
    name: "UI/UX Design",
    covers: "Design thinking & research • Interaction & visual design • Figma & prototyping • Usability, systems & accessibility • Handoff & portfolio",
    idFormat: "MST-CERT-2026-000001",
  },
};

export default BLUEPRINT;
