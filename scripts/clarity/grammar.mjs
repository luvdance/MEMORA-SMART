/**
 * CLARITY LAYER — GRAMMAR AND SPELLING WITH LANGUAGETOOL
 *
 * LanguageTool (https://languagetool.org, open source, LGPL) is a full grammar
 * checker: agreement, tense, articles, confused words, punctuation and British
 * spelling. It runs HERE, on this machine, as a local server, so no course
 * text is sent anywhere.
 *
 * Setup (once):
 *   npm run clarity:setup     downloads LanguageTool to ~/.cache/mst-languagetool
 *   Needs Java 17 or newer on PATH.
 *
 * The server is started on demand on port 8081 and stopped when the run ends.
 * If something is already listening there (you started it yourself), it is
 * reused and left running.
 *
 * Results are cached by text, so a second run only checks what changed.
 */
import { spawn } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import { plain } from "../../src/academy/writing/textkit.js";
import { quotedRanges } from "./plain.mjs";

const PORT = Number(process.env.LT_PORT || 8081);
const BASE = `http://localhost:${PORT}`;
export const LT_HOME = process.env.LT_HOME || join(homedir(), ".cache", "mst-languagetool");
const CACHE_DIR = new URL("./.cache/", import.meta.url);
const CACHE_FILE = new URL("./.cache/languagetool.json", import.meta.url);

/** Rules that only produce noise in course text (we check dashes and quotes ourselves). */
const DISABLED = [
  "WHITESPACE_RULE", "DASH_RULE", "EN_QUOTES", "UPPERCASE_SENTENCE_START",
  "PUNCTUATION_PARAGRAPH_END", "EN_UNPAIRED_QUOTES", "ARROWS", "MULTIPLICATION_SIGN",
  "PLUS_MINUS", "CURRENCY", "CURRENCY_SPACE", "NUMBERS_IN_WORDS", "SENTENCE_WHITESPACE",
  "COMMA_PARENTHESIS_WHITESPACE", "DOUBLE_PUNCTUATION", "EN_UNPAIRED_BRACKETS",
  "ENGLISH_WORD_REPEAT_BEGINNING_RULE", "EN_COMPOUNDS", "OXFORD_SPELLING_Z_NOT_S",
];

/** Categories that are real errors; the rest are reported as warnings. Typography and casing are ignored. */
const ERROR_CATEGORIES = new Set(["TYPOS", "GRAMMAR", "CONFUSED_WORDS", "COLLOCATIONS", "NONSTANDARD_PHRASES"]);
const IGNORED_CATEGORIES = new Set(["TYPOGRAPHY", "CASING"]);

function jar() {
  if (!existsSync(LT_HOME)) return null;
  const dir = readdirSync(LT_HOME).filter((d) => d.startsWith("LanguageTool-")).sort().pop();
  const path = dir && join(LT_HOME, dir, "languagetool-server.jar");
  return path && existsSync(path) ? path : null;
}

async function alive() {
  try {
    const r = await fetch(`${BASE}/v2/languages`, { signal: AbortSignal.timeout(1500) });
    return r.ok;
  } catch {
    return false;
  }
}

let child = null;

/** Make sure a server is listening. Returns false (with a message) if LanguageTool is not installed. */
export async function startGrammar() {
  if (await alive()) return true;
  const path = jar();
  if (!path) {
    console.error(`\n  LanguageTool is not installed in ${LT_HOME}.\n  Run: npm run clarity:setup   (or pass --no-grammar)\n`);
    return false;
  }
  child = spawn("java", ["-Xmx1g", "-cp", path, "org.languagetool.server.HTTPServer", "--port", String(PORT)], {
    stdio: "ignore",
    windowsHide: true,
  });
  child.on("error", (e) => console.error("  Could not start Java:", e.message));
  for (let i = 0; i < 120; i += 1) {
    if (await alive()) return true;
    await new Promise((r) => setTimeout(r, 500));
  }
  console.error("  LanguageTool did not start within 60 seconds.");
  return false;
}

export function stopGrammar() {
  if (child) child.kill();
  child = null;
}

let cache = null;
function loadCache() {
  if (cache) return cache;
  try {
    cache = JSON.parse(readFileSync(CACHE_FILE, "utf8"));
  } catch {
    cache = {};
  }
  return cache;
}
export function saveCache() {
  if (!cache) return;
  mkdirSync(CACHE_DIR, { recursive: true });
  writeFileSync(CACHE_FILE, JSON.stringify(cache));
}

async function check(text, language) {
  const key = createHash("sha1").update(language + "\n" + text).digest("hex");
  const c = loadCache();
  if (c[key]) return c[key];
  const body = new URLSearchParams({ text, language, disabledRules: DISABLED.join(",") });
  const r = await fetch(`${BASE}/v2/check`, { method: "POST", body });
  if (!r.ok) throw new Error(`LanguageTool ${r.status}: ${await r.text()}`);
  const json = await r.json();
  const matches = json.matches.map((m) => ({
    offset: m.offset, length: m.length, message: m.message,
    rule: m.rule.id, category: m.rule.category.id,
    replacements: m.replacements.slice(0, 3).map((x) => x.value),
  }));
  c[key] = matches;
  return matches;
}

/**
 * Grammar findings for one segment, in the same shape as plainFindings.
 * `allow` is a Set of lower-case words the course may use (names, brands).
 */
export async function grammarFindings(segment, language, allow) {
  if (segment.role === "wrong") return [];
  const text = plain(segment.text);
  if (!text.trim()) return [];
  const quoted = quotedRanges(text);
  const inQuote = (m) => quoted.some(([a, b]) => m.offset >= a && m.offset + m.length <= b);
  const out = [];
  for (const m of await check(text, language)) {
    if (IGNORED_CATEGORIES.has(m.category)) continue;
    if (inQuote(m)) continue;
    const word = text.slice(m.offset, m.offset + m.length);
    if (m.category === "TYPOS") {
      // Names of people, places and brands are capitalised; amounts carry digits or ₦.
      if (/^[A-Z]/.test(word) || /[\d₦$£€]/.test(word) || allow.has(word.toLowerCase())) continue;
    }
    const ctxStart = Math.max(0, m.offset - 30);
    out.push({
      rule: `lt:${m.rule}`,
      severity: ERROR_CATEGORIES.has(m.category) ? "error" : "warn",
      message: m.message + (m.replacements.length ? ` Suggest: ${m.replacements.map((x) => `"${x}"`).join(", ")}.` : ""),
      excerpt: (ctxStart ? "…" : "") + text.slice(ctxStart, m.offset + m.length + 30).replace(/\n/g, " "),
    });
  }
  return out;
}

/** Run fn over items with a fixed number in flight. */
export async function pool(items, size, fn) {
  const results = new Array(items.length);
  let next = 0;
  await Promise.all(Array.from({ length: size }, async () => {
    while (next < items.length) {
      const i = next++;
      results[i] = await fn(items[i], i);
    }
  }));
  return results;
}
