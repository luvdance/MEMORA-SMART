/**
 * Firebase Admin access for the CV endpoints. SERVER ONLY.
 *
 * Same service account as api/paystack-webhook.js (FIREBASE_PROJECT_ID,
 * FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY).
 */
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";

let ready = null;

function init() {
  if (ready !== null) return ready;
  const { FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY } = process.env;
  if (!FIREBASE_PROJECT_ID || !FIREBASE_CLIENT_EMAIL || !FIREBASE_PRIVATE_KEY) {
    ready = false;
    return ready;
  }
  try {
    if (!getApps().length) {
      initializeApp({
        credential: cert({
          projectId: FIREBASE_PROJECT_ID,
          clientEmail: FIREBASE_CLIENT_EMAIL,
          // Vercel stores the key with literal \n sequences.
          privateKey: FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
        }),
      });
    }
    ready = true;
  } catch (err) {
    console.error("Firebase Admin init failed:", err);
    ready = false;
  }
  return ready;
}

export function db() {
  if (!init()) throw new Error("Server is missing Firebase Admin credentials");
  return getFirestore();
}

/**
 * The signed-in user, from the `Authorization: Bearer <Firebase ID token>`
 * header. The uid is never taken from the request body.
 * @returns {Promise<{uid: string, email: string|null, admin: boolean}|null>}
 */
export async function identify(req) {
  if (!init()) return null;
  const match = /^Bearer\s+(.+)$/i.exec(String(req.headers?.authorization || "").trim());
  if (!match) return null;
  try {
    const decoded = await getAuth().verifyIdToken(match[1]);
    return { uid: decoded.uid, email: decoded.email || null, admin: decoded.admin === true };
  } catch {
    return null;
  }
}
