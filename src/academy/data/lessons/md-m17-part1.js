/**
 * MOBILE APP DEVELOPMENT · MODULE 17 · PRODUCTION-LEVEL FUNCTIONALITY (part 1)
 *
 * Curriculum 17.1 – 17.8: hosted payment checkout, webhooks and
 * server-side verification, subscriptions and in-app purchases, deep and
 * universal links, offline synchronisation, background processing,
 * performance, and image caching with large lists.
 *
 * Payments use a practice provider ("checkout.example.com") that behaves
 * like Paystack or Flutterwave: a server-initialised transaction, a hosted
 * checkout page, a redirect back to the app, and a signed webhook.
 *
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 */

import { appJson, expoLab } from "./md-helpers.js";

export const SECTION_ID = "md-s17-production";
export const MODULE = "md-m17-advanced";

export const titled = (title) => `import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "${title}" }} />
    </Stack>
  );
}
`;
export const serverOnly = `import { Text } from "react-native";

export default function Home() {
  return <Text style={{ padding: 20 }}>This lab is the server: see server/index.js.</Text>;
}
`;
const BTN = `{ minHeight: 48, justifyContent: "center", alignItems: "center", borderRadius: 12, borderWidth: 1, borderColor: "#cbd5e1" }`;

/* ── The practice payment provider (shared by the payment labs) ──────── */
export const PROVIDER = `// ── The payment provider (a stand-in for Paystack or Flutterwave) ───────
const provider = createServer({ origin: "https://checkout.example.com" });
const transactions = new Map(); // reference → { amount, status, callbackUrl }
const PROVIDER_WEBHOOK_SECRET = "whsec_practice_only"; // shared with your server when you set up the webhook

provider.post("/transaction/initialize", (req, res) => {
  const reference = "ref_" + crypto.sha256(String(Math.random())).slice(0, 10);
  transactions.set(reference, { amount: req.body.amount, status: "pending", callbackUrl: req.body.callback_url });
  res.json({ authorization_url: "https://checkout.example.com/pay/" + reference, reference });
});

provider.get("/transaction/verify/:reference", (req, res) => {
  const t = transactions.get(req.params.reference);
  if (!t) return res.status(404).json({ status: false, message: "Transaction not found" });
  res.json({ status: true, data: { reference: req.params.reference, amount: t.amount, status: t.status } });
});

// The hosted checkout page the customer sees.
provider.page("/pay/:reference", ({ params }) => {
  const t = transactions.get(params.reference);
  if (!t) return { title: "Checkout", body: "This payment link is not valid.", buttons: [] };
  const back = (status) => t.callbackUrl + "?reference=" + params.reference + "&status=" + status;
  return {
    title: "Pay ₦" + (t.amount / 100).toLocaleString("en-NG"),
    body: "Card ending 4081 · Kobo Market",
    buttons: [
      {
        label: "Pay ₦" + (t.amount / 100).toLocaleString("en-NG"),
        redirect: back("success"),
        // When the card is charged, the provider tells YOUR server, with a signed webhook.
        run: async () => {
          t.status = "success";
          const body = JSON.stringify({ event: "charge.success", data: { reference: params.reference, amount: t.amount, currency: "NGN", status: "success" } });
          await fetch("https://api.example.com/webhooks/payments", { method: "POST", headers: { "Content-Type": "application/json", "x-signature": crypto.hmacSha256(PROVIDER_WEBHOOK_SECRET, body) }, body });
        },
      },
      { label: "Cancel payment", redirect: back("cancelled") },
      // What a tampered or fake redirect looks like: it claims success, but nothing was paid.
      { label: "Simulate a fake success redirect", redirect: back("success") },
    ],
  };
});
`;

/* ── 17.1 · Hosted checkout ──────────────────────────────────────────── */
const CHECKOUT_SERVER = `import { createServer, crypto } from "practice-server";

const app = createServer();
const orders = { "42": { id: "42", amount: 1800000, status: "unpaid", reference: null } }; // amounts in kobo
const WEBHOOK_SECRET = "whsec_practice_only";

// The app asks OUR server to start a payment; the server (holding the secret key) calls the provider.
app.post("/orders/:id/pay", async (req, res) => {
  const order = orders[req.params.id];
  if (!order) return res.status(404).json({ message: "Order not found" });
  const r = await fetch("https://checkout.example.com/transaction/initialize", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ amount: order.amount, callback_url: "kobo://payment" }),
  });
  const { authorization_url, reference } = await r.json();
  order.reference = reference;
  res.json({ authorizationUrl: authorization_url, reference });
});

app.get("/orders/:id", (req, res) => res.json(orders[req.params.id]));

// The provider's webhook (see Lesson 105's second lab).
app.post("/webhooks/payments", (req, res) => {
  if (req.headers["x-signature"] !== crypto.hmacSha256(WEBHOOK_SECRET, JSON.stringify(req.body))) return res.status(401).end();
  const order = Object.values(orders).find((o) => o.reference === req.body.data.reference);
  if (order && req.body.event === "charge.success" && req.body.data.amount === order.amount) order.status = "paid";
  res.status(200).end();
});

${PROVIDER}
export default app;
`;
const CHECKOUT_START = `import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";

export type Outcome = "paid" | "cancelled" | "pending";

const API = "https://api.example.com";

/**
 * Pays for an order with the provider's hosted checkout:
 * ask our server to start it, open the checkout page, and when the user comes back,
 * ask OUR SERVER whether the order is really paid.
 */
export async function payForOrder(orderId: string): Promise<Outcome> {
  return "pending";
}
`;
const CHECKOUT_MODEL = `import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";

export type Outcome = "paid" | "cancelled" | "pending";

const API = "https://api.example.com";
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * Pays for an order with the provider's hosted checkout:
 * ask our server to start it, open the checkout page, and when the user comes back,
 * ask OUR SERVER whether the order is really paid.
 */
export async function payForOrder(orderId: string): Promise<Outcome> {
  const start = await fetch(API + "/orders/" + orderId + "/pay", { method: "POST" });
  if (!start.ok) throw new Error("Couldn't start the payment");
  const { authorizationUrl } = await start.json();

  const result = await WebBrowser.openAuthSessionAsync(authorizationUrl, "kobo://payment");
  if (result.type !== "success") return "cancelled";
  if (Linking.parse(result.url).queryParams?.status === "cancelled") return "cancelled";

  // The redirect only says the customer came back. The truth is the order on our server,
  // set by the provider's verified webhook. Check a few times: the webhook may be a moment behind.
  for (let i = 0; i < 4; i++) {
    const order = await (await fetch(API + "/orders/" + orderId)).json();
    if (order.status === "paid") return "paid";
    await sleep(500);
  }
  return "pending";
}
`;
const CHECKOUT_SCREEN = `import { useState } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { payForOrder, type Outcome } from "@/payments/checkout";

const MESSAGES: Record<Outcome, string> = {
  paid: "Payment confirmed. Thank you!",
  cancelled: "Payment cancelled. You haven't been charged.",
  pending: "We haven't received your payment yet. We'll let you know when we do.",
};

export default function Checkout() {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  async function pay() {
    setBusy(true);
    setMessage("");
    try {
      setMessage(MESSAGES[await payForOrder("42")]);
    } catch (e) {
      setMessage((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <View style={{ padding: 20, gap: 12 }}>
      <Text style={{ fontSize: 18 }}>Order #42 · ₦18,000</Text>
      <Pressable accessibilityRole="button" disabled={busy} onPress={pay} style={${BTN}}>{busy ? <ActivityIndicator /> : <Text>Pay now</Text>}</Pressable>
      <Text testID="message">{message}</Text>
    </View>
  );
}
`;

/* ── 17.2 · Webhooks ─────────────────────────────────────────────────── */
const WEBHOOK_START = `import { createServer, crypto } from "practice-server";

const app = createServer();
// amounts in kobo
const orders = [{ id: "42", amount: 1800000, status: "unpaid", reference: "ref_order42" }];
const payments = []; // every payment recorded (one per order)
const WEBHOOK_SECRET = "whsec_practice_only";

// The provider calls this when something happens to a transaction.
// Body: { event: "charge.success", data: { reference, amount, currency, status } }
// Header x-signature: crypto.hmacSha256(WEBHOOK_SECRET, the JSON body)
app.post("/webhooks/payments", (req, res) => {
  const order = orders.find((o) => o.reference === req.body.data.reference);
  order.status = "paid";
  payments.push({ orderId: order.id, amount: req.body.data.amount });
  res.status(200).end();
});

// For this lab's checks only: the state, and the provider's signature for a body (so checks can send real webhooks).
app.get("/debug/state", (req, res) => res.json({ orders, payments }));
app.post("/debug/sign", (req, res) => res.json({ sig: crypto.hmacSha256(WEBHOOK_SECRET, JSON.stringify(req.body)) }));

export default app;
`;
const WEBHOOK_MODEL = `import { createServer, crypto } from "practice-server";

const app = createServer();
// amounts in kobo
const orders = [{ id: "42", amount: 1800000, status: "unpaid", reference: "ref_order42" }];
const payments = []; // every payment recorded (one per order)
const WEBHOOK_SECRET = "whsec_practice_only";

// The provider calls this when something happens to a transaction.
// Body: { event: "charge.success", data: { reference, amount, currency, status } }
// Header x-signature: crypto.hmacSha256(WEBHOOK_SECRET, the JSON body)
app.post("/webhooks/payments", (req, res) => {
  // 1. Is it really from the provider? Anyone can POST to this URL.
  //    (Real servers sign-check the RAW body bytes; providers document their exact scheme.)
  const expected = crypto.hmacSha256(WEBHOOK_SECRET, JSON.stringify(req.body));
  if (req.headers["x-signature"] !== expected) return res.status(401).json({ message: "Bad signature" });

  const { event, data } = req.body;
  // 2. Only the events we act on.
  if (event !== "charge.success" || data?.status !== "success") return res.status(200).end();

  const order = orders.find((o) => o.reference === data.reference);
  // 3. Unknown reference: acknowledge (so the provider stops retrying), change nothing.
  if (!order) return res.status(200).end();
  // 4. The amount and currency must match what WE charged.
  if (data.amount !== order.amount || data.currency !== "NGN") {
    console.error("[webhook] amount mismatch for order " + order.id);
    return res.status(200).end();
  }
  // 5. Idempotent: providers resend webhooks; record each payment once.
  if (order.status !== "paid") {
    order.status = "paid";
    payments.push({ orderId: order.id, amount: data.amount });
  }
  // 6. Answer quickly with 2xx; do slow work (e-mails, fulfilment) afterwards.
  res.status(200).end();
});

// For this lab's checks only: the state, and the provider's signature for a body (so checks can send real webhooks).
app.get("/debug/state", (req, res) => res.json({ orders, payments }));
app.post("/debug/sign", (req, res) => res.json({ sig: crypto.hmacSha256(WEBHOOK_SECRET, JSON.stringify(req.body)) }));

export default app;
`;
const hook = (body, sig = "good") =>
  `await (async () => { const body = JSON.stringify(${body}); const sig = ${sig === "good" ? "await sign(body)" : `'${sig}'`}; return fetch('https://api.example.com/webhooks/payments', { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-signature': sig }, body }); })()`;
const SIGN = "const sign = async (b) => (await (await fetch('https://api.example.com/debug/sign', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: b })).json()).sig;";
const state = "(await (await fetch('https://api.example.com/debug/state')).json())";

/* ── 17.4 · Universal links ──────────────────────────────────────────── */
const ULINK_SERVER_START = `import { createServer } from "practice-server";

// Your website, https://kobo.example. To prove the app belongs to it, it must serve:
//   /.well-known/apple-app-site-association  (iOS universal links)
//   /.well-known/assetlinks.json             (Android App Links)
const site = createServer({ origin: "https://kobo.example" });

const APPLE_TEAM_ID = "ABCDE12345";
const IOS_BUNDLE_ID = "ng.kobo.app";
const ANDROID_PACKAGE = "ng.kobo.app";
// From Google Play Console (App signing) or: eas credentials
const SHA256_FINGERPRINT = "14:6D:E9:83:C5:73:06:50:D8:EE:B9:95:2F:34:FC:64:16:A0:83:42:E6:1D:BE:A8:8A:04:96:B2:3F:CF:44:E5";

export default site;
`;
const ULINK_SERVER_MODEL = `import { createServer } from "practice-server";

// Your website, https://kobo.example. To prove the app belongs to it, it must serve:
//   /.well-known/apple-app-site-association  (iOS universal links)
//   /.well-known/assetlinks.json             (Android App Links)
const site = createServer({ origin: "https://kobo.example" });

const APPLE_TEAM_ID = "ABCDE12345";
const IOS_BUNDLE_ID = "ng.kobo.app";
const ANDROID_PACKAGE = "ng.kobo.app";
// From Google Play Console (App signing) or: eas credentials
const SHA256_FINGERPRINT = "14:6D:E9:83:C5:73:06:50:D8:EE:B9:95:2F:34:FC:64:16:A0:83:42:E6:1D:BE:A8:8A:04:96:B2:3F:CF:44:E5";

// Served as JSON, over HTTPS, with no redirect, and no ".json" in the Apple file's name.
site.get("/.well-known/apple-app-site-association", (req, res) =>
  res.json({ applinks: { details: [{ appIDs: [APPLE_TEAM_ID + "." + IOS_BUNDLE_ID], components: [{ "/": "/orders/*" }] }] } })
);

site.get("/.well-known/assetlinks.json", (req, res) =>
  res.json([
    {
      relation: ["delegate_permission/common.handle_all_urls"],
      target: { namespace: "android_app", package_name: ANDROID_PACKAGE, sha256_cert_fingerprints: [SHA256_FINGERPRINT] },
    },
  ])
);

export default site;
`;
const ULINK_APP = {
  ios: { bundleIdentifier: "ng.kobo.app", associatedDomains: ["applinks:kobo.example"] },
  android: {
    package: "ng.kobo.app",
    intentFilters: [{ action: "VIEW", autoVerify: true, data: [{ scheme: "https", host: "kobo.example", pathPrefix: "/orders" }], category: ["BROWSABLE", "DEFAULT"] }],
  },
};
const ULINK_LAYOUT = `import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Kobo" }} />
      <Stack.Screen name="orders/[id]" options={{ title: "Order" }} />
    </Stack>
  );
}
`;
const ULINK_ORDER = `import { useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";

export default function Order() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return (
    <View style={{ padding: 20 }}>
      <Text>Order #{id}</Text>
    </View>
  );
}
`;

/* ── 17.5 · Offline mutations ────────────────────────────────────────── */
const OFFLINE_SERVER = `import { createServer } from "practice-server";

const app = createServer();
const saved = new Set();

app.get("/products", (req, res) => res.json([{ id: "1", name: "Ankara tote bag", saved: saved.has("1") }, { id: "2", name: "Shea butter", saved: saved.has("2") }]));
app.put("/saved/:id", (req, res) => {
  saved.add(req.params.id);
  res.json({ id: req.params.id, saved: true });
});

export default app;
`;
const OFFLINE_ONLINE_START = `import NetInfo from "@react-native-community/netinfo";
import { onlineManager } from "@tanstack/react-query";

/**
 * Tell TanStack Query when the PHONE is online. (By default it listens to the browser's
 * online events, which React Native doesn't have.) Call once, at start-up.
 */
export function connectOnlineManager() {}
`;
const OFFLINE_ONLINE_MODEL = `import NetInfo from "@react-native-community/netinfo";
import { onlineManager } from "@tanstack/react-query";

/**
 * Tell TanStack Query when the PHONE is online. (By default it listens to the browser's
 * online events, which React Native doesn't have.) Call once, at start-up.
 */
export function connectOnlineManager() {
  onlineManager.setEventListener((setOnline) =>
    // Returns NetInfo's unsubscribe function, which TanStack Query calls when done.
    NetInfo.addEventListener((state) => setOnline(state.isConnected !== false))
  );
}
`;
const OFFLINE_HOOKS_START = `import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export type Product = { id: string; name: string; saved: boolean };
const KEY = ["products"];

export function useProducts() {
  return useQuery({ queryKey: KEY, queryFn: async (): Promise<Product[]> => (await fetch("https://api.example.com/products")).json() });
}

/**
 * Saves a product: shows it as saved AT ONCE (optimistic), sends PUT /saved/:id,
 * and while the phone is offline, waits (paused) and sends it when the connection returns.
 */
export function useSaveProduct() {
  return useMutation({
    mutationFn: async (id: string) => {
      const r = await fetch("https://api.example.com/saved/" + id, { method: "PUT" });
      if (!r.ok) throw new Error("Couldn't save");
      return r.json();
    },
  });
}
`;
const OFFLINE_HOOKS_MODEL = `import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export type Product = { id: string; name: string; saved: boolean };
const KEY = ["products"];

export function useProducts() {
  return useQuery({ queryKey: KEY, queryFn: async (): Promise<Product[]> => (await fetch("https://api.example.com/products")).json() });
}

/**
 * Saves a product: shows it as saved AT ONCE (optimistic), sends PUT /saved/:id,
 * and while the phone is offline, waits (paused) and sends it when the connection returns.
 */
export function useSaveProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const r = await fetch("https://api.example.com/saved/" + id, { method: "PUT" });
      if (!r.ok) throw new Error("Couldn't save");
      return r.json();
    },
    // networkMode "online" (the default) pauses the mutation while offline: onMutate still runs at once.
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: KEY });
      const previous = queryClient.getQueryData<Product[]>(KEY);
      queryClient.setQueryData<Product[]>(KEY, (list) => list?.map((p) => (p.id === id ? { ...p, saved: true } : p)));
      return { previous };
    },
    onError: (_e, _id, context) => context?.previous && queryClient.setQueryData(KEY, context.previous),
    onSettled: () => queryClient.invalidateQueries({ queryKey: KEY }),
  });
}
`;
const OFFLINE_LAYOUT = `import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { connectOnlineManager } from "@/query/online";

connectOnlineManager();
const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <Stack>
        <Stack.Screen name="index" options={{ title: "Shop" }} />
      </Stack>
    </QueryClientProvider>
  );
}
`;
const OFFLINE_SCREEN = `import { Pressable, Text, View } from "react-native";
import { useProducts, useSaveProduct } from "@/query/products";

export default function Shop() {
  const { data = [] } = useProducts();
  const save = useSaveProduct();
  return (
    <View style={{ padding: 16, gap: 10 }}>
      {save.isPaused ? <Text accessibilityRole="alert">Saved on your phone. It will sync when you're back online.</Text> : null}
      {data.map((p) => (
        <View key={p.id} style={{ flexDirection: "row", alignItems: "center" }}>
          <Text style={{ flex: 1 }}>{p.name}</Text>
          <Pressable accessibilityRole="button" accessibilityLabel={(p.saved ? "Saved " : "Save ") + p.name} onPress={() => save.mutate(p.id)} style={{ width: 48, height: 48, justifyContent: "center", alignItems: "center" }}>
            <Text>{p.saved ? "♥" : "♡"}</Text>
          </Pressable>
        </View>
      ))}
    </View>
  );
}
`;

/* ── 17.8 · Large lists and images ───────────────────────────────────── */
const CATALOGUE = `export type Item = { id: string; name: string; price: number; image: string };

export const ITEMS: Item[] = Array.from({ length: 1000 }, (_, i) => ({
  id: String(i + 1),
  name: "Product " + (i + 1),
  price: 1500 + ((i * 731) % 90000),
  image: "https://cdn.example.com/products/" + (i + 1) + ".jpg",
}));
`;
const LIST_START = `import { Image, ScrollView, Text, View } from "react-native";
import { ITEMS } from "@/data/catalogue";

export default function Catalogue() {
  return (
    <ScrollView>
      {ITEMS.map((item) => (
        <View key={item.id} testID="row" style={{ height: 80, flexDirection: "row", alignItems: "center", gap: 12, paddingHorizontal: 16 }}>
          <Image source={{ uri: item.image }} style={{ width: 56, height: 56, borderRadius: 8 }} />
          <Text>{item.name} · ₦{item.price.toLocaleString("en-NG")}</Text>
        </View>
      ))}
    </ScrollView>
  );
}
`;
const LIST_MODEL = `import { Image } from "expo-image";
import { FlatList, Text, View } from "react-native";
import { ITEMS, type Item } from "@/data/catalogue";

const ROW_HEIGHT = 80;

function Row({ item }: { item: Item }) {
  return (
    <View testID="row" style={{ height: ROW_HEIGHT, flexDirection: "row", alignItems: "center", gap: 12, paddingHorizontal: 16 }}>
      <Image
        source={{ uri: item.image }}
        style={{ width: 56, height: 56, borderRadius: 8 }}
        // Downloaded once, kept in memory and on disk.
        cachePolicy="memory-disk"
        // Rows are recycled: this tells expo-image the picture belongs to a new item.
        recyclingKey={item.id}
        placeholder={{ blurhash: "L6PZfSi_.AyE_3t7t7R**0o#DgR4" }}
        transition={150}
        contentFit="cover"
        accessibilityLabel={item.name}
      />
      <Text>{item.name} · ₦{item.price.toLocaleString("en-NG")}</Text>
    </View>
  );
}

export default function Catalogue() {
  return (
    <FlatList
      data={ITEMS}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <Row item={item} />}
      // Every row is the same height, so the list can skip measuring.
      getItemLayout={(_, index) => ({ length: ROW_HEIGHT, offset: ROW_HEIGHT * index, index })}
      initialNumToRender={12}
      windowSize={5}
      maxToRenderPerBatch={10}
    />
  );
}
`;

export const PART1 = [
  /* ═══════════════ LESSON 105 · 17.1 – 17.2 ═══════════════ */
  {
    id: "md-l105-payments",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 1,
    covers: ["17.1", "17.2"],
    title: "Payments: Hosted Checkout and Webhooks",
    subtitle: "Taking money safely: the app starts it, the provider handles the card, the server confirms it",
    estimatedMinutes: 65,
    intro: "Payments are where mistakes cost real money. The safe pattern keeps card details away from your app entirely, and trusts only what the provider tells your server.",
    atoms: [
      {
        id: "a-md-hosted-checkout",
        title: "Payment gateway integration using a provider-supported mobile or hosted checkout flow",
        explain:
          "For PHYSICAL goods and services (deliveries, rides, tickets), use a payment provider such as Paystack, Flutterwave, Stripe or Monnify, through its HOSTED CHECKOUT or official mobile SDK, so card numbers never touch your app or server (which keeps you out of most PCI-DSS scope). The flow: the app asks YOUR server to start a payment; the server, holding the provider's secret key, initialises a transaction for the amount IT calculates and gets a checkout URL; the app opens it in a secure browser session (openAuthSessionAsync) or the provider's SDK; the customer pays (card, bank transfer, USSD, mobile money); the provider redirects back to the app. The redirect means only \"the customer came back\": ask your server for the order's real status, which the provider's verified webhook (next lab) sets. Show a pending state if it hasn't arrived yet. (Digital goods and subscriptions are different: Lesson 106.)",
        webLab: expoLab({
          name: "Kobo",
          layout: titled("Checkout"),
          app: { scheme: "kobo" },
          task:
            "Write payForOrder(orderId) in src/payments/checkout.ts: POST /orders/<id>/pay to our server to get the authorizationUrl; open it with openAuthSessionAsync (redirect kobo://payment); return \"cancelled\" if the user closes it or the redirect says status=cancelled; otherwise ask our server for the order (GET /orders/<id>) up to 4 times, half a second apart, returning \"paid\" once its status is \"paid\", or \"pending\" if it never is. Never trust the redirect's status=success on its own.",
          files: { "src/payments/checkout.ts": CHECKOUT_START, "src/app/index.tsx": CHECKOUT_SCREEN, "server/index.js": CHECKOUT_SERVER },
          readOnly: ["src/app/index.tsx", "server/index.js"],
          solution: { "src/payments/checkout.ts": CHECKOUT_MODEL },
          tests: [
            { label: "Paying confirms the order through the server", check: "await press('Pay now'); await tap('Pay ₦18,000'); await waitFor(() => has('Payment confirmed. Thank you!'), 5000); const o = await (await fetch('https://api.example.com/orders/42')).json(); return o.status === 'paid';", fail: "POST /orders/42/pay, open the URL, then GET /orders/42 until it's paid." },
            { label: "Cancelling charges nothing", check: "await restart(); await waitFor(() => has('Pay now'), 3000); await press('Pay now'); await tap('Cancel payment'); await waitFor(() => hasText('Payment cancelled'), 4000); return true;", fail: "status=cancelled in the redirect → \"cancelled\"." },
            { label: "A fake success redirect is not believed", check: "await restart(); await waitFor(() => has('Pay now'), 3000); await press('Pay now'); await tap('Simulate a fake success redirect'); await waitFor(() => hasText(\"We haven't received your payment yet\"), 6000); return serverRequests().filter((r) => r.path === '/orders/42' && r.method === 'GET').length >= 2;", fail: "Ask the server, not the redirect; give up as \"pending\" after a few tries." },
            { label: "No secret key or card handling in the app", check: "const c = code('src/payments/checkout.ts'); return !/sk_(live|test)/.test(c) && !/checkout\\.example\\.com\\/transaction/.test(c) && /openAuthSessionAsync/.test(c);", fail: "The app talks to OUR server and opens the hosted page; nothing else." },
          ],
          hint: "Linking.parse(result.url).queryParams.status tells you what the customer chose, not whether they paid.",
          successMessage: "The card stays with the provider, the price with your server, and the truth comes from a verified webhook.",
        }),
      },
      {
        id: "a-md-webhooks",
        title: "Webhooks and server-side payment verification",
        explain:
          "A WEBHOOK is the provider calling YOUR server when something happens (charge.success, transfer.failed, subscription renewed). It is the reliable source of truth, because it arrives even if the customer's phone dies right after paying. Handle it carefully: (1) VERIFY THE SIGNATURE (Paystack sends x-paystack-signature, an HMAC-SHA512 of the raw body with your secret key; others are similar), because anyone can POST to your URL; (2) act only on the events you expect; (3) check the AMOUNT and CURRENCY against what you charged (and, for extra safety, call the provider's verify endpoint); (4) be IDEMPOTENT, since providers retry webhooks until you answer 2xx: record each payment once; (5) answer 200 quickly and do slow work afterwards; (6) log unknown references rather than failing. Never mark an order paid because the app said so.",
        webLab: expoLab({
          name: "Kobo",
          layout: null,
          task:
            "Make POST /webhooks/payments safe: 401 unless x-signature equals crypto.hmacSha256(WEBHOOK_SECRET, JSON.stringify(req.body)); act only on charge.success with status \"success\"; answer 200 and change nothing for unknown references, or when the amount isn't the order's amount or the currency isn't NGN; mark the order paid and record ONE payment, even if the same webhook arrives again.",
          files: { "server/index.js": WEBHOOK_START, "src/app/index.tsx": serverOnly },
          readOnly: ["src/app/index.tsx"],
          solution: { "server/index.js": WEBHOOK_MODEL },
          tests: [
            { label: "A forged webhook is refused", check: `const r = ${hook("{ event: 'charge.success', data: { reference: 'ref_order42', amount: 1800000, currency: 'NGN', status: 'success' } }", "not-a-real-signature")}; const s = ${state}; return r.status === 401 && s.orders[0].status === 'unpaid' && s.payments.length === 0;`, fail: "Compare x-signature with crypto.hmacSha256(WEBHOOK_SECRET, JSON.stringify(req.body))." },
            { label: "A wrong amount, or an unknown reference, changes nothing", check: `${SIGN} const a = ${hook("{ event: 'charge.success', data: { reference: 'ref_order42', amount: 100, currency: 'NGN', status: 'success' } }")}; const b = ${hook("{ event: 'charge.success', data: { reference: 'ref_nobody', amount: 1800000, currency: 'NGN', status: 'success' } }")}; const s = ${state}; return a.status === 200 && b.status === 200 && s.orders[0].status === 'unpaid' && s.payments.length === 0;`, fail: "Check data.amount === order.amount and the currency; ignore unknown references with 200." },
            { label: "A real webhook marks the order paid, once", check: `${SIGN} const a = ${hook("{ event: 'charge.success', data: { reference: 'ref_order42', amount: 1800000, currency: 'NGN', status: 'success' } }")}; const b = ${hook("{ event: 'charge.success', data: { reference: 'ref_order42', amount: 1800000, currency: 'NGN', status: 'success' } }")}; const s = ${state}; return a.status === 200 && b.status === 200 && s.orders[0].status === 'paid' && s.payments.length === 1;`, fail: "Only record a payment if the order isn't already paid." },
          ],
          hint: "Check the signature before reading anything else in the body.",
          successMessage: "A webhook handler that can't be faked, double-counted or fooled by the wrong amount.",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════ LESSON 106 · 17.3 – 17.4 ═══════════════ */
  {
    id: "md-l106-iap-links",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 2,
    covers: ["17.3", "17.4"],
    title: "In-App Purchases and Universal Links",
    subtitle: "The stores' rules for digital goods, and https links that open your app",
    estimatedMinutes: 55,
    intro: "Two production features governed by the platforms themselves: how you may sell digital things, and how a normal web link can open your app.",
    atoms: [
      {
        id: "a-md-iap",
        title: "Subscription and in-app purchase fundamentals",
        explain:
          "The stores separate two kinds of sale. PHYSICAL goods and services used outside the app (deliveries, rides, tickets, tailoring) use your payment provider (Lesson 105). DIGITAL goods and features used in the app (premium features, subscriptions, coins, ad removal, digital content) must normally use the stores' own billing: Apple's In-App Purchase and Google Play Billing, which take a commission (typically 15–30%) and handle refunds, family sharing and renewals. Rules vary by country and keep changing (some regions now allow linking out to web payments), so read the current guidelines. Products are created in App Store Connect and Play Console (consumables, non-consumables, auto-renewing subscriptions); in the app, react-native-iap, expo-iap or RevenueCat's SDK (which also handles receipts and entitlements across both stores) need a development build. As with webhooks, verify purchases on your SERVER (store server notifications, or RevenueCat's webhooks) before unlocking anything, and offer \"Restore purchases\".",
        decision: {
          scenario: "Kobo wants to sell two things in its iPhone and Android apps: a ₦2,500/month \"Kobo Plus\" subscription that removes ads and unlocks price alerts, and same-day delivery of physical orders.",
          question: "How should each be paid for?",
          options: [
            { id: "a", text: "Kobo Plus through Apple In-App Purchase and Google Play Billing (verified on the server); deliveries through the payment provider's hosted checkout", why: "Kobo Plus is a digital feature used in the app, so store billing rules apply; delivery is a physical service, which the stores require you to sell through your own payment provider." },
            { id: "b", text: "Both through the payment provider, to avoid the stores' commission", whyWrong: "Selling digital features with your own payments inside the app breaks the App Store and Google Play rules in most regions, and gets the app rejected or removed." },
            { id: "c", text: "Both through In-App Purchase", whyWrong: "Physical goods and services must NOT use In-App Purchase; Apple rejects apps that try." },
            { id: "d", text: "Unlock Kobo Plus as soon as the app reports a purchase, without checking", whyWrong: "Purchases must be verified on the server (receipts or store notifications), or anyone can unlock it." },
          ],
          correct: "a",
          aftermath: "Digital, in-app: store billing. Physical, real-world: your payment provider. Always verified on the server.",
        },
      },
      {
        id: "a-md-universal-links",
        title: "Deep linking and universal links",
        explain:
          "A custom scheme (kobo://orders/42, Module 9) only works if the app is installed, and other apps can claim the same scheme. UNIVERSAL LINKS (iOS) and APP LINKS (Android) use your real website address instead: https://kobo.example/orders/42 opens the app if it's installed and the website otherwise. The phone verifies that you own both: (1) in app.json, iOS ios.associatedDomains [\"applinks:kobo.example\"] and Android android.intentFilters with autoVerify: true for https, your host and path; (2) on the website, /.well-known/apple-app-site-association (your Apple Team ID and bundle id, which paths open the app) and /.well-known/assetlinks.json (your package name and the SHA-256 fingerprint of your app-signing certificate from Play Console), served as JSON over HTTPS with no redirects. Expo Router then opens the matching route. Test on real devices with a store or development build; Expo Go can't.",
        webLab: expoLab({
          name: "Kobo",
          layout: ULINK_LAYOUT,
          editable: ["app.json"],
          task:
            "Make https://kobo.example/orders/… open the app. In app.json: ios.bundleIdentifier \"ng.kobo.app\" with associatedDomains [\"applinks:kobo.example\"], and android.package \"ng.kobo.app\" with an intent filter (action VIEW, autoVerify true, data scheme https, host kobo.example, pathPrefix /orders, categories BROWSABLE and DEFAULT). In server/index.js (the website), serve /.well-known/apple-app-site-association (appIDs \"<team id>.<bundle id>\", components matching /orders/*) and /.well-known/assetlinks.json (handle_all_urls for the Android package and SHA-256 fingerprint).",
          files: {
            "server/index.js": ULINK_SERVER_START,
            "src/app/index.tsx": `import { Text } from "react-native";\n\nexport default function Home() {\n  return <Text style={{ padding: 20 }}>Kobo</Text>;\n}\n`,
            "src/app/orders/[id].tsx": ULINK_ORDER,
          },
          readOnly: ["src/app/index.tsx", "src/app/orders/[id].tsx", "src/app/_layout.tsx"],
          solution: { "server/index.js": ULINK_SERVER_MODEL, "app.json": appJson("Kobo", ULINK_APP) },
          tests: [
            { label: "iOS: associated domains and a bundle id", check: "const ios = config().ios || {}; return ios.bundleIdentifier === 'ng.kobo.app' && (ios.associatedDomains || []).includes('applinks:kobo.example');", fail: "\"ios\": { \"bundleIdentifier\": \"ng.kobo.app\", \"associatedDomains\": [\"applinks:kobo.example\"] }" },
            { label: "Android: a verified https intent filter", check: "const a = config().android || {}; const f = (a.intentFilters || [])[0] || {}; const d = (f.data || [])[0] || {}; return a.package === 'ng.kobo.app' && f.action === 'VIEW' && f.autoVerify === true && d.scheme === 'https' && d.host === 'kobo.example' && d.pathPrefix === '/orders' && (f.category || []).includes('BROWSABLE') && (f.category || []).includes('DEFAULT');", fail: "intentFilters: [{ action: \"VIEW\", autoVerify: true, data: [{ scheme: \"https\", host: \"kobo.example\", pathPrefix: \"/orders\" }], category: [\"BROWSABLE\", \"DEFAULT\"] }]" },
            { label: "The website proves the iOS app is its own", check: "const r = await fetch('https://kobo.example/.well-known/apple-app-site-association'); const j = await r.json(); const d = j.applinks.details[0]; return r.status === 200 && /json/.test(r.headers.get('content-type')) && d.appIDs.includes('ABCDE12345.ng.kobo.app') && JSON.stringify(d.components).includes('/orders/*');", fail: "Serve { applinks: { details: [{ appIDs: [\"ABCDE12345.ng.kobo.app\"], components: [{ \"/\": \"/orders/*\" }] }] } }" },
            { label: "The website proves the Android app is its own", check: "const j = await (await fetch('https://kobo.example/.well-known/assetlinks.json')).json(); const t = j[0].target; return j[0].relation.includes('delegate_permission/common.handle_all_urls') && t.namespace === 'android_app' && t.package_name === 'ng.kobo.app' && t.sha256_cert_fingerprints[0].split(':').length === 32;", fail: "Serve [{ relation: [\"delegate_permission/common.handle_all_urls\"], target: { namespace: \"android_app\", package_name, sha256_cert_fingerprints } }]" },
          ],
          hint: "The website server's origin is https://kobo.example; res.json sends application/json.",
          successMessage: "Real https links that open the app, verified by both platforms.",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════ LESSON 107 · 17.5 – 17.6 ═══════════════ */
  {
    id: "md-l107-sync-background",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 3,
    covers: ["17.5", "17.6"],
    title: "Offline Synchronisation and Background Processing",
    subtitle: "Changes that survive no signal, and work that happens without the user",
    estimatedMinutes: 50,
    intro: "Module 12 built an outbox by hand. In production, your data library can do much of it, and the server and the OS do the rest.",
    atoms: [
      {
        id: "a-md-offline-sync",
        title: "Offline synchronization",
        explain:
          "TanStack Query already knows how to wait for the network: with networkMode \"online\" (the default), a mutation made while offline is PAUSED (mutation.isPaused) and runs when the connection returns, and queries don't fail while offline, they wait. But it must be told when the PHONE is online: in React Native, connect onlineManager to NetInfo once at start-up (onlineManager.setEventListener((setOnline) => NetInfo.addEventListener(…))). Combine with optimistic updates so the change shows at once, tell the user it will sync, and design the server for retries (idempotent PUTs, or ids made on the phone). To survive the app being closed while offline, persist the cache and paused mutations (persistQueryClient with an AsyncStorage persister) or use your own outbox (Module 12). Heavier offline-first apps use a sync engine (WatermelonDB, PowerSync, Replicache, Firestore's offline mode).",
        webLab: expoLab({
          name: "Kobo",
          layout: OFFLINE_LAYOUT,
          task:
            "Connect TanStack Query's onlineManager to NetInfo in src/query/online.ts, then make useSaveProduct (src/query/products.ts) optimistic: mark the product saved in the [\"products\"] cache at once (onMutate), restore it on error, refetch when settled. Saving while offline should show the item saved and the \"will sync\" message, send nothing, then send exactly one PUT once the phone is back online.",
          files: { "src/query/online.ts": OFFLINE_ONLINE_START, "src/query/products.ts": OFFLINE_HOOKS_START, "src/app/index.tsx": OFFLINE_SCREEN, "server/index.js": OFFLINE_SERVER },
          readOnly: ["src/app/index.tsx", "server/index.js", "src/app/_layout.tsx"],
          solution: { "src/query/online.ts": OFFLINE_ONLINE_MODEL, "src/query/products.ts": OFFLINE_HOOKS_MODEL },
          tests: [
            { label: "Online, saving works straight away", check: "await waitFor(() => exists({ role: 'button', name: 'Save Shea butter' }), 3000); await press({ role: 'button', name: 'Save Shea butter' }); await waitFor(() => exists({ role: 'button', name: 'Saved Shea butter' }), 3000); return serverRequests().filter((r) => r.method === 'PUT').length === 1;", fail: "mutate sends PUT /saved/:id." },
            { label: "Offline, it shows as saved and waits", check: "await waitFor(() => exists({ role: 'button', name: 'Save Ankara tote bag' }), 3000); await setOnline(false); await wait(100); await press({ role: 'button', name: 'Save Ankara tote bag' }); await wait(400); return exists({ role: 'button', name: 'Saved Ankara tote bag' }) && hasText(\"sync when you're back online\") && serverRequests().filter((r) => r.method === 'PUT' && r.path === '/saved/1').length === 0;", fail: "onlineManager follows NetInfo, so the mutation pauses; onMutate shows it saved." },
            { label: "Back online, it is sent once", check: "await setOnline(true); await waitFor(() => serverRequests().some((r) => r.method === 'PUT' && r.path === '/saved/1'), 3000); await wait(400); return serverRequests().filter((r) => r.method === 'PUT' && r.path === '/saved/1').length === 1 && !hasText(\"sync when you're back online\");", fail: "Paused mutations resume when onlineManager says online." },
          ],
          hint: "onlineManager.setEventListener expects a function that returns an unsubscribe function: NetInfo.addEventListener returns one.",
          successMessage: "Changes made anywhere, synced when possible, with no code to track the network yourself.",
        }),
      },
      {
        id: "a-md-background-processing",
        title: "Background processing",
        explain:
          "Choose the right place for work that shouldn't block the user. On the SERVER (best for anything important or slow): a job QUEUE (BullMQ, Cloud Tasks, SQS) for e-mails, image processing, reports and webhooks' follow-up work, with retries; scheduled jobs (cron) for daily summaries; then a PUSH to tell the phone. On the PHONE while open: async work that doesn't freeze the screen (InteractionManager.runAfterInteractions for heavy work after an animation; split huge loops; keep the JS thread free). On the PHONE when closed: expo-background-task for deferrable sync (Module 16), silent pushes (content-available on iOS, data messages on Android) to wake the app briefly, and special modes (background location, audio playback, Android foreground services with a visible notification) that stores review strictly. Never rely on the phone to do something at an exact time or at all: the OS may not run it.",
        decision: {
          scenario: "When a seller uploads 20 product photos, Kobo must make three sizes of each, scan them for banned content, and e-mail the seller when the listing is live. The first design does it all on the seller's phone, then uploads the results.",
          question: "Where should this work run?",
          options: [
            { id: "a", text: "Upload the originals (compressed) once; the server queues a job per photo for resizing and scanning, then publishes the listing and sends a push and an e-mail", why: "Heavy, important work belongs on the server, in a queue with retries: it doesn't drain the seller's battery or data, survives the app closing, and can't be skipped by a modified app." },
            { id: "b", text: "Keep it on the phone, using a background task to finish if the app is closed", whyWrong: "The OS decides if and when background tasks run; heavy image work there is unreliable and expensive, and banned-content scanning can't be trusted to the client." },
            { id: "c", text: "Do it on the phone, but show a spinner so the seller waits", whyWrong: "Minutes of blocking work on a phone, on battery and mobile data, for a job the server does better." },
            { id: "d", text: "Run it with setInterval every second until done", whyWrong: "Timers stop when the app is backgrounded, and polling wastes battery." },
          ],
          correct: "a",
          aftermath: "Important or heavy work goes to a server queue; the phone uploads, then listens for a push.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════ LESSON 108 · 17.7 – 17.8 ═══════════════ */
  {
    id: "md-l108-performance",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 4,
    covers: ["17.7", "17.8"],
    title: "Performance, Long Lists and Images",
    subtitle: "Keeping 60 frames a second on an average Android phone",
    estimatedMinutes: 55,
    intro: "Your users' phones are slower than yours. An app that's smooth on a flagship can stutter on a ₦80,000 Android: test there, measure, and fix the biggest problem first.",
    atoms: [
      {
        id: "a-md-performance",
        title: "Performance optimization",
        explain:
          "MEASURE first, on a mid-range Android phone in a RELEASE build (development builds are much slower): the Perf Monitor in the dev menu shows the UI and JS frame rates; React Native DevTools' Profiler shows what re-renders and why; Hermes sampling profiles show slow JavaScript; Android Studio and Xcode Instruments show memory and CPU. The usual causes, in order: long lists rendered all at once (use FlatList or FlashList: next lab); huge images; work on the JS thread during animations or scrolling (move animations to the UI thread with Reanimated or useNativeDriver; defer heavy work); unnecessary re-renders (Module 11: state placement; the React Compiler handles most memoization); slow START-UP (too much work before the first screen; heavy imports; large JSON parsed at launch: load lazily, show the first screen fast); and memory leaks (listeners and timers not cleaned up). Keep the bundle lean: remove unused packages, and check what each adds.",
        decision: {
          scenario: "Users say the Kobo app \"feels slow\". On your new iPhone in a development build it seems fine. You have one day to improve it.",
          question: "What should you do first?",
          options: [
            { id: "a", text: "Make a release build, use it on a mid-range Android phone, and profile the slowest screens (Perf Monitor, Profiler) to find the biggest cause", why: "Development builds and flagship phones hide problems; measuring on the kind of phone your users have, in a release build, shows which fix will matter most." },
            { id: "b", text: "Wrap every component in memo and every function in useCallback", whyWrong: "Guesswork that adds noise; the React Compiler already memoizes most things, and the real cause may be a list, an image or start-up." },
            { id: "c", text: "Rewrite the app in Kotlin and Swift", whyWrong: "A huge cost based on a guess; React Native apps can be very fast once the real bottleneck is fixed." },
            { id: "d", text: "Test on the iOS simulator, which is faster to start", whyWrong: "The simulator runs on your computer's CPU, faster than most phones: it hides exactly the problems users feel." },
          ],
          correct: "a",
          aftermath: "Measure on real, modest hardware in a release build; fix the biggest cause; measure again.",
        },
      },
      {
        id: "a-md-lists-images",
        title: "Image caching and large-list optimization",
        explain:
          "A ScrollView renders EVERY child at once: 1,000 rows means 1,000 rows of views and 1,000 image downloads before anything moves. FlatList VIRTUALISES: it renders only what's on screen plus a small window, and recycles as you scroll. Help it: a stable keyExtractor; getItemLayout when rows have a fixed height (it can skip measuring and jump instantly); initialNumToRender (enough for one screen), windowSize and maxToRenderPerBatch to tune memory against blank areas; and light row components. (Shopify's FlashList recycles views even more aggressively, for very long or complex lists.) For images, use expo-image: it CACHES (cachePolicy \"memory-disk\"), shows a placeholder (a blurhash or thumbnail) and fades in (transition), and with recyclingKey avoids showing the previous row's picture in a recycled row. Ask the server for images at the size you display (a 56-point thumbnail, not the 4000-pixel original), in modern formats such as WebP or AVIF.",
        webLab: expoLab({
          name: "Kobo",
          layout: titled("Catalogue"),
          task:
            "The catalogue renders all 1,000 products at once. Make it a FlatList (keyExtractor, getItemLayout for the fixed 80-point rows, initialNumToRender 12, windowSize 5) and use expo-image for the thumbnails with cachePolicy \"memory-disk\", a recyclingKey, a placeholder, a short transition and an accessibilityLabel of the product's name. Keep each row's testID \"row\".",
          files: { "src/app/index.tsx": LIST_START, "src/data/catalogue.ts": CATALOGUE },
          readOnly: ["src/data/catalogue.ts"],
          solution: { "src/app/index.tsx": LIST_MODEL },
          tests: [
            { label: "Only a screenful of rows is rendered at first", check: "await waitFor(() => findAll({ testID: 'row' }).length > 0, 3000); await wait(300); const n = document.querySelectorAll('[data-testid=row]').length; return n >= 10 && n < 120;", fail: "A FlatList renders a window of rows, not all 1,000." },
            { label: "Scrolling renders more", check: "await waitFor(() => findAll({ testID: 'row' }).length > 0, 3000); for (let i = 0; i < 4; i++) { await scrollDown(2000); await wait(300); } const last = [...document.querySelectorAll('[data-testid=row]')].pop(); return Number((last?.textContent.match(/Product (\\d+)/) || [0, 0])[1]) > 40;", fail: "Rows appear (and earlier ones go) as the list scrolls." },
            { label: "Images are cached and recycled properly", check: "const c = code('src/app/index.tsx'); return c.includes('from \"expo-image\"') && /cachePolicy=\"memory-disk\"/.test(c) && /recyclingKey=/.test(c) && /placeholder=/.test(c) && /getItemLayout=/.test(c) && /keyExtractor=/.test(c);", fail: "expo-image with cachePolicy, recyclingKey and a placeholder; getItemLayout and keyExtractor on the list." },
          ],
          hint: "getItemLayout={(_, index) => ({ length: 80, offset: 80 * index, index })}",
          successMessage: "A thousand products that scroll smoothly, with images downloaded once.",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },
];
