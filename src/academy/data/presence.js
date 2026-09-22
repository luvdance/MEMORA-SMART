/**
 * PRESENCE STATUS — one definition of "online", used everywhere
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * WHY THIS FILE EXISTS
 *
 * The Messages tab and the Active tab used to decide "is this person here?"
 * by DIFFERENT rules. Messages said "studying now" whenever `online === true`
 * and never looked at `lastSeen`. Active required `online === true` AND a
 * recent `lastSeen`. So a row left at `online: true` by a session that ended
 * without saying goodbye showed as "studying now" in one tab and was absent
 * from the other — the two halves of the same panel contradicting each other,
 * and the one that looked right was the one that was wrong.
 *
 * Every surface now calls presenceStatus(). They cannot disagree, because
 * there is only one answer.
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * THREE STATES
 *
 *   online   the tab is in front of them and has checked in recently
 *   idle     still signed in, but the tab is in the background, or it has
 *            missed a check-in — they may be back in a moment
 *   offline  they left, or have not been seen for long enough that they
 *            almost certainly closed the laptop without the page noticing
 *
 * WHY THE CLOCK IS NOT TRUSTED
 *
 * `lastSeen` is written by the SERVER. The learner's own clock may be wrong —
 * a dead CMOS battery or a clock set by hand is common on the machines this
 * audience uses — and comparing server time with a wrong local clock made
 * everybody look offline, or nobody. So "now" is estimated from the freshest
 * server timestamp in view, then advanced by ELAPSED local time, which stays
 * accurate even when the absolute local time does not. See serverNow().
 *
 * Pure: no Firebase import, so this runs under Node for the self-test.
 */

/** The heartbeat is every 90s; this allows one missed beat before "idle". */
export const ONLINE_WITHIN_MS = 3 * 60 * 1000;

/** Past this, a row that still claims to be online is treated as abandoned. */
export const OFFLINE_AFTER_MS = 10 * 60 * 1000;

export const STATUS_LABEL = {
  online: "Online",
  idle: "Idle",
  offline: "Offline",
};

/**
 * Milliseconds from any shape a timestamp arrives in.
 *
 * A Firestore Timestamp (toMillis), its plain-object form ({ seconds }) after
 * it has been through JSON or a cache, a Date, or a number. Returns null for
 * a timestamp the server has not filled in yet — a just-written row, which is
 * by definition current.
 */
export function lastSeenMs(row) {
  const v = row?.lastSeen;
  if (v === null || v === undefined) return null;
  if (typeof v.toMillis === "function") return v.toMillis();
  if (v instanceof Date) return v.getTime();
  if (typeof v === "number") return v;
  if (typeof v.seconds === "number") {
    return v.seconds * 1000 + Math.floor((v.nanoseconds || 0) / 1e6);
  }
  return null;
}

/** The newest server timestamp among these rows, or null if none resolved. */
export function freshestSeen(rows) {
  let best = null;
  for (const r of rows || []) {
    const ms = lastSeenMs(r);
    if (ms !== null && (best === null || ms > best)) best = ms;
  }
  return best;
}

/**
 * An estimate of the server's current time.
 *
 * `anchorServerMs` is a server timestamp and `anchorLocalMs` the local time
 * when it was observed. Only the DIFFERENCE in local time is used, so a local
 * clock that is hours wrong still produces the right answer.
 *
 * The anchor is the freshest row in view, which may be up to one heartbeat
 * old, so this can read up to ~90s early. That errs towards calling someone
 * online a little longer — the right direction for a "who can I talk to"
 * list — and is well inside the thresholds above.
 */
export function serverNow(anchorServerMs, anchorLocalMs, localNowMs = Date.now()) {
  if (anchorServerMs === null || anchorServerMs === undefined) return localNowMs;
  return anchorServerMs + Math.max(0, localNowMs - anchorLocalMs);
}

/**
 * online | idle | offline, for one presence row, at a given server time.
 */
export function presenceStatus(row, nowMs) {
  if (!row || row.online !== true) return "offline";

  const seen = lastSeenMs(row);
  // Written a moment ago, before the server filled in the timestamp.
  if (seen === null) return row.status === "idle" ? "idle" : "online";

  const age = Math.max(0, nowMs - seen);
  if (age > OFFLINE_AFTER_MS) return "offline";
  if (row.status === "idle" || age > ONLINE_WITHIN_MS) return "idle";
  return "online";
}

/** Whether somebody belongs in the "who is around" list at all. */
export function isAround(row, nowMs) {
  return presenceStatus(row, nowMs) !== "offline";
}

export default {
  ONLINE_WITHIN_MS,
  OFFLINE_AFTER_MS,
  STATUS_LABEL,
  lastSeenMs,
  freshestSeen,
  serverNow,
  presenceStatus,
  isAround,
};
