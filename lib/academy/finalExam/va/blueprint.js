/**
 * FINAL CERTIFICATION EXAM — VIRTUAL ASSISTANCE: FROM BEGINNER TO HIRED VA
 *
 * The test specification, in the same shape as the other blueprints, so the
 * assembler and grader treat every exam identically: the SHAPE of every paper
 * is fixed here, the CONTENT is drawn per candidate from ./bank.js.
 *
 * Six domains follow the course's twelve modules. Items are judgement
 * questions about real VA situations (which email to flag, which permission
 * to give, what to escalate, which reply to send) plus calculations the
 * course taught: time-zone conversions, formulas, engagement and NPS, fees.
 */

export const DOMAINS = [
  {
    id: "v1-foundations",
    name: "The VA profession and digital skills",
    short: "Foundations",
    items: { core: 4, advanced: 1 },
    covers: [
      "Roles, types of VA, ethics and authority",
      "Files, naming conventions and cloud permissions",
      "Shortcuts, browsing and troubleshooting",
      "Phishing, passwords and digital hygiene",
    ],
    review: ["va-m1-intro", "va-m2-digital"],
  },
  {
    id: "v2-communication",
    name: "Professional communication",
    short: "Communication",
    items: { core: 4, advanced: 1 },
    covers: [
      "Channels, email structure and etiquette",
      "Messaging, calls and active listening",
      "International clients and time zones",
      "Difficult conversations, confidentiality and boundaries",
    ],
    review: ["va-m3-communication"],
  },
  {
    id: "v3-executive",
    name: "Administrative and executive assistance",
    short: "Executive support",
    items: { core: 4, advanced: 1 },
    covers: [
      "Prioritising and inbox management",
      "Calendars, scheduling and travel",
      "Agendas, minutes, documents and data entry",
      "Confidential information and executive support",
    ],
    review: ["va-m4-admin"],
  },
  {
    id: "v4-tools-research",
    name: "Office tools, research and data",
    short: "Tools & research",
    items: { core: 4, advanced: 1 },
    covers: [
      "Word, Docs, Slides, PDFs and collaboration",
      "Spreadsheet formatting and formulas",
      "Search techniques and credible sources",
      "Lead lists, verification and CRMs",
    ],
    review: ["va-m5-office", "va-m6-research"],
  },
  {
    id: "v5-client-services",
    name: "Customer service, projects and social media",
    short: "Client services",
    items: { core: 4, advanced: 1 },
    covers: [
      "Complaints, tickets and escalation",
      "Feedback and satisfaction measures",
      "Project boards, dependencies and status reports",
      "Social media, community management and email marketing",
    ],
    review: ["va-m7-customer", "va-m8-projects", "va-m9-social"],
  },
  {
    id: "v6-ai-business",
    name: "AI, freelancing and career",
    short: "AI & career",
    items: { core: 4, advanced: 1 },
    covers: [
      "Prompts, fact-checking and private data",
      "Workflow automation",
      "Niches, packages, pricing and proposals",
      "Contracts, invoicing, portfolio and career planning",
    ],
    review: ["va-m10-ai", "va-m11-freelancing", "va-m12-career"],
  },
];

export const BLUEPRINT = {
  id: "mst-va-final",
  version: "2026.1",
  courseId: "virtual-assistant",
  courseCode: "VA-101",
  courseTitle: "Virtual Assistance: From Beginner to Hired VA",
  title: "Memora Smart Certification — Professional Virtual Assistant",
  subtitle: "Foundations · Communication · Executive support · Tools & research · Client services · AI & career",
  /** What the briefing page says about the kinds of question on the paper. */
  briefingNote:
    "Questions test professional judgement in real VA situations: which email to flag, which permission to give, what to escalate, which reply to send, how to schedule across time zones, and how to protect client data. A few ask you to work out a figure the course taught, such as a meeting time in another time zone, a spreadsheet result, an engagement rate or what you receive after a platform fee.",

  requiresModules: [
    "va-m1-intro",
    "va-m2-digital",
    "va-m3-communication",
    "va-m4-admin",
    "va-m5-office",
    "va-m6-research",
    "va-m7-customer",
    "va-m8-projects",
    "va-m9-social",
    "va-m10-ai",
    "va-m11-freelancing",
    "va-m12-career",
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
    name: "Professional Virtual Assistant",
    covers: "Executive & administrative support • Office tools & research • Customer support & project coordination • Social media, AI & automation • Freelancing & client management",
    idFormat: "MST-CERT-2026-000001",
  },
};

export default BLUEPRINT;
