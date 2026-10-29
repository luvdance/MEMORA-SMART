/**
 * PAYSTACK → PLAN GRANTS. SERVER ONLY.
 *
 * Every path that can confirm a payment (the webhook, the verify call the
 * browser makes right after checkout, and the manual "Verify payment"
 * requery) funnels into grantTransaction(). It is idempotent per Paystack
 * reference — the payments doc id is derived from the reference and is
 * created inside the same transaction that grants access — so whichever path
 * arrives first grants, and the others report "already processed".
 *
 * Nothing here trusts the browser: the plan comes from the transaction
 * Paystack returns, and the amount actually paid must cover the plan price.
 *
 * `db` is injected (a Firestore Admin instance in production, a fake in
 * selfTest.mjs), so this module has no Firebase import of its own.
 */
import { PLANS, PAID_PLAN_IDS, addPlanPeriod, toMillis } from "../../src/cv-builder/utils/plans.js";

// Stored as proExpiresAt for lifetime members, so older screens that only
// understand isPro/proExpiresAt keep treating them as Pro.
const LIFETIME_PRO_EXPIRY = new Date("2099-12-31T00:00:00Z");

function parseMetadata(metadata) {
  if (!metadata) return {};
  if (typeof metadata === "string") {
    try { return JSON.parse(metadata) || {}; } catch { return {}; }
  }
  return metadata;
}

function planCodeOf(tx) {
  if (!tx.plan) return null;
  if (typeof tx.plan === "string") return tx.plan;
  return tx.plan.plan_code || null;
}

/**
 * What a Paystack transaction pays for.
 * @returns {{kind: "plan"|"credit"|"book"|"unknown", plan?: string, purchaseType: string}}
 */
export function classifyTransaction(tx, env = process.env) {
  const meta = parseMetadata(tx.metadata);
  const purchaseType = meta.purchase_type || "";

  if (purchaseType === "book_purchase") return { kind: "book", purchaseType };
  if (PAID_PLAN_IDS.includes(meta.plan)) return { kind: "plan", plan: meta.plan, purchaseType: purchaseType || "cv_plan" };

  // Subscription renewals carry no custom metadata — recognise them by plan code.
  // Plan codes are server-only env vars (never VITE_*, which would ship to the browser).
  const code = planCodeOf(tx);
  const monthlyCode = env.PAYSTACK_PLAN_MONTHLY;
  const yearlyCode = env.PAYSTACK_PLAN_YEARLY;
  if (code) {
    if (monthlyCode && code === monthlyCode) return { kind: "plan", plan: "monthly", purchaseType: "cv_plan_renewal" };
    if (yearlyCode && code === yearlyCode) return { kind: "plan", plan: "yearly", purchaseType: "cv_plan_renewal" };
    // Subscribers still on the old ₦7,500/month Pro plan keep renewing month by month.
    const legacyProCode = env.PAYSTACK_PLAN_CODE_PRO;
    if ((legacyProCode && code === legacyProCode) || tx.amount === 750000) {
      return { kind: "plan", plan: "monthly", purchaseType: "pro_subscription_renewal" };
    }
    // Unknown code (e.g. env not set yet): fall back to the amount charged.
    if (tx.amount === PLANS.yearly.price * 100) return { kind: "plan", plan: "yearly", purchaseType: "cv_plan_renewal" };
    if (tx.amount === PLANS.monthly.price * 100) return { kind: "plan", plan: "monthly", purchaseType: "cv_plan_renewal" };
  }

  // Purchases from before the plan change.
  if (purchaseType === "pro_subscription") return { kind: "plan", plan: "monthly", purchaseType };
  if (purchaseType === "single_cv") return { kind: "credit", purchaseType };

  return { kind: "unknown", purchaseType: purchaseType || "unknown" };
}

/** Which user a transaction belongs to: metadata uid, then Paystack customer code, then email. */
export async function findUserRef(db, tx) {
  const meta = parseMetadata(tx.metadata);
  const users = db.collection("users");

  if (meta.uid) {
    const ref = users.doc(String(meta.uid));
    const snap = await ref.get();
    if (snap.exists) return ref;
  }
  const customerCode = tx.customer?.customer_code;
  if (customerCode) {
    const q = await users.where("paystackCustomerCode", "==", customerCode).limit(1).get();
    if (!q.empty) return q.docs[0].ref;
  }
  const email = tx.customer?.email;
  if (email) {
    const q = await users.where("email", "==", email).limit(1).get();
    if (!q.empty) return q.docs[0].ref;
    const lower = email.toLowerCase();
    if (lower !== email) {
      const q2 = await users.where("email", "==", lower).limit(1).get();
      if (!q2.empty) return q2.docs[0].ref;
    }
  }
  return null;
}

/** Field updates that give `user` the plan bought in `tx`. */
export function planUpdates(user, planId, tx, now = Date.now()) {
  const base = {
    updatedAt: new Date(now),
  };
  if (tx.customer?.customer_code) base.paystackCustomerCode = tx.customer.customer_code;
  if (tx.customer?.id != null) base.paystackCustomerId = tx.customer.id;

  if (user.plan === "lifetime" || user.lifetime === true) {
    // Already lifetime: nothing to extend. The payment is still recorded.
    return base;
  }

  if (planId === "lifetime") {
    return {
      ...base,
      plan: "lifetime",
      lifetime: true,
      planExpiresAt: null,
      autoRenew: false,
      isPro: true,
      proExpiresAt: LIFETIME_PRO_EXPIRY,
    };
  }

  // Extend from whichever is later: now, or the end of time already paid for.
  const currentEnd = Math.max(
    (user.plan === "monthly" || user.plan === "yearly") ? toMillis(user.planExpiresAt) || 0 : 0,
    user.isPro === true ? toMillis(user.proExpiresAt) || 0 : 0,
  );
  const start = Math.max(now, currentEnd);
  const end = addPlanPeriod(start, PLANS[planId].months);
  return {
    ...base,
    plan: planId,
    planExpiresAt: new Date(end),
    autoRenew: !!planCodeOf(tx),
    isPro: true,
    proExpiresAt: new Date(end),
  };
}

/**
 * Grant whatever a successful Paystack transaction paid for, exactly once.
 * @param tx the `data` object of a Paystack verify response / charge.success event
 * @returns {Promise<{status: "granted"|"already_processed"|"recorded"|"underpaid"|"user_not_found"|"not_successful", plan?: string, userId?: string, expiresAt?: number|null}>}
 */
export async function grantTransaction(db, tx, { source = "unknown", now = Date.now(), env = process.env } = {}) {
  if (!tx || tx.status !== "success") return { status: "not_successful" };

  const reference = String(tx.reference || "");
  if (!reference) return { status: "not_successful" };

  const info = classifyTransaction(tx, env);
  const userRef = await findUserRef(db, tx);
  if (!userRef && info.kind !== "book") {
    // Do NOT record the payment: a later requery by the right user must still grant.
    return { status: "user_not_found" };
  }

  const paymentRef = db.collection("payments").doc(`ps_${reference.replace(/[/]/g, "_")}`);
  const legacyQuery = db.collection("payments").where("reference", "==", reference).limit(1);
  const amountNaira = (Number(tx.amount) || 0) / 100;

  return db.runTransaction(async (t) => {
    const existing = await t.get(paymentRef);
    if (existing.exists) return { status: "already_processed", plan: existing.data().plan || null };
    const legacy = await t.get(legacyQuery);
    if (!legacy.empty) return { status: "already_processed", plan: legacy.docs[0].data().plan || null };

    const userSnap = userRef ? await t.get(userRef) : null;
    const user = userSnap?.exists ? userSnap.data() : {};

    const payment = {
      userId: userRef ? userRef.id : null,
      email: tx.customer?.email || null,
      amount: amountNaira,
      currency: tx.currency || "NGN",
      reference,
      purchaseType: info.purchaseType,
      plan: info.plan || null,
      provider: "paystack",
      status: "success",
      source,
      createdAt: new Date(now),
    };

    if (info.kind === "plan") {
      const price = PLANS[info.plan].price;
      if (tx.currency && tx.currency !== "NGN") {
        t.set(paymentRef, { ...payment, status: "wrong_currency" });
        return { status: "underpaid", plan: info.plan, userId: userRef.id };
      }
      if (amountNaira < price) {
        t.set(paymentRef, { ...payment, status: "underpaid" });
        return { status: "underpaid", plan: info.plan, userId: userRef.id };
      }
      const updates = planUpdates(user, info.plan, tx, now);
      t.set(userRef, updates, { merge: true });
      t.set(paymentRef, payment);
      const exp = updates.planExpiresAt ? updates.planExpiresAt.getTime() : null;
      return { status: "granted", plan: user.lifetime || user.plan === "lifetime" ? "lifetime" : info.plan, userId: userRef.id, expiresAt: exp };
    }

    if (info.kind === "credit") {
      t.set(userRef, {
        paidDownloads: (Number(user.paidDownloads) || 0) + 1,
        updatedAt: new Date(now),
      }, { merge: true });
      t.set(paymentRef, { ...payment, creditsGranted: 1 });
      return { status: "granted", plan: "credit", userId: userRef.id };
    }

    // Books and anything unrecognised: record only.
    t.set(paymentRef, payment);
    return { status: "recorded", userId: userRef ? userRef.id : null };
  });
}

/** Ask Paystack about a reference. Returns the transaction `data`, or null if not found/failed. */
export async function fetchPaystackTransaction(reference, secret = process.env.PAYSTACK_SECRET_KEY) {
  const res = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
    headers: { Authorization: `Bearer ${secret}` },
  });
  const body = await res.json().catch(() => ({}));
  if (!body.status || !body.data) return { tx: null, message: body.message || "Payment not found" };
  return { tx: body.data, message: body.data.gateway_response || "" };
}

/** Subscription lifecycle webhooks: remember the subscription, or stop auto-renew. Access runs to its paid-through date. */
export async function applySubscriptionEvent(db, event, data, now = Date.now()) {
  const userRef = await findUserRef(db, { customer: data.customer, metadata: null });
  if (!userRef) return { status: "user_not_found" };

  if (event === "subscription.create") {
    await userRef.set({
      paystackSubscriptionCode: data.subscription_code || null,
      paystackEmailToken: data.email_token || null,
      paystackCustomerCode: data.customer?.customer_code || null,
      autoRenew: true,
      updatedAt: new Date(now),
    }, { merge: true });
    return { status: "subscribed" };
  }
  if (event === "subscription.disable" || event === "subscription.not_renew") {
    await userRef.set({ autoRenew: false, updatedAt: new Date(now) }, { merge: true });
    return { status: "auto_renew_off" };
  }
  if (event === "invoice.payment_failed") {
    await userRef.set({ lastRenewalFailedAt: new Date(now), updatedAt: new Date(now) }, { merge: true });
    return { status: "renewal_failed" };
  }
  return { status: "ignored" };
}
