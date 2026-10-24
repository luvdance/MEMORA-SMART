/**
 * FINAL CERTIFICATION EXAM — MOBILE APP DEVELOPMENT
 *
 * The test specification, in the same shape as the other blueprints, so the
 * assembler and grader treat every exam identically: the SHAPE of every paper
 * is fixed here, the CONTENT is drawn per candidate.
 *
 * Five domains follow the course's twenty-one modules. Every `predict` item
 * in the bank is plain JavaScript and is RUN in Node by
 * `npm run validate:content`, its stated output compared with what Node
 * actually prints.
 */

export const DOMAINS = [
  {
    id: "m1-foundations",
    name: "Mobile platforms, tools, JavaScript and TypeScript",
    short: "Foundations",
    items: { core: 4, advanced: 2 },
    covers: [
      "Native, cross-platform and web apps; Android and iOS",
      "The terminal, Node, npm, Git and Expo projects",
      "JavaScript: values, functions, arrays, objects and modules",
      "Async JavaScript, fetch and TypeScript",
    ],
    review: ["md-m1-intro", "md-m2-setup", "md-m3-javascript", "md-m4-modern-js"],
  },
  {
    id: "m2-interfaces",
    name: "Mobile design, React Native and polished interfaces",
    short: "Interfaces",
    items: { core: 4, advanced: 2 },
    covers: [
      "Mobile UI/UX, accessibility and platform conventions",
      "Screens, flows and prototypes",
      "React Native components, styling, Flexbox and lists",
      "Themes, assets, responsive layouts and accessibility props",
    ],
    review: ["md-m5-uiux", "md-m6-screens", "md-m7-react-native", "md-m8-polished-ui"],
  },
  {
    id: "m3-architecture",
    name: "Navigation, structure, state and data on the phone",
    short: "Architecture & data",
    items: { core: 4, advanced: 2 },
    covers: [
      "Expo Router: stacks, tabs, params, protected routes and deep links",
      "Codebase structure, hooks, API layers and environment variables",
      "State: local, shared, derived, Context, reducers and server state",
      "Forms, validation, AsyncStorage, SecureStore, SQLite and offline-first",
    ],
    review: ["md-m9-navigation", "md-m10-architecture", "md-m11-state", "md-m12-forms-storage"],
  },
  {
    id: "m4-connected",
    name: "APIs, backends, accounts and device features",
    short: "Connected apps",
    items: { core: 4, advanced: 2 },
    covers: [
      "REST, status codes, pagination, cancellation, timeouts and retries",
      "Backends, SQL, BaaS, authorization and realtime",
      "Accounts, tokens, refresh, OAuth and protected endpoints",
      "Camera, location, notifications, files, biometrics and permissions",
    ],
    review: ["md-m13-networking", "md-m14-backend", "md-m15-auth", "md-m16-device"],
  },
  {
    id: "m5-production",
    name: "Production features, testing, security and publishing",
    short: "Production & publishing",
    items: { core: 4, advanced: 2 },
    covers: [
      "Payments, links, offline sync, performance, i18n and accessibility",
      "Unit, component, integration and end-to-end testing; debugging",
      "Mobile security, privacy and dependency hygiene",
      "EAS builds, signing, Google Play, the App Store, updates and the capstone",
    ],
    review: ["md-m17-advanced", "md-m18-testing", "md-m19-security", "md-m20-release", "md-m21-capstone"],
  },
];

export const BLUEPRINT = {
  id: "mst-md-final",
  version: "2026.1",
  courseId: "mobile-development",
  courseCode: "MD-101",
  courseTitle: "Mobile App Development",
  title: "Memora Smart Certification — Mobile App Development",
  subtitle: "Foundations · Interfaces · Architecture & data · Connected apps · Production & publishing",
  /** What the briefing page says about the kinds of question on the paper. */
  briefingNote:
    "Some questions show a short JavaScript program and ask exactly what it prints: every one has been run in Node, so the expected output is what JavaScript really does. The rest test judgement about mobile apps: React Native and Expo code, navigation, state and storage, networking and security, device features, testing, and publishing to Google Play and the App Store.",

  requiresModules: [
    "md-m1-intro",
    "md-m2-setup",
    "md-m3-javascript",
    "md-m4-modern-js",
    "md-m5-uiux",
    "md-m6-screens",
    "md-m7-react-native",
    "md-m8-polished-ui",
    "md-m9-navigation",
    "md-m10-architecture",
    "md-m11-state",
    "md-m12-forms-storage",
    "md-m13-networking",
    "md-m14-backend",
    "md-m15-auth",
    "md-m16-device",
    "md-m17-advanced",
    "md-m18-testing",
    "md-m19-security",
    "md-m20-release",
    "md-m21-capstone",
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
    name: "Mobile App Development",
    covers: "JavaScript & TypeScript • React Native & Expo • Navigation, state & storage • APIs, backends & security • Device features • Testing & publishing to Google Play and the App Store",
    idFormat: "MST-CERT-2026-000001",
  },
};

export default BLUEPRINT;
