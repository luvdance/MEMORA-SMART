/**
 * Records the terminal sessions of the Backend Engineering course.
 *
 * Every terminal in the course shows what its commands REALLY printed: this
 * script creates each session's project in a fresh folder, runs the
 * commands a learner types, in order, in bash (Git Bash on Windows; the
 * same commands run in a macOS or Linux terminal), and writes
 * src/academy/data/lessons/be-transcripts.js.
 *
 * Sessions are defined in lib/academy/backend/sessions.mjs. Their project
 * files are the same strings the lessons show (src/academy/data/lessons/
 * be-projects.js), so the code a learner reads is the code that ran.
 *
 * What is normalised, and nothing else:
 *   - the session folder is shown as the learner's home, /home/ada
 *     (prompt ada@laptop:~/<project>$), and the recording account as ada;
 *   - colour codes are removed; Windows line endings become \n, and the
 *     backslashes Windows programs (npm, ESLint) put in paths under /home
 *     are shown as /;
 *   - ls is run as on a screen (columns, no tabs), and npm draws its trees
 *     in Unicode, as on macOS and Linux;
 *   - curl's progress meter is switched off with a ~/.curlrc (curl hides it
 *     on a real screen, and these sessions write to a pipe), and the two
 *     "Note:" lines with which curl -v announces that file are removed.
 *
 * A command marked `background` (a server) is started and left running while
 * the next commands talk to it; its transcript is everything it printed by
 * the end of the session, as its own terminal window would show.
 *
 *   node scripts/beRecord.mjs              every session
 *   node scripts/beRecord.mjs w1-http      only the sessions named (others kept)
 */
import { spawn, spawnSync } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir, userInfo } from "node:os";
import { basename, dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { SESSIONS } from "../lib/academy/backend/sessions.mjs";

const ROOT = fileURLToPath(new URL("../", import.meta.url));
const OUT = join(ROOT, "src/academy/data/lessons/be-transcripts.js");
const only = process.argv.slice(2).filter((a) => !a.startsWith("--"));
const BASH = existsSync("C:/Program Files/Git/bin/bash.exe") ? "C:/Program Files/Git/bin/bash.exe" : "bash";

const base = mkdtempSync(join(tmpdir(), "be-record-"));
const home = join(base, "ada");
mkdirSync(home, { recursive: true });
// curl hides its progress meter when it writes to a terminal; these sessions
// write to a pipe, so it is switched off as a terminal would have it.
writeFileSync(join(home, ".curlrc"), "no-progress-meter\n");
// Git configured as Week 4 teaches: a name, an email, and main as the first branch.
writeFileSync(join(home, ".gitconfig"), "[user]\n\tname = Ada Obi\n\temail = ada@example.com\n[init]\n\tdefaultBranch = main\n");
// ls prints columns on a screen and one name per line into a pipe; these sessions pipe, so ls is told it is on a screen.
const PREAMBLE = "shopt -s expand_aliases; alias ls='ls -C -T 0'\n";
const USER = userInfo().username;

function variants(p) {
  const back = p.replace(/\//g, "\\");
  const fwd = back.replace(/\\/g, "/");
  const bash = fwd.replace(/^([A-Za-z]):/, (m, d) => `/${d.toLowerCase()}`);
  return [back, fwd, bash, back.toLowerCase(), fwd.toLowerCase(), bash.toLowerCase()];
}

function clean(text) {
  let out = String(text)
    .replace(/\u001b\[[0-9;?]*[A-Za-z]/g, "")
    .replace(/\u001b\][^\u0007]*\u0007/g, "")
    .replace(/\r\n/g, "\n")
    .replace(/\r(?!\n)/g, "\n");
  // curl -v announces the ~/.curlrc that switches its progress meter off (see above).
  out = out.replace(/^Note: Read config file from[^\n]*\n(Note: '[^'\n]*\.curlrc'[^\n]*\n)?/gm, "");
  for (const v of variants(home)) out = out.split(v).join("/home/ada");
  for (const v of variants(base)) out = out.split(v).join("/home");
  // Git Bash also names the temporary folder /tmp/<name>.
  out = out.split(`/tmp/${basename(base)}`).join("/home");
  // Windows programs (npm, ESLint) join the rest of a path with backslashes: show it as on Linux.
  out = out.replace(/\/home\/ada[\\/][^\s'"`:)]*/g, (p) => p.replace(/\\/g, "/"));
  out = out.replace(new RegExp(`\\b${USER}\\b`, "g"), "ada");
  return out
    .split("\n")
    .map((l) => l.trimEnd())
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/^\s*\n/, "")
    .trimEnd();
}

/**
 * Sessions marked `posixPaths`: relative paths a Windows program prints with
 * backslashes (Prisma's prisma\schema.prisma, .\src\generated\prisma) are
 * shown with slashes, as the same program prints them on macOS and Linux.
 */
function posixPaths(text) {
  return text.replace(/(?<![\w\\])(?:\.\\)?[\w.-]+(?:\\[\w.-]+)+\\?/g, (p) => p.replace(/\\/g, "/"));
}

const PATH_KEY = Object.keys(process.env).find((k) => k.toUpperCase() === "PATH") || "PATH";
const env = {
  ...process.env,
  HOME: home,
  USERPROFILE: home,
  NO_COLOR: "1",
  FORCE_COLOR: "0",
  npm_config_fund: "false",
  npm_config_update_notifier: "false",
  npm_config_audit: "false",
  npm_config_color: "false",
  GIT_AUTHOR_NAME: "Ada Obi",
  GIT_COMMITTER_NAME: "Ada Obi",
  GIT_AUTHOR_EMAIL: "ada@example.com",
  GIT_COMMITTER_EMAIL: "ada@example.com",
  GIT_CONFIG_NOSYSTEM: "1",
  TERM: "dumb",
  TZ: "UTC",
  COLUMNS: "80",
  npm_config_unicode: "true",
};
delete env.GIT_DIR;

function writeFiles(dir, files) {
  for (const [name, content] of Object.entries(files || {})) {
    const file = join(dir, name);
    mkdirSync(dirname(file), { recursive: true });
    writeFileSync(file, content);
  }
}

function runForeground(cmd, cwd, extraEnv, stdin) {
  // 2>&1: stdout and stderr interleaved in the order they were printed, as on a screen.
  const r = spawnSync(BASH, ["--noprofile", "--norc", "-c", `${PREAMBLE}{ ${cmd}\n} 2>&1`], {
    cwd,
    env: { ...env, ...extraEnv },
    input: stdin ?? "",
    encoding: "utf8",
    timeout: 180000,
    maxBuffer: 20 * 1024 * 1024,
  });
  return clean(`${r.stdout || ""}${r.stderr || ""}`);
}

function startBackground(cmd, cwd, extraEnv, ready) {
  // No exec: bash stays the parent of the server (and of npm's cmd.exe on Windows), so killing
  // bash's process tree really stops it.
  const child = spawn(BASH, ["--noprofile", "--norc", "-c", `${cmd} 2>&1`], { cwd, env: { ...env, ...extraEnv }, stdio: ["ignore", "pipe", "pipe"] });
  let text = "";
  child.stdout.on("data", (d) => (text += d));
  child.stderr.on("data", (d) => (text += d));
  const until = new Promise((resolve) => {
    const t0 = Date.now();
    const tick = () => {
      if ((ready ? ready.test(text) : text.length > 0) || Date.now() - t0 > 20000) resolve();
      else setTimeout(tick, 50);
    };
    tick();
  });
  return { child, until, output: () => text };
}

function kill(child) {
  if (child.exitCode !== null) return;
  if (process.platform === "win32") spawnSync("taskkill", ["/pid", String(child.pid), "/T", "/F"], { stdio: "ignore" });
  else child.kill("SIGINT");
}

/**
 * On Windows, Git Bash starts programs outside its own process tree, so a
 * server started with npm start can outlive taskkill /T. Stop the script
 * launchers npm creates (cmd.exe /d /s /c …) during the session, and their
 * children: never anything older, such as a dev server.
 */
function killStartedSince(since) {
  if (process.platform !== "win32") return;
  const script = `$since = [datetime]::Parse('${since.toISOString()}').ToLocalTime(); $all = Get-CimInstance Win32_Process; $launchers = $all | Where-Object { $_.Name -eq 'cmd.exe' -and $_.CreationDate -gt $since -and $_.CommandLine -like '*/d /s /c*' }; foreach ($l in $launchers) { $all | Where-Object { $_.ParentProcessId -eq $l.ProcessId -and $_.CreationDate -gt $since } | ForEach-Object { Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue }; Stop-Process -Id $l.ProcessId -Force -ErrorAction SilentlyContinue }`;
  spawnSync("powershell.exe", ["-NoProfile", "-Command", script], { stdio: "ignore" });
}

const transcripts = existsSync(OUT) ? (await import(`${pathToFileURL(OUT).href}?t=${Date.now()}`)).TRANSCRIPTS : {};
const selected = only.length ? SESSIONS.filter((s) => only.includes(s.id)) : SESSIONS;
if (only.length && selected.length !== only.length) throw new Error(`Unknown session(s): ${only.filter((o) => !SESSIONS.some((s) => s.id === o)).join(", ")}`);

/**
 * Sessions marked `postgres: true` talk to a real PostgreSQL server: a fresh
 * cluster (PostgreSQL 18, the RDBMS course's binaries) with the learner's
 * own superuser, ada, on localhost:5432, as after installing PostgreSQL and
 * creating a role for yourself. psql finds the server and password through
 * PGHOST/PGUSER/PGPASSWORD, which the commands never show.
 */
const PG_BIN = join(process.env.USERPROFILE || process.env.HOME, ".cache", "rdbms-course", "pg", "pgsql", "bin");
let pgData = null;
if (selected.some((s) => s.postgres)) {
  if (!existsSync(join(PG_BIN, "pg_ctl.exe")) && !existsSync(join(PG_BIN, "pg_ctl"))) throw new Error(`PostgreSQL binaries not found in ${PG_BIN}: run node scripts/dbRecord.mjs once to download them`);
  pgData = join(base, "pgdata");
  writeFileSync(join(base, "pw.txt"), "ada-password\n");
  const init = spawnSync(join(PG_BIN, "initdb"), ["-D", pgData, "-U", "ada", "-A", "scram-sha-256", "-E", "UTF8", "--locale=C", `--pwfile=${join(base, "pw.txt")}`], { encoding: "utf8" });
  if (init.status !== 0) throw new Error(`initdb failed: ${init.stderr}`);
  // Detached, with no pipes: a server started by pg_ctl would otherwise hold this script's output open.
  spawn(join(PG_BIN, "pg_ctl"), ["-D", pgData, "-o", "-p 5432", "-l", join(base, "server.log"), "start"], { stdio: "ignore", detached: true, windowsHide: true }).unref();
  for (let i = 0; ; i++) {
    const ok = spawnSync(join(PG_BIN, "pg_isready"), ["-h", "localhost", "-p", "5432"], { encoding: "utf8" });
    if (ok.status === 0) break;
    if (i > 60) throw new Error("PostgreSQL did not start");
    await new Promise((r) => setTimeout(r, 500));
  }
  Object.assign(env, { PGHOST: "localhost", PGPORT: "5432", PGUSER: "ada", PGPASSWORD: "ada-password", PSQL_PAGER: "cat", PAGER: "cat" });
  env[PATH_KEY] = `${PG_BIN}${process.platform === "win32" ? ";" : ":"}${env[PATH_KEY]}`;
}

for (const session of selected) {
  const project = join(home, session.project || session.id);
  // Windows releases a folder a moment after the last process in it has been killed.
  for (let attempt = 0; ; attempt++) {
    try {
      rmSync(project, { recursive: true, force: true });
      break;
    } catch (err) {
      if (attempt >= 20) throw err;
      await new Promise((r) => setTimeout(r, 500));
    }
  }
  mkdirSync(project, { recursive: true });
  writeFiles(project, session.files);
  const out = {};
  const bg = [];
  const sessionStart = new Date();
  process.stdout.write(`${session.id}: `);
  for (const step of session.commands) {
    const spec = typeof step === "string" ? { cmd: step } : step;
    const cwd = spec.cwd ? join(project, spec.cwd) : project;
    if (spec.files) writeFiles(project, spec.files);
    if (spec.background) {
      const b = startBackground(spec.cmd, cwd, { ...(session.env || {}), ...(spec.env || {}) }, spec.ready);
      await b.until;
      bg.push({ spec, ...b });
      continue;
    }
    if (spec.wait) await new Promise((r) => setTimeout(r, spec.wait));
    const text = runForeground(spec.cmd, cwd, { ...(session.env || {}), ...(spec.env || {}) }, spec.stdin);
    if (spec.cmd in out && !spec.repeat) throw new Error(`${session.id}: "${spec.cmd}" is recorded twice; a terminal maps each command to one output`);
    out[spec.show || spec.cmd] = session.posixPaths ? posixPaths(text) : text;
    process.stdout.write(".");
  }
  await new Promise((r) => setTimeout(r, 300));
  for (const b of bg) {
    kill(b.child);
    out[b.spec.show || b.spec.cmd] = session.posixPaths ? posixPaths(clean(b.output())) : clean(b.output());
  }
  if (bg.length) killStartedSince(sessionStart);
  transcripts[session.id] = out;
  process.stdout.write(` ${Object.keys(out).length} commands\n`);
}

const header = `/**
 * BACKEND ENGINEERING — RECORDED TERMINAL SESSIONS
 *
 * GENERATED by scripts/beRecord.mjs. Every output is what the command really
 * printed when run in bash on a real machine; the session folder is shown as
 * /home/ada. Do not edit by hand: change lib/academy/backend/sessions.mjs and
 * record again.
 */
`;
const ordered = Object.fromEntries(Object.keys(transcripts).sort().map((k) => [k, transcripts[k]]));
writeFileSync(OUT, `${header}\nexport const TRANSCRIPTS = ${JSON.stringify(ordered, null, 2)};\n`);
if (pgData) spawnSync(join(PG_BIN, "pg_ctl"), ["-D", pgData, "stop", "-m", "fast"], { stdio: "ignore" });
for (let attempt = 0; attempt < 20; attempt++) {
  try {
    rmSync(base, { recursive: true, force: true });
    break;
  } catch {
    await new Promise((r) => setTimeout(r, 500));
  }
}
console.log(`wrote ${OUT.replace(ROOT, "")}`);
