/**
 * node:http — servers and requests on the lab machine's network.
 *
 * http.createServer(handler).listen(3000) registers the server on the
 * machine's virtual network (machine.js). A request to localhost:3000 — from
 * fetch, http.get, supertest or a check — becomes an IncomingMessage (a real
 * readable stream of the body) and a ServerResponse, and the server's
 * 'request' listeners run, exactly as in Node. Express runs on top unchanged.
 *
 * What reaches the client is what Node would put on the wire: the status
 * line, the headers in the order they were set, then Date, Connection and
 * Keep-Alive, then Content-Length (or Transfer-Encoding: chunked when the
 * body was written in pieces); no body for HEAD, 204 or 304.
 */
import EventEmitter from "./events.js";
import { Readable, Stream } from "./stream.js";
import { Buffer } from "./buffer.js";
import { ctx } from "./context.js";

export const STATUS_CODES = {
  100: "Continue", 101: "Switching Protocols", 102: "Processing", 103: "Early Hints", 200: "OK", 201: "Created", 202: "Accepted",
  203: "Non-Authoritative Information", 204: "No Content", 205: "Reset Content", 206: "Partial Content", 207: "Multi-Status",
  208: "Already Reported", 226: "IM Used", 300: "Multiple Choices", 301: "Moved Permanently", 302: "Found", 303: "See Other",
  304: "Not Modified", 305: "Use Proxy", 307: "Temporary Redirect", 308: "Permanent Redirect", 400: "Bad Request",
  401: "Unauthorized", 402: "Payment Required", 403: "Forbidden", 404: "Not Found", 405: "Method Not Allowed",
  406: "Not Acceptable", 407: "Proxy Authentication Required", 408: "Request Timeout", 409: "Conflict", 410: "Gone",
  411: "Length Required", 412: "Precondition Failed", 413: "Payload Too Large", 414: "URI Too Long",
  415: "Unsupported Media Type", 416: "Range Not Satisfiable", 417: "Expectation Failed", 418: "I'm a Teapot",
  421: "Misdirected Request", 422: "Unprocessable Entity", 423: "Locked", 424: "Failed Dependency", 425: "Too Early",
  426: "Upgrade Required", 428: "Precondition Required", 429: "Too Many Requests", 431: "Request Header Fields Too Large",
  451: "Unavailable For Legal Reasons", 500: "Internal Server Error", 501: "Not Implemented", 502: "Bad Gateway",
  503: "Service Unavailable", 504: "Gateway Timeout", 505: "HTTP Version Not Supported", 506: "Variant Also Negotiates",
  507: "Insufficient Storage", 508: "Loop Detected", 509: "Bandwidth Limit Exceeded", 510: "Not Extended",
  511: "Network Authentication Required",
};

export const METHODS = [
  "ACL", "BIND", "CHECKOUT", "CONNECT", "COPY", "DELETE", "GET", "HEAD", "LINK", "LOCK", "M-SEARCH", "MERGE", "MKACTIVITY",
  "MKCALENDAR", "MKCOL", "MOVE", "NOTIFY", "OPTIONS", "PATCH", "POST", "PROPFIND", "PROPPATCH", "PURGE", "PUT", "QUERY",
  "REBIND", "REPORT", "SEARCH", "SOURCE", "SUBSCRIBE", "TRACE", "UNBIND", "UNLINK", "UNLOCK", "UNSUBSCRIBE",
];

export const maxHeaderSize = 16384;

function codeError(code, message, Type = Error) {
  const err = new Type(message);
  err.code = code;
  return err;
}

const TOKEN = /^[\^_`a-zA-Z\-0-9!#$%&'*+.|~]+$/;
const BAD_VALUE = /[^\t\x20-\x7e\x80-\xff]/;

export function validateHeaderName(name) {
  if (typeof name !== "string" || !name || !TOKEN.test(name)) {
    throw codeError("ERR_INVALID_HTTP_TOKEN", `Header name must be a valid HTTP token ["${name}"]`, TypeError);
  }
}
export function validateHeaderValue(name, value) {
  if (value === undefined) throw codeError("ERR_HTTP_INVALID_HEADER_VALUE", `Invalid value "${value}" for header "${name}"`, TypeError);
  const values = Array.isArray(value) ? value : [value];
  if (values.some((v) => BAD_VALUE.test(String(v)))) throw codeError("ERR_INVALID_CHAR", `Invalid character in header content ["${name}"]`, TypeError);
}

/* ── The socket a request arrives on ───────────────────────────────── */

let portSeq = 50000;
export class Socket extends EventEmitter {
  constructor({ remoteAddress = "::1", localPort = 3000, encrypted } = {}) {
    super();
    this.remoteAddress = remoteAddress;
    this.remoteFamily = remoteAddress.includes(":") ? "IPv6" : "IPv4";
    this.remotePort = ++portSeq;
    this.localAddress = remoteAddress;
    this.localPort = localPort;
    if (encrypted) this.encrypted = true;
    this.readable = true;
    this.writable = true;
    this.destroyed = false;
    this.bytesRead = 0;
    this.bytesWritten = 0;
  }
  setTimeout() { return this; }
  setNoDelay() { return this; }
  setKeepAlive() { return this; }
  address() { return { address: this.localAddress, family: this.remoteFamily, port: this.localPort }; }
  ref() { return this; }
  unref() { return this; }
  pause() { return this; }
  resume() { return this; }
  cork() {}
  uncork() {}
  write() { return true; }
  end() {
    this.writable = false;
    return this;
  }
  destroy(err) {
    if (this.destroyed) return this;
    this.destroyed = true;
    this.readable = false;
    this.writable = false;
    if (err) this.emit("error", err);
    this.emit("close", Boolean(err));
    return this;
  }
}

/* ── IncomingMessage: the request a server receives (a readable stream) ── */

export class IncomingMessage extends Readable {
  constructor(socket) {
    super();
    this.socket = socket;
    this.httpVersionMajor = 1;
    this.httpVersionMinor = 1;
    this.httpVersion = "1.1";
    this.complete = false;
    this.rawHeaders = [];
    this.rawTrailers = [];
    this.headers = {};
    this.trailers = {};
    this.aborted = false;
    this.upgrade = false;
    this.url = "";
    this.method = null;
    this.statusCode = null;
    this.statusMessage = null;
    this._body = null;
  }
  get connection() {
    return this.socket;
  }
  get headersDistinct() {
    const out = Object.create(null);
    for (let i = 0; i < this.rawHeaders.length; i += 2) (out[this.rawHeaders[i].toLowerCase()] ||= []).push(this.rawHeaders[i + 1]);
    return out;
  }
  setTimeout(ms, cb) {
    if (cb) this.on("timeout", cb);
    return this;
  }
  _read() {
    if (this._fed) return;
    this._fed = true;
    const body = this._body;
    const loop = ctx.loop;
    const feed = () => {
      if (body && body.length) this.push(body);
      this.complete = true;
      this.push(null);
    };
    if (loop) loop.setImmediate(feed);
    else queueMicrotask(feed);
  }
}

/** Node's rules for repeated request headers: most are joined with ", ", set-cookie stays a list. */
function addHeader(headers, name, value) {
  const key = name.toLowerCase();
  if (key === "set-cookie") (headers[key] ||= []).push(value);
  else if (headers[key] === undefined) headers[key] = value;
  else if (["content-type", "content-length", "user-agent", "referer", "host", "authorization", "proxy-authorization", "if-modified-since", "if-unmodified-since", "from", "location", "max-forwards", "retry-after", "etag", "last-modified", "server", "age", "expires"].includes(key)) {
    /* duplicates of these are discarded */
  } else if (key === "cookie") headers[key] += `; ${value}`;
  else headers[key] += `, ${value}`;
}

export function fillRequest(req, { method, url, headers }) {
  req.method = String(method || "GET").toUpperCase();
  req.url = url;
  const list = Array.isArray(headers) ? headers : Object.entries(headers || {});
  for (const [name, value] of list) {
    for (const v of Array.isArray(value) ? value : [value]) {
      req.rawHeaders.push(name, String(v));
      addHeader(req.headers, name, String(v));
    }
  }
}

/* ── OutgoingMessage / ServerResponse ──────────────────────────────── */

export class OutgoingMessage extends Stream {
  constructor() {
    super();
    this._headers = new Map(); // lower → [name, value]
    this._header = null;
    this.headersSent = false;
    this.sendDate = false;
    this.finished = false;
    this.writableEnded = false;
    this.writableFinished = false;
    this.writable = true;
    this.destroyed = false;
    this.chunkedEncoding = false;
    this._chunks = [];
    this._wroteBody = false;
  }
  setHeader(name, value) {
    if (this._header) throw codeError("ERR_HTTP_HEADERS_SENT", "Cannot set headers after they are sent to the client");
    validateHeaderName(name);
    validateHeaderValue(name, value);
    this._headers.set(name.toLowerCase(), [name, value]);
    return this;
  }
  setHeaders(headers) {
    const entries = headers instanceof Map || (typeof Headers !== "undefined" && headers instanceof Headers) ? [...headers.entries()] : Object.entries(headers);
    for (const [k, v] of entries) this.setHeader(k, v);
    return this;
  }
  appendHeader(name, value) {
    const cur = this.getHeader(name);
    if (cur === undefined) return this.setHeader(name, value);
    return this.setHeader(name, [].concat(cur, value));
  }
  getHeader(name) {
    return this._headers.get(String(name).toLowerCase())?.[1];
  }
  getHeaders() {
    const out = Object.create(null);
    for (const [key, [, v]] of this._headers) out[key] = v;
    return out;
  }
  getHeaderNames() {
    return [...this._headers.keys()];
  }
  getRawHeaderNames() {
    return [...this._headers.values()].map(([n]) => n);
  }
  hasHeader(name) {
    return this._headers.has(String(name).toLowerCase());
  }
  removeHeader(name) {
    if (this._header) throw codeError("ERR_HTTP_HEADERS_SENT", "Cannot remove headers after they are sent to the client");
    this._headers.delete(String(name).toLowerCase());
  }
  flushHeaders() {
    if (!this._header) this._implicitHeader();
  }
  cork() {}
  uncork() {}
  setTimeout(ms, cb) {
    if (cb) this.on("timeout", cb);
    return this;
  }
  destroy(err) {
    if (this.destroyed) return this;
    this.destroyed = true;
    this.socket?.destroy(err);
    return this;
  }
}

export class ServerResponse extends OutgoingMessage {
  constructor(req, options = {}) {
    super();
    this.req = req;
    this.socket = req?.socket || null;
    this.statusCode = 200;
    this.statusMessage = undefined;
    this.sendDate = true;
    this._head = req?.method === "HEAD";
    this._deliver = options.deliver || null;
    this.strictContentLength = false;
  }
  get connection() {
    return this.socket;
  }
  assignSocket(socket) {
    this.socket = socket;
  }
  detachSocket() {}
  writeContinue() {}
  writeProcessing() {}
  writeEarlyHints() {}
  _implicitHeader() {
    this.writeHead(this.statusCode);
  }
  writeHead(statusCode, reason, obj) {
    if (this._header) throw codeError("ERR_HTTP_HEADERS_SENT", "Cannot write headers after they are sent to the client");
    const code = statusCode | 0;
    if (code < 100 || code > 999) throw codeError("ERR_HTTP_INVALID_STATUS_CODE", `Invalid status code: ${statusCode}`, RangeError);
    if (typeof reason === "string") this.statusMessage = reason;
    else {
      obj = reason;
      this.statusMessage ||= STATUS_CODES[code] || "unknown";
    }
    this.statusCode = code;
    if (obj) {
      if (Array.isArray(obj)) {
        for (let i = 0; i < obj.length; i += 2) this.appendHeader(obj[i], obj[i + 1]);
      } else for (const [k, v] of Object.entries(obj)) if (v !== undefined) this.setHeader(k, v);
    }
    this._header = true;
    this.headersSent = true;
    return this;
  }
  /** The final header list, in wire order, with what Node adds itself. */
  _wireHeaders(bodyLength, chunked) {
    const list = [];
    for (const [, [name, value]] of this._headers) {
      for (const v of Array.isArray(value) ? value : [value]) list.push([name, String(v)]);
    }
    const has = (n) => this._headers.has(n);
    if (this.sendDate && !has("date")) list.push(["Date", new Date().toUTCString()]);
    if (!has("connection")) list.push(["Connection", "keep-alive"]);
    if (!has("keep-alive")) list.push(["Keep-Alive", "timeout=5"]);
    // A HEAD response, 204, 304 and 1xx have no body: Node adds no framing header of its own.
    const noBody = this._head || this.statusCode === 204 || this.statusCode === 304 || (this.statusCode >= 100 && this.statusCode < 200);
    if (!has("content-length") && !has("transfer-encoding") && !noBody) {
      if (chunked) list.push(["Transfer-Encoding", "chunked"]);
      else if (bodyLength !== null) list.push(["Content-Length", String(bodyLength)]);
    }
    return list;
  }
  write(chunk, encoding, cb) {
    if (typeof encoding === "function") {
      cb = encoding;
      encoding = undefined;
    }
    if (this.writableEnded) {
      const err = codeError("ERR_STREAM_WRITE_AFTER_END", "write after end");
      ctx.loop?.setImmediate(() => {
        if (cb) cb(err);
        this.emit("error", err);
      });
      return false;
    }
    if (chunk === undefined || chunk === null) {
      throw codeError("ERR_STREAM_NULL_VALUES", "May not write null values to stream", TypeError);
    }
    if (!this._header) {
      this._implicitHeader();
      if (!this._headers.has("content-length")) this.chunkedEncoding = true;
    }
    const buf = typeof chunk === "string" ? Buffer.from(chunk, encoding || "utf8") : Buffer.from(chunk);
    if (buf.length) this._chunks.push(buf);
    this._wroteBody = true;
    if (cb) ctx.loop?.setImmediate(cb);
    return true;
  }
  end(chunk, encoding, cb) {
    if (typeof chunk === "function") {
      cb = chunk;
      chunk = undefined;
    } else if (typeof encoding === "function") {
      cb = encoding;
      encoding = undefined;
    }
    if (this.writableEnded) {
      if (cb) ctx.loop?.setImmediate(cb);
      return this;
    }
    let lengthKnown = null;
    // Node fixes the framing when the headers are stored: after an explicit
    // writeHead() with no Content-Length, the body is sent chunked.
    if (this._header && !this._wroteBody && !this._headers.has("content-length")) this.chunkedEncoding = true;
    if (!this._header) {
      const buf = chunk === undefined || chunk === null ? Buffer.alloc(0) : typeof chunk === "string" ? Buffer.from(chunk, encoding || "utf8") : Buffer.from(chunk);
      if (buf.length) this._chunks.push(buf);
      lengthKnown = buf.length;
      this._implicitHeader();
    } else if (chunk !== undefined && chunk !== null) {
      this._chunks.push(typeof chunk === "string" ? Buffer.from(chunk, encoding || "utf8") : Buffer.from(chunk));
    }
    this.writableEnded = true;
    this.finished = true;
    this.writable = false;
    const body = Buffer.concat(this._chunks);
    const noBody = this._head || this.statusCode === 204 || this.statusCode === 304;
    const response = {
      status: this.statusCode,
      statusText: this.statusMessage || STATUS_CODES[this.statusCode] || "",
      headers: this._wireHeaders(lengthKnown, this.chunkedEncoding),
      body: noBody ? Buffer.alloc(0) : body,
    };
    const loop = ctx.loop;
    const finish = () => {
      this.writableFinished = true;
      this.emit("prefinish");
      this.emit("finish");
      if (cb) cb();
      this._deliver?.(response);
      const close = () => {
        this.emit("close");
        if (this.req && !this.req.destroyed) this.req.emit("close");
      };
      if (loop) loop.setImmediate(close);
      else queueMicrotask(close);
    };
    if (loop) queueMicrotask(finish);
    else queueMicrotask(finish);
    return this;
  }
  addTrailers() {}
}

/* ── Server ─────────────────────────────────────────────────────────── */

export class Server extends EventEmitter {
  constructor(options, listener) {
    super();
    if (typeof options === "function") {
      listener = options;
      options = {};
    }
    this.options = options || {};
    if (listener) this.on("request", listener);
    this.listening = false;
    this._port = null;
    this._inflight = 0;
    this._closing = false;
    this._ref = true;
    this.timeout = 0;
    this.keepAliveTimeout = 5000;
    this.headersTimeout = 60000;
    this.requestTimeout = 300000;
    this.maxHeadersCount = null;
    this.maxRequestsPerSocket = 0;
    this.maxConnections = undefined;
  }
  listen(...args) {
    let port;
    let host;
    let cb = typeof args[args.length - 1] === "function" ? args.pop() : null;
    if (args[0] && typeof args[0] === "object") {
      port = args[0].port;
      host = args[0].host;
    } else {
      [port, host] = args;
    }
    if (cb) this.once("listening", cb);
    const machine = ctx.machine;
    const n = port === undefined || port === null || port === "" ? 0 : Number(port);
    if (!Number.isInteger(n) || n < 0 || n > 65535) {
      throw codeError("ERR_SOCKET_BAD_PORT", `options.port should be >= 0 and < 65536. Received type ${typeof port} (${typeof port === "string" ? `'${port}'` : port}).`, RangeError);
    }
    this._host = host;
    machine.network.listen(this, n);
    return this;
  }
  address() {
    if (!this.listening) return null;
    return { address: this._host && this._host !== "0.0.0.0" ? this._host : "::", family: this._host && this._host.includes(".") ? "IPv4" : "IPv6", port: this._port };
  }
  close(cb) {
    const machine = ctx.machine;
    if (!this.listening) {
      if (cb) machine.loop.setImmediate(cb, codeError("ERR_SERVER_NOT_RUNNING", "Server is not running."));
      return this;
    }
    machine.network.unlisten(this);
    this.listening = false;
    this._closing = true;
    if (cb) this.once("close", cb);
    this._maybeClosed();
    return this;
  }
  _maybeClosed() {
    if (this._closing && this._inflight === 0) {
      this._closing = false;
      ctx.loop?.setImmediate(() => this.emit("close"));
    }
  }
  closeAllConnections() {}
  closeIdleConnections() {}
  getConnections(cb) {
    ctx.loop.setImmediate(cb, null, this._inflight);
  }
  setTimeout(ms, cb) {
    this.timeout = ms;
    if (cb) this.on("timeout", cb);
    return this;
  }
  ref() {
    this._ref = true;
    return this;
  }
  unref() {
    this._ref = false;
    return this;
  }
  [Symbol.asyncDispose]() {
    return new Promise((resolve) => this.close(() => resolve()));
  }
}

export function createServer(options, listener) {
  return new Server(options, listener);
}

/* ── Client: http.request / http.get over the machine's network ───── */

export class ClientRequest extends Stream {
  constructor(input, options, cb, scheme = "http:") {
    super();
    if (typeof options === "function") {
      cb = options;
      options = {};
    }
    let url;
    if (typeof input === "string" || input instanceof URL) {
      url = new URL(String(input));
      options = { ...options };
    } else {
      options = { ...input, ...options };
      const host = options.hostname || options.host || "localhost";
      url = new URL(`${options.protocol || scheme}//${host.includes(":") && !host.startsWith("[") ? `[${host}]` : host}${options.port ? `:${options.port}` : ""}${options.path || "/"}`);
    }
    this.method = String(options.method || "GET").toUpperCase();
    this.path = url.pathname + url.search;
    this.host = url.hostname;
    this.protocol = url.protocol;
    this._url = url;
    this._headers = new Map();
    for (const [k, v] of Object.entries(options.headers || {})) this._headers.set(k.toLowerCase(), [k, v]);
    this._chunks = [];
    this._timeout = options.timeout;
    this._signal = options.signal;
    this.writable = true;
    this.finished = false;
    this.aborted = false;
    this.destroyed = false;
    if (cb) this.once("response", cb);
  }
  setHeader(name, value) {
    this._headers.set(name.toLowerCase(), [name, value]);
  }
  getHeader(name) {
    return this._headers.get(name.toLowerCase())?.[1];
  }
  removeHeader(name) {
    this._headers.delete(name.toLowerCase());
  }
  setTimeout(ms, cb) {
    this._timeout = ms;
    if (cb) this.once("timeout", cb);
    return this;
  }
  write(chunk, encoding) {
    this._chunks.push(typeof chunk === "string" ? Buffer.from(chunk, encoding || "utf8") : Buffer.from(chunk));
    return true;
  }
  destroy(err) {
    if (this.destroyed) return this;
    this.destroyed = true;
    this.aborted = true;
    if (err) ctx.loop.setImmediate(() => this.emit("error", err));
    ctx.loop.setImmediate(() => this.emit("close"));
    return this;
  }
  abort() {
    this.destroy();
  }
  end(chunk, encoding, cb) {
    if (typeof chunk === "function") {
      cb = chunk;
      chunk = undefined;
    }
    if (chunk !== undefined && chunk !== null) this.write(chunk, encoding);
    this.finished = true;
    const machine = ctx.machine;
    const headers = [...this._headers.values()].map(([k, v]) => [k, String(v)]);
    const body = this._chunks.length ? Buffer.concat(this._chunks) : null;
    if (body && !this._headers.has("content-length")) headers.push(["Content-Length", String(body.length)]);
    if (!this._headers.has("host")) headers.unshift(["Host", this._url.host]);
    let timer = null;
    if (this._timeout) {
      timer = machine.loop.setTimeout(() => this.emit("timeout"), this._timeout);
    }
    machine.network
      .send({ url: this._url.href, method: this.method, headers, body })
      .then((r) => {
        if (timer) machine.loop.clear(timer);
        if (this.destroyed) return;
        const res = new IncomingMessage(new Socket({ remoteAddress: "127.0.0.1" }));
        res.statusCode = r.status;
        res.statusMessage = r.statusText;
        for (const [k, v] of r.headers) {
          res.rawHeaders.push(k, v);
          addHeader(res.headers, k, v);
        }
        res._body = r.body;
        this.res = res;
        this.emit("response", res);
        if (this.listenerCount("response") === 0) res.resume();
      })
      .catch((err) => {
        if (timer) machine.loop.clear(timer);
        if (!this.destroyed) this.emit("error", err);
      });
    if (cb) machine.loop.setImmediate(cb);
    return this;
  }
}

export function request(input, options, cb) {
  return new ClientRequest(input, options, cb, "http:");
}
export function get(input, options, cb) {
  const req = request(input, options, cb);
  req.end();
  return req;
}

export class Agent extends EventEmitter {
  constructor(options = {}) {
    super();
    this.options = options;
    this.keepAlive = Boolean(options.keepAlive);
    this.maxSockets = options.maxSockets ?? Infinity;
    this.sockets = {};
    this.freeSockets = {};
    this.requests = {};
  }
  destroy() {}
}
export const globalAgent = new Agent({ keepAlive: true });

const http = {
  STATUS_CODES, METHODS, maxHeaderSize, validateHeaderName, validateHeaderValue,
  IncomingMessage, OutgoingMessage, ServerResponse, Server, createServer, ClientRequest, request, get, Agent, globalAgent,
};
export default http;

/* ── node:https — the same server and client, with https: URLs ─────── */
export const https = {
  ...http,
  createServer: (options, listener) => new Server(options, listener),
  request: (input, options, cb) => new ClientRequest(input, options, cb, "https:"),
  get: (input, options, cb) => {
    const req = new ClientRequest(input, options, cb, "https:");
    req.end();
    return req;
  },
  globalAgent: new Agent({ keepAlive: true }),
};
