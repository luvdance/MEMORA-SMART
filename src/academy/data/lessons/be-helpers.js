/**
 * BACKEND ENGINEERING — LESSON HELPERS
 *
 * CLIENT-SAFE. What every lesson file of the course uses:
 *
 *   term(session, spec)   a terminal built from a RECORDED session
 *                         (./be-transcripts.js, scripts/beRecord.mjs), so a
 *                         lesson can choose commands but never type an output
 *   shown(session, cmd)   a recorded command and its output, for an example
 *   decide({ … })         a judgement-call practice
 *   pkg({ … })            a package.json, as npm writes it
 *   js(code, output)      a JavaScript example whose output Node verifies
 *
 * A session or command that was not recorded throws when the lesson file
 * loads, so a typo fails the build instead of shipping an empty terminal.
 */

import { TRANSCRIPTS } from "./be-transcripts.js";

export const JS = "javascript";

/* ── Terminals ────────────────────────────────────────────────────────── */

const RECORDED = "Recorded in a real terminal (bash) on a developer's laptop; the home folder is shown as /home/ada.";

/** The prompt of a session: its project folder under the learner's home. */
export function promptFor(session) {
  const project = SESSION_FOLDERS[session] || session;
  return `ada@laptop:~/${project}$`;
}

/** Each session's project folder (scripts/beRecord.mjs creates it under the home). */
export const SESSION_FOLDERS = {
  "w1-http": "hello-web",
  "w1-dns": "hello-web",
  "w3-fetch": "public-api",
  "w5-node": "hello-node",
  "w4-terminal": "course-api",
  "w4-npm": "course-api",
  "w4-git": "course-api",
  "w4-conflict": "course-api",
  "w4-remote": "course-api",
  "w4-secrets": "course-api",
  "w4-lint": "course-api",
  "w10-psql": "academy-db",
  "w10-roles": "academy-db",
  "w11-prisma": "course-api",
};

export function term(session, spec = {}) {
  const all = TRANSCRIPTS[session];
  if (!all) throw new Error(`Backend Engineering: no recorded session "${session}"`);
  const names = spec.only || Object.keys(all);
  const commands = {};
  for (const c of names) {
    if (all[c] === undefined) throw new Error(`Backend Engineering: "${c}" was not recorded in ${session}`);
    commands[c] = all[c];
  }
  for (const c of spec.accept || []) {
    if (!(c in commands)) throw new Error(`Backend Engineering: accepted command "${c}" is not offered in ${session}`);
  }
  const { only: _only, ...rest } = spec;
  return {
    session,
    prompt: spec.prompt || promptFor(session),
    commands,
    available: Object.keys(commands),
    ...rest,
    intro: spec.intro ? `${spec.intro} ${RECORDED}` : RECORDED,
  };
}

/** One recorded output. */
export function out(session, command) {
  const output = TRANSCRIPTS[session]?.[command];
  if (output === undefined) throw new Error(`Backend Engineering: "${command}" was not recorded in ${session}`);
  return output;
}

/** A recorded command and its output, laid out as it appeared at the prompt. */
export function shown(session, command) {
  const output = out(session, command);
  const prompt = promptFor(session);
  return output ? `${prompt} ${command}\n${output}` : `${prompt} ${command}`;
}

export function shownAll(session, commands) {
  return commands.map((c) => shown(session, c)).join("\n\n");
}

/* ── Judgement calls ──────────────────────────────────────────────────── */

/**
 * A `decision` practice. `right` is [text, why]; each of `wrong` is
 * [text, whyWrong]; `at` (0–3) is where the right answer appears.
 */
export function decide({ scenario, question, right, wrong, at = 0, aftermath }) {
  const options = wrong.map(([text, whyWrong]) => ({ text, whyWrong }));
  options.splice(Math.min(at, options.length), 0, { text: right[0], why: right[1], right: true });
  const ids = "abcdef";
  const built = options.map((o, i) => {
    const { right: isRight, ...rest } = o;
    void isRight;
    return { id: ids[i], ...rest };
  });
  return { scenario, question, options: built, correct: ids[options.findIndex((o) => o.right)], aftermath };
}

/* ── Project files ────────────────────────────────────────────────────── */

/** Versions the course's projects depend on (the lab machine runs these). */
export const V = {
  express: "^5.3.0",
  zod: "^4.6.7",
  pg: "^8.23.1",
  jsonwebtoken: "^9.0.3",
  bcryptjs: "^3.0.3",
  argon2: "^0.45.1",
  cors: "^2.8.6",
  helmet: "^8.3.0",
  "cookie-parser": "^1.4.7",
  "express-rate-limit": "^8.7.1",
  multer: "^2.5.0",
  dotenv: "^18.0.9",
  yaml: "^2.9.1",
  "node-cron": "^4.6.0",
  redis: "^6.3.0",
  ws: "^8.22.0",
  nodemailer: "^10.2.1",
  uuid: "^13.0.0",
  vitest: "^5.0.5",
  supertest: "^7.3.1",
  typescript: "^6.0.3",
  "@types/node": "^24.19.2",
  "@types/express": "^5.0.6",
  "@types/pg": "^8.23.1",
  "@types/jsonwebtoken": "^9.0.10",
  "@types/supertest": "^7.2.1",
  prisma: "^7.10.1",
  "@prisma/client": "^7.10.1",
  "@prisma/adapter-pg": "^7.10.1",
};

/**
 * A package.json as npm writes it (two-space JSON, trailing newline).
 * deps / dev: arrays of package names (versions from V) or objects.
 */
export function pkg({ name = "course-api", version = "1.0.0", type = "module", main, scripts, deps = [], dev = [], extra = {} } = {}) {
  const pick = (list) => (Array.isArray(list) ? Object.fromEntries(list.map((n) => [n, V[n] || "*"])) : list);
  const json = { name, version, ...(main ? { main } : {}), ...(type ? { type } : {}), ...(scripts ? { scripts } : {}), ...extra };
  if (Object.keys(pick(deps)).length) json.dependencies = pick(deps);
  if (Object.keys(pick(dev)).length) json.devDependencies = pick(dev);
  return `${JSON.stringify(json, null, 2)}\n`;
}
