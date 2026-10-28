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

import { existsSync, readFileSync } from "node:fs";

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

/* XP is held on the student rather than on the enrolment, so ONE ladder serves
 * every course. That makes the shortest open course the binding constraint:
 * if its full budget does not clear the top threshold, a learner can finish an
 * entire programme and stop a level short of the level it promised.
 *
 * This check walks every open course rather than naming one, so opening a
 * third course cannot reintroduce the problem silently. */
for (const entry of cat.CATALOG.filter((c) => c.status === "open")) {
  const written = reg.getCourseLessons(entry.slug);
  const writtenAtoms = written.reduce((n, lesson) => n + lesson.atoms.length, 0);
  const plannedAtoms = (entry.course?.months || [])
    .flatMap((month) => month.modules)
    .reduce((n, module) => n + (module.atoms || 0), 0);
  const complete = writtenAtoms >= plannedAtoms;

  /* A course still being authored must be measured against what it PROMISES,
   * not against what is written so far. Measuring the written part asks "can a
   * learner reach the top level today?", and for a course four modules into
   * thirty-two the answer is no and ought to be — that learner has not
   * finished the programme, because the programme does not exist yet.
   *
   * So an incomplete course is projected: its planned atom count, converted to
   * lessons at the atoms-per-lesson rate the AUTHORED part of that same course
   * actually runs at. No constant is invented here; the course supplies its own
   * ratio, and the check goes back to measuring reality the moment it is done. */
  const atomsPerLesson = written.length ? writtenAtoms / written.length : 5;
  const projected = Array.from(
    { length: Math.round(plannedAtoms / atomsPerLesson) },
    () => ({ atoms: new Array(Math.round(atomsPerLesson)) })
  );

  const courseBudget = game.courseXpBudget(complete ? written : projected);
  ok(
    `finishing ${entry.slug} reaches the top level${complete ? "" : " (projected from its curriculum)"}`,
    game.getLevel(courseBudget.typical).level === top.level,
    `${entry.slug} yields ${courseBudget.typical}, top needs ${top.minXp}`
  );
}

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

/* ── Chat gate: the way out must exist ───────────────────────────────────
 * The bug this guards: private messaging is off until we know a learner is
 * 18+, which is right. But the only thing that sets the age band was the
 * enrolment form, and an enrolled learner is always routed to the lesson
 * player instead of the enrolment page. Anyone who skipped the form, or who
 * enrolled before it existed, was told "complete your profile" with no
 * profile editor in existence and no route that reached one.
 *
 * A safeguard a learner cannot satisfy is not a safeguard, it is a dead end.
 * These assertions are about reachability, not about the gate itself.
 */
section("Chat gate has a way out");

const onboarding = await import(SRC + "data/onboarding.js");

// The gate itself must stay closed by default — that part was never wrong.
ok("messaging is off when the age is unknown",
  onboarding.chatDefaultFor({}) === false);
ok("messaging is off for under-18s",
  onboarding.chatDefaultFor({ ageBand: onboarding.UNDER_18 }) === false);
ok("messaging is on for a known adult",
  onboarding.chatDefaultFor({ ageBand: "18-24" }) === true);

const profilePage = readFileSync(
  new URL("../../src/academy/pages/AcademyProfile.jsx", import.meta.url),
  "utf8"
);
ok("the profile page can save a profile",
  /saveProfile/.test(profilePage));
ok("the profile page renders the real form, not a second copy of the fields",
  /OnboardingForm/.test(profilePage));
ok("the form is seeded with what is already stored",
  /initialValues=\{student\?\.profile/.test(profilePage));
ok("the profile page shows whether messaging is on",
  /chatEnabled === true/.test(profilePage));
ok("an incomplete profile is called out rather than left to guess",
  /isProfileComplete\(student\?\.profile\)/.test(profilePage));

const form = readFileSync(
  new URL("../../src/academy/components/OnboardingForm.jsx", import.meta.url),
  "utf8"
);
ok("the form supports being reopened for editing",
  /mode = "onboarding"/.test(form) && /const editing = mode === "edit"/.test(form));

// The instruction must point somewhere that can actually fix it.
const socialPane = readFileSync(
  new URL("../../src/academy/components/SocialPane.jsx", import.meta.url),
  "utf8"
);
ok("the chat gate links to the profile rather than just naming it",
  /href="\/academy\/profile"/.test(socialPane));

// saveProfile must keep deriving the flag; taking it from the form would let
// a crafted submission switch the safeguard off.
const svcForChat = readFileSync(
  new URL("../../src/academy/services/academyService.js", import.meta.url),
  "utf8"
);
ok("chatEnabled is derived, never accepted from the form",
  /chatEnabled: chatDefaultFor\(profile\)/.test(svcForChat) &&
  !/chatEnabled: answers/.test(svcForChat));

/* ── Leaderboard visibility, both ways ───────────────────────────────────
 * The bug this guards: "Hide me from the leaderboard" only deleted the row,
 * and awardXp republished it on the learner's next lesson. The privacy
 * control silently undid itself, and the learner had no way to tell.
 *
 * The fix is a STORED preference that publishing checks, and a way back. So
 * the assertions are about the source: the publisher must honour the flag,
 * and the service must expose both directions rather than a one-way exit.
 */
section("Leaderboard visibility");

const svcSource = readFileSync(
  new URL("../../src/academy/services/academyService.js", import.meta.url),
  "utf8"
);

ok("publishing honours a stored opt-out",
  /leaderboardOptOut === true\)\s*return;/.test(svcSource));
ok("the opt-out check comes BEFORE the row is built",
  svcSource.indexOf("leaderboardOptOut === true") <
    svcSource.indexOf("await setDoc(leaderboardRef(uid)"));
ok("visibility can be set both ways, not just off",
  /export async function setLeaderboardVisibility\(user, visible\)/.test(svcSource));
ok("the one-way leaveLeaderboard is gone",
  !/export async function leaveLeaderboard/.test(svcSource));
ok("there is a way to read the current state",
  /export function isOnLeaderboard/.test(svcSource));

// Going private must set the flag before deleting the row: if the delete
// fails, the flag still suppresses republishing on the next award.
const hideBlock = svcSource.slice(
  svcSource.indexOf("export async function setLeaderboardVisibility"),
  svcSource.indexOf("export function isOnLeaderboard")
);
ok("hiding sets the flag before deleting the row",
  hideBlock.indexOf("leaderboardOptOut: true") < hideBlock.indexOf("deleteDoc"));
ok("showing republishes immediately rather than waiting for the next lesson",
  /publishLeaderboardEntry\(user\.uid/.test(hideBlock));

// Both UI surfaces must offer the way back, not just the way out.
for (const [label, file] of [
  ["the lesson pane", "../../src/academy/components/SocialPane.jsx"],
  ["the dashboard panel", "../../src/academy/components/Leaderboard.jsx"],
]) {
  const ui = readFileSync(new URL(file, import.meta.url), "utf8");
  ok(`${label} offers a way back`, /is-show/.test(ui) && /Show me/.test(ui));
  ok(`${label} seeds its state from the stored preference`,
    /isOnLeaderboard\(/.test(ui));
}

// Hiding must cover presence too, or someone hidden from the ranking still
// shows in "Active now".
const pane = readFileSync(
  new URL("../../src/academy/components/SocialPane.jsx", import.meta.url),
  "utf8"
);
ok("hiding also clears presence", /clearPresence\(user\.uid\)/.test(pane));
/* The guard has gained conditions over time (it now also waits for the
   student record), so this asserts the PROPERTY: `hidden` is one of the
   things that stops the heartbeat. Pinning the exact line just broke on the
   next legitimate change. */
const heartbeatGuard = pane.slice(
  pane.indexOf("return startPresenceHeartbeat") - 400,
  pane.indexOf("return startPresenceHeartbeat")
);
ok("the heartbeat stops while hidden",
  /\|\| hidden[^)]*\) return;/.test(heartbeatGuard));

/* ── Continue learning ───────────────────────────────────────────────────
 * The landing page greeted an enrolled learner exactly like a stranger —
 * "Enroll now" at the top, and the only way back to their course a button at
 * the bottom of a long page. pickContinue decides what to offer them, and is
 * tested here against the real curriculum, not a fixture.
 */
section("Continue learning");

const cont = await import(SRC + "data/continueLearning.js");
const helpers = {
  getCatalogEntry: cat.getCatalogEntry,
  getCourseLessons: reg.getCourseLessons,
  getResumeLesson: reg.getResumeLesson,
};
const daL = reg.getCourseLessons("data-analysis");

ok("nobody enrolled gets nothing", cont.pickContinue([], helpers) === null);
ok("no enrolments list gets nothing", cont.pickContinue(null, helpers) === null);

const fresh = cont.pickContinue(
  [{ courseId: "data-analysis", completedLessons: [] }],
  helpers
);
ok("a new enrolment offers the first lesson",
  fresh?.lesson?.id === daL[0].id, fresh?.lesson?.id);
ok("and says 0%", fresh?.percent === 0);
ok("and links straight into that lesson",
  fresh?.href === `/academy/learn/data-analysis/${daL[0].id}`, fresh?.href);

const mid = cont.pickContinue(
  [{ courseId: "data-analysis", completedLessons: daL.slice(0, 5).map((l) => l.id) }],
  helpers
);
ok("part-way through resumes at the next unfinished lesson",
  mid?.lesson?.id === daL[5].id, mid?.lesson?.id);
ok("its percentage matches the real lesson count",
  mid?.percent === Math.round((5 / daL.length) * 100), `${mid?.percent}%`);
ok("it names the next lesson", typeof mid?.lesson?.title === "string" && mid.lesson.title.length > 0);

const done = cont.pickContinue(
  [{ courseId: "data-analysis", completedLessons: daL.map((l) => l.id) }],
  helpers
);
ok("a finished course is marked finished", done?.finished === true);
ok("and offers review, not a lesson that does not exist",
  done?.lesson === null && done?.href === "/academy/learn");
ok("at 100%", done?.percent === 100);

// A course that is not open must never produce a button into the player.
// Uses a REAL catalog course that is not open. This first used an id that
// does not exist, which only proved a missing entry is skipped — removing
// the status check entirely still passed it.
const closedCourse = cat.CATALOG.find((c) => c.status !== "open");
ok("the catalog has a course that is not open to test with", Boolean(closedCourse),
  closedCourse?.slug);
ok("an enrolment in a real course that is not open is ignored",
  cont.pickContinue(
    [{ courseId: closedCourse.slug, completedLessons: [], updatedAt: { toMillis: () => 9e12 } }],
    helpers
  ) === null,
  closedCourse?.slug);
ok("even when it is the most recent, the open course is offered instead",
  cont.pickContinue(
    [
      { courseId: closedCourse.slug, completedLessons: [], updatedAt: { toMillis: () => 9e12 } },
      { courseId: "data-analysis", completedLessons: [], updatedAt: { toMillis: () => 1 } },
    ],
    helpers
  )?.slug === "data-analysis");
ok("an id that does not exist is ignored",
  cont.pickContinue([{ courseId: "does-not-exist", completedLessons: [] }], helpers) === null);

// Most recent wins, so nobody is sent back to a course they abandoned.
const openCourses = cat.CATALOG.filter((c) => c.status === "open").map((c) => c.slug);
if (openCourses.length >= 2) {
  const [a, b] = openCourses;
  const pick = cont.pickContinue(
    [
      { courseId: a, completedLessons: [], updatedAt: { toMillis: () => 1000 } },
      { courseId: b, completedLessons: [], updatedAt: { toMillis: () => 9000 } },
    ],
    helpers
  );
  ok("the most recently active course is the one offered", pick?.slug === b, pick?.slug);
  ok("and the others are counted", pick?.otherCount === 1);
} else {
  // Only one open course today; assert the ordering rule on the same course
  // twice so the recency sort is still exercised.
  const pick = cont.pickContinue(
    [
      { courseId: "data-analysis", completedLessons: [], updatedAt: { toMillis: () => 1000 } },
      {
        courseId: "data-analysis",
        completedLessons: daL.slice(0, 3).map((l) => l.id),
        updatedAt: { toMillis: () => 9000 },
      },
    ],
    helpers
  );
  ok("the most recently active enrolment is the one offered",
    pick?.lesson?.id === daL[3].id, pick?.lesson?.id);
  ok("and the others are counted", pick?.otherCount === 1);
}

// Falls back to enrolledAt when a course was joined and never touched.
const byEnrol = cont.pickContinue(
  [
    { courseId: "data-analysis", completedLessons: [], enrolledAt: { toMillis: () => 5 } },
  ],
  helpers
);
ok("an untouched enrolment still counts", byEnrol?.slug === "data-analysis");

// The landing page must stop offering onboarding to a returning learner.
const landing = readFileSync(
  new URL("../../src/academy/pages/AcademyLanding.jsx", import.meta.url),
  "utf8"
);
ok("the landing page shows the continue card", /<ContinueLearning user=\{user\}/.test(landing));
ok("it sits above the headline, not at the bottom of the page",
  landing.indexOf("<ContinueLearning") < landing.indexOf("ac-hero__title"));
ok("Enroll now is only offered once we know they are new",
  /\{returning === false && \(\s*<button/.test(landing));

/* ── Sign-up and enrolment are separate ──────────────────────────────────
 * The Student entity and the Enrollment entity had grown into one operation:
 * enroll() called ensureStudent(), so a person became a student by committing
 * to a course rather than by signing up. That left anyone who registered and
 * browsed without enrolling with no student record and no Memora ID, and it
 * re-ran the identity step — and announced it — on every later enrolment.
 *
 * These assertions pin the separation at the source, because it is the kind
 * of coupling that reappears the moment somebody needs a student record
 * inside an enrolment path and reaches for the convenient call.
 */
section("Sign-up and enrolment are separate entities");

const svc = readFileSync(
  new URL("../../src/academy/services/academyService.js", import.meta.url),
  "utf8"
);
const enrollBody = svc.slice(
  svc.indexOf("export async function enroll("),
  svc.indexOf("export async function getEnrollment(")
);

ok("enroll() does not create the student record",
  !/ensureStudent\s*\(/.test(enrollBody));
ok("enroll() asserts the student already exists",
  /NO_STUDENT_RECORD/.test(enrollBody));
ok("enroll() refuses a course that is not open",
  /COURSE_NOT_OPEN/.test(enrollBody));
ok("enroll() stamps the silent course id on the enrolment",
  /courseCode/.test(enrollBody));
ok("enroll() records the permanent enrolment reference",
  /enrollmentRefFor/.test(enrollBody));
ok("sign-up happens in the route guard instead",
  /ensureStudent/.test(readFileSync(
    new URL("../../src/academy/components/AcademyRoute.jsx", import.meta.url), "utf8")));
ok("certificates are never fetched for a defaulted course",
  !/getCertificate\(uid, courseSlug = /.test(svc));
ok("enrolments come back sorted by recency, not by document key",
  /sortByRecency\(snap\.docs/.test(svc));

const model = await import(SRC + "data/enrollment.js");

ok("an enrolment reference joins the two permanent ids",
  model.enrollmentRef("MS-2026-000123", "CS-101") === "MS-2026-000123/CS-101");
ok("an incomplete reference is null rather than half a string",
  model.enrollmentRef("MS-2026-000123", null) === null);

const twoCourses = [
  { courseId: "data-analysis", completedLessons: [], updatedAt: { toMillis: () => 1000 } },
  { courseId: "cybersecurity", completedLessons: [], updatedAt: { toMillis: () => 9000 } },
];
ok("the most recent enrolment sorts first",
  model.sortByRecency(twoCourses)[0].courseId === "cybersecurity");

const listed = model.listEnrollments(twoCourses, helpers);
ok("every open enrolment is listed, not just one", listed.length === 2);
ok("and the most recent leads", listed[0].slug === "cybersecurity");
ok("each carries its own silent course id",
  listed.every((c) => typeof c.courseCode === "string" && c.courseCode.length > 0),
  listed.map((c) => c.courseCode).join(", "));
ok("a course enrolled on but never opened is not described as started",
  listed.every((c) => c.started === false));

const startedOne = model.listEnrollments(
  [{ courseId: "cybersecurity", completedLessons: [], updatedAt: { toMillis: () => 1 },
     position: { lessonId: "cs-l1-security-is-a-tradeoff" } }],
  helpers
);
ok("opening a lesson marks the course started", startedOne[0].started === true);
ok("an enrolment in a course that is not open is dropped",
  model.listEnrollments(
    [{ courseId: closedCourse.slug, completedLessons: [] }], helpers).length === 0);

/* ── Errors say nothing about the database ───────────────────────────────
 * Two screens rendered err.message straight from the SDK, and both carried a
 * branch that told the learner to deploy firestore.rules. That is an
 * instruction to an engineer shown to a student, and it names the storage
 * layer, the control and the deployment state in one sentence.
 *
 * The assertion that matters is the last one: no message this layer can
 * produce contains a word that describes our infrastructure.
 */
section("Error messages leak nothing");

const errs = await import(SRC + "services/errors.js");

ok("a permission refusal is not described as a permission refusal",
  !/permission|rule|denied/i.test(errs.toUserError({ code: "permission-denied" }).message));
ok("an unclassified failure still produces safe copy",
  Boolean(errs.toUserError(new Error("Missing or insufficient permissions.")).message));
ok("the caller's fallback is used only when unclassified",
  errs.toUserError({ code: "unavailable" }, errs.ERROR_CODES.NOT_FOUND).code ===
    errs.ERROR_CODES.UNAVAILABLE);
ok("a domain error maps to its own case",
  errs.toUserError(new errs.AcademyError("USERNAME_TAKEN")).code ===
    errs.ERROR_CODES.USERNAME_TAKEN);
ok("every case offers an honest retry flag",
  Object.values(errs.ERROR_CODES).every(
    (c) => typeof errs.toUserError({}, c).canRetry === "boolean"));

const FORBIDDEN = [
  "firestore", "firebase", "collection", "document", "rules",
  "permission-denied", "deploy", "dev server", "uid", "token", "sdk", "database",
];
const everyMessage = Object.values(errs.ERROR_CODES)
  .map((c) => {
    const e = errs.toUserError({}, c);
    return `${e.title} ${e.message}`;
  })
  .join(" ")
  .toLowerCase();
const leaked = FORBIDDEN.filter((word) => everyMessage.includes(word));
ok("no learner-facing message names our infrastructure",
  leaked.length === 0, leaked.join(", "));

/* The two screens that used to print the deployment instruction. */
for (const file of ["components/AcademyRoute.jsx", "pages/AcademyEnroll.jsx"]) {
  const source = readFileSync(
    new URL(`../../src/academy/${file}`, import.meta.url), "utf8");
  ok(`${file} no longer tells the learner to deploy anything`,
    !/firestore\.rules|have not been deployed/.test(source));
}

/* ── The account badge and signing in ────────────────────────────────────
 * Two faults, both about being stuck:
 *
 *   The badge in the top right was a plain link straight to the profile, so
 *   there was NO way to sign out anywhere in the Academy — not on desktop,
 *   not on a phone.
 *
 *   "Log in" called enroll(), which routes to /academy/enroll. It showed a
 *   list of courses and never offered anywhere to sign in. That was true on
 *   every device; it was noticed on a phone.
 *
 * The signed-out path is covered end to end by scripts that drive the built
 * app in a browser. These assertions cover the signed-in menu, which needs
 * real credentials to click through.
 */
/* ── Certification: four states, and a real lock ─────────────────────────
 * The profile showed one line to every learner on every course:
 *
 *     Not yet issued
 *     A certificate is issued when you pass the final certification exam.
 *
 * which reads equally as "you have not earned it", "you have not sat it" and
 * "we have not built it" — and for Cybersecurity the last was actually true,
 * because no exam exists for it. One sentence covering four situations and
 * describing none of them.
 *
 * The exam gate was also broken rather than merely advisory: it tested
 * `p.assessmentPassed || p.completed`, and no progress document has ever
 * carried either field, so every candidate was told they had finished nothing.
 */
section("Certification states and the exam gate");

const certMod = await import(SRC + "data/certification.js");
const { BLUEPRINT } = await import("./finalExam/blueprint.js");

/* The client mirrors the blueprint's module list rather than importing it,
   because the blueprint sits beside the question bank. Mirrors drift, so the
   two are compared here. */
const mirrored = certMod.CERTIFICATION[BLUEPRINT.courseId]?.requiresModules || [];
ok("the client's required-module list matches the blueprint exactly",
  mirrored.length === BLUEPRINT.requiresModules.length &&
    mirrored.every((m, i) => m === BLUEPRINT.requiresModules[i]),
  `client ${mirrored.length}, blueprint ${BLUEPRINT.requiresModules.length}`);
ok("and so do the pass marks",
  certMod.CERTIFICATION[BLUEPRINT.courseId].passMark === BLUEPRINT.passMark &&
    certMod.CERTIFICATION[BLUEPRINT.courseId].domainMinimum === BLUEPRINT.domainMinimum);

/* The definition of a passed lesson. This is the bug that made the gate
   useless, so it is pinned on the real document shape recordAssessment writes. */
ok("a lesson counts as passed only from assessment.passed",
  certMod.lessonPassed({ assessment: { passed: true } }) === true &&
  certMod.lessonPassed({ assessment: { passed: false } }) === false &&
  certMod.lessonPassed({ assessmentPassed: true }) === false &&
  certMod.lessonPassed(undefined) === false);

const daOutline = reg.getCourseOutline("data-analysis");
const daLessonIds = reg.getCourseLessons("data-analysis").map((l) => l.id);
const allPassed = Object.fromEntries(
  daLessonIds.map((id) => [id, { assessment: { passed: true } }])
);

const certFresh = certMod.certificationState({
  courseId: "data-analysis",
  outline: daOutline,
  progressByLesson: {},
});
ok("a learner who has done nothing is locked, not 'not yet issued'",
  certFresh.state === "locked");
ok("and is told exactly which modules are outstanding",
  certFresh.outstanding.length > 0 && certFresh.outstanding.every((t) => typeof t === "string"),
  `${certFresh.outstanding.length} modules`);
ok("with a progress figure rather than a bare refusal",
  certFresh.percent === 0 && certFresh.requiredCount > 0);

const finished = certMod.certificationState({
  courseId: "data-analysis",
  outline: daOutline,
  progressByLesson: allPassed,
});
ok("finishing every lesson unlocks the exam", finished.state === "ready",
  finished.outstanding.join(", "));
ok("and nothing is left outstanding", finished.outstanding.length === 0);

ok("a held certificate outranks progress",
  certMod.certificationState({
    courseId: "data-analysis",
    certificate: { id: "MST-CERT-2026-000001" },
    outline: daOutline,
    progressByLesson: {},
  }).state === "certified");

/* Every registered exam, not only the first, must be mirrored exactly by the
   client and must unlock when (and only when) its course is finished. */
const { EXAMS: ALL_EXAMS } = await import("./finalExam/registry.js");
for (const { blueprint: bp } of Object.values(ALL_EXAMS)) {
  const client = certMod.CERTIFICATION[bp.courseId];
  ok(`${bp.courseId}: the client knows this exam by the same id and code`,
    client?.examId === bp.id && client?.courseCode === bp.courseCode,
    `client ${client?.examId}/${client?.courseCode}, blueprint ${bp.id}/${bp.courseCode}`);
  ok(`${bp.courseId}: the client's module list and marks mirror the blueprint`,
    Boolean(client) &&
      client.requiresModules.join() === bp.requiresModules.join() &&
      client.passMark === bp.passMark &&
      client.domainMinimum === bp.domainMinimum &&
      client.durationMinutes === bp.durationMinutes &&
      client.questionCount === bp.domains.reduce((n, d) => n + d.items.core + d.items.advanced, 0));
  const outline = reg.getCourseOutline(bp.courseId);
  ok(`${bp.courseId}: the exam requires every module of the course`,
    outline.flatMap((m) => m.modules.map((x) => x.id)).join() === bp.requiresModules.join());
  const every = Object.fromEntries(
    reg.getCourseLessons(bp.courseId).map((l) => [l.id, { assessment: { passed: true } }])
  );
  ok(`${bp.courseId}: locked at the start, ready once every lesson is passed`,
    certMod.certificationState({ courseId: bp.courseId, outline, progressByLesson: {} }).state === "locked" &&
      certMod.certificationState({ courseId: bp.courseId, outline, progressByLesson: every }).state === "ready");
  ok(`${bp.courseId}: the exam link is the course's own exam page`,
    client?.path === (bp.courseId === "data-analysis" ? "/academy/exam" : `/academy/exam/${bp.courseId}`));
}

/* Cybersecurity has no exam. That must read as "not open yet", not as a lock
   the learner could somehow satisfy. */
ok("a course with no exam is 'unavailable', not 'locked'",
  certMod.certificationState({
    courseId: "cybersecurity",
    outline: reg.getCourseOutline("cybersecurity"),
    progressByLesson: {},
  }).state === "unavailable");
ok("every state has its own copy",
  ["certified", "ready", "locked", "unavailable"].every(
    (s) => certMod.CERTIFICATION_COPY[s]?.heading));

/* The gate is enforced where it cannot be bypassed. */
const recordSrc = readFileSync(
  new URL("./finalExam/record.js", import.meta.url), "utf8");
ok("the server checks eligibility before issuing a certificate",
  /async function checkEligibility\(/.test(recordSrc) &&
  // Compare the CALL sites. issueCertificate is declared above both, so
  // matching its bare name found the declaration and always passed.
  // Both calls must exist: a missing check is -1, which is "before" anything.
  recordSrc.indexOf("await checkEligibility(db, candidate.uid") > -1 &&
  recordSrc.indexOf("await checkEligibility(db, candidate.uid") <
    recordSrc.indexOf("await issueCertificate(db, candidate, result"));
ok("it reads the same field the learner's lessons write",
  /assessment\?\.passed === true/.test(recordSrc));
ok("an undetermined eligibility withholds rather than issues",
  /undetermined: true/.test(recordSrc));
ok("the attempt is still recorded when the certificate is withheld",
  /certificateWithheld/.test(recordSrc) && /recorded: true/.test(recordSrc));

const examSrc = readFileSync(
  new URL("../../src/academy/pages/FinalExam.jsx", import.meta.url), "utf8");
ok("the exam page no longer merely warns an unready candidate",
  !/You can still sit it/.test(examSrc));
ok("anything other than a confirmed ready state is locked",
  /const locked = readiness\?\.state !== "ready"/.test(examSrc));
ok("and starting is refused even if the button is reached",
  /if \(locked\) return;/.test(examSrc));

/* ── The profile shows every course, collapsed ───────────────────────────
 * It used to render a flat lesson table per course, always open: about 150
 * rows for a learner on both courses, with the summary buried above them.
 */
section("Profile course records");

const profileSrc = readFileSync(
  new URL("../../src/academy/pages/AcademyProfile.jsx", import.meta.url), "utf8");
const recordSrcUi = readFileSync(
  new URL("../../src/academy/components/CourseRecord.jsx", import.meta.url), "utf8");

ok("every enrolment gets a record, not just the first",
  /enrollments\.map\(/.test(profileSrc));
ok("each one is collapsible", /aria-expanded=\{open\}/.test(recordSrcUi));
ok("and collapsed by default unless it is the only course",
  /defaultOpen=\{index === 0 && enrollments\.length === 1\}/.test(profileSrc));
/* The expanded view is the ORIGINAL table, unchanged. An attempt to replace
   it with a nested "journey" view was worse than what it replaced: the table
   answers "what have I done and what is left" across five columns at a
   glance, and the replacement buried the same facts three levels deep. The
   only thing that changed is that it now toggles. */
ok("the expanded view is the lesson table, with its original columns",
  /ac-record__table/.test(recordSrcUi) &&
  ["Lesson", "Atoms", "Attempts", "Best score", "Status"].every(
    (col) => recordSrcUi.includes(`<th>${col}</th>`)));
ok("the header keeps the summary visible while collapsed",
  recordSrcUi.indexOf("ac-record__percent") <
    recordSrcUi.indexOf("ac-record__panel") &&
  recordSrcUi.indexOf("ac-resume__bar") < recordSrcUi.indexOf("ac-record__panel"));
ok("and the record reuses the existing status chips rather than new ones",
  /ac-recordstatus--/.test(recordSrcUi) && !/ac-journey/.test(recordSrcUi));
ok("certification is rendered per course, inside the course",
  /certificationState/.test(recordSrcUi));
/* The phrase survives in comments explaining what it replaced, which is
   wanted. What must not survive is anything that RENDERS it. */
const stripComments = (src) =>
  src.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");
ok("the ambiguous 'Not yet issued' line is no longer rendered anywhere",
  !/Not yet issued/.test(stripComments(profileSrc)) &&
  !/Not yet issued/.test(stripComments(recordSrcUi)));

/* ── The onboarding form is grouped ──────────────────────────────────── */
section("Onboarding form structure");

const obForm = await import(SRC + "data/onboarding.js");
const groupedIds = obForm.ONBOARDING_GROUPS.flatMap((g) => g.fields);
ok("every field appears in exactly one group",
  groupedIds.length === obForm.ONBOARDING_FIELDS.length &&
  new Set(groupedIds).size === groupedIds.length &&
  obForm.ONBOARDING_FIELDS.every((f) => groupedIds.includes(f.id)),
  `${groupedIds.length} grouped of ${obForm.ONBOARDING_FIELDS.length}`);
ok("the first group carries every required field",
  obForm.REQUIRED_FIELDS.every((id) => obForm.ONBOARDING_GROUPS[0].fields.includes(id)),
  obForm.ONBOARDING_GROUPS[0].fields.join(", "));
ok("and the later groups carry none of them",
  obForm.ONBOARDING_GROUPS.slice(1).every(
    (g) => !g.fields.some((id) => obForm.REQUIRED_FIELDS.includes(id))));

const formSrc = readFileSync(
  new URL("../../src/academy/components/OnboardingForm.jsx", import.meta.url), "utf8");
ok("the form renders by group", /ONBOARDING_GROUPS\.map/.test(formSrc));
ok("and shows how much of the requirement is done",
  /requiredDone/.test(formSrc) && /ac-ob__meter/.test(formSrc));

section("Account menu and sign-in");

const nav = readFileSync(
  new URL("../../src/academy/components/AcademyNav.jsx", import.meta.url),
  "utf8"
);

ok("Log in navigates to the auth page", /navigate\("\/auth", \{/.test(nav));
ok("and sends the learner back where they were, not to the CV dashboard",
  /state: \{ from: `\$\{location\.pathname\}\$\{location\.hash \|\| ""\}` \}/.test(nav));
ok("neither Log in button calls enroll any more",
  (nav.match(/onClick=\{login\}/g) || []).length === 2,
  `${(nav.match(/onClick=\{login\}/g) || []).length} login handlers`);

// Signing out has to exist, and has to land somewhere public.
ok("there is a sign-out handler", /const signOut = async \(\) => \{/.test(nav));
ok("it calls logout from the auth context", /await logout\(\);/.test(nav));
ok("it leaves for a public page even if logout throws",
  /\} finally \{[\s\S]{0,220}?navigate\("\/academy"\);/.test(nav));

// The badge is a menu, not a link.
ok("the badge opens a menu", /aria-haspopup="menu"/.test(nav));
ok("its state is exposed to assistive tech", /aria-expanded=\{accountOpen\}/.test(nav));
ok("the menu offers the profile", /to="\/academy\/profile"[\s\S]{0,200}?Your profile/.test(nav));
ok("the menu offers a way out", /is-signout[\s\S]{0,200}?Log out/.test(nav));
ok("it says which account is signed in", /Signed in as/.test(nav));

/* A dropdown with no way to dismiss it is a trap on a touch screen, where
   there is no cursor to move away from it. */
ok("an outside tap closes it", /if \(!accountRef\.current\?\.contains\(e\.target\)\)/.test(nav));
ok("Escape closes it", /if \(e\.key === "Escape"\) setAccountOpen\(false\)/.test(nav));
ok("navigating closes both menus",
  /setAccountOpen\(false\);\s*setMenuOpen\(false\);\s*\}, \[location\.pathname\]\)/.test(nav));
ok("the pointer listener is removed again",
  /removeEventListener\("pointerdown", onPointerDown\)/.test(nav));

/* The desktop menu lives in .ac-nav__actions, which the stylesheet hides
   below 1000px — so a phone needs its own way to the profile and out. */
const css = readFileSync(
  new URL("../../src/academy/academy.css", import.meta.url),
  "utf8"
);
ok("the desktop actions really are hidden on a phone",
  /@media \(max-width: 1000px\)[\s\S]{0,200}?\.ac-nav__actions \{\s*display: none;/.test(css));
ok("so the mobile sheet carries sign-out too", /ac-sheet__signout/.test(nav));
ok("and a link to the profile",
  /to="\/academy\/profile"[\s\S]{0,260}?ac-btn--block/.test(nav));
ok("and names the signed-in account", /ac-sheet__who/.test(nav));

/* ── Share previews ──────────────────────────────────────────────────────
 * The bug: every shared link showed the CV builder's description, because
 * one index.html served every route and its Open Graph tags were hardcoded
 * to one product. Social crawlers do not run JavaScript, so the runtime
 * useSEO hook could never have fixed it.
 *
 * This guards the parts that silently rot: a route added to routeMeta but not
 * to vercel.json would quietly fall back to the catch-all and show the wrong
 * preview again, and nobody would notice until someone shared it.
 */
section("Share previews (per-route meta)");

const seo = await import(SRC + "../seo/routeMeta.js");
const vercel = JSON.parse(
  readFileSync(new URL("../../vercel.json", import.meta.url), "utf8")
);
const indexHtml = readFileSync(
  new URL("../../index.html", import.meta.url),
  "utf8"
);

ok("the root has its own metadata", Boolean(seo.ROUTE_META["/"]));
ok("every route has a title and a description",
  seo.PRERENDER_ROUTES.every((r) => {
    const m = seo.ROUTE_META[r];
    return m?.title?.length > 10 && m?.description?.length > 40;
  }));

// Copy-paste is the likely failure: two routes sharing a description means
// two different pages preview identically.
const descriptions = seo.PRERENDER_ROUTES.map((r) => seo.ROUTE_META[r].description);
ok("no two routes share a description",
  new Set(descriptions).size === descriptions.length);
const titles = seo.PRERENDER_ROUTES.map((r) => seo.ROUTE_META[r].title);
ok("no two routes share a title", new Set(titles).size === titles.length);

// The specific bug: the root must not describe the CV builder.
const root = seo.ROUTE_META["/"];
ok("the root describes the company, not one product",
  !/^AI CV Builder/i.test(root.title) && /Memora Smart Technologies/i.test(root.title),
  root.title);
ok("the CV builder still describes itself",
  /CV/i.test(seo.ROUTE_META["/cv-builder"].title));
ok("the Academy describes itself",
  /Academy/i.test(seo.ROUTE_META["/academy"].title));

// The static fallback in index.html is what an unlisted route shows.
ok("index.html's fallback is not a single product's pitch",
  !/AI CV Builder for Nigerians/.test(indexHtml),
  "og:title still hardcoded to the CV builder");

// Every prerendered route needs a rewrite, or Vercel's catch-all serves the
// root HTML and the preview is wrong again.
const sources = new Set((vercel.rewrites || []).map((r) => r.source));
const missing = seo.PRERENDER_ROUTES.filter(
  (r) => r !== "/" && !sources.has(r)
);
ok("every prerendered route has a vercel rewrite", missing.length === 0,
  missing.join(", "));

ok("the SPA catch-all is still last",
  (vercel.rewrites || [])[vercel.rewrites.length - 1]?.source === "/(.*)");

// Private screens must not be indexable or previewable.
ok("the lesson player is noindex", seo.shouldNoIndex("/academy/learn/data-analysis/l1"));
ok("the dashboard is noindex", seo.shouldNoIndex("/dashboard/cvs"));
ok("a public page is indexable", !seo.shouldNoIndex("/cv-builder"));

// Longest-prefix resolution, so /academy/courses does not inherit /academy.
ok("an exact route wins",
  seo.metaForPath("/academy/courses").title === seo.ROUTE_META["/academy/courses"].title);
ok("an unknown path falls back to the root",
  seo.metaForPath("/nothing-here").title === root.title);

/* ── Onboarding and the under-18 safeguard ───────────────────────────────
 * The age band is not collected for analytics — it decides whether private,
 * unmoderatable messaging is on. So the default must be protective, and the
 * "we do not know" case must behave like a child rather than like an adult.
 */
section("Onboarding and the under-18 safeguard");

const ob = await import(SRC + "data/onboarding.js");

ok("three fields are required", ob.REQUIRED_FIELDS.length === 3,
  ob.REQUIRED_FIELDS.join(", "));
ok("the age band is one of them", ob.REQUIRED_FIELDS.includes("ageBand"));
/* The username is required because there is no safe fallback for it: showing
   the real name is the very thing it removes, and showing something
   anonymous makes a leaderboard meaningless. */
ok("the username is one of them", ob.REQUIRED_FIELDS.includes("username"));
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
ok("username, phone and age band count as complete",
  ob.isProfileComplete({
    username: "ada_codes", phone: "08031234567", ageBand: "18-24",
  }) === true);
ok("a profile with no username is incomplete",
  ob.isProfileComplete({ phone: "08031234567", ageBand: "18-24" }) === false);
ok("whitespace does not count as an answer",
  ob.isProfileComplete({
    username: "ada_codes", phone: "   ", ageBand: "18-24",
  }) === false);

// Validation has to accept real Nigerian numbers written various ways, and
// still reject obvious rubbish.
const VALID = { username: "ada_codes", phone: "08031234567", ageBand: "18-24" };

const good = ["08031234567", "0803 123 4567", "+234 803 123 4567", "+2348031234567"];
ok("real phone formats are accepted",
  good.every((v) => !ob.validateProfile({ ...VALID, phone: v }).phone),
  good.join(" | "));
const bad = ["123", "", "abc"];
ok("obvious rubbish is rejected",
  bad.every((v) => Boolean(ob.validateProfile({ ...VALID, phone: v }).phone)));
ok("a missing age band is reported",
  Boolean(ob.validateProfile({ username: "ada_codes", phone: "08031234567" }).ageBand));
ok("optional fields left blank produce no error",
  Object.keys(ob.validateProfile(VALID)).length === 0);
ok("an over-long goal is rejected",
  Boolean(ob.validateProfile({ ...VALID, goal: "x".repeat(400) }).goal));

/* ── The username, which is the only name other learners ever see ──────
 * Before it existed these surfaces published `displayName` — the real name
 * from the Google account. A teenager studying Excel had their legal name
 * shown to every stranger on the leaderboard. */
const uname = (v) => ob.validateProfile({ ...VALID, username: v }).username;

ok("a reasonable username is accepted", !uname("ada_codes"));
ok("too short is rejected", Boolean(uname("ab")));
ok("too long is rejected", Boolean(uname("a".repeat(21))));
ok("spaces are rejected", Boolean(uname("ada codes")));
ok("punctuation that could impersonate is rejected", Boolean(uname("ada@codes")));
ok("it cannot start or end with a separator",
  Boolean(uname("_ada")) && Boolean(uname("ada.")));
ok("no doubled separators", Boolean(uname("ada..codes")));

// Reserved names are the impersonation that matters: a learner called
// "admin" in a chat list can pose as the platform itself.
ok("reserved names are refused",
  ["admin", "Memora", "SUPPORT", "moderator"].every((v) => Boolean(uname(v))),
  "admin/Memora/SUPPORT/moderator");
ok("the reserved list is checked case-insensitively", Boolean(uname("AdMiN")));

// Claims are keyed lower-cased, so two names that look the same in a list
// cannot both be held.
ok("claim keys are case-folded",
  ob.usernameKey(" Ada_Codes ") === "ada_codes");

// The public name must never fall back to the real one.
ok("the public name is the username",
  ob.publicNameFor({ username: "ada_codes" }) === "ada_codes");
ok("it reads a username nested in a profile",
  ob.publicNameFor({ profile: { username: "ada_codes" } }) === "ada_codes");
ok("with no username it is anonymous, NOT the real name",
  ob.publicNameFor({ displayName: "Ada Real Name" }) === "Memora learner");
ok("an empty username does not leak the real name",
  ob.publicNameFor({ username: "   ", displayName: "Ada Real Name" })
    === "Memora learner");

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
  const lbBlock = rulesText.slice(rulesText.indexOf("match /leaderboard/"));
  const hasOnly = lbBlock.match(/hasOnly\(\[([^\]]*)\]\)/);
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
const lbRule = rulesText.slice(
  rulesText.indexOf("match /leaderboard/"),
  rulesText.indexOf("match /leaderboard/") + 900
);
ok("the leaderboard requires sign-in to read",
  /allow read: if isLoggedIn\(\);/.test(lbRule));
ok("only the owner may write their own leaderboard row",
  /allow create, update: if isOwner\(userId\)/.test(lbRule));
ok("a row must be stamped with its own owner's uid",
  /request\.resource\.data\.uid == userId/.test(lbRule));

/* ── The regressions that a rules rewrite keeps reintroducing ──────────
 * Each of these was live at some point and each breaks something quietly.
 */
ok("exam attempts are NOT client-writable",
  /match \/examAttempts\/\{attemptId\}[\s\S]{0,200}?allow write: if false;/.test(
    rulesText
  ));
ok("no catch-all subcollection rule under students",
  !/match \/\{subcollection\}\/\{docId\}[\s\S]{0,120}?allow write: if isOwner\(userId\)/.test(
    rulesText
  ));
ok("a report must name its real author",
  /request\.resource\.data\.byUid == request\.auth\.uid/.test(rulesText));
ok("messages resolve membership from the id, not a get() on the parent",
  /function inConversationId/.test(rulesText) &&
  !/get\(\/databases\/\$\(database\)\/documents\/conversations\//.test(rulesText));
ok("username claims cannot be reassigned",
  /match \/usernames\/\{usernameKey\}[\s\S]{0,260}?allow update, delete: if false;/.test(
    rulesText
  ));

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

/* ── Object Oriented Programming (JavaScript) ────────────────────────────
 * The course is authored from a numbered curriculum table: 1.1 to 15.10,
 * plus the event-loop note in Week 13 and the capstone requirements. Every
 * lesson declares which numbers it `covers`. These checks are what stop a
 * topic from being dropped quietly, or taught in a week it does not belong to.
 */
section("Object Oriented Programming (JavaScript)");

const { JAVASCRIPT_COURSE, JAVASCRIPT_MODULE_IDS } = await import(
  SRC + "data/javascriptCourse.js"
);
const jsEntry = cat.getCatalogEntry("javascript");
ok("the course is in the catalog and open", jsEntry?.status === "open" && jsEntry.course === JAVASCRIPT_COURSE);
ok("it carries a permanent course code", jsEntry?.code === "JS-101");
ok("it is one of the enrollable courses", cat.COURSES.includes(JAVASCRIPT_COURSE));
ok("sixteen weeks, one module each", JAVASCRIPT_MODULE_IDS.length === 16);
ok("every week number appears exactly once across the phases",
  JAVASCRIPT_COURSE.phases.flatMap((p) => p.weeks).sort((a, b) => a - b).join() ===
    Array.from({ length: 16 }, (_, i) => i + 1).join());

const jsLessons = reg.getCourseLessons("javascript");
const jsOutline = reg.getCourseOutline("javascript");
const jsModules = JAVASCRIPT_COURSE.months.flatMap((m) => m.modules);
const writtenWeeks = jsModules.filter((m) => jsLessons.some((l) => l.moduleId === m.id));

ok("lessons load through the shared registry", jsLessons.length > 0, `${jsLessons.length} lessons`);
ok("the outline marks written weeks ready",
  writtenWeeks.every((m) => jsOutline.flatMap((x) => x.modules).find((o) => o.id === m.id)?.ready));

// Weeks must be written in order: a learner may never reach a written week by
// passing through an unwritten one.
const firstGap = jsModules.findIndex((m) => !writtenWeeks.includes(m));
ok("written weeks form an unbroken run from Week 1",
  firstGap === -1 || jsModules.slice(firstGap).every((m) => !writtenWeeks.includes(m)),
  firstGap === -1 ? "all 16 written" : `first unwritten week: ${firstGap + 1}`);

for (const module of writtenWeeks) {
  const lessonsHere = jsLessons.filter((l) => l.moduleId === module.id);
  const covered = new Set(lessonsHere.flatMap((l) => l.covers || []));
  const required = module.curriculum.map(([n]) => n);
  const missing = required.filter((n) => !covered.has(n));
  const foreign = [...covered].filter((n) => !required.includes(n));
  ok(`${module.title.split(" · ")[0]}: every curriculum topic is taught`,
    missing.length === 0, missing.join(", "));
  ok(`${module.title.split(" · ")[0]}: no lesson claims a topic from another week`,
    foreign.length === 0, foreign.join(", "));
  ok(`${module.title.split(" · ")[0]}: the last lesson carries the week's practical work`,
    Boolean(lessonsHere[lessonsHere.length - 1]?.task?.prompts?.length));
}

// Curriculum order inside a week: lesson N never covers a topic numbered
// before one already covered by lesson N-1. That is the order of the table.
const topicKey = (n) => n.split(".").map((p) => (/^\d+$/.test(p) ? Number(p) : 99));
const before = (a, b) => {
  const [x, y] = [topicKey(a), topicKey(b)];
  return x[0] < y[0] || (x[0] === y[0] && x[1] < y[1]);
};
let outOfOrder = "";
for (const module of writtenWeeks) {
  let last = null;
  for (const lesson of jsLessons.filter((l) => l.moduleId === module.id)) {
    const first = (lesson.covers || [])[0];
    if (last && first && before(first, last)) outOfOrder = `${lesson.id} (${first} after ${last})`;
    last = (lesson.covers || []).slice(-1)[0] || last;
  }
}
ok("lessons follow the curriculum table's order", !outOfOrder, outOfOrder);

// The Operate step of A-T-O-M: every lesson has at least one graded practice.
const ungraded = jsLessons.filter(
  (l) => !l.atoms.some((a) => a.codeExercise || a.decision)
);
ok("every lesson has a graded practice (predict-the-output or a decision)",
  ungraded.length === 0, ungraded.map((l) => l.id).join(", "));

// The Master step: every lesson's check is reachable through the real grader.
const jsUnserved = jsLessons.filter((l) => !serveQuestions(l.id, 1));
ok("every lesson's check is served by the grader", jsUnserved.length === 0,
  jsUnserved.map((l) => l.id).join(", "));
const sampleServed = serveQuestions(jsLessons[0].id, 1);
ok("served JavaScript checks carry no answers",
  sampleServed.questions.every((q) => !("correct" in q) && !("explanation" in q) && !("whyWrong" in q)));

// The browser runner prints values the way Node does, because the lessons
// quote Node's output and the learner compares the two.
const { inspect: jsInspect, formatArgs } = await import(SRC + "jsRunner.js");
const { inspect: nodeInspect, format: nodeFormat } = await import("node:util");
class Student { constructor() { this.name = "Ada"; this.score = 91; } }
const samples = [
  42, -0, "text", true, null, undefined, 10n, [1, 2, 3], [], ["a", "b"],
  { name: "Ada", age: 36 }, {}, { nested: { deep: [1, { x: 1 }] } },
  new Student(), new Map([["a", 1]]), new Set([1, 2]), [1, , 3],
  function greet() {}, () => {}, { "two words": 1 },
];
const mismatched = samples.filter((v) => jsInspect(v, false) !== nodeInspect(v));
ok("the browser runner formats values exactly as Node does",
  mismatched.length === 0, mismatched.map((v) => nodeInspect(v)).join(" | "));
ok("and joins console.log arguments the same way",
  formatArgs(["Total:", 5, [1, 2], "ok"]) === nodeFormat("Total:", 5, [1, 2], "ok"));

/* The "Run" button. validateContent.mjs proves every snippet prints what the
 * lesson says when Node runs it. This proves the in-browser runner prints the
 * SAME thing: the exact worker program is executed headlessly, in a fresh VM
 * context per snippet that stands in for a Worker's global scope, against
 * every JavaScript snippet in the course. If the two ever disagree, a learner
 * pressing Run would see output that contradicts the lesson. */
const { buildWorkerSource } = await import(SRC + "jsRunner.js");
const vm = await import("node:vm");
const workerSource = buildWorkerSource();

function runHeadless(code, strict) {
  return new Promise((resolve) => {
    const sandbox = {
      setTimeout, clearTimeout, setInterval, clearInterval,
      EventTarget, Event,
      // A subclass per run, so the runner's body-read tracking is installed
      // fresh each time, as it would be in a brand-new Worker.
      Response: class extends Response {},
      addEventListener() {},
      postMessage: (message) => resolve(message),
    };
    sandbox.self = sandbox;
    const context = vm.createContext(sandbox);
    // structuredClone made inside the context, so clones share its realm.
    vm.runInContext("self.structuredClone = (v) => JSON.parse(JSON.stringify(v));", context);
    vm.runInContext(workerSource, context);
    const timer = setTimeout(() => resolve({ stdout: "", error: "(timed out)" }), 5000);
    sandbox.onmessage({ data: { code, strict } });
    // postMessage resolves the promise; the timer only guards a hang.
    const done = sandbox.postMessage;
    sandbox.postMessage = (m) => { clearTimeout(timer); done(m); };
  });
}

const trimLines = (t) => String(t ?? "").split(/\r?\n/).map((l) => l.trimEnd()).join("\n").trim();
const runnerMismatches = [];
let runnerChecked = 0;
for (const lesson of jsLessons) {
  for (const atom of lesson.atoms) {
    for (const spec of [atom.code, atom.codeExercise]) {
      if (!spec?.code || (spec.language !== "javascript" && spec.language !== "pseudocode")) continue;
      const source = spec.language === "pseudocode" ? spec.equivalent : spec.code;
      const result = await runHeadless(source, Boolean(spec.module));
      runnerChecked += 1;
      const want = spec.raises
        ? [spec.expectedOutput, spec.raises].filter(Boolean).join("\n")
        : spec.expectedOutput;
      const got = [result.stdout, result.error].filter(Boolean).join("\n");
      if (trimLines(got) !== trimLines(want)) {
        runnerMismatches.push(`${atom.id}: runner printed ${JSON.stringify(trimLines(got))}`);
      }
    }
  }
}
ok("the in-browser runner reproduces the verified output of every snippet",
  runnerMismatches.length === 0,
  runnerMismatches.length ? runnerMismatches.slice(0, 5).join(" | ") : `${runnerChecked} snippets`);

/* ── Python Programming ──────────────────────────────────────────────────
 * Authored from a numbered curriculum: 1.1 to 20.11, plus the three phase
 * assessments (P1.x, P2.x, P3.x). The same coverage and ordering checks as the
 * JavaScript course, plus the rule the course is built on: programming is
 * learned by writing it, so once Python is installed every lesson must make
 * the learner write code (a `codeChallenge`), not only read it.
 */
section("Python Programming");

const { PYTHON_COURSE, PYTHON_MODULE_IDS } = await import(SRC + "data/pythonCourse.js");
const pyEntry = cat.getCatalogEntry("python");
ok("the course is in the catalog and open", pyEntry?.status === "open" && pyEntry.course === PYTHON_COURSE);
ok("it carries a permanent course code", pyEntry?.code === "PY-101");
ok("it is one of the enrollable courses", cat.COURSES.includes(PYTHON_COURSE));
ok("twenty modules and three phase assessments",
  PYTHON_MODULE_IDS.length === 23 &&
    PYTHON_MODULE_IDS.filter((id) => /^pp-m\d+-/.test(id)).length === 20 &&
    PYTHON_MODULE_IDS.filter((id) => /^pp-a\d-/.test(id)).length === 3);
ok("four phases cover weeks 1 to 16 exactly once",
  PYTHON_COURSE.phases.length === 4 &&
    PYTHON_COURSE.phases.flatMap((ph) => ph.weeks).sort((a, b) => a - b).join() ===
      Array.from({ length: 16 }, (_, i) => i + 1).join());

const pyLessons = reg.getCourseLessons("python");
const pyModules = PYTHON_COURSE.months.flatMap((m) => m.modules);
const pyWritten = pyModules.filter((m) => pyLessons.some((l) => l.moduleId === m.id));
ok("lessons load through the shared registry", pyLessons.length > 0, `${pyLessons.length} lessons`);

const pyGap = pyModules.findIndex((m) => !pyWritten.includes(m));
ok("written modules form an unbroken run from Module 1",
  pyGap === -1 || pyModules.slice(pyGap).every((m) => !pyWritten.includes(m)),
  pyGap === -1 ? "all 23 written" : `first unwritten: ${pyModules[pyGap].id}`);

for (const module of pyWritten) {
  const here = pyLessons.filter((l) => l.moduleId === module.id);
  const covered = new Set(here.flatMap((l) => l.covers || []));
  const required = module.curriculum.map(([n]) => n);
  const label = module.title.split(" · ")[0];
  ok(`${label}: every curriculum topic is taught`,
    required.every((n) => covered.has(n)), required.filter((n) => !covered.has(n)).join(", "));
  ok(`${label}: no lesson claims a topic from another module`,
    [...covered].every((n) => required.includes(n)), [...covered].filter((n) => !required.includes(n)).join(", "));
  ok(`${label}: the last lesson carries the module's practical work`,
    Boolean(here[here.length - 1]?.task?.prompts?.length));
  const plannedAtoms = module.atoms;
  const writtenAtoms = here.reduce((n, l) => n + l.atoms.length, 0);
  ok(`${label}: the outline's atom count matches the written atoms`,
    plannedAtoms === writtenAtoms, `outline ${plannedAtoms}, written ${writtenAtoms}`);
}

let pyOutOfOrder = "";
for (const module of pyWritten) {
  let last = null;
  for (const lesson of pyLessons.filter((l) => l.moduleId === module.id)) {
    const first = (lesson.covers || [])[0];
    if (last && first && before(first, last)) pyOutOfOrder = `${lesson.id} (${first} after ${last})`;
    last = (lesson.covers || []).slice(-1)[0] || last;
  }
}
ok("lessons follow the curriculum table's order", !pyOutOfOrder, pyOutOfOrder);

const pyUngraded = pyLessons.filter(
  (l) => !l.atoms.some((a) => a.codeChallenge || a.codeExercise || a.decision)
);
ok("every lesson has a graded practice", pyUngraded.length === 0, pyUngraded.map((l) => l.id).join(", "));

// Practice first: the three lessons before Python is installed are about
// thinking; from the lesson that installs Python onwards, every lesson makes
// the learner write and run code of their own.
const PRE_PYTHON = new Set(["pp-l1-what-is-programming", "pp-l2-how-computers-run-code", "pp-l3-plan-before-code"]);
const noWriting = pyLessons.filter((l) => !PRE_PYTHON.has(l.id) && !l.atoms.some((a) => a.codeChallenge));
ok("every lesson after Python is installed makes the learner write code",
  noWriting.length === 0, noWriting.map((l) => l.id).join(", "));

const pyChallenges = pyLessons.flatMap((l) => l.atoms.filter((a) => a.codeChallenge));
ok("every challenge has a task, tests with checks, and a model answer",
  pyChallenges.every((a) => a.codeChallenge.task && a.codeChallenge.solution &&
    a.codeChallenge.tests?.length && a.codeChallenge.tests.every((t) => t.check)),
  `${pyChallenges.length} challenges`);

const pyUnserved = pyLessons.filter((l) => !serveQuestions(l.id, 1));
ok("every lesson's check is served by the grader", pyUnserved.length === 0,
  pyUnserved.map((l) => l.id).join(", "));
ok("served Python checks carry no answers",
  serveQuestions(pyLessons[0].id, 1).questions.every(
    (q) => !("correct" in q) && !("explanation" in q) && !("whyWrong" in q)));

/* ── C++ Programming ─────────────────────────────────────────────────────
 * Authored from a numbered curriculum: 1.0 to 16.5. The same coverage and
 * ordering checks as the Python course, plus the course's own promises: it
 * opens with what C++ builds and the whole road ahead, and from the first
 * compiled program onwards every lesson makes the learner WRITE C++ (a
 * `codeFill`), not only read it.
 */
section("C++ Programming");

const { CPP_COURSE, CPP_MODULE_IDS } = await import(SRC + "data/cppCourse.js");
const cpEntry = cat.getCatalogEntry("cpp");
ok("the course is in the catalog and open", cpEntry?.status === "open" && cpEntry.course === CPP_COURSE);
ok("it carries a permanent course code", cpEntry?.code === "CP-101");
ok("it is one of the enrollable courses", cat.COURSES.includes(CPP_COURSE));
ok("sixteen modules, one per week", CPP_MODULE_IDS.length === 16 &&
  CPP_COURSE.months.flatMap((m) => m.modules).every((m, i) => m.week === `Week ${i + 1}`));
ok("five phases cover weeks 1 to 16 exactly once",
  CPP_COURSE.phases.length === 5 &&
    CPP_COURSE.phases.flatMap((ph) => ph.weeks).sort((a, b) => a - b).join() ===
      Array.from({ length: 16 }, (_, i) => i + 1).join());
ok("every module sits in the phase that owns its week",
  CPP_COURSE.months.flatMap((m) => m.modules).every((m) =>
    CPP_COURSE.phases.find((ph) => ph.phase === m.phase)?.weeks.includes(m.order)));

const cpLessons = reg.getCourseLessons("cpp");
const cpModules = CPP_COURSE.months.flatMap((m) => m.modules);
const cpWritten = cpModules.filter((m) => cpLessons.some((l) => l.moduleId === m.id));
ok("lessons load through the shared registry", cpLessons.length > 0, `${cpLessons.length} lessons`);

const cpGap = cpModules.findIndex((m) => !cpWritten.includes(m));
ok("written modules form an unbroken run from Module 1",
  cpGap === -1 || cpModules.slice(cpGap).every((m) => !cpWritten.includes(m)),
  cpGap === -1 ? "all 16 written" : `first unwritten: ${cpModules[cpGap].id}`);

for (const module of cpWritten) {
  const here = cpLessons.filter((l) => l.moduleId === module.id);
  const covered = new Set(here.flatMap((l) => l.covers || []));
  const required = module.curriculum.map(([n]) => n);
  const label = module.title.split(" · ")[0];
  ok(`${label}: every curriculum topic is taught`,
    required.every((n) => covered.has(n)), required.filter((n) => !covered.has(n)).join(", "));
  ok(`${label}: no lesson claims a topic from another module`,
    [...covered].every((n) => required.includes(n)), [...covered].filter((n) => !required.includes(n)).join(", "));
  ok(`${label}: the last lesson carries the module's mini-project`,
    Boolean(here[here.length - 1]?.task?.prompts?.length));
  const writtenAtoms = here.reduce((n, l) => n + l.atoms.length, 0);
  ok(`${label}: the outline's atom count matches the written atoms`,
    module.atoms === writtenAtoms, `outline ${module.atoms}, written ${writtenAtoms}`);
}

let cpOutOfOrder = "";
for (const module of cpWritten) {
  let last = null;
  for (const lesson of cpLessons.filter((l) => l.moduleId === module.id)) {
    const first = (lesson.covers || [])[0];
    if (last && first && before(first, last)) cpOutOfOrder = `${lesson.id} (${first} after ${last})`;
    last = (lesson.covers || []).slice(-1)[0] || last;
  }
}
ok("lessons follow the curriculum table's order", !cpOutOfOrder, cpOutOfOrder);
ok("every lesson id is unique", new Set(cpLessons.map((l) => l.id)).size === cpLessons.length);

// The foresight lesson: before any syntax, the learner sees what C++ builds,
// what each phase lets them build, and every module of the course.
const cpWelcome = cpLessons[0];
const tableOf = (atomId) => cpWelcome?.atoms.find((a) => a.id === atomId)?.table;
ok("the course opens with topic 1.0: what C++ builds and the road ahead",
  cpWelcome?.covers?.join() === "1.0" && Boolean(tableOf("a-cp-welcome-builds")?.rows?.length));
ok("the introduction shows all five phases and what each one lets you build",
  tableOf("a-cp-welcome-phases")?.rows?.length === CPP_COURSE.phases.length);
ok("the introduction lists every module of the course",
  tableOf("a-cp-welcome-roadmap")?.rows?.length === cpModules.length &&
    tableOf("a-cp-welcome-roadmap").rows.every((r, i) => r[0] === String(i + 1)));

// Hands on first: after the welcome, set-up, then Hello World, then the frame
// of a program and printing, and only then the theory. Compiler warning flags
// are not mentioned before the lesson that introduces them.
const cpM1 = cpLessons.filter((l) => l.moduleId === "cp-m1-intro").map((l) => l.id);
ok("Module 1 is hands-on first: set-up, Hello World, the frame and printing, then theory",
  cpM1.slice(0, 5).join() === "cp-l1-welcome,cp-l4a-setup,cp-l4-first-program,cp-l4b-anatomy,cp-l4c-printing",
  cpM1.join(", "));
const firstWarnLesson = cpLessons.findIndex((l) => JSON.stringify(l).includes("-Wall"));
ok("compiler warning flags only appear once the lesson on errors has introduced them",
  cpLessons[firstWarnLesson]?.id === "cp-l5-syntax-errors", cpLessons[firstWarnLesson]?.id);

// std::cout first, then using namespace std; from that atom on, every program
// writes plain cout, except where std:: is the lesson (header files, Week 15).
const STD_IS_THE_POINT = new Set(["a-cp-class-files", "a-cp-namespaces", "a-cp-namespace-clash"]);
let afterUsing = false;
const notPlain = [];
for (const lesson of cpLessons) {
  for (const atom of lesson.atoms) {
    if (atom.id === "a-cp-using-namespace") { afterUsing = true; continue; }
    if (!afterUsing || STD_IS_THE_POINT.has(atom.id)) continue;
    for (const spec of [atom.code, atom.codeExercise, atom.codeFill]) {
      const src = spec?.equivalentCpp || spec?.code || "";
      const usesStd = /\b(cout|cin|endl|string|vector|getline)\b/.test(src);
      if (/std::/.test(src) || (usesStd && !/using namespace std;/.test(src))) notPlain.push(atom.id);
    }
  }
}
ok("std::cout is taught first, then using namespace std;, and every later program writes plain cout",
  afterUsing && notPlain.length === 0, notPlain.join(", "));

const cpUngraded = cpLessons.filter(
  (l) => !l.atoms.some((a) => a.codeFill || a.codeExercise || a.decision)
);
ok("every lesson has a graded practice", cpUngraded.length === 0, cpUngraded.map((l) => l.id).join(", "));

// Practice first: the welcome and the set-up lesson come before the compiler
// works; from Hello, World! onwards every lesson makes the learner write C++.
const PRE_COMPILER = new Set(["cp-l1-welcome", "cp-l4a-setup"]);
const cpNoWriting = cpLessons.filter((l) => !PRE_COMPILER.has(l.id) && !l.atoms.some((a) => a.codeFill));
ok("every lesson from the first program on makes the learner write C++",
  cpNoWriting.length === 0, cpNoWriting.map((l) => l.id).join(", "));

const cpFills = cpLessons.flatMap((l) => l.atoms.filter((a) => a.codeFill));
ok("every write-the-code practice has a task, gaps with answers, and an output",
  cpFills.every((a) => a.codeFill.task && a.codeFill.expectedOutput !== undefined &&
    a.codeFill.blanks?.length && a.codeFill.blanks.every((b) => b.answers?.length)),
  `${cpFills.length} practices`);

// Marking: spacing between tokens is forgiven, nothing else is.
const { normaliseFill, fillIsCorrect } = await import(SRC + "cppFill.js");
ok("marking ignores spacing between tokens",
  normaliseFill("total  +=   score ;") === normaliseFill("total+=score;") &&
    fillIsCorrect(" a+b ", { answers: ["a + b"] }));
ok("marking keeps words apart and literals exact",
  normaliseFill("int x") !== normaliseFill("intx") &&
    !fillIsCorrect('"Total:"', { answers: ['"Total: "'] }) &&
    fillIsCorrect('"Total: "', { answers: ['"Total: "'] }));
ok("a missing semicolon is wrong, and an empty gap never passes",
  !fillIsCorrect('std::cout << "Hi\\n"', { answers: ['std::cout << "Hi\\n";'] }) &&
    !fillIsCorrect("   ", { answers: [""] }));

const cpUnserved = cpLessons.filter((l) => !serveQuestions(l.id, 1));
ok("every lesson's check is served by the grader", cpUnserved.length === 0,
  cpUnserved.map((l) => l.id).join(", "));
ok("served C++ checks carry no answers",
  serveQuestions(cpLessons[0].id, 1).questions.every(
    (q) => !("correct" in q) && !("explanation" in q) && !("whyWrong" in q)));

/* ── Responsive Web Development ───────────────────────────────────────────
 * Authored from a numbered curriculum: 1.0 to 32.12, five phase projects
 * modules (P1.x to P5.x) and the capstone (C.x). The same coverage, order and
 * atom-count checks as the other programming courses, plus this course's own
 * promises: React is not in it (that is WD-201); from Module 3 on, every
 * lesson makes the learner BUILD a page in a `webLab`; and an assessment gate
 * never shows a model answer to copy.
 */
section("Responsive Web Development");

const { WEB_DEVELOPMENT_COURSE: WD, WEB_DEVELOPMENT_MODULE_IDS: WD_IDS } = await import(
  SRC + "data/webDevelopmentCourse.js"
);
const wdEntry = cat.getCatalogEntry("web-development");
ok("the course is in the catalog, open, under its new name",
  wdEntry?.status === "open" && wdEntry.course === WD && wdEntry.title === "Responsive Web Development" &&
    WD.title === wdEntry.title);
ok("it keeps its permanent course code", wdEntry?.code === "WD-101");
ok("it is one of the enrollable courses", cat.COURSES.includes(WD));

const wdModules = WD.months.flatMap((m) => m.modules);
ok("38 modules: 32 taught, 5 phase projects modules and a capstone",
  WD_IDS.length === 38 &&
    wdModules.filter((m) => !m.type).length === 32 &&
    wdModules.filter((m) => m.type === "project").length === 5 &&
    wdModules.filter((m) => m.type === "capstone").length === 1);
ok("six phases cover modules 1 to 38 exactly once",
  WD.phases.length === 6 &&
    WD.phases.flatMap((ph) => ph.weeks).sort((a, b) => a - b).join() ===
      Array.from({ length: 38 }, (_, i) => i + 1).join() &&
    wdModules.every((m, i) => m.order === i + 1));
ok("every module sits in the phase that owns it",
  wdModules.every((m) => WD.phases.find((ph) => ph.phase === m.phase)?.weeks.includes(m.order)));
ok("React is taught in WD-201, not here",
  wdModules.every((m) => !/react/i.test(m.title) && m.curriculum.every(([, t]) => !/react/i.test(t))));

const wdLessons = reg.getCourseLessons("web-development");
const wdWritten = wdModules.filter((m) => wdLessons.some((l) => l.moduleId === m.id));
ok("lessons load through the shared registry", wdLessons.length > 0, `${wdLessons.length} lessons`);
const wdGap = wdModules.findIndex((m) => !wdWritten.includes(m));
ok("written modules form an unbroken run from Module 1",
  wdGap === -1 || wdModules.slice(wdGap).every((m) => !wdWritten.includes(m)),
  wdGap === -1 ? "all 38 written" : `first unwritten: ${wdModules[wdGap].id}`);

for (const module of wdWritten) {
  const here = wdLessons.filter((l) => l.moduleId === module.id);
  const covered = new Set(here.flatMap((l) => l.covers || []));
  const required = module.curriculum.map(([n]) => n);
  const label = module.title.split(" · ")[0];
  ok(`${label}: every curriculum topic is taught`,
    required.every((n) => covered.has(n)), required.filter((n) => !covered.has(n)).join(", "));
  ok(`${label}: no lesson claims a topic from another module`,
    [...covered].every((n) => required.includes(n)), [...covered].filter((n) => !required.includes(n)).join(", "));
  ok(`${label}: the last lesson carries the module's practical work`,
    Boolean(here[here.length - 1]?.task?.prompts?.length));
  const writtenAtoms = here.reduce((n, l) => n + l.atoms.length, 0);
  ok(`${label}: the outline's atom count matches the written atoms`,
    module.atoms === writtenAtoms, `outline ${module.atoms}, written ${writtenAtoms}`);
}

let wdOutOfOrder = "";
for (const module of wdWritten) {
  let last = null;
  for (const lesson of wdLessons.filter((l) => l.moduleId === module.id)) {
    const first = (lesson.covers || [])[0];
    if (last && first && before(first, last)) wdOutOfOrder = `${lesson.id} (${first} after ${last})`;
    last = (lesson.covers || []).slice(-1)[0] || last;
  }
}
ok("lessons follow the curriculum table's order", !wdOutOfOrder, wdOutOfOrder);
ok("every lesson id is unique", new Set(wdLessons.map((l) => l.id)).size === wdLessons.length);

// The foresight lesson: the destination and the whole road before any code.
const wdWelcome = wdLessons[0];
const wdTable = (atomId) => wdWelcome?.atoms.find((a) => a.id === atomId)?.table;
ok("the course opens with topic 1.0: what you will build, phase by phase",
  wdWelcome?.covers?.join() === "1.0" && wdTable("a-wd-welcome-phases")?.rows?.length === WD.phases.length);
ok("the introduction lists every module of the course, in order",
  wdTable("a-wd-welcome-roadmap")?.rows?.length === wdModules.length &&
    wdTable("a-wd-welcome-roadmap").rows.every((r, i) => r[0] === wdModules[i].title.split(" · ")[0]));

const WD_PRACTICE = ["webLab", "codeExercise", "decision", "terminalExercise"];
const wdUngraded = wdLessons.filter((l) => !l.atoms.some((a) => WD_PRACTICE.some((k) => a[k])));
ok("every lesson has a graded practice", wdUngraded.length === 0, wdUngraded.map((l) => l.id).join(", "));

// Practice is building. Modules 1 and 2 come before the editor is set up, and
// the Git, npm and hosting modules are practised in a recorded terminal; every
// other lesson makes the learner build a page.
const NO_LAB_MODULES = new Set(["wd-m1-web", "wd-m2-environment", "wd-m26-git", "wd-m27-tooling", "wd-m29-deployment"]);
const wdNoLab = wdLessons.filter((l) => !NO_LAB_MODULES.has(l.moduleId) && !l.atoms.some((a) => a.webLab));
ok("every lesson from Module 3 on makes the learner build a page",
  wdNoLab.length === 0, wdNoLab.map((l) => l.id).join(", "));

const wdLabs = wdLessons.flatMap((l) => l.atoms.filter((a) => a.webLab));
ok("every lab has a task, labelled checks and a model answer",
  wdLabs.every((a) => a.webLab.task && a.webLab.solution && a.webLab.tests?.length &&
    a.webLab.tests.every((t) => t.label && t.check)),
  `${wdLabs.length} labs`);
const gates = wdLessons.filter((l) => l.gate);
ok("every assessment gate is built without a model answer to copy",
  gates.every((l) => l.atoms.some((a) => a.webLab) &&
    l.atoms.filter((a) => a.webLab).every((a) => a.webLab.revealSolution === false)),
  `${gates.length} gates`);
const gateModules = wdWritten.filter((m) => m.type === "project");
ok("every written projects module ends with its gate",
  gateModules.every((m) => wdLessons.filter((l) => l.moduleId === m.id).slice(-1)[0]?.gate));

// The harness the labs run in: the same text in the lesson and the validator.
const web = await import(SRC + "webHarness.js");
const labDoc = web.buildLabDocument(
  {
    "index.html": '<!DOCTYPE html>\n<html><head><link rel="stylesheet" href="style.css"><script src="app.js" defer></script></head><body><img src="images/hero.jpg" alt="x"></body></html>',
    "style.css": "a{}",
    "app.js": "const $$x = 1; while (go) { step(); }",
  },
  { mode: "grade", tests: [{ index: 0, check: "return $$('img').length" }] }
);
ok("the lab document keeps <!DOCTYPE html> first, so pages render in standards mode", /^<!DOCTYPE html>/.test(labDoc));
ok("linked style.css and app.js are resolved to the lab's own files",
  labDoc.includes('<style data-file="style.css">') && labDoc.includes('<script data-file="app.js">'));
ok("a deferred script runs at the end of the body, as defer does",
  labDoc.indexOf('data-file="app.js"') > labDoc.indexOf("<img"));
ok("code containing $$ reaches the page unchanged", labDoc.includes("const $$x = 1;") && labDoc.includes("$$: (s)"));
ok("loops are protected against running forever", labDoc.includes("while (go) { __labLoop();"));
ok("built-in images resolve with no network", labDoc.includes("data:image/svg+xml") && !labDoc.includes('src="images/hero.jpg"'));
ok("checks group by page, width and saved storage",
  web.groupTests({ files: { "index.html": "" }, tests: [{ check: "1" }, { check: "1", viewport: "mobile" }, { check: "1" }] }).length === 2);

const wdUnserved = wdLessons.filter((l) => !serveQuestions(l.id, 1));
ok("every lesson's check is served by the grader", wdUnserved.length === 0, wdUnserved.map((l) => l.id).join(", "));
ok("served web development checks carry no answers",
  serveQuestions(wdLessons[0].id, 1).questions.every(
    (q) => !("correct" in q) && !("explanation" in q) && !("whyWrong" in q)));

/* ── Codebase Engineering ─────────────────────────────────────────────────
 * Authored from a numbered curriculum: 1.0 to 10.10, a practical (N.P) at the
 * end of every module, and the capstone (C.x). The same coverage, order and
 * atom-count checks as the other programming courses, plus this course's own
 * promises: every terminal shows a RECORDED session from the sample project,
 * every atom is practised, and Module 6 names the tools it says it teaches.
 */
section("Codebase Engineering");

const { CODEBASE_ENGINEERING_COURSE: CE, CODEBASE_ENGINEERING_MODULE_IDS: CE_IDS } = await import(
  SRC + "data/codebaseEngineeringCourse.js"
);
const ceEntry = cat.getCatalogEntry("codebase-engineering");
ok("the course is in the catalog and open under its name",
  ceEntry?.status === "open" && ceEntry.course === CE && ceEntry.title === "Codebase Engineering" && CE.title === ceEntry.title);
ok("it keeps its permanent course code", ceEntry?.code === "CE-101");
ok("it is one of the enrollable courses", cat.COURSES.includes(CE));

const ceModules = CE.months.flatMap((m) => m.modules);
ok("11 modules: the curriculum's 10 and a capstone",
  CE_IDS.length === 11 &&
    ceModules.filter((m) => !m.type).length === 10 &&
    ceModules.filter((m) => m.type === "capstone").length === 1);
ok("four phases cover modules 1 to 11 exactly once",
  CE.phases.length === 4 &&
    CE.phases.flatMap((ph) => ph.weeks).sort((a, b) => a - b).join() ===
      Array.from({ length: 11 }, (_, i) => i + 1).join() &&
    ceModules.every((m, i) => m.order === i + 1));
ok("every module sits in the phase that owns it",
  ceModules.every((m) => CE.phases.find((ph) => ph.phase === m.phase)?.weeks.includes(m.order)));
ok("an eight-week course is shown as two months, not four",
  CE.durationMonths === 2 && CE.months.length === 2 && new Set(CE.months.map((m) => m.month)).size === 2);

const ceLessons = reg.getCourseLessons("codebase-engineering");
const ceWritten = ceModules.filter((m) => ceLessons.some((l) => l.moduleId === m.id));
ok("lessons load through the shared registry", ceLessons.length > 0, `${ceLessons.length} lessons`);
const ceGap = ceModules.findIndex((m) => !ceWritten.includes(m));
ok("written modules form an unbroken run from Module 1",
  ceGap === -1 || ceModules.slice(ceGap).every((m) => !ceWritten.includes(m)),
  ceGap === -1 ? "all 11 written" : `first unwritten: ${ceModules[ceGap].id}`);

for (const module of ceWritten) {
  const here = ceLessons.filter((l) => l.moduleId === module.id);
  const covered = new Set(here.flatMap((l) => l.covers || []));
  const required = module.curriculum.map(([n]) => n);
  const label = module.title.split(" · ")[0];
  ok(`${label}: every curriculum topic is taught`,
    required.every((n) => covered.has(n)), required.filter((n) => !covered.has(n)).join(", "));
  ok(`${label}: no lesson claims a topic from another module`,
    [...covered].every((n) => required.includes(n)), [...covered].filter((n) => !required.includes(n)).join(", "));
  ok(`${label}: the last lesson carries the module's practical assignment`,
    Boolean(here[here.length - 1]?.task?.prompts?.length));
  const writtenAtoms = here.reduce((n, l) => n + l.atoms.length, 0);
  ok(`${label}: the outline's atom count matches the written atoms`,
    module.atoms === writtenAtoms, `outline ${module.atoms}, written ${writtenAtoms}`);
}

let ceOutOfOrder = "";
for (const module of ceWritten) {
  let last = null;
  for (const lesson of ceLessons.filter((l) => l.moduleId === module.id)) {
    const first = (lesson.covers || [])[0];
    if (last && first && before(first, last)) ceOutOfOrder = `${lesson.id} (${first} after ${last})`;
    last = (lesson.covers || []).slice(-1)[0] || last;
  }
}
ok("lessons follow the curriculum table's order", !ceOutOfOrder, ceOutOfOrder);
ok("every lesson id is unique", new Set(ceLessons.map((l) => l.id)).size === ceLessons.length);

const ceWelcome = ceLessons[0];
const ceTable = (atomId) => ceWelcome?.atoms.find((a) => a.id === atomId)?.table;
ok("the course opens with topic 1.0: the phases, and every module in order",
  ceWelcome?.covers?.join() === "1.0" &&
    ceTable("a-ce-welcome-phases")?.rows?.length === CE.phases.length &&
    ceTable("a-ce-welcome-roadmap")?.rows?.length === ceModules.length &&
    ceTable("a-ce-welcome-roadmap").rows.every((r, i) => r[0] === ceModules[i].title.split(" · ")[0]));

const CE_PRACTICE = ["terminalExercise", "decision", "codeExercise"];
const ceUnpractised = ceLessons.flatMap((l) => l.atoms).filter((a) => !CE_PRACTICE.some((k) => a[k]));
ok("every atom carries a graded practice", ceUnpractised.length === 0, ceUnpractised.map((a) => a.id).join(", "));

const { TRANSCRIPTS: CE_T } = await import(SRC + "data/lessons/ce-transcripts.js");
const ceTerms = ceLessons.flatMap((l) => l.atoms).flatMap((a) => [a.terminal, a.terminalExercise]).filter(Boolean);
ok("every terminal shows a recorded session, output for output",
  ceTerms.every((t) => CE_T[t.session] && Object.entries(t.commands).every(([c, o]) => CE_T[t.session][c] === o)),
  `${ceTerms.length} terminals`);
ok("most practice is at a real prompt, not multiple choice",
  ceTerms.length * 3 >= ceLessons.flatMap((l) => l.atoms).length, `${ceTerms.length} terminals`);

const ceM6 = JSON.stringify(ceLessons.filter((l) => l.moduleId === "ce-m6-ai-agents"));
ok("Module 6 introduces Cursor, Claude Code, GitHub Copilot and OpenAI Codex",
  !ceWritten.some((m) => m.id === "ce-m6-ai-agents") ||
    ["Cursor", "Claude Code", "GitHub Copilot", "Codex", "AGENTS.md", "CLAUDE.md"].every((t) => ceM6.includes(t)));

const ceUnserved = ceLessons.filter((l) => !serveQuestions(l.id, 1));
ok("every lesson's check is served by the grader", ceUnserved.length === 0, ceUnserved.map((l) => l.id).join(", "));
ok("served codebase engineering checks carry no answers",
  serveQuestions(ceLessons[0].id, 1).questions.every(
    (q) => !("correct" in q) && !("explanation" in q) && !("whyWrong" in q)));

/* ── React Development ────────────────────────────────────────────────────
 * Authored from a numbered curriculum: 0.0 to 15.14, with a practical (N.P)
 * ending every module. The same coverage, order and atom-count checks as the
 * other programming courses, plus this course's own promises: it is the
 * WD-201 that Responsive Web Development points to; from Module 1 on every
 * lesson makes the learner build a React project in a `webLab`; module
 * practicals are built without a model answer to copy; the TypeScript
 * module is type-checked by tsc; and the testing module's test-writing labs
 * are proven against deliberately broken code.
 */
section("React Development");

const { REACT_COURSE: RX, REACT_MODULE_IDS: RX_IDS } = await import(SRC + "data/reactCourse.js");
const rxEntry = cat.getCatalogEntry("react");
ok("the course is in the catalog and open under its name",
  rxEntry?.status === "open" && rxEntry.course === RX && rxEntry.title === "React Development" && RX.title === rxEntry.title);
ok("it takes the WD-201 code that Responsive Web Development refers to", rxEntry?.code === "WD-201" &&
  !cat.CATALOG.some((c) => c !== rxEntry && c.code === "WD-201"));
ok("it is one of the enrollable courses", cat.COURSES.includes(RX));

const rxModules = RX.months.flatMap((m) => m.modules);
ok("16 modules, numbered 0 to 15 as in the curriculum",
  RX_IDS.length === 16 && rxModules.every((m, i) => m.title.startsWith(`Module ${i} · `) && m.order === i + 1));
ok("four phases cover modules 1 to 16 exactly once",
  RX.phases.length === 4 &&
    RX.phases.flatMap((ph) => ph.weeks).sort((a, b) => a - b).join() === Array.from({ length: 16 }, (_, i) => i + 1).join());
ok("every module sits in the phase that owns it",
  rxModules.every((m) => RX.phases.find((ph) => ph.phase === m.phase)?.weeks.includes(m.order)));
ok("every module states its objective, practical assignment and mastery checkpoint",
  rxModules.every((m) => m.objective && m.project && m.checkpoint && m.curriculum.some(([n]) => n.endsWith(".P"))));

const rxLessons = reg.getCourseLessons("react");
const rxWritten = rxModules.filter((m) => rxLessons.some((l) => l.moduleId === m.id));
ok("lessons load through the shared registry", rxLessons.length > 0, `${rxLessons.length} lessons`);
const rxGap = rxModules.findIndex((m) => !rxWritten.includes(m));
ok("written modules form an unbroken run from Module 0",
  rxGap === -1 || rxModules.slice(rxGap).every((m) => !rxWritten.includes(m)),
  rxGap === -1 ? "all 16 written" : `first unwritten: ${rxModules[rxGap].id}`);

for (const module of rxWritten) {
  const here = rxLessons.filter((l) => l.moduleId === module.id);
  const covered = new Set(here.flatMap((l) => l.covers || []));
  const required = module.curriculum.map(([n]) => n);
  const label = module.title.split(" · ")[0];
  ok(`${label}: every curriculum topic is taught`,
    required.every((n) => covered.has(n)), required.filter((n) => !covered.has(n)).join(", "));
  ok(`${label}: no lesson claims a topic from another module`,
    [...covered].every((n) => required.includes(n)), [...covered].filter((n) => !required.includes(n)).join(", "));
  const last = here[here.length - 1];
  ok(`${label}: the last lesson is the practical assignment, with its mastery checkpoint`,
    last?.covers?.join() === `${module.curriculum.slice(-1)[0][0]}` && Boolean(last?.task?.prompts?.some((p) => /mastery checkpoint/i.test(p))));
  const writtenAtoms = here.reduce((n, l) => n + l.atoms.length, 0);
  ok(`${label}: the outline's atom count matches the written atoms`,
    module.atoms === writtenAtoms, `outline ${module.atoms}, written ${writtenAtoms}`);
}

let rxOutOfOrder = "";
for (const module of rxWritten) {
  let last = null;
  for (const lesson of rxLessons.filter((l) => l.moduleId === module.id)) {
    const first = (lesson.covers || [])[0];
    if (last && first && first !== last && !first.endsWith(".P") && before(first, last)) rxOutOfOrder = `${lesson.id} (${first} after ${last})`;
    last = (lesson.covers || []).slice(-1)[0] || last;
  }
}
ok("lessons follow the curriculum table's order", !rxOutOfOrder, rxOutOfOrder);
ok("every lesson id is unique", new Set(rxLessons.map((l) => l.id)).size === rxLessons.length);

const rxWelcome = rxLessons[0];
const rxTable = (atomId) => rxWelcome?.atoms.find((a) => a.id === atomId)?.table;
ok("the course opens with topic 0.0: the phases, and every module in order",
  rxWelcome?.covers?.join() === "0.0" &&
    rxTable("a-rx-welcome-phases")?.rows?.length === RX.phases.length &&
    rxTable("a-rx-welcome-roadmap")?.rows?.length === rxModules.length &&
    rxTable("a-rx-welcome-roadmap").rows.every((r, i) => r[0] === rxModules[i].title.split(" · ")[0]));

const RX_PRACTICE = ["webLab", "codeExercise", "decision"];
const rxUngraded = rxLessons.filter((l) => !l.atoms.some((a) => RX_PRACTICE.some((k) => a[k])));
ok("every lesson has a graded practice", rxUngraded.length === 0, rxUngraded.map((l) => l.id).join(", "));
const rxUnpractised = rxLessons.flatMap((l) => l.atoms).filter((a) => !RX_PRACTICE.some((k) => a[k]));
ok("every atom carries a graded practice", rxUnpractised.length === 0, rxUnpractised.map((a) => a.id).join(", "));
const rxReactLabs = rxLessons.filter((l) => l.moduleId !== "rx-m0-foundations")
  .filter((l) => !l.atoms.some((a) => a.webLab && Object.keys(a.webLab.files).some((f) => f.startsWith("src/"))));
ok("every lesson from Module 1 on makes the learner build in a real React project",
  rxReactLabs.length === 0, rxReactLabs.map((l) => l.id).join(", "));
const rxLabs = rxLessons.flatMap((l) => l.atoms.filter((a) => a.webLab));
ok("most practice is building, not multiple choice", rxLabs.length * 3 >= rxLessons.flatMap((l) => l.atoms).length * 2,
  `${rxLabs.length} labs`);
const rxPracticals = rxLessons.filter((l) => (l.covers || []).some((c) => c.endsWith(".P")));
ok("every module practical is built without a model answer to copy",
  rxPracticals.length === rxWritten.length &&
    rxPracticals.every((l) => l.atoms.some((a) => a.webLab) && l.atoms.filter((a) => a.webLab).every((a) => a.webLab.revealSolution === false)),
  `${rxPracticals.length} practicals`);
const rxTs = rxLessons.filter((l) => l.moduleId === "rx-m11-typescript").flatMap((l) => l.atoms.filter((a) => a.webLab));
ok("every TypeScript lab is type-checked by the real compiler",
  rxTs.length > 0 && rxTs.every((a) => a.webLab.typecheck === true && Object.keys(a.webLab.files).some((f) => /\.tsx?$/.test(f))),
  `${rxTs.length} TypeScript labs`);
const rxTestLabs = rxLessons.filter((l) => l.moduleId === "rx-m13-testing").flatMap((l) => l.atoms.filter((a) => a.webLab))
  .filter((a) => Object.keys(a.webLab.files).some((f) => /\.test\.jsx?$/.test(f)));
ok("every test-writing lab proves the tests catch broken code",
  rxTestLabs.length >= 6 && rxTestLabs.every((a) => a.webLab.tests.some((t) => t.swap)), `${rxTestLabs.length} test labs`);
ok("the course names the tools it says it teaches",
  ["Vite", "React Router", "TanStack Query", "Zustand", "Redux Toolkit", "Zod", "Tailwind", "TypeScript", "Vitest", "React Testing Library", "Playwright", "ESLint", "Prettier", "Vercel", "Netlify", "GitHub Actions"]
    .every((t) => JSON.stringify(rxLessons).includes(t)));

const rxHarness = web.buildLabDocument(
  { "index.html": "<!DOCTYPE html><html><head></head><body><div id=\"root\"></div><script type=\"module\" src=\"/src/main.jsx\"></script></body></html>", "src/main.jsx": "while (go) { step(); }" },
  { mode: "grade", path: "/courses/7" }
);
ok("a React lab loads the bundled runtime by a versioned URL",
  rxHarness.includes(web.REACT_RUNTIME_URL) && /\?v=[0-9a-f]{12}/.test(web.REACT_RUNTIME_URL));
ok("its entry is run by the runtime, loop-protected, starting at the requested route",
  !rxHarness.includes('src="/src/main.jsx"') && rxHarness.includes("__labLoop();") && rxHarness.includes('"path":"/courses/7"'));
ok("the runtime bundle is built and present", existsSync(new URL("../../public/lab/react-runtime.js", import.meta.url)));

const rxUnserved = rxLessons.filter((l) => !serveQuestions(l.id, 1));
ok("every lesson's check is served by the grader", rxUnserved.length === 0, rxUnserved.map((l) => l.id).join(", "));
ok("served React checks carry no answers",
  serveQuestions(rxLessons[0].id, 1).questions.every((q) => !("correct" in q) && !("explanation" in q) && !("whyWrong" in q)));

/* ── Mobile App Development ───────────────────────────────────────────────
 * Authored from the twelve-phase mobile curriculum (Modules 1–20, plus the
 * Module 21 capstone). The same coverage and ordering checks as the other
 * programming courses, plus this course's own promises: every atom carries
 * exactly one graded practice; from Module 7 on most practice is building on
 * the practice phone; module practicals have no model answer to copy; the
 * test-writing labs are proven against broken code; and the course really
 * teaches publishing to Google Play and the App Store.
 */
section("Mobile App Development");

const { MOBILE_DEVELOPMENT_COURSE: MD, MOBILE_DEVELOPMENT_MODULE_IDS: MD_IDS } = await import(SRC + "data/mobileDevelopmentCourse.js");
const mdEntry = cat.getCatalogEntry("mobile-development");
ok("the course is in the catalog and open under its name",
  mdEntry?.status === "open" && mdEntry.course === MD && mdEntry.title === "Mobile App Development" && MD.title === mdEntry.title);
ok("it carries the permanent code MD-101, used by no other course",
  mdEntry?.code === "MD-101" && !cat.CATALOG.some((c) => c !== mdEntry && c.code === "MD-101"));
ok("it is one of the enrollable courses", cat.COURSES.includes(MD));

const mdModules = MD.months.flatMap((m) => m.modules);
ok("21 modules, numbered 1 to 21 in order",
  MD_IDS.length === 21 && mdModules.every((m, i) => m.title.startsWith(`Module ${i + 1} · `) && m.order === i + 1));
ok("twelve phases cover the modules exactly once",
  MD.phases.length === 12 &&
    MD.phases.flatMap((ph) => ph.weeks).sort((a, b) => a - b).join() === Array.from({ length: 21 }, (_, i) => i + 1).join());
ok("every module states its objective, practical and mastery checkpoint",
  mdModules.every((m) => m.objective && m.project && m.checkpoint && m.curriculum.some(([n]) => n.endsWith(".P"))));

const mdLessons = reg.getCourseLessons("mobile-development");
ok("every module is written and loads through the shared registry",
  mdModules.every((m) => mdLessons.some((l) => l.moduleId === m.id)), `${mdLessons.length} lessons`);

for (const module of mdModules) {
  const here = mdLessons.filter((l) => l.moduleId === module.id);
  const covered = new Set(here.flatMap((l) => l.covers || []));
  const required = module.curriculum.map(([n]) => n);
  const label = module.title.split(" · ")[0];
  ok(`${label}: every curriculum topic is taught`,
    required.every((n) => covered.has(n)), required.filter((n) => !covered.has(n)).join(", "));
  ok(`${label}: no lesson claims a topic from another module`,
    [...covered].every((n) => required.includes(n)), [...covered].filter((n) => !required.includes(n)).join(", "));
  const last = here[here.length - 1];
  ok(`${label}: the last lesson is the practical, with its mastery checkpoint`,
    last?.covers?.join() === `${module.curriculum.slice(-1)[0][0]}` && Boolean(last?.task?.prompts?.some((p) => /mastery checkpoint/i.test(p))));
  const writtenAtoms = here.reduce((n, l) => n + l.atoms.length, 0);
  ok(`${label}: the outline's atom count matches the written atoms`,
    module.atoms === writtenAtoms, `outline ${module.atoms}, written ${writtenAtoms}`);
}

let mdOutOfOrder = "";
for (const module of mdModules) {
  let last = null;
  for (const lesson of mdLessons.filter((l) => l.moduleId === module.id)) {
    const first = (lesson.covers || [])[0];
    if (last && first && first !== last && !first.endsWith(".P") && before(first, last)) mdOutOfOrder = `${lesson.id} (${first} after ${last})`;
    last = (lesson.covers || []).slice(-1)[0] || last;
  }
}
ok("lessons follow the curriculum table's order", !mdOutOfOrder, mdOutOfOrder);
ok("every lesson id is unique", new Set(mdLessons.map((l) => l.id)).size === mdLessons.length);

const MD_PRACTICE = ["webLab", "codeExercise", "decision", "terminalExercise"];
const mdAtomsAll = mdLessons.flatMap((l) => l.atoms);
const mdWrongCount = mdAtomsAll.filter((a) => MD_PRACTICE.filter((k) => a[k]).length !== 1);
ok("every atom carries exactly one graded practice", mdWrongCount.length === 0, mdWrongCount.map((a) => a.id).join(", "));
ok("every atom has a unique id", new Set(mdAtomsAll.map((a) => a.id)).size === mdAtomsAll.length);
const mdLater = mdLessons.filter((l) => MD_IDS.indexOf(l.moduleId) >= MD_IDS.indexOf("md-m7-react-native")).flatMap((l) => l.atoms);
const mdLaterLabs = mdLater.filter((a) => a.webLab);
ok("from Module 7 on, most practice is building on the practice phone",
  mdLaterLabs.length * 3 >= mdLater.length * 2 && mdLaterLabs.every((a) => "app.json" in a.webLab.files && web.isNativeLab(a.webLab.files)),
  `${mdLaterLabs.length} of ${mdLater.length} atoms`);
const mdPracticals = mdLessons.filter((l) => (l.covers || []).some((c) => c.endsWith(".P")));
const mdLabPracticals = mdPracticals.filter((l) => l.atoms.some((a) => a.webLab));
ok("module practicals built on the phone have no model answer to copy",
  mdPracticals.length === mdModules.length &&
    mdLabPracticals.filter((l) => MD_IDS.indexOf(l.moduleId) >= MD_IDS.indexOf("md-m9-navigation"))
      .every((l) => l.atoms.filter((a) => a.webLab).every((a) => a.webLab.revealSolution === false)),
  `${mdPracticals.length} practicals`);
const mdTestLabs = mdLessons.filter((l) => l.moduleId === "md-m18-testing").flatMap((l) => l.atoms.filter((a) => a.webLab))
  .filter((a) => Object.keys(a.webLab.files).some((f) => /(\.test\.tsx?|\.maestro\/.*\.ya?ml)$/.test(f)));
ok("every test-writing lab proves the tests catch broken code",
  mdTestLabs.length >= 7 && mdTestLabs.every((a) => a.webLab.tests.some((t) => t.swap)), `${mdTestLabs.length} test labs`);
const mdText = JSON.stringify(mdLessons);
ok("the course names the tools it says it teaches",
  ["Expo Router", "TypeScript", "EAS Build", "EAS Update", "EAS Submit", "SecureStore", "SQLite", "TanStack Query", "Zustand", "Zod", "React Native Testing Library", "Maestro", "Jest", "TestFlight"]
    .every((t) => mdText.includes(t)));
ok("it teaches publishing on both stores, account to release",
  ["Google Play Console", "App Store Connect", "Apple Developer Program", "US$25", "US$99", "closed test", "12 testers", "Data safety", "privacy labels", "AAB", "IPA", "staged rollout", "phased release"]
    .every((t) => mdText.toLowerCase().includes(t.toLowerCase())));

const mdHarness = web.buildLabDocument({ "app.json": "{\"expo\":{\"name\":\"T\"}}", "src/app/index.tsx": "export default () => null;\n" }, { mode: "grade" });
ok("a phone lab loads the bundled native runtime by a versioned URL",
  web.isNativeLab({ "app.json": "{}" }) && mdHarness.includes(web.NATIVE_RUNTIME_URL) && /\?v=[0-9a-f]{12}/.test(web.NATIVE_RUNTIME_URL));
ok("the native runtime and its SQLite engine are built and present",
  existsSync(new URL("../../public/lab/native-runtime.js", import.meta.url)) && existsSync(new URL("../../public/lab/sqlite.js", import.meta.url)));

const mdUnserved = mdLessons.filter((l) => !serveQuestions(l.id, 1));
ok("every lesson's check is served by the grader", mdUnserved.length === 0, mdUnserved.map((l) => l.id).join(", "));
ok("served mobile checks carry no answers",
  serveQuestions(mdLessons[0].id, 1).questions.every((q) => !("correct" in q) && !("explanation" in q) && !("whyWrong" in q)));

/* ── Relational Databases (RDBMS) & SQL ───────────────────────────────────
 * Authored from the six-stage, sixteen-week RDBMS curriculum. The same
 * coverage and ordering checks as the other programming courses, plus this
 * course's own promises: every atom carries exactly one graded practice;
 * most practice is SQL run on real PostgreSQL; week practicals from Week 2 on
 * have no model answer to copy; both PostgreSQL and MySQL are installed and
 * used; terminals come from recorded sessions; and the SQL engine's pure
 * parts (statement splitting, result comparison) behave as documented. The
 * labs themselves are proved on PostgreSQL 18 by validate:content.
 */
section("Relational Databases (RDBMS) & SQL");

const { RDBMS_COURSE: DB, RDBMS_MODULE_IDS: DB_IDS } = await import(SRC + "data/rdbmsCourse.js");
const dbEntry = cat.getCatalogEntry("rdbms");
ok("the course is in the catalog and open under its name",
  dbEntry?.status === "open" && dbEntry.course === DB && dbEntry.title === DB.title && dbEntry.category === "data");
ok("it carries the permanent code DB-101, used by no other course",
  dbEntry?.code === "DB-101" && !cat.CATALOG.some((c) => c !== dbEntry && c.code === "DB-101"));
ok("it is one of the enrollable courses", cat.COURSES.includes(DB));

const dbModules = DB.months.flatMap((m) => m.modules);
ok("16 weeks, numbered 1 to 16 in order",
  DB_IDS.length === 16 && dbModules.every((m, i) => m.title.startsWith(`Week ${i + 1} · `) && m.order === i + 1));
ok("six stages cover the weeks exactly once",
  DB.phases.length === 6 &&
    DB.phases.flatMap((ph) => ph.weeks).sort((a, b) => a - b).join() === Array.from({ length: 16 }, (_, i) => i + 1).join());
ok("every week states its objective, practical lab and checkpoint",
  dbModules.every((m) => m.objective && m.project && m.checkpoint && m.curriculum.slice(-1)[0][0].endsWith(".P")));

const dbLessons = reg.getCourseLessons("rdbms");
ok("every week is written and loads through the shared registry",
  dbModules.every((m) => dbLessons.some((l) => l.moduleId === m.id)), `${dbLessons.length} lessons`);

for (const module of dbModules) {
  const here = dbLessons.filter((l) => l.moduleId === module.id);
  const covered = new Set(here.flatMap((l) => l.covers || []));
  const required = module.curriculum.map(([n]) => n);
  const label = module.title.split(" · ")[0];
  ok(`${label}: every curriculum topic is taught`,
    required.every((n) => covered.has(n)), required.filter((n) => !covered.has(n)).join(", "));
  ok(`${label}: no lesson claims a topic from another week`,
    [...covered].every((n) => required.includes(n)), [...covered].filter((n) => !required.includes(n)).join(", "));
  const last = here[here.length - 1];
  ok(`${label}: the last lesson is the practical, with its checkpoint`,
    last?.covers?.join() === `${module.curriculum.slice(-1)[0][0]}` && Boolean(last?.task?.prompts?.some((p) => /checkpoint/i.test(p))));
  const writtenAtoms = here.reduce((n, l) => n + l.atoms.length, 0);
  ok(`${label}: the outline's atom count matches the written atoms`,
    module.atoms === writtenAtoms, `outline ${module.atoms}, written ${writtenAtoms}`);
}

let dbOutOfOrder = "";
for (const module of dbModules) {
  let last = null;
  for (const lesson of dbLessons.filter((l) => l.moduleId === module.id)) {
    const first = (lesson.covers || [])[0];
    if (last && first && first !== last && !first.endsWith(".P") && before(first, last)) dbOutOfOrder = `${lesson.id} (${first} after ${last})`;
    last = (lesson.covers || []).slice(-1)[0] || last;
  }
}
ok("lessons follow the curriculum table's order", !dbOutOfOrder, dbOutOfOrder);
ok("every lesson id is unique", new Set(dbLessons.map((l) => l.id)).size === dbLessons.length);

const DB_PRACTICE = ["sqlLab", "apiLab", "decision", "terminalExercise"];
const dbAtomsAll = dbLessons.flatMap((l) => l.atoms);
const dbWrongCount = dbAtomsAll.filter((a) => DB_PRACTICE.filter((k) => a[k]).length !== 1);
ok("every atom carries exactly one graded practice", dbWrongCount.length === 0, dbWrongCount.map((a) => a.id).join(", "));
ok("every atom has a unique id", new Set(dbAtomsAll.map((a) => a.id)).size === dbAtomsAll.length);
const dbLater = dbLessons.filter((l) => DB_IDS.indexOf(l.moduleId) >= DB_IDS.indexOf("db-m2-setup")).flatMap((l) => l.atoms);
const dbLabs = dbLater.filter((a) => a.sqlLab || a.apiLab);
ok("from Week 2 on, most practice is code run on PostgreSQL", dbLabs.length * 2 >= dbLater.length, `${dbLabs.length} of ${dbLater.length} atoms`);
const dbPracticals = dbLessons.filter((l) => (l.covers || []).some((c) => c.endsWith(".P")));
ok("week practicals from Week 2 on have no model answer to copy",
  dbPracticals.length === dbModules.length &&
    dbPracticals.filter((l) => l.moduleId !== "db-m1-foundations")
      .every((l) => l.atoms.filter((a) => a.sqlLab || a.apiLab).every((a) => (a.sqlLab || a.apiLab).revealSolution === false)),
  `${dbPracticals.length} practicals`);
const dbText = JSON.stringify(dbLessons);
ok("it teaches installing and using both PostgreSQL and MySQL",
  ["PostgreSQL 18", "initdb", "pg_ctl", "pg_isready", "psql", "pgAdmin", "pgpass", "MySQL 8.4", "mysqld --initialize-insecure", "MySQL Workbench", "AUTO_INCREMENT", "LAST_INSERT_ID", "mysqldump", "Docker", "Homebrew", "apt"]
    .every((t) => dbText.includes(t)));
ok("it covers the engineering the curriculum promises",
  ["EXPLAIN ANALYZE", "REPEATABLE READ", "deadlock", "SAVEPOINT", "PL/pgSQL", "CREATE TRIGGER", "GRANT", "REVOKE", "pg_dump", "pg_restore", "RPO", "RTO", "WITH RECURSIVE", "dense_rank", "LAG", "materialized", "connection pool", "ORM"]
    .every((t) => dbText.includes(t)));

const { TRANSCRIPTS: DB_REC, DUETS: DB_DUETS } = await import(SRC + "data/lessons/db-transcripts.js");
ok("terminals come from recorded PostgreSQL 18.6 and MySQL 8.4 sessions",
  /PostgreSQL\) 18\.6/.test(DB_REC["pg-setup"]["psql --version"]) && /8\.4\.\d+/.test(DB_REC["mysql-setup"]["mysql --version"]));
ok("the concurrency recordings include a lost update, a serialization failure and a deadlock",
  ["lost-update", "repeatable-read", "deadlock"].every((d) => DB_DUETS[d]?.length) &&
    DB_DUETS.deadlock.some((s) => /deadlock detected/.test(s.output)) &&
    DB_DUETS["repeatable-read"].some((s) => /could not serialize/.test(s.output)));

const sqlEngine = await import(SRC + "sql/engine.js");
const split = sqlEngine.splitStatements("SELECT 'a;b'; -- c;\nCREATE FUNCTION f() RETURNS int LANGUAGE plpgsql AS $x$ BEGIN RETURN 1; END $x$; /* x; */ SELECT \"we;ird\" FROM t");
ok("the SQL splitter respects quotes, dollar quoting and comments",
  split.length === 3 && split[1].text.includes("$x$ BEGIN RETURN 1; END $x$") && split[2].text.endsWith("FROM t"));
const r1 = { fields: ["a"], types: [23], rows: [["1"], ["2"]], hasRows: true };
const r2 = { fields: ["a"], types: [23], rows: [["2"], ["1"]], hasRows: true };
ok("result comparison: order matters only when asked, columns by name",
  sqlEngine.compareResults(r1, r2).ok && !sqlEngine.compareResults(r1, r2, { ordered: true }).ok &&
    !sqlEngine.compareResults({ ...r1, fields: ["b"] }, r2).ok);
ok("psql-style error formatting with a caret",
  sqlEngine.formatError({ message: "syntax error at or near \"SELEC\"", line: 2, lineText: "SELEC 1;", caret: 0 }) ===
    "ERROR:  syntax error at or near \"SELEC\"\nLINE 2: SELEC 1;\n        ^");
ok("the PostgreSQL engine (PGlite) is a pinned dependency",
  /^\d+\.\d+\.\d+$/.test(JSON.parse(readFileSync(new URL("../../package.json", import.meta.url), "utf8")).dependencies["@electric-sql/pglite"] || ""));

const dbUnserved = dbLessons.filter((l) => !serveQuestions(l.id, 1));
ok("every lesson's check is served by the grader", dbUnserved.length === 0, dbUnserved.map((l) => l.id).join(", "));
ok("served database checks carry no answers",
  serveQuestions(dbLessons[0].id, 1).questions.every((q) => !("correct" in q) && !("explanation" in q) && !("whyWrong" in q)));

/* ── Forex Trading ────────────────────────────────────────────────────────
 * Authored from a numbered curriculum: 1.0 to 16.P. The same coverage and
 * ordering checks as the JavaScript course, plus the forex engine's
 * arithmetic against known values, and the course's honesty commitments.
 */
section("Forex Trading");

const { FOREX_COURSE, FOREX_MODULE_IDS } = await import(SRC + "data/forexCourse.js");
const fxEntry = cat.getCatalogEntry("forex-trading");
ok("the course is in the catalog and open", fxEntry?.status === "open" && fxEntry.course === FOREX_COURSE);
ok("it carries a permanent course code", fxEntry?.code === "FX-101");
ok("it is one of the enrollable courses", cat.COURSES.includes(FOREX_COURSE));
ok("sixteen taught weeks and four consolidation weeks: twenty modules, five months",
  FOREX_MODULE_IDS.length === 20 &&
    FOREX_COURSE.months.flatMap((m) => m.modules).filter((m) => m.consolidation).length === 4);
ok("five phases, one per month", FOREX_COURSE.phases.length === 5 && FOREX_COURSE.months.length === 5);
ok("every week number appears exactly once across the phases",
  FOREX_COURSE.phases.flatMap((p) => p.weeks).sort((a, b) => a - b).join() ===
    Array.from({ length: 16 }, (_, i) => i + 1).join());

const fxLessons = reg.getCourseLessons("forex-trading");
const fxModules = FOREX_COURSE.months.flatMap((m) => m.modules);
ok("every week is written", fxModules.every((m) => fxLessons.some((l) => l.moduleId === m.id)),
  `${fxLessons.length} lessons`);

for (const module of fxModules) {
  const lessonsHere = fxLessons.filter((l) => l.moduleId === module.id);
  const covered = new Set(lessonsHere.flatMap((l) => l.covers || []));
  const required = module.curriculum.map(([n]) => n);
  const label = module.title.split(" · ")[0];
  ok(`${label}: every curriculum topic is taught`,
    required.every((n) => covered.has(n)), required.filter((n) => !covered.has(n)).join(", "));
  ok(`${label}: no lesson claims a topic from another week`,
    [...covered].every((n) => required.includes(n)));
  ok(`${label}: the last lesson carries the week's practical work`,
    Boolean(lessonsHere[lessonsHere.length - 1]?.task?.prompts?.length));
}

let fxOutOfOrder = "";
for (const module of fxModules) {
  let last = null;
  for (const lesson of fxLessons.filter((l) => l.moduleId === module.id)) {
    const first = (lesson.covers || [])[0];
    if (last && first && before(first, last)) fxOutOfOrder = `${lesson.id} (${first} after ${last})`;
    last = (lesson.covers || []).slice(-1)[0] || last;
  }
}
ok("lessons follow the curriculum table's order", !fxOutOfOrder, fxOutOfOrder);

const fxUngraded = fxLessons.filter(
  (l) => !l.atoms.some((a) => a.calcExercise || a.candleExercise || a.ticketExercise || a.decision)
);
ok("every lesson has a graded practice", fxUngraded.length === 0, fxUngraded.map((l) => l.id).join(", "));
const fxUnserved = fxLessons.filter((l) => !serveQuestions(l.id, 1));
ok("every lesson's check is served by the grader", fxUnserved.length === 0, fxUnserved.map((l) => l.id).join(", "));
ok("served forex checks carry no answers",
  serveQuestions(fxLessons[0].id, 1).questions.every((q) => !("correct" in q) && !("whyWrong" in q)));

// The honesty commitments are content, so they are tested like content.
const fxText = JSON.stringify(FOREX_COURSE) + JSON.stringify(fxLessons);
ok("the course says it does not promise profitability or live readiness",
  /no course can make you consistently profitable/i.test(FOREX_COURSE.description) &&
    /does not mean you are ready to trade real money/i.test(FOREX_COURSE.description));
ok("the graduation standard says profit alone never decides a pass",
  /PROFIT ALONE NEVER DECIDES/.test(fxText));
ok("no broker is named or recommended", !/\b(exness|ic markets|xm\.com|pepperstone|oanda|fxtm|hotforex|hfm|deriv)\b/i.test(fxText));

// The engine, against values worked by hand.
const fxe = await import("./forex/engine.js");
ok("pip values: USD quote, USD base, cross",
  fxe.pipValue({ pair: "EUR/USD", lots: 1 }) === 10 &&
    fxe.pipValue({ pair: "USD/JPY", lots: 1, price: 150 }) === 6.67 &&
    fxe.pipValue({ pair: "EUR/GBP", lots: 1, quoteToUsd: 1.264 }) === 12.64);
ok("position size rounds DOWN, never into extra risk",
  fxe.positionSize({ balance: 1000, riskPercent: 1, stopPips: 25, pipValuePerLot: 10 }) === 0.04 &&
    fxe.positionSize({ balance: 1000, riskPercent: 1, stopPips: 40, pipValuePerLot: 6.67 }) === 0.03);
ok("margin, margin level and recovery maths",
  fxe.marginRequired({ pair: "EUR/USD", lots: 0.1, price: 1.085, leverage: 30 }) === 361.67 &&
    fxe.marginLevel({ equity: 600, usedMargin: 400 }) === 150 &&
    fxe.recoveryNeeded({ lossPercent: 50 }) === 100);
ok("statistics: expectancy, profit factor, drawdown",
  fxe.expectancy({ results: [2, -1, -1] }) === 0 &&
    fxe.profitFactor({ results: [20, -10, -10, 30] }) === 2.5 &&
    fxe.maxDrawdown({ start: 100, results: [10, -20, 5] }).amount === 20);
ok("orders on the wrong side are rejected like a real platform",
  fxe.checkOrder({ type: "buy-limit", bid: 1.085, ask: 1.0851, entry: 1.09, sl: 1.08, tp: 1.1 }).length > 0 &&
    fxe.checkOrder({ type: "market", side: "sell", bid: 1.085, ask: 1.0851, sl: 1.08, tp: 1.07 }).length > 0 &&
    fxe.checkOrder({ type: "sell-stop", bid: 1.085, ask: 1.0851, entry: 1.08, sl: 1.083, tp: 1.075 }).length === 0);
ok("candle patterns follow their written definitions",
  fxe.findPattern([[1.085, 1.0853, 1.0836, 1.084], [1.0838, 1.0858, 1.0835, 1.0855]], "bullish-engulfing").join() === "1" &&
    fxe.findPattern([[1.0824, 1.0828, 1.0798, 1.0825]], "bullish-pin").join() === "0");

const { REVIEW_EXAMPLE } = await import(SRC + "data/lessons/fx-w15-lab-review.js");
const sum = (xs) => xs.reduce((a, b) => a + b, 0);
ok("the Week 15 worked example's split adds back to the whole",
  REVIEW_EXAMPLE.COMPLIANT.length + REVIEW_EXAMPLE.BROKEN.length === REVIEW_EXAMPLE.DEMO_15.length &&
    Math.abs(sum(REVIEW_EXAMPLE.COMPLIANT) + sum(REVIEW_EXAMPLE.BROKEN) - sum(REVIEW_EXAMPLE.DEMO_15)) < 1e-9);

/* ── Report ──────────────────────────────────────────────────────────── */

console.log(
  `\n${failures === 0 ? "✓" : "✗"} ${checks - failures}/${checks} checks passed`
);
process.exit(failures ? 1 : 0);
