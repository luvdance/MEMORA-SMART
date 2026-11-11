/**
 * Fast check of the Computer Networking course (NW-101).
 *
 *   node scripts/nwCheck.mjs            every written module
 *   node scripts/nwCheck.mjs nw-m3      modules whose id starts with nw-m3
 *   node scripts/nwCheck.mjs --sync     also rewrite the outline's atom counts
 *                                       and both registries
 *
 * The checks themselves live in lib/academy/network/check.mjs, which the
 * build (validateContent) runs too.
 */
import { checkNetworking } from "../lib/academy/network/check.mjs";

const args = process.argv.slice(2);
const { errors, stats } = await checkNetworking({
  sync: args.includes("--sync"),
  filter: args.find((a) => !a.startsWith("--")) || "",
});
console.log(Object.entries(stats).map(([k, v]) => `${k} ${v}`).join(" · "));
if (errors.length) {
  console.log(`\n${errors.length} problem(s):`);
  for (const e of errors) console.log(" ✗", e);
  process.exit(1);
}
console.log("all good");
