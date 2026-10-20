/**
 * Records every terminal transcript in the Codebase Engineering course.
 *
 *   node scripts/ceRecord.mjs            rebuild Kobo Market, record everything
 *   node scripts/ceRecord.mjs --reuse    reuse the last build (faster)
 *   node scripts/ceRecord.mjs m2-find    record only the sessions named
 *
 * Each session in lib/academy/codebase/sessions.mjs starts from the same
 * clean clone of the sample project, applies its setup, then runs its
 * commands IN ORDER in Git Bash (or Windows PowerShell), so a command sees
 * what the commands before it did, exactly as at a real prompt. Output is
 * written to src/academy/data/lessons/ce-transcripts.js, which the lessons
 * read; nothing a lesson shows a command printing is typed by hand.
 *
 * Two things are normalised, and the lessons say so: the folder the project
 * was built in is shown as the learner's home, /c/Users/ada (C:\Users\ada in
 * PowerShell), and the recording account's name is shown as ada.
 */
import { execFileSync, spawn } from "node:child_process";
import { closeSync, copyFileSync, existsSync, mkdirSync, openSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { bash, buildProject, courseEnv, findBash } from "../lib/academy/codebase/build.mjs";
import { SESSIONS } from "../lib/academy/codebase/sessions.mjs";

const ROOT = fileURLToPath(new URL("../", import.meta.url));
const OUT = join(ROOT, "src/academy/data/lessons/ce-transcripts.js");
const work = join(tmpdir(), "kobo-market-course");
const args = process.argv.slice(2);
const only = args.filter((a) => !a.startsWith("--"));

const built =
  args.includes("--reuse") && existsSync(join(work, "kobo-market", "node_modules"))
    ? { work, repo: join(work, "kobo-market"), env: courseEnv(work) }
    : buildProject(work);
const repo = built.repo;
const HOME = "/c/Users/ada";
const posixWork = work.replace(/\\/g, "/").replace(/^([A-Za-z]):/, (_, d) => `/${d.toLowerCase()}`);
/**
 * ripgrep is taught in the course but is not part of Git for Windows, so the
 * official release binary is fetched once into a tools folder and put on the
 * sessions' PATH, as a learner who followed the install step would have it.
 */
function ensureRipgrep() {
  const version = "14.1.1";
  const tools = join(tmpdir(), "kobo-market-tools");
  const dir = join(tools, `ripgrep-${version}-x86_64-pc-windows-msvc`);
  if (!existsSync(join(dir, "rg.exe"))) {
    mkdirSync(tools, { recursive: true });
    const url = `https://github.com/BurntSushi/ripgrep/releases/download/${version}/ripgrep-${version}-x86_64-pc-windows-msvc.zip`;
    execFileSync("curl", ["-sSL", "-o", join(tools, "rg.zip"), url]);
    execFileSync("powershell.exe", ["-NoProfile", "-Command", `Expand-Archive -Force '${join(tools, "rg.zip")}' '${tools}'`]);
  }
  return dir;
}

const PATH_KEY = Object.keys(process.env).find((k) => k.toUpperCase() === "PATH") || "PATH";
const env = {
  ...built.env,
  HOME: work,
  USERPROFILE: work,
  [PATH_KEY]: `${ensureRipgrep()};${built.env[PATH_KEY]}`,
};

/* ── Normalisation ─────────────────────────────────────────────────────── */

const escape = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const account = process.env.USERNAME || process.env.USER || "";
// Git Bash shows the temp folder as /tmp, so the build folder has two
// POSIX spellings.
const tmpWork = "/tmp/" + work.replace(/\\/g, "/").split("/").pop();
const REPLACE = [
  [new RegExp(escape(posixWork), "gi"), HOME],
  [new RegExp(escape(tmpWork), "g"), HOME],
  [new RegExp(escape(work), "gi"), "C:\\Users\\ada"],
  [new RegExp(escape(work.replace(/\\/g, "/")), "gi"), "C:/Users/ada"],
  ...(account && account !== "ada" ? [[new RegExp(`\\b${escape(account)}\\b`, "g"), "ada"]] : []),
];

function normalise(text) {
  let out = String(text).replace(/\r/g, "");
  for (const [re, to] of REPLACE) out = out.replace(re, to);
  return out
    .split("\n")
    .map((l) => l.replace(/\s+$/, ""))
    .join("\n")
    .replace(/^\n+/, "")
    .replace(/\n+$/, "");
}

/** What actually runs: the learner's home stands for the build folder. */
const realCommand = (cmd) => cmd.split(HOME).join(posixWork);

/* ── A clean slate for every session ───────────────────────────────────── */

const run = (cmd, opts = {}) => bash(cmd, { cwd: repo, env, ...opts });
const BASE = run("git rev-parse HEAD").trim();
const BASE_TAGS = new Set(run("git tag").trim().split("\n"));
const bare = join(work, "kobo-market.git");
const BARE_REFS = run("git for-each-ref --format='%(objectname) %(refname)'", { cwd: bare }).trim().split("\n");
const pristine = join(work, "pristine");
if (!existsSync(pristine)) {
  mkdirSync(pristine);
  copyFileSync(join(repo, ".env"), join(pristine, ".env"));
  copyFileSync(join(repo, "data", "kobo.json"), join(pristine, "kobo.json"));
}

function reset() {
  run(
    [
      "git merge --abort 2>/dev/null; git cherry-pick --abort 2>/dev/null; git revert --abort 2>/dev/null",
      "git worktree list --porcelain | grep '^worktree ' | tail -n +2 | cut -c10- | while read -r w; do git worktree remove --force \"$w\"; done",
      "git worktree prune",
      "git checkout -q -f main",
      `git reset -q --hard ${BASE}`,
      // Untracked AND ignored files go (logs, notes, build output), but not
      // the installed dependencies, the local .env or the seeded data.
      "git clean -qfdx -e node_modules -e .env -e data",
      "git stash clear",
      "git for-each-ref --format='%(refname:short)' refs/heads | grep -vx main | xargs -r git branch -q -D",
      "git config --unset branch.main.merge >/dev/null 2>&1; git branch -q --set-upstream-to=origin/main main",
    ].join("; "),
    { allowFail: true }
  );
  for (const tag of run("git tag").trim().split("\n").filter(Boolean)) {
    if (!BASE_TAGS.has(tag)) run(`git tag -d ${tag}`);
  }
  // The remote too: drop refs a session pushed, restore the ones it moved.
  const known = new Set(BARE_REFS.map((l) => l.split(" ")[1]));
  for (const line of run("git for-each-ref --format='%(refname)'", { cwd: bare }).trim().split("\n")) {
    if (line && !known.has(line)) run(`git update-ref -d ${line}`, { cwd: bare });
  }
  for (const line of BARE_REFS) {
    const [sha, ref] = line.split(" ");
    run(`git update-ref ${ref} ${sha}`, { cwd: bare });
  }
  run("git fetch -q --prune origin");
  copyFileSync(join(pristine, ".env"), join(repo, ".env"));
  mkdirSync(join(repo, "data"), { recursive: true });
  copyFileSync(join(pristine, "kobo.json"), join(repo, "data", "kobo.json"));
  rmSync(join(repo, "dist"), { recursive: true, force: true });
}

/* ── Running commands ──────────────────────────────────────────────────── */

function killTree(pid) {
  try {
    execFileSync("taskkill", ["/PID", String(pid), "/T", "/F"], { stdio: "ignore" });
  } catch {
    /* already gone */
  }
}

/**
 * The ports the sample project's servers use. Only these are ever stopped.
 * Never Vite's defaults (5173, 4173): a developer's own app may be on them,
 * so sessions that start Vite pass --port 5199 (dev) or 4199 (preview).
 */
const PORTS = [4000, 4100, 5199, 4199];

function stopListeners() {
  let table = "";
  try {
    table = execFileSync("netstat", ["-ano"], { encoding: "utf8" });
  } catch {
    return;
  }
  const pids = new Set();
  for (const line of table.split(/\r?\n/)) {
    const m = line.match(/^\s*TCP\s+\S+:(\d+)\s+\S+\s+LISTENING\s+(\d+)/);
    if (m && PORTS.includes(Number(m[1])) && m[2] !== "0") pids.add(m[2]);
  }
  for (const pid of pids) killTree(pid);
}

// Killing Git Bash does not reach the Windows processes it started (npm,
// node), so a server is stopped by the port it holds; npm and the shell then
// exit on their own and the pipe closes.
function runBackground(command, { cwd, ms, extraEnv }) {
  return new Promise((resolve) => {
    const child = spawn(findBash(), ["-c", `${realCommand(command)} 2>&1`], {
      cwd,
      env: { ...env, ...extraEnv },
      stdio: ["ignore", "pipe", "pipe"],
    });
    let out = "";
    child.stdout.on("data", (d) => (out += d));
    child.stderr.on("data", (d) => (out += d));
    const timer = setTimeout(() => {
      stopListeners();
      setTimeout(() => killTree(child.pid), 1500);
    }, ms);
    const done = () => {
      clearTimeout(timer);
      resolve(out);
    };
    child.on("close", done);
    setTimeout(done, ms + 8000);
  });
}

function runForeground(command, { cwd, shell, extraEnv }) {
  // No stdin at all. An empty pipe is worse than none: ripgrep and git
  // shortlog search a piped stdin instead of the project.
  const options = {
    cwd,
    env: { ...env, ...extraEnv },
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
    timeout: 120000,
  };
  try {
    if (shell === "powershell") {
      return execFileSync(
        "powershell.exe",
        ["-NoProfile", "-NonInteractive", "-Command", `$ProgressPreference='SilentlyContinue'; ${command}`],
        options
      );
    }
    return execFileSync(findBash(), ["-c", `{ ${realCommand(command)}\n} 2>&1`], options);
  } catch (err) {
    return (err.stdout || "") + (err.stderr || "");
  }
}

/**
 * The API, started as `npm start` would start it, with everything it prints
 * written to server.log (ignored by the project's .gitignore) so a session
 * can read the log the way a developer would: `cat server.log`.
 */
// The server writes straight into the file, not through a pipe: the
// recorder runs each command synchronously, which blocks its own event loop,
// so output arriving through a pipe would only be read after the session.
async function startServer(serverEnv = {}) {
  const log = join(repo, "server.log");
  const fd = openSync(log, "w");
  const child = spawn("node", ["--env-file-if-exists=.env", "server/index.js"], {
    cwd: repo,
    env: { ...env, ...serverEnv },
    stdio: ["ignore", fd, fd],
  });
  closeSync(fd);
  let exited = false;
  child.on("exit", () => (exited = true));
  for (let waited = 0; waited < 5000 && !exited; waited += 100) {
    if (readFileSync(log, "utf8").includes("listening")) break;
    await new Promise((r) => setTimeout(r, 100));
  }
  return child;
}

function applyEdits(edits = []) {
  for (const [path, from, to] of edits) {
    const file = join(repo, path);
    const text = readFileSync(file, "utf8");
    if (!text.includes(from)) throw new Error(`edit not applied in ${path}: ${from.slice(0, 60)}`);
    writeFileSync(file, text.replace(from, to));
  }
}

function writeFiles(files = {}) {
  for (const [path, content] of Object.entries(files)) {
    const file = join(repo, path);
    mkdirSync(dirname(file), { recursive: true });
    writeFileSync(file, content);
  }
}

/* ── Record ────────────────────────────────────────────────────────────── */

const previous = existsSync(OUT) ? (await import(`file://${OUT}?t=${Date.now()}`)).TRANSCRIPTS : {};
const transcripts = { ...previous };
const wanted = only.length ? only : Object.keys(SESSIONS);

for (const id of wanted) {
  const session = SESSIONS[id];
  if (!session) throw new Error(`no session called ${id}`);
  // A terminal maps each command to ONE output, so a command repeated in a
  // session would silently keep only its last output.
  const typed = session.commands.map((c) => (typeof c === "string" ? c : c.cmd));
  const repeated = typed.find((c, i) => typed.indexOf(c) !== i);
  if (repeated) throw new Error(`${id}: "${repeated}" is run twice; a terminal shows one output per command`);
  reset();
  writeFiles(session.files);
  applyEdits(session.edits);
  if (session.setup) run(session.setup);
  const server = session.server ? await startServer(session.server.env) : null;
  const cwd = join(repo, session.cwd || ".");
  const vars = {};
  for (const [name, cmd] of Object.entries(session.vars || {})) vars[name] = run(cmd).trim();
  const out = {};
  for (const entry of session.commands) {
    const spec = typeof entry === "string" ? { cmd: entry } : entry;
    const raw = spec.background
      ? await runBackground(spec.cmd, { cwd, ms: spec.background, extraEnv: vars })
      : runForeground(spec.cmd, { cwd, shell: session.shell, extraEnv: vars });
    out[spec.cmd] = normalise(raw);
  }
  if (server) killTree(server.pid);
  stopListeners();
  // node_modules is ignored, so the reset below cannot undo an install or
  // uninstall: reinstall exactly from the lockfile instead.
  if (session.changesPackages) {
    run("git checkout -q -- package.json package-lock.json 2>/dev/null; npm ci --no-audit --ignore-scripts", {
      allowFail: true,
    });
  }
  transcripts[id] = out;
  console.log(`recorded ${id} (${session.commands.length} commands)`);
}
reset();

const versions = {
  git: normalise(run("git --version")),
  node: normalise(run("node --version")),
  npm: normalise(run("npm --version")),
  bash: normalise(run("echo $BASH_VERSION")),
  ripgrep: normalise(run("rg --version | head -n 1")),
};

const ordered = Object.fromEntries(Object.keys(SESSIONS).filter((k) => transcripts[k]).map((k) => [k, transcripts[k]]));
writeFileSync(
  OUT,
  `/**
 * CODEBASE ENGINEERING — RECORDED TERMINAL SESSIONS
 *
 * GENERATED by scripts/ceRecord.mjs. Do not edit by hand: change the session
 * in lib/academy/codebase/sessions.mjs and record it again.
 *
 * Every output below was printed by a real command, run in order, against
 * the Kobo Market sample project (lib/academy/codebase/). Recorded in Git
 * Bash and Windows PowerShell with ${versions.git}, Node ${versions.node},
 * npm ${versions.npm} and ${versions.ripgrep}. The build folder is shown as
 * the learner's home folder, /c/Users/ada.
 */

export const RECORDED_WITH = ${JSON.stringify(versions, null, 2)};

export const TRANSCRIPTS = ${JSON.stringify(ordered, null, 2)};

export default TRANSCRIPTS;
`
);
console.log(`wrote ${Object.keys(ordered).length} sessions to ${OUT}`);
