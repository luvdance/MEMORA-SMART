/** node:path — POSIX paths: the lab machine is a Linux server. */
import path from "path-browserify";
import { ctx } from "./context.js";

const cwd = () => ctx.machine?.cwd || "/app";
const posix = {
  ...path,
  resolve: (...parts) => path.resolve(cwd(), ...parts),
  matchesGlob: undefined,
  toNamespacedPath: (p) => p,
};
posix.posix = posix;
posix.win32 = posix;
export default posix;
export const { join, dirname, basename, extname, normalize, relative, isAbsolute, sep, delimiter, parse, format } = posix;
export const resolve = posix.resolve;
