/**
 * MOBILE APP DEVELOPMENT · MODULE 8 · BUILDING POLISHED MOBILE INTERFACES (part 1)
 *
 * Curriculum 8.1 – 8.4: a component kit, responsive dimensions, assets,
 * icons and fonts, gradients. Parts 2 and 3 hold 8.5 – 8.P.
 *
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 */

import { expoLab } from "./md-helpers.js";

export const SECTION_ID = "md-s8-polished-ui";
export const MODULE = "md-m8-polished-ui";

export const layout = (title) => `import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "${title}" }} />
    </Stack>
  );
}
`;

const BUTTON_SCREEN = `import { useState } from "react";
import { View } from "react-native";
import { Button } from "@/components/Button";

export default function Kit() {
  const [saving, setSaving] = useState(false);
  const [count, setCount] = useState(0);
  return (
    <View style={{ padding: 20, gap: 12 }}>
      <Button title={\`Pay now (\${count})\`} onPress={() => setCount((c) => c + 1)} />
      <Button title="Cancel order" variant="danger" onPress={() => setCount(0)} />
      <Button title="Save" variant="secondary" loading={saving} onPress={() => setSaving(true)} />
      <Button title="Unavailable" disabled onPress={() => setCount(99)} />
    </View>
  );
}
`;

const BUTTON_MODEL = `import { ActivityIndicator, Pressable, StyleSheet, Text } from "react-native";

type Variant = "primary" | "secondary" | "danger";

type ButtonProps = {
  title: string;
  onPress: () => void;
  variant?: Variant;
  disabled?: boolean;
  loading?: boolean;
};

export function Button({ title, onPress, variant = "primary", disabled = false, loading = false }: ButtonProps) {
  const inactive = disabled || loading;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityState={{ disabled: inactive, busy: loading }}
      disabled={inactive}
      onPress={onPress}
      style={({ pressed }) => [styles.base, styles[variant], pressed && styles.pressed, inactive && styles.inactive]}
    >
      {loading ? (
        <ActivityIndicator color={variant === "secondary" ? "#0f766e" : "#ffffff"} />
      ) : (
        <Text style={[styles.text, variant === "secondary" && styles.secondaryText]}>{title}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: { minHeight: 48, borderRadius: 12, paddingHorizontal: 20, alignItems: "center", justifyContent: "center" },
  primary: { backgroundColor: "#0f766e" },
  secondary: { backgroundColor: "#ffffff", borderWidth: 1.5, borderColor: "#0f766e" },
  danger: { backgroundColor: "#b91c1c" },
  pressed: { opacity: 0.8 },
  inactive: { opacity: 0.45 },
  text: { color: "#ffffff", fontSize: 16, fontWeight: "700" },
  secondaryText: { color: "#0f766e" },
});
`;

const WIDTH_SCREEN = `import { ScrollView, StyleSheet, Text, useWindowDimensions, View } from "react-native";
import { layoutFor } from "@/lib/responsive";

export default function Article() {
  const { width, height } = useWindowDimensions();
  const l = layoutFor(width, height);
  return (
    <ScrollView contentContainerStyle={{ alignItems: "center", padding: l.padding }}>
      <View style={{ width: "100%", maxWidth: l.maxWidth }} testID="content">
        <Text style={{ fontSize: l.titleSize, fontWeight: "700" }}>How Lagos keeps its markets cool</Text>
        <Text style={styles.body}>Solar cold rooms are changing how traders store fruit and vegetables.</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({ body: { fontSize: 16, lineHeight: 24, marginTop: 12 } });
`;

const FONT_LAYOUT_START = `import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Welcome" }} />
    </Stack>
  );
}
`;

const FONT_LAYOUT_MODEL = `import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import { useEffect } from "react";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    "Poppins-Bold": require("@/assets/fonts/Poppins-Bold.ttf"),
  });

  useEffect(() => {
    if (loaded) SplashScreen.hideAsync();
  }, [loaded]);

  if (!loaded) return null;

  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Welcome" }} />
    </Stack>
  );
}
`;

const FONT_SCREEN = (title, extra) => `import Ionicons from "@expo/vector-icons/Ionicons";
import { Image } from "expo-image";
import { StyleSheet, Text, View } from "react-native";

export default function Welcome() {
  return (
    <View style={styles.page}>
${extra}
      <Text style={styles.title}>${title}</Text>
      <Text>Fresh food from your local market, delivered.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, padding: 24, gap: 12 },
  logo: { width: 96, height: 96 },
  row: { flexDirection: "row", alignItems: "center", gap: 8 },
  title: { fontSize: 28, fontFamily: "Poppins-Bold" },
});
`;

const FONT_EXTRA_MODEL = `      <Image source={require("@/assets/images/logo.png")} style={styles.logo} contentFit="contain" accessibilityLabel="Oja logo" />
      <View style={styles.row}>
        <Ionicons name="bicycle-outline" size={22} color="#0f766e" />
        <Text>Delivery in 45 minutes</Text>
      </View>`;

const HEADER_START = `import { StyleSheet, Text, View } from "react-native";

export default function Balance() {
  return (
    <View style={styles.page}>
      <View style={styles.header} testID="header">
        <Text style={styles.label}>Total balance</Text>
        <Text style={styles.amount}>₦184,250</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, padding: 16 },
  header: { padding: 24, borderRadius: 20, backgroundColor: "#0f766e" },
  label: { color: "#ccfbf1" },
  amount: { color: "#ffffff", fontSize: 34, fontWeight: "700" },
});
`;

const HEADER_MODEL = `import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, Text, View } from "react-native";

export default function Balance() {
  return (
    <View style={styles.page}>
      <LinearGradient colors={["#0f766e", "#1d4ed8"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.header} testID="header">
        <Text style={styles.label}>Total balance</Text>
        <Text style={styles.amount}>₦184,250</Text>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, padding: 16 },
  header: {
    padding: 24,
    borderRadius: 20,
    boxShadow: "0 8px 20px rgba(15, 118, 110, 0.35)",
  },
  label: { color: "#ccfbf1" },
  amount: { color: "#ffffff", fontSize: 34, fontWeight: "700" },
});
`;

export const PART1 = [
  /* ═══════════════ LESSON 43 · 8.1 – 8.2 ═══════════════ */
  {
    id: "md-l43-component-kit",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 1,
    covers: ["8.1", "8.2"],
    title: "A Component Kit and Responsive Layouts",
    subtitle: "Reusable buttons, cards, headers and inputs; layouts for every screen size",
    estimatedMinutes: 50,
    intro: "Polished apps feel consistent because every screen is built from the same few well-made components, laid out so they work on any screen.",
    atoms: [
      {
        id: "a-md-component-kit",
        title: "Creating reusable buttons, cards, headers and input fields",
        explain:
          "Turn the components you designed in Figma (Module 6) into code, in src/components/: Button, Card, ScreenHeader, TextField. Each takes typed props for its VARIANTS (variant: \"primary\" | \"secondary\" | \"danger\") and STATES (disabled, loading, error), has sensible defaults, meets the 48-point touch target, and carries its accessibility role, label and state. Screens then contain no styling decisions of their own, only components. A loading Button shows a spinner and ignores taps, so nobody pays twice.",
        webLab: expoLab({
          name: "Kit",
          layout: layout("Buttons"),
          task:
            "Write Button in src/components/Button.tsx (named export) with props title, onPress, variant (\"primary\" default, \"secondary\", \"danger\"), disabled and loading. Primary has the background #0f766e, danger #b91c1c, secondary a white background with a #0f766e border; all at least 48 high. A disabled or loading button does not respond to taps and reports itself disabled; a loading one shows an ActivityIndicator instead of its title (and reports busy). Every button is named by its title.",
          files: { "src/components/Button.tsx": "// Write and export Button here.\n", "src/app/index.tsx": BUTTON_SCREEN },
          readOnly: ["src/app/index.tsx"],
          solution: { "src/components/Button.tsx": BUTTON_MODEL },
          tests: [
            { label: "Primary and danger buttons work, with their colours", check: "await press('Pay now (0)'); await press('Pay now (1)'); const pay = css({ role: 'button', name: 'Pay now (2)' }, 'background-color') === 'rgb(15, 118, 110)'; const danger = css({ role: 'button', name: 'Cancel order' }, 'background-color') === 'rgb(185, 28, 28)'; await press('Cancel order'); return pay && danger && has('Pay now (0)');", fail: "variant decides the background; onPress is called." },
            { label: "Every button is at least 48 high", check: "return ['Pay now (0)', 'Cancel order', 'Save', 'Unavailable'].every((n) => tapSize({ role: 'button', name: n }).height >= 48);", fail: "minHeight: 48 on the base style." },
            { label: "Disabled buttons ignore taps and say they are disabled", check: "await press({ role: 'button', name: 'Unavailable' }); return has('Pay now (0)') && disabled({ role: 'button', name: 'Unavailable' });", fail: "disabled={disabled || loading} on the Pressable." },
            { label: "Loading shows a spinner and stops further taps", check: "await press('Save'); const b = find({ role: 'button', name: 'Save' }); return Boolean(b) && !hasText('Save') && b.querySelector('[role=progressbar]') !== null && disabled({ role: 'button', name: 'Save' }) && b.getAttribute('aria-busy') === 'true';", fail: "{loading ? <ActivityIndicator /> : <Text>{title}</Text>} with accessibilityLabel={title}." },
          ],
          hint: "Keep the button named by accessibilityLabel={title}: while loading, the title text is gone but the name must stay.",
          successMessage: "One Button, every variant and state. Every screen can use it.",
        }),
      },
      {
        id: "a-md-responsive-dimensions",
        title: "Responsive layouts for different screen dimensions",
        explain:
          "Use proportions rather than fixed sizes: flex, percentages, and maxWidth for content that would otherwise stretch across a tablet. Read the size with useWindowDimensions() (it updates on rotation, split screen and foldables) and keep the rules in one function so every screen agrees. Scale text for the space, but never below the readable minimum, and let the user's own text size setting win (React Native's Text scales with it by default). Test the smallest phone your users have, the largest, landscape and a tablet if you support one.",
        webLab: expoLab({
          name: "Reader",
          layout: layout("Article"),
          task:
            "Write layoutFor(width, height) in src/lib/responsive.ts. It returns { padding, maxWidth, titleSize }: padding 16 below 400 wide, otherwise 24; maxWidth 600 (so lines stay readable in landscape and on tablets); and titleSize 26 on phones in portrait (width below 600), 32 from 600 wide. The article screen uses it.",
          files: { "src/lib/responsive.ts": "export function layoutFor(width: number, height: number) {\n  return { padding: 0, maxWidth: 10000, titleSize: 20 };\n}\n", "src/app/index.tsx": WIDTH_SCREEN },
          readOnly: ["src/app/index.tsx"],
          solution: { "src/lib/responsive.ts": "export function layoutFor(width: number, height: number) {\n  return {\n    padding: width < 400 ? 16 : 24,\n    maxWidth: 600,\n    titleSize: width < 600 ? 26 : 32,\n  };\n}\n" },
          tests: [
            { label: "On the 393-point iPhone: padding 16, title 26", check: "const r = rectOf({ testID: 'content' }); return Math.round(r.left) === 16 && fontSize({ text: /Lagos keeps/ }) === 26;", fail: "width < 400 → padding 16; width < 600 → title 26." },
            { label: "On the 412-point Android phone: padding 24", device: { os: "android" }, check: "return Math.round(rectOf({ testID: 'content' }).left) === 24;", fail: "From 400: padding 24." },
            { label: "In landscape, content is at most 600 wide and the title is 32", device: { orientation: "landscape" }, check: "return Math.round(rectOf({ testID: 'content' }).width) === 600 && fontSize({ text: /Lagos keeps/ }) === 32;", fail: "maxWidth: 600, titleSize 32 from 600 wide." },
          ],
          hint: "Two ternaries and a constant.",
          successMessage: "One set of rules, comfortable on every screen.",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════ LESSON 44 · 8.3 – 8.4 ═══════════════ */
  {
    id: "md-l44-assets",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 2,
    covers: ["8.3", "8.4"],
    title: "Images, Icons, Fonts and Visual Effects",
    subtitle: "Local assets, icon sets, custom fonts, gradients and shadows",
    estimatedMinutes: 50,
    intro: "Brand comes through in the details: a logo, the right icons, your typeface, a gradient or a soft shadow.",
    atoms: [
      {
        id: "a-md-assets",
        title: "Images, icons, fonts and local assets",
        explain:
          "Local images go in assets/images/ and are loaded with require(); add @2x and @3x versions (logo@2x.png) and the phone picks the sharpest. expo-image's Image adds caching, placeholders and contentFit (\"cover\", \"contain\"); it is what the template uses. Icons: @expo/vector-icons bundles Ionicons, MaterialIcons, FontAwesome and more: <Ionicons name=\"bicycle-outline\" size={22} color=\"…\" />, and TypeScript checks the name exists. Fonts: put .ttf files in assets/fonts/ and load them with useFonts from expo-font, keeping the splash screen up (SplashScreen.preventAutoHideAsync) until they are ready, so nobody sees the text jump from one font to another. (Fonts can also be embedded at build time with the expo-font config plugin.)",
        webLab: expoLab({
          name: "Oja",
          layout: FONT_LAYOUT_START,
          editable: ["src/app/_layout.tsx"],
          task:
            "In src/app/_layout.tsx, load the font \"Poppins-Bold\" from require(\"@/assets/fonts/Poppins-Bold.ttf\") with useFonts, keep the splash screen visible until it has loaded (SplashScreen.preventAutoHideAsync at the top, hideAsync once loaded, render nothing until then). On the welcome screen, add the logo with expo-image (require(\"@/assets/images/logo.png\"), 96 × 96, contentFit \"contain\", accessibilityLabel \"Oja logo\") and a row with the Ionicons \"bicycle-outline\" icon and the text \"Delivery in 45 minutes\".",
          files: { "src/app/index.tsx": FONT_SCREEN("Oja", ""), "src/app/_layout.tsx": FONT_LAYOUT_START },
          solution: { "src/app/index.tsx": FONT_SCREEN("Oja", FONT_EXTRA_MODEL), "src/app/_layout.tsx": FONT_LAYOUT_MODEL },
          tests: [
            { label: "The splash screen stays until the font is loaded, then hides", check: "const c = code('src/app/_layout.tsx'); await waitFor(() => !splashVisible(), 2000); return /preventAutoHideAsync\\(\\)/.test(c) && /hideAsync\\(\\)/.test(c) && /useFonts/.test(c) && !splashVisible() && has('Oja');", fail: "SplashScreen.preventAutoHideAsync(); then hideAsync() when useFonts says loaded." },
            { label: "The title uses Poppins-Bold", check: "return styleOf('Oja').fontFamily === 'Poppins-Bold' && /Poppins-Bold\\.ttf/.test(code('src/app/_layout.tsx'));", fail: "\"Poppins-Bold\": require(\"@/assets/fonts/Poppins-Bold.ttf\")" },
            { label: "The logo is shown, 96 × 96, with a label", check: "const r = rectOf({ label: 'Oja logo' }); return Math.round(r.width) === 96 && Math.round(r.height) === 96;", fail: "<Image source={require(\"@/assets/images/logo.png\")} style={{ width: 96, height: 96 }} accessibilityLabel=\"Oja logo\" />" },
            { label: "The delivery row has the bicycle icon", check: "return icons().includes('bicycle-outline') && has('Delivery in 45 minutes');", fail: "<Ionicons name=\"bicycle-outline\" size={22} … />" },
          ],
          hint: "Import SplashScreen from expo-router (or expo-splash-screen) and useFonts from expo-font.",
          successMessage: "Brand assets, loaded properly: no flash of the wrong font.",
        }),
      },
      {
        id: "a-md-gradients",
        title: "Gradients and visual effects",
        explain:
          "expo-linear-gradient draws gradients: <LinearGradient colors={[\"#0f766e\", \"#1d4ed8\"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={…}>, where start and end are fractions of the box (this one runs corner to corner). Shadows: React Native 0.76+ supports boxShadow on both platforms with the CSS syntax (\"0 8px 20px rgba(0,0,0,0.25)\"); older code uses iOS shadow* properties and Android elevation. Use effects sparingly: one gradient header and gentle shadows on cards read as polish; many read as noise, and heavy blur or shadows cost frames on cheaper Android phones.",
        webLab: expoLab({
          name: "Wallet",
          layout: layout("Wallet"),
          task:
            "Make the balance header (testID \"header\") a LinearGradient from #0f766e to #1d4ed8, running from the top-left (x 0, y 0) to the bottom-right (x 1, y 1), and give it the shadow boxShadow \"0 8px 20px rgba(15, 118, 110, 0.35)\" instead of the flat background colour.",
          files: { "src/app/index.tsx": HEADER_START },
          solution: { "src/app/index.tsx": HEADER_MODEL },
          tests: [
            { label: "The header is a corner-to-corner gradient in the two colours", check: "const bg = css({ testID: 'header' }, 'background-image'); return /linear-gradient\\(135deg/.test(bg) && /rgb\\(15, 118, 110\\)|#0f766e/i.test(bg) && /rgb\\(29, 78, 216\\)|#1d4ed8/i.test(bg);", fail: "colors={[\"#0f766e\", \"#1d4ed8\"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}" },
            { label: "It has the soft shadow", check: "return styleOf({ testID: 'header' }).boxShadow === '0 8px 20px rgba(15, 118, 110, 0.35)';", fail: "boxShadow: \"0 8px 20px rgba(15, 118, 110, 0.35)\"" },
            { label: "The balance is still readable on it", check: "return has('₦184,250') && css('₦184,250', 'color') === 'rgb(255, 255, 255)';", fail: "Keep the text styles." },
          ],
          hint: "LinearGradient takes a style like a View; replace the header View with it.",
          successMessage: "A branded header, in two lines of code.",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },
];
