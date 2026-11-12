/**
 * CLARITY LAYER — STEP BY STEP: NOTHING USED BEFORE IT IS TAUGHT
 *
 * A learner must never meet a word, an abbreviation or a task the course has
 * not prepared them for. Three checks, all deterministic:
 *
 * 1. PRACTICE AFTER TEACHING. A lesson may not open with its lab, and a lab
 *    should follow at least one worked example (a sample, an example, a table
 *    or a decision) in the same lesson.
 *
 * 2. ABBREVIATIONS ARE SPELLED OUT ON FIRST USE. The first time "SEO" or "CTA"
 *    appears in the course, the same text must expand it: "search engine
 *    optimisation (SEO)", "SEO (search engine optimisation)" or "SEO stands
 *    for / means ...".
 *
 * 3. THE TERM LEDGER. scripts/clarity/ledger/<course>.json maps each course
 *    term to the atom that teaches it. Any earlier use of the term fails. The
 *    writer adds an entry whenever a lesson teaches a specialist term. This is the
 *    same idea as lib/academy/checkTerms.mjs for Mathematics.
 *
 * Lesson titles and intros may NAME the topic their own lesson teaches.
 */
import { existsSync, readFileSync } from "node:fs";
import { collapseQuotes } from "./plain.mjs";

const LEDGER_DIR = new URL("./ledger/", import.meta.url);
const ALLOW_DIR = new URL("./allow/", import.meta.url);

export function readJson(url, fallback) {
  try {
    return existsSync(url) ? JSON.parse(readFileSync(url, "utf8")) : fallback;
  } catch (e) {
    console.error(`  Could not read ${url.pathname}: ${e.message}`);
    return fallback;
  }
}

export const ledgerUrl = (key) => new URL(`${key}.json`, LEDGER_DIR);
export const allowUrl = (key) => new URL(`${key}.json`, ALLOW_DIR);

export function loadLedger(key) {
  return readJson(ledgerUrl(key), { terms: {} });
}

export function loadAllow(key) {
  const a = readJson(allowUrl(key), {});
  return {
    words: new Set((a.words || []).map((w) => w.toLowerCase())),
    abbreviations: new Set([...COMMON_ABBREVIATIONS, ...(a.abbreviations || [])]),
    ignore: a.ignore || [],
    /** Roadmap lessons that NAME later topics as signposts; their uses do not count for the ledger. */
    preview: new Set(a.previewLessons || []),
  };
}

/** Abbreviations every reader already knows, and capitals used for emphasis. */
const COMMON_ABBREVIATIONS = [
  "I", "OK", "UK", "US", "USA", "USB", "PDF", "CV", "AI", "TV", "ID", "PM", "AM", "FAQ", "FAQs",
  "NOT", "DO", "DON'T", "ALL", "NEVER", "ONE", "NO", "YES", "AND", "OR", "BUT", "YOU", "THE", "A",
  "PS", "NB", "IT", "MS", "PC", "SMS", "GSM", "ATM", "POS", "NIN", "BVN", "JAMB", "WAEC", "NYSC",
];

/** Position of a segment in teaching order, comparable with atom order numbers. */
export function positionOf(seg, atomOrder, lessonRange) {
  if (seg.kind === "atom") return atomOrder.get(seg.atomId) ?? 0;
  const [first, last] = lessonRange.get(seg.lessonId) || [0, 0];
  return seg.kind === "question" ? last + 0.5 : first - 0.5;
}

function termRe(term) {
  const t = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/\s+/g, "\\s+");
  return new RegExp(`(?<![A-Za-z])${t}(s|es)?(?![A-Za-z])`, "i");
}

function expands(text, abbr) {
  const a = abbr.replace(/s$/, "");
  return new RegExp(`\\(\\s*${a}s?\\s*\\)|\\b${a}s?\\s*\\([a-z]|\\b${a}s?[^.]{0,20}\\b(stands for|means|is short for|is the short form)`, "i").test(text);
}

/**
 * All progression findings, as { sid, rule, severity, message, excerpt }.
 * `segments` and `atoms` come from extract(); `modules` holds the lessons.
 */
export function progressionFindings({ modules, segments, atoms }, ledger, allow, only = null) {
  const out = [];
  const atomOrder = new Map(atoms.map((a) => [a.id, a.order]));
  const lessonRange = new Map();
  for (const a of atoms) {
    const r = lessonRange.get(a.lessonId);
    lessonRange.set(a.lessonId, r ? [r[0], a.order] : [a.order, a.order]);
  }
  const atomLesson = new Map(atoms.map((a) => [a.id, a.lessonId]));
  const inScope = (moduleId) => !only || only.includes(moduleId);

  // 1. Practice after teaching.
  for (const mod of modules) {
    if (!inScope(mod.id)) continue;
    for (const lesson of mod.lessons) {
      lesson.atoms.forEach((atom, i) => {
        if (!atom.writingLab && !atom.codeChallenge && !atom.webLab) return;
        const sid = `${lesson.id}|${atom.id}|lab`;
        const ownWords = (atom.explain || "").split(/\s+/).length;
        if (i === 0 && ownWords < 40) {
          out.push({ sid, rule: "lab-first", severity: "error", message: "The lesson opens with its practice. Teach the skill in an atom before the lab.", excerpt: atom.title });
          return;
        }
        const before = lesson.atoms.slice(0, i + 1);
        const shown = before.some((a) => a.samples || a.example || a.table || a.decision || (a.explain && /for example|e\.g\.|such as|:\s*"/i.test(a.explain)));
        if (!shown) out.push({ sid, rule: "no-worked-example", severity: "warn", message: "No worked example before this lab in the lesson. Show a finished example first, then ask the learner to do it.", excerpt: atom.title });
      });
    }
  }

  // 2. Abbreviations spelled out on first use (walk the whole course in order).
  const seen = new Set();
  const ordered = segments
    .filter((s) => s.role === "teach" || s.role === "label" || s.role === "brief")
    .filter((s) => !/^decision\.options\.|^options\./.test(s.path))
    .map((s) => ({ s, pos: positionOf(s, atomOrder, lessonRange) }))
    .sort((a, b) => a.pos - b.pos);
  for (const { s } of ordered) {
    const text = collapseQuotes(s.text);
    for (const m of text.matchAll(/(?<![A-Za-z'’|{*])([A-Z]{2,6})(s?)(?![A-Za-z0-9'’|}*:])/g)) {
      const abbr = m[1];
      if (abbr === "QUOTE") continue;
      if (allow.abbreviations.has(abbr) || seen.has(abbr)) continue;
      seen.add(abbr);
      if (!expands(s.text, abbr) && inScope(s.moduleId)) {
        out.push({ sid: s.sid, rule: "abbreviation", severity: s.role === "brief" ? "warn" : "error", message: `"${abbr}" is used here for the first time in the course without being spelled out. Write the full words once, then the short form in brackets.`, excerpt: abbr });
      }
    }
  }

  // 3. The term ledger.
  for (const [term, entry] of Object.entries(ledger.terms || {})) {
    const home = atomOrder.get(entry.atom);
    if (home === undefined) {
      out.push({ sid: `-|${entry.atom}|ledger`, rule: "ledger-missing", severity: "error", message: `Ledger says "${term}" is taught in ${entry.atom}, which is not an atom in this course.`, excerpt: term });
      continue;
    }
    const homeLesson = atomLesson.get(entry.atom);
    const re = termRe(term);
    const early = ordered.find(({ s, pos }) =>
      pos < home &&
      !(s.kind === "lesson" && s.lessonId === homeLesson) &&
      !allow.preview.has(s.lessonId) &&
      re.test(collapseQuotes(s.text)));
    if (early && inScope(early.s.moduleId)) {
      out.push({ sid: early.s.sid, rule: "term-before-taught", severity: "error", message: `"${term}" is used here but not taught until ${entry.atom}. Explain it here in one plain sentence, or move the teaching earlier.`, excerpt: term });
    }
  }

  return out;
}
