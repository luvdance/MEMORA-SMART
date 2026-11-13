/**
 * Durable AI allowances. SERVER ONLY.
 *
 * Each paid model call is recorded in aiUsage/{uid} inside a Firestore
 * transaction BEFORE the model runs, so two tabs racing each other cannot both
 * take the last place. If the model call then fails, the place is given back.
 *
 * firestore.rules has no entry for aiUsage, so the catch-all denies the
 * browser: only the Admin SDK reads or writes these documents.
 */
import { createHash } from "node:crypto";
import { decideAi, aiLimit, limitMessage, SEARCH_LIMITS } from "../../src/cv-builder/utils/aiQuota.js";

const COLLECTION = "aiUsage";

/** Remove one recorded call (the model failed, so the person keeps it). */
async function giveBack(db, ref, kind, at) {
  try {
    await db.runTransaction(async (t) => {
      const snap = await t.get(ref);
      const stamps = (snap.exists ? snap.data()?.[kind] : null) || [];
      const i = stamps.indexOf(at);
      if (i === -1) return;
      t.set(ref, { [kind]: [...stamps.slice(0, i), ...stamps.slice(i + 1)] }, { merge: true });
    });
  } catch (err) {
    console.error("AI allowance refund failed:", err.message);
  }
}

/**
 * Spend one `kind` call for this user.
 * @param db       Firestore (Admin SDK or a test fake)
 * @param who      { uid, admin }
 * @param premium  whether the user is on CV Premium
 * @returns {Promise<{ok: true, quota: object, refund: () => Promise<void>}
 *   | {ok: false, quota: object, message: string}>}
 */
export async function spendAi(db, who, kind, premium, now = Date.now()) {
  // Staff fix CVs for customers; they are not the cost risk.
  if (who.admin) return { ok: true, quota: { kind, limit: null, left: null }, refund: async () => {} };

  const limit = aiLimit(kind, premium);
  const ref = db.collection(COLLECTION).doc(who.uid);
  const decision = await db.runTransaction(async (t) => {
    const snap = await t.get(ref);
    const d = decideAi(snap.exists ? snap.data() : {}, kind, limit, now);
    if (d.ok) t.set(ref, { [kind]: d.stamps, updatedAt: now }, { merge: true });
    return d;
  });

  const quota = { kind, limit, used: decision.used, left: decision.left, resetsAt: decision.resetsAt };
  if (!decision.ok) {
    return { ok: false, quota, message: limitMessage(kind, { limit, resetsAt: decision.resetsAt, premium }, now) };
  }
  return { ok: true, quota, refund: () => giveBack(db, ref, kind, now) };
}

/** A stable, non-reversible key for a network address. */
export function visitorKey(req) {
  const raw = String(req.headers?.["x-forwarded-for"] || req.socket?.remoteAddress || "unknown").split(",")[0].trim();
  return "ip_" + createHash("sha256").update(raw).digest("hex").slice(0, 32);
}

/** The homepage search: per visitor and for the whole site, both in one transaction. */
export async function spendSearch(db, key, now = Date.now()) {
  const mine = db.collection(COLLECTION).doc(key);
  const site = db.collection(COLLECTION).doc("_site");
  return db.runTransaction(async (t) => {
    const [a, b] = [await t.get(mine), await t.get(site)];
    const me = decideAi(a.exists ? a.data() : {}, "search", SEARCH_LIMITS.perVisitor, now);
    const all = decideAi(b.exists ? b.data() : {}, "search", SEARCH_LIMITS.site, now);
    if (!me.ok || !all.ok) return false;
    t.set(mine, { search: me.stamps, updatedAt: now }, { merge: true });
    // Keep only the newest stamps on the shared doc so it stays small.
    t.set(site, { search: all.stamps.slice(-SEARCH_LIMITS.site), updatedAt: now }, { merge: true });
    return true;
  });
}
