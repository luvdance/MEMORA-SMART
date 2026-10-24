/**
 * MOBILE APP DEVELOPMENT · MODULE 9 · NAVIGATION AND MULTI-SCREEN APPLICATIONS (part 1)
 *
 * Curriculum 9.1 – 9.7 with Expo Router: setup, stacks, tabs, drawers,
 * parameters, going back and resetting, nested navigators. Part 2 has
 * 9.8 – 9.P. All labs run the real Expo Router (SDK 58).
 *
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 */

import { expoLab } from "./md-helpers.js";

export const SECTION_ID = "md-s9-navigation";
export const MODULE = "md-m9-navigation";

export const RECIPES = `export type Recipe = { id: string; title: string; minutes: number; region: string };

export const RECIPES: Recipe[] = [
  { id: "1", title: "Jollof rice", minutes: 75, region: "West Africa" },
  { id: "2", title: "Egusi soup", minutes: 60, region: "Nigeria" },
  { id: "3", title: "Suya", minutes: 40, region: "Northern Nigeria" },
  { id: "4", title: "Moi moi", minutes: 90, region: "Nigeria" },
];

export const findRecipe = (id: string) => RECIPES.find((r) => r.id === id);
`;

const STACK_LAYOUT_START = `import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" />
    </Stack>
  );
}
`;

const STACK_LAYOUT_MODEL = `import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerTintColor: "#0f766e", headerTitleStyle: { fontWeight: "700" } }}>
      <Stack.Screen name="index" options={{ title: "Recipes" }} />
      <Stack.Screen name="recipe/[id]" options={{ title: "Recipe" }} />
    </Stack>
  );
}
`;

const LIST_SCREEN = `import { Link } from "expo-router";
import { FlatList, StyleSheet, Text } from "react-native";
import { RECIPES } from "@/data/recipes";

export default function RecipeList() {
  return (
    <FlatList
      data={RECIPES}
      keyExtractor={(r) => r.id}
      renderItem={({ item }) => (
        <Link href={\`/recipe/\${item.id}\`} style={styles.row}>
          <Text>{item.title}</Text>
        </Link>
      )}
    />
  );
}

const styles = StyleSheet.create({
  row: { padding: 16, borderBottomWidth: 1, borderColor: "#e2e8f0", fontSize: 16 },
});
`;

const DETAIL_START = `import { Text, View } from "react-native";

export default function RecipeDetail() {
  return (
    <View style={{ padding: 20 }}>
      <Text>A recipe</Text>
    </View>
  );
}
`;

const DETAIL_MODEL = `import { Stack, useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";
import { findRecipe } from "@/data/recipes";

export default function RecipeDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const recipe = findRecipe(id);
  if (!recipe) return <Text style={{ padding: 20 }}>Recipe not found</Text>;
  return (
    <View style={{ padding: 20, gap: 8 }}>
      <Stack.Screen options={{ title: recipe.title }} />
      <Text style={{ fontSize: 24, fontWeight: "700" }}>{recipe.title}</Text>
      <Text>
        {recipe.minutes} minutes · {recipe.region}
      </Text>
    </View>
  );
}
`;

const TABS_START = `import { Tabs } from "expo-router";

export default function TabsLayout() {
  return <Tabs />;
}
`;

const TABS_MODEL = `import Ionicons from "@expo/vector-icons/Ionicons";
import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: "#0f766e" }}>
      <Tabs.Screen
        name="index"
        options={{ title: "Recipes", tabBarIcon: ({ color, size }) => <Ionicons name="restaurant-outline" color={color as string} size={size} /> }}
      />
      <Tabs.Screen
        name="shopping"
        options={{ title: "Shopping", tabBarBadge: 3, tabBarIcon: ({ color, size }) => <Ionicons name="cart-outline" color={color as string} size={size} /> }}
      />
      <Tabs.Screen
        name="account"
        options={{ title: "Account", tabBarIcon: ({ color, size }) => <Ionicons name="person-outline" color={color as string} size={size} /> }}
      />
    </Tabs>
  );
}
`;

const simple = (name, text) => `import { Text, View } from "react-native";\n\nexport default function ${name}() {\n  return (\n    <View style={{ padding: 20 }}>\n      <Text>${text}</Text>\n    </View>\n  );\n}\n`;

const ROOT_TABS = `import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}
`;

/* ── Parameters, back and reset ──────────────────────────────────────── */
const ORDER_ROOT = `import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Menu" }} />
      <Stack.Screen name="checkout" options={{ title: "Checkout" }} />
      <Stack.Screen name="pay" options={{ title: "Pay" }} />
      <Stack.Screen name="done" options={{ title: "Order placed", headerBackVisible: false }} />
    </Stack>
  );
}
`;

const MENU = (button) => `import { router } from "expo-router";
import { Pressable, Text, View } from "react-native";

export default function Menu() {
  return (
    <View style={{ padding: 20, gap: 12 }}>
      <Text style={{ fontSize: 20 }}>Jollof rice · ₦3,500</Text>
      <Pressable accessibilityRole="button" onPress={() => ${button}} style={{ minHeight: 48, justifyContent: "center", borderRadius: 10, backgroundColor: "#0f766e", paddingHorizontal: 16 }}>
        <Text style={{ color: "#fff", fontWeight: "700" }}>Order 2 plates</Text>
      </Pressable>
    </View>
  );
}
`;

const CHECKOUT = (read) => `import { router, useLocalSearchParams } from "expo-router";
import { Pressable, Text, View } from "react-native";

export default function Checkout() {
  ${read}
  return (
    <View style={{ padding: 20, gap: 12 }}>
      <Text style={{ fontSize: 18 }}>{qty} × {dish}</Text>
      <Pressable accessibilityRole="button" onPress={() => router.push("/pay")} style={{ minHeight: 48, justifyContent: "center", paddingHorizontal: 16, borderRadius: 10, backgroundColor: "#e2e8f0" }}>
        <Text>Continue to payment</Text>
      </Pressable>
    </View>
  );
}
`;

const PAY = (action) => `import { router } from "expo-router";
import { Pressable, Text, View } from "react-native";

export default function Pay() {
  return (
    <View style={{ padding: 20, gap: 12 }}>
      <Pressable accessibilityRole="button" onPress={() => router.back()} style={{ minHeight: 48, justifyContent: "center", paddingHorizontal: 16 }}>
        <Text>Change order</Text>
      </Pressable>
      <Pressable accessibilityRole="button" onPress={() => {${action}}} style={{ minHeight: 48, justifyContent: "center", paddingHorizontal: 16, borderRadius: 10, backgroundColor: "#0f766e" }}>
        <Text style={{ color: "#fff", fontWeight: "700" }}>Pay ₦7,000</Text>
      </Pressable>
    </View>
  );
}
`;

/* ── Nested navigators ───────────────────────────────────────────────── */
const NESTED_ROOT_START = `import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}
`;

const NESTED_ROOT_MODEL = `import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="recipe/[id]" options={{ title: "Recipe" }} />
      <Stack.Screen name="new-recipe" options={{ title: "New recipe", presentation: "modal" }} />
    </Stack>
  );
}
`;

const NESTED_TABS = `import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="index" options={{ title: "Recipes" }} />
      <Tabs.Screen name="account" options={{ title: "Account" }} />
    </Tabs>
  );
}
`;

const NESTED_HOME = `import { Link } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { RECIPES } from "@/data/recipes";

export default function Home() {
  return (
    <View style={styles.page}>
      {RECIPES.map((r) => (
        <Link key={r.id} href={\`/recipe/\${r.id}\`} style={styles.row}>
          {r.title}
        </Link>
      ))}
      <Link href="/new-recipe" style={styles.add}>
        Add a recipe
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { padding: 16, gap: 4 },
  row: { padding: 14, fontSize: 16 },
  add: { padding: 14, fontSize: 16, color: "#0f766e", fontWeight: "700" },
});
`;

export const PART1 = [
  /* ═══════════════ LESSON 49 · 9.1 – 9.2 ═══════════════ */
  {
    id: "md-l49-stack",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 1,
    covers: ["9.1", "9.2"],
    title: "Expo Router and Stack Navigation",
    subtitle: "File-based routing, and the stack every app is built on",
    estimatedMinutes: 50,
    intro: "In Module 6 you planned flows; in Module 7 you added a screen. Now you learn navigation properly, with the router Expo recommends for every new app.",
    atoms: [
      {
        id: "a-md-expo-router",
        title: "Installing and configuring a navigation solution supported by Expo",
        explain:
          "Expo Router is Expo's navigation library, built on React Navigation, and it is already set up in every project made with create-expo-app: package.json's \"main\" is \"expo-router/entry\", app.json lists the \"expo-router\" plugin and a \"scheme\" for deep links, and screens live in src/app/. (To add it to an older project you install expo-router and its peers with npx expo install, and make those same three changes.) Routing is FILE-BASED: every file in src/app/ is a route, folders make URL segments, [brackets] make parameters, (parentheses) make groups that do not appear in the URL, and _layout.tsx files decide how a folder's screens are shown. Because every screen has a URL, deep links, notifications and the web work with no extra configuration. React Navigation itself can still be used directly, but new Expo apps use Expo Router.",
        decision: {
          scenario: "A teammate wants to add a settings screen at /settings/notifications. The app uses Expo Router.",
          question: "Which file do they create?",
          options: [
            { id: "a", text: "src/app/settings/notifications.tsx, declared in the layout that shows it", why: "The folders and file name are the URL. In SDK 58 the screen must also be declared in its navigator." },
            { id: "b", text: "src/screens/NotificationsScreen.tsx, then register it in a routes array", whyWrong: "That is how older, configuration-based navigation works; Expo Router reads the src/app folder." },
            { id: "c", text: "src/app/settings-notifications.tsx", whyWrong: "That gives the URL /settings-notifications." },
            { id: "d", text: "A new entry in app.json", whyWrong: "Routes are files, not configuration." },
          ],
          correct: "a",
          aftermath: "In Expo Router, the folder tree is the route tree.",
        },
      },
      {
        id: "a-md-stack-navigation",
        title: "Stack navigation",
        explain:
          "A Stack (from expo-router) shows one screen at a time with a native header and back button, pushing new screens on top. Configure it in _layout.tsx: screenOptions for every screen (headerTintColor, headerTitleStyle, headerShown), and <Stack.Screen name=\"…\" options={{ title }} /> for each route. A screen can set its own options while it renders with <Stack.Screen options={{ title: recipe.title }} /> inside it, which is how a detail screen shows the item's name in the header. Navigate with <Link href=\"/recipe/3\"> or router.push(\"/recipe/3\"). A dynamic route src/app/recipe/[id].tsx reads its parameter with useLocalSearchParams().",
        webLab: expoLab({
          name: "Recipes",
          editable: ["src/app/_layout.tsx"],
          task:
            "Set up the stack. In src/app/_layout.tsx give every screen the header tint \"#0f766e\" and a bold title, title the list \"Recipes\", and declare the recipe/[id] route with the title \"Recipe\". In src/app/recipe/[id].tsx, read the id, find the recipe with findRecipe, show its title and \"75 minutes · West Africa\", and set the header's title to the recipe's title. For an unknown id show \"Recipe not found\".",
          files: {
            "src/app/recipe/[id].tsx": DETAIL_START,
            "src/app/_layout.tsx": STACK_LAYOUT_START,
            "src/app/index.tsx": LIST_SCREEN,
            "src/data/recipes.ts": RECIPES,
          },
          readOnly: ["src/app/index.tsx", "src/data/recipes.ts"],
          solution: { "src/app/recipe/[id].tsx": DETAIL_MODEL, "src/app/_layout.tsx": STACK_LAYOUT_MODEL },
          tests: [
            { label: "The list is titled Recipes", check: "return screenTitle() === 'Recipes';", fail: "<Stack.Screen name=\"index\" options={{ title: \"Recipes\" }} />" },
            { label: "Tapping a recipe opens its details, titled with its name", check: "await press('Jollof rice'); await waitFor(() => has('75 minutes · West Africa'), 2000); return path() === '/recipe/1' && screenTitle() === 'Jollof rice';", fail: "useLocalSearchParams, findRecipe, and <Stack.Screen options={{ title: recipe.title }} />" },
            { label: "Back returns to the list", check: "await restart(); await navigate('/recipe/3'); await back(); return path() === '/' && has('Suya');", fail: "The detail route must be declared in the Stack." },
            { label: "An unknown id is handled", check: "await navigate('/recipe/99'); return has('Recipe not found');", fail: "if (!recipe) return <Text>Recipe not found</Text>" },
            { label: "The header uses the tint colour", check: "return /headerTintColor:\\s*\"#0f766e\"/.test(code('src/app/_layout.tsx'));", fail: "screenOptions={{ headerTintColor: \"#0f766e\", headerTitleStyle: { fontWeight: \"700\" } }}" },
          ],
          hint: "useLocalSearchParams<{ id: string }>() types the parameter.",
          successMessage: "A stack with a list, dynamic details and real headers.",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════ LESSON 50 · 9.3 – 9.4 ═══════════════ */
  {
    id: "md-l50-tabs-drawer",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 2,
    covers: ["9.3", "9.4"],
    title: "Tabs and Drawers",
    subtitle: "Top-level navigation, and when a drawer is the right choice",
    estimatedMinutes: 40,
    intro: "Tabs are how most apps organise their main areas. A drawer is the alternative when there are many of them.",
    atoms: [
      {
        id: "a-md-tabs-router",
        title: "Tab navigation",
        explain:
          "Put the tab screens in a group folder, src/app/(tabs)/, with a _layout.tsx that returns <Tabs> and declares each tab: <Tabs.Screen name=\"index\" options={{ title, tabBarIcon }} />. The group's name does not appear in URLs, so (tabs)/shopping.tsx is /shopping. tabBarIcon receives the colour and size to use; tabBarBadge shows a count; tabBarActiveTintColor sets the selected colour. The root layout shows the (tabs) group inside a Stack with headerShown: false, so detail screens can be pushed over the tabs. Expo Router also offers NativeTabs (expo-router/native-tabs), which uses the platform's own tab bar and is what the SDK 58 template uses on phones; JavaScript Tabs give you full control of the look.",
        webLab: expoLab({
          name: "Kitchen",
          layout: ROOT_TABS,
          task:
            "Write the tab layout in src/app/(tabs)/_layout.tsx: three tabs, \"Recipes\" (index, icon \"restaurant-outline\"), \"Shopping\" (shopping, icon \"cart-outline\", badge 3) and \"Account\" (account, icon \"person-outline\"), with the active colour \"#0f766e\". Use Ionicons for the icons.",
          files: {
            "src/app/(tabs)/_layout.tsx": TABS_START,
            "src/app/(tabs)/index.tsx": simple("Recipes", "Your recipes"),
            "src/app/(tabs)/shopping.tsx": simple("Shopping", "3 items to buy"),
            "src/app/(tabs)/account.tsx": simple("Account", "Signed in as Ada"),
          },
          readOnly: ["src/app/(tabs)/index.tsx", "src/app/(tabs)/shopping.tsx", "src/app/(tabs)/account.tsx"],
          solution: { "src/app/(tabs)/_layout.tsx": TABS_MODEL },
          tests: [
            { label: "Three tabs, starting on Recipes", check: "return has('Your recipes') && has('Recipes') && has('Shopping') && has('Account') && path() === '/';", fail: "Declare all three with Tabs.Screen; SDK 58 shows only declared screens." },
            { label: "Each tab opens its screen, with no group name in the URL", check: "await press('Shopping'); const a = path() === '/shopping' && has('3 items to buy'); await press('Account'); return a && path() === '/account' && has('Signed in as Ada');", fail: "name=\"shopping\" and name=\"account\"." },
            { label: "Icons and the Shopping badge", check: "const i = icons(); return ['restaurant-outline', 'cart-outline', 'person-outline'].every((n) => i.includes(n)) && has('3');", fail: "tabBarIcon with Ionicons, and tabBarBadge: 3." },
          ],
          hint: "tabBarIcon is a function: ({ color, size }) => <Ionicons … />",
          successMessage: "A tab bar with icons and a badge, from one layout file.",
        }),
      },
      {
        id: "a-md-drawer",
        title: "Drawer navigation where appropriate",
        explain:
          "A DRAWER is a panel that slides in from the side, opened by a menu button or a swipe. Expo Router provides it (expo-router/drawer, which needs react-native-gesture-handler and react-native-reanimated installed with npx expo install). Drawers hide navigation, so people use those destinations less; Apple and Google both now prefer tabs for an app's main areas. A drawer is appropriate when there are MANY destinations of similar, lower importance (an admin or email app with many folders), or on tablets, where it can stay open as a sidebar. A common modern pattern is tabs for the main areas and a drawer, or a Profile tab, for everything else.",
        decision: {
          scenario: "A food delivery app has four main areas (Home, Search, Orders, Account) that people use daily. A designer proposes hiding all four in a drawer behind a menu button to \"clean up\" the screen.",
          question: "What should you recommend?",
          options: [
            { id: "a", text: "Keep the four in a bottom tab bar: they are frequent, top-level destinations", why: "Tabs keep the main areas one tap away; drawers suit many, less frequent destinations." },
            { id: "b", text: "Use the drawer: menus are cleaner", whyWrong: "Hidden navigation is used less, and every trip takes two taps." },
            { id: "c", text: "Use both for the same four screens", whyWrong: "Duplicated navigation confuses people." },
            { id: "d", text: "Remove navigation and use links on the home screen", whyWrong: "Users need a constant way between areas." },
          ],
          correct: "a",
          aftermath: "Tabs for the few places people go every day; a drawer only for many lesser ones.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════ LESSON 51 · 9.5 – 9.7 ═══════════════ */
  {
    id: "md-l51-params-nesting",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 3,
    covers: ["9.5", "9.6", "9.7"],
    title: "Parameters, Going Back and Nesting",
    subtitle: "Passing data between screens, controlling history, and stacks over tabs",
    estimatedMinutes: 55,
    intro: "Real flows pass information from screen to screen, finish by clearing what came before, and combine navigators.",
    atoms: [
      {
        id: "a-md-params",
        title: "Passing parameters between screens",
        explain:
          "Parameters travel in the URL. Path parameters come from [brackets] in file names (/recipe/3); other values go in the query string. Pass them with an href object, router.push({ pathname: \"/checkout\", params: { dish: \"Jollof rice\", qty: 2 } }), or a Link with the same href, and read them with useLocalSearchParams(), typed by you: useLocalSearchParams<{ dish: string; qty: string }>(). Every parameter arrives as a STRING (convert numbers with Number()), and URLs are public and limited, so pass ids, not whole objects: the next screen looks the item up (or fetches it).",
        webLab: expoLab({
          name: "Bukka",
          layout: ORDER_ROOT,
          task:
            "On the menu, \"Order 2 plates\" must open /checkout passing the dish \"Jollof rice\" and the quantity 2 as parameters (router.push with pathname and params). On checkout, read them with useLocalSearchParams and show \"2 × Jollof rice\"; convert qty to a number.",
          files: {
            "src/app/index.tsx": MENU('router.push("/checkout")'),
            "src/app/checkout.tsx": CHECKOUT('const dish = "?";\n  const qty = 0;'),
            "src/app/pay.tsx": PAY(' router.push("/done"); '),
            "src/app/done.tsx": simple("Done", "Thank you! Your food is on the way."),
          },
          readOnly: ["src/app/pay.tsx", "src/app/done.tsx"],
          solution: {
            "src/app/index.tsx": MENU('router.push({ pathname: "/checkout", params: { dish: "Jollof rice", qty: 2 } })'),
            "src/app/checkout.tsx": CHECKOUT('const params = useLocalSearchParams<{ dish: string; qty: string }>();\n  const dish = params.dish;\n  const qty = Number(params.qty);'),
          },
          tests: [
            { label: "Ordering opens checkout with the two parameters", check: "await press('Order 2 plates'); return path() === '/checkout' && params().dish === 'Jollof rice' && String(params().qty) === '2';", fail: "router.push({ pathname: \"/checkout\", params: { dish: \"Jollof rice\", qty: 2 } })" },
            { label: "Checkout shows them", check: "await restart(); await press('Order 2 plates'); await waitFor(() => has('2 × Jollof rice'), 2000); return has('2 × Jollof rice');", fail: "const { dish, qty } = useLocalSearchParams<…>()" },
            { label: "qty is converted to a number", check: "return /Number\\(/.test(code('src/app/checkout.tsx'));", fail: "Parameters are strings: Number(params.qty)." },
          ],
          hint: "params can hold numbers when you push, but they always come back as strings.",
          successMessage: "Data passed in the URL, read and typed on arrival.",
        }),
      },
      {
        id: "a-md-back-reset",
        title: "Navigating back and resetting navigation state",
        explain:
          "router.back() goes to the previous screen (router.canGoBack() tells you whether there is one). router.replace(href) swaps the current screen for another, so Back skips it. router.dismissAll() closes every screen pushed in the current stack, back to its first; router.dismissTo(href) returns to a particular earlier screen. To finish a flow such as checkout so that Back cannot return to it, dismiss the stack and replace its first screen: router.dismissAll(); router.replace(\"/done\"). Hide the header's back button on such a screen with headerBackVisible: false, and on Android handle the system back with the same logic.",
        webLab: expoLab({
          name: "Bukka",
          layout: ORDER_ROOT,
          task:
            "On the pay screen, \"Change order\" already goes back. Make \"Pay ₦7,000\" finish the flow: dismiss the whole stack and replace it with /done, so that the order confirmation is the only screen and Back cannot return to checkout or payment.",
          files: {
            "src/app/pay.tsx": PAY(' router.push("/done"); '),
            "src/app/index.tsx": MENU('router.push({ pathname: "/checkout", params: { dish: "Jollof rice", qty: 2 } })'),
            "src/app/checkout.tsx": CHECKOUT('const params = useLocalSearchParams<{ dish: string; qty: string }>();\n  const dish = params.dish;\n  const qty = Number(params.qty);'),
            "src/app/done.tsx": simple("Done", "Thank you! Your food is on the way."),
          },
          readOnly: ["src/app/index.tsx", "src/app/checkout.tsx", "src/app/done.tsx"],
          solution: { "src/app/pay.tsx": PAY("\n          router.dismissAll();\n          router.replace(\"/done\");\n        ") },
          tests: [
            { label: "Change order goes back to checkout", check: "await press('Order 2 plates'); await press('Continue to payment'); await press('Change order'); return path() === '/checkout';", fail: "Keep router.back() on Change order." },
            { label: "Paying shows the confirmation with no way back", check: "await restart(); await press('Order 2 plates'); await press('Continue to payment'); await press('Pay ₦7,000'); await waitFor(() => has('Thank you! Your food is on the way.'), 2000); return path() === '/done' && !canGoBack();", fail: "router.dismissAll(); router.replace(\"/done\");" },
            { label: "Android's back button does not return to payment", device: { os: "android" }, check: "await press('Order 2 plates'); await press('Continue to payment'); await press('Pay ₦7,000'); await waitFor(() => path() === '/done', 2000); await back(); return path() !== '/pay' && path() !== '/checkout';", fail: "With the stack dismissed there is nothing to go back to." },
          ],
          hint: "dismissAll returns to the stack's first screen; replace then swaps that one for /done.",
          successMessage: "A finished flow, finished: no Back into a payment that already went through.",
        }),
      },
      {
        id: "a-md-nested",
        title: "Nested navigators",
        explain:
          "Navigators nest: a root Stack holds the (tabs) group as one screen, plus screens that should cover the tabs (details, a modal, settings). Push /recipe/3 from a tab and it slides in OVER the tab bar; Back returns to the tab, which kept its scroll position. A route can be shown as a modal with presentation: \"modal\" (it slides up on iOS) or \"formSheet\". Each tab can also hold its own Stack, by giving the tab a folder with its own _layout.tsx, when its screens should keep the tab bar visible. Decide per screen: does the user need the tabs while here?",
        webLab: expoLab({
          name: "Recipes",
          layout: NESTED_ROOT_START,
          editable: ["src/app/_layout.tsx"],
          task:
            "The home tab links to recipe details and to a new-recipe screen, but neither is declared, so neither opens. In the ROOT layout, declare recipe/[id] (title \"Recipe\") so it is pushed over the tabs, and new-recipe as a modal (title \"New recipe\", presentation \"modal\").",
          files: {
            "src/app/_layout.tsx": NESTED_ROOT_START,
            "src/app/(tabs)/_layout.tsx": NESTED_TABS,
            "src/app/(tabs)/index.tsx": NESTED_HOME,
            "src/app/(tabs)/account.tsx": simple("Account", "Signed in as Ada"),
            "src/app/recipe/[id].tsx": DETAIL_MODEL,
            "src/app/new-recipe.tsx": simple("NewRecipe", "Name your recipe"),
            "src/data/recipes.ts": RECIPES,
          },
          readOnly: ["src/app/(tabs)/_layout.tsx", "src/app/(tabs)/index.tsx", "src/app/(tabs)/account.tsx", "src/app/recipe/[id].tsx", "src/app/new-recipe.tsx", "src/data/recipes.ts"],
          solution: { "src/app/_layout.tsx": NESTED_ROOT_MODEL },
          tests: [
            { label: "A recipe opens over the tabs, and Back returns to the tab", check: "await press('Suya'); await waitFor(() => has('40 minutes · Northern Nigeria'), 2000); const over = path() === '/recipe/3' && !has('Account'); await back(); return over && path() === '/' && has('Account');", fail: "<Stack.Screen name=\"recipe/[id]\" options={{ title: \"Recipe\" }} /> in the root layout." },
            { label: "Add a recipe opens as a modal", check: "await press('Add a recipe'); await waitFor(() => has('Name your recipe'), 2000); return path() === '/new-recipe' && /presentation:\\s*\"modal\"/.test(code('src/app/_layout.tsx'));", fail: "<Stack.Screen name=\"new-recipe\" options={{ title: \"New recipe\", presentation: \"modal\" }} />" },
          ],
          hint: "Screens that cover the tabs belong to the ROOT stack, beside (tabs).",
          successMessage: "Stack over tabs, plus a modal: the structure of most apps you use.",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },
];
