/**
 * PRISMA IN THE LAB — loaded only by labs whose package.json depends on
 * Prisma (entry.js imports this file on demand; the bundler puts it in a
 * chunk of its own).
 *
 * What runs is Prisma 7's own code, pinned in scripts/node-lab:
 *
 *   - Prisma Client: @prisma/client's runtime with its query compiler (the
 *     WebAssembly build Prisma ships for PostgreSQL), talking to the lab's
 *     PostgreSQL through @prisma/adapter-pg and the lab's node-postgres.
 *   - npx prisma generate: the real `prisma-client` generator
 *     (@prisma/client-generator-ts) fed by the real schema parser
 *     (@prisma/internals, WebAssembly). Its output is byte for byte what
 *     the Prisma CLI writes.
 *   - npx prisma validate / format: the same parser and formatter.
 *
 * Two commands are the lab's own, because the Prisma CLI does them with its
 * native schema engine, which cannot run in a browser:
 *
 *   - npx prisma migrate deploy / status: apply and report the migration
 *     files in prisma/migrations exactly as the CLI does (the same
 *     _prisma_migrations table, checksums, statement-by-statement
 *     application and messages, taken from recordings of Prisma 7.10.1).
 *   - npx prisma migrate dev: explains that migrations are created on the
 *     learner's computer; the course shows that command in recorded
 *     terminals, and each lab's migration files were made by it.
 */
import { createHash, randomUUID } from "node:crypto";
import pathMod from "node:path";

import clientRuntime from "@prisma/client/runtime/client";
import * as queryCompiler from "@prisma/client/runtime/query_compiler_fast_bg.postgresql.mjs";
import * as queryCompilerWasm from "@prisma/client/runtime/query_compiler_fast_bg.postgresql.wasm-base64.mjs";
import * as adapterPg from "@prisma/adapter-pg";
import { defineConfig, env, PrismaConfigEnvError } from "@prisma/config";
import { formatSchema, getConfig, getDMMF, validate } from "@prisma/internals";
import { PrismaClientTsGenerator } from "@prisma/client-generator-ts";

import pg from "./labPg.js";
import proc from "./process.js";

export const PRISMA_VERSION = "7.10.1";
const ENGINES_HASH = "d1b3f377ca835d73fd50954a5e22128b9ebdd6b8";

function esm(ns) {
  const out = { ...ns, __esModule: true };
  if (!("default" in out)) out.default = ns;
  return out;
}

/** The packages a Prisma project imports (the generated client imports the runtime ones). */
export const PRISMA_PACKAGES = {
  "@prisma/client/runtime/client": () => clientRuntime,
  "@prisma/client/runtime/query_compiler_fast_bg.postgresql.mjs": () => esm(queryCompiler),
  "@prisma/client/runtime/query_compiler_fast_bg.postgresql.wasm-base64.mjs": () => esm(queryCompilerWasm),
  "@prisma/adapter-pg": () => esm(adapterPg),
  "prisma/config": () => esm({ defineConfig, env }),
};

/* ── output ───────────────────────────────────────────────────────── */

const ANSI = /\u001b\[[0-9;]*m/g;
const hostNow = () => (globalThis.performance ? globalThis.performance.now() : Date.now());

class CliExit extends Error {
  constructor(code) {
    super(`exit ${code}`);
    this.exitCode = code;
  }
}

function makeIo(machine) {
  return {
    out: (text) => machine.writeStd("stdout", text),
    err: (text) => machine.writeStd("stderr", text),
    fail(text, code = 1) {
      machine.writeStd("stderr", text);
      throw new CliExit(code);
    },
  };
}

/* ── prisma.config.ts and the schema ──────────────────────────────── */

// The CLI looks for prisma7.config.* first (the name prisma init writes in Prisma 7), then prisma.config.*.
const CONFIG_FILES = ["prisma7", "prisma"].flatMap((base) => ["ts", "mts", "cts", "js", "mjs", "cjs"].map((ext) => `${base}.config.${ext}`));

async function loadPrismaConfig(machine, io) {
  const name = CONFIG_FILES.find((f) => machine.vol.node(`/app/${f}`));
  if (!name) return { config: {}, file: null };
  let mod;
  try {
    mod = await machine.load(`/app/${name}`);
  } catch (err) {
    const what = err instanceof PrismaConfigEnvError || err?.name === "PrismaConfigEnvError" ? `PrismaConfigEnvError: ${err.message}` : `${err?.name || "Error"}: ${err?.message || err}`;
    io.fail(`Failed to load config file "${machine.cwd}" as a TypeScript/JavaScript module. Error: ${what}\n`);
  }
  io.out(`Loaded Prisma config from ${name}.\n\n`);
  return { config: mod?.default ?? {}, file: name };
}

function readSchema(machine, io, config) {
  const rel = config.schema || "prisma/schema.prisma";
  const abs = pathMod.resolve(machine.cwd, rel);
  const node = machine.vol.node(abs);
  if (!node || node.type !== "file") {
    io.fail(`Error: Could not find Prisma Schema that is required for this command.\nYou can either provide it with \`--schema\` argument,\nset it in your Prisma Config file (e.g., \`prisma.config.ts\`),\nset it as \`prisma.schema\` in your package.json,\nor put it into the default location (\`./prisma/schema.prisma\`, or \`./schema.prisma\`.\nChecked following paths:\n\nschema.prisma: file not found\nprisma/schema.prisma: file not found\n\nSee also https://pris.ly/d/prisma-schema-location\n`);
  }
  const relPath = pathMod.relative(machine.cwd, abs);
  io.out(`Prisma schema loaded from ${relPath}.\n`);
  return { abs, rel: relPath, text: node.data.toString("utf8") };
}

const pslError = (err) => `Error: ${String(err?.message ?? err).replace(ANSI, "")}\n`;

/* ── generate / validate / format ─────────────────────────────────── */

async function generate(machine, io, config) {
  const schema = readSchema(machine, io, config);
  const datamodel = [[schema.abs, schema.text]];
  let meta;
  let dmmf;
  try {
    meta = await getConfig({ datamodel });
    dmmf = await getDMMF({ datamodel });
  } catch (err) {
    io.fail(pslError(err));
  }
  io.out("\n");
  const generators = meta.generators.filter((g) => g.provider.value === "prisma-client");
  if (meta.generators.length === 0) io.fail("Error: \nYou don't have any generators defined in your schema.prisma, so nothing will be generated.\nYou can define them like this:\n\ngenerator client {\n  provider = \"prisma-client\"\n  output   = \"./generated\"\n}\n");
  for (const gen of generators) {
    if (!gen.output) io.fail('Error: An output path is required for the `prisma-client` generator. Please provide an output path in your schema file:\n\ngenerator client {\n  provider = "prisma-client"\n  output   = "../src/generated"\n}\n\nNote: the output path is relative to the schema directory.\n');
    const output = pathMod.resolve(pathMod.dirname(schema.abs), gen.output.value);
    const t0 = hostNow();
    await new PrismaClientTsGenerator().generate({
      generator: { ...gen, output: { value: output, fromEnvVar: null }, isCustomOutput: true },
      otherGenerators: [],
      schemaPath: schema.abs,
      dmmf,
      datasources: meta.datasources,
      datamodel: schema.text,
      version: ENGINES_HASH,
      binaryPaths: {},
      postinstall: false,
      noEngine: false,
      allowNoModels: false,
      typedSql: undefined,
    });
    const shown = `./${pathMod.relative(machine.cwd, output)}`;
    io.out(`✔ Generated Prisma Client (${PRISMA_VERSION}) to ${shown} in ${Math.max(1, Math.round(hostNow() - t0))}ms\n\n`);
  }
}

async function validateCommand(machine, io, config) {
  const schema = readSchema(machine, io, config);
  try {
    await getConfig({ datamodel: [[schema.abs, schema.text]] });
    validate({ schemas: [[schema.abs, schema.text]] });
  } catch (err) {
    io.out("\n");
    io.fail(pslError(err));
  }
  io.out(`The schema at ${schema.rel} is valid 🚀\n`);
}

async function formatCommand(machine, io, config) {
  const schema = readSchema(machine, io, config);
  const t0 = hostNow();
  const [[, formatted]] = await formatSchema({ schemas: [[schema.abs, schema.text]] });
  machine.vol.write(schema.abs, formatted);
  io.out(`Formatted ${schema.rel} in ${Math.max(1, Math.round(hostNow() - t0))}ms 🚀\n`);
}

/* ── migrate deploy / status ──────────────────────────────────────── */

const MIGRATIONS_TABLE = `CREATE TABLE IF NOT EXISTS "_prisma_migrations" (
    "id"                    VARCHAR(36) PRIMARY KEY NOT NULL,
    "checksum"              VARCHAR(64) NOT NULL,
    "finished_at"           TIMESTAMPTZ,
    "migration_name"        VARCHAR(255) NOT NULL,
    "logs"                  TEXT,
    "rolled_back_at"        TIMESTAMPTZ,
    "started_at"            TIMESTAMPTZ NOT NULL DEFAULT now(),
    "applied_steps_count"   INTEGER NOT NULL DEFAULT 0
)`;

/** Splits a migration script into statements, respecting quotes, comments and $$ bodies. */
export function splitStatements(sql) {
  const out = [];
  let cur = "";
  for (let i = 0; i < sql.length; i++) {
    const c = sql[i];
    const two = sql.slice(i, i + 2);
    if (two === "--") {
      const end = sql.indexOf("\n", i);
      const stop = end === -1 ? sql.length : end;
      cur += sql.slice(i, stop);
      i = stop - 1;
      continue;
    }
    if (two === "/*") {
      const end = sql.indexOf("*/", i + 2);
      const stop = end === -1 ? sql.length : end + 2;
      cur += sql.slice(i, stop);
      i = stop - 1;
      continue;
    }
    if (c === "'" || c === '"') {
      let j = i + 1;
      while (j < sql.length && !(sql[j] === c && sql[j + 1] !== c)) j += sql[j] === c ? 2 : 1;
      cur += sql.slice(i, j + 1);
      i = j;
      continue;
    }
    if (c === "$") {
      const tag = /^\$[A-Za-z_]*\$/.exec(sql.slice(i));
      if (tag) {
        const end = sql.indexOf(tag[0], i + tag[0].length);
        const stop = end === -1 ? sql.length : end + tag[0].length;
        cur += sql.slice(i, stop);
        i = stop - 1;
        continue;
      }
    }
    if (c === ";") {
      if (cur.replace(/--[^\n]*|\/\*[\s\S]*?\*\//g, "").trim()) out.push(cur.trim());
      cur = "";
      continue;
    }
    cur += c;
  }
  if (cur.replace(/--[^\n]*|\/\*[\s\S]*?\*\//g, "").trim()) out.push(cur.trim());
  return out;
}

function listMigrations(machine, dir) {
  const node = machine.vol.node(dir);
  if (!node || node.type !== "dir") return [];
  return machine.vol
    .children(dir)
    .filter((name) => machine.vol.node(`${dir}/${name}/migration.sql`))
    .sort()
    .map((name) => {
      const script = machine.vol.node(`${dir}/${name}/migration.sql`).data.toString("utf8");
      return { name, script, checksum: createHash("sha256").update(script).digest("hex") };
    });
}

function datasourceUrl(io, config, command) {
  const url = config.datasource?.url;
  if (!url) io.fail(`Error: The datasource.url property is required in your Prisma config file when using prisma ${command}.\n`);
  return url;
}

function describeDatasource(io, url) {
  const u = new URL(url);
  const database = decodeURIComponent(u.pathname.replace(/^\//, "")) || "postgres";
  const schemaName = u.searchParams.get("schema") || "public";
  const host = `${u.hostname}:${u.port || 5432}`;
  io.out(`Datasource "db": PostgreSQL database "${database}", schema "${schemaName}" at "${host}"\n\n`);
  return { database, host, schemaName, user: decodeURIComponent(u.username) };
}

async function connect(io, url, where) {
  const client = new pg.Client({ connectionString: url });
  try {
    await client.connect();
  } catch (err) {
    if (err.code === "28P01" || err.code === "28000") {
      io.fail(`Error: P1000: Authentication failed against database server, the provided database credentials for \`${where.user}\` are not valid.\n\nPlease make sure to provide valid database credentials for the database server at the configured address.\n`);
    }
    if (err.code === "3D000") {
      io.fail(`Error: P1003: Database \`${where.database}\` does not exist on the database server at \`${where.host}\`.\n\n(The Prisma CLI creates a missing database here; this lab's PostgreSQL has only the database in its DATABASE_URL.)\n`);
    }
    io.fail(`Error: P1001: Can't reach database server at \`${where.host}\`\n\nPlease make sure your database server is running at \`${where.host}\`.\n`);
  }
  return client;
}

const plural = (n) => `${n} migration${n === 1 ? "" : "s"}`;

/** Rust's Debug form of the PostgreSQL error, as the Prisma CLI prints it (tokio-postgres DbError). */
function dbErrorDebug(e) {
  const s = (v) => (v === undefined || v === null || v === "" ? "None" : `Some(${JSON.stringify(String(v))})`);
  const severity = e.severity || "ERROR";
  const parsed = { ERROR: "Error", FATAL: "Fatal", PANIC: "Panic", WARNING: "Warning", NOTICE: "Notice", DEBUG: "Debug", INFO: "Info", LOG: "Log" }[severity];
  const position = e.position ? `Some(Original(${e.position}))` : "None";
  const line = e.line ? `Some(${e.line})` : "None";
  return `DbError { severity: ${JSON.stringify(severity)}, parsed_severity: ${parsed ? `Some(${parsed})` : "None"}, code: SqlState(E${e.code}), message: ${JSON.stringify(e.message)}, detail: ${s(e.detail)}, hint: ${s(e.hint)}, position: ${position}, where_: ${s(e.where)}, schema: ${s(e.schema)}, table: ${s(e.table)}, column: ${s(e.column)}, datatype: ${s(e.dataType)}, constraint: ${s(e.constraint)}, file: ${s(e.file)}, line: ${line}, routine: ${s(e.routine)} }`;
}

const pgTimestamp = (d) => {
  const iso = new Date(d).toISOString();
  return `${iso.slice(0, 10)} ${iso.slice(11, 19)}.${iso.slice(20, 23)}000 UTC`;
};

async function migrateState(io, client) {
  await client.query(MIGRATIONS_TABLE);
  const { rows } = await client.query('SELECT "id", "checksum", "finished_at", "migration_name", "logs", "rolled_back_at", "started_at", "applied_steps_count" FROM "_prisma_migrations" ORDER BY "started_at" ASC');
  return rows;
}

async function migrateDeploy(machine, io, config) {
  readSchema(machine, io, config);
  const url = datasourceUrl(io, config, "migrate deploy");
  const where = describeDatasource(io, url);
  const dir = pathMod.resolve(machine.cwd, config.migrations?.path || "prisma/migrations");
  const relDir = pathMod.relative(machine.cwd, dir);
  const migrations = listMigrations(machine, dir);
  const client = await connect(io, url, where);
  try {
    io.out(migrations.length ? `${plural(migrations.length)} found in ${relDir}\n\n` : `No migration found in ${relDir}\n\n`);
    await client.query("SELECT pg_advisory_lock(72707369)");
    const applied = await migrateState(io, client);
    const failed = applied.find((r) => r.finished_at === null && r.rolled_back_at === null);
    if (failed) {
      io.fail(`Error: P3009\n\nmigrate found failed migrations in the target database, new migrations will not be applied. Read more about how to resolve migration issues in a production database: https://pris.ly/d/migrate-resolve\nThe \`${failed.migration_name}\` migration started at ${pgTimestamp(failed.started_at)} failed\n\n`);
    }
    const done = new Set(applied.filter((r) => r.finished_at !== null).map((r) => r.migration_name));
    const pending = migrations.filter((m) => !done.has(m.name));
    if (!pending.length) {
      io.out("\nNo pending migrations to apply.\n");
      return;
    }
    for (const m of pending) {
      io.out(`Applying migration \`${m.name}\`\n`);
      const id = randomUUID();
      await client.query('INSERT INTO "_prisma_migrations" ("id", "checksum", "migration_name", "started_at", "applied_steps_count") VALUES ($1, $2, $3, now(), 0)', [id, m.checksum, m.name]);
      try {
        // Like the CLI: statement by statement, outside a transaction, so a failure leaves the earlier statements applied.
        for (const statement of splitStatements(m.script)) await client.query(statement);
      } catch (err) {
        const logs = `A migration failed to apply. New migrations cannot be applied before the error is recovered from. Read more about how to resolve migration issues in a production database: https://pris.ly/d/migrate-resolve\n\nMigration name: ${m.name}\n\nDatabase error code: ${err.code}\n\nDatabase error:\nERROR: ${err.message}\n\n${dbErrorDebug(err)}\n\n`;
        await client.query('UPDATE "_prisma_migrations" SET "logs" = $2 WHERE "id" = $1', [id, logs]);
        io.fail(`Error: P3018\n\n${logs}`);
      }
      await client.query('UPDATE "_prisma_migrations" SET "finished_at" = now(), "applied_steps_count" = 1 WHERE "id" = $1', [id]);
    }
    const tree = pending.map((m) => `  └─ ${m.name}/\n    └─ migration.sql\n`).join("");
    io.out(`\nThe following migration(s) have been applied:\n\nmigrations/\n${tree}\nAll migrations have been successfully applied.\n`);
  } finally {
    await client.end().catch(() => {});
  }
}

async function migrateStatus(machine, io, config) {
  readSchema(machine, io, config);
  const url = datasourceUrl(io, config, "migrate status");
  const where = describeDatasource(io, url);
  const dir = pathMod.resolve(machine.cwd, config.migrations?.path || "prisma/migrations");
  const relDir = pathMod.relative(machine.cwd, dir);
  const migrations = listMigrations(machine, dir);
  const client = await connect(io, url, where);
  try {
    const applied = await migrateState(io, client);
    io.out(migrations.length ? `${plural(migrations.length)} found in ${relDir}\n` : `No migration found in ${relDir}\n`);
    const failed = applied.filter((r) => r.finished_at === null && r.rolled_back_at === null).map((r) => r.migration_name);
    if (failed.length) {
      const names = failed.join("\n");
      io.fail(`Following migration have failed:\n${names}\n\nDuring development if the failed migration(s) have not been deployed to a production database you can then fix the migration(s) and run prisma migrate dev.\n\nThe failed migration(s) can be marked as rolled back or applied:\n\n- If you rolled back the migration(s) manually:\nprisma migrate resolve --rolled-back "${failed[0]}"\n\n- If you fixed the database manually (hotfix):\nprisma migrate resolve --applied "${failed[0]}"\n\nRead more about how to resolve migration issues in a production database:\nhttps://pris.ly/d/migrate-resolve\n`);
    }
    const done = new Set(applied.filter((r) => r.finished_at !== null).map((r) => r.migration_name));
    const pending = migrations.filter((m) => !done.has(m.name)).map((m) => m.name);
    if (pending.length) {
      io.fail(`Following migration${pending.length === 1 ? "" : "s"} have not yet been applied:\n${pending.join("\n")}\n\nTo apply migrations in development run prisma migrate dev.\nTo apply migrations in production run prisma migrate deploy.\n`);
    }
    io.out("\nDatabase schema is up to date!\n");
  } finally {
    await client.end().catch(() => {});
  }
}

/* ── the command ──────────────────────────────────────────────────── */

const HELP = `
Prisma is a modern DB toolkit to query, migrate and model your database (https://prisma.io)

Usage

  $ prisma [command]

Commands available in this lab

   generate   Generate artifacts (e.g. Prisma Client)
   validate   Validate your Prisma schema
     format   Format your Prisma schema
    migrate   deploy and status: apply and check the migrations in prisma/migrations
`;

/** `prisma …`: returns the exit code. machine.runPrisma prepares the process first. */
export async function runPrisma(machine, args) {
  const io = makeIo(machine);
  const [cmd, sub] = args.filter((a) => !a.startsWith("-"));
  try {
    if (args.includes("--version") || args.includes("-v") || cmd === "version") {
      io.out(`prisma               : ${PRISMA_VERSION}\n@prisma/client       : ${PRISMA_VERSION}\nOperating System     : linux\nArchitecture         : x64\nNode.js              : ${proc.version}\nQuery Compiler       : enabled\nPSL                  : @prisma/prisma-schema-wasm 8.1.0-1.${ENGINES_HASH}\nDefault Engines Hash : ${ENGINES_HASH}\n`);
      return 0;
    }
    if (!cmd || cmd === "help" || args.includes("--help") || args.includes("-h")) {
      io.out(HELP);
      return 0;
    }
    const { config } = await loadPrismaConfig(machine, io);
    if (cmd === "generate") await generate(machine, io, config);
    else if (cmd === "validate") await validateCommand(machine, io, config);
    else if (cmd === "format") await formatCommand(machine, io, config);
    else if (cmd === "migrate" && sub === "deploy") await migrateDeploy(machine, io, config);
    else if (cmd === "migrate" && sub === "status") await migrateStatus(machine, io, config);
    else if (cmd === "migrate" && (sub === "dev" || sub === "reset" || sub === "diff" || sub === "resolve")) {
      io.fail(
        `prisma migrate ${sub} needs Prisma's schema engine, a native program that cannot run in this browser lab.\n\nThis lab's migrations in prisma/migrations were created with prisma migrate dev on a real computer (the lesson shows that run). Apply them here with:\n\n  npx prisma migrate deploy\n\nOn your own computer, with PostgreSQL running, npx prisma migrate ${sub} works as the lesson shows.\n`
      );
    } else if (cmd === "db" || cmd === "studio" || cmd === "init" || cmd === "introspect" || cmd === "debug" || cmd === "dev") {
      io.fail(`prisma ${cmd} is not available in this lab: it needs a real computer (see the lesson). Here you can run prisma generate, validate, format, migrate deploy and migrate status.\n`);
    } else {
      io.fail(`! Unknown command "${args.join(" ")}"\n${HELP}`);
    }
    return 0;
  } catch (err) {
    if (err instanceof CliExit) return err.exitCode;
    io.err(`${err?.stack || err}\n`);
    return 1;
  }
}
