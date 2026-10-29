/**
 * /api/cv/* route handlers. SERVER ONLY.
 *
 * Plan decisions use the same pure functions as the browser
 * (src/cv-builder/utils/plans.js), applied here inside Firestore transactions
 * with the user identified from their Firebase ID token — so a free user can't
 * hand themselves downloads or Premium features from the browser.
 */
import { FieldValue } from "firebase-admin/firestore";
import { db, identify, verifyCaller, adminStatus } from "./admin.js";
import { computeEntitlement, decideDownload, PLANS } from "../../src/cv-builder/utils/plans.js";
import { grantTransaction, fetchPaystackTransaction, findUserRef } from "./billing.js";
import { scoreCv, optimizeCv } from "./ai.js";

const MIN_CV_TEXT = 100;

function send(res, status, body) {
  return res.status(status).json(body);
}

function body(req) {
  if (req.body && typeof req.body === "object") return req.body;
  try { return JSON.parse(req.body || "{}"); } catch { return {}; }
}

// Per-instance, per-user throttle on the paid AI calls (they cost money even for Premium users).
const aiCalls = new Map();
function aiThrottled(uid, kind, limit = 20, windowMs = 60 * 60 * 1000) {
  const key = `${kind}:${uid}`;
  const now = Date.now();
  const rec = aiCalls.get(key);
  if (!rec || now > rec.resetAt) {
    aiCalls.set(key, { count: 1, resetAt: now + windowMs });
    return false;
  }
  rec.count += 1;
  return rec.count > limit;
}

async function requireUser(req, res) {
  const who = await verifyCaller(req);
  if (who.uid) return who;
  if (who.error === "not_configured") {
    // A server setup problem, not the user's: say so instead of "please log in".
    send(res, 503, { success: false, reason: "server_config", error: `Server setup problem: ${who.detail}` });
    return null;
  }
  send(res, 401, {
    success: false,
    reason: "auth_required",
    error: who.error === "invalid_token"
      ? `Your sign-in couldn't be verified (${who.detail}).`
      : "Please sign in to continue.",
  });
  return null;
}

// ── GET /api/cv/health ── setup check (no secrets): open it in a browser.
async function health(req, res) {
  const status = adminStatus();
  return send(res, status.ok ? 200 : 503, {
    firebaseAdmin: status.ok ? "ok" : status.error,
    firebaseProjectId: status.projectId,
    paystackSecretKey: process.env.PAYSTACK_SECRET_KEY ? "set" : "MISSING",
    paystackPlanMonthly: process.env.PAYSTACK_PLAN_MONTHLY ? "set" : "missing (Monthly will be one-time, no auto-renew)",
    paystackPlanYearly: process.env.PAYSTACK_PLAN_YEARLY ? "set" : "missing (Yearly will be one-time, no auto-renew)",
    anthropicApiKey: process.env.ANTHROPIC_API_KEY ? "set" : "MISSING",
  });
}

async function loadUser(uid) {
  const snap = await db().collection("users").doc(uid).get();
  return snap.exists ? snap.data() : {};
}

/** Premium-only gate for the AI features. Returns the user, or null after responding. */
async function requirePremium(req, res) {
  const who = await requireUser(req, res);
  if (!who) return null;
  if (who.admin) return who;
  const ent = computeEntitlement(await loadUser(who.uid));
  if (!ent.premium) {
    send(res, 402, {
      success: false,
      reason: "premium_feature",
      error: "ATS checks and AI optimization are Premium features.",
      entitlement: ent,
    });
    return null;
  }
  return who;
}

// ── GET /api/cv/access ── the caller's current plan and allowance
async function access(req, res) {
  const who = await requireUser(req, res);
  if (!who) return;
  return send(res, 200, { success: true, entitlement: computeEntitlement(await loadUser(who.uid)) });
}

// ── POST /api/cv/download { template, cvId? } ── spend one download
async function download(req, res) {
  if (req.method !== "POST") return send(res, 405, { error: "Method not allowed" });
  const who = await requireUser(req, res);
  if (!who) return;
  const { template, cvId } = body(req);

  const userRef = db().collection("users").doc(who.uid);
  const decision = await db().runTransaction(async (t) => {
    const snap = await t.get(userRef);
    const d = decideDownload(snap.exists ? snap.data() : {}, { template: Number(template) });
    if (d.ok && Object.keys(d.update).length) {
      t.set(userRef, { ...d.update, updatedAt: new Date() }, { merge: true });
    }
    return d;
  });

  if (!decision.ok) {
    return send(res, 402, { success: false, reason: decision.reason, entitlement: decision.entitlement });
  }

  // Best effort: per-CV download count for the admin panel.
  if (cvId && typeof cvId === "string") {
    try {
      const cvRef = db().collection("cvs").doc(cvId);
      const cvSnap = await cvRef.get();
      if (cvSnap.exists && cvSnap.data().ownerId === who.uid) {
        await cvRef.update({ downloadCount: FieldValue.increment(1), lastDownloadedAt: new Date() });
      }
    } catch (err) {
      console.error("download count update failed:", err.message);
    }
  }

  return send(res, 200, { success: true, kind: decision.kind, entitlement: decision.entitlement });
}

// ── POST /api/cv/ats-score { cvText, jobDescription } ── Premium
async function atsScore(req, res) {
  if (req.method !== "POST") return send(res, 405, { error: "Method not allowed" });
  const who = await requirePremium(req, res);
  if (!who) return;
  if (aiThrottled(who.uid, "ats")) {
    return send(res, 429, { success: false, error: "Too many checks this hour. Please try again later." });
  }
  const { cvText, jobDescription } = body(req);
  if (!cvText || cvText.trim().length < MIN_CV_TEXT) {
    return send(res, 400, {
      success: false,
      error: "CV text is too short. Please provide a complete CV (at least 100 characters).",
    });
  }
  try {
    const result = await scoreCv({ cvText, jobDescription });
    return send(res, 200, { success: true, ...result });
  } catch (err) {
    console.error("ATS scoring error:", err);
    return send(res, 500, { success: false, error: err.message || "Could not analyze CV" });
  }
}

// ── POST /api/cv/optimize { cvText, improvements, atsScore, jobDescription } ── Premium
async function optimize(req, res) {
  if (req.method !== "POST") return send(res, 405, { error: "Method not allowed" });
  const who = await requirePremium(req, res);
  if (!who) return;
  if (aiThrottled(who.uid, "optimize", 10)) {
    return send(res, 429, { success: false, error: "Too many optimizations this hour. Please try again later." });
  }
  const { cvText, improvements, atsScore: score, jobDescription } = body(req);
  if (!cvText || cvText.trim().length < MIN_CV_TEXT) {
    return send(res, 400, { success: false, error: "CV text required (at least 100 characters)" });
  }
  try {
    const cv = await optimizeCv({ cvText, improvements, atsScore: score, jobDescription });
    return send(res, 200, { success: true, cv });
  } catch (err) {
    console.error("CV optimization error:", err);
    return send(res, 500, { success: false, error: err.message || "Could not optimize CV" });
  }
}

// ── POST /api/cv/start-checkout { plan } ──
// Creates the Paystack transaction on the server, so plan codes (server-only
// env vars) and the price never come from the browser. The browser only gets
// a one-time access code to open the popup, plus the reference to verify.
async function startCheckout(req, res) {
  if (req.method !== "POST") return send(res, 405, { error: "Method not allowed" });
  const who = await requireUser(req, res);
  if (!who) return;

  const { plan } = body(req);
  const info = PLANS[plan];
  if (!info) return send(res, 400, { success: false, error: "Unknown plan" });

  const email = who.email || (await loadUser(who.uid)).email;
  if (!email) return send(res, 400, { success: false, error: "Your account has no email address for the receipt." });

  // Monthly/Yearly become auto-renewing subscriptions when their plan code is set.
  const planCode = plan === "monthly" ? process.env.PAYSTACK_PLAN_MONTHLY
    : plan === "yearly" ? process.env.PAYSTACK_PLAN_YEARLY
    : null;
  const host = req.headers["x-forwarded-host"] || req.headers.host;
  const reference = `cv_${plan}_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;

  try {
    const out = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        amount: info.price * 100,
        currency: "NGN",
        reference,
        ...(planCode ? { plan: planCode } : {}),
        // Used only if the popup can't open and we fall back to Paystack's page.
        ...(host ? { callback_url: `https://${host}/dashboard/payments` } : {}),
        metadata: {
          purchase_type: "cv_plan",
          plan,
          uid: who.uid,
          custom_fields: [{ display_name: "Plan", variable_name: "plan", value: info.name }],
        },
      }),
    }).then(r => r.json());

    if (!out.status || !out.data?.access_code) {
      console.error("Paystack initialize failed:", out.message);
      return send(res, 502, { success: false, error: out.message || "Could not start payment. Please try again." });
    }
    return send(res, 200, {
      success: true,
      reference: out.data.reference,
      accessCode: out.data.access_code,
      authorizationUrl: out.data.authorization_url,
    });
  } catch (err) {
    console.error("start-checkout error:", err);
    return send(res, 500, { success: false, error: "Could not reach Paystack. Please try again." });
  }
}

// ── POST /api/cv/verify-payment { reference } ──
// Called by the browser right after Paystack's popup succeeds. Also serves
// book purchases (old /api/verify-paystack-payment), which it only verifies.
async function verifyPayment(req, res) {
  if (req.method !== "POST") return send(res, 405, { error: "Method not allowed" });
  const { reference } = body(req);
  if (!reference) return send(res, 400, { error: "Reference required" });

  try {
    const { tx, message } = await fetchPaystackTransaction(reference);
    if (!tx || tx.status !== "success") {
      return send(res, 400, { verified: false, message: message || "Payment not successful" });
    }

    let grant = { status: "skipped" };
    try {
      grant = await grantTransaction(db(), tx, { source: "verify" });
    } catch (err) {
      // The webhook will still grant; the browser falls back to polling/requery.
      console.error("grant on verify failed:", err);
    }

    let meta = tx.metadata || {};
    if (typeof meta === "string") { try { meta = JSON.parse(meta); } catch { meta = {}; } }
    return send(res, 200, {
      verified: true,
      amount: tx.amount / 100,
      currency: tx.currency,
      email: tx.customer?.email,
      reference: tx.reference,
      purchaseType: meta.purchase_type || "single_cv",
      plan: grant.plan || meta.plan || null,
      grant: grant.status,
    });
  } catch (err) {
    console.error("Verification error:", err);
    return send(res, 500, { error: "Verification failed" });
  }
}

// ── POST /api/cv/requery { reference, userId? } ── "I paid but have no access"
async function requery(req, res) {
  if (req.method !== "POST") return send(res, 405, { error: "Method not allowed" });
  const { reference, userId: bodyUserId } = body(req);
  if (!reference) return send(res, 400, { success: false, message: "Payment reference required" });

  try {
    const who = await identify(req);
    const callerUid = who?.uid || bodyUserId || null;

    const { tx, message } = await fetchPaystackTransaction(String(reference).trim());
    if (!tx || tx.status !== "success") {
      return send(res, 400, {
        success: false,
        message: message || "Payment was not successful",
        paystackStatus: tx?.status,
      });
    }

    const owner = await findUserRef(db(), tx);
    if (!owner) {
      return send(res, 404, { success: false, message: "No user account found with that payment's email" });
    }
    if (callerUid && owner.id !== callerUid) {
      return send(res, 403, { success: false, message: "Payment email does not match logged-in user" });
    }

    const grant = await grantTransaction(db(), tx, { source: "requery" });
    const amount = tx.amount / 100;
    if (grant.status === "already_processed") {
      return send(res, 200, { success: true, alreadyProcessed: true, message: "Payment already verified and credited", amount, plan: grant.plan });
    }
    if (grant.status === "underpaid") {
      return send(res, 400, { success: false, message: "The amount paid doesn't cover this plan. Please contact support." });
    }
    return send(res, 200, {
      success: true,
      message: "Payment verified and access granted",
      amount,
      plan: grant.plan || null,
      purchaseType: grant.plan === "credit" ? "single_cv" : "cv_plan",
    });
  } catch (err) {
    console.error("Requery error:", err);
    return send(res, 500, { success: false, message: "Server error during verification: " + err.message });
  }
}

// ── POST /api/cv/cancel-subscription ── stop auto-renew (access runs to the paid-through date)
async function cancelSubscription(req, res) {
  if (req.method !== "POST") return send(res, 405, { error: "Method not allowed" });
  const who = await requireUser(req, res);
  if (!who) return;

  const userRef = db().collection("users").doc(who.uid);
  const user = await loadUser(who.uid);
  const secret = process.env.PAYSTACK_SECRET_KEY;
  const headers = { Authorization: `Bearer ${secret}`, "Content-Type": "application/json" };

  let code = user.paystackSubscriptionCode || null;
  let token = user.paystackEmailToken || null;

  try {
    if (!code && user.paystackCustomerId != null) {
      const list = await fetch(`https://api.paystack.co/subscription?customer=${user.paystackCustomerId}`, { headers }).then(r => r.json());
      const active = (list.data || []).find(s => s.status === "active" || s.status === "non-renewing");
      if (active) { code = active.subscription_code; token = active.email_token; }
    }
    if (code && !token) {
      const one = await fetch(`https://api.paystack.co/subscription/${code}`, { headers }).then(r => r.json());
      token = one.data?.email_token || null;
    }
    if (!code || !token) {
      await userRef.set({ autoRenew: false, updatedAt: new Date() }, { merge: true });
      return send(res, 200, { success: true, message: "Your plan won't renew. There's no active auto-renewal on this account." });
    }

    const out = await fetch("https://api.paystack.co/subscription/disable", {
      method: "POST",
      headers,
      body: JSON.stringify({ code, token }),
    }).then(r => r.json());
    if (!out.status) {
      return send(res, 400, { success: false, message: out.message || "Paystack could not cancel the subscription." });
    }
    await userRef.set({ autoRenew: false, updatedAt: new Date() }, { merge: true });
    return send(res, 200, { success: true, message: "Auto-renew is off. You keep Premium until the end of the period you paid for." });
  } catch (err) {
    console.error("cancel-subscription error:", err);
    return send(res, 500, { success: false, message: "Could not reach Paystack. Please try again." });
  }
}

export const routes = {
  health,
  access,
  download,
  "ats-score": atsScore,
  optimize,
  "start-checkout": startCheckout,
  "verify-payment": verifyPayment,
  requery,
  "cancel-subscription": cancelSubscription,
};
