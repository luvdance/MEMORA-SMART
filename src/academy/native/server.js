/**
 * THE PRACTICE SERVER AND THE PHONE'S NETWORK
 *
 * A mobile app is half of a system: the other half is a backend. Labs that
 * need one include it as ordinary files (server/index.js), written with a
 * small Express-style framework importable as "practice-server":
 *
 *   import { createServer, tokens, passwords, database } from "practice-server";
 *   const app = createServer();                 // serves https://api.example.com
 *   app.post("/auth/login", (req, res) => { … res.json({ accessToken }) });
 *   export default app;
 *
 * The app reaches it with fetch, exactly as it would reach a real API, so a
 * lesson can show both halves: what the client sends, what the server must
 * check, and what comes back. It runs in the same page, not on the internet,
 * and keeps its data while the app restarts, as a real server would.
 *
 * This module also gives the phone its network: offline mode ("Network
 * request failed", React Native's own message), request cancellation with
 * AbortController, React Native's FormData (file parts are { uri, name,
 * type }), Expo's push service (https://exp.host/--/api/v2/push/send) and
 * WebSocket connections to the server's realtime channels.
 */

import { clock, device, emit, extraPreviews, mediaByUri } from "./phone.js";
import { sha256Hex } from "./expo.js";
import { pageHandlers } from "./expo.js";
import { receivePush } from "./hardware.js";

const servers = [];
export const serverLog = [];
export const requests = [];

/* ── React Native's FormData: file parts are objects, not Blobs ──────── */
export class RNFormData {
  constructor() {
    this._parts = [];
  }
  append(name, value) {
    this._parts.push([String(name), value]);
  }
  set(name, value) {
    this.delete(name);
    this.append(name, value);
  }
  delete(name) {
    this._parts = this._parts.filter(([n]) => n !== name);
  }
  get(name) {
    return this._parts.find(([n]) => n === name)?.[1] ?? null;
  }
  getAll(name) {
    return this._parts.filter(([n]) => n === name).map(([, v]) => v);
  }
  has(name) {
    return this._parts.some(([n]) => n === name);
  }
  getParts() {
    return this._parts.map(([fieldName, value]) =>
      value && typeof value === "object" && value.uri
        ? { fieldName, uri: value.uri, name: value.name, type: value.type, headers: { "content-disposition": `form-data; name="${fieldName}"; filename="${value.name}"` } }
        : { fieldName, string: String(value), headers: { "content-disposition": `form-data; name="${fieldName}"` } }
    );
  }
  entries() {
    return this._parts[Symbol.iterator]();
  }
  [Symbol.iterator]() {
    return this.entries();
  }
}

/* ── Tokens and passwords, as a real backend would make them ─────────── */
const b64url = (s) => btoa(unescape(encodeURIComponent(s))).replace(/=+$/, "").replace(/\+/g, "-").replace(/\//g, "_");
const unb64url = (s) => decodeURIComponent(escape(atob(s.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((s.length + 3) % 4))));
function hmacHex(secret, message) {
  const enc = new TextEncoder();
  let key = enc.encode(secret);
  if (key.length > 64) key = Uint8Array.from(sha256Hex(key).match(/../g).map((h) => parseInt(h, 16)));
  const pad = (byte) => {
    const out = new Uint8Array(64);
    for (let i = 0; i < 64; i++) out[i] = (key[i] || 0) ^ byte;
    return out;
  };
  const cat = (a, b) => {
    const out = new Uint8Array(a.length + b.length);
    out.set(a);
    out.set(b, a.length);
    return out;
  };
  const inner = Uint8Array.from(sha256Hex(cat(pad(0x36), enc.encode(message))).match(/../g).map((h) => parseInt(h, 16)));
  return sha256Hex(cat(pad(0x5c), inner));
}
export const crypto = { hmacSha256: hmacHex, sha256: (s) => sha256Hex(String(s)) };

/** expiresIn as jsonwebtoken reads it: seconds, or a timespan such as "15m", "12h" or "30d". */
function timespanSeconds(value) {
  if (typeof value === "number") return value;
  const m = /^\s*(\d+(?:\.\d+)?)\s*(ms|s|m|h|d|w|y)?\s*$/i.exec(String(value));
  if (!m) throw new Error('"expiresIn" should be a number of seconds or string representing a timespan');
  const unit = { ms: 0.001, s: 1, m: 60, h: 3600, d: 86400, w: 604800, y: 31557600 }[(m[2] || "ms").toLowerCase()];
  return Math.floor(Number(m[1]) * unit);
}

/**
 * JSON Web Tokens (HS256), called like the jsonwebtoken library and with its error messages:
 *   tokens.sign(payload, secret, { expiresIn: "15m" })   tokens.verify(token, secret)
 * (The older form sign(payload, { secret, expiresIn }) also works.)
 */
export const tokens = {
  secret: "practice-server-secret",
  sign(payload, secretOrOptions, options) {
    const opts = typeof secretOrOptions === "string" ? { ...(options || {}), secret: secretOrOptions } : secretOrOptions || {};
    const expiresIn = opts.expiresIn === undefined ? 900 : timespanSeconds(opts.expiresIn);
    const secret = opts.secret;
    const iat = Math.floor(clock.now() / 1000);
    const header = b64url(JSON.stringify({ alg: "HS256", typ: "JWT" }));
    const body = b64url(JSON.stringify({ ...payload, iat, exp: iat + expiresIn }));
    const sig = b64url(hmacHex(secret || tokens.secret, `${header}.${body}`));
    return `${header}.${body}.${sig}`;
  },
  verify(token, secretOrOptions) {
    const secret = typeof secretOrOptions === "string" ? secretOrOptions : secretOrOptions?.secret;
    const parts = String(token || "").split(".");
    if (parts.length !== 3) throw Object.assign(new Error("jwt malformed"), { name: "JsonWebTokenError" });
    const [header, body, sig] = parts;
    if (b64url(hmacHex(secret || tokens.secret, `${header}.${body}`)) !== sig) throw Object.assign(new Error("invalid signature"), { name: "JsonWebTokenError" });
    const payload = JSON.parse(unb64url(body));
    if (payload.exp && Math.floor(clock.now() / 1000) >= payload.exp) throw Object.assign(new Error("jwt expired"), { name: "TokenExpiredError", expiredAt: new Date(payload.exp * 1000) });
    return payload;
  },
  decode(token) {
    try {
      return JSON.parse(unb64url(String(token).split(".")[1]));
    } catch {
      return null;
    }
  },
};
export const passwords = {
  hash(plain) {
    const salt = Math.random().toString(36).slice(2, 10);
    return `sha256$${salt}$${sha256Hex(salt + plain)}`;
  },
  verify(plain, stored) {
    const [, salt, hex] = String(stored).split("$");
    return sha256Hex(salt + plain) === hex;
  },
};

/* ── A server-side SQL database (the same SQLite engine as the phone) ── */
export function database() {
  if (typeof window.__sqlEngine !== "function") throw new Error("This lab's server needs SQLite, but the SQLite engine did not load.");
  const db = new (window.__sqlEngine())();
  const rows = (sql, params = []) => {
    const stmt = db.prepare(sql);
    stmt.bind(params);
    const out = [];
    while (stmt.step()) out.push(stmt.getAsObject());
    stmt.free();
    return out;
  };
  return {
    exec: (sql) => db.exec(sql),
    all: (sql, params) => rows(sql, params),
    get: (sql, params) => rows(sql, params)[0] ?? null,
    run(sql, params = []) {
      db.run(sql, params);
      return { changes: db.getRowsModified(), lastInsertRowId: Number(db.exec("SELECT last_insert_rowid()")[0]?.values[0][0] ?? 0) };
    },
  };
}

/* ── The framework ───────────────────────────────────────────────────── */
function compile(pattern) {
  const keys = [];
  const re = new RegExp(
    "^" + pattern.replace(/\/+$/, "").replace(/:(\w+)/g, (m, k) => (keys.push(k), "([^/]+)")).replace(/\*/g, ".*") + "/?$"
  );
  return (path) => {
    const m = path.match(re);
    if (!m) return null;
    return Object.fromEntries(keys.map((k, i) => [k, decodeURIComponent(m[i + 1])]));
  };
}

export function createServer({ origin = "https://api.example.com", latency = 80 } = {}) {
  const routes = [];
  // Middleware and routes in the order they were added, as Express runs them.
  const layers = [];
  const channels = new Map();
  const onMessage = [];
  const app = {
    origin: origin.replace(/\/$/, ""),
    latency,
    use(fn) {
      layers.push({ fn });
      return app;
    },
    page(pattern, render) {
      const match = compile(pattern);
      pageHandlers.list.push({
        match: (url) => {
          if (!url.startsWith(app.origin)) return null;
          const u = new URL(url);
          const params = match(u.pathname);
          return params ? { params, query: Object.fromEntries(u.searchParams) } : null;
        },
        render: (req) => {
          const page = render(req);
          return { ...page, buttons: (page.buttons || []).map((b) => ({ label: b.label, redirect: b.redirect, run: b.run })) };
        },
      });
      return app;
    },
    /** Send an event to every client subscribed to a realtime channel. */
    publish(channel, payload) {
      for (const ws of channels.get(channel) || []) ws.__deliver(JSON.stringify({ channel, payload }));
    },
    onSocketMessage(fn) {
      onMessage.push(fn);
    },
    __subscribe(channel, ws) {
      if (!channels.has(channel)) channels.set(channel, new Set());
      channels.get(channel).add(ws);
    },
    __unsubscribe(ws) {
      for (const set of channels.values()) set.delete(ws);
    },
    __message(ws, data) {
      for (const fn of onMessage) fn(data, ws);
    },
    async handle(req) {
      const res = response();
      const route = routes.find((r) => (r.method === req.method || r.method === "ALL") && (req.params = r.match(req.path)));
      const stack = [];
      for (const layer of layers) {
        if (layer.fn) stack.push(layer.fn);
        else if (layer.route === route) stack.push(...route.handlers);
      }
      let i = 0;
      const next = async (err) => {
        if (err) throw err;
        const fn = stack[i++];
        if (!fn) {
          if (!res.sent) res.status(404).json({ error: `Cannot ${req.method} ${req.path}` });
          return;
        }
        await fn(req, res, next);
      };
      try {
        await next();
      } catch (err) {
        serverLog.push(`[server] ${err && err.stack ? String(err.stack).split("\n")[0] : err}`);
        console.error(`[server] ${err && err.message ? err.message : err}`);
        if (!res.sent) res.status(500).json({ error: "Internal Server Error" });
      }
      return { ...res.result(), delay: route?.options?.delay };
    },
  };
  for (const method of ["get", "post", "put", "patch", "delete", "all"]) {
    app[method] = (pattern, ...handlers) => {
      const options = handlers.length > 1 && typeof handlers[handlers.length - 1] === "object" ? handlers.pop() : {};
      const route = { method: method.toUpperCase(), match: compile(pattern), handlers, options };
      routes.push(route);
      layers.push({ route });
      return app;
    };
  }
  servers.push(app);
  return app;
}

function response() {
  let status = 200;
  let body = null;
  let sent = false;
  const headers = { "content-type": "application/json" };
  const res = {
    get sent() {
      return sent;
    },
    status(code) {
      status = code;
      return res;
    },
    set(name, value) {
      headers[String(name).toLowerCase()] = String(value);
      return res;
    },
    header(name, value) {
      return res.set(name, value);
    },
    json(value) {
      body = JSON.stringify(value);
      headers["content-type"] = "application/json";
      sent = true;
      return res;
    },
    send(value) {
      body = value == null ? "" : typeof value === "object" ? JSON.stringify(value) : String(value);
      if (typeof value !== "object") headers["content-type"] = "text/plain";
      sent = true;
      return res;
    },
    end() {
      sent = true;
      return res;
    },
    result: () => ({ status, body, headers }),
  };
  return res;
}

/** Middleware: at most `max` requests per client per window, then 429. */
export function rateLimit({ max = 5, windowSeconds = 60 } = {}) {
  const hits = [];
  return (req, res, next) => {
    const now = clock.now();
    while (hits.length && hits[0] <= now - windowSeconds * 1000) hits.shift();
    if (hits.length >= max) {
      res.set("Retry-After", String(Math.ceil((hits[0] + windowSeconds * 1000 - now) / 1000)));
      return res.status(429).json({ error: "Too many requests" });
    }
    hits.push(now);
    return next();
  };
}

/** An uploaded file becomes a URL the app can show, like a storage bucket's. */
export const uploads = new Map();
function storeUpload(part) {
  const media = mediaByUri(part.uri);
  const id = Math.random().toString(36).slice(2, 10);
  const url = `https://cdn.example.com/uploads/${id}-${part.name || "file"}`;
  uploads.set(url, { ...part, size: media ? media.fileSize : 0, preview: media ? media.preview : null });
  if (media) extraPreviews.set(url, media.preview);
  return { url, size: media ? media.fileSize : 0, width: media?.width, height: media?.height };
}

/* ── The phone's fetch ───────────────────────────────────────────────── */
const networkFailed = () => new TypeError("Network request failed");
function abortError() {
  try {
    return new DOMException("Aborted", "AbortError");
  } catch {
    return Object.assign(new Error("Aborted"), { name: "AbortError" });
  }
}

function parseBody(body, headers) {
  if (body == null) return undefined;
  if (body instanceof RNFormData) {
    const fields = {};
    const files = [];
    for (const part of body.getParts()) {
      if (part.uri) files.push({ field: part.fieldName, name: part.name, type: part.type, uri: part.uri, ...storeUpload(part) });
      else fields[part.fieldName] = part.string;
    }
    return { fields, files };
  }
  const text = String(body);
  if (/json/.test(headers["content-type"] || "") || /^[[{]/.test(text.trim())) {
    try {
      return JSON.parse(text);
    } catch {
      return text;
    }
  }
  return text;
}

export function installNetwork() {
  const harnessFetch = window.fetch;
  const calls = window.__labFetchCalls;
  window.FormData = RNFormData;

  window.fetch = function fetch(input, init = {}) {
    const url = String(input && input.url ? input.url : input);
    const method = String(init.method || "GET").toUpperCase();
    const signal = init.signal;
    if (signal && signal.aborted) return Promise.reject(abortError());
    if (!device.online) {
      calls?.push({ url, method, body: init.body ?? null, headers: {}, offline: true });
      return new Promise((_, reject) => setTimeout(() => reject(networkFailed()), 30));
    }
    let headers = {};
    try {
      headers = Object.fromEntries(new Headers(init.headers || {}).entries());
    } catch {
      /* unusual header values */
    }

    // Expo's push service: a server (or the app) sends a push to a device token.
    if (url.startsWith("https://exp.host/--/api/v2/push/send")) {
      calls?.push({ url, method, body: init.body ?? null, headers });
      const msgs = [].concat(JSON.parse(String(init.body || "[]")));
      const data = msgs.map((m) => receivePush(m));
      return Promise.resolve(new Response(JSON.stringify({ data: Array.isArray(JSON.parse(String(init.body || "[]"))) ? data : data[0] }), { status: 200, headers: { "content-type": "application/json" } }));
    }

    const server = servers.find((s) => url.startsWith(s.origin));
    if (server) {
      const u = new URL(url);
      const body = parseBody(init.body, headers);
      calls?.push({ url, method, body: init.body instanceof RNFormData ? body : init.body ?? null, headers });
      const req = { method, url, path: u.pathname, query: Object.fromEntries(u.searchParams), headers, body, params: {}, files: body?.files || [] };
      requests.push({ method, path: u.pathname, headers, body });
      emit("request", req);
      return new Promise((resolve, reject) => {
        let done = false;
        const onAbort = () => {
          if (done) return;
          done = true;
          reject(abortError());
        };
        signal?.addEventListener?.("abort", onAbort);
        server.handle(req).then((r) => {
          setTimeout(() => {
            if (done) return;
            done = true;
            signal?.removeEventListener?.("abort", onAbort);
            if (!device.online) return reject(networkFailed());
            const empty = r.status === 204 || r.status === 304;
            resolve(new Response(empty ? null : r.body ?? "", { status: r.status, headers: r.headers }));
          }, r.delay ?? server.latency);
        });
      });
    }

    // Anything else: the lab's declared mock responses (or no such server).
    return harnessFetch(input, init).catch((err) => {
      throw err instanceof TypeError ? networkFailed() : err;
    });
  };

  /* WebSocket connections to a practice server's realtime channels. */
  class PracticeWebSocket {
    static CONNECTING = 0;
    static OPEN = 1;
    static CLOSING = 2;
    static CLOSED = 3;
    constructor(url) {
      this.url = String(url);
      this.readyState = 0;
      this.onopen = this.onmessage = this.onclose = this.onerror = null;
      this.listeners = { open: [], message: [], close: [], error: [] };
      const http = this.url.replace(/^ws/, "http");
      this.server = servers.find((s) => http.startsWith(s.origin));
      setTimeout(() => {
        if (!this.server || !device.online) {
          this.readyState = 3;
          this.fire("error", { message: "The operation couldn’t be completed. Connection refused" });
          this.fire("close", { code: 1006, reason: "" });
          return;
        }
        const channel = new URL(http).searchParams.get("channel") || new URL(http).pathname.replace(/^\/+/, "");
        this.server.__subscribe(channel, this);
        this.readyState = 1;
        this.fire("open", {});
      }, 40);
    }
    fire(type, event) {
      const e = { type, target: this, ...event };
      this[`on${type}`]?.(e);
      for (const fn of this.listeners[type] || []) fn(e);
    }
    __deliver(data) {
      if (this.readyState === 1) this.fire("message", { data });
    }
    addEventListener(type, fn) {
      (this.listeners[type] = this.listeners[type] || []).push(fn);
    }
    removeEventListener(type, fn) {
      this.listeners[type] = (this.listeners[type] || []).filter((f) => f !== fn);
    }
    send(data) {
      if (this.readyState !== 1) throw new Error("INVALID_STATE_ERR");
      this.server.__message(this, data);
    }
    close() {
      this.readyState = 3;
      this.server?.__unsubscribe(this);
      this.fire("close", { code: 1000, reason: "" });
    }
  }
  window.WebSocket = PracticeWebSocket;
}

export function serverCount() {
  return servers.length;
}
/** The time on the practice phone's clock (advance() in a check moves it): use it for expiry times. */
export const now = () => clock.now();
export const SERVER_LIB = { createServer, tokens, passwords, database, rateLimit, crypto, uploads, now };
