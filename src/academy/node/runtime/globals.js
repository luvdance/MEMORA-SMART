/**
 * Free identifiers in the bundled npm packages: their `process` and
 * `console` are the running lab machine's (esbuild `inject`). Their free
 * `Buffer` is the lab's too, through esbuild `define` (globalThis.__labBuffer,
 * set by buffer.js, imported here so it is set first): injecting it as well
 * breaks esbuild's code splitting.
 */
import proc from "./process.js";
import "./buffer.js";
import { ctx } from "./context.js";

export const process = proc;
const host = globalThis.console;
export const console = new Proxy(host, {
  get(target, key) {
    const c = ctx.machine?.console;
    return c && key in c ? c[key] : target[key];
  },
});
