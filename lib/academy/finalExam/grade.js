/**
 * EXAM GRADING
 *
 * SERVER ONLY.
 *
 * The paper is re-assembled from the candidate's seed and marked against that,
 * so the client is never trusted about which items it was given. A candidate
 * who edits the payload to claim an easier paper is marked on the paper the
 * seed produces, and unanswered items simply score zero.
 *
 * WHAT COMES BACK, AND WHAT DOES NOT
 * A score, a per-domain breakdown, and the modules to revisit for any domain
 * below its floor. NOT which items were failed, and not the correct answers —
 * because a candidate may retake, and an item bank that hands back its own key
 * is a bank that leaks within a week. This is how professional certification
 * reports a result, and it is also the more useful feedback: "revisit Power
 * Query and modelling" beats "question 14 was wrong".
 */

import { BLUEPRINT, DOMAINS } from "./blueprint.js";
import { assembleForm } from "./assemble.js";
import { CASE_SHEETS } from "./cases.js";
import { evaluateFormula } from "../spreadsheet/engine.js";

/** Whitespace-forgiving, content-exact — the same rule the lessons use. */
function normalise(text) {
  return String(text ?? "")
    .replace(/\r\n/g, "\n")
    .split("\n")
    .map((l) => l.trimEnd())
    .join("\n")
    .replace(/\n+$/, "")
    .trim();
}

/**
 * Mark one item against one response.
 *
 * `formula` items are evaluated with the same engine that powers the lessons,
 * against the case sheet the item belongs to — so a candidate is marked on
 * whether their formula WORKS, not on whether it matches a model answer
 * character for character. Any correct construction passes.
 */
function markItem(item, response) {
  if (response === undefined || response === null || response === "") {
    return { correct: false, reason: "unanswered" };
  }

  if (item.type === "mcq") {
    return { correct: response === item.correct, reason: "choice" };
  }

  if (item.type === "predict") {
    return {
      correct: normalise(response) === normalise(item.expectedOutput),
      reason: "output",
    };
  }

  if (item.type === "formula") {
    const raw = String(response).trim();

    // A typed constant is not a formula. Requiring the leading = and the
    // named function is what makes this a test of construction rather than
    // of arithmetic the candidate could do in their head.
    if (!raw.startsWith("=")) {
      return { correct: false, reason: "not-a-formula" };
    }
    if (item.mustUse) {
      const fn = item.mustUse.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const used = new RegExp(`\\b${fn}(\\.[A-Z]+)?\\s*\\(`, "i").test(raw);
      if (!used) return { correct: false, reason: "wrong-function" };
    }

    const sheet = CASE_SHEETS[item.caseId]?.cells;
    if (!sheet) return { correct: false, reason: "no-sheet" };

    const result = evaluateFormula(raw, sheet);
    if (!result.ok) return { correct: false, reason: "formula-error" };

    const got = Number(result.value);
    if (!Number.isFinite(got)) return { correct: false, reason: "not-numeric" };
    // Tolerance covers float noise, not a different answer.
    return {
      correct: Math.abs(got - Number(item.expected)) < 0.005,
      reason: "value",
    };
  }

  return { correct: false, reason: "unknown-type" };
}

/**
 * Grade a submitted attempt.
 *
 * @param {number} seed     the seed the paper was served with
 * @param {Record<string,string>} answers  itemId -> response
 * @returns a result object safe to send to the candidate
 */
export function gradeExam(seed, answers = {}) {
  const form = assembleForm(seed);

  const perDomain = {};
  for (const d of DOMAINS) perDomain[d.id] = { correct: 0, total: 0 };

  let correctCount = 0;
  const marks = [];

  for (const item of form.items) {
    const mark = markItem(item, answers[item.id]);
    if (mark.correct) correctCount += 1;
    perDomain[item.domain].total += 1;
    if (mark.correct) perDomain[item.domain].correct += 1;
    // Kept server-side for audit and for the "skills to review" roll-up; not
    // returned per item.
    marks.push({ id: item.id, domain: item.domain, skill: item.skill, ...mark });
  }

  const total = form.items.length;
  const score = Math.round((correctCount / total) * 100);

  const domains = DOMAINS.map((d) => {
    const { correct, total: dTotal } = perDomain[d.id];
    const pct = dTotal ? Math.round((correct / dTotal) * 100) : 0;
    return {
      id: d.id,
      name: d.name,
      short: d.short,
      correct,
      total: dTotal,
      score: pct,
      met: pct >= BLUEPRINT.domainMinimum,
      /** Only populated when the candidate fell below the floor. */
      review: pct >= BLUEPRINT.domainMinimum ? [] : d.review,
    };
  });

  const failedDomains = domains.filter((d) => !d.met);
  const passedOverall = score >= BLUEPRINT.passMark;
  const passed = passedOverall && failedDomains.length === 0;

  // Say WHY, so a near-miss is not a mystery.
  let verdict;
  if (passed) verdict = "pass";
  else if (!passedOverall && failedDomains.length) verdict = "below-both";
  else if (!passedOverall) verdict = "below-overall";
  else verdict = "domain-floor";

  // The weakest skills the candidate actually got wrong, most-missed first.
  const missedSkills = [];
  const seen = new Map();
  for (const m of marks) {
    if (m.correct || !m.skill) continue;
    seen.set(m.skill, (seen.get(m.skill) || 0) + 1);
  }
  for (const [skill, count] of [...seen.entries()].sort((a, b) => b[1] - a[1])) {
    missedSkills.push({ skill, count });
  }

  return {
    examId: BLUEPRINT.id,
    version: BLUEPRINT.version,
    seed: form.seed,
    score,
    passed,
    verdict,
    passMark: BLUEPRINT.passMark,
    domainMinimum: BLUEPRINT.domainMinimum,
    correctCount,
    total,
    answered: form.items.filter((i) => {
      const a = answers[i.id];
      return a !== undefined && a !== null && a !== "";
    }).length,
    domains,
    missedSkills,
    /** Modules to revisit, deduplicated across every domain below its floor. */
    review: [...new Set(failedDomains.flatMap((d) => d.review))],
    certificate: passed
      ? {
          eligible: true,
          name: BLUEPRINT.certificate.name,
          issuer: BLUEPRINT.certificate.issuer,
          covers: BLUEPRINT.certificate.covers,
        }
      : { eligible: false },
  };
}

export default gradeExam;
