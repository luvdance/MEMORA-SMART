/**
 * ASSESSMENTS · MOBILE APP DEVELOPMENT · MODULE 2 · COMPUTER AND DEVELOPMENT ENVIRONMENT SETUP
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Never import this from anything under src/.
 * ═════════════════════════════════════════════════════════════════════════
 */

import { q, check } from "./md-helpers.js";

export const ASSESSMENTS = {
  ...check("md-l30-vscode-files", [
    q({ id: "mdq30-1", atom: "a-md-vscode", d: 1, prompt: "Which VS Code extension formats your code automatically on save?", options: ["Prettier", "Expo Go", "Git", "Node.js"], correct: "a",
      explanation: "With Format On Save turned on.",
      wrong: { b: "A phone app.", c: "Version control, not formatting.", d: "A runtime, not an extension." } }),
    q({ id: "mdq30-2", atom: "a-md-vscode", d: 2, prompt: "Which shortcut opens VS Code's Command Palette on Windows?", options: ["Ctrl+Shift+P", "Ctrl+C", "Alt+F4", "Ctrl+Z"], correct: "a",
      explanation: "Cmd+Shift+P on a Mac.",
      wrong: { b: "Copy.", c: "Closes the window.", d: "Undo." } }),
    q({ id: "mdq30-3", atom: "a-md-project-files", d: 2, prompt: "In an SDK 58 Expo project, where do the screens live?", options: ["src/app/", "node_modules/", "assets/", "package.json"], correct: "a",
      explanation: "Each file in src/app/ is a screen (Expo Router).",
      wrong: { b: "Installed packages.", c: "Images and fonts.", d: "Dependencies and scripts." } }),
    q({ id: "mdq30-4", atom: "a-md-project-files", d: 2, prompt: "Where do you change the app's name shown under its icon?", options: ["app.json", "src/app/index.tsx", "package.json", "node_modules"], correct: "a",
      explanation: "The \"name\" field of the app's configuration.",
      wrong: { b: "A screen.", c: "package.json's name is the npm package name.", d: "Never edit it." } }),
    q({ id: "mdq30-5", atom: "a-md-project-files", d: 2, prompt: "Why is node_modules never committed to Git?", options: ["It can be rebuilt from package.json and package-lock.json with npm install", "It is secret", "Git cannot store folders", "It is empty"], correct: "a",
      explanation: "It is huge and fully reproducible.",
      wrong: { b: "It is public code.", c: "Git stores folders.", d: "It is very large." } }),
  ]),

  ...check("md-l31-terminal-node", [
    q({ id: "mdq31-1", atom: "a-md-terminal", d: 1, prompt: "Which command shows the folder you are in?", options: ["pwd", "ls", "cd", "mkdir"], correct: "a",
      explanation: "Print working directory.",
      wrong: { b: "Lists contents.", c: "Changes folder.", d: "Makes a folder." } }),
    q({ id: "mdq31-2", atom: "a-md-terminal", d: 2, prompt: "How do you stop a running development server?", options: ["Ctrl+C", "Ctrl+S", "Type stop", "Close the editor"], correct: "a",
      explanation: "Ctrl+C interrupts the running command.",
      wrong: { b: "Saves a file.", c: "Not a command.", d: "The server keeps running in the terminal." } }),
    q({ id: "mdq31-3", atom: "a-md-node-npm", d: 2, prompt: "Which Node.js version is a safe choice for Expo SDK 58's tools?", options: ["The current LTS, Node 24", "Node 23", "Node 16", "Node 25"], correct: "a",
      explanation: "SDK 58 supports 22.13+, 24.3+ and 26+, even-numbered releases.",
      wrong: { b: "Odd releases are not supported.", c: "Too old.", d: "Odd releases are not supported." } }),
    q({ id: "mdq31-4", atom: "a-md-packages", d: 2, prompt: "Why use npx expo install instead of npm install to add a package?", options: ["It picks the version that matches your Expo SDK", "It is faster", "It does not need the internet", "npm install does not work"], correct: "a",
      explanation: "Native modules must match the SDK.",
      wrong: { b: "Speed is not the point.", c: "It downloads packages.", d: "It works, but may pick an incompatible version." } }),
    q({ id: "mdq31-5", atom: "a-md-packages", d: 2, prompt: "What does package-lock.json record?", options: ["The exact versions installed, so everyone gets the same", "Your password", "The app's screens", "Git history"], correct: "a",
      explanation: "Commit it for reproducible installs.",
      wrong: { b: "Never.", c: "No.", d: "No." } }),
  ]),

  ...check("md-l32-git", [
    q({ id: "mdq32-1", atom: "a-md-git-commit", d: 2, prompt: "What does git add do?", options: ["Stages a change for the next commit", "Uploads to GitHub", "Creates a new file", "Deletes a file"], correct: "a",
      explanation: "Choose what goes into the snapshot.",
      wrong: { b: "That is git push.", c: "No.", d: "No." } }),
    q({ id: "mdq32-2", atom: "a-md-git-commit", d: 2, prompt: "Which commit message is best?", options: ["\"Add onboarding screens\"", "\"stuff\"", "\"fix\"", "\"asdf\""], correct: "a",
      explanation: "Say what changed.",
      wrong: { b: "Meaningless.", c: "Fix what?", d: "Meaningless." } }),
    q({ id: "mdq32-3", atom: "a-md-github", d: 2, prompt: "What does git remote add origin URL do?", options: ["Connects the project to a repository on GitHub, named origin", "Downloads a project", "Deletes the remote", "Creates a branch"], correct: "a",
      explanation: "Then git push uploads to it.",
      wrong: { b: "That is git clone.", c: "No.", d: "No." } }),
    q({ id: "mdq32-4", atom: "a-md-github", d: 3, prompt: "After cloning a project, what restores its node_modules?", options: ["npm install", "git push", "npx expo start", "Nothing: it comes with the clone"], correct: "a",
      explanation: "node_modules is not in Git.",
      wrong: { b: "Uploads.", c: "Fails without packages.", d: "It is ignored by Git." } }),
  ]),

  ...check("md-l33-expo-project", [
    q({ id: "mdq33-1", atom: "a-md-create-expo", d: 1, prompt: "Which command creates a new Expo project?", options: ["npx create-expo-app@latest my-app", "npm start", "git init", "npx expo start"], correct: "a",
      explanation: "From Expo's current default template.",
      wrong: { b: "Runs a script in an existing project.", c: "Starts a Git repository only.", d: "Runs an existing project." } }),
    q({ id: "mdq33-2", atom: "a-md-run-on-phone", d: 2, prompt: "How do you open your app on an iPhone during development?", options: ["Scan the QR code with the Camera app, which opens Expo Go", "Install it from the App Store", "Plug it into a Windows PC", "Email the code"], correct: "a",
      explanation: "On Android, scan with Expo Go itself.",
      wrong: { b: "It is not published.", c: "Not how Expo Go works.", d: "No." } }),
    q({ id: "mdq33-3", atom: "a-md-run-on-phone", d: 3, prompt: "Your phone cannot connect over the office Wi-Fi. What can you try?", options: ["npx expo start --tunnel", "Restart the phone repeatedly", "Use a different template", "Uninstall Node"], correct: "a",
      explanation: "A tunnel works when the network blocks local connections.",
      wrong: { b: "Unlikely to help.", c: "Unrelated.", d: "Unrelated." } }),
    q({ id: "mdq33-4", atom: "a-md-run-on-phone", d: 3, prompt: "Expo Go says your project is incompatible with its version. Why?", options: ["Expo Go supports one SDK version at a time; your project's SDK differs", "Your phone is too old", "You need a Mac", "Your code has a typo"], correct: "a",
      explanation: "Match the SDK, or use a development build.",
      wrong: { b: "Not the message's cause.", c: "Not required.", d: "That gives a different error." } }),
    q({ id: "mdq33-5", atom: "a-md-emulators", d: 2, prompt: "Where does the iOS Simulator run?", options: ["Only on a Mac, with Xcode", "On any computer", "On Android phones", "In Expo Go"], correct: "a",
      explanation: "Without a Mac, use a real iPhone with Expo Go.",
      wrong: { b: "macOS only.", c: "No.", d: "No." } }),
  ]),

  ...check("md-l34-config-env", [
    q({ id: "mdq34-1", atom: "a-md-app-json", d: 2, prompt: "What does npx expo config --type public show?", options: ["The configuration Expo resolves, including plugin changes and defaults", "Your Git history", "Your installed packages", "Your phone's settings"], correct: "a",
      explanation: "What Constants.expoConfig gives your code.",
      wrong: { b: "No.", c: "No.", d: "No." } }),
    q({ id: "mdq34-2", atom: "a-md-app-json", d: 2, prompt: "How does app code read values from app.json?", options: ["Constants.expoConfig from expo-constants", "require(\"app.json\") only", "process.env.APP_JSON", "It cannot"], correct: "a",
      explanation: "expo-constants exposes the resolved config.",
      wrong: { b: "Possible, but misses plugin changes and environments.", c: "No such variable.", d: "It can." } }),
    q({ id: "mdq34-3", atom: "a-md-env-vars", d: 2, prompt: "Which variable can app code read from .env?", options: ["EXPO_PUBLIC_API_URL", "API_URL", "SECRET_KEY", "DATABASE_PASSWORD"], correct: "a",
      explanation: "Only EXPO_PUBLIC_ variables are inlined.",
      wrong: { b: "Not prefixed, so not available.", c: "Not prefixed, and should never be.", d: "Never in an app." } }),
    q({ id: "mdq34-4", atom: "a-md-env-vars", d: 3, prompt: "Why must a payment secret key never be an EXPO_PUBLIC_ variable?", options: ["It is compiled into the app, where anyone can extract it", "It is too long", "Expo rejects it", "It slows the app"], correct: "a",
      explanation: "Secrets stay on servers.",
      wrong: { b: "Length is irrelevant.", c: "It would accept it, which is the danger.", d: "No." } }),
  ]),

  ...check("md-l35-m2-project", [
    q({ id: "mdq35-1", atom: "a-md-m2-project", d: 2, prompt: "You save a file while your app is open in Expo Go. What happens?", options: ["Fast Refresh updates the app on the phone within a second", "Nothing until you reinstall", "The app is published", "The phone restarts"], correct: "a",
      explanation: "That is the development loop.",
      wrong: { b: "No reinstall needed.", c: "Publishing is separate.", d: "No." } }),
    q({ id: "mdq35-2", atom: "a-md-m2-project", d: 2, prompt: "In what order do you save your work to GitHub?", options: ["git add, git commit, git push", "git push, git add, git commit", "git commit, git add, git push", "git push only"], correct: "a",
      explanation: "Stage, snapshot, upload.",
      wrong: { b: "Nothing to push yet.", c: "Nothing staged to commit.", d: "Commits first." } }),
    q({ id: "mdq35-3", atom: "a-md-m2-project", d: 2, prompt: "What does Expo Go now require before it opens your project?", options: ["Signing in with an Expo account", "A paid developer account", "A Mac", "A credit card"], correct: "a",
      explanation: "A free Expo account.",
      wrong: { b: "Free account is enough.", c: "No.", d: "No." } }),
    q({ id: "mdq35-4", atom: "a-md-m2-project", d: 3, prompt: "Why test on both an Android phone and an iPhone when you can?", options: ["The same code can look and behave differently on each platform", "Stores require it", "Expo Go only works on one", "It is not necessary"], correct: "a",
      explanation: "Fonts, headers, keyboards and permissions differ.",
      wrong: { b: "Not a store rule.", c: "It works on both.", d: "Differences are common." } }),
  ]),
};
