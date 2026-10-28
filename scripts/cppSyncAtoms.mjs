/**
 * Sync each C++ module's `atoms:` count in cppCourse.js with the written
 * lessons. The self-test requires the two to match.
 *
 *   node scripts/cppSyncAtoms.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";

const course = new URL("../src/academy/data/cppCourse.js", import.meta.url);
const { CPP_LESSONS } = await import("../src/academy/data/lessons/cp-registry.js");

let src = readFileSync(course, "utf8");
for (const [id, lessons] of Object.entries(CPP_LESSONS)) {
  const atoms = lessons.reduce((n, l) => n + l.atoms.length, 0);
  const at = src.indexOf(`id: "${id}",`);
  const field = src.indexOf("atoms: ", at);
  if (at < 0 || field < 0) throw new Error(`no outline entry for ${id}`);
  const end = field + "atoms: ".length;
  const digits = /^\d+/.exec(src.slice(end))[0];
  src = src.slice(0, end) + atoms + src.slice(end + digits.length);
  console.log(id.padEnd(26), digits === String(atoms) ? atoms : `${digits} -> ${atoms}`);
}
writeFileSync(course, src);
