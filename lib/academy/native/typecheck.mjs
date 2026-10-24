/**
 * MOBILE LABS, TYPE-CHECKED AGAINST THE REAL EXPO SDK
 *
 * The practice phone re-implements the Expo modules that need native code,
 * so a lab could, in principle, use an API the real module does not have.
 * This check rules that out: every TypeScript file of every mobile lab's
 * model answer is compiled by TypeScript 6 (the template's version) against
 * the REAL type definitions of React Native 0.88, Expo Router and the Expo
 * SDK 58 modules installed in scripts/native-lab/, configured exactly as
 * `npx create-expo-app` configures a project (expo/tsconfig.base, strict,
 * the "@/" path alias, expo/types for image imports, Jest's globals for
 * test files).
 *
 *   · a lab's model answer must compile with zero errors;
 *   · `starterTypeErrors: true` asserts its starter has at least one;
 *   · an atom's `tsCheck: { code, errors: ["TS2322"], quotes: [...] }` is
 *     compiled as src/check.tsx and must report exactly those errors.
 *
 * Plain JavaScript files (.js/.jsx) and the practice server (server/) are not
 * type-checked, as in a real Expo project with allowJs and no checkJs.
 */

import { existsSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "../../..");
const WORKSPACE = join(ROOT, "scripts", "native-lab");
export const nativeTypesAvailable = () => existsSync(join(WORKSPACE, "node_modules", "typescript")) && existsSync(join(WORKSPACE, "node_modules", "expo-router"));

let ts = null;
function compiler() {
  if (!ts) ts = createRequire(join(WORKSPACE, "package.json"))("typescript");
  return ts;
}

function options() {
  const t = compiler();
  return {
    allowJs: true,
    checkJs: false,
    esModuleInterop: true,
    jsx: t.JsxEmit.ReactJSX,
    lib: ["lib.dom.d.ts", "lib.esnext.d.ts"],
    module: t.ModuleKind.Preserve,
    moduleDetection: t.ModuleDetectionKind.Force,
    moduleResolution: t.ModuleResolutionKind.Bundler,
    customConditions: ["react-native"],
    noEmit: true,
    resolveJsonModule: true,
    skipLibCheck: true,
    target: t.ScriptTarget.ESNext,
    strict: true,
    types: ["jest"],
  };
}

let counter = 0;

/** files: { "src/app/index.tsx": "…", … } → [{ file, line, code, message }] */
export function typecheckNative(files) {
  const t = compiler();
  const base = join(WORKSPACE, "__md_typecheck__", String(counter++));
  const opts = { ...options(), paths: { "@/*": [join(base, "src/*")], "@/assets/*": [join(base, "assets/*")] } };
  const virtual = new Map();
  for (const [name, text] of Object.entries(files)) {
    if (name.startsWith("server/")) continue;
    virtual.set(join(base, name), String(text ?? ""));
  }
  virtual.set(join(base, "expo-env.d.ts"), '/// <reference types="expo/types" />\n');
  const roots = [...virtual.keys()].filter((f) => /\.(ts|tsx)$/.test(f));
  const host = t.createCompilerHost(opts, true);
  const norm = (f) => resolve(f);
  const original = { fileExists: host.fileExists.bind(host), readFile: host.readFile.bind(host), getSourceFile: host.getSourceFile.bind(host) };
  host.fileExists = (f) => virtual.has(norm(f)) || original.fileExists(f);
  host.readFile = (f) => (virtual.has(norm(f)) ? virtual.get(norm(f)) : original.readFile(f));
  host.getSourceFile = (f, lang, onError, create) =>
    virtual.has(norm(f)) ? t.createSourceFile(f, virtual.get(norm(f)), lang, true) : original.getSourceFile(f, lang, onError, create);
  host.directoryExists = (d) => [...virtual.keys()].some((f) => f.startsWith(norm(d))) || existsSync(d);
  host.getCurrentDirectory = () => base;
  const program = t.createProgram(roots, opts, host);
  return t
    .getPreEmitDiagnostics(program)
    .filter((d) => !d.file || virtual.has(norm(d.file.fileName)))
    .map((d) => ({
      file: d.file ? norm(d.file.fileName).slice(base.length + 1).replace(/\\/g, "/") : "",
      line: d.file && d.start !== undefined ? d.file.getLineAndCharacterOfPosition(d.start).line + 1 : 0,
      code: "TS" + d.code,
      message: t.flattenDiagnosticMessageText(d.messageText, "\n"),
    }));
}

const hasTs = (files) => Object.keys(files || {}).some((f) => /\.tsx?$/.test(f) && !f.startsWith("server/"));

/** Type-check the mobile labs and tsCheck atoms of a list of atoms. */
export function verifyNativeTypes(atoms) {
  const errors = [];
  let checked = 0;
  if (!nativeTypesAvailable()) {
    return { checked, errors: ["the native lab workspace is not installed: run node scripts/nativeLabRuntime.mjs"] };
  }
  for (const atom of atoms) {
    for (const lab of [atom.webLab, atom.webDemo].filter(Boolean)) {
      if (!lab.files || !("app.json" in lab.files) || lab.typecheck === false) continue;
      const solved = { ...lab.files, ...(lab.solution || {}) };
      if (!hasTs(solved)) continue;
      const found = typecheckNative(solved);
      checked += 1;
      if (found.length) {
        errors.push(`${atom.id}: the ${lab === atom.webDemo ? "demo" : "model answer"} has type errors against Expo SDK 58: ` + found.slice(0, 6).map((d) => `${d.file}:${d.line} ${d.code} ${d.message.split("\n")[0]}`).join(" | "));
      }
      if (lab.starterTypeErrors && typecheckNative(lab.files).length === 0) {
        errors.push(`${atom.id}: the starter has no type errors, but the lab says it does`);
      }
    }
    if (atom.tsCheck && atom.tsCheck.native) {
      const found = typecheckNative({ "app.json": "{}", "src/check.tsx": atom.tsCheck.code });
      checked += 1;
      const got = found.map((d) => d.code).sort().join(",");
      const want = [...(atom.tsCheck.errors || [])].sort().join(",");
      if (got !== want) errors.push(`${atom.id}: tsCheck expects [${want}] but tsc reports [${got}]: ` + found.map((d) => `${d.line} ${d.message}`).join(" | "));
      for (const quote of atom.tsCheck.quotes || []) {
        if (!found.some((d) => d.message.includes(quote))) errors.push(`${atom.id}: the lesson quotes "${quote}", which tsc does not print`);
      }
    }
  }
  return { checked, errors };
}
