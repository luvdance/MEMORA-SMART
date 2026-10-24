import {
  __esm,
  __name,
  init_globals
} from "./node-runtime-chunk-WY7WQXFC.js";

// scripts/node-lab/node_modules/@prisma/schema-engine-wasm/schema_engine_bg.js
function __wbg_set_wasm(val) {
  wasm = val;
}
function getUint8ArrayMemory0() {
  if (cachedUint8ArrayMemory0 === null || cachedUint8ArrayMemory0.byteLength === 0) {
    cachedUint8ArrayMemory0 = new Uint8Array(wasm.memory.buffer);
  }
  return cachedUint8ArrayMemory0;
}
function decodeText(ptr, len) {
  numBytesDecoded += len;
  if (numBytesDecoded >= MAX_SAFARI_DECODE_BYTES) {
    cachedTextDecoder = new TextDecoder("utf-8", { ignoreBOM: true, fatal: true });
    cachedTextDecoder.decode();
    numBytesDecoded = len;
  }
  return cachedTextDecoder.decode(getUint8ArrayMemory0().subarray(ptr, ptr + len));
}
function getStringFromWasm0(ptr, len) {
  ptr = ptr >>> 0;
  return decodeText(ptr, len);
}
function passStringToWasm0(arg, malloc, realloc) {
  if (realloc === void 0) {
    const buf = cachedTextEncoder.encode(arg);
    const ptr2 = malloc(buf.length, 1) >>> 0;
    getUint8ArrayMemory0().subarray(ptr2, ptr2 + buf.length).set(buf);
    WASM_VECTOR_LEN = buf.length;
    return ptr2;
  }
  let len = arg.length;
  let ptr = malloc(len, 1) >>> 0;
  const mem = getUint8ArrayMemory0();
  let offset = 0;
  for (; offset < len; offset++) {
    const code = arg.charCodeAt(offset);
    if (code > 127) break;
    mem[ptr + offset] = code;
  }
  if (offset !== len) {
    if (offset !== 0) {
      arg = arg.slice(offset);
    }
    ptr = realloc(ptr, len, len = offset + arg.length * 3, 1) >>> 0;
    const view = getUint8ArrayMemory0().subarray(ptr + offset, ptr + len);
    const ret = cachedTextEncoder.encodeInto(arg, view);
    offset += ret.written;
    ptr = realloc(ptr, len, offset, 1) >>> 0;
  }
  WASM_VECTOR_LEN = offset;
  return ptr;
}
function getDataViewMemory0() {
  if (cachedDataViewMemory0 === null || cachedDataViewMemory0.buffer.detached === true || cachedDataViewMemory0.buffer.detached === void 0 && cachedDataViewMemory0.buffer !== wasm.memory.buffer) {
    cachedDataViewMemory0 = new DataView(wasm.memory.buffer);
  }
  return cachedDataViewMemory0;
}
function isLikeNone(x) {
  return x === void 0 || x === null;
}
function debugString(val) {
  const type = typeof val;
  if (type == "number" || type == "boolean" || val == null) {
    return `${val}`;
  }
  if (type == "string") {
    return `"${val}"`;
  }
  if (type == "symbol") {
    const description = val.description;
    if (description == null) {
      return "Symbol";
    } else {
      return `Symbol(${description})`;
    }
  }
  if (type == "function") {
    const name = val.name;
    if (typeof name == "string" && name.length > 0) {
      return `Function(${name})`;
    } else {
      return "Function";
    }
  }
  if (Array.isArray(val)) {
    const length = val.length;
    let debug = "[";
    if (length > 0) {
      debug += debugString(val[0]);
    }
    for (let i = 1; i < length; i++) {
      debug += ", " + debugString(val[i]);
    }
    debug += "]";
    return debug;
  }
  const builtInMatches = /\[object ([^\]]+)\]/.exec(toString.call(val));
  let className;
  if (builtInMatches && builtInMatches.length > 1) {
    className = builtInMatches[1];
  } else {
    return toString.call(val);
  }
  if (className == "Object") {
    try {
      return "Object(" + JSON.stringify(val) + ")";
    } catch (_) {
      return "Object";
    }
  }
  if (val instanceof Error) {
    return `${val.name}: ${val.message}
${val.stack}`;
  }
  return className;
}
function addToExternrefTable0(obj) {
  const idx = wasm.__externref_table_alloc();
  wasm.__wbindgen_externrefs.set(idx, obj);
  return idx;
}
function handleError(f, args) {
  try {
    return f.apply(this, args);
  } catch (e) {
    const idx = addToExternrefTable0(e);
    wasm.__wbindgen_exn_store(idx);
  }
}
function getArrayU8FromWasm0(ptr, len) {
  ptr = ptr >>> 0;
  return getUint8ArrayMemory0().subarray(ptr / 1, ptr / 1 + len);
}
function makeMutClosure(arg0, arg1, dtor, f) {
  const state = { a: arg0, b: arg1, cnt: 1, dtor };
  const real = /* @__PURE__ */ __name((...args) => {
    state.cnt++;
    const a = state.a;
    state.a = 0;
    try {
      return f(a, state.b, ...args);
    } finally {
      state.a = a;
      real._wbg_cb_unref();
    }
  }, "real");
  real._wbg_cb_unref = () => {
    if (--state.cnt === 0) {
      state.dtor(state.a, state.b);
      state.a = 0;
      CLOSURE_DTORS.unregister(state);
    }
  };
  CLOSURE_DTORS.register(real, state, state);
  return real;
}
function version() {
  let deferred1_0;
  let deferred1_1;
  try {
    const ret = wasm.version();
    deferred1_0 = ret[0];
    deferred1_1 = ret[1];
    return getStringFromWasm0(ret[0], ret[1]);
  } finally {
    wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
  }
}
function wasm_bindgen_353b96ef71864b03___convert__closures_____invoke___wasm_bindgen_353b96ef71864b03___JsValue_____(arg0, arg1, arg2) {
  wasm.wasm_bindgen_353b96ef71864b03___convert__closures_____invoke___wasm_bindgen_353b96ef71864b03___JsValue_____(arg0, arg1, arg2);
}
function wasm_bindgen_353b96ef71864b03___convert__closures_____invoke___wasm_bindgen_353b96ef71864b03___JsValue__wasm_bindgen_353b96ef71864b03___JsValue_____(arg0, arg1, arg2, arg3) {
  wasm.wasm_bindgen_353b96ef71864b03___convert__closures_____invoke___wasm_bindgen_353b96ef71864b03___JsValue__wasm_bindgen_353b96ef71864b03___JsValue_____(arg0, arg1, arg2, arg3);
}
function __wbg_Error_e83987f665cf5504(arg0, arg1) {
  const ret = Error(getStringFromWasm0(arg0, arg1));
  return ret;
}
function __wbg_Number_bb48ca12f395cd08(arg0) {
  const ret = Number(arg0);
  return ret;
}
function __wbg_String_8f0eb39a4a4c2f66(arg0, arg1) {
  const ret = String(arg1);
  const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
  const len1 = WASM_VECTOR_LEN;
  getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
  getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
}
function __wbg___wbindgen_bigint_get_as_i64_f3ebc5a755000afd(arg0, arg1) {
  const v = arg1;
  const ret = typeof v === "bigint" ? v : void 0;
  getDataViewMemory0().setBigInt64(arg0 + 8 * 1, isLikeNone(ret) ? BigInt(0) : ret, true);
  getDataViewMemory0().setInt32(arg0 + 4 * 0, !isLikeNone(ret), true);
}
function __wbg___wbindgen_boolean_get_6d5a1ee65bab5f68(arg0) {
  const v = arg0;
  const ret = typeof v === "boolean" ? v : void 0;
  return isLikeNone(ret) ? 16777215 : ret ? 1 : 0;
}
function __wbg___wbindgen_debug_string_df47ffb5e35e6763(arg0, arg1) {
  const ret = debugString(arg1);
  const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
  const len1 = WASM_VECTOR_LEN;
  getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
  getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
}
function __wbg___wbindgen_in_bb933bd9e1b3bc0f(arg0, arg1) {
  const ret = arg0 in arg1;
  return ret;
}
function __wbg___wbindgen_is_bigint_cb320707dcd35f0b(arg0) {
  const ret = typeof arg0 === "bigint";
  return ret;
}
function __wbg___wbindgen_is_function_ee8a6c5833c90377(arg0) {
  const ret = typeof arg0 === "function";
  return ret;
}
function __wbg___wbindgen_is_object_c818261d21f283a4(arg0) {
  const val = arg0;
  const ret = typeof val === "object" && val !== null;
  return ret;
}
function __wbg___wbindgen_is_string_fbb76cb2940daafd(arg0) {
  const ret = typeof arg0 === "string";
  return ret;
}
function __wbg___wbindgen_is_undefined_2d472862bd29a478(arg0) {
  const ret = arg0 === void 0;
  return ret;
}
function __wbg___wbindgen_jsval_eq_6b13ab83478b1c50(arg0, arg1) {
  const ret = arg0 === arg1;
  return ret;
}
function __wbg___wbindgen_jsval_loose_eq_b664b38a2f582147(arg0, arg1) {
  const ret = arg0 == arg1;
  return ret;
}
function __wbg___wbindgen_number_get_a20bf9b85341449d(arg0, arg1) {
  const obj = arg1;
  const ret = typeof obj === "number" ? obj : void 0;
  getDataViewMemory0().setFloat64(arg0 + 8 * 1, isLikeNone(ret) ? 0 : ret, true);
  getDataViewMemory0().setInt32(arg0 + 4 * 0, !isLikeNone(ret), true);
}
function __wbg___wbindgen_string_get_e4f06c90489ad01b(arg0, arg1) {
  const obj = arg1;
  const ret = typeof obj === "string" ? obj : void 0;
  var ptr1 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
  var len1 = WASM_VECTOR_LEN;
  getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
  getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
}
function __wbg___wbindgen_throw_b855445ff6a94295(arg0, arg1) {
  throw new Error(getStringFromWasm0(arg0, arg1));
}
function __wbg__wbg_cb_unref_2454a539ea5790d9(arg0) {
  arg0._wbg_cb_unref();
}
function __wbg_call_525440f72fbfc0ea() {
  return handleError(function(arg0, arg1, arg2) {
    const ret = arg0.call(arg1, arg2);
    return ret;
  }, arguments);
}
function __wbg_call_e762c39fa8ea36bf() {
  return handleError(function(arg0, arg1) {
    const ret = arg0.call(arg1);
    return ret;
  }, arguments);
}
function __wbg_crypto_805be4ce92f1e370(arg0) {
  const ret = arg0.crypto;
  return ret;
}
function __wbg_done_2042aa2670fb1db1(arg0) {
  const ret = arg0.done;
  return ret;
}
function __wbg_entries_e171b586f8f6bdbf(arg0) {
  const ret = Object.entries(arg0);
  return ret;
}
function __wbg_exec_fdeec61d47617356(arg0, arg1, arg2) {
  const ret = arg0.exec(getStringFromWasm0(arg1, arg2));
  return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
}
function __wbg_getRandomValues_f6a868620c8bab49() {
  return handleError(function(arg0, arg1) {
    arg0.getRandomValues(arg1);
  }, arguments);
}
function __wbg_getTime_14776bfb48a1bff9(arg0) {
  const ret = arg0.getTime();
  return ret;
}
function __wbg_get_7bed016f185add81(arg0, arg1) {
  const ret = arg0[arg1 >>> 0];
  return ret;
}
function __wbg_get_ece95cf6585650d9() {
  return handleError(function(arg0, arg1) {
    const ret = arg0[arg1];
    return ret;
  }, arguments);
}
function __wbg_get_efcb449f58ec27c2() {
  return handleError(function(arg0, arg1) {
    const ret = Reflect.get(arg0, arg1);
    return ret;
  }, arguments);
}
function __wbg_get_with_ref_key_1dc361bd10053bfe(arg0, arg1) {
  const ret = arg0[arg1];
  return ret;
}
function __wbg_has_787fafc980c3ccdb() {
  return handleError(function(arg0, arg1) {
    const ret = Reflect.has(arg0, arg1);
    return ret;
  }, arguments);
}
function __wbg_instanceof_ArrayBuffer_70beb1189ca63b38(arg0) {
  let result;
  try {
    result = arg0 instanceof ArrayBuffer;
  } catch (_) {
    result = false;
  }
  const ret = result;
  return ret;
}
function __wbg_instanceof_Map_8579b5e2ab5437c7(arg0) {
  let result;
  try {
    result = arg0 instanceof Map;
  } catch (_) {
    result = false;
  }
  const ret = result;
  return ret;
}
function __wbg_instanceof_Promise_001fdd42afa1b7ef(arg0) {
  let result;
  try {
    result = arg0 instanceof Promise;
  } catch (_) {
    result = false;
  }
  const ret = result;
  return ret;
}
function __wbg_instanceof_Uint8Array_20c8e73002f7af98(arg0) {
  let result;
  try {
    result = arg0 instanceof Uint8Array;
  } catch (_) {
    result = false;
  }
  const ret = result;
  return ret;
}
function __wbg_isArray_96e0af9891d0945d(arg0) {
  const ret = Array.isArray(arg0);
  return ret;
}
function __wbg_isSafeInteger_d216eda7911dde36(arg0) {
  const ret = Number.isSafeInteger(arg0);
  return ret;
}
function __wbg_iterator_e5822695327a3c39() {
  const ret = Symbol.iterator;
  return ret;
}
function __wbg_length_69bca3cb64fc8748(arg0) {
  const ret = arg0.length;
  return ret;
}
function __wbg_length_cdd215e10d9dd507(arg0) {
  const ret = arg0.length;
  return ret;
}
function __wbg_msCrypto_2ac4d17c4748234a(arg0) {
  const ret = arg0.msCrypto;
  return ret;
}
function __wbg_new_0_f9740686d739025c() {
  const ret = /* @__PURE__ */ new Date();
  return ret;
}
function __wbg_new_1acc0b6eea89d040() {
  const ret = new Object();
  return ret;
}
function __wbg_new_23fa8b12a239f036(arg0, arg1, arg2, arg3) {
  const ret = new RegExp(getStringFromWasm0(arg0, arg1), getStringFromWasm0(arg2, arg3));
  return ret;
}
function __wbg_new_3c3d849046688a66(arg0, arg1) {
  try {
    var state0 = { a: arg0, b: arg1 };
    var cb0 = /* @__PURE__ */ __name((arg02, arg12) => {
      const a = state0.a;
      state0.a = 0;
      try {
        return wasm_bindgen_353b96ef71864b03___convert__closures_____invoke___wasm_bindgen_353b96ef71864b03___JsValue__wasm_bindgen_353b96ef71864b03___JsValue_____(a, state0.b, arg02, arg12);
      } finally {
        state0.a = a;
      }
    }, "cb0");
    const ret = new Promise(cb0);
    return ret;
  } finally {
    state0.a = state0.b = 0;
  }
}
function __wbg_new_5a79be3ab53b8aa5(arg0) {
  const ret = new Uint8Array(arg0);
  return ret;
}
function __wbg_new_68651c719dcda04e() {
  const ret = /* @__PURE__ */ new Map();
  return ret;
}
function __wbg_new_a7442b4b19c1a356(arg0, arg1) {
  const ret = new Error(getStringFromWasm0(arg0, arg1));
  return ret;
}
function __wbg_new_e17d9f43105b08be() {
  const ret = new Array();
  return ret;
}
function __wbg_new_from_slice_92f4d78ca282a2d2(arg0, arg1) {
  const ret = new Uint8Array(getArrayU8FromWasm0(arg0, arg1));
  return ret;
}
function __wbg_new_no_args_ee98eee5275000a4(arg0, arg1) {
  const ret = new Function(getStringFromWasm0(arg0, arg1));
  return ret;
}
function __wbg_new_with_length_01aa0dc35aa13543(arg0) {
  const ret = new Uint8Array(arg0 >>> 0);
  return ret;
}
function __wbg_next_020810e0ae8ebcb0() {
  return handleError(function(arg0) {
    const ret = arg0.next();
    return ret;
  }, arguments);
}
function __wbg_next_2c826fe5dfec6b6a(arg0) {
  const ret = arg0.next;
  return ret;
}
function __wbg_node_ecc8306b9857f33d(arg0) {
  const ret = arg0.node;
  return ret;
}
function __wbg_now_793306c526e2e3b6() {
  const ret = Date.now();
  return ret;
}
function __wbg_now_7fd00a794a07d388(arg0) {
  const ret = arg0.now();
  return ret;
}
function __wbg_process_5cff2739921be718(arg0) {
  const ret = arg0.process;
  return ret;
}
function __wbg_prototypesetcall_2a6620b6922694b2(arg0, arg1, arg2) {
  Uint8Array.prototype.set.call(getArrayU8FromWasm0(arg0, arg1), arg2);
}
function __wbg_push_df81a39d04db858c(arg0, arg1) {
  const ret = arg0.push(arg1);
  return ret;
}
function __wbg_queueMicrotask_5a8a9131f3f0b37b(arg0) {
  const ret = arg0.queueMicrotask;
  return ret;
}
function __wbg_queueMicrotask_6d79674585219521(arg0) {
  queueMicrotask(arg0);
}
function __wbg_randomFillSync_d3c85af7e31cf1f8() {
  return handleError(function(arg0, arg1) {
    arg0.randomFillSync(arg1);
  }, arguments);
}
function __wbg_require_0c566c6f2eef6c79() {
  return handleError(function() {
    const ret = module.require;
    return ret;
  }, arguments);
}
function __wbg_resolve_caf97c30b83f7053(arg0) {
  const ret = Promise.resolve(arg0);
  return ret;
}
function __wbg_schemaengine_new(arg0) {
  const ret = SchemaEngine.__wrap(arg0);
  return ret;
}
function __wbg_setTimeout_5d6a1d4fc51ea450(arg0, arg1) {
  const ret = setTimeout(arg0, arg1 >>> 0);
  return ret;
}
function __wbg_set_3f1d0b984ed272ed(arg0, arg1, arg2) {
  arg0[arg1] = arg2;
}
function __wbg_set_907fb406c34a251d(arg0, arg1, arg2) {
  const ret = arg0.set(arg1, arg2);
  return ret;
}
function __wbg_set_c213c871859d6500(arg0, arg1, arg2) {
  arg0[arg1 >>> 0] = arg2;
}
function __wbg_set_c2abbebe8b9ebee1() {
  return handleError(function(arg0, arg1, arg2) {
    const ret = Reflect.set(arg0, arg1, arg2);
    return ret;
  }, arguments);
}
function __wbg_set_message_f18c00fbf3b3e80e(arg0, arg1) {
  globalThis.PRISMA_WASM_PANIC_REGISTRY.set_message(getStringFromWasm0(arg0, arg1));
}
function __wbg_set_name_d94846a29e626702(arg0, arg1, arg2) {
  arg0.name = getStringFromWasm0(arg1, arg2);
}
function __wbg_static_accessor_GLOBAL_89e1d9ac6a1b250e() {
  const ret = typeof globalThis === "undefined" ? null : globalThis;
  return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
}
function __wbg_static_accessor_GLOBAL_THIS_8b530f326a9e48ac() {
  const ret = typeof globalThis === "undefined" ? null : globalThis;
  return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
}
function __wbg_static_accessor_SELF_6fdf4b64710cc91b() {
  const ret = typeof self === "undefined" ? null : self;
  return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
}
function __wbg_static_accessor_WINDOW_b45bfc5a37f6cfa2() {
  const ret = typeof window === "undefined" ? null : window;
  return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
}
function __wbg_subarray_480600f3d6a9f26c(arg0, arg1, arg2) {
  const ret = arg0.subarray(arg1 >>> 0, arg2 >>> 0);
  return ret;
}
function __wbg_then_4f46f6544e6b4a28(arg0, arg1) {
  const ret = arg0.then(arg1);
  return ret;
}
function __wbg_then_70d05cf780a18d77(arg0, arg1, arg2) {
  const ret = arg0.then(arg1, arg2);
  return ret;
}
function __wbg_valueOf_9eee4828c11458ca(arg0) {
  const ret = arg0.valueOf();
  return ret;
}
function __wbg_value_692627309814bb8c(arg0) {
  const ret = arg0.value;
  return ret;
}
function __wbg_versions_a8e5a362e1f16442(arg0) {
  const ret = arg0.versions;
  return ret;
}
function __wbindgen_cast_2241b6af4c4b2941(arg0, arg1) {
  const ret = getStringFromWasm0(arg0, arg1);
  return ret;
}
function __wbindgen_cast_4625c577ab2ec9ee(arg0) {
  const ret = BigInt.asUintN(64, arg0);
  return ret;
}
function __wbindgen_cast_9ae0607507abb057(arg0) {
  const ret = arg0;
  return ret;
}
function __wbindgen_cast_a9993887db3ced61(arg0, arg1) {
  const ret = makeMutClosure(arg0, arg1, wasm.wasm_bindgen_353b96ef71864b03___closure__destroy___dyn_core_9b3796e30d99ddb7___ops__function__FnMut__wasm_bindgen_353b96ef71864b03___JsValue____Output_______, wasm_bindgen_353b96ef71864b03___convert__closures_____invoke___wasm_bindgen_353b96ef71864b03___JsValue_____);
  return ret;
}
function __wbindgen_cast_cb9088102bce6b30(arg0, arg1) {
  const ret = getArrayU8FromWasm0(arg0, arg1);
  return ret;
}
function __wbindgen_cast_d6cd19b81560fd6e(arg0) {
  const ret = arg0;
  return ret;
}
function __wbindgen_init_externref_table() {
  const table = wasm.__wbindgen_externrefs;
  const offset = table.grow(4);
  table.set(0, void 0);
  table.set(offset + 0, void 0);
  table.set(offset + 1, null);
  table.set(offset + 2, true);
  table.set(offset + 3, false);
  ;
}
var wasm, cachedUint8ArrayMemory0, cachedTextDecoder, MAX_SAFARI_DECODE_BYTES, numBytesDecoded, WASM_VECTOR_LEN, cachedTextEncoder, cachedDataViewMemory0, CLOSURE_DTORS, SchemaEngineFinalization, SchemaEngine;
var init_schema_engine_bg = __esm({
  "scripts/node-lab/node_modules/@prisma/schema-engine-wasm/schema_engine_bg.js"() {
    init_globals();
    __name(__wbg_set_wasm, "__wbg_set_wasm");
    cachedUint8ArrayMemory0 = null;
    __name(getUint8ArrayMemory0, "getUint8ArrayMemory0");
    cachedTextDecoder = new TextDecoder("utf-8", { ignoreBOM: true, fatal: true });
    cachedTextDecoder.decode();
    MAX_SAFARI_DECODE_BYTES = 2146435072;
    numBytesDecoded = 0;
    __name(decodeText, "decodeText");
    __name(getStringFromWasm0, "getStringFromWasm0");
    WASM_VECTOR_LEN = 0;
    cachedTextEncoder = new TextEncoder();
    if (!("encodeInto" in cachedTextEncoder)) {
      cachedTextEncoder.encodeInto = function(arg, view) {
        const buf = cachedTextEncoder.encode(arg);
        view.set(buf);
        return {
          read: arg.length,
          written: buf.length
        };
      };
    }
    __name(passStringToWasm0, "passStringToWasm0");
    cachedDataViewMemory0 = null;
    __name(getDataViewMemory0, "getDataViewMemory0");
    __name(isLikeNone, "isLikeNone");
    __name(debugString, "debugString");
    __name(addToExternrefTable0, "addToExternrefTable0");
    __name(handleError, "handleError");
    __name(getArrayU8FromWasm0, "getArrayU8FromWasm0");
    CLOSURE_DTORS = typeof FinalizationRegistry === "undefined" ? { register: /* @__PURE__ */ __name(() => {
    }, "register"), unregister: /* @__PURE__ */ __name(() => {
    }, "unregister") } : new FinalizationRegistry((state) => state.dtor(state.a, state.b));
    __name(makeMutClosure, "makeMutClosure");
    __name(version, "version");
    __name(wasm_bindgen_353b96ef71864b03___convert__closures_____invoke___wasm_bindgen_353b96ef71864b03___JsValue_____, "wasm_bindgen_353b96ef71864b03___convert__closures_____invoke___wasm_bindgen_353b96ef71864b03___JsValue_____");
    __name(wasm_bindgen_353b96ef71864b03___convert__closures_____invoke___wasm_bindgen_353b96ef71864b03___JsValue__wasm_bindgen_353b96ef71864b03___JsValue_____, "wasm_bindgen_353b96ef71864b03___convert__closures_____invoke___wasm_bindgen_353b96ef71864b03___JsValue__wasm_bindgen_353b96ef71864b03___JsValue_____");
    SchemaEngineFinalization = typeof FinalizationRegistry === "undefined" ? { register: /* @__PURE__ */ __name(() => {
    }, "register"), unregister: /* @__PURE__ */ __name(() => {
    }, "unregister") } : new FinalizationRegistry((ptr) => wasm.__wbg_schemaengine_free(ptr >>> 0, 1));
    SchemaEngine = class _SchemaEngine {
      static {
        __name(this, "SchemaEngine");
      }
      static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(_SchemaEngine.prototype);
        obj.__wbg_ptr = ptr;
        SchemaEngineFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
      }
      __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        SchemaEngineFinalization.unregister(this);
        return ptr;
      }
      free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_schemaengine_free(ptr, 0);
      }
      /**
       * Send a raw command to the database.
       * @param {DbExecuteParams} params
       * @returns {Promise<void>}
       */
      dbExecute(params) {
        const ret = wasm.schemaengine_dbExecute(this.__wbg_ptr, params);
        return ret;
      }
      /**
       * Introspect the database schema.
       * @param {IntrospectParams} params
       * @returns {Promise<IntrospectResult>}
       */
      introspect(params) {
        const ret = wasm.schemaengine_introspect(this.__wbg_ptr, params);
        return ret;
      }
      /**
       * The command behind `prisma db push`.
       * @param {SchemaPushInput} input
       * @returns {Promise<SchemaPushOutput>}
       */
      schemaPush(input) {
        const ret = wasm.schemaengine_schemaPush(this.__wbg_ptr, input);
        return ret;
      }
      /**
       * Tells the CLI what to do in `migrate dev`.
       * @param {DevDiagnosticInput} input
       * @returns {Promise<DevDiagnosticOutput>}
       */
      devDiagnostic(input) {
        const ret = wasm.schemaengine_devDiagnostic(this.__wbg_ptr, input);
        return ret;
      }
      /**
       * Introspects a SQL query and returns types information.
       * Note: this will fail on SQLite, as it requires Wasm-compatible sqlx implementation.
       * @param {IntrospectSqlParams} params
       * @returns {Promise<IntrospectSqlResult>}
       */
      introspectSql(params) {
        const ret = wasm.schemaengine_introspectSql(this.__wbg_ptr, params);
        return ret;
      }
      /**
       * Apply all the unapplied migrations from the migrations folder.
       * @param {ApplyMigrationsInput} input
       * @returns {Promise<ApplyMigrationsOutput>}
       */
      applyMigrations(input) {
        const ret = wasm.schemaengine_applyMigrations(this.__wbg_ptr, input);
        return ret;
      }
      /**
       * Generate a new migration, based on the provided schema and existing migrations history.
       * @param {CreateMigrationInput} input
       * @returns {Promise<CreateMigrationOutput>}
       */
      createMigration(input) {
        const ret = wasm.schemaengine_createMigration(this.__wbg_ptr, input);
        return ret;
      }
      /**
       * Evaluate the consequences of running the next migration we would generate, given the current state of a Prisma schema.
       * @param {EvaluateDataLossInput} input
       * @returns {Promise<EvaluateDataLossOutput>}
       */
      evaluateDataLoss(input) {
        const ret = wasm.schemaengine_evaluateDataLoss(this.__wbg_ptr, input);
        return ret;
      }
      /**
       * Mark a migration from the migrations folder as applied, without actually applying it.
       * @param {MarkMigrationAppliedInput} input
       * @returns {Promise<MarkMigrationAppliedOutput>}
       */
      markMigrationApplied(input) {
        const ret = wasm.schemaengine_markMigrationApplied(this.__wbg_ptr, input);
        return ret;
      }
      /**
       * Looks at the migrations folder and the database, and returns a bunch of useful information.
       * @param {DiagnoseMigrationHistoryInput} input
       * @returns {Promise<DiagnoseMigrationHistoryOutput>}
       */
      diagnoseMigrationHistory(input) {
        const ret = wasm.schemaengine_diagnoseMigrationHistory(this.__wbg_ptr, input);
        return ret;
      }
      /**
       * Make sure the connection to the database is established and valid.
       * Connectors can choose to connect lazily, but this method should force
       * them to connect.
       * @param {EnsureConnectionValidityParams} _params
       * @returns {Promise<EnsureConnectionValidityResult>}
       */
      ensureConnectionValidity(_params) {
        const ret = wasm.schemaengine_ensureConnectionValidity(this.__wbg_ptr, _params);
        return ret;
      }
      /**
       * Mark a migration as rolled back.
       * @param {MarkMigrationRolledBackInput} input
       * @returns {Promise<MarkMigrationRolledBackOutput>}
       */
      markMigrationRolledBack(input) {
        const ret = wasm.schemaengine_markMigrationRolledBack(this.__wbg_ptr, input);
        return ret;
      }
      /**
       * @param {ConstructorOptions} options
       * @param {Function} callback
       * @param {object} adapter
       * @returns {Promise<SchemaEngine>}
       */
      static new(options, callback, adapter) {
        const ret = wasm.schemaengine_new(options, callback, adapter);
        return ret;
      }
      /**
       * Create a migration between any two sources of database schemas.
       * @param {DiffParams} params
       * @returns {Promise<DiffResult>}
       */
      diff(params) {
        const ret = wasm.schemaengine_diff(this.__wbg_ptr, params);
        return ret;
      }
      /**
       * Reset a database to an empty state (no data, no schema).
       * @param {ResetInput} input
       * @returns {Promise<void>}
       */
      reset(input) {
        const ret = wasm.schemaengine_reset(this.__wbg_ptr, input);
        return ret;
      }
      /**
       * Return the database version as a string.
       * @param {GetDatabaseVersionInput | null} [_params]
       * @returns {Promise<string>}
       */
      version(_params) {
        const ret = wasm.schemaengine_version(this.__wbg_ptr, isLikeNone(_params) ? 0 : addToExternrefTable0(_params));
        return ret;
      }
      /**
       * Debugging method that only panics, for tests.
       */
      debugPanic() {
        wasm.schemaengine_debugPanic(this.__wbg_ptr);
      }
    };
    if (Symbol.dispose) SchemaEngine.prototype[Symbol.dispose] = SchemaEngine.prototype.free;
    __name(__wbg_Error_e83987f665cf5504, "__wbg_Error_e83987f665cf5504");
    __name(__wbg_Number_bb48ca12f395cd08, "__wbg_Number_bb48ca12f395cd08");
    __name(__wbg_String_8f0eb39a4a4c2f66, "__wbg_String_8f0eb39a4a4c2f66");
    __name(__wbg___wbindgen_bigint_get_as_i64_f3ebc5a755000afd, "__wbg___wbindgen_bigint_get_as_i64_f3ebc5a755000afd");
    __name(__wbg___wbindgen_boolean_get_6d5a1ee65bab5f68, "__wbg___wbindgen_boolean_get_6d5a1ee65bab5f68");
    __name(__wbg___wbindgen_debug_string_df47ffb5e35e6763, "__wbg___wbindgen_debug_string_df47ffb5e35e6763");
    __name(__wbg___wbindgen_in_bb933bd9e1b3bc0f, "__wbg___wbindgen_in_bb933bd9e1b3bc0f");
    __name(__wbg___wbindgen_is_bigint_cb320707dcd35f0b, "__wbg___wbindgen_is_bigint_cb320707dcd35f0b");
    __name(__wbg___wbindgen_is_function_ee8a6c5833c90377, "__wbg___wbindgen_is_function_ee8a6c5833c90377");
    __name(__wbg___wbindgen_is_object_c818261d21f283a4, "__wbg___wbindgen_is_object_c818261d21f283a4");
    __name(__wbg___wbindgen_is_string_fbb76cb2940daafd, "__wbg___wbindgen_is_string_fbb76cb2940daafd");
    __name(__wbg___wbindgen_is_undefined_2d472862bd29a478, "__wbg___wbindgen_is_undefined_2d472862bd29a478");
    __name(__wbg___wbindgen_jsval_eq_6b13ab83478b1c50, "__wbg___wbindgen_jsval_eq_6b13ab83478b1c50");
    __name(__wbg___wbindgen_jsval_loose_eq_b664b38a2f582147, "__wbg___wbindgen_jsval_loose_eq_b664b38a2f582147");
    __name(__wbg___wbindgen_number_get_a20bf9b85341449d, "__wbg___wbindgen_number_get_a20bf9b85341449d");
    __name(__wbg___wbindgen_string_get_e4f06c90489ad01b, "__wbg___wbindgen_string_get_e4f06c90489ad01b");
    __name(__wbg___wbindgen_throw_b855445ff6a94295, "__wbg___wbindgen_throw_b855445ff6a94295");
    __name(__wbg__wbg_cb_unref_2454a539ea5790d9, "__wbg__wbg_cb_unref_2454a539ea5790d9");
    __name(__wbg_call_525440f72fbfc0ea, "__wbg_call_525440f72fbfc0ea");
    __name(__wbg_call_e762c39fa8ea36bf, "__wbg_call_e762c39fa8ea36bf");
    __name(__wbg_crypto_805be4ce92f1e370, "__wbg_crypto_805be4ce92f1e370");
    __name(__wbg_done_2042aa2670fb1db1, "__wbg_done_2042aa2670fb1db1");
    __name(__wbg_entries_e171b586f8f6bdbf, "__wbg_entries_e171b586f8f6bdbf");
    __name(__wbg_exec_fdeec61d47617356, "__wbg_exec_fdeec61d47617356");
    __name(__wbg_getRandomValues_f6a868620c8bab49, "__wbg_getRandomValues_f6a868620c8bab49");
    __name(__wbg_getTime_14776bfb48a1bff9, "__wbg_getTime_14776bfb48a1bff9");
    __name(__wbg_get_7bed016f185add81, "__wbg_get_7bed016f185add81");
    __name(__wbg_get_ece95cf6585650d9, "__wbg_get_ece95cf6585650d9");
    __name(__wbg_get_efcb449f58ec27c2, "__wbg_get_efcb449f58ec27c2");
    __name(__wbg_get_with_ref_key_1dc361bd10053bfe, "__wbg_get_with_ref_key_1dc361bd10053bfe");
    __name(__wbg_has_787fafc980c3ccdb, "__wbg_has_787fafc980c3ccdb");
    __name(__wbg_instanceof_ArrayBuffer_70beb1189ca63b38, "__wbg_instanceof_ArrayBuffer_70beb1189ca63b38");
    __name(__wbg_instanceof_Map_8579b5e2ab5437c7, "__wbg_instanceof_Map_8579b5e2ab5437c7");
    __name(__wbg_instanceof_Promise_001fdd42afa1b7ef, "__wbg_instanceof_Promise_001fdd42afa1b7ef");
    __name(__wbg_instanceof_Uint8Array_20c8e73002f7af98, "__wbg_instanceof_Uint8Array_20c8e73002f7af98");
    __name(__wbg_isArray_96e0af9891d0945d, "__wbg_isArray_96e0af9891d0945d");
    __name(__wbg_isSafeInteger_d216eda7911dde36, "__wbg_isSafeInteger_d216eda7911dde36");
    __name(__wbg_iterator_e5822695327a3c39, "__wbg_iterator_e5822695327a3c39");
    __name(__wbg_length_69bca3cb64fc8748, "__wbg_length_69bca3cb64fc8748");
    __name(__wbg_length_cdd215e10d9dd507, "__wbg_length_cdd215e10d9dd507");
    __name(__wbg_msCrypto_2ac4d17c4748234a, "__wbg_msCrypto_2ac4d17c4748234a");
    __name(__wbg_new_0_f9740686d739025c, "__wbg_new_0_f9740686d739025c");
    __name(__wbg_new_1acc0b6eea89d040, "__wbg_new_1acc0b6eea89d040");
    __name(__wbg_new_23fa8b12a239f036, "__wbg_new_23fa8b12a239f036");
    __name(__wbg_new_3c3d849046688a66, "__wbg_new_3c3d849046688a66");
    __name(__wbg_new_5a79be3ab53b8aa5, "__wbg_new_5a79be3ab53b8aa5");
    __name(__wbg_new_68651c719dcda04e, "__wbg_new_68651c719dcda04e");
    __name(__wbg_new_a7442b4b19c1a356, "__wbg_new_a7442b4b19c1a356");
    __name(__wbg_new_e17d9f43105b08be, "__wbg_new_e17d9f43105b08be");
    __name(__wbg_new_from_slice_92f4d78ca282a2d2, "__wbg_new_from_slice_92f4d78ca282a2d2");
    __name(__wbg_new_no_args_ee98eee5275000a4, "__wbg_new_no_args_ee98eee5275000a4");
    __name(__wbg_new_with_length_01aa0dc35aa13543, "__wbg_new_with_length_01aa0dc35aa13543");
    __name(__wbg_next_020810e0ae8ebcb0, "__wbg_next_020810e0ae8ebcb0");
    __name(__wbg_next_2c826fe5dfec6b6a, "__wbg_next_2c826fe5dfec6b6a");
    __name(__wbg_node_ecc8306b9857f33d, "__wbg_node_ecc8306b9857f33d");
    __name(__wbg_now_793306c526e2e3b6, "__wbg_now_793306c526e2e3b6");
    __name(__wbg_now_7fd00a794a07d388, "__wbg_now_7fd00a794a07d388");
    __name(__wbg_process_5cff2739921be718, "__wbg_process_5cff2739921be718");
    __name(__wbg_prototypesetcall_2a6620b6922694b2, "__wbg_prototypesetcall_2a6620b6922694b2");
    __name(__wbg_push_df81a39d04db858c, "__wbg_push_df81a39d04db858c");
    __name(__wbg_queueMicrotask_5a8a9131f3f0b37b, "__wbg_queueMicrotask_5a8a9131f3f0b37b");
    __name(__wbg_queueMicrotask_6d79674585219521, "__wbg_queueMicrotask_6d79674585219521");
    __name(__wbg_randomFillSync_d3c85af7e31cf1f8, "__wbg_randomFillSync_d3c85af7e31cf1f8");
    __name(__wbg_require_0c566c6f2eef6c79, "__wbg_require_0c566c6f2eef6c79");
    __name(__wbg_resolve_caf97c30b83f7053, "__wbg_resolve_caf97c30b83f7053");
    __name(__wbg_schemaengine_new, "__wbg_schemaengine_new");
    __name(__wbg_setTimeout_5d6a1d4fc51ea450, "__wbg_setTimeout_5d6a1d4fc51ea450");
    __name(__wbg_set_3f1d0b984ed272ed, "__wbg_set_3f1d0b984ed272ed");
    __name(__wbg_set_907fb406c34a251d, "__wbg_set_907fb406c34a251d");
    __name(__wbg_set_c213c871859d6500, "__wbg_set_c213c871859d6500");
    __name(__wbg_set_c2abbebe8b9ebee1, "__wbg_set_c2abbebe8b9ebee1");
    __name(__wbg_set_message_f18c00fbf3b3e80e, "__wbg_set_message_f18c00fbf3b3e80e");
    __name(__wbg_set_name_d94846a29e626702, "__wbg_set_name_d94846a29e626702");
    __name(__wbg_static_accessor_GLOBAL_89e1d9ac6a1b250e, "__wbg_static_accessor_GLOBAL_89e1d9ac6a1b250e");
    __name(__wbg_static_accessor_GLOBAL_THIS_8b530f326a9e48ac, "__wbg_static_accessor_GLOBAL_THIS_8b530f326a9e48ac");
    __name(__wbg_static_accessor_SELF_6fdf4b64710cc91b, "__wbg_static_accessor_SELF_6fdf4b64710cc91b");
    __name(__wbg_static_accessor_WINDOW_b45bfc5a37f6cfa2, "__wbg_static_accessor_WINDOW_b45bfc5a37f6cfa2");
    __name(__wbg_subarray_480600f3d6a9f26c, "__wbg_subarray_480600f3d6a9f26c");
    __name(__wbg_then_4f46f6544e6b4a28, "__wbg_then_4f46f6544e6b4a28");
    __name(__wbg_then_70d05cf780a18d77, "__wbg_then_70d05cf780a18d77");
    __name(__wbg_valueOf_9eee4828c11458ca, "__wbg_valueOf_9eee4828c11458ca");
    __name(__wbg_value_692627309814bb8c, "__wbg_value_692627309814bb8c");
    __name(__wbg_versions_a8e5a362e1f16442, "__wbg_versions_a8e5a362e1f16442");
    __name(__wbindgen_cast_2241b6af4c4b2941, "__wbindgen_cast_2241b6af4c4b2941");
    __name(__wbindgen_cast_4625c577ab2ec9ee, "__wbindgen_cast_4625c577ab2ec9ee");
    __name(__wbindgen_cast_9ae0607507abb057, "__wbindgen_cast_9ae0607507abb057");
    __name(__wbindgen_cast_a9993887db3ced61, "__wbindgen_cast_a9993887db3ced61");
    __name(__wbindgen_cast_cb9088102bce6b30, "__wbindgen_cast_cb9088102bce6b30");
    __name(__wbindgen_cast_d6cd19b81560fd6e, "__wbindgen_cast_d6cd19b81560fd6e");
    __name(__wbindgen_init_externref_table, "__wbindgen_init_externref_table");
  }
});
init_schema_engine_bg();
export {
  SchemaEngine,
  __wbg_Error_e83987f665cf5504,
  __wbg_Number_bb48ca12f395cd08,
  __wbg_String_8f0eb39a4a4c2f66,
  __wbg___wbindgen_bigint_get_as_i64_f3ebc5a755000afd,
  __wbg___wbindgen_boolean_get_6d5a1ee65bab5f68,
  __wbg___wbindgen_debug_string_df47ffb5e35e6763,
  __wbg___wbindgen_in_bb933bd9e1b3bc0f,
  __wbg___wbindgen_is_bigint_cb320707dcd35f0b,
  __wbg___wbindgen_is_function_ee8a6c5833c90377,
  __wbg___wbindgen_is_object_c818261d21f283a4,
  __wbg___wbindgen_is_string_fbb76cb2940daafd,
  __wbg___wbindgen_is_undefined_2d472862bd29a478,
  __wbg___wbindgen_jsval_eq_6b13ab83478b1c50,
  __wbg___wbindgen_jsval_loose_eq_b664b38a2f582147,
  __wbg___wbindgen_number_get_a20bf9b85341449d,
  __wbg___wbindgen_string_get_e4f06c90489ad01b,
  __wbg___wbindgen_throw_b855445ff6a94295,
  __wbg__wbg_cb_unref_2454a539ea5790d9,
  __wbg_call_525440f72fbfc0ea,
  __wbg_call_e762c39fa8ea36bf,
  __wbg_crypto_805be4ce92f1e370,
  __wbg_done_2042aa2670fb1db1,
  __wbg_entries_e171b586f8f6bdbf,
  __wbg_exec_fdeec61d47617356,
  __wbg_getRandomValues_f6a868620c8bab49,
  __wbg_getTime_14776bfb48a1bff9,
  __wbg_get_7bed016f185add81,
  __wbg_get_ece95cf6585650d9,
  __wbg_get_efcb449f58ec27c2,
  __wbg_get_with_ref_key_1dc361bd10053bfe,
  __wbg_has_787fafc980c3ccdb,
  __wbg_instanceof_ArrayBuffer_70beb1189ca63b38,
  __wbg_instanceof_Map_8579b5e2ab5437c7,
  __wbg_instanceof_Promise_001fdd42afa1b7ef,
  __wbg_instanceof_Uint8Array_20c8e73002f7af98,
  __wbg_isArray_96e0af9891d0945d,
  __wbg_isSafeInteger_d216eda7911dde36,
  __wbg_iterator_e5822695327a3c39,
  __wbg_length_69bca3cb64fc8748,
  __wbg_length_cdd215e10d9dd507,
  __wbg_msCrypto_2ac4d17c4748234a,
  __wbg_new_0_f9740686d739025c,
  __wbg_new_1acc0b6eea89d040,
  __wbg_new_23fa8b12a239f036,
  __wbg_new_3c3d849046688a66,
  __wbg_new_5a79be3ab53b8aa5,
  __wbg_new_68651c719dcda04e,
  __wbg_new_a7442b4b19c1a356,
  __wbg_new_e17d9f43105b08be,
  __wbg_new_from_slice_92f4d78ca282a2d2,
  __wbg_new_no_args_ee98eee5275000a4,
  __wbg_new_with_length_01aa0dc35aa13543,
  __wbg_next_020810e0ae8ebcb0,
  __wbg_next_2c826fe5dfec6b6a,
  __wbg_node_ecc8306b9857f33d,
  __wbg_now_793306c526e2e3b6,
  __wbg_now_7fd00a794a07d388,
  __wbg_process_5cff2739921be718,
  __wbg_prototypesetcall_2a6620b6922694b2,
  __wbg_push_df81a39d04db858c,
  __wbg_queueMicrotask_5a8a9131f3f0b37b,
  __wbg_queueMicrotask_6d79674585219521,
  __wbg_randomFillSync_d3c85af7e31cf1f8,
  __wbg_require_0c566c6f2eef6c79,
  __wbg_resolve_caf97c30b83f7053,
  __wbg_schemaengine_new,
  __wbg_setTimeout_5d6a1d4fc51ea450,
  __wbg_set_3f1d0b984ed272ed,
  __wbg_set_907fb406c34a251d,
  __wbg_set_c213c871859d6500,
  __wbg_set_c2abbebe8b9ebee1,
  __wbg_set_message_f18c00fbf3b3e80e,
  __wbg_set_name_d94846a29e626702,
  __wbg_set_wasm,
  __wbg_static_accessor_GLOBAL_89e1d9ac6a1b250e,
  __wbg_static_accessor_GLOBAL_THIS_8b530f326a9e48ac,
  __wbg_static_accessor_SELF_6fdf4b64710cc91b,
  __wbg_static_accessor_WINDOW_b45bfc5a37f6cfa2,
  __wbg_subarray_480600f3d6a9f26c,
  __wbg_then_4f46f6544e6b4a28,
  __wbg_then_70d05cf780a18d77,
  __wbg_valueOf_9eee4828c11458ca,
  __wbg_value_692627309814bb8c,
  __wbg_versions_a8e5a362e1f16442,
  __wbindgen_cast_2241b6af4c4b2941,
  __wbindgen_cast_4625c577ab2ec9ee,
  __wbindgen_cast_9ae0607507abb057,
  __wbindgen_cast_a9993887db3ced61,
  __wbindgen_cast_cb9088102bce6b30,
  __wbindgen_cast_d6cd19b81560fd6e,
  __wbindgen_init_externref_table,
  version
};
