/**
 * THE WRITING DESK — TEXT KIT
 *
 * Everything the Content Writing course measures about a piece of writing,
 * in one pure module that runs identically in the browser (the Writing Desk's
 * live stats, style report and "Check my writing") and in Node (the content
 * validator proves every lab's model answer passes and its starter fails).
 *
 * Learners write Markdown: "## " headings divide a document into the parts a
 * brief asks for, "- " starts a bullet, "1. " a numbered step and "|" a table
 * row. A line wholly inside square brackets, such as "[Write your formal
 * version here]", is an instruction left in the starter and never counts as
 * the learner's writing.
 *
 * ── CHECKS ───────────────────────────────────────────────────────────────
 * A lab's checks are strings (lessons are pure JSON data). Each is the body of
 * a function that receives the learner's document as `doc`, the starter as
 * `starter`, and every helper in CHECK_SCOPE by name:
 *
 *   check: "return words(section('Formal')) >= 60 && grade(section('Formal')) <= 12;"
 *
 * Measurements are honest approximations: syllables are counted by rule (as
 * the Hemingway Editor and most readability tools do), and passive voice is
 * found by pattern (a form of "be" followed by a past participle). Checks
 * leave a margin for that.
 *
 * CLIENT-SAFE. No answers live here.
 */

/* ── Cleaning ──────────────────────────────────────────────────────────── */

/** Starter instructions ("[Write here]"), HTML comments and \r removed. */
export function clean(text) {
  return String(text ?? "")
    .replace(/\r/g, "")
    .replace(/<!--[\s\S]*?-->/g, "")
    .split("\n")
    .filter((l) => !/^\s*\[[^\]]*\]\s*$/.test(l))
    .join("\n");
}

const isHeading = (l) => /^#{1,6}\s/.test(l);
const isTable = (l) => /^\s*\|/.test(l);
const isRule = (l) => /^\s*([-*_])(\s*\1){2,}\s*$/.test(l);
const isItem = (l) => /^\s*([-*+]|\d+[.)])\s+\S/.test(l);

/** Inline Markdown removed: links keep their text, emphasis marks go. */
export function inline(text) {
  return String(text ?? "")
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/`([^`]*)`/g, "$1")
    .replace(/(\*\*|__)(.+?)\1/g, "$2")
    .replace(/(^|[\s(])[*_]([^*_\n]+)[*_](?=[\s).,;:!?]|$)/g, "$1$2");
}

/**
 * The prose of a text as a list of units, each a paragraph or a list item,
 * with Markdown removed. Headings, tables and rules are not prose.
 */
export function units(text) {
  const out = [];
  let para = [];
  const flush = () => {
    if (para.length) out.push(para.join(" "));
    para = [];
  };
  for (const raw of clean(text).split("\n")) {
    const line = raw.trim();
    if (!line || isHeading(line) || isTable(line) || isRule(line)) {
      flush();
      continue;
    }
    if (isItem(line)) {
      flush();
      out.push(inline(line.replace(/^([-*+]|\d+[.)])\s+/, "")));
      continue;
    }
    para.push(inline(line.replace(/^>\s?/, "")));
  }
  flush();
  return out.map((u) => u.trim()).filter((u) => /[A-Za-z0-9]/.test(u));
}

/** The prose as plain text, each unit ending in a full stop if it had none. */
export function plain(text) {
  return units(text)
    .map((u) => (/[.!?…:]["'”’)]*$/.test(u) ? u : u + "."))
    .join("\n");
}

/* ── Words and sentences ───────────────────────────────────────────────── */

const WORD = /[A-Za-z0-9À-ɏ₦$£€%'’-]+/g;

/** The words of a text (Markdown removed), as written. */
export function wordList(text) {
  return (plain(text).match(WORD) || []).filter((w) => /[A-Za-z0-9]/.test(w));
}

/** Number of words. */
export function words(text) {
  return wordList(text).length;
}

const ABBREV = /\b(Mr|Mrs|Ms|Dr|Prof|St|No|Nos|Ltd|Inc|Co|Corp|vs|etc|approx|Jan|Feb|Mar|Apr|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec|Fig|Ave|Rd|Plc|Engr|Sen|Hon|Gov|Rev|Capt|Sgt|Col|Gen|Jr|Sr)\./g;

/** The sentences of a text. Abbreviations such as "Dr." and "e.g." do not end one. */
export function sentences(text) {
  const out = [];
  for (const unit of plain(text).split("\n")) {
    const guarded = unit
      .replace(ABBREV, "$1․")
      .replace(/\b(e\.g|i\.e|a\.m|p\.m|U\.S|U\.K)\./gi, (m) => m.replace(/\./g, "․"))
      .replace(/\b([A-Z])\.(?=\s?[A-Z]\.)/g, "$1․");
    const parts = guarded.split(/(?<=[.!?…]["'”’)]*)\s+(?=["'“‘(]*[A-Z0-9₦$£€])/);
    for (const p of parts) {
      const s = p.replace(/․/g, ".").trim();
      if (/[A-Za-z0-9]/.test(s)) out.push(s);
    }
  }
  return out;
}

/** Average words per sentence (0 for an empty text). */
export function avgSentence(text) {
  const s = sentences(text);
  return s.length ? words(text) / s.length : 0;
}

/** Word count of the longest sentence. */
export function longest(text) {
  return sentences(text).reduce((m, s) => Math.max(m, words(s)), 0);
}

/** Sentences longer than `limit` words. */
export function longSentences(text, limit = 25) {
  return sentences(text).filter((s) => words(s) > limit);
}

/* ── Readability ───────────────────────────────────────────────────────── */

/** Syllables in one word, by the rule most readability tools use. */
export function syllables(word) {
  let w = String(word).toLowerCase().replace(/[^a-z]/g, "");
  if (!w) return 0;
  if (w.length <= 3) return 1;
  w = w.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, "").replace(/^y/, "");
  const groups = w.match(/[aeiouy]{1,2}/g);
  return Math.max(1, groups ? groups.length : 1);
}

function counts(text) {
  const list = wordList(text).filter((w) => /[A-Za-z]/.test(w));
  const s = sentences(text).length;
  const syl = list.reduce((n, w) => n + syllables(w), 0);
  return { w: list.length, s, syl };
}

/**
 * Flesch Reading Ease: 206.835 − 1.015 × (words ÷ sentences) − 84.6 ×
 * (syllables ÷ words). Higher is easier; 60–70 is plain English.
 */
export function ease(text) {
  const { w, s, syl } = counts(text);
  if (!w || !s) return 0;
  return 206.835 - 1.015 * (w / s) - 84.6 * (syl / w);
}

/**
 * Flesch–Kincaid grade level: 0.39 × (words ÷ sentences) + 11.8 × (syllables
 * ÷ words) − 15.59. The years of schooling a reader needs; 7–9 suits a general
 * audience.
 */
export function grade(text) {
  const { w, s, syl } = counts(text);
  if (!w || !s) return 0;
  return 0.39 * (w / s) + 11.8 * (syl / w) - 15.59;
}

/** Minutes to read at 238 words a minute (a typical adult silent reading rate). */
export function readingMinutes(text) {
  return words(text) / 238;
}

/* ── Style ─────────────────────────────────────────────────────────────── */

const IRREGULAR =
  "known|shown|given|taken|done|made|seen|written|sent|paid|told|held|built|bought|brought|caught|chosen|drawn|driven|eaten|fallen|forgotten|found|frozen|gone|grown|heard|hidden|hit|hurt|kept|laid|led|left|lent|lost|meant|met|put|read|rung|run|said|set|shut|sold|spent|spoken|stolen|struck|sworn|taught|thought|thrown|understood|woken|won|worn|beaten|begun|bitten|blown|broken|cut|dealt|fed|felt|fought|forbidden|forgiven|hung|let|lit|overtaken|quit|ridden|risen|shaken|shot|sung|sunk|slain|sped|split|spread|stuck|stung|torn|undertaken|withdrawn|upheld|overseen|misled|mistaken|rewritten|proofread";
const NOT_PASSIVE =
  /^(interested|tired|excited|worried|pleased|married|located|based|supposed|used|concerned|qualified|experienced|skilled|committed|dedicated|determined|satisfied|disappointed|surprised|confused|bored|scared|annoyed|delighted|thrilled|amazed|ashamed|aged|talented|gifted|detailed|advanced|limited|crowded|complicated|sophisticated|varied|unexpected|unrelated|unemployed|employed|self-employed|retired|engaged|need|seed|feed|bleed|speed|red|bed|shed|wed|exceed|proceed|succeed)$/i;

/**
 * Probable passive constructions: a form of "be" (or "get"), an optional
 * adverb, then a past participle. "The report was written by Ada." Returns
 * the matched phrases. Adjectives that look like participles ("I am tired")
 * are left out.
 */
export function passive(text) {
  const re = new RegExp(
    String.raw`\b(am|is|are|was|were|be|been|being|get|gets|got|gotten|getting)\s+(?:(?:not|never|also|already|often|always|just|still|being)\s+)?(?:\w+ly\s+)?(\w+ed|${IRREGULAR})\b`,
    "gi"
  );
  const out = [];
  for (const m of plain(text).matchAll(re)) {
    if (!NOT_PASSIVE.test(m[2])) out.push(m[0]);
  }
  return out;
}

const NOT_ADVERB =
  /^(only|family|early|reply|apply|supply|daily|weekly|monthly|yearly|quarterly|hourly|nightly|likely|unlikely|july|italy|fly|ally|rely|holy|belly|jelly|bully|friendly|lovely|ugly|silly|costly|timely|elderly|lonely|curly|assembly|anomaly|emily|sally|kelly|lily|billy|molly|holly|reply|imply|comply|multiply|butterfly|rally|tally|jolly|folly|smelly|lowly|homely|orderly|scholarly|bodily|courtly|deadly|ghastly|kindly|manly|motherly|fatherly|sisterly|brotherly|neighbourly|neighborly|cowardly|leisurely|wobbly|bubbly|chilly|hilly|frilly|gully|tully|nelly|ally|rally|bly|ply|sly|wily|oily|wily|surly|burly|early|pearly|yearly|underbelly|anomaly|monopoly|melancholy|ally|italy|sicily|lily|lilly|billy|dolly|polly|wally|gully|bully|sully|tally|valley)$/i;

/** Adverbs ending in "-ly" ("really", "quickly"), the words editors cut first. */
export function adverbs(text) {
  return wordList(text).filter((w) => /^[A-Za-z]{4,}ly$/.test(w) && !NOT_ADVERB.test(w));
}

/** Wordy phrases and filler words, each with a plainer replacement. */
export const WORDY = [
  ["in order to", "to"],
  ["due to the fact that", "because"],
  ["owing to the fact that", "because"],
  ["in spite of the fact that", "although"],
  ["at this point in time", "now"],
  ["at the present time", "now"],
  ["in the event that", "if"],
  ["for the purpose of", "to / for"],
  ["with regard to", "about"],
  ["with reference to", "about"],
  ["in regard to", "about"],
  ["in relation to", "about"],
  ["a large number of", "many"],
  ["a majority of", "most"],
  ["is able to", "can"],
  ["are able to", "can"],
  ["has the ability to", "can"],
  ["make a decision", "decide"],
  ["take into consideration", "consider"],
  ["give consideration to", "consider"],
  ["it is important to note that", "(cut it)"],
  ["it should be noted that", "(cut it)"],
  ["needless to say", "(cut it)"],
  ["each and every", "each / every"],
  ["first and foremost", "first"],
  ["end result", "result"],
  ["past history", "history"],
  ["future plans", "plans"],
  ["advance planning", "planning"],
  ["close proximity", "near"],
  ["basic fundamentals", "fundamentals"],
  ["completely finished", "finished"],
  ["free gift", "gift"],
  ["revert back", "reply / return"],
  ["return back", "return"],
  ["repeat again", "repeat"],
  ["kindly do the needful", "please (say exactly what)"],
  ["please find attached", "I have attached"],
  ["as per", "according to / as"],
  ["very", "(a stronger word)"],
  ["really", "(cut it)"],
  ["actually", "(cut it)"],
  ["basically", "(cut it)"],
  ["literally", "(cut it)"],
  ["just", "(often cut it)"],
  ["quite", "(cut it)"],
  ["somewhat", "(cut it)"],
];

/** The wordy phrases a text uses, as [phrase, replacement] pairs, once each. */
export function wordy(text) {
  const t = " " + plain(text).toLowerCase().replace(/\s+/g, " ") + " ";
  return WORDY.filter(([p]) => new RegExp(`[^a-z]${p.replace(/ /g, "\\s+")}[^a-z]`).test(t));
}

/**
 * Phrases that mark text as unedited AI output or tired copy. Module 18
 * teaches why; the style report flags them everywhere.
 */
export const AI_TELLS = [
  "delve",
  "in today's fast-paced world",
  "in today's digital age",
  "in the ever-evolving",
  "ever-changing landscape",
  "tapestry",
  "unlock the power",
  "unleash",
  "game-changer",
  "game changer",
  "elevate your",
  "seamless",
  "navigate the complexities",
  "it's important to note",
  "it is important to note",
  "a testament to",
  "embark on a journey",
  "look no further",
  "in conclusion",
  "whether you're a",
  "rest assured",
  "cutting-edge",
  "revolutionize",
  "revolutionise",
  "harness the power",
  "dive into",
  "dive deep",
  "realm",
  "plethora",
  "myriad of",
  "furthermore",
  "moreover",
];

/** The tired phrases a text contains, once each. */
export function aiTells(text) {
  const t = plain(text).toLowerCase().replace(/[’]/g, "'");
  return AI_TELLS.filter((p) => t.includes(p));
}

/** How many times the text says "you" or "your" (reader-focused writing). */
export function you(text) {
  return wordList(text).filter((w) => /^(you|your|yours|you're|you'll|you've|you'd|yourself)$/i.test(w.replace(/’/g, "'"))).length;
}

/** How many times the text talks about the writer ("we", "our", "I", "my"). */
export function self(text) {
  return wordList(text).filter((w) => /^(we|our|ours|us|i|my|me|we're|we've|we'll|i'm|i've|i'll)$/i.test(w.replace(/’/g, "'"))).length;
}

/* ── Structure ─────────────────────────────────────────────────────────── */

const lineList = (text) => clean(text).split("\n");

/**
 * The text under the first heading (level 2 to 6; the "# " title never
 * matches) that STARTS with `heading`, case-insensitive, up to the next
 * heading of the same or a higher level. null when there is no such heading.
 */
export function sectionOf(text, heading) {
  const want = String(heading).toLowerCase().trim();
  const out = [];
  let level = 0;
  for (const l of lineList(text)) {
    const m = l.match(/^(#{1,6})\s+(.*)$/);
    if (m) {
      if (level && m[1].length <= level) break;
      if (!level && m[1].length >= 2 && m[2].trim().toLowerCase().startsWith(want)) {
        level = m[1].length;
        continue;
      }
    }
    if (level) out.push(l);
  }
  return level ? out.join("\n").trim() : null;
}

/** Every heading of exactly that level, e.g. headingsOf(doc, 2). */
export function headingsOf(text, level) {
  return lineList(text)
    .filter((l) => new RegExp(`^#{${level}}\\s`).test(l))
    .map((l) => l.replace(/^#+\s*/, "").trim());
}

/** Every level-2+ section whose heading starts with `prefix`, as {heading, text}. */
export function sectionsOf(text, prefix) {
  const want = String(prefix).toLowerCase();
  const out = [];
  const ls = lineList(text);
  ls.forEach((l, i) => {
    const m = l.match(/^(#{2,6})\s+(.*)$/);
    if (!m || !m[2].trim().toLowerCase().startsWith(want)) return;
    const body = [];
    for (const n of ls.slice(i + 1)) {
      const h = n.match(/^(#{1,6})\s/);
      if (h && h[1].length <= m[1].length) break;
      body.push(n);
    }
    out.push({ heading: m[2].trim(), text: body.join("\n").trim() });
  });
  return out;
}

/** The "- " or "* " bullets in a text, Markdown removed. */
export function bullets(text) {
  return clean(text)
    .split("\n")
    .filter((l) => /^\s*[-*+]\s+\S/.test(l))
    .map((l) => inline(l.replace(/^\s*[-*+]\s+/, "")).trim())
    .filter((l) => !/^_+$|^\.\.\.$/.test(l));
}

/** The "1. " numbered items in a text. */
export function numbered(text) {
  return clean(text)
    .split("\n")
    .filter((l) => /^\s*\d+[.)]\s+\S/.test(l))
    .map((l) => inline(l.replace(/^\s*\d+[.)]\s+/, "")).trim());
}

/** The body rows of the first Markdown table, as arrays of trimmed cells. */
export function rows(text) {
  const ls = clean(text).split("\n").filter((l) => isTable(l));
  return ls
    .slice(2)
    .map((l) => l.trim().replace(/^\||\|$/g, "").split("|").map((c) => inline(c).trim()))
    .filter((r) => r.some((c) => c));
}

/** The header cells of the first Markdown table. */
export function columns(text) {
  const l = clean(text).split("\n").find((x) => isTable(x));
  return l ? l.trim().replace(/^\||\|$/g, "").split("|").map((c) => c.trim()) : [];
}

/** The prose paragraphs of a text (list items excluded). */
export function paragraphs(text) {
  const out = [];
  let para = [];
  for (const raw of clean(text).split("\n")) {
    const l = raw.trim();
    if (!l || isHeading(l) || isTable(l) || isItem(l) || isRule(l)) {
      if (para.length) out.push(inline(para.join(" ")));
      para = [];
      continue;
    }
    para.push(l.replace(/^>\s?/, ""));
  }
  if (para.length) out.push(inline(para.join(" ")));
  return out.filter((p) => /[A-Za-z0-9]/.test(p));
}

/** The non-empty lines of a text, trimmed. */
export function lines(text) {
  return clean(text).split("\n").map((l) => l.trim()).filter(Boolean);
}

/** Markdown links as {text, url}. */
export function links(text) {
  return [...clean(text).matchAll(/\[([^\]]+)\]\(([^)\s]+)[^)]*\)/g)].map((m) => ({ text: m[1], url: m[2] }));
}

/**
 * The value after "Label:" on a line of the text ("Audience: new parents"),
 * with list markers and bold removed. null when there is no such line.
 */
export function field(text, label) {
  const want = String(label).toLowerCase();
  for (const l of clean(text).split("\n")) {
    const t = inline(l.replace(/^\s*([-*+]|\d+[.)])\s+/, "")).trim();
    const i = t.indexOf(":");
    if (i > 0 && t.slice(0, i).trim().toLowerCase() === want) return t.slice(i + 1).trim();
  }
  return null;
}

/** Characters in the text once Markdown is removed (spaces included). */
export function chars(text) {
  return units(text).join(" ").length;
}

/** The first number in the text (commas ignored), or NaN. */
export function num(text) {
  const m = String(text ?? "").replace(/,/g, "").match(/-?\d+(\.\d+)?/);
  return m ? Number(m[0]) : NaN;
}

/** Every number in the text (commas ignored). */
export function nums(text) {
  return (String(text ?? "").replace(/,/g, "").match(/-?\d+(\.\d+)?/g) || []).map(Number);
}

const asRegex = (p) => (p instanceof RegExp ? new RegExp(p.source, p.flags.includes("g") ? p.flags : p.flags + "g") : new RegExp(String(p).replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi"));

/** True when the text contains the phrase (case-insensitive) or matches the pattern. */
export function has(text, pattern) {
  return count(text, pattern) > 0;
}

/** How many times the phrase (case-insensitive) or pattern occurs. */
export function count(text, pattern) {
  return (String(text ?? "").match(asRegex(pattern)) || []).length;
}

/** True when the text contains at least `n` of the phrases or patterns. */
export function hasAny(text, list, n = 1) {
  return list.filter((p) => has(text, p)).length >= n;
}

/**
 * The share (0 to 1) of the first text's three-word sequences that also occur
 * in the second. A rewrite that keeps most of the original scores high.
 */
export function overlap(a, b) {
  const tri = (t) => {
    const w = wordList(t).map((x) => x.toLowerCase());
    const out = [];
    for (let i = 0; i + 2 < w.length; i++) out.push(w.slice(i, i + 3).join(" "));
    return out;
  };
  const ta = tri(a);
  if (!ta.length) return 0;
  const tb = new Set(tri(b));
  return ta.filter((x) => tb.has(x)).length / ta.length;
}

/** The first sentence of a text ("" when there is none). */
export function firstSentence(text) {
  return sentences(text)[0] || "";
}

/** The last sentence of a text. */
export function lastSentence(text) {
  const s = sentences(text);
  return s[s.length - 1] || "";
}

/** True when a line starts with a verb from the list (a call to action). */
export const ACTION_VERBS =
  /^(get|start|join|book|buy|order|shop|download|subscribe|sign up|register|reserve|claim|try|call|chat|send|reply|apply|enrol|enroll|learn|discover|see|read|watch|request|schedule|visit|grab|save|create|build|find|explore|contact|message|pay|upgrade|renew|confirm|complete|share|tell|take|choose|pick|enter|add|use|let|ask|check|compare|donate|vote|follow|open|activate|redeem|unlock|secure|plan|talk|hire|meet|test|attend|lock in|place|make|come|give|return|update|verify|review|submit|accept|approve|support|fill|write|start your|get your|dial|press|text|tap|flag|switch|go|bring|keep|stay|install|log in|sign in|click|scan|drop|walk|drive|ride|catch|turn|hurry|act|stop|remember|email|whatsapp|dm|treat|look|head|pop|swing|step|imagine|picture|tag|comment|like|mention|leave|drop us|mark|switch on|turn on|set|return|reserve|calculate|estimate|work out|count|list|note|prepare|practise|practice|publish|download)\b/i;

/** True when the text starts with an action verb ("Book your table"). */
export function isAction(text) {
  return ACTION_VERBS.test(inline(String(text ?? "")).trim().replace(/^["'“‘]/, ""));
}

/* ── The style report shown on the Writing Desk ───────────────────────── */

/** Everything the desk shows about a draft, recomputed as the learner types. */
export function stats(text) {
  const w = words(text);
  const s = sentences(text);
  return {
    words: w,
    sentences: s.length,
    paragraphs: paragraphs(text).length,
    avgSentence: s.length ? w / s.length : 0,
    grade: grade(text),
    ease: ease(text),
    minutes: readingMinutes(text),
    long: s.filter((x) => words(x) > 25),
    passive: passive(text),
    adverbs: adverbs(text),
    wordy: wordy(text),
    tells: aiTells(text),
  };
}

/* ── Running a lab's checks ────────────────────────────────────────────── */

/**
 * Every helper a check can call by name. Helpers that read a document take
 * the learner's document by default, so `section('Goals')` and
 * `headings(2)` need no document argument.
 */
export function checkScope(doc, starter = "") {
  return {
    doc,
    starter,
    section: (h, d = doc) => sectionOf(d, h),
    sections: (p, d = doc) => sectionsOf(d, p),
    headings: (n, d = doc) => headingsOf(d, n),
    clean,
    plain,
    units,
    words,
    wordList,
    sentences,
    avgSentence,
    longest,
    longSentences,
    syllables,
    ease,
    grade,
    readingMinutes,
    passive,
    adverbs,
    wordy,
    aiTells,
    you,
    self,
    bullets,
    numbered,
    rows,
    columns,
    paragraphs,
    lines,
    links,
    field,
    chars,
    num,
    nums,
    has,
    count,
    hasAny,
    overlap,
    firstSentence,
    lastSentence,
    isAction,
  };
}

const compiled = new Map();

function compile(names, body) {
  const key = names.join(",") + "\u0000" + body;
  if (!compiled.has(key)) compiled.set(key, new Function(...names, `"use strict";\n${body}`));
  return compiled.get(key);
}

/**
 * Runs a lab's checks against a document. Returns one result per test:
 * { index, label, passed, fail, error }. A check that throws fails, and the
 * error is kept for the content validator (learners see the `fail` text).
 */
export function runWritingChecks(tests, doc, starter = "") {
  const scope = checkScope(String(doc ?? ""), String(starter ?? ""));
  const names = Object.keys(scope);
  const values = names.map((n) => scope[n]);
  return (tests || []).map((t, index) => {
    try {
      const passed = Boolean(compile(names, t.check)(...values));
      return { index, label: t.label, passed, fail: t.fail };
    } catch (err) {
      return { index, label: t.label, passed: false, fail: t.fail, error: String(err?.message || err) };
    }
  });
}
