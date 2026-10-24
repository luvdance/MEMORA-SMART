/**
 * MOBILE APP DEVELOPMENT · MODULE 11 · MANAGING APPLICATION STATE (part 1)
 *
 * Curriculum 11.1 – 11.6: what state is, local state, sharing data
 * between components, derived state, Context, and useReducer.
 *
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 */

import { expoLab } from "./md-helpers.js";

export const SECTION_ID = "md-s11-state";
export const MODULE = "md-m11-state";

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

/* ── 11.1 · What state is ────────────────────────────────────────────── */
const STEPPER_START = `import { Pressable, Text, View } from "react-native";
import { naira } from "@/utils/money";

const PRICE = 8500;

export default function Product() {
  let qty = 1;

  return (
    <View style={{ padding: 20, gap: 12 }}>
      <Text style={{ fontSize: 22, fontWeight: "700" }}>Ankara tote bag</Text>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 16 }}>
        <Pressable accessibilityRole="button" accessibilityLabel="Fewer" onPress={() => (qty = qty - 1)} style={{ width: 48, height: 48, justifyContent: "center", alignItems: "center" }}>
          <Text>−</Text>
        </Pressable>
        <Text>Qty {qty}</Text>
        <Pressable accessibilityRole="button" accessibilityLabel="More" onPress={() => (qty = qty + 1)} style={{ width: 48, height: 48, justifyContent: "center", alignItems: "center" }}>
          <Text>+</Text>
        </Pressable>
      </View>
      <Text>Add to cart · {naira(PRICE * qty)}</Text>
    </View>
  );
}
`;
const STEPPER_MODEL = `import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { naira } from "@/utils/money";

const PRICE = 8500;
const MIN = 1;
const MAX = 10;

export default function Product() {
  const [qty, setQty] = useState(MIN);

  return (
    <View style={{ padding: 20, gap: 12 }}>
      <Text style={{ fontSize: 22, fontWeight: "700" }}>Ankara tote bag</Text>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 16 }}>
        <Pressable accessibilityRole="button" accessibilityLabel="Fewer" disabled={qty <= MIN} onPress={() => setQty((q) => Math.max(MIN, q - 1))} style={{ width: 48, height: 48, justifyContent: "center", alignItems: "center", opacity: qty <= MIN ? 0.4 : 1 }}>
          <Text>−</Text>
        </Pressable>
        <Text>Qty {qty}</Text>
        <Pressable accessibilityRole="button" accessibilityLabel="More" disabled={qty >= MAX} onPress={() => setQty((q) => Math.min(MAX, q + 1))} style={{ width: 48, height: 48, justifyContent: "center", alignItems: "center", opacity: qty >= MAX ? 0.4 : 1 }}>
          <Text>+</Text>
        </Pressable>
      </View>
      <Text>Add to cart · {naira(PRICE * qty)}</Text>
    </View>
  );
}
`;

/* ── 11.2 · Local state ──────────────────────────────────────────────── */
const FAQ_START = `import { useState } from "react";
import { Pressable, Text, View } from "react-native";

const FAQS = [
  { q: "How long does delivery take?", a: "Two to four working days in Lagos and Abuja." },
  { q: "Can I return an item?", a: "Yes, within 14 days, unused and in its packaging." },
  { q: "Do you deliver outside Nigeria?", a: "Not yet. Ghana is next." },
];

function FaqItem({ q, a, open, onToggle }: { q: string; a: string; open: boolean; onToggle: () => void }) {
  return (
    <View style={{ borderBottomWidth: 1, borderColor: "#e2e8f0" }}>
      <Pressable accessibilityRole="button" accessibilityState={{ expanded: open }} onPress={onToggle} style={{ paddingVertical: 14 }}>
        <Text style={{ fontWeight: "600" }}>{q}</Text>
      </Pressable>
      {open && <Text style={{ paddingBottom: 14 }}>{a}</Text>}
    </View>
  );
}

export default function Help() {
  const [open, setOpen] = useState(false);
  return (
    <View style={{ padding: 20 }}>
      {FAQS.map((f) => (
        <FaqItem key={f.q} q={f.q} a={f.a} open={open} onToggle={() => setOpen(!open)} />
      ))}
    </View>
  );
}
`;
const FAQ_MODEL = `import { useState } from "react";
import { Pressable, Text, View } from "react-native";

const FAQS = [
  { q: "How long does delivery take?", a: "Two to four working days in Lagos and Abuja." },
  { q: "Can I return an item?", a: "Yes, within 14 days, unused and in its packaging." },
  { q: "Do you deliver outside Nigeria?", a: "Not yet. Ghana is next." },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <View style={{ borderBottomWidth: 1, borderColor: "#e2e8f0" }}>
      <Pressable accessibilityRole="button" accessibilityState={{ expanded: open }} onPress={() => setOpen((o) => !o)} style={{ paddingVertical: 14 }}>
        <Text style={{ fontWeight: "600" }}>{q}</Text>
      </Pressable>
      {open && <Text style={{ paddingBottom: 14 }}>{a}</Text>}
    </View>
  );
}

export default function Help() {
  return (
    <View style={{ padding: 20 }}>
      {FAQS.map((f) => (
        <FaqItem key={f.q} q={f.q} a={f.a} />
      ))}
    </View>
  );
}
`;

/* ── 11.3 · Sharing data: lifting state up ───────────────────────────── */
const PRODUCTS = `export type Category = "All" | "Phones" | "Fashion" | "Home";
export type Product = { id: string; name: string; category: Exclude<Category, "All"> };

export const CATEGORIES: Category[] = ["All", "Phones", "Fashion", "Home"];

export const PRODUCTS: Product[] = [
  { id: "1", name: "Redmi Note 14", category: "Phones" },
  { id: "2", name: "Ankara tote bag", category: "Fashion" },
  { id: "3", name: "Tecno Spark 30", category: "Phones" },
  { id: "4", name: "Woven raffia mat", category: "Home" },
];
`;
const FILTER_BAR_START = `import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { CATEGORIES, type Category } from "@/data/products";

export function FilterBar() {
  const [selected, setSelected] = useState<Category>("All");
  return (
    <View style={{ flexDirection: "row", gap: 8, padding: 12 }}>
      {CATEGORIES.map((c) => (
        <Pressable
          key={c}
          accessibilityRole="button"
          accessibilityState={{ selected: c === selected }}
          onPress={() => setSelected(c)}
          style={{ paddingHorizontal: 14, minHeight: 40, justifyContent: "center", borderRadius: 20, backgroundColor: c === selected ? "#0f766e" : "#e2e8f0" }}
        >
          <Text style={{ color: c === selected ? "#fff" : "#0f172a" }}>{c}</Text>
        </Pressable>
      ))}
    </View>
  );
}
`;
const FILTER_BAR_MODEL = `import { Pressable, Text, View } from "react-native";
import { CATEGORIES, type Category } from "@/data/products";

type Props = { selected: Category; onSelect: (category: Category) => void };

export function FilterBar({ selected, onSelect }: Props) {
  return (
    <View style={{ flexDirection: "row", gap: 8, padding: 12 }}>
      {CATEGORIES.map((c) => (
        <Pressable
          key={c}
          accessibilityRole="button"
          accessibilityState={{ selected: c === selected }}
          onPress={() => onSelect(c)}
          style={{ paddingHorizontal: 14, minHeight: 40, justifyContent: "center", borderRadius: 20, backgroundColor: c === selected ? "#0f766e" : "#e2e8f0" }}
        >
          <Text style={{ color: c === selected ? "#fff" : "#0f172a" }}>{c}</Text>
        </Pressable>
      ))}
    </View>
  );
}
`;
const PRODUCT_LIST = `import { Text, View } from "react-native";
import type { Product } from "@/data/products";

export function ProductList({ products }: { products: Product[] }) {
  return (
    <View style={{ paddingHorizontal: 16 }}>
      {products.map((p) => (
        <Text key={p.id} testID="product" style={{ paddingVertical: 12, fontSize: 16 }}>
          {p.name}
        </Text>
      ))}
    </View>
  );
}
`;
const SHOP_START = `import { View } from "react-native";
import { FilterBar } from "@/components/FilterBar";
import { ProductList } from "@/components/ProductList";
import { PRODUCTS } from "@/data/products";

export default function Shop() {
  return (
    <View>
      <FilterBar />
      <ProductList products={PRODUCTS} />
    </View>
  );
}
`;
const SHOP_MODEL = `import { useState } from "react";
import { View } from "react-native";
import { FilterBar } from "@/components/FilterBar";
import { ProductList } from "@/components/ProductList";
import { PRODUCTS, type Category } from "@/data/products";

export default function Shop() {
  const [category, setCategory] = useState<Category>("All");
  const shown = category === "All" ? PRODUCTS : PRODUCTS.filter((p) => p.category === category);
  return (
    <View>
      <FilterBar selected={category} onSelect={setCategory} />
      <ProductList products={shown} />
    </View>
  );
}
`;

/* ── 11.4 · Derived state ────────────────────────────────────────────── */
const BASKET_START = `import { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { naira } from "@/utils/money";

type Line = { id: string; name: string; price: number };

const CATALOGUE: Line[] = [
  { id: "1", name: "Shea butter", price: 3000 },
  { id: "2", name: "Ankara tote bag", price: 8500 },
];

export default function Basket() {
  const [lines, setLines] = useState<Line[]>([]);
  const [count, setCount] = useState(0);
  const [total, setTotal] = useState(0);

  // Keep the count and total "in sync" with the lines.
  useEffect(() => {
    setTotal(lines.reduce((sum, l) => sum + l.price, 0));
  }, [lines]);

  function add(line: Line) {
    setLines([...lines, line]);
    setCount(count + 1);
  }

  function removeLast() {
    setLines(lines.slice(0, -1));
  }

  return (
    <View style={{ padding: 20, gap: 10 }}>
      {CATALOGUE.map((item) => (
        <Pressable key={item.id} accessibilityRole="button" onPress={() => add(item)} style={{ minHeight: 44, justifyContent: "center" }}>
          <Text>Add {item.name}</Text>
        </Pressable>
      ))}
      <Pressable accessibilityRole="button" onPress={removeLast} style={{ minHeight: 44, justifyContent: "center" }}>
        <Text>Remove last</Text>
      </Pressable>
      <Text>{count} items · {naira(total)}</Text>
    </View>
  );
}
`;
const BASKET_MODEL = `import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { naira } from "@/utils/money";

type Line = { id: string; name: string; price: number };

const CATALOGUE: Line[] = [
  { id: "1", name: "Shea butter", price: 3000 },
  { id: "2", name: "Ankara tote bag", price: 8500 },
];

export default function Basket() {
  const [lines, setLines] = useState<Line[]>([]);

  // Derived during render: always in step with lines, with nothing to sync.
  const count = lines.length;
  const total = lines.reduce((sum, l) => sum + l.price, 0);

  return (
    <View style={{ padding: 20, gap: 10 }}>
      {CATALOGUE.map((item) => (
        <Pressable key={item.id} accessibilityRole="button" onPress={() => setLines((ls) => [...ls, item])} style={{ minHeight: 44, justifyContent: "center" }}>
          <Text>Add {item.name}</Text>
        </Pressable>
      ))}
      <Pressable accessibilityRole="button" onPress={() => setLines((ls) => ls.slice(0, -1))} style={{ minHeight: 44, justifyContent: "center" }}>
        <Text>Remove last</Text>
      </Pressable>
      <Text>{count} items · {naira(total)}</Text>
    </View>
  );
}
`;

/* ── 11.5 · Context ──────────────────────────────────────────────────── */
const CTX_LAYOUT = `import { Stack } from "expo-router";
import { SettingsProvider } from "@/context/settings";

export default function RootLayout() {
  return (
    <SettingsProvider>
      <Stack>
        <Stack.Screen name="index" options={{ title: "Shop" }} />
        <Stack.Screen name="settings" options={{ title: "Settings" }} />
      </Stack>
    </SettingsProvider>
  );
}
`;
const CTX_START = `import type { ReactNode } from "react";

export type Currency = "NGN" | "USD";

// Share the chosen currency with every screen.
export function SettingsProvider({ children }: { children: ReactNode }) {
  return children;
}

export function useSettings(): { currency: Currency; setCurrency: (c: Currency) => void } {
  throw new Error("Not written yet");
}
`;
const CTX_MODEL = `import { createContext, useContext, useState, type ReactNode } from "react";

export type Currency = "NGN" | "USD";

type SettingsValue = { currency: Currency; setCurrency: (c: Currency) => void };

const SettingsContext = createContext<SettingsValue | null>(null);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrency] = useState<Currency>("NGN");
  return <SettingsContext.Provider value={{ currency, setCurrency }}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
  const value = useContext(SettingsContext);
  if (!value) throw new Error("useSettings must be used inside <SettingsProvider>");
  return value;
}
`;
const CTX_SHOP = `import { Link } from "expo-router";
import { Text, View } from "react-native";
import { useSettings } from "@/context/settings";
import { formatPrice } from "@/utils/price";

export default function Shop() {
  const { currency } = useSettings();
  return (
    <View style={{ padding: 20, gap: 12 }}>
      <Text style={{ fontSize: 18 }}>Ankara tote bag · {formatPrice(8500, currency)}</Text>
      <Link href="/settings" style={{ color: "#0f766e", paddingVertical: 12 }}>Settings</Link>
    </View>
  );
}
`;
const CTX_SETTINGS = `import { Pressable, Text, View } from "react-native";
import { useSettings, type Currency } from "@/context/settings";

const OPTIONS: Currency[] = ["NGN", "USD"];

export default function Settings() {
  const { currency, setCurrency } = useSettings();
  return (
    <View style={{ padding: 20, gap: 8 }}>
      {OPTIONS.map((c) => (
        <Pressable key={c} accessibilityRole="radio" accessibilityState={{ checked: c === currency }} onPress={() => setCurrency(c)} style={{ minHeight: 48, justifyContent: "center" }}>
          <Text>{c === currency ? "● " : "○ "}{c}</Text>
        </Pressable>
      ))}
    </View>
  );
}
`;
const CTX_PRICE = `import type { Currency } from "@/context/settings";

const NAIRA_PER_DOLLAR = 1500;

export function formatPrice(naira: number, currency: Currency) {
  if (currency === "USD") return "$" + (naira / NAIRA_PER_DOLLAR).toFixed(2);
  return "₦" + naira.toLocaleString("en-NG");
}
`;

/* ── 11.6 · useReducer ───────────────────────────────────────────────── */
const QUIZ_DATA = `export type Question = { text: string; options: string[]; answer: number };

export const QUESTIONS: Question[] = [
  { text: "Which file defines a navigator's screens?", options: ["_layout.tsx", "app.json"], answer: 0 },
  { text: "Which hook reads a route's params?", options: ["useState", "useLocalSearchParams"], answer: 1 },
  { text: "Which command installs SDK-compatible packages?", options: ["npx expo install", "npm update"], answer: 0 },
];
`;
const REDUCER_START = `import type { Question } from "@/data/quiz";

export type QuizState = { index: number; score: number; picked: number | null; finished: boolean };

export type QuizAction = { type: "pick"; option: number } | { type: "next" } | { type: "restart" };

export const initialQuiz: QuizState = { index: 0, score: 0, picked: null, finished: false };

export function quizReducer(state: QuizState, action: QuizAction, questions: Question[]): QuizState {
  return state;
}
`;
const REDUCER_MODEL = `import type { Question } from "@/data/quiz";

export type QuizState = { index: number; score: number; picked: number | null; finished: boolean };

export type QuizAction = { type: "pick"; option: number } | { type: "next" } | { type: "restart" };

export const initialQuiz: QuizState = { index: 0, score: 0, picked: null, finished: false };

export function quizReducer(state: QuizState, action: QuizAction, questions: Question[]): QuizState {
  switch (action.type) {
    case "pick": {
      // One answer per question.
      if (state.picked !== null || state.finished) return state;
      const correct = questions[state.index].answer === action.option;
      return { ...state, picked: action.option, score: state.score + (correct ? 1 : 0) };
    }
    case "next": {
      if (state.picked === null) return state;
      const last = state.index === questions.length - 1;
      return last ? { ...state, finished: true } : { ...state, index: state.index + 1, picked: null };
    }
    case "restart":
      return initialQuiz;
  }
}
`;
const QUIZ_SCREEN = `import { useReducer } from "react";
import { Pressable, Text, View } from "react-native";
import { QUESTIONS } from "@/data/quiz";
import { initialQuiz, quizReducer, type QuizAction, type QuizState } from "@/state/quiz";

const reducer = (state: QuizState, action: QuizAction) => quizReducer(state, action, QUESTIONS);

export default function Quiz() {
  const [state, dispatch] = useReducer(reducer, initialQuiz);

  if (state.finished) {
    return (
      <View style={{ padding: 20, gap: 12 }}>
        <Text style={{ fontSize: 22 }}>You scored {state.score} of {QUESTIONS.length}</Text>
        <Pressable accessibilityRole="button" onPress={() => dispatch({ type: "restart" })} style={{ minHeight: 48, justifyContent: "center" }}>
          <Text>Play again</Text>
        </Pressable>
      </View>
    );
  }

  const question = QUESTIONS[state.index];
  return (
    <View style={{ padding: 20, gap: 12 }}>
      <Text>Question {state.index + 1} of {QUESTIONS.length}</Text>
      <Text style={{ fontSize: 20 }}>{question.text}</Text>
      {question.options.map((option, i) => (
        <Pressable key={option} accessibilityRole="button" onPress={() => dispatch({ type: "pick", option: i })} style={{ minHeight: 48, justifyContent: "center", backgroundColor: state.picked === i ? "#ccfbf1" : "transparent" }}>
          <Text>{option}</Text>
        </Pressable>
      ))}
      <Pressable accessibilityRole="button" disabled={state.picked === null} onPress={() => dispatch({ type: "next" })} style={{ minHeight: 48, justifyContent: "center" }}>
        <Text>Next</Text>
      </Pressable>
    </View>
  );
}
`;

export const PART1 = [
  /* ═══════════════ LESSON 63 · 11.1 – 11.2 ═══════════════ */
  {
    id: "md-l63-state-basics",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 1,
    covers: ["11.1", "11.2"],
    title: "What State Is, and Local State",
    subtitle: "The data that changes while the app runs, and where it lives",
    estimatedMinutes: 45,
    intro: "Every app question in this module comes down to two: what is state, and which component should own it?",
    atoms: [
      {
        id: "a-md-what-state",
        title: "What state is and why it matters",
        explain:
          "STATE is data that changes while the app runs and that the screen depends on: a quantity, the text in a field, whether a menu is open, the signed-in user, the products from the server. React draws the screen FROM state: change state with its setter, and React re-renders the components that use it. A plain variable (let qty = 1) does not work: changing it does not re-render, and it is reset on every render. Not everything is state, though: values that never change are constants, and values you can CALCULATE from other state (a total) are derived (Lesson 64). When the next value depends on the previous one, pass the setter a function, setQty((q) => q + 1), so quick repeated taps never use a stale value.",
        webLab: expoLab({
          name: "Kobo",
          layout: titled("Product"),
          task:
            "The quantity buttons do nothing. Make qty state (starting at 1), with + and − changing it by one using the function form of the setter, kept between 1 and 10, and each button disabled at its limit.",
          files: { "src/app/index.tsx": STEPPER_START, "src/utils/money.ts": MONEY },
          readOnly: ["src/utils/money.ts"],
          solution: { "src/app/index.tsx": STEPPER_MODEL },
          tests: [
            { label: "+ raises the quantity and the price follows", check: "await press({ role: 'button', name: 'More' }); await press({ role: 'button', name: 'More' }); return has('Qty 3') && hasText('₦25,500');", fail: "const [qty, setQty] = useState(1); onPress={() => setQty((q) => q + 1)}" },
            { label: "It never goes below 1", check: "await restart(); await waitFor(() => has('Qty 1'), 2000); await press({ role: 'button', name: 'Fewer' }); return has('Qty 1') && disabled({ role: 'button', name: 'Fewer' });", fail: "Math.max(1, q - 1), and disabled={qty <= 1}" },
            { label: "Or above 10", check: "await restart(); await waitFor(() => has('Qty 1'), 2000); for (let i = 0; i < 12; i++) await press({ role: 'button', name: 'More' }); return has('Qty 10') && disabled({ role: 'button', name: 'More' });", fail: "Math.min(10, q + 1), and disabled={qty >= 10}" },
            { label: "The setter uses the previous value", check: "return /setQty\\(\\s*\\(?\\s*\\w+\\s*\\)?\\s*=>/.test(code('src/app/index.tsx'));", fail: "setQty((q) => …), the function form." },
          ],
          hint: "useState, then replace qty = … with setQty((q) => …).",
          successMessage: "State that the screen follows, with limits the user can see.",
        }),
      },
      {
        id: "a-md-local-state",
        title: "Local component state",
        explain:
          "Keep state as LOCAL as possible: in the lowest component that needs it. Whether one FAQ answer is open matters only to that item, so each FaqItem should own its own open state; then every item opens independently, the parent stays simple, and typing or toggling re-renders only the part that changed. Each instance of a component has its own copy of its state. Lift state up only when another component needs it (next lesson). Local state is lost when its component unmounts (leaving the screen, for example); if it must survive, it belongs higher up or in storage (Module 12).",
        webLab: expoLab({
          name: "Kobo",
          layout: titled("Help"),
          task:
            "Tapping any question opens (or closes) every answer at once, because one open value is shared by all the items. Move the open state into FaqItem so each question opens on its own.",
          files: { "src/app/index.tsx": FAQ_START },
          solution: { "src/app/index.tsx": FAQ_MODEL },
          tests: [
            { label: "Tapping one question opens only its answer", check: "await press('Can I return an item?'); return has('Yes, within 14 days, unused and in its packaging.') && !has('Two to four working days in Lagos and Abuja.');", fail: "const [open, setOpen] = useState(false) inside FaqItem." },
            { label: "Answers stay open independently", check: "await restart(); await waitFor(() => has('How long does delivery take?'), 2000); await press('How long does delivery take?'); await press('Do you deliver outside Nigeria?'); return has('Two to four working days in Lagos and Abuja.') && has('Not yet. Ghana is next.') && !has('Yes, within 14 days, unused and in its packaging.');", fail: "Each item toggles its own state." },
            { label: "The screen holds no open state", check: "const c = code('src/app/index.tsx'); const screen = c.slice(c.indexOf('export default')); return !screen.includes('useState');", fail: "Help only maps the questions to items." },
          ],
          hint: "FaqItem no longer needs the open and onToggle props.",
          successMessage: "Each item owns what only it needs.",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════ LESSON 64 · 11.3 – 11.4 ═══════════════ */
  {
    id: "md-l64-sharing-derived",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 2,
    covers: ["11.3", "11.4"],
    title: "Sharing Data, and Derived State",
    subtitle: "Lifting state to a common parent, and calculating instead of storing",
    estimatedMinutes: 45,
    intro: "Two components that need the same data should read it from one place, and data you can calculate should never be stored twice.",
    atoms: [
      {
        id: "a-md-lifting-state",
        title: "Sharing data between components",
        explain:
          "When two sibling components need the same state (a filter bar sets the category, a list shows it), LIFT THE STATE UP to their closest common parent. The parent owns it and passes it down: the value to the component that shows it, and a callback (onSelect) to the one that changes it. The filter bar becomes a CONTROLLED component: it holds no state of its own, so it always shows what its parent says. Data flows down as props, events flow up as callbacks. When the common parent is far away (a different screen, the whole app), passing props through many levels gets painful; that is what Context is for (Lesson 65).",
        webLab: expoLab({
          name: "Kobo",
          layout: titled("Shop"),
          task:
            "Choosing a category highlights it but doesn't filter the list, because FilterBar keeps the category to itself. Lift it up: the Shop screen owns the category state and filters PRODUCTS, and FilterBar takes selected and onSelect props.",
          files: {
            "src/app/index.tsx": SHOP_START,
            "src/components/FilterBar.tsx": FILTER_BAR_START,
            "src/components/ProductList.tsx": PRODUCT_LIST,
            "src/data/products.ts": PRODUCTS,
          },
          readOnly: ["src/components/ProductList.tsx", "src/data/products.ts"],
          solution: { "src/app/index.tsx": SHOP_MODEL, "src/components/FilterBar.tsx": FILTER_BAR_MODEL },
          tests: [
            { label: "Choosing Phones shows only phones", check: "await press({ role: 'button', name: 'Phones' }); const names = findAll({ testID: 'product' }).map((e) => e.textContent); return names.join() === 'Redmi Note 14,Tecno Spark 30';", fail: "Filter PRODUCTS by the category in the screen." },
            { label: "The bar shows the selected category", check: "await press({ role: 'button', name: 'Home' }); return find({ role: 'button', name: 'Home' }).getAttribute('aria-selected') === 'true' && findAll({ testID: 'product' }).length === 1;", fail: "accessibilityState={{ selected: c === selected }} from the prop." },
            { label: "All shows everything again", check: "await press({ role: 'button', name: 'Fashion' }); await press({ role: 'button', name: 'All' }); return findAll({ testID: 'product' }).length === 4;", fail: "\"All\" means no filter." },
            { label: "FilterBar is controlled: it has no state", check: "const c = code('src/components/FilterBar.tsx'); return !c.includes('useState') && c.includes('onSelect');", fail: "FilterBar({ selected, onSelect })" },
          ],
          hint: "Move the useState line from FilterBar to Shop, then pass its two halves down.",
          successMessage: "One owner, two readers: the bar and the list can never disagree.",
        }),
      },
      {
        id: "a-md-derived-state",
        title: "Derived state and avoiding unnecessary duplication",
        explain:
          "If a value can be calculated from state you already have, calculate it during render instead of storing it: const count = lines.length; const total = lines.reduce(…). Storing it as separate state means keeping copies in sync by hand, and they drift: one setter is forgotten, or a useEffect updates it one render late (a flash of the wrong number). The rule: store the minimum (the source of truth), derive the rest. \"Syncing\" one state into another with useEffect is almost always a sign the second one should be derived. (If a calculation is genuinely expensive, useMemo caches it; the React Compiler, on in the Expo template, often does that for you.)",
        webLab: expoLab({
          name: "Kobo",
          layout: titled("Basket"),
          task:
            "The basket's count is wrong after \"Remove last\", because count and total are stored separately and kept in sync by hand. Keep only lines in state, and derive count and total during render (no useEffect).",
          files: { "src/app/index.tsx": BASKET_START, "src/utils/money.ts": MONEY },
          readOnly: ["src/utils/money.ts"],
          solution: { "src/app/index.tsx": BASKET_MODEL },
          tests: [
            { label: "Adding updates the count and total", check: "await press('Add Shea butter'); await press('Add Ankara tote bag'); return has('2 items · ₦11,500');", fail: "count = lines.length; total = lines.reduce(…)" },
            { label: "Removing does too", check: "await restart(); await waitFor(() => has('Add Shea butter'), 2000); await press('Add Shea butter'); await press('Add Ankara tote bag'); await press('Remove last'); return has('1 items · ₦3,000');", fail: "Derived values can't be forgotten." },
            { label: "Only the lines are stored", check: "const c = code('src/app/index.tsx'); return (c.match(/useState/g) || []).length === 2 && !c.includes('useEffect');", fail: "One useState (and its import), no useEffect." },
          ],
          hint: "Delete the count and total state, the effect and setCount, then write two const lines.",
          successMessage: "One source of truth; the numbers can no longer disagree with it.",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════ LESSON 65 · 11.5 – 11.6 ═══════════════ */
  {
    id: "md-l65-context-reducer",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 3,
    covers: ["11.5", "11.6"],
    title: "Context and useReducer",
    subtitle: "Sharing state with the whole app, and managing state with rules",
    estimatedMinutes: 55,
    intro: "Context removes the need to pass props through every level. A reducer puts every way state can change into one testable function.",
    atoms: [
      {
        id: "a-md-context",
        title: "Context API",
        explain:
          "CONTEXT lets any component below a PROVIDER read a value without props being passed down by hand. The pattern used in real apps: createContext with a null default; a Provider component that owns the state (useState or useReducer) and passes { value, setters }; and a hook (useSettings) that reads the context and throws a clear error when used outside the provider. Wrap the navigator in the root layout with the provider, so every screen can use it. Good uses: the signed-in user, the theme, language and currency, the cart. Every component that reads a context re-renders when its value changes, so keep each context focused (Lesson 68).",
        webLab: expoLab({
          name: "Kobo",
          layout: CTX_LAYOUT,
          task:
            "The currency chosen in Settings should change prices everywhere. Write src/context/settings.tsx: a context with the currency (\"NGN\" by default) and setCurrency, SettingsProvider owning that state, and useSettings() returning it (and throwing \"useSettings must be used inside <SettingsProvider>\" outside one). The root layout and both screens already use them.",
          files: {
            "src/context/settings.tsx": CTX_START,
            "src/app/index.tsx": CTX_SHOP,
            "src/app/settings.tsx": CTX_SETTINGS,
            "src/utils/price.ts": CTX_PRICE,
          },
          readOnly: ["src/app/index.tsx", "src/app/settings.tsx", "src/utils/price.ts"],
          solution: { "src/context/settings.tsx": CTX_MODEL },
          tests: [
            { label: "Prices start in naira", check: "await waitFor(() => hasText('Ankara tote bag'), 2000); return has('Ankara tote bag · ₦8,500');", fail: "useState<Currency>(\"NGN\") in the provider." },
            { label: "Choosing USD in Settings changes the shop's price", check: "await navigate('/settings'); await waitFor(() => has('○ USD'), 2000); await press('○ USD'); await back(); await waitFor(() => has('Ankara tote bag · $5.67'), 2000); return true;", fail: "Pass { currency, setCurrency } as the provider's value." },
            { label: "useSettings explains itself outside the provider", check: "const c = code('src/context/settings.tsx'); return c.includes('createContext') && c.includes('useContext') && /throw new Error\\(\\s*[\"'`]useSettings must be used inside <SettingsProvider>/.test(c);", fail: "if (!value) throw new Error(\"useSettings must be used inside <SettingsProvider>\");" },
          ],
          hint: "createContext<SettingsValue | null>(null), then useContext in the hook.",
          successMessage: "One setting, shared by every screen, with no props passed by hand.",
        }),
      },
      {
        id: "a-md-reducer",
        title: "useReducer for more complex state transitions",
        explain:
          "When several pieces of state change together under rules (a quiz's question, score, chosen answer and finished flag), useState setters scattered through handlers get hard to follow and easy to break. useReducer collects every change into one REDUCER: a pure function (state, action) => newState. Components DISPATCH actions that describe what happened ({ type: \"pick\", option: 1 }); the reducer decides what that means, returns a NEW object (never mutate state), and can refuse actions that are not allowed right now (picking twice). A TypeScript union of actions makes impossible actions a compile error, and because a reducer is a plain function you can test every rule without a screen (Module 18).",
        webLab: expoLab({
          name: "Kobo Quiz",
          layout: titled("Quiz"),
          task:
            "Write quizReducer in src/state/quiz.ts. \"pick\" records the option (only once per question) and adds 1 to the score if it is the right answer; \"next\" moves to the next question with nothing picked (only after picking), or sets finished after the last; \"restart\" returns to initialQuiz. Never change the state object you were given.",
          files: { "src/state/quiz.ts": REDUCER_START, "src/app/index.tsx": QUIZ_SCREEN, "src/data/quiz.ts": QUIZ_DATA },
          readOnly: ["src/app/index.tsx", "src/data/quiz.ts"],
          solution: { "src/state/quiz.ts": REDUCER_MODEL },
          tests: [
            { label: "pick scores a right answer once, and never mutates", check: "const { quizReducer, initialQuiz } = load('src/state/quiz.ts'); const Q = load('src/data/quiz.ts').QUESTIONS; const frozen = Object.freeze({ ...initialQuiz }); const a = quizReducer(frozen, { type: 'pick', option: 0 }, Q); const b = quizReducer(a, { type: 'pick', option: 1 }, Q); return a !== frozen && a.score === 1 && a.picked === 0 && b.score === 1 && b.picked === 0;", fail: "Return { ...state, picked, score } and ignore a second pick." },
            { label: "next needs a pick, then moves on or finishes", check: "const { quizReducer, initialQuiz } = load('src/state/quiz.ts'); const Q = load('src/data/quiz.ts').QUESTIONS; const blocked = quizReducer(initialQuiz, { type: 'next' }, Q); let s = initialQuiz; for (const o of [0, 1, 0]) { s = quizReducer(s, { type: 'pick', option: o }, Q); s = quizReducer(s, { type: 'next' }, Q); } return blocked.index === 0 && s.finished && s.score === 3 && quizReducer(s, { type: 'restart' }, Q).index === 0;", fail: "next: ignore when picked is null; finished after the last question." },
            { label: "The quiz plays on the phone", check: "await press('_layout.tsx'); await press('Next'); await press('useState'); await press('Next'); await press('npm update'); await press('Next'); await waitFor(() => has('You scored 1 of 3'), 2000); await press('Play again'); return has('Question 1 of 3');", fail: "The screen dispatches; the reducer decides." },
          ],
          hint: "A switch on action.type, returning a new object in every case.",
          successMessage: "Every rule of the quiz in one pure, testable function.",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },
];
