/**
 * Records the terminal sessions of the Mobile App Development course.
 *
 * Every terminal in the course shows what these commands REALLY printed: this
 * script runs them (Node, npm, Git, create-expo-app, Expo CLI, expo-doctor,
 * TypeScript, Jest and EAS CLI) in a fresh project in the system temp folder,
 * and writes src/academy/data/lessons/md-transcripts.js. Folder paths are
 * shortened to ~/projects, and progress spinners are reduced to their final
 * line, as a terminal shows them once they finish. Nothing else is edited.
 *
 *   node scripts/mdRecord.mjs            (about 10 minutes; needs the network)
 */
import { execSync } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const ROOT = new URL("../", import.meta.url);
const base = mkdtempSync(join(tmpdir(), "md-record-"));
const home = join(base, "projects");
mkdirSync(home);
const APP = "my-first-app";
const app = join(home, APP);

const env = { ...process.env, NO_COLOR: "1", FORCE_COLOR: "0", EXPO_NO_TELEMETRY: "1", GIT_AUTHOR_NAME: "Ada Obi", GIT_AUTHOR_EMAIL: "ada@example.com", GIT_COMMITTER_NAME: "Ada Obi", GIT_COMMITTER_EMAIL: "ada@example.com", npm_config_fund: "false", npm_config_update_notifier: "false" };

/** Strip colour codes, spinner frames and the temp path, as a finished terminal shows it. */
function clean(text) {
  let out = String(text)
    .replace(/\u001b\[[0-9;?]*[A-Za-z]/g, "")
    .replace(/\r(?!\n)/g, "\n");
  // Git Bash shows the system temp folder as /tmp.
  const tmpName = base.split(/[\\/]/).pop();
  const variants = [base, base.replace(/\\/g, "/"), base.replace(/^([A-Z]):\\/, (m, d) => `/${d.toLowerCase()}/`).replace(/\\/g, "/"), `/tmp/${tmpName}`];
  for (const v of variants) out = out.split(`${v}\\projects`).join("~/projects").split(`${v}/projects`).join("~/projects").split(v).join("~");
  out = out.replace(/\\/g, (m, i, s) => (/~\/projects/.test(s.slice(Math.max(0, i - 40), i)) ? "/" : m));
  const lines = out.split("\n");
  const kept = [];
  for (const line of lines) {
    const t = line.trimEnd();
    // A spinner redraws one line many times: keep only the last state of it.
    const spinner = /^[-\\|/⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏] /.test(t.trim());
    if (spinner) continue;
    kept.push(t);
  }
  // Blank lines at the ends go; a first line's own indentation (git status --short) stays.
  return kept.join("\n").replace(/\n{3,}/g, "\n\n").replace(/^\s*\n/, "").trimEnd();
}

function run(cmd, cwd, { timeout = 600000, allowFail = true } = {}) {
  process.stdout.write(`$ ${cmd}\n`);
  try {
    return clean(execSync(`${cmd} 2>&1`, { cwd, env, encoding: "utf8", timeout, shell: "bash", stdio: ["ignore", "pipe", "pipe"] }));
  } catch (err) {
    if (!allowFail) throw err;
    return clean((err.stdout || "") + (err.stderr || ""));
  }
}

const sessions = {};
delete env.CI;
const rec = (session, cwd, cmd, opts) => {
  const output = run(cmd, cwd, opts);
  (sessions[session] = sessions[session] || {})[opts?.as || cmd] = output;
  process.stdout.write(output.split("\n").slice(-6).map((l) => `    ${l}`).join("\n") + "\n");
};

/* 1 · The terminal and the tools */
rec("tools", home, "node --version");
rec("tools", home, "npm --version");
rec("tools", home, "git --version");
rec("tools", home, "pwd");
rec("tools", home, "mkdir notes && ls");
rec("tools", home, "ls -a notes");

/* 2 · A new Expo project */
rec("create", home, `npx --yes create-expo-app@latest ${APP} --yes`);
if (!existsSync(join(app, "package.json"))) {
  throw new Error(`create-expo-app did not create the project:\n${sessions.create[`npx --yes create-expo-app@latest ${APP} --yes`]}`);
}
rec("create", app, "ls");
rec("create", app, "ls src/app");
rec("create", app, "cat package.json");
rec("create", app, "cat app.json");
rec("create", app, "npx expo --version");
rec("create", app, "git status");
rec("create", app, "git log --oneline");

/* 3 · Running the dev server (stopped after two minutes; it runs until you press Ctrl+C) */
rec("start", app, "timeout 120 npx expo start", { as: "npx expo start" });

/* 4 · Packages */
rec("packages", app, "npx expo install expo-haptics");
rec("packages", app, "npm ls expo-haptics");
rec("packages", app, "npx --yes expo-doctor@latest", { as: "npx expo-doctor" });
rec("packages", app, "npm audit", { as: "npm audit" });

/* 5 · Git */
const index = join(app, "src", "app", "index.tsx");
writeFileSync(index, readFileSync(index, "utf8").replace("Welcome to&nbsp;Expo", "Hello, I am Ada"));
rec("git", app, "git status --short");
rec("git", app, "git diff --stat");
rec("git", app, "git add src/app/index.tsx");
rec("git", app, 'git commit -m "Change the welcome message"');
rec("git", app, "git log --oneline");
rec("git", app, "git branch");
rec("git", app, "git branch -M main");
rec("git", app, "git branch", { as: "git branch (after renaming)" });
rec("git", app, "git remote add origin https://github.com/ada-obi/my-first-app.git && git remote -v", { as: "git remote add origin https://github.com/ada-obi/my-first-app.git" });

/* 5b · Dependencies */
rec("deps", app, "npm outdated");
rec("deps", app, "npx expo install --check");
rec("deps", app, "npm ls react");

/* 5c · A feature branch, merged back */
rec("branch", app, 'git add package.json package-lock.json && git commit -m "Add expo-haptics"', { as: 'git commit -m "Add expo-haptics"' });
rec("branch", app, "git switch -c feature/task-filters");
mkdirSync(join(app, "src", "utils"), { recursive: true });
writeFileSync(join(app, "src", "utils", "filters.ts"), 'export type Task = { id: string; title: string; done: boolean };\n\nexport const openTasks = (tasks: Task[]) => tasks.filter((t) => !t.done);\n');
rec("branch", app, "git status --short");
rec("branch", app, "git add src/utils/filters.ts");
rec("branch", app, 'git commit -m "Add task filters"');
rec("branch", app, "git log --oneline");
rec("branch", app, "git switch main");
rec("branch", app, "git merge feature/task-filters");
rec("branch", app, "git branch -d feature/task-filters");
rec("branch", app, "git log --oneline", { as: "git log --oneline (after merging)" });

/* 6 · Configuration */
rec("config", app, "npx expo config --type public", { as: "npx expo config --type public" });

/* 7 · TypeScript catching a mistake */
writeFileSync(join(app, "src", "check.ts"), 'const habits: number = "three";\nexport default habits;\n');
rec("types", app, "npx tsc --noEmit");

/* 8 · Jest with jest-expo and React Native Testing Library */
rec("jest", app, "npx expo install jest-expo jest @types/jest @testing-library/react-native -- --save-dev");
const pkg = JSON.parse(readFileSync(join(app, "package.json"), "utf8"));
pkg.scripts.test = "jest";
pkg.jest = { preset: "jest-expo" };
writeFileSync(join(app, "package.json"), JSON.stringify(pkg, null, 2));
mkdirSync(join(app, "src", "__tests__"), { recursive: true });
writeFileSync(
  join(app, "src", "__tests__", "greeting.test.tsx"),
  `import { render, screen } from "@testing-library/react-native";\nimport { Text } from "react-native";\n\nfunction Greeting({ name }: { name: string }) {\n  return <Text>Hello, {name}</Text>;\n}\n\ntest("greets the user by name", async () => {\n  await render(<Greeting name="Ada" />);\n  expect(screen.getByText("Hello, Ada")).toBeOnTheScreen();\n});\n`
);
rec("jest", app, "npm test");

/* 9 · Continuous Native Generation */
rec("prebuild", app, "npx expo prebuild --platform android --no-install", { as: "npx expo prebuild --platform android --no-install" });
rec("prebuild", app, "ls android");
rec("prebuild", app, "git status --short");

/* 10 · EAS CLI (not signed in: an Expo account is needed to build) */
rec("eas", app, "npx --yes eas-cli@latest --version", { as: "npx eas-cli --version" });
rec("eas", app, "npx eas-cli@latest whoami", { as: "npx eas-cli whoami" });
rec("eas", app, "npx eas-cli@latest build --help", { as: "npx eas-cli build --help" });
rec("eas", app, "npx eas-cli@latest submit --help", { as: "npx eas-cli submit --help" });
rec("eas", app, "npx eas-cli@latest update --help", { as: "npx eas-cli update --help" });
rec("eas", app, "npx eas-cli@latest build --platform android --profile preview --non-interactive", { as: "npx eas-cli build --platform android --profile preview" });

const out = `/**
 * MOBILE APP DEVELOPMENT — RECORDED TERMINAL SESSIONS
 *
 * GENERATED by scripts/mdRecord.mjs on ${new Date().toISOString().slice(0, 10)}. Every output below is what
 * the command really printed in a fresh Expo SDK 58 project (Node ${process.version}, Git Bash on
 * Windows); folder paths are shortened to ~/projects. Do not edit by hand: re-record.
 */

export const TRANSCRIPTS = ${JSON.stringify(sessions, null, 2)};

export default TRANSCRIPTS;
`;
writeFileSync(new URL("src/academy/data/lessons/md-transcripts.js", ROOT), out);
console.log(`recorded ${Object.values(sessions).reduce((n, s) => n + Object.keys(s).length, 0)} commands in ${base}`);
