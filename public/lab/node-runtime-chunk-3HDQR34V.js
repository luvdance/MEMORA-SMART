import {
  __esm,
  __name,
  init_globals
} from "./node-runtime-chunk-WY7WQXFC.js";

// scripts/node-lab/node_modules/deepmerge-ts/dist/index.mjs
function emptyLike(value) {
  if (Array.isArray(value)) {
    return [];
  }
  if (value instanceof Set) {
    return /* @__PURE__ */ new Set();
  }
  if (value instanceof Map) {
    return /* @__PURE__ */ new Map();
  }
  if (typeof value === "object" && value !== null) {
    return {};
  }
  return value;
}
function defaultMetaDataUpdater(previousMeta, mergeInfo) {
  const ancestor = {
    key: mergeInfo.key,
    parents: mergeInfo.parents,
    values: mergeInfo.values,
    result: mergeInfo.result
  };
  const prevHierarchy = previousMeta?.hierarchy;
  return {
    ...ancestor,
    hierarchy: prevHierarchy === void 0 ? [ancestor] : [...prevHierarchy, ancestor]
  };
}
function defaultMetaDataUpdaterFast(previousMeta, mergeInfo) {
  return void 0;
}
function defaultFilterValues(values, meta) {
  return values.includes(void 0) ? values.filter((value) => value !== void 0) : values;
}
function shouldFallbackToDefault(utils, fallback, result) {
  return result === actions.defaultMerge || utils.useImplicitDefaultMerging && result === void 0 && utils.mergeFunctions[fallback] !== utils.defaultMergeFunctions[fallback];
}
function resolveCustomMergeFunctions(options, defaultMergeFunctions) {
  return {
    ...defaultMergeFunctions,
    ...Object.fromEntries(Object.entries(options).filter(([key]) => Object.hasOwn(defaultMergeFunctions, key)).map(([key, option]) => option === false ? [key, defaultMergeFunctions.mergeOthers] : typeof option === "function" ? [key, option] : [key, defaultMergeFunctions[key]]))
  };
}
function mergeArrays$1(values, utils, meta) {
  return values.flat();
}
function mergeSets$1(values, utils, meta) {
  const result = /* @__PURE__ */ new Set();
  for (const set of values) {
    for (const element of set) {
      result.add(element);
    }
  }
  return result;
}
function mergeOthers$1(values, utils, meta) {
  return values.at(-1);
}
function mergeArraysInto$1(mut_target, values) {
  const result = [];
  for (const value of values) {
    const arr = value;
    for (const element of arr) {
      result.push(element);
    }
  }
  const target = mut_target.value;
  target.splice(0, target.length, ...result);
}
function mergeSetsInto$1(mut_target, values) {
  const result = /* @__PURE__ */ new Set();
  for (const value_ of values) {
    for (const value of value_) {
      result.add(value);
    }
  }
  const target = mut_target.value;
  target.clear();
  for (const value of result) {
    target.add(value);
  }
}
function mergeOthersInto$1(mut_target, values) {
  mut_target.value = values.at(-1);
}
function getObjectType(object) {
  if (typeof object !== "object" || object === null) {
    return ObjectType.NOT;
  }
  if (Array.isArray(object)) {
    return ObjectType.ARRAY;
  }
  if (isRecord(object)) {
    return ObjectType.RECORD;
  }
  if (object instanceof Set) {
    return ObjectType.SET;
  }
  if (object instanceof Map) {
    return ObjectType.MAP;
  }
  return ObjectType.OTHER;
}
function getKeysOfObjects(objects) {
  const keys = /* @__PURE__ */ new Set();
  for (const currentObject of objects) {
    const stringKeys = Object.keys(currentObject);
    for (const stringKey of stringKeys) {
      keys.add(stringKey);
    }
    const symbols = Object.getOwnPropertySymbols(currentObject);
    if (symbols.length > 0) {
      for (const symbol of symbols) {
        if (Object.prototype.propertyIsEnumerable.call(currentObject, symbol)) {
          keys.add(symbol);
        }
      }
    }
  }
  return keys;
}
function getKeysOfObject(object) {
  const symbols = Object.getOwnPropertySymbols(object).filter((symbol) => Object.prototype.propertyIsEnumerable.call(object, symbol));
  return [...Object.keys(object), ...symbols];
}
function objectHasProperty(object, property) {
  return typeof object === "object" && Object.prototype.propertyIsEnumerable.call(object, property);
}
function isRecord(value) {
  const prototype = Object.getPrototypeOf(value);
  if (prototype === null || prototype === Object.prototype) {
    return true;
  }
  const objectToString = Object.prototype.toString.call(value);
  if (objectToString !== "[object Object]" && objectToString !== "[object Module]") {
    return false;
  }
  const { constructor } = value;
  if (constructor === void 0) {
    return true;
  }
  const constructorPrototype = constructor.prototype;
  if (constructorPrototype === null || typeof constructorPrototype !== "object") {
    return false;
  }
  const constructorToString = Object.prototype.toString.call(constructorPrototype);
  if (constructorToString !== "[object Object]" && constructorToString !== "[object Module]") {
    return false;
  }
  if (!Object.hasOwn(constructorPrototype, "isPrototypeOf")) {
    return false;
  }
  return true;
}
function getCyclicReferenceDepth(object, hierarchy, index) {
  if (hierarchy === void 0 || hierarchy.length === 0) {
    return 0;
  }
  let mut_depth = 1;
  for (let mut_index = hierarchy.length - 1; mut_index >= 0; mut_index--) {
    const { parents } = hierarchy[mut_index];
    if (parents[index] === object || parents.includes(object)) {
      return mut_depth;
    }
    mut_depth += 1;
  }
  return 0;
}
function getMetaDataHierarchy(meta) {
  return meta?.hierarchy;
}
function mergeRecords$1(values, utils, meta) {
  if (values.length === 2) {
    const result = {};
    const mergeProperty = /* @__PURE__ */ __name((key, propValues) => {
      const updatedMeta = utils.metaDataUpdater(meta, {
        key,
        parents: values,
        values: propValues,
        result
      });
      const propertyResult = mergeUnknowns(propValues, utils, updatedMeta);
      if (propertyResult === actions.skip) {
        return;
      }
      if (key === "__proto__") {
        Object.defineProperty(result, key, {
          value: propertyResult,
          configurable: true,
          enumerable: true,
          writable: true
        });
      } else {
        result[key] = propertyResult;
      }
    }, "mergeProperty");
    const firstValue = values[0];
    const secondValue = values[1];
    for (const key of getKeysOfObject(firstValue)) {
      mergeProperty(key, objectHasProperty(secondValue, key) ? [firstValue[key], secondValue[key]] : [firstValue[key]]);
    }
    for (const key of getKeysOfObject(secondValue)) {
      if (!objectHasProperty(firstValue, key)) {
        mergeProperty(key, [secondValue[key]]);
      }
    }
    return result;
  }
  return mergeRecordsGeneral(values, utils, meta);
}
function mergeRecordsGeneral(values, utils, meta) {
  const result = {};
  for (const key of getKeysOfObjects(values)) {
    const propValues = [];
    for (const value of values) {
      if (objectHasProperty(value, key)) {
        propValues.push(value[key]);
      }
    }
    const updatedMeta = utils.metaDataUpdater(meta, {
      key,
      parents: values,
      values: propValues,
      result
    });
    const propertyResult = mergeUnknowns(propValues, utils, updatedMeta);
    if (propertyResult === actions.skip) {
      continue;
    }
    if (key === "__proto__") {
      Object.defineProperty(result, key, {
        value: propertyResult,
        configurable: true,
        enumerable: true,
        writable: true
      });
    } else {
      result[key] = propertyResult;
    }
  }
  return result;
}
function mergeMaps$1(values, utils, meta) {
  const result = /* @__PURE__ */ new Map();
  const valuesByKey = /* @__PURE__ */ new Map();
  for (const map of values) {
    for (const [key, value] of map) {
      const mut_keyValues = valuesByKey.get(key);
      if (mut_keyValues === void 0) {
        valuesByKey.set(key, [value]);
      } else {
        mut_keyValues.push(value);
      }
    }
  }
  for (const [key, keyValues] of valuesByKey) {
    const updatedMeta = utils.metaDataUpdater(meta, {
      key,
      parents: values,
      values: keyValues,
      result
    });
    const keyResult = mergeUnknowns(keyValues, utils, updatedMeta);
    if (keyResult === actions.skip) {
      continue;
    }
    result.set(key, keyResult);
  }
  return result;
}
function resolveCyclicReferences(value, utils, meta) {
  if (typeof value !== "object" || value === null) {
    return value;
  }
  const hierarchy = getMetaDataHierarchy(meta);
  const depth = getCyclicReferenceDepth(value, hierarchy, 0);
  if (hierarchy !== void 0 && depth > 0) {
    return hierarchy[hierarchy.length - depth]?.result;
  }
  const type = getObjectType(value);
  if (type === ObjectType.RECORD) {
    const record = value;
    let mut_changed = false;
    const result = {};
    for (const key of getKeysOfObject(record)) {
      const propVal = record[key];
      const updatedMeta = utils.metaDataUpdater(meta, {
        key,
        parents: [record],
        values: [propVal],
        result
      });
      const resolvedProp = resolveCyclicReferences(propVal, utils, updatedMeta);
      if (resolvedProp !== propVal) {
        mut_changed = true;
      }
      if (key === "__proto__") {
        Object.defineProperty(result, key, {
          value: resolvedProp,
          configurable: true,
          enumerable: true,
          writable: true
        });
      } else {
        result[key] = resolvedProp;
      }
    }
    return mut_changed ? result : value;
  }
  return value;
}
function mergeCircularReferences$1(values, cyclicDepths, utils, meta) {
  const depth = cyclicDepths[0];
  const hierarchy = getMetaDataHierarchy(meta);
  for (let mut_index = 1; mut_index < values.length; mut_index++) {
    if (cyclicDepths[mut_index] !== depth) {
      const lastCyclicDepth = cyclicDepths.at(-1);
      return lastCyclicDepth === 0 ? resolveCyclicReferences(values.at(-1), utils, meta) : hierarchy?.[hierarchy.length - lastCyclicDepth]?.result;
    }
  }
  return hierarchy?.[hierarchy.length - depth]?.result;
}
function deepmerge(...objects) {
  return defaultDeepmerge(...objects);
}
function deepmergeCustom(options = {}, rootMetaData) {
  const utils = getUtils$1(options, customizedDeepmerge);
  function customizedDeepmerge(...objects) {
    return mergeUnknowns(objects, utils, rootMetaData ?? void 0);
  }
  __name(customizedDeepmerge, "customizedDeepmerge");
  return customizedDeepmerge;
}
function getUtils$1(options, customizedDeepmerge) {
  const defaultMergeFns = mergeFunctions;
  const defaultMetaDataUpd = defaultMetaDataUpdater;
  return {
    defaultMergeFunctions: defaultMergeFns,
    mergeFunctions: resolveCustomMergeFunctions(options, defaultMergeFns),
    metaDataUpdater: typeof options.metaDataUpdater === "function" ? options.metaDataUpdater : defaultMetaDataUpd,
    deepmerge: customizedDeepmerge,
    useImplicitDefaultMerging: options.enableImplicitDefaultMerging ?? false,
    filterValues: options.filterValues === false ? void 0 : typeof options.filterValues === "function" ? options.filterValues : defaultFilterValues,
    maxDepth: typeof options.maxDepth === "number" && !Number.isNaN(options.maxDepth) && options.maxDepth >= 0 ? options.maxDepth : 1e3,
    actions
  };
}
function mergeUnknowns(values, utils, meta) {
  const filteredValues = utils.filterValues?.(values, meta) ?? values;
  if (filteredValues.length === 0) {
    return void 0;
  }
  const hierarchy = getMetaDataHierarchy(meta);
  const currentDepth = hierarchy?.length ?? (typeof meta === "number" ? meta : meta?.depth ?? 0);
  if (utils.maxDepth !== void 0 && currentDepth >= utils.maxDepth) {
    return mergeOthers(filteredValues, utils, meta);
  }
  if (filteredValues.length === 1) {
    if (hierarchy !== void 0) {
      const depth = getCyclicReferenceDepth(filteredValues[0], hierarchy, 0);
      if (depth > 0) {
        return hierarchy[hierarchy.length - depth]?.result ?? hierarchy[hierarchy.length - depth]?.parents[0];
      }
    }
    return mergeOthers(filteredValues, utils, meta);
  }
  const type = getObjectType(filteredValues[0]);
  if (type !== ObjectType.NOT && type !== ObjectType.OTHER) {
    if (filteredValues.length === 2) {
      if (getObjectType(filteredValues[1]) !== type) {
        return mergeOthers(filteredValues, utils, meta);
      }
      const d0 = getCyclicReferenceDepth(filteredValues[0], hierarchy, 0);
      const d1 = getCyclicReferenceDepth(filteredValues[1], hierarchy, 1);
      if (d0 !== 0 || d1 !== 0) {
        return mergeCircularReferences(filteredValues, [d0, d1], utils, meta);
      }
    } else {
      const cyclicDepths = new Array(filteredValues.length);
      cyclicDepths[0] = getCyclicReferenceDepth(filteredValues[0], hierarchy, 0);
      for (let mut_index = 1; mut_index < filteredValues.length; mut_index++) {
        if (getObjectType(filteredValues[mut_index]) !== type) {
          return mergeOthers(filteredValues, utils, meta);
        }
        cyclicDepths[mut_index] = getCyclicReferenceDepth(filteredValues[mut_index], hierarchy, mut_index);
      }
      if (cyclicDepths.some((depth) => depth !== 0)) {
        return mergeCircularReferences(filteredValues, cyclicDepths, utils, meta);
      }
    }
  }
  switch (type) {
    case ObjectType.RECORD: {
      return mergeRecords(filteredValues, utils, meta);
    }
    case ObjectType.ARRAY: {
      return mergeArrays(filteredValues, utils, meta);
    }
    case ObjectType.SET: {
      return mergeSets(filteredValues, utils, meta);
    }
    case ObjectType.MAP: {
      return mergeMaps(filteredValues, utils, meta);
    }
    default: {
      return mergeOthers(filteredValues, utils, meta);
    }
  }
}
function mergeRecords(values, utils, meta) {
  const result = utils.mergeFunctions.mergeRecords(values, utils, meta);
  if (shouldFallbackToDefault(utils, "mergeRecords", result)) {
    return utils.defaultMergeFunctions.mergeRecords(values, utils, meta);
  }
  return result;
}
function mergeArrays(values, utils, meta) {
  const result = utils.mergeFunctions.mergeArrays(values, utils, meta);
  if (shouldFallbackToDefault(utils, "mergeArrays", result)) {
    return utils.defaultMergeFunctions.mergeArrays(values);
  }
  return result;
}
function mergeSets(values, utils, meta) {
  const result = utils.mergeFunctions.mergeSets(values, utils, meta);
  if (shouldFallbackToDefault(utils, "mergeSets", result)) {
    return utils.defaultMergeFunctions.mergeSets(values);
  }
  return result;
}
function mergeMaps(values, utils, meta) {
  const result = utils.mergeFunctions.mergeMaps(values, utils, meta);
  if (shouldFallbackToDefault(utils, "mergeMaps", result)) {
    return utils.defaultMergeFunctions.mergeMaps(values, utils, meta);
  }
  return result;
}
function mergeCircularReferences(values, cyclicDepths, utils, meta) {
  const result = utils.mergeFunctions.mergeCircularReferences(values, cyclicDepths, utils, meta);
  if (shouldFallbackToDefault(utils, "mergeCircularReferences", result)) {
    return utils.defaultMergeFunctions.mergeCircularReferences(values, cyclicDepths, utils, meta);
  }
  return result;
}
function mergeOthers(values, utils, meta) {
  const result = utils.mergeFunctions.mergeOthers(values, utils, meta);
  if (shouldFallbackToDefault(utils, "mergeOthers", result)) {
    return utils.defaultMergeFunctions.mergeOthers(values);
  }
  return result;
}
function mergeRecordsFast$1(values, utils) {
  if (values.length === 2) {
    const result = {};
    const mergeProperty = /* @__PURE__ */ __name((key, propValues) => {
      const propertyResult = mergeUnknownsFast(propValues, utils);
      if (propertyResult === actions.skip) {
        return;
      }
      result[key] = propertyResult;
    }, "mergeProperty");
    const firstValue = values[0];
    const secondValue = values[1];
    for (const key of getKeysOfObject(firstValue)) {
      mergeProperty(key, objectHasProperty(secondValue, key) ? [firstValue[key], secondValue[key]] : [firstValue[key]]);
    }
    for (const key of getKeysOfObject(secondValue)) {
      if (!objectHasProperty(firstValue, key)) {
        mergeProperty(key, [secondValue[key]]);
      }
    }
    return result;
  }
  return mergeRecordsFastGeneral(values, utils);
}
function mergeRecordsFastGeneral(values, utils) {
  const result = {};
  for (const key of getKeysOfObjects(values)) {
    const propValues = [];
    for (const value of values) {
      if (objectHasProperty(value, key)) {
        propValues.push(value[key]);
      }
    }
    const propertyResult = mergeUnknownsFast(propValues, utils);
    if (propertyResult === actions.skip) {
      continue;
    }
    result[key] = propertyResult;
  }
  return result;
}
function mergeMapsFast$1(values, utils) {
  const result = /* @__PURE__ */ new Map();
  const valuesByKey = /* @__PURE__ */ new Map();
  for (const map of values) {
    for (const [key, value] of map) {
      const mut_keyValues = valuesByKey.get(key);
      if (mut_keyValues === void 0) {
        valuesByKey.set(key, [value]);
      } else {
        mut_keyValues.push(value);
      }
    }
  }
  for (const [key, keyValues] of valuesByKey) {
    const keyResult = mergeUnknownsFast(keyValues, utils);
    if (keyResult === actions.skip) {
      continue;
    }
    result.set(key, keyResult);
  }
  return result;
}
function deepmergeFastUnsafe(...objects) {
  return defaultDeepmergeFastUnsafe(...objects);
}
function deepmergeFastUnsafeCustom(options = {}) {
  const utils = getUtilsFast$1(options, customizedDeepmergeFast);
  function customizedDeepmergeFast(...objects) {
    return mergeUnknownsFast(objects, utils);
  }
  __name(customizedDeepmergeFast, "customizedDeepmergeFast");
  return customizedDeepmergeFast;
}
function getUtilsFast$1(options, customizedDeepmergeFast) {
  const defaultMergeFns = mergeFunctionsFast;
  const defaultMetaDataUpd = defaultMetaDataUpdaterFast;
  return {
    defaultMergeFunctions: defaultMergeFns,
    mergeFunctions: resolveCustomMergeFunctions(options, defaultMergeFns),
    metaDataUpdater: defaultMetaDataUpd,
    deepmerge: customizedDeepmergeFast,
    useImplicitDefaultMerging: options.enableImplicitDefaultMerging ?? false,
    filterValues: options.filterValues === false ? void 0 : typeof options.filterValues === "function" ? options.filterValues : defaultFilterValues,
    maxDepth: void 0,
    actions
  };
}
function mergeUnknownsFast(values, utils) {
  const filteredValues = utils.filterValues?.(values, void 0) ?? values;
  if (filteredValues.length === 0) {
    return void 0;
  }
  if (filteredValues.length === 1) {
    return mergeOthersFast(filteredValues, utils);
  }
  const type = getObjectType(filteredValues[0]);
  if (type !== ObjectType.NOT && type !== ObjectType.OTHER) {
    if (filteredValues.length === 2) {
      if (getObjectType(filteredValues[1]) !== type) {
        return mergeOthersFast(filteredValues, utils);
      }
    } else {
      for (let mut_index = 1; mut_index < filteredValues.length; mut_index++) {
        if (getObjectType(filteredValues[mut_index]) !== type) {
          return mergeOthersFast(filteredValues, utils);
        }
      }
    }
  }
  switch (type) {
    case ObjectType.RECORD: {
      return mergeRecordsFast(filteredValues, utils);
    }
    case ObjectType.ARRAY: {
      return mergeArraysFast(filteredValues, utils);
    }
    case ObjectType.SET: {
      return mergeSetsFast(filteredValues, utils);
    }
    case ObjectType.MAP: {
      return mergeMapsFast(filteredValues, utils);
    }
    default: {
      return mergeOthersFast(filteredValues, utils);
    }
  }
}
function mergeRecordsFast(values, utils) {
  const result = utils.mergeFunctions.mergeRecords(values, utils, void 0);
  if (shouldFallbackToDefault(utils, "mergeRecords", result)) {
    return utils.defaultMergeFunctions.mergeRecords(values, utils, void 0);
  }
  return result;
}
function mergeArraysFast(values, utils) {
  const result = utils.mergeFunctions.mergeArrays(values, utils, void 0);
  if (shouldFallbackToDefault(utils, "mergeArrays", result)) {
    return utils.defaultMergeFunctions.mergeArrays(values);
  }
  return result;
}
function mergeSetsFast(values, utils) {
  const result = utils.mergeFunctions.mergeSets(values, utils, void 0);
  if (shouldFallbackToDefault(utils, "mergeSets", result)) {
    return utils.defaultMergeFunctions.mergeSets(values);
  }
  return result;
}
function mergeMapsFast(values, utils) {
  const result = utils.mergeFunctions.mergeMaps(values, utils, void 0);
  if (shouldFallbackToDefault(utils, "mergeMaps", result)) {
    return utils.defaultMergeFunctions.mergeMaps(values, utils, void 0);
  }
  return result;
}
function mergeOthersFast(values, utils) {
  const result = utils.mergeFunctions.mergeOthers(values, utils, void 0);
  if (shouldFallbackToDefault(utils, "mergeOthers", result)) {
    return utils.defaultMergeFunctions.mergeOthers(values);
  }
  return result;
}
function mergeRecordsInto$1(mut_target, values, utils, meta) {
  if (values.length === 2) {
    const mergeProperty = /* @__PURE__ */ __name((key, propValues) => {
      const updatedMeta = utils.metaDataUpdater(meta, {
        key,
        parents: values,
        values: propValues,
        result: mut_target.value
      });
      const propertyTarget = objectHasProperty(mut_target.value, key) ? { value: propValues[0] } : { value: emptyLike(propValues[0]) };
      mergeUnknownsInto(propertyTarget, propValues, utils, updatedMeta);
      if (key === "__proto__") {
        Object.defineProperty(mut_target.value, key, {
          value: propertyTarget.value,
          configurable: true,
          enumerable: true,
          writable: true
        });
      } else {
        mut_target.value[key] = propertyTarget.value;
      }
    }, "mergeProperty");
    const firstValue = values[0];
    const secondValue = values[1];
    for (const key of getKeysOfObject(firstValue)) {
      mergeProperty(key, objectHasProperty(secondValue, key) ? [firstValue[key], secondValue[key]] : [firstValue[key]]);
    }
    for (const key of getKeysOfObject(secondValue)) {
      if (!objectHasProperty(firstValue, key)) {
        mergeProperty(key, [secondValue[key]]);
      }
    }
    return;
  }
  mergeRecordsIntoGeneral(mut_target, values, utils, meta);
}
function mergeRecordsIntoGeneral(mut_target, values, utils, meta) {
  for (const key of getKeysOfObjects(values)) {
    const propValues = [];
    for (const value of values) {
      if (objectHasProperty(value, key)) {
        propValues.push(value[key]);
      }
    }
    const updatedMeta = utils.metaDataUpdater(meta, {
      key,
      parents: values,
      values: propValues,
      result: mut_target.value
    });
    const propertyTarget = objectHasProperty(mut_target.value, key) ? { value: propValues[0] } : { value: emptyLike(propValues[0]) };
    mergeUnknownsInto(propertyTarget, propValues, utils, updatedMeta);
    if (key === "__proto__") {
      Object.defineProperty(mut_target.value, key, {
        value: propertyTarget.value,
        configurable: true,
        enumerable: true,
        writable: true
      });
    } else {
      mut_target.value[key] = propertyTarget.value;
    }
  }
}
function mergeMapsInto$1(mut_target, values, utils, meta) {
  const valuesByKey = /* @__PURE__ */ new Map();
  for (const value of values) {
    if (value === mut_target.value) {
      continue;
    }
    for (const [key, entryValue] of value) {
      const mut_keyValues = valuesByKey.get(key);
      if (mut_keyValues === void 0) {
        valuesByKey.set(key, [entryValue]);
      } else {
        mut_keyValues.push(entryValue);
      }
    }
  }
  const target = mut_target.value;
  for (const [key, keyValues] of valuesByKey) {
    const targetValue = target.get(key);
    const allValues = targetValue === void 0 ? keyValues : [targetValue, ...keyValues];
    const updatedMeta = utils.metaDataUpdater(meta, {
      key,
      parents: values,
      values: allValues,
      result: mut_target.value
    });
    const propTarget = targetValue === void 0 ? { value: emptyLike(allValues[0]) } : { value: targetValue };
    mergeUnknownsInto(propTarget, allValues, utils, updatedMeta);
    target.set(key, propTarget.value);
  }
}
function resolveCyclicReferencesInto(value, utils, meta) {
  if (typeof value !== "object" || value === null) {
    return value;
  }
  const hierarchy = getMetaDataHierarchy(meta);
  const depth = getCyclicReferenceDepth(value, hierarchy, 0);
  if (hierarchy !== void 0 && depth > 0) {
    return hierarchy[hierarchy.length - depth]?.result ?? hierarchy[hierarchy.length - depth]?.parents[0];
  }
  const type = getObjectType(value);
  if (type === ObjectType.RECORD) {
    const record = value;
    let mut_changed = false;
    const result = {};
    for (const key of getKeysOfObject(record)) {
      const propVal = record[key];
      const updatedMeta = utils.metaDataUpdater(meta, {
        key,
        parents: [record],
        values: [propVal],
        result
      });
      const resolvedProp = resolveCyclicReferencesInto(propVal, utils, updatedMeta);
      if (resolvedProp !== propVal) {
        mut_changed = true;
      }
      if (key === "__proto__") {
        Object.defineProperty(result, key, {
          value: resolvedProp,
          configurable: true,
          enumerable: true,
          writable: true
        });
      } else {
        result[key] = resolvedProp;
      }
    }
    return mut_changed ? result : value;
  }
  return value;
}
function mergeCircularReferencesInto$1(mut_target, values, utils, meta) {
  const hierarchy = getMetaDataHierarchy(meta);
  const cyclicDepths = values.map((v, i) => getCyclicReferenceDepth(v, hierarchy, i));
  const depth = cyclicDepths[0];
  for (let mut_index = 1; mut_index < values.length; mut_index++) {
    if (cyclicDepths[mut_index] !== depth) {
      const lastCyclicDepth = cyclicDepths.at(-1);
      mut_target.value = lastCyclicDepth === 0 ? resolveCyclicReferencesInto(values.at(-1), utils, meta) : hierarchy?.[hierarchy.length - lastCyclicDepth]?.result ?? hierarchy?.[hierarchy.length - lastCyclicDepth]?.parents[0];
      return;
    }
  }
  mut_target.value = hierarchy?.[hierarchy.length - depth]?.result ?? hierarchy?.[hierarchy.length - depth]?.parents[0];
}
function deepmergeInto(target, ...objects) {
  return void defaultDeepmergeInto(target, ...objects);
}
function deepmergeIntoCustom(options = {}, rootMetaData) {
  const utils = getUtils(options, customizedDeepmergeInto);
  function customizedDeepmergeInto(target, ...objects) {
    mergeUnknownsInto({ value: target }, [target, ...objects], utils, rootMetaData);
  }
  __name(customizedDeepmergeInto, "customizedDeepmergeInto");
  return customizedDeepmergeInto;
}
function getUtils(options, customizedDeepmergeInto) {
  const defaultMergeFns = mergeIntoFunctions;
  const defaultMetaDataUpd = defaultMetaDataUpdater;
  return {
    defaultMergeFunctions: defaultMergeFns,
    mergeFunctions: resolveCustomMergeFunctions(options, defaultMergeFns),
    metaDataUpdater: typeof options.metaDataUpdater === "function" ? options.metaDataUpdater : defaultMetaDataUpd,
    deepmergeInto: customizedDeepmergeInto,
    filterValues: options.filterValues === false ? void 0 : typeof options.filterValues === "function" ? options.filterValues : defaultFilterValues,
    maxDepth: typeof options.maxDepth === "number" && !Number.isNaN(options.maxDepth) && options.maxDepth >= 0 ? options.maxDepth : 1e3,
    actions: actionsInto
  };
}
function mergeUnknownsInto(mut_target, values, utils, meta) {
  const filteredValues = utils.filterValues?.(values, meta) ?? values;
  if (filteredValues.length === 0) {
    return;
  }
  const hierarchy = getMetaDataHierarchy(meta);
  const currentDepth = hierarchy?.length ?? (typeof meta === "number" ? meta : meta?.depth ?? 0);
  if (utils.maxDepth !== void 0 && currentDepth >= utils.maxDepth) {
    return void mergeOthersInto(mut_target, filteredValues, utils, meta);
  }
  if (filteredValues.length === 1) {
    if (hierarchy !== void 0) {
      const depth = getCyclicReferenceDepth(filteredValues[0], hierarchy, 0);
      if (depth > 0) {
        mut_target.value = hierarchy[hierarchy.length - depth]?.result ?? hierarchy[hierarchy.length - depth]?.parents[0];
        return;
      }
    }
    return void mergeOthersInto(mut_target, filteredValues, utils, meta);
  }
  const type = getObjectType(mut_target.value);
  if (type !== ObjectType.NOT && type !== ObjectType.OTHER) {
    if (filteredValues.length === 2) {
      if (getObjectType(filteredValues[1]) !== type) {
        return void mergeOthersInto(mut_target, filteredValues, utils, meta);
      }
      const d0 = getCyclicReferenceDepth(filteredValues[0], hierarchy, 0);
      const d1 = getCyclicReferenceDepth(filteredValues[1], hierarchy, 1);
      if (d0 !== 0 || d1 !== 0) {
        return void mergeCircularReferencesInto(mut_target, filteredValues, utils, meta);
      }
    } else {
      const cyclicDepths = new Array(filteredValues.length);
      cyclicDepths[0] = getCyclicReferenceDepth(filteredValues[0], hierarchy, 0);
      for (let mut_index = 1; mut_index < filteredValues.length; mut_index++) {
        if (getObjectType(filteredValues[mut_index]) !== type) {
          return void mergeOthersInto(mut_target, filteredValues, utils, meta);
        }
        cyclicDepths[mut_index] = getCyclicReferenceDepth(filteredValues[mut_index], hierarchy, mut_index);
      }
      if (cyclicDepths.some((depth) => depth !== 0)) {
        return void mergeCircularReferencesInto(mut_target, filteredValues, utils, meta);
      }
    }
  }
  switch (type) {
    case ObjectType.RECORD: {
      return void mergeRecordsInto(mut_target, filteredValues, utils, meta);
    }
    case ObjectType.ARRAY: {
      return void mergeArraysInto(mut_target, filteredValues, utils, meta);
    }
    case ObjectType.SET: {
      return void mergeSetsInto(mut_target, filteredValues, utils, meta);
    }
    case ObjectType.MAP: {
      return void mergeMapsInto(mut_target, filteredValues, utils, meta);
    }
    default: {
      return void mergeOthersInto(mut_target, filteredValues, utils, meta);
    }
  }
}
function mergeRecordsInto(mut_target, values, utils, meta) {
  const action = utils.mergeFunctions.mergeRecords(mut_target, values, utils, meta);
  if (action === actionsInto.defaultMerge) {
    utils.defaultMergeFunctions.mergeRecords(mut_target, values, utils, meta);
  }
}
function mergeArraysInto(mut_target, values, utils, meta) {
  const action = utils.mergeFunctions.mergeArrays(mut_target, values, utils, meta);
  if (action === actionsInto.defaultMerge) {
    utils.defaultMergeFunctions.mergeArrays(mut_target, values);
  }
}
function mergeSetsInto(mut_target, values, utils, meta) {
  const action = utils.mergeFunctions.mergeSets(mut_target, values, utils, meta);
  if (action === actionsInto.defaultMerge) {
    utils.defaultMergeFunctions.mergeSets(mut_target, values);
  }
}
function mergeMapsInto(mut_target, values, utils, meta) {
  const action = utils.mergeFunctions.mergeMaps(mut_target, values, utils, meta);
  if (action === actionsInto.defaultMerge) {
    utils.defaultMergeFunctions.mergeMaps(mut_target, values, utils, meta);
  }
}
function mergeCircularReferencesInto(mut_target, values, utils, meta) {
  const action = utils.mergeFunctions.mergeCircularReferences(mut_target, values, utils, meta);
  if (action === actionsInto.defaultMerge || mut_target.value === actionsInto.defaultMerge) {
    utils.defaultMergeFunctions.mergeCircularReferences(mut_target, values, utils, meta);
  }
}
function mergeOthersInto(mut_target, values, utils, meta) {
  const action = utils.mergeFunctions.mergeOthers(mut_target, values, utils, meta);
  if (action === actionsInto.defaultMerge || mut_target.value === actionsInto.defaultMerge) {
    utils.defaultMergeFunctions.mergeOthers(mut_target, values);
  }
}
function mergeRecordsIntoFast$1(mut_target, values, utils) {
  if (values.length === 2) {
    const mergeProperty = /* @__PURE__ */ __name((key, propValues) => {
      const propertyTarget = objectHasProperty(mut_target.value, key) ? { value: propValues[0] } : { value: emptyLike(propValues[0]) };
      mergeUnknownsIntoFast(propertyTarget, propValues, utils);
      mut_target.value[key] = propertyTarget.value;
    }, "mergeProperty");
    const firstValue = values[0];
    const secondValue = values[1];
    for (const key of getKeysOfObject(firstValue)) {
      mergeProperty(key, objectHasProperty(secondValue, key) ? [firstValue[key], secondValue[key]] : [firstValue[key]]);
    }
    for (const key of getKeysOfObject(secondValue)) {
      if (!objectHasProperty(firstValue, key)) {
        mergeProperty(key, [secondValue[key]]);
      }
    }
    return;
  }
  mergeRecordsIntoFastGeneral(mut_target, values, utils);
}
function mergeRecordsIntoFastGeneral(mut_target, values, utils) {
  for (const key of getKeysOfObjects(values)) {
    const propValues = [];
    for (const value of values) {
      if (objectHasProperty(value, key)) {
        propValues.push(value[key]);
      }
    }
    const propertyTarget = objectHasProperty(mut_target.value, key) ? { value: propValues[0] } : { value: emptyLike(propValues[0]) };
    mergeUnknownsIntoFast(propertyTarget, propValues, utils);
    mut_target.value[key] = propertyTarget.value;
  }
}
function mergeMapsIntoFast$1(mut_target, values, utils) {
  const valuesByKey = /* @__PURE__ */ new Map();
  for (const value of values) {
    if (value === mut_target.value) {
      continue;
    }
    for (const [key, entryValue] of value) {
      const mut_keyValues = valuesByKey.get(key);
      if (mut_keyValues === void 0) {
        valuesByKey.set(key, [entryValue]);
      } else {
        mut_keyValues.push(entryValue);
      }
    }
  }
  const target = mut_target.value;
  for (const [key, keyValues] of valuesByKey) {
    const targetValue = target.get(key);
    const allValues = targetValue === void 0 ? keyValues : [targetValue, ...keyValues];
    const propTarget = targetValue === void 0 ? { value: emptyLike(allValues[0]) } : { value: targetValue };
    mergeUnknownsIntoFast(propTarget, allValues, utils);
    target.set(key, propTarget.value);
  }
}
function deepmergeIntoFastUnsafe(target, ...objects) {
  return void defaultDeepmergeIntoFastUnsafe(target, ...objects);
}
function deepmergeIntoFastUnsafeCustom(options = {}) {
  const utils = getUtilsFast(options, customizedDeepmergeIntoFast);
  function customizedDeepmergeIntoFast(target, ...objects) {
    mergeUnknownsIntoFast({ value: target }, [target, ...objects], utils);
  }
  __name(customizedDeepmergeIntoFast, "customizedDeepmergeIntoFast");
  return customizedDeepmergeIntoFast;
}
function getUtilsFast(options, customizedDeepmergeIntoFast) {
  const defaultMergeFns = mergeIntoFunctionsFast;
  const defaultMetaDataUpd = defaultMetaDataUpdaterFast;
  return {
    defaultMergeFunctions: defaultMergeFns,
    mergeFunctions: resolveCustomMergeFunctions(options, defaultMergeFns),
    metaDataUpdater: defaultMetaDataUpd,
    deepmergeInto: customizedDeepmergeIntoFast,
    filterValues: options.filterValues === false ? void 0 : typeof options.filterValues === "function" ? options.filterValues : defaultFilterValues,
    maxDepth: void 0,
    actions: actionsInto
  };
}
function mergeUnknownsIntoFast(mut_target, values, utils) {
  const filteredValues = utils.filterValues?.(values, void 0) ?? values;
  if (filteredValues.length === 0) {
    return;
  }
  if (filteredValues.length === 1) {
    return void mergeOthersIntoFast(mut_target, filteredValues, utils);
  }
  const type = getObjectType(mut_target.value);
  if (type !== ObjectType.NOT && type !== ObjectType.OTHER) {
    if (filteredValues.length === 2) {
      if (getObjectType(filteredValues[1]) !== type) {
        return void mergeOthersIntoFast(mut_target, filteredValues, utils);
      }
    } else {
      for (let mut_index = 1; mut_index < filteredValues.length; mut_index++) {
        if (getObjectType(filteredValues[mut_index]) !== type) {
          return void mergeOthersIntoFast(mut_target, filteredValues, utils);
        }
      }
    }
  }
  switch (type) {
    case ObjectType.RECORD: {
      return void mergeRecordsIntoFast(mut_target, filteredValues, utils);
    }
    case ObjectType.ARRAY: {
      return void mergeArraysIntoFast(mut_target, filteredValues, utils);
    }
    case ObjectType.SET: {
      return void mergeSetsIntoFast(mut_target, filteredValues, utils);
    }
    case ObjectType.MAP: {
      return void mergeMapsIntoFast(mut_target, filteredValues, utils);
    }
    default: {
      return void mergeOthersIntoFast(mut_target, filteredValues, utils);
    }
  }
}
function mergeRecordsIntoFast(mut_target, values, utils) {
  const action = utils.mergeFunctions.mergeRecords(mut_target, values, utils, void 0);
  if (action === actionsInto.defaultMerge) {
    utils.defaultMergeFunctions.mergeRecords(mut_target, values, utils, void 0);
  }
}
function mergeArraysIntoFast(mut_target, values, utils) {
  const action = utils.mergeFunctions.mergeArrays(mut_target, values, utils, void 0);
  if (action === actionsInto.defaultMerge) {
    utils.defaultMergeFunctions.mergeArrays(mut_target, values);
  }
}
function mergeSetsIntoFast(mut_target, values, utils) {
  const action = utils.mergeFunctions.mergeSets(mut_target, values, utils, void 0);
  if (action === actionsInto.defaultMerge) {
    utils.defaultMergeFunctions.mergeSets(mut_target, values);
  }
}
function mergeMapsIntoFast(mut_target, values, utils) {
  const action = utils.mergeFunctions.mergeMaps(mut_target, values, utils, void 0);
  if (action === actionsInto.defaultMerge) {
    utils.defaultMergeFunctions.mergeMaps(mut_target, values, utils, void 0);
  }
}
function mergeOthersIntoFast(mut_target, values, utils) {
  const action = utils.mergeFunctions.mergeOthers(mut_target, values, utils, void 0);
  if (action === actionsInto.defaultMerge || mut_target.value === actionsInto.defaultMerge) {
    utils.defaultMergeFunctions.mergeOthers(mut_target, values);
  }
}
var actions, actionsInto, ObjectType, getKeys, mergeFunctions, defaultDeepmerge, mergeFunctionsFast, defaultDeepmergeFastUnsafe, mergeIntoFunctions, defaultDeepmergeInto, mergeIntoFunctionsFast, defaultDeepmergeIntoFastUnsafe;
var init_dist = __esm({
  "scripts/node-lab/node_modules/deepmerge-ts/dist/index.mjs"() {
    init_globals();
    actions = {
      defaultMerge: /* @__PURE__ */ Symbol("deepmerge-ts: default merge"),
      skip: /* @__PURE__ */ Symbol("deepmerge-ts: skip")
    };
    actionsInto = {
      defaultMerge: actions.defaultMerge
    };
    __name(emptyLike, "emptyLike");
    __name(defaultMetaDataUpdater, "defaultMetaDataUpdater");
    __name(defaultMetaDataUpdaterFast, "defaultMetaDataUpdaterFast");
    __name(defaultFilterValues, "defaultFilterValues");
    __name(shouldFallbackToDefault, "shouldFallbackToDefault");
    __name(resolveCustomMergeFunctions, "resolveCustomMergeFunctions");
    __name(mergeArrays$1, "mergeArrays$1");
    __name(mergeSets$1, "mergeSets$1");
    __name(mergeOthers$1, "mergeOthers$1");
    __name(mergeArraysInto$1, "mergeArraysInto$1");
    __name(mergeSetsInto$1, "mergeSetsInto$1");
    __name(mergeOthersInto$1, "mergeOthersInto$1");
    (function(ObjectType2) {
      ObjectType2[ObjectType2["NOT"] = 0] = "NOT";
      ObjectType2[ObjectType2["RECORD"] = 1] = "RECORD";
      ObjectType2[ObjectType2["ARRAY"] = 2] = "ARRAY";
      ObjectType2[ObjectType2["SET"] = 3] = "SET";
      ObjectType2[ObjectType2["MAP"] = 4] = "MAP";
      ObjectType2[ObjectType2["OTHER"] = 5] = "OTHER";
    })(ObjectType || (ObjectType = {}));
    __name(getObjectType, "getObjectType");
    getKeys = getKeysOfObjects;
    __name(getKeysOfObjects, "getKeysOfObjects");
    __name(getKeysOfObject, "getKeysOfObject");
    __name(objectHasProperty, "objectHasProperty");
    __name(isRecord, "isRecord");
    __name(getCyclicReferenceDepth, "getCyclicReferenceDepth");
    __name(getMetaDataHierarchy, "getMetaDataHierarchy");
    __name(mergeRecords$1, "mergeRecords$1");
    __name(mergeRecordsGeneral, "mergeRecordsGeneral");
    __name(mergeMaps$1, "mergeMaps$1");
    __name(resolveCyclicReferences, "resolveCyclicReferences");
    __name(mergeCircularReferences$1, "mergeCircularReferences$1");
    mergeFunctions = {
      mergeRecords: mergeRecords$1,
      mergeArrays: mergeArrays$1,
      mergeSets: mergeSets$1,
      mergeMaps: mergeMaps$1,
      mergeCircularReferences: mergeCircularReferences$1,
      mergeOthers: mergeOthers$1
    };
    defaultDeepmerge = /* @__PURE__ */ deepmergeCustom();
    __name(deepmerge, "deepmerge");
    __name(deepmergeCustom, "deepmergeCustom");
    __name(getUtils$1, "getUtils$1");
    __name(mergeUnknowns, "mergeUnknowns");
    __name(mergeRecords, "mergeRecords");
    __name(mergeArrays, "mergeArrays");
    __name(mergeSets, "mergeSets");
    __name(mergeMaps, "mergeMaps");
    __name(mergeCircularReferences, "mergeCircularReferences");
    __name(mergeOthers, "mergeOthers");
    __name(mergeRecordsFast$1, "mergeRecordsFast$1");
    __name(mergeRecordsFastGeneral, "mergeRecordsFastGeneral");
    __name(mergeMapsFast$1, "mergeMapsFast$1");
    mergeFunctionsFast = {
      mergeRecords: mergeRecordsFast$1,
      mergeArrays: mergeArrays$1,
      mergeSets: mergeSets$1,
      mergeMaps: mergeMapsFast$1,
      mergeOthers: mergeOthers$1
    };
    defaultDeepmergeFastUnsafe = /* @__PURE__ */ deepmergeFastUnsafeCustom();
    __name(deepmergeFastUnsafe, "deepmergeFastUnsafe");
    __name(deepmergeFastUnsafeCustom, "deepmergeFastUnsafeCustom");
    __name(getUtilsFast$1, "getUtilsFast$1");
    __name(mergeUnknownsFast, "mergeUnknownsFast");
    __name(mergeRecordsFast, "mergeRecordsFast");
    __name(mergeArraysFast, "mergeArraysFast");
    __name(mergeSetsFast, "mergeSetsFast");
    __name(mergeMapsFast, "mergeMapsFast");
    __name(mergeOthersFast, "mergeOthersFast");
    __name(mergeRecordsInto$1, "mergeRecordsInto$1");
    __name(mergeRecordsIntoGeneral, "mergeRecordsIntoGeneral");
    __name(mergeMapsInto$1, "mergeMapsInto$1");
    __name(resolveCyclicReferencesInto, "resolveCyclicReferencesInto");
    __name(mergeCircularReferencesInto$1, "mergeCircularReferencesInto$1");
    mergeIntoFunctions = {
      mergeRecords: mergeRecordsInto$1,
      mergeArrays: mergeArraysInto$1,
      mergeSets: mergeSetsInto$1,
      mergeMaps: mergeMapsInto$1,
      mergeCircularReferences: mergeCircularReferencesInto$1,
      mergeOthers: mergeOthersInto$1
    };
    defaultDeepmergeInto = /* @__PURE__ */ deepmergeIntoCustom();
    __name(deepmergeInto, "deepmergeInto");
    __name(deepmergeIntoCustom, "deepmergeIntoCustom");
    __name(getUtils, "getUtils");
    __name(mergeUnknownsInto, "mergeUnknownsInto");
    __name(mergeRecordsInto, "mergeRecordsInto");
    __name(mergeArraysInto, "mergeArraysInto");
    __name(mergeSetsInto, "mergeSetsInto");
    __name(mergeMapsInto, "mergeMapsInto");
    __name(mergeCircularReferencesInto, "mergeCircularReferencesInto");
    __name(mergeOthersInto, "mergeOthersInto");
    __name(mergeRecordsIntoFast$1, "mergeRecordsIntoFast$1");
    __name(mergeRecordsIntoFastGeneral, "mergeRecordsIntoFastGeneral");
    __name(mergeMapsIntoFast$1, "mergeMapsIntoFast$1");
    mergeIntoFunctionsFast = {
      mergeRecords: mergeRecordsIntoFast$1,
      mergeArrays: mergeArraysInto$1,
      mergeSets: mergeSetsInto$1,
      mergeMaps: mergeMapsIntoFast$1,
      mergeOthers: mergeOthersInto$1
    };
    defaultDeepmergeIntoFastUnsafe = /* @__PURE__ */ deepmergeIntoFastUnsafeCustom();
    __name(deepmergeIntoFastUnsafe, "deepmergeIntoFastUnsafe");
    __name(deepmergeIntoFastUnsafeCustom, "deepmergeIntoFastUnsafeCustom");
    __name(getUtilsFast, "getUtilsFast");
    __name(mergeUnknownsIntoFast, "mergeUnknownsIntoFast");
    __name(mergeRecordsIntoFast, "mergeRecordsIntoFast");
    __name(mergeArraysIntoFast, "mergeArraysIntoFast");
    __name(mergeSetsIntoFast, "mergeSetsIntoFast");
    __name(mergeMapsIntoFast, "mergeMapsIntoFast");
    __name(mergeOthersIntoFast, "mergeOthersIntoFast");
  }
});
init_dist();
export {
  deepmerge,
  deepmergeCustom,
  deepmergeFastUnsafe,
  deepmergeFastUnsafeCustom,
  deepmergeInto,
  deepmergeIntoCustom,
  deepmergeIntoFastUnsafe,
  deepmergeIntoFastUnsafeCustom,
  getKeys,
  getKeysOfObjects,
  getObjectType,
  objectHasProperty
};
