import { checkDownloadAccess, recordDownload } from "./userService";

/**
 * Open Paystack popup for single CV purchase (₦3,500)
 */
export function buyCV({ email, onSuccess, onClose }) {
  if (!window.PaystackPop) {
    alert("Payment system not loaded. Please refresh and try again.");
    return;
  }

  const handler = window.PaystackPop.setup({
    key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
    email,
    amount: 350000, // ₦3,500 in kobo
    currency: "NGN",
    ref: `cv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
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
    callback: async (response) => {
      try {
        // Verify payment server-side before granting access
        const verify = await fetch("/api/verify-paystack-payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ reference: response.reference }),
        });

        const result = await verify.json();

        if (result.verified) {
          onSuccess(result);
        } else {
          alert("Payment could not be verified. Please contact support.");
        }
      } catch (err) {
        console.error("Verification failed:", err);
        alert("Payment verification failed. Please contact support.");
      }
    },
    onClose: () => {
      if (onClose) onClose();
    },
  });

  handler.openIframe();
}

/**
 * Open Paystack popup for Pro subscription (₦7,500/month)
 */
export function subscribePro({ email, onSuccess, onClose }) {
  if (!window.PaystackPop) {
    alert("Payment system not loaded. Please refresh and try again.");
    return;
  }

  const handler = window.PaystackPop.setup({
    key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
    email,
    amount: 750000, // ₦7,500 in kobo
    currency: "NGN",
    plan: import.meta.env.VITE_PAYSTACK_PLAN_CODE_PRO,
    ref: `pro_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
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
    callback: async (response) => {
      try {
        const verify = await fetch("/api/verify-paystack-payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ reference: response.reference }),
        });

        const result = await verify.json();

        if (result.verified) {
          onSuccess(result);
        } else {
          alert("Subscription could not be verified. Please contact support.");
        }
      } catch (err) {
        console.error("Verification failed:", err);
      }
    },
    onClose: () => {
      if (onClose) onClose();
    },
  });

  handler.openIframe();
}