/**
 * THE SKILL PASSPORT AND THE MATCH
 *
 * buildPassport: every source of evidence about a person, reduced to the
 * strongest tier they hold per skill (see TIERS in data/skills.js).
 * fitFor:        one job against one passport, as a verdict with its reasons.
 *
 * Pure functions. What people actually see is the verdict and the per-skill
 * breakdown; the number is only used to sort. A "87% match" badge claims a
 * precision this does not have.
 */

import { SKILLS, TIERS } from "../../src/memotify/data/skills.js";

/** Mirrors checks.js. Repeated so the feed path need not load the exam banks. */
const CHECK_VALID_MS = 18 * 30 * 24 * 60 * 60 * 1000;

/** What an Academy certificate stands behind. Keys are course ids. */
const COURSE_SKILLS = {
  "data-analysis": ["excel", "powerbi", "python", "analysis", "dataviz"],
  javascript: ["javascript"],
  python: ["python"],
  cpp: ["cpp"],
  "web-development": ["htmlcss", "javascript", "git"],
  react: ["react", "typescript"],
  "mobile-development": ["reactnative"],
  rdbms: ["sql"],
  "backend-engineering": ["node", "sql"],
  "codebase-engineering": ["git"],
  cybersecurity: ["cybersecurity"],
};

/** Assessed lessons passed in a course before it counts as "studied". */
export const STUDIED_LESSONS = 15;

/**
 * @param {object} evidence
 * @param {object[]} evidence.certificates  server-issued documents
 * @param {object[]} evidence.checks        memotifyChecks documents
 * @param {object[]} evidence.progress      students/{uid}/progress documents
 * @param {string[]} evidence.claimed       skill ids from the CV or profile
 */
export function buildPassport({ certificates = [], checks = [], progress = [], claimed = [] }, now = Date.now()) {
  const held = {};
  const give = (skill, tier, detail = {}) => {
    if (!SKILLS[skill]) return;
    const current = held[skill];
    if (!current || TIERS[tier].rank > TIERS[current.tier].rank) {
      held[skill] = { tier, ...detail };
    }
  };

  for (const cert of certificates) {
    if (cert.revoked) continue;
    for (const skill of COURSE_SKILLS[cert.courseId] || []) {
      give(skill, "certified", {
        ref: cert.id || null,
        score: cert.score ?? null,
        source: cert.courseTitle || cert.courseId,
      });
    }
  }

  for (const check of checks) {
    if (check.status !== "passed" || !check.passedAt) continue;
    if (check.passedAt + CHECK_VALID_MS <= now) continue;
    give(check.skill, "verified", {
      score: check.score,
      at: check.passedAt,
      source: "Memotify check",
    });
  }

  const passedByCourse = {};
  for (const doc of progress) {
    if (doc?.assessment?.passed === true && doc.courseId) {
      passedByCourse[doc.courseId] = (passedByCourse[doc.courseId] || 0) + 1;
    }
  }
  for (const [courseId, count] of Object.entries(passedByCourse)) {
    if (count < STUDIED_LESSONS) continue;
    for (const skill of COURSE_SKILLS[courseId] || []) give(skill, "studied", { source: "Memora Smart Academy" });
  }

  for (const skill of claimed) give(skill, "claimed", { source: "Your CV or profile" });

  return { skills: held, computedAt: now };
}

/** The tiers an employer may be shown as proof. */
export function proofOnly(passport) {
  return Object.fromEntries(
    Object.entries(passport?.skills || {}).filter(([, s]) => TIERS[s.tier]?.proof)
  );
}

/** How much a tier counts toward fit. */
const TIER_WEIGHT = { certified: 1, verified: 0.92, studied: 0.6, claimed: 0.4, none: 0 };
const NICE_WEIGHT = 0.35;

/** Which job levels are within reach for each career stage. */
const REACHABLE = {
  student: { graduate: 1, mid: 0.35, senior: 0 },
  nysc: { graduate: 1, mid: 0.4, senior: 0 },
  graduate: { graduate: 1, mid: 0.5, senior: 0 },
  early: { graduate: 0.8, mid: 1, senior: 0.2 },
  experienced: { graduate: 0.4, mid: 0.9, senior: 1 },
};

const FRESH_DAYS = 30;
const freshness = (postedAt, now) => {
  const time = new Date(postedAt).getTime();
  if (!time) return 0.4;
  return Math.max(0, 1 - (now - time) / (FRESH_DAYS * 86400000));
};

const tierOf = (passport, skill) => passport?.skills?.[skill]?.tier || "none";

/**
 * One job against one person.
 *
 * Verdicts:
 *   ready    proof (certified or verified) of everything the job must have
 *   prove    every must-have is at least studied or claimed
 *   close    half or more of the must-haves are covered
 *   stretch  less than half
 *   open     the posting names no tools, so skills can't decide it
 */
export function fitFor(job, passport, profile = {}, now = Date.now()) {
  const must = job.must || [];
  const nice = job.nice || [];
  const skills = [
    ...must.map((id) => ({ id, tier: tierOf(passport, id), must: true })),
    ...nice.map((id) => ({ id, tier: tierOf(passport, id), must: false })),
  ];

  const mustTiers = must.map((id) => tierOf(passport, id));
  const covered = mustTiers.filter((tier) => tier !== "none").length;
  const proven = mustTiers.filter((tier) => TIERS[tier].proof).length;

  let verdict;
  if (must.length === 0) verdict = "open";
  else if (proven === must.length) verdict = "ready";
  else if (covered === must.length) verdict = "prove";
  else if (covered * 2 >= must.length) verdict = "close";
  else verdict = "stretch";

  const total = must.length + nice.length * NICE_WEIGHT;
  const earned =
    mustTiers.reduce((sum, tier) => sum + TIER_WEIGHT[tier], 0) +
    nice.reduce((sum, id) => sum + TIER_WEIGHT[tierOf(passport, id)] * NICE_WEIGHT, 0);
  const coverage = total ? earned / total : 0.35;

  const fields = profile.fields || [];
  const fieldFit = fields.length === 0 ? 0.5 : fields.includes(job.field) ? 1 : 0;
  const levelFit = (REACHABLE[profile.stage] || REACHABLE.graduate)[job.level] ?? 0.5;

  const score = Math.round(
    100 * (0.48 * coverage + 0.2 * fieldFit + 0.2 * levelFit + 0.12 * freshness(job.postedAt, now))
  );

  return { verdict, score, skills, proven, covered, needed: must.length };
}

/** Skills ranked by how many open jobs each would unlock for this person. */
export function bestNextProofs(jobs, passport, { fields = [], limit = 6 } = {}) {
  const counts = {};
  for (const job of jobs) {
    if (fields.length && !fields.includes(job.field)) continue;
    for (const skill of job.must || []) {
      if (TIERS[tierOf(passport, skill)].proof) continue;
      counts[skill] = (counts[skill] || 0) + 1;
    }
  }
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([id, jobCount]) => ({ id, jobs: jobCount, tier: tierOf(passport, id) }));
}
