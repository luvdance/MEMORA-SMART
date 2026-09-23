/**
 * ACADEMY ERROR BOUNDARY
 *
 * One rule: a learner is told what happened to THEM and what to do next. They
 * are never told what happened to the database.
 *
 * ── WHY THIS EXISTS ──────────────────────────────────────────────────────
 * Before this module, two screens rendered `err.message` straight from the
 * Firebase SDK, and both carried a branch that printed:
 *
 *   "The Academy security rules have not been deployed yet.
 *    Deploy firestore.rules and reload."
 *
 * to whoever hit it. That is an instruction to an engineer, shown to a
 * student, and it leaks three things at once: that this is Firestore, that
 * rules are the control, and that the deployment is incomplete. A raw SDK
 * message is worse still, because it can carry collection paths, field names
 * and project identifiers.
 *
 * None of that helps a learner. All of it helps somebody probing the product.
 *
 * ── THE SHAPE ────────────────────────────────────────────────────────────
 * Every call that can fail goes through `toUserError(err, fallback)`. It
 * returns a plain object the UI can render directly:
 *
 *   { code, title, message, canRetry }
 *
 *   code      a STABLE internal code for our own logs and support. Never
 *             rendered. Not the provider's code.
 *   title     a short heading
 *   message   one or two plain sentences, in the learner's terms
 *   canRetry  whether offering a retry button is honest
 *
 * The original error is logged to the console for developers, once, by
 * `reportError`. It never reaches the DOM.
 *
 * ── ADDING A CASE ────────────────────────────────────────────────────────
 * Map the provider code in PROVIDER_CODES. Do not add a branch that
 * interpolates anything from the error into `message`. If a case genuinely
 * needs detail to be actionable, that detail belongs in support tooling keyed
 * on `code`, not on the page.
 */

/** Stable internal codes. These are ours, and they outlive any SDK. */
export const ERROR_CODES = {
  OFFLINE: "ACA-NET-01",
  UNAVAILABLE: "ACA-NET-02",
  TIMEOUT: "ACA-NET-03",
  NOT_SIGNED_IN: "ACA-AUTH-01",
  SESSION_EXPIRED: "ACA-AUTH-02",
  NOT_PERMITTED: "ACA-PERM-01",
  QUOTA: "ACA-CAP-01",
  CONFLICT: "ACA-DATA-01",
  NOT_FOUND: "ACA-DATA-02",
  USERNAME_TAKEN: "ACA-PROFILE-01",
  COURSE_UNAVAILABLE: "ACA-ENROL-01",
  NO_STUDENT_RECORD: "ACA-ENROL-02",
  UNKNOWN: "ACA-UNK-01",
};

/**
 * What the learner is told, per code.
 *
 * Read these as a set. None of them names a technology, a file, a collection
 * or a rule, and none of them blames the learner for something that is ours.
 */
const MESSAGES = {
  [ERROR_CODES.OFFLINE]: {
    title: "You appear to be offline",
    message:
      "We could not reach the Academy. Check your connection and try again — nothing you have done has been lost.",
    canRetry: true,
  },
  [ERROR_CODES.UNAVAILABLE]: {
    title: "The Academy is not responding",
    message:
      "This is on our side, not yours. Please try again in a moment. Your progress is safe.",
    canRetry: true,
  },
  [ERROR_CODES.TIMEOUT]: {
    title: "That took too long",
    message: "The request timed out before it finished. Try again.",
    canRetry: true,
  },
  [ERROR_CODES.NOT_SIGNED_IN]: {
    title: "You are signed out",
    message: "Sign in again to pick up where you left off.",
    canRetry: false,
  },
  [ERROR_CODES.SESSION_EXPIRED]: {
    title: "Your session has expired",
    message: "For your security we sign you out after a while. Sign in again to continue.",
    canRetry: false,
  },
  // NOTE: filled in below with EXACTLY the unknown-failure copy. See the
  // comment under MESSAGES for why it has to be byte-identical rather than
  // merely similar.
  [ERROR_CODES.NOT_PERMITTED]: null,
  [ERROR_CODES.QUOTA]: {
    title: "The Academy is very busy",
    message: "Too many requests at once. Give it a minute and try again.",
    canRetry: true,
  },
  [ERROR_CODES.CONFLICT]: {
    title: "That clashed with another change",
    message:
      "Something else updated this at the same moment. Try once more and it should go through.",
    canRetry: true,
  },
  [ERROR_CODES.NOT_FOUND]: {
    title: "We could not find that",
    message: "It may have been moved or removed. Go back and try again from the Academy.",
    canRetry: false,
  },
  [ERROR_CODES.USERNAME_TAKEN]: {
    // The one case where naming the cause IS the help, and it reveals nothing
    // beyond what the learner just typed.
    title: "That username is taken",
    message: "Someone already has that name. Pick another one and you are through.",
    canRetry: false,
  },
  [ERROR_CODES.COURSE_UNAVAILABLE]: {
    title: "That course is not open yet",
    message:
      "It is on the roadmap but not ready to enrol on. Browse the courses that are open today.",
    canRetry: false,
  },
  [ERROR_CODES.NO_STUDENT_RECORD]: {
    title: "We could not open your student record",
    message:
      "Reload the page and we will set it up. If it happens again, sign out and back in.",
    canRetry: true,
  },
  [ERROR_CODES.UNKNOWN]: {
    title: "Something went wrong",
    message:
      "That did not work, and it is not something you did. Please try again, and contact us if it keeps happening.",
    canRetry: true,
  },
};

/**
 * An authorisation refusal is shown as an ordinary failure. Byte-identical,
 * not merely similar.
 *
 * This is a security property, not a style choice. Blocking in the study
 * circle is enforced by the rules, so a blocked sender's message is refused
 * rather than silently dropped. If a refusal read even slightly differently
 * from a network failure, the sender could tell the two apart and infer that
 * they had been blocked — which is exactly what enforcing it server-side was
 * meant to avoid revealing.
 *
 * The internal `code` still distinguishes them, so our logs and support can
 * tell a refusal from an outage. Only what the learner reads is the same.
 *
 * Assigned here rather than typed twice, so the two can never drift apart:
 * editing the copy above changes both.
 */
MESSAGES[ERROR_CODES.NOT_PERMITTED] = MESSAGES[ERROR_CODES.UNKNOWN];

/**
 * Provider error code to our code.
 *
 * Firestore and Firebase Auth codes today. If the backend is ever replaced,
 * this is the only table that changes and every screen keeps working.
 */
const PROVIDER_CODES = {
  unavailable: ERROR_CODES.UNAVAILABLE,
  "deadline-exceeded": ERROR_CODES.TIMEOUT,
  cancelled: ERROR_CODES.TIMEOUT,
  "permission-denied": ERROR_CODES.NOT_PERMITTED,
  unauthenticated: ERROR_CODES.SESSION_EXPIRED,
  "resource-exhausted": ERROR_CODES.QUOTA,
  aborted: ERROR_CODES.CONFLICT,
  "already-exists": ERROR_CODES.CONFLICT,
  "failed-precondition": ERROR_CODES.CONFLICT,
  "not-found": ERROR_CODES.NOT_FOUND,
  "auth/network-request-failed": ERROR_CODES.OFFLINE,
  "auth/user-token-expired": ERROR_CODES.SESSION_EXPIRED,
  "auth/requires-recent-login": ERROR_CODES.SESSION_EXPIRED,
};

/**
 * Errors this codebase throws on purpose, by their thrown message.
 *
 * Domain failures rather than infrastructure ones. They are matched on an
 * exact string so that a message reworded for developers cannot silently
 * change what a learner sees.
 */
const DOMAIN_CODES = {
  USERNAME_TAKEN: ERROR_CODES.USERNAME_TAKEN,
  COURSE_NOT_OPEN: ERROR_CODES.COURSE_UNAVAILABLE,
  NO_STUDENT_RECORD: ERROR_CODES.NO_STUDENT_RECORD,
  "Not signed in": ERROR_CODES.NOT_SIGNED_IN,
};

/** A domain error this layer raises itself, so callers can throw meaningfully. */
export class AcademyError extends Error {
  constructor(domainCode) {
    super(domainCode);
    this.name = "AcademyError";
    this.domainCode = domainCode;
  }
}

/** True when the browser itself says there is no connection. */
function isOffline() {
  return typeof navigator !== "undefined" && navigator.onLine === false;
}

/** Map any thrown thing to one of our stable codes. */
export function classifyError(err) {
  if (isOffline()) return ERROR_CODES.OFFLINE;

  const domain = err?.domainCode || err?.message;
  if (domain && DOMAIN_CODES[domain]) return DOMAIN_CODES[domain];

  const provider = err?.code;
  if (provider && PROVIDER_CODES[provider]) return PROVIDER_CODES[provider];

  return ERROR_CODES.UNKNOWN;
}

/**
 * Turn any failure into something safe to render.
 *
 * `fallback` lets a caller choose a more useful generic than "something went
 * wrong" for its own context, and is only used when the error is unclassified.
 */
export function toUserError(err, fallback = ERROR_CODES.UNKNOWN) {
  const code = classifyError(err);
  const resolved = code === ERROR_CODES.UNKNOWN ? fallback : code;
  const copy = MESSAGES[resolved] || MESSAGES[ERROR_CODES.UNKNOWN];
  return { code: resolved, ...copy };
}

/**
 * Log the real error for developers, return the safe one for the learner.
 *
 * The single call every catch block should make. Keeping the log and the
 * mapping together is what stops somebody "just this once" rendering the
 * original to save a line.
 */
export function reportError(context, err, fallback = ERROR_CODES.UNKNOWN) {
  const safe = toUserError(err, fallback);
  // Console only. Never a prop, never state that reaches the DOM.
  console.error(`[academy:${context}] ${safe.code}`, err);
  return safe;
}
