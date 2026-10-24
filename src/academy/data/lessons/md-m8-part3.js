/**
 * MOBILE APP DEVELOPMENT · MODULE 8 · BUILDING POLISHED MOBILE INTERFACES (part 3)
 *
 * Curriculum 8.10 – 8.P: accessibility labels and touch-friendly controls,
 * screen sizes and orientation, and the polished-dashboard practical.
 *
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 */

import { appJson, expoLab } from "./md-helpers.js";
import { MODULE, SECTION_ID, layout } from "./md-m8-part1.js";

const TOOLBAR_START = `import Ionicons from "@expo/vector-icons/Ionicons";
import { useState } from "react";
import { Pressable, StyleSheet, Switch, Text, View } from "react-native";

export default function Editor() {
  const [bold, setBold] = useState(false);
  const [autosave, setAutosave] = useState(true);
  return (
    <View style={styles.page}>
      <View style={styles.toolbar}>
        <Pressable onPress={() => setBold((b) => !b)} style={styles.tool}>
          <Ionicons name="text" size={20} color="#0f172a" />
        </Pressable>
        <Pressable style={styles.tool}>
          <Ionicons name="image-outline" size={20} color="#0f172a" />
        </Pressable>
        <Pressable style={styles.tool}>
          <Ionicons name="trash-outline" size={20} color="#b91c1c" />
        </Pressable>
      </View>
      <Text style={[styles.body, bold && { fontWeight: "700" }]}>Meeting notes for Friday</Text>
      <View style={styles.row}>
        <Text>Autosave</Text>
        <Switch value={autosave} onValueChange={setAutosave} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, padding: 16, gap: 16 },
  toolbar: { flexDirection: "row", gap: 4 },
  tool: { padding: 6, borderRadius: 8, backgroundColor: "#f1f5f9" },
  body: { fontSize: 16 },
  row: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", minHeight: 48 },
});
`;

const TOOLBAR_MODEL = `import Ionicons from "@expo/vector-icons/Ionicons";
import { useState } from "react";
import { Pressable, StyleSheet, Switch, Text, View } from "react-native";

export default function Editor() {
  const [bold, setBold] = useState(false);
  const [autosave, setAutosave] = useState(true);
  return (
    <View style={styles.page}>
      <View style={styles.toolbar}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Bold"
          accessibilityState={{ selected: bold }}
          onPress={() => setBold((b) => !b)}
          style={styles.tool}
        >
          <Ionicons name="text" size={20} color="#0f172a" />
        </Pressable>
        <Pressable accessibilityRole="button" accessibilityLabel="Insert image" style={styles.tool}>
          <Ionicons name="image-outline" size={20} color="#0f172a" />
        </Pressable>
        <Pressable accessibilityRole="button" accessibilityLabel="Delete note" accessibilityHint="Deletes this note permanently" style={styles.tool}>
          <Ionicons name="trash-outline" size={20} color="#b91c1c" />
        </Pressable>
      </View>
      <Text style={[styles.body, bold && { fontWeight: "700" }]}>Meeting notes for Friday</Text>
      <View style={styles.row}>
        <Text>Autosave</Text>
        <Switch accessibilityLabel="Autosave" value={autosave} onValueChange={setAutosave} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, padding: 16, gap: 16 },
  toolbar: { flexDirection: "row", gap: 8 },
  tool: { width: 48, height: 48, alignItems: "center", justifyContent: "center", borderRadius: 8, backgroundColor: "#f1f5f9" },
  body: { fontSize: 16 },
  row: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", minHeight: 48 },
});
`;

const PLAYER = (landscapeRule) => `import { StyleSheet, Text, useWindowDimensions, View } from "react-native";

export default function Lesson() {
  const { width, height } = useWindowDimensions();
  const wide = ${landscapeRule};
  return (
    <View style={[styles.page, { flexDirection: wide ? "row" : "column" }]}>
      <View style={[styles.video, wide ? { flex: 2, height: "100%" } : { width: "100%", aspectRatio: 16 / 9 }]} testID="video">
        <Text style={styles.play}>▶</Text>
      </View>
      <View style={[styles.details, wide && { flex: 1 }]} testID="details">
        <Text style={styles.title}>Lesson 12: Flexbox</Text>
        <Text>Rows, columns and the space between them.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1 },
  video: { backgroundColor: "#0f172a", alignItems: "center", justifyContent: "center" },
  play: { color: "#fff", fontSize: 40 },
  details: { padding: 16, gap: 6 },
  title: { fontSize: 20, fontWeight: "700" },
});
`;

/* ── The practical: a dashboard app with four tabs ───────────────────── */
const ROOT = `import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}
`;

const TABS = `import Ionicons from "@expo/vector-icons/Ionicons";
import { Tabs } from "expo-router";

// The tab bar passes its colour as a plain string, which is what Ionicons expects.
export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: "#0f766e" }}>
      <Tabs.Screen name="index" options={{ title: "Dashboard", tabBarIcon: ({ color, size }) => <Ionicons name="grid-outline" color={color as string} size={size} /> }} />
      <Tabs.Screen name="people" options={{ title: "People", tabBarIcon: ({ color, size }) => <Ionicons name="people-outline" color={color as string} size={size} /> }} />
      <Tabs.Screen name="profile" options={{ title: "Profile", tabBarIcon: ({ color, size }) => <Ionicons name="person-outline" color={color as string} size={size} /> }} />
      <Tabs.Screen name="settings" options={{ title: "Settings", tabBarIcon: ({ color, size }) => <Ionicons name="settings-outline" color={color as string} size={size} /> }} />
    </Tabs>
  );
}
`;

const PEOPLE_DATA = `export type Person = { id: string; name: string; role: string };

export const PEOPLE: Person[] = [
  { id: "1", name: "Amaka Eze", role: "Designer" },
  { id: "2", name: "Bola Ade", role: "Developer" },
  { id: "3", name: "Femi Ojo", role: "Developer" },
  { id: "4", name: "Ngozi Uche", role: "Product manager" },
  { id: "5", name: "Tunde Bakare", role: "Support" },
];

export const STATS = [
  { label: "Orders today", value: "128" },
  { label: "Revenue", value: "₦2.4m" },
  { label: "New customers", value: "17" },
];
`;

const PRACTICAL_CARD = `import type { ReactNode } from "react";
import { StyleSheet, View } from "react-native";

export function Card({ children, testID }: { children: ReactNode; testID?: string }) {
  return (
    <View style={styles.card} testID={testID}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { padding: 16, borderRadius: 16, backgroundColor: "#ffffff", gap: 4, boxShadow: "0 2px 8px rgba(15, 23, 42, 0.08)" },
});
`;

const PRACTICAL_DASH = `import { ScrollView, StyleSheet, Text } from "react-native";
import { Card } from "@/components/Card";
import { STATS } from "@/data/team";

export default function Dashboard() {
  return (
    <ScrollView contentContainerStyle={styles.page}>
      <Text accessibilityRole="header" style={styles.greeting}>
        Good morning, Ada
      </Text>
      {STATS.map((s) => (
        <Card key={s.label} testID="stat">
          <Text style={styles.label}>{s.label}</Text>
          <Text style={styles.value}>{s.value}</Text>
        </Card>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { padding: 16, gap: 12, backgroundColor: "#f8fafc" },
  greeting: { fontSize: 24, fontWeight: "700" },
  label: { color: "#475569" },
  value: { fontSize: 28, fontWeight: "700", color: "#0f766e" },
});
`;

const PRACTICAL_PEOPLE = `import { useState } from "react";
import { FlatList, StyleSheet, Text, TextInput, View } from "react-native";
import { PEOPLE } from "@/data/team";

export default function People() {
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();
  const visible = PEOPLE.filter((p) => p.name.toLowerCase().includes(q) || p.role.toLowerCase().includes(q));
  return (
    <View style={styles.page}>
      <TextInput accessibilityLabel="Search people" placeholder="Search people" value={query} onChangeText={setQuery} style={styles.search} />
      <FlatList
        data={visible}
        keyExtractor={(p) => p.id}
        renderItem={({ item }) => (
          <View style={styles.row} testID="person">
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.role}>{item.role}</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>No one matches "{query.trim()}"</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1 },
  search: { margin: 12, minHeight: 48, borderRadius: 24, paddingHorizontal: 16, backgroundColor: "#f1f5f9", fontSize: 16 },
  row: { paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderColor: "#e2e8f0" },
  name: { fontSize: 16, fontWeight: "600" },
  role: { color: "#64748b" },
  empty: { padding: 24, textAlign: "center", color: "#64748b" },
});
`;

const PRACTICAL_PROFILE = `import { Image, StyleSheet, Text, View } from "react-native";

export default function Profile() {
  return (
    <View style={styles.page}>
      <Image source={require("@/assets/images/avatar.png")} style={styles.avatar} accessibilityLabel="Ada Obi's photo" />
      <Text style={styles.name}>Ada Obi</Text>
      <Text style={styles.role}>Operations lead · Lagos</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, alignItems: "center", padding: 24, gap: 6 },
  avatar: { width: 96, height: 96, borderRadius: 48 },
  name: { fontSize: 22, fontWeight: "700" },
  role: { color: "#64748b" },
});
`;

const PRACTICAL_SETTINGS = `import { useState } from "react";
import { Pressable, StyleSheet, Switch, Text, View } from "react-native";

const SIZES = ["Small", "Medium", "Large"] as const;

export default function Settings() {
  const [notifications, setNotifications] = useState(true);
  const [size, setSize] = useState<(typeof SIZES)[number]>("Medium");
  return (
    <View style={styles.page}>
      <View style={styles.row}>
        <Text style={styles.label}>Notifications</Text>
        <Switch accessibilityLabel="Notifications" value={notifications} onValueChange={setNotifications} />
      </View>
      <Text style={styles.label}>Text size</Text>
      <View style={styles.options}>
        {SIZES.map((s) => (
          <Pressable key={s} accessibilityRole="radio" accessibilityState={{ checked: s === size }} accessibilityLabel={s} onPress={() => setSize(s)} style={[styles.option, s === size && styles.optionOn]}>
            <Text style={s === size ? styles.optionTextOn : undefined}>{s}</Text>
          </Pressable>
        ))}
      </View>
      <Text>{notifications ? "You will get order alerts." : "Order alerts are off."}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, padding: 16, gap: 12 },
  row: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", minHeight: 48 },
  label: { fontSize: 16, fontWeight: "600" },
  options: { flexDirection: "row", gap: 8 },
  option: { minHeight: 48, paddingHorizontal: 16, borderRadius: 24, justifyContent: "center", backgroundColor: "#f1f5f9" },
  optionOn: { backgroundColor: "#0f766e" },
  optionTextOn: { color: "#ffffff", fontWeight: "700" },
});
`;

const stub = (name) => `import { Text, View } from "react-native";\n\nexport default function ${name}() {\n  return (\n    <View>\n      <Text>${name}</Text>\n    </View>\n  );\n}\n`;

export const PART3 = [
  /* ═══════════════ LESSON 47 · 8.10 – 8.11 ═══════════════ */
  {
    id: "md-l47-a11y-orientation",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 5,
    covers: ["8.10", "8.11"],
    title: "Accessible Controls, Sizes and Orientation",
    subtitle: "Controls everyone can use, on every screen size and both orientations",
    estimatedMinutes: 50,
    intro: "Polish is not only how a screen looks. It is whether everyone can use it, however they hold the phone.",
    atoms: [
      {
        id: "a-md-a11y-labels",
        title: "Accessibility labels and touch-friendly controls",
        explain:
          "Every control needs four things for VoiceOver and TalkBack: a ROLE (accessibilityRole=\"button\", \"switch\", \"checkbox\", \"tab\", \"header\"), a NAME (accessibilityLabel, essential for icon-only buttons), its STATE (accessibilityState={{ selected, checked, disabled }}) and, for anything surprising, a HINT (accessibilityHint=\"Deletes this note permanently\"). Make every target at least 48 × 48 and keep 8 between neighbours. Group related text into one element with accessible on the parent so it is read in one go. Test with VoiceOver and TalkBack: swipe through the screen and listen.",
        webLab: expoLab({
          name: "Notes",
          layout: layout("Editor"),
          task:
            "Make the editor's controls accessible. Each toolbar button needs the button role and a name: \"Bold\" (reporting selected when bold is on), \"Insert image\" and \"Delete note\" (with the hint \"Deletes this note permanently\"). Make each 48 × 48 with 8 between them. Name the switch \"Autosave\".",
          files: { "src/app/index.tsx": TOOLBAR_START },
          solution: { "src/app/index.tsx": TOOLBAR_MODEL },
          tests: [
            { label: "Three named buttons", check: "return ['Bold', 'Insert image', 'Delete note'].every((n) => find({ role: 'button', name: n }));", fail: "accessibilityRole=\"button\" and accessibilityLabel on each Pressable." },
            { label: "Bold reports whether it is selected", check: "const before = find({ role: 'button', name: 'Bold' }).getAttribute('aria-selected'); await press({ role: 'button', name: 'Bold' }); return before === 'false' && find({ role: 'button', name: 'Bold' }).getAttribute('aria-selected') === 'true';", fail: "accessibilityState={{ selected: bold }}" },
            { label: "Delete explains what it does", check: "const d = find({ role: 'button', name: 'Delete note' }); return /Deletes this note permanently/.test(d.getAttribute('aria-description') || '') || /accessibilityHint=\"Deletes this note permanently\"/.test(code('src/app/index.tsx'));", fail: "accessibilityHint=\"Deletes this note permanently\"" },
            { label: "Every target is 48 × 48, 8 apart, and the switch is named", check: "const ok = ['Bold', 'Insert image', 'Delete note'].every((n) => { const s = tapSize({ role: 'button', name: n }); return s.width >= 48 && s.height >= 48; }); const gap = rectOf({ role: 'button', name: 'Insert image' }).left - rectOf({ role: 'button', name: 'Bold' }).right; return ok && gap >= 8 && Boolean(find({ label: 'Autosave' }));", fail: "width: 48, height: 48; gap: 8; accessibilityLabel=\"Autosave\" on the Switch." },
          ],
          hint: "A screen reader says the label, then the role, then the state: \"Bold, button, selected\".",
          successMessage: "Every control named, sized and stated. VoiceOver and TalkBack users can edit notes too.",
        }),
      },
      {
        id: "a-md-orientation",
        title: "Handling different screen sizes and orientations",
        explain:
          "app.json's \"orientation\" decides whether the app rotates: \"portrait\" (the template's default) locks it, \"default\" lets it follow the phone. Rotate only where it helps (video, reading, tablets), and when you do, use the extra width: put content side by side when the screen is wider than it is tall (width > height from useWindowDimensions), keep controls clear of the camera cut-out (safe-area insets move to the sides in landscape), and keep the user's place when the layout changes. expo-screen-orientation can lock or unlock individual screens.",
        webLab: expoLab({
          name: "Learn",
          app: { orientation: "portrait" },
          editable: ["app.json"],
          layout: layout("Lesson"),
          task:
            "Let the lesson screen rotate: set \"orientation\" to \"default\" in app.json. Then in src/app/index.tsx make wide decide the layout from the screen's shape: wide when the width is greater than the height, so in landscape the video (testID \"video\") and the details (testID \"details\") sit side by side.",
          files: { "src/app/index.tsx": PLAYER("false") },
          solution: { "src/app/index.tsx": PLAYER("width > height"), "app.json": appJson("Learn", { orientation: "default" }) },
          tests: [
            { label: "The app is allowed to rotate", check: "return config().orientation === 'default';", fail: "\"orientation\": \"default\" in app.json." },
            { label: "In portrait the details are below the video", check: "return rectOf({ testID: 'details' }).top >= rectOf({ testID: 'video' }).bottom - 1;", fail: "Not wide in portrait: a column." },
            { label: "In landscape they sit side by side", device: { orientation: "landscape" }, check: "const v = rectOf({ testID: 'video' }), d = rectOf({ testID: 'details' }); return d.left >= v.right - 1 && Math.abs(d.top - v.top) < 2;", fail: "const wide = width > height;" },
          ],
          hint: "useWindowDimensions already gives you width and height, and re-renders on rotation.",
          successMessage: "A screen that uses the width it is given, in both orientations.",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════ LESSON 48 · 8.P ═══════════════ */
  {
    id: "md-l48-m8-project",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 6,
    covers: ["8.P"],
    title: "Practical: A Polished Dashboard",
    subtitle: "A dashboard, a searchable list, a profile and settings, from reusable components",
    estimatedMinutes: 120,
    intro: "This practical brings the module together in a small four-tab app. The tab layout is given; every screen and component is yours.",
    atoms: [
      {
        id: "a-md-m8-project",
        title: "Build the dashboard app",
        explain:
          "Four screens in src/app/(tabs)/, built from components in src/components/ and data in src/data/team.ts. Aim for the polish of this module: consistent spacing and colours, readable text, 48-point targets, named controls, and every list's empty state.",
        webLab: expoLab({
          name: "Team",
          layout: ROOT,
          task:
            "Build the four tabs. Dashboard (index): a header \"Good morning, Ada\" and one Card (your component in src/components/Card.tsx, named export, testID \"stat\" on each) per item of STATS showing its label and value. People: a field labelled \"Search people\" filtering PEOPLE by name or role (case-insensitive), each person a row (testID \"person\") with name and role, and No one matches \"<query>\" when empty. Profile: Ada Obi's photo (require(\"@/assets/images/avatar.png\"), labelled \"Ada Obi's photo\"), her name and \"Operations lead · Lagos\". Settings: a Switch labelled \"Notifications\" (on at first) with a line saying \"You will get order alerts.\" or \"Order alerts are off.\", and three text-size choices (Small, Medium, Large) as radio buttons (accessibilityRole \"radio\", checked state), Medium chosen at first.",
          files: {
            "src/app/(tabs)/index.tsx": stub("Dashboard"),
            "src/app/(tabs)/people.tsx": stub("People"),
            "src/app/(tabs)/profile.tsx": stub("Profile"),
            "src/app/(tabs)/settings.tsx": stub("Settings"),
            "src/components/Card.tsx": "// Write and export Card here.\n",
            "src/app/(tabs)/_layout.tsx": TABS,
            "src/data/team.ts": PEOPLE_DATA,
          },
          readOnly: ["src/app/(tabs)/_layout.tsx", "src/data/team.ts"],
          revealSolution: false,
          solution: {
            "src/app/(tabs)/index.tsx": PRACTICAL_DASH,
            "src/app/(tabs)/people.tsx": PRACTICAL_PEOPLE,
            "src/app/(tabs)/profile.tsx": PRACTICAL_PROFILE,
            "src/app/(tabs)/settings.tsx": PRACTICAL_SETTINGS,
            "src/components/Card.tsx": PRACTICAL_CARD,
          },
          tests: [
            { label: "Dashboard: the greeting and three stat cards", check: "return Boolean(find({ role: 'header', name: 'Good morning, Ada' })) && findAll({ testID: 'stat' }).length === 3 && has('₦2.4m') && has('Orders today') && /export function Card/.test(code('src/components/Card.tsx'));", fail: "STATS.map(…) into your Card component." },
            { label: "People: search by name or role, with an empty state", check: "await press('People'); await waitFor(() => find({ label: 'Search people' }), 2000); const all = findAll({ testID: 'person' }).length; await typeInto('Search people', 'DEVELOPER'); const devs = findAll({ testID: 'person' }).length; await typeInto('Search people', 'zzz'); return all === 5 && devs === 2 && has('No one matches \"zzz\"');", fail: "Filter on name or role, lower-cased; ListEmptyComponent for no match." },
            { label: "Profile: photo, name and role", check: "await press('Profile'); await waitFor(() => has('Ada Obi'), 2000); return Boolean(find({ label: \"Ada Obi's photo\" })) && has('Operations lead · Lagos');", fail: "Image with accessibilityLabel \"Ada Obi's photo\", then the name and role." },
            { label: "Settings: the switch and its message", check: "await press('Settings'); await waitFor(() => find({ label: 'Notifications' }), 2000); const on = has('You will get order alerts.'); await toggle({ label: 'Notifications' }); return on && has('Order alerts are off.');", fail: "Switch value={notifications}; the message follows it." },
            { label: "Settings: text size is a radio group, Medium first", check: "await press('Settings'); await waitFor(() => find({ role: 'radio', name: 'Medium' }), 2000); const first = find({ role: 'radio', name: 'Medium' }).getAttribute('aria-checked') === 'true'; await press({ role: 'radio', name: 'Large' }); return first && find({ role: 'radio', name: 'Large' }).getAttribute('aria-checked') === 'true' && find({ role: 'radio', name: 'Medium' }).getAttribute('aria-checked') === 'false';", fail: "accessibilityRole=\"radio\" accessibilityState={{ checked: s === size }}" },
          ],
          hint: "Build one tab at a time and check it on the phone before moving on.",
          successMessage: "A small, polished app: consistent, accessible, every state designed.",
        }),
      },
    ],
    task: {
      title: "Module 8 practical: polish your own dashboard",
      intro: "Build a dashboard for something you care about (a shop, a club, your savings) in your own project.",
      prompts: [
        "Create Button, Card and TextField components with variants and states, and use only them on your screens.",
        "Support light and dark mode with a Colors token file and a useTheme hook, and check contrast in both.",
        "Add a searchable list with an empty state, a loading skeleton and an error state.",
        "Test on the smallest and largest phone you can find, in both orientations and with the largest text size, and with VoiceOver or TalkBack.",
        "Mastery checkpoint: show your dashboard on a small Android phone and a large iPhone, in light and dark mode, and use every control with a screen reader.",
      ],
      closing: "Next: Module 9, navigation and multi-screen apps with Expo Router.",
    },
    requirements: { read: true, video: false, assessment: true },
  },
];
