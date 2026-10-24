/**
 * MOBILE APP DEVELOPMENT · MODULE 12 · FORMS AND PERSISTENT DATA (part 2)
 *
 * Curriculum 12.6 – 12.9: saving preferences, AsyncStorage, SecureStore
 * for session tokens, and SQLite for structured local data.
 *
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 */

import { expoLab } from "./md-helpers.js";
import { MODULE, SECTION_ID, titled } from "./md-m12-part1.js";

export const MONEY = `export const naira = (amount: number) => "₦" + amount.toLocaleString("en-NG");
`;

/* ── 12.6 · Preferences ──────────────────────────────────────────────── */
const PREFS_START = `import { useState } from "react";

export type Preferences = { theme: "system" | "light" | "dark"; pricesWithVat: boolean };

export const DEFAULTS: Preferences = { theme: "system", pricesWithVat: true };

/** The saved preferences, or the defaults. */
export function loadPreferences(): Preferences {
  return DEFAULTS;
}

export function savePreferences(preferences: Preferences) {}

export function usePreferences() {
  const [preferences, setPreferences] = useState(loadPreferences);
  const update = (changes: Partial<Preferences>) => setPreferences({ ...preferences, ...changes });
  return [preferences, update] as const;
}
`;
const PREFS_MODEL = `import Storage from "expo-sqlite/kv-store";
import { useState } from "react";

export type Preferences = { theme: "system" | "light" | "dark"; pricesWithVat: boolean };

export const DEFAULTS: Preferences = { theme: "system", pricesWithVat: true };

const KEY = "preferences";

/** The saved preferences, or the defaults. Synchronous, so the first frame is already right. */
export function loadPreferences(): Preferences {
  try {
    const raw = Storage.getItemSync(KEY);
    // Merge with the defaults, so preferences added in later versions get a value too.
    return raw ? { ...DEFAULTS, ...JSON.parse(raw) } : DEFAULTS;
  } catch {
    return DEFAULTS;
  }
}

export function savePreferences(preferences: Preferences) {
  Storage.setItemSync(KEY, JSON.stringify(preferences));
}

export function usePreferences() {
  const [preferences, setPreferences] = useState(loadPreferences);
  const update = (changes: Partial<Preferences>) => {
    const next = { ...preferences, ...changes };
    setPreferences(next);
    savePreferences(next);
  };
  return [preferences, update] as const;
}
`;
const PREFS_SCREEN = `import { Pressable, Switch, Text, View } from "react-native";
import { usePreferences, type Preferences } from "@/storage/preferences";

const THEMES: Preferences["theme"][] = ["system", "light", "dark"];

export default function Settings() {
  const [preferences, update] = usePreferences();
  return (
    <View style={{ padding: 20, gap: 12 }}>
      <Text style={{ fontWeight: "700" }}>Theme</Text>
      <View accessibilityRole="radiogroup" style={{ flexDirection: "row", gap: 8 }}>
        {THEMES.map((t) => (
          <Pressable key={t} accessibilityRole="radio" accessibilityState={{ checked: preferences.theme === t }} onPress={() => update({ theme: t })} style={{ flex: 1, minHeight: 44, justifyContent: "center", alignItems: "center", borderWidth: 1, borderColor: preferences.theme === t ? "#0f766e" : "#cbd5e1", borderRadius: 10 }}>
            <Text>{t}</Text>
          </Pressable>
        ))}
      </View>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Text style={{ flex: 1 }}>Show prices with VAT</Text>
        <Switch accessibilityLabel="Show prices with VAT" value={preferences.pricesWithVat} onValueChange={(v) => update({ pricesWithVat: v })} />
      </View>
    </View>
  );
}
`;

/* ── 12.7 · AsyncStorage ─────────────────────────────────────────────── */
const RECENT_START = `import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "recently_viewed";
const MAX = 5;

/** Product ids, most recent first. */
export async function getRecent(): Promise<string[]> {
  return [];
}

/** Records a view: the id moves to the front, with no duplicates and at most MAX ids. */
export async function addRecent(id: string): Promise<string[]> {
  return [];
}
`;
const RECENT_MODEL = `import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "recently_viewed";
const MAX = 5;

/** Product ids, most recent first. */
export async function getRecent(): Promise<string[]> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    const ids = raw ? JSON.parse(raw) : [];
    return Array.isArray(ids) ? ids : [];
  } catch {
    return [];
  }
}

/** Records a view: the id moves to the front, with no duplicates and at most MAX ids. */
export async function addRecent(id: string): Promise<string[]> {
  const ids = [id, ...(await getRecent()).filter((x) => x !== id)].slice(0, MAX);
  await AsyncStorage.setItem(KEY, JSON.stringify(ids));
  return ids;
}
`;
const RECENT_LAYOUT = `import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Shop" }} />
      <Stack.Screen name="product/[id]" options={{ title: "Product" }} />
    </Stack>
  );
}
`;
const RECENT_PRODUCTS = `export const PRODUCTS = ["Redmi Note 14", "Ankara tote bag", "Shea butter", "Raffia mat", "Adire scarf", "Clay pot", "Kente stole"].map((name, i) => ({ id: String(i + 1), name }));

export const productName = (id: string) => PRODUCTS.find((p) => p.id === id)?.name ?? "Unknown";
`;
const RECENT_HOME = `import { Link, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { ScrollView, Text } from "react-native";
import { PRODUCTS, productName } from "@/data/products";
import { getRecent } from "@/storage/recent";

export default function Shop() {
  const [recent, setRecent] = useState<string[]>([]);
  useFocusEffect(
    useCallback(() => {
      getRecent().then(setRecent);
    }, [])
  );
  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 4 }}>
      <Text testID="recent">Recently viewed: {recent.length ? recent.map(productName).join(", ") : "nothing yet"}</Text>
      {PRODUCTS.map((p) => (
        <Link key={p.id} href={"/product/" + p.id} style={{ paddingVertical: 12, fontSize: 16 }}>
          {p.name}
        </Link>
      ))}
    </ScrollView>
  );
}
`;
const RECENT_DETAIL = `import { Stack, useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { Text, View } from "react-native";
import { productName } from "@/data/products";
import { addRecent } from "@/storage/recent";

export default function Product() {
  const { id } = useLocalSearchParams<{ id: string }>();
  useEffect(() => {
    addRecent(id);
  }, [id]);
  return (
    <View style={{ padding: 20 }}>
      <Stack.Screen options={{ title: productName(id) }} />
      <Text style={{ fontSize: 22 }}>{productName(id)}</Text>
    </View>
  );
}
`;

/* ── 12.8 · SecureStore ──────────────────────────────────────────────── */
const AUTH_SERVER = `import { createServer, tokens } from "practice-server";

const app = createServer();
const SECRET = "practice-only-secret";

app.post("/auth/login", (req, res) => {
  const { email, password } = req.body || {};
  if (email !== "ada@example.com" || password !== "kobo1234") return res.status(401).json({ message: "Wrong email or password" });
  res.json({ token: tokens.sign({ sub: "u1", name: "Ada" }, SECRET, { expiresIn: "30d" }) });
});

app.get("/me", (req, res) => {
  try {
    const payload = tokens.verify((req.headers.authorization || "").replace("Bearer ", ""), SECRET);
    res.json({ name: payload.name });
  } catch {
    res.status(401).json({ message: "Please sign in again" });
  }
});

export default app;
`;
const TOKEN_START = `// Save, read and delete the session token, encrypted, with expo-secure-store.
`;
const TOKEN_MODEL = `import * as SecureStore from "expo-secure-store";

const KEY = "session_token";

export const saveToken = (token: string) => SecureStore.setItemAsync(KEY, token);

export const getToken = () => SecureStore.getItemAsync(KEY);

export const clearToken = () => SecureStore.deleteItemAsync(KEY);
`;
const SESSION_START = `import { createContext, useContext, useState, type ReactNode } from "react";
import { api } from "@/services/api";

type Session = { name: string } | null;
type SessionValue = { session: Session; restoring: boolean; signIn: (email: string, password: string) => Promise<void>; signOut: () => Promise<void> };

const SessionContext = createContext<SessionValue | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session>(null);
  const [restoring, setRestoring] = useState(false);

  async function signIn(email: string, password: string) {
    const { token } = await api<{ token: string }>("/auth/login", { method: "POST", body: { email, password } });
    const me = await api<{ name: string }>("/me", { token });
    setSession(me);
  }

  async function signOut() {
    setSession(null);
  }

  return <SessionContext.Provider value={{ session, restoring, signIn, signOut }}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const value = useContext(SessionContext);
  if (!value) throw new Error("useSession must be used inside <SessionProvider>");
  return value;
}
`;
const SESSION_MODEL = `import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { clearToken, getToken, saveToken } from "@/auth/tokenStorage";
import { api } from "@/services/api";

type Session = { name: string } | null;
type SessionValue = { session: Session; restoring: boolean; signIn: (email: string, password: string) => Promise<void>; signOut: () => Promise<void> };

const SessionContext = createContext<SessionValue | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session>(null);
  const [restoring, setRestoring] = useState(true);

  // On start: a saved token means the user is still signed in, if the server agrees.
  useEffect(() => {
    (async () => {
      try {
        const token = await getToken();
        if (token) setSession(await api<{ name: string }>("/me", { token }));
      } catch {
        await clearToken();
      } finally {
        setRestoring(false);
      }
    })();
  }, []);

  async function signIn(email: string, password: string) {
    const { token } = await api<{ token: string }>("/auth/login", { method: "POST", body: { email, password } });
    await saveToken(token);
    setSession(await api<{ name: string }>("/me", { token }));
  }

  async function signOut() {
    await clearToken();
    setSession(null);
  }

  return <SessionContext.Provider value={{ session, restoring, signIn, signOut }}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const value = useContext(SessionContext);
  if (!value) throw new Error("useSession must be used inside <SessionProvider>");
  return value;
}
`;
const API_HELPER = `type Options = { method?: string; body?: unknown; token?: string | null };

export async function api<T>(path: string, { method = "GET", body, token }: Options = {}): Promise<T> {
  const response = await fetch("https://api.example.com" + path, {
    method,
    headers: { "Content-Type": "application/json", ...(token ? { Authorization: "Bearer " + token } : {}) },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message ?? "Request failed");
  return data as T;
}
`;
const AUTH_LAYOUT = `import { Stack } from "expo-router";
import { SessionProvider } from "@/context/session";

export default function RootLayout() {
  return (
    <SessionProvider>
      <Stack>
        <Stack.Screen name="index" options={{ title: "Kobo" }} />
      </Stack>
    </SessionProvider>
  );
}
`;
const AUTH_HOME = `import { useState } from "react";
import { ActivityIndicator, Pressable, Text, TextInput, View } from "react-native";
import { useSession } from "@/context/session";

export default function Home() {
  const { session, restoring, signIn, signOut } = useSession();
  const [email, setEmail] = useState("ada@example.com");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  if (restoring) return <ActivityIndicator style={{ marginTop: 40 }} />;

  if (session) {
    return (
      <View style={{ padding: 20, gap: 12 }}>
        <Text style={{ fontSize: 22 }}>Hello, {session.name}</Text>
        <Pressable accessibilityRole="button" onPress={signOut} style={{ minHeight: 48, justifyContent: "center" }}>
          <Text>Sign out</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={{ padding: 20, gap: 10 }}>
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} autoCapitalize="none" style={{ minHeight: 48, borderWidth: 1, borderColor: "#cbd5e1", borderRadius: 10, paddingHorizontal: 12 }} />
      <TextInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry style={{ minHeight: 48, borderWidth: 1, borderColor: "#cbd5e1", borderRadius: 10, paddingHorizontal: 12 }} />
      {error ? <Text>{error}</Text> : null}
      <Pressable accessibilityRole="button" onPress={() => signIn(email, password).catch((e: Error) => setError(e.message))} style={{ minHeight: 48, justifyContent: "center" }}>
        <Text>Sign in</Text>
      </Pressable>
    </View>
  );
}
`;

/* ── 12.9 · SQLite ───────────────────────────────────────────────────── */
export const MIGRATE_MODEL = `import type { SQLiteDatabase } from "expo-sqlite";

const DATABASE_VERSION = 1;

/** Creates or upgrades the tables; PRAGMA user_version records how far it has got. */
export async function migrate(db: SQLiteDatabase) {
  const row = await db.getFirstAsync<{ user_version: number }>("PRAGMA user_version");
  let version = row?.user_version ?? 0;
  if (version >= DATABASE_VERSION) return;
  if (version === 0) {
    await db.execAsync(
      "CREATE TABLE IF NOT EXISTS expenses (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL, amount REAL NOT NULL, category TEXT NOT NULL, spent_on TEXT NOT NULL);"
    );
    version = 1;
  }
  await db.execAsync("PRAGMA user_version = " + DATABASE_VERSION);
}
`;
export const EXPENSES_REPO_MODEL = `import type { SQLiteDatabase } from "expo-sqlite";

export type Expense = { id: number; title: string; amount: number; category: string; spent_on: string };
export type NewExpense = Omit<Expense, "id">;

export async function addExpense(db: SQLiteDatabase, e: NewExpense) {
  const result = await db.runAsync(
    "INSERT INTO expenses (title, amount, category, spent_on) VALUES (?, ?, ?, ?)",
    e.title,
    e.amount,
    e.category,
    e.spent_on
  );
  return result.lastInsertRowId;
}

export function listExpenses(db: SQLiteDatabase) {
  return db.getAllAsync<Expense>("SELECT * FROM expenses ORDER BY spent_on DESC, id DESC");
}

export function totalsByCategory(db: SQLiteDatabase) {
  return db.getAllAsync<{ category: string; total: number }>(
    "SELECT category, SUM(amount) AS total FROM expenses GROUP BY category ORDER BY total DESC"
  );
}
`;
const SQL_START_MIGRATE = `import type { SQLiteDatabase } from "expo-sqlite";

/** Creates the expenses table the first time the app opens the database. */
export async function migrate(db: SQLiteDatabase) {}
`;
const SQL_START_REPO = `import type { SQLiteDatabase } from "expo-sqlite";

export type Expense = { id: number; title: string; amount: number; category: string; spent_on: string };
export type NewExpense = Omit<Expense, "id">;

export async function addExpense(db: SQLiteDatabase, e: NewExpense) {}

export async function listExpenses(db: SQLiteDatabase): Promise<Expense[]> {
  return [];
}

export async function totalsByCategory(db: SQLiteDatabase): Promise<{ category: string; total: number }[]> {
  return [];
}
`;
const SQL_LAYOUT = `import { Stack } from "expo-router";
import { SQLiteProvider } from "expo-sqlite";
import { migrate } from "@/db/migrate";

export default function RootLayout() {
  return (
    <SQLiteProvider databaseName="expenses.db" onInit={migrate}>
      <Stack>
        <Stack.Screen name="index" options={{ title: "Expenses" }} />
      </Stack>
    </SQLiteProvider>
  );
}
`;
const SQL_SCREEN = `import { useSQLiteContext } from "expo-sqlite";
import { useCallback, useEffect, useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { addExpense, listExpenses, totalsByCategory, type Expense } from "@/db/expenses";
import { naira } from "@/utils/money";

const CATEGORIES = ["Food", "Transport", "Data"];

export default function Expenses() {
  const db = useSQLiteContext();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [totals, setTotals] = useState<{ category: string; total: number }[]>([]);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food");

  const refresh = useCallback(async () => {
    setExpenses(await listExpenses(db));
    setTotals(await totalsByCategory(db));
  }, [db]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  async function add() {
    await addExpense(db, { title: title.trim(), amount: Number(amount), category, spent_on: "2026-10-21" });
    setTitle("");
    setAmount("");
    await refresh();
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 8 }}>
      <TextInput placeholder="What for?" value={title} onChangeText={setTitle} style={{ minHeight: 48, borderWidth: 1, borderColor: "#cbd5e1", borderRadius: 10, paddingHorizontal: 12 }} />
      <TextInput placeholder="Amount" value={amount} onChangeText={setAmount} keyboardType="decimal-pad" style={{ minHeight: 48, borderWidth: 1, borderColor: "#cbd5e1", borderRadius: 10, paddingHorizontal: 12 }} />
      <View style={{ flexDirection: "row", gap: 8 }}>
        {CATEGORIES.map((c) => (
          <Pressable key={c} accessibilityRole="radio" accessibilityState={{ checked: c === category }} onPress={() => setCategory(c)} style={{ flex: 1, minHeight: 44, justifyContent: "center", alignItems: "center", borderWidth: 1, borderColor: c === category ? "#0f766e" : "#cbd5e1", borderRadius: 10 }}>
            <Text>{c}</Text>
          </Pressable>
        ))}
      </View>
      <Pressable accessibilityRole="button" onPress={add} style={{ minHeight: 48, justifyContent: "center" }}>
        <Text>Add expense</Text>
      </Pressable>
      {totals.map((t) => (
        <Text key={t.category} testID="total">{t.category} {naira(t.total)}</Text>
      ))}
      {expenses.map((e) => (
        <Text key={e.id} testID="expense">{e.title} · {naira(e.amount)}</Text>
      ))}
    </ScrollView>
  );
}
`;
const addVia = (title, amount, category) => `await typeInto('What for?', ${JSON.stringify(title)}); await typeInto('Amount', '${amount}'); await press({ role: 'radio', name: '${category}' }); await press('Add expense'); await wait(200);`;

export const PART2 = [
  /* ═══════════════ LESSON 73 · 12.6 – 12.7 ═══════════════ */
  {
    id: "md-l73-local-storage",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 4,
    covers: ["12.6", "12.7"],
    title: "Saving Preferences and Small Data Locally",
    subtitle: "Key-value storage that survives closing the app",
    estimatedMinutes: 50,
    intro: "Everything in state disappears when the app is closed. Choices the user made, and small things the app remembers, need to be saved on the phone.",
    atoms: [
      {
        id: "a-md-preferences",
        title: "Saving preferences locally",
        explain:
          "Preferences (theme, units, notification choices) are small, not secret, and needed at the very first frame, or the app flashes the wrong theme. A KEY-VALUE store fits: expo-sqlite/kv-store is a drop-in key-value store built on SQLite whose synchronous methods (Storage.getItemSync, Storage.setItemSync) let you read preferences while creating state: useState(loadPreferences). Values are strings, so save JSON.stringify(preferences) under one key and JSON.parse it when loading. Two habits make it robust: wrap the parse in try/catch and fall back to defaults, and merge the saved object over the defaults, so a preference added in the next version of your app still gets a value.",
        webLab: expoLab({
          name: "Kobo",
          layout: titled("Settings"),
          task:
            "Make the settings survive closing the app. In src/storage/preferences.ts, loadPreferences() reads the \"preferences\" key from expo-sqlite/kv-store synchronously (falling back to DEFAULTS when nothing is saved or the saved text is broken, and merging saved values over DEFAULTS), savePreferences() writes it as JSON, and update() in usePreferences saves every change.",
          files: { "src/storage/preferences.ts": PREFS_START, "src/app/index.tsx": PREFS_SCREEN },
          readOnly: ["src/app/index.tsx"],
          solution: { "src/storage/preferences.ts": PREFS_MODEL },
          tests: [
            { label: "Changes are saved as JSON", check: "await press({ role: 'radio', name: 'dark' }); await toggle({ label: 'Show prices with VAT' }); const saved = JSON.parse(kvStore().preferences || 'null'); return !!saved && saved.theme === 'dark' && saved.pricesWithVat === false;", fail: "Storage.setItemSync(\"preferences\", JSON.stringify(next)) in update." },
            { label: "They are still there after closing the app", check: "await press({ role: 'radio', name: 'light' }); await restart(); await waitFor(() => exists({ role: 'radio', name: 'light' }), 2000); return find({ role: 'radio', name: 'light' }).getAttribute('aria-checked') === 'true';", fail: "loadPreferences reads Storage.getItemSync(\"preferences\")." },
            { label: "Missing or broken data falls back to the defaults", check: "const { loadPreferences } = load('src/storage/preferences.ts'); const c = code('src/storage/preferences.ts'); return loadPreferences().pricesWithVat !== undefined && /catch/.test(c) && c.includes('...DEFAULTS');", fail: "try { … JSON.parse … } catch { return DEFAULTS; }, and { ...DEFAULTS, ...saved }." },
          ],
          hint: "import Storage from \"expo-sqlite/kv-store\";",
          successMessage: "Settings that are right from the first frame, every time the app opens.",
        }),
      },
      {
        id: "a-md-async-storage",
        title: "AsyncStorage or an appropriate alternative",
        explain:
          "@react-native-async-storage/async-storage is the classic React Native key-value store, and expo-sqlite/kv-store offers the same API. Both are ASYNCHRONOUS (await AsyncStorage.getItem(key)), store STRINGS only (JSON for anything else), are NOT encrypted (never tokens or passwords: next lesson), and suit small data: settings, a draft, a recently viewed list, a cache of the last API response. getItem returns null for a missing key; always handle that and a parse failure. For lists of records you need to search, filter or count, use SQLite instead. Data stays until the app is uninstalled (or its data is cleared in the phone's settings), and is also cleared when you choose to, for example at sign-out (Lesson 75).",
        webLab: expoLab({
          name: "Kobo",
          layout: RECENT_LAYOUT,
          task:
            "Write the recently viewed list in src/storage/recent.ts with AsyncStorage under the key \"recently_viewed\": getRecent() returns the saved ids, newest first ([] when nothing is saved or it can't be read); addRecent(id) moves the id to the front without duplicates, keeps at most 5, saves, and returns the new list. Opening a product already calls addRecent.",
          files: { "src/storage/recent.ts": RECENT_START, "src/app/index.tsx": RECENT_HOME, "src/app/product/[id].tsx": RECENT_DETAIL, "src/data/products.ts": RECENT_PRODUCTS },
          readOnly: ["src/app/index.tsx", "src/app/product/[id].tsx", "src/data/products.ts"],
          solution: { "src/storage/recent.ts": RECENT_MODEL },
          tests: [
            { label: "Opening products fills the list, newest first", check: "await press('Shea butter'); await waitFor(() => screenTitle() === 'Shea butter', 2000); await back(); await press('Redmi Note 14'); await waitFor(() => screenTitle() === 'Redmi Note 14', 2000); await back(); await waitFor(() => hasText('Recently viewed: Redmi Note 14, Shea butter'), 2000); return JSON.parse(asyncStore().recently_viewed).join() === '1,3';", fail: "Save JSON.stringify(ids) under \"recently_viewed\"." },
            { label: "No duplicates, at most five", check: "const { addRecent } = load('src/storage/recent.ts'); for (const id of ['1', '2', '3', '4', '5', '6', '2']) await addRecent(id); const ids = JSON.parse(asyncStore().recently_viewed); return ids.join() === '2,6,5,4,3';", fail: "[id, ...old.filter((x) => x !== id)].slice(0, 5)" },
            { label: "The list survives a restart", check: "await restart(); await waitFor(() => hasText('Recently viewed:'), 2000); return !hasText('nothing yet');", fail: "getRecent reads the saved list." },
            { label: "Missing data is handled", check: "const c = code('src/storage/recent.ts'); return /catch/.test(c) && /:\\s*\\[\\]/.test(c);", fail: "raw ? JSON.parse(raw) : [], inside try/catch." },
          ],
          hint: "addRecent can build on getRecent.",
          successMessage: "A small list the app remembers, safely parsed every time.",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════ LESSON 74 · 12.8 – 12.9 ═══════════════ */
  {
    id: "md-l74-secure-sqlite",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 5,
    covers: ["12.8", "12.9"],
    title: "SecureStore for Secrets, SQLite for Records",
    subtitle: "Encrypted storage for tokens, and a real database on the phone",
    estimatedMinutes: 60,
    intro: "Two very different kinds of data need two different stores: a session token must be encrypted, and hundreds of records need a database.",
    atoms: [
      {
        id: "a-md-secure-store",
        title: "SecureStore for sensitive local values such as session tokens",
        explain:
          "expo-secure-store encrypts values with the phone's own secure hardware: the iOS KEYCHAIN and, on Android, values encrypted with keys held in the Android KEYSTORE. Use it for anything that would let someone act as the user: session and refresh tokens, API keys the user entered, a PIN. Never store passwords themselves: store the token the server gives you after sign-in. The pattern: after signing in, saveToken(token); when the app starts, getToken() and, if there is one, check it with the server (it may have expired) while showing a loading state; at sign-out, deleteItemAsync. Keep values small (a few kilobytes at most). Keys may only contain letters, digits, \".\", \"-\" and \"_\". On iOS, Keychain items can survive uninstalling the app, so don't treat \"a token exists\" as proof of a fresh install.",
        webLab: expoLab({
          name: "Kobo",
          layout: AUTH_LAYOUT,
          task:
            "Keep the user signed in between launches. In src/auth/tokenStorage.ts, write saveToken, getToken and clearToken with SecureStore and the key \"session_token\". In src/context/session.tsx: save the token when signing in, delete it when signing out, and on start (restoring true until done) use a saved token to load /me; if that fails, clear the token. Sign in with the password kobo1234.",
          files: {
            "src/auth/tokenStorage.ts": TOKEN_START,
            "src/context/session.tsx": SESSION_START,
            "src/app/index.tsx": AUTH_HOME,
            "src/services/api.ts": API_HELPER,
            "server/index.js": AUTH_SERVER,
          },
          readOnly: ["src/app/index.tsx", "src/services/api.ts", "server/index.js"],
          solution: { "src/auth/tokenStorage.ts": TOKEN_MODEL, "src/context/session.tsx": SESSION_MODEL },
          tests: [
            { label: "Signing in saves the token in SecureStore, not AsyncStorage", check: "await waitFor(() => has('Sign in'), 3000); await typeInto('Password', 'kobo1234'); await press('Sign in'); await waitFor(() => has('Hello, Ada'), 3000); const t = secureStore().session_token; return typeof t === 'string' && t.split('.').length === 3 && !JSON.stringify(asyncStore()).includes(t);", fail: "await saveToken(token) after signing in." },
            { label: "Reopening the app keeps the user signed in", check: "await restart(); await waitFor(() => has('Hello, Ada') || has('Sign in'), 3000); return has('Hello, Ada');", fail: "On start, getToken() and load /me with it." },
            { label: "Signing out deletes the token", check: "await waitFor(() => has('Sign out'), 3000); await press('Sign out'); await waitFor(() => has('Sign in'), 2000); await restart(); await waitFor(() => has('Sign in') || has('Hello, Ada'), 3000); return !('session_token' in secureStore()) && has('Sign in');", fail: "await clearToken() in signOut." },
          ],
          hint: "useEffect with an async function inside, and setRestoring(false) in finally.",
          successMessage: "Signed in once, remembered securely, forgotten on sign-out.",
        }),
      },
      {
        id: "a-md-sqlite",
        title: "SQLite for structured local data",
        explain:
          "For records you add to, search, sort, total and filter (expenses, messages, a catalogue offline), use a database: expo-sqlite gives every app its own SQLite database file. Wrap the app in <SQLiteProvider databaseName=\"expenses.db\" onInit={migrate}> and read the database anywhere with useSQLiteContext(). MIGRATIONS create and later change tables: PRAGMA user_version stores which version the file is at, so each upgrade runs exactly once, even for users who skipped app versions. Query with db.runAsync (insert, update, delete; returns lastInsertRowId and changes), db.getAllAsync and db.getFirstAsync, ALWAYS passing values as ? parameters, never by joining strings: \"Ada's lunch\" would break a joined query, and a malicious value could rewrite it (SQL injection). Let SQL do the work: ORDER BY, WHERE, SUM … GROUP BY.",
        webLab: expoLab({
          name: "Kobo",
          layout: SQL_LAYOUT,
          task:
            "Write the database code. src/db/migrate.ts: migrate(db) creates an expenses table (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, amount REAL, category TEXT, spent_on TEXT, all NOT NULL) when PRAGMA user_version is 0, then sets user_version to 1. src/db/expenses.ts: addExpense with ? parameters, listExpenses newest first, and totalsByCategory (SUM … GROUP BY category, largest first).",
          files: {
            "src/db/migrate.ts": SQL_START_MIGRATE,
            "src/db/expenses.ts": SQL_START_REPO,
            "src/app/index.tsx": SQL_SCREEN,
            "src/utils/money.ts": MONEY,
          },
          readOnly: ["src/app/index.tsx", "src/utils/money.ts"],
          solution: { "src/db/migrate.ts": MIGRATE_MODEL, "src/db/expenses.ts": EXPENSES_REPO_MODEL },
          tests: [
            { label: "The table exists and the database is at version 1", check: "await waitFor(() => has('Add expense'), 3000); await wait(300); const cols = sql('expenses.db', 'PRAGMA table_info(expenses)').map((c) => c.name).join(); return cols === 'id,title,amount,category,spent_on' && sql('expenses.db', 'PRAGMA user_version')[0].user_version === 1;", fail: "CREATE TABLE expenses (…) and PRAGMA user_version = 1." },
            { label: "Adding expenses saves them, even with quotes in the title", check: `${addVia("Ada's lunch", "2500", "Food")} ${addVia("Bolt to Yaba", "3200", "Transport")} ${addVia("Suya", "2000", "Food")} const rows = sql('expenses.db', 'SELECT title, amount, category FROM expenses ORDER BY id'); return rows.length === 3 && rows[0].title === "Ada's lunch" && rows[1].amount === 3200;`, fail: "db.runAsync(\"INSERT … VALUES (?, ?, ?, ?)\", e.title, e.amount, …)" },
            { label: "The list is newest first, and totals are grouped", check: "await waitFor(() => findAll({ testID: 'expense' }).length === 3, 2000); const list = findAll({ testID: 'expense' }).map((e) => e.textContent); const totals = findAll({ testID: 'total' }).map((e) => e.textContent); return list[0] === 'Suya · ₦2,000' && totals.join('|') === 'Food ₦4,500|Transport ₦3,200';", fail: "ORDER BY spent_on DESC, id DESC, and SUM(amount) … GROUP BY category ORDER BY total DESC." },
            { label: "The data survives a restart, and the migration runs once", check: "await restart(); await waitFor(() => findAll({ testID: 'expense' }).length === 3, 3000); return sql('expenses.db', 'SELECT COUNT(*) AS n FROM expenses')[0].n === 3;", fail: "Check user_version before creating the table." },
            { label: "Values are passed as parameters", check: "const c = code('src/db/expenses.ts'); return c.includes('?') && !/VALUES\\s*\\(\\s*['\"`]?\\s*\\$\\{|\\+\\s*e\\./.test(c);", fail: "Never build SQL by joining strings." },
          ],
          hint: "db.getFirstAsync<{ user_version: number }>(\"PRAGMA user_version\") reads the version.",
          successMessage: "A real database on the phone: migrations, parameters, and SQL doing the sums.",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },
];
