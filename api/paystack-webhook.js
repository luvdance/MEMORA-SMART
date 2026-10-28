import crypto from "crypto";
import { db } from "../lib/cv/admin.js";
import { grantTransaction, applySubscriptionEvent } from "../lib/cv/billing.js";

/**
 * Paystack webhook. Set this URL in Paystack → Settings → API Keys & Webhooks:
 *   https://<your-domain>/api/paystack-webhook
 *
 * Granting is shared with the browser's verify call and the manual requery
 * (lib/cv/billing.js) and is idempotent per reference, so a payment confirmed
 * by both paths is credited exactly once.
 */
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // ── VERIFY PAYSTACK SIGNATURE ──
  const secret = process.env.PAYSTACK_SECRET_KEY;
  const hash = crypto
    .createHmac("sha512", secret)
    .update(JSON.stringify(req.body))
    .digest("hex");

  if (hash !== req.headers["x-paystack-signature"]) {
    console.error("Invalid Paystack signature");
    return res.status(400).json({ error: "Invalid signature" });
  }

  const event = req.body;
  const data = event.data || {};
  console.log("Paystack event received:", event.event);

  try {
    switch (event.event) {
      // First payments, one-time purchases AND subscription renewals all arrive here.
      case "charge.success": {
        const result = await grantTransaction(db(), data, { source: "webhook" });
        console.log(`charge.success ${data.reference} → ${result.status}${result.plan ? ` (${result.plan})` : ""}`);
        if (result.status === "user_not_found") {
          console.error("No user found for payment:", data.customer?.email, data.reference);
        }
        break;
      }

      // Subscription lifecycle. Cancelling stops renewal; access continues to the paid-through date.
      case "subscription.create":
      case "subscription.disable":
      case "subscription.not_renew":
      case "invoice.payment_failed": {
        const result = await applySubscriptionEvent(db(), event.event, data);
        console.log(`${event.event} ${data.customer?.email || ""} → ${result.status}`);
        break;
      }

      default:
        console.log("Unhandled event:", event.event);
    }

    return res.status(200).json({ received: true });
  } catch (err) {
    console.error("Webhook error:", err);
    // 500 makes Paystack retry later, which is safe because granting is idempotent.
    return res.status(500).json({ error: "Webhook processing failed" });
  }
}
