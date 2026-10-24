/**
 * MOBILE APP DEVELOPMENT · MODULE 4 · MODERN JAVASCRIPT AND ASYNCHRONOUS PROGRAMMING
 *
 * Curriculum 4.1 – 4.P. Arrow functions, callbacks and higher-order
 * functions, map/filter/find/reduce, promises and async/await, fetch, JSON,
 * HTTP, loading and error states, and an introduction to TypeScript.
 *
 * The labs talk to a real backend: each one includes server/index.js, a
 * practice API the app reaches with fetch, so requests, status codes, JSON
 * and failures are real. Screens are given (React arrives in Module 7) and
 * load data with a small provided hook, src/hooks/useLoad.js; the learner
 * writes the JavaScript behind them. TypeScript labs are type-checked by the
 * real compiler against the Expo SDK 58 types.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

import { expoLab } from "./md-helpers.js";

export const SECTION_ID = "md-s4-modern-js";
const MODULE = "md-m4-modern-js";
const JS = "javascript";

const layout = (title) => `import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "${title}" }} />
    </Stack>
  );
}
`;

/** The provided loader hook. Learners write hooks like it in Module 7. */
const USE_LOAD = `import { useCallback, useEffect, useState } from "react";

// Runs an async function and tracks its state: "loading", then "done" or "error".
// You will write hooks like this yourself in Module 7.
export function useLoad(load) {
  const [state, setState] = useState({ status: "loading", data: null, error: null });
  const run = useCallback(() => {
    setState({ status: "loading", data: null, error: null });
    load()
      .then((data) => setState({ status: "done", data, error: null }))
      .catch((error) => setState({ status: "error", data: null, error }));
  }, [load]);
  useEffect(() => {
    run();
  }, [run]);
  return { ...state, reload: run };
}
`;

const MARKET_SERVER = `import { createServer } from "practice-server";

const app = createServer(); // https://api.example.com

const products = [
  { id: 1, name: "Rice (5kg)", category: "grains", price: 9500, inStock: true },
  { id: 2, name: "Beans (1kg)", category: "grains", price: 1800, inStock: true },
  { id: 3, name: "Palm oil (1L)", category: "oils", price: 3200, inStock: false },
  { id: 4, name: "Groundnut oil (1L)", category: "oils", price: 4100, inStock: true },
  { id: 5, name: "Tomatoes (basket)", category: "vegetables", price: 6000, inStock: true },
  { id: 6, name: "Onions (bag)", category: "vegetables", price: 5200, inStock: false },
];

app.get("/products", (req, res) => {
  res.json(products);
});

app.get("/products/:id", (req, res) => {
  const product = products.find((p) => p.id === Number(req.params.id));
  if (!product) return res.status(404).json({ error: "Product not found" });
  res.json(product);
});

app.get("/broken", (req, res) => {
  res.status(500).json({ error: "The database is not responding" });
});

export default app;
`;

/** A given screen that lists what an async function returns. */
const listScreen = (title, importLine, loadExpr, line) => `import { useCallback } from "react";
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { useLoad } from "@/hooks/useLoad";
${importLine}

export default function Screen() {
  const load = useCallback(() => ${loadExpr}, []);
  const { status, data, error, reload } = useLoad(load);

  if (status === "loading") return <ActivityIndicator style={styles.center} accessibilityLabel="Loading" />;
  if (status === "error") {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{error.message}</Text>
        <Pressable accessibilityRole="button" onPress={reload} style={styles.button}>
          <Text style={styles.buttonText}>Try again</Text>
        </Pressable>
      </View>
    );
  }
  return (
    <FlatList
      data={data}
      keyExtractor={(item, index) => String(item.id ?? index)}
      ListHeaderComponent={<Text style={styles.title}>${title}</Text>}
      renderItem={({ item }) => <Text style={styles.row}>{${line}}</Text>}
      contentContainerStyle={styles.page}
    />
  );
}

const styles = StyleSheet.create({
  page: { padding: 16, gap: 8 },
  title: { fontSize: 22, fontWeight: "700", marginBottom: 4 },
  row: { padding: 12, borderRadius: 10, backgroundColor: "#f1f5f4", fontSize: 15 },
  center: { flex: 1, alignItems: "center", justifyContent: "center", gap: 12, padding: 24 },
  error: { fontSize: 16, color: "#b91c1c", textAlign: "center" },
  button: { minHeight: 44, paddingHorizontal: 20, justifyContent: "center", borderRadius: 10, backgroundColor: "#0f766e" },
  buttonText: { color: "#fff", fontWeight: "600" },
});
`;

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 13 · 4.1 – 4.3
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "md-l13-functions",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 1,
    covers: ["4.1", "4.2", "4.3"],
    title: "Arrow, Callback and Higher-Order Functions",
    subtitle: "Functions as values: the style every React Native file is written in",
    estimatedMinutes: 40,
    intro: "In JavaScript a function is a value like any other: you can store it, pass it to another function, and return it. Modern app code is built on that idea.",

    atoms: [
      {
        id: "a-md-arrow",
        title: "Arrow functions",
        explain:
          "An ARROW FUNCTION is a shorter way to write a function: const double = (n) => n * 2; is the same as function double(n) { return n * 2; }. With a single expression after the arrow, its value is returned automatically; with braces you write return yourself: (a, b) => { const sum = a + b; return sum; }. One parameter needs no brackets (n => n * 2), but Prettier, the formatter Expo projects use, adds them. To return an object directly, wrap it in brackets: (name) => ({ name }). Arrow functions are what you pass to buttons (onPress={() => save()}) and array methods.",
        codeExercise: {
          language: JS,
          code: 'const square = (n) => n * n;\nconst greet = (name = "friend") => `Hi, ${name}`;\nconst toUser = (name) => ({ name, active: true });\nconst total = (a, b) => {\n  const sum = a + b;\n  return sum;\n};\nconsole.log(square(7), greet(), greet("Ngozi"));\nconsole.log(toUser("Ola").active, total(2, 3));\n',
          question: "What does this print?",
          expectedOutput: "49 Hi, friend Hi, Ngozi\ntrue 5",
          hint: "A single expression is returned. ({ … }) returns an object.",
          successMessage: "Short functions for short jobs: you will write hundreds.",
        },
      },
      {
        id: "a-md-callbacks",
        title: "Callback functions",
        explain:
          "A CALLBACK is a function you hand to other code to be called LATER: when a timer finishes, when a button is pressed, when data arrives. setTimeout(() => console.log(\"Done\"), 1000) passes an arrow function to setTimeout, which calls it after a second. The code after setTimeout does not wait: JavaScript carries on, and the callback runs when its moment comes. That is why the order of output in asynchronous code surprises beginners, and why the rest of this module matters: apps are full of things that finish later.",
        codeExercise: {
          language: JS,
          code: 'console.log("1. Tap the button");\nsetTimeout(() => console.log("3. Data arrived"), 50);\nsetTimeout(() => console.log("2. Spinner shown"), 0);\nconsole.log("1b. Still here");\nfunction onEach(items, callback) {\n  for (const item of items) callback(item);\n}\nonEach(["a", "b"], (x) => console.log("item", x));\n',
          question: "What does this print?",
          expectedOutput: "1. Tap the button\n1b. Still here\nitem a\nitem b\n2. Spinner shown\n3. Data arrived",
          hint: "Timers always run after the current code has finished, even with 0 milliseconds; the shorter timer goes first.",
          successMessage: "Code after a timer does not wait for it. Keep that picture in mind for promises.",
        },
      },
      {
        id: "a-md-higher-order",
        title: "Higher-order functions",
        explain:
          "A HIGHER-ORDER function takes a function as an argument or returns one. Array methods are the famous ones (next lesson), but you can write your own: a function that takes the RULE as a parameter is reusable for every rule. A function that returns a function can PRE-CONFIGURE behaviour: const over = (limit) => (item) => item.price > limit; then over(5000) is a ready-made test. In the lab, sorting and filtering a product list both use functions as values.",
        webLab: expoLab({
          name: "Products",
          layout: layout("Products"),
          task:
            "Complete src/lib/rules.js. cheaperThan(limit) returns a FUNCTION that, given a product, says whether its price is below limit. sortBy(key) returns a comparison function for sort() that orders products by that key, smallest first, for numbers (price) and for text (name, using localeCompare). The screen uses them to list cheap products by name and all products by price.",
          files: {
            "src/lib/rules.js": `// cheaperThan(5000) should give a function: (product) => true or false
export function cheaperThan(limit) {
  return true;
}

// sortBy("price") should give a function for products.sort(...)
export function sortBy(key) {
  return () => 0;
}
`,
            "src/app/index.js": `import { ScrollView, StyleSheet, Text } from "react-native";
import { cheaperThan, sortBy } from "@/lib/rules";

const products = [
  { name: "Rice", price: 9500 },
  { name: "Beans", price: 1800 },
  { name: "Garri", price: 2600 },
  { name: "Oil", price: 4100 },
];

const cheap = products.filter(cheaperThan(5000)).sort(sortBy("name"));
const byPrice = [...products].sort(sortBy("price"));

export default function Screen() {
  return (
    <ScrollView contentContainerStyle={styles.page}>
      <Text style={styles.title}>Under ₦5,000, by name</Text>
      <Text>{cheap.map((p) => p.name).join(", ")}</Text>
      <Text style={styles.title}>All, by price</Text>
      <Text>{byPrice.map((p) => p.name).join(", ")}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { padding: 20, gap: 8 },
  title: { fontSize: 18, fontWeight: "700", marginTop: 8 },
});
`,
          },
          readOnly: ["src/app/index.js"],
          solution: {
            "src/lib/rules.js": `// cheaperThan(5000) should give a function: (product) => true or false
export function cheaperThan(limit) {
  return (product) => product.price < limit;
}

// sortBy("price") should give a function for products.sort(...)
export function sortBy(key) {
  return (a, b) => (typeof a[key] === "number" ? a[key] - b[key] : String(a[key]).localeCompare(String(b[key])));
}
`,
          },
          tests: [
            { label: "cheaperThan returns a working test function", check: "const { cheaperThan } = load('src/lib/rules.js'); const f = cheaperThan(5000); return typeof f === 'function' && f({ price: 4999 }) === true && f({ price: 5000 }) === false;", fail: "return (product) => product.price < limit;" },
            { label: "sortBy sorts numbers smallest first", check: "const { sortBy } = load('src/lib/rules.js'); const r = [{ price: 3 }, { price: 1 }, { price: 2 }].sort(sortBy('price')); return r.map((x) => x.price).join() === '1,2,3' && has('Beans, Garri, Oil, Rice');", fail: "For numbers: (a, b) => a[key] - b[key]" },
            { label: "sortBy sorts text alphabetically", check: "const { sortBy } = load('src/lib/rules.js'); const r = [{ name: 'Oil' }, { name: 'Beans' }, { name: 'Garri' }].sort(sortBy('name')); return r.map((x) => x.name).join() === 'Beans,Garri,Oil' && has('Beans, Garri, Oil');", fail: "For text: a[key].localeCompare(b[key])" },
          ],
          hint: "Both functions RETURN a function. Write the inner function first, then wrap it.",
          successMessage: "Functions that make functions: the same idea powers filters, sorts and event handlers.",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 14 · 4.4
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "md-l14-array-methods",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 2,
    covers: ["4.4"],
    title: "map, filter, find and reduce",
    subtitle: "Turning lists into the lists, items and totals a screen needs",
    estimatedMinutes: 40,
    intro: "Screens rarely show raw data. They show a filtered list, a formatted list, one chosen item, or a total. Four array methods do all of that without a single loop.",

    atoms: [
      {
        id: "a-md-map-filter-find",
        title: "map, filter and find",
        explain:
          "items.map(fn) returns a NEW array of the same length, with fn applied to each item: prices.map((p) => p * 2). items.filter(fn) returns a NEW array of the items for which fn returns true: products.filter((p) => p.inStock). items.find(fn) returns the FIRST item for which fn is true, or undefined if none is. None of them change the original array. They chain: products.filter((p) => p.inStock).map((p) => p.name) is \"the names of the products in stock\". In React Native, map turns an array of data into an array of components, which is how every list is drawn.",
        codeExercise: {
          language: JS,
          code: 'const products = [\n  { id: 1, name: "Rice", price: 9500, inStock: true },\n  { id: 2, name: "Beans", price: 1800, inStock: false },\n  { id: 3, name: "Oil", price: 4100, inStock: true },\n];\nconsole.log(products.filter((p) => p.inStock).map((p) => p.name).join(", "));\nconsole.log(products.map((p) => p.price / 100));\nconsole.log(products.find((p) => p.price < 2000)?.name, products.find((p) => p.id === 9));\nconsole.log(products.length);\n',
          question: "What does this print?",
          expectedOutput: "Rice, Oil\n[ 95, 18, 41 ]\nBeans undefined\n3",
          hint: "filter keeps in-stock products; map transforms each; find returns the first match or undefined. Nothing changes the original.",
          successMessage: "filter, then map: the names of what is in stock, in one readable line.",
        },
      },
      {
        id: "a-md-reduce",
        title: "reduce",
        explain:
          "items.reduce((acc, item) => …, start) boils a list down to ONE value. acc (the accumulator) starts as start; for each item, the function returns the new acc. A total: cart.reduce((sum, line) => sum + line.price * line.qty, 0). A count per category: reduce into an object, starting from {}. Always give the starting value: without it, reduce uses the first item, and an empty array throws. In the lab you produce a wallet's summary from its transactions.",
        webLab: expoLab({
          name: "Wallet",
          layout: layout("Wallet"),
          task:
            "Complete src/lib/wallet.js using map, filter, find and reduce (no for loops). balance(txs): money in minus money out (amount is always positive; type is \"in\" or \"out\"). spentOn(txs, category): the total of \"out\" transactions in that category. biggestExpense(txs): the description of the largest \"out\" transaction, or \"None\" if there are none. byCategory(txs): an object with the total spent (\"out\") per category, such as { food: 5500, transport: 1200 }.",
          files: {
            "src/lib/wallet.js": `export function balance(txs) {
  return 0;
}

export function spentOn(txs, category) {
  return 0;
}

export function biggestExpense(txs) {
  return "None";
}

export function byCategory(txs) {
  return {};
}
`,
            "src/app/index.js": `import { ScrollView, StyleSheet, Text } from "react-native";
import { balance, biggestExpense, byCategory, spentOn } from "@/lib/wallet";

const txs = [
  { id: 1, type: "in", amount: 50000, category: "salary", description: "October salary" },
  { id: 2, type: "out", amount: 3500, category: "food", description: "Market" },
  { id: 3, type: "out", amount: 1200, category: "transport", description: "Bus to work" },
  { id: 4, type: "out", amount: 2000, category: "food", description: "Lunch with Tolu" },
  { id: 5, type: "out", amount: 15000, category: "rent", description: "Rent share" },
];

export default function Screen() {
  const totals = byCategory(txs);
  return (
    <ScrollView contentContainerStyle={styles.page}>
      <Text style={styles.big}>Balance: {balance(txs)}</Text>
      <Text>Food: {spentOn(txs, "food")}</Text>
      <Text>Biggest expense: {biggestExpense(txs)}</Text>
      {Object.entries(totals).map(([category, total]) => (
        <Text key={category}>
          {category}: {total}
        </Text>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { padding: 20, gap: 8 },
  big: { fontSize: 22, fontWeight: "700" },
});
`,
          },
          readOnly: ["src/app/index.js"],
          solution: {
            "src/lib/wallet.js": `export function balance(txs) {
  return txs.reduce((sum, tx) => (tx.type === "in" ? sum + tx.amount : sum - tx.amount), 0);
}

export function spentOn(txs, category) {
  return txs
    .filter((tx) => tx.type === "out" && tx.category === category)
    .reduce((sum, tx) => sum + tx.amount, 0);
}

export function biggestExpense(txs) {
  const outs = txs.filter((tx) => tx.type === "out");
  if (outs.length === 0) return "None";
  const biggest = outs.reduce((max, tx) => (tx.amount > max.amount ? tx : max));
  return biggest.description;
}

export function byCategory(txs) {
  return txs
    .filter((tx) => tx.type === "out")
    .reduce((totals, tx) => ({ ...totals, [tx.category]: (totals[tx.category] ?? 0) + tx.amount }), {});
}
`,
          },
          tests: [
            { label: "balance is money in minus money out", check: "const w = load('src/lib/wallet.js'); return w.balance([{ type: 'in', amount: 100 }, { type: 'out', amount: 30 }]) === 70 && w.balance([]) === 0 && has('Balance: 28300');", fail: "reduce from 0, adding \"in\" and subtracting \"out\"." },
            { label: "spentOn totals one category's expenses", check: "const w = load('src/lib/wallet.js'); return w.spentOn([{ type: 'out', amount: 5, category: 'food' }, { type: 'in', amount: 9, category: 'food' }, { type: 'out', amount: 2, category: 'fun' }], 'food') === 5 && has('Food: 5500');", fail: "filter by type and category, then reduce." },
            { label: "biggestExpense names the largest expense, or None", check: "const w = load('src/lib/wallet.js'); return w.biggestExpense([]) === 'None' && w.biggestExpense([{ type: 'in', amount: 99, description: 'x' }]) === 'None' && has('Biggest expense: Rent share');", fail: "Keep the \"out\" ones; reduce to the one with the largest amount." },
            { label: "byCategory totals every category's expenses", check: "const w = load('src/lib/wallet.js'); const t = w.byCategory([{ type: 'out', amount: 5, category: 'a' }, { type: 'out', amount: 2, category: 'a' }, { type: 'out', amount: 1, category: 'b' }, { type: 'in', amount: 50, category: 'c' }]); return JSON.stringify(t) === '{\"a\":7,\"b\":1}' && has('rent: 15000');", fail: "reduce into an object, starting from {}." },
            { label: "No for loops", check: "return !/\\bfor\\s*\\(|\\bwhile\\s*\\(/.test(code('src/lib/wallet.js'));", fail: "Use the array methods instead of loops." },
          ],
          hint: "reduce's second argument is where it starts: 0 for a total, {} for an object of totals.",
          successMessage: "A wallet summary in four short functions. Data in, screen-ready values out.",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 15 · 4.5 – 4.6
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "md-l15-async",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 3,
    covers: ["4.5", "4.6"],
    title: "Promises, async and await",
    subtitle: "Working with things that finish later",
    estimatedMinutes: 45,
    intro: "Reading from the network, the disk, the camera or the GPS all take time. JavaScript represents \"a value that will arrive later\" with a promise, and async/await makes code that uses them read like ordinary steps.",

    atoms: [
      {
        id: "a-md-promises",
        title: "Promises and asynchronous operations",
        explain:
          "A PROMISE is an object standing for a result that is not ready yet. It is PENDING, then either FULFILLED with a value or REJECTED with an error, once. You react with .then(value => …) and .catch(error => …), and .finally(() => …) runs either way. .then returns a new promise, so steps chain, and a rejection anywhere skips to the next .catch. Promise.all([a, b]) waits for several promises at once (and fails if any fails). Nothing in .then runs until the current code has finished, even for a promise that is already fulfilled.",
        codeExercise: {
          language: JS,
          code: 'const wait = (ms, value) => new Promise((resolve) => setTimeout(() => resolve(value), ms));\nconsole.log("start");\nwait(20, "profile")\n  .then((v) => {\n    console.log("got", v);\n    return wait(10, "orders");\n  })\n  .then((v) => console.log("got", v));\nPromise.reject(new Error("offline"))\n  .then(() => console.log("never"))\n  .catch((e) => console.log("failed:", e.message))\n  .finally(() => console.log("done trying"));\nPromise.all([wait(5, 1), wait(1, 2)]).then((r) => console.log("all", r.join("+")));\nconsole.log("end");\n',
          question: "What does this print?",
          expectedOutput: "start\nend\nfailed: offline\ndone trying\nall 1+2\ngot profile\ngot orders",
          hint: "Synchronous lines first. The rejected promise is handled immediately after. Promise.all keeps the input order and finishes after 5 ms; the profile after 20.",
          successMessage: "The order of async code, predicted correctly: the hardest part of this module.",
        },
      },
      {
        id: "a-md-async-await",
        title: "async and await",
        explain:
          "An async function always returns a promise, and inside it await PAUSES that function until a promise settles, then gives you its value: const user = await getUser(); reads like a normal assignment. Other code keeps running while it waits; only this function is paused. Handle failures with try/catch around the awaits, and use finally for clean-up. Two awaits in a row run one after the other; to run them at the same time use await Promise.all([a(), b()]). Forgetting await is a classic bug: you get a promise object instead of the value.",
        codeExercise: {
          language: JS,
          code: 'const wait = (ms) => new Promise((r) => setTimeout(r, ms));\nasync function getBalance(fail) {\n  await wait(10);\n  if (fail) throw new Error("Server error");\n  return 12500;\n}\nasync function show(fail) {\n  try {\n    const balance = await getBalance(fail);\n    console.log("Balance:", balance);\n  } catch (err) {\n    console.log("Could not load:", err.message);\n  } finally {\n    console.log("spinner off");\n  }\n}\nasync function main() {\n  await show(false);\n  await show(true);\n  const forgot = getBalance(false);\n  console.log(forgot instanceof Promise);\n}\nmain();\n',
          question: "What does this print?",
          expectedOutput: "Balance: 12500\nspinner off\nCould not load: Server error\nspinner off\ntrue",
          hint: "Each await finishes before the next line. Without await, you get the promise itself.",
          successMessage: "try, await, catch, finally: the shape of almost every screen that loads data.",
        },
      },
      {
        id: "a-md-async-lab",
        title: "Async functions in an app",
        explain:
          "In an app, async functions sit between the screen and the slow thing (here, a server). The screen asks for data and shows a spinner; your async function does the work and either returns the data or throws an error with a useful message; the screen shows one or the other. In the lab the screen is given: it calls loadMenu() from src/lib/menu.js and shows a spinner while it waits. loadMenu must wait for two things, and should not wait longer than it has to.",
        webLab: expoLab({
          name: "Restaurant",
          layout: layout("Menu"),
          task:
            "loadMenu() in src/lib/menu.js must return the menu: the dishes from getDishes() with each dish's price replaced by the price for the day from getPrices() (an object such as { jollof: 2500 }). Both functions are slow (about half a second each), so start them TOGETHER with Promise.all, await the results, and return dishes mapped to { ...dish, price: prices[dish.id] }. If either fails, the error must reach the screen (do not catch it here).",
          files: {
            "src/lib/menu.js": `import { getDishes, getPrices } from "@/lib/kitchen";

export async function loadMenu() {
  const dishes = getDishes();
  return dishes;
}
`,
            "src/lib/kitchen.js": `// Pretend these talk to a slow server.
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getDishes() {
  await wait(500);
  return [
    { id: "jollof", name: "Jollof rice", price: 0 },
    { id: "egusi", name: "Egusi soup", price: 0 },
    { id: "suya", name: "Suya", price: 0 },
  ];
}

export async function getPrices() {
  await wait(500);
  return { jollof: 2500, egusi: 3000, suya: 1500 };
}
`,
            "src/hooks/useLoad.js": USE_LOAD,
            "src/app/index.js": listScreen("Today's menu", 'import { loadMenu } from "@/lib/menu";', "loadMenu()", "`${item.name}: ₦${item.price}`"),
          },
          readOnly: ["src/lib/kitchen.js", "src/hooks/useLoad.js", "src/app/index.js"],
          solution: {
            "src/lib/menu.js": `import { getDishes, getPrices } from "@/lib/kitchen";

export async function loadMenu() {
  const [dishes, prices] = await Promise.all([getDishes(), getPrices()]);
  return dishes.map((dish) => ({ ...dish, price: prices[dish.id] }));
}
`,
          },
          tests: [
            { label: "The menu shows each dish with today's price", check: "await waitFor(() => has('Jollof rice: ₦2500'), 3000); return has('Egusi soup: ₦3000') && has('Suya: ₦1500');", fail: "await both, then map each dish to { ...dish, price: prices[dish.id] }." },
            { label: "Both requests start together (it takes about half a second, not a whole second)", check: "const { loadMenu } = load('src/lib/menu.js'); const t = Date.now(); const menu = await loadMenu(); const ms = Date.now() - t; return Array.isArray(menu) && menu.length === 3 && ms < 850;", fail: "Promise.all([getDishes(), getPrices()]) starts both at once." },
            { label: "loadMenu returns new dish objects and lets errors through", check: "return /Promise\\.all/.test(code('src/lib/menu.js')) && !/catch/.test(code('src/lib/menu.js'));", fail: "Use Promise.all, and do not catch here: the screen shows the error." },
          ],
          hint: "const [dishes, prices] = await Promise.all([...]) destructures the two results.",
          successMessage: "Two slow requests in the time of one. Users notice that kind of speed.",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 16 · 4.7 – 4.10
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "md-l16-fetch",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 4,
    covers: ["4.7", "4.8", "4.9", "4.10"],
    title: "Fetching Data from APIs",
    subtitle: "fetch, JSON, HTTP requests and responses, and the states in between",
    estimatedMinutes: 50,
    intro: "Now the slow thing is a real server. Every lab in this lesson includes one (server/index.js), and your app talks to it over HTTP exactly as it would talk to a real API.",

    atoms: [
      {
        id: "a-md-fetch",
        title: "Fetching data from APIs",
        explain:
          "fetch(url) sends an HTTP request and returns a promise of a RESPONSE. The response arrives as soon as the server starts answering; reading its body is a second async step: const response = await fetch(`${API_URL}/products`); const products = await response.json();. Keep the server's address in one place (a config file, and in real projects an environment variable, Module 2), and put your requests in an API module (src/lib/api.js) rather than inside screens, so every screen asks for data the same way. In the lab, the given screen lists what your getProducts() returns.",
        webLab: expoLab({
          name: "Market",
          layout: layout("Market"),
          task:
            "Write getProducts() in src/lib/api.js: fetch `${API_URL}/products`, read the response's JSON, and return only the products that are in stock (inStock is true). The screen lists them with their price.",
          files: {
            "src/lib/api.js": `export const API_URL = "https://api.example.com";

export async function getProducts() {
  return [];
}
`,
            "src/hooks/useLoad.js": USE_LOAD,
            "src/app/index.js": listScreen("In stock", 'import { getProducts } from "@/lib/api";', "getProducts()", "`${item.name}: ₦${item.price}`"),
            "server/index.js": MARKET_SERVER,
          },
          readOnly: ["src/hooks/useLoad.js", "src/app/index.js", "server/index.js"],
          solution: {
            "src/lib/api.js": `export const API_URL = "https://api.example.com";

export async function getProducts() {
  const response = await fetch(\`\${API_URL}/products\`);
  const products = await response.json();
  return products.filter((product) => product.inStock);
}
`,
          },
          tests: [
            { label: "The screen lists the in-stock products from the server", check: "await waitFor(() => has('Rice (5kg): ₦9500'), 3000); return has('Groundnut oil (1L): ₦4100') && has('Tomatoes (basket): ₦6000');", fail: "fetch, then response.json(), then return the array." },
            { label: "Products that are out of stock are not shown", check: "await waitFor(() => has('Rice (5kg): ₦9500'), 3000); return !hasText('Palm oil') && !hasText('Onions');", fail: "filter((product) => product.inStock)" },
            { label: "It requested GET /products from the API", check: "await waitFor(() => serverRequests().length > 0, 3000); return serverRequests().some((r) => r.method === 'GET' && r.path === '/products');", fail: "Use the API_URL constant: `${API_URL}/products`." },
          ],
          hint: "Two awaits: one for the response, one for response.json().",
          successMessage: "A real request to a real server, filtered for the screen.",
        }),
      },
      {
        id: "a-md-json",
        title: "JSON data and parsing",
        explain:
          "JSON (JavaScript Object Notation) is the text format APIs use. It looks like JavaScript objects but is stricter: keys and strings in DOUBLE quotes, no trailing commas, no functions, no undefined (null instead), and no dates (send them as ISO strings such as \"2026-10-21T09:30:00Z\" and convert with new Date()). JSON.stringify(value) turns a value into JSON text (to send, or to save on the phone); JSON.parse(text) turns JSON text back into a value, and throws a SyntaxError on invalid text. response.json() does the parse for you.",
        codeExercise: {
          language: JS,
          code: 'const order = { id: 7, items: ["rice", "oil"], paid: false, note: undefined, at: new Date("2026-10-21T09:30:00Z") };\nconst text = JSON.stringify(order);\nconsole.log(text);\nconst back = JSON.parse(text);\nconsole.log(typeof back.at, back.items.length, "note" in back);\ntry {\n  JSON.parse("{\'id\': 7}");\n} catch (err) {\n  console.log(err.name);\n}\n',
          question: "What does this print?",
          expectedOutput: "{\"id\":7,\"items\":[\"rice\",\"oil\"],\"paid\":false,\"at\":\"2026-10-21T09:30:00.000Z\"}\nstring 2 false\nSyntaxError",
          hint: "undefined properties are dropped; dates become strings; JSON needs double quotes.",
          successMessage: "A date comes back as a string, and undefined disappears: two surprises you will now expect.",
        },
      },
      {
        id: "a-md-http",
        title: "Understanding HTTP requests and responses",
        explain:
          "A REQUEST has a METHOD (GET to read, POST to create, PUT/PATCH to change, DELETE to remove), a URL, HEADERS (extra information such as Content-Type: application/json or an Authorization token) and sometimes a BODY (the JSON you send). A RESPONSE has a STATUS CODE, headers and a body. 2xx means success (200 OK, 201 Created, 204 No Content); 4xx means the request was wrong (400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 429 Too Many Requests); 5xx means the server failed (500, 503). The trap: fetch only REJECTS when the network fails. A 404 or 500 is still a response, so you must check response.ok (true for 200–299) yourself and throw.",
        webLab: expoLab({
          name: "Product Detail",
          layout: layout("Product"),
          task:
            "getProduct(id) in src/lib/api.js fetches `${API_URL}/products/${id}` and returns its JSON. For a product that does not exist the server answers 404 with { error: \"Product not found\" }, and today the screen shows a blank product. Check response.ok: when it is false, throw an Error whose message is the server's error text followed by the status, such as \"Product not found (404)\". The screen shows products 2 and 99.",
          files: {
            "src/lib/api.js": `export const API_URL = "https://api.example.com";

export async function getProduct(id) {
  const response = await fetch(\`\${API_URL}/products/\${id}\`);
  return response.json();
}
`,
            "src/hooks/useLoad.js": USE_LOAD,
            "src/app/index.js": listScreen("Products 2 and 99", 'import { getProduct } from "@/lib/api";', "Promise.all([getProduct(2), getProduct(99).catch((err) => ({ id: 99, name: err.message, price: '-' }))])", "`${item.name}: ${item.price}`"),
            "server/index.js": MARKET_SERVER,
          },
          readOnly: ["src/hooks/useLoad.js", "src/app/index.js", "server/index.js"],
          solution: {
            "src/lib/api.js": `export const API_URL = "https://api.example.com";

export async function getProduct(id) {
  const response = await fetch(\`\${API_URL}/products/\${id}\`);
  const body = await response.json();
  if (!response.ok) {
    throw new Error(\`\${body.error} (\${response.status})\`);
  }
  return body;
}
`,
          },
          tests: [
            { label: "An existing product still loads", check: "await waitFor(() => has('Beans (1kg): 1800'), 3000); return true;", fail: "Return the parsed body when response.ok is true." },
            { label: "A missing product throws \"Product not found (404)\"", check: "await waitFor(() => hasText('Product not found'), 3000); return has('Product not found (404): -');", fail: "if (!response.ok) throw new Error(`${body.error} (${response.status})`)" },
            { label: "getProduct really rejects for a 404", check: "const { getProduct } = load('src/lib/api.js'); try { await getProduct(1234); return false; } catch (e) { return e.message === 'Product not found (404)'; }", fail: "fetch does not reject on 404: throw yourself." },
          ],
          hint: "Read the body first (it holds the server's message), then decide: return it, or throw.",
          successMessage: "fetch resolved, the request failed, and your code noticed. Most apps forget this check.",
        }),
      },
      {
        id: "a-md-request-states",
        title: "Handling loading states and errors",
        explain:
          "Every request has at least three states the user must see: LOADING (a spinner or skeleton, immediately), SUCCESS (the data, or an EMPTY state if there is none) and ERROR (a message saying what happened in human words, and a way to try again). Phones are often offline, so the most common error is the network one: React Native's fetch rejects with \"TypeError: Network request failed\". Turn technical errors into messages people understand (\"You're offline. Check your connection and try again.\"), keep the technical detail for your logs, and never leave a spinner spinning forever. In the lab you write the function that chooses the message.",
        webLab: expoLab({
          name: "Market",
          layout: layout("Market"),
          task:
            "The screen shows whatever error message getProducts() throws. Write friendlyError(err) in src/lib/errors.js and use it in getProducts: a network failure (a TypeError, which is what fetch throws when the phone is offline) becomes \"You're offline. Check your connection and try again.\"; an HTTP error status of 500 or more becomes \"Our server is having trouble. Please try again in a moment.\"; anything else keeps its own message. getProducts already throws an Error with a status property for bad responses; catch errors in getProducts and throw new Error(friendlyError(err)) instead.",
          files: {
            "src/lib/errors.js": `export function friendlyError(err) {
  return err.message;
}
`,
            "src/lib/api.js": `import { friendlyError } from "@/lib/errors";

export const API_URL = "https://api.example.com";

export async function getProducts(path = "/products") {
  const response = await fetch(API_URL + path);
  if (!response.ok) {
    const error = new Error(\`Request failed with status \${response.status}\`);
    error.status = response.status;
    throw error;
  }
  return response.json();
}
`,
            "src/hooks/useLoad.js": USE_LOAD,
            "src/app/index.js": listScreen("All products", 'import { getProducts } from "@/lib/api";', "getProducts()", "item.name"),
            "server/index.js": MARKET_SERVER,
          },
          readOnly: ["src/hooks/useLoad.js", "src/app/index.js", "server/index.js"],
          solution: {
            "src/lib/errors.js": `export function friendlyError(err) {
  if (err instanceof TypeError) {
    return "You're offline. Check your connection and try again.";
  }
  if (err.status >= 500) {
    return "Our server is having trouble. Please try again in a moment.";
  }
  return err.message;
}
`,
            "src/lib/api.js": `import { friendlyError } from "@/lib/errors";

export const API_URL = "https://api.example.com";

export async function getProducts(path = "/products") {
  try {
    const response = await fetch(API_URL + path);
    if (!response.ok) {
      const error = new Error(\`Request failed with status \${response.status}\`);
      error.status = response.status;
      throw error;
    }
    return await response.json();
  } catch (err) {
    throw new Error(friendlyError(err));
  }
}
`,
          },
          tests: [
            { label: "Online, the products load", check: "await waitFor(() => has('Rice (5kg)'), 3000); return has('Onions (bag)');", fail: "Keep returning the JSON on success." },
            { label: "Offline, the screen says so in plain words, with Try again", device: { online: false }, check: "await waitFor(() => hasText('offline'), 3000); return has(\"You're offline. Check your connection and try again.\") && has('Try again');", fail: "A TypeError means the network failed: return the offline message." },
            { label: "Coming back online and pressing Try again loads the list", device: { online: false }, check: "await waitFor(() => has('Try again'), 3000); await setOnline(true); await press('Try again'); await waitFor(() => has('Rice (5kg)'), 3000); return has('Rice (5kg)');", fail: "The error must not stop a later attempt from working." },
            { label: "A 500 gives the server message; other errors keep theirs", check: "const { friendlyError } = load('src/lib/errors.js'); const e500 = Object.assign(new Error('x'), { status: 503 }); const e404 = Object.assign(new Error('Request failed with status 404'), { status: 404 }); const { getProducts } = load('src/lib/api.js'); let m = ''; try { await getProducts('/broken'); } catch (e) { m = e.message; } return friendlyError(e500) === 'Our server is having trouble. Please try again in a moment.' && friendlyError(e404) === 'Request failed with status 404' && m === 'Our server is having trouble. Please try again in a moment.';", fail: "Check err.status >= 500, and use friendlyError inside getProducts' catch." },
          ],
          hint: "Use the airplane button above the phone to try it yourself: offline, fetch throws a TypeError.",
          successMessage: "Loading, success, offline, server trouble: every state has words a person understands.",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 17 · 4.11
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "md-l17-typescript",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 5,
    covers: ["4.11"],
    title: "Introduction to TypeScript",
    subtitle: "Types, interfaces and typed functions: catching mistakes before they reach a phone",
    estimatedMinutes: 50,
    intro:
      "New Expo projects are written in TypeScript: JavaScript plus TYPES that describe what each value is. The compiler reads them and reports mistakes before the app ever runs. From Module 7 on, every app in this course is TypeScript.",

    atoms: [
      {
        id: "a-md-ts-types",
        title: "Types and type annotations",
        explain:
          "TypeScript adds TYPE ANNOTATIONS after a colon: let count: number = 0; const name: string = \"Ada\"; let done: boolean = false;. Often you need none, because TypeScript INFERS the type from the value (const total = 0 is a number). Arrays are number[] or string[]; a value that can be one of several types is a UNION: string | null; and a LITERAL union limits a value to named options: type Status = \"loading\" | \"done\" | \"error\". Important: Expo's bundler STRIPS types without checking them, so a type error does not stop your app from running. Run npx tsc --noEmit (or watch VS Code's red underlines) to see them. In this course every lab's model answer is checked by the real compiler.",
        example: 'const price: number = "500";\n// tsc: error TS2322: Type \'string\' is not assignable to type \'number\'.\n\ntype Status = "loading" | "done" | "error";\nlet status: Status = "finished";\n// tsc: error TS2322: Type \'"finished"\' is not assignable to type \'Status\'.',
        tsCheck: {
          native: true,
          code: 'const price: number = "500";\ntype Status = "loading" | "done" | "error";\nlet status: Status = "finished";\nexport { price, status };\n',
          errors: ["TS2322", "TS2322"],
          quotes: ["Type 'string' is not assignable to type 'number'.", "Type '\"finished\"' is not assignable to type 'Status'."],
        },
        decision: {
          scenario: "A file has const total: number = \"2500\"; in it. You run npx expo start and open the app on your phone.",
          question: "What happens?",
          options: [
            { id: "a", text: "The app runs anyway; the mistake shows only in the editor and when you run npx tsc --noEmit", why: "Expo's bundler removes types without checking them, as Vite does on the web. Type checking is a separate step you run, and CI should run it too." },
            { id: "b", text: "The app refuses to start", whyWrong: "The bundler strips types without checking, so it starts." },
            { id: "c", text: "TypeScript converts \"2500\" to a number for you", whyWrong: "TypeScript never changes values; it only reports mistakes." },
            { id: "d", text: "The phone shows a type error screen", whyWrong: "Type errors are reported by the compiler and the editor, not at run time." },
          ],
          correct: "a",
          aftermath: "Types are a safety net you check with tsc. Make checking a habit, and part of every pull request.",
        },
      },
      {
        id: "a-md-ts-interfaces",
        title: "Interfaces and object types",
        explain:
          "An INTERFACE (or a type alias) describes the shape of an object: interface Product { id: number; name: string; price: number; imageUrl?: string } where ? marks an optional property. Use it to annotate data: const rice: Product = { … }, and arrays of it: Product[]. TypeScript then reports a missing property, a misspelt one, or one of the wrong type, and VS Code autocompletes product. for you. Describe the shape of every API response you use; when the backend changes, the compiler tells you everywhere that needs updating.",
        example: 'interface Product {\n  id: number;\n  name: string;\n  price: number;\n  imageUrl?: string;\n}\n\nconst beans: Product = { id: 2, name: "Beans" };\n// tsc: error TS2741: Property \'price\' is missing in type \'{ id: number; name: string; }\' but required in type \'Product\'.',
        tsCheck: {
          native: true,
          code: 'interface Product {\n  id: number;\n  name: string;\n  price: number;\n  imageUrl?: string;\n}\nexport const beans: Product = { id: 2, name: "Beans" };\n',
          errors: ["TS2741"],
          quotes: ["Property 'price' is missing in type '{ id: number; name: string; }' but required in type 'Product'."],
        },
        webLab: expoLab({
          name: "Typed Market",
          layout: layout("Market"),
          task:
            "Convert the API module to TypeScript. In src/lib/api.ts, declare an interface Product with id (number), name (string), category (string), price (number) and inStock (boolean), and give getProducts the return type Promise<Product[]>. Then complete cheapest(products: Product[]): Product | undefined, which returns the cheapest in-stock product (undefined if there are none). The screen shows the cheapest in-stock product. Your answer must also pass the TypeScript compiler.",
          files: {
            "src/lib/api.ts": `export const API_URL = "https://api.example.com";

// Declare the Product interface here.

export async function getProducts() {
  const response = await fetch(\`\${API_URL}/products\`);
  return response.json();
}

export function cheapest(products) {
  return undefined;
}
`,
            "src/hooks/useLoad.js": USE_LOAD,
            "src/app/index.js": listScreen("Cheapest in stock", 'import { cheapest, getProducts } from "@/lib/api";', "getProducts().then((all) => [cheapest(all) ?? { id: 0, name: 'Nothing in stock', price: 0 }])", "`${item.name}: ₦${item.price}`"),
            "server/index.js": MARKET_SERVER,
          },
          readOnly: ["src/hooks/useLoad.js", "src/app/index.js", "server/index.js"],
          solution: {
            "src/lib/api.ts": `export const API_URL = "https://api.example.com";

export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  inStock: boolean;
}

export async function getProducts(): Promise<Product[]> {
  const response = await fetch(\`\${API_URL}/products\`);
  return response.json();
}

export function cheapest(products: Product[]): Product | undefined {
  const available = products.filter((product) => product.inStock);
  if (available.length === 0) return undefined;
  return available.reduce((best, product) => (product.price < best.price ? product : best));
}
`,
          },
          starterTypeErrors: true,
          tests: [
            { label: "The screen shows the cheapest product that is in stock", check: "await waitFor(() => has('Beans (1kg): ₦1800'), 3000); return true;", fail: "filter to inStock, then reduce to the lowest price." },
            { label: "cheapest returns undefined when nothing is in stock", check: "const { cheapest } = load('src/lib/api.ts'); return cheapest([{ id: 1, name: 'x', category: 'c', price: 1, inStock: false }]) === undefined && cheapest([]) === undefined;", fail: "Return undefined when the filtered list is empty." },
            { label: "Product is declared with all five typed properties", check: "const c = code('src/lib/api.ts'); return /interface\\s+Product\\s*\\{/.test(c) && ['id:\\\\s*number', 'name:\\\\s*string', 'category:\\\\s*string', 'price:\\\\s*number', 'inStock:\\\\s*boolean'].every((p) => new RegExp(p).test(c));", fail: "interface Product { id: number; name: string; category: string; price: number; inStock: boolean; }" },
            { label: "getProducts and cheapest are typed", check: "const c = code('src/lib/api.ts'); return /getProducts\\(\\)\\s*:\\s*Promise<Product\\[\\]>/.test(c) && /cheapest\\(products:\\s*Product\\[\\]\\)\\s*:\\s*Product\\s*\\|\\s*undefined/.test(c);", fail: "getProducts(): Promise<Product[]> and cheapest(products: Product[]): Product | undefined" },
          ],
          hint: "Under strict mode, a parameter with no type is an error (TS7006): that is why the starter does not compile.",
          successMessage: "The same code, now described by types the compiler checks. Every app from Module 7 on works like this.",
        }),
      },
      {
        id: "a-md-ts-functions",
        title: "Typed functions",
        explain:
          "Annotate a function's PARAMETERS and, when it helps, its RETURN TYPE: function addVat(amount: number): number. Optional parameters get ? and default values infer their type. Async functions return Promise<T>. A union return type such as Product | undefined forces every caller to handle the missing case, which is exactly where null and undefined bugs come from: TypeScript will not let you read .price until you have checked the value exists (NARROWING with if, ?., or ??). Under the strict settings Expo projects use, a parameter without a type is an error (TS7006: Parameter 'x' implicitly has an 'any' type).",
        example: 'function addVat(amount: number): number {\n  return Math.round(amount * 1.075);\n}\naddVat("1000");\n// tsc: error TS2345: Argument of type \'string\' is not assignable to parameter of type \'number\'.\n\nfunction label(p: { name: string } | undefined) {\n  return p.name;\n}\n// tsc: error TS18048: \'p\' is possibly \'undefined\'.',
        tsCheck: {
          native: true,
          code: 'function addVat(amount: number): number {\n  return Math.round(amount * 1.075);\n}\naddVat("1000");\nfunction label(p: { name: string } | undefined) {\n  return p.name;\n}\nexport { label };\n',
          errors: ["TS2345", "TS18048"],
          quotes: ["Argument of type 'string' is not assignable to parameter of type 'number'.", "'p' is possibly 'undefined'."],
        },
        decision: {
          scenario: "function findUser(id: number): User | undefined. A teammate writes: const name = findUser(7).name; and TypeScript reports \"Object is possibly 'undefined'\".",
          question: "What is the right fix?",
          options: [
            { id: "a", text: "Handle the missing case: const name = findUser(7)?.name ?? \"Unknown\";", why: "The type says a user may not be found. Narrowing (?., ??, or an if) makes the code correct for that case instead of crashing at run time." },
            { id: "b", text: "Change the return type to User so the error goes away", whyWrong: "That hides a real case: the function genuinely can return undefined." },
            { id: "c", text: "Add // @ts-ignore above the line", whyWrong: "Silencing the compiler leaves the crash in place." },
            { id: "d", text: "Turn off strict mode", whyWrong: "Strict mode is what found the bug." },
          ],
          correct: "a",
          aftermath: "A type error is usually a real bug described early. Fix the code, not the type.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 18 · 4.P
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "md-l18-m4-project",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 6,
    covers: ["4.P"],
    title: "Practical: A List from an API, with Loading and Error States",
    subtitle: "Fetch, check, transform, and explain every failure",
    estimatedMinutes: 75,
    intro: "The Module 4 practical joins everything: an async API module that fetches a list from a server, checks the response, shapes the data for the screen, and turns every failure into a clear message.",

    atoms: [
      {
        id: "a-md-m4-project",
        title: "Build the events list",
        explain:
          "The server lists upcoming events. Your API module must ask for them, refuse bad responses, sort and shape them for the screen, and make every failure understandable. The screen (given) shows a spinner while loading, your list when it arrives, a message when the list is empty, and your error text with a Try again button.",
        webLab: expoLab({
          name: "Events",
          layout: layout("Events"),
          task:
            "Write getEvents() in src/lib/events.js. It fetches `${API_URL}/events` and returns the events sorted by date (soonest first), each as { id, title, when } where when is the date written as \"Sun 25 Oct\" (use toLocaleDateString(\"en-GB\", { weekday: \"short\", day: \"numeric\", month: \"short\", timeZone: \"UTC\" }) and remove its commas). It must throw an Error with the message \"You're offline. Check your connection and try again.\" when the network fails, and \"Could not load events (STATUS)\" for an HTTP error, such as \"Could not load events (503)\". The server sometimes fails: the screen's Try again button calls getEvents again.",
          files: {
            "src/lib/events.js": `export const API_URL = "https://api.example.com";

// Fetch, check, sort, shape. Throw friendly errors.
export async function getEvents() {
  return [];
}
`,
            "src/hooks/useLoad.js": USE_LOAD,
            "src/app/index.js": `import { useCallback } from "react";
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { useLoad } from "@/hooks/useLoad";
import { getEvents } from "@/lib/events";

export default function Screen() {
  const load = useCallback(() => getEvents(), []);
  const { status, data, error, reload } = useLoad(load);

  if (status === "loading") return <ActivityIndicator style={styles.center} accessibilityLabel="Loading events" />;
  if (status === "error") {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{error.message}</Text>
        <Pressable accessibilityRole="button" onPress={reload} style={styles.button}>
          <Text style={styles.buttonText}>Try again</Text>
        </Pressable>
      </View>
    );
  }
  return (
    <FlatList
      data={data}
      keyExtractor={(item) => String(item.id)}
      ListEmptyComponent={<Text style={styles.center}>No upcoming events.</Text>}
      renderItem={({ item }) => (
        <View style={styles.row}>
          <Text style={styles.when}>{item.when}</Text>
          <Text style={styles.title}>{item.title}</Text>
        </View>
      )}
      contentContainerStyle={styles.page}
    />
  );
}

const styles = StyleSheet.create({
  page: { padding: 16, gap: 8 },
  row: { padding: 12, borderRadius: 10, backgroundColor: "#f1f5f4", gap: 2 },
  when: { color: "#0f766e", fontWeight: "700" },
  title: { fontSize: 16 },
  center: { flex: 1, alignItems: "center", justifyContent: "center", gap: 12, padding: 24 },
  error: { fontSize: 16, color: "#b91c1c", textAlign: "center" },
  button: { minHeight: 44, paddingHorizontal: 20, justifyContent: "center", borderRadius: 10, backgroundColor: "#0f766e" },
  buttonText: { color: "#fff", fontWeight: "600" },
});
`,
            "server/index.js": `import { createServer } from "practice-server";

const app = createServer();

let calls = 0;
const events = [
  { id: 3, title: "Tech meetup: React Native in production", date: "2026-11-07T17:00:00Z", venue: "Yaba" },
  { id: 1, title: "Community clean-up", date: "2026-10-25T08:00:00Z", venue: "Surulere" },
  { id: 2, title: "Book club: Half of a Yellow Sun", date: "2026-10-30T18:30:00Z", venue: "Ikeja" },
];

// The first request fails, as busy servers sometimes do. Try again works.
app.get("/events", (req, res) => {
  calls += 1;
  if (calls === 1) return res.status(503).json({ error: "Service unavailable" });
  res.json(events);
});

app.get("/empty-events", (req, res) => res.json([]));

export default app;
`,
          },
          readOnly: ["src/hooks/useLoad.js", "src/app/index.js", "server/index.js"],
          revealSolution: false,
          solution: {
            "src/lib/events.js": `export const API_URL = "https://api.example.com";

const OFFLINE = "You're offline. Check your connection and try again.";

function formatWhen(iso) {
  return new Date(iso)
    .toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", timeZone: "UTC" })
    .replace(/,/g, "");
}

// Fetch, check, sort, shape. Throw friendly errors.
export async function getEvents() {
  let response;
  try {
    response = await fetch(\`\${API_URL}/events\`);
  } catch {
    throw new Error(OFFLINE);
  }
  if (!response.ok) {
    throw new Error(\`Could not load events (\${response.status})\`);
  }
  const events = await response.json();
  return events
    .slice()
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map((event) => ({ id: event.id, title: event.title, when: formatWhen(event.date) }));
}
`,
          },
          tests: [
            { label: "A server error shows \"Could not load events (503)\" and Try again", check: "await waitFor(() => hasText('Could not load events'), 3000); return has('Could not load events (503)') && has('Try again');", fail: "if (!response.ok) throw new Error(`Could not load events (${response.status})`)" },
            { label: "Try again loads the events, soonest first, as \"Sun 25 Oct\"", check: "await waitFor(() => has('Try again'), 3000); await press('Try again'); await waitFor(() => has('Community clean-up'), 3000); const t = texts(); const a = t.indexOf('Community clean-up'), b = t.indexOf('Book club: Half of a Yellow Sun'), c = t.indexOf('Tech meetup: React Native in production'); return a >= 0 && a < b && b < c && has('Sun 25 Oct') && has('Fri 30 Oct') && has('Sat 7 Nov');", fail: "Sort by date, then map each event to { id, title, when }." },
            { label: "Each event has exactly id, title and when", check: "const { getEvents } = load('src/lib/events.js'); let list = []; try { list = await getEvents(); } catch { list = await getEvents(); } return list.length === 3 && list.every((e) => Object.keys(e).sort().join() === 'id,title,when');", fail: "Shape each event: ({ id: event.id, title: event.title, when: … })" },
            { label: "Offline gives the offline message", device: { online: false }, check: "await waitFor(() => hasText('offline'), 3000); return has(\"You're offline. Check your connection and try again.\");", fail: "Wrap the fetch in try/catch: a network failure throws a TypeError." },
          ],
          hint: "Work in order: fetch (catch the network failure), check response.ok, parse, sort, map.",
          successMessage: "A list from an API with every state handled. In Module 7 you will build the screen as well.",
        }),
      },
    ],
    task: {
      title: "Module 4 practical: your own API list app",
      intro: "Build the same thing in your own Expo project, against a real public API.",
      prompts: [
        "Choose a free public API that needs no key, for example https://jsonplaceholder.typicode.com/posts or https://restcountries.com/v3.1/region/africa, and write src/lib/api.ts with a typed interface for its data.",
        "Show the list on your home screen with a loading spinner, an empty message and an error message with Try again (copy the given useLoad hook for now).",
        "Turn on airplane mode on your phone and check your offline message appears; turn it off and check Try again works.",
        "Run npx tsc --noEmit and fix every type error, then commit and push to GitHub.",
        "Mastery checkpoint: explain what happens, in order, between opening the screen and the list appearing, and what the user sees if the network fails at each step.",
      ],
      closing: "Next: Module 5, designing apps that people find easy to use.",
    },
    requirements: { read: true, video: false, assessment: true },
  },
];
