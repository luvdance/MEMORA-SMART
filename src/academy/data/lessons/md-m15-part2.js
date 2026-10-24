/**
 * MOBILE APP DEVELOPMENT · MODULE 15 · AUTHENTICATION AND ACCOUNT MANAGEMENT (part 2)
 *
 * Curriculum 15.9 – 15.P: OAuth and third-party sign-in (with PKCE),
 * protecting backend endpoints, keeping users out of each other's records,
 * handling credentials and secrets, and the module practical.
 *
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 */

import { expoLab } from "./md-helpers.js";
import { CLIENT_MODEL, MODULE, SECTION_ID, TOKEN_STORE, call, jsonOf, serverOnly } from "./md-m15-part1.js";

const titled = (title) => `import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "${title}" }} />
    </Stack>
  );
}
`;

/* ── 15.9 · OAuth with PKCE ──────────────────────────────────────────── */
const OAUTH_SERVER = `import { createServer, crypto, tokens } from "practice-server";

// Plays the part of an identity provider ("Kobo ID"), like Google or Apple.
const app = createServer();
const SECRET = "practice-only-secret";
const REDIRECTS = ["kobo://auth"]; // registered for this app
const codes = new Map(); // one-time code → { challenge, redirectUri, user }

const base64url = (hex) =>
  btoa(hex.match(/../g).map((h) => String.fromCharCode(parseInt(h, 16))).join("")).replace(/\\+/g, "-").replace(/\\//g, "_").replace(/=+$/, "");

app.page("/oauth/authorize", ({ query }) => {
  if (!REDIRECTS.includes(query.redirect_uri) || query.code_challenge_method !== "S256" || !query.code_challenge) {
    return { title: "Kobo ID", body: "This sign-in request is not valid.", buttons: [] };
  }
  const issue = (user) => {
    const code = crypto.sha256(String(Math.random())).slice(0, 24);
    codes.set(code, { challenge: query.code_challenge, redirectUri: query.redirect_uri, user });
    return code;
  };
  return {
    title: "Kobo ID",
    body: "Kobo Market wants to sign you in with your Kobo ID.",
    buttons: [
      { label: "Continue as Ada", redirect: query.redirect_uri + "?code=" + issue("Ada") + "&state=" + encodeURIComponent(query.state || "") },
      // What an attacker's page might do: send your app a code it never asked for.
      { label: "Simulate a forged redirect", redirect: query.redirect_uri + "?code=" + issue("Mallory") + "&state=forged" },
    ],
  };
});

// POST /oauth/token { code, code_verifier, redirect_uri } → { accessToken, name }
app.post("/oauth/token", (req, res) => {
  const { code, code_verifier, redirect_uri } = req.body || {};
  const grant = codes.get(code);
  codes.delete(code); // codes work once
  if (!grant || grant.redirectUri !== redirect_uri) return res.status(400).json({ error: "invalid_grant", message: "Unknown or used code" });
  if (base64url(crypto.sha256(String(code_verifier || ""))) !== grant.challenge) return res.status(400).json({ error: "invalid_grant", message: "PKCE verification failed" });
  res.json({ accessToken: tokens.sign({ sub: grant.user }, SECRET, { expiresIn: "15m" }), name: grant.user });
});

export default app;
`;
const OAUTH_START = `import * as Crypto from "expo-crypto";
import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";

const REDIRECT_URI = "kobo://auth";
const AUTHORIZE_URL = "https://api.example.com/oauth/authorize";
const TOKEN_URL = "https://api.example.com/oauth/token";

/** Signs in with Kobo ID (OAuth 2.0 authorization code flow with PKCE). Returns null if the user cancels. */
export async function signInWithKoboId(): Promise<{ name: string; accessToken: string } | null> {
  throw new Error("Not written yet");
}
`;
const OAUTH_MODEL = `import * as Crypto from "expo-crypto";
import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";

const REDIRECT_URI = "kobo://auth";
const AUTHORIZE_URL = "https://api.example.com/oauth/authorize";
const TOKEN_URL = "https://api.example.com/oauth/token";

/** 32 random bytes as hex: unguessable. */
const randomString = () => Array.from(Crypto.getRandomBytes(32), (b) => b.toString(16).padStart(2, "0")).join("");
const base64url = (b64: string) => b64.replace(/\\+/g, "-").replace(/\\//g, "_").replace(/=+$/, "");

/** Signs in with Kobo ID (OAuth 2.0 authorization code flow with PKCE). Returns null if the user cancels. */
export async function signInWithKoboId(): Promise<{ name: string; accessToken: string } | null> {
  // state ties the reply to THIS request; the verifier proves we started it (PKCE).
  const state = randomString();
  const verifier = randomString();
  const challenge = base64url(await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, verifier, { encoding: Crypto.CryptoEncoding.BASE64 }));

  const params = new URLSearchParams({
    client_id: "kobo-market",
    response_type: "code",
    redirect_uri: REDIRECT_URI,
    scope: "profile",
    state,
    code_challenge: challenge,
    code_challenge_method: "S256",
  });
  const result = await WebBrowser.openAuthSessionAsync(AUTHORIZE_URL + "?" + params.toString(), REDIRECT_URI);
  if (result.type !== "success") return null;

  const { queryParams } = Linking.parse(result.url);
  if (!queryParams || queryParams.state !== state || typeof queryParams.code !== "string") {
    throw new Error("Sign-in was interrupted. Please try again.");
  }

  const response = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code: queryParams.code, code_verifier: verifier, redirect_uri: REDIRECT_URI }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message ?? "Sign-in failed");
  return data;
}
`;
const OAUTH_SCREEN = `import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { signInWithKoboId } from "@/auth/oauth";

export default function Welcome() {
  const [name, setName] = useState<string | null>(null);
  const [error, setError] = useState("");
  async function start() {
    setError("");
    try {
      const result = await signInWithKoboId();
      if (result) setName(result.name);
    } catch (e) {
      setError((e as Error).message);
    }
  }
  if (name) return <Text style={{ padding: 24, fontSize: 20 }}>Signed in as {name}</Text>;
  return (
    <View style={{ padding: 24, gap: 12 }}>
      <Pressable accessibilityRole="button" onPress={start} style={{ minHeight: 48, justifyContent: "center", alignItems: "center", borderRadius: 12, borderWidth: 1, borderColor: "#cbd5e1" }}>
        <Text>Continue with Kobo ID</Text>
      </Pressable>
      {error ? <Text accessibilityRole="alert">{error}</Text> : null}
    </View>
  );
}
`;

/* ── 15.10 · Protecting endpoints ────────────────────────────────────── */
const PROTECT_START = `import { createServer, rateLimit, tokens } from "practice-server";

const app = createServer();
const SECRET = "practice-only-secret";
const users = { ada: { banned: false }, mallory: { banned: true } };

// Signing in (for this lab, by name). It should allow at most 5 attempts a minute.
app.post("/auth/login", (req, res) => {
  const name = String(req.body?.name || "");
  if (!users[name]) return res.status(401).json({ message: "Unknown user" });
  res.json({
    accessToken: tokens.sign({ sub: name, typ: "access" }, SECRET, { expiresIn: "15m" }),
    refreshToken: tokens.sign({ sub: name, typ: "refresh" }, SECRET, { expiresIn: "30d" }),
  });
});

// Every route after this needs a valid ACCESS token for a user who isn't banned.
app.use((req, res, next) => {
  const token = (req.headers.authorization || "").replace("Bearer ", "");
  req.user = tokens.decode(token); // reads the token... but doesn't check it
  next();
});

app.get("/orders", (req, res) => res.json({ user: req.user?.sub, orders: ["Ankara tote bag"] }));

export default app;
`;
const PROTECT_MODEL = `import { createServer, rateLimit, tokens } from "practice-server";

const app = createServer();
const SECRET = "practice-only-secret";
const users = { ada: { banned: false }, mallory: { banned: true } };

// Signing in (for this lab, by name). It should allow at most 5 attempts a minute.
app.post("/auth/login", rateLimit({ max: 5, windowSeconds: 60 }), (req, res) => {
  const name = String(req.body?.name || "");
  if (!users[name]) return res.status(401).json({ message: "Unknown user" });
  res.json({
    accessToken: tokens.sign({ sub: name, typ: "access" }, SECRET, { expiresIn: "15m" }),
    refreshToken: tokens.sign({ sub: name, typ: "refresh" }, SECRET, { expiresIn: "30d" }),
  });
});

// Every route after this needs a valid ACCESS token for a user who isn't banned.
app.use((req, res, next) => {
  const header = req.headers.authorization || "";
  if (!header.startsWith("Bearer ")) return res.status(401).json({ message: "Sign in first" });
  let payload;
  try {
    // verify checks the signature AND the expiry; decode checks nothing.
    payload = tokens.verify(header.slice(7), SECRET);
  } catch {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
  // A refresh token must never work as an access token.
  if (payload.typ !== "access") return res.status(401).json({ message: "Invalid or expired token" });
  // The token can outlive the account's good standing: check the user now.
  const user = users[payload.sub];
  if (!user) return res.status(401).json({ message: "Invalid or expired token" });
  if (user.banned) return res.status(403).json({ message: "This account is suspended" });
  req.user = payload;
  next();
});

app.get("/orders", (req, res) => res.json({ user: req.user?.sub, orders: ["Ankara tote bag"] }));

export default app;
`;
const login = (name) => jsonOf(call("POST", "/auth/login", `{ name: '${name}' }`));

/* ── 15.11 · Other users' records ────────────────────────────────────── */
const RECORDS_START = `import { createServer } from "practice-server";

const app = createServer();
const USERS = { "ada-token": "u1", "tunde-token": "u2" };
let orders = [
  { id: "ord_7f3k", userId: "u1", item: "Ankara tote bag", status: "paid", address: "12 Herbert Macaulay Way" },
  { id: "ord_9q2m", userId: "u2", item: "Redmi Note 14", status: "paid", address: "4 Allen Avenue" },
  { id: "ord_4x8p", userId: "u1", item: "Shea butter", status: "shipped", address: "12 Herbert Macaulay Way" },
];

app.use((req, res, next) => {
  req.userId = USERS[(req.headers.authorization || "").replace("Bearer ", "")];
  if (!req.userId) return res.status(401).json({ message: "Sign in first" });
  next();
});

// GET /orders?userId=… → the orders
app.get("/orders", (req, res) => {
  res.json(req.query.userId ? orders.filter((o) => o.userId === req.query.userId) : orders);
});

app.get("/orders/:id", (req, res) => {
  const order = orders.find((o) => o.id === req.params.id);
  if (!order) return res.status(404).json({ message: "Order not found" });
  res.json(order);
});

app.post("/orders/:id/cancel", (req, res) => {
  const order = orders.find((o) => o.id === req.params.id);
  if (!order) return res.status(404).json({ message: "Order not found" });
  if (order.status !== "paid") return res.status(409).json({ message: "This order can no longer be cancelled" });
  order.status = "cancelled";
  res.json(order);
});

export default app;
`;
const RECORDS_MODEL = `import { createServer } from "practice-server";

const app = createServer();
const USERS = { "ada-token": "u1", "tunde-token": "u2" };
let orders = [
  { id: "ord_7f3k", userId: "u1", item: "Ankara tote bag", status: "paid", address: "12 Herbert Macaulay Way" },
  { id: "ord_9q2m", userId: "u2", item: "Redmi Note 14", status: "paid", address: "4 Allen Avenue" },
  { id: "ord_4x8p", userId: "u1", item: "Shea butter", status: "shipped", address: "12 Herbert Macaulay Way" },
];

app.use((req, res, next) => {
  req.userId = USERS[(req.headers.authorization || "").replace("Bearer ", "")];
  if (!req.userId) return res.status(401).json({ message: "Sign in first" });
  next();
});

/** Every lookup is scoped to the signed-in user: someone else's order simply doesn't exist for you. */
const findOwn = (req) => orders.find((o) => o.id === req.params.id && o.userId === req.userId);

// GET /orders?userId=… → the orders
app.get("/orders", (req, res) => {
  // The user comes from the token; a userId in the query is ignored.
  res.json(orders.filter((o) => o.userId === req.userId));
});

app.get("/orders/:id", (req, res) => {
  const order = findOwn(req);
  // 404, not 403: don't even confirm that the order exists.
  if (!order) return res.status(404).json({ message: "Order not found" });
  res.json(order);
});

app.post("/orders/:id/cancel", (req, res) => {
  const order = findOwn(req);
  if (!order) return res.status(404).json({ message: "Order not found" });
  if (order.status !== "paid") return res.status(409).json({ message: "This order can no longer be cancelled" });
  order.status = "cancelled";
  res.json(order);
});

export default app;
`;

/* ── 15.12 · Credentials and secrets ─────────────────────────────────── */
const AUDIT_SERVER = `import { createServer } from "practice-server";

const app = createServer();
// On a real server this comes from an environment variable or a secret manager.
const PAYSTACK_SECRET_KEY = "sk_live_8c1f0e9d2b7a";

app.post("/auth/login", (req, res) => {
  if (req.body?.email !== "ada@example.com" || req.body?.password !== "kobo1234") return res.status(401).json({ message: "Wrong email or password" });
  res.json({ token: "tok_" + Math.random().toString(36).slice(2) });
});

// The app asks YOUR server to verify a payment; only the server holds the secret key.
app.post("/payments/verify", (req, res) => {
  if (!String(req.headers.authorization || "").startsWith("Bearer tok_")) return res.status(401).json({ message: "Sign in first" });
  // (Here the server would call Paystack with PAYSTACK_SECRET_KEY.)
  res.json({ reference: req.body?.reference, status: req.body?.reference ? "success" : "failed" });
});

export default app;
`;
const AUDIT_CONFIG_START = `export const API_URL = "https://api.example.com";

// Used to verify payments directly with Paystack.
export const PAYSTACK_SECRET_KEY = "sk_live_8c1f0e9d2b7a";
`;
const AUDIT_CONFIG_MODEL = `export const API_URL = "https://api.example.com";
`;
const AUDIT_SESSION_START = `import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "@/config";

export async function signIn(email: string, password: string, remember: boolean) {
  const response = await fetch(API_URL + "/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password }) });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  console.log("Signed in with token", data.token);
  await AsyncStorage.setItem("token", data.token);
  if (remember) await AsyncStorage.setItem("saved_login", JSON.stringify({ email, password }));
  return data.token as string;
}

export async function savedLogin(): Promise<{ email: string; password?: string } | null> {
  const raw = await AsyncStorage.getItem("saved_login");
  return raw ? JSON.parse(raw) : null;
}

export const getToken = () => AsyncStorage.getItem("token");
`;
const AUDIT_SESSION_MODEL = `import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import { API_URL } from "@/config";

export async function signIn(email: string, password: string, remember: boolean) {
  const response = await fetch(API_URL + "/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password }) });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  // Tokens are credentials: encrypted storage, and never in logs.
  await SecureStore.setItemAsync("token", data.token);
  // Remember the e-mail only. Passwords are never stored: the token is what keeps the user signed in.
  if (remember) await AsyncStorage.setItem("saved_login", JSON.stringify({ email }));
  else await AsyncStorage.removeItem("saved_login");
  return data.token as string;
}

export async function savedLogin(): Promise<{ email: string; password?: string } | null> {
  const raw = await AsyncStorage.getItem("saved_login");
  return raw ? JSON.parse(raw) : null;
}

export const getToken = () => SecureStore.getItemAsync("token");
`;
const AUDIT_PAY_START = `import { API_URL, PAYSTACK_SECRET_KEY } from "@/config";
import { getToken } from "@/auth/session";

/** Confirms that a payment really went through. */
export async function verifyPayment(reference: string): Promise<boolean> {
  const response = await fetch("https://api.paystack.co/transaction/verify/" + reference, {
    headers: { Authorization: "Bearer " + PAYSTACK_SECRET_KEY },
  });
  const data = await response.json();
  return data?.data?.status === "success";
}
`;
const AUDIT_PAY_MODEL = `import { API_URL } from "@/config";
import { getToken } from "@/auth/session";

/** Confirms that a payment really went through, by asking our own server (which holds the secret key). */
export async function verifyPayment(reference: string): Promise<boolean> {
  const response = await fetch(API_URL + "/payments/verify", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: "Bearer " + (await getToken()) },
    body: JSON.stringify({ reference }),
  });
  const data = await response.json();
  return response.ok && data.status === "success";
}
`;
const AUDIT_SCREEN = `import { useEffect, useState } from "react";
import { Pressable, Switch, Text, TextInput, View } from "react-native";
import { savedLogin, signIn } from "@/auth/session";
import { verifyPayment } from "@/services/payments";

export default function Checkout() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [status, setStatus] = useState("");
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    savedLogin().then((s) => {
      if (s) {
        setEmail(s.email);
        if (s.password) setPassword(s.password);
      }
    });
  }, []);

  async function go() {
    try {
      await signIn(email, password, remember);
      setPassword("");
      setSignedIn(true);
    } catch (e) {
      setStatus((e as Error).message);
    }
  }

  if (signedIn) {
    return (
      <View style={{ padding: 20, gap: 12 }}>
        <Pressable accessibilityRole="button" onPress={async () => setStatus((await verifyPayment("ref_123")) ? "Payment confirmed" : "Payment not confirmed")} style={{ minHeight: 48, justifyContent: "center" }}>
          <Text>Confirm payment</Text>
        </Pressable>
        <Text testID="status">{status}</Text>
      </View>
    );
  }
  return (
    <View style={{ padding: 20, gap: 10 }}>
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} autoCapitalize="none" style={{ minHeight: 48, borderWidth: 1, borderColor: "#cbd5e1", borderRadius: 10, paddingHorizontal: 12 }} />
      <TextInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry style={{ minHeight: 48, borderWidth: 1, borderColor: "#cbd5e1", borderRadius: 10, paddingHorizontal: 12 }} />
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Text style={{ flex: 1 }}>Remember me</Text>
        <Switch accessibilityLabel="Remember me" value={remember} onValueChange={setRemember} />
      </View>
      <Pressable accessibilityRole="button" onPress={go} style={{ minHeight: 48, justifyContent: "center" }}><Text>Sign in</Text></Pressable>
      {status ? <Text>{status}</Text> : null}
    </View>
  );
}
`;

/* ── 15.P · The practical ────────────────────────────────────────────── */
const P_SERVER = `import { createServer, crypto, now, passwords, tokens } from "practice-server";

// The account backend, complete. Read it before you build the app.
const app = createServer();
const SECRET = "practice-only-secret";
const users = [];
const notes = [];
const refreshTokens = new Map(); // hash → { userId, expires }
let nextNote = 1;

function issue(userId) {
  const refreshToken = crypto.sha256(String(Math.random()) + now());
  refreshTokens.set(crypto.sha256(refreshToken), { userId, expires: now() + 30 * 86400000 });
  return { accessToken: tokens.sign({ sub: userId, typ: "access" }, SECRET, { expiresIn: "15m" }), refreshToken };
}
const publicUser = (u) => ({ id: u.id, name: u.name, email: u.email, avatarUrl: u.avatarUrl || null });

// POST /auth/register { name, email, password } → 201 { accessToken, refreshToken }  (409 if the e-mail is taken)
app.post("/auth/register", (req, res) => {
  const email = String(req.body?.email || "").trim().toLowerCase();
  const name = String(req.body?.name || "").trim();
  if (!name || !/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email) || String(req.body?.password || "").length < 8) return res.status(400).json({ message: "Check your details" });
  if (users.some((u) => u.email === email)) return res.status(409).json({ message: "An account with this email already exists" });
  const user = { id: "u" + (users.length + 1), name, email, hash: passwords.hash(req.body.password) };
  users.push(user);
  res.status(201).json(issue(user.id));
});

// POST /auth/login { email, password } → { accessToken, refreshToken }
app.post("/auth/login", (req, res) => {
  const user = users.find((u) => u.email === String(req.body?.email || "").trim().toLowerCase());
  if (!user || !passwords.verify(String(req.body?.password || ""), user.hash)) return res.status(401).json({ message: "Wrong email or password" });
  res.json(issue(user.id));
});

// POST /auth/refresh { refreshToken } → a new pair (the old refresh token stops working)
app.post("/auth/refresh", (req, res) => {
  const key = crypto.sha256(String(req.body?.refreshToken || ""));
  const rec = refreshTokens.get(key);
  if (!rec || now() > rec.expires) return res.status(401).json({ message: "Please sign in again" });
  refreshTokens.delete(key);
  res.json(issue(rec.userId));
});

// POST /auth/logout { refreshToken } → 204
app.post("/auth/logout", (req, res) => {
  refreshTokens.delete(crypto.sha256(String(req.body?.refreshToken || "")));
  res.status(204).end();
});

// Everything below needs an access token.
app.use((req, res, next) => {
  try {
    const p = tokens.verify((req.headers.authorization || "").replace("Bearer ", ""), SECRET);
    if (p.typ !== "access") throw new Error();
    req.user = users.find((u) => u.id === p.sub);
    if (!req.user) throw new Error();
    next();
  } catch {
    res.status(401).json({ message: "Token expired or invalid" });
  }
});

app.get("/me", (req, res) => res.json(publicUser(req.user)));

// PATCH /me { name } → the updated profile
app.patch("/me", (req, res) => {
  const name = String(req.body?.name || "").trim();
  if (!name) return res.status(400).json({ message: "Enter your name" });
  req.user.name = name;
  res.json(publicUser(req.user));
});

// POST /me/avatar, multipart with an "avatar" image → the updated profile
app.post("/me/avatar", (req, res) => {
  const file = (req.files || [])[0];
  if (!file || !["image/jpeg", "image/png"].includes(file.type)) return res.status(415).json({ message: "Choose a JPEG or PNG photo" });
  req.user.avatarUrl = file.url;
  res.json(publicUser(req.user));
});

// The user's own notes only.
app.get("/notes", (req, res) => res.json(notes.filter((n) => n.userId === req.user.id).map(({ userId, ...n }) => n)));
app.post("/notes", (req, res) => {
  const text = String(req.body?.text || "").trim();
  if (!text) return res.status(400).json({ message: "Write something first" });
  const note = { id: String(nextNote++), userId: req.user.id, text };
  notes.unshift(note);
  res.status(201).json({ id: note.id, text });
});
app.delete("/notes/:id", (req, res) => {
  const i = notes.findIndex((n) => n.id === req.params.id && n.userId === req.user.id);
  if (i < 0) return res.status(404).json({ message: "Note not found" });
  notes.splice(i, 1);
  res.status(204).end();
});

export default app;
`;
const P_MODEL = {
  "src/auth/tokenStorage.ts": TOKEN_STORE,
  "src/auth/client.ts": CLIENT_MODEL,
  "src/context/session.tsx": `import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { onSignedOut } from "@/auth/client";
import { clearTokens, getTokens, saveTokens } from "@/auth/tokenStorage";

type Value = {
  signedIn: boolean;
  restoring: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const SessionContext = createContext<Value | null>(null);

async function post(path: string, body: unknown) {
  const response = await fetch("https://api.example.com" + path, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  if (response.status === 204) return null;
  const data = await response.json();
  if (!response.ok) throw new Error(data.message ?? "Something went wrong");
  return data;
}

export function SessionProvider({ children }: { children: ReactNode }) {
  const [signedIn, setSignedIn] = useState(false);
  const [restoring, setRestoring] = useState(true);

  useEffect(() => {
    onSignedOut(() => setSignedIn(false));
    getTokens()
      .then((t) => setSignedIn(!!t.refreshToken))
      .finally(() => setRestoring(false));
  }, []);

  const value: Value = {
    signedIn,
    restoring,
    signIn: async (email, password) => {
      await saveTokens(await post("/auth/login", { email, password }));
      setSignedIn(true);
    },
    signUp: async (name, email, password) => {
      await saveTokens(await post("/auth/register", { name, email, password }));
      setSignedIn(true);
    },
    signOut: async () => {
      const { refreshToken } = await getTokens();
      // Revoke on the server, but sign out locally even if that fails (offline).
      await post("/auth/logout", { refreshToken }).catch(() => {});
      await clearTokens();
      setSignedIn(false);
    },
  };
  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const value = useContext(SessionContext);
  if (!value) throw new Error("useSession must be used inside <SessionProvider>");
  return value;
}
`,
  "src/app/_layout.tsx": `import { SplashScreen, Stack } from "expo-router";
import { useEffect } from "react";
import { SessionProvider, useSession } from "@/context/session";

SplashScreen.preventAutoHideAsync();

function RootNavigator() {
  const { signedIn, restoring } = useSession();
  useEffect(() => {
    if (!restoring) SplashScreen.hideAsync();
  }, [restoring]);
  if (restoring) return null;
  return (
    <Stack>
      <Stack.Protected guard={signedIn}>
        <Stack.Screen name="index" options={{ title: "My notes" }} />
        <Stack.Screen name="profile" options={{ title: "Profile" }} />
      </Stack.Protected>
      <Stack.Protected guard={!signedIn}>
        <Stack.Screen name="sign-in" options={{ title: "Sign in" }} />
        <Stack.Screen name="sign-up" options={{ title: "Create an account" }} />
      </Stack.Protected>
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <SessionProvider>
      <RootNavigator />
    </SessionProvider>
  );
}
`,
  "src/app/sign-in.tsx": `import { Link } from "expo-router";
import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { useSession } from "@/context/session";

export default function SignIn() {
  const { signIn } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  return (
    <View style={{ padding: 20, gap: 10 }}>
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" autoComplete="email" style={{ minHeight: 48, borderWidth: 1, borderColor: "#cbd5e1", borderRadius: 10, paddingHorizontal: 12 }} />
      <TextInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry autoComplete="current-password" style={{ minHeight: 48, borderWidth: 1, borderColor: "#cbd5e1", borderRadius: 10, paddingHorizontal: 12 }} />
      {error ? <Text accessibilityRole="alert">{error}</Text> : null}
      <Pressable accessibilityRole="button" onPress={() => signIn(email.trim(), password).catch((e: Error) => setError(e.message))} style={{ minHeight: 48, justifyContent: "center" }}>
        <Text>Sign in</Text>
      </Pressable>
      <Link href="/sign-up" style={{ paddingVertical: 12, color: "#0f766e" }}>Create an account</Link>
    </View>
  );
}
`,
  "src/app/sign-up.tsx": `import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { useSession } from "@/context/session";

export default function SignUp() {
  const { signUp } = useSession();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const field = { minHeight: 48, borderWidth: 1, borderColor: "#cbd5e1", borderRadius: 10, paddingHorizontal: 12 } as const;
  return (
    <View style={{ padding: 20, gap: 10 }}>
      <TextInput placeholder="Name" value={name} onChangeText={setName} style={field} />
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" style={field} />
      <TextInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry autoComplete="new-password" style={field} />
      {error ? <Text accessibilityRole="alert">{error}</Text> : null}
      <Pressable accessibilityRole="button" onPress={() => signUp(name.trim(), email.trim(), password).catch((e: Error) => setError(e.message))} style={{ minHeight: 48, justifyContent: "center" }}>
        <Text>Create account</Text>
      </Pressable>
    </View>
  );
}
`,
  "src/app/index.tsx": `import { Link, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { apiFetch } from "@/auth/client";

type Note = { id: string; text: string };

export default function Notes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [text, setText] = useState("");
  const [error, setError] = useState("");

  const load = useCallback(() => {
    apiFetch("/notes").then(async (r) => r.ok && setNotes(await r.json()));
  }, []);
  useFocusEffect(load);

  async function add() {
    setError("");
    const r = await apiFetch("/notes", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ text }) });
    if (!r.ok) return setError((await r.json()).message);
    setText("");
    load();
  }

  async function remove(id: string) {
    await apiFetch("/notes/" + id, { method: "DELETE" });
    load();
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 10 }}>
      <Link href="/profile" style={{ color: "#0f766e", paddingVertical: 8 }}>Profile</Link>
      <TextInput placeholder="New note" value={text} onChangeText={setText} style={{ minHeight: 48, borderWidth: 1, borderColor: "#cbd5e1", borderRadius: 10, paddingHorizontal: 12 }} />
      <Pressable accessibilityRole="button" onPress={add} style={{ minHeight: 48, justifyContent: "center" }}><Text>Add note</Text></Pressable>
      {error ? <Text accessibilityRole="alert">{error}</Text> : null}
      {notes.length === 0 ? <Text>No notes yet</Text> : null}
      {notes.map((n) => (
        <View key={n.id} style={{ flexDirection: "row", alignItems: "center" }}>
          <Text testID="note" style={{ flex: 1 }}>{n.text}</Text>
          <Pressable accessibilityRole="button" accessibilityLabel={"Delete " + n.text} onPress={() => remove(n.id)} style={{ width: 44, height: 44, justifyContent: "center", alignItems: "center" }}><Text>✕</Text></Pressable>
        </View>
      ))}
    </ScrollView>
  );
}
`,
  "src/app/profile.tsx": `import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { useEffect, useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { apiFetch } from "@/auth/client";
import { useSession } from "@/context/session";

type Profile = { name: string; email: string; avatarUrl: string | null };

export default function ProfileScreen() {
  const { signOut } = useSession();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [name, setName] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    apiFetch("/me").then(async (r) => {
      if (!r.ok) return;
      const p: Profile = await r.json();
      setProfile(p);
      setName(p.name);
    });
  }, []);

  async function save() {
    const r = await apiFetch("/me", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name }) });
    const data = await r.json();
    if (r.ok) setProfile(data);
    setStatus(r.ok ? "Saved" : data.message);
  }

  async function changePhoto() {
    const picked = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ["images"], quality: 0.6 });
    if (picked.canceled) return;
    const a = picked.assets[0];
    const form = new FormData();
    form.append("avatar", { uri: a.uri, name: a.fileName ?? "avatar.jpg", type: a.mimeType ?? "image/jpeg" } as unknown as Blob);
    const r = await apiFetch("/me/avatar", { method: "POST", body: form });
    const data = await r.json();
    if (r.ok) setProfile(data);
    setStatus(r.ok ? "Photo updated" : data.message);
  }

  return (
    <View style={{ padding: 20, gap: 10 }}>
      {profile?.avatarUrl ? <Image source={{ uri: profile.avatarUrl }} style={{ width: 96, height: 96, borderRadius: 48 }} accessibilityLabel="Profile photo" /> : null}
      <Text>{profile?.email}</Text>
      <TextInput placeholder="Name" value={name} onChangeText={setName} style={{ minHeight: 48, borderWidth: 1, borderColor: "#cbd5e1", borderRadius: 10, paddingHorizontal: 12 }} />
      <Pressable accessibilityRole="button" onPress={save} style={{ minHeight: 48, justifyContent: "center" }}><Text>Save</Text></Pressable>
      <Pressable accessibilityRole="button" onPress={changePhoto} style={{ minHeight: 48, justifyContent: "center" }}><Text>Change photo</Text></Pressable>
      <Pressable accessibilityRole="button" onPress={signOut} style={{ minHeight: 48, justifyContent: "center" }}><Text>Sign out</Text></Pressable>
      {status ? <Text testID="status">{status}</Text> : null}
    </View>
  );
}
`,
};
const signUpVia = (name, email) =>
  `await waitFor(() => has('Create an account'), 3000); await press('Create an account'); await waitFor(() => exists({ placeholder: 'Name' }), 3000); await typeInto('Name', '${name}'); await typeInto('Email', '${email}'); await typeInto('Password', 'kobo12345'); await press('Create account'); await waitFor(() => has('Add note'), 3000);`;

export const PART2 = [
  /* ═══════════════ LESSON 95 · 15.9 – 15.10 ═══════════════ */
  {
    id: "md-l95-oauth-protect",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 5,
    covers: ["15.9", "15.10"],
    title: "Third-Party Sign-In, and Protecting Endpoints",
    subtitle: "Signing in with Google or Apple safely, and checking every token properly",
    estimatedMinutes: 60,
    intro: "\"Continue with Google\" and \"Sign in with Apple\" save users from yet another password. Underneath is OAuth, and getting it right takes care. So does checking tokens on the server.",
    atoms: [
      {
        id: "a-md-oauth",
        title: "OAuth and third-party sign-in",
        explain:
          "OAUTH 2.0 / OPENID CONNECT lets an identity provider (Google, Apple, Microsoft, GitHub) sign the user in. A mobile app uses the AUTHORIZATION CODE FLOW WITH PKCE: (1) make a random state and a random code_verifier, and send code_challenge = base64url(SHA-256(verifier)); (2) open the provider's page in a secure system browser session (expo-web-browser's openAuthSessionAsync; expo-auth-session wraps all of this); (3) the provider redirects back to your app's redirect URI with a one-time code and the state; (4) check the state matches (otherwise the reply wasn't for your request); (5) exchange the code AND the verifier for tokens, so a code intercepted by another app is useless. Never embed the provider's page in a WebView (you could read the password) and never ship a client secret in the app. Native SDKs (@react-native-google-signin/google-signin, expo-apple-authentication) give the smoothest experience and need a development build. Apple asks apps that offer third-party sign-in to also offer an option that limits data collection, such as Sign in with Apple.",
        webLab: expoLab({
          name: "Kobo",
          layout: titled("Welcome"),
          app: { scheme: "kobo" },
          task:
            "Write signInWithKoboId() in src/auth/oauth.ts: make a random state and code verifier (expo-crypto's getRandomBytes), a code challenge (SHA-256 of the verifier, base64url-encoded), and open https://api.example.com/oauth/authorize with client_id \"kobo-market\", response_type \"code\", redirect_uri \"kobo://auth\", state, code_challenge and code_challenge_method \"S256\" in openAuthSessionAsync; return null if the user cancels; throw \"Sign-in was interrupted. Please try again.\" if the state that comes back is different; otherwise POST the code, the code_verifier and the redirect_uri to https://api.example.com/oauth/token and return { name, accessToken }.",
          files: { "src/auth/oauth.ts": OAUTH_START, "src/app/index.tsx": OAUTH_SCREEN, "server/index.js": OAUTH_SERVER },
          readOnly: ["src/app/index.tsx", "server/index.js"],
          solution: { "src/auth/oauth.ts": OAUTH_MODEL },
          tests: [
            { label: "Signing in with Kobo ID works, with PKCE", check: "await press('Continue with Kobo ID'); await tap('Continue as Ada'); await waitFor(() => has('Signed in as Ada'), 3000); const url = new URL(browser().pop()); const q = url.searchParams; return q.get('code_challenge_method') === 'S256' && q.get('code_challenge').length >= 43 && q.get('state').length >= 16 && q.get('redirect_uri') === 'kobo://auth' && !url.href.includes('verifier');", fail: "Send the challenge (never the verifier) and S256; exchange code + verifier." },
            { label: "Cancelling is not an error", check: "await restart(); await waitFor(() => has('Continue with Kobo ID'), 3000); await press('Continue with Kobo ID'); await cancel(); await wait(300); return has('Continue with Kobo ID') && !exists({ role: 'alert' });", fail: "if (result.type !== \"success\") return null;" },
            { label: "A forged reply is refused before any token is requested", check: "await restart(); await waitFor(() => has('Continue with Kobo ID'), 3000); const before = serverRequests().filter((r) => r.path === '/oauth/token').length; await press('Continue with Kobo ID'); await tap('Simulate a forged redirect'); await waitFor(() => has('Sign-in was interrupted. Please try again.'), 3000); return serverRequests().filter((r) => r.path === '/oauth/token').length === before;", fail: "Compare the returned state with yours before exchanging the code." },
          ],
          hint: "Linking.parse(result.url).queryParams gives code and state.",
          successMessage: "A by-the-book OAuth sign-in: system browser, state check and PKCE.",
        }),
      },
      {
        id: "a-md-protect-endpoints",
        title: "Protecting backend endpoints",
        explain:
          "Every protected endpoint must check, on every request: the Authorization header is present (401); the token's SIGNATURE is valid and it hasn't EXPIRED (use your library's verify, never decode, which reads a token without checking it, so anyone could write their own); it is the right KIND of token (an access token, not a refresh or e-mail token: a typ claim); and the user still exists and is allowed in (deleted, banned or suspended accounts: 401 or 403). Put this in ONE middleware in front of every private route. Then: rate-limit sign-in and other sensitive endpoints, validate every input, use HTTPS everywhere, and return errors that help users without helping attackers (no stack traces).",
        webLab: expoLab({
          name: "Kobo",
          layout: null,
          task:
            "Fix the middleware in server/index.js: 401 \"Sign in first\" without a Bearer token; 401 \"Invalid or expired token\" when tokens.verify fails, when the token's typ isn't \"access\", or when the user doesn't exist; 403 \"This account is suspended\" for banned users; otherwise set req.user and continue. Also limit POST /auth/login to 5 attempts a minute with rateLimit.",
          files: { "server/index.js": PROTECT_START, "src/app/index.tsx": serverOnly },
          readOnly: ["src/app/index.tsx"],
          solution: { "server/index.js": PROTECT_MODEL },
          tests: [
            { label: "A valid access token works; none at all doesn't", check: `const { accessToken } = ${login("ada")}; const ok = ${call("GET", "/orders", null, "accessToken")}; const none = ${call("GET", "/orders")}; return ok.status === 200 && (await ok.json()).user === 'ada' && none.status === 401;`, fail: "Check the header, then tokens.verify." },
            { label: "Forged, expired and wrong-kind tokens are refused", check: `const { accessToken, refreshToken } = ${login("ada")}; const [h, , s] = accessToken.split('.'); const fake = h + '.' + btoa(JSON.stringify({ sub: 'ada', typ: 'access', exp: 9999999999 })).replace(/=+$/, '') + '.' + s; const forged = ${call("GET", "/orders", null, "fake")}; const refresh = ${call("GET", "/orders", null, "refreshToken")}; await advance(16 * 60); const expired = ${call("GET", "/orders", null, "accessToken")}; return forged.status === 401 && refresh.status === 401 && expired.status === 401 && (await expired.json()).message === 'Invalid or expired token';`, fail: "verify (not decode), and payload.typ === \"access\"." },
            { label: "Suspended accounts are shut out", check: `const { accessToken } = ${login("mallory")}; const r = ${call("GET", "/orders", null, "accessToken")}; return r.status === 403 && (await r.json()).message === 'This account is suspended';`, fail: "Look the user up on every request." },
            { label: "Sign-in attempts are rate-limited", check: `const codes = []; for (let i = 0; i < 7; i++) codes.push((${call("POST", "/auth/login", "{ name: 'nobody' }")}).status); const first = codes.indexOf(429); return first > 0 && first <= 5 && codes.slice(0, first).every((c) => c === 401) && codes.slice(first).every((c) => c === 429);`, fail: "app.post(\"/auth/login\", rateLimit({ max: 5, windowSeconds: 60 }), handler)" },
          ],
          hint: "tokens.decode is for reading a token you already trust; tokens.verify is for checking one.",
          successMessage: "One middleware checks every token properly, and sign-in can't be hammered.",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════ LESSON 96 · 15.11 – 15.12 ═══════════════ */
  {
    id: "md-l96-records-secrets",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 6,
    covers: ["15.11", "15.12"],
    title: "Other People's Data, and Your App's Secrets",
    subtitle: "The two mistakes behind most mobile app breaches",
    estimatedMinutes: 55,
    intro: "Most data leaks don't need clever hacking: an endpoint that returns anyone's records, or a secret key sitting inside an app anyone can download.",
    atoms: [
      {
        id: "a-md-own-records",
        title: "Preventing users from accessing another user's records",
        explain:
          "Signing users in is not enough: every query must be SCOPED to what the user may see. Take the user from the verified token and filter by it (WHERE user_id = ?), never from a parameter the client sends (?userId=). For a single record, look it up by id AND owner together; if it isn't theirs, answer 404 Not Found rather than 403, so you don't even confirm it exists. Apply the same rule to every action on the record (update, cancel, download an invoice), and to nested resources. Random, non-sequential ids (ord_7f3k) make guessing harder but are NOT protection by themselves. Test it the attacker's way: sign in as one user and request another user's ids.",
        webLab: expoLab({
          name: "Kobo",
          layout: null,
          task:
            "In server/index.js, scope everything to the signed-in user: GET /orders returns only their orders (ignore any userId in the query); GET /orders/:id and POST /orders/:id/cancel find the order by id AND owner, answering 404 \"Order not found\" for anyone else's order.",
          files: { "server/index.js": RECORDS_START, "src/app/index.tsx": serverOnly },
          readOnly: ["src/app/index.tsx"],
          solution: { "server/index.js": RECORDS_MODEL },
          tests: [
            { label: "The list shows only your own orders, whatever the query says", check: `const a = ${jsonOf(call("GET", "/orders", null, "'ada-token'"))}; const b = ${jsonOf(call("GET", "/orders?userId=u2", null, "'ada-token'"))}; return a.length === 2 && a.every((o) => o.userId === 'u1') && b.length === 2 && b.every((o) => o.userId === 'u1');`, fail: "orders.filter((o) => o.userId === req.userId)" },
            { label: "Someone else's order is \"not found\"", check: `const r = ${call("GET", "/orders/ord_9q2m", null, "'ada-token'")}; const own = ${call("GET", "/orders/ord_9q2m", null, "'tunde-token'")}; return r.status === 404 && (await r.json()).message === 'Order not found' && own.status === 200;`, fail: "Find by id and owner; 404 otherwise." },
            { label: "And can't be cancelled", check: `const r = ${call("POST", "/orders/ord_9q2m/cancel", null, "'ada-token'")}; const check = ${jsonOf(call("GET", "/orders/ord_9q2m", null, "'tunde-token'"))}; const mine = ${call("POST", "/orders/ord_7f3k/cancel", null, "'ada-token'")}; return r.status === 404 && check.status === 'paid' && mine.status === 200;`, fail: "Use the same scoped lookup for every action." },
          ],
          hint: "One helper, findOwn(req), used by every route that takes an id.",
          successMessage: "No user can see or change another user's records, however they craft the request.",
        }),
      },
      {
        id: "a-md-credentials-secrets",
        title: "Secure handling of credentials and secrets",
        explain:
          "An app's bundle can be unpacked by anyone who downloads it, and its traffic inspected on a phone they control. So: SECRETS (payment secret keys, database passwords, admin or service-role keys, signing keys) never go in the app or its EXPO_PUBLIC_ variables; the app calls YOUR server, which holds them (in environment variables or a secret manager, not in Git). CREDENTIALS on the phone: tokens in SecureStore, never AsyncStorage; NEVER store the user's password (\"remember me\" means remembering the e-mail and keeping the token); clear password fields from state after use. Never LOG tokens or passwords (logs end up in crash reports and analytics). Use HTTPS only. If a secret ever ships or is committed, assume it is leaked: rotate it.",
        webLab: expoLab({
          name: "Kobo",
          layout: titled("Checkout"),
          task:
            "Audit and fix the app: (1) remove the payment provider's secret key from src/config.ts and make verifyPayment ask our server instead (POST https://api.example.com/payments/verify with { reference } and the Bearer token; it answers { status }); (2) in src/auth/session.ts, keep the token in SecureStore (key \"token\") instead of AsyncStorage, and stop logging it; (3) \"Remember me\" must remember the e-mail only, never the password. Sign in with ada@example.com / kobo1234.",
          files: {
            "src/config.ts": AUDIT_CONFIG_START,
            "src/auth/session.ts": AUDIT_SESSION_START,
            "src/services/payments.ts": AUDIT_PAY_START,
            "src/app/index.tsx": AUDIT_SCREEN,
            "server/index.js": AUDIT_SERVER,
          },
          readOnly: ["src/app/index.tsx", "server/index.js"],
          solution: { "src/config.ts": AUDIT_CONFIG_MODEL, "src/auth/session.ts": AUDIT_SESSION_MODEL, "src/services/payments.ts": AUDIT_PAY_MODEL },
          tests: [
            { label: "Signing in keeps the token encrypted and out of the logs", check: "await typeInto('Email', 'ada@example.com'); await typeInto('Password', 'kobo1234'); await press('Sign in'); await waitFor(() => has('Confirm payment'), 3000); const t = secureStore().token; return typeof t === 'string' && t.startsWith('tok_') && !JSON.stringify(asyncStore()).includes(t) && !logs().some((l) => l.includes(t));", fail: "SecureStore.setItemAsync(\"token\", …), and no console.log of it." },
            { label: "The password is never stored", check: "return !JSON.stringify(asyncStore()).includes('kobo1234') && !JSON.stringify(secureStore()).includes('kobo1234') && JSON.parse(asyncStore().saved_login).email === 'ada@example.com';", fail: "Save { email } only." },
            { label: "Payments are verified by our server; no secret in the app", check: "await press('Confirm payment'); await waitFor(() => has('Payment confirmed'), 3000); const src = files().filter((f) => f.startsWith('src/')).map((f) => code(f)).join(' '); return !src.includes('sk_live') && !src.includes('api.paystack.co') && serverRequests().some((r) => r.path === '/payments/verify' && /^Bearer tok_/.test(r.headers.authorization || ''));", fail: "POST /payments/verify on our server, with the token; delete the secret key." },
          ],
          hint: "Search the src folder for sk_live, console.log and AsyncStorage.",
          successMessage: "No secrets in the bundle, credentials encrypted, nothing sensitive logged or kept.",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════ LESSON 97 · 15.P ═══════════════ */
  {
    id: "md-l97-m15-project",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 7,
    covers: ["15.P"],
    title: "Practical: An Account-Based App",
    subtitle: "Registration, login, sessions that last, a profile with a photo, and private records",
    estimatedMinutes: 150,
    intro: "Everything from this module, from the user's side: an app that signs people up, keeps them signed in safely, and keeps their data theirs.",
    atoms: [
      {
        id: "a-md-m15-project",
        title: "Build the account app",
        explain:
          "The backend is complete in server/index.js: registration, login, rotating refresh tokens, logout, the profile (with an avatar upload) and the user's own notes. Read it first, then build the app.",
        webLab: expoLab({
          name: "Kobo Notes",
          layout: null,
          app: { plugins: [["expo-splash-screen", { image: "./assets/images/splash-icon.png", imageWidth: 200, resizeMode: "contain", backgroundColor: "#ffffff" }]] },
          task:
            "Build: tokens in SecureStore (src/auth/tokenStorage.ts) and an apiFetch that renews expired access tokens once (src/auth/client.ts); a session provider (restoring, signIn, signUp, signOut, which revokes the refresh token on the server, then clears the tokens). Screens (root Stack with Stack.Protected, splash screen until restored): sign-in (Email, Password, \"Sign in\", a \"Create an account\" link) and sign-up (Name, Email, Password, \"Create account\"), showing server errors with accessibilityRole \"alert\"; index (\"My notes\": a \"Profile\" link, a \"New note\" input, \"Add note\", the notes (testID \"note\") each with \"Delete <text>\", \"No notes yet\" when empty); profile (the e-mail, a \"Name\" field with \"Save\", \"Change photo\" uploading the \"avatar\" field, the photo (accessibilityLabel \"Profile photo\"), and \"Sign out\").",
          files: {
            "src/app/_layout.tsx": "// The root layout.\n",
            "src/app/sign-in.tsx": "// Sign in.\n",
            "src/app/sign-up.tsx": "// Create an account.\n",
            "src/app/index.tsx": "// My notes.\n",
            "src/app/profile.tsx": "// Profile.\n",
            "src/auth/tokenStorage.ts": "",
            "src/auth/client.ts": "",
            "src/context/session.tsx": "",
            "server/index.js": P_SERVER,
          },
          readOnly: ["server/index.js"],
          revealSolution: false,
          solution: P_MODEL,
          tests: [
            { label: "Signing up opens an empty notes screen", check: `${signUpVia("Ada", "ada@example.com")} return has('No notes yet') && !canGoBack() && typeof secureStore().refresh_token === 'string';`, fail: "signUp saves the tokens; the guards open the notes screen." },
            { label: "Notes are added and deleted", check: "await waitFor(() => has('Add note'), 3000); await typeInto('New note', 'Call the tailor'); await press('Add note'); await waitFor(() => has('Call the tailor'), 3000); await typeInto('New note', 'Buy thread'); await press('Add note'); await waitFor(() => findAll({ testID: 'note' }).length === 2, 3000); await press({ role: 'button', name: 'Delete Buy thread' }); await waitFor(() => findAll({ testID: 'note' }).length === 1, 3000); return true;", fail: "POST /notes and DELETE /notes/:id with apiFetch, then reload." },
            { label: "The profile can be renamed and given a photo", check: "await waitFor(() => has('Profile'), 3000); await press('Profile'); await waitFor(() => hasText('ada@example.com'), 3000); await typeInto('Name', 'Ada Obi'); await press('Save'); await waitFor(() => has('Saved'), 3000); await press('Change photo'); await pickPhoto(1); await waitFor(() => exists({ label: 'Profile photo' }), 3000); return serverRequests().some((r) => r.method === 'PATCH' && r.path === '/me' && r.body.name === 'Ada Obi');", fail: "PATCH /me { name }, and POST /me/avatar as multipart." },
            { label: "Reopening the app keeps the user signed in, even after the access token expires", check: "await restart(); await waitFor(() => has('Add note'), 4000); await advance(16 * 60); await typeInto('New note', 'Pay rent'); await press('Add note'); await waitFor(() => has('Pay rent'), 4000); return serverRequests().some((r) => r.path === '/auth/refresh');", fail: "Restore from SecureStore; apiFetch renews on 401." },
            { label: "Signing out revokes the session, and the next user sees only their own notes", check: "await waitFor(() => has('Profile'), 3000); await press('Profile'); await waitFor(() => has('Sign out'), 3000); const rt = secureStore().refresh_token; await press('Sign out'); await waitFor(() => has('Create an account'), 3000); const reuse = await fetch('https://api.example.com/auth/refresh', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ refreshToken: rt }) }); " + signUpVia("Tunde", "tunde@example.com") + " return reuse.status === 401 && !('refresh_token' in secureStore() && secureStore().refresh_token === rt) && has('No notes yet');", fail: "signOut: POST /auth/logout { refreshToken }, then clear the tokens." },
          ],
          hint: "Reuse what you built this module: the client from Lesson 93 and the layout from Lesson 92.",
          successMessage: "A complete account system on the phone: signed in for months, safely, with data that stays private.",
        }),
      },
    ],
    task: {
      title: "Module 15 practical: accounts in your own app",
      intro: "Apply this module to the app you are building.",
      prompts: [
        "Add registration with e-mail verification, sign-in, and password reset, using your own server or a provider (Supabase Auth, Firebase Auth, Clerk).",
        "Use short-lived access tokens with rotating refresh tokens kept in SecureStore, and handle expired sessions gracefully.",
        "Add at least one third-party sign-in (Google, or Sign in with Apple on iOS) in a development build.",
        "Write down your roles and permissions, and test every endpoint with two users and an expired token.",
        "Add in-app account deletion, as Apple and Google require.",
        "Mastery checkpoint: explain, step by step, what happens from tapping \"Sign in\" to the first authenticated request, and how each token is protected.",
      ],
      closing: "Next: Module 16, accessing the phone's capabilities.",
    },
    requirements: { read: true, video: false, assessment: true },
  },
];
