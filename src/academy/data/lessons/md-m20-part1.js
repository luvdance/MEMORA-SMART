/**
 * MOBILE APP DEVELOPMENT · MODULE 20 · PREPARING APPS FOR RELEASE AND PUBLISHING (part 1)
 *
 * Curriculum 20.1 – 20.10: build types, identifiers, icons and splash
 * screens, versions and release notes, environment-specific configuration,
 * APK versus AAB, iOS IPA distribution, code signing, EAS Build and build
 * profiles.
 *
 * Store rules are as published in October 2026; both stores change them
 * often, so each lesson says where to check the current version.
 *
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 */

import { appJson, expoLab } from "./md-helpers.js";
import T from "./md-transcripts.js";

export const SECTION_ID = "md-s20-release";
export const MODULE = "md-m20-release";

const APP = "~/projects/my-first-app $";
export const releaseHome = `import { Text, View } from "react-native";

export default function Home() {
  return (
    <View style={{ padding: 20 }}>
      <Text>Kobo Market</Text>
    </View>
  );
}
`;
export const plainLayout = `import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Kobo Market" }} />
    </Stack>
  );
}
`;
export const easJson = (body) => `const e = (() => { try { return JSON.parse(code('eas.json')); } catch { return {}; } })(); ${body}`;

/* ── 20.2 · Identifiers ──────────────────────────────────────────────── */
const ID_START = { slug: "my-first-app", scheme: "myfirstapp" };
const ID_MODEL = { slug: "kobo-market", scheme: "kobo", ios: { bundleIdentifier: "ng.kobo.market" }, android: { package: "ng.kobo.market" } };

/* ── 20.3 · Icons and splash ─────────────────────────────────────────── */
const BRAND_START = { ios: { bundleIdentifier: "ng.kobo.market" }, android: { package: "ng.kobo.market" } };
const BRAND_MODEL = {
  icon: "./assets/images/icon.png",
  userInterfaceStyle: "automatic",
  ios: { bundleIdentifier: "ng.kobo.market" },
  android: {
    package: "ng.kobo.market",
    adaptiveIcon: { foregroundImage: "./assets/images/android-icon-foreground.png", backgroundColor: "#0F766E", monochromeImage: "./assets/images/android-icon-monochrome.png" },
  },
  plugins: [
    [
      "expo-splash-screen",
      { image: "./assets/images/splash-icon.png", imageWidth: 200, resizeMode: "contain", backgroundColor: "#FFFFFF", dark: { image: "./assets/images/splash-icon-dark.png", backgroundColor: "#0B1220" } },
    ],
  ],
};

/* ── 20.4 · Versions ─────────────────────────────────────────────────── */
const VERSION_APP_START = { version: "1.0.0", ios: { bundleIdentifier: "ng.kobo.market", buildNumber: "7" }, android: { package: "ng.kobo.market", versionCode: 7 } };
const VERSION_APP_MODEL = { version: "1.1.0", runtimeVersion: { policy: "appVersion" }, ios: { bundleIdentifier: "ng.kobo.market" }, android: { package: "ng.kobo.market" } };
const EAS_VERSION_START = `{
  "cli": {
    "version": ">= 16.0.0"
  },
  "build": {
    "production": {}
  }
}
`;
const EAS_VERSION_MODEL = `{
  "cli": {
    "version": ">= 16.0.0",
    "appVersionSource": "remote"
  },
  "build": {
    "production": {
      "autoIncrement": true
    }
  }
}
`;
const NOTES_START = `# Release notes

## 1.0.0

- First release: browse, save and buy products.
`;
const NOTES_MODEL = `# Release notes

## 1.1.0

- Pay with bank transfer and USSD at checkout.
- Find the shop nearest to you on the map.
- Fixed: the cart total could show the wrong delivery fee.

## 1.0.0

- First release: browse, save and buy products.
`;

/* ── 20.5 · Environment-specific configuration ───────────────────────── */
const EAS_ENV_START = `{
  "cli": {
    "version": ">= 16.0.0",
    "appVersionSource": "remote"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal"
    },
    "production": {
      "autoIncrement": true,
      "env": {
        "EXPO_PUBLIC_API_URL": "https://api.kobo.example",
        "PAYSTACK_SECRET_KEY": "sk_live_8c1f0e9d2b7a"
      }
    }
  }
}
`;
const EAS_ENV_MODEL = `{
  "cli": {
    "version": ">= 16.0.0",
    "appVersionSource": "remote"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "environment": "development",
      "env": {
        "EXPO_PUBLIC_API_URL": "https://dev-api.kobo.example"
      }
    },
    "preview": {
      "distribution": "internal",
      "environment": "preview",
      "channel": "preview",
      "env": {
        "EXPO_PUBLIC_API_URL": "https://staging-api.kobo.example"
      }
    },
    "production": {
      "autoIncrement": true,
      "environment": "production",
      "channel": "production",
      "env": {
        "EXPO_PUBLIC_API_URL": "https://api.kobo.example"
      }
    }
  }
}
`;

/* ── 20.10 · Build profiles ──────────────────────────────────────────── */
const EAS_PROFILES_START = `{
  "cli": {
    "version": ">= 16.0.0"
  },
  "build": {},
  "submit": {}
}
`;
const EAS_PROFILES_MODEL = `{
  "cli": {
    "version": ">= 16.0.0",
    "appVersionSource": "remote"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "environment": "development"
    },
    "preview": {
      "distribution": "internal",
      "environment": "preview",
      "channel": "preview",
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "autoIncrement": true,
      "environment": "production",
      "channel": "production"
    }
  },
  "submit": {
    "production": {
      "android": {
        "serviceAccountKeyPath": "./secrets/play-service-account.json",
        "track": "internal"
      },
      "ios": {
        "ascAppId": "6739201846"
      }
    }
  }
}
`;
const GITIGNORE = `node_modules/
.expo/
dist/
*.jks
*.p8
*.p12
*.key
*.mobileprovision
.env*.local
`;

export const PART1 = [
  /* ═══════════════ LESSON 128 · 20.1 – 20.2 ═══════════════ */
  {
    id: "md-l128-builds-ids",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 1,
    covers: ["20.1", "20.2"],
    title: "Kinds of Build, and Your App's Identity",
    subtitle: "Development, preview and production builds, and the ids that can never change",
    estimatedMinutes: 45,
    intro: "This module turns your project into apps real people install from Google Play and the App Store. It starts with two decisions you make once: what kinds of build you need, and what your app is called underneath.",
    atoms: [
      {
        id: "a-md-build-types",
        title: "Development, preview, and production builds",
        explain:
          "Three kinds of build, made with EAS Build (Lesson 132) or locally. A DEVELOPMENT BUILD is your own version of Expo Go: it includes expo-dev-client and your app's native code (any library, any config plugin), connects to npx expo start for fast refresh, and is installed on your phones and simulators. Use it day to day once you need anything Expo Go doesn't include (push on Android, payments SDKs, maps keys). A PREVIEW (internal) build is a release-like build without the developer tools, shared with testers and clients by a link or QR code: an APK on Android, an ad hoc or internal build on iOS (devices must be registered). A PRODUCTION build is what you upload to the stores: an AAB for Google Play and an IPA signed for the App Store, with autoIncremented version codes, optimisation and minification (R8 is on by default on Android in SDK 58). Expo Go itself is only for learning: since September 2026 it requires signing in, and the store version supports one SDK at a time.",
        decision: {
          scenario: "Your app now uses a payments SDK with native code and Google Maps. A client wants to try it on their Android phone this week, and you want to keep developing with fast refresh.",
          question: "Which builds do you need?",
          options: [
            { id: "a", text: "A development build for yourself (with expo-dev-client), and a preview build (an installable APK) for the client", why: "Native libraries need your own build; the development build keeps fast refresh, and the preview build is release-like and easy to share by link or QR code." },
            { id: "b", text: "Expo Go for both", whyWrong: "Expo Go only contains Expo's own modules; a payments SDK with native code won't run in it." },
            { id: "c", text: "A production AAB for the client", whyWrong: "AABs are for Google Play; they can't be installed directly on a phone." },
            { id: "d", text: "Send the client your source code to run npx expo start", whyWrong: "Clients shouldn't need a development setup; give them an installable build." },
          ],
          correct: "a",
          aftermath: "Development builds for you, preview builds for testers, production builds for the stores.",
        },
      },
      {
        id: "a-md-identifiers",
        title: "App identifiers and package names",
        explain:
          "Each app has a permanent, unique id on each platform: the ANDROID PACKAGE NAME (android.package, e.g. ng.kobo.market) and the iOS BUNDLE IDENTIFIER (ios.bundleIdentifier). Use reverse-DNS from a domain you control (kobo.ng → ng.kobo.market), lower case. Android packages need at least two segments, each starting with a letter, with only letters, digits and underscores; bundle ids may use letters, digits, hyphens and dots. Once an app is published, its id can NEVER change (a new id is a new app, losing reviews and installs), so choose before your first store upload. The other names: name (shown under the icon, can change), slug (your project's name on expo.dev), and scheme (for deep links, Module 9). Ids can't contain \"com.anonymous\" or \"example\" leftovers, and Google rejects package names starting with com.example.",
        webLab: expoLab({
          name: "Kobo Market",
          layout: plainLayout,
          app: ID_START,
          editable: ["app.json"],
          task:
            "Kobo owns the domain kobo.ng. In app.json, give the app its permanent identity: slug \"kobo-market\", scheme \"kobo\", ios.bundleIdentifier \"ng.kobo.market\" and android.package \"ng.kobo.market\".",
          files: { "src/app/index.tsx": releaseHome },
          readOnly: ["src/app/index.tsx", "src/app/_layout.tsx"],
          open: "app.json",
          solution: { "app.json": appJson("Kobo Market", ID_MODEL) },
          tests: [
            { label: "The Android package name is set and valid", check: "const p = (config().android || {}).package || ''; return p === 'ng.kobo.market' && /^[a-z][a-z0-9_]*(\\.[a-z][a-z0-9_]*)+$/.test(p);", fail: "\"android\": { \"package\": \"ng.kobo.market\" }" },
            { label: "The iOS bundle identifier is set and valid", check: "const b = (config().ios || {}).bundleIdentifier || ''; return b === 'ng.kobo.market' && /^[A-Za-z0-9-]+(\\.[A-Za-z0-9-]+)+$/.test(b);", fail: "\"ios\": { \"bundleIdentifier\": \"ng.kobo.market\" }" },
            { label: "Slug and scheme are the app's own", check: "const c = config(); return c.slug === 'kobo-market' && c.scheme === 'kobo' && c.name === 'Kobo Market';", fail: "\"slug\": \"kobo-market\", \"scheme\": \"kobo\"" },
          ],
          hint: "Reverse your domain: kobo.ng becomes ng.kobo, then add the app: ng.kobo.market.",
          successMessage: "An identity that will stay with the app for its whole life on both stores.",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════ LESSON 129 · 20.3 – 20.4 ═══════════════ */
  {
    id: "md-l129-branding-versions",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 2,
    covers: ["20.3", "20.4"],
    title: "Icons, Splash Screens and Versions",
    subtitle: "How the app looks before it opens, and how each release is numbered",
    estimatedMinutes: 50,
    intro: "The icon is the first thing users see, and the version number is the first thing support asks for.",
    atoms: [
      {
        id: "a-md-icons-splash",
        title: "App icons, splash screens, and branding",
        explain:
          "ICON: one 1024 × 1024 PNG (expo.icon), square, no transparency for iOS (the system rounds the corners; App Store Connect uses the same image). ANDROID ADAPTIVE ICON (android.adaptiveIcon): a foreground image (keep the logo in the centre safe zone, about 66% of the canvas, because launchers crop it to circles, squircles and teardrops), a background colour or image, and a MONOCHROME image for Android 13+ themed icons. iOS 18+ also tints icons in dark and tinted modes, so check your icon in each (Apple's Icon Composer makes layered iOS 26 icons). SPLASH SCREEN: the expo-splash-screen config plugin (image, imageWidth, resizeMode, backgroundColor, and a dark variant) shows a simple logo on a plain colour while the app starts; it's not a place for adverts or text. Native assets change only in a new build (Module 7's prebuild regenerates them). userInterfaceStyle \"automatic\" follows the phone's light or dark setting.",
        webLab: expoLab({
          name: "Kobo Market",
          layout: plainLayout,
          app: BRAND_START,
          editable: ["app.json"],
          task:
            "Brand the app in app.json: icon ./assets/images/icon.png; userInterfaceStyle \"automatic\"; an Android adaptiveIcon with foregroundImage ./assets/images/android-icon-foreground.png, backgroundColor \"#0F766E\" and monochromeImage ./assets/images/android-icon-monochrome.png; and the expo-splash-screen plugin with image ./assets/images/splash-icon.png, imageWidth 200, resizeMode \"contain\", backgroundColor \"#FFFFFF\" and a dark variant (image ./assets/images/splash-icon-dark.png, backgroundColor \"#0B1220\").",
          files: { "src/app/index.tsx": releaseHome },
          readOnly: ["src/app/index.tsx", "src/app/_layout.tsx"],
          open: "app.json",
          solution: { "app.json": appJson("Kobo Market", BRAND_MODEL) },
          tests: [
            { label: "The icon and light/dark behaviour", check: "const c = config(); return c.icon === './assets/images/icon.png' && c.userInterfaceStyle === 'automatic';", fail: "\"icon\" and \"userInterfaceStyle\": \"automatic\"" },
            { label: "Android's adaptive and themed icon", check: "const a = (config().android || {}).adaptiveIcon || {}; return a.foregroundImage === './assets/images/android-icon-foreground.png' && /^#0F766E$/i.test(a.backgroundColor || '') && a.monochromeImage === './assets/images/android-icon-monochrome.png';", fail: "adaptiveIcon: { foregroundImage, backgroundColor, monochromeImage }" },
            { label: "A splash screen for light and dark", check: "const p = (config().plugins || []).find((x) => Array.isArray(x) && x[0] === 'expo-splash-screen'); const o = (p && p[1]) || {}; return o.image === './assets/images/splash-icon.png' && o.imageWidth === 200 && o.resizeMode === 'contain' && /^#FFFFFF$/i.test(o.backgroundColor || '') && o.dark && /^#0B1220$/i.test(o.dark.backgroundColor || '') && o.dark.image === './assets/images/splash-icon-dark.png';", fail: "[\"expo-splash-screen\", { image, imageWidth, resizeMode, backgroundColor, dark: { image, backgroundColor } }]" },
          ],
          hint: "Plugins with options are written as [\"name\", { … }].",
          successMessage: "Icons for every launcher and theme, and a calm splash screen in light and dark.",
        }),
      },
      {
        id: "a-md-versioning",
        title: "Version numbers and release notes",
        explain:
          "Two numbers. The VERSION (expo.version, e.g. 1.1.0) is what users see; use semantic versioning: MAJOR for big changes, MINOR for new features, PATCH for fixes. The BUILD NUMBER (ios.buildNumber, android.versionCode, an integer on Android) must increase with EVERY upload, even for the same version: the stores refuse a duplicate. Let EAS manage build numbers: in eas.json, cli.appVersionSource \"remote\" keeps them on EAS's servers, and autoIncrement: true on the production profile raises them automatically, so you never collide. runtimeVersion { policy: \"appVersion\" } ties over-the-air updates to the version (Lesson 136). Write RELEASE NOTES for every version (\"What's new\": up to 500 characters on Google Play, 4,000 on the App Store) in plain language: what users can now do, and what you fixed.",
        webLab: expoLab({
          name: "Kobo Market",
          layout: plainLayout,
          app: VERSION_APP_START,
          editable: ["app.json"],
          task:
            "Prepare version 1.1.0 (two new features and a fix). app.json: version \"1.1.0\", runtimeVersion with the \"appVersion\" policy, and remove the hand-written ios.buildNumber and android.versionCode. eas.json: cli.appVersionSource \"remote\" and autoIncrement on the production profile. RELEASE_NOTES.md: a \"## 1.1.0\" section above 1.0.0 with at least two bullet points, under 500 characters.",
          files: { "eas.json": EAS_VERSION_START, "RELEASE_NOTES.md": NOTES_START, "src/app/index.tsx": releaseHome },
          readOnly: ["src/app/index.tsx", "src/app/_layout.tsx"],
          open: "app.json",
          solution: { "app.json": appJson("Kobo Market", VERSION_APP_MODEL), "eas.json": EAS_VERSION_MODEL, "RELEASE_NOTES.md": NOTES_MODEL },
          tests: [
            { label: "The version and runtime version", check: "const c = config(); return c.version === '1.1.0' && c.runtimeVersion && c.runtimeVersion.policy === 'appVersion';", fail: "\"version\": \"1.1.0\", \"runtimeVersion\": { \"policy\": \"appVersion\" }" },
            { label: "EAS manages the build numbers", check: easJson("const c = config(); return e.cli && e.cli.appVersionSource === 'remote' && e.build && e.build.production && e.build.production.autoIncrement === true && !(c.ios || {}).buildNumber && !(c.android || {}).versionCode;"), fail: "\"appVersionSource\": \"remote\" and \"autoIncrement\": true; delete buildNumber and versionCode." },
            { label: "Release notes for 1.1.0", check: "const n = code('RELEASE_NOTES.md'); const i = n.indexOf('## 1.1.0'); const j = n.indexOf('## 1.0.0'); const section = i >= 0 && j > i ? n.slice(i + 8, j).trim() : ''; return section.length > 0 && section.length <= 500 && (section.match(/^- /gm) || []).length >= 2;", fail: "A \"## 1.1.0\" section above \"## 1.0.0\", with bullet points, under 500 characters." },
          ],
          hint: "eas.json is JSON: keep the quotes and commas valid.",
          successMessage: "A version users understand, build numbers that never collide, and notes that say what's new.",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════ LESSON 130 · 20.5 – 20.6 ═══════════════ */
  {
    id: "md-l130-environments-android",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 3,
    covers: ["20.5", "20.6"],
    title: "Environments, and Android's APK and AAB",
    subtitle: "Right settings for each build, and Android's two package formats",
    estimatedMinutes: 45,
    intro: "Testers should never hit the production database, and production should never point at a staging server.",
    atoms: [
      {
        id: "a-md-env-config",
        title: "Environment-specific configuration",
        explain:
          "Each build profile can carry its own settings. In eas.json, environment (\"development\", \"preview\" or \"production\") selects the matching EAS ENVIRONMENT VARIABLES, which you manage on expo.dev or with eas env:create; env sets plain values in the profile itself. Public, per-build values (EXPO_PUBLIC_API_URL for dev, staging and production servers, a feature flag) can live in eas.json; anything SECRET (signing passwords, private API keys, a Sentry auth token for uploading source maps) belongs in EAS environment variables marked secret or sensitive, never in eas.json, which is committed to Git (and EXPO_PUBLIC_ values are visible in the app anyway, Module 10). Give each profile an update CHANNEL too (Lesson 136), so a preview build only receives preview updates. For apps that must install side by side (Kobo Dev next to Kobo), use app.config.ts with an APP_VARIANT variable to change the name and bundle id per profile.",
        webLab: expoLab({
          name: "Kobo Market",
          layout: plainLayout,
          task:
            "Fix eas.json: each profile gets its environment (\"development\", \"preview\", \"production\") and its own EXPO_PUBLIC_API_URL (https://dev-api.kobo.example, https://staging-api.kobo.example, https://api.kobo.example); preview and production get channels \"preview\" and \"production\"; and the payment secret key must leave eas.json entirely (it belongs on the server, or at most in an EAS secret variable).",
          files: { "eas.json": EAS_ENV_START, "src/app/index.tsx": releaseHome },
          readOnly: ["src/app/index.tsx", "src/app/_layout.tsx"],
          solution: { "eas.json": EAS_ENV_MODEL },
          tests: [
            { label: "Each profile has its environment and API", check: easJson("const b = e.build || {}; const url = (p) => ((b[p] || {}).env || {}).EXPO_PUBLIC_API_URL; return (b.development || {}).environment === 'development' && (b.preview || {}).environment === 'preview' && (b.production || {}).environment === 'production' && url('development') === 'https://dev-api.kobo.example' && url('preview') === 'https://staging-api.kobo.example' && url('production') === 'https://api.kobo.example';"), fail: "\"environment\" and \"env\": { \"EXPO_PUBLIC_API_URL\": … } in every profile." },
            { label: "Update channels per profile", check: easJson("const b = e.build || {}; return (b.preview || {}).channel === 'preview' && (b.production || {}).channel === 'production';"), fail: "\"channel\": \"preview\" and \"channel\": \"production\"" },
            { label: "No secrets in eas.json", check: "const c = code('eas.json'); return !/sk_(live|test)/.test(c) && !/SECRET/i.test(c);", fail: "Remove PAYSTACK_SECRET_KEY: eas.json is committed to Git." },
          ],
          hint: "Keep it valid JSON: no trailing commas.",
          successMessage: "Every build talks to the right server, and no secret is committed.",
        }),
      },
      {
        id: "a-md-apk-aab",
        title: "Android APK versus AAB",
        explain:
          "An APK (Android Package) is an installable file: one file with everything for every device, installed by tapping it (after allowing installs from that source). Use APKs for testers and clients (EAS preview builds with android.buildType \"apk\"). An AAB (Android App Bundle) is a PUBLISHING format: you upload it to Google Play, which builds optimised APKs for each device (only its screen density, CPU architecture and language), so downloads are smaller. Google Play REQUIRES AABs for new apps (since 2021), with PLAY APP SIGNING: Google holds the app-signing key and you sign uploads with an upload key (EAS creates and stores it for you). An AAB can't be installed directly on a phone (bundletool can turn one into APKs for testing). Also required: new apps and updates must target a recent Android API level (Android 16, API 36, from 31 August 2026; check Play Console for the current rule). From 30 September 2026, Android starts requiring apps on certified devices to come from verified developers, beginning in Brazil, Indonesia, Singapore and Thailand: register for Android developer verification in Play Console.",
        decision: {
          scenario: "You need to (1) send a test version to a client by WhatsApp so they can install it today, and (2) publish version 1.0 on Google Play.",
          question: "Which formats do you build?",
          options: [
            { id: "a", text: "(1) an APK from a preview build; (2) an AAB from a production build, uploaded to Play Console with Play App Signing", why: "APKs install directly for testing; Google Play requires AABs, from which it generates optimised APKs per device." },
            { id: "b", text: "An AAB for both", whyWrong: "The client can't install an AAB by tapping it." },
            { id: "c", text: "An APK for both", whyWrong: "Google Play no longer accepts APKs for new apps." },
            { id: "d", text: "An IPA for the client", whyWrong: "IPAs are iOS apps." },
          ],
          correct: "a",
          aftermath: "APK to install and test; AAB to publish on Google Play.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════ LESSON 131 · 20.7 – 20.8 ═══════════════ */
  {
    id: "md-l131-ios-signing",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 4,
    covers: ["20.7", "20.8"],
    title: "iOS Distribution and Code Signing",
    subtitle: "How an IPA reaches iPhones, and how both platforms prove an app is yours",
    estimatedMinutes: 45,
    intro: "Signing is how a phone knows an update really comes from you. Get it right once, and EAS keeps it right.",
    atoms: [
      {
        id: "a-md-ipa",
        title: "iOS IPA and distribution requirements",
        explain:
          "An IPA is an iOS app package. iPhones only install IPAs signed for a specific kind of distribution: DEVELOPMENT (your registered devices, for debugging); AD HOC (up to 100 registered devices per device type per year, for testers: EAS calls this internal distribution and registers devices with eas device:create, which opens a page testers visit on their iPhone); APP STORE (the only way to TestFlight and the App Store); and ENTERPRISE (for a company's own staff, a separate, strict program). For anyone outside your team, TESTFLIGHT is simpler than ad hoc: upload a production build to App Store Connect; up to 100 internal testers (your App Store Connect users) can install at once, and up to 10,000 external testers after a light Beta App Review. Apple's requirements change yearly: since 28 April 2026, uploads must be built with Xcode 26 and the iOS 26 SDK (EAS Build's servers have it; check Apple's \"Upcoming requirements\" page). You don't need a Mac to build or submit iOS apps with EAS.",
        decision: {
          scenario: "Twenty beta testers, most outside your company, need to try the iOS app next week. You build on Windows.",
          question: "What's the best way to distribute it?",
          options: [
            { id: "a", text: "Build a production IPA with EAS, submit it to App Store Connect, and invite them through TestFlight (external testing)", why: "TestFlight needs no device registration, handles updates and crash feedback, and works from Windows with EAS Build and Submit." },
            { id: "b", text: "Email them the IPA file", whyWrong: "iPhones won't install an IPA that isn't signed for their device or distributed through Apple." },
            { id: "c", text: "An enterprise build", whyWrong: "The Enterprise Program is only for a company's own employees, not public testers." },
            { id: "d", text: "Buy a Mac first, because iOS builds need Xcode locally", whyWrong: "EAS Build runs Xcode on its servers; no Mac is needed." },
          ],
          correct: "a",
          aftermath: "Ad hoc for a few registered devices; TestFlight for real beta testing; the App Store for everyone.",
        },
      },
      {
        id: "a-md-code-signing",
        title: "Code signing and provisioning concepts",
        explain:
          "Every Android and iOS app is CRYPTOGRAPHICALLY SIGNED, so the phone and the store can trust that updates come from the same developer. ANDROID: a KEYSTORE holds your key. With Play App Signing, Google keeps the final APP-SIGNING KEY and you sign uploads with an UPLOAD KEY; if the upload key is lost or leaked, Google can reset it (without Play App Signing, losing the key meant you could never update the app). The SHA-256 fingerprint of the app-signing key is what App Links and Google sign-in need. iOS: a DISTRIBUTION CERTIFICATE (who you are) plus a PROVISIONING PROFILE (this app id + this kind of distribution + these devices or the App Store + its capabilities such as push). EAS manages all of it: on your first build it offers to create and store credentials (eas credentials shows and backs them up). Never commit keystores, .p12 or .p8 files or their passwords to Git.",
        decision: {
          scenario: "A teammate leaves, and the Android keystore was only on their laptop. The app is on Google Play with Play App Signing, and credentials were never stored in EAS.",
          question: "What happens, and what should you do?",
          options: [
            { id: "a", text: "Because Google holds the app-signing key, request an upload-key reset in Play Console with a new upload key, then store credentials in EAS and keep a backup", why: "Play App Signing separates the upload key from the app-signing key, so a lost upload key can be replaced; managing it in EAS prevents a repeat." },
            { id: "b", text: "The app can never be updated again; publish a new app", whyWrong: "That was the risk before Play App Signing; now the upload key can be reset." },
            { id: "c", text: "Generate a new keystore and upload with it straight away", whyWrong: "Play rejects uploads signed with an unregistered key until the reset is approved." },
            { id: "d", text: "Commit the new keystore to the Git repository so it's never lost", whyWrong: "Anyone with repository access could then sign apps as you; store it in EAS or a secret manager." },
          ],
          correct: "a",
          aftermath: "Let Google hold the signing key, EAS hold the upload credentials, and Git hold none of them.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════ LESSON 132 · 20.9 – 20.10 ═══════════════ */
  {
    id: "md-l132-eas-build",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 5,
    covers: ["20.9", "20.10"],
    title: "EAS Build and Build Profiles",
    subtitle: "Building Android and iOS apps in the cloud, from any computer",
    estimatedMinutes: 55,
    intro: "EAS Build turns your project into signed Android and iOS apps on Expo's servers, so a Windows laptop can ship iPhone apps.",
    atoms: [
      {
        id: "a-md-eas-build",
        title: "Expo Application Services (EAS) Build",
        explain:
          "EAS (Expo Application Services) runs builds in the cloud: install the CLI (npm install -g eas-cli, or npx eas-cli), create a free Expo account and sign in (eas login), link the project (eas init, which adds extra.eas.projectId to app.json) and create eas.json (eas build:configure). Then eas build --platform android|ios|all --profile <name> uploads your project, runs prebuild, installs dependencies, signs with your credentials and produces an APK, AAB or IPA; watch progress on expo.dev, and when it finishes you get a download link and QR code. The free plan has a monthly build allowance with queueing; paid plans build faster. Builds are reproducible from Git, so commit before building. You can also build locally with eas build --local (needs Android Studio, or a Mac with Xcode for iOS). Typical commands: eas build -p android --profile preview, eas build -p ios --profile production, eas build --platform all --auto-submit.",
        terminalExercise: {
          prompt: APP,
          intro: "Recorded in the course's project with EAS CLI, on a computer that wasn't signed in to Expo.",
          goal: "Try to start an Android preview build, and find out what EAS needs first.",
          commands: {
            "npx eas-cli --version": T.eas["npx eas-cli --version"],
            "npx eas-cli whoami": T.eas["npx eas-cli whoami"],
            "npx eas-cli build --help": T.eas["npx eas-cli build --help"],
            "npx eas-cli build --platform android --profile preview": T.eas["npx eas-cli build --platform android --profile preview"],
          },
          available: ["npx eas-cli --version", "npx eas-cli whoami", "npx eas-cli build --help", "npx eas-cli build --platform android --profile preview"],
          accept: ["npx eas-cli build --platform android --profile preview"],
          near: [
            { command: "npx eas-cli whoami", why: "\"Not logged in\": that's the clue. Now try the build and read what it says." },
            { command: "npx eas-cli build --help", why: "The help shows -p (platform) and -e/--profile. Now run the build for android with the preview profile." },
          ],
          hint: "eas build takes --platform and --profile.",
          success: "\"An Expo user account is required to proceed\": builds run on your Expo account. Sign in with npx eas-cli login (or set EXPO_TOKEN in CI), then run the same command again.",
        },
      },
      {
        id: "a-md-build-profiles",
        title: "Managing build profiles",
        explain:
          "eas.json describes your builds. cli sets the required EAS CLI version and appVersionSource. Each BUILD PROFILE under build is a recipe: development (developmentClient: true, distribution: \"internal\"), preview (distribution: \"internal\", and android.buildType \"apk\" so testers can install it), production (the default for store builds: AAB and App Store IPA, autoIncrement: true). Profiles can set environment, env, channel, resource classes, simulator builds (ios.simulator: true), and extend another profile (\"extends\": \"production\"). SUBMIT PROFILES under submit tell eas submit where to send builds: for Android, a Google service account key (from Google Cloud, with access granted in Play Console) and a track (internal, alpha/closed, beta/open, production); for iOS, the App Store Connect app id (ascAppId) and an App Store Connect API key, which EAS can create for you. Keep credential files out of Git (.gitignore).",
        webLab: expoLab({
          name: "Kobo Market",
          layout: plainLayout,
          task:
            "Write eas.json: cli.appVersionSource \"remote\"; build profiles development (developmentClient, internal distribution, environment development), preview (internal, environment preview, channel preview, android.buildType \"apk\") and production (autoIncrement, environment production, channel production); and a production submit profile: Android serviceAccountKeyPath \"./secrets/play-service-account.json\" with track \"internal\", and iOS ascAppId \"6739201846\". .gitignore already ignores key files: make sure the secrets folder is ignored too.",
          files: { "eas.json": EAS_PROFILES_START, ".gitignore": GITIGNORE, "src/app/index.tsx": releaseHome },
          readOnly: ["src/app/index.tsx", "src/app/_layout.tsx"],
          solution: { "eas.json": EAS_PROFILES_MODEL, ".gitignore": GITIGNORE + "secrets/\n" },
          tests: [
            { label: "The three build profiles", check: easJson("const b = e.build || {}; return !!b.development && b.development.developmentClient === true && b.development.distribution === 'internal' && !!b.preview && b.preview.distribution === 'internal' && (b.preview.android || {}).buildType === 'apk' && !!b.production && b.production.autoIncrement === true;"), fail: "development, preview (apk) and production (autoIncrement)." },
            { label: "Environments and channels", check: easJson("const b = e.build || {}; return (b.development || {}).environment === 'development' && (b.preview || {}).environment === 'preview' && (b.preview || {}).channel === 'preview' && (b.production || {}).environment === 'production' && (b.production || {}).channel === 'production' && (e.cli || {}).appVersionSource === 'remote';"), fail: "environment and channel in each profile; appVersionSource remote." },
            { label: "Submission to both stores", check: easJson("const s = (e.submit || {}).production || {}; return (s.android || {}).serviceAccountKeyPath === './secrets/play-service-account.json' && (s.android || {}).track === 'internal' && (s.ios || {}).ascAppId === '6739201846';"), fail: "submit.production.android { serviceAccountKeyPath, track } and ios { ascAppId }." },
            { label: "Credentials stay out of Git", check: "return /^\\/?secrets\\/?$/m.test(code('.gitignore'));", fail: "Add secrets/ to .gitignore." },
          ],
          hint: "Valid JSON only: double quotes, no comments, no trailing commas.",
          successMessage: "One eas.json that describes every build and where it goes.",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },
];
