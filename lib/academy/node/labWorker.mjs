/**
 * Runs backend labs in Node, in a worker thread (the lab machine replaces
 * Date and the timers with its virtual clock; a worker keeps that away from
 * the validator). The same runtime bundle as the browser, the same grader
 * (src/academy/node/grade.js) and the same PostgreSQL engine (PGlite).
 *
 * Message in:  { id, lab, files }       → message out: { id, result } | { id, error }
 */
import { parentPort } from "node:worker_threads";
import { pathToFileURL } from "node:url";
import { join } from "node:path";

const ROOT = new URL("../../../", import.meta.url);
const runtime = await import(new URL("public/lab/node-runtime.js", ROOT).href);
let ts = null;
const typecheck = async (files) => {
  ts ||= await import(new URL("public/lab/node-typescript.js", ROOT).href);
  return ts.typecheckProject(files);
};
const createMachine = (opts) => {
  const machine = runtime.createMachine(opts);
  machine.extensions.typecheck = typecheck;
  return machine;
};
const { runLab } = await import(new URL("src/academy/node/grade.js", ROOT).href);
const { resetDatabase, runScript, formatError } = await import(new URL("src/academy/sql/engine.js", ROOT).href);
const { PGlite } = await import(pathToFileURL(join(new URL(".", ROOT).pathname.replace(/^\/([A-Za-z]:)/, "$1"), "node_modules/@electric-sql/pglite/dist/index.js")).href);

let db = null;
async function freshDatabase(setup) {
  db ||= await PGlite.create();
  await resetDatabase(db);
  if (setup && setup.trim()) {
    const run = await runScript(db, setup);
    if (run.error) throw new Error(`The lab's setup SQL fails: ${formatError(run.error)}`);
  }
  return db;
}

let queue = Promise.resolve();
parentPort.on("message", ({ id, lab, files }) => {
  queue = queue.then(async () => {
    try {
      const result = await runLab(lab, files, { createMachine, freshDatabase });
      parentPort.postMessage({ id, result });
    } catch (err) {
      parentPort.postMessage({ id, error: err?.stack || String(err) });
    }
  });
});
parentPort.postMessage({ ready: true });
