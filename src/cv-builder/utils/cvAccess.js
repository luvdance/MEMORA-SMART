// ── CV ACCESS (browser side) ──
// Live plan status for the signed-in user, plus calls to the /api/cv endpoints
// that spend downloads and run Premium AI features. The server re-checks
// everything; this module only reads and displays.
import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase";
import { computeEntitlement } from "./plans";

/** POST to /api/cv/<action> as the signed-in user. Returns { status, data }. */
export async function cvApi(action, user, payload = {}) {
  const headers = { "Content-Type": "application/json" };
  if (user?.getIdToken) headers.Authorization = `Bearer ${await user.getIdToken()}`;
  // Browsers don't time out a stuck request for minutes; fail fast instead.
  // AI calls legitimately take ~20–40s, so they get longer.
  const controller = new AbortController();
  const limitMs = action === "optimize" || action === "ats-score" ? 90000 : 20000;
  const timer = setTimeout(() => controller.abort(), limitMs);
  let res;
  try {
    res = await fetch(`/api/cv/${action}`, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
  } catch (err) {
    clearTimeout(timer);
    if (err.name === "AbortError") {
      return { status: 0, data: { success: false, error: "The connection timed out. Please check your internet and try again." } };
    }
    throw err;
  }
  clearTimeout(timer);
  let data = {};
  try {
    data = await res.json();
  } catch {
    data = { success: false, error: `Server returned ${res.status}` };
  }
  return { status: res.status, data };
}

/**
 * Live entitlement for `user` (null while loading or signed out).
 * Follows the users/{uid} doc, so a payment confirmed by the webhook shows up
 * without a refresh, and re-evaluates each minute so the free allowance
 * resets on time.
 */
export function useEntitlement(user) {
  // Keyed by uid so a stale doc from a previous account is never shown.
  const [loaded, setLoaded] = useState({ uid: null, data: null });
  const [now, setNow] = useState(() => Date.now());
  const uid = user?.uid || null;

  useEffect(() => {
    if (!uid) return undefined;
    return onSnapshot(
      doc(db, "users", uid),
      (snap) => setLoaded({ uid, data: snap.exists() ? snap.data() : {} }),
      (err) => {
        console.error("Plan status unavailable:", err);
        setLoaded({ uid, data: {} });
      },
    );
  }, [uid]);

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 60 * 1000);
    return () => clearInterval(id);
  }, []);

  if (!uid || loaded.uid !== uid) return null;
  return computeEntitlement(loaded.data, now);
}

/**
 * Spend one download on the server.
 * @returns {Promise<{ok: boolean, kind?: string, reason?: string, entitlement?: object, error?: string}>}
 */
export async function consumeDownload(user, { template, cvId }) {
  const { status, data } = await cvApi("download", user, { template, cvId: cvId || null });
  if (status === 200 && data.success) {
    return { ok: true, kind: data.kind, entitlement: data.entitlement };
  }
  if (status === 402) {
    return { ok: false, reason: data.reason, entitlement: data.entitlement };
  }
  if (status === 401) {
    return { ok: false, reason: "auth_required", error: data.error };
  }
  return { ok: false, reason: "error", error: data.error || data.message || `Server error (${status})` };
}
