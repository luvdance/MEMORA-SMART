/**
 * Self-test for Memotify. Run: npm run test:memotify
 *
 * Runs the real route handlers against an in-memory database, so no network or
 * credentials are needed. Location strings below are copied from the live feeds
 * on 2026-10-30: each one is a case a classifier like this gets wrong.
 */
import assert from "node:assert/strict";
import { fakeDb } from "./fakeDb.mjs";
import { useTestBackend } from "./store.js";
import { reachOf, levelOf, scamFlags, readSkills, fieldOf, nairaMonthly, skillsIn } from "./screen.js";
import { screenPostings, spreadCompanies, clearFeedMemory } from "./feed.js";
import { buildPassport, fitFor, proofOnly } from "./passport.js";
import { toText } from "./sources.js";
import {
  CHECK_IDS, PAPER_SIZE, poolFor, assemblePaper, publicPaper, gradePaper,
  startCheck, submitCheck, RETAKE_WAIT_MS, MINUTES,
} from "./checks.js";
import { routes } from "./handlers.js";

let passed = 0;
const failures = [];
async function test(name, fn) {
  try {
    await fn();
    passed += 1;
  } catch (err) {
    failures.push(name);
    console.error(`FAIL ${name}\n     ${err.message}`);
  }
}

/* ── Reach ── */
const reach = (location, extra = {}) => reachOf({ title: "Analyst", description: "", location, ...extra }).reach;

await test("Nigerian locations count", () => {
  for (const place of ["Lagos, Nigeria", "Remote, Nigeria", "Remote, Lagos, Nigeria", "Ogun", "Anambra", "FCT, Nigeria"]) {
    assert.equal(reach(place), "nigeria", place);
  }
});
await test("bare state names only count alone", () => {
  assert.equal(reach("Delta"), "nigeria");
  assert.equal(reach("Delta, British Columbia"), null);
});
await test("worldwide wording counts", () => {
  for (const place of ["Home based - Worldwide", "Remote, Global", "Anywhere", "Worldwide"]) {
    assert.equal(reach(place), "worldwide", place);
  }
});
await test("South Africa is not Africa", () => {
  assert.equal(reach("Remote, South Africa"), null);
  assert.equal(reach("Africa"), "region");
});
await test("EMEA needs to be remote", () => {
  assert.equal(reach("Home based - EMEA"), "region");
  assert.equal(reach("EMEA"), null);
});
await test("closed locations are dropped", () => {
  for (const place of ["Remote, United States", "Singapore, Singapore", "Home Based - Americas", "Ghana", "Kenya", "Remote, AMER", ""]) {
    assert.equal(reach(place), null, place);
  }
});
await test("a body can take back a worldwide label", () => {
  assert.equal(reach("Worldwide", { description: "You must be authorized to work in the US." }), null);
  assert.equal(reach("Worldwide", { description: "Must reside in the United States." }), null);
});
await test("Lagos survives US boilerplate", () => {
  assert.equal(reach("Lagos, Nigeria", { description: "Must be authorized to work in the US." }), "nigeria");
});
await test("US employers mislabelled by boards are dropped", () => {
  assert.equal(reach("", { description: "State of Arizona benefits including 401(k)." }), null);
  assert.equal(reach("Anywhere", { description: "We are an Equal Opportunity Employer offering FMLA." }), null);
  assert.equal(reach("Anywhere", { description: "Equal Opportunity Employer", direct: true }), "worldwide");
});
await test("a blank location needs the body to confirm it", () => {
  assert.equal(reach(""), null);
  assert.equal(reach("", { description: "Work from anywhere in our team." }), "worldwide");
});
await test("bare Remote is trusted only when the employer is listed for it", () => {
  assert.equal(reach("Remote"), null);
  assert.equal(reach("Remote", { feedTrustsRemote: true }), "worldwide");
});
await test("a country list with Nigeria is a remote job, not a job in Nigeria", () => {
  assert.equal(reach("x", { countries: ["Nigeria", "Kenya"] }), "region");
  assert.equal(reach("x", { countries: ["Nigeria"] }), "nigeria");
  assert.equal(reach("x", { countries: ["Germany"] }), null);
});

/* ── Level, field, skills ── */
await test("levels", () => {
  assert.equal(levelOf({ title: "Graduate Trainee" }), "graduate");
  assert.equal(levelOf({ title: "Senior Data Analyst" }), "senior");
  assert.equal(levelOf({ title: "Senior Associate" }), "senior");
  assert.equal(levelOf({ title: "Sales Officer", description: "fresh graduates welcome" }), "graduate");
  assert.equal(levelOf({ title: "Sales Officer" }), "mid");
});
await test("two years' experience is not graduate friendly", () => {
  assert.equal(levelOf({ title: "Sales Executive", description: "2-5 years in a similar role" }), "mid");
  assert.equal(levelOf({ title: "Sales Executive", description: "1 year of experience" }), "graduate");
});
await test("titles aimed at another market are dropped", () => {
  assert.equal(reach("Remote, EMEA", { title: "Account Executive DACH (German-Speaking)" }), null);
  assert.equal(reach("Remote, Global", { title: "Support Engineer (EMEA - Weekends)" }), "worldwide");
});
await test("fields read stems", () => {
  assert.equal(fieldOf({ title: "Financial Planning Analyst" }), "finance");
  assert.equal(fieldOf({ title: "Customer Support Officer" }), "support");
  assert.equal(fieldOf({ title: "Field Sales Agent" }), "sales");
  assert.equal(fieldOf({ title: "Officer", tags: ["Human Resources"] }), "people");
});
await test("boilerplate does not become a requirement", () => {
  const { must, nice } = readSkills({
    title: "Payroll Accountant",
    field: "finance",
    description: "We build Ubuntu and Linux for everyone.\nRequirements\nExperience with bookkeeping and Excel. Comfortable on Linux.",
  });
  assert.ok(must.includes("accounting"));
  assert.ok(must.includes("excel"));
  assert.ok(!must.includes("linux"));
  assert.ok(nice.includes("linux"));
});
await test("nice-to-haves stay nice", () => {
  const { must, nice } = readSkills({
    title: "Data Analyst",
    field: "data",
    description: "Requirements: SQL.\nNice to have: Python and Tableau.",
  });
  assert.ok(must.includes("sql"));
  assert.ok(!must.includes("python"));
  assert.ok(nice.includes("python"));
});
await test("short aliases need word boundaries", () => {
  assert.ok(!skillsIn("a legit digital job").includes("git"));
  assert.ok(skillsIn("We use Git daily").includes("git"));
  assert.ok(skillsIn("C++ and more").includes("cpp"));
});
await test("feed HTML becomes plain text with its bullets", () => {
  const text = toText("&lt;p&gt;Hello &amp;amp; welcome&lt;/p&gt;&lt;ul&gt;&lt;li&gt;One&lt;/li&gt;&lt;/ul&gt;<script>alert(1)</script>");
  assert.ok(text.includes("Hello & welcome"));
  assert.ok(text.includes("• One"));
  assert.ok(!text.includes("<"));
  assert.ok(!text.includes("alert"));
});

/* ── Scams ── */
await test("demands for money are blocked", () => {
  assert.ok(scamFlags({ description: "Pay a registration fee of N5,000 to start" }).blocked);
  assert.ok(scamFlags({ description: "A refundable caution fee applies" }).blocked);
  assert.ok(scamFlags({ description: "Send your CV on WhatsApp, earn ₦20,000 daily" }).blocked);
});
await test("real adverts are not accused", () => {
  assert.equal(scamFlags({ description: "Reconcile transaction processing fees for merchants." }).flags.length, 0);
  assert.equal(scamFlags({ description: "Support customers across WhatsApp and email channels." }).flags.length, 0);
});
await test("employer boards skip the scan", () => {
  assert.equal(scamFlags({ direct: true, description: "Pay a registration fee" }).blocked, false);
});

/* ── Pool ── */
const NOW = Date.UTC(2026, 9, 30);
const post = (id, extra = {}) => ({
  id, title: `Role ${id}`, company: "Acme", location: "Lagos, Nigeria", url: "https://acme.test/j",
  postedAt: new Date(NOW - 86400000).toISOString(), description: "", direct: false, ...extra,
});

await test("the pool counts what it dropped and why", () => {
  const { jobs, counts } = screenPostings([
    post("a"),
    post("b", { location: "Remote, United States" }),
    post("c", { postedAt: new Date(NOW - 90 * 86400000).toISOString() }),
    post("d", { description: "pay a registration fee" }),
    post("a2", { title: "Role a" }),
  ], { now: NOW });
  assert.deepEqual(jobs.map((j) => j.id), ["a"]);
  assert.deepEqual(
    { c: counts.closedToNigeria, s: counts.stale, x: counts.scam, d: counts.duplicate },
    { c: 1, s: 1, x: 1, d: 1 }
  );
});
await test("employer boards live longer and win duplicates", () => {
  const old = new Date(NOW - 90 * 86400000).toISOString();
  const { jobs } = screenPostings([post("x", { source: "Board" }), post("y", { title: "Role x", direct: true, source: "Acme", postedAt: old })], { now: NOW });
  assert.equal(jobs[0].source, "Acme");
});
await test("first seen survives a refresh; unsafe links are refused", () => {
  const { jobs } = screenPostings([post("a"), post("b", { url: "javascript:alert(1)" })], { now: NOW, firstSeen: { a: 5 } });
  assert.equal(jobs.length, 1);
  assert.equal(jobs[0].firstSeen, 5);
});
await test("the first run marks nothing as new; later runs do", () => {
  const posted = new Date(NOW - 80 * 86400000).toISOString();
  const raw = [post("old", { direct: true, postedAt: posted })];
  assert.equal(screenPostings(raw, { now: NOW }).jobs[0].firstSeen, new Date(posted).getTime());
  assert.equal(screenPostings(raw, { now: NOW, firstSeen: { other: 1 } }).jobs[0].firstSeen, NOW);
});
await test("one company cannot own the top of the list", () => {
  const list = [...Array(6).fill(0).map((_, i) => ({ id: i, company: "A" })), { id: 9, company: "B" }];
  assert.deepEqual(spreadCompanies(list, 2).map((j) => j.company).slice(0, 3), ["A", "A", "B"]);
  assert.equal(spreadCompanies(list, 2).length, 7);
});
await test("naira conversion", () => {
  assert.deepEqual(nairaMonthly({ min: 12000, max: 24000 }, 1000), { min: 1000000, max: 2000000 });
  assert.equal(nairaMonthly({ min: 100, currency: "EUR" }, 1000), null);
});

/* ── Passport ── */
const passportOf = (e) => buildPassport(e, NOW);

await test("the strongest evidence wins", () => {
  const p = passportOf({
    certificates: [{ id: "C1", courseId: "rdbms", score: 80 }],
    checks: [{ skill: "excel", status: "passed", passedAt: NOW - 1000, score: 75 }],
    claimed: ["excel", "sql", "figma"],
  });
  assert.equal(p.skills.sql.tier, "certified");
  assert.equal(p.skills.excel.tier, "verified");
  assert.equal(p.skills.figma.tier, "claimed");
});
await test("revoked and expired evidence does not count", () => {
  const p = passportOf({
    certificates: [{ courseId: "rdbms", revoked: true }],
    checks: [{ skill: "excel", status: "passed", passedAt: NOW - 600 * 86400000, score: 90 }],
  });
  assert.deepEqual(p.skills, {});
});
await test("studied needs enough passed lessons, and is never proof", () => {
  const lesson = { courseId: "rdbms", assessment: { passed: true } };
  assert.equal(passportOf({ progress: Array(14).fill(lesson) }).skills.sql, undefined);
  const p = passportOf({ progress: Array(15).fill(lesson) });
  assert.equal(p.skills.sql.tier, "studied");
  assert.deepEqual(proofOnly(p), {});
});
await test("verdicts", () => {
  const job = { must: ["excel", "sql"], level: "graduate", field: "data", postedAt: new Date(NOW).toISOString() };
  const proved = passportOf({ checks: ["excel", "sql"].map((skill) => ({ skill, status: "passed", passedAt: NOW, score: 80 })) });
  assert.equal(fitFor(job, proved, {}, NOW).verdict, "ready");
  assert.equal(fitFor(job, passportOf({ claimed: ["excel", "sql"] }), {}, NOW).verdict, "prove");
  assert.equal(fitFor(job, passportOf({ claimed: ["excel"] }), {}, NOW).verdict, "close");
  assert.equal(fitFor({ ...job, must: ["excel", "sql", "python"] }, passportOf({ claimed: ["excel"] }), {}, NOW).verdict, "stretch");
  assert.equal(fitFor({ ...job, must: [] }, proved, {}, NOW).verdict, "open");
});
await test("proof outranks claims, and a graduate is not shown senior roles first", () => {
  const job = { must: ["excel"], level: "graduate", field: "data", postedAt: new Date(NOW).toISOString() };
  const proved = passportOf({ checks: [{ skill: "excel", status: "passed", passedAt: NOW, score: 80 }] });
  const claimed = passportOf({ claimed: ["excel"] });
  assert.ok(fitFor(job, proved, {}, NOW).score > fitFor(job, claimed, {}, NOW).score);
  assert.ok(fitFor(job, proved, { stage: "graduate" }, NOW).score > fitFor({ ...job, level: "senior" }, proved, { stage: "graduate" }, NOW).score);
});

/* ── Skill checks ── */
await test("every check can fill a full paper", () => {
  for (const skill of CHECK_IDS) {
    const paper = assemblePaper(skill, 7);
    assert.equal(paper.length, PAPER_SIZE, `${skill} paper (pool ${poolFor(skill).length})`);
  }
});
await test("every checkable skill in the taxonomy has a check, and the reverse", async () => {
  const { SKILLS } = await import("../../src/memotify/data/skills.js");
  const marked = Object.keys(SKILLS).filter((id) => SKILLS[id].check).sort();
  assert.deepEqual(marked, [...CHECK_IDS].sort());
});
await test("papers repeat by seed, differ by seed, and carry no key", () => {
  assert.deepEqual(publicPaper("sql", 11), publicPaper("sql", 11));
  assert.notDeepEqual(publicPaper("sql", 11).map((i) => i.id), publicPaper("sql", 12).map((i) => i.id));
  for (const skill of CHECK_IDS) {
    for (const item of publicPaper(skill, 3)) {
      assert.ok(!("correct" in item) && !("expectedOutput" in item) && !("explanation" in item), skill);
      for (const option of item.options || []) assert.deepEqual(Object.keys(option).sort(), ["id", "text"]);
    }
  }
});
const rightAnswers = (skill, seed) =>
  Object.fromEntries(assemblePaper(skill, seed).map((item) => [item.id, item.type === "mcq" ? item.correct : item.expectedOutput]));

await test("grading", () => {
  assert.equal(gradePaper("excel", 5, rightAnswers("excel", 5)).score, 100);
  assert.equal(gradePaper("excel", 5, {}).passed, false);
});
await test("attempts: resume, one paper, no free retakes, no late passes", async () => {
  const db = fakeDb();
  const first = await startCheck(db, "u1", "writing", 1000);
  const again = await startCheck(db, "u1", "writing", 2000);
  assert.equal(first.seed, again.seed);

  const fail = await submitCheck(db, "u1", "writing", {}, 3000);
  assert.equal(fail.passed, false);
  assert.equal((await startCheck(db, "u1", "writing", 4000)).status, "wait");

  const retake = await startCheck(db, "u1", "writing", 3000 + RETAKE_WAIT_MS + 1);
  assert.equal(retake.status, "open");
  const late = retake.expiresAt + 10 * 60 * 1000;
  assert.equal((await submitCheck(db, "u1", "writing", rightAnswers("writing", retake.seed), late)).passed, false);
});
await test("walking away from an open paper still costs the retake wait", async () => {
  const db = fakeDb();
  await startCheck(db, "u1", "sql", 1000);
  assert.equal((await startCheck(db, "u1", "sql", 1000 + (MINUTES + 1) * 60 * 1000)).status, "wait");
});
await test("a pass is held and cannot be re-sat", async () => {
  const db = fakeDb();
  const { seed } = await startCheck(db, "u1", "excel", 1000);
  await submitCheck(db, "u1", "excel", rightAnswers("excel", seed), 2000);
  assert.equal((await startCheck(db, "u1", "excel", 3000)).status, "held");
});

/* ── Routes ── */
const db = fakeDb();
let aiCalls = 0;
let aiFails = false;
useTestBackend({
  db,
  interviewer: {
    available: () => true,
    async ask(_, onText) {
      aiCalls += 1;
      if (aiFails) throw new Error("down");
      onText("Tell me ");
      onText("about yourself.");
      return "Tell me about yourself.";
    },
    review: async () => ({ verdict: "nearly", summary: "s", strengths: [], improve: [], answers: [] }),
  },
  identify: async (req) => {
    const uid = req.headers?.authorization;
    return uid
      ? { uid, email: `${uid}@acme.ng`, name: `${uid} Test`, emailVerified: uid !== "unverified", admin: uid === "admin" }
      : { error: "no_token" };
  },
});

async function call(action, { as, body, query, method } = {}) {
  let code = 200;
  let payload;
  const events = [];
  const res = {
    status(c) { code = c; return res; },
    json(p) { payload = p; return res; },
    setHeader() {},
    write(line) { events.push(JSON.parse(line)); },
    end() { payload = { events }; },
  };
  await routes[action](
    { method: method || (body ? "POST" : "GET"), headers: as ? { authorization: as } : {}, query: query || {}, body },
    res
  );
  return { code, ...payload };
}

const JOB = {
  title: "Junior Data Analyst", text: "x".repeat(100), must: ["excel"], nice: ["sql"],
  payMin: 300000, payMax: 400000, mode: "remote", openTo: "nigeria", level: "graduate", field: "data",
};

await test("signed-out people can browse but nothing else", async () => {
  assert.equal((await call("feed")).code, 200);
  for (const action of ["me", "tracker", "hire-home"]) assert.equal((await call(action)).code, 401, action);
});
await test("a job cannot be posted without company, verified email, pay, or skills", async () => {
  assert.equal((await call("job-save", { as: "unverified", body: JOB })).code, 403);
  assert.equal((await call("job-save", { as: "boss", body: JOB })).reason, "company");
  await call("company", { as: "boss", body: { name: "Acme Ltd", website: "https://acme.ng" } });
  assert.match((await call("job-save", { as: "boss", body: { ...JOB, payMin: 0 } })).error, /pay/i);
  assert.match((await call("job-save", { as: "boss", body: { ...JOB, must: [] } })).error, /skill/i);
});
await test("company website must be a web link", async () => {
  assert.equal((await call("company", { as: "evil", body: { name: "Evil", website: "javascript:alert(1)" } })).code, 400);
});

let jobId;
await test("a new company's job waits for review, then verifying releases it", async () => {
  const saved = await call("job-save", { as: "boss", body: JOB });
  jobId = saved.job.id;
  assert.equal(saved.job.status, "pending");
  clearFeedMemory();
  assert.equal((await call("job", { query: { id: jobId } })).code, 404);

  assert.equal((await call("admin-queue", { as: "boss" })).code, 403);
  const queue = await call("admin-queue", { as: "admin" });
  assert.equal(queue.companies.length, 1);
  assert.equal(queue.companies[0].domainMatch, true);
  await call("admin-decide", { as: "admin", body: { type: "company", id: queue.companies[0].id, decision: "approve" } });
  clearFeedMemory();

  const open = await call("job", { query: { id: jobId } });
  assert.equal(open.job.status, "live");
  assert.equal(open.job.ownerUid, undefined);
});
await test("a verified company's flagged job still waits", async () => {
  const saved = await call("job-save", { as: "boss", body: { ...JOB, title: "Data Clerk", text: `${"y".repeat(100)} pay a registration fee` } });
  assert.equal(saved.job.status, "pending");
  assert.equal(saved.job.flags[0].id, "fee");
});
await test("one company cannot edit another's job", async () => {
  await call("company", { as: "rival", body: { name: "Rival", website: "https://rival.ng" } });
  assert.equal((await call("job-save", { as: "rival", body: { ...JOB, id: jobId } })).code, 403);
});

await test("the passport cannot be set from the body", async () => {
  await call("profile", { as: "ada", body: { stage: "graduate", fields: ["data", "nonsense"], passport: { skills: { excel: { tier: "certified" } } }, claimed: ["excel", "bogus"] } });
  const me = await call("me", { as: "ada" });
  assert.equal(me.passport.skills.excel.tier, "claimed");
  assert.deepEqual(me.profile.fields, ["data"]);
  assert.deepEqual(me.profile.claimed, ["excel"]);
});
await test("CV import reads skills, and only from your own CV", async () => {
  await db.collection("cvs").doc("cv1").set({ ownerId: "ada", data: { name: "Ada Obi", email: "ada@x.ng", phone: "0801", skills: "SQL, Excel", summary: "Hi" } });
  assert.equal((await call("import-cv", { as: "rival", body: { cvId: "cv1" } })).code, 404);
  const done = await call("import-cv", { as: "ada", body: { cvId: "cv1" } });
  assert.ok(done.found.includes("sql"));
  assert.equal(done.passport.skills.sql.tier, "claimed");
});
await test("cv fit compares a job with a CV", async () => {
  const fit = await call("cv-fit", { as: "ada", body: { jobId, cvId: "cv1" } });
  assert.deepEqual(fit.onCv.sort(), ["excel", "sql"]);
});

await test("a check through the routes raises the tier, with no key sent", async () => {
  const paper = await call("check-start", { as: "ada", body: { skill: "excel" } });
  assert.ok(!JSON.stringify(paper).match(/"correct"|expectedOutput|"seed"/));
  const { seed } = (await db.collection("memotifyChecks").doc("ada__excel").get()).data();
  const result = await call("check-submit", { as: "ada", body: { skill: "excel", answers: rightAnswers("excel", seed) } });
  assert.equal(result.passed, true);
  assert.equal((await call("me", { as: "ada" })).passport.skills.excel.tier, "verified");
});
await test("job detail shows the verdict for a signed-in person", async () => {
  const { fit } = await call("job", { as: "ada", query: { id: jobId } });
  assert.equal(fit.verdict, "ready");
});
await test("applying is once only and snapshots proof; no CV, no application", async () => {
  assert.equal((await call("apply", { as: "ada", body: { jobId } })).reason, "cv");
  assert.equal((await call("apply", { as: "ada", body: { jobId, cvId: "cv1", note: "Hi" } })).applied, true);
  assert.equal((await call("apply", { as: "ada", body: { jobId, cvId: "cv1" } })).code, 409);
  clearFeedMemory();
  assert.equal((await call("job", { query: { id: jobId } })).job.applicants, 1);
});
await test("proof-required jobs refuse unproven applicants", async () => {
  const saved = await call("job-save", { as: "boss", body: { ...JOB, title: "Strict Analyst", must: ["powerbi"], requireProof: true } });
  clearFeedMemory();
  await db.collection("cvs").doc("cv1b").set({ ownerId: "ada", data: { name: "Ada" } });
  assert.equal((await call("apply", { as: "ada", body: { jobId: saved.job.id, cvId: "cv1b" } })).reason, "proof");
});
await test("employers see their applicants only; contacts only in detail", async () => {
  assert.equal((await call("applicants", { as: "rival", query: { jobId } })).code, 404);
  const { applicants } = await call("applicants", { as: "boss", query: { jobId } });
  assert.equal(applicants.length, 1);
  assert.equal(applicants[0].email, undefined);
  assert.equal(applicants[0].proof.excel.tier, "verified");
  assert.equal((await call("applicant", { as: "rival", query: { id: applicants[0].id } })).code, 404);
  const { application } = await call("applicant", { as: "boss", query: { id: applicants[0].id } });
  assert.equal(application.email, "ada@x.ng");
  assert.equal(application.uid, undefined);
  assert.ok(application.cvText.includes("Ada Obi"));
});
await test("an employer's move reaches the candidate, who cannot overrule it", async () => {
  const { applicants } = await call("applicants", { as: "boss", query: { jobId } });
  await call("applicant-move", { as: "boss", body: { id: applicants[0].id, stage: "interview" } });
  const { items } = await call("tracker", { as: "ada" });
  assert.equal(items[0].status, "interview");
  assert.equal((await call("track", { as: "ada", body: { jobId, status: "offer" } })).code, 409);
  assert.equal((await call("applicant-move", { as: "rival", body: { id: applicants[0].id, stage: "hired" } })).code, 404);
});
await test("talent is opt-in, anonymised, and for verified companies", async () => {
  assert.equal((await call("talent", { as: "rival" })).reason, "unverified");
  assert.equal((await call("talent", { as: "boss", query: { skills: "excel" } })).people.length, 0);
  await call("profile", { as: "ada", body: { name: "Ada Obi", openToWork: true } });
  const { people } = await call("talent", { as: "boss", query: { skills: "excel" } });
  assert.equal(people[0].name, "Ada O");
  assert.equal(people[0].uid, undefined);
  assert.equal(people[0].email, undefined);
  assert.equal((await call("invite", { as: "boss", body: { handle: people[0].handle, jobId } })).invited, true);
});
await test("a private passport stays private", async () => {
  const profile = (await db.collection("memotifyProfiles").doc("ada").get()).data();
  assert.equal((await call("passport-public", { query: { id: profile.publicId } })).code, 404);
  await call("profile", { as: "ada", body: { passportPublic: true } });
  const shown = await call("passport-public", { query: { id: profile.publicId } });
  assert.deepEqual(shown.proof.map((p) => p.skill), ["excel"]);
  assert.equal(JSON.stringify(shown).includes("sql"), false);
});
await test("proof can be added to a CV, once", async () => {
  assert.equal((await call("cv-proof", { as: "ada", body: { cvId: "cv1" } })).added, 1);
  assert.equal((await call("cv-proof", { as: "ada", body: { cvId: "cv1" } })).added, 0);
  const { data } = (await db.collection("cvs").doc("cv1").get()).data();
  assert.match(data.certifications[0].credentialUrl, /memotify\/p\//);
});
await test("reports: one vote each, three people hide a job, an admin can restore it", async () => {
  await call("report", { as: "r1", body: { jobId, reason: "scam" } });
  await call("report", { as: "r1", body: { jobId, reason: "scam" } });
  await call("report", { as: "r2", body: { jobId, reason: "scam" } });
  clearFeedMemory();
  assert.equal((await call("job", { query: { id: jobId } })).code, 200);
  await call("report", { as: "r3", body: { jobId, reason: "scam" } });
  clearFeedMemory();
  assert.equal((await call("job", { query: { id: jobId } })).code, 404);
  await call("admin-decide", { as: "admin", body: { type: "report", id: jobId, decision: "reject" } });
  clearFeedMemory();
  assert.equal((await call("job", { query: { id: jobId } })).code, 200);
});
await test("interviews need an application", async () => {
  await call("track", { as: "ada", body: { jobId: "gone" , status: "saved" } }).catch(() => {});
  await db.collection("memotifyTracker").doc("ada__saved-job").set({ uid: "ada", jobId: "saved-job", title: "T", company: "C", status: "saved", updatedAt: 1 });
  assert.equal((await call("interview-start", { as: "ada", body: { jobId: "saved-job" } })).reason, "not_applied");
  assert.equal((await call("interview-brief", { as: "stranger", query: { jobId } })).reason, "not_applied");
});
let session;
await test("an interview streams, and the browser never sees the prompt", async () => {
  const { events } = await call("interview-start", { as: "ada", body: { jobId } });
  session = events[0].session;
  assert.equal(events.filter((e) => e.text).map((e) => e.text).join(""), "Tell me about yourself.");
  assert.ok(events.at(-1).done);
  const view = await call("interview-view", { as: "ada", query: { id: session } });
  assert.equal(view.session.messages.length, 1);
  assert.equal(view.session.messages[0].role, "assistant");
  assert.ok(!JSON.stringify(view).includes("hiring manager"));
  assert.equal((await call("interview-view", { as: "rival", query: { id: session } })).code, 404);
});
await test("a failed turn keeps the answer and can be retried", async () => {
  aiFails = true;
  const failed = await call("interview-answer", { as: "ada", body: { id: session, answer: "My answer" } });
  assert.ok(failed.events.at(-1).error);
  aiFails = false;
  const retry = await call("interview-answer", { as: "ada", body: { id: session } });
  assert.equal(retry.events.at(-1).asked, 2);
  const { session: s } = await call("interview-view", { as: "ada", query: { id: session } });
  assert.equal(s.messages.filter((m) => m.content === "My answer").length, 1);
});
await test("an empty answer is refused and the server ends the interview", async () => {
  assert.equal((await call("interview-answer", { as: "ada", body: { id: session, answer: " " } })).reason, "empty");
  let last;
  for (let i = 0; i < 5; i += 1) last = await call("interview-answer", { as: "ada", body: { id: session, answer: "More" } });
  assert.equal(last.events.at(-1).finished, true);
  const before = aiCalls;
  assert.equal((await call("interview-answer", { as: "ada", body: { id: session, answer: "Extra" } })).reason, "over");
  assert.equal(aiCalls, before);
});
await test("feedback is saved once", async () => {
  const first = await call("interview-finish", { as: "ada", body: { id: session } });
  assert.equal(first.feedback.verdict, "nearly");
  assert.equal((await call("interview-finish", { as: "rival", body: { id: session } })).code, 404);
  const { session: s } = await call("interview-view", { as: "ada", query: { id: session } });
  assert.equal(s.status, "finished");
});
await test("the weekly limit holds, and a failed start isn't counted", async () => {
  aiFails = true;
  const failed = await call("interview-start", { as: "ada", body: { jobId } });
  assert.ok(failed.events.at(-1).error);
  aiFails = false;
  assert.equal((await call("interviews", { as: "ada" })).left, 2);
  await call("interview-start", { as: "ada", body: { jobId } });
  await call("interview-start", { as: "ada", body: { jobId } });
  assert.equal((await call("interview-start", { as: "ada", body: { jobId } })).reason, "limit");
});
await test("the cron needs its secret", async () => {
  assert.equal((await call("cron")).code, 401);
});

console.log(`\nMemotify: ${passed} passed, ${failures.length} failed`);
process.exit(failures.length ? 1 : 0);
