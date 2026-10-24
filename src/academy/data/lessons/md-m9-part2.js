/**
 * MOBILE APP DEVELOPMENT · MODULE 9 · NAVIGATION AND MULTI-SCREEN APPLICATIONS (part 2)
 *
 * Curriculum 9.8 – 9.P: signed-in and signed-out navigation with
 * Stack.Protected, protected screens, deep links and URL schemes,
 * notification links, project organisation, and the module practical.
 *
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 */

import { expoLab } from "./md-helpers.js";
import { MODULE, RECIPES, SECTION_ID } from "./md-m9-part1.js";

const SESSION = `import { createContext, useContext, useState, type ReactNode } from "react";

// Who is signed in. (Module 15 makes this real: tokens, a server, SecureStore.)
export type Session = { name: string; role: "member" | "admin" } | null;

type SessionValue = { session: Session; signIn: (s: NonNullable<Session>) => void; signOut: () => void };

const SessionContext = createContext<SessionValue | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session>(null);
  return (
    <SessionContext.Provider value={{ session, signIn: setSession, signOut: () => setSession(null) }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const value = useContext(SessionContext);
  if (!value) throw new Error("useSession must be used inside <SessionProvider>");
  return value;
}
`;

const AUTH_ROOT_START = `import { Stack } from "expo-router";
import { SessionProvider, useSession } from "@/context/session";

export default function RootLayout() {
  return (
    <SessionProvider>
      <RootNavigator />
    </SessionProvider>
  );
}

function RootNavigator() {
  const { session } = useSession();
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(app)" />
      <Stack.Screen name="sign-in" />
    </Stack>
  );
}
`;

const AUTH_ROOT_MODEL = `import { Stack } from "expo-router";
import { SessionProvider, useSession } from "@/context/session";

export default function RootLayout() {
  return (
    <SessionProvider>
      <RootNavigator />
    </SessionProvider>
  );
}

function RootNavigator() {
  const { session } = useSession();
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={!!session}>
        <Stack.Screen name="(app)" />
      </Stack.Protected>
      <Stack.Protected guard={!session}>
        <Stack.Screen name="sign-in" />
      </Stack.Protected>
    </Stack>
  );
}
`;

const SIGN_IN = `import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSession } from "@/context/session";

export default function SignIn() {
  const { signIn } = useSession();
  return (
    <View style={styles.page}>
      <Text style={styles.title}>Welcome back</Text>
      <Pressable accessibilityRole="button" onPress={() => signIn({ name: "Ada", role: "member" })} style={styles.button}>
        <Text style={styles.text}>Sign in as Ada</Text>
      </Pressable>
      <Pressable accessibilityRole="button" onPress={() => signIn({ name: "Tunde", role: "admin" })} style={styles.button}>
        <Text style={styles.text}>Sign in as Tunde (admin)</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, justifyContent: "center", padding: 24, gap: 12 },
  title: { fontSize: 26, fontWeight: "700" },
  button: { minHeight: 48, borderRadius: 12, backgroundColor: "#0f766e", justifyContent: "center", alignItems: "center" },
  text: { color: "#fff", fontWeight: "700" },
});
`;

const APP_LAYOUT_START = `import { Stack } from "expo-router";

export default function AppLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Home" }} />
      <Stack.Screen name="admin" options={{ title: "Admin" }} />
    </Stack>
  );
}
`;

const APP_LAYOUT_MODEL = `import { Stack } from "expo-router";
import { useSession } from "@/context/session";

export default function AppLayout() {
  const { session } = useSession();
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Home" }} />
      <Stack.Protected guard={session?.role === "admin"} redirectTo="/">
        <Stack.Screen name="admin" options={{ title: "Admin" }} />
      </Stack.Protected>
    </Stack>
  );
}
`;

const APP_HOME = `import { Link } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { useSession } from "@/context/session";

export default function Home() {
  const { session, signOut } = useSession();
  return (
    <View style={{ padding: 20, gap: 12 }}>
      <Text style={{ fontSize: 22 }}>Hello, {session?.name}</Text>
      <Link href="/admin" style={{ fontSize: 16, color: "#0f766e", paddingVertical: 12 }}>
        Admin tools
      </Link>
      <Pressable accessibilityRole="button" onPress={signOut} style={{ minHeight: 48, justifyContent: "center" }}>
        <Text>Sign out</Text>
      </Pressable>
    </View>
  );
}
`;

const ADMIN = `import { Text, View } from "react-native";

export default function Admin() {
  return (
    <View style={{ padding: 20 }}>
      <Text>Manage users and refunds</Text>
    </View>
  );
}
`;

const authFiles = (root, appLayout) => ({
  "src/app/_layout.tsx": root,
  "src/app/(app)/_layout.tsx": appLayout,
  "src/app/(app)/index.tsx": APP_HOME,
  "src/app/(app)/admin.tsx": ADMIN,
  "src/app/sign-in.tsx": SIGN_IN,
  "src/context/session.tsx": SESSION,
});

/* ── Deep links ──────────────────────────────────────────────────────── */
const LINK_ROOT = (anchor) => `import { Stack } from "expo-router";
${anchor}
export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Recipes" }} />
      <Stack.Screen name="recipe/[id]" options={{ title: "Recipe" }} />
      <Stack.Screen name="+not-found" options={{ title: "Not found" }} />
    </Stack>
  );
}
`;

const LINK_LIST = `import { Link } from "expo-router";
import { View } from "react-native";
import { RECIPES } from "@/data/recipes";

export default function List() {
  return (
    <View style={{ padding: 16 }}>
      {RECIPES.map((r) => (
        <Link key={r.id} href={\`/recipe/\${r.id}\`} style={{ padding: 14, fontSize: 16 }}>
          {r.title}
        </Link>
      ))}
    </View>
  );
}
`;

const LINK_DETAIL = `import { useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";
import { findRecipe } from "@/data/recipes";

export default function Detail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const recipe = findRecipe(id);
  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 22, fontWeight: "700" }}>{recipe ? recipe.title : "Recipe not found"}</Text>
    </View>
  );
}
`;

const NOT_FOUND_MODEL = `import { Link } from "expo-router";
import { Text, View } from "react-native";

export default function NotFound() {
  return (
    <View style={{ padding: 20, gap: 12 }}>
      <Text style={{ fontSize: 18 }}>This link doesn't lead to a recipe.</Text>
      <Link href="/" style={{ color: "#0f766e", fontSize: 16, paddingVertical: 12 }}>
        See all recipes
      </Link>
    </View>
  );
}
`;

/* ── Notification links ──────────────────────────────────────────────── */
const OBSERVER_START = `import { useEffect } from "react";

// Open the screen a tapped notification points to (its data.url).
export function useNotificationObserver() {
  useEffect(() => {}, []);
}
`;

const OBSERVER_MODEL = `import * as Notifications from "expo-notifications";
import { router } from "expo-router";
import { useEffect } from "react";

// Open the screen a tapped notification points to (its data.url).
export function useNotificationObserver() {
  useEffect(() => {
    function redirect(notification: Notifications.Notification) {
      const url = notification.request.content.data?.url;
      if (typeof url === "string") router.push(url as never);
    }

    // The app was opened by tapping a notification while it was closed.
    const last = Notifications.getLastNotificationResponse();
    if (last?.notification) redirect(last.notification);

    // A notification is tapped while the app is running.
    const subscription = Notifications.addNotificationResponseReceivedListener((response) => {
      redirect(response.notification);
    });
    return () => subscription.remove();
  }, []);
}
`;

const NOTIF_ROOT = `import { Stack } from "expo-router";
import { useNotificationObserver } from "@/hooks/useNotificationObserver";

export default function RootLayout() {
  useNotificationObserver();
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Orders" }} />
      <Stack.Screen name="orders/[id]" options={{ title: "Order" }} />
    </Stack>
  );
}
`;

const ORDER_DETAIL = `import { useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";

export default function Order() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 20 }}>Order #{id} is on its way</Text>
    </View>
  );
}
`;

/* ── Organising a project ────────────────────────────────────────────── */
const MESSY = `import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from "react-native";

type Recipe = { id: string; title: string; minutes: number };

export default function Recipes() {
  const [recipes, setRecipes] = useState<Recipe[] | null>(null);
  useEffect(() => {
    fetch("https://api.example.com/recipes")
      .then((r) => r.json())
      .then(setRecipes);
  }, []);
  if (!recipes) return <ActivityIndicator style={{ marginTop: 40 }} />;
  return (
    <FlatList
      data={recipes}
      keyExtractor={(r) => r.id}
      renderItem={({ item }) => (
        <View style={styles.row} testID="recipe">
          <Text style={styles.title}>{item.title}</Text>
          <Text>{item.minutes >= 60 ? \`\${Math.floor(item.minutes / 60)} h \${item.minutes % 60} min\` : \`\${item.minutes} min\`}</Text>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  row: { padding: 16, borderBottomWidth: 1, borderColor: "#e2e8f0" },
  title: { fontSize: 16, fontWeight: "600" },
});
`;

const TIDY_SCREEN = `import { ActivityIndicator, FlatList } from "react-native";
import { RecipeRow } from "@/components/RecipeRow";
import { useRecipes } from "@/hooks/useRecipes";

export default function Recipes() {
  const recipes = useRecipes();
  if (!recipes) return <ActivityIndicator style={{ marginTop: 40 }} />;
  return <FlatList data={recipes} keyExtractor={(r) => r.id} renderItem={({ item }) => <RecipeRow recipe={item} />} />;
}
`;

const TIDY = {
  "src/types/recipe.ts": "export type Recipe = { id: string; title: string; minutes: number };\n",
  "src/services/recipes.ts": 'import type { Recipe } from "@/types/recipe";\n\nconst API_URL = "https://api.example.com";\n\nexport async function getRecipes(): Promise<Recipe[]> {\n  const response = await fetch(`${API_URL}/recipes`);\n  return response.json();\n}\n',
  "src/hooks/useRecipes.ts": 'import { useEffect, useState } from "react";\nimport { getRecipes } from "@/services/recipes";\nimport type { Recipe } from "@/types/recipe";\n\nexport function useRecipes() {\n  const [recipes, setRecipes] = useState<Recipe[] | null>(null);\n  useEffect(() => {\n    getRecipes().then(setRecipes);\n  }, []);\n  return recipes;\n}\n',
  "src/utils/time.ts": "export function formatMinutes(minutes: number): string {\n  if (minutes < 60) return `${minutes} min`;\n  return `${Math.floor(minutes / 60)} h ${minutes % 60} min`;\n}\n",
  "src/components/RecipeRow.tsx": 'import { StyleSheet, Text, View } from "react-native";\nimport type { Recipe } from "@/types/recipe";\nimport { formatMinutes } from "@/utils/time";\n\nexport function RecipeRow({ recipe }: { recipe: Recipe }) {\n  return (\n    <View style={styles.row} testID="recipe">\n      <Text style={styles.title}>{recipe.title}</Text>\n      <Text>{formatMinutes(recipe.minutes)}</Text>\n    </View>\n  );\n}\n\nconst styles = StyleSheet.create({\n  row: { padding: 16, borderBottomWidth: 1, borderColor: "#e2e8f0" },\n  title: { fontSize: 16, fontWeight: "600" },\n});\n',
};

const RECIPE_SERVER = `import { createServer } from "practice-server";

const app = createServer();

app.get("/recipes", (req, res) => {
  res.json([
    { id: "1", title: "Jollof rice", minutes: 75 },
    { id: "2", title: "Suya", minutes: 40 },
    { id: "3", title: "Moi moi", minutes: 90 },
  ]);
});

export default app;
`;

/* ── The practical ───────────────────────────────────────────────────── */
const P_SESSION = SESSION;
const P_FAVS = `// The ids of recipes saved as favourites (in memory for now).
export const FAVOURITES = ["1", "3"];
`;

export const PART2 = [
  /* ═══════════════ LESSON 52 · 9.8 – 9.9 ═══════════════ */
  {
    id: "md-l52-auth-navigation",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 4,
    covers: ["9.8", "9.9"],
    title: "Signed-In Navigation and Protected Screens",
    subtitle: "Showing the right screens to the right people with Stack.Protected",
    estimatedMinutes: 55,
    intro: "Most apps have two worlds: what you see before signing in and after. Expo Router keeps them apart with protected routes.",
    atoms: [
      {
        id: "a-md-auth-nav",
        title: "Authentication-based navigation",
        explain:
          "Wrap groups of screens in <Stack.Protected guard={…}>: when the guard is false, those screens do not exist for the navigator, anyone sent there is redirected, and when a guard flips while you are on one of its screens, you are moved off it and its history is removed. The usual root layout has two: guard={!!session} around the signed-in app, and guard={!session} around the sign-in screens. Signing in (changing the session) then moves the user into the app with no history to go back to, and signing out does the reverse, with no router calls at all. The session usually comes from a Context provider wrapping the navigator (Module 11) and is restored from SecureStore (Module 12).",
        webLab: expoLab({
          name: "Kobo",
          layout: null,
          task:
            "In src/app/_layout.tsx, protect the two groups: the (app) group only when there is a session, the sign-in screen only when there is not. Then the app opens on sign-in, signing in moves to the app with no way Back, and signing out returns to sign-in.",
          files: authFiles(AUTH_ROOT_START, APP_LAYOUT_START),
          readOnly: ["src/app/(app)/_layout.tsx", "src/app/(app)/index.tsx", "src/app/(app)/admin.tsx", "src/app/sign-in.tsx", "src/context/session.tsx"],
          solution: { "src/app/_layout.tsx": AUTH_ROOT_MODEL },
          tests: [
            { label: "Signed out, the app shows sign-in", check: "await waitFor(() => has('Welcome back'), 2000); return path() === '/sign-in' && !has('Hello, Ada');", fail: "<Stack.Protected guard={!session}> around sign-in, and guard={!!session} around (app)." },
            { label: "Signing in opens the app with no way back to sign-in", check: "await restart(); await waitFor(() => has('Sign in as Ada'), 2000); await press('Sign in as Ada'); await waitFor(() => has('Hello, Ada'), 2000); return path() === '/' && !canGoBack();", fail: "When the guards flip, the router moves the user for you." },
            { label: "Sign-in is unreachable while signed in", check: "await restart(); await waitFor(() => has('Sign in as Ada'), 2000); await press('Sign in as Ada'); await waitFor(() => has('Hello, Ada'), 2000); await navigate('/sign-in'); return !has('Welcome back');", fail: "Protect sign-in with guard={!session}." },
            { label: "Signing out returns to sign-in", check: "await restart(); await waitFor(() => has('Sign in as Ada'), 2000); await press('Sign in as Ada'); await waitFor(() => has('Sign out'), 2000); await press('Sign out'); await waitFor(() => has('Welcome back'), 2000); return path() === '/sign-in';", fail: "The (app) guard becomes false, so its screens close." },
          ],
          hint: "Two Stack.Protected blocks, one guard each; nothing else changes.",
          successMessage: "Two worlds, kept apart by the router itself.",
        }),
      },
      {
        id: "a-md-protected-screens",
        title: "Protected screens",
        explain:
          "Guards nest and can protect a single screen: <Stack.Protected guard={session?.role === \"admin\"} redirectTo=\"/\"> around an admin screen inside the signed-in app (redirectTo, new in SDK 58, chooses where refused visitors go; otherwise they go to the navigator's anchor). Remember what protected routes are: a way to keep the app's NAVIGATION correct. They are evaluated on the phone, so they are not security. Anything sensitive behind an admin screen must also be refused by the server for non-admins (Modules 14 and 15).",
        webLab: expoLab({
          name: "Kobo",
          layout: null,
          task:
            "Inside the signed-in app (src/app/(app)/_layout.tsx), protect the admin screen so only admins reach it, redirecting everyone else to \"/\". Ada is a member; Tunde is an admin.",
          files: authFiles(AUTH_ROOT_MODEL, APP_LAYOUT_START),
          readOnly: ["src/app/_layout.tsx", "src/app/(app)/index.tsx", "src/app/(app)/admin.tsx", "src/app/sign-in.tsx", "src/context/session.tsx"],
          solution: { "src/app/(app)/_layout.tsx": APP_LAYOUT_MODEL },
          tests: [
            { label: "A member is sent back home from Admin tools", check: "await waitFor(() => has('Sign in as Ada'), 2000); await press('Sign in as Ada'); await waitFor(() => has('Admin tools'), 2000); await press('Admin tools'); await wait(300); return !has('Manage users and refunds') && path() === '/';", fail: "<Stack.Protected guard={session?.role === \"admin\"} redirectTo=\"/\">" },
            { label: "An admin can open it", check: "await restart(); await waitFor(() => has('Sign in as Tunde (admin)'), 2000); await press('Sign in as Tunde (admin)'); await waitFor(() => has('Admin tools'), 2000); await press('Admin tools'); await waitFor(() => has('Manage users and refunds'), 2000); return path() === '/admin';", fail: "The guard is true for role \"admin\"." },
          ],
          hint: "useSession() works in any layout inside the provider.",
          successMessage: "The right screens for each role. (And on the server, the same rule for real security.)",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════ LESSON 53 · 9.10 – 9.11 ═══════════════ */
  {
    id: "md-l53-deep-links",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 5,
    covers: ["9.10", "9.11"],
    title: "Deep Links and Notification Links",
    subtitle: "URLs that open a screen directly, from anywhere",
    estimatedMinutes: 50,
    intro: "Because every Expo Router screen has a URL, a link in a message, a QR code or a notification can open your app exactly where the user needs to be.",
    atoms: [
      {
        id: "a-md-deep-links",
        title: "Deep links and URL schemes",
        explain:
          "app.json's \"scheme\" (\"recipes\") registers a URL scheme with the phone, so recipes://recipe/2 opens your app on src/app/recipe/[id].tsx with no extra code. In Expo Go the links use Expo Go's exp:// form instead; your own scheme works in development and release builds. Add a +not-found.tsx route for links to screens that do not exist. When a link starts the app from closed (a COLD START), the stack contains only the linked screen; export const unstable_settings = { anchor: \"index\" } from a layout puts its index screen underneath, so Back leads somewhere sensible. Universal links (https://… links that open the app, verified with your website) are Module 17.",
        webLab: expoLab({
          name: "Recipes",
          app: { scheme: "recipes" },
          layout: LINK_ROOT(""),
          editable: ["src/app/_layout.tsx"],
          task:
            "Links like recipes://recipe/2 already open the recipe. Finish the job: write src/app/+not-found.tsx saying \"This link doesn't lead to a recipe.\" with a link \"See all recipes\" to /, and add unstable_settings with the anchor \"index\" to the root layout, so a recipe opened from a link while the app was closed can go Back to the list.",
          files: {
            "src/app/+not-found.tsx": "// Write the not-found screen here.\n",
            "src/app/index.tsx": LINK_LIST,
            "src/app/recipe/[id].tsx": LINK_DETAIL,
            "src/data/recipes.ts": RECIPES,
          },
          readOnly: ["src/app/index.tsx", "src/app/recipe/[id].tsx", "src/data/recipes.ts"],
          solution: { "src/app/+not-found.tsx": NOT_FOUND_MODEL, "src/app/_layout.tsx": LINK_ROOT('\nexport const unstable_settings = { anchor: "index" };\n') },
          tests: [
            { label: "A recipes:// link opens the recipe while the app runs", check: "await waitFor(() => has('Suya'), 3000); await openLink('recipes://recipe/2'); await waitFor(() => has('Egusi soup'), 2000); return path() === '/recipe/2';", fail: "This works from the scheme alone: check app.json and the route." },
            { label: "A broken link shows the not-found screen with a way home", check: "await restart(); await openLink('recipes://pasta/7'); await waitFor(() => has(\"This link doesn't lead to a recipe.\"), 2000); await press('See all recipes'); return path() === '/' && has('Suya');", fail: "src/app/+not-found.tsx with the message and <Link href=\"/\">See all recipes</Link>." },
            { label: "Opened from closed, Back still reaches the list", check: "await coldLink('recipes://recipe/3'); await waitFor(() => has('Suya'), 3000); const atRecipe = path() === '/recipe/3'; await back(); return atRecipe && path() === '/' && has('Moi moi');", fail: "export const unstable_settings = { anchor: \"index\" }; in the root layout." },
          ],
          hint: "unstable_settings is a named export from the layout file, next to the default export.",
          successMessage: "Links that land in the right place, and never in a dead end.",
        }),
      },
      {
        id: "a-md-notification-links",
        title: "Handling notification links",
        explain:
          "A notification can carry data, and the usual convention is a url: { title: \"Order shipped\", data: { url: \"/orders/42\" } }. When the user taps it, expo-notifications delivers a RESPONSE. Handle both cases in a hook used by the root layout: if the app was opened by the tap, Notifications.getLastNotificationResponse() returns it at start-up; if the app was already running, addNotificationResponseReceivedListener fires. In both, read notification.request.content.data.url and router.push it. Remove the listener when the component unmounts. (Sending notifications, and permission to show them, are Module 16.)",
        webLab: expoLab({
          name: "Shop",
          layout: NOTIF_ROOT,
          device: { permissions: { notifications: "granted" } },
          task:
            "Write useNotificationObserver in src/hooks/useNotificationObserver.ts (the root layout already calls it). When a notification with data.url is tapped while the app runs, router.push that url; also handle the app having been opened by a tap with getLastNotificationResponse(); and remove the listener on unmount.",
          files: {
            "src/hooks/useNotificationObserver.ts": OBSERVER_START,
            "src/app/index.tsx": `import { Text, View } from "react-native";\n\nexport default function Orders() {\n  return (\n    <View style={{ padding: 20 }}>\n      <Text>Your orders</Text>\n    </View>\n  );\n}\n`,
            "src/app/orders/[id].tsx": ORDER_DETAIL,
          },
          readOnly: ["src/app/index.tsx", "src/app/orders/[id].tsx"],
          solution: { "src/hooks/useNotificationObserver.ts": OBSERVER_MODEL },
          tests: [
            { label: "Tapping a notification opens the order it points to", check: "await notify({ title: 'Order shipped', body: 'Order #42 is on its way', data: { url: '/orders/42' } }); await tapNotification(); await waitFor(() => path() === '/orders/42', 2000); return has('Order #42 is on its way');", fail: "addNotificationResponseReceivedListener → router.push(data.url)" },
            { label: "Notifications without a url are ignored", check: "await back(); await wait(200); await notify({ title: 'Sale this weekend' }); await tapNotification(); await wait(200); return path() === '/';", fail: "Check typeof url === \"string\" before pushing." },
            { label: "A cold start from a tap and clean-up are handled", check: "const c = code('src/hooks/useNotificationObserver.ts'); return c.includes('getLastNotificationResponse') && c.includes('.remove()');", fail: "Call getLastNotificationResponse() at start, and subscription.remove() in the clean-up." },
          ],
          hint: "The listener returns a subscription; return () => subscription.remove() from the effect.",
          successMessage: "A tapped notification lands on exactly the right screen.",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════ LESSON 54 · 9.12 ═══════════════ */
  {
    id: "md-l54-organising",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 6,
    covers: ["9.12"],
    title: "Organising a Growing Project",
    subtitle: "Screens, components, hooks, services and utilities, each in its place",
    estimatedMinutes: 45,
    intro: "A screen that fetches, formats and draws everything itself is fine for a demo and painful for a real app. This lesson moves each job to where it belongs.",
    atoms: [
      {
        id: "a-md-organising",
        title: "Organizing screens, components, hooks, services and utilities",
        explain:
          "A clear layout that most Expo teams use: src/app/ holds ONLY route files, which are thin; src/components/ holds reusable UI; src/hooks/ holds reusable stateful logic (useRecipes); src/services/ (or api/) holds code that talks to servers (getRecipes); src/utils/ holds small pure functions (formatMinutes); src/types/ holds shared TypeScript types; src/constants/ holds tokens and configuration. Each file does one job and is named for it. The reward: a screen reads like a sentence, each piece can be tested on its own (Module 18), and the next developer knows where to look.",
        webLab: expoLab({
          name: "Recipes",
          layout: `import { Stack } from "expo-router";\n\nexport default function RootLayout() {\n  return (\n    <Stack>\n      <Stack.Screen name="index" options={{ title: "Recipes" }} />\n    </Stack>\n  );\n}\n`,
          task:
            "The recipes screen does everything itself. Move each job out, keeping the screen working: the Recipe type to src/types/recipe.ts; getRecipes() (the fetch) to src/services/recipes.ts; a useRecipes() hook returning the recipes (or null while loading) to src/hooks/useRecipes.ts; formatMinutes(minutes) (\"40 min\", \"1 h 15 min\") to src/utils/time.ts; and a RecipeRow component (named export, props { recipe }) to src/components/RecipeRow.tsx. The screen should then only use the hook and the component.",
          files: {
            "src/app/index.tsx": MESSY,
            "src/types/recipe.ts": "",
            "src/services/recipes.ts": "",
            "src/hooks/useRecipes.ts": "",
            "src/utils/time.ts": "",
            "src/components/RecipeRow.tsx": "",
            "server/index.js": RECIPE_SERVER,
          },
          readOnly: ["server/index.js"],
          solution: { "src/app/index.tsx": TIDY_SCREEN, ...TIDY },
          tests: [
            { label: "The screen still shows the recipes with their times", check: "await waitFor(() => has('Jollof rice'), 3000); return findAll({ testID: 'recipe' }).length === 3 && has('1 h 15 min') && has('40 min') && has('1 h 30 min');", fail: "Keep the behaviour while moving the code." },
            { label: "formatMinutes and getRecipes live in utils and services", check: "const { formatMinutes } = load('src/utils/time.ts'); const r = await load('src/services/recipes.ts').getRecipes(); return formatMinutes(40) === '40 min' && formatMinutes(75) === '1 h 15 min' && formatMinutes(60) === '1 h 0 min' && r.length === 3;", fail: "export function formatMinutes(…) and export async function getRecipes()" },
            { label: "useRecipes and RecipeRow exist", check: "return typeof load('src/hooks/useRecipes.ts').useRecipes === 'function' && typeof load('src/components/RecipeRow.tsx').RecipeRow === 'function';", fail: "Export useRecipes and RecipeRow by name." },
            { label: "The screen only composes: no fetch, no formatting, no styles", check: "const c = code('src/app/index.tsx'); return !c.includes('fetch(') && !c.includes('Math.floor') && !c.includes('StyleSheet') && c.includes('useRecipes') && c.includes('RecipeRow');", fail: "The route file uses the hook and the component, nothing else." },
          ],
          hint: "Move one thing at a time and check the phone still shows the list after each move.",
          successMessage: "A thin screen and five single-purpose files. This is how the rest of the course is organised.",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════ LESSON 55 · 9.P ═══════════════ */
  {
    id: "md-l55-m9-project",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 7,
    covers: ["9.P"],
    title: "Practical: A Recipe App with Full Navigation",
    subtitle: "Tabs, a details stack, a protected favourites screen and deep links",
    estimatedMinutes: 120,
    intro: "Every navigation idea from this module in one app.",
    atoms: [
      {
        id: "a-md-m9-project",
        title: "Build the recipe app's navigation",
        explain:
          "You write every layout and screen. The data (RECIPES, FAVOURITES) and the session provider are given. Plan the route tree first: a root Stack holding a (tabs) group, recipe details over the tabs, and a sign-in screen; the Favourites tab must only be reachable when signed in.",
        webLab: expoLab({
          name: "Recipes",
          app: { scheme: "recipes" },
          layout: null,
          task:
            "Build: a root Stack (src/app/_layout.tsx, inside SessionProvider) with the (tabs) group (no header), recipe/[id] (title \"Recipe\") and sign-in; anchor \"(tabs)\" with unstable_settings. Tabs (src/app/(tabs)/_layout.tsx): \"Recipes\" (index, listing every recipe as a link to /recipe/<id>) and \"Favourites\" (favourites), the Favourites tab protected with Tabs.Protected guard={!!session} and redirectTo=\"/sign-in\". Favourites lists the FAVOURITES recipes' titles. recipe/[id] shows the recipe's title as the header title and in the screen, or \"Recipe not found\". sign-in has a \"Sign in\" button that signs in as Ada (member) and then goes back. The link recipes://recipe/4 must open Moi moi.",
          files: {
            "src/app/_layout.tsx": "// The root layout.\n",
            "src/app/(tabs)/_layout.tsx": "// The tabs.\n",
            "src/app/(tabs)/index.tsx": "// The recipe list.\n",
            "src/app/(tabs)/favourites.tsx": "// The favourites.\n",
            "src/app/recipe/[id].tsx": "// The recipe details.\n",
            "src/app/sign-in.tsx": "// Sign in.\n",
            "src/data/recipes.ts": RECIPES,
            "src/data/favourites.ts": P_FAVS,
            "src/context/session.tsx": P_SESSION,
          },
          readOnly: ["src/data/recipes.ts", "src/data/favourites.ts", "src/context/session.tsx"],
          revealSolution: false,
          solution: {
            "src/app/_layout.tsx": `import { Stack } from "expo-router";\nimport { SessionProvider } from "@/context/session";\n\nexport const unstable_settings = { anchor: "(tabs)" };\n\nexport default function RootLayout() {\n  return (\n    <SessionProvider>\n      <Stack>\n        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />\n        <Stack.Screen name="recipe/[id]" options={{ title: "Recipe" }} />\n        <Stack.Screen name="sign-in" options={{ title: "Sign in" }} />\n      </Stack>\n    </SessionProvider>\n  );\n}\n`,
            "src/app/(tabs)/_layout.tsx": `import { Tabs } from "expo-router";\nimport { useSession } from "@/context/session";\n\nexport default function TabsLayout() {\n  const { session } = useSession();\n  return (\n    <Tabs>\n      <Tabs.Screen name="index" options={{ title: "Recipes" }} />\n      <Tabs.Protected guard={!!session} redirectTo="/sign-in">\n        <Tabs.Screen name="favourites" options={{ title: "Favourites" }} />\n      </Tabs.Protected>\n    </Tabs>\n  );\n}\n`,
            "src/app/(tabs)/index.tsx": `import { Link } from "expo-router";\nimport { View } from "react-native";\nimport { RECIPES } from "@/data/recipes";\n\nexport default function List() {\n  return (\n    <View style={{ padding: 16 }}>\n      {RECIPES.map((r) => (\n        <Link key={r.id} href={\`/recipe/\${r.id}\`} style={{ padding: 14, fontSize: 16 }}>\n          {r.title}\n        </Link>\n      ))}\n      <Link href="/sign-in" style={{ padding: 14, color: "#0f766e" }}>\n        Sign in to see favourites\n      </Link>\n    </View>\n  );\n}\n`,
            "src/app/(tabs)/favourites.tsx": `import { Text, View } from "react-native";\nimport { FAVOURITES } from "@/data/favourites";\nimport { findRecipe } from "@/data/recipes";\n\nexport default function Favourites() {\n  return (\n    <View style={{ padding: 16, gap: 8 }}>\n      {FAVOURITES.map((id) => (\n        <Text key={id} style={{ fontSize: 16 }}>\n          {findRecipe(id)?.title}\n        </Text>\n      ))}\n    </View>\n  );\n}\n`,
            "src/app/recipe/[id].tsx": `import { Stack, useLocalSearchParams } from "expo-router";\nimport { Text, View } from "react-native";\nimport { findRecipe } from "@/data/recipes";\n\nexport default function Detail() {\n  const { id } = useLocalSearchParams<{ id: string }>();\n  const recipe = findRecipe(id);\n  return (\n    <View style={{ padding: 20 }}>\n      <Stack.Screen options={{ title: recipe ? recipe.title : "Recipe" }} />\n      <Text style={{ fontSize: 22, fontWeight: "700" }}>{recipe ? recipe.title : "Recipe not found"}</Text>\n    </View>\n  );\n}\n`,
            "src/app/sign-in.tsx": `import { router } from "expo-router";\nimport { Pressable, Text, View } from "react-native";\nimport { useSession } from "@/context/session";\n\nexport default function SignIn() {\n  const { signIn } = useSession();\n  return (\n    <View style={{ padding: 24 }}>\n      <Pressable\n        accessibilityRole="button"\n        onPress={() => {\n          signIn({ name: "Ada", role: "member" });\n          router.back();\n        }}\n        style={{ minHeight: 48, justifyContent: "center", alignItems: "center", borderRadius: 12, backgroundColor: "#0f766e" }}\n      >\n        <Text style={{ color: "#fff", fontWeight: "700" }}>Sign in</Text>\n      </Pressable>\n    </View>\n  );\n}\n`,
          },
          tests: [
            { label: "The Recipes tab lists the recipes; one opens over the tabs with its title", check: "await waitFor(() => has('Moi moi'), 3000); await press('Suya'); await waitFor(() => screenTitle() === 'Suya', 2000); const ok = path() === '/recipe/3' && has('Suya'); await back(); return ok && path() === '/';", fail: "Links to /recipe/<id>; the detail sets its title with <Stack.Screen options={{ title }} />." },
            { label: "Favourites is protected: signed out, it is hidden and leads to sign-in", check: "await restart(); await waitFor(() => has('Moi moi'), 3000); await navigate('/favourites'); await waitFor(() => path() === '/sign-in', 2000); return path() === '/sign-in';", fail: "<Tabs.Protected guard={!!session} redirectTo=\"/sign-in\">" },
            { label: "After signing in, Favourites shows the saved recipes", check: "await restart(); await waitFor(() => has('Moi moi'), 3000); await navigate('/sign-in'); await waitFor(() => has('Sign in'), 2000); await press({ role: 'button', name: 'Sign in' }); await wait(300); await press('Favourites'); await waitFor(() => has('Jollof rice') && has('Suya') && path() === '/favourites', 2000); return path() === '/favourites' && !has('Egusi soup');", fail: "Sign in sets the session (then router.back()); Favourites maps FAVOURITES to titles." },
            { label: "recipes://recipe/4 opens Moi moi, even from closed, with Back to the list", check: "await restart(); await coldLink('recipes://recipe/4'); await waitFor(() => has('Moi moi'), 3000); const at = path() === '/recipe/4'; await back(); return at && path() === '/';", fail: "Scheme recipes, and unstable_settings = { anchor: \"(tabs)\" } in the root layout." },
            { label: "An unknown recipe is handled", check: "await restart(); await navigate('/recipe/99'); return has('Recipe not found');", fail: "Show \"Recipe not found\" when findRecipe returns undefined." },
          ],
          hint: "Write the layouts first and check each route opens, then the guards, then the links.",
          successMessage: "A complete navigation structure: tabs, stack, protection and deep links.",
        }),
      },
    ],
    task: {
      title: "Module 9 practical: navigation in your own app",
      intro: "Apply this module to the app you planned in Module 6.",
      prompts: [
        "Turn your Module 6 flow into Expo Router routes: draw the route tree, then create the files and layouts.",
        "Protect the signed-in area with Stack.Protected and a session context, and add a role-protected screen if your app has roles.",
        "Set a scheme in app.json and open a screen from a link: in a development build, npx uri-scheme open \"yourscheme://path\" --android (or --ios on a Mac) opens one; in Expo Go, use the exp:// link Linking.createURL gives you.",
        "Test Back on every screen with Android's back button and iOS's swipe.",
        "Mastery checkpoint: draw your app's route tree from its src/app folder and predict what Back does on every screen, on Android and on iOS.",
      ],
      closing: "Next: Module 10, codebase structure and maintainability.",
    },
    requirements: { read: true, video: false, assessment: true },
  },
];
