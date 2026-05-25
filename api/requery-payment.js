import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";

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

  const { reference, userId } = req.body;

  if (!reference) {
    return res.status(400).json({ error: "Payment reference required" });
  }

  try {
    // 1. Check if we already processed this reference
    const existingPayment = await db
      .collection("payments")
      .where("reference", "==", reference)
      .limit(1)
      .get();

    if (!existingPayment.empty) {
      return res.status(200).json({
        success: true,
        alreadyProcessed: true,
        message: "Payment already verified and credited",
      });
    }

    // 2. Query Paystack for the actual payment status
    const psResponse = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const psData = await psResponse.json();

    if (!psData.status || psData.data?.status !== "success") {
      return res.status(400).json({
        success: false,
        message: psData.data?.gateway_response || "Payment was not successful",
        paystackStatus: psData.data?.status,
      });
    }

    // 3. Payment is genuine. Extract details
    const email = psData.data.customer?.email;
    const amount = psData.data.amount / 100; // kobo to naira
    const metadata = psData.data.metadata || {};
    const purchaseType = metadata.purchase_type || "single_cv";

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Payment found but no customer email attached",
      });
    }

    // 4. Find the user
    const userQuery = await db
      .collection("users")
      .where("email", "==", email)
      .limit(1)
      .get();

    if (userQuery.empty) {
      return res.status(404).json({
        success: false,
        message: "No user account found with that email",
      });
    }

    const userDoc = userQuery.docs[0];
    const userIdFromDb = userDoc.id;

    // Optional: verify the userId passed in matches
    if (userId && userId !== userIdFromDb) {
      return res.status(403).json({
        success: false,
        message: "Payment email does not match logged-in user",
      });
    }

    // 5. Grant the appropriate access based on purchase type
    let creditsGranted = 0;
    let promoApplied = false;

    if (purchaseType === "single_cv") {
      // Use a transaction to check + update promo state safely
      const settingsRef = db.collection("settings").doc("global");

      let totalCredits = 1;

      await db.runTransaction(async (transaction) => {
        const settingsDoc = await transaction.get(settingsRef);
        const settings = settingsDoc.exists ? settingsDoc.data() : {};

        const promoActive = settings.launchPromoActive === true;
        const promoCount = settings.launchPromoCount || 0;
        const promoLimit = settings.launchPromoLimit || 50;
        const promoBonus = settings.launchPromoBonus || 5;

        if (promoActive && promoCount < promoLimit) {
          totalCredits += promoBonus;
          promoApplied = true;

          const newCount = promoCount + 1;
          const updates = { launchPromoCount: newCount };

          if (newCount >= promoLimit) {
            updates.launchPromoActive = false;
            updates.launchPromoEndedAt = FieldValue.serverTimestamp();
          }

          transaction.update(settingsRef, updates);
        }

        transaction.update(userDoc.ref, {
          paidDownloads: FieldValue.increment(totalCredits),
          updatedAt: FieldValue.serverTimestamp(),
        });
      });

      creditsGranted = totalCredits;
    } else if (purchaseType === "pro_subscription") {
      const proExpiresAt = new Date();
      proExpiresAt.setDate(proExpiresAt.getDate() + 31);
      await userDoc.ref.update({
        isPro: true,
        proExpiresAt,
        updatedAt: FieldValue.serverTimestamp(),
      });
    }

    // 6. Record the payment so we don't double-process
    await db.collection("payments").add({
      userId: userIdFromDb,
      email,
      amount,
      currency: "NGN",
      reference,
      purchaseType,
      provider: "paystack",
      status: "success",
      source: "requery",
      creditsGranted: creditsGranted || null,
      promoApplied: promoApplied || false,
      createdAt: FieldValue.serverTimestamp(),
    });

    return res.status(200).json({
      success: true,
      message: promoApplied
        ? `Payment verified! You got ${creditsGranted} CV credits (launch bonus included).`
        : "Payment verified and access granted",
      amount,
      purchaseType,
      creditsGranted,
      promoApplied,
    });

  } catch (err) {
    console.error("Requery error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error during verification: " + err.message,
    });
  }
}