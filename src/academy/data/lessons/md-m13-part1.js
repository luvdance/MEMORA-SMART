/**
 * MOBILE APP DEVELOPMENT · MODULE 13 · REST APIS AND NETWORKING (part 1)
 *
 * Curriculum 13.1 – 13.8: APIs and endpoints, HTTP methods, status codes
 * and headers, JSON, fetch and HTTP clients, cancellation, authentication
 * headers, and pagination and search parameters.
 *
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 */

import { expoLab } from "./md-helpers.js";

export const SECTION_ID = "md-s13-networking";
export const MODULE = "md-m13-networking";

export const titled = (title) => `import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "${title}" }} />
    </Stack>
  );
}
`;

export const MONEY = `export const naira = (amount: number) => "₦" + amount.toLocaleString("en-NG");
`;

/* ── 13.1 · Endpoints ────────────────────────────────────────────────── */
const API_DOCS = `# Kobo API, version 1

Base URL: https://api.example.com/v1
All responses are JSON. Errors look like { "message": "…" }.

## Categories

GET /categories
  200 → [{ "id": "phones", "name": "Phones" }, …]

GET /categories/{categoryId}/products
  200 → [{ "id": "p1", "name": "Redmi Note 14", "price": 185000 }, …]
  404 → { "message": "Category not found" }

## Products

GET /products/{productId}
  200 → { "id": "p1", "name": "Redmi Note 14", "price": 185000, "categoryId": "phones" }
  404 → { "message": "Product not found" }

Path values (such as a category id) must be URL-encoded.
`;
const CATALOG_SERVER = `import { createServer } from "practice-server";

const app = createServer();
const categories = [
  { id: "phones", name: "Phones" },
  { id: "home & garden", name: "Home & garden" },
];
const products = [
  { id: "p1", name: "Redmi Note 14", price: 185000, categoryId: "phones" },
  { id: "p2", name: "Tecno Spark 30", price: 129000, categoryId: "phones" },
  { id: "p3", name: "Woven raffia mat", price: 12000, categoryId: "home & garden" },
];

app.get("/v1/categories", (req, res) => res.json(categories));

app.get("/v1/categories/:id/products", (req, res) => {
  const id = decodeURIComponent(req.params.id);
  if (!categories.some((c) => c.id === id)) return res.status(404).json({ message: "Category not found" });
  res.json(products.filter((p) => p.categoryId === id).map(({ categoryId, ...p }) => p));
});

app.get("/v1/products/:id", (req, res) => {
  const product = products.find((p) => p.id === decodeURIComponent(req.params.id));
  if (!product) return res.status(404).json({ message: "Product not found" });
  res.json(product);
});

export default app;
`;
const CATALOG_START = `// Implement the three endpoints described in docs/API.md.

export type Category = { id: string; name: string };
export type Product = { id: string; name: string; price: number };
`;
const CATALOG_MODEL = `export type Category = { id: string; name: string };
export type Product = { id: string; name: string; price: number };

const BASE_URL = "https://api.example.com/v1";

async function get<T>(path: string): Promise<T> {
  const response = await fetch(BASE_URL + path);
  const data = await response.json();
  if (!response.ok) throw new Error(data.message ?? "Request failed");
  return data as T;
}

export const getCategories = () => get<Category[]>("/categories");

export const getCategoryProducts = (categoryId: string) =>
  get<Product[]>("/categories/" + encodeURIComponent(categoryId) + "/products");

export const getProduct = (productId: string) => get<Product & { categoryId: string }>("/products/" + encodeURIComponent(productId));
`;
const CATALOG_LAYOUT = `import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Categories" }} />
      <Stack.Screen name="category/[id]" options={{ title: "Products" }} />
    </Stack>
  );
}
`;
const CATALOG_HOME = `import { Link } from "expo-router";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { getCategories, type Category } from "@/services/catalog";

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState("");
  useEffect(() => {
    getCategories().then(setCategories, (e: Error) => setError(e.message));
  }, []);
  return (
    <View style={{ padding: 16 }}>
      {error ? <Text>{error}</Text> : null}
      {categories.map((c) => (
        <Link key={c.id} href={{ pathname: "/category/[id]", params: { id: c.id } }} style={{ paddingVertical: 14, fontSize: 16 }}>
          {c.name}
        </Link>
      ))}
    </View>
  );
}
`;
const CATALOG_CATEGORY = `import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { getCategoryProducts, type Product } from "@/services/catalog";
import { naira } from "@/utils/money";

export default function CategoryProducts() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  useEffect(() => {
    getCategoryProducts(id).then(setProducts);
  }, [id]);
  return (
    <View style={{ padding: 16, gap: 8 }}>
      {products.map((p) => (
        <Text key={p.id} testID="product">{p.name} · {naira(p.price)}</Text>
      ))}
    </View>
  );
}
`;

/* ── 13.2 · HTTP methods ─────────────────────────────────────────────── */
const ADDR_SERVER = `import { createServer } from "practice-server";

const app = createServer();
let addresses = [{ id: "1", label: "Home", line: "12 Herbert Macaulay Way, Yaba", isDefault: true }];
let nextId = 2;

const find = (id) => addresses.find((a) => a.id === id);

app.get("/addresses", (req, res) => res.json(addresses));

app.post("/addresses", (req, res) => {
  const { label, line } = req.body || {};
  if (!label || !line) return res.status(400).json({ message: "label and line are required" });
  const address = { id: String(nextId++), label, line, isDefault: false };
  addresses.push(address);
  res.status(201).json(address);
});

// PUT replaces the whole address: every field must be sent.
app.put("/addresses/:id", (req, res) => {
  const address = find(req.params.id);
  if (!address) return res.status(404).json({ message: "Address not found" });
  const { label, line, isDefault } = req.body || {};
  if (!label || !line || typeof isDefault !== "boolean") return res.status(400).json({ message: "PUT needs label, line and isDefault" });
  Object.assign(address, { label, line, isDefault });
  res.json(address);
});

// PATCH changes only the fields sent.
app.patch("/addresses/:id", (req, res) => {
  const address = find(req.params.id);
  if (!address) return res.status(404).json({ message: "Address not found" });
  if (req.body.isDefault === true) addresses.forEach((a) => (a.isDefault = false));
  Object.assign(address, req.body);
  res.json(address);
});

app.delete("/addresses/:id", (req, res) => {
  if (!find(req.params.id)) return res.status(404).json({ message: "Address not found" });
  addresses = addresses.filter((a) => a.id !== req.params.id);
  res.status(204).end();
});

export default app;
`;
const ADDR_API = `/** Sends a request and parses the JSON reply. 204 No Content has no body, so it returns undefined. */
export async function request<T>(path: string, init: { method?: string; body?: unknown } = {}): Promise<T> {
  const response = await fetch("https://api.example.com" + path, {
    method: init.method ?? "GET",
    headers: { Accept: "application/json", "Content-Type": "application/json" },
    body: init.body === undefined ? undefined : JSON.stringify(init.body),
  });
  if (response.status === 204) return undefined as T;
  const data = await response.json();
  if (!response.ok) throw new Error(data.message ?? "Request failed");
  return data as T;
}
`;
const ADDR_START = `import { request } from "@/services/api";

export type Address = { id: string; label: string; line: string; isDefault: boolean };

// Use the right HTTP method for each operation.
export const listAddresses = () => request<Address[]>("/addresses");

export const createAddress = (fields: { label: string; line: string }) => request<Address>("/addresses");

export const replaceAddress = (address: Address) => request<Address>("/addresses/" + address.id);

export const makeDefault = (id: string) => request<Address>("/addresses/" + id);

export const deleteAddress = (id: string) => request<void>("/addresses/" + id);
`;
const ADDR_MODEL = `import { request } from "@/services/api";

export type Address = { id: string; label: string; line: string; isDefault: boolean };

/** GET reads. */
export const listAddresses = () => request<Address[]>("/addresses");

/** POST creates a new resource; the server chooses its id. */
export const createAddress = (fields: { label: string; line: string }) =>
  request<Address>("/addresses", { method: "POST", body: fields });

/** PUT replaces the whole resource. */
export const replaceAddress = ({ id, label, line, isDefault }: Address) =>
  request<Address>("/addresses/" + id, { method: "PUT", body: { label, line, isDefault } });

/** PATCH changes only some fields. */
export const makeDefault = (id: string) => request<Address>("/addresses/" + id, { method: "PATCH", body: { isDefault: true } });

/** DELETE removes it; the reply is 204 No Content. */
export const deleteAddress = (id: string) => request<void>("/addresses/" + id, { method: "DELETE" });
`;
const ADDR_SCREEN = `import { useCallback, useEffect, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { createAddress, deleteAddress, listAddresses, makeDefault, replaceAddress, type Address } from "@/services/addresses";

export default function Addresses() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [error, setError] = useState("");
  const refresh = useCallback(() => {
    listAddresses().then(setAddresses, (e: Error) => setError(e.message));
  }, []);
  useEffect(refresh, [refresh]);

  const run = (action: () => Promise<unknown>) => () => {
    setError("");
    action().then(refresh, (e: Error) => setError(e.message));
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
      {addresses.map((a) => (
        <View key={a.id} testID="address" style={{ gap: 4 }}>
          <Text style={{ fontWeight: "700" }}>{a.label}{a.isDefault ? " (default)" : ""}</Text>
          <Text>{a.line}</Text>
          <View style={{ flexDirection: "row", gap: 16 }}>
            <Pressable accessibilityRole="button" accessibilityLabel={"Make " + a.label + " default"} onPress={run(() => makeDefault(a.id))}><Text>Make default</Text></Pressable>
            <Pressable accessibilityRole="button" accessibilityLabel={"Delete " + a.label} onPress={run(() => deleteAddress(a.id))}><Text>Delete</Text></Pressable>
          </View>
        </View>
      ))}
      <Pressable accessibilityRole="button" onPress={run(() => createAddress({ label: "Office", line: "Plot 5, Adeola Odeku, Victoria Island" }))}><Text>Add office</Text></Pressable>
      <Pressable accessibilityRole="button" onPress={run(() => replaceAddress({ ...addresses[0], line: "14 Herbert Macaulay Way, Yaba" }))}><Text>Correct the first address</Text></Pressable>
      {error ? <Text>{error}</Text> : null}
    </ScrollView>
  );
}
`;

/* ── 13.3 · Status codes and headers ─────────────────────────────────── */
const STATUS_SERVER = `import { createServer } from "practice-server";

const app = createServer();

app.get("/status/:code", (req, res) => {
  const code = Number(req.params.code);
  if (code === 204) return res.status(204).end();
  if (code === 400) return res.status(400).json({ message: "Please check the form", errors: { email: "Enter a valid email" } });
  if (code === 429) return res.status(429).set("Retry-After", "30").json({ message: "Too many requests" });
  if (code >= 400) return res.status(code).json({ message: "Status " + code });
  res.status(code).json({ ok: true, code });
});

export default app;
`;
const STATUS_START = `export type ErrorKind = "validation" | "auth" | "forbidden" | "not-found" | "conflict" | "rate-limited" | "server";

export class ApiError extends Error {
  kind: ErrorKind;
  status: number;
  retryAfter?: number;
  fieldErrors?: Record<string, string>;
  constructor(message: string, kind: ErrorKind, status: number) {
    super(message);
    this.name = "ApiError";
    this.kind = kind;
    this.status = status;
  }
}

export async function request<T>(path: string): Promise<T> {
  const response = await fetch("https://api.example.com" + path);
  return response.json();
}
`;
const STATUS_MODEL = `export type ErrorKind = "validation" | "auth" | "forbidden" | "not-found" | "conflict" | "rate-limited" | "server";

export class ApiError extends Error {
  kind: ErrorKind;
  status: number;
  retryAfter?: number;
  fieldErrors?: Record<string, string>;
  constructor(message: string, kind: ErrorKind, status: number) {
    super(message);
    this.name = "ApiError";
    this.kind = kind;
    this.status = status;
  }
}

function kindOf(status: number): ErrorKind {
  if (status === 400 || status === 422) return "validation";
  if (status === 401) return "auth";
  if (status === 403) return "forbidden";
  if (status === 404) return "not-found";
  if (status === 409) return "conflict";
  if (status === 429) return "rate-limited";
  return "server";
}

export async function request<T>(path: string): Promise<T> {
  const response = await fetch("https://api.example.com" + path);
  // 204 No Content: success with no body to parse.
  if (response.status === 204) return undefined as T;
  const isJson = (response.headers.get("content-type") ?? "").includes("application/json");
  const data = isJson ? await response.json() : null;
  if (response.ok) return data as T;

  const error = new ApiError(data?.message ?? "Request failed (" + response.status + ")", kindOf(response.status), response.status);
  if (data?.errors) error.fieldErrors = data.errors;
  const retryAfter = response.headers.get("retry-after");
  if (retryAfter) error.retryAfter = Number(retryAfter);
  throw error;
}
`;
const STATUS_SCREEN = `import { useState } from "react";
import { Pressable, ScrollView, Text } from "react-native";
import { ApiError, request } from "@/services/api";

const CODES = [200, 201, 204, 400, 401, 403, 404, 409, 429, 500, 503];

export default function Statuses() {
  const [result, setResult] = useState("");
  async function tryCode(code: number) {
    try {
      const data = await request<unknown>("/status/" + code);
      setResult(code + ": ok " + JSON.stringify(data ?? null));
    } catch (e) {
      const err = e as ApiError;
      setResult(code + ": " + err.kind + (err.retryAfter ? " (retry in " + err.retryAfter + " s)" : ""));
    }
  }
  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 6 }}>
      {CODES.map((c) => (
        <Pressable key={c} accessibilityRole="button" onPress={() => tryCode(c)} style={{ minHeight: 40, justifyContent: "center" }}>
          <Text>Try {c}</Text>
        </Pressable>
      ))}
      <Text testID="result">{result}</Text>
    </ScrollView>
  );
}
`;

/* ── 13.4 · JSON ─────────────────────────────────────────────────────── */
const ORDER_SERVER = `import { createServer } from "practice-server";

const app = createServer();

// What this (real-world style) API sends: snake_case names, money as strings, dates as ISO text.
app.get("/orders/501", (req, res) =>
  res.json({
    order_id: 501,
    created_at: "2026-10-03T09:30:00Z",
    status: "shipped",
    total_amount: "18500.00",
    line_items: [
      { product_name: "Ankara tote bag", qty: 2, unit_price: "8500.00" },
      { product_name: "Delivery", qty: 1, unit_price: "1500.00" },
    ],
  })
);

export default app;
`;
const ORDER_START = `import { z } from "zod";

// Describe the API's JSON, and turn it into the app's own shape:
// { id: string; createdAt: Date; status: "pending" | "shipped" | "delivered"; total: number; items: { name: string; qty: number; unitPrice: number }[] }
export const OrderSchema = z.any();

export type Order = z.output<typeof OrderSchema>;

export function parseOrder(json: unknown): Order {
  return OrderSchema.parse(json);
}
`;
const ORDER_MODEL = `import { z } from "zod";

const money = z.string().regex(/^\\d+(\\.\\d{1,2})?$/, "Expected an amount such as \\"18500.00\\"").transform(Number);

const LineItem = z
  .object({ product_name: z.string(), qty: z.number().int().positive(), unit_price: money })
  .transform((l) => ({ name: l.product_name, qty: l.qty, unitPrice: l.unit_price }));

export const OrderSchema = z
  .object({
    order_id: z.number().int(),
    created_at: z.iso.datetime(),
    status: z.enum(["pending", "shipped", "delivered"]),
    total_amount: money,
    line_items: z.array(LineItem),
  })
  .transform((o) => ({
    id: String(o.order_id),
    createdAt: new Date(o.created_at),
    status: o.status,
    total: o.total_amount,
    items: o.line_items,
  }));

export type Order = z.output<typeof OrderSchema>;

/** Checks the server's JSON and converts it; throws if it isn't what the app expects. */
export function parseOrder(json: unknown): Order {
  return OrderSchema.parse(json);
}
`;
const ORDER_SCREEN = `import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { parseOrder, type Order } from "@/services/orders";
import { naira } from "@/utils/money";

export default function OrderScreen() {
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState("");
  useEffect(() => {
    fetch("https://api.example.com/orders/501")
      .then((r) => r.json())
      .then((json) => setOrder(parseOrder(json)))
      .catch(() => setError("This order couldn't be shown."));
  }, []);
  if (error) return <Text style={{ padding: 20 }}>{error}</Text>;
  if (!order) return <Text style={{ padding: 20 }}>Loading…</Text>;
  return (
    <View style={{ padding: 20, gap: 6 }}>
      <Text testID="summary">Order #{order.id} · {order.status} · {naira(order.total)}</Text>
      <Text>Placed {order.createdAt.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" })}</Text>
      {order.items.map((i) => (
        <Text key={i.name}>{i.qty} × {i.name} · {naira(i.unitPrice)}</Text>
      ))}
    </View>
  );
}
`;

/* ── 13.5 · An HTTP client ───────────────────────────────────────────── */
const ECHO_SERVER = `import { createServer } from "practice-server";

const app = createServer();

// Replies with exactly what it received, so you can see your requests.
app.all("/echo", (req, res) => res.json({ method: req.method, url: req.url, query: req.query, body: req.body ?? null, accept: req.headers.accept ?? null }));
app.all("/echo/:rest", (req, res) => res.json({ method: req.method, url: req.url, query: req.query, body: req.body ?? null, accept: req.headers.accept ?? null }));

export default app;
`;
const CLIENT_START = `type Params = Record<string, string | number | boolean | null | undefined>;

/** A small HTTP client: a base URL, JSON in and out, and query parameters from an object. */
export function createClient({ baseUrl }: { baseUrl: string }) {
  return {
    get: async <T>(path: string, options: { params?: Params } = {}): Promise<T> => {
      throw new Error("Not written yet");
    },
    post: async <T>(path: string, body: unknown): Promise<T> => {
      throw new Error("Not written yet");
    },
    patch: async <T>(path: string, body: unknown): Promise<T> => {
      throw new Error("Not written yet");
    },
    delete: async <T>(path: string): Promise<T> => {
      throw new Error("Not written yet");
    },
  };
}
`;
const CLIENT_MODEL = `type Params = Record<string, string | number | boolean | null | undefined>;

/** "?q=ankara+bag&page=2", skipping empty values; "" when there are none. */
function queryString(params: Params = {}) {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== "") search.append(key, String(value));
  }
  const text = search.toString();
  return text ? "?" + text : "";
}

/** A small HTTP client: a base URL, JSON in and out, and query parameters from an object. */
export function createClient({ baseUrl }: { baseUrl: string }) {
  async function send<T>(method: string, path: string, { params, body }: { params?: Params; body?: unknown } = {}): Promise<T> {
    const response = await fetch(baseUrl + path + queryString(params), {
      method,
      headers: { Accept: "application/json", ...(body === undefined ? {} : { "Content-Type": "application/json" }) },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    if (response.status === 204) return undefined as T;
    const data = await response.json();
    if (!response.ok) throw new Error(data?.message ?? data?.error ?? "Request failed (" + response.status + ")");
    return data as T;
  }
  return {
    get: <T>(path: string, options: { params?: Params } = {}) => send<T>("GET", path, options),
    post: <T>(path: string, body: unknown) => send<T>("POST", path, { body }),
    patch: <T>(path: string, body: unknown) => send<T>("PATCH", path, { body }),
    delete: <T>(path: string) => send<T>("DELETE", path),
  };
}
`;

/* ── 13.6 · Cancellation ─────────────────────────────────────────────── */
const SEARCH_SERVER = `import { createServer } from "practice-server";

const app = createServer();
const PRODUCTS = ["Ankara tote bag", "Ankara fabric (6 yards)", "Tank top", "Shea butter", "Thank-you cards"];
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

app.get("/search", async (req, res) => {
  const q = String(req.query.q || "").toLowerCase();
  // Short queries match more and take longer, so their replies can arrive LAST.
  await sleep(q.length < 5 ? 700 : 100);
  res.json(PRODUCTS.filter((p) => p.toLowerCase().includes(q)));
});

export default app;
`;
const SEARCH_HOOK_START = `import { useEffect, useState } from "react";

/** Results for the query, fetched as the user types. */
export function useSearch(query: string) {
  const [results, setResults] = useState<string[]>([]);
  useEffect(() => {
    if (!query.trim()) return setResults([]);
    fetch("https://api.example.com/search?q=" + encodeURIComponent(query.trim()))
      .then((r) => r.json())
      .then(setResults);
  }, [query]);
  return results;
}
`;
const SEARCH_HOOK_MODEL = `import { useEffect, useState } from "react";

/** Results for the query, fetched as the user types. */
export function useSearch(query: string) {
  const [results, setResults] = useState<string[]>([]);
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    const controller = new AbortController();
    fetch("https://api.example.com/search?q=" + encodeURIComponent(query.trim()), { signal: controller.signal })
      .then((r) => r.json())
      .then(setResults)
      .catch((e: Error) => {
        // A cancelled request is not an error: a newer one replaced it.
        if (e.name !== "AbortError") setResults([]);
      });
    // Runs when the query changes again, or the screen closes.
    return () => controller.abort();
  }, [query]);
  return results;
}
`;
const SEARCH_SCREEN = `import { useState } from "react";
import { Text, TextInput, View } from "react-native";
import { useSearch } from "@/hooks/useSearch";

export default function Search() {
  const [query, setQuery] = useState("");
  const results = useSearch(query);
  return (
    <View style={{ padding: 16, gap: 8 }}>
      <TextInput placeholder="Search" value={query} onChangeText={setQuery} autoCorrect={false} style={{ minHeight: 48, borderWidth: 1, borderColor: "#cbd5e1", borderRadius: 10, paddingHorizontal: 12 }} />
      {results.map((r) => (
        <Text key={r} testID="result">{r}</Text>
      ))}
    </View>
  );
}
`;

/* ── 13.7 · Authentication headers ───────────────────────────────────── */
const AUTHH_SERVER = `import { createServer, tokens } from "practice-server";

const app = createServer();
const SECRET = "practice-only-secret";

app.post("/auth/login", (req, res) => {
  res.json({ token: tokens.sign({ sub: "u1", name: "Ada" }, SECRET, { expiresIn: "15m" }) });
});

app.get("/me", (req, res) => {
  const header = req.headers.authorization || "";
  if (!header.startsWith("Bearer ")) return res.status(401).json({ message: "Sign in first" });
  try {
    const payload = tokens.verify(header.slice(7), SECRET);
    res.json({ name: payload.name });
  } catch (e) {
    res.status(401).json({ message: e.message });
  }
});

export default app;
`;
const AUTHH_TOKENS = `import * as SecureStore from "expo-secure-store";

export const saveToken = (t: string) => SecureStore.setItemAsync("session_token", t);
export const getToken = () => SecureStore.getItemAsync("session_token");
export const clearToken = () => SecureStore.deleteItemAsync("session_token");
`;
const AUTHH_START = `import { clearToken, getToken } from "@/auth/tokens";

const BASE_URL = "https://api.example.com";

/** Called when the server says the session is no longer valid (the screen sets this). */
export let onSessionExpired = () => {};
export const setSessionExpiredHandler = (fn: () => void) => {
  onSessionExpired = fn;
};

/** fetch for endpoints that need the signed-in user. */
export async function authFetch(path: string, init: RequestInit = {}): Promise<Response> {
  return fetch(BASE_URL + path, init);
}
`;
const AUTHH_MODEL = `import { clearToken, getToken } from "@/auth/tokens";

const BASE_URL = "https://api.example.com";

/** Called when the server says the session is no longer valid (the screen sets this). */
export let onSessionExpired = () => {};
export const setSessionExpiredHandler = (fn: () => void) => {
  onSessionExpired = fn;
};

/** fetch for endpoints that need the signed-in user. */
export async function authFetch(path: string, init: RequestInit = {}): Promise<Response> {
  const token = await getToken();
  const headers = new Headers(init.headers);
  // The token goes in a header, never in the URL (URLs end up in logs and histories).
  if (token) headers.set("Authorization", "Bearer " + token);
  const response = await fetch(BASE_URL + path, { ...init, headers });
  if (response.status === 401) {
    await clearToken();
    onSessionExpired();
  }
  return response;
}
`;
const AUTHH_SCREEN = `import { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { saveToken } from "@/auth/tokens";
import { authFetch, setSessionExpiredHandler } from "@/services/http";

export default function Account() {
  const [name, setName] = useState<string | null>(null);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    setSessionExpiredHandler(() => {
      setName(null);
      setNotice("Your session has expired. Please sign in again.");
    });
  }, []);

  async function signIn() {
    const { token } = await (await fetch("https://api.example.com/auth/login", { method: "POST" })).json();
    await saveToken(token);
    setNotice("");
    await refresh();
  }

  async function refresh() {
    const response = await authFetch("/me");
    if (response.ok) setName((await response.json()).name);
  }

  return (
    <View style={{ padding: 20, gap: 12 }}>
      {notice ? <Text>{notice}</Text> : null}
      {name ? <Text style={{ fontSize: 20 }}>Hello, {name}</Text> : null}
      {name ? (
        <Pressable accessibilityRole="button" onPress={refresh} style={{ minHeight: 48, justifyContent: "center" }}><Text>Refresh</Text></Pressable>
      ) : (
        <Pressable accessibilityRole="button" onPress={signIn} style={{ minHeight: 48, justifyContent: "center" }}><Text>Sign in</Text></Pressable>
      )}
    </View>
  );
}
`;

/* ── 13.8 · Pagination and search ────────────────────────────────────── */
const ARTICLE_SERVER = `import { createServer } from "practice-server";

const app = createServer();
const TOPICS = ["Lagos traffic", "Naira rate", "Tech in Abuja", "Football", "Farming"];
const ARTICLES = Array.from({ length: 35 }, (_, i) => ({ id: String(i + 1), title: TOPICS[i % 5] + ": story " + (i + 1) }));

// Cursor pagination: ?cursor=<id to start after>&limit=10&q=<search>
app.get("/articles", (req, res) => {
  const q = String(req.query.q || "").toLowerCase();
  const limit = Math.min(Number(req.query.limit) || 10, 20);
  const matching = ARTICLES.filter((a) => a.title.toLowerCase().includes(q));
  const start = req.query.cursor ? matching.findIndex((a) => a.id === req.query.cursor) + 1 : 0;
  const items = matching.slice(start, start + limit);
  const nextCursor = start + limit < matching.length ? items[items.length - 1].id : null;
  res.json({ items, nextCursor });
});

export default app;
`;
const ARTICLE_LAYOUT = `import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <Stack>
        <Stack.Screen name="index" options={{ title: "News" }} />
      </Stack>
    </QueryClientProvider>
  );
}
`;
const ARTICLE_SERVICE = `export type Article = { id: string; title: string };
export type Page = { items: Article[]; nextCursor: string | null };

export async function getArticles({ q, cursor }: { q: string; cursor: string | null }): Promise<Page> {
  const params = new URLSearchParams({ limit: "10" });
  if (q) params.set("q", q);
  if (cursor) params.set("cursor", cursor);
  const response = await fetch("https://api.example.com/articles?" + params.toString());
  if (!response.ok) throw new Error("Couldn't load the news");
  return response.json();
}
`;
const ARTICLE_START = `import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { FlatList, Text, TextInput, View } from "react-native";
import { getArticles } from "@/services/articles";

export default function News() {
  const [q, setQ] = useState("");
  const { data } = useQuery({ queryKey: ["articles", q], queryFn: () => getArticles({ q, cursor: null }) });
  const articles = data?.items ?? [];

  return (
    <View style={{ flex: 1 }}>
      <TextInput placeholder="Search the news" value={q} onChangeText={setQ} style={{ margin: 12, minHeight: 48, borderWidth: 1, borderColor: "#cbd5e1", borderRadius: 10, paddingHorizontal: 12 }} />
      <FlatList
        data={articles}
        keyExtractor={(a) => a.id}
        renderItem={({ item }) => <Text testID="article" style={{ paddingHorizontal: 16, paddingVertical: 40, fontSize: 16 }}>{item.title}</Text>}
      />
    </View>
  );
}
`;
const ARTICLE_MODEL = `import { useInfiniteQuery } from "@tanstack/react-query";
import { useState } from "react";
import { ActivityIndicator, FlatList, Text, TextInput, View } from "react-native";
import { getArticles } from "@/services/articles";

export default function News() {
  const [q, setQ] = useState("");
  const query = q.trim();
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ["articles", query],
    queryFn: ({ pageParam }) => getArticles({ q: query, cursor: pageParam }),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });
  const articles = data?.pages.flatMap((p) => p.items) ?? [];

  return (
    <View style={{ flex: 1 }}>
      <TextInput placeholder="Search the news" value={q} onChangeText={setQ} style={{ margin: 12, minHeight: 48, borderWidth: 1, borderColor: "#cbd5e1", borderRadius: 10, paddingHorizontal: 12 }} />
      <FlatList
        data={articles}
        keyExtractor={(a) => a.id}
        renderItem={({ item }) => <Text testID="article" style={{ paddingHorizontal: 16, paddingVertical: 40, fontSize: 16 }}>{item.title}</Text>}
        onEndReached={() => {
          // Only one page at a time, and none after the last.
          if (hasNextPage && !isFetchingNextPage) fetchNextPage();
        }}
        onEndReachedThreshold={0.5}
        ListFooterComponent={isFetchingNextPage ? <ActivityIndicator style={{ margin: 16 }} /> : undefined}
        ListEmptyComponent={data ? <Text style={{ padding: 16 }}>No articles match "{query}"</Text> : undefined}
      />
    </View>
  );
}
`;
const pageReqs = "fetchCalls().filter((c) => c.url.includes('/articles'))";

export const PART1 = [
  /* ═══════════════ LESSON 77 · 13.1 – 13.2 ═══════════════ */
  {
    id: "md-l77-endpoints-methods",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 1,
    covers: ["13.1", "13.2"],
    title: "APIs, Endpoints and HTTP Methods",
    subtitle: "Reading an API's documentation, and asking it for the right thing",
    estimatedMinutes: 50,
    intro: "Almost every real app talks to a server. This module is about doing that well: correctly, quickly, and gracefully when the network lets you down.",
    atoms: [
      {
        id: "a-md-endpoints",
        title: "Understanding APIs and endpoints",
        explain:
          "An API (application programming interface) is the set of requests a server accepts. A REST API is organised around RESOURCES (categories, products, orders), each at an ENDPOINT: a URL path under a BASE URL, often with a version (https://api.example.com/v1). PATH PARAMETERS pick one resource (/products/{productId}); QUERY PARAMETERS filter or shape a list (/products?category=phones&sort=price, Lesson 80). Your guide is the API's documentation (often OpenAPI/Swagger): the endpoints, what each accepts and returns, and its errors. Keep the base URL in one constant (or an EXPO_PUBLIC_ variable), and URL-ENCODE values you put in a path: encodeURIComponent(\"home & garden\") becomes home%20%26%20garden.",
        webLab: expoLab({
          name: "Kobo",
          layout: CATALOG_LAYOUT,
          task:
            "Read docs/API.md and write src/services/catalog.ts: getCategories(), getCategoryProducts(categoryId) and getProduct(productId), each calling its endpoint under the base URL https://api.example.com/v1 (one constant), URL-encoding ids, and throwing an Error with the server's message when the response is not ok.",
          files: {
            "src/services/catalog.ts": CATALOG_START,
            "docs/API.md": API_DOCS,
            "src/app/index.tsx": CATALOG_HOME,
            "src/app/category/[id].tsx": CATALOG_CATEGORY,
            "src/utils/money.ts": MONEY,
            "server/index.js": CATALOG_SERVER,
          },
          readOnly: ["docs/API.md", "src/app/index.tsx", "src/app/category/[id].tsx", "src/utils/money.ts", "server/index.js"],
          solution: { "src/services/catalog.ts": CATALOG_MODEL },
          tests: [
            { label: "The categories load, and Phones lists its products", check: "await waitFor(() => has('Phones'), 3000); await press('Phones'); await waitFor(() => findAll({ testID: 'product' }).length === 2, 3000); return has('Redmi Note 14 · ₦185,000');", fail: "GET /v1/categories and /v1/categories/{id}/products" },
            { label: "Ids in paths are URL-encoded", check: "await restart(); await waitFor(() => has('Home & garden'), 3000); await press('Home & garden'); await waitFor(() => has('Woven raffia mat · ₦12,000'), 3000); return serverRequests().some((r) => r.path === '/v1/categories/home%20%26%20garden/products');", fail: "encodeURIComponent(categoryId)" },
            { label: "getProduct reads one product, and reports a 404 in the server's words", check: "const s = load('src/services/catalog.ts'); const p = await s.getProduct('p2'); try { await s.getProduct('nope'); return false; } catch (e) { return p.name === 'Tecno Spark 30' && e.message === 'Product not found'; }", fail: "GET /v1/products/{productId}; throw new Error(data.message) when !response.ok." },
            { label: "One base URL constant", check: "const c = code('src/services/catalog.ts'); return (c.match(/https:\\/\\/api\\.example\\.com\\/v1/g) || []).length === 1;", fail: "const BASE_URL = \"https://api.example.com/v1\";" },
          ],
          hint: "Write one small get<T>(path) function and use it for all three.",
          successMessage: "You read an API's documentation and called it exactly as it describes.",
        }),
      },
      {
        id: "a-md-http-methods",
        title: "HTTP methods: GET, POST, PUT, PATCH, and DELETE",
        explain:
          "The METHOD says what to do with the resource. GET reads (no body; safe to repeat). POST creates (the server chooses the new id; usually answers 201 Created with the new resource). PUT REPLACES the whole resource with what you send, so send every field. PATCH changes only the fields you send ({ isDefault: true }). DELETE removes it, often answering 204 No Content, which has NO body: calling response.json() on it throws. GET, PUT and DELETE are IDEMPOTENT (repeating them has the same effect as doing them once), which matters for retries (Lesson 81); POST is not, so a retried POST can create duplicates unless the server deduplicates.",
        webLab: expoLab({
          name: "Kobo",
          layout: titled("Addresses"),
          task:
            "Each function in src/services/addresses.ts currently sends a GET. Give each the right method and body: createAddress → POST /addresses with { label, line }; replaceAddress → PUT /addresses/{id} with every field (label, line, isDefault); makeDefault → PATCH /addresses/{id} with only { isDefault: true }; deleteAddress → DELETE /addresses/{id}. request() (given) already handles 204.",
          files: { "src/services/addresses.ts": ADDR_START, "src/services/api.ts": ADDR_API, "src/app/index.tsx": ADDR_SCREEN, "server/index.js": ADDR_SERVER },
          readOnly: ["src/services/api.ts", "src/app/index.tsx", "server/index.js"],
          solution: { "src/services/addresses.ts": ADDR_MODEL },
          tests: [
            { label: "Add office creates an address with POST", check: "await waitFor(() => has('Add office'), 3000); await press('Add office'); await waitFor(() => findAll({ testID: 'address' }).length === 2, 3000); const r = serverRequests().find((x) => x.method === 'POST'); return r.path === '/addresses' && r.body.label === 'Office' && !('isDefault' in r.body);", fail: "request(\"/addresses\", { method: \"POST\", body: fields })" },
            { label: "Make default changes one field with PATCH", check: "await waitFor(() => exists({ role: 'button', name: 'Make Office default' }), 3000); await press({ role: 'button', name: 'Make Office default' }); await waitFor(() => has('Office (default)'), 3000); const r = serverRequests().find((x) => x.method === 'PATCH'); return r.path === '/addresses/2' && JSON.stringify(r.body) === '{\"isDefault\":true}';", fail: "PATCH with { isDefault: true } only." },
            { label: "Correcting an address replaces it with PUT", check: "await press('Correct the first address'); await waitFor(() => has('14 Herbert Macaulay Way, Yaba'), 3000); const r = serverRequests().find((x) => x.method === 'PUT'); return r.path === '/addresses/1' && Object.keys(r.body).sort().join() === 'isDefault,label,line';", fail: "PUT sends label, line and isDefault (not the id: it is in the path)." },
            { label: "Delete removes it with DELETE", check: "await press({ role: 'button', name: 'Delete Office' }); await waitFor(() => findAll({ testID: 'address' }).length === 1, 3000); const r = serverRequests().find((x) => x.method === 'DELETE'); return r.path === '/addresses/2' && !hasText('Request failed');", fail: "request(\"/addresses/\" + id, { method: \"DELETE\" })" },
          ],
          hint: "Each function only needs { method, body } added to its request call.",
          successMessage: "Five operations, five methods, each sending exactly what it should.",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════ LESSON 78 · 13.3 – 13.4 ═══════════════ */
  {
    id: "md-l78-status-json",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 2,
    covers: ["13.3", "13.4"],
    title: "Status Codes, Headers and JSON",
    subtitle: "Understanding what the server answered, and trusting it only after checking",
    estimatedMinutes: 50,
    intro: "Every response has three parts: a status code, headers and a body. A robust app reads all three.",
    atoms: [
      {
        id: "a-md-status-headers",
        title: "Status codes and response headers",
        explain:
          "The STATUS CODE's first digit is its class: 2xx success (200 OK, 201 Created, 204 No Content: no body), 3xx redirects (fetch follows them), 4xx the REQUEST was wrong, 5xx the SERVER failed. The 4xx codes each need different handling: 400/422 invalid input (show the field errors), 401 not signed in or session expired (sign in again), 403 signed in but not allowed, 404 not found, 409 conflict (Module 12), 429 too many requests (wait: the Retry-After HEADER says how many seconds). 5xx: apologise and offer a retry. HEADERS carry facts about the response: content-type (is it really JSON?), retry-after, caching headers (cache-control, etag), and pagination or request ids. Read them with response.headers.get(\"retry-after\") (names are case-insensitive).",
        webLab: expoLab({
          name: "Kobo",
          layout: titled("Status codes"),
          task:
            "Make request() in src/services/api.ts understand the response: 204 returns undefined; other 2xx return the JSON; any other status throws an ApiError with the server's message and a kind (400/422 \"validation\" with fieldErrors from the body's errors, 401 \"auth\", 403 \"forbidden\", 404 \"not-found\", 409 \"conflict\", 429 \"rate-limited\" with retryAfter in seconds from the Retry-After header, anything else \"server\"). Only parse the body as JSON when the content-type says it is JSON.",
          files: { "src/services/api.ts": STATUS_START, "src/app/index.tsx": STATUS_SCREEN, "server/index.js": STATUS_SERVER },
          readOnly: ["src/app/index.tsx", "server/index.js"],
          solution: { "src/services/api.ts": STATUS_MODEL },
          tests: [
            { label: "Successes: 200 and 201 return the JSON, 204 returns nothing", check: "const { request } = load('src/services/api.ts'); const a = await request('/status/200'); const b = await request('/status/201'); const c = await request('/status/204'); return a.code === 200 && b.code === 201 && c === undefined;", fail: "if (response.status === 204) return undefined;" },
            { label: "Each failure gets the right kind", check: "const { request } = load('src/services/api.ts'); const kinds = {}; for (const code of [401, 403, 404, 409, 500, 503]) { try { await request('/status/' + code); } catch (e) { kinds[code] = e.name === 'ApiError' && e.status === code ? e.kind : 'wrong'; } } return JSON.stringify(kinds) === JSON.stringify({ 401: 'auth', 403: 'forbidden', 404: 'not-found', 409: 'conflict', 500: 'server', 503: 'server' });", fail: "Map each status to its kind." },
            { label: "400 carries the field errors", check: "try { await load('src/services/api.ts').request('/status/400'); return false; } catch (e) { return e.kind === 'validation' && e.message === 'Please check the form' && e.fieldErrors.email === 'Enter a valid email'; }", fail: "error.fieldErrors = data.errors" },
            { label: "429 reads the Retry-After header", check: "await press('Try 429'); await wait(300); return find({ testID: 'result' }).textContent === '429: rate-limited (retry in 30 s)';", fail: "Number(response.headers.get(\"retry-after\"))" },
          ],
          hint: "response.ok is true for 200–299.",
          successMessage: "Every answer the server can give now means something specific to the app.",
        }),
      },
      {
        id: "a-md-json-api",
        title: "JSON requests and responses",
        explain:
          "JSON carries only strings, numbers, booleans, null, arrays and objects. So dates travel as ISO text (\"2026-10-03T09:30:00Z\") to be turned into Date objects, money is often sent as a string (\"18500.00\") to avoid floating-point surprises, and many APIs use snake_case names that you may convert to your app's camelCase. Send JSON with JSON.stringify(body) and the header Content-Type: application/json. Above all, NEVER TRUST RESPONSES BLINDLY: response.json() gives you any, and a server change can silently break screens. Validate and convert at the edge with a schema (Zod's parse throws a clear error naming the bad field), so the rest of the app works with typed, checked data.",
        webLab: expoLab({
          name: "Kobo",
          layout: titled("Order"),
          task:
            "Write OrderSchema in src/services/orders.ts with Zod: check the API's JSON (order_id an integer, created_at an ISO date-time, status one of pending, shipped or delivered, total_amount and each unit_price an amount string, line_items with product_name, a positive whole qty and unit_price) and transform it into the app's shape: { id: string, createdAt: Date, status, total: number, items: [{ name, qty, unitPrice: number }] }.",
          files: { "src/services/orders.ts": ORDER_START, "src/app/index.tsx": ORDER_SCREEN, "src/utils/money.ts": MONEY, "server/index.js": ORDER_SERVER },
          readOnly: ["src/app/index.tsx", "src/utils/money.ts", "server/index.js"],
          solution: { "src/services/orders.ts": ORDER_MODEL },
          tests: [
            { label: "The order shows, converted", check: "await waitFor(() => hasText('Order #501'), 3000); return find({ testID: 'summary' }).textContent === 'Order #501 · shipped · ₦18,500' && has('2 × Ankara tote bag · ₦8,500') && has('Placed 3 Oct 2026');", fail: "Transform to { id, createdAt, status, total, items }." },
            { label: "Types are converted", check: "const o = load('src/services/orders.ts').parseOrder({ order_id: 7, created_at: '2026-01-02T03:04:05Z', status: 'pending', total_amount: '99.50', line_items: [{ product_name: 'Pen', qty: 1, unit_price: '99.50' }] }); return o.id === '7' && o.createdAt instanceof Date && o.total === 99.5 && o.items[0].unitPrice === 99.5 && o.items[0].name === 'Pen';", fail: "String(order_id), new Date(created_at), Number(amounts)." },
            { label: "Unexpected data is rejected", check: "const { parseOrder } = load('src/services/orders.ts'); const good = { order_id: 7, created_at: '2026-01-02T03:04:05Z', status: 'pending', total_amount: '99.50', line_items: [] }; const bad = [{ ...good, status: 'lost' }, { ...good, total_amount: 'free' }, { ...good, created_at: 'yesterday' }, { ...good, line_items: [{ product_name: 'Pen', qty: 0, unit_price: '1.00' }] }]; return bad.every((b) => { try { parseOrder(b); return false; } catch { return true; } });", fail: "z.enum, an amount regex, z.iso.datetime(), z.number().int().positive()." },
          ],
          hint: "z.object({ … }).transform((o) => ({ … })), with the line items transformed the same way.",
          successMessage: "Checked at the edge: the rest of the app can trust its data.",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════ LESSON 79 · 13.5 – 13.6 ═══════════════ */
  {
    id: "md-l79-client-cancel",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 3,
    covers: ["13.5", "13.6"],
    title: "HTTP Clients and Cancelling Requests",
    subtitle: "A reusable client, and requests that stop when nobody needs them",
    estimatedMinutes: 50,
    intro: "fetch is all React Native needs; a thin client around it removes repetition. And a request nobody is waiting for should be cancelled.",
    atoms: [
      {
        id: "a-md-http-client",
        title: "Using fetch or an HTTP client",
        explain:
          "React Native has fetch built in, which is enough for most apps. HTTP CLIENT libraries such as axios or ky add conveniences: a base URL, JSON by default, query parameters from an object, interceptors (adding a token to every request), timeouts and errors for non-2xx responses. You can get the same in a few lines by wrapping fetch, with nothing extra to install, and that is what this lab does. Query parameters must be ENCODED: URLSearchParams does it (a space becomes +, & becomes %26) and you should leave out empty values rather than sending ?category=undefined. Whichever you choose, use ONE client for the whole app.",
        webLab: expoLab({
          name: "Kobo",
          layout: titled("Client"),
          task:
            "Write createClient({ baseUrl }) in src/http/client.ts, returning get(path, { params }), post(path, body), patch(path, body) and delete(path). Every request sends Accept: application/json; bodies are sent as JSON (with Content-Type: application/json); params become an encoded query string that leaves out undefined, null and empty values; 204 returns undefined; a non-2xx status throws an Error with the server's message (its message or error field). The /echo endpoint replies with what it received.",
          files: {
            "src/http/client.ts": CLIENT_START,
            "src/app/index.tsx": `import { Text } from "react-native";\n\nexport default function Home() {\n  return <Text style={{ padding: 20 }}>The client is tested directly: see the checks.</Text>;\n}\n`,
            "server/index.js": ECHO_SERVER,
          },
          readOnly: ["src/app/index.tsx", "server/index.js"],
          solution: { "src/http/client.ts": CLIENT_MODEL },
          tests: [
            { label: "get adds encoded query parameters, skipping empty ones", check: "const api = load('src/http/client.ts').createClient({ baseUrl: 'https://api.example.com' }); const r = await api.get('/echo', { params: { q: 'ankara bag & co', page: 2, category: undefined, sort: null, brand: '' } }); return r.method === 'GET' && r.query.q === 'ankara bag & co' && r.query.page === '2' && !('category' in r.query) && !('sort' in r.query) && !('brand' in r.query) && r.accept === 'application/json';", fail: "URLSearchParams, appending only non-empty values." },
            { label: "post and patch send JSON bodies", check: "const api = load('src/http/client.ts').createClient({ baseUrl: 'https://api.example.com' }); const a = await api.post('/echo', { title: 'Hi' }); const b = await api.patch('/echo/7', { done: true }); const posted = fetchCalls().find((c) => c.method === 'POST'); return a.method === 'POST' && a.body.title === 'Hi' && b.method === 'PATCH' && b.body.done === true && /json/.test(posted.headers['content-type'] || '');", fail: "JSON.stringify(body) with Content-Type: application/json." },
            { label: "Errors carry the server's message", check: "const api = load('src/http/client.ts').createClient({ baseUrl: 'https://api.example.com' }); try { await api.get('/missing'); return false; } catch (e) { return e.message === 'Cannot GET /missing'; }", fail: "throw new Error(data.message ?? data.error ?? …): this server's 404 is { error: \"Cannot GET /missing\" }." },
          ],
          hint: "One send(method, path, { params, body }) function, used by all four.",
          successMessage: "One client for the whole app: base URL, JSON, query strings and errors, written once.",
        }),
      },
      {
        id: "a-md-cancellation",
        title: "Async operations and request cancellation",
        explain:
          "Requests take time, and the user moves on: they type another letter, or leave the screen. Without cancellation, the replies arrive in ANY ORDER, so an older, slower reply can overwrite a newer one (search results for \"ank\" replacing those for \"ankara\"), and replies for closed screens still update state. Pass an AbortController's signal to fetch, and in the effect's clean-up call controller.abort(): React runs it before the next effect and when the component unmounts. The aborted fetch rejects with an error named AbortError, which is not a failure, so ignore it. (TanStack Query cancels outdated queries for you when you pass its signal to fetch.) Pair this with debouncing (waiting until typing pauses) to send fewer requests in the first place.",
        webLab: expoLab({
          name: "Kobo",
          layout: titled("Search"),
          task:
            "Typing \"ank\" then \"ankara\" quickly can end with the results for \"ank\", because its reply arrives last. Fix useSearch: give each request an AbortController's signal, abort it in the effect's clean-up, and ignore AbortError.",
          files: { "src/hooks/useSearch.ts": SEARCH_HOOK_START, "src/app/index.tsx": SEARCH_SCREEN, "server/index.js": SEARCH_SERVER },
          readOnly: ["src/app/index.tsx", "server/index.js"],
          solution: { "src/hooks/useSearch.ts": SEARCH_HOOK_MODEL },
          tests: [
            { label: "The results always match the latest query", check: "await typeInto('Search', 'ank'); await typeInto('Search', 'ankara'); await wait(1000); const shown = findAll({ testID: 'result' }).map((e) => e.textContent); return shown.join() === 'Ankara tote bag,Ankara fabric (6 yards)';", fail: "Abort the previous request in the clean-up: return () => controller.abort();" },
            { label: "Cancelled requests are not shown as errors", check: "await restart(); await waitFor(() => exists({ placeholder: 'Search' }), 2000); await typeInto('Search', 'tha'); await typeInto('Search', 'thank'); await wait(1000); return has('Thank-you cards') && !logs().some((l) => /AbortError|Aborted/.test(l));", fail: "if (e.name !== \"AbortError\") …" },
            { label: "Each request gets a signal", check: "const c = code('src/hooks/useSearch.ts'); return c.includes('new AbortController()') && c.includes('signal') && c.includes('.abort()');", fail: "fetch(url, { signal: controller.signal })" },
          ],
          hint: "Create the controller inside the effect, so each query has its own.",
          successMessage: "Old replies can no longer overwrite new ones.",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════ LESSON 80 · 13.7 – 13.8 ═══════════════ */
  {
    id: "md-l80-auth-pagination",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 4,
    covers: ["13.7", "13.8"],
    title: "Authentication Headers, Pagination and Search",
    subtitle: "Proving who is asking, and loading long lists a page at a time",
    estimatedMinutes: 55,
    intro: "Private endpoints need to know who is asking; long lists need to arrive in pages, as the user scrolls.",
    atoms: [
      {
        id: "a-md-auth-headers",
        title: "Authentication headers",
        explain:
          "After sign-in, the server gives the app a TOKEN (often a JWT). Every request to a private endpoint sends it in the Authorization header: Authorization: Bearer <token>. Put this in ONE function (authFetch, or your client's interceptor) that reads the token from SecureStore. Never put tokens in URLs (?token=…): URLs are written to server logs, proxies and analytics. When a private endpoint answers 401, the token is missing, wrong or EXPIRED: clear it and send the user to sign in with a clear message (Module 15 adds refresh tokens, so this happens rarely). Use HTTPS only: Android blocks plain http:// by default in release builds, and iOS's App Transport Security does too.",
        webLab: expoLab({
          name: "Kobo",
          layout: titled("Account"),
          task:
            "Write authFetch in src/services/http.ts: read the token with getToken(), send it as Authorization: Bearer <token> (keeping any headers the caller passed), and when the response is 401, clearToken() and call onSessionExpired(). The token lasts 15 minutes.",
          files: { "src/services/http.ts": AUTHH_START, "src/auth/tokens.ts": AUTHH_TOKENS, "src/app/index.tsx": AUTHH_SCREEN, "server/index.js": AUTHH_SERVER },
          readOnly: ["src/auth/tokens.ts", "src/app/index.tsx", "server/index.js"],
          solution: { "src/services/http.ts": AUTHH_MODEL },
          tests: [
            { label: "Private requests carry the token in the Authorization header", check: "await press('Sign in'); await waitFor(() => has('Hello, Ada'), 3000); const r = serverRequests().filter((x) => x.path === '/me').pop(); return r.headers.authorization === 'Bearer ' + secureStore().session_token;", fail: "headers.set(\"Authorization\", \"Bearer \" + token)" },
            { label: "Tokens never go in URLs", check: "return !fetchCalls().some((c) => /token=|eyJ/.test(c.url));", fail: "Headers only." },
            { label: "An expired session signs the user out with a message", check: "await advance(16 * 60); await press('Refresh'); await waitFor(() => has('Your session has expired. Please sign in again.'), 3000); return !('session_token' in secureStore()) && has('Sign in');", fail: "On 401: await clearToken(); onSessionExpired();" },
          ],
          hint: "new Headers(init.headers) copies the caller's headers so you can add one.",
          successMessage: "One place adds the token to every private request, and handles the session ending.",
        }),
      },
      {
        id: "a-md-pagination",
        title: "Pagination and search parameters",
        explain:
          "Never download a whole collection: ask for a PAGE. Offset pagination (?page=3&limit=20) is simple but skips or repeats items when the list changes; CURSOR pagination (?cursor=<last id>&limit=20, the server replying { items, nextCursor }) is stable, and is what feeds and timelines use. On a phone the next page loads as the user nears the end: FlatList's onEndReached (with onEndReachedThreshold, e.g. 0.5 = half a screen early). Guard it: onEndReached can fire several times, so fetch only when there is a next page and none is loading, and show a spinner in ListFooterComponent. TanStack Query's useInfiniteQuery does the bookkeeping: initialPageParam, getNextPageParam: (last) => last.nextCursor, data.pages, fetchNextPage, hasNextPage and isFetchingNextPage. Put the search text in the query key, so a new search starts again from page one.",
        webLab: expoLab({
          name: "Kobo News",
          layout: ARTICLE_LAYOUT,
          task:
            "The news shows only the first 10 articles. Use useInfiniteQuery (key [\"articles\", query], initialPageParam null, getNextPageParam from nextCursor) to load the next page when the list nears its end, only when there is a next page and none is loading, with an ActivityIndicator in the footer while it loads. Searching starts again from the first page, and no matches shows: No articles match \"<query>\".",
          files: { "src/app/index.tsx": ARTICLE_START, "src/services/articles.ts": ARTICLE_SERVICE, "server/index.js": ARTICLE_SERVER },
          readOnly: ["src/services/articles.ts", "server/index.js"],
          solution: { "src/app/index.tsx": ARTICLE_MODEL },
          tests: [
            { label: "Scrolling loads the next pages", check: "await waitFor(() => findAll({ testID: 'article' }).length === 10, 3000); for (let i = 0; i < 6 && findAll({ testID: 'article' }).length < 20; i++) { await scrollDown(3000); await wait(400); } await waitFor(() => findAll({ testID: 'article' }).length === 20, 3000); return has('Football: story 19');", fail: "onEndReached → fetchNextPage(), with getNextPageParam: (last) => last.nextCursor." },
            { label: "It stops after the last page, and never loads a page twice", check: "await waitFor(() => findAll({ testID: 'article' }).length >= 10, 3000); for (let i = 0; i < 8; i++) { await scrollDown(4000); await wait(250); } await waitFor(() => findAll({ testID: 'article' }).length === 35, 4000); const urls = " + pageReqs + ".map((c) => c.url); return new Set(urls).size === urls.length && urls.length === 4;", fail: "Only when hasNextPage && !isFetchingNextPage." },
            { label: "Search sends q and starts from page one", check: "await restart(); await waitFor(() => findAll({ testID: 'article' }).length === 10, 3000); await typeInto('Search the news', 'lagos'); await waitFor(() => findAll({ testID: 'article' }).length === 7, 3000); const last = " + pageReqs + ".pop().url; return last.includes('q=lagos') && !last.includes('cursor=') && findAll({ testID: 'article' }).every((e) => e.textContent.startsWith('Lagos traffic'));", fail: "Put the query in the queryKey." },
            { label: "No matches says so", check: "await typeInto('Search the news', 'cricket'); await waitFor(() => hasText('No articles match'), 3000); return has('No articles match \"cricket\"');", fail: "ListEmptyComponent once data has loaded." },
          ],
          hint: "const articles = data?.pages.flatMap((p) => p.items) ?? [];",
          successMessage: "A feed that loads as you scroll, one page at a time, and searches from the start.",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },
];
