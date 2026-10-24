/**
 * MOBILE APP DEVELOPMENT · MODULE 18 · TESTING MOBILE APPLICATIONS (part 1)
 *
 * Curriculum 18.1 – 18.8: manual testing on devices, emulators and
 * simulators, unit tests, component tests, integration tests, end-to-end
 * tests (Maestro), testing forms, navigation, authentication and API
 * requests, and mocking network responses.
 *
 * Test labs run real Jest test files with React Native Testing Library's
 * API on the practice phone, then run them again against broken versions
 * of the code ("mutants"): a good suite must catch every one.
 *
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 */

import { expoLab } from "./md-helpers.js";

export const SECTION_ID = "md-s18-testing";
export const MODULE = "md-m18-testing";

/** The checks every test lab uses: the suite passes, and each mutant makes it fail. */
export const suite = (min, mutants) => [
  { label: "Your tests pass against the real code", check: `const r = await tests(); return !!r && r.total >= ${min} && r.failed === 0;`, fail: `At least ${min} passing tests (run them in the Tests panel).` },
  ...mutants.map(([label, swap, fail]) => ({ label, swap, check: "const r = await tests(); return !!r && r.failed > 0;", fail })),
];

/* ── 18.3 · Unit tests ───────────────────────────────────────────────── */
export const CART_RULES = `export type CartItem = { price: number; qty: number };

export const DISCOUNT_CODE = "KOBO10";
export const FREE_DELIVERY_FROM = 20000;
export const DELIVERY_FEE = 1500;

/** Subtotal; KOBO10 (any case, spaces ignored) takes 10% off, rounded; delivery is free from ₦20,000 AFTER the discount. */
export function cartTotals(items: CartItem[], code: string) {
  const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const discount = code.trim().toUpperCase() === DISCOUNT_CODE ? Math.round(subtotal * 0.1) : 0;
  const delivery = subtotal - discount >= FREE_DELIVERY_FROM ? 0 : DELIVERY_FEE;
  return { subtotal, discount, delivery, total: subtotal - discount + delivery };
}
`;
const cartMutant = (from, to) => ({ "src/utils/cart.ts": CART_RULES.replace(from, to) });
const UNIT_START = `import { cartTotals } from "@/utils/cart";

describe("cartTotals", () => {
  test("adds up price × quantity", () => {
    expect(cartTotals([{ price: 3000, qty: 2 }], "").subtotal).toBe(6000);
  });

  // Add tests for: the discount code (in any case, with spaces), rounding,
  // the delivery fee, and free delivery measured AFTER the discount.
});
`;
const UNIT_MODEL = `import { cartTotals } from "@/utils/cart";

describe("cartTotals", () => {
  test("adds up price × quantity", () => {
    expect(cartTotals([{ price: 3000, qty: 2 }], "").subtotal).toBe(6000);
  });

  test("KOBO10 takes 10% off, in any case and with spaces", () => {
    expect(cartTotals([{ price: 10000, qty: 1 }], "KOBO10").discount).toBe(1000);
    expect(cartTotals([{ price: 10000, qty: 1 }], "  kobo10 ").discount).toBe(1000);
    expect(cartTotals([{ price: 10000, qty: 1 }], "KOBO20").discount).toBe(0);
  });

  test("the discount is rounded to whole naira", () => {
    expect(cartTotals([{ price: 1255, qty: 1 }], "KOBO10").discount).toBe(126);
  });

  test("small orders pay ₦1,500 delivery", () => {
    const t = cartTotals([{ price: 5000, qty: 1 }], "");
    expect(t.delivery).toBe(1500);
    expect(t.total).toBe(6500);
  });

  test("delivery is free from ₦20,000", () => {
    expect(cartTotals([{ price: 20000, qty: 1 }], "").delivery).toBe(0);
  });

  test("free delivery is measured after the discount", () => {
    // 21,000 − 2,100 = 18,900: under 20,000, so delivery is charged.
    const t = cartTotals([{ price: 21000, qty: 1 }], "KOBO10");
    expect(t.delivery).toBe(1500);
    expect(t.total).toBe(20400);
  });
});
`;

/* ── 18.4 · Component tests ──────────────────────────────────────────── */
export const STEPPER = `import { Pressable, Text, View } from "react-native";

type Props = { value: number; min?: number; max?: number; onChange: (value: number) => void };

export function QuantityStepper({ value, min = 1, max = 10, onChange }: Props) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
      <Pressable accessibilityRole="button" accessibilityLabel="Fewer" disabled={value <= min} onPress={() => onChange(value - 1)} style={{ width: 48, height: 48 }}>
        <Text>−</Text>
      </Pressable>
      <Text accessibilityLiveRegion="polite">Qty {value}</Text>
      <Pressable accessibilityRole="button" accessibilityLabel="More" disabled={value >= max} onPress={() => onChange(value + 1)} style={{ width: 48, height: 48 }}>
        <Text>+</Text>
      </Pressable>
    </View>
  );
}
`;
const stepperMutant = (from, to) => ({ "src/components/QuantityStepper.tsx": STEPPER.replace(from, to) });
const COMPONENT_START = `import { fireEvent, render, screen } from "@testing-library/react-native";
import { QuantityStepper } from "@/components/QuantityStepper";

test("shows the quantity", async () => {
  await render(<QuantityStepper value={2} onChange={() => {}} />);
  expect(screen.getByText("Qty 2")).toBeOnTheScreen();
});

// Add tests: pressing "More" calls onChange with value + 1; "Fewer" with value − 1;
// "Fewer" is disabled at the minimum and "More" at the maximum.
`;
const COMPONENT_MODEL = `import { fireEvent, render, screen } from "@testing-library/react-native";
import { QuantityStepper } from "@/components/QuantityStepper";

test("shows the quantity", async () => {
  await render(<QuantityStepper value={2} onChange={() => {}} />);
  expect(screen.getByText("Qty 2")).toBeOnTheScreen();
});

test("More asks for one more", async () => {
  const onChange = jest.fn();
  await render(<QuantityStepper value={2} onChange={onChange} />);
  await fireEvent.press(screen.getByRole("button", { name: "More" }));
  expect(onChange).toHaveBeenCalledWith(3);
});

test("Fewer asks for one fewer", async () => {
  const onChange = jest.fn();
  await render(<QuantityStepper value={2} onChange={onChange} />);
  await fireEvent.press(screen.getByRole("button", { name: "Fewer" }));
  expect(onChange).toHaveBeenCalledWith(1);
});

test("Fewer is disabled at the minimum", async () => {
  await render(<QuantityStepper value={1} onChange={() => {}} />);
  expect(screen.getByRole("button", { name: "Fewer" })).toBeDisabled();
  expect(screen.getByRole("button", { name: "More" })).toBeEnabled();
});

test("More is disabled at the maximum", async () => {
  await render(<QuantityStepper value={10} onChange={() => {}} />);
  expect(screen.getByRole("button", { name: "More" })).toBeDisabled();
});
`;

/* ── 18.5 · Integration tests ────────────────────────────────────────── */
const INT_SERVER = `import { createServer } from "practice-server";

const app = createServer();
app.post("/auth/login", (req, res) =>
  req.body?.email === "ada@example.com" && req.body?.password === "kobo1234" ? res.json({ name: "Ada" }) : res.status(401).json({ message: "Wrong email or password" })
);
export default app;
`;
export const INT_SESSION = `import { createContext, useContext, useState, type ReactNode } from "react";

type Value = { user: string | null; signIn: (email: string, password: string) => Promise<void> };
const SessionContext = createContext<Value | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<string | null>(null);
  async function signIn(email: string, password: string) {
    const r = await fetch("https://api.example.com/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password }) });
    const data = await r.json();
    if (!r.ok) throw new Error(data.message);
    setUser(data.name);
  }
  return <SessionContext.Provider value={{ user, signIn }}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const v = useContext(SessionContext);
  if (!v) throw new Error("useSession must be used inside <SessionProvider>");
  return v;
}
`;
export const INT_LAYOUT = `import { Stack } from "expo-router";
import { SessionProvider, useSession } from "@/screens/session";

function Navigator() {
  const { user } = useSession();
  return (
    <Stack>
      <Stack.Protected guard={!!user}>
        <Stack.Screen name="index" options={{ title: "Home" }} />
      </Stack.Protected>
      <Stack.Protected guard={!user}>
        <Stack.Screen name="sign-in" options={{ title: "Sign in" }} />
      </Stack.Protected>
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <SessionProvider>
      <Navigator />
    </SessionProvider>
  );
}
`;
export const INT_SIGN_IN = `import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { useSession } from "@/screens/session";

export default function SignIn() {
  const { signIn } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  return (
    <View>
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} />
      <TextInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
      {error ? <Text accessibilityRole="alert">{error}</Text> : null}
      <Pressable accessibilityRole="button" onPress={() => signIn(email.trim(), password).catch((e: Error) => setError(e.message))}>
        <Text>Sign in</Text>
      </Pressable>
    </View>
  );
}
`;
export const INT_HOME = `import { Text } from "react-native";
import { useSession } from "@/screens/session";

export default function Home() {
  const { user } = useSession();
  return <Text>Welcome, {user}</Text>;
}
`;
const INT_START = `import { fireEvent, renderRouter, screen } from "expo-router/testing-library";
import RootLayout from "@/screens/_layout";
import Home from "@/screens/index";
import SignIn from "@/screens/sign-in";

// The real screens, wired by the real router, talking to the (practice) server.
const routes = { _layout: RootLayout, index: Home, "sign-in": SignIn };

test("signed out, the app opens on sign-in", async () => {
  const app = await renderRouter(routes, { initialUrl: "/" });
  expect(app.getPathname()).toBe("/sign-in");
});

// Add tests: a correct sign-in lands on "/" showing "Welcome, Ada";
// a wrong password stays on /sign-in and shows the server's message.
`;
const INT_MODEL = `import { fireEvent, renderRouter, screen, waitFor } from "expo-router/testing-library";
import RootLayout from "@/screens/_layout";
import Home from "@/screens/index";
import SignIn from "@/screens/sign-in";

// The real screens, wired by the real router, talking to the (practice) server.
const routes = { _layout: RootLayout, index: Home, "sign-in": SignIn };

test("signed out, the app opens on sign-in", async () => {
  const app = await renderRouter(routes, { initialUrl: "/" });
  expect(app.getPathname()).toBe("/sign-in");
});

test("signing in opens the home screen", async () => {
  const app = await renderRouter(routes, { initialUrl: "/" });
  await fireEvent.changeText(screen.getByPlaceholderText("Email"), " ada@example.com ");
  await fireEvent.changeText(screen.getByPlaceholderText("Password"), "kobo1234");
  await fireEvent.press(screen.getByRole("button", { name: "Sign in" }));
  await waitFor(() => expect(screen.getByText("Welcome, Ada")).toBeOnTheScreen());
  expect(app.getPathname()).toBe("/");
});

test("a wrong password stays on sign-in with the server's message", async () => {
  const app = await renderRouter(routes, { initialUrl: "/" });
  await fireEvent.changeText(screen.getByPlaceholderText("Email"), "ada@example.com");
  await fireEvent.changeText(screen.getByPlaceholderText("Password"), "wrong");
  await fireEvent.press(screen.getByRole("button", { name: "Sign in" }));
  await waitFor(() => expect(screen.getByRole("alert")).toHaveTextContent("Wrong email or password"));
  expect(app.getPathname()).toBe("/sign-in");
});
`;

/* ── 18.6 · End-to-end (Maestro) ─────────────────────────────────────── */
const E2E_LAYOUT = `import { Stack } from "expo-router";
import { CartProvider } from "@/cart";

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
`;
const E2E_CART = `import { createContext, useContext, useState, type ReactNode } from "react";

const CartContext = createContext<{ items: string[]; add: (name: string) => void; clear: () => void } | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<string[]>([]);
  return <CartContext.Provider value={{ items, add: (n) => setItems((i) => [...i, n]), clear: () => setItems([]) }}>{children}</CartContext.Provider>;
}

export const useCart = () => useContext(CartContext)!;
`;
const E2E_SHOP = `import { Link } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { useCart } from "@/cart";

export default function Shop() {
  const { items, add } = useCart();
  return (
    <View style={{ padding: 20, gap: 10 }}>
      <Pressable testID="add-tote" accessibilityRole="button" onPress={() => add("Ankara tote bag")} style={{ minHeight: 48, justifyContent: "center" }}>
        <Text>Add Ankara tote bag</Text>
      </Pressable>
      <Link href="/cart" style={{ paddingVertical: 12 }}>Cart ({items.length})</Link>
    </View>
  );
}
`;
const E2E_CART_SCREEN = `import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { useCart } from "@/cart";

export default function Cart() {
  const { items, clear } = useCart();
  const [done, setDone] = useState(false);
  if (done) return <Text style={{ padding: 20 }}>Order placed</Text>;
  return (
    <View style={{ padding: 20, gap: 10 }}>
      {items.map((name, i) => <Text key={i}>1 × {name}</Text>)}
      <Pressable accessibilityRole="button" onPress={() => { clear(); setDone(true); }} style={{ minHeight: 48, justifyContent: "center" }}>
        <Text>Place order</Text>
      </Pressable>
    </View>
  );
}
`;
const FLOW_START = `appId: ng.kobo.app
---
- launchApp:
    clearState: true
# Write the flow: add the tote bag, open the cart, check it's there, place the order, check it worked.
`;
const FLOW_MODEL = `appId: ng.kobo.app
---
- launchApp:
    clearState: true
- tapOn:
    id: "add-tote"
- assertVisible: "Cart \\\\(1\\\\)"
- tapOn: "Cart \\\\(1\\\\)"
- assertVisible: "1 × Ankara tote bag"
- tapOn: "Place order"
- assertVisible: "Order placed"
`;

/* ── 18.7 · Forms ────────────────────────────────────────────────────── */
export const SIGNUP_FORM = `import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";

type Props = { onSubmit: (details: { email: string; password: string }) => Promise<void> };

/** The form receives what to do on submit, so tests can pass a mock. */
export function SignUpForm({ onSubmit }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<string[]>([]);
  const [status, setStatus] = useState("");

  async function submit() {
    const found: string[] = [];
    if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email.trim())) found.push("Enter a valid email address");
    if (password.length < 8) found.push("Use at least 8 characters");
    setErrors(found);
    if (found.length) return;
    try {
      await onSubmit({ email: email.trim().toLowerCase(), password });
      setStatus("Account created");
    } catch (e) {
      setStatus((e as Error).message);
    }
  }

  return (
    <View>
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} />
      <TextInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
      {errors.map((e) => <Text key={e}>{e}</Text>)}
      <Pressable accessibilityRole="button" onPress={submit}><Text>Create account</Text></Pressable>
      {status ? <Text accessibilityRole="alert">{status}</Text> : null}
    </View>
  );
}
`;
const formMutant = (from, to) => ({ "src/components/SignUpForm.tsx": SIGNUP_FORM.replace(from, to) });
const FORM_TEST_START = `import { fireEvent, render, screen, waitFor } from "@testing-library/react-native";
import { SignUpForm } from "@/components/SignUpForm";

test("an invalid email is refused and nothing is sent", async () => {
  const onSubmit = jest.fn();
  await render(<SignUpForm onSubmit={onSubmit} />);
  await fireEvent.changeText(screen.getByPlaceholderText("Email"), "ada@");
  await fireEvent.changeText(screen.getByPlaceholderText("Password"), "kobo1234");
  await fireEvent.press(screen.getByRole("button", { name: "Create account" }));
  expect(screen.getByText("Enter a valid email address")).toBeOnTheScreen();
  expect(onSubmit).not.toHaveBeenCalled();
});

// Add tests: a short password is refused; valid details are sent trimmed and
// lower-cased and "Account created" is shown; a failure from onSubmit shows its message.
`;
const FORM_TEST_MODEL = `import { fireEvent, render, screen, waitFor } from "@testing-library/react-native";
import { SignUpForm } from "@/components/SignUpForm";

async function fill(email: string, password: string) {
  await fireEvent.changeText(screen.getByPlaceholderText("Email"), email);
  await fireEvent.changeText(screen.getByPlaceholderText("Password"), password);
  await fireEvent.press(screen.getByRole("button", { name: "Create account" }));
}

test("an invalid email is refused and nothing is sent", async () => {
  const onSubmit = jest.fn();
  await render(<SignUpForm onSubmit={onSubmit} />);
  await fill("ada@", "kobo1234");
  expect(screen.getByText("Enter a valid email address")).toBeOnTheScreen();
  expect(onSubmit).not.toHaveBeenCalled();
});

test("a short password is refused", async () => {
  const onSubmit = jest.fn();
  await render(<SignUpForm onSubmit={onSubmit} />);
  await fill("ada@example.com", "kobo");
  expect(screen.getByText("Use at least 8 characters")).toBeOnTheScreen();
  expect(onSubmit).not.toHaveBeenCalled();
});

test("valid details are sent cleaned up", async () => {
  const onSubmit = jest.fn().mockResolvedValue(undefined);
  await render(<SignUpForm onSubmit={onSubmit} />);
  await fill("  Ada@Example.com ", "kobo1234");
  expect(onSubmit).toHaveBeenCalledWith({ email: "ada@example.com", password: "kobo1234" });
  await waitFor(() => expect(screen.getByRole("alert")).toHaveTextContent("Account created"));
});

test("a failure shows its message", async () => {
  const onSubmit = jest.fn().mockRejectedValue(new Error("An account with this email already exists"));
  await render(<SignUpForm onSubmit={onSubmit} />);
  await fill("ada@example.com", "kobo1234");
  await waitFor(() => expect(screen.getByRole("alert")).toHaveTextContent("An account with this email already exists"));
});
`;

/* ── 18.8 · Mocking the network ──────────────────────────────────────── */
export const PRODUCT_LIST = `import { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";

type State = { kind: "loading" } | { kind: "error"; message: string } | { kind: "ok"; names: string[] };

export function ProductList() {
  const [state, setState] = useState<State>({ kind: "loading" });
  useEffect(() => {
    fetch("https://api.example.com/products")
      .then(async (r) => {
        if (!r.ok) throw new Error("We couldn't load products (" + r.status + ")");
        const data: { name: string }[] = await r.json();
        setState({ kind: "ok", names: data.map((p) => p.name) });
      })
      .catch((e: Error) => setState({ kind: "error", message: e instanceof TypeError ? "You're offline" : e.message }));
  }, []);
  if (state.kind === "loading") return <ActivityIndicator accessibilityLabel="Loading products" />;
  if (state.kind === "error") return <Text accessibilityRole="alert">{state.message}</Text>;
  if (state.names.length === 0) return <Text>No products yet</Text>;
  return <View>{state.names.map((n) => <Text key={n}>{n}</Text>)}</View>;
}
`;
const listMutant = (from, to) => ({ "src/components/ProductList.tsx": PRODUCT_LIST.replace(from, to) });
const MOCK_START = `import { render, screen, waitFor } from "@testing-library/react-native";
import { ProductList } from "@/components/ProductList";

/** A fake fetch response with a JSON body. */
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });

afterEach(() => jest.restoreAllMocks());

test("shows the products the server sends", async () => {
  jest.spyOn(globalThis, "fetch").mockResolvedValue(json([{ name: "Shea butter" }]));
  await render(<ProductList />);
  await waitFor(() => expect(screen.getByText("Shea butter")).toBeOnTheScreen());
});

// Add tests with mocked responses: an empty list, a 500 error, and no network
// (fetch rejecting with new TypeError("Network request failed")).
`;
const MOCK_MODEL = `import { render, screen, waitFor } from "@testing-library/react-native";
import { ProductList } from "@/components/ProductList";

/** A fake fetch response with a JSON body. */
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });

afterEach(() => jest.restoreAllMocks());

test("shows the products the server sends", async () => {
  jest.spyOn(globalThis, "fetch").mockResolvedValue(json([{ name: "Shea butter" }]));
  await render(<ProductList />);
  await waitFor(() => expect(screen.getByText("Shea butter")).toBeOnTheScreen());
});

test("an empty list says so", async () => {
  jest.spyOn(globalThis, "fetch").mockResolvedValue(json([]));
  await render(<ProductList />);
  await waitFor(() => expect(screen.getByText("No products yet")).toBeOnTheScreen());
});

test("a server error is explained", async () => {
  jest.spyOn(globalThis, "fetch").mockResolvedValue(json({ message: "boom" }, 500));
  await render(<ProductList />);
  await waitFor(() => expect(screen.getByRole("alert")).toHaveTextContent("We couldn't load products (500)"));
});

test("no network is explained", async () => {
  jest.spyOn(globalThis, "fetch").mockRejectedValue(new TypeError("Network request failed"));
  await render(<ProductList />);
  await waitFor(() => expect(screen.getByRole("alert")).toHaveTextContent("You're offline"));
});

test("it asks the right endpoint", async () => {
  const spy = jest.spyOn(globalThis, "fetch").mockResolvedValue(json([]));
  await render(<ProductList />);
  await waitFor(() => expect(spy).toHaveBeenCalledWith("https://api.example.com/products"));
});
`;

const testsOnly = (msg) => `import { Text } from "react-native";

export default function Home() {
  return <Text style={{ padding: 20 }}>${msg}</Text>;
}
`;

export const PART1 = [
  /* ═══════════════ LESSON 113 · 18.1 – 18.2 ═══════════════ */
  {
    id: "md-l113-devices",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 1,
    covers: ["18.1", "18.2"],
    title: "Testing on Real Phones, Emulators and Simulators",
    subtitle: "Where to test, and what each place can and can't tell you",
    estimatedMinutes: 40,
    intro: "Every test in this module answers one question: will this work for real people on real phones? Start with the phones themselves.",
    atoms: [
      {
        id: "a-md-manual-testing",
        title: "Manual testing on physical devices",
        explain:
          "Nothing replaces a real phone in your hand: real touch, real performance, the camera, GPS, push notifications, biometrics, the keyboard covering fields, sunlight on the screen, a weak signal. Build a small DEVICE MATRIX from your users (analytics, or Play Console's device catalogue): at least one low-to-mid-range Android phone (most users in many markets), a recent Android, an older supported iPhone and a recent one. Test in a development build for features, and in a RELEASE build before shipping (different speed, no dev menu, real error behaviour). Use a written TEST PLAN: the main flows (sign up, buy, pay), the edge cases (no network, permission refused, very long names, large text, dark mode, rotation, Android's back button), and what \"pass\" looks like. Record what you tested on which device and build.",
        decision: {
          scenario: "You have two days before submitting Kobo to the stores. You own a new iPhone. Analytics from the beta say 78% of your users are on Android, mostly phones that cost under ₦150,000.",
          question: "What testing plan makes most sense?",
          options: [
            { id: "a", text: "Borrow or buy one mid-range Android phone, run a written test plan for the main flows and edge cases on it and on your iPhone, in release builds", why: "It covers the phones most users actually have, on the build they'll actually get, with a plan that makes the testing repeatable and complete." },
            { id: "b", text: "Test everything thoroughly on your iPhone; Android works the same", whyWrong: "Android behaves differently (back button, permissions, keyboard, performance on cheaper hardware), and it's where most of your users are." },
            { id: "c", text: "Only use the iOS simulator and Android emulator on your laptop", whyWrong: "Emulators run on your laptop's CPU and lack real cameras, sensors and network conditions; they hide performance and hardware problems." },
            { id: "d", text: "Skip manual testing: the automated tests pass", whyWrong: "Automated tests can't judge how it feels, how it looks in sunlight, or a real phone's camera and push notifications." },
          ],
          correct: "a",
          aftermath: "Test where your users are, on the build they'll get, from a written plan.",
        },
      },
      {
        id: "a-md-emulators-testing",
        title: "Testing with Android emulators and iOS simulators where available",
        explain:
          "EMULATORS and SIMULATORS are fast for daily development and for screen sizes you don't own. Android Studio's emulator runs on Windows, macOS and Linux (create devices with the Device Manager; use a Google Play system image for Play services; press a in the npx expo start terminal to open the app). Apple's iOS Simulator needs a Mac with Xcode (press i); on Windows, test iOS on a real iPhone with a development build, or use EAS Build for simulator builds on someone's Mac. What they're good for: layouts on many sizes, light/dark mode, font scaling, locales, deep links (npx uri-scheme), and simulated location and slow networks. Their limits: performance isn't representative (they use your computer's CPU), cameras and Bluetooth are missing or fake, biometrics and push are simulated or limited, and real-world conditions (memory pressure, background killing) differ. Use them for breadth, real phones for truth.",
        decision: {
          scenario: "A teammate on Windows asks how to test the iPhone version of the app, and whether the Android emulator is enough to check performance.",
          question: "What is the accurate advice?",
          options: [
            { id: "a", text: "The iOS Simulator needs a Mac; on Windows, use a real iPhone with a development build. The Android emulator is fine for layouts and flows, but check performance on a real mid-range phone", why: "Simulators are Mac-only, and emulators run on the computer's fast CPU, so they can't show how the app performs on users' phones." },
            { id: "b", text: "Install the iOS Simulator on Windows from the Microsoft Store", whyWrong: "Apple's Simulator only runs on macOS, as part of Xcode." },
            { id: "c", text: "The emulator is accurate for performance because it emulates the same chip", whyWrong: "Emulators typically run on the host's CPU and GPU, far faster than budget phones." },
            { id: "d", text: "Expo Go makes simulators unnecessary for iOS", whyWrong: "Expo Go runs on a real iPhone too; it doesn't give you a simulator on Windows." },
          ],
          correct: "a",
          aftermath: "Simulators and emulators for breadth and speed; real phones for performance and hardware.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════ LESSON 114 · 18.3 – 18.4 ═══════════════ */
  {
    id: "md-l114-unit-component",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 2,
    covers: ["18.3", "18.4"],
    title: "Unit Tests and Component Tests",
    subtitle: "Proving the rules, and proving the pieces of the screen",
    estimatedMinutes: 55,
    intro: "Automated tests are code that checks your code, in seconds, every time anything changes. Start at the bottom: functions and components.",
    atoms: [
      {
        id: "a-md-unit-tests",
        title: "Unit testing",
        explain:
          "A UNIT TEST checks one small piece (a function, a reducer, a validation schema) in isolation, with plain inputs and expected outputs. Expo projects use Jest with the jest-expo preset (npx expo install jest-expo jest @types/jest, then \"test\": \"jest\" in package.json; Module 2 recorded it). Files end in .test.ts or live in __tests__; test(\"what it does\", () => { expect(actual).toBe(expected); }), grouped with describe. Good unit tests: one behaviour per test with a name that says it; the EDGE CASES (zero, the limit itself, rounding, empty input, odd case and spaces) where bugs live; no dependence on each other or on the current date. They pay for themselves when you change code: a failing test tells you exactly which rule broke. This lab grades your tests by running them against broken versions of the code: a good suite catches each one.",
        webLab: expoLab({
          name: "Kobo",
          layout: null,
          task:
            "Write unit tests for cartTotals in __tests__/cart.test.ts covering every rule in its comment: the discount code in any case and with spaces (and a wrong code), rounding of the discount, the ₦1,500 delivery fee, free delivery from ₦20,000, and free delivery measured after the discount. The checks then break the function in five ways: your tests must catch each one.",
          files: { "__tests__/cart.test.ts": UNIT_START, "src/utils/cart.ts": CART_RULES, "src/app/index.tsx": testsOnly("Run the tests in __tests__/cart.test.ts.") },
          readOnly: ["src/utils/cart.ts", "src/app/index.tsx"],
          solution: { "__tests__/cart.test.ts": UNIT_MODEL },
          tests: suite(5, [
            ["They catch a case-sensitive code", cartMutant(`code.trim().toUpperCase() === DISCOUNT_CODE`, `code.trim() === DISCOUNT_CODE`), "Test the code in lower case."],
            ["They catch spaces not being trimmed", cartMutant(`code.trim().toUpperCase()`, `code.toUpperCase()`), "Test the code with spaces around it."],
            ["They catch rounding down instead of to the nearest naira", cartMutant(`Math.round(subtotal * 0.1)`, `Math.floor(subtotal * 0.1)`), "Test a discount that rounds up, e.g. 10% of 1,255."],
            ["They catch free delivery from the wrong amount", cartMutant(`>= FREE_DELIVERY_FROM`, `> FREE_DELIVERY_FROM`), "Test exactly ₦20,000."],
            ["They catch delivery measured before the discount", cartMutant(`subtotal - discount >= FREE_DELIVERY_FROM`, `subtotal >= FREE_DELIVERY_FROM`), "Test an order just over ₦20,000 with the discount."],
          ]),
          hint: "Each mutant breaks one rule: write one test per rule, at its edge.",
          successMessage: "A unit suite that catches every broken rule.",
        }),
      },
      {
        id: "a-md-component-tests",
        title: "Component testing",
        explain:
          "A COMPONENT TEST renders one component and uses it like a person would. React Native Testing Library (RNTL) does it: await render(<QuantityStepper value={2} onChange={onChange} />), then find things the way users and screen readers do: screen.getByRole(\"button\", { name: \"More\" }), getByText, getByLabelText, getByPlaceholderText (queryBy… returns null instead of throwing, findBy… waits). Act with fireEvent.press / fireEvent.changeText (or userEvent for more realism); in RNTL 14 these are async, so await them. Assert with Jest's matchers plus RNTL's: toBeOnTheScreen, toBeDisabled, toHaveTextContent. Pass jest.fn() for callbacks and check toHaveBeenCalledWith. Test BEHAVIOUR, not implementation: no internal state, no style details. Querying by role and name also proves the component is accessible.",
        webLab: expoLab({
          name: "Kobo",
          layout: null,
          task:
            "Write component tests for QuantityStepper in __tests__/stepper.test.tsx: \"More\" calls onChange with value + 1; \"Fewer\" calls it with value − 1; \"Fewer\" is disabled at the minimum (and \"More\" isn't); \"More\" is disabled at the maximum. Query by role and name.",
          files: { "__tests__/stepper.test.tsx": COMPONENT_START, "src/components/QuantityStepper.tsx": STEPPER, "src/app/index.tsx": testsOnly("Run the tests in __tests__/stepper.test.tsx.") },
          readOnly: ["src/components/QuantityStepper.tsx", "src/app/index.tsx"],
          solution: { "__tests__/stepper.test.tsx": COMPONENT_MODEL },
          tests: suite(4, [
            ["They catch More adding the wrong amount", stepperMutant(`onChange(value + 1)`, `onChange(value + 2)`), "expect(onChange).toHaveBeenCalledWith(3)"],
            ["They catch Fewer going the wrong way", stepperMutant(`onChange(value - 1)`, `onChange(value + 1)`), "Test Fewer's onChange value."],
            ["They catch a Fewer button that's never disabled", stepperMutant(`disabled={value <= min}`, `disabled={false}`), "expect(…Fewer…).toBeDisabled() at the minimum."],
            ["They catch a More button that's never disabled", stepperMutant(`disabled={value >= max}`, `disabled={false}`), "expect(…More…).toBeDisabled() at the maximum."],
          ]),
          hint: "const onChange = jest.fn(); … await fireEvent.press(screen.getByRole(\"button\", { name: \"More\" }));",
          successMessage: "Component tests that use the stepper like a person, and catch every broken behaviour.",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════ LESSON 115 · 18.5 – 18.6 ═══════════════ */
  {
    id: "md-l115-integration-e2e",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 3,
    covers: ["18.5", "18.6"],
    title: "Integration Tests and End-to-End Tests",
    subtitle: "Screens working together, and the whole app driven like a user",
    estimatedMinutes: 60,
    intro: "Units can each be right while the app is wrong. Higher-level tests check the pieces together, and the app as a whole.",
    atoms: [
      {
        id: "a-md-integration-tests",
        title: "Integration testing",
        explain:
          "An INTEGRATION TEST checks several real pieces together: screens, the router, context and the API layer. Expo Router ships testing helpers: import { renderRouter, screen } from \"expo-router/testing-library\"; renderRouter({ _layout: RootLayout, index: Home, \"sign-in\": SignIn }, { initialUrl: \"/\" }) mounts a real router with your screens; then interact with RNTL and assert where you are with expect(app.getPathname()).toBe(\"/sign-in\") (app is what renderRouter returns). The network can be real (a test server), or mocked (next lessons): integration tests decide how far \"real\" goes. They catch what unit tests can't: a guard in the wrong place, a screen that doesn't react to the session, an error that never reaches the UI. Use waitFor (or findBy queries) for anything asynchronous. Keep them fewer than unit tests: they're slower and broader.",
        webLab: expoLab({
          name: "Kobo",
          layout: null,
          task:
            "In __tests__/sign-in.test.tsx, using renderRouter with the real screens: a correct sign-in (\" ada@example.com \" / kobo1234) ends on \"/\" showing \"Welcome, Ada\"; a wrong password stays on /sign-in and shows the server's \"Wrong email or password\" in the alert. The checks then break the guards and the error handling: your tests must catch each.",
          files: {
            "__tests__/sign-in.test.tsx": INT_START,
            "src/screens/_layout.tsx": INT_LAYOUT,
            "src/screens/index.tsx": INT_HOME,
            "src/screens/sign-in.tsx": INT_SIGN_IN,
            "src/screens/session.tsx": INT_SESSION,
            "server/index.js": INT_SERVER,
          },
          readOnly: ["src/screens/_layout.tsx", "src/screens/index.tsx", "src/screens/sign-in.tsx", "src/screens/session.tsx", "server/index.js"],
          solution: { "__tests__/sign-in.test.tsx": INT_MODEL },
          tests: suite(3, [
            ["They catch a sign-in that never opens the app", { "src/screens/_layout.tsx": INT_LAYOUT.replace("guard={!!user}", "guard={false}").replace("guard={!user}", "guard={true}") }, "Assert the pathname and \"Welcome, Ada\" after signing in."],
            ["They catch errors that never reach the screen", { "src/screens/sign-in.tsx": INT_SIGN_IN.replace(".catch((e: Error) => setError(e.message))", ".catch(() => {})") }, "Assert the alert's text after a wrong password."],
            ["They catch an e-mail that isn't trimmed", { "src/screens/sign-in.tsx": INT_SIGN_IN.replace("signIn(email.trim(), password)", "signIn(email, password)") }, "Sign in with spaces around the e-mail."],
          ]),
          hint: "await waitFor(() => expect(screen.getByText(\"Welcome, Ada\")).toBeOnTheScreen());",
          successMessage: "Tests that prove the screens, the router and the server work together.",
        }),
      },
      {
        id: "a-md-e2e",
        title: "End-to-end testing",
        explain:
          "END-TO-END (E2E) tests drive the real, built app on a phone or emulator, exactly as a user does: launch, tap, type, check the screen. For Expo apps the usual tool is MAESTRO: tests are YAML FLOWS in a .maestro/ folder (appId, then steps such as launchApp, tapOn, inputText, assertVisible, scrollUntilVisible, back), run with maestro test .maestro/ on your machine, or in CI with EAS Workflows on a cloud emulator. (Detox is the other common choice.) Selectors are visible text (as regular expressions, so escape brackets) or testID (id:). E2E tests are the slowest and most fragile, so write a FEW for the flows that matter most (sign up, purchase, the core task), make them independent (clearState), and prefer testID for elements whose text changes. Unit, component, integration and E2E together make the TESTING PYRAMID: many fast tests at the bottom, few slow ones at the top.",
        webLab: expoLab({
          name: "Kobo",
          layout: E2E_LAYOUT,
          app: { ios: { bundleIdentifier: "ng.kobo.app" }, android: { package: "ng.kobo.app" } },
          task:
            "Write the Maestro flow .maestro/checkout.yaml: launch with a clear state, tap the add button by its id \"add-tote\", check \"Cart (1)\" is visible (escape the brackets: it's a regular expression), open the cart, check \"1 × Ankara tote bag\", tap \"Place order\", and check \"Order placed\". The checks run your flow on the practice phone, and again against a broken app.",
          files: {
            ".maestro/checkout.yaml": FLOW_START,
            "src/app/index.tsx": E2E_SHOP,
            "src/app/cart.tsx": E2E_CART_SCREEN,
            "src/cart.tsx": E2E_CART,
          },
          readOnly: ["src/app/index.tsx", "src/app/cart.tsx", "src/cart.tsx", "src/app/_layout.tsx"],
          solution: { ".maestro/checkout.yaml": FLOW_MODEL },
          tests: [
            { label: "The flow passes on the real app", check: "const r = await maestro('.maestro/checkout.yaml'); return r.passed && r.steps.length >= 6;", fail: "launchApp, tapOn id add-tote, assertVisible, tapOn the cart link, assertVisible, tapOn Place order, assertVisible." },
            { label: "It fails when adding to the cart is broken", swap: { "src/cart.tsx": E2E_CART.replace("setItems((i) => [...i, n])", "setItems((i) => i)") }, check: "const r = await maestro('.maestro/checkout.yaml'); return !r.passed;", fail: "Assert the cart count and the cart line." },
            { label: "It fails when placing the order is broken", swap: { "src/app/cart.tsx": E2E_CART_SCREEN.replace("clear(); setDone(true);", "clear();") }, check: "const r = await maestro('.maestro/checkout.yaml'); return !r.passed;", fail: "assertVisible: \"Order placed\" at the end." },
          ],
          hint: "In YAML, a text selector with brackets needs them escaped as \\\\( and \\\\).",
          successMessage: "An end-to-end flow that checks the purchase works, from launch to \"Order placed\".",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════ LESSON 116 · 18.7 – 18.8 ═══════════════ */
  {
    id: "md-l116-forms-mocks",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 4,
    covers: ["18.7", "18.8"],
    title: "Testing Forms, Auth and APIs, and Mocking the Network",
    subtitle: "The flows that break most often, tested without depending on a real server",
    estimatedMinutes: 55,
    intro: "Forms, sign-in and API calls cause most real bugs. Testing them well means controlling what the network says.",
    atoms: [
      {
        id: "a-md-testing-flows",
        title: "Testing forms, navigation, authentication, and API requests",
        explain:
          "Test these flows for what users see and what gets SENT: invalid input shows its message and sends nothing; valid input is sent cleaned (trimmed, lower-cased e-mail); the button is disabled while busy; the server's errors are shown; success moves on (navigation: getPathname()). Make components TESTABLE by passing in what they depend on (an onSubmit prop, an api client from context) instead of importing it directly: tests pass jest.fn() and check toHaveBeenCalledWith(…), mockResolvedValue for success or mockRejectedValue for failure. For authentication, test the guarded routes for signed-in and signed-out users, the expired-session path, and that tokens never appear on screen or in logs. Name tests after the behaviour (\"a short password is refused\") so a failure reads like a bug report.",
        webLab: expoLab({
          name: "Kobo",
          layout: null,
          task:
            "In __tests__/sign-up.test.tsx, test SignUpForm with a mocked onSubmit: a short password is refused (\"Use at least 8 characters\") and nothing is sent; valid details are sent trimmed and lower-cased ({ email: \"ada@example.com\", password }) and \"Account created\" is shown; a rejected onSubmit shows its error message. The checks then break the form four ways.",
          files: { "__tests__/sign-up.test.tsx": FORM_TEST_START, "src/components/SignUpForm.tsx": SIGNUP_FORM, "src/app/index.tsx": testsOnly("Run the tests in __tests__/sign-up.test.tsx.") },
          readOnly: ["src/components/SignUpForm.tsx", "src/app/index.tsx"],
          solution: { "__tests__/sign-up.test.tsx": FORM_TEST_MODEL },
          tests: suite(4, [
            ["They catch a missing password rule", formMutant(`if (password.length < 8) found.push("Use at least 8 characters");`, ``), "Test a short password."],
            ["They catch an e-mail sent uncleaned", formMutant(`email: email.trim().toLowerCase()`, `email`), "Send \"  Ada@Example.com \" and check what onSubmit received."],
            ["They catch errors that are swallowed", formMutant(`setStatus((e as Error).message);`, `setStatus("");`), "mockRejectedValue(new Error(\"…\")) and check the alert."],
            ["They catch a success that says nothing", formMutant(`setStatus("Account created");`, ``), "Check \"Account created\" appears."],
          ]),
          hint: "jest.fn().mockResolvedValue(undefined) and jest.fn().mockRejectedValue(new Error(\"…\")).",
          successMessage: "The form's rules, its cleaning and its errors, all locked in by tests.",
        }),
      },
      {
        id: "a-md-mocking-network",
        title: "Mocking network responses",
        explain:
          "Tests that hit a real server are slow, flaky and can't easily produce a 500 or a dropped connection. MOCK the network instead, so each test decides exactly what the server \"says\": jest.spyOn(globalThis, \"fetch\").mockResolvedValue(new Response(JSON.stringify(body), { status })) for any response, mockRejectedValue(new TypeError(\"Network request failed\")) for no network, and jest.restoreAllMocks() after each test. Then you can test every state: loading, success, empty, server error, offline. For bigger apps, MSW (Mock Service Worker) describes fake endpoints by URL and works across fetch and clients, and some teams test against a local test server. Also assert what the app SENT (the URL, method, headers, body): toHaveBeenCalledWith on the spy.",
        webLab: expoLab({
          name: "Kobo",
          layout: null,
          task:
            "In __tests__/products.test.tsx, mock fetch to test ProductList's other states: an empty list (\"No products yet\"), a 500 (\"We couldn't load products (500)\"), no network (\"You're offline\" when fetch rejects with a TypeError), and that it calls https://api.example.com/products. The checks then break each state's handling.",
          files: { "__tests__/products.test.tsx": MOCK_START, "src/components/ProductList.tsx": PRODUCT_LIST, "src/app/index.tsx": testsOnly("Run the tests in __tests__/products.test.tsx.") },
          readOnly: ["src/components/ProductList.tsx", "src/app/index.tsx"],
          solution: { "__tests__/products.test.tsx": MOCK_MODEL },
          tests: suite(4, [
            ["They catch a missing empty state", listMutant(`if (state.names.length === 0) return <Text>No products yet</Text>;`, ``), "Mock [] and expect \"No products yet\"."],
            ["They catch server errors being ignored", listMutant(`if (!r.ok) throw new Error("We couldn't load products (" + r.status + ")");`, ``), "Mock a 500 and expect the alert."],
            ["They catch offline being reported as a generic error", listMutant(`e instanceof TypeError ? "You're offline" : e.message`, `e.message`), "mockRejectedValue(new TypeError(\"Network request failed\"))."],
            ["They catch the wrong endpoint", listMutant(`fetch("https://api.example.com/products")`, `fetch("https://api.example.com/product")`), "expect(spy).toHaveBeenCalledWith(\"https://api.example.com/products\")"],
          ]),
          hint: "Each test mocks fetch first, then renders.",
          successMessage: "Every network state tested, in milliseconds, without a server.",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },
];
