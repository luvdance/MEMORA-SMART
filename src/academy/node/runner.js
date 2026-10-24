/**
 * Talks to the backend lab worker (nodeWorker.js) from the page.
 *
 * The lab's Node.js runtime is a few megabytes, so it is fetched the first
 * time a learner presses Run, then reused for the rest of the visit.
 *
 * A call that runs longer than its limit terminates the worker — the only
 * way to stop JavaScript that never yields, such as `while (true) {}` — and
 * the next call starts a new one.
 */

const LIMITS = { start: 120000, request: 30000, grade: 180000, stop: 10000, files: 10000, warm: 120000 };

let worker = null;
let seq = 0;
const pending = new Map();
const listeners = new Set();

function failAll(message) {
  for (const { reject, timer } of pending.values()) {
    clearTimeout(timer);
    reject(new Error(message));
  }
  pending.clear();
}

function boot() {
  worker = new Worker(new URL("./nodeWorker.js", import.meta.url), { type: "module" });
  worker.onmessage = ({ data }) => {
    if (data.type) {
      for (const fn of listeners) fn(data);
      return;
    }
    const job = pending.get(data.id);
    if (!job) return;
    pending.delete(data.id);
    clearTimeout(job.timer);
    if (data.ok) job.resolve(data.result);
    else job.reject(new Error(data.error));
  };
  worker.onerror = (event) => {
    event.preventDefault?.();
    stopWorker();
    failAll("The lab machine stopped unexpectedly. Press Run to start it again.");
  };
}

function stopWorker() {
  worker?.terminate();
  worker = null;
}

function call(op, payload) {
  if (!worker) boot();
  const id = ++seq;
  const limit = LIMITS[op] || 30000;
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      pending.delete(id);
      stopWorker();
      failAll("The lab machine was restarted.");
      for (const fn of listeners) fn({ type: "killed" });
      reject(
        new Error(
          `Your program ran for more than ${limit / 1000} seconds without finishing, so the lab machine stopped it. Look for a loop that never ends (a while loop whose condition never becomes false) or code that keeps the CPU busy without ever awaiting.`
        )
      );
    }, limit);
    pending.set(id, { resolve, reject, timer });
    worker.postMessage({ id, op, payload });
  });
}

/** Output and exit events from the running program: { type: "output", stream, text } | { type: "exit", code } | { type: "killed" }. */
export function onMachineEvent(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

/** Start the project with the lab's command (replacing whatever was running). */
export function startProgram(lab, files, command) {
  return call("start", { lab, files, command });
}

/** Send an HTTP request to the running server. */
export function sendRequest(req) {
  return call("request", req);
}

/** Stop the running program, as Ctrl+C does (SIGINT). */
export function stopProgram(signal = "SIGINT") {
  return call("stop", { signal });
}

/** Grade: fresh machine(s), the lab's checks. Resolves { passed, checks, output, exitCode }. */
export function gradeProgram(lab, files) {
  return call("grade", { lab, files });
}

/** Fetch the runtime ahead of time (after the learner's first Run). */
export function warmUp() {
  return call("warm", {});
}
