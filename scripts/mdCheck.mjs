/**
 * A fast check of Mobile App Development modules while they are being
 * written: the same rules `npm run validate:content` applies to them, for just
 * these modules.
 *
 *   · every lesson has an assessment of 4–5 questions, each naming a real atom;
 *   · atom ids are unique; each atom carries at most one graded practice;
 *   · decisions have a real answer and a whyWrong for every other option;
 *   · JavaScript "what does this print?" exercises are run in Node;
 *   · every terminal exercise accepts its recorded model command;
 *   · every lab's model answer type-checks against the real Expo SDK 58 types;
 *   · every webLab is solved by its model answer and not by its starter, and
 *     every webDemo runs without an error, on the practice phone in Chrome.
 *
 * Run:  node scripts/mdCheck.mjs [module-id …] [--no-browser] [--only=atom-id]
 */
import { execFileSync } from "node:child_process";
import { existsSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { MOBILE_DEVELOPMENT_MODULE_IDS } from "../src/academy/data/mobileDevelopmentCourse.js";
import { verifyLabs, findBrowser } from "../lib/academy/web/run.mjs";
import { verifyNativeTypes } from "../lib/academy/native/typecheck.mjs";
import { MD_TERMINAL_EXPECTED } from "../lib/academy/native/expected.mjs";

const ROOT = new URL("../", import.meta.url);
const args = process.argv.slice(2);
const noBrowser = args.includes("--no-browser");
const only = args.find((a) => a.startsWith("--only="))?.slice(7);
const wanted = args.filter((a) => !a.startsWith("--"));
const modules = (wanted.length ? wanted : MOBILE_DEVELOPMENT_MODULE_IDS).filter((id) => existsSync(new URL(`src/academy/data/lessons/${id}.js`, ROOT)));
const errors = [];
const GRADED = ["webLab", "codeExercise", "decision", "terminalExercise"];
const labs = [];
const demos = [];
const js = [];
const seen = new Set();
const allAtoms = [];
let lessonCount = 0;
let atomCount = 0;
let terminals = 0;

for (const id of modules) {
  const { LESSONS } = await import(new URL(`src/academy/data/lessons/${id}.js`, ROOT).href);
  const { ASSESSMENTS } = await import(new URL(`lib/academy/assessments/${id}.js`, ROOT).href);
  for (const lesson of LESSONS) {
    lessonCount += 1;
    if (lesson.moduleId !== id) errors.push(`${lesson.id}: moduleId is ${lesson.moduleId}, but it is in ${id}`);
    const atomIds = new Set(lesson.atoms.map((a) => a.id));
    const a = ASSESSMENTS[lesson.id];
    if (!a) errors.push(`${lesson.id}: no assessment`);
    else {
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
      if (graded.length !== 1) errors.push(`${atom.id}: ${graded.length} graded practices (${graded.join(", ") || "none"}); exactly one per atom`);
      if (atom.code) errors.push(`${atom.id}: use example or webDemo for app code, not code (code is run in Node)`);
      if (atom.decision) {
        const d = atom.decision;
        if (!d.options?.some((o) => o.id === d.correct)) errors.push(`${atom.id}: decision answer is not an option`);
        for (const o of d.options || []) if (o.id !== d.correct && !o.whyWrong) errors.push(`${atom.id}: decision option ${o.id} has no whyWrong`);
      }
      if (atom.terminalExercise) {
        terminals += 1;
        const t = atom.terminalExercise;
        const model = MD_TERMINAL_EXPECTED[atom.id];
        if (!model) errors.push(`${atom.id}: no model command in lib/academy/native/expected.mjs`);
        else {
          if (!(model in (t.commands || {}))) errors.push(`${atom.id}: the model command "${model}" has no recorded output`);
          if (!(t.accept || []).includes(model)) errors.push(`${atom.id}: the model command is not accepted`);
        }
        for (const c of t.available || []) if (!(c in (t.commands || {}))) errors.push(`${atom.id}: "${c}" is offered but has no output`);
      }
      if (atom.codeExercise) js.push({ id: atom.id, ...atom.codeExercise });
      if (only && atom.id !== only) continue;
      if (atom.webLab) labs.push({ id: atom.id, lab: atom.webLab });
      if (atom.webDemo) demos.push({ id: atom.id, demo: atom.webDemo });
    }
  }
}

const dir = mkdtempSync(join(tmpdir(), "md-js-"));
for (const snip of js) {
  if (snip.language !== "javascript") {
    errors.push(`${snip.id}: codeExercise language must be javascript`);
    continue;
  }
  const file = join(dir, `${snip.id}.${snip.module ? "mjs" : "cjs"}`);
  writeFileSync(file, snip.code);
  let out = "";
  try {
    out = execFileSync(process.execPath, [file], { encoding: "utf8", timeout: 8000, env: { ...process.env, NO_COLOR: "1" } });
  } catch (err) {
    out = (err.stdout || "") + `\n(threw) ${String(err.stderr || "").split(/\r?\n/).find((l) => /Error/.test(l)) || ""}`;
  }
  const norm = (s) => String(s).replace(/\r\n/g, "\n").trim();
  if (norm(out) !== norm(snip.expectedOutput)) {
    errors.push(`${snip.id}: lesson says ${JSON.stringify(norm(snip.expectedOutput))}, node printed ${JSON.stringify(norm(out))}`);
  }
}

const types = verifyNativeTypes(only ? allAtoms.filter((a) => a.id === only) : allAtoms);
errors.push(...types.errors);

let res = { errors: [], checked: 0, demosChecked: 0 };
const browser = noBrowser ? null : findBrowser();
if (browser) res = await verifyLabs(labs, demos, browser);
errors.push(...res.errors);

console.log(
  `${modules.length} modules, ${lessonCount} lessons, ${atomCount} atoms; ${js.length} JS exercises run; ${terminals} terminals; ` +
    `${types.checked} type-checked against Expo SDK 58; ${res.checked}/${labs.length} labs and ${res.demosChecked}/${demos.length} demos verified` +
    (browser ? "" : " (NO BROWSER)")
);
if (errors.length) {
  console.log(`\n${errors.length} problem(s):`);
  for (const e of errors) console.log(" ✗ " + e);
  process.exit(1);
}
console.log("all good");
