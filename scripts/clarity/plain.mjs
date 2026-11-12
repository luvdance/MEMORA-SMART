/**
 * CLARITY LAYER — PLAIN ENGLISH RULES FOR READERS OF ENGLISH AS A SECOND LANGUAGE
 *
 * Most academy learners read English as a second or third language. They read
 * every word literally, so the things that hurt them most are not grammar
 * mistakes: they are long sentences with several clauses, idioms, sentences
 * that start with "It" or "This" when it is not clear what "it" is, and filler
 * words such as "just" that change meaning in ways a dictionary does not show.
 *
 * These rules are deterministic and free, so they run on every check. They
 * measure text the same way the Content Writing course teaches learners to
 * measure their own (src/academy/writing/textkit.js).
 *
 * Quoted text is an example, not the course speaking, so it is collapsed to
 * one word before sentence length is counted and ignored by the word rules.
 *
 * Each finding: { rule, severity: "error" | "warn", message, excerpt }.
 */
import { sentences, words, grade, plain, passive, AI_TELLS } from "../../src/academy/writing/textkit.js";

/** Quoted spans: "...", “...”, and ‘...’ when the opening mark follows a space. */
const QUOTED = /"[^"\n]{1,400}"|“[^”\n]{1,400}”|(?<=^|[\s(])‘[^’\n]{1,400}’/g;

/** The text with each quoted example replaced by one placeholder word. */
export function collapseQuotes(text) {
  // A quote that ended a sentence keeps the full stop, so sentences still split.
  return text.replace(QUOTED, (q) => (/[.!?…]["”’]$/.test(q) ? "QUOTE." : "QUOTE"));
}

/** Character ranges [start, end) of quoted spans, for filtering grammar matches. */
export function quotedRanges(text) {
  return [...text.matchAll(QUOTED)].map((m) => [m.index, m.index + m[0].length]);
}

export const LIMITS = {
  /** Words in one sentence before it is flagged. The course asks learners for an average of 22 or fewer. */
  sentenceWarn: 25,
  sentenceError: 35,
  /** Flesch–Kincaid grade above which a long explanation is flagged. */
  grade: 12,
};

/** Idioms and figures of speech a literal reader cannot decode. */
export const IDIOMS = [
  "a piece of cake", "piece of cake", "hit the ground running", "ballpark", "on the same page",
  "in a nutshell", "the bottom line is", "touch base", "low-hanging fruit", "move the needle",
  "back to square one", "bite the bullet", "cut corners", "go the extra mile", "nail it", "nailed it",
  "on the fly", "out of the box", "under the hood", "boils down to", "at the end of the day",
  "by and large", "off the top of your head", "spot on", "sit on the fence", "no-brainer",
  "deal-breaker", "get the hang of", "a long shot", "the elephant in the room", "beat around the bush",
  "hit the nail on the head", "the ball is in your court", "jump the gun", "kill two birds",
  "learn the ropes", "think outside the box", "up in the air", "word of mouth" /* fine, but explain */,
  "call it a day", "cut to the chase", "from scratch", "in the same boat", "keep an eye on",
  "on the ball", "pull your weight", "raise the bar", "rule of thumb", "set in stone", "square one",
  "take it with a grain of salt", "the big picture", "tip of the iceberg", "wear many hats",
  "bells and whistles", "red flag", "silver bullet", "sweet spot", "heavy lifting", "lion's share",
  "food for thought", "a far cry from", "falls flat", "fall flat", "pays off", "pay off",
  "land a client", "lands the client", "hooked", "a foot in the door", "goes a long way",
];

/** Clichés that mark unedited AI text. "Furthermore" and "moreover" are left to the writer. */
const AI_HARD = AI_TELLS.filter((p) => !["furthermore", "moreover", "in conclusion"].includes(p));

/** Words that talk down to a struggling reader or change meaning in a way a dictionary will not show. */
const FILLER = ["simply", "obviously", "of course", "basically", "just"];

const VAGUE_START = /^(This|That|These|Those|It)\s+(is|was|are|were|means|meant|makes|made|helps|shows|showed|lets|gives|gave|can|could|will|would|does|did|matters|works|happens|keeps|turns|tells)\b/;

function wordRe(phrase) {
  return new RegExp(`(?<![A-Za-z'’-])${phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/ /g, "\\s+")}(?![A-Za-z'’-])`, "i");
}

function short(s, n = 90) {
  return s.length > n ? s.slice(0, n - 1) + "…" : s;
}

/** Which rules apply to a role. */
const ROLE_RULES = {
  teach: { length: true, words: true, structure: true },
  label: { length: true, words: false, structure: false },
  brief: { length: true, words: false, structure: false },
  example: { length: false, words: false, structure: false },
  wrong: { length: true, words: false, structure: false },
};

export function plainFindings(segment) {
  const rules = ROLE_RULES[segment.role] || ROLE_RULES.teach;
  const out = [];
  const collapsed = collapseQuotes(plain(segment.text));
  const sents = sentences(collapsed);

  if (rules.length) {
    for (const s of sents) {
      const n = words(s);
      if (n > LIMITS.sentenceError) {
        out.push({ rule: "long-sentence", severity: "error", message: `${n} words in one sentence. Split it: one idea per sentence, ${LIMITS.sentenceWarn} words at most.`, excerpt: short(s) });
      } else if (n > LIMITS.sentenceWarn) {
        out.push({ rule: "long-sentence", severity: "warn", message: `${n} words in one sentence. Aim for ${LIMITS.sentenceWarn} or fewer.`, excerpt: short(s) });
      }
    }
  }

  if (rules.structure) {
    for (const s of sents) {
      const semis = (s.match(/;/g) || []).length;
      if (semis >= 2) out.push({ rule: "semicolon-chain", severity: "warn", message: "Several semicolons in one sentence. Use separate sentences.", excerpt: short(s) });
      if (/\s[—–]\s|—/.test(s)) out.push({ rule: "dash-aside", severity: "warn", message: "A dash aside is hard to follow in a second language. Use a full stop or brackets.", excerpt: short(s) });
      const commas = (s.match(/,/g) || []).length;
      const chunks = s.split(",").map((c) => words(c)).sort((a, b) => a - b);
      const isList = chunks[Math.floor(chunks.length / 2)] <= 4;
      if (commas >= 4 && words(s) > 22 && !isList) out.push({ rule: "many-clauses", severity: "warn", message: `${commas} commas in one sentence. Break it into steps.`, excerpt: short(s) });
      if (/\bnot\s+(un|in|im|non)\w+|\bnot\s+without\b|\bnever\s+not\b/i.test(s)) out.push({ rule: "double-negative", severity: "warn", message: "Double negative. Say it positively.", excerpt: short(s) });
    }
    const first = sents[0] || "";
    if (VAGUE_START.test(first) && /^(explain|intro|why|analogy|mistake|decision\.scenario|task\.intro|writingLab\.task)$/.test(segment.path)) {
      out.push({ rule: "vague-start", severity: "warn", message: `Starts with "${first.split(/\s+/)[0]}" but nothing before it says what that is. Name the thing.`, excerpt: short(first) });
    }
    const pv = passive(collapsed);
    if (pv.length >= 3) out.push({ rule: "passive", severity: "warn", message: `${pv.length} passive phrases (${pv.slice(0, 3).join("; ")}). Say who does what.`, excerpt: "" });
    const w = words(collapsed);
    if (w >= 40 && grade(collapsed) > LIMITS.grade) {
      out.push({ rule: "hard-reading", severity: "warn", message: `Reading grade ${grade(collapsed).toFixed(1)}. Use shorter sentences and everyday words (aim for 9 or below).`, excerpt: "" });
    }
  }

  if (rules.words) {
    const t = collapsed;
    for (const p of IDIOMS) if (wordRe(p).test(t)) out.push({ rule: "idiom", severity: "warn", message: `Idiom "${p}". A literal reader cannot decode it; say what it means.`, excerpt: p });
    for (const p of AI_HARD) if (wordRe(p).test(t)) out.push({ rule: "ai-phrase", severity: "error", message: `"${p}" is a cliché that marks unedited AI text. Say the plain thing.`, excerpt: p });
    for (const p of FILLER) if (wordRe(p).test(t)) out.push({ rule: "filler", severity: "warn", message: `"${p}" adds nothing and can make a struggling reader feel slow. Cut it or say exactly what you mean.`, excerpt: p });
  }
  return out;
}
