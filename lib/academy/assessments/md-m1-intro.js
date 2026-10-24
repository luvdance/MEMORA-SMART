/**
 * ASSESSMENTS · MOBILE APP DEVELOPMENT · MODULE 1 · INTRODUCTION TO MOBILE APPLICATIONS
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Never import this from anything under src/.
 * ═════════════════════════════════════════════════════════════════════════
 */

import { q, check } from "./md-helpers.js";

export const ASSESSMENTS = {
  ...check("md-l1-welcome", [
    q({ id: "mdq1-1", atom: "a-md-welcome-build", d: 1, prompt: "What does React Native let you do?", options: ["Build real Android and iOS apps from one codebase", "Run Android apps on iPhones", "Turn any website into an app automatically", "Build apps without any code"], correct: "a",
      explanation: "One TypeScript codebase becomes a native app on each platform.",
      wrong: { b: "iPhones cannot run Android apps.", c: "It is a framework you write apps in, not a converter.", d: "You write code; this course teaches you how." } }),
    q({ id: "mdq1-2", atom: "a-md-welcome-phases", d: 1, prompt: "What is a module's mastery checkpoint for?", options: ["Checking you can explain what you built, not just make it run", "Getting a discount on the next module", "Skipping the practical", "Publishing your app"], correct: "a",
      explanation: "Understanding is what lets you change and debug code later.",
      wrong: { b: "There is no such discount.", c: "It comes with the practical.", d: "Publishing is Module 20." } }),
    q({ id: "mdq1-3", atom: "a-md-welcome-roadmap", d: 1, prompt: "What is the practice phone in the labs?", options: ["A simulation that runs your real app code as an iPhone or an Android phone", "A real phone in a data centre", "A video of an app", "A picture of what the app should look like"], correct: "a",
      explanation: "It runs your code with the device simulated; you also test on your own phone.",
      wrong: { b: "It runs in your browser.", c: "It runs your code live.", d: "It runs what you wrote." } }),
    q({ id: "mdq1-4", atom: "a-md-welcome-roadmap", d: 2, prompt: "Why does every practical ask you to run your app on your own phone too?", options: ["A simulation cannot prove everything a real device does", "The practice phone is broken", "Stores require it", "It is optional decoration"], correct: "a",
      explanation: "Real devices show real performance, touch, network and hardware behaviour.",
      wrong: { b: "It works; it is simply not a real device.", c: "Stores do not check this.", d: "It is an important part of the practice." } }),
  ]),

  ...check("md-l2-what-apps-are", [
    q({ id: "mdq2-1", atom: "a-md-what-app", d: 2, prompt: "Where does the data in your messaging app's chat list really live?", options: ["On the server; the app keeps a copy on the phone", "Only on your phone", "In the app store", "In the phone's camera roll"], correct: "a",
      explanation: "The server holds the shared truth; the phone caches it.",
      wrong: { b: "Then your friend could never receive anything.", c: "Stores distribute apps, not data.", d: "Unrelated." } }),
    q({ id: "mdq2-2", atom: "a-md-apps-vs-web", d: 2, prompt: "Which need most strongly suggests a native app rather than a website?", options: ["Scanning with the camera and syncing in the background while offline", "Showing a restaurant menu", "Publishing a blog", "Displaying a contact form"], correct: "a",
      explanation: "Camera, offline storage and background work are native strengths.",
      wrong: { b: "A website is ideal.", c: "A website is ideal.", d: "A website is ideal." } }),
    q({ id: "mdq2-3", atom: "a-md-apps-vs-web", d: 2, prompt: "What is a progressive web app?", options: ["A website that can be installed to the home screen and work offline", "An app that updates itself every day", "An Android-only app", "A website that only works on laptops"], correct: "a",
      explanation: "It still runs in the browser engine.",
      wrong: { b: "That is not what the word means.", c: "PWAs run on both platforms.", d: "PWAs are made for phones too." } }),
    q({ id: "mdq2-4", atom: "a-md-android-ios", d: 2, prompt: "Which statement about Android and iOS is accurate?", options: ["Android runs on phones from many manufacturers; iOS runs only on iPhones", "iOS runs on most of the world's phones", "Android apps install on iPhones", "Both use the same store"], correct: "a",
      explanation: "Many manufacturers ship Android; Apple alone ships iOS.",
      wrong: { b: "Android is on most phones worldwide.", c: "They are separate platforms.", d: "Google Play and the App Store are separate." } }),
    q({ id: "mdq2-5", atom: "a-md-android-ios", d: 3, prompt: "Why should you test on a low-cost Android phone, not just a flagship?", options: ["Many users have one, and it shows slowness and small-screen problems flagships hide", "Cheap phones run a different language", "Stores require a cheap phone", "Flagships cannot run apps"], correct: "a",
      explanation: "Test on the phones your users actually have.",
      wrong: { b: "They run the same apps.", c: "No such rule.", d: "They can." } }),
  ]),

  ...check("md-l3-how-apps-are-built", [
    q({ id: "mdq3-1", atom: "a-md-native-cross-hybrid", d: 2, prompt: "Which is a cross-platform framework?", options: ["React Native", "Swift with SwiftUI", "Kotlin with Jetpack Compose", "Xcode"], correct: "a",
      explanation: "One codebase, native apps on both platforms.",
      wrong: { b: "Native iOS.", c: "Native Android.", d: "Apple's development tool." } }),
    q({ id: "mdq3-2", atom: "a-md-native-cross-hybrid", d: 2, prompt: "What does a hybrid app do?", options: ["Runs a web app inside a native shell's web view", "Draws every pixel itself", "Uses Kotlin and Swift together", "Runs only offline"], correct: "a",
      explanation: "Hybrid apps (Ionic, Capacitor) wrap web code.",
      wrong: { b: "That describes Flutter.", c: "That is two native apps.", d: "Unrelated." } }),
    q({ id: "mdq3-3", atom: "a-md-frontend-backend", d: 3, prompt: "A shop app shows prices. Who must decide the price charged at checkout?", options: ["The server, from its own records", "The app, from what is on screen", "The user", "The app store"], correct: "a",
      explanation: "Anything the phone sends can be changed; the server decides.",
      wrong: { b: "A modified app could send any price.", c: "Obviously not.", d: "The store handles distribution, not your prices." } }),
    q({ id: "mdq3-4", atom: "a-md-client-server", d: 2, prompt: "In a client-server system, what is the client?", options: ["Each user's app, sending requests to the server", "The database", "The company's office", "The phone's operating system"], correct: "a",
      explanation: "Clients ask; the server answers.",
      wrong: { b: "The database is behind the server.", c: "Not a technical term here.", d: "The OS runs the client app." } }),
    q({ id: "mdq3-5", atom: "a-md-app-server-talk", d: 2, prompt: "Which HTTP method does an app use to READ a list of items?", options: ["GET", "POST", "DELETE", "PATCH"], correct: "a",
      explanation: "GET reads; POST creates; PATCH changes; DELETE removes.",
      wrong: { b: "POST creates.", c: "DELETE removes.", d: "PATCH changes part of an item." } }),
  ]),

  ...check("md-l4-lifecycle-stores", [
    q({ id: "mdq4-1", atom: "a-md-lifecycle", d: 2, prompt: "Which stage takes up most of a successful app's life?", options: ["Maintenance", "Idea", "Design", "The first release"], correct: "a",
      explanation: "Fixes, OS updates, new store rules and features never stop.",
      wrong: { b: "Short, at the start.", c: "Weeks, not years.", d: "A single moment." } }),
    q({ id: "mdq4-2", atom: "a-md-app-packages", d: 2, prompt: "Which file do you upload to Google Play for a new app?", options: ["An AAB (Android App Bundle)", "An APK", "An IPA", "A ZIP of the source code"], correct: "a",
      explanation: "Play builds optimised APKs from the bundle.",
      wrong: { b: "APKs are for direct installs.", c: "IPAs are for iOS.", d: "Stores take built apps, not source." } }),
    q({ id: "mdq4-3", atom: "a-md-app-packages", d: 3, prompt: "Why can't you send an IPA to any iPhone and install it?", options: ["iOS only installs apps signed and distributed under Apple's rules: App Store, TestFlight or registered devices", "IPAs are too big", "iPhones have no storage", "IPAs only work on Android"], correct: "a",
      explanation: "Apple controls installation through signing.",
      wrong: { b: "Size is not the reason.", c: "Unrelated.", d: "IPAs are iOS packages." } }),
    q({ id: "mdq4-4", atom: "a-md-stores", d: 2, prompt: "What do you pay to publish?", options: ["Google Play Console: US$25 once; Apple Developer Program: US$99 a year", "Nothing on either", "US$99 once on both", "A share of every app's downloads, even free ones"], correct: "a",
      explanation: "Those are the account fees (stores also take a share of paid sales).",
      wrong: { b: "Both charge for a developer account.", c: "Apple's fee is yearly; Google's is US$25.", d: "Free apps pay no per-download fee." } }),
    q({ id: "mdq4-5", atom: "a-md-stores", d: 3, prompt: "Your app builds and runs perfectly. Is it guaranteed to be published?", options: ["No: policies, accounts, privacy declarations and review all decide", "Yes, if it builds", "Yes, if it has no bugs", "Only Android apps are reviewed"], correct: "a",
      explanation: "A working build is necessary, not sufficient.",
      wrong: { b: "Building is only the start.", c: "Policy and privacy matter too.", d: "Both stores review apps." } }),
  ]),

  ...check("md-l5-m1-project", [
    q({ id: "mdq5-1", atom: "a-md-m1-project", d: 2, prompt: "In your analysis, which is a backend service rather than a screen?", options: ["Push notifications", "The settings screen", "The chat list", "The profile page"], correct: "a",
      explanation: "Notifications are sent by servers; the others are screens.",
      wrong: { b: "A screen.", c: "A screen.", d: "A screen." } }),
    q({ id: "mdq5-2", atom: "a-md-m1-project", d: 2, prompt: "A ride-hailing app does not work offline. Why?", options: ["Booking needs the server to find a driver in real time", "Its screens are too big", "It uses too many colours", "Offline apps are not allowed"], correct: "a",
      explanation: "Some features depend entirely on live shared data.",
      wrong: { b: "Unrelated.", c: "Unrelated.", d: "They are allowed." } }),
    q({ id: "mdq5-3", atom: "a-md-m1-project", d: 3, prompt: "Where would you check what data an app says it collects?", options: ["Its store listing's Data safety (Google Play) or App Privacy (App Store) section", "The app's icon", "The phone's battery settings", "The app's splash screen"], correct: "a",
      explanation: "Stores require these declarations.",
      wrong: { b: "Icons say nothing about data.", c: "Unrelated.", d: "Unrelated." } }),
    q({ id: "mdq5-4", atom: "a-md-m1-project", d: 2, prompt: "Why analyse existing apps before building your own?", options: ["To learn how real apps are structured: screens, features, data and services", "To copy their code", "To find their passwords", "Because stores require it"], correct: "a",
      explanation: "It trains the planning you will do in Module 6.",
      wrong: { b: "You cannot see their code, and should not copy it.", c: "Never.", d: "They do not." } }),
  ]),
};
