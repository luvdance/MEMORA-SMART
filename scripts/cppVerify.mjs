/**
 * Compile and run every C++ program in the C++ course with g++, the same
 * checks validateContent.mjs makes, without the rest of the (slow) content
 * validation. Handy after editing C++ lessons.
 *
 *   node scripts/cppVerify.mjs
 */
import { verifySnippets, findCompiler, fillVariants } from "../lib/academy/cpp/run.mjs";

const { CPP_LESSONS } = await import("../src/academy/data/lessons/cp-registry.js");
const { ITEMS } = await import("../lib/academy/finalExam/cpp/bank.js");

const snippets = [];
for (const lessons of Object.values(CPP_LESSONS)) {
  for (const lesson of lessons) {
    for (const atom of lesson.atoms) {
      for (const spec of [atom.code, atom.codeExercise]) {
        if (!spec?.code) continue;
        if (spec.language === "pseudocode" && spec.equivalentCpp) {
          snippets.push({ id: atom.id, ...spec, code: spec.equivalentCpp });
        } else if (spec.language === "cpp") {
          snippets.push({ id: atom.id, ...spec });
        }
      }
      const fill = atom.codeFill;
      if (fill) {
        for (const v of fillVariants(fill)) {
          snippets.push({
            id: `${atom.id} (codeFill ${v.label})`,
            code: v.code,
            expectedOutput: fill.expectedOutput,
            inputs: fill.inputs,
            files: fill.files,
            std: fill.std,
          });
        }
      }
    }
  }
}
for (const item of ITEMS.filter((i) => i.type === "predict")) {
  snippets.push({ id: item.id, code: item.code, expectedOutput: item.expectedOutput, compileWarning: item.compileWarning });
}

const compiler = findCompiler();
if (!compiler) {
  console.log("No g++ found: nothing verified.");
  process.exit(1);
}
const result = await verifySnippets(snippets, compiler);
console.log(`${result.checked} of ${snippets.length} C++ programs compiled with ${compiler.version} and verified`);
for (const e of result.errors) console.log("  - " + e);
process.exit(result.errors.length ? 1 : 0);
