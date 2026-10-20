import { useState } from "react";
import { login } from "../api/auth.js";

function loadSession() {
  return JSON.parse(localStorage.getItem("session") || "null");
}

// The signed-in user and their session token, shared by the whole app.
export function useAuth() {
  const [session, setSession] = useState(loadSession);

  async function signIn(email, password) {
    const result = await login(email, password);
    localStorage.setItem("session", JSON.stringify(result));
    setSession(result);
    return result.user;
  }

  function signOut() {
    localStorage.removeItem("session");
    setSession(null);
  }

  return { user: session?.user || null, token: session?.token || null, signIn, signOut };
}
