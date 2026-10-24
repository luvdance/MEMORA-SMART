/**
 * MOBILE APP DEVELOPMENT · MODULE 20 · PREPARING APPS FOR RELEASE AND PUBLISHING (part 2)
 *
 * Curriculum 20.11 – 20.P: installing and testing release builds,
 * production diagnostics, store screenshots and descriptions, the Google
 * Play Console workflow, the Apple Developer account and App Store
 * submission, privacy disclosures and review, staged releases and
 * rollback, over-the-air updates, post-release monitoring, and the
 * practical (a complete store-submission package).
 *
 * Store rules and limits are as published in October 2026.
 *
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 */

import { appJson, expoLab } from "./md-helpers.js";
import { MODULE, SECTION_ID, easJson, plainLayout, releaseHome } from "./md-m20-part1.js";

/* ── 20.13 · Store listing ───────────────────────────────────────────── */
const LISTING_START = `{
  "privacyPolicyUrl": "",
  "supportUrl": "",
  "googlePlay": {
    "title": "Kobo Market: Shop Nigerian-made fashion, beauty and homeware",
    "shortDescription": "",
    "fullDescription": "",
    "category": "",
    "contactEmail": "",
    "graphics": {
      "icon": "1024x1024",
      "featureGraphic": "",
      "phoneScreenshots": ["1080x1920"]
    }
  },
  "appStore": {
    "name": "",
    "subtitle": "",
    "promotionalText": "",
    "description": "",
    "keywords": "",
    "primaryCategory": "",
    "icon": "1024x1024",
    "screenshots": {
      "6.9": []
    }
  }
}
`;
const LISTING_MODEL = `{
  "privacyPolicyUrl": "https://kobo.example/privacy",
  "supportUrl": "https://kobo.example/support",
  "googlePlay": {
    "title": "Kobo Market: Made in Nigeria",
    "shortDescription": "Shop fashion, beauty and homeware from Nigerian makers. Pay by card or transfer.",
    "fullDescription": "Kobo Market brings you fashion, beauty and homeware made by small businesses across Nigeria.\\n\\n• Browse thousands of products, from Ankara tote bags to shea butter.\\n• Save favourites and get told when prices drop.\\n• Pay safely by card, bank transfer or USSD.\\n• Track every order to your door, and find the shop nearest to you.\\n\\nEvery seller is verified, and every payment is protected.",
    "category": "Shopping",
    "contactEmail": "support@kobo.example",
    "graphics": {
      "icon": "512x512",
      "featureGraphic": "1024x500",
      "phoneScreenshots": ["1080x1920", "1080x1920", "1080x1920", "1080x1920"]
    }
  },
  "appStore": {
    "name": "Kobo Market",
    "subtitle": "Shop Nigerian-made goods",
    "promotionalText": "New: pay by bank transfer and USSD, and find the shop nearest to you.",
    "description": "Kobo Market brings you fashion, beauty and homeware made by small businesses across Nigeria.\\n\\nBrowse thousands of products, save favourites, pay safely by card or bank transfer, and track every order to your door.\\n\\nEvery seller is verified, and every payment is protected.",
    "keywords": "ankara,fashion,nigeria,shea,butter,homeware,handmade,lagos,shopping,african",
    "primaryCategory": "Shopping",
    "icon": "1024x1024",
    "screenshots": {
      "6.9": ["1320x2868", "1320x2868", "1320x2868", "1320x2868"]
    }
  }
}
`;
/** The checks a store listing must pass (Google Play and App Store limits, October 2026). */
const L = "const L = (() => { try { return JSON.parse(code('store/listing.json')); } catch { return {}; } })(); const gp = L.googlePlay || {}; const as = L.appStore || {}; const dims = (s) => String(s).split('x').map(Number);";
const LISTING_TESTS = [
  { label: "Policy and support links", check: `${L} return /^https:\\/\\//.test(L.privacyPolicyUrl || '') && /^https:\\/\\//.test(L.supportUrl || '');`, fail: "Both stores require a privacy policy URL; the App Store also needs a support URL." },
  { label: "Google Play text fits the limits", check: `${L} return !!gp.title && gp.title.length <= 30 && !!gp.shortDescription && gp.shortDescription.length <= 80 && (gp.fullDescription || '').length >= 200 && gp.fullDescription.length <= 4000 && !!gp.category && /@/.test(gp.contactEmail || '');`, fail: "Title ≤ 30, short description ≤ 80, full description ≤ 4,000 characters; a category and a contact e-mail." },
  { label: "Google Play graphics are the right sizes", check: `${L} const g = gp.graphics || {}; const shots = g.phoneScreenshots || []; return g.icon === '512x512' && g.featureGraphic === '1024x500' && shots.length >= 2 && shots.length <= 8 && shots.every((s) => { const [w, h] = dims(s); return Math.min(w, h) >= 320 && Math.max(w, h) <= 3840 && Math.max(w, h) <= 2 * Math.min(w, h); });`, fail: "Icon 512×512, feature graphic 1024×500, 2–8 phone screenshots (sides 320–3,840 px, the long side at most twice the short)." },
  { label: "App Store text fits the limits", check: `${L} const k = as.keywords || ''; return !!as.name && as.name.length <= 30 && !!as.subtitle && as.subtitle.length <= 30 && (as.promotionalText || '').length <= 170 && !!as.description && as.description.length <= 4000 && k.length > 0 && k.length <= 100 && !/,\\s/.test(k) && !!as.primaryCategory;`, fail: "Name and subtitle ≤ 30, promotional text ≤ 170, description ≤ 4,000, keywords ≤ 100 characters separated by commas without spaces." },
  { label: "App Store icon and screenshots", check: `${L} const shots = (as.screenshots || {})['6.9'] || []; return as.icon === '1024x1024' && shots.length >= 1 && shots.length <= 10 && shots.every((s) => ['1320x2868', '1290x2796'].includes(s));`, fail: "A 1024×1024 icon and 1–10 screenshots for 6.9-inch iPhones (1320×2868 or 1290×2796)." },
];

/* ── 20.18 · Over-the-air updates ────────────────────────────────────── */
const PROJECT_ID = "1b3c9e70-4f2a-4d6b-9a8e-2f6c0d1e5a77";
const OTA_START = `import * as Updates from "expo-updates";

export type UpdateState = "none" | "ready" | "skipped";

/** In release builds, checks for an over-the-air update and downloads it. */
export async function checkForAppUpdate(): Promise<UpdateState> {
  return "none";
}

/** Restarts the app on the downloaded update. */
export async function applyUpdate() {}
`;
const OTA_MODEL = `import * as Updates from "expo-updates";

export type UpdateState = "none" | "ready" | "skipped";

/** In release builds, checks for an over-the-air update and downloads it. */
export async function checkForAppUpdate(): Promise<UpdateState> {
  // Development builds and Expo Go load JavaScript from your computer, not from EAS Update.
  if (__DEV__ || !Updates.isEnabled) return "skipped";
  try {
    const result = await Updates.checkForUpdateAsync();
    if (!result.isAvailable) return "none";
    await Updates.fetchUpdateAsync();
    return "ready";
  } catch {
    // Offline or the update server is unreachable: keep running the current version.
    return "none";
  }
}

/** Restarts the app on the downloaded update. */
export async function applyUpdate() {
  await Updates.reloadAsync();
}
`;
const OTA_SCREEN = `import * as Updates from "expo-updates";
import { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { applyUpdate, checkForAppUpdate, type UpdateState } from "@/updates";

export default function Home() {
  const [state, setState] = useState<UpdateState | "checking">("checking");
  useEffect(() => {
    checkForAppUpdate().then(setState);
  }, []);
  return (
    <View style={{ padding: 20, gap: 12 }}>
      <Text>Kobo Market</Text>
      <Text testID="state">Update check: {state}</Text>
      <Text testID="update-id">Running: {Updates.updateId ?? "development"}</Text>
      {state === "ready" ? (
        <View accessibilityRole="alert" style={{ padding: 12, backgroundColor: "#ccfbf1", gap: 8 }}>
          <Text>An update is ready.</Text>
          <Pressable accessibilityRole="button" onPress={applyUpdate} style={{ minHeight: 44, justifyContent: "center" }}><Text>Restart now</Text></Pressable>
        </View>
      ) : null}
    </View>
  );
}
`;
const OTA_APP_START = { ios: { bundleIdentifier: "ng.kobo.market" }, android: { package: "ng.kobo.market" }, extra: { eas: { projectId: PROJECT_ID } } };
const OTA_APP_MODEL = {
  ...OTA_APP_START,
  runtimeVersion: { policy: "appVersion" },
  updates: { url: "https://u.expo.dev/" + PROJECT_ID, checkAutomatically: "ON_LOAD", fallbackToCacheTimeout: 0 },
};

/* ── 20.P · The practical ────────────────────────────────────────────── */
const P_APP_START = { slug: "my-first-app" };
const P_APP_MODEL = {
  slug: "kobo-market",
  scheme: "kobo",
  version: "1.0.0",
  icon: "./assets/images/icon.png",
  userInterfaceStyle: "automatic",
  runtimeVersion: { policy: "appVersion" },
  updates: { url: "https://u.expo.dev/" + PROJECT_ID },
  ios: { bundleIdentifier: "ng.kobo.market", supportsTablet: false },
  android: {
    package: "ng.kobo.market",
    adaptiveIcon: { foregroundImage: "./assets/images/android-icon-foreground.png", backgroundColor: "#0F766E", monochromeImage: "./assets/images/android-icon-monochrome.png" },
    blockedPermissions: ["android.permission.RECORD_AUDIO"],
  },
  plugins: [["expo-splash-screen", { image: "./assets/images/splash-icon.png", imageWidth: 200, backgroundColor: "#FFFFFF", dark: { backgroundColor: "#0B1220" } }]],
  extra: { eas: { projectId: PROJECT_ID } },
};
const P_EAS_MODEL = `{
  "cli": { "version": ">= 16.0.0", "appVersionSource": "remote" },
  "build": {
    "development": { "developmentClient": true, "distribution": "internal", "environment": "development" },
    "preview": { "distribution": "internal", "environment": "preview", "channel": "preview", "android": { "buildType": "apk" } },
    "production": { "autoIncrement": true, "environment": "production", "channel": "production" }
  },
  "submit": {
    "production": {
      "android": { "serviceAccountKeyPath": "./secrets/play-service-account.json", "track": "internal" },
      "ios": { "ascAppId": "6739201846" }
    }
  }
}
`;
const CHECKLIST_ITEMS = [
  "Tested the production build on a real Android phone",
  "Tested the production build on a real iPhone (TestFlight)",
  "Privacy policy published and linked",
  "Google Play Data safety form completed",
  "App Store privacy labels completed",
  "Content rating questionnaire completed",
  "Account deletion available in the app",
  "Demo account and notes added for review",
  "Closed test: 12 testers for 14 days completed",
  "Store listings and screenshots uploaded",
  "Crash reporting checked in the release build",
  "Staged rollout and rollback plan written",
];
const CHECKLIST_START = `# Release checklist: Kobo Market 1.0.0

Tick each item ([x]) once it is done.

${CHECKLIST_ITEMS.map((i) => `- [ ] ${i}`).join("\n")}

## Rollout plan

(Write it here.)
`;
const CHECKLIST_MODEL = `# Release checklist: Kobo Market 1.0.0

Tick each item ([x]) once it is done.

${CHECKLIST_ITEMS.map((i) => `- [x] ${i}`).join("\n")}

## Rollout plan

- Google Play: a staged rollout to 10% of users, then 25%, 50% and 100% over a week if crash-free users stay above 99.5% and no new top crash appears; halt the rollout if they drop.
- App Store: phased release over 7 days; pause it from App Store Connect if problems appear.
- Rollback: JavaScript-only fixes go out as an EAS Update to the production channel (or roll back to the previous update with eas update:rollback); native problems need a new build with a higher build number, submitted with expedited review if needed.
- Watch for 48 hours: Sentry, Play Console Android vitals, App Store Connect crashes, and support e-mail.
`;

export const PART2 = [
  /* ═══════════════ LESSON 133 · 20.11 – 20.12 ═══════════════ */
  {
    id: "md-l133-testing-diagnostics",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 6,
    covers: ["20.11", "20.12"],
    title: "Installing Release Builds, and Production Diagnostics",
    subtitle: "Testing exactly what users will get, and seeing what happens after they get it",
    estimatedMinutes: 40,
    intro: "A release build is not the app you've been running in development. Install it, test it, and make sure you'll hear about problems.",
    atoms: [
      {
        id: "a-md-install-test-builds",
        title: "Installing and testing release builds",
        explain:
          "ANDROID: a preview APK from EAS installs from its build page link or QR code (allow installs from the browser when Android asks), or with adb install over USB; production AABs reach testers through Play Console's INTERNAL TESTING track (up to 100 testers by e-mail list, available within minutes, no review). iOS: internal-distribution builds install on REGISTERED devices (eas device:create, then rebuild); production builds go to TESTFLIGHT (internal testers right away, external testers after Beta App Review). Test the release build like a user: a clean install and an UPGRADE from the previous version (data and session must survive), sign-up to purchase, push notifications, deep and universal links, offline, both themes, large text, and crash reporting. Expo's Orbit app (macOS and Windows) installs builds onto devices and simulators in one click.",
        decision: {
          scenario: "Version 1.1 passes every automated test. Before releasing, you have time for one more check on real phones.",
          question: "Which check finds the problems release builds are most likely to have?",
          options: [
            { id: "a", text: "Install the 1.1 production build OVER version 1.0 on a real Android phone and iPhone (from the internal testing track and TestFlight), and walk the main flows", why: "Upgrades catch data migrations, stored sessions and native changes that a fresh development build never exercises, and store-delivered builds are exactly what users get." },
            { id: "b", text: "Run the app once more in Expo Go", whyWrong: "Expo Go isn't your release build: no native code changes, no signing, no store delivery." },
            { id: "c", text: "Run the unit tests again", whyWrong: "They already pass; they can't find signing, upgrade or device problems." },
            { id: "d", text: "Fresh-install the development build", whyWrong: "Development builds behave differently and skip the upgrade path." },
          ],
          correct: "a",
          aftermath: "Test the real artefact, delivered the real way, including the upgrade from the last version.",
        },
      },
      {
        id: "a-md-production-diagnostics",
        title: "Crash reporting and production diagnostics",
        explain:
          "Before launch, make sure you'll SEE problems. Crash reporting (Sentry with its Expo config plugin is common; Firebase Crashlytics and Bugsnag too) must be set up in the RELEASE build, with source maps uploaded for every build and every EAS Update (EAS can run the upload; keep the auth token in an EAS secret), and the release and environment tagged so you can compare versions. Add a few breadcrumbs (screen changes, key actions) and scrub personal data. The stores give you more: Google Play Console's Android vitals (crash rate and ANR rate, where Google's \"bad behaviour\" thresholds affect your app's visibility) and pre-launch reports (Google runs your app on real devices), and App Store Connect's crash reports and TestFlight feedback. Trigger a test crash in a release build once, to prove the pipeline works.",
        decision: {
          scenario: "Launch is tomorrow. Sentry is installed, and errors appear in development, but nobody has checked a release build.",
          question: "What should you verify today?",
          options: [
            { id: "a", text: "In a production build, trigger a test error and confirm it reaches Sentry symbolicated (with source maps), tagged with the release and environment", why: "Release builds are minified and configured differently; only a real test proves you'll get readable crash reports after launch." },
            { id: "b", text: "Nothing: if it works in development, it works in production", whyWrong: "Source maps, DSNs per environment and the release configuration differ, and often fail silently." },
            { id: "c", text: "Turn Sentry off for launch to make the app faster", whyWrong: "Launch is when you most need to know about crashes." },
            { id: "d", text: "Log every user action with full personal details for better debugging", whyWrong: "That breaks privacy rules and your disclosures; log context, not personal data." },
          ],
          correct: "a",
          aftermath: "Prove the diagnostics pipeline on a release build before users depend on it.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════ LESSON 134 · 20.13 – 20.14 ═══════════════ */
  {
    id: "md-l134-listing-google-play",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 7,
    covers: ["20.13", "20.14"],
    title: "Store Listings, and Publishing on Google Play",
    subtitle: "Screenshots and words that sell the app, and every step of Play Console",
    estimatedMinutes: 70,
    intro: "Your store page is your app's shop window. Then comes the Google Play Console, step by step, from a new developer account to a public release.",
    atoms: [
      {
        id: "a-md-store-assets",
        title: "Preparing screenshots and store descriptions",
        explain:
          "Each store has its own fields and limits. GOOGLE PLAY: app name (30 characters), short description (80), full description (4,000), a 512 × 512 icon, a 1024 × 500 feature graphic, and 2–8 phone screenshots (JPEG or 24-bit PNG, each side 320–3,840 px, the long side at most twice the short), plus tablet screenshots if you support tablets. APP STORE: name (30), subtitle (30), promotional text (170, changeable without a new version), description (4,000), keywords (100 characters, comma-separated, no spaces, don't repeat the name), a 1024 × 1024 icon, and 1–10 screenshots for 6.9-inch iPhones (1320 × 2868 or 1290 × 2796; smaller sizes can reuse them). Both need a PRIVACY POLICY URL; the App Store also a support URL. Write for people: the first line and first screenshots matter most, show real screens with a short caption each, no misleading claims, and localise for your main markets. Keep the listing in your repository as a file, so it's reviewed and versioned like code.",
        webLab: expoLab({
          name: "Kobo Market",
          layout: plainLayout,
          task:
            "Complete store/listing.json for both stores within their limits: the privacy policy and support URLs (https); Google Play's title (≤ 30), short description (≤ 80), full description (200–4,000), category, contact e-mail, a 512×512 icon, the 1024×500 feature graphic and 2–8 valid phone screenshots; the App Store's name and subtitle (≤ 30 each), promotional text (≤ 170), description (≤ 4,000), keywords (≤ 100 characters, comma-separated, no spaces), primary category, 1024×1024 icon and 1–10 screenshots at 1320×2868 (or 1290×2796).",
          files: { "store/listing.json": LISTING_START, "src/app/index.tsx": releaseHome },
          readOnly: ["src/app/index.tsx", "src/app/_layout.tsx"],
          solution: { "store/listing.json": LISTING_MODEL },
          tests: LISTING_TESTS,
          hint: "The Google Play title is too long: \"Kobo Market: Made in Nigeria\" fits in 30.",
          successMessage: "A store listing that fits both stores' rules, ready to paste into the consoles.",
        }),
      },
      {
        id: "a-md-google-play",
        title: "Google Play Console setup and release workflow",
        explain:
          "SETTING UP: create a Google Play developer account at play.google.com/console with a Google account you'll keep (a business account for companies); pay the one-time US$25 registration fee; choose PERSONAL or ORGANISATION (organisations need a D-U-N-S number); verify your identity, contact details and a phone number (and complete Android developer verification). CREATING THE APP: Create app (name, language, app or game, free or paid: a free app can never become paid), then the Dashboard's tasks: the store listing (Lesson 134), and APP CONTENT: privacy policy, app access (give reviewers a demo account if sign-in is needed), ads, content rating questionnaire (IARC), target audience, data safety form, and declarations for news, health, financial or government apps. RELEASING: upload the first AAB by hand in a testing track (later uploads can use eas submit with a service account key); Play App Signing is set up automatically. Tracks: INTERNAL (up to 100 testers, minutes), CLOSED (invited testers or Google Groups), OPEN (anyone can join), PRODUCTION. New PERSONAL accounts must run a CLOSED TEST with at least 12 testers opted in for 14 days in a row before applying for production access. Then create a production release, add release notes, choose a STAGED ROLLOUT percentage, and send for review (often hours to a few days). Keep target SDK requirements and policy e-mails in view: Google acts on them.",
        table: {
          caption: "Google Play, from account to release (October 2026).",
          headers: ["Step", "Where", "What you do"],
          rows: [
            ["1. Developer account", "play.google.com/console", "Sign up, pay US$25 once, personal or organisation (D-U-N-S), verify identity and phone"],
            ["2. Create app", "All apps → Create app", "Name, default language, app/game, free/paid, accept declarations"],
            ["3. Store listing", "Grow → Store presence", "Title, short and full description, icon, feature graphic, screenshots, category, contact"],
            ["4. App content", "Policy → App content", "Privacy policy, app access (demo login), ads, content rating, target audience, data safety, other declarations"],
            ["5. First upload", "Test and release → Testing", "Upload the first AAB by hand to internal or closed testing; Play App Signing turns on"],
            ["6. Closed test", "Testing → Closed testing", "New personal accounts: at least 12 testers opted in for 14 consecutive days"],
            ["7. Production access", "Dashboard", "Apply for production with answers about your test; then create a production release"],
            ["8. Release", "Production → Create release", "AAB (or eas submit), release notes, staged rollout %, send for review"],
          ],
        },
        decision: {
          scenario: "You've just created a new personal Google Play developer account and uploaded Kobo's first AAB to internal testing with your three teammates. You want to launch publicly next week.",
          question: "What stands between you and production?",
          options: [
            { id: "a", text: "A closed test with at least 12 testers opted in for 14 consecutive days, completed app content declarations, then applying for production access", why: "Google requires new personal accounts to run that closed test before production; internal testing with three people doesn't count." },
            { id: "b", text: "Nothing: press Publish in the internal testing track", whyWrong: "Internal testing never becomes public, and production needs the closed-test requirement first for new personal accounts." },
            { id: "c", text: "Uploading an APK instead of an AAB", whyWrong: "Play requires AABs for new apps." },
            { id: "d", text: "Paying the US$25 fee again for production", whyWrong: "The fee is one-time, at registration." },
          ],
          correct: "a",
          aftermath: "Plan the 14-day closed test into your launch date from the start.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════ LESSON 135 · 20.15 – 20.16 ═══════════════ */
  {
    id: "md-l135-app-store-review",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 8,
    covers: ["20.15", "20.16"],
    title: "Publishing on the App Store, and Passing Review",
    subtitle: "The Apple Developer Program, App Store Connect, TestFlight and App Review",
    estimatedMinutes: 70,
    intro: "Apple's process has more steps and a human review, but with EAS you can do all of it from Windows.",
    atoms: [
      {
        id: "a-md-app-store",
        title: "Apple Developer account and App Store submission workflow",
        explain:
          "ENROL in the Apple Developer Program (developer.apple.com/programs, or the Apple Developer app): US$99 per year, as an INDIVIDUAL (your name shows as the seller) or an ORGANISATION (needs a D-U-N-S number and legal authority; the company name shows). Enable two-factor authentication on the Apple Account. CREDENTIALS: on your first iOS build, eas build -p ios signs in to Apple and creates the distribution certificate, the app id (bundle identifier) and provisioning profiles for you. APP STORE CONNECT (appstoreconnect.apple.com): My Apps → + New App (platform, name, language, bundle id, SKU). Build with eas build -p ios --profile production, then eas submit -p ios (EAS can create an App Store Connect API key) and the build appears in TestFlight after processing (minutes). Test with TestFlight. Then the app's version page: screenshots, promotional text, description, keywords, support URL, the build, App Review information (contact, notes, and a DEMO ACCOUNT if sign-in is needed), age rating, App Privacy (privacy labels) and pricing. Submit for review: most reviews finish within 24–48 hours; you can release automatically, manually, or with phased release. Since 28 April 2026, uploads must use Xcode 26 and the iOS 26 SDK.",
        table: {
          caption: "The App Store, from enrolment to release (October 2026).",
          headers: ["Step", "Where", "What you do"],
          rows: [
            ["1. Enrol", "developer.apple.com/programs", "US$99/year, individual or organisation (D-U-N-S), two-factor authentication"],
            ["2. App record", "App Store Connect → My Apps → +", "Name, primary language, bundle id (ng.kobo.market), SKU"],
            ["3. Build", "eas build -p ios --profile production", "EAS creates certificates and profiles; Xcode 26 / iOS 26 SDK on EAS servers"],
            ["4. Upload", "eas submit -p ios", "App Store Connect API key; the build processes, then appears in TestFlight"],
            ["5. Test", "TestFlight", "Internal testers (up to 100) at once; external (up to 10,000) after Beta App Review"],
            ["6. Version page", "App Store tab", "Screenshots, text, keywords, support and privacy URLs, select the build"],
            ["7. Compliance", "App Privacy, Age Rating, App Review Information", "Privacy labels, age rating, contact, notes, demo account"],
            ["8. Submit", "Add for Review → Submit", "Release automatically, manually, or by phased release over 7 days"],
          ],
        },
        decision: {
          scenario: "You build on Windows, the iOS build has passed TestFlight testing, and you're filling in App Store Connect. The app requires signing in.",
          question: "What must you provide so App Review can approve it?",
          options: [
            { id: "a", text: "A working demo account (and notes on how to reach key features) in App Review Information, plus complete privacy labels, screenshots and the support and privacy policy URLs", why: "Reviewers must be able to use every feature; missing demo accounts and incomplete metadata are among the commonest rejection reasons." },
            { id: "b", text: "A Mac, because App Store submission requires Xcode on your computer", whyWrong: "EAS Build and EAS Submit do the Xcode work on Expo's servers." },
            { id: "c", text: "Nothing: reviewers create their own accounts", whyWrong: "Apple expects you to provide working credentials; otherwise the review stalls or is rejected." },
            { id: "d", text: "An enterprise certificate", whyWrong: "App Store apps are signed for App Store distribution, not enterprise." },
          ],
          correct: "a",
          aftermath: "Give reviewers everything they need to use the app as a real user would.",
        },
      },
      {
        id: "a-md-review-requirements",
        title: "Privacy disclosures and app review requirements",
        explain:
          "Both stores review every release against their policies (Apple's App Review Guidelines; Google Play's Developer Program Policies). The usual reasons for rejection, and what to do: CRASHES or broken features (test the release build; give a demo account); INCOMPLETE OR MISLEADING metadata (screenshots must show the real app; no placeholder text); PRIVACY: a privacy policy link in the store AND in the app, privacy labels / data safety answers that match what the app and its SDKs really collect, permission strings that explain the purpose, ACCOUNT DELETION inside the app if accounts can be created, and App Tracking Transparency before cross-app tracking; PAYMENTS: digital goods through store billing (Module 17); LOGIN: if you offer third-party sign-in on iOS, also offer an option that limits data collection, such as Sign in with Apple; MINIMUM FUNCTIONALITY: a thin website wrapper may be rejected; USER-GENERATED CONTENT needs reporting, blocking and moderation. If rejected, read the message, fix it or reply in the Resolution Center (Apple) / appeal (Google): most rejections are fixed within a day.",
        decision: {
          scenario: "Apple rejects Kobo under Guideline 5.1.1(v): the app lets people create an account but offers no way to delete it. The app is otherwise ready.",
          question: "What's the right response?",
          options: [
            { id: "a", text: "Add an in-app \"Delete account\" option that deletes the account and its data on the server (with confirmation), describe it in the review notes, and resubmit", why: "Both Apple and Google require in-app account deletion for apps that allow account creation; a real deletion flow, explained to the reviewer, resolves it." },
            { id: "b", text: "Add a sentence telling users to e-mail support to delete their account", whyWrong: "Apple requires the deletion to be initiated in the app (a support e-mail alone isn't enough)." },
            { id: "c", text: "Remove sign-up so there's nothing to delete", whyWrong: "That changes the product to avoid a reasonable requirement." },
            { id: "d", text: "Resubmit unchanged and hope for a different reviewer", whyWrong: "The same guideline will be applied again." },
          ],
          correct: "a",
          aftermath: "Treat review guidelines as product requirements from day one: privacy, deletion, honest metadata.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════ LESSON 136 · 20.17 – 20.19 ═══════════════ */
  {
    id: "md-l136-rollout-updates",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 9,
    covers: ["20.17", "20.18", "20.19"],
    title: "Staged Releases, Over-the-Air Updates and After Launch",
    subtitle: "Releasing carefully, fixing quickly, and keeping the app healthy",
    estimatedMinutes: 60,
    intro: "Launch day is the start of the app's life, not the end of the project.",
    atoms: [
      {
        id: "a-md-staged-rollout",
        title: "Staged releases and rollback planning",
        explain:
          "Never release a big change to everyone at once. GOOGLE PLAY's STAGED ROLLOUT releases a version to a percentage of users (for example 5%, 20%, 50%, 100%), which you can increase, or HALT if problems appear (users who already updated keep it). The APP STORE's PHASED RELEASE spreads automatic updates over 7 days (1%, 2%, 5%, 10%, 20%, 50%, 100%), and can be paused; anyone can still update manually. Decide your ROLLBACK PLAN before releasing: you can't un-publish a version from users' phones, so \"rolling back\" means shipping a FIX: an EAS Update for JavaScript-only problems (minutes; eas update:rollback can return to the previous update), or a new build with a higher build number for native problems (hours to days; Apple offers expedited review for critical bugs). Watch crash-free users, ANRs, reviews and support for 48 hours at each stage; use FEATURE FLAGS (server-controlled) to switch risky features off without a release.",
        decision: {
          scenario: "Version 2.0 rewrites checkout. You're about to release it on both stores.",
          question: "Which release plan is safest?",
          options: [
            { id: "a", text: "Google Play staged rollout from 5%, App Store phased release, the new checkout behind a server-side feature flag, and watch crash-free rate and payments at each step", why: "A few users meet any problem first; the flag turns checkout off instantly, and a fix can follow by update while the rollout is halted or paused." },
            { id: "b", text: "Release to 100% on both stores on Friday evening", whyWrong: "Everyone gets any bug at once, when the team isn't watching." },
            { id: "c", text: "Plan to delete version 2.0 from the stores if it fails", whyWrong: "Users who installed it keep it; removal isn't a rollback." },
            { id: "d", text: "Skip review by shipping the native checkout code as an over-the-air update", whyWrong: "OTA updates can't change native code, and stores don't allow updates that bypass review for new features." },
          ],
          correct: "a",
          aftermath: "Small percentages, a kill switch, and a fix path ready before you start.",
        },
      },
      {
        id: "a-md-ota-updates",
        title: "Over-the-air updates and their compatibility limitations",
        explain:
          "EAS UPDATE sends new JavaScript and assets to installed apps without a store release: eas update --channel production --message \"Fix delivery fee\" publishes; builds on that CHANNEL download it in the background and apply it on the next launch (or immediately, if you call Updates.fetchUpdateAsync() then Updates.reloadAsync()). LIMITS: an update can only change JavaScript and assets, never native code (new native libraries, permissions, app.json native settings, SDK upgrades need a new build), so each update must target a compatible RUNTIME VERSION (runtimeVersion with the \"appVersion\" policy, or \"fingerprint\", which changes automatically when native code changes); updates don't run in development builds or Expo Go. POLICY: both stores allow updates that fix bugs and make small improvements, but not ones that change the app's purpose or add features that should be reviewed. Configure it with eas update:configure (updates.url = https://u.expo.dev/<projectId>), a channel per build profile (Lesson 130), and roll out gradually (--rollout-percentage).",
        webLab: expoLab({
          name: "Kobo Market",
          layout: plainLayout,
          app: OTA_APP_START,
          editable: ["app.json"],
          task:
            "Set up over-the-air updates. app.json: runtimeVersion with the \"appVersion\" policy, and updates.url \"https://u.expo.dev/<the project id in extra.eas.projectId>\". src/updates.ts: checkForAppUpdate() returns \"skipped\" in development (__DEV__) or when Updates.isEnabled is false; otherwise checks for an update, downloads it if there is one and returns \"ready\" (or \"none\", also when the check fails); applyUpdate() restarts on it with Updates.reloadAsync().",
          files: { "src/updates.ts": OTA_START, "src/app/index.tsx": OTA_SCREEN },
          readOnly: ["src/app/index.tsx", "src/app/_layout.tsx"],
          solution: { "src/updates.ts": OTA_MODEL, "app.json": appJson("Kobo Market", OTA_APP_MODEL) },
          tests: [
            { label: "A release build downloads an available update and restarts on it", device: { build: "production", updates: { available: true, message: "Fix delivery fee" } }, check: "await waitFor(() => has('An update is ready.'), 3000); await press('Restart now'); await waitFor(() => hasText('ota-0002'), 3000); return true;", fail: "checkForUpdateAsync → fetchUpdateAsync → \"ready\"; applyUpdate → reloadAsync()." },
            { label: "No update, no banner", device: { build: "production", updates: { available: false } }, check: "await waitFor(() => hasText('Update check: none'), 3000); return !has('An update is ready.');", fail: "Return \"none\" when isAvailable is false." },
            { label: "Development builds skip the check without errors", check: "await waitFor(() => hasText('Update check: skipped'), 3000); return !logs().some((l) => /ERR_UPDATES/.test(l));", fail: "if (__DEV__ || !Updates.isEnabled) return \"skipped\";" },
            { label: "app.json points at EAS Update with a runtime version", check: "const c = config(); return c.runtimeVersion && c.runtimeVersion.policy === 'appVersion' && (c.updates || {}).url === 'https://u.expo.dev/' + c.extra.eas.projectId;", fail: "\"runtimeVersion\": { \"policy\": \"appVersion\" }, \"updates\": { \"url\": \"https://u.expo.dev/<projectId>\" }" },
          ],
          hint: "Updates.isEnabled is false in development builds and Expo Go.",
          successMessage: "JavaScript fixes delivered in minutes, safely matched to the native build they need.",
        }),
      },
      {
        id: "a-md-post-release",
        title: "Post-release monitoring and maintenance",
        explain:
          "After launch, keep a weekly rhythm: CRASHES AND ANRs (Sentry, Android vitals, App Store Connect), PERFORMANCE (start-up time, slow screens), REVIEWS (reply to them in both consoles: replies are public and change ratings), SUPPORT messages, and ANALYTICS for the funnels that matter (sign-up, purchase). MAINTENANCE never stops: Google raises the required target API level every year (new apps and updates must target Android 16 from 31 August 2026), Apple requires the newest Xcode and SDK each spring, Expo releases an SDK about three times a year (upgrade one SDK at a time, on a branch, with npx expo install expo@^<next> --fix and the upgrade guide), and dependencies, certificates and policies change. Keep a changelog, ship small releases regularly, and answer the stores' policy e-mails before their deadlines: missed deadlines can remove the app.",
        decision: {
          scenario: "Six months after launch, Play Console e-mails: \"Your app must target API level 36 by 31 August to keep publishing updates.\" Your app is on Expo SDK 55.",
          question: "What's the right maintenance plan?",
          options: [
            { id: "a", text: "Upgrade Expo SDK by SDK (55 → 56 → 57 → 58) on a branch, following each upgrade guide and npx expo install --fix, test release builds on both platforms, and ship well before the deadline", why: "Recent SDKs target the required API level; upgrading one SDK at a time with tests keeps the risk small, and early releases leave time for surprises." },
            { id: "b", text: "Ignore it: existing users keep the app", whyWrong: "You'd lose the ability to publish updates, including urgent fixes, and new users on new devices may not see the app." },
            { id: "c", text: "Edit the Android files by hand to change targetSdkVersion and nothing else", whyWrong: "Raising the target changes Android behaviour; libraries need versions that support it, which is what the SDK upgrade provides." },
            { id: "d", text: "Jump straight to the newest SDK in one commit the day before the deadline", whyWrong: "Several SDKs of changes at once, with no time to test, risks a broken release." },
          ],
          correct: "a",
          aftermath: "Maintenance is planned work: monitor weekly, upgrade regularly, meet deadlines early.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════ LESSON 137 · 20.P ═══════════════ */
  {
    id: "md-l137-m20-project",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 10,
    covers: ["20.P"],
    title: "Practical: A Complete Store-Submission Package",
    subtitle: "Everything Google Play and the App Store need, checked before you upload",
    estimatedMinutes: 150,
    intro: "Put the whole module together: configuration, build profiles, listings and a release plan, ready for both stores.",
    atoms: [
      {
        id: "a-md-m20-project",
        title: "Prepare the release package",
        explain:
          "In this lab you prepare the files; on your own computer you'll then run the builds and submissions (the practical below). Everything here is checked against the stores' rules.",
        webLab: expoLab({
          name: "Kobo Market",
          layout: plainLayout,
          app: P_APP_START,
          editable: ["app.json"],
          task:
            "Prepare Kobo Market 1.0.0 for both stores. app.json: slug kobo-market, scheme kobo, version 1.0.0, ios.bundleIdentifier and android.package ng.kobo.market, icon, adaptive icon (foreground, background colour, monochrome), the splash screen plugin with a dark variant, runtimeVersion (appVersion policy), updates.url for the project id 1b3c9e70-4f2a-4d6b-9a8e-2f6c0d1e5a77 (in extra.eas.projectId), and RECORD_AUDIO blocked. eas.json: development, preview (APK) and production (autoIncrement, channel production) profiles with appVersionSource remote, and a production submit profile for both stores. store/listing.json: complete and within every limit (as in Lesson 134). RELEASE_CHECKLIST.md: every item ticked, and a rollout plan mentioning a staged rollout, the phased release and how you would roll back.",
          files: { "eas.json": `{\n  "cli": { "version": ">= 16.0.0" },\n  "build": {}\n}\n`, "store/listing.json": LISTING_START, "RELEASE_CHECKLIST.md": CHECKLIST_START, "src/app/index.tsx": releaseHome },
          readOnly: ["src/app/index.tsx", "src/app/_layout.tsx"],
          revealSolution: false,
          solution: { "app.json": appJson("Kobo Market", P_APP_MODEL), "eas.json": P_EAS_MODEL, "store/listing.json": LISTING_MODEL, "RELEASE_CHECKLIST.md": CHECKLIST_MODEL },
          tests: [
            { label: "The app's identity and version", check: "const c = config(); return c.slug === 'kobo-market' && c.scheme === 'kobo' && c.version === '1.0.0' && (c.ios || {}).bundleIdentifier === 'ng.kobo.market' && (c.android || {}).package === 'ng.kobo.market';", fail: "slug, scheme, version and both ids." },
            { label: "Icons, splash and permissions", check: "const c = config(); const a = (c.android || {}).adaptiveIcon || {}; const s = (c.plugins || []).find((x) => Array.isArray(x) && x[0] === 'expo-splash-screen'); return !!c.icon && !!a.foregroundImage && !!a.backgroundColor && !!a.monochromeImage && !!s && !!s[1].dark && ((c.android || {}).blockedPermissions || []).includes('android.permission.RECORD_AUDIO');", fail: "icon, adaptiveIcon with monochrome, splash with dark, RECORD_AUDIO blocked." },
            { label: "Updates are configured", check: "const c = config(); return (c.runtimeVersion || {}).policy === 'appVersion' && (c.updates || {}).url === 'https://u.expo.dev/1b3c9e70-4f2a-4d6b-9a8e-2f6c0d1e5a77' && c.extra && c.extra.eas && c.extra.eas.projectId === '1b3c9e70-4f2a-4d6b-9a8e-2f6c0d1e5a77';", fail: "runtimeVersion, updates.url and extra.eas.projectId." },
            { label: "Build and submit profiles", check: easJson("const b = e.build || {}; const s = (e.submit || {}).production || {}; return (e.cli || {}).appVersionSource === 'remote' && (b.development || {}).developmentClient === true && ((b.preview || {}).android || {}).buildType === 'apk' && (b.production || {}).autoIncrement === true && (b.production || {}).channel === 'production' && !!s.android && !!s.ios;"), fail: "Profiles as in Lesson 132, and submit.production for android and ios." },
            ...LISTING_TESTS.map((t) => ({ ...t, label: "Listing: " + t.label.charAt(0).toLowerCase() + t.label.slice(1) })),
            { label: "Every checklist item is done, with a rollout plan", check: `const r = code('RELEASE_CHECKLIST.md'); const items = ${JSON.stringify(CHECKLIST_ITEMS)}; const plan = r.split('## Rollout plan')[1] || ''; return items.every((i) => r.includes('- [x] ' + i)) && !r.includes('- [ ]') && /staged rollout/i.test(plan) && /phased release/i.test(plan) && /(EAS Update|eas update|rollback|roll back)/i.test(plan);`, fail: "Tick every item ([x]) and write a rollout plan with a staged rollout, the phased release and a rollback path." },
          ],
          hint: "Reuse what you wrote in Lessons 128–136: the checks are the same.",
          successMessage: "A complete, checked submission package for Google Play and the App Store.",
        }),
      },
    ],
    task: {
      title: "Module 20 practical: publish your app to both stores",
      intro: "Do this on your own computer with your own accounts. It takes about three weeks, mostly waiting for Google's closed test.",
      prompts: [
        "Create your Expo account and run eas login, eas init and eas build:configure; build a development build and a preview APK; install the APK on a real Android phone and the development build on your iPhone (eas device:create).",
        "Create your Google Play developer account (US$25), create the app, complete the store listing and every App content declaration, upload your first production AAB to internal testing by hand, then start a closed test with at least 12 testers for 14 days.",
        "Enrol in the Apple Developer Program (US$99/year), create the app in App Store Connect, run eas build -p ios --profile production and eas submit -p ios, and test with TestFlight.",
        "Prepare screenshots for both stores, privacy policy and support pages, the data safety form and privacy labels, and a demo account for reviewers.",
        "Apply for production on Google Play after the closed test, submit for App Store review, and release with a staged rollout and phased release; publish one EAS Update to the production channel to practise your fix path.",
        "Mastery checkpoint: show your app live (or in review) on both stores, and explain how you would ship an urgent JavaScript fix and an urgent native fix.",
      ],
      closing: "Next: Module 21, your capstone project.",
    },
    requirements: { read: true, video: false, assessment: true },
  },
];
