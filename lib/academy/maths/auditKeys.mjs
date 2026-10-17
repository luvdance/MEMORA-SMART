/**
 * ANSWER-KEY AUDIT FOR THE MATHS LESSON CHECKS
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Run with `npm run audit:maths-keys`. Exits non-zero on a
 * likely wrong answer key.
 * ═════════════════════════════════════════════════════════════════════════
 *
 * A lesson check is a fixed multiple-choice question, and a wrong `correct`
 * id is the worst bug the course can have: it marks a right student wrong and
 * blocks the next lesson. Every check question's `explanation` ends with the
 * worked result, so this compares that result with the options:
 *
 *   ERROR    the explanation's final value equals a WRONG option and not the
 *            correct one. That is almost always a mis-set key.
 *   WARNING  the correct option's value appears nowhere in the explanation.
 *            Usually harmless (a choice question, a worded answer) but worth a
 *            glance.
 *
 * It reads numbers the way the options are written: ₦ and units stripped,
 * thousands spaces and commas removed, the Unicode minus read as minus.
 */

import { MATHS_ASSESSMENTS } from "../assessments/ma-registry.js";

/** Every number-like token in a string, normalised: "₦4 200", "−7", "5/6", "1.5". */
function numbers(text) {
  const s = String(text)
    .replace(/[−–]/g, "-")
    .replace(/(\d)[ ,](?=\d{3}\b)/g, "$1"); // 4 200 → 4200, 4,200 → 4200
  return [...s.matchAll(/-?\d+(?:\.\d+)?(?:\/\d+)?/g)].map((m) => m[0]);
}

/** An option's value if the option is essentially one number, else null. */
function optionValue(text) {
  const s = String(text)
    .replace(/[−–]/g, "-")
    .replace(/(\d)[ ,](?=\d{3}\b)/g, "$1")
    .replace(/[₦£$]|cm³|cm²|cm|m³|m²|km\/h|km|kg|litres?|°|%|\b[a-z]\s*=\s*/gi, "")
    .trim();
  return /^-?\d+(?:\.\d+)?(?:\/\d+)?$/.test(s) ? s : null;
}

const same = (a, b) => {
  const v = (x) => (x.includes("/") ? x.split("/").reduce((p, q) => Number(p) / Number(q)) : Number(x));
  return Math.abs(v(a) - v(b)) < 1e-9;
};

let errors = 0;
let warnings = 0;
let audited = 0;

for (const [lessonId, assessment] of Object.entries(MATHS_ASSESSMENTS)) {
  for (const q of assessment.questions) {
    const correct = q.options.find((o) => o.id === q.correct);
    const cv = optionValue(correct?.text);
    if (cv === null) continue; // worded or multi-part options: nothing to compare
    audited += 1;
    const nums = numbers(q.explanation);
    const last = nums[nums.length - 1];
    if (last !== undefined && !same(last, cv)) {
      const wrongMatch = q.options.find((o) => o.id !== q.correct && optionValue(o.text) !== null && same(optionValue(o.text), last));
      if (wrongMatch) {
        errors += 1;
        console.log(`  ✗ ${lessonId} / ${q.id}: the explanation ends at ${last}, which is option "${wrongMatch.id}" (${wrongMatch.text}), but the key says "${q.correct}" (${correct.text}).`);
        continue;
      }
    }
    if (!nums.some((n) => same(n, cv))) {
      warnings += 1;
      console.log(`  · ${lessonId} / ${q.id}: the correct option ${correct.text} does not appear in the explanation.`);
    }
  }
}

console.log(`\n  ${audited} numerical check questions audited, ${errors} likely wrong key(s), ${warnings} warning(s).`);
process.exit(errors ? 1 : 0);
