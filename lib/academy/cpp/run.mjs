/**
 * C++ SNIPPET RUNNER (build time only)
 *
 * The C++ Programming course is held to the same rule as the Python and
 * JavaScript courses: every program a lesson shows is COMPILED and RUN, and
 * the output the lesson quotes must be the output the program really prints.
 * A beginner cannot tell a wrong output from a right one, so a lesson written
 * from memory teaches them things that are not true.
 *
 * C++ cannot run in the learner's browser the way Python (Pyodide) and
 * JavaScript (a Worker) do here, so this runs at build time with the real
 * compiler, g++, in the language standard the course teaches (C++17; a
 * snippet can ask for C++20 with `std: "c++20"`).
 *
 * ── WHAT A SNIPPET CAN DECLARE ───────────────────────────────────────────
 *   expectedOutput   what the program prints (stdout)
 *   inputs           lines typed at the keyboard, fed to std::cin
 *   compileError     the program must NOT compile, and g++'s diagnostics
 *                    must contain this text
 *   compileWarning   the program compiles, with a warning containing this
 *   std              "c++17" (default) or "c++20"
 *   files            { "name.txt": "contents" } placed beside the program
 *                    before it runs, for the file-handling lessons
 *
 * Every snippet is compiled with -Wall -Wextra. A warning nobody asked for is
 * reported as an error: a course must not teach code its own compiler flags.
 *
 * ── KEYBOARD INPUT LOOKS LIKE A TERMINAL ─────────────────────────────────
 * When a program reads from a pipe, the typed text never appears in its
 * output, so "Enter your age: You are 20" is what a naive run captures. In a
 * real terminal the learner sees their own typing echoed. Snippets with
 * `inputs` are compiled with a small header (ECHO_HEADER) that replaces
 * std::cin's buffer with one that, each time the program needs a NEW line of
 * input, flushes std::cout and echoes that whole line. That is exactly when a
 * terminal would pause for the learner to type, so the captured transcript is
 * the one they will see.
 *
 * ── SPEED ────────────────────────────────────────────────────────────────
 * A g++ compile takes most of a second, and the course has hundreds of
 * programs. Results are cached by a hash of (compiler, flags, code, input) in
 * node_modules/.cache/academy-cpp, and compiles run in parallel. A cold run
 * takes under a minute; an unchanged lesson costs nothing.
 */

import { execFile, execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { cpus, tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("../../../", import.meta.url));
const CACHE_DIR = join(ROOT, "node_modules", ".cache", "academy-cpp");

export const ECHO_HEADER = `#include <iostream>
#include <streambuf>
#include <string>
#include <cstdio>
namespace academy_echo {
class EchoBuf : public std::streambuf {
  std::string line_;
 protected:
  int_type underflow() override {
    if (gptr() < egptr()) return traits_type::to_int_type(*gptr());
    std::cout.flush();
    line_.clear();
    int c;
    while ((c = std::getchar()) != EOF) {
      line_.push_back(static_cast<char>(c));
      if (c == '\\n') break;
    }
    if (line_.empty()) return traits_type::eof();
    if (line_.back() != '\\n') line_.push_back('\\n');
    std::cout << line_ << std::flush;
    setg(&line_[0], &line_[0], &line_[0] + line_.size());
    return traits_type::to_int_type(*gptr());
  }
};
struct Installer {
  EchoBuf buf;
  Installer() { std::cin.rdbuf(&buf); }
};
static Installer installer;
}  // namespace academy_echo
`;

/** Find a C++ compiler. CXX wins; otherwise g++ on PATH. Null if none. */
export function findCompiler() {
  for (const candidate of [process.env.CXX, "g++"].filter(Boolean)) {
    try {
      const version = execFileSync(candidate, ["--version"], { stdio: "pipe", encoding: "utf8" });
      return { cmd: candidate, version: version.split(/\r?\n/)[0] };
    } catch {
      /* try the next one */
    }
  }
  return null;
}

export const normaliseOut = (t) =>
  String(t ?? "")
    .split(/\r?\n/)
    .map((l) => l.trimEnd())
    .join("\n")
    .trim();

function run(cmd, args, options) {
  return new Promise((resolve) => {
    const child = execFile(cmd, args, { encoding: "utf8", maxBuffer: 16 * 1024 * 1024, ...options }, (err, stdout, stderr) =>
      resolve({
        code: err ? (typeof err.code === "number" ? err.code : 1) : 0,
        timedOut: Boolean(err && (err.killed || err.signal === "SIGTERM")),
        stdout: stdout || "",
        stderr: stderr || "",
      })
    );
    if (options?.input !== undefined) {
      child.stdin.end(options.input);
    }
  });
}

/**
 * Compile and run one program. Returns
 *   { compiled, compileStderr, warnings, stdout, stderr, exitCode, timedOut }
 */
async function compileAndRun(compiler, snippet, workDir, echoPath) {
  const std = snippet.std || "c++17";
  const flags = [`-std=${std}`, "-Wall", "-Wextra", "-O0"];
  const input = snippet.inputs ? snippet.inputs.map((l) => `${l}\n`).join("") : undefined;
  const key = createHash("sha256")
    .update(JSON.stringify([compiler.version, flags, snippet.code, input ?? null, input ? ECHO_HEADER : "", snippet.files ?? null, process.platform]))
    .digest("hex");
  const cacheFile = join(CACHE_DIR, `${key}.json`);
  if (existsSync(cacheFile)) {
    try {
      return JSON.parse(readFileSync(cacheFile, "utf8"));
    } catch {
      /* fall through and rebuild */
    }
  }

  // A directory per program: the file-handling lessons write files such as
  // students.txt, and programs run in parallel must not share them.
  const dir = join(workDir, key.slice(0, 16));
  mkdirSync(dir, { recursive: true });
  for (const [name, text] of Object.entries(snippet.files || {})) {
    writeFileSync(join(dir, name), text, "utf8");
  }
  const src = join(dir, "main.cpp");
  const exe = join(dir, "main.exe");
  writeFileSync(src, snippet.code, "utf8");
  // Static on Windows: a dynamically linked program loads whichever
  // libstdc++ DLL comes first on PATH, and a different MinGW's copy crashes
  // it before main() with STATUS_ENTRYPOINT_NOT_FOUND.
  const link = process.platform === "win32" ? ["-static"] : [];
  const args = [...flags, ...(input !== undefined ? ["-include", echoPath] : []), src, "-o", exe, ...link];
  // LC_ALL=C makes g++ use plain ASCII quotes in its messages, so a lesson can
  // quote a diagnostic without depending on the machine's locale.
  const env = { ...process.env, LC_ALL: "C", LANG: "C" };
  const built = await run(compiler.cmd, args, { cwd: dir, env, timeout: 60000 });
  const result = {
    compiled: built.code === 0,
    compileStderr: built.stderr,
    warnings: built.code === 0 ? built.stderr.split(/\r?\n/).filter((l) => /warning:/.test(l)) : [],
    stdout: "",
    stderr: "",
    exitCode: null,
    timedOut: false,
  };
  if (result.compiled) {
    const ran = await run(exe, [], { cwd: dir, env, timeout: 5000, input: input ?? "" });
    Object.assign(result, {
      stdout: ran.stdout,
      stderr: ran.stderr,
      exitCode: ran.code,
      timedOut: ran.timedOut,
    });
  }
  mkdirSync(CACHE_DIR, { recursive: true });
  writeFileSync(cacheFile, JSON.stringify(result), "utf8");
  return result;
}

/**
 * Verify every snippet. Each is { id, code, expectedOutput?, inputs?,
 * compileError?, compileWarning?, std? }. Returns a list of problems, one
 * human-readable string per failing snippet.
 */
export async function verifySnippets(snippets, compiler = findCompiler()) {
  if (!compiler) return { checked: 0, errors: [], skipped: snippets.length };
  const workDir = mkdtempSync(join(tmpdir(), "academy-cpp-"));
  const echoPath = join(workDir, "academy_echo.hpp");
  writeFileSync(echoPath, ECHO_HEADER, "utf8");

  const errors = [];
  let next = 0;
  let checked = 0;
  const worker = async () => {
    while (next < snippets.length) {
      const snip = snippets[next];
      next += 1;
      const r = await compileAndRun(compiler, snip, workDir, echoPath);
      checked += 1;
      const problem = judge(snip, r);
      if (problem) errors.push(`${snip.id}: ${problem}`);
    }
  };
  const lanes = Math.max(2, Math.min(8, cpus().length));
  await Promise.all(Array.from({ length: lanes }, worker));
  return { checked, errors, skipped: 0 };
}

const firstError = (text) =>
  String(text)
    .split(/\r?\n/)
    .find((l) => /error:/.test(l))
    ?.replace(/^.*?error:\s*/, "") || String(text).trim().split(/\r?\n/)[0] || "";

function judge(snip, r) {
  if (snip.compileError) {
    if (r.compiled) return `the lesson says this does not compile, but g++ compiled it`;
    if (!normaliseOut(r.compileStderr).includes(snip.compileError)) {
      return `g++ rejected it, but not with "${snip.compileError}". It said: ${firstError(r.compileStderr)}`;
    }
    return null;
  }
  if (!r.compiled) return `does not compile: ${firstError(r.compileStderr)}`;
  if (snip.compileWarning) {
    if (!r.warnings.some((w) => w.includes(snip.compileWarning))) {
      return `the lesson expects a warning containing "${snip.compileWarning}", got ${r.warnings.length ? r.warnings[0] : "none"}`;
    }
  } else if (r.warnings.length) {
    return `compiles with a warning the lesson does not mention: ${r.warnings[0].replace(/^.*?warning:\s*/, "")}`;
  }
  if (r.timedOut) return "did not finish within 5 seconds (an infinite loop?)";
  if (r.exitCode !== 0) {
    return `exited with code ${r.exitCode}${r.stderr ? `: ${normaliseOut(r.stderr).split("\n").pop()}` : ""}`;
  }
  if (snip.expectedOutput === undefined) return null;
  if (normaliseOut(r.stdout) !== normaliseOut(snip.expectedOutput)) {
    return (
      `expected output does not match what the program printed.\n` +
      `      lesson claims:  ${JSON.stringify(normaliseOut(snip.expectedOutput))}\n` +
      `      program printed: ${JSON.stringify(normaliseOut(r.stdout))}`
    );
  }
  return null;
}

/* ── Fill-in-the-code practice ──────────────────────────────────────────
 * A `codeFill` program has gaps marked {{1}}, {{2}}, ... and a list of
 * accepted answers per gap. Every accepted answer is substituted (the other
 * gaps take their first answer), compiled and run, and must print the
 * practice's expectedOutput. So the practice can never accept code that does
 * not work, and the canonical answer is proven to work.
 */
export function fillVariants(fill) {
  const gaps = fill.blanks || [];
  const canonical = gaps.map((b) => b.answers[0]);
  const variants = [{ label: "model answer", values: canonical }];
  gaps.forEach((b, i) => {
    b.answers.slice(1).forEach((alt) => {
      const values = [...canonical];
      values[i] = alt;
      variants.push({ label: `gap ${i + 1} alternative "${alt}"`, values });
    });
  });
  return variants.map((v) => ({
    label: v.label,
    code: fill.code.replace(/\{\{(\d+)\}\}/g, (_, n) => v.values[Number(n) - 1] ?? ""),
  }));
}
