/**
 * TYPESCRIPT IN THE LAB — the real TypeScript compiler, type-checking a lab
 * project against the real type definitions of Node.js and the project's
 * packages (@types/node, @types/express, zod's own types …), as
 * `npx tsc --noEmit` does on a developer's machine.
 *
 * Bundled by scripts/nodeLabRuntime.mjs into public/lab/node-typescript.js
 * together with the .d.ts files it needs, and loaded only by labs that run
 * tsc. In Node (npm run validate:content) the same function runs with the
 * real typescript package and the real files.
 *
 *   typecheck(ts, { projectFiles, typeFiles, libFiles }) →
 *     { diagnostics: [{ file, line, column, code, category, message }], text }
 *
 * `text` is the report tsc prints in a terminal (its "pretty" format, without
 * colours): each error with its file:line:column, the line of code with the
 * spot underlined, and the "Found N errors" summary.
 */

/** Compiler options when the project has no tsconfig.json: Node 24 with type stripping. */
export const DEFAULT_OPTIONS = {
  target: "es2023",
  lib: ["es2024"],
  module: "nodenext",
  moduleResolution: "nodenext",
  strict: true,
  noEmit: true,
  allowImportingTsExtensions: true,
  rewriteRelativeImportExtensions: false,
  verbatimModuleSyntax: true,
  erasableSyntaxOnly: true,
  skipLibCheck: true,
  esModuleInterop: true,
  types: ["node"],
};

const ROOT = "/app";

export function typecheck(ts, { projectFiles, typeFiles, libFiles, newLine = "\n" }) {
  const files = new Map();
  for (const [name, text] of Object.entries(projectFiles)) files.set(`${ROOT}/${name}`, text);
  for (const [name, text] of Object.entries(typeFiles)) files.set(`${ROOT}/node_modules/${name}`, text);
  const LIB_DIR = "/__lib__";
  for (const [name, text] of Object.entries(libFiles)) files.set(`${LIB_DIR}/${name}`, text);

  const dirs = new Set();
  for (const f of files.keys()) {
    let d = f;
    while ((d = d.slice(0, d.lastIndexOf("/"))) && !dirs.has(d)) dirs.add(d);
  }
  dirs.add("/");

  // tsconfig.json, when the project has one.
  let options = { ...DEFAULT_OPTIONS };
  let rootNames = null;
  const configText = projectFiles["tsconfig.json"];
  const configErrors = [];
  if (configText !== undefined) {
    const parsed = ts.parseConfigFileTextToJson(`${ROOT}/tsconfig.json`, configText);
    if (parsed.error) configErrors.push(parsed.error);
    else {
      const host = {
        useCaseSensitiveFileNames: true,
        readDirectory: (dir, extensions, excludes, includes, depth) =>
          ts.matchFiles
            ? ts.matchFiles(dir, extensions, excludes, includes, true, ROOT, depth, (d) => ({ files: [...files.keys()].filter((f) => f.slice(0, f.lastIndexOf("/")) === d).map((f) => f.slice(d.length + 1)), directories: [...dirs].filter((x) => x.slice(0, x.lastIndexOf("/")) === d && x !== d).map((x) => x.slice(d.length + 1)) }), (p) => p)
            : [...files.keys()].filter((f) => f.startsWith(`${ROOT}/`) && !f.includes("/node_modules/")),
        fileExists: (p) => files.has(p),
        readFile: (p) => files.get(p),
      };
      const cmd = ts.parseJsonConfigFileContent(parsed.config, host, ROOT, undefined, `${ROOT}/tsconfig.json`);
      options = { ...cmd.options, noEmit: true };
      rootNames = cmd.fileNames;
      configErrors.push(...cmd.errors.filter((e) => e.code !== 18003));
      if (!rootNames.length) rootNames = null;
    }
  }
  if (!rootNames) {
    rootNames = [...files.keys()].filter((f) => f.startsWith(`${ROOT}/`) && !f.includes("/node_modules/") && /\.(m|c)?tsx?$/.test(f));
  }
  if (typeof options.target === "string" || typeof options.module === "string") {
    const conv = ts.convertCompilerOptionsFromJson(options, ROOT);
    options = conv.options;
  }
  options.noEmit = true;

  const host = {
    getSourceFile: (fileName, languageVersion) => {
      const text = files.get(fileName);
      return text === undefined ? undefined : ts.createSourceFile(fileName, text, languageVersion, true);
    },
    getDefaultLibFileName: (o) => `${LIB_DIR}/${ts.getDefaultLibFileName(o)}`,
    getDefaultLibLocation: () => LIB_DIR,
    writeFile: () => {},
    getCurrentDirectory: () => ROOT,
    getDirectories: (p) => [...dirs].filter((d) => d.slice(0, d.lastIndexOf("/")) === p && d !== p).map((d) => d.slice(p.length + 1)),
    directoryExists: (p) => dirs.has(p),
    fileExists: (p) => files.has(p),
    readFile: (p) => files.get(p),
    getCanonicalFileName: (f) => f,
    useCaseSensitiveFileNames: () => true,
    getNewLine: () => newLine,
    realpath: (p) => p,
  };
  const program = ts.createProgram({ rootNames, options, host });
  const all = [...configErrors, ...ts.getPreEmitDiagnostics(program)];
  const diagnostics = all.map((d) => {
    const pos = d.file && d.start !== undefined ? d.file.getLineAndCharacterOfPosition(d.start) : null;
    return {
      file: d.file ? d.file.fileName.replace(`${ROOT}/`, "") : null,
      line: pos ? pos.line + 1 : null,
      column: pos ? pos.character + 1 : null,
      code: `TS${d.code}`,
      category: ts.DiagnosticCategory[d.category].toLowerCase(),
      message: ts.flattenDiagnosticMessageText(d.messageText, "\n"),
    };
  });
  const formatHost = { getCurrentDirectory: () => ROOT, getCanonicalFileName: (f) => f, getNewLine: () => newLine };
  // eslint-disable-next-line no-control-regex
  const strip = (s) => s.replace(/\u001b\[[0-9;]*m/g, "");
  // tsc's reporter prints each diagnostic, then a blank line.
  let text = all.map((d) => strip(ts.formatDiagnosticsWithColorAndContext([d], formatHost)) + newLine).join("");
  if (all.length) {
    const errs = all.filter((d) => d.category === ts.DiagnosticCategory.Error);
    const byFile = new Map();
    for (const d of errs) {
      const f = d.file ? d.file.fileName.replace(`${ROOT}/`, "") : null;
      const line = d.file ? d.file.getLineAndCharacterOfPosition(d.start).line + 1 : 0;
      if (!byFile.has(f)) byFile.set(f, { count: 0, line });
      byFile.get(f).count += 1;
    }
    const n = errs.length;
    if (n === 1) {
      const [[f, v]] = [...byFile];
      text += `${newLine}Found 1 error${f ? ` in ${f}:${v.line}` : ""}${newLine}${newLine}`;
    } else if (byFile.size === 1) {
      const [[f, v]] = [...byFile];
      text += `${newLine}Found ${n} errors in the same file, starting at: ${f}:${v.line}${newLine}${newLine}`;
    } else {
      text += `${newLine}Found ${n} errors in ${byFile.size} files.${newLine}${newLine}Errors  Files${newLine}`;
      for (const [f, v] of byFile) text += `${String(v.count).padStart(6)}  ${f}:${v.line}${newLine}`;
    }
  }
  return { diagnostics, text };
}
