/**
 * MOBILE APP DEVELOPMENT · MODULE 5 · UI/UX PRINCIPLES FOR MOBILE APPS
 *
 * Curriculum 5.1 – 5.P. User-centred design, needs and use cases, personas
 * and journeys, information architecture, wireframes and Figma, visual
 * hierarchy, mobile-first design, touch targets, accessibility, forms,
 * interface states and platform conventions.
 *
 * Design is judged on the phone. The labs' screens are given and read their
 * look and words from files the learner edits (a theme of design tokens,
 * content, messages, validation rules), and the checks measure the RENDERED
 * screen: real text contrast against what is painted behind it, real tap
 * target sizes, real accessible names, real font sizes.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

import { expoLab } from "./md-helpers.js";

export const SECTION_ID = "md-s5-uiux";
const MODULE = "md-m5-uiux";

const layout = (title) => `import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "${title}" }} />
    </Stack>
  );
}
`;

/* ── The journey-map lab ─────────────────────────────────────────────── */
const JOURNEY_SCREEN = `import { ScrollView, StyleSheet, Text, View } from "react-native";
import { persona, journey } from "@/content/research";

export default function Screen() {
  return (
    <ScrollView contentContainerStyle={styles.page}>
      <Text style={styles.h1}>{persona.name}, {persona.age}</Text>
      <Text>{persona.situation}</Text>
      <Text style={styles.h2}>Goal</Text>
      <Text>{persona.goal}</Text>
      <Text style={styles.h2}>Frustrations</Text>
      {persona.frustrations.map((f) => (
        <Text key={f}>• {f}</Text>
      ))}
      <Text style={styles.h2}>Journey</Text>
      {journey.map((step, i) => (
        <View key={i} style={styles.step}>
          <Text style={styles.stepTitle}>
            {i + 1}. {step.stage}: {step.action}
          </Text>
          <Text>Feels: {step.feeling}</Text>
          {step.opportunity ? <Text style={styles.idea}>Idea: {step.opportunity}</Text> : null}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { padding: 20, gap: 6 },
  h1: { fontSize: 22, fontWeight: "700" },
  h2: { fontSize: 17, fontWeight: "700", marginTop: 12 },
  step: { padding: 12, borderRadius: 10, backgroundColor: "#f1f5f4", gap: 2 },
  stepTitle: { fontWeight: "600" },
  idea: { color: "#0f766e" },
});
`;

/* ── The menu (information architecture) lab ─────────────────────────── */
const MENU_SCREEN = `import { ScrollView, StyleSheet, Text, View } from "react-native";
import { tabs, sections } from "@/content/navigation";

export default function Screen() {
  return (
    <View style={styles.page}>
      <ScrollView contentContainerStyle={styles.list}>
        {sections.map((section) => (
          <View key={section.title} style={styles.section}>
            <Text style={styles.sectionTitle} accessibilityRole="header">
              {section.title}
            </Text>
            {section.items.map((item) => (
              <Text key={item} style={styles.item}>
                {item}
              </Text>
            ))}
          </View>
        ))}
      </ScrollView>
      <View style={styles.tabBar} accessibilityRole="tablist">
        {tabs.map((tab) => (
          <Text key={tab} style={styles.tab} accessibilityRole="tab">
            {tab}
          </Text>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1 },
  list: { padding: 16, gap: 16 },
  section: { gap: 4 },
  sectionTitle: { fontSize: 13, fontWeight: "700", color: "#475569", textTransform: "uppercase" },
  item: { fontSize: 16, padding: 12, borderRadius: 8, backgroundColor: "#f8fafc" },
  tabBar: { flexDirection: "row", borderTopWidth: 1, borderColor: "#e2e8f0", paddingBottom: 24 },
  tab: { flex: 1, textAlign: "center", paddingVertical: 12, fontSize: 12 },
});
`;

/* ── The theme (visual design) lab ───────────────────────────────────── */
const PRODUCT_SCREEN = `import { Pressable, StyleSheet, Text, View } from "react-native";
import { theme } from "@/constants/theme";

export default function Screen() {
  return (
    <View style={[styles.page, { backgroundColor: theme.colors.background, padding: theme.space.screen, gap: theme.space.gap }]}>
      <Text style={{ fontSize: theme.type.title, fontWeight: "700", color: theme.colors.text }}>Wireless earbuds</Text>
      <Text style={{ fontSize: theme.type.price, fontWeight: "700", color: theme.colors.primary }}>₦24,500</Text>
      <Text style={{ fontSize: theme.type.body, color: theme.colors.muted, lineHeight: theme.type.body * 1.5 }}>
        Twenty hours of battery, a case that charges in an hour, and a fit that stays put on a bumpy danfo ride.
      </Text>
      <Pressable accessibilityRole="button" style={[styles.button, { backgroundColor: theme.colors.primary, borderRadius: theme.radius }]}>
        <Text style={{ color: theme.colors.onPrimary, fontSize: theme.type.body, fontWeight: "700" }}>Add to cart</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1 },
  button: { minHeight: 48, alignItems: "center", justifyContent: "center" },
});
`;

/* ── Touch targets and accessibility labs ────────────────────────────── */
const PLAYER_SCREEN = `import { Pressable, StyleSheet, Text, View } from "react-native";
import { controls, sizes } from "@/constants/controls";

export default function Screen() {
  return (
    <View style={styles.page}>
      <Text style={styles.title}>Now playing: Ọmọ Ìyá</Text>
      <View style={[styles.row, { gap: sizes.gap }]}>
        {controls.map((c) => (
          <Pressable
            key={c.id}
            accessibilityRole="button"
            accessibilityLabel={c.label}
            style={[styles.control, { width: sizes.icon + sizes.padding * 2, height: sizes.icon + sizes.padding * 2 }]}
          >
            <Text style={{ fontSize: sizes.icon }}>{c.icon}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, padding: 24, gap: 24, alignItems: "center", justifyContent: "center" },
  title: { fontSize: 18, fontWeight: "600" },
  row: { flexDirection: "row", alignItems: "center" },
  control: { borderRadius: 999, backgroundColor: "#e2e8f0", alignItems: "center", justifyContent: "center" },
});
`;

const NEWS_SCREEN = `import { Pressable, StyleSheet, Text, View } from "react-native";
import { article, actions, text } from "@/content/article";

export default function Screen() {
  return (
    <View style={styles.page}>
      <Text accessibilityRole="header" style={{ fontSize: text.headline, fontWeight: "700" }}>
        {article.headline}
      </Text>
      <Text style={{ fontSize: text.body, lineHeight: text.body * 1.5, color: text.bodyColor }}>{article.body}</Text>
      <View style={styles.actions}>
        {actions.map((a) => (
          <Pressable key={a.icon} accessibilityRole="button" accessibilityLabel={a.label} style={styles.action}>
            <Text style={styles.icon}>{a.icon}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, padding: 20, gap: 14, backgroundColor: "#ffffff" },
  actions: { flexDirection: "row", gap: 12 },
  action: { minWidth: 48, minHeight: 48, borderRadius: 24, backgroundColor: "#f1f5f9", alignItems: "center", justifyContent: "center" },
  icon: { fontSize: 20 },
});
`;

/* ── Form and states labs ────────────────────────────────────────────── */
const SIGNUP_SCREEN = `import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { validateSignup } from "@/lib/validate";

const FIELDS = [
  { key: "name", label: "Full name", keyboard: "default" },
  { key: "phone", label: "Phone number", keyboard: "phone-pad" },
  { key: "pin", label: "4-digit PIN", keyboard: "number-pad", secure: true },
];

export default function Screen() {
  const [values, setValues] = useState({ name: "", phone: "", pin: "" });
  const [errors, setErrors] = useState({});
  const [done, setDone] = useState(false);

  function submit() {
    const found = validateSignup(values);
    setErrors(found);
    setDone(Object.keys(found).length === 0);
  }

  return (
    <View style={styles.page}>
      {FIELDS.map((f) => (
        <View key={f.key} style={styles.field}>
          <Text style={styles.label}>{f.label}</Text>
          <TextInput
            accessibilityLabel={f.label}
            value={values[f.key]}
            onChangeText={(t) => setValues((v) => ({ ...v, [f.key]: t }))}
            keyboardType={f.keyboard}
            secureTextEntry={f.secure}
            style={[styles.input, errors[f.key] ? styles.inputError : null]}
          />
          {errors[f.key] ? <Text style={styles.error}>{errors[f.key]}</Text> : null}
        </View>
      ))}
      <Pressable accessibilityRole="button" onPress={submit} style={styles.button}>
        <Text style={styles.buttonText}>Create account</Text>
      </Pressable>
      {done ? <Text style={styles.success}>Account created. Welcome!</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, padding: 20, gap: 14 },
  field: { gap: 4 },
  label: { fontWeight: "600" },
  input: { minHeight: 48, borderWidth: 1, borderColor: "#cbd5e1", borderRadius: 10, paddingHorizontal: 12, fontSize: 16 },
  inputError: { borderColor: "#b91c1c" },
  error: { color: "#b91c1c" },
  button: { minHeight: 48, borderRadius: 10, backgroundColor: "#0f766e", alignItems: "center", justifyContent: "center" },
  buttonText: { color: "#fff", fontWeight: "700", fontSize: 16 },
  success: { color: "#15803d", fontWeight: "600" },
});
`;

const ORDERS_SCREEN = `import { Pressable, StyleSheet, Text, View } from "react-native";
import { screenFor } from "@/lib/states";

const CASES = [
  { name: "Loading", state: { status: "loading" } },
  { name: "Empty", state: { status: "done", orders: [] } },
  { name: "Error", state: { status: "error", error: "Network request failed" } },
  { name: "Success", state: { status: "done", orders: [{ id: 1 }, { id: 2 }] } },
];

export default function Screen() {
  return (
    <View style={styles.page}>
      {CASES.map(({ name, state }) => {
        const view = screenFor(state);
        return (
          <View key={name} style={styles.card} testID={name}>
            <Text style={styles.kind}>{name}</Text>
            <Text style={styles.title}>{view.title}</Text>
            {view.message ? <Text>{view.message}</Text> : null}
            {view.action ? (
              <Pressable accessibilityRole="button" style={styles.button}>
                <Text style={styles.buttonText}>{view.action}</Text>
              </Pressable>
            ) : null}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, padding: 16, gap: 10 },
  card: { padding: 12, borderRadius: 10, backgroundColor: "#f8fafc", gap: 4 },
  kind: { fontSize: 12, color: "#64748b", textTransform: "uppercase" },
  title: { fontSize: 16, fontWeight: "700" },
  button: { alignSelf: "flex-start", minHeight: 44, paddingHorizontal: 16, borderRadius: 8, backgroundColor: "#0f766e", justifyContent: "center" },
  buttonText: { color: "#fff", fontWeight: "600" },
});
`;

/* ── The practical: a flawed checkout screen ─────────────────────────── */
const CHECKOUT_SCREEN = `import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { copy, look } from "@/design/checkout";
import { checkAddress } from "@/design/rules";

export default function Screen() {
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");
  const [placed, setPlaced] = useState(false);

  function place() {
    const problem = checkAddress(address);
    setError(problem ?? "");
    setPlaced(!problem);
  }

  return (
    <View style={[styles.page, { backgroundColor: look.background }]}>
      <Text accessibilityRole="header" style={{ fontSize: look.titleSize, fontWeight: "700", color: look.text }}>
        {copy.title}
      </Text>
      <Text style={{ fontSize: look.bodySize, color: look.muted }}>{copy.summary}</Text>
      <Text style={{ fontSize: look.bodySize, color: look.text, fontWeight: "600" }}>{copy.addressLabel}</Text>
      <TextInput
        accessibilityLabel={copy.addressLabel}
        placeholder={copy.addressPlaceholder}
        value={address}
        onChangeText={setAddress}
        style={[styles.input, { fontSize: look.bodySize }]}
      />
      {error ? <Text style={{ color: look.error, fontSize: look.bodySize }}>{error}</Text> : null}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={copy.payLabel}
        onPress={place}
        style={{ backgroundColor: look.primary, minHeight: look.buttonHeight, borderRadius: 10, alignItems: "center", justifyContent: "center" }}
      >
        <Text style={{ color: look.onPrimary, fontSize: look.bodySize, fontWeight: "700" }}>{copy.payButton}</Text>
      </Pressable>
      {placed ? <Text style={{ color: look.success, fontSize: look.bodySize }}>{copy.success}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, padding: 20, gap: 12 },
  input: { minHeight: 48, borderWidth: 1, borderColor: "#94a3b8", borderRadius: 10, paddingHorizontal: 12 },
});
`;

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 19 · 5.1 – 5.3
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "md-l19-user-centred",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 1,
    covers: ["5.1", "5.2", "5.3"],
    title: "Designing for Real People",
    subtitle: "User-centred design, needs and use cases, personas and journeys",
    estimatedMinutes: 40,
    intro: "Good apps start from people, not from features. Before any screen is drawn, a team learns who will use the app, in what situation, and what they are trying to get done.",

    atoms: [
      {
        id: "a-md-ucd",
        title: "User-centred design",
        explain:
          "USER-CENTRED DESIGN means making decisions from evidence about real users, again and again: research (talk to users, watch them), design (sketch a solution), test it with users, learn, and repeat. Its enemy is designing for yourself: you know the app, its jargon and where everything is; your users do not. Five short conversations with real users, or watching three people try a paper prototype, will show you more problems than a week of debating in the team. Phones add their own reality: people use apps with one thumb, on a bus, in sunlight, with a poor connection, while interrupted, so design for the situation, not just the screen.",
        decision: {
          scenario: "Your team is building a pharmacy delivery app. The founder says: \"I know what users want, because I use pharmacies. Skip research and build.\"",
          question: "What is the most user-centred next step?",
          options: [
            { id: "a", text: "Spend a few days interviewing and observing real customers and pharmacists, then sketch and test a prototype with them", why: "Cheap research now prevents expensive rework later. The founder is one user, with one situation." },
            { id: "b", text: "Build every feature the founder wants and see what happens", whyWrong: "That is designing for one person and finding out what is wrong after building it." },
            { id: "c", text: "Copy the biggest competitor exactly", whyWrong: "Competitors may serve different users or have problems of their own." },
            { id: "d", text: "Run a survey asking people which features they want", whyWrong: "People are poor at predicting what they would use; watching them do the task tells you more." },
          ],
          correct: "a",
          aftermath: "You are not your user. Find out who is.",
        },
      },
      {
        id: "a-md-needs-use-cases",
        title: "Understanding user needs and use cases",
        explain:
          "A NEED is the underlying problem (\"I must refill my mother's blood-pressure medicine before it runs out\"), not a feature (\"a reminder button\"). A USE CASE describes one person reaching one goal: who, in what situation, doing what steps, with what result (\"A daughter in Abuja orders her mother's monthly prescription for delivery to Enugu, pays by transfer, and tracks it\"). Writing needs and use cases first keeps you from building features nobody uses, and gives you the test for every screen: does it help someone finish one of these use cases faster or with less doubt?",
        decision: {
          scenario: "In interviews, three customers of a small bank say: \"I want a dark mode.\" When you watch them use the app, all three get stuck finding their account number to share with someone sending them money.",
          question: "Which is the stronger need to design for first?",
          options: [
            { id: "a", text: "Sharing the account number easily: a real task they fail at today", why: "Observed failure at a core task outweighs a stated preference. A \"share account details\" action solves a need; dark mode is a nice-to-have." },
            { id: "b", text: "Dark mode, because users asked for it", whyWrong: "What people ask for and what they need are different; behaviour is better evidence." },
            { id: "c", text: "Both are equal", whyWrong: "One blocks a core task, the other does not." },
            { id: "d", text: "Neither: users do not know what they want", whyWrong: "They showed you exactly what they need, by struggling." },
          ],
          correct: "a",
          aftermath: "Watch what people do. It tells you what they need.",
        },
      },
      {
        id: "a-md-personas-journeys",
        title: "User personas and user journeys",
        explain:
          "A PERSONA is a short, research-based portrait of a typical user: name, situation, goals, frustrations, the phone and connection they have. It keeps the team designing for someone specific. A USER JOURNEY (journey map) follows that persona through one goal, step by step: what they do at each STAGE (discover, sign up, first use, repeat use), what they FEEL, and the OPPORTUNITIES to make it better. Base both on what you learned in research, not on guesses, and keep them short enough to read in a minute. In the lab, you write one for a savings app; the phone shows it as the team would see it.",
        webLab: expoLab({
          name: "Research",
          layout: layout("Persona and journey"),
          task:
            "Complete src/content/research.js for a group-savings (esusu/ajo) app. The persona needs a name, an age (a number), a situation sentence, a goal and at least two frustrations. The journey needs at least four steps, each with a stage, an action and a feeling; at least two steps need an opportunity (an idea to make that step better). The first stage must be \"Discover\" and the last \"Repeat\".",
          files: {
            "src/content/research.js": `export const persona = {
  name: "",
  age: 0,
  situation: "",
  goal: "",
  frustrations: [],
};

// Each step: { stage, action, feeling, opportunity? }
export const journey = [];
`,
            "src/app/index.js": JOURNEY_SCREEN,
          },
          readOnly: ["src/app/index.js"],
          solution: {
            "src/content/research.js": `export const persona = {
  name: "Mama Bisi",
  age: 46,
  situation: "Runs a provisions stall in Oyingbo market and collects ajo for eight other traders.",
  goal: "Know who has paid this week without going through her notebook.",
  frustrations: ["Members dispute what they paid", "The notebook got wet in the rainy season", "Collecting cash is unsafe"],
};

// Each step: { stage, action, feeling, opportunity? }
export const journey = [
  { stage: "Discover", action: "Hears about the app from her daughter", feeling: "Curious but wary of fees" },
  { stage: "Sign up", action: "Creates a group and adds members by phone number", feeling: "Unsure she is doing it right", opportunity: "Show a three-step checklist while she sets up" },
  { stage: "First collection", action: "Sees who has paid by transfer this week", feeling: "Relieved" },
  { stage: "Payout", action: "Releases this week's money to one member", feeling: "Nervous about mistakes", opportunity: "Ask for confirmation and show the member's name and amount" },
  { stage: "Repeat", action: "Checks the group every Friday", feeling: "Confident" },
];
`,
          },
          tests: [
            { label: "The persona is complete", check: "const { persona: p } = load('src/content/research.js'); return p.name.trim().length > 1 && typeof p.age === 'number' && p.age > 0 && p.situation.trim().length > 10 && p.goal.trim().length > 5 && p.frustrations.length >= 2 && has(`${p.name}, ${p.age}`);", fail: "Fill in every field, with at least two frustrations." },
            { label: "The journey has at least four complete steps, from Discover to Repeat", check: "const { journey: j } = load('src/content/research.js'); return j.length >= 4 && j.every((s) => s.stage && s.action && s.feeling) && j[0].stage === 'Discover' && j[j.length - 1].stage === 'Repeat';", fail: "Each step needs a stage, an action and a feeling." },
            { label: "At least two steps suggest an opportunity, shown on the phone", check: "const { journey: j } = load('src/content/research.js'); const ideas = j.filter((s) => s.opportunity && s.opportunity.trim().length > 5); return ideas.length >= 2 && has(`Idea: ${ideas[0].opportunity}`);", fail: "Add an opportunity to the steps where the persona struggles." },
          ],
          hint: "Write the feelings honestly: the uncomfortable ones are where the opportunities are.",
          successMessage: "A persona and a journey the whole team can read in a minute, and design from.",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 20 · 5.4 – 5.6
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "md-l20-structure",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 2,
    covers: ["5.4", "5.5", "5.6"],
    title: "Structure, Wireframes and Figma",
    subtitle: "Organising content, sketching screens, then designing them properly",
    estimatedMinutes: 45,
    intro: "Once you know your users, you decide what goes where. Structure comes first, then rough sketches, and only then polished designs.",

    atoms: [
      {
        id: "a-md-ia",
        title: "Information architecture",
        explain:
          "INFORMATION ARCHITECTURE (IA) is how an app's content and features are organised and labelled so people can find them. On a phone the top level is small: a bottom tab bar has room for three to five destinations (both Apple and Google say so), so put the most frequent tasks there and group the rest under clear headings, often in a Profile or More tab. Label things in your users' words, not your company's (\"Send money\", not \"P2P transfers\"). Card sorting (users group feature names into piles) and tree testing (users find items in your proposed structure) tell you whether your IA works before you design screens.",
        webLab: expoLab({
          name: "Bank Menu",
          layout: layout("Menu"),
          task:
            "This banking app's menu is a mess: nine tabs and jargon. Reorganise src/content/navigation.js: tabs must have 3 to 5 entries and must include \"Home\" and \"Send money\"; every other feature must appear in exactly one of the sections, with no feature lost or repeated; and replace the jargon labels with plain ones: \"P2P transfer\" becomes \"Send money\", \"KYC\" becomes \"Verify your identity\" and \"Biller payments\" becomes \"Pay bills\". Each section needs a title and at least two items.",
          files: {
            "src/content/navigation.js": `// The tab bar at the bottom of the app.
export const tabs = ["Home", "P2P transfer", "Biller payments", "Airtime", "Cards", "Loans", "Savings", "KYC", "Settings"];

// Everything else, grouped under headings.
export const sections = [];
`,
            "src/app/index.js": MENU_SCREEN,
          },
          readOnly: ["src/app/index.js"],
          solution: {
            "src/content/navigation.js": `// The tab bar at the bottom of the app.
export const tabs = ["Home", "Send money", "Pay bills", "Cards"];

// Everything else, grouped under headings.
export const sections = [
  { title: "Money", items: ["Airtime", "Savings", "Loans"] },
  { title: "Account", items: ["Verify your identity", "Settings"] },
];
`,
          },
          tests: [
            { label: "Three to five tabs, including Home and Send money", check: "const { tabs } = load('src/content/navigation.js'); return tabs.length >= 3 && tabs.length <= 5 && tabs.includes('Home') && tabs.includes('Send money') && findAll({ role: 'tab' }).length === tabs.length;", fail: "Keep the most frequent destinations as tabs, and no more than five." },
            { label: "No jargon left anywhere", check: "const { tabs, sections } = load('src/content/navigation.js'); const all = [...tabs, ...sections.flatMap((s) => s.items)]; return !all.some((x) => ['P2P transfer', 'KYC', 'Biller payments'].includes(x)) && all.includes('Verify your identity') && all.includes('Pay bills');", fail: "Rename P2P transfer, KYC and Biller payments." },
            { label: "Every feature appears exactly once", check: "const { tabs, sections } = load('src/content/navigation.js'); const all = [...tabs, ...sections.flatMap((s) => s.items)]; const want = ['Home', 'Send money', 'Pay bills', 'Airtime', 'Cards', 'Loans', 'Savings', 'Verify your identity', 'Settings']; return all.length === want.length && want.every((w) => all.filter((x) => x === w).length === 1);", fail: "Nine features in total: none lost, none repeated." },
            { label: "Every section has a title and at least two items, shown as headings", check: "const { sections } = load('src/content/navigation.js'); return sections.length >= 1 && sections.every((s) => s.title && s.items.length >= 2) && findAll({ role: 'header' }).length === sections.length;", fail: "Group the remaining features under clear section titles." },
          ],
          hint: "Ask: which three or four things will most customers do most days? Those are the tabs.",
          successMessage: "Fewer, clearer choices in your users' words. That is information architecture.",
        }),
      },
      {
        id: "a-md-wireframes",
        title: "Wireframing and low-fidelity prototypes",
        explain:
          "A WIREFRAME is a rough sketch of a screen's layout: boxes, labels and lines, no colours, no real images. It answers \"what is on this screen, and in what order?\" quickly and cheaply, and because it looks unfinished, people criticise it honestly. A LOW-FIDELITY PROTOTYPE links wireframes so someone can \"tap\" through a task: paper sketches you swap by hand, or rough frames linked in Figma. Test one with three to five users, asking them to complete a task while thinking aloud, before anyone opens a code editor. Changing a sketch takes minutes; changing a built screen takes days.",
        decision: {
          scenario: "You have a new idea for the checkout flow. A designer offers to make polished, pixel-perfect screens in Figma first, over a week.",
          question: "What is the better first step?",
          options: [
            { id: "a", text: "Sketch rough wireframes of the flow and test them with a few users this week", why: "Low fidelity is fast to change and invites honest feedback about the flow itself, which is what you need to learn first." },
            { id: "b", text: "Make the polished design first so users are impressed", whyWrong: "Polish distracts testers into commenting on colours, and makes the team reluctant to throw work away." },
            { id: "c", text: "Build it in code straight away", whyWrong: "Code is the slowest, most expensive place to discover the flow is wrong." },
            { id: "d", text: "Skip testing: the flow is obvious", whyWrong: "It is obvious to you because you designed it." },
          ],
          correct: "a",
          aftermath: "Sketch, test, learn, and only then polish.",
        },
      },
      {
        id: "a-md-figma",
        title: "High-fidelity interface design using Figma",
        explain:
          "FIGMA is the tool most product teams design in (free to start, in the browser or a desktop app). A HIGH-FIDELITY design looks like the finished app: real text, colours, type, icons and spacing. Work in FRAMES sized to real phones (Figma's presets include iPhone and Android sizes). Build with AUTO LAYOUT (Figma's version of Flexbox, which React Native also uses, Module 7), reusable COMPONENTS with VARIANTS (a Button with primary, secondary and disabled states), and shared STYLES or VARIABLES for colours, text and spacing: the same \"design tokens\" your code will use. Link frames into an interactive PROTOTYPE to test, and hand off with Dev Mode, which shows developers sizes, colours and spacing. Community kits for iOS and Material Design save hours.",
        decision: {
          scenario: "A designer hands you a Figma file. The same blue is typed in as a hex code on forty different layers, and every button is a separate group of shapes.",
          question: "What will make this design easiest to build and keep consistent?",
          options: [
            { id: "a", text: "Turn the colours into shared colour styles (tokens) and the buttons into one component with variants", why: "Tokens and components in Figma map directly to a theme file and a Button component in code, so one change updates everything." },
            { id: "b", text: "Copy each hex code into the code wherever it appears", whyWrong: "Forty copies drift apart; changing the brand colour becomes a hunt." },
            { id: "c", text: "Export every screen as an image and use the images in the app", whyWrong: "Images cannot respond to touch, text size or screen size." },
            { id: "d", text: "Ignore the design and build what you like", whyWrong: "The design is how the team agreed what to build." },
          ],
          correct: "a",
          aftermath: "Design tokens and components in Figma become a theme and components in code.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 21 · 5.7 – 5.8
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "md-l21-visual",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 3,
    covers: ["5.7", "5.8"],
    title: "Visual Design on a Small Screen",
    subtitle: "Hierarchy, spacing, type and colour; and designing mobile-first",
    estimatedMinutes: 45,
    intro: "On a phone, every pixel counts and people glance rather than read. Visual design is how you tell them, at a glance, what matters on the screen.",

    atoms: [
      {
        id: "a-md-hierarchy",
        title: "Layout hierarchy, spacing, typography and colour",
        explain:
          "HIERARCHY tells the eye what to look at first: the most important thing is biggest, boldest or most colourful, and there should be ONE such thing per screen (usually the main action). Use a TYPE SCALE of a few sizes (for example 28 for titles, 20 for prices, 16 for body text, 13 for captions) and never set body text below 16 on a phone. SPACING on a consistent grid (multiples of 4 or 8: 8, 16, 24) groups related things and separates others. COLOUR: one primary colour for actions, neutrals for text and backgrounds, red only for errors, and enough CONTRAST: WCAG asks for at least 4.5:1 for normal text and 3:1 for large text. Keep all of these as design TOKENS in one theme file, so the whole app stays consistent. In the lab, the screen reads its look from src/constants/theme.js.",
        webLab: expoLab({
          name: "Product Page",
          layout: layout("Product"),
          task:
            "Fix src/constants/theme.js so the product page has a clear hierarchy and readable text. The title must be the largest text, the price second, and body text at least 16. Spacing values must be on an 8-point grid (multiples of 8, at least 16 for the screen padding). The body text must have a contrast ratio of at least 4.5 against the background, and the button's label at least 4.5 against the button.",
          files: {
            "src/constants/theme.js": `export const theme = {
  colors: {
    background: "#ffffff",
    text: "#1f2937",
    muted: "#c4c4c4",
    primary: "#7dd3c0",
    onPrimary: "#ffffff",
  },
  type: { title: 18, price: 26, body: 13 },
  space: { screen: 10, gap: 7 },
  radius: 12,
};
`,
            "src/app/index.js": PRODUCT_SCREEN,
          },
          readOnly: ["src/app/index.js"],
          solution: {
            "src/constants/theme.js": `export const theme = {
  colors: {
    background: "#ffffff",
    text: "#1f2937",
    muted: "#475569",
    primary: "#0f766e",
    onPrimary: "#ffffff",
  },
  type: { title: 28, price: 22, body: 16 },
  space: { screen: 24, gap: 16 },
  radius: 12,
};
`,
          },
          tests: [
            { label: "Title is the largest text, then the price, and body text is at least 16", check: "return fontSize('Wireless earbuds') > fontSize('₦24,500') && fontSize('₦24,500') > fontSize({ text: /Twenty hours/ }) && fontSize({ text: /Twenty hours/ }) >= 16;", fail: "type: title biggest, then price, body at least 16." },
            { label: "Spacing is on an 8-point grid", check: "const { theme } = load('src/constants/theme.js'); return [theme.space.screen, theme.space.gap].every((v) => v % 8 === 0) && theme.space.screen >= 16;", fail: "Use multiples of 8: 16, 24, 32." },
            { label: "Body text has a contrast ratio of at least 4.5", check: "return contrastOf({ text: /Twenty hours/ }) >= 4.5;", fail: "#c4c4c4 on white is about 1.7:1. Choose a darker grey." },
            { label: "The button label has a contrast ratio of at least 4.5", check: "return contrastOf('Add to cart') >= 4.5;", fail: "White on a pale teal is too faint: darken the primary colour." },
          ],
          hint: "Contrast is about lightness: dark text on light backgrounds, or white text on dark buttons.",
          successMessage: "The eye now goes title, price, button. And everyone can read it, in sunlight too.",
        }),
      },
      {
        id: "a-md-mobile-first",
        title: "Mobile-first design principles",
        explain:
          "MOBILE-FIRST means designing for the smallest, hardest case first: a narrow screen, one thumb, a slow connection, divided attention. It forces priorities: one main task per screen, the most important content at the top, actions within reach of the thumb (the bottom half of the screen), forms that ask for as little as possible, and content that loads fast. Larger screens then get more space, not more clutter. Design for interruption too: a call or a notification can arrive mid-task, so save the user's progress and let them pick up where they left off.",
        decision: {
          scenario: "A delivery app's order screen puts the \"Track order\" button at the very top of the screen, next to a large banner advert, with the order details below.",
          question: "What would a mobile-first redesign change?",
          options: [
            { id: "a", text: "Put the order status and \"Track order\" first, drop the banner, and place the main action within thumb reach near the bottom", why: "One primary task, content in order of importance, and the main action where a thumb can reach it." },
            { id: "b", text: "Make the banner bigger", whyWrong: "It competes with the task users came to do." },
            { id: "c", text: "Add more buttons to the top bar", whyWrong: "More choices at the hardest-to-reach edge makes it worse." },
            { id: "d", text: "Nothing: users can scroll", whyWrong: "Every scroll and stretch on a phone is effort; design should reduce it." },
          ],
          correct: "a",
          aftermath: "Start from the phone, the thumb and the single most important task.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 22 · 5.9 – 5.10
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "md-l22-touch-a11y",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 4,
    covers: ["5.9", "5.10"],
    title: "Touch and Accessibility",
    subtitle: "Targets fingers can hit, gestures people can discover, and apps everyone can use",
    estimatedMinutes: 45,
    intro: "A finger is not a mouse pointer, and not everyone sees, hears or moves the same way. This lesson is about designing for both.",

    atoms: [
      {
        id: "a-md-touch-targets",
        title: "Touch targets and gesture-friendly interfaces",
        explain:
          "Fingertips are big and imprecise. Apple's guidelines ask for touch targets of at least 44 × 44 points; Google's Material Design asks for at least 48 × 48 dp; React Native's units are those points and dp, so a Pressable 48 high and 48 wide meets both. The visible icon can be smaller than the target: add padding around it. Leave space between targets (at least 8) so people do not hit the wrong one. GESTURES (swipe to delete, pull to refresh, long press) are invisible, so never make them the only way to do something: always offer a visible button too, and follow platform habits (swipe back from the left edge on iOS, the back gesture or button on Android).",
        webLab: expoLab({
          name: "Player",
          layout: layout("Player"),
          task:
            "The music controls are too small to hit reliably and too close together. Change src/constants/controls.js so every control is at least 48 × 48 (on Android, Material's minimum, and so also above iOS's 44) without making the icons bigger than 24: increase the padding instead. Put at least 12 between the controls.",
          files: {
            "src/constants/controls.js": `export const controls = [
  { id: "prev", icon: "⏮", label: "Previous track" },
  { id: "play", icon: "▶", label: "Play" },
  { id: "next", icon: "⏭", label: "Next track" },
];

export const sizes = { icon: 20, padding: 4, gap: 2 };
`,
            "src/app/index.js": PLAYER_SCREEN,
          },
          readOnly: ["src/app/index.js"],
          solution: {
            "src/constants/controls.js": `export const controls = [
  { id: "prev", icon: "⏮", label: "Previous track" },
  { id: "play", icon: "▶", label: "Play" },
  { id: "next", icon: "⏭", label: "Next track" },
];

export const sizes = { icon: 20, padding: 14, gap: 16 };
`,
          },
          tests: [
            { label: "Every control is at least 48 × 48 on Android", device: { os: "android" }, check: "return ['Previous track', 'Play', 'Next track'].every((l) => { const s = tapSize({ label: l }); return s.width >= 48 && s.height >= 48; });", fail: "Padding adds to the size on every side: icon + 2 × padding ≥ 48." },
            { label: "...and at least 44 × 44 on iPhone", check: "return ['Previous track', 'Play', 'Next track'].every((l) => { const s = tapSize({ label: l }); return s.width >= 44 && s.height >= 44; });", fail: "Increase the padding." },
            { label: "Icons stay at 24 or smaller", check: "return load('src/constants/controls.js').sizes.icon <= 24;", fail: "Make the target bigger, not the icon." },
            { label: "At least 12 between controls", check: "const a = rectOf({ label: 'Previous track' }), b = rectOf({ label: 'Play' }); return b.left - a.right >= 12;", fail: "Raise sizes.gap." },
          ],
          hint: "With an icon of 20, a padding of 14 gives 20 + 14 + 14 = 48.",
          successMessage: "Targets a thumb can hit first time, on both platforms, with the icons unchanged.",
        }),
      },
      {
        id: "a-md-accessibility",
        title: "Accessibility and readable text",
        explain:
          "Many of your users have a disability: low vision, colour blindness, tremors, or simply reading glasses left at home. Screen readers (VoiceOver on iPhone, TalkBack on Android) read the screen aloud, so every control needs an ACCESSIBLE NAME (in React Native, accessibilityLabel) that says what it does (\"Share article\", not \"Button\" or an emoji), and a ROLE (button, header, link). Make text readable: at least 16 for body text, enough contrast, and let it grow with the phone's text-size setting. Never use colour alone to carry meaning (add an icon or word to \"red means error\"), and test with your screen reader turned on: it takes five minutes and finds the worst problems.",
        webLab: expoLab({
          name: "News",
          layout: layout("Article"),
          task:
            "Make the article screen accessible by editing src/content/article.js. Every action button shows only an emoji, and their labels are useless: give each a label that says what it does (\"Share article\", \"Save article\" and \"Read aloud\"). Raise the body text to at least 16 and the headline to at least 24, and darken the body colour to a contrast of at least 4.5 on white.",
          files: {
            "src/content/article.js": `export const article = {
  headline: "Lagos opens its first solar-powered market",
  body: "Traders in Mile 12 now keep fruit fresh for days in cold rooms that run on the sun, and pay less than they did for generator fuel.",
};

export const actions = [
  { icon: "📤", label: "Button" },
  { icon: "🔖", label: "Button" },
  { icon: "🔊", label: "Button" },
];

export const text = { headline: 20, body: 12, bodyColor: "#9ca3af" };
`,
            "src/app/index.js": NEWS_SCREEN,
          },
          readOnly: ["src/app/index.js"],
          solution: {
            "src/content/article.js": `export const article = {
  headline: "Lagos opens its first solar-powered market",
  body: "Traders in Mile 12 now keep fruit fresh for days in cold rooms that run on the sun, and pay less than they did for generator fuel.",
};

export const actions = [
  { icon: "📤", label: "Share article" },
  { icon: "🔖", label: "Save article" },
  { icon: "🔊", label: "Read aloud" },
];

export const text = { headline: 26, body: 17, bodyColor: "#374151" };
`,
          },
          tests: [
            { label: "Each action has a name that says what it does", check: "return ['Share article', 'Save article', 'Read aloud'].every((n) => find({ role: 'button', name: n }));", fail: "Labels: Share article, Save article, Read aloud." },
            { label: "Body text at least 16, headline at least 24", check: "return fontSize({ text: /Traders in Mile 12/ }) >= 16 && fontSize({ role: 'header' }) >= 24;", fail: "Raise text.body and text.headline." },
            { label: "Body text contrast at least 4.5", check: "return contrastOf({ text: /Traders in Mile 12/ }) >= 4.5;", fail: "#9ca3af on white is about 2.5:1. Use a darker grey." },
          ],
          hint: "A label is what a screen reader says. Read each one aloud: would you know what the button does?",
          successMessage: "Now a VoiceOver or TalkBack user hears \"Share article, button\", and everyone can read the story.",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 23 · 5.11 – 5.13
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "md-l23-forms-states",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 5,
    covers: ["5.11", "5.12", "5.13"],
    title: "Forms, States and Platform Conventions",
    subtitle: "Asking for input kindly, never leaving users guessing, and feeling at home on each platform",
    estimatedMinutes: 50,
    intro: "Forms and waiting are where users give up. This lesson covers the design of both, and the habits Android and iPhone users expect.",

    atoms: [
      {
        id: "a-md-form-design",
        title: "Form design and validation",
        explain:
          "Ask for as little as possible: every extra field loses users. Put a visible LABEL above each field (placeholders vanish when typing starts), choose the right KEYBOARD (a number pad for a PIN, a phone pad for a phone number), and group related fields. VALIDATE kindly: check when the user leaves a field or submits, show the message next to the field it is about, and say how to fix it (\"Enter your 11-digit phone number, starting with 0\"), not just that it is wrong (\"Invalid input\"). Never clear what they typed after an error. Validation in the app is for helping the user; the server must still check everything (Module 15). In the lab you write the rules and messages for a sign-up form.",
        webLab: expoLab({
          name: "Sign Up",
          layout: layout("Create account"),
          task:
            "Write validateSignup(values) in src/lib/validate.js. It returns an object of error messages keyed by field, empty when everything is valid. name: required (after trimming), message \"Enter your full name\". phone: must be 11 digits starting with 0 (spaces allowed and ignored), message \"Enter your 11-digit phone number, starting with 0\". pin: exactly 4 digits, but not four of the same digit (such as 1111), messages \"Your PIN must be 4 digits\" and \"Choose a PIN that is harder to guess\".",
          files: {
            "src/lib/validate.js": `export function validateSignup(values) {
  const errors = {};
  return errors;
}
`,
            "src/app/index.js": SIGNUP_SCREEN,
          },
          readOnly: ["src/app/index.js"],
          solution: {
            "src/lib/validate.js": `export function validateSignup(values) {
  const errors = {};
  if (!values.name.trim()) {
    errors.name = "Enter your full name";
  }
  const phone = values.phone.replace(/\\s/g, "");
  if (!/^0\\d{10}$/.test(phone)) {
    errors.phone = "Enter your 11-digit phone number, starting with 0";
  }
  if (!/^\\d{4}$/.test(values.pin)) {
    errors.pin = "Your PIN must be 4 digits";
  } else if (/^(\\d)\\1{3}$/.test(values.pin)) {
    errors.pin = "Choose a PIN that is harder to guess";
  }
  return errors;
}
`,
          },
          tests: [
            { label: "Submitting an empty form shows a helpful message under each field", check: "await press('Create account'); return has('Enter your full name') && has('Enter your 11-digit phone number, starting with 0') && has('Your PIN must be 4 digits') && !has('Account created. Welcome!');", fail: "Add a message for each empty field." },
            { label: "A phone number with spaces is accepted; a short one is not", check: "const { validateSignup } = load('src/lib/validate.js'); const ok = validateSignup({ name: 'Ada', phone: '0803 123 4567', pin: '4821' }); const bad = validateSignup({ name: 'Ada', phone: '080312', pin: '4821' }); return Object.keys(ok).length === 0 && bad.phone === 'Enter your 11-digit phone number, starting with 0';", fail: "Remove spaces, then test for 0 followed by ten digits." },
            { label: "A PIN like 1111 is refused with its own message", check: "const { validateSignup } = load('src/lib/validate.js'); return validateSignup({ name: 'A', phone: '08031234567', pin: '1111' }).pin === 'Choose a PIN that is harder to guess' && validateSignup({ name: 'A', phone: '08031234567', pin: '12a4' }).pin === 'Your PIN must be 4 digits';", fail: "Check the format first, then repeated digits." },
            { label: "A valid form creates the account, and what was typed is kept", check: "await typeInto('Full name', 'Ada Obi'); await typeInto('Phone number', '0803 123 4567'); await typeInto('4-digit PIN', '4821'); await press('Create account'); return has('Account created. Welcome!') && inputValue('Full name') === 'Ada Obi';", fail: "Return an empty object when everything is valid." },
          ],
          hint: "A regular expression like /^0\\d{10}$/ means: starts with 0, then exactly ten digits, then ends.",
          successMessage: "Messages that say how to fix the problem, next to the field it is about.",
        }),
      },
      {
        id: "a-md-states",
        title: "Empty states, error states, loading indicators and success messages",
        explain:
          "Every screen that shows data has more states than the happy one. LOADING: show it at once (a spinner, or a skeleton shaped like the content), and keep it short. EMPTY: a blank screen looks broken; say why it is empty and what to do (\"No orders yet. Your orders will appear here.\" with a \"Start shopping\" button). ERROR: say what happened in plain words and how to recover (\"Can't connect. Check your internet and try again.\" with Try again). SUCCESS: confirm that an action worked (\"Order placed\") so people do not tap twice. Design all four for every screen, in Figma and in code.",
        webLab: expoLab({
          name: "Orders",
          layout: layout("Orders: every state"),
          task:
            "Write screenFor(state) in src/lib/states.js. It returns { title, message, action } for an orders screen (message and action may be null). Loading (status \"loading\"): title \"Loading your orders…\", no action. Empty (status \"done\" with no orders): title \"No orders yet\", message \"Your orders will appear here.\", action \"Start shopping\". Error: title \"Can't load your orders\", message \"Check your internet connection and try again.\", action \"Try again\". Success: title \"N orders\" (such as \"2 orders\", or \"1 order\" for one), no action.",
          files: {
            "src/lib/states.js": `export function screenFor(state) {
  return { title: "", message: null, action: null };
}
`,
            "src/app/index.js": ORDERS_SCREEN,
          },
          readOnly: ["src/app/index.js"],
          solution: {
            "src/lib/states.js": `export function screenFor(state) {
  if (state.status === "loading") {
    return { title: "Loading your orders…", message: null, action: null };
  }
  if (state.status === "error") {
    return { title: "Can't load your orders", message: "Check your internet connection and try again.", action: "Try again" };
  }
  const count = state.orders.length;
  if (count === 0) {
    return { title: "No orders yet", message: "Your orders will appear here.", action: "Start shopping" };
  }
  return { title: \`\${count} \${count === 1 ? "order" : "orders"}\`, message: null, action: null };
}
`,
          },
          tests: [
            { label: "Loading says what is loading, with no button", check: "const v = load('src/lib/states.js').screenFor({ status: 'loading' }); return v.title === 'Loading your orders…' && !v.action;", fail: "status \"loading\": title \"Loading your orders…\"" },
            { label: "Empty explains and offers a way forward", check: "const v = load('src/lib/states.js').screenFor({ status: 'done', orders: [] }); return v.title === 'No orders yet' && v.message === 'Your orders will appear here.' && v.action === 'Start shopping' && has('Start shopping');", fail: "An empty list is not an error: say why it is empty and what to do." },
            { label: "Error explains and offers Try again", check: "const v = load('src/lib/states.js').screenFor({ status: 'error', error: 'x' }); return v.title === \"Can't load your orders\" && v.action === 'Try again' && has('Try again');", fail: "Plain words, and a way to recover." },
            { label: "Success counts the orders, in the singular for one", check: "const f = load('src/lib/states.js').screenFor; return f({ status: 'done', orders: [{}, {}] }).title === '2 orders' && f({ status: 'done', orders: [{}] }).title === '1 order' && has('2 orders');", fail: "\"1 order\" but \"2 orders\"." },
          ],
          hint: "Check loading and error first; then you know there are orders to count.",
          successMessage: "Four states, all designed. Your users are never left looking at a blank screen.",
        }),
      },
      {
        id: "a-md-platform-conventions",
        title: "Platform conventions for Android and iOS",
        explain:
          "Android users and iPhone users have different habits, and an app that ignores them feels foreign. NAVIGATION: Android has a system Back (a gesture or button) that must always work; iOS relies on a back arrow at the top left and a swipe from the left edge. TITLES: iOS often uses large, left-aligned titles that shrink as you scroll; Android's Material uses a top app bar. CONTROLS: iOS uses switches and action sheets that slide up; Android uses Material switches, snackbars and bottom sheets. ALERTS: iOS buttons sit side by side, Android's are text buttons at the bottom right. React Native and Expo Router give you the native versions of most of these for free, and Platform.select lets you adjust the rest (Module 7). Keep your brand (colours, type, icons) the same across both, and follow each platform's behaviour. Reference: Apple's Human Interface Guidelines and Google's Material Design 3.",
        decision: {
          scenario: "Your app shows a custom \"Back\" button at the bottom of every screen, and on Android it ignores the system back gesture, which closes the whole app instead.",
          question: "What should you do?",
          options: [
            { id: "a", text: "Use the platform's own back navigation: the header back arrow and swipe on iOS, the system back on Android", why: "Users' muscle memory is per platform. Expo Router's stack does both correctly, including Android's back button." },
            { id: "b", text: "Keep the custom button and tell users to use it", whyWrong: "People will keep using the system back and lose their place." },
            { id: "c", text: "Hide the Android back gesture", whyWrong: "You cannot, and should not: it is part of the platform." },
            { id: "d", text: "Make both platforms work exactly like iOS", whyWrong: "Android users expect their system back to work." },
          ],
          correct: "a",
          aftermath: "Same brand on both platforms; each platform's own behaviour.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 24 · 5.P
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "md-l24-m5-project",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 6,
    covers: ["5.P"],
    title: "Practical: A Usability Fix",
    subtitle: "Find and fix what makes a real screen hard to use",
    estimatedMinutes: 60,
    intro: "Designers review screens built by others all the time. This checkout screen has at least six usability and accessibility problems. Find them, and fix them without touching the screen's code.",

    atoms: [
      {
        id: "a-md-m5-project",
        title: "Fix the checkout screen",
        explain:
          "Look at the screen as three different users: someone with poor eyesight in bright sunlight, someone using a screen reader, and someone in a hurry who makes a typo. Everything you need to change is in two files: src/design/checkout.js (the words and the look) and src/design/rules.js (the address check and its message).",
        webLab: expoLab({
          name: "Checkout",
          layout: layout("Checkout"),
          task:
            "Fix the checkout screen. The title must be at least 24 and the body text at least 16. The summary text and the button label need a contrast of at least 4.5. The pay button must be at least 48 high, and its accessible name must say what it does and how much (\"Pay ₦24,500\"), matching its visible text. The address field needs a visible label in plain words (\"Delivery address\"). An address shorter than 10 characters must give a message that explains how to fix it (it must mention the street), not \"Invalid\". And a successful order must say so: \"Order placed. We'll text you when it's on the way.\"",
          files: {
            "src/design/checkout.js": `export const copy = {
  title: "Checkout",
  summary: "1 × Wireless earbuds · ₦24,500",
  addressLabel: "Addr",
  addressPlaceholder: "e.g. 12 Broad Street, Lagos Island",
  payButton: "Go",
  payLabel: "Button",
  success: "OK",
};

export const look = {
  background: "#ffffff",
  text: "#111827",
  muted: "#d1d5db",
  primary: "#86efac",
  onPrimary: "#ffffff",
  error: "#b91c1c",
  success: "#15803d",
  titleSize: 18,
  bodySize: 12,
  buttonHeight: 32,
};
`,
            "src/design/rules.js": `// Returns null when the address is fine, or a message saying what to fix.
export function checkAddress(address) {
  if (address.trim().length < 10) {
    return "Invalid";
  }
  return null;
}
`,
            "src/app/index.js": CHECKOUT_SCREEN,
          },
          readOnly: ["src/app/index.js"],
          revealSolution: false,
          solution: {
            "src/design/checkout.js": `export const copy = {
  title: "Checkout",
  summary: "1 × Wireless earbuds · ₦24,500",
  addressLabel: "Delivery address",
  addressPlaceholder: "e.g. 12 Broad Street, Lagos Island",
  payButton: "Pay ₦24,500",
  payLabel: "Pay ₦24,500",
  success: "Order placed. We'll text you when it's on the way.",
};

export const look = {
  background: "#ffffff",
  text: "#111827",
  muted: "#4b5563",
  primary: "#15803d",
  onPrimary: "#ffffff",
  error: "#b91c1c",
  success: "#15803d",
  titleSize: 26,
  bodySize: 16,
  buttonHeight: 52,
};
`,
            "src/design/rules.js": `// Returns null when the address is fine, or a message saying what to fix.
export function checkAddress(address) {
  if (address.trim().length < 10) {
    return "Enter your full delivery address, including the street and area";
  }
  return null;
}
`,
          },
          tests: [
            { label: "Readable sizes: title at least 24, body at least 16", check: "return fontSize({ role: 'header' }) >= 24 && fontSize({ text: /Wireless earbuds/ }) >= 16;", fail: "Raise titleSize and bodySize." },
            { label: "Summary and button label have a contrast of at least 4.5", check: "const label = load('src/design/checkout.js').copy.payButton; return contrastOf({ text: /Wireless earbuds/ }) >= 4.5 && contrastOf(label) >= 4.5;", fail: "Darken the muted grey and the button colour." },
            { label: "The pay button is at least 48 high, and named for what it does", check: "const b = find({ role: 'button', name: 'Pay ₦24,500' }); return Boolean(b) && tapSize({ role: 'button', name: 'Pay ₦24,500' }).height >= 48 && has('Pay ₦24,500');", fail: "payButton and payLabel: \"Pay ₦24,500\"; buttonHeight at least 48." },
            { label: "The address field has a plain, visible label", check: "return has('Delivery address') && Boolean(find({ label: 'Delivery address' }));", fail: "addressLabel: \"Delivery address\"." },
            { label: "A short address explains how to fix it", check: "await typeInto('Delivery address', 'Lagos'); await press({ role: 'button', name: 'Pay ₦24,500' }); const msg = load('src/design/rules.js').checkAddress('Lagos'); return msg && msg !== 'Invalid' && /street/i.test(msg) && has(msg);", fail: "Say what to include, for example the street and area." },
            { label: "A good address places the order and says so", check: "await typeInto('Delivery address', '12 Broad Street, Lagos Island'); await press({ role: 'button', name: 'Pay ₦24,500' }); return has(\"Order placed. We'll text you when it's on the way.\");", fail: "copy.success: \"Order placed. We'll text you when it's on the way.\"" },
          ],
          hint: "Go through the screen three times: once squinting, once reading only the labels aloud, once typing a bad address.",
          successMessage: "Six problems fixed without changing a line of the screen's code. That is the value of tokens and content files.",
        }),
      },
    ],
    task: {
      title: "Module 5 practical: persona, journey and a usability review",
      intro: "Apply the module to an app idea of your own, and to an app on your phone.",
      prompts: [
        "Pick an app idea for someone you know. Talk to two people who would use it, then write a persona and a five-step user journey from what they said.",
        "Sketch wireframes of the three most important screens on paper, and test them with one of those people: ask them to complete a task while you watch.",
        "Turn on VoiceOver (iPhone) or TalkBack (Android) and use one of your everyday apps for five minutes. Write down three problems a screen-reader user would meet.",
        "Mastery checkpoint: look at any screen on your phone and explain what makes it easy or hard to use, with a reason a user would recognise.",
      ],
      closing: "Next: Module 6, planning every screen of an app and how users move between them.",
    },
    requirements: { read: true, video: false, assessment: true },
  },
];
