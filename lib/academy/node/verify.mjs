/**
 * Proves backend labs at build time: for every `nodeLab`, the model answer
 * (starter files + solution) must pass every check, and the starter must
 * fail at least one, so a lab can never ship unsolvable or already solved.
 * Labs run in parallel worker threads (labWorker.mjs).
 *
 *   const { failures } = await verifyNodeLabs([{ id, lab }], { workers: 4 });
 */
import { Worker } from "node:worker_threads";
import { availableParallelism } from "node:os";

const WORKER = new URL("./labWorker.mjs", import.meta.url);

function startWorker() {
  const w = new Worker(WORKER);
  let seq = 0;
  const pending = new Map();
  const ready = new Promise((resolve, reject) => {
    w.once("error", reject);
    w.on("message", (msg) => {
      if (msg.ready) return resolve();
      const job = pending.get(msg.id);
      if (!job) return;
      pending.delete(msg.id);
      if (msg.error) job.reject(new Error(msg.error));
      else job.resolve(msg.result);
    });
  });
  return {
    ready,
    run(lab, files) {
      const id = ++seq;
      return new Promise((resolve, reject) => {
        pending.set(id, { resolve, reject });
        w.postMessage({ id, lab, files });
      });
    },
    stop: () => w.terminate(),
  };
}

export function solvedFiles(lab) {
  const out = { ...(lab.files || {}) };
  for (const [name, content] of Object.entries(lab.solution || {})) {
    if (content === null) delete out[name];
    else out[name] = content;
  }
  return out;
}

/**
 * items: [{ id, lab }]. Returns { failures: [{ id, problem, details }], results }.
 * Each lab may set `mustFail` (extra wrong answers: [{ files, why }]) to prove
 * the checks catch a specific mistake.
 */
export async function verifyNodeLabs(items, { workers = Math.min(4, Math.max(1, availableParallelism() - 1)), onProgress } = {}) {
  const pool = Array.from({ length: Math.min(workers, Math.max(1, items.length)) }, startWorker);
  await Promise.all(pool.map((w) => w.ready));
  const failures = [];
  const results = [];
  let next = 0;
  let done = 0;
  const work = async (w) => {
    for (;;) {
      const i = next++;
      if (i >= items.length) return;
      const { id, lab } = items[i];
      try {
        const model = await w.run(lab, solvedFiles(lab));
        if (!model.passed) {
          const bad = model.checks.filter((c) => !c.passed);
          failures.push({ id, problem: "the model answer fails", details: `${bad.map((c) => `✗ ${c.label}: ${c.message}`).join("\n")}\n--- output ---\n${model.output.slice(-3000)}` });
        }
        const starter = await w.run(lab, { ...(lab.files || {}) });
        if (starter.passed) failures.push({ id, problem: "the starter already passes every check", details: "" });
        for (const wrong of lab.mustFail || []) {
          const r = await w.run(lab, { ...solvedFiles(lab), ...wrong.files });
          if (r.passed) failures.push({ id, problem: `a wrong answer passes (${wrong.why})`, details: "" });
        }
        results.push({ id, model, starter });
      } catch (err) {
        failures.push({ id, problem: "the lab could not run", details: err.message });
      }
      done += 1;
      onProgress?.(done, items.length, id);
    }
  };
  await Promise.all(pool.map(work));
  await Promise.all(pool.map((w) => w.stop()));
  return { failures, results };
}
