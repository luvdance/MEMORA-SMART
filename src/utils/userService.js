import { db } from "../firebase";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
  collection,
  addDoc,
  query,
  where,
  getDocs,
} from "firebase/firestore";

/**
 * Initialize a user document the first time they log in.
 */
export async function initUserDoc(user) {
  if (!user) return null;
  const ref = doc(db, "users", user.uid);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    const userName = user.displayName || "";
    await setDoc(ref, {
      uid: user.uid,
      email: user.email,
      name: userName,           // ← ADD this (matches what Admin reads)
      displayName: userName,    // ← KEEP this for backwards compatibility
      photoURL: user.photoURL || "",

      freeCVUsed: false,
      paidDownloads: 0,
      isPro: false,
      proExpiresAt: null,
      paystackSubscriptionCode: null,
      paystackCustomerCode: null,

      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return (await getDoc(ref)).then(s => s.data());
  }

  // Update name if it was missing or empty (handles race condition)
  if (user.displayName && (!snap.data().name || snap.data().name === "")) {
    await updateDoc(ref, {
      name: user.displayName,
      displayName: user.displayName,
      updatedAt: serverTimestamp(),
    });
  }

  return snap.data();
}

/**
 * Get a user's Firestore document.
 */
export async function getUserDoc(uid) {
  if (!uid) return null;
  const ref = doc(db, "users", uid);
  const snap = await getDoc(ref);
  return snap.exists() ? snap.data() : null;
}

/**
 * CV download checks moved to the server: see decideDownload() in
 * src/cv-builder/utils/plans.js and POST /api/cv/download (lib/cv/handlers.js).
 */

/**
 * Create a pending NGN bank transfer record for admin review.
 */
export async function createPendingTransfer(uid, userEmail, amount, currency, type) {
  const ref = await addDoc(collection(db, "pending_transfers"), {
    userId: uid,
    userEmail,
    amount,
    currency,
    type, // "single_cv" | "pro_monthly"
    status: "pending",
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

/**
 * Get all pending transfers for a specific user.
 */
export async function getUserPendingTransfers(uid) {
  const q = query(
    collection(db, "pending_transfers"),
    where("userId", "==", uid)
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

/**
 * Get launch promo state. Used to decide bonus credits.
 */
export async function getLaunchPromoState() {
  try {
    const ref = doc(db, "settings", "global");
    const snap = await getDoc(ref);
    if (!snap.exists()) {
      return { active: false, count: 0, limit: 50, bonus: 0 };
    }
    const data = snap.data();
    return {
      active: data.launchPromoActive === true,
      count: data.launchPromoCount || 0,
      limit: data.launchPromoLimit || 50,
      bonus: data.launchPromoBonus || 5,
      spotsLeft: Math.max(0, (data.launchPromoLimit || 50) - (data.launchPromoCount || 0)),
    };
  } catch (err) {
    console.error("Failed to read promo state:", err);
    return { active: false, count: 0, limit: 50, bonus: 0, spotsLeft: 0 };
  }
}