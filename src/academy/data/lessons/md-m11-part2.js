/**
 * MOBILE APP DEVELOPMENT · MODULE 11 · MANAGING APPLICATION STATE (part 2)
 *
 * Curriculum 11.7 – 11.P: choosing between Context, Zustand and
 * TanStack Query, request states, server data versus UI state, avoiding
 * unnecessary re-renders, and the module practical (a shared cart).
 *
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 */

import { expoLab } from "./md-helpers.js";
import { MODULE, MONEY, SECTION_ID, titled } from "./md-m11-part1.js";

const PRODUCT_TYPE = `export type Product = { id: string; name: string; price: number };
`;
const PRODUCTS_JSON = `[
    { id: "1", name: "Redmi Note 14", price: 185000 },
    { id: "2", name: "Ankara tote bag", price: 8500 },
    { id: "3", name: "Shea butter", price: 3000 },
  ]`;
const productServer = (list, extra = "") => `import { createServer } from "practice-server";

const app = createServer();
const products = ${list};

app.get("/products", (req, res) => res.json(products), { delay: 500 });
${extra}
export default app;
`;
const SERVER = productServer(PRODUCTS_JSON);
const SERVER_EMPTY = productServer("[]");
const PRODUCTS_SERVICE = `import type { Product } from "@/types/product";

export async function getProducts(): Promise<Product[]> {
  const response = await fetch("https://api.example.com/products");
  if (!response.ok) throw new Error("Couldn't load products (" + response.status + ")");
  return response.json();
}
`;

/* ── 11.7 · Zustand ──────────────────────────────────────────────────── */
const FAV_LAYOUT = `import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Shop" }} />
      <Stack.Screen name="favourites" options={{ title: "Favourites" }} />
    </Stack>
  );
}
`;
const FAV_DATA = `export const PRODUCTS = [
  { id: "1", name: "Redmi Note 14" },
  { id: "2", name: "Ankara tote bag" },
  { id: "3", name: "Shea butter" },
];
`;
const FAV_SHOP = `import { Link } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { PRODUCTS } from "@/data/products";
import { useFavourites } from "@/store/favourites";

function Row({ id, name }: { id: string; name: string }) {
  // Each row subscribes only to whether ITS product is saved.
  const saved = useFavourites((s) => s.ids.includes(id));
  const toggle = useFavourites((s) => s.toggle);
  return (
    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 8 }}>
      <Text style={{ fontSize: 16 }}>{name}</Text>
      <Pressable accessibilityRole="button" accessibilityLabel={(saved ? "Unsave " : "Save ") + name} onPress={() => toggle(id)} style={{ width: 48, height: 48, justifyContent: "center", alignItems: "center" }}>
        <Text>{saved ? "♥" : "♡"}</Text>
      </Pressable>
    </View>
  );
}

export default function Shop() {
  const count = useFavourites((s) => s.ids.length);
  return (
    <View style={{ padding: 16 }}>
      {PRODUCTS.map((p) => (
        <Row key={p.id} id={p.id} name={p.name} />
      ))}
      <Link href="/favourites" style={{ color: "#0f766e", paddingVertical: 12 }}>Favourites ({count})</Link>
    </View>
  );
}
`;
const FAV_LIST = `import { Text, View } from "react-native";
import { PRODUCTS } from "@/data/products";
import { useFavourites } from "@/store/favourites";

export default function Favourites() {
  const ids = useFavourites((s) => s.ids);
  const saved = PRODUCTS.filter((p) => ids.includes(p.id));
  return (
    <View style={{ padding: 16, gap: 8 }}>
      {saved.length === 0 ? <Text>No favourites yet</Text> : saved.map((p) => <Text key={p.id} testID="favourite">{p.name}</Text>)}
    </View>
  );
}
`;
const FAV_STORE_START = `// A Zustand store holding the ids of saved products.
// It needs: ids (string[], starting empty) and toggle(id), which adds or removes an id.
`;
const FAV_STORE_MODEL = `import { create } from "zustand";

type FavouritesState = {
  ids: string[];
  toggle: (id: string) => void;
};

export const useFavourites = create<FavouritesState>()((set) => ({
  ids: [],
  toggle: (id) => set((s) => ({ ids: s.ids.includes(id) ? s.ids.filter((x) => x !== id) : [...s.ids, id] })),
}));
`;

/* ── 11.8 · Request states ───────────────────────────────────────────── */
const STATES_START = `import { useEffect, useState } from "react";
import { FlatList, Text } from "react-native";
import { getProducts } from "@/services/products";
import type { Product } from "@/types/product";
import { naira } from "@/utils/money";

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    getProducts().then(setProducts);
  }, []);

  return (
    <FlatList
      data={products}
      keyExtractor={(p) => p.id}
      renderItem={({ item }) => <Text testID="product" style={{ padding: 16 }}>{item.name} · {naira(item.price)}</Text>}
    />
  );
}
`;
const STATES_MODEL = `import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Pressable, Text, View } from "react-native";
import { getProducts } from "@/services/products";
import type { Product } from "@/types/product";
import { naira } from "@/utils/money";

type State =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "success"; products: Product[] };

export default function Products() {
  const [state, setState] = useState<State>({ status: "loading" });

  const load = useCallback(() => {
    setState({ status: "loading" });
    getProducts().then(
      (products) => setState({ status: "success", products }),
      (e: Error) => setState({ status: "error", message: e.message })
    );
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (state.status === "loading") return <ActivityIndicator style={{ marginTop: 40 }} />;

  if (state.status === "error") {
    return (
      <View style={{ padding: 24, gap: 12 }}>
        <Text>{state.message}</Text>
        <Pressable accessibilityRole="button" onPress={load} style={{ minHeight: 48, justifyContent: "center" }}>
          <Text>Retry</Text>
        </Pressable>
      </View>
    );
  }

  if (state.products.length === 0) return <Text style={{ padding: 24 }}>No products yet</Text>;

  return (
    <FlatList
      data={state.products}
      keyExtractor={(p) => p.id}
      renderItem={({ item }) => <Text testID="product" style={{ padding: 16 }}>{item.name} · {naira(item.price)}</Text>}
    />
  );
}
`;

/* ── 11.9 · Server data versus UI state (TanStack Query) ─────────────── */
const RQ_LAYOUT_START = `import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Deals" }} />
      <Stack.Screen name="all" options={{ title: "All products" }} />
    </Stack>
  );
}
`;
const RQ_LAYOUT_MODEL = `import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <Stack>
        <Stack.Screen name="index" options={{ title: "Deals" }} />
        <Stack.Screen name="all" options={{ title: "All products" }} />
      </Stack>
    </QueryClientProvider>
  );
}
`;
const RQ_DEALS_START = `import { Link } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { getProducts } from "@/services/products";
import type { Product } from "@/types/product";
import { naira } from "@/utils/money";

export default function Deals() {
  const [products, setProducts] = useState<Product[] | null>(null);
  useEffect(() => {
    getProducts().then(setProducts);
  }, []);
  if (!products) return <ActivityIndicator style={{ marginTop: 40 }} />;
  const deals = products.filter((p) => p.price < 10000);
  return (
    <View style={{ padding: 16, gap: 8 }}>
      {deals.map((p) => (
        <Text key={p.id}>{p.name} · {naira(p.price)}</Text>
      ))}
      <Link href="/all" style={{ color: "#0f766e", paddingVertical: 12 }}>See all products</Link>
    </View>
  );
}
`;
const RQ_ALL_START = `import { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { getProducts } from "@/services/products";
import type { Product } from "@/types/product";
import { naira } from "@/utils/money";

export default function All() {
  const [products, setProducts] = useState<Product[] | null>(null);
  const [cheapestFirst, setCheapestFirst] = useState(false);
  useEffect(() => {
    getProducts().then(setProducts);
  }, []);
  if (!products) return <ActivityIndicator style={{ marginTop: 40 }} />;
  const shown = cheapestFirst ? [...products].sort((a, b) => a.price - b.price) : products;
  return (
    <View style={{ padding: 16, gap: 8 }}>
      <Pressable accessibilityRole="switch" accessibilityState={{ checked: cheapestFirst }} onPress={() => setCheapestFirst((v) => !v)} style={{ minHeight: 48, justifyContent: "center" }}>
        <Text>Cheapest first: {cheapestFirst ? "on" : "off"}</Text>
      </Pressable>
      {shown.map((p) => (
        <Text key={p.id} testID="product">{p.name} · {naira(p.price)}</Text>
      ))}
    </View>
  );
}
`;
const RQ_HOOK_MODEL = `import { useQuery } from "@tanstack/react-query";
import { getProducts } from "@/services/products";

/** The product list, shared and cached by every screen that asks for it. */
export function useProducts() {
  return useQuery({ queryKey: ["products"], queryFn: getProducts, staleTime: 60_000 });
}
`;
const RQ_DEALS_MODEL = `import { Link } from "expo-router";
import { ActivityIndicator, Text, View } from "react-native";
import { useProducts } from "@/hooks/useProducts";
import { naira } from "@/utils/money";

export default function Deals() {
  const { data: products, error } = useProducts();
  if (error) return <Text style={{ padding: 24 }}>{error.message}</Text>;
  if (!products) return <ActivityIndicator style={{ marginTop: 40 }} />;
  const deals = products.filter((p) => p.price < 10000);
  return (
    <View style={{ padding: 16, gap: 8 }}>
      {deals.map((p) => (
        <Text key={p.id}>{p.name} · {naira(p.price)}</Text>
      ))}
      <Link href="/all" style={{ color: "#0f766e", paddingVertical: 12 }}>See all products</Link>
    </View>
  );
}
`;
const RQ_ALL_MODEL = `import { useState } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { useProducts } from "@/hooks/useProducts";
import { naira } from "@/utils/money";

export default function All() {
  const { data: products, error } = useProducts();
  // UI state: how THIS screen shows the data. It stays local.
  const [cheapestFirst, setCheapestFirst] = useState(false);
  if (error) return <Text style={{ padding: 24 }}>{error.message}</Text>;
  if (!products) return <ActivityIndicator style={{ marginTop: 40 }} />;
  const shown = cheapestFirst ? [...products].sort((a, b) => a.price - b.price) : products;
  return (
    <View style={{ padding: 16, gap: 8 }}>
      <Pressable accessibilityRole="switch" accessibilityState={{ checked: cheapestFirst }} onPress={() => setCheapestFirst((v) => !v)} style={{ minHeight: 48, justifyContent: "center" }}>
        <Text>Cheapest first: {cheapestFirst ? "on" : "off"}</Text>
      </Pressable>
      {shown.map((p) => (
        <Text key={p.id} testID="product">{p.name} · {naira(p.price)}</Text>
      ))}
    </View>
  );
}
`;

/* ── 11.10 · Re-renders ──────────────────────────────────────────────── */
const RENDERS = `// Counts how many times each component has rendered (for this lesson only).
export const renders: Record<string, number> = {};

export function useRenderCount(name: string) {
  renders[name] = (renders[name] ?? 0) + 1;
}
`;
const RR_CONTEXT_START = `import { createContext, useContext, useState, type ReactNode } from "react";

type ShopValue = {
  cart: string[];
  add: (id: string) => void;
  note: string;
  setNote: (note: string) => void;
};

const ShopContext = createContext<ShopValue | null>(null);

export function ShopProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<string[]>([]);
  const [note, setNote] = useState("");
  const add = (id: string) => setCart((c) => [...c, id]);
  return <ShopContext.Provider value={{ cart, add, note, setNote }}>{children}</ShopContext.Provider>;
}

export function useShop() {
  const value = useContext(ShopContext);
  if (!value) throw new Error("useShop must be used inside <ShopProvider>");
  return value;
}
`;
const RR_CONTEXT_MODEL = `import { createContext, useContext, useState, type ReactNode } from "react";

type ShopValue = {
  cart: string[];
  add: (id: string) => void;
};

const ShopContext = createContext<ShopValue | null>(null);

export function ShopProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<string[]>([]);
  const add = (id: string) => setCart((c) => [...c, id]);
  return <ShopContext.Provider value={{ cart, add }}>{children}</ShopContext.Provider>;
}

export function useShop() {
  const value = useContext(ShopContext);
  if (!value) throw new Error("useShop must be used inside <ShopProvider>");
  return value;
}
`;
const RR_NOTE_START = `import { Text, TextInput, View } from "react-native";
import { useShop } from "@/context/shop";
import { useRenderCount } from "@/debug/renders";

export function NoteField() {
  useRenderCount("NoteField");
  const { note, setNote } = useShop();
  return (
    <View style={{ padding: 16, gap: 6 }}>
      <TextInput placeholder="Note to seller" value={note} onChangeText={setNote} style={{ borderWidth: 1, borderColor: "#cbd5e1", borderRadius: 10, padding: 12 }} />
      <Text>{note.length}/120</Text>
    </View>
  );
}
`;
const RR_NOTE_MODEL = `import { useState } from "react";
import { Text, TextInput, View } from "react-native";
import { useRenderCount } from "@/debug/renders";

export function NoteField() {
  useRenderCount("NoteField");
  // Only this field uses the note, so the note lives here.
  const [note, setNote] = useState("");
  return (
    <View style={{ padding: 16, gap: 6 }}>
      <TextInput placeholder="Note to seller" value={note} onChangeText={setNote} style={{ borderWidth: 1, borderColor: "#cbd5e1", borderRadius: 10, padding: 12 }} />
      <Text>{note.length}/120</Text>
    </View>
  );
}
`;
const RR_ROW = `import { Pressable, Text, View } from "react-native";
import { useShop } from "@/context/shop";
import { useRenderCount } from "@/debug/renders";

export function ProductRow({ id, name }: { id: string; name: string }) {
  useRenderCount("ProductRow");
  const { cart, add } = useShop();
  const inCart = cart.filter((x) => x === id).length;
  return (
    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 16, paddingVertical: 6 }}>
      <Text>{name}{inCart ? " (" + inCart + ")" : ""}</Text>
      <Pressable accessibilityRole="button" accessibilityLabel={"Add " + name} onPress={() => add(id)} style={{ width: 48, height: 48, justifyContent: "center", alignItems: "center" }}>
        <Text>+</Text>
      </Pressable>
    </View>
  );
}
`;
const RR_SCREEN = `import { ScrollView, Text } from "react-native";
import { NoteField } from "@/components/NoteField";
import { ProductRow } from "@/components/ProductRow";
import { useShop } from "@/context/shop";

const PRODUCTS = Array.from({ length: 30 }, (_, i) => ({ id: String(i + 1), name: "Product " + (i + 1) }));

function CartBadge() {
  const { cart } = useShop();
  return <Text style={{ padding: 16, fontWeight: "700" }}>Cart ({cart.length})</Text>;
}

export default function Shop() {
  return (
    <ScrollView>
      <CartBadge />
      <NoteField />
      {PRODUCTS.map((p) => (
        <ProductRow key={p.id} id={p.id} name={p.name} />
      ))}
    </ScrollView>
  );
}
`;
const RR_LAYOUT = `import { Stack } from "expo-router";
import { ShopProvider } from "@/context/shop";

export default function RootLayout() {
  return (
    <ShopProvider>
      <Stack>
        <Stack.Screen name="index" options={{ title: "Shop" }} />
      </Stack>
    </ShopProvider>
  );
}
`;

/* ── 11.P · The practical ────────────────────────────────────────────── */
const P_SERVER = productServer(
  PRODUCTS_JSON,
  `
const orders = [];

app.post("/orders", (req, res) => {
  const lines = req.body && req.body.lines;
  if (!Array.isArray(lines) || lines.length === 0) return res.status(400).json({ message: "The order is empty" });
  const order = { id: String(orders.length + 101), lines };
  orders.push(order);
  res.status(201).json(order);
});
`
);
const P_MODEL = {
  "src/services/api.ts": `export async function request<T>(path: string, init: { method?: string; body?: unknown } = {}): Promise<T> {
  const response = await fetch("https://api.example.com" + path, {
    method: init.method ?? "GET",
    headers: { Accept: "application/json", "Content-Type": "application/json" },
    body: init.body === undefined ? undefined : JSON.stringify(init.body),
  });
  const data = await response.json().catch(() => null);
  if (!response.ok) throw new Error(data?.message ?? "Request failed (" + response.status + ")");
  return data as T;
}
`,
  "src/services/shop.ts": `import { request } from "@/services/api";
import type { Product } from "@/types/product";

export const getProducts = () => request<Product[]>("/products");

export const placeOrder = (lines: { id: string; qty: number }[]) =>
  request<{ id: string }>("/orders", { method: "POST", body: { lines } });
`,
  "src/hooks/useProducts.ts": `import { useQuery } from "@tanstack/react-query";
import { getProducts } from "@/services/shop";

export function useProducts() {
  return useQuery({ queryKey: ["products"], queryFn: getProducts, staleTime: 60_000 });
}
`,
  "src/state/cart.ts": `import type { Product } from "@/types/product";

export type CartLine = { product: Product; qty: number };
export type CartState = { lines: CartLine[] };

export type CartAction =
  | { type: "add"; product: Product }
  | { type: "increment"; id: string }
  | { type: "decrement"; id: string }
  | { type: "remove"; id: string }
  | { type: "clear" };

export const emptyCart: CartState = { lines: [] };

export function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "add": {
      const found = state.lines.some((l) => l.product.id === action.product.id);
      return {
        lines: found
          ? state.lines.map((l) => (l.product.id === action.product.id ? { ...l, qty: l.qty + 1 } : l))
          : [...state.lines, { product: action.product, qty: 1 }],
      };
    }
    case "increment":
      return { lines: state.lines.map((l) => (l.product.id === action.id ? { ...l, qty: l.qty + 1 } : l)) };
    case "decrement":
      return {
        lines: state.lines.map((l) => (l.product.id === action.id ? { ...l, qty: l.qty - 1 } : l)).filter((l) => l.qty > 0),
      };
    case "remove":
      return { lines: state.lines.filter((l) => l.product.id !== action.id) };
    case "clear":
      return emptyCart;
  }
}

export const cartCount = (state: CartState) => state.lines.reduce((n, l) => n + l.qty, 0);
export const cartTotal = (state: CartState) => state.lines.reduce((sum, l) => sum + l.product.price * l.qty, 0);
`,
  "src/context/cart.tsx": `import { createContext, useContext, useReducer, type Dispatch, type ReactNode } from "react";
import { cartReducer, emptyCart, type CartAction, type CartState } from "@/state/cart";

const CartContext = createContext<{ state: CartState; dispatch: Dispatch<CartAction> } | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, emptyCart);
  return <CartContext.Provider value={{ state, dispatch }}>{children}</CartContext.Provider>;
}

export function useCart() {
  const value = useContext(CartContext);
  if (!value) throw new Error("useCart must be used inside <CartProvider>");
  return value;
}
`,
  "src/app/_layout.tsx": `import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { CartProvider } from "@/context/cart";

const queryClient = new QueryClient();

export const unstable_settings = { anchor: "(tabs)" };

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="product/[id]" options={{ title: "Product" }} />
        </Stack>
      </CartProvider>
    </QueryClientProvider>
  );
}
`,
  "src/app/(tabs)/_layout.tsx": `import { Tabs } from "expo-router";
import { useCart } from "@/context/cart";
import { cartCount } from "@/state/cart";

export default function TabsLayout() {
  const { state } = useCart();
  const count = cartCount(state);
  return (
    <Tabs>
      <Tabs.Screen name="index" options={{ title: "Shop" }} />
      <Tabs.Screen name="cart" options={{ title: "Cart", tabBarBadge: count > 0 ? count : undefined }} />
    </Tabs>
  );
}
`,
  "src/app/(tabs)/index.tsx": `import { Link } from "expo-router";
import { ActivityIndicator, FlatList, Pressable, Text, View } from "react-native";
import { useProducts } from "@/hooks/useProducts";
import { naira } from "@/utils/money";

export default function Shop() {
  const { data, error, refetch } = useProducts();
  if (error) {
    return (
      <View style={{ padding: 24, gap: 12 }}>
        <Text>{error.message}</Text>
        <Pressable accessibilityRole="button" onPress={() => refetch()} style={{ minHeight: 48, justifyContent: "center" }}>
          <Text>Retry</Text>
        </Pressable>
      </View>
    );
  }
  if (!data) return <ActivityIndicator style={{ marginTop: 40 }} />;
  return (
    <FlatList
      data={data}
      keyExtractor={(p) => p.id}
      renderItem={({ item }) => (
        <Link href={"/product/" + item.id} testID="product" style={{ padding: 16, fontSize: 16 }}>
          {item.name} · {naira(item.price)}
        </Link>
      )}
    />
  );
}
`,
  "src/app/product/[id].tsx": `import { router, Stack, useLocalSearchParams } from "expo-router";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { useCart } from "@/context/cart";
import { useProducts } from "@/hooks/useProducts";
import { naira } from "@/utils/money";

export default function ProductScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data } = useProducts();
  const { dispatch } = useCart();
  if (!data) return <ActivityIndicator style={{ marginTop: 40 }} />;
  const product = data.find((p) => p.id === id);
  if (!product) return <Text style={{ padding: 24 }}>Product not found</Text>;
  return (
    <View style={{ padding: 24, gap: 12 }}>
      <Stack.Screen options={{ title: product.name }} />
      <Text style={{ fontSize: 22, fontWeight: "700" }}>{product.name}</Text>
      <Text>{naira(product.price)}</Text>
      <Pressable
        accessibilityRole="button"
        onPress={() => {
          dispatch({ type: "add", product });
          router.back();
        }}
        style={{ minHeight: 48, borderRadius: 12, backgroundColor: "#0f766e", justifyContent: "center", alignItems: "center" }}
      >
        <Text style={{ color: "#fff", fontWeight: "700" }}>Add to cart</Text>
      </Pressable>
    </View>
  );
}
`,
  "src/app/(tabs)/cart.tsx": `import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { useCart } from "@/context/cart";
import { placeOrder } from "@/services/shop";
import { cartTotal } from "@/state/cart";
import { naira } from "@/utils/money";

export default function Cart() {
  const { state, dispatch } = useCart();
  const [status, setStatus] = useState<"idle" | "sending" | "error">("idle");
  const [message, setMessage] = useState("");

  async function checkout() {
    setStatus("sending");
    try {
      const order = await placeOrder(state.lines.map((l) => ({ id: l.product.id, qty: l.qty })));
      dispatch({ type: "clear" });
      setStatus("idle");
      setMessage("Order #" + order.id + " placed");
    } catch (e) {
      setStatus("error");
      setMessage((e as Error).message);
    }
  }

  if (state.lines.length === 0) {
    return <Text style={{ padding: 24 }}>{message || "Your cart is empty"}</Text>;
  }

  return (
    <View style={{ padding: 16, gap: 10 }}>
      {state.lines.map((l) => (
        <View key={l.product.id} style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <Text style={{ flex: 1 }}>{l.qty} × {l.product.name}</Text>
          <Pressable accessibilityRole="button" accessibilityLabel={"Fewer " + l.product.name} onPress={() => dispatch({ type: "decrement", id: l.product.id })} style={{ width: 44, height: 44, justifyContent: "center", alignItems: "center" }}>
            <Text>−</Text>
          </Pressable>
          <Pressable accessibilityRole="button" accessibilityLabel={"More " + l.product.name} onPress={() => dispatch({ type: "increment", id: l.product.id })} style={{ width: 44, height: 44, justifyContent: "center", alignItems: "center" }}>
            <Text>+</Text>
          </Pressable>
        </View>
      ))}
      <Text style={{ fontSize: 18, fontWeight: "700" }}>Total {naira(cartTotal(state))}</Text>
      {status === "error" ? <Text>{message}</Text> : null}
      <Pressable accessibilityRole="button" disabled={status === "sending"} onPress={checkout} style={{ minHeight: 48, borderRadius: 12, backgroundColor: "#0f766e", justifyContent: "center", alignItems: "center" }}>
        <Text style={{ color: "#fff", fontWeight: "700" }}>{status === "sending" ? "Placing order…" : "Checkout"}</Text>
      </Pressable>
    </View>
  );
}
`,
};
const P_REDUCER_TEST = `const { cartReducer, emptyCart, cartCount, cartTotal } = load('src/state/cart.ts'); const a = { id: '2', name: 'Ankara tote bag', price: 8500 }; const b = { id: '3', name: 'Shea butter', price: 3000 }; let s = cartReducer(emptyCart, { type: 'add', product: a }); s = cartReducer(s, { type: 'add', product: a }); s = cartReducer(s, { type: 'add', product: b }); const t1 = cartCount(s) === 3 && cartTotal(s) === 20000 && s.lines.length === 2; s = cartReducer(s, { type: 'decrement', id: '3' }); const t2 = s.lines.length === 1; s = cartReducer(s, { type: 'increment', id: '2' }); const t3 = cartCount(s) === 3; const frozen = Object.freeze({ lines: Object.freeze([...s.lines]) }); const after = cartReducer(frozen, { type: 'remove', id: '2' }); return t1 && t2 && t3 && after.lines.length === 0 && frozen.lines.length === 1 && cartReducer(s, { type: 'clear' }).lines.length === 0;`;

export const PART2 = [
  /* ═══════════════ LESSON 66 · 11.7 ═══════════════ */
  {
    id: "md-l66-choosing",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 4,
    covers: ["11.7"],
    title: "Context, Zustand or a Server-State Tool?",
    subtitle: "Choosing the right home for each kind of data",
    estimatedMinutes: 45,
    intro: "React's own tools go a long way. Two small libraries cover the rest: Zustand for app-wide client state, TanStack Query for data that lives on a server.",
    atoms: [
      {
        id: "a-md-choosing-state",
        title: "Choosing between Context, a lightweight state library, and server-state tools",
        explain:
          "Sort data by WHERE IT REALLY LIVES. (1) UI state used by one component or screen (an open menu, a field's text): useState, local. (2) Client state shared app-wide that changes rarely (signed-in user, theme, language): Context is enough. (3) Client state shared app-wide that changes often or is read by many components (a cart, favourites, a player's queue): a small store such as ZUSTAND: create((set) => ({ ids: [], toggle })) gives a hook usable anywhere, no provider, and SELECTORS (useFavourites((s) => s.ids.includes(id))) re-render a component only when the part it selects changes. (4) SERVER state, a copy of data that lives on a server (products, orders, messages): a server-state tool such as TANSTACK QUERY, which caches, deduplicates, refetches and tracks loading and errors for you (Lesson 67). Most bugs in big apps come from putting server data in Context or a store and trying to keep it fresh by hand.",
        webLab: expoLab({
          name: "Kobo",
          layout: FAV_LAYOUT,
          task:
            "Write the favourites store in src/store/favourites.ts with Zustand: export useFavourites, created with create<FavouritesState>()(…), holding ids (an empty array at first) and toggle(id), which adds the id if it is missing and removes it if present. The screens already use it with selectors; no provider is needed.",
          files: { "src/store/favourites.ts": FAV_STORE_START, "src/app/index.tsx": FAV_SHOP, "src/app/favourites.tsx": FAV_LIST, "src/data/products.ts": FAV_DATA },
          readOnly: ["src/app/index.tsx", "src/app/favourites.tsx", "src/data/products.ts"],
          solution: { "src/store/favourites.ts": FAV_STORE_MODEL },
          tests: [
            { label: "Saving products updates the count", check: "await waitFor(() => has('Favourites (0)'), 2000); await press({ role: 'button', name: 'Save Redmi Note 14' }); await press({ role: 'button', name: 'Save Shea butter' }); return has('Favourites (2)') && exists({ role: 'button', name: 'Unsave Shea butter' });", fail: "toggle adds the id: set((s) => ({ ids: [...s.ids, id] }))" },
            { label: "Another screen sees the same favourites", check: "await press('Favourites (2)'); await waitFor(() => path() === '/favourites', 2000); return findAll({ testID: 'favourite' }).map((e) => e.textContent).join() === 'Redmi Note 14,Shea butter';", fail: "One store, read by every screen." },
            { label: "Toggling again removes it", check: "await back(); await waitFor(() => has('Favourites (2)'), 2000); await press({ role: 'button', name: 'Unsave Redmi Note 14' }); return has('Favourites (1)');", fail: "toggle removes an id that is already there." },
            { label: "It is a Zustand store with no provider", check: "const c = code('src/store/favourites.ts'); return c.includes('from \"zustand\"') && c.includes('create') && !code('src/app/_layout.tsx').includes('Provider');", fail: "import { create } from \"zustand\";" },
          ],
          hint: "set((s) => ({ ids: s.ids.includes(id) ? s.ids.filter(…) : [...s.ids, id] }))",
          successMessage: "App-wide state with no provider, and rows that re-render only when their own heart changes.",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════ LESSON 67 · 11.8 – 11.9 ═══════════════ */
  {
    id: "md-l67-server-state",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 5,
    covers: ["11.8", "11.9"],
    title: "Request States and Server Data",
    subtitle: "Loading, error, empty and success, and TanStack Query",
    estimatedMinutes: 55,
    intro: "Data from a server is never simply there: it is loading, or failed, or empty, or ready. Every screen that fetches must handle all four.",
    atoms: [
      {
        id: "a-md-request-state-ui",
        title: "Managing loading, success, empty, and error states",
        explain:
          "A request is in one of four states, and the screen needs something for each: LOADING (an ActivityIndicator or skeleton, so the app doesn't look frozen), ERROR (what went wrong in plain words, and a Retry button), EMPTY (a message, not a blank screen), and SUCCESS (the data). Model them as ONE state value with a TypeScript union, { status: \"loading\" } | { status: \"error\"; message } | { status: \"success\"; products }, rather than separate isLoading, error and data variables that can contradict each other (loading AND error?). TypeScript then only lets you read products once status is \"success\". On phones, test the error state for real: turn on airplane mode.",
        webLab: expoLab({
          name: "Kobo",
          layout: titled("Products"),
          task:
            "The screen only handles success: it shows nothing while loading, nothing on failure, and nothing when the list is empty. Model the request with one union state, and show an ActivityIndicator while loading, the error message with a Retry button (which loads again) on failure, \"No products yet\" when empty, and the list on success.",
          files: {
            "src/app/index.tsx": STATES_START,
            "src/services/products.ts": PRODUCTS_SERVICE,
            "src/types/product.ts": PRODUCT_TYPE,
            "src/utils/money.ts": MONEY,
            "server/index.js": SERVER,
          },
          readOnly: ["src/services/products.ts", "src/types/product.ts", "src/utils/money.ts", "server/index.js"],
          solution: { "src/app/index.tsx": STATES_MODEL },
          tests: [
            { label: "A spinner shows while loading, then the products", check: "await restart(); const spinning = exists({ role: 'progressbar' }); await waitFor(() => findAll({ testID: 'product' }).length === 3, 3000); return spinning && !exists({ role: 'progressbar' });", fail: "if (state.status === \"loading\") return <ActivityIndicator />" },
            { label: "Offline, the error shows with Retry, and Retry recovers", check: "await setOnline(false); await restart(); await waitFor(() => has('Network request failed'), 3000); const retry = exists({ role: 'button', name: 'Retry' }); await setOnline(true); await press('Retry'); await waitFor(() => findAll({ testID: 'product' }).length === 3, 3000); return retry;", fail: "The error state shows e.message and a Retry button that calls load()." },
            { label: "An empty list gets its message", swap: { "server/index.js": SERVER_EMPTY }, check: "await waitFor(() => has('No products yet'), 3000); return true;", fail: "if (state.products.length === 0) …" },
            { label: "One union state, not three variables", check: "const c = code('src/app/index.tsx'); return /status:\\s*\"loading\"/.test(c) && /status:\\s*\"error\"/.test(c) && /status:\\s*\"success\"/.test(c) && (c.match(/useState/g) || []).length === 2;", fail: "type State = { status: \"loading\" } | { status: \"error\"; message: string } | { status: \"success\"; products: Product[] }" },
          ],
          hint: "One load function, used by the effect and by Retry.",
          successMessage: "Four states, all handled. The app never looks frozen or broken.",
        }),
      },
      {
        id: "a-md-server-vs-ui",
        title: "Separating remote server data from local UI state",
        explain:
          "Server data is a CACHE of something that lives elsewhere: it can go stale, several screens need it, and it should not be fetched again on every visit. TANSTACK QUERY manages that: wrap the app in <QueryClientProvider client={queryClient}> (one QueryClient, created outside any component), then useQuery({ queryKey: [\"products\"], queryFn: getProducts }) anywhere. Every screen using the same KEY shares one request and one cached result; staleTime says how long it stays fresh; it gives you data, error, isPending and refetch, and useMutation plus queryClient.invalidateQueries handle changes. UI state (sort order, a selected tab, a draft) is NOT server data: it stays in useState. On phones, also connect its focusManager to AppState and its onlineManager to NetInfo (see TanStack Query's React Native guide) so it refetches when the app returns to the foreground or comes back online.",
        webLab: expoLab({
          name: "Kobo",
          layout: RQ_LAYOUT_START,
          editable: ["src/app/_layout.tsx"],
          task:
            "Both screens fetch the same products separately, so opening \"See all products\" downloads them again. Add a QueryClientProvider to the root layout, write useProducts() in src/hooks/useProducts.ts with useQuery (key [\"products\"], getProducts, a staleTime of a minute), and use it in both screens. Keep the \"Cheapest first\" switch as local state.",
          files: {
            "src/hooks/useProducts.ts": "",
            "src/app/index.tsx": RQ_DEALS_START,
            "src/app/all.tsx": RQ_ALL_START,
            "src/services/products.ts": PRODUCTS_SERVICE,
            "src/types/product.ts": PRODUCT_TYPE,
            "src/utils/money.ts": MONEY,
            "server/index.js": SERVER,
          },
          readOnly: ["src/services/products.ts", "src/types/product.ts", "src/utils/money.ts", "server/index.js"],
          solution: { "src/app/_layout.tsx": RQ_LAYOUT_MODEL, "src/hooks/useProducts.ts": RQ_HOOK_MODEL, "src/app/index.tsx": RQ_DEALS_MODEL, "src/app/all.tsx": RQ_ALL_MODEL },
          tests: [
            { label: "Both screens show the products", check: "await waitFor(() => has('Shea butter · ₦3,000'), 3000); await press('See all products'); await waitFor(() => findAll({ testID: 'product' }).length === 3, 3000); return true;", fail: "const { data } = useProducts(); in both screens." },
            { label: "The products are downloaded once, however you navigate", check: "if (path() !== '/') await back(); await waitFor(() => has('See all products'), 3000); await press('See all products'); await waitFor(() => findAll({ testID: 'product' }).length === 3, 3000); await back(); await press('See all products'); await waitFor(() => findAll({ testID: 'product' }).length === 3, 3000); return serverRequests().filter((r) => r.path === '/products').length === 1;", fail: "The same queryKey and a staleTime share one cached request." },
            { label: "Sorting stays local UI state", check: "if (path() !== '/') await back(); await waitFor(() => has('See all products'), 3000); await press('See all products'); await waitFor(() => findAll({ testID: 'product' }).length === 3, 3000); await press('Cheapest first: off'); return findAll({ testID: 'product' })[0].textContent.startsWith('Shea butter') && code('src/app/all.tsx').includes('useState');", fail: "Keep useState for cheapestFirst." },
            { label: "No screen fetches by itself", check: "return !code('src/app/index.tsx').includes('getProducts') && !code('src/app/all.tsx').includes('getProducts') && code('src/app/_layout.tsx').includes('QueryClientProvider');", fail: "Screens use the hook; the layout provides the client." },
          ],
          hint: "Create the QueryClient once, outside RootLayout.",
          successMessage: "Server data cached and shared; UI state kept local.",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════ LESSON 68 · 11.10 ═══════════════ */
  {
    id: "md-l68-rerenders",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 6,
    covers: ["11.10"],
    title: "Avoiding Unnecessary Re-renders",
    subtitle: "Where state lives decides what re-renders",
    estimatedMinutes: 45,
    intro: "On a phone, wasted renders show up as lag when typing or scrolling. Most of them come from state living in the wrong place.",
    atoms: [
      {
        id: "a-md-rerenders",
        title: "Avoiding unnecessary re-renders",
        explain:
          "A component re-renders when its state changes, when its parent re-renders, or when a context it reads changes. The Expo template turns on the REACT COMPILER (app.json: experiments.reactCompiler), which automatically memoizes components and values, so a parent re-rendering no longer re-renders children whose props did not change; you rarely need memo, useMemo or useCallback by hand. What the compiler cannot fix is state in the wrong place: every component that reads a context re-renders whenever that context's value changes, so a fast-changing value (typing) in a shared context re-renders everything that uses it. The fixes: keep state as local as possible; split a context so fast and slow values are separate; or use a store with selectors (Zustand). Measure before optimising: React Native DevTools' Profiler shows what rendered and why.",
        webLab: expoLab({
          name: "Kobo",
          layout: RR_LAYOUT,
          task:
            "Typing a note re-renders all 30 product rows, because the note lives in the shop context that every row reads. Only NoteField uses the note: move it into NoteField's own state and take it out of the context. Adding products must still work.",
          files: {
            "src/context/shop.tsx": RR_CONTEXT_START,
            "src/components/NoteField.tsx": RR_NOTE_START,
            "src/components/ProductRow.tsx": RR_ROW,
            "src/app/index.tsx": RR_SCREEN,
            "src/debug/renders.ts": RENDERS,
          },
          readOnly: ["src/components/ProductRow.tsx", "src/app/index.tsx", "src/debug/renders.ts"],
          solution: { "src/context/shop.tsx": RR_CONTEXT_MODEL, "src/components/NoteField.tsx": RR_NOTE_MODEL },
          tests: [
            { label: "Typing a note no longer re-renders the rows", check: "await waitFor(() => has('Product 30'), 2000); const r = load('src/debug/renders.ts').renders; const rows = r.ProductRow; const field = r.NoteField; await typeInto('Note to seller', 'Gift wrap, please'); await waitFor(() => has('17/120'), 2000); return rows >= 30 && r.ProductRow === rows && r.NoteField > field;", fail: "const [note, setNote] = useState(\"\") inside NoteField." },
            { label: "Adding to the cart still updates the badge and the row", check: "await press({ role: 'button', name: 'Add Product 3' }); await waitFor(() => has('Cart (1)'), 2000); return has('Product 3 (1)');", fail: "Keep cart and add in the context." },
            { label: "The note is gone from the context", check: "return !code('src/context/shop.tsx').includes('note');", fail: "Remove note and setNote from ShopValue and the provider." },
          ],
          hint: "NoteField no longer needs useShop at all.",
          successMessage: "Typing now re-renders one component instead of thirty-one.",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════ LESSON 69 · 11.P ═══════════════ */
  {
    id: "md-l69-m11-project",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 7,
    covers: ["11.P"],
    title: "Practical: A Shopping Cart Shared Across Screens",
    subtitle: "A reducer, Context and cached server data working together",
    estimatedMinutes: 120,
    intro: "Every kind of state in one app: server data (products), shared client state (the cart), and local UI state (the checkout status).",
    atoms: [
      {
        id: "a-md-m11-project",
        title: "Build the shop",
        explain:
          "The server and the Product type are given. Products come from the server through TanStack Query; the cart is a reducer shared through Context; each screen keeps its own UI state. Decide, for each piece of data, where it lives before writing it.",
        webLab: expoLab({
          name: "Kobo",
          layout: null,
          task:
            "Build: src/state/cart.ts with cartReducer (state { lines: { product, qty }[] }; actions add {product}, increment {id}, decrement {id} (removing at 0), remove {id}, clear), emptyCart, cartCount(state) and cartTotal(state); src/context/cart.tsx with CartProvider (useReducer) and useCart(); useProducts() with TanStack Query; services for GET /products and POST /orders ({ lines: [{ id, qty }] }). Screens: root Stack (QueryClientProvider and CartProvider; anchor \"(tabs)\") with (tabs) and product/[id]; tabs \"Shop\" (products as links to /product/<id>, testID \"product\") and \"Cart\" (with a badge showing the count). The product screen shows its name as the title and \"Add to cart\", which adds it and goes back. The cart shows \"<qty> × <name>\" lines with buttons labelled \"Fewer <name>\" and \"More <name>\", \"Total ₦…\", and \"Checkout\", which places the order, empties the cart and shows \"Order #<id> placed\"; an empty cart says \"Your cart is empty\".",
          files: {
            "src/app/_layout.tsx": "// The root Stack and the providers.\n",
            "src/app/(tabs)/_layout.tsx": "// The tabs.\n",
            "src/app/(tabs)/index.tsx": "// The shop.\n",
            "src/app/(tabs)/cart.tsx": "// The cart.\n",
            "src/app/product/[id].tsx": "// One product.\n",
            "src/state/cart.ts": "",
            "src/context/cart.tsx": "",
            "src/hooks/useProducts.ts": "",
            "src/services/api.ts": "",
            "src/services/shop.ts": "",
            "src/types/product.ts": PRODUCT_TYPE,
            "src/utils/money.ts": MONEY,
            "server/index.js": P_SERVER,
          },
          readOnly: ["src/types/product.ts", "src/utils/money.ts", "server/index.js"],
          revealSolution: false,
          solution: P_MODEL,
          tests: [
            { label: "The cart reducer follows every rule, without mutating", check: P_REDUCER_TEST, fail: "add merges, decrement removes at 0, remove and clear; always return new objects." },
            { label: "The shop lists the server's products", check: "await waitFor(() => findAll({ testID: 'product' }).length === 3, 3000); return hasText('Redmi Note 14');", fail: "useProducts() in the Shop tab." },
            { label: "Adding from the product screen fills the cart", check: "await waitFor(() => findAll({ testID: 'product' }).length === 3, 3000); await press(findAll({ testID: 'product' })[1]); await waitFor(() => screenTitle() === 'Ankara tote bag', 3000); await press('Add to cart'); await waitFor(() => path() === '/', 3000); await press(findAll({ testID: 'product' })[2]); await waitFor(() => has('Add to cart'), 3000); await press('Add to cart'); await waitFor(() => path() === '/', 3000); await press({ role: 'tab', name: /Cart/ }); await waitFor(() => has('1 × Ankara tote bag'), 3000); return has('1 × Shea butter') && has('Total ₦11,500');", fail: "dispatch({ type: \"add\", product }) then router.back(); the cart reads the shared state." },
            { label: "Quantities change in the cart and the total follows", check: "await press({ role: 'button', name: 'More Ankara tote bag' }); await press({ role: 'button', name: 'Fewer Shea butter' }); return has('2 × Ankara tote bag') && !hasText('Shea butter') && has('Total ₦17,000');", fail: "increment and decrement actions; the total is derived." },
            { label: "Checkout places the order and empties the cart", check: "await press('Checkout'); await waitFor(() => hasText('placed'), 3000); const post = serverRequests().find((r) => r.method === 'POST' && r.path === '/orders'); return has('Order #101 placed') && !!post && JSON.stringify(post.body.lines) === JSON.stringify([{ id: '2', qty: 2 }]);", fail: "POST { lines: [{ id, qty }] }, then dispatch({ type: \"clear\" })." },
            { label: "Products were downloaded only once", check: "return serverRequests().filter((r) => r.path === '/products').length === 1;", fail: "The product screen reuses the [\"products\"] query instead of fetching again." },
          ],
          hint: "Write and test the reducer first: it is the heart of the cart.",
          successMessage: "Server data cached, client state shared, UI state local: the three kinds of state, each in its place.",
        }),
      },
    ],
    task: {
      title: "Module 11 practical: state in your own app",
      intro: "Apply this module to the app you are building.",
      prompts: [
        "List every piece of data in your app and label it: local UI state, shared client state, or server data. Move any that are in the wrong place.",
        "Replace hand-written fetching of server data with TanStack Query, and handle loading, error and empty states on every screen.",
        "Put any state with several rules into a reducer, and write down its actions.",
        "Open React Native DevTools (press j), record a Profiler session while typing and scrolling, and fix the biggest unnecessary re-render.",
        "Mastery checkpoint: for each piece of data, say where it lives and why, and which screens re-render when it changes.",
      ],
      closing: "Next: Module 12, forms and persistent data.",
    },
    requirements: { read: true, video: false, assessment: true },
  },
];
