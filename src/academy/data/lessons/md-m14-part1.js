/**
 * MOBILE APP DEVELOPMENT · MODULE 14 · BACKEND AND DATABASE INTEGRATION (part 1)
 *
 * Curriculum 14.1 – 14.8: frontend and backend responsibilities, server
 * architecture, tables and relationships, SQL, Firebase and Supabase,
 * user accounts, CRUD, and cloud storage.
 *
 * Labs that write SERVER code use the practice server ("practice-server")
 * and its SQLite database(), the same engine as expo-sqlite on the phone.
 *
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 */

import { expoLab } from "./md-helpers.js";

export const SECTION_ID = "md-s14-backend";
export const MODULE = "md-m14-backend";

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
const serverOnly = (what) => `import { Text } from "react-native";

export default function Home() {
  return <Text style={{ padding: 20 }}>${what}</Text>;
}
`;
const post = (path, body, extra = "") => `await fetch('https://api.example.com${path}', { method: 'POST', headers: { 'Content-Type': 'application/json'${extra} }, body: JSON.stringify(${body}) })`;

/* ── 14.1 · Frontend versus backend ──────────────────────────────────── */
const ORDER_SERVER_START = `import { createServer } from "practice-server";

const app = createServer();
const PRICES = { p1: 8500, p2: 3000, p3: 12000 };
const orders = [];

app.post("/orders", (req, res) => {
  const { items, total, discountCode } = req.body || {};
  const order = { id: String(orders.length + 1), items, discountCode, total };
  orders.push(order);
  res.status(201).json(order);
});

export default app;
`;
const ORDER_SERVER_MODEL = `import { createServer } from "practice-server";

const app = createServer();
const PRICES = { p1: 8500, p2: 3000, p3: 12000 };
const DISCOUNTS = { KOBO10: 0.1 };
const orders = [];

app.post("/orders", (req, res) => {
  const { items, discountCode } = req.body || {};
  // Never trust the client: check every item, and work the total out here.
  if (!Array.isArray(items) || items.length === 0) return res.status(400).json({ message: "The order is empty" });
  for (const item of items) {
    if (!(item.productId in PRICES)) return res.status(400).json({ message: "Unknown product " + item.productId });
    if (!Number.isInteger(item.qty) || item.qty < 1 || item.qty > 10) return res.status(400).json({ message: "Quantity must be 1 to 10" });
  }
  const subtotal = items.reduce((sum, i) => sum + PRICES[i.productId] * i.qty, 0);
  const rate = DISCOUNTS[String(discountCode || "").trim().toUpperCase()] || 0;
  const total = Math.round(subtotal * (1 - rate));
  const order = { id: String(orders.length + 1), items, discountCode: rate ? discountCode : null, total };
  orders.push(order);
  res.status(201).json(order);
});

export default app;
`;
const ORDER_APP = `import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { naira } from "@/utils/money";

// The app shows a total, but only the server's total counts.
const CART = [{ productId: "p1", qty: 2 }, { productId: "p2", qty: 1 }];

export default function Checkout() {
  const [result, setResult] = useState("");
  async function placeOrder() {
    const response = await fetch("https://api.example.com/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: CART, total: 20000, discountCode: "kobo10" }),
    });
    const order = await response.json();
    setResult(response.ok ? "Order #" + order.id + ": " + naira(order.total) : order.message);
  }
  return (
    <View style={{ padding: 20, gap: 12 }}>
      <Pressable accessibilityRole="button" onPress={placeOrder} style={{ minHeight: 48, justifyContent: "center" }}>
        <Text>Place order</Text>
      </Pressable>
      <Text testID="result">{result}</Text>
    </View>
  );
}
`;

/* ── 14.3 · Tables and relationships ─────────────────────────────────── */
const REL_START = `import { createServer, database } from "practice-server";

const app = createServer();
const db = database();

// 1. Create the tables: users, notices (each by a user) and comments (each on a notice, by a user).
db.exec(\`
  PRAGMA foreign_keys = ON;
\`);

// The lab's data. Keep it: it needs the tables above.
db.exec(\`
  INSERT INTO users (id, name) VALUES (1, 'Ada'), (2, 'Tunde'), (3, 'Bisi');
  INSERT INTO notices (id, user_id, title, created_at) VALUES
    (1, 1, 'Water off on Saturday', '2026-10-18'),
    (2, 2, 'Lost cat: grey, answers to Biscuit', '2026-10-19'),
    (3, 3, 'Football on the field at 5', '2026-10-20');
  INSERT INTO comments (notice_id, user_id, body) VALUES
    (1, 2, 'Thanks for the warning'), (1, 3, 'Which streets?'), (2, 1, 'Will keep an eye out');
\`);

// 2. Every notice, newest first, with its author's name and its number of comments.
app.get("/notices", (req, res) => {
  res.json([]);
});

// 3. Add a comment; a notice that doesn't exist is a 404.
app.post("/notices/:id/comments", (req, res) => {
  res.status(501).json({ message: "Not written yet" });
});

app.delete("/notices/:id", (req, res) => {
  db.run("DELETE FROM notices WHERE id = ?", [Number(req.params.id)]);
  res.status(204).end();
});

// For this lab's checks only: how many rows each table has.
app.get("/debug/counts", (req, res) =>
  res.json(Object.fromEntries(["users", "notices", "comments"].map((t) => [t, db.get("SELECT COUNT(*) AS n FROM " + t).n])))
);

export default app;
`;
const REL_MODEL = `import { createServer, database } from "practice-server";

const app = createServer();
const db = database();

// 1. Create the tables: users, notices (each by a user) and comments (each on a notice, by a user).
db.exec(\`
  PRAGMA foreign_keys = ON;
  CREATE TABLE users (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL
  );
  CREATE TABLE notices (
    id INTEGER PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    created_at TEXT NOT NULL
  );
  CREATE TABLE comments (
    id INTEGER PRIMARY KEY,
    notice_id INTEGER NOT NULL REFERENCES notices(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    body TEXT NOT NULL
  );
\`);

// The lab's data. Keep it: it needs the tables above.
db.exec(\`
  INSERT INTO users (id, name) VALUES (1, 'Ada'), (2, 'Tunde'), (3, 'Bisi');
  INSERT INTO notices (id, user_id, title, created_at) VALUES
    (1, 1, 'Water off on Saturday', '2026-10-18'),
    (2, 2, 'Lost cat: grey, answers to Biscuit', '2026-10-19'),
    (3, 3, 'Football on the field at 5', '2026-10-20');
  INSERT INTO comments (notice_id, user_id, body) VALUES
    (1, 2, 'Thanks for the warning'), (1, 3, 'Which streets?'), (2, 1, 'Will keep an eye out');
\`);

// 2. Every notice, newest first, with its author's name and its number of comments.
app.get("/notices", (req, res) => {
  res.json(
    db.all(\`
      SELECT notices.id, notices.title, users.name AS author, COUNT(comments.id) AS comments
      FROM notices
      JOIN users ON users.id = notices.user_id
      LEFT JOIN comments ON comments.notice_id = notices.id
      GROUP BY notices.id
      ORDER BY notices.created_at DESC
    \`)
  );
});

// 3. Add a comment; a notice that doesn't exist is a 404.
app.post("/notices/:id/comments", (req, res) => {
  const { userId, body } = req.body || {};
  try {
    const { lastInsertRowId } = db.run("INSERT INTO comments (notice_id, user_id, body) VALUES (?, ?, ?)", [Number(req.params.id), userId, body]);
    res.status(201).json({ id: lastInsertRowId });
  } catch (e) {
    // The foreign key refuses a comment on a notice that doesn't exist.
    if (String(e.message).includes("FOREIGN KEY")) return res.status(404).json({ message: "Notice not found" });
    throw e;
  }
});

app.delete("/notices/:id", (req, res) => {
  db.run("DELETE FROM notices WHERE id = ?", [Number(req.params.id)]);
  res.status(204).end();
});

// For this lab's checks only: how many rows each table has.
app.get("/debug/counts", (req, res) =>
  res.json(Object.fromEntries(["users", "notices", "comments"].map((t) => [t, db.get("SELECT COUNT(*) AS n FROM " + t).n])))
);

export default app;
`;

/* ── 14.4 · SQL ──────────────────────────────────────────────────────── */
const SQL_SEED = `db.exec(\`
  CREATE TABLE products (id INTEGER PRIMARY KEY, name TEXT NOT NULL, category TEXT NOT NULL, price INTEGER NOT NULL);
  CREATE TABLE order_lines (id INTEGER PRIMARY KEY, product_id INTEGER NOT NULL REFERENCES products(id), qty INTEGER NOT NULL);
  INSERT INTO products (id, name, category, price) VALUES
    (1, 'Redmi Note 14', 'phones', 185000), (2, 'Tecno Spark 30', 'phones', 129000),
    (3, 'Ankara tote bag', 'fashion', 8500), (4, 'Adire scarf', 'fashion', 6000),
    (5, 'Shea butter', 'beauty', 3000), (6, 'Black soap', 'beauty', 1500);
  INSERT INTO order_lines (product_id, qty) VALUES (3, 4), (5, 10), (1, 1), (3, 2), (6, 3), (5, 2), (2, 1);
\`);`;
const SQL_START = `import { createServer, database } from "practice-server";

const app = createServer();
const db = database();
${SQL_SEED}

// GET /products?category=fashion&maxPrice=10000&sort=price
// Filter by category and maximum price (each optional), sort by "price" or "name" (default "name"), at most 20 rows.
app.get("/products", (req, res) => {
  res.json(db.all("SELECT * FROM products"));
});

// GET /reports/top-products: the three best sellers by quantity, as { name, sold }.
app.get("/reports/top-products", (req, res) => {
  res.json([]);
});

// PATCH /products/:id { price }: change the price; 404 if there is no such product.
app.patch("/products/:id", (req, res) => {
  res.status(501).json({ message: "Not written yet" });
});

export default app;
`;
const SQL_MODEL = `import { createServer, database } from "practice-server";

const app = createServer();
const db = database();
${SQL_SEED}

// Column names can't be ? parameters, so only ever use a name from this list.
const SORTS = { price: "price ASC", name: "name ASC" };

// GET /products?category=fashion&maxPrice=10000&sort=price
// Filter by category and maximum price (each optional), sort by "price" or "name" (default "name"), at most 20 rows.
app.get("/products", (req, res) => {
  const where = [];
  const params = [];
  if (req.query.category) {
    where.push("category = ?");
    params.push(req.query.category);
  }
  if (req.query.maxPrice) {
    where.push("price <= ?");
    params.push(Number(req.query.maxPrice));
  }
  const order = SORTS[req.query.sort] || SORTS.name;
  const sql = "SELECT * FROM products" + (where.length ? " WHERE " + where.join(" AND ") : "") + " ORDER BY " + order + " LIMIT 20";
  res.json(db.all(sql, params));
});

// GET /reports/top-products: the three best sellers by quantity, as { name, sold }.
app.get("/reports/top-products", (req, res) => {
  res.json(
    db.all(\`
      SELECT products.name, SUM(order_lines.qty) AS sold
      FROM order_lines
      JOIN products ON products.id = order_lines.product_id
      GROUP BY products.id
      ORDER BY sold DESC
      LIMIT 3
    \`)
  );
});

// PATCH /products/:id { price }: change the price; 404 if there is no such product.
app.patch("/products/:id", (req, res) => {
  const price = req.body?.price;
  if (!Number.isInteger(price) || price <= 0) return res.status(400).json({ message: "price must be a positive whole number" });
  const { changes } = db.run("UPDATE products SET price = ? WHERE id = ?", [price, Number(req.params.id)]);
  if (changes === 0) return res.status(404).json({ message: "Product not found" });
  res.json(db.get("SELECT * FROM products WHERE id = ?", [Number(req.params.id)]));
});

export default app;
`;
const q = (path) => `(await (await fetch('https://api.example.com${path}')).json())`;

/* ── 14.6 · Accounts ─────────────────────────────────────────────────── */
const ACCOUNT_START = `import { createServer, database, passwords, tokens } from "practice-server";

const app = createServer();
const db = database();
const SECRET = "practice-only-secret";

db.exec("CREATE TABLE users (id INTEGER PRIMARY KEY, email TEXT NOT NULL UNIQUE, name TEXT NOT NULL, password_hash TEXT NOT NULL)");

/** The signed-in user's id, or null. */
function userId(req) {
  try {
    return tokens.verify((req.headers.authorization || "").replace("Bearer ", ""), SECRET).sub;
  } catch {
    return null;
  }
}

// POST /auth/register { email, name, password } → 201 { token }
app.post("/auth/register", (req, res) => {
  res.status(501).json({ message: "Not written yet" });
});

// POST /auth/login { email, password } → { token }
app.post("/auth/login", (req, res) => {
  res.status(501).json({ message: "Not written yet" });
});

// GET /me → { id, email, name }
app.get("/me", (req, res) => {
  res.status(501).json({ message: "Not written yet" });
});

// DELETE /me → 204, and the account is gone
app.delete("/me", (req, res) => {
  res.status(501).json({ message: "Not written yet" });
});

// For this lab's checks only.
app.get("/debug/users", (req, res) => res.json(db.all("SELECT email, password_hash FROM users")));

export default app;
`;
const ACCOUNT_MODEL = `import { createServer, database, passwords, tokens } from "practice-server";

const app = createServer();
const db = database();
const SECRET = "practice-only-secret";

db.exec("CREATE TABLE users (id INTEGER PRIMARY KEY, email TEXT NOT NULL UNIQUE, name TEXT NOT NULL, password_hash TEXT NOT NULL)");

/** The signed-in user's id, or null. */
function userId(req) {
  try {
    return tokens.verify((req.headers.authorization || "").replace("Bearer ", ""), SECRET).sub;
  } catch {
    return null;
  }
}

const tokenFor = (id) => tokens.sign({ sub: id }, SECRET, { expiresIn: "1h" });
const normalise = (email) => String(email || "").trim().toLowerCase();

// POST /auth/register { email, name, password } → 201 { token }
app.post("/auth/register", (req, res) => {
  const email = normalise(req.body?.email);
  const name = String(req.body?.name || "").trim();
  const password = String(req.body?.password || "");
  if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email) || !name) return res.status(400).json({ message: "Enter a name and a valid email" });
  if (password.length < 8) return res.status(400).json({ message: "Use at least 8 characters" });
  if (db.get("SELECT id FROM users WHERE email = ?", [email])) return res.status(409).json({ message: "An account with this email already exists" });
  // Only a hash is stored (on a real server: bcrypt, scrypt or argon2).
  const { lastInsertRowId } = db.run("INSERT INTO users (email, name, password_hash) VALUES (?, ?, ?)", [email, name, passwords.hash(password)]);
  res.status(201).json({ token: tokenFor(lastInsertRowId) });
});

// POST /auth/login { email, password } → { token }
app.post("/auth/login", (req, res) => {
  const user = db.get("SELECT id, password_hash FROM users WHERE email = ?", [normalise(req.body?.email)]);
  // The same message either way, so nobody can find out which emails have accounts.
  if (!user || !passwords.verify(String(req.body?.password || ""), user.password_hash)) return res.status(401).json({ message: "Wrong email or password" });
  res.json({ token: tokenFor(user.id) });
});

// GET /me → { id, email, name }
app.get("/me", (req, res) => {
  const id = userId(req);
  const user = id && db.get("SELECT id, email, name FROM users WHERE id = ?", [id]);
  if (!user) return res.status(401).json({ message: "Sign in first" });
  res.json(user);
});

// DELETE /me → 204, and the account is gone
app.delete("/me", (req, res) => {
  const id = userId(req);
  if (!id) return res.status(401).json({ message: "Sign in first" });
  db.run("DELETE FROM users WHERE id = ?", [id]);
  res.status(204).end();
});

// For this lab's checks only.
app.get("/debug/users", (req, res) => res.json(db.all("SELECT email, password_hash FROM users")));

export default app;
`;

/* ── 14.7 · CRUD with mutations ──────────────────────────────────────── */
const CRUD_SERVER = `import { createServer } from "practice-server";

const app = createServer();
let notices = [
  { id: "1", title: "Water off on Saturday", pinned: true },
  { id: "2", title: "Lost cat: grey, answers to Biscuit", pinned: false },
];
let nextId = 3;

app.get("/notices", (req, res) => res.json(notices));

app.post("/notices", (req, res) => {
  const notice = { id: String(nextId++), title: req.body.title, pinned: false };
  notices = [notice, ...notices];
  res.status(201).json(notice);
});

app.delete(
  "/notices/:id",
  (req, res) => {
    const notice = notices.find((n) => n.id === req.params.id);
    if (!notice) return res.status(404).json({ message: "Notice not found" });
    if (notice.pinned) return res.status(403).json({ message: "Pinned notices can only be removed by an admin" });
    notices = notices.filter((n) => n.id !== req.params.id);
    res.status(204).end();
  },
  { delay: 800 }
);

export default app;
`;
const CRUD_API = `export type Notice = { id: string; title: string; pinned: boolean };

async function request<T>(path: string, init: { method?: string; body?: unknown } = {}): Promise<T> {
  const response = await fetch("https://api.example.com" + path, {
    method: init.method ?? "GET",
    headers: { "Content-Type": "application/json" },
    body: init.body === undefined ? undefined : JSON.stringify(init.body),
  });
  if (response.status === 204) return undefined as T;
  const data = await response.json();
  if (!response.ok) throw new Error(data.message ?? "Request failed");
  return data as T;
}

export const getNotices = () => request<Notice[]>("/notices");
export const createNotice = (title: string) => request<Notice>("/notices", { method: "POST", body: { title } });
export const deleteNotice = (id: string) => request<void>("/notices/" + id, { method: "DELETE" });
`;
const CRUD_HOOKS_START = `import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createNotice, deleteNotice, getNotices, type Notice } from "@/services/notices";

export function useNotices() {
  return useQuery({ queryKey: ["notices"], queryFn: getNotices });
}

/** Creates a notice, then refreshes the list. */
export function useCreateNotice() {
  return useMutation({ mutationFn: createNotice });
}

/** Removes a notice from the list AT ONCE (optimistically); puts it back if the server refuses. */
export function useDeleteNotice() {
  return useMutation({ mutationFn: deleteNotice });
}
`;
const CRUD_HOOKS_MODEL = `import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createNotice, deleteNotice, getNotices, type Notice } from "@/services/notices";

const KEY = ["notices"];

export function useNotices() {
  return useQuery({ queryKey: KEY, queryFn: getNotices });
}

/** Creates a notice, then refreshes the list. */
export function useCreateNotice() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createNotice,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: KEY }),
  });
}

/** Removes a notice from the list AT ONCE (optimistically); puts it back if the server refuses. */
export function useDeleteNotice() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteNotice,
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: KEY });
      const previous = queryClient.getQueryData<Notice[]>(KEY);
      queryClient.setQueryData<Notice[]>(KEY, (list) => (list ?? []).filter((n) => n.id !== id));
      return { previous };
    },
    onError: (_error, _id, context) => {
      if (context?.previous) queryClient.setQueryData(KEY, context.previous);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: KEY }),
  });
}
`;
const CRUD_LAYOUT = `import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <Stack>
        <Stack.Screen name="index" options={{ title: "Noticeboard" }} />
      </Stack>
    </QueryClientProvider>
  );
}
`;
const CRUD_SCREEN = `import { useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { useCreateNotice, useDeleteNotice, useNotices } from "@/hooks/useNotices";

export default function Board() {
  const { data: notices = [] } = useNotices();
  const create = useCreateNotice();
  const remove = useDeleteNotice();
  const [title, setTitle] = useState("");
  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 10 }}>
      <TextInput placeholder="New notice" value={title} onChangeText={setTitle} style={{ minHeight: 48, borderWidth: 1, borderColor: "#cbd5e1", borderRadius: 10, paddingHorizontal: 12 }} />
      <Pressable accessibilityRole="button" onPress={() => create.mutate(title.trim(), { onSuccess: () => setTitle("") })} style={{ minHeight: 48, justifyContent: "center" }}>
        <Text>Post notice</Text>
      </Pressable>
      {remove.error ? <Text accessibilityRole="alert">{remove.error.message}</Text> : null}
      {notices.map((n) => (
        <View key={n.id} style={{ flexDirection: "row", alignItems: "center" }}>
          <Text testID="notice" style={{ flex: 1 }}>{n.title}</Text>
          <Pressable accessibilityRole="button" accessibilityLabel={"Remove " + n.title} onPress={() => remove.mutate(n.id)} style={{ width: 44, height: 44, justifyContent: "center", alignItems: "center" }}>
            <Text>✕</Text>
          </Pressable>
        </View>
      ))}
    </ScrollView>
  );
}
`;

/* ── 14.8 · Cloud storage ────────────────────────────────────────────── */
const STORAGE_START = `import { createServer, database } from "practice-server";

const app = createServer();
const db = database();

db.exec(\`
  CREATE TABLE notices (id INTEGER PRIMARY KEY, title TEXT NOT NULL);
  CREATE TABLE photos (id INTEGER PRIMARY KEY, notice_id INTEGER NOT NULL REFERENCES notices(id), url TEXT NOT NULL, bytes INTEGER NOT NULL);
  INSERT INTO notices (id, title) VALUES (1, 'Lost cat: grey, answers to Biscuit');
\`);

// The upload arrives as req.files[0]: { field, name, type, size, url }.
// The practice server has already put the file in storage: url is where it now lives.
// Accept JPEG or PNG photos up to 5 MB (415 / 413 otherwise), save the url in photos, reply 201 { url }.
app.post("/notices/:id/photo", (req, res) => {
  res.status(501).json({ message: "Not written yet" });
});

// The notice, with photoUrl: the url of its latest photo, or null.
app.get("/notices/:id", (req, res) => {
  const notice = db.get("SELECT id, title FROM notices WHERE id = ?", [Number(req.params.id)]);
  if (!notice) return res.status(404).json({ message: "Notice not found" });
  res.json({ ...notice, photoUrl: null });
});

export default app;
`;
const STORAGE_MODEL = `import { createServer, database } from "practice-server";

const app = createServer();
const db = database();

db.exec(\`
  CREATE TABLE notices (id INTEGER PRIMARY KEY, title TEXT NOT NULL);
  CREATE TABLE photos (id INTEGER PRIMARY KEY, notice_id INTEGER NOT NULL REFERENCES notices(id), url TEXT NOT NULL, bytes INTEGER NOT NULL);
  INSERT INTO notices (id, title) VALUES (1, 'Lost cat: grey, answers to Biscuit');
\`);

const TYPES = ["image/jpeg", "image/png"];
const MAX_BYTES = 5 * 1024 * 1024;

// The upload arrives as req.files[0]: { field, name, type, size, url }.
// The practice server has already put the file in storage: url is where it now lives.
// Accept JPEG or PNG photos up to 5 MB (415 / 413 otherwise), save the url in photos, reply 201 { url }.
app.post("/notices/:id/photo", (req, res) => {
  const id = Number(req.params.id);
  if (!db.get("SELECT id FROM notices WHERE id = ?", [id])) return res.status(404).json({ message: "Notice not found" });
  const file = req.files[0];
  if (!file) return res.status(400).json({ message: "No photo received" });
  if (!TYPES.includes(file.type)) return res.status(415).json({ message: "Photos must be JPEG or PNG" });
  if (file.size > MAX_BYTES) return res.status(413).json({ message: "Photos can be 5 MB at most" });
  // The database keeps the file's address, not the file itself.
  db.run("INSERT INTO photos (notice_id, url, bytes) VALUES (?, ?, ?)", [id, file.url, file.size]);
  res.status(201).json({ url: file.url });
});

// The notice, with photoUrl: the url of its latest photo, or null.
app.get("/notices/:id", (req, res) => {
  const notice = db.get("SELECT id, title FROM notices WHERE id = ?", [Number(req.params.id)]);
  if (!notice) return res.status(404).json({ message: "Notice not found" });
  const photo = db.get("SELECT url FROM photos WHERE notice_id = ? ORDER BY id DESC LIMIT 1", [notice.id]);
  res.json({ ...notice, photoUrl: photo ? photo.url : null });
});

export default app;
`;
const STORAGE_APP = `import * as DocumentPicker from "expo-document-picker";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";

const URL = "https://api.example.com/notices/1";

export default function Notice() {
  const [notice, setNotice] = useState<{ title: string; photoUrl: string | null } | null>(null);
  const [message, setMessage] = useState("");
  const load = () => fetch(URL).then((r) => r.json()).then(setNotice);
  useEffect(() => {
    load();
  }, []);

  async function send(file: { uri: string; name: string; type: string }) {
    const form = new FormData();
    form.append("photo", file as unknown as Blob);
    const response = await fetch(URL + "/photo", { method: "POST", body: form });
    const data = await response.json();
    setMessage(response.ok ? "Photo added" : data.message);
    load();
  }

  async function addPhoto() {
    const r = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ["images"], quality: 0.6 });
    if (!r.canceled) send({ uri: r.assets[0].uri, name: r.assets[0].fileName ?? "photo.jpg", type: r.assets[0].mimeType ?? "image/jpeg" });
  }

  async function addFile() {
    const r = await DocumentPicker.getDocumentAsync({});
    if (!r.canceled) send({ uri: r.assets[0].uri, name: r.assets[0].name, type: r.assets[0].mimeType ?? "application/octet-stream" });
  }

  return (
    <View style={{ padding: 20, gap: 12 }}>
      <Text style={{ fontSize: 18 }}>{notice?.title}</Text>
      {notice?.photoUrl ? <Image testID="photo" source={{ uri: notice.photoUrl }} style={{ width: 200, height: 150, borderRadius: 8 }} accessibilityLabel="Notice photo" /> : null}
      <Pressable accessibilityRole="button" onPress={addPhoto} style={{ minHeight: 48, justifyContent: "center" }}><Text>Add photo</Text></Pressable>
      <Pressable accessibilityRole="button" onPress={addFile} style={{ minHeight: 48, justifyContent: "center" }}><Text>Attach a file</Text></Pressable>
      <Text testID="message">{message}</Text>
    </View>
  );
}
`;

export const PART1 = [
  /* ═══════════════ LESSON 84 · 14.1 – 14.2 ═══════════════ */
  {
    id: "md-l84-backend-basics",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 1,
    covers: ["14.1", "14.2"],
    title: "What the Backend Is For",
    subtitle: "Which work belongs on the phone, which on the server, and how a server is organised",
    estimatedMinutes: 45,
    intro: "Until now the server has been given. In this module you write it, and learn where its responsibilities start and the app's end.",
    atoms: [
      {
        id: "a-md-backend-responsibilities",
        title: "Frontend versus backend responsibilities",
        explain:
          "The FRONTEND (your app) is for people: showing data, collecting input, giving instant feedback, working offline. The BACKEND (servers, databases, storage) is the source of truth and the place for anything that must be TRUSTED or SHARED: prices and totals, payments, permissions, other users' data, secrets and API keys, sending e-mails and push notifications. The golden rule: everything that arrives from an app can be faked (anyone can call your API with any body, without your app), so the server must check every input and compute every value that matters, such as an order's total, from its own data. Client-side checks are for convenience and speed; server-side checks are for correctness and security.",
        webLab: expoLab({
          name: "Kobo",
          layout: titled("Checkout"),
          task:
            "The server saves whatever total the app sends, so anyone could pay ₦1. Fix POST /orders in server/index.js: ignore the client's total; reject an empty order, an unknown productId (\"Unknown product <id>\") and a qty that isn't a whole number from 1 to 10 (\"Quantity must be 1 to 10\") with 400; work out the total from PRICES; and apply the discount code KOBO10 (any case, 10% off) on the server.",
          files: { "server/index.js": ORDER_SERVER_START, "src/app/index.tsx": ORDER_APP, "src/utils/money.ts": MONEY },
          readOnly: ["src/app/index.tsx", "src/utils/money.ts"],
          solution: { "server/index.js": ORDER_SERVER_MODEL },
          tests: [
            { label: "The app's order gets the server's total", check: "await press('Place order'); await waitFor(() => hasText('Order #'), 3000); return find({ testID: 'result' }).textContent === 'Order #1: ₦18,000';", fail: "2 × 8500 + 3000 = 20000, less 10% = 18000." },
            { label: "A faked total is ignored", check: `const r = ${post("/orders", "{ items: [{ productId: 'p3', qty: 1 }], total: 1 }")}; const o = await r.json(); return r.status === 201 && o.total === 12000;`, fail: "Work out the total from PRICES; never use req.body.total." },
            { label: "Bad items are refused", check: `const a = ${post("/orders", "{ items: [{ productId: 'p9', qty: 1 }] }")}; const b = ${post("/orders", "{ items: [{ productId: 'p1', qty: 0 }] }")}; const c = ${post("/orders", "{ items: [{ productId: 'p1', qty: 2.5 }] }")}; const d = ${post("/orders", "{ items: [] }")}; return a.status === 400 && (await a.json()).message === 'Unknown product p9' && b.status === 400 && (await b.json()).message === 'Quantity must be 1 to 10' && c.status === 400 && d.status === 400;`, fail: "Check every item before saving anything." },
            { label: "Only real discount codes count", check: `const r = await (${post("/orders", "{ items: [{ productId: 'p2', qty: 1 }], discountCode: 'FREE100' }")}).json(); return r.total === 3000;`, fail: "Look the code up in a table on the server." },
          ],
          hint: "Loop over items to validate, then reduce to a subtotal.",
          successMessage: "The server is now the source of truth: no app, real or fake, can set its own price.",
        }),
      },
      {
        id: "a-md-server-architecture",
        title: "Introduction to server-side application architecture",
        explain:
          "A typical backend is organised in LAYERS. ROUTES (or controllers) receive HTTP requests, read parameters and the signed-in user, and send responses. SERVICES hold the business rules (place an order, apply a discount). A DATA-ACCESS layer (repositories, or an ORM such as Prisma or Drizzle) talks to the DATABASE (PostgreSQL, MySQL, SQLite, MongoDB). Around them: MIDDLEWARE for things every request needs (authentication, logging, rate limits, validation), configuration and SECRETS from environment variables, and BACKGROUND JOBS for slow work (sending e-mails, resizing images). Keep servers STATELESS (no user data in memory between requests) so you can run several copies behind a load balancer. Common choices: Node.js with Express, Fastify or NestJS; Python with Django or FastAPI; or a backend-as-a-service (Lesson 86). Expo Router can also host API routes (+api.ts files) deployed with EAS Hosting.",
        decision: {
          scenario: "Your shop's server has grown: one 900-line file handles HTTP, discount rules, SQL and e-mails. A new teammate must add a second discount type.",
          question: "What structure makes this change safe and easy?",
          options: [
            { id: "a", text: "Routes that only handle HTTP, an orders service with the discount rules, and a data-access module for SQL", why: "Each layer has one job: the teammate changes the discount rule in the service, can unit-test it without HTTP or a database, and the routes and SQL stay untouched." },
            { id: "b", text: "Keep one file, but add more comments", whyWrong: "Comments don't separate concerns: any change still touches HTTP, rules and SQL together, and nothing can be tested on its own." },
            { id: "c", text: "Move the discount rules into the mobile app, where they are easier to change", whyWrong: "Rules about money must run on the server, where users can't change them (Lesson 84's first lab)." },
            { id: "d", text: "Keep each user's cart and discounts in the server's memory between requests", whyWrong: "In-memory state is lost on restart and breaks when you run more than one copy of the server; store it in the database." },
          ],
          correct: "a",
          aftermath: "Routes → services → data access, with middleware around them: the shape of most production backends.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════ LESSON 85 · 14.3 – 14.4 ═══════════════ */
  {
    id: "md-l85-sql",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 2,
    covers: ["14.3", "14.4"],
    title: "Tables, Relationships and SQL",
    subtitle: "Modelling data, and asking the database questions",
    estimatedMinutes: 60,
    intro: "Most backends store their data in a relational database. Knowing how to design its tables and write its queries is one of the most durable skills in software.",
    atoms: [
      {
        id: "a-md-tables-relationships",
        title: "Database tables, records, relationships, and queries",
        explain:
          "A TABLE holds one kind of thing (users, notices, comments); each RECORD (row) has a PRIMARY KEY that identifies it. RELATIONSHIPS are stored as FOREIGN KEYS: a notice's user_id REFERENCES users(id). One-to-many (a user has many notices) is a foreign key on the \"many\" side; many-to-many (notices and tags) uses a join table (notice_tags). Store each fact once: the author's name lives in users, not copied into every notice. Foreign keys protect the data: a comment can't point at a notice that doesn't exist, and ON DELETE CASCADE removes a notice's comments with it. (SQLite enforces them only after PRAGMA foreign_keys = ON.) Queries combine tables with JOIN (only matching rows) and LEFT JOIN (keep rows with no match, such as notices with no comments), and summarise with COUNT … GROUP BY.",
        webLab: expoLab({
          name: "Kobo",
          layout: titled("Server"),
          task:
            "In server/index.js: create the users, notices and comments tables with primary keys, foreign keys (notice → user; comment → notice and user) and ON DELETE CASCADE; write GET /notices returning { id, title, author, comments } newest first using JOIN and LEFT JOIN … GROUP BY; and write POST /notices/:id/comments ({ userId, body } → 201 { id }), answering 404 \"Notice not found\" when the foreign key refuses it.",
          files: { "server/index.js": REL_START, "src/app/index.tsx": serverOnly("This lab is the server: see server/index.js.") },
          readOnly: ["src/app/index.tsx"],
          solution: { "server/index.js": REL_MODEL },
          tests: [
            { label: "Notices come with their author and comment count, newest first", check: `const list = ${q("/notices")}; return JSON.stringify(list) === JSON.stringify([{ id: 3, title: 'Football on the field at 5', author: 'Bisi', comments: 0 }, { id: 2, title: 'Lost cat: grey, answers to Biscuit', author: 'Tunde', comments: 1 }, { id: 1, title: 'Water off on Saturday', author: 'Ada', comments: 2 }]);`, fail: "JOIN users, LEFT JOIN comments (so 0 counts), GROUP BY notices.id, ORDER BY created_at DESC." },
            { label: "Comments can be added, but not to missing notices", check: `const ok = ${post("/notices/3/comments", "{ userId: 1, body: 'I will be there' }")}; const bad = ${post("/notices/99/comments", "{ userId: 1, body: 'Hello?' }")}; const list = ${q("/notices")}; return ok.status === 201 && bad.status === 404 && (await bad.json()).message === 'Notice not found' && list[0].comments === 1;`, fail: "REFERENCES notices(id), PRAGMA foreign_keys = ON, and catch the FOREIGN KEY error." },
            { label: "Deleting a notice deletes its comments", check: "await fetch('https://api.example.com/notices/1', { method: 'DELETE' }); const c = " + q("/debug/counts") + "; return c.notices === 2 && c.comments === 2;", fail: "ON DELETE CASCADE on comments.notice_id." },
          ],
          hint: "COUNT(comments.id), not COUNT(*): with a LEFT JOIN, COUNT(*) counts the empty row as 1.",
          successMessage: "A normalised schema with real relationships, protected by foreign keys.",
        }),
      },
      {
        id: "a-md-sql",
        title: "SQL fundamentals",
        explain:
          "Four statements do most of the work. SELECT columns FROM table WHERE conditions ORDER BY column LIMIT n reads; INSERT INTO table (cols) VALUES (?, ?) adds; UPDATE table SET col = ? WHERE id = ? changes (always with a WHERE!); DELETE FROM table WHERE id = ? removes. Aggregates summarise: COUNT, SUM, AVG, MIN, MAX, with GROUP BY for one result per group and HAVING to filter groups. Pass VALUES as ? parameters, always. Things that can't be parameters, such as a column to sort by, must come from a fixed allow-list in your code, never from the request. Build optional filters by collecting WHERE parts and their parameters, and always LIMIT lists. UPDATE and DELETE report how many rows changed: 0 usually means \"not found\" (404).",
        webLab: expoLab({
          name: "Kobo",
          layout: titled("Server"),
          task:
            "Write three routes with SQL in server/index.js: GET /products with optional category and maxPrice filters (as ? parameters), sorted by \"price\" or \"name\" (default name; any other value falls back to name), at most 20 rows; GET /reports/top-products: the three best sellers as { name, sold } using SUM … GROUP BY; PATCH /products/:id { price }: UPDATE the price (400 unless it's a positive whole number; 404 \"Product not found\" if nothing changed) and return the product.",
          files: { "server/index.js": SQL_START, "src/app/index.tsx": serverOnly("This lab is the server: see server/index.js.") },
          readOnly: ["src/app/index.tsx"],
          solution: { "server/index.js": SQL_MODEL },
          tests: [
            { label: "Filters and sorting", check: `const a = ${q("/products?category=fashion&sort=price")}; const b = ${q("/products?maxPrice=6000")}; const c = ${q("/products")}; return a.map((p) => p.name).join() === 'Adire scarf,Ankara tote bag' && b.map((p) => p.name).join() === 'Adire scarf,Black soap,Shea butter' && c[0].name === 'Adire scarf' && c.length === 6;`, fail: "WHERE category = ? AND price <= ?, ORDER BY from the allow-list." },
            { label: "The sort can't be used to inject SQL", check: `const r = await fetch('https://api.example.com/products?sort=' + encodeURIComponent('price; DROP TABLE products')); const list = await r.json(); const again = ${q("/products")}; return r.status === 200 && list.length === 6 && again.length === 6;`, fail: "Look the sort up in an allow-list; never paste it into SQL." },
            { label: "The best sellers report", check: `return JSON.stringify(${q("/reports/top-products")}) === JSON.stringify([{ name: 'Shea butter', sold: 12 }, { name: 'Ankara tote bag', sold: 6 }, { name: 'Black soap', sold: 3 }]);`, fail: "SUM(qty) … GROUP BY product … ORDER BY sold DESC LIMIT 3" },
            { label: "Updating a price", check: "const ok = await fetch('https://api.example.com/products/5', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ price: 3500 }) }); const missing = await fetch('https://api.example.com/products/99', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ price: 3500 }) }); const bad = await fetch('https://api.example.com/products/5', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ price: -1 }) }); return ok.status === 200 && (await ok.json()).price === 3500 && missing.status === 404 && bad.status === 400;", fail: "UPDATE … WHERE id = ?, and changes === 0 means 404." },
          ],
          hint: "db.run returns { changes, lastInsertRowId }.",
          successMessage: "SELECT, UPDATE, aggregates, safe parameters and a safe ORDER BY.",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════ LESSON 86 · 14.5 – 14.6 ═══════════════ */
  {
    id: "md-l86-baas-accounts",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 3,
    covers: ["14.5", "14.6"],
    title: "Firebase, Supabase, and User Accounts",
    subtitle: "Backends you rent, and the accounts every backend needs",
    estimatedMinutes: 55,
    intro: "You don't always have to write a server. Backend-as-a-service platforms give you a database, accounts, storage and realtime in an afternoon; knowing what they do for you makes you better with either choice.",
    atoms: [
      {
        id: "a-md-baas",
        title: "Introduction to Firebase or Supabase",
        explain:
          "A BACKEND-AS-A-SERVICE (BaaS) gives you the common backend parts ready-made, with client libraries for your app. FIREBASE (Google): Firestore, a document database; Authentication; Cloud Storage; Cloud Functions for server code; Cloud Messaging for push; and SECURITY RULES that decide who may read and write what. SUPABASE (open source, can be self-hosted): a PostgreSQL database with an auto-generated API; Auth; Storage; Realtime; Edge Functions; and ROW LEVEL SECURITY (RLS) policies written in SQL. With Expo, the Firebase JavaScript SDK and supabase-js work in Expo Go; React Native Firebase (native SDKs, more features) needs a development build. Keep the session in SecureStore or AsyncStorage as their docs show. The catch: because the app talks to the database directly, your security rules or RLS policies ARE your backend's security: an app with rules left open exposes every user's data. Their public (anon) keys are safe to ship; service-role or admin keys never are.",
        decision: {
          scenario: "A two-person team is building a community noticeboard: accounts, posts with photos, live updates, and simple rules (people edit only their own posts). They know SQL and want to launch in four weeks, and to be able to move to their own server later.",
          question: "What is the most sensible backend choice?",
          options: [
            { id: "a", text: "Supabase, with Row Level Security policies on every table from day one", why: "It provides Postgres, auth, storage and realtime out of the box, the team already knows SQL, it can be self-hosted or migrated (it's standard Postgres), and RLS enforces \"edit only your own posts\" in the database." },
            { id: "b", text: "Firebase with security rules left in test mode until launch", whyWrong: "Test-mode rules let anyone read and write everything; apps have leaked whole databases this way. Rules must be written before real data goes in." },
            { id: "c", text: "Write a custom server, database, auth system and file storage from scratch", whyWrong: "Possible, but four weeks for two people is better spent on the product; a BaaS covers these standard parts well." },
            { id: "d", text: "Store everything in AsyncStorage on each phone", whyWrong: "AsyncStorage is local to one phone: no other user would ever see a notice." },
          ],
          correct: "a",
          aftermath: "A BaaS is a backend you configure rather than write, and its security rules are the part you must write yourself, carefully.",
        },
      },
      {
        id: "a-md-accounts",
        title: "User authentication and account management",
        explain:
          "Account basics every backend needs: REGISTRATION (validate, normalise the e-mail to lower case, refuse duplicates with 409, and store only a password HASH from a slow algorithm such as bcrypt, scrypt or argon2, never the password); SIGN-IN (verify the hash and return a token; use ONE message, \"Wrong email or password\", for both unknown e-mails and wrong passwords, so nobody can test which e-mails have accounts; rate-limit attempts); the CURRENT USER endpoint (GET /me from the token); profile updates; and ACCOUNT DELETION: Apple and Google both require apps that let people create accounts to let them delete the account, and its data, from inside the app. (In this lab, passwords.hash stands in for bcrypt; Module 15 builds the full flows.)",
        webLab: expoLab({
          name: "Kobo",
          layout: titled("Server"),
          task:
            "Write the account routes in server/index.js: POST /auth/register (400 for a bad email, a missing name or a password under 8 characters; e-mail lower-cased; 409 \"An account with this email already exists\"; store passwords.hash(password); 201 { token } with tokenFor-style tokens.sign({ sub: id }, SECRET)); POST /auth/login (401 \"Wrong email or password\" for an unknown e-mail or a wrong password alike); GET /me ({ id, email, name } or 401); DELETE /me (204, the user is deleted).",
          files: { "server/index.js": ACCOUNT_START, "src/app/index.tsx": serverOnly("This lab is the server: see server/index.js.") },
          readOnly: ["src/app/index.tsx"],
          solution: { "server/index.js": ACCOUNT_MODEL },
          tests: [
            { label: "Registering returns a token that works for /me", check: `const r = ${post("/auth/register", "{ email: ' Ada@Example.com ', name: 'Ada', password: 'kobo1234' }")}; const { token } = await r.json(); const me = await (await fetch('https://api.example.com/me', { headers: { Authorization: 'Bearer ' + token } })).json(); return r.status === 201 && me.email === 'ada@example.com' && me.name === 'Ada';`, fail: "Insert the user, then tokens.sign({ sub: id }, SECRET)." },
            { label: "Only a hash is stored, and duplicates are refused", check: `const dup = ${post("/auth/register", "{ email: 'ADA@example.com', name: 'Ada', password: 'another123' }")}; const users = ${q("/debug/users")}; return dup.status === 409 && users.length === 1 && !users[0].password_hash.includes('kobo1234') && users[0].password_hash.length > 20;`, fail: "passwords.hash(password), and check for an existing (lower-cased) email." },
            { label: "Bad input is refused", check: `const a = ${post("/auth/register", "{ email: 'not-an-email', name: 'X', password: 'kobo1234' }")}; const b = ${post("/auth/register", "{ email: 'b@example.com', name: 'B', password: 'short' }")}; return a.status === 400 && b.status === 400;`, fail: "Validate the email, name and password length." },
            { label: "Login gives nothing away", check: `const good = ${post("/auth/login", "{ email: 'ada@example.com', password: 'kobo1234' }")}; const wrong = ${post("/auth/login", "{ email: 'ada@example.com', password: 'nope12345' }")}; const unknown = ${post("/auth/login", "{ email: 'zz@example.com', password: 'kobo1234' }")}; const m1 = (await wrong.json()).message; const m2 = (await unknown.json()).message; return good.status === 200 && wrong.status === 401 && unknown.status === 401 && m1 === 'Wrong email or password' && m1 === m2;`, fail: "One message for both failures." },
            { label: "Users can delete their account", check: `const { token } = await (${post("/auth/login", "{ email: 'ada@example.com', password: 'kobo1234' }")}).json(); const del = await fetch('https://api.example.com/me', { method: 'DELETE', headers: { Authorization: 'Bearer ' + token } }); const again = ${post("/auth/login", "{ email: 'ada@example.com', password: 'kobo1234' }")}; return del.status === 204 && again.status === 401;`, fail: "DELETE FROM users WHERE id = ? for the signed-in user." },
          ],
          hint: "userId(req) is written for you; db.get returns null when there's no row.",
          successMessage: "Register, sign in, who-am-I and delete: the account basics, done safely.",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════ LESSON 87 · 14.7 – 14.8 ═══════════════ */
  {
    id: "md-l87-crud-storage",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 4,
    covers: ["14.7", "14.8"],
    title: "CRUD and Cloud Storage",
    subtitle: "Creating, reading, updating and deleting from the app, and where files really live",
    estimatedMinutes: 55,
    intro: "With the server in place, the app's job is to change its data smoothly, and to store files somewhere better than the database.",
    atoms: [
      {
        id: "a-md-crud",
        title: "Database CRUD operations",
        explain:
          "CRUD (create, read, update, delete) from the app goes through the API, and TanStack Query's MUTATIONS manage the writes: useMutation({ mutationFn }) gives mutate, isPending and error. After a write, refresh what it changed: queryClient.invalidateQueries({ queryKey: [\"notices\"] }) refetches the list. For actions that almost always succeed (deleting, liking, ticking), make them feel instant with an OPTIMISTIC UPDATE: in onMutate, cancel in-flight fetches, save the current list, and remove the item from the cache at once; in onError, put the saved list back (the server refused); in onSettled, refetch to be sure. Show the server's reason when it refuses. Create and update usually wait for the server, so the user can see a spinner and any validation errors.",
        webLab: expoLab({
          name: "Kobo",
          layout: CRUD_LAYOUT,
          task:
            "Finish src/hooks/useNotices.ts: useCreateNotice refreshes the [\"notices\"] list after creating; useDeleteNotice removes the notice from the cached list immediately (onMutate: cancel queries, keep the previous list, remove it), restores the list if the server refuses (onError), and refetches afterwards (onSettled). Pinned notices can't be deleted: the server answers 403.",
          files: { "src/hooks/useNotices.ts": CRUD_HOOKS_START, "src/services/notices.ts": CRUD_API, "src/app/index.tsx": CRUD_SCREEN, "server/index.js": CRUD_SERVER },
          readOnly: ["src/services/notices.ts", "src/app/index.tsx", "server/index.js"],
          solution: { "src/hooks/useNotices.ts": CRUD_HOOKS_MODEL },
          tests: [
            { label: "A new notice appears after posting", check: "await waitFor(() => findAll({ testID: 'notice' }).length === 2, 3000); await typeInto('New notice', 'Football on the field at 5'); await press('Post notice'); await waitFor(() => findAll({ testID: 'notice' }).length === 3, 3000); return findAll({ testID: 'notice' })[0].textContent === 'Football on the field at 5';", fail: "onSuccess: () => queryClient.invalidateQueries({ queryKey: [\"notices\"] })" },
            { label: "Deleting is instant, before the server answers", check: "await waitFor(() => has('Lost cat: grey, answers to Biscuit'), 3000); await press({ role: 'button', name: 'Remove Lost cat: grey, answers to Biscuit' }); await wait(150); const gone = !has('Lost cat: grey, answers to Biscuit'); await wait(1200); return gone && !has('Lost cat: grey, answers to Biscuit');", fail: "setQueryData in onMutate removes it straight away." },
            { label: "A refused delete puts the notice back, with the reason", check: "await restart(); await waitFor(() => has('Water off on Saturday'), 3000); await press({ role: 'button', name: 'Remove Water off on Saturday' }); await wait(150); const hidden = !has('Water off on Saturday'); await waitFor(() => has('Water off on Saturday') && has('Pinned notices can only be removed by an admin'), 3000); return hidden;", fail: "onError: restore context.previous." },
          ],
          hint: "onMutate's return value arrives in onError as its third argument (the context).",
          successMessage: "Writes that feel instant, and stay honest when the server says no.",
        }),
      },
      {
        id: "a-md-cloud-storage",
        title: "Cloud storage for images and files",
        explain:
          "Files (photos, PDFs, videos) don't belong in the database. They go in OBJECT STORAGE (Amazon S3, Google Cloud Storage, Cloudflare R2, Firebase Storage, Supabase Storage), usually served through a CDN, and the database stores only each file's URL or key, its owner and its size. Two common flows: the app uploads to your server, which checks the file and puts it in storage (simple: this lab); or the server issues a short-lived SIGNED UPLOAD URL and the app uploads straight to storage (better for large files). Always check type and size on the server. Private files (receipts, ID documents) live in private buckets and are shown with short-lived signed READ URLs, never public links. Make thumbnails for lists, and delete stored files when their records are deleted.",
        webLab: expoLab({
          name: "Kobo",
          layout: titled("Notice"),
          task:
            "In server/index.js, write POST /notices/:id/photo: 404 for a missing notice, 400 with no file, 415 \"Photos must be JPEG or PNG\" for other types, 413 for over 5 MB; save the file's url and size in the photos table (not the file itself) and reply 201 { url }. Then make GET /notices/:id return photoUrl: the url of the notice's latest photo.",
          files: { "server/index.js": STORAGE_START, "src/app/index.tsx": STORAGE_APP },
          readOnly: ["src/app/index.tsx"],
          solution: { "server/index.js": STORAGE_MODEL },
          tests: [
            { label: "A photo is stored and shown", check: "await waitFor(() => hasText('Lost cat'), 3000); await press('Add photo'); await pickPhoto(2); await waitFor(() => exists({ testID: 'photo' }), 3000); const n = " + q("/notices/1") + "; return has('Photo added') && /^https:\\/\\/cdn\\.example\\.com\\/uploads\\//.test(n.photoUrl);", fail: "INSERT INTO photos (notice_id, url, bytes) …, then SELECT the latest in GET." },
            { label: "Other file types are refused", check: "await press('Attach a file'); await pickDocument('receipt-march.pdf'); await waitFor(() => has('Photos must be JPEG or PNG'), 3000); return true;", fail: "Check file.type against JPEG and PNG: 415." },
            { label: "Missing notices are a 404", check: "const form = new FormData(); form.append('photo', { uri: 'file:///var/mobile/Media/0001-IMG_4101.JPG', name: 'x.jpg', type: 'image/jpeg' }); const r = await fetch('https://api.example.com/notices/99/photo', { method: 'POST', body: form }); return r.status === 404;", fail: "Look the notice up first." },
          ],
          hint: "req.files[0] has type, size and url already.",
          successMessage: "Files in storage, addresses in the database: the way every app with photos works.",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },
];
