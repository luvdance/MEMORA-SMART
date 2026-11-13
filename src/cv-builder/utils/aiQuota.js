// ── AI ALLOWANCES ──
// How many paid AI calls each plan may make in a rolling 24 hours. Every call
// to Claude costs money, so each one is counted on the server in Firestore
// (aiUsage/{uid}) before the model runs. A count kept in server memory reset
// on every cold start, so it never stopped anyone.
//
// Pure functions, no Firebase imports: the server (lib/cv/quota.js) decides
// with them and the browser can show the same numbers.

export const AI_WINDOW_MS = 24 * 60 * 60 * 1000;

// Strict limits, chosen by the owner on 2026-11-13. Change numbers only here.
export const AI_LIMITS = {
  free: { write: 5, assist: 5, scan: 5, ats: 0, optimize: 0, letter: 0 },
  premium: { write: 20, assist: 20, scan: 20, ats: 8, optimize: 3, letter: 3 },
};

// The homepage search runs for signed-out visitors, so it is counted per
// network address, with a ceiling for the whole site as a last line.
export const SEARCH_LIMITS = { perVisitor: 10, site: 300 };

export const AI_LABELS = {
  write: "writing suggestions",
  assist: "quick edits",
  scan: "document scans",
  ats: "ATS checks",
  optimize: "CV rewrites",
  letter: "cover letters",
  search: "searches",
};

/** Timestamps (ms) still inside the window, oldest first. */
function recent(stamps, now) {
  return (Array.isArray(stamps) ? stamps : [])
    .map(Number)
    .filter((t) => Number.isFinite(t) && t > now - AI_WINDOW_MS && t <= now + 60000)
    .sort((a, b) => a - b);
}

/**
 * May this caller spend one `kind` call now?
 * @param {object} usage   the aiUsage document ({ [kind]: number[] })
 * @param {string} kind
 * @param {number} limit   calls allowed per window
 * @returns {{ok: boolean, used: number, limit: number, left: number, resetsAt: number|null, stamps: number[]}}
 *   `stamps` is what to store when ok is true (the new call included).
 */
export function decideAi(usage, kind, limit, now = Date.now()) {
  const kept = recent(usage?.[kind], now);
  const ok = kept.length < limit;
  const stamps = ok ? [...kept, now] : kept;
  const used = stamps.length;
  return {
    ok,
    used,
    limit,
    left: Math.max(0, limit - used),
    // When the oldest counted call drops out and frees a place.
    resetsAt: used >= limit && stamps.length ? stamps[0] + AI_WINDOW_MS : null,
    stamps,
  };
}

/** The limit for this plan and kind. */
export const aiLimit = (kind, premium) => (premium ? AI_LIMITS.premium : AI_LIMITS.free)[kind] ?? 0;

/** "in 3 hours" / "in 25 minutes", for the limit message. */
export function untilText(resetsAt, now = Date.now()) {
  if (!resetsAt) return "later today";
  const mins = Math.max(1, Math.ceil((resetsAt - now) / 60000));
  if (mins < 60) return `in ${mins} minute${mins === 1 ? "" : "s"}`;
  const hours = Math.ceil(mins / 60);
  return `in ${hours} hour${hours === 1 ? "" : "s"}`;
}

/** The message shown when an allowance is used up. */
export function limitMessage(kind, { limit, resetsAt, premium }, now = Date.now()) {
  const label = AI_LABELS[kind] || "AI requests";
  const base = `You have used all ${limit} ${label} for today. You can make more ${untilText(resetsAt, now)}.`;
  const upgrade = !premium && aiLimit(kind, true) > limit
    ? ` CV Premium gives you ${aiLimit(kind, true)} a day.`
    : "";
  return base + upgrade;
}
