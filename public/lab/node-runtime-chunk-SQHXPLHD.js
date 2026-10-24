import {
  require_fs
} from "./node-runtime-chunk-2HFUVLLM.js";
import {
  __commonJS,
  __name,
  init_globals
} from "./node-runtime-chunk-WY7WQXFC.js";

// scripts/node-lab/node_modules/@prisma/internals/dist/chunk-4VNS5WPM.js
var require_chunk_4VNS5WPM = __commonJS({
  "scripts/node-lab/node_modules/@prisma/internals/dist/chunk-4VNS5WPM.js"(exports, module) {
    "use strict";
    init_globals();
    var __defProp = Object.defineProperty;
    var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames = Object.getOwnPropertyNames;
    var __hasOwnProp = Object.prototype.hasOwnProperty;
    var __export = /* @__PURE__ */ __name((target, all) => {
      for (var name in all)
        __defProp(target, name, { get: all[name], enumerable: true });
    }, "__export");
    var __copyProps = /* @__PURE__ */ __name((to, from, except, desc) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames(from))
          if (!__hasOwnProp.call(to, key) && key !== except)
            __defProp(to, key, { get: /* @__PURE__ */ __name(() => from[key], "get"), enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
      }
      return to;
    }, "__copyProps");
    var __toCommonJS = /* @__PURE__ */ __name((mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod), "__toCommonJS");
    var chunk_4VNS5WPM_exports = {};
    __export(chunk_4VNS5WPM_exports, {
      __commonJS: /* @__PURE__ */ __name(() => __commonJS2, "__commonJS"),
      __export: /* @__PURE__ */ __name(() => __export2, "__export"),
      __require: /* @__PURE__ */ __name(() => __require, "__require"),
      __toESM: /* @__PURE__ */ __name(() => __toESM, "__toESM")
    });
    module.exports = __toCommonJS(chunk_4VNS5WPM_exports);
    var __create = Object.create;
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames2 = Object.getOwnPropertyNames;
    var __getProtoOf = Object.getPrototypeOf;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __require = /* @__PURE__ */ __name((x) => globalThis.__labRequire(x), "__require");
    var __commonJS2 = /* @__PURE__ */ __name((cb, mod) => /* @__PURE__ */ __name(function __require2() {
      return mod || (0, cb[__getOwnPropNames2(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
    }, "__require2"), "__commonJS");
    var __export2 = /* @__PURE__ */ __name((target, all) => {
      for (var name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    }, "__export2");
    var __copyProps2 = /* @__PURE__ */ __name((to, from, except, desc) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames2(from))
          if (!__hasOwnProp2.call(to, key) && key !== except)
            __defProp2(to, key, { get: /* @__PURE__ */ __name(() => from[key], "get"), enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
      }
      return to;
    }, "__copyProps2");
    var __toESM = /* @__PURE__ */ __name((mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps2(
      // If the importer is in node compatibility mode or this is not an ESM
      // file that has been converted to a CommonJS file using a Babel-
      // compatible transform (i.e. "__esModule" has not been set), then set
      // "default" to the CommonJS "module.exports" for node compatibility.
      isNodeMode || !mod || !mod.__esModule ? __defProp2(target, "default", { value: mod, enumerable: true }) : target,
      mod
    )), "__toESM");
  }
});

// scripts/node-lab/node_modules/@prisma/internals/dist/chunk-NVNI2SRU.js
var require_chunk_NVNI2SRU = __commonJS({
  "scripts/node-lab/node_modules/@prisma/internals/dist/chunk-NVNI2SRU.js"(exports, module) {
    "use strict";
    init_globals();
    var __defProp = Object.defineProperty;
    var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames = Object.getOwnPropertyNames;
    var __hasOwnProp = Object.prototype.hasOwnProperty;
    var __export = /* @__PURE__ */ __name((target, all) => {
      for (var name in all)
        __defProp(target, name, { get: all[name], enumerable: true });
    }, "__export");
    var __copyProps = /* @__PURE__ */ __name((to, from, except, desc) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames(from))
          if (!__hasOwnProp.call(to, key) && key !== except)
            __defProp(to, key, { get: /* @__PURE__ */ __name(() => from[key], "get"), enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
      }
      return to;
    }, "__copyProps");
    var __toCommonJS = /* @__PURE__ */ __name((mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod), "__toCommonJS");
    var chunk_NVNI2SRU_exports = {};
    __export(chunk_NVNI2SRU_exports, {
      FormData: /* @__PURE__ */ __name(() => FormData, "FormData"),
      fetch_blob_default: /* @__PURE__ */ __name(() => fetch_blob_default, "fetch_blob_default"),
      file_default: /* @__PURE__ */ __name(() => file_default, "file_default"),
      formDataToBlob: /* @__PURE__ */ __name(() => formDataToBlob, "formDataToBlob")
    });
    module.exports = __toCommonJS(chunk_NVNI2SRU_exports);
    var import_chunk_4VNS5WPM = require_chunk_4VNS5WPM();
    var import_node_fs = require_fs();
    var require_ponyfill_es2018 = (0, import_chunk_4VNS5WPM.__commonJS)({
      "../../node_modules/.pnpm/web-streams-polyfill@3.2.1/node_modules/web-streams-polyfill/dist/ponyfill.es2018.js"(exports2, module2) {
        "use strict";
        (function(global2, factory) {
          typeof exports2 === "object" && typeof module2 !== "undefined" ? factory(exports2) : typeof define === "function" && define.amd ? define(["exports"], factory) : (global2 = typeof globalThis !== "undefined" ? globalThis : global2 || self, factory(global2.WebStreamsPolyfill = {}));
        })(exports2, function(exports22) {
          "use strict";
          const SymbolPolyfill = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? Symbol : (description) => `Symbol(${description})`;
          function noop() {
            return void 0;
          }
          __name(noop, "noop");
          function getGlobals() {
            if (typeof self !== "undefined") {
              return self;
            } else if (typeof window !== "undefined") {
              return window;
            } else if (typeof globalThis !== "undefined") {
              return globalThis;
            }
            return void 0;
          }
          __name(getGlobals, "getGlobals");
          const globals = getGlobals();
          function typeIsObject(x2) {
            return typeof x2 === "object" && x2 !== null || typeof x2 === "function";
          }
          __name(typeIsObject, "typeIsObject");
          const rethrowAssertionErrorRejection = noop;
          const originalPromise = Promise;
          const originalPromiseThen = Promise.prototype.then;
          const originalPromiseResolve = Promise.resolve.bind(originalPromise);
          const originalPromiseReject = Promise.reject.bind(originalPromise);
          function newPromise(executor) {
            return new originalPromise(executor);
          }
          __name(newPromise, "newPromise");
          function promiseResolvedWith(value) {
            return originalPromiseResolve(value);
          }
          __name(promiseResolvedWith, "promiseResolvedWith");
          function promiseRejectedWith(reason) {
            return originalPromiseReject(reason);
          }
          __name(promiseRejectedWith, "promiseRejectedWith");
          function PerformPromiseThen(promise, onFulfilled, onRejected) {
            return originalPromiseThen.call(promise, onFulfilled, onRejected);
          }
          __name(PerformPromiseThen, "PerformPromiseThen");
          function uponPromise(promise, onFulfilled, onRejected) {
            PerformPromiseThen(PerformPromiseThen(promise, onFulfilled, onRejected), void 0, rethrowAssertionErrorRejection);
          }
          __name(uponPromise, "uponPromise");
          function uponFulfillment(promise, onFulfilled) {
            uponPromise(promise, onFulfilled);
          }
          __name(uponFulfillment, "uponFulfillment");
          function uponRejection(promise, onRejected) {
            uponPromise(promise, void 0, onRejected);
          }
          __name(uponRejection, "uponRejection");
          function transformPromiseWith(promise, fulfillmentHandler, rejectionHandler) {
            return PerformPromiseThen(promise, fulfillmentHandler, rejectionHandler);
          }
          __name(transformPromiseWith, "transformPromiseWith");
          function setPromiseIsHandledToTrue(promise) {
            PerformPromiseThen(promise, void 0, rethrowAssertionErrorRejection);
          }
          __name(setPromiseIsHandledToTrue, "setPromiseIsHandledToTrue");
          const queueMicrotask = (() => {
            const globalQueueMicrotask = globals && globals.queueMicrotask;
            if (typeof globalQueueMicrotask === "function") {
              return globalQueueMicrotask;
            }
            const resolvedPromise = promiseResolvedWith(void 0);
            return (fn) => PerformPromiseThen(resolvedPromise, fn);
          })();
          function reflectCall(F, V, args) {
            if (typeof F !== "function") {
              throw new TypeError("Argument is not a function");
            }
            return Function.prototype.apply.call(F, V, args);
          }
          __name(reflectCall, "reflectCall");
          function promiseCall(F, V, args) {
            try {
              return promiseResolvedWith(reflectCall(F, V, args));
            } catch (value) {
              return promiseRejectedWith(value);
            }
          }
          __name(promiseCall, "promiseCall");
          const QUEUE_MAX_ARRAY_SIZE = 16384;
          class SimpleQueue {
            static {
              __name(this, "SimpleQueue");
            }
            constructor() {
              this._cursor = 0;
              this._size = 0;
              this._front = {
                _elements: [],
                _next: void 0
              };
              this._back = this._front;
              this._cursor = 0;
              this._size = 0;
            }
            get length() {
              return this._size;
            }
            // For exception safety, this method is structured in order:
            // 1. Read state
            // 2. Calculate required state mutations
            // 3. Perform state mutations
            push(element) {
              const oldBack = this._back;
              let newBack = oldBack;
              if (oldBack._elements.length === QUEUE_MAX_ARRAY_SIZE - 1) {
                newBack = {
                  _elements: [],
                  _next: void 0
                };
              }
              oldBack._elements.push(element);
              if (newBack !== oldBack) {
                this._back = newBack;
                oldBack._next = newBack;
              }
              ++this._size;
            }
            // Like push(), shift() follows the read -> calculate -> mutate pattern for
            // exception safety.
            shift() {
              const oldFront = this._front;
              let newFront = oldFront;
              const oldCursor = this._cursor;
              let newCursor = oldCursor + 1;
              const elements = oldFront._elements;
              const element = elements[oldCursor];
              if (newCursor === QUEUE_MAX_ARRAY_SIZE) {
                newFront = oldFront._next;
                newCursor = 0;
              }
              --this._size;
              this._cursor = newCursor;
              if (oldFront !== newFront) {
                this._front = newFront;
              }
              elements[oldCursor] = void 0;
              return element;
            }
            // The tricky thing about forEach() is that it can be called
            // re-entrantly. The queue may be mutated inside the callback. It is easy to
            // see that push() within the callback has no negative effects since the end
            // of the queue is checked for on every iteration. If shift() is called
            // repeatedly within the callback then the next iteration may return an
            // element that has been removed. In this case the callback will be called
            // with undefined values until we either "catch up" with elements that still
            // exist or reach the back of the queue.
            forEach(callback) {
              let i2 = this._cursor;
              let node = this._front;
              let elements = node._elements;
              while (i2 !== elements.length || node._next !== void 0) {
                if (i2 === elements.length) {
                  node = node._next;
                  elements = node._elements;
                  i2 = 0;
                  if (elements.length === 0) {
                    break;
                  }
                }
                callback(elements[i2]);
                ++i2;
              }
            }
            // Return the element that would be returned if shift() was called now,
            // without modifying the queue.
            peek() {
              const front = this._front;
              const cursor = this._cursor;
              return front._elements[cursor];
            }
          }
          function ReadableStreamReaderGenericInitialize(reader, stream) {
            reader._ownerReadableStream = stream;
            stream._reader = reader;
            if (stream._state === "readable") {
              defaultReaderClosedPromiseInitialize(reader);
            } else if (stream._state === "closed") {
              defaultReaderClosedPromiseInitializeAsResolved(reader);
            } else {
              defaultReaderClosedPromiseInitializeAsRejected(reader, stream._storedError);
            }
          }
          __name(ReadableStreamReaderGenericInitialize, "ReadableStreamReaderGenericInitialize");
          function ReadableStreamReaderGenericCancel(reader, reason) {
            const stream = reader._ownerReadableStream;
            return ReadableStreamCancel(stream, reason);
          }
          __name(ReadableStreamReaderGenericCancel, "ReadableStreamReaderGenericCancel");
          function ReadableStreamReaderGenericRelease(reader) {
            if (reader._ownerReadableStream._state === "readable") {
              defaultReaderClosedPromiseReject(reader, new TypeError(`Reader was released and can no longer be used to monitor the stream's closedness`));
            } else {
              defaultReaderClosedPromiseResetToRejected(reader, new TypeError(`Reader was released and can no longer be used to monitor the stream's closedness`));
            }
            reader._ownerReadableStream._reader = void 0;
            reader._ownerReadableStream = void 0;
          }
          __name(ReadableStreamReaderGenericRelease, "ReadableStreamReaderGenericRelease");
          function readerLockException(name) {
            return new TypeError("Cannot " + name + " a stream using a released reader");
          }
          __name(readerLockException, "readerLockException");
          function defaultReaderClosedPromiseInitialize(reader) {
            reader._closedPromise = newPromise((resolve, reject) => {
              reader._closedPromise_resolve = resolve;
              reader._closedPromise_reject = reject;
            });
          }
          __name(defaultReaderClosedPromiseInitialize, "defaultReaderClosedPromiseInitialize");
          function defaultReaderClosedPromiseInitializeAsRejected(reader, reason) {
            defaultReaderClosedPromiseInitialize(reader);
            defaultReaderClosedPromiseReject(reader, reason);
          }
          __name(defaultReaderClosedPromiseInitializeAsRejected, "defaultReaderClosedPromiseInitializeAsRejected");
          function defaultReaderClosedPromiseInitializeAsResolved(reader) {
            defaultReaderClosedPromiseInitialize(reader);
            defaultReaderClosedPromiseResolve(reader);
          }
          __name(defaultReaderClosedPromiseInitializeAsResolved, "defaultReaderClosedPromiseInitializeAsResolved");
          function defaultReaderClosedPromiseReject(reader, reason) {
            if (reader._closedPromise_reject === void 0) {
              return;
            }
            setPromiseIsHandledToTrue(reader._closedPromise);
            reader._closedPromise_reject(reason);
            reader._closedPromise_resolve = void 0;
            reader._closedPromise_reject = void 0;
          }
          __name(defaultReaderClosedPromiseReject, "defaultReaderClosedPromiseReject");
          function defaultReaderClosedPromiseResetToRejected(reader, reason) {
            defaultReaderClosedPromiseInitializeAsRejected(reader, reason);
          }
          __name(defaultReaderClosedPromiseResetToRejected, "defaultReaderClosedPromiseResetToRejected");
          function defaultReaderClosedPromiseResolve(reader) {
            if (reader._closedPromise_resolve === void 0) {
              return;
            }
            reader._closedPromise_resolve(void 0);
            reader._closedPromise_resolve = void 0;
            reader._closedPromise_reject = void 0;
          }
          __name(defaultReaderClosedPromiseResolve, "defaultReaderClosedPromiseResolve");
          const AbortSteps = SymbolPolyfill("[[AbortSteps]]");
          const ErrorSteps = SymbolPolyfill("[[ErrorSteps]]");
          const CancelSteps = SymbolPolyfill("[[CancelSteps]]");
          const PullSteps = SymbolPolyfill("[[PullSteps]]");
          const NumberIsFinite = Number.isFinite || function(x2) {
            return typeof x2 === "number" && isFinite(x2);
          };
          const MathTrunc = Math.trunc || function(v) {
            return v < 0 ? Math.ceil(v) : Math.floor(v);
          };
          function isDictionary(x2) {
            return typeof x2 === "object" || typeof x2 === "function";
          }
          __name(isDictionary, "isDictionary");
          function assertDictionary(obj, context) {
            if (obj !== void 0 && !isDictionary(obj)) {
              throw new TypeError(`${context} is not an object.`);
            }
          }
          __name(assertDictionary, "assertDictionary");
          function assertFunction(x2, context) {
            if (typeof x2 !== "function") {
              throw new TypeError(`${context} is not a function.`);
            }
          }
          __name(assertFunction, "assertFunction");
          function isObject(x2) {
            return typeof x2 === "object" && x2 !== null || typeof x2 === "function";
          }
          __name(isObject, "isObject");
          function assertObject(x2, context) {
            if (!isObject(x2)) {
              throw new TypeError(`${context} is not an object.`);
            }
          }
          __name(assertObject, "assertObject");
          function assertRequiredArgument(x2, position, context) {
            if (x2 === void 0) {
              throw new TypeError(`Parameter ${position} is required in '${context}'.`);
            }
          }
          __name(assertRequiredArgument, "assertRequiredArgument");
          function assertRequiredField(x2, field, context) {
            if (x2 === void 0) {
              throw new TypeError(`${field} is required in '${context}'.`);
            }
          }
          __name(assertRequiredField, "assertRequiredField");
          function convertUnrestrictedDouble(value) {
            return Number(value);
          }
          __name(convertUnrestrictedDouble, "convertUnrestrictedDouble");
          function censorNegativeZero(x2) {
            return x2 === 0 ? 0 : x2;
          }
          __name(censorNegativeZero, "censorNegativeZero");
          function integerPart(x2) {
            return censorNegativeZero(MathTrunc(x2));
          }
          __name(integerPart, "integerPart");
          function convertUnsignedLongLongWithEnforceRange(value, context) {
            const lowerBound = 0;
            const upperBound = Number.MAX_SAFE_INTEGER;
            let x2 = Number(value);
            x2 = censorNegativeZero(x2);
            if (!NumberIsFinite(x2)) {
              throw new TypeError(`${context} is not a finite number`);
            }
            x2 = integerPart(x2);
            if (x2 < lowerBound || x2 > upperBound) {
              throw new TypeError(`${context} is outside the accepted range of ${lowerBound} to ${upperBound}, inclusive`);
            }
            if (!NumberIsFinite(x2) || x2 === 0) {
              return 0;
            }
            return x2;
          }
          __name(convertUnsignedLongLongWithEnforceRange, "convertUnsignedLongLongWithEnforceRange");
          function assertReadableStream(x2, context) {
            if (!IsReadableStream(x2)) {
              throw new TypeError(`${context} is not a ReadableStream.`);
            }
          }
          __name(assertReadableStream, "assertReadableStream");
          function AcquireReadableStreamDefaultReader(stream) {
            return new ReadableStreamDefaultReader(stream);
          }
          __name(AcquireReadableStreamDefaultReader, "AcquireReadableStreamDefaultReader");
          function ReadableStreamAddReadRequest(stream, readRequest) {
            stream._reader._readRequests.push(readRequest);
          }
          __name(ReadableStreamAddReadRequest, "ReadableStreamAddReadRequest");
          function ReadableStreamFulfillReadRequest(stream, chunk, done) {
            const reader = stream._reader;
            const readRequest = reader._readRequests.shift();
            if (done) {
              readRequest._closeSteps();
            } else {
              readRequest._chunkSteps(chunk);
            }
          }
          __name(ReadableStreamFulfillReadRequest, "ReadableStreamFulfillReadRequest");
          function ReadableStreamGetNumReadRequests(stream) {
            return stream._reader._readRequests.length;
          }
          __name(ReadableStreamGetNumReadRequests, "ReadableStreamGetNumReadRequests");
          function ReadableStreamHasDefaultReader(stream) {
            const reader = stream._reader;
            if (reader === void 0) {
              return false;
            }
            if (!IsReadableStreamDefaultReader(reader)) {
              return false;
            }
            return true;
          }
          __name(ReadableStreamHasDefaultReader, "ReadableStreamHasDefaultReader");
          class ReadableStreamDefaultReader {
            static {
              __name(this, "ReadableStreamDefaultReader");
            }
            constructor(stream) {
              assertRequiredArgument(stream, 1, "ReadableStreamDefaultReader");
              assertReadableStream(stream, "First parameter");
              if (IsReadableStreamLocked(stream)) {
                throw new TypeError("This stream has already been locked for exclusive reading by another reader");
              }
              ReadableStreamReaderGenericInitialize(this, stream);
              this._readRequests = new SimpleQueue();
            }
            /**
             * Returns a promise that will be fulfilled when the stream becomes closed,
             * or rejected if the stream ever errors or the reader's lock is released before the stream finishes closing.
             */
            get closed() {
              if (!IsReadableStreamDefaultReader(this)) {
                return promiseRejectedWith(defaultReaderBrandCheckException("closed"));
              }
              return this._closedPromise;
            }
            /**
             * If the reader is active, behaves the same as {@link ReadableStream.cancel | stream.cancel(reason)}.
             */
            cancel(reason = void 0) {
              if (!IsReadableStreamDefaultReader(this)) {
                return promiseRejectedWith(defaultReaderBrandCheckException("cancel"));
              }
              if (this._ownerReadableStream === void 0) {
                return promiseRejectedWith(readerLockException("cancel"));
              }
              return ReadableStreamReaderGenericCancel(this, reason);
            }
            /**
             * Returns a promise that allows access to the next chunk from the stream's internal queue, if available.
             *
             * If reading a chunk causes the queue to become empty, more data will be pulled from the underlying source.
             */
            read() {
              if (!IsReadableStreamDefaultReader(this)) {
                return promiseRejectedWith(defaultReaderBrandCheckException("read"));
              }
              if (this._ownerReadableStream === void 0) {
                return promiseRejectedWith(readerLockException("read from"));
              }
              let resolvePromise;
              let rejectPromise;
              const promise = newPromise((resolve, reject) => {
                resolvePromise = resolve;
                rejectPromise = reject;
              });
              const readRequest = {
                _chunkSteps: /* @__PURE__ */ __name((chunk) => resolvePromise({ value: chunk, done: false }), "_chunkSteps"),
                _closeSteps: /* @__PURE__ */ __name(() => resolvePromise({ value: void 0, done: true }), "_closeSteps"),
                _errorSteps: /* @__PURE__ */ __name((e2) => rejectPromise(e2), "_errorSteps")
              };
              ReadableStreamDefaultReaderRead(this, readRequest);
              return promise;
            }
            /**
             * Releases the reader's lock on the corresponding stream. After the lock is released, the reader is no longer active.
             * If the associated stream is errored when the lock is released, the reader will appear errored in the same way
             * from now on; otherwise, the reader will appear closed.
             *
             * A reader's lock cannot be released while it still has a pending read request, i.e., if a promise returned by
             * the reader's {@link ReadableStreamDefaultReader.read | read()} method has not yet been settled. Attempting to
             * do so will throw a `TypeError` and leave the reader locked to the stream.
             */
            releaseLock() {
              if (!IsReadableStreamDefaultReader(this)) {
                throw defaultReaderBrandCheckException("releaseLock");
              }
              if (this._ownerReadableStream === void 0) {
                return;
              }
              if (this._readRequests.length > 0) {
                throw new TypeError("Tried to release a reader lock when that reader has pending read() calls un-settled");
              }
              ReadableStreamReaderGenericRelease(this);
            }
          }
          Object.defineProperties(ReadableStreamDefaultReader.prototype, {
            cancel: { enumerable: true },
            read: { enumerable: true },
            releaseLock: { enumerable: true },
            closed: { enumerable: true }
          });
          if (typeof SymbolPolyfill.toStringTag === "symbol") {
            Object.defineProperty(ReadableStreamDefaultReader.prototype, SymbolPolyfill.toStringTag, {
              value: "ReadableStreamDefaultReader",
              configurable: true
            });
          }
          function IsReadableStreamDefaultReader(x2) {
            if (!typeIsObject(x2)) {
              return false;
            }
            if (!Object.prototype.hasOwnProperty.call(x2, "_readRequests")) {
              return false;
            }
            return x2 instanceof ReadableStreamDefaultReader;
          }
          __name(IsReadableStreamDefaultReader, "IsReadableStreamDefaultReader");
          function ReadableStreamDefaultReaderRead(reader, readRequest) {
            const stream = reader._ownerReadableStream;
            stream._disturbed = true;
            if (stream._state === "closed") {
              readRequest._closeSteps();
            } else if (stream._state === "errored") {
              readRequest._errorSteps(stream._storedError);
            } else {
              stream._readableStreamController[PullSteps](readRequest);
            }
          }
          __name(ReadableStreamDefaultReaderRead, "ReadableStreamDefaultReaderRead");
          function defaultReaderBrandCheckException(name) {
            return new TypeError(`ReadableStreamDefaultReader.prototype.${name} can only be used on a ReadableStreamDefaultReader`);
          }
          __name(defaultReaderBrandCheckException, "defaultReaderBrandCheckException");
          const AsyncIteratorPrototype = Object.getPrototypeOf(Object.getPrototypeOf(async function* () {
          }).prototype);
          class ReadableStreamAsyncIteratorImpl {
            static {
              __name(this, "ReadableStreamAsyncIteratorImpl");
            }
            constructor(reader, preventCancel) {
              this._ongoingPromise = void 0;
              this._isFinished = false;
              this._reader = reader;
              this._preventCancel = preventCancel;
            }
            next() {
              const nextSteps = /* @__PURE__ */ __name(() => this._nextSteps(), "nextSteps");
              this._ongoingPromise = this._ongoingPromise ? transformPromiseWith(this._ongoingPromise, nextSteps, nextSteps) : nextSteps();
              return this._ongoingPromise;
            }
            return(value) {
              const returnSteps = /* @__PURE__ */ __name(() => this._returnSteps(value), "returnSteps");
              return this._ongoingPromise ? transformPromiseWith(this._ongoingPromise, returnSteps, returnSteps) : returnSteps();
            }
            _nextSteps() {
              if (this._isFinished) {
                return Promise.resolve({ value: void 0, done: true });
              }
              const reader = this._reader;
              if (reader._ownerReadableStream === void 0) {
                return promiseRejectedWith(readerLockException("iterate"));
              }
              let resolvePromise;
              let rejectPromise;
              const promise = newPromise((resolve, reject) => {
                resolvePromise = resolve;
                rejectPromise = reject;
              });
              const readRequest = {
                _chunkSteps: /* @__PURE__ */ __name((chunk) => {
                  this._ongoingPromise = void 0;
                  queueMicrotask(() => resolvePromise({ value: chunk, done: false }));
                }, "_chunkSteps"),
                _closeSteps: /* @__PURE__ */ __name(() => {
                  this._ongoingPromise = void 0;
                  this._isFinished = true;
                  ReadableStreamReaderGenericRelease(reader);
                  resolvePromise({ value: void 0, done: true });
                }, "_closeSteps"),
                _errorSteps: /* @__PURE__ */ __name((reason) => {
                  this._ongoingPromise = void 0;
                  this._isFinished = true;
                  ReadableStreamReaderGenericRelease(reader);
                  rejectPromise(reason);
                }, "_errorSteps")
              };
              ReadableStreamDefaultReaderRead(reader, readRequest);
              return promise;
            }
            _returnSteps(value) {
              if (this._isFinished) {
                return Promise.resolve({ value, done: true });
              }
              this._isFinished = true;
              const reader = this._reader;
              if (reader._ownerReadableStream === void 0) {
                return promiseRejectedWith(readerLockException("finish iterating"));
              }
              if (!this._preventCancel) {
                const result = ReadableStreamReaderGenericCancel(reader, value);
                ReadableStreamReaderGenericRelease(reader);
                return transformPromiseWith(result, () => ({ value, done: true }));
              }
              ReadableStreamReaderGenericRelease(reader);
              return promiseResolvedWith({ value, done: true });
            }
          }
          const ReadableStreamAsyncIteratorPrototype = {
            next() {
              if (!IsReadableStreamAsyncIterator(this)) {
                return promiseRejectedWith(streamAsyncIteratorBrandCheckException("next"));
              }
              return this._asyncIteratorImpl.next();
            },
            return(value) {
              if (!IsReadableStreamAsyncIterator(this)) {
                return promiseRejectedWith(streamAsyncIteratorBrandCheckException("return"));
              }
              return this._asyncIteratorImpl.return(value);
            }
          };
          if (AsyncIteratorPrototype !== void 0) {
            Object.setPrototypeOf(ReadableStreamAsyncIteratorPrototype, AsyncIteratorPrototype);
          }
          function AcquireReadableStreamAsyncIterator(stream, preventCancel) {
            const reader = AcquireReadableStreamDefaultReader(stream);
            const impl = new ReadableStreamAsyncIteratorImpl(reader, preventCancel);
            const iterator = Object.create(ReadableStreamAsyncIteratorPrototype);
            iterator._asyncIteratorImpl = impl;
            return iterator;
          }
          __name(AcquireReadableStreamAsyncIterator, "AcquireReadableStreamAsyncIterator");
          function IsReadableStreamAsyncIterator(x2) {
            if (!typeIsObject(x2)) {
              return false;
            }
            if (!Object.prototype.hasOwnProperty.call(x2, "_asyncIteratorImpl")) {
              return false;
            }
            try {
              return x2._asyncIteratorImpl instanceof ReadableStreamAsyncIteratorImpl;
            } catch (_a) {
              return false;
            }
          }
          __name(IsReadableStreamAsyncIterator, "IsReadableStreamAsyncIterator");
          function streamAsyncIteratorBrandCheckException(name) {
            return new TypeError(`ReadableStreamAsyncIterator.${name} can only be used on a ReadableSteamAsyncIterator`);
          }
          __name(streamAsyncIteratorBrandCheckException, "streamAsyncIteratorBrandCheckException");
          const NumberIsNaN = Number.isNaN || function(x2) {
            return x2 !== x2;
          };
          function CreateArrayFromList(elements) {
            return elements.slice();
          }
          __name(CreateArrayFromList, "CreateArrayFromList");
          function CopyDataBlockBytes(dest, destOffset, src, srcOffset, n) {
            new Uint8Array(dest).set(new Uint8Array(src, srcOffset, n), destOffset);
          }
          __name(CopyDataBlockBytes, "CopyDataBlockBytes");
          function TransferArrayBuffer(O) {
            return O;
          }
          __name(TransferArrayBuffer, "TransferArrayBuffer");
          function IsDetachedBuffer(O) {
            return false;
          }
          __name(IsDetachedBuffer, "IsDetachedBuffer");
          function ArrayBufferSlice(buffer, begin, end) {
            if (buffer.slice) {
              return buffer.slice(begin, end);
            }
            const length = end - begin;
            const slice = new ArrayBuffer(length);
            CopyDataBlockBytes(slice, 0, buffer, begin, length);
            return slice;
          }
          __name(ArrayBufferSlice, "ArrayBufferSlice");
          function IsNonNegativeNumber(v) {
            if (typeof v !== "number") {
              return false;
            }
            if (NumberIsNaN(v)) {
              return false;
            }
            if (v < 0) {
              return false;
            }
            return true;
          }
          __name(IsNonNegativeNumber, "IsNonNegativeNumber");
          function CloneAsUint8Array(O) {
            const buffer = ArrayBufferSlice(O.buffer, O.byteOffset, O.byteOffset + O.byteLength);
            return new Uint8Array(buffer);
          }
          __name(CloneAsUint8Array, "CloneAsUint8Array");
          function DequeueValue(container) {
            const pair = container._queue.shift();
            container._queueTotalSize -= pair.size;
            if (container._queueTotalSize < 0) {
              container._queueTotalSize = 0;
            }
            return pair.value;
          }
          __name(DequeueValue, "DequeueValue");
          function EnqueueValueWithSize(container, value, size) {
            if (!IsNonNegativeNumber(size) || size === Infinity) {
              throw new RangeError("Size must be a finite, non-NaN, non-negative number.");
            }
            container._queue.push({ value, size });
            container._queueTotalSize += size;
          }
          __name(EnqueueValueWithSize, "EnqueueValueWithSize");
          function PeekQueueValue(container) {
            const pair = container._queue.peek();
            return pair.value;
          }
          __name(PeekQueueValue, "PeekQueueValue");
          function ResetQueue(container) {
            container._queue = new SimpleQueue();
            container._queueTotalSize = 0;
          }
          __name(ResetQueue, "ResetQueue");
          class ReadableStreamBYOBRequest {
            static {
              __name(this, "ReadableStreamBYOBRequest");
            }
            constructor() {
              throw new TypeError("Illegal constructor");
            }
            /**
             * Returns the view for writing in to, or `null` if the BYOB request has already been responded to.
             */
            get view() {
              if (!IsReadableStreamBYOBRequest(this)) {
                throw byobRequestBrandCheckException("view");
              }
              return this._view;
            }
            respond(bytesWritten) {
              if (!IsReadableStreamBYOBRequest(this)) {
                throw byobRequestBrandCheckException("respond");
              }
              assertRequiredArgument(bytesWritten, 1, "respond");
              bytesWritten = convertUnsignedLongLongWithEnforceRange(bytesWritten, "First parameter");
              if (this._associatedReadableByteStreamController === void 0) {
                throw new TypeError("This BYOB request has been invalidated");
              }
              if (IsDetachedBuffer(this._view.buffer)) ;
              ReadableByteStreamControllerRespond(this._associatedReadableByteStreamController, bytesWritten);
            }
            respondWithNewView(view) {
              if (!IsReadableStreamBYOBRequest(this)) {
                throw byobRequestBrandCheckException("respondWithNewView");
              }
              assertRequiredArgument(view, 1, "respondWithNewView");
              if (!ArrayBuffer.isView(view)) {
                throw new TypeError("You can only respond with array buffer views");
              }
              if (this._associatedReadableByteStreamController === void 0) {
                throw new TypeError("This BYOB request has been invalidated");
              }
              if (IsDetachedBuffer(view.buffer)) ;
              ReadableByteStreamControllerRespondWithNewView(this._associatedReadableByteStreamController, view);
            }
          }
          Object.defineProperties(ReadableStreamBYOBRequest.prototype, {
            respond: { enumerable: true },
            respondWithNewView: { enumerable: true },
            view: { enumerable: true }
          });
          if (typeof SymbolPolyfill.toStringTag === "symbol") {
            Object.defineProperty(ReadableStreamBYOBRequest.prototype, SymbolPolyfill.toStringTag, {
              value: "ReadableStreamBYOBRequest",
              configurable: true
            });
          }
          class ReadableByteStreamController {
            static {
              __name(this, "ReadableByteStreamController");
            }
            constructor() {
              throw new TypeError("Illegal constructor");
            }
            /**
             * Returns the current BYOB pull request, or `null` if there isn't one.
             */
            get byobRequest() {
              if (!IsReadableByteStreamController(this)) {
                throw byteStreamControllerBrandCheckException("byobRequest");
              }
              return ReadableByteStreamControllerGetBYOBRequest(this);
            }
            /**
             * Returns the desired size to fill the controlled stream's internal queue. It can be negative, if the queue is
             * over-full. An underlying byte source ought to use this information to determine when and how to apply backpressure.
             */
            get desiredSize() {
              if (!IsReadableByteStreamController(this)) {
                throw byteStreamControllerBrandCheckException("desiredSize");
              }
              return ReadableByteStreamControllerGetDesiredSize(this);
            }
            /**
             * Closes the controlled readable stream. Consumers will still be able to read any previously-enqueued chunks from
             * the stream, but once those are read, the stream will become closed.
             */
            close() {
              if (!IsReadableByteStreamController(this)) {
                throw byteStreamControllerBrandCheckException("close");
              }
              if (this._closeRequested) {
                throw new TypeError("The stream has already been closed; do not close it again!");
              }
              const state = this._controlledReadableByteStream._state;
              if (state !== "readable") {
                throw new TypeError(`The stream (in ${state} state) is not in the readable state and cannot be closed`);
              }
              ReadableByteStreamControllerClose(this);
            }
            enqueue(chunk) {
              if (!IsReadableByteStreamController(this)) {
                throw byteStreamControllerBrandCheckException("enqueue");
              }
              assertRequiredArgument(chunk, 1, "enqueue");
              if (!ArrayBuffer.isView(chunk)) {
                throw new TypeError("chunk must be an array buffer view");
              }
              if (chunk.byteLength === 0) {
                throw new TypeError("chunk must have non-zero byteLength");
              }
              if (chunk.buffer.byteLength === 0) {
                throw new TypeError(`chunk's buffer must have non-zero byteLength`);
              }
              if (this._closeRequested) {
                throw new TypeError("stream is closed or draining");
              }
              const state = this._controlledReadableByteStream._state;
              if (state !== "readable") {
                throw new TypeError(`The stream (in ${state} state) is not in the readable state and cannot be enqueued to`);
              }
              ReadableByteStreamControllerEnqueue(this, chunk);
            }
            /**
             * Errors the controlled readable stream, making all future interactions with it fail with the given error `e`.
             */
            error(e2 = void 0) {
              if (!IsReadableByteStreamController(this)) {
                throw byteStreamControllerBrandCheckException("error");
              }
              ReadableByteStreamControllerError(this, e2);
            }
            /** @internal */
            [CancelSteps](reason) {
              ReadableByteStreamControllerClearPendingPullIntos(this);
              ResetQueue(this);
              const result = this._cancelAlgorithm(reason);
              ReadableByteStreamControllerClearAlgorithms(this);
              return result;
            }
            /** @internal */
            [PullSteps](readRequest) {
              const stream = this._controlledReadableByteStream;
              if (this._queueTotalSize > 0) {
                const entry = this._queue.shift();
                this._queueTotalSize -= entry.byteLength;
                ReadableByteStreamControllerHandleQueueDrain(this);
                const view = new Uint8Array(entry.buffer, entry.byteOffset, entry.byteLength);
                readRequest._chunkSteps(view);
                return;
              }
              const autoAllocateChunkSize = this._autoAllocateChunkSize;
              if (autoAllocateChunkSize !== void 0) {
                let buffer;
                try {
                  buffer = new ArrayBuffer(autoAllocateChunkSize);
                } catch (bufferE) {
                  readRequest._errorSteps(bufferE);
                  return;
                }
                const pullIntoDescriptor = {
                  buffer,
                  bufferByteLength: autoAllocateChunkSize,
                  byteOffset: 0,
                  byteLength: autoAllocateChunkSize,
                  bytesFilled: 0,
                  elementSize: 1,
                  viewConstructor: Uint8Array,
                  readerType: "default"
                };
                this._pendingPullIntos.push(pullIntoDescriptor);
              }
              ReadableStreamAddReadRequest(stream, readRequest);
              ReadableByteStreamControllerCallPullIfNeeded(this);
            }
          }
          Object.defineProperties(ReadableByteStreamController.prototype, {
            close: { enumerable: true },
            enqueue: { enumerable: true },
            error: { enumerable: true },
            byobRequest: { enumerable: true },
            desiredSize: { enumerable: true }
          });
          if (typeof SymbolPolyfill.toStringTag === "symbol") {
            Object.defineProperty(ReadableByteStreamController.prototype, SymbolPolyfill.toStringTag, {
              value: "ReadableByteStreamController",
              configurable: true
            });
          }
          function IsReadableByteStreamController(x2) {
            if (!typeIsObject(x2)) {
              return false;
            }
            if (!Object.prototype.hasOwnProperty.call(x2, "_controlledReadableByteStream")) {
              return false;
            }
            return x2 instanceof ReadableByteStreamController;
          }
          __name(IsReadableByteStreamController, "IsReadableByteStreamController");
          function IsReadableStreamBYOBRequest(x2) {
            if (!typeIsObject(x2)) {
              return false;
            }
            if (!Object.prototype.hasOwnProperty.call(x2, "_associatedReadableByteStreamController")) {
              return false;
            }
            return x2 instanceof ReadableStreamBYOBRequest;
          }
          __name(IsReadableStreamBYOBRequest, "IsReadableStreamBYOBRequest");
          function ReadableByteStreamControllerCallPullIfNeeded(controller) {
            const shouldPull = ReadableByteStreamControllerShouldCallPull(controller);
            if (!shouldPull) {
              return;
            }
            if (controller._pulling) {
              controller._pullAgain = true;
              return;
            }
            controller._pulling = true;
            const pullPromise = controller._pullAlgorithm();
            uponPromise(pullPromise, () => {
              controller._pulling = false;
              if (controller._pullAgain) {
                controller._pullAgain = false;
                ReadableByteStreamControllerCallPullIfNeeded(controller);
              }
            }, (e2) => {
              ReadableByteStreamControllerError(controller, e2);
            });
          }
          __name(ReadableByteStreamControllerCallPullIfNeeded, "ReadableByteStreamControllerCallPullIfNeeded");
          function ReadableByteStreamControllerClearPendingPullIntos(controller) {
            ReadableByteStreamControllerInvalidateBYOBRequest(controller);
            controller._pendingPullIntos = new SimpleQueue();
          }
          __name(ReadableByteStreamControllerClearPendingPullIntos, "ReadableByteStreamControllerClearPendingPullIntos");
          function ReadableByteStreamControllerCommitPullIntoDescriptor(stream, pullIntoDescriptor) {
            let done = false;
            if (stream._state === "closed") {
              done = true;
            }
            const filledView = ReadableByteStreamControllerConvertPullIntoDescriptor(pullIntoDescriptor);
            if (pullIntoDescriptor.readerType === "default") {
              ReadableStreamFulfillReadRequest(stream, filledView, done);
            } else {
              ReadableStreamFulfillReadIntoRequest(stream, filledView, done);
            }
          }
          __name(ReadableByteStreamControllerCommitPullIntoDescriptor, "ReadableByteStreamControllerCommitPullIntoDescriptor");
          function ReadableByteStreamControllerConvertPullIntoDescriptor(pullIntoDescriptor) {
            const bytesFilled = pullIntoDescriptor.bytesFilled;
            const elementSize = pullIntoDescriptor.elementSize;
            return new pullIntoDescriptor.viewConstructor(pullIntoDescriptor.buffer, pullIntoDescriptor.byteOffset, bytesFilled / elementSize);
          }
          __name(ReadableByteStreamControllerConvertPullIntoDescriptor, "ReadableByteStreamControllerConvertPullIntoDescriptor");
          function ReadableByteStreamControllerEnqueueChunkToQueue(controller, buffer, byteOffset, byteLength) {
            controller._queue.push({ buffer, byteOffset, byteLength });
            controller._queueTotalSize += byteLength;
          }
          __name(ReadableByteStreamControllerEnqueueChunkToQueue, "ReadableByteStreamControllerEnqueueChunkToQueue");
          function ReadableByteStreamControllerFillPullIntoDescriptorFromQueue(controller, pullIntoDescriptor) {
            const elementSize = pullIntoDescriptor.elementSize;
            const currentAlignedBytes = pullIntoDescriptor.bytesFilled - pullIntoDescriptor.bytesFilled % elementSize;
            const maxBytesToCopy = Math.min(controller._queueTotalSize, pullIntoDescriptor.byteLength - pullIntoDescriptor.bytesFilled);
            const maxBytesFilled = pullIntoDescriptor.bytesFilled + maxBytesToCopy;
            const maxAlignedBytes = maxBytesFilled - maxBytesFilled % elementSize;
            let totalBytesToCopyRemaining = maxBytesToCopy;
            let ready = false;
            if (maxAlignedBytes > currentAlignedBytes) {
              totalBytesToCopyRemaining = maxAlignedBytes - pullIntoDescriptor.bytesFilled;
              ready = true;
            }
            const queue = controller._queue;
            while (totalBytesToCopyRemaining > 0) {
              const headOfQueue = queue.peek();
              const bytesToCopy = Math.min(totalBytesToCopyRemaining, headOfQueue.byteLength);
              const destStart = pullIntoDescriptor.byteOffset + pullIntoDescriptor.bytesFilled;
              CopyDataBlockBytes(pullIntoDescriptor.buffer, destStart, headOfQueue.buffer, headOfQueue.byteOffset, bytesToCopy);
              if (headOfQueue.byteLength === bytesToCopy) {
                queue.shift();
              } else {
                headOfQueue.byteOffset += bytesToCopy;
                headOfQueue.byteLength -= bytesToCopy;
              }
              controller._queueTotalSize -= bytesToCopy;
              ReadableByteStreamControllerFillHeadPullIntoDescriptor(controller, bytesToCopy, pullIntoDescriptor);
              totalBytesToCopyRemaining -= bytesToCopy;
            }
            return ready;
          }
          __name(ReadableByteStreamControllerFillPullIntoDescriptorFromQueue, "ReadableByteStreamControllerFillPullIntoDescriptorFromQueue");
          function ReadableByteStreamControllerFillHeadPullIntoDescriptor(controller, size, pullIntoDescriptor) {
            pullIntoDescriptor.bytesFilled += size;
          }
          __name(ReadableByteStreamControllerFillHeadPullIntoDescriptor, "ReadableByteStreamControllerFillHeadPullIntoDescriptor");
          function ReadableByteStreamControllerHandleQueueDrain(controller) {
            if (controller._queueTotalSize === 0 && controller._closeRequested) {
              ReadableByteStreamControllerClearAlgorithms(controller);
              ReadableStreamClose(controller._controlledReadableByteStream);
            } else {
              ReadableByteStreamControllerCallPullIfNeeded(controller);
            }
          }
          __name(ReadableByteStreamControllerHandleQueueDrain, "ReadableByteStreamControllerHandleQueueDrain");
          function ReadableByteStreamControllerInvalidateBYOBRequest(controller) {
            if (controller._byobRequest === null) {
              return;
            }
            controller._byobRequest._associatedReadableByteStreamController = void 0;
            controller._byobRequest._view = null;
            controller._byobRequest = null;
          }
          __name(ReadableByteStreamControllerInvalidateBYOBRequest, "ReadableByteStreamControllerInvalidateBYOBRequest");
          function ReadableByteStreamControllerProcessPullIntoDescriptorsUsingQueue(controller) {
            while (controller._pendingPullIntos.length > 0) {
              if (controller._queueTotalSize === 0) {
                return;
              }
              const pullIntoDescriptor = controller._pendingPullIntos.peek();
              if (ReadableByteStreamControllerFillPullIntoDescriptorFromQueue(controller, pullIntoDescriptor)) {
                ReadableByteStreamControllerShiftPendingPullInto(controller);
                ReadableByteStreamControllerCommitPullIntoDescriptor(controller._controlledReadableByteStream, pullIntoDescriptor);
              }
            }
          }
          __name(ReadableByteStreamControllerProcessPullIntoDescriptorsUsingQueue, "ReadableByteStreamControllerProcessPullIntoDescriptorsUsingQueue");
          function ReadableByteStreamControllerPullInto(controller, view, readIntoRequest) {
            const stream = controller._controlledReadableByteStream;
            let elementSize = 1;
            if (view.constructor !== DataView) {
              elementSize = view.constructor.BYTES_PER_ELEMENT;
            }
            const ctor = view.constructor;
            const buffer = TransferArrayBuffer(view.buffer);
            const pullIntoDescriptor = {
              buffer,
              bufferByteLength: buffer.byteLength,
              byteOffset: view.byteOffset,
              byteLength: view.byteLength,
              bytesFilled: 0,
              elementSize,
              viewConstructor: ctor,
              readerType: "byob"
            };
            if (controller._pendingPullIntos.length > 0) {
              controller._pendingPullIntos.push(pullIntoDescriptor);
              ReadableStreamAddReadIntoRequest(stream, readIntoRequest);
              return;
            }
            if (stream._state === "closed") {
              const emptyView = new ctor(pullIntoDescriptor.buffer, pullIntoDescriptor.byteOffset, 0);
              readIntoRequest._closeSteps(emptyView);
              return;
            }
            if (controller._queueTotalSize > 0) {
              if (ReadableByteStreamControllerFillPullIntoDescriptorFromQueue(controller, pullIntoDescriptor)) {
                const filledView = ReadableByteStreamControllerConvertPullIntoDescriptor(pullIntoDescriptor);
                ReadableByteStreamControllerHandleQueueDrain(controller);
                readIntoRequest._chunkSteps(filledView);
                return;
              }
              if (controller._closeRequested) {
                const e2 = new TypeError("Insufficient bytes to fill elements in the given buffer");
                ReadableByteStreamControllerError(controller, e2);
                readIntoRequest._errorSteps(e2);
                return;
              }
            }
            controller._pendingPullIntos.push(pullIntoDescriptor);
            ReadableStreamAddReadIntoRequest(stream, readIntoRequest);
            ReadableByteStreamControllerCallPullIfNeeded(controller);
          }
          __name(ReadableByteStreamControllerPullInto, "ReadableByteStreamControllerPullInto");
          function ReadableByteStreamControllerRespondInClosedState(controller, firstDescriptor) {
            const stream = controller._controlledReadableByteStream;
            if (ReadableStreamHasBYOBReader(stream)) {
              while (ReadableStreamGetNumReadIntoRequests(stream) > 0) {
                const pullIntoDescriptor = ReadableByteStreamControllerShiftPendingPullInto(controller);
                ReadableByteStreamControllerCommitPullIntoDescriptor(stream, pullIntoDescriptor);
              }
            }
          }
          __name(ReadableByteStreamControllerRespondInClosedState, "ReadableByteStreamControllerRespondInClosedState");
          function ReadableByteStreamControllerRespondInReadableState(controller, bytesWritten, pullIntoDescriptor) {
            ReadableByteStreamControllerFillHeadPullIntoDescriptor(controller, bytesWritten, pullIntoDescriptor);
            if (pullIntoDescriptor.bytesFilled < pullIntoDescriptor.elementSize) {
              return;
            }
            ReadableByteStreamControllerShiftPendingPullInto(controller);
            const remainderSize = pullIntoDescriptor.bytesFilled % pullIntoDescriptor.elementSize;
            if (remainderSize > 0) {
              const end = pullIntoDescriptor.byteOffset + pullIntoDescriptor.bytesFilled;
              const remainder = ArrayBufferSlice(pullIntoDescriptor.buffer, end - remainderSize, end);
              ReadableByteStreamControllerEnqueueChunkToQueue(controller, remainder, 0, remainder.byteLength);
            }
            pullIntoDescriptor.bytesFilled -= remainderSize;
            ReadableByteStreamControllerCommitPullIntoDescriptor(controller._controlledReadableByteStream, pullIntoDescriptor);
            ReadableByteStreamControllerProcessPullIntoDescriptorsUsingQueue(controller);
          }
          __name(ReadableByteStreamControllerRespondInReadableState, "ReadableByteStreamControllerRespondInReadableState");
          function ReadableByteStreamControllerRespondInternal(controller, bytesWritten) {
            const firstDescriptor = controller._pendingPullIntos.peek();
            ReadableByteStreamControllerInvalidateBYOBRequest(controller);
            const state = controller._controlledReadableByteStream._state;
            if (state === "closed") {
              ReadableByteStreamControllerRespondInClosedState(controller);
            } else {
              ReadableByteStreamControllerRespondInReadableState(controller, bytesWritten, firstDescriptor);
            }
            ReadableByteStreamControllerCallPullIfNeeded(controller);
          }
          __name(ReadableByteStreamControllerRespondInternal, "ReadableByteStreamControllerRespondInternal");
          function ReadableByteStreamControllerShiftPendingPullInto(controller) {
            const descriptor = controller._pendingPullIntos.shift();
            return descriptor;
          }
          __name(ReadableByteStreamControllerShiftPendingPullInto, "ReadableByteStreamControllerShiftPendingPullInto");
          function ReadableByteStreamControllerShouldCallPull(controller) {
            const stream = controller._controlledReadableByteStream;
            if (stream._state !== "readable") {
              return false;
            }
            if (controller._closeRequested) {
              return false;
            }
            if (!controller._started) {
              return false;
            }
            if (ReadableStreamHasDefaultReader(stream) && ReadableStreamGetNumReadRequests(stream) > 0) {
              return true;
            }
            if (ReadableStreamHasBYOBReader(stream) && ReadableStreamGetNumReadIntoRequests(stream) > 0) {
              return true;
            }
            const desiredSize = ReadableByteStreamControllerGetDesiredSize(controller);
            if (desiredSize > 0) {
              return true;
            }
            return false;
          }
          __name(ReadableByteStreamControllerShouldCallPull, "ReadableByteStreamControllerShouldCallPull");
          function ReadableByteStreamControllerClearAlgorithms(controller) {
            controller._pullAlgorithm = void 0;
            controller._cancelAlgorithm = void 0;
          }
          __name(ReadableByteStreamControllerClearAlgorithms, "ReadableByteStreamControllerClearAlgorithms");
          function ReadableByteStreamControllerClose(controller) {
            const stream = controller._controlledReadableByteStream;
            if (controller._closeRequested || stream._state !== "readable") {
              return;
            }
            if (controller._queueTotalSize > 0) {
              controller._closeRequested = true;
              return;
            }
            if (controller._pendingPullIntos.length > 0) {
              const firstPendingPullInto = controller._pendingPullIntos.peek();
              if (firstPendingPullInto.bytesFilled > 0) {
                const e2 = new TypeError("Insufficient bytes to fill elements in the given buffer");
                ReadableByteStreamControllerError(controller, e2);
                throw e2;
              }
            }
            ReadableByteStreamControllerClearAlgorithms(controller);
            ReadableStreamClose(stream);
          }
          __name(ReadableByteStreamControllerClose, "ReadableByteStreamControllerClose");
          function ReadableByteStreamControllerEnqueue(controller, chunk) {
            const stream = controller._controlledReadableByteStream;
            if (controller._closeRequested || stream._state !== "readable") {
              return;
            }
            const buffer = chunk.buffer;
            const byteOffset = chunk.byteOffset;
            const byteLength = chunk.byteLength;
            const transferredBuffer = TransferArrayBuffer(buffer);
            if (controller._pendingPullIntos.length > 0) {
              const firstPendingPullInto = controller._pendingPullIntos.peek();
              if (IsDetachedBuffer(firstPendingPullInto.buffer)) ;
              firstPendingPullInto.buffer = TransferArrayBuffer(firstPendingPullInto.buffer);
            }
            ReadableByteStreamControllerInvalidateBYOBRequest(controller);
            if (ReadableStreamHasDefaultReader(stream)) {
              if (ReadableStreamGetNumReadRequests(stream) === 0) {
                ReadableByteStreamControllerEnqueueChunkToQueue(controller, transferredBuffer, byteOffset, byteLength);
              } else {
                if (controller._pendingPullIntos.length > 0) {
                  ReadableByteStreamControllerShiftPendingPullInto(controller);
                }
                const transferredView = new Uint8Array(transferredBuffer, byteOffset, byteLength);
                ReadableStreamFulfillReadRequest(stream, transferredView, false);
              }
            } else if (ReadableStreamHasBYOBReader(stream)) {
              ReadableByteStreamControllerEnqueueChunkToQueue(controller, transferredBuffer, byteOffset, byteLength);
              ReadableByteStreamControllerProcessPullIntoDescriptorsUsingQueue(controller);
            } else {
              ReadableByteStreamControllerEnqueueChunkToQueue(controller, transferredBuffer, byteOffset, byteLength);
            }
            ReadableByteStreamControllerCallPullIfNeeded(controller);
          }
          __name(ReadableByteStreamControllerEnqueue, "ReadableByteStreamControllerEnqueue");
          function ReadableByteStreamControllerError(controller, e2) {
            const stream = controller._controlledReadableByteStream;
            if (stream._state !== "readable") {
              return;
            }
            ReadableByteStreamControllerClearPendingPullIntos(controller);
            ResetQueue(controller);
            ReadableByteStreamControllerClearAlgorithms(controller);
            ReadableStreamError(stream, e2);
          }
          __name(ReadableByteStreamControllerError, "ReadableByteStreamControllerError");
          function ReadableByteStreamControllerGetBYOBRequest(controller) {
            if (controller._byobRequest === null && controller._pendingPullIntos.length > 0) {
              const firstDescriptor = controller._pendingPullIntos.peek();
              const view = new Uint8Array(firstDescriptor.buffer, firstDescriptor.byteOffset + firstDescriptor.bytesFilled, firstDescriptor.byteLength - firstDescriptor.bytesFilled);
              const byobRequest = Object.create(ReadableStreamBYOBRequest.prototype);
              SetUpReadableStreamBYOBRequest(byobRequest, controller, view);
              controller._byobRequest = byobRequest;
            }
            return controller._byobRequest;
          }
          __name(ReadableByteStreamControllerGetBYOBRequest, "ReadableByteStreamControllerGetBYOBRequest");
          function ReadableByteStreamControllerGetDesiredSize(controller) {
            const state = controller._controlledReadableByteStream._state;
            if (state === "errored") {
              return null;
            }
            if (state === "closed") {
              return 0;
            }
            return controller._strategyHWM - controller._queueTotalSize;
          }
          __name(ReadableByteStreamControllerGetDesiredSize, "ReadableByteStreamControllerGetDesiredSize");
          function ReadableByteStreamControllerRespond(controller, bytesWritten) {
            const firstDescriptor = controller._pendingPullIntos.peek();
            const state = controller._controlledReadableByteStream._state;
            if (state === "closed") {
              if (bytesWritten !== 0) {
                throw new TypeError("bytesWritten must be 0 when calling respond() on a closed stream");
              }
            } else {
              if (bytesWritten === 0) {
                throw new TypeError("bytesWritten must be greater than 0 when calling respond() on a readable stream");
              }
              if (firstDescriptor.bytesFilled + bytesWritten > firstDescriptor.byteLength) {
                throw new RangeError("bytesWritten out of range");
              }
            }
            firstDescriptor.buffer = TransferArrayBuffer(firstDescriptor.buffer);
            ReadableByteStreamControllerRespondInternal(controller, bytesWritten);
          }
          __name(ReadableByteStreamControllerRespond, "ReadableByteStreamControllerRespond");
          function ReadableByteStreamControllerRespondWithNewView(controller, view) {
            const firstDescriptor = controller._pendingPullIntos.peek();
            const state = controller._controlledReadableByteStream._state;
            if (state === "closed") {
              if (view.byteLength !== 0) {
                throw new TypeError("The view's length must be 0 when calling respondWithNewView() on a closed stream");
              }
            } else {
              if (view.byteLength === 0) {
                throw new TypeError("The view's length must be greater than 0 when calling respondWithNewView() on a readable stream");
              }
            }
            if (firstDescriptor.byteOffset + firstDescriptor.bytesFilled !== view.byteOffset) {
              throw new RangeError("The region specified by view does not match byobRequest");
            }
            if (firstDescriptor.bufferByteLength !== view.buffer.byteLength) {
              throw new RangeError("The buffer of view has different capacity than byobRequest");
            }
            if (firstDescriptor.bytesFilled + view.byteLength > firstDescriptor.byteLength) {
              throw new RangeError("The region specified by view is larger than byobRequest");
            }
            const viewByteLength = view.byteLength;
            firstDescriptor.buffer = TransferArrayBuffer(view.buffer);
            ReadableByteStreamControllerRespondInternal(controller, viewByteLength);
          }
          __name(ReadableByteStreamControllerRespondWithNewView, "ReadableByteStreamControllerRespondWithNewView");
          function SetUpReadableByteStreamController(stream, controller, startAlgorithm, pullAlgorithm, cancelAlgorithm, highWaterMark, autoAllocateChunkSize) {
            controller._controlledReadableByteStream = stream;
            controller._pullAgain = false;
            controller._pulling = false;
            controller._byobRequest = null;
            controller._queue = controller._queueTotalSize = void 0;
            ResetQueue(controller);
            controller._closeRequested = false;
            controller._started = false;
            controller._strategyHWM = highWaterMark;
            controller._pullAlgorithm = pullAlgorithm;
            controller._cancelAlgorithm = cancelAlgorithm;
            controller._autoAllocateChunkSize = autoAllocateChunkSize;
            controller._pendingPullIntos = new SimpleQueue();
            stream._readableStreamController = controller;
            const startResult = startAlgorithm();
            uponPromise(promiseResolvedWith(startResult), () => {
              controller._started = true;
              ReadableByteStreamControllerCallPullIfNeeded(controller);
            }, (r2) => {
              ReadableByteStreamControllerError(controller, r2);
            });
          }
          __name(SetUpReadableByteStreamController, "SetUpReadableByteStreamController");
          function SetUpReadableByteStreamControllerFromUnderlyingSource(stream, underlyingByteSource, highWaterMark) {
            const controller = Object.create(ReadableByteStreamController.prototype);
            let startAlgorithm = /* @__PURE__ */ __name(() => void 0, "startAlgorithm");
            let pullAlgorithm = /* @__PURE__ */ __name(() => promiseResolvedWith(void 0), "pullAlgorithm");
            let cancelAlgorithm = /* @__PURE__ */ __name(() => promiseResolvedWith(void 0), "cancelAlgorithm");
            if (underlyingByteSource.start !== void 0) {
              startAlgorithm = /* @__PURE__ */ __name(() => underlyingByteSource.start(controller), "startAlgorithm");
            }
            if (underlyingByteSource.pull !== void 0) {
              pullAlgorithm = /* @__PURE__ */ __name(() => underlyingByteSource.pull(controller), "pullAlgorithm");
            }
            if (underlyingByteSource.cancel !== void 0) {
              cancelAlgorithm = /* @__PURE__ */ __name((reason) => underlyingByteSource.cancel(reason), "cancelAlgorithm");
            }
            const autoAllocateChunkSize = underlyingByteSource.autoAllocateChunkSize;
            if (autoAllocateChunkSize === 0) {
              throw new TypeError("autoAllocateChunkSize must be greater than 0");
            }
            SetUpReadableByteStreamController(stream, controller, startAlgorithm, pullAlgorithm, cancelAlgorithm, highWaterMark, autoAllocateChunkSize);
          }
          __name(SetUpReadableByteStreamControllerFromUnderlyingSource, "SetUpReadableByteStreamControllerFromUnderlyingSource");
          function SetUpReadableStreamBYOBRequest(request, controller, view) {
            request._associatedReadableByteStreamController = controller;
            request._view = view;
          }
          __name(SetUpReadableStreamBYOBRequest, "SetUpReadableStreamBYOBRequest");
          function byobRequestBrandCheckException(name) {
            return new TypeError(`ReadableStreamBYOBRequest.prototype.${name} can only be used on a ReadableStreamBYOBRequest`);
          }
          __name(byobRequestBrandCheckException, "byobRequestBrandCheckException");
          function byteStreamControllerBrandCheckException(name) {
            return new TypeError(`ReadableByteStreamController.prototype.${name} can only be used on a ReadableByteStreamController`);
          }
          __name(byteStreamControllerBrandCheckException, "byteStreamControllerBrandCheckException");
          function AcquireReadableStreamBYOBReader(stream) {
            return new ReadableStreamBYOBReader(stream);
          }
          __name(AcquireReadableStreamBYOBReader, "AcquireReadableStreamBYOBReader");
          function ReadableStreamAddReadIntoRequest(stream, readIntoRequest) {
            stream._reader._readIntoRequests.push(readIntoRequest);
          }
          __name(ReadableStreamAddReadIntoRequest, "ReadableStreamAddReadIntoRequest");
          function ReadableStreamFulfillReadIntoRequest(stream, chunk, done) {
            const reader = stream._reader;
            const readIntoRequest = reader._readIntoRequests.shift();
            if (done) {
              readIntoRequest._closeSteps(chunk);
            } else {
              readIntoRequest._chunkSteps(chunk);
            }
          }
          __name(ReadableStreamFulfillReadIntoRequest, "ReadableStreamFulfillReadIntoRequest");
          function ReadableStreamGetNumReadIntoRequests(stream) {
            return stream._reader._readIntoRequests.length;
          }
          __name(ReadableStreamGetNumReadIntoRequests, "ReadableStreamGetNumReadIntoRequests");
          function ReadableStreamHasBYOBReader(stream) {
            const reader = stream._reader;
            if (reader === void 0) {
              return false;
            }
            if (!IsReadableStreamBYOBReader(reader)) {
              return false;
            }
            return true;
          }
          __name(ReadableStreamHasBYOBReader, "ReadableStreamHasBYOBReader");
          class ReadableStreamBYOBReader {
            static {
              __name(this, "ReadableStreamBYOBReader");
            }
            constructor(stream) {
              assertRequiredArgument(stream, 1, "ReadableStreamBYOBReader");
              assertReadableStream(stream, "First parameter");
              if (IsReadableStreamLocked(stream)) {
                throw new TypeError("This stream has already been locked for exclusive reading by another reader");
              }
              if (!IsReadableByteStreamController(stream._readableStreamController)) {
                throw new TypeError("Cannot construct a ReadableStreamBYOBReader for a stream not constructed with a byte source");
              }
              ReadableStreamReaderGenericInitialize(this, stream);
              this._readIntoRequests = new SimpleQueue();
            }
            /**
             * Returns a promise that will be fulfilled when the stream becomes closed, or rejected if the stream ever errors or
             * the reader's lock is released before the stream finishes closing.
             */
            get closed() {
              if (!IsReadableStreamBYOBReader(this)) {
                return promiseRejectedWith(byobReaderBrandCheckException("closed"));
              }
              return this._closedPromise;
            }
            /**
             * If the reader is active, behaves the same as {@link ReadableStream.cancel | stream.cancel(reason)}.
             */
            cancel(reason = void 0) {
              if (!IsReadableStreamBYOBReader(this)) {
                return promiseRejectedWith(byobReaderBrandCheckException("cancel"));
              }
              if (this._ownerReadableStream === void 0) {
                return promiseRejectedWith(readerLockException("cancel"));
              }
              return ReadableStreamReaderGenericCancel(this, reason);
            }
            /**
             * Attempts to reads bytes into view, and returns a promise resolved with the result.
             *
             * If reading a chunk causes the queue to become empty, more data will be pulled from the underlying source.
             */
            read(view) {
              if (!IsReadableStreamBYOBReader(this)) {
                return promiseRejectedWith(byobReaderBrandCheckException("read"));
              }
              if (!ArrayBuffer.isView(view)) {
                return promiseRejectedWith(new TypeError("view must be an array buffer view"));
              }
              if (view.byteLength === 0) {
                return promiseRejectedWith(new TypeError("view must have non-zero byteLength"));
              }
              if (view.buffer.byteLength === 0) {
                return promiseRejectedWith(new TypeError(`view's buffer must have non-zero byteLength`));
              }
              if (IsDetachedBuffer(view.buffer)) ;
              if (this._ownerReadableStream === void 0) {
                return promiseRejectedWith(readerLockException("read from"));
              }
              let resolvePromise;
              let rejectPromise;
              const promise = newPromise((resolve, reject) => {
                resolvePromise = resolve;
                rejectPromise = reject;
              });
              const readIntoRequest = {
                _chunkSteps: /* @__PURE__ */ __name((chunk) => resolvePromise({ value: chunk, done: false }), "_chunkSteps"),
                _closeSteps: /* @__PURE__ */ __name((chunk) => resolvePromise({ value: chunk, done: true }), "_closeSteps"),
                _errorSteps: /* @__PURE__ */ __name((e2) => rejectPromise(e2), "_errorSteps")
              };
              ReadableStreamBYOBReaderRead(this, view, readIntoRequest);
              return promise;
            }
            /**
             * Releases the reader's lock on the corresponding stream. After the lock is released, the reader is no longer active.
             * If the associated stream is errored when the lock is released, the reader will appear errored in the same way
             * from now on; otherwise, the reader will appear closed.
             *
             * A reader's lock cannot be released while it still has a pending read request, i.e., if a promise returned by
             * the reader's {@link ReadableStreamBYOBReader.read | read()} method has not yet been settled. Attempting to
             * do so will throw a `TypeError` and leave the reader locked to the stream.
             */
            releaseLock() {
              if (!IsReadableStreamBYOBReader(this)) {
                throw byobReaderBrandCheckException("releaseLock");
              }
              if (this._ownerReadableStream === void 0) {
                return;
              }
              if (this._readIntoRequests.length > 0) {
                throw new TypeError("Tried to release a reader lock when that reader has pending read() calls un-settled");
              }
              ReadableStreamReaderGenericRelease(this);
            }
          }
          Object.defineProperties(ReadableStreamBYOBReader.prototype, {
            cancel: { enumerable: true },
            read: { enumerable: true },
            releaseLock: { enumerable: true },
            closed: { enumerable: true }
          });
          if (typeof SymbolPolyfill.toStringTag === "symbol") {
            Object.defineProperty(ReadableStreamBYOBReader.prototype, SymbolPolyfill.toStringTag, {
              value: "ReadableStreamBYOBReader",
              configurable: true
            });
          }
          function IsReadableStreamBYOBReader(x2) {
            if (!typeIsObject(x2)) {
              return false;
            }
            if (!Object.prototype.hasOwnProperty.call(x2, "_readIntoRequests")) {
              return false;
            }
            return x2 instanceof ReadableStreamBYOBReader;
          }
          __name(IsReadableStreamBYOBReader, "IsReadableStreamBYOBReader");
          function ReadableStreamBYOBReaderRead(reader, view, readIntoRequest) {
            const stream = reader._ownerReadableStream;
            stream._disturbed = true;
            if (stream._state === "errored") {
              readIntoRequest._errorSteps(stream._storedError);
            } else {
              ReadableByteStreamControllerPullInto(stream._readableStreamController, view, readIntoRequest);
            }
          }
          __name(ReadableStreamBYOBReaderRead, "ReadableStreamBYOBReaderRead");
          function byobReaderBrandCheckException(name) {
            return new TypeError(`ReadableStreamBYOBReader.prototype.${name} can only be used on a ReadableStreamBYOBReader`);
          }
          __name(byobReaderBrandCheckException, "byobReaderBrandCheckException");
          function ExtractHighWaterMark(strategy, defaultHWM) {
            const { highWaterMark } = strategy;
            if (highWaterMark === void 0) {
              return defaultHWM;
            }
            if (NumberIsNaN(highWaterMark) || highWaterMark < 0) {
              throw new RangeError("Invalid highWaterMark");
            }
            return highWaterMark;
          }
          __name(ExtractHighWaterMark, "ExtractHighWaterMark");
          function ExtractSizeAlgorithm(strategy) {
            const { size } = strategy;
            if (!size) {
              return () => 1;
            }
            return size;
          }
          __name(ExtractSizeAlgorithm, "ExtractSizeAlgorithm");
          function convertQueuingStrategy(init, context) {
            assertDictionary(init, context);
            const highWaterMark = init === null || init === void 0 ? void 0 : init.highWaterMark;
            const size = init === null || init === void 0 ? void 0 : init.size;
            return {
              highWaterMark: highWaterMark === void 0 ? void 0 : convertUnrestrictedDouble(highWaterMark),
              size: size === void 0 ? void 0 : convertQueuingStrategySize(size, `${context} has member 'size' that`)
            };
          }
          __name(convertQueuingStrategy, "convertQueuingStrategy");
          function convertQueuingStrategySize(fn, context) {
            assertFunction(fn, context);
            return (chunk) => convertUnrestrictedDouble(fn(chunk));
          }
          __name(convertQueuingStrategySize, "convertQueuingStrategySize");
          function convertUnderlyingSink(original, context) {
            assertDictionary(original, context);
            const abort = original === null || original === void 0 ? void 0 : original.abort;
            const close = original === null || original === void 0 ? void 0 : original.close;
            const start = original === null || original === void 0 ? void 0 : original.start;
            const type = original === null || original === void 0 ? void 0 : original.type;
            const write = original === null || original === void 0 ? void 0 : original.write;
            return {
              abort: abort === void 0 ? void 0 : convertUnderlyingSinkAbortCallback(abort, original, `${context} has member 'abort' that`),
              close: close === void 0 ? void 0 : convertUnderlyingSinkCloseCallback(close, original, `${context} has member 'close' that`),
              start: start === void 0 ? void 0 : convertUnderlyingSinkStartCallback(start, original, `${context} has member 'start' that`),
              write: write === void 0 ? void 0 : convertUnderlyingSinkWriteCallback(write, original, `${context} has member 'write' that`),
              type
            };
          }
          __name(convertUnderlyingSink, "convertUnderlyingSink");
          function convertUnderlyingSinkAbortCallback(fn, original, context) {
            assertFunction(fn, context);
            return (reason) => promiseCall(fn, original, [reason]);
          }
          __name(convertUnderlyingSinkAbortCallback, "convertUnderlyingSinkAbortCallback");
          function convertUnderlyingSinkCloseCallback(fn, original, context) {
            assertFunction(fn, context);
            return () => promiseCall(fn, original, []);
          }
          __name(convertUnderlyingSinkCloseCallback, "convertUnderlyingSinkCloseCallback");
          function convertUnderlyingSinkStartCallback(fn, original, context) {
            assertFunction(fn, context);
            return (controller) => reflectCall(fn, original, [controller]);
          }
          __name(convertUnderlyingSinkStartCallback, "convertUnderlyingSinkStartCallback");
          function convertUnderlyingSinkWriteCallback(fn, original, context) {
            assertFunction(fn, context);
            return (chunk, controller) => promiseCall(fn, original, [chunk, controller]);
          }
          __name(convertUnderlyingSinkWriteCallback, "convertUnderlyingSinkWriteCallback");
          function assertWritableStream(x2, context) {
            if (!IsWritableStream(x2)) {
              throw new TypeError(`${context} is not a WritableStream.`);
            }
          }
          __name(assertWritableStream, "assertWritableStream");
          function isAbortSignal(value) {
            if (typeof value !== "object" || value === null) {
              return false;
            }
            try {
              return typeof value.aborted === "boolean";
            } catch (_a) {
              return false;
            }
          }
          __name(isAbortSignal, "isAbortSignal");
          const supportsAbortController = typeof AbortController === "function";
          function createAbortController() {
            if (supportsAbortController) {
              return new AbortController();
            }
            return void 0;
          }
          __name(createAbortController, "createAbortController");
          class WritableStream {
            static {
              __name(this, "WritableStream");
            }
            constructor(rawUnderlyingSink = {}, rawStrategy = {}) {
              if (rawUnderlyingSink === void 0) {
                rawUnderlyingSink = null;
              } else {
                assertObject(rawUnderlyingSink, "First parameter");
              }
              const strategy = convertQueuingStrategy(rawStrategy, "Second parameter");
              const underlyingSink = convertUnderlyingSink(rawUnderlyingSink, "First parameter");
              InitializeWritableStream(this);
              const type = underlyingSink.type;
              if (type !== void 0) {
                throw new RangeError("Invalid type is specified");
              }
              const sizeAlgorithm = ExtractSizeAlgorithm(strategy);
              const highWaterMark = ExtractHighWaterMark(strategy, 1);
              SetUpWritableStreamDefaultControllerFromUnderlyingSink(this, underlyingSink, highWaterMark, sizeAlgorithm);
            }
            /**
             * Returns whether or not the writable stream is locked to a writer.
             */
            get locked() {
              if (!IsWritableStream(this)) {
                throw streamBrandCheckException$2("locked");
              }
              return IsWritableStreamLocked(this);
            }
            /**
             * Aborts the stream, signaling that the producer can no longer successfully write to the stream and it is to be
             * immediately moved to an errored state, with any queued-up writes discarded. This will also execute any abort
             * mechanism of the underlying sink.
             *
             * The returned promise will fulfill if the stream shuts down successfully, or reject if the underlying sink signaled
             * that there was an error doing so. Additionally, it will reject with a `TypeError` (without attempting to cancel
             * the stream) if the stream is currently locked.
             */
            abort(reason = void 0) {
              if (!IsWritableStream(this)) {
                return promiseRejectedWith(streamBrandCheckException$2("abort"));
              }
              if (IsWritableStreamLocked(this)) {
                return promiseRejectedWith(new TypeError("Cannot abort a stream that already has a writer"));
              }
              return WritableStreamAbort(this, reason);
            }
            /**
             * Closes the stream. The underlying sink will finish processing any previously-written chunks, before invoking its
             * close behavior. During this time any further attempts to write will fail (without erroring the stream).
             *
             * The method returns a promise that will fulfill if all remaining chunks are successfully written and the stream
             * successfully closes, or rejects if an error is encountered during this process. Additionally, it will reject with
             * a `TypeError` (without attempting to cancel the stream) if the stream is currently locked.
             */
            close() {
              if (!IsWritableStream(this)) {
                return promiseRejectedWith(streamBrandCheckException$2("close"));
              }
              if (IsWritableStreamLocked(this)) {
                return promiseRejectedWith(new TypeError("Cannot close a stream that already has a writer"));
              }
              if (WritableStreamCloseQueuedOrInFlight(this)) {
                return promiseRejectedWith(new TypeError("Cannot close an already-closing stream"));
              }
              return WritableStreamClose(this);
            }
            /**
             * Creates a {@link WritableStreamDefaultWriter | writer} and locks the stream to the new writer. While the stream
             * is locked, no other writer can be acquired until this one is released.
             *
             * This functionality is especially useful for creating abstractions that desire the ability to write to a stream
             * without interruption or interleaving. By getting a writer for the stream, you can ensure nobody else can write at
             * the same time, which would cause the resulting written data to be unpredictable and probably useless.
             */
            getWriter() {
              if (!IsWritableStream(this)) {
                throw streamBrandCheckException$2("getWriter");
              }
              return AcquireWritableStreamDefaultWriter(this);
            }
          }
          Object.defineProperties(WritableStream.prototype, {
            abort: { enumerable: true },
            close: { enumerable: true },
            getWriter: { enumerable: true },
            locked: { enumerable: true }
          });
          if (typeof SymbolPolyfill.toStringTag === "symbol") {
            Object.defineProperty(WritableStream.prototype, SymbolPolyfill.toStringTag, {
              value: "WritableStream",
              configurable: true
            });
          }
          function AcquireWritableStreamDefaultWriter(stream) {
            return new WritableStreamDefaultWriter(stream);
          }
          __name(AcquireWritableStreamDefaultWriter, "AcquireWritableStreamDefaultWriter");
          function CreateWritableStream(startAlgorithm, writeAlgorithm, closeAlgorithm, abortAlgorithm, highWaterMark = 1, sizeAlgorithm = () => 1) {
            const stream = Object.create(WritableStream.prototype);
            InitializeWritableStream(stream);
            const controller = Object.create(WritableStreamDefaultController.prototype);
            SetUpWritableStreamDefaultController(stream, controller, startAlgorithm, writeAlgorithm, closeAlgorithm, abortAlgorithm, highWaterMark, sizeAlgorithm);
            return stream;
          }
          __name(CreateWritableStream, "CreateWritableStream");
          function InitializeWritableStream(stream) {
            stream._state = "writable";
            stream._storedError = void 0;
            stream._writer = void 0;
            stream._writableStreamController = void 0;
            stream._writeRequests = new SimpleQueue();
            stream._inFlightWriteRequest = void 0;
            stream._closeRequest = void 0;
            stream._inFlightCloseRequest = void 0;
            stream._pendingAbortRequest = void 0;
            stream._backpressure = false;
          }
          __name(InitializeWritableStream, "InitializeWritableStream");
          function IsWritableStream(x2) {
            if (!typeIsObject(x2)) {
              return false;
            }
            if (!Object.prototype.hasOwnProperty.call(x2, "_writableStreamController")) {
              return false;
            }
            return x2 instanceof WritableStream;
          }
          __name(IsWritableStream, "IsWritableStream");
          function IsWritableStreamLocked(stream) {
            if (stream._writer === void 0) {
              return false;
            }
            return true;
          }
          __name(IsWritableStreamLocked, "IsWritableStreamLocked");
          function WritableStreamAbort(stream, reason) {
            var _a;
            if (stream._state === "closed" || stream._state === "errored") {
              return promiseResolvedWith(void 0);
            }
            stream._writableStreamController._abortReason = reason;
            (_a = stream._writableStreamController._abortController) === null || _a === void 0 ? void 0 : _a.abort();
            const state = stream._state;
            if (state === "closed" || state === "errored") {
              return promiseResolvedWith(void 0);
            }
            if (stream._pendingAbortRequest !== void 0) {
              return stream._pendingAbortRequest._promise;
            }
            let wasAlreadyErroring = false;
            if (state === "erroring") {
              wasAlreadyErroring = true;
              reason = void 0;
            }
            const promise = newPromise((resolve, reject) => {
              stream._pendingAbortRequest = {
                _promise: void 0,
                _resolve: resolve,
                _reject: reject,
                _reason: reason,
                _wasAlreadyErroring: wasAlreadyErroring
              };
            });
            stream._pendingAbortRequest._promise = promise;
            if (!wasAlreadyErroring) {
              WritableStreamStartErroring(stream, reason);
            }
            return promise;
          }
          __name(WritableStreamAbort, "WritableStreamAbort");
          function WritableStreamClose(stream) {
            const state = stream._state;
            if (state === "closed" || state === "errored") {
              return promiseRejectedWith(new TypeError(`The stream (in ${state} state) is not in the writable state and cannot be closed`));
            }
            const promise = newPromise((resolve, reject) => {
              const closeRequest = {
                _resolve: resolve,
                _reject: reject
              };
              stream._closeRequest = closeRequest;
            });
            const writer = stream._writer;
            if (writer !== void 0 && stream._backpressure && state === "writable") {
              defaultWriterReadyPromiseResolve(writer);
            }
            WritableStreamDefaultControllerClose(stream._writableStreamController);
            return promise;
          }
          __name(WritableStreamClose, "WritableStreamClose");
          function WritableStreamAddWriteRequest(stream) {
            const promise = newPromise((resolve, reject) => {
              const writeRequest = {
                _resolve: resolve,
                _reject: reject
              };
              stream._writeRequests.push(writeRequest);
            });
            return promise;
          }
          __name(WritableStreamAddWriteRequest, "WritableStreamAddWriteRequest");
          function WritableStreamDealWithRejection(stream, error) {
            const state = stream._state;
            if (state === "writable") {
              WritableStreamStartErroring(stream, error);
              return;
            }
            WritableStreamFinishErroring(stream);
          }
          __name(WritableStreamDealWithRejection, "WritableStreamDealWithRejection");
          function WritableStreamStartErroring(stream, reason) {
            const controller = stream._writableStreamController;
            stream._state = "erroring";
            stream._storedError = reason;
            const writer = stream._writer;
            if (writer !== void 0) {
              WritableStreamDefaultWriterEnsureReadyPromiseRejected(writer, reason);
            }
            if (!WritableStreamHasOperationMarkedInFlight(stream) && controller._started) {
              WritableStreamFinishErroring(stream);
            }
          }
          __name(WritableStreamStartErroring, "WritableStreamStartErroring");
          function WritableStreamFinishErroring(stream) {
            stream._state = "errored";
            stream._writableStreamController[ErrorSteps]();
            const storedError = stream._storedError;
            stream._writeRequests.forEach((writeRequest) => {
              writeRequest._reject(storedError);
            });
            stream._writeRequests = new SimpleQueue();
            if (stream._pendingAbortRequest === void 0) {
              WritableStreamRejectCloseAndClosedPromiseIfNeeded(stream);
              return;
            }
            const abortRequest = stream._pendingAbortRequest;
            stream._pendingAbortRequest = void 0;
            if (abortRequest._wasAlreadyErroring) {
              abortRequest._reject(storedError);
              WritableStreamRejectCloseAndClosedPromiseIfNeeded(stream);
              return;
            }
            const promise = stream._writableStreamController[AbortSteps](abortRequest._reason);
            uponPromise(promise, () => {
              abortRequest._resolve();
              WritableStreamRejectCloseAndClosedPromiseIfNeeded(stream);
            }, (reason) => {
              abortRequest._reject(reason);
              WritableStreamRejectCloseAndClosedPromiseIfNeeded(stream);
            });
          }
          __name(WritableStreamFinishErroring, "WritableStreamFinishErroring");
          function WritableStreamFinishInFlightWrite(stream) {
            stream._inFlightWriteRequest._resolve(void 0);
            stream._inFlightWriteRequest = void 0;
          }
          __name(WritableStreamFinishInFlightWrite, "WritableStreamFinishInFlightWrite");
          function WritableStreamFinishInFlightWriteWithError(stream, error) {
            stream._inFlightWriteRequest._reject(error);
            stream._inFlightWriteRequest = void 0;
            WritableStreamDealWithRejection(stream, error);
          }
          __name(WritableStreamFinishInFlightWriteWithError, "WritableStreamFinishInFlightWriteWithError");
          function WritableStreamFinishInFlightClose(stream) {
            stream._inFlightCloseRequest._resolve(void 0);
            stream._inFlightCloseRequest = void 0;
            const state = stream._state;
            if (state === "erroring") {
              stream._storedError = void 0;
              if (stream._pendingAbortRequest !== void 0) {
                stream._pendingAbortRequest._resolve();
                stream._pendingAbortRequest = void 0;
              }
            }
            stream._state = "closed";
            const writer = stream._writer;
            if (writer !== void 0) {
              defaultWriterClosedPromiseResolve(writer);
            }
          }
          __name(WritableStreamFinishInFlightClose, "WritableStreamFinishInFlightClose");
          function WritableStreamFinishInFlightCloseWithError(stream, error) {
            stream._inFlightCloseRequest._reject(error);
            stream._inFlightCloseRequest = void 0;
            if (stream._pendingAbortRequest !== void 0) {
              stream._pendingAbortRequest._reject(error);
              stream._pendingAbortRequest = void 0;
            }
            WritableStreamDealWithRejection(stream, error);
          }
          __name(WritableStreamFinishInFlightCloseWithError, "WritableStreamFinishInFlightCloseWithError");
          function WritableStreamCloseQueuedOrInFlight(stream) {
            if (stream._closeRequest === void 0 && stream._inFlightCloseRequest === void 0) {
              return false;
            }
            return true;
          }
          __name(WritableStreamCloseQueuedOrInFlight, "WritableStreamCloseQueuedOrInFlight");
          function WritableStreamHasOperationMarkedInFlight(stream) {
            if (stream._inFlightWriteRequest === void 0 && stream._inFlightCloseRequest === void 0) {
              return false;
            }
            return true;
          }
          __name(WritableStreamHasOperationMarkedInFlight, "WritableStreamHasOperationMarkedInFlight");
          function WritableStreamMarkCloseRequestInFlight(stream) {
            stream._inFlightCloseRequest = stream._closeRequest;
            stream._closeRequest = void 0;
          }
          __name(WritableStreamMarkCloseRequestInFlight, "WritableStreamMarkCloseRequestInFlight");
          function WritableStreamMarkFirstWriteRequestInFlight(stream) {
            stream._inFlightWriteRequest = stream._writeRequests.shift();
          }
          __name(WritableStreamMarkFirstWriteRequestInFlight, "WritableStreamMarkFirstWriteRequestInFlight");
          function WritableStreamRejectCloseAndClosedPromiseIfNeeded(stream) {
            if (stream._closeRequest !== void 0) {
              stream._closeRequest._reject(stream._storedError);
              stream._closeRequest = void 0;
            }
            const writer = stream._writer;
            if (writer !== void 0) {
              defaultWriterClosedPromiseReject(writer, stream._storedError);
            }
          }
          __name(WritableStreamRejectCloseAndClosedPromiseIfNeeded, "WritableStreamRejectCloseAndClosedPromiseIfNeeded");
          function WritableStreamUpdateBackpressure(stream, backpressure) {
            const writer = stream._writer;
            if (writer !== void 0 && backpressure !== stream._backpressure) {
              if (backpressure) {
                defaultWriterReadyPromiseReset(writer);
              } else {
                defaultWriterReadyPromiseResolve(writer);
              }
            }
            stream._backpressure = backpressure;
          }
          __name(WritableStreamUpdateBackpressure, "WritableStreamUpdateBackpressure");
          class WritableStreamDefaultWriter {
            static {
              __name(this, "WritableStreamDefaultWriter");
            }
            constructor(stream) {
              assertRequiredArgument(stream, 1, "WritableStreamDefaultWriter");
              assertWritableStream(stream, "First parameter");
              if (IsWritableStreamLocked(stream)) {
                throw new TypeError("This stream has already been locked for exclusive writing by another writer");
              }
              this._ownerWritableStream = stream;
              stream._writer = this;
              const state = stream._state;
              if (state === "writable") {
                if (!WritableStreamCloseQueuedOrInFlight(stream) && stream._backpressure) {
                  defaultWriterReadyPromiseInitialize(this);
                } else {
                  defaultWriterReadyPromiseInitializeAsResolved(this);
                }
                defaultWriterClosedPromiseInitialize(this);
              } else if (state === "erroring") {
                defaultWriterReadyPromiseInitializeAsRejected(this, stream._storedError);
                defaultWriterClosedPromiseInitialize(this);
              } else if (state === "closed") {
                defaultWriterReadyPromiseInitializeAsResolved(this);
                defaultWriterClosedPromiseInitializeAsResolved(this);
              } else {
                const storedError = stream._storedError;
                defaultWriterReadyPromiseInitializeAsRejected(this, storedError);
                defaultWriterClosedPromiseInitializeAsRejected(this, storedError);
              }
            }
            /**
             * Returns a promise that will be fulfilled when the stream becomes closed, or rejected if the stream ever errors or
             * the writer’s lock is released before the stream finishes closing.
             */
            get closed() {
              if (!IsWritableStreamDefaultWriter(this)) {
                return promiseRejectedWith(defaultWriterBrandCheckException("closed"));
              }
              return this._closedPromise;
            }
            /**
             * Returns the desired size to fill the stream’s internal queue. It can be negative, if the queue is over-full.
             * A producer can use this information to determine the right amount of data to write.
             *
             * It will be `null` if the stream cannot be successfully written to (due to either being errored, or having an abort
             * queued up). It will return zero if the stream is closed. And the getter will throw an exception if invoked when
             * the writer’s lock is released.
             */
            get desiredSize() {
              if (!IsWritableStreamDefaultWriter(this)) {
                throw defaultWriterBrandCheckException("desiredSize");
              }
              if (this._ownerWritableStream === void 0) {
                throw defaultWriterLockException("desiredSize");
              }
              return WritableStreamDefaultWriterGetDesiredSize(this);
            }
            /**
             * Returns a promise that will be fulfilled when the desired size to fill the stream’s internal queue transitions
             * from non-positive to positive, signaling that it is no longer applying backpressure. Once the desired size dips
             * back to zero or below, the getter will return a new promise that stays pending until the next transition.
             *
             * If the stream becomes errored or aborted, or the writer’s lock is released, the returned promise will become
             * rejected.
             */
            get ready() {
              if (!IsWritableStreamDefaultWriter(this)) {
                return promiseRejectedWith(defaultWriterBrandCheckException("ready"));
              }
              return this._readyPromise;
            }
            /**
             * If the reader is active, behaves the same as {@link WritableStream.abort | stream.abort(reason)}.
             */
            abort(reason = void 0) {
              if (!IsWritableStreamDefaultWriter(this)) {
                return promiseRejectedWith(defaultWriterBrandCheckException("abort"));
              }
              if (this._ownerWritableStream === void 0) {
                return promiseRejectedWith(defaultWriterLockException("abort"));
              }
              return WritableStreamDefaultWriterAbort(this, reason);
            }
            /**
             * If the reader is active, behaves the same as {@link WritableStream.close | stream.close()}.
             */
            close() {
              if (!IsWritableStreamDefaultWriter(this)) {
                return promiseRejectedWith(defaultWriterBrandCheckException("close"));
              }
              const stream = this._ownerWritableStream;
              if (stream === void 0) {
                return promiseRejectedWith(defaultWriterLockException("close"));
              }
              if (WritableStreamCloseQueuedOrInFlight(stream)) {
                return promiseRejectedWith(new TypeError("Cannot close an already-closing stream"));
              }
              return WritableStreamDefaultWriterClose(this);
            }
            /**
             * Releases the writer’s lock on the corresponding stream. After the lock is released, the writer is no longer active.
             * If the associated stream is errored when the lock is released, the writer will appear errored in the same way from
             * now on; otherwise, the writer will appear closed.
             *
             * Note that the lock can still be released even if some ongoing writes have not yet finished (i.e. even if the
             * promises returned from previous calls to {@link WritableStreamDefaultWriter.write | write()} have not yet settled).
             * It’s not necessary to hold the lock on the writer for the duration of the write; the lock instead simply prevents
             * other producers from writing in an interleaved manner.
             */
            releaseLock() {
              if (!IsWritableStreamDefaultWriter(this)) {
                throw defaultWriterBrandCheckException("releaseLock");
              }
              const stream = this._ownerWritableStream;
              if (stream === void 0) {
                return;
              }
              WritableStreamDefaultWriterRelease(this);
            }
            write(chunk = void 0) {
              if (!IsWritableStreamDefaultWriter(this)) {
                return promiseRejectedWith(defaultWriterBrandCheckException("write"));
              }
              if (this._ownerWritableStream === void 0) {
                return promiseRejectedWith(defaultWriterLockException("write to"));
              }
              return WritableStreamDefaultWriterWrite(this, chunk);
            }
          }
          Object.defineProperties(WritableStreamDefaultWriter.prototype, {
            abort: { enumerable: true },
            close: { enumerable: true },
            releaseLock: { enumerable: true },
            write: { enumerable: true },
            closed: { enumerable: true },
            desiredSize: { enumerable: true },
            ready: { enumerable: true }
          });
          if (typeof SymbolPolyfill.toStringTag === "symbol") {
            Object.defineProperty(WritableStreamDefaultWriter.prototype, SymbolPolyfill.toStringTag, {
              value: "WritableStreamDefaultWriter",
              configurable: true
            });
          }
          function IsWritableStreamDefaultWriter(x2) {
            if (!typeIsObject(x2)) {
              return false;
            }
            if (!Object.prototype.hasOwnProperty.call(x2, "_ownerWritableStream")) {
              return false;
            }
            return x2 instanceof WritableStreamDefaultWriter;
          }
          __name(IsWritableStreamDefaultWriter, "IsWritableStreamDefaultWriter");
          function WritableStreamDefaultWriterAbort(writer, reason) {
            const stream = writer._ownerWritableStream;
            return WritableStreamAbort(stream, reason);
          }
          __name(WritableStreamDefaultWriterAbort, "WritableStreamDefaultWriterAbort");
          function WritableStreamDefaultWriterClose(writer) {
            const stream = writer._ownerWritableStream;
            return WritableStreamClose(stream);
          }
          __name(WritableStreamDefaultWriterClose, "WritableStreamDefaultWriterClose");
          function WritableStreamDefaultWriterCloseWithErrorPropagation(writer) {
            const stream = writer._ownerWritableStream;
            const state = stream._state;
            if (WritableStreamCloseQueuedOrInFlight(stream) || state === "closed") {
              return promiseResolvedWith(void 0);
            }
            if (state === "errored") {
              return promiseRejectedWith(stream._storedError);
            }
            return WritableStreamDefaultWriterClose(writer);
          }
          __name(WritableStreamDefaultWriterCloseWithErrorPropagation, "WritableStreamDefaultWriterCloseWithErrorPropagation");
          function WritableStreamDefaultWriterEnsureClosedPromiseRejected(writer, error) {
            if (writer._closedPromiseState === "pending") {
              defaultWriterClosedPromiseReject(writer, error);
            } else {
              defaultWriterClosedPromiseResetToRejected(writer, error);
            }
          }
          __name(WritableStreamDefaultWriterEnsureClosedPromiseRejected, "WritableStreamDefaultWriterEnsureClosedPromiseRejected");
          function WritableStreamDefaultWriterEnsureReadyPromiseRejected(writer, error) {
            if (writer._readyPromiseState === "pending") {
              defaultWriterReadyPromiseReject(writer, error);
            } else {
              defaultWriterReadyPromiseResetToRejected(writer, error);
            }
          }
          __name(WritableStreamDefaultWriterEnsureReadyPromiseRejected, "WritableStreamDefaultWriterEnsureReadyPromiseRejected");
          function WritableStreamDefaultWriterGetDesiredSize(writer) {
            const stream = writer._ownerWritableStream;
            const state = stream._state;
            if (state === "errored" || state === "erroring") {
              return null;
            }
            if (state === "closed") {
              return 0;
            }
            return WritableStreamDefaultControllerGetDesiredSize(stream._writableStreamController);
          }
          __name(WritableStreamDefaultWriterGetDesiredSize, "WritableStreamDefaultWriterGetDesiredSize");
          function WritableStreamDefaultWriterRelease(writer) {
            const stream = writer._ownerWritableStream;
            const releasedError = new TypeError(`Writer was released and can no longer be used to monitor the stream's closedness`);
            WritableStreamDefaultWriterEnsureReadyPromiseRejected(writer, releasedError);
            WritableStreamDefaultWriterEnsureClosedPromiseRejected(writer, releasedError);
            stream._writer = void 0;
            writer._ownerWritableStream = void 0;
          }
          __name(WritableStreamDefaultWriterRelease, "WritableStreamDefaultWriterRelease");
          function WritableStreamDefaultWriterWrite(writer, chunk) {
            const stream = writer._ownerWritableStream;
            const controller = stream._writableStreamController;
            const chunkSize = WritableStreamDefaultControllerGetChunkSize(controller, chunk);
            if (stream !== writer._ownerWritableStream) {
              return promiseRejectedWith(defaultWriterLockException("write to"));
            }
            const state = stream._state;
            if (state === "errored") {
              return promiseRejectedWith(stream._storedError);
            }
            if (WritableStreamCloseQueuedOrInFlight(stream) || state === "closed") {
              return promiseRejectedWith(new TypeError("The stream is closing or closed and cannot be written to"));
            }
            if (state === "erroring") {
              return promiseRejectedWith(stream._storedError);
            }
            const promise = WritableStreamAddWriteRequest(stream);
            WritableStreamDefaultControllerWrite(controller, chunk, chunkSize);
            return promise;
          }
          __name(WritableStreamDefaultWriterWrite, "WritableStreamDefaultWriterWrite");
          const closeSentinel = {};
          class WritableStreamDefaultController {
            static {
              __name(this, "WritableStreamDefaultController");
            }
            constructor() {
              throw new TypeError("Illegal constructor");
            }
            /**
             * The reason which was passed to `WritableStream.abort(reason)` when the stream was aborted.
             *
             * @deprecated
             *  This property has been removed from the specification, see https://github.com/whatwg/streams/pull/1177.
             *  Use {@link WritableStreamDefaultController.signal}'s `reason` instead.
             */
            get abortReason() {
              if (!IsWritableStreamDefaultController(this)) {
                throw defaultControllerBrandCheckException$2("abortReason");
              }
              return this._abortReason;
            }
            /**
             * An `AbortSignal` that can be used to abort the pending write or close operation when the stream is aborted.
             */
            get signal() {
              if (!IsWritableStreamDefaultController(this)) {
                throw defaultControllerBrandCheckException$2("signal");
              }
              if (this._abortController === void 0) {
                throw new TypeError("WritableStreamDefaultController.prototype.signal is not supported");
              }
              return this._abortController.signal;
            }
            /**
             * Closes the controlled writable stream, making all future interactions with it fail with the given error `e`.
             *
             * This method is rarely used, since usually it suffices to return a rejected promise from one of the underlying
             * sink's methods. However, it can be useful for suddenly shutting down a stream in response to an event outside the
             * normal lifecycle of interactions with the underlying sink.
             */
            error(e2 = void 0) {
              if (!IsWritableStreamDefaultController(this)) {
                throw defaultControllerBrandCheckException$2("error");
              }
              const state = this._controlledWritableStream._state;
              if (state !== "writable") {
                return;
              }
              WritableStreamDefaultControllerError(this, e2);
            }
            /** @internal */
            [AbortSteps](reason) {
              const result = this._abortAlgorithm(reason);
              WritableStreamDefaultControllerClearAlgorithms(this);
              return result;
            }
            /** @internal */
            [ErrorSteps]() {
              ResetQueue(this);
            }
          }
          Object.defineProperties(WritableStreamDefaultController.prototype, {
            abortReason: { enumerable: true },
            signal: { enumerable: true },
            error: { enumerable: true }
          });
          if (typeof SymbolPolyfill.toStringTag === "symbol") {
            Object.defineProperty(WritableStreamDefaultController.prototype, SymbolPolyfill.toStringTag, {
              value: "WritableStreamDefaultController",
              configurable: true
            });
          }
          function IsWritableStreamDefaultController(x2) {
            if (!typeIsObject(x2)) {
              return false;
            }
            if (!Object.prototype.hasOwnProperty.call(x2, "_controlledWritableStream")) {
              return false;
            }
            return x2 instanceof WritableStreamDefaultController;
          }
          __name(IsWritableStreamDefaultController, "IsWritableStreamDefaultController");
          function SetUpWritableStreamDefaultController(stream, controller, startAlgorithm, writeAlgorithm, closeAlgorithm, abortAlgorithm, highWaterMark, sizeAlgorithm) {
            controller._controlledWritableStream = stream;
            stream._writableStreamController = controller;
            controller._queue = void 0;
            controller._queueTotalSize = void 0;
            ResetQueue(controller);
            controller._abortReason = void 0;
            controller._abortController = createAbortController();
            controller._started = false;
            controller._strategySizeAlgorithm = sizeAlgorithm;
            controller._strategyHWM = highWaterMark;
            controller._writeAlgorithm = writeAlgorithm;
            controller._closeAlgorithm = closeAlgorithm;
            controller._abortAlgorithm = abortAlgorithm;
            const backpressure = WritableStreamDefaultControllerGetBackpressure(controller);
            WritableStreamUpdateBackpressure(stream, backpressure);
            const startResult = startAlgorithm();
            const startPromise = promiseResolvedWith(startResult);
            uponPromise(startPromise, () => {
              controller._started = true;
              WritableStreamDefaultControllerAdvanceQueueIfNeeded(controller);
            }, (r2) => {
              controller._started = true;
              WritableStreamDealWithRejection(stream, r2);
            });
          }
          __name(SetUpWritableStreamDefaultController, "SetUpWritableStreamDefaultController");
          function SetUpWritableStreamDefaultControllerFromUnderlyingSink(stream, underlyingSink, highWaterMark, sizeAlgorithm) {
            const controller = Object.create(WritableStreamDefaultController.prototype);
            let startAlgorithm = /* @__PURE__ */ __name(() => void 0, "startAlgorithm");
            let writeAlgorithm = /* @__PURE__ */ __name(() => promiseResolvedWith(void 0), "writeAlgorithm");
            let closeAlgorithm = /* @__PURE__ */ __name(() => promiseResolvedWith(void 0), "closeAlgorithm");
            let abortAlgorithm = /* @__PURE__ */ __name(() => promiseResolvedWith(void 0), "abortAlgorithm");
            if (underlyingSink.start !== void 0) {
              startAlgorithm = /* @__PURE__ */ __name(() => underlyingSink.start(controller), "startAlgorithm");
            }
            if (underlyingSink.write !== void 0) {
              writeAlgorithm = /* @__PURE__ */ __name((chunk) => underlyingSink.write(chunk, controller), "writeAlgorithm");
            }
            if (underlyingSink.close !== void 0) {
              closeAlgorithm = /* @__PURE__ */ __name(() => underlyingSink.close(), "closeAlgorithm");
            }
            if (underlyingSink.abort !== void 0) {
              abortAlgorithm = /* @__PURE__ */ __name((reason) => underlyingSink.abort(reason), "abortAlgorithm");
            }
            SetUpWritableStreamDefaultController(stream, controller, startAlgorithm, writeAlgorithm, closeAlgorithm, abortAlgorithm, highWaterMark, sizeAlgorithm);
          }
          __name(SetUpWritableStreamDefaultControllerFromUnderlyingSink, "SetUpWritableStreamDefaultControllerFromUnderlyingSink");
          function WritableStreamDefaultControllerClearAlgorithms(controller) {
            controller._writeAlgorithm = void 0;
            controller._closeAlgorithm = void 0;
            controller._abortAlgorithm = void 0;
            controller._strategySizeAlgorithm = void 0;
          }
          __name(WritableStreamDefaultControllerClearAlgorithms, "WritableStreamDefaultControllerClearAlgorithms");
          function WritableStreamDefaultControllerClose(controller) {
            EnqueueValueWithSize(controller, closeSentinel, 0);
            WritableStreamDefaultControllerAdvanceQueueIfNeeded(controller);
          }
          __name(WritableStreamDefaultControllerClose, "WritableStreamDefaultControllerClose");
          function WritableStreamDefaultControllerGetChunkSize(controller, chunk) {
            try {
              return controller._strategySizeAlgorithm(chunk);
            } catch (chunkSizeE) {
              WritableStreamDefaultControllerErrorIfNeeded(controller, chunkSizeE);
              return 1;
            }
          }
          __name(WritableStreamDefaultControllerGetChunkSize, "WritableStreamDefaultControllerGetChunkSize");
          function WritableStreamDefaultControllerGetDesiredSize(controller) {
            return controller._strategyHWM - controller._queueTotalSize;
          }
          __name(WritableStreamDefaultControllerGetDesiredSize, "WritableStreamDefaultControllerGetDesiredSize");
          function WritableStreamDefaultControllerWrite(controller, chunk, chunkSize) {
            try {
              EnqueueValueWithSize(controller, chunk, chunkSize);
            } catch (enqueueE) {
              WritableStreamDefaultControllerErrorIfNeeded(controller, enqueueE);
              return;
            }
            const stream = controller._controlledWritableStream;
            if (!WritableStreamCloseQueuedOrInFlight(stream) && stream._state === "writable") {
              const backpressure = WritableStreamDefaultControllerGetBackpressure(controller);
              WritableStreamUpdateBackpressure(stream, backpressure);
            }
            WritableStreamDefaultControllerAdvanceQueueIfNeeded(controller);
          }
          __name(WritableStreamDefaultControllerWrite, "WritableStreamDefaultControllerWrite");
          function WritableStreamDefaultControllerAdvanceQueueIfNeeded(controller) {
            const stream = controller._controlledWritableStream;
            if (!controller._started) {
              return;
            }
            if (stream._inFlightWriteRequest !== void 0) {
              return;
            }
            const state = stream._state;
            if (state === "erroring") {
              WritableStreamFinishErroring(stream);
              return;
            }
            if (controller._queue.length === 0) {
              return;
            }
            const value = PeekQueueValue(controller);
            if (value === closeSentinel) {
              WritableStreamDefaultControllerProcessClose(controller);
            } else {
              WritableStreamDefaultControllerProcessWrite(controller, value);
            }
          }
          __name(WritableStreamDefaultControllerAdvanceQueueIfNeeded, "WritableStreamDefaultControllerAdvanceQueueIfNeeded");
          function WritableStreamDefaultControllerErrorIfNeeded(controller, error) {
            if (controller._controlledWritableStream._state === "writable") {
              WritableStreamDefaultControllerError(controller, error);
            }
          }
          __name(WritableStreamDefaultControllerErrorIfNeeded, "WritableStreamDefaultControllerErrorIfNeeded");
          function WritableStreamDefaultControllerProcessClose(controller) {
            const stream = controller._controlledWritableStream;
            WritableStreamMarkCloseRequestInFlight(stream);
            DequeueValue(controller);
            const sinkClosePromise = controller._closeAlgorithm();
            WritableStreamDefaultControllerClearAlgorithms(controller);
            uponPromise(sinkClosePromise, () => {
              WritableStreamFinishInFlightClose(stream);
            }, (reason) => {
              WritableStreamFinishInFlightCloseWithError(stream, reason);
            });
          }
          __name(WritableStreamDefaultControllerProcessClose, "WritableStreamDefaultControllerProcessClose");
          function WritableStreamDefaultControllerProcessWrite(controller, chunk) {
            const stream = controller._controlledWritableStream;
            WritableStreamMarkFirstWriteRequestInFlight(stream);
            const sinkWritePromise = controller._writeAlgorithm(chunk);
            uponPromise(sinkWritePromise, () => {
              WritableStreamFinishInFlightWrite(stream);
              const state = stream._state;
              DequeueValue(controller);
              if (!WritableStreamCloseQueuedOrInFlight(stream) && state === "writable") {
                const backpressure = WritableStreamDefaultControllerGetBackpressure(controller);
                WritableStreamUpdateBackpressure(stream, backpressure);
              }
              WritableStreamDefaultControllerAdvanceQueueIfNeeded(controller);
            }, (reason) => {
              if (stream._state === "writable") {
                WritableStreamDefaultControllerClearAlgorithms(controller);
              }
              WritableStreamFinishInFlightWriteWithError(stream, reason);
            });
          }
          __name(WritableStreamDefaultControllerProcessWrite, "WritableStreamDefaultControllerProcessWrite");
          function WritableStreamDefaultControllerGetBackpressure(controller) {
            const desiredSize = WritableStreamDefaultControllerGetDesiredSize(controller);
            return desiredSize <= 0;
          }
          __name(WritableStreamDefaultControllerGetBackpressure, "WritableStreamDefaultControllerGetBackpressure");
          function WritableStreamDefaultControllerError(controller, error) {
            const stream = controller._controlledWritableStream;
            WritableStreamDefaultControllerClearAlgorithms(controller);
            WritableStreamStartErroring(stream, error);
          }
          __name(WritableStreamDefaultControllerError, "WritableStreamDefaultControllerError");
          function streamBrandCheckException$2(name) {
            return new TypeError(`WritableStream.prototype.${name} can only be used on a WritableStream`);
          }
          __name(streamBrandCheckException$2, "streamBrandCheckException$2");
          function defaultControllerBrandCheckException$2(name) {
            return new TypeError(`WritableStreamDefaultController.prototype.${name} can only be used on a WritableStreamDefaultController`);
          }
          __name(defaultControllerBrandCheckException$2, "defaultControllerBrandCheckException$2");
          function defaultWriterBrandCheckException(name) {
            return new TypeError(`WritableStreamDefaultWriter.prototype.${name} can only be used on a WritableStreamDefaultWriter`);
          }
          __name(defaultWriterBrandCheckException, "defaultWriterBrandCheckException");
          function defaultWriterLockException(name) {
            return new TypeError("Cannot " + name + " a stream using a released writer");
          }
          __name(defaultWriterLockException, "defaultWriterLockException");
          function defaultWriterClosedPromiseInitialize(writer) {
            writer._closedPromise = newPromise((resolve, reject) => {
              writer._closedPromise_resolve = resolve;
              writer._closedPromise_reject = reject;
              writer._closedPromiseState = "pending";
            });
          }
          __name(defaultWriterClosedPromiseInitialize, "defaultWriterClosedPromiseInitialize");
          function defaultWriterClosedPromiseInitializeAsRejected(writer, reason) {
            defaultWriterClosedPromiseInitialize(writer);
            defaultWriterClosedPromiseReject(writer, reason);
          }
          __name(defaultWriterClosedPromiseInitializeAsRejected, "defaultWriterClosedPromiseInitializeAsRejected");
          function defaultWriterClosedPromiseInitializeAsResolved(writer) {
            defaultWriterClosedPromiseInitialize(writer);
            defaultWriterClosedPromiseResolve(writer);
          }
          __name(defaultWriterClosedPromiseInitializeAsResolved, "defaultWriterClosedPromiseInitializeAsResolved");
          function defaultWriterClosedPromiseReject(writer, reason) {
            if (writer._closedPromise_reject === void 0) {
              return;
            }
            setPromiseIsHandledToTrue(writer._closedPromise);
            writer._closedPromise_reject(reason);
            writer._closedPromise_resolve = void 0;
            writer._closedPromise_reject = void 0;
            writer._closedPromiseState = "rejected";
          }
          __name(defaultWriterClosedPromiseReject, "defaultWriterClosedPromiseReject");
          function defaultWriterClosedPromiseResetToRejected(writer, reason) {
            defaultWriterClosedPromiseInitializeAsRejected(writer, reason);
          }
          __name(defaultWriterClosedPromiseResetToRejected, "defaultWriterClosedPromiseResetToRejected");
          function defaultWriterClosedPromiseResolve(writer) {
            if (writer._closedPromise_resolve === void 0) {
              return;
            }
            writer._closedPromise_resolve(void 0);
            writer._closedPromise_resolve = void 0;
            writer._closedPromise_reject = void 0;
            writer._closedPromiseState = "resolved";
          }
          __name(defaultWriterClosedPromiseResolve, "defaultWriterClosedPromiseResolve");
          function defaultWriterReadyPromiseInitialize(writer) {
            writer._readyPromise = newPromise((resolve, reject) => {
              writer._readyPromise_resolve = resolve;
              writer._readyPromise_reject = reject;
            });
            writer._readyPromiseState = "pending";
          }
          __name(defaultWriterReadyPromiseInitialize, "defaultWriterReadyPromiseInitialize");
          function defaultWriterReadyPromiseInitializeAsRejected(writer, reason) {
            defaultWriterReadyPromiseInitialize(writer);
            defaultWriterReadyPromiseReject(writer, reason);
          }
          __name(defaultWriterReadyPromiseInitializeAsRejected, "defaultWriterReadyPromiseInitializeAsRejected");
          function defaultWriterReadyPromiseInitializeAsResolved(writer) {
            defaultWriterReadyPromiseInitialize(writer);
            defaultWriterReadyPromiseResolve(writer);
          }
          __name(defaultWriterReadyPromiseInitializeAsResolved, "defaultWriterReadyPromiseInitializeAsResolved");
          function defaultWriterReadyPromiseReject(writer, reason) {
            if (writer._readyPromise_reject === void 0) {
              return;
            }
            setPromiseIsHandledToTrue(writer._readyPromise);
            writer._readyPromise_reject(reason);
            writer._readyPromise_resolve = void 0;
            writer._readyPromise_reject = void 0;
            writer._readyPromiseState = "rejected";
          }
          __name(defaultWriterReadyPromiseReject, "defaultWriterReadyPromiseReject");
          function defaultWriterReadyPromiseReset(writer) {
            defaultWriterReadyPromiseInitialize(writer);
          }
          __name(defaultWriterReadyPromiseReset, "defaultWriterReadyPromiseReset");
          function defaultWriterReadyPromiseResetToRejected(writer, reason) {
            defaultWriterReadyPromiseInitializeAsRejected(writer, reason);
          }
          __name(defaultWriterReadyPromiseResetToRejected, "defaultWriterReadyPromiseResetToRejected");
          function defaultWriterReadyPromiseResolve(writer) {
            if (writer._readyPromise_resolve === void 0) {
              return;
            }
            writer._readyPromise_resolve(void 0);
            writer._readyPromise_resolve = void 0;
            writer._readyPromise_reject = void 0;
            writer._readyPromiseState = "fulfilled";
          }
          __name(defaultWriterReadyPromiseResolve, "defaultWriterReadyPromiseResolve");
          const NativeDOMException = typeof DOMException !== "undefined" ? DOMException : void 0;
          function isDOMExceptionConstructor(ctor) {
            if (!(typeof ctor === "function" || typeof ctor === "object")) {
              return false;
            }
            try {
              new ctor();
              return true;
            } catch (_a) {
              return false;
            }
          }
          __name(isDOMExceptionConstructor, "isDOMExceptionConstructor");
          function createDOMExceptionPolyfill() {
            const ctor = /* @__PURE__ */ __name(function DOMException3(message, name) {
              this.message = message || "";
              this.name = name || "Error";
              if (Error.captureStackTrace) {
                Error.captureStackTrace(this, this.constructor);
              }
            }, "DOMException3");
            ctor.prototype = Object.create(Error.prototype);
            Object.defineProperty(ctor.prototype, "constructor", { value: ctor, writable: true, configurable: true });
            return ctor;
          }
          __name(createDOMExceptionPolyfill, "createDOMExceptionPolyfill");
          const DOMException$1 = isDOMExceptionConstructor(NativeDOMException) ? NativeDOMException : createDOMExceptionPolyfill();
          function ReadableStreamPipeTo(source, dest, preventClose, preventAbort, preventCancel, signal) {
            const reader = AcquireReadableStreamDefaultReader(source);
            const writer = AcquireWritableStreamDefaultWriter(dest);
            source._disturbed = true;
            let shuttingDown = false;
            let currentWrite = promiseResolvedWith(void 0);
            return newPromise((resolve, reject) => {
              let abortAlgorithm;
              if (signal !== void 0) {
                abortAlgorithm = /* @__PURE__ */ __name(() => {
                  const error = new DOMException$1("Aborted", "AbortError");
                  const actions = [];
                  if (!preventAbort) {
                    actions.push(() => {
                      if (dest._state === "writable") {
                        return WritableStreamAbort(dest, error);
                      }
                      return promiseResolvedWith(void 0);
                    });
                  }
                  if (!preventCancel) {
                    actions.push(() => {
                      if (source._state === "readable") {
                        return ReadableStreamCancel(source, error);
                      }
                      return promiseResolvedWith(void 0);
                    });
                  }
                  shutdownWithAction(() => Promise.all(actions.map((action) => action())), true, error);
                }, "abortAlgorithm");
                if (signal.aborted) {
                  abortAlgorithm();
                  return;
                }
                signal.addEventListener("abort", abortAlgorithm);
              }
              function pipeLoop() {
                return newPromise((resolveLoop, rejectLoop) => {
                  function next(done) {
                    if (done) {
                      resolveLoop();
                    } else {
                      PerformPromiseThen(pipeStep(), next, rejectLoop);
                    }
                  }
                  __name(next, "next");
                  next(false);
                });
              }
              __name(pipeLoop, "pipeLoop");
              function pipeStep() {
                if (shuttingDown) {
                  return promiseResolvedWith(true);
                }
                return PerformPromiseThen(writer._readyPromise, () => {
                  return newPromise((resolveRead, rejectRead) => {
                    ReadableStreamDefaultReaderRead(reader, {
                      _chunkSteps: /* @__PURE__ */ __name((chunk) => {
                        currentWrite = PerformPromiseThen(WritableStreamDefaultWriterWrite(writer, chunk), void 0, noop);
                        resolveRead(false);
                      }, "_chunkSteps"),
                      _closeSteps: /* @__PURE__ */ __name(() => resolveRead(true), "_closeSteps"),
                      _errorSteps: rejectRead
                    });
                  });
                });
              }
              __name(pipeStep, "pipeStep");
              isOrBecomesErrored(source, reader._closedPromise, (storedError) => {
                if (!preventAbort) {
                  shutdownWithAction(() => WritableStreamAbort(dest, storedError), true, storedError);
                } else {
                  shutdown(true, storedError);
                }
              });
              isOrBecomesErrored(dest, writer._closedPromise, (storedError) => {
                if (!preventCancel) {
                  shutdownWithAction(() => ReadableStreamCancel(source, storedError), true, storedError);
                } else {
                  shutdown(true, storedError);
                }
              });
              isOrBecomesClosed(source, reader._closedPromise, () => {
                if (!preventClose) {
                  shutdownWithAction(() => WritableStreamDefaultWriterCloseWithErrorPropagation(writer));
                } else {
                  shutdown();
                }
              });
              if (WritableStreamCloseQueuedOrInFlight(dest) || dest._state === "closed") {
                const destClosed = new TypeError("the destination writable stream closed before all data could be piped to it");
                if (!preventCancel) {
                  shutdownWithAction(() => ReadableStreamCancel(source, destClosed), true, destClosed);
                } else {
                  shutdown(true, destClosed);
                }
              }
              setPromiseIsHandledToTrue(pipeLoop());
              function waitForWritesToFinish() {
                const oldCurrentWrite = currentWrite;
                return PerformPromiseThen(currentWrite, () => oldCurrentWrite !== currentWrite ? waitForWritesToFinish() : void 0);
              }
              __name(waitForWritesToFinish, "waitForWritesToFinish");
              function isOrBecomesErrored(stream, promise, action) {
                if (stream._state === "errored") {
                  action(stream._storedError);
                } else {
                  uponRejection(promise, action);
                }
              }
              __name(isOrBecomesErrored, "isOrBecomesErrored");
              function isOrBecomesClosed(stream, promise, action) {
                if (stream._state === "closed") {
                  action();
                } else {
                  uponFulfillment(promise, action);
                }
              }
              __name(isOrBecomesClosed, "isOrBecomesClosed");
              function shutdownWithAction(action, originalIsError, originalError) {
                if (shuttingDown) {
                  return;
                }
                shuttingDown = true;
                if (dest._state === "writable" && !WritableStreamCloseQueuedOrInFlight(dest)) {
                  uponFulfillment(waitForWritesToFinish(), doTheRest);
                } else {
                  doTheRest();
                }
                function doTheRest() {
                  uponPromise(action(), () => finalize(originalIsError, originalError), (newError) => finalize(true, newError));
                }
                __name(doTheRest, "doTheRest");
              }
              __name(shutdownWithAction, "shutdownWithAction");
              function shutdown(isError, error) {
                if (shuttingDown) {
                  return;
                }
                shuttingDown = true;
                if (dest._state === "writable" && !WritableStreamCloseQueuedOrInFlight(dest)) {
                  uponFulfillment(waitForWritesToFinish(), () => finalize(isError, error));
                } else {
                  finalize(isError, error);
                }
              }
              __name(shutdown, "shutdown");
              function finalize(isError, error) {
                WritableStreamDefaultWriterRelease(writer);
                ReadableStreamReaderGenericRelease(reader);
                if (signal !== void 0) {
                  signal.removeEventListener("abort", abortAlgorithm);
                }
                if (isError) {
                  reject(error);
                } else {
                  resolve(void 0);
                }
              }
              __name(finalize, "finalize");
            });
          }
          __name(ReadableStreamPipeTo, "ReadableStreamPipeTo");
          class ReadableStreamDefaultController {
            static {
              __name(this, "ReadableStreamDefaultController");
            }
            constructor() {
              throw new TypeError("Illegal constructor");
            }
            /**
             * Returns the desired size to fill the controlled stream's internal queue. It can be negative, if the queue is
             * over-full. An underlying source ought to use this information to determine when and how to apply backpressure.
             */
            get desiredSize() {
              if (!IsReadableStreamDefaultController(this)) {
                throw defaultControllerBrandCheckException$1("desiredSize");
              }
              return ReadableStreamDefaultControllerGetDesiredSize(this);
            }
            /**
             * Closes the controlled readable stream. Consumers will still be able to read any previously-enqueued chunks from
             * the stream, but once those are read, the stream will become closed.
             */
            close() {
              if (!IsReadableStreamDefaultController(this)) {
                throw defaultControllerBrandCheckException$1("close");
              }
              if (!ReadableStreamDefaultControllerCanCloseOrEnqueue(this)) {
                throw new TypeError("The stream is not in a state that permits close");
              }
              ReadableStreamDefaultControllerClose(this);
            }
            enqueue(chunk = void 0) {
              if (!IsReadableStreamDefaultController(this)) {
                throw defaultControllerBrandCheckException$1("enqueue");
              }
              if (!ReadableStreamDefaultControllerCanCloseOrEnqueue(this)) {
                throw new TypeError("The stream is not in a state that permits enqueue");
              }
              return ReadableStreamDefaultControllerEnqueue(this, chunk);
            }
            /**
             * Errors the controlled readable stream, making all future interactions with it fail with the given error `e`.
             */
            error(e2 = void 0) {
              if (!IsReadableStreamDefaultController(this)) {
                throw defaultControllerBrandCheckException$1("error");
              }
              ReadableStreamDefaultControllerError(this, e2);
            }
            /** @internal */
            [CancelSteps](reason) {
              ResetQueue(this);
              const result = this._cancelAlgorithm(reason);
              ReadableStreamDefaultControllerClearAlgorithms(this);
              return result;
            }
            /** @internal */
            [PullSteps](readRequest) {
              const stream = this._controlledReadableStream;
              if (this._queue.length > 0) {
                const chunk = DequeueValue(this);
                if (this._closeRequested && this._queue.length === 0) {
                  ReadableStreamDefaultControllerClearAlgorithms(this);
                  ReadableStreamClose(stream);
                } else {
                  ReadableStreamDefaultControllerCallPullIfNeeded(this);
                }
                readRequest._chunkSteps(chunk);
              } else {
                ReadableStreamAddReadRequest(stream, readRequest);
                ReadableStreamDefaultControllerCallPullIfNeeded(this);
              }
            }
          }
          Object.defineProperties(ReadableStreamDefaultController.prototype, {
            close: { enumerable: true },
            enqueue: { enumerable: true },
            error: { enumerable: true },
            desiredSize: { enumerable: true }
          });
          if (typeof SymbolPolyfill.toStringTag === "symbol") {
            Object.defineProperty(ReadableStreamDefaultController.prototype, SymbolPolyfill.toStringTag, {
              value: "ReadableStreamDefaultController",
              configurable: true
            });
          }
          function IsReadableStreamDefaultController(x2) {
            if (!typeIsObject(x2)) {
              return false;
            }
            if (!Object.prototype.hasOwnProperty.call(x2, "_controlledReadableStream")) {
              return false;
            }
            return x2 instanceof ReadableStreamDefaultController;
          }
          __name(IsReadableStreamDefaultController, "IsReadableStreamDefaultController");
          function ReadableStreamDefaultControllerCallPullIfNeeded(controller) {
            const shouldPull = ReadableStreamDefaultControllerShouldCallPull(controller);
            if (!shouldPull) {
              return;
            }
            if (controller._pulling) {
              controller._pullAgain = true;
              return;
            }
            controller._pulling = true;
            const pullPromise = controller._pullAlgorithm();
            uponPromise(pullPromise, () => {
              controller._pulling = false;
              if (controller._pullAgain) {
                controller._pullAgain = false;
                ReadableStreamDefaultControllerCallPullIfNeeded(controller);
              }
            }, (e2) => {
              ReadableStreamDefaultControllerError(controller, e2);
            });
          }
          __name(ReadableStreamDefaultControllerCallPullIfNeeded, "ReadableStreamDefaultControllerCallPullIfNeeded");
          function ReadableStreamDefaultControllerShouldCallPull(controller) {
            const stream = controller._controlledReadableStream;
            if (!ReadableStreamDefaultControllerCanCloseOrEnqueue(controller)) {
              return false;
            }
            if (!controller._started) {
              return false;
            }
            if (IsReadableStreamLocked(stream) && ReadableStreamGetNumReadRequests(stream) > 0) {
              return true;
            }
            const desiredSize = ReadableStreamDefaultControllerGetDesiredSize(controller);
            if (desiredSize > 0) {
              return true;
            }
            return false;
          }
          __name(ReadableStreamDefaultControllerShouldCallPull, "ReadableStreamDefaultControllerShouldCallPull");
          function ReadableStreamDefaultControllerClearAlgorithms(controller) {
            controller._pullAlgorithm = void 0;
            controller._cancelAlgorithm = void 0;
            controller._strategySizeAlgorithm = void 0;
          }
          __name(ReadableStreamDefaultControllerClearAlgorithms, "ReadableStreamDefaultControllerClearAlgorithms");
          function ReadableStreamDefaultControllerClose(controller) {
            if (!ReadableStreamDefaultControllerCanCloseOrEnqueue(controller)) {
              return;
            }
            const stream = controller._controlledReadableStream;
            controller._closeRequested = true;
            if (controller._queue.length === 0) {
              ReadableStreamDefaultControllerClearAlgorithms(controller);
              ReadableStreamClose(stream);
            }
          }
          __name(ReadableStreamDefaultControllerClose, "ReadableStreamDefaultControllerClose");
          function ReadableStreamDefaultControllerEnqueue(controller, chunk) {
            if (!ReadableStreamDefaultControllerCanCloseOrEnqueue(controller)) {
              return;
            }
            const stream = controller._controlledReadableStream;
            if (IsReadableStreamLocked(stream) && ReadableStreamGetNumReadRequests(stream) > 0) {
              ReadableStreamFulfillReadRequest(stream, chunk, false);
            } else {
              let chunkSize;
              try {
                chunkSize = controller._strategySizeAlgorithm(chunk);
              } catch (chunkSizeE) {
                ReadableStreamDefaultControllerError(controller, chunkSizeE);
                throw chunkSizeE;
              }
              try {
                EnqueueValueWithSize(controller, chunk, chunkSize);
              } catch (enqueueE) {
                ReadableStreamDefaultControllerError(controller, enqueueE);
                throw enqueueE;
              }
            }
            ReadableStreamDefaultControllerCallPullIfNeeded(controller);
          }
          __name(ReadableStreamDefaultControllerEnqueue, "ReadableStreamDefaultControllerEnqueue");
          function ReadableStreamDefaultControllerError(controller, e2) {
            const stream = controller._controlledReadableStream;
            if (stream._state !== "readable") {
              return;
            }
            ResetQueue(controller);
            ReadableStreamDefaultControllerClearAlgorithms(controller);
            ReadableStreamError(stream, e2);
          }
          __name(ReadableStreamDefaultControllerError, "ReadableStreamDefaultControllerError");
          function ReadableStreamDefaultControllerGetDesiredSize(controller) {
            const state = controller._controlledReadableStream._state;
            if (state === "errored") {
              return null;
            }
            if (state === "closed") {
              return 0;
            }
            return controller._strategyHWM - controller._queueTotalSize;
          }
          __name(ReadableStreamDefaultControllerGetDesiredSize, "ReadableStreamDefaultControllerGetDesiredSize");
          function ReadableStreamDefaultControllerHasBackpressure(controller) {
            if (ReadableStreamDefaultControllerShouldCallPull(controller)) {
              return false;
            }
            return true;
          }
          __name(ReadableStreamDefaultControllerHasBackpressure, "ReadableStreamDefaultControllerHasBackpressure");
          function ReadableStreamDefaultControllerCanCloseOrEnqueue(controller) {
            const state = controller._controlledReadableStream._state;
            if (!controller._closeRequested && state === "readable") {
              return true;
            }
            return false;
          }
          __name(ReadableStreamDefaultControllerCanCloseOrEnqueue, "ReadableStreamDefaultControllerCanCloseOrEnqueue");
          function SetUpReadableStreamDefaultController(stream, controller, startAlgorithm, pullAlgorithm, cancelAlgorithm, highWaterMark, sizeAlgorithm) {
            controller._controlledReadableStream = stream;
            controller._queue = void 0;
            controller._queueTotalSize = void 0;
            ResetQueue(controller);
            controller._started = false;
            controller._closeRequested = false;
            controller._pullAgain = false;
            controller._pulling = false;
            controller._strategySizeAlgorithm = sizeAlgorithm;
            controller._strategyHWM = highWaterMark;
            controller._pullAlgorithm = pullAlgorithm;
            controller._cancelAlgorithm = cancelAlgorithm;
            stream._readableStreamController = controller;
            const startResult = startAlgorithm();
            uponPromise(promiseResolvedWith(startResult), () => {
              controller._started = true;
              ReadableStreamDefaultControllerCallPullIfNeeded(controller);
            }, (r2) => {
              ReadableStreamDefaultControllerError(controller, r2);
            });
          }
          __name(SetUpReadableStreamDefaultController, "SetUpReadableStreamDefaultController");
          function SetUpReadableStreamDefaultControllerFromUnderlyingSource(stream, underlyingSource, highWaterMark, sizeAlgorithm) {
            const controller = Object.create(ReadableStreamDefaultController.prototype);
            let startAlgorithm = /* @__PURE__ */ __name(() => void 0, "startAlgorithm");
            let pullAlgorithm = /* @__PURE__ */ __name(() => promiseResolvedWith(void 0), "pullAlgorithm");
            let cancelAlgorithm = /* @__PURE__ */ __name(() => promiseResolvedWith(void 0), "cancelAlgorithm");
            if (underlyingSource.start !== void 0) {
              startAlgorithm = /* @__PURE__ */ __name(() => underlyingSource.start(controller), "startAlgorithm");
            }
            if (underlyingSource.pull !== void 0) {
              pullAlgorithm = /* @__PURE__ */ __name(() => underlyingSource.pull(controller), "pullAlgorithm");
            }
            if (underlyingSource.cancel !== void 0) {
              cancelAlgorithm = /* @__PURE__ */ __name((reason) => underlyingSource.cancel(reason), "cancelAlgorithm");
            }
            SetUpReadableStreamDefaultController(stream, controller, startAlgorithm, pullAlgorithm, cancelAlgorithm, highWaterMark, sizeAlgorithm);
          }
          __name(SetUpReadableStreamDefaultControllerFromUnderlyingSource, "SetUpReadableStreamDefaultControllerFromUnderlyingSource");
          function defaultControllerBrandCheckException$1(name) {
            return new TypeError(`ReadableStreamDefaultController.prototype.${name} can only be used on a ReadableStreamDefaultController`);
          }
          __name(defaultControllerBrandCheckException$1, "defaultControllerBrandCheckException$1");
          function ReadableStreamTee(stream, cloneForBranch2) {
            if (IsReadableByteStreamController(stream._readableStreamController)) {
              return ReadableByteStreamTee(stream);
            }
            return ReadableStreamDefaultTee(stream);
          }
          __name(ReadableStreamTee, "ReadableStreamTee");
          function ReadableStreamDefaultTee(stream, cloneForBranch2) {
            const reader = AcquireReadableStreamDefaultReader(stream);
            let reading = false;
            let readAgain = false;
            let canceled1 = false;
            let canceled2 = false;
            let reason1;
            let reason2;
            let branch1;
            let branch2;
            let resolveCancelPromise;
            const cancelPromise = newPromise((resolve) => {
              resolveCancelPromise = resolve;
            });
            function pullAlgorithm() {
              if (reading) {
                readAgain = true;
                return promiseResolvedWith(void 0);
              }
              reading = true;
              const readRequest = {
                _chunkSteps: /* @__PURE__ */ __name((chunk) => {
                  queueMicrotask(() => {
                    readAgain = false;
                    const chunk1 = chunk;
                    const chunk2 = chunk;
                    if (!canceled1) {
                      ReadableStreamDefaultControllerEnqueue(branch1._readableStreamController, chunk1);
                    }
                    if (!canceled2) {
                      ReadableStreamDefaultControllerEnqueue(branch2._readableStreamController, chunk2);
                    }
                    reading = false;
                    if (readAgain) {
                      pullAlgorithm();
                    }
                  });
                }, "_chunkSteps"),
                _closeSteps: /* @__PURE__ */ __name(() => {
                  reading = false;
                  if (!canceled1) {
                    ReadableStreamDefaultControllerClose(branch1._readableStreamController);
                  }
                  if (!canceled2) {
                    ReadableStreamDefaultControllerClose(branch2._readableStreamController);
                  }
                  if (!canceled1 || !canceled2) {
                    resolveCancelPromise(void 0);
                  }
                }, "_closeSteps"),
                _errorSteps: /* @__PURE__ */ __name(() => {
                  reading = false;
                }, "_errorSteps")
              };
              ReadableStreamDefaultReaderRead(reader, readRequest);
              return promiseResolvedWith(void 0);
            }
            __name(pullAlgorithm, "pullAlgorithm");
            function cancel1Algorithm(reason) {
              canceled1 = true;
              reason1 = reason;
              if (canceled2) {
                const compositeReason = CreateArrayFromList([reason1, reason2]);
                const cancelResult = ReadableStreamCancel(stream, compositeReason);
                resolveCancelPromise(cancelResult);
              }
              return cancelPromise;
            }
            __name(cancel1Algorithm, "cancel1Algorithm");
            function cancel2Algorithm(reason) {
              canceled2 = true;
              reason2 = reason;
              if (canceled1) {
                const compositeReason = CreateArrayFromList([reason1, reason2]);
                const cancelResult = ReadableStreamCancel(stream, compositeReason);
                resolveCancelPromise(cancelResult);
              }
              return cancelPromise;
            }
            __name(cancel2Algorithm, "cancel2Algorithm");
            function startAlgorithm() {
            }
            __name(startAlgorithm, "startAlgorithm");
            branch1 = CreateReadableStream(startAlgorithm, pullAlgorithm, cancel1Algorithm);
            branch2 = CreateReadableStream(startAlgorithm, pullAlgorithm, cancel2Algorithm);
            uponRejection(reader._closedPromise, (r2) => {
              ReadableStreamDefaultControllerError(branch1._readableStreamController, r2);
              ReadableStreamDefaultControllerError(branch2._readableStreamController, r2);
              if (!canceled1 || !canceled2) {
                resolveCancelPromise(void 0);
              }
            });
            return [branch1, branch2];
          }
          __name(ReadableStreamDefaultTee, "ReadableStreamDefaultTee");
          function ReadableByteStreamTee(stream) {
            let reader = AcquireReadableStreamDefaultReader(stream);
            let reading = false;
            let readAgainForBranch1 = false;
            let readAgainForBranch2 = false;
            let canceled1 = false;
            let canceled2 = false;
            let reason1;
            let reason2;
            let branch1;
            let branch2;
            let resolveCancelPromise;
            const cancelPromise = newPromise((resolve) => {
              resolveCancelPromise = resolve;
            });
            function forwardReaderError(thisReader) {
              uponRejection(thisReader._closedPromise, (r2) => {
                if (thisReader !== reader) {
                  return;
                }
                ReadableByteStreamControllerError(branch1._readableStreamController, r2);
                ReadableByteStreamControllerError(branch2._readableStreamController, r2);
                if (!canceled1 || !canceled2) {
                  resolveCancelPromise(void 0);
                }
              });
            }
            __name(forwardReaderError, "forwardReaderError");
            function pullWithDefaultReader() {
              if (IsReadableStreamBYOBReader(reader)) {
                ReadableStreamReaderGenericRelease(reader);
                reader = AcquireReadableStreamDefaultReader(stream);
                forwardReaderError(reader);
              }
              const readRequest = {
                _chunkSteps: /* @__PURE__ */ __name((chunk) => {
                  queueMicrotask(() => {
                    readAgainForBranch1 = false;
                    readAgainForBranch2 = false;
                    const chunk1 = chunk;
                    let chunk2 = chunk;
                    if (!canceled1 && !canceled2) {
                      try {
                        chunk2 = CloneAsUint8Array(chunk);
                      } catch (cloneE) {
                        ReadableByteStreamControllerError(branch1._readableStreamController, cloneE);
                        ReadableByteStreamControllerError(branch2._readableStreamController, cloneE);
                        resolveCancelPromise(ReadableStreamCancel(stream, cloneE));
                        return;
                      }
                    }
                    if (!canceled1) {
                      ReadableByteStreamControllerEnqueue(branch1._readableStreamController, chunk1);
                    }
                    if (!canceled2) {
                      ReadableByteStreamControllerEnqueue(branch2._readableStreamController, chunk2);
                    }
                    reading = false;
                    if (readAgainForBranch1) {
                      pull1Algorithm();
                    } else if (readAgainForBranch2) {
                      pull2Algorithm();
                    }
                  });
                }, "_chunkSteps"),
                _closeSteps: /* @__PURE__ */ __name(() => {
                  reading = false;
                  if (!canceled1) {
                    ReadableByteStreamControllerClose(branch1._readableStreamController);
                  }
                  if (!canceled2) {
                    ReadableByteStreamControllerClose(branch2._readableStreamController);
                  }
                  if (branch1._readableStreamController._pendingPullIntos.length > 0) {
                    ReadableByteStreamControllerRespond(branch1._readableStreamController, 0);
                  }
                  if (branch2._readableStreamController._pendingPullIntos.length > 0) {
                    ReadableByteStreamControllerRespond(branch2._readableStreamController, 0);
                  }
                  if (!canceled1 || !canceled2) {
                    resolveCancelPromise(void 0);
                  }
                }, "_closeSteps"),
                _errorSteps: /* @__PURE__ */ __name(() => {
                  reading = false;
                }, "_errorSteps")
              };
              ReadableStreamDefaultReaderRead(reader, readRequest);
            }
            __name(pullWithDefaultReader, "pullWithDefaultReader");
            function pullWithBYOBReader(view, forBranch2) {
              if (IsReadableStreamDefaultReader(reader)) {
                ReadableStreamReaderGenericRelease(reader);
                reader = AcquireReadableStreamBYOBReader(stream);
                forwardReaderError(reader);
              }
              const byobBranch = forBranch2 ? branch2 : branch1;
              const otherBranch = forBranch2 ? branch1 : branch2;
              const readIntoRequest = {
                _chunkSteps: /* @__PURE__ */ __name((chunk) => {
                  queueMicrotask(() => {
                    readAgainForBranch1 = false;
                    readAgainForBranch2 = false;
                    const byobCanceled = forBranch2 ? canceled2 : canceled1;
                    const otherCanceled = forBranch2 ? canceled1 : canceled2;
                    if (!otherCanceled) {
                      let clonedChunk;
                      try {
                        clonedChunk = CloneAsUint8Array(chunk);
                      } catch (cloneE) {
                        ReadableByteStreamControllerError(byobBranch._readableStreamController, cloneE);
                        ReadableByteStreamControllerError(otherBranch._readableStreamController, cloneE);
                        resolveCancelPromise(ReadableStreamCancel(stream, cloneE));
                        return;
                      }
                      if (!byobCanceled) {
                        ReadableByteStreamControllerRespondWithNewView(byobBranch._readableStreamController, chunk);
                      }
                      ReadableByteStreamControllerEnqueue(otherBranch._readableStreamController, clonedChunk);
                    } else if (!byobCanceled) {
                      ReadableByteStreamControllerRespondWithNewView(byobBranch._readableStreamController, chunk);
                    }
                    reading = false;
                    if (readAgainForBranch1) {
                      pull1Algorithm();
                    } else if (readAgainForBranch2) {
                      pull2Algorithm();
                    }
                  });
                }, "_chunkSteps"),
                _closeSteps: /* @__PURE__ */ __name((chunk) => {
                  reading = false;
                  const byobCanceled = forBranch2 ? canceled2 : canceled1;
                  const otherCanceled = forBranch2 ? canceled1 : canceled2;
                  if (!byobCanceled) {
                    ReadableByteStreamControllerClose(byobBranch._readableStreamController);
                  }
                  if (!otherCanceled) {
                    ReadableByteStreamControllerClose(otherBranch._readableStreamController);
                  }
                  if (chunk !== void 0) {
                    if (!byobCanceled) {
                      ReadableByteStreamControllerRespondWithNewView(byobBranch._readableStreamController, chunk);
                    }
                    if (!otherCanceled && otherBranch._readableStreamController._pendingPullIntos.length > 0) {
                      ReadableByteStreamControllerRespond(otherBranch._readableStreamController, 0);
                    }
                  }
                  if (!byobCanceled || !otherCanceled) {
                    resolveCancelPromise(void 0);
                  }
                }, "_closeSteps"),
                _errorSteps: /* @__PURE__ */ __name(() => {
                  reading = false;
                }, "_errorSteps")
              };
              ReadableStreamBYOBReaderRead(reader, view, readIntoRequest);
            }
            __name(pullWithBYOBReader, "pullWithBYOBReader");
            function pull1Algorithm() {
              if (reading) {
                readAgainForBranch1 = true;
                return promiseResolvedWith(void 0);
              }
              reading = true;
              const byobRequest = ReadableByteStreamControllerGetBYOBRequest(branch1._readableStreamController);
              if (byobRequest === null) {
                pullWithDefaultReader();
              } else {
                pullWithBYOBReader(byobRequest._view, false);
              }
              return promiseResolvedWith(void 0);
            }
            __name(pull1Algorithm, "pull1Algorithm");
            function pull2Algorithm() {
              if (reading) {
                readAgainForBranch2 = true;
                return promiseResolvedWith(void 0);
              }
              reading = true;
              const byobRequest = ReadableByteStreamControllerGetBYOBRequest(branch2._readableStreamController);
              if (byobRequest === null) {
                pullWithDefaultReader();
              } else {
                pullWithBYOBReader(byobRequest._view, true);
              }
              return promiseResolvedWith(void 0);
            }
            __name(pull2Algorithm, "pull2Algorithm");
            function cancel1Algorithm(reason) {
              canceled1 = true;
              reason1 = reason;
              if (canceled2) {
                const compositeReason = CreateArrayFromList([reason1, reason2]);
                const cancelResult = ReadableStreamCancel(stream, compositeReason);
                resolveCancelPromise(cancelResult);
              }
              return cancelPromise;
            }
            __name(cancel1Algorithm, "cancel1Algorithm");
            function cancel2Algorithm(reason) {
              canceled2 = true;
              reason2 = reason;
              if (canceled1) {
                const compositeReason = CreateArrayFromList([reason1, reason2]);
                const cancelResult = ReadableStreamCancel(stream, compositeReason);
                resolveCancelPromise(cancelResult);
              }
              return cancelPromise;
            }
            __name(cancel2Algorithm, "cancel2Algorithm");
            function startAlgorithm() {
              return;
            }
            __name(startAlgorithm, "startAlgorithm");
            branch1 = CreateReadableByteStream(startAlgorithm, pull1Algorithm, cancel1Algorithm);
            branch2 = CreateReadableByteStream(startAlgorithm, pull2Algorithm, cancel2Algorithm);
            forwardReaderError(reader);
            return [branch1, branch2];
          }
          __name(ReadableByteStreamTee, "ReadableByteStreamTee");
          function convertUnderlyingDefaultOrByteSource(source, context) {
            assertDictionary(source, context);
            const original = source;
            const autoAllocateChunkSize = original === null || original === void 0 ? void 0 : original.autoAllocateChunkSize;
            const cancel = original === null || original === void 0 ? void 0 : original.cancel;
            const pull = original === null || original === void 0 ? void 0 : original.pull;
            const start = original === null || original === void 0 ? void 0 : original.start;
            const type = original === null || original === void 0 ? void 0 : original.type;
            return {
              autoAllocateChunkSize: autoAllocateChunkSize === void 0 ? void 0 : convertUnsignedLongLongWithEnforceRange(autoAllocateChunkSize, `${context} has member 'autoAllocateChunkSize' that`),
              cancel: cancel === void 0 ? void 0 : convertUnderlyingSourceCancelCallback(cancel, original, `${context} has member 'cancel' that`),
              pull: pull === void 0 ? void 0 : convertUnderlyingSourcePullCallback(pull, original, `${context} has member 'pull' that`),
              start: start === void 0 ? void 0 : convertUnderlyingSourceStartCallback(start, original, `${context} has member 'start' that`),
              type: type === void 0 ? void 0 : convertReadableStreamType(type, `${context} has member 'type' that`)
            };
          }
          __name(convertUnderlyingDefaultOrByteSource, "convertUnderlyingDefaultOrByteSource");
          function convertUnderlyingSourceCancelCallback(fn, original, context) {
            assertFunction(fn, context);
            return (reason) => promiseCall(fn, original, [reason]);
          }
          __name(convertUnderlyingSourceCancelCallback, "convertUnderlyingSourceCancelCallback");
          function convertUnderlyingSourcePullCallback(fn, original, context) {
            assertFunction(fn, context);
            return (controller) => promiseCall(fn, original, [controller]);
          }
          __name(convertUnderlyingSourcePullCallback, "convertUnderlyingSourcePullCallback");
          function convertUnderlyingSourceStartCallback(fn, original, context) {
            assertFunction(fn, context);
            return (controller) => reflectCall(fn, original, [controller]);
          }
          __name(convertUnderlyingSourceStartCallback, "convertUnderlyingSourceStartCallback");
          function convertReadableStreamType(type, context) {
            type = `${type}`;
            if (type !== "bytes") {
              throw new TypeError(`${context} '${type}' is not a valid enumeration value for ReadableStreamType`);
            }
            return type;
          }
          __name(convertReadableStreamType, "convertReadableStreamType");
          function convertReaderOptions(options, context) {
            assertDictionary(options, context);
            const mode = options === null || options === void 0 ? void 0 : options.mode;
            return {
              mode: mode === void 0 ? void 0 : convertReadableStreamReaderMode(mode, `${context} has member 'mode' that`)
            };
          }
          __name(convertReaderOptions, "convertReaderOptions");
          function convertReadableStreamReaderMode(mode, context) {
            mode = `${mode}`;
            if (mode !== "byob") {
              throw new TypeError(`${context} '${mode}' is not a valid enumeration value for ReadableStreamReaderMode`);
            }
            return mode;
          }
          __name(convertReadableStreamReaderMode, "convertReadableStreamReaderMode");
          function convertIteratorOptions(options, context) {
            assertDictionary(options, context);
            const preventCancel = options === null || options === void 0 ? void 0 : options.preventCancel;
            return { preventCancel: Boolean(preventCancel) };
          }
          __name(convertIteratorOptions, "convertIteratorOptions");
          function convertPipeOptions(options, context) {
            assertDictionary(options, context);
            const preventAbort = options === null || options === void 0 ? void 0 : options.preventAbort;
            const preventCancel = options === null || options === void 0 ? void 0 : options.preventCancel;
            const preventClose = options === null || options === void 0 ? void 0 : options.preventClose;
            const signal = options === null || options === void 0 ? void 0 : options.signal;
            if (signal !== void 0) {
              assertAbortSignal(signal, `${context} has member 'signal' that`);
            }
            return {
              preventAbort: Boolean(preventAbort),
              preventCancel: Boolean(preventCancel),
              preventClose: Boolean(preventClose),
              signal
            };
          }
          __name(convertPipeOptions, "convertPipeOptions");
          function assertAbortSignal(signal, context) {
            if (!isAbortSignal(signal)) {
              throw new TypeError(`${context} is not an AbortSignal.`);
            }
          }
          __name(assertAbortSignal, "assertAbortSignal");
          function convertReadableWritablePair(pair, context) {
            assertDictionary(pair, context);
            const readable = pair === null || pair === void 0 ? void 0 : pair.readable;
            assertRequiredField(readable, "readable", "ReadableWritablePair");
            assertReadableStream(readable, `${context} has member 'readable' that`);
            const writable = pair === null || pair === void 0 ? void 0 : pair.writable;
            assertRequiredField(writable, "writable", "ReadableWritablePair");
            assertWritableStream(writable, `${context} has member 'writable' that`);
            return { readable, writable };
          }
          __name(convertReadableWritablePair, "convertReadableWritablePair");
          class ReadableStream2 {
            static {
              __name(this, "ReadableStream2");
            }
            constructor(rawUnderlyingSource = {}, rawStrategy = {}) {
              if (rawUnderlyingSource === void 0) {
                rawUnderlyingSource = null;
              } else {
                assertObject(rawUnderlyingSource, "First parameter");
              }
              const strategy = convertQueuingStrategy(rawStrategy, "Second parameter");
              const underlyingSource = convertUnderlyingDefaultOrByteSource(rawUnderlyingSource, "First parameter");
              InitializeReadableStream(this);
              if (underlyingSource.type === "bytes") {
                if (strategy.size !== void 0) {
                  throw new RangeError("The strategy for a byte stream cannot have a size function");
                }
                const highWaterMark = ExtractHighWaterMark(strategy, 0);
                SetUpReadableByteStreamControllerFromUnderlyingSource(this, underlyingSource, highWaterMark);
              } else {
                const sizeAlgorithm = ExtractSizeAlgorithm(strategy);
                const highWaterMark = ExtractHighWaterMark(strategy, 1);
                SetUpReadableStreamDefaultControllerFromUnderlyingSource(this, underlyingSource, highWaterMark, sizeAlgorithm);
              }
            }
            /**
             * Whether or not the readable stream is locked to a {@link ReadableStreamDefaultReader | reader}.
             */
            get locked() {
              if (!IsReadableStream(this)) {
                throw streamBrandCheckException$1("locked");
              }
              return IsReadableStreamLocked(this);
            }
            /**
             * Cancels the stream, signaling a loss of interest in the stream by a consumer.
             *
             * The supplied `reason` argument will be given to the underlying source's {@link UnderlyingSource.cancel | cancel()}
             * method, which might or might not use it.
             */
            cancel(reason = void 0) {
              if (!IsReadableStream(this)) {
                return promiseRejectedWith(streamBrandCheckException$1("cancel"));
              }
              if (IsReadableStreamLocked(this)) {
                return promiseRejectedWith(new TypeError("Cannot cancel a stream that already has a reader"));
              }
              return ReadableStreamCancel(this, reason);
            }
            getReader(rawOptions = void 0) {
              if (!IsReadableStream(this)) {
                throw streamBrandCheckException$1("getReader");
              }
              const options = convertReaderOptions(rawOptions, "First parameter");
              if (options.mode === void 0) {
                return AcquireReadableStreamDefaultReader(this);
              }
              return AcquireReadableStreamBYOBReader(this);
            }
            pipeThrough(rawTransform, rawOptions = {}) {
              if (!IsReadableStream(this)) {
                throw streamBrandCheckException$1("pipeThrough");
              }
              assertRequiredArgument(rawTransform, 1, "pipeThrough");
              const transform = convertReadableWritablePair(rawTransform, "First parameter");
              const options = convertPipeOptions(rawOptions, "Second parameter");
              if (IsReadableStreamLocked(this)) {
                throw new TypeError("ReadableStream.prototype.pipeThrough cannot be used on a locked ReadableStream");
              }
              if (IsWritableStreamLocked(transform.writable)) {
                throw new TypeError("ReadableStream.prototype.pipeThrough cannot be used on a locked WritableStream");
              }
              const promise = ReadableStreamPipeTo(this, transform.writable, options.preventClose, options.preventAbort, options.preventCancel, options.signal);
              setPromiseIsHandledToTrue(promise);
              return transform.readable;
            }
            pipeTo(destination, rawOptions = {}) {
              if (!IsReadableStream(this)) {
                return promiseRejectedWith(streamBrandCheckException$1("pipeTo"));
              }
              if (destination === void 0) {
                return promiseRejectedWith(`Parameter 1 is required in 'pipeTo'.`);
              }
              if (!IsWritableStream(destination)) {
                return promiseRejectedWith(new TypeError(`ReadableStream.prototype.pipeTo's first argument must be a WritableStream`));
              }
              let options;
              try {
                options = convertPipeOptions(rawOptions, "Second parameter");
              } catch (e2) {
                return promiseRejectedWith(e2);
              }
              if (IsReadableStreamLocked(this)) {
                return promiseRejectedWith(new TypeError("ReadableStream.prototype.pipeTo cannot be used on a locked ReadableStream"));
              }
              if (IsWritableStreamLocked(destination)) {
                return promiseRejectedWith(new TypeError("ReadableStream.prototype.pipeTo cannot be used on a locked WritableStream"));
              }
              return ReadableStreamPipeTo(this, destination, options.preventClose, options.preventAbort, options.preventCancel, options.signal);
            }
            /**
             * Tees this readable stream, returning a two-element array containing the two resulting branches as
             * new {@link ReadableStream} instances.
             *
             * Teeing a stream will lock it, preventing any other consumer from acquiring a reader.
             * To cancel the stream, cancel both of the resulting branches; a composite cancellation reason will then be
             * propagated to the stream's underlying source.
             *
             * Note that the chunks seen in each branch will be the same object. If the chunks are not immutable,
             * this could allow interference between the two branches.
             */
            tee() {
              if (!IsReadableStream(this)) {
                throw streamBrandCheckException$1("tee");
              }
              const branches = ReadableStreamTee(this);
              return CreateArrayFromList(branches);
            }
            values(rawOptions = void 0) {
              if (!IsReadableStream(this)) {
                throw streamBrandCheckException$1("values");
              }
              const options = convertIteratorOptions(rawOptions, "First parameter");
              return AcquireReadableStreamAsyncIterator(this, options.preventCancel);
            }
          }
          Object.defineProperties(ReadableStream2.prototype, {
            cancel: { enumerable: true },
            getReader: { enumerable: true },
            pipeThrough: { enumerable: true },
            pipeTo: { enumerable: true },
            tee: { enumerable: true },
            values: { enumerable: true },
            locked: { enumerable: true }
          });
          if (typeof SymbolPolyfill.toStringTag === "symbol") {
            Object.defineProperty(ReadableStream2.prototype, SymbolPolyfill.toStringTag, {
              value: "ReadableStream",
              configurable: true
            });
          }
          if (typeof SymbolPolyfill.asyncIterator === "symbol") {
            Object.defineProperty(ReadableStream2.prototype, SymbolPolyfill.asyncIterator, {
              value: ReadableStream2.prototype.values,
              writable: true,
              configurable: true
            });
          }
          function CreateReadableStream(startAlgorithm, pullAlgorithm, cancelAlgorithm, highWaterMark = 1, sizeAlgorithm = () => 1) {
            const stream = Object.create(ReadableStream2.prototype);
            InitializeReadableStream(stream);
            const controller = Object.create(ReadableStreamDefaultController.prototype);
            SetUpReadableStreamDefaultController(stream, controller, startAlgorithm, pullAlgorithm, cancelAlgorithm, highWaterMark, sizeAlgorithm);
            return stream;
          }
          __name(CreateReadableStream, "CreateReadableStream");
          function CreateReadableByteStream(startAlgorithm, pullAlgorithm, cancelAlgorithm) {
            const stream = Object.create(ReadableStream2.prototype);
            InitializeReadableStream(stream);
            const controller = Object.create(ReadableByteStreamController.prototype);
            SetUpReadableByteStreamController(stream, controller, startAlgorithm, pullAlgorithm, cancelAlgorithm, 0, void 0);
            return stream;
          }
          __name(CreateReadableByteStream, "CreateReadableByteStream");
          function InitializeReadableStream(stream) {
            stream._state = "readable";
            stream._reader = void 0;
            stream._storedError = void 0;
            stream._disturbed = false;
          }
          __name(InitializeReadableStream, "InitializeReadableStream");
          function IsReadableStream(x2) {
            if (!typeIsObject(x2)) {
              return false;
            }
            if (!Object.prototype.hasOwnProperty.call(x2, "_readableStreamController")) {
              return false;
            }
            return x2 instanceof ReadableStream2;
          }
          __name(IsReadableStream, "IsReadableStream");
          function IsReadableStreamLocked(stream) {
            if (stream._reader === void 0) {
              return false;
            }
            return true;
          }
          __name(IsReadableStreamLocked, "IsReadableStreamLocked");
          function ReadableStreamCancel(stream, reason) {
            stream._disturbed = true;
            if (stream._state === "closed") {
              return promiseResolvedWith(void 0);
            }
            if (stream._state === "errored") {
              return promiseRejectedWith(stream._storedError);
            }
            ReadableStreamClose(stream);
            const reader = stream._reader;
            if (reader !== void 0 && IsReadableStreamBYOBReader(reader)) {
              reader._readIntoRequests.forEach((readIntoRequest) => {
                readIntoRequest._closeSteps(void 0);
              });
              reader._readIntoRequests = new SimpleQueue();
            }
            const sourceCancelPromise = stream._readableStreamController[CancelSteps](reason);
            return transformPromiseWith(sourceCancelPromise, noop);
          }
          __name(ReadableStreamCancel, "ReadableStreamCancel");
          function ReadableStreamClose(stream) {
            stream._state = "closed";
            const reader = stream._reader;
            if (reader === void 0) {
              return;
            }
            defaultReaderClosedPromiseResolve(reader);
            if (IsReadableStreamDefaultReader(reader)) {
              reader._readRequests.forEach((readRequest) => {
                readRequest._closeSteps();
              });
              reader._readRequests = new SimpleQueue();
            }
          }
          __name(ReadableStreamClose, "ReadableStreamClose");
          function ReadableStreamError(stream, e2) {
            stream._state = "errored";
            stream._storedError = e2;
            const reader = stream._reader;
            if (reader === void 0) {
              return;
            }
            defaultReaderClosedPromiseReject(reader, e2);
            if (IsReadableStreamDefaultReader(reader)) {
              reader._readRequests.forEach((readRequest) => {
                readRequest._errorSteps(e2);
              });
              reader._readRequests = new SimpleQueue();
            } else {
              reader._readIntoRequests.forEach((readIntoRequest) => {
                readIntoRequest._errorSteps(e2);
              });
              reader._readIntoRequests = new SimpleQueue();
            }
          }
          __name(ReadableStreamError, "ReadableStreamError");
          function streamBrandCheckException$1(name) {
            return new TypeError(`ReadableStream.prototype.${name} can only be used on a ReadableStream`);
          }
          __name(streamBrandCheckException$1, "streamBrandCheckException$1");
          function convertQueuingStrategyInit(init, context) {
            assertDictionary(init, context);
            const highWaterMark = init === null || init === void 0 ? void 0 : init.highWaterMark;
            assertRequiredField(highWaterMark, "highWaterMark", "QueuingStrategyInit");
            return {
              highWaterMark: convertUnrestrictedDouble(highWaterMark)
            };
          }
          __name(convertQueuingStrategyInit, "convertQueuingStrategyInit");
          const byteLengthSizeFunction = /* @__PURE__ */ __name((chunk) => {
            return chunk.byteLength;
          }, "byteLengthSizeFunction");
          try {
            Object.defineProperty(byteLengthSizeFunction, "name", {
              value: "size",
              configurable: true
            });
          } catch (_a) {
          }
          class ByteLengthQueuingStrategy {
            static {
              __name(this, "ByteLengthQueuingStrategy");
            }
            constructor(options) {
              assertRequiredArgument(options, 1, "ByteLengthQueuingStrategy");
              options = convertQueuingStrategyInit(options, "First parameter");
              this._byteLengthQueuingStrategyHighWaterMark = options.highWaterMark;
            }
            /**
             * Returns the high water mark provided to the constructor.
             */
            get highWaterMark() {
              if (!IsByteLengthQueuingStrategy(this)) {
                throw byteLengthBrandCheckException("highWaterMark");
              }
              return this._byteLengthQueuingStrategyHighWaterMark;
            }
            /**
             * Measures the size of `chunk` by returning the value of its `byteLength` property.
             */
            get size() {
              if (!IsByteLengthQueuingStrategy(this)) {
                throw byteLengthBrandCheckException("size");
              }
              return byteLengthSizeFunction;
            }
          }
          Object.defineProperties(ByteLengthQueuingStrategy.prototype, {
            highWaterMark: { enumerable: true },
            size: { enumerable: true }
          });
          if (typeof SymbolPolyfill.toStringTag === "symbol") {
            Object.defineProperty(ByteLengthQueuingStrategy.prototype, SymbolPolyfill.toStringTag, {
              value: "ByteLengthQueuingStrategy",
              configurable: true
            });
          }
          function byteLengthBrandCheckException(name) {
            return new TypeError(`ByteLengthQueuingStrategy.prototype.${name} can only be used on a ByteLengthQueuingStrategy`);
          }
          __name(byteLengthBrandCheckException, "byteLengthBrandCheckException");
          function IsByteLengthQueuingStrategy(x2) {
            if (!typeIsObject(x2)) {
              return false;
            }
            if (!Object.prototype.hasOwnProperty.call(x2, "_byteLengthQueuingStrategyHighWaterMark")) {
              return false;
            }
            return x2 instanceof ByteLengthQueuingStrategy;
          }
          __name(IsByteLengthQueuingStrategy, "IsByteLengthQueuingStrategy");
          const countSizeFunction = /* @__PURE__ */ __name(() => {
            return 1;
          }, "countSizeFunction");
          try {
            Object.defineProperty(countSizeFunction, "name", {
              value: "size",
              configurable: true
            });
          } catch (_a) {
          }
          class CountQueuingStrategy {
            static {
              __name(this, "CountQueuingStrategy");
            }
            constructor(options) {
              assertRequiredArgument(options, 1, "CountQueuingStrategy");
              options = convertQueuingStrategyInit(options, "First parameter");
              this._countQueuingStrategyHighWaterMark = options.highWaterMark;
            }
            /**
             * Returns the high water mark provided to the constructor.
             */
            get highWaterMark() {
              if (!IsCountQueuingStrategy(this)) {
                throw countBrandCheckException("highWaterMark");
              }
              return this._countQueuingStrategyHighWaterMark;
            }
            /**
             * Measures the size of `chunk` by always returning 1.
             * This ensures that the total queue size is a count of the number of chunks in the queue.
             */
            get size() {
              if (!IsCountQueuingStrategy(this)) {
                throw countBrandCheckException("size");
              }
              return countSizeFunction;
            }
          }
          Object.defineProperties(CountQueuingStrategy.prototype, {
            highWaterMark: { enumerable: true },
            size: { enumerable: true }
          });
          if (typeof SymbolPolyfill.toStringTag === "symbol") {
            Object.defineProperty(CountQueuingStrategy.prototype, SymbolPolyfill.toStringTag, {
              value: "CountQueuingStrategy",
              configurable: true
            });
          }
          function countBrandCheckException(name) {
            return new TypeError(`CountQueuingStrategy.prototype.${name} can only be used on a CountQueuingStrategy`);
          }
          __name(countBrandCheckException, "countBrandCheckException");
          function IsCountQueuingStrategy(x2) {
            if (!typeIsObject(x2)) {
              return false;
            }
            if (!Object.prototype.hasOwnProperty.call(x2, "_countQueuingStrategyHighWaterMark")) {
              return false;
            }
            return x2 instanceof CountQueuingStrategy;
          }
          __name(IsCountQueuingStrategy, "IsCountQueuingStrategy");
          function convertTransformer(original, context) {
            assertDictionary(original, context);
            const flush = original === null || original === void 0 ? void 0 : original.flush;
            const readableType = original === null || original === void 0 ? void 0 : original.readableType;
            const start = original === null || original === void 0 ? void 0 : original.start;
            const transform = original === null || original === void 0 ? void 0 : original.transform;
            const writableType = original === null || original === void 0 ? void 0 : original.writableType;
            return {
              flush: flush === void 0 ? void 0 : convertTransformerFlushCallback(flush, original, `${context} has member 'flush' that`),
              readableType,
              start: start === void 0 ? void 0 : convertTransformerStartCallback(start, original, `${context} has member 'start' that`),
              transform: transform === void 0 ? void 0 : convertTransformerTransformCallback(transform, original, `${context} has member 'transform' that`),
              writableType
            };
          }
          __name(convertTransformer, "convertTransformer");
          function convertTransformerFlushCallback(fn, original, context) {
            assertFunction(fn, context);
            return (controller) => promiseCall(fn, original, [controller]);
          }
          __name(convertTransformerFlushCallback, "convertTransformerFlushCallback");
          function convertTransformerStartCallback(fn, original, context) {
            assertFunction(fn, context);
            return (controller) => reflectCall(fn, original, [controller]);
          }
          __name(convertTransformerStartCallback, "convertTransformerStartCallback");
          function convertTransformerTransformCallback(fn, original, context) {
            assertFunction(fn, context);
            return (chunk, controller) => promiseCall(fn, original, [chunk, controller]);
          }
          __name(convertTransformerTransformCallback, "convertTransformerTransformCallback");
          class TransformStream {
            static {
              __name(this, "TransformStream");
            }
            constructor(rawTransformer = {}, rawWritableStrategy = {}, rawReadableStrategy = {}) {
              if (rawTransformer === void 0) {
                rawTransformer = null;
              }
              const writableStrategy = convertQueuingStrategy(rawWritableStrategy, "Second parameter");
              const readableStrategy = convertQueuingStrategy(rawReadableStrategy, "Third parameter");
              const transformer = convertTransformer(rawTransformer, "First parameter");
              if (transformer.readableType !== void 0) {
                throw new RangeError("Invalid readableType specified");
              }
              if (transformer.writableType !== void 0) {
                throw new RangeError("Invalid writableType specified");
              }
              const readableHighWaterMark = ExtractHighWaterMark(readableStrategy, 0);
              const readableSizeAlgorithm = ExtractSizeAlgorithm(readableStrategy);
              const writableHighWaterMark = ExtractHighWaterMark(writableStrategy, 1);
              const writableSizeAlgorithm = ExtractSizeAlgorithm(writableStrategy);
              let startPromise_resolve;
              const startPromise = newPromise((resolve) => {
                startPromise_resolve = resolve;
              });
              InitializeTransformStream(this, startPromise, writableHighWaterMark, writableSizeAlgorithm, readableHighWaterMark, readableSizeAlgorithm);
              SetUpTransformStreamDefaultControllerFromTransformer(this, transformer);
              if (transformer.start !== void 0) {
                startPromise_resolve(transformer.start(this._transformStreamController));
              } else {
                startPromise_resolve(void 0);
              }
            }
            /**
             * The readable side of the transform stream.
             */
            get readable() {
              if (!IsTransformStream(this)) {
                throw streamBrandCheckException("readable");
              }
              return this._readable;
            }
            /**
             * The writable side of the transform stream.
             */
            get writable() {
              if (!IsTransformStream(this)) {
                throw streamBrandCheckException("writable");
              }
              return this._writable;
            }
          }
          Object.defineProperties(TransformStream.prototype, {
            readable: { enumerable: true },
            writable: { enumerable: true }
          });
          if (typeof SymbolPolyfill.toStringTag === "symbol") {
            Object.defineProperty(TransformStream.prototype, SymbolPolyfill.toStringTag, {
              value: "TransformStream",
              configurable: true
            });
          }
          function InitializeTransformStream(stream, startPromise, writableHighWaterMark, writableSizeAlgorithm, readableHighWaterMark, readableSizeAlgorithm) {
            function startAlgorithm() {
              return startPromise;
            }
            __name(startAlgorithm, "startAlgorithm");
            function writeAlgorithm(chunk) {
              return TransformStreamDefaultSinkWriteAlgorithm(stream, chunk);
            }
            __name(writeAlgorithm, "writeAlgorithm");
            function abortAlgorithm(reason) {
              return TransformStreamDefaultSinkAbortAlgorithm(stream, reason);
            }
            __name(abortAlgorithm, "abortAlgorithm");
            function closeAlgorithm() {
              return TransformStreamDefaultSinkCloseAlgorithm(stream);
            }
            __name(closeAlgorithm, "closeAlgorithm");
            stream._writable = CreateWritableStream(startAlgorithm, writeAlgorithm, closeAlgorithm, abortAlgorithm, writableHighWaterMark, writableSizeAlgorithm);
            function pullAlgorithm() {
              return TransformStreamDefaultSourcePullAlgorithm(stream);
            }
            __name(pullAlgorithm, "pullAlgorithm");
            function cancelAlgorithm(reason) {
              TransformStreamErrorWritableAndUnblockWrite(stream, reason);
              return promiseResolvedWith(void 0);
            }
            __name(cancelAlgorithm, "cancelAlgorithm");
            stream._readable = CreateReadableStream(startAlgorithm, pullAlgorithm, cancelAlgorithm, readableHighWaterMark, readableSizeAlgorithm);
            stream._backpressure = void 0;
            stream._backpressureChangePromise = void 0;
            stream._backpressureChangePromise_resolve = void 0;
            TransformStreamSetBackpressure(stream, true);
            stream._transformStreamController = void 0;
          }
          __name(InitializeTransformStream, "InitializeTransformStream");
          function IsTransformStream(x2) {
            if (!typeIsObject(x2)) {
              return false;
            }
            if (!Object.prototype.hasOwnProperty.call(x2, "_transformStreamController")) {
              return false;
            }
            return x2 instanceof TransformStream;
          }
          __name(IsTransformStream, "IsTransformStream");
          function TransformStreamError(stream, e2) {
            ReadableStreamDefaultControllerError(stream._readable._readableStreamController, e2);
            TransformStreamErrorWritableAndUnblockWrite(stream, e2);
          }
          __name(TransformStreamError, "TransformStreamError");
          function TransformStreamErrorWritableAndUnblockWrite(stream, e2) {
            TransformStreamDefaultControllerClearAlgorithms(stream._transformStreamController);
            WritableStreamDefaultControllerErrorIfNeeded(stream._writable._writableStreamController, e2);
            if (stream._backpressure) {
              TransformStreamSetBackpressure(stream, false);
            }
          }
          __name(TransformStreamErrorWritableAndUnblockWrite, "TransformStreamErrorWritableAndUnblockWrite");
          function TransformStreamSetBackpressure(stream, backpressure) {
            if (stream._backpressureChangePromise !== void 0) {
              stream._backpressureChangePromise_resolve();
            }
            stream._backpressureChangePromise = newPromise((resolve) => {
              stream._backpressureChangePromise_resolve = resolve;
            });
            stream._backpressure = backpressure;
          }
          __name(TransformStreamSetBackpressure, "TransformStreamSetBackpressure");
          class TransformStreamDefaultController {
            static {
              __name(this, "TransformStreamDefaultController");
            }
            constructor() {
              throw new TypeError("Illegal constructor");
            }
            /**
             * Returns the desired size to fill the readable side’s internal queue. It can be negative, if the queue is over-full.
             */
            get desiredSize() {
              if (!IsTransformStreamDefaultController(this)) {
                throw defaultControllerBrandCheckException("desiredSize");
              }
              const readableController = this._controlledTransformStream._readable._readableStreamController;
              return ReadableStreamDefaultControllerGetDesiredSize(readableController);
            }
            enqueue(chunk = void 0) {
              if (!IsTransformStreamDefaultController(this)) {
                throw defaultControllerBrandCheckException("enqueue");
              }
              TransformStreamDefaultControllerEnqueue(this, chunk);
            }
            /**
             * Errors both the readable side and the writable side of the controlled transform stream, making all future
             * interactions with it fail with the given error `e`. Any chunks queued for transformation will be discarded.
             */
            error(reason = void 0) {
              if (!IsTransformStreamDefaultController(this)) {
                throw defaultControllerBrandCheckException("error");
              }
              TransformStreamDefaultControllerError(this, reason);
            }
            /**
             * Closes the readable side and errors the writable side of the controlled transform stream. This is useful when the
             * transformer only needs to consume a portion of the chunks written to the writable side.
             */
            terminate() {
              if (!IsTransformStreamDefaultController(this)) {
                throw defaultControllerBrandCheckException("terminate");
              }
              TransformStreamDefaultControllerTerminate(this);
            }
          }
          Object.defineProperties(TransformStreamDefaultController.prototype, {
            enqueue: { enumerable: true },
            error: { enumerable: true },
            terminate: { enumerable: true },
            desiredSize: { enumerable: true }
          });
          if (typeof SymbolPolyfill.toStringTag === "symbol") {
            Object.defineProperty(TransformStreamDefaultController.prototype, SymbolPolyfill.toStringTag, {
              value: "TransformStreamDefaultController",
              configurable: true
            });
          }
          function IsTransformStreamDefaultController(x2) {
            if (!typeIsObject(x2)) {
              return false;
            }
            if (!Object.prototype.hasOwnProperty.call(x2, "_controlledTransformStream")) {
              return false;
            }
            return x2 instanceof TransformStreamDefaultController;
          }
          __name(IsTransformStreamDefaultController, "IsTransformStreamDefaultController");
          function SetUpTransformStreamDefaultController(stream, controller, transformAlgorithm, flushAlgorithm) {
            controller._controlledTransformStream = stream;
            stream._transformStreamController = controller;
            controller._transformAlgorithm = transformAlgorithm;
            controller._flushAlgorithm = flushAlgorithm;
          }
          __name(SetUpTransformStreamDefaultController, "SetUpTransformStreamDefaultController");
          function SetUpTransformStreamDefaultControllerFromTransformer(stream, transformer) {
            const controller = Object.create(TransformStreamDefaultController.prototype);
            let transformAlgorithm = /* @__PURE__ */ __name((chunk) => {
              try {
                TransformStreamDefaultControllerEnqueue(controller, chunk);
                return promiseResolvedWith(void 0);
              } catch (transformResultE) {
                return promiseRejectedWith(transformResultE);
              }
            }, "transformAlgorithm");
            let flushAlgorithm = /* @__PURE__ */ __name(() => promiseResolvedWith(void 0), "flushAlgorithm");
            if (transformer.transform !== void 0) {
              transformAlgorithm = /* @__PURE__ */ __name((chunk) => transformer.transform(chunk, controller), "transformAlgorithm");
            }
            if (transformer.flush !== void 0) {
              flushAlgorithm = /* @__PURE__ */ __name(() => transformer.flush(controller), "flushAlgorithm");
            }
            SetUpTransformStreamDefaultController(stream, controller, transformAlgorithm, flushAlgorithm);
          }
          __name(SetUpTransformStreamDefaultControllerFromTransformer, "SetUpTransformStreamDefaultControllerFromTransformer");
          function TransformStreamDefaultControllerClearAlgorithms(controller) {
            controller._transformAlgorithm = void 0;
            controller._flushAlgorithm = void 0;
          }
          __name(TransformStreamDefaultControllerClearAlgorithms, "TransformStreamDefaultControllerClearAlgorithms");
          function TransformStreamDefaultControllerEnqueue(controller, chunk) {
            const stream = controller._controlledTransformStream;
            const readableController = stream._readable._readableStreamController;
            if (!ReadableStreamDefaultControllerCanCloseOrEnqueue(readableController)) {
              throw new TypeError("Readable side is not in a state that permits enqueue");
            }
            try {
              ReadableStreamDefaultControllerEnqueue(readableController, chunk);
            } catch (e2) {
              TransformStreamErrorWritableAndUnblockWrite(stream, e2);
              throw stream._readable._storedError;
            }
            const backpressure = ReadableStreamDefaultControllerHasBackpressure(readableController);
            if (backpressure !== stream._backpressure) {
              TransformStreamSetBackpressure(stream, true);
            }
          }
          __name(TransformStreamDefaultControllerEnqueue, "TransformStreamDefaultControllerEnqueue");
          function TransformStreamDefaultControllerError(controller, e2) {
            TransformStreamError(controller._controlledTransformStream, e2);
          }
          __name(TransformStreamDefaultControllerError, "TransformStreamDefaultControllerError");
          function TransformStreamDefaultControllerPerformTransform(controller, chunk) {
            const transformPromise = controller._transformAlgorithm(chunk);
            return transformPromiseWith(transformPromise, void 0, (r2) => {
              TransformStreamError(controller._controlledTransformStream, r2);
              throw r2;
            });
          }
          __name(TransformStreamDefaultControllerPerformTransform, "TransformStreamDefaultControllerPerformTransform");
          function TransformStreamDefaultControllerTerminate(controller) {
            const stream = controller._controlledTransformStream;
            const readableController = stream._readable._readableStreamController;
            ReadableStreamDefaultControllerClose(readableController);
            const error = new TypeError("TransformStream terminated");
            TransformStreamErrorWritableAndUnblockWrite(stream, error);
          }
          __name(TransformStreamDefaultControllerTerminate, "TransformStreamDefaultControllerTerminate");
          function TransformStreamDefaultSinkWriteAlgorithm(stream, chunk) {
            const controller = stream._transformStreamController;
            if (stream._backpressure) {
              const backpressureChangePromise = stream._backpressureChangePromise;
              return transformPromiseWith(backpressureChangePromise, () => {
                const writable = stream._writable;
                const state = writable._state;
                if (state === "erroring") {
                  throw writable._storedError;
                }
                return TransformStreamDefaultControllerPerformTransform(controller, chunk);
              });
            }
            return TransformStreamDefaultControllerPerformTransform(controller, chunk);
          }
          __name(TransformStreamDefaultSinkWriteAlgorithm, "TransformStreamDefaultSinkWriteAlgorithm");
          function TransformStreamDefaultSinkAbortAlgorithm(stream, reason) {
            TransformStreamError(stream, reason);
            return promiseResolvedWith(void 0);
          }
          __name(TransformStreamDefaultSinkAbortAlgorithm, "TransformStreamDefaultSinkAbortAlgorithm");
          function TransformStreamDefaultSinkCloseAlgorithm(stream) {
            const readable = stream._readable;
            const controller = stream._transformStreamController;
            const flushPromise = controller._flushAlgorithm();
            TransformStreamDefaultControllerClearAlgorithms(controller);
            return transformPromiseWith(flushPromise, () => {
              if (readable._state === "errored") {
                throw readable._storedError;
              }
              ReadableStreamDefaultControllerClose(readable._readableStreamController);
            }, (r2) => {
              TransformStreamError(stream, r2);
              throw readable._storedError;
            });
          }
          __name(TransformStreamDefaultSinkCloseAlgorithm, "TransformStreamDefaultSinkCloseAlgorithm");
          function TransformStreamDefaultSourcePullAlgorithm(stream) {
            TransformStreamSetBackpressure(stream, false);
            return stream._backpressureChangePromise;
          }
          __name(TransformStreamDefaultSourcePullAlgorithm, "TransformStreamDefaultSourcePullAlgorithm");
          function defaultControllerBrandCheckException(name) {
            return new TypeError(`TransformStreamDefaultController.prototype.${name} can only be used on a TransformStreamDefaultController`);
          }
          __name(defaultControllerBrandCheckException, "defaultControllerBrandCheckException");
          function streamBrandCheckException(name) {
            return new TypeError(`TransformStream.prototype.${name} can only be used on a TransformStream`);
          }
          __name(streamBrandCheckException, "streamBrandCheckException");
          exports22.ByteLengthQueuingStrategy = ByteLengthQueuingStrategy;
          exports22.CountQueuingStrategy = CountQueuingStrategy;
          exports22.ReadableByteStreamController = ReadableByteStreamController;
          exports22.ReadableStream = ReadableStream2;
          exports22.ReadableStreamBYOBReader = ReadableStreamBYOBReader;
          exports22.ReadableStreamBYOBRequest = ReadableStreamBYOBRequest;
          exports22.ReadableStreamDefaultController = ReadableStreamDefaultController;
          exports22.ReadableStreamDefaultReader = ReadableStreamDefaultReader;
          exports22.TransformStream = TransformStream;
          exports22.TransformStreamDefaultController = TransformStreamDefaultController;
          exports22.WritableStream = WritableStream;
          exports22.WritableStreamDefaultController = WritableStreamDefaultController;
          exports22.WritableStreamDefaultWriter = WritableStreamDefaultWriter;
          Object.defineProperty(exports22, "__esModule", { value: true });
        });
      }
    });
    var require_streams = (0, import_chunk_4VNS5WPM.__commonJS)({
      "../../node_modules/.pnpm/fetch-blob@3.2.0/node_modules/fetch-blob/streams.cjs"() {
        "use strict";
        var POOL_SIZE2 = 65536;
        if (!globalThis.ReadableStream) {
          try {
            const process = (0, import_chunk_4VNS5WPM.__require)("node:process");
            const { emitWarning } = process;
            try {
              process.emitWarning = () => {
              };
              Object.assign(globalThis, (0, import_chunk_4VNS5WPM.__require)("node:stream/web"));
              process.emitWarning = emitWarning;
            } catch (error) {
              process.emitWarning = emitWarning;
              throw error;
            }
          } catch (error) {
            Object.assign(globalThis, require_ponyfill_es2018());
          }
        }
        try {
          const { Blob: Blob3 } = (0, import_chunk_4VNS5WPM.__require)("buffer");
          if (Blob3 && !Blob3.prototype.stream) {
            Blob3.prototype.stream = /* @__PURE__ */ __name(function name(params) {
              let position = 0;
              const blob = this;
              return new ReadableStream({
                type: "bytes",
                async pull(ctrl) {
                  const chunk = blob.slice(position, Math.min(blob.size, position + POOL_SIZE2));
                  const buffer = await chunk.arrayBuffer();
                  position += buffer.byteLength;
                  ctrl.enqueue(new Uint8Array(buffer));
                  if (position === blob.size) {
                    ctrl.close();
                  }
                }
              });
            }, "name");
          }
        } catch (error) {
        }
      }
    });
    var require_node_domexception = (0, import_chunk_4VNS5WPM.__commonJS)({
      "../../node_modules/.pnpm/node-domexception@1.0.0/node_modules/node-domexception/index.js"(exports2, module2) {
        "use strict";
        if (!globalThis.DOMException) {
          try {
            const { MessageChannel } = (0, import_chunk_4VNS5WPM.__require)("worker_threads"), port = new MessageChannel().port1, ab = new ArrayBuffer();
            port.postMessage(ab, [ab, ab]);
          } catch (err) {
            err.constructor.name === "DOMException" && (globalThis.DOMException = err.constructor);
          }
        }
        module2.exports = globalThis.DOMException;
      }
    });
    var import_streams = (0, import_chunk_4VNS5WPM.__toESM)(require_streams(), 1);
    var POOL_SIZE = 65536;
    async function* toIterator(parts, clone = true) {
      for (const part of parts) {
        if ("stream" in part) {
          yield* (
            /** @type {AsyncIterableIterator<Uint8Array>} */
            part.stream()
          );
        } else if (ArrayBuffer.isView(part)) {
          if (clone) {
            let position = part.byteOffset;
            const end = part.byteOffset + part.byteLength;
            while (position !== end) {
              const size = Math.min(end - position, POOL_SIZE);
              const chunk = part.buffer.slice(position, position + size);
              position += chunk.byteLength;
              yield new Uint8Array(chunk);
            }
          } else {
            yield part;
          }
        } else {
          let position = 0, b = (
            /** @type {Blob} */
            part
          );
          while (position !== b.size) {
            const chunk = b.slice(position, Math.min(b.size, position + POOL_SIZE));
            const buffer = await chunk.arrayBuffer();
            position += buffer.byteLength;
            yield new Uint8Array(buffer);
          }
        }
      }
    }
    __name(toIterator, "toIterator");
    var _Blob = class Blob {
      static {
        __name(this, "Blob");
      }
      /** @type {Array.<(Blob|Uint8Array)>} */
      #parts = [];
      #type = "";
      #size = 0;
      #endings = "transparent";
      /**
       * The Blob() constructor returns a new Blob object. The content
       * of the blob consists of the concatenation of the values given
       * in the parameter array.
       *
       * @param {*} blobParts
       * @param {{ type?: string, endings?: string }} [options]
       */
      constructor(blobParts = [], options = {}) {
        if (typeof blobParts !== "object" || blobParts === null) {
          throw new TypeError("Failed to construct 'Blob': The provided value cannot be converted to a sequence.");
        }
        if (typeof blobParts[Symbol.iterator] !== "function") {
          throw new TypeError("Failed to construct 'Blob': The object must have a callable @@iterator property.");
        }
        if (typeof options !== "object" && typeof options !== "function") {
          throw new TypeError("Failed to construct 'Blob': parameter 2 cannot convert to dictionary.");
        }
        if (options === null) options = {};
        const encoder = new TextEncoder();
        for (const element of blobParts) {
          let part;
          if (ArrayBuffer.isView(element)) {
            part = new Uint8Array(element.buffer.slice(element.byteOffset, element.byteOffset + element.byteLength));
          } else if (element instanceof ArrayBuffer) {
            part = new Uint8Array(element.slice(0));
          } else if (element instanceof Blob) {
            part = element;
          } else {
            part = encoder.encode(`${element}`);
          }
          this.#size += ArrayBuffer.isView(part) ? part.byteLength : part.size;
          this.#parts.push(part);
        }
        this.#endings = `${options.endings === void 0 ? "transparent" : options.endings}`;
        const type = options.type === void 0 ? "" : String(options.type);
        this.#type = /^[\x20-\x7E]*$/.test(type) ? type : "";
      }
      /**
       * The Blob interface's size property returns the
       * size of the Blob in bytes.
       */
      get size() {
        return this.#size;
      }
      /**
       * The type property of a Blob object returns the MIME type of the file.
       */
      get type() {
        return this.#type;
      }
      /**
       * The text() method in the Blob interface returns a Promise
       * that resolves with a string containing the contents of
       * the blob, interpreted as UTF-8.
       *
       * @return {Promise<string>}
       */
      async text() {
        const decoder = new TextDecoder();
        let str = "";
        for await (const part of toIterator(this.#parts, false)) {
          str += decoder.decode(part, { stream: true });
        }
        str += decoder.decode();
        return str;
      }
      /**
       * The arrayBuffer() method in the Blob interface returns a
       * Promise that resolves with the contents of the blob as
       * binary data contained in an ArrayBuffer.
       *
       * @return {Promise<ArrayBuffer>}
       */
      async arrayBuffer() {
        const data = new Uint8Array(this.size);
        let offset = 0;
        for await (const chunk of toIterator(this.#parts, false)) {
          data.set(chunk, offset);
          offset += chunk.length;
        }
        return data.buffer;
      }
      stream() {
        const it = toIterator(this.#parts, true);
        return new globalThis.ReadableStream({
          // @ts-ignore
          type: "bytes",
          async pull(ctrl) {
            const chunk = await it.next();
            chunk.done ? ctrl.close() : ctrl.enqueue(chunk.value);
          },
          async cancel() {
            await it.return();
          }
        });
      }
      /**
       * The Blob interface's slice() method creates and returns a
       * new Blob object which contains data from a subset of the
       * blob on which it's called.
       *
       * @param {number} [start]
       * @param {number} [end]
       * @param {string} [type]
       */
      slice(start = 0, end = this.size, type = "") {
        const { size } = this;
        let relativeStart = start < 0 ? Math.max(size + start, 0) : Math.min(start, size);
        let relativeEnd = end < 0 ? Math.max(size + end, 0) : Math.min(end, size);
        const span = Math.max(relativeEnd - relativeStart, 0);
        const parts = this.#parts;
        const blobParts = [];
        let added = 0;
        for (const part of parts) {
          if (added >= span) {
            break;
          }
          const size2 = ArrayBuffer.isView(part) ? part.byteLength : part.size;
          if (relativeStart && size2 <= relativeStart) {
            relativeStart -= size2;
            relativeEnd -= size2;
          } else {
            let chunk;
            if (ArrayBuffer.isView(part)) {
              chunk = part.subarray(relativeStart, Math.min(size2, relativeEnd));
              added += chunk.byteLength;
            } else {
              chunk = part.slice(relativeStart, Math.min(size2, relativeEnd));
              added += chunk.size;
            }
            relativeEnd -= size2;
            blobParts.push(chunk);
            relativeStart = 0;
          }
        }
        const blob = new Blob([], { type: String(type).toLowerCase() });
        blob.#size = span;
        blob.#parts = blobParts;
        return blob;
      }
      get [Symbol.toStringTag]() {
        return "Blob";
      }
      static [Symbol.hasInstance](object) {
        return object && typeof object === "object" && typeof object.constructor === "function" && (typeof object.stream === "function" || typeof object.arrayBuffer === "function") && /^(Blob|File)$/.test(object[Symbol.toStringTag]);
      }
    };
    Object.defineProperties(_Blob.prototype, {
      size: { enumerable: true },
      type: { enumerable: true },
      slice: { enumerable: true }
    });
    var Blob2 = _Blob;
    var fetch_blob_default = Blob2;
    var _File = class File extends fetch_blob_default {
      static {
        __name(this, "File");
      }
      #lastModified = 0;
      #name = "";
      /**
       * @param {*[]} fileBits
       * @param {string} fileName
       * @param {{lastModified?: number, type?: string}} options
       */
      // @ts-ignore
      constructor(fileBits, fileName, options = {}) {
        if (arguments.length < 2) {
          throw new TypeError(`Failed to construct 'File': 2 arguments required, but only ${arguments.length} present.`);
        }
        super(fileBits, options);
        if (options === null) options = {};
        const lastModified = options.lastModified === void 0 ? Date.now() : Number(options.lastModified);
        if (!Number.isNaN(lastModified)) {
          this.#lastModified = lastModified;
        }
        this.#name = String(fileName);
      }
      get name() {
        return this.#name;
      }
      get lastModified() {
        return this.#lastModified;
      }
      get [Symbol.toStringTag]() {
        return "File";
      }
      static [Symbol.hasInstance](object) {
        return !!object && object instanceof fetch_blob_default && /^(File)$/.test(object[Symbol.toStringTag]);
      }
    };
    var File2 = _File;
    var file_default = File2;
    var { toStringTag: t, iterator: i, hasInstance: h } = Symbol;
    var r = Math.random;
    var m = "append,set,get,getAll,delete,keys,values,entries,forEach,constructor".split(",");
    var f = /* @__PURE__ */ __name((a, b, c) => (a += "", /^(Blob|File)$/.test(b && b[t]) ? [(c = c !== void 0 ? c + "" : b[t] == "File" ? b.name : "blob", a), b.name !== c || b[t] == "blob" ? new file_default([b], c, b) : b] : [a, b + ""]), "f");
    var e = /* @__PURE__ */ __name((c, f2) => (f2 ? c : c.replace(/\r?\n|\r/g, "\r\n")).replace(/\n/g, "%0A").replace(/\r/g, "%0D").replace(/"/g, "%22"), "e");
    var x = /* @__PURE__ */ __name((n, a, e2) => {
      if (a.length < e2) {
        throw new TypeError(`Failed to execute '${n}' on 'FormData': ${e2} arguments required, but only ${a.length} present.`);
      }
    }, "x");
    var FormData = class FormData2 {
      static {
        __name(this, "FormData2");
      }
      #d = [];
      constructor(...a) {
        if (a.length) throw new TypeError(`Failed to construct 'FormData': parameter 1 is not of type 'HTMLFormElement'.`);
      }
      get [t]() {
        return "FormData";
      }
      [i]() {
        return this.entries();
      }
      static [h](o) {
        return o && typeof o === "object" && o[t] === "FormData" && !m.some((m2) => typeof o[m2] != "function");
      }
      append(...a) {
        x("append", arguments, 2);
        this.#d.push(f(...a));
      }
      delete(a) {
        x("delete", arguments, 1);
        a += "";
        this.#d = this.#d.filter(([b]) => b !== a);
      }
      get(a) {
        x("get", arguments, 1);
        a += "";
        for (var b = this.#d, l = b.length, c = 0; c < l; c++) if (b[c][0] === a) return b[c][1];
        return null;
      }
      getAll(a, b) {
        x("getAll", arguments, 1);
        b = [];
        a += "";
        this.#d.forEach((c) => c[0] === a && b.push(c[1]));
        return b;
      }
      has(a) {
        x("has", arguments, 1);
        a += "";
        return this.#d.some((b) => b[0] === a);
      }
      forEach(a, b) {
        x("forEach", arguments, 1);
        for (var [c, d] of this) a.call(b, d, c, this);
      }
      set(...a) {
        x("set", arguments, 2);
        var b = [], c = true;
        a = f(...a);
        this.#d.forEach((d) => {
          d[0] === a[0] ? c && (c = !b.push(a)) : b.push(d);
        });
        c && b.push(a);
        this.#d = b;
      }
      *entries() {
        yield* this.#d;
      }
      *keys() {
        for (var [a] of this) yield a;
      }
      *values() {
        for (var [, a] of this) yield a;
      }
    };
    function formDataToBlob(F, B = fetch_blob_default) {
      var b = `${r()}${r()}`.replace(/\./g, "").slice(-28).padStart(32, "-"), c = [], p = `--${b}\r
Content-Disposition: form-data; name="`;
      F.forEach((v, n) => typeof v == "string" ? c.push(p + e(n) + `"\r
\r
${v.replace(/\r(?!\n)|(?<!\r)\n/g, "\r\n")}\r
`) : c.push(p + e(n) + `"; filename="${e(v.name, 1)}"\r
Content-Type: ${v.type || "application/octet-stream"}\r
\r
`, v, "\r\n"));
      c.push(`--${b}--`);
      return new B(c, { type: "multipart/form-data; boundary=" + b });
    }
    __name(formDataToBlob, "formDataToBlob");
    var import_node_domexception = (0, import_chunk_4VNS5WPM.__toESM)(require_node_domexception(), 1);
    var { stat } = import_node_fs.promises;
  }
});

export {
  require_chunk_4VNS5WPM,
  require_chunk_NVNI2SRU
};
