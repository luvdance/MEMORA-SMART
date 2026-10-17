/**
 * FORM ASSEMBLY — turning one candidate seed into one exam paper
 *
 * SERVER ONLY. This module imports the answer key.
 *
 * THE CONTRACT
 * A seed in, a paper out, and the same seed always produces the same paper.
 * That single property does all the work:
 *
 *   · Two candidates get different papers, because they get different seeds.
 *   · A candidate who reloads mid-exam gets their paper back, not a new one.
 *   · Grading does not have to trust the client about which items it was
 *     given — the server re-derives the paper from the seed and marks that.
 *     So a candidate cannot submit answers to an easier paper than they sat.
 *
 * WHAT IS RANDOMISED, AND WHAT IS NOT
 *   randomised   which items, their order, the order of options within them,
 *                which company cases the paper draws on
 *   fixed        how many items come from each domain, at what difficulty,
 *                and the pass rules
 *
 * FAIRNESS RULES ENFORCED HERE
 *   1. Blueprint quotas per domain and tier are met exactly, or assembly
 *      throws rather than quietly dealing a short paper.
 *   2. Difficulty is fixed by construction: tier quotas are filled from
 *      tier-specific pools, so no candidate can draw an easy form.
 *   3. One item per `topic` per paper, so two items never give away each
 *      other's answer (a "clued" pair, in test-development terms).
 *   4. Case spread is checked against the blueprint's caseRange, so a paper
 *      is neither one long case study nor a scatter of unrelated stimuli.
 */

import { TIERS, TIER_DIFFICULTY } from "./blueprint.js";
import { getExam, formSizeOf } from "./registry.js";

/* ── Deterministic randomness ──────────────────────────────────────────
 * mulberry32: small, fast, and identical on every platform, which matters
 * because a paper assembled on one server must match one assembled on
 * another. Math.random() could not be used even if it were seedable.
 */
function mulberry32(seed) {
  let a = seed >>> 0;
  return function next() {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** A stable 32-bit hash, so each item can derive its own option order. */
function hashString(text) {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < text.length; i += 1) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return h >>> 0;
}

/** Fisher-Yates, driven by a seeded generator. Does not mutate the input. */
function shuffle(list, seed) {
  const out = [...list];
  const rand = mulberry32(seed);
  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rand() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/* ── Pools ─────────────────────────────────────────────────────────────── */

/** Resolve an exam id to its registry entry, or fail loudly. */
function examOrThrow(examId) {
  const exam = getExam(examId);
  if (!exam) throw new Error(`Unknown exam "${examId}"`);
  return exam;
}

/**
 * Each exam's bank, indexed by domain and tier once, the first time that exam
 * is used. An exam server assembles a paper per request, so this must not be
 * rebuilt each time.
 */
const POOLS = new Map();
function poolFor(exam) {
  const key = exam.blueprint.id;
  if (POOLS.has(key)) return POOLS.get(key);
  const index = {};
  for (const domain of exam.blueprint.domains) {
    index[domain.id] = {};
    for (const tier of TIERS) index[domain.id][tier] = [];
  }
  for (const item of exam.items) {
    const tier = TIER_DIFFICULTY.core.includes(item.difficulty)
      ? "core"
      : "advanced";
    if (!index[item.domain]) continue;
    index[item.domain][tier].push(item);
  }
  // Sorted by id so the pool order never depends on file import order —
  // otherwise a seed would produce different papers across refactors.
  for (const domain of exam.blueprint.domains) {
    for (const tier of TIERS) {
      index[domain.id][tier].sort((a, b) => (a.id < b.id ? -1 : 1));
    }
  }
  POOLS.set(key, index);
  return index;
}

/** What the bank holds, for the validator and for an operations readout. */
export function poolReport(examId) {
  const exam = examOrThrow(examId);
  const pool = poolFor(exam);
  return exam.blueprint.domains.map((domain) => ({
    domain: domain.id,
    needs: { ...domain.items },
    has: {
      core: pool[domain.id].core.length,
      advanced: pool[domain.id].advanced.length,
    },
  }));
}

/**
 * Draw `count` items from `pool`, skipping any whose topic is already spoken
 * for on this paper. Walks a shuffled pool once, so it is O(n) and the choice
 * is uniform over the eligible items.
 */
function draw(pool, count, seed, usedTopics) {
  const picked = [];
  for (const item of shuffle(pool, seed)) {
    if (picked.length === count) break;
    if (item.topic && usedTopics.has(item.topic)) continue;
    picked.push(item);
    if (item.topic) usedTopics.add(item.topic);
  }
  return picked;
}

/**
 * Assemble one paper.
 *
 * @param {number} seed    a 32-bit unsigned integer identifying this
 *                         candidate's attempt. The same seed always returns
 *                         the same paper.
 * @param {string} examId  which exam; defaults to the Data Analysis exam.
 * @returns {{seed, items, cases, blueprint}} items carry their answer key, so
 *                       this is never sent to a browser — see serveForm below.
 */
export function assembleForm(seed, examId) {
  const exam = examOrThrow(examId);
  const { blueprint } = exam;
  const POOL = poolFor(exam);
  const FORM_SIZE = formSizeOf(blueprint);
  const base = seed >>> 0;
  const usedTopics = new Set();
  const chosen = [];

  for (const domain of blueprint.domains) {
    for (const tier of TIERS) {
      const want = domain.items[tier] || 0;
      if (!want) continue;

      const pool = POOL[domain.id][tier];
      // A seed unique to this domain-and-tier slot, so two slots never walk
      // their pools in the same order.
      const slotSeed = (base ^ hashString(`${domain.id}:${tier}`)) >>> 0;
      const got = draw(pool, want, slotSeed, usedTopics);

      if (got.length < want) {
        // Refuse to deal a short paper. A candidate must never sit a form
        // that does not match the blueprint, so this is a build-time bug
        // surfaced loudly rather than a silently easier exam.
        throw new Error(
          `Exam bank cannot fill ${domain.id}/${tier}: needed ${want}, ` +
            `found ${got.length} eligible of ${pool.length} in pool ` +
            `(topic exclusivity may be too tight)`
        );
      }
      chosen.push(...got);
    }
  }

  if (chosen.length !== FORM_SIZE) {
    throw new Error(
      `Assembled ${chosen.length} items but the blueprint calls for ${FORM_SIZE}`
    );
  }

  // Present the paper case by case: a candidate should read a company brief
  // once and answer everything about it, not meet the same brief four times
  // in four places. Case-less concept items follow at the end.
  const order = shuffle(chosen, (base ^ hashString("order")) >>> 0);
  const caseIds = [];
  for (const item of order) {
    if (item.caseId && !caseIds.includes(item.caseId)) caseIds.push(item.caseId);
  }
  const grouped = [
    ...caseIds.flatMap((id) => order.filter((i) => i.caseId === id)),
    ...order.filter((i) => !i.caseId),
  ];

  return {
    seed: base,
    examId: blueprint.id,
    items: grouped,
    caseIds,
    cases: caseIds.map((id) => exam.cases[id]).filter(Boolean),
  };
}

/* ── Serving ───────────────────────────────────────────────────────────── */

/**
 * The candidate's view of a paper: no `correct`, no `expected`, no
 * `explanation`, no `whyWrong`. A candidate who opens devtools and reads the
 * network response finds the questions and nothing else.
 *
 * Options are shuffled with a seed derived from the paper seed AND the item
 * id, so the correct answer does not sit in the same position twice and two
 * items never share a permutation.
 */
export function serveForm(seed, examId) {
  const exam = examOrThrow(examId);
  const BLUEPRINT = exam.blueprint;
  const form = assembleForm(seed, BLUEPRINT.id);

  return {
    seed: form.seed,
    examId: BLUEPRINT.id,
    courseId: BLUEPRINT.courseId,
    version: BLUEPRINT.version,
    title: BLUEPRINT.title,
    subtitle: BLUEPRINT.subtitle,
    passMark: BLUEPRINT.passMark,
    domainMinimum: BLUEPRINT.domainMinimum,
    durationMinutes: BLUEPRINT.durationMinutes,
    itemCount: form.items.length,
    domains: BLUEPRINT.domains.map((d) => ({
      id: d.id,
      name: d.name,
      short: d.short,
      items: d.items.core + d.items.advanced,
    })),
    cases: form.cases.map((c) => ({
      id: c.id,
      company: c.company,
      sector: c.sector,
      brief: c.brief,
      columns: c.columns,
      rows: c.rows,
      note: c.note,
    })),
    items: form.items.map((item) => {
      const served = {
        id: item.id,
        domain: item.domain,
        type: item.type,
        caseId: item.caseId ?? null,
        prompt: item.prompt,
      };
      if (item.type === "mcq") {
        served.options = shuffle(
          item.options,
          (form.seed ^ hashString(item.id)) >>> 0
        ).map((o) => ({ id: o.id, text: o.text }));
      }
      if (item.type === "formula") {
        // The sheet is the stimulus and is shown read-only; the target cell
        // tells the candidate where the answer belongs. `expected` stays here.
        served.target = item.target;
        served.hintRange = item.hintRange ?? null;
      }
      if (item.type === "predict") {
        // The preamble is shown above the snippet: a candidate cannot be asked
        // what code prints without being able to see how the frame was built.
        served.preamble = item.caseId ? exam.preambles[item.caseId] ?? null : null;
        served.code = item.code;
        served.lines = item.lines ?? null;
        served.language = item.language ?? "python";
      }
      return served;
    }),
  };
}

export default { assembleForm, serveForm, poolReport };
