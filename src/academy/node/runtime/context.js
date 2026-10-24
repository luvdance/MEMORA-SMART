/**
 * The machine that is running right now.
 *
 * Node's built-in modules (fs, http, process …) are bundled once, and the
 * real npm packages in the bundle (Express, multer …) hold references to
 * them. So the built-ins are thin fronts that act on the CURRENT machine:
 * its files, its clock, its network, its environment. One lab process runs
 * at a time in a worker; starting a new one replaces the old.
 */
export const ctx = {
  machine: null,
  /** sourceURL → length of the module wrapper on line 1 (see modules.js). */
  wrapperOffsets: new Map(),
  /** sourceURL → sucrase's source map of a rewritten file (see sourcemap.js). */
  sourceMaps: new Map(),
  /** The machine's virtual event loop (see loop.js). */
  get loop() {
    return this.machine?.loop || null;
  },
  get vol() {
    return this.machine?.vol || null;
  },
};
