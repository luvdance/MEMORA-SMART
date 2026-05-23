import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../firebase";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithPopup,
  GoogleAuthProvider,
  fetchSignInMethodsForEmail,
} from "firebase/auth";
import { initUserDoc } from "../utils/userService";

const AuthContext = createContext();

// Google provider — created once
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (u) {
        try {
          // Reload to get fresh emailVerified status
          await u.reload();
          const currentUser = auth.currentUser;

          // Initialize user doc in Firestore (creates it if first login)
          await initUserDoc(currentUser);

          setUser(currentUser);
        } catch (err) {
          console.error("Auth state error:", err);
          setUser(u);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  // ── EMAIL/PASSWORD SIGN UP (with verification email) ──
  const register = async (name, email, password) => {
  const result = await createUserWithEmailAndPassword(auth, email, password);
  if (name) {
    await updateProfile(result.user, { displayName: name });
    await result.user.reload();  // ← ADD: force token refresh
  }
  await sendEmailVerification(result.user, {
    url: `${window.location.origin}/auth?verified=true`,
  });
  return result;
};

  // ── EMAIL/PASSWORD LOGIN ──
  const login = (email, password) =>
    signInWithEmailAndPassword(auth, email, password);

  // ── GOOGLE SIGN IN ──
  const loginWithGoogle = async () => {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  };

  // ── LOGOUT ──
  const logout = () => signOut(auth);

  // ── RESEND VERIFICATION EMAIL ──
  const resendVerification = async () => {
    if (!auth.currentUser) throw new Error("No user signed in");
    await sendEmailVerification(auth.currentUser, {
      url: `${window.location.origin}/auth?verified=true`,
    });
  };

  // ── PASSWORD RESET ──
  const resetPassword = (email) => sendPasswordResetEmail(auth, email);

  // ── CHECK IF EMAIL EXISTS ──
  const checkEmail = async (email) => {
    try {
      const methods = await fetchSignInMethodsForEmail(auth, email);
      return methods;
    } catch {
      return [];
    }
  };

  // ── REFRESH USER (used after email verification) ──
  const refreshUser = async () => {
    if (auth.currentUser) {
      await auth.currentUser.reload();
      setUser(auth.currentUser);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      register,
      login,
      loginWithGoogle,
      logout,
      resendVerification,
      resetPassword,
      checkEmail,
      refreshUser,
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}