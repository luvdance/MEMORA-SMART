/**
 * THE LAB DATABASE SERVER — PostgreSQL 18 (PGlite) in a Web Worker.
 *
 * One server per tab, started on the first request and reused by every SQL
 * lab and example. Each request resets it to a new installation and applies
 * the lab's setup (engine.js freshOn), so no run sees another's leftovers.
 * Requests are handled strictly one at a time.
 *
 * It lives in a worker so that a query that never ends (a recursive CTE with
 * no stop, a huge cross join) cannot freeze the page: the runner terminates
 * the worker and starts a new one. See runner.js.
 */
import { PGlite } from "@electric-sql/pglite";
import { compareResults, freshOn, gradeLab, lastResult, runOnFresh, runScript, sendQuery } from "./engine.js";
import { gradeApi, tryApi } from "./apiLab.js";

let server = null;
const start = () => (server ||= PGlite.create());

let queue = Promise.resolve();

async function handle({ id, op, payload = {} }) {
  try {
    const db = await start();
    const fresh = freshOn(db, payload.setup || "");
    let result;
    if (op === "start") {
      const res = await sendQuery(db, "SHOW server_version");
      result = { version: res.results[0]?.rows?.[0]?.[0] || "" };
    } else if (op === "run") {
      result = await runOnFresh(payload.sql || "", {
        fresh,
        schema: Boolean(payload.schema),
        stopOnError: payload.stopOnError ?? true,
      });
    } else if (op === "grade") {
      result = await gradeLab(payload.lab, payload.sql || "", { fresh, schema: Boolean(payload.schema) });
    } else if (op === "api-try") {
      result = await tryApi(payload.lab, payload.code || "", { fresh });
    } else if (op === "api-grade") {
      result = await gradeApi(payload.lab, payload.code || "", { fresh, runScript, lastResult, compareResults });
    } else {
      throw new Error(`Unknown request ${op}`);
    }
    self.postMessage({ id, ok: true, result });
  } catch (err) {
    self.postMessage({ id, ok: false, error: err?.message || String(err) });
  }
}

self.onmessage = (event) => {
  queue = queue.then(() => handle(event.data));
};
