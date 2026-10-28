/**
 * THE DATABASE SERVER'S SOCKET
 *
 * The lab's `pg` is the real node-postgres driver (Pool, Client, pg-types,
 * DatabaseError). Instead of a TCP socket it gets this one, which carries
 * its PostgreSQL wire-protocol bytes to PGlite — PostgreSQL 18 compiled to
 * WebAssembly — and carries PostgreSQL's answers back. Every result, type
 * conversion and error a learner sees is therefore what node-postgres and
 * PostgreSQL produce.
 *
 * This socket plays the part of the server only for what PGlite has no
 * network for: the connection handshake (checking the user, password and
 * database against the lab's DATABASE_URL, with PostgreSQL's own error
 * messages when they are wrong) and connection refusal (wrong host or port,
 * or no database in this lab).
 *
 * PGlite is ONE database session. Connections take turns on it: a
 * connection holds the session from its first message until PostgreSQL
 * reports it idle again, so a transaction (BEGIN … COMMIT on one client)
 * runs without another connection's statements landing in the middle of it,
 * as with row locks on a real server. A query that waits too long for a
 * transaction on another connection gets an explanation instead of hanging.
 */
import EventEmitter from "./events.js";
import { Buffer } from "./buffer.js";
import { ctx } from "./context.js";

const LOCK_WAIT_MS = 15000;

/* ── The one session, shared in turns ──────────────────────────────── */
export class SessionLock {
  constructor() {
    this.owner = null;
    this.queue = [];
  }
  acquire(socket) {
    if (this.owner === null || this.owner === socket) {
      this.owner = socket;
      return Promise.resolve();
    }
    return new Promise((resolve, reject) => {
      const entry = { socket, resolve, reject, timer: null };
      const loop = ctx.loop;
      if (loop) {
        entry.timer = loop.setTimeout(() => {
          this.queue = this.queue.filter((e) => e !== entry);
          reject(
            Object.assign(
              new Error(
                "This query waited 15 seconds for a transaction on another connection to finish. The lab's PostgreSQL gives a transaction the database to itself, so a query sent with pool.query() while your code holds a client inside BEGIN … COMMIT waits for that transaction. Inside a transaction, send every query through the transaction's client (client.query), and always COMMIT or ROLLBACK and release() it."
              ),
              { code: "LAB_LOCK_TIMEOUT" }
            )
          );
        }, LOCK_WAIT_MS);
        entry.timer.unref();
      }
      this.queue.push(entry);
    });
  }
  release(socket) {
    if (this.owner !== socket) return;
    this.owner = null;
    const next = this.queue.shift();
    if (next) {
      if (next.timer) ctx.loop?.clear(next.timer);
      this.owner = next.socket;
      next.resolve();
    }
  }
  drop(socket) {
    this.queue = this.queue.filter((e) => e.socket !== socket);
    this.release(socket);
  }
}

/* ── Building and reading protocol messages ────────────────────────── */
function msg(type, body) {
  const b = Buffer.alloc(5 + body.length);
  b.write(type, 0, "latin1");
  b.writeInt32BE(4 + body.length, 1);
  body.copy(b, 5);
  return b;
}
const int32 = (n) => {
  const b = Buffer.alloc(4);
  b.writeInt32BE(n, 0);
  return b;
};
const cstr = (s) => Buffer.from(`${s}\0`, "utf8");

function errorResponse(fields) {
  const parts = Object.entries(fields).map(([k, v]) => Buffer.concat([Buffer.from(k, "latin1"), cstr(v)]));
  return msg("E", Buffer.concat([...parts, Buffer.from([0])]));
}

/** Walk a buffer of backend messages; return the status of the last ReadyForQuery. */
function lastReadyStatus(buf) {
  let status = null;
  let i = 0;
  while (i + 5 <= buf.length) {
    const type = String.fromCharCode(buf[i]);
    const len = buf.readInt32BE(i + 1);
    if (type === "Z") status = String.fromCharCode(buf[i + 5]);
    i += 1 + len;
  }
  return status;
}

/** Split frontend bytes into whole messages; returns [messages, rest]. */
function frames(buf) {
  const out = [];
  let i = 0;
  while (i + 5 <= buf.length) {
    const len = buf.readInt32BE(i + 1);
    if (i + 1 + len > buf.length) break;
    out.push(buf.subarray(i, i + 1 + len));
    i += 1 + len;
  }
  return [out, buf.subarray(i)];
}

let backendPid = 1000;

export class LabPgSocket extends EventEmitter {
  /**
   * server: { db, lock, host, port, user, password, database, version } —
   * the lab database (machine.js), or null when the lab has no database.
   */
  constructor(server) {
    super();
    this.server = server;
    this.connecting = false;
    this.readable = true;
    this.writable = true;
    this.destroyed = false;
    this._started = false;
    this._pending = Buffer.alloc(0);
    this._batch = [];
    this._state = "startup";
    this._chain = Promise.resolve();
    this._startup = null;
  }
  setNoDelay() {
    return this;
  }
  setKeepAlive() {
    return this;
  }
  setTimeout() {
    return this;
  }
  ref() {
    return this;
  }
  unref() {
    return this;
  }
  cork() {}
  uncork() {}
  connect(port, host) {
    this.connecting = true;
    const loop = ctx.loop;
    const s = this.server;
    const fail = () => {
      const addr = host === "localhost" || !host ? "127.0.0.1" : host;
      const err = new Error(`connect ECONNREFUSED ${addr}:${port}`);
      Object.assign(err, { errno: -111, code: "ECONNREFUSED", syscall: "connect", address: addr, port: Number(port) });
      this.destroyed = true;
      this.emit("error", err);
      this.emit("close", true);
    };
    const known = (h) => (["localhost", "127.0.0.1", "::1"].includes(h) ? "localhost" : h);
    loop.setImmediate(() => {
      if (s?.outage?.down) return fail(); // a check took the database down
      if (!s || known(String(host || "localhost")) !== known(s.host) || Number(port || 5432) !== Number(s.port)) {
        if (s && !["localhost", "127.0.0.1", "::1"].includes(String(host || "localhost")) && known(String(host)) !== known(s.host)) {
          const err = new Error(`getaddrinfo ENOTFOUND ${host}`);
          Object.assign(err, { errno: -3008, code: "ENOTFOUND", syscall: "getaddrinfo", hostname: host });
          this.destroyed = true;
          this.emit("error", err);
          this.emit("close", true);
          return;
        }
        fail();
        return;
      }
      this.connecting = false;
      this.emit("connect");
    });
    return this;
  }
  write(data, encoding, cb) {
    if (typeof encoding === "function") cb = encoding;
    const chunk = typeof data === "string" ? Buffer.from(data, encoding || "utf8") : Buffer.from(data);
    this._chain = this._chain.then(() => this._receive(chunk)).catch((err) => this._fatal(err));
    if (typeof cb === "function") ctx.loop.setImmediate(cb);
    return true;
  }
  end(data) {
    if (data) this.write(data);
    this._chain = this._chain.then(() => this._close());
    return this;
  }
  destroy(err) {
    if (this.destroyed) return this;
    this._chain = this._chain.then(() => this._close(err));
    return this;
  }
  async _close(err) {
    if (this.destroyed) return;
    this.destroyed = true;
    const s = this.server;
    if (s && s.lock.owner === this) {
      // A connection that goes away mid-transaction: PostgreSQL rolls it back.
      try {
        await s.db.execProtocolRaw(msg("Q", cstr("ROLLBACK")));
      } catch {
        /* the session is reset anyway */
      }
    }
    s?.lock.drop(this);
    ctx.loop?.setImmediate(() => {
      if (err) this.emit("error", err);
      this.emit("end");
      this.emit("close", Boolean(err));
    });
  }
  _push(buf) {
    if (this.destroyed) return;
    this.emit("data", buf);
  }
  _fatal(err) {
    this.emit("error", err);
  }
  async _receive(chunk) {
    if (this.destroyed) return;
    if (this.server?.outage?.down) {
      this._push(errorResponse({ S: "FATAL", V: "FATAL", C: "57P01", M: "terminating connection due to administrator command", R: "ProcessInterrupts" }));
      await this._close();
      return;
    }
    if (this._state === "startup") {
      const len = chunk.readInt32BE(0);
      const code = chunk.readInt32BE(4);
      if (code === 80877103) {
        // SSLRequest: this server does not do TLS (a local development server).
        this._push(Buffer.from("N"));
        if (chunk.length > len) await this._receive(chunk.subarray(len));
        return;
      }
      const fields = chunk.subarray(8, len).toString("utf8").split("\0");
      const params = {};
      for (let i = 0; i + 1 < fields.length; i += 2) if (fields[i]) params[fields[i]] = fields[i + 1];
      this._startup = params;
      this._state = "password";
      this._push(msg("R", int32(3))); // AuthenticationCleartextPassword
      return;
    }
    if (this._state === "password") {
      const [messages] = frames(chunk);
      const pw = messages[0] ? messages[0].subarray(5).toString("utf8").replace(/\0$/, "") : "";
      const s = this.server;
      const user = this._startup.user;
      const database = this._startup.database || user;
      if (user !== s.user || pw !== s.password) {
        this._push(errorResponse({ S: "FATAL", V: "FATAL", C: "28P01", M: `password authentication failed for user "${user}"`, R: "auth_failed" }));
        await this._close();
        return;
      }
      if (database !== s.database) {
        this._push(errorResponse({ S: "FATAL", V: "FATAL", C: "3D000", M: `database "${database}" does not exist`, R: "InitPostgres" }));
        await this._close();
        return;
      }
      const status = (k, v) => msg("S", Buffer.concat([cstr(k), cstr(v)]));
      const key = Buffer.concat([int32(++backendPid), int32(0x5eed)]);
      this._push(
        Buffer.concat([
          msg("R", int32(0)),
          status("application_name", this._startup.application_name || ""),
          status("client_encoding", "UTF8"),
          status("DateStyle", "ISO, MDY"),
          status("default_transaction_read_only", "off"),
          status("in_hot_standby", "off"),
          status("integer_datetimes", "on"),
          status("IntervalStyle", "postgres"),
          status("is_superuser", "off"),
          status("server_encoding", "UTF8"),
          status("server_version", s.version || "18.0"),
          status("session_authorization", user),
          status("standard_conforming_strings", "on"),
          status("TimeZone", "UTC"),
          msg("K", key),
          msg("Z", Buffer.from("I")),
        ])
      );
      this._state = "ready";
      return;
    }
    // Normal operation: gather messages up to a Sync, a simple Query or a Terminate.
    const [messages, rest] = frames(Buffer.concat([this._pending, chunk]));
    this._pending = rest;
    for (const m of messages) {
      const type = String.fromCharCode(m[0]);
      if (type === "X") {
        await this._close();
        return;
      }
      this._batch.push(m);
      if (type === "S" || type === "Q") {
        const batch = Buffer.concat(this._batch);
        this._batch = [];
        await this._run(batch);
      }
    }
  }
  async _run(batch) {
    const s = this.server;
    try {
      await s.lock.acquire(this);
    } catch (err) {
      this._push(errorResponse({ S: "ERROR", V: "ERROR", C: "57014", M: err.message }));
      this._push(msg("Z", Buffer.from("I")));
      return;
    }
    const loop = ctx.loop;
    const out = Buffer.from(await loop.track(s.db.execProtocolRaw(batch)));
    const status = lastReadyStatus(out);
    if (status === "I") s.lock.release(this);
    this._push(out);
  }
}
