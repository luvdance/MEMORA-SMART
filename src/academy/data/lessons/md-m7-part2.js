/**
 * MOBILE APP DEVELOPMENT · MODULE 7 · UNDERSTANDING REACT NATIVE (part 2)
 *
 * Curriculum 7.12 – 7.P: text inputs and controls, StyleSheet, Flexbox,
 * safe areas, the status bar and the keyboard, platform differences, and the
 * module practical. Part 1 is md-m7-part1.js.
 *
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 */

import { expoLab } from "./md-helpers.js";
import { MODULE, SECTION_ID, layout } from "./md-m7-part1.js";

const bare = `import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
    </Stack>
  );
}
`;

const FORM_START = `import { useState } from "react";
import { StyleSheet, Switch, Text, TextInput, View } from "react-native";

export default function ProfileForm() {
  return (
    <View style={styles.page}>
      <Text style={styles.label}>Display name</Text>
      <TextInput style={styles.input} />
      <View style={styles.row}>
        <Text>Show my phone number</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, padding: 20, gap: 10 },
  label: { fontWeight: "600" },
  input: { minHeight: 48, borderWidth: 1, borderColor: "#cbd5e1", borderRadius: 10, paddingHorizontal: 12, fontSize: 16 },
  row: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", minHeight: 48 },
  preview: { marginTop: 12, padding: 12, borderRadius: 10, backgroundColor: "#f1f5f9" },
});
`;

const FORM_MODEL = `import { useState } from "react";
import { StyleSheet, Switch, Text, TextInput, View } from "react-native";

export default function ProfileForm() {
  const [name, setName] = useState("");
  const [showPhone, setShowPhone] = useState(false);
  return (
    <View style={styles.page}>
      <Text style={styles.label}>Display name</Text>
      <TextInput
        style={styles.input}
        accessibilityLabel="Display name"
        placeholder="e.g. Ada O."
        value={name}
        onChangeText={setName}
        maxLength={20}
        autoCapitalize="words"
      />
      <View style={styles.row}>
        <Text>Show my phone number</Text>
        <Switch accessibilityLabel="Show my phone number" value={showPhone} onValueChange={setShowPhone} />
      </View>
      <View style={styles.preview}>
        <Text>{name.trim() ? name.trim() : "No name yet"}</Text>
        <Text>{showPhone ? "Phone: visible" : "Phone: hidden"}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, padding: 20, gap: 10 },
  label: { fontWeight: "600" },
  input: { minHeight: 48, borderWidth: 1, borderColor: "#cbd5e1", borderRadius: 10, paddingHorizontal: 12, fontSize: 16 },
  row: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", minHeight: 48 },
  preview: { marginTop: 12, padding: 12, borderRadius: 10, backgroundColor: "#f1f5f9" },
});
`;

const BADGE_START = `import { Pressable, Text, View } from "react-native";

export function Badge({ label, tone }: { label: string; tone: "success" | "danger" }) {
  return (
    <Pressable accessibilityRole="button" style={{ paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999, backgroundColor: tone === "success" ? "#dcfce7" : "#fee2e2" }}>
      <View>
        <Text style={{ fontSize: 14, fontWeight: "600", color: tone === "success" ? "#166534" : "#991b1b" }}>{label}</Text>
      </View>
    </Pressable>
  );
}
`;

const BADGE_MODEL = `import { Pressable, StyleSheet, Text } from "react-native";

type Tone = "success" | "danger";

export function Badge({ label, tone }: { label: string; tone: Tone }) {
  return (
    <Pressable accessibilityRole="button" style={[styles.badge, styles[tone]]}>
      <Text style={[styles.text, tone === "success" ? styles.successText : styles.dangerText]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  badge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999 },
  success: { backgroundColor: "#dcfce7" },
  danger: { backgroundColor: "#fee2e2" },
  text: { fontSize: 14, fontWeight: "600" },
  successText: { color: "#166534" },
  dangerText: { color: "#991b1b" },
});
`;

const ROW_START = `import { StyleSheet, Text, View } from "react-native";

export default function Chats() {
  return (
    <View style={styles.page}>
      <View style={styles.row}>
        <View style={styles.avatar} testID="avatar" />
        <View style={styles.middle} testID="middle">
          <Text style={styles.name}>Ngozi Uche</Text>
          <Text numberOfLines={1}>Are we still meeting at the market tomorrow morning?</Text>
        </View>
        <Text style={styles.time} testID="time">09:41</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, paddingTop: 8 },
  row: { padding: 12 },
  avatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: "#99f6e4" },
  middle: {},
  name: { fontWeight: "700", fontSize: 16 },
  time: { color: "#64748b" },
});
`;

const ROW_MODEL = ROW_START.replace("  row: { padding: 12 },", '  row: { flexDirection: "row", alignItems: "center", gap: 12, padding: 12 },').replace("  middle: {},", "  middle: { flex: 1 },");

const SAFE_START = `import { StatusBar } from "expo-status-bar";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function Wallet() {
  return (
    <View style={styles.page}>
      <StatusBar style="dark" />
      <Text style={styles.title}>Wallet</Text>
      <Text style={styles.balance}>₦52,300</Text>
      <View style={{ flex: 1 }} />
      <Pressable accessibilityRole="button" style={styles.button}>
        <Text style={styles.buttonText}>Send money</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: "#064e3b", paddingHorizontal: 20 },
  title: { fontSize: 18, color: "#a7f3d0" },
  balance: { fontSize: 40, fontWeight: "700", color: "#ffffff" },
  button: { minHeight: 52, borderRadius: 14, backgroundColor: "#ffffff", alignItems: "center", justifyContent: "center" },
  buttonText: { fontSize: 16, fontWeight: "700", color: "#064e3b" },
});
`;

const SAFE_MODEL = `import { StatusBar } from "expo-status-bar";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Wallet() {
  return (
    <SafeAreaView style={styles.page} edges={["top", "bottom"]}>
      <StatusBar style="light" />
      <Text style={styles.title}>Wallet</Text>
      <Text style={styles.balance}>₦52,300</Text>
      <View style={{ flex: 1 }} />
      <Pressable accessibilityRole="button" style={styles.button}>
        <Text style={styles.buttonText}>Send money</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: "#064e3b", paddingHorizontal: 20 },
  title: { fontSize: 18, color: "#a7f3d0" },
  balance: { fontSize: 40, fontWeight: "700", color: "#ffffff" },
  button: { minHeight: 52, borderRadius: 14, backgroundColor: "#ffffff", alignItems: "center", justifyContent: "center" },
  buttonText: { fontSize: 16, fontWeight: "700", color: "#064e3b" },
});
`;

const CHAT_START = `import { useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Chat() {
  const [messages, setMessages] = useState(["Hi! Is the bicycle still for sale?"]);
  const [draft, setDraft] = useState("");
  const send = () => {
    if (!draft.trim()) return;
    setMessages((m) => [...m, draft.trim()]);
    setDraft("");
  };
  return (
    <SafeAreaView style={styles.page} edges={["top", "bottom"]}>
      <FlatList data={messages} keyExtractor={(m, i) => String(i)} renderItem={({ item }) => <Text style={styles.bubble}>{item}</Text>} contentContainerStyle={{ padding: 12, gap: 8 }} />
      <View style={styles.composer}>
        <TextInput placeholder="Message" value={draft} onChangeText={setDraft} style={styles.input} />
        <Pressable accessibilityRole="button" onPress={send} style={styles.send}>
          <Text style={styles.sendText}>Send</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: "#f8fafc" },
  bubble: { alignSelf: "flex-start", padding: 10, borderRadius: 12, backgroundColor: "#e2e8f0" },
  composer: { flexDirection: "row", gap: 8, padding: 8, borderTopWidth: 1, borderColor: "#e2e8f0", backgroundColor: "#fff" },
  input: { flex: 1, minHeight: 44, borderRadius: 22, paddingHorizontal: 14, backgroundColor: "#f1f5f9", fontSize: 16 },
  send: { minHeight: 44, paddingHorizontal: 16, borderRadius: 22, backgroundColor: "#0f766e", justifyContent: "center" },
  sendText: { color: "#fff", fontWeight: "700" },
});
`;

const CHAT_MODEL = CHAT_START.replace(
  'import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from "react-native";',
  'import { FlatList, KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, View } from "react-native";'
)
  .replace('<SafeAreaView style={styles.page} edges={["top", "bottom"]}>\n', '<SafeAreaView style={styles.page} edges={["top", "bottom"]}>\n      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>\n')
  .replace("      </View>\n    </SafeAreaView>", "      </View>\n      </KeyboardAvoidingView>\n    </SafeAreaView>");

const PLATFORM_CARD = (style) => `import { Platform, StyleSheet, Text, View } from "react-native";
import { ShareButton } from "@/components/ShareButton";

export default function Offer() {
  return (
    <View style={styles.page}>
      <View style={styles.card} testID="card">
        <Text style={styles.title}>Weekend offer</Text>
        <Text>20% off all deliveries to Ikeja.</Text>
        <ShareButton />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, padding: 16 },
  card: {
    padding: 16,
    borderRadius: 16,
    backgroundColor: "#ffffff",
    gap: 8,${style}
  },
  title: { fontSize: 18, fontWeight: "700" },
});
`;

const SHARE = (icon, label) => `import Ionicons from "@expo/vector-icons/Ionicons";
import { Pressable, StyleSheet, Text } from "react-native";

export function ShareButton() {
  return (
    <Pressable accessibilityRole="button" accessibilityLabel="Share" style={styles.button}>
      <Ionicons name="${icon}" size={20} color="#0f766e" />
      <Text style={styles.text}>${label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: { flexDirection: "row", alignItems: "center", gap: 6, minHeight: 44 },
  text: { color: "#0f766e", fontWeight: "600" },
});
`;

const HABITS_START = `// Build the habit tracker here, from your own components.
import { Text, View } from "react-native";

export default function Habits() {
  return (
    <View>
      <Text>Habits</Text>
    </View>
  );
}
`;

const HABITS_MODEL = `import { useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { HabitRow } from "@/components/HabitRow";

type Habit = { id: string; name: string; done: boolean };

const START: Habit[] = [
  { id: "1", name: "Drink 8 glasses of water", done: false },
  { id: "2", name: "Read for 20 minutes", done: true },
];

export default function Habits() {
  const [habits, setHabits] = useState<Habit[]>(START);
  const [draft, setDraft] = useState("");
  const done = habits.filter((h) => h.done).length;

  const add = () => {
    const name = draft.trim();
    if (!name) return;
    setHabits((list) => [...list, { id: String(Date.now()), name, done: false }]);
    setDraft("");
  };
  const toggle = (id: string) => setHabits((list) => list.map((h) => (h.id === id ? { ...h, done: !h.done } : h)));

  return (
    <View style={styles.page}>
      <Text accessibilityRole="header" style={styles.title}>
        Today
      </Text>
      <Text style={styles.summary}>
        {done} of {habits.length} done
      </Text>
      <View style={styles.addRow}>
        <TextInput accessibilityLabel="New habit" placeholder="New habit" value={draft} onChangeText={setDraft} onSubmitEditing={add} style={styles.input} />
        <Pressable accessibilityRole="button" onPress={add} style={styles.add}>
          <Text style={styles.addText}>Add</Text>
        </Pressable>
      </View>
      <FlatList
        data={habits}
        keyExtractor={(h) => h.id}
        renderItem={({ item }) => <HabitRow name={item.name} done={item.done} onToggle={() => toggle(item.id)} />}
        ListEmptyComponent={<Text>No habits yet. Add your first one.</Text>}
        contentContainerStyle={{ gap: 8 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, padding: 16, gap: 10 },
  title: { fontSize: 28, fontWeight: "700" },
  summary: { color: "#475569" },
  addRow: { flexDirection: "row", gap: 8 },
  input: { flex: 1, minHeight: 48, borderWidth: 1, borderColor: "#cbd5e1", borderRadius: 10, paddingHorizontal: 12, fontSize: 16 },
  add: { minHeight: 48, paddingHorizontal: 18, borderRadius: 10, backgroundColor: "#0f766e", justifyContent: "center" },
  addText: { color: "#fff", fontWeight: "700" },
});
`;

const HABIT_ROW_MODEL = `import { Pressable, StyleSheet, Text } from "react-native";

type HabitRowProps = { name: string; done: boolean; onToggle: () => void };

export function HabitRow({ name, done, onToggle }: HabitRowProps) {
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked: done }}
      accessibilityLabel={name}
      onPress={onToggle}
      style={[styles.row, done && styles.done]}
      testID="habit"
    >
      <Text style={styles.mark}>{done ? "✓" : "○"}</Text>
      <Text style={[styles.name, done && styles.doneText]}>{name}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: 12, minHeight: 52, paddingHorizontal: 14, borderRadius: 12, backgroundColor: "#f8fafc" },
  done: { backgroundColor: "#ecfdf5" },
  mark: { fontSize: 20, width: 24, textAlign: "center" },
  name: { fontSize: 16, flex: 1 },
  doneText: { color: "#047857" },
});
`;

export const PART2 = [
  /* ═══════════════ LESSON 40 · 7.12 – 7.14 ═══════════════ */
  {
    id: "md-l40-inputs-style",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 5,
    covers: ["7.12", "7.13", "7.14"],
    title: "Inputs, Styles and Layout",
    subtitle: "TextInput and controls, StyleSheet, and Flexbox on a phone",
    estimatedMinutes: 55,
    intro: "Forms, styles and layout are where you spend most of your time building screens. React Native's versions are close to the web's, with a few differences that matter.",
    atoms: [
      {
        id: "a-md-text-input",
        title: "Text inputs and form controls",
        explain:
          "TextInput is the native text field. Make it CONTROLLED: value from state, onChangeText updating it, so the screen always shows what state says. Useful props: placeholder (a hint, not a label), keyboardType (\"email-address\", \"number-pad\", \"phone-pad\", \"decimal-pad\"), secureTextEntry (passwords), autoCapitalize, autoComplete and textContentType (let the phone fill saved details), maxLength, multiline and returnKeyType. Give every field an accessibilityLabel that matches its visible label. Switch is the on/off control: value and onValueChange. For choices, build a list of Pressable options or use a community picker.",
        webLab: expoLab({
          name: "Profile",
          layout: layout("Edit profile"),
          task:
            "Make the form work. The TextInput must be controlled by state, labelled \"Display name\" for screen readers, with the placeholder \"e.g. Ada O.\", at most 20 characters, capitalising words. Add a Switch (accessibilityLabel \"Show my phone number\") controlled by state. Below, a preview shows the trimmed name (or \"No name yet\") and \"Phone: visible\" or \"Phone: hidden\".",
          files: { "src/app/index.tsx": FORM_START },
          solution: { "src/app/index.tsx": FORM_MODEL },
          tests: [
            { label: "Typing updates the preview, trimmed", check: "const before = has('No name yet'); await typeInto('Display name', '  Ada O.  '); return before && has('Ada O.');", fail: "value={name} onChangeText={setName}, and show name.trim() in the preview." },
            { label: "The field has a placeholder, a 20-character limit and word capitals", check: "const el = find({ label: 'Display name' }); return el && el.getAttribute('placeholder') === 'e.g. Ada O.' && el.getAttribute('maxlength') === '20' && el.getAttribute('autocapitalize') === 'words';", fail: "placeholder=\"e.g. Ada O.\" maxLength={20} autoCapitalize=\"words\"" },
            { label: "The switch shows or hides the phone number", check: "const hidden = has('Phone: hidden'); await toggle({ label: 'Show my phone number' }); return hidden && has('Phone: visible');", fail: "<Switch value={showPhone} onValueChange={setShowPhone} />" },
          ],
          hint: "onChangeText gives you the new text directly, so onChangeText={setName} is enough.",
          successMessage: "Controlled inputs: state is the truth, the field and the preview follow it.",
        }),
      },
      {
        id: "a-md-stylesheet",
        title: "Styling with StyleSheet",
        explain:
          "Styles are JavaScript objects with camelCase names (backgroundColor, fontSize) and unitless numbers (density-independent points). Put them in StyleSheet.create at the bottom of the file, not inline: they are defined once instead of on every render, are named, and TypeScript checks every property. Combine styles with an ARRAY: style={[styles.button, primary && styles.primary, { marginTop: 8 }]}; later entries win and false or null entries are ignored. Styles do not cascade: a Text inside a View does not inherit the View's colour (only nested Text inherits from its Text parent). There are no class names or selectors; a component's look is its props.",
        webLab: expoLab({
          name: "Badges",
          layout: layout("Status"),
          task:
            "Refactor src/components/Badge.tsx: move every inline style into StyleSheet.create (badge, success, danger, text, successText, dangerText), choose the tone's styles with style arrays, and remove the unnecessary View around the Text. It must look exactly the same as before.",
          files: {
            "src/components/Badge.tsx": BADGE_START,
            "src/app/index.tsx": `import { View } from "react-native";\nimport { Badge } from "@/components/Badge";\n\nexport default function Status() {\n  return (\n    <View style={{ padding: 20, gap: 12, alignItems: "flex-start" }}>\n      <Badge label="Paid" tone="success" />\n      <Badge label="Overdue" tone="danger" />\n    </View>\n  );\n}\n`,
          },
          readOnly: ["src/app/index.tsx"],
          solution: { "src/components/Badge.tsx": BADGE_MODEL },
          tests: [
            { label: "It looks the same: colours and shape", check: "return css('Paid', 'color') === 'rgb(22, 101, 52)' && css('Overdue', 'color') === 'rgb(153, 27, 27)' && css({ role: 'button', name: 'Paid' }, 'background-color') === 'rgb(220, 252, 231)' && css({ role: 'button', name: 'Overdue' }, 'border-top-left-radius') === '999px';", fail: "Keep the same values, just moved into StyleSheet.create." },
            { label: "No inline style objects left", check: "const c = code('src/components/Badge.tsx'); return /StyleSheet\\.create/.test(c) && !/style=\\{\\{/.test(c);", fail: "style={[styles.badge, styles[tone]]} instead of style={{ … }}." },
            { label: "The extra View is gone", check: "return !/<View/.test(code('src/components/Badge.tsx'));", fail: "Pressable can hold the Text directly." },
          ],
          hint: "styles[tone] picks styles.success or styles.danger, because the tone is the style's name.",
          successMessage: "Same look, named styles, no inline objects re-created on every render.",
        }),
      },
      {
        id: "a-md-flexbox",
        title: "Flexbox layouts on mobile",
        explain:
          "Every View lays its children out with Flexbox, with two differences from the web: flexDirection defaults to \"column\" (top to bottom), and flex: 1 means \"take all the remaining space\". justifyContent places children along the main axis (start, center, space-between…), alignItems across it (stretch by default, center, flex-start), gap spaces them, flexWrap: \"wrap\" wraps rows, and alignSelf overrides one child. The classic list row: a row (flexDirection: \"row\", alignItems: \"center\", gap), a fixed-size avatar, a middle part with flex: 1 so it takes the space and truncates its text, and a fixed item at the end.",
        webLab: expoLab({
          name: "Chats",
          layout: layout("Chats"),
          task:
            "Lay out the chat row properly by changing only the row and middle styles: the avatar on the left, the name and message in the middle taking all the remaining width, and the time at the far right, all vertically centred, with 12 between them.",
          files: { "src/app/index.tsx": ROW_START },
          solution: { "src/app/index.tsx": ROW_MODEL },
          tests: [
            { label: "Avatar, middle and time sit side by side, in that order", check: "const a = rectOf({ testID: 'avatar' }), m = rectOf({ testID: 'middle' }), t = rectOf({ testID: 'time' }); return a.right <= m.left && m.right <= t.left;", fail: "row: { flexDirection: \"row\" }" },
            { label: "The middle takes the remaining width, pushing the time to the right edge", check: "const t = rectOf({ testID: 'time' }); return insets() && t.right > width() - 20 && rectOf({ testID: 'middle' }).width > 200;", fail: "middle: { flex: 1 }" },
            { label: "Vertically centred, with a gap of 12", check: "const a = rectOf({ testID: 'avatar' }), m = rectOf({ testID: 'middle' }), t = rectOf({ testID: 'time' }); const mid = (r) => r.top + r.height / 2; return Math.abs(mid(a) - mid(t)) < 2 && Math.round(m.left - a.right) === 12;", fail: "alignItems: \"center\", gap: 12" },
          ],
          hint: "Columns are the default in React Native: a row must say flexDirection: \"row\".",
          successMessage: "The layout behind most list rows in every app on your phone.",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════ LESSON 41 · 7.15 – 7.16 ═══════════════ */
  {
    id: "md-l41-device-ui",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 6,
    covers: ["7.15", "7.16"],
    title: "The Phone Around Your Screen",
    subtitle: "Safe areas, the status bar, the keyboard, and Android versus iOS",
    estimatedMinutes: 55,
    intro: "Your screen shares the phone with a status bar, a notch or Dynamic Island, a home indicator and an on-screen keyboard. And it runs on two platforms with different habits.",
    atoms: [
      {
        id: "a-md-safe-areas",
        title: "Safe areas and status bars",
        explain:
          "Modern phones draw your app EDGE TO EDGE (on Android it is mandatory since Android 15, and Expo SDK 54+ always enables it): the status bar, the camera cut-out or Dynamic Island, and the home indicator or gesture bar sit ON TOP of your content. The SAFE AREA is the part they do not cover. Navigation headers and tab bars handle it for you; for your own full-screen layouts use SafeAreaView from react-native-safe-area-context (not the old one in react-native), choosing edges, or useSafeAreaInsets() for exact numbers. Set the status bar's text colour with <StatusBar style=\"light\" /> from expo-status-bar on dark backgrounds (\"dark\" on light ones; \"auto\" follows the theme).",
        webLab: expoLab({
          name: "Wallet",
          layout: bare,
          task:
            "This full-screen wallet has its title under the status bar and its button under the home indicator, and dark status bar text on a dark green background. Use SafeAreaView from react-native-safe-area-context (top and bottom edges) as the page, and set the status bar to light. Check it on both phones.",
          files: { "src/app/index.tsx": SAFE_START },
          solution: { "src/app/index.tsx": SAFE_MODEL },
          tests: [
            { label: "On iPhone the title is below the status bar and the button above the home indicator", check: "return rectOf('Wallet').top >= insets().top && rectOf({ role: 'button', name: 'Send money' }).bottom <= 852 - insets().bottom;", fail: "<SafeAreaView edges={[\"top\", \"bottom\"]} style={styles.page}>" },
            { label: "On Android too", device: { os: "android" }, check: "return rectOf('Wallet').top >= insets().top && rectOf({ role: 'button', name: 'Send money' }).bottom <= 915 - insets().bottom;", fail: "Android is edge-to-edge as well." },
            { label: "Light status bar text on the dark background", check: "return statusBar().style === 'light';", fail: "<StatusBar style=\"light\" />" },
            { label: "SafeAreaView comes from react-native-safe-area-context", check: "return /from \"react-native-safe-area-context\"/.test(code('src/app/index.tsx'));", fail: "import { SafeAreaView } from \"react-native-safe-area-context\";" },
          ],
          hint: "Keep the page's background on the SafeAreaView, so the colour still reaches the edges.",
          successMessage: "Content where fingers and eyes can reach it, on both platforms.",
        }),
      },
      {
        id: "a-md-keyboard",
        title: "Keyboard behaviour",
        explain:
          "When a TextInput is focused, the on-screen keyboard slides up OVER the bottom third of the screen, and anything there (a chat composer, a form's last field, a Submit button) is hidden. KeyboardAvoidingView moves its content out of the way: wrap the screen, style it flex: 1, and choose behavior (\"padding\" adds space at the bottom, the usual choice on iOS; \"height\" shrinks the view, a common choice on Android). Add keyboardVerticalOffset when there is a header above it. Inside a ScrollView, keyboardShouldPersistTaps=\"handled\" lets the user tap a button without first closing the keyboard, and Keyboard.dismiss() closes it. For complex screens, the react-native-keyboard-controller library gives finer control.",
        webLab: expoLab({
          name: "Chat",
          layout: bare,
          task:
            "On the practice phone, tap the message field: the keyboard covers it. Wrap the chat (inside the SafeAreaView) in a KeyboardAvoidingView with flex: 1 and behavior \"padding\" on iOS and \"height\" on Android, so the field and Send stay above the keyboard on both phones.",
          files: { "src/app/index.tsx": CHAT_START },
          solution: { "src/app/index.tsx": CHAT_MODEL },
          tests: [
            { label: "On iPhone, the field stays above the keyboard while typing", check: "await typeInto('Message', 'Yes, it is'); return keyboard().visible && rectOf({ placeholder: 'Message' }).bottom <= keyboardTop();", fail: "Wrap the content in <KeyboardAvoidingView behavior=\"padding\" style={{ flex: 1 }}>." },
            { label: "On Android too", device: { os: "android" }, check: "await typeInto('Message', 'Yes, it is'); return keyboard().visible && rectOf({ placeholder: 'Message' }).bottom <= keyboardTop();", fail: "behavior={Platform.OS === \"ios\" ? \"padding\" : \"height\"}" },
            { label: "Sending still works", check: "await typeInto('Message', 'Can I see it today?'); await press('Send'); return has('Can I see it today?') && inputValue('Message') === '';", fail: "Keep the send function." },
          ],
          hint: "The KeyboardAvoidingView goes inside SafeAreaView and around both the list and the composer.",
          successMessage: "The composer rides above the keyboard, as in every chat app.",
        }),
      },
      {
        id: "a-md-platform",
        title: "Platform-specific behaviour for Android and iOS",
        explain:
          "Most code is shared, but sometimes the platforms need different values. Platform.OS is \"ios\" or \"android\"; Platform.select({ ios: …, android: … }) picks a value. Shadows are the classic case: iOS uses shadowColor, shadowOpacity, shadowRadius and shadowOffset, Android uses elevation (React Native 0.76+ also supports boxShadow on both). For bigger differences, PLATFORM FILES: Button.ios.tsx and Button.tsx: the bundler picks the .ios (or .android) file on that platform and the plain one elsewhere, and TypeScript reads the plain one, so always keep it. Keep differences small and deliberate: behaviour and look that users of each platform expect, not two apps.",
        webLab: expoLab({
          name: "Offers",
          layout: layout("Offers"),
          task:
            "Give the card a shadow on both platforms with Platform.select: on iOS shadowColor \"#000000\", shadowOpacity 0.15, shadowRadius 8 and shadowOffset { width: 0, height: 4 }; on Android elevation 4. Then make the share button platform-specific: create src/components/ShareButton.ios.tsx that uses the iOS-style icon \"share-outline\", while the existing ShareButton.tsx (used on Android) keeps \"share-social\".",
          files: {
            "src/app/index.tsx": PLATFORM_CARD(""),
            "src/components/ShareButton.tsx": SHARE("share-social", "Share"),
            "src/components/ShareButton.ios.tsx": "// The iOS version of ShareButton goes here.\n",
          },
          readOnly: ["src/components/ShareButton.tsx"],
          solution: {
            "src/app/index.tsx": PLATFORM_CARD(`\n    ...Platform.select({\n      ios: { shadowColor: "#000000", shadowOpacity: 0.15, shadowRadius: 8, shadowOffset: { width: 0, height: 4 } },\n      android: { elevation: 4 },\n    }),`),
            "src/components/ShareButton.ios.tsx": SHARE("share-outline", "Share"),
          },
          tests: [
            { label: "On iPhone: a shadow, and the iOS share icon", check: "const s = styleOf({ testID: 'card' }); return s.shadowOpacity === 0.15 && s.shadowRadius === 8 && s.elevation === undefined && icons().includes('share-outline');", fail: "Platform.select({ ios: { shadowOpacity: 0.15, … } }) and ShareButton.ios.tsx with \"share-outline\"." },
            { label: "On Android: elevation, and the Android share icon", device: { os: "android" }, check: "const s = styleOf({ testID: 'card' }); return s.elevation === 4 && s.shadowOpacity === undefined && icons().includes('share-social');", fail: "android: { elevation: 4 }; Android uses the plain ShareButton.tsx." },
            { label: "Both versions are named Share for screen readers", check: "return Boolean(find({ role: 'button', name: 'Share' }));", fail: "Keep accessibilityLabel=\"Share\" in the iOS version." },
          ],
          hint: "Spread the result into the style: ...Platform.select({ ios: {…}, android: {…} }).",
          successMessage: "One codebase, two platforms, each looking the way its users expect.",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════ LESSON 42 · 7.P ═══════════════ */
  {
    id: "md-l42-m7-project",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 7,
    covers: ["7.P"],
    title: "Practical: A Habit Tracker",
    subtitle: "A real screen, built from your own components",
    estimatedMinutes: 90,
    intro: "Everything in this module in one screen: components and props, state, events, a list, an input, styles and layout.",
    atoms: [
      {
        id: "a-md-m7-project",
        title: "Build the habit tracker",
        explain:
          "A habit tracker needs two pieces of state, the list of habits and the text being typed; everything else (how many are done, what the empty list says) is calculated during render. Build the row as its own component that receives a habit and a function to call when it is tapped.",
        webLab: expoLab({
          name: "Habits",
          layout: layout("Habits"),
          task:
            "Build the screen in src/app/index.tsx and a HabitRow component (named export) in src/components/HabitRow.tsx. Start with two habits: \"Drink 8 glasses of water\" (not done) and \"Read for 20 minutes\" (done). Show a header \"Today\" and a summary \"1 of 2 done\". A field labelled \"New habit\" with an \"Add\" button (and the keyboard's Return key) adds a habit, ignoring blank input and clearing the field. Each row (testID \"habit\") is a checkbox (accessibilityRole \"checkbox\", accessibilityState checked, labelled with the habit's name) showing ✓ when done and ○ when not; tapping it toggles it. Use a FlatList.",
          files: {
            "src/app/index.tsx": HABITS_START,
            "src/components/HabitRow.tsx": "// Write the HabitRow component here.\n",
          },
          revealSolution: false,
          solution: { "src/app/index.tsx": HABITS_MODEL, "src/components/HabitRow.tsx": HABIT_ROW_MODEL },
          tests: [
            { label: "Two habits, the header, and \"1 of 2 done\"", check: "return findAll({ testID: 'habit' }).length === 2 && Boolean(find({ role: 'header', name: 'Today' })) && has('1 of 2 done');", fail: "Start from the two habits; calculate the summary from the list." },
            { label: "Rows are checkboxes that show and toggle their state", check: "const water = find({ role: 'checkbox', name: 'Drink 8 glasses of water' }); if (!water || water.getAttribute('aria-checked') !== 'false') return false; await press({ role: 'checkbox', name: 'Drink 8 glasses of water' }); return find({ role: 'checkbox', name: 'Drink 8 glasses of water' }).getAttribute('aria-checked') === 'true' && has('2 of 2 done') && texts().filter((t) => t === '✓').length === 2;", fail: "accessibilityRole=\"checkbox\" accessibilityState={{ checked: done }} and onPress toggling it." },
            { label: "Add adds a habit and clears the field; blank input is ignored", check: "await press('Add'); const blank = findAll({ testID: 'habit' }).length; await typeInto('New habit', 'Walk 5,000 steps'); await press('Add'); return findAll({ testID: 'habit' }).length === blank + 1 && has('Walk 5,000 steps') && inputValue('New habit') === '' && hasText('of ' + (blank + 1) + ' done');", fail: "Trim the draft, ignore it if empty, add { id, name, done: false }, clear the draft." },
            { label: "Return on the keyboard adds too", check: "await typeInto('New habit', 'Stretch'); await submit('New habit'); return has('Stretch');", fail: "onSubmitEditing={add}" },
            { label: "The row is its own component, in a FlatList", check: "return /export function HabitRow/.test(code('src/components/HabitRow.tsx')) && /<FlatList/.test(code('src/app/index.tsx')) && /HabitRow/.test(code('src/app/index.tsx'));", fail: "export function HabitRow(…) and render it from FlatList's renderItem." },
          ],
          hint: "Give HabitRow an onToggle prop; the screen decides what toggling means.",
          successMessage: "A complete screen from your own components. Run it on your phone next.",
        }),
      },
    ],
    task: {
      title: "Module 7 practical: the habit tracker, on your phone",
      intro: "Build the same screen in your own project and use it for a day.",
      prompts: [
        "Recreate the habit tracker in your Expo project, with HabitRow in src/components/.",
        "Add a long press on a habit that asks (with Alert.alert) whether to delete it.",
        "Show a different colour for completed habits and a celebration message when all are done.",
        "Run it on an Android phone and an iPhone if you can, including with the keyboard open and in dark mode, and note every difference you see.",
        "Mastery checkpoint: explain why the screen re-renders when you tick a habit, and what changes on Android compared with iOS.",
      ],
      closing: "Next: Module 8, turning working screens into polished interfaces.",
    },
    requirements: { read: true, video: false, assessment: true },
  },
];
