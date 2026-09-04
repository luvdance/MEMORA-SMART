// src/pages/dashboard/projectFormatterCache.js
//
// Caches the expensive AI step so re-formatting the SAME document doesn't
// pay for it twice.
//
// Cost shape of the pipeline, for context on why only some of it is
// cached: upload (Python) and render (Python) are free — no model calls.
// classify.js sends EVERY paragraph of the document to a Sonnet-tier
// model in batches, so it dominates the bill and scales with document
// length. generate-content.js is Haiku-tier on short prompts, so it's
// cheap, but it fires on every "Format Project" click, which adds up
// while iterating.
//
// Both are keyed so a cache hit is only ever served for genuinely
// identical input:
//   - classifications: keyed by a SHA-256 of the file's own bytes, so a
//     different document (or an edited one) can never collide with it.
//   - AI-drafted prelim text: keyed by the personal details that are
//     actually fed into the draft, so changing the supervisor's name or
//     who the work is dedicated to produces a fresh draft rather than
//     silently reusing the old one.
//
// Everything here fails soft. localStorage throws in private windows and
// when the quota is full, and a caching problem must never be able to
// break formatting — every read returns null on failure and every write
// is best-effort.

const PREFIX = "pf-cache:";

// Bump when a change to classify.js's prompt/schema (or the roles in
// classifySchema.js) would make previously cached classifications wrong.
// Old entries key differently and are ignored, then evicted by age.
// Bumped to v2 when classification moved from the AI classifier to
// lib/deterministicClassify.js: the role vocabulary gained four
// front-matter heading roles, so v1 entries would map incorrectly.
const CLASSIFY_VERSION = "v2";
const DRAFT_VERSION = "v1";

// Entries are small (a classification array for a long project is tens of
// KB), but localStorage is a shared ~5MB budget for the whole origin, so
// keep a bounded number and evict the least recently used.
const MAX_ENTRIES = 8;

function safeGetStorage() {
  try {
    const s = window.localStorage;
    const probe = `${PREFIX}__probe__`;
    s.setItem(probe, "1");
    s.removeItem(probe);
    return s;
  } catch {
    return null; // private window, storage disabled, or quota-locked
  }
}

function readEntry(key) {
  const store = safeGetStorage();
  if (!store) return null;
  try {
    const raw = store.getItem(PREFIX + key);
    if (!raw) return null;
    const entry = JSON.parse(raw);
    // Touch for LRU without rewriting the payload's cachedAt.
    entry.lastUsedAt = Date.now();
    store.setItem(PREFIX + key, JSON.stringify(entry));
    return entry;
  } catch {
    return null;
  }
}

function writeEntry(key, payload) {
  const store = safeGetStorage();
  if (!store) return;
  const entry = { ...payload, cachedAt: Date.now(), lastUsedAt: Date.now() };
  try {
    store.setItem(PREFIX + key, JSON.stringify(entry));
  } catch {
    // Almost certainly a quota error — drop the oldest entries and retry
    // once. If it still fails, give up silently: an uncached run is
    // slower and costs a call, but it is not an error the user should
    // ever see.
    try {
      evictOldest(Math.ceil(MAX_ENTRIES / 2));
      store.setItem(PREFIX + key, JSON.stringify(entry));
    } catch {
      /* not cacheable — proceed uncached */
    }
  }
  pruneToLimit();
}

function allEntryKeys(store) {
  const keys = [];
  for (let i = 0; i < store.length; i++) {
    const k = store.key(i);
    if (k && k.startsWith(PREFIX)) keys.push(k);
  }
  return keys;
}

function evictOldest(count) {
  const store = safeGetStorage();
  if (!store) return;
  const scored = [];
  for (const k of allEntryKeys(store)) {
    let used = 0;
    try {
      used = JSON.parse(store.getItem(k))?.lastUsedAt || 0;
    } catch {
      used = 0; // unparseable entry — treat as oldest so it gets dropped
    }
    scored.push([used, k]);
  }
  scored.sort((a, b) => a[0] - b[0]);
  for (const [, k] of scored.slice(0, count)) {
    try {
      store.removeItem(k);
    } catch {
      /* ignore */
    }
  }
}

function pruneToLimit() {
  const store = safeGetStorage();
  if (!store) return;
  const excess = allEntryKeys(store).length - MAX_ENTRIES;
  if (excess > 0) evictOldest(excess);
}

async function sha256Hex(arrayBuffer) {
  const digest = await window.crypto.subtle.digest("SHA-256", arrayBuffer);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * Content hash of the uploaded file. Hashing the BYTES (not the filename)
 * is what makes a hit trustworthy: editing a document in Word and
 * re-uploading it under the same name produces a different hash, so the
 * stale classification is never served for changed content.
 *
 * crypto.subtle needs a secure context (https, or localhost in dev). If
 * it isn't available, fall back to name+size+lastModified — weaker, but
 * still changes whenever the file is edited and re-saved.
 */
export async function fileCacheKey(file) {
  try {
    if (window.crypto?.subtle) {
      return await sha256Hex(await file.arrayBuffer());
    }
  } catch {
    /* fall through to the metadata key */
  }
  return `meta-${file.name}-${file.size}-${file.lastModified}`;
}

// --- classifications -------------------------------------------------

export function getCachedClassifications(fileKey) {
  const entry = readEntry(`classify:${CLASSIFY_VERSION}:${fileKey}`);
  if (!entry || !Array.isArray(entry.classifications)) return null;
  return {
    classifications: entry.classifications,
    // Extracted front-matter travels with the classification it came
    // from, so a cache hit skips the whole step rather than leaving the
    // details form empty.
    prelimFields: entry.prelimFields || null,
    missingFields: entry.missingFields || [],
    cachedAt: entry.cachedAt,
  };
}

export function setCachedClassifications(fileKey, classifications, extras = {}) {
  if (!Array.isArray(classifications) || classifications.length === 0) return;
  writeEntry(`classify:${CLASSIFY_VERSION}:${fileKey}`, {
    classifications,
    prelimFields: extras.prelimFields || null,
    missingFields: extras.missingFields || [],
  });
}

// --- AI-drafted dedication / acknowledgement --------------------------

// Only the fields the drafter actually receives take part in the key —
// changing an unrelated field (say, the dean's name) shouldn't throw away
// a perfectly good draft, but changing one the draft is built from must.
function draftInputKey(personalDetails = {}) {
  const relevant = [
    personalDetails.firstName, personalDetails.middleName, personalDetails.surname,
    personalDetails.supervisorName, personalDetails.hodName, personalDetails.dedicationTo,
  ].map((v) => (v || "").trim().toLowerCase());
  return relevant.join("|");
}

export function getCachedDraft(fileKey, personalDetails) {
  const entry = readEntry(
    `draft:${DRAFT_VERSION}:${fileKey}:${draftInputKey(personalDetails)}`
  );
  if (!entry || !entry.draft) return null;
  return entry.draft;
}

export function setCachedDraft(fileKey, personalDetails, draft) {
  if (!draft || (!draft.dedicationText && !draft.acknowledgementText)) return;
  writeEntry(
    `draft:${DRAFT_VERSION}:${fileKey}:${draftInputKey(personalDetails)}`,
    { draft }
  );
}

// --- maintenance ------------------------------------------------------

/** Drops every cached entry for one document — used by "Re-analyze". */
export function clearCacheForFile(fileKey) {
  const store = safeGetStorage();
  if (!store) return;
  for (const k of allEntryKeys(store)) {
    if (k.includes(fileKey)) {
      try {
        store.removeItem(k);
      } catch {
        /* ignore */
      }
    }
  }
}

/** Drops everything this module has stored. */
export function clearAllCache() {
  const store = safeGetStorage();
  if (!store) return;
  for (const k of allEntryKeys(store)) {
    try {
      store.removeItem(k);
    } catch {
      /* ignore */
    }
  }
}
