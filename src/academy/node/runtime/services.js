/**
 * SERVICES A BACKEND TALKS TO, INSIDE THE LAB
 *
 * A browser has no TCP, so Redis, WebSocket connections and SMTP cannot be
 * the real network clients. These modules have the real libraries'
 * interfaces (node-redis, ws, nodemailer) and the real servers' behaviour —
 * Redis keys that expire on the lab clock, replies of 'OK' and null,
 * WebSocket frames delivered in order, e-mail accepted by a development
 * mail server (like Mailpit) into the lab's mailbox — so code written here
 * runs unchanged against the real services. The course shows the real
 * services themselves in recorded terminals.
 *
 * argon2 hashes with Argon2id (hash-wasm, the reference algorithm compiled
 * to WebAssembly) and returns node-argon2's exact PHC string format; uuid is
 * the uuid package's API over crypto.randomUUID.
 */
import { argon2id, argon2i, argon2d, argon2Verify } from "hash-wasm";
import EventEmitter from "./events.js";
import { Buffer } from "./buffer.js";
import { ctx } from "./context.js";
import { IncomingMessage, Socket, fillRequest } from "./http.js";

const codeError = (code, message, extra = {}) => Object.assign(new Error(message), { code, ...extra });
const loop = () => ctx.loop;
const later = (fn) => loop().setImmediate(fn);

/* ── argon2 (node-argon2's API) ────────────────────────────────────── */
export const argon2 = {
  argon2d: 0,
  argon2i: 1,
  argon2id: 2,
  async hash(plain, options = {}) {
    const type = options.type ?? 2;
    const salt = options.salt ? Buffer.from(options.salt) : Buffer.from(globalThis.crypto.getRandomValues(new Uint8Array(options.saltLength ?? 16)));
    const params = {
      password: typeof plain === "string" ? plain : Buffer.from(plain),
      salt,
      iterations: options.timeCost ?? 3,
      memorySize: options.memoryCost ?? 65536,
      parallelism: options.parallelism ?? 4,
      hashLength: options.hashLength ?? 32,
      outputType: options.raw ? "binary" : "encoded",
    };
    const fn = type === 0 ? argon2d : type === 1 ? argon2i : argon2id;
    const out = await loop().track(fn(params));
    if (options.raw) return Buffer.from(out);
    // node-argon2 writes its parameters as m=…,p=…,t=…
    return out.replace(/m=(\d+),t=(\d+),p=(\d+)/, "m=$1,p=$3,t=$2");
  },
  async verify(digest, plain) {
    if (typeof digest !== "string" || !digest.startsWith("$argon2")) throw new TypeError("Invalid hash");
    const hash = digest.replace(/m=(\d+),p=(\d+),t=(\d+)/, "m=$1,t=$3,p=$2");
    return loop().track(argon2Verify({ password: typeof plain === "string" ? plain : Buffer.from(plain), hash }));
  },
  needsRehash(digest, options = {}) {
    const m = /\$v=(\d+)\$m=(\d+),p=(\d+),t=(\d+)/.exec(digest);
    if (!m) return true;
    return Number(m[2]) !== (options.memoryCost ?? 65536) || Number(m[4]) !== (options.timeCost ?? 3) || Number(m[3]) !== (options.parallelism ?? 4);
  },
};
argon2.default = argon2;

/* ── uuid ───────────────────────────────────────────────────────────── */
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
export const uuid = {
  v4: () => globalThis.crypto.randomUUID(),
  v7: () => {
    const ms = BigInt(Date.now());
    const rand = globalThis.crypto.getRandomValues(new Uint8Array(10));
    const hex = ms.toString(16).padStart(12, "0") + Array.from(rand, (b) => b.toString(16).padStart(2, "0")).join("");
    return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-7${hex.slice(13, 16)}-${((parseInt(hex[16], 16) & 0x3) | 0x8).toString(16)}${hex.slice(17, 20)}-${hex.slice(20, 32)}`;
  },
  validate: (s) => typeof s === "string" && (UUID_RE.test(s) || s === "00000000-0000-0000-0000-000000000000"),
  version: (s) => parseInt(String(s)[14], 16),
  NIL: "00000000-0000-0000-0000-000000000000",
};
uuid.default = uuid;

/* ── Redis (node-redis's client API, on an in-lab Redis server) ────── */

function redisServer() {
  const m = ctx.machine;
  if (!m.redisData) m.redisData = { strings: new Map(), expires: new Map(), channels: new Map() };
  return m.redisData;
}

function expired(store, key) {
  const at = store.expires.get(key);
  if (at !== undefined && at <= loop().now()) {
    store.strings.delete(key);
    store.expires.delete(key);
    return true;
  }
  return false;
}

function wrongType() {
  return codeError("ERR_REDIS", "WRONGTYPE Operation against a key holding the wrong kind of value");
}

class RedisClient extends EventEmitter {
  constructor(options = {}) {
    super();
    this.options = options;
    const url = new URL(options.url || `redis://${options.socket?.host || "localhost"}:${options.socket?.port || 6379}`);
    this._host = url.hostname;
    this._port = Number(url.port || 6379);
    this.isOpen = false;
    this.isReady = false;
    this._subs = new Map();
  }
  async connect() {
    const m = ctx.machine;
    const conf = m.opts.redis;
    const ok = conf && ["localhost", "127.0.0.1", conf.host || "localhost"].includes(this._host) && this._port === (conf.port || 6379);
    if (!ok) {
      const err = codeError("ECONNREFUSED", `connect ECONNREFUSED 127.0.0.1:${this._port}`, { errno: -111, syscall: "connect", address: "127.0.0.1", port: this._port });
      later(() => this.emit("error", err));
      throw err;
    }
    this.isOpen = true;
    this.isReady = true;
    later(() => {
      this.emit("connect");
      this.emit("ready");
    });
    return this;
  }
  _check() {
    if (!this.isOpen) throw codeError("ClientClosedError", "The client is closed");
  }
  _str(key) {
    const s = redisServer();
    expired(s, key);
    const v = s.strings.get(key);
    if (v !== undefined && typeof v !== "string") throw wrongType();
    return v;
  }
  _value(key, kind, create) {
    const s = redisServer();
    expired(s, key);
    let v = s.strings.get(key);
    if (v === undefined && create) {
      v = kind === "hash" ? new Map() : kind === "list" ? [] : kind === "set" ? new Set() : new Map();
      v.__kind = kind;
      s.strings.set(key, v);
    }
    if (v !== undefined && (typeof v === "string" || v.__kind !== kind)) throw wrongType();
    return v;
  }
  async _do(fn) {
    this._check();
    const r = fn();
    await Promise.resolve();
    return r;
  }
  get(key) {
    return this._do(() => this._str(String(key)) ?? null);
  }
  set(key, value, opts = {}) {
    return this._do(() => {
      const s = redisServer();
      const k = String(key);
      expired(s, k);
      const exists = s.strings.has(k);
      if (opts.NX && exists) return null;
      if (opts.XX && !exists) return null;
      const prev = opts.GET ? this._str(k) ?? null : undefined;
      s.strings.set(k, String(value));
      const ex = opts.EX ?? (opts.expiration?.type === "EX" ? opts.expiration.value : undefined);
      const px = opts.PX ?? (opts.expiration?.type === "PX" ? opts.expiration.value : undefined);
      if (ex !== undefined) s.expires.set(k, loop().now() + Number(ex) * 1000);
      else if (px !== undefined) s.expires.set(k, loop().now() + Number(px));
      else if (!opts.KEEPTTL) s.expires.delete(k);
      return opts.GET ? prev : "OK";
    });
  }
  setEx(key, seconds, value) {
    return this.set(key, value, { EX: seconds });
  }
  setNX(key, value) {
    return this.set(key, value, { NX: true }).then((r) => (r === "OK" ? 1 : 0));
  }
  mGet(keys) {
    return this._do(() => keys.map((k) => this._str(String(k)) ?? null));
  }
  del(...keys) {
    return this._do(() => {
      const s = redisServer();
      let n = 0;
      for (const k of keys.flat()) {
        expired(s, String(k));
        if (s.strings.delete(String(k))) n++;
        s.expires.delete(String(k));
      }
      return n;
    });
  }
  exists(...keys) {
    return this._do(() => keys.flat().filter((k) => !expired(redisServer(), String(k)) && redisServer().strings.has(String(k))).length);
  }
  incrBy(key, by) {
    return this._do(() => {
      const s = redisServer();
      const k = String(key);
      const cur = this._str(k);
      if (cur !== undefined && !/^-?\d+$/.test(cur)) throw codeError("ERR_REDIS", "ERR value is not an integer or out of range");
      const next = (cur === undefined ? 0 : Number(cur)) + Number(by);
      s.strings.set(k, String(next));
      return next;
    });
  }
  incr(key) {
    return this.incrBy(key, 1);
  }
  decr(key) {
    return this.incrBy(key, -1);
  }
  decrBy(key, by) {
    return this.incrBy(key, -by);
  }
  expire(key, seconds) {
    return this._do(() => {
      const s = redisServer();
      const k = String(key);
      if (expired(s, k) || !s.strings.has(k)) return 0;
      s.expires.set(k, loop().now() + Number(seconds) * 1000);
      return 1;
    });
  }
  pExpire(key, ms) {
    return this.expire(key, Number(ms) / 1000);
  }
  ttl(key) {
    return this._do(() => {
      const s = redisServer();
      const k = String(key);
      if (expired(s, k) || !s.strings.has(k)) return -2;
      const at = s.expires.get(k);
      return at === undefined ? -1 : Math.ceil((at - loop().now()) / 1000);
    });
  }
  pTTL(key) {
    return this._do(() => {
      const s = redisServer();
      const k = String(key);
      if (expired(s, k) || !s.strings.has(k)) return -2;
      const at = s.expires.get(k);
      return at === undefined ? -1 : Math.max(0, Math.round(at - loop().now()));
    });
  }
  persist(key) {
    return this._do(() => (redisServer().expires.delete(String(key)) ? 1 : 0));
  }
  keys(pattern = "*") {
    return this._do(() => {
      const s = redisServer();
      const re = new RegExp(`^${String(pattern).replace(/[.+^${}()|[\]\\]/g, "\\$&").replace(/\*/g, ".*").replace(/\?/g, ".")}$`);
      return [...s.strings.keys()].filter((k) => !expired(s, k) && re.test(k)).sort();
    });
  }
  flushAll() {
    return this._do(() => {
      const s = redisServer();
      s.strings.clear();
      s.expires.clear();
      return "OK";
    });
  }
  flushDb() {
    return this.flushAll();
  }
  ping(msg) {
    return this._do(() => msg ?? "PONG");
  }
  hSet(key, field, value) {
    return this._do(() => {
      const h = this._value(String(key), "hash", true);
      const entries = field && typeof field === "object" ? (field instanceof Map ? [...field] : Object.entries(field)) : [[field, value]];
      let added = 0;
      for (const [f, v] of entries) {
        if (!h.has(String(f))) added++;
        h.set(String(f), String(v));
      }
      return added;
    });
  }
  hGet(key, field) {
    return this._do(() => this._value(String(key), "hash")?.get(String(field)) ?? null);
  }
  hGetAll(key) {
    return this._do(() => Object.fromEntries(this._value(String(key), "hash") || []));
  }
  hDel(key, ...fields) {
    return this._do(() => fields.flat().filter((f) => this._value(String(key), "hash")?.delete(String(f))).length);
  }
  hIncrBy(key, field, by) {
    return this._do(() => {
      const h = this._value(String(key), "hash", true);
      const next = Number(h.get(String(field)) || 0) + Number(by);
      h.set(String(field), String(next));
      return next;
    });
  }
  lPush(key, ...values) {
    return this._do(() => {
      const l = this._value(String(key), "list", true);
      for (const v of values.flat()) l.unshift(String(v));
      this._wake(String(key));
      return l.length;
    });
  }
  rPush(key, ...values) {
    return this._do(() => {
      const l = this._value(String(key), "list", true);
      for (const v of values.flat()) l.push(String(v));
      this._wake(String(key));
      return l.length;
    });
  }
  lPop(key) {
    return this._do(() => this._value(String(key), "list")?.shift() ?? null);
  }
  rPop(key) {
    return this._do(() => this._value(String(key), "list")?.pop() ?? null);
  }
  lLen(key) {
    return this._do(() => this._value(String(key), "list")?.length ?? 0);
  }
  lRange(key, start, stop) {
    return this._do(() => {
      const l = this._value(String(key), "list") || [];
      const end = stop < 0 ? l.length + stop : stop;
      return l.slice(start < 0 ? Math.max(0, l.length + start) : start, end + 1);
    });
  }
  _wake(key) {
    const s = redisServer();
    const waiters = s.channels.get(`__list:${key}`);
    if (waiters?.length) later(() => waiters.shift()?.());
  }
  /** BRPOP: wait (on the lab clock) for an item, up to `timeout` seconds (0 = forever). */
  async brPop(key, timeout = 0) {
    this._check();
    const k = String(key);
    const s = redisServer();
    const deadline = timeout ? loop().now() + timeout * 1000 : Infinity;
    for (;;) {
      const l = this._value(k, "list");
      if (l?.length) return { key: k, element: l.pop() };
      if (loop().now() >= deadline) return null;
      await new Promise((resolve) => {
        const list = s.channels.get(`__list:${k}`) || [];
        s.channels.set(`__list:${k}`, list);
        list.push(resolve);
        if (timeout) loop().setTimeout(resolve, Math.max(1, deadline - loop().now()));
      });
    }
  }
  sAdd(key, ...members) {
    return this._do(() => {
      const set = this._value(String(key), "set", true);
      let n = 0;
      for (const m of members.flat()) if (!set.has(String(m))) n++, set.add(String(m));
      return n;
    });
  }
  sRem(key, ...members) {
    return this._do(() => members.flat().filter((m) => this._value(String(key), "set")?.delete(String(m))).length);
  }
  sMembers(key) {
    return this._do(() => [...(this._value(String(key), "set") || [])]);
  }
  sIsMember(key, member) {
    return this._do(() => (this._value(String(key), "set")?.has(String(member)) ? 1 : 0));
  }
  sCard(key) {
    return this._do(() => this._value(String(key), "set")?.size ?? 0);
  }
  zAdd(key, members) {
    return this._do(() => {
      const z = this._value(String(key), "zset", true);
      let n = 0;
      for (const { score, value } of [].concat(members)) {
        if (!z.has(String(value))) n++;
        z.set(String(value), Number(score));
      }
      return n;
    });
  }
  zIncrBy(key, by, member) {
    return this._do(() => {
      const z = this._value(String(key), "zset", true);
      const next = (z.get(String(member)) || 0) + Number(by);
      z.set(String(member), next);
      return next;
    });
  }
  zRangeWithScores(key, start, stop, opts = {}) {
    return this._do(() => {
      const z = [...(this._value(String(key), "zset") || [])].map(([value, score]) => ({ value, score })).sort((a, b) => a.score - b.score || (a.value < b.value ? -1 : 1));
      if (opts.REV) z.reverse();
      const end = stop < 0 ? z.length + stop : stop;
      return z.slice(start, end + 1);
    });
  }
  zRange(key, start, stop, opts) {
    return this.zRangeWithScores(key, start, stop, opts).then((r) => r.map((x) => x.value));
  }
  zScore(key, member) {
    return this._do(() => this._value(String(key), "zset")?.get(String(member)) ?? null);
  }
  async publish(channel, message) {
    this._check();
    const subs = redisServer().channels.get(String(channel)) || [];
    for (const fn of subs) later(() => fn(String(message), String(channel)));
    return subs.length;
  }
  async subscribe(channel, listener) {
    this._check();
    const s = redisServer();
    for (const ch of [].concat(channel)) {
      const list = s.channels.get(String(ch)) || [];
      list.push(listener);
      s.channels.set(String(ch), list);
      this._subs.set(String(ch), listener);
    }
  }
  async unsubscribe(channel) {
    const s = redisServer();
    for (const ch of channel ? [].concat(channel) : [...this._subs.keys()]) {
      const fn = this._subs.get(String(ch));
      s.channels.set(String(ch), (s.channels.get(String(ch)) || []).filter((f) => f !== fn));
      this._subs.delete(String(ch));
    }
  }
  duplicate() {
    return new RedisClient(this.options);
  }
  multi() {
    const queue = [];
    const self = this;
    const proxy = new Proxy(
      {},
      {
        get(_, key) {
          if (key === "exec" || key === "execAsPipeline") return async () => {
            const out = [];
            for (const [k, args] of queue) out.push(await self[k](...args));
            return out;
          };
          return (...args) => {
            queue.push([key, args]);
            return proxy;
          };
        },
      }
    );
    return proxy;
  }
  async quit() {
    await this.unsubscribe();
    this.isOpen = false;
    this.isReady = false;
    later(() => this.emit("end"));
    return "OK";
  }
  close() {
    return this.quit();
  }
  destroy() {
    this.isOpen = false;
    this.isReady = false;
    later(() => this.emit("end"));
  }
  disconnect() {
    return this.quit();
  }
}
for (const name of Object.getOwnPropertyNames(RedisClient.prototype)) {
  if (/^[a-z]/.test(name) && name !== "constructor" && !name.startsWith("_")) {
    RedisClient.prototype[name.toUpperCase()] = RedisClient.prototype[name];
  }
}

export const redis = {
  createClient: (options) => new RedisClient(options),
  RedisClient,
};
redis.default = redis;

/* ── WebSockets (the ws package, and Node's global WebSocket) ──────── */

const OPEN = 1;
const CLOSING = 2;
const CLOSED = 3;

class WsEnd extends EventEmitter {
  constructor() {
    super();
    this.readyState = 0;
    this.peer = null;
    this.protocol = "";
    this.extensions = "";
    this.bufferedAmount = 0;
    this.binaryType = "nodebuffer";
  }
  send(data, opts, cb) {
    if (typeof opts === "function") cb = opts;
    if (this.readyState !== OPEN) {
      const err = new Error(`WebSocket is not open: readyState ${this.readyState} (${["CONNECTING", "OPEN", "CLOSING", "CLOSED"][this.readyState]})`);
      if (cb) later(() => cb(err));
      else throw err;
      return;
    }
    const binary = typeof data !== "string";
    const payload = binary ? Buffer.from(data) : String(data);
    const peer = this.peer;
    later(() => peer?._receive(payload, binary));
    if (cb) later(() => cb());
  }
  close(code = 1005, reason = "") {
    if (this.readyState >= CLOSING) return;
    this.readyState = CLOSING;
    const peer = this.peer;
    later(() => {
      this.readyState = CLOSED;
      this._closed(code, reason);
      if (peer && peer.readyState < CLOSED) {
        peer.readyState = CLOSED;
        peer._closed(code, reason);
      }
    });
  }
  terminate() {
    this.close(1006, "");
  }
  ping() {}
  pong() {}
}

/** The server's side of a connection, as the ws package hands it to 'connection'. */
class ServerSocket extends WsEnd {
  _receive(payload, binary) {
    this.emit("message", typeof payload === "string" ? Buffer.from(payload) : payload, binary);
  }
  _closed(code, reason) {
    this.emit("close", code, Buffer.from(String(reason)));
  }
}
ServerSocket.CONNECTING = 0;
ServerSocket.OPEN = OPEN;
ServerSocket.CLOSING = CLOSING;
ServerSocket.CLOSED = CLOSED;

/** Node's global WebSocket (WHATWG API): onopen, onmessage(event.data), send, close. */
export class WebSocketClient extends WsEnd {
  constructor(url, protocols) {
    super();
    this.url = String(url);
    this.protocols = protocols;
    this.onopen = null;
    this.onmessage = null;
    this.onclose = null;
    this.onerror = null;
    later(() => connectWs(this));
  }
  addEventListener(type, fn) {
    this.on(type, fn);
  }
  removeEventListener(type, fn) {
    this.off(type, fn);
  }
  _fire(type, event) {
    this[`on${type}`]?.(event);
    this.emit(type, event);
  }
  _opened() {
    this.readyState = OPEN;
    this._fire("open", { type: "open" });
  }
  _receive(payload) {
    this._fire("message", { type: "message", data: typeof payload === "string" ? payload : new Blob([payload]) });
  }
  _closed(code, reason) {
    this._fire("close", { type: "close", code, reason: String(reason), wasClean: code !== 1006 });
  }
  _failed(err) {
    this.readyState = CLOSED;
    this._fire("error", { type: "error", error: err, message: err.message });
    this._fire("close", { type: "close", code: 1006, reason: "", wasClean: false });
  }
}
WebSocketClient.CONNECTING = 0;
WebSocketClient.OPEN = OPEN;
WebSocketClient.CLOSING = CLOSING;
WebSocketClient.CLOSED = CLOSED;

/** The ws package's client (EventEmitter API: on('open'), on('message', data)). */
class WsPackageClient extends WebSocketClient {
  _fire(type, event) {
    if (type === "message") this.emit("message", typeof event.data === "string" ? Buffer.from(event.data) : event.data, typeof event.data !== "string");
    else if (type === "close") this.emit("close", event.code, Buffer.from(event.reason || ""));
    else if (type === "error") this.emit("error", event.error);
    else this.emit(type);
    this[`on${type}`]?.(event);
  }
}

function connectWs(client) {
  const m = ctx.machine;
  const u = new URL(client.url);
  const port = Number(u.port || 80);
  const server = m.network.servers.get(port);
  if (!server || !["localhost", "127.0.0.1", "[::1]", "::1"].includes(u.hostname)) {
    const err = codeError("ECONNREFUSED", `connect ECONNREFUSED 127.0.0.1:${port}`);
    client._failed(err);
    return;
  }
  const socket = new Socket({ remoteAddress: "::1", localPort: port });
  const req = new IncomingMessage(socket);
  fillRequest(req, {
    method: "GET",
    url: u.pathname + u.search,
    headers: [["host", u.host], ["connection", "Upgrade"], ["upgrade", "websocket"], ["sec-websocket-version", "13"], ["sec-websocket-key", Buffer.from(globalThis.crypto.getRandomValues(new Uint8Array(16))).toString("base64")]],
  });
  req.upgrade = true;
  socket._labClient = client;
  socket.write = () => true;
  socket.destroy = () => {
    client._failed(codeError("ECONNRESET", "Unexpected server response: 400"));
    return socket;
  };
  if (server.listenerCount("upgrade") === 0) {
    client._failed(codeError("ECONNRESET", "Unexpected server response: 404"));
    return;
  }
  server.emit("upgrade", req, socket, Buffer.alloc(0));
}

class WebSocketServer extends EventEmitter {
  constructor(options = {}, callback) {
    super();
    this.options = options;
    this.clients = new Set();
    this._path = options.path;
    if (options.port !== undefined) {
      const http = ctx.machine.builtin("http");
      this._server = http.createServer((req, res) => {
        res.writeHead(426, { "Content-Type": "text/plain" });
        res.end("Upgrade Required");
      });
      this._server.listen(options.port, callback);
      this._server.on("listening", () => this.emit("listening"));
    } else this._server = options.server || null;
    if (this._server) {
      this._server.on("upgrade", (req, socket, head) => {
        if (this._path && new URL(req.url, "http://x").pathname !== this._path) return;
        this.handleUpgrade(req, socket, head, (ws) => this.emit("connection", ws, req));
      });
    }
  }
  handleUpgrade(req, socket, head, cb) {
    const client = socket._labClient;
    if (!client) return;
    const serverEnd = new ServerSocket();
    serverEnd.peer = client;
    client.peer = serverEnd;
    serverEnd.readyState = OPEN;
    this.clients.add(serverEnd);
    serverEnd.on("close", () => this.clients.delete(serverEnd));
    later(() => {
      cb(serverEnd, req);
      later(() => client._opened());
    });
  }
  address() {
    return this._server?.address();
  }
  close(cb) {
    for (const c of this.clients) c.terminate();
    if (this.options.port !== undefined) this._server?.close();
    if (cb) later(cb);
    later(() => this.emit("close"));
  }
}

export const ws = {
  WebSocketServer,
  Server: WebSocketServer,
  WebSocket: WsPackageClient,
  default: WsPackageClient,
};
Object.assign(WsPackageClient, { WebSocketServer, Server: WebSocketServer, WebSocket: WsPackageClient });

/* ── nodemailer, delivering to the lab's development mail server ───── */

let messageSeq = 0;
function addresses(v) {
  if (!v) return [];
  return [].concat(v).flatMap((x) => (typeof x === "object" ? [x.address] : String(x).split(","))).map((s) => {
    const m = /<([^>]+)>/.exec(s);
    return (m ? m[1] : s).trim();
  }).filter(Boolean);
}

function createTransport(options = {}) {
  const transport = {
    options,
    async sendMail(mail, cb) {
      const m = ctx.machine;
      const run = async () => {
        const id = `<${globalThis.crypto.randomUUID()}@${String(mail.from || "lab").replace(/.*@|>.*/g, "") || "lab.local"}>`;
        const to = [...addresses(mail.to), ...addresses(mail.cc), ...addresses(mail.bcc)];
        const envelope = { from: addresses(mail.from)[0] || "", to };
        if (options.jsonTransport) {
          return { envelope, messageId: id, message: JSON.stringify({ ...mail, messageId: id }) };
        }
        if (options.streamTransport) return { envelope, messageId: id, message: Buffer.from(`Subject: ${mail.subject || ""}\r\n\r\n${mail.text || mail.html || ""}`) };
        const conf = m.opts.mail;
        const host = options.host || "localhost";
        const port = Number(options.port || 587);
        if (!conf || (conf.port || 1025) !== port || !["localhost", "127.0.0.1", conf.host || "localhost"].includes(host)) {
          throw codeError("ESOCKET", `connect ECONNREFUSED 127.0.0.1:${port}`, { command: "CONN" });
        }
        if (!to.length) throw codeError("EENVELOPE", "No recipients defined", { command: "API" });
        await new Promise((r) => loop().setTimeout(r, 20));
        const queued = (++messageSeq).toString(36).toUpperCase().padStart(8, "X");
        m.mailbox.push({ id, from: mail.from, to: addresses(mail.to), cc: addresses(mail.cc), bcc: addresses(mail.bcc), subject: mail.subject || "", text: mail.text || "", html: mail.html || "", headers: mail.headers || {}, attachments: (mail.attachments || []).map((a) => ({ filename: a.filename, contentType: a.contentType })), at: new Date(loop().now()).toISOString() });
        return {
          accepted: to,
          rejected: [],
          ehlo: ["PIPELINING", "8BITMIME", "SMTPUTF8", "AUTH PLAIN LOGIN"],
          envelopeTime: 2,
          messageTime: 3,
          messageSize: Buffer.byteLength(mail.text || mail.html || "") + 400,
          response: `250 2.0.0 Ok: queued as ${queued}`,
          envelope,
          messageId: id,
        };
      };
      const p = loop().track(run());
      if (typeof cb === "function") {
        p.then((info) => cb(null, info), (err) => cb(err));
        return undefined;
      }
      return p;
    },
    async verify() {
      const conf = ctx.machine.opts.mail;
      if (!conf || options.jsonTransport) return true;
      if ((conf.port || 1025) !== Number(options.port || 587)) throw codeError("ESOCKET", `connect ECONNREFUSED 127.0.0.1:${options.port || 587}`, { command: "CONN" });
      return true;
    },
    close() {},
  };
  return transport;
}

export const nodemailer = { createTransport, getTestMessageUrl: () => false };
nodemailer.default = nodemailer;
