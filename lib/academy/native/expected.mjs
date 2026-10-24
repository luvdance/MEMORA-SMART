/**
 * MOBILE APP DEVELOPMENT — TERMINAL MODEL ANSWERS
 *
 * SERVER ONLY. For every recorded terminal exercise, the command that
 * completes it. The validator checks that the command was recorded and is
 * accepted, so an exercise can never ship that cannot be completed.
 */

export const MD_TERMINAL_EXPECTED = {
  // Module 2 · environment setup
  "a-md-terminal": "mkdir notes && ls",
  "a-md-node-npm": "node --version",
  "a-md-packages": "npx expo install expo-haptics",
  "a-md-git-commit": 'git commit -m "Change the welcome message"',
  "a-md-github": "git remote add origin https://github.com/ada-obi/my-first-app.git",
  "a-md-create-expo": "npx --yes create-expo-app@latest my-first-app --yes",
  "a-md-run-on-phone": "npx expo start",
  "a-md-app-json": "npx expo config --type public",

  // Module 7 · React Native
  "a-md-expo-workflow": "npx expo prebuild --platform android --no-install",

  // Module 10 · codebase structure
  "a-md-dependencies": "npx expo install --check",
  "a-md-git-flow": "git merge feature/task-filters",

  // Module 19 · security
  "a-md-dependency-audit": "npm audit",

  // Module 20 · release
  "a-md-eas-build": "npx eas-cli build --platform android --profile preview",
};
