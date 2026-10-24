/**
 * node-postgres, connected to the lab's PostgreSQL.
 *
 * The real driver (Pool, Client, pg-types, DatabaseError) with one change:
 * every connection gets a LabPgSocket instead of a TCP socket. Everything
 * in the runtime that uses `pg` — a lab project's own code, and Prisma's
 * @prisma/adapter-pg — gets this module, so all of them reach the same
 * database.
 */
import pgPkg from "pg";
import { ctx } from "./context.js";
import proc from "./process.js";
import { LabPgSocket } from "./pgSocket.js";

const labStream = () => new LabPgSocket(ctx.machine?.pgServer || null);
// pg reads its default user from the environment when it loads; here that is per machine.
const pgDefaults = () => {
  pgPkg.defaults.user = proc.env.PGUSER || proc.env.USER;
};

class Pool extends pgPkg.Pool {
  constructor(config) {
    pgDefaults();
    super({ ...(typeof config === "string" ? { connectionString: config } : config || {}), stream: labStream });
  }
}

class Client extends pgPkg.Client {
  constructor(config) {
    pgDefaults();
    super({ ...(typeof config === "string" ? { connectionString: config } : config || {}), stream: labStream });
  }
}

const pg = {
  Pool,
  Client,
  types: pgPkg.types,
  DatabaseError: pgPkg.DatabaseError,
  escapeIdentifier: pgPkg.escapeIdentifier,
  escapeLiteral: pgPkg.escapeLiteral,
  Result: pgPkg.Result,
  TypeOverrides: pgPkg.TypeOverrides,
  defaults: pgPkg.defaults,
};
pg.default = pg;

export default pg;
