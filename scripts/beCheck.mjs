/**
 * Fast check of Backend Engineering modules, without the full validator:
 *
 *   · every backend lab (nodeLab): the model answer passes every check and
 *     the starter fails at least one, on the same Node.js lab machine and
 *     PostgreSQL the page uses (lib/academy/node/verify.mjs); wrong answers
 *     listed in `mustFail` must fail too;
 *   · every worked example (nodeDemo) starts without crashing;
 *   · every JavaScript example and predict-the-output exercise prints, in
 *     real Node.js, exactly what the lesson says;
 *   · every SQL lab passes / fails on PostgreSQL 18 as it should;
 *   · one graded practice per atom; decisions well formed; recorded
 *     terminals offer only recorded commands;
 *   · every assessment question is well formed and points at an atom of its
 *     lesson; the module's curriculum is covered, in order, ending with the
 *     deliverable.
 *
 *   node scripts/beCheck.mjs be-w5-node [be-w6-http-rest …]
 *   node scripts/beCheck.mjs all
 *   node scripts/beCheck.mjs be-w5-node --only a-be-some-atom     (one atom's lab)
 */
import { execFileSync } from "node:child_process";
import { existsSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { BACKEND_ENGINEERING_COURSE, BACKEND_ENGINEERING_MODULE_IDS } from "../src/academy/data/backendEngineeringCourse.js";
import { verifyNodeLabs } from "../lib/academy/node/verify.mjs";

const argv = process.argv.slice(2);
const onlyAt = argv.indexOf("--only");
const only = onlyAt === -1 ? null : argv[onlyAt + 1];
const args = argv.filter((a, i) => !a.startsWith("--") && (onlyAt === -1 || i !== onlyAt + 1));
// "all" means every module written so far.
const ids = args.includes("all")
  ? BACKEND_ENGINEERING_MODULE_IDS.filter((id) => existsSync(new URL(`../src/academy/data/lessons/${id}.js`, import.meta.url)))
  : args;
if (!ids.length) {
  console.log("usage: node scripts/beCheck.mjs <module-id …> | all  [--only <atom-id>]");
  process.exit(2);
}

export const BE_GRADED = ["nodeLab", "codeExercise", "sqlLab", "decision", "terminalExercise", "tsCheck"];

const modules = BACKEND_ENGINEERING_COURSE.months.flatMap((m) => m.modules);
const errors = [];
const seenAtoms = new Set();
const seenQuestions = new Set();
const started = Date.now();
const nodeLabs = [];
const nodeDemos = [];
const jsSnippets = [];
const sqlAtoms = [];

// The Prisma migrations the labs ship must still be what the real Prisma CLI writes (scripts/bePrisma.mjs).
if (ids.some((id) => Number(/^be-w(\d+)-/.exec(id)?.[1]) >= 11)) {
  try {
    execFileSync(process.execPath, [join("scripts", "bePrisma.mjs"), "--check"], { stdio: "pipe", encoding: "utf8" });
  } catch (err) {
    errors.push(`Prisma migrations: ${(err.stderr || err.stdout || err.message).trim()}`);
  }
}

for (const id of ids) {
  const module = modules.find((m) => m.id === id);
  if (!module) {
    errors.push(`${id}: not a module of the course`);
    continue;
  }
  const { LESSONS } = await import(`../src/academy/data/lessons/${id}.js`);
  const { ASSESSMENTS } = await import(`../lib/academy/assessments/${id}.js`);
  const label = module.title.split(" · ")[0];

  const covered = LESSONS.flatMap((l) => l.covers || []);
  const required = module.curriculum.map(([n]) => n);
  for (const n of required) if (!covered.includes(n)) errors.push(`${label}: topic ${n} is not taught`);
  for (const n of covered) if (!required.includes(n)) errors.push(`${label}: a lesson claims ${n}, which is not in this week`);
  const order = covered.map((n) => required.indexOf(n));
  if (order.some((v, i) => i && v < order[i - 1])) errors.push(`${label}: lessons do not follow the curriculum order`);
  const last = LESSONS[LESSONS.length - 1];
  if (!last?.covers?.includes(module.curriculum.slice(-1)[0][0])) errors.push(`${label}: the last lesson must cover the deliverable`);
  if (!last?.task?.prompts?.some((p) => /checkpoint/i.test(p))) errors.push(`${label}: the deliverable's task must state the checkpoint`);

  LESSONS.forEach((lesson, i) => {
    if (lesson.moduleId !== id) errors.push(`${lesson.id}: moduleId is ${lesson.moduleId}`);
    if (lesson.order !== i + 1) errors.push(`${lesson.id}: order is ${lesson.order}, expected ${i + 1}`);
    for (const atom of lesson.atoms) {
      if (seenAtoms.has(atom.id)) errors.push(`${atom.id}: duplicate atom id`);
      seenAtoms.add(atom.id);
      if (!atom.explain) errors.push(`${atom.id}: no explanation`);
      const graded = BE_GRADED.filter((k) => atom[k]);
      if (graded.length !== 1) errors.push(`${atom.id}: has ${graded.length} graded practices (${graded.join(", ") || "none"}); exactly one per atom`);
      if (atom.decision) {
        const d = atom.decision;
        if (!d.options?.some((o) => o.id === d.correct)) errors.push(`${atom.id}: decision answer is not an option`);
        for (const o of d.options || []) if (o.id !== d.correct && !o.whyWrong) errors.push(`${atom.id}: decision option "${o.id}" has no whyWrong`);
      }
      if (atom.terminalExercise) {
        const t = atom.terminalExercise;
        if (!t.accept?.length) errors.push(`${atom.id}: terminal exercise accepts no command`);
        for (const c of t.accept || []) if (!(c in (t.commands || {}))) errors.push(`${atom.id}: accepted "${c}" has no recorded output`);
        if (!t.goal) errors.push(`${atom.id}: terminal exercise has no goal`);
      }
      if (atom.nodeLab) {
        const lab = atom.nodeLab;
        if (!lab.tests?.length) errors.push(`${atom.id}: backend lab has no checks`);
        if (!lab.solution) errors.push(`${atom.id}: backend lab has no model answer`);
        if (!lab.task) errors.push(`${atom.id}: backend lab has no task`);
        for (const name of Object.keys(lab.solution || {})) {
          if ((lab.readOnly || []).includes(name)) errors.push(`${atom.id}: the model answer changes read-only ${name}`);
        }
        if (!only || only === atom.id) nodeLabs.push({ id: atom.id, lab });
      }
      if (atom.nodeDemo && (!only || only === atom.id)) nodeDemos.push({ id: atom.id, lab: atom.nodeDemo });
      for (const spec of [atom.code, atom.codeExercise]) {
        if (!spec?.code) continue;
        if (spec.language !== "javascript") {
          if (spec.language !== "typescript" && spec.language !== "text") errors.push(`${atom.id}: code in "${spec.language}" cannot be verified here`);
          continue;
        }
        if (spec.expectedOutput === undefined && !spec.raises) errors.push(`${atom.id}: javascript snippet has neither expectedOutput nor raises`);
        else jsSnippets.push({ id: atom.id, ...spec });
      }
      if (atom.sqlLab || atom.sqlDemo) sqlAtoms.push(atom);
    }
    const a = ASSESSMENTS[lesson.id];
    if (!a) {
      errors.push(`${lesson.id}: no assessment`);
      return;
    }
    if (a.questions.length < 4 || a.questions.length > 5) errors.push(`${lesson.id}: ${a.questions.length} questions (4–5)`);
    const atomIds = new Set(lesson.atoms.map((x) => x.id));
    for (const qn of a.questions) {
      if (seenQuestions.has(qn.id)) errors.push(`${qn.id}: duplicate question id`);
      seenQuestions.add(qn.id);
      if (!atomIds.has(qn.atomId)) errors.push(`${qn.id}: points at ${qn.atomId}, not an atom of ${lesson.id}`);
      if (!qn.options?.some((o) => o.id === qn.correct)) errors.push(`${qn.id}: answer is not an option`);
      if (new Set(qn.options.map((o) => o.text)).size !== qn.options.length) errors.push(`${qn.id}: two options are identical`);
    }
  });
  for (const lessonId of Object.keys(ASSESSMENTS)) {
    if (!LESSONS.some((l) => l.id === lessonId)) errors.push(`${lessonId}: assessment for a lesson that does not exist`);
  }
}

/* ── JavaScript snippets, in real Node.js ──────────────────────────────── */
const norm = (s) => String(s ?? "").replace(/\r\n/g, "\n").trimEnd();
if (jsSnippets.length) {
  const dir = mkdtempSync(join(tmpdir(), "be-js-"));
  for (const snip of jsSnippets) {
    const file = join(dir, `${snip.id.replace(/[^A-Za-z0-9_-]/g, "_")}.${snip.module ? "mjs" : "cjs"}`);
    writeFileSync(file, snip.code, "utf8");
    let stdout = "";
    let thrown = "";
    try {
      stdout = execFileSync(process.execPath, [file], { stdio: "pipe", encoding: "utf8", timeout: 5000, cwd: dir, env: { ...process.env, NO_COLOR: "1", NODE_DISABLE_COLORS: "1", TZ: "UTC" } });
    } catch (err) {
      stdout = err.stdout || "";
      const line = String(err.stderr || "").split(/\r?\n/).find((l) => /^(Uncaught )?[A-Za-z]*Error\b.*?:|^Uncaught /.test(l));
      thrown = (line || String(err.stderr || "").trim().split(/\r?\n/).pop() || "").trim();
    }
    if (snip.raises) {
      if (norm(thrown) !== norm(snip.raises)) errors.push(`${snip.id}: the lesson says it throws "${snip.raises}" but Node threw "${thrown || "(nothing)"}"`);
      if (snip.expectedOutput !== undefined && norm(stdout) !== norm(snip.expectedOutput)) errors.push(`${snip.id}: output before the error differs.\n      lesson: ${JSON.stringify(norm(snip.expectedOutput))}\n      node:   ${JSON.stringify(norm(stdout))}`);
      continue;
    }
    if (thrown) errors.push(`${snip.id}: expected to print, but threw ${thrown}`);
    else if (norm(stdout) !== norm(snip.expectedOutput)) errors.push(`${snip.id}: output differs from Node's.\n      lesson: ${JSON.stringify(norm(snip.expectedOutput))}\n      node:   ${JSON.stringify(norm(stdout))}`);
  }
}

/* ── SQL labs ──────────────────────────────────────────────────────────── */
if (sqlAtoms.length) {
  const { verifySqlAtoms } = await import("../lib/academy/sql/verify.mjs");
  const subset = sqlAtoms.map((a) => ({ id: a.id, sqlLab: a.sqlLab, sqlDemo: a.sqlDemo, ...(a.sqlLab ? {} : { decision: a.decision || { options: [{ id: "a" }], correct: "a" } }) }));
  const r = await verifySqlAtoms(subset);
  errors.push(...r.errors.filter((e) => !/graded practices/.test(e)));
  const { closeAll } = await import("../lib/academy/sql/pg.mjs");
  await closeAll?.();
}

/* ── Backend labs and examples, on the lab machine ─────────────────────── */
if (nodeLabs.length || nodeDemos.length) {
  process.stdout.write(`running ${nodeLabs.length} backend labs and ${nodeDemos.length} examples…\n`);
  const { failures } = await verifyNodeLabs(nodeLabs, {
    onProgress: (done, total, id) => process.stdout.write(`  ${done}/${total} ${id}\n`),
  });
  for (const f of failures) errors.push(`${f.id}: ${f.problem}${f.details ? `\n${f.details.replace(/^/gm, "      ")}` : ""}`);
  // The lab machine against real Node.js: the model answer of every lab that
  // offers requests and needs no lab database or external service.
  const { differential } = await import("../lib/academy/node/differential.mjs");
  const { solvedFiles, labCommand } = await import("../src/academy/node/grade.js");
  const comparable = nodeLabs.filter(({ lab }) => lab.requests?.length && !lab.db && !lab.services && !lab.redis && !lab.mail && lab.command !== false);
  for (const { id, lab } of comparable) {
    const files = solvedFiles(lab);
    const r = await differential({ files, command: labCommand(lab, files), requests: lab.requests, env: lab.env || {}, port: 3000 });
    if (r.diffs.length) errors.push(`${id}: the lab machine and real Node.js answer differently:\n${r.diffs.map((d) => `      ${d}`).join("\n")}`);
  }
  if (comparable.length) process.stdout.write(`compared ${comparable.length} labs with real Node.js\n`);
  if (nodeDemos.length) {
    const demos = nodeDemos.map(({ id, lab }) => ({
      id,
      lab: { ...lab, solution: {}, tests: [{ label: "starts", check: lab.check || `assert(!exited() || exitCode() === 0, "the example crashed:\\n" + output());` }] },
    }));
    const r = await verifyDemos(demos);
    errors.push(...r);
  }
}

async function verifyDemos(demos) {
  const { Worker } = await import("node:worker_threads");
  const out = [];
  const w = new Worker(new URL("../lib/academy/node/labWorker.mjs", import.meta.url));
  await new Promise((resolve) => w.once("message", resolve));
  let seq = 0;
  for (const { id, lab } of demos) {
    const result = await new Promise((resolve) => {
      const n = ++seq;
      const on = (msg) => {
        if (msg.id !== n) return;
        w.off("message", on);
        resolve(msg);
      };
      w.on("message", on);
      w.postMessage({ id: n, lab, files: { ...lab.files } });
    });
    if (result.error) out.push(`${id}: the example could not run: ${result.error}`);
    else if (!result.result.passed) out.push(`${id}: the example does not run cleanly: ${result.result.checks[0]?.message}`);
  }
  await w.terminate();
  return out;
}

const secs = ((Date.now() - started) / 1000).toFixed(1);
if (errors.length) {
  console.log(`\n${errors.length} problem(s) in ${secs}s:\n`);
  for (const e of errors) console.log(` ✗ ${e}`);
  process.exit(1);
}
console.log(`\n✓ ${ids.length} module(s) OK: ${seenAtoms.size} atoms, ${nodeLabs.length} backend labs, ${nodeDemos.length} examples, ${jsSnippets.length} JavaScript snippets, ${sqlAtoms.length} SQL atoms, ${seenQuestions.size} questions (${secs}s)`);
