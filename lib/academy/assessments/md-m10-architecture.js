/**
 * ASSESSMENTS · MOBILE APP DEVELOPMENT · MODULE 10 · CODEBASE STRUCTURE AND MAINTAINABILITY
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Never import this from anything under src/.
 * ═════════════════════════════════════════════════════════════════════════
 */

import { q, check } from "./md-helpers.js";

export const ASSESSMENTS = {
  ...check("md-l56-ui-logic", [
    q({ id: "mdq56-1", atom: "a-md-ui-logic", d: 2, prompt: "Which of these is business logic rather than UI?", options: ["Delivery is free from ₦20,000", "The total is bold", "The input has rounded corners", "The list scrolls"], correct: "a",
      explanation: "A rule you could explain without the screen.",
      wrong: { b: "Styling.", c: "Styling.", d: "Behaviour of the UI." } }),
    q({ id: "mdq56-2", atom: "a-md-ui-logic", d: 2, prompt: "What is the main gain from moving the cart rules into cartTotals(items, code)?", options: ["They can be tested and reused without rendering a screen", "The app downloads faster", "It is required by Expo", "It removes the need for state"], correct: "a",
      explanation: "Plain functions: data in, data out.",
      wrong: { b: "No real difference.", c: "No.", d: "The code still lives in state." } }),
    q({ id: "mdq56-3", atom: "a-md-shared-components", d: 2, prompt: "Why should EmptyState take onAction rather than call router itself?", options: ["So each screen decides what the button does, and the component stays reusable", "router does not work in components", "Props are faster", "To avoid TypeScript"], correct: "a",
      explanation: "Shared components know nothing about particular screens.",
      wrong: { b: "It works, but couples them.", c: "No.", d: "No." } }),
    q({ id: "mdq56-4", atom: "a-md-shared-components", d: 2, prompt: "When is the right time to make a shared component?", options: ["When two or three screens really need the same thing", "Before writing any screen", "Never", "Only for buttons"], correct: "a",
      explanation: "Share what is proven to repeat.",
      wrong: { b: "Guesses make awkward components.", c: "Duplication drifts.", d: "Any repeated UI." } }),
  ]),

  ...check("md-l57-hooks-api", [
    q({ id: "mdq57-1", atom: "a-md-custom-hooks", d: 1, prompt: "What makes a function a custom hook?", options: ["Its name starts with use and it calls other hooks", "It returns JSX", "It lives in src/hooks", "It is async"], correct: "a",
      explanation: "The naming rule lets tools check the rules of hooks.",
      wrong: { b: "That is a component.", c: "Convention, not definition.", d: "No." } }),
    q({ id: "mdq57-2", atom: "a-md-custom-hooks", d: 3, prompt: "Two screens call useOnline(). Do they share one state value?", options: ["No: each call has its own state; the hook shares the logic", "Yes, always", "Only on Android", "Only if exported as default"], correct: "a",
      explanation: "Sharing data is Context's job (Module 11).",
      wrong: { b: "No.", c: "No.", d: "No." } }),
    q({ id: "mdq57-3", atom: "a-md-api-layer", d: 3, prompt: "The server answers 404. What does fetch do?", options: ["Resolves, with response.ok false", "Rejects with Network request failed", "Throws a 404 error", "Retries"], correct: "a",
      explanation: "fetch rejects only when there is no response at all; check response.ok.",
      wrong: { b: "That is no network.", c: "Not by itself.", d: "No." } }),
    q({ id: "mdq57-4", atom: "a-md-api-layer", d: 2, prompt: "Why route every request through one request() function?", options: ["URLs, headers, errors and later tokens are handled in one place", "fetch is slow", "Servers require it", "It caches automatically"], correct: "a",
      explanation: "One change instead of twenty.",
      wrong: { b: "No.", c: "No.", d: "Not unless you add it." } }),
  ]),

  ...check("md-l58-config-env", [
    q({ id: "mdq58-1", atom: "a-md-constants", d: 1, prompt: "Where should the brand colour #0f766e be written?", options: ["Once, in src/constants/theme.ts", "In every screen", "In app.json", "In .env"], correct: "a",
      explanation: "Then a rebrand is one edit.",
      wrong: { b: "Typos and drift.", c: "Not for styles.", d: "Not a per-build setting." } }),
    q({ id: "mdq58-2", atom: "a-md-env-variables", d: 2, prompt: "Which variables from .env reach the app's code?", options: ["Only those starting with EXPO_PUBLIC_", "All of them", "None", "Only those in .env.local"], correct: "a",
      explanation: "Read as process.env.EXPO_PUBLIC_NAME.",
      wrong: { b: "Others are ignored by the app bundle.", c: "No.", d: "Any of the files." } }),
    q({ id: "mdq58-3", atom: "a-md-env-variables", d: 3, prompt: "Where should a payment provider's SECRET key go?", options: ["On your server only; the app calls the server", "In EXPO_PUBLIC_SECRET_KEY", "In config.ts", "In app.json"], correct: "a",
      explanation: "Anything in the app bundle can be read by anyone who downloads it.",
      wrong: { b: "It would be bundled.", c: "Bundled too.", d: "Public too." } }),
    q({ id: "mdq58-4", atom: "a-md-env-variables", d: 2, prompt: "You changed .env and the app still shows the old value. What do you do?", options: ["Restart npx expo start", "Reinstall Node", "Delete node_modules", "Change the scheme"], correct: "a",
      explanation: "Values are read when the bundler starts.",
      wrong: { b: "No.", c: "No.", d: "No." } }),
  ]),

  ...check("md-l59-errors-dry", [
    q({ id: "mdq59-1", atom: "a-md-error-boundary", d: 2, prompt: "How do you add an app-wide error boundary with Expo Router?", options: ["export function ErrorBoundary from the root _layout.tsx", "Wrap App.tsx in try/catch", "Add it to app.json", "Install a package"], correct: "a",
      explanation: "It receives { error, retry }.",
      wrong: { b: "try/catch does not catch render errors in children.", c: "No.", d: "Not needed." } }),
    q({ id: "mdq59-2", atom: "a-md-error-boundary", d: 3, prompt: "A button's onPress handler throws. Does the error boundary catch it?", options: ["No: boundaries catch rendering errors; use try/catch in handlers", "Yes", "Only on iOS", "Only in development"], correct: "a",
      explanation: "Same for async errors such as a failed fetch.",
      wrong: { b: "Not in event handlers.", c: "No.", d: "No." } }),
    q({ id: "mdq59-3", atom: "a-md-dry", d: 2, prompt: "Why is copy-pasted formatting code a problem?", options: ["The copies drift apart when one is changed", "It is slower", "TypeScript forbids it", "It uses more battery"], correct: "a",
      explanation: "\"Oct 3, 2026\" on one screen, \"3 Oct 2026\" on another.",
      wrong: { b: "No.", c: "No.", d: "No." } }),
    q({ id: "mdq59-4", atom: "a-md-dry", d: 3, prompt: "Two functions look alike but will change for different reasons. What should you do?", options: ["Keep them separate", "Merge them immediately", "Delete one", "Move both to .env"], correct: "a",
      explanation: "Share knowledge, not coincidence.",
      wrong: { b: "Couples unrelated changes.", c: "No.", d: "No." } }),
  ]),

  ...check("md-l60-deps-docs", [
    q({ id: "mdq60-1", atom: "a-md-dependencies", d: 2, prompt: "npm outdated says a newer react-native exists. What should you do in an Expo project?", options: ["Keep the version your SDK expects, and upgrade the whole SDK as a planned step", "npm install react-native@latest", "Delete package-lock.json", "Ignore Expo's versions"], correct: "a",
      explanation: "The SDK fixes versions that work together; npx expo install --check verifies them.",
      wrong: { b: "Can break native modules.", c: "Makes installs unpredictable.", d: "No." } }),
    q({ id: "mdq60-2", atom: "a-md-dependencies", d: 2, prompt: "Before adding a native library, which site shows whether it supports Expo, Android and iOS?", options: ["The React Native Directory", "Stack Overflow", "The App Store", "Google Play Console"], correct: "a",
      explanation: "reactnative.directory lists platform and Expo Go support.",
      wrong: { b: "Answers, not support tables.", c: "No.", d: "No." } }),
    q({ id: "mdq60-3", atom: "a-md-docs-debugging", d: 2, prompt: "A library throws an error you don't understand. What is the best first step?", options: ["Read the whole error, then the docs for your version of the library", "Reinstall Node", "Rewrite the screen", "Switch libraries"], correct: "a",
      explanation: "Errors often state the rule you broke.",
      wrong: { b: "Rarely related.", c: "Guessing.", d: "Premature." } }),
    q({ id: "mdq60-4", atom: "a-md-docs-debugging", d: 2, prompt: "SecureStore rejects an object as a value. What is the fix?", options: ["Save JSON.stringify(value) and JSON.parse it when reading", "Use a longer key", "Use AsyncStorage for tokens", "Add await"], correct: "a",
      explanation: "Values must be strings.",
      wrong: { b: "Unrelated.", c: "AsyncStorage is not encrypted.", d: "Not the cause." } }),
    q({ id: "mdq60-5", atom: "a-md-docs-debugging", d: 1, prompt: "Which key in the npx expo start terminal opens React Native DevTools?", options: ["j", "r", "a", "w"], correct: "a",
      explanation: "Breakpoints and inspection instead of guessing.",
      wrong: { b: "Reloads.", c: "Opens Android.", d: "Opens the web." } }),
  ]),

  ...check("md-l61-git-flow", [
    q({ id: "mdq61-1", atom: "a-md-git-flow", d: 1, prompt: "Which command creates a branch and switches to it?", options: ["git switch -c feature/task-filters", "git branch -d feature/task-filters", "git merge feature/task-filters", "git log --oneline"], correct: "a",
      explanation: "-c creates it.",
      wrong: { b: "Deletes it.", c: "Merges it.", d: "Shows history." } }),
    q({ id: "mdq61-2", atom: "a-md-git-flow", d: 2, prompt: "Why open a pull request instead of pushing straight to main?", options: ["Teammates review the diff and automatic checks run before it reaches main", "GitHub forbids pushing to main", "It makes the app faster", "It renames the branch"], correct: "a",
      explanation: "main stays working.",
      wrong: { b: "Only if configured.", c: "No.", d: "No." } }),
    q({ id: "mdq61-3", atom: "a-md-git-flow", d: 3, prompt: "Git reports a merge conflict. What do you do?", options: ["Edit the marked files to the right version, then git add and git commit", "Delete the repository", "Run npm install", "Force-push"], correct: "a",
      explanation: "Choose between the versions Git marks.",
      wrong: { b: "No.", c: "Unrelated.", d: "Overwrites others' work." } }),
    q({ id: "mdq61-4", atom: "a-md-git-flow", d: 2, prompt: "Which of these should never be committed?", options: ["A secret API key", "package-lock.json", "app.json", "A component file"], correct: "a",
      explanation: "Git history keeps it forever.",
      wrong: { b: "Commit it.", c: "Commit it.", d: "Commit it." } }),
  ]),

  ...check("md-l62-m10-project", [
    q({ id: "mdq62-1", atom: "a-md-m10-project", d: 2, prompt: "Why reload the tasks with useFocusEffect rather than useEffect?", options: ["The tab is already mounted; focus re-runs it when the user returns", "useEffect does not work in tabs", "It is faster", "It caches data"], correct: "a",
      explanation: "Tabs stay mounted between visits.",
      wrong: { b: "It works, but only once.", c: "No.", d: "No." } }),
    q({ id: "mdq62-2", atom: "a-md-m10-project", d: 2, prompt: "Both tabs show nearly the same list. What does the practical do?", options: ["Share one TaskList with a done prop", "Copy the screen", "Use one tab", "Put it in app.json"], correct: "a",
      explanation: "One component, two uses.",
      wrong: { b: "Drift.", c: "Changes the design.", d: "No." } }),
    q({ id: "mdq62-3", atom: "a-md-m10-project", d: 2, prompt: "Where does the PATCH request for \"Mark as done\" belong?", options: ["updateTask in src/services/tasks.ts", "Inline in the screen with fetch", "In the hook's file only", "In theme.ts"], correct: "a",
      explanation: "Services talk to the server.",
      wrong: { b: "Scatters requests.", c: "Hooks use services.", d: "No." } }),
    q({ id: "mdq62-4", atom: "a-md-m10-project", d: 3, prompt: "What shows the app is maintainable?", options: ["Another developer can find and change any piece in one place", "It has many files", "It has no comments", "It uses the newest packages"], correct: "a",
      explanation: "The module's checkpoint.",
      wrong: { b: "Not by itself.", c: "No.", d: "No." } }),
  ]),
};
