/**
 * Builds the Kobo Market sample project as a real Git repository.
 *
 *   node lib/academy/codebase/build.mjs [workDir]
 *
 * Produces, inside workDir (default: <tmp>/kobo-market-course):
 *
 *   kobo-market.git/   a bare repository playing the part of GitHub
 *   kobo-market/       the learner's clone, dependencies installed, seeded,
 *                      with a local .env, exactly as the lessons describe
 *   gitconfig          the only Git configuration used, so the machine's own
 *                      settings (line endings, aliases, colours) never leak in
 *
 * Commit dates, authors and file contents are fixed, so commit ids are the
 * same on every build until the fixture changes. The lockfile is generated
 * once by `npm install` and then stored in the fixture, so later builds
 * install exactly the same versions.
 *
 * Everything runs in Git Bash, the shell the transcripts are recorded in.
 */
import { execFileSync } from "node:child_process";
import { copyFileSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { BRANCHES, COMMITS, LEARNER } from "./project.mjs";

const FIXTURE = fileURLToPath(new URL("./fixture/", import.meta.url));

export function findBash() {
  const candidates = [
    process.env.CE_BASH,
    "C:\\Program Files\\Git\\bin\\bash.exe",
    "C:\\Program Files (x86)\\Git\\bin\\bash.exe",
    "/bin/bash",
    "/usr/bin/bash",
  ].filter(Boolean);
  const found = candidates.find((p) => existsSync(p));
  if (!found) throw new Error("Git Bash not found. Set CE_BASH to bash.exe.");
  return found;
}

/** The environment every command runs in: isolated Git config, no colour. */
export function courseEnv(work, extra = {}) {
  return {
    ...process.env,
    GIT_CONFIG_GLOBAL: join(work, "gitconfig"),
    GIT_CONFIG_NOSYSTEM: "1",
    NO_COLOR: "1",
    FORCE_COLOR: "0",
    NODE_DISABLE_COLORS: "1",
    npm_config_fund: "false",
    npm_config_update_notifier: "false",
    LC_ALL: "C.UTF-8",
    ...extra,
  };
}

export function bash(command, { cwd, env, allowFail = false } = {}) {
  try {
    return execFileSync(findBash(), ["-c", command], { cwd, env, encoding: "utf8", stdio: "pipe" });
  } catch (err) {
    if (allowFail) return (err.stdout || "") + (err.stderr || "");
    throw new Error(`${command}\n${err.stdout || ""}${err.stderr || ""}`);
  }
}

const destOf = (entry) => {
  const path = entry.replace(/@[\w]+$/, "");
  return path.replace(/(^|\/)_(gitignore|env\.example)$/, "$1.$2");
};

function commitAll(spec, { cwd, env }) {
  for (const entry of spec.files) {
    const dest = join(cwd, destOf(entry));
    mkdirSync(dirname(dest), { recursive: true });
    const source = join(FIXTURE, entry);
    if (!existsSync(source)) {
      if (entry === "package-lock.json@c8") {
        // First build: generate the lockfile, then keep it in the fixture.
        bash("npm install --package-lock-only --ignore-scripts", { cwd, env });
        copyFileSync(join(cwd, "package-lock.json"), source);
        continue;
      }
      throw new Error(`fixture file missing: ${entry}`);
    }
    // Byte for byte, except that a checkout which converted line endings
    // must not change the project's commit ids.
    writeFileSync(dest, readFileSync(source, "utf8").replace(/\r\n/g, "\n"));
  }
  if (spec.run) bash(spec.run, { cwd, env });
  const when = {
    GIT_AUTHOR_NAME: spec.author.name,
    GIT_AUTHOR_EMAIL: spec.author.email,
    GIT_AUTHOR_DATE: spec.date,
    GIT_COMMITTER_NAME: spec.author.name,
    GIT_COMMITTER_EMAIL: spec.author.email,
    GIT_COMMITTER_DATE: spec.date,
  };
  const withDate = { ...env, ...when };
  bash("git add -A", { cwd, env: withDate });
  writeFileSync(join(cwd, ".git", "COMMIT_MSG"), spec.message + "\n");
  bash("git commit -q -F .git/COMMIT_MSG", { cwd, env: withDate });
  if (spec.tag) {
    writeFileSync(join(cwd, ".git", "TAG_MSG"), spec.tag.message + "\n");
    bash(`git tag -a ${spec.tag.name} -F .git/TAG_MSG`, { cwd, env: withDate });
  }
}

export function buildProject(work = join(tmpdir(), "kobo-market-course")) {
  rmSync(work, { recursive: true, force: true });
  mkdirSync(work, { recursive: true });
  writeFileSync(
    join(work, "gitconfig"),
    [
      "[user]",
      `\tname = ${LEARNER.name}`,
      `\temail = ${LEARNER.email}`,
      "[init]",
      "\tdefaultBranch = main",
      "[core]",
      "\tautocrlf = false",
      "\tpager = cat",
      "[color]",
      "\tui = never",
      "[pull]",
      "\trebase = false",
      "",
    ].join("\n")
  );
  const env = courseEnv(work);

  // 1. Author the history in a scratch repository.
  const authoring = join(work, "authoring");
  mkdirSync(authoring);
  bash("git init -q", { cwd: authoring, env });
  for (const spec of COMMITS) commitAll(spec, { cwd: authoring, env });
  for (const branch of BRANCHES) {
    const from = COMMITS.findIndex((c) => c.id === branch.from);
    bash(`git switch -q -c ${branch.name} HEAD~${COMMITS.length - 1 - from}`, { cwd: authoring, env });
    for (const spec of branch.commits) commitAll(spec, { cwd: authoring, env });
    bash("git switch -q main", { cwd: authoring, env });
  }

  // 2. Publish it to a bare "remote", and clone it the way a new hire would.
  bash("git clone -q --bare authoring kobo-market.git", { cwd: work, env });
  bash("git clone -q kobo-market.git kobo-market", { cwd: work, env });
  const repo = join(work, "kobo-market");
  bash("git remote set-url origin ../kobo-market.git", { cwd: repo, env });
  bash("git fetch -q origin", { cwd: repo, env });
  rmSync(authoring, { recursive: true, force: true });

  // 3. Make it runnable: dependencies, a local .env, seeded data.
  bash("npm ci --no-audit --ignore-scripts", { cwd: repo, env });
  bash("cp .env.example .env && sed -i 's/^SESSION_SECRET=.*/SESSION_SECRET=dev-only-4b9f2c7e1a8d/' .env", {
    cwd: repo,
    env,
  });
  bash("npm run seed --silent", { cwd: repo, env });
  return { work, repo, env };
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const { repo, env } = buildProject(process.argv[2]);
  console.log(bash("git log --oneline --all --decorate", { cwd: repo, env }));
  console.log(`built ${repo}`);
}
