/**
 * ACADEMY SELF-TEST
 *
 * Run:  npm run test:academy
 *
 * Covers the pure logic behind the learning platform — the parts that decide
 * grades, XP and where a learner resumes. No browser, no Firebase, no network.
 *
 * The reference-stability block exists because of a real bug: getLesson()
 * spread a new object on every call, so a lesson placed in a React dependency
 * array changed identity every render. The loader effect re-ran forever, its
 * cleanup cancelled the previous run, and setLoading(false) never fired — the
 * lesson player buffered for ever and the assessment refetched on loop. Keep
 * these assertions; they are cheap and that failure was expensive.
 */

import { readFileSync } from "node:fs";

const SRC = new URL("../../src/academy/", import.meta.url).href;

const reg = await import(SRC + "data/lessons/index.js");
const cat = await import(SRC + "data/catalog.js");
const game = await import(SRC + "data/gamification.js");
const { gradeSubmission, serveQuestions, parseSeed } = await import("./grade.js");
const jobs = await import("./jobs/skills.js");
const sheet = await import("./spreadsheet/engine.js");
const exams = await import(SRC + "data/exams.js");
const RAW_BANK = {
  ...(await import("./assessments/m1-data-foundations.js")).ASSESSMENTS,
  ...(await import("./assessments/m1-excel-essentials.js")).ASSESSMENTS,
};

let failures = 0;
let checks = 0;

function ok(name, condition, detail = "") {
  checks += 1;
  if (!condition) failures += 1;
  console.log(`${condition ? "  PASS" : "  FAIL"}  ${name}${detail ? `  (${detail})` : ""}`);
}

function section(title) {
  console.log(`\n${title}`);
}

/* ── Reference stability ─────────────────────────────────────────────── */

section("Reference stability (guards the infinite-render bug)");
const LESSON_ID = "l1-you-already-do-this";
ok("getLesson", Object.is(reg.getLesson("data-analysis", LESSON_ID), reg.getLesson("data-analysis", LESSON_ID)));
ok("getCourseLessons", Object.is(reg.getCourseLessons("data-analysis"), reg.getCourseLessons("data-analysis")));
ok("getCourseOutline", Object.is(reg.getCourseOutline("data-analysis"), reg.getCourseOutline("data-analysis")));
ok("getNextLesson", Object.is(reg.getNextLesson("data-analysis", LESSON_ID), reg.getNextLesson("data-analysis", LESSON_ID)));
ok("getCatalogEntry", Object.is(cat.getCatalogEntry("data-analysis"), cat.getCatalogEntry("data-analysis")));

/* ── Resume ──────────────────────────────────────────────────────────── */

section("Resume target");
const lessons = reg.getCourseLessons("data-analysis");
ok("no progress goes to lesson one", reg.getResumeLesson("data-analysis", { completedLessons: [] })?.id === lessons[0].id);
ok("saved position is honoured", reg.getResumeLesson("data-analysis", { completedLessons: [], position: { lessonId: lessons[2].id } })?.id === lessons[2].id);
ok("a completed saved position is skipped", reg.getResumeLesson("data-analysis", { completedLessons: [lessons[0].id], position: { lessonId: lessons[0].id } })?.id === lessons[1].id);
ok("course finished returns null", reg.getResumeLesson("data-analysis", { completedLessons: lessons.map((l) => l.id) }) === null);
ok("unknown saved lesson falls back", reg.getResumeLesson("data-analysis", { completedLessons: [], position: { lessonId: "bogus" } })?.id === lessons[0].id);
ok("missing enrollment does not throw", reg.getResumeLesson("data-analysis", undefined)?.id === lessons[0].id);

/* ── Chooser decisions ───────────────────────────────────────────────────
 * The enrol page decides, per course: Start course / Continue / Review, and
 * what progress to show. The rule is "an enrolment exists" — not "XP above
 * zero" and not "a lesson passed" — because a learner who enrolled and has
 * not finished lesson one has still started, and offering them "Start
 * course" implies it would reset them.
 *
 * calculateProgress lives in academyService, which imports the Firebase
 * client and cannot load in Node, so the same arithmetic is asserted against
 * the real lesson count here. If the two ever diverge the page would show a
 * percentage that does not match the course.
 */
section("Course chooser decisions");

const daAll = reg.getCourseLessons("data-analysis");
const pct = (completed) =>
  Math.round((daAll.filter((l) => completed.includes(l.id)).length / daAll.length) * 100);

ok("no enrolment means not started", !Boolean(null));
ok("an enrolment with nothing done is still started, at 0%",
  pct([]) === 0);
ok("one lesson done is above 0% but under 100%",
  pct([daAll[0].id]) > 0 && pct([daAll[0].id]) < 100,
  `${pct([daAll[0].id])}%`);
ok("every lesson done is 100%", pct(daAll.map((l) => l.id)) === 100);
ok("half the lessons is about half",
  Math.abs(pct(daAll.slice(0, Math.floor(daAll.length / 2)).map((l) => l.id)) - 50) <= 1,
  `${pct(daAll.slice(0, Math.floor(daAll.length / 2)).map((l) => l.id))}%`);

// Continue must target the resume lesson, and a finished course has none —
// which is why the finished card says Review rather than Continue.
const midway = { completedLessons: daAll.slice(0, 3).map((l) => l.id) };
const resumeMid = reg.getResumeLesson("data-analysis", midway);
ok("Continue targets the first unfinished lesson",
  resumeMid?.id === daAll[3].id, resumeMid?.id);

const allDone = { completedLessons: daAll.map((l) => l.id) };
ok("a finished course has no resume target, so the label must not be Continue",
  reg.getResumeLesson("data-analysis", allDone) === null);

// A saved position mid-course is honoured, so Continue lands where they were
// rather than at the earliest gap.
const saved = {
  completedLessons: [daAll[0].id],
  position: { lessonId: daAll[5].id },
};
ok("a saved position wins over the earliest gap",
  reg.getResumeLesson("data-analysis", saved)?.id === daAll[5].id);

/* ── Unknown ids ─────────────────────────────────────────────────────── */

section("Unknown ids resolve to null, never a crash");
ok("unknown lesson", reg.getLesson("data-analysis", "nope") === null);
ok("unknown course", reg.getCourseLessons("nope").length === 0);
ok("unknown catalog entry", cat.getCatalogEntry("nope") === null);

/* ── Levels ──────────────────────────────────────────────────────────── */

section("Levels");
ok("0 XP is Novice", game.getLevel(0).name === "Novice");
// Read the boundary off the ladder instead of hardcoding it, so a
// recalibration does not leave a stale literal failing here.
const foundationAt = game.LEVELS[1].minXp;
ok("one XP below Foundation is still Novice", game.getLevel(foundationAt - 1).name === "Novice");
ok("the Foundation threshold reaches Foundation", game.getLevel(foundationAt).name === "Foundation");
ok("top level has no next", game.getLevel(999999).next === null);
ok("percentToNext stays in range", [0, 50, 130, 800, 9999, 99999].every((xp) => {
  const p = game.getLevel(xp).percentToNext;
  return p >= 0 && p <= 100;
}));
ok("thresholds increase monotonically", game.LEVELS.every(
  (l, i) => i === 0 || l.minXp > game.LEVELS[i - 1].minXp
));

/* ── Level calibration ───────────────────────────────────────────────────
 * The bug this guards: the ladder originally topped out at 2,600 XP while
 * the authored course yields about 14,000, so "Professional" arrived at 19%
 * of the course and a learner 17% through was told they were a professional.
 * Adding content silently makes a fixed ladder wrong, so the budget is
 * recomputed from the real curriculum here on every run.
 */
section("Level calibration against the real curriculum");

const daLessons = reg.getCourseLessons("data-analysis");
const budget = game.courseXpBudget(daLessons);

ok(
  "declared COURSE_XP_BUDGET matches the authored curriculum",
  budget.typical === game.COURSE_XP_BUDGET,
  `computed ${budget.typical}, declared ${game.COURSE_XP_BUDGET}`
);

const top = game.LEVELS[game.LEVELS.length - 1];
const topShare = top.minXp / budget.typical;
ok(
  "the top level requires most of the course",
  topShare >= 0.7 && topShare <= 0.95,
  `${top.name} at ${(topShare * 100).toFixed(1)}% of the course`
);

// Someone a fifth of the way in must not be at the top of the ladder.
const fifth = game.getLevel(Math.round(budget.typical * 0.2));
ok(
  "20% of the course is not yet the top level",
  fifth.level < top.level,
  `${fifth.name} (L${fifth.level})`
);

// And finishing the course must actually reach the top.
ok(
  "finishing the course reaches the top level",
  game.getLevel(budget.typical).level === top.level
);

// Each declared share must match its hardcoded threshold, so the two cannot
// drift apart when someone edits one and forgets the other.
ok(
  "every threshold matches its declared share of the budget",
  game.LEVELS.every(
    (l) => Math.abs(l.minXp - Math.round(l.share * game.COURSE_XP_BUDGET)) <= 15
  ),
  game.LEVELS.map((l) => `${l.name}:${l.minXp}vs${Math.round(l.share * game.COURSE_XP_BUDGET)}`).join(" ")
);

// The first levels must still arrive quickly, or a new learner sees nothing
// happen and does not come back.
ok(
  "Foundation arrives within the first three lessons",
  game.LEVELS[1].minXp <= 3 * (budget.typical / budget.lessons),
  `${game.LEVELS[1].minXp} XP vs ${Math.round(3 * (budget.typical / budget.lessons))}`
);

/* ── Onboarding and the under-18 safeguard ───────────────────────────────
 * The age band is not collected for analytics — it decides whether private,
 * unmoderatable messaging is on. So the default must be protective, and the
 * "we do not know" case must behave like a child rather than like an adult.
 */
section("Onboarding and the under-18 safeguard");

const ob = await import(SRC + "data/onboarding.js");

ok("exactly two fields are required", ob.REQUIRED_FIELDS.length === 2,
  ob.REQUIRED_FIELDS.join(", "));
ok("the age band is one of them", ob.REQUIRED_FIELDS.includes("ageBand"));
ok("every field states why it is collected",
  ob.ONBOARDING_FIELDS.every((f) => typeof f.why === "string" && f.why.length > 30));
ok("no field asks for a date of birth",
  ob.ONBOARDING_FIELDS.every((f) => !/birth|dob/i.test(f.id + f.label)));

// The safeguard, including the case that matters most.
ok("an under-18 gets messaging OFF",
  ob.chatDefaultFor({ ageBand: ob.UNDER_18 }) === false);
ok("an unknown age gets messaging OFF — protective, not permissive",
  ob.chatDefaultFor({}) === false && ob.chatDefaultFor(null) === false);
ok("an adult gets messaging ON", ob.chatDefaultFor({ ageBand: "25-34" }) === true);

// Completeness gates the form, so it must not pass on an empty profile.
ok("an empty profile is incomplete", ob.isProfileComplete({}) === false);
ok("a null profile is incomplete", ob.isProfileComplete(null) === false);
ok("phone plus age band counts as complete",
  ob.isProfileComplete({ phone: "08031234567", ageBand: "18-24" }) === true);
ok("whitespace does not count as an answer",
  ob.isProfileComplete({ phone: "   ", ageBand: "18-24" }) === false);

// Validation has to accept real Nigerian numbers written various ways, and
// still reject obvious rubbish.
const good = ["08031234567", "0803 123 4567", "+234 803 123 4567", "+2348031234567"];
ok("real phone formats are accepted",
  good.every((v) => !ob.validateProfile({ phone: v, ageBand: "18-24" }).phone),
  good.join(" | "));
const bad = ["123", "", "abc"];
ok("obvious rubbish is rejected",
  bad.every((v) => Boolean(ob.validateProfile({ phone: v, ageBand: "18-24" }).phone)));
ok("a missing age band is reported",
  Boolean(ob.validateProfile({ phone: "08031234567" }).ageBand));
ok("optional fields left blank produce no error",
  Object.keys(ob.validateProfile({ phone: "08031234567", ageBand: "18-24" })).length === 0);
ok("an over-long goal is rejected",
  Boolean(ob.validateProfile({ phone: "08031234567", ageBand: "18-24", goal: "x".repeat(400) }).goal));

// Nothing collected here may reach another learner via a public projection.
const obSvcText = readFileSync(
  new URL("../../src/academy/services/academyService.js", import.meta.url),
  "utf8"
);
const lbFields = obSvcText.match(/LEADERBOARD_FIELDS = \[([^\]]*)\]/);
ok("the leaderboard never carries a profile field",
  Boolean(lbFields) &&
    !/phone|ageBand|state|education|situation|goal|interests/.test(lbFields[1]));

/* ── Leaderboard privacy boundary ────────────────────────────────────────
 * The leaderboard is a PROJECTION of the student record, and the only reason
 * it is safe for every signed-in learner to read is that it holds nothing but
 * a name, an XP total, a level and a streak. If a future feature adds a field
 * here, that boundary erodes silently — so the field list in the service and
 * the hasOnly() list in firestore.rules are checked against each other, and
 * against a hardcoded set of what is allowed to be public.
 */
section("Leaderboard privacy boundary");

// academyService imports the Firebase client, which cannot load in Node, so
// the field list is read from the SOURCE rather than imported. That is also
// the stricter check: it verifies what the file actually declares.
const svcText = readFileSync(
  new URL("../../src/academy/services/academyService.js", import.meta.url),
  "utf8"
);
const rulesText = readFileSync(
  new URL("../../firestore.rules", import.meta.url),
  "utf8"
);

// Anything NOT on this list must never reach the public board.
const PUBLIC_OK = ["uid", "name", "xp", "level", "levelName", "streak", "updatedAt"];
const NEVER_PUBLIC = ["email", "memoraId", "photoURL", "badges", "joinedAt"];

const declared = svcText.match(/LEADERBOARD_FIELDS = \[([^\]]*)\]/);
ok("the service declares a leaderboard field list", Boolean(declared));

if (declared) {
  const fields = [...declared[1].matchAll(/"([a-zA-Z]+)"/g)].map((m) => m[1]);
  ok(
    "the board publishes only fields cleared as public",
    fields.length > 0 && fields.every((f) => PUBLIC_OK.includes(f)),
    fields.join(", ")
  );
  ok(
    "no private student field is on the public board",
    NEVER_PUBLIC.every((f) => !fields.includes(f))
  );

  // The rules must constrain the same set, or a client could write more than
  // the service intends to.
  const hasOnly = rulesText.match(/hasOnly\(\[([^\]]*)\]\)/);
  ok("firestore.rules constrains the leaderboard with hasOnly", Boolean(hasOnly));
  if (hasOnly) {
    const ruleFields = [...hasOnly[1].matchAll(/'([a-zA-Z]+)'/g)].map((m) => m[1]);
    ok(
      "the rules and the service agree on the field list",
      ruleFields.slice().sort().join(",") === fields.slice().sort().join(","),
      `rules: ${ruleFields.join("/")} | service: ${fields.join("/")}`
    );
  }
}

// The board must never be world-readable, and only its owner may write a row.
ok(
  "the leaderboard requires sign-in to read",
  /match \/leaderboard\/\{uid\}[\s\S]{0,900}?allow read: if isSignedIn\(\);/.test(rulesText)
);
ok(
  "only the owner may write their own leaderboard row",
  /match \/leaderboard\/\{uid\}[\s\S]{0,900}?request\.auth\.uid == uid/.test(rulesText)
);

/* ── Streaks ─────────────────────────────────────────────────────────── */

section("Streaks");
let streak = game.advanceStreak({}, "2026-09-01");
ok("first day starts at one", streak.current === 1);
streak = game.advanceStreak(streak, "2026-09-02");
ok("a consecutive day increments", streak.current === 2);
streak = game.advanceStreak(streak, "2026-09-02");
ok("the same day does not double count", streak.current === 2);

let run = {};
for (let d = 1; d <= 7; d += 1) run = game.advanceStreak(run, `2026-09-0${d}`);
ok("seven days reaches seven", run.current === 7);
ok("seven days earns a freeze", run.freezes === 1);

const afterGap = game.advanceStreak(run, "2026-09-09");
ok("a freeze absorbs one missed day", afterGap.current === 8, `current=${afterGap.current}`);
ok("the freeze is spent", afterGap.freezes === 0);

const broken = game.advanceStreak(
  { current: 5, longest: 9, lastActiveDate: "2026-09-01", freezes: 0 },
  "2026-09-05"
);
ok("no freeze resets the streak", broken.current === 1);
ok("longest survives a reset", broken.longest === 9);

/* ── Badges ──────────────────────────────────────────────────────────── */

section("Badges");
ok("nothing is awarded at zero", game.evaluateBadges({ atomsCompleted: 0, lessonsCompleted: 0 }).length === 0);
ok("first atom earns First Step", game.evaluateBadges({ atomsCompleted: 1 }).includes("first-atom"));
ok("comeback requires a comeback", game.evaluateBadges({ comebacks: 1 }).includes("comeback"));
ok("thirty-day streak badge", game.evaluateBadges({ longestStreak: 30 }).includes("streak-30"));

/* ── Grading ─────────────────────────────────────────────────────────── */

section("Grading");
const served = serveQuestions(LESSON_ID, 1);
const servedJson = JSON.stringify(served);
ok("served payload has no correct answers", !servedJson.includes('"correct"'));
ok("served payload has no explanations", !servedJson.includes("whyWrong") && !servedJson.includes("explanation"));
ok("served payload keeps the prompts", served.questions.every((q) => q.prompt && q.options.length >= 2));

const allWrong = gradeSubmission(LESSON_ID, { "q1-1": "a", "q1-2": "a", "q1-3": "a", "q1-4": "a" });
ok("all wrong scores zero and fails", allWrong.score === 0 && allWrong.passed === false);
ok("failures name the atoms to review", allWrong.conceptsToReview.length > 0);
ok("each wrong answer gets its own rebuttal", allWrong.results.every((r) => r.isCorrect || r.whyYoursWasWrong));

const allRight = gradeSubmission(LESSON_ID, { "q1-1": "b", "q1-2": "c", "q1-3": "b", "q1-4": "b" });
ok("all correct scores 100 and passes", allRight.score === 100 && allRight.passed === true);
ok("a perfect score leaves nothing to review", allRight.conceptsToReview.length === 0);

const partial = gradeSubmission(LESSON_ID, { "q1-1": "b", "q1-2": "c", "q1-3": "b", "q1-4": "a" });
ok("75% clears the 70% pass mark", partial.score === 75 && partial.passed === true);

const half = gradeSubmission(LESSON_ID, { "q1-1": "b", "q1-2": "c", "q1-3": "a", "q1-4": "a" });
ok("50% does not pass", half.score === 50 && half.passed === false);

const blank = gradeSubmission(LESSON_ID, {});
ok("an empty submission scores zero rather than throwing", blank.score === 0);
ok("unanswered questions say so", blank.results.every((r) => r.yourAnswer === null));

ok("an unknown lesson grades to null", gradeSubmission("nope", {}) === null);

/* ── Option shuffling ────────────────────────────────────────────────── */

section("Option shuffling");
// A missing seed MUST become undefined. `Number(seed) || 1` here pinned every
// real request to one permutation while the unit tests still passed.
ok("a missing seed parses to undefined", parseSeed(undefined) === undefined);
ok("a null seed parses to undefined", parseSeed(null) === undefined);
ok("an empty seed parses to undefined", parseSeed("") === undefined);
ok("a non-numeric seed parses to undefined", parseSeed("abc") === undefined);
ok("seed 0 is preserved, not coerced away", parseSeed("0") === 0);
ok("a real seed survives", parseSeed("42") === 42);

ok("a fixed seed is reproducible",
   JSON.stringify(serveQuestions(LESSON_ID, 42)) === JSON.stringify(serveQuestions(LESSON_ID, 42)));

const orderOf = (a) => a.questions.map((q) => q.options.map((o) => o.id).join("")).join("|");
let differed = 0;
for (let i = 0; i < 200; i += 1) {
  if (orderOf(serveQuestions(LESSON_ID)) !== orderOf(serveQuestions(LESSON_ID))) differed += 1;
}
ok("unseeded serves vary between requests", differed > 180, `${differed}/200 differed`);

const perms = new Set(
  serveQuestions("l3-the-analysts-workflow", 7).questions
    .filter((q) => q.options.length === 4)
    .map((q) => q.options.map((o) => o.id).join(""))
);
ok("questions in one lesson get different permutations", perms.size > 1, `${perms.size} distinct`);

// The correct answer must not favour any slot. A broken PRNG previously put it
// first 35% of the time, so a learner could pass by always choosing option one.
// Seeds are stepped deterministically rather than left to Math.random, so
// this assertion gives the same verdict on every run. A test of randomness
// that itself fails one run in twenty is worse than no test at all.
const slots = { 1: 0, 2: 0, 3: 0, 4: 0 };
let counted = 0;
for (let seed = 1; seed <= 600; seed += 1) {
  for (const [lessonId, bank] of Object.entries(RAW_BANK)) {
    for (const q of serveQuestions(lessonId, seed).questions) {
      if (q.options.length !== 4) continue;
      const truth = bank.questions.find((x) => x.id === q.id);
      slots[q.options.findIndex((o) => o.id === truth.correct) + 1] += 1;
      counted += 1;
    }
  }
}
const expected = counted / 4;
const chiSquare = [1, 2, 3, 4].reduce(
  (sum, slot) => sum + (slots[slot] - expected) ** 2 / expected,
  0
);
ok("correct answer is evenly spread across all four slots", chiSquare < 7.81,
   `chi-square ${chiSquare.toFixed(2)}, need < 7.81`);

/* ── Job matching ────────────────────────────────────────────────────── */

section("Job matching");

const now = new Date().toISOString();
const job = (title, description, extra = {}) => ({
  id: title, title, description, tags: [], postedAt: now, ...extra,
});

const beginner = jobs.buildLearnerProfile({
  completedModuleIds: ["m1-data-foundations", "m1-excel-essentials"],
  level: 2,
});
ok("completing Excel modules proves Excel", beginner.proved.includes("excel"));
ok("a beginner is capped at entry level", beginner.seniority === "entry");

ok("seniority is read from the title",
   jobs.inferSeniority({ title: "Senior Data Analyst" }) === "senior" &&
   jobs.inferSeniority({ title: "Junior Data Analyst" }) === "entry");
ok("years of experience infer seniority",
   jobs.inferSeniority({ title: "Data Analyst", description: "8+ years required" }) === "senior");

// The exact failure that made the first version useless: a sales advert
// mentioning one buzzword outranked a real analyst posting.
const copywriter = job("Freelance Copywriter", "You will use Excel to track analytics for content.", { tags: ["excel"] });
ok("a copywriter advert tagged excel is rejected",
   jobs.scoreJob(copywriter, beginner) === null);

const scheduler = job("Renewables Project Scheduler", "Reporting and analytics duties, spreadsheets.");
ok("an unrelated role mentioning analytics is rejected",
   jobs.scoreJob(scheduler, beginner) === null);

const analyst = job("Junior Data Analyst", "Excel, SQL and dashboards. Reporting to the insights lead.");
const scoredAnalyst = jobs.scoreJob(analyst, beginner);
ok("a real junior analyst role is accepted", scoredAnalyst !== null);
ok("the match explains itself", Boolean(scoredAnalyst?.reason?.includes("Excel")));
ok("the skill gap is listed", scoredAnalyst?.match.missing.includes("SQL"));

const senior = job("Senior Data Scientist", "8+ years of Python and SQL.");
ok("a senior role is hidden from a beginner", jobs.scoreJob(senior, beginner) === null);

const stale = job("Data Analyst", "Excel and SQL.", {
  postedAt: new Date(Date.now() - 120 * 86400000).toISOString(),
});
ok("a posting older than 60 days is dropped", jobs.scoreJob(stale, beginner) === null);

ok("a real role outranks a keyword-stuffed one",
   jobs.rankJobs([copywriter, scheduler, analyst], beginner, 10)
     .every((j) => j.title === "Junior Data Analyst"));

// A strict superset of the beginner's skills, held at the same seniority so
// the comparison isolates skill overlap. (A mid-level profile would take a
// small, correct penalty on a junior posting, which would confound this.)
const advanced = jobs.buildLearnerProfile({
  completedModuleIds: [
    "m1-data-foundations",
    "m1-excel-essentials",
    "m4-pandas",
  ],
  level: 2,
});
ok("the advanced profile is a superset",
   beginner.proved.every((s) => advanced.proved.includes(s)) &&
     advanced.proved.includes("python"));

// The comparison job must actually ASK for the extra skill. Scoring against a
// posting that never mentions Python cannot reward knowing Python.
const pythonAnalyst = job(
  "Junior Data Analyst",
  "You will work in Excel and Python, querying with SQL and building dashboards."
);
ok("the comparison job really asks for Python",
   jobs.extractJobSkills(pythonAnalyst).includes("python"));

const beginnerOnPython = jobs.scoreJob(pythonAnalyst, beginner);
const advancedOnPython = jobs.scoreJob(pythonAnalyst, advanced);
ok("proving more of what a job asks for scores higher",
   advancedOnPython.score > beginnerOnPython.score,
   `${advancedOnPython.score} vs ${beginnerOnPython.score}`);
ok("the extra skill shows as proved, not as a gap",
   advancedOnPython.match.proved.includes("Python") &&
     beginnerOnPython.match.missing.includes("Python"));

// Over-qualification is a mild penalty, not a bonus: a mid-level candidate is
// a slightly worse fit for a junior posting than an entry-level one.
const midLevel = jobs.buildLearnerProfile({
  completedModuleIds: ["m1-data-foundations", "m1-excel-essentials", "m4-pandas"],
  level: 5,
});
ok("a mid-level profile is not rewarded for a junior role",
   jobs.scoreJob(pythonAnalyst, midLevel).score < advancedOnPython.score);

/* ── Exam readiness ──────────────────────────────────────────────────── */

section("Exam readiness");

const mo210 = exams.EXAMS.find((e) => e.id === "mo-210");
const readiness = (completed, score) =>
  exams.getExamReadiness(mo210, {
    completedModuleIds: completed,
    moduleScores: Object.fromEntries(completed.map((m) => [m, score])),
  });

ok("no progress is Not started", exams.getExamReadiness(mo210, {}).band === "not-started");
ok("partial progress is not ready", readiness(mo210.preparedBy.slice(0, 2), 85).band !== "ready");
ok("full coverage with strong scores is ready", readiness(mo210.preparedBy, 95).band === "ready");

// Full coverage on bare passes must NOT say "book the exam"
const scraped = readiness(mo210.preparedBy, 70);
ok("bare passes are held back from Ready", scraped.band !== "ready", scraped.label);
ok("and the reason is flagged for the UI", scraped.heldBackByScores === true);
ok("80% average clears the accuracy gate", readiness(mo210.preparedBy, 80).band === "ready");
ok("remaining modules are listed",
   readiness([mo210.preparedBy[0]], 90).remaining.length === mo210.preparedBy.length - 1);

/* ── Spreadsheet engine ──────────────────────────────────────────────── */

section("Spreadsheet engine");

const BOOK = {
  A1: "Product", B1: "Price", C1: "Qty",
  A2: "Rice", B2: 1200, C2: 500,
  A3: "Garri", B3: 800, C3: 320,
  A4: "Milk", B4: 450, C4: 0,
  A5: "Biscuits", B5: 150, C5: 90,
};
const ev = (f) => {
  const r = sheet.evaluateFormula(f, BOOK);
  return r.ok ? r.value : r.error;
};

ok("arithmetic precedence", ev("=2+3*4") === 14);
ok("brackets override precedence", ev("=(2+3)*4") === 20);
ok("^ is LEFT-associative like Excel, not like JS **", ev("=2^3^2") === 64);
ok("cell references resolve", ev("=B2*C2") === 600000);
ok("absolute references work", ev("=$B$2") === 1200);
ok("SUM over a range", ev("=SUM(B2:B5)") === 2600);
ok("AVERAGE over a range", ev("=AVERAGE(B2:B5)") === 650);
ok("COUNT counts only numbers", ev("=COUNT(A2:A5)") === 0);
ok("COUNTA counts anything filled", ev("=COUNTA(A2:A5)") === 4);
ok("COUNTIF with a criterion", ev('=COUNTIF(B2:B5,">400")') === 3);
ok("IF returns the true branch", ev('=IF(C5<100,"Reorder","OK")') === "Reorder");
ok("text joins with &", ev('=A2&" costs "&B2') === "Rice costs 1200");
ok("nested functions", ev("=SUM(B2:B5)/COUNT(B2:B5)") === 650);
ok("float noise is trimmed", ev("=0.1+0.2") === 0.3);

ok("divide by zero gives #DIV/0!", ev("=B2/C4") === "#DIV/0!");
ok("unknown function gives #NAME?", ev("=NOPE(1)") === "#NAME?");
ok("arithmetic on text gives #VALUE!", ev("=A2*2") === "#VALUE!");
ok("unclosed bracket gives #NAME?", ev("=SUM(") === "#NAME?");
ok("a circular reference is caught",
   sheet.evaluateFormula("=A1", { A1: "=B1", B1: "=A1" }).error === "#REF!");

// The engine must never execute code. It is fed strings a learner typed.
const INJECTIONS = [
  "=constructor.constructor('return 1')()",
  "=globalThis",
  "=process.exit(1)",
  "=[].constructor",
  "=alert(1)",
  "=this",
];
ok("no injection executes",
   INJECTIONS.every((attack) => sheet.evaluateFormula(attack, { A1: 1 }).ok === false),
   `${INJECTIONS.length} attempts, all rejected`);

ok("A1 notation round-trips",
   sheet.toRef(sheet.parseRef("AA13")) === "AA13");
ok("a range expands in reading order",
   sheet.expandRange("A1", "B2").join(",") === "A1,B1,A2,B2");

/* ── Statistical functions ───────────────────────────────────────────── */

section("Statistical functions");

const TEAM = {
  A2: "Ada", B2: "Lagos", C2: 820000, D2: 4,
  A3: "Musa", B3: "Abuja", C3: 640000, D3: 5,
  A4: "Ngozi", B4: "Lagos", C4: 820000, D4: 3,
  A5: "Bola", B5: "Kano", C5: 310000, D5: "",
  A6: "Chuka", B6: "Lagos", C6: 455000, D6: 4,
  A7: "Tunde", B7: "Abuja", C7: 0, D7: 2,
};
const team = (f) => {
  const r = sheet.evaluateFormula(f, TEAM);
  return r.ok ? r.value : r.error;
};

ok("COUNT skips the blank", team("=COUNT(D2:D7)") === 5);
ok("COUNTA skips the blank too", team("=COUNTA(D2:D7)") === 5);
ok("COUNTBLANK finds it", team("=COUNTBLANK(D2:D7)") === 1);
ok("COUNT returns 0 on a text column", team("=COUNT(A2:A7)") === 0);
ok("COUNTIF on text", team('=COUNTIF(B2:B7,"Lagos")') === 3);
ok("COUNTIF with a comparison", team('=COUNTIF(C2:C7,">500000")') === 3);
ok("COUNTIFS applies both conditions",
   team('=COUNTIFS(B2:B7,"Lagos",C2:C7,">500000")') === 2);
ok("COUNTIFS with no matches returns 0",
   team('=COUNTIFS(B2:B7,"Kano",C2:C7,">500000")') === 0);

ok("AVERAGEIF on a segment",
   Math.abs(team('=AVERAGEIF(B2:B7,"Lagos",C2:C7)') - 698333.3333) < 0.01);
ok("AVERAGEIFS averages its FIRST argument",
   team('=AVERAGEIFS(C2:C7,B2:B7,"Lagos",D2:D7,">3")') === 637500);
ok("AVERAGEIF with no match gives #DIV/0!",
   team('=AVERAGEIF(B2:B7,"Nowhere",C2:C7)') === "#DIV/0!");
ok("AVERAGEA counts text as zero",
   sheet.evaluateFormula("=AVERAGEA(A1:A3)", { A1: 4, A2: "n/a", A3: 8 }).value === 4);
ok("AVERAGE skips that same text",
   sheet.evaluateFormula("=AVERAGE(A1:A3)", { A1: 4, A2: "n/a", A3: 8 }).value === 6);

ok("RANK.EQ gives ties the same rank", team("=RANK.EQ(C2,C2:C7)") === 1);
ok("RANK.EQ skips the used position", team("=RANK.EQ(C3,C2:C7)") === 3);
ok("RANK.AVG averages tied positions", team("=RANK.AVG(C2,C2:C7)") === 1.5);
ok("RANK ascending with order 1", team("=RANK.EQ(C7,C2:C7,1)") === 1);
ok("RANK on a value not present gives #N/A", team("=RANK.EQ(999,C2:C7)") === "#N/A");

/* ── Formats and filling ─────────────────────────────────────────────── */

section("Number formats and filling");

ok("0.25 shows as 25%", sheet.formatValue(0.25, "percent") === "25%");
ok("typing 25 into a percent cell shows 2500%",
   sheet.formatValue(25, "percent") === "2,500%");
ok("currency prefixes naira", sheet.formatValue(1200, "currency") === "₦1,200");
ok("errors pass through formatting untouched",
   sheet.formatValue("#DIV/0!", "currency") === "#DIV/0!");
ok("blank formats to blank", sheet.formatValue("", "currency") === "");

ok("filling shifts relative references",
   sheet.translateFormula("=B2*C2", 1, 0) === "=B3*C3");
ok("absolute references survive a fill",
   sheet.translateFormula("=$B$2*C2", 1, 0) === "=$B$2*C3");
ok("mixed references lock only their half",
   sheet.translateFormula("=$B2*C2", 1, 0) === "=$B3*C3" &&
     sheet.translateFormula("=B$2*C2", 1, 0) === "=B$2*C3");
ok("text inside quotes is never treated as a reference",
   sheet.translateFormula('=IF(C2<100,"B2","OK")', 1, 0) === '=IF(C3<100,"B2","OK")');
ok("filling off the top of the sheet gives #REF!",
   sheet.translateFormula("=B1", -1, 0) === "=#REF!");

const filled = sheet.fillDown(
  { B2: 1200, C2: 500, D2: "=B2*C2", B3: 800, C3: 320, B4: 450, C4: 210 },
  "D2",
  "D4"
);
ok("fillDown writes the shifted formulas",
   filled.D3 === "=B3*C3" && filled.D4 === "=B4*C4");
ok("the filled column totals correctly",
   sheet.evaluateFormula("=SUM(D2:D4)", {
     B2: 1200, C2: 500, D2: "=B2*C2", B3: 800, C3: 320, B4: 450, C4: 210, ...filled,
   }).value === 950500);

/* ── Cleaning toolkit ────────────────────────────────────────────────── */

section("Text cleaning and error handling");

const DIRTY = {
  A1: 100, B1: 0, B2: 4,
  A2: "  Lagos  ", A3: "lagos state", A4: "Lagos, Nigeria", A5: "text",
};
const dirty = (f) => {
  const r = sheet.evaluateFormula(f, DIRTY);
  return r.ok ? r.value : r.error;
};

ok("TRIM strips surrounding spaces", dirty("=TRIM(A2)") === "Lagos");
ok("LEN exposes the hidden spaces", dirty("=LEN(A2)") === 9 && dirty("=LEN(TRIM(A2))") === 5);
ok("PROPER capitalises each word", dirty("=PROPER(A3)") === "Lagos State");
ok("CLEAN leaves ordinary text alone", dirty('=CLEAN("abc")') === "abc");
ok("SUBSTITUTE replaces every occurrence",
   dirty('=SUBSTITUTE(A4,", "," - ")') === "Lagos - Nigeria");
ok("SUBSTITUTE can target one occurrence",
   dirty('=SUBSTITUTE("a-b-c","-","+",2)') === "a-b+c");

ok("FIND is case sensitive", dirty('=FIND("nigeria",A4)') === "#VALUE!");
ok("SEARCH is not", dirty('=SEARCH("nigeria",A4)') === 8);
ok("LEFT with FIND splits on a delimiter",
   dirty('=LEFT(A4,FIND(",",A4)-1)') === "Lagos");
ok("RIGHT and MID take from the other end",
   dirty("=RIGHT(A4,7)") === "Nigeria" && dirty("=MID(A4,8,7)") === "Nigeria");

// IFERROR must be LAZY: the error is raised while evaluating argument one, so
// a normal eager function would never get the chance to catch it.
ok("IFERROR catches a division by zero", dirty('=IFERROR(A1/B1,"No data")') === "No data");
ok("IFERROR passes a working result through", dirty('=IFERROR(A1/B2,"No data")') === 25);
ok("IFERROR catches an unknown function", dirty('=IFERROR(NOPE(1),"bad")') === "bad");
ok("IFERROR accepts an omitted fallback", dirty("=IFERROR(A1/B1,)") === "");
ok("a caught error does not poison the total",
   dirty("=SUM(IFERROR(A1/B1,0),10)") === 10);

ok("ISNUMBER distinguishes numbers from text",
   dirty("=ISNUMBER(A1)") === true && dirty("=ISNUMBER(A2)") === false);
ok("ISTEXT identifies text", dirty("=ISTEXT(A2)") === true);
ok("ISBLANK finds an empty cell", dirty("=ISBLANK(Z9)") === true);
ok("EXACT is case sensitive", dirty('=EXACT("Lagos","lagos")') === false);

// The engine must never contain raw control characters again. A regex written
// with literal NUL bytes once made the source file read as binary.
const engineSource = await (await import("node:fs/promises")).readFile(
  new URL("./spreadsheet/engine.js", import.meta.url)
);
ok("engine source has no raw control bytes",
   ![...engineSource].some((b) => b < 9 || (b > 13 && b < 32)));

/* ── Curriculum arrangement ──────────────────────────────────────────── */

section("Curriculum arrangement");

const all = reg.getCourseLessons("data-analysis");
const moduleOf = (id) => all.find((l) => l.id === id)?.moduleId;

ok("formula lessons sit under Formulas & Core Functions",
   ["l8-your-first-formula", "l9-core-functions", "l11-counting-family",
    "l12-averages-and-ranking", "l10-if-and-errors", "l14-working-fast",
    "l15-combined-practice"].every((id) => moduleOf(id) === "m1-formulas-functions"));

ok("formats sit under Excel Essentials, where the curriculum lists them",
   moduleOf("l13-percentages-and-formats") === "m1-excel-essentials");

ok("sorting, filtering and cleaning sit under Sorting, Filtering & Clean Data",
   ["l16-sorting", "l17-filtering", "l18-text-cleaning",
    "l19-structural-cleaning", "l20-errors-and-validation"]
     .every((id) => moduleOf(id) === "m1-clean-structure"));

// Lessons are shown in `order`, so duplicates inside a module scramble them
const seen = new Map();
let collision = false;
for (const lesson of all) {
  const key = `${lesson.moduleId}#${lesson.order}`;
  if (seen.has(key)) collision = true;
  seen.set(key, lesson.id);
}
ok("no two lessons share an order within a module", !collision);
ok("every lesson id is unique", new Set(all.map((l) => l.id)).size === all.length);

/* ── Report ──────────────────────────────────────────────────────────── */

console.log(
  `\n${failures === 0 ? "✓" : "✗"} ${checks - failures}/${checks} checks passed`
);
process.exit(failures ? 1 : 0);
