/**
 * THE DIFFERENTIAL CHECK — the lab machine against real Node.js.
 *
 * A backend lab runs in the page on the lab's Node.js (src/academy/node).
 * This proves that what it does is what Node does: the same project is run
 * on the real Node.js that runs this script (with the same npm packages,
 * from scripts/node-lab), the same requests are sent to both, and the
 * responses must match — status, headers and body — apart from what
 * differs between any two runs (the Date header, generated ids).
 *
 *   const diffs = await differential({ files, command, requests, env });
 *
 * Projects that need the lab's PostgreSQL, external services or the lab
 * clock are not compared here (they would need the same services on both
 * sides); their behaviour rests on the same runtime this check covers.
 */
import { spawn, spawnSync } from "node:child_process";
import { mkdirSync, mkdtempSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("../../../", import.meta.url));
const MODULES = join(ROOT, "scripts", "node-lab", "node_modules");

/** Headers whose values differ between any two runs. */
const VOLATILE = new Set(["date", "keep-alive", "connection"]);

function parseCommand(command) {
  const words = command.trim().split(/\s+/);
  if (words[0] === "npm") return null;
  if (words[0] !== "node") return null;
  return words.slice(1);
}

async function freePort() {
  const net = await import("node:net");
  return new Promise((resolve) => {
    const s = net.createServer();
    s.listen(0, () => {
      const { port } = s.address();
      s.close(() => resolve(port));
    });
  });
}

/** Run the project on real Node.js and send the requests. */
async function realNode({ files, command, requests, env = {}, port: fixedPort }) {
  const dir = mkdtempSync(join(tmpdir(), "be-diff-"));
  try {
    for (const [name, content] of Object.entries(files)) {
      const file = join(dir, name);
      mkdirSync(dirname(file), { recursive: true });
      writeFileSync(file, content);
    }
    symlinkSync(MODULES, join(dir, "node_modules"), "junction");
    const port = fixedPort || (await freePort());
    let args = parseCommand(command);
    if (!args) {
      const pkg = JSON.parse(files["package.json"] || "{}");
      args = parseCommand(pkg.scripts?.start || "node server.js");
    }
    // Like the lab machine: no NODE_ENV unless the lab sets one (an empty value would be a value).
    const childEnv = { ...process.env, ...env, PORT: String(port), TZ: "UTC" };
    if (env.NODE_ENV === undefined) delete childEnv.NODE_ENV;
    const child = spawn(process.execPath, args, { cwd: dir, env: childEnv, stdio: ["ignore", "pipe", "pipe"] });
    let output = "";
    child.stdout.on("data", (d) => (output += d));
    child.stderr.on("data", (d) => (output += d));
    // Wait for the port to accept connections (a bare TCP connect: no HTTP request the project would count or log).
    const net = await import("node:net");
    const t0 = Date.now();
    for (;;) {
      const open = await new Promise((resolve) => {
        const s = net.connect(requests[0]?.port || port, "localhost");
        s.once("connect", () => {
          s.destroy();
          resolve(true);
        });
        s.once("error", () => resolve(false));
      });
      if (open) break;
      {
        if (Date.now() - t0 > 8000 || child.exitCode !== null) break;
        await new Promise((r) => setTimeout(r, 50));
      }
    }
    const responses = [];
    for (const req of requests) {
      try {
        const res = await fetch(`http://localhost:${req.port || port}${req.path}`, { method: req.method || "GET", redirect: "manual", headers: req.headers, body: req.body === undefined ? undefined : typeof req.body === "string" ? req.body : JSON.stringify(req.body) });
        const headers = {};
        res.headers.forEach((v, k) => (headers[k] = v));
        responses.push({ status: res.status, headers, text: await res.text() });
      } catch (err) {
        responses.push({ status: 0, error: err.cause?.code || err.message });
      }
    }
    if (process.platform === "win32") spawnSync("taskkill", ["/pid", String(child.pid), "/T", "/F"], { stdio: "ignore" });
    else child.kill();
    return { responses, output };
  } finally {
    try {
      rmSync(dir, { recursive: true, force: true });
    } catch {
      /* Windows may hold the folder briefly */
    }
  }
}

/** Run the same project on the lab machine (in a worker thread) and send the requests. */
async function labMachine({ files, command, requests, env = {} }) {
  const { Worker } = await import("node:worker_threads");
  const code = `
    const { parentPort, workerData } = require("node:worker_threads");
    (async () => {
      const { createMachine } = await import(${JSON.stringify(new URL("public/lab/node-runtime.js", `file:///${ROOT.replace(/\\/g, "/")}`).href)});
      const { files, command, requests, env } = workerData;
      const m = createMachine({ files, env: { PORT: "3000", ...env } });
      await m.run(command);
      const responses = [];
      for (const req of requests) {
        const headers = { ...(req.headers || {}) };
        const r = await m.request({ method: req.method || "GET", path: req.path, port: req.port, headers, body: req.body === undefined ? undefined : typeof req.body === "string" ? req.body : JSON.stringify(req.body) });
        responses.push(r.status ? { status: r.status, headers: r.headers, text: r.text } : { status: 0, error: r.code || r.error });
      }
      parentPort.postMessage({ responses, output: m.outputText() });
      m.stop();
    })().catch((e) => parentPort.postMessage({ error: String(e && e.stack || e) }));
  `;
  const w = new Worker(code, { eval: true, workerData: { files, command, requests, env } });
  const result = await new Promise((resolve, reject) => {
    w.once("message", resolve);
    w.once("error", reject);
  });
  await w.terminate();
  if (result.error) throw new Error(result.error);
  return result;
}

/** Values that differ between any two runs: ids, times, and the stack in Express's error pages. */
function maskVolatile(r) {
  if (!r.status || typeof r.text !== "string") return r;
  const text = r.text
    .replace(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi, "<uuid>")
    .replace(/\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(\.\d+)?Z/g, "<time>")
    .replace(/<pre>[\s\S]*<\/pre>/, "<pre>…</pre>");
  if (text === r.text) return r;
  const headers = { ...r.headers };
  delete headers["content-length"];
  delete headers.etag;
  return { ...r, headers, text };
}

function normalise(r, ignore) {
  if (!r.status) return { status: 0, error: r.error };
  r = maskVolatile(r);
  const headers = {};
  for (const [k, v] of Object.entries(r.headers)) {
    if (VOLATILE.has(k) || ignore.includes(k)) continue;
    // A cookie's Expires is "now + Max-Age": a second apart between two runs. Generated ids (X-Request-Id) differ too.
    const value = k === "set-cookie" ? v.replace(/Expires=[^;]+GMT/g, "Expires=<time>") : v;
    headers[k] = value.replace(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi, "<uuid>");
  }
  return { status: r.status, headers, text: r.text };
}

/**
 * Compare one project on both. Returns a list of differences (empty: same).
 * `ignore`: extra header names to leave out (e.g. "etag" when bodies hold ids).
 */
export async function differential({ files, command = "node server.js", requests = [], env = {}, ignore = [], mask, port }) {
  // A JSON body is sent as the lab's request panel sends it: with Content-Type: application/json.
  requests = requests.map((r) =>
    r.body !== undefined && typeof r.body !== "string" && !Object.keys(r.headers || {}).some((k) => k.toLowerCase() === "content-type")
      ? { ...r, headers: { ...(r.headers || {}), "Content-Type": "application/json" } }
      : r
  );
  // One after the other: a project that listens on a fixed port cannot run twice at once.
  const real = await realNode({ files, command, requests, env, port });
  const lab = await labMachine({ files, command, requests, env });
  const diffs = [];
  requests.forEach((req, i) => {
    let a = normalise(real.responses[i], ignore);
    let b = normalise(lab.responses[i], ignore);
    if (mask) {
      a = mask(a);
      b = mask(b);
    }
    const label = `${req.method || "GET"} ${req.path}`;
    if (JSON.stringify(a) !== JSON.stringify(b)) {
      diffs.push(`${label}\n      node: ${JSON.stringify(a)}\n      lab:  ${JSON.stringify(b)}`);
    }
  });
  return { diffs, realOutput: real.output, labOutput: lab.output };
}
