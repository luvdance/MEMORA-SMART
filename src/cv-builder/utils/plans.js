// ── CV PLANS & ENTITLEMENTS ──
// The single source of truth for what each plan costs and what a user may do.
// Pure functions over the users/{uid} document: the browser uses them to show
// status ("1 of 5 used"), and the server (lib/cv) uses the SAME functions to
// decide and record downloads, so the two can never disagree.
// No React, no Firebase imports — the server imports this file.

import { isPremiumTemplate } from "./templateMeta.js";

export const FREE_DAILY_DOWNLOADS = 5;
export const FREE_WINDOW_MS = 24 * 60 * 60 * 1000;

// A renewal is charged on the due date and can land a little late, so a
// subscription stays active for a short grace period past its paid-through date.
export const RENEWAL_GRACE_MS = 3 * 24 * 60 * 60 * 1000;

export const PLANS = {
  monthly: {
    id: "monthly",
    name: "Premium Monthly",
    shortName: "Monthly",
    price: 3500,
    months: 1,
    priceLabel: "₦3,500",
    periodLabel: "/ month",
    blurb: "Renews monthly. Cancel anytime.",
  },
  yearly: {
    id: "yearly",
    name: "Premium Yearly",
    shortName: "Yearly",
    price: 7000,
    months: 12,
    priceLabel: "₦7,000",
    periodLabel: "/ year",
    blurb: "Just ₦583 a month. Renews yearly.",
    badge: "Best value",
  },
  lifetime: {
    id: "lifetime",
    name: "Premium Lifetime",
    shortName: "Lifetime",
    price: 12000,
    months: null,
    priceLabel: "₦12,000",
    periodLabel: "one-time",
    blurb: "Pay once, keep Premium forever.",
  },
};

export const PAID_PLAN_IDS = ["monthly", "yearly", "lifetime"];

export const PREMIUM_FEATURES = [
  "Unlimited CV downloads",
  "All templates, including Premium designs",
  "ATS score checker inside the builder",
  "One-click AI CV optimization",
];

export const FREE_FEATURES = [
  `${FREE_DAILY_DOWNLOADS} free downloads every 24 hours`,
  "All free templates",
  "AI writing suggestions",
  "Cloud save & sharing",
];

/** Firestore Timestamp (client or admin SDK), Date, millis, ISO string or {seconds} → millis. */
export function toMillis(value) {
  if (value == null) return null;
  if (typeof value === "number") return value;
  if (value instanceof Date) return value.getTime();
  if (typeof value.toMillis === "function") return value.toMillis();
  if (typeof value.seconds === "number") return value.seconds * 1000;
  if (typeof value._seconds === "number") return value._seconds * 1000;
  const parsed = Date.parse(value);
  return Number.isNaN(parsed) ? null : parsed;
}

/** Paid-through date after adding a plan period to `fromMs`. */
export function addPlanPeriod(fromMs, months) {
  const d = new Date(fromMs);
  d.setUTCMonth(d.getUTCMonth() + months);
  return d.getTime();
}

/**
 * What this user is entitled to right now.
 * Understands both the current fields (plan, planExpiresAt, freeDownloads)
 * and the legacy ones (isPro/proExpiresAt from the old ₦7,500 plan and
 * paidDownloads credits from single-CV purchases), so existing customers keep
 * what they paid for.
 */
export function computeEntitlement(user, now = Date.now()) {
  const u = user || {};
  const planExp = toMillis(u.planExpiresAt);
  const legacyProExp = toMillis(u.proExpiresAt);

  const lifetime = u.plan === "lifetime" || u.lifetime === true;
  const subscription = (u.plan === "monthly" || u.plan === "yearly") && planExp != null
    && now < planExp + RENEWAL_GRACE_MS;
  const legacyPro = !lifetime && !subscription && u.isPro === true && legacyProExp != null
    && now < legacyProExp;

  const premium = lifetime || subscription || legacyPro;
  let plan = "free";
  let expiresAt = null;
  if (lifetime) plan = "lifetime";
  else if (subscription) { plan = u.plan; expiresAt = planExp; }
  else if (legacyPro) { plan = "pro"; expiresAt = legacyProExp; }

  const windowStart = toMillis(u.freeDownloads?.windowStart);
  const windowActive = windowStart != null && now - windowStart < FREE_WINDOW_MS;
  const freeUsed = windowActive ? Math.max(0, Number(u.freeDownloads?.used) || 0) : 0;

  const credits = Math.max(0, Number(u.paidDownloads) || 0);

  return {
    plan,
    premium,
    expiresAt,
    autoRenew: subscription ? u.autoRenew !== false : false,
    credits,
    free: {
      used: Math.min(freeUsed, FREE_DAILY_DOWNLOADS),
      limit: FREE_DAILY_DOWNLOADS,
      remaining: Math.max(0, FREE_DAILY_DOWNLOADS - freeUsed),
      resetsAt: windowActive ? windowStart + FREE_WINDOW_MS : null,
    },
    canUseAi: premium,
  };
}

/**
 * Decide one download. Returns { ok, kind, reason, update, entitlement }.
 * `update` holds the fields to write to the user doc (server applies it inside
 * a transaction). `kind` says what paid for it: "premium" | "free" | "credit".
 * Free users spend their daily allowance first so paid credits last longer.
 */
export function decideDownload(user, { template } = {}, now = Date.now()) {
  const ent = computeEntitlement(user, now);

  if (ent.premium) {
    return { ok: true, kind: "premium", update: {}, entitlement: ent };
  }

  const premiumTemplate = isPremiumTemplate(template);

  if (!premiumTemplate && ent.free.remaining > 0) {
    const startNewWindow = ent.free.resetsAt == null;
    const windowStart = startNewWindow ? now : ent.free.resetsAt - FREE_WINDOW_MS;
    const used = ent.free.used + 1;
    return {
      ok: true,
      kind: "free",
      update: { freeDownloads: { windowStart, used } },
      entitlement: {
        ...ent,
        free: {
          ...ent.free,
          used,
          remaining: ent.free.limit - used,
          resetsAt: windowStart + FREE_WINDOW_MS,
        },
      },
    };
  }

  // Legacy single-CV credits were sold as "all templates", so they unlock any template.
  if (ent.credits > 0) {
    return {
      ok: true,
      kind: "credit",
      update: { paidDownloads: ent.credits - 1 },
      entitlement: { ...ent, credits: ent.credits - 1 },
    };
  }

  return {
    ok: false,
    reason: premiumTemplate ? "premium_template" : "daily_limit",
    update: {},
    entitlement: ent,
  };
}

/** "in 5h 20m" / "in 12m" — for the free allowance reset time. */
export function formatResetIn(resetsAt, now = Date.now()) {
  if (!resetsAt) return "";
  const mins = Math.max(1, Math.ceil((resetsAt - now) / 60000));
  if (mins < 60) return `in ${mins}m`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m ? `in ${h}h ${m}m` : `in ${h}h`;
}

/** Badge text for dashboards and the admin panel. */
export function describeEntitlement(ent) {
  if (!ent) return { label: "Free", tone: "free", icon: "gift", sub: "" };
  if (ent.plan === "lifetime") {
    return { label: "Premium Lifetime", tone: "pro", icon: "crown", sub: "Unlimited downloads, forever" };
  }
  if (ent.premium) {
    const name = ent.plan === "yearly" ? "Premium Yearly" : ent.plan === "monthly" ? "Premium Monthly" : "Premium";
    const until = ent.expiresAt ? new Date(ent.expiresAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "";
    const verb = ent.autoRenew ? "Renews" : "Active until";
    return { label: name, tone: "pro", icon: "bolt", sub: until ? `${verb} ${until}` : "Unlimited downloads" };
  }
  const freeLine = `${ent.free.used} of ${ent.free.limit} free downloads used today`;
  if (ent.credits > 0) {
    return {
      label: `Free + ${ent.credits} credit${ent.credits !== 1 ? "s" : ""}`,
      tone: "credits",
      icon: "coins",
      sub: freeLine,
    };
  }
  return {
    label: "Free",
    tone: ent.free.remaining === 0 ? "exhausted" : "free",
    icon: ent.free.remaining === 0 ? "hourglass-half" : "gift",
    sub: ent.free.remaining === 0 && ent.free.resetsAt
      ? `Daily limit reached. Resets ${formatResetIn(ent.free.resetsAt)}`
      : freeLine,
  };
}
