/**
 * LIVE SESSIONS
 *
 * Scheduled classes that run at a fixed time with a real instructor, alongside
 * the self-paced lessons. The recorded lessons are the spine of the course;
 * these are where people ask the question they could not ask a web page.
 *
 * ── HOW TO ADD ONE ────────────────────────────────────────────────────────
 * Add an entry to SESSIONS below. Fields:
 *
 *   id           unique, stable
 *   courseId     which course it belongs to ("data-analysis")
 *   moduleId     optional. The module it accompanies, so the player can show
 *                it to people who are actually at that point
 *   title        what will be covered
 *   summary      one or two sentences
 *   host         who is teaching it
 *   startsAt     ISO 8601 WITH the timezone offset, e.g.
 *                "2026-10-02T18:00:00+01:00" for 6pm Lagos (WAT)
 *   minutes      how long it runs
 *   joinUrl      Meet / Zoom link. Leave null until it is issued
 *   recordingUrl filled in afterwards, so the entry keeps its value
 *   capacity     optional, for a cohort-limited class
 *
 * Nothing here is invented. The list ships EMPTY on purpose: a schedule of
 * fake classes would be the single fastest way to lose a learner's trust.
 * The UI has a proper empty state until you add real ones.
 * ──────────────────────────────────────────────────────────────────────────
 */

export const SESSIONS = [
  // {
  //   id: "live-2026-10-02-pivots",
  //   courseId: "data-analysis",
  //   moduleId: "m2-pivots",
  //   title: "Pivot Tables, live",
  //   summary:
  //     "We build a pivot from a messy sales export together, then take questions.",
  //   host: "Daniel Nwankwo",
  //   startsAt: "2026-10-02T18:00:00+01:00",
  //   minutes: 60,
  //   joinUrl: null,
  //   recordingUrl: null,
  // },
];

const HOUR = 3600000;

/** Sessions that have not finished yet, soonest first. */
export function getUpcomingSessions(courseId = null) {
  const now = Date.now();
  return SESSIONS.filter((s) => {
    if (courseId && s.courseId !== courseId) return false;
    const end = new Date(s.startsAt).getTime() + (s.minutes || 60) * 60000;
    return end > now;
  }).sort((a, b) => new Date(a.startsAt) - new Date(b.startsAt));
}

/** Past sessions that have a recording worth watching. */
export function getPastSessions(courseId = null) {
  const now = Date.now();
  return SESSIONS.filter((s) => {
    if (courseId && s.courseId !== courseId) return false;
    const end = new Date(s.startsAt).getTime() + (s.minutes || 60) * 60000;
    return end <= now && s.recordingUrl;
  }).sort((a, b) => new Date(b.startsAt) - new Date(a.startsAt));
}

/** The session attached to a module, if one is scheduled and still ahead. */
export function getSessionForModule(moduleId) {
  return getUpcomingSessions().find((s) => s.moduleId === moduleId) || null;
}

/**
 * Where a session is in its lifecycle.
 * "live" opens 10 minutes early, which is when people actually arrive.
 */
export function getSessionState(session) {
  const start = new Date(session.startsAt).getTime();
  const end = start + (session.minutes || 60) * 60000;
  const now = Date.now();

  if (now >= start - 10 * 60000 && now <= end) return "live";
  if (now > end) return "ended";
  if (start - now < 24 * HOUR) return "today";
  return "upcoming";
}

/** Rendered in the learner's own timezone, never ours. */
export function formatSessionTime(session) {
  const date = new Date(session.startsAt);
  return {
    date: date.toLocaleDateString(undefined, {
      weekday: "short",
      day: "numeric",
      month: "short",
    }),
    time: date.toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
    }),
    relative: relativeTo(date),
  };
}

function relativeTo(date) {
  const diff = date.getTime() - Date.now();
  const hours = Math.round(diff / HOUR);
  if (diff < 0) return "ended";
  if (hours < 1) return "starting shortly";
  if (hours < 24) return `in ${hours} hour${hours === 1 ? "" : "s"}`;
  const days = Math.round(hours / 24);
  return `in ${days} day${days === 1 ? "" : "s"}`;
}
