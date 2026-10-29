import { PLANS } from "../cv-builder/utils/plans";
import { cvApi } from "../cv-builder/utils/cvAccess";

// Paystack Inline v2 opens a transaction the SERVER created (by access code),
// so plan codes and prices stay on the server. v1 (index.html) is still used
// by book purchases; both scripts define window.PaystackPop, so v2 is loaded
// on demand and v1's global is put back afterwards.
let inlineV2 = null;
function loadPaystackV2() {
  if (inlineV2) return inlineV2;
  inlineV2 = new Promise((resolve, reject) => {
    const v1 = window.PaystackPop;
    const script = document.createElement("script");
    script.src = "https://js.paystack.co/v2/inline.js";
    script.async = true;
    script.onload = () => {
      const V2 = window.PaystackPop;
      window.PaystackPop = v1;
      if (typeof V2 === "function") resolve(V2);
      else reject(new Error("Paystack v2 not available"));
    };
    script.onerror = () => {
      window.PaystackPop = v1;
      inlineV2 = null;
      reject(new Error("Could not load Paystack"));
    };
    document.head.appendChild(script);
  });
  return inlineV2;
}

/** Ask the server whether `reference` was paid (and grant it if so). Null if not paid. */
async function confirmPayment(reference, user) {
  try {
    const headers = { "Content-Type": "application/json" };
    if (user?.getIdToken) headers.Authorization = `Bearer ${await user.getIdToken()}`;
    const res = await fetch("/api/cv/verify-payment", {
      method: "POST",
      headers,
      body: JSON.stringify({ reference }),
    });
    const result = await res.json();
    return result.verified ? result : null;
  } catch {
    return null;
  }
}

/**
 * Pay for a CV Premium plan: "monthly" | "yearly" | "lifetime".
 * The server starts the transaction (with the plan code, from server-only env
 * vars) and grants the plan from what Paystack reports, never from the browser.
 */
export async function buyPlan({ user, plan, onSuccess, onClose }) {
  const close = () => { if (typeof onClose === "function") onClose(); };
  if (!PLANS[plan] || !user) return close();

  let session;
  try {
    const { data } = await cvApi("start-checkout", user, { plan });
    if (!data.success) throw new Error(data.error || "Could not start payment");
    session = data;
  } catch (err) {
    alert(err.message || "Could not start payment. Please try again.");
    return close();
  }

  // Confirm by reference however the popup ends: success callback, or the
  // user closing it (they may have paid first). Runs at most once.
  let settled = false;
  const settle = async () => {
    if (settled) return;
    settled = true;
    const result = await confirmPayment(session.reference, user);
    if (result && typeof onSuccess === "function") onSuccess(result);
    else close();
  };

  try {
    const PaystackPop = await loadPaystackV2();
    const popup = new PaystackPop();
    popup.resumeTransaction(session.accessCode, {
      onSuccess: settle,
      onCancel: settle,
      onError: () => {
        settled = true;
        close();
      },
    });
  } catch {
    // Popup unavailable: continue on Paystack's own page. It returns to
    // /dashboard/payments, which confirms the payment there.
    window.location.href = session.authorizationUrl;
  }
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