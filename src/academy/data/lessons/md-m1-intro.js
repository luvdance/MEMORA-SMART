/**
 * MOBILE APP DEVELOPMENT · MODULE 1 · INTRODUCTION TO MOBILE APPLICATIONS
 *
 * Curriculum 1.0 – 1.P. What a mobile app is and how it works, apps versus
 * websites and PWAs, Android and iOS, native, cross-platform and hybrid
 * development, frontend and backend, clients and servers, the development
 * lifecycle, APK, AAB and IPA files, and how apps reach users through the
 * stores. Mostly ideas, so most practice is judgement; the two labs give a
 * first taste of the practice phone.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

import { MOBILE_DEVELOPMENT_COURSE } from "../mobileDevelopmentCourse.js";
import { expoLab } from "./md-helpers.js";

export const SECTION_ID = "md-s1-intro";
const MODULE = "md-m1-intro";

const modules = MOBILE_DEVELOPMENT_COURSE.months.flatMap((m) => m.modules);

const HELLO = (text) => `import { StyleSheet, Text, View } from "react-native";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>${text}</Text>
      <Text>This screen is a real React Native app.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", gap: 8, padding: 24 },
  title: { fontSize: 28, fontWeight: "700" },
});
`;

const TIPS_SERVER = `import { createServer } from "practice-server";

// The backend: it runs on a server, not on the phone. The app asks it for data.
const app = createServer(); // serves https://api.example.com

app.get("/tips", (req, res) => {
  res.json([
    { id: 1, text: "Drink water before your morning coffee." },
    { id: 2, text: "Stand up and stretch every hour." },
    { id: 3, text: "Write tomorrow's plan before you sleep." },
  ]);
});

export default app;
`;

const TIPS_SCREEN = `import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from "react-native";
import { API_URL } from "@/config";

type Tip = { id: number; text: string };

export default function TipsScreen() {
  const [tips, setTips] = useState<Tip[]>([]);
  const [status, setStatus] = useState<"loading" | "done" | "error">("loading");

  useEffect(() => {
    fetch(\`\${API_URL}/tips\`)
      .then((response) => response.json())
      .then((data: Tip[]) => {
        setTips(data);
        setStatus("done");
      })
      .catch(() => setStatus("error"));
  }, []);

  if (status === "loading") return <ActivityIndicator style={styles.center} />;
  if (status === "error") return <Text style={styles.center}>Could not reach the server.</Text>;
  return (
    <FlatList
      data={tips}
      keyExtractor={(tip) => String(tip.id)}
      renderItem={({ item }) => <Text style={styles.tip}>{item.text}</Text>}
      contentContainerStyle={{ padding: 16, gap: 12 }}
    />
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, textAlign: "center", marginTop: 40 },
  tip: { fontSize: 16, padding: 12, borderRadius: 10, backgroundColor: "#eef6f5" },
});
`;

const ANALYSIS_TEMPLATE = `# App analysis

Pick three popular apps you use. For each one, fill in every line.
Separate items in a list with commas.

## App 1: (name)
- Category:
- Platforms:
- Main screens:
- Key features:
- Data it needs:
- Likely backend services:
- Works offline:

## App 2: (name)
- Category:
- Platforms:
- Main screens:
- Key features:
- Data it needs:
- Likely backend services:
- Works offline:

## App 3: (name)
- Category:
- Platforms:
- Main screens:
- Key features:
- Data it needs:
- Likely backend services:
- Works offline:
`;

const ANALYSIS_MODEL = `# App analysis

Pick three popular apps you use. For each one, fill in every line.
Separate items in a list with commas.

## App 1: WhatsApp
- Category: Messaging
- Platforms: Android, iOS
- Main screens: Chats list, Chat, Updates, Calls, Settings, Camera
- Key features: Text and voice messages, voice and video calls, group chats, status updates, end-to-end encryption
- Data it needs: Phone number, contacts, messages, media files, profile photo, online status
- Likely backend services: Account and phone verification, message delivery servers, push notifications, media storage, call servers
- Works offline: Partly: you can read old messages and write new ones, which are sent when you reconnect

## App 2: Uber
- Category: Transport
- Platforms: Android, iOS
- Main screens: Home map, Where to, Ride options, Trip in progress, Payment, Account
- Key features: Book a ride, live driver location, fare estimate, in-app payment, ratings
- Data it needs: Location, payment details, trip history, account, driver positions
- Likely backend services: Accounts, maps and routing, driver matching, live location updates, payments, notifications
- Works offline: No: booking needs the server to find a driver

## App 3: Duolingo
- Category: Education
- Platforms: Android, iOS
- Main screens: Learn path, Lesson, Leaderboard, Profile, Shop
- Key features: Short lessons, streaks, reminders, leaderboards, progress tracking
- Data it needs: Account, course progress, streak, answers, settings
- Likely backend services: Accounts, lesson content, progress sync, leaderboards, push notifications, subscriptions
- Works offline: Partly: some lessons can be downloaded, progress syncs later
`;

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 1 · 1.0
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "md-l1-welcome",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 1,
    covers: ["1.0"],
    title: "Welcome to Mobile App Development",
    subtitle: "Where this course takes you, and how you will practise on a phone",
    estimatedMinutes: 15,
    intro:
      "Over twenty-four weeks you will go from your first line of code to an app on Android and iOS phones, released through Google Play and the App Store. You build something in almost every lesson.",

    atoms: [
      {
        id: "a-md-welcome-build",
        title: "What you will be able to build",
        explain:
          "By the end you will build the kind of app companies and clients pay for: sign-up and login, screens that load data from a server, forms that check what people type, data saved on the phone so it survives a restart, the camera, photos, location and notifications, and a design that works on small Android phones and large iPhones, in light and dark mode. You will test it, secure it, build it in the cloud, create your Google Play Console and Apple Developer accounts, and release it to real testers on both platforms. You will write ONE codebase, in TypeScript with React Native and Expo, and it will run on both Android and iOS.",
        decision: {
          scenario: "A friend says: \"To publish on both Android and iOS you have to write the app twice, once in Kotlin and once in Swift.\"",
          question: "What is accurate?",
          options: [
            { id: "a", text: "That is one way, but cross-platform tools such as React Native let one codebase run as a real app on both", why: "Native apps per platform are one approach. React Native, which this course teaches, builds genuine Android and iOS apps from one TypeScript codebase, and is used by apps such as Instagram, Discord and Shopify." },
            { id: "b", text: "Correct: there is no other way", whyWrong: "Cross-platform frameworks (React Native, Flutter, Kotlin Multiplatform) exist precisely so one team can ship to both." },
            { id: "c", text: "You only need an Android version; iPhones run Android apps", whyWrong: "iOS cannot install Android apps. Each platform has its own app format and store." },
            { id: "d", text: "Mobile apps are just websites, so you build a website", whyWrong: "A website can be installed as a web app, but a store app is a different thing with access to the phone's features (Lesson 2)." },
          ],
          correct: "a",
          aftermath: "One codebase, two platforms: that is the promise of React Native, and the path of this course.",
        },
      },
      {
        id: "a-md-welcome-phases",
        title: "Twelve phases, twenty-four weeks",
        explain:
          "The course follows the order a professional learns in. You understand the environment first (Phase 1), learn to program (Phase 2) and to design (Phase 3), then build interfaces (Phase 4), structure apps (Phases 5 and 6), connect them to servers (Phase 7) and to the phone's hardware (Phase 8), add production features (Phase 9), test and secure them (Phase 10), publish them (Phase 11), and finish with your own capstone app (Phase 12). Each module ends with a practical you do on your own computer and phone, and a mastery checkpoint: a short test of whether you can EXPLAIN what you built, not only make it run.",
        table: {
          caption: "The twelve phases.",
          headers: ["Phase", "Weeks", "What you learn"],
          rows: MOBILE_DEVELOPMENT_COURSE.phases.map((ph) => [`Phase ${ph.phase}`, ph.span.replace(/^Weeks? /, ""), ph.title[0].toUpperCase() + ph.title.slice(1)]),
        },
        decision: {
          scenario: "You finish a practical and your app works, but you could not explain why the list refreshes when you add an item.",
          question: "Is the module done?",
          options: [
            { id: "a", text: "Not yet: go back to the lesson on that idea until you can explain it", why: "The mastery checkpoint exists for exactly this. Code you cannot explain breaks the first time you change it, and you will be asked to explain it in every interview." },
            { id: "b", text: "Yes: working code is all that matters", whyWrong: "In a team you must change, debug and review code. That takes understanding, not just a passing check." },
            { id: "c", text: "Yes, and skip ahead to save time", whyWrong: "Later modules build directly on each idea." },
            { id: "d", text: "Copy an explanation from the internet", whyWrong: "The point is that you can explain it yourself." },
          ],
          correct: "a",
          aftermath: "Every module: build it, then make sure you can explain it.",
        },
      },
      {
        id: "a-md-welcome-roadmap",
        title: "The whole road, module by module, and your first app",
        explain:
          "Here is every module in order. From Module 3 on, almost every lesson has a lab like the one below: real app files on the left, and on the right the PRACTICE PHONE, which runs your code as an iPhone or an Android phone. Edit the code, watch the phone update, then press Check my page to test it. The practice phone simulates a real device closely (its status bar, keyboard, permission prompts, back button and storage), but it is not a real phone, so every practical also asks you to run your app on your own phone.",
        table: {
          caption: "Every module of the course.",
          headers: ["Module", "Week", "Topic"],
          rows: modules.map((m) => [m.title.split(" · ")[0], m.week, m.title.split(" · ")[1]]),
        },
        webLab: expoLab({
          name: "Hello Phone",
          task:
            "Your first app. Change the big title from \"Hello, world\" to \"Hello from my phone\", watch the practice phone update, then switch the phone to Android with the button above it: the same code runs there too.",
          files: { "src/app/index.tsx": HELLO("Hello, world") },
          solution: { "src/app/index.tsx": HELLO("Hello from my phone") },
          tests: [
            { label: "The title says \"Hello from my phone\" on an iPhone", check: "return has('Hello from my phone');", fail: "Change the text between <Text style={styles.title}> and </Text>." },
            { label: "The same code works on Android", device: { os: "android" }, check: "return has('Hello from my phone') && device().os === 'android';", fail: "The title must change; the Android phone runs the same file." },
          ],
          hint: "Only the words between the tags change. Keep the quotes and tags exactly as they are.",
          successMessage: "That is the whole loop: edit, look, check. One file of code, running on an iPhone and an Android phone.",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 2 · 1.1 – 1.3
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "md-l2-what-apps-are",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 2,
    covers: ["1.1", "1.2", "1.3"],
    title: "What Mobile Apps Are",
    subtitle: "How an app works, how it differs from a website, and the two platforms",
    estimatedMinutes: 30,
    intro: "Before building apps, it helps to know exactly what one is: what is on your phone, what is not, and why Android and iPhone apps are different things.",

    atoms: [
      {
        id: "a-md-what-app",
        title: "What a mobile application is and how it works",
        explain:
          "A mobile app is a program installed on a phone. When you tap its icon the operating system (Android or iOS) starts it, gives it a window that fills the screen, and passes it your touches. The app draws its screens, reacts to what you do, and stores what it needs on the phone. Most apps also talk to servers over the internet to get or save data: your messages, your bank balance, today's news. The app on the phone is the part you see; the server holds the shared data and does the work the phone cannot or should not do. An app can also use the phone's hardware (camera, GPS, notifications, fingerprint sensor), but only with your permission.",
        decision: {
          scenario: "You open a weather app on a train with no signal. It shows yesterday's forecast with a note \"Last updated 18 hours ago\".",
          question: "What does that tell you about how the app works?",
          options: [
            { id: "a", text: "Forecasts come from a server; the app saved the last one on the phone and shows it when it cannot connect", why: "The data lives on the server; the app keeps a copy (a cache) so it is still useful offline, and is honest about its age." },
            { id: "b", text: "The forecast is calculated by the phone itself", whyWrong: "Forecasts are produced by weather services on servers; the phone only displays them." },
            { id: "c", text: "The app is broken", whyWrong: "Showing saved data with its age is good design for a phone that is often offline." },
            { id: "d", text: "The app is a website", whyWrong: "A website with no connection would usually not load at all." },
          ],
          correct: "a",
          aftermath: "Phones lose their connection all the time. Good apps keep working with what they saved.",
        },
      },
      {
        id: "a-md-apps-vs-web",
        title: "Mobile apps versus websites and progressive web apps",
        explain:
          "A WEBSITE runs in the browser: no install, works on any device, updated the moment you change the server, but limited access to the phone. A PROGRESSIVE WEB APP (PWA) is a website that can be added to the home screen, work offline and, on modern Android and iOS (16.4+), send notifications; it still runs in the browser engine and cannot use many native features. A NATIVE APP is installed from an app store: it starts fast, works offline, uses the camera, location, Bluetooth, biometrics and background tasks fully, can be found in the store, and feels like the platform; but every update goes through a build and (usually) store review, and you need developer accounts. Choose by need: a restaurant menu is fine as a website; a ride-hailing app with live location and payments needs a native app.",
        decision: {
          scenario: "A school wants parents to read the term calendar and newsletters. A second idea is an attendance app that scans each child's QR code with the teacher's camera, works without data in rural schools, and syncs later.",
          question: "Which is the best fit for each?",
          options: [
            { id: "a", text: "A website (or PWA) for the calendar; a native app for the attendance scanner", why: "Reading content needs no install. Camera scanning, reliable offline storage and background sync are where native apps are strongest." },
            { id: "b", text: "Native apps for both", whyWrong: "Making parents install an app just to read a calendar adds friction for no gain." },
            { id: "c", text: "Websites for both", whyWrong: "A website has weaker camera, offline and background abilities, exactly what the scanner relies on." },
            { id: "d", text: "A PWA for the scanner, because PWAs are always better", whyWrong: "PWAs are good for many things, but they have limited background sync and native features, especially on iOS." },
          ],
          correct: "a",
          aftermath: "Not everything should be an app. When it should, you will know why.",
        },
      },
      {
        id: "a-md-android-ios",
        title: "Android versus iOS",
        explain:
          "Android, made by Google, runs on phones from many manufacturers (Samsung, Tecno, Infinix, Xiaomi, Google Pixel…) at every price; it is on most of the world's phones and the large majority in Nigeria and across Africa. iOS, made by Apple, runs only on iPhones; it is a smaller share in most of the world but large in the United States, the UK and Japan, and its users spend more on apps on average. What differs for a developer: the stores (Google Play and the App Store) with their own accounts, fees, rules and review; the app formats (AAB/APK and IPA); design conventions (the Android back button and Material Design versus iOS swipe-back and Apple's Human Interface Guidelines); and how permissions and notifications are asked for. Android also has far more screen sizes and older devices in use, so you must test on a cheap phone, not only a flagship.",
        decision: {
          scenario: "You are building a savings app for market traders in Lagos and Kano. You have time to test on only two phones before your first release.",
          question: "Which two are the most sensible?",
          options: [
            { id: "a", text: "A low-cost Android phone and an iPhone", why: "Most of your users are likely on affordable Android phones, which are slower with smaller screens; an iPhone covers the other platform. Testing only flagships hides real problems." },
            { id: "b", text: "Two new flagship iPhones", whyWrong: "That misses Android entirely, which is most of this audience." },
            { id: "c", text: "Two flagship Android phones", whyWrong: "It misses iOS, and flagships hide the speed and screen-size problems of cheaper phones." },
            { id: "d", text: "No phones: the laptop simulator is enough", whyWrong: "Simulators help, but real devices show real performance, touch and network behaviour." },
          ],
          correct: "a",
          aftermath: "Know your users' phones. Test on the phone they actually have.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 3 · 1.4 – 1.7
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "md-l3-how-apps-are-built",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 3,
    covers: ["1.4", "1.5", "1.6", "1.7"],
    title: "How Apps Are Built",
    subtitle: "Native, cross-platform and hybrid; frontend and backend; clients and servers",
    estimatedMinutes: 35,
    intro: "Every app is built with one of three approaches, and almost every app is two programs: the one on the phone and the one on the server. This lesson shows how they fit together.",

    atoms: [
      {
        id: "a-md-native-cross-hybrid",
        title: "Native, cross-platform and hybrid development",
        explain:
          "NATIVE: one app per platform, in the platform's own language and tools: Kotlin with Jetpack Compose in Android Studio, Swift with SwiftUI in Xcode. Best possible access to new platform features, but two codebases and often two teams. CROSS-PLATFORM: one codebase that becomes a real native app on each platform. React Native (from Meta; JavaScript/TypeScript; the UI is made of real native views) and Flutter (from Google; Dart; draws its own UI) are the two leaders; Kotlin Multiplatform shares logic between native apps. HYBRID: a web app (HTML, CSS, JavaScript) inside a native shell's web view, such as Ionic with Capacitor; quickest if you already have a website, but it looks and feels less native. This course uses React Native with Expo: one TypeScript codebase, real native apps, and when something needs native code you can still write Kotlin or Swift (Module 17).",
        decision: {
          scenario: "A startup has two web developers who know JavaScript and React. They need an Android and an iOS app with a native feel, camera and notifications, in four months.",
          question: "Which approach fits best?",
          options: [
            { id: "a", text: "Cross-platform with React Native and Expo", why: "It reuses their JavaScript and React skills, produces real native apps for both platforms from one codebase, and Expo provides the camera, notifications and builds." },
            { id: "b", text: "Two native apps in Kotlin and Swift", whyWrong: "It would mean learning two new languages and building everything twice in four months." },
            { id: "c", text: "Hybrid in a web view", whyWrong: "Possible, but it feels less native, and their React skills transfer even better to React Native." },
            { id: "d", text: "Flutter, because it is the only cross-platform option", whyWrong: "Flutter is a strong option, but it means learning Dart; React Native fits a React team better." },
          ],
          correct: "a",
          aftermath: "Choose the approach that fits the team and the product, not the one in the headlines.",
        },
      },
      {
        id: "a-md-frontend-backend",
        title: "Frontend versus backend development",
        explain:
          "The FRONTEND is the part people see and touch: the screens, buttons and animations of the app on the phone (or a website in a browser). The BACKEND runs on servers: it stores the data everyone shares, checks who you are, enforces the rules (\"only the owner can delete this post\"), processes payments and sends notifications. A mobile developer builds the frontend and must understand the backend: what to ask it for, what it returns, and above all what must NEVER be trusted to the phone, because anyone can change what an app on their own phone sends. Rule of thumb: the phone asks, the server decides.",
        decision: {
          scenario: "A quiz app awards a ₦5,000 voucher to anyone scoring 100%. The team proposes that the app checks the answers and, if all are right, sends \"score: 100\" to the server.",
          question: "What is wrong with that design?",
          options: [
            { id: "a", text: "Anyone can make their phone send \"score: 100\"; the server must check the answers itself", why: "Code on the user's device can be inspected and its requests faked. Anything worth money or trust is decided on the backend." },
            { id: "b", text: "Nothing: phones are secure", whyWrong: "A phone belongs to its user, who can change or imitate what an app sends." },
            { id: "c", text: "Checking answers on the phone is too slow", whyWrong: "Speed is not the problem; trust is." },
            { id: "d", text: "The server should send the answers to the phone first", whyWrong: "That makes cheating even easier." },
          ],
          correct: "a",
          aftermath: "The phone asks; the server decides. Module 15 and Module 19 come back to this.",
        },
      },
      {
        id: "a-md-client-server",
        title: "Client-server architecture",
        explain:
          "In a CLIENT-SERVER system, many CLIENTS (each user's app, plus the website) send REQUESTS to a SERVER, which sends back RESPONSES. The server is the single source of truth: when you send a message, your app sends it to the server, the server stores it and delivers it to your friend's app. Servers usually sit behind a public address such as https://api.example.com and keep their data in a DATABASE. Several servers may work together (one for accounts, one for files, one for payments), and many apps use ready-made backend services such as Firebase or Supabase instead of writing their own (Module 14).",
        decision: {
          scenario: "Two friends edit the same shared shopping list from their own phones at the same time.",
          question: "Where should the list's true current version live?",
          options: [
            { id: "a", text: "On the server; each phone shows a copy and sends its changes there", why: "A single source of truth on the server lets both phones see each other's changes and resolves conflicts in one place." },
            { id: "b", text: "On whichever phone edited it last", whyWrong: "Then the other phone has no way to find it." },
            { id: "c", text: "On both phones, separately", whyWrong: "The two copies would drift apart, and neither would see the other's changes." },
            { id: "d", text: "In the app store", whyWrong: "The store distributes the app, not its users' data." },
          ],
          correct: "a",
          aftermath: "Clients come and go; the server keeps the truth.",
        },
      },
      {
        id: "a-md-app-server-talk",
        title: "How applications communicate with servers",
        explain:
          "Apps talk to servers over HTTPS, the secure version of the web's HTTP. The app sends a REQUEST to an address (an ENDPOINT) such as https://api.example.com/tips, with a METHOD saying what it wants: GET to read, POST to create, PUT or PATCH to change, DELETE to remove. The server replies with a STATUS CODE (200 OK, 404 Not Found, 500 Server Error) and usually data in JSON, a text format that looks like JavaScript objects. In code this is one call to fetch() (Module 4). Requests take time and can fail (no signal, a typo in the address, a server problem), so an app must always show something while it waits and something sensible when it fails. The lab below has a mistake of exactly that kind.",
        webLab: expoLab({
          name: "Daily Tips",
          task:
            "This app asks its server for today's tips, but it shows \"Could not reach the server.\" because the address in src/config.ts has a typo. Fix the address so it is https://api.example.com, and watch the tips arrive. (You do not need to understand the other files yet: read them, and notice the server code in server/index.js is a separate program from the app.)",
          files: {
            "src/config.ts": `// Where the app's backend lives.\nexport const API_URL = "https://api.exampel.com";\n`,
            "src/app/index.tsx": TIPS_SCREEN,
            "server/index.js": TIPS_SERVER,
          },
          readOnly: ["src/app/index.tsx", "server/index.js"],
          layout: `import { Stack } from "expo-router";\n\nexport default function RootLayout() {\n  return (\n    <Stack>\n      <Stack.Screen name="index" options={{ title: "Daily tips" }} />\n    </Stack>\n  );\n}\n`,
          solution: { "src/config.ts": `// Where the app's backend lives.\nexport const API_URL = "https://api.example.com";\n` },
          tests: [
            { label: "The app reaches the server and shows the three tips", check: "await waitFor(() => has('Stand up and stretch every hour.'), 3000); return has('Drink water before your morning coffee.') && has('Write tomorrow\\'s plan before you sleep.');", fail: "Check the spelling of example in API_URL." },
            { label: "It asked the right endpoint: GET /tips", check: "await waitFor(() => serverRequests().length > 0, 3000); const r = serverRequests()[0]; return r && r.method === 'GET' && r.path === '/tips';", fail: "API_URL must be exactly https://api.example.com, with no slash at the end." },
          ],
          hint: "Look closely at the domain name: exampel is not example.",
          successMessage: "One wrong letter, and the app could not find its server. Now you have seen a client and a server talk.",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 4 · 1.8 – 1.10
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "md-l4-lifecycle-stores",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 4,
    covers: ["1.8", "1.9", "1.10"],
    title: "From Idea to the App Store",
    subtitle: "The development lifecycle, app packages, and how stores distribute apps",
    estimatedMinutes: 30,
    intro: "An app's life does not end when it works on your phone. This lesson follows it from an idea to a user's home screen, and on through every update.",

    atoms: [
      {
        id: "a-md-lifecycle",
        title: "The app development lifecycle",
        explain:
          "Professional apps move through six stages, and then round again. IDEA: a problem, who has it, and what the smallest useful app would be. DESIGN: screens, flows and prototypes, tested with users before coding (Modules 5–6). DEVELOPMENT: building it, in small steps saved to Git (Modules 3–17). TESTING: on real Android and iOS phones, with automated tests and with real users (Module 18). DEPLOYMENT: release builds, store listings, review, and a staged release (Module 20). MAINTENANCE: fixing crashes, answering reviews, updating for new OS versions and store rules, and adding features, which starts the cycle again. Most of an app's life is maintenance: Google Play, for example, requires apps to target a recent Android version every year (Android 16, API level 36, for new apps and updates from 31 August 2026).",
        decision: {
          scenario: "A team spends five months building every feature they can imagine, then shows the app to users for the first time. Users do not understand the main screen.",
          question: "Which stage did they skip or rush?",
          options: [
            { id: "a", text: "Design and early user testing: a prototype shown to users in week two would have caught it", why: "Testing designs with real users before building is far cheaper than rebuilding after five months." },
            { id: "b", text: "Deployment", whyWrong: "Deployment comes after; the problem is that the screen did not work for users." },
            { id: "c", text: "Maintenance", whyWrong: "There was nothing to maintain yet." },
            { id: "d", text: "None: this is normal", whyWrong: "It is common, but it is avoidable and expensive." },
          ],
          correct: "a",
          aftermath: "Show it to users early and often. Building is the expensive part.",
        },
      },
      {
        id: "a-md-app-packages",
        title: "Understanding APK, AAB and IPA files",
        explain:
          "A finished app is packaged into one file for each platform. ANDROID: an APK (Android Package) is an installable app: you can send one to a tester and install it directly. An AAB (Android App Bundle) is what you UPLOAD TO GOOGLE PLAY: Play uses it to build optimised APKs for each device (only the right screen density and processor code), so downloads are smaller. New apps on Google Play must be published as AABs. iOS: an IPA (iOS App Store Package) is the iOS app archive. It cannot simply be installed on any iPhone: it must be signed by an Apple developer account and installed through the App Store, TestFlight (Apple's beta testing), or onto specific registered devices. Every package is SIGNED with a key or certificate that proves who built it, so updates can only come from you (Module 20). With Expo, EAS Build produces all of these in the cloud, so you do not need a Mac to build for iOS.",
        table: {
          caption: "The three app packages.",
          headers: ["File", "Platform", "Used for"],
          rows: [
            ["APK", "Android", "Installing directly on a phone: testers, internal builds, other stores"],
            ["AAB", "Android", "Uploading to Google Play, which turns it into optimised APKs"],
            ["IPA", "iOS", "The App Store, TestFlight, or registered test devices (always signed by Apple's rules)"],
          ],
        },
        decision: {
          scenario: "You want to (1) send your app to a friend's Android phone over WhatsApp to try today, and (2) publish it on Google Play next month.",
          question: "Which files do you need?",
          options: [
            { id: "a", text: "An APK for the friend, an AAB for Google Play", why: "An APK installs directly; Google Play requires an App Bundle for new apps." },
            { id: "b", text: "An AAB for both", whyWrong: "An AAB cannot be installed directly on a phone; it is a publishing format." },
            { id: "c", text: "An IPA for both", whyWrong: "IPAs are for iOS." },
            { id: "d", text: "An APK for both", whyWrong: "Google Play requires new apps to be uploaded as AABs." },
          ],
          correct: "a",
          aftermath: "APK to install, AAB to publish on Play, IPA for iOS.",
        },
      },
      {
        id: "a-md-stores",
        title: "How applications are distributed through app stores",
        explain:
          "Most people get apps from a store: Google Play on Android (plus others such as the Samsung Galaxy Store and, increasingly, direct downloads) and the App Store on iPhone. To publish you need a developer account: Google Play Console (a one-time US$25 fee, with identity verification) and the Apple Developer Program (US$99 a year). You create a STORE LISTING (name, description, screenshots, icon, category), answer questions about your content, your users' ages and the DATA you collect (Google Play's Data safety form, Apple's App Privacy details), upload a build, and submit it for REVIEW. Reviewers check it works and follows the store's policies; rejection is common and normal, and you fix the issue and resubmit. New personal Google Play accounts must first run a closed test with at least 12 testers for 14 days before they can publish to production. Building successfully does NOT guarantee publishing: policies, accounts, privacy answers and review decisions all matter. Module 20 walks through every step on both stores.",
        decision: {
          scenario: "Your app works perfectly. You upload it to the App Store and it is rejected: the app asks for the user's contacts but never explains why, and the privacy details say no data is collected.",
          question: "What does this tell you about publishing?",
          options: [
            { id: "a", text: "Stores check honesty and policy, not just whether the app runs: fix the permission explanation and the privacy answers, then resubmit", why: "Reviewers check permissions, privacy declarations and policies. Rejection is a normal step: you fix and resubmit." },
            { id: "b", text: "The reviewer made a mistake; submit the same build again", whyWrong: "The problems are real: an unexplained permission and an inaccurate privacy declaration." },
            { id: "c", text: "You need a more expensive developer account", whyWrong: "Account type is not the issue." },
            { id: "d", text: "Publish it as a website instead", whyWrong: "That avoids the lesson: users and stores expect apps to be honest about data." },
          ],
          correct: "a",
          aftermath: "A store listing is a promise to users. Reviewers check that you keep it.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 5 · 1.P
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "md-l5-m1-project",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 5,
    covers: ["1.P"],
    title: "Practical: Analyse Three Popular Apps",
    subtitle: "Screens, features, data and the backend behind them",
    estimatedMinutes: 60,
    intro:
      "Developers learn a lot by taking apart apps they already use. In this practical you analyse three apps the way a product team would before building one.",

    atoms: [
      {
        id: "a-md-m1-project",
        title: "Write your app analysis",
        explain:
          "Open three apps you use often, ideally different kinds (messaging, shopping, banking, transport, learning). For each, walk through every screen you can reach and write down: its category and platforms; its MAIN SCREENS; its KEY FEATURES; the DATA it needs (from you, from the phone, from other users); the BACKEND SERVICES it must use (accounts, storage, payments, maps, notifications…); and whether it works offline. You are practising the thinking you will use to plan your own app in Module 6 and your capstone in Module 21.",
        webLab: {
          task:
            "Fill in analysis.md for three different apps. Replace every (name) with the app's name and complete every line: at least 3 main screens, at least 3 key features, at least 2 data items and at least 2 backend services for each app (separate items with commas), plus whether it works offline. The three apps must be different.",
          files: { "analysis.md": ANALYSIS_TEMPLATE },
          revealSolution: false,
          tests: [
            { label: "Three different apps are named", check: "const names = [...raw('analysis.md').matchAll(/^## App \\d: *(.+)$/gm)].map((m) => m[1].trim()); return names.length === 3 && names.every((n) => n && n !== '(name)') && new Set(names.map((n) => n.toLowerCase())).size === 3;", fail: "Write each app's name after \"## App 1:\", \"## App 2:\" and \"## App 3:\", instead of (name)." },
            { label: "Every line is filled in for every app", check: "const parts = raw('analysis.md').split(/^## App \\d:.*$/m).slice(1); return parts.length === 3 && parts.every((p) => ['Category', 'Platforms', 'Main screens', 'Key features', 'Data it needs', 'Likely backend services', 'Works offline'].every((f) => { const m = p.match(new RegExp('^- ' + f + ': *(.+)$', 'm')); return m && m[1].trim().length > 1; }));", fail: "Each app needs an answer after every colon." },
            { label: "At least 3 screens and 3 features for each app", check: "const parts = raw('analysis.md').split(/^## App \\d:.*$/m).slice(1); const count = (p, f) => ((p.match(new RegExp('^- ' + f + ': *(.+)$', 'm')) || [])[1] || '').split(',').filter((x) => x.trim()).length; return parts.length === 3 && parts.every((p) => count(p, 'Main screens') >= 3 && count(p, 'Key features') >= 3);", fail: "List at least three screens and three features, separated by commas." },
            { label: "At least 2 data items and 2 backend services for each app", check: "const parts = raw('analysis.md').split(/^## App \\d:.*$/m).slice(1); const count = (p, f) => ((p.match(new RegExp('^- ' + f + ': *(.+)$', 'm')) || [])[1] || '').split(',').filter((x) => x.trim()).length; return parts.length === 3 && parts.every((p) => count(p, 'Data it needs') >= 2 && count(p, 'Likely backend services') >= 2);", fail: "Think about accounts, storage, payments, maps and notifications." },
          ],
          solution: { "analysis.md": ANALYSIS_MODEL },
          hint: "For backend services, ask: what must be stored somewhere shared, and what must someone other than me be able to see?",
          successMessage: "You just did a product team's first job: understanding what an app is made of before building one.",
        },
      },
    ],
    task: {
      title: "Module 1 practical: analyse three apps",
      intro: "Do this with the apps on your own phone.",
      prompts: [
        "For each of your three apps, sketch its main screens on paper, with arrows for how you move between them.",
        "For one app, list what would still work if your phone had no internet, and what would not.",
        "Find each app's store listing on Google Play or the App Store and read its Data safety or App Privacy section. Does it match the data you listed?",
        "Mastery checkpoint: explain to someone, for one app, what runs on the phone, what runs on a server, and how the two talk to each other.",
      ],
      closing: "Next: Module 2, setting up your computer and running your first app on your own phone.",
    },
    requirements: { read: true, video: false, assessment: true },
  },
];
