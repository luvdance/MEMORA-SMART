/**
 * public/lab/node-typescript.js — the real TypeScript compiler with the type
 * definitions of Node.js and the lab's packages (gen-types.json, written by
 * scripts/nodeLabRuntime.mjs from scripts/node-lab/node_modules).
 */
import ts from "typescript";
import { typecheck } from "./tsEntry.js";
import TYPES from "./gen-types.json";

export const TS_VERSION = ts.version;

/** Type-check a project's files ({ "src/app.ts": "…", "tsconfig.json": "…" }). */
export function typecheckProject(projectFiles) {
  return typecheck(ts, { projectFiles, typeFiles: TYPES.typeFiles, libFiles: TYPES.libFiles });
}
