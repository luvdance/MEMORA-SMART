/**
 * THE CLIENT SIDE OF /api/academy/maths
 *
 * Every maths drill question and every mark goes through here. There is
 * deliberately no local fallback: if the endpoint is unreachable the drill
 * says so, because the alternative — marking in the browser — would mean
 * shipping the answers, and then the drill would certify nothing.
 *
 * The lesson's written knowledge check does NOT come through here. That is
 * served and marked by /api/academy/assessment, the same as in every other
 * course. See lib/academy/maths/api/maths.js for why the two are separate.
 */

const ENDPOINT = "/api/academy/maths";

async function get(params) {
  const query = new URLSearchParams(
    Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== "")
  );
  const res = await fetch(`${ENDPOINT}?${query}`);
  if (!res.ok) {
    const failure = new Error("maths-request-failed");
    failure.code = res.status === 404 ? "not-authored" : "unavailable";
    failure.status = res.status;
    throw failure;
  }
  return res.json();
}

async function post(body) {
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const failure = new Error("maths-grade-failed");
    failure.code = res.status === 404 ? "not-authored" : "unavailable";
    failure.status = res.status;
    throw failure;
  }
  return res.json();
}

/* ── Serving ─────────────────────────────────────────────────────────── */

/** A drill on one skill. `kind` is "build", "stretch" or "exam". */
export const fetchDrill = (atom, kind = "build", count) =>
  get({ op: "set", atom, kind, count });

/** A revision check: ten mixed items on one skill, no hints. */
export const fetchCheck = (atom) => get({ op: "set", atom, kind: "check" });

/** A mixed review, one question from each of several earlier skills. */
export const fetchReview = (atoms, count) =>
  get({ op: "review", atoms: atoms.join(","), count });

export const fetchCoverage = () => get({ op: "coverage" });

/** One rung of the hint ladder. Fetched on demand so rungs can be counted. */
export const fetchHint = (atom, tier, seed, index, level) =>
  get({ op: "hint", atom, tier, seed, index, level });

export const fetchScaffold = (atom, tier, seed, index) =>
  get({ op: "scaffold", atom, tier, seed, index });

/** A new item of the same kind with different numbers. */
export const fetchTwin = (atom, tier, seed, index) =>
  get({ op: "twin", atom, tier, seed, index });

/* ── Marking ─────────────────────────────────────────────────────────── */

export const gradeItem = (payload) => post({ op: "item", ...payload });
export const gradeCheck = (atom, seed, answers) => post({ op: "check", atom, seed, answers });
export const gradeScaffoldStep = (payload) => post({ op: "scaffold-step", ...payload });
