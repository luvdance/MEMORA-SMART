/** node:events — the npm "events" package (Node's EventEmitter), plus the newer helpers. */
import EventEmitterPkg from "events/events.js";

const EventEmitter = EventEmitterPkg;
export default EventEmitter;
export { EventEmitter };
export const once = EventEmitter.once;
export const errorMonitor = (EventEmitter.errorMonitor ||= Symbol("events.errorMonitor"));
export const captureRejectionSymbol = Symbol.for("nodejs.rejection");

/** events.on: an async iterator over an emitter's events. */
export function on(emitter, event, { signal } = {}) {
  const queue = [];
  const waiting = [];
  let error = null;
  let done = false;
  const listener = (...args) => {
    if (waiting.length) waiting.shift().resolve({ value: args, done: false });
    else queue.push(args);
  };
  const onError = (err) => {
    error = err;
    while (waiting.length) waiting.shift().reject(err);
  };
  emitter.on(event, listener);
  if (event !== "error") emitter.on("error", onError);
  const stop = () => {
    done = true;
    emitter.removeListener(event, listener);
    emitter.removeListener("error", onError);
    while (waiting.length) waiting.shift().resolve({ value: undefined, done: true });
  };
  signal?.addEventListener("abort", stop, { once: true });
  return {
    [Symbol.asyncIterator]() {
      return this;
    },
    next() {
      if (queue.length) return Promise.resolve({ value: queue.shift(), done: false });
      if (error) return Promise.reject(error);
      if (done) return Promise.resolve({ value: undefined, done: true });
      return new Promise((resolve, reject) => waiting.push({ resolve, reject }));
    },
    return() {
      stop();
      return Promise.resolve({ value: undefined, done: true });
    },
  };
}

export function getEventListeners(emitter, name) {
  return emitter.listeners(name);
}
export function setMaxListeners(n, ...targets) {
  for (const t of targets) t.setMaxListeners?.(n);
}

/* An 'error' event nobody listens for crashes the process; Node's report says where it came from. */
const emit = EventEmitter.prototype.emit;
EventEmitter.prototype.emit = function (type, ...args) {
  if (type === "error" && this.listenerCount("error") === 0 && args[0] instanceof Error) {
    try {
      Object.defineProperty(args[0], "labUnhandledEvent", { value: true, configurable: true });
    } catch {
      /* a frozen error */
    }
  }
  return emit.call(this, type, ...args);
};

EventEmitter.on = on;
EventEmitter.EventEmitter = EventEmitter;
EventEmitter.getEventListeners = getEventListeners;
EventEmitter.setMaxListeners = setMaxListeners;
EventEmitter.captureRejectionSymbol = captureRejectionSymbol;
