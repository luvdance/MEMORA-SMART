/**
 * RUNNING REAL JAVASCRIPT IN THE BROWSER
 *
 * The Python course has to download a WebAssembly interpreter before a learner
 * can press Run. JavaScript does not: the browser already is the runtime. So
 * the cost question that shapes pyodideRunner.js does not arise here, and the
 * JavaScript lessons can offer "edit and run" on every snippet for free.
 *
 * WHERE THE CODE RUNS
 * In a dedicated Web Worker built from a Blob, never in the page. A worker has
 * no DOM, no access to the learner's session, cookies or local storage of the
 * Academy, and runs on its own thread. That gives us three things at once:
 *
 *   · a learner's `while (true) {}` cannot freeze the lesson. The worker is
 *     terminated after TIMEOUT_MS and the learner is told why;
 *   · nothing they type can read or change the Academy page around it;
 *   · every run starts from a clean global scope, so a `const` declared in one
 *     run cannot collide with the next one.
 *
 * WHAT "OUTPUT" MEANS
 * The lessons quote output exactly as Node.js prints it, because that is what
 * `npm run validate:content` checks every snippet against. `inspect()` below
 * reproduces Node's formatting for the values beginners actually print —
 * primitives, arrays, plain objects, class instances, Maps and Sets — so what
 * a learner sees here matches what the lesson says. It is deliberately not a
 * full util.inspect: very long arrays and deep nesting can wrap differently.
 */

const TIMEOUT_MS = 3000;

/**
 * Node-style formatting of a value as console.log would print it.
 *
 * Defined as a plain function so it can be serialised into the worker with
 * Function.prototype.toString, and imported directly by tests. It must not
 * reference anything outside its own body.
 */
export function inspect(value, top = true, depth = 0, seen = []) {
  const q = (s) => "'" + String(s).replace(/\\/g, "\\\\").replace(/'/g, "\\'") + "'";
  const key = (k) => (/^[A-Za-z_$][\w$]*$/.test(k) ? k : q(k));

  if (typeof value === "string") return top ? value : q(value);
  if (typeof value === "number") return Object.is(value, -0) ? "-0" : String(value);
  if (typeof value === "bigint") return value + "n";
  if (typeof value === "symbol") return value.toString();
  if (value === undefined) return "undefined";
  if (value === null) return "null";
  if (typeof value === "boolean") return String(value);

  if (typeof value === "function") {
    const src = Function.prototype.toString.call(value);
    if (/^class[\s{]/.test(src)) return value.name ? `[class ${value.name}]` : "[class (anonymous)]";
    return value.name ? `[Function: ${value.name}]` : "[Function (anonymous)]";
  }

  if (seen.includes(value)) return "[Circular *1]";
  if (depth > 2) return Array.isArray(value) ? "[Array]" : "[Object]";
  const next = [...seen, value];
  const inner = (v) => inspect(v, false, depth + 1, next);

  if (value instanceof Error) return value.stack || `${value.name}: ${value.message}`;
  if (value instanceof Date) return isNaN(value) ? "Invalid Date" : value.toISOString();
  if (value instanceof RegExp) return String(value);
  if (typeof Promise !== "undefined" && value instanceof Promise) return "Promise { <pending> }";

  if (value instanceof Map) {
    const parts = [...value].map(([k, v]) => `${inner(k)} => ${inner(v)}`);
    return parts.length ? `Map(${value.size}) { ${parts.join(", ")} }` : "Map(0) {}";
  }
  if (value instanceof Set) {
    const parts = [...value].map(inner);
    return parts.length ? `Set(${value.size}) { ${parts.join(", ")} }` : "Set(0) {}";
  }

  if (Array.isArray(value)) {
    const parts = [];
    let holes = 0;
    for (let i = 0; i < value.length; i += 1) {
      if (!(i in value)) {
        holes += 1;
        continue;
      }
      if (holes) {
        parts.push(`<${holes} empty item${holes > 1 ? "s" : ""}>`);
        holes = 0;
      }
      parts.push(inner(value[i]));
    }
    if (holes) parts.push(`<${holes} empty item${holes > 1 ? "s" : ""}>`);
    if (!parts.length) return "[]";
    const flat = `[ ${parts.join(", ")} ]`;
    return flat.length <= 72 ? flat : `[\n${parts.map((p) => "  " + p).join(",\n")}\n]`;
  }

  const proto = Object.getPrototypeOf(value);
  const ctor = proto && proto !== Object.prototype ? proto.constructor?.name : "";
  const prefix = proto === null ? "[Object: null prototype] " : ctor ? `${ctor} ` : "";
  const entries = Object.keys(value).map((k) => `${key(k)}: ${inner(value[k])}`);
  if (!entries.length) return `${prefix}{}`;
  const flat = `${prefix}{ ${entries.join(", ")} }`;
  return flat.length <= 72 ? flat : `${prefix}{\n${entries.map((p) => "  " + p).join(",\n")}\n}`;
}

/**
 * Format console.log arguments the way Node does: strings raw at the top
 * level, everything else inspected, joined by single spaces. `%s`, `%d` and
 * friends are not supported because no lesson uses them.
 */
export function formatArgs(args) {
  return args.map((a) => inspect(a, true)).join(" ");
}

/** The worker's whole program. Serialised, never called in the page. */
function workerMain() {
  // `inspect` and `formatArgs` resolve to the module functions here, and to
  // the copies serialised ahead of this function inside the worker.
  const lines = [];
  const push = (...args) => lines.push(formatArgs(args));
  const fakeConsole = {
    log: push,
    info: push,
    warn: push,
    error: push,
    debug: push,
    table: push,
  };

  let pending = 0;
  let finished = false;
  const finish = (error) => {
    if (finished) return;
    finished = true;
    self.postMessage({ stdout: lines.join("\n"), error: error || null });
  };
  const describe = (err) =>
    err && typeof err === "object" && "message" in err
      ? `${err.name || "Error"}: ${err.message}`
      : `Uncaught ${inspect(err, false)}`;

  // Track timers so the run is reported when the program has really finished,
  // which for asynchronous lessons is after the last timeout fires.
  const realSetTimeout = self.setTimeout.bind(self);
  const realClearTimeout = self.clearTimeout.bind(self);
  const live = new Set();
  self.setTimeout = (fn, ms, ...rest) => {
    pending += 1;
    const id = realSetTimeout(() => {
      live.delete(id);
      pending -= 1;
      try {
        if (typeof fn === "function") fn(...rest);
      } catch (err) {
        finish(describe(err));
      }
      settle();
    }, ms);
    live.add(id);
    return id;
  };
  self.clearTimeout = (id) => {
    if (live.delete(id)) pending -= 1;
    realClearTimeout(id);
    settle();
  };

  // An interval keeps the program alive until it is cleared, exactly as in
  // Node. One that is never cleared runs until the time limit stops it.
  const realSetInterval = self.setInterval.bind(self);
  const realClearInterval = self.clearInterval.bind(self);
  const intervals = new Set();
  self.setInterval = (fn, ms, ...rest) => {
    pending += 1;
    const id = realSetInterval(() => {
      try {
        if (typeof fn === "function") fn(...rest);
      } catch (err) {
        finish(describe(err));
      }
    }, ms);
    intervals.add(id);
    return id;
  };
  self.clearInterval = (id) => {
    if (intervals.delete(id)) pending -= 1;
    realClearInterval(id);
    settle();
  };

  // Network and body reads are asynchronous work too. Count them the same
  // way, so a lesson that awaits fetch() or response.json() is not reported
  // as finished before its output arrives.
  const track = (promise) => {
    pending += 1;
    return Promise.resolve(promise).finally(() => {
      pending -= 1;
      settle();
    });
  };
  if (typeof self.fetch === "function") {
    const realFetch = self.fetch.bind(self);
    self.fetch = (...args) => track(realFetch(...args));
  }
  if (typeof Response !== "undefined") {
    for (const method of ["json", "text", "blob", "arrayBuffer", "formData"]) {
      const real = Response.prototype[method];
      if (typeof real !== "function" || real.tracked) continue;
      const wrapped = function (...args) {
        return track(real.apply(this, args));
      };
      wrapped.tracked = true;
      Response.prototype[method] = wrapped;
    }
  }

  function settle() {
    // Let queued promise callbacks run, then wait a moment of genuine
    // idleness before deciding nothing is left to print.
    realSetTimeout(() => {
      if (pending !== 0) return;
      realSetTimeout(() => {
        if (pending === 0) finish(null);
      }, 20);
    }, 0);
  }

  self.addEventListener("unhandledrejection", (event) => {
    event.preventDefault();
    finish(describe(event.reason));
  });

  self.onmessage = (event) => {
    try {
      // `console` is shadowed by a parameter, so the learner's code writes to
      // our buffer. Sloppy-mode Function, to match a classic browser script
      // and the .cjs files the content validator runs in Node.
      // Lessons on ES modules run strict, as a real module would.
      const source = event.data.strict ? `"use strict";\n${event.data.code}` : event.data.code;
      const run = new Function("console", "prompt", "alert", source);
      run(
        fakeConsole,
        () => null,
        (msg) => push(String(msg))
      );
    } catch (err) {
      finish(describe(err));
      return;
    }
    settle();
  };
}

/**
 * The exact program the worker runs. Exported so `npm run test:academy` can
 * execute it headlessly against every lesson snippet and prove the in-browser
 * output matches what Node printed.
 */
export function buildWorkerSource() {
  return [
    `const inspect = ${inspect.toString()};`,
    `const formatArgs = ${formatArgs.toString()};`,
    `(${workerMain.toString()})();`,
  ].join("\n");
}

let workerUrl = null;
function getWorkerUrl() {
  if (workerUrl) return workerUrl;
  workerUrl = URL.createObjectURL(new Blob([buildWorkerSource()], { type: "text/javascript" }));
  return workerUrl;
}

/**
 * Run a snippet and resolve with { stdout, error }.
 *
 * Never rejects for a problem in the learner's code: a thrown error, an
 * unhandled rejection or a timeout are all results to show, not failures of
 * the runner. It rejects only when the browser cannot start a worker at all.
 */
export function runJavaScript(code, { strict = false } = {}) {
  return new Promise((resolve, reject) => {
    let worker;
    try {
      worker = new Worker(getWorkerUrl());
    } catch {
      reject(new Error("This browser could not start the code runner."));
      return;
    }

    const timer = setTimeout(() => {
      worker.terminate();
      resolve({
        stdout: "",
        error:
          `Stopped after ${TIMEOUT_MS / 1000} seconds. The most likely cause is a loop ` +
          "whose condition never becomes false.",
      });
    }, TIMEOUT_MS);

    worker.onmessage = (event) => {
      clearTimeout(timer);
      worker.terminate();
      resolve(event.data);
    };
    worker.onerror = (event) => {
      event.preventDefault?.();
      clearTimeout(timer);
      worker.terminate();
      resolve({ stdout: "", error: event.message || "The code could not be run." });
    };

    worker.postMessage({ code, strict });
  });
}
