/**
 * THE EVENT LOOP AND THE CLOCK
 *
 * A backend lab is a Node.js process that a check talks to: it starts the
 * server, sends requests, waits for retries with exponential backoff, lets a
 * token expire, runs tomorrow's scheduled job. Real time would make that
 * slow and flaky, so the lab's process runs on a VIRTUAL clock:
 *
 *   · Date, performance.now(), setTimeout, setInterval, setImmediate and
 *     AbortSignal.timeout all read and schedule on the virtual clock;
 *   · the clock moves with real time, so an interactive server behaves
 *     normally while the learner pokes at it;
 *   · when the process is waiting and nothing but timers is left to happen
 *     (no query in flight, no request being served), `settle()` jumps the
 *     clock straight to the next timer instead of waiting for it. A retry
 *     after 8 seconds therefore takes no real time, but still happens 8
 *     virtual seconds later, in the right order relative to everything else.
 *
 * The clock reads like a production server's: in UTC. Date's local-time
 * methods (getHours, toString …) are the UTC ones, so output never depends
 * on where the learner's computer is.
 */

const RealDate = globalThis.Date;
const real = {
  setTimeout: globalThis.setTimeout.bind(globalThis),
  clearTimeout: globalThis.clearTimeout.bind(globalThis),
  now: () => RealDate.now(),
  perf: typeof performance !== "undefined" ? performance.now.bind(performance) : () => RealDate.now(),
};
export { real, RealDate };

/** Wait one real macrotask: every queued promise callback runs first. */
export const tick = () => new Promise((resolve) => real.setTimeout(resolve, 0));

let timerSeq = 0;

export class Timeout {
  constructor(loop, fn, ms, args, repeat) {
    this._loop = loop;
    this._id = ++timerSeq;
    this._fn = fn;
    this._args = args;
    this._repeat = repeat ? Math.max(1, ms) : 0;
    this._ms = Math.max(ms >= 1 ? ms : 1, 0);
    this._due = loop.now() + (ms >= 1 ? ms : 1);
    this._ref = true;
    this._active = true;
  }
  ref() {
    this._ref = true;
    return this;
  }
  unref() {
    this._ref = false;
    return this;
  }
  hasRef() {
    return this._ref;
  }
  refresh() {
    this._due = this._loop.now() + this._ms;
    this._loop.wake();
    return this;
  }
  close() {
    this._loop.clear(this);
    return this;
  }
  [Symbol.toPrimitive]() {
    return this._id;
  }
}

export class Loop {
  constructor({ onError } = {}) {
    this.offset = 0;
    this.timers = new Map();
    this.immediates = [];
    this.pending = 0;
    this.handles = new Set(); // servers, sockets: anything that keeps the process alive
    this.onError = onError || ((err) => { throw err; });
    this.realTimer = null;
    this.stopped = false;
  }

  now() {
    return real.now() + this.offset;
  }

  perfNow() {
    return real.perf() + this.offset;
  }

  /* ── timers ───────────────────────────────────────────────────────── */
  setTimeout(fn, ms, ...args) {
    const t = new Timeout(this, fn, Number(ms) || 0, args, false);
    this.timers.set(t._id, t);
    this.wake();
    return t;
  }
  setInterval(fn, ms, ...args) {
    const t = new Timeout(this, fn, Number(ms) || 0, args, true);
    this.timers.set(t._id, t);
    this.wake();
    return t;
  }
  clear(t) {
    if (t == null) return;
    const id = typeof t === "object" ? t._id : Number(t);
    const timer = this.timers.get(id);
    if (timer) timer._active = false;
    this.timers.delete(id);
  }
  setImmediate(fn, ...args) {
    const im = { fn, args, _ref: true, _active: true, ref() { this._ref = true; return this; }, unref() { this._ref = false; return this; }, hasRef() { return this._ref; } };
    this.immediates.push(im);
    real.setTimeout(() => this.runImmediates(), 0);
    return im;
  }
  clearImmediate(im) {
    if (im) im._active = false;
    this.immediates = this.immediates.filter((x) => x !== im);
  }

  runImmediates() {
    if (this.stopped) return;
    const batch = this.immediates;
    this.immediates = [];
    for (const im of batch) {
      if (!im._active) continue;
      im._active = false;
      this.call(im.fn, im.args);
    }
  }

  call(fn, args) {
    try {
      if (typeof fn === "function") fn(...(args || []));
    } catch (err) {
      this.onError(err);
    }
  }

  nextTimer() {
    let best = null;
    for (const t of this.timers.values()) if (!best || t._due < best._due || (t._due === best._due && t._id < best._id)) best = t;
    return best;
  }

  /** Fire every timer that is due now. Returns how many fired. */
  runDue() {
    let fired = 0;
    for (;;) {
      if (this.stopped) return fired;
      const t = this.nextTimer();
      if (!t || t._due > this.now()) return fired;
      fired += 1;
      if (t._repeat) {
        t._due = Math.max(t._due + t._repeat, this.now() - 0);
        if (t._due <= this.now()) t._due = this.now() + t._repeat;
      } else {
        this.timers.delete(t._id);
        t._active = false;
      }
      this.call(t._fn, t._args);
    }
  }

  /** Real-time driver: fire timers when their time comes, for an interactive session. */
  wake() {
    if (this.stopped) return;
    if (this.realTimer) real.clearTimeout(this.realTimer);
    const t = this.nextTimer();
    if (!t) return;
    const wait = Math.max(0, Math.min(t._due - this.now(), 2 ** 31 - 1));
    this.realTimer = real.setTimeout(() => {
      this.realTimer = null;
      this.runDue();
      this.wake();
    }, wait);
  }

  /* ── work in flight ───────────────────────────────────────────────── */
  /** Count a promise as work in flight: the clock never jumps past it. */
  track(promise) {
    this.pending += 1;
    return Promise.resolve(promise).finally(() => {
      this.pending -= 1;
    });
  }

  hasRefs() {
    if (this.handles.size) for (const h of this.handles) if (h._ref !== false) return true;
    for (const t of this.timers.values()) if (t._ref) return true;
    return this.immediates.some((i) => i._ref && i._active);
  }

  /** Wait until nothing is running right now: no queued callbacks, no work in flight. */
  async idle() {
    for (let i = 0; i < 100000; i += 1) {
      await tick();
      if (this.stopped) return;
      if (this.immediates.length) {
        this.runImmediates();
        continue;
      }
      if (this.runDue()) continue;
      if (this.pending === 0) {
        await tick();
        if (this.pending === 0 && !this.immediates.length) return;
      }
    }
  }

  /**
   * Run until `until` settles (a request's response, a test run), jumping
   * the clock over idle time, or, with no `until`, until the process has
   * nothing left that keeps it alive (a script finishing). Returns
   * "done" | "exit" | "idle" (only far-future timers or servers remain) |
   * "stuck" (the limit of virtual time was reached).
   */
  async settle(until, { limit = 10 * 60 * 1000, fastForward = true } = {}) {
    let done = false;
    if (until) Promise.resolve(until).then(() => (done = true), () => (done = true));
    const deadline = this.now() + limit;
    for (;;) {
      await this.idle();
      if (this.stopped) return "exit";
      if (until && done) return "done";
      if (!until && !this.hasRefs()) return "exit";
      const next = this.nextTimer();
      if (!next) return "idle";
      if (!until) {
        // A script with a listening server never "finishes": stop at idle.
        if (this.handles.size) return "idle";
      }
      if (next._due > deadline) return until ? "stuck" : "idle";
      if (!fastForward) return "idle";
      if (next._due > this.now()) this.offset += next._due - this.now();
      this.runDue();
    }
  }

  /** Move the clock forward by `ms`, firing every timer due on the way, in order. */
  async advance(ms) {
    const target = this.now() + Math.max(0, Number(ms) || 0);
    for (;;) {
      await this.idle();
      const next = this.nextTimer();
      if (!next || next._due > target) break;
      if (next._due > this.now()) this.offset += next._due - this.now();
      this.runDue();
    }
    if (target > this.now()) this.offset += target - this.now();
    await this.idle();
    this.wake();
  }

  stop() {
    this.stopped = true;
    if (this.realTimer) real.clearTimeout(this.realTimer);
    this.timers.clear();
    this.immediates = [];
    this.handles.clear();
  }
}

/* ── Date on the virtual clock, reading in UTC ─────────────────────────── */

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const p2 = (n) => String(n).padStart(2, "0");

/** A date-time string with no zone is local time, and local time here is UTC. */
const asUtc = (v) =>
  typeof v === "string" && /^\s*\d{4}-\d\d-\d\d[T ]\d\d:\d\d(:\d\d(\.\d+)?)?\s*$/.test(v) ? v.trim().replace(" ", "T") + "Z" : v;

export function makeDate(getLoop) {
  class Date extends RealDate {
    constructor(...args) {
      if (args.length === 0) super(getLoop() ? getLoop().now() : RealDate.now());
      else if (args.length === 1) super(asUtc(args[0]));
      else super(RealDate.UTC(...args));
    }
    static now() {
      return getLoop() ? getLoop().now() : RealDate.now();
    }
    static parse(s) {
      return RealDate.parse(asUtc(s));
    }
    getTimezoneOffset() { return 0; }
    getFullYear() { return this.getUTCFullYear(); }
    getMonth() { return this.getUTCMonth(); }
    getDate() { return this.getUTCDate(); }
    getDay() { return this.getUTCDay(); }
    getHours() { return this.getUTCHours(); }
    getMinutes() { return this.getUTCMinutes(); }
    getSeconds() { return this.getUTCSeconds(); }
    getMilliseconds() { return this.getUTCMilliseconds(); }
    setFullYear(...a) { return this.setUTCFullYear(...a); }
    setMonth(...a) { return this.setUTCMonth(...a); }
    setDate(...a) { return this.setUTCDate(...a); }
    setHours(...a) { return this.setUTCHours(...a); }
    setMinutes(...a) { return this.setUTCMinutes(...a); }
    setSeconds(...a) { return this.setUTCSeconds(...a); }
    setMilliseconds(...a) { return this.setUTCMilliseconds(...a); }
    toString() {
      if (isNaN(this)) return "Invalid Date";
      return `${this.toDateString()} ${this.toTimeString()}`;
    }
    toDateString() {
      if (isNaN(this)) return "Invalid Date";
      return `${DAYS[this.getUTCDay()]} ${MONTHS[this.getUTCMonth()]} ${p2(this.getUTCDate())} ${this.getUTCFullYear()}`;
    }
    toTimeString() {
      if (isNaN(this)) return "Invalid Date";
      return `${p2(this.getUTCHours())}:${p2(this.getUTCMinutes())}:${p2(this.getUTCSeconds())} GMT+0000 (Coordinated Universal Time)`;
    }
    toLocaleString(locale, opts) { return super.toLocaleString(locale ?? "en-US", { timeZone: "UTC", ...opts }); }
    toLocaleDateString(locale, opts) { return super.toLocaleDateString(locale ?? "en-US", { timeZone: "UTC", ...opts }); }
    toLocaleTimeString(locale, opts) { return super.toLocaleTimeString(locale ?? "en-US", { timeZone: "UTC", ...opts }); }
  }
  Object.defineProperty(Date, "name", { value: "Date" });
  return Date;
}
