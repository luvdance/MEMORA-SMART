// ── WHERE TO GO AFTER SIGNING IN ──
// Someone who signs in or signs up from Memotify, the Academy, the ATS
// checker or any other part of the site must land back where they started,
// not on the CV dashboard.
//
// Router state alone is not enough. A new user verifies their email, and the
// link in that email opens a FRESH page, so `location.state` is gone. The
// "Refresh page" button on the verify screen does the same. So the path is
// also kept in localStorage (24 hours) and put on the verification link as
// ?next=, and whichever survives is used.

const KEY = "memora:authReturn";
const MAX_AGE_MS = 24 * 60 * 60 * 1000;

/** Only a path on this site, never the auth page itself or another domain. */
export function safeReturnPath(path) {
  if (typeof path !== "string") return null;
  const p = path.trim();
  if (!p.startsWith("/") || p.startsWith("//") || p.startsWith("/\\")) return null;
  if (p === "/auth" || p.startsWith("/auth?") || p.startsWith("/auth/")) return null;
  if (p.length > 500) return null;
  return p;
}

export function rememberReturn(path) {
  const safe = safeReturnPath(path);
  if (!safe) return;
  try {
    localStorage.setItem(KEY, JSON.stringify({ path: safe, at: Date.now() }));
  } catch {
    // Blocked storage: router state and ?next= still cover most cases.
  }
}

export function readReturn() {
  try {
    const held = JSON.parse(localStorage.getItem(KEY));
    if (!held || Date.now() - held.at > MAX_AGE_MS) {
      localStorage.removeItem(KEY);
      return null;
    }
    return safeReturnPath(held.path);
  } catch {
    return null;
  }
}

export function clearReturn() {
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* Nothing stored. */
  }
}

/** The link to the auth page that brings the person back to `path`. */
export function authPathFor(path) {
  const safe = safeReturnPath(path);
  return safe && safe !== "/" ? `/auth?next=${encodeURIComponent(safe)}` : "/auth";
}
