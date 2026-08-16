/**
 * Open Paystack popup for single CV purchase (₦3,500)
 */
export function buyCV({ email, onSuccess, onClose }) {
  if (!window.PaystackPop) {
    alert("Payment system not loaded. Please refresh the page and try again.");
    return;
  }

  const reference = "cv_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9);

  const handler = window.PaystackPop.setup({
    key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
    email: email,
    amount: 350000,
    currency: "NGN",
    ref: reference,
    metadata: {
      purchase_type: "single_cv",
      custom_fields: [
        {
          display_name: "Purchase Type",
          variable_name: "purchase_type",
          value: "Single CV Download",
        },
      ],
    },
    callback: function(response) {
      // Must be a plain function, not async — Paystack validates this
      verifyAndNotify(response.reference, onSuccess);
    },
    onClose: function() {
      if (typeof onClose === "function") onClose();
    },
  });

  handler.openIframe();
}

/**
 * Open Paystack popup for Pro subscription (₦7,500/month)
 */
export function subscribePro({ email, onSuccess, onClose }) {
  if (!window.PaystackPop) {
    alert("Payment system not loaded. Please refresh the page and try again.");
    return;
  }

  const reference = "pro_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9);

  const handler = window.PaystackPop.setup({
    key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
    email: email,
    amount: 750000,
    currency: "NGN",
    plan: import.meta.env.VITE_PAYSTACK_PLAN_CODE_PRO,
    ref: reference,
    metadata: {
      purchase_type: "pro_subscription",
      custom_fields: [
        {
          display_name: "Purchase Type",
          variable_name: "purchase_type",
          value: "Memora Pro Monthly",
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
async function verifyAndNotify(reference, onSuccess) {
  try {
    const verify = await fetch("/api/verify-paystack-payment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
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