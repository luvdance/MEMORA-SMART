/**
 * TYPESCRIPT, CHECKED FOR REAL
 *
 * The React lab runtime strips TypeScript types and never checks them,
 * exactly as Vite does in development. So that the TypeScript module's
 * promises are kept, `npm run validate:content` (and scripts/rxCheck.mjs)
 * type-check its labs with the real compiler, configured as a Vite
 * react-ts project is (strict, react-jsx, bundler resolution):
 *
 *   · a lab with `typecheck: true` must compile its model answer with zero
 *     errors; with `starterTypeErrors: true` its starter must have at least
 *     one, so the exercise really is about the types;
 *   · an atom's `tsCheck: { code, errors: ["TS2322", …] }` is compiled as one
 *     file and must produce exactly those error codes, so every compiler
 *     message a lesson quotes is the compiler's own.
 *
 * Virtual files are placed inside the project folder, so imports of "react",
 * "react-dom/client" and "zod" resolve to the installed type definitions.
 */

import { existsSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const PROJECT = resolve(dirname(fileURLToPath(import.meta.url)), "../../..");

const OPTIONS = {
  target: ts.ScriptTarget.ES2022,
  module: ts.ModuleKind.ESNext,
  moduleResolution: ts.ModuleResolutionKind.Bundler,
  jsx: ts.JsxEmit.ReactJSX,
  lib: ["lib.es2023.d.ts", "lib.dom.d.ts", "lib.dom.iterable.d.ts"],
  strict: true,
  noEmit: true,
  skipLibCheck: true,
  allowImportingTsExtensions: true,
  isolatedModules: true,
  noUnusedLocals: false,
  types: [],
};

const VITE_ENV = '/// <reference types="vite/client" />\n';

let counter = 0;

/**
 * files: { "src/App.tsx": "…", … }   (only .ts and .tsx are checked)
 * Returns [{ file, line, code: "TS2322", message }].
 */
export function typecheck(files) {
  const base = join(PROJECT, "__rx_typecheck__", String(counter++));
  const virtual = new Map();
  for (const [name, text] of Object.entries(files)) virtual.set(join(base, name), String(text ?? ""));
  virtual.set(join(base, "src", "vite-env.d.ts"), VITE_ENV);
  const roots = [...virtual.keys()].filter((f) => /\.(ts|tsx)$/.test(f));

  const host = ts.createCompilerHost(OPTIONS, true);
  const norm = (f) => resolve(f);
  const original = {
    fileExists: host.fileExists.bind(host),
    readFile: host.readFile.bind(host),
    getSourceFile: host.getSourceFile.bind(host),
  };
  host.fileExists = (f) => virtual.has(norm(f)) || original.fileExists(f);
  host.readFile = (f) => (virtual.has(norm(f)) ? virtual.get(norm(f)) : original.readFile(f));
  host.getSourceFile = (f, lang, onError, create) =>
    virtual.has(norm(f))
      ? ts.createSourceFile(f, virtual.get(norm(f)), lang, true)
      : original.getSourceFile(f, lang, onError, create);
  host.directoryExists = (d) => [...virtual.keys()].some((f) => f.startsWith(norm(d))) || existsSync(d);

  const program = ts.createProgram(roots, OPTIONS, host);
  const diagnostics = ts.getPreEmitDiagnostics(program);
  return diagnostics
    .filter((d) => !d.file || virtual.has(norm(d.file.fileName)))
    .map((d) => ({
      file: d.file ? norm(d.file.fileName).slice(base.length + 1).replace(/\\/g, "/") : "",
      line: d.file && d.start !== undefined ? d.file.getLineAndCharacterOfPosition(d.start).line + 1 : 0,
      code: "TS" + d.code,
      message: ts.flattenDiagnosticMessageText(d.messageText, "\n"),
    }));
}

/** The type checks a list of React-course atoms asks for. Returns error strings. */
export function verifyTypes(atoms) {
  const errors = [];
  let checked = 0;
  for (const atom of atoms) {
    const lab = atom.webLab;
    if (lab?.typecheck) {
      const solved = { ...lab.files, ...(lab.solution || {}) };
      const found = typecheck(solved);
      checked += 1;
      if (found.length) {
        errors.push(`${atom.id}: the model answer has type errors: ` + found.map((d) => `${d.file}:${d.line} ${d.code} ${d.message}`).join(" | "));
      }
      if (lab.starterTypeErrors && typecheck(lab.files).length === 0) {
        errors.push(`${atom.id}: the starter has no type errors, but the lab says it does`);
      }
    }
    if (atom.tsCheck) {
      const found = typecheck({ "src/check.tsx": atom.tsCheck.code });
      checked += 1;
      const got = found.map((d) => d.code).sort().join(",");
      const want = [...(atom.tsCheck.errors || [])].sort().join(",");
      if (got !== want) {
        errors.push(`${atom.id}: tsCheck expects [${want}] but tsc reports [${got}]: ` + found.map((d) => `${d.line} ${d.message}`).join(" | "));
      }
      for (const quote of atom.tsCheck.quotes || []) {
        if (!found.some((d) => d.message.includes(quote))) {
          errors.push(`${atom.id}: the lesson quotes "${quote}", which tsc does not print`);
        }
      }
    }
  }
  return { checked, errors };
}

/** For quick manual use: node lib/academy/react/typecheck.mjs file.tsx */
if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1]) && process.argv[2]) {
  console.log(typecheck({ "src/check.tsx": readFileSync(process.argv[2], "utf8") }));
}
