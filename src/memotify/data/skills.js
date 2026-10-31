/**
 * MEMOTIFY — SKILLS, FIELDS AND EVIDENCE
 *
 * Pure data, shared by the browser and lib/memotify (same pattern as the CV
 * builder's plans.js), so a label or a tier can never mean one thing on the
 * page and another in the matcher.
 *
 * Holds no answers and no scoring weights: the question banks and the ranking
 * live in lib/memotify.
 *
 * ADDING A SKILL: one entry in SKILLS. Give it `check` only when a graded
 * check exists for it in lib/memotify/checks.js, and `course` only when an
 * open Academy course actually teaches it. The page renders both verbatim, so
 * a wrong value here is a promise we cannot keep.
 */

/** Broad enough for non-technical graduates: most of them are not developers. */
export const FIELDS = [
  { id: "software", label: "Software" },
  { id: "data", label: "Data" },
  { id: "design", label: "Design" },
  { id: "product", label: "Product" },
  { id: "marketing", label: "Marketing" },
  { id: "sales", label: "Sales" },
  { id: "support", label: "Customer support" },
  { id: "finance", label: "Finance" },
  { id: "operations", label: "Operations" },
  { id: "people", label: "People & HR" },
  { id: "content", label: "Content & writing" },
  { id: "security", label: "Security" },
  { id: "other", label: "Other" },
];

export const fieldLabel = (id) => FIELDS.find((f) => f.id === id)?.label || "Other";

/**
 * aliases are matched on word boundaries against lower-cased text. Specific
 * phrases only: a bare "bi" or "c" here would match half of English.
 */
export const SKILLS = {
  excel: { label: "Excel", field: "data", check: true, course: "data-analysis", aliases: ["excel", "spreadsheet", "spreadsheets", "vlookup", "xlookup", "pivot table", "pivot tables", "google sheets"] },
  powerbi: { label: "Power BI", field: "data", check: true, course: "data-analysis", aliases: ["power bi", "powerbi", "power-bi", "dax", "power query"] },
  sql: { label: "SQL", field: "data", check: true, course: "rdbms", aliases: ["sql", "postgres", "postgresql", "mysql", "bigquery", "snowflake", "redshift"] },
  python: { label: "Python", field: "software", check: true, course: "python", aliases: ["python", "pandas", "numpy", "django", "flask", "fastapi"] },
  analysis: { label: "Data analysis", field: "data", check: true, course: "data-analysis", aliases: ["data analysis", "data analyst", "data analytics", "business intelligence", "kpi", "kpis"] },
  dataviz: { label: "Dashboards", field: "data", course: "data-analysis", aliases: ["data visualisation", "data visualization", "dashboard", "dashboards", "tableau", "looker"] },
  statistics: { label: "Statistics", field: "data", aliases: ["statistics", "statistical", "regression", "a/b test", "a/b testing"] },
  javascript: { label: "JavaScript", field: "software", check: true, course: "javascript", aliases: ["javascript", "es6"] },
  typescript: { label: "TypeScript", field: "software", course: "react", aliases: ["typescript"] },
  htmlcss: { label: "HTML & CSS", field: "software", check: true, course: "web-development", aliases: ["html", "html5", "css", "css3", "tailwind", "sass"] },
  react: { label: "React", field: "software", check: true, course: "react", aliases: ["react", "react.js", "reactjs", "next.js", "nextjs"] },
  reactnative: { label: "Mobile apps", field: "software", check: true, course: "mobile-development", aliases: ["react native", "expo", "mobile app development", "flutter", "ios development", "android development"] },
  node: { label: "Node.js", field: "software", check: true, course: "backend-engineering", aliases: ["node.js", "nodejs", "node js", "express.js", "nestjs"] },
  cpp: { label: "C++", field: "software", check: true, course: "cpp", aliases: ["c++"] },
  git: { label: "Git", field: "software", check: true, course: "codebase-engineering", aliases: ["git", "github", "gitlab", "version control", "pull request", "pull requests"] },
  cloud: { label: "Cloud (AWS, GCP, Azure)", field: "software", aliases: ["aws", "gcp", "azure", "google cloud", "amazon web services"] },
  docker: { label: "Docker & Kubernetes", field: "software", aliases: ["docker", "kubernetes", "k8s"] },
  java: { label: "Java", field: "software", aliases: ["java", "spring boot"] },
  golang: { label: "Go", field: "software", aliases: ["golang"] },
  testing: { label: "Software testing", field: "software", aliases: ["qa engineer", "test automation", "unit testing", "cypress", "selenium", "playwright"] },
  linux: { label: "Linux", field: "software", aliases: ["linux", "ubuntu", "bash"] },
  cybersecurity: { label: "Cybersecurity", field: "security", course: "cybersecurity", aliases: ["cybersecurity", "cyber security", "information security", "penetration testing", "siem", "soc analyst"] },
  figma: { label: "Figma", field: "design", aliases: ["figma"] },
  uxdesign: { label: "UX design", field: "design", aliases: ["ux design", "ui design", "ui/ux", "ux/ui", "user research", "wireframes", "wireframing", "prototyping"] },
  graphic: { label: "Graphic design", field: "design", aliases: ["graphic design", "adobe photoshop", "illustrator", "canva", "indesign"] },
  productmgmt: { label: "Product management", field: "product", aliases: ["product management", "product manager", "product roadmap", "user stories"] },
  projectmgmt: { label: "Project management", field: "operations", aliases: ["project management", "project manager", "agile", "scrum", "jira", "asana"] },
  seo: { label: "SEO", field: "marketing", aliases: ["seo", "search engine optimization", "search engine optimisation", "keyword research"] },
  socialmedia: { label: "Social media", field: "marketing", aliases: ["social media", "community management", "instagram", "tiktok"] },
  digitalmarketing: { label: "Digital marketing", field: "marketing", aliases: ["digital marketing", "paid ads", "google ads", "meta ads", "facebook ads", "email marketing", "performance marketing", "growth marketing"] },
  crm: { label: "CRM tools", field: "sales", aliases: ["crm", "salesforce", "hubspot", "zoho"] },
  sales: { label: "Sales", field: "sales", aliases: ["cold calling", "lead generation", "business development", "sales pipeline", "account executive", "sales target", "sales targets", "b2b sales"] },
  support: { label: "Customer support", field: "support", check: true, aliases: ["customer support", "customer service", "customer success", "customer experience", "zendesk", "intercom", "freshdesk", "help desk", "helpdesk", "call centre", "call center"] },
  writing: { label: "Professional writing", field: "content", check: true, aliases: ["copywriting", "copywriter", "content writing", "content writer", "technical writing", "technical writer", "proofreading", "written communication", "business writing"] },
  accounting: { label: "Accounting", field: "finance", aliases: ["accounting", "bookkeeping", "quickbooks", "reconciliation", "reconciliations", "ifrs", "accounts payable", "accounts receivable"] },
  finance: { label: "Financial analysis", field: "finance", aliases: ["financial analysis", "financial modelling", "financial modeling", "financial reporting", "credit analysis", "underwriting"] },
  compliance: { label: "Compliance & risk", field: "finance", aliases: ["compliance", "kyc", "aml", "risk management", "internal audit"] },
  hr: { label: "HR & recruiting", field: "people", aliases: ["talent acquisition", "human resources", "hr operations", "payroll"] },
  admin: { label: "Admin & executive support", field: "operations", aliases: ["virtual assistant", "executive assistant", "administrative assistant", "office administration", "calendar management"] },
  logistics: { label: "Logistics & supply chain", field: "operations", aliases: ["logistics", "supply chain", "procurement", "inventory management", "fleet management"] },
  aitraining: { label: "AI data work", field: "data", aliases: ["data annotation", "data labeling", "data labelling", "ai trainer", "ai training", "prompt engineering"] },
};

export const skillLabel = (id) => SKILLS[id]?.label || id;

/** Skills sorted for pickers, grouped by the field they sit under. */
export function skillsByField() {
  return FIELDS.map((field) => ({
    ...field,
    skills: Object.entries(SKILLS)
      .filter(([, s]) => s.field === field.id)
      .map(([id, s]) => ({ id, ...s })),
  })).filter((f) => f.skills.length > 0);
}

/**
 * THE EVIDENCE LADDER
 *
 * What a person's claim to a skill rests on, strongest first. The distinction
 * is the entire product, so it must stay honest:
 *
 *   certified  a certificate issued by the server after a graded final exam
 *              (lib/academy/finalExam/record.js).
 *   verified   a timed Memotify skill check, graded on the server.
 *   studied    Academy lessons passed. Those progress documents are written by
 *              the signed-in client, so this can be forged. It helps the
 *              candidate's own matching and is never shown to an employer as
 *              proof.
 *   claimed    the candidate said so, on their CV or their profile.
 */
export const TIERS = {
  certified: { rank: 4, label: "Certified", proof: true, note: "Passed the Academy final exam" },
  verified: { rank: 3, label: "Verified", proof: true, note: "Passed a timed, server-graded check" },
  studied: { rank: 2, label: "Studied", proof: false, note: "Passed Academy lessons" },
  claimed: { rank: 1, label: "Claimed", proof: false, note: "Listed on your CV or profile" },
  none: { rank: 0, label: "Not shown yet", proof: false, note: "" },
};

/** A job's verdict for one person. Plain words instead of a percentage ring. */
export const VERDICTS = {
  ready: { label: "Ready", hint: "You have proof of everything this role asks for." },
  prove: { label: "Prove it", hint: "You have the skills. Show proof and you move up." },
  close: { label: "Close the gap", hint: "Most of the way there. A skill or two to go." },
  stretch: { label: "Stretch", hint: "A real reach today. Useful as a target." },
  open: { label: "Open", hint: "No specific tools listed. Read the role." },
};

/** Where a job seeker is in their career. Sets which levels are realistic. */
export const STAGES = [
  { id: "student", label: "Final-year student" },
  { id: "nysc", label: "Doing NYSC" },
  { id: "graduate", label: "Graduate, job hunting" },
  { id: "early", label: "1 to 3 years' experience" },
  { id: "experienced", label: "4+ years' experience" },
];

export const LEVELS = {
  graduate: "Graduate friendly",
  mid: "Some experience",
  senior: "Senior",
};

/** Where a job is open to someone living in Nigeria. */
export const REACH = {
  nigeria: { label: "In Nigeria", note: "Based in Nigeria or hiring there." },
  worldwide: { label: "Open worldwide", note: "The employer hires from anywhere." },
  region: { label: "Region includes Nigeria", note: "Hires across Africa or EMEA. Some EMEA roles have country limits, so confirm before you apply." },
};

/** Stages of a tracked application, in order. */
export const TRACK_STAGES = [
  { id: "saved", label: "Saved" },
  { id: "applied", label: "Applied" },
  { id: "interview", label: "Interview" },
  { id: "offer", label: "Offer" },
  { id: "closed", label: "Closed" },
];

/** Stages an employer moves an applicant through. Mirrors server validation. */
export const PIPELINE = [
  { id: "new", label: "New", track: "applied" },
  { id: "shortlisted", label: "Shortlisted", track: "applied" },
  { id: "interview", label: "Interview", track: "interview" },
  { id: "offer", label: "Offer", track: "offer" },
  { id: "hired", label: "Hired", track: "offer" },
  { id: "declined", label: "Not this time", track: "closed" },
];

export const JOB_TYPES = ["Full-time", "Part-time", "Contract", "Internship", "NYSC placement"];
export const WORK_MODES = [
  { id: "remote", label: "Remote" },
  { id: "hybrid", label: "Hybrid" },
  { id: "onsite", label: "On site" },
];
