/**
 * /api/memotify/* route handlers. SERVER ONLY.
 *
 * Every read and write of Memotify data comes through here on the Admin SDK.
 * firestore.rules has no entry for these collections, so its default denies the
 * browser outright: nobody can edit their own Passport, read another person's
 * application, or move themselves up a shortlist from the console.
 *
 * The uid is always taken from the verified token, never the body. Timestamps
 * are epoch milliseconds, so they cross JSON unchanged.
 *
 * No query here needs a composite index: equality filters only, sorted in
 * memory, so there is nothing extra to deploy.
 */
import { randomUUID, randomBytes } from "node:crypto";
import { FIELDS, SKILLS, STAGES, TIERS, TRACK_STAGES, PIPELINE, JOB_TYPES, WORK_MODES, LEVELS } from "../../src/memotify/data/skills.js";
import { cvToText } from "../../src/cv-builder/utils/cvText.js";
import { store, whoIs, storeStatus, interviewer } from "./store.js";
import {
  CAN_PRACTISE, MAX_ANSWER, QUESTIONS, activeFor, allowance, claimTurn, createSession, loadSession,
  publicSession, releaseTurn, reviewRequest, saveFeedback, saveReply, systemFor,
} from "./interview.js";
import { currentJobs, refreshPool, applyFilters, spreadCompanies, toCard, STALE_MS } from "./feed.js";
import { buildPassport, fitFor, proofOnly, bestNextProofs } from "./passport.js";
import { scamFlags, skillsIn } from "./screen.js";

const PAGE_SIZE = 24;
const PASSPORT_TTL_MS = 10 * 60 * 1000;
const REPORTS_TO_HIDE = 3;
const INVITES_PER_DAY = 20;
const FREE_MAIL = /^(gmail|yahoo|hotmail|outlook|icloud|proton|protonmail|live|aol|ymail)\./i;

const send = (res, status, payload) => res.status(status).json(payload);

function bodyOf(req) {
  if (req.body && typeof req.body === "object") return req.body;
  try {
    return JSON.parse(req.body || "{}");
  } catch {
    return {};
  }
}

const clip = (value, max) => String(value ?? "").trim().slice(0, max);
const onlyKnown = (list, known, max) =>
  [...new Set(Array.isArray(list) ? list : [])].filter((id) => known(id)).slice(0, max);
const isSkill = (id) => Boolean(SKILLS[id]);

/** Doc ids can't hold a slash, and a feed job id is third-party text. */
const safeId = (id) => clip(id, 200).replace(/[/\\.#$[\]]/g, "_");

function httpsUrl(value) {
  try {
    const url = new URL(String(value).trim());
    return url.protocol === "https:" || url.protocol === "http:" ? url.href : null;
  } catch {
    return null;
  }
}

async function optionalUser(req) {
  const who = await whoIs(req);
  return who.uid ? who : null;
}

async function requireUser(req, res) {
  const who = await whoIs(req);
  if (who.uid) return who;
  if (who.error === "not_configured") {
    send(res, 503, { error: "The server is not configured yet.", reason: "server_config" });
    return null;
  }
  send(res, 401, { error: "Please sign in to continue.", reason: "auth_required" });
  return null;
}

const post = (req, res) => {
  if (req.method === "POST") return true;
  res.setHeader("Allow", "POST");
  send(res, 405, { error: "Method not allowed" });
  return false;
};

/* ── People ──────────────────────────────────────────────────────────── */

const profileRef = (db, uid) => db.collection("memotifyProfiles").doc(uid);

async function loadProfile(db, uid) {
  const snap = await profileRef(db, uid).get();
  return snap.exists ? snap.data() : {};
}

async function loadPassport(db, who, profile, { force = false } = {}) {
  const fresh = profile.passport && Date.now() - profile.passport.computedAt < PASSPORT_TTL_MS;
  if (fresh && !force) return profile.passport;

  const [certs, checks, progress] = await Promise.all([
    db.collection("certificates").where("uid", "==", who.uid).get(),
    db.collection("memotifyChecks").where("uid", "==", who.uid).get(),
    db.collection(`students/${who.uid}/progress`).get(),
  ]);
  const passport = buildPassport({
    certificates: certs.docs.map((d) => ({ id: d.id, ...d.data() })),
    checks: checks.docs.map((d) => d.data()),
    progress: progress.docs.map((d) => d.data()),
    claimed: profile.claimed || [],
  });
  await profileRef(db, who.uid).set({ uid: who.uid, passport }, { merge: true });
  profile.passport = passport;
  return passport;
}

async function personOf(db, who) {
  const profile = await loadProfile(db, who.uid);
  const passport = await loadPassport(db, who, profile);
  return { profile, passport };
}

const publicProfile = (p) => ({
  stage: p.stage || null,
  fields: p.fields || [],
  city: p.city || "",
  claimed: p.claimed || [],
  cvId: p.cvId || null,
  openToWork: Boolean(p.openToWork),
  passportPublic: Boolean(p.passportPublic),
  publicId: p.passportPublic ? p.publicId : null,
  onboarded: Boolean(p.stage),
});

/* ── Jobs: public ────────────────────────────────────────────────────── */

/** A job as the public may see it. Owner details never leave the server. */
function publicJob(job) {
  const { ownerUid, reviewNote, ...rest } = job;
  void ownerUid;
  void reviewNote;
  return rest;
}

const timeOf = (job) => new Date(job.postedAt).getTime() || job.firstSeen || 0;

function feedMeta(meta) {
  if (!meta) return { checkedAt: null, stale: true, count: 0 };
  return {
    checkedAt: meta.checkedAt,
    stale: Date.now() - meta.checkedAt > STALE_MS,
    count: meta.count,
    ngnPerUsd: meta.ngnPerUsd,
    counts: meta.counts,
    sources: meta.report?.filter((s) => s.count > 0).length || 0,
  };
}

async function feed(req, res) {
  const db = store();
  const query = req.query || {};
  const { jobs, meta } = await currentJobs(db);
  const who = await optionalUser(req);
  const person = who ? await personOf(db, who) : null;
  const now = Date.now();

  const filtered = applyFilters(jobs, query);
  const cards = filtered.map((job) => {
    const card = publicJob(toCard(job));
    return person ? { ...card, fit: fitFor(job, person.passport, person.profile, now) } : card;
  });

  const sortNew = query.sort === "new" || !person;
  cards.sort((a, b) =>
    sortNew
      ? Number(b.kind === "native") - Number(a.kind === "native") || timeOf(b) - timeOf(a)
      : b.fit.score - a.fit.score || timeOf(b) - timeOf(a)
  );

  const verdict = clip(query.verdict, 12);
  const shown = verdict && person ? cards.filter((job) => job.fit.verdict === verdict) : cards;
  const ordered = spreadCompanies(shown);

  const page = Math.max(1, Number(query.page) || 1);
  const start = (page - 1) * PAGE_SIZE;
  const since = Number(query.since) || 0;

  return send(res, 200, {
    jobs: ordered.slice(start, start + PAGE_SIZE),
    total: ordered.length,
    page,
    hasMore: start + PAGE_SIZE < ordered.length,
    newSince: since ? jobs.filter((job) => (job.firstSeen || 0) > since).length : 0,
    meta: feedMeta(meta),
    signedIn: Boolean(person),
    // Nobody needs a CV advert once they have linked a CV.
    cvOnFile: Boolean(person?.profile?.cvId),
  });
}

async function findJob(db, id) {
  const { jobs } = await currentJobs(db);
  const open = jobs.find((job) => job.id === id);
  if (open) return { job: open, open: true };
  const snap = await db.collection("memotifyJobs").doc(safeId(id)).get();
  return snap.exists ? { job: { id: snap.id, ...snap.data() }, open: false } : { job: null, open: false };
}

async function job(req, res) {
  const db = store();
  const id = clip(req.query?.id, 200);
  const { job: found, open } = await findJob(db, id);
  const { jobs, meta } = await currentJobs(db);

  if (!found || (found.kind === "native" && !open && found.status !== "closed")) {
    return send(res, 404, { error: "This job has closed or was removed.", reason: "gone", meta: feedMeta(meta) });
  }

  const who = await optionalUser(req);
  const person = who ? await personOf(db, who) : null;
  let tracked = null;
  let application = null;
  if (who) {
    const snap = await db.collection("memotifyTracker").doc(trackId(who.uid, id)).get();
    tracked = snap.exists ? snap.data() : null;
    if (found.kind === "native") {
      const app = await db.collection("memotifyApplications").doc(appId(id, who.uid)).get();
      application = app.exists ? { stage: app.data().stage, appliedAt: app.data().appliedAt } : null;
    }
  }

  const similar = jobs
    .filter((other) => other.id !== found.id && other.field === found.field && other.level === found.level)
    .sort((a, b) => timeOf(b) - timeOf(a))
    .slice(0, 3)
    .map((other) => publicJob(toCard(other)));

  return send(res, 200, {
    job: publicJob(found),
    open,
    fit: person ? fitFor(found, person.passport, person.profile) : null,
    tracked,
    application,
    similar,
    meta: feedMeta(meta),
  });
}

async function stats(req, res) {
  const { jobs, meta } = await currentJobs(store());
  const count = (test) => jobs.filter(test).length;
  const demand = {};
  for (const item of jobs) for (const skill of item.must || []) demand[skill] = (demand[skill] || 0) + 1;

  const latest = spreadCompanies(
    jobs
      .filter((item) => item.level !== "senior")
      .sort((a, b) => Number(b.level === "graduate") - Number(a.level === "graduate") || timeOf(b) - timeOf(a)),
    1,
    6
  );

  res.setHeader("Cache-Control", "public, max-age=120, s-maxage=300, stale-while-revalidate=900");
  return send(res, 200, {
    total: jobs.length,
    remote: count((item) => item.remote),
    nigeria: count((item) => item.reach === "nigeria"),
    worldwide: count((item) => item.reach === "worldwide"),
    graduate: count((item) => item.level === "graduate"),
    companies: new Set(jobs.map((item) => item.company)).size,
    direct: count((item) => item.direct || item.kind === "native"),
    latest: latest.slice(0, 6).map((item) => publicJob(toCard(item))),
    demand: Object.entries(demand)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([id, jobCount]) => ({ id, jobs: jobCount })),
    meta: feedMeta(meta),
  });
}

/** Anyone may call this. The lease and the stale check make it harmless. */
async function refresh(req, res) {
  if (!post(req, res)) return undefined;
  const result = await refreshPool(store());
  return send(res, 200, result);
}

async function cron(req, res) {
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers?.authorization !== `Bearer ${secret}`) {
    return send(res, 401, { error: "Unauthorized" });
  }
  return send(res, 200, await refreshPool(store(), { force: true }));
}

async function health(req, res) {
  const status = storeStatus();
  if (!status.ok) return send(res, 503, { firebaseAdmin: status.error });
  const { meta } = await currentJobs(store());
  return send(res, 200, {
    firebaseAdmin: "ok",
    cronSecret: process.env.CRON_SECRET ? "set" : "MISSING (the daily refresh will be refused)",
    interviewPractice: interviewer().available() ? "ok" : "MISSING ANTHROPIC_API_KEY",
    keyedSource: process.env.JOBS_API_KEY ? process.env.JOBS_API_PROVIDER || "key set, provider missing" : "none",
    feed: feedMeta(meta),
    sources: meta?.report || [],
  });
}

/* ── Seeker ──────────────────────────────────────────────────────────── */

async function me(req, res) {
  const who = await requireUser(req, res);
  if (!who) return undefined;
  const db = store();
  const { profile, passport } = await personOf(db, who);

  const [checks, cvs, tracker, jobs] = await Promise.all([
    db.collection("memotifyChecks").where("uid", "==", who.uid).get(),
    db.collection("cvs").where("ownerId", "==", who.uid).get(),
    db.collection("memotifyTracker").where("uid", "==", who.uid).get(),
    currentJobs(db),
  ]);

  return send(res, 200, {
    uid: who.uid,
    name: who.name || null,
    email: who.email,
    emailVerified: who.emailVerified,
    profile: publicProfile(profile),
    passport,
    // Named fields only: the paper's seed must never leave the server.
    checks: checks.docs.map((d) => {
      const { skill, status, score, passedAt, finishedAt, expiresAt } = d.data();
      return { skill, status, score, passedAt, finishedAt, expiresAt };
    }),
    cvs: cvs.docs
      .map((d) => ({ id: d.id, title: d.data().title || "My CV", updatedAt: d.data().updatedAt?.toMillis?.() || null }))
      .sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0)),
    tracked: tracker.size,
    nextProofs: bestNextProofs(jobs.jobs, passport, { fields: profile.fields || [] }),
  });
}

async function saveProfile(req, res) {
  if (!post(req, res)) return undefined;
  const who = await requireUser(req, res);
  if (!who) return undefined;
  const db = store();
  const input = bodyOf(req);
  const current = await loadProfile(db, who.uid);

  const update = { uid: who.uid, updatedAt: Date.now() };
  if (input.stage !== undefined && STAGES.some((s) => s.id === input.stage)) update.stage = input.stage;
  if (input.fields !== undefined) update.fields = onlyKnown(input.fields, (id) => FIELDS.some((f) => f.id === id), 4);
  if (input.city !== undefined) update.city = clip(input.city, 60);
  if (input.claimed !== undefined) update.claimed = onlyKnown(input.claimed, isSkill, 40);
  if (input.openToWork !== undefined) update.openToWork = Boolean(input.openToWork);
  if (input.passportPublic !== undefined) update.passportPublic = Boolean(input.passportPublic);
  if (input.name !== undefined) update.name = clip(input.name, 80);
  if (!current.publicId && (update.openToWork || update.passportPublic)) {
    update.publicId = randomBytes(6).toString("hex");
  }
  if (!current.name && !update.name && who.name) update.name = who.name;

  await profileRef(db, who.uid).set(update, { merge: true });
  const profile = { ...current, ...update };
  const passport = await loadPassport(db, who, profile, { force: input.claimed !== undefined });
  return send(res, 200, { profile: publicProfile(profile), passport });
}

async function ownCv(db, uid, cvId) {
  const snap = await db.collection("cvs").doc(safeId(cvId)).get();
  return snap.exists && snap.data().ownerId === uid ? snap.data() : null;
}

/** Read a saved CV into claimed skills. That is the first step of the Passport. */
async function importCv(req, res) {
  if (!post(req, res)) return undefined;
  const who = await requireUser(req, res);
  if (!who) return undefined;
  const db = store();
  const { cvId } = bodyOf(req);
  const cv = await ownCv(db, who.uid, cvId);
  if (!cv) return send(res, 404, { error: "That CV was not found on your account." });

  const profile = await loadProfile(db, who.uid);
  const found = skillsIn(cvToText(cv.data || {}));
  const claimed = [...new Set([...(profile.claimed || []), ...found])].slice(0, 40);
  await profileRef(db, who.uid).set({ uid: who.uid, claimed, cvId: safeId(cvId) }, { merge: true });
  const passport = await loadPassport(db, who, { ...profile, claimed }, { force: true });
  return send(res, 200, { found, claimed, passport });
}

async function checkStart(req, res) {
  if (!post(req, res)) return undefined;
  const who = await requireUser(req, res);
  if (!who) return undefined;
  const { CHECK_IDS, startCheck, publicPaper, MINUTES, PASS_MARK } = await import("./checks.js");
  const { skill } = bodyOf(req);
  if (!CHECK_IDS.includes(skill)) return send(res, 404, { error: "There is no check for that skill yet." });

  const attempt = await startCheck(store(), who.uid, skill);
  if (attempt.status !== "open") return send(res, 200, attempt);
  return send(res, 200, {
    status: "open",
    skill,
    expiresAt: attempt.expiresAt,
    minutes: MINUTES,
    passMark: PASS_MARK,
    items: publicPaper(skill, attempt.seed),
  });
}

async function checkSubmit(req, res) {
  if (!post(req, res)) return undefined;
  const who = await requireUser(req, res);
  if (!who) return undefined;
  const { CHECK_IDS, submitCheck } = await import("./checks.js");
  const { skill, answers } = bodyOf(req);
  if (!CHECK_IDS.includes(skill)) return send(res, 404, { error: "There is no check for that skill yet." });

  const db = store();
  const result = await submitCheck(db, who.uid, skill, answers && typeof answers === "object" ? answers : {});
  if (result.error) return send(res, 409, { error: "This check is no longer running.", reason: result.error });
  await loadPassport(db, who, await loadProfile(db, who.uid), { force: true });
  return send(res, 200, result);
}

/** Which of a job's skills are on this CV, and which an ATS would miss. */
async function cvFit(req, res) {
  if (!post(req, res)) return undefined;
  const who = await requireUser(req, res);
  if (!who) return undefined;
  const db = store();
  const { jobId, cvId } = bodyOf(req);
  const [{ job: found }, cv] = await Promise.all([findJob(db, clip(jobId, 200)), ownCv(db, who.uid, cvId)]);
  if (!found || !cv) return send(res, 404, { error: "That job or CV could not be found." });

  const onCv = new Set(skillsIn(cvToText(cv.data || {})));
  const wanted = [...(found.must || []), ...(found.nice || [])];
  return send(res, 200, {
    onCv: wanted.filter((id) => onCv.has(id)),
    missing: wanted.filter((id) => !onCv.has(id)),
    summary: Boolean(cv.data?.summary),
    jobText: found.text || found.description || "",
  });
}

/** Add proven skills to a saved CV, each pointing back to the public Passport. */
async function cvProof(req, res) {
  if (!post(req, res)) return undefined;
  const who = await requireUser(req, res);
  if (!who) return undefined;
  const db = store();
  const { cvId } = bodyOf(req);
  const cv = await ownCv(db, who.uid, cvId);
  if (!cv) return send(res, 404, { error: "That CV was not found on your account." });

  const { profile, passport } = await personOf(db, who);
  const link = profile.passportPublic && profile.publicId
    ? `https://www.memorasmart.com/memotify/p/${profile.publicId}`
    : "";
  const existing = Array.isArray(cv.data?.certifications) ? cv.data.certifications : [];
  const names = new Set(existing.map((c) => c.name));
  const added = Object.entries(proofOnly(passport))
    .filter(([, held]) => held.tier === "verified")
    .map(([id, held]) => ({
      name: `${SKILLS[id].label} (verified, ${held.score}%)`,
      issuer: "Memotify by Memora Smart",
      issueDate: new Date(held.at).toLocaleDateString("en-GB", { month: "short", year: "numeric" }),
      expiryDate: "",
      noExpiry: false,
      credentialId: "",
      credentialUrl: link,
    }))
    .filter((entry) => !names.has(entry.name));

  if (added.length) {
    await db.collection("cvs").doc(safeId(cvId)).set(
      { data: { ...cv.data, certifications: [...existing, ...added] } },
      { merge: true }
    );
  }
  return send(res, 200, { added: added.length });
}

/* ── Tracker ─────────────────────────────────────────────────────────── */

const trackId = (uid, jobId) => `${uid}__${safeId(jobId)}`;
const appId = (jobId, uid) => `${safeId(jobId)}__${uid}`;

const snapshot = (item) => ({
  jobId: item.id,
  title: item.title,
  company: item.company,
  location: item.location || "",
  url: item.url || null,
  kind: item.kind || "feed",
  reach: item.reach || null,
});

async function tracker(req, res) {
  const who = await requireUser(req, res);
  if (!who) return undefined;
  const snap = await store().collection("memotifyTracker").where("uid", "==", who.uid).get();
  return send(res, 200, {
    items: snap.docs.map((d) => d.data()).sort((a, b) => b.updatedAt - a.updatedAt),
  });
}

async function track(req, res) {
  if (!post(req, res)) return undefined;
  const who = await requireUser(req, res);
  if (!who) return undefined;
  const db = store();
  const { jobId, status, note } = bodyOf(req);
  const ref = db.collection("memotifyTracker").doc(trackId(who.uid, jobId));
  const snap = await ref.get();
  const held = snap.exists ? snap.data() : null;

  if (status === "remove") {
    await ref.delete();
    return send(res, 200, { removed: true });
  }
  if (!TRACK_STAGES.some((stage) => stage.id === status)) {
    return send(res, 400, { error: "Unknown status." });
  }
  // An application made here has its stage set by the employer.
  if (held?.managed && status !== held.status) {
    return send(res, 409, { error: "The employer updates this application's stage." });
  }

  let base = held;
  if (!base) {
    const { job: found } = await findJob(db, clip(jobId, 200));
    if (!found) return send(res, 404, { error: "This job has closed or was removed." });
    base = { uid: who.uid, createdAt: Date.now(), ...snapshot(found) };
  }

  const now = Date.now();
  const item = {
    ...base,
    status,
    updatedAt: now,
    ...(status === "applied" && !base.appliedAt ? { appliedAt: now } : {}),
    ...(note !== undefined ? { note: clip(note, 500) } : {}),
  };
  await ref.set(item);
  return send(res, 200, { item });
}

async function apply(req, res) {
  if (!post(req, res)) return undefined;
  const who = await requireUser(req, res);
  if (!who) return undefined;
  if (!who.emailVerified) return send(res, 403, { error: "Please verify your email first.", reason: "email" });

  const db = store();
  const input = bodyOf(req);
  const jobId = clip(input.jobId, 200);
  const { job: found, open } = await findJob(db, jobId);
  if (!found || found.kind !== "native" || !open) {
    return send(res, 404, { error: "This job is not taking applications here." });
  }

  const cv = await ownCv(db, who.uid, input.cvId);
  if (!cv) return send(res, 400, { error: "Choose a saved CV to apply with.", reason: "cv" });

  const { profile, passport } = await personOf(db, who);
  const fit = fitFor(found, passport, profile);
  if (found.requireProof && fit.proven < fit.needed) {
    return send(res, 403, {
      error: "This employer asks for proof of every required skill before you apply.",
      reason: "proof",
    });
  }

  const data = cv.data || {};
  const now = Date.now();
  const application = {
    jobId,
    jobTitle: found.title,
    companyId: found.companyId,
    uid: who.uid,
    name: clip(data.name || profile.name || who.name, 80) || "Applicant",
    email: clip(data.email || who.email, 120),
    phone: clip(data.phone, 40),
    city: profile.city || clip(data.address, 80),
    stage_: profile.stage || null,
    note: clip(input.note, 1200),
    answers: (found.questions || []).map((question, i) => ({
      question,
      answer: clip(input.answers?.[i], 800),
    })),
    proof: proofOnly(passport),
    claimed: Object.entries(passport.skills)
      .filter(([, held]) => !TIERS[held.tier].proof)
      .map(([id]) => id),
    proven: fit.proven,
    needed: fit.needed,
    verdict: fit.verdict,
    cvText: cvToText(data).slice(0, 15000),
    stage: "new",
    appliedAt: now,
    updatedAt: now,
  };

  const appRef = db.collection("memotifyApplications").doc(appId(jobId, who.uid));
  const jobRef = db.collection("memotifyJobs").doc(jobId);
  const created = await db.runTransaction(async (t) => {
    const [existing, live] = await Promise.all([t.get(appRef), t.get(jobRef)]);
    if (existing.exists) return false;
    t.set(appRef, application);
    t.set(jobRef, { applicants: (live.data()?.applicants || 0) + 1 }, { merge: true });
    return true;
  });
  if (!created) return send(res, 409, { error: "You have already applied for this role." });

  await db.collection("memotifyTracker").doc(trackId(who.uid, jobId)).set({
    uid: who.uid,
    ...snapshot(found),
    status: "applied",
    managed: true,
    stageLabel: "New",
    appliedAt: now,
    createdAt: now,
    updatedAt: now,
  });
  return send(res, 200, { applied: true });
}

/* ── Interview practice ──────────────────────────────────────────────── */

/**
 * Newline-delimited JSON, so a question appears word by word like speech:
 *   {"text":"..."}  more of the interviewer's turn
 *   {"done":true,"asked":n,"finished":bool}  end of the turn
 *   {"error":"..."}  this turn failed and can be retried
 */
function openStream(res) {
  res.status(200);
  res.setHeader("Content-Type", "application/x-ndjson; charset=utf-8");
  res.setHeader("Cache-Control", "no-cache, no-transform");
  res.setHeader("X-Accel-Buffering", "no");
  res.flushHeaders?.();
  return (event) => res.write(`${JSON.stringify(event)}\n`);
}

async function runTurn(db, id, session, res) {
  const emit = openStream(res);
  try {
    const text = await interviewer().ask(
      { system: systemFor(session), messages: session.messages },
      (chunk) => emit({ text: chunk })
    );
    if (!text) throw new Error("empty reply");
    const asked = await saveReply(db, id, session, text);
    emit({ done: true, asked, finished: false });
  } catch (err) {
    console.error("Interview turn failed:", err.message);
    await releaseTurn(db, id);
    emit({ error: "The interviewer lost the connection. Your answer is saved, so try again." });
  }
  res.end();
}

async function trackedApplication(db, uid, jobId) {
  const snap = await db.collection("memotifyTracker").doc(trackId(uid, jobId)).get();
  const item = snap.exists ? snap.data() : null;
  return item && CAN_PRACTISE.includes(item.status) ? item : null;
}

const pastSession = (s) => ({
  id: s.id,
  jobId: s.jobId,
  title: s.title,
  company: s.company,
  status: s.status,
  verdict: s.feedback?.verdict || null,
  startedAt: s.startedAt,
});

/** Applied jobs, past sessions and what is left this week. */
async function interviews(req, res) {
  const who = await requireUser(req, res);
  if (!who) return undefined;
  const db = store();
  const [{ sessions, left, limit, resetsAt }, tracked] = await Promise.all([
    allowance(db, who.uid),
    db.collection("memotifyTracker").where("uid", "==", who.uid).get(),
  ]);
  return send(res, 200, {
    left,
    limit,
    resetsAt,
    jobs: tracked.docs
      .map((d) => d.data())
      .filter((item) => CAN_PRACTISE.includes(item.status))
      .sort((a, b) => b.updatedAt - a.updatedAt)
      .map(({ jobId, title, company, status }) => ({ jobId, title, company, status })),
    past: sessions.sort((a, b) => b.startedAt - a.startedAt).slice(0, 20).map(pastSession),
  });
}

/** Everything the page needs for one job: can they start, or resume? */
async function interviewBrief(req, res) {
  const who = await requireUser(req, res);
  if (!who) return undefined;
  const db = store();
  const jobId = clip(req.query?.jobId, 200);
  const item = await trackedApplication(db, who.uid, jobId);
  if (!item) return send(res, 403, { error: "Apply for this job first, then come back to practise.", reason: "not_applied" });

  const { sessions, left, limit, resetsAt } = await allowance(db, who.uid);
  const active = activeFor(sessions, jobId);
  return send(res, 200, {
    title: item.title,
    company: item.company,
    questions: QUESTIONS,
    left,
    limit,
    resetsAt,
    available: interviewer().available(),
    active: active ? publicSession(active.id, active) : null,
  });
}

async function interviewStart(req, res) {
  if (!post(req, res)) return undefined;
  const who = await requireUser(req, res);
  if (!who) return undefined;
  if (!interviewer().available()) return send(res, 503, { error: "Interview practice is not available right now." });

  const db = store();
  const { jobId, cvId } = bodyOf(req);
  const id = clip(jobId, 200);
  const item = await trackedApplication(db, who.uid, id);
  if (!item) return send(res, 403, { error: "Apply for this job first, then come back to practise.", reason: "not_applied" });

  const { left, resetsAt } = await allowance(db, who.uid);
  if (left <= 0) return send(res, 429, { error: "You've used this week's interviews.", reason: "limit", resetsAt });

  // A closed job can still be interviewed for, from its tracker snapshot.
  const { job: found } = await findJob(db, id);
  const job = { id, title: item.title, company: item.company, text: found?.text || "" };

  const profile = await loadProfile(db, who.uid);
  const cv = await ownCv(db, who.uid, cvId || profile.cvId || "none");
  const created = await createSession(db, { uid: who.uid, job, cvText: cv ? cvToText(cv.data || {}) : "" });

  const emit = openStream(res);
  emit({ session: created.id });
  try {
    const text = await interviewer().ask(
      { system: systemFor(created.session), messages: created.session.messages },
      (chunk) => emit({ text: chunk })
    );
    const asked = await saveReply(db, created.id, created.session, text);
    emit({ done: true, asked, finished: false });
  } catch (err) {
    console.error("Interview start failed:", err.message);
    // The person got nothing, so it must not count against their week.
    await db.collection("memotifyInterviews").doc(created.id).delete();
    emit({ error: "The interviewer could not join. This one wasn't counted, so try again." });
  }
  return res.end();
}

async function interviewAnswer(req, res) {
  if (!post(req, res)) return undefined;
  const who = await requireUser(req, res);
  if (!who) return undefined;
  const db = store();
  const { id, answer } = bodyOf(req);
  const claimed = await claimTurn(db, id, who.uid, clip(answer, MAX_ANSWER));
  if (claimed.error) {
    return send(res, claimed.error === "missing" ? 404 : 409, { error: "This interview can't take that answer.", reason: claimed.error });
  }
  if (claimed.finished) {
    const emit = openStream(res);
    emit({ done: true, asked: claimed.session.asked, finished: true });
    return res.end();
  }
  return runTurn(db, clip(id, 60), claimed.session, res);
}

async function interviewFinish(req, res) {
  if (!post(req, res)) return undefined;
  const who = await requireUser(req, res);
  if (!who) return undefined;
  const db = store();
  const id = clip(bodyOf(req).id, 60);
  const session = await loadSession(db, id, who.uid);
  if (!session) return send(res, 404, { error: "Interview not found." });
  if (session.feedback) return send(res, 200, { feedback: session.feedback });
  // Leaving early is allowed, but there has to be something to review.
  if (!session.messages.some((m, i) => i > 0 && m.role === "user")) {
    await db.collection("memotifyInterviews").doc(id).set({ status: "abandoned" }, { merge: true });
    return send(res, 200, { feedback: null });
  }
  const feedback = await interviewer().review(reviewRequest(session));
  await saveFeedback(db, id, feedback);
  return send(res, 200, { feedback });
}

async function interviewView(req, res) {
  const who = await requireUser(req, res);
  if (!who) return undefined;
  const id = clip(req.query?.id, 60);
  const session = await loadSession(store(), id, who.uid);
  if (!session) return send(res, 404, { error: "Interview not found." });
  return send(res, 200, { session: publicSession(id, session) });
}

/* ── Public Passport ─────────────────────────────────────────────────── */

async function publicPassport(req, res) {
  const db = store();
  const id = clip(req.query?.id, 40);
  const snap = await db.collection("memotifyProfiles").where("publicId", "==", id).limit(1).get();
  const profile = snap.docs[0]?.data();
  if (!profile?.passportPublic) return send(res, 404, { error: "This Passport is private or does not exist." });

  const passport = await loadPassport(db, { uid: profile.uid }, profile);
  res.setHeader("Cache-Control", "public, max-age=300");
  return send(res, 200, {
    name: profile.name || "Memotify member",
    stage: profile.stage || null,
    proof: Object.entries(proofOnly(passport)).map(([skill, held]) => ({
      skill,
      tier: held.tier,
      score: held.score ?? null,
      at: held.at ?? null,
      ref: held.ref ?? null,
      source: held.source,
    })),
    computedAt: passport.computedAt,
  });
}

/* ── Employer ────────────────────────────────────────────────────────── */

async function companyOf(db, uid) {
  const snap = await db.collection("memotifyCompanies").where("ownerUid", "==", uid).limit(1).get();
  return snap.empty ? null : { id: snap.docs[0].id, ...snap.docs[0].data() };
}

const companyJobs = async (db, companyId) => {
  const snap = await db.collection("memotifyJobs").where("companyId", "==", companyId).get();
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

async function hireHome(req, res) {
  const who = await requireUser(req, res);
  if (!who) return undefined;
  const db = store();
  const company = await companyOf(db, who.uid);
  const jobs = company ? await companyJobs(db, company.id) : [];
  return send(res, 200, {
    company,
    emailVerified: who.emailVerified,
    jobs: jobs.sort((a, b) => b.updatedAt - a.updatedAt),
  });
}

async function saveCompany(req, res) {
  if (!post(req, res)) return undefined;
  const who = await requireUser(req, res);
  if (!who) return undefined;
  const db = store();
  const input = bodyOf(req);
  const existing = await companyOf(db, who.uid);

  const name = clip(input.name, 80);
  const website = httpsUrl(input.website);
  if (name.length < 2) return send(res, 400, { error: "Enter your company's name." });
  if (!website) return send(res, 400, { error: "Enter your company's website, starting with https://." });

  const host = new URL(website).hostname.replace(/^www\./, "");
  const mailHost = String(who.email || "").split("@")[1] || "";
  const identityChanged = !existing || existing.name !== name || existing.website !== website;

  const company = {
    ownerUid: who.uid,
    ownerEmail: who.email,
    name,
    website,
    about: clip(input.about, 800),
    location: clip(input.location, 80),
    size: clip(input.size, 20),
    // For the reviewer: a hint, never an approval on its own. Anyone can buy
    // a domain, so a match does not skip review.
    domainMatch: !FREE_MAIL.test(mailHost) && (mailHost === host || mailHost.endsWith(`.${host}`)),
    status: identityChanged ? "pending" : existing.status,
    updatedAt: Date.now(),
    ...(existing ? {} : { createdAt: Date.now() }),
  };

  const id = existing?.id || randomUUID();
  await db.collection("memotifyCompanies").doc(id).set(company, { merge: true });
  return send(res, 200, { company: { id, ...company } });
}

function payText(pay) {
  if (!pay.min) return null;
  const symbol = pay.currency === "USD" ? "$" : "₦";
  const money = (n) => `${symbol}${Math.round(n).toLocaleString("en-US")}`;
  const range = pay.max && pay.max !== pay.min ? `${money(pay.min)}–${money(pay.max)}` : money(pay.min);
  return { text: `${range} a month`, naira: null };
}

const REACH_BY_OPEN = { nigeria: "nigeria", africa: "region", worldwide: "worldwide" };

async function saveJob(req, res) {
  if (!post(req, res)) return undefined;
  const who = await requireUser(req, res);
  if (!who) return undefined;
  if (!who.emailVerified) return send(res, 403, { error: "Please verify your email first.", reason: "email" });

  const db = store();
  const company = await companyOf(db, who.uid);
  if (!company) return send(res, 400, { error: "Set up your company first.", reason: "company" });

  const input = bodyOf(req);
  const title = clip(input.title, 100);
  const text = clip(input.text, 6000);
  const must = onlyKnown(input.must, isSkill, 6);
  const nice = onlyKnown(input.nice, isSkill, 4).filter((id) => !must.includes(id));
  const min = Math.max(0, Number(input.payMin) || 0);
  const max = Math.max(min, Number(input.payMax) || 0);
  const currency = input.payCurrency === "USD" ? "USD" : "NGN";

  if (title.length < 4) return send(res, 400, { error: "Give the role a clear title." });
  if (text.length < 80) return send(res, 400, { error: "Describe the role in a few sentences at least." });
  if (must.length === 0) return send(res, 400, { error: "Choose at least one required skill." });
  // Pay is required. Hidden pay wastes candidates' time, and a stated figure
  // is one of the few things a fake posting avoids.
  if (!min) return send(res, 400, { error: "State the pay. Roles without it are not listed here." });

  const mode = WORK_MODES.some((m) => m.id === input.mode) ? input.mode : "remote";
  const applyUrl = input.applyUrl ? httpsUrl(input.applyUrl) : null;
  if (input.applyUrl && !applyUrl) return send(res, 400, { error: "That application link is not valid." });

  const scam = scamFlags({ title, description: text, direct: false });
  const now = Date.now();
  const id = input.id ? safeId(input.id) : randomUUID();
  const ref = db.collection("memotifyJobs").doc(id);
  const existing = await ref.get();
  if (existing.exists && existing.data().companyId !== company.id) {
    return send(res, 403, { error: "That job belongs to another company." });
  }

  const record = {
    kind: "native",
    companyId: company.id,
    ownerUid: who.uid,
    company: company.name,
    title,
    text,
    type: JOB_TYPES.includes(input.type) ? input.type : "Full-time",
    mode,
    remote: mode === "remote",
    location: clip(input.location, 80),
    reach: REACH_BY_OPEN[input.openTo] || "nigeria",
    level: Object.keys(LEVELS).includes(input.level) ? input.level : "graduate",
    field: FIELDS.some((f) => f.id === input.field) ? input.field : "other",
    must,
    nice,
    requireProof: Boolean(input.requireProof),
    pay: payText({ min, max, currency }),
    payMin: min,
    payMax: max,
    payCurrency: currency,
    questions: (Array.isArray(input.questions) ? input.questions : [])
      .map((q) => clip(q, 200))
      .filter(Boolean)
      .slice(0, 3),
    applyUrl,
    url: applyUrl,
    closesAt: Number(input.closesAt) || null,
    postedAt: existing.exists ? existing.data().postedAt : new Date(now).toISOString(),
    firstSeen: existing.exists ? existing.data().firstSeen : now,
    source: company.name,
    direct: true,
    flags: scam.flags,
    // Published at once only for a company a person has verified, with a clean
    // scan. Everything else waits in the admin queue.
    status: company.status === "verified" && scam.flags.length === 0 ? "live" : "pending",
    applicants: existing.exists ? existing.data().applicants || 0 : 0,
    updatedAt: now,
  };

  await ref.set(record);
  return send(res, 200, { job: { id, ...record } });
}

async function ownedJob(db, uid, jobId) {
  const company = await companyOf(db, uid);
  if (!company) return null;
  const snap = await db.collection("memotifyJobs").doc(safeId(jobId)).get();
  if (!snap.exists || snap.data().companyId !== company.id) return null;
  return { id: snap.id, ...snap.data(), companyRecord: company };
}

async function closeJob(req, res) {
  if (!post(req, res)) return undefined;
  const who = await requireUser(req, res);
  if (!who) return undefined;
  const db = store();
  const owned = await ownedJob(db, who.uid, bodyOf(req).jobId);
  if (!owned) return send(res, 404, { error: "Job not found." });
  await db.collection("memotifyJobs").doc(owned.id).set({ status: "closed", updatedAt: Date.now() }, { merge: true });
  return send(res, 200, { closed: true });
}

/** What the list view may hold. CV text and contacts wait for the detail view. */
const applicantRow = (id, app) => ({
  id,
  name: app.name,
  city: app.city,
  stage: app.stage,
  proof: app.proof,
  proven: app.proven,
  needed: app.needed,
  verdict: app.verdict,
  appliedAt: app.appliedAt,
});

async function applicants(req, res) {
  const who = await requireUser(req, res);
  if (!who) return undefined;
  const db = store();
  const owned = await ownedJob(db, who.uid, req.query?.jobId);
  if (!owned) return send(res, 404, { error: "Job not found." });

  const snap = await db.collection("memotifyApplications").where("jobId", "==", owned.id).get();
  const rows = snap.docs
    .map((d) => applicantRow(d.id, d.data()))
    .sort((a, b) => b.proven - a.proven || a.appliedAt - b.appliedAt);
  const { companyRecord, ownerUid, ...job } = owned;
  void companyRecord;
  void ownerUid;
  return send(res, 200, { job, applicants: rows });
}

async function ownedApplication(db, uid, id) {
  const company = await companyOf(db, uid);
  const snap = await db.collection("memotifyApplications").doc(clip(id, 300)).get();
  if (!company || !snap.exists || snap.data().companyId !== company.id) return null;
  return snap.data();
}

async function applicant(req, res) {
  const who = await requireUser(req, res);
  if (!who) return undefined;
  const app = await ownedApplication(store(), who.uid, req.query?.id);
  if (!app) return send(res, 404, { error: "Application not found." });
  const { uid, ...visible } = app;
  void uid;
  return send(res, 200, { application: { id: req.query.id, ...visible } });
}

async function moveApplicant(req, res) {
  if (!post(req, res)) return undefined;
  const who = await requireUser(req, res);
  if (!who) return undefined;
  const db = store();
  const { id, stage } = bodyOf(req);
  const app = await ownedApplication(db, who.uid, id);
  const step = PIPELINE.find((s) => s.id === stage);
  if (!app || !step) return send(res, 404, { error: "Application not found." });

  const now = Date.now();
  await db.collection("memotifyApplications").doc(clip(id, 300)).set({ stage, updatedAt: now }, { merge: true });
  // The candidate sees every move. Silence after applying is the single most
  // common complaint from job seekers, and here it costs the employer one tap.
  await db.collection("memotifyTracker").doc(trackId(app.uid, app.jobId)).set(
    { status: step.track, stageLabel: step.label, updatedAt: now },
    { merge: true }
  );
  return send(res, 200, { stage });
}

/**
 * Candidates who opted in, reduced to their proof. No surname, contact details
 * or uid: the employer learns who someone is only when that person applies.
 */
async function talent(req, res) {
  const who = await requireUser(req, res);
  if (!who) return undefined;
  const db = store();
  const company = await companyOf(db, who.uid);
  if (company?.status !== "verified") {
    return send(res, 403, { error: "Talent search opens once your company is verified.", reason: "unverified" });
  }

  const wanted = onlyKnown(String(req.query?.skills || "").split(","), isSkill, 5);
  const snap = await db.collection("memotifyProfiles").where("openToWork", "==", true).limit(300).get();
  const people = snap.docs
    .map((d) => d.data())
    .map((person) => ({ person, proof: proofOnly(person.passport) }))
    .filter(({ proof }) => Object.keys(proof).length > 0 && wanted.every((id) => proof[id]))
    .map(({ person, proof }) => ({
      handle: person.publicId,
      name: `${String(person.name || "Candidate").split(/\s+/)[0]} ${String(person.name || "").split(/\s+/)[1]?.[0] || ""}`.trim(),
      stage: person.stage || null,
      city: person.city || "",
      fields: person.fields || [],
      proof,
    }))
    .sort((a, b) => Object.keys(b.proof).length - Object.keys(a.proof).length)
    .slice(0, 40);
  return send(res, 200, { people });
}

async function invite(req, res) {
  if (!post(req, res)) return undefined;
  const who = await requireUser(req, res);
  if (!who) return undefined;
  const db = store();
  const { handle, jobId } = bodyOf(req);
  const owned = await ownedJob(db, who.uid, jobId);
  if (!owned || owned.status !== "live") return send(res, 404, { error: "Choose one of your live jobs." });
  if (owned.companyRecord.status !== "verified") return send(res, 403, { error: "Your company is not verified yet." });

  const company = owned.companyRecord;
  const day = new Date().toISOString().slice(0, 10);
  const sent = company.inviteDay === day ? company.invitesSent || 0 : 0;
  if (sent >= INVITES_PER_DAY) return send(res, 429, { error: "You have reached today's invite limit." });

  const snap = await db.collection("memotifyProfiles").where("publicId", "==", clip(handle, 40)).limit(1).get();
  const person = snap.docs[0]?.data();
  if (!person?.openToWork) return send(res, 404, { error: "This candidate is no longer available." });

  const ref = db.collection("memotifyTracker").doc(trackId(person.uid, owned.id));
  if ((await ref.get()).exists) return send(res, 200, { invited: true, already: true });

  const now = Date.now();
  await ref.set({
    uid: person.uid,
    ...snapshot(owned),
    status: "saved",
    invited: true,
    createdAt: now,
    updatedAt: now,
  });
  await db.collection("memotifyCompanies").doc(company.id).set({ inviteDay: day, invitesSent: sent + 1 }, { merge: true });
  return send(res, 200, { invited: true });
}

/* ── Reports and review ──────────────────────────────────────────────── */

async function report(req, res) {
  if (!post(req, res)) return undefined;
  // Signed-in only, and one vote per person: otherwise anyone could take down
  // a competitor's job by refreshing a form.
  const who = await requireUser(req, res);
  if (!who) return undefined;
  const db = store();
  const input = bodyOf(req);
  const jobId = safeId(input.jobId);
  const { job: found } = await findJob(db, clip(input.jobId, 200));
  if (!found) return send(res, 404, { error: "Job not found." });

  const ref = db.collection("memotifyReports").doc(jobId);
  const hidden = await db.runTransaction(async (t) => {
    const snap = await t.get(ref);
    const prior = snap.exists ? snap.data() : { uids: [], reasons: [] };
    if (prior.uids.includes(who.uid)) return prior.hidden || false;
    const uids = [...prior.uids, who.uid];
    const hide = uids.length >= REPORTS_TO_HIDE;
    t.set(ref, {
      jobId,
      title: found.title,
      company: found.company,
      url: found.url || null,
      uids,
      reasons: [...prior.reasons, clip(input.reason, 200)].slice(-10),
      hidden: hide,
      resolved: false,
      updatedAt: Date.now(),
    });
    return hide;
  });
  return send(res, 200, { reported: true, hidden });
}

async function requireAdmin(req, res) {
  const who = await requireUser(req, res);
  if (!who) return null;
  if (!who.admin) {
    send(res, 403, { error: "Admins only." });
    return null;
  }
  return who;
}

async function adminQueue(req, res) {
  if (!(await requireAdmin(req, res))) return undefined;
  const db = store();
  const [companies, jobs, reports, { meta }] = await Promise.all([
    db.collection("memotifyCompanies").where("status", "==", "pending").get(),
    db.collection("memotifyJobs").where("status", "==", "pending").get(),
    db.collection("memotifyReports").where("resolved", "==", false).get(),
    currentJobs(db),
  ]);
  const list = (snap) => snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  return send(res, 200, {
    companies: list(companies),
    jobs: list(jobs),
    reports: list(reports).map(({ uids, ...entry }) => ({ ...entry, votes: uids.length })),
    feed: feedMeta(meta),
    sources: meta?.report || [],
  });
}

async function adminDecide(req, res) {
  if (!post(req, res)) return undefined;
  if (!(await requireAdmin(req, res))) return undefined;
  const db = store();
  const { type, id, decision, note } = bodyOf(req);
  const now = Date.now();
  const key = clip(id, 200);

  if (type === "company") {
    const status = decision === "approve" ? "verified" : "rejected";
    await db.collection("memotifyCompanies").doc(key).set({ status, reviewNote: clip(note, 300), reviewedAt: now }, { merge: true });
    // Verifying a company releases whatever it was waiting on, unless flagged.
    if (status === "verified") {
      const held = await companyJobs(db, key);
      await Promise.all(
        held
          .filter((item) => item.status === "pending" && !(item.flags || []).length)
          .map((item) => db.collection("memotifyJobs").doc(item.id).set({ status: "live", updatedAt: now }, { merge: true }))
      );
    }
    return send(res, 200, { status });
  }

  if (type === "job") {
    const status = decision === "approve" ? "live" : "rejected";
    await db.collection("memotifyJobs").doc(key).set({ status, reviewNote: clip(note, 300), updatedAt: now }, { merge: true });
    return send(res, 200, { status });
  }

  if (type === "report") {
    await db.collection("memotifyReports").doc(key).set(
      { resolved: true, hidden: decision === "approve", updatedAt: now },
      { merge: true }
    );
    return send(res, 200, { resolved: true });
  }

  return send(res, 400, { error: "Unknown review type." });
}

export const routes = {
  feed,
  job,
  stats,
  refresh,
  cron,
  health,
  me,
  profile: saveProfile,
  "import-cv": importCv,
  "check-start": checkStart,
  "check-submit": checkSubmit,
  "cv-fit": cvFit,
  "cv-proof": cvProof,
  tracker,
  track,
  apply,
  interviews,
  "interview-brief": interviewBrief,
  "interview-start": interviewStart,
  "interview-answer": interviewAnswer,
  "interview-finish": interviewFinish,
  "interview-view": interviewView,
  "passport-public": publicPassport,
  "hire-home": hireHome,
  company: saveCompany,
  "job-save": saveJob,
  "job-close": closeJob,
  applicants,
  applicant,
  "applicant-move": moveApplicant,
  talent,
  invite,
  report,
  "admin-queue": adminQueue,
  "admin-decide": adminDecide,
};
