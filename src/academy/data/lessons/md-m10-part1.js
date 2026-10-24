/**
 * MOBILE APP DEVELOPMENT · MODULE 10 · CODEBASE STRUCTURE AND MAINTAINABILITY (part 1)
 *
 * Curriculum 10.1 – 10.8: UI versus logic, shared components, custom
 * hooks, a central API layer, constants and configuration, environment
 * variables, app-wide error handling, and avoiding duplicated code.
 *
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 */

import { expoLab } from "./md-helpers.js";

export const SECTION_ID = "md-s10-architecture";
export const MODULE = "md-m10-architecture";

const home = (title) => `import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "${title}" }} />
    </Stack>
  );
}
`;

/* ── 10.1 · UI versus business logic ─────────────────────────────────── */
const MONEY = `export const naira = (amount: number) => "₦" + amount.toLocaleString("en-NG");
`;
const CART_TYPES = `export type CartItem = { id: string; name: string; price: number; qty: number };
`;
const CART_SCREEN_START = `import { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import type { CartItem } from "@/types/cart";
import { naira } from "@/utils/money";

const ITEMS: CartItem[] = [
  { id: "1", name: "Ankara tote bag", price: 8500, qty: 1 },
  { id: "2", name: "Shea butter", price: 3000, qty: 3 },
];

export default function Cart() {
  const [code, setCode] = useState("");

  let subtotal = 0;
  for (const item of ITEMS) subtotal += item.price * item.qty;
  const discount = code.trim().toUpperCase() === "KOBO10" ? Math.round(subtotal * 0.1) : 0;
  const delivery = subtotal - discount >= 20000 ? 0 : 1500;
  const total = subtotal - discount + delivery;

  return (
    <View style={styles.page}>
      {ITEMS.map((item) => (
        <Text key={item.id}>
          {item.qty} × {item.name}
        </Text>
      ))}
      <TextInput placeholder="Discount code" value={code} onChangeText={setCode} style={styles.input} autoCapitalize="characters" />
      <Text>Subtotal {naira(subtotal)}</Text>
      {discount > 0 && <Text>Discount −{naira(discount)}</Text>}
      <Text>Delivery {delivery === 0 ? "Free" : naira(delivery)}</Text>
      <Text style={styles.total}>Total {naira(total)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { padding: 20, gap: 8 },
  input: { borderWidth: 1, borderColor: "#cbd5e1", borderRadius: 10, padding: 12, marginVertical: 8 },
  total: { fontSize: 20, fontWeight: "700" },
});
`;
const CART_LOGIC_MODEL = `import type { CartItem } from "@/types/cart";

const DISCOUNT_CODE = "KOBO10";
const DISCOUNT_RATE = 0.1;
const FREE_DELIVERY_FROM = 20000;
const DELIVERY_FEE = 1500;

export function cartTotals(items: CartItem[], code: string) {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const discount = code.trim().toUpperCase() === DISCOUNT_CODE ? Math.round(subtotal * DISCOUNT_RATE) : 0;
  const delivery = subtotal - discount >= FREE_DELIVERY_FROM ? 0 : DELIVERY_FEE;
  return { subtotal, discount, delivery, total: subtotal - discount + delivery };
}
`;
const CART_SCREEN_MODEL = CART_SCREEN_START.replace(
  `  let subtotal = 0;
  for (const item of ITEMS) subtotal += item.price * item.qty;
  const discount = code.trim().toUpperCase() === "KOBO10" ? Math.round(subtotal * 0.1) : 0;
  const delivery = subtotal - discount >= 20000 ? 0 : 1500;
  const total = subtotal - discount + delivery;
`,
  `  const { subtotal, discount, delivery, total } = cartTotals(ITEMS, code);
`
).replace(`import { naira } from "@/utils/money";`, `import { cartTotals } from "@/utils/cart";\nimport { naira } from "@/utils/money";`);

/* ── 10.2 · Shared components ────────────────────────────────────────── */
const SHOP_LAYOUT = `import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Shop" }} />
      <Stack.Screen name="orders" options={{ title: "Orders" }} />
      <Stack.Screen name="wishlist" options={{ title: "Wishlist" }} />
    </Stack>
  );
}
`;
const SHOP_HOME = `import { Link } from "expo-router";
import { View } from "react-native";

export default function Shop() {
  return (
    <View style={{ padding: 20, gap: 8 }}>
      <Link href="/orders" style={{ fontSize: 16, paddingVertical: 12 }}>My orders</Link>
      <Link href="/wishlist" style={{ fontSize: 16, paddingVertical: 12 }}>My wishlist</Link>
    </View>
  );
}
`;
const ORDERS_START = `import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function Orders() {
  return (
    <View style={styles.box}>
      <Text style={styles.title}>No orders yet</Text>
      <Text style={styles.message}>Your orders will appear here.</Text>
      <Pressable accessibilityRole="button" onPress={() => router.navigate("/")} style={styles.button}>
        <Text style={styles.buttonText}>Start shopping</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  box: { flex: 1, alignItems: "center", justifyContent: "center", padding: 32, gap: 8 },
  title: { fontSize: 20, fontWeight: "700" },
  message: { fontSize: 15, color: "#64748b", textAlign: "center" },
  button: { marginTop: 12, minHeight: 48, paddingHorizontal: 20, borderRadius: 12, backgroundColor: "#0f766e", justifyContent: "center" },
  buttonText: { color: "#fff", fontWeight: "700" },
});
`;
const WISHLIST_START = `import { StyleSheet, Text, View } from "react-native";

export default function Wishlist() {
  return (
    <View style={styles.box}>
      <Text style={styles.title}>Your wishlist is empty</Text>
      <Text style={styles.message}>Tap the heart on a product to save it.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: { flex: 1, alignItems: "center", justifyContent: "center", padding: 32, gap: 8 },
  title: { fontSize: 20, fontWeight: "700" },
  message: { fontSize: 15, color: "#64748b", textAlign: "center" },
});
`;
const EMPTY_STATE_MODEL = `import { Pressable, StyleSheet, Text, View } from "react-native";

type Props = {
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function EmptyState({ title, message, actionLabel, onAction }: Props) {
  return (
    <View style={styles.box}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
      {actionLabel && onAction ? (
        <Pressable accessibilityRole="button" onPress={onAction} style={styles.button}>
          <Text style={styles.buttonText}>{actionLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  box: { flex: 1, alignItems: "center", justifyContent: "center", padding: 32, gap: 8 },
  title: { fontSize: 20, fontWeight: "700" },
  message: { fontSize: 15, color: "#64748b", textAlign: "center" },
  button: { marginTop: 12, minHeight: 48, paddingHorizontal: 20, borderRadius: 12, backgroundColor: "#0f766e", justifyContent: "center" },
  buttonText: { color: "#fff", fontWeight: "700" },
});
`;
const ORDERS_MODEL = `import { router } from "expo-router";
import { EmptyState } from "@/components/EmptyState";

export default function Orders() {
  return <EmptyState title="No orders yet" message="Your orders will appear here." actionLabel="Start shopping" onAction={() => router.navigate("/")} />;
}
`;
const WISHLIST_MODEL = `import { EmptyState } from "@/components/EmptyState";

export default function Wishlist() {
  return <EmptyState title="Your wishlist is empty" message="Tap the heart on a product to save it." />;
}
`;

/* ── 10.3 · Custom hooks ─────────────────────────────────────────────── */
const ONLINE_LAYOUT = `import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Shop" }} />
      <Stack.Screen name="cart" options={{ title: "Cart" }} />
    </Stack>
  );
}
`;
const ONLINE_HOME_START = `import NetInfo from "@react-native-community/netinfo";
import { Link } from "expo-router";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";

export default function Shop() {
  const [online, setOnline] = useState(true);
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => setOnline(state.isConnected !== false));
    return unsubscribe;
  }, []);

  return (
    <View style={{ padding: 20, gap: 12 }}>
      {!online && <Text style={{ backgroundColor: "#fef3c7", padding: 12 }}>You're offline</Text>}
      <Text style={{ fontSize: 20 }}>Today's deals</Text>
      <Link href="/cart" style={{ fontSize: 16, paddingVertical: 12 }}>Go to cart</Link>
    </View>
  );
}
`;
const ONLINE_CART_START = `import NetInfo from "@react-native-community/netinfo";
import { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";

export default function Cart() {
  const [online, setOnline] = useState(true);
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => setOnline(state.isConnected !== false));
    return unsubscribe;
  }, []);

  return (
    <View style={{ padding: 20, gap: 12 }}>
      {!online && <Text style={{ backgroundColor: "#fef3c7", padding: 12 }}>You're offline</Text>}
      <Pressable accessibilityRole="button" disabled={!online} style={{ minHeight: 48, justifyContent: "center", opacity: online ? 1 : 0.5 }}>
        <Text>Place order</Text>
      </Pressable>
    </View>
  );
}
`;
const USE_ONLINE_MODEL = `import NetInfo from "@react-native-community/netinfo";
import { useEffect, useState } from "react";

/** true while the phone has a network connection. */
export function useOnline() {
  const [online, setOnline] = useState(true);
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => setOnline(state.isConnected !== false));
    return unsubscribe;
  }, []);
  return online;
}
`;
const ONLINE_HOME_MODEL = `import { Link } from "expo-router";
import { Text, View } from "react-native";
import { useOnline } from "@/hooks/useOnline";

export default function Shop() {
  const online = useOnline();
  return (
    <View style={{ padding: 20, gap: 12 }}>
      {!online && <Text style={{ backgroundColor: "#fef3c7", padding: 12 }}>You're offline</Text>}
      <Text style={{ fontSize: 20 }}>Today's deals</Text>
      <Link href="/cart" style={{ fontSize: 16, paddingVertical: 12 }}>Go to cart</Link>
    </View>
  );
}
`;
const ONLINE_CART_MODEL = `import { Pressable, Text, View } from "react-native";
import { useOnline } from "@/hooks/useOnline";

export default function Cart() {
  const online = useOnline();
  return (
    <View style={{ padding: 20, gap: 12 }}>
      {!online && <Text style={{ backgroundColor: "#fef3c7", padding: 12 }}>You're offline</Text>}
      <Pressable accessibilityRole="button" disabled={!online} style={{ minHeight: 48, justifyContent: "center", opacity: online ? 1 : 0.5 }}>
        <Text>Place order</Text>
      </Pressable>
    </View>
  );
}
`;

/* ── 10.4 · A central API layer ──────────────────────────────────────── */
const TASK_TYPE = `export type Task = { id: string; title: string; done: boolean };
`;
const TASK_SERVER = `import { createServer } from "practice-server";

const app = createServer();
const tasks = [
  { id: "1", title: "Order fabric", done: false },
  { id: "2", title: "Call the tailor", done: true },
];

app.get("/tasks", (req, res) => res.json(tasks));

app.get("/tasks/:id", (req, res) => {
  const task = tasks.find((t) => t.id === req.params.id);
  if (!task) return res.status(404).json({ message: "Task not found" });
  res.json(task);
});

app.post("/tasks", (req, res) => {
  if (!req.body || !req.body.title) return res.status(400).json({ message: "A title is required" });
  const task = { id: String(tasks.length + 1), title: req.body.title, done: false };
  tasks.push(task);
  res.status(201).json(task);
});

export default app;
`;
const TASK_LIST_SCREEN = `import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { getTasks } from "@/services/tasks";
import type { Task } from "@/types/task";

export default function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [error, setError] = useState("");
  useEffect(() => {
    getTasks().then(setTasks, (e: Error) => setError(e.message));
  }, []);
  return (
    <View style={{ padding: 20, gap: 8 }}>
      {error ? <Text>{error}</Text> : null}
      {tasks.map((t) => (
        <Text key={t.id} testID="task">
          {t.done ? "✓ " : "○ "}
          {t.title}
        </Text>
      ))}
    </View>
  );
}
`;
const API_MODEL = `const API_URL = "https://api.example.com";

/** An error the server answered with: its HTTP status and its message. */
export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

type Options = { method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE"; body?: unknown };

export async function request<T>(path: string, { method = "GET", body }: Options = {}): Promise<T> {
  const response = await fetch(API_URL + path, {
    method,
    headers: { Accept: "application/json", "Content-Type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const data = await response.json().catch(() => null);
  if (!response.ok) throw new ApiError(response.status, data?.message ?? "Request failed (" + response.status + ")");
  return data as T;
}
`;
const TASKS_SERVICE_MODEL = `import { request } from "@/services/api";
import type { Task } from "@/types/task";

export const getTasks = () => request<Task[]>("/tasks");

export const getTask = (id: string) => request<Task>("/tasks/" + id);

export const createTask = (title: string) => request<Task>("/tasks", { method: "POST", body: { title } });
`;

/* ── 10.5 · Constants and configuration ──────────────────────────────── */
const HELP_START = `import * as Linking from "expo-linking";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function Help() {
  return (
    <View style={styles.page}>
      <Text style={styles.title}>Need help?</Text>
      <Text style={styles.body}>We reply within a day: support@kobo.example</Text>
      <Pressable testID="contact" accessibilityRole="button" onPress={() => Linking.openURL("mailto:support@kobo.example")} style={styles.button}>
        <Text style={styles.buttonText}>Email support</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { padding: 16, gap: 8 },
  title: { fontSize: 22, fontWeight: "700", color: "#0f172a" },
  body: { fontSize: 15, color: "#64748b" },
  button: { minHeight: 48, borderRadius: 12, backgroundColor: "#0f766e", justifyContent: "center", alignItems: "center", marginTop: 16 },
  buttonText: { color: "#fff", fontWeight: "700" },
});
`;
const THEME_MODEL = `export const colors = {
  primary: "#0f766e",
  text: "#0f172a",
  muted: "#64748b",
  onPrimary: "#ffffff",
};

export const spacing = { sm: 8, md: 16, lg: 24 };
`;
const CONFIG_MODEL = `export const SUPPORT_EMAIL = "support@kobo.example";
`;
const HELP_MODEL = `import * as Linking from "expo-linking";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SUPPORT_EMAIL } from "@/constants/config";
import { colors, spacing } from "@/constants/theme";

export default function Help() {
  return (
    <View style={styles.page}>
      <Text style={styles.title}>Need help?</Text>
      <Text style={styles.body}>We reply within a day: {SUPPORT_EMAIL}</Text>
      <Pressable testID="contact" accessibilityRole="button" onPress={() => Linking.openURL("mailto:" + SUPPORT_EMAIL)} style={styles.button}>
        <Text style={styles.buttonText}>Email support</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { padding: spacing.md, gap: spacing.sm },
  title: { fontSize: 22, fontWeight: "700", color: colors.text },
  body: { fontSize: 15, color: colors.muted },
  button: { minHeight: 48, borderRadius: 12, backgroundColor: colors.primary, justifyContent: "center", alignItems: "center", marginTop: spacing.md },
  buttonText: { color: colors.onPrimary, fontWeight: "700" },
});
`;

/* ── 10.6 · Environment variables ────────────────────────────────────── */
const ENV_CONFIG_START = `export const API_URL = "https://api.kobo.example";

// Used to verify payments with Paystack.
export const PAYSTACK_SECRET_KEY = "sk_live_51Hc2fQ8kobo";
`;
const ENV_CONFIG_MODEL = `export const API_URL = process.env.EXPO_PUBLIC_API_URL;
`;
const ENV_SCREEN = `import { Text, View } from "react-native";
import { API_URL } from "@/constants/config";

export default function About() {
  return (
    <View style={{ padding: 20 }}>
      <Text>API: {API_URL}</Text>
    </View>
  );
}
`;

/* ── 10.7 · App-wide errors ──────────────────────────────────────────── */
const ORDERS_DATA = `export type Order = { id: string; items: string[] };

// Order 8 arrived from the server without its items: the kind of data bug apps meet.
export const ORDERS = [
  { id: "7", items: ["Ankara tote bag", "Shea butter"] },
  { id: "8" },
] as unknown as Order[];
`;
const ERR_LAYOUT_START = `import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Orders" }} />
      <Stack.Screen name="orders/[id]" options={{ title: "Order" }} />
    </Stack>
  );
}
`;
const ERR_LAYOUT_MODEL = `import { Stack, type ErrorBoundaryProps } from "expo-router";
import { useEffect } from "react";
import { Pressable, Text, View } from "react-native";
import { reportError } from "@/services/errors";

export function ErrorBoundary({ error, retry }: ErrorBoundaryProps) {
  useEffect(() => {
    reportError(error);
  }, [error]);
  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 24, gap: 12 }}>
      <Text style={{ fontSize: 22, fontWeight: "700" }}>Something went wrong</Text>
      <Text>{error.message}</Text>
      <Pressable accessibilityRole="button" onPress={retry} style={{ minHeight: 48, justifyContent: "center" }}>
        <Text>Try again</Text>
      </Pressable>
    </View>
  );
}

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Orders" }} />
      <Stack.Screen name="orders/[id]" options={{ title: "Order" }} />
    </Stack>
  );
}
`;
const ERR_LIST = `import { Link } from "expo-router";
import { View } from "react-native";
import { ORDERS } from "@/data/orders";

export default function Orders() {
  return (
    <View style={{ padding: 16 }}>
      {ORDERS.map((o) => (
        <Link key={o.id} href={"/orders/" + o.id} style={{ padding: 14, fontSize: 16 }}>
          Order #{o.id}
        </Link>
      ))}
    </View>
  );
}
`;
const ERR_DETAIL = `import { useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";
import { ORDERS } from "@/data/orders";

export default function Order() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const order = ORDERS.find((o) => o.id === id)!;
  return (
    <View style={{ padding: 20, gap: 6 }}>
      <Text style={{ fontSize: 20 }}>Order #{order.id}</Text>
      {order.items.map((item) => (
        <Text key={item}>{item}</Text>
      ))}
    </View>
  );
}
`;
const ERR_SERVICE = `// In a real app this sends the error to a crash reporter such as Sentry (Module 17).
export function reportError(error: Error) {
  console.error("[report] " + error.message);
}
`;

/* ── 10.8 · Avoiding duplication ─────────────────────────────────────── */
const DATES_DATA = `export type Order = { id: string; title: string; orderedAt: string; deliveredAt: string };

export const ORDERS: Order[] = [
  { id: "7", title: "Ankara tote bag", orderedAt: "2026-10-03T12:00:00Z", deliveredAt: "2026-10-06T12:00:00Z" },
];
`;
const DATES_LAYOUT = `import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Orders" }} />
      <Stack.Screen name="order/[id]" options={{ title: "Order" }} />
    </Stack>
  );
}
`;
const DATES_LIST_START = `import { Link } from "expo-router";
import { Text, View } from "react-native";
import { ORDERS } from "@/data/orders";

export default function Orders() {
  return (
    <View style={{ padding: 16 }}>
      {ORDERS.map((o) => (
        <Link key={o.id} href={"/order/" + o.id} style={{ padding: 14 }}>
          <Text>
            {o.title} · Ordered {new Date(o.orderedAt).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })}
          </Text>
        </Link>
      ))}
    </View>
  );
}
`;
const DATES_DETAIL_START = `import { useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";
import { Receipt } from "@/components/Receipt";
import { ORDERS } from "@/data/orders";

export default function OrderDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const order = ORDERS.find((o) => o.id === id);
  if (!order) return <Text>Order not found</Text>;
  return (
    <View style={{ padding: 20, gap: 6 }}>
      <Text style={{ fontSize: 20 }}>{order.title}</Text>
      <Text>Ordered {new Date(order.orderedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</Text>
      <Receipt order={order} />
    </View>
  );
}
`;
const RECEIPT_START = `import { Text } from "react-native";
import type { Order } from "@/data/orders";

export function Receipt({ order }: { order: Order }) {
  return <Text>Delivered {new Date(order.deliveredAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</Text>;
}
`;
const DATE_UTIL_MODEL = `/** "2026-10-03T12:00:00Z" → "3 Oct 2026", the app's one date format. */
export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}
`;
const DATES_LIST_MODEL = `import { Link } from "expo-router";
import { Text, View } from "react-native";
import { ORDERS } from "@/data/orders";
import { formatDate } from "@/utils/date";

export default function Orders() {
  return (
    <View style={{ padding: 16 }}>
      {ORDERS.map((o) => (
        <Link key={o.id} href={"/order/" + o.id} style={{ padding: 14 }}>
          <Text>
            {o.title} · Ordered {formatDate(o.orderedAt)}
          </Text>
        </Link>
      ))}
    </View>
  );
}
`;
const DATES_DETAIL_MODEL = `import { useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";
import { Receipt } from "@/components/Receipt";
import { ORDERS } from "@/data/orders";
import { formatDate } from "@/utils/date";

export default function OrderDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const order = ORDERS.find((o) => o.id === id);
  if (!order) return <Text>Order not found</Text>;
  return (
    <View style={{ padding: 20, gap: 6 }}>
      <Text style={{ fontSize: 20 }}>{order.title}</Text>
      <Text>Ordered {formatDate(order.orderedAt)}</Text>
      <Receipt order={order} />
    </View>
  );
}
`;
const RECEIPT_MODEL = `import { Text } from "react-native";
import type { Order } from "@/data/orders";
import { formatDate } from "@/utils/date";

export function Receipt({ order }: { order: Order }) {
  return <Text>Delivered {formatDate(order.deliveredAt)}</Text>;
}
`;

export const PART1 = [
  /* ═══════════════ LESSON 56 · 10.1 – 10.2 ═══════════════ */
  {
    id: "md-l56-ui-logic",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 1,
    covers: ["10.1", "10.2"],
    title: "Separating UI from Logic, and Shared Components",
    subtitle: "Screens that only draw, rules that live in one place",
    estimatedMinutes: 50,
    intro: "An app that works is half the job; an app that is easy to change is the other half. This module is about the second half: where code goes, so you and your team can find it, test it and change it safely.",
    atoms: [
      {
        id: "a-md-ui-logic",
        title: "Separating UI from business logic",
        explain:
          "BUSINESS LOGIC is the app's rules: how a total is calculated, when delivery is free, which discount codes work. UI is how it looks and reacts. Mixed together inside a screen, the rules can only be tested by rendering the screen, are copied when another screen needs them, and hide among styles. Move them into plain TypeScript functions (src/utils/ or a feature folder): they take data, return data, and know nothing about React. Name the magic numbers as constants (FREE_DELIVERY_FROM = 20000) while you are there. The screen then calls the function and draws the result. Rule of thumb: if you could explain it without mentioning the screen, it is logic.",
        webLab: expoLab({
          name: "Kobo",
          layout: home("Cart"),
          task:
            "Move the cart's rules out of the screen. Write cartTotals(items, code) in src/utils/cart.ts returning { subtotal, discount, delivery, total } (KOBO10, in any case and with spaces around it, takes 10% off; delivery is ₦1,500, or free when the subtotal after the discount is ₦20,000 or more), and make the screen call it. Name the numbers as constants in cart.ts.",
          files: {
            "src/app/index.tsx": CART_SCREEN_START,
            "src/utils/cart.ts": "",
            "src/utils/money.ts": MONEY,
            "src/types/cart.ts": CART_TYPES,
          },
          readOnly: ["src/utils/money.ts", "src/types/cart.ts"],
          solution: { "src/utils/cart.ts": CART_LOGIC_MODEL, "src/app/index.tsx": CART_SCREEN_MODEL },
          tests: [
            { label: "cartTotals follows every rule", check: "const { cartTotals } = load('src/utils/cart.ts'); const items = [{ id: '1', name: 'a', price: 8500, qty: 1 }, { id: '2', name: 'b', price: 3000, qty: 3 }]; const a = cartTotals(items, ''); const b = cartTotals(items, ' kobo10 '); const c = cartTotals([{ id: '3', name: 'c', price: 25000, qty: 1 }], 'KOBO10'); return a.subtotal === 17500 && a.discount === 0 && a.delivery === 1500 && a.total === 19000 && b.discount === 1750 && b.total === 17250 && c.discount === 2500 && c.delivery === 0 && c.total === 22500;", fail: "Subtotal, then the discount, then delivery from the discounted amount." },
            { label: "The screen still shows the totals", check: "await waitFor(() => has('Total ₦19,000'), 2000); await typeInto('Discount code', 'KOBO10'); await waitFor(() => has('Total ₦17,250'), 2000); return has('Discount −₦1,750');", fail: "const { subtotal, discount, delivery, total } = cartTotals(ITEMS, code);" },
            { label: "The rules are gone from the screen", check: "const c = code('src/app/index.tsx'); return c.includes('cartTotals') && !c.includes('KOBO10') && !c.includes('20000') && !c.includes('0.1');", fail: "The screen calls cartTotals; the rules live in src/utils/cart.ts." },
            { label: "The numbers have names", check: "const c = code('src/utils/cart.ts'); return /const [A-Z_]+ = 20000/.test(c) && /const [A-Z_]+ = 1500/.test(c);", fail: "const FREE_DELIVERY_FROM = 20000; const DELIVERY_FEE = 1500;" },
          ],
          hint: "Copy the five lines of rules into a function, return an object, and replace them in the screen with one call.",
          successMessage: "The rules can now be tested without a screen, and reused by checkout.",
        }),
      },
      {
        id: "a-md-shared-components",
        title: "Building shared components",
        explain:
          "When two screens draw the same thing, make it a component in src/components/ with PROPS for what differs: <EmptyState title message actionLabel onAction />. Good shared components have a small, typed props list, sensible defaults, optional parts that simply don't render when their props are missing, and no knowledge of any particular screen (they receive onAction rather than calling router themselves). Then a design change, such as rounder buttons or a new font, is one edit. Don't make everything generic in advance: share a component once two or three screens truly need it.",
        webLab: expoLab({
          name: "Kobo",
          layout: SHOP_LAYOUT,
          task:
            "Both screens draw the same empty state. Write EmptyState in src/components/EmptyState.tsx (a named export with props title, message, and optional actionLabel and onAction: the button only appears when both are given), then rewrite Orders and Wishlist to use it.",
          files: {
            "src/components/EmptyState.tsx": "",
            "src/app/orders.tsx": ORDERS_START,
            "src/app/wishlist.tsx": WISHLIST_START,
            "src/app/index.tsx": SHOP_HOME,
          },
          readOnly: ["src/app/index.tsx"],
          solution: { "src/components/EmptyState.tsx": EMPTY_STATE_MODEL, "src/app/orders.tsx": ORDERS_MODEL, "src/app/wishlist.tsx": WISHLIST_MODEL },
          tests: [
            { label: "Orders shows its empty state, and its button goes home", check: "await navigate('/orders'); await waitFor(() => has('No orders yet'), 2000); const ok = has('Your orders will appear here.'); await press('Start shopping'); return ok && path() === '/';", fail: "<EmptyState title=… message=… actionLabel=\"Start shopping\" onAction={…} />" },
            { label: "Wishlist shows its empty state with no button", check: "await navigate('/wishlist'); await waitFor(() => has('Your wishlist is empty'), 2000); return has('Tap the heart on a product to save it.') && !has('Start shopping') && findAll({ role: 'button', name: /shopping|save/i }).length === 0;", fail: "Render the button only when actionLabel and onAction are both given." },
            { label: "Both screens use the shared component, and keep no styles of their own", check: "const a = code('src/app/orders.tsx'); const b = code('src/app/wishlist.tsx'); return a.includes('EmptyState') && b.includes('EmptyState') && !a.includes('StyleSheet') && !b.includes('StyleSheet') && typeof load('src/components/EmptyState.tsx').EmptyState === 'function';", fail: "export function EmptyState(…), imported by both screens." },
          ],
          hint: "Start from the Orders markup: replace each text with a prop.",
          successMessage: "One empty state for the whole app.",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════ LESSON 57 · 10.3 – 10.4 ═══════════════ */
  {
    id: "md-l57-hooks-api",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 2,
    covers: ["10.3", "10.4"],
    title: "Custom Hooks and a Central API Layer",
    subtitle: "Reusable stateful logic, and one place that talks to the server",
    estimatedMinutes: 55,
    intro: "Components share markup; hooks share behaviour; and an API layer means the app talks to its server in exactly one way.",
    atoms: [
      {
        id: "a-md-custom-hooks",
        title: "Creating custom hooks",
        explain:
          "A CUSTOM HOOK is a function whose name starts with use and which calls other hooks. It packages stateful logic (state, effects, subscriptions) so any component can use it with one line: const online = useOnline(). Each component that calls it gets its own state; the hook shares the logic, not the data (Module 11 shares data). Write one when two components repeat the same useState + useEffect pattern, or when a screen's logic is hard to read. The rules of hooks apply inside it too: call hooks at the top level, never in conditions, and clean up subscriptions in the effect's return.",
        webLab: expoLab({
          name: "Kobo",
          layout: ONLINE_LAYOUT,
          task:
            "Both screens repeat the same NetInfo subscription. Write useOnline() in src/hooks/useOnline.ts (returning true while connected, and unsubscribing on unmount), and use it in both screens instead.",
          files: {
            "src/hooks/useOnline.ts": "",
            "src/app/index.tsx": ONLINE_HOME_START,
            "src/app/cart.tsx": ONLINE_CART_START,
          },
          solution: { "src/hooks/useOnline.ts": USE_ONLINE_MODEL, "src/app/index.tsx": ONLINE_HOME_MODEL, "src/app/cart.tsx": ONLINE_CART_MODEL },
          tests: [
            { label: "Going offline shows the banner on the home screen", check: "await waitFor(() => has(\"Today's deals\"), 2000); await setOnline(false); await waitFor(() => has(\"You're offline\"), 2000); await setOnline(true); await waitFor(() => !has(\"You're offline\"), 2000); return true;", fail: "useOnline follows NetInfo's events." },
            { label: "The cart reacts too, and disables ordering offline", check: "await setOnline(true); await navigate('/cart'); await waitFor(() => has('Place order'), 2000); await setOnline(false); await waitFor(() => has(\"You're offline\"), 2000); const off = disabled({ role: 'button', name: 'Place order' }); await setOnline(true); return off;", fail: "Use the hook in cart.tsx." },
            { label: "Both screens use the hook; neither talks to NetInfo", check: "const a = code('src/app/index.tsx'); const b = code('src/app/cart.tsx'); return a.includes('useOnline()') && b.includes('useOnline()') && !a.includes('NetInfo') && !b.includes('NetInfo') && typeof load('src/hooks/useOnline.ts').useOnline === 'function';", fail: "Move the subscription into export function useOnline()." },
            { label: "The hook cleans up its subscription", check: "const c = code('src/hooks/useOnline.ts'); return /return\\s+unsubscribe|return\\s*\\(\\)\\s*=>|=>\\s*NetInfo\\.addEventListener/.test(c);", fail: "Return the unsubscribe function from the effect." },
          ],
          hint: "Cut the useState and useEffect out of a screen, paste them into the hook, and return online.",
          successMessage: "One hook, used by every screen that cares about the network.",
        }),
      },
      {
        id: "a-md-api-layer",
        title: "Centralizing API calls",
        explain:
          "Scattered fetch calls each repeat the base URL, the headers, the JSON parsing and (usually forgotten) the error handling. Instead write ONE request function in src/services/api.ts that adds the base URL and headers, sends bodies as JSON, and turns a failed response into an error that carries the server's status and message (fetch itself only rejects when there is no network; a 404 or 500 still RESOLVES, with response.ok false). Then one small service per resource (src/services/tasks.ts: getTasks, getTask, createTask) uses it, and screens only call services. Adding a sign-in token later (Module 15) becomes a one-line change in request().",
        webLab: expoLab({
          name: "Tasks",
          layout: home("Tasks"),
          task:
            "Write the API layer. In src/services/api.ts: request<T>(path, { method, body }) calling https://api.example.com + path with JSON headers and a JSON body, returning the parsed JSON, and throwing an ApiError (an Error subclass with name \"ApiError\", a status, and the server's message) when response.ok is false. In src/services/tasks.ts: getTasks(), getTask(id) and createTask(title), using request. The screen already calls getTasks.",
          files: {
            "src/services/api.ts": "",
            "src/services/tasks.ts": "",
            "src/app/index.tsx": TASK_LIST_SCREEN,
            "src/types/task.ts": TASK_TYPE,
            "server/index.js": TASK_SERVER,
          },
          readOnly: ["src/app/index.tsx", "src/types/task.ts", "server/index.js"],
          solution: { "src/services/api.ts": API_MODEL, "src/services/tasks.ts": TASKS_SERVICE_MODEL },
          tests: [
            { label: "The screen lists the server's tasks", check: "await waitFor(() => hasText('Order fabric'), 3000); return has('○ Order fabric') && has('✓ Call the tailor');", fail: "getTasks = () => request<Task[]>(\"/tasks\")" },
            { label: "createTask posts JSON and returns the new task", check: "const t = await load('src/services/tasks.ts').createTask('Buy buttons'); const r = serverRequests().filter((x) => x.method === 'POST').pop(); return t.title === 'Buy buttons' && !!t.id && /json/.test(r.headers['content-type'] || '') && r.body.title === 'Buy buttons';", fail: "method \"POST\", the Content-Type header, and JSON.stringify(body)." },
            { label: "A 404 becomes an ApiError with the server's message", check: "try { await load('src/services/tasks.ts').getTask('99'); return false; } catch (e) { return e.name === 'ApiError' && e.status === 404 && e.message === 'Task not found'; }", fail: "if (!response.ok) throw new ApiError(response.status, data.message)" },
            { label: "A 400 does too", check: "try { await load('src/services/api.ts').request('/tasks', { method: 'POST', body: {} }); return false; } catch (e) { return e.status === 400 && e.message === 'A title is required'; }", fail: "Read the message from the server's JSON." },
          ],
          hint: "fetch only rejects with no network; check response.ok yourself.",
          successMessage: "Every request now goes through one function: one place for URLs, headers, errors and, later, tokens.",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════ LESSON 58 · 10.5 – 10.6 ═══════════════ */
  {
    id: "md-l58-config-env",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 3,
    covers: ["10.5", "10.6"],
    title: "Constants, Configuration and Environment Variables",
    subtitle: "Values with names, and settings that change between builds",
    estimatedMinutes: 45,
    intro: "Colours, sizes, e-mail addresses and server URLs belong in one place each, and secrets do not belong in the app at all.",
    atoms: [
      {
        id: "a-md-constants",
        title: "Managing constants and configuration",
        explain:
          "Repeated values (the brand colour, spacing steps, the support e-mail, page sizes, timeouts) go in src/constants/: theme.ts for design tokens (colors, spacing, radii, font sizes) and config.ts for app settings. Screens import them by name, so a rebrand is one edit and nobody types #0f766e from memory with a typo. The Expo template already does this for its theme colours (src/constants/theme.ts). Keep each constants file small and grouped by purpose; values that differ between development and production builds are environment variables instead (next).",
        webLab: expoLab({
          name: "Kobo",
          layout: home("Help"),
          task:
            "Take the hard-coded values out of the Help screen. In src/constants/theme.ts export colors (primary \"#0f766e\", text \"#0f172a\", muted \"#64748b\", onPrimary) and spacing (sm 8, md 16, lg 24); in src/constants/config.ts export SUPPORT_EMAIL (\"support@kobo.example\"). Use them in the screen, so changing colors.primary recolours the button.",
          files: {
            "src/app/index.tsx": HELP_START,
            "src/constants/theme.ts": "",
            "src/constants/config.ts": "",
          },
          solution: { "src/app/index.tsx": HELP_MODEL, "src/constants/theme.ts": THEME_MODEL, "src/constants/config.ts": CONFIG_MODEL },
          tests: [
            { label: "The constants exist with the right values", check: "const t = load('src/constants/theme.ts'); const c = load('src/constants/config.ts'); return t.colors.primary === '#0f766e' && t.colors.muted === '#64748b' && t.spacing.md === 16 && c.SUPPORT_EMAIL === 'support@kobo.example';", fail: "export const colors = { … }; export const spacing = { … }; export const SUPPORT_EMAIL = …" },
            { label: "The screen still looks and works the same", check: "await waitFor(() => has('support@kobo.example'), 2000); return styleOf({ testID: 'contact' }).backgroundColor === '#0f766e';", fail: "backgroundColor: colors.primary" },
            { label: "Changing the brand colour in theme.ts recolours the button", swap: { "src/constants/theme.ts": "export const colors = { primary: \"#7c3aed\", text: \"#0f172a\", muted: \"#64748b\", onPrimary: \"#ffffff\" };\nexport const spacing = { sm: 8, md: 16, lg: 24 };\n" }, check: "await waitFor(() => has('Email support'), 2000); return styleOf({ testID: 'contact' }).backgroundColor === '#7c3aed';", fail: "The screen must read colors.primary rather than repeat the hex code." },
            { label: "No hard-coded colours or e-mail address are left in the screen", check: "const c = code('src/app/index.tsx'); return !/#[0-9a-f]{3,6}/i.test(c) && !c.includes('support@');", fail: "Every colour from colors, and the address from SUPPORT_EMAIL." },
          ],
          hint: "\"mailto:\" + SUPPORT_EMAIL builds the link.",
          successMessage: "A rebrand is now a one-line change.",
        }),
      },
      {
        id: "a-md-env-variables",
        title: "Using environment variables correctly",
        explain:
          "Settings that differ between development, staging and production (API URLs, feature flags, a public analytics key) are ENVIRONMENT VARIABLES. Expo loads them from .env files in the project root (.env, then .env.local, which the template's .gitignore keeps out of Git, wins), and only variables named EXPO_PUBLIC_… reach your app's code, as process.env.EXPO_PUBLIC_API_URL (written out in full: Expo replaces it with its value when bundling). Restart npx expo start after editing .env. The crucial rule: everything in the app's bundle can be read by anyone who downloads it, so EXPO_PUBLIC_ is for PUBLIC values only. A secret key (a payment provider's secret, a database password) must never be in the app at all: it lives on your server, which the app calls. For cloud builds, set the variables in EAS (Module 20).",
        webLab: expoLab({
          name: "Kobo",
          layout: home("About"),
          task:
            "Point this build at the staging API with an environment variable: in .env set EXPO_PUBLIC_API_URL to https://staging-api.kobo.example, and make config.ts read it from process.env. Then deal with the payment provider's secret key in config.ts: it must not be in the app at all (not in config.ts, and not in .env either, where it would be bundled or committed).",
          files: {
            ".env": "# Public settings for this build. Only EXPO_PUBLIC_ variables reach the app.\n",
            "src/constants/config.ts": ENV_CONFIG_START,
            "src/app/index.tsx": ENV_SCREEN,
          },
          readOnly: ["src/app/index.tsx"],
          solution: {
            ".env": "# Public settings for this build. Only EXPO_PUBLIC_ variables reach the app.\nEXPO_PUBLIC_API_URL=https://staging-api.kobo.example\n",
            "src/constants/config.ts": ENV_CONFIG_MODEL,
          },
          tests: [
            { label: "The app uses the URL from .env", check: "await waitFor(() => has('API:'), 2000); return has('API: https://staging-api.kobo.example');", fail: "EXPO_PUBLIC_API_URL=https://staging-api.kobo.example in .env, read with process.env.EXPO_PUBLIC_API_URL." },
            { label: "config.ts reads it, without repeating the URL", check: "const c = code('src/constants/config.ts'); return c.includes('process.env.EXPO_PUBLIC_API_URL') && !c.includes('kobo.example');", fail: "export const API_URL = process.env.EXPO_PUBLIC_API_URL;" },
            { label: "The secret key is out of the app", check: "return !code('src/constants/config.ts').includes('sk_live') && !code('.env').includes('sk_live') && !code('src/constants/config.ts').includes('PAYSTACK_SECRET');", fail: "Delete it: payments are verified by your server, which keeps the secret." },
          ],
          hint: "process.env.EXPO_PUBLIC_API_URL must be written out in full; Expo replaces it when bundling.",
          successMessage: "Settings per build, and no secrets in the bundle.",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════ LESSON 59 · 10.7 – 10.8 ═══════════════ */
  {
    id: "md-l59-errors-dry",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 4,
    covers: ["10.7", "10.8"],
    title: "App-Wide Errors and Avoiding Duplication",
    subtitle: "Failing gracefully, and fixing each thing in one place",
    estimatedMinutes: 50,
    intro: "Every app meets bad data and bugs in production. A good one shows a calm screen and reports the problem; it doesn't vanish.",
    atoms: [
      {
        id: "a-md-error-boundary",
        title: "Handling application-wide errors",
        explain:
          "When a component throws while rendering, React unmounts the whole tree: in a release build, the app closes or shows a blank screen. An ERROR BOUNDARY catches it and shows a fallback instead. Expo Router makes one easy: export function ErrorBoundary({ error, retry }: ErrorBoundaryProps) from any route or layout file; exported from the root layout, it covers the whole app. Show a friendly message and a Try again button (retry re-renders), and report the error (a crash reporter such as Sentry, Module 17). Boundaries only catch errors while rendering: errors in event handlers and async code (a failed fetch) must be caught with try/catch and shown as error states (Module 11).",
        webLab: expoLab({
          name: "Kobo",
          layout: ERR_LAYOUT_START,
          editable: ["src/app/_layout.tsx"],
          task:
            "Order #8 crashes the app. In the root layout, export an ErrorBoundary that shows \"Something went wrong\", the error's message and a \"Try again\" button that calls retry, and that passes the error to reportError() (from src/services/errors.ts) once.",
          files: {
            "src/app/index.tsx": ERR_LIST,
            "src/app/orders/[id].tsx": ERR_DETAIL,
            "src/data/orders.ts": ORDERS_DATA,
            "src/services/errors.ts": ERR_SERVICE,
          },
          readOnly: ["src/app/index.tsx", "src/app/orders/[id].tsx", "src/data/orders.ts", "src/services/errors.ts"],
          open: "src/app/_layout.tsx",
          solution: { "src/app/_layout.tsx": ERR_LAYOUT_MODEL },
          tests: [
            { label: "A good order still opens", check: "await waitFor(() => has('Order #7'), 2000); await press('Order #7'); await waitFor(() => has('Shea butter'), 2000); return !has('Something went wrong');", fail: "Only failures should reach the boundary." },
            { label: "The broken order shows the fallback, not a crash", check: "await restart(); await waitFor(() => has('Order #8'), 2000); await press('Order #8'); await waitFor(() => has('Something went wrong'), 2000); return hasText(\"reading 'map'\") && find({ role: 'button', name: 'Try again' }) != null;", fail: "export function ErrorBoundary({ error, retry }: ErrorBoundaryProps) in src/app/_layout.tsx" },
            { label: "The error is reported", check: "await restart(); await waitFor(() => has('Order #8'), 2000); await press('Order #8'); await waitFor(() => has('Something went wrong'), 2000); return logs().some((l) => l.includes('[report]'));", fail: "useEffect(() => { reportError(error); }, [error]);" },
          ],
          hint: "ErrorBoundaryProps comes from expo-router; the boundary is a normal component.",
          successMessage: "Bad data now gets a calm screen and a report, not a crash.",
        }),
      },
      {
        id: "a-md-dry",
        title: "Avoiding duplicated code",
        explain:
          "Copy-pasted code DRIFTS: someone fixes or changes one copy and not the others, and the app becomes inconsistent. Here the order list shows \"Oct 3, 2026\" while the details show \"3 Oct 2026\", because one copy was written with a different locale. When the same knowledge appears in two or three places, give it one home (a function, a component, a hook, a constant) and use it everywhere. But share KNOWLEDGE, not coincidence: two pieces of code that look alike today but will change for different reasons are better left apart. A common rule: tolerate two copies, extract the third.",
        webLab: expoLab({
          name: "Kobo",
          layout: DATES_LAYOUT,
          task:
            "The app formats dates in three places, and one has drifted. Write formatDate(iso) in src/utils/date.ts (giving \"3 Oct 2026\") and use it in the list, the order details and the Receipt, so every date looks the same.",
          files: {
            "src/utils/date.ts": "",
            "src/app/index.tsx": DATES_LIST_START,
            "src/app/order/[id].tsx": DATES_DETAIL_START,
            "src/components/Receipt.tsx": RECEIPT_START,
            "src/data/orders.ts": DATES_DATA,
          },
          readOnly: ["src/data/orders.ts"],
          solution: { "src/utils/date.ts": DATE_UTIL_MODEL, "src/app/index.tsx": DATES_LIST_MODEL, "src/app/order/[id].tsx": DATES_DETAIL_MODEL, "src/components/Receipt.tsx": RECEIPT_MODEL },
          tests: [
            { label: "formatDate gives the app's format", check: "const { formatDate } = load('src/utils/date.ts'); return formatDate('2026-10-03T12:00:00Z') === '3 Oct 2026' && formatDate('2026-12-25T12:00:00Z') === '25 Dec 2026';", fail: "toLocaleDateString(\"en-GB\", { day: \"numeric\", month: \"short\", year: \"numeric\" })" },
            { label: "Every screen shows dates the same way", check: "await waitFor(() => has('Ankara tote bag'), 2000); const list = hasText('Ordered 3 Oct 2026'); await navigate('/order/7'); await waitFor(() => has('Delivered 6 Oct 2026'), 2000); return list && has('Ordered 3 Oct 2026');", fail: "The list still drifts from the details." },
            { label: "No copies are left", check: "return ['src/app/index.tsx', 'src/app/order/[id].tsx', 'src/components/Receipt.tsx'].every((f) => !code(f).includes('toLocaleDateString') && code(f).includes('formatDate'));", fail: "All three use formatDate." },
          ],
          hint: "Copy the details screen's version into the function: it is the correct one.",
          successMessage: "One date format, in one place.",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },
];
