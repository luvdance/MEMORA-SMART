/**
 * TYPING DOJO SELF-TEST — `npm run test:typing`
 *
 * Exercises the same pure modules the app runs: the scoring engine, the
 * keyboard model, every lesson generator and the profile update. The checks
 * that matter most:
 *   - WPM and accuracy follow the hiring-test definitions exactly;
 *   - every lesson's text is typable on a US keyboard;
 *   - the letter stages never ask for a letter that has not been taught;
 *   - stars pay XP once, and accuracy below 80% earns nothing for speed.
 */

import { applyKey, createRun, runStats, typingLevel, xpForRun, weakestKeys, keyResults, speedTier, isVerifiedRun } from "../../../src/academy/typing/engine.js";
import { strokeFor, isTypable, LAYOUT } from "../../../src/academy/typing/keyboard.js";
import { LESSONS, STAGES, starsFor, isUnlocked, nextLesson } from "../../../src/academy/typing/curriculum.js";
import { rng, wordStream, punctuatedStream, numberStream, dataEntryLine, weakKeyDrill, gameWords, CODE_SNIPPETS, PASSAGES, BOSS_PHRASES } from "../../../src/academy/typing/text.js";
import { emptyProfile, recordSession } from "../../../src/academy/typing/session.js";
import { ACHIEVEMENTS } from "../../../src/academy/typing/achievements.js";

let failures = 0;
let passes = 0;
function check(name, ok, detail = "") {
  if (ok) passes++;
  else {
    failures++;
    console.error(`  ✗ ${name}${detail ? ` — ${detail}` : ""}`);
  }
}

/** Type `keys` one per `gapMs`, starting at t=0. */
function typeAll(run, keys, gapMs = 200) {
  let t = 0;
  for (const k of keys) {
    applyKey(run, k, t);
    t += gapMs;
  }
  return t - gapMs;
}

/* ── Engine ─────────────────────────────────────────────────────────────── */
console.log("engine");
{
  const run = createRun("hello world");
  typeAll(run, "hello world", 1000); // 11 keys, last at 10s
  const s = runStats(run, 10000);
  check("perfect run completes", run.done);
  check("WPM = correct chars / 5 / minutes", s.wpm === 13.2, `got ${s.wpm}`);
  check("accuracy 100% on a clean run", s.accuracy === 100);
}
{
  const run = createRun("ab", { mode: "strict" });
  applyKey(run, "x", 0);
  check("strict: a wrong key does not advance", run.pos === 0);
  applyKey(run, "a", 100);
  check("strict: corrected char is marked fixed", run.marks[0] === "fixed");
  applyKey(run, "b", 200);
  const s = runStats(run, 200);
  check("strict: accuracy counts the miss", Math.abs(s.accuracy - 66.7) < 0.05, `got ${s.accuracy}`);
  check("strict: errors counted", s.errors === 1);
}
{
  const run = createRun("cat", { mode: "free" });
  applyKey(run, "c", 0);
  applyKey(run, "x", 100);
  check("free: a wrong key advances", run.pos === 2 && run.marks[1] === "bad");
  applyKey(run, "Backspace", 150);
  check("free: backspace steps back", run.pos === 1 && run.marks[1] === "");
  applyKey(run, "a", 200);
  applyKey(run, "t", 300);
  const s = runStats(run, 300);
  check("free: fixed run completes", run.done);
  check("free: accuracy keeps the error", s.accuracy === 75, `got ${s.accuracy}`);
  check("free: all characters count once fixed", s.correctChars === 3);
}
{
  const run = createRun("a {\n  b\n}", { autoIndent: true });
  typeAll(run, "a {\nb\n}", 100);
  check("code: indentation after Enter is skipped", run.done, `pos ${run.pos}/${run.text.length}`);
  check("code: indentation marked auto", run.marks[4] === "auto" && run.marks[5] === "auto");
}
{
  const run = createRun("abc");
  applyKey(run, "Backspace", 0);
  check("strict: backspace ignored", run.pos === 0 && run.keystrokes === 0);
  check("ignored keys never start the clock", run.startedAt === null);
}
{
  const run = createRun("aaaa bbbb");
  typeAll(run, "aaaa bxbbb", 100);
  const weak = weakestKeys(keyResults(run), 3, 1);
  check("weakest key is the one missed", weak[0]?.ch === "b", JSON.stringify(weak));
}

/* ── XP, levels, tiers ──────────────────────────────────────────────────── */
console.log("scoring");
check("no speed XP at 80% accuracy", xpForRun({ correctChars: 500, accuracy: 80 }) === 40);
check("full XP at 100% accuracy", xpForRun({ correctChars: 500, accuracy: 100 }) === 200);
check("mashing earns less than accuracy", xpForRun({ correctChars: 1000, accuracy: 70 }) < xpForRun({ correctChars: 300, accuracy: 98 }));
{
  let prev = 0;
  let ok = true;
  for (let xp = 0; xp < 50000; xp += 137) {
    const l = typingLevel(xp).level;
    if (l < prev) ok = false;
    prev = l;
  }
  check("typing levels never go down as XP rises", ok);
  check("level 1 at 0 XP", typingLevel(0).level === 1);
}
check("40 WPM is Touch Typist", speedTier(40).name === "Touch Typist");
check("verified needs 60s", !isVerifiedRun({ accuracy: 99, ms: 30000 }) && isVerifiedRun({ accuracy: 96, ms: 60000 }));
check("verified needs 95% accuracy", !isVerifiedRun({ accuracy: 94, ms: 120000 }));

/* ── Keyboard ───────────────────────────────────────────────────────────── */
console.log("keyboard");
check("capital J uses left Shift", strokeFor("J").shiftKey === "ShiftLeft");
check("capital F uses right Shift", strokeFor("F").shiftKey === "ShiftRight");
check("@ is Shift+2 with the right Shift", strokeFor("@").keyId === "Digit2" && strokeFor("@").shiftKey === "ShiftRight");
check("{ uses the left Shift", strokeFor("{").shiftKey === "ShiftLeft");
check("F is left index", strokeFor("f").finger === "li");
check("space is a thumb", strokeFor(" ").finger === "th");
{
  const printable = [];
  for (let c = 32; c < 127; c++) printable.push(String.fromCharCode(c));
  const missing = printable.filter((c) => !isTypable(c));
  check("every printable ASCII character is on the keyboard", missing.length === 0, missing.join(""));
  check("keyboard has 5 rows", LAYOUT.length === 5);
}

/* ── Curriculum ─────────────────────────────────────────────────────────── */
console.log("curriculum");
check("lesson ids are unique", new Set(LESSONS.map((l) => l.id)).size === LESSONS.length);
check("at least 40 lessons", LESSONS.length >= 40, `${LESSONS.length}`);
{
  const taught = new Set([" "]);
  for (const stage of STAGES.filter((st) => ["ready", "home", "top", "bottom"].includes(st.id))) {
    for (const lesson of stage.lessons) {
      lesson.newKeys.forEach((k) => taught.add(k));
      for (let s = 1; s <= 25; s++) {
        const text = lesson.make(rng(s * 7919));
        const extra = [...new Set(text)].filter((c) => !taught.has(c));
        if (extra.length) {
          check(`${lesson.id} uses only taught keys`, false, `untaught: ${JSON.stringify(extra.join(""))} (seed ${s})`);
          break;
        }
      }
    }
  }
  check("letter stages teach all 26 letters", [..."abcdefghijklmnopqrstuvwxyz"].every((c) => taught.has(c)));
}
for (const lesson of LESSONS) {
  let bad = null;
  for (let s = 1; s <= 30 && !bad; s++) {
    const text = lesson.make(rng(s * 104729));
    if (!text || text.length < 40) bad = `too short (${text?.length}) seed ${s}`;
    else if ([...text].some((c) => !isTypable(c))) bad = `untypable ${JSON.stringify([...text].filter((c) => !isTypable(c)).join(""))}`;
    else if (/^\s|\s$/.test(text)) bad = "leading/trailing whitespace";
    else if (/ {2}/.test(text.replace(/\n +/g, "\n"))) bad = `double space: ${JSON.stringify(text.match(/.{0,10} {2}.{0,10}/)?.[0])}`;
  }
  check(`${lesson.id} generates typable text`, !bad, bad || "");
}
for (const lesson of LESSONS) {
  if (lesson.kind === "code" || ["ready", "home", "top", "bottom"].includes(lesson.stageId)) continue;
  const text = lesson.make(rng(42));
  check(`${lesson.id} has no newlines outside code`, !text.includes("\n"));
}
check("the path starts with finger placement", LESSONS[0].kind === "placement" && LESSONS[0].newKeys.join("") === "asdfjkl;");
check("attempted lessons stay open", isUnlocked(LESSONS[5].id, { [LESSONS[5].id]: { stars: 1 } }));
check("first lesson is open", isUnlocked(LESSONS[0].id, {}));
check("second lesson is locked at first", !isUnlocked(LESSONS[1].id, {}));
check("passing unlocks the next", isUnlocked(LESSONS[1].id, { [LESSONS[0].id]: { stars: 1 } }));
check("next lesson starts at the beginning", nextLesson({})?.id === LESSONS[0].id);
check("stars: below 90% fails", starsFor({ wpm: 99, accuracy: 89 }, 20) === 0);
check("stars: 3 needs target speed and 97%", starsFor({ wpm: 20, accuracy: 97 }, 20) === 3 && starsFor({ wpm: 19, accuracy: 99 }, 20) === 2);

/* ── Text banks ─────────────────────────────────────────────────────────── */
console.log("content");
{
  const all = [
    ...PASSAGES,
    ...Object.values(CODE_SNIPPETS).flat(),
    ...Object.values(BOSS_PHRASES).flat(),
    ...["home", "letters", "capitals", "symbols", "code"].flatMap(gameWords),
  ];
  for (let s = 1; s < 60; s++) {
    const r = rng(s);
    all.push(wordStream(r, 30), punctuatedStream(r, 30), numberStream(r, 20), dataEntryLine(r), weakKeyDrill(r, ["q", "z", "@", ";"]));
  }
  const bad = all.filter((t) => [...t].some((c) => !isTypable(c)));
  check("all content is typable", bad.length === 0, bad.slice(0, 3).map((t) => JSON.stringify(t)).join(" | "));
  const homeWords = gameWords("home");
  check("Word Rain home-row words use only home keys", homeWords.length > 15 && homeWords.every((w) => /^[asdfghjkl]+$/.test(w)), `${homeWords.length}`);
  check("rng is deterministic", wordStream(rng(5), 10) === wordStream(rng(5), 10));
}

/* ── Profile updates ────────────────────────────────────────────────────── */
console.log("profile");
{
  const stats = { wpm: 30, raw: 32, accuracy: 98, correctChars: 300, keystrokes: 306, errors: 6, ms: 60000, bestCombo: 120, consistency: 80 };
  const first = recordSession(emptyProfile(), { mode: "lesson", lessonId: LESSONS[0].id, stats, stars: 3, keys: { f: { hits: 10, misses: 1, ms: 900 } } });
  const again = recordSession(first.profile, { mode: "lesson", lessonId: LESSONS[0].id, stats, stars: 3 });
  check("new stars pay a bonus", first.xp > again.xp);
  check("best stars are kept", again.profile.lessons[LESSONS[0].id].stars === 3);
  check("attempts are counted", again.profile.lessons[LESSONS[0].id].attempts === 2);
  check("key stats accumulate", first.profile.keyStats.f.misses === 1);
  check("first lesson earns First Keys", first.newAchievements.includes("first-keys"));
  check("history records runs", again.profile.history.length === 2);
  check("streak starts at 1", first.profile.streak.current === 1);
  check("input profile not mutated", emptyProfile().sessions === 0 && first.profile.sessions === 1);

  const test = recordSession(emptyProfile(), { mode: "test60", stats: { ...stats, wpm: 45, accuracy: 96 } });
  check("60s test at 96% is verified", test.profile.bestVerifiedWpm === 45 && test.newBest);
  check("verified 40+ earns Job Ready", test.newAchievements.includes("wpm-40"));
  const sloppy = recordSession(emptyProfile(), { mode: "test60", stats: { ...stats, wpm: 80, accuracy: 85 } });
  check("sloppy test is not a best", sloppy.profile.bests.test60 === 0 && sloppy.profile.bestVerifiedWpm === 0);
  const raceNull = recordSession(emptyProfile(), { mode: "race", stats, keys: null, extra: { raceWon: true, league: "elite" } });
  check("race win with no key data", raceNull.profile.raceWins === 1 && raceNull.newAchievements.includes("race-elite"));
  check("achievement ids are unique", new Set(ACHIEVEMENTS.map((a) => a.id)).size === ACHIEVEMENTS.length);
}

console.log(`\n${passes} passed, ${failures} failed`);
process.exit(failures ? 1 : 0);
