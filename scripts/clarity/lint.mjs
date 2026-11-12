/**
 * CLARITY LINT — THE GATE EVERY COURSE PASSES BEFORE IT SHIPS
 *
 * Checks every string a learner reads for three things:
 *   1. Grammar and spelling      LanguageTool, British English, run locally
 *   2. Plain English             rules for readers of English as a second language
 *   3. Step by step              nothing used before it is taught
 *
 * Run:
 *   npm run clarity:lint -- cw                     the whole course
 *   npm run clarity:lint -- cw --module cw-m3-style
 *   npm run clarity:lint -- cw --changed           only modules changed since the last commit
 *   npm run clarity:lint -- cw --no-grammar        skip LanguageTool (fast)
 *   npm run clarity:lint -- cw --warnings          list warnings too, not just counts
 *   npm run clarity:lint -- cw --json out.json     write every finding to a file
 *
 * Exit code 1 when the course is `enforced` (scripts/clarity/courses.mjs) and
 * any ERROR is found. Warnings never fail the run; they are for the writer's
 * judgement.
 *
 * A finding that is wrong (a real name LanguageTool does not know, a quoted
 * mistake the course shows on purpose) goes in scripts/clarity/allow/<course>.json:
 *   { "words": ["Adeyemi"], "abbreviations": ["SEO"],
 *     "ignore": [{ "sid": "<sid printed in the report>", "rule": "lt:SOME_RULE" }] }
 */
import { execSync } from "node:child_process";
import { writeFileSync } from "node:fs";
import { courseOf } from "./courses.mjs";
import { extract } from "./extract.mjs";
import { grammarFindings, pool, saveCache, startGrammar, stopGrammar } from "./grammar.mjs";
import { plainFindings } from "./plain.mjs";
import { loadAllow, loadLedger, progressionFindings } from "./progression.mjs";

/** Every finding for a course (optionally limited to some modules). */
export async function lintCourse(course, { only = null, grammar = true } = {}) {
  const data = await extract(course, only);
  const allow = loadAllow(course.key);
  const ledger = loadLedger(course.key);
  const bySid = new Map(data.segments.map((s) => [s.sid, s]));
  const findings = [];

  for (const s of data.segments) for (const f of plainFindings(s)) findings.push({ ...f, sid: s.sid });

  if (grammar) {
    const lists = await pool(data.segments, 6, (s) => grammarFindings(s, course.language, allow.words));
    lists.forEach((list, i) => list.forEach((f) => findings.push({ ...f, sid: data.segments[i].sid })));
    saveCache();
  }

  findings.push(...progressionFindings(data, ledger, allow, only));

  const ignored = (f) => allow.ignore.some((x) => x.sid === f.sid && (!x.rule || x.rule === f.rule));
  const kept = findings.filter((f) => !ignored(f)).map((f) => {
    const s = bySid.get(f.sid);
    const [lessonId] = f.sid.split("|");
    return { ...f, moduleId: s?.moduleId || data.atoms.find((a) => a.lessonId === lessonId)?.moduleId || "?", lessonId, role: s?.role };
  });
  return { data, findings: kept };
}

function changedModules(course, modules) {
  let diff = "";
  try {
    diff = execSync("git status --porcelain", { encoding: "utf8" });
  } catch {
    return null;
  }
  return modules.filter((m) => diff.includes(m.lessonFile) || (m.assessFile && diff.includes(m.assessFile))).map((m) => m.id);
}

async function main() {
  const args = process.argv.slice(2);
  const key = args.find((a) => !a.startsWith("--") && !/\.json$/.test(a) && args[args.indexOf(a) - 1] !== "--module");
  if (!key) {
    console.error("Usage: npm run clarity:lint -- <course> [--module id] [--changed] [--no-grammar] [--warnings] [--json file]");
    process.exit(2);
  }
  const course = courseOf(key);
  let only = null;
  const mi = args.indexOf("--module");
  if (mi >= 0) only = args[mi + 1].split(",");
  if (args.includes("--changed")) {
    only = changedModules(course, await course.modules());
    if (only && !only.length) {
      console.log(`\nCLARITY · ${course.name}\n  No changed modules. Nothing to check.\n`);
      return;
    }
  }
  const grammar = !args.includes("--no-grammar");
  if (grammar && !(await startGrammar())) process.exit(2);

  let result;
  try {
    result = await lintCourse(course, { only, grammar });
  } finally {
    stopGrammar();
  }
  const { data, findings } = result;
  const errors = findings.filter((f) => f.severity === "error");
  const warns = findings.filter((f) => f.severity === "warn");

  const ji = args.indexOf("--json");
  if (ji >= 0) writeFileSync(args[ji + 1], JSON.stringify(findings, null, 1));

  console.log(`\nCLARITY · ${course.name}${only ? ` · ${only.join(", ")}` : ""}`);
  console.log(`  ${data.segments.length} pieces of learner text checked${grammar ? "" : " (grammar skipped)"}`);
  console.log(`  ${errors.length} error(s), ${warns.length} warning(s)\n`);

  const byRule = {};
  for (const f of findings) byRule[`${f.severity} ${f.rule}`] = (byRule[`${f.severity} ${f.rule}`] || 0) + 1;
  for (const [k, n] of Object.entries(byRule).sort((a, b) => b[1] - a[1]).slice(0, 25)) console.log(`    ${String(n).padStart(4)}  ${k}`);

  const byModule = {};
  for (const f of findings) {
    byModule[f.moduleId] ||= { error: 0, warn: 0 };
    byModule[f.moduleId][f.severity] += 1;
  }
  console.log("\n  By module (errors / warnings):");
  for (const m of data.modules) if (byModule[m.id]) console.log(`    ${m.id.padEnd(24)} ${String(byModule[m.id].error).padStart(4)} / ${byModule[m.id].warn}`);

  const show = args.includes("--warnings") ? findings : errors;
  if (show.length) {
    console.log(`\n  ${args.includes("--warnings") ? "Findings" : "Errors"}:`);
    for (const f of show.slice(0, 400)) {
      console.log(`    ${f.severity === "error" ? "✗" : "·"} [${f.rule}] ${f.sid}`);
      console.log(`        ${f.message}`);
      if (f.excerpt) console.log(`        > ${f.excerpt}`);
    }
    if (show.length > 400) console.log(`    … and ${show.length - 400} more (use --json to see all)`);
  }

  if (errors.length && course.enforced) {
    console.log(`\n  ✗ ${course.name} is enforced and has ${errors.length} error(s). Fix them before shipping.\n`);
    process.exit(1);
  }
  console.log(errors.length ? "\n  (course not enforced yet: reported only)\n" : "\n  ✓ no errors\n");
}

if (import.meta.url === `file:///${process.argv[1].replace(/\\/g, "/").replace(/^\//, "")}` || process.argv[1]?.endsWith("lint.mjs")) {
  main().catch((e) => {
    stopGrammar();
    console.error(e);
    process.exit(2);
  });
}
