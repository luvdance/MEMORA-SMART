/**
 * THE JOB POOL
 *
 * Fetches every source, keeps only what passes the checks in screen.js, and
 * stores the survivors so that a page view never touches a third-party feed.
 *
 * STORAGE
 * One gzipped JSON blob split across a few documents in memotifyFeed, not one
 * document per job. A refresh replaces the whole pool, so per-job documents
 * would cost a thousand writes a time on a free Firestore quota, and a page
 * view would cost reads to match. This costs a handful of each, and a closed
 * job vanishes on the next refresh without anyone having to delete it.
 *
 * FRESHNESS
 * Vercel's Hobby plan runs a cron once a day, which is not "current". So a
 * cron guarantees the daily floor, and between crons the first visitor to find
 * the pool older than STALE_MS triggers a refresh through /refresh. A lease
 * makes sure only one runs. The visitor is served the existing pool at once.
 */

import { gzipSync, gunzipSync } from "node:zlib";
import { fetchSources, fetchNgnRate } from "./sources.js";
import { reachOf, levelOf, scamFlags, readSkills, fieldOf, nairaMonthly } from "./screen.js";
import { VERDICTS } from "../../src/memotify/data/skills.js";

export const STALE_MS = 3 * 60 * 60 * 1000;
const LEASE_MS = 10 * 60 * 1000;
const MEMORY_MS = 5 * 60 * 1000;
const NATIVE_MEMORY_MS = 60 * 1000;
/** Firestore's document limit is 1 MiB; bytes in a field need headroom. */
const SHARD_BYTES = 900 * 1024;

/**
 * Oldest posting kept. An employer board drops closed roles, so a long life
 * there is still a real opening. Other boards rarely delete anything.
 */
const MAX_AGE_DAYS = { direct: 120, board: 45 };

const FEED = "memotifyFeed";

const fingerprint = (job) =>
  `${String(job.title).toLowerCase().replace(/[^a-z0-9]+/g, " ").trim()}|${String(job.company).toLowerCase().trim()}`;

/** Show the feed's own figure when given, plus naira where it can be worked out. */
function payOf(job, ngnPerUsd) {
  const pay = job.salary;
  if (pay && typeof pay === "object" && pay.min) {
    const money = (n) => `${pay.currency === "USD" ? "$" : `${pay.currency} `}${Math.round(n).toLocaleString("en-US")}`;
    const range = pay.max && pay.max !== pay.min ? `${money(pay.min)}–${money(pay.max)}` : money(pay.min);
    return { text: `${range} a ${pay.period || "year"}`, naira: nairaMonthly(pay, ngnPerUsd) };
  }
  return typeof pay === "string" && pay ? { text: pay, naira: null } : null;
}

/**
 * Raw postings in, the pool out. Pure: selfTest runs it on fixtures.
 *
 * @returns {{jobs: object[], counts: {seen, closedToNigeria, stale, scam, duplicate}}}
 */
export function screenPostings(raw, { now = Date.now(), ngnPerUsd = null, firstSeen = {} } = {}) {
  const counts = { seen: raw.length, closedToNigeria: 0, stale: 0, scam: 0, duplicate: 0 };
  const firstRun = Object.keys(firstSeen).length === 0;
  const seen = new Set();
  const jobs = [];

  // Employer boards first, so de-duplication keeps the employer's own record.
  const ordered = [...raw].sort((a, b) => Number(Boolean(b.direct)) - Number(Boolean(a.direct)));

  for (const post of ordered) {
    if (!post.title || !post.company || !/^https?:\/\//i.test(post.url || "")) continue;

    const print = fingerprint(post);
    if (seen.has(print)) {
      counts.duplicate += 1;
      continue;
    }
    seen.add(print);

    const { reach, remote } = reachOf(post);
    if (!reach) {
      counts.closedToNigeria += 1;
      continue;
    }

    const posted = new Date(post.postedAt).getTime() || null;
    const age = posted ? (now - posted) / 86400000 : 0;
    if (age > MAX_AGE_DAYS[post.direct ? "direct" : "board"]) {
      counts.stale += 1;
      continue;
    }

    const scam = scamFlags(post);
    if (scam.blocked) {
      counts.scam += 1;
      continue;
    }

    const field = fieldOf(post);
    const { must, nice } = readSkills({ ...post, field });
    jobs.push({
      id: post.id,
      kind: "feed",
      title: post.title.trim(),
      company: post.company.trim(),
      location: post.location || "",
      reach,
      remote,
      level: levelOf(post),
      field,
      must,
      nice,
      url: post.url,
      postedAt: post.postedAt || null,
      // On the very first run nothing is "new", so fall back to its posting date.
      firstSeen: firstSeen[post.id] || (firstRun ? posted || now : now),
      direct: Boolean(post.direct),
      source: post.source,
      pay: payOf(post, ngnPerUsd),
      flags: scam.flags,
      text: post.description || "",
    });
  }

  return { jobs, counts };
}

/* ── Storage ─────────────────────────────────────────────────────────── */

async function savePool(db, pool, meta) {
  const blob = gzipSync(Buffer.from(JSON.stringify(pool)));
  const version = String(meta.checkedAt);
  const parts = [];
  for (let at = 0; at < blob.length; at += SHARD_BYTES) parts.push(blob.subarray(at, at + SHARD_BYTES));

  const col = db.collection(FEED);
  const old = (await col.doc("meta").get()).data();

  // New shards first, then the meta that points at them, then the old ones go.
  // A reader mid-refresh always finds a complete set.
  await Promise.all(parts.map((part, i) => col.doc(`s-${version}-${i}`).set({ part })));
  await col.doc("meta").set({ ...meta, version, shards: parts.length });
  if (old?.version && old.version !== version) {
    await Promise.all(
      Array.from({ length: old.shards || 0 }, (_, i) => col.doc(`s-${old.version}-${i}`).delete())
    );
  }
}

let memory = { at: 0, version: null, jobs: [], meta: null };
let native = { at: 0, jobs: [] };
let hidden = { at: 0, ids: new Set() };

export function clearFeedMemory() {
  memory = { at: 0, version: null, jobs: [], meta: null };
  native = { at: 0, jobs: [] };
  hidden = { at: 0, ids: new Set() };
}

async function loadPool(db) {
  const now = Date.now();
  if (memory.meta && now - memory.at < MEMORY_MS) return memory;

  const col = db.collection(FEED);
  const metaSnap = await col.doc("meta").get();
  if (!metaSnap.exists) return { jobs: [], meta: null };
  const meta = metaSnap.data();

  if (meta.version === memory.version) {
    memory = { ...memory, at: now, meta };
    return memory;
  }

  const parts = await Promise.all(
    Array.from({ length: meta.shards }, (_, i) => col.doc(`s-${meta.version}-${i}`).get())
  );
  const blob = Buffer.concat(parts.map((p) => Buffer.from(p.data().part)));
  memory = { at: now, version: meta.version, meta, jobs: JSON.parse(gunzipSync(blob).toString()) };
  return memory;
}

/** Live employer-posted jobs. Short cache, so an approval shows up quickly. */
async function loadNative(db) {
  const now = Date.now();
  if (now - native.at < NATIVE_MEMORY_MS) return native.jobs;
  const snap = await db.collection("memotifyJobs").where("status", "==", "live").get();
  native = {
    at: now,
    jobs: snap.docs
      .map((d) => ({ id: d.id, ...d.data() }))
      .filter((job) => !job.closesAt || job.closesAt > now),
  };
  return native.jobs;
}

/** Feed jobs taken down after repeated reports. */
async function loadHidden(db) {
  const now = Date.now();
  if (now - hidden.at < NATIVE_MEMORY_MS) return hidden.ids;
  const snap = await db.collection("memotifyReports").where("hidden", "==", true).get();
  hidden = { at: now, ids: new Set(snap.docs.map((d) => d.id)) };
  return hidden.ids;
}

/** Everything open right now: employer posts first, then the checked feed. */
export async function currentJobs(db) {
  const [pool, natives, taken] = await Promise.all([loadPool(db), loadNative(db), loadHidden(db)]);
  return {
    jobs: [...natives, ...pool.jobs].filter((job) => !taken.has(job.id)),
    meta: pool.meta || null,
  };
}

/* ── Refresh ─────────────────────────────────────────────────────────── */

async function takeLease(db, now) {
  const ref = db.collection(FEED).doc("lease");
  return db.runTransaction(async (t) => {
    const snap = await t.get(ref);
    if (snap.exists && snap.data().until > now) return false;
    t.set(ref, { until: now + LEASE_MS });
    return true;
  });
}

/** Run a full refresh, unless one is running or the pool is still fresh. */
export async function refreshPool(db, { force = false, now = Date.now() } = {}) {
  const existing = await loadPool(db);
  if (!force && existing.meta && now - existing.meta.checkedAt < STALE_MS) {
    return { refreshed: false, reason: "fresh" };
  }
  if (!(await takeLease(db, now))) return { refreshed: false, reason: "running" };

  const firstSeen = Object.fromEntries((existing.jobs || []).map((job) => [job.id, job.firstSeen]));
  const [{ jobs: raw, report }, fetchedRate] = await Promise.all([fetchSources(), fetchNgnRate()]);
  const ngnPerUsd = fetchedRate || existing.meta?.ngnPerUsd || null;

  // Never replace a good pool with a broken one. If most sources failed, the
  // old list is more truthful than a short new one.
  const sourcesUp = report.filter((source) => !source.error).length;
  const { jobs, counts } = screenPostings(raw, { now, ngnPerUsd, firstSeen });
  if (existing.jobs?.length && (sourcesUp < report.length / 2 || jobs.length < existing.jobs.length / 3)) {
    await db.collection(FEED).doc("lease").set({ until: 0 });
    console.error("Memotify refresh rejected", { sourcesUp, jobs: jobs.length, report });
    return { refreshed: false, reason: "sources-down", report };
  }

  const meta = { checkedAt: now, ngnPerUsd, counts, report, count: jobs.length };
  await savePool(db, jobs, meta);
  await db.collection(FEED).doc("lease").set({ until: 0 });
  memory = { at: Date.now(), version: String(now), jobs, meta };
  return { refreshed: true, count: jobs.length, counts };
}

/* ── Reading ─────────────────────────────────────────────────────────── */

/** A job as it appears in a list: no full text, nothing the list doesn't use. */
export function toCard(job) {
  const { text, ...card } = job;
  void text;
  return card;
}

const matchesQuery = (job, words) => {
  const hay = `${job.title} ${job.company} ${job.location} ${(job.must || []).join(" ")}`.toLowerCase();
  return words.every((word) => hay.includes(word));
};

export function applyFilters(jobs, { q = "", where = "any", level = "any", field = "", skill = "" } = {}) {
  const words = String(q).toLowerCase().split(/\s+/).filter(Boolean);
  return jobs.filter((job) => {
    if (words.length && !matchesQuery(job, words)) return false;
    if (where === "remote" && !job.remote) return false;
    if (where === "nigeria" && job.reach !== "nigeria") return false;
    if (level === "graduate" && job.level !== "graduate") return false;
    if (field && job.field !== field) return false;
    if (skill && !(job.must || []).includes(skill)) return false;
    return true;
  });
}

/**
 * Stop one company with fifty roles owning the top of the list: past the
 * limit, its remaining roles move down rather than disappear.
 */
export function spreadCompanies(jobs, perCompany = 3, window = 30) {
  const counts = {};
  const front = [];
  const back = [];
  for (const job of jobs) {
    const seen = (counts[job.company] = (counts[job.company] || 0) + 1);
    (seen <= perCompany || front.length >= window ? front : back).push(job);
  }
  return [...front, ...back];
}

export const VERDICT_ORDER = Object.keys(VERDICTS);
