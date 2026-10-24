/**
 * MOBILE APP DEVELOPMENT · MODULE 13 · REST APIS AND NETWORKING (part 2)
 *
 * Curriculum 13.9 – 13.P: timeouts and network errors, retries and rate
 * limits, uploading images and documents, testing APIs, and the module
 * practical (a news reader).
 *
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 */

import { expoLab } from "./md-helpers.js";
import { MODULE, SECTION_ID, titled } from "./md-m13-part1.js";

/* ── 13.9 · Timeouts and network errors ──────────────────────────────── */
const TIMEOUT_SERVER = `import { createServer } from "practice-server";

const app = createServer();

app.get("/fast", (req, res) => res.json({ ok: true }));
app.get("/slow", (req, res) => res.json({ ok: true }), { delay: 3000 });
app.get("/broken", (req, res) => res.status(500).json({ message: "Something broke on our side" }));

export default app;
`;
const TIMEOUT_START = `/** fetch that gives up after timeoutMs. */
export async function fetchWithTimeout(url: string, { timeoutMs = 10_000, ...init }: RequestInit & { timeoutMs?: number } = {}): Promise<Response> {
  return fetch(url, init);
}

/** Words for the user, whatever went wrong. */
export function friendlyError(error: unknown): string {
  return String(error);
}
`;
const TIMEOUT_MODEL = `/** fetch that gives up after timeoutMs. */
export async function fetchWithTimeout(url: string, { timeoutMs = 10_000, ...init }: RequestInit & { timeoutMs?: number } = {}): Promise<Response> {
  const controller = new AbortController();
  let timedOut = false;
  const timer = setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, timeoutMs);
  // If the caller cancels too, pass that on.
  init.signal?.addEventListener("abort", () => controller.abort());
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } catch (e) {
    if (timedOut) throw Object.assign(new Error("The server took too long to respond"), { name: "TimeoutError" });
    throw e;
  } finally {
    clearTimeout(timer);
  }
}

/** Words for the user, whatever went wrong. */
export function friendlyError(error: unknown): string {
  const e = error as Error;
  if (e?.name === "TimeoutError") return "The server took too long to respond. Try again.";
  if (e instanceof TypeError) return "You're offline. Check your connection and try again.";
  return e?.message || "Something went wrong.";
}
`;
const TIMEOUT_SCREEN = `import { useState } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { fetchWithTimeout, friendlyError } from "@/http/fetchWithTimeout";

export default function Status() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function load(path: string) {
    setLoading(true);
    setMessage("");
    try {
      const response = await fetchWithTimeout("https://api.example.com" + path, { timeoutMs: 1000 });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      setMessage("Loaded");
    } catch (e) {
      setMessage(friendlyError(e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={{ padding: 20, gap: 10 }}>
      {["/fast", "/slow", "/broken"].map((p) => (
        <Pressable key={p} accessibilityRole="button" onPress={() => load(p)} style={{ minHeight: 44, justifyContent: "center" }}>
          <Text>Load {p.slice(1)}</Text>
        </Pressable>
      ))}
      {loading ? <ActivityIndicator /> : <Text testID="message">{message}</Text>}
    </View>
  );
}
`;

/* ── 13.10 · Retries and rate limits ─────────────────────────────────── */
const RETRY_SERVER = `import { createServer } from "practice-server";

const app = createServer();
const calls = {};
const count = (name) => (calls[name] = (calls[name] || 0) + 1);

// Fails twice, then works: a blip.
app.get("/flaky", (req, res) => (count("flaky") <= 2 ? res.status(503).json({ message: "Try again" }) : res.json({ ok: true })));
// A mistake in the request: retrying can't help.
app.get("/bad", (req, res) => res.status(400).json({ message: "Missing parameter" }));
// Rate limited once, with a Retry-After header.
app.get("/limited", (req, res) => (count("limited") === 1 ? res.status(429).set("Retry-After", "1").json({ message: "Slow down" }) : res.json({ ok: true })));
// Down for good.
app.get("/down", (req, res) => res.status(503).json({ message: "Down for maintenance" }));

app.get("/calls", (req, res) => res.json(calls));

export default app;
`;
const RETRY_START = `type Options = { retries?: number; baseDelayMs?: number; maxDelayMs?: number };

/**
 * Calls send() and retries when it is worth it: network failures, 5xx and 429.
 * Never for other 4xx. Waits longer each time (with jitter), and honours Retry-After.
 * Returns the last Response (or throws the last network error).
 */
export async function withRetry(send: () => Promise<Response>, { retries = 3, baseDelayMs = 500, maxDelayMs = 10_000 }: Options = {}): Promise<Response> {
  return send();
}
`;
const RETRY_MODEL = `type Options = { retries?: number; baseDelayMs?: number; maxDelayMs?: number };

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/** Worth trying again: the server failed, or asked us to slow down. */
const retryable = (status: number) => status >= 500 || status === 429;

/**
 * Calls send() and retries when it is worth it: network failures, 5xx and 429.
 * Never for other 4xx. Waits longer each time (with jitter), and honours Retry-After.
 * Returns the last Response (or throws the last network error).
 */
export async function withRetry(send: () => Promise<Response>, { retries = 3, baseDelayMs = 500, maxDelayMs = 10_000 }: Options = {}): Promise<Response> {
  for (let attempt = 0; ; attempt++) {
    let response: Response | null = null;
    try {
      response = await send();
      if (!retryable(response.status) || attempt === retries) return response;
    } catch (e) {
      // Only network failures (TypeError) are retried; and not forever.
      if (!(e instanceof TypeError) || attempt === retries) throw e;
    }
    // Exponential backoff: base, 2 × base, 4 × base… plus up to 30% random jitter, capped.
    let delay = Math.min(maxDelayMs, baseDelayMs * 2 ** attempt) * (1 + Math.random() * 0.3);
    const retryAfter = Number(response?.headers.get("retry-after"));
    if (retryAfter > 0) delay = Math.min(maxDelayMs, retryAfter * 1000);
    await sleep(delay);
  }
}
`;

/* ── 13.11 · Uploads ─────────────────────────────────────────────────── */
const UPLOAD_SERVER = `import { createServer } from "practice-server";

const app = createServer();
const ALLOWED = ["image/jpeg", "image/png", "application/pdf"];

app.post("/uploads", (req, res) => {
  const file = req.files[0];
  if (!file) return res.status(400).json({ message: "No file received" });
  if (!ALLOWED.includes(file.type)) return res.status(415).json({ message: "Only JPEG, PNG or PDF files" });
  if (file.size > 5 * 1024 * 1024) return res.status(413).json({ message: "That file is too large (5 MB at most)" });
  res.status(201).json({ url: file.url, name: file.name, field: file.field, size: file.size });
});

export default app;
`;
const UPLOAD_START = `import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";

export type Uploaded = { url: string; name: string; size: number };

/** Lets the user choose a photo, uploads it as the "photo" field, and returns the result (null if cancelled). */
export async function pickAndUploadPhoto(): Promise<Uploaded | null> {
  return null;
}

/** Lets the user choose a PDF, uploads it as the "receipt" field, and returns the result (null if cancelled). */
export async function pickAndUploadReceipt(): Promise<Uploaded | null> {
  return null;
}
`;
const UPLOAD_MODEL = `import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";

export type Uploaded = { url: string; name: string; size: number };

/** Sends one file as multipart/form-data. Don't set Content-Type yourself: fetch adds it with the boundary. */
async function upload(field: string, file: { uri: string; name: string; type: string }): Promise<Uploaded> {
  const form = new FormData();
  // React Native's FormData takes { uri, name, type } for a file on the phone.
  form.append(field, file as unknown as Blob);
  const response = await fetch("https://api.example.com/uploads", { method: "POST", body: form });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message ?? "Upload failed");
  return data;
}

/** Lets the user choose a photo, uploads it as the "photo" field, and returns the result (null if cancelled). */
export async function pickAndUploadPhoto(): Promise<Uploaded | null> {
  const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ["images"], quality: 0.7 });
  if (result.canceled) return null;
  const photo = result.assets[0];
  return upload("photo", { uri: photo.uri, name: photo.fileName ?? "photo.jpg", type: photo.mimeType ?? "image/jpeg" });
}

/** Lets the user choose a PDF, uploads it as the "receipt" field, and returns the result (null if cancelled). */
export async function pickAndUploadReceipt(): Promise<Uploaded | null> {
  const result = await DocumentPicker.getDocumentAsync({ type: "application/pdf" });
  if (result.canceled) return null;
  const doc = result.assets[0];
  return upload("receipt", { uri: doc.uri, name: doc.name, type: doc.mimeType ?? "application/pdf" });
}
`;
const UPLOAD_SCREEN = `import { Image } from "expo-image";
import { useState } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { pickAndUploadPhoto, pickAndUploadReceipt } from "@/services/uploads";

export default function Profile() {
  const [photo, setPhoto] = useState<string | null>(null);
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);

  const run = (job: () => Promise<void>) => async () => {
    setBusy(true);
    setStatus("");
    try {
      await job();
    } catch (e) {
      setStatus((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <View style={{ padding: 20, gap: 12, alignItems: "center" }}>
      {photo ? <Image testID="avatar" source={{ uri: photo }} style={{ width: 120, height: 120, borderRadius: 60 }} accessibilityLabel="Profile photo" /> : <Text>No photo yet</Text>}
      <Pressable accessibilityRole="button" onPress={run(async () => { const r = await pickAndUploadPhoto(); if (r) setPhoto(r.url); })} style={{ minHeight: 48, justifyContent: "center" }}>
        <Text>Change photo</Text>
      </Pressable>
      <Pressable accessibilityRole="button" onPress={run(async () => { const r = await pickAndUploadReceipt(); if (r) setStatus(r.name + " uploaded"); })} style={{ minHeight: 48, justifyContent: "center" }}>
        <Text>Attach receipt</Text>
      </Pressable>
      {busy ? <ActivityIndicator /> : <Text testID="status">{status}</Text>}
    </View>
  );
}
`;

/* ── 13.12 · Testing APIs ────────────────────────────────────────────── */
const SHOP_API = (variant = "") => `import { createServer } from "practice-server";

const app = createServer();
let products = [
  { id: "1", name: "Shea butter", price: 3000 },
  { id: "2", name: "Ankara tote bag", price: 8500 },
];

app.get("/products", (req, res) => res.json(${variant === "wrong-shape" ? "products.map((p) => ({ ...p, price: String(p.price) }))" : "products"}));

app.post("/products", (req, res) => {
  const { name, price } = req.body || {};
  ${variant === "no-validation" ? "" : 'if (!name || typeof price !== "number") return res.status(400).json({ message: "name and a numeric price are required" });'}
  const product = { id: String(products.length + 1), name, price };
  products.push(product);
  res.status(201).json(product);
});

app.delete("/products/:id", (req, res) => {
  ${variant === "no-auth" ? "" : 'if (req.headers.authorization !== "Bearer admin-token") return res.status(401).json({ message: "Sign in as an admin" });'}
  products = products.filter((p) => p.id !== req.params.id);
  res.status(204).end();
});

export default app;
`;
const API_TEST_START = `// Automated API tests: each one sends a request and checks the answer.
// Run them after every server change, before the app depends on it.

const BASE = "https://api.example.com";

test("GET /products answers 200 with a list", async () => {
  const response = await fetch(BASE + "/products");
  expect(response.status).toBe(200);
  const products = await response.json();
  expect(Array.isArray(products)).toBe(true);
});

// Add tests that check:
// 1. every product has a string id, a string name and a numeric price;
// 2. POST /products without a price answers 400 with a message;
// 3. DELETE /products/1 without the admin token answers 401;
// 4. DELETE /products/1 with Authorization: Bearer admin-token answers 204.
`;
const API_TEST_MODEL = `// Automated API tests: each one sends a request and checks the answer.
// Run them after every server change, before the app depends on it.

const BASE = "https://api.example.com";
const json = { "Content-Type": "application/json" };

test("GET /products answers 200 with a list", async () => {
  const response = await fetch(BASE + "/products");
  expect(response.status).toBe(200);
  const products = await response.json();
  expect(Array.isArray(products)).toBe(true);
});

test("every product has the documented shape", async () => {
  const products = await (await fetch(BASE + "/products")).json();
  for (const p of products) {
    expect(typeof p.id).toBe("string");
    expect(typeof p.name).toBe("string");
    expect(typeof p.price).toBe("number");
  }
});

test("POST /products without a price is refused with a message", async () => {
  const response = await fetch(BASE + "/products", { method: "POST", headers: json, body: JSON.stringify({ name: "Kente stole" }) });
  expect(response.status).toBe(400);
  expect((await response.json()).message).toBeTruthy();
});

test("DELETE needs the admin token", async () => {
  const response = await fetch(BASE + "/products/1", { method: "DELETE" });
  expect(response.status).toBe(401);
});

test("DELETE with the admin token answers 204", async () => {
  const response = await fetch(BASE + "/products/1", { method: "DELETE", headers: { Authorization: "Bearer admin-token" } });
  expect(response.status).toBe(204);
});
`;

/* ── 13.P · The practical ────────────────────────────────────────────── */
const NEWS_SERVER = `import { createServer } from "practice-server";

const app = createServer();
const TOPICS = ["Lagos traffic", "Naira rate", "Tech in Abuja", "Football", "Farming"];
const ARTICLES = Array.from({ length: 30 }, (_, i) => ({
  id: String(i + 1),
  title: TOPICS[i % 5] + ": story " + (i + 1),
  body: "The full story number " + (i + 1) + ".",
}));
let first = true;

app.get("/articles", (req, res) => {
  // The very first request of the day hits a cold server.
  if (first) {
    first = false;
    return res.status(503).json({ message: "Warming up" });
  }
  const q = String(req.query.q || "").toLowerCase();
  const matching = ARTICLES.filter((a) => a.title.toLowerCase().includes(q));
  const start = req.query.cursor ? matching.findIndex((a) => a.id === req.query.cursor) + 1 : 0;
  const items = matching.slice(start, start + 10).map(({ body, ...a }) => a);
  res.json({ items, nextCursor: start + 10 < matching.length ? items[items.length - 1].id : null });
});

app.get("/articles/:id", (req, res) => {
  const article = ARTICLES.find((a) => a.id === req.params.id);
  if (!article) return res.status(404).json({ message: "Article not found" });
  res.json(article);
});

export default app;
`;
const P_MODEL = {
  "src/services/news.ts": `const BASE = "https://api.example.com";

export type Article = { id: string; title: string };
export type FullArticle = Article & { body: string };
export type Page = { items: Article[]; nextCursor: string | null };

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function getJson<T>(path: string, signal?: AbortSignal): Promise<T> {
  for (let attempt = 0; ; attempt++) {
    const response = await fetch(BASE + path, { signal });
    if ((response.status >= 500 || response.status === 429) && attempt < 2) {
      await sleep(300 * 2 ** attempt);
      continue;
    }
    const data = await response.json();
    if (!response.ok) throw new Error(data.message ?? "Request failed");
    return data as T;
  }
}

export function getArticles({ q, cursor, signal }: { q: string; cursor: string | null; signal?: AbortSignal }) {
  const params = new URLSearchParams();
  if (q) params.set("q", q);
  if (cursor) params.set("cursor", cursor);
  return getJson<Page>("/articles?" + params.toString(), signal);
}

export const getArticle = (id: string) => getJson<FullArticle>("/articles/" + encodeURIComponent(id));
`,
  "src/app/_layout.tsx": `import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";

// Retries live in the service, so the query client doesn't add more.
const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <Stack>
        <Stack.Screen name="index" options={{ title: "News" }} />
        <Stack.Screen name="article/[id]" options={{ title: "Article" }} />
      </Stack>
    </QueryClientProvider>
  );
}
`,
  "src/app/index.tsx": `import { useNetInfo } from "@react-native-community/netinfo";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Link } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, FlatList, Pressable, Text, TextInput, View } from "react-native";
import { getArticles } from "@/services/news";

export default function News() {
  const [q, setQ] = useState("");
  const query = q.trim();
  const { isConnected } = useNetInfo();
  const { data, error, refetch, fetchNextPage, hasNextPage, isFetchingNextPage, isPending } = useInfiniteQuery({
    queryKey: ["articles", query],
    queryFn: ({ pageParam, signal }) => getArticles({ q: query, cursor: pageParam, signal }),
    initialPageParam: null as string | null,
    getNextPageParam: (last) => last.nextCursor,
  });
  const articles = data?.pages.flatMap((p) => p.items) ?? [];
  const offline = isConnected === false;

  return (
    <View style={{ flex: 1 }}>
      {offline ? <Text accessibilityRole="alert" style={{ backgroundColor: "#fef3c7", padding: 10 }}>You're offline</Text> : null}
      <TextInput placeholder="Search the news" value={q} onChangeText={setQ} style={{ margin: 12, minHeight: 48, borderWidth: 1, borderColor: "#cbd5e1", borderRadius: 10, paddingHorizontal: 12 }} />
      {error && articles.length === 0 ? (
        <View style={{ padding: 16, gap: 8 }}>
          <Text>{offline ? "Connect to the internet to load the news." : error.message}</Text>
          <Pressable accessibilityRole="button" onPress={() => refetch()} style={{ minHeight: 44, justifyContent: "center" }}>
            <Text>Retry</Text>
          </Pressable>
        </View>
      ) : isPending ? (
        <ActivityIndicator style={{ marginTop: 24 }} />
      ) : (
        <FlatList
          data={articles}
          keyExtractor={(a) => a.id}
          renderItem={({ item }) => (
            <Link href={{ pathname: "/article/[id]", params: { id: item.id } }} testID="article" style={{ paddingHorizontal: 16, paddingVertical: 40, fontSize: 16 }}>
              {item.title}
            </Link>
          )}
          onEndReached={() => {
            if (hasNextPage && !isFetchingNextPage && !offline) fetchNextPage();
          }}
          onEndReachedThreshold={0.5}
          ListFooterComponent={isFetchingNextPage ? <ActivityIndicator style={{ margin: 16 }} /> : undefined}
          ListEmptyComponent={<Text style={{ padding: 16 }}>No articles match "{query}"</Text>}
        />
      )}
    </View>
  );
}
`,
  "src/app/article/[id].tsx": `import { useQuery } from "@tanstack/react-query";
import { Stack, useLocalSearchParams } from "expo-router";
import { ActivityIndicator, ScrollView, Text } from "react-native";
import { getArticle } from "@/services/news";

export default function ArticleScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data, error } = useQuery({ queryKey: ["article", id], queryFn: () => getArticle(id) });
  if (error) return <Text style={{ padding: 20 }}>{error.message}</Text>;
  if (!data) return <ActivityIndicator style={{ marginTop: 40 }} />;
  return (
    <ScrollView contentContainerStyle={{ padding: 20, gap: 12 }}>
      <Stack.Screen options={{ title: data.title }} />
      <Text style={{ fontSize: 22, fontWeight: "700" }}>{data.title}</Text>
      <Text>{data.body}</Text>
    </ScrollView>
  );
}
`,
};
const articleReqs = "serverRequests().filter((r) => r.path === '/articles')";

export const PART2 = [
  /* ═══════════════ LESSON 81 · 13.9 – 13.10 ═══════════════ */
  {
    id: "md-l81-timeouts-retries",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 5,
    covers: ["13.9", "13.10"],
    title: "Timeouts, Network Errors and Retries",
    subtitle: "Giving up at the right moment, and trying again the right way",
    estimatedMinutes: 55,
    intro: "Mobile networks are slow, patchy and sometimes gone. Users forgive a slow network; they don't forgive an app that hangs forever or hammers the server.",
    atoms: [
      {
        id: "a-md-timeouts",
        title: "Loading, timeout, and network error handling",
        explain:
          "fetch has NO timeout of its own: on a bad connection a request can hang for a minute or more while a spinner turns. Add one: an AbortController aborted by a setTimeout, cleared in finally when the request ends. Then tell three failures apart, because each needs different words: a TIMEOUT (\"The server took too long to respond\"), NO NETWORK (fetch rejects with a TypeError, \"Network request failed\": \"You're offline\"), and a SERVER ERROR (a response with status 5xx, which fetch resolves normally: show the server's message or a general apology). Choose timeouts per request: quick reads 10–15 seconds, uploads much longer. Always offer a way to try again, and keep showing any data you already have.",
        webLab: expoLab({
          name: "Kobo",
          layout: titled("Network"),
          task:
            "In src/http/fetchWithTimeout.ts: fetchWithTimeout aborts the request after timeoutMs and then throws an Error named \"TimeoutError\" (message \"The server took too long to respond\"), clears its timer when the request ends, and passes other errors on; friendlyError turns a TimeoutError into \"The server took too long to respond. Try again.\", a network TypeError into \"You're offline. Check your connection and try again.\", and anything else into its message.",
          files: { "src/http/fetchWithTimeout.ts": TIMEOUT_START, "src/app/index.tsx": TIMEOUT_SCREEN, "server/index.js": TIMEOUT_SERVER },
          readOnly: ["src/app/index.tsx", "server/index.js"],
          solution: { "src/http/fetchWithTimeout.ts": TIMEOUT_MODEL },
          tests: [
            { label: "A fast request still works", check: "await press('Load fast'); await waitFor(() => has('Loaded'), 2000); return true;", fail: "Pass the signal and return fetch's response." },
            { label: "A slow request gives up after its timeout", check: "const { fetchWithTimeout } = load('src/http/fetchWithTimeout.ts'); const t0 = Date.now(); try { await fetchWithTimeout('https://api.example.com/slow', { timeoutMs: 400 }); return false; } catch (e) { const took = Date.now() - t0; return e.name === 'TimeoutError' && e.message === 'The server took too long to respond' && took < 1500; }", fail: "setTimeout(() => controller.abort(), timeoutMs), then throw a TimeoutError." },
            { label: "Each failure gets its own words", check: "await press('Load slow'); await waitFor(() => has('The server took too long to respond. Try again.'), 3000); await press('Load broken'); await waitFor(() => has('Something broke on our side'), 2000); await setOnline(false); await press('Load fast'); await waitFor(() => has(\"You're offline. Check your connection and try again.\"), 2000); await setOnline(true); return true;", fail: "friendlyError: TimeoutError, then TypeError, then the message." },
            { label: "The timer is always cleared", check: "return /finally[\\s\\S]*clearTimeout/.test(code('src/http/fetchWithTimeout.ts'));", fail: "finally { clearTimeout(timer); }" },
          ],
          hint: "Remember whether YOUR timer fired, so you can tell a timeout from other aborts.",
          successMessage: "No more endless spinners, and a clear message for every kind of failure.",
        }),
      },
      {
        id: "a-md-retry",
        title: "Retry strategies and rate limits",
        explain:
          "Retry only what can succeed next time: network failures, 5xx server errors and 429 Too Many Requests. Never retry other 4xx (a bad request stays bad). Wait between attempts with EXPONENTIAL BACKOFF (0.5 s, 1 s, 2 s…) plus random JITTER, so thousands of phones coming back online don't hit the server at the same instant; cap the delay and the number of attempts. A RATE LIMIT is the server protecting itself: 429 often carries Retry-After (seconds), which you must respect. Retry automatically only IDEMPOTENT requests (GET, PUT, DELETE) or requests with an idempotency key (Module 12's clientId); a retried POST could charge a card twice. TanStack Query retries failed queries three times by default.",
        webLab: expoLab({
          name: "Kobo",
          layout: titled("Retries"),
          task:
            "Write withRetry(send, { retries, baseDelayMs, maxDelayMs }) in src/http/retry.ts: call send(); retry network TypeErrors, 5xx and 429 up to retries more times, but return any other response at once; wait baseDelayMs × 2^attempt with up to 30% jitter (capped at maxDelayMs), or Retry-After seconds when the server sends it; return the last response (or throw the last network error).",
          files: {
            "src/http/retry.ts": RETRY_START,
            "src/app/index.tsx": `import { Text } from "react-native";\n\nexport default function Home() {\n  return <Text style={{ padding: 20 }}>withRetry is tested directly: see the checks.</Text>;\n}\n`,
            "server/index.js": RETRY_SERVER,
          },
          readOnly: ["src/app/index.tsx", "server/index.js"],
          solution: { "src/http/retry.ts": RETRY_MODEL },
          tests: [
            { label: "A blip is retried until it works", check: "const { withRetry } = load('src/http/retry.ts'); const r = await withRetry(() => fetch('https://api.example.com/flaky'), { baseDelayMs: 50 }); return r.status === 200 && serverRequests().filter((x) => x.path === '/flaky').length === 3;", fail: "Retry while the status is 5xx." },
            { label: "A 400 is not retried", check: "const { withRetry } = load('src/http/retry.ts'); const r = await withRetry(() => fetch('https://api.example.com/bad'), { baseDelayMs: 50 }); return r.status === 400 && serverRequests().filter((x) => x.path === '/bad').length === 1;", fail: "Return other 4xx responses immediately." },
            { label: "Retry-After is respected", check: "const { withRetry } = load('src/http/retry.ts'); const t0 = Date.now(); const r = await withRetry(() => fetch('https://api.example.com/limited'), { baseDelayMs: 50 }); return r.status === 200 && Date.now() - t0 >= 950;", fail: "Wait Retry-After × 1000 ms after a 429." },
            { label: "It gives up, waiting longer each time", check: "const { withRetry } = load('src/http/retry.ts'); const times = []; const r = await withRetry(() => { times.push(Date.now()); return fetch('https://api.example.com/down'); }, { retries: 3, baseDelayMs: 100 }); const gaps = times.slice(1).map((t, i) => t - times[i]); return r.status === 503 && times.length === 4 && gaps[1] > gaps[0] && gaps[2] > gaps[1];", fail: "baseDelayMs * 2 ** attempt, and stop after retries." },
            { label: "Network failures are retried, then thrown", check: "const { withRetry } = load('src/http/retry.ts'); await setOnline(false); let n = 0; try { await withRetry(() => { n++; return fetch('https://api.example.com/flaky'); }, { retries: 2, baseDelayMs: 30 }); await setOnline(true); return false; } catch (e) { await setOnline(true); return e instanceof TypeError && n === 3; }", fail: "Catch TypeError, retry, and rethrow after the last attempt." },
          ],
          hint: "A for loop over attempts, with a sleep before each retry.",
          successMessage: "Retries that help instead of hurting: backoff, jitter, limits and Retry-After.",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════ LESSON 82 · 13.11 – 13.12 ═══════════════ */
  {
    id: "md-l82-uploads-testing",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 6,
    covers: ["13.11", "13.12"],
    title: "Uploading Files, and Testing APIs",
    subtitle: "Sending photos and documents, and checking an API before you trust it",
    estimatedMinutes: 55,
    intro: "Profile photos, receipts and reports all travel as uploads. And every API your app relies on deserves its own tests.",
    atoms: [
      {
        id: "a-md-uploads",
        title: "Uploading images and documents",
        explain:
          "Files are sent as multipart/form-data. Pick them with expo-image-picker (launchImageLibraryAsync({ mediaTypes: [\"images\"], quality: 0.7 }): the system photo picker, which needs no permission) or expo-document-picker (getDocumentAsync({ type: \"application/pdf\" })); both return { canceled, assets }, so handle cancelling. Build a FormData and append React Native's file object, { uri, name, type }, then POST it. DON'T set the Content-Type header yourself: fetch adds multipart/form-data with the boundary the server needs. Check on the server too: allowed types (415) and size (413). Big photos are slow and costly on mobile data: lower the quality or resize first (Module 16), and show progress or at least a spinner. For very large files, upload directly to cloud storage with a signed URL (Module 14).",
        webLab: expoLab({
          name: "Kobo",
          layout: titled("Profile"),
          task:
            "Write src/services/uploads.ts: pickAndUploadPhoto() opens the photo library (images only, quality 0.7) and uploads the chosen photo as the \"photo\" field; pickAndUploadReceipt() opens the document picker for PDFs and uploads it as \"receipt\". Both POST multipart/form-data to https://api.example.com/uploads without setting Content-Type, throw the server's message on failure, and return null when the user cancels.",
          files: { "src/services/uploads.ts": UPLOAD_START, "src/app/index.tsx": UPLOAD_SCREEN, "server/index.js": UPLOAD_SERVER },
          readOnly: ["src/app/index.tsx", "server/index.js"],
          solution: { "src/services/uploads.ts": UPLOAD_MODEL },
          tests: [
            { label: "A chosen photo is uploaded and shown", check: "await press('Change photo'); await pickPhoto(1); await waitFor(() => exists({ testID: 'avatar' }), 3000); const r = serverRequests().find((x) => x.path === '/uploads'); const f = r.body.files[0]; return f.field === 'photo' && f.type === 'image/jpeg' && f.name === 'IMG_4101.JPG';", fail: "form.append(\"photo\", { uri, name: fileName, type: mimeType })" },
            { label: "A PDF receipt is uploaded", check: "await press('Attach receipt'); await pickDocument('receipt-march.pdf'); await waitFor(() => has('receipt-march.pdf uploaded'), 3000); const f = serverRequests().filter((x) => x.path === '/uploads').pop().body.files[0]; return f.field === 'receipt' && f.type === 'application/pdf';", fail: "DocumentPicker.getDocumentAsync({ type: \"application/pdf\" }), then upload as \"receipt\"." },
            { label: "Cancelling uploads nothing and shows no error", check: "const before = serverRequests().length; await press('Change photo'); await cancel(); await wait(300); return serverRequests().length === before && (find({ testID: 'status' })?.textContent ?? '') === '';", fail: "if (result.canceled) return null;" },
            { label: "Content-Type is left to fetch", check: "const c = code('src/services/uploads.ts'); return c.includes('FormData') && !/multipart\\/form-data['\"]\\s*[,}]/.test(c) && !/Content-Type/i.test(c);", fail: "Don't set the Content-Type header for FormData." },
          ],
          hint: "photo.fileName and photo.mimeType may be null: give them defaults.",
          successMessage: "Photos and documents leave the phone as proper multipart uploads.",
        }),
      },
      {
        id: "a-md-api-testing",
        title: "Testing APIs with Postman or an equivalent tool",
        explain:
          "Before an app depends on an endpoint, test the endpoint by itself. API clients such as Postman, Insomnia and Bruno (open source; its collections are plain files you commit to Git) send any request you like, show the status, headers and body, keep COLLECTIONS of requests with ENVIRONMENTS (a {{baseUrl}} for local, staging and production), and can run assertions. From a terminal, curl -i https://api.example.com/products does the same. Turn what you check by hand into AUTOMATED tests that run after every change: here, Jest tests that call the API and assert the status codes, the shape of the JSON, validation errors and authorization. A good API test suite checks the unhappy paths (400, 401, 404) as carefully as the happy one.",
        webLab: expoLab({
          name: "Kobo",
          layout: titled("API"),
          task:
            "In __tests__/api.test.ts, add Jest tests for the four behaviours listed in the file. The checks then break the server in different ways, and your tests must notice each one.",
          files: {
            "__tests__/api.test.ts": API_TEST_START,
            "src/app/index.tsx": `import { Text } from "react-native";\n\nexport default function Home() {\n  return <Text style={{ padding: 20 }}>Run the tests in __tests__/api.test.ts.</Text>;\n}\n`,
            "server/index.js": SHOP_API(),
          },
          readOnly: ["src/app/index.tsx", "server/index.js"],
          solution: { "__tests__/api.test.ts": API_TEST_MODEL },
          tests: [
            { label: "Your tests pass against the real API", check: "const r = await tests(); return !!r && r.total >= 5 && r.failed === 0;", fail: "At least five passing tests." },
            { label: "They notice prices sent as strings", swap: { "server/index.js": SHOP_API("wrong-shape") }, check: "const r = await tests(); return !!r && r.failed > 0;", fail: "Check typeof price === \"number\" for every product." },
            { label: "They notice missing validation", swap: { "server/index.js": SHOP_API("no-validation") }, check: "const r = await tests(); return !!r && r.failed > 0;", fail: "Expect 400 when the price is missing." },
            { label: "They notice a missing authorization check", swap: { "server/index.js": SHOP_API("no-auth") }, check: "const r = await tests(); return !!r && r.failed > 0;", fail: "Expect 401 for DELETE without the token." },
          ],
          hint: "expect(response.status).toBe(401) after fetch(BASE + \"/products/1\", { method: \"DELETE\" })",
          successMessage: "An API test suite that catches broken behaviour before your users do.",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════ LESSON 83 · 13.P ═══════════════ */
  {
    id: "md-l83-m13-project",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 7,
    covers: ["13.P"],
    title: "Practical: A News Reader",
    subtitle: "Search, infinite scrolling, retries and offline handling",
    estimatedMinutes: 120,
    intro: "Everything from this module in one app that behaves well on a real mobile network.",
    atoms: [
      {
        id: "a-md-m13-project",
        title: "Build the news reader",
        explain:
          "The news API is given (server/index.js): GET /articles?q=&cursor= returns { items, nextCursor } ten at a time, and GET /articles/{id} one article. It is a little unreliable at first. Write the service, the list and the article screen.",
        webLab: expoLab({
          name: "Kobo News",
          layout: null,
          task:
            "Build: src/services/news.ts with getArticles({ q, cursor, signal }) and getArticle(id), retrying 5xx/429 answers (at most 2 more times, with growing delays) and throwing the server's message otherwise. A root Stack (QueryClientProvider) with index (\"News\") and article/[id]. index: a \"Search the news\" input; articles from useInfiniteQuery as links to /article/<id> (testID \"article\"), loading the next page near the end (only when there is one and none is loading); No articles match \"<q>\" when empty; a \"You're offline\" banner (accessibilityRole \"alert\") when the phone is offline; and when nothing could be loaded, the error (offline: \"Connect to the internet to load the news.\") with a \"Retry\" button. article/[id] shows the title (also as the header title) and body.",
          files: {
            "src/app/_layout.tsx": "// The root layout.\n",
            "src/app/index.tsx": "// The news list.\n",
            "src/app/article/[id].tsx": "// One article.\n",
            "src/services/news.ts": "",
            "server/index.js": NEWS_SERVER,
          },
          readOnly: ["server/index.js"],
          revealSolution: false,
          solution: P_MODEL,
          tests: [
            { label: "The first page loads, despite the server's first failure", check: "await waitFor(() => findAll({ testID: 'article' }).length === 10, 5000); return " + articleReqs + ".length === 2;", fail: "Retry the 503, so the first request succeeds on the second try." },
            { label: "Scrolling loads more, without duplicates", check: "await waitFor(() => findAll({ testID: 'article' }).length === 10, 5000); for (let i = 0; i < 6; i++) { await scrollDown(4000); await wait(300); } await waitFor(() => findAll({ testID: 'article' }).length === 30, 5000); const urls = fetchCalls().filter((c) => c.url.includes('/articles?')).map((c) => c.url); return new Set(urls.slice(1)).size === urls.length - 1;", fail: "useInfiniteQuery with getNextPageParam, and a guarded onEndReached." },
            { label: "Search starts again from the first page", check: "await restart(); await waitFor(() => findAll({ testID: 'article' }).length === 10, 5000); await typeInto('Search the news', 'football'); await waitFor(() => findAll({ testID: 'article' }).length === 6, 5000); return findAll({ testID: 'article' }).every((e) => e.textContent.startsWith('Football'));", fail: "The query text belongs in the queryKey and the q parameter." },
            { label: "An article opens with its title and body", check: "await restart(); await waitFor(() => findAll({ testID: 'article' }).length === 10, 5000); await press('Naira rate: story 2'); await waitFor(() => screenTitle() === 'Naira rate: story 2', 3000); return has('The full story number 2.');", fail: "GET /articles/{id}, and <Stack.Screen options={{ title }} />." },
            { label: "Offline: a banner, the loaded news stays, and Retry recovers", check: "await restart(); await waitFor(() => findAll({ testID: 'article' }).length === 10, 5000); await setOnline(false); await waitFor(() => exists({ role: 'alert' }), 2000); const kept = findAll({ testID: 'article' }).length === 10; await restart(); await waitFor(() => has('Connect to the internet to load the news.'), 5000); await setOnline(true); await press('Retry'); await waitFor(() => findAll({ testID: 'article' }).length === 10, 5000); return kept && has(\"You're offline\") === false;", fail: "useNetInfo for the banner; the error state with Retry → refetch()." },
          ],
          hint: "Turn off the query client's own retries (retry: false) so only your service retries.",
          successMessage: "A news reader that copes with slow servers, long lists and no signal at all.",
        }),
      },
    ],
    task: {
      title: "Module 13 practical: networking in your own app",
      intro: "Apply this module to the app you are building.",
      prompts: [
        "Write down every endpoint your app calls, with its method, parameters, success response and error responses.",
        "Put all requests through one client with a base URL, the Authorization header, timeouts and typed errors.",
        "Make every list paginate and every search cancellable, and add retries with backoff where they are safe.",
        "Create a Bruno or Postman collection (or Jest API tests) for your API, with tests for the error cases.",
        "Mastery checkpoint: use your app on a slow connection and in airplane mode (Android's developer options and iOS's Network Link Conditioner can simulate bad networks): it never hangs, never shows a raw error, and recovers when the signal returns.",
      ],
      closing: "Next: Module 14, backend and database integration.",
    },
    requirements: { read: true, video: false, assessment: true },
  },
];
