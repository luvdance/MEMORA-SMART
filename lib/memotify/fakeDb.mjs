/**
 * An in-memory Firestore stand-in for selfTest.mjs and the local dev server.
 * Covers the calls Memotify makes: collections by path, docs, == queries,
 * limit, and serial transactions. Never imported by a deployed function.
 */
export function fakeDb() {
  const store = new Map();
  let lock = Promise.resolve();

  const snapOf = (path, id) => {
    const data = store.get(path);
    return { id, exists: data !== undefined, data: () => (data === undefined ? undefined : structuredClone(data)) };
  };

  const write = (path, data, opts) => {
    const prev = store.get(path);
    store.set(path, opts?.merge && prev ? { ...prev, ...structuredClone(data) } : structuredClone(data));
  };

  const docRef = (col, id) => {
    const path = `${col}/${id}`;
    return {
      id,
      path,
      get: async () => snapOf(path, id),
      set: async (data, opts) => write(path, data, opts),
      update: async (data) => write(path, data, { merge: true }),
      delete: async () => void store.delete(path),
    };
  };

  const query = (col, filters = [], max = Infinity) => ({
    where: (field, _op, value) => query(col, [...filters, [field, value]], max),
    limit: (n) => query(col, filters, n),
    get: async () => {
      const docs = [];
      for (const [path, data] of store) {
        if (!path.startsWith(`${col}/`)) continue;
        const id = path.slice(col.length + 1);
        if (id.includes("/")) continue;
        if (filters.every(([field, value]) => data[field] === value)) {
          docs.push({ id, ref: docRef(col, id), data: () => structuredClone(data) });
        }
        if (docs.length >= max) break;
      }
      return { empty: docs.length === 0, size: docs.length, docs };
    },
  });

  return {
    store,
    collection: (col) => ({
      ...query(col),
      doc: (id) => docRef(col, id),
    }),
    runTransaction: (fn) => {
      const run = lock.then(async () => {
        const writes = [];
        const out = await fn({
          get: (ref) => ref.get(),
          set: (ref, data, opts) => writes.push(() => write(ref.path, data, opts)),
          update: (ref, data) => writes.push(() => write(ref.path, data, { merge: true })),
          delete: (ref) => writes.push(() => store.delete(ref.path)),
        });
        writes.forEach((apply) => apply());
        return out;
      });
      lock = run.catch(() => {});
      return run;
    },
  };
}
