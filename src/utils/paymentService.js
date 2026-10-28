import { PLANS } from "../cv-builder/utils/plans";

// Paystack plan codes make Monthly and Yearly auto-renewing subscriptions.
// Without them the same amount is charged once and the plan simply runs out.
const PLAN_CODES = {
  monthly: import.meta.env.VITE_PAYSTACK_PLAN_MONTHLY,
  yearly: import.meta.env.VITE_PAYSTACK_PLAN_YEARLY,
};

/**
 * Open Paystack popup for a CV Premium plan: "monthly" | "yearly" | "lifetime".
 * The server grants the plan from what Paystack reports (plan + amount paid),
 * never from what this popup claims.
 */
export function buyPlan({ user, plan, onSuccess, onClose }) {
  if (!window.PaystackPop) {
    alert("Payment system not loaded. Please refresh the page and try again.");
    return;
  }
  const info = PLANS[plan];
  if (!info || !user?.email) return;

  const reference = `cv_${plan}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const planCode = PLAN_CODES[plan];

  const handler = window.PaystackPop.setup({
    key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
    email: user.email,
    amount: info.price * 100,
    currency: "NGN",
    ...(planCode ? { plan: planCode } : {}),
    ref: reference,
    metadata: {
      purchase_type: "cv_plan",
      plan,
      uid: user.uid,
      custom_fields: [
        {
          display_name: "Plan",
          variable_name: "plan",
          value: info.name,
        },
      ],
    },
    callback: function(response) {
      // Must be a plain function, not async — Paystack validates this
      verifyAndNotify(response.reference, onSuccess, user);
    },
    onClose: function() {
      if (typeof onClose === "function") onClose();
    },
  });

  handler.openIframe();
}

/**
 * Open Paystack popup for a full book purchase.
 * `book` is one entry from src/data/books.js (paidBooks array) —
 * needs at least { slug, title, price } where price is in Naira.
 */
export function buyBook({ email, book, onSuccess, onClose }) {
  if (!window.PaystackPop) {
    alert("Payment system not loaded. Please refresh the page and try again.");
    return;
  }

  const reference = "book_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9);

  const handler = window.PaystackPop.setup({
    key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
    email: email,
    amount: book.price * 100,
    currency: "NGN",
    ref: reference,
    metadata: {
      purchase_type: "book_purchase",
      book_slug: book.slug,
      book_title: book.title,
      custom_fields: [
        {
          display_name: "Purchase Type",
          variable_name: "purchase_type",
          value: "Book Purchase",
        },
        {
          display_name: "Book",
          variable_name: "book_title",
          value: book.title,
        },
      ],
    },
    callback: function(response) {
      verifyAndNotify(response.reference, onSuccess);
    },
    onClose: function() {
      if (typeof onClose === "function") onClose();
    },
  });

  handler.openIframe();
}

/**
 * Internal: verify payment server-side then notify caller.
 * Separated from callback so Paystack gets a plain sync function.
 */
async function verifyAndNotify(reference, onSuccess, user) {
  try {
    const headers = { "Content-Type": "application/json" };
    if (user?.getIdToken) headers.Authorization = `Bearer ${await user.getIdToken()}`;
    // Verifies with Paystack and, for CV plans, grants access right away
    // (the webhook does the same; whichever lands first wins, once).
    const verify = await fetch("/api/cv/verify-payment", {
      method: "POST",
      headers,
      body: JSON.stringify({ reference }),
    });

    const result = await verify.json();

    if (result.verified && typeof onSuccess === "function") {
      onSuccess(result);
    } else {
      alert("Payment could not be verified. Please contact support if you were charged.");
    }
  } catch (err) {
    console.error("Verification failed:", err);
    alert("Payment verification failed. Contact support with reference: " + reference);
  }
}