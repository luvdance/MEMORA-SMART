import { db } from "../firebase";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  increment,
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
 * Check if a user can download a CV right now.
 * Returns { canDownload, reason, requiresPayment, isFree, userStatus }
 */
export async function checkDownloadAccess(uid) {
  let userData = await getUserDoc(uid);

  // If user doc doesn't exist yet, create it and allow free download
  if (!userData) {
    await initUserDoc({ uid, email: null, displayName: null, photoURL: null });
    userData = await getUserDoc(uid);
    // Still no doc after init — fail open (let them download)
    if (!userData) {
      return {
        canDownload: true,
        reason: "free_cv",
        isFree: true,
        userStatus: "free",
        requiresPayment: false,
      };
    }
  }

  // Pro subscription active?
  if (userData.isPro && userData.proExpiresAt) {
    const expiresAt = userData.proExpiresAt?.toDate
      ? userData.proExpiresAt.toDate()
      : new Date(userData.proExpiresAt);

    if (expiresAt > new Date()) {
      return {
        canDownload: true,
        reason: "pro_active",
        requiresPayment: false,
        userStatus: "pro",
      };
    }
  }

  // Has paid download credits?
  if (userData.paidDownloads > 0) {
    return {
      canDownload: true,
      reason: "paid_credit",
      requiresPayment: false,
      userStatus: "credits",
      creditsRemaining: userData.paidDownloads,
    };
  }

  // First free CV still available?
  if (!userData.freeCVUsed) {
    return {
      canDownload: true,
      reason: "free_cv",
      requiresPayment: false,
      isFree: true,
      userStatus: "free",
    };
  }

  // Nothing left — must pay
  return {
    canDownload: false,
    reason: "payment_required",
    requiresPayment: true,
    userStatus: "exhausted",
  };
}

/**
 * Record a successful download.
 * Decrements paid credit OR marks free CV as used.
 */
export async function recordDownload(uid, accessInfo) {
  if (!uid) return;
  const ref = doc(db, "users", uid);

  if (accessInfo.isFree) {
    await updateDoc(ref, {
      freeCVUsed: true,
      updatedAt: serverTimestamp(),
    });
  } else if (accessInfo.reason === "paid_credit") {
    await updateDoc(ref, {
      paidDownloads: increment(-1),
      updatedAt: serverTimestamp(),
    });
  }
  // Pro users — no change needed
}

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