/**
 * MOBILE APP DEVELOPMENT — LAB HELPERS
 *
 * Every mobile lab is an Expo SDK 58 project laid out as `npx create-expo-app`
 * lays it out: app.json, package.json and routes in src/app/ (with a root
 * _layout.tsx). These helpers write that scaffold so each lab declares only
 * the files the lesson is about. package.json lists exactly the packages the
 * lab imports, at the versions SDK 58 installs (`npx expo install`), so it
 * reads like the learner's own project.
 *
 * THIS FILE IS CLIENT-SAFE. It holds no answers to graded checks.
 */

/** The versions `npx expo install` chooses for Expo SDK 58 (from expo's bundledNativeModules.json). */
export const SDK58 = {
  expo: "~58.0.16",
  react: "19.3.0",
  "react-dom": "19.3.0",
  "react-native": "0.88.0",
  "react-native-web": "~0.21.4",
  "expo-router": "~58.0.24",
  "expo-constants": "~58.0.12",
  "expo-linking": "~58.0.13",
  "expo-status-bar": "~58.0.3",
  "expo-splash-screen": "~58.0.10",
  "expo-font": "~58.0.9",
  "expo-image": "~58.0.16",
  "expo-symbols": "~58.0.4",
  "expo-system-ui": "~58.0.6",
  "expo-web-browser": "~58.0.6",
  "expo-device": "~58.0.5",
  "react-native-safe-area-context": "~5.10.1",
  "react-native-screens": "~4.30.0",
  "react-native-gesture-handler": "~3.3.0",
  "react-native-reanimated": "4.7.1",
  "react-native-worklets": "0.13.0",
  "@expo/vector-icons": "^15.0.2",
  "expo-haptics": "~58.0.7",
  "expo-clipboard": "~58.0.3",
  "expo-linear-gradient": "~58.0.3",
  "expo-secure-store": "~58.0.2",
  "expo-sqlite": "~58.0.13",
  "@react-native-async-storage/async-storage": "2.2.0",
  "expo-image-picker": "~58.0.10",
  "expo-camera": "~58.0.11",
  "expo-image-manipulator": "~58.0.15",
  "expo-file-system": "~58.0.10",
  "expo-location": "~58.0.18",
  "react-native-maps": "1.29.11",
  "expo-notifications": "~58.1.5",
  "expo-document-picker": "~58.0.4",
  "expo-sharing": "~58.0.19",
  "expo-local-authentication": "~58.0.2",
  "expo-localization": "~58.0.5",
  "expo-updates": "~58.0.17",
  "expo-application": "~58.1.2",
  "expo-crypto": "~58.0.7",
  "expo-network": "~58.0.3",
  "expo-task-manager": "~58.0.12",
  "expo-background-task": "~58.0.11",
  "@react-native-community/netinfo": "12.0.1",
  "react-native-svg": "15.16.0",
  "@tanstack/react-query": "^5.104.5",
  zustand: "^5.0.15",
  zod: "^4.1.12",
  "i18n-js": "^4.5.1",
};
const DEV = {
  typescript: "~6.0.3",
  "@types/react": "~19.3.0",
  "jest-expo": "~58.0.11",
  jest: "^30.0.0",
  "@types/jest": "^30.0.0",
  "@testing-library/react-native": "^14.1.0",
};

const slugOf = (name) => String(name).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

/** app.json as the SDK 58 template writes it, with the lab's own name and any additions. */
export function appJson(name = "My App", extra = {}) {
  const slug = extra.slug || slugOf(name);
  const { ios = {}, android = {}, plugins, ...rest } = extra;
  const expo = {
    name,
    slug,
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: rest.scheme || slug.replace(/-/g, ""),
    userInterfaceStyle: "automatic",
    ...rest,
    ios: { ...ios },
    android: {
      adaptiveIcon: { backgroundColor: "#E6F4FE", foregroundImage: "./assets/images/android-icon-foreground.png" },
      ...android,
    },
    plugins: ["expo-router", ...(plugins || [])],
    experiments: { typedRoutes: true, reactCompiler: true },
  };
  if (!Object.keys(expo.ios).length) delete expo.ios;
  return JSON.stringify({ expo }, null, 2) + "\n";
}

/** The packages a project's files import, at their SDK 58 versions. */
function packagesUsed(files) {
  const deps = new Set(["expo", "expo-router", "expo-constants", "expo-linking", "expo-status-bar", "react", "react-dom", "react-native", "react-native-safe-area-context", "react-native-screens", "react-native-web"]);
  const dev = new Set(["typescript", "@types/react"]);
  for (const [name, text] of Object.entries(files)) {
    if (!/\.[jt]sx?$/.test(name)) continue;
    const test = /\.test\.[jt]sx?$|__tests__\//.test(name);
    for (const m of String(text).matchAll(/(?:from\s+|import\s+|require\()\s*["']([^"'./][^"']*)["']/g)) {
      const spec = m[1];
      const pkg = spec.startsWith("@") ? spec.split("/").slice(0, 2).join("/") : spec.split("/")[0];
      if (pkg === "practice-server") continue;
      if (pkg === "@testing-library") continue;
      if (test && (pkg === "@testing-library/react-native" || DEV[pkg])) {
        dev.add(pkg);
        dev.add("jest-expo").add("jest").add("@types/jest");
      } else if (SDK58[pkg]) deps.add(pkg);
    }
  }
  const sort = (set, table) => Object.fromEntries([...set].sort().map((p) => [p, table[p]]));
  return { dependencies: sort(deps, SDK58), devDependencies: sort(dev, DEV), tests: dev.has("jest") };
}

export function packageJson(name, files) {
  const { dependencies, devDependencies, tests } = packagesUsed(files);
  const pkg = {
    name: slugOf(name),
    version: "1.0.0",
    main: "expo-router/entry",
    scripts: { start: "expo start", android: "expo start --android", ios: "expo start --ios", web: "expo start --web", lint: "expo lint", ...(tests ? { test: "jest" } : {}) },
    dependencies,
    devDependencies,
    ...(tests ? { jest: { preset: "jest-expo" } } : {}),
    private: true,
  };
  return JSON.stringify(pkg, null, 2) + "\n";
}

/** The root layout most labs share: one stack, its screens declared (SDK 58 requires it). */
export const stackLayout = (screens = [["index", "Home"]]) => `import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
${screens.map(([name, title, more]) => `      <Stack.Screen name="${name}" options={{ title: "${title}"${more ? `, ${more}` : ""} }} />`).join("\n")}
    </Stack>
  );
}
`;

/**
 * A mobile lab.
 *
 *   expoLab({ task, files: { "src/app/index.tsx": … }, solution, tests, name: "Field Notes",
 *             app: { …app.json additions }, layout: stackLayout([...]) | null, device: { os: "android" } })
 *
 * The scaffold (app.json, package.json, the root layout) is read-only unless
 * the lab lists the file in `editable` or supplies its own version in files.
 */
export function expoLab({ files = {}, name = "My App", app, layout, readOnly, editable = [], open, device, ...rest }) {
  const scaffold = {
    "app.json": appJson(name, app),
  };
  const hasRoutes = Object.keys(files).some((f) => f.startsWith("src/app/"));
  if (layout !== null && hasRoutes && !("src/app/_layout.tsx" in files) && !("src/app/_layout.jsx" in files) && !("src/app/_layout.js" in files)) {
    scaffold["src/app/_layout.tsx"] = layout || stackLayout();
  }
  const all = { ...scaffold, ...files };
  all["package.json"] = packageJson(name, { ...all, ...(rest.solution || {}) });
  const given = [...Object.keys(scaffold), "package.json"].filter((n) => !(n in files) && !editable.includes(n));
  const first = open || Object.keys(files).find((n) => !(readOnly || []).includes(n) && !given.includes(n));
  return {
    files: orderFiles(all, first),
    readOnly: [...new Set([...given, ...(readOnly || [])])],
    open: first,
    ...(device ? { device } : {}),
    ...rest,
  };
}

/** A worked example on the practice phone: the same scaffold, nothing graded. */
export function expoDemo({ files = {}, name, app, layout, device, ...rest }) {
  const lab = expoLab({ files, name, app, layout });
  return { files: lab.files, open: lab.open, ...(device ? { device } : {}), ...rest };
}

/** Editable files first, in declaration order; the scaffold after them. */
function orderFiles(all, first) {
  const names = Object.keys(all);
  const tail = ["src/app/_layout.tsx", "app.json", "package.json"];
  const own = names.filter((n) => !tail.includes(n));
  const sorted = [...(first ? [first] : []), ...own.filter((n) => n !== first), ...tail.filter((n) => names.includes(n) && n !== first)];
  return Object.fromEntries(sorted.map((n) => [n, all[n]]));
}
