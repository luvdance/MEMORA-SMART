/**
 * MOBILE APP DEVELOPMENT · MODULE 12 · FORMS AND PERSISTENT DATA (part 3)
 *
 * Curriculum 12.10 – 12.P: offline-first principles, caching,
 * synchronisation and conflicts, clearing data at sign-out, and the
 * module practical (an expense tracker).
 *
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 */

import { expoLab } from "./md-helpers.js";
import { MODULE, SECTION_ID, titled } from "./md-m12-part1.js";
import { MONEY } from "./md-m12-part2.js";

/* ── 12.10 · Offline-first: an outbox ────────────────────────────────── */
const NOTES_SERVER = `import { createServer } from "practice-server";

const app = createServer();
const notes = [];

app.post("/notes", (req, res) => {
  const note = { id: String(notes.length + 1), text: req.body.text, clientId: req.body.clientId };
  // Retried requests carry the same clientId: don't save them twice.
  const existing = notes.find((n) => n.clientId === note.clientId);
  if (existing) return res.json(existing);
  notes.push(note);
  res.status(201).json(note);
});

app.get("/notes", (req, res) => res.json(notes));

export default app;
`;
const NOTES_STORE = `import AsyncStorage from "@react-native-async-storage/async-storage";

export type Note = { clientId: string; text: string; synced: boolean };

const KEY = "notes";

export async function readNotes(): Promise<Note[]> {
  const raw = await AsyncStorage.getItem(KEY);
  return raw ? JSON.parse(raw) : [];
}

export async function writeNotes(notes: Note[]) {
  await AsyncStorage.setItem(KEY, JSON.stringify(notes));
}

/** Saves a note on the phone first: it appears at once, online or not. */
export async function addNote(text: string) {
  const note: Note = { clientId: Date.now().toString(36) + Math.random().toString(36).slice(2, 8), text, synced: false };
  await writeNotes([note, ...(await readNotes())]);
  return note;
}
`;
const SYNC_START = `import NetInfo from "@react-native-community/netinfo";
import { useEffect } from "react";
import { readNotes, writeNotes } from "@/notes/store";

/** Sends every unsynced note to the server and marks it synced. Returns how many were sent. */
export async function syncNotes(): Promise<number> {
  return 0;
}

/** Syncs whenever the phone comes back online, then calls onSynced. */
export function useAutoSync(onSynced: () => void) {}
`;
const SYNC_MODEL = `import NetInfo from "@react-native-community/netinfo";
import { useEffect } from "react";
import { readNotes, writeNotes } from "@/notes/store";

let running: Promise<number> | null = null;

/** Sends every unsynced note to the server and marks it synced. Returns how many were sent. */
export function syncNotes(): Promise<number> {
  // One sync at a time: a second call joins the one already running.
  running ??= (async () => {
    try {
      let sent = 0;
      for (const note of (await readNotes()).filter((n) => !n.synced)) {
        const response = await fetch("https://api.example.com/notes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ clientId: note.clientId, text: note.text }),
        });
        if (!response.ok) break;
        // Re-read, so notes added while this request was in flight are kept.
        const latest = await readNotes();
        await writeNotes(latest.map((n) => (n.clientId === note.clientId ? { ...n, synced: true } : n)));
        sent++;
      }
      return sent;
    } catch {
      return 0; // Offline or failed: the notes stay in the outbox for next time.
    } finally {
      running = null;
    }
  })();
  return running;
}

/** Syncs whenever the phone comes back online, then calls onSynced. */
export function useAutoSync(onSynced: () => void) {
  useEffect(() => {
    return NetInfo.addEventListener((state) => {
      if (state.isConnected) syncNotes().then(onSynced);
    });
  }, [onSynced]);
}
`;
const NOTES_SCREEN = `import { useCallback, useEffect, useState } from "react";
import { Pressable, ScrollView, Text, TextInput } from "react-native";
import { addNote, readNotes, type Note } from "@/notes/store";
import { syncNotes, useAutoSync } from "@/notes/sync";

export default function Notes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [text, setText] = useState("");
  const refresh = useCallback(() => {
    readNotes().then(setNotes);
  }, []);

  useEffect(refresh, [refresh]);
  useAutoSync(refresh);

  async function save() {
    if (!text.trim()) return;
    await addNote(text.trim());
    setText("");
    refresh();
    syncNotes().then(refresh);
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 8 }}>
      <TextInput placeholder="Write a note" value={text} onChangeText={setText} style={{ minHeight: 48, borderWidth: 1, borderColor: "#cbd5e1", borderRadius: 10, paddingHorizontal: 12 }} />
      <Pressable accessibilityRole="button" onPress={save} style={{ minHeight: 48, justifyContent: "center" }}>
        <Text>Save note</Text>
      </Pressable>
      {notes.map((n) => (
        <Text key={n.clientId} testID="note">
          {n.text} · {n.synced ? "Synced" : "Waiting to sync"}
        </Text>
      ))}
    </ScrollView>
  );
}
`;

/* ── 12.11 · Caching and conflicts ───────────────────────────────────── */
const PROFILE_SERVER = `import { createServer } from "practice-server";

const app = createServer();
let profile = { bio: "Tailor in Yaba", version: 1 };

app.get("/profile", (req, res) => res.json(profile));

// Optimistic concurrency: a save must say which version it was based on.
app.patch("/profile", (req, res) => {
  const { bio, version } = req.body || {};
  if (version !== profile.version) return res.status(409).json({ message: "Changed on another device", current: profile });
  profile = { bio, version: profile.version + 1 };
  res.json(profile);
});

export default app;
`;
const PROFILE_START = `import AsyncStorage from "@react-native-async-storage/async-storage";

export type Profile = { bio: string; version: number };
export type SaveResult = { ok: true; profile: Profile } | { ok: false; current: Profile };

const URL = "https://api.example.com/profile";
const CACHE_KEY = "profile";

/** Calls onProfile with the cached profile at once (if there is one), then with the server's. */
export async function loadProfile(onProfile: (p: Profile) => void): Promise<void> {}

/** Saves the bio, based on version. On a conflict, returns the server's current profile instead. */
export async function saveBio(bio: string, version: number): Promise<SaveResult> {
  throw new Error("Not written yet");
}
`;
const PROFILE_MODEL = `import AsyncStorage from "@react-native-async-storage/async-storage";

export type Profile = { bio: string; version: number };
export type SaveResult = { ok: true; profile: Profile } | { ok: false; current: Profile };

const URL = "https://api.example.com/profile";
const CACHE_KEY = "profile";

const cache = (p: Profile) => AsyncStorage.setItem(CACHE_KEY, JSON.stringify(p));

/** Calls onProfile with the cached profile at once (if there is one), then with the server's. */
export async function loadProfile(onProfile: (p: Profile) => void): Promise<void> {
  const cached = await AsyncStorage.getItem(CACHE_KEY);
  if (cached) onProfile(JSON.parse(cached));
  try {
    const fresh: Profile = await (await fetch(URL)).json();
    await cache(fresh);
    onProfile(fresh);
  } catch {
    // Offline: the cached copy is what we have.
  }
}

/** Saves the bio, based on version. On a conflict, returns the server's current profile instead. */
export async function saveBio(bio: string, version: number): Promise<SaveResult> {
  const response = await fetch(URL, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ bio, version }),
  });
  const data = await response.json();
  if (response.status === 409) {
    await cache(data.current);
    return { ok: false, current: data.current };
  }
  if (!response.ok) throw new Error(data.message ?? "Couldn't save");
  await cache(data);
  return { ok: true, profile: data };
}
`;
const PROFILE_SCREEN = `import { useEffect, useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { loadProfile, saveBio, type Profile } from "@/profile/sync";

export default function EditProfile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [draft, setDraft] = useState("");
  const [conflict, setConflict] = useState<Profile | null>(null);
  const [status, setStatus] = useState("");

  useEffect(() => {
    loadProfile((p) => {
      setProfile(p);
      setDraft(p.bio);
    });
  }, []);

  async function save(version: number) {
    const result = await saveBio(draft, version);
    if (result.ok) {
      setProfile(result.profile);
      setConflict(null);
      setStatus("Saved");
    } else {
      setConflict(result.current);
    }
  }

  if (!profile) return <Text style={{ padding: 20 }}>Loading…</Text>;

  return (
    <View style={{ padding: 20, gap: 10 }}>
      <Text testID="bio">Bio: {profile.bio}</Text>
      <TextInput placeholder="Bio" value={draft} onChangeText={setDraft} style={{ minHeight: 48, borderWidth: 1, borderColor: "#cbd5e1", borderRadius: 10, paddingHorizontal: 12 }} />
      <Pressable accessibilityRole="button" onPress={() => save(profile.version)} style={{ minHeight: 48, justifyContent: "center" }}>
        <Text>Save</Text>
      </Pressable>
      {conflict ? (
        <View accessibilityRole="alert" style={{ backgroundColor: "#fef3c7", padding: 12, gap: 8 }}>
          <Text>Changed on another device: "{conflict.bio}"</Text>
          <Pressable accessibilityRole="button" onPress={() => { setProfile(conflict); setDraft(conflict.bio); setConflict(null); }} style={{ minHeight: 44, justifyContent: "center" }}>
            <Text>Use theirs</Text>
          </Pressable>
          <Pressable accessibilityRole="button" onPress={() => save(conflict.version)} style={{ minHeight: 44, justifyContent: "center" }}>
            <Text>Keep mine</Text>
          </Pressable>
        </View>
      ) : null}
      {status ? <Text>{status}</Text> : null}
    </View>
  );
}
`;

/* ── 12.12 · Clearing data at sign-out ───────────────────────────────── */
const LOGOUT_SERVER = `import { createServer } from "practice-server";

const app = createServer();
const ORDERS = { "ada-token": ["Ankara tote bag"], "tunde-token": ["Redmi Note 14"] };

app.get("/orders", (req, res) => {
  const token = (req.headers.authorization || "").replace("Bearer ", "");
  if (!ORDERS[token]) return res.status(401).json({ message: "Sign in again" });
  res.json(ORDERS[token]);
});

export default app;
`;
const LOGOUT_SESSION = `import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import { createContext, useContext, useState, type ReactNode } from "react";
import { signOutEverywhere } from "@/auth/signOut";
import { useSQLiteContext } from "expo-sqlite";
import { useQueryClient } from "@tanstack/react-query";

type User = { name: string; token: string } | null;
type Value = { user: User; signIn: (name: "Ada" | "Tunde") => Promise<void>; signOut: () => Promise<void> };

const SessionContext = createContext<Value | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const db = useSQLiteContext();
  const queryClient = useQueryClient();

  async function signIn(name: "Ada" | "Tunde") {
    const token = name.toLowerCase() + "-token";
    await SecureStore.setItemAsync("session_token", token);
    // What a signed-in user leaves on the phone:
    await AsyncStorage.setItem("user:recent_searches", JSON.stringify(["ankara", "phones"]));
    await AsyncStorage.setItem("user:address", JSON.stringify({ street: "12 Herbert Macaulay Way" }));
    await db.runAsync("INSERT INTO drafts (body) VALUES (?)", "Message to the tailor");
    setUser({ name, token });
  }

  async function signOut() {
    await signOutEverywhere({ db, queryClient });
    setUser(null);
  }

  return <SessionContext.Provider value={{ user, signIn, signOut }}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const value = useContext(SessionContext);
  if (!value) throw new Error("useSession must be used inside <SessionProvider>");
  return value;
}
`;
const SIGNOUT_START = `import type { QueryClient } from "@tanstack/react-query";
import type { SQLiteDatabase } from "expo-sqlite";

/**
 * Removes everything that belongs to the signed-in user from this phone.
 * Device settings (keys starting with "device:") stay.
 */
export async function signOutEverywhere({ db, queryClient }: { db: SQLiteDatabase; queryClient: QueryClient }) {}
`;
const SIGNOUT_MODEL = `import AsyncStorage from "@react-native-async-storage/async-storage";
import type { QueryClient } from "@tanstack/react-query";
import * as SecureStore from "expo-secure-store";
import type { SQLiteDatabase } from "expo-sqlite";

/**
 * Removes everything that belongs to the signed-in user from this phone.
 * Device settings (keys starting with "device:") stay.
 */
export async function signOutEverywhere({ db, queryClient }: { db: SQLiteDatabase; queryClient: QueryClient }) {
  // 1. The credential.
  await SecureStore.deleteItemAsync("session_token");
  // 2. The user's key-value data, keeping the device's own settings.
  const keys = await AsyncStorage.getAllKeys();
  await AsyncStorage.multiRemove(keys.filter((k) => k.startsWith("user:")));
  // 3. The user's rows in the database.
  await db.runAsync("DELETE FROM drafts");
  // 4. Server data cached in memory, so the next user never sees it.
  queryClient.clear();
}
`;
const LOGOUT_LAYOUT = `import AsyncStorage from "@react-native-async-storage/async-storage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { SQLiteProvider, type SQLiteDatabase } from "expo-sqlite";
import { SessionProvider } from "@/context/session";

const queryClient = new QueryClient({ defaultOptions: { queries: { staleTime: Infinity } } });

async function init(db: SQLiteDatabase) {
  await db.execAsync("CREATE TABLE IF NOT EXISTS drafts (id INTEGER PRIMARY KEY AUTOINCREMENT, body TEXT NOT NULL)");
  await AsyncStorage.setItem("device:onboarding_seen", "true");
}

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <SQLiteProvider databaseName="app.db" onInit={init}>
        <SessionProvider>
          <Stack>
            <Stack.Screen name="index" options={{ title: "Account" }} />
          </Stack>
        </SessionProvider>
      </SQLiteProvider>
    </QueryClientProvider>
  );
}
`;
const LOGOUT_HOME = `import { useQuery } from "@tanstack/react-query";
import { Pressable, Text, View } from "react-native";
import { useSession } from "@/context/session";

function Orders({ token }: { token: string }) {
  const { data } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => (await fetch("https://api.example.com/orders", { headers: { Authorization: "Bearer " + token } })).json() as Promise<string[]>,
  });
  return <Text testID="orders">Your orders: {data ? data.join(", ") : "…"}</Text>;
}

export default function Account() {
  const { user, signIn, signOut } = useSession();
  if (!user) {
    return (
      <View style={{ padding: 20, gap: 8 }}>
        <Pressable accessibilityRole="button" onPress={() => signIn("Ada")} style={{ minHeight: 48, justifyContent: "center" }}><Text>Sign in as Ada</Text></Pressable>
        <Pressable accessibilityRole="button" onPress={() => signIn("Tunde")} style={{ minHeight: 48, justifyContent: "center" }}><Text>Sign in as Tunde</Text></Pressable>
      </View>
    );
  }
  return (
    <View style={{ padding: 20, gap: 8 }}>
      <Text style={{ fontSize: 20 }}>Hello, {user.name}</Text>
      <Orders token={user.token} />
      <Pressable accessibilityRole="button" onPress={signOut} style={{ minHeight: 48, justifyContent: "center" }}><Text>Sign out</Text></Pressable>
    </View>
  );
}
`;

/* ── 12.P · The practical ────────────────────────────────────────────── */
const P_MODEL = {
  "src/db/migrate.ts": `import type { SQLiteDatabase } from "expo-sqlite";

const DATABASE_VERSION = 1;

export async function migrate(db: SQLiteDatabase) {
  const row = await db.getFirstAsync<{ user_version: number }>("PRAGMA user_version");
  let version = row?.user_version ?? 0;
  if (version >= DATABASE_VERSION) return;
  if (version === 0) {
    await db.execAsync(
      "CREATE TABLE IF NOT EXISTS transactions (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL, amount REAL NOT NULL, category TEXT NOT NULL, spent_on TEXT NOT NULL);"
    );
    version = 1;
  }
  await db.execAsync("PRAGMA user_version = " + DATABASE_VERSION);
}
`,
  "src/db/transactions.ts": `import type { SQLiteDatabase } from "expo-sqlite";
import type { Category } from "@/constants/categories";

export type Transaction = { id: number; title: string; amount: number; category: Category; spent_on: string };
export type Filter = { category: Category | "All"; month: string | null };

export async function addTransaction(db: SQLiteDatabase, t: Omit<Transaction, "id">) {
  const r = await db.runAsync("INSERT INTO transactions (title, amount, category, spent_on) VALUES (?, ?, ?, ?)", t.title, t.amount, t.category, t.spent_on);
  return r.lastInsertRowId;
}

export async function deleteTransaction(db: SQLiteDatabase, id: number) {
  await db.runAsync("DELETE FROM transactions WHERE id = ?", id);
}

function where(filter: Filter): [string, (string | number)[]] {
  const parts: string[] = [];
  const params: (string | number)[] = [];
  if (filter.category !== "All") {
    parts.push("category = ?");
    params.push(filter.category);
  }
  if (filter.month) {
    parts.push("substr(spent_on, 1, 7) = ?");
    params.push(filter.month);
  }
  return [parts.length ? " WHERE " + parts.join(" AND ") : "", params];
}

export function listTransactions(db: SQLiteDatabase, filter: Filter) {
  const [clause, params] = where(filter);
  return db.getAllAsync<Transaction>("SELECT * FROM transactions" + clause + " ORDER BY spent_on DESC, id DESC", params);
}

export async function totalSpent(db: SQLiteDatabase, filter: Filter) {
  const [clause, params] = where(filter);
  const row = await db.getFirstAsync<{ total: number | null }>("SELECT SUM(amount) AS total FROM transactions" + clause, params);
  return row?.total ?? 0;
}
`,
  "src/validation/transaction.ts": `import { z } from "zod";
import { CATEGORIES } from "@/constants/categories";

export const transactionSchema = z.object({
  title: z.string().trim().min(1, "Say what it was for"),
  amount: z
    .string()
    .trim()
    .regex(/^\\d+(\\.\\d{1,2})?$/, "Enter an amount such as 2500 or 2500.50")
    .transform(Number)
    .pipe(z.number().positive("The amount must be more than 0")),
  category: z.enum(CATEGORIES),
  spent_on: z.iso.date("Use the format YYYY-MM-DD"),
});

export type TransactionInput = z.input<typeof transactionSchema>;

export function validateTransaction(values: TransactionInput) {
  const result = transactionSchema.safeParse(values);
  if (result.success) return { data: result.data, errors: {} as Partial<Record<keyof TransactionInput, string>> };
  const errors: Partial<Record<keyof TransactionInput, string>> = {};
  for (const issue of result.error.issues) {
    const field = issue.path[0] as keyof TransactionInput;
    if (!errors[field]) errors[field] = issue.message;
  }
  return { data: null, errors };
}
`,
  "src/app/_layout.tsx": `import { Stack } from "expo-router";
import { SQLiteProvider } from "expo-sqlite";
import { migrate } from "@/db/migrate";

export default function RootLayout() {
  return (
    <SQLiteProvider databaseName="tracker.db" onInit={migrate}>
      <Stack>
        <Stack.Screen name="index" options={{ title: "Expenses" }} />
        <Stack.Screen name="add" options={{ title: "Add expense", presentation: "modal" }} />
      </Stack>
    </SQLiteProvider>
  );
}
`,
  "src/app/index.tsx": `import { Link, useFocusEffect } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useCallback, useState } from "react";
import { FlatList, Pressable, Text, View } from "react-native";
import { CATEGORIES, type Category } from "@/constants/categories";
import { deleteTransaction, listTransactions, totalSpent, type Filter, type Transaction } from "@/db/transactions";
import { naira } from "@/utils/money";

const THIS_MONTH = "2026-10";

export default function Expenses() {
  const db = useSQLiteContext();
  const [filter, setFilter] = useState<Filter>({ category: "All", month: null });
  const [items, setItems] = useState<Transaction[]>([]);
  const [total, setTotal] = useState(0);

  const refresh = useCallback(async () => {
    setItems(await listTransactions(db, filter));
    setTotal(await totalSpent(db, filter));
  }, [db, filter]);

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh])
  );

  const chips: (Category | "All")[] = ["All", ...CATEGORIES];

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6, padding: 12 }}>
        {chips.map((c) => (
          <Pressable key={c} accessibilityRole="radio" accessibilityState={{ checked: filter.category === c }} onPress={() => setFilter((f) => ({ ...f, category: c }))} style={{ paddingHorizontal: 12, minHeight: 40, justifyContent: "center", borderRadius: 20, backgroundColor: filter.category === c ? "#0f766e" : "#e2e8f0" }}>
            <Text style={{ color: filter.category === c ? "#fff" : "#0f172a" }}>{c}</Text>
          </Pressable>
        ))}
        <Pressable accessibilityRole="switch" accessibilityState={{ checked: filter.month !== null }} onPress={() => setFilter((f) => ({ ...f, month: f.month ? null : THIS_MONTH }))} style={{ paddingHorizontal: 12, minHeight: 40, justifyContent: "center" }}>
          <Text>This month only</Text>
        </Pressable>
      </View>
      <Text testID="total" style={{ paddingHorizontal: 16, fontSize: 18, fontWeight: "700" }}>Spent {naira(total)}</Text>
      <FlatList
        data={items}
        keyExtractor={(t) => String(t.id)}
        ListEmptyComponent={<Text style={{ padding: 16 }}>No expenses here yet</Text>}
        renderItem={({ item }) => (
          <View style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: 16 }}>
            <Text testID="transaction" style={{ flex: 1, paddingVertical: 12 }}>{item.title} · {item.category} · {naira(item.amount)}</Text>
            <Pressable accessibilityRole="button" accessibilityLabel={"Delete " + item.title} onPress={async () => { await deleteTransaction(db, item.id); refresh(); }} style={{ width: 44, height: 44, justifyContent: "center", alignItems: "center" }}>
              <Text>✕</Text>
            </Pressable>
          </View>
        )}
      />
      <Link href="/add" style={{ margin: 16, padding: 14, textAlign: "center", backgroundColor: "#0f766e", color: "#fff", borderRadius: 12 }}>Add expense</Link>
    </View>
  );
}
`,
  "src/app/add.tsx": `import { router } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { CATEGORIES } from "@/constants/categories";
import { addTransaction } from "@/db/transactions";
import { validateTransaction, type TransactionInput } from "@/validation/transaction";

export default function Add() {
  const db = useSQLiteContext();
  const [values, setValues] = useState<TransactionInput>({ title: "", amount: "", category: "Food", spent_on: "2026-10-21" });
  const [submitted, setSubmitted] = useState(false);
  const { errors } = submitted ? validateTransaction(values) : { errors: {} as Partial<Record<keyof TransactionInput, string>> };
  const set = (k: keyof TransactionInput) => (v: string) => setValues((s) => ({ ...s, [k]: v }));

  async function save() {
    setSubmitted(true);
    const { data } = validateTransaction(values);
    if (!data) return;
    await addTransaction(db, data);
    router.back();
  }

  const input = { minHeight: 48, borderWidth: 1, borderColor: "#cbd5e1", borderRadius: 10, paddingHorizontal: 12 } as const;
  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 6 }}>
      <TextInput placeholder="What for?" value={values.title} onChangeText={set("title")} style={input} />
      {errors.title ? <Text style={{ color: "#b91c1c" }}>{errors.title}</Text> : null}
      <TextInput placeholder="Amount" value={values.amount} onChangeText={set("amount")} keyboardType="decimal-pad" style={input} />
      {errors.amount ? <Text style={{ color: "#b91c1c" }}>{errors.amount}</Text> : null}
      <TextInput placeholder="Date (YYYY-MM-DD)" value={values.spent_on} onChangeText={set("spent_on")} style={input} />
      {errors.spent_on ? <Text style={{ color: "#b91c1c" }}>{errors.spent_on}</Text> : null}
      <View accessibilityRole="radiogroup" style={{ flexDirection: "row", flexWrap: "wrap", gap: 6 }}>
        {CATEGORIES.map((c) => (
          <Pressable key={c} accessibilityRole="radio" accessibilityState={{ checked: values.category === c }} onPress={() => set("category")(c)} style={{ paddingHorizontal: 12, minHeight: 40, justifyContent: "center", borderRadius: 20, borderWidth: 1, borderColor: values.category === c ? "#0f766e" : "#cbd5e1" }}>
            <Text>{c}</Text>
          </Pressable>
        ))}
      </View>
      <Pressable accessibilityRole="button" onPress={save} style={{ marginTop: 8, minHeight: 48, borderRadius: 12, backgroundColor: "#0f766e", justifyContent: "center", alignItems: "center" }}>
        <Text style={{ color: "#fff", fontWeight: "700" }}>Save</Text>
      </Pressable>
    </ScrollView>
  );
}
`,
};
const CATS = `export const CATEGORIES = ["Food", "Transport", "Data", "Rent"] as const;
export type Category = (typeof CATEGORIES)[number];
`;
const addTx = (title, amount, category, date) =>
  `await press('Add expense'); await waitFor(() => exists({ placeholder: 'What for?' }), 2000); await typeInto('What for?', ${JSON.stringify(title)}); await typeInto('Amount', '${amount}'); await typeInto('Date (YYYY-MM-DD)', '${date}'); await press({ role: 'radio', name: '${category}' }); await press('Save'); await waitFor(() => path() === '/', 2000); await wait(200);`;

export const PART3 = [
  /* ═══════════════ LESSON 75 · 12.10 – 12.12 ═══════════════ */
  {
    id: "md-l75-offline-sync",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 6,
    covers: ["12.10", "12.11", "12.12"],
    title: "Offline-First, Synchronisation and Signing Out",
    subtitle: "Apps that work without a signal, agree with the server, and forget properly",
    estimatedMinutes: 70,
    intro: "Phones lose signal in lifts, on buses and across much of the world every day. An offline-first app keeps working, and catches up later.",
    atoms: [
      {
        id: "a-md-offline-first",
        title: "Offline-first principles",
        explain:
          "OFFLINE-FIRST means the phone's own storage is the app's source of truth for what the user does: (1) write locally first, so the change appears instantly, online or not; (2) keep an OUTBOX of changes the server hasn't received (here, notes with synced: false); (3) send them when possible: right after saving and whenever the phone reconnects (NetInfo.addEventListener); (4) make sending safe to repeat, because a request can succeed on the server while the reply is lost: each change carries a client-made id (clientId) so the server can ignore duplicates (IDEMPOTENCY); (5) run one sync at a time; (6) show the user what is still waiting. Read-only data can be offline-first too: show the last copy you saved, then refresh it (next atom).",
        webLab: expoLab({
          name: "Notes",
          layout: titled("Notes"),
          task:
            "Notes are saved on the phone first (src/notes/store.ts, given). Write src/notes/sync.ts: syncNotes() POSTs each unsynced note ({ clientId, text }) to https://api.example.com/notes, marks it synced, returns how many were sent, returns 0 without throwing when offline, and runs only one sync at a time (a second call while one is running joins it). useAutoSync(onSynced) syncs whenever the phone comes back online, then calls onSynced.",
          files: { "src/notes/sync.ts": SYNC_START, "src/notes/store.ts": NOTES_STORE, "src/app/index.tsx": NOTES_SCREEN, "server/index.js": NOTES_SERVER },
          readOnly: ["src/notes/store.ts", "src/app/index.tsx", "server/index.js"],
          solution: { "src/notes/sync.ts": SYNC_MODEL },
          tests: [
            { label: "Online, a note syncs straight away", check: "await typeInto('Write a note', 'Buy thread'); await press('Save note'); await waitFor(() => has('Buy thread · Synced'), 3000); return serverRequests().filter((r) => r.method === 'POST').length === 1;", fail: "POST each unsynced note, then mark it synced." },
            { label: "Offline, notes wait in the outbox and survive a restart", check: "await setOnline(false); await typeInto('Write a note', 'Call Bisi'); await press('Save note'); await waitFor(() => has('Call Bisi · Waiting to sync'), 2000); await restart(); await waitFor(() => has('Call Bisi · Waiting to sync'), 3000); return serverRequests().filter((r) => r.method === 'POST').length === 1;", fail: "When fetch fails, return 0 and leave the note unsynced." },
            { label: "Coming back online sends them", check: "await setOnline(true); await waitFor(() => has('Call Bisi · Synced'), 4000); return serverRequests().filter((r) => r.method === 'POST' && r.body.text === 'Call Bisi').length === 1;", fail: "useAutoSync: NetInfo.addEventListener → syncNotes().then(onSynced)" },
            { label: "Two syncs at once send each note once", check: "await setOnline(false); await typeInto('Write a note', 'Pay rent'); await press('Save note'); await waitFor(() => hasText('Pay rent'), 2000); const { syncNotes } = load('src/notes/sync.ts'); await setOnline(true); await Promise.all([syncNotes(), syncNotes(), syncNotes()]); await wait(500); return serverRequests().filter((r) => r.method === 'POST' && r.body.text === 'Pay rent').length === 1;", fail: "Keep the running promise in a variable and return it to later callers." },
          ],
          hint: "let running: Promise<number> | null = null; and running ??= (async () => { … })();",
          successMessage: "Notes that save instantly anywhere, and reach the server exactly once.",
        }),
      },
      {
        id: "a-md-sync-conflicts",
        title: "Caching, synchronization, and conflict handling",
        explain:
          "CACHING: show the last saved copy at once, then fetch a fresh one and update the screen and the cache (\"stale-while-revalidate\"); offline, the cached copy is what the user sees. (TanStack Query can persist its cache with a persister too.) CONFLICTS happen when the same thing is changed in two places, for example on a phone and a laptop. Silently overwriting (\"last write wins\") loses someone's work. A safe pattern is OPTIMISTIC CONCURRENCY: every record has a version; a save sends the version it was based on; if the server's version has moved on, it refuses with 409 Conflict and returns the current record. The app then shows both and lets the user choose: keep theirs, or keep mine (saving again on top of the new version). Merge automatically only when you can do it safely (different fields changed).",
        webLab: expoLab({
          name: "Kobo",
          layout: titled("Profile"),
          task:
            "Write src/profile/sync.ts. loadProfile(onProfile) calls onProfile with the profile cached in AsyncStorage (key \"profile\") straight away, then fetches GET /profile, caches it and calls onProfile again (staying quiet when offline). saveBio(bio, version) PATCHes { bio, version }: on 409, caches and returns { ok: false, current } from the response; on success, caches and returns { ok: true, profile }.",
          files: { "src/profile/sync.ts": PROFILE_START, "src/app/index.tsx": PROFILE_SCREEN, "server/index.js": PROFILE_SERVER },
          readOnly: ["src/app/index.tsx", "server/index.js"],
          solution: { "src/profile/sync.ts": PROFILE_MODEL },
          tests: [
            { label: "The profile loads and is cached", check: "await waitFor(() => has('Bio: Tailor in Yaba'), 3000); return JSON.parse(asyncStore().profile || '{}').version === 1;", fail: "Fetch /profile, then AsyncStorage.setItem(\"profile\", JSON.stringify(p))." },
            { label: "Offline, the cached copy still shows", check: "await setOnline(false); await restart(); await waitFor(() => has('Bio: Tailor in Yaba'), 3000); await setOnline(true); return true;", fail: "Call onProfile with the cached copy before fetching." },
            { label: "A change from another device is detected, and Keep mine wins", check: "await restart(); await waitFor(() => has('Bio: Tailor in Yaba'), 3000); await fetch('https://api.example.com/profile', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ bio: 'Tailor and teacher', version: 1 }) }); await typeInto('Bio', 'Tailor in Yaba, Lagos'); await press('Save'); await waitFor(() => hasText('Changed on another device'), 3000); const shown = hasText('Tailor and teacher'); await press('Keep mine'); await waitFor(() => has('Saved'), 3000); const server = await (await fetch('https://api.example.com/profile')).json(); return shown && server.bio === 'Tailor in Yaba, Lagos' && server.version === 3;", fail: "On 409 return { ok: false, current: data.current }; the screen resends with current.version." },
          ],
          hint: "response.status === 409 is a normal answer here, not an exception.",
          successMessage: "Nobody's work is silently lost.",
        }),
      },
      {
        id: "a-md-logout-clear",
        title: "Clearing data during logout",
        explain:
          "Phones are shared, sold and borrowed. Signing out must remove everything that belongs to the user, in every store: the token in SecureStore; their keys in AsyncStorage (prefix user keys, such as \"user:address\", so you can remove exactly those and keep device settings such as \"device:onboarding_seen\"); their rows in SQLite (DELETE FROM, or delete the database file); server data cached in memory (queryClient.clear() for TanStack Query, and reset any stores and contexts); and, if you use them, scheduled notifications and downloaded files. Forgetting the in-memory cache is a classic bug: the next person to sign in on the phone briefly sees the previous user's orders. Also tell the server (revoke the refresh token, Module 15).",
        webLab: expoLab({
          name: "Kobo",
          layout: LOGOUT_LAYOUT,
          task:
            "Sign in as Ada, then sign out and in as Tunde: Tunde sees Ada's orders, and Ada's data is still on the phone. Write signOutEverywhere in src/auth/signOut.ts: delete the \"session_token\" from SecureStore, remove every AsyncStorage key starting with \"user:\" (keeping \"device:\" keys), delete all rows from the drafts table, and clear the query cache.",
          files: { "src/auth/signOut.ts": SIGNOUT_START, "src/context/session.tsx": LOGOUT_SESSION, "src/app/index.tsx": LOGOUT_HOME, "server/index.js": LOGOUT_SERVER },
          readOnly: ["src/context/session.tsx", "src/app/index.tsx", "server/index.js"],
          solution: { "src/auth/signOut.ts": SIGNOUT_MODEL },
          tests: [
            { label: "Signing out removes the token and the user's stored data", check: "await waitFor(() => has('Sign in as Ada'), 3000); await press('Sign in as Ada'); await waitFor(() => has('Your orders: Ankara tote bag'), 3000); await press('Sign out'); await waitFor(() => has('Sign in as Tunde'), 2000); const keys = Object.keys(asyncStore()); return !('session_token' in secureStore()) && !keys.some((k) => k.startsWith('user:')) && keys.includes('device:onboarding_seen');", fail: "SecureStore.deleteItemAsync, then AsyncStorage.multiRemove of the user: keys." },
            { label: "The user's database rows are gone", check: "return sql('app.db', 'SELECT COUNT(*) AS n FROM drafts')[0].n === 0;", fail: "await db.runAsync(\"DELETE FROM drafts\")" },
            { label: "The next user never sees the previous user's orders", check: "await press('Sign in as Tunde'); await waitFor(() => hasText('Your orders:') && !hasText('…'), 3000); return has('Your orders: Redmi Note 14');", fail: "queryClient.clear() so cached server data goes too." },
          ],
          hint: "AsyncStorage.getAllKeys(), filter, then multiRemove.",
          successMessage: "Signing out leaves nothing of the user behind.",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════ LESSON 76 · 12.P ═══════════════ */
  {
    id: "md-l76-m12-project",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 7,
    covers: ["12.P"],
    title: "Practical: An Expense Tracker That Remembers",
    subtitle: "Validated forms, SQLite, categories, filters and totals",
    estimatedMinutes: 120,
    intro: "A complete offline app: everything is stored on the phone, and nothing is lost when it closes.",
    atoms: [
      {
        id: "a-md-m12-project",
        title: "Build the expense tracker",
        explain:
          "The categories and the money formatter are given. Write the database (with a migration), the validation schema, the list with its filters, and the add form. Let SQL do the filtering and totals, and validate the form before anything is saved.",
        webLab: expoLab({
          name: "Kobo Expenses",
          layout: null,
          task:
            "Build: src/db/migrate.ts (a transactions table: id, title, amount, category, spent_on; user_version 1) and src/db/transactions.ts (addTransaction, deleteTransaction, listTransactions(db, filter) and totalSpent(db, filter), where filter is { category: \"All\" or a category, month: \"YYYY-MM\" or null }, using WHERE … ? parameters); src/validation/transaction.ts with Zod (title required → \"Say what it was for\"; amount → \"Enter an amount such as 2500 or 2500.50\"; date → \"Use the format YYYY-MM-DD\"). Screens: the root layout (SQLiteProvider with databaseName \"tracker.db\") with index and add (a modal). index: category chips (radios: All, Food, Transport, Data, Rent), a \"This month only\" switch (October 2026), \"Spent ₦…\" (testID \"total\"), rows \"<title> · <category> · ₦<amount>\" (testID \"transaction\", newest first) each with a \"Delete <title>\" button, \"No expenses here yet\" when empty, and an \"Add expense\" link. add: \"What for?\", \"Amount\", \"Date (YYYY-MM-DD)\" (default 2026-10-21), category radios and \"Save\", which validates, saves and goes back.",
          files: {
            "src/app/_layout.tsx": "// The root layout.\n",
            "src/app/index.tsx": "// The list, filters and total.\n",
            "src/app/add.tsx": "// The add form.\n",
            "src/db/migrate.ts": "",
            "src/db/transactions.ts": "",
            "src/validation/transaction.ts": "",
            "src/constants/categories.ts": CATS,
            "src/utils/money.ts": MONEY,
          },
          readOnly: ["src/constants/categories.ts", "src/utils/money.ts"],
          revealSolution: false,
          solution: P_MODEL,
          tests: [
            { label: "An empty tracker says so", check: "await waitFor(() => has('No expenses here yet'), 3000); return find({ testID: 'total' }).textContent === 'Spent ₦0';", fail: "ListEmptyComponent, and SUM(…) of nothing is 0." },
            { label: "The form refuses bad input", check: "await press('Add expense'); await waitFor(() => exists({ placeholder: 'What for?' }), 2000); await typeInto('Amount', '25k'); await typeInto('Date (YYYY-MM-DD)', '21/10/2026'); await press('Save'); await wait(200); const ok = has('Say what it was for') && has('Enter an amount such as 2500 or 2500.50') && has('Use the format YYYY-MM-DD'); await back(); return ok && sql('tracker.db', 'SELECT COUNT(*) AS n FROM transactions')[0].n === 0;", fail: "Validate with the schema; save nothing while there are errors." },
            { label: "Expenses are saved, listed newest first, and totalled", check: `${addTx("Bolt to Yaba", "3200", "Transport", "2026-10-02")} ${addTx("Ada's lunch", "2500", "Food", "2026-10-20")} ${addTx("September rent", "150000", "Rent", "2026-09-28")} const rows = findAll({ testID: 'transaction' }).map((e) => e.textContent); return rows[0] === "Ada's lunch · Food · ₦2,500" && rows.length === 3 && find({ testID: 'total' }).textContent === 'Spent ₦155,700';`, fail: "ORDER BY spent_on DESC, and SUM(amount)." },
            { label: "Filters by category and month, in SQL", check: "await press({ role: 'radio', name: 'Food' }); await wait(200); const food = findAll({ testID: 'transaction' }).length === 1 && find({ testID: 'total' }).textContent === 'Spent ₦2,500'; await press({ role: 'radio', name: 'All' }); await press('This month only'); await wait(200); const month = findAll({ testID: 'transaction' }).length === 2 && find({ testID: 'total' }).textContent === 'Spent ₦5,700'; await press('This month only'); return food && month && /WHERE|where/.test(code('src/db/transactions.ts'));", fail: "WHERE category = ? and substr(spent_on, 1, 7) = ?" },
            { label: "Everything survives a restart, and delete works", check: "await restart(); await waitFor(() => findAll({ testID: 'transaction' }).length === 3, 3000); await press({ role: 'button', name: 'Delete September rent' }); await wait(300); return findAll({ testID: 'transaction' }).length === 2 && sql('tracker.db', 'SELECT COUNT(*) AS n FROM transactions')[0].n === 2 && sql('tracker.db', 'PRAGMA user_version')[0].user_version === 1;", fail: "SQLite keeps the data; DELETE … WHERE id = ?" },
          ],
          hint: "Build one WHERE clause and its parameters from the filter, and use it for both the list and the total.",
          successMessage: "A complete offline app: validated input, a real database, filters and totals.",
        }),
      },
    ],
    task: {
      title: "Module 12 practical: data that lasts in your own app",
      intro: "Apply this module to the app you are building.",
      prompts: [
        "Validate every form with a schema, with a clear message under each field, and test each keyboard on a real Android phone and iPhone.",
        "Decide the store for each piece of data (kv-store, AsyncStorage, SecureStore, SQLite or the server) and write the choice down with the reason.",
        "Make one feature work offline with an outbox, and test it in airplane mode.",
        "Write signOut so it clears every store, then check by signing in as a second user.",
        "Mastery checkpoint: close and reopen your app (and restart the phone) and lose nothing; then explain which store each piece of data is in and why.",
      ],
      closing: "Next: Module 13, connecting to APIs.",
    },
    requirements: { read: true, video: false, assessment: true },
  },
];
