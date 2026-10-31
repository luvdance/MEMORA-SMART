/**
 * SKILL CHECKS
 *
 * SERVER ONLY. Imports the exam registry, so it carries answer keys.
 *
 * WHY THIS EXISTS
 * Lesson progress is written by the signed-in client, so it cannot be shown to
 * an employer as proof. Before Memotify the only server-issued evidence was a
 * full certificate, which takes months. A check is the middle rung: a short
 * paper, drawn from the same reviewed banks as the certification exams,
 * graded here with its clock and seed held here. Anyone can sit one, so a
 * graduate who learned Excel elsewhere can prove it too.
 *
 * WHAT IT CANNOT DO
 * It cannot stop someone being helped while they sit it. The clock, the random
 * paper and the retake wait make that costly, not impossible, which is why
 * employers see "Verified" as a step below "Certified".
 *
 * Results report a score only, never which items were wrong, for the reason
 * given in lib/academy/finalExam/grade.js.
 */

import { EXAMS } from "../academy/finalExam/registry.js";
import { markItem } from "../academy/finalExam/grade.js";
import { EXCEL_ITEMS, SUPPORT_ITEMS, WRITING_ITEMS } from "./banks.js";

export const PAPER_SIZE = 12;
export const MINUTES = 15;
export const PASS_MARK = 70;
/** A failed check can be retaken after this. Long enough to deter harvesting the bank. */
export const RETAKE_WAIT_MS = 7 * 24 * 60 * 60 * 1000;
/** Skills go stale. A verified badge expires so that it keeps meaning something. */
export const VALID_FOR_MS = 18 * 30 * 24 * 60 * 60 * 1000;
/** Grace for a slow connection on the final submit. */
const LATE_MS = 90 * 1000;

/** Which bank sections stand behind each skill. Skill ids are in data/skills.js. */
const SOURCES = {
  excel: { exam: "mst-da-final", domains: ["d2-excel"], extra: EXCEL_ITEMS },
  powerbi: { exam: "mst-da-final", domains: ["d3-powerbi"] },
  analysis: { exam: "mst-da-final", domains: ["d1-quality", "d5-judgement"] },
  sql: { exam: "mst-db-final", domains: ["db-d1-foundations", "db-d3-sql", "db-d4-advanced"] },
  python: { exam: "mst-py-final", domains: ["p1-foundations", "p2-control", "p3-data"] },
  javascript: { exam: "mst-js-final", domains: ["j2-language", "j3-functions-data"] },
  htmlcss: { exam: "mst-wd-final", domains: ["w1-html", "w2-css"] },
  react: { exam: "mst-rx-final", domains: ["r1-foundations", "r2-state", "r3-apps"] },
  reactnative: { exam: "mst-md-final", domains: ["m1-foundations", "m2-interfaces", "m3-architecture"] },
  node: { exam: "mst-be-final", domains: ["be-d1-foundations", "be-d2-apis"] },
  cpp: { exam: "mst-cp-final", domains: ["c1-foundations", "c2-core", "c3-objects"] },
  git: { exam: "mst-ce-final", domains: ["ce2-trace-git", "ce5-maintain"] },
  support: { items: SUPPORT_ITEMS },
  writing: { items: WRITING_ITEMS },
};

export const CHECK_IDS = Object.keys(SOURCES);

/* ── Paper assembly ─────────────────────────────────────────────────────
 * The same seed gives the same paper, so a reload resumes the paper and the
 * grader can re-derive it without trusting the client. The approach is
 * lib/academy/finalExam/assemble.js's, on a far simpler paper.
 */
function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffle(list, seed) {
  const out = [...list];
  const rand = mulberry32(seed);
  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rand() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/** Case-study items depend on a spreadsheet the check does not show. */
const standalone = (item) => !item.caseId && (item.type === "mcq" || item.type === "predict");

const POOLS = new Map();
export function poolFor(skill) {
  if (POOLS.has(skill)) return POOLS.get(skill);
  const source = SOURCES[skill];
  if (!source) return null;
  const items = source.items || [
    ...EXAMS[source.exam].items.filter((item) => source.domains.includes(item.domain) && standalone(item)),
    ...(source.extra || []),
  ];
  const sorted = [...items].sort((a, b) => (a.id < b.id ? -1 : 1));
  POOLS.set(skill, sorted);
  return sorted;
}

/** Answer key included: never send this to a browser. See publicPaper. */
export function assemblePaper(skill, seed) {
  const used = new Set();
  const picked = [];
  for (const item of shuffle(poolFor(skill), seed)) {
    if (picked.length === PAPER_SIZE) break;
    if (item.topic && used.has(item.topic)) continue;
    if (item.topic) used.add(item.topic);
    picked.push(item);
  }
  return picked;
}

/** What the candidate sees. An allow-list, so a new key field can't leak. */
export function publicPaper(skill, seed) {
  return assemblePaper(skill, seed).map((item, i) => ({
    id: item.id,
    type: item.type,
    prompt: item.prompt,
    ...(item.type === "mcq"
      ? {
          options: shuffle(item.options, (seed ^ (i + 1) * 2654435761) >>> 0).map(({ id, text }) => ({ id, text })),
        }
      : {
          language: item.language,
          preamble: item.preamble || null,
          code: item.code || null,
          lines: item.lines || 1,
        }),
  }));
}

export function gradePaper(skill, seed, answers = {}) {
  const paper = assemblePaper(skill, seed);
  const correct = paper.filter((item) => markItem(item, answers?.[item.id]).correct).length;
  const score = Math.round((correct / paper.length) * 100);
  return { score, correct, total: paper.length, passed: score >= PASS_MARK };
}

/* ── Attempts ───────────────────────────────────────────────────────────
 * One document per person per skill. The seed, start time and status live
 * there, written only by this server, so nothing the browser sends can extend
 * the clock or swap the paper.
 */
const docId = (uid, skill) => `${uid}__${skill}`;

/**
 * Start a check, or resume one already running.
 * @returns {{status: "open", seed, expiresAt} | {status: "wait", retryAt} | {status: "held", ...}}
 */
export async function startCheck(db, uid, skill, now = Date.now()) {
  const ref = db.collection("memotifyChecks").doc(docId(uid, skill));
  return db.runTransaction(async (t) => {
    const snap = await t.get(ref);
    const prev = snap.exists ? snap.data() : null;

    if (prev?.status === "open" && prev.expiresAt > now) {
      return { status: "open", seed: prev.seed, expiresAt: prev.expiresAt };
    }
    if (prev?.status === "passed" && prev.passedAt + VALID_FOR_MS > now) {
      return { status: "held", score: prev.score, passedAt: prev.passedAt };
    }
    // A paper left to run out counts as a failed sitting. Otherwise opening a
    // paper, reading it and walking away would be a free look at the bank.
    const lastSat = prev?.status === "failed" ? prev.finishedAt : prev?.status === "open" ? prev.startedAt : null;
    if (lastSat && lastSat + RETAKE_WAIT_MS > now) {
      return { status: "wait", retryAt: lastSat + RETAKE_WAIT_MS };
    }

    const seed = crypto.getRandomValues(new Uint32Array(1))[0];
    const expiresAt = now + MINUTES * 60 * 1000;
    t.set(ref, {
      uid,
      skill,
      seed,
      status: "open",
      startedAt: now,
      expiresAt,
      attempts: (prev?.attempts || 0) + 1,
      score: prev?.score ?? null,
      passedAt: null,
      finishedAt: null,
    });
    return { status: "open", seed, expiresAt };
  });
}

/** Mark a running check. The seed comes from the stored attempt, never the request. */
export async function submitCheck(db, uid, skill, answers, now = Date.now()) {
  const ref = db.collection("memotifyChecks").doc(docId(uid, skill));
  return db.runTransaction(async (t) => {
    const snap = await t.get(ref);
    if (!snap.exists || snap.data().status !== "open") return { error: "no_attempt" };
    const attempt = snap.data();

    const onTime = now <= attempt.expiresAt + LATE_MS;
    const result = onTime
      ? gradePaper(skill, attempt.seed, answers)
      : { score: 0, correct: 0, total: PAPER_SIZE, passed: false };

    t.set(
      ref,
      {
        status: result.passed ? "passed" : "failed",
        score: result.score,
        finishedAt: now,
        passedAt: result.passed ? now : null,
      },
      { merge: true }
    );
    return { ...result, timedOut: !onTime, retryAt: result.passed ? null : now + RETAKE_WAIT_MS };
  });
}
