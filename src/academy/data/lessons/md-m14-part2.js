/**
 * MOBILE APP DEVELOPMENT · MODULE 14 · BACKEND AND DATABASE INTEGRATION (part 2)
 *
 * Curriculum 14.9 – 14.P: realtime updates, data access rules and
 * authorization, indexes and query efficiency, relational versus document
 * databases, and the module practical (a community noticeboard).
 *
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 */

import { expoLab } from "./md-helpers.js";
import { MODULE, SECTION_ID, titled } from "./md-m14-part1.js";

const q = (path, token) => `(await (await fetch('https://api.example.com${path}'${token ? `, { headers: { Authorization: 'Bearer ${token}' } }` : ""})).json())`;
const call = (method, path, token, body) =>
  `await fetch('https://api.example.com${path}', { method: '${method}', headers: { 'Content-Type': 'application/json'${token ? `, Authorization: 'Bearer ${token}'` : ""} }${body ? `, body: JSON.stringify(${body})` : ""} })`;

/* ── 14.9 · Realtime ─────────────────────────────────────────────────── */
const LIVE_SERVER = `import { createServer } from "practice-server";

const app = createServer();
let notices = [{ id: "1", title: "Water off on Saturday" }];
let nextId = 2;

app.get("/notices", (req, res) => res.json(notices));

app.post("/notices", (req, res) => {
  const notice = { id: String(nextId++), title: req.body.title };
  notices = [notice, ...notices];
  // Everyone subscribed to the "notices" channel hears about it.
  app.publish("notices", { type: "created", notice });
  res.status(201).json(notice);
});

app.delete("/notices/:id", (req, res) => {
  notices = notices.filter((n) => n.id !== req.params.id);
  app.publish("notices", { type: "deleted", id: req.params.id });
  res.status(204).end();
});

export default app;
`;
const LIVE_START = `import { useEffect, useState } from "react";

export type Notice = { id: string; title: string };

/**
 * The notices, kept up to date live: load the list, then listen on
 * wss://api.example.com/realtime?channel=notices. Each message is JSON:
 * { channel, payload } where payload is { type: "created", notice } or { type: "deleted", id }.
 */
export function useLiveNotices(): Notice[] {
  const [notices, setNotices] = useState<Notice[]>([]);
  useEffect(() => {
    fetch("https://api.example.com/notices")
      .then((r) => r.json())
      .then(setNotices);
  }, []);
  return notices;
}
`;
const LIVE_MODEL = `import { useEffect, useState } from "react";

export type Notice = { id: string; title: string };

type Event = { type: "created"; notice: Notice } | { type: "deleted"; id: string };

/**
 * The notices, kept up to date live: load the list, then listen on
 * wss://api.example.com/realtime?channel=notices. Each message is JSON:
 * { channel, payload } where payload is { type: "created", notice } or { type: "deleted", id }.
 */
export function useLiveNotices(): Notice[] {
  const [notices, setNotices] = useState<Notice[]>([]);

  useEffect(() => {
    let closed = false;
    let socket: WebSocket | null = null;
    let retry: ReturnType<typeof setTimeout> | undefined;
    let attempt = 0;

    const apply = (event: Event) =>
      setNotices((list) =>
        event.type === "created"
          ? [event.notice, ...list.filter((n) => n.id !== event.notice.id)]
          : list.filter((n) => n.id !== event.id)
      );

    function connect() {
      socket = new WebSocket("wss://api.example.com/realtime?channel=notices");
      socket.onopen = () => {
        attempt = 0;
        // (Re)load the list once connected, so nothing missed while offline is lost.
        fetch("https://api.example.com/notices").then((r) => r.json()).then((list: Notice[]) => !closed && setNotices(list));
      };
      socket.onmessage = (message) => apply(JSON.parse(String(message.data)).payload);
      socket.onclose = () => {
        // Reconnect with growing delays, unless the screen has gone.
        if (!closed) retry = setTimeout(connect, Math.min(30_000, 1000 * 2 ** attempt++));
      };
    }

    connect();
    return () => {
      closed = true;
      clearTimeout(retry);
      socket?.close();
    };
  }, []);

  return notices;
}
`;
const LIVE_SCREEN = `import { Text, View } from "react-native";
import { useLiveNotices } from "@/hooks/useLiveNotices";

export default function Board() {
  const notices = useLiveNotices();
  return (
    <View style={{ padding: 16, gap: 8 }}>
      {notices.map((n) => (
        <Text key={n.id} testID="notice">{n.title}</Text>
      ))}
    </View>
  );
}
`;

/* ── 14.10 · Access rules ────────────────────────────────────────────── */
const RULES_START = `import { createServer } from "practice-server";

const app = createServer();

// For this lab, a token simply names the user. (Module 15 uses real tokens.)
const USERS = { "ada-token": { id: "u1", role: "member" }, "tunde-token": { id: "u2", role: "member" }, "admin-token": { id: "u0", role: "admin" } };
const currentUser = (req) => USERS[(req.headers.authorization || "").replace("Bearer ", "")] || null;

let notices = [
  { id: "1", authorId: "u1", title: "Water off on Saturday", status: "published" },
  { id: "2", authorId: "u2", title: "Lost cat", status: "published" },
  { id: "3", authorId: "u1", title: "Draft: street party", status: "draft" },
];
let nextId = 4;

// Everyone signed in sees published notices, plus their OWN drafts.
app.get("/notices", (req, res) => {
  res.json(notices);
});

app.post("/notices", (req, res) => {
  const notice = { id: String(nextId++), status: "published", ...req.body };
  notices.push(notice);
  res.status(201).json(notice);
});

// Only the author, or an admin, may edit or delete a notice.
app.patch("/notices/:id", (req, res) => {
  const notice = notices.find((n) => n.id === req.params.id);
  if (!notice) return res.status(404).json({ message: "Notice not found" });
  Object.assign(notice, req.body);
  res.json(notice);
});

app.delete("/notices/:id", (req, res) => {
  notices = notices.filter((n) => n.id !== req.params.id);
  res.status(204).end();
});

export default app;
`;
const RULES_MODEL = `import { createServer } from "practice-server";

const app = createServer();

// For this lab, a token simply names the user. (Module 15 uses real tokens.)
const USERS = { "ada-token": { id: "u1", role: "member" }, "tunde-token": { id: "u2", role: "member" }, "admin-token": { id: "u0", role: "admin" } };
const currentUser = (req) => USERS[(req.headers.authorization || "").replace("Bearer ", "")] || null;

let notices = [
  { id: "1", authorId: "u1", title: "Water off on Saturday", status: "published" },
  { id: "2", authorId: "u2", title: "Lost cat", status: "published" },
  { id: "3", authorId: "u1", title: "Draft: street party", status: "draft" },
];
let nextId = 4;

// Authentication: every route below needs a signed-in user.
app.use((req, res, next) => {
  req.user = currentUser(req);
  if (!req.user) return res.status(401).json({ message: "Sign in first" });
  next();
});

const canChange = (user, notice) => user.role === "admin" || notice.authorId === user.id;

// Everyone signed in sees published notices, plus their OWN drafts.
app.get("/notices", (req, res) => {
  res.json(notices.filter((n) => n.status === "published" || n.authorId === req.user.id));
});

app.post("/notices", (req, res) => {
  // Only the fields a user may set; the author comes from the token, never the body.
  const { title, status } = req.body || {};
  if (!title) return res.status(400).json({ message: "A title is required" });
  const notice = { id: String(nextId++), authorId: req.user.id, title, status: status === "draft" ? "draft" : "published" };
  notices.push(notice);
  res.status(201).json(notice);
});

// Only the author, or an admin, may edit or delete a notice.
app.patch("/notices/:id", (req, res) => {
  const notice = notices.find((n) => n.id === req.params.id);
  if (!notice) return res.status(404).json({ message: "Notice not found" });
  if (!canChange(req.user, notice)) return res.status(403).json({ message: "You can only change your own notices" });
  const { title, status } = req.body || {};
  if (title !== undefined) notice.title = title;
  if (status === "draft" || status === "published") notice.status = status;
  res.json(notice);
});

app.delete("/notices/:id", (req, res) => {
  const notice = notices.find((n) => n.id === req.params.id);
  if (!notice) return res.status(404).json({ message: "Notice not found" });
  if (!canChange(req.user, notice)) return res.status(403).json({ message: "You can only change your own notices" });
  notices = notices.filter((n) => n.id !== req.params.id);
  res.status(204).end();
});

export default app;
`;

/* ── 14.11 · Indexes and efficiency ──────────────────────────────────── */
const INDEX_START = `import { createServer, database } from "practice-server";

const app = createServer();
const raw = database();

// Counts every query this server runs (for this lab's checks).
let queries = 0;
const db = {
  exec: (sql) => raw.exec(sql),
  all: (sql, params) => (queries++, raw.all(sql, params)),
  get: (sql, params) => (queries++, raw.get(sql, params)),
  run: (sql, params) => (queries++, raw.run(sql, params)),
};

db.exec(\`
  CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT NOT NULL);
  CREATE TABLE notices (id INTEGER PRIMARY KEY, user_id INTEGER NOT NULL REFERENCES users(id), category TEXT NOT NULL, title TEXT NOT NULL, created_at TEXT NOT NULL);
  INSERT INTO users (id, name) VALUES (1, 'Ada'), (2, 'Tunde'), (3, 'Bisi'), (4, 'Chidi');
  WITH RECURSIVE n(i) AS (SELECT 1 UNION ALL SELECT i + 1 FROM n WHERE i < 5000)
  INSERT INTO notices (user_id, category, title, created_at)
  SELECT 1 + i % 4, CASE i % 3 WHEN 0 THEN 'events' WHEN 1 THEN 'lost-found' ELSE 'services' END, 'Notice ' || i, date('2026-01-01', '+' || (i % 290) || ' days')
  FROM n;
\`);

// 1. Add the index this query needs.

const LIST = "SELECT id, user_id, title, created_at FROM notices WHERE category = ? ORDER BY created_at DESC LIMIT 20";

// 2. This makes 21 queries for 20 notices (the "N + 1" problem). Make it one.
app.get("/notices", (req, res) => {
  queries = 0;
  const rows = db.all(LIST, [req.query.category]);
  const result = rows.map((n) => ({ id: n.id, title: n.title, createdAt: n.created_at, author: db.get("SELECT name FROM users WHERE id = ?", [n.user_id]).name }));
  res.json(result);
});

// For this lab's checks only.
app.get("/debug/queries", (req, res) => res.json({ queries }));
app.get("/debug/plan", (req, res) => res.json(raw.all("EXPLAIN QUERY PLAN " + LIST, ["events"]).map((r) => r.detail)));

export default app;
`;
const INDEX_MODEL = `import { createServer, database } from "practice-server";

const app = createServer();
const raw = database();

// Counts every query this server runs (for this lab's checks).
let queries = 0;
const db = {
  exec: (sql) => raw.exec(sql),
  all: (sql, params) => (queries++, raw.all(sql, params)),
  get: (sql, params) => (queries++, raw.get(sql, params)),
  run: (sql, params) => (queries++, raw.run(sql, params)),
};

db.exec(\`
  CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT NOT NULL);
  CREATE TABLE notices (id INTEGER PRIMARY KEY, user_id INTEGER NOT NULL REFERENCES users(id), category TEXT NOT NULL, title TEXT NOT NULL, created_at TEXT NOT NULL);
  INSERT INTO users (id, name) VALUES (1, 'Ada'), (2, 'Tunde'), (3, 'Bisi'), (4, 'Chidi');
  WITH RECURSIVE n(i) AS (SELECT 1 UNION ALL SELECT i + 1 FROM n WHERE i < 5000)
  INSERT INTO notices (user_id, category, title, created_at)
  SELECT 1 + i % 4, CASE i % 3 WHEN 0 THEN 'events' WHEN 1 THEN 'lost-found' ELSE 'services' END, 'Notice ' || i, date('2026-01-01', '+' || (i % 290) || ' days')
  FROM n;
\`);

// 1. Add the index this query needs: it filters by category, then sorts by date.
db.exec("CREATE INDEX notices_category_created ON notices (category, created_at)");

const LIST = "SELECT id, user_id, title, created_at FROM notices WHERE category = ? ORDER BY created_at DESC LIMIT 20";

// 2. One query: the JOIN brings each author's name along.
app.get("/notices", (req, res) => {
  queries = 0;
  const rows = db.all(
    "SELECT notices.id, notices.title, notices.created_at AS createdAt, users.name AS author FROM notices JOIN users ON users.id = notices.user_id WHERE notices.category = ? ORDER BY notices.created_at DESC LIMIT 20",
    [req.query.category]
  );
  res.json(rows);
});

// For this lab's checks only.
app.get("/debug/queries", (req, res) => res.json({ queries }));
app.get("/debug/plan", (req, res) => res.json(raw.all("EXPLAIN QUERY PLAN " + LIST, ["events"]).map((r) => r.detail)));

export default app;
`;

/* ── 14.P · The practical ────────────────────────────────────────────── */
const BOARD_SERVER = `import { createServer, database, tokens } from "practice-server";

// The noticeboard's backend, complete. Read it: it uses everything from this module.
const app = createServer();
const db = database();
const SECRET = "practice-only-secret";

db.exec(\`
  PRAGMA foreign_keys = ON;
  CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT NOT NULL UNIQUE);
  CREATE TABLE notices (
    id INTEGER PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    photo_url TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
  CREATE INDEX notices_created ON notices (created_at);
  INSERT INTO users (name) VALUES ('Ada'), ('Tunde');
  INSERT INTO notices (user_id, title, created_at) VALUES (2, 'Lost cat: grey, answers to Biscuit', '2026-10-19 08:00:00');
\`);

const SELECT = "SELECT notices.id, notices.title, notices.photo_url AS photoUrl, users.name AS author FROM notices JOIN users ON users.id = notices.user_id";

// POST /auth/login { name } → { token } (a practice sign-in: just a name)
app.post("/auth/login", (req, res) => {
  const user = db.get("SELECT id, name FROM users WHERE name = ?", [String(req.body?.name || "")]);
  if (!user) return res.status(401).json({ message: "Unknown user" });
  res.json({ token: tokens.sign({ sub: user.id, name: user.name }, SECRET, { expiresIn: "1d" }), name: user.name });
});

app.use((req, res, next) => {
  try {
    req.user = tokens.verify((req.headers.authorization || "").replace("Bearer ", ""), SECRET);
    next();
  } catch {
    res.status(401).json({ message: "Sign in first" });
  }
});

// GET /notices → [{ id, title, photoUrl, author }], newest first
app.get("/notices", (req, res) => res.json(db.all(SELECT + " ORDER BY notices.created_at DESC, notices.id DESC LIMIT 50")));

// POST /notices, multipart/form-data: a "title" field and an optional "photo" file (JPEG or PNG)
app.post("/notices", (req, res) => {
  const title = String(req.body?.fields?.title ?? req.body?.title ?? "").trim();
  if (!title) return res.status(400).json({ message: "A title is required" });
  const photo = (req.files || [])[0];
  if (photo && !["image/jpeg", "image/png"].includes(photo.type)) return res.status(415).json({ message: "Photos must be JPEG or PNG" });
  const { lastInsertRowId } = db.run("INSERT INTO notices (user_id, title, photo_url) VALUES (?, ?, ?)", [req.user.sub, title, photo ? photo.url : null]);
  const notice = db.get(SELECT + " WHERE notices.id = ?", [lastInsertRowId]);
  app.publish("notices", { type: "created", notice });
  res.status(201).json(notice);
});

// DELETE /notices/:id: authors only
app.delete("/notices/:id", (req, res) => {
  const notice = db.get("SELECT id, user_id FROM notices WHERE id = ?", [Number(req.params.id)]);
  if (!notice) return res.status(404).json({ message: "Notice not found" });
  if (notice.user_id !== req.user.sub) return res.status(403).json({ message: "You can only remove your own notices" });
  db.run("DELETE FROM notices WHERE id = ?", [notice.id]);
  app.publish("notices", { type: "deleted", id: notice.id });
  res.status(204).end();
});

// Live updates: wss://api.example.com/realtime?channel=notices
// Messages: { channel: "notices", payload: { type: "created", notice } | { type: "deleted", id } }

export default app;
`;
const P_MODEL = {
  "src/services/board.ts": `export type Notice = { id: number; title: string; photoUrl: string | null; author: string };

const BASE = "https://api.example.com";

async function call<T>(path: string, token: string | null, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  if (token) headers.set("Authorization", "Bearer " + token);
  const response = await fetch(BASE + path, { ...init, headers });
  if (response.status === 204) return undefined as T;
  const data = await response.json();
  if (!response.ok) throw new Error(data.message ?? "Request failed");
  return data as T;
}

export const signIn = (name: string) =>
  call<{ token: string; name: string }>("/auth/login", null, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name }) });

export const getNotices = (token: string) => call<Notice[]>("/notices", token);

export function postNotice(token: string, title: string, photo: { uri: string; name: string; type: string } | null) {
  const form = new FormData();
  form.append("title", title);
  if (photo) form.append("photo", photo as unknown as Blob);
  return call<Notice>("/notices", token, { method: "POST", body: form });
}

export const deleteNotice = (token: string, id: number) => call<void>("/notices/" + id, token, { method: "DELETE" });
`,
  "src/context/session.tsx": `import { createContext, useContext, useState, type ReactNode } from "react";
import { signIn as apiSignIn } from "@/services/board";

type Session = { token: string; name: string } | null;
const SessionContext = createContext<{ session: Session; signIn: (name: string) => Promise<void> } | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session>(null);
  const signIn = async (name: string) => setSession(await apiSignIn(name));
  return <SessionContext.Provider value={{ session, signIn }}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const value = useContext(SessionContext);
  if (!value) throw new Error("useSession must be used inside <SessionProvider>");
  return value;
}
`,
  "src/hooks/useBoard.ts": `import { useEffect, useState } from "react";
import { getNotices, type Notice } from "@/services/board";

type Event = { type: "created"; notice: Notice } | { type: "deleted"; id: number };

/** The notices, loaded once and then kept up to date live. */
export function useBoard(token: string) {
  const [notices, setNotices] = useState<Notice[]>([]);
  useEffect(() => {
    let closed = false;
    getNotices(token).then((list) => !closed && setNotices(list));
    const socket = new WebSocket("wss://api.example.com/realtime?channel=notices");
    socket.onmessage = (message) => {
      const event: Event = JSON.parse(String(message.data)).payload;
      setNotices((list) =>
        event.type === "created" ? [event.notice, ...list.filter((n) => n.id !== event.notice.id)] : list.filter((n) => n.id !== event.id)
      );
    };
    return () => {
      closed = true;
      socket.close();
    };
  }, [token]);
  return notices;
}
`,
  "src/app/_layout.tsx": `import { Stack } from "expo-router";
import { SessionProvider } from "@/context/session";

export default function RootLayout() {
  return (
    <SessionProvider>
      <Stack>
        <Stack.Screen name="index" options={{ title: "Noticeboard" }} />
      </Stack>
    </SessionProvider>
  );
}
`,
  "src/app/index.tsx": `import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { useSession } from "@/context/session";
import { useBoard } from "@/hooks/useBoard";
import { deleteNotice, postNotice } from "@/services/board";

function Board({ token, name }: { token: string; name: string }) {
  const notices = useBoard(token);
  const [title, setTitle] = useState("");
  const [photo, setPhoto] = useState<{ uri: string; name: string; type: string } | null>(null);
  const [error, setError] = useState("");

  async function choosePhoto() {
    const r = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ["images"], quality: 0.6 });
    if (!r.canceled) setPhoto({ uri: r.assets[0].uri, name: r.assets[0].fileName ?? "photo.jpg", type: r.assets[0].mimeType ?? "image/jpeg" });
  }

  async function post() {
    setError("");
    try {
      await postNotice(token, title.trim(), photo);
      setTitle("");
      setPhoto(null);
    } catch (e) {
      setError((e as Error).message);
    }
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 10 }}>
      <Text>Signed in as {name}</Text>
      <TextInput placeholder="What's happening?" value={title} onChangeText={setTitle} style={{ minHeight: 48, borderWidth: 1, borderColor: "#cbd5e1", borderRadius: 10, paddingHorizontal: 12 }} />
      <Pressable accessibilityRole="button" onPress={choosePhoto} style={{ minHeight: 44, justifyContent: "center" }}>
        <Text>{photo ? "Photo chosen" : "Add a photo"}</Text>
      </Pressable>
      <Pressable accessibilityRole="button" onPress={post} style={{ minHeight: 48, justifyContent: "center" }}>
        <Text>Post</Text>
      </Pressable>
      {error ? <Text accessibilityRole="alert">{error}</Text> : null}
      {notices.map((n) => (
        <View key={n.id} testID="notice" style={{ gap: 6, paddingVertical: 8 }}>
          <Text>{n.title} · {n.author}</Text>
          {n.photoUrl ? <Image source={{ uri: n.photoUrl }} style={{ width: 160, height: 120, borderRadius: 8 }} accessibilityLabel={"Photo for " + n.title} /> : null}
          {n.author === name ? (
            <Pressable accessibilityRole="button" accessibilityLabel={"Remove " + n.title} onPress={() => deleteNotice(token, n.id).catch((e: Error) => setError(e.message))} style={{ minHeight: 44, justifyContent: "center" }}>
              <Text>Remove</Text>
            </Pressable>
          ) : null}
        </View>
      ))}
    </ScrollView>
  );
}

export default function Home() {
  const { session, signIn } = useSession();
  if (session) return <Board token={session.token} name={session.name} />;
  return (
    <View style={{ padding: 20, gap: 10 }}>
      <Pressable accessibilityRole="button" onPress={() => signIn("Ada")} style={{ minHeight: 48, justifyContent: "center" }}>
        <Text>Sign in as Ada</Text>
      </Pressable>
    </View>
  );
}
`,
};
const tundeToken = `const { token: tunde } = await (await fetch('https://api.example.com/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: 'Tunde' }) })).json();`;

export const PART2 = [
  /* ═══════════════ LESSON 88 · 14.9 – 14.10 ═══════════════ */
  {
    id: "md-l88-realtime-rules",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 5,
    covers: ["14.9", "14.10"],
    title: "Realtime Updates and Access Rules",
    subtitle: "Data that arrives by itself, and data only the right people can touch",
    estimatedMinutes: 55,
    intro: "Chat, live scores and shared boards push changes to every phone as they happen. And every backend must decide, on every request, who may do what.",
    atoms: [
      {
        id: "a-md-realtime",
        title: "Realtime updates where needed",
        explain:
          "Polling (fetching every few seconds) wastes battery and data. For data that must appear the moment it changes (messages, a delivery's position, a shared board), keep a connection open: a WEBSOCKET (new WebSocket(\"wss://…\"), with onopen, onmessage, onclose) or a service built on one (Firebase listeners, Supabase Realtime, Ably, Pusher). The pattern: load the current list over HTTP, then apply each event (created, updated, deleted) as it arrives, ignoring duplicates. Connections DROP on mobile (tunnels, switching networks, the app going to the background, where the OS closes it), so reconnect with backoff and reload the list after reconnecting to catch what you missed; close the socket when the screen unmounts. Use realtime only where it matters: most screens are fine refreshing on focus or with pull-to-refresh, and push notifications reach a closed app (Module 16).",
        webLab: expoLab({
          name: "Kobo",
          layout: titled("Noticeboard"),
          task:
            "Make useLiveNotices live: connect to wss://api.example.com/realtime?channel=notices, load the list when connected, apply \"created\" (add to the top, no duplicates) and \"deleted\" (remove) events from each message's payload, reconnect with growing delays if the connection closes, and close it (without reconnecting) when the screen unmounts.",
          files: { "src/hooks/useLiveNotices.ts": LIVE_START, "src/app/index.tsx": LIVE_SCREEN, "server/index.js": LIVE_SERVER },
          readOnly: ["src/app/index.tsx", "server/index.js"],
          solution: { "src/hooks/useLiveNotices.ts": LIVE_MODEL },
          tests: [
            { label: "A notice posted by someone else appears without refreshing", check: `await waitFor(() => has('Water off on Saturday'), 3000); ${call("POST", "/notices", null, "{ title: 'Football at 5' }")}; await waitFor(() => findAll({ testID: 'notice' }).length === 2, 3000); return findAll({ testID: 'notice' })[0].textContent === 'Football at 5';`, fail: "socket.onmessage → apply the payload's \"created\" event." },
            { label: "Deleted notices disappear live", check: `await waitFor(() => has('Football at 5'), 3000); ${call("DELETE", "/notices/1")}; await waitFor(() => !has('Water off on Saturday'), 3000); return findAll({ testID: 'notice' }).length === 1;`, fail: "Handle { type: \"deleted\", id }." },
            { label: "No duplicates, and the socket is closed and reconnected properly", check: "const c = code('src/hooks/useLiveNotices.ts'); return c.includes('wss://api.example.com/realtime?channel=notices') && /\\.close\\(\\)/.test(c) && /onclose/.test(c) && /setTimeout/.test(c);", fail: "Close in the effect's clean-up; reconnect from onclose with a delay." },
          ],
          hint: "Keep a closed flag so the clean-up's close() doesn't trigger a reconnect.",
          successMessage: "A board that updates itself, and survives dropped connections.",
        }),
      },
      {
        id: "a-md-access-rules",
        title: "Data access rules and authorization",
        explain:
          "AUTHENTICATION is knowing who is asking; AUTHORIZATION is deciding what they may do, and it must happen on the server for EVERY request. Common rules: signed-in users only (401 otherwise); owners only, or admins (403 \"you can't change this\"); visibility (published items for everyone, drafts only for their author). Two classic holes: trusting ids in the URL without checking ownership (any user can edit /notices/2 by changing the number: \"broken object level authorization\", the top API security risk), and MASS ASSIGNMENT (copying the whole request body into the record, so a user sends { authorId: \"someone-else\" } or { role: \"admin\" }). Take the owner from the token and copy only fields users may set. With Firebase or Supabase the same rules are written as security rules or RLS policies.",
        webLab: expoLab({
          name: "Kobo",
          layout: titled("Server"),
          task:
            "Lock down server/index.js: every route requires a signed-in user (401 \"Sign in first\"); GET /notices returns published notices plus the user's own drafts; POST /notices takes only title and status from the body, with authorId from the token; PATCH and DELETE are allowed only for the author or an admin (403 \"You can only change your own notices\"), and PATCH changes only title and status.",
          files: { "server/index.js": RULES_START, "src/app/index.tsx": `import { Text } from "react-native";\n\nexport default function Home() {\n  return <Text style={{ padding: 20 }}>This lab is the server: see server/index.js.</Text>;\n}\n` },
          readOnly: ["src/app/index.tsx"],
          solution: { "server/index.js": RULES_MODEL },
          tests: [
            { label: "Signed-out requests are refused", check: `const r = ${call("GET", "/notices")}; return r.status === 401;`, fail: "app.use(…) refusing requests without a user." },
            { label: "Drafts are visible only to their author", check: `const ada = ${q("/notices", "ada-token")}; const tunde = ${q("/notices", "tunde-token")}; return ada.length === 3 && tunde.length === 2 && !tunde.some((n) => n.status === 'draft');`, fail: "status === \"published\" || authorId === req.user.id" },
            { label: "Users can't change other people's notices; admins can", check: `const a = ${call("PATCH", "/notices/2", "ada-token", "{ title: 'Found cat' }")}; const b = ${call("DELETE", "/notices/2", "ada-token")}; const c = ${call("PATCH", "/notices/2", "tunde-token", "{ title: 'Lost cat (found!)' }")}; const d = ${call("DELETE", "/notices/1", "admin-token")}; return a.status === 403 && b.status === 403 && c.status === 200 && d.status === 204;`, fail: "Check role === \"admin\" || notice.authorId === user.id before changing anything." },
            { label: "No mass assignment", check: `const made = await (${call("POST", "/notices", "tunde-token", "{ title: 'Street party', authorId: 'u1', id: '99' }")}).json(); const patched = await (${call("PATCH", "/notices/2", "tunde-token", "{ authorId: 'u1' }")}).json(); return made.authorId === 'u2' && made.id !== '99' && patched.authorId === 'u2';`, fail: "Copy only title and status; authorId comes from the token." },
          ],
          hint: "Middleware: app.use((req, res, next) => { … next(); }) runs before every route.",
          successMessage: "Every request is checked: who you are, and whether this is yours.",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════ LESSON 89 · 14.11 – 14.12 ═══════════════ */
  {
    id: "md-l89-performance-models",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 6,
    covers: ["14.11", "14.12"],
    title: "Indexes, Efficient Queries and Choosing a Database",
    subtitle: "Keeping queries fast as data grows, and picking the right kind of database",
    estimatedMinutes: 50,
    intro: "A query that takes 2 ms with 100 rows can take seconds with a million. A few habits keep a backend fast for years.",
    atoms: [
      {
        id: "a-md-indexes",
        title: "Database indexes and query efficiency",
        explain:
          "Without an INDEX, a query that filters (WHERE category = ?) must read every row: a full table SCAN. An index is a sorted lookup structure on one or more columns that lets the database jump straight to the matching rows. Index the columns you filter, join and sort by; a COMPOSITE index (category, created_at) serves \"WHERE category = ? ORDER BY created_at\" in one go (column order matters: equality first, then sort). Check with EXPLAIN QUERY PLAN (SQLite) or EXPLAIN ANALYZE (PostgreSQL): you want SEARCH … USING INDEX, not SCAN. Indexes cost some disk space and slow writes slightly, so add them for real queries, not every column. The other big win: avoid the N + 1 PROBLEM (one query for a list, then one more per row for related data): use a JOIN, or one IN (…) query. Always LIMIT lists, and select only the columns you need.",
        webLab: expoLab({
          name: "Kobo",
          layout: titled("Server"),
          task:
            "The noticeboard has 5,000 notices and GET /notices?category=… is slow. In server/index.js: add a composite index for its WHERE and ORDER BY, so EXPLAIN QUERY PLAN shows the index instead of a SCAN; then rewrite the route to fetch the authors with a JOIN, so it runs one query instead of 21, returning { id, title, createdAt, author }.",
          files: { "server/index.js": INDEX_START, "src/app/index.tsx": `import { Text } from "react-native";\n\nexport default function Home() {\n  return <Text style={{ padding: 20 }}>This lab is the server: see server/index.js.</Text>;\n}\n` },
          readOnly: ["src/app/index.tsx"],
          solution: { "server/index.js": INDEX_MODEL },
          tests: [
            { label: "The query uses an index", check: "const plan = (await (await fetch('https://api.example.com/debug/plan')).json()).join(' | '); return /USING (COVERING )?INDEX/.test(plan) && !/SCAN notices/.test(plan) && !/TEMP B-TREE/.test(plan);", fail: "CREATE INDEX … ON notices (category, created_at)" },
            { label: "One query, with the same results", check: "const list = await (await fetch('https://api.example.com/notices?category=events')).json(); const { queries } = await (await fetch('https://api.example.com/debug/queries')).json(); return queries === 1 && list.length === 20 && typeof list[0].author === 'string' && list[0].createdAt >= list[19].createdAt && Object.keys(list[0]).sort().join() === 'author,createdAt,id,title';", fail: "JOIN users ON users.id = notices.user_id, in the same SELECT." },
          ],
          hint: "TEMP B-TREE in the plan means the database is sorting rows itself: the index should do that.",
          successMessage: "An index for the query's shape, and one query instead of twenty-one.",
        }),
      },
      {
        id: "a-md-relational-vs-document",
        title: "Choosing between relational and document databases",
        explain:
          "RELATIONAL databases (PostgreSQL, MySQL, SQLite) store tables with a fixed schema and relationships, query them flexibly with SQL and JOINs, and guarantee consistency with TRANSACTIONS and constraints: ideal for money, orders, inventory and anything with many relationships. DOCUMENT databases (Firestore, MongoDB) store JSON-like documents, often nested, with a flexible shape; reads are fast when you store data the way screens read it, but joins are limited, so data is often DUPLICATED (an author's name copied into each post) and must be kept in sync, and queries need matching indexes designed up front. Choose by your data and queries, not fashion: relational is the safe default for most apps; documents suit data that is naturally self-contained (a user's settings, a chat message, a product catalogue entry) or a real-time-first Firebase app.",
        decision: {
          scenario: "You're building a marketplace: sellers, products, stock levels, orders with several items each, payments and refunds. The finance team needs reports such as \"revenue per seller per month\", and an order must never be saved without reducing stock.",
          question: "Which database fits best?",
          options: [
            { id: "a", text: "A relational database such as PostgreSQL, with transactions and foreign keys", why: "The data is highly related, stock and orders must change together in one transaction, and reports need JOINs and GROUP BY: exactly what relational databases do best." },
            { id: "b", text: "A document database, storing each order with a full copy of each product and seller inside it", whyWrong: "Copies drift when a product or seller changes, keeping stock consistent across documents is hard, and cross-collection reports are awkward." },
            { id: "c", text: "AsyncStorage on the seller's phone", whyWrong: "Local to one phone: nobody else could buy anything." },
            { id: "d", text: "Whichever is newest", whyWrong: "Choose by the data's shape and the queries you need, not by novelty." },
          ],
          correct: "a",
          aftermath: "Relational for related, transactional data; documents for self-contained records read whole.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════ LESSON 90 · 14.P ═══════════════ */
  {
    id: "md-l90-m14-project",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 7,
    covers: ["14.P"],
    title: "Practical: A Community Noticeboard",
    subtitle: "A database-backed app with photo uploads and live updates",
    estimatedMinutes: 120,
    intro: "The backend is written (server/index.js): read it first, it uses every idea from this module. Your job is the app that brings it to life.",
    atoms: [
      {
        id: "a-md-m14-project",
        title: "Build the noticeboard app",
        explain:
          "The server signs users in by name, lists notices with their authors, accepts new notices as multipart/form-data with an optional photo, lets authors remove their own notices, and publishes every change on the \"notices\" realtime channel.",
        webLab: expoLab({
          name: "Kobo Board",
          layout: null,
          task:
            "Build: src/services/board.ts (signIn(name), getNotices(token), postNotice(token, title, photo | null) as multipart with a \"title\" field and an optional \"photo\" file, deleteNotice(token, id); the token as a Bearer header); a session context; useBoard(token) loading the notices and applying live \"created\"/\"deleted\" events from wss://api.example.com/realtime?channel=notices. Screens: index shows \"Sign in as Ada\" until signed in, then \"Signed in as Ada\", a \"What's happening?\" input, \"Add a photo\" (the photo library), \"Post\", the server's errors (accessibilityRole \"alert\"), and every notice as \"<title> · <author>\" (testID \"notice\") with its photo (accessibilityLabel \"Photo for <title>\") and, only on your own notices, a \"Remove <title>\" button.",
          files: {
            "src/app/_layout.tsx": "// The root layout.\n",
            "src/app/index.tsx": "// The noticeboard.\n",
            "src/services/board.ts": "",
            "src/context/session.tsx": "",
            "src/hooks/useBoard.ts": "",
            "server/index.js": BOARD_SERVER,
          },
          readOnly: ["server/index.js"],
          revealSolution: false,
          solution: P_MODEL,
          tests: [
            { label: "Signing in shows the board", check: "await press('Sign in as Ada'); await waitFor(() => has('Lost cat: grey, answers to Biscuit · Tunde'), 3000); return has('Signed in as Ada');", fail: "signIn, then getNotices with the token." },
            { label: "Posting with a photo works", check: "await waitFor(() => has('Post'), 3000); await typeInto(\"What's happening?\", 'Water off on Saturday'); await press('Add a photo'); await pickPhoto(3); await press('Post'); await waitFor(() => has('Water off on Saturday · Ada'), 3000); const r = serverRequests().find((x) => x.method === 'POST' && x.path === '/notices'); return exists({ label: 'Photo for Water off on Saturday' }) && r.body.files[0].field === 'photo' && /^Bearer /.test(r.headers.authorization || '');", fail: "FormData with \"title\" and \"photo\", and the Authorization header." },
            { label: "Other people's notices arrive live", check: `${tundeToken} const form = new FormData(); form.append('title', 'Football at 5'); await fetch('https://api.example.com/notices', { method: 'POST', headers: { Authorization: 'Bearer ' + tunde }, body: form }); await waitFor(() => has('Football at 5 · Tunde'), 3000); return findAll({ testID: 'notice' })[0].textContent.startsWith('Football at 5');`, fail: "Apply \"created\" events from the WebSocket." },
            { label: "You can remove only your own notices", check: "await waitFor(() => has('Water off on Saturday · Ada'), 3000); const others = exists({ role: 'button', name: 'Remove Football at 5' }); await press({ role: 'button', name: 'Remove Water off on Saturday' }); await waitFor(() => !hasText('Water off on Saturday'), 3000); return !others;", fail: "Show Remove only when the author is you; apply \"deleted\" events." },
            { label: "Errors from the server are shown", check: "await press('Post'); await waitFor(() => exists({ role: 'alert' }), 3000); return has('A title is required');", fail: "Catch postNotice's error and show its message." },
          ],
          hint: "Read server/index.js first: every route and message format is described there.",
          successMessage: "A real client for a real backend: accounts, uploads, live updates and ownership.",
        }),
      },
    ],
    task: {
      title: "Module 14 practical: a backend for your own app",
      intro: "Apply this module to the app you are building.",
      prompts: [
        "Decide what runs on the server and what on the phone, and list every value the server must compute or check itself.",
        "Choose your backend (your own server, Supabase or Firebase) and write down why.",
        "Design the tables (or collections) with their relationships, then write the queries your screens need, with indexes for each.",
        "Write the access rules (or RLS policies or security rules) and test each one with two users and a signed-out request.",
        "Mastery checkpoint: draw your data model and, for each screen, name the endpoint or query it uses and who is allowed to call it.",
      ],
      closing: "Next: Module 15, authentication and account management.",
    },
    requirements: { read: true, video: false, assessment: true },
  },
];
