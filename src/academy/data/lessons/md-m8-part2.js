/**
 * MOBILE APP DEVELOPMENT · MODULE 8 · BUILDING POLISHED MOBILE INTERFACES (part 2)
 *
 * Curriculum 8.5 – 8.9: horizontal scrolling, search and filtering,
 * validation feedback, light and dark themes, loading skeletons.
 *
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 */

import { expoLab } from "./md-helpers.js";
import { MODULE, SECTION_ID, layout } from "./md-m8-part1.js";

const PRODUCTS = `export type Product = { id: string; name: string; category: string; price: number };

export const CATEGORIES = ["All", "Phones", "Audio", "Watches", "Laptops", "Cameras", "Gaming"];

export const PRODUCTS: Product[] = [
  { id: "p1", name: "Galaxy A16", category: "Phones", price: 189000 },
  { id: "p2", name: "Redmi Note 14", category: "Phones", price: 245000 },
  { id: "p3", name: "Oraimo FreePods", category: "Audio", price: 24500 },
  { id: "p4", name: "JBL Go 4", category: "Audio", price: 48000 },
  { id: "p5", name: "Mi Smart Band 9", category: "Watches", price: 39000 },
  { id: "p6", name: "IdeaPad Slim 3", category: "Laptops", price: 520000 },
];
`;

const SHOP_START = `import { useState } from "react";
import { FlatList, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { CATEGORIES, PRODUCTS } from "@/data/products";

export default function Shop() {
  const [category, setCategory] = useState("All");
  const [query, setQuery] = useState("");
  const visible = PRODUCTS;
  return (
    <View style={styles.page}>
      <TextInput placeholder="Search products" value={query} onChangeText={setQuery} style={styles.search} />
      {/* The category chips go here */}
      <FlatList
        data={visible}
        keyExtractor={(p) => p.id}
        renderItem={({ item }) => <Text style={styles.row} testID="product">{item.name}</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1 },
  search: { margin: 12, minHeight: 44, borderRadius: 22, paddingHorizontal: 16, backgroundColor: "#f1f5f9", fontSize: 16 },
  chips: { paddingHorizontal: 12, gap: 8 },
  chip: { minHeight: 36, paddingHorizontal: 14, borderRadius: 18, justifyContent: "center", backgroundColor: "#f1f5f9" },
  chipOn: { backgroundColor: "#0f766e" },
  chipText: { color: "#0f172a" },
  chipTextOn: { color: "#ffffff" },
  row: { padding: 16, borderBottomWidth: 1, borderColor: "#e2e8f0", fontSize: 16 },
  empty: { padding: 24, textAlign: "center", color: "#64748b" },
});
`;

const SHOP_MODEL = SHOP_START.replace(
  "  const visible = PRODUCTS;",
  `  const q = query.trim().toLowerCase();
  const visible = PRODUCTS.filter((p) => (category === "All" || p.category === category) && p.name.toLowerCase().includes(q));`
)
  .replace(
    "      {/* The category chips go here */}",
    `      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips} style={{ flexGrow: 0 }} testID="chips">
        {CATEGORIES.map((c) => (
          <Pressable
            key={c}
            accessibilityRole="button"
            accessibilityState={{ selected: c === category }}
            onPress={() => setCategory(c)}
            style={[styles.chip, c === category && styles.chipOn]}
          >
            <Text style={[styles.chipText, c === category && styles.chipTextOn]}>{c}</Text>
          </Pressable>
        ))}
      </ScrollView>`
  )
  .replace(
    '        renderItem={({ item }) => <Text style={styles.row} testID="product">{item.name}</Text>}',
    `        renderItem={({ item }) => <Text style={styles.row} testID="product">{item.name}</Text>}
        ListEmptyComponent={<Text style={styles.empty}>No products match "{query.trim()}"</Text>}`
  );

const AMOUNT_START = `import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { checkAmount } from "@/lib/amount";

export default function SendMoney() {
  const [amount, setAmount] = useState("");
  const [touched, setTouched] = useState(false);
  const [sent, setSent] = useState(false);
  const error = checkAmount(amount);
  return (
    <View style={styles.page}>
      <Text style={styles.label}>Amount (₦)</Text>
      <TextInput
        accessibilityLabel="Amount"
        keyboardType="number-pad"
        value={amount}
        onChangeText={(t) => {
          setAmount(t);
          setSent(false);
        }}
        onBlur={() => setTouched(true)}
        style={styles.input}
      />
      <Text style={styles.hint}>Your balance is ₦52,300. Minimum ₦100.</Text>
      <Pressable accessibilityRole="button" onPress={() => setSent(true)} style={styles.button}>
        <Text style={styles.buttonText}>Send</Text>
      </Pressable>
      {sent ? <Text style={styles.success}>Sent ₦{amount}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, padding: 20, gap: 8 },
  label: { fontWeight: "600" },
  input: { minHeight: 48, borderWidth: 1, borderColor: "#cbd5e1", borderRadius: 10, paddingHorizontal: 12, fontSize: 18 },
  inputError: { borderColor: "#b91c1c", borderWidth: 2 },
  hint: { color: "#64748b" },
  error: { color: "#b91c1c" },
  button: { minHeight: 48, borderRadius: 12, backgroundColor: "#0f766e", alignItems: "center", justifyContent: "center", marginTop: 8 },
  buttonOff: { opacity: 0.45 },
  buttonText: { color: "#fff", fontWeight: "700", fontSize: 16 },
  success: { color: "#15803d", fontWeight: "600", marginTop: 8 },
});
`;

const AMOUNT_MODEL = AMOUNT_START.replace(
  "        style={styles.input}\n      />\n",
  `        style={[styles.input, touched && error ? styles.inputError : null]}
      />
      {touched && error ? (
        <Text style={styles.error} accessibilityLiveRegion="polite">
          {error}
        </Text>
      ) : null}
`
).replace(
  '<Pressable accessibilityRole="button" onPress={() => setSent(true)} style={styles.button}>',
  '<Pressable accessibilityRole="button" disabled={Boolean(error)} onPress={() => setSent(true)} style={[styles.button, error ? styles.buttonOff : null]}>'
);

const AMOUNT_RULES = `// Returns an error message, or null when the amount can be sent.
export function checkAmount(text: string): string | null {
  if (!text.trim()) return "Enter an amount";
  const value = Number(text);
  if (!Number.isInteger(value)) return "Use whole naira only";
  if (value < 100) return "The minimum is ₦100";
  if (value > 52300) return "That is more than your balance of ₦52,300";
  return null;
}
`;

const THEME_START = `import { StyleSheet, Text, View } from "react-native";

export default function Profile() {
  return (
    <View style={styles.page}>
      <Text style={styles.name}>Ada Obi</Text>
      <Text style={styles.muted}>Lagos · member since 2023</Text>
      <View style={styles.card}>
        <Text style={styles.name}>3 orders on the way</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, padding: 20, gap: 8, backgroundColor: "#ffffff" },
  name: { fontSize: 20, fontWeight: "700", color: "#0f172a" },
  muted: { color: "#475569" },
  card: { marginTop: 12, padding: 16, borderRadius: 14, backgroundColor: "#f1f5f9" },
});
`;

const THEME_MODEL = `import { StyleSheet, Text, View } from "react-native";
import { useTheme } from "@/hooks/useTheme";

export default function Profile() {
  const colors = useTheme();
  return (
    <View style={[styles.page, { backgroundColor: colors.background }]} testID="page">
      <Text style={[styles.name, { color: colors.text }]}>Ada Obi</Text>
      <Text style={{ color: colors.muted }}>Lagos · member since 2023</Text>
      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <Text style={[styles.name, { color: colors.text }]}>3 orders on the way</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, padding: 20, gap: 8 },
  name: { fontSize: 20, fontWeight: "700" },
  card: { marginTop: 12, padding: 16, borderRadius: 14 },
});
`;

const COLORS = `export const Colors = {
  light: { background: "#ffffff", card: "#f1f5f9", text: "#0f172a", muted: "#475569" },
  dark: { background: "#0b1120", card: "#1e293b", text: "#f1f5f9", muted: "#94a3b8" },
} as const;
`;

const SKELETON_SCREEN = `import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { FeedSkeleton } from "@/components/FeedSkeleton";

type Post = { id: string; author: string; text: string };

function loadFeed(): Promise<Post[]> {
  return new Promise((resolve) =>
    setTimeout(() => resolve([{ id: "1", author: "Tolu", text: "New stall opening in Ikeja!" }, { id: "2", author: "Musa", text: "Fresh tomatoes today." }]), 1500)
  );
}

export default function Feed() {
  const [posts, setPosts] = useState<Post[] | null>(null);
  useEffect(() => {
    loadFeed().then(setPosts);
  }, []);
  if (!posts) return <FeedSkeleton />;
  return (
    <View style={styles.page}>
      {posts.map((p) => (
        <View key={p.id} style={styles.post}>
          <Text style={styles.author}>{p.author}</Text>
          <Text>{p.text}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  page: { padding: 16, gap: 12 },
  post: { padding: 16, borderRadius: 12, backgroundColor: "#f8fafc", gap: 4 },
  author: { fontWeight: "700" },
});
`;

const SKELETON_MODEL = `import { useEffect } from "react";
import { Animated, StyleSheet, useAnimatedValue, View } from "react-native";

export function FeedSkeleton() {
  const pulse = useAnimatedValue(0.4);
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 600, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0.4, duration: 600, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [pulse]);
  return (
    <View style={styles.page} accessibilityRole="progressbar" accessibilityLabel="Loading posts">
      {[0, 1, 2].map((i) => (
        <Animated.View key={i} style={[styles.post, { opacity: pulse }]} testID="skeleton">
          <View style={styles.lineShort} />
          <View style={styles.line} />
        </Animated.View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  page: { padding: 16, gap: 12 },
  post: { padding: 16, borderRadius: 12, backgroundColor: "#f8fafc", gap: 8 },
  lineShort: { width: "30%", height: 14, borderRadius: 7, backgroundColor: "#e2e8f0" },
  line: { width: "80%", height: 14, borderRadius: 7, backgroundColor: "#e2e8f0" },
});
`;

export const PART2 = [
  /* ═══════════════ LESSON 45 · 8.5 – 8.7 ═══════════════ */
  {
    id: "md-l45-scroll-search",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 3,
    covers: ["8.5", "8.6", "8.7"],
    title: "Scrolling, Searching and Feedback",
    subtitle: "Horizontal sections, searchable lists, and telling users what is happening",
    estimatedMinutes: 55,
    intro: "Users scan, search and fill in forms constantly. Each of these needs to respond instantly and clearly.",
    atoms: [
      {
        id: "a-md-search-filter",
        title: "Scrollable pages, horizontal sections, and lists with search and filtering",
        explain:
          "A row of filter chips is a horizontal ScrollView (horizontal, showsHorizontalScrollIndicator={false}, flexGrow: 0 so it does not stretch). The selected chip reports accessibilityState={{ selected: true }}. Search and filter are DERIVED state: keep only the query and the chosen category in state, and calculate the visible list during render with filter. Compare text in lower case and trim the query, and give the empty result its own message (\"No products match …\"). For thousands of items or server-side search, debounce the query and search on the server (Module 13).",
        webLab: expoLab({
          name: "Gadgets",
          layout: layout("Shop"),
          task:
            "Add the category chips as a horizontal ScrollView (testID \"chips\") of Pressables, one per category, with the selected one highlighted (chipOn, chipTextOn) and reporting selected. Then filter the list: by category (\"All\" shows everything) and by the search text (case-insensitive, trimmed), both at once. When nothing matches, show No products match \"<query>\".",
          files: { "src/app/index.tsx": SHOP_START, "src/data/products.ts": PRODUCTS },
          readOnly: ["src/data/products.ts"],
          solution: { "src/app/index.tsx": SHOP_MODEL },
          tests: [
            { label: "Seven chips in a horizontal scroller, All selected", check: "const s = find({ testID: 'chips' }); const chips = findAll({ role: 'button' }); return Boolean(s) && chips.length === 7 && chips[0].getAttribute('aria-selected') === 'true' && rectOf({ role: 'button', name: 'Gaming' }).left > rectOf({ role: 'button', name: 'All' }).left;", fail: "<ScrollView horizontal …>{CATEGORIES.map(…)}</ScrollView>" },
            { label: "A chip filters the list", check: "await press({ role: 'button', name: 'Audio' }); const names = findAll({ testID: 'product' }).map((e) => e.textContent); return names.join() === 'Oraimo FreePods,JBL Go 4' && find({ role: 'button', name: 'Audio' }).getAttribute('aria-selected') === 'true';", fail: "category === \"All\" || p.category === category" },
            { label: "Search works with the category, ignoring case and spaces", check: "await press({ role: 'button', name: 'Phones' }); await typeInto('Search products', '  REDMI '); const names = findAll({ testID: 'product' }).map((e) => e.textContent); return names.join() === 'Redmi Note 14';", fail: "p.name.toLowerCase().includes(query.trim().toLowerCase())" },
            { label: "No match gets its own message", check: "await typeInto('Search products', 'tablet'); return has('No products match \"tablet\"');", fail: "ListEmptyComponent={<Text>No products match \"{query.trim()}\"</Text>}" },
          ],
          hint: "Two pieces of state, one derived list.",
          successMessage: "Filters and search that respond on every keystroke, from two small pieces of state.",
        }),
      },
      {
        id: "a-md-validation-feedback",
        title: "Form validation and user feedback",
        explain:
          "Validate as the user goes, but do not shout before they are done: show a field's error once they have LEFT it (onBlur) or tried to submit, and clear it as soon as it is fixed. Mark the field (a red border is not enough on its own: add the message), say exactly how to fix it, and disable the main button while the input is invalid so the user cannot make a mistake you could have prevented. Announce errors to screen readers (accessibilityLiveRegion=\"polite\" on Android; on iOS use AccessibilityInfo.announceForAccessibility). Confirm success clearly.",
        webLab: expoLab({
          name: "Kobo",
          layout: layout("Send money"),
          task:
            "Use checkAmount (in src/lib/amount.ts, already written) to give feedback. After the field has been left once (touched), show its error message under it with the inputError border; and disable the Send button (with buttonOff) whenever there is an error. A valid amount sends: \"Sent ₦5000\".",
          files: { "src/app/index.tsx": AMOUNT_START, "src/lib/amount.ts": AMOUNT_RULES },
          readOnly: ["src/lib/amount.ts"],
          solution: { "src/app/index.tsx": AMOUNT_MODEL },
          tests: [
            { label: "No error is shown before the field is left", check: "await typeInto('Amount', '50'); return !has('The minimum is ₦100');", fail: "Only show the error when touched is true." },
            { label: "After leaving the field, the error and red border appear", check: "await typeInto('Amount', '50'); await leave('Amount'); return has('The minimum is ₦100') && css({ label: 'Amount' }, 'border-top-color') === 'rgb(185, 28, 28)';", fail: "onBlur sets touched; then show {error} and styles.inputError." },
            { label: "Send is disabled while the amount is wrong", check: "await typeInto('Amount', '90000'); await press('Send'); return disabled({ role: 'button', name: 'Send' }) && !hasText('Sent');", fail: "disabled={Boolean(error)}" },
            { label: "A valid amount clears the error and sends", check: "await typeInto('Amount', '5000'); await press('Send'); return !has('That is more than your balance of ₦52,300') && has('Sent ₦5000');", fail: "The error is derived from the amount, so it clears itself." },
          ],
          hint: "The error is calculated on every render; touched only decides whether to show it.",
          successMessage: "Feedback at the right moment, and a button that prevents the mistake.",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════ LESSON 46 · 8.8 – 8.9 ═══════════════ */
  {
    id: "md-l46-themes-loading",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 4,
    covers: ["8.8", "8.9"],
    title: "Themes and Loading States",
    subtitle: "Light and dark mode, skeletons and activity indicators",
    estimatedMinutes: 50,
    intro: "Most people now use dark mode at least some of the time, and everyone waits for data. Both deserve design.",
    atoms: [
      {
        id: "a-md-dark-mode",
        title: "Light and dark themes",
        explain:
          "useColorScheme() from react-native returns \"light\" or \"dark\" from the phone's setting and re-renders when it changes. Define both palettes as tokens (Colors.light and Colors.dark, as the SDK 58 template does in src/constants/theme.ts), read the right one through a small useTheme() hook, and use it for every colour: backgrounds, text, cards, borders. Set \"userInterfaceStyle\": \"automatic\" in app.json (the template's default) or the app is locked to light. Dark mode is not inverted light mode: use dark greys rather than pure black for surfaces, slightly less saturated colours, and check contrast in both.",
        webLab: expoLab({
          name: "Profile",
          layout: layout("Profile"),
          task:
            "Write useTheme() in src/hooks/useTheme.ts: it returns Colors.dark when useColorScheme() is \"dark\", otherwise Colors.light. Then use it in src/app/index.tsx for the page background (testID \"page\"), both text colours, the muted text and the card, instead of the fixed light colours.",
          files: {
            "src/app/index.tsx": THEME_START,
            "src/hooks/useTheme.ts": 'import { useColorScheme } from "react-native";\nimport { Colors } from "@/constants/theme";\n\nexport function useTheme() {\n  return Colors.light;\n}\n',
            "src/constants/theme.ts": COLORS,
          },
          readOnly: ["src/constants/theme.ts"],
          solution: {
            "src/app/index.tsx": THEME_MODEL,
            "src/hooks/useTheme.ts": 'import { useColorScheme } from "react-native";\nimport { Colors } from "@/constants/theme";\n\nexport function useTheme() {\n  const scheme = useColorScheme();\n  return scheme === "dark" ? Colors.dark : Colors.light;\n}\n',
          },
          tests: [
            { label: "Light mode uses the light palette", check: "return css({ testID: 'page' }, 'background-color') === 'rgb(255, 255, 255)' && css('Ada Obi', 'color') === 'rgb(15, 23, 42)';", fail: "useTheme returns Colors.light when the scheme is not dark." },
            { label: "Dark mode uses the dark palette everywhere", device: { scheme: "dark" }, check: "return css({ testID: 'page' }, 'background-color') === 'rgb(11, 17, 32)' && css('Ada Obi', 'color') === 'rgb(241, 245, 249)' && css('Lagos · member since 2023', 'color') === 'rgb(148, 163, 184)' && contrastOf('3 orders on the way') >= 4.5;", fail: "Read every colour from useTheme()." },
            { label: "It follows the phone when the setting changes", check: "await setScheme('dark'); const dark = css({ testID: 'page' }, 'background-color') === 'rgb(11, 17, 32)'; await setScheme('light'); return dark && css({ testID: 'page' }, 'background-color') === 'rgb(255, 255, 255)';", fail: "useColorScheme re-renders when the setting changes." },
          ],
          hint: "Use the sun and moon button above the phone to try both themes.",
          successMessage: "One screen, two palettes, switching with the phone.",
        }),
      },
      {
        id: "a-md-skeletons",
        title: "Loading skeletons and activity indicators",
        explain:
          "An ActivityIndicator (a spinner) says \"something is happening\"; a SKELETON (grey shapes where the content will be) also says what is coming, so the wait feels shorter and the screen does not jump when content arrives. Use a spinner inside buttons and for short waits, a skeleton for screens of content. Animate it gently (a pulse of opacity with Animated.loop is enough, using useNativeDriver for smoothness), give it an accessible description (\"Loading posts\"), and never show one for more than a few seconds without a message.",
        webLab: expoLab({
          name: "Feed",
          layout: layout("Feed"),
          task:
            "Write FeedSkeleton in src/components/FeedSkeleton.tsx (named export): three placeholder posts (testID \"skeleton\"), each with a short and a long grey line, in a container with accessibilityRole \"progressbar\" and accessibilityLabel \"Loading posts\". Make them pulse with an Animated.loop of opacity between 0.4 and 1 (stop the loop when the component unmounts). The feed shows it for about a second and a half.",
          files: { "src/components/FeedSkeleton.tsx": "// Write and export FeedSkeleton here.\n", "src/app/index.tsx": SKELETON_SCREEN },
          readOnly: ["src/app/index.tsx"],
          solution: { "src/components/FeedSkeleton.tsx": SKELETON_MODEL },
          tests: [
            { label: "While loading, three skeleton posts are shown and described", check: "return findAll({ testID: 'skeleton' }).length === 3 && Boolean(find({ label: 'Loading posts' })) && !has('Tolu');", fail: "Three Animated.View placeholders inside a container labelled \"Loading posts\"." },
            { label: "The skeletons pulse", check: "const c = code('src/components/FeedSkeleton.tsx'); return ['Animated.loop(', '.start()', '.stop()', 'Animated.View', 'opacity: pulse'].every((x) => c.includes(x));", fail: "Animated.loop(Animated.sequence([timing to 1, timing to 0.4])).start(), stopped on unmount, driving opacity." },
            { label: "The real posts replace them", check: "await waitFor(() => has('Tolu'), 3000); return findAll({ testID: 'skeleton' }).length === 0 && has('Fresh tomatoes today.');", fail: "The screen swaps the skeleton for the posts once they load." },
          ],
          hint: "useAnimatedValue(0.4) from react-native gives you one animated value for the component's life.",
          successMessage: "A wait that shows the shape of what is coming.",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },
];
