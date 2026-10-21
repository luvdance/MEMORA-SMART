/**
 * A fast check of React Development modules while they are being written:
 * the same rules `npm run validate:content` applies to them, for just these
 * modules, so a module can be verified in seconds rather than with the whole
 * Academy.
 *
 *   · every lesson has an assessment, and every question names a real atom;
 *   · atom ids are unique; each atom carries at most one graded practice;
 *   · decisions have a real answer and a whyWrong for every other option;
 *   · JavaScript "what does this print?" exercises are run in Node;
 *   · every webLab is solved by its model answer and not by its starter, and
 *     every webDemo renders without an error, in headless Chrome.
 *
 * Run:  node scripts/rxCheck.mjs [module-id …]     (no ids: every written module)
 */
import { execFileSync } from "node:child_process";
import { existsSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { REACT_MODULE_IDS } from "../src/academy/data/reactCourse.js";
import { verifyLabs, findBrowser } from "../lib/academy/web/run.mjs";
import { verifyTypes } from "../lib/academy/react/typecheck.mjs";

const ROOT = new URL("../", import.meta.url);
const wanted = process.argv.slice(2);
const modules = (wanted.length ? wanted : REACT_MODULE_IDS).filter((id) =>
  existsSync(new URL(`src/academy/data/lessons/${id}.js`, ROOT))
);
const errors = [];
const GRADED = ["webLab", "codeExercise", "decision"];
const labs = [];
const demos = [];
const js = [];
const seen = new Set();
const allAtoms = [];
let lessonCount = 0;
let atomCount = 0;

for (const id of modules) {
  const { LESSONS } = await import(new URL(`src/academy/data/lessons/${id}.js`, ROOT).href);
  const { ASSESSMENTS } = await import(new URL(`lib/academy/assessments/${id}.js`, ROOT).href);
  for (const lesson of LESSONS) {
    lessonCount += 1;
    const atomIds = new Set(lesson.atoms.map((a) => a.id));
    const a = ASSESSMENTS[lesson.id];
    if (!a) errors.push(`${lesson.id}: no assessment`);
    else {
      // The Academy-wide rule enforced by validate:content: 4 or 5 per lesson.
      if (a.questions.length < 4 || a.questions.length > 5) errors.push(`${lesson.id}: ${a.questions.length} questions (expected 4–5)`);
      for (const q of a.questions) {
        if (!atomIds.has(q.atomId)) errors.push(`${lesson.id}: question ${q.id} names atom ${q.atomId}, not in the lesson`);
        if (!q.options.some((o) => o.id === q.correct)) errors.push(`${q.id}: answer is not an option`);
        for (const o of q.options) if (o.id !== q.correct && !q.whyWrong?.[o.id]) errors.push(`${q.id}: option ${o.id} has no explanation`);
        if (seen.has(q.id)) errors.push(`duplicate question id ${q.id}`);
        seen.add(q.id);
      }
    }
    for (const atom of lesson.atoms) {
      allAtoms.push(atom);
      atomCount += 1;
      if (seen.has(atom.id)) errors.push(`duplicate atom id ${atom.id}`);
      seen.add(atom.id);
      if (!atom.explain) errors.push(`${atom.id}: no explanation`);
      const graded = GRADED.filter((k) => atom[k]);
      if (graded.length > 1) errors.push(`${atom.id}: ${graded.length} graded practices (${graded.join(", ")})`);
      if (atom.code) errors.push(`${atom.id}: use example or webDemo for React code, not code (code is run in Node)`);
      if (atom.decision) {
        const d = atom.decision;
        if (!d.options?.some((o) => o.id === d.correct)) errors.push(`${atom.id}: decision answer is not an option`);
        for (const o of d.options || []) if (o.id !== d.correct && !o.whyWrong) errors.push(`${atom.id}: decision option ${o.id} has no whyWrong`);
      }
      if (atom.codeExercise) js.push({ id: atom.id, ...atom.codeExercise });
      if (atom.webLab) labs.push({ id: atom.id, lab: atom.webLab });
      if (atom.webDemo) demos.push({ id: atom.id, demo: atom.webDemo });
    }
  }
}

const dir = mkdtempSync(join(tmpdir(), "rx-js-"));
for (const snip of js) {
  if (snip.language !== "javascript") {
    errors.push(`${snip.id}: codeExercise language must be javascript`);
    continue;
  }
  const file = join(dir, `${snip.id}.${snip.module ? "mjs" : "cjs"}`);
  writeFileSync(file, snip.code);
  let out = "";
  try {
    out = execFileSync(process.execPath, [file], { encoding: "utf8", timeout: 5000, env: { ...process.env, NO_COLOR: "1" } });
  } catch (err) {
    out = (err.stdout || "") + `\n(threw) ${String(err.stderr || "").split(/\r?\n/).find((l) => /Error/.test(l)) || ""}`;
  }
  const norm = (s) => String(s).replace(/\r\n/g, "\n").trim();
  if (norm(out) !== norm(snip.expectedOutput)) {
    errors.push(`${snip.id}: lesson says ${JSON.stringify(norm(snip.expectedOutput))}, node printed ${JSON.stringify(norm(out))}`);
  }
}

const types = verifyTypes(allAtoms);
errors.push(...types.errors);

const browser = findBrowser();
const res = await verifyLabs(labs, demos, browser);
errors.push(...res.errors);

console.log(
  `${modules.length} modules, ${lessonCount} lessons, ${atomCount} atoms; ` +
    `${js.length} JS exercises run; ${types.checked} TypeScript checks; ${res.checked}/${labs.length} labs and ${res.demosChecked}/${demos.length} demos verified` +
    (browser ? "" : " (NO BROWSER)")
);
if (errors.length) {
  console.log(`\n${errors.length} problem(s):`);
  for (const e of errors) console.log(" ✗ " + e);
  process.exit(1);
}
console.log("all good");
