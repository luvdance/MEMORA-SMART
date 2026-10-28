/**
 * BACKEND ENGINEERING · WEEK 19 · DOCKER, DEPLOYMENT AND CI/CD
 *
 * Curriculum 19.1 – 19.P. Environments and configuration; images and
 * containers; Dockerfiles; Compose; networking and volumes; secrets; CI/CD;
 * pipelines; migrations during deployment (a real runner on PostgreSQL);
 * hosting, DNS, HTTPS and reverse proxies; rolling deployments and
 * rollback; four exercises; and a repeatable delivery setup.
 *
 * The lab machine runs Node, not Docker, so the container labs are graded
 * the way a reviewer (or hadolint and docker compose config) would read
 * them: Dockerfiles are parsed into instructions and stages, Compose files
 * and workflows are parsed as YAML, and their rules are checked. Code that
 * can run (configuration loading, secrets from files, the migration runner,
 * Express behind a proxy) runs.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

import { decide, pkg } from "./be-helpers.js";

export const SECTION_ID = "be-s19-devops";
const MODULE = "be-w19-devops";

const DB_URL = "postgresql://academy_app:app-password@localhost:5432/academy";
const YAML_PKG = pkg({ name: "course-api", deps: ["yaml"] });

/** Check preamble: Dockerfile instructions (continuations joined, comments dropped) and stages. */
const DOCKERFILE = `const parseDockerfile = (text) => { const out = []; let buf = ""; for (const raw of String(text || "").split("\\n")) { if (!buf && (/^\\s*#/.test(raw) || !raw.trim())) continue; if (/\\\\\\s*$/.test(raw)) { buf += raw.replace(/\\\\\\s*$/, " "); continue; } buf += raw; const m = /^\\s*(\\w+)\\s+([\\s\\S]*)$/.exec(buf); if (m) out.push({ op: m[1].toUpperCase(), args: m[2].trim().replace(/\\s+/g, " ") }); buf = ""; } return out; };
const stagesOf = (ins) => { const s = []; for (const i of ins) { if (i.op === "FROM") { const m = /^(\\S+)(?:\\s+AS\\s+(\\S+))?/i.exec(i.args); s.push({ image: m[1], name: m[2] || null, ins: [] }); } else if (s.length) s.at(-1).ins.push(i); } return s; };
const execForm = (args) => { try { const a = JSON.parse(args); return Array.isArray(a) ? a : null; } catch { return null; } };`;
/** Check preamble: YAML files parsed. */
const YAML = `const YAML = await load("yaml"); const yamlOf = (p) => { const t = file(p); assert(t, p + " is missing"); return YAML.parse(t, { merge: true }) || {}; };`;

/* ── The academy API (the project the labs containerize) ──────────────── */

const API_PKG = pkg({
  name: "course-api",
  scripts: { build: "tsc -p tsconfig.json", start: "node dist/server.js", test: "vitest run", migrate: "node dist/migrate.js" },
  deps: ["express", "pg"],
  dev: ["typescript", "vitest", "@types/node", "@types/express", "@types/pg"],
});
const PROJECT_FILES = {
  "package.json": API_PKG,
  "package-lock.json": '{\n  "name": "course-api",\n  "lockfileVersion": 3\n}\n',
  "tsconfig.json": '{\n  "compilerOptions": { "target": "es2023", "module": "nodenext", "outDir": "dist", "rootDir": "src", "strict": true }\n}\n',
  "src/server.ts": 'import { app } from "./app.js";\n\napp.listen(Number(process.env.PORT ?? 3000), () => console.log("Course API listening"));\n',
  ".env": `DATABASE_URL=${DB_URL}\nSESSION_SECRET=dev-only-secret\n`,
};

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 133 · 19.1 – 19.3 · ENVIRONMENTS, IMAGES, DOCKERFILES
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "be-l133-environments-docker",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 1,
    covers: ["19.1", "19.2", "19.3"],
    title: "Environments, Docker Images and Containers, and Dockerfiles",
    subtitle: "The same build, everywhere",
    estimatedMinutes: 95,
    intro:
      "'It works on my machine' ends when the machine is part of the build. This lesson separates what changes between environments (configuration) from what must not (the code and its runtime), and packages the second into an image.",
    atoms: [
      {
        id: "a-be-environments",
        title: "Development, testing and production environments",
        explain:
          "DEVELOPMENT (your laptop: debug output, a local database, fake email), TESTING (CI: a throwaway database, deterministic settings) and PRODUCTION (real users, real secrets, real money) run the SAME code with different CONFIGURATION, which comes from the environment (the twelve-factor rule): never from if (env === 'production') branches scattered through the code. Load and validate configuration once at start-up: in production a missing DATABASE_URL or a weak session secret must stop the process immediately, with a clear message, rather than fail on the first request at 3 a.m. Development may have convenient defaults; production may not.",
        nodeLab: {
          task:
            "Write loadConfig(env) in config.js, returning { env, port, databaseUrl, sessionSecret, logLevel } from an environment object. NODE_ENV is development (default), test or production (anything else throws). port from PORT (default 3000; must be a whole number 1–65535). In development and test, DATABASE_URL defaults to postgresql://localhost:5432/academy_dev (or academy_test) and SESSION_SECRET to \"dev-only-secret\"; in production both are required and SESSION_SECRET must be at least 32 characters. logLevel: LOG_LEVEL, else debug in development, warn in test, info in production. Problems throw one Error listing every problem, e.g. \"Invalid configuration: DATABASE_URL is required; SESSION_SECRET is required\".",
          command: false,
          files: {
            "package.json": pkg({ name: "course-api", deps: [] }),
            "config.js": "/** The application's configuration, from an environment object (normally process.env). */\nexport function loadConfig(env) {\n  return {};\n}\n",
          },
          readOnly: ["package.json"],
          open: "config.js",
          solution: {
            "config.js": `const ENVIRONMENTS = ["development", "test", "production"];
const LOG_LEVELS = { development: "debug", test: "warn", production: "info" };

/** The application's configuration, from an environment object (normally process.env). */
export function loadConfig(env) {
  const problems = [];
  const name = env.NODE_ENV ?? "development";
  if (!ENVIRONMENTS.includes(name)) problems.push(\`NODE_ENV must be one of \${ENVIRONMENTS.join(", ")}\`);
  const production = name === "production";

  const port = env.PORT === undefined ? 3000 : Number(env.PORT);
  if (!Number.isInteger(port) || port < 1 || port > 65535) problems.push("PORT must be a whole number from 1 to 65535");

  const databaseUrl = env.DATABASE_URL ?? (production ? undefined : \`postgresql://localhost:5432/academy_\${name === "test" ? "test" : "dev"}\`);
  if (!databaseUrl) problems.push("DATABASE_URL is required");

  const sessionSecret = env.SESSION_SECRET ?? (production ? undefined : "dev-only-secret");
  if (!sessionSecret) problems.push("SESSION_SECRET is required");
  else if (production && sessionSecret.length < 32) problems.push("SESSION_SECRET must be at least 32 characters");

  if (problems.length) throw new Error(\`Invalid configuration: \${problems.join("; ")}\`);
  return { env: name, port, databaseUrl, sessionSecret, logLevel: env.LOG_LEVEL ?? LOG_LEVELS[name] };
}
`,
          },
          tests: [
            { label: "Development works with no configuration at all", check: `const { loadConfig } = await load("config.js"); eq(loadConfig({}), { env: "development", port: 3000, databaseUrl: "postgresql://localhost:5432/academy_dev", sessionSecret: "dev-only-secret", logLevel: "debug" }, "loadConfig({})"); eq(loadConfig({ NODE_ENV: "test" }).databaseUrl, "postgresql://localhost:5432/academy_test", "test gets its own database"); eq(loadConfig({ NODE_ENV: "test" }).logLevel, "warn", "quiet tests");` },
            { label: "Production requires everything, and says what is missing", check: `const { loadConfig } = await load("config.js"); let err = null; try { loadConfig({ NODE_ENV: "production" }); } catch (e) { err = e; } eq(err?.message, "Invalid configuration: DATABASE_URL is required; SESSION_SECRET is required", "every problem at once"); err = null; try { loadConfig({ NODE_ENV: "production", DATABASE_URL: "postgresql://db/academy", SESSION_SECRET: "short" }); } catch (e) { err = e; } eq(err?.message, "Invalid configuration: SESSION_SECRET must be at least 32 characters", "a weak secret"); const ok = loadConfig({ NODE_ENV: "production", DATABASE_URL: "postgresql://db/academy", SESSION_SECRET: "x".repeat(32), PORT: "8080" }); eq([ok.env, ok.port, ok.logLevel], ["production", 8080, "info"], "a valid production config (PORT is a number)");` },
            { label: "Bad values are refused", check: `const { loadConfig } = await load("config.js"); const msg = (env) => { try { loadConfig(env); return null; } catch (e) { return e.message; } }; eq(msg({ NODE_ENV: "staging" }), "Invalid configuration: NODE_ENV must be one of development, test, production", "an unknown environment"); eq(msg({ PORT: "80a" }), "Invalid configuration: PORT must be a whole number from 1 to 65535", "PORT 80a"); eq(msg({ PORT: "70000" }), "Invalid configuration: PORT must be a whole number from 1 to 65535", "PORT 70000"); eq(loadConfig({ LOG_LEVEL: "error" }).logLevel, "error", "LOG_LEVEL wins"); eq(loadConfig({ DATABASE_URL: "postgresql://elsewhere/x" }).databaseUrl, "postgresql://elsewhere/x", "an explicit DATABASE_URL wins in development too");` },
          ],
          hint: "Collect problems in an array and throw once at the end. Compute production = name === \"production\" and use it to decide whether a default is allowed: env.DATABASE_URL ?? (production ? undefined : default).",
          successMessage: "One function decides the configuration for every environment, and a misconfigured production deploy now refuses to start with a message that says exactly why.",
        },
      },
      {
        id: "a-be-images-containers",
        title: "Docker images and containers",
        explain:
          "An IMAGE is a read-only package: a base operating system layer (Debian slim, Alpine), the runtime (Node 24), your dependencies and your code, built in LAYERS (one per instruction) that are cached and shared. A CONTAINER is a running instance of an image with its own filesystem, processes and network, isolated from the host and from other containers; anything it writes disappears with it unless stored in a VOLUME. Images are named repository:tag (node:24-slim, ghcr.io/academy/api:3f9c2a1); tag your own images with the commit SHA, so a tag always means the same bytes. The same image runs on a laptop, in CI and in production, which is the whole point.",
        decision: decide({
          scenario: "A team builds its API image separately on the CI server for staging and again for production, from the same commit. Production breaks on a dependency version that staging did not have.",
          question: "What should the pipeline do?",
          right: ["Build the image once per commit, tag it with the commit SHA, test it, and deploy that same image to staging and then to production", "Promote the artifact, never rebuild it."],
          wrong: [
            ["Build with npm install instead of npm ci", "Makes it less reproducible, not more."],
            ["Tag every build as latest", "latest moves; you cannot say what is deployed."],
            ["Run production without containers", "The difference would grow."],
          ],
          at: 0,
          aftermath: "The pipeline labs in this week build once and promote by tag.",
        }),
      },
      {
        id: "a-be-dockerfile",
        title: "Writing Dockerfiles",
        explain:
          "A good Node Dockerfile: FROM a pinned, slim official image (node:24-slim, never node or latest); WORKDIR /app; COPY package.json and package-lock.json FIRST and RUN npm ci --omit=dev, so the dependency layer is cached until the lockfile changes; then COPY the code; ENV NODE_ENV=production; USER node (never run as root); EXPOSE the port; CMD in EXEC form ([\"node\", \"server.js\"]) so the process receives SIGTERM directly and can shut down gracefully. A .dockerignore keeps node_modules, .env, .git and tests out of the build context: smaller images, faster builds, no secrets baked in.",
        nodeLab: {
          task:
            "Write the Dockerfile for this plain JavaScript API (server.js, port 3000) and its .dockerignore. Dockerfile: FROM node:24-slim; WORKDIR /app; COPY package.json package-lock.json ./ then RUN npm ci --omit=dev, before copying the rest; ENV NODE_ENV=production; USER node; EXPOSE 3000; CMD [\"node\", \"server.js\"]. .dockerignore: node_modules, .env, .git and test.",
          command: false,
          files: {
            "package.json": pkg({ name: "course-api", scripts: { start: "node server.js", test: "vitest run" }, deps: ["express", "pg"], dev: ["vitest"] }),
            "server.js": 'import express from "express";\n\nconst app = express();\napp.get("/health/live", (req, res) => res.json({ status: "ok" }));\napp.listen(Number(process.env.PORT ?? 3000), () => console.log("Course API listening"));\n',
            "Dockerfile": "FROM node\nCOPY . .\nRUN npm install\nCMD npm start\n",
            ".dockerignore": "",
          },
          readOnly: ["package.json", "server.js"],
          open: "Dockerfile",
          solution: {
            "Dockerfile": `# A slim, pinned base image: small, and the same every build.
FROM node:24-slim
WORKDIR /app

# Dependencies first: this layer is reused until the lockfile changes.
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY . .

ENV NODE_ENV=production
# Never run as root inside the container.
USER node
EXPOSE 3000

# Exec form: node is PID 1 and receives SIGTERM directly.
CMD ["node", "server.js"]
`,
            ".dockerignore": "node_modules\n.env\n.env.*\n.git\ntest\nnpm-debug.log\nDockerfile\n.dockerignore\n",
          },
          tests: [
            { label: "A pinned slim base image", check: `${DOCKERFILE} const ins = parseDockerfile(file("Dockerfile")); const from = ins.filter((i) => i.op === "FROM"); eq(from.length, 1, "one FROM"); eq(from[0].args, "node:24-slim", "FROM node:24-slim (not node or node:latest, which change under you)");` },
            { label: "Dependencies are installed before the code is copied", check: `${DOCKERFILE} const ins = parseDockerfile(file("Dockerfile")); const at = (pred) => ins.findIndex(pred); const copyManifest = at((i) => i.op === "COPY" && /package\\.json/.test(i.args) && /package-lock\\.json/.test(i.args) && !/^\\.\\s/.test(i.args)); const install = at((i) => i.op === "RUN" && /\\bnpm ci\\b/.test(i.args)); const copyAll = at((i) => i.op === "COPY" && /^\\.\\s+\\.(\\/)?$/.test(i.args)); assert(copyManifest >= 0, "COPY package.json package-lock.json ./"); assert(install > copyManifest, "RUN npm ci after copying the manifests"); has(ins[install].args, "--omit=dev", "npm ci --omit=dev: no test tools in the production image"); assert(!ins.some((i) => i.op === "RUN" && /npm install\\b/.test(i.args)), "npm ci, not npm install (exactly the lockfile)"); assert(copyAll > install, "COPY . . after npm ci, so code changes do not reinstall dependencies"); eq(ins.find((i) => i.op === "WORKDIR")?.args, "/app", "WORKDIR /app");` },
            { label: "Production settings: NODE_ENV, a non-root user, the port, exec-form CMD", check: `${DOCKERFILE} const ins = parseDockerfile(file("Dockerfile")); assert(ins.some((i) => i.op === "ENV" && /NODE_ENV[= ]production/.test(i.args)), "ENV NODE_ENV=production"); const user = ins.filter((i) => i.op === "USER").at(-1); eq(user?.args, "node", "USER node (the official image's unprivileged user)"); assert(ins.some((i) => i.op === "EXPOSE" && /\\b3000\\b/.test(i.args)), "EXPOSE 3000"); const cmd = ins.filter((i) => i.op === "CMD").at(-1); eq(execForm(cmd?.args || ""), ["node", "server.js"], "CMD [\\"node\\", \\"server.js\\"]: exec form, and node rather than npm, so SIGTERM reaches the app"); const userAt = ins.indexOf(user); assert(userAt > ins.findIndex((i) => i.op === "RUN"), "switch to USER node after the RUN steps that need root");` },
            { label: ".dockerignore keeps secrets and junk out of the image", check: `const ignore = (file(".dockerignore") || "").split("\\n").map((l) => l.trim()).filter(Boolean); for (const entry of ["node_modules", ".env", ".git", "test"]) assert(ignore.some((l) => l.replace(/^\\//, "").replace(/\\/$/, "") === entry), ".dockerignore should list " + entry);` },
          ],
          hint: "Order matters: FROM, WORKDIR, COPY the two manifests, RUN npm ci --omit=dev, COPY . ., ENV, USER node, EXPOSE, CMD [\"node\", \"server.js\"]. The .dockerignore is one pattern per line.",
          successMessage: "The image is small, rebuilt fast (dependencies are cached), runs as an unprivileged user, shuts down cleanly, and carries no .env or node_modules from your laptop.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 134 · 19.4 – 19.6 · COMPOSE, NETWORKS, VOLUMES, SECRETS
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "be-l134-compose-secrets",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 2,
    covers: ["19.4", "19.5", "19.6"],
    title: "Docker Compose, Networking, Volumes and Production Secrets",
    subtitle: "A whole system, described in one file",
    estimatedMinutes: 90,
    intro: "An API never runs alone: it needs PostgreSQL, Redis, a mail catcher. Compose describes them together, so 'docker compose up' starts the system; and secrets need more care than every other setting.",
    atoms: [
      {
        id: "a-be-compose",
        title: "Docker Compose for local services",
        explain:
          "compose.yaml lists SERVICES: each with an image (postgres:18) or a build (.), environment, ports to publish on the host (\"3000:3000\"), VOLUMES and dependencies. depends_on with condition: service_healthy waits for a service's HEALTHCHECK (pg_isready for PostgreSQL) rather than merely for its container to start. Named volumes (pgdata) keep the database across docker compose down and up. Inside the Compose network each service is reachable by its SERVICE NAME (db:5432), so the API's DATABASE_URL points at db, not localhost.",
        nodeLab: {
          task:
            "Write compose.yaml: a db service (postgres:18; POSTGRES_USER academy, POSTGRES_PASSWORD academy-dev, POSTGRES_DB academy; the named volume pgdata at /var/lib/postgresql/data; a pg_isready healthcheck), a redis service (redis:8; a redis-cli ping healthcheck) and an api service (build: .; port 3000:3000; DATABASE_URL postgresql://academy:academy-dev@db:5432/academy and REDIS_URL redis://redis:6379; depends_on db and redis with condition service_healthy). Declare the pgdata volume.",
          command: false,
          files: { "package.json": YAML_PKG, "compose.yaml": "services:\n" },
          readOnly: ["package.json"],
          open: "compose.yaml",
          solution: {
            "compose.yaml": `services:
  db:
    image: postgres:18
    environment:
      POSTGRES_USER: academy
      POSTGRES_PASSWORD: academy-dev
      POSTGRES_DB: academy
    volumes:
      - pgdata:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U academy -d academy"]
      interval: 5s
      timeout: 3s
      retries: 10

  redis:
    image: redis:8
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 5s
      timeout: 3s
      retries: 10

  api:
    build: .
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: postgresql://academy:academy-dev@db:5432/academy
      REDIS_URL: redis://redis:6379
    depends_on:
      db:
        condition: service_healthy
      redis:
        condition: service_healthy

volumes:
  pgdata:
`,
          },
          tests: [
            { label: "PostgreSQL with a named volume and a health check", check: `${YAML} const c = yamlOf("compose.yaml"); const db = c.services?.db; assert(db, "a db service"); assert(/^postgres:18/.test(db.image || ""), "image postgres:18"); const env = Array.isArray(db.environment) ? Object.fromEntries(db.environment.map((e) => e.split("="))) : db.environment || {}; eq([env.POSTGRES_USER, env.POSTGRES_PASSWORD, env.POSTGRES_DB], ["academy", "academy-dev", "academy"], "user, password and database"); assert([].concat(db.volumes || []).some((v) => String(typeof v === "object" ? v.source + ":" + v.target : v).startsWith("pgdata:/var/lib/postgresql/data")), "pgdata mounted at /var/lib/postgresql/data"); has(JSON.stringify(db.healthcheck?.test || ""), "pg_isready", "a pg_isready healthcheck"); assert(c.volumes && "pgdata" in c.volumes, "declare the named volume pgdata at the top level");` },
            { label: "Redis with a health check", check: `${YAML} const r = yamlOf("compose.yaml").services?.redis; assert(r && /^redis:8/.test(r.image || ""), "a redis service with image redis:8"); has(JSON.stringify(r.healthcheck?.test || ""), "ping", "a redis-cli ping healthcheck");` },
            { label: "The API: built here, published on 3000, using service names", check: `${YAML} const api = yamlOf("compose.yaml").services?.api; assert(api, "an api service"); assert(api.build === "." || api.build?.context === ".", "build: ."); assert([].concat(api.ports || []).some((p) => String(typeof p === "object" ? p.published + ":" + p.target : p) === "3000:3000"), "ports 3000:3000"); const env = Array.isArray(api.environment) ? Object.fromEntries(api.environment.map((e) => [e.slice(0, e.indexOf("=")), e.slice(e.indexOf("=") + 1)])) : api.environment || {}; eq(env.DATABASE_URL, "postgresql://academy:academy-dev@db:5432/academy", "DATABASE_URL uses the service name db (localhost would be the API's own container)"); eq(env.REDIS_URL, "redis://redis:6379", "REDIS_URL");` },
            { label: "The API waits until its services are healthy", check: `${YAML} const dep = yamlOf("compose.yaml").services?.api?.depends_on; assert(dep && !Array.isArray(dep), "depends_on with conditions (the long form), not just a list"); eq([dep.db?.condition, dep.redis?.condition], ["service_healthy", "service_healthy"], "condition: service_healthy for db and redis (started is not ready)");` },
          ],
          hint: "Three entries under services: (db, redis, api) and a top-level volumes: with pgdata:. depends_on in the long form: depends_on: { db: { condition: service_healthy }, … }.",
          successMessage: "One docker compose up now starts PostgreSQL, Redis and the API in the right order, with the data surviving restarts.",
        },
      },
      {
        id: "a-be-networking-volumes",
        title: "Container networking and persistent volumes",
        explain:
          "Each container has its own network namespace: inside the API container, localhost is the API container itself. Compose puts the services of a project on one network where each is reachable by its service name (db, redis); only PUBLISHED ports (ports: \"3000:3000\") are reachable from the host, so the database need not be published at all in production. A container's filesystem is thrown away with the container. NAMED VOLUMES (managed by Docker, for data such as /var/lib/postgresql/data) survive; BIND MOUNTS (./src:/app/src) map a host folder in, which suits live code reloading in development but not production data.",
        decision: decide({
          scenario: "The API container logs connect ECONNREFUSED 127.0.0.1:5432, although docker compose ps shows db as healthy, and psql on the laptop connects to localhost:5432 fine.",
          question: "What is wrong?",
          right: ["DATABASE_URL says localhost, which inside the API container is the API container itself; it should name the db service (db:5432)", "Containers reach each other by service name."],
          wrong: [
            ["The database port is not published", "Publishing is for the host; containers on the network do not need it."],
            ["PostgreSQL is still starting", "It is healthy."],
            ["The API needs network_mode: host", "A workaround that removes isolation; the URL is the bug."],
          ],
          at: 1,
          aftermath: "The same mistake appears with Redis, mail servers and any other service: use the service name.",
        }),
      },
      {
        id: "a-be-production-secrets",
        title: "Environment variables and production secrets",
        explain:
          "Configuration comes from environment variables; SECRETS (database passwords, signing keys, API keys) need more: never in the image (no ENV PASSWORD=… in a Dockerfile, no .env copied in), never in the repository, never in logs. Production platforms inject them at run time: as environment variables from a secret store, or as FILES (Docker and Kubernetes secrets mounted under /run/secrets), which keeps them out of process listings and crash dumps. The common convention reads NAME, or else the file named by NAME_FILE. Rotate secrets by supporting two at once during the change.",
        nodeLab: {
          task:
            "Write readSecret(name, env = process.env) in secrets.js: if env[name] is set, return it; else if env[`${name}_FILE`] is set, read that file (UTF-8) and return its content without the trailing newline; else throw \"Missing secret <name> (set <name> or <name>_FILE)\". If both are set, throw \"Set either <name> or <name>_FILE, not both\". Then fix the Dockerfile so no secret is baked into the image.",
          command: false,
          files: {
            "package.json": pkg({ name: "course-api", deps: [] }),
            "secrets.js": "import { readFileSync } from \"node:fs\";\n\nexport function readSecret(name, env = process.env) {\n  return env[name];\n}\n",
            "run/secrets/db_password": "s3cr3t-from-a-file\n",
            "Dockerfile": `FROM node:24-slim
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev
COPY . .
ENV NODE_ENV=production
ENV DB_PASSWORD=Pr0duction-Passw0rd
ENV SESSION_SECRET=a-very-long-production-session-secret
USER node
CMD ["node", "server.js"]
`,
          },
          readOnly: ["package.json", "run/secrets/db_password"],
          open: "secrets.js",
          solution: {
            "secrets.js": `import { readFileSync } from "node:fs";

/**
 * A secret from the environment (NAME) or from a mounted file (NAME_FILE,
 * the Docker and Kubernetes secrets convention).
 */
export function readSecret(name, env = process.env) {
  const value = env[name];
  const path = env[\`\${name}_FILE\`];
  if (value !== undefined && path !== undefined) throw new Error(\`Set either \${name} or \${name}_FILE, not both\`);
  if (value !== undefined) return value;
  if (path !== undefined) return readFileSync(path, "utf8").replace(/\\r?\\n$/, "");
  throw new Error(\`Missing secret \${name} (set \${name} or \${name}_FILE)\`);
}
`,
            "Dockerfile": `FROM node:24-slim
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev
COPY . .
ENV NODE_ENV=production
# Secrets are injected at run time (DB_PASSWORD_FILE=/run/secrets/db_password), never built in.
USER node
CMD ["node", "server.js"]
`,
          },
          tests: [
            { label: "From the environment, or from a file", check: `const { readSecret } = await load("secrets.js"); eq(readSecret("DB_PASSWORD", { DB_PASSWORD: "from-env" }), "from-env", "NAME"); eq(readSecret("DB_PASSWORD", { DB_PASSWORD_FILE: "/app/run/secrets/db_password" }), "s3cr3t-from-a-file", "NAME_FILE, without the trailing newline");` },
            { label: "Missing or ambiguous secrets fail loudly", check: `const { readSecret } = await load("secrets.js"); const msg = (env) => { try { readSecret("DB_PASSWORD", env); return null; } catch (e) { return e.message; } }; eq(msg({}), "Missing secret DB_PASSWORD (set DB_PASSWORD or DB_PASSWORD_FILE)", "neither"); eq(msg({ DB_PASSWORD: "a", DB_PASSWORD_FILE: "/app/run/secrets/db_password" }), "Set either DB_PASSWORD or DB_PASSWORD_FILE, not both", "both"); eq(readSecret("EMPTY", { EMPTY: "" }), "", "an empty value is still a value");` },
            { label: "No secret is baked into the image", check: `${DOCKERFILE} const ins = parseDockerfile(file("Dockerfile")); const leaks = ins.filter((i) => (i.op === "ENV" || i.op === "ARG") && /(PASSWORD|SECRET|TOKEN|API_KEY)/i.test(i.args)); eq(leaks.map((i) => i.op + " " + i.args), [], "ENV and ARG values end up in the image's history for anyone who pulls it"); assert(ins.some((i) => i.op === "ENV" && /NODE_ENV/.test(i.args)), "keep ENV NODE_ENV=production: it is not a secret");` },
          ],
          hint: "Read both env[name] and env[`${name}_FILE`]; throw when both are defined; readFileSync(path, \"utf8\").replace(/\\r?\\n$/, \"\") for the file. In the Dockerfile, delete the two ENV lines with secrets.",
          successMessage: "Secrets now arrive at run time, from the environment or a mounted file, and the image can be pulled by anyone without revealing a single one.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 135 · 19.7 – 19.9 · CI/CD, PIPELINES, MIGRATIONS
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "be-l135-pipelines",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 3,
    covers: ["19.7", "19.8", "19.9"],
    title: "CI/CD, Test and Build Pipelines, and Migrations During Deployment",
    subtitle: "From a push to a running release, without hands",
    estimatedMinutes: 105,
    intro: "Week 15 ran tests on pull requests. Continuous delivery goes further: every change on main becomes a tested, versioned image, and the database changes with it safely.",
    atoms: [
      {
        id: "a-be-cicd",
        title: "Continuous integration and delivery",
        explain:
          "CONTINUOUS INTEGRATION: every change is merged often and verified automatically (lint, types, tests, build). CONTINUOUS DELIVERY: every change that passes is turned into a releasable artifact (an image tagged with the commit SHA) and can be deployed with one approved click. CONTINUOUS DEPLOYMENT: it is deployed automatically. All three rely on the pipeline being the ONLY way to production: no manual builds, no SSH edits on the server, so every running version is traceable to a commit, a test run and an image.",
        decision: decide({
          scenario: "A hotfix is urgent. A senior engineer proposes to SSH into the production server, edit the file in place and restart the process, skipping the 9-minute pipeline.",
          question: "What is the right call?",
          right: ["Push the fix through the pipeline (speeding up the pipeline if 9 minutes is too slow), so production stays identical to a tested, tagged image", "Hand edits are lost at the next deploy and are never tested."],
          wrong: [
            ["Edit in place, then commit the same change later", "The next deploy or a second server silently diverges."],
            ["Edit in place on one server to test, then on the others", "Untested changes on production."],
            ["Wait for the next weekly release", "Too slow for a real hotfix."],
          ],
          at: 0,
          aftermath: "The next lab builds the pipeline that makes this fast enough.",
        }),
      },
      {
        id: "a-be-pipeline",
        title: "Automated test and build pipelines",
        explain:
          "A pipeline is a chain of jobs where each must pass before the next runs: TEST (on every pull request and push: a PostgreSQL service, npm ci, typecheck, tests), BUILD (on main only: build the image and push it to a registry, tagged with the SHA), and DEPLOY (after build, into an ENVIRONMENT that can require approval). needs: orders the jobs; if: restricts them to main; concurrency stops two deploys racing; permissions grants each job only what it needs (packages: write to push images). Cache npm and Docker layers to keep it fast.",
        nodeLab: {
          task:
            "Write .github/workflows/pipeline.yml: on pull_request and push to main; concurrency group pipeline-${{ github.ref }}. Job test: ubuntu-latest, a postgres:18 service with pg_isready health options, DATABASE_URL in env, steps checkout, setup-node (24, npm cache), npm ci, npm run typecheck, npm test. Job build: needs test, only on push to main (if: github.ref == 'refs/heads/main' && github.event_name == 'push'), permissions contents: read and packages: write, steps checkout, docker/login-action to ghcr.io, docker/build-push-action with push: true and the tag ghcr.io/${{ github.repository }}:${{ github.sha }}. Job deploy: needs build, environment production, runs ./scripts/deploy.sh ${{ github.sha }}.",
          command: false,
          files: { "package.json": YAML_PKG, ".github/workflows/pipeline.yml": "name: Pipeline\n" },
          readOnly: ["package.json"],
          open: ".github/workflows/pipeline.yml",
          solution: {
            ".github/workflows/pipeline.yml": `name: Pipeline

on:
  pull_request:
  push:
    branches: [main]

concurrency:
  group: pipeline-\${{ github.ref }}
  cancel-in-progress: false

jobs:
  test:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:18
        env:
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: academy_test
        ports:
          - 5432:5432
        options: >-
          --health-cmd pg_isready
          --health-interval 5s
          --health-timeout 5s
          --health-retries 10
    env:
      DATABASE_URL: postgresql://postgres:postgres@localhost:5432/academy_test
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 24
          cache: npm
      - run: npm ci
      - run: npm run typecheck
      - run: npm test

  build:
    needs: test
    if: github.ref == 'refs/heads/main' && github.event_name == 'push'
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write
    steps:
      - uses: actions/checkout@v4
      - uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: \${{ github.actor }}
          password: \${{ secrets.GITHUB_TOKEN }}
      - uses: docker/build-push-action@v6
        with:
          context: .
          push: true
          tags: ghcr.io/\${{ github.repository }}:\${{ github.sha }}

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment: production
    steps:
      - uses: actions/checkout@v4
      - run: ./scripts/deploy.sh \${{ github.sha }}
`,
          },
          tests: [
            { label: "Triggers and concurrency", check: `${YAML} const w = yamlOf(".github/workflows/pipeline.yml"); const on = w.on ?? w[true]; assert(on && "pull_request" in on, "on pull_request"); assert([].concat(on.push?.branches || []).includes("main"), "on push to main"); has(String(w.concurrency?.group || ""), "github.ref", "a concurrency group per ref, so two runs for main never deploy at once");` },
            { label: "test: PostgreSQL, npm ci, typecheck, tests", check: `${YAML} const t = yamlOf(".github/workflows/pipeline.yml").jobs?.test; assert(t, "a test job"); const pg = t.services?.postgres; assert(pg && /^postgres:18/.test(pg.image), "a postgres:18 service"); has(String(pg.options || ""), "pg_isready", "with a health check"); assert(t.env?.DATABASE_URL || (t.steps || []).some((s) => s.env?.DATABASE_URL), "DATABASE_URL for the tests"); const runs = (t.steps || []).map((s) => s.run).filter(Boolean); const idx = (re) => runs.findIndex((r) => re.test(r)); assert(idx(/^npm ci\\b/) >= 0, "npm ci"); assert(idx(/npm run typecheck/) > idx(/^npm ci\\b/), "npm run typecheck after npm ci"); assert(idx(/^npm test\\b/) > idx(/^npm ci\\b/), "npm test"); const node = (t.steps || []).find((s) => /^actions\\/setup-node@/.test(s.uses || "")); eq([String(node?.with?.["node-version"]), node?.with?.cache], ["24", "npm"], "setup-node 24 with the npm cache");` },
            { label: "build: after test, only for pushes to main, pushing a SHA-tagged image", check: `${YAML} const b = yamlOf(".github/workflows/pipeline.yml").jobs?.build; assert(b, "a build job"); eq([].concat(b.needs || []), ["test"], "needs: test"); const cond = String(b.if || "").replace(/\\s+/g, " "); assert(/refs\\/heads\\/main/.test(cond) && /event_name == 'push'/.test(cond), "if: only on push to main (pull requests must never publish images)"); eq([b.permissions?.packages, b.permissions?.contents], ["write", "read"], "permissions: packages write, contents read (nothing more)"); const login = (b.steps || []).find((s) => /^docker\\/login-action@/.test(s.uses || "")); eq(login?.with?.registry, "ghcr.io", "log in to ghcr.io"); const push = (b.steps || []).find((s) => /^docker\\/build-push-action@/.test(s.uses || "")); assert(push, "docker/build-push-action"); eq(String(push.with?.push), "true", "push: true"); has(String(push.with?.tags || ""), "ghcr.io/\${{ github.repository }}:\${{ github.sha }}", "tag the image with the commit SHA");` },
            { label: "deploy: after build, through the production environment", check: `${YAML} const d = yamlOf(".github/workflows/pipeline.yml").jobs?.deploy; assert(d, "a deploy job"); eq([].concat(d.needs || []), ["build"], "needs: build"); eq(typeof d.environment === "object" ? d.environment.name : d.environment, "production", "environment: production (approvals and secrets live there)"); assert((d.steps || []).some((s) => /\\.\\/scripts\\/deploy\\.sh \\$\\{\\{ github\\.sha \\}\\}/.test(s.run || "")), "run ./scripts/deploy.sh \${{ github.sha }}: deploy exactly the image that was built");` },
          ],
          hint: "Three jobs chained with needs:. Copy Week 15's test job and add npm run typecheck. The build job's if: github.ref == 'refs/heads/main' && github.event_name == 'push'. For docker/login-action: registry ghcr.io, username ${{ github.actor }}, password ${{ secrets.GITHUB_TOKEN }}.",
          successMessage: "Every pull request is tested; every push to main becomes an image named by its commit and goes to production through one gated job.",
        },
      },
      {
        id: "a-be-deploy-migrations",
        title: "Database migrations during deployment",
        explain:
          "Migrations run as a step of the release, before the new code takes traffic, ONCE, even when several instances start together: take a PostgreSQL ADVISORY LOCK (pg_advisory_lock), so the others wait and then find nothing left to do. Each migration runs in a transaction with its record in schema_migrations, so a failure leaves nothing half-applied and stops the release. During a rolling deploy old and new code run side by side, so migrations must be backward compatible: EXPAND (add the new column, write both), migrate the data, and CONTRACT (drop the old column) only in a later release.",
        nodeLab: {
          task:
            "Write migrate({ pool, dir = \"migrations\", log = console.log }) in migrate.js: take pg_advisory_lock(727) on one client; create schema_migrations (name text primary key, applied_at timestamptz default now()) if needed; for each .sql file in dir, sorted by name, not yet recorded: run it and record it in ONE transaction, logging \"applied <name>\"; on an error, roll back, release the lock and throw \"Migration <name> failed: <message>\" (later files are not run). Always release the lock and the client. Return the names applied. bin.js runs it.",
          db: `CREATE TABLE students (id integer PRIMARY KEY, full_name text NOT NULL);\nINSERT INTO students VALUES (1, 'Ada Obi'), (2, 'Bayo Adeyemi');\n`,
          command: false,
          files: {
            "package.json": pkg({ name: "course-api", scripts: { migrate: "node --env-file=.env bin.js" }, deps: ["pg"] }),
            ".env": `DATABASE_URL=${DB_URL}\n`,
            "db.js": 'import pg from "pg";\n\nexport const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });\n',
            "bin.js": 'import { pool } from "./db.js";\nimport { migrate } from "./migrate.js";\n\ntry {\n  const applied = await migrate({ pool });\n  console.log(`${applied.length} migration(s) applied`);\n} catch (err) {\n  console.error(err.message);\n  process.exitCode = 1;\n} finally {\n  await pool.end();\n}\n',
            "migrations/001_expand_add_display_name.sql": "-- Expand: the new column exists next to the old one; old code keeps working.\nALTER TABLE students ADD COLUMN display_name text;\n",
            "migrations/002_backfill_display_name.sql": "UPDATE students SET display_name = full_name WHERE display_name IS NULL;\n",
            "migrate.js": `import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";

const LOCK = 727; // any number, the same in every instance

export async function migrate({ pool, dir = "migrations", log = console.log }) {
  return [];
}
`,
          },
          readOnly: ["package.json", ".env", "db.js", "bin.js", "migrations/001_expand_add_display_name.sql", "migrations/002_backfill_display_name.sql"],
          open: "migrate.js",
          solution: {
            "migrate.js": `import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";

const LOCK = 727; // any number, the same in every instance

/** Applies pending migrations, once, even when several instances start together. */
export async function migrate({ pool, dir = "migrations", log = console.log }) {
  const client = await pool.connect();
  const applied = [];
  try {
    await client.query("SELECT pg_advisory_lock($1)", [LOCK]); // others wait here
    await client.query("CREATE TABLE IF NOT EXISTS schema_migrations (name text PRIMARY KEY, applied_at timestamptz NOT NULL DEFAULT now())");
    const done = new Set((await client.query("SELECT name FROM schema_migrations")).rows.map((r) => r.name));
    const pending = readdirSync(dir).filter((f) => f.endsWith(".sql") && !done.has(f)).sort();
    for (const name of pending) {
      try {
        await client.query("BEGIN");
        await client.query(readFileSync(path.join(dir, name), "utf8"));
        await client.query("INSERT INTO schema_migrations (name) VALUES ($1)", [name]);
        await client.query("COMMIT");
      } catch (err) {
        await client.query("ROLLBACK");
        throw new Error(\`Migration \${name} failed: \${err.message}\`);
      }
      applied.push(name);
      log(\`applied \${name}\`);
    }
    return applied;
  } finally {
    await client.query("SELECT pg_advisory_unlock($1)", [LOCK]).catch(() => {});
    client.release();
  }
}
`,
          },
          tests: [
            { label: "Pending migrations are applied, in order, and recorded", check: `await run("node --env-file=.env bin.js"); eq(stdout().trim().split("\\n"), ["applied 001_expand_add_display_name.sql", "applied 002_backfill_display_name.sql", "2 migration(s) applied"], "output"); eq((await sql("SELECT name FROM schema_migrations ORDER BY name")).map((r) => r.name), ["001_expand_add_display_name.sql", "002_backfill_display_name.sql"], "schema_migrations"); eq((await sql("SELECT display_name FROM students ORDER BY id")).map((r) => r.display_name), ["Ada Obi", "Bayo Adeyemi"], "the backfill ran");` },
            { label: "Running again does nothing", check: `await run("node --env-file=.env bin.js"); eq(stdout().trim(), "0 migration(s) applied", "nothing pending");` },
            { label: "Every run holds the advisory lock while it works", check: `const src = (file("migrate.js") || "").replace(/\\/\\/[^\\n]*/g, ""); const lock = src.search(/pg_advisory_lock\\(/); const read = src.search(/FROM schema_migrations/); assert(lock >= 0 && read > lock, "take pg_advisory_lock before reading schema_migrations, so a second instance waits and then sees the first one's work"); assert(/finally\\s*\\{[\\s\\S]*pg_advisory_unlock\\(/.test(src), "release it in a finally block, whatever happens"); assert(/finally\\s*\\{[\\s\\S]*release\\(\\)/.test(src), "and release the client"); await sql("DROP TABLE schema_migrations"); await sql("ALTER TABLE students DROP COLUMN display_name"); const pg = await load("pg"); const pool = new (pg.default ?? pg).Pool({ connectionString: "postgresql://academy_app:app-password@localhost:5432/academy" }); const { migrate } = await load("migrate.js"); const first = await migrate({ pool, log: () => {} }); const second = await migrate({ pool, log: () => {} }); eq([first.length, second.length], [2, 0], "the first instance applies both, the next finds nothing to do"); eq((await sql("SELECT count(*)::int AS n FROM pg_locks WHERE locktype = 'advisory'"))[0].n, 0, "no advisory lock left behind");` },
            { label: "A failing migration rolls back and stops the release", check: `const pg = await load("pg"); const pool = new (pg.default ?? pg).Pool({ connectionString: "postgresql://academy_app:app-password@localhost:5432/academy" }); const { migrate } = await load("migrate.js"); const fs = await load("node:fs"); fs.writeFileSync("/app/migrations/003_bad.sql", "ALTER TABLE students ADD COLUMN email text;\\nALTER TABLE students ADD COLUMN email text;\\n"); fs.writeFileSync("/app/migrations/004_after.sql", "ALTER TABLE students ADD COLUMN nickname text;\\n"); let err = null; try { await migrate({ pool, log: () => {} }); } catch (e) { err = e; } has(err?.message || "", "Migration 003_bad.sql failed:", "the error names the migration"); eq((await sql("SELECT count(*)::int AS n FROM information_schema.columns WHERE table_name = 'students' AND column_name IN ('email', 'nickname')"))[0].n, 0, "003's first statement was rolled back too, and 004 never ran"); eq((await sql("SELECT count(*)::int AS n FROM schema_migrations"))[0].n, 2, "003 is not recorded"); const locks = await sql("SELECT count(*)::int AS n FROM pg_locks WHERE locktype = 'advisory'"); eq(locks[0].n, 0, "the advisory lock was released"); fs.unlinkSync("/app/migrations/003_bad.sql"); fs.unlinkSync("/app/migrations/004_after.sql");` },
          ],
          hint: "One client from pool.connect() for the whole run (advisory locks belong to a session). In a try/finally: lock, CREATE TABLE IF NOT EXISTS, read the done names, then for each pending file BEGIN, the file's SQL, the INSERT, COMMIT (ROLLBACK and throw on error). In finally: pg_advisory_unlock and client.release().",
          successMessage: "Migrations now run exactly once per release, all-or-nothing per file, and a failed one stops the deploy before new code meets an old schema.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 136 · 19.10 – 19.11 · HOSTING, PROXIES, ROLLOUTS, ROLLBACK
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "be-l136-hosting-rollouts",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 4,
    covers: ["19.10", "19.11"],
    title: "Hosting, DNS, HTTPS, Reverse Proxies, Rolling Deployments and Rollback",
    subtitle: "Putting the API on the internet, and taking a bad release off it",
    estimatedMinutes: 85,
    intro: "Between a user's browser and your container sit DNS, TLS and a reverse proxy; between one release and the next sits a rollout that must be able to go backwards.",
    atoms: [
      {
        id: "a-be-reverse-proxy",
        title: "Hosting, domains, DNS, HTTPS and reverse proxies",
        explain:
          "DNS maps api.academy.example to your server's IP (an A record, or a CNAME to a platform's hostname). A REVERSE PROXY (nginx, Caddy, or the platform's load balancer) listens on 80 and 443, terminates HTTPS with a certificate (Let's Encrypt, renewed automatically), redirects HTTP to HTTPS, and forwards requests to the app over the private network, adding X-Forwarded-For (the client's IP) and X-Forwarded-Proto (https). The app must TRUST exactly one proxy hop (app.set(\"trust proxy\", 1)) so req.ip and req.protocol are the client's, which rate limits and secure cookies depend on, without letting clients spoof those headers.",
        nodeLab: {
          task:
            "Write nginx.conf for api.academy.example: a server on port 80 that redirects everything to https with 301; a server on 443 ssl with http2, server_name api.academy.example, ssl_certificate /etc/letsencrypt/live/api.academy.example/fullchain.pem and ssl_certificate_key …/privkey.pem, and location / proxying to http://api:3000 with proxy_set_header Host $host, X-Forwarded-For $proxy_add_x_forwarded_for and X-Forwarded-Proto $scheme. Then make server.js trust exactly one proxy, so GET /whoami reports the client's IP and https.",
          files: {
            "package.json": pkg({ name: "course-api", scripts: { start: "node server.js" }, deps: ["express"] }),
            "server.js": 'import express from "express";\n\nconst app = express();\n\napp.get("/whoami", (req, res) => res.json({ ip: req.ip, protocol: req.protocol, secure: req.secure }));\n\napp.listen(3000, () => console.log("Course API on http://localhost:3000"));\n',
            "nginx.conf": "# api.academy.example\n",
          },
          readOnly: ["package.json"],
          open: "nginx.conf",
          solution: {
            "nginx.conf": `# api.academy.example

# Plain HTTP only redirects.
server {
    listen 80;
    server_name api.academy.example;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    http2 on;
    server_name api.academy.example;

    ssl_certificate     /etc/letsencrypt/live/api.academy.example/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.academy.example/privkey.pem;

    location / {
        proxy_pass http://api:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
`,
            "server.js": 'import express from "express";\n\nconst app = express();\n// Exactly one reverse proxy (nginx) sits in front of us: trust its X-Forwarded-* headers, and nothing further.\napp.set("trust proxy", 1);\n\napp.get("/whoami", (req, res) => res.json({ ip: req.ip, protocol: req.protocol, secure: req.secure }));\n\napp.listen(3000, () => console.log("Course API on http://localhost:3000"));\n',
          },
          tests: [
            { label: "Port 80 redirects to HTTPS", check: `const conf = (file("nginx.conf") || "").replace(/#[^\\n]*/g, ""); const servers = conf.split(/\\bserver\\s*\\{/).slice(1); const http = servers.find((s) => /listen\\s+80\\b/.test(s)); assert(http, "a server block that listens on 80"); assert(/return\\s+301\\s+https:\\/\\/\\$host\\$request_uri\\s*;/.test(http), "return 301 https://$host$request_uri;"); assert(!/proxy_pass/.test(http), "plain HTTP must not be proxied to the app");` },
            { label: "Port 443: TLS with the Let's Encrypt certificate", check: `const conf = (file("nginx.conf") || "").replace(/#[^\\n]*/g, ""); const tls = conf.split(/\\bserver\\s*\\{/).slice(1).find((s) => /listen\\s+443\\s+ssl/.test(s)); assert(tls, "a server block with listen 443 ssl"); assert(/server_name\\s+api\\.academy\\.example\\s*;/.test(tls), "server_name api.academy.example"); assert(/http2\\s+on\\s*;|listen\\s+443\\s+ssl\\s+http2/.test(tls), "HTTP/2"); assert(/ssl_certificate\\s+\\/etc\\/letsencrypt\\/live\\/api\\.academy\\.example\\/fullchain\\.pem\\s*;/.test(tls), "ssl_certificate …/fullchain.pem"); assert(/ssl_certificate_key\\s+\\/etc\\/letsencrypt\\/live\\/api\\.academy\\.example\\/privkey\\.pem\\s*;/.test(tls), "ssl_certificate_key …/privkey.pem");` },
            { label: "It forwards to the app with the client's details", check: `const conf = (file("nginx.conf") || "").replace(/#[^\\n]*/g, ""); const tls = conf.split(/\\bserver\\s*\\{/).slice(1).find((s) => /listen\\s+443/.test(s)) || ""; assert(/proxy_pass\\s+http:\\/\\/api:3000\\s*;/.test(tls), "proxy_pass http://api:3000 (the app's service name)"); for (const [h, v] of [["Host", "\\\\$host"], ["X-Forwarded-For", "\\\\$proxy_add_x_forwarded_for"], ["X-Forwarded-Proto", "\\\\$scheme"]]) assert(new RegExp("proxy_set_header\\\\s+" + h + "\\\\s+" + v + "\\\\s*;").test(tls), "proxy_set_header " + h);` },
            { label: "Express trusts exactly one proxy", check: `const r = await get("/whoami", { headers: { "X-Forwarded-For": "203.0.113.9", "X-Forwarded-Proto": "https" } }); eq(r.json, { ip: "203.0.113.9", protocol: "https", secure: true }, "behind nginx, the app sees the client's IP and https"); const spoof = await get("/whoami", { headers: { "X-Forwarded-For": "6.6.6.6, 203.0.113.9" } }); eq(spoof.json?.ip, "203.0.113.9", "a client-supplied X-Forwarded-For entry is ignored: only the hop nginx added is trusted (trust proxy 1, not true)");` },
          ],
          hint: "Two server blocks. In the HTTPS one: listen 443 ssl; http2 on; the two ssl_certificate lines; location / { proxy_pass …; three proxy_set_header lines }. In server.js: app.set(\"trust proxy\", 1).",
          successMessage: "The API is reachable only over HTTPS on its own name, the proxy passes on who is really asking, and the app believes exactly the one proxy it sits behind.",
        },
      },
      {
        id: "a-be-rollback",
        title: "Rolling deployments and rollback fundamentals",
        explain:
          "A ROLLING deployment replaces instances a few at a time: start a new one, wait until its READINESS check passes, move traffic to it, stop an old one; if new instances never become ready, the rollout stops with the old version still serving. BLUE-GREEN runs the whole new version beside the old and switches traffic at once. ROLLBACK means deploying the PREVIOUS image tag again, which is only safe if the database still works with the old code: hence expand-and-contract migrations (never drop or rename in the same release that stops using a column). Keep the previous release's tag recorded, and practise rolling back before you need to.",
        decision: decide({
          scenario: "Release 42 renamed the column students.full_name to students.name in one migration and updated the code. Ten minutes after the deploy, errors spike in a different feature and the team wants to roll back to release 41.",
          question: "What happens, and what should they have done?",
          right: ["Release 41's code queries full_name, which no longer exists, so rollback fails too; the rename should have been expand (add name, write both), migrate, then contract in a later release", "Backward-compatible migrations keep rollback possible."],
          wrong: [
            ["Rollback works: images are immutable", "The image is; the database is not."],
            ["Roll back the database by restoring last night's backup", "Loses every write since then."],
            ["Rolling deployments prevent this", "Old and new code side by side make it worse during the rollout."],
          ],
          at: 0,
          aftermath: "The migration runner from this week applies the expand and backfill steps; the contract step waits for a later release.",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 137 · 19.12 – 19.15 · EXERCISES
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "be-l137-exercises",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 5,
    covers: ["19.12", "19.13", "19.14", "19.15"],
    title: "Exercises: Containerizing and Shipping the Academy API",
    subtitle: "Image, system, pipeline, server",
    estimatedMinutes: 200,
    intro: "Four exercises that take the TypeScript academy API from a folder to a running service: a multi-stage image, the whole system in Compose, a pipeline that builds and publishes, and a production deployment on a server.",
    atoms: [
      {
        id: "a-be-ex-containerize",
        title: "Exercise: containerize the API and PostgreSQL",
        explain:
          "A TypeScript API needs the compiler to build but not to run. A MULTI-STAGE Dockerfile builds in one stage (all dependencies, npm run build) and copies only the compiled dist/ and production dependencies into a slim final stage, so the image carries neither TypeScript nor your source. PostgreSQL needs no Dockerfile at all: the official image is configured through environment variables and initialised from scripts in /docker-entrypoint-initdb.d on first start.",
        nodeLab: {
          task:
            "Write a multi-stage Dockerfile. Stage build (FROM node:24-slim AS build): WORKDIR /app, copy the manifests, npm ci (all dependencies), copy the rest, npm run build. Final stage (FROM node:24-slim): WORKDIR /app, ENV NODE_ENV=production, copy the manifests, npm ci --omit=dev, COPY --from=build /app/dist ./dist, USER node, EXPOSE 3000, CMD [\"node\", \"dist/server.js\"], and a HEALTHCHECK that fetches http://localhost:3000/health/live with node. Also write db/init/01-extensions.sql (CREATE EXTENSION IF NOT EXISTS pg_trgm;) for the PostgreSQL container, and a .dockerignore.",
          command: false,
          files: { ...PROJECT_FILES, "Dockerfile": "", ".dockerignore": "" },
          readOnly: Object.keys(PROJECT_FILES),
          open: "Dockerfile",
          solution: {
            "Dockerfile": `# ── Build: the TypeScript compiler and all dependencies ──
FROM node:24-slim AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

# ── Run: compiled JavaScript and production dependencies only ──
FROM node:24-slim
WORKDIR /app
ENV NODE_ENV=production
COPY package.json package-lock.json ./
RUN npm ci --omit=dev
COPY --from=build /app/dist ./dist
USER node
EXPOSE 3000
HEALTHCHECK --interval=10s --timeout=3s --retries=3 CMD ["node", "-e", "fetch('http://localhost:3000/health/live').then((r) => process.exit(r.ok ? 0 : 1), () => process.exit(1))"]
CMD ["node", "dist/server.js"]
`,
            ".dockerignore": "node_modules\ndist\n.env\n.env.*\n.git\ntest\ncoverage\n",
            "db/init/01-extensions.sql": "-- Runs once, when the PostgreSQL container initialises an empty data directory.\nCREATE EXTENSION IF NOT EXISTS pg_trgm;\n",
          },
          tests: [
            { label: "Two stages: build, then a slim runtime", check: `${DOCKERFILE} const st = stagesOf(parseDockerfile(file("Dockerfile"))); eq(st.length, 2, "two FROM stages"); eq([st[0].image, st[0].name], ["node:24-slim", "build"], "FROM node:24-slim AS build"); eq([st[1].image, st[1].name], ["node:24-slim", null], "the final stage FROM node:24-slim"); const b = st[0].ins; const i = (re) => b.findIndex((x) => re.test(x.op + " " + x.args)); assert(i(/^RUN npm ci$/) >= 0, "the build stage runs npm ci (with dev dependencies: it needs TypeScript)"); assert(i(/^RUN npm run build/) > i(/^COPY \\. \\./), "then copies the code and runs npm run build");` },
            { label: "The runtime stage carries only what runs", check: `${DOCKERFILE} const st = stagesOf(parseDockerfile(file("Dockerfile"))); const r = st[1]?.ins || []; const has_ = (re) => r.some((x) => re.test(x.op + " " + x.args)); assert(has_(/^RUN npm ci --omit=dev$/), "npm ci --omit=dev in the final stage"); assert(has_(/^COPY --from=build \\/app\\/dist \\.\\/dist\\/?$/), "COPY --from=build /app/dist ./dist"); assert(!has_(/^COPY \\. \\./), "never COPY . . into the final stage (no TypeScript sources, no tests)"); assert(has_(/^ENV NODE_ENV[= ]production/), "ENV NODE_ENV=production"); eq(r.filter((x) => x.op === "USER").at(-1)?.args, "node", "USER node"); eq(execForm(r.filter((x) => x.op === "CMD").at(-1)?.args || ""), ["node", "dist/server.js"], "CMD [\\"node\\", \\"dist/server.js\\"]");` },
            { label: "A health check the platform can use", check: `${DOCKERFILE} const r = stagesOf(parseDockerfile(file("Dockerfile")))[1]?.ins || []; const hc = r.find((x) => x.op === "HEALTHCHECK"); assert(hc, "a HEALTHCHECK in the final stage"); has(hc.args, "localhost:3000/health/live", "it checks /health/live"); assert(!/\\bcurl\\b|\\bwget\\b/.test(hc.args), "node:24-slim has no curl or wget: use node -e with fetch");` },
            { label: ".dockerignore and the PostgreSQL init script", check: `const ignore = (file(".dockerignore") || "").split("\\n").map((l) => l.trim().replace(/\\/$/, "")); for (const e of ["node_modules", "dist", ".env", ".git"]) assert(ignore.includes(e), ".dockerignore: " + e); has(file("db/init/01-extensions.sql") || "", "CREATE EXTENSION IF NOT EXISTS pg_trgm", "db/init/01-extensions.sql");` },
          ],
          hint: "FROM node:24-slim AS build … RUN npm run build; then a second FROM node:24-slim with npm ci --omit=dev and COPY --from=build /app/dist ./dist. HEALTHCHECK CMD [\"node\", \"-e\", \"fetch('http://localhost:3000/health/live').then((r) => process.exit(r.ok ? 0 : 1), () => process.exit(1))\"].",
          successMessage: "The image now contains compiled JavaScript and production dependencies only, reports its own health, and PostgreSQL initialises itself.",
        },
      },
      {
        id: "a-be-ex-compose-system",
        title: "Exercise: run the full system locally using Docker Compose",
        explain:
          "The whole academy backend in one file: PostgreSQL and Redis with health checks and volumes, Mailpit to catch email, a one-off MIGRATE service that runs the migrations and exits, and the API and the WORKER built from the same image with different commands. depends_on with service_completed_successfully makes the API wait until migrations have finished, and restart policies bring crashed processes back.",
        nodeLab: {
          task:
            "Write compose.yaml with: db (postgres:18, env, the pgdata volume, ./db/init mounted at /docker-entrypoint-initdb.d, pg_isready healthcheck), redis (redis:8, ping healthcheck), mailpit (axllent/mailpit, ports 8025:8025), migrate (build: ., command [\"node\", \"dist/migrate.js\"], depends_on db healthy, restart: \"no\"), api (build: ., ports 3000:3000, depends_on migrate service_completed_successfully plus redis healthy, restart: unless-stopped) and worker (build: ., command [\"node\", \"dist/worker.js\"], the same dependencies as api, restart: unless-stopped, no ports). api, worker and migrate get DATABASE_URL (to db), REDIS_URL (to redis) and SMTP_HOST mailpit, SMTP_PORT 1025, through a shared x-app-env block or repeated.",
          command: false,
          files: { "package.json": YAML_PKG, "compose.yaml": "services:\n" },
          readOnly: ["package.json"],
          open: "compose.yaml",
          solution: {
            "compose.yaml": `x-app-env: &app-env
  DATABASE_URL: postgresql://academy:academy-dev@db:5432/academy
  REDIS_URL: redis://redis:6379
  SMTP_HOST: mailpit
  SMTP_PORT: "1025"

services:
  db:
    image: postgres:18
    environment:
      POSTGRES_USER: academy
      POSTGRES_PASSWORD: academy-dev
      POSTGRES_DB: academy
    volumes:
      - pgdata:/var/lib/postgresql/data
      - ./db/init:/docker-entrypoint-initdb.d:ro
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U academy -d academy"]
      interval: 5s
      retries: 10

  redis:
    image: redis:8
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 5s
      retries: 10

  mailpit:
    image: axllent/mailpit
    ports:
      - "8025:8025"

  migrate:
    build: .
    command: ["node", "dist/migrate.js"]
    environment: *app-env
    depends_on:
      db:
        condition: service_healthy
    restart: "no"

  api:
    build: .
    ports:
      - "3000:3000"
    environment: *app-env
    depends_on:
      migrate:
        condition: service_completed_successfully
      redis:
        condition: service_healthy
    restart: unless-stopped

  worker:
    build: .
    command: ["node", "dist/worker.js"]
    environment: *app-env
    depends_on:
      migrate:
        condition: service_completed_successfully
      redis:
        condition: service_healthy
    restart: unless-stopped

volumes:
  pgdata:
`,
          },
          tests: [
            { label: "Six services", check: `${YAML} const s = yamlOf("compose.yaml").services || {}; eq(Object.keys(s).sort(), ["api", "db", "mailpit", "migrate", "redis", "worker"], "services"); assert(/^postgres:18/.test(s.db?.image || "") && /^redis:8/.test(s.redis?.image || "") && /^axllent\\/mailpit/.test(s.mailpit?.image || ""), "db, redis and mailpit images"); assert([].concat(s.mailpit?.ports || []).map(String).includes("8025:8025"), "Mailpit's web UI on 8025");` },
            { label: "Data and initialisation for PostgreSQL", check: `${YAML} const c = yamlOf("compose.yaml"); const vols = [].concat(c.services?.db?.volumes || []).map((v) => typeof v === "object" ? v.source + ":" + v.target : String(v)); assert(vols.some((v) => v.startsWith("pgdata:/var/lib/postgresql/data")), "the pgdata volume"); assert(vols.some((v) => /^\\.\\/db\\/init:\\/docker-entrypoint-initdb\\.d/.test(v)), "./db/init mounted at /docker-entrypoint-initdb.d"); assert(c.volumes && "pgdata" in c.volumes, "pgdata declared"); has(JSON.stringify(c.services.db.healthcheck?.test || ""), "pg_isready", "db healthcheck"); has(JSON.stringify(c.services.redis?.healthcheck?.test || ""), "ping", "redis healthcheck");` },
            { label: "One image, three commands; migrations first", check: `${YAML} const s = yamlOf("compose.yaml").services || {}; for (const n of ["migrate", "api", "worker"]) assert(s[n]?.build === "." || s[n]?.build?.context === ".", n + " is built from . (the same image)"); eq(s.migrate?.command, ["node", "dist/migrate.js"], "migrate's command"); eq(s.worker?.command, ["node", "dist/worker.js"], "worker's command"); assert(!s.api?.command, "api uses the image's CMD"); eq(s.migrate?.depends_on?.db?.condition, "service_healthy", "migrate waits for a healthy db"); eq(String(s.migrate?.restart), "no", "migrate runs once (restart: \\"no\\")"); for (const n of ["api", "worker"]) { eq(s[n]?.depends_on?.migrate?.condition, "service_completed_successfully", n + " waits until migrations have finished"); eq(s[n]?.depends_on?.redis?.condition, "service_healthy", n + " waits for redis"); eq(s[n]?.restart, "unless-stopped", n + " restarts if it crashes"); } assert([].concat(s.api?.ports || []).map(String).includes("3000:3000"), "api on 3000"); assert(!s.worker?.ports, "the worker publishes no ports");` },
            { label: "The app services reach the others by name", check: `${YAML} const s = yamlOf("compose.yaml").services || {}; for (const n of ["migrate", "api", "worker"]) { const env = Array.isArray(s[n]?.environment) ? Object.fromEntries(s[n].environment.map((e) => [e.slice(0, e.indexOf("=")), e.slice(e.indexOf("=") + 1)])) : s[n]?.environment || {}; assert(/@db:5432\\//.test(env.DATABASE_URL || ""), n + ": DATABASE_URL points at db:5432"); eq(env.REDIS_URL, "redis://redis:6379", n + ": REDIS_URL"); eq([env.SMTP_HOST, String(env.SMTP_PORT)], ["mailpit", "1025"], n + ": SMTP to mailpit:1025"); }` },
          ],
          hint: "A top-level x-app-env: &app-env block and environment: *app-env in the three app services avoids repeating the variables (YAML anchors). depends_on: { migrate: { condition: service_completed_successfully }, redis: { condition: service_healthy } }.",
          successMessage: "docker compose up now starts the whole academy backend in order: databases healthy, migrations applied, then the API and the worker from one image.",
        },
      },
      {
        id: "a-be-ex-ci-builds",
        title: "Exercise: configure automated tests and builds",
        explain:
          "A production pipeline also BUILDS on pull requests (without pushing) so a broken Dockerfile is caught before merge, caches Docker layers between runs (cache-from and cache-to type=gha), tags the image with the SHA and, on main, also moves a main tag, and labels it with where it came from. A matrix tests on more than one Node version when you support them.",
        nodeLab: {
          task:
            "Write .github/workflows/ci.yml: on pull_request and push to main. Job test: a matrix over node 22 and 24, setup-node with ${{ matrix.node }} and the npm cache, npm ci, npm run lint, npm run typecheck, npm test. Job image: needs test; permissions contents read, packages write; docker/setup-buildx-action, docker/login-action to ghcr.io only when pushing, then docker/build-push-action with push only on push events to main (push: ${{ github.event_name == 'push' && github.ref == 'refs/heads/main' }}), tags ghcr.io/${{ github.repository }}:${{ github.sha }} and ghcr.io/${{ github.repository }}:main, cache-from type=gha and cache-to type=gha,mode=max.",
          command: false,
          files: { "package.json": YAML_PKG, ".github/workflows/ci.yml": "name: CI\n" },
          readOnly: ["package.json"],
          open: ".github/workflows/ci.yml",
          solution: {
            ".github/workflows/ci.yml": `name: CI

on:
  pull_request:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node: [22, 24]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: \${{ matrix.node }}
          cache: npm
      - run: npm ci
      - run: npm run lint
      - run: npm run typecheck
      - run: npm test

  image:
    needs: test
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write
    steps:
      - uses: actions/checkout@v4
      - uses: docker/setup-buildx-action@v3
      - uses: docker/login-action@v3
        if: github.event_name == 'push' && github.ref == 'refs/heads/main'
        with:
          registry: ghcr.io
          username: \${{ github.actor }}
          password: \${{ secrets.GITHUB_TOKEN }}
      - uses: docker/build-push-action@v6
        with:
          context: .
          push: \${{ github.event_name == 'push' && github.ref == 'refs/heads/main' }}
          tags: |
            ghcr.io/\${{ github.repository }}:\${{ github.sha }}
            ghcr.io/\${{ github.repository }}:main
          cache-from: type=gha
          cache-to: type=gha,mode=max
`,
          },
          tests: [
            { label: "Tests on Node 22 and 24", check: `${YAML} const w = yamlOf(".github/workflows/ci.yml"); const t = w.jobs?.test; eq((t?.strategy?.matrix?.node || []).map(String), ["22", "24"], "matrix node: [22, 24]"); const node = (t?.steps || []).find((s) => /^actions\\/setup-node@/.test(s.uses || "")); eq([node?.with?.["node-version"], node?.with?.cache], ["\${{ matrix.node }}", "npm"], "setup-node with the matrix version and the npm cache"); const runs = (t?.steps || []).map((s) => s.run).filter(Boolean); eq(runs, ["npm ci", "npm run lint", "npm run typecheck", "npm test"], "the steps, in order");` },
            { label: "The image is built on every run, pushed only from main", check: `${YAML} const w = yamlOf(".github/workflows/ci.yml"); const i = w.jobs?.image; eq([].concat(i?.needs || []), ["test"], "needs: test"); eq([i?.permissions?.contents, i?.permissions?.packages], ["read", "write"], "permissions"); assert(!i?.if, "no job-level if: pull requests must build the image too (to catch a broken Dockerfile)"); const steps = i?.steps || []; assert(steps.some((s) => /^docker\\/setup-buildx-action@/.test(s.uses || "")), "docker/setup-buildx-action"); const login = steps.find((s) => /^docker\\/login-action@/.test(s.uses || "")); assert(login && /event_name == 'push'/.test(login.if || "") && /refs\\/heads\\/main/.test(login.if || ""), "log in only when pushing from main"); const bp = steps.find((s) => /^docker\\/build-push-action@/.test(s.uses || "")); const push = String(bp?.with?.push || ""); assert(/event_name == 'push'/.test(push) && /refs\\/heads\\/main/.test(push), "push: only for pushes to main");` },
            { label: "SHA and main tags, with layer caching", check: `${YAML} const bp = (yamlOf(".github/workflows/ci.yml").jobs?.image?.steps || []).find((s) => /^docker\\/build-push-action@/.test(s.uses || "")); const tags = String(bp?.with?.tags || "").split(/[\\n,]/).map((t) => t.trim()).filter(Boolean); eq(tags.sort(), ["ghcr.io/\${{ github.repository }}:\${{ github.sha }}", "ghcr.io/\${{ github.repository }}:main"].sort(), "tags"); eq([bp?.with?.["cache-from"], bp?.with?.["cache-to"]], ["type=gha", "type=gha,mode=max"], "GitHub Actions cache for Docker layers");` },
          ],
          hint: "strategy: { matrix: { node: [22, 24] } } and node-version: ${{ matrix.node }}. The same expression, github.event_name == 'push' && github.ref == 'refs/heads/main', goes in the login step's if: and in build-push-action's push:. Several tags go in a block scalar (tags: |).",
          successMessage: "A broken Dockerfile now fails the pull request, both supported Node versions are tested, and main publishes an image named by its commit, built from cached layers.",
        },
      },
      {
        id: "a-be-ex-deploy",
        title: "Exercise: deploy the API to a suitable hosting platform",
        explain:
          "A small, honest production setup: one Linux server (a VPS) running Docker Compose with the images from the registry (never built on the server), Caddy as the reverse proxy (it obtains and renews HTTPS certificates by itself), secrets in an env file only the deploy user can read, and a deploy script that pulls a given tag, runs the migrations, restarts the services, checks health and prints how to roll back. Managed platforms (Render, Railway, Fly.io, a cloud's container service) do the same steps for you; the concepts carry over.",
        nodeLab: {
          task:
            "Write compose.prod.yaml: api and worker use image ghcr.io/academy/course-api:${IMAGE_TAG} (no build), env_file .env.production, restart unless-stopped, no published ports for api; migrate uses the same image with command [\"node\", \"dist/migrate.js\"] and restart \"no\"; caddy (caddy:2) publishes 80:80 and 443:443 and mounts ./Caddyfile and a caddy_data volume. Write the Caddyfile (api.academy.example reverse_proxy to api:3000). Write scripts/deploy.sh: set -euo pipefail; take the tag as $1 (fail without one); export IMAGE_TAG; docker compose -f compose.prod.yaml pull; run migrate (docker compose … run --rm migrate); up -d api worker caddy; curl --fail https://api.academy.example/health/ready; and record the tag in .deployed-tag.",
          command: false,
          files: { "package.json": YAML_PKG, "compose.prod.yaml": "services:\n", "Caddyfile": "", "scripts/deploy.sh": "#!/usr/bin/env bash\n" },
          readOnly: ["package.json"],
          open: "compose.prod.yaml",
          solution: {
            "compose.prod.yaml": `x-app: &app
  image: ghcr.io/academy/course-api:\${IMAGE_TAG}
  env_file: .env.production

services:
  migrate:
    <<: *app
    command: ["node", "dist/migrate.js"]
    restart: "no"

  api:
    <<: *app
    restart: unless-stopped

  worker:
    <<: *app
    command: ["node", "dist/worker.js"]
    restart: unless-stopped

  caddy:
    image: caddy:2
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./Caddyfile:/etc/caddy/Caddyfile:ro
      - caddy_data:/data
    depends_on:
      - api
    restart: unless-stopped

volumes:
  caddy_data:
`,
            "Caddyfile": "# Caddy obtains and renews the HTTPS certificate for this name by itself.\napi.academy.example {\n\treverse_proxy api:3000\n}\n",
            "scripts/deploy.sh": `#!/usr/bin/env bash
# Usage: scripts/deploy.sh <image tag>   (the commit SHA the pipeline built)
set -euo pipefail

TAG="\${1:?usage: deploy.sh <image tag>}"
export IMAGE_TAG="$TAG"
COMPOSE="docker compose -f compose.prod.yaml"

PREVIOUS="$(cat .deployed-tag 2>/dev/null || echo none)"
echo "Deploying $TAG (previous: $PREVIOUS)"

$COMPOSE pull
$COMPOSE run --rm migrate
$COMPOSE up -d api worker caddy

# Fail the deploy if the new release is not ready.
for attempt in 1 2 3 4 5 6; do
  if curl --fail --silent https://api.academy.example/health/ready > /dev/null; then
    echo "$TAG" > .deployed-tag
    echo "Deployed $TAG. Roll back with: scripts/deploy.sh $PREVIOUS"
    exit 0
  fi
  sleep 5
done

echo "Release $TAG is not ready; roll back with: scripts/deploy.sh $PREVIOUS" >&2
exit 1
`,
          },
          tests: [
            { label: "Production runs registry images, not builds", check: `${YAML} const s = yamlOf("compose.prod.yaml").services || {}; for (const n of ["migrate", "api", "worker"]) { assert(s[n], "a " + n + " service"); eq(s[n].image, "ghcr.io/academy/course-api:\${IMAGE_TAG}", n + ": image ghcr.io/academy/course-api:\${IMAGE_TAG}"); assert(!s[n].build, n + " must not build on the server"); eq([].concat(s[n].env_file || []).map((e) => typeof e === "object" ? e.path : e), [".env.production"], n + ": env_file .env.production (secrets stay out of the file)"); } eq(s.migrate.command, ["node", "dist/migrate.js"], "migrate's command"); eq(String(s.migrate.restart), "no", "migrate runs once"); eq(s.worker.command, ["node", "dist/worker.js"], "worker's command"); for (const n of ["api", "worker"]) eq(s[n].restart, "unless-stopped", n + " restarts"); assert(!s.api.ports, "the API is not published: only Caddy faces the internet");` },
            { label: "Caddy terminates HTTPS in front of the API", check: `${YAML} const c = yamlOf("compose.prod.yaml"); const caddy = c.services?.caddy; assert(caddy && /^caddy:2/.test(caddy.image || ""), "a caddy:2 service"); eq([].concat(caddy.ports || []).map(String).sort(), ["443:443", "80:80"], "ports 80 and 443"); const v = [].concat(caddy.volumes || []).map(String); assert(v.some((x) => x.startsWith("./Caddyfile:/etc/caddy/Caddyfile")), "the Caddyfile mounted at /etc/caddy/Caddyfile"); assert(v.some((x) => x.startsWith("caddy_data:/data")), "caddy_data at /data (certificates survive restarts)"); assert(c.volumes && "caddy_data" in c.volumes, "caddy_data declared"); const cf = (file("Caddyfile") || "").replace(/#[^\\n]*/g, ""); assert(/api\\.academy\\.example\\s*\\{[^}]*reverse_proxy\\s+api:3000[^}]*\\}/.test(cf), "Caddyfile: api.academy.example { reverse_proxy api:3000 }");` },
            { label: "The deploy script: strict, tagged, migrated, verified", check: `const sh = file("scripts/deploy.sh") || ""; const code = sh.split("\\n").filter((l) => !/^\\s*#/.test(l)).join("\\n"); has(code, "set -euo pipefail", "set -euo pipefail: stop at the first failing command"); assert(/\\$\\{1:\\?|\\[ -z "\\$\\{?1/.test(code) || /if \\[\\[? -z "\\$\\{?1/.test(code), "fail without a tag argument"); assert(/export IMAGE_TAG=/.test(code), "export IMAGE_TAG"); const pos = (re) => { const m = re.exec(code); return m ? m.index : -1; }; const pull = pos(/compose(\\s+-f\\s+compose\\.prod\\.yaml|")?[^\\n]*\\bpull\\b|\\$COMPOSE pull/); const mig = pos(/\\brun --rm migrate\\b/); const up = pos(/\\bup -d\\b/); const health = pos(/curl --fail[^\\n]*\\/health\\/ready/); assert(pull >= 0 && mig > pull && up > mig && health > up, "in order: pull, run --rm migrate, up -d, curl --fail …/health/ready"); has(code, "compose.prod.yaml", "use compose.prod.yaml"); assert(/>\\s*\\.deployed-tag/.test(code), "record the deployed tag in .deployed-tag (it is what you roll back to)");` },
          ],
          hint: "A YAML anchor (x-app: &app with image and env_file, then <<: *app in each service) keeps the three app services consistent. The script: TAG=\"${1:?usage: deploy.sh <tag>}\"; export IMAGE_TAG=\"$TAG\"; then pull, run --rm migrate, up -d, a curl --fail loop, and echo \"$TAG\" > .deployed-tag.",
          successMessage: "A release is now one command with a tag: pull, migrate, restart, verify over HTTPS, and a printed rollback line if anything is wrong.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 138 · 19.P · DELIVERABLE
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "be-l138-deliverable",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 6,
    covers: ["19.P"],
    title: "Deliverable: A Containerized Backend with a Repeatable Deployment",
    subtitle: "From commit to production, and back",
    estimatedMinutes: 120,
    intro: "The deliverable ties the week together and writes it down: the pipeline deploys the image it built, with migrations and a health gate, and the runbook says exactly how to release and how to roll back.",
    atoms: [
      {
        id: "a-be-delivery",
        title: "A repeatable deployment process",
        explain:
          "Repeatable means boring: the same pipeline for every release, deploying an immutable image named by its commit, running migrations as a step, gated by a readiness check, with the previous version one command away. The runbook (DEPLOY.md) is part of the system: it states the environments, where secrets live, how a release happens, how to roll back, and how to check health, so the person on call at 2 a.m. does not have to remember.",
        nodeLab: {
          task:
            "Complete .github/workflows/deploy.yml: job deploy (needs build, environment production with url https://api.academy.example, concurrency production with cancel-in-progress false) checks out, then runs scripts/deploy.sh ${{ github.sha }} over SSH (ssh -i with the DEPLOY_KEY secret written to a file, to ${{ secrets.DEPLOY_HOST }}), then a smoke test step: curl --fail https://api.academy.example/health/ready. Then write DEPLOY.md with sections ## Environments, ## Secrets, ## Releasing, ## Rolling back (deploy the previous tag from .deployed-tag; migrations are backward compatible, so no database restore), ## Health checks (/health/live, /health/ready).",
          command: false,
          files: {
            "package.json": YAML_PKG,
            ".github/workflows/deploy.yml": `name: Deliver

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 24
          cache: npm
      - run: npm ci
      - run: npm test

  build:
    needs: test
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write
    steps:
      - uses: actions/checkout@v4
      - uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: \${{ github.actor }}
          password: \${{ secrets.GITHUB_TOKEN }}
      - uses: docker/build-push-action@v6
        with:
          push: true
          tags: ghcr.io/academy/course-api:\${{ github.sha }}
`,
            "DEPLOY.md": "# Deploying the course API\n",
          },
          readOnly: ["package.json"],
          open: ".github/workflows/deploy.yml",
          solution: {
            ".github/workflows/deploy.yml": `name: Deliver

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 24
          cache: npm
      - run: npm ci
      - run: npm test

  build:
    needs: test
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write
    steps:
      - uses: actions/checkout@v4
      - uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: \${{ github.actor }}
          password: \${{ secrets.GITHUB_TOKEN }}
      - uses: docker/build-push-action@v6
        with:
          push: true
          tags: ghcr.io/academy/course-api:\${{ github.sha }}

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: production
      url: https://api.academy.example
    concurrency:
      group: production
      cancel-in-progress: false
    steps:
      - uses: actions/checkout@v4
      - name: Deploy over SSH
        env:
          DEPLOY_KEY: \${{ secrets.DEPLOY_KEY }}
          DEPLOY_HOST: \${{ secrets.DEPLOY_HOST }}
        run: |
          install -m 600 /dev/null deploy_key
          echo "$DEPLOY_KEY" > deploy_key
          ssh -i deploy_key -o StrictHostKeyChecking=accept-new "deploy@$DEPLOY_HOST" "cd /srv/academy && scripts/deploy.sh \${{ github.sha }}"
      - name: Smoke test
        run: curl --fail --retry 5 --retry-delay 5 https://api.academy.example/health/ready
`,
            "DEPLOY.md": `# Deploying the course API

## Environments

- **development**: each developer's machine, started with \`docker compose up\` (compose.yaml), with Mailpit instead of real email.
- **test**: GitHub Actions, a throwaway PostgreSQL service per run.
- **production**: one VPS running compose.prod.yaml behind Caddy at https://api.academy.example.

## Secrets

Production secrets live in /srv/academy/.env.production on the server (mode 600, owned by the deploy user) and in the GitHub \`production\` environment (DEPLOY_KEY, DEPLOY_HOST). They are never committed, never baked into images and never logged. To rotate one, add the new value, deploy, then remove the old one.

## Releasing

Every push to main runs the pipeline: tests, then an image tagged with the commit SHA pushed to ghcr.io, then the deploy job (it waits for approval in the production environment). The deploy job runs \`scripts/deploy.sh <sha>\` on the server: pull the image, run the migrations once, restart api, worker and caddy, and wait for /health/ready. The deployed tag is recorded in .deployed-tag.

## Rolling back

Run \`scripts/deploy.sh <previous sha>\` on the server; the previous tag is printed by every deploy and kept in .deployed-tag before it is replaced (or found in the pipeline history). Migrations are written expand-then-contract, so the previous release works with the current schema and no database restore is needed. Never roll back by restoring a backup unless data is corrupted.

## Health checks

- \`GET /health/live\`: the process is up (used by Docker's HEALTHCHECK; failing means restart).
- \`GET /health/ready\`: the database and Redis answer (used by the deploy script and the smoke test; failing means do not send traffic).
`,
          },
          tests: [
            { label: "deploy: after build, gated by the production environment, one at a time", check: `${YAML} const d = yamlOf(".github/workflows/deploy.yml").jobs?.deploy; assert(d, "a deploy job"); eq([].concat(d.needs || []), ["build"], "needs: build"); eq([d.environment?.name, d.environment?.url], ["production", "https://api.academy.example"], "environment: production with its url"); eq([d.concurrency?.group, d.concurrency?.["cancel-in-progress"]], ["production", false], "concurrency production, never cancelling a deploy halfway");` },
            { label: "It deploys exactly the built image, then checks it", check: `${YAML} const steps = yamlOf(".github/workflows/deploy.yml").jobs?.deploy?.steps || []; const deployAt = steps.findIndex((s) => /\\bssh\\b/.test(s.run || "") && /scripts\\/deploy\\.sh \\$\\{\\{ github\\.sha \\}\\}/.test(s.run || "")); assert(deployAt >= 0, "a step that runs scripts/deploy.sh \${{ github.sha }} over ssh"); const s = steps[deployAt]; const text = JSON.stringify(s); has(text, "secrets.DEPLOY_KEY", "the SSH key comes from the DEPLOY_KEY secret"); has(text, "secrets.DEPLOY_HOST", "and the host from DEPLOY_HOST"); assert(!/BEGIN (OPENSSH|RSA) PRIVATE KEY/.test(file(".github/workflows/deploy.yml")), "never paste a key into the workflow"); const smoke = steps.findIndex((x) => /curl --fail[^\\n]*https:\\/\\/api\\.academy\\.example\\/health\\/ready/.test(x.run || "")); assert(smoke > deployAt, "a smoke test after the deploy: curl --fail https://api.academy.example/health/ready");` },
            { label: "DEPLOY.md: the runbook", check: `const md = file("DEPLOY.md") || ""; for (const s of ["Environments", "Secrets", "Releasing", "Rolling back", "Health checks"]) assert(section(md, s).trim().split(/\\s+/).length >= 20, "## " + s + " needs real content (20+ words)"); const env = section(md, "Environments").toLowerCase(); for (const e of ["development", "test", "production"]) has(env, e, "## Environments names " + e); const rb = section(md, "Rolling back"); has(rb, "deploy.sh", "## Rolling back: the command"); assert(/previous/i.test(rb) && /\\.deployed-tag|tag/i.test(rb), "## Rolling back: where the previous tag comes from"); assert(/expand|backward/i.test(rb), "## Rolling back: why the database is still compatible"); const hc = section(md, "Health checks"); has(hc, "/health/live", "## Health checks: /health/live"); has(hc, "/health/ready", "## Health checks: /health/ready"); const sec = section(md, "Secrets").toLowerCase(); assert(/never/.test(sec) && /(commit|image|repositor)/.test(sec), "## Secrets: where they live and where they never go");` },
          ],
          hint: "environment: { name: production, url: https://api.academy.example } and concurrency: { group: production, cancel-in-progress: false } on the deploy job. Pass secrets to the step through env: and use them in run: (\"$DEPLOY_KEY\"). DEPLOY.md: five ## sections with the commands and reasons.",
          successMessage: "Every release now follows one path from commit to production, ends with a health check, and the runbook tells anyone how to undo it.",
        },
      },
    ],
    task: {
      title: "Week 19 deliverable: a containerized backend deployed through a repeatable process",
      intro: "Ship your own course API.",
      prompts: [
        "Write a multi-stage Dockerfile and .dockerignore; check the image runs with docker run and passes its HEALTHCHECK.",
        "Write compose.yaml for the whole system (database, Redis, mail catcher, migrate, API, worker) and make docker compose up work from a fresh clone.",
        "Set up the pipeline: tests on pull requests, an image tagged with the SHA on main, and a deploy job behind a production environment.",
        "Deploy to a VPS with Caddy or to a managed platform; write DEPLOY.md and practise a rollback to the previous tag.",
        "Checkpoint: the API starts from one docker compose up, every push is tested and built automatically, and a bad release can be rolled back.",
      ],
      closing: "Next: Week 20, observability and operations.",
    },
    requirements: { read: true, video: false, assessment: true },
  },
];
