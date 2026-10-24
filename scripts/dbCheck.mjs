/**
 * Fast check of Relational Databases modules, without the full validator:
 * every SQL lab's model answer passes and its starter fails on PostgreSQL 18,
 * every example runs, one graded practice per atom, every assessment
 * question is well formed and points at an atom of its lesson, and the
 * module's curriculum topics are all covered, in order.
 *
 *   node scripts/dbCheck.mjs db-m7-querying [db-m8-aggregation …]
 *   node scripts/dbCheck.mjs all
 */
import { RDBMS_COURSE, RDBMS_MODULE_IDS } from "../src/academy/data/rdbmsCourse.js";
import { verifySqlAtoms } from "../lib/academy/sql/verify.mjs";
import { closeAll } from "../lib/academy/sql/pg.mjs";

const args = process.argv.slice(2);
const ids = args.includes("all") ? RDBMS_MODULE_IDS : args;
if (!ids.length) {
  console.log("usage: node scripts/dbCheck.mjs <module-id …> | all");
  process.exit(2);
}

const modules = RDBMS_COURSE.months.flatMap((m) => m.modules);
const errors = [];
const seenAtoms = new Set();
const seenQuestions = new Set();
const started = Date.now();

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
  if (last?.covers?.join() !== `${module.curriculum.slice(-1)[0][0]}`) errors.push(`${label}: the last lesson must be the practical`);
  if (!last?.task?.prompts?.some((p) => /checkpoint/i.test(p))) errors.push(`${label}: the practical's task must state the checkpoint`);

  for (const lesson of LESSONS) {
    if (lesson.moduleId !== id) errors.push(`${lesson.id}: moduleId is ${lesson.moduleId}`);
    for (const atom of lesson.atoms) {
      if (seenAtoms.has(atom.id)) errors.push(`${atom.id}: duplicate atom id`);
      seenAtoms.add(atom.id);
      if (!atom.explain) errors.push(`${atom.id}: no explanation`);
    }
    const a = ASSESSMENTS[lesson.id];
    if (!a) {
      errors.push(`${lesson.id}: no assessment`);
      continue;
    }
    if (a.questions.length < 4 || a.questions.length > 5) errors.push(`${lesson.id}: ${a.questions.length} questions (4–5)`);
    for (const q of a.questions) {
      if (seenQuestions.has(q.id)) errors.push(`${q.id}: duplicate question id`);
      seenQuestions.add(q.id);
      if (!lesson.atoms.some((x) => x.id === q.atomId)) errors.push(`${q.id}: atomId ${q.atomId} is not in ${lesson.id}`);
      if (!q.options.some((o) => o.id === q.correct)) errors.push(`${q.id}: answer is not an option`);
      if (!q.explanation) errors.push(`${q.id}: no explanation`);
      for (const o of q.options) if (o.id !== q.correct && !q.whyWrong?.[o.id]) errors.push(`${q.id}: option ${o.id} has no whyWrong`);
    }
  }
  for (const lessonId of Object.keys(ASSESSMENTS)) {
    if (!LESSONS.some((l) => l.id === lessonId)) errors.push(`assessment ${lessonId} has no lesson`);
  }

  const atoms = LESSONS.flatMap((l) => l.atoms);
  const res = await verifySqlAtoms(atoms);
  errors.push(...res.errors);
  const c = res.counts;
  console.log(`${label}: ${LESSONS.length} lessons, ${atoms.length} atoms — ${c.labs} SQL labs, ${c.demos} examples, ${c.decisions} decisions, ${c.terminals} terminals`);
}

await closeAll();
const secs = Math.round((Date.now() - started) / 1000);
if (errors.length) {
  console.log(`\n✗ ${errors.length} problem(s) (${secs} s):\n  ${errors.join("\n  ")}`);
  process.exit(1);
}
console.log(`\n✓ all checks passed (${secs} s)`);
