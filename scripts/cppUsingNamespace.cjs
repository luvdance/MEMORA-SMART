/**
 * One-off transform for the C++ course: after Lesson 5's "using namespace
 * std" atom, programs write plain cout instead of std::cout.
 *
 *   node scripts/cppUsingNamespace.cjs
 *
 * For each region it transforms:
 *   - adds `using namespace std;` under the #include lines of every program
 *     (template-literal code and "\n"-escaped example text alike);
 *   - removes `std::` qualifiers from code and prose;
 *   - in codeFill `answers`, makes the plain form the model answer and keeps
 *     the std:: form as an accepted alternative.
 * Atoms where std:: is the point (header files, the namespaces lesson) are
 * left untouched. Idempotent: running it twice changes nothing more.
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const KEEP = "STDKEEP__";

/** Read a JS string/template token starting at s[i]; return its end index. */
function tokenEnd(s, i) {
  let q = s[i];
  if (q === "C" && s[i + 1] === "`") {
    i += 1;
    q = "`";
  }
  for (let j = i + 1; j < s.length; j++) {
    if (s[j] === "\\") { j++; continue; }
    if (s[j] === q) return j + 1;
  }
  throw new Error("unterminated string at " + i);
}

function rewriteAnswers(s) {
  let out = "";
  let pos = 0;
  const marker = "answers: [";
  for (;;) {
    const at = s.indexOf(marker, pos);
    if (at < 0) break;
    let i = at + marker.length;
    out += s.slice(pos, i);
    const tokens = [];
    let lead = null;
    let tail = "";
    for (;;) {
      const ws = /^[\s,]*/.exec(s.slice(i))[0];
      if (s[i + ws.length] === "]") { tail = ws.replace(/,/g, ""); i += ws.length; break; }
      if (lead === null) lead = ws;
      i += ws.length;
      const end = tokenEnd(s, i);
      tokens.push(s.slice(i, end));
      i = end;
    }
    const next = [];
    for (const t of tokens) {
      const variants = t.includes("std::")
        ? [t.replace(/std::/g, ""), t.replace(/std::/g, KEEP)]
        : [t];
      for (const v of variants) {
        const key = v.replace(new RegExp(KEEP, "g"), "std::");
        if (!next.some((n) => n.replace(new RegExp(KEEP, "g"), "std::") === key)) next.push(v);
      }
    }
    const sep = lead && lead.includes("\n") ? "," + lead : ", ";
    out += (lead || "") + next.join(sep) + tail;
    pos = i;
  }
  return out + s.slice(pos);
}

function addUsing(s) {
  // Remove a using-directive that sits BETWEEN #include lines (left by an
  // earlier version of this script); the one under the last include stays.
  s = s.replace(/^using namespace std;\r?\n(?=#include )/gm, "");
  s = s.replace(/( *)using namespace std;\\n(?= *#include )/g, "");
  // Real newlines (template-literal code). The lookahead refuses to stop in
  // the middle of an include block, so the line always lands after the last.
  // A program's first line usually sits right after the template's C`, so a
  // block may start there as well as at the start of a line.
  s = s.replace(
    /((?:^|(?<=C`))#include <[^>\n]+>\r?\n(?:#include <[^>\n]+>\r?\n)*)(?!#include |using namespace std;)/gm,
    "$1using namespace std;\n"
  );
  // "\n"-escaped code inside ordinary strings (examples, prompts).
  s = s.replace(/((?:( *)#include <[^>\\]+>\\n)+)(?! *#include | *using namespace std;)/g, (m, block, indent) =>
    `${block}${indent}using namespace std;\\n`
  );
  return s;
}

function transform(s) {
  s = rewriteAnswers(s);
  s = addUsing(s);
  s = s.replace(/std::/g, "");
  return s.replace(new RegExp(KEEP, "g"), "std::");
}

/** Transform s outside the given atom ids' regions. */
function transformExcept(s, skipAtomIds = []) {
  const cuts = [];
  for (const id of skipAtomIds) {
    const a = s.indexOf(`id: "${id}"`);
    if (a < 0) throw new Error("no atom " + id);
    const start = s.lastIndexOf("\n      {", a);
    const nextAtom = s.indexOf('\n        id: "a-', a + 5);
    const nextTask = s.indexOf("\n    task:", a);
    const ends = [nextAtom, nextTask].filter((x) => x > 0);
    const end = ends.length ? Math.min(...ends) : s.length;
    cuts.push([start, end]);
  }
  cuts.sort((x, y) => x[0] - y[0]);
  let out = "";
  let pos = 0;
  for (const [a, b] of cuts) {
    out += transform(s.slice(pos, a)) + s.slice(a, b);
    pos = b;
  }
  return out + transform(s.slice(pos));
}

function edit(rel, fn) {
  const f = path.join(ROOT, rel);
  const before = fs.readFileSync(f, "utf8");
  const after = fn(before);
  if (after !== before) fs.writeFileSync(f, after);
  console.log((after !== before ? "changed  " : "unchanged") + " " + rel);
}

// Module 1: only from the atom after "using namespace std" onwards.
edit("src/academy/data/lessons/cp-m1-intro.js", (s) => {
  const at = s.lastIndexOf("\n      {", s.indexOf('id: "a-cp-text-exact"'));
  return s.slice(0, at) + transform(s.slice(at));
});
edit("lib/academy/assessments/cp-m1-intro.js", (s) => {
  const a = s.indexOf('  "cp-l2-programs": {');
  const b = s.indexOf('  "cp-l4a-setup": {');
  const c = s.indexOf('  "cp-l4c-printing": {');
  return s.slice(0, a) + transform(s.slice(a, b)) + s.slice(b, c) + transform(s.slice(c));
});

const MODULES = [
  "m2-variables", "m3-operators", "m4-control", "m5-functions", "m6-arrays", "m7-strings",
  "m8-pointers", "m9-classes", "m10-inheritance", "m11-exceptions-files", "m12-templates-stl",
  "m13-dsa", "m14-modern", "m15-debugging", "m16-capstone",
];
const SKIP = {
  "m9-classes": ["a-cp-class-files"],
  "m15-debugging": ["a-cp-namespaces"],
};
for (const m of MODULES) {
  edit(`src/academy/data/lessons/cp-${m}.js`, (s) => transformExcept(s, SKIP[m]));
  edit(`lib/academy/assessments/cp-${m}.js`, transform);
}
edit("lib/academy/finalExam/cpp/bank.js", transform);
edit("lib/academy/finalExam/cpp/blueprint.js", transform);
edit("src/academy/data/cppCourse.js", transform);
