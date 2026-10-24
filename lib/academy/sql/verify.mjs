/**
 * Proves the Relational Databases course's SQL, on the same PostgreSQL 18
 * engine (PGlite) and the same grader the page uses:
 *
 *   sqlLab    the model answer passes every check; the starter does not
 *   sqlDemo   the example runs without an error (or, when it is meant to
 *             show one, fails with the error it claims)
 *   exam      every SQL `predict` item returns exactly its expected output
 *
 * And the course's practice rule: every atom carries exactly one graded
 * practice (a SQL lab, a judgement call or a recorded terminal), and every
 * decision has a real answer with a reason for each wrong option.
 */
import { compareResults, gradeLab, runOnFresh, runScript, formatError, lastResult } from "../../../src/academy/sql/engine.js";
import { gradeApi } from "../../../src/academy/sql/apiLab.js";
import { freshFor } from "./pg.mjs";

export const DB_GRADED = ["sqlLab", "apiLab", "decision", "terminalExercise"];

function checkDecision(atom, errors) {
  const d = atom.decision;
  if (!d.options?.some((o) => o.id === d.correct)) errors.push(`${atom.id}: decision answer is not an option`);
  for (const o of d.options || []) {
    if (o.id !== d.correct && !o.whyWrong) errors.push(`${atom.id}: decision option "${o.id}" has no whyWrong`);
  }
}

/**
 * Facts a lesson's text states about its data ("17 enrollments paid"), each
 * as SQL whose first value must equal `equals` (compared as text).
 */
async function verifyClaims(atomId, spec, errors) {
  for (const claim of spec.claims || []) {
    const { run } = await runOnFresh(claim.sql, { fresh: freshFor(spec.setup || "") });
    const got = run.error ? `ERROR ${run.error.message}` : lastResult(run)?.rows?.[0]?.[0];
    if (String(got) !== String(claim.equals)) {
      errors.push(`${atomId}: the text claims ${claim.equals} for "${claim.sql}", PostgreSQL says ${got}`);
    }
  }
}

/** Verify a list of atoms. Returns { errors, counts }. */
export async function verifySqlAtoms(atoms, { onProgress } = {}) {
  const errors = [];
  const counts = { labs: 0, demos: 0, decisions: 0, terminals: 0 };
  for (const atom of atoms) {
    const graded = DB_GRADED.filter((k) => atom[k]);
    if (graded.length !== 1) {
      errors.push(`${atom.id}: has ${graded.length} graded practices (${graded.join(", ") || "none"}); exactly one per atom`);
    }
    if (atom.decision) {
      counts.decisions += 1;
      checkDecision(atom, errors);
    }
    if (atom.terminalExercise) {
      counts.terminals += 1;
      const t = atom.terminalExercise;
      if (!t.accept?.length) errors.push(`${atom.id}: terminal exercise accepts no command`);
      for (const c of t.accept || []) if (!(c in (t.commands || {}))) errors.push(`${atom.id}: accepted "${c}" has no recorded output`);
      if (!t.goal) errors.push(`${atom.id}: terminal exercise has no goal`);
    }
    for (const spec of [atom.sqlDemo, atom.sqlLab].filter(Boolean)) await verifyClaims(atom.id, spec, errors);
    if (atom.sqlDemo) {
      counts.demos += 1;
      const d = atom.sqlDemo;
      try {
        const { run } = await runOnFresh(d.code, { fresh: freshFor(d.setup || ""), stopOnError: !d.continueOnError });
        if (d.expectError) {
          const all = run.steps.filter((s) => s.error).map((s) => s.error.message);
          if (!all.some((m) => m.includes(d.expectError))) {
            errors.push(`${atom.id}: example should fail with "${d.expectError}" but PostgreSQL said: ${all.join(" | ") || "nothing (it ran)"}`);
          }
        } else if (run.error) {
          errors.push(`${atom.id}: example fails on PostgreSQL:\n      ${formatError(run.error).split("\n").join("\n      ")}`);
        }
        if (d.expectRows !== undefined) {
          const n = lastResult(run)?.rows.length;
          if (n !== d.expectRows) errors.push(`${atom.id}: example claims ${d.expectRows} rows, PostgreSQL returned ${n}`);
        }
      } catch (err) {
        errors.push(`${atom.id}: example could not run: ${err.message}`);
      }
    }
    if (atom.apiLab) {
      counts.labs += 1;
      const lab = atom.apiLab;
      if (!lab.task || !lab.solution || !lab.checks?.length || !lab.hint) errors.push(`${atom.id}: a backend lab needs a task, a solution, checks and a hint`);
      const tools = { fresh: freshFor(lab.setup || ""), runScript, lastResult, compareResults };
      try {
        const good = await gradeApi(lab, lab.solution, tools);
        if (!good.passed) {
          errors.push(`${atom.id}: the model answer fails its own checks:\n      ${good.results.filter((r) => !r.passed).map((r) => `${r.label}: ${r.message}`).join("\n      ")}`);
        }
        const start = await gradeApi(lab, lab.starter || "", tools);
        if (start.passed) errors.push(`${atom.id}: the starter already passes every check`);
        for (const [i, wrong] of (lab.mustFail || []).entries()) {
          const res = await gradeApi(lab, wrong, tools);
          if (res.passed) errors.push(`${atom.id}: wrong answer #${i + 1} passes every check`);
        }
      } catch (err) {
        errors.push(`${atom.id}: ${err.message}`);
      }
    }
    if (atom.sqlLab) {
      counts.labs += 1;
      const lab = atom.sqlLab;
      if (!lab.task || !lab.solution || !lab.checks?.length || !lab.hint) {
        errors.push(`${atom.id}: a SQL lab needs a task, a solution, checks and a hint`);
        continue;
      }
      if (lab.checks.some((c) => !c.label)) errors.push(`${atom.id}: every check needs a label`);
      const fresh = freshFor(lab.setup || "");
      try {
        const good = await gradeLab(lab, lab.solution, { fresh });
        if (good.run.error && !lab.allowError && !lab.continueOnError) errors.push(`${atom.id}: the model answer stops with ${formatError(good.run.error)}`);
        if (!good.passed) {
          const bad = good.results.filter((r) => !r.passed).map((r) => `${r.label}: ${r.message}`);
          errors.push(`${atom.id}: the model answer fails its own checks:\n      ${bad.join("\n      ")}`);
        }
        // A row count the lesson's text relies on (e.g. "Four students").
        if (lab.expectRows !== undefined) {
          const n = lastResult(good.run)?.rows.length;
          if (n !== lab.expectRows) errors.push(`${atom.id}: the lesson claims ${lab.expectRows} rows, the model answer returns ${n}`);
        }
        const start = await gradeLab(lab, lab.starter || "", { fresh });
        if (start.passed) errors.push(`${atom.id}: the starter already passes every check`);
        // Plausible wrong answers the author expects to be caught.
        for (const [i, wrong] of (lab.mustFail || []).entries()) {
          const res = await gradeLab(lab, wrong, { fresh });
          if (res.passed) errors.push(`${atom.id}: wrong answer #${i + 1} passes every check:\n      ${wrong.split("\n").join("\n      ")}`);
        }
      } catch (err) {
        errors.push(`${atom.id}: ${err.message}`);
      }
    }
    onProgress?.(atom.id);
  }
  return { errors, counts };
}

/**
 * The exam's SQL items: each runs `code` on a fresh database built by
 * `setup`; its last result, one row per line with columns joined by " | ",
 * must equal `expectedOutput`.
 */
export async function verifySqlPredicts(items) {
  const errors = [];
  for (const item of items) {
    try {
      const { run } = await runOnFresh(item.code, { fresh: freshFor(item.setup || "") });
      if (run.error) {
        errors.push(`${item.id}: exam SQL fails: ${run.error.message}`);
        continue;
      }
      const res = lastResult(run);
      const got = (res?.rows || []).map((r) => r.map((v) => (v === null ? "NULL" : v)).join(" | ")).join("\n");
      if (got !== item.expectedOutput) {
        errors.push(`${item.id}: exam item claims ${JSON.stringify(item.expectedOutput)}, PostgreSQL returns ${JSON.stringify(got)}`);
      }
    } catch (err) {
      errors.push(`${item.id}: ${err.message}`);
    }
  }
  return errors;
}
