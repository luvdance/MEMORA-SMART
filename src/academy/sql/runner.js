/**
 * Talks to the lab database server (sqlWorker.js) from the page.
 *
 * Nothing is downloaded until a learner presses a button that says so:
 * PostgreSQL in the browser is several megabytes. Once started it stays up
 * for the rest of the visit and every lab shares it.
 *
 * A request that runs longer than its limit terminates the worker, which is
 * the only way to stop a WebAssembly query mid-flight. The next request
 * starts a new server.
 */

const RUN_LIMIT_MS = 15000;
const START_LIMIT_MS = 180000;

let worker = null;
// `started`: a server is up right now. `consented`: the learner has started
// one this visit, so a server stopped after a runaway query is restarted on
// the next Run without asking again (its files are already cached).
let started = false;
let consented = false;
let seq = 0;
const pending = new Map();
const listeners = new Set();

function notify() {
  for (const fn of listeners) fn(consented);
}

/** Subscribe to "the database is available" changes. Returns an unsubscribe. */
export function onDatabaseReady(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

/** True once the learner has started PostgreSQL in this visit. */
export function isDatabaseReady() {
  return consented;
}

function failAll(message) {
  for (const { reject, timer } of pending.values()) {
    clearTimeout(timer);
    reject(new Error(message));
  }
  pending.clear();
}

function boot() {
  worker = new Worker(new URL("./sqlWorker.js", import.meta.url), { type: "module" });
  worker.onmessage = ({ data }) => {
    const job = pending.get(data.id);
    if (!job) return;
    pending.delete(data.id);
    clearTimeout(job.timer);
    if (data.ok) job.resolve(data.result);
    else job.reject(new Error(data.error));
  };
  worker.onerror = (event) => {
    event.preventDefault?.();
    stop();
    failAll("The database stopped unexpectedly. Press Run again to restart it.");
  };
}

function stop() {
  worker?.terminate();
  worker = null;
  started = false;
}

function call(op, payload) {
  if (!worker) boot();
  const id = ++seq;
  const running = started;
  // A grade runs the model answer and then the learner's SQL, each on a
  // freshly built database, so it gets twice a run's time.
  const limit = !running ? START_LIMIT_MS : op === "grade" || op === "api-grade" ? RUN_LIMIT_MS * 2 : RUN_LIMIT_MS;
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      pending.delete(id);
      stop();
      failAll("Stopped: the SQL ran for too long.");
      reject(
        new Error(
          running
            ? `It ran for more than ${limit / 1000} seconds, so it was stopped. Look for something with no end: a recursive CTE with no stopping condition, a join with no ON condition, or a loop that never exits.`
            : "PostgreSQL did not start. Check your connection and press the button again."
        )
      );
    }, limit);
    pending.set(id, { resolve, reject, timer });
    worker.postMessage({ id, op, payload });
  });
}

/** Start (or confirm) the server. Resolves with its version, e.g. "18.6". */
export async function startDatabase() {
  if (started) return "";
  const res = await call("start", {});
  started = true;
  if (!consented) {
    consented = true;
    notify();
  }
  return res.version;
}

/** Run a script on a fresh database with `setup` applied. */
export async function runSql({ setup = "", sql, schema = false, stopOnError = true }) {
  await startDatabase();
  return call("run", { setup, sql, schema, stopOnError });
}

/** Backend lab: load the learner's routes and send the lab's requests (ungraded). */
export async function tryApiLab({ setup = "", lab, code }) {
  await startDatabase();
  return call("api-try", { setup, lab, code });
}

/** Backend lab: the model answer's responses first, then the learner's, compared. */
export async function gradeApiLab({ setup = "", lab, code }) {
  await startDatabase();
  return call("api-grade", { setup, lab, code });
}

/** Grade a lab: the model answer first, then the learner's SQL, then the checks. */
export async function gradeSql({ setup = "", lab, sql, schema = false }) {
  await startDatabase();
  return call("grade", { setup, lab, sql, schema });
}
