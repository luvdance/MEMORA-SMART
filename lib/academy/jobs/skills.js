/**
 * SKILL TAXONOMY AND THE MATCHING ENGINE
 *
 * Turns "what has this learner actually proved?" into "which of these real
 * postings can they apply for today?", and shows its working.
 *
 * Two rules this follows, both learned from what makes job recommenders
 * useless:
 *
 *   1. Never recommend a job the learner cannot plausibly get. A beginner
 *      shown "Senior Data Scientist, 8 years' experience" stops trusting the
 *      feed immediately. Seniority is a hard filter, not a soft signal.
 *
 *   2. Always explain the match. Every recommendation carries the skills it
 *      matched and whether the learner has PROVED them (module passed) or is
 *      still LEARNING them. A score with no reasoning is indistinguishable
 *      from a random list.
 *
 * Pure functions only: no network, no database. Fully unit-tested in
 * lib/academy/selfTest.mjs.
 */

/**
 * Skills, and the phrases that signal them in a job posting.
 *
 * Aliases are matched on word boundaries against lower-cased title + tags +
 * description. Order matters for nothing; specificity does — "power bi" must
 * not be caught by a bare "bi".
 */
/**
 * STRONG skills name a specific tool. Finding "Power BI" or "pandas" in a
 * posting is real evidence about the job.
 *
 * WEAK skills are generic business words. "analytics" or "reporting" appear in
 * sales, marketing and operations adverts that have nothing to do with this
 * course, so on their own they must never qualify a job.
 */
export const STRONG_SKILLS = ["excel", "powerbi", "python", "sql", "react", "javascript", "html", "css"];

/** Broad words that suggest a data-ish title without naming the exact role. */
export const TITLE_DATA_WORDS = [
  "analyst", "analytics", "data", "intelligence", "reporting", "insights",
];

/** Titles that say the job really is a data role. The single best signal. */
export const DATA_ROLE_TITLES = [
  "data analyst", "data analytics", "analytics analyst", "business intelligence",
  "bi analyst", "bi developer", "bi consultant", "reporting analyst",
  "insight analyst", "insights analyst", "data scientist", "analytics engineer",
  "data engineer", "power bi", "mis analyst", "research analyst",
  "financial analyst", "business analyst", "data specialist", "data manager",
];

export const SKILLS = {
  excel: {
    label: "Excel",
    aliases: ["excel", "spreadsheet", "spreadsheets", "vlookup", "xlookup", "pivot table", "pivot tables", "microsoft office", "ms office"],
  },
  powerbi: {
    label: "Power BI",
    aliases: ["power bi", "powerbi", "power-bi", "dax", "power query", "microsoft fabric"],
  },
  python: {
    label: "Python",
    aliases: ["python", "pandas", "numpy", "matplotlib", "seaborn", "jupyter"],
  },
  sql: {
    label: "SQL",
    aliases: ["sql", "postgres", "postgresql", "mysql", "bigquery", "snowflake", "redshift"],
  },
  dataviz: {
    label: "Data visualisation",
    aliases: ["data visualisation", "data visualization", "dashboard", "dashboards", "tableau", "looker", "reporting"],
  },
  analysis: {
    label: "Data analysis",
    aliases: ["data analysis", "data analyst", "data analytics", "business intelligence", "insights", "kpi", "kpis", "analytics"],
  },
  statistics: {
    label: "Statistics",
    aliases: ["statistics", "statistical", "regression", "forecasting", "a/b test", "ab testing"],
  },
  html: { label: "HTML", aliases: ["html", "html5"] },
  css: { label: "CSS", aliases: ["css", "css3", "tailwind", "sass"] },
  javascript: { label: "JavaScript", aliases: ["javascript", "js", "typescript", "es6"] },
  react: { label: "React", aliases: ["react", "react.js", "reactjs", "next.js", "nextjs"] },
};

/**
 * Which skills a completed module proves.
 * Keyed by the module ids in dataAnalysisCourse.js.
 */
export const MODULE_SKILLS = {
  "m1-data-foundations": ["analysis"],
  "m1-excel-essentials": ["excel"],
  "m1-formulas-functions": ["excel"],
  "m1-clean-structure": ["excel"],
  "m2-exploratory": ["analysis", "statistics"],
  "m2-pivots": ["excel", "analysis"],
  "m2-kpis-dashboards": ["excel", "dataviz"],
  "m2-project-sales": ["excel", "analysis", "dataviz"],
  "m3-pbi-foundations": ["powerbi"],
  "m3-power-query": ["powerbi"],
  "m3-modelling": ["powerbi"],
  "m3-dax": ["powerbi"],
  "m3-visualisation": ["powerbi", "dataviz"],
  "m4-python-foundations": ["python"],
  "m4-pandas": ["python"],
  "m4-transform": ["python"],
  "m4-visual-analysis": ["python", "dataviz", "statistics"],
  "m4-capstone": ["excel", "powerbi", "python", "analysis", "dataviz"],
};

/* ── Seniority ──────────────────────────────────────────────────────── */

export const SENIORITY = { entry: 1, mid: 2, senior: 3 };

const SENIOR_SIGNALS = [
  "senior", "sr.", "lead ", "principal", "staff ", "head of", "director",
  "manager", "architect", "vp ", "chief",
];
const ENTRY_SIGNALS = [
  "junior", "jr.", "graduate", "entry level", "entry-level", "intern",
  "internship", "trainee", "apprentice", "no experience",
];

/**
 * Infer how senior a posting is. Title carries far more signal than the body,
 * so it is checked first and alone — a junior advert routinely mentions the
 * senior people you will report to.
 */
export function inferSeniority(job) {
  const title = (job.title || "").toLowerCase();

  if (SENIOR_SIGNALS.some((s) => title.includes(s))) return "senior";
  if (ENTRY_SIGNALS.some((s) => title.includes(s))) return "entry";

  // Fall back to a years-of-experience demand anywhere in the text
  const text = `${title} ${(job.description || "").toLowerCase()}`;
  const years = text.match(/(\d+)\+?\s*(?:-\s*\d+\s*)?year/);
  if (years) {
    const n = Number(years[1]);
    if (n >= 5) return "senior";
    if (n >= 3) return "mid";
    return "entry";
  }

  return "mid";
}

/* ── Skill extraction ───────────────────────────────────────────────── */

/** Escape a phrase for safe use inside a RegExp. */
function escapeRegex(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

const ALIAS_PATTERNS = Object.entries(SKILLS).map(([id, skill]) => ({
  id,
  // Word boundaries stop "js" matching "jsonschema" and "bi" matching "big"
  pattern: new RegExp(
    `(?:^|[^a-z0-9])(?:${skill.aliases.map(escapeRegex).join("|")})(?:[^a-z0-9]|$)`,
    "i"
  ),
}));

/** Every skill a posting appears to ask for. */
export function extractJobSkills(job) {
  const haystack = [
    job.title || "",
    (job.tags || []).join(" "),
    job.description || "",
  ]
    .join(" ")
    .toLowerCase();

  return ALIAS_PATTERNS.filter(({ pattern }) => pattern.test(haystack)).map(
    ({ id }) => id
  );
}

/* ── Learner profile ────────────────────────────────────────────────── */

/**
 * What the learner can claim.
 *
 * `proved`   modules whose assessments they passed
 * `learning` modules they have started but not passed
 *
 * The split matters: a learner should see jobs that need what they have
 * proved, plus a small stretch into what they are mid-way through.
 */
export function buildLearnerProfile({
  completedModuleIds = [],
  inProgressModuleIds = [],
  level = 1,
} = {}) {
  const proved = new Set();
  const learning = new Set();

  for (const moduleId of completedModuleIds) {
    for (const skill of MODULE_SKILLS[moduleId] || []) proved.add(skill);
  }
  for (const moduleId of inProgressModuleIds) {
    for (const skill of MODULE_SKILLS[moduleId] || []) {
      if (!proved.has(skill)) learning.add(skill);
    }
  }

  // Academy level 1-2 is entry, 3-4 entry stretching to mid, 5+ mid.
  const seniority = level >= 5 ? "mid" : "entry";

  return {
    proved: [...proved],
    learning: [...learning],
    all: [...new Set([...proved, ...learning])],
    seniority,
    level,
  };
}

/* ── Scoring ────────────────────────────────────────────────────────── */

const WEIGHTS = {
  roleFit: 0.34, // is this actually the kind of job the course leads to?
  skillStrength: 0.28, // how much real, named tooling overlaps
  coverage: 0.13, // how much of what the job asks for you can do
  levelFit: 0.13, // realistic to actually get
  recency: 0.07, // still likely to be open
  proofDepth: 0.05, // proved beats half-learned
};

const MAX_AGE_DAYS = 60;

function recencyScore(postedAt) {
  if (!postedAt) return 0.4;
  const days = (Date.now() - new Date(postedAt).getTime()) / 86400000;
  if (Number.isNaN(days) || days < 0) return 0.4;
  return Math.max(0, 1 - days / MAX_AGE_DAYS);
}

/**
 * How strongly this posting looks like a role the course actually leads to.
 *
 * 1.00  the title names a data role outright
 * 0.70  a specific tool appears in the title or tags
 * 0.45  two or more specific tools appear in the body
 * 0.00  rejected: generic keywords only
 *
 * Without this gate a sales advert that says "analytics" once outranks a real
 * analyst posting, because matching one loose keyword out of one is a perfect
 * proportion. That is how job boards end up recommending nonsense.
 */
export function roleRelevance(job, jobSkills) {
  const title = (job.title || "").toLowerCase();

  // 1. The title names the role outright. The strongest possible signal.
  if (DATA_ROLE_TITLES.some((role) => title.includes(role))) return 1;

  const strong = jobSkills.filter((s) => STRONG_SKILLS.includes(s));

  // 2. The title names a specific tool: "Power BI Developer", "Python Engineer".
  const strongInTitle = strong.filter((id) =>
    SKILLS[id].aliases.some((alias) => title.includes(alias))
  );
  if (strongInTitle.length >= 1) return 0.75;

  // 3. A data-ish title, backed by at least two named tools in the body.
  //
  // Tags deliberately do NOT qualify a job on their own. Boards tag loosely:
  // a copywriter advert tagged "excel" was scoring above a real Data Analyst
  // posting. The title has to carry the signal.
  const titleLooksLikeData = TITLE_DATA_WORDS.some((word) =>
    new RegExp(`(?:^|[^a-z])${word}(?:[^a-z]|$)`, "i").test(title)
  );
  if (titleLooksLikeData && strong.length >= 2) return 0.5;

  return 0;
}

/**
 * Score one posting against one learner.
 * Returns null when the job should not be shown at all.
 */
export function scoreJob(job, profile) {
  const jobSkills = job.skills?.length ? job.skills : extractJobSkills(job);
  if (jobSkills.length === 0) return null;

  // GATE 1: is this even the right kind of job?
  const roleFit = roleRelevance(job, jobSkills);
  if (roleFit === 0) return null;

  const matchedProved = jobSkills.filter((s) => profile.proved.includes(s));
  const matchedLearning = jobSkills.filter((s) => profile.learning.includes(s));
  const matched = [...matchedProved, ...matchedLearning];
  if (matched.length === 0) return null;

  // GATE 2: a match on generic words alone is not a match. The learner must
  // share at least one NAMED tool with the posting, unless the title already
  // declared it a data role.
  const matchedStrong = matched.filter((s) => STRONG_SKILLS.includes(s));
  if (matchedStrong.length === 0 && roleFit < 1) return null;

  const seniority = job.seniority || inferSeniority(job);

  // GATE 3: never show a role above the learner's reach. It is the fastest
  // way to make someone stop believing the feed.
  const allowedCeiling = SENIORITY[profile.seniority] + 1;
  if (SENIORITY[seniority] > allowedCeiling) return null;

  const age = job.postedAt
    ? (Date.now() - new Date(job.postedAt).getTime()) / 86400000
    : 0;
  if (age > MAX_AGE_DAYS) return null;

  // Absolute strength of the overlap, not just its proportion. Matching three
  // named tools must beat matching one vague word.
  const skillStrength = Math.min(1, (matchedStrong.length * 0.4) + (matched.length * 0.1));
  const coverage = matched.length / jobSkills.length;
  const proofDepth = matched.length ? matchedProved.length / matched.length : 0;
  const levelFit =
    SENIORITY[seniority] === SENIORITY[profile.seniority]
      ? 1
      : SENIORITY[seniority] < SENIORITY[profile.seniority]
      ? 0.85
      : 0.55;

  const score =
    WEIGHTS.roleFit * roleFit +
    WEIGHTS.skillStrength * skillStrength +
    WEIGHTS.coverage * coverage +
    WEIGHTS.levelFit * levelFit +
    WEIGHTS.recency * recencyScore(job.postedAt) +
    WEIGHTS.proofDepth * proofDepth;

  return {
    ...job,
    skills: jobSkills,
    seniority,
    roleFit,
    score: Math.round(score * 100),
    match: {
      proved: matchedProved.map((s) => SKILLS[s].label),
      learning: matchedLearning.map((s) => SKILLS[s].label),
      missing: jobSkills.filter((s) => !matched.includes(s)).map((s) => SKILLS[s].label),
    },
    reason: buildReason(matchedProved, matchedLearning, seniority),
  };
}

function buildReason(proved, learning, seniority) {
  const label = (ids) => ids.map((s) => SKILLS[s].label);
  const parts = [];

  if (proved.length) {
    parts.push(
      `You have proved ${listOf(label(proved))} in your assessments.`
    );
  }
  if (learning.length) {
    parts.push(`You are currently learning ${listOf(label(learning))}.`);
  }
  if (seniority === "entry") parts.push("It is an entry-level posting.");

  return parts.join(" ");
}

function listOf(items) {
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
}

/**
 * Rank a batch of postings for a learner.
 * Anything unscoreable is dropped rather than shown with a bad score.
 */
export function rankJobs(jobs, profile, limit = 24) {
  return jobs
    .map((job) => scoreJob(job, profile))
    .filter(Boolean)
    .sort((a, b) => b.score - a.score || (b.postedAt || "").localeCompare(a.postedAt || ""))
    .slice(0, limit);
}
