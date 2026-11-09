/**
 * Fast check of the Machine Learning and AI course (ML-101).
 *
 *   node scripts/mlCheck.mjs            every written module
 *   node scripts/mlCheck.mjs ml-m4      modules whose id starts with ml-m4
 *   node scripts/mlCheck.mjs --sync     also rewrite the outline's atom counts
 *
 * The same discipline as `npm run validate:content`, for this course only and
 * in seconds: every Python snippet and pseudocode equivalent is run in CPython
 * and its output compared with the lesson; every challenge's solution must
 * pass and its starter must fail, in the harness the browser uses; every
 * assessment is well formed; every exam `predict` item prints its key.
 */
import { execFileSync } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const ROOT = new URL("../", import.meta.url);
const args = process.argv.slice(2);
const sync = args.includes("--sync");
const filter = args.find((a) => !a.startsWith("--")) || "";

const { MACHINE_LEARNING_MODULE_IDS } = await import(new URL("src/academy/data/machineLearningCourse.js", ROOT));
const { PY_HARNESS, PY_HARNESS_BATCH_MAIN } = await import(new URL("src/academy/pyHarness.js", ROOT));

const errors = [];
const python = ["python", "python3"].find((c) => {
  try { execFileSync(c, ["--version"], { stdio: "pipe" }); return true; } catch { return false; }
});
if (!python) { console.error("no python on PATH"); process.exit(1); }

const norm = (t) => String(t ?? "").split(/\r?\n/).map((l) => l.trimEnd()).join("\n").trim();

const modules = MACHINE_LEARNING_MODULE_IDS.filter((id) =>
  id.startsWith(filter) && existsSync(new URL(`src/academy/data/lessons/${id}.js`, ROOT)));
const lessons = [];
let assessments = {};
const written = {};
for (const id of modules) {
  const mod = await import(new URL(`src/academy/data/lessons/${id}.js`, ROOT));
  lessons.push(...mod.LESSONS);
  written[id] = mod.LESSONS.reduce((n, l) => n + l.atoms.length, 0);
  const aPath = new URL(`lib/academy/assessments/${id}.js`, ROOT);
  if (!existsSync(aPath)) { errors.push(`${id}: no assessment file`); continue; }
  assessments = { ...assessments, ...(await import(aPath)).ASSESSMENTS };
}

/* ── structure ─────────────────────────────────────────────────────────── */
const atomIds = new Set();
const GRADED = ["codeChallenge", "codeExercise", "decision"];
for (const l of lessons) {
  if (!l.atoms.some((a) => GRADED.some((k) => a[k]))) errors.push(`${l.id}: no graded practice`);
  for (const a of l.atoms) {
    if (atomIds.has(a.id)) errors.push(`duplicate atom ${a.id}`);
    atomIds.add(a.id);
    if (!a.explain) errors.push(`${a.id}: no explain`);
    if (GRADED.filter((k) => a[k]).length > 1) errors.push(`${a.id}: more than one graded practice`);
    if (a.trace) errors.push(`${a.id}: 'trace' is not rendered by the lesson player; use a table`);
  }
  const as = assessments[l.id];
  if (!as) { errors.push(`${l.id}: no assessment`); continue; }
  if (as.questions.length < 4 || as.questions.length > 5) errors.push(`${l.id}: ${as.questions.length} questions`);
  for (const q of as.questions) {
    if (!q.options.some((o) => o.id === q.correct)) errors.push(`${q.id}: key not an option`);
    if (!q.explanation) errors.push(`${q.id}: no explanation`);
    for (const o of q.options) if (o.id !== q.correct && !q.whyWrong?.[o.id]) errors.push(`${q.id}: no whyWrong for ${o.id}`);
    if (!l.atoms.some((a) => a.id === q.atomId)) errors.push(`${q.id}: atom ${q.atomId} is not in ${l.id}`);
  }
}
for (const id of Object.keys(assessments)) if (!lessons.some((l) => l.id === id)) errors.push(`assessment ${id} has no lesson`);

/* ── the course's own promises ─────────────────────────────────────────── */
const { MACHINE_LEARNING_COURSE } = await import(new URL("src/academy/data/machineLearningCourse.js", ROOT));
const outlineModules = MACHINE_LEARNING_COURSE.months.flatMap((m) => m.modules);
const lessonIds = new Set();
for (const id of modules) {
  const mod = outlineModules.find((m) => m.id === id);
  const here = lessons.filter((l) => l.moduleId === id);
  if (here.length !== lessons.filter((l) => l.moduleId === id).length || !here.length) errors.push(`${id}: no lessons with this moduleId`);
  const covered = new Set(here.flatMap((l) => l.covers || []));
  const required = mod.curriculum.map(([n]) => n);
  const missing = required.filter((n) => !covered.has(n));
  const extra = [...covered].filter((n) => !required.includes(n));
  if (missing.length) errors.push(`${id}: topics not taught: ${missing.join(", ")}`);
  if (extra.length) errors.push(`${id}: lessons claim topics from elsewhere: ${extra.join(", ")}`);
  if (!here[here.length - 1]?.task?.prompts?.length) errors.push(`${id}: last lesson has no practical task`);
  here.forEach((l, i) => { if (l.order !== i + 1) errors.push(`${l.id}: order ${l.order}, expected ${i + 1}`); });
}
for (const l of lessons) {
  if (lessonIds.has(l.id)) errors.push(`duplicate lesson ${l.id}`);
  lessonIds.add(l.id);
  if (!l.atoms.some((a) => a.codeChallenge || a.codeExercise)) errors.push(`${l.id}: no codeChallenge or codeExercise`);
  if (!l.requirements) errors.push(`${l.id}: no requirements`);
}

/* ── snippets ──────────────────────────────────────────────────────────── */
const dir = mkdtempSync(join(tmpdir(), "ml-check-"));
const snippets = [];
for (const l of lessons) for (const a of l.atoms) for (const spec of [a.code, a.codeExercise]) {
  if (!spec?.code) continue;
  const code = spec.language === "pseudocode" ? spec.equivalentPython : spec.code;
  if (!code) { errors.push(`${a.id}: pseudocode without equivalentPython`); continue; }
  if (spec.expectedOutput === undefined && !spec.raises) { errors.push(`${a.id}: no expectedOutput`); continue; }
  snippets.push({ id: a.id, code, expected: spec.expectedOutput, raises: spec.raises });
}
let examItems = [];
const bankUrl = new URL("lib/academy/finalExam/machine-learning/bank.js", ROOT);
if (!filter && existsSync(bankUrl)) {
  examItems = (await import(bankUrl)).ITEMS;
  for (const i of examItems.filter((x) => x.type === "predict")) snippets.push({ id: i.id, code: i.code, expected: i.expectedOutput });
}
for (const s of snippets) {
  const file = join(dir, `${s.id.replace(/[^\w-]/g, "_")}.py`);
  writeFileSync(file, s.code, "utf8");
  let out = "", err = "";
  try {
    out = execFileSync(python, [file], { stdio: "pipe", encoding: "utf8", cwd: dir, env: { ...process.env, PYTHONIOENCODING: "utf-8", MPLBACKEND: "Agg" } });
  } catch (e) { out = e.stdout || ""; err = norm(e.stderr).split("\n").pop(); }
  if (s.raises) { if (norm(err) !== norm(s.raises)) errors.push(`${s.id}: expected raise ${s.raises}, got ${err || "nothing"}`); continue; }
  if (err) { errors.push(`${s.id}: raised ${err}`); continue; }
  if (norm(out) !== norm(s.expected)) errors.push(`${s.id}: output mismatch\n   lesson: ${JSON.stringify(norm(s.expected))}\n   python: ${JSON.stringify(norm(out))}`);
}

/* ── challenges ────────────────────────────────────────────────────────── */
const challenges = lessons.flatMap((l) => l.atoms.filter((a) => a.codeChallenge).map((a) => ({ id: a.id, ...a.codeChallenge })));
for (const c of challenges) {
  if (!c.task || !c.solution || !c.tests?.length) errors.push(`${c.id}: challenge incomplete`);
  const bare = c.tests.flatMap((t) => t.check.split("\n")).filter((ln) => /^\s*assert\b/.test(ln) && !/,\s*(f?["']|\()/.test(ln));
  if (bare.length) errors.push(`${c.id}: assert without message: ${bare[0].trim()}`);
}
if (challenges.length) {
  const h = join(dir, "harness.py");
  const j = join(dir, "jobs.json");
  writeFileSync(h, PY_HARNESS + PY_HARNESS_BATCH_MAIN, "utf8");
  writeFileSync(j, JSON.stringify([
    ...challenges.map((c) => ({ id: `${c.id}#solution`, code: c.solution, tests: c.tests })),
    ...challenges.map((c) => ({ id: `${c.id}#starter`, code: c.starter || "", tests: c.tests })),
  ]), "utf8");
  const res = JSON.parse(execFileSync(python, [h, j], { stdio: "pipe", encoding: "utf8", cwd: dir, maxBuffer: 1 << 26 }));
  const by = new Map(res.map((r) => [r.id, r.result]));
  for (const c of challenges) {
    const sol = by.get(`${c.id}#solution`);
    const st = by.get(`${c.id}#starter`);
    if (!sol.passed) {
      const last = sol.results[sol.results.length - 1] || {};
      errors.push(`${c.id}: SOLUTION FAILS: ${last.error || last.message}`);
    }
    if (st.passed) errors.push(`${c.id}: starter already passes`);
  }
}

/* ── outline atom counts ───────────────────────────────────────────────── */
const outlinePath = new URL("src/academy/data/machineLearningCourse.js", ROOT);
let outline = readFileSync(outlinePath, "utf8");
for (const [id, n] of Object.entries(written)) {
  const re = new RegExp(`(id: "${id}",[\\s\\S]*?atoms: )(\\d+)`);
  const m = outline.match(re);
  if (m && Number(m[2]) !== n) {
    if (sync) outline = outline.replace(re, `$1${n}`);
    else errors.push(`${id}: outline says ${m[2]} atoms, written ${n} (run with --sync)`);
  }
}
if (sync) writeFileSync(outlinePath, outline, "utf8");

const lessonCount = lessons.length;
const atomCount = lessons.reduce((n, l) => n + l.atoms.length, 0);
console.log(`${modules.length} modules · ${lessonCount} lessons · ${atomCount} atoms · ${snippets.length} snippets · ${challenges.length} challenges · ${examItems.length} exam items`);
console.log(`XP if complete: ${atomCount * 10 + lessonCount * 115}`);
if (errors.length) { console.log(`\n✗ ${errors.length} problem(s):\n- ` + errors.join("\n- ")); process.exit(1); }
console.log("✓ all checks passed");
