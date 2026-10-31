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
let initError = null;

function init() {
  if (ready !== null) return ready;
  const { FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY } = process.env;
  const missing = ["FIREBASE_PROJECT_ID", "FIREBASE_CLIENT_EMAIL", "FIREBASE_PRIVATE_KEY"].filter(k => !process.env[k]);
  if (missing.length) {
    initError = `Missing environment variables: ${missing.join(", ")}`;
    ready = false;
    return ready;
  }
  try {
    if (!getApps().length) {
      initializeApp({
        credential: cert({
          projectId: FIREBASE_PROJECT_ID,
          clientEmail: FIREBASE_CLIENT_EMAIL,
          // Vercel stores the key with literal \n sequences; strip wrapping quotes too.
          privateKey: FIREBASE_PRIVATE_KEY.replace(/^"|"$/g, "").replace(/\\n/g, "\n"),
        }),
      });
    }
    ready = true;
  } catch (err) {
    console.error("Firebase Admin init failed:", err);
    initError = `Firebase Admin init failed: ${err.message}`;
    ready = false;
  }
  return ready;
}

/** Non-secret setup status, for /api/cv/health and error messages. */
export function adminStatus() {
  const ok = init();
  return { ok, error: ok ? null : initError, projectId: process.env.FIREBASE_PROJECT_ID || null };
}

export function db() {
  if (!init()) throw new Error(initError || "Server is missing Firebase Admin credentials");
  return getFirestore();
}

/**
 * Who is calling, from the `Authorization: Bearer <Firebase ID token>` header.
 * The uid is never taken from the request body.
 * @returns {Promise<{uid: string, email: string|null, admin: boolean}
 *   | {error: "not_configured"|"no_token"|"invalid_token", detail: string}>}
 */
export async function verifyCaller(req) {
  if (!init()) return { error: "not_configured", detail: initError };
  const match = /^Bearer\s+(.+)$/i.exec(String(req.headers?.authorization || "").trim());
  if (!match) return { error: "no_token", detail: "No sign-in token was sent." };
  try {
    const decoded = await getAuth().verifyIdToken(match[1]);
    return {
      uid: decoded.uid,
      email: decoded.email || null,
      name: decoded.name || null,
      emailVerified: decoded.email_verified === true,
      admin: decoded.admin === true,
    };
  } catch (err) {
    // e.g. "incorrect aud claim" = the service account is for a different
    // Firebase project than the website's login.
    console.error("verifyIdToken failed:", err.code, err.message);
    return { error: "invalid_token", detail: `${err.code || "auth/error"}: ${err.message}` };
  }
}

/** The signed-in user, or null for anything else. */
export async function identify(req) {
  const who = await verifyCaller(req);
  return who.uid ? who : null;
}
