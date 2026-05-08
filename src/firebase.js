import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  fetchSignInMethodsForEmail,
  signOut,
  updateProfile,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// ── GOOGLE PROVIDER ──
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });

/** Sign in with Google popup */
export async function signInWithGoogle() {
  const result = await signInWithPopup(auth, googleProvider);
  return result.user;
}

/** Sign up with email/password + send verification email */
export async function signUpWithEmail(email, password, displayName) {
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  if (displayName) {
    await updateProfile(credential.user, { displayName });
  }
  await sendEmailVerification(credential.user, {
    url: `${window.location.origin}/auth?verified=true`,
  });
  return credential.user;
}

/** Sign in with email/password */
export async function signInWithEmail(email, password) {
  const credential = await signInWithEmailAndPassword(auth, email, password);
  return credential.user;
}

/** Resend verification email to current user */
export async function resendVerificationEmail() {
  if (!auth.currentUser) throw new Error("No user signed in");
  await sendEmailVerification(auth.currentUser, {
    url: `${window.location.origin}/auth?verified=true`,
  });
}

/** Send password reset email */
export async function sendResetPasswordEmail(email) {
  await sendPasswordResetEmail(auth, email);
}

/**
 * Check if email already exists in Firebase.
 * Returns array of providers (e.g. ["password"], ["google.com"]) or empty array.
 */
export async function checkEmailExists(email) {
  try {
    const methods = await fetchSignInMethodsForEmail(auth, email);
    return methods;
  } catch {
    return [];
  }
}

/** Sign out */
export async function logOut() {
  await signOut(auth);
}