/**
 * THE BACKEND LAB SERVER — a Node.js machine (public/lab/node-runtime.js)
 * and, for labs that have one, PostgreSQL 18 (PGlite), in a Web Worker.
 *
 * One machine runs at a time: the project the learner is working on, started
 * with the lab's command. Its stdout/stderr stream back to the page as it
 * prints. A request from the page's request panel goes to the running
 * server like any other client's. Grading starts fresh machines of its own
 * (src/academy/node/grade.js), so a check never sees the learner's
 * experiments.
 *
 * In a worker so that a program that never yields (while (true) {}) cannot
 * freeze the page: the runner (runner.js) terminates the worker and starts
 * a new one.
 */
import { runLab, labCommand, databaseConfig } from "./grade.js";
import { NODE_RUNTIME_VERSION, NODE_TYPESCRIPT_VERSION } from "./runtimeVersion.js";

let runtimePromise = null;
const loadRuntime = () => (runtimePromise ||= import(/* @vite-ignore */ `${self.location.origin}/lab/node-runtime.js?v=${NODE_RUNTIME_VERSION}`));

// The TypeScript compiler and type definitions (several megabytes) load the first time a lab runs tsc.
let tsPromise = null;
const typecheck = async (files) => {
  tsPromise ||= import(/* @vite-ignore */ `${self.location.origin}/lab/node-typescript.js?v=${NODE_TYPESCRIPT_VERSION}`);
  return (await tsPromise).typecheckProject(files);
};

/** The runtime, with this host's TypeScript checker attached to every machine. */
const runtime = async () => {
  const rt = await loadRuntime();
  return {
    ...rt,
    createMachine: (opts) => {
      const machine = rt.createMachine(opts);
      machine.extensions.typecheck = typecheck;
      return machine;
    },
  };
};

let dbPromise = null;
let engine = null;
async function freshDatabase(setup) {
  dbPromise ||= import("@electric-sql/pglite").then(({ PGlite }) => PGlite.create());
  engine ||= await import("../sql/engine.js");
  const db = await dbPromise;
  await engine.resetDatabase(db);
  if (setup && setup.trim()) {
    const run = await engine.runScript(db, setup);
    if (run.error) throw new Error(`The lab's setup SQL fails: ${engine.formatError(run.error)}`);
  }
  return db;
}

let machine = null;
let lastLab = null;

const post = (msg) => self.postMessage(msg);

async function start({ lab, files, command }) {
  const { createMachine } = await runtime();
  machine?.stop();
  const dbConf = databaseConfig(lab);
  const db = dbConf ? await freshDatabase(dbConf.setup || "") : null;
  lastLab = lab;
  machine = createMachine({
    files,
    env: { ...(lab.env || {}) },
    database: db ? { db, ...dbConf, version: "18.0" } : null,
    services: lab.services,
    stdin: lab.stdin,
    redis: lab.redis ? (lab.redis === true ? {} : lab.redis) : null,
    mail: lab.mail ? (lab.mail === true ? {} : lab.mail) : null,
    strictDependencies: lab.strictDependencies,
  });
  const mine = machine;
  machine.onOutput = (stream, text) => {
    if (machine === mine) post({ type: "output", stream, text });
  };
  machine.onExit = (code) => {
    if (machine === mine) post({ type: "exit", code });
  };
  const cmd = command || labCommand(lab, files);
  const state = cmd ? await machine.run(cmd) : "idle";
  return { state, command: cmd, ports: [...machine.network.servers.keys()], exitCode: machine.exitCode, files: machine.vol.snapshot() };
}

async function handle({ id, op, payload = {} }) {
  try {
    let result;
    if (op === "start") result = await start(payload);
    else if (op === "request") {
      if (!machine || machine.exited) throw new Error("The server is not running. Press Run to start it.");
      const r = await machine.request(payload);
      result = { ...r, files: machine.vol.snapshot() };
    } else if (op === "stop") {
      machine?.signal(payload.signal || "SIGINT");
      result = { exitCode: machine?.exitCode ?? null };
    } else if (op === "files") {
      result = machine ? machine.vol.snapshot() : {};
    } else if (op === "grade") {
      machine?.stop();
      machine = null;
      const { createMachine } = await runtime();
      result = await runLab(payload.lab, payload.files, { createMachine, freshDatabase });
    } else if (op === "warm") {
      await runtime();
      result = { ok: true, lab: Boolean(lastLab) };
    } else throw new Error(`Unknown request ${op}`);
    post({ id, ok: true, result });
  } catch (err) {
    post({ id, ok: false, error: err?.message || String(err) });
  }
}

let queue = Promise.resolve();
self.onmessage = (event) => {
  const msg = event.data;
  // A request to the running server must not wait behind a long grade or start.
  if (msg.op === "request" || msg.op === "stop") handle(msg);
  else queue = queue.then(() => handle(msg));
};
