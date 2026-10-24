/**
 * MOBILE APP DEVELOPMENT · MODULE 7 · UNDERSTANDING REACT NATIVE (part 1)
 *
 * Curriculum 7.1 – 7.11: React Native and Expo, the project, JSX,
 * components and props, state, events, conditional rendering, lists and the
 * core components. Part 2 (md-m7-part2.js) has 7.12 – 7.P. Every lab from
 * here on is TypeScript, and every model answer compiles against the real
 * React Native 0.88 and Expo SDK 58 types.
 *
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 */

import { expoLab } from "./md-helpers.js";
import { TRANSCRIPTS as T } from "./md-transcripts.js";

export const SECTION_ID = "md-s7-react-native";
export const MODULE = "md-m7-react-native";
const APP = "ada@laptop:~/projects/my-first-app$";

export const layout = (title, more = "") => `import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "${title}" }} />${more}
    </Stack>
  );
}
`;

const ABOUT_HOME = (withLink) => `import { Link } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

export default function HomeScreen() {
  return (
    <View style={styles.page}>
      <Text style={styles.title}>Notes</Text>
      <Text>Your notes will appear here.</Text>${withLink ? `
      <Link href="/about" style={styles.link}>
        About this app
      </Link>` : ""}
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, padding: 24, gap: 12 },
  title: { fontSize: 28, fontWeight: "700" },
  link: { fontSize: 16, color: "#0f766e", paddingVertical: 12 },
});
`;

const PROFILE_DATA = `export const member = {
  firstName: "Chidi",
  lastName: "Okeke",
  city: "Enugu",
  joined: 2023,
  badges: ["Early adopter", "Top reviewer"],
};
`;

export const PART1 = [
  /* ═══════════════ LESSON 36 · 7.1 – 7.4 ═══════════════ */
  {
    id: "md-l36-react-native",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 1,
    covers: ["7.1", "7.2", "7.3", "7.4"],
    title: "React Native and Expo",
    subtitle: "What React Native is, how Expo works, and how a project is put together",
    estimatedMinutes: 45,
    intro: "You have written JavaScript and TypeScript, designed screens and planned flows. Now you build the screens themselves, with React Native.",
    atoms: [
      {
        id: "a-md-rn-vs-web",
        title: "What React Native is, and how it differs from React for the web",
        explain:
          "React Native lets you describe a screen with React components written in TypeScript, and draws it with the phone's REAL native views: a <View> becomes an Android View or an iOS UIView, a <Text> a native text view, a <TextInput> the platform's own text field. Your logic runs in JavaScript (Hermes, React Native's engine); since React Native 0.76 the New Architecture connects it to native code directly. Compared with React on the web: there is no HTML and no CSS files. You use View instead of div, Text instead of p or span (and ALL text must be inside a <Text>), Image instead of img, Pressable instead of button, and you style with JavaScript objects that use a subset of CSS (Flexbox, colours, borders) with numbers instead of pixels. Everything you learned about components, props, state and Hooks is the same.",
        decision: {
          scenario: "A web developer writes this in a React Native screen: <div><p>Hello</p><button onClick={save}>Save</button></div>",
          question: "What needs to change?",
          options: [
            { id: "a", text: "Use <View>, <Text> and <Pressable onPress={save}> with a <Text> inside: there are no HTML elements in React Native", why: "React Native's components map to native views; HTML tags do not exist there." },
            { id: "b", text: "Nothing: React Native understands HTML", whyWrong: "It does not; div and p are web elements." },
            { id: "c", text: "Add a CSS file", whyWrong: "React Native has no CSS files; styles are JavaScript objects." },
            { id: "d", text: "Wrap it in a WebView", whyWrong: "That would be a hybrid app, not a native screen." },
          ],
          correct: "a",
          aftermath: "Same React, different building blocks.",
        },
      },
      {
        id: "a-md-expo-workflow",
        title: "Understanding Expo and the development workflow",
        explain:
          "EXPO is the framework React Native's own documentation recommends for new apps. It gives you the CLI and dev server (npx expo start), a library of modules for the phone's features (camera, location, notifications…), Expo Router, and EAS, cloud services that build, submit and update your app. You do not keep ios/ and android/ folders in your project: they are GENERATED from app.json and your packages' config plugins whenever needed (Continuous Native Generation, CNG), by npx expo prebuild or by EAS Build. So native settings belong in app.json, never in hand-edited native files. While learning you run in EXPO GO; once you add a package with native code Expo Go does not include, or need push notifications or your own app icon on the device, you make a DEVELOPMENT BUILD, your own version of Expo Go (Module 20).",
        terminalExercise: {
          prompt: APP,
          intro: "Recorded in the SDK 58 project from Module 2. Normally you never need to run this yourself: EAS Build runs it in the cloud.",
          goal: "Generate the Android native project from app.json to see Continuous Native Generation at work, without installing its dependencies.",
          commands: {
            "npx expo prebuild --platform android --no-install": T.prebuild["npx expo prebuild --platform android --no-install"],
            "ls android": T.prebuild["ls android"],
            "git status --short": T.prebuild["git status --short"],
          },
          available: ["npx expo prebuild --platform android --no-install", "ls android", "git status --short"],
          accept: ["npx expo prebuild --platform android --no-install"],
          near: [{ command: "ls android", why: "The folder does not exist until prebuild generates it." }],
          hint: "npx expo prebuild, for Android only, with --no-install.",
          success: "A complete Android project, generated. The template's .gitignore lists /android and /ios, so git status shows none of it: it is rebuilt whenever needed, from app.json.",
        },
      },
      {
        id: "a-md-create-current",
        title: "Creating a project with the current Expo tooling",
        explain:
          "npx create-expo-app@latest always uses the current SDK's default template: TypeScript, Expo Router with screens in src/app/, a tab bar, light and dark themes and some example components. When you are ready to start your own app, run npm run reset-project: it moves the example code into an example folder and leaves a blank src/app/ with one screen. Other templates exist (npx create-expo-app@latest --template shows them, such as blank-typescript). Keep the SDK current: each SDK release comes with a migration guide, and npx expo install --fix moves your packages to the matching versions. Read the version-matched docs at docs.expo.dev, because Expo's APIs change between SDKs.",
        decision: {
          scenario: "You created a project yesterday and want to start building your own app, but the template's tabs, example components and images are in the way.",
          question: "What is the intended way to get a clean start?",
          options: [
            { id: "a", text: "Run npm run reset-project, which moves the examples into an example folder and leaves a blank src/app", why: "The template provides this script for exactly this moment, and keeps the examples to look at." },
            { id: "b", text: "Delete the whole src folder", whyWrong: "You lose the configuration the template set up, and the examples you might want to read." },
            { id: "c", text: "Create a new project with an old SDK", whyWrong: "Always start on the current SDK." },
            { id: "d", text: "Leave the template code and build around it", whyWrong: "Unused example code makes the project harder to understand." },
          ],
          correct: "a",
          aftermath: "Read the template, then reset it and make it yours.",
        },
      },
      {
        id: "a-md-project-structure",
        title: "Understanding the project structure",
        explain:
          "With Expo Router, the FILES in src/app/ ARE the screens: src/app/index.tsx is the route /, src/app/about.tsx is /about, src/app/notes/[id].tsx is /notes/42. Each screen file must default-export a component. _layout.tsx files arrange the screens in that folder (a Stack, Tabs…), and in SDK 58 a navigator shows only the screens it DECLARES with <Stack.Screen name=\"…\" />. Everything that is not a screen lives outside src/app: components, hooks, constants, lib. To add a screen you create its file, declare it in the layout, and link to it with <Link href=\"/about\">.",
        webLab: expoLab({
          name: "Notes",
          editable: ["src/app/_layout.tsx"],
          task:
            "Add an About screen. Write the screen in src/app/about.tsx: a default-exported component showing \"About Notes\" and \"Version 1.0.0\". Declare it in src/app/_layout.tsx with the title \"About\", and add a link on the home screen, \"About this app\", to /about.",
          files: {
            "src/app/about.tsx": "// The About screen: default-export a component from this file.\n",
            "src/app/index.tsx": ABOUT_HOME(false),
            "src/app/_layout.tsx": layout("Notes"),
          },
          solution: {
            "src/app/about.tsx": `import { StyleSheet, Text, View } from "react-native";\n\nexport default function AboutScreen() {\n  return (\n    <View style={styles.page}>\n      <Text style={styles.title}>About Notes</Text>\n      <Text>Version 1.0.0</Text>\n    </View>\n  );\n}\n\nconst styles = StyleSheet.create({\n  page: { flex: 1, padding: 24, gap: 8 },\n  title: { fontSize: 22, fontWeight: "700" },\n});\n`,
            "src/app/index.tsx": ABOUT_HOME(true),
            "src/app/_layout.tsx": layout("Notes", `\n      <Stack.Screen name="about" options={{ title: "About" }} />`),
          },
          tests: [
            { label: "Home links to the About screen", check: "await press('About this app'); return path() === '/about';", fail: "<Link href=\"/about\">About this app</Link> on the home screen." },
            { label: "The About screen shows its text, titled About", check: "await navigate('/about'); return has('About Notes') && has('Version 1.0.0') && screenTitle() === 'About';", fail: "Default-export the screen, and declare <Stack.Screen name=\"about\" options={{ title: \"About\" }} />." },
            { label: "Back returns home", check: "await navigate('/about'); await back(); return path() === '/' && has('Notes');", fail: "The about screen is pushed on the stack." },
          ],
          hint: "Three files: the screen itself, its declaration in the layout, and a Link to it.",
          successMessage: "A new route, declared and linked. Every screen you add works like this.",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════ LESSON 37 · 7.5 – 7.6 ═══════════════ */
  {
    id: "md-l37-jsx-components",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 2,
    covers: ["7.5", "7.6"],
    title: "JSX, Components and Props",
    subtitle: "Describing screens, and building them from reusable parts",
    estimatedMinutes: 50,
    intro: "A React Native screen is a function that returns a description of what to draw, written in JSX. Screens are built from smaller components that each do one job.",
    atoms: [
      {
        id: "a-md-jsx",
        title: "JavaScript and JSX in mobile development",
        explain:
          "JSX looks like markup but is JavaScript: <Text style={styles.title}>Hi</Text> becomes a function call. Rules: a component returns ONE root (wrap siblings in a <View> or a fragment <>…</>); every tag closes (<Image /> self-closes); attributes are camelCase props (onPress, numberOfLines); strings go inside <Text>; and anything in curly braces is a JavaScript EXPRESSION: {member.firstName}, {2026 - member.joined}, {badges.length > 0 ? … : …}. Statements (if, for) do not fit inside braces; use the ternary, && and map instead. Comments in JSX are {/* like this */}.",
        webLab: expoLab({
          name: "Members",
          layout: layout("Member"),
          task:
            "Build the member card in src/app/index.tsx from the data in src/data/member.ts, with expressions in braces (no typing the values by hand): the full name (\"Chidi Okeke\"), \"Enugu · member for 3 years\" (2026 minus joined), and \"2 badges: Early adopter, Top reviewer\" (the count, then the badges joined with a comma and a space).",
          files: {
            "src/app/index.tsx": `import { StyleSheet, Text, View } from "react-native";\nimport { member } from "@/data/member";\n\nexport default function MemberScreen() {\n  return (\n    <View style={styles.card}>\n      <Text style={styles.name}>Name goes here</Text>\n    </View>\n  );\n}\n\nconst styles = StyleSheet.create({\n  card: { margin: 20, padding: 20, borderRadius: 16, backgroundColor: "#f1f5f4", gap: 6 },\n  name: { fontSize: 22, fontWeight: "700" },\n});\n`,
            "src/data/member.ts": PROFILE_DATA,
          },
          readOnly: ["src/data/member.ts"],
          solution: {
            "src/app/index.tsx": `import { StyleSheet, Text, View } from "react-native";\nimport { member } from "@/data/member";\n\nexport default function MemberScreen() {\n  return (\n    <View style={styles.card}>\n      <Text style={styles.name}>\n        {member.firstName} {member.lastName}\n      </Text>\n      <Text>\n        {member.city} · member for {2026 - member.joined} years\n      </Text>\n      <Text>\n        {member.badges.length} badges: {member.badges.join(", ")}\n      </Text>\n    </View>\n  );\n}\n\nconst styles = StyleSheet.create({\n  card: { margin: 20, padding: 20, borderRadius: 16, backgroundColor: "#f1f5f4", gap: 6 },\n  name: { fontSize: 22, fontWeight: "700" },\n});\n`,
          },
          tests: [
            { label: "The full name is shown", check: "return has('Chidi Okeke');", fail: "{member.firstName} {member.lastName}" },
            { label: "City and years are calculated", check: "return has('Enugu · member for 3 years') && /2026\\s*-\\s*member\\.joined/.test(code('src/app/index.tsx'));", fail: "{member.city} · member for {2026 - member.joined} years" },
            { label: "Badges are counted and joined", check: "return has('2 badges: Early adopter, Top reviewer') && /badges\\.join/.test(code('src/app/index.tsx'));", fail: "{member.badges.length} badges: {member.badges.join(\", \")}" },
          ],
          hint: "Text and expressions mix freely inside <Text>: Hello {name}!",
          successMessage: "Data in, a screen out. Change member.ts and the card follows.",
        }),
      },
      {
        id: "a-md-components-props",
        title: "Components, props and reusable UI",
        explain:
          "A COMPONENT is a function whose name starts with a capital letter and returns JSX. It receives PROPS, an object of inputs, which you type with TypeScript: type ProductCardProps = { name: string; price: number; badge?: string }; function ProductCard({ name, price, badge }: ProductCardProps). Props flow DOWN from parent to child and are read-only. Optional props (?) need a sensible default or a check. Put shared components in src/components/, one per file, and export them by name. A component that does one job, shaped by its props, can be used on any screen.",
        webLab: expoLab({
          name: "Shop",
          layout: layout("Today's deals"),
          task:
            "Write ProductCard in src/components/ProductCard.tsx: a named export taking typed props name (string), price (number) and an optional badge (string). It shows the name, the price as \"₦9,500\" (use formatNaira) and, only when there is one, the badge. The home screen already renders three cards.",
          files: {
            "src/components/ProductCard.tsx": `import { StyleSheet, Text, View } from "react-native";\nimport { formatNaira } from "@/lib/money";\n\n// Write and export ProductCard here.\n`,
            "src/lib/money.ts": `export function formatNaira(amount: number): string {\n  return "₦" + Math.round(amount).toLocaleString("en-NG");\n}\n`,
            "src/app/index.tsx": `import { ScrollView } from "react-native";\nimport { ProductCard } from "@/components/ProductCard";\n\nexport default function Deals() {\n  return (\n    <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>\n      <ProductCard name="Rice (5kg)" price={9500} badge="Best seller" />\n      <ProductCard name="Palm oil (1L)" price={3200} />\n      <ProductCard name="Garri (2kg)" price={2600} badge="New" />\n    </ScrollView>\n  );\n}\n`,
          },
          readOnly: ["src/lib/money.ts", "src/app/index.tsx"],
          solution: {
            "src/components/ProductCard.tsx": `import { StyleSheet, Text, View } from "react-native";\nimport { formatNaira } from "@/lib/money";\n\ntype ProductCardProps = {\n  name: string;\n  price: number;\n  badge?: string;\n};\n\nexport function ProductCard({ name, price, badge }: ProductCardProps) {\n  return (\n    <View style={styles.card} testID="product-card">\n      {badge ? <Text style={styles.badge}>{badge}</Text> : null}\n      <Text style={styles.name}>{name}</Text>\n      <Text style={styles.price}>{formatNaira(price)}</Text>\n    </View>\n  );\n}\n\nconst styles = StyleSheet.create({\n  card: { padding: 16, borderRadius: 14, backgroundColor: "#f8fafc", gap: 4 },\n  badge: { alignSelf: "flex-start", paddingHorizontal: 8, borderRadius: 6, backgroundColor: "#ccfbf1", color: "#115e59", fontSize: 12 },\n  name: { fontSize: 17, fontWeight: "600" },\n  price: { fontSize: 16, color: "#0f766e", fontWeight: "700" },\n});\n`,
          },
          tests: [
            { label: "Three cards with names and formatted prices", check: "return has('Rice (5kg)') && has('₦9,500') && has('Palm oil (1L)') && has('₦3,200') && has('₦2,600');", fail: "Show {name} and {formatNaira(price)}." },
            { label: "Badges appear only on the cards that have one", check: "return has('Best seller') && has('New') && texts().filter((t) => t === 'Best seller' || t === 'New').length === 2;", fail: "{badge ? <Text>{badge}</Text> : null}" },
            { label: "The props are typed, with badge optional", check: "return /badge\\?\\s*:\\s*string/.test(code('src/components/ProductCard.tsx')) && /price\\s*:\\s*number/.test(code('src/components/ProductCard.tsx'));", fail: "type ProductCardProps = { name: string; price: number; badge?: string }" },
          ],
          hint: "Destructure the props in the function's parameters: function ProductCard({ name, price, badge }: ProductCardProps).",
          successMessage: "One component, three cards. Change the card once and every deal changes.",
        }),
      },
      {
        id: "a-md-children",
        title: "Composition with children",
        explain:
          "A component can wrap OTHER components: whatever you put between its tags arrives as the children prop. A Section component can draw a title and a card background around any content: <Section title=\"Account\"><Text>…</Text></Section>. Type it with React.ReactNode: { title: string; children: React.ReactNode }. Composition keeps components small: the Section does not need to know what is inside it, and screens read like an outline of themselves.",
        webLab: expoLab({
          name: "Settings",
          layout: layout("Settings"),
          task:
            "Write Section in src/components/Section.tsx: a named export with props title (string) and children (React.ReactNode). It renders the title as a header (accessibilityRole=\"header\") above a card (testID \"section-card\") that holds the children. The settings screen uses it for two sections.",
          files: {
            "src/components/Section.tsx": `import type { ReactNode } from "react";\nimport { StyleSheet, Text, View } from "react-native";\n\n// Write and export Section here.\n`,
            "src/app/index.tsx": `import { ScrollView, Text } from "react-native";\nimport { Section } from "@/components/Section";\n\nexport default function Settings() {\n  return (\n    <ScrollView contentContainerStyle={{ padding: 16, gap: 20 }}>\n      <Section title="Account">\n        <Text>Ada Obi</Text>\n        <Text>ada@example.com</Text>\n      </Section>\n      <Section title="Notifications">\n        <Text>Reminders are on</Text>\n      </Section>\n    </ScrollView>\n  );\n}\n`,
          },
          readOnly: ["src/app/index.tsx"],
          solution: {
            "src/components/Section.tsx": `import type { ReactNode } from "react";\nimport { StyleSheet, Text, View } from "react-native";\n\ntype SectionProps = { title: string; children: ReactNode };\n\nexport function Section({ title, children }: SectionProps) {\n  return (\n    <View style={styles.section}>\n      <Text accessibilityRole="header" style={styles.title}>\n        {title}\n      </Text>\n      <View style={styles.card} testID="section-card">\n        {children}\n      </View>\n    </View>\n  );\n}\n\nconst styles = StyleSheet.create({\n  section: { gap: 8 },\n  title: { fontSize: 13, fontWeight: "700", color: "#475569", textTransform: "uppercase" },\n  card: { padding: 16, borderRadius: 12, backgroundColor: "#f1f5f9", gap: 6 },\n});\n`,
          },
          tests: [
            { label: "Two section headers", check: "return findAll({ role: 'header' }).map((h) => h.textContent).join() === 'Account,Notifications';", fail: "<Text accessibilityRole=\"header\">{title}</Text>" },
            { label: "Each card holds its own children", check: "const cards = findAll({ testID: 'section-card' }); return cards.length === 2 && cards[0].textContent.includes('ada@example.com') && cards[1].textContent.includes('Reminders are on') && !cards[1].textContent.includes('Ada Obi');", fail: "Render {children} inside the card View." },
          ],
          hint: "children is just another prop: destructure it and put {children} where it belongs.",
          successMessage: "A wrapper that knows nothing about its contents: composition.",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════ LESSON 38 · 7.7 – 7.9 ═══════════════ */
  {
    id: "md-l38-state-events",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 3,
    covers: ["7.7", "7.8", "7.9"],
    title: "State, Events and Conditional Rendering",
    subtitle: "Screens that remember, respond and change",
    estimatedMinutes: 50,
    intro: "A screen comes alive when it remembers what the user did and redraws itself. That memory is state, it changes in response to events, and conditional rendering decides what to show for it.",
    atoms: [
      {
        id: "a-md-use-state",
        title: "State management with useState",
        explain:
          "STATE is data a component remembers between renders that changes because of what happens: a count, the text typed, whether a panel is open. const [quantity, setQuantity] = useState(1) gives you the current value and a setter. Calling the setter tells React to re-render the component with the new value, which is the ONLY way to change what is on screen. Never assign to the variable directly. When the new value depends on the old, use the functional form: setQuantity((q) => q + 1). TypeScript infers the type from the initial value; give it explicitly when it can be null: useState<string | null>(null).",
        webLab: expoLab({
          name: "Cart",
          layout: layout("Quantity"),
          task:
            "Build a quantity stepper in src/app/index.tsx. Keep the quantity in state, starting at 1. The − button (accessibilityLabel \"Decrease\") lowers it and + (\"Increase\") raises it, never below 1 or above 10 (disable the buttons at the limits). Show the quantity, and the total as \"Total: ₦2,500\" for a price of ₦2,500 each.",
          files: {
            "src/app/index.tsx": `import { Pressable, StyleSheet, Text, View } from "react-native";\n\nconst PRICE = 2500;\n\nexport default function Stepper() {\n  return (\n    <View style={styles.page}>\n      <View style={styles.row}>\n        <Pressable accessibilityRole="button" accessibilityLabel="Decrease" style={styles.button}>\n          <Text style={styles.sign}>−</Text>\n        </Pressable>\n        <Text style={styles.qty}>1</Text>\n        <Pressable accessibilityRole="button" accessibilityLabel="Increase" style={styles.button}>\n          <Text style={styles.sign}>+</Text>\n        </Pressable>\n      </View>\n      <Text style={styles.total}>Total: ₦2,500</Text>\n    </View>\n  );\n}\n\nconst styles = StyleSheet.create({\n  page: { flex: 1, alignItems: "center", justifyContent: "center", gap: 24 },\n  row: { flexDirection: "row", alignItems: "center", gap: 24 },\n  button: { width: 48, height: 48, borderRadius: 24, backgroundColor: "#e2e8f0", alignItems: "center", justifyContent: "center" },\n  sign: { fontSize: 24 },\n  qty: { fontSize: 28, fontWeight: "700", minWidth: 40, textAlign: "center" },\n  total: { fontSize: 18 },\n});\n`,
          },
          solution: {
            "src/app/index.tsx": `import { useState } from "react";\nimport { Pressable, StyleSheet, Text, View } from "react-native";\n\nconst PRICE = 2500;\n\nexport default function Stepper() {\n  const [quantity, setQuantity] = useState(1);\n  return (\n    <View style={styles.page}>\n      <View style={styles.row}>\n        <Pressable accessibilityRole="button" accessibilityLabel="Decrease" disabled={quantity === 1} onPress={() => setQuantity((q) => q - 1)} style={styles.button}>\n          <Text style={styles.sign}>−</Text>\n        </Pressable>\n        <Text style={styles.qty}>{quantity}</Text>\n        <Pressable accessibilityRole="button" accessibilityLabel="Increase" disabled={quantity === 10} onPress={() => setQuantity((q) => q + 1)} style={styles.button}>\n          <Text style={styles.sign}>+</Text>\n        </Pressable>\n      </View>\n      <Text style={styles.total}>Total: ₦{(quantity * PRICE).toLocaleString("en-NG")}</Text>\n    </View>\n  );\n}\n\nconst styles = StyleSheet.create({\n  page: { flex: 1, alignItems: "center", justifyContent: "center", gap: 24 },\n  row: { flexDirection: "row", alignItems: "center", gap: 24 },\n  button: { width: 48, height: 48, borderRadius: 24, backgroundColor: "#e2e8f0", alignItems: "center", justifyContent: "center" },\n  sign: { fontSize: 24 },\n  qty: { fontSize: 28, fontWeight: "700", minWidth: 40, textAlign: "center" },\n  total: { fontSize: 18 },\n});\n`,
          },
          tests: [
            { label: "+ and − change the quantity and the total", check: "await press({ label: 'Increase' }); await press({ label: 'Increase' }); await press({ label: 'Decrease' }); return has('2') && has('Total: ₦5,000');", fail: "useState(1); onPress={() => setQuantity((q) => q + 1)}" },
            { label: "It never goes below 1: − is disabled there", check: "await restart(); return disabled({ label: 'Decrease' }) && !disabled({ label: 'Increase' });", fail: "disabled={quantity === 1}" },
            { label: "It stops at 10", check: "for (let i = 0; i < 12; i++) await press({ label: 'Increase' }); return has('10') && disabled({ label: 'Increase' }) && has('Total: ₦25,000');", fail: "disabled={quantity === 10}" },
          ],
          hint: "The total is calculated from state during render: it is not state itself.",
          successMessage: "One piece of state; the number, the total and the limits all follow from it.",
        }),
      },
      {
        id: "a-md-events",
        title: "Handling user interactions and events",
        explain:
          "Touch events are props you give a function: onPress (a tap), onLongPress (holding about half a second), onPressIn and onPressOut (finger down and up). Pass the function itself, onPress={save}, or an arrow function when you need arguments, onPress={() => remove(item.id)}; never onPress={save()}, which calls it immediately while rendering. TextInput has onChangeText (the new text) and onSubmitEditing (the Return key). Keep handlers small: they update state, and the screen re-renders from it. Give quick feedback for every tap, such as a pressed style or haptics (Module 16).",
        webLab: expoLab({
          name: "Photos",
          layout: layout("Photo"),
          task:
            "Make the photo card interactive. Tapping the heart button (accessibilityLabel \"Like\") toggles liked: the button's label becomes \"Unlike\" and the count goes from 41 to 42 likes (and back). A long press anywhere on the card (testID \"card\") reveals the text \"Saved to favourites\".",
          files: {
            "src/app/index.tsx": `import { Pressable, StyleSheet, Text, View } from "react-native";\n\nexport default function PhotoCard() {\n  return (\n    <View style={styles.page}>\n      <Pressable testID="card" style={styles.card}>\n        <View style={styles.photo} />\n        <View style={styles.row}>\n          <Pressable accessibilityRole="button" accessibilityLabel="Like" style={styles.like}>\n            <Text style={styles.heart}>♡</Text>\n          </Pressable>\n          <Text>41 likes</Text>\n        </View>\n      </Pressable>\n    </View>\n  );\n}\n\nconst styles = StyleSheet.create({\n  page: { flex: 1, padding: 16 },\n  card: { borderRadius: 16, backgroundColor: "#f8fafc", overflow: "hidden" },\n  photo: { height: 220, backgroundColor: "#99f6e4" },\n  row: { flexDirection: "row", alignItems: "center", gap: 8, padding: 8 },\n  like: { width: 48, height: 48, alignItems: "center", justifyContent: "center" },\n  heart: { fontSize: 24, color: "#e11d48" },\n});\n`,
          },
          solution: {
            "src/app/index.tsx": `import { useState } from "react";\nimport { Pressable, StyleSheet, Text, View } from "react-native";\n\nexport default function PhotoCard() {\n  const [liked, setLiked] = useState(false);\n  const [saved, setSaved] = useState(false);\n  return (\n    <View style={styles.page}>\n      <Pressable testID="card" onLongPress={() => setSaved(true)} style={styles.card}>\n        <View style={styles.photo} />\n        <View style={styles.row}>\n          <Pressable accessibilityRole="button" accessibilityLabel={liked ? "Unlike" : "Like"} onPress={() => setLiked((v) => !v)} style={styles.like}>\n            <Text style={styles.heart}>{liked ? "♥" : "♡"}</Text>\n          </Pressable>\n          <Text>{liked ? 42 : 41} likes</Text>\n        </View>\n        {saved ? <Text style={styles.saved}>Saved to favourites</Text> : null}\n      </Pressable>\n    </View>\n  );\n}\n\nconst styles = StyleSheet.create({\n  page: { flex: 1, padding: 16 },\n  card: { borderRadius: 16, backgroundColor: "#f8fafc", overflow: "hidden" },\n  photo: { height: 220, backgroundColor: "#99f6e4" },\n  row: { flexDirection: "row", alignItems: "center", gap: 8, padding: 8 },\n  like: { width: 48, height: 48, alignItems: "center", justifyContent: "center" },\n  heart: { fontSize: 24, color: "#e11d48" },\n  saved: { padding: 8, color: "#0f766e", fontWeight: "600" },\n});\n`,
          },
          tests: [
            { label: "Like toggles the label and the count", check: "await press({ label: 'Like' }); const on = has('42 likes') && Boolean(find({ label: 'Unlike' })); await press({ label: 'Unlike' }); return on && has('41 likes') && Boolean(find({ label: 'Like' }));", fail: "const [liked, setLiked] = useState(false); onPress={() => setLiked((v) => !v)}" },
            { label: "A long press saves to favourites", check: "const ok = await longPress({ testID: 'card' }); return ok && has('Saved to favourites');", fail: "onLongPress={() => setSaved(true)} on the card." },
          ],
          hint: "Two independent pieces of state: liked and saved.",
          successMessage: "Taps and long presses, each changing state, the screen following.",
        }),
      },
      {
        id: "a-md-conditional",
        title: "Conditional rendering",
        explain:
          "Show different things for different state with plain JavaScript in braces: a ternary for either/or ({loading ? <ActivityIndicator /> : <List />}), && for show-or-nothing ({error && <Text>{error}</Text>}), or an early return for whole-screen states (if (!user) return <SignIn />). The React Native trap: {count && <Badge />} renders the number 0 when count is 0, and a bare number outside <Text> crashes on a phone (\"Text strings must be rendered within a <Text> component\"). Use a real boolean: {count > 0 && <Badge />}, or a ternary with null.",
        webLab: expoLab({
          name: "Inbox",
          layout: layout("Inbox"),
          task:
            "The inbox shows \"0\" when there are no unread messages, because of {unread && …}. Fix it: show the badge \"N unread\" only when unread is more than 0. And when messages is empty, show \"No messages yet\" instead of the list. The buttons let you try every state.",
          files: {
            "src/app/index.tsx": `import { useState } from "react";\nimport { Pressable, StyleSheet, Text, View } from "react-native";\n\nexport default function Inbox() {\n  const [messages, setMessages] = useState<string[]>(["Your order shipped", "Welcome to Kobo"]);\n  const [unread, setUnread] = useState(0);\n  return (\n    <View style={styles.page}>\n      <Text style={styles.title}>Messages</Text>\n      {unread && <Text style={styles.badge}>{unread} unread</Text>}\n      {messages.map((m) => (\n        <Text key={m} style={styles.item}>\n          {m}\n        </Text>\n      ))}\n      <Pressable accessibilityRole="button" onPress={() => setUnread((n) => n + 1)} style={styles.button}>\n        <Text>New message</Text>\n      </Pressable>\n      <Pressable accessibilityRole="button" onPress={() => setMessages([])} style={styles.button}>\n        <Text>Clear all</Text>\n      </Pressable>\n    </View>\n  );\n}\n\nconst styles = StyleSheet.create({\n  page: { flex: 1, padding: 20, gap: 10 },\n  title: { fontSize: 24, fontWeight: "700" },\n  badge: { alignSelf: "flex-start", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, backgroundColor: "#fee2e2", color: "#b91c1c" },\n  item: { padding: 12, borderRadius: 8, backgroundColor: "#f8fafc" },\n  button: { minHeight: 44, justifyContent: "center", paddingHorizontal: 12, borderRadius: 8, backgroundColor: "#e2e8f0" },\n});\n`,
          },
          solution: {
            "src/app/index.tsx": `import { useState } from "react";\nimport { Pressable, StyleSheet, Text, View } from "react-native";\n\nexport default function Inbox() {\n  const [messages, setMessages] = useState<string[]>(["Your order shipped", "Welcome to Kobo"]);\n  const [unread, setUnread] = useState(0);\n  return (\n    <View style={styles.page}>\n      <Text style={styles.title}>Messages</Text>\n      {unread > 0 ? <Text style={styles.badge}>{unread} unread</Text> : null}\n      {messages.length === 0 ? (\n        <Text>No messages yet</Text>\n      ) : (\n        messages.map((m) => (\n          <Text key={m} style={styles.item}>\n            {m}\n          </Text>\n        ))\n      )}\n      <Pressable accessibilityRole="button" onPress={() => setUnread((n) => n + 1)} style={styles.button}>\n        <Text>New message</Text>\n      </Pressable>\n      <Pressable accessibilityRole="button" onPress={() => setMessages([])} style={styles.button}>\n        <Text>Clear all</Text>\n      </Pressable>\n    </View>\n  );\n}\n\nconst styles = StyleSheet.create({\n  page: { flex: 1, padding: 20, gap: 10 },\n  title: { fontSize: 24, fontWeight: "700" },\n  badge: { alignSelf: "flex-start", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, backgroundColor: "#fee2e2", color: "#b91c1c" },\n  item: { padding: 12, borderRadius: 8, backgroundColor: "#f8fafc" },\n  button: { minHeight: 44, justifyContent: "center", paddingHorizontal: 12, borderRadius: 8, backgroundColor: "#e2e8f0" },\n});\n`,
          },
          tests: [
            { label: "No stray 0 when nothing is unread", check: "return !screen().split(' | ').includes('0') && !hasText('unread');", fail: "{unread > 0 ? <Text>…</Text> : null}" },
            { label: "The badge appears with a count", check: "await press('New message'); await press('New message'); return has('2 unread');", fail: "Show the badge when unread > 0." },
            { label: "An empty inbox says so", check: "await press('Clear all'); return has('No messages yet') && !has('Welcome to Kobo');", fail: "messages.length === 0 ? <Text>No messages yet</Text> : messages.map(…)" },
          ],
          hint: "&& returns its left side when that side is falsy, and 0 is falsy but still drawn.",
          successMessage: "Every state shows the right thing, and nothing shows a stray 0.",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════ LESSON 39 · 7.10 – 7.11 ═══════════════ */
  {
    id: "md-l39-lists-core",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 4,
    covers: ["7.10", "7.11"],
    title: "Lists and the Core Components",
    subtitle: "FlatList, ScrollView, View, Text, Image and Pressable",
    estimatedMinutes: 50,
    intro: "Most screens are a list of something, built from a handful of core components. Using the right one for each job is the difference between a smooth app and a slow one.",
    atoms: [
      {
        id: "a-md-flatlist",
        title: "Rendering lists with FlatList",
        explain:
          "FlatList renders a long list efficiently: it only creates the rows that are on screen (or about to be), so a list of 5,000 contacts stays fast. Give it data (an array), renderItem (a function from { item } to a row) and keyExtractor (a unique string per item, so React keeps track of rows). Useful extras: ItemSeparatorComponent, ListHeaderComponent, ListEmptyComponent (shown for an empty array) and onEndReached (load more, Module 13). Never render a long array with map inside a ScrollView: every row is created at once.",
        webLab: expoLab({
          name: "Contacts",
          layout: layout("Contacts"),
          task:
            "Show the contacts with a FlatList: each row (testID \"contact\") shows the name and phone number, a separator between rows (testID \"separator\"), a header \"5 contacts\" (the count from the data) and, for an empty list, \"No contacts yet\". Use the contact's id as the key. The Clear button empties the list.",
          files: {
            "src/app/index.tsx": `import { useState } from "react";\nimport { FlatList, Pressable, StyleSheet, Text, View } from "react-native";\nimport { CONTACTS, type Contact } from "@/data/contacts";\n\nexport default function Contacts() {\n  const [contacts, setContacts] = useState<Contact[]>(CONTACTS);\n  return (\n    <View style={styles.page}>\n      <Pressable accessibilityRole="button" onPress={() => setContacts([])} style={styles.clear}>\n        <Text>Clear</Text>\n      </Pressable>\n      {/* Your FlatList here */}\n    </View>\n  );\n}\n\nconst styles = StyleSheet.create({\n  page: { flex: 1 },\n  clear: { margin: 12, minHeight: 44, justifyContent: "center", alignItems: "center", borderRadius: 8, backgroundColor: "#e2e8f0" },\n  row: { padding: 16, gap: 2 },\n  name: { fontSize: 16, fontWeight: "600" },\n  phone: { color: "#64748b" },\n  separator: { height: 1, backgroundColor: "#e2e8f0", marginLeft: 16 },\n  header: { paddingHorizontal: 16, paddingVertical: 8, color: "#475569" },\n  empty: { padding: 24, textAlign: "center", color: "#64748b" },\n});\n`,
            "src/data/contacts.ts": `export type Contact = { id: string; name: string; phone: string };\n\nexport const CONTACTS: Contact[] = [\n  { id: "c1", name: "Amaka Eze", phone: "0803 555 0101" },\n  { id: "c2", name: "Bola Ade", phone: "0805 555 0102" },\n  { id: "c3", name: "Femi Ojo", phone: "0807 555 0103" },\n  { id: "c4", name: "Ngozi Uche", phone: "0809 555 0104" },\n  { id: "c5", name: "Tunde Bakare", phone: "0811 555 0105" },\n];\n`,
          },
          readOnly: ["src/data/contacts.ts"],
          solution: {
            "src/app/index.tsx": `import { useState } from "react";\nimport { FlatList, Pressable, StyleSheet, Text, View } from "react-native";\nimport { CONTACTS, type Contact } from "@/data/contacts";\n\nexport default function Contacts() {\n  const [contacts, setContacts] = useState<Contact[]>(CONTACTS);\n  return (\n    <View style={styles.page}>\n      <Pressable accessibilityRole="button" onPress={() => setContacts([])} style={styles.clear}>\n        <Text>Clear</Text>\n      </Pressable>\n      <FlatList\n        data={contacts}\n        keyExtractor={(contact) => contact.id}\n        renderItem={({ item }) => (\n          <View style={styles.row} testID="contact">\n            <Text style={styles.name}>{item.name}</Text>\n            <Text style={styles.phone}>{item.phone}</Text>\n          </View>\n        )}\n        ItemSeparatorComponent={() => <View style={styles.separator} testID="separator" />}\n        ListHeaderComponent={contacts.length > 0 ? <Text style={styles.header}>{contacts.length} contacts</Text> : undefined}\n        ListEmptyComponent={<Text style={styles.empty}>No contacts yet</Text>}\n      />\n    </View>\n  );\n}\n\nconst styles = StyleSheet.create({\n  page: { flex: 1 },\n  clear: { margin: 12, minHeight: 44, justifyContent: "center", alignItems: "center", borderRadius: 8, backgroundColor: "#e2e8f0" },\n  row: { padding: 16, gap: 2 },\n  name: { fontSize: 16, fontWeight: "600" },\n  phone: { color: "#64748b" },\n  separator: { height: 1, backgroundColor: "#e2e8f0", marginLeft: 16 },\n  header: { paddingHorizontal: 16, paddingVertical: 8, color: "#475569" },\n  empty: { padding: 24, textAlign: "center", color: "#64748b" },\n});\n`,
          },
          tests: [
            { label: "Five rows with name and phone, and a header count", check: "return findAll({ testID: 'contact' }).length === 5 && has('Tunde Bakare') && has('0811 555 0105') && has('5 contacts');", fail: "<FlatList data={contacts} renderItem={…} keyExtractor={(c) => c.id} />" },
            { label: "Separators between the rows (four for five rows)", check: "return findAll({ testID: 'separator' }).length === 4;", fail: "ItemSeparatorComponent={() => <View testID=\"separator\" … />}" },
            { label: "An empty list says so", check: "await press('Clear'); return has('No contacts yet') && findAll({ testID: 'contact' }).length === 0;", fail: "ListEmptyComponent={<Text>No contacts yet</Text>}" },
            { label: "It is a FlatList keyed by id", check: "const c = code('src/app/index.tsx'); return /<FlatList/.test(c) && /keyExtractor/.test(c) && !/contacts\\.map/.test(c);", fail: "Use FlatList, not map." },
          ],
          hint: "renderItem receives an object: ({ item }) => …",
          successMessage: "A list that stays fast however long it gets, with its empty state designed.",
        }),
      },
      {
        id: "a-md-scrollview",
        title: "ScrollView and horizontal scrolling",
        explain:
          "ScrollView scrolls ALL its children, created at once: right for a screen of mixed content that is a bit taller than the phone (a profile, a settings page, a form), wrong for long or growing lists. Style the inside with contentContainerStyle (padding, gap), not style. horizontal turns it sideways for a row of cards or chips, usually with showsHorizontalScrollIndicator={false}. For a long horizontal list, FlatList has horizontal too. Nest carefully: a vertical FlatList inside a vertical ScrollView breaks virtualisation (React Native warns about it).",
        decision: {
          scenario: "A shop's home screen has a banner, a row of eight category chips that scrolls sideways, and below that the full product catalogue of 3,000 items.",
          question: "Which structure is best?",
          options: [
            { id: "a", text: "A FlatList for the catalogue, with the banner and a horizontal ScrollView of chips as its ListHeaderComponent", why: "One virtualised list for the 3,000 items; the small fixed content rides along in the header." },
            { id: "b", text: "One big ScrollView containing everything, with products drawn by map", whyWrong: "3,000 rows created at once: slow start, high memory." },
            { id: "c", text: "A vertical FlatList inside a vertical ScrollView", whyWrong: "Nesting breaks virtualisation, and React Native warns about it." },
            { id: "d", text: "Three separate screens", whyWrong: "The design is one scrolling screen." },
          ],
          correct: "a",
          aftermath: "ScrollView for short content, FlatList for lists, and headers for what sits above a list.",
        },
      },
      {
        id: "a-md-core-components",
        title: "Understanding View, Text, Image and Pressable",
        explain:
          "VIEW is the box every layout is made of (like a div). TEXT draws text: it can nest for mixed styles, and numberOfLines={2} truncates with an ellipsis. IMAGE shows a picture: local files with source={require(\"@/assets/images/hero.jpg\")} (sized from the file) or remote ones with source={{ uri }}, which need an explicit width and height; resizeMode \"cover\" fills and crops, \"contain\" fits. Give meaningful images an accessibilityLabel. PRESSABLE makes anything tappable, and its style can be a function of the pressed state: style={({ pressed }) => [styles.row, pressed && styles.pressed]}, giving instant feedback. (Expo's own expo-image adds caching and placeholders; Module 17.)",
        webLab: expoLab({
          name: "Recipes",
          layout: layout("Recipe"),
          task:
            "Build the recipe card in src/app/index.tsx: an Image of require(\"@/assets/images/hero.jpg\"), 180 high and full width, with resizeMode \"cover\" and accessibilityLabel \"A pot of jollof rice\"; the title \"Party jollof rice\"; and the description limited to two lines (numberOfLines). Make the whole card a Pressable (accessibilityRole \"button\", accessibilityLabel \"Open Party jollof rice\") whose style turns its opacity to 0.7 while pressed.",
          files: {
            "src/app/index.tsx": `import { Image, Pressable, StyleSheet, Text, View } from "react-native";\n\nconst DESCRIPTION =\n  "Smoky, rich and slightly spicy, cooked slowly over a low fire so the bottom catches just enough to give it the famous party flavour that everyone fights over.";\n\nexport default function RecipeCard() {\n  return (\n    <View style={styles.page}>\n      <Text>{DESCRIPTION}</Text>\n    </View>\n  );\n}\n\nconst styles = StyleSheet.create({\n  page: { flex: 1, padding: 16 },\n  card: { borderRadius: 16, overflow: "hidden", backgroundColor: "#fff7ed" },\n  image: { width: "100%", height: 180 },\n  title: { fontSize: 20, fontWeight: "700", paddingHorizontal: 12, paddingTop: 12 },\n  body: { padding: 12, color: "#57534e" },\n  pressed: { opacity: 0.7 },\n});\n`,
          },
          solution: {
            "src/app/index.tsx": `import { Image, Pressable, StyleSheet, Text, View } from "react-native";\n\nconst DESCRIPTION =\n  "Smoky, rich and slightly spicy, cooked slowly over a low fire so the bottom catches just enough to give it the famous party flavour that everyone fights over.";\n\nexport default function RecipeCard() {\n  return (\n    <View style={styles.page}>\n      <Pressable\n        accessibilityRole="button"\n        accessibilityLabel="Open Party jollof rice"\n        style={({ pressed }) => [styles.card, pressed && styles.pressed]}\n      >\n        <Image source={require("@/assets/images/hero.jpg")} style={styles.image} resizeMode="cover" accessibilityLabel="A pot of jollof rice" />\n        <Text style={styles.title}>Party jollof rice</Text>\n        <Text style={styles.body} numberOfLines={2}>\n          {DESCRIPTION}\n        </Text>\n      </Pressable>\n    </View>\n  );\n}\n\nconst styles = StyleSheet.create({\n  page: { flex: 1, padding: 16 },\n  card: { borderRadius: 16, overflow: "hidden", backgroundColor: "#fff7ed" },\n  image: { width: "100%", height: 180 },\n  title: { fontSize: 20, fontWeight: "700", paddingHorizontal: 12, paddingTop: 12 },\n  body: { padding: 12, color: "#57534e" },\n  pressed: { opacity: 0.7 },\n});\n`,
          },
          tests: [
            { label: "The image is shown, 180 high, with a description for screen readers", check: "const img = find({ label: 'A pot of jollof rice' }); return Boolean(img) && Math.round(rectOf({ label: 'A pot of jollof rice' }).height) === 180;", fail: "<Image source={require(\"@/assets/images/hero.jpg\")} style={{ height: 180 }} accessibilityLabel=\"A pot of jollof rice\" />" },
            { label: "The title, and a description cut to two lines", check: "const el = find({ text: /^Smoky, rich/ }); return has('Party jollof rice') && Boolean(el) && /numberOfLines=\\{2\\}/.test(code('src/app/index.tsx')) && el.scrollHeight > el.clientHeight;", fail: "numberOfLines={2} on the description's Text." },
            { label: "The card is one pressable with a name and pressed feedback", check: "return Boolean(find({ role: 'button', name: 'Open Party jollof rice' })) && /\\(\\{\\s*pressed\\s*\\}\\)/.test(code('src/app/index.tsx')) && /opacity|styles\\.pressed/.test(code('src/app/index.tsx'));", fail: "style={({ pressed }) => [styles.card, pressed && styles.pressed]}" },
          ],
          hint: "Pressable's style can be a function: React Native calls it with { pressed }.",
          successMessage: "The four core components, each doing its own job.",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },
];
