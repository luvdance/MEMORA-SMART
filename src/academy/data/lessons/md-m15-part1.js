/**
 * MOBILE APP DEVELOPMENT · MODULE 15 · AUTHENTICATION AND ACCOUNT MANAGEMENT (part 1)
 *
 * Curriculum 15.1 – 15.8: registration and login, email verification,
 * password reset, session persistence, access and refresh tokens, secure
 * logout, role-based access control, and expired sessions.
 *
 * E-mails go to an outbox in each lab's server (GET /dev/outbox), standing
 * in for an e-mail provider such as Resend, Postmark or SendGrid.
 *
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 */

import { expoLab } from "./md-helpers.js";

export const SECTION_ID = "md-s15-auth";
export const MODULE = "md-m15-auth";

export const serverOnly = `import { Text } from "react-native";

export default function Home() {
  return <Text style={{ padding: 20 }}>This lab is the server: see server/index.js.</Text>;
}
`;
export const call = (method, path, body, token) =>
  `await fetch('https://api.example.com${path}', { method: '${method}', headers: { 'Content-Type': 'application/json'${token ? `, Authorization: 'Bearer ' + ${token}` : ""} }${body ? `, body: JSON.stringify(${body})` : ""} })`;
export const jsonOf = (expr) => `(await (await (${expr})).json())`;
const outbox = "(await (await fetch('https://api.example.com/dev/outbox')).json())";

/* ── 15.1 · Registration and login ───────────────────────────────────── */
const FLOW_SERVER = `import { createServer, passwords, tokens } from "practice-server";

const app = createServer();
const SECRET = "practice-only-secret";
const users = [{ id: "u1", name: "Ada", email: "ada@example.com", hash: passwords.hash("kobo1234") }];

app.post("/auth/register", (req, res) => {
  const { name, email, password } = req.body || {};
  const e = String(email || "").trim().toLowerCase();
  if (!name || !/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(e) || String(password || "").length < 8) return res.status(400).json({ message: "Check your details" });
  if (users.some((u) => u.email === e)) return res.status(409).json({ message: "An account with this email already exists" });
  const user = { id: "u" + (users.length + 1), name, email: e, hash: passwords.hash(password) };
  users.push(user);
  res.status(201).json({ token: tokens.sign({ sub: user.id }, SECRET), name });
});

app.post("/auth/login", (req, res) => {
  const user = users.find((u) => u.email === String(req.body?.email || "").trim().toLowerCase());
  if (!user || !passwords.verify(String(req.body?.password || ""), user.hash)) return res.status(401).json({ message: "Wrong email or password" });
  res.json({ token: tokens.sign({ sub: user.id }, SECRET), name: user.name });
});

export default app;
`;
const FLOW_SESSION = `import { createContext, useContext, useState, type ReactNode } from "react";

/** An error with the HTTP status, so screens can react to 409 and friends. */
export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

async function post<T>(path: string, body: unknown): Promise<T> {
  const response = await fetch("https://api.example.com" + path, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  const data = await response.json();
  if (!response.ok) throw new ApiError(response.status, data.message ?? "Something went wrong");
  return data as T;
}

type Session = { token: string; name: string } | null;
type Value = {
  session: Session;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (details: { name: string; email: string; password: string }) => Promise<void>;
  signOut: () => void;
};

const SessionContext = createContext<Value | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session>(null);
  const value: Value = {
    session,
    signIn: async (email, password) => setSession(await post("/auth/login", { email, password })),
    signUp: async (details) => setSession(await post("/auth/register", details)),
    signOut: () => setSession(null),
  };
  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const value = useContext(SessionContext);
  if (!value) throw new Error("useSession must be used inside <SessionProvider>");
  return value;
}
`;
const FLOW_ROOT = `import { Stack } from "expo-router";
import { SessionProvider, useSession } from "@/context/session";

function RootNavigator() {
  const { session } = useSession();
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={!!session}>
        <Stack.Screen name="(app)" />
      </Stack.Protected>
      <Stack.Protected guard={!session}>
        <Stack.Screen name="sign-in" options={{ headerShown: true, title: "Sign in" }} />
        <Stack.Screen name="sign-up" options={{ headerShown: true, title: "Create an account" }} />
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
`;
const FIELD = `{ minHeight: 48, borderWidth: 1, borderColor: "#cbd5e1", borderRadius: 10, paddingHorizontal: 12 }`;
const FLOW_SIGN_IN = `import { Link } from "expo-router";
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
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" autoComplete="email" style={${FIELD}} />
      <TextInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry autoComplete="current-password" style={${FIELD}} />
      {error ? <Text accessibilityRole="alert">{error}</Text> : null}
      <Pressable accessibilityRole="button" onPress={() => signIn(email, password).catch((e: Error) => setError(e.message))} style={{ minHeight: 48, justifyContent: "center" }}>
        <Text>Sign in</Text>
      </Pressable>
      <Link href="/sign-up" style={{ paddingVertical: 12, color: "#0f766e" }}>Create an account</Link>
    </View>
  );
}
`;
const FLOW_SIGN_UP_START = `import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { useSession } from "@/context/session";

export default function SignUp() {
  const { signUp } = useSession();
  // Build the sign-up form here.
  return (
    <View style={{ padding: 20, gap: 10 }}>
      <Text>Create your account</Text>
    </View>
  );
}
`;
const FLOW_SIGN_UP_MODEL = `import { Link } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Pressable, Text, TextInput, View } from "react-native";
import { ApiError, useSession } from "@/context/session";

type Errors = { name?: string; email?: string; password?: string };

function validate(name: string, email: string, password: string): Errors {
  const errors: Errors = {};
  if (!name.trim()) errors.name = "Enter your name";
  if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email.trim())) errors.email = "Enter a valid email address";
  if (password.length < 8) errors.password = "Use at least 8 characters";
  return errors;
}

export default function SignUp() {
  const { signUp } = useSession();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [serverError, setServerError] = useState("");
  const [exists, setExists] = useState(false);
  const [busy, setBusy] = useState(false);

  async function submit() {
    if (busy) return;
    const found = validate(name, email, password);
    setErrors(found);
    setServerError("");
    setExists(false);
    if (Object.keys(found).length > 0) return;
    setBusy(true);
    try {
      // On success the session changes and Stack.Protected moves the user into the app.
      await signUp({ name: name.trim(), email: email.trim(), password });
    } catch (e) {
      if (e instanceof ApiError && e.status === 409) setExists(true);
      else setServerError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <View style={{ padding: 20, gap: 8 }}>
      <TextInput placeholder="Name" value={name} onChangeText={setName} autoComplete="name" textContentType="name" style={${FIELD}} />
      {errors.name ? <Text style={{ color: "#b91c1c" }}>{errors.name}</Text> : null}
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" autoComplete="email" style={${FIELD}} />
      {errors.email ? <Text style={{ color: "#b91c1c" }}>{errors.email}</Text> : null}
      <TextInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry autoComplete="new-password" textContentType="newPassword" style={${FIELD}} />
      {errors.password ? <Text style={{ color: "#b91c1c" }}>{errors.password}</Text> : null}
      {exists ? (
        <View accessibilityRole="alert">
          <Text>An account with this email already exists.</Text>
          <Link href="/sign-in" style={{ paddingVertical: 12, color: "#0f766e" }}>Sign in instead</Link>
        </View>
      ) : null}
      {serverError ? <Text accessibilityRole="alert">{serverError}</Text> : null}
      <Pressable accessibilityRole="button" disabled={busy} onPress={submit} style={{ minHeight: 48, borderRadius: 12, backgroundColor: "#0f766e", justifyContent: "center", alignItems: "center" }}>
        {busy ? <ActivityIndicator color="#fff" /> : <Text style={{ color: "#fff", fontWeight: "700" }}>Create account</Text>}
      </Pressable>
    </View>
  );
}
`;
const FLOW_HOME = `import { Pressable, Text, View } from "react-native";
import { useSession } from "@/context/session";

export default function Home() {
  const { session, signOut } = useSession();
  return (
    <View style={{ padding: 20, gap: 12 }}>
      <Text style={{ fontSize: 22 }}>Welcome, {session?.name}</Text>
      <Pressable accessibilityRole="button" onPress={signOut} style={{ minHeight: 48, justifyContent: "center" }}><Text>Sign out</Text></Pressable>
    </View>
  );
}
`;

/* ── 15.2 · Email verification ───────────────────────────────────────── */
const MAIL = `// A stand-in for an e-mail provider: messages land in this outbox.
const outbox = [];
const sendEmail = (to, subject, text) => outbox.push({ to, subject, text });
app.get("/dev/outbox", (req, res) => res.json(outbox));
`;
const VERIFY_START = `import { createServer, crypto, now, passwords, tokens } from "practice-server";

const app = createServer();
const SECRET = "practice-only-secret";
const users = [];
${MAIL}
const findUser = (email) => users.find((u) => u.email === String(email || "").trim().toLowerCase());

// POST /auth/register { email, password } → 201 { message }. The account starts UNVERIFIED.
app.post("/auth/register", (req, res) => {
  const email = String(req.body?.email || "").trim().toLowerCase();
  if (!email || String(req.body?.password || "").length < 8) return res.status(400).json({ message: "Check your details" });
  if (findUser(email)) return res.status(409).json({ message: "An account with this email already exists" });
  users.push({ email, hash: passwords.hash(req.body.password), verified: false });
  res.status(201).json({ message: "Check your email for a code" });
});

// POST /auth/verify { email, code } → { token }
app.post("/auth/verify", (req, res) => {
  res.status(501).json({ message: "Not written yet" });
});

// POST /auth/resend { email } → { message }
app.post("/auth/resend", (req, res) => {
  res.status(501).json({ message: "Not written yet" });
});

app.post("/auth/login", (req, res) => {
  const user = findUser(req.body?.email);
  if (!user || !passwords.verify(String(req.body?.password || ""), user.hash)) return res.status(401).json({ message: "Wrong email or password" });
  res.json({ token: tokens.sign({ sub: user.email }, SECRET) });
});

// For this lab's checks only.
app.get("/debug/users", (req, res) => res.json(users));

export default app;
`;
const VERIFY_MODEL = `import { createServer, crypto, now, passwords, tokens } from "practice-server";

const app = createServer();
const SECRET = "practice-only-secret";
const users = [];
${MAIL}
const findUser = (email) => users.find((u) => u.email === String(email || "").trim().toLowerCase());

const CODE_MINUTES = 15;
const MAX_ATTEMPTS = 5;
const RESENDS_PER_HOUR = 3;

/** A new 6-digit code: e-mailed to the user, and only its hash kept. */
function sendCode(user) {
  const code = String(100000 + Math.floor(Math.random() * 900000));
  user.codeHash = crypto.sha256(code);
  user.codeExpires = now() + CODE_MINUTES * 60 * 1000;
  user.attempts = 0;
  sendEmail(user.email, "Your Kobo code", "Your code is " + code + ". It expires in " + CODE_MINUTES + " minutes.");
}

// POST /auth/register { email, password } → 201 { message }. The account starts UNVERIFIED.
app.post("/auth/register", (req, res) => {
  const email = String(req.body?.email || "").trim().toLowerCase();
  if (!email || String(req.body?.password || "").length < 8) return res.status(400).json({ message: "Check your details" });
  if (findUser(email)) return res.status(409).json({ message: "An account with this email already exists" });
  const user = { email, hash: passwords.hash(req.body.password), verified: false, resends: [] };
  users.push(user);
  sendCode(user);
  res.status(201).json({ message: "Check your email for a code" });
});

// POST /auth/verify { email, code } → { token }
app.post("/auth/verify", (req, res) => {
  const user = findUser(req.body?.email);
  const wrong = () => res.status(400).json({ message: "That code is wrong or has expired" });
  if (!user || user.verified || !user.codeHash) return wrong();
  if (now() > user.codeExpires || user.attempts >= MAX_ATTEMPTS) return wrong();
  if (crypto.sha256(String(req.body?.code || "")) !== user.codeHash) {
    user.attempts++;
    return wrong();
  }
  user.verified = true;
  user.codeHash = null;
  res.json({ token: tokens.sign({ sub: user.email }, SECRET) });
});

// POST /auth/resend { email } → { message }
app.post("/auth/resend", (req, res) => {
  const user = findUser(req.body?.email);
  // The same answer whether or not the account exists.
  const ok = () => res.json({ message: "If that account needs a code, we've sent one" });
  if (!user || user.verified) return ok();
  user.resends = user.resends.filter((t) => t > now() - 60 * 60 * 1000);
  if (user.resends.length >= RESENDS_PER_HOUR) return res.status(429).json({ message: "Too many codes requested. Try again later." });
  user.resends.push(now());
  sendCode(user);
  ok();
});

app.post("/auth/login", (req, res) => {
  const user = findUser(req.body?.email);
  if (!user || !passwords.verify(String(req.body?.password || ""), user.hash)) return res.status(401).json({ message: "Wrong email or password" });
  if (!user.verified) return res.status(403).json({ message: "Verify your email first", code: "email_not_verified" });
  res.json({ token: tokens.sign({ sub: user.email }, SECRET) });
});

// For this lab's checks only.
app.get("/debug/users", (req, res) => res.json(users));

export default app;
`;
const codeFrom = (who) => `${outbox}.filter((m) => m.to === '${who}').pop().text.match(/\\d{6}/)[0]`;

/* ── 15.3 · Password reset ───────────────────────────────────────────── */
const RESET_START = `import { createServer, crypto, now, passwords, tokens } from "practice-server";

const app = createServer();
const SECRET = "practice-only-secret";
// tokenVersion is inside every session token; raising it signs the user out everywhere.
const users = [{ id: "u1", email: "ada@example.com", hash: passwords.hash("kobo1234"), tokenVersion: 1 }];
${MAIL}
const randomToken = () => crypto.sha256(String(Math.random()) + now() + Math.random());

app.post("/auth/login", (req, res) => {
  const user = users.find((u) => u.email === String(req.body?.email || "").toLowerCase());
  if (!user || !passwords.verify(String(req.body?.password || ""), user.hash)) return res.status(401).json({ message: "Wrong email or password" });
  res.json({ token: tokens.sign({ sub: user.id, ver: user.tokenVersion }, SECRET) });
});

app.get("/me", (req, res) => {
  try {
    const p = tokens.verify((req.headers.authorization || "").replace("Bearer ", ""), SECRET);
    const user = users.find((u) => u.id === p.sub);
    if (!user || user.tokenVersion !== p.ver) throw new Error("revoked");
    res.json({ email: user.email });
  } catch {
    res.status(401).json({ message: "Sign in again" });
  }
});

// POST /auth/forgot { email } → 200 { message }: e-mail a reset link (kobo://reset-password?token=…)
app.post("/auth/forgot", (req, res) => {
  res.status(501).json({ message: "Not written yet" });
});

// POST /auth/reset { token, password } → 200 { message }
app.post("/auth/reset", (req, res) => {
  res.status(501).json({ message: "Not written yet" });
});

export default app;
`;
const RESET_MODEL = `import { createServer, crypto, now, passwords, tokens } from "practice-server";

const app = createServer();
const SECRET = "practice-only-secret";
// tokenVersion is inside every session token; raising it signs the user out everywhere.
const users = [{ id: "u1", email: "ada@example.com", hash: passwords.hash("kobo1234"), tokenVersion: 1 }];
${MAIL}
const randomToken = () => crypto.sha256(String(Math.random()) + now() + Math.random());

app.post("/auth/login", (req, res) => {
  const user = users.find((u) => u.email === String(req.body?.email || "").toLowerCase());
  if (!user || !passwords.verify(String(req.body?.password || ""), user.hash)) return res.status(401).json({ message: "Wrong email or password" });
  res.json({ token: tokens.sign({ sub: user.id, ver: user.tokenVersion }, SECRET) });
});

app.get("/me", (req, res) => {
  try {
    const p = tokens.verify((req.headers.authorization || "").replace("Bearer ", ""), SECRET);
    const user = users.find((u) => u.id === p.sub);
    if (!user || user.tokenVersion !== p.ver) throw new Error("revoked");
    res.json({ email: user.email });
  } catch {
    res.status(401).json({ message: "Sign in again" });
  }
});

const RESET_MINUTES = 30;

// POST /auth/forgot { email } → 200 { message }: e-mail a reset link (kobo://reset-password?token=…)
app.post("/auth/forgot", (req, res) => {
  const user = users.find((u) => u.email === String(req.body?.email || "").trim().toLowerCase());
  if (user) {
    const token = randomToken();
    // Like a password, only the token's hash is stored.
    user.resetHash = crypto.sha256(token);
    user.resetExpires = now() + RESET_MINUTES * 60 * 1000;
    sendEmail(user.email, "Reset your Kobo password", "Open this link within " + RESET_MINUTES + " minutes: kobo://reset-password?token=" + token);
  }
  // The same answer either way: nobody learns which e-mails have accounts.
  res.json({ message: "If an account exists for that email, we've sent a reset link." });
});

// POST /auth/reset { token, password } → 200 { message }
app.post("/auth/reset", (req, res) => {
  const hash = crypto.sha256(String(req.body?.token || ""));
  const user = users.find((u) => u.resetHash && u.resetHash === hash);
  if (!user || now() > user.resetExpires) return res.status(400).json({ message: "This reset link is invalid or has expired" });
  if (String(req.body?.password || "").length < 8) return res.status(400).json({ message: "Use at least 8 characters" });
  user.hash = passwords.hash(req.body.password);
  user.resetHash = null; // single use
  user.tokenVersion++; // signs out every session, in case an attacker had one
  res.json({ message: "Your password has been changed" });
});

export default app;
`;
const resetToken = `${outbox}.pop().text.match(/token=([a-f0-9]+)/)[1]`;

/* ── 15.4 · Session persistence ──────────────────────────────────────── */
const RENDERS = `export const renders: Record<string, number> = {};
export function useRenderCount(name: string) {
  renders[name] = (renders[name] ?? 0) + 1;
}
`;
const PERSIST_SESSION = `import * as SecureStore from "expo-secure-store";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type Session = { name: string } | null;
type Value = { session: Session; restoring: boolean; signIn: () => Promise<void>; signOut: () => Promise<void> };

const SessionContext = createContext<Value | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session>(null);
  const [restoring, setRestoring] = useState(true);

  useEffect(() => {
    SecureStore.getItemAsync("session")
      .then((saved) => setSession(saved ? JSON.parse(saved) : null))
      .finally(() => setRestoring(false));
  }, []);

  const value: Value = {
    session,
    restoring,
    signIn: async () => {
      const s = { name: "Ada" };
      await SecureStore.setItemAsync("session", JSON.stringify(s));
      setSession(s);
    },
    signOut: async () => {
      await SecureStore.deleteItemAsync("session");
      setSession(null);
    },
  };
  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const value = useContext(SessionContext);
  if (!value) throw new Error("useSession must be used inside <SessionProvider>");
  return value;
}
`;
const PERSIST_ROOT_START = `import { Stack } from "expo-router";
import { SessionProvider, useSession } from "@/context/session";

function RootNavigator() {
  const { session } = useSession();
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={!!session}>
        <Stack.Screen name="index" />
      </Stack.Protected>
      <Stack.Protected guard={!session}>
        <Stack.Screen name="sign-in" />
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
`;
const PERSIST_ROOT_MODEL = `import { SplashScreen, Stack } from "expo-router";
import { useEffect } from "react";
import { SessionProvider, useSession } from "@/context/session";

// Keep the splash screen up until we know whether the user is signed in.
SplashScreen.preventAutoHideAsync();

function RootNavigator() {
  const { session, restoring } = useSession();

  useEffect(() => {
    if (!restoring) SplashScreen.hideAsync();
  }, [restoring]);

  // Render nothing while restoring: the splash screen is still showing.
  if (restoring) return null;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={!!session}>
        <Stack.Screen name="index" />
      </Stack.Protected>
      <Stack.Protected guard={!session}>
        <Stack.Screen name="sign-in" />
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
`;
const PERSIST_SIGN_IN = `import { Pressable, Text, View } from "react-native";
import { useSession } from "@/context/session";
import { useRenderCount } from "@/debug/renders";

export default function SignIn() {
  useRenderCount("SignIn");
  const { signIn } = useSession();
  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 24 }}>
      <Pressable accessibilityRole="button" onPress={signIn} style={{ minHeight: 48, justifyContent: "center" }}><Text>Sign in</Text></Pressable>
    </View>
  );
}
`;
const PERSIST_HOME = `import { Pressable, Text, View } from "react-native";
import { useSession } from "@/context/session";

export default function Home() {
  const { session, signOut } = useSession();
  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 24, gap: 12 }}>
      <Text style={{ fontSize: 22 }}>Welcome back, {session?.name}</Text>
      <Pressable accessibilityRole="button" onPress={signOut} style={{ minHeight: 48, justifyContent: "center" }}><Text>Sign out</Text></Pressable>
    </View>
  );
}
`;

/* ── 15.5 · Access and refresh tokens ────────────────────────────────── */
export const REFRESH_SERVER = `import { createServer, crypto, now, tokens } from "practice-server";

const app = createServer();
const SECRET = "practice-only-secret";
const REFRESH_DAYS = 30;
// Refresh tokens are stored (hashed) so they can be revoked; each one works once.
const refreshTokens = new Map(); // hash → { userId, family, expires, used }

function issue(userId, family = crypto.sha256(String(Math.random()))) {
  const refreshToken = crypto.sha256(String(Math.random()) + now());
  refreshTokens.set(crypto.sha256(refreshToken), { userId, family, expires: now() + REFRESH_DAYS * 86400000, used: false });
  return { accessToken: tokens.sign({ sub: userId, typ: "access" }, SECRET, { expiresIn: "15m" }), refreshToken };
}

app.post("/auth/login", (req, res) => res.json(issue(req.body?.user || "ada")));

app.post("/auth/refresh", (req, res) => {
  const rec = refreshTokens.get(crypto.sha256(String(req.body?.refreshToken || "")));
  if (!rec || now() > rec.expires) return res.status(401).json({ message: "Please sign in again" });
  if (rec.used) {
    // A refresh token used twice was probably stolen: revoke its whole family.
    for (const [k, r] of refreshTokens) if (r.family === rec.family) refreshTokens.delete(k);
    return res.status(401).json({ message: "Please sign in again" });
  }
  rec.used = true;
  res.json(issue(rec.userId, rec.family));
});

app.post("/auth/logout", (req, res) => {
  refreshTokens.delete(crypto.sha256(String(req.body?.refreshToken || "")));
  res.status(204).end();
});

const auth = (req) => {
  const p = tokens.verify((req.headers.authorization || "").replace("Bearer ", ""), SECRET);
  if (p.typ !== "access") throw new Error("not an access token");
  return p;
};
const guarded = (fn) => (req, res) => {
  try {
    res.json(fn(auth(req)));
  } catch {
    res.status(401).json({ message: "Token expired or invalid" });
  }
};

app.get("/me", guarded((p) => ({ name: p.sub === "ada" ? "Ada" : p.sub })));
app.get("/orders", guarded(() => [{ id: "42", item: "Ankara tote bag" }]));
app.get("/notifications", guarded(() => [{ id: "n1", text: "Your order shipped" }]));

export default app;
`;
export const TOKEN_STORE = `import * as SecureStore from "expo-secure-store";

export type Tokens = { accessToken: string; refreshToken: string };

export async function saveTokens(t: Tokens) {
  await SecureStore.setItemAsync("access_token", t.accessToken);
  await SecureStore.setItemAsync("refresh_token", t.refreshToken);
}

export async function getTokens() {
  return { accessToken: await SecureStore.getItemAsync("access_token"), refreshToken: await SecureStore.getItemAsync("refresh_token") };
}

export async function clearTokens() {
  await SecureStore.deleteItemAsync("access_token");
  await SecureStore.deleteItemAsync("refresh_token");
}
`;
const CLIENT_START = `import { clearTokens, getTokens, saveTokens } from "@/auth/tokenStorage";

const BASE = "https://api.example.com";

/** Called when the session can't be renewed (the screen sets it). */
let signedOut = () => {};
export const onSignedOut = (fn: () => void) => {
  signedOut = fn;
};

/**
 * fetch with the access token. When it has expired (401), renew it ONCE with the
 * refresh token (one renewal shared by every request waiting), save the new pair,
 * and send the request again. If renewal fails, clear the tokens and call signedOut.
 */
export async function apiFetch(path: string, init: RequestInit = {}): Promise<Response> {
  const { accessToken } = await getTokens();
  return fetch(BASE + path, { ...init, headers: { ...(init.headers as object), Authorization: "Bearer " + accessToken } });
}
`;
export const CLIENT_MODEL = `import { clearTokens, getTokens, saveTokens } from "@/auth/tokenStorage";

const BASE = "https://api.example.com";

/** Called when the session can't be renewed (the screen sets it). */
let signedOut = () => {};
export const onSignedOut = (fn: () => void) => {
  signedOut = fn;
};

let refreshing: Promise<boolean> | null = null;

async function refresh(): Promise<boolean> {
  const { refreshToken } = await getTokens();
  if (!refreshToken) return false;
  const response = await fetch(BASE + "/auth/refresh", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  });
  if (!response.ok) {
    await clearTokens();
    signedOut();
    return false;
  }
  // The server rotates refresh tokens: always keep the new pair.
  await saveTokens(await response.json());
  return true;
}

/**
 * fetch with the access token. When it has expired (401), renew it ONCE with the
 * refresh token (one renewal shared by every request waiting), save the new pair,
 * and send the request again. If renewal fails, clear the tokens and call signedOut.
 */
export async function apiFetch(path: string, init: RequestInit = {}): Promise<Response> {
  const send = async () => {
    const { accessToken } = await getTokens();
    const headers = new Headers(init.headers);
    if (accessToken) headers.set("Authorization", "Bearer " + accessToken);
    return fetch(BASE + path, { ...init, headers });
  };
  const response = await send();
  if (response.status !== 401) return response;
  // Several requests may fail at once: they all wait for the same renewal.
  refreshing ??= refresh().finally(() => {
    refreshing = null;
  });
  return (await refreshing) ? send() : response;
}
`;
const REFRESH_SCREEN = `import { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { apiFetch, onSignedOut } from "@/auth/client";
import { saveTokens } from "@/auth/tokenStorage";

export default function Account() {
  const [lines, setLines] = useState<string[]>([]);
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    onSignedOut(() => {
      setSignedIn(false);
      setLines(["Signed out: please sign in again"]);
    });
  }, []);

  async function signIn() {
    const r = await fetch("https://api.example.com/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: "{}" });
    await saveTokens(await r.json());
    setSignedIn(true);
    await load();
  }

  async function load() {
    // Three requests at once, as a real home screen makes.
    const [me, orders, notes] = await Promise.all(["/me", "/orders", "/notifications"].map((p) => apiFetch(p)));
    if (!me.ok) return;
    setLines(["Hello, " + (await me.json()).name, (await orders.json()).length + " order", (await notes.json()).length + " notification"]);
  }

  return (
    <View style={{ padding: 20, gap: 10 }}>
      {lines.map((l) => <Text key={l}>{l}</Text>)}
      <Pressable accessibilityRole="button" onPress={signedIn ? load : signIn} style={{ minHeight: 48, justifyContent: "center" }}>
        <Text>{signedIn ? "Refresh" : "Sign in"}</Text>
      </Pressable>
    </View>
  );
}
`;
const refreshCalls = "serverRequests().filter((r) => r.path === '/auth/refresh').length";

/* ── 15.6 · Secure logout ────────────────────────────────────────────── */
const LOGOUT_START = `import { createServer, crypto, now, tokens } from "practice-server";

const app = createServer();
const SECRET = "practice-only-secret";
const users = { ada: { tokenVersion: 1 } };
const refreshTokens = new Map(); // hash → { userId, expires }

function issue(userId) {
  const refreshToken = crypto.sha256(String(Math.random()) + now());
  refreshTokens.set(crypto.sha256(refreshToken), { userId, expires: now() + 30 * 86400000 });
  return { accessToken: tokens.sign({ sub: userId, ver: users[userId].tokenVersion }, SECRET, { expiresIn: "15m" }), refreshToken };
}

/** The signed-in user's id from the access token, or null. Checks tokenVersion too. */
function userFrom(req) {
  try {
    const p = tokens.verify((req.headers.authorization || "").replace("Bearer ", ""), SECRET);
    return users[p.sub] && users[p.sub].tokenVersion === p.ver ? p.sub : null;
  } catch {
    return null;
  }
}

app.post("/auth/login", (req, res) => res.json(issue("ada")));

app.post("/auth/refresh", (req, res) => {
  const key = crypto.sha256(String(req.body?.refreshToken || ""));
  const rec = refreshTokens.get(key);
  if (!rec || now() > rec.expires) return res.status(401).json({ message: "Please sign in again" });
  refreshTokens.delete(key);
  res.json(issue(rec.userId));
});

app.get("/me", (req, res) => (userFrom(req) ? res.json({ name: "Ada" }) : res.status(401).json({ message: "Sign in again" })));

// POST /auth/logout { refreshToken } (with the access token) → 204: this device is signed out.
app.post("/auth/logout", (req, res) => {
  res.status(501).json({ message: "Not written yet" });
});

// POST /auth/logout-all (with the access token) → 204: every device is signed out.
app.post("/auth/logout-all", (req, res) => {
  res.status(501).json({ message: "Not written yet" });
});

export default app;
`;
const LOGOUT_MODEL = LOGOUT_START.replace(
  `app.post("/auth/logout", (req, res) => {
  res.status(501).json({ message: "Not written yet" });
});`,
  `app.post("/auth/logout", (req, res) => {
  const userId = userFrom(req);
  if (!userId) return res.status(401).json({ message: "Sign in first" });
  const key = crypto.sha256(String(req.body?.refreshToken || ""));
  // Only the user's own token: nobody can sign someone else out.
  if (refreshTokens.get(key)?.userId === userId) refreshTokens.delete(key);
  res.status(204).end();
});`
).replace(
  `app.post("/auth/logout-all", (req, res) => {
  res.status(501).json({ message: "Not written yet" });
});`,
  `app.post("/auth/logout-all", (req, res) => {
  const userId = userFrom(req);
  if (!userId) return res.status(401).json({ message: "Sign in first" });
  // Every refresh token of this user goes...
  for (const [key, rec] of refreshTokens) if (rec.userId === userId) refreshTokens.delete(key);
  // ...and every access token already issued stops working too.
  users[userId].tokenVersion++;
  res.status(204).end();
});`
);
const device = (n) => `const d${n} = ${jsonOf(call("POST", "/auth/login", "{}"))};`;

/* ── 15.7 · Roles and permissions ────────────────────────────────────── */
const RBAC_START = `import { createServer } from "practice-server";

const app = createServer();

// For this lab, a token simply names the user.
const users = {
  "ada-token": { id: "u1", name: "Ada", role: "member", muted: false },
  "bisi-token": { id: "u2", name: "Bisi", role: "moderator", muted: false },
  "tunde-token": { id: "u3", name: "Tunde", role: "admin", muted: false },
};
let notices = [
  { id: "1", authorId: "u1", title: "Water off on Saturday" },
  { id: "2", authorId: "u3", title: "New community rules" },
];

app.use((req, res, next) => {
  req.user = users[(req.headers.authorization || "").replace("Bearer ", "")];
  if (!req.user) return res.status(401).json({ message: "Sign in first" });
  next();
});

// 1. Decide what each role may do, in one place.
const PERMISSIONS = {};

// GET /me → { name, role, permissions }
app.get("/me", (req, res) => res.json({ name: req.user.name, role: req.user.role, permissions: [] }));

// Members delete their own notices; moderators and admins delete any.
app.delete("/notices/:id", (req, res) => {
  notices = notices.filter((n) => n.id !== req.params.id);
  res.status(204).end();
});

// Moderators and admins may mute users.
app.post("/users/:id/mute", (req, res) => {
  const user = Object.values(users).find((u) => u.id === req.params.id);
  user.muted = true;
  res.json({ id: user.id, muted: true });
});

// Only admins change roles, and never their own.
app.patch("/users/:id/role", (req, res) => {
  const user = Object.values(users).find((u) => u.id === req.params.id);
  user.role = req.body.role;
  res.json({ id: user.id, role: user.role });
});

export default app;
`;
const RBAC_MODEL = `import { createServer } from "practice-server";

const app = createServer();

// For this lab, a token simply names the user.
const users = {
  "ada-token": { id: "u1", name: "Ada", role: "member", muted: false },
  "bisi-token": { id: "u2", name: "Bisi", role: "moderator", muted: false },
  "tunde-token": { id: "u3", name: "Tunde", role: "admin", muted: false },
};
let notices = [
  { id: "1", authorId: "u1", title: "Water off on Saturday" },
  { id: "2", authorId: "u3", title: "New community rules" },
];

app.use((req, res, next) => {
  req.user = users[(req.headers.authorization || "").replace("Bearer ", "")];
  if (!req.user) return res.status(401).json({ message: "Sign in first" });
  next();
});

// 1. Decide what each role may do, in one place.
const MEMBER = ["notices:create", "notices:delete:own"];
const MODERATOR = [...MEMBER, "notices:delete:any", "users:mute"];
const ADMIN = [...MODERATOR, "users:role"];
const PERMISSIONS = { member: MEMBER, moderator: MODERATOR, admin: ADMIN };

const can = (user, permission) => (PERMISSIONS[user.role] || []).includes(permission);
const requirePermission = (permission) => (req, res, next) =>
  can(req.user, permission) ? next() : res.status(403).json({ message: "You don't have permission to do that" });
const ROLES = Object.keys(PERMISSIONS);
const findUser = (id) => Object.values(users).find((u) => u.id === id);

// GET /me → { name, role, permissions }
app.get("/me", (req, res) => res.json({ name: req.user.name, role: req.user.role, permissions: PERMISSIONS[req.user.role] }));

// Members delete their own notices; moderators and admins delete any.
app.delete("/notices/:id", (req, res) => {
  const notice = notices.find((n) => n.id === req.params.id);
  if (!notice) return res.status(404).json({ message: "Notice not found" });
  const own = notice.authorId === req.user.id && can(req.user, "notices:delete:own");
  if (!own && !can(req.user, "notices:delete:any")) return res.status(403).json({ message: "You don't have permission to do that" });
  notices = notices.filter((n) => n.id !== req.params.id);
  res.status(204).end();
});

// Moderators and admins may mute users.
app.post("/users/:id/mute", requirePermission("users:mute"), (req, res) => {
  const user = findUser(req.params.id);
  if (!user) return res.status(404).json({ message: "User not found" });
  user.muted = true;
  res.json({ id: user.id, muted: true });
});

// Only admins change roles, and never their own.
app.patch("/users/:id/role", requirePermission("users:role"), (req, res) => {
  const user = findUser(req.params.id);
  if (!user) return res.status(404).json({ message: "User not found" });
  if (user.id === req.user.id) return res.status(400).json({ message: "You can't change your own role" });
  if (!ROLES.includes(req.body?.role)) return res.status(400).json({ message: "Unknown role" });
  user.role = req.body.role;
  res.json({ id: user.id, role: user.role });
});

export default app;
`;

/* ── 15.8 · Expired sessions ─────────────────────────────────────────── */
const EXPIRE_SERVER = `import { createServer, tokens } from "practice-server";

const app = createServer();
const SECRET = "practice-only-secret";

app.post("/auth/login", (req, res) => res.json({ token: tokens.sign({ sub: "ada" }, SECRET, { expiresIn: "15m" }) }));

app.get("/orders/:id", (req, res) => {
  try {
    tokens.verify((req.headers.authorization || "").replace("Bearer ", ""), SECRET);
    res.json({ id: req.params.id, status: "On its way", checkedAt: Date.now() });
  } catch {
    res.status(401).json({ message: "Session expired" });
  }
});

export default app;
`;
const EXPIRE_API = `let expired = () => {};
/** The session provider sets what happens when the server says the session is over. */
export const onSessionExpired = (fn: () => void) => {
  expired = fn;
};

export async function api<T>(path: string, token: string | null): Promise<T> {
  const response = await fetch("https://api.example.com" + path, { headers: token ? { Authorization: "Bearer " + token } : {} });
  if (response.status === 401) {
    expired();
    throw new Error("Session expired");
  }
  return response.json();
}
`;
const EXPIRE_START = `import { createContext, useContext, useState, type ReactNode } from "react";

type Value = {
  token: string | null;
  notice: string;
  signIn: () => Promise<void>;
};

const SessionContext = createContext<Value | null>(null);

/**
 * When the session expires: sign out, show the sign-in screen with
 * "Your session expired. Please sign in again.", and after signing in,
 * take the user back to the screen they were on.
 */
export function SessionProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const signIn = async () => {
    const r = await fetch("https://api.example.com/auth/login", { method: "POST" });
    setToken((await r.json()).token);
  };
  return <SessionContext.Provider value={{ token, notice: "", signIn }}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const value = useContext(SessionContext);
  if (!value) throw new Error("useSession must be used inside <SessionProvider>");
  return value;
}
`;
const EXPIRE_MODEL = `import { router, usePathname } from "expo-router";
import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { onSessionExpired } from "@/services/api";

type Value = {
  token: string | null;
  notice: string;
  signIn: () => Promise<void>;
};

const SessionContext = createContext<Value | null>(null);

/**
 * When the session expires: sign out, show the sign-in screen with
 * "Your session expired. Please sign in again.", and after signing in,
 * take the user back to the screen they were on.
 */
export function SessionProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [notice, setNotice] = useState("");
  const pathname = usePathname();
  const currentPath = useRef(pathname);
  currentPath.current = pathname;
  const returnTo = useRef<string | null>(null);

  useEffect(() => {
    onSessionExpired(() => {
      returnTo.current = currentPath.current;
      setNotice("Your session expired. Please sign in again.");
      setToken(null);
    });
  }, []);

  // Once signed in again (and the guards have moved us into the app), go back.
  useEffect(() => {
    if (token && returnTo.current) {
      const to = returnTo.current;
      returnTo.current = null;
      router.navigate(to as never);
    }
  }, [token]);

  const signIn = async () => {
    const r = await fetch("https://api.example.com/auth/login", { method: "POST" });
    setNotice("");
    setToken((await r.json()).token);
  };
  return <SessionContext.Provider value={{ token, notice, signIn }}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const value = useContext(SessionContext);
  if (!value) throw new Error("useSession must be used inside <SessionProvider>");
  return value;
}
`;
const EXPIRE_ROOT = `import { Stack } from "expo-router";
import { SessionProvider, useSession } from "@/context/session";

function RootNavigator() {
  const { token } = useSession();
  return (
    <Stack>
      <Stack.Protected guard={!!token}>
        <Stack.Screen name="index" options={{ title: "Orders" }} />
        <Stack.Screen name="orders/[id]" options={{ title: "Order" }} />
      </Stack.Protected>
      <Stack.Protected guard={!token}>
        <Stack.Screen name="sign-in" options={{ title: "Sign in" }} />
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
`;
const EXPIRE_SIGN_IN = `import { Pressable, Text, View } from "react-native";
import { useSession } from "@/context/session";

export default function SignIn() {
  const { notice, signIn } = useSession();
  return (
    <View style={{ padding: 24, gap: 12 }}>
      {notice ? <Text accessibilityRole="alert">{notice}</Text> : null}
      <Pressable accessibilityRole="button" onPress={signIn} style={{ minHeight: 48, justifyContent: "center" }}><Text>Sign in</Text></Pressable>
    </View>
  );
}
`;
const EXPIRE_HOME = `import { Link } from "expo-router";
import { View } from "react-native";

export default function Orders() {
  return (
    <View style={{ padding: 16 }}>
      <Link href="/orders/42" style={{ paddingVertical: 14, fontSize: 16 }}>Order #42</Link>
    </View>
  );
}
`;
const EXPIRE_ORDER = `import { useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { useSession } from "@/context/session";
import { api } from "@/services/api";

export default function Order() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { token } = useSession();
  const [status, setStatus] = useState("");
  const load = useCallback(() => {
    api<{ status: string }>("/orders/" + id, token).then((o) => setStatus(o.status), () => {});
  }, [id, token]);
  useEffect(load, [load]);
  return (
    <View style={{ padding: 20, gap: 12 }}>
      <Text>Order #{id}: {status}</Text>
      <Pressable accessibilityRole="button" onPress={load} style={{ minHeight: 48, justifyContent: "center" }}><Text>Refresh</Text></Pressable>
    </View>
  );
}
`;

export const PART1 = [
  /* ═══════════════ LESSON 91 · 15.1 – 15.2 ═══════════════ */
  {
    id: "md-l91-signup-verify",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 1,
    covers: ["15.1", "15.2"],
    title: "Registration, Login and Email Verification",
    subtitle: "Creating accounts that work, and proving the e-mail is real",
    estimatedMinutes: 60,
    intro: "Sign-up is often the first thing a user does in your app. It must be quick, forgiving and secure, and it must prove the e-mail address belongs to them.",
    atoms: [
      {
        id: "a-md-auth-flows",
        title: "Registration and login flows",
        explain:
          "A good flow: the signed-out screens (sign-in, sign-up, forgot password) and the (app) group, kept apart with Stack.Protected (Module 9), so success needs no navigation code: the session changes and the guards move the user, with no Back into sign-up. On the sign-up form: only the fields you need (name, e-mail, password; ask for the rest later), the right keyboards and autoComplete (\"new-password\" lets password managers suggest a strong one), validation with clear messages before sending, a busy state, and the server's errors. Handle the common case of an existing account kindly: say so, and offer \"Sign in instead\". Never tell the user which part of a sign-in failed.",
        webLab: expoLab({
          name: "Kobo",
          layout: FLOW_ROOT,
          task:
            "Write src/app/sign-up.tsx: Name, Email and Password fields (Email with the e-mail keyboard and no capitals; Password hidden, autoComplete \"new-password\"); on \"Create account\", check them first (\"Enter your name\", \"Enter a valid email address\", \"Use at least 8 characters\") and send nothing if any is wrong; then call signUp; if the server answers 409, show \"An account with this email already exists.\" with a \"Sign in instead\" link to /sign-in; show other server errors; disable the button while busy.",
          files: {
            "src/app/sign-up.tsx": FLOW_SIGN_UP_START,
            "src/app/sign-in.tsx": FLOW_SIGN_IN,
            "src/app/(app)/index.tsx": FLOW_HOME,
            "src/context/session.tsx": FLOW_SESSION,
            "server/index.js": FLOW_SERVER,
          },
          readOnly: ["src/app/sign-in.tsx", "src/app/(app)/index.tsx", "src/context/session.tsx", "server/index.js", "src/app/_layout.tsx"],
          solution: { "src/app/sign-up.tsx": FLOW_SIGN_UP_MODEL },
          tests: [
            { label: "Mistakes are caught before anything is sent", check: "await press('Create an account'); await waitFor(() => exists({ placeholder: 'Name' }), 3000); await typeInto('Email', 'chidi@'); await press('Create account'); await wait(200); return has('Enter your name') && has('Enter a valid email address') && has('Use at least 8 characters') && serverRequests().length === 0;", fail: "Validate, and return before calling signUp." },
            { label: "The right keyboards and autofill", check: "await navigate('/sign-up'); await waitFor(() => exists({ placeholder: 'Password' }), 3000); const p = find({ placeholder: 'Password' }); return find({ placeholder: 'Email' }).type === 'email' && p.type === 'password' && p.getAttribute('autocomplete') === 'new-password';", fail: "keyboardType=\"email-address\", secureTextEntry, autoComplete=\"new-password\"." },
            { label: "An existing account is handled kindly", check: "await restart(); await waitFor(() => has('Create an account'), 3000); await press('Create an account'); await waitFor(() => exists({ placeholder: 'Name' }), 3000); await typeInto('Name', 'Ada'); await typeInto('Email', 'ADA@example.com'); await typeInto('Password', 'kobo12345'); await press('Create account'); await waitFor(() => has('An account with this email already exists.'), 3000); await press('Sign in instead'); await waitFor(() => path() === '/sign-in', 3000); return true;", fail: "On ApiError status 409, show the message and <Link href=\"/sign-in\">Sign in instead</Link>." },
            { label: "Signing up lands in the app, with no way back", check: "await restart(); await waitFor(() => has('Create an account'), 3000); await press('Create an account'); await waitFor(() => exists({ placeholder: 'Name' }), 3000); await typeInto('Name', ' Chidi '); await typeInto('Email', 'chidi@example.com'); await typeInto('Password', 'kobo12345'); await press('Create account'); await waitFor(() => has('Welcome, Chidi'), 3000); return !canGoBack();", fail: "await signUp({ name: name.trim(), … }); the guards do the rest." },
          ],
          hint: "ApiError (exported from the session file) carries the status.",
          successMessage: "A sign-up that catches mistakes early, explains every problem, and moves on by itself.",
        }),
      },
      {
        id: "a-md-email-verification",
        title: "Email verification",
        explain:
          "VERIFYING an e-mail proves the person owns it, which you need before sending receipts, resetting passwords or trusting it as an identity. The usual mobile flow is a short CODE (6 digits) rather than a link, because typing a code doesn't depend on the e-mail opening the right app. Server rules: generate the code randomly; store only its HASH; give it an EXPIRY (10–15 minutes); limit wrong ATTEMPTS (or anyone could try all million codes); limit RESENDS; answer resend requests the same way whether or not the account exists; and refuse sign-in until verified with a clear, machine-readable reason (code: \"email_not_verified\"), so the app can show the code screen. On iOS, textContentType=\"oneTimeCode\" (autoComplete=\"one-time-code\") lets the keyboard suggest the code from Mail or Messages.",
        webLab: expoLab({
          name: "Kobo",
          layout: null,
          task:
            "In server/index.js: when registering, e-mail a random 6-digit code with sendEmail (store only crypto.sha256 of it, expiring after 15 minutes of now()); POST /auth/verify { email, code } marks the account verified and returns { token }, or answers 400 \"That code is wrong or has expired\" (also after 5 wrong attempts, or once used); POST /auth/resend sends a new code, at most 3 per hour (429 after that), with the same answer for unknown e-mails; POST /auth/login answers 403 { message: \"Verify your email first\", code: \"email_not_verified\" } until verified.",
          files: { "server/index.js": VERIFY_START, "src/app/index.tsx": serverOnly },
          readOnly: ["src/app/index.tsx"],
          solution: { "server/index.js": VERIFY_MODEL },
          tests: [
            { label: "Registering e-mails a code; sign-in waits for it", check: `${call("POST", "/auth/register", "{ email: 'ada@example.com', password: 'kobo1234' }")}; const mail = ${outbox}[0]; const login = ${call("POST", "/auth/login", "{ email: 'ada@example.com', password: 'kobo1234' }")}; const body = await login.json(); return mail.to === 'ada@example.com' && /\\b\\d{6}\\b/.test(mail.text) && login.status === 403 && body.code === 'email_not_verified';`, fail: "sendEmail in register; 403 with code \"email_not_verified\" in login." },
            { label: "Only a hash of the code is stored", check: `const code = ${codeFrom("ada@example.com")}; return !JSON.stringify(${jsonOf("fetch('https://api.example.com/debug/users')")}).includes(code);`, fail: "user.codeHash = crypto.sha256(code)" },
            { label: "A wrong code fails; the right one verifies, once", check: `const code = ${codeFrom("ada@example.com")}; const wrong = ${call("POST", "/auth/verify", "{ email: 'ada@example.com', code: '000000' }")}; const right = ${call("POST", "/auth/verify", "{ email: 'ada@example.com', code }")}; const again = ${call("POST", "/auth/verify", "{ email: 'ada@example.com', code }")}; const login = ${call("POST", "/auth/login", "{ email: 'ada@example.com', password: 'kobo1234' }")}; return wrong.status === 400 && (await wrong.json()).message === 'That code is wrong or has expired' && right.status === 200 && !!(await right.json()).token && again.status === 400 && login.status === 200;`, fail: "Compare hashes; mark verified; clear the code." },
            { label: "Codes expire, and guessing is limited", check: `${call("POST", "/auth/register", "{ email: 'bisi@example.com', password: 'kobo1234' }")}; const code = ${codeFrom("bisi@example.com")}; await advance(16 * 60); const late = ${call("POST", "/auth/verify", "{ email: 'bisi@example.com', code }")}; ${call("POST", "/auth/register", "{ email: 'chidi@example.com', password: 'kobo1234' }")}; const c2 = ${codeFrom("chidi@example.com")}; for (let i = 0; i < 5; i++) ${call("POST", "/auth/verify", "{ email: 'chidi@example.com', code: '11111' + i }")}; const after = ${call("POST", "/auth/verify", "{ email: 'chidi@example.com', code: c2 }")}; return late.status === 400 && after.status === 400;`, fail: "now() > codeExpires, and attempts >= 5, both refuse." },
            { label: "Resends are limited, and don't reveal accounts", check: `${call("POST", "/auth/register", "{ email: 'dayo@example.com', password: 'kobo1234' }")}; const codes = []; for (let i = 0; i < 3; i++) codes.push((${call("POST", "/auth/resend", "{ email: 'dayo@example.com' }")}).status); const fourth = ${call("POST", "/auth/resend", "{ email: 'dayo@example.com' }")}; const a = ${jsonOf(call("POST", "/auth/resend", "{ email: 'nobody@example.com' }"))}; const b = ${jsonOf(call("POST", "/auth/resend", "{ email: 'ada@example.com' }"))}; return codes.every((s) => s === 200) && fourth.status === 429 && a.message === b.message;`, fail: "Keep recent resend times per user; same message for unknown e-mails." },
          ],
          hint: "now() comes from practice-server; checks can move the clock forward.",
          successMessage: "Codes that are random, hashed, expiring, limited and never leak who has an account.",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════ LESSON 92 · 15.3 – 15.4 ═══════════════ */
  {
    id: "md-l92-reset-persist",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 2,
    covers: ["15.3", "15.4"],
    title: "Password Reset and Staying Signed In",
    subtitle: "Recovering an account safely, and remembering the user without a flash",
    estimatedMinutes: 55,
    intro: "People forget passwords, and expect to stay signed in for months. Both are where attackers look first.",
    atoms: [
      {
        id: "a-md-password-reset",
        title: "Password reset",
        explain:
          "The safe flow: the user enters their e-mail; the server ALWAYS answers the same (\"If an account exists, we've sent a link\"), so the form can't be used to discover accounts; if the account exists it e-mails a link with a long RANDOM token (in a mobile app, a deep link such as kobo://reset-password?token=…, or better a universal/app link, Module 17). Store only the token's HASH, with a short EXPIRY (15–60 minutes), and make it SINGLE-USE. When the new password is set, sign the user out EVERYWHERE (anyone who stole a session loses it), for example by raising a token version that every session token carries. Rate-limit the request form too.",
        webLab: expoLab({
          name: "Kobo",
          layout: null,
          task:
            "In server/index.js: POST /auth/forgot { email } always answers 200 { message: \"If an account exists for that email, we've sent a reset link.\" }, and for a real account e-mails a link kobo://reset-password?token=<randomToken()>, storing only the token's hash with a 30-minute expiry; POST /auth/reset { token, password } (400 \"This reset link is invalid or has expired\" for a wrong, used or expired token; 400 for a password under 8 characters) sets the new password, makes the token unusable, and raises the user's tokenVersion so every existing session ends.",
          files: { "server/index.js": RESET_START, "src/app/index.tsx": serverOnly },
          readOnly: ["src/app/index.tsx"],
          solution: { "server/index.js": RESET_MODEL },
          tests: [
            { label: "The answer is the same for any e-mail; only real accounts get mail", check: `const a = ${jsonOf(call("POST", "/auth/forgot", "{ email: 'nobody@example.com' }"))}; const none = ${outbox}.length; const b = ${jsonOf(call("POST", "/auth/forgot", "{ email: 'ada@example.com' }"))}; const box = ${outbox}; return a.message === b.message && none === 0 && box.length === 1 && /kobo:\\/\\/reset-password\\?token=[a-f0-9]{20,}/.test(box[0].text);`, fail: "Answer the same; e-mail only when the user exists." },
            { label: "Resetting works, once, and ends old sessions", check: `const old = ${jsonOf(call("POST", "/auth/login", "{ email: 'ada@example.com', password: 'kobo1234' }"))}.token; ${call("POST", "/auth/forgot", "{ email: 'ada@example.com' }")}; const token = ${resetToken}; const ok = ${call("POST", "/auth/reset", "{ token, password: 'new-secret-9' }")}; const reuse = ${call("POST", "/auth/reset", "{ token, password: 'another-pass-1' }")}; const me = ${call("GET", "/me", null, "old")}; const oldPw = ${call("POST", "/auth/login", "{ email: 'ada@example.com', password: 'kobo1234' }")}; const newPw = ${call("POST", "/auth/login", "{ email: 'ada@example.com', password: 'new-secret-9' }")}; return ok.status === 200 && reuse.status === 400 && (await reuse.json()).message === 'This reset link is invalid or has expired' && me.status === 401 && oldPw.status === 401 && newPw.status === 200;`, fail: "Single use (clear the hash), and tokenVersion++." },
            { label: "Links expire, and weak passwords are refused", check: `${call("POST", "/auth/forgot", "{ email: 'ada@example.com' }")}; const token = ${resetToken}; const weak = ${call("POST", "/auth/reset", "{ token, password: 'short' }")}; await advance(31 * 60); const late = ${call("POST", "/auth/reset", "{ token, password: 'long-enough-1' }")}; return weak.status === 400 && late.status === 400;`, fail: "resetExpires = now() + 30 minutes; check the length." },
          ],
          hint: "crypto.sha256(token) gives the hash to store and to look up.",
          successMessage: "A reset flow that reveals nothing, can't be replayed, and locks out anyone who had a session.",
        }),
      },
      {
        id: "a-md-session-persistence",
        title: "Session persistence",
        explain:
          "Users expect to open the app months later and still be signed in. Keep the session in SecureStore (Module 12) and RESTORE it at start-up. The common mistake is rendering before restoring finishes: the sign-in screen flashes, or a guard sends the user to sign-in and back. The fix: keep the SPLASH SCREEN up while restoring. Call SplashScreen.preventAutoHideAsync() at the top of the root layout file (expo-router re-exports SplashScreen; the native splash is configured with the expo-splash-screen plugin in app.json), render nothing while restoring, and call SplashScreen.hideAsync() as soon as you know. Restoring should be quick: read the token, and refresh it in the background if needed, rather than blocking on a slow network.",
        webLab: expoLab({
          name: "Kobo",
          layout: PERSIST_ROOT_START,
          editable: ["src/app/_layout.tsx"],
          task:
            "Sign in, then restart the app: the sign-in screen flashes before the home screen appears. In src/app/_layout.tsx, keep the splash screen up (SplashScreen.preventAutoHideAsync() at the top of the file) and render nothing while the session is being restored, then hide the splash screen (SplashScreen.hideAsync()) once restoring is done. The session provider (given) exposes restoring.",
          app: { plugins: [["expo-splash-screen", { image: "./assets/images/splash-icon.png", imageWidth: 200, resizeMode: "contain", backgroundColor: "#ffffff" }]] },
          files: { "src/app/index.tsx": PERSIST_HOME, "src/app/sign-in.tsx": PERSIST_SIGN_IN, "src/context/session.tsx": PERSIST_SESSION, "src/debug/renders.ts": RENDERS },
          readOnly: ["src/app/index.tsx", "src/app/sign-in.tsx", "src/context/session.tsx", "src/debug/renders.ts"],
          open: "src/app/_layout.tsx",
          solution: { "src/app/_layout.tsx": PERSIST_ROOT_MODEL },
          tests: [
            { label: "Signed in, reopening goes straight home: no sign-in flash", check: "await waitFor(() => has('Sign in'), 3000); await press('Sign in'); await waitFor(() => hasText('Welcome back'), 3000); await restart(); await waitFor(() => hasText('Welcome back, Ada'), 3000); const r = load('src/debug/renders.ts').renders; return !r.SignIn;", fail: "if (restoring) return null; so neither screen renders until the session is known." },
            { label: "The splash screen stays up while restoring, then hides", check: "await restart(); await waitFor(() => hasText('Welcome back') || has('Sign in'), 3000); const c = code('src/app/_layout.tsx'); return !splashVisible() && c.includes('preventAutoHideAsync') && c.includes('hideAsync');", fail: "SplashScreen.preventAutoHideAsync() at the top, SplashScreen.hideAsync() when restoring is false." },
            { label: "Signed out, the sign-in screen appears", check: "await waitFor(() => has('Sign out'), 3000); await press('Sign out'); await restart(); await waitFor(() => has('Sign in'), 3000); return !splashVisible() && path() === '/sign-in';", fail: "Hide the splash screen in both cases." },
          ],
          hint: "SplashScreen is exported by expo-router.",
          successMessage: "The app opens exactly where the user belongs, behind the splash screen, with no flash.",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════ LESSON 93 · 15.5 – 15.6 ═══════════════ */
  {
    id: "md-l93-tokens-logout",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 3,
    covers: ["15.5", "15.6"],
    title: "Access Tokens, Refresh Tokens and Secure Logout",
    subtitle: "Short-lived keys, renewed quietly, and revoked for real",
    estimatedMinutes: 60,
    intro: "A token that lasts forever is a key that, once stolen, works forever. Modern apps use two tokens instead.",
    atoms: [
      {
        id: "a-md-refresh-tokens",
        title: "Access tokens and refresh tokens",
        explain:
          "An ACCESS TOKEN (often a JWT) is sent with every request and lives briefly (5–15 minutes), so a stolen one is soon useless; the server can check it without a database lookup. A REFRESH TOKEN lives long (weeks), is sent ONLY to the refresh endpoint, is stored by the server (as a hash) so it can be revoked, and is ROTATED: each use returns a new pair and retires the old one; if a retired one is used again, it was probably stolen, so the server revokes the whole family. In the app: keep both in SecureStore; when a request gets 401, refresh ONCE and retry; if several requests fail together, they must share ONE refresh (otherwise the second refresh reuses a rotated token and signs the user out); if refreshing fails, the session is over.",
        webLab: expoLab({
          name: "Kobo",
          layout: `import { Stack } from "expo-router";\n\nexport default function RootLayout() {\n  return (\n    <Stack>\n      <Stack.Screen name="index" options={{ title: "Account" }} />\n    </Stack>\n  );\n}\n`,
          task:
            "Write apiFetch in src/auth/client.ts: send the access token; on a 401, renew with POST /auth/refresh { refreshToken } and send the request again; requests failing at the same time share ONE renewal; save the new pair (the server rotates refresh tokens); and if renewal fails, clearTokens() and call signedOut(). Access tokens last 15 minutes, refresh tokens 30 days.",
          files: { "src/auth/client.ts": CLIENT_START, "src/auth/tokenStorage.ts": TOKEN_STORE, "src/app/index.tsx": REFRESH_SCREEN, "server/index.js": REFRESH_SERVER },
          readOnly: ["src/auth/tokenStorage.ts", "src/app/index.tsx", "server/index.js"],
          solution: { "src/auth/client.ts": CLIENT_MODEL },
          tests: [
            { label: "An expired access token is renewed without the user noticing", check: "await press('Sign in'); await waitFor(() => has('Hello, Ada'), 3000); const before = secureStore().refresh_token; await advance(16 * 60); await press('Refresh'); await wait(800); return has('Hello, Ada') && has('1 order') && secureStore().refresh_token !== before;", fail: "On 401: POST /auth/refresh, saveTokens(new pair), send again." },
            { label: "Three failing requests share one renewal", check: "await advance(16 * 60); const n = " + refreshCalls + "; await press('Refresh'); await wait(800); return " + refreshCalls + " - n === 1 && has('Hello, Ada') && has('1 notification');", fail: "Keep the renewal in a shared promise: refreshing ??= refresh()." },
            { label: "When renewal fails, the user is signed out cleanly", check: "await advance(31 * 24 * 60 * 60); await press('Refresh'); await waitFor(() => has('Signed out: please sign in again'), 3000); return !('refresh_token' in secureStore()) && !('access_token' in secureStore());", fail: "If refresh isn't ok: clearTokens(); signedOut();" },
          ],
          hint: "The shared promise must be cleared (finally) once the renewal finishes.",
          successMessage: "Short-lived access, quiet renewal, one refresh at a time, and a clean ending.",
        }),
      },
      {
        id: "a-md-secure-logout",
        title: "Secure logout",
        explain:
          "Deleting tokens on the phone (Module 12) is only half of signing out: a copied refresh token would still work. Secure logout also tells the SERVER to revoke that device's refresh token (POST /auth/logout); do it before clearing local data, and clear locally even if the request fails (offline). Offer \"Sign out of all devices\" (after a password change, a lost phone or suspicious activity): revoke every refresh token of the user, and make existing access tokens stop working too, for example with a token version stored on the user and checked on every request (otherwise they stay valid until they expire). Only let users revoke their OWN sessions.",
        webLab: expoLab({
          name: "Kobo",
          layout: null,
          task:
            "In server/index.js: POST /auth/logout (signed in) deletes the given refresh token if it belongs to the user, then 204; POST /auth/logout-all (signed in) deletes all of the user's refresh tokens and raises their tokenVersion, so access tokens already issued stop working too, then 204. Both answer 401 without a valid access token.",
          files: { "server/index.js": LOGOUT_START, "src/app/index.tsx": serverOnly },
          readOnly: ["src/app/index.tsx"],
          solution: { "server/index.js": LOGOUT_MODEL },
          tests: [
            { label: "Logging out revokes this device only", check: `${device(1)} ${device(2)} const out = ${call("POST", "/auth/logout", "{ refreshToken: d1.refreshToken }", "d1.accessToken")}; const r1 = ${call("POST", "/auth/refresh", "{ refreshToken: d1.refreshToken }")}; const r2 = ${call("POST", "/auth/refresh", "{ refreshToken: d2.refreshToken }")}; return out.status === 204 && r1.status === 401 && r2.status === 200;`, fail: "Delete the hash of the given refresh token." },
            { label: "Logout needs a signed-in user", check: `${device(3)} const r = ${call("POST", "/auth/logout", "{ refreshToken: d3.refreshToken }")}; const still = ${call("POST", "/auth/refresh", "{ refreshToken: d3.refreshToken }")}; return r.status === 401 && still.status === 200;`, fail: "userFrom(req) first; 401 without it." },
            { label: "Logging out everywhere ends every session at once", check: `${device(4)} ${device(5)} const all = ${call("POST", "/auth/logout-all", null, "d5.accessToken")}; const a = ${call("POST", "/auth/refresh", "{ refreshToken: d4.refreshToken }")}; const b = ${call("POST", "/auth/refresh", "{ refreshToken: d5.refreshToken }")}; const me = ${call("GET", "/me", null, "d4.accessToken")}; return all.status === 204 && a.status === 401 && b.status === 401 && me.status === 401;`, fail: "Delete every refresh token of the user, and users[userId].tokenVersion++." },
          ],
          hint: "userFrom(req) already checks tokenVersion.",
          successMessage: "Signing out means signed out, on this device or on all of them.",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════ LESSON 94 · 15.7 – 15.8 ═══════════════ */
  {
    id: "md-l94-roles-expiry",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 4,
    covers: ["15.7", "15.8"],
    title: "Roles, Permissions and Expired Sessions",
    subtitle: "Who may do what, and ending a session gracefully",
    estimatedMinutes: 55,
    intro: "Most apps have more than one kind of user, and every session ends one day. Both deserve careful design.",
    atoms: [
      {
        id: "a-md-rbac",
        title: "Role-based access control",
        explain:
          "ROLE-BASED ACCESS CONTROL gives each user a role (member, moderator, admin) and each role a list of PERMISSIONS (\"notices:delete:any\", \"users:mute\"). Check permissions, not role names, in your code: requirePermission(\"users:mute\") reads clearly, and changing what moderators may do is one edit in one map. Combine with ownership (members delete their OWN notices). Guard the dangerous edges: nobody changes their own role, roles come from a fixed list, and only admins grant roles. Send the user's permissions to the app (GET /me) so it can hide buttons they can't use, but remember the app only HIDES; the server DECIDES.",
        webLab: expoLab({
          name: "Kobo",
          layout: null,
          task:
            "In server/index.js: define PERMISSIONS (member: notices:create, notices:delete:own; moderator: those plus notices:delete:any, users:mute; admin: those plus users:role) and return them from GET /me; DELETE /notices/:id for the author (with notices:delete:own) or anyone with notices:delete:any; POST /users/:id/mute needs users:mute; PATCH /users/:id/role needs users:role, refuses changing your own role (400) and unknown roles (400). Refuse with 403 \"You don't have permission to do that\".",
          files: { "server/index.js": RBAC_START, "src/app/index.tsx": serverOnly },
          readOnly: ["src/app/index.tsx"],
          solution: { "server/index.js": RBAC_MODEL },
          tests: [
            { label: "/me lists each role's permissions", check: `const a = ${jsonOf(call("GET", "/me", null, "'ada-token'"))}; const t = ${jsonOf(call("GET", "/me", null, "'tunde-token'"))}; return a.permissions.join() === 'notices:create,notices:delete:own' && t.permissions.includes('users:role') && t.permissions.includes('users:mute');`, fail: "One PERMISSIONS map, each role building on the one below." },
            { label: "Members delete only their own notices; moderators any", check: `const a = ${call("DELETE", "/notices/2", null, "'ada-token'")}; const b = ${call("DELETE", "/notices/1", null, "'ada-token'")}; const c = ${call("DELETE", "/notices/2", null, "'bisi-token'")}; return a.status === 403 && (await a.json()).message === "You don't have permission to do that" && b.status === 204 && c.status === 204;`, fail: "Own (with :own) or notices:delete:any." },
            { label: "Muting needs users:mute", check: `const a = ${call("POST", "/users/u3/mute", null, "'ada-token'")}; const b = ${call("POST", "/users/u1/mute", null, "'bisi-token'")}; return a.status === 403 && b.status === 200;`, fail: "requirePermission(\"users:mute\") before the handler." },
            { label: "Only admins change roles, never their own, only to real roles", check: `const a = ${call("PATCH", "/users/u1/role", "{ role: 'admin' }", "'bisi-token'")}; const self = ${call("PATCH", "/users/u3/role", "{ role: 'member' }", "'tunde-token'")}; const bad = ${call("PATCH", "/users/u1/role", "{ role: 'superuser' }", "'tunde-token'")}; const ok = ${call("PATCH", "/users/u1/role", "{ role: 'moderator' }", "'tunde-token'")}; return a.status === 403 && self.status === 400 && bad.status === 400 && ok.status === 200;`, fail: "users:role, then refuse your own id and roles not in PERMISSIONS." },
          ],
          hint: "requirePermission can be middleware: app.post(path, requirePermission(\"users:mute\"), handler).",
          successMessage: "Roles and permissions in one map, checked on every request.",
        }),
      },
      {
        id: "a-md-expired-sessions",
        title: "Handling expired sessions",
        explain:
          "Sessions end: a refresh token expires, a password is changed elsewhere, an admin revokes access. Handle it in ONE place: when the API layer gets a 401 it can't fix, it tells the session provider, which signs out locally. Then be kind: say why (\"Your session expired. Please sign in again.\") rather than silently dumping the user on a sign-in screen; remember WHERE they were (the current path) and take them back after signing in; and don't lose their work (keep a half-written form as a draft). Never show a cascade of error alerts from every request that failed at the same moment.",
        webLab: expoLab({
          name: "Kobo",
          layout: EXPIRE_ROOT,
          task:
            "In src/context/session.tsx: register onSessionExpired (from src/services/api.ts) so that an expired session remembers the current path (usePathname), shows \"Your session expired. Please sign in again.\" on the sign-in screen (notice), and signs out (token null; the guards show sign-in); after signing in again, clear the notice and take the user back to the remembered path. Tokens last 15 minutes.",
          files: {
            "src/context/session.tsx": EXPIRE_START,
            "src/services/api.ts": EXPIRE_API,
            "src/app/sign-in.tsx": EXPIRE_SIGN_IN,
            "src/app/index.tsx": EXPIRE_HOME,
            "src/app/orders/[id].tsx": EXPIRE_ORDER,
            "server/index.js": EXPIRE_SERVER,
          },
          readOnly: ["src/services/api.ts", "src/app/sign-in.tsx", "src/app/index.tsx", "src/app/orders/[id].tsx", "server/index.js", "src/app/_layout.tsx"],
          solution: { "src/context/session.tsx": EXPIRE_MODEL },
          tests: [
            { label: "An expired session explains itself", check: "await press('Sign in'); await waitFor(() => has('Order #42'), 3000); await press('Order #42'); await waitFor(() => hasText('On its way'), 3000); await advance(16 * 60); await press('Refresh'); await waitFor(() => has('Your session expired. Please sign in again.'), 3000); return path() === '/sign-in';", fail: "onSessionExpired(() => { setNotice(…); setToken(null); })" },
            { label: "Signing in again returns to where the user was", check: "await waitFor(() => has('Sign in'), 3000); await press('Sign in'); await waitFor(() => path() === '/orders/42', 3000); await waitFor(() => hasText('On its way'), 3000); return !has('Your session expired. Please sign in again.');", fail: "Remember usePathname() when it expires; navigate there once the token is back." },
          ],
          hint: "Keep the current path in a ref, so the expiry callback (registered once) always sees the latest.",
          successMessage: "Sessions end gracefully: a clear reason, and straight back to where the user was.",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },
];
