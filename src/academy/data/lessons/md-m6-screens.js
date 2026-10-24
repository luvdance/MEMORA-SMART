/**
 * MOBILE APP DEVELOPMENT · MODULE 6 · PLANNING APP SCREENS AND NAVIGATION
 *
 * Curriculum 6.1 – 6.P. Splash and onboarding, welcome, registration and
 * login, dashboards, lists, details and profiles, tabs, stacks and modals,
 * back navigation, screen flow diagrams, reusable components and layouts for
 * every phone size.
 *
 * The labs plan apps the way teams do before writing screens: as a SCREEN
 * FLOW. A given prototype shell (src/app/, read-only, real Expo Router
 * navigation) turns the flow file the learner writes (src/prototype/flow.js)
 * into a clickable prototype on the phone, so a check can tap through it,
 * press Back and see exactly where a user would land.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

import { appJson, expoLab } from "./md-helpers.js";

export const SECTION_ID = "md-s6-screens";
const MODULE = "md-m6-screens";

/* ── The prototype shell (given, read-only) ──────────────────────────────
 * A flow is { start, screens: { id: { title, kind, body, items, fields,
 * buttons: [{ label, to, replace, primary }], tab, modal } }, tabs: [ids] }.
 * Buttons go to another screen (push), "back", or replace the history. */
const SHELL_LAYOUT = `import { Stack } from "expo-router";

export default function PrototypeLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="[screen]" />
      <Stack.Screen name="modal/[screen]" options={{ presentation: "modal" }} />
    </Stack>
  );
}
`;

const SHELL_INDEX = `import { Redirect } from "expo-router";
import { start } from "@/prototype/flow";

// The prototype opens on the flow's first screen.
export default function Start() {
  return <Redirect href={\`/\${start}\`} />;
}
`;

const SHELL_SCREEN = (modal) => `import { Stack, router, useLocalSearchParams } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { screens, tabs } from "@/prototype/flow";

type Button = { label: string; to: string; replace?: boolean; primary?: boolean };

export default function PrototypeScreen() {
  const { screen } = useLocalSearchParams<{ screen: string }>();
  const spec = screens[screen as keyof typeof screens] as
    | { title: string; body?: string; items?: string[]; fields?: string[]; buttons?: Button[]; tab?: boolean; modal?: boolean }
    | undefined;
  if (!spec) return <Text style={styles.missing}>No screen called "{screen}" in flow.js</Text>;

  const go = (b: Button) => {
    if (b.to === "back") return router.back();
    const target = screens[b.to as keyof typeof screens] as { modal?: boolean } | undefined;
    const href = target?.modal ? \`/modal/\${b.to}\` : \`/\${b.to}\`;
    if (b.replace) {
      // A fresh history: close every screen above the first, then replace the first.
      if (router.canDismiss()) router.dismissAll();
      router.replace(href as never);
    } else router.push(href as never);
  };

  return (
    <View style={styles.page}>
      <Stack.Screen options={{ title: spec.title }} />
      <ScrollView contentContainerStyle={styles.body}>
        {spec.body ? <Text style={styles.text}>{spec.body}</Text> : null}
        {(spec.fields ?? []).map((f) => (
          <TextInput key={f} accessibilityLabel={f} placeholder={f} style={styles.input} />
        ))}
        {(spec.items ?? []).map((item) => (
          <Text key={item} style={styles.item}>
            {item}
          </Text>
        ))}
        {(spec.buttons ?? []).map((b) => (
          <Pressable key={b.label} accessibilityRole="button" onPress={() => go(b)} style={[styles.button, b.primary ? styles.primary : null]}>
            <Text style={[styles.buttonText, b.primary ? styles.primaryText : null]}>{b.label}</Text>
          </Pressable>
        ))}
      </ScrollView>
      {spec.tab && !${modal} ? (
        <View style={styles.tabBar} accessibilityRole="tablist">
          {tabs.map((t) => {
            const tab = screens[t as keyof typeof screens] as { title: string };
            return (
              <Pressable key={t} accessibilityRole="tab" accessibilityState={{ selected: t === screen }} onPress={() => router.replace(\`/\${t}\` as never)} style={styles.tab}>
                <Text style={t === screen ? styles.tabOn : styles.tabOff}>{tab?.title ?? t}</Text>
              </Pressable>
            );
          })}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: "#fff" },
  body: { padding: 20, gap: 12 },
  text: { fontSize: 16, lineHeight: 24 },
  input: { minHeight: 48, borderWidth: 1, borderColor: "#cbd5e1", borderRadius: 10, paddingHorizontal: 12, fontSize: 16 },
  item: { padding: 14, borderRadius: 10, backgroundColor: "#f1f5f4", fontSize: 16 },
  button: { minHeight: 48, borderRadius: 10, borderWidth: 1, borderColor: "#0f766e", alignItems: "center", justifyContent: "center" },
  primary: { backgroundColor: "#0f766e" },
  buttonText: { color: "#0f766e", fontWeight: "700", fontSize: 16 },
  primaryText: { color: "#fff" },
  tabBar: { flexDirection: "row", borderTopWidth: 1, borderColor: "#e2e8f0", paddingBottom: 28 },
  tab: { flex: 1, minHeight: 48, alignItems: "center", justifyContent: "center" },
  tabOn: { color: "#0f766e", fontWeight: "700" },
  tabOff: { color: "#64748b" },
  missing: { padding: 24, color: "#b91c1c" },
});
`;

/** A prototype lab: the shell is given; the learner writes src/prototype/flow.js. */
function prototypeLab({ flow, solution, alsoSolve = {}, ...rest }) {
  const lab = expoLab({
    layout: null,
    files: {
      "src/prototype/flow.js": flow,
      "src/app/_layout.tsx": SHELL_LAYOUT,
      "src/app/index.tsx": SHELL_INDEX,
      "src/app/[screen].tsx": SHELL_SCREEN(false),
      "src/app/modal/[screen].tsx": SHELL_SCREEN(true),
    },
    readOnly: ["src/app/_layout.tsx", "src/app/index.tsx", "src/app/[screen].tsx", "src/app/modal/[screen].tsx"],
    solution: { "src/prototype/flow.js": solution, ...alsoSolve },
    ...rest,
  });
  return lab;
}

const layout = (title) => `import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "${title}" }} />
    </Stack>
  );
}
`;

/* ── Flows ───────────────────────────────────────────────────────────── */
const ONBOARDING_START = `// The first screens a new user sees. Each button: { label, to, replace?, primary? }.
// to is a screen id, or "back".
export const start = "onboarding1";

export const screens = {
  onboarding1: {
    title: "Welcome",
    body: "Save with your friends, one week at a time.",
    buttons: [{ label: "Next", to: "home", primary: true }],
  },
  home: { title: "Home", body: "Your groups appear here." },
};

export const tabs = [];
`;

const ONBOARDING_MODEL = `// The first screens a new user sees. Each button: { label, to, replace?, primary? }.
// to is a screen id, or "back".
export const start = "onboarding1";

export const screens = {
  onboarding1: {
    title: "Welcome",
    body: "Save with your friends, one week at a time.",
    buttons: [
      { label: "Next", to: "onboarding2", primary: true },
      { label: "Skip", to: "home", replace: true },
    ],
  },
  onboarding2: {
    title: "Stay on track",
    body: "Get a reminder before each contribution is due.",
    buttons: [
      { label: "Next", to: "onboarding3", primary: true },
      { label: "Skip", to: "home", replace: true },
    ],
  },
  onboarding3: {
    title: "See every payment",
    body: "Everyone in the group sees who has paid.",
    buttons: [{ label: "Get started", to: "home", replace: true, primary: true }],
  },
  home: { title: "Home", body: "Your groups appear here." },
};

export const tabs = [];
`;

const AUTH_START = `export const start = "welcome";

export const screens = {
  welcome: {
    title: "Kobo",
    body: "Send money and pay bills in seconds.",
    buttons: [{ label: "Log in", to: "login", primary: true }],
  },
  login: {
    title: "Log in",
    fields: ["Phone number", "PIN"],
    buttons: [{ label: "Log in", to: "home", primary: true }],
  },
  home: { title: "Home", body: "Balance: ₦52,300" },
};

export const tabs = [];
`;

const AUTH_MODEL = `export const start = "welcome";

export const screens = {
  welcome: {
    title: "Kobo",
    body: "Send money and pay bills in seconds.",
    buttons: [
      { label: "Create account", to: "register", primary: true },
      { label: "I already have an account", to: "login" },
    ],
  },
  register: {
    title: "Create account",
    fields: ["Full name", "Phone number", "Create a PIN"],
    buttons: [
      { label: "Create account", to: "home", replace: true, primary: true },
      { label: "I already have an account", to: "login" },
    ],
  },
  login: {
    title: "Log in",
    fields: ["Phone number", "PIN"],
    buttons: [
      { label: "Log in", to: "home", replace: true, primary: true },
      { label: "Forgot PIN?", to: "forgot" },
    ],
  },
  forgot: {
    title: "Reset your PIN",
    fields: ["Phone number"],
    buttons: [{ label: "Send reset code", to: "back", primary: true }],
  },
  home: { title: "Home", body: "Balance: ₦52,300" },
};

export const tabs = [];
`;

const SHOP_START = `export const start = "home";

export const screens = {
  home: {
    title: "Home",
    body: "Good morning, Ada",
    items: ["Rice (5kg)", "Palm oil (1L)"],
    tab: true,
  },
  orders: { title: "Orders", items: ["Order #1042"], tab: true },
  account: { title: "Account", body: "Ada Obi", tab: true },
};

export const tabs = ["home", "orders", "account"];
`;

const SHOP_MODEL = `export const start = "home";

export const screens = {
  home: {
    title: "Home",
    body: "Good morning, Ada",
    items: ["Rice (5kg)", "Palm oil (1L)"],
    buttons: [{ label: "View Rice (5kg)", to: "product" }],
    tab: true,
  },
  product: {
    title: "Rice (5kg)",
    body: "₦9,500 · Long grain, stone-free",
    buttons: [{ label: "Add to cart", to: "added", primary: true }],
  },
  added: {
    title: "Added to cart",
    modal: true,
    body: "Rice (5kg) is in your cart.",
    buttons: [{ label: "Keep shopping", to: "back", primary: true }],
  },
  orders: {
    title: "Orders",
    items: ["Order #1042"],
    buttons: [{ label: "Open order #1042", to: "order" }],
    tab: true,
  },
  order: { title: "Order #1042", body: "Delivered on 18 October" },
  account: { title: "Account", body: "Ada Obi", tab: true },
};

export const tabs = ["home", "orders", "account"];
`;

const GRID_SCREEN = `import { StyleSheet, Text, useWindowDimensions, View } from "react-native";
import { columnsFor } from "@/lib/layout";

const CATEGORIES = ["Phones", "Laptops", "Audio", "Watches", "Cameras", "Gaming"];

export default function Screen() {
  const { width } = useWindowDimensions();
  const columns = columnsFor(width);
  const gap = 12;
  const size = (width - 32 - gap * (columns - 1)) / columns;
  return (
    <View style={styles.page}>
      <Text style={styles.note}>
        {width} wide: {columns} columns
      </Text>
      <View style={[styles.grid, { gap }]}>
        {CATEGORIES.map((c) => (
          <View key={c} testID="card" style={[styles.card, { width: size }]}>
            <Text style={styles.cardText}>{c}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, padding: 16, gap: 12 },
  note: { color: "#64748b" },
  grid: { flexDirection: "row", flexWrap: "wrap" },
  card: { aspectRatio: 1, borderRadius: 12, backgroundColor: "#e0f2f1", alignItems: "center", justifyContent: "center" },
  cardText: { fontWeight: "700" },
});
`;

const PRACTICAL_START = `// Plan the whole app here. Read the task for what it must contain.
export const start = "welcome";

export const screens = {
  welcome: { title: "Welcome", body: "Your app's first screen." },
};

export const tabs = [];
`;

const PRACTICAL_MODEL = `// Plan the whole app here. Read the task for what it must contain.
export const start = "welcome";

export const screens = {
  welcome: {
    title: "Welcome",
    body: "Book a barber near you in under a minute.",
    buttons: [
      { label: "Sign up", to: "signup", primary: true },
      { label: "Log in", to: "login" },
    ],
  },
  signup: {
    title: "Sign up",
    fields: ["Full name", "Phone number"],
    buttons: [{ label: "Create account", to: "home", replace: true, primary: true }],
  },
  login: {
    title: "Log in",
    fields: ["Phone number", "PIN"],
    buttons: [{ label: "Log in", to: "home", replace: true, primary: true }],
  },
  home: {
    title: "Home",
    body: "Barbers open now",
    items: ["Fresh Cuts, Yaba", "Kings Barbing Salon, Ikeja"],
    buttons: [{ label: "See Fresh Cuts", to: "barber" }],
    tab: true,
  },
  barber: {
    title: "Fresh Cuts",
    body: "Open until 8pm · 4.8 stars",
    buttons: [{ label: "Book a cut", to: "confirm", primary: true }],
  },
  confirm: {
    title: "Confirm booking",
    modal: true,
    body: "Today at 4:30pm with Tunde. ₦3,000.",
    buttons: [
      { label: "Confirm", to: "bookings", replace: true, primary: true },
      { label: "Cancel", to: "back" },
    ],
  },
  bookings: { title: "Bookings", items: ["Fresh Cuts · Today 4:30pm"], tab: true },
  profile: { title: "Profile", body: "Ada Obi · 0803 123 4567", tab: true },
};

export const tabs = ["home", "bookings", "profile"];
`;

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 25 · 6.1 – 6.2
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "md-l25-first-screens",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 1,
    covers: ["6.1", "6.2"],
    title: "The First Screens",
    subtitle: "Splash, onboarding, welcome, registration and login",
    estimatedMinutes: 45,
    intro: "The first thirty seconds decide whether a new user stays. This lesson plans the screens they meet before they reach the app itself.",

    atoms: [
      {
        id: "a-md-splash-onboarding",
        title: "Splash screens and onboarding",
        explain:
          "The SPLASH SCREEN is what the phone shows while your app starts: a background colour and your logo, configured in app.json (the expo-splash-screen plugin) and shown by the operating system itself, so it appears instantly. Keep it plain and keep it short; the app can hold it while it loads fonts or a saved session (Module 7). ONBOARDING is the optional sequence that explains the app's value, usually two or three screens with one idea each. Rules: let people SKIP it, never make them sit through more than three screens, explain benefits rather than features, and ask for permissions (notifications, location) only at the moment they make sense, not during onboarding. After onboarding, REPLACE the history so Back does not return to it.",
        webLab: prototypeLab({
          name: "Ajo",
          app: { plugins: [["expo-splash-screen", { backgroundColor: "#ffffff", image: "./assets/images/splash-icon.png", imageWidth: 120 }]] },
          editable: ["app.json"],
          task:
            "Plan the onboarding in src/prototype/flow.js: three screens (onboarding1, onboarding2, onboarding3), each with a Next button to the next one, and a Skip button on the first two that goes to home with replace: true. The last has \"Get started\" to home, also replacing the history, so Back from home never returns to onboarding. Then, in app.json, give the splash screen the brand's green background, \"#0f766e\".",
          flow: ONBOARDING_START,
          solution: ONBOARDING_MODEL,
          alsoSolve: { "app.json": appJson("Ajo", { plugins: [["expo-splash-screen", { backgroundColor: "#0f766e", image: "./assets/images/splash-icon.png", imageWidth: 120 }]] }) },
          tests: [
            { label: "Three onboarding screens, joined by Next", check: "await waitFor(() => path() === '/onboarding1', 3000); await press('Next'); const a = path(); await press('Next'); const b = path(); return a === '/onboarding2' && b === '/onboarding3' && has('Get started');", fail: "onboarding1 → onboarding2 → onboarding3, each with a Next button." },
            { label: "Get started reaches home, and Back does not return to onboarding", check: "await waitFor(() => has('Get started'), 3000); await press('Get started'); const there = path() === '/home'; return there && !canGoBack();", fail: "Get started: { to: \"home\", replace: true }" },
            { label: "Skip goes straight to home on the first two screens", check: "await restart(); await waitFor(() => path() === '/onboarding1', 3000); await press('Skip'); const first = path() === '/home' && !canGoBack(); await restart(); await waitFor(() => path() === '/onboarding1', 3000); await press('Next'); await press('Skip'); return first && path() === '/home' && !canGoBack();", fail: "Add { label: \"Skip\", to: \"home\", replace: true } to the first two screens." },
            { label: "The splash screen uses the brand green", check: "const p = (config().plugins || []).find((x) => Array.isArray(x) && x[0] === 'expo-splash-screen'); return p && p[1].backgroundColor.toLowerCase() === '#0f766e';", fail: "In app.json, set the expo-splash-screen plugin's backgroundColor to \"#0f766e\"." },
          ],
          hint: "replace: true starts a fresh history (the shell dismisses every screen, then replaces the first), so there is nothing to go Back to.",
          successMessage: "Short, skippable onboarding that never comes back once it is done.",
        }),
      },
      {
        id: "a-md-auth-screens",
        title: "Welcome, registration and login screens",
        explain:
          "The WELCOME screen offers two clear paths: create an account (the primary, highlighted button for new users) or log in. REGISTRATION asks for the minimum to get started (you can ask for more later) and offers a way across to log in; LOGIN offers a way to recover a forgotten password or PIN. Once someone has signed in or signed up, REPLACE the history: pressing Back on the home screen must not show the login form again. Consider signing in with a phone number and one-time code, or Google and Apple sign-in (Module 15), which avoid passwords entirely.",
        webLab: prototypeLab({
          name: "Kobo",
          task:
            "Complete the sign-in flow. welcome needs \"Create account\" (primary, to register) and \"I already have an account\" (to login). register asks for Full name, Phone number and Create a PIN, and has a \"Create account\" button to home and a link to login. login asks for Phone number and PIN, with \"Log in\" to home and \"Forgot PIN?\" to a forgot screen that asks for the phone number and has \"Send reset code\", which goes back. Signing up or logging in must replace the history.",
          flow: AUTH_START,
          solution: AUTH_MODEL,
          tests: [
            { label: "Welcome offers both paths", check: "await waitFor(() => has('Create account'), 3000); return has('Create account') && has('I already have an account');", fail: "Two buttons on welcome." },
            { label: "Registration asks for the three fields and signs in for good", check: "await waitFor(() => has('Create account'), 3000); await press({ role: 'button', name: 'Create account' }); const fields = ['Full name', 'Phone number', 'Create a PIN'].every((f) => find({ label: f })); await press({ role: 'button', name: 'Create account' }); return fields && path() === '/home' && !canGoBack();", fail: "register: fields Full name, Phone number, Create a PIN; Create account replaces to home." },
            { label: "Login replaces the history too", check: "await restart(); await waitFor(() => has('I already have an account'), 3000); await press('I already have an account'); await press({ role: 'button', name: 'Log in' }); return path() === '/home' && !canGoBack();", fail: "Log in: { to: \"home\", replace: true }" },
            { label: "Forgot PIN? leads to a reset screen that goes back to login", check: "await restart(); await waitFor(() => has('I already have an account'), 3000); await press('I already have an account'); await press('Forgot PIN?'); const reset = path() === '/forgot' && Boolean(find({ label: 'Phone number' })); await press('Send reset code'); return reset && path() === '/login';", fail: "forgot: field Phone number, button Send reset code with to: \"back\"." },
          ],
          hint: "Every route into the app (signing up or logging in) should use replace: true.",
          successMessage: "Two clear paths in, a way back from a forgotten PIN, and no way back to the login form once inside.",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 26 · 6.3 – 6.4
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "md-l26-core-screens",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 2,
    covers: ["6.3", "6.4"],
    title: "The Screens Users Live In",
    subtitle: "Home dashboards, lists, detail pages and profiles",
    estimatedMinutes: 35,
    intro: "Most of an app's use happens on a handful of screens: home, a list, the details of one item, and the user's own profile. Each has a job, and a pattern that does it well.",

    atoms: [
      {
        id: "a-md-dashboards",
        title: "Home dashboards",
        explain:
          "A HOME DASHBOARD answers the question the user opens the app with, in a glance: \"how much do I have?\", \"what is due today?\", \"is my order coming?\". Put that answer at the top, the two or three most common actions right after it, and recent activity below. Resist putting everything on home: it becomes a wall of cards nobody reads. Show the user's own data, not marketing, and design its empty state for a brand-new user who has no data yet.",
        decision: {
          scenario: "A savings app's home screen today shows: a promotions carousel, a list of all 12 features as tiles, news, and, at the very bottom, the user's savings balance.",
          question: "What should the redesign put first?",
          options: [
            { id: "a", text: "The balance and the next contribution due, then \"Save now\" and \"Withdraw\", then recent activity", why: "The dashboard should answer the user's first question at a glance and put the most frequent actions next." },
            { id: "b", text: "A bigger promotions carousel", whyWrong: "Promotions are what the company wants, not why the user opened the app." },
            { id: "c", text: "All 12 features, but smaller", whyWrong: "Showing everything means highlighting nothing." },
            { id: "d", text: "A welcome animation", whyWrong: "Delay, on a screen people open many times a day." },
          ],
          correct: "a",
          aftermath: "Home answers the question people open the app with.",
        },
      },
      {
        id: "a-md-list-detail-profile",
        title: "Lists, detail pages and profile screens",
        explain:
          "A LIST shows many items compactly: each row has the one or two facts needed to choose (a name and a price, a sender and a preview), is the whole row tappable, and is sorted the way users think (newest first, nearest first). Lists need search or filters once they grow beyond a screen or two, and an empty state. A DETAIL page shows one item fully, with its main action prominent (Buy, Reply, Book) and a way back to the list. A PROFILE screen shows who is signed in and holds account settings, security and sign-out, which should always be easy to find. Together they form the most common pattern in mobile apps: tabs of lists, each opening details in a stack.",
        decision: {
          scenario: "A job-listing app shows each job in the list as a full-screen card with the whole description. Users scroll for a long time and rarely apply.",
          question: "What is the better pattern?",
          options: [
            { id: "a", text: "Compact rows (title, company, location, pay) that open a detail page with the description and a prominent Apply button", why: "A list helps people choose quickly; the detail page holds everything about one job and its main action." },
            { id: "b", text: "Make the cards even bigger", whyWrong: "Fewer jobs per screen makes choosing harder." },
            { id: "c", text: "Remove the descriptions entirely", whyWrong: "People need them, on the detail page." },
            { id: "d", text: "Put Apply buttons on every card", whyWrong: "That does not fix the scanning problem." },
          ],
          correct: "a",
          aftermath: "Lists help people choose; details help them act.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 27 · 6.5 – 6.7
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "md-l27-navigation-patterns",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 3,
    covers: ["6.5", "6.6", "6.7"],
    title: "Tabs, Stacks, Modals and Back",
    subtitle: "How users move through an app",
    estimatedMinutes: 45,
    intro: "Almost every mobile app combines three navigation patterns. Knowing which to use where, and what Back does in each, is the core of planning an app.",

    atoms: [
      {
        id: "a-md-tabs",
        title: "Bottom-tab navigation",
        explain:
          "A BOTTOM TAB BAR holds the app's three to five top-level destinations, always visible and always one tap away. Switching tabs is not \"going forward\": each tab keeps its own place, and Back does not step through previously visited tabs (on iOS there is no back between tabs; on Android, Back from a tab's root may take you to the first tab, then out of the app). Each tab can contain its own STACK of screens. Use tabs for parallel areas of equal importance (Home, Orders, Account), not for steps of a task.",
        decision: {
          scenario: "A checkout process (Cart → Delivery → Payment → Confirm) is built as four bottom tabs.",
          question: "Why is that the wrong pattern?",
          options: [
            { id: "a", text: "These are steps of one task, which belong in a stack; tabs are for separate top-level areas", why: "A stack shows progress and gives a natural Back between steps; tabs let users jump to Payment before choosing delivery." },
            { id: "b", text: "Four tabs is too many", whyWrong: "Four is fine for tabs; the problem is using tabs for steps." },
            { id: "c", text: "Checkout should be on the home screen", whyWrong: "That does not address the pattern." },
            { id: "d", text: "It is the right pattern", whyWrong: "Tabs do not represent a sequence." },
          ],
          correct: "a",
          aftermath: "Tabs for places, stacks for paths.",
        },
      },
      {
        id: "a-md-stack-modal",
        title: "Stack navigation and modal screens",
        explain:
          "A STACK works like a pile of cards: opening a detail PUSHES a screen on top, Back POPS it off. It is the pattern for drilling down (list → item → item's reviews) and for steps of a task. A MODAL is a screen that slides up over the current one for a short, self-contained task (compose a message, confirm a booking, add to cart), with a clear way to finish or cancel; when it closes, the user is exactly where they were. Use modals for interruptions and focused tasks, not for ordinary browsing. In the lab, the shop's tabs each push detail screens in a stack, and adding to cart opens a modal.",
        webLab: prototypeLab({
          name: "Shop",
          task:
            "Extend the shop's flow. On home, \"View Rice (5kg)\" pushes a product screen (title \"Rice (5kg)\") with an \"Add to cart\" button that opens an added screen as a MODAL (modal: true) with a \"Keep shopping\" button that goes back. On orders, \"Open order #1042\" pushes an order screen titled \"Order #1042\". The three tabs (home, orders, account) must stay as they are.",
          flow: SHOP_START,
          solution: SHOP_MODEL,
          tests: [
            { label: "Home pushes the product screen in a stack", check: "await waitFor(() => has('View Rice (5kg)'), 3000); await press('View Rice (5kg)'); return path() === '/product' && screenTitle() === 'Rice (5kg)' && canGoBack();", fail: "home's button: { label: \"View Rice (5kg)\", to: \"product\" }" },
            { label: "Add to cart opens a modal, and Keep shopping returns to the product", check: "await restart(); await waitFor(() => has('View Rice (5kg)'), 3000); await press('View Rice (5kg)'); await press('Add to cart'); const inModal = path() === '/modal/added'; await press('Keep shopping'); return inModal && path() === '/product';", fail: "added: { modal: true, buttons: [{ label: \"Keep shopping\", to: \"back\" }] }" },
            { label: "Orders opens an order's details", check: "await restart(); await waitFor(() => has('Orders'), 3000); await press({ role: 'tab', name: 'Orders' }); await press('Open order #1042'); return path() === '/order' && screenTitle() === 'Order #1042';", fail: "orders: a button to an order screen titled \"Order #1042\"." },
            { label: "The three tabs are unchanged", check: "const { tabs } = load('src/prototype/flow.js'); return tabs.join() === 'home,orders,account';", fail: "Keep tabs as [\"home\", \"orders\", \"account\"]." },
          ],
          hint: "A screen with modal: true slides up over the current one; \"back\" closes it.",
          successMessage: "Tabs for places, a stack to drill in, a modal for a quick task.",
        }),
      },
      {
        id: "a-md-back",
        title: "Back navigation",
        explain:
          "Back must always take people somewhere sensible, on both platforms: in a stack, to the previous screen; from a modal, closing it; from a tab's first screen on Android, out of the app (after returning to the first tab). It must NOT return to screens that no longer make sense: the login form after signing in, a payment form after paying (replace the history instead), or an onboarding sequence. And it must not lose work: if someone presses Back halfway through a long form, ask before discarding it. Test Back on every screen, with Android's button or gesture and iOS's swipe from the left edge.",
        webLab: prototypeLab({
          name: "Kobo",
          task:
            "Use this flow from the last lesson to explore Back with the Android back button (the chevron button above the phone when it is on Android). Then fix the one remaining problem: after resetting a PIN (\"Send reset code\"), the user should go back to the login screen, not forward to a new one. Make the change in flow.js, then check every path.",
          flow: AUTH_MODEL.replace('{ label: "Send reset code", to: "back", primary: true }', '{ label: "Send reset code", to: "login", primary: true }'),
          solution: AUTH_MODEL,
          device: { os: "android" },
          tests: [
            { label: "Android Back from login returns to welcome", check: "await waitFor(() => has('I already have an account'), 3000); await press('I already have an account'); await back(); return path() === '/welcome';", fail: "login is pushed from welcome, so Back pops it." },
            { label: "After resetting a PIN, the user is back on login with nothing extra in the history", check: "await restart(); await waitFor(() => has('I already have an account'), 3000); await press('I already have an account'); await press('Forgot PIN?'); await press('Send reset code'); const onLogin = path() === '/login'; await back(); return onLogin && path() === '/welcome';", fail: "Send reset code should go \"back\", not push another login screen." },
            { label: "Back from home after logging in does not reach the login form", check: "await restart(); await waitFor(() => has('I already have an account'), 3000); await press('I already have an account'); await press({ role: 'button', name: 'Log in' }); return path() === '/home' && !canGoBack();", fail: "Keep replace: true on Log in." },
          ],
          hint: "Pushing \"login\" again puts a second login screen on the stack; \"back\" returns to the existing one.",
          successMessage: "Every Back lands where a user expects, on Android's button as much as anywhere.",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 28 · 6.8 – 6.10
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "md-l28-flows-components",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 4,
    covers: ["6.8", "6.9", "6.10"],
    title: "Flows, Components and Every Phone Size",
    subtitle: "Diagrams that plan an app, parts that repeat, and layouts that adapt",
    estimatedMinutes: 45,
    intro: "Before building, teams draw the whole app on one page, list the pieces that repeat, and decide how the layout adapts from a small Android phone to a large iPhone.",

    atoms: [
      {
        id: "a-md-flow-diagrams",
        title: "Screen flow and navigation diagrams",
        explain:
          "A SCREEN FLOW DIAGRAM draws every screen as a box and every way between them as an arrow, labelled with what the user taps. It shows the tab bar, which screens are stacks inside which tab, which are modals, and where the history is replaced (after login). It reveals dead ends (a screen with no way forward or back), missing screens (\"where does Forgot PIN go?\") and journeys that take too many taps, before any code is written. Draw it in Figma, FigJam, on paper, or as data, as the flow files in this module are: each screen and each button's destination.",
        decision: {
          scenario: "While drawing your app's flow diagram, you notice the \"Payment failed\" screen has no arrows leaving it.",
          question: "What does that tell you?",
          options: [
            { id: "a", text: "It is a dead end: users need a way to retry, change the payment method, or go back", why: "Finding dead ends on paper is exactly what a flow diagram is for." },
            { id: "b", text: "Nothing: failure screens do not need buttons", whyWrong: "A user stuck on a failure screen will close the app." },
            { id: "c", text: "Delete the screen so failures never happen", whyWrong: "Payments do fail; the app must handle it." },
            { id: "d", text: "Add a link to the home screen only", whyWrong: "Better than nothing, but retry is what the user wants." },
          ],
          correct: "a",
          aftermath: "Every box needs a way forward, and a way back.",
        },
      },
      {
        id: "a-md-design-components",
        title: "Reusable design components",
        explain:
          "Look at your screens and you will see the same pieces again and again: buttons (primary, secondary, destructive), text fields with labels and errors, list rows, cards, headers, empty states, badges. Design each ONCE as a COMPONENT, with variants for its states (normal, pressed, disabled, loading, error), and build every screen from them. The app becomes consistent for users and faster for the team, and a change to the Button updates it everywhere. These components become the React Native components you build in Module 8, with the same names and variants.",
        decision: {
          scenario: "Your Figma file has 14 slightly different buttons: different corner radii, heights and greens, made separately on each screen.",
          question: "What should you do before handing it to developers?",
          options: [
            { id: "a", text: "Define one Button component with a few variants (primary, secondary, destructive; normal and disabled) and replace all 14", why: "One component with clear variants gives users consistency and developers one Button to build." },
            { id: "b", text: "Hand it over as it is", whyWrong: "Developers will either build 14 buttons or guess which one is right." },
            { id: "c", text: "Delete every button except one", whyWrong: "You still need variants, such as destructive and disabled." },
            { id: "d", text: "Make every button a different colour so they are easy to tell apart", whyWrong: "That destroys consistency." },
          ],
          correct: "a",
          aftermath: "Design a component once; use it everywhere.",
        },
      },
      {
        id: "a-md-responsive-phones",
        title: "Responsive layouts for different phone sizes",
        explain:
          "Phones range from about 320 to over 440 points wide, plus tablets, foldables and landscape. Never design for one exact size: use flexible layouts (rows that wrap, widths as fractions, spacing from tokens) and decide how the layout changes at BREAKPOINTS. In React Native, useWindowDimensions() gives the current width and height, and changes when the phone rotates or a foldable opens. Test on the smallest phone your users have and the largest, in both orientations, and with large text turned on. In the lab, a product grid chooses its number of columns from the width.",
        webLab: expoLab({
          name: "Categories",
          layout: layout("Categories"),
          task:
            "Write columnsFor(width) in src/lib/layout.js: 2 columns below 400 points wide (a small phone, such as the 393-point iPhone here), 3 columns from 400 to below 700 (a large phone, such as the 412-point Android phone), and 4 columns from 700 (landscape and tablets). The grid uses it to size its cards.",
          files: {
            "src/lib/layout.js": `export function columnsFor(width) {
  return 1;
}
`,
            "src/app/index.js": GRID_SCREEN,
          },
          readOnly: ["src/app/index.js"],
          solution: {
            "src/lib/layout.js": `export function columnsFor(width) {
  if (width >= 700) return 4;
  if (width >= 400) return 3;
  return 2;
}
`,
          },
          tests: [
            { label: "2 columns on the 393-point iPhone", check: "const cards = findAll({ testID: 'card' }); const top = cards[0].getBoundingClientRect().top; return cards.filter((c) => Math.abs(c.getBoundingClientRect().top - top) < 2).length === 2 && hasText('2 columns');", fail: "Below 400: return 2." },
            { label: "3 columns on the 412-point Android phone", device: { os: "android" }, check: "const cards = findAll({ testID: 'card' }); const top = cards[0].getBoundingClientRect().top; return cards.filter((c) => Math.abs(c.getBoundingClientRect().top - top) < 2).length === 3;", fail: "From 400 to below 700: return 3." },
            { label: "4 columns in landscape", device: { orientation: "landscape" }, check: "const cards = findAll({ testID: 'card' }); const top = cards[0].getBoundingClientRect().top; return cards.filter((c) => Math.abs(c.getBoundingClientRect().top - top) < 2).length === 4;", fail: "From 700: return 4." },
            { label: "The boundaries are exact", check: "const { columnsFor } = load('src/lib/layout.js'); return columnsFor(399) === 2 && columnsFor(400) === 3 && columnsFor(699) === 3 && columnsFor(700) === 4;", fail: "Use >= for the lower edge of each range." },
          ],
          hint: "Check the largest breakpoint first: if (width >= 700) return 4;",
          successMessage: "One layout, three phone shapes, each with the right number of columns.",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 29 · 6.P
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "md-l29-m6-project",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 5,
    covers: ["6.P"],
    title: "Practical: Plan and Prototype a Multi-Screen App",
    subtitle: "A complete screen flow, as a clickable prototype",
    estimatedMinutes: 90,
    intro:
      "Before a single screen is coded, a product team has a clickable prototype everyone has tried. In this practical you plan a complete booking app as a flow, and the phone turns it into that prototype.",

    atoms: [
      {
        id: "a-md-m6-project",
        title: "Prototype a barber-booking app",
        explain:
          "Your app lets people book a haircut nearby. Plan every screen and every path, including the first-run screens, the tabs, the stack inside a tab, a confirmation modal and the right history behaviour. Then do the same in Figma, which the task below guides you through.",
        webLab: prototypeLab({
          name: "Barber",
          task:
            "Write the whole flow in src/prototype/flow.js. welcome offers \"Sign up\" and \"Log in\". signup (fields Full name and Phone number) and login (fields Phone number and PIN) both lead to home and replace the history. Three tabs: home, bookings and profile (each with tab: true). home lists at least two barbers and has a button that pushes a barber screen; the barber screen's \"Book a cut\" opens a confirm screen as a modal with \"Confirm\" (to bookings, replacing the history) and \"Cancel\" (back). bookings lists at least one booking.",
          flow: PRACTICAL_START,
          solution: PRACTICAL_MODEL,
          revealSolution: false,
          tests: [
            { label: "Welcome offers Sign up and Log in, and both lead home for good", check: "await waitFor(() => has('Sign up'), 3000); await press('Sign up'); const f1 = ['Full name', 'Phone number'].every((l) => find({ label: l })); const btns = findAll({ role: 'button' }); await press(btns[0]); const a = path() === '/home' && !canGoBack(); await restart(); await waitFor(() => has('Log in'), 3000); await press({ role: 'button', name: 'Log in' }); const f2 = ['Phone number', 'PIN'].every((l) => find({ label: l })); await press({ role: 'button', name: 'Log in' }); return f1 && a && f2 && path() === '/home' && !canGoBack();", fail: "signup and login need the right fields, and buttons to home with replace: true." },
            { label: "Three tabs: home, bookings and profile", check: "const { tabs, screens } = load('src/prototype/flow.js'); return tabs.join() === 'home,bookings,profile' && tabs.every((t) => screens[t] && screens[t].tab === true);", fail: "tabs: [\"home\", \"bookings\", \"profile\"], each screen with tab: true." },
            { label: "Home lists at least two barbers and pushes a barber screen", check: "const { screens } = load('src/prototype/flow.js'); await navigate('/home'); const b = (screens.home.buttons || [])[0]; if (!b || (screens.home.items || []).length < 2) return false; await press(b.label); return path() !== '/home' && canGoBack() && has('Book a cut');", fail: "home: items with two barbers, and a button to the barber screen, which has Book a cut." },
            { label: "Book a cut opens a confirm modal; Cancel returns, Confirm lands on bookings for good", check: "const { screens } = load('src/prototype/flow.js'); await navigate('/home'); await press(screens.home.buttons[0].label); const barberPath = path(); await press('Book a cut'); const modal = path().startsWith('/modal/'); await press('Cancel'); const cancelled = path() === barberPath; await press('Book a cut'); await press('Confirm'); return modal && cancelled && path() === '/bookings' && !canGoBack();", fail: "confirm: modal: true, Confirm → bookings with replace: true, Cancel → back." },
            { label: "Bookings lists at least one booking", check: "const { screens } = load('src/prototype/flow.js'); return (screens.bookings?.items || []).length >= 1;", fail: "Give bookings at least one item." },
          ],
          hint: "Draw it on paper first: boxes for screens, arrows for buttons. Then write each box as a screen in flow.js.",
          successMessage: "A whole app planned and clickable before any screen was coded. Now design it properly in Figma.",
        }),
      },
    ],
    task: {
      title: "Module 6 practical: design and prototype your app in Figma",
      intro: "Use the flow you just planned, or your own app idea from Module 5.",
      prompts: [
        "Create a free Figma account and a file with frames for an iPhone and an Android phone. Start from Figma's community kits for iOS and Material 3.",
        "Define colour, text and spacing styles (your design tokens) and components for Button (primary, secondary, disabled), Text field (with label and error), List row and Card.",
        "Design every screen of your flow at high fidelity, including an empty state, an error state and a loading state for at least one screen.",
        "Link the frames into an interactive prototype and give it to two people with a task (\"Book a haircut for 4:30 today\"). Note where they hesitate.",
        "Mastery checkpoint: give someone your screen flow diagram and ask them to find every screen in your prototype. Fix anything they could not find.",
      ],
      closing: "Next: Module 7, building real interfaces with React Native and Expo.",
    },
    requirements: { read: true, video: false, assessment: true },
  },
];
