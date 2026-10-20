/**
 * FINAL CERTIFICATION EXAM — CODEBASE ENGINEERING
 *
 * The test specification, in the same shape as the other blueprints, so the
 * assembler and grader treat every exam identically: the SHAPE of every paper
 * is fixed here, the CONTENT is drawn per candidate.
 *
 * Five domains follow the course's four phases (the last phase is split into
 * debugging and production, its two largest areas). Every `predict` item in
 * the bank is RUN in Node by `npm run validate:content` and its stated output
 * compared with what Node actually prints.
 */

export const DOMAINS = [
  {
    id: "ce1-understand",
    name: "Understanding a codebase: foundations, terminal and archaeology",
    short: "Understanding",
    items: { core: 4, advanced: 2 },
    covers: [
      "Codebase vocabulary, ownership, source versus generated",
      "Bash and PowerShell: searching, pipes, exit codes, paths",
      "Manifests, layouts, entry points and configuration",
      "Baselines, inventories and codebase maps",
    ],
    review: ["ce-m1-foundations", "ce-m2-terminal", "ce-m3-archaeology"],
  },
  {
    id: "ce2-trace-git",
    name: "Tracing features and controlling change with Git",
    short: "Tracing & Git",
    items: { core: 4, advanced: 2 },
    covers: [
      "From a click to the data and back; state, props and hooks",
      "APIs, authentication, authorization and dependencies",
      "status, diff, log, blame and show",
      "Branches, staging, reverting, conflicts, pull requests and releases",
    ],
    review: ["ce-m4-tracing", "ce-m5-git"],
  },
  {
    id: "ce3-ai",
    name: "AI coding assistants and agents",
    short: "AI agents",
    items: { core: 4, advanced: 2 },
    covers: [
      "Assistants versus agents; Cursor, Claude Code, Copilot, Codex",
      "Mapping first, focused questions and the right context",
      "Instruction files, context windows and hallucinations",
      "Reviewing agent work and delegating with oversight",
    ],
    review: ["ce-m6-ai-agents"],
  },
  {
    id: "ce4-debug",
    name: "Debugging, logs and tests",
    short: "Debugging",
    items: { core: 4, advanced: 2 },
    covers: [
      "Errors, stack traces, DevTools and server logs",
      "Kinds of error, reproduction and minimal cases",
      "Unit, integration and end-to-end tests; test-first fixes",
      "Lint, static analysis and evidence",
    ],
    review: ["ce-m7-debugging"],
  },
  {
    id: "ce5-maintain",
    name: "Architecture, deployment, security and operations",
    short: "Maintaining",
    items: { core: 4, advanced: 2 },
    covers: [
      "Layers, coupling, technical debt and safe refactoring",
      "Environments, secrets, builds, CI and Docker",
      "Access rules, production data and destructive commands",
      "Workflows, worktrees, review gates and MCP",
    ],
    review: ["ce-m8-architecture", "ce-m9-production", "ce-m10-operations", "ce-c-capstone"],
  },
];

export const BLUEPRINT = {
  id: "mst-ce-final",
  version: "2026.1",
  courseId: "codebase-engineering",
  courseCode: "CE-101",
  courseTitle: "Codebase Engineering",
  title: "Memora Smart Certification — Codebase Engineering",
  subtitle: "Understanding · Tracing & Git · AI Agents · Debugging · Maintaining",
  /** What the briefing page says about the kinds of question on the paper. */
  briefingNote:
    "Most questions show you a real situation from a codebase (a command's output, a diff, an error, an AI agent's report) and ask what it means or what you would do. A few show a short JavaScript program and ask exactly what it prints: every one of them has been run in Node, so the expected output is what JavaScript really does.",

  requiresModules: [
    "ce-m1-foundations",
    "ce-m2-terminal",
    "ce-m3-archaeology",
    "ce-m4-tracing",
    "ce-m5-git",
    "ce-m6-ai-agents",
    "ce-m7-debugging",
    "ce-m8-architecture",
    "ce-m9-production",
    "ce-m10-operations",
    "ce-c-capstone",
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
    name: "Codebase Engineering",
    covers: "Terminal & project archaeology • Feature tracing & Git • AI-assisted development • Debugging & testing • Architecture, deployment & security",
    idFormat: "MST-CERT-2026-000001",
  },
};

export default BLUEPRINT;
