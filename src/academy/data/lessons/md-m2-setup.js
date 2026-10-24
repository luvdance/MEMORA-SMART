/**
 * MOBILE APP DEVELOPMENT · MODULE 2 · COMPUTER AND DEVELOPMENT ENVIRONMENT SETUP
 *
 * Curriculum 2.1 – 2.P. VS Code, files and folders, the terminal, Node.js
 * and npm, packages and dependencies, Git and GitHub, creating an Expo
 * project, running it on an Android phone and an iPhone, emulators and
 * simulators, and environment variables and configuration files.
 *
 * Every terminal in this module shows what the command REALLY printed:
 * the sessions were recorded by scripts/mdRecord.mjs in a fresh Expo SDK 58
 * project and are imported from md-transcripts.js, never typed by hand.
 * Installing software and running the app on your own phone happen on your
 * computer, guided by each lesson and the practical.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

import { appJson, expoLab } from "./md-helpers.js";
import { TRANSCRIPTS as T } from "./md-transcripts.js";

export const SECTION_ID = "md-s2-setup";
const MODULE = "md-m2-setup";

const HOME = "ada@laptop:~/projects$";
const APP = "ada@laptop:~/projects/my-first-app$";
const CREATE = "npx --yes create-expo-app@latest my-first-app --yes";

/* ── The project-structure lab: three changes, in three files ────────── */
const THEME = (primary) => `// Design tokens: every screen takes its colours from here.
export const Colors = {
  light: { text: "#11181C", background: "#FFFFFF", primary: "${primary}" },
  dark: { text: "#ECEDEE", background: "#151718", primary: "${primary}" },
};
`;

const HOME_SCREEN = (title) => `import { Pressable, StyleSheet, Text, View } from "react-native";
import { Colors } from "@/constants/theme";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>${title}</Text>
      <Pressable accessibilityRole="button" style={[styles.button, { backgroundColor: Colors.light.primary }]}>
        <Text style={styles.buttonText}>Get started</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", gap: 24, padding: 24 },
  title: { fontSize: 32, fontWeight: "700", textAlign: "center" },
  button: { minHeight: 48, paddingHorizontal: 24, borderRadius: 12, justifyContent: "center" },
  buttonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "700" },
});
`;

/* ── The configuration lab ───────────────────────────────────────────── */
const CONFIG_SCREEN = `import Constants from "expo-constants";
import { StyleSheet, Text, View } from "react-native";
import { API_URL } from "@/config";

export default function Screen() {
  const app = Constants.expoConfig;
  return (
    <View style={styles.page}>
      <Text style={styles.title}>{app?.name}</Text>
      <Text>Version {app?.version}</Text>
      <Text>Server: {API_URL ?? "not set"}</Text>
      <Text>Support: {app?.extra?.supportEmail ?? "not set"}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, padding: 24, gap: 8 },
  title: { fontSize: 24, fontWeight: "700" },
});
`;

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 30 · 2.1 – 2.2
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "md-l30-vscode-files",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 1,
    covers: ["2.1", "2.2"],
    title: "Your Editor and Your Files",
    subtitle: "Installing VS Code, and how a project is organised on disk",
    estimatedMinutes: 40,
    intro: "A developer's workshop is an editor and a folder of files. This lesson sets up the editor professionals use, and shows you how an Expo project's files are laid out.",

    atoms: [
      {
        id: "a-md-vscode",
        title: "Installing and configuring Visual Studio Code",
        explain:
          "Visual Studio Code (VS Code) is the free code editor most React Native developers use, on Windows, macOS and Linux. Download it from code.visualstudio.com and install it with the defaults (on Windows, tick \"Add to PATH\" so you can type code . in a terminal to open a folder). Then add three extensions from the Extensions panel: Expo Tools (Expo's own, for app.json help and debugging), ESLint (flags likely bugs as you type) and Prettier (formats your code consistently). In Settings, turn on Format On Save and Auto Save. Learn four shortcuts from day one: the Command Palette (Ctrl+Shift+P, Cmd+Shift+P on a Mac), Quick Open a file (Ctrl+P), the integrated terminal (Ctrl+`), and multi-cursor editing (Alt+click).",
        decision: {
          scenario: "Two classmates' code looks completely different: one uses tabs and single quotes, the other spaces and double quotes. Every time they share a file, half the lines change.",
          question: "What fixes this for good?",
          options: [
            { id: "a", text: "Both install Prettier and turn on Format On Save, so every file is formatted the same way automatically", why: "A formatter removes style arguments and noisy diffs: everyone's code comes out identical in style." },
            { id: "b", text: "Agree to be careful", whyWrong: "People forget; tools do not." },
            { id: "c", text: "Use different editors", whyWrong: "That makes it worse." },
            { id: "d", text: "Never share files", whyWrong: "Software is a team sport." },
          ],
          correct: "a",
          aftermath: "Let the formatter decide the style. You decide what the code does.",
        },
      },
      {
        id: "a-md-project-files",
        title: "Understanding files, folders and project directories",
        explain:
          "A PROJECT is a folder, and everything in it belongs to the app. In a project created by npx create-expo-app (SDK 58): src/app/ holds the SCREENS, one file per screen (index.tsx is the first screen; _layout.tsx arranges them); src/components/ holds reusable pieces; src/constants/ holds shared values such as colours; src/hooks/ holds reusable logic; assets/ holds images and fonts; app.json holds the app's CONFIGURATION (its name, icon, version and settings); package.json lists its DEPENDENCIES and scripts; node_modules/ holds the installed packages (never edit it, never commit it); and .gitignore lists what Git should ignore. Knowing where each kind of change goes is half of working on a real project. Keep your projects in one folder such as projects/ in your home folder, and avoid spaces in folder names.",
        webLab: expoLab({
          name: "my-first-app",
          task:
            "Three changes, each in its own file. In app.json, change the app's name from \"my-first-app\" to \"Ada's First App\". In src/app/index.tsx, change the title to \"Welcome, Ada\". In src/constants/theme.ts, change the primary colour in both themes from \"#208AEF\" to \"#0F766E\". The phone shows the name in the header and the colour on the button.",
          files: {
            "src/app/index.tsx": HOME_SCREEN("Welcome to Expo"),
            "src/constants/theme.ts": THEME("#208AEF"),
          },
          editable: ["app.json"],
          layout: `import Constants from "expo-constants";\nimport { Stack } from "expo-router";\n\nexport default function RootLayout() {\n  return (\n    <Stack>\n      <Stack.Screen name="index" options={{ title: Constants.expoConfig?.name }} />\n    </Stack>\n  );\n}\n`,
          solution: {
            "src/app/index.tsx": HOME_SCREEN("Welcome, Ada"),
            "src/constants/theme.ts": THEME("#0F766E"),
            "app.json": appJson("Ada's First App", { slug: "my-first-app", scheme: "myfirstapp" }),
          },
          tests: [
            { label: "app.json names the app \"Ada's First App\"", check: "return config().name === \"Ada's First App\" && screenTitle() === \"Ada's First App\";", fail: "In app.json, change \"name\" (not \"slug\")." },
            { label: "The home screen says \"Welcome, Ada\"", check: "return has('Welcome, Ada');", fail: "The title is in src/app/index.tsx." },
            { label: "The button uses the new primary colour", check: "return css({ role: 'button', name: 'Get started' }, 'background-color') === 'rgb(15, 118, 110)';", fail: "Colours live in src/constants/theme.ts: change primary in both light and dark." },
            { label: "Both themes use it", check: "const { Colors } = load('src/constants/theme.ts'); return Colors.light.primary.toUpperCase() === '#0F766E' && Colors.dark.primary.toUpperCase() === '#0F766E';", fail: "Change the dark theme too." },
          ],
          hint: "Configuration in app.json, a screen in src/app/, shared values in src/constants/.",
          successMessage: "Three kinds of change, three right places. You will make thousands of these.",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 31 · 2.3 – 2.5
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "md-l31-terminal-node",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 2,
    covers: ["2.3", "2.4", "2.5"],
    title: "The Terminal, Node.js and npm",
    subtitle: "Typing commands, the JavaScript runtime that builds your app, and the packages it is made of",
    estimatedMinutes: 45,
    intro: "Developers drive most tools by typing commands. This lesson covers the terminal, Node.js (which runs Expo's tools on your computer) and npm (which installs the packages your app is made of).",

    atoms: [
      {
        id: "a-md-terminal",
        title: "Using the terminal and command-line interface",
        explain:
          "The TERMINAL is a window where you type commands instead of clicking. On Windows, install Git for Windows (next lessons) and use Git Bash, or use PowerShell; on macOS use Terminal; on Linux, your distribution's terminal; VS Code has one built in (Ctrl+`). The PROMPT shows where you are. Essentials: pwd prints the current folder, ls lists what is in it (ls -a includes hidden files, whose names start with a dot), cd folder moves into a folder (cd .. goes up one), mkdir name makes a folder. && runs a second command if the first succeeded. The Up arrow repeats earlier commands and Tab completes names. Ctrl+C stops a running command, such as a development server.",
        terminalExercise: {
          prompt: HOME,
          intro: "Recorded in a real Git Bash session. Folder paths are shortened to ~/projects.",
          goal: "Check which folder you are in, then create a folder called notes and list the folder's contents in one line.",
          commands: { pwd: T.tools.pwd, "mkdir notes && ls": T.tools["mkdir notes && ls"], "ls -a notes": T.tools["ls -a notes"] },
          available: ["pwd", "mkdir notes && ls", "ls -a notes"],
          accept: ["mkdir notes && ls"],
          near: [
            { command: "pwd", why: "That shows where you are. Now make the folder and list the contents: mkdir notes && ls." },
            { command: "ls -a notes", why: "That lists inside notes (just . and .., the folder itself and its parent). The goal is to create it and list the projects folder." },
          ],
          hint: "mkdir makes a folder; && then runs ls if mkdir worked.",
          success: "The folder exists. ls -a notes shows it is empty apart from . (itself) and .. (its parent).",
        },
      },
      {
        id: "a-md-node-npm",
        title: "Installing Node.js and npm",
        explain:
          "NODE.JS runs JavaScript on your computer (outside a browser). Your app does not run on Node, but all of Expo's tools do: the dev server, the bundler, the CLI. Install the LTS (long-term support) version from nodejs.org: Expo SDK 58's tools need Node 22.13 or newer, 24.3 or newer, or 26 or newer, and odd-numbered releases (23, 25) are not supported, so the current LTS, Node 24, is the safe choice. Installing Node also installs NPM, the package manager, and NPX, which runs a package's command without installing it permanently. Check both with --version after installing; if the terminal says \"command not found\", close and reopen it so it picks up the new PATH.",
        terminalExercise: {
          prompt: HOME,
          intro: "Recorded on the machine that recorded every terminal in this course.",
          goal: "Check that Node.js is installed and is a version Expo SDK 58 supports.",
          commands: { "node --version": T.tools["node --version"], "npm --version": T.tools["npm --version"], "git --version": T.tools["git --version"] },
          available: ["node --version", "npm --version", "git --version"],
          accept: ["node --version"],
          near: [
            { command: "npm --version", why: "That is npm, which comes with Node. Check Node itself: node --version." },
            { command: "git --version", why: "Git is checked in Lesson 32. Check Node: node --version." },
          ],
          hint: "The command is node, with the flag --version.",
          success: `${T.tools["node --version"]} is Node 24: an even-numbered release, newer than 24.3, so Expo SDK 58's tools support it.`,
        },
      },
      {
        id: "a-md-packages",
        title: "Understanding packages and dependencies",
        explain:
          "A PACKAGE is code someone else wrote and published to the npm registry: React Native itself, Expo's modules, date libraries. Your app's DEPENDENCIES are listed in package.json with version ranges (\"~58.0.7\" means any 58.0.x patch, \"^5.0.0\" any 5.x), and installed into node_modules/; package-lock.json records the exact versions installed, so everyone on the team gets the same ones (commit it). devDependencies are tools only needed while developing (TypeScript, Jest). In an Expo project, install packages with npx expo install name, not npm install: it chooses the version that matches your SDK, so native modules work. npm install with no name installs everything in package.json (after cloning a project). Expect npm to print warnings and \"vulnerabilities\" counts from tools' own dependencies; Module 19 explains how to judge them.",
        terminalExercise: {
          prompt: APP,
          intro: "Recorded in a fresh Expo SDK 58 project, my-first-app.",
          goal: "Add expo-haptics (vibration feedback) to the project, at the version that matches its SDK.",
          commands: { "npx expo install expo-haptics": T.packages["npx expo install expo-haptics"], "npm ls expo-haptics": T.packages["npm ls expo-haptics"] },
          available: ["npx expo install expo-haptics", "npm ls expo-haptics"],
          accept: ["npx expo install expo-haptics"],
          near: [{ command: "npm ls expo-haptics", why: "That shows the installed version, but it is not installed yet. Use npx expo install expo-haptics first." }],
          hint: "In Expo projects, npx expo install picks the SDK-compatible version.",
          success: "\"SDK 58.0.0 compatible\": Expo chose the version for your SDK. Run npm ls expo-haptics to see which one landed in node_modules.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 32 · 2.6
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "md-l32-git",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 3,
    covers: ["2.6"],
    title: "Git and GitHub",
    subtitle: "Saving every version of your app, and sharing it",
    estimatedMinutes: 45,
    intro: "Git records the history of your project, so you can see what changed, undo mistakes and work with others. GitHub keeps that history online, where your team, your future employers and your build servers can reach it.",

    atoms: [
      {
        id: "a-md-git-commit",
        title: "Introduction to Git: status, add and commit",
        explain:
          "Install Git from git-scm.com (on Windows, Git for Windows, which also gives you Git Bash), then tell it who you are once: git config --global user.name \"Ada Obi\" and git config --global user.email \"ada@example.com\". create-expo-app starts a Git repository for you with an \"Initial commit\". The everyday cycle: git status shows what has changed; git add file STAGES a change (chooses it for the next commit); git commit -m \"message\" saves the staged changes as a COMMIT, a snapshot with a message saying what and why; git log --oneline lists the history. Commit small, working steps with clear messages (\"Change the welcome message\", not \"stuff\"). On Windows, Git may warn that LF line endings will be replaced by CRLF: that is a harmless note about how line breaks are stored.",
        terminalExercise: {
          prompt: APP,
          intro: "Recorded after changing the title in src/app/index.tsx and installing expo-haptics. The commit IDs in your project will be different: they are made from the contents.",
          goal: "Save the change to the home screen as a commit with the message \"Change the welcome message\". Stage it first.",
          commands: {
            "git status --short": T.git["git status --short"],
            "git add src/app/index.tsx": T.git["git add src/app/index.tsx"],
            'git commit -m "Change the welcome message"': T.git['git commit -m "Change the welcome message"'],
            "git log --oneline": T.git["git log --oneline"],
          },
          available: ["git status --short", "git add src/app/index.tsx", 'git commit -m "Change the welcome message"', "git log --oneline"],
          accept: ['git commit -m "Change the welcome message"'],
          near: [
            { command: "git status --short", why: "M means modified: three files changed. Stage the screen with git add, then commit." },
            { command: "git log --oneline", why: "That shows the history. Commit first, then look." },
          ],
          hint: "git add src/app/index.tsx, then git commit -m \"Change the welcome message\".",
          success: "One file changed, saved as a commit. git log --oneline now shows your commit above the Initial commit.",
        },
      },
      {
        id: "a-md-github",
        title: "GitHub: branches and remotes",
        explain:
          "GITHUB hosts Git repositories online. Create a free account, then a NEW REPOSITORY (empty, no README, since your project already has history). Connect your project to it as a REMOTE called origin: git remote add origin https://github.com/you/my-first-app.git. Older Git installs name the first branch master; GitHub's default is main, so rename it once with git branch -M main. Then git push -u origin main uploads your commits (the first push opens a browser to sign in to GitHub). After that, commit as you work and git push to upload; on another computer, git clone downloads the project, and npm install restores node_modules. Push often: a project only on your laptop is one stolen bag away from gone.",
        terminalExercise: {
          prompt: APP,
          intro: "Recorded in the same project. The repository on GitHub was created empty, in the browser, first.",
          goal: "Rename the branch to main, as GitHub expects. Then connect the project to its GitHub repository as origin.",
          commands: {
            "git branch": T.git["git branch"],
            "git branch -M main": T.git["git branch -M main"] || "",
            "git remote add origin https://github.com/ada-obi/my-first-app.git": T.git["git remote add origin https://github.com/ada-obi/my-first-app.git"],
          },
          available: ["git branch", "git branch -M main", "git remote add origin https://github.com/ada-obi/my-first-app.git"],
          accept: ["git remote add origin https://github.com/ada-obi/my-first-app.git"],
          near: [
            { command: "git branch", why: "* master: the branch still has its old name. Rename it with git branch -M main." },
          ],
          hint: "First git branch -M main, then git remote add origin and the repository's address.",
          success: "origin now points at GitHub for fetching and pushing. Next on your own computer: git push -u origin main.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 33 · 2.7 – 2.9
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "md-l33-expo-project",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 4,
    covers: ["2.7", "2.8", "2.9"],
    title: "Your First Expo Project, on Your Phone",
    subtitle: "Creating a project, running it on Android and iPhone, and emulators",
    estimatedMinutes: 50,
    intro: "This is the moment it becomes real: a project created from the terminal, running on the phone in your hand.",

    atoms: [
      {
        id: "a-md-create-expo",
        title: "Installing Expo tooling and creating a project",
        explain:
          "Expo needs no global install: npx create-expo-app@latest downloads the current project creator and makes a new project from Expo's default template (TypeScript, Expo Router, and the current SDK's packages), then runs npm install. Here the command also has two --yes flags: npx's (download the tool without asking) and create-expo-app's (use the default options). It takes a few minutes the first time. Then cd into the folder and look around: src/app/ for screens, app.json for configuration, package.json for dependencies. npx expo --version shows the CLI's version. Also create a free account at expo.dev now: you will need it to sign in to Expo Go and, later, to build with EAS.",
        terminalExercise: {
          prompt: HOME,
          intro: "Recorded as it ran: the default template for Expo SDK 58, then npm install, which takes a few minutes.",
          goal: "Create a new Expo project called my-first-app with the default template.",
          commands: { [CREATE]: T.create[CREATE], "npx expo --version": T.create["npx expo --version"] },
          available: [CREATE, "npx expo --version"],
          accept: [CREATE],
          near: [{ command: "npx expo --version", why: "That command runs inside a project. Create the project first." }],
          hint: "npx --yes create-expo-app@latest followed by the project's name, then --yes for the default options.",
          success: "\"Your project is ready!\" The template for SDK 58, with its dependencies installed. Next: cd my-first-app and start it.",
        },
      },
      {
        id: "a-md-run-on-phone",
        title: "Running the app on an Android phone and an iPhone",
        explain:
          "In the project folder, npx expo start starts the DEVELOPMENT SERVER (Metro, the bundler) and, in an interactive terminal, shows a QR code. On your phone, install EXPO GO from Google Play or the App Store and sign in with your Expo account (Expo Go now requires it). ANDROID: open Expo Go and scan the QR code. IPHONE: scan it with the Camera app, which opens Expo Go. Your computer and phone must be on the same Wi-Fi; if that network blocks it (public or office Wi-Fi), run npx expo start --tunnel. Save a file and the app updates on the phone within a second (Fast Refresh); shake the phone (or press m in the terminal) for the developer menu. Expo Go in the stores supports one SDK version at a time: if it says the project is incompatible, match your project's SDK to Expo Go's, or make a development build (Module 20). Expo Go is a sandbox for learning; real apps use development builds.",
        terminalExercise: {
          prompt: APP,
          intro: "Recorded in a terminal without a screen, so it shows no QR code; in your own terminal you will also see the QR code and the keys (a, i, w, r, m). It keeps running until you press Ctrl+C.",
          goal: "Start the development server for this project.",
          commands: { "npx expo start": T.start["npx expo start"], ls: T.create.ls, "ls src/app": T.create["ls src/app"] },
          available: ["ls", "ls src/app", "npx expo start"],
          accept: ["npx expo start"],
          near: [
            { command: "ls", why: "You are in the project: app.json and package.json are here. Now start it with npx expo start." },
            { command: "ls src/app", why: "Those are the screens Expo Router found. Start the server: npx expo start." },
          ],
          hint: "npx expo start, from inside the project folder.",
          success: "\"Using src/app as the root directory for Expo Router\" and \"Starting Metro Bundler\": scan the QR code with Expo Go on Android or the Camera on iPhone.",
        },
      },
      {
        id: "a-md-emulators",
        title: "Using Android emulators and the iOS Simulator",
        explain:
          "An EMULATOR is a virtual phone on your computer. ANDROID: install Android Studio (Windows, macOS or Linux), open Device Manager, create a virtual device (a recent Pixel with a recent Android version), start it, then press a in the Expo terminal. It needs a reasonably powerful computer (16 GB of memory helps). iOS: the iOS Simulator comes with Xcode and runs ONLY on a Mac; press i. Without a Mac, use a real iPhone with Expo Go, and later build for iOS in the cloud with EAS (Module 20). Emulators are great for trying many screen sizes and OS versions quickly; real phones are the only way to judge speed, touch, the camera, notifications and real networks. Use both.",
        decision: {
          scenario: "You have a Windows laptop with 8 GB of memory, an Android phone, and a borrowed iPhone for an hour a week.",
          question: "What is the best way to develop and test?",
          options: [
            { id: "a", text: "Develop on your Android phone with Expo Go, test on the iPhone with Expo Go when you have it, and use an emulator only if the laptop handles it", why: "Real devices with Expo Go work on any computer. The iOS Simulator needs a Mac, and the Android emulator needs a lot of memory, so phones are your main test devices." },
            { id: "b", text: "Install the iOS Simulator on Windows", whyWrong: "The iOS Simulator only runs on macOS, with Xcode." },
            { id: "c", text: "Buy a Mac before you can start", whyWrong: "You can develop and even build iOS apps (with EAS) without one." },
            { id: "d", text: "Only use the Android emulator", whyWrong: "On 8 GB it may be very slow, and it never replaces testing on real phones." },
          ],
          correct: "a",
          aftermath: "Real phones first; emulators and simulators when your computer allows.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 34 · 2.10
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "md-l34-config-env",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 5,
    covers: ["2.10"],
    title: "Configuration Files and Environment Variables",
    subtitle: "app.json, .env, and what must never be in your app",
    estimatedMinutes: 40,
    intro: "An app's code is the same everywhere, but its settings differ: its name, the server it talks to, its version. This lesson covers where those settings live.",

    atoms: [
      {
        id: "a-md-app-json",
        title: "Configuration files: app.json",
        explain:
          "app.json is the app's configuration (it can also be app.config.ts when you need code). Under \"expo\": name (shown under the icon), slug (the project's URL-friendly id on expo.dev), version (shown to users), orientation, icon, scheme (for deep links, Module 9), userInterfaceStyle (light, dark or automatic), ios and android sections (identifiers, permissions, icons), plugins (which configure native features at build time), and extra (any values your code can read). npx expo config --type public prints the configuration Expo actually resolves, including values plugins added, which is useful when something does not appear as expected. In code, expo-constants gives you Constants.expoConfig.",
        terminalExercise: {
          prompt: APP,
          intro: "Recorded in the same SDK 58 project.",
          goal: "Print the configuration Expo resolves for this project, as the app will see it.",
          commands: { "npx expo config --type public": T.config["npx expo config --type public"], "cat app.json": T.create["cat app.json"] },
          available: ["cat app.json", "npx expo config --type public"],
          accept: ["npx expo config --type public"],
          near: [{ command: "cat app.json", why: "That is the file as written. npx expo config --type public shows what Expo resolves from it, with defaults and plugin changes." }],
          hint: "npx expo config, with --type public.",
          success: "Compare it with app.json: Expo added sdkVersion, platforms and router settings in extra. That resolved object is what Constants.expoConfig gives your code.",
        },
      },
      {
        id: "a-md-env-vars",
        title: "Environment variables",
        explain:
          "ENVIRONMENT VARIABLES hold settings that change between environments (your laptop, testing, production), such as a server address, kept out of the code in a .env file: EXPO_PUBLIC_API_URL=https://api.example.com. Expo reads .env files when it starts and INLINES variables whose names start with EXPO_PUBLIC_ into your app wherever the code says process.env.EXPO_PUBLIC_API_URL. Other variables are not available to app code at all. Inlined means compiled into the app, where anyone can extract them: so EXPO_PUBLIC_ variables are for public settings only, and secrets (payment secret keys, database passwords) must never be in a mobile app, in .env, or in code; they belong on your server (Module 19). The template's .gitignore ignores .env*.local files, for values that should stay on your computer. Restart npx expo start after changing .env.",
        webLab: expoLab({
          name: "Shop",
          app: { extra: { supportEmail: "help@example.com" } },
          task:
            "The app shows \"Server: not set\". The server address is in .env, but under a name app code cannot see, and src/config.ts reads that name. Rename the variable to EXPO_PUBLIC_API_URL in .env and read process.env.EXPO_PUBLIC_API_URL in src/config.ts. .env also holds a payment SECRET key that must not reach the app: delete that line from .env (it belongs on the server), and make sure config.ts does not read it.",
          files: {
            ".env": "API_URL=https://api.example.com\nEXPO_PUBLIC_PAYSTACK_SECRET_KEY=sk_live_4f9a2c7d1e8b6a3f\n",
            "src/config.ts": "export const API_URL = process.env.API_URL;\nexport const PAYMENT_KEY = process.env.EXPO_PUBLIC_PAYSTACK_SECRET_KEY;\n",
            "src/app/index.tsx": CONFIG_SCREEN,
          },
          readOnly: ["src/app/index.tsx"],
          solution: {
            ".env": "EXPO_PUBLIC_API_URL=https://api.example.com\n",
            "src/config.ts": "export const API_URL = process.env.EXPO_PUBLIC_API_URL;\n",
          },
          tests: [
            { label: "The app shows the server address from .env", check: "return has('Server: https://api.example.com');", fail: "Only EXPO_PUBLIC_ variables are inlined: rename it in .env and in config.ts." },
            { label: "The secret key is gone from .env and from the code", check: "return !/sk_live/.test(raw('.env')) && !/SECRET/.test(code('src/config.ts'));", fail: "Delete the secret key line from .env, and the PAYMENT_KEY line from config.ts." },
            { label: "config.ts reads EXPO_PUBLIC_API_URL", check: "return /process\\.env\\.EXPO_PUBLIC_API_URL/.test(code('src/config.ts'));", fail: "export const API_URL = process.env.EXPO_PUBLIC_API_URL;" },
            { label: "app.json's extra still reaches the app", check: "return has('Support: help@example.com') && has('Version 1.0.0');", fail: "Do not change app.json." },
          ],
          hint: "If a value would cause harm in someone else's hands, it cannot be in the app: anything inlined can be read.",
          successMessage: "Public settings in EXPO_PUBLIC_ variables, secrets nowhere near the app.",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 35 · 2.P
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "md-l35-m2-project",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 6,
    covers: ["2.P"],
    title: "Practical: Your Starter App, on Your Phone and on GitHub",
    subtitle: "Create it, run it on a real phone, change it, save it",
    estimatedMinutes: 90,
    intro: "This practical is done on your own computer and phone. The lab gives you a warm-up on the practice phone first, with the same kind of changes you will make to your own app.",

    atoms: [
      {
        id: "a-md-m2-project",
        title: "Make the starter app your own",
        explain:
          "Make your app say who you are. On the practice phone: change the screen to introduce you, with your name as the title, a one-line bio, and the brand colour of your choice. Then do it for real, following the task below: create the project, run it on your phone, make the same kind of change, see it update on the phone, and push it to GitHub.",
        webLab: expoLab({
          name: "my-first-app",
          task:
            "Edit src/app/index.tsx so the title is your name (any name of at least two words, instead of \"Welcome to Expo\"), and add a second Text under it with a one-line bio of at least 20 characters. In src/constants/theme.ts, choose a new primary colour (not #208AEF) that gives white text a contrast of at least 4.5 on the button. In app.json, rename the app to \"<Your first name>'s App\" (it must end in \"'s App\").",
          files: {
            "src/app/index.tsx": HOME_SCREEN("Welcome to Expo"),
            "src/constants/theme.ts": THEME("#208AEF"),
          },
          editable: ["app.json"],
          layout: `import Constants from "expo-constants";\nimport { Stack } from "expo-router";\n\nexport default function RootLayout() {\n  return (\n    <Stack>\n      <Stack.Screen name="index" options={{ title: Constants.expoConfig?.name }} />\n    </Stack>\n  );\n}\n`,
          revealSolution: false,
          solution: {
            "src/app/index.tsx": HOME_SCREEN("Ada Obi").replace('<Text style={styles.title}>Ada Obi</Text>', '<Text style={styles.title}>Ada Obi</Text>\n      <Text>I build apps for small businesses in Lagos.</Text>'),
            "src/constants/theme.ts": THEME("#0F766E"),
            "app.json": appJson("Ada's App", { slug: "my-first-app", scheme: "myfirstapp" }),
          },
          tests: [
            { label: "The title is a name, not the template's", check: "return !has('Welcome to Expo') && find({ text: /^[A-Z][\\w'-]+( [A-Z][\\w'-]+)+$/ }) !== null;", fail: "Replace \"Welcome to Expo\" with your name (first and last)." },
            { label: "A bio of at least 20 characters sits under the title", check: "return texts().some((t) => t.length >= 20 && t !== 'Get started' && !/Expo/.test(t));", fail: "Add <Text>…your one-line bio…</Text> after the title." },
            { label: "A new primary colour with enough contrast", check: "const { Colors } = load('src/constants/theme.ts'); return Colors.light.primary.toUpperCase() !== '#208AEF' && contrastOf('Get started') >= 4.5;", fail: "Pick a darker colour: white text needs 4.5:1." },
            { label: "The app's name ends in \"'s App\"", check: "return /\\S's App$/.test(config().name || '') && screenTitle() === config().name;", fail: "In app.json, set \"name\" to something like \"Ada's App\"." },
          ],
          hint: "The template's home screen is in src/app/; colours in src/constants/; the name in app.json.",
          successMessage: "Your app, with your name on it. Now make it real, on your own phone.",
        }),
      },
    ],
    task: {
      title: "Module 2 practical: create, run, change, save",
      intro: "Follow these steps on your own computer and phone. Keep a note of anything that went wrong and how you fixed it; that note is valuable.",
      prompts: [
        "Install VS Code (with Expo Tools, ESLint and Prettier), Node.js LTS and Git, and check node --version, npm --version and git --version.",
        "Create a free account at expo.dev, install Expo Go on your phone and sign in.",
        "Run npx create-expo-app@latest my-first-app, then cd my-first-app and npx expo start, and open the app on your phone by scanning the QR code (Expo Go on Android, the Camera on iPhone; try --tunnel if your Wi-Fi blocks it).",
        "Change the home screen as you did in the lab and watch it update on your phone as you save. If you have both platforms available, open it on an Android phone and an iPhone.",
        "Create an empty repository on GitHub, then git add, git commit, git branch -M main, git remote add origin … and git push -u origin main. Check your code is on github.com.",
        "Mastery checkpoint: from a new terminal, show someone how you create a project, open it on your phone, make a visible change and push it to GitHub, explaining each command as you type it.",
      ],
      closing: "Next: Module 3, JavaScript from the very beginning.",
    },
    requirements: { read: true, video: false, assessment: true },
  },
];
