import { ASSESSMENTS as FOUNDATIONS } from "./assessments/m1-data-foundations.js";
import { ASSESSMENTS as EXCEL } from "./assessments/m1-excel-essentials.js";
import { ASSESSMENTS as FORMULAS } from "./assessments/m1-formulas-functions.js";
import { ASSESSMENTS as FORMULAS_2 } from "./assessments/m1-counting-and-formats.js";
import { ASSESSMENTS as CLEANING } from "./assessments/m1-clean-structure.js";
import { ASSESSMENTS as EXPLORATORY } from "./assessments/m2-exploratory.js";
import { ASSESSMENTS as PIVOTS } from "./assessments/m2-pivots.js";
import { ASSESSMENTS as DASHBOARDS } from "./assessments/m2-kpis-dashboards.js";

/**
 * ASSESSMENT ENGINE — server side only.
 *
 * Two jobs, and the split between them is the whole point:
 *
 *   serveQuestions()  strips `correct`, `explanation` and `whyWrong` before
 *                     anything is sent to a browser. A learner who opens
 *                     devtools and reads the network response finds only the
 *                     prompts and options.
 *
 *   gradeSubmission() marks the attempt and returns per-question feedback
 *                     explaining why the chosen answer was wrong and which
 *                     atom to reopen.
 *
 * If these two ever merge, or if this module is imported from src/, every
 * score on the platform becomes forgeable. `npm run validate:content` fails
 * the build if that happens.
 */

const BANK = { ...FOUNDATIONS, ...EXCEL, ...FORMULAS, ...FORMULAS_2, ...CLEANING, ...EXPLORATORY, ...PIVOTS, ...DASHBOARDS };

export const DEFAULT_PASS_MARK = 70;

/**
 * Turn a query-string seed into something serveQuestions can use.
 *
 * Returns undefined for a missing or unusable seed, which is what makes the
 * order random. Both API handlers previously wrote `Number(seed) || 1`, which
 * silently pinned every request to seed 1: the unit tests passed because they
 * called serveQuestions directly, while every real learner saw the same option
 * order on every attempt. Parse in one place so that cannot happen again.
 */
export function parseSeed(raw) {
  if (raw === undefined || raw === null || raw === "") return undefined;
  const n = Number(raw);
  return Number.isFinite(n) ? n : undefined;
}

export function hasAssessment(lessonId) {
  return Boolean(BANK[lessonId]);
}

/**
 * mulberry32: a small, well-distributed PRNG.
 *
 * Math.imul keeps every multiply inside 32 bits. The previous implementation
 * used a classic LCG written in plain JS, where `s * 1103515245` exceeds
 * Number.MAX_SAFE_INTEGER after the first round, so the low bits were lost to
 * floating-point error and the "random" positions came out badly skewed.
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

/** FNV-1a. Gives each question id its own seed, so two questions in the same
 *  lesson never share a permutation. */
function hashString(text) {
  let h = 2166136261;
  for (let i = 0; i < text.length; i += 1) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/**
 * Fisher-Yates, unbiased. The order is stable for one served assessment (so
 * options do not jump around while the learner is answering) and different on
 * the next serve, so nobody can learn to always pick the first option.
 */
function shuffle(items, seed) {
  const random = mulberry32(seed);
  const out = [...items];
  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/**
 * The learner-facing view of an assessment. Contains no answers.
 *
 * `seed` is optional. Left out, a fresh random one is used, so every serve
 * produces a different option order and a learner cannot fall into always
 * choosing the first option. Pass a seed only when a reproducible order is
 * needed, such as in tests.
 */
export function serveQuestions(lessonId, seed) {
  const assessment = BANK[lessonId];
  if (!assessment) return null;

  const base =
    Number.isFinite(seed) ? seed >>> 0 : (Math.random() * 4294967296) >>> 0;

  return {
    lessonId,
    passMark: assessment.passMark ?? DEFAULT_PASS_MARK,
    questionCount: assessment.questions.length,
    questions: assessment.questions.map((q) => ({
      id: q.id,
      type: q.type,
      prompt: q.prompt,
      // True/false keeps its natural order, because "False, True" reads oddly.
      // Everything else is shuffled with a seed unique to this question, so no
      // two questions in a lesson share a permutation.
      options:
        q.type === "truefalse"
          ? q.options
          : shuffle(q.options, (base ^ hashString(q.id)) >>> 0),
    })),
  };
}

/**
 * Grade an attempt.
 *
 * @param {string} lessonId
 * @param {Record<string,string>} answers  questionId -> chosen option id
 * @returns {{score, passed, correctCount, total, passMark, results[], conceptsToReview[]}}
 */
export function gradeSubmission(lessonId, answers = {}) {
  const assessment = BANK[lessonId];
  if (!assessment) return null;

  const passMark = assessment.passMark ?? DEFAULT_PASS_MARK;
  const results = [];
  const conceptsToReview = new Set();
  let correctCount = 0;

  for (const question of assessment.questions) {
    const given = answers[question.id] ?? null;
    const isCorrect = given === question.correct;
    if (isCorrect) correctCount += 1;
    else conceptsToReview.add(question.atomId);

    const chosen = question.options.find((o) => o.id === given);
    const correctOption = question.options.find((o) => o.id === question.correct);

    results.push({
      questionId: question.id,
      prompt: question.prompt,
      yourAnswer: chosen ? chosen.text : null,
      correctAnswer: correctOption.text,
      isCorrect,
      // Why the right answer is right — shown either way, because a lucky
      // guess should still be taught.
      explanation: question.explanation,
      // Why THIS learner's answer failed. The part most platforms skip.
      whyYoursWasWrong: isCorrect ? null : (given ? question.whyWrong?.[given] : "You did not answer this question.") ?? null,
      atomId: question.atomId,
    });
  }

  const total = assessment.questions.length;
  const score = Math.round((correctCount / total) * 100);

  return {
    lessonId,
    score,
    passed: score >= passMark,
    correctCount,
    total,
    passMark,
    results,
    conceptsToReview: [...conceptsToReview],
  };
}
