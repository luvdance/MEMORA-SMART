/**
 * MOBILE APP DEVELOPMENT · MODULE 18 · TESTING MOBILE APPLICATIONS (part 2)
 *
 * Curriculum 18.9 – 18.P: screen sizes, slow and interrupted networks,
 * debugging rendering problems, logs and stack traces, performance and
 * memory problems, regression tests, crash reports, and the practical.
 *
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 */

import { expoLab } from "./md-helpers.js";
import { MODULE, SECTION_ID, suite } from "./md-m18-part1.js";

const titled = (title) => `import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "${title}" }} />
    </Stack>
  );
}
`;
const testsOnly = (msg) => `import { Text } from "react-native";

export default function Home() {
  return <Text style={{ padding: 20 }}>${msg}</Text>;
}
`;

/* ── 18.9 · Screen sizes ─────────────────────────────────────────────── */
const GRID_DATA = `export const PRODUCTS = ["Ankara tote bag", "Shea butter", "Adire scarf", "Raffia mat", "Clay pot", "Kente stole"].map((name, i) => ({ id: String(i + 1), name }));
`;
const GRID_START = `import { ScrollView, Text, View } from "react-native";
import { PRODUCTS } from "@/data/products";

export default function Shop() {
  return (
    <ScrollView contentContainerStyle={{ flexDirection: "row", flexWrap: "wrap", padding: 8 }}>
      {PRODUCTS.map((p) => (
        <View key={p.id} testID="card" style={{ width: 180, height: 120, margin: 8, borderRadius: 12, backgroundColor: "#ccfbf1", padding: 12 }}>
          <Text numberOfLines={1}>{p.name}</Text>
        </View>
      ))}
    </ScrollView>
  );
}
`;
const GRID_MODEL = `import { ScrollView, Text, useWindowDimensions, View } from "react-native";
import { PRODUCTS } from "@/data/products";

const GAP = 8;
const PADDING = 8;

export default function Shop() {
  // Re-renders on rotation, split screen and different phones.
  const { width } = useWindowDimensions();
  const columns = width >= 600 ? 3 : 2;
  const cardWidth = Math.floor((width - PADDING * 2 - GAP * 2 * columns) / columns);

  return (
    <ScrollView contentContainerStyle={{ flexDirection: "row", flexWrap: "wrap", padding: PADDING }}>
      {PRODUCTS.map((p) => (
        // minHeight, not height: the text can grow with the user's font size.
        <View key={p.id} testID="card" style={{ width: cardWidth, minHeight: 120, margin: GAP, borderRadius: 12, backgroundColor: "#ccfbf1", padding: 12 }}>
          <Text>{p.name}</Text>
        </View>
      ))}
    </ScrollView>
  );
}
`;
const columnsCheck = (n) =>
  `await wait(300); const cards = findAll({ testID: 'card' }).map((c) => c.getBoundingClientRect()); const xs = new Set(cards.map((r) => Math.round(r.left))); const w = window.innerWidth; return cards.length === 6 && xs.size === ${n} && cards.every((r) => r.right <= w + 0.5 && r.left >= 0);`;

/* ── 18.10 · Slow and interrupted networks ───────────────────────────── */
const NET_UTILS = `/** fetch that gives up after timeoutMs, with an error named "TimeoutError". */
export async function fetchWithTimeout(url: string, { timeoutMs = 10_000, ...init }: RequestInit & { timeoutMs?: number } = {}): Promise<Response> {
  const controller = new AbortController();
  let timedOut = false;
  const timer = setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, timeoutMs);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } catch (e) {
    if (timedOut) throw Object.assign(new Error("The server took too long to respond"), { name: "TimeoutError" });
    throw e;
  } finally {
    clearTimeout(timer);
  }
}

/** Retries 5xx and 429 (and network errors) up to \`retries\` more times; other statuses are returned at once. */
export async function withRetry(send: () => Promise<Response>, { retries = 3, delayMs = 0 } = {}): Promise<Response> {
  for (let attempt = 0; ; attempt++) {
    try {
      const response = await send();
      if ((response.status < 500 && response.status !== 429) || attempt === retries) return response;
    } catch (e) {
      if (!(e instanceof TypeError) || attempt === retries) throw e;
    }
    await new Promise((r) => setTimeout(r, delayMs));
  }
}
`;
const netMutant = (from, to) => ({ "src/http/net.ts": NET_UTILS.replace(from, to) });
const NET_TEST_START = `import { fetchWithTimeout, withRetry } from "@/http/net";

const status = (code: number) => new Response("{}", { status: code });

/** A fetch that never answers, until it is aborted (as a dead connection behaves). */
const hanging = (_url: unknown, init?: RequestInit) =>
  new Promise<Response>((_, reject) => {
    init?.signal?.addEventListener("abort", () => reject(Object.assign(new Error("Aborted"), { name: "AbortError" })));
  });

afterEach(() => {
  jest.useRealTimers();
  jest.restoreAllMocks();
});

test("a 400 is not retried", async () => {
  const send = jest.fn().mockResolvedValue(status(400));
  const r = await withRetry(send);
  expect(r.status).toBe(400);
  expect(send).toHaveBeenCalledTimes(1);
});

// Add tests: a hanging request times out (fake timers: jest.useFakeTimers(), then
// jest.advanceTimersByTime) with a TimeoutError; a 503 then a 200 is retried once;
// a network TypeError is retried; giving up returns the last response after retries + 1 calls.
`;
const NET_TEST_MODEL = `import { fetchWithTimeout, withRetry } from "@/http/net";

const status = (code: number) => new Response("{}", { status: code });

/** A fetch that never answers, until it is aborted (as a dead connection behaves). */
const hanging = (_url: unknown, init?: RequestInit) =>
  new Promise<Response>((_, reject) => {
    init?.signal?.addEventListener("abort", () => reject(Object.assign(new Error("Aborted"), { name: "AbortError" })));
  });

afterEach(() => {
  jest.useRealTimers();
  jest.restoreAllMocks();
});

test("a 400 is not retried", async () => {
  const send = jest.fn().mockResolvedValue(status(400));
  const r = await withRetry(send);
  expect(r.status).toBe(400);
  expect(send).toHaveBeenCalledTimes(1);
});

test("a hanging request times out", async () => {
  jest.useFakeTimers();
  jest.spyOn(globalThis, "fetch").mockImplementation(hanging as typeof fetch);
  const pending = fetchWithTimeout("https://api.example.com/slow", { timeoutMs: 5000 });
  jest.advanceTimersByTime(5000);
  let error: Error | null = null;
  try {
    await pending;
  } catch (e) {
    error = e as Error;
  }
  expect(error?.name).toBe("TimeoutError");
});

test("a fast answer is not cut off", async () => {
  jest.spyOn(globalThis, "fetch").mockResolvedValue(status(200));
  const r = await fetchWithTimeout("https://api.example.com/fast", { timeoutMs: 5000 });
  expect(r.status).toBe(200);
});

test("a 503 then a 200 is retried once", async () => {
  const send = jest.fn().mockResolvedValueOnce(status(503)).mockResolvedValueOnce(status(200));
  const r = await withRetry(send);
  expect(r.status).toBe(200);
  expect(send).toHaveBeenCalledTimes(2);
});

test("a dropped connection is retried", async () => {
  const send = jest.fn().mockRejectedValueOnce(new TypeError("Network request failed")).mockResolvedValueOnce(status(200));
  const r = await withRetry(send);
  expect(r.status).toBe(200);
});

test("it gives up after retries + 1 attempts", async () => {
  const send = jest.fn().mockResolvedValue(status(503));
  const r = await withRetry(send, { retries: 2 });
  expect(r.status).toBe(503);
  expect(send).toHaveBeenCalledTimes(3);
});
`;

/* ── 18.11 · A rendering bug ─────────────────────────────────────────── */
const KEYS_START = `import { useState } from "react";
import { Pressable, Text, View } from "react-native";

function TaskRow({ title, onDelete }: { title: string; onDelete: () => void }) {
  const [done, setDone] = useState(false);
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
      <Pressable accessibilityRole="checkbox" accessibilityState={{ checked: done }} accessibilityLabel={title} onPress={() => setDone(!done)} style={{ minHeight: 44, flex: 1, justifyContent: "center" }}>
        <Text>{done ? "☑" : "☐"} {title}</Text>
      </Pressable>
      <Pressable accessibilityRole="button" accessibilityLabel={"Delete " + title} onPress={onDelete} style={{ width: 44, height: 44, justifyContent: "center", alignItems: "center" }}>
        <Text>✕</Text>
      </Pressable>
    </View>
  );
}

export default function Tasks() {
  const [tasks, setTasks] = useState([
    { id: "a1", title: "Order fabric" },
    { id: "b2", title: "Buy thread" },
    { id: "c3", title: "Call the tailor" },
  ]);
  return (
    <View style={{ padding: 16 }}>
      {tasks.map((t, index) => (
        <TaskRow key={index} title={t.title} onDelete={() => setTasks((all) => all.filter((x) => x.id !== t.id))} />
      ))}
    </View>
  );
}
`;
const KEYS_MODEL = KEYS_START.replace("<TaskRow key={index}", "<TaskRow key={t.id}").replace("{tasks.map((t, index) => (", "{tasks.map((t) => (");

/* ── 18.13 · A memory leak ───────────────────────────────────────────── */
const LEAK_LAYOUT = `import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Kobo" }} />
      <Stack.Screen name="live" options={{ title: "Live prices" }} />
    </Stack>
  );
}
`;
const LEAK_COUNTER = `// For this lab: how many price checks are running right now, and how many have run.
export const stats = { running: 0, ticks: 0 };
`;
const LEAK_HOME = `import { Link } from "expo-router";
import { View } from "react-native";

export default function Home() {
  return (
    <View style={{ padding: 20 }}>
      <Link href="/live" style={{ paddingVertical: 14 }}>Live prices</Link>
    </View>
  );
}
`;
const LEAK_START = `import { useEffect, useState } from "react";
import { AppState, Text, View } from "react-native";
import { stats } from "@/debug/stats";

export default function Live() {
  const [price, setPrice] = useState(1500);

  useEffect(() => {
    stats.running++;
    setInterval(() => {
      stats.ticks++;
      setPrice((p) => p + 1);
    }, 200);
    AppState.addEventListener("change", (state) => {
      if (state === "active") setPrice((p) => p);
    });
  }, []);

  return (
    <View style={{ padding: 20 }}>
      <Text>Naira per dollar: {price}</Text>
    </View>
  );
}
`;
const LEAK_MODEL = `import { useEffect, useState } from "react";
import { AppState, Text, View } from "react-native";
import { stats } from "@/debug/stats";

export default function Live() {
  const [price, setPrice] = useState(1500);

  useEffect(() => {
    stats.running++;
    const timer = setInterval(() => {
      stats.ticks++;
      setPrice((p) => p + 1);
    }, 200);
    const sub = AppState.addEventListener("change", (state) => {
      if (state === "active") setPrice((p) => p);
    });
    // Everything the effect starts, the clean-up stops.
    return () => {
      clearInterval(timer);
      sub.remove();
      stats.running--;
    };
  }, []);

  return (
    <View style={{ padding: 20 }}>
      <Text>Naira per dollar: {price}</Text>
    </View>
  );
}
`;

/* ── 18.14 · Regression tests ────────────────────────────────────────── */
const PHONE_BUGGY = `/** Formats a Nigerian mobile number for display: "+234 803 123 4567". */
export function formatPhone(input: string): string {
  const digits = input.replace(/^0/, "");
  return "+234 " + digits.slice(0, 3) + " " + digits.slice(3, 6) + " " + digits.slice(6);
}
`;
const PHONE_FIXED = `/** Formats a Nigerian mobile number for display: "+234 803 123 4567". */
export function formatPhone(input: string): string {
  // Keep only the digits, then drop a leading 234 or 0, whichever the user typed.
  let digits = input.replace(/\\D/g, "");
  if (digits.startsWith("234")) digits = digits.slice(3);
  else if (digits.startsWith("0")) digits = digits.slice(1);
  if (digits.length !== 10) return input.trim();
  return "+234 " + digits.slice(0, 3) + " " + digits.slice(3, 6) + " " + digits.slice(6);
}
`;
const PHONE_TEST_START = `import { formatPhone } from "@/utils/phone";

test("formats a number typed with a leading 0", () => {
  expect(formatPhone("08031234567")).toBe("+234 803 123 4567");
});

// Bug report #212: "My number shows as +234 080 312 34567 after I typed it with spaces,
// and +234 234 803 123 4567 when I pasted it with +234." Add tests that reproduce both,
// watch them fail, then fix formatPhone so they pass.
`;
const PHONE_TEST_MODEL = `import { formatPhone } from "@/utils/phone";

test("formats a number typed with a leading 0", () => {
  expect(formatPhone("08031234567")).toBe("+234 803 123 4567");
});

// Bug report #212: written to fail first, kept forever so the bug can't come back.
test("ignores spaces and dashes (bug #212)", () => {
  expect(formatPhone("0803 123 4567")).toBe("+234 803 123 4567");
  expect(formatPhone("0803-123-4567")).toBe("+234 803 123 4567");
});

test("doesn't double the country code (bug #212)", () => {
  expect(formatPhone("+2348031234567")).toBe("+234 803 123 4567");
  expect(formatPhone("2348031234567")).toBe("+234 803 123 4567");
});
`;

/* ── 18.P · The practical ────────────────────────────────────────────── */
const P_CART = `export type Line = { id: string; name: string; price: number; qty: number };
export type Action = { type: "add"; item: { id: string; name: string; price: number } } | { type: "remove"; id: string } | { type: "clear" };

export function cartReducer(lines: Line[], action: Action): Line[] {
  switch (action.type) {
    case "add": {
      const found = lines.find((l) => l.id === action.item.id);
      if (found) return lines.map((l) => (l.id === action.item.id ? { ...l, qty: l.qty + 1 } : l));
      return [...lines, { ...action.item, qty: 1 }];
    }
    case "remove":
      return lines.filter((l) => l.id !== action.id);
    case "clear":
      return [];
  }
}

export const cartTotal = (lines: Line[]) => lines.reduce((s, l) => s + l.price * l.qty, 0);
export const cartCount = (lines: Line[]) => lines.reduce((s, l) => s + l.qty, 0);
`;
const P_CONTEXT = `import { createContext, useContext, useReducer, type Dispatch, type ReactNode } from "react";
import { cartReducer, type Action, type Line } from "@/cart/reducer";

const CartContext = createContext<{ lines: Line[]; dispatch: Dispatch<Action> } | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, dispatch] = useReducer(cartReducer, []);
  return <CartContext.Provider value={{ lines, dispatch }}>{children}</CartContext.Provider>;
}

export function useCart() {
  const v = useContext(CartContext);
  if (!v) throw new Error("useCart must be used inside <CartProvider>");
  return v;
}
`;
const P_CARD = `import { Pressable, Text, View } from "react-native";

type Props = { name: string; price: number; soldOut?: boolean; onAdd: () => void };

export function ProductCard({ name, price, soldOut = false, onAdd }: Props) {
  return (
    <View style={{ padding: 12, gap: 6 }}>
      <Text>{name}</Text>
      <Text>₦{price.toLocaleString("en-NG")}</Text>
      <Pressable accessibilityRole="button" accessibilityLabel={"Add " + name} disabled={soldOut} onPress={onAdd} style={{ minHeight: 44, justifyContent: "center" }}>
        <Text>{soldOut ? "Sold out" : "Add to cart"}</Text>
      </Pressable>
    </View>
  );
}
`;
const P_SHOP = `import { Link } from "expo-router";
import { View } from "react-native";
import { ProductCard } from "@/components/ProductCard";
import { useCart } from "@/cart/context";
import { cartCount } from "@/cart/reducer";

export const PRODUCTS = [
  { id: "p1", name: "Ankara tote bag", price: 8500, soldOut: false },
  { id: "p2", name: "Shea butter", price: 3000, soldOut: false },
  { id: "p3", name: "Adire scarf", price: 6000, soldOut: true },
];

export function ShopScreen() {
  const { lines, dispatch } = useCart();
  return (
    <View style={{ padding: 16 }}>
      <Link href="/cart" testID="cart-link" style={{ paddingVertical: 12 }}>Cart ({cartCount(lines)})</Link>
      {PRODUCTS.map((p) => (
        <ProductCard key={p.id} name={p.name} price={p.price} soldOut={p.soldOut} onAdd={() => dispatch({ type: "add", item: p })} />
      ))}
    </View>
  );
}
`;
const P_CART_SCREEN = `import { Pressable, Text, View } from "react-native";
import { useCart } from "@/cart/context";
import { cartTotal } from "@/cart/reducer";

export function CartScreen() {
  const { lines, dispatch } = useCart();
  if (lines.length === 0) return <Text style={{ padding: 20 }}>Your cart is empty</Text>;
  return (
    <View style={{ padding: 16, gap: 8 }}>
      {lines.map((l) => (
        <Text key={l.id}>{l.qty} × {l.name}</Text>
      ))}
      <Text testID="total">Total ₦{cartTotal(lines).toLocaleString("en-NG")}</Text>
      <Pressable accessibilityRole="button" onPress={() => dispatch({ type: "clear" })} style={{ minHeight: 44, justifyContent: "center" }}>
        <Text>Empty cart</Text>
      </Pressable>
    </View>
  );
}
`;
const P_FILES = {
  "src/cart/reducer.ts": P_CART,
  "src/cart/context.tsx": P_CONTEXT,
  "src/components/ProductCard.tsx": P_CARD,
  "src/screens/Shop.tsx": P_SHOP,
  "src/screens/Cart.tsx": P_CART_SCREEN,
  "src/app/_layout.tsx": `import { Stack } from "expo-router";
import { CartProvider } from "@/cart/context";

export default function RootLayout() {
  return (
    <CartProvider>
      <Stack>
        <Stack.Screen name="index" options={{ title: "Shop" }} />
        <Stack.Screen name="cart" options={{ title: "Cart" }} />
      </Stack>
    </CartProvider>
  );
}
`,
  "src/app/index.tsx": `import { ShopScreen } from "@/screens/Shop";\n\nexport default ShopScreen;\n`,
  "src/app/cart.tsx": `import { CartScreen } from "@/screens/Cart";\n\nexport default CartScreen;\n`,
};
const P_TESTS = {
  "__tests__/reducer.test.ts": `import { cartCount, cartReducer, cartTotal } from "@/cart/reducer";

const tote = { id: "p1", name: "Ankara tote bag", price: 8500 };
const shea = { id: "p2", name: "Shea butter", price: 3000 };

test("adding a new item adds a line", () => {
  expect(cartReducer([], { type: "add", item: tote })).toEqual([{ ...tote, qty: 1 }]);
});

test("adding the same item again raises its quantity", () => {
  const once = cartReducer([], { type: "add", item: tote });
  expect(cartReducer(once, { type: "add", item: tote })).toEqual([{ ...tote, qty: 2 }]);
});

test("remove and clear", () => {
  let lines = cartReducer([], { type: "add", item: tote });
  lines = cartReducer(lines, { type: "add", item: shea });
  expect(cartReducer(lines, { type: "remove", id: "p1" })).toEqual([{ ...shea, qty: 1 }]);
  expect(cartReducer(lines, { type: "clear" })).toEqual([]);
});

test("total and count", () => {
  const lines = [{ ...tote, qty: 2 }, { ...shea, qty: 1 }];
  expect(cartTotal(lines)).toBe(20000);
  expect(cartCount(lines)).toBe(3);
});

test("the reducer never changes the old array", () => {
  const lines = Object.freeze([{ ...tote, qty: 1 }]) as never;
  expect(() => cartReducer(lines, { type: "add", item: tote })).not.toThrow();
});
`,
  "__tests__/ProductCard.test.tsx": `import { fireEvent, render, screen } from "@testing-library/react-native";
import { ProductCard } from "@/components/ProductCard";

test("Add calls onAdd", async () => {
  const onAdd = jest.fn();
  await render(<ProductCard name="Shea butter" price={3000} onAdd={onAdd} />);
  expect(screen.getByText("₦3,000")).toBeOnTheScreen();
  await fireEvent.press(screen.getByRole("button", { name: "Add Shea butter" }));
  expect(onAdd).toHaveBeenCalledTimes(1);
});

test("a sold-out product can't be added", async () => {
  const onAdd = jest.fn();
  await render(<ProductCard name="Adire scarf" price={6000} soldOut onAdd={onAdd} />);
  expect(screen.getByRole("button", { name: "Add Adire scarf" })).toBeDisabled();
  expect(screen.getByText("Sold out")).toBeOnTheScreen();
});
`,
  "__tests__/cart-flow.test.tsx": `import { fireEvent, render, screen } from "@testing-library/react-native";
import { CartProvider } from "@/cart/context";
import { CartScreen } from "@/screens/Cart";
import { ShopScreen } from "@/screens/Shop";

// Integration: both screens, the real context and reducer, together.
function App() {
  return (
    <CartProvider>
      <ShopScreen />
      <CartScreen />
    </CartProvider>
  );
}

test("adding products updates the count, the lines and the total", async () => {
  await render(<App />);
  expect(screen.getByText("Your cart is empty")).toBeOnTheScreen();
  await fireEvent.press(screen.getByRole("button", { name: "Add Ankara tote bag" }));
  await fireEvent.press(screen.getByRole("button", { name: "Add Ankara tote bag" }));
  await fireEvent.press(screen.getByRole("button", { name: "Add Shea butter" }));
  expect(screen.getByText("Cart (3)")).toBeOnTheScreen();
  expect(screen.getByText("2 × Ankara tote bag")).toBeOnTheScreen();
  expect(screen.getByTestId("total")).toHaveTextContent("Total ₦20,000");
});

test("emptying the cart", async () => {
  await render(<App />);
  await fireEvent.press(screen.getByRole("button", { name: "Add Shea butter" }));
  await fireEvent.press(screen.getByRole("button", { name: "Empty cart" }));
  expect(screen.getByText("Your cart is empty")).toBeOnTheScreen();
});
`,
  ".maestro/buy.yaml": `appId: ng.kobo.app
---
- launchApp:
    clearState: true
- tapOn: "Add Ankara tote bag"
- tapOn: "Add Shea butter"
- tapOn:
    id: "cart-link"
- assertVisible: "1 × Ankara tote bag"
- assertVisible: "Total ₦11,500"
- tapOn: "Empty cart"
- assertVisible: "Your cart is empty"
`,
};
const pMutant = (file, from, to) => ({ [file]: P_FILES[file].replace(from, to) });

export const PART2 = [
  /* ═══════════════ LESSON 117 · 18.9 – 18.10 ═══════════════ */
  {
    id: "md-l117-sizes-networks",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 5,
    covers: ["18.9", "18.10"],
    title: "Different Screens, and Bad Networks",
    subtitle: "Testing beyond your own phone on your own Wi-Fi",
    estimatedMinutes: 55,
    intro: "Your users have small phones and big tablets, large text and landscape, and connections that crawl or drop. Test for all of them on purpose.",
    atoms: [
      {
        id: "a-md-screen-sizes",
        title: "Testing on different screen sizes",
        explain:
          "Phones range from 320-point-wide budget Androids to 430-point Pro Max iPhones, then tablets, foldables and landscape. Layouts that hard-code widths overflow or leave gaps. Build from the WINDOW: useWindowDimensions() (it updates on rotation and split screen) to choose columns or switch layouts at breakpoints; flex and percentages rather than fixed widths; minHeight rather than height wherever text appears, because users scale text (fontScale) up to 200% and more; safe-area insets for notches and home indicators (Module 7). Then TEST on purpose: emulators and simulators in several sizes, landscape, the largest text size, a tablet if you support one, and a real small phone. Automated checks can render at different sizes too.",
        webLab: expoLab({
          name: "Kobo",
          layout: titled("Shop"),
          task:
            "The grid uses fixed 180-point cards, which overflow narrow phones. Use useWindowDimensions to choose 2 columns below 600 points wide and 3 from 600 (landscape and tablets), size the cards to fit exactly (padding 8, margin 8 on each side), and use minHeight instead of height so larger text can grow. Keep each card's testID \"card\".",
          files: { "src/app/index.tsx": GRID_START, "src/data/products.ts": GRID_DATA },
          readOnly: ["src/data/products.ts"],
          solution: { "src/app/index.tsx": GRID_MODEL },
          tests: [
            { label: "iPhone, portrait: two columns that fit", check: columnsCheck(2), fail: "width >= 600 ? 3 : 2, and cards sized from the width." },
            { label: "Android, portrait: two columns that fit", device: { os: "android" }, check: columnsCheck(2), fail: "Work from the window's width, not a fixed size." },
            { label: "Landscape: three columns", device: { orientation: "landscape" }, check: columnsCheck(3), fail: "useWindowDimensions re-renders on rotation." },
            { label: "Text can grow", check: "const c = code('src/app/index.tsx'); return c.includes('useWindowDimensions') && /minHeight/.test(c) && !/\\bheight:\\s*120/.test(c);", fail: "minHeight: 120, not height: 120." },
          ],
          hint: "cardWidth = (width − 2 × padding − 2 × margin × columns) / columns",
          successMessage: "One grid that fits every phone, in both orientations, at any text size.",
        }),
      },
      {
        id: "a-md-slow-networks",
        title: "Handling slow networks and interrupted connections",
        explain:
          "Test the network code you wrote in Module 13 on purpose. MANUALLY: airplane mode in the middle of a request; Android Studio's emulator network settings (speed and latency); iOS's Network Link Conditioner (a developer setting on iPhone, also for the Simulator); a real weak signal. AUTOMATICALLY: mock fetch to answer slowly, never, with errors, or by rejecting, and use Jest's FAKE TIMERS (jest.useFakeTimers(), then jest.advanceTimersByTime(ms)) so a 10-second timeout runs in a millisecond. Check: timeouts fire, retries happen only for the right failures and stop, nothing is sent twice, the UI shows the right message, and recovering when the network returns works. Always restore real timers and mocks after each test.",
        webLab: expoLab({
          name: "Kobo",
          layout: null,
          task:
            "In __tests__/net.test.ts, test fetchWithTimeout and withRetry (src/http/net.ts) under bad networks: a hanging request (use the hanging mock and fake timers) rejects with a TimeoutError; a fast answer is not cut off; a 503 then a 200 is retried once; a dropped connection (TypeError) is retried; giving up returns the last response after retries + 1 calls. The checks then break each behaviour.",
          files: { "__tests__/net.test.ts": NET_TEST_START, "src/http/net.ts": NET_UTILS, "src/app/index.tsx": testsOnly("Run the tests in __tests__/net.test.ts.") },
          readOnly: ["src/http/net.ts", "src/app/index.tsx"],
          solution: { "__tests__/net.test.ts": NET_TEST_MODEL },
          tests: suite(5, [
            ["They catch a timeout that never fires", netMutant("controller.abort();\n  }, timeoutMs);", "  }, timeoutMs * 1000);"), "Advance fake timers by timeoutMs and expect a TimeoutError."],
            ["They catch 5xx not being retried", netMutant("if ((response.status < 500 && response.status !== 429) || attempt === retries) return response;", "return response;"), "Mock a 503 then a 200 and expect two calls."],
            ["They catch dropped connections not being retried", netMutant("if (!(e instanceof TypeError) || attempt === retries) throw e;", "throw e;"), "mockRejectedValueOnce(new TypeError(…)) then a 200."],
            ["They catch retrying forever", netMutant("|| attempt === retries) return response;", "|| attempt === retries + 5) return response;"), "With retries: 2, expect exactly 3 calls."],
          ]),
          hint: "Start the request, THEN advance the fake timers, then await the promise.",
          successMessage: "Bad networks tested in milliseconds: timeouts, retries and their limits.",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════ LESSON 118 · 18.11 – 18.13 ═══════════════ */
  {
    id: "md-l118-debugging",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 6,
    covers: ["18.11", "18.12", "18.13"],
    title: "Debugging, Stack Traces and Memory Problems",
    subtitle: "Finding out why, instead of guessing",
    estimatedMinutes: 60,
    intro: "Tests tell you something is wrong; debugging tells you why. Three everyday skills: fixing rendering bugs, reading stack traces, and stopping leaks.",
    atoms: [
      {
        id: "a-md-debugging-render",
        title: "Debugging JavaScript errors and rendering issues",
        explain:
          "When the screen shows the wrong thing: (1) REPRODUCE it reliably (exact steps); (2) read the console: React's warnings (\"Each child in a list should have a unique key\", \"Cannot update a component while rendering a different component\") usually point at the cause; (3) open React Native DevTools (press j): the Components panel shows each component's props and state, the Console shows logs, Sources sets breakpoints; (4) narrow it down, then fix the CAUSE, not the symptom. A classic: list KEYS. React matches rows between renders by key; using the array index means that after deleting the first row, the second row's component (and its state, such as a ticked checkbox) is reused for a different item. Keys must be stable and unique: the item's id.",
        webLab: expoLab({
          name: "Kobo",
          layout: titled("Tasks"),
          task:
            "Bug report: \"I ticked Buy thread, deleted Order fabric, and now Call the tailor is ticked instead.\" Reproduce it on the phone, find the cause, and fix it.",
          files: { "src/app/index.tsx": KEYS_START },
          solution: { "src/app/index.tsx": KEYS_MODEL },
          tests: [
            { label: "The right task stays ticked after deleting another", check: "await press({ role: 'checkbox', name: 'Buy thread' }); await press({ role: 'button', name: 'Delete Order fabric' }); await wait(200); return find({ role: 'checkbox', name: 'Buy thread' }).getAttribute('aria-checked') === 'true' && find({ role: 'checkbox', name: 'Call the tailor' }).getAttribute('aria-checked') === 'false';", fail: "React reuses rows by key: index keys move state to the wrong item." },
            { label: "Keys are the items' ids", check: "const c = code('src/app/index.tsx'); return /key=\\{t\\.id\\}/.test(c) && !/key=\\{index\\}/.test(c);", fail: "key={t.id}" },
          ],
          hint: "Which row component does React reuse after the first item is deleted?",
          successMessage: "Stable keys: each row's state stays with its own item.",
        }),
      },
      {
        id: "a-md-logs-stack-traces",
        title: "Reading logs and stack traces",
        explain:
          "A STACK TRACE lists the function calls that led to an error, most recent FIRST. Read it top-down: the error type and message (TypeError: Cannot read property 'map' of undefined), then the first frame in YOUR code (at OrderScreen (src/app/orders/[id].tsx:14:22): file, line, column); frames from node_modules or React internals below it are usually just the path React took to get there. In release builds the JavaScript is minified, so traces show index.android.bundle:1:84213 until SYMBOLICATED with source maps (crash reporters such as Sentry do this when you upload source maps with each build; Expo's EAS Build and EAS Update can upload them). Logs: console.log/warn/error show in the npx expo start terminal and DevTools; native logs need adb logcat (Android) or the Console app (macOS, iOS). Log context (what the user did, ids), never secrets or personal data.",
        decision: {
          scenario: "A tester sends: \"TypeError: Cannot read property 'name' of undefined\n  at ProductCard (src/components/ProductCard.tsx:12:31)\n  at renderItem (src/app/(tabs)/index.tsx:41:18)\n  at VirtualizedList … (node_modules/react-native/…)\n  at renderWithHooks (node_modules/react-dom/…)\" It happens when scrolling the shop to the bottom.",
          question: "Where do you start?",
          options: [
            { id: "a", text: "Line 12 of ProductCard.tsx, reading .name of something undefined, then why renderItem in (tabs)/index.tsx line 41 passed an undefined product near the end of the list", why: "The first frames in your own code show where it failed and who called it; the node_modules frames are React's route there. An undefined item at the end of a list suggests a data or pagination problem." },
            { id: "b", text: "The VirtualizedList code in node_modules, since it's a React Native bug", whyWrong: "Library frames are just the path; the failing code (reading .name of undefined) is yours." },
            { id: "c", text: "The last line of the trace, renderWithHooks", whyWrong: "The bottom of the trace is the oldest call, deep in React; start at the top." },
            { id: "d", text: "Reinstall node_modules and try again", whyWrong: "Nothing suggests a broken install; the trace points at specific lines of your code." },
          ],
          correct: "a",
          aftermath: "Top-down: the message, then the first frame in your code, then its caller.",
        },
      },
      {
        id: "a-md-memory-leaks",
        title: "Profiling performance and identifying memory problems",
        explain:
          "A MEMORY LEAK is something that should have stopped but didn't: an interval still ticking after its screen closed, a listener still attached, a subscription still open, a growing cache. Symptoms: the app gets slower or hotter the longer it's used, battery drains, Android kills it, or you see \"Can't perform a React state update on an unmounted component\" style work in the profiler. The rule: EVERYTHING AN EFFECT STARTS, ITS CLEAN-UP STOPS (clearInterval, subscription.remove(), socket.close(), controller.abort()). To find leaks: React Native DevTools' Memory panel (heap snapshots before and after opening and closing a screen several times: what's left over?), the Performance panel and Perf Monitor for frame drops, Android Studio's profiler and Xcode Instruments (Leaks, Allocations) for native memory. Test by visiting a screen repeatedly and checking that nothing accumulates.",
        webLab: expoLab({
          name: "Kobo",
          layout: LEAK_LAYOUT,
          task:
            "Opening Live prices several times makes the app slower: every visit starts a price check that never stops, and adds an AppState listener that's never removed. Fix the effect in src/app/live.tsx so leaving the screen stops the interval, removes the listener and decrements stats.running.",
          files: { "src/app/live.tsx": LEAK_START, "src/app/index.tsx": LEAK_HOME, "src/debug/stats.ts": LEAK_COUNTER },
          readOnly: ["src/app/index.tsx", "src/debug/stats.ts"],
          solution: { "src/app/live.tsx": LEAK_MODEL },
          tests: [
            { label: "Visiting the screen three times leaves nothing running", check: "for (let i = 0; i < 3; i++) { await press('Live prices'); await waitFor(() => hasText('Naira per dollar'), 2000); await wait(250); await back(); await wait(150); } const s = load('src/debug/stats.ts').stats; const before = s.ticks; await wait(700); return s.running === 0 && s.ticks === before;", fail: "return () => { clearInterval(timer); sub.remove(); stats.running--; };" },
            { label: "While open, it still updates", check: "await press('Live prices'); await waitFor(() => hasText('Naira per dollar'), 2000); const s = load('src/debug/stats.ts').stats; const before = s.ticks; await wait(700); const ok = s.ticks > before && s.running === 1; await back(); return ok;", fail: "Keep the interval while the screen is open." },
          ],
          hint: "Keep what setInterval and addEventListener return, so the clean-up can stop them.",
          successMessage: "A screen that cleans up after itself, however often it's opened.",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════ LESSON 119 · 18.14 – 18.15 ═══════════════ */
  {
    id: "md-l119-regression-crashes",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 7,
    covers: ["18.14", "18.15"],
    title: "Regression Tests and Crash Reports",
    subtitle: "Making sure a fixed bug stays fixed, and learning about the ones you didn't see",
    estimatedMinutes: 50,
    intro: "Every bug that reached a user is a test you didn't have. Write it, and listen to your crash reports for the next one.",
    atoms: [
      {
        id: "a-md-regression",
        title: "Regression testing after changes",
        explain:
          "A REGRESSION is something that used to work and broke after a change. The habit that prevents them: when a bug is reported, first write a test that REPRODUCES it and watch it FAIL; then fix the code until it passes; then keep the test forever (name it after the bug). Run the whole suite on every change: locally (npm test), and automatically on every pull request in CI (GitHub Actions, or EAS Workflows, which can also build and run Maestro flows), so a change that breaks an old behaviour can't be merged. Before a release, re-run the manual test plan for the areas the release touched. A suite that is slow or flaky gets ignored, so keep tests fast and deterministic.",
        webLab: expoLab({
          name: "Kobo",
          layout: null,
          task:
            "Bug #212: formatPhone shows \"+234 080 312 34567\" for \"0803 123 4567\", and \"+234 234 803 123 4567\" for \"+2348031234567\". In __tests__/phone.test.ts, add tests that reproduce both (with spaces and dashes; with +234 and 234), run them and see them fail, then fix formatPhone in src/utils/phone.ts so every test passes. The checks run your tests against the original buggy code too: they must fail there.",
          files: { "__tests__/phone.test.ts": PHONE_TEST_START, "src/utils/phone.ts": PHONE_BUGGY, "src/app/index.tsx": testsOnly("Run the tests in __tests__/phone.test.ts.") },
          readOnly: ["src/app/index.tsx"],
          solution: { "__tests__/phone.test.ts": PHONE_TEST_MODEL, "src/utils/phone.ts": PHONE_FIXED },
          tests: [
            { label: "All tests pass on your fixed code", check: "const r = await tests(); return !!r && r.total >= 3 && r.failed === 0;", fail: "Fix formatPhone until every test passes." },
            { label: "The fix is right", check: "const { formatPhone } = load('src/utils/phone.ts'); return ['08031234567', '0803 123 4567', '0803-123-4567', '+2348031234567', '2348031234567', ' 0803 123 4567 '].every((n) => formatPhone(n) === '+234 803 123 4567');", fail: "Keep only digits, then drop a leading 234 or 0." },
            { label: "Your tests catch the original bug", swap: { "src/utils/phone.ts": PHONE_BUGGY }, check: "const r = await tests(); return !!r && r.failed >= 2;", fail: "One test for spaces/dashes and one for the country code, each failing on the buggy version." },
          ],
          hint: "input.replace(/\\D/g, \"\") keeps only digits.",
          successMessage: "Bug #212 is fixed, and can never quietly come back.",
        }),
      },
      {
        id: "a-md-crash-reports",
        title: "Collecting crash reports and diagnosing failures",
        explain:
          "Most crashes happen on phones you'll never touch. A CRASH REPORTER (Sentry is the common choice for Expo, via @sentry/react-native's config plugin; Firebase Crashlytics and Bugsnag are others; Google Play Console's Android vitals and App Store Connect's crashes show native crashes too) collects JavaScript errors and native crashes with: a symbolicated STACK TRACE (upload source maps and debug symbols with every build and update), the device, OS and app version, BREADCRUMBS (the screens and actions before the crash), and how many users it affects. Triage by impact (crash-free users %, affected users, a new release's spike), reproduce from the breadcrumbs, write a regression test, fix, and ship (an over-the-air update if it's JavaScript only, Module 20). Scrub personal data from reports, and say so in your privacy disclosures.",
        decision: {
          scenario: "Two days after release, Sentry shows: (1) a crash affecting 12% of Android users on the checkout screen since version 1.4.0; (2) a rare iOS crash in settings affecting 0.1% of users for months; (3) a JavaScript warning logged a million times a day that users don't notice.",
          question: "What should the team do first?",
          options: [
            { id: "a", text: "Fix the 1.4.0 Android checkout crash: reproduce it from the breadcrumbs and stack trace, add a regression test, ship the fix (an OTA update if it's JavaScript-only), and consider halting the staged rollout meanwhile", why: "It's new, affects many users, and hits the money flow; release controls and OTA updates exist for exactly this." },
            { id: "b", text: "Fix the warning first, because it's the most frequent event", whyWrong: "Frequency of a harmless warning matters less than users actually crashing during checkout." },
            { id: "c", text: "Fix the old iOS settings crash first, because it's been there longest", whyWrong: "Old and rare; the new checkout crash is hurting far more people right now." },
            { id: "d", text: "Wait a week to collect more data", whyWrong: "12% of Android users crashing at checkout is already clear enough to act on." },
          ],
          correct: "a",
          aftermath: "Triage by user impact and recency: new, widespread, money-path crashes first.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════ LESSON 120 · 18.P ═══════════════ */
  {
    id: "md-l120-m18-project",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 8,
    covers: ["18.P"],
    title: "Practical: A Test Suite for the Shop",
    subtitle: "Unit, component, integration and an end-to-end flow, graded by mutants",
    estimatedMinutes: 120,
    intro: "The shop works. Now prove it, at every level of the testing pyramid, so it keeps working.",
    atoms: [
      {
        id: "a-md-m18-project",
        title: "Write the test suite",
        explain:
          "The app is given: a cart reducer, a ProductCard, the Shop and Cart screens, and the router. Write the tests. The checks run your suite on the real code, then on six broken versions: every one must be caught by some test, and the Maestro flow must pass on the real app.",
        webLab: expoLab({
          name: "Kobo",
          layout: null,
          app: { ios: { bundleIdentifier: "ng.kobo.app" }, android: { package: "ng.kobo.app" } },
          task:
            "Write: __tests__/reducer.test.ts (unit: add, adding again raises qty, remove, clear, total and count); __tests__/ProductCard.test.tsx (component: Add calls onAdd; sold out is disabled and says \"Sold out\"); __tests__/cart-flow.test.tsx (integration: render ShopScreen and CartScreen inside CartProvider, add products, check \"Cart (n)\", the lines and \"Total ₦…\"; empty the cart); and .maestro/buy.yaml (E2E: launch clean, add the tote bag and the shea butter, open the cart by id \"cart-link\", check the line and \"Total ₦11,500\", empty it).",
          files: {
            "__tests__/reducer.test.ts": "// Unit tests for the cart reducer.\n",
            "__tests__/ProductCard.test.tsx": "// Component tests for ProductCard.\n",
            "__tests__/cart-flow.test.tsx": "// Integration tests: the screens and the cart together.\n",
            ".maestro/buy.yaml": "appId: ng.kobo.app\n---\n",
            ...P_FILES,
          },
          readOnly: Object.keys(P_FILES),
          revealSolution: false,
          solution: P_TESTS,
          tests: [
            { label: "Your suite passes on the real app", check: "const r = await tests(); return !!r && r.total >= 8 && r.failed === 0 && new Set(r.results.map((t) => t.file)).size === 3;", fail: "Tests in all three files, all passing." },
            { label: "The Maestro flow passes", check: "const r = await maestro('.maestro/buy.yaml'); return r.passed && r.steps.length >= 7;", fail: "launchApp, two tapOn, tapOn id cart-link, assertVisible line and total, tapOn Empty cart, assertVisible empty." },
            { label: "Caught: adding twice makes two lines", swap: pMutant("src/cart/reducer.ts", "if (found) return lines.map((l) => (l.id === action.item.id ? { ...l, qty: l.qty + 1 } : l));", ""), check: "const r = await tests(); return !!r && r.failed > 0;", fail: "Unit-test adding the same item twice." },
            { label: "Caught: a wrong total", swap: pMutant("src/cart/reducer.ts", "s + l.price * l.qty", "s + l.price"), check: "const r = await tests(); return !!r && r.failed > 0;", fail: "Check the total with a quantity above 1." },
            { label: "Caught: sold-out products can be added", swap: pMutant("src/components/ProductCard.tsx", "disabled={soldOut}", "disabled={false}"), check: "const r = await tests(); return !!r && r.failed > 0;", fail: "expect(…).toBeDisabled() for a sold-out card." },
            { label: "Caught: Add does nothing", swap: pMutant("src/components/ProductCard.tsx", "onPress={onAdd}", "onPress={() => {}}"), check: "const r = await tests(); return !!r && r.failed > 0;", fail: "expect(onAdd).toHaveBeenCalled()." },
            { label: "Caught: the cart count is wrong", swap: pMutant("src/screens/Shop.tsx", "Cart ({cartCount(lines)})", "Cart ({lines.length})"), check: "const r = await tests(); return !!r && r.failed > 0;", fail: "Add the same product twice and check \"Cart (3)\" in the integration test." },
            { label: "Caught: emptying the cart is broken (by the flow)", swap: pMutant("src/screens/Cart.tsx", `onPress={() => dispatch({ type: "clear" })}`, "onPress={() => {}}"), check: "const r = await maestro('.maestro/buy.yaml'); return !r.passed;", fail: "End the flow with assertVisible: \"Your cart is empty\"." },
          ],
          hint: "Write one test per behaviour, then imagine the bug each mutant introduces and make sure some test would fail.",
          successMessage: "A complete pyramid: unit, component, integration and end-to-end, and every bug caught.",
        }),
      },
    ],
    task: {
      title: "Module 18 practical: a test suite for your own app",
      intro: "Apply this module to the app you are building.",
      prompts: [
        "Set up Jest with jest-expo and React Native Testing Library, and add npm test to CI (GitHub Actions or EAS Workflows) on every pull request.",
        "Write unit tests for your rules, component tests for your shared components, integration tests for sign-in and your main flow, and one Maestro flow for the most important journey.",
        "Mock the network for every state: success, empty, 4xx, 5xx, slow and offline.",
        "Add Sentry (or another crash reporter) with source maps, and trigger a test error in a release build to see it arrive symbolicated.",
        "Mastery checkpoint: break something on purpose and show which test catches it; explain what each level of your pyramid protects.",
      ],
      closing: "Next: Module 19, mobile application security.",
    },
    requirements: { read: true, video: false, assessment: true },
  },
];
