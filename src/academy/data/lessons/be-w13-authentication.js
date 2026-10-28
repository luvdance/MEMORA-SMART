/**
 * BACKEND ENGINEERING · WEEK 13 · AUTHENTICATION AND USER MANAGEMENT
 *
 * Curriculum 13.1 – 13.P. Authentication vs authorization; registration
 * and login; password hashing; sessions and cookies; access and refresh
 * tokens; JWTs; reset and verification flows; MFA; lockout and throttling;
 * cookie settings and invalidation; four exercises; and a documented
 * authentication module.
 *
 * Labs run real Express, node-postgres, jsonwebtoken and cookie-parser on
 * the lab's PostgreSQL; argon2 is the lab's Argon2id (the reference
 * algorithm, in node-argon2's API and format), and email goes to a local
 * SMTP mailbox (lab.mail) the checks can read. Expiry times are computed
 * in JavaScript from Date.now(), so the checks can move the lab's clock.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

import { decide, pkg } from "./be-helpers.js";

export const SECTION_ID = "be-s13-authentication";
const MODULE = "be-w13-authentication";

const AUTH_PKG = pkg({ name: "course-api", scripts: { start: "node --env-file=.env server.js" }, deps: ["argon2", "cookie-parser", "express", "jsonwebtoken", "nodemailer", "pg"] });
const AUTH_ENV = `DATABASE_URL=postgresql://academy_app:app-password@localhost:5432/academy
JWT_SECRET=0b6c9f6e3d1a4f5bb2e8c7d90a1f3e5c7b9d2f4a6c8e0b1d3f5a7c9e1b3d5f7a
APP_URL=http://localhost:3000
SMTP_HOST=localhost
SMTP_PORT=1025
`;
const READ_ONLY = ["package.json", ".env", "db.js"];

const AUTH_SQL = `CREATE TABLE users (
  id                integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  email             text NOT NULL UNIQUE,
  full_name         text NOT NULL,
  password_hash     text NOT NULL,
  email_verified_at timestamptz,
  failed_logins     integer NOT NULL DEFAULT 0,
  locked_until      timestamptz,
  created_at        timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE sessions (
  token_hash text PRIMARY KEY,
  user_id    integer NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  expires_at timestamptz NOT NULL
);
CREATE TABLE refresh_tokens (
  token_hash text PRIMARY KEY,
  user_id    integer NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  family     text NOT NULL,
  expires_at timestamptz NOT NULL,
  used_at    timestamptz,
  revoked_at timestamptz
);
CREATE TABLE email_tokens (
  token_hash text PRIMARY KEY,
  user_id    integer NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  purpose    text NOT NULL CHECK (purpose IN ('verify', 'reset')),
  expires_at timestamptz NOT NULL,
  used_at    timestamptz
);
`;

const DB_JS = `import pg from "pg";

export const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
`;

const PASSWORDS_JS = `import argon2 from "argon2";

// Argon2id with node-argon2's defaults (64 MiB, 3 passes, 4 lanes); the salt is random per hash.
export const hashPassword = (password) => argon2.hash(password, { type: argon2.argon2id });
export const verifyPassword = (hash, password) => argon2.verify(hash, password);
`;

const TOKENS_JS = `import { createHash, randomBytes } from "node:crypto";

/** A random, unguessable token for a link or a cookie (256 bits). */
export const newToken = () => randomBytes(32).toString("base64url");
/** Tokens are stored hashed: a leaked table holds nothing an attacker can use. */
export const hashToken = (token) => createHash("sha256").update(token).digest("hex");
`;

const MAILER_JS = `import nodemailer from "nodemailer";

const transport = nodemailer.createTransport({ host: process.env.SMTP_HOST, port: Number(process.env.SMTP_PORT) });

export const sendMail = (to, subject, text) => transport.sendMail({ from: "Academy <no-reply@academy.example>", to, subject, text });
`;

const SESSIONS_JS = `import { pool } from "./db.js";
import { hashToken, newToken } from "./tokens.js";

export const SESSION_DAYS = 7;
export const COOKIE = { httpOnly: true, secure: true, sameSite: "lax", path: "/" };

export async function createSession(userId) {
  const token = newToken();
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 86_400_000);
  await pool.query("INSERT INTO sessions (token_hash, user_id, expires_at) VALUES ($1, $2, $3)", [hashToken(token), userId, expiresAt]);
  return token;
}

export async function getSessionUser(token) {
  if (!token) return null;
  const { rows } = await pool.query(
    "SELECT u.id, u.email, u.full_name AS \\"fullName\\" FROM sessions s JOIN users u ON u.id = s.user_id WHERE s.token_hash = $1 AND s.expires_at > $2",
    [hashToken(token), new Date()]
  );
  return rows[0] ?? null;
}

export const deleteSession = (token) => pool.query("DELETE FROM sessions WHERE token_hash = $1", [hashToken(String(token))]);
export const deleteAllSessions = (userId) => pool.query("DELETE FROM sessions WHERE user_id = $1", [userId]);
`;

const ERROR_HANDLER_JS = `app.use((err, req, res, next) => {
  if (err.status) return res.status(err.status).json({ error: { code: err.code, message: err.message } });
  if (err.type === "entity.parse.failed") return res.status(400).json({ error: { code: "INVALID_JSON", message: "The request body is not valid JSON" } });
  console.error(err);
  res.status(500).json({ error: { code: "INTERNAL_ERROR", message: "Something went wrong" } });
});
`;
const LISTEN_JS = `app.listen(3000, () => console.log("Course API on http://localhost:3000"));\n`;

const apiError = `const apiError = (status, code, message) => Object.assign(new Error(message), { status, code });\n`;

/** Registration as Lesson 92 builds it (given in later labs). */
const REGISTER_ROUTE = `const EMAIL = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;

app.post("/auth/register", async (req, res) => {
  const email = String(req.body?.email ?? "").trim().toLowerCase();
  const fullName = String(req.body?.fullName ?? "").trim();
  const password = String(req.body?.password ?? "");
  const details = [];
  if (!EMAIL.test(email)) details.push({ field: "email", message: "must be a valid email" });
  if (!fullName) details.push({ field: "fullName", message: "is required" });
  if (password.length < 12) details.push({ field: "password", message: "must be at least 12 characters" });
  if (details.length) return res.status(400).json({ error: { code: "VALIDATION_FAILED", message: "Invalid request body", details } });
  try {
    const { rows } = await pool.query(
      'INSERT INTO users (email, full_name, password_hash) VALUES ($1, $2, $3) RETURNING id, email, full_name AS "fullName"',
      [email, fullName, await hashPassword(password)]
    );
    res.status(201).json({ data: rows[0] });
  } catch (err) {
    if (err.code === "23505") return res.status(409).json({ error: { code: "EMAIL_TAKEN", message: "An account with this email already exists" } });
    throw err;
  }
});
`;

/** A check preamble: register Ada, then log in, keeping the session cookie. */
const ADA = `const ada = { email: "ada@example.com", fullName: "Ada Obi", password: "correct horse battery staple" };`;
const cookieOf = `const cookieOf = (r) => { const c = [].concat(r.headers["set-cookie"] || []).find((x) => x.startsWith("sid=")); return c ? c.split(";")[0] : null; };`;
const LINK = `const linkToken = (mail) => (/token=([\\w-]+)/.exec(mail?.text || "") || [])[1];`;

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 92 · 13.1 – 13.2 · AUTHENTICATION, REGISTRATION AND LOGIN
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "be-l92-auth-basics",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 1,
    covers: ["13.1", "13.2"],
    title: "Authentication, Registration and Login",
    subtitle: "Who are you?",
    estimatedMinutes: 60,
    intro: "Phase 4 makes the API safe for real users. It starts with the question every request must answer before any other: who is asking?",
    atoms: [
      {
        id: "a-be-authn-authz",
        title: "Authentication vs authorization",
        explain:
          "AUTHENTICATION establishes WHO the user is: a password, a session cookie, a token, a code from an app. AUTHORIZATION decides WHAT that user may do: may Ada see this enrollment, may an instructor edit this course (Week 14). They fail differently: no or invalid credentials → 401 Unauthorized ('who are you?'); valid credentials without permission → 403 Forbidden. Authentication happens once per request (in middleware) and gives req.user; authorization happens in each handler or rule, using req.user.",
        decision: decide({
          scenario: "A logged-in student calls DELETE /courses/3, which only administrators may do. Another client calls the same endpoint with an expired session cookie.",
          question: "What should each receive?",
          right: ["The student: 403 Forbidden (known, not allowed). The expired session: 401 Unauthorized (must log in again)", "Authorization vs authentication."],
          wrong: [
            ["Both 401", "The student is authenticated; 401 would make the client ask them to log in again for nothing."],
            ["Both 403", "The expired client needs to know it must re-authenticate."],
            ["The student 404, the expired session 403", "404 can hide existence, but 403 here is clearer; and an expired session is 401."],
          ],
          at: 1,
          aftermath: "Some APIs answer 404 instead of 403 for resources a user may not even know exist (another student's enrollment): Week 14 discusses when.",
        }),
      },
      {
        id: "a-be-register-login",
        title: "Registration, login, logout and verification",
        explain:
          "REGISTRATION validates input (a real-looking email, normalised to lower case; a password of at least 12 characters, rather than composition rules), stores a HASH of the password (never the password), and answers without the hash. A duplicate email is decided by the UNIQUE constraint (409). LOGIN finds the user and verifies the password, and must answer the SAME for an unknown email and a wrong password ('Invalid email or password'), or attackers can test which emails have accounts (account enumeration). LOGOUT ends the session (next lesson). VERIFICATION proves the user owns the email (Lesson 96).",
        nodeLab: {
          task:
            "Fix registration and login. POST /auth/register: lower-case and trim the email, require a valid email, a fullName and a password of at least 12 characters (400 VALIDATION_FAILED with details), store hashPassword(password) (passwords.js), answer 201 { data: { id, email, fullName } } with no password or hash, and 409 EMAIL_TAKEN for a duplicate (in any letter case). POST /auth/login: answer 200 { data: { id, email, fullName } } for the right password, and exactly the same 401 INVALID_CREDENTIALS \"Invalid email or password\" for a wrong password and for an unknown email.",
          db: AUTH_SQL,
          files: {
            "package.json": AUTH_PKG,
            ".env": AUTH_ENV,
            "db.js": DB_JS,
            "passwords.js": PASSWORDS_JS,
            "server.js": `import express from "express";
import { pool } from "./db.js";
import { hashPassword, verifyPassword } from "./passwords.js";

const app = express();
app.use(express.json());

app.post("/auth/register", async (req, res) => {
  const { email, fullName, password } = req.body;
  const { rows } = await pool.query("INSERT INTO users (email, full_name, password_hash) VALUES ($1, $2, $3) RETURNING *", [email, fullName, password]);
  res.status(201).json({ data: rows[0] });
});

app.post("/auth/login", async (req, res) => {
  const { rows } = await pool.query("SELECT * FROM users WHERE email = $1", [req.body.email]);
  if (!rows[0]) return res.status(404).json({ error: { code: "NO_SUCH_USER", message: "No account with that email" } });
  if (rows[0].password_hash !== req.body.password) return res.status(401).json({ error: { code: "WRONG_PASSWORD", message: "Wrong password" } });
  res.json({ data: rows[0] });
});

${ERROR_HANDLER_JS}
${LISTEN_JS}`,
          },
          readOnly: [...READ_ONLY, "passwords.js"],
          open: "server.js",
          solution: {
            "server.js": `import express from "express";
import { pool } from "./db.js";
import { hashPassword, verifyPassword } from "./passwords.js";

const app = express();
app.use(express.json());

${REGISTER_ROUTE}
const INVALID = { error: { code: "INVALID_CREDENTIALS", message: "Invalid email or password" } };

app.post("/auth/login", async (req, res) => {
  const email = String(req.body?.email ?? "").trim().toLowerCase();
  const { rows } = await pool.query('SELECT id, email, full_name AS "fullName", password_hash FROM users WHERE email = $1', [email]);
  const user = rows[0];
  // The same answer whether the email is unknown or the password is wrong: no account enumeration.
  if (!user || !(await verifyPassword(user.password_hash, String(req.body?.password ?? "")))) return res.status(401).json(INVALID);
  res.json({ data: { id: user.id, email: user.email, fullName: user.fullName } });
});

${ERROR_HANDLER_JS}
${LISTEN_JS}`,
          },
          requests: [
            { label: "POST /auth/register", method: "POST", path: "/auth/register", body: { email: "Ada@Example.com", fullName: "Ada Obi", password: "correct horse battery staple" } },
            { label: "POST /auth/login", method: "POST", path: "/auth/login", body: { email: "ada@example.com", password: "correct horse battery staple" } },
            { label: "POST /auth/login (wrong)", method: "POST", path: "/auth/login", body: { email: "ada@example.com", password: "nope" } },
          ],
          tests: [
            { label: "Registration stores a hash and answers without it", check: `const r = await post("/auth/register", { email: " Ada@Example.com ", fullName: "Ada Obi", password: "correct horse battery staple" }); eq(r.status, 201, "status"); eq(r.json, { data: { id: 1, email: "ada@example.com", fullName: "Ada Obi" } }, "the answer: the email lower-cased, no password or hash"); const [u] = await sql("SELECT email, password_hash FROM users"); assert(u.password_hash.startsWith("$argon2id$"), "password_hash should be an Argon2id hash from hashPassword, not the password");` },
            { label: "Invalid input and duplicates are refused", check: `const r = await post("/auth/register", { email: "not-an-email", fullName: "", password: "short" }); eq(r.status, 400, "status"); eq(r.json.error.details.map((d) => d.field), ["email", "fullName", "password"], "one detail per problem"); const d = await post("/auth/register", { email: "ADA@example.com", fullName: "Copy", password: "another long password" }); eq([d.status, d.json?.error?.code], [409, "EMAIL_TAKEN"], "the same email in other letters");` },
            { label: "Login with the right password", check: `const r = await post("/auth/login", { email: "ADA@example.com", password: "correct horse battery staple" }); eq([r.status, r.json], [200, { data: { id: 1, email: "ada@example.com", fullName: "Ada Obi" } }], "login, in any letter case of the email");` },
            { label: "A wrong password and an unknown email look the same", check: `const a = await post("/auth/login", { email: "ada@example.com", password: "wrong password" }); const b = await post("/auth/login", { email: "nobody@example.com", password: "wrong password" }); eq([a.status, a.json], [401, { error: { code: "INVALID_CREDENTIALS", message: "Invalid email or password" } }], "wrong password"); eq([b.status, b.json], [a.status, a.json], "an unknown email must get exactly the same answer");` },
          ],
          hint: "Normalise the email the same way in both routes. In login: if (!user || !(await verifyPassword(user.password_hash, password))) return the one 401. Catch err.code === \"23505\" on the insert for 409.",
          successMessage: "Passwords are hashed, answers carry no secrets, and the login endpoint no longer tells strangers which emails have accounts.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 93 · 13.3 · PASSWORD HASHING
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "be-l93-hashing",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 2,
    covers: ["13.3"],
    title: "Password Hashing with Argon2id or bcrypt",
    subtitle: "Making a stolen database useless",
    estimatedMinutes: 55,
    intro: "Databases leak. When yours does, the question is whether the attacker gets passwords. Proper hashing makes the answer no.",
    atoms: [
      {
        id: "a-be-password-hashing",
        title: "Password hashing",
        explain:
          "A password hash must be ONE-WAY, SALTED (a random salt per password, so equal passwords get different hashes and precomputed tables are useless) and deliberately SLOW (so guessing billions of passwords per second is impossible). General hashes (SHA-256, MD5) are fast: never use them for passwords. Use ARGON2ID (the winner of the Password Hashing Competition: memory-hard, OWASP's first choice) or BCRYPT (older, still acceptable, limited to 72 bytes). Both store their parameters and salt in the hash string ($argon2id$v=19$m=65536,t=3,p=4$<salt>$<hash>), so they can be raised later: on login, if needsRehash(hash) or the hash is a legacy format, hash the password again and store the new one.",
        nodeLab: {
          task:
            "Old accounts were stored as sha256:<hex> (unsalted SHA-256): replace them as users log in. In passwords.js: hashPassword(password) with Argon2id; verifyPassword(hash, password) that checks Argon2 hashes with argon2.verify and legacy sha256: hashes by comparing SHA-256 hex digests (with timingSafeEqual); and needsUpgrade(hash) (true for anything that is not Argon2id). In server.js, after a successful login, store a new Argon2id hash if needsUpgrade.",
          db: `${AUTH_SQL}
-- An account from the old system: unsalted SHA-256 of "correct horse battery staple".
INSERT INTO users (email, full_name, password_hash)
VALUES ('legacy@example.com', 'Legacy User', 'sha256:' || encode(sha256('correct horse battery staple'::bytea), 'hex'));
`,
          files: {
            "package.json": AUTH_PKG,
            ".env": AUTH_ENV,
            "db.js": DB_JS,
            "passwords.js": `import { createHash } from "node:crypto";

export const hashPassword = (password) => "sha256:" + createHash("sha256").update(password).digest("hex");

export async function verifyPassword(hash, password) {
  return hash === hashPassword(password);
}

export const needsUpgrade = (hash) => false;
`,
            "server.js": `import express from "express";
import { pool } from "./db.js";
import { hashPassword, needsUpgrade, verifyPassword } from "./passwords.js";

const app = express();
app.use(express.json());

${REGISTER_ROUTE}
app.post("/auth/login", async (req, res) => {
  const email = String(req.body?.email ?? "").trim().toLowerCase();
  const password = String(req.body?.password ?? "");
  const { rows } = await pool.query("SELECT id, email, password_hash FROM users WHERE email = $1", [email]);
  const user = rows[0];
  if (!user || !(await verifyPassword(user.password_hash, password))) {
    return res.status(401).json({ error: { code: "INVALID_CREDENTIALS", message: "Invalid email or password" } });
  }
  // TODO: upgrade old hashes here
  res.json({ data: { id: user.id, email: user.email } });
});

${ERROR_HANDLER_JS}
${LISTEN_JS}`,
          },
          readOnly: READ_ONLY,
          open: "passwords.js",
          solution: {
            "passwords.js": `import { createHash, timingSafeEqual } from "node:crypto";
import argon2 from "argon2";

export const hashPassword = (password) => argon2.hash(password, { type: argon2.argon2id });

const sha256 = (text) => createHash("sha256").update(text).digest();

export async function verifyPassword(hash, password) {
  if (hash.startsWith("$argon2")) return argon2.verify(hash, password);
  if (hash.startsWith("sha256:")) {
    // Legacy accounts: compare the digests in constant time.
    const stored = Buffer.from(hash.slice(7), "hex");
    const given = sha256(password);
    return stored.length === given.length && timingSafeEqual(stored, given);
  }
  return false;
}

export const needsUpgrade = (hash) => !hash.startsWith("$argon2id$") || argon2.needsRehash(hash);
`,
            "server.js": `import express from "express";
import { pool } from "./db.js";
import { hashPassword, needsUpgrade, verifyPassword } from "./passwords.js";

const app = express();
app.use(express.json());

${REGISTER_ROUTE}
app.post("/auth/login", async (req, res) => {
  const email = String(req.body?.email ?? "").trim().toLowerCase();
  const password = String(req.body?.password ?? "");
  const { rows } = await pool.query("SELECT id, email, password_hash FROM users WHERE email = $1", [email]);
  const user = rows[0];
  if (!user || !(await verifyPassword(user.password_hash, password))) {
    return res.status(401).json({ error: { code: "INVALID_CREDENTIALS", message: "Invalid email or password" } });
  }
  // The only moment the plain password is known: replace a weak or outdated hash.
  if (needsUpgrade(user.password_hash)) {
    await pool.query("UPDATE users SET password_hash = $2 WHERE id = $1", [user.id, await hashPassword(password)]);
  }
  res.json({ data: { id: user.id, email: user.email } });
});

${ERROR_HANDLER_JS}
${LISTEN_JS}`,
          },
          tests: [
            { label: "hashPassword makes salted Argon2id hashes", check: `const p = await load("passwords.js"); const a = await wait(p.hashPassword("correct horse battery staple")); const b = await wait(p.hashPassword("correct horse battery staple")); assert(a.startsWith("$argon2id$v=19$"), "an Argon2id PHC string ($argon2id$v=19$…)"); assert(a !== b, "the same password hashed twice must differ (a random salt per hash)"); eq(await wait(p.verifyPassword(a, "correct horse battery staple")), true, "verify the right password"); eq(await wait(p.verifyPassword(a, "Correct horse battery staple")), false, "reject a different password");` },
            { label: "Legacy SHA-256 accounts can still log in", check: `const r = await post("/auth/login", { email: "legacy@example.com", password: "correct horse battery staple" }); eq(r.status, 200, "the legacy account logs in"); const w = await post("/auth/login", { email: "legacy@example.com", password: "wrong" }); eq(w.status, 401, "with the wrong password it does not");` },
            { label: "…and their hash is upgraded to Argon2id", check: `const [u] = await sql("SELECT password_hash FROM users WHERE email = 'legacy@example.com'"); assert(u.password_hash.startsWith("$argon2id$"), "after a successful login the stored hash should be Argon2id, not " + u.password_hash.slice(0, 12) + "…"); eq((await post("/auth/login", { email: "legacy@example.com", password: "correct horse battery staple" })).status, 200, "and the account still logs in afterwards");` },
            { label: "New accounts are Argon2id from the start", check: `eq((await post("/auth/register", { email: "new@example.com", fullName: "New User", password: "a long new password" })).status, 201, "register"); const [u] = await sql("SELECT password_hash FROM users WHERE email = 'new@example.com'"); assert(u.password_hash.startsWith("$argon2id$"), "a new account's hash");` },
            { label: "needsUpgrade and constant-time comparison", check: `const p = await load("passwords.js"); eq(p.needsUpgrade("sha256:abc"), true, "a sha256: hash needs an upgrade"); eq(p.needsUpgrade(await wait(p.hashPassword("x".repeat(12)))), false, "a fresh Argon2id hash does not"); has(file("passwords.js"), "timingSafeEqual", "compare the legacy digests with timingSafeEqual");` },
          ],
          hint: "hashPassword: argon2.hash(password, { type: argon2.argon2id }). verifyPassword: argon2.verify for $argon2 hashes; for sha256: compare Buffer.from(hex, \"hex\") with the SHA-256 digest using timingSafeEqual (check lengths first).",
          successMessage: "Every login now silently retires an unsalted hash. In a few months, the old format is gone from the table without asking anyone to reset their password.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 94 · 13.4 · SESSIONS AND COOKIES
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "be-l94-sessions",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 3,
    covers: ["13.4"],
    title: "Sessions and Cookies",
    subtitle: "Staying logged in",
    estimatedMinutes: 60,
    intro: "HTTP forgets everything between requests. A session remembers who logged in: the server keeps a record, and the browser keeps a cookie that points to it.",
    atoms: [
      {
        id: "a-be-sessions",
        title: "Sessions and cookies",
        explain:
          "On login the server creates a SESSION: a random token (256 bits, crypto.randomBytes) stored server-side with the user id and an expiry, and sent to the browser in a COOKIE: Set-Cookie: sid=<token>; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=604800. The browser sends it back on every request (Cookie: sid=…), and middleware (cookie-parser, then a lookup) turns it into req.user. Store the token's HASH, not the token, so a database leak cannot be replayed as cookies. Server-side sessions can be revoked instantly by deleting the row; that is their big advantage over self-contained tokens.",
        nodeLab: {
          task:
            "Add sessions. POST /auth/login (password check given) creates a session: a random token from tokens.js, stored HASHED in sessions with expires_at 7 days from now (computed in JavaScript), and sets the cookie sid with httpOnly, secure, sameSite lax, path / and maxAge 7 days. GET /me returns { data: { id, email, fullName } } for a valid, unexpired session cookie and 401 UNAUTHENTICATED otherwise. POST /auth/logout deletes the session, clears the cookie and answers 204.",
          db: AUTH_SQL,
          files: {
            "package.json": AUTH_PKG,
            ".env": AUTH_ENV,
            "db.js": DB_JS,
            "passwords.js": PASSWORDS_JS,
            "tokens.js": TOKENS_JS,
            "server.js": `import cookieParser from "cookie-parser";
import express from "express";
import { pool } from "./db.js";
import { hashPassword, verifyPassword } from "./passwords.js";
import { hashToken, newToken } from "./tokens.js";

const app = express();
app.use(express.json());
app.use(cookieParser());

${REGISTER_ROUTE}
app.post("/auth/login", async (req, res) => {
  const email = String(req.body?.email ?? "").trim().toLowerCase();
  const { rows } = await pool.query('SELECT id, email, full_name AS "fullName", password_hash FROM users WHERE email = $1', [email]);
  const user = rows[0];
  if (!user || !(await verifyPassword(user.password_hash, String(req.body?.password ?? "")))) {
    return res.status(401).json({ error: { code: "INVALID_CREDENTIALS", message: "Invalid email or password" } });
  }
  // TODO: create a session and set the sid cookie
  res.json({ data: { id: user.id, email: user.email, fullName: user.fullName } });
});

// GET /me, POST /auth/logout

${ERROR_HANDLER_JS}
${LISTEN_JS}`,
          },
          readOnly: [...READ_ONLY, "passwords.js", "tokens.js"],
          open: "server.js",
          solution: {
            "server.js": `import cookieParser from "cookie-parser";
import express from "express";
import { pool } from "./db.js";
import { hashPassword, verifyPassword } from "./passwords.js";
import { hashToken, newToken } from "./tokens.js";

const app = express();
app.use(express.json());
app.use(cookieParser());

const SESSION_MS = 7 * 24 * 60 * 60 * 1000;
const COOKIE = { httpOnly: true, secure: true, sameSite: "lax", path: "/" };

${REGISTER_ROUTE}
app.post("/auth/login", async (req, res) => {
  const email = String(req.body?.email ?? "").trim().toLowerCase();
  const { rows } = await pool.query('SELECT id, email, full_name AS "fullName", password_hash FROM users WHERE email = $1', [email]);
  const user = rows[0];
  if (!user || !(await verifyPassword(user.password_hash, String(req.body?.password ?? "")))) {
    return res.status(401).json({ error: { code: "INVALID_CREDENTIALS", message: "Invalid email or password" } });
  }
  const token = newToken();
  await pool.query("INSERT INTO sessions (token_hash, user_id, expires_at) VALUES ($1, $2, $3)", [hashToken(token), user.id, new Date(Date.now() + SESSION_MS)]);
  res.cookie("sid", token, { ...COOKIE, maxAge: SESSION_MS });
  res.json({ data: { id: user.id, email: user.email, fullName: user.fullName } });
});

app.get("/me", async (req, res) => {
  const token = req.cookies.sid;
  const { rows } = token
    ? await pool.query(
        'SELECT u.id, u.email, u.full_name AS "fullName" FROM sessions s JOIN users u ON u.id = s.user_id WHERE s.token_hash = $1 AND s.expires_at > $2',
        [hashToken(token), new Date()]
      )
    : { rows: [] };
  if (!rows[0]) return res.status(401).json({ error: { code: "UNAUTHENTICATED", message: "Log in to continue" } });
  res.json({ data: rows[0] });
});

app.post("/auth/logout", async (req, res) => {
  if (req.cookies.sid) await pool.query("DELETE FROM sessions WHERE token_hash = $1", [hashToken(req.cookies.sid)]);
  res.clearCookie("sid", COOKIE);
  res.status(204).end();
});

${ERROR_HANDLER_JS}
${LISTEN_JS}`,
          },
          tests: [
            { label: "Login sets a secure session cookie", check: `${ADA} ${cookieOf} await post("/auth/register", ada); const r = await post("/auth/login", ada); eq(r.status, 200, "login"); const raw = [].concat(r.headers["set-cookie"] || []).find((c) => c.startsWith("sid=")); assert(raw, "login should set a cookie named sid"); for (const attr of ["HttpOnly", "Secure", "SameSite=Lax", "Path=/", "Max-Age=604800"]) has(raw, attr, "the sid cookie should have " + attr);` },
            { label: "The cookie gives access to /me", check: `${ADA} ${cookieOf} const c = cookieOf(await post("/auth/login", ada)); const r = await get("/me", { headers: { Cookie: c } }); eq([r.status, r.json], [200, { data: { id: 1, email: "ada@example.com", fullName: "Ada Obi" } }], "GET /me with the cookie"); const n = await get("/me"); eq([n.status, n.json?.error?.code], [401, "UNAUTHENTICATED"], "GET /me without it"); eq((await get("/me", { headers: { Cookie: "sid=made-up" } })).status, 401, "a made-up cookie");` },
            { label: "The database stores a hash, not the token", check: `${ADA} ${cookieOf} const c = cookieOf(await post("/auth/login", ada)); const token = c.slice(4); const rows = await sql("SELECT token_hash FROM sessions"); assert(rows.length >= 1, "a session row"); assert(rows.every((s) => s.token_hash !== token), "store hashToken(token), not the token itself");` },
            { label: "Logout ends the session", check: `${ADA} ${cookieOf} const c = cookieOf(await post("/auth/login", ada)); const out = await post("/auth/logout", {}, { headers: { Cookie: c } }); eq(out.status, 204, "logout"); assert([].concat(out.headers["set-cookie"] || []).some((x) => x.startsWith("sid=;") || x.includes("Expires=Thu, 01 Jan 1970")), "logout should clear the sid cookie"); eq((await get("/me", { headers: { Cookie: c } })).status, 401, "the old cookie no longer works, even if a client kept it");` },
            { label: "Sessions expire after 7 days", check: `${ADA} ${cookieOf} const c = cookieOf(await post("/auth/login", ada)); await advance(6 * 86400000); eq((await get("/me", { headers: { Cookie: c } })).status, 200, "after 6 days"); await advance(2 * 86400000); eq((await get("/me", { headers: { Cookie: c } })).status, 401, "after 8 days");` },
          ],
          hint: "const token = newToken(); insert hashToken(token) with new Date(Date.now() + 7 days); res.cookie(\"sid\", token, { httpOnly: true, secure: true, sameSite: \"lax\", path: \"/\", maxAge }). In /me: look the hash up with expires_at > $2 and new Date().",
          successMessage: "A session the browser cannot read from JavaScript, the server can end at any time, and a database leak cannot replay.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 95 · 13.5 – 13.6 · TOKENS AND JWTS
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "be-l95-tokens",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 4,
    covers: ["13.5", "13.6"],
    title: "Access Tokens, Refresh Tokens and JWTs",
    subtitle: "Authentication for mobile apps and other APIs",
    estimatedMinutes: 80,
    intro: "Cookies suit browsers. Mobile apps and other services usually send a token in the Authorization header instead. Done right, that means short-lived access tokens and carefully rotated refresh tokens.",
    atoms: [
      {
        id: "a-be-jwt",
        title: "JWT structure, validation and common pitfalls",
        explain:
          "A JWT is three base64url parts: header.payload.signature. The header names the algorithm ({\"alg\":\"HS256\"}); the payload holds CLAIMS (sub: the user id, exp: expiry, iat, iss: issuer, aud: audience, plus your own like role); the signature is an HMAC (or RSA/ECDSA signature) of the first two parts. The payload is ENCODED, NOT ENCRYPTED: anyone can read it, so no secrets inside. Pitfalls: decoding without verifying (jwt.decode trusts anything); accepting alg 'none' or an algorithm you did not choose (always pass algorithms: [\"HS256\"]); weak or committed secrets (32+ random bytes, from the environment); missing exp; not checking iss/aud. A JWT cannot be revoked before it expires, so keep access tokens short (15 minutes).",
        nodeLab: {
          task:
            "requireAuth trusts any token it can decode. Rewrite it with jwt.verify: the secret from process.env.JWT_SECRET, algorithms [\"HS256\"], issuer academy-api and audience academy-app. No Authorization: Bearer header → 401 TOKEN_MISSING; an expired token → 401 TOKEN_EXPIRED; anything else wrong → 401 TOKEN_INVALID. Also make POST /auth/login sign its token with that secret, issuer and audience, expiresIn 15m, and sub = the user id as a string.",
          db: AUTH_SQL,
          files: {
            "package.json": AUTH_PKG,
            ".env": AUTH_ENV,
            "db.js": DB_JS,
            "passwords.js": PASSWORDS_JS,
            "auth.js": `import jwt from "jsonwebtoken";

export function signAccessToken(user) {
  return jwt.sign({ sub: user.id, email: user.email }, "secret");
}

export function requireAuth(req, res, next) {
  const token = (req.get("authorization") || "").replace("Bearer ", "");
  const payload = jwt.decode(token);
  if (!payload) return res.status(401).json({ error: { code: "TOKEN_MISSING", message: "Send Authorization: Bearer <token>" } });
  req.user = { id: Number(payload.sub), email: payload.email };
  next();
}
`,
            "server.js": `import express from "express";
import { requireAuth, signAccessToken } from "./auth.js";
import { pool } from "./db.js";
import { hashPassword, verifyPassword } from "./passwords.js";

const app = express();
app.use(express.json());

${REGISTER_ROUTE}
app.post("/auth/login", async (req, res) => {
  const email = String(req.body?.email ?? "").trim().toLowerCase();
  const { rows } = await pool.query("SELECT id, email, password_hash FROM users WHERE email = $1", [email]);
  const user = rows[0];
  if (!user || !(await verifyPassword(user.password_hash, String(req.body?.password ?? "")))) {
    return res.status(401).json({ error: { code: "INVALID_CREDENTIALS", message: "Invalid email or password" } });
  }
  res.json({ data: { accessToken: signAccessToken(user), tokenType: "Bearer", expiresIn: 900 } });
});

app.get("/me", requireAuth, (req, res) => res.json({ data: req.user }));

${ERROR_HANDLER_JS}
${LISTEN_JS}`,
          },
          readOnly: [...READ_ONLY, "passwords.js", "server.js"],
          open: "auth.js",
          solution: {
            "auth.js": `import jwt from "jsonwebtoken";

const OPTIONS = { issuer: "academy-api", audience: "academy-app" };

export function signAccessToken(user) {
  return jwt.sign({ email: user.email }, process.env.JWT_SECRET, { ...OPTIONS, subject: String(user.id), expiresIn: "15m", algorithm: "HS256" });
}

const unauthorized = (res, code, message) => res.status(401).json({ error: { code, message } });

export function requireAuth(req, res, next) {
  const [scheme, token] = (req.get("authorization") || "").split(" ");
  if (scheme !== "Bearer" || !token) return unauthorized(res, "TOKEN_MISSING", "Send Authorization: Bearer <token>");
  try {
    // verify, never decode: checks the signature, the algorithm, exp, iss and aud.
    const payload = jwt.verify(token, process.env.JWT_SECRET, { ...OPTIONS, algorithms: ["HS256"] });
    req.user = { id: Number(payload.sub), email: payload.email };
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") return unauthorized(res, "TOKEN_EXPIRED", "The token has expired");
    return unauthorized(res, "TOKEN_INVALID", "The token is not valid");
  }
}
`,
          },
          tests: [
            { label: "A token from login opens /me; no token → TOKEN_MISSING", check: `${ADA} await post("/auth/register", ada); const t = (await post("/auth/login", ada)).json.data.accessToken; const r = await get("/me", { headers: { Authorization: "Bearer " + t } }); eq([r.status, r.json], [200, { data: { id: 1, email: "ada@example.com" } }], "GET /me with the token"); const n = await get("/me"); eq([n.status, n.json?.error?.code], [401, "TOKEN_MISSING"], "no Authorization header");` },
            { label: "The token has the right claims", check: `${ADA} const jwt = await load("jsonwebtoken"); const t = (await post("/auth/login", ada)).json.data.accessToken; const p = jwt.decode(t, { complete: true }); eq(p.header.alg, "HS256", "alg"); eq([p.payload.sub, p.payload.iss, p.payload.aud], ["1", "academy-api", "academy-app"], "sub (a string), iss and aud"); eq(p.payload.exp - p.payload.iat, 900, "expires 15 minutes after it was issued"); eq(jwt.verify(t, "0b6c9f6e3d1a4f5bb2e8c7d90a1f3e5c7b9d2f4a6c8e0b1d3f5a7c9e1b3d5f7a").sub, "1", "signed with JWT_SECRET");` },
            { label: "Forged tokens are refused", check: `const jwt = await load("jsonwebtoken"); const bad = jwt.sign({ sub: "1", email: "ada@example.com" }, "guessed-secret", { issuer: "academy-api", audience: "academy-app", expiresIn: "15m" }); eq((await get("/me", { headers: { Authorization: "Bearer " + bad } })).json?.error?.code, "TOKEN_INVALID", "signed with another secret"); const b64 = (o) => Buffer.from(JSON.stringify(o)).toString("base64url"); const none = b64({ alg: "none", typ: "JWT" }) + "." + b64({ sub: "1", email: "ada@example.com", iss: "academy-api", aud: "academy-app", exp: Math.floor(now() / 1000) + 600 }) + "."; eq((await get("/me", { headers: { Authorization: "Bearer " + none } })).status, 401, "an unsigned token with alg none"); const other = jwt.sign({ sub: "1" }, "0b6c9f6e3d1a4f5bb2e8c7d90a1f3e5c7b9d2f4a6c8e0b1d3f5a7c9e1b3d5f7a", { issuer: "academy-api", audience: "another-app", expiresIn: "15m" }); eq((await get("/me", { headers: { Authorization: "Bearer " + other } })).status, 401, "a token for another audience");` },
            { label: "Expired tokens → TOKEN_EXPIRED", check: `${ADA} const t = (await post("/auth/login", ada)).json.data.accessToken; await advance(14 * 60 * 1000); eq((await get("/me", { headers: { Authorization: "Bearer " + t } })).status, 200, "after 14 minutes"); await advance(2 * 60 * 1000); const r = await get("/me", { headers: { Authorization: "Bearer " + t } }); eq([r.status, r.json?.error?.code], [401, "TOKEN_EXPIRED"], "after 16 minutes");` },
            { label: "No hard-coded secret, no decode", check: `const s = file("auth.js"); has(s, "process.env.JWT_SECRET", "read the secret from process.env.JWT_SECRET"); lacks(s, "jwt.decode", "never trust jwt.decode: use jwt.verify"); has(s, "algorithms", "pass algorithms: [\\"HS256\\"] to jwt.verify");` },
          ],
          hint: "jwt.sign(claims, process.env.JWT_SECRET, { subject: String(user.id), issuer, audience, expiresIn: \"15m\", algorithm: \"HS256\" }); jwt.verify(token, secret, { issuer, audience, algorithms: [\"HS256\"] }) inside try/catch; err.name is TokenExpiredError for expiry.",
          successMessage: "Only tokens this API signed, for this app, in the last 15 minutes, get through. The alg-none trick and a guessed secret both bounce.",
        },
      },
      {
        id: "a-be-refresh-tokens",
        title: "Access tokens and refresh tokens",
        explain:
          "Short access tokens need a way to get new ones without the password: a REFRESH TOKEN, long-lived (30 days), random (not a JWT), stored hashed in the database so it CAN be revoked. POST /auth/refresh exchanges it for a new access token AND a new refresh token (ROTATION), marking the old one used. If a used refresh token is ever presented again, someone has a copy: REUSE DETECTION revokes the whole family (every token descended from that login), logging out both the attacker and the user. Logout revokes the family too.",
        nodeLab: {
          task:
            "Implement refresh tokens in refresh.js (used by server.js): issueRefreshToken(userId, family) creates a random token, stores its hash with the family and expires_at 30 days ahead, and returns it; rotateRefreshToken(token) returns { userId, refreshToken } for a valid unused token (marking it used, issuing the next one in the same family), revokes the whole family and throws REFRESH_REUSED if the token was already used, and throws REFRESH_INVALID if it is unknown, expired or revoked; revokeFamily(token) revokes the token's family. Errors are AppErrors with status 401.",
          db: AUTH_SQL,
          files: {
            "package.json": AUTH_PKG,
            ".env": AUTH_ENV,
            "db.js": DB_JS,
            "passwords.js": PASSWORDS_JS,
            "tokens.js": TOKENS_JS,
            "auth.js": `import jwt from "jsonwebtoken";

const OPTIONS = { issuer: "academy-api", audience: "academy-app" };

export const signAccessToken = (userId) =>
  jwt.sign({}, process.env.JWT_SECRET, { ...OPTIONS, subject: String(userId), expiresIn: "15m", algorithm: "HS256" });

export function requireAuth(req, res, next) {
  const [scheme, token] = (req.get("authorization") || "").split(" ");
  try {
    if (scheme !== "Bearer") throw new Error("missing");
    req.user = { id: Number(jwt.verify(token, process.env.JWT_SECRET, { ...OPTIONS, algorithms: ["HS256"] }).sub) };
    next();
  } catch {
    res.status(401).json({ error: { code: "UNAUTHENTICATED", message: "A valid access token is required" } });
  }
}
`,
            "refresh.js": `import { pool } from "./db.js";
import { hashToken, newToken } from "./tokens.js";

const apiError = (status, code, message) => Object.assign(new Error(message), { status, code });

export async function issueRefreshToken(userId, family) {
  throw apiError(501, "NOT_IMPLEMENTED", "issueRefreshToken");
}

export async function rotateRefreshToken(token) {
  throw apiError(501, "NOT_IMPLEMENTED", "rotateRefreshToken");
}

export async function revokeFamily(token) {}
`,
            "server.js": `import { randomUUID } from "node:crypto";
import express from "express";
import { requireAuth, signAccessToken } from "./auth.js";
import { pool } from "./db.js";
import { hashPassword, verifyPassword } from "./passwords.js";
import { issueRefreshToken, revokeFamily, rotateRefreshToken } from "./refresh.js";

const app = express();
app.use(express.json());

${REGISTER_ROUTE}
app.post("/auth/login", async (req, res) => {
  const email = String(req.body?.email ?? "").trim().toLowerCase();
  const { rows } = await pool.query("SELECT id, password_hash FROM users WHERE email = $1", [email]);
  const user = rows[0];
  if (!user || !(await verifyPassword(user.password_hash, String(req.body?.password ?? "")))) {
    return res.status(401).json({ error: { code: "INVALID_CREDENTIALS", message: "Invalid email or password" } });
  }
  // Each login starts a new family of refresh tokens.
  const refreshToken = await issueRefreshToken(user.id, randomUUID());
  res.json({ data: { accessToken: signAccessToken(user.id), refreshToken } });
});

app.post("/auth/refresh", async (req, res) => {
  const { userId, refreshToken } = await rotateRefreshToken(String(req.body?.refreshToken ?? ""));
  res.json({ data: { accessToken: signAccessToken(userId), refreshToken } });
});

app.post("/auth/logout", async (req, res) => {
  await revokeFamily(String(req.body?.refreshToken ?? ""));
  res.status(204).end();
});

app.get("/me", requireAuth, (req, res) => res.json({ data: req.user }));

${ERROR_HANDLER_JS}
${LISTEN_JS}`,
          },
          readOnly: [...READ_ONLY, "passwords.js", "tokens.js", "auth.js", "server.js"],
          open: "refresh.js",
          solution: {
            "refresh.js": `import { pool } from "./db.js";
import { hashToken, newToken } from "./tokens.js";

const apiError = (status, code, message) => Object.assign(new Error(message), { status, code });
const REFRESH_MS = 30 * 24 * 60 * 60 * 1000;

export async function issueRefreshToken(userId, family) {
  const token = newToken();
  await pool.query("INSERT INTO refresh_tokens (token_hash, user_id, family, expires_at) VALUES ($1, $2, $3, $4)", [
    hashToken(token),
    userId,
    family,
    new Date(Date.now() + REFRESH_MS),
  ]);
  return token;
}

export async function rotateRefreshToken(token) {
  const { rows } = await pool.query("SELECT user_id, family, expires_at, used_at, revoked_at FROM refresh_tokens WHERE token_hash = $1", [hashToken(token)]);
  const row = rows[0];
  if (!row || row.revoked_at || row.expires_at <= new Date()) throw apiError(401, "REFRESH_INVALID", "The refresh token is not valid");
  if (row.used_at) {
    // A used token came back: someone has a copy. End the whole login.
    await pool.query("UPDATE refresh_tokens SET revoked_at = $2 WHERE family = $1 AND revoked_at IS NULL", [row.family, new Date()]);
    throw apiError(401, "REFRESH_REUSED", "This refresh token was already used; please log in again");
  }
  await pool.query("UPDATE refresh_tokens SET used_at = $2 WHERE token_hash = $1", [hashToken(token), new Date()]);
  return { userId: row.user_id, refreshToken: await issueRefreshToken(row.user_id, row.family) };
}

export async function revokeFamily(token) {
  await pool.query(
    "UPDATE refresh_tokens SET revoked_at = $2 WHERE family = (SELECT family FROM refresh_tokens WHERE token_hash = $1) AND revoked_at IS NULL",
    [hashToken(token), new Date()]
  );
}
`,
          },
          tests: [
            { label: "Refreshing gives a new access token and a new refresh token", check: `${ADA} await post("/auth/register", ada); const l = (await post("/auth/login", ada)).json.data; const r = await post("/auth/refresh", { refreshToken: l.refreshToken }); eq(r.status, 200, "POST /auth/refresh"); assert(r.json.data.refreshToken && r.json.data.refreshToken !== l.refreshToken, "a new refresh token (rotation)"); eq((await get("/me", { headers: { Authorization: "Bearer " + r.json.data.accessToken } })).status, 200, "the new access token works"); const rows = await sql("SELECT token_hash FROM refresh_tokens"); assert(rows.every((x) => x.token_hash !== l.refreshToken), "refresh tokens are stored hashed");` },
            { label: "Reusing an old refresh token revokes the whole family", check: `${ADA} const l = (await post("/auth/login", ada)).json.data; const r1 = (await post("/auth/refresh", { refreshToken: l.refreshToken })).json.data; const again = await post("/auth/refresh", { refreshToken: l.refreshToken }); eq([again.status, again.json?.error?.code], [401, "REFRESH_REUSED"], "the first token, used a second time"); const r2 = await post("/auth/refresh", { refreshToken: r1.refreshToken }); eq(r2.status, 401, "after reuse, even the newest token of that family is revoked");` },
            { label: "Another login's family is untouched", check: `${ADA} const a = (await post("/auth/login", ada)).json.data; const b = (await post("/auth/login", ada)).json.data; await post("/auth/refresh", { refreshToken: a.refreshToken }); await post("/auth/refresh", { refreshToken: a.refreshToken }); eq((await post("/auth/refresh", { refreshToken: b.refreshToken })).status, 200, "the other device's login still refreshes");` },
            { label: "Unknown, expired and logged-out tokens are refused", check: `${ADA} eq((await post("/auth/refresh", { refreshToken: "made-up" })).json?.error?.code, "REFRESH_INVALID", "a made-up token"); const l = (await post("/auth/login", ada)).json.data; eq((await post("/auth/logout", { refreshToken: l.refreshToken })).status, 204, "logout"); eq((await post("/auth/refresh", { refreshToken: l.refreshToken })).json?.error?.code, "REFRESH_INVALID", "after logout"); const m = (await post("/auth/login", ada)).json.data; await advance(31 * 86400000); eq((await post("/auth/refresh", { refreshToken: m.refreshToken })).json?.error?.code, "REFRESH_INVALID", "after 31 days");` },
          ],
          hint: "Store hashToken(token) with the family and new Date(Date.now() + 30 days). In rotate: look the hash up; invalid if missing, revoked or expired; if used_at is set, revoke every token of the family and throw REFRESH_REUSED; otherwise mark it used and issue the next one in the same family.",
          successMessage: "Access tokens stay short, refresh tokens rotate, and a stolen refresh token gives itself away the moment either party uses it twice.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 96 · 13.7 – 13.8 · RESET AND VERIFICATION FLOWS, MFA
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "be-l96-flows-mfa",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 5,
    covers: ["13.7", "13.8"],
    title: "Password Reset, Email Verification and Multi-Factor Authentication",
    subtitle: "Proving control of an inbox and a device",
    estimatedMinutes: 70,
    intro: "Two flows every account system needs, built on one idea: a secret only the right person can receive. And a second factor, so a stolen password is not enough.",
    atoms: [
      {
        id: "a-be-email-flows",
        title: "Password reset and email verification flows",
        explain:
          "Both flows email a LINK with a one-time token. Rules for the token: random (256 bits), stored HASHED with its purpose, user and expiry (verification: a day; reset: 30–60 minutes), SINGLE-USE (mark it used), and invalidated when a newer one is issued. 'Forgot password' answers the SAME whether or not the email has an account ('If an account exists, we sent a link'), and sends nothing for unknown emails. A successful reset sets the new hash, ends every existing session (whoever had the old password is logged out), and notifies the user by email. The exercises build both flows.",
        decision: decide({
          scenario: "A reset design: the link is https://academy.example/reset?user=12&token=<6-digit number>, valid for 7 days, reusable, stored as-is in the database; 'forgot password' answers 404 for unknown emails.",
          question: "Which problems does it have?",
          right: ["All of them: a 6-digit code can be guessed, 7 days is too long, it is reusable, stored in clear, and the 404 reveals which emails have accounts", "Each one is a separate weakness."],
          wrong: [
            ["Only the 7-day lifetime", "Guessable, reusable, stored in clear and enumerable too."],
            ["None: the token is secret", "Six digits is a million guesses: easy without rate limits."],
            ["Only the user id in the link", "Harmless by itself; the token's weaknesses are the problem."],
          ],
          at: 0,
          aftermath: "Fixed: 256-bit random token, stored hashed, 30-minute expiry, single-use, the same 202 answer for every email, and all sessions ended after the reset.",
        }),
      },
      {
        id: "a-be-totp",
        title: "Multi-factor authentication concepts",
        explain:
          "MFA asks for two kinds of evidence: something you KNOW (a password), HAVE (a phone, a security key) or ARE (a fingerprint). Strongest: passkeys and security keys (WebAuthn), which cannot be phished. Common: TOTP (RFC 6238), the 6-digit codes of authenticator apps: HMAC-SHA1 of the current 30-second time step (floor(time / 30)) keyed with a shared secret, cut to 6 digits by 'dynamic truncation'. The server computes the same code and accepts the current step and one either side (clock drift). Weakest: SMS codes (SIM swap). Store TOTP secrets encrypted, give recovery codes, and rate-limit attempts.",
        nodeLab: {
          task:
            "Implement TOTP (RFC 6238) in totp.js: generateTotp(secret, timeMs, { digits = 6, step = 30 } = {}) returns the code as a zero-padded string (HMAC-SHA1 of the 8-byte big-endian time step, dynamic truncation, modulo 10^digits); verifyTotp(secret, code, timeMs, { window = 1, … } = {}) accepts the codes of the steps from -window to +window, comparing with timingSafeEqual. The checks use the RFC's own test vectors.",
          command: false,
          files: {
            "package.json": pkg({ name: "academy-mfa" }),
            "totp.js": `import { createHmac, timingSafeEqual } from "node:crypto";

export function generateTotp(secret, timeMs, { digits = 6, step = 30 } = {}) {
  // 1. counter = floor(seconds / step), as 8 bytes big-endian
  // 2. HMAC-SHA1(secret, counter)
  // 3. dynamic truncation: offset = last byte & 0x0f; 31-bit number from 4 bytes at offset
  // 4. modulo 10 ** digits, padded with zeros
}

export function verifyTotp(secret, code, timeMs, { window = 1, digits = 6, step = 30 } = {}) {
  return false;
}
`,
          },
          open: "totp.js",
          solution: {
            "totp.js": `import { createHmac, timingSafeEqual } from "node:crypto";

export function generateTotp(secret, timeMs, { digits = 6, step = 30 } = {}) {
  const counter = Buffer.alloc(8);
  counter.writeBigUInt64BE(BigInt(Math.floor(timeMs / 1000 / step)));
  const hmac = createHmac("sha1", secret).update(counter).digest();
  const offset = hmac[hmac.length - 1] & 0x0f;
  const binary = hmac.readUInt32BE(offset) & 0x7fffffff;
  return String(binary % 10 ** digits).padStart(digits, "0");
}

export function verifyTotp(secret, code, timeMs, { window = 1, digits = 6, step = 30 } = {}) {
  const given = Buffer.from(String(code));
  for (let i = -window; i <= window; i++) {
    const expected = Buffer.from(generateTotp(secret, timeMs + i * step * 1000, { digits, step }));
    if (expected.length === given.length && timingSafeEqual(expected, given)) return true;
  }
  return false;
}
`,
          },
          tests: [
            { label: "RFC 6238 test vectors (8 digits)", check: `const { generateTotp } = await load("totp.js"); const secret = Buffer.from("12345678901234567890"); for (const [t, want] of [[59, "94287082"], [1111111109, "07081804"], [1111111111, "14050471"], [1234567890, "89005924"], [2000000000, "69279037"]]) eq(generateTotp(secret, t * 1000, { digits: 8 }), want, "T = " + t + " s");` },
            { label: "Six digits by default, zero-padded", check: `const { generateTotp } = await load("totp.js"); const secret = Buffer.from("12345678901234567890"); eq(generateTotp(secret, 59000), "287082", "T = 59 s, 6 digits"); eq(generateTotp(secret, 1111111109000), "081804", "a code with a leading zero keeps it");` },
            { label: "verifyTotp accepts one step of clock drift, no more", check: `const { generateTotp, verifyTotp } = await load("totp.js"); const secret = Buffer.from("12345678901234567890"); const t = 1234567890000; const code = generateTotp(secret, t); eq(verifyTotp(secret, code, t), true, "the current step"); eq(verifyTotp(secret, code, t + 30000), true, "the next step (the phone was 30 s slow)"); eq(verifyTotp(secret, code, t - 30000), true, "the previous step"); eq(verifyTotp(secret, code, t + 90000), false, "three steps later"); eq(verifyTotp(secret, "000000", t), false, "a wrong code");` },
            { label: "Codes are compared in constant time", check: `has(file("totp.js"), "timingSafeEqual", "compare with timingSafeEqual");` },
          ],
          hint: "counter: Buffer.alloc(8) and writeBigUInt64BE(BigInt(Math.floor(timeMs / 1000 / step))). Truncation: offset = hmac[19] & 0x0f; value = hmac.readUInt32BE(offset) & 0x7fffffff. verifyTotp loops i from -window to window over timeMs + i * step * 1000.",
          successMessage: "Your code matches the RFC's reference values: an authenticator app scanning this secret would show the same six digits.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 97 · 13.9 – 13.10 · LOCKOUT, THROTTLING AND COOKIE SETTINGS
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "be-l97-lockout-cookies",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 6,
    covers: ["13.9", "13.10"],
    title: "Account Lockout, Throttling and Secure Cookie Settings",
    subtitle: "Slowing attackers down; ending sessions on purpose",
    estimatedMinutes: 60,
    intro: "Strong hashing makes stolen databases useless. Login endpoints face a different attack: someone guessing passwords through the API itself.",
    atoms: [
      {
        id: "a-be-lockout",
        title: "Account lockout and login throttling",
        explain:
          "Two defences, usually together. THROTTLING by IP (Week 8's rate limiter on /auth/login: 10 attempts per 15 minutes) stops one machine from guessing fast. ACCOUNT LOCKOUT counts failed logins per account: after 5 failures, refuse logins for 15 minutes, then reset the count on success. Lockout stops a botnet spreading guesses across IPs, but lets anyone lock a victim out (a denial of service): keep it temporary, alert the user, and consider CAPTCHA or MFA instead of locking for high-value accounts. Use the same message while locked so it reveals nothing new.",
        nodeLab: {
          task:
            "Add account lockout to POST /auth/login: each wrong password increments users.failed_logins; at the 5th, set locked_until 15 minutes ahead (computed in JavaScript) and reset the count. While locked, refuse even the right password with 429 ACCOUNT_LOCKED \"Too many failed attempts; try again later\". A successful login resets failed_logins to 0. Unknown emails still answer the usual 401.",
          db: AUTH_SQL,
          files: {
            "package.json": AUTH_PKG,
            ".env": AUTH_ENV,
            "db.js": DB_JS,
            "passwords.js": PASSWORDS_JS,
            "server.js": `import express from "express";
import { pool } from "./db.js";
import { hashPassword, verifyPassword } from "./passwords.js";

const app = express();
app.use(express.json());

${REGISTER_ROUTE}
app.post("/auth/login", async (req, res) => {
  const email = String(req.body?.email ?? "").trim().toLowerCase();
  const { rows } = await pool.query("SELECT id, email, password_hash, failed_logins, locked_until FROM users WHERE email = $1", [email]);
  const user = rows[0];
  if (!user || !(await verifyPassword(user.password_hash, String(req.body?.password ?? "")))) {
    return res.status(401).json({ error: { code: "INVALID_CREDENTIALS", message: "Invalid email or password" } });
  }
  res.json({ data: { id: user.id, email: user.email } });
});

${ERROR_HANDLER_JS}
${LISTEN_JS}`,
          },
          readOnly: [...READ_ONLY, "passwords.js"],
          open: "server.js",
          solution: {
            "server.js": `import express from "express";
import { pool } from "./db.js";
import { hashPassword, verifyPassword } from "./passwords.js";

const app = express();
app.use(express.json());

const MAX_FAILURES = 5;
const LOCK_MS = 15 * 60 * 1000;

${REGISTER_ROUTE}
app.post("/auth/login", async (req, res) => {
  const email = String(req.body?.email ?? "").trim().toLowerCase();
  const { rows } = await pool.query("SELECT id, email, password_hash, failed_logins, locked_until FROM users WHERE email = $1", [email]);
  const user = rows[0];
  if (user?.locked_until && user.locked_until > new Date()) {
    return res.status(429).json({ error: { code: "ACCOUNT_LOCKED", message: "Too many failed attempts; try again later" } });
  }
  if (!user || !(await verifyPassword(user.password_hash, String(req.body?.password ?? "")))) {
    if (user) {
      const failures = user.failed_logins + 1;
      await pool.query("UPDATE users SET failed_logins = $2, locked_until = $3 WHERE id = $1", [
        user.id,
        failures >= MAX_FAILURES ? 0 : failures,
        failures >= MAX_FAILURES ? new Date(Date.now() + LOCK_MS) : user.locked_until,
      ]);
    }
    return res.status(401).json({ error: { code: "INVALID_CREDENTIALS", message: "Invalid email or password" } });
  }
  await pool.query("UPDATE users SET failed_logins = 0, locked_until = NULL WHERE id = $1", [user.id]);
  res.json({ data: { id: user.id, email: user.email } });
});

${ERROR_HANDLER_JS}
${LISTEN_JS}`,
          },
          tests: [
            { label: "Five wrong passwords lock the account", check: `${ADA} await post("/auth/register", ada); for (let i = 1; i <= 5; i++) eq((await post("/auth/login", { email: ada.email, password: "guess " + i })).status, 401, "wrong password " + i); const r = await post("/auth/login", ada); eq([r.status, r.json?.error?.code], [429, "ACCOUNT_LOCKED"], "even the right password while locked");` },
            { label: "The lock lasts 15 minutes", check: `${ADA} await advance(14 * 60 * 1000); eq((await post("/auth/login", ada)).status, 429, "after 14 minutes"); await advance(2 * 60 * 1000); eq((await post("/auth/login", ada)).status, 200, "after 16 minutes the right password works");` },
            { label: "A success resets the count", check: `${ADA} for (let i = 0; i < 4; i++) await post("/auth/login", { email: ada.email, password: "nope" }); eq((await post("/auth/login", ada)).status, 200, "the right password after 4 failures"); for (let i = 0; i < 4; i++) await post("/auth/login", { email: ada.email, password: "nope" }); eq((await post("/auth/login", ada)).status, 200, "4 more failures do not lock: the count started again"); eq(await sql("SELECT failed_logins FROM users WHERE email = 'ada@example.com'"), [{ failed_logins: 0 }], "failed_logins back to 0");` },
            { label: "Unknown emails still get the usual answer", check: `const r = await post("/auth/login", { email: "nobody@example.com", password: "x" }); eq([r.status, r.json?.error?.code], [401, "INVALID_CREDENTIALS"], "an unknown email");` },
          ],
          hint: "Check locked_until > new Date() first. On a wrong password: failures = failed_logins + 1; at 5 set locked_until = new Date(Date.now() + 15 min) and the count back to 0. On success: failed_logins = 0, locked_until = NULL.",
          successMessage: "Guessing now costs an attacker 15 minutes per five guesses per account, and a typo-prone user is never locked for long.",
        },
      },
      {
        id: "a-be-cookie-settings",
        title: "Secure cookie settings and session invalidation",
        explain:
          "Cookie attributes for a session: HttpOnly (JavaScript cannot read it, so an XSS bug cannot steal it), Secure (only over HTTPS), SameSite=Lax (not sent on cross-site POSTs, the main CSRF defence; Strict breaks links from email; None requires Secure and is only for deliberate cross-site use), Path=/, a Max-Age, and the __Host- prefix (__Host-sid forces Secure, Path=/ and no Domain, so subdomains cannot overwrite it). INVALIDATE sessions deliberately: on logout; on password change or reset (all sessions); when an admin disables an account; after inactivity. Rotate the session id on login and privilege changes so a planted id is useless (session fixation).",
        decision: decide({
          scenario: "Ada changes her password because she thinks someone saw it. Her laptop and an unknown device are both logged in with session cookies.",
          question: "What should the API do?",
          right: ["Delete every other session of Ada (keeping or renewing the current one), so the unknown device is logged out", "A password change must end other sessions."],
          wrong: [
            ["Nothing: sessions are separate from passwords", "The attacker stays logged in."],
            ["Delete only the current session", "Logs Ada out and leaves the attacker in."],
            ["Shorten Max-Age on new cookies", "Existing cookies still work."],
          ],
          at: 2,
          aftermath: "With JWT access tokens, the same event revokes the refresh-token families; access tokens die within their 15 minutes.",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 98 · 13.11 – 13.14 · EXERCISES
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "be-l98-exercises",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 7,
    covers: ["13.11", "13.12", "13.13", "13.14"],
    title: "Exercises: The Academy's Authentication",
    subtitle: "Registration, verification, protection and recovery",
    estimatedMinutes: 180,
    intro: "Four exercises that assemble the academy's account system on sessions: the module the rest of the course protects its endpoints with.",
    atoms: [
      {
        id: "a-be-ex-auth-system",
        title: "Exercise: build a registration and login system",
        explain:
          "All of Lessons 92–94 together, with the session code in a module of its own (sessions.js) so every route can use it. Logout everywhere is the 'log out of all devices' button: delete all of the user's sessions.",
        nodeLab: {
          task:
            "With sessions.js (given: createSession, getSessionUser, deleteSession, deleteAllSessions, COOKIE), build: POST /auth/register (as Lesson 92), POST /auth/login (set the sid cookie with COOKIE and a 7-day maxAge; the same 401 for unknown email and wrong password), GET /me (401 UNAUTHENTICATED without a valid session), POST /auth/logout (204, cookie cleared) and POST /auth/logout-all (204: deletes every session of the logged-in user).",
          db: AUTH_SQL,
          files: {
            "package.json": AUTH_PKG,
            ".env": AUTH_ENV,
            "db.js": DB_JS,
            "passwords.js": PASSWORDS_JS,
            "tokens.js": TOKENS_JS,
            "sessions.js": SESSIONS_JS,
            "server.js": `import cookieParser from "cookie-parser";
import express from "express";
import { pool } from "./db.js";
import { hashPassword, verifyPassword } from "./passwords.js";
import { COOKIE, SESSION_DAYS, createSession, deleteAllSessions, deleteSession, getSessionUser } from "./sessions.js";

const app = express();
app.use(express.json());
app.use(cookieParser());

// POST /auth/register, POST /auth/login, GET /me, POST /auth/logout, POST /auth/logout-all

${ERROR_HANDLER_JS}
${LISTEN_JS}`,
          },
          readOnly: [...READ_ONLY, "passwords.js", "tokens.js", "sessions.js"],
          open: "server.js",
          solution: {
            "server.js": `import cookieParser from "cookie-parser";
import express from "express";
import { pool } from "./db.js";
import { hashPassword, verifyPassword } from "./passwords.js";
import { COOKIE, SESSION_DAYS, createSession, deleteAllSessions, deleteSession, getSessionUser } from "./sessions.js";

const app = express();
app.use(express.json());
app.use(cookieParser());

const unauthenticated = (res) => res.status(401).json({ error: { code: "UNAUTHENTICATED", message: "Log in to continue" } });

${REGISTER_ROUTE}
app.post("/auth/login", async (req, res) => {
  const email = String(req.body?.email ?? "").trim().toLowerCase();
  const { rows } = await pool.query('SELECT id, email, full_name AS "fullName", password_hash FROM users WHERE email = $1', [email]);
  const user = rows[0];
  if (!user || !(await verifyPassword(user.password_hash, String(req.body?.password ?? "")))) {
    return res.status(401).json({ error: { code: "INVALID_CREDENTIALS", message: "Invalid email or password" } });
  }
  res.cookie("sid", await createSession(user.id), { ...COOKIE, maxAge: SESSION_DAYS * 86_400_000 });
  res.json({ data: { id: user.id, email: user.email, fullName: user.fullName } });
});

app.get("/me", async (req, res) => {
  const user = await getSessionUser(req.cookies.sid);
  if (!user) return unauthenticated(res);
  res.json({ data: user });
});

app.post("/auth/logout", async (req, res) => {
  if (req.cookies.sid) await deleteSession(req.cookies.sid);
  res.clearCookie("sid", COOKIE);
  res.status(204).end();
});

app.post("/auth/logout-all", async (req, res) => {
  const user = await getSessionUser(req.cookies.sid);
  if (!user) return unauthenticated(res);
  await deleteAllSessions(user.id);
  res.clearCookie("sid", COOKIE);
  res.status(204).end();
});

${ERROR_HANDLER_JS}
${LISTEN_JS}`,
          },
          tests: [
            { label: "Register, log in, and see yourself", check: `${ADA} ${cookieOf} eq((await post("/auth/register", ada)).status, 201, "register"); const l = await post("/auth/login", ada); eq(l.status, 200, "login"); const c = cookieOf(l); assert(c, "a sid cookie"); eq((await get("/me", { headers: { Cookie: c } })).json, { data: { id: 1, email: "ada@example.com", fullName: "Ada Obi" } }, "GET /me");` },
            { label: "No enumeration, no access without a session", check: `${ADA} const a = await post("/auth/login", { email: ada.email, password: "nope" }); const b = await post("/auth/login", { email: "ghost@example.com", password: "nope" }); eq([b.status, b.json], [a.status, a.json], "unknown email and wrong password answer the same"); eq(a.status, 401, "status"); eq((await get("/me")).status, 401, "GET /me without a cookie");` },
            { label: "Logout ends one session", check: `${ADA} ${cookieOf} const c1 = cookieOf(await post("/auth/login", ada)); const c2 = cookieOf(await post("/auth/login", ada)); eq((await post("/auth/logout", {}, { headers: { Cookie: c1 } })).status, 204, "logout"); eq((await get("/me", { headers: { Cookie: c1 } })).status, 401, "the logged-out session"); eq((await get("/me", { headers: { Cookie: c2 } })).status, 200, "the other device is still logged in");` },
            { label: "Logout-all ends every session of the user", check: `${ADA} ${cookieOf} const c1 = cookieOf(await post("/auth/login", ada)); const c2 = cookieOf(await post("/auth/login", ada)); eq((await post("/auth/logout-all", {}, { headers: { Cookie: c1 } })).status, 204, "logout-all"); eq((await get("/me", { headers: { Cookie: c2 } })).status, 401, "every device is logged out"); eq((await sql("SELECT count(*)::int AS n FROM sessions"))[0].n, 0, "no sessions left for Ada"); eq((await post("/auth/logout-all", {})).status, 401, "logout-all needs a session");` },
          ],
          hint: "Lesson 92's register route; for login call createSession(user.id) and res.cookie(\"sid\", token, { ...COOKIE, maxAge }). /me and /auth/logout-all start with getSessionUser(req.cookies.sid).",
          successMessage: "A complete session-based account system in about sixty lines, every piece of it from this week's lessons.",
        },
      },
      {
        id: "a-be-ex-verify-email",
        title: "Exercise: implement email verification",
        explain:
          "Registration sends a link with a single-use token; following it sets email_verified_at. Until then the account cannot log in (or can, with limited rights: a product decision). Resending must not reveal whether an address is registered, and must invalidate the previous link.",
        nodeLab: {
          task:
            "On POST /auth/register, after creating the user, email them a link APP_URL/auth/verify-email?token=<token> (a new token from tokens.js, stored hashed in email_tokens with purpose verify and 24 hours to live). GET /auth/verify-email?token= sets email_verified_at and marks the token used (200 { data: { verified: true } }); an unknown, used or expired token → 400 INVALID_TOKEN. POST /auth/login refuses unverified accounts with 403 EMAIL_NOT_VERIFIED (after checking the password). POST /auth/resend-verification { email } always answers 202 and, only for unverified accounts, sends a fresh link (earlier unused verify tokens of the user stop working).",
          db: AUTH_SQL,
          mail: true,
          files: {
            "package.json": AUTH_PKG,
            ".env": AUTH_ENV,
            "db.js": DB_JS,
            "passwords.js": PASSWORDS_JS,
            "tokens.js": TOKENS_JS,
            "mailer.js": MAILER_JS,
            "server.js": `import express from "express";
import { pool } from "./db.js";
import { sendMail } from "./mailer.js";
import { hashPassword, verifyPassword } from "./passwords.js";
import { hashToken, newToken } from "./tokens.js";

const app = express();
app.use(express.json());

${REGISTER_ROUTE}
app.post("/auth/login", async (req, res) => {
  const email = String(req.body?.email ?? "").trim().toLowerCase();
  const { rows } = await pool.query("SELECT id, email, password_hash, email_verified_at FROM users WHERE email = $1", [email]);
  const user = rows[0];
  if (!user || !(await verifyPassword(user.password_hash, String(req.body?.password ?? "")))) {
    return res.status(401).json({ error: { code: "INVALID_CREDENTIALS", message: "Invalid email or password" } });
  }
  res.json({ data: { id: user.id, email: user.email } });
});

// GET /auth/verify-email, POST /auth/resend-verification

${ERROR_HANDLER_JS}
${LISTEN_JS}`,
          },
          readOnly: [...READ_ONLY, "passwords.js", "tokens.js", "mailer.js"],
          open: "server.js",
          solution: {
            "server.js": `import express from "express";
import { pool } from "./db.js";
import { sendMail } from "./mailer.js";
import { hashPassword, verifyPassword } from "./passwords.js";
import { hashToken, newToken } from "./tokens.js";

const app = express();
app.use(express.json());

const DAY_MS = 24 * 60 * 60 * 1000;

async function sendVerification(user) {
  // A new link replaces any earlier one.
  await pool.query("UPDATE email_tokens SET used_at = $2 WHERE user_id = $1 AND purpose = 'verify' AND used_at IS NULL", [user.id, new Date()]);
  const token = newToken();
  await pool.query("INSERT INTO email_tokens (token_hash, user_id, purpose, expires_at) VALUES ($1, $2, 'verify', $3)", [hashToken(token), user.id, new Date(Date.now() + DAY_MS)]);
  await sendMail(user.email, "Confirm your email", \`Welcome to the Academy! Confirm your email: \${process.env.APP_URL}/auth/verify-email?token=\${token}\`);
}

${REGISTER_ROUTE.replace("    res.status(201).json({ data: rows[0] });", "    await sendVerification(rows[0]);\n    res.status(201).json({ data: rows[0] });")}
app.get("/auth/verify-email", async (req, res) => {
  const { rows } = await pool.query(
    "UPDATE email_tokens SET used_at = $3 WHERE token_hash = $1 AND purpose = 'verify' AND used_at IS NULL AND expires_at > $2 RETURNING user_id",
    [hashToken(String(req.query.token ?? "")), new Date(), new Date()]
  );
  if (!rows[0]) return res.status(400).json({ error: { code: "INVALID_TOKEN", message: "This link is invalid or has expired" } });
  await pool.query("UPDATE users SET email_verified_at = $2 WHERE id = $1", [rows[0].user_id, new Date()]);
  res.json({ data: { verified: true } });
});

app.post("/auth/resend-verification", async (req, res) => {
  const email = String(req.body?.email ?? "").trim().toLowerCase();
  const { rows } = await pool.query("SELECT id, email FROM users WHERE email = $1 AND email_verified_at IS NULL", [email]);
  if (rows[0]) await sendVerification(rows[0]);
  // The same answer for every address: nothing to learn about who is registered.
  res.status(202).json({ data: { message: "If that address needs verifying, we sent a new link." } });
});

app.post("/auth/login", async (req, res) => {
  const email = String(req.body?.email ?? "").trim().toLowerCase();
  const { rows } = await pool.query("SELECT id, email, password_hash, email_verified_at FROM users WHERE email = $1", [email]);
  const user = rows[0];
  if (!user || !(await verifyPassword(user.password_hash, String(req.body?.password ?? "")))) {
    return res.status(401).json({ error: { code: "INVALID_CREDENTIALS", message: "Invalid email or password" } });
  }
  if (!user.email_verified_at) return res.status(403).json({ error: { code: "EMAIL_NOT_VERIFIED", message: "Confirm your email address first" } });
  res.json({ data: { id: user.id, email: user.email } });
});

${ERROR_HANDLER_JS}
${LISTEN_JS}`,
          },
          tests: [
            { label: "Registering emails a verification link", check: `${ADA} ${LINK} eq((await post("/auth/register", ada)).status, 201, "register"); const m = emails().find((e) => e.to.includes("ada@example.com")); assert(m, "an email to ada@example.com"); assert(linkToken(m), "the email should contain …/auth/verify-email?token=<token>"); has(m.text, "http://localhost:3000/auth/verify-email?token=", "a link built from APP_URL"); const rows = await sql("SELECT token_hash FROM email_tokens WHERE purpose = 'verify'"); assert(rows.length === 1 && rows[0].token_hash !== linkToken(m), "the token is stored hashed");` },
            { label: "Unverified accounts cannot log in; the link verifies once", check: `${ADA} ${LINK} const r = await post("/auth/login", ada); eq([r.status, r.json?.error?.code], [403, "EMAIL_NOT_VERIFIED"], "login before verifying"); const t = linkToken(emails().at(-1)); eq((await get("/auth/verify-email?token=" + t)).json, { data: { verified: true } }, "following the link"); eq((await post("/auth/login", ada)).status, 200, "login after verifying"); eq((await get("/auth/verify-email?token=" + t)).json?.error?.code, "INVALID_TOKEN", "the same link a second time");` },
            { label: "Resending does not reveal who is registered", check: `const before = emails().length; const a = await post("/auth/resend-verification", { email: "ada@example.com" }); const b = await post("/auth/resend-verification", { email: "nobody@example.com" }); eq([a.status, a.json], [b.status, b.json], "verified, unknown: the same answer"); eq(a.status, 202, "202 Accepted"); eq(emails().length, before, "no email for a verified or unknown address");` },
            { label: "A new link replaces the old one; links expire", check: `${LINK} await post("/auth/register", { email: "bayo@example.com", fullName: "Bayo", password: "another long password" }); const first = linkToken(emails().at(-1)); await post("/auth/resend-verification", { email: "bayo@example.com" }); const second = linkToken(emails().at(-1)); assert(second && second !== first, "a fresh link"); eq((await get("/auth/verify-email?token=" + first)).status, 400, "the first link stopped working"); await advance(25 * 3600000); eq((await get("/auth/verify-email?token=" + second)).status, 400, "after 25 hours the link has expired");` },
          ],
          hint: "A sendVerification(user) helper: mark the user's open verify tokens used, insert hashToken(token) with new Date(Date.now() + 24 h), sendMail with the link. Verifying is one UPDATE … WHERE token_hash = $1 AND used_at IS NULL AND expires_at > $2 RETURNING user_id.",
          successMessage: "Accounts now prove they own their address, links work once and expire, and nothing tells a stranger which addresses are registered.",
        },
      },
      {
        id: "a-be-ex-protect",
        title: "Exercise: protect private API endpoints",
        explain:
          "One authentication middleware, applied to every private route: router-level for whole groups (app.use(\"/me\", requireAuth)), or per route. The default should be closed: a forgotten route should fail safe. The checks sweep every private endpoint without a session and expect 401, and every public one with none and expect it to work.",
        nodeLab: {
          task:
            "Write requireAuth in auth.js (getSessionUser(req.cookies.sid) from sessions.js; 401 UNAUTHENTICATED if there is no user; otherwise set req.user and continue) and apply it to every private route in server.js: GET /me, GET /me/enrollments, POST /enrollments and DELETE /enrollments/:id. GET /courses and GET /courses/:id stay public. POST /enrollments must enroll req.user, never a studentId from the body.",
          db: `${AUTH_SQL}
CREATE TABLE courses (id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY, code text NOT NULL UNIQUE, title text NOT NULL);
CREATE TABLE enrollments (id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY, user_id integer NOT NULL REFERENCES users (id), course_id integer NOT NULL REFERENCES courses (id), UNIQUE (user_id, course_id));
INSERT INTO courses (code, title) VALUES ('BE-101', 'Backend Engineering'), ('DB-101', 'Relational Databases');
`,
          files: {
            "package.json": AUTH_PKG,
            ".env": AUTH_ENV,
            "db.js": DB_JS,
            "passwords.js": PASSWORDS_JS,
            "tokens.js": TOKENS_JS,
            "sessions.js": SESSIONS_JS,
            "auth.js": `import { getSessionUser } from "./sessions.js";

export async function requireAuth(req, res, next) {
  next();
}
`,
            "server.js": `import cookieParser from "cookie-parser";
import express from "express";
import { requireAuth } from "./auth.js";
import { pool } from "./db.js";
import { hashPassword, verifyPassword } from "./passwords.js";
import { COOKIE, SESSION_DAYS, createSession } from "./sessions.js";

const app = express();
app.use(express.json());
app.use(cookieParser());

${REGISTER_ROUTE}
app.post("/auth/login", async (req, res) => {
  const email = String(req.body?.email ?? "").trim().toLowerCase();
  const { rows } = await pool.query("SELECT id, password_hash FROM users WHERE email = $1", [email]);
  if (!rows[0] || !(await verifyPassword(rows[0].password_hash, String(req.body?.password ?? "")))) {
    return res.status(401).json({ error: { code: "INVALID_CREDENTIALS", message: "Invalid email or password" } });
  }
  res.cookie("sid", await createSession(rows[0].id), { ...COOKIE, maxAge: SESSION_DAYS * 86_400_000 });
  res.status(204).end();
});

app.get("/courses", async (req, res) => res.json({ data: (await pool.query("SELECT id, code, title FROM courses ORDER BY id")).rows }));
app.get("/courses/:id", async (req, res) => {
  const { rows } = await pool.query("SELECT id, code, title FROM courses WHERE id = $1", [Number(req.params.id)]);
  if (!rows[0]) return res.status(404).json({ error: { code: "COURSE_NOT_FOUND", message: "No such course" } });
  res.json({ data: rows[0] });
});

app.get("/me", (req, res) => res.json({ data: req.user }));

app.get("/me/enrollments", async (req, res) => {
  const { rows } = await pool.query("SELECT e.id, c.code FROM enrollments e JOIN courses c ON c.id = e.course_id WHERE e.user_id = $1 ORDER BY e.id", [req.user?.id]);
  res.json({ data: rows });
});

app.post("/enrollments", async (req, res) => {
  const { rows } = await pool.query("INSERT INTO enrollments (user_id, course_id) VALUES ($1, $2) RETURNING id, course_id AS \\"courseId\\"", [req.body.studentId, req.body.courseId]);
  res.status(201).json({ data: rows[0] });
});

app.delete("/enrollments/:id", async (req, res) => {
  const { rowCount } = await pool.query("DELETE FROM enrollments WHERE id = $1 AND user_id = $2", [Number(req.params.id), req.user?.id]);
  if (!rowCount) return res.status(404).json({ error: { code: "ENROLLMENT_NOT_FOUND", message: "No such enrollment" } });
  res.status(204).end();
});

${ERROR_HANDLER_JS}
${LISTEN_JS}`,
          },
          readOnly: [...READ_ONLY, "passwords.js", "tokens.js", "sessions.js"],
          open: "auth.js",
          solution: {
            "auth.js": `import { getSessionUser } from "./sessions.js";

export async function requireAuth(req, res, next) {
  const user = await getSessionUser(req.cookies?.sid);
  if (!user) return res.status(401).json({ error: { code: "UNAUTHENTICATED", message: "Log in to continue" } });
  req.user = user;
  next();
}
`,
            "server.js": `import cookieParser from "cookie-parser";
import express from "express";
import { requireAuth } from "./auth.js";
import { pool } from "./db.js";
import { hashPassword, verifyPassword } from "./passwords.js";
import { COOKIE, SESSION_DAYS, createSession } from "./sessions.js";

const app = express();
app.use(express.json());
app.use(cookieParser());

${REGISTER_ROUTE}
app.post("/auth/login", async (req, res) => {
  const email = String(req.body?.email ?? "").trim().toLowerCase();
  const { rows } = await pool.query("SELECT id, password_hash FROM users WHERE email = $1", [email]);
  if (!rows[0] || !(await verifyPassword(rows[0].password_hash, String(req.body?.password ?? "")))) {
    return res.status(401).json({ error: { code: "INVALID_CREDENTIALS", message: "Invalid email or password" } });
  }
  res.cookie("sid", await createSession(rows[0].id), { ...COOKIE, maxAge: SESSION_DAYS * 86_400_000 });
  res.status(204).end();
});

// Public.
app.get("/courses", async (req, res) => res.json({ data: (await pool.query("SELECT id, code, title FROM courses ORDER BY id")).rows }));
app.get("/courses/:id", async (req, res) => {
  const { rows } = await pool.query("SELECT id, code, title FROM courses WHERE id = $1", [Number(req.params.id)]);
  if (!rows[0]) return res.status(404).json({ error: { code: "COURSE_NOT_FOUND", message: "No such course" } });
  res.json({ data: rows[0] });
});

// Everything under /me and /enrollments needs a session.
app.use("/me", requireAuth);
app.use("/enrollments", requireAuth);

app.get("/me", (req, res) => res.json({ data: req.user }));

app.get("/me/enrollments", async (req, res) => {
  const { rows } = await pool.query("SELECT e.id, c.code FROM enrollments e JOIN courses c ON c.id = e.course_id WHERE e.user_id = $1 ORDER BY e.id", [req.user.id]);
  res.json({ data: rows });
});

app.post("/enrollments", async (req, res) => {
  // The student is whoever is logged in: never trust an id from the body.
  const { rows } = await pool.query("INSERT INTO enrollments (user_id, course_id) VALUES ($1, $2) RETURNING id, course_id AS \\"courseId\\"", [req.user.id, req.body.courseId]);
  res.status(201).json({ data: rows[0] });
});

app.delete("/enrollments/:id", async (req, res) => {
  const { rowCount } = await pool.query("DELETE FROM enrollments WHERE id = $1 AND user_id = $2", [Number(req.params.id), req.user.id]);
  if (!rowCount) return res.status(404).json({ error: { code: "ENROLLMENT_NOT_FOUND", message: "No such enrollment" } });
  res.status(204).end();
});

${ERROR_HANDLER_JS}
${LISTEN_JS}`,
          },
          tests: [
            { label: "Every private endpoint refuses requests without a session", check: `for (const [m, p] of [["GET", "/me"], ["GET", "/me/enrollments"], ["POST", "/enrollments"], ["DELETE", "/enrollments/1"]]) { const r = await request(m, p, m === "POST" ? { json: { studentId: 1, courseId: 1 } } : {}); eq([r.status, r.json?.error?.code], [401, "UNAUTHENTICATED"], m + " " + p + " without a session"); }` },
            { label: "Public endpoints stay public", check: `eq((await get("/courses")).status, 200, "GET /courses"); eq((await get("/courses/1")).json.data.code, "BE-101", "GET /courses/1"); eq((await get("/courses/9")).status, 404, "a missing course is still 404, not 401");` },
            { label: "With a session, the private endpoints work for that user", check: `${ADA} ${cookieOf} await post("/auth/register", ada); const c = cookieOf(await post("/auth/login", ada)); const h = { headers: { Cookie: c } }; eq((await get("/me", h)).json.data.email, "ada@example.com", "GET /me"); const e = await post("/enrollments", { courseId: 2 }, h); eq(e.status, 201, "POST /enrollments"); eq((await get("/me/enrollments", h)).json.data.map((x) => x.code), ["DB-101"], "GET /me/enrollments"); eq((await del("/enrollments/" + e.json.data.id, h)).status, 204, "DELETE her enrollment");` },
            { label: "POST /enrollments enrolls the logged-in user, whatever the body says", check: `${cookieOf} await post("/auth/register", { email: "bayo@example.com", fullName: "Bayo", password: "another long password" }); const c = cookieOf(await post("/auth/login", { email: "bayo@example.com", password: "another long password" })); const r = await post("/enrollments", { studentId: 1, courseId: 1 }, { headers: { Cookie: c } }); eq(r.status, 201, "Bayo posts with studentId 1 (Ada)"); eq(await sql("SELECT u.email FROM enrollments e JOIN users u ON u.id = e.user_id WHERE e.id = " + r.json.data.id), [{ email: "bayo@example.com" }], "the enrollment belongs to Bayo, the logged-in user");` },
          ],
          hint: "requireAuth: const user = await getSessionUser(req.cookies?.sid); if (!user) return 401; req.user = user; next(). In server.js: app.use(\"/me\", requireAuth) and app.use(\"/enrollments\", requireAuth) after the public routes. Use req.user.id instead of req.body.studentId.",
          successMessage: "Every private route checks who is asking, and the API no longer lets one student enroll another by sending their id.",
        },
      },
      {
        id: "a-be-ex-password-reset",
        title: "Exercise: implement a secure password reset workflow",
        explain:
          "The reset flow of Lesson 96, built: the same answer for every email, a hashed single-use 30-minute token, a new Argon2id hash, every session ended, and a notification email so the real owner learns about a reset they did not ask for.",
        nodeLab: {
          task:
            "POST /auth/forgot-password { email } always answers 202 with the same body; for an existing account it emails a link APP_URL/reset-password?token=<token> (stored hashed, purpose reset, 30 minutes, earlier open reset tokens of the user marked used). POST /auth/reset-password { token, password } checks the token (unknown, used or expired → 400 INVALID_TOKEN) and the password (at least 12 characters → else 400 VALIDATION_FAILED), stores the new hash, marks the token used, deletes all of the user's sessions, emails them \"Your password was changed\", and answers 204.",
          db: AUTH_SQL,
          mail: true,
          files: {
            "package.json": AUTH_PKG,
            ".env": AUTH_ENV,
            "db.js": DB_JS,
            "passwords.js": PASSWORDS_JS,
            "tokens.js": TOKENS_JS,
            "mailer.js": MAILER_JS,
            "sessions.js": SESSIONS_JS,
            "server.js": `import cookieParser from "cookie-parser";
import express from "express";
import { pool } from "./db.js";
import { sendMail } from "./mailer.js";
import { hashPassword, verifyPassword } from "./passwords.js";
import { COOKIE, SESSION_DAYS, createSession, deleteAllSessions, getSessionUser } from "./sessions.js";
import { hashToken, newToken } from "./tokens.js";

const app = express();
app.use(express.json());
app.use(cookieParser());

${REGISTER_ROUTE}
app.post("/auth/login", async (req, res) => {
  const email = String(req.body?.email ?? "").trim().toLowerCase();
  const { rows } = await pool.query("SELECT id, password_hash FROM users WHERE email = $1", [email]);
  if (!rows[0] || !(await verifyPassword(rows[0].password_hash, String(req.body?.password ?? "")))) {
    return res.status(401).json({ error: { code: "INVALID_CREDENTIALS", message: "Invalid email or password" } });
  }
  res.cookie("sid", await createSession(rows[0].id), { ...COOKIE, maxAge: SESSION_DAYS * 86_400_000 });
  res.status(204).end();
});

app.get("/me", async (req, res) => {
  const user = await getSessionUser(req.cookies.sid);
  if (!user) return res.status(401).json({ error: { code: "UNAUTHENTICATED", message: "Log in to continue" } });
  res.json({ data: user });
});

// POST /auth/forgot-password, POST /auth/reset-password

${ERROR_HANDLER_JS}
${LISTEN_JS}`,
          },
          readOnly: [...READ_ONLY, "passwords.js", "tokens.js", "mailer.js", "sessions.js"],
          open: "server.js",
          solution: {
            "server.js": `import cookieParser from "cookie-parser";
import express from "express";
import { pool } from "./db.js";
import { sendMail } from "./mailer.js";
import { hashPassword, verifyPassword } from "./passwords.js";
import { COOKIE, SESSION_DAYS, createSession, deleteAllSessions, getSessionUser } from "./sessions.js";
import { hashToken, newToken } from "./tokens.js";

const app = express();
app.use(express.json());
app.use(cookieParser());

const RESET_MS = 30 * 60 * 1000;

${REGISTER_ROUTE}
app.post("/auth/login", async (req, res) => {
  const email = String(req.body?.email ?? "").trim().toLowerCase();
  const { rows } = await pool.query("SELECT id, password_hash FROM users WHERE email = $1", [email]);
  if (!rows[0] || !(await verifyPassword(rows[0].password_hash, String(req.body?.password ?? "")))) {
    return res.status(401).json({ error: { code: "INVALID_CREDENTIALS", message: "Invalid email or password" } });
  }
  res.cookie("sid", await createSession(rows[0].id), { ...COOKIE, maxAge: SESSION_DAYS * 86_400_000 });
  res.status(204).end();
});

app.get("/me", async (req, res) => {
  const user = await getSessionUser(req.cookies.sid);
  if (!user) return res.status(401).json({ error: { code: "UNAUTHENTICATED", message: "Log in to continue" } });
  res.json({ data: user });
});

app.post("/auth/forgot-password", async (req, res) => {
  const email = String(req.body?.email ?? "").trim().toLowerCase();
  const { rows } = await pool.query("SELECT id, email FROM users WHERE email = $1", [email]);
  const user = rows[0];
  if (user) {
    await pool.query("UPDATE email_tokens SET used_at = $2 WHERE user_id = $1 AND purpose = 'reset' AND used_at IS NULL", [user.id, new Date()]);
    const token = newToken();
    await pool.query("INSERT INTO email_tokens (token_hash, user_id, purpose, expires_at) VALUES ($1, $2, 'reset', $3)", [hashToken(token), user.id, new Date(Date.now() + RESET_MS)]);
    await sendMail(user.email, "Reset your password", \`Reset your password within 30 minutes: \${process.env.APP_URL}/reset-password?token=\${token}\\n\\nIf you did not ask for this, ignore this email.\`);
  }
  // Identical for every address.
  res.status(202).json({ data: { message: "If an account exists for that address, we sent a reset link." } });
});

app.post("/auth/reset-password", async (req, res) => {
  const password = String(req.body?.password ?? "");
  if (password.length < 12) {
    return res.status(400).json({ error: { code: "VALIDATION_FAILED", message: "Invalid request body", details: [{ field: "password", message: "must be at least 12 characters" }] } });
  }
  const { rows } = await pool.query(
    "UPDATE email_tokens SET used_at = $3 WHERE token_hash = $1 AND purpose = 'reset' AND used_at IS NULL AND expires_at > $2 RETURNING user_id",
    [hashToken(String(req.body?.token ?? "")), new Date(), new Date()]
  );
  if (!rows[0]) return res.status(400).json({ error: { code: "INVALID_TOKEN", message: "This link is invalid or has expired" } });
  const userId = rows[0].user_id;
  const { rows: users } = await pool.query("UPDATE users SET password_hash = $2 WHERE id = $1 RETURNING email", [userId, await hashPassword(password)]);
  await deleteAllSessions(userId);
  await sendMail(users[0].email, "Your password was changed", "Your Academy password was just changed. If this was not you, contact support immediately.");
  res.status(204).end();
});

${ERROR_HANDLER_JS}
${LISTEN_JS}`,
          },
          tests: [
            { label: "Forgot-password answers the same for every address", check: `${ADA} await post("/auth/register", ada); const before = emails().length; const a = await post("/auth/forgot-password", { email: "ADA@example.com" }); const b = await post("/auth/forgot-password", { email: "nobody@example.com" }); eq([a.status, a.json], [b.status, b.json], "an account and no account look the same"); eq(a.status, 202, "202"); eq(emails().length - before, 1, "exactly one email: to Ada, none for the unknown address");` },
            { label: "The link resets the password once, and ends every session", check: `${ADA} ${cookieOf} ${LINK} const c = cookieOf(await post("/auth/login", ada)); await post("/auth/forgot-password", { email: ada.email }); const t = linkToken(emails().at(-1)); assert(t, "the reset email should contain …/reset-password?token=<token>"); eq((await post("/auth/reset-password", { token: t, password: "a brand new long password" })).status, 204, "reset"); eq((await post("/auth/login", { email: ada.email, password: "a brand new long password" })).status, 204, "the new password works"); eq((await post("/auth/login", ada)).status, 401, "the old one does not"); eq((await get("/me", { headers: { Cookie: c } })).status, 401, "the session from before the reset was ended"); eq((await post("/auth/reset-password", { token: t, password: "yet another long password" })).json?.error?.code, "INVALID_TOKEN", "the link a second time");` },
            { label: "The owner is told; the stored token is a hash", check: `assert(emails().some((m) => m.to.includes("ada@example.com") && /password was changed/i.test(m.subject)), "email Ada 'Your password was changed'"); const rows = await sql("SELECT token_hash FROM email_tokens WHERE purpose = 'reset'"); assert(rows.length >= 1 && rows.every((r) => r.token_hash.length === 64), "store hashToken(token)");` },
            { label: "Old links stop working, short passwords are refused, links expire", check: `${LINK} await post("/auth/forgot-password", { email: "ada@example.com" }); const first = linkToken(emails().at(-1)); await post("/auth/forgot-password", { email: "ada@example.com" }); const second = linkToken(emails().at(-1)); eq((await post("/auth/reset-password", { token: first, password: "a long enough password" })).status, 400, "the older link"); eq((await post("/auth/reset-password", { token: second, password: "short" })).json?.error?.code, "VALIDATION_FAILED", "a short password"); await advance(31 * 60 * 1000); eq((await post("/auth/reset-password", { token: second, password: "a long enough password" })).json?.error?.code, "INVALID_TOKEN", "after 31 minutes");` },
          ],
          hint: "forgot-password: mark open reset tokens used, insert a new hashed one (30 min), email the link, and answer 202 in every case. reset-password: validate the password first, then UPDATE email_tokens … RETURNING user_id; then the new hash, deleteAllSessions, and the notification email.",
          successMessage: "A reset flow that leaks nothing, works once, expires fast, and evicts whoever was using the old password.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 99 · 13.P · DELIVERABLE
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "be-l99-deliverable",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 8,
    covers: ["13.P"],
    title: "Deliverable: A Documented Authentication Module",
    subtitle: "Flows a security reviewer can check",
    estimatedMinutes: 90,
    intro: "Security reviews start from the design. The deliverable documents the academy's authentication module: each flow as a sequence diagram, and the decisions behind it.",
    atoms: [
      {
        id: "a-be-auth-doc",
        title: "Documenting authentication flows",
        explain:
          "A SEQUENCE DIAGRAM shows who talks to whom, in order: Browser, API, Database, Mailer. In Mermaid: sequenceDiagram, then lines like Browser->>API: POST /auth/login and API-->>Browser: 200 + Set-Cookie sid. Document every flow (registration, verification, login, logout, password reset) and the decisions a reviewer will ask about: the hashing algorithm and parameters, token lengths and lifetimes, cookie attributes, what is stored hashed, how enumeration is prevented, lockout rules, and what ends sessions.",
        nodeLab: {
          task:
            "Write AUTH.md with a ## section for each flow (Registration, Email verification, Login, Logout, Password reset), each containing a Mermaid sequenceDiagram with at least the Browser and API participants, and a ## Security decisions section that states the password hashing algorithm, the session cookie attributes (HttpOnly, Secure, SameSite), the token lifetimes, that tokens are stored hashed, and how account enumeration is prevented.",
          command: false,
          files: { "AUTH.md": "# Authentication\n" },
          open: "AUTH.md",
          solution: {
            "AUTH.md":
              "# Authentication\n\n## Registration\n\n```mermaid\nsequenceDiagram\n    participant Browser\n    participant API\n    participant DB as PostgreSQL\n    participant Mail as Mailer\n    Browser->>API: POST /auth/register {email, fullName, password}\n    API->>API: validate, hash with Argon2id\n    API->>DB: INSERT users (email lower-cased, password_hash)\n    API->>DB: INSERT email_tokens (sha256 of token, verify, 24 h)\n    API->>Mail: link /auth/verify-email?token=…\n    API-->>Browser: 201 {id, email, fullName}\n```\n\n## Email verification\n\n```mermaid\nsequenceDiagram\n    participant Browser\n    participant API\n    participant DB as PostgreSQL\n    Browser->>API: GET /auth/verify-email?token=…\n    API->>DB: mark token used if unused and unexpired\n    API->>DB: SET email_verified_at\n    API-->>Browser: 200 {verified: true} or 400 INVALID_TOKEN\n```\n\n## Login\n\n```mermaid\nsequenceDiagram\n    participant Browser\n    participant API\n    participant DB as PostgreSQL\n    Browser->>API: POST /auth/login {email, password}\n    API->>DB: SELECT user, check lockout\n    API->>API: argon2.verify\n    API->>DB: INSERT sessions (sha256 of token, 7 days)\n    API-->>Browser: 200 + Set-Cookie sid (HttpOnly; Secure; SameSite=Lax)\n```\n\n## Logout\n\n```mermaid\nsequenceDiagram\n    participant Browser\n    participant API\n    participant DB as PostgreSQL\n    Browser->>API: POST /auth/logout (Cookie: sid)\n    API->>DB: DELETE session\n    API-->>Browser: 204 + cleared cookie\n```\n\n## Password reset\n\n```mermaid\nsequenceDiagram\n    participant Browser\n    participant API\n    participant DB as PostgreSQL\n    participant Mail as Mailer\n    Browser->>API: POST /auth/forgot-password {email}\n    API->>DB: if the account exists: INSERT reset token (hashed, 30 min)\n    API->>Mail: reset link\n    API-->>Browser: 202 (the same for every address)\n    Browser->>API: POST /auth/reset-password {token, password}\n    API->>DB: use token, store new Argon2id hash, DELETE all sessions\n    API->>Mail: \"Your password was changed\"\n    API-->>Browser: 204\n```\n\n## Security decisions\n\n- Passwords: Argon2id (64 MiB, t=3, p=4), at least 12 characters; legacy hashes upgraded at login.\n- Session cookie sid: HttpOnly, Secure, SameSite=Lax, Path=/, Max-Age 7 days.\n- Token lifetimes: session 7 days, verification link 24 hours, reset link 30 minutes; all single-use where relevant.\n- Every token (session, verification, reset) is 256 random bits and stored hashed with SHA-256.\n- Account enumeration: login answers the same for unknown emails and wrong passwords; forgot-password and resend-verification always answer 202.\n- Lockout: 5 failed logins lock an account for 15 minutes; login is also rate-limited per IP.\n- Sessions end on logout, logout-all, password reset and password change.\n",
          },
          tests: [
            { label: "A sequence diagram for every flow", check: `const t = file("AUTH.md") || ""; for (const h of ["Registration", "Email verification", "Login", "Logout", "Password reset"]) { const s = section(t, h); assert(s !== null, "add a ## " + h + " section"); assert(/\`\`\`mermaid\\s*\\n\\s*sequenceDiagram/.test(s), "## " + h + " needs a \`\`\`mermaid sequenceDiagram"); assert(/Browser/.test(s) && /API/.test(s), "## " + h + "'s diagram needs the Browser and the API"); assert(/->>/.test(s), "## " + h + "'s diagram needs messages (A->>B: …)"); }` },
            { label: "Security decisions: hashing, cookies, lifetimes, storage, enumeration", check: `const s = section(file("AUTH.md") || "", "Security decisions") || ""; assert(/argon2|bcrypt/i.test(s), "name the password hashing algorithm"); for (const a of ["HttpOnly", "Secure", "SameSite"]) has(s, a, "state the cookie attribute " + a); assert(/\\d+\\s*(minutes?|min|hours?|h|days?)\\b/i.test(s), "give the token lifetimes"); assert(/hash/i.test(s) && /token/i.test(s), "say that tokens are stored hashed"); assert(/enumerat/i.test(s), "explain how account enumeration is prevented");` },
          ],
          hint: "Each flow: sequenceDiagram, participant lines, then Browser->>API: … and API-->>Browser: … messages. The decisions are this week's numbers: Argon2id, the cookie attributes, 7 days / 24 hours / 30 minutes, SHA-256 of 256-bit tokens, identical answers.",
          successMessage: "A reviewer can now check the design flow by flow without reading code, and the next engineer knows why each decision was made.",
        },
      },
    ],
    task: {
      title: "Week 13 deliverable: a secure user authentication module with documented flows",
      intro: "Add authentication to your course API.",
      prompts: [
        "npm install argon2 cookie-parser nodemailer, and add the users, sessions and email_tokens tables to your schema with a migration.",
        "Implement registration, email verification, login (sessions), logout, logout-all and password reset from this week's exercises; run Mailpit (or a similar local SMTP server) to receive the emails.",
        "Add the IP rate limit (Week 8) and account lockout to /auth/login; protect every private route with requireAuth.",
        "Write AUTH.md with the sequence diagrams and security decisions, and check each decision against your code.",
        "Checkpoint: your auth module hashes passwords properly, issues and revokes sessions or tokens safely, verifies email and resets passwords without leaking which accounts exist.",
      ],
      closing: "Next: Week 14, authorization and application security.",
    },
    requirements: { read: true, video: false, assessment: true },
  },
];
