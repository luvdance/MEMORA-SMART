/**
 * MOBILE APP DEVELOPMENT · MODULE 17 · PRODUCTION-LEVEL FUNCTIONALITY (part 2)
 *
 * Curriculum 17.9 – 17.P: animations and gestures, charts, localisation,
 * accessibility testing, app lifecycle events, third-party SDKs, when to
 * write native code, and the module practical.
 *
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 */

import { expoLab } from "./md-helpers.js";
import { MODULE, PROVIDER, SECTION_ID, titled } from "./md-m17-part1.js";

const BTN = `{ minHeight: 48, justifyContent: "center", alignItems: "center", borderRadius: 12, borderWidth: 1, borderColor: "#cbd5e1" }`;

/* ── 17.9 · Animations ───────────────────────────────────────────────── */
const ANIM_START = `import { useEffect, useRef, useState } from "react";
import { Animated, Pressable, Text, View } from "react-native";

/** A toast that fades and slides in. */
function Toast({ message }: { message: string }) {
  return (
    <View testID="toast" style={{ position: "absolute", bottom: 40, left: 20, right: 20, padding: 14, borderRadius: 12, backgroundColor: "#0f172a" }}>
      <Text style={{ color: "#fff" }}>{message}</Text>
    </View>
  );
}

export default function Product() {
  const [added, setAdded] = useState(false);
  return (
    <View style={{ flex: 1, padding: 20, gap: 12 }}>
      <Pressable accessibilityRole="button" onPress={() => setAdded(true)} style={${BTN}}><Text>Add to cart</Text></Pressable>
      {added ? <Toast message="Added to your cart" /> : null}
    </View>
  );
}
`;
const ANIM_MODEL = `import { useEffect, useRef, useState } from "react";
import { AccessibilityInfo, Animated, Pressable, Text, View } from "react-native";

/** Whether the user asked the system to reduce motion (kept up to date). */
function useReduceMotion() {
  const [reduce, setReduce] = useState(false);
  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then(setReduce);
    const sub = AccessibilityInfo.addEventListener("reduceMotionChanged", setReduce);
    return () => sub.remove();
  }, []);
  return reduce;
}

/** A toast that fades and slides in. */
function Toast({ message }: { message: string }) {
  const reduce = useReduceMotion();
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (reduce) {
      // No movement for people who asked for less: just show it.
      progress.setValue(1);
      return;
    }
    // useNativeDriver runs the animation on the UI thread, smooth even when JavaScript is busy.
    const animation = Animated.timing(progress, { toValue: 1, duration: 250, useNativeDriver: true });
    animation.start();
    return () => animation.stop();
  }, [reduce, progress]);

  const translateY = progress.interpolate({ inputRange: [0, 1], outputRange: [24, 0] });
  return (
    <Animated.View
      testID="toast"
      accessibilityLiveRegion="polite"
      style={{ position: "absolute", bottom: 40, left: 20, right: 20, padding: 14, borderRadius: 12, backgroundColor: "#0f172a", opacity: progress, transform: [{ translateY }] }}
    >
      <Text style={{ color: "#fff" }}>{message}</Text>
    </Animated.View>
  );
}

export default function Product() {
  const [added, setAdded] = useState(false);
  return (
    <View style={{ flex: 1, padding: 20, gap: 12 }}>
      <Pressable accessibilityRole="button" onPress={() => setAdded(true)} style={${BTN}}><Text>Add to cart</Text></Pressable>
      {added ? <Toast message="Added to your cart" /> : null}
    </View>
  );
}
`;

/* ── 17.10 · Charts ──────────────────────────────────────────────────── */
const CHART_DATA = `export const WEEK = [
  { day: "Mon", sales: 12000 },
  { day: "Tue", sales: 18000 },
  { day: "Wed", sales: 9000 },
  { day: "Thu", sales: 24000 },
  { day: "Fri", sales: 30000 },
  { day: "Sat", sales: 27000 },
  { day: "Sun", sales: 6000 },
];
`;
const CHART_START = `import Svg, { Rect, Text as SvgText } from "react-native-svg";
import { View } from "react-native";

type Point = { day: string; sales: number };

/** A bar chart: one bar per day, the tallest reaching the top of the chart. */
export function BarChart({ data, width = 340, height = 200 }: { data: Point[]; width?: number; height?: number }) {
  return <View />;
}
`;
const CHART_MODEL = `import Svg, { Rect, Text as SvgText } from "react-native-svg";
import { View } from "react-native";

type Point = { day: string; sales: number };

const LABEL_SPACE = 20;
const naira = (n: number) => "₦" + n.toLocaleString("en-NG");

/** A bar chart: one bar per day, the tallest reaching the top of the chart. */
export function BarChart({ data, width = 340, height = 200 }: { data: Point[]; width?: number; height?: number }) {
  const max = Math.max(...data.map((d) => d.sales), 1);
  const slot = width / data.length;
  const barWidth = slot * 0.6;
  const plot = height - LABEL_SPACE;
  // Screen readers can't see bars: give the whole chart a summary.
  const summary = "Sales this week: " + data.map((d) => d.day + " " + naira(d.sales)).join(", ");
  return (
    <View accessible accessibilityRole="image" accessibilityLabel={summary}>
      <Svg width={width} height={height}>
        {data.map((d, i) => {
          const h = (d.sales / max) * plot;
          return (
            <Rect key={d.day} testID="bar" x={i * slot + (slot - barWidth) / 2} y={plot - h} width={barWidth} height={h} rx={4} fill={d.sales === max ? "#0f766e" : "#5eead4"} />
          );
        })}
        {data.map((d, i) => (
          <SvgText key={d.day} x={i * slot + slot / 2} y={height - 4} fontSize={12} textAnchor="middle" fill="#334155">
            {d.day}
          </SvgText>
        ))}
      </Svg>
    </View>
  );
}
`;
const CHART_SCREEN = `import { Text, View } from "react-native";
import { BarChart } from "@/components/BarChart";
import { WEEK } from "@/data/week";

export default function Dashboard() {
  return (
    <View style={{ padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 18, fontWeight: "700" }}>Sales this week</Text>
      <BarChart data={WEEK} />
    </View>
  );
}
`;

/* ── 17.11 · Localisation ────────────────────────────────────────────── */
const I18N_START = `import { getLocales } from "expo-localization";
import { I18n } from "i18n-js";

// The app's words, in English and French. (Each key, in both languages.)
const translations = {
  en: {},
  fr: {},
};

export const i18n = new I18n(translations);

/** Formats an amount of naira for the user's locale. */
export function money(amount: number): string {
  return "₦" + amount;
}
`;
const I18N_MODEL = `import { getLocales } from "expo-localization";
import { I18n } from "i18n-js";

// The app's words, in English and French. (Each key, in both languages.)
const translations = {
  en: {
    greeting: "Welcome back, %{name}",
    cart: { one: "%{count} item in your cart", other: "%{count} items in your cart", zero: "Your cart is empty" },
    checkout: "Checkout",
  },
  fr: {
    greeting: "Bon retour, %{name}",
    cart: { one: "%{count} article dans votre panier", other: "%{count} articles dans votre panier", zero: "Votre panier est vide" },
    checkout: "Payer",
  },
};

export const i18n = new I18n(translations);
// The phone's preferred language, with English for anything missing.
i18n.locale = getLocales()[0]?.languageCode ?? "en";
i18n.enableFallback = true;
i18n.defaultLocale = "en";

/** Formats an amount of naira for the user's locale. */
export function money(amount: number): string {
  return new Intl.NumberFormat(getLocales()[0]?.languageTag ?? "en-NG", { style: "currency", currency: "NGN" }).format(amount);
}
`;
const I18N_SCREEN = `import { Pressable, Text, View } from "react-native";
import { i18n, money } from "@/i18n";

export default function Home() {
  return (
    <View style={{ padding: 20, gap: 10 }}>
      <Text testID="greeting">{i18n.t("greeting", { name: "Ada" })}</Text>
      <Text testID="cart0">{i18n.t("cart", { count: 0 })}</Text>
      <Text testID="cart1">{i18n.t("cart", { count: 1 })}</Text>
      <Text testID="cart3">{i18n.t("cart", { count: 3 })}</Text>
      <Text testID="total">{money(18500)}</Text>
      <Pressable accessibilityRole="button" style={{ minHeight: 48, justifyContent: "center" }}><Text>{i18n.t("checkout")}</Text></Pressable>
    </View>
  );
}
`;

/* ── 17.12 · Accessibility testing ───────────────────────────────────── */
const A11Y_START = `import { Image, Pressable, Text, TextInput, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function Product() {
  return (
    <View style={{ padding: 20, gap: 12 }}>
      <Text style={{ fontSize: 24, fontWeight: "700" }}>Ankara tote bag</Text>
      <Image source={{ uri: "https://cdn.example.com/products/tote.jpg" }} style={{ width: "100%", height: 200, borderRadius: 12 }} />
      <Text style={{ color: "#a3a3a3" }}>Hand-sewn in Aba from 100% cotton wax print.</Text>
      <View style={{ flexDirection: "row", gap: 8 }}>
        <Pressable onPress={() => {}} style={{ width: 28, height: 28, alignItems: "center", justifyContent: "center" }}>
          <Ionicons name="heart-outline" size={20} />
        </Pressable>
        <Pressable onPress={() => {}} style={{ width: 28, height: 28, alignItems: "center", justifyContent: "center" }}>
          <Ionicons name="share-outline" size={20} />
        </Pressable>
      </View>
      <TextInput placeholder="Gift message" style={{ minHeight: 48, borderWidth: 1, borderColor: "#cbd5e1", borderRadius: 10, paddingHorizontal: 12 }} />
    </View>
  );
}
`;
const A11Y_MODEL = `import { Image, Pressable, Text, TextInput, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function Product() {
  return (
    <View style={{ padding: 20, gap: 12 }}>
      <Text accessibilityRole="header" style={{ fontSize: 24, fontWeight: "700" }}>Ankara tote bag</Text>
      <Image
        source={{ uri: "https://cdn.example.com/products/tote.jpg" }}
        style={{ width: "100%", height: 200, borderRadius: 12 }}
        accessibilityLabel="A blue and orange Ankara-print tote bag with leather handles"
      />
      <Text style={{ color: "#525252" }}>Hand-sewn in Aba from 100% cotton wax print.</Text>
      <View style={{ flexDirection: "row", gap: 8 }}>
        <Pressable accessibilityRole="button" accessibilityLabel="Save to wishlist" onPress={() => {}} style={{ width: 48, height: 48, alignItems: "center", justifyContent: "center" }}>
          <Ionicons name="heart-outline" size={24} />
        </Pressable>
        <Pressable accessibilityRole="button" accessibilityLabel="Share" onPress={() => {}} style={{ width: 48, height: 48, alignItems: "center", justifyContent: "center" }}>
          <Ionicons name="share-outline" size={24} />
        </Pressable>
      </View>
      <Text nativeID="giftLabel">Gift message</Text>
      <TextInput accessibilityLabel="Gift message" accessibilityLabelledBy="giftLabel" placeholder="For example: Happy birthday, Bisi!" style={{ minHeight: 48, borderWidth: 1, borderColor: "#cbd5e1", borderRadius: 10, paddingHorizontal: 12 }} />
    </View>
  );
}
`;

/* ── 17.13 · Lifecycle ───────────────────────────────────────────────── */
const LIFE_SERVER = `import { createServer } from "practice-server";

const app = createServer();
let checks = 0;
app.get("/balance", (req, res) => res.json({ balance: 245300, checkedAt: ++checks }));

export default app;
`;
const LIFE_START = `import { useEffect, useState } from "react";
import { AppState, Text, View } from "react-native";

export default function Wallet() {
  const [balance, setBalance] = useState<number | null>(null);
  const [checks, setChecks] = useState(0);

  const load = async () => {
    const data = await (await fetch("https://api.example.com/balance")).json();
    setBalance(data.balance);
    setChecks(data.checkedAt);
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <View style={{ flex: 1, padding: 20, gap: 8 }}>
      <Text style={{ fontSize: 28 }}>₦{balance?.toLocaleString("en-NG")}</Text>
      <Text testID="checks">Checked {checks} times</Text>
    </View>
  );
}
`;
const LIFE_MODEL = `import { useEffect, useState } from "react";
import { AppState, Text, View } from "react-native";

export default function Wallet() {
  const [balance, setBalance] = useState<number | null>(null);
  const [checks, setChecks] = useState(0);
  const [hidden, setHidden] = useState(AppState.currentState !== "active");

  const load = async () => {
    const data = await (await fetch("https://api.example.com/balance")).json();
    setBalance(data.balance);
    setChecks(data.checkedAt);
  };

  useEffect(() => {
    load();
    const sub = AppState.addEventListener("change", (state) => {
      // Leaving: cover the balance, so the app switcher's snapshot doesn't show it.
      setHidden(state !== "active");
      // Coming back: the data may be stale.
      if (state === "active") load();
    });
    return () => sub.remove();
  }, []);

  return (
    <View style={{ flex: 1, padding: 20, gap: 8 }}>
      <Text style={{ fontSize: 28 }}>₦{balance?.toLocaleString("en-NG")}</Text>
      <Text testID="checks">Checked {checks} times</Text>
      {hidden ? (
        <View testID="privacy-cover" style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "#0f766e", alignItems: "center", justifyContent: "center" }}>
          <Text style={{ color: "#fff", fontSize: 22, fontWeight: "700" }}>Kobo</Text>
        </View>
      ) : null}
    </View>
  );
}
`;

/* ── 17.P · The practical ────────────────────────────────────────────── */
const P_SERVER = `import { createServer, crypto } from "practice-server";

// The shop's backend: orders, payments through the provider, and its webhook.
const app = createServer();
const PRICES = { p1: 850000, p2: 300000 }; // kobo
const orders = {};
let nextOrder = 100;
const WEBHOOK_SECRET = "whsec_practice_only";

// POST /orders { items: [{ productId, qty }] } → { id, amount, status }  (the server works out the price)
app.post("/orders", (req, res) => {
  const items = req.body?.items || [];
  if (!items.length || items.some((i) => !(i.productId in PRICES) || !(i.qty >= 1))) return res.status(400).json({ message: "Check your cart" });
  const id = String(nextOrder++);
  orders[id] = { id, amount: items.reduce((s, i) => s + PRICES[i.productId] * i.qty, 0), status: "unpaid", reference: null };
  res.status(201).json(orders[id]);
});

app.get("/orders/:id", (req, res) => (orders[req.params.id] ? res.json(orders[req.params.id]) : res.status(404).json({ message: "Order not found" })));

// POST /orders/:id/pay → { authorizationUrl }
app.post("/orders/:id/pay", async (req, res) => {
  const order = orders[req.params.id];
  if (!order) return res.status(404).json({ message: "Order not found" });
  const r = await fetch("https://checkout.example.com/transaction/initialize", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ amount: order.amount, callback_url: "kobo://payment" }) });
  const { authorization_url, reference } = await r.json();
  order.reference = reference;
  res.json({ authorizationUrl: authorization_url });
});

app.post("/webhooks/payments", (req, res) => {
  if (req.headers["x-signature"] !== crypto.hmacSha256(WEBHOOK_SECRET, JSON.stringify(req.body))) return res.status(401).end();
  const order = Object.values(orders).find((o) => o.reference === req.body.data.reference);
  if (order && req.body.event === "charge.success" && req.body.data.amount === order.amount) order.status = "paid";
  res.status(200).end();
});

${PROVIDER}
export default app;
`;
const P_CART = `export const PRODUCTS = [
  { id: "p1", name: "Ankara tote bag", price: 8500 },
  { id: "p2", name: "Shea butter", price: 3000 },
];

// What the customer has chosen (given for this practical).
export const CART = [
  { productId: "p1", qty: 2 },
  { productId: "p2", qty: 1 },
];
`;
const P_MODEL = {
  "src/payments/checkout.ts": `import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";

const API = "https://api.example.com";
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export type Order = { id: string; amount: number; status: "unpaid" | "paid" };

export async function createOrder(items: { productId: string; qty: number }[]): Promise<Order> {
  const r = await fetch(API + "/orders", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ items }) });
  const data = await r.json();
  if (!r.ok) throw new Error(data.message);
  return data;
}

export const getOrder = async (id: string): Promise<Order> => (await fetch(API + "/orders/" + id)).json();

/** Opens the hosted checkout; returns false if the customer cancelled. */
export async function openCheckout(orderId: string): Promise<boolean> {
  const { authorizationUrl } = await (await fetch(API + "/orders/" + orderId + "/pay", { method: "POST" })).json();
  const result = await WebBrowser.openAuthSessionAsync(authorizationUrl, "kobo://payment");
  return result.type === "success" && Linking.parse(result.url).queryParams?.status !== "cancelled";
}

/** Waits (a little) for the server to see the payment. */
export async function waitForPayment(orderId: string, tries = 4): Promise<Order> {
  let order = await getOrder(orderId);
  for (let i = 1; i < tries && order.status !== "paid"; i++) {
    await sleep(500);
    order = await getOrder(orderId);
  }
  return order;
}
`,
  "src/app/_layout.tsx": `import { Stack } from "expo-router";

export const unstable_settings = { anchor: "index" };

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Cart" }} />
      <Stack.Screen name="orders/[id]" options={{ title: "Order" }} />
    </Stack>
  );
}
`,
  "src/app/index.tsx": `import { router } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { CART, PRODUCTS } from "@/data/cart";
import { createOrder, openCheckout } from "@/payments/checkout";

export default function Cart() {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const total = CART.reduce((s, i) => s + (PRODUCTS.find((p) => p.id === i.productId)?.price ?? 0) * i.qty, 0);

  async function checkout() {
    setBusy(true);
    setMessage("");
    try {
      const order = await createOrder(CART);
      const completed = await openCheckout(order.id);
      if (!completed) {
        setMessage("Payment cancelled. You haven't been charged.");
        return;
      }
      router.push({ pathname: "/orders/[id]", params: { id: order.id } });
    } catch (e) {
      setMessage((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <View style={{ padding: 20, gap: 10 }}>
      {CART.map((i) => (
        <Text key={i.productId}>{i.qty} × {PRODUCTS.find((p) => p.id === i.productId)?.name}</Text>
      ))}
      <Text style={{ fontWeight: "700" }}>Total ₦{total.toLocaleString("en-NG")}</Text>
      <Pressable accessibilityRole="button" disabled={busy} onPress={checkout} style={{ minHeight: 48, justifyContent: "center", alignItems: "center", borderRadius: 12, backgroundColor: "#0f766e" }}>
        {busy ? <ActivityIndicator color="#fff" /> : <Text style={{ color: "#fff", fontWeight: "700" }}>Checkout</Text>}
      </Pressable>
      {message ? <Text accessibilityRole="alert">{message}</Text> : null}
    </View>
  );
}
`,
  "src/app/orders/[id].tsx": `import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, Share, Text, View } from "react-native";
import { waitForPayment, type Order } from "@/payments/checkout";

export default function OrderScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    waitForPayment(id).then(setOrder);
  }, [id]);

  if (!order) return <Text style={{ padding: 20 }}>Checking your payment…</Text>;
  const paid = order.status === "paid";
  return (
    <View style={{ padding: 20, gap: 10 }}>
      <Text testID="status" style={{ fontSize: 20 }}>{paid ? "Paid" : "Waiting for payment"}</Text>
      <Text>Order #{order.id} · ₦{(order.amount / 100).toLocaleString("en-NG")}</Text>
      {paid ? (
        <Pressable accessibilityRole="button" onPress={() => Share.share({ message: "My Kobo order #" + order.id + " is paid: https://kobo.example/orders/" + order.id })} style={{ minHeight: 48, justifyContent: "center" }}>
          <Text>Share receipt</Text>
        </Pressable>
      ) : null}
    </View>
  );
}
`,
};

export const PART2 = [
  /* ═══════════════ LESSON 109 · 17.9 – 17.10 ═══════════════ */
  {
    id: "md-l109-motion-charts",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 5,
    covers: ["17.9", "17.10"],
    title: "Animations, Gestures and Charts",
    subtitle: "Motion that helps, and data people can see at a glance",
    estimatedMinutes: 55,
    intro: "Animation explains change (where did that come from?) and charts explain data. Both should be smooth, purposeful and accessible.",
    atoms: [
      {
        id: "a-md-animations",
        title: "Animations and gesture interactions",
        explain:
          "Animate to EXPLAIN: an item flying to the cart, a sheet sliding up from where it was tapped, a toast fading in. Keep it short (150–300 ms) and run it on the UI thread so it stays smooth while JavaScript is busy: React Native's Animated API with useNativeDriver: true (opacity and transforms only), or REANIMATED (the Expo template includes react-native-reanimated: worklets, useSharedValue, useAnimatedStyle, withTiming, withSpring, and layout animations such as entering={FadeIn}). Gestures (swipe to delete, drag, pinch) use react-native-gesture-handler with Reanimated, so the gesture and the animation both run on the UI thread. Always RESPECT REDUCE MOTION (iOS and Android accessibility settings): AccessibilityInfo.isReduceMotionEnabled() and its change event, or Reanimated's useReducedMotion(); then show the end state without movement. (This practice phone runs no animation frames, so the checks read your code and test the reduced-motion path.)",
        webLab: expoLab({
          name: "Kobo",
          layout: titled("Product"),
          task:
            "Make the toast fade and slide in: an Animated.Value from 0 to 1 over 250 ms with useNativeDriver: true, driving opacity and a translateY interpolated from 24 to 0, on an Animated.View (testID \"toast\", accessibilityLiveRegion \"polite\"). If the user has turned on Reduce Motion (AccessibilityInfo.isReduceMotionEnabled, and its reduceMotionChanged event), skip the animation and show it at once; stop the animation on unmount.",
          files: { "src/app/index.tsx": ANIM_START },
          solution: { "src/app/index.tsx": ANIM_MODEL },
          tests: [
            { label: "It animates opacity and position on the UI thread", check: "const c = code('src/app/index.tsx'); return /Animated\\.timing\\(/.test(c) && /useNativeDriver:\\s*true/.test(c) && /interpolate\\(/.test(c) && /translateY/.test(c) && /opacity:\\s*progress|opacity:\\s*\\w+/.test(c) && /Animated\\.View/.test(c);", fail: "Animated.timing(value, { toValue: 1, duration: 250, useNativeDriver: true }), opacity and translateY from it." },
            { label: "With Reduce Motion on, the toast simply appears", device: { accessibility: { reduceMotion: true } }, check: "await press('Add to cart'); await wait(300); const s = styleOf({ testID: 'toast' }); return exists({ testID: 'toast' }) && hasText('Added to your cart') && (s.opacity === 1 || s.opacity === undefined);", fail: "isReduceMotionEnabled() → progress.setValue(1)." },
            { label: "It listens for the setting changing, and cleans up", check: "const c = code('src/app/index.tsx'); return c.includes('isReduceMotionEnabled') && c.includes('reduceMotionChanged') && /\\.remove\\(\\)/.test(c) && /\\.stop\\(\\)/.test(c);", fail: "AccessibilityInfo.addEventListener(\"reduceMotionChanged\", …), and remove/stop in clean-ups." },
          ],
          hint: "const progress = useRef(new Animated.Value(0)).current;",
          successMessage: "Motion that explains, runs smoothly, and steps aside for people who need less of it.",
        }),
      },
      {
        id: "a-md-charts",
        title: "Charts and data visualization",
        explain:
          "For dashboards and reports, chart libraries (Victory Native, react-native-gifted-charts, Skia-based charts) save time; underneath, most draw with SVG (react-native-svg) or Skia. Drawing a simple chart yourself teaches the essentials: SCALE values to the space (height = value / max × plotHeight), leave room for labels, start bars at zero (a cut-off axis exaggerates differences), and highlight what matters (the best day). Charts must be ACCESSIBLE: screen readers can't see bars, so give the chart an accessibilityLabel that summarises the data (or a table alternative), don't rely on colour alone, and keep text at least 12 points. For large data, aggregate on the server.",
        webLab: expoLab({
          name: "Kobo",
          layout: titled("Dashboard"),
          task:
            "Write BarChart in src/components/BarChart.tsx with react-native-svg: one Rect per day (testID \"bar\"), its height = sales / the week's maximum × (height − 20), standing on a common baseline, the best day in #0f766e and the others in #5eead4, the day names below as SVG text; wrap it in a View with accessibilityRole \"image\" and the accessibilityLabel \"Sales this week: Mon ₦12,000, Tue ₦18,000, …\".",
          files: { "src/components/BarChart.tsx": CHART_START, "src/app/index.tsx": CHART_SCREEN, "src/data/week.ts": CHART_DATA },
          readOnly: ["src/app/index.tsx", "src/data/week.ts"],
          solution: { "src/components/BarChart.tsx": CHART_MODEL },
          tests: [
            { label: "Seven bars, scaled to the maximum, on one baseline", check: "await wait(300); const bars = [...document.querySelectorAll('rect')]; const h = bars.map((b) => Number(b.getAttribute('height'))); const bottoms = bars.map((b) => Number(b.getAttribute('y')) + Number(b.getAttribute('height'))); return bars.length === 7 && Math.abs(h[4] - 180) < 0.5 && Math.abs(h[0] - 72) < 0.5 && Math.abs(h[6] - 36) < 0.5 && bottoms.every((b) => Math.abs(b - 180) < 0.5);", fail: "height = sales / max × (200 − 20); y = plot − height." },
            { label: "The best day stands out", check: "const fills = [...document.querySelectorAll('rect')].map((b) => (b.getAttribute('fill') || '').toLowerCase()); return fills[4] === '#0f766e' && fills.filter((f) => f === '#0f766e').length === 1 && fills[0] === '#5eead4';", fail: "fill={d.sales === max ? \"#0f766e\" : \"#5eead4\"}" },
            { label: "Screen readers hear the data", check: "const el = find({ role: 'img' }) || find({ role: 'image' }); const label = el && el.getAttribute('aria-label'); return !!label && label.startsWith('Sales this week: Mon ₦12,000, Tue ₦18,000') && label.includes('Sun ₦6,000') && document.body.textContent.includes('Thu');", fail: "accessibilityRole=\"image\" and a summary accessibilityLabel; day labels as SVG text." },
          ],
          hint: "import Svg, { Rect, Text as SvgText } from \"react-native-svg\";",
          successMessage: "A clear, honest chart that screen-reader users can understand too.",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════ LESSON 110 · 17.11 – 17.12 ═══════════════ */
  {
    id: "md-l110-i18n-a11y",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 6,
    covers: ["17.11", "17.12"],
    title: "Languages, Formats and Accessibility Testing",
    subtitle: "An app for everyone: in their language, and usable without sight or fine motor control",
    estimatedMinutes: 55,
    intro: "Reaching more people is often less about features than about words, formats and access.",
    atoms: [
      {
        id: "a-md-i18n",
        title: "Internationalization and localization",
        explain:
          "INTERNATIONALISATION (i18n) prepares the code: no words hard-coded in components, only keys looked up in translation files. LOCALISATION (l10n) is the translations and formats for each place. With expo-localization (getLocales() gives the phone's languages in order of preference) and i18n-js: new I18n({ en: {…}, fr: {…} }), i18n.locale from the phone, enableFallback so missing keys fall back to English, interpolation (\"Welcome back, %{name}\") and PLURALS (zero / one / other; some languages have more forms). Format numbers, money and dates with Intl.NumberFormat and Intl.DateTimeFormat for the locale, never by hand. Leave room: translated text is often 30% longer. Support right-to-left languages (Arabic) with I18nManager. And use real translators: for Yoruba, Hausa, Igbo or Pidgin, work with native speakers rather than machine translation alone.",
        webLab: expoLab({
          name: "Kobo",
          layout: titled("Kobo"),
          device: { locale: "fr-FR" },
          task:
            "In src/i18n.ts: add English and French for greeting (\"Welcome back, %{name}\" / \"Bon retour, %{name}\"), cart with zero/one/other (\"Your cart is empty\" / \"%{count} item in your cart\" / \"%{count} items in your cart\"; French: \"Votre panier est vide\" / \"%{count} article dans votre panier\" / \"%{count} articles dans votre panier\") and checkout (\"Checkout\" / \"Payer\"); set i18n.locale from the phone's first language (getLocales), with fallback to English; and make money() use Intl.NumberFormat for the phone's language tag with currency NGN.",
          files: { "src/i18n.ts": I18N_START, "src/app/index.tsx": I18N_SCREEN },
          readOnly: ["src/app/index.tsx"],
          solution: { "src/i18n.ts": I18N_MODEL },
          tests: [
            { label: "A French phone gets French", check: "return find({ testID: 'greeting' }).textContent === 'Bon retour, Ada' && has('Payer');", fail: "i18n.locale = getLocales()[0].languageCode" },
            { label: "Plurals follow the count", check: "return find({ testID: 'cart0' }).textContent === 'Votre panier est vide' && find({ testID: 'cart1' }).textContent === '1 article dans votre panier' && find({ testID: 'cart3' }).textContent === '3 articles dans votre panier';", fail: "cart: { zero, one, other } with %{count}." },
            { label: "Money is formatted for the locale", check: "return find({ testID: 'total' }).textContent === new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'NGN' }).format(18500);", fail: "new Intl.NumberFormat(languageTag, { style: \"currency\", currency: \"NGN\" })" },
            { label: "An English phone gets English", device: { locale: "en-NG" }, check: "return find({ testID: 'greeting' }).textContent === 'Welcome back, Ada' && find({ testID: 'cart1' }).textContent === '1 item in your cart' && has('Checkout') && find({ testID: 'total' }).textContent === new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(18500);", fail: "Both languages, every key." },
          ],
          hint: "i18n.t(\"cart\", { count }) picks zero, one or other for you.",
          successMessage: "One codebase, the user's own language and formats.",
        }),
      },
      {
        id: "a-md-a11y-testing",
        title: "Accessibility testing",
        explain:
          "Test accessibility like any other feature. AUTOMATED checks catch the basics: every button and image has a name (accessibilityLabel), the right role (button, header, image, link), touch targets at least 44 × 44 points (iOS) / 48 × 48 dp (Android), text contrast at least 4.5:1 (3:1 for large text), and inputs with labels (not just placeholders, which disappear). Tools: React Native Testing Library's getByRole and getByLabelText in your tests (Module 18), Xcode's Accessibility Inspector, Android's Accessibility Scanner. MANUAL testing finds the rest: use the app with VoiceOver (iOS) and TalkBack (Android) with your eyes closed, with the largest text size, and with Switch Access. Decorative images should be hidden from screen readers; meaningful ones need a description of what matters.",
        webLab: expoLab({
          name: "Kobo",
          layout: titled("Product"),
          task:
            "Fix the accessibility problems: make the product name a header; describe the product photo (accessibilityLabel); darken the description text to pass 4.5:1 contrast on white; give the two icon buttons the role button, names (\"Save to wishlist\", \"Share\") and 48 × 48 touch targets; and label the gift message input (accessibilityLabel \"Gift message\") with a visible label above it, keeping a helpful placeholder.",
          files: { "src/app/index.tsx": A11Y_START },
          solution: { "src/app/index.tsx": A11Y_MODEL },
          tests: [
            { label: "The name is a header and the photo is described", check: "const h = find({ role: 'header' }); const described = [...document.querySelectorAll('#root [aria-label]')].some((e) => e.getAttribute('aria-label').length > 10 && !e.hasAttribute('role') && e.tagName !== 'INPUT'); return !!h && h.textContent === 'Ankara tote bag' && described;", fail: "accessibilityRole=\"header\"; accessibilityLabel on the Image." },
            { label: "The icon buttons have names and big enough targets", check: "const a = find({ role: 'button', name: 'Save to wishlist' }); const b = find({ role: 'button', name: 'Share' }); const sa = tapSize({ role: 'button', name: 'Save to wishlist' }); const sb = tapSize({ role: 'button', name: 'Share' }); return !!a && !!b && sa.width >= 48 && sa.height >= 48 && sb.width >= 48 && sb.height >= 48;", fail: "accessibilityRole=\"button\", accessibilityLabel, and 48 × 48." },
            { label: "The description text is readable", check: "return contrastOf('Hand-sewn in Aba from 100% cotton wax print.') >= 4.5;", fail: "#a3a3a3 on white is only 2.5:1; try #525252." },
            { label: "The input has a real label", check: "const input = find({ label: 'Gift message' }); return !!input && input.tagName === 'INPUT' && has('Gift message');", fail: "accessibilityLabel=\"Gift message\" on the TextInput, and a visible Text label." },
          ],
          hint: "An Image's accessibilityLabel is what VoiceOver and TalkBack read for it.",
          successMessage: "A screen everyone can use: named, structured, readable and easy to tap.",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════ LESSON 111 · 17.13 – 17.15 ═══════════════ */
  {
    id: "md-l111-lifecycle-sdks-native",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 7,
    covers: ["17.13", "17.14", "17.15"],
    title: "App Lifecycle, Third-Party SDKs and Native Code",
    subtitle: "Behaving well when users come and go, and knowing what to add, and when to go native",
    estimatedMinutes: 55,
    intro: "Three topics that separate hobby apps from production ones: respecting the app's lifecycle, choosing SDKs carefully, and knowing the rare moments that need Kotlin or Swift.",
    atoms: [
      {
        id: "a-md-app-lifecycle",
        title: "Handling app lifecycle events",
        explain:
          "An app is ACTIVE (in front), INACTIVE (iOS: briefly, during the app switcher, a call or Control Centre) or BACKGROUND (left; soon suspended, and maybe killed to free memory). AppState.currentState and AppState.addEventListener(\"change\", …) tell you which. Typical uses: REFRESH stale data when returning to active (or use TanStack Query's focusManager, Module 11); PAUSE timers, video, sensors and location watching when leaving; SAVE drafts as the user leaves (the app may never come back); and protect PRIVACY: the app switcher shows a snapshot of your last screen, so banking and health apps cover sensitive content when the app becomes inactive. Always remove the listener on unmount. Don't assume the app will run in the background: it won't (Module 16).",
        webLab: expoLab({
          name: "Kobo Wallet",
          layout: titled("Wallet"),
          task:
            "With AppState: when the app leaves the foreground (any state other than \"active\"), cover the screen with a view (testID \"privacy-cover\") showing only \"Kobo\", so the app switcher's snapshot doesn't show the balance; when it comes back to \"active\", remove the cover and reload the balance. Remove the listener on unmount.",
          files: { "src/app/index.tsx": LIFE_START, "server/index.js": LIFE_SERVER },
          readOnly: ["server/index.js"],
          solution: { "src/app/index.tsx": LIFE_MODEL },
          tests: [
            { label: "Leaving the app covers the balance", check: "await waitFor(() => hasText('Checked 1 times'), 3000); await background(); await wait(200); return exists({ testID: 'privacy-cover' }) && has('Kobo');", fail: "AppState \"change\": setHidden(state !== \"active\")." },
            { label: "Coming back uncovers it and refreshes", check: "await foreground(); await waitFor(() => hasText('Checked 2 times'), 3000); return !exists({ testID: 'privacy-cover' });", fail: "On \"active\": hide the cover and load() again." },
            { label: "The listener is removed on unmount", check: "return /\\.remove\\(\\)/.test(code('src/app/index.tsx'));", fail: "return () => sub.remove();" },
          ],
          hint: "AppState.addEventListener returns a subscription with remove().",
          successMessage: "An app that refreshes when you return, and keeps your balance out of the app switcher.",
        }),
      },
      {
        id: "a-md-third-party-sdks",
        title: "Integrating third-party SDKs",
        explain:
          "Analytics (PostHog, Amplitude, Firebase Analytics), crash reporting (Sentry: sentry-expo's successor @sentry/react-native has an Expo config plugin), payments, maps, chat, support widgets: SDKs save months, but each one is code you ship and trust. Before adding one, check: does it support Expo (a CONFIG PLUGIN, so npx expo prebuild and EAS Build set up the native parts) or only bare React Native; does it need a development build (anything native does, not Expo Go); how much does it add to app size and start-up time; what DATA does it collect (you must declare it in Apple's privacy labels and privacy manifest and Google's Data safety form, and get consent where the law requires); is it maintained, and how do you remove it later? Wrap each SDK behind your own small module (analytics.track()), so you can swap it, disable it in development and respect a user's opt-out in one place.",
        decision: {
          scenario: "Marketing asks to add four SDKs to the Kobo app this week: two analytics tools, a heat-map recorder that records users' screens, and an A/B testing tool. Only one of them has an Expo config plugin.",
          question: "What is the professional response?",
          options: [
            { id: "a", text: "Agree on what must be measured, pick one analytics SDK with an Expo config plugin, wrap it in an analytics module with consent, declare its data in both stores' privacy forms, and test it in a development build", why: "Each SDK costs size, start-up time, privacy obligations and maintenance; one well-integrated, wrapped and declared tool meets the need without the risk." },
            { id: "b", text: "Add all four now; they're only analytics", whyWrong: "Screen recording can capture passwords and personal data; undeclared collection breaks store rules and data-protection law; four SDKs slow the app." },
            { id: "c", text: "Add them in Expo Go to test quickly", whyWrong: "SDKs with native code don't run in Expo Go; they need a development build." },
            { id: "d", text: "Call each SDK directly from every screen", whyWrong: "Scatters the SDK through the code, making consent, opt-out and replacement hard." },
          ],
          correct: "a",
          aftermath: "Fewer, well-chosen SDKs, behind your own wrapper, declared honestly.",
        },
      },
      {
        id: "a-md-native-code",
        title: "Understanding when native Kotlin or Swift code is necessary",
        explain:
          "With Expo, most apps never need native code: the SDK and the community cover cameras, maps, payments, notifications, files, sensors and more. You need KOTLIN (Android) or SWIFT (iOS) when: a platform API has no module yet (a new OS feature such as iOS Live Activities and widgets, Android's home-screen widgets, CarPlay/Android Auto, or specific Bluetooth or NFC hardware); you integrate a vendor's native-only SDK; or a hot path needs native speed (rare: try Reanimated, Skia or worklets first). The Expo way is the EXPO MODULES API: npx create-expo-module creates a local module in your project with Swift and Kotlin files and a TypeScript interface, plus a config plugin for any native settings; Continuous Native Generation (Module 7) keeps the android and ios folders generated. Keep native code small, behind a clear TypeScript API, and tested on both platforms.",
        decision: {
          scenario: "Kobo wants three new features: (1) a home-screen widget showing today's orders; (2) a screen that scans product barcodes; (3) a faster product list, because scrolling feels slow on cheap Android phones.",
          question: "Which genuinely needs native Swift and Kotlin code?",
          options: [
            { id: "a", text: "Only the home-screen widget: it runs outside the app, so it needs a native extension (an Expo module and config plugin)", why: "Widgets are native extensions with their own platform UI frameworks (SwiftUI WidgetKit, Android Glance or RemoteViews); barcode scanning is in expo-camera, and list speed is fixed with FlatList/FlashList tuning and smaller images." },
            { id: "b", text: "All three", whyWrong: "expo-camera already scans barcodes, and a slow list is almost always a JavaScript or image problem, not a reason for native code." },
            { id: "c", text: "The barcode scanner only", whyWrong: "CameraView's onBarcodeScanned covers it with no native code." },
            { id: "d", text: "None: everything is possible in JavaScript", whyWrong: "Home-screen widgets run outside your app's JavaScript and must be written natively." },
          ],
          correct: "a",
          aftermath: "Reach for native code when the platform demands it, and wrap it in an Expo module when you do.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════ LESSON 112 · 17.P ═══════════════ */
  {
    id: "md-l112-m17-project",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 8,
    covers: ["17.P"],
    title: "Practical: Add Checkout to the Shop",
    subtitle: "One advanced feature, end to end: server-priced orders, hosted payment, verified status",
    estimatedMinutes: 120,
    intro: "Adding a production feature to an existing app is the everyday job of a mobile developer. Here: real checkout for the Kobo shop.",
    atoms: [
      {
        id: "a-md-m17-project",
        title: "Build the checkout",
        explain:
          "The shop's server (server/index.js) creates orders priced by the server, starts payments with the provider, and marks orders paid from the provider's signed webhook. The cart is given. Build the app side.",
        webLab: expoLab({
          name: "Kobo",
          layout: null,
          app: { scheme: "kobo" },
          task:
            "Build: src/payments/checkout.ts (createOrder(items) → POST /orders; openCheckout(orderId) → POST /orders/<id>/pay, then the hosted page with openAuthSessionAsync, returning false if cancelled; waitForPayment(orderId) → GET /orders/<id> up to 4 times, half a second apart). Screens: a root Stack (anchor \"index\") with index (\"Cart\": the cart lines, \"Total ₦<total>\", \"Checkout\" which creates the order and opens checkout, showing \"Payment cancelled. You haven't been charged.\" if cancelled, otherwise going to /orders/<id>) and orders/[id] (\"Paid\" or \"Waiting for payment\" (testID \"status\"), \"Order #<id> · ₦<amount>\", and when paid, \"Share receipt\").",
          files: {
            "src/app/_layout.tsx": "// The root layout.\n",
            "src/app/index.tsx": "// The cart.\n",
            "src/app/orders/[id].tsx": "// One order.\n",
            "src/payments/checkout.ts": "",
            "src/data/cart.ts": P_CART,
            "server/index.js": P_SERVER,
          },
          readOnly: ["src/data/cart.ts", "server/index.js"],
          revealSolution: false,
          solution: P_MODEL,
          tests: [
            { label: "Checkout creates a server-priced order and pays it", check: "await waitFor(() => has('Total ₦20,000'), 3000); await press('Checkout'); await tap('Pay ₦20,000'); await waitFor(() => path() === '/orders/100', 4000); await waitFor(() => find({ testID: 'status' })?.textContent === 'Paid', 4000); const post = serverRequests().find((r) => r.method === 'POST' && r.path === '/orders'); return has('Order #100 · ₦20,000') && !('total' in post.body) && !('amount' in post.body);", fail: "POST /orders with the items only; the server prices it." },
            { label: "Paid orders can share a receipt", check: "await press('Share receipt'); await tap('WhatsApp'); await wait(200); return (shares().pop()?.message || '').includes('order #100');", fail: "Share.share({ message }) when paid." },
            { label: "Cancelling stays on the cart and says so", check: "await restart(); await waitFor(() => has('Checkout'), 3000); await press('Checkout'); await tap('Cancel payment'); await waitFor(() => hasText('Payment cancelled'), 4000); return path() === '/';", fail: "openCheckout returns false; show the message." },
            { label: "A fake success redirect isn't trusted", check: "await restart(); await waitFor(() => has('Checkout'), 3000); await press('Checkout'); await tap('Simulate a fake success redirect'); await waitFor(() => path().startsWith('/orders/'), 4000); await waitFor(() => !!find({ testID: 'status' }), 5000); return find({ testID: 'status' }).textContent === 'Waiting for payment';", fail: "Show the server's status, never the redirect's." },
          ],
          hint: "Reuse the pattern from Lesson 105, split into three functions.",
          successMessage: "A production checkout: priced on the server, paid on the provider's page, confirmed by a signed webhook.",
        }),
      },
    ],
    task: {
      title: "Module 17 practical: one advanced feature in your own app",
      intro: "Choose ONE advanced feature your app needs, and build it to production standard.",
      prompts: [
        "Pick one: payments (hosted checkout and webhooks), subscriptions (store billing), universal links, offline sync, localisation, charts, or animations and gestures.",
        "Write down what \"done\" means: the happy path, every failure path, accessibility, performance on a mid-range Android phone, and privacy declarations.",
        "Build it in a development build on a real Android phone and iPhone, with any server parts verified (signatures, amounts, ownership).",
        "Profile the screens it touches in a release build and fix what you find.",
        "Mastery checkpoint: demo the feature, then explain one failure it handles and how you tested it.",
      ],
      closing: "Next: Module 18, testing.",
    },
    requirements: { read: true, video: false, assessment: true },
  },
];
