/**
 * STORAGE ON THE PRACTICE PHONE
 *
 *   · @react-native-async-storage/async-storage: string key-value storage,
 *     asynchronous, with the library's own warnings for misuse;
 *   · expo-secure-store: the Keychain / Keystore, with its real rules (string
 *     values only, restricted key characters, a 2048-byte comfort limit);
 *   · expo-sqlite: a real SQLite database. The engine is SQLite itself
 *     compiled to WebAssembly (sql.js), so every query a lesson runs is
 *     executed by SQLite, not imitated;
 *   · expo-sqlite/kv-store: the key-value store expo-sqlite provides.
 *
 * Everything is kept by the phone (phone.js `stores`), so it survives an app
 * restart exactly as it does on a device, and disappears when the app is
 * deleted.
 */

import { createContext, createElement, useContext, useEffect, useRef, useState } from "react";
import { emit, stores } from "./phone.js";

const later = (value) => new Promise((r) => setTimeout(() => r(value), 0));

/* ── AsyncStorage ────────────────────────────────────────────────────── */
function checkKey(key) {
  if (typeof key !== "string") {
    console.warn(`[AsyncStorage] Using ${typeof key} type for key is not supported. This can lead to unexpected behavior/errors. Use string instead.\nKey passed: ${key}\n`);
  }
}
function checkValue(key, value) {
  if (value === null || value === undefined) {
    throw new Error(`[AsyncStorage] Passing null/undefined as value is not supported. If you want to remove value, Use .removeItem method instead.\nPassed value: ${value}\nPassed key: ${key}\n`);
  }
  if (typeof value !== "string") {
    console.warn(`[AsyncStorage] The value for key "${key}" is not a string. This can lead to unexpected behavior/errors. Consider stringifying it.\nPassed value: ${value}\nPassed key: ${key}\n`);
  }
}
function merge(a, b) {
  const out = { ...a };
  for (const [k, v] of Object.entries(b)) out[k] = v && typeof v === "object" && !Array.isArray(v) && out[k] && typeof out[k] === "object" ? merge(out[k], v) : v;
  return out;
}
const cb = (callback, err, value) => {
  if (callback) callback(err || null, value);
};
export const AsyncStorage = {
  async getItem(key, callback) {
    checkKey(key);
    const v = stores.async.has(String(key)) ? stores.async.get(String(key)) : null;
    cb(callback, null, v);
    return later(v);
  },
  async setItem(key, value, callback) {
    checkKey(key);
    checkValue(key, value);
    stores.async.set(String(key), String(value));
    emit("storage", { store: "async", key });
    cb(callback);
    return later(undefined);
  },
  async removeItem(key, callback) {
    stores.async.delete(String(key));
    emit("storage", { store: "async", key });
    cb(callback);
    return later(undefined);
  },
  async mergeItem(key, value, callback) {
    const old = stores.async.get(String(key));
    const next = old ? JSON.stringify(merge(JSON.parse(old), JSON.parse(value))) : value;
    stores.async.set(String(key), next);
    cb(callback);
    return later(undefined);
  },
  async clear(callback) {
    stores.async.clear();
    emit("storage", { store: "async" });
    cb(callback);
    return later(undefined);
  },
  async getAllKeys(callback) {
    const keys = [...stores.async.keys()];
    cb(callback, null, keys);
    return later(keys);
  },
  async multiGet(keys, callback) {
    const pairs = keys.map((k) => [k, stores.async.has(k) ? stores.async.get(k) : null]);
    cb(callback, null, pairs);
    return later(pairs);
  },
  async multiSet(pairs, callback) {
    if (!Array.isArray(pairs)) throw new Error("[AsyncStorage] Expected array of key-value pairs as first argument to multiSet");
    for (const [k, v] of pairs) {
      checkValue(k, v);
      stores.async.set(String(k), String(v));
    }
    cb(callback);
    return later(undefined);
  },
  async multiRemove(keys, callback) {
    for (const k of keys) stores.async.delete(String(k));
    cb(callback);
    return later(undefined);
  },
  async multiMerge(pairs, callback) {
    for (const [k, v] of pairs) await AsyncStorage.mergeItem(k, v);
    cb(callback);
  },
  flushGetRequests() {},
};
export function useAsyncStorage(key) {
  return {
    getItem: (callback) => AsyncStorage.getItem(key, callback),
    setItem: (value, callback) => AsyncStorage.setItem(key, value, callback),
    mergeItem: (value, callback) => AsyncStorage.mergeItem(key, value, callback),
    removeItem: (callback) => AsyncStorage.removeItem(key, callback),
  };
}

/* ── expo-secure-store ───────────────────────────────────────────────── */
const validKey = (key) => typeof key === "string" && /^[\w.-]+$/.test(key);
function secureKey(key) {
  if (!validKey(key)) {
    throw new Error(`Invalid key provided to SecureStore. Keys must not be empty and contain only alphanumeric characters, ".", "-", and "_".`);
  }
}
function secureValue(value) {
  if (typeof value !== "string") {
    throw new Error("Invalid value provided to SecureStore. Values must be strings; consider JSON-encoding your values if they are serializable.");
  }
  if (new TextEncoder().encode(value).length > 2048) {
    console.warn("Value being stored in SecureStore is larger than 2048 bytes and it may not be stored successfully. In a future SDK version, this call may throw an error.");
  }
}
export const SecureStore = {
  AFTER_FIRST_UNLOCK: 0,
  AFTER_FIRST_UNLOCK_THIS_DEVICE_ONLY: 1,
  ALWAYS: 2,
  WHEN_PASSCODE_SET_THIS_DEVICE_ONLY: 3,
  ALWAYS_THIS_DEVICE_ONLY: 4,
  WHEN_UNLOCKED: 5,
  WHEN_UNLOCKED_THIS_DEVICE_ONLY: 6,
  async isAvailableAsync() {
    return true;
  },
  async getItemAsync(key) {
    secureKey(key);
    return later(stores.secure.has(key) ? stores.secure.get(key) : null);
  },
  async setItemAsync(key, value) {
    secureKey(key);
    secureValue(value);
    stores.secure.set(key, value);
    emit("storage", { store: "secure", key });
    return later(undefined);
  },
  async deleteItemAsync(key) {
    secureKey(key);
    stores.secure.delete(key);
    emit("storage", { store: "secure", key });
    return later(undefined);
  },
  getItem(key) {
    secureKey(key);
    return stores.secure.has(key) ? stores.secure.get(key) : null;
  },
  setItem(key, value) {
    secureKey(key);
    secureValue(value);
    stores.secure.set(key, value);
    emit("storage", { store: "secure", key });
  },
  canUseBiometricAuthentication: () => true,
};

/* ── expo-sqlite, on SQLite compiled to WebAssembly ──────────────────── */
let SQL = null;
/** Called by the runtime once sql.js has loaded (only labs that use SQLite load it). */
export async function loadSqlite() {
  if (SQL) return SQL;
  if (typeof window.initSqlJs !== "function") throw new Error("The SQLite engine did not load. Reload the lesson.");
  const bin = Uint8Array.from(atob(window.__sqliteWasm || ""), (c) => c.charCodeAt(0));
  SQL = await window.initSqlJs({ wasmBinary: bin });
  // The practice server's database() uses the same engine.
  window.__sqlEngineCtor = SQL.Database;
  return SQL;
}
export const sqliteReady = () => Boolean(SQL);

function bindParams(args) {
  if (!args.length) return [];
  if (args.length === 1 && Array.isArray(args[0])) return args[0].map(normalise);
  if (args.length === 1 && args[0] && typeof args[0] === "object" && !(args[0] instanceof Uint8Array)) {
    const out = {};
    for (const [k, v] of Object.entries(args[0])) out[/^[$:@]/.test(k) ? k : `$${k}`] = normalise(v);
    return out;
  }
  return args.map(normalise);
}
function normalise(v) {
  if (v === undefined) return null;
  if (typeof v === "boolean") return v ? 1 : 0;
  return v;
}

const changeListeners = new Set();
export function addDatabaseChangeListener(fn) {
  changeListeners.add(fn);
  return { remove: () => changeListeners.delete(fn) };
}

/**
 * expo-sqlite's error, as a device reports it: the native call that failed,
 * then SQLite's result code and message (19 is SQLITE_CONSTRAINT, 1 is
 * SQLITE_ERROR for syntax errors and missing tables).
 */
function sqliteError(err, source, fn = "NativeDatabase.execAsync") {
  if (err && err.cause) return err;
  const msg = String(err && err.message ? err.message : err);
  const code = /constraint failed/i.test(msg) ? 19 : /database is locked/i.test(msg) ? 5 : /datatype mismatch/i.test(msg) ? 20 : 1;
  const e = new Error(`Call to function '${fn}' has been rejected.\n→ Caused by: Error code ${code}: ${msg}`);
  e.cause = err;
  e.source = source;
  return e;
}

/** The async API's errors name the async native call. */
function asAsync(fn) {
  try {
    return fn();
  } catch (err) {
    if (err && err.cause) err.message = err.message.replace("Sync' has been rejected", "Async' has been rejected");
    throw err;
  }
}

class SQLiteStatement {
  constructor(db, source) {
    this.db = db;
    this.source = source;
    this.stmt = db.raw.prepare(source);
  }
  rows(params) {
    this.stmt.bind(bindParams(params));
    const out = [];
    while (this.stmt.step()) out.push(this.stmt.getAsObject());
    this.stmt.reset();
    return out;
  }
  executeSync(...params) {
    const rows = this.rows(params);
    const changes = this.db.raw.getRowsModified();
    const lastInsertRowId = this.db.lastId();
    this.db.notify(this.source);
    let i = 0;
    return {
      lastInsertRowId,
      changes,
      getFirstSync: () => rows[0] ?? null,
      getAllSync: () => rows.slice(),
      resetSync: () => {
        i = 0;
      },
      next: () => (i < rows.length ? { value: rows[i++], done: false } : { value: undefined, done: true }),
      [Symbol.iterator]() {
        return this;
      },
    };
  }
  async executeAsync(...params) {
    const r = this.executeSync(...params);
    let i = 0;
    const rows = r.getAllSync();
    return {
      lastInsertRowId: r.lastInsertRowId,
      changes: r.changes,
      getFirstAsync: async () => rows[0] ?? null,
      getAllAsync: async () => rows.slice(),
      resetAsync: async () => {
        i = 0;
      },
      next: async () => (i < rows.length ? { value: rows[i++], done: false } : { value: undefined, done: true }),
      [Symbol.asyncIterator]() {
        return this;
      },
    };
  }
  getColumnNamesSync() {
    return this.stmt.getColumnNames();
  }
  async getColumnNamesAsync() {
    return this.getColumnNamesSync();
  }
  finalizeSync() {
    this.stmt.free();
  }
  async finalizeAsync() {
    this.finalizeSync();
  }
}

export class SQLiteDatabase {
  constructor(databaseName, options = {}, raw) {
    this.databaseName = databaseName;
    this.databasePath = `file:///data/user/0/app/files/SQLite/${databaseName}`;
    this.options = options;
    this.raw = raw;
    this.closed = false;
  }
  check() {
    if (this.closed) throw new Error("Access to closed resource");
  }
  lastId() {
    const r = this.raw.exec("SELECT last_insert_rowid() AS id");
    return Number(r[0]?.values[0][0] ?? 0);
  }
  notify(source) {
    if (!this.options.enableChangeListener) return;
    const m = String(source).match(/^\s*(insert\s+(?:or\s+\w+\s+)?into|update|delete\s+from)\s+["`[]?(\w+)/i);
    if (!m) return;
    for (const fn of changeListeners) fn({ databaseName: this.databaseName, databaseFilePath: this.databasePath, tableName: m[2], rowId: this.lastId() });
  }
  execSync(source) {
    this.check();
    try {
      this.raw.exec(source);
    } catch (err) {
      throw sqliteError(err, source, "NativeDatabase.execSync");
    }
    this.notify(source);
  }
  runSync(source, ...params) {
    this.check();
    let stmt;
    try {
      stmt = new SQLiteStatement(this, source);
      const r = stmt.executeSync(...params);
      return { lastInsertRowId: r.lastInsertRowId, changes: r.changes };
    } catch (err) {
      throw sqliteError(err, source, "NativeStatement.runSync");
    } finally {
      stmt?.finalizeSync();
    }
  }
  getAllSync(source, ...params) {
    this.check();
    let stmt;
    try {
      stmt = new SQLiteStatement(this, source);
      return stmt.rows(params);
    } catch (err) {
      throw sqliteError(err, source, "NativeStatement.getAllSync");
    } finally {
      stmt?.finalizeSync();
    }
  }
  getFirstSync(source, ...params) {
    return this.getAllSync(source, ...params)[0] ?? null;
  }
  *getEachSync(source, ...params) {
    yield* this.getAllSync(source, ...params);
  }
  prepareSync(source) {
    this.check();
    return new SQLiteStatement(this, source);
  }
  withTransactionSync(task) {
    this.execSync("BEGIN");
    try {
      task();
      this.execSync("COMMIT");
    } catch (err) {
      this.raw.exec("ROLLBACK");
      throw err;
    }
  }
  isInTransactionSync() {
    return !this.raw.getAutocommit?.();
  }
  closeSync() {
    this.closed = true;
  }
  serializeSync() {
    return this.raw.export();
  }
  interruptSync() {}
  async execAsync(source) {
    await later();
    return asAsync(() => this.execSync(source));
  }
  async runAsync(source, ...params) {
    await later();
    return asAsync(() => this.runSync(source, ...params));
  }
  async getAllAsync(source, ...params) {
    await later();
    return asAsync(() => this.getAllSync(source, ...params));
  }
  async getFirstAsync(source, ...params) {
    await later();
    return asAsync(() => this.getFirstSync(source, ...params));
  }
  async *getEachAsync(source, ...params) {
    await later();
    yield* this.getAllSync(source, ...params);
  }
  async prepareAsync(source) {
    await later();
    return this.prepareSync(source);
  }
  async withTransactionAsync(task) {
    await this.execAsync("BEGIN");
    try {
      await task();
      await this.execAsync("COMMIT");
    } catch (err) {
      this.raw.exec("ROLLBACK");
      throw err;
    }
  }
  async withExclusiveTransactionAsync(task) {
    return this.withTransactionAsync(() => task(this));
  }
  async isInTransactionAsync() {
    return this.isInTransactionSync();
  }
  async closeAsync() {
    this.closeSync();
  }
  async serializeAsync() {
    return this.serializeSync();
  }
}

function open(name, options) {
  if (!SQL) throw new Error("The SQLite engine is still loading.");
  let raw = stores.sqlite.get(name);
  if (!raw || name === ":memory:") {
    raw = new SQL.Database();
    if (name !== ":memory:") stores.sqlite.set(name, raw);
  }
  return new SQLiteDatabase(name, options, raw);
}
export function openDatabaseSync(name, options = {}) {
  return open(name, options);
}
export async function openDatabaseAsync(name, options = {}) {
  await later();
  return open(name, options);
}
export function deleteDatabaseSync(name) {
  const raw = stores.sqlite.get(name);
  if (raw) raw.close();
  stores.sqlite.delete(name);
}
export async function deleteDatabaseAsync(name) {
  deleteDatabaseSync(name);
}

const SQLiteContext = createContext(null);
/** Opens the database, runs onInit (migrations), then renders its children. */
export function SQLiteProvider({ databaseName, options, onInit, onError, children }) {
  const [db, setDb] = useState(null);
  const [error, setError] = useState(null);
  const started = useRef(false);
  useEffect(() => {
    if (started.current) return;
    started.current = true;
    (async () => {
      try {
        const database = await openDatabaseAsync(databaseName, options);
        if (onInit) await onInit(database);
        setDb(database);
      } catch (err) {
        if (onError) onError(err);
        else setError(err);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [databaseName]);
  if (error) throw error;
  if (!db) return null;
  return createElement(SQLiteContext.Provider, { value: db }, children);
}
export function useSQLiteContext() {
  const db = useContext(SQLiteContext);
  if (!db) throw new Error("useSQLiteContext must be used within a <SQLiteProvider>");
  return db;
}

/* ── expo-sqlite/kv-store ────────────────────────────────────────────── */
export const KVStore = {
  getItem: async (k) => later(stores.kv.has(k) ? stores.kv.get(k) : null),
  setItem: async (k, v) => {
    stores.kv.set(k, typeof v === "function" ? v(stores.kv.get(k) ?? null) : String(v));
    return later();
  },
  removeItem: async (k) => {
    stores.kv.delete(k);
    return later(true);
  },
  getAllKeys: async () => later([...stores.kv.keys()]),
  clear: async () => {
    stores.kv.clear();
    return later(true);
  },
  getItemSync: (k) => (stores.kv.has(k) ? stores.kv.get(k) : null),
  setItemSync: (k, v) => {
    stores.kv.set(k, String(v));
  },
  removeItemSync: (k) => stores.kv.delete(k),
  getAllKeysSync: () => [...stores.kv.keys()],
  clearSync: () => stores.kv.clear(),
  multiGet: async (keys) => keys.map((k) => [k, stores.kv.get(k) ?? null]),
  multiSet: async (pairs) => pairs.forEach(([k, v]) => stores.kv.set(k, String(v))),
  multiRemove: async (keys) => keys.forEach((k) => stores.kv.delete(k)),
  mergeItem: async (k, v) => stores.kv.set(k, JSON.stringify(merge(JSON.parse(stores.kv.get(k) || "{}"), JSON.parse(v)))),
};
