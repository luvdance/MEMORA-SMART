/**
 * node:fs — the lab machine's disk, in memory.
 *
 * The project's files (server.js, package.json, data/notes.json …) live here
 * at /app, as on a Linux server. Reads and writes behave as Node's do,
 * including their errors: reading a missing file throws
 * "ENOENT: no such file or directory, open '/app/data/notes.json'" with
 * code, errno, syscall and path, so error handling written here works on a
 * real server unchanged. The sync, callback and promise APIs share one
 * volume; streams (createReadStream / createWriteStream) are real streams,
 * which is what express.static, res.sendFile and multer use.
 */
import { Buffer } from "./buffer.js";
import { Readable, Writable } from "./stream.js";
import pathMod from "./path.js";
import { ctx } from "./context.js";

const ERRNO = { ENOENT: -2, EISDIR: -21, EEXIST: -17, ENOTDIR: -20, ENOTEMPTY: -39, EACCES: -13, EBADF: -9, EINVAL: -22 };
const TEXT = {
  ENOENT: "no such file or directory",
  EISDIR: "illegal operation on a directory",
  EEXIST: "file already exists",
  ENOTDIR: "not a directory",
  ENOTEMPTY: "directory not empty",
  EACCES: "permission denied",
  EBADF: "bad file descriptor",
  EINVAL: "invalid argument",
};

export function fsError(code, syscall, path, dest) {
  const where = path === undefined ? "" : ` '${path}'${dest ? ` -> '${dest}'` : ""}`;
  const err = new Error(`${code}: ${TEXT[code]}, ${syscall}${where}`);
  err.errno = ERRNO[code];
  err.code = code;
  err.syscall = syscall;
  if (path !== undefined) err.path = path;
  if (dest !== undefined) err.dest = dest;
  return err;
}

/* ── The volume ─────────────────────────────────────────────────────── */

export class Volume {
  constructor(now = () => Date.now()) {
    this.now = now;
    this.nodes = new Map(); // abs path → { type: "file"|"dir", data?: Buffer, mtime, birthtime, mode }
    this.mkdirp("/");
  }
  /** Seed files: { "server.js": "…", "data/notes.json": "…" } under `root`. */
  load(files, root = "/app") {
    this.mkdirp(root);
    for (const [name, content] of Object.entries(files || {})) {
      const abs = pathMod.resolve(root, name);
      this.mkdirp(pathMod.dirname(abs));
      this.write(abs, content);
    }
  }
  node(p) {
    return this.nodes.get(p);
  }
  mkdirp(p) {
    const parts = p.split("/").filter(Boolean);
    let cur = "";
    if (!this.nodes.has("/")) this.nodes.set("/", { type: "dir", mtime: this.now(), birthtime: this.now(), mode: 0o40755 });
    for (const part of parts) {
      cur += "/" + part;
      const n = this.nodes.get(cur);
      if (!n) this.nodes.set(cur, { type: "dir", mtime: this.now(), birthtime: this.now(), mode: 0o40755 });
    }
  }
  write(p, content) {
    const data = typeof content === "string" ? Buffer.from(content, "utf8") : Buffer.from(content);
    const prev = this.nodes.get(p);
    this.nodes.set(p, { type: "file", data, mtime: this.now(), birthtime: prev?.birthtime || this.now(), mode: prev?.mode || 0o100644 });
  }
  children(p) {
    const prefix = p === "/" ? "/" : p + "/";
    const out = [];
    for (const key of this.nodes.keys()) {
      if (key !== p && key.startsWith(prefix) && !key.slice(prefix.length).includes("/")) out.push(key.slice(prefix.length));
    }
    return out.sort();
  }
  /** Every file as { relative path: text } (for checks and the editor). */
  snapshot(root = "/app") {
    const out = {};
    for (const [key, n] of this.nodes) {
      if (n.type === "file" && key.startsWith(root + "/")) out[key.slice(root.length + 1)] = n.data.toString("utf8");
    }
    return out;
  }
}

const vol = () => {
  if (!ctx.vol) throw new Error("No lab machine is running");
  return ctx.vol;
};
const cwd = () => ctx.machine?.cwd || "/app";

function toPath(p) {
  if (p instanceof URL) p = decodeURIComponent(p.pathname);
  if (Buffer.isBuffer(p)) p = p.toString();
  if (typeof p !== "string") {
    const err = new TypeError(`The "path" argument must be of type string or an instance of Buffer or URL. Received ${p === undefined ? "undefined" : typeof p}`);
    err.code = "ERR_INVALID_ARG_TYPE";
    throw err;
  }
  return p;
}
const abs = (p) => pathMod.resolve(cwd(), toPath(p));

function encodingOf(options) {
  if (typeof options === "string") return options;
  return options?.encoding ?? null;
}

class Stats {
  constructor(n) {
    const t = (v) => new Date(v);
    this.dev = 2049;
    this.mode = n.mode;
    this.nlink = 1;
    this.uid = 1000;
    this.gid = 1000;
    this.rdev = 0;
    this.blksize = 4096;
    this.ino = 0;
    this.size = n.type === "file" ? n.data.length : 4096;
    this.blocks = Math.ceil(this.size / 512);
    this.atimeMs = n.mtime;
    this.mtimeMs = n.mtime;
    this.ctimeMs = n.mtime;
    this.birthtimeMs = n.birthtime;
    this.atime = t(n.mtime);
    this.mtime = t(n.mtime);
    this.ctime = t(n.mtime);
    this.birthtime = t(n.birthtime);
    Object.defineProperty(this, "_type", { value: n.type });
  }
  isFile() { return this._type === "file"; }
  isDirectory() { return this._type === "dir"; }
  isSymbolicLink() { return false; }
  isFIFO() { return false; }
  isSocket() { return false; }
  isBlockDevice() { return false; }
  isCharacterDevice() { return false; }
}

class Dirent {
  constructor(name, n, parentPath) {
    this.name = name;
    this.parentPath = parentPath;
    this.path = parentPath;
    Object.defineProperty(this, "_type", { value: n.type });
  }
  isFile() { return this._type === "file"; }
  isDirectory() { return this._type === "dir"; }
  isSymbolicLink() { return false; }
}

function checkParent(p, syscall) {
  const parent = vol().node(pathMod.dirname(p));
  if (!parent) throw fsError("ENOENT", syscall, p);
  if (parent.type !== "dir") throw fsError("ENOTDIR", syscall, p);
}

/* ── Synchronous API ───────────────────────────────────────────────── */

export function existsSync(p) {
  try {
    return vol().nodes.has(abs(p));
  } catch {
    return false;
  }
}

export function readFileSync(p, options) {
  if (typeof p === "number") throw fsError("EBADF", "read");
  const a = abs(p);
  const n = vol().node(a);
  if (!n) throw fsError("ENOENT", "open", a);
  if (n.type === "dir") throw fsError("EISDIR", "read");
  const enc = encodingOf(options);
  const copy = Buffer.from(n.data);
  return enc ? copy.toString(enc) : copy;
}

function writeImpl(p, data, options, append, syscall = "open") {
  const a = abs(p);
  const existing = vol().node(a);
  if (existing?.type === "dir") throw fsError("EISDIR", syscall, a);
  checkParent(a, syscall);
  const flag = typeof options === "object" && options ? options.flag : undefined;
  if (flag === "wx" && existing) throw fsError("EEXIST", syscall, a);
  const enc = encodingOf(options) || "utf8";
  let buf;
  if (typeof data === "string") buf = Buffer.from(data, enc);
  else if (ArrayBuffer.isView(data)) buf = Buffer.from(data.buffer, data.byteOffset, data.byteLength);
  else {
    const err = new TypeError(`The "data" argument must be of type string or an instance of Buffer, TypedArray, or DataView. Received ${data === null ? "null" : typeof data === "object" ? "an instance of " + (data.constructor?.name || "Object") : `type ${typeof data} (${String(data)})`}`);
    err.code = "ERR_INVALID_ARG_TYPE";
    throw err;
  }
  const next = append || flag === "a" ? Buffer.concat([existing?.data || Buffer.alloc(0), buf]) : buf;
  vol().write(a, next);
}

export function writeFileSync(p, data, options) {
  writeImpl(p, data, options, false);
}
export function appendFileSync(p, data, options) {
  writeImpl(p, data, options, true);
}

export function mkdirSync(p, options) {
  const a = abs(p);
  const recursive = typeof options === "object" && options?.recursive;
  const v = vol();
  if (v.node(a)) {
    if (recursive && v.node(a).type === "dir") return undefined;
    throw fsError("EEXIST", "mkdir", a);
  }
  if (recursive) {
    let first = a;
    let cur = a;
    while (cur !== "/" && !v.node(cur)) {
      first = cur;
      cur = pathMod.dirname(cur);
    }
    if (v.node(cur)?.type !== "dir") throw fsError("ENOTDIR", "mkdir", a);
    v.mkdirp(a);
    return first;
  }
  checkParent(a, "mkdir");
  v.mkdirp(a);
  return undefined;
}

export function readdirSync(p, options) {
  const a = abs(p);
  const n = vol().node(a);
  if (!n) throw fsError("ENOENT", "scandir", a);
  if (n.type !== "dir") throw fsError("ENOTDIR", "scandir", a);
  const names = vol().children(a);
  if (options?.withFileTypes) return names.map((name) => new Dirent(name, vol().node(pathMod.join(a, name)), a));
  if (options?.recursive) {
    const out = [];
    const walk = (dir, rel) => {
      for (const name of vol().children(dir)) {
        const r = rel ? `${rel}/${name}` : name;
        out.push(r);
        if (vol().node(pathMod.join(dir, name)).type === "dir") walk(pathMod.join(dir, name), r);
      }
    };
    walk(a, "");
    return out;
  }
  return names;
}

export function statSync(p, options) {
  const a = abs(p);
  const n = vol().node(a);
  if (!n) {
    if (options?.throwIfNoEntry === false) return undefined;
    throw fsError("ENOENT", "stat", a);
  }
  return new Stats(n);
}
export const lstatSync = statSync;

export function unlinkSync(p) {
  const a = abs(p);
  const n = vol().node(a);
  if (!n) throw fsError("ENOENT", "unlink", a);
  if (n.type === "dir") throw fsError("EISDIR", "unlink", a);
  vol().nodes.delete(a);
}

export function rmSync(p, options = {}) {
  const a = abs(p);
  const n = vol().node(a);
  if (!n) {
    if (options.force) return;
    throw fsError("ENOENT", "rm", a);
  }
  if (n.type === "dir") {
    if (!options.recursive) {
      const err = new Error(`Path is a directory: rm returned EISDIR (is a directory) ${a}`);
      err.code = "ERR_FS_EISDIR";
      throw err;
    }
    for (const key of [...vol().nodes.keys()]) if (key === a || key.startsWith(a + "/")) vol().nodes.delete(key);
    return;
  }
  vol().nodes.delete(a);
}

export function rmdirSync(p) {
  const a = abs(p);
  const n = vol().node(a);
  if (!n) throw fsError("ENOENT", "rmdir", a);
  if (n.type !== "dir") throw fsError("ENOTDIR", "rmdir", a);
  if (vol().children(a).length) throw fsError("ENOTEMPTY", "rmdir", a);
  vol().nodes.delete(a);
}

export function renameSync(from, to) {
  const a = abs(from);
  const b = abs(to);
  const n = vol().node(a);
  if (!n) throw fsError("ENOENT", "rename", a, b);
  checkParent(b, "rename");
  const moves = [...vol().nodes.entries()].filter(([k]) => k === a || k.startsWith(a + "/"));
  for (const [k] of moves) vol().nodes.delete(k);
  for (const [k, v] of moves) vol().nodes.set(b + k.slice(a.length), v);
}

export function copyFileSync(from, to) {
  const a = abs(from);
  const n = vol().node(a);
  if (!n) throw fsError("ENOENT", "copyfile", a, abs(to));
  if (n.type === "dir") throw fsError("EISDIR", "copyfile", a, abs(to));
  checkParent(abs(to), "copyfile");
  vol().write(abs(to), n.data);
}

export function accessSync(p) {
  const a = abs(p);
  if (!vol().node(a)) throw fsError("ENOENT", "access", a);
}

export function realpathSync(p) {
  const a = abs(p);
  if (!vol().node(a)) throw fsError("ENOENT", "realpath", a);
  return a;
}
realpathSync.native = realpathSync;

let tmpSeq = 0;
export function mkdtempSync(prefix) {
  const p = `${prefix}${(++tmpSeq).toString(36).padStart(6, "x")}`;
  mkdirSync(p, { recursive: true });
  return abs(p);
}

export function chmodSync(p, mode) {
  const n = vol().node(abs(p));
  if (!n) throw fsError("ENOENT", "chmod", abs(p));
  n.mode = (n.mode & ~0o777) | (Number(mode) & 0o777);
}
export function utimesSync(p, atime, mtime) {
  const n = vol().node(abs(p));
  if (!n) throw fsError("ENOENT", "utime", abs(p));
  n.mtime = typeof mtime === "number" ? mtime * 1000 : new Date(mtime).getTime();
}

/* File descriptors: enough for libraries that open/write/close (loggers). */
const fds = new Map();
let fdSeq = 10;
export function openSync(p, flags = "r") {
  const a = abs(p);
  const n = vol().node(a);
  if (String(flags).startsWith("r") && !n) throw fsError("ENOENT", "open", a);
  if (!n) writeImpl(a, "", {}, false);
  if (String(flags).startsWith("w")) vol().write(a, "");
  const fd = ++fdSeq;
  fds.set(fd, a);
  return fd;
}
export function writeSync(fd, data) {
  if (fd === 1 || fd === 2) {
    ctx.machine?.writeStd(fd === 1 ? "stdout" : "stderr", String(data));
    return String(data).length;
  }
  const p = fds.get(fd);
  if (!p) throw fsError("EBADF", "write");
  appendFileSync(p, data);
  return Buffer.byteLength(String(data));
}
export function closeSync(fd) {
  fds.delete(fd);
}
export function fsyncSync() {}
export function fstatSync(fd) {
  const p = fds.get(fd);
  if (!p) throw fsError("EBADF", "fstat");
  return statSync(p);
}

/* ── Callback API: same work, result delivered on a later turn ─────── */

function later(fn) {
  const loop = ctx.loop;
  if (loop) loop.setImmediate(fn);
  else queueMicrotask(fn);
}

function callbackify(sync) {
  return function (...args) {
    const cb = args.pop();
    if (typeof cb !== "function") {
      const err = new TypeError(`The "cb" argument must be of type function. Received ${cb === undefined ? "undefined" : typeof cb}`);
      err.code = "ERR_INVALID_ARG_TYPE";
      throw err;
    }
    let result;
    let error = null;
    try {
      result = sync(...args);
    } catch (e) {
      error = e;
    }
    later(() => (error ? cb(error) : cb(null, result)));
  };
}

export const readFile = callbackify(readFileSync);
export const writeFile = callbackify(writeFileSync);
export const appendFile = callbackify(appendFileSync);
export const mkdir = callbackify(mkdirSync);
export const readdir = callbackify(readdirSync);
export const stat = callbackify(statSync);
export const lstat = callbackify(statSync);
export const unlink = callbackify(unlinkSync);
export const rm = callbackify(rmSync);
export const rmdir = callbackify(rmdirSync);
export const rename = callbackify(renameSync);
export const copyFile = callbackify(copyFileSync);
export const access = callbackify(accessSync);
export const realpath = callbackify(realpathSync);
export const mkdtemp = callbackify(mkdtempSync);
export const chmod = callbackify(chmodSync);
export const open = callbackify(openSync);
export const close = callbackify(closeSync);
export const fstat = callbackify(fstatSync);
export function exists(p, cb) {
  const r = existsSync(p);
  later(() => cb(r));
}
export function write(fd, data, ...rest) {
  const cb = rest.pop();
  let n = 0;
  let error = null;
  try {
    n = writeSync(fd, data);
  } catch (e) {
    error = e;
  }
  later(() => cb(error, n, data));
}
export function fsync(fd, cb) {
  later(() => cb(null));
}

/* ── Promise API ───────────────────────────────────────────────────── */

function promisify(sync) {
  return (...args) =>
    new Promise((resolve, reject) => {
      let result;
      try {
        result = sync(...args);
      } catch (e) {
        later(() => reject(e));
        return;
      }
      later(() => resolve(result));
    });
}

class FileHandle {
  constructor(path, flags) {
    this.path = path;
    this.flags = flags;
    this.fd = ++fdSeq;
  }
  readFile(options) { return promises.readFile(this.path, options); }
  writeFile(data, options) { return promises.writeFile(this.path, data, options); }
  appendFile(data, options) { return promises.appendFile(this.path, data, options); }
  stat() { return promises.stat(this.path); }
  async close() {}
  async sync() {}
}

export const promises = {
  readFile: promisify(readFileSync),
  writeFile: promisify(writeFileSync),
  appendFile: promisify(appendFileSync),
  mkdir: promisify(mkdirSync),
  readdir: promisify(readdirSync),
  stat: promisify(statSync),
  lstat: promisify(statSync),
  unlink: promisify(unlinkSync),
  rm: promisify(rmSync),
  rmdir: promisify(rmdirSync),
  rename: promisify(renameSync),
  copyFile: promisify(copyFileSync),
  access: promisify(accessSync),
  realpath: promisify(realpathSync),
  mkdtemp: promisify(mkdtempSync),
  chmod: promisify(chmodSync),
  utimes: promisify(utimesSync),
  open: promisify((p, flags = "r") => {
    const a = abs(p);
    if (String(flags).startsWith("r") && !vol().node(a)) throw fsError("ENOENT", "open", a);
    if (String(flags).startsWith("w")) writeImpl(a, "", {}, false);
    return new FileHandle(a, flags);
  }),
  constants: undefined,
};

/* ── Streams ───────────────────────────────────────────────────────── */

export class ReadStream extends Readable {
  constructor(p, options = {}) {
    if (typeof options === "string") options = { encoding: options };
    super({ highWaterMark: options.highWaterMark || 64 * 1024, encoding: options.encoding });
    this.path = typeof p === "string" ? p : toPath(p);
    this.start = options.start;
    this.end = options.end;
    this.bytesRead = 0;
    this.pending = true;
    this._data = null;
    this._pos = 0;
  }
  _read(size) {
    if (!this._data) {
      try {
        const all = readFileSync(this.path);
        const s = this.start || 0;
        const e = this.end === undefined ? all.length : this.end + 1;
        this._data = all.subarray(s, e);
        this.pending = false;
        this.emit("open", 3);
        this.emit("ready");
      } catch (err) {
        later(() => this.destroy(err));
        return;
      }
    }
    const chunk = this._data.subarray(this._pos, this._pos + size);
    this._pos += chunk.length;
    this.bytesRead += chunk.length;
    later(() => this.push(chunk.length ? chunk : null));
  }
  close(cb) {
    this.destroy();
    if (cb) later(cb);
  }
}

export class WriteStream extends Writable {
  constructor(p, options = {}) {
    if (typeof options === "string") options = { encoding: options };
    super({ decodeStrings: true });
    this.path = typeof p === "string" ? p : toPath(p);
    this.bytesWritten = 0;
    this.pending = true;
    this._append = String(options.flags || "w").startsWith("a");
    try {
      if (!this._append || !existsSync(this.path)) writeImpl(this.path, "", {}, false);
      this.pending = false;
      later(() => {
        this.emit("open", 4);
        this.emit("ready");
      });
    } catch (err) {
      later(() => this.destroy(err));
    }
  }
  _write(chunk, encoding, cb) {
    try {
      appendFileSync(this.path, chunk);
      this.bytesWritten += chunk.length;
      cb();
    } catch (err) {
      cb(err);
    }
  }
  close(cb) {
    this.end(cb);
  }
}

export function createReadStream(p, options) {
  return new ReadStream(abs(p), options);
}
export function createWriteStream(p, options) {
  return new WriteStream(abs(p), options);
}

/* fs.watch has no events to report here; return a closable watcher. */
export function watch() {
  return { close() {}, on() { return this; }, unref() { return this; }, ref() { return this; } };
}

export const constants = {
  F_OK: 0, R_OK: 4, W_OK: 2, X_OK: 1,
  O_RDONLY: 0, O_WRONLY: 1, O_RDWR: 2, O_CREAT: 64, O_EXCL: 128, O_TRUNC: 512, O_APPEND: 1024,
  S_IFMT: 61440, S_IFREG: 32768, S_IFDIR: 16384,
  COPYFILE_EXCL: 1,
};
promises.constants = constants;
export const F_OK = 0;
export const R_OK = 4;
export const W_OK = 2;
export const X_OK = 1;
export { Stats, Dirent };

const fs = {
  existsSync, readFileSync, writeFileSync, appendFileSync, mkdirSync, readdirSync, statSync, lstatSync,
  unlinkSync, rmSync, rmdirSync, renameSync, copyFileSync, accessSync, realpathSync, mkdtempSync, chmodSync,
  utimesSync, openSync, writeSync, closeSync, fsyncSync, fstatSync,
  readFile, writeFile, appendFile, mkdir, readdir, stat, lstat, unlink, rm, rmdir, rename, copyFile, access,
  realpath, mkdtemp, chmod, open, close, fstat, exists, write, fsync,
  promises, createReadStream, createWriteStream, ReadStream, WriteStream, watch, constants,
  F_OK, R_OK, W_OK, X_OK, Stats, Dirent,
};
export default fs;
