import crypto from "crypto";
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";

// Initialize Firebase Admin (only once)
if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
}

const db = getFirestore();

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
  const data = event.data;

  console.log("Paystack event received:", event.event);

  try {
    switch (event.event) {

      // ── ONE-TIME CV PURCHASE ──
      case "charge.success": {
        const email = data.customer?.email;
        const amount = data.amount; // in kobo
        const reference = data.reference;
        const metadata = data.metadata || {};
        const purchaseType = metadata.purchase_type || "single_cv";

        if (!email) break;

        // Find user by email
        const usersRef = db.collection("users");
        const snapshot = await usersRef.where("email", "==", email).get();

        if (snapshot.empty) {
          console.error("No user found for email:", email);
          break;
        }

        const userDoc = snapshot.docs[0];
        const userId = userDoc.id;

        if (purchaseType === "single_cv") {
          // Add 1 paid download credit
          await userDoc.ref.update({
            paidDownloads: FieldValue.increment(1),
            updatedAt: FieldValue.serverTimestamp(),
          });
        }

        // Record payment in payments collection
        await db.collection("payments").add({
          userId,
          email,
          amount: amount / 100, // convert kobo to naira
          currency: "NGN",
          reference,
          purchaseType,
          provider: "paystack",
          status: "success",
          createdAt: FieldValue.serverTimestamp(),
        });

        console.log(`Payment recorded for ${email} — type: ${purchaseType}`);
        break;
      }

      // ── PRO SUBSCRIPTION CREATED ──
      case "subscription.create": {
        const email = data.customer?.email;
        const subscriptionCode = data.subscription_code;
        const customerCode = data.customer?.customer_code;
        const nextPaymentDate = data.next_payment_date;

        if (!email) break;

        const snapshot = await db.collection("users")
          .where("email", "==", email).get();

        if (snapshot.empty) break;

        const userDoc = snapshot.docs[0];

        // Calculate pro expiry (next payment date or 31 days from now as fallback)
        const proExpiresAt = nextPaymentDate
          ? new Date(nextPaymentDate)
          : new Date(Date.now() + 31 * 24 * 60 * 60 * 1000);

        await userDoc.ref.update({
          isPro: true,
          proExpiresAt,
          paystackSubscriptionCode: subscriptionCode,
          paystackCustomerCode: customerCode,
          updatedAt: FieldValue.serverTimestamp(),
        });

        await db.collection("payments").add({
          userId: userDoc.id,
          email,
          amount: 7500,
          currency: "NGN",
          purchaseType: "pro_subscription",
          subscriptionCode,
          provider: "paystack",
          status: "success",
          createdAt: FieldValue.serverTimestamp(),
        });

        console.log(`Pro subscription created for ${email}`);
        break;
      }

      // ── PRO SUBSCRIPTION RENEWED ──
      case "invoice.payment_failed":
      case "charge.success": {
        // Handled above — subscription renewals also fire charge.success
        break;
      }

      // ── PRO SUBSCRIPTION DISABLED / CANCELLED ──
      case "subscription.disable":
      case "subscription.not_renew": {
        const email = data.customer?.email;
        if (!email) break;

        const snapshot = await db.collection("users")
          .where("email", "==", email).get();

        if (snapshot.empty) break;

        await snapshot.docs[0].ref.update({
          isPro: false,
          paystackSubscriptionCode: null,
          updatedAt: FieldValue.serverTimestamp(),
        });

        console.log(`Subscription cancelled for ${email}`);
        break;
      }

      default:
        console.log("Unhandled event:", event.event);
    }

    return res.status(200).json({ received: true });

  } catch (err) {
    console.error("Webhook error:", err);
    return res.status(500).json({ error: "Webhook processing failed" });
  }
}