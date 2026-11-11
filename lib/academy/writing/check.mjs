/**
 * CONTENT WRITING — PROOF OF EVERY WRITING LAB
 *
 * Runs each `writingLab` with the same text kit the Writing Desk uses in the
 * browser (src/academy/writing/textkit.js):
 *
 *   - the model answer passes every check, and no check throws on it;
 *   - the starter fails at least one check, so a lab never ships solved;
 *   - every check has a label a learner can read before starting and a
 *     `fail` message that says what to do;
 *   - a word target, when shown, is met by the model answer;
 *   - `samples` are well formed.
 *
 * Used by lib/academy/validateContent.mjs and scripts/cwCheck.mjs.
 */
import { runWritingChecks, words } from "../../../src/academy/writing/textkit.js";

export function verifyWritingLabs(lessons) {
  const errors = [];
  let labs = 0;
  let checks = 0;
  for (const lesson of lessons) {
    for (const atom of lesson.atoms) {
      if (atom.samples) {
        if (!Array.isArray(atom.samples) || !atom.samples.length || !atom.samples.every((s) => typeof s.text === "string" && s.text.trim())) {
          errors.push(`${atom.id}: samples need a text each`);
        }
        for (const s of atom.samples || []) {
          if (s.tone && !["good", "bad"].includes(s.tone)) errors.push(`${atom.id}: sample tone "${s.tone}" is not good or bad`);
        }
      }
      const lab = atom.writingLab;
      if (!lab) continue;
      labs += 1;
      if (!lab.task || typeof lab.doc !== "string" || typeof lab.solution !== "string" || !lab.tests?.length) {
        errors.push(`${atom.id}: a writing lab needs a task, a starter doc, a solution and checks`);
        continue;
      }
      for (const t of lab.tests) {
        checks += 1;
        if (!t.label || !t.check || !t.fail) errors.push(`${atom.id}: every check needs a label, a check and a fail message`);
      }
      const model = runWritingChecks(lab.tests, lab.solution, lab.doc);
      for (const r of model) {
        if (r.error) errors.push(`${atom.id}: check "${r.label}" throws on the model answer: ${r.error}`);
        else if (!r.passed) errors.push(`${atom.id}: the model answer fails "${r.label}"`);
      }
      const start = runWritingChecks(lab.tests, lab.doc, lab.doc);
      if (start.every((r) => r.passed)) errors.push(`${atom.id}: the starter already passes every check`);
      for (const r of start) if (r.error) errors.push(`${atom.id}: check "${r.label}" throws on the starter: ${r.error}`);
      if (lab.words) {
        const n = words(lab.solution);
        if (n < lab.words[0] || (lab.words[1] && n > lab.words[1])) {
          errors.push(`${atom.id}: the model answer has ${n} words, outside the target ${lab.words.join("–")}`);
        }
      }
    }
  }
  return { errors, stats: { labs, checks } };
}
