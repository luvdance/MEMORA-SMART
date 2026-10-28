/**
 * Self-test for CV plans and Paystack grants. Run: npm run test:cv
 *
 * Exercises the pure plan rules (src/cv-builder/utils/plans.js) and the
 * granting logic (lib/cv/billing.js) against an in-memory Firestore stand-in,
 * so no network or credentials are needed.
 */
import assert from "node:assert/strict";
import { computeEntitlement, decideDownload, FREE_WINDOW_MS, RENEWAL_GRACE_MS, toMillis } from "../../src/cv-builder/utils/plans.js";
import { grantTransaction, classifyTransaction, applySubscriptionEvent } from "./billing.js";

// ── Minimal Firestore stand-in (collections, docs, == queries, serial transactions) ──
function fakeDb() {
  const store = new Map(); // "col/id" → data
  let lock = Promise.resolve();

  const snapOf = (path, id) => {
    const data = store.get(path);
    return { id, exists: data !== undefined, data: () => (data === undefined ? undefined : structuredClone(data)) };
  };
  const merge = (path, data, opts) => {
    const prev = store.get(path);
    store.set(path, opts?.merge && prev ? { ...prev, ...structuredClone(data) } : structuredClone(data));
  };

  const docRef = (col, id) => ({
    id,
    path: `${col}/${id}`,
    get: async () => snapOf(`${col}/${id}`, id),
    set: async (data, opts) => merge(`${col}/${id}`, data, opts),
  });

  const query = (col, filters = [], max = Infinity) => ({
    where: (field, op, value) => query(col, [...filters, [field, value]], max),
    limit: (n) => query(col, filters, n),
    get: async () => {
      const docs = [];
      for (const [path, data] of store) {
        const [c, id] = path.split("/");
        if (c !== col) continue;
        if (filters.every(([f, v]) => data[f] === v)) {
          docs.push({ id, ref: docRef(col, id), data: () => structuredClone(data) });
        }
        if (docs.length >= max) break;
      }
      return { empty: docs.length === 0, docs };
    },
    _isQuery: true,
  });

  const db = {
    store,
    collection: (col) => ({
      doc: (id) => docRef(col, id),
      where: (f, op, v) => query(col).where(f, op, v),
    }),
    // Serial execution models Firestore's serializable transactions.
    runTransaction: (fn) => {
      const run = lock.then(async () => {
        const writes = [];
        const t = {
          get: (ref) => ref.get(),
          set: (ref, data, opts) => writes.push([ref.path, data, opts]),
        };
        const out = await fn(t);
        for (const [path, data, opts] of writes) merge(path, data, opts);
        return out;
      });
      lock = run.catch(() => {});
      return run;
    },
  };
  return db;
}

const DAY = 24 * 60 * 60 * 1000;
const T0 = Date.UTC(2026, 9, 28, 9, 0, 0);
let passed = 0;
function test(name, fn) {
  return Promise.resolve().then(fn).then(
    () => { passed++; console.log(`  ✓ ${name}`); },
    (err) => { console.error(`  ✗ ${name}\n    ${err.stack}`); process.exitCode = 1; },
  );
}
const tx = (o) => ({ status: "success", currency: "NGN", customer: { email: "ada@test.com", customer_code: "CUS_1", id: 11 }, ...o });

console.log("Plans");

await test("free user gets 5 downloads, the 6th is refused, and the window resets after 24h", () => {
  let user = {};
  for (let i = 1; i <= 5; i++) {
    const d = decideDownload(user, { template: 0 }, T0 + i * 1000);
    assert.equal(d.ok, true);
    assert.equal(d.kind, "free");
    assert.equal(d.entitlement.free.used, i, "shows i of 5 used");
    user = { ...user, ...d.update };
  }
  const sixth = decideDownload(user, { template: 0 }, T0 + 10_000);
  assert.equal(sixth.ok, false);
  assert.equal(sixth.reason, "daily_limit");
  assert.equal(sixth.entitlement.free.resetsAt, T0 + 1000 + FREE_WINDOW_MS);

  const nextDay = decideDownload(user, { template: 0 }, T0 + 1000 + FREE_WINDOW_MS);
  assert.equal(nextDay.ok, true);
  assert.equal(nextDay.entitlement.free.used, 1);
});

await test("premium template is refused for free users but allowed with a legacy credit", () => {
  assert.equal(decideDownload({}, { template: 13 }, T0).reason, "premium_template");
  const withCredit = decideDownload({ paidDownloads: 2 }, { template: 13 }, T0);
  assert.equal(withCredit.ok, true);
  assert.equal(withCredit.kind, "credit");
  assert.deepEqual(withCredit.update, { paidDownloads: 1 });
});

await test("free allowance is spent before paid credits", () => {
  const d = decideDownload({ paidDownloads: 3 }, { template: 0 }, T0);
  assert.equal(d.kind, "free");
});

await test("monthly plan is premium through the renewal grace period, then lapses", () => {
  const user = { plan: "monthly", planExpiresAt: new Date(T0) };
  assert.equal(computeEntitlement(user, T0 - DAY).premium, true);
  assert.equal(computeEntitlement(user, T0 + RENEWAL_GRACE_MS - 1).premium, true);
  assert.equal(computeEntitlement(user, T0 + RENEWAL_GRACE_MS + 1).premium, false);
  assert.equal(decideDownload(user, { template: 14 }, T0).kind, "premium");
});

await test("legacy Pro (isPro + proExpiresAt) and lifetime are premium", () => {
  assert.equal(computeEntitlement({ isPro: true, proExpiresAt: new Date(T0 + DAY) }, T0).premium, true);
  assert.equal(computeEntitlement({ isPro: true, proExpiresAt: new Date(T0 - DAY) }, T0).premium, false);
  const life = computeEntitlement({ plan: "lifetime", lifetime: true }, T0);
  assert.equal(life.premium, true);
  assert.equal(life.expiresAt, null);
  assert.equal(life.canUseAi, true);
  assert.equal(computeEntitlement({}, T0).canUseAi, false);
});

console.log("Billing");
const env = { PAYSTACK_PLAN_MONTHLY: "PLN_month", PAYSTACK_PLAN_YEARLY: "PLN_year" };

await test("lifetime purchase is granted once; a repeat of the same reference is a no-op", async () => {
  const db = fakeDb();
  await db.collection("users").doc("u1").set({ email: "ada@test.com" });
  const t = tx({ reference: "ref_life", amount: 1200000, metadata: { purchase_type: "cv_plan", plan: "lifetime", uid: "u1" } });
  const first = await grantTransaction(db, t, { source: "verify", now: T0, env });
  assert.equal(first.status, "granted");
  const again = await grantTransaction(db, t, { source: "webhook", now: T0, env });
  assert.equal(again.status, "already_processed");
  const user = db.store.get("users/u1");
  assert.equal(user.plan, "lifetime");
  assert.equal(user.paystackCustomerCode, "CUS_1");
  assert.equal(computeEntitlement(user, T0).premium, true);
  const payments = [...db.store.keys()].filter(k => k.startsWith("payments/"));
  assert.equal(payments.length, 1);
});

await test("paying less than the plan price grants nothing", async () => {
  const db = fakeDb();
  await db.collection("users").doc("u1").set({ email: "ada@test.com" });
  const r = await grantTransaction(db, tx({ reference: "ref_cheap", amount: 100, metadata: { plan: "lifetime", uid: "u1" } }), { now: T0, env });
  assert.equal(r.status, "underpaid");
  assert.equal(db.store.get("users/u1").plan, undefined);
});

await test("monthly renewal (no metadata, plan code only) extends from the current paid-through date", async () => {
  const db = fakeDb();
  await db.collection("users").doc("u1").set({ email: "ada@test.com" });
  await grantTransaction(db, tx({ reference: "r1", amount: 350000, plan: { plan_code: "PLN_month" }, metadata: { plan: "monthly", uid: "u1" } }), { now: T0, env });
  const firstEnd = toMillis(db.store.get("users/u1").planExpiresAt);
  assert.equal(new Date(firstEnd).getUTCMonth(), new Date(T0).getUTCMonth() + 1);
  assert.equal(db.store.get("users/u1").autoRenew, true);

  // Renewal is charged on the due date; found by customer code, not metadata.
  const renewal = tx({ reference: "r2", amount: 350000, plan: { plan_code: "PLN_month" }, metadata: "" });
  const r = await grantTransaction(db, renewal, { now: firstEnd, env });
  assert.equal(r.status, "granted");
  assert.equal(r.plan, "monthly");
  const secondEnd = toMillis(db.store.get("users/u1").planExpiresAt);
  assert.ok(secondEnd > firstEnd + 27 * DAY && secondEnd < firstEnd + 32 * DAY, "one more month");
});

await test("buying yearly while monthly is active stacks the time", async () => {
  const db = fakeDb();
  const monthEnd = T0 + 20 * DAY;
  await db.collection("users").doc("u1").set({ email: "ada@test.com", plan: "monthly", planExpiresAt: new Date(monthEnd) });
  await grantTransaction(db, tx({ reference: "ry", amount: 700000, metadata: { plan: "yearly", uid: "u1" } }), { now: T0, env });
  const u = db.store.get("users/u1");
  assert.equal(u.plan, "yearly");
  assert.ok(toMillis(u.planExpiresAt) > monthEnd + 360 * DAY);
});

await test("book purchases are recorded but change no plan", async () => {
  const db = fakeDb();
  await db.collection("users").doc("u1").set({ email: "ada@test.com" });
  const r = await grantTransaction(db, tx({ reference: "rb", amount: 500000, metadata: { purchase_type: "book_purchase" } }), { now: T0, env });
  assert.equal(r.status, "recorded");
  assert.equal(db.store.get("users/u1").plan, undefined);
});

await test("unknown payer is not recorded, so a later requery can still grant", async () => {
  const db = fakeDb();
  const t = tx({ reference: "rx", amount: 350000, customer: { email: "new@test.com" }, metadata: { plan: "monthly" } });
  assert.equal((await grantTransaction(db, t, { now: T0, env })).status, "user_not_found");
  assert.equal([...db.store.keys()].some(k => k.startsWith("payments/")), false);
  await db.collection("users").doc("u9").set({ email: "new@test.com" });
  assert.equal((await grantTransaction(db, t, { now: T0, env })).status, "granted");
});

await test("references already in payments from the old code are not credited again", async () => {
  const db = fakeDb();
  await db.collection("users").doc("u1").set({ email: "ada@test.com" });
  await db.collection("payments").doc("randomOldId").set({ reference: "old_ref", amount: 3500 });
  const r = await grantTransaction(db, tx({ reference: "old_ref", amount: 350000, metadata: { purchase_type: "single_cv" } }), { now: T0, env });
  assert.equal(r.status, "already_processed");
  assert.equal(db.store.get("users/u1").paidDownloads, undefined);
});

await test("webhook and browser verify racing on one reference grant exactly once", async () => {
  const db = fakeDb();
  await db.collection("users").doc("u1").set({ email: "ada@test.com", paidDownloads: 0 });
  const t = tx({ reference: "race", amount: 350000, metadata: { purchase_type: "single_cv", uid: "u1" } });
  const results = await Promise.all([
    grantTransaction(db, t, { source: "webhook", now: T0, env }),
    grantTransaction(db, t, { source: "verify", now: T0, env }),
  ]);
  assert.deepEqual(results.map(r => r.status).sort(), ["already_processed", "granted"]);
  assert.equal(db.store.get("users/u1").paidDownloads, 1);
});

await test("renewal with an unknown plan code is recognised by amount", () => {
  assert.equal(classifyTransaction({ amount: 700000, plan: "PLN_other" }, env).plan, "yearly");
  assert.equal(classifyTransaction({ amount: 350000, plan: { plan_code: "PLN_other" } }, env).plan, "monthly");
  assert.equal(classifyTransaction({ amount: 350000, metadata: '{"purchase_type":"single_cv"}' }, env).kind, "credit");
});

await test("renewals on the old ₦7,500 Pro plan still extend access by a month", async () => {
  const legacyEnv = { ...env, VITE_PAYSTACK_PLAN_CODE_PRO: "PLN_oldpro" };
  assert.equal(classifyTransaction({ amount: 750000, plan: { plan_code: "PLN_oldpro" } }, legacyEnv).plan, "monthly");
  const db = fakeDb();
  await db.collection("users").doc("u1").set({ email: "ada@test.com", paystackCustomerCode: "CUS_1", isPro: true, proExpiresAt: new Date(T0) });
  const r = await grantTransaction(db, tx({ reference: "oldpro_r", amount: 750000, plan: { plan_code: "PLN_oldpro" }, metadata: null }), { now: T0, env: legacyEnv });
  assert.equal(r.status, "granted");
  assert.ok(computeEntitlement(db.store.get("users/u1"), T0 + 25 * DAY).premium);
});

await test("cancelling a subscription keeps access until the paid-through date", async () => {
  const db = fakeDb();
  await db.collection("users").doc("u1").set({ email: "ada@test.com", paystackCustomerCode: "CUS_1", plan: "monthly", planExpiresAt: new Date(T0 + 10 * DAY), autoRenew: true });
  const r = await applySubscriptionEvent(db, "subscription.not_renew", { customer: { email: "ada@test.com", customer_code: "CUS_1" } }, T0);
  assert.equal(r.status, "auto_renew_off");
  const u = db.store.get("users/u1");
  assert.equal(u.autoRenew, false);
  assert.equal(computeEntitlement(u, T0 + 5 * DAY).premium, true);
});

console.log(`\n${passed} passed${process.exitCode ? ", SOME FAILED" : ""}`);
