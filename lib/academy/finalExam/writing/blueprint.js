/**
 * FINAL CERTIFICATION EXAM — CONTENT WRITING, COPYWRITING & PROFESSIONAL
 * COMMUNICATION
 *
 * The test specification, in the same shape as the other blueprints, so the
 * assembler and grader treat every exam identically: the SHAPE of every paper
 * is fixed here, the CONTENT is drawn per candidate from ./bank.js.
 *
 * Six domains follow the course's six parts. Every item is a judgement
 * question about real writing: choosing the better sentence, headline,
 * structure, claim or response; a few ask for a calculation taught in the
 * course (keyword share, email and content rates, prices and hourly rates).
 */

export const DOMAINS = [
  {
    id: "w1-foundations",
    name: "Foundations of effective writing",
    short: "Foundations",
    items: { core: 4, advanced: 1 },
    covers: [
      "The three disciplines, audience and purpose",
      "Grammar, punctuation and sentence construction",
      "Concise sentences and word choice",
      "Style, tone, voice and readability",
    ],
    review: ["cw-m1-intro", "cw-m2-grammar", "cw-m3-style"],
  },
  {
    id: "w2-content",
    name: "Content writing, SEO and content strategy",
    short: "Content",
    items: { core: 4, advanced: 1 },
    covers: [
      "Briefs, research, sources and fact-checking",
      "Articles, headlines, arguments and evidence",
      "Search intent, keywords and on-page SEO",
      "Website, social media and content strategy",
    ],
    review: ["cw-m4-content", "cw-m5-blogging", "cw-m6-seo", "cw-m7-web-social", "cw-m8-strategy"],
  },
  {
    id: "w3-copy",
    name: "Copywriting and persuasive writing",
    short: "Copywriting",
    items: { core: 4, advanced: 1 },
    covers: [
      "Persuasion, benefits, USPs and honest urgency",
      "AIDA, PAS, BAB, FAB and the 4Ps",
      "Ads, product pages, landing pages and scripts",
      "Email marketing and direct response",
    ],
    review: ["cw-m9-copy-intro", "cw-m10-frameworks", "cw-m11-advertising", "cw-m12-email"],
  },
  {
    id: "w4-professional",
    name: "Professional writing and communication",
    short: "Professional",
    items: { core: 4, advanced: 1 },
    covers: [
      "Letters, memos, minutes, proposals and policies",
      "Workplace email, complaints and follow-ups",
      "Reports, executive summaries and technical documentation",
      "CVs, cover letters and LinkedIn",
    ],
    review: ["cw-m13-business", "cw-m14-workplace", "cw-m15-reports", "cw-m16-career"],
  },
  {
    id: "w5-quality",
    name: "Editing, proofreading and AI-assisted writing",
    short: "Editing & AI",
    items: { core: 4, advanced: 1 },
    covers: [
      "Levels of editing and proofreading",
      "Consistency, style guides and verifying claims",
      "How language models work and their limits",
      "Prompting, originality and responsible AI use",
    ],
    review: ["cw-m17-editing", "cw-m18-ai"],
  },
  {
    id: "w6-career",
    name: "Freelancing, portfolio and career",
    short: "Career",
    items: { core: 4, advanced: 1 },
    covers: [
      "Niches, services, briefs and pricing",
      "Proposals, clients, contracts and revisions",
      "Portfolios and project descriptions",
      "Writing tests and interviews",
    ],
    review: ["cw-m19-freelancing", "cw-m20-portfolio"],
  },
];

export const BLUEPRINT = {
  id: "mst-cw-final",
  version: "2026.1",
  courseId: "content-writing",
  courseCode: "CW-101",
  courseTitle: "Content Writing, Copywriting & Professional Communication",
  title: "Memora Smart Certification — Content Writing, Copywriting & Professional Communication",
  subtitle: "Foundations · Content · Copywriting · Professional · Editing & AI · Career",
  /** What the briefing page says about the kinds of question on the paper. */
  briefingNote:
    "Questions test writing judgement: choosing the clearest sentence, the strongest headline or subject line, the right structure, register and framework, the honest claim, the correct response to a client or colleague, and the right edit. A few ask you to work out a figure the course taught, such as a keyword share, a conversion rate or a project price.",

  requiresModules: [
    "cw-m1-intro",
    "cw-m2-grammar",
    "cw-m3-style",
    "cw-m4-content",
    "cw-m5-blogging",
    "cw-m6-seo",
    "cw-m7-web-social",
    "cw-m8-strategy",
    "cw-m9-copy-intro",
    "cw-m10-frameworks",
    "cw-m11-advertising",
    "cw-m12-email",
    "cw-m13-business",
    "cw-m14-workplace",
    "cw-m15-reports",
    "cw-m16-career",
    "cw-m17-editing",
    "cw-m18-ai",
    "cw-m19-freelancing",
    "cw-m20-portfolio",
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
    name: "Content Writing, Copywriting & Professional Communication",
    covers: "Grammar, style & audience • Content & SEO writing • Copywriting & email • Business & technical writing • Editing, AI & freelancing",
    idFormat: "MST-CERT-2026-000001",
  },
};

export default BLUEPRINT;
