/**
 * PostgreSQL for the build: the same PGlite engine the lessons run in the
 * browser, used in Node to prove every SQL lab, example and exam item.
 *
 * One server is started and reset between runs with the same freshOn() the
 * page uses (src/academy/sql/sqlWorker.js), so a lab is proved under exactly
 * the isolation a learner gets: every run starts from a new installation
 * with only the lab's setup applied.
 */
import { PGlite } from "@electric-sql/pglite";
import { freshOn } from "../../../src/academy/sql/engine.js";

let server = null;

async function start() {
  if (!server) server = PGlite.create();
  return server;
}

/** A function returning a fresh database with `setup` applied. */
export function freshFor(setup = "") {
  return async () => freshOn(await start(), setup)();
}

/** Stop the server, so the process can exit. */
export async function closeAll() {
  if (server) await (await server).close();
  server = null;
}
