/**
 * ASSESSMENTS · MOBILE APP DEVELOPMENT · MODULE 21 · CAPSTONE PROJECT AND PROFESSIONAL READINESS
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Never import this from anything under src/.
 * ═════════════════════════════════════════════════════════════════════════
 */

import { q, check } from "./md-helpers.js";

export const ASSESSMENTS = {
  ...check("md-l138-scope-requirements", [
    q({ id: "mdq138-1", atom: "a-md-capstone-scope", d: 2, prompt: "What makes a good capstone?", options: ["A real problem with reachable users, scoped to an MVP you can finish and release", "The biggest idea possible", "A copy of a tutorial", "Several unfinished apps"], correct: "a",
      explanation: "Finished and released beats big.",
      wrong: { b: "Won't finish.", c: "Shows little of you.", d: "No." } }),
    q({ id: "mdq138-2", atom: "a-md-capstone-scope", d: 2, prompt: "Why write down what is out of scope?", options: ["To protect the deadline from scope creep", "Stores require it", "To make the README longer", "It's optional decoration"], correct: "a",
      explanation: "\"Later\" is a decision, not a failure.",
      wrong: { b: "No.", c: "No.", d: "It matters." } }),
    q({ id: "mdq138-3", atom: "a-md-user-stories", d: 1, prompt: "Which is a well-formed user story?", options: ["As a customer, I want to book a fitting, so that I don't wait at the shop", "Booking screen with a calendar", "The app should be fast", "Add a database"], correct: "a",
      explanation: "Who, what, why.",
      wrong: { b: "A design detail.", c: "Vague.", d: "A task." } }),
    q({ id: "mdq138-4", atom: "a-md-user-stories", d: 2, prompt: "What form do acceptance criteria usually take?", options: ["Given … when … then …", "Title and description", "A list of screens", "A colour palette"], correct: "a",
      explanation: "They become tests.",
      wrong: { b: "No.", c: "No.", d: "No." } }),
  ]),

  ...check("md-l139-design-plan", [
    q({ id: "mdq139-1", atom: "a-md-technical-design", d: 2, prompt: "Why write the API contract before building both sides?", options: ["So the app and the server agree on every request and response", "To slow the project", "Stores require it", "To avoid tests"], correct: "a",
      explanation: "One source of truth.",
      wrong: { b: "Saves time overall.", c: "No.", d: "No." } }),
    q({ id: "mdq139-2", atom: "a-md-technical-design", d: 2, prompt: "Which belongs in a design document's Risks section?", options: ["Double bookings, mitigated with a unique constraint and a transaction", "The app's colours", "The team's lunch plans", "The README"], correct: "a",
      explanation: "A risk and its mitigation.",
      wrong: { b: "No.", c: "No.", d: "No." } }),
    q({ id: "mdq139-3", atom: "a-md-build-plan", d: 2, prompt: "What should you start on day one of a four-week capstone?", options: ["Developer accounts, a development build on both phones, CI and the closed-test plan", "The logo", "Animations", "The case study"], correct: "a",
      explanation: "Slow external steps first.",
      wrong: { b: "Later.", c: "Later.", d: "At the end." } }),
    q({ id: "mdq139-4", atom: "a-md-build-plan", d: 2, prompt: "Week two slips. What should you cut?", options: ["Scope: move a story to Later", "Tests", "The release", "Security checks"], correct: "a",
      explanation: "Keep quality and the release.",
      wrong: { b: "No.", c: "No.", d: "No." } }),
  ]),

  ...check("md-l140-build-quality", [
    q({ id: "mdq140-1", atom: "a-md-core-flows", d: 2, prompt: "What is a vertical slice?", options: ["One story built end to end: screen, states, API, rules, tests, real phones", "All screens first", "All of the backend first", "Only the happy path"], correct: "a",
      explanation: "Integration problems appear early.",
      wrong: { b: "Horizontal.", c: "Horizontal.", d: "Incomplete." } }),
    q({ id: "mdq140-2", atom: "a-md-core-flows", d: 2, prompt: "Which story should you build first?", options: ["The riskiest, with the most unknowns", "The easiest", "The prettiest", "The last one"], correct: "a",
      explanation: "De-risk early.",
      wrong: { b: "Postpones risk.", c: "No.", d: "No." } }),
    q({ id: "mdq140-3", atom: "a-md-quality-pass", d: 3, prompt: "Two days before beta, which check matters most?", options: ["A second user trying to read or change the first user's data", "A dark-mode toggle", "New animations", "A folder rewrite"], correct: "a",
      explanation: "Protect testers' data.",
      wrong: { b: "Nice to have.", c: "Polish.", d: "Risky." } }),
    q({ id: "mdq140-4", atom: "a-md-quality-pass", d: 2, prompt: "Where should performance be checked?", options: ["A release build on a mid-range Android phone", "A development build on a flagship", "The simulator", "The web"], correct: "a",
      explanation: "Where users are.",
      wrong: { b: "Hides problems.", c: "Too fast.", d: "Not a phone." } }),
  ]),

  ...check("md-l141-beta-launch", [
    q({ id: "mdq141-1", atom: "a-md-beta-testing", d: 2, prompt: "How do iOS beta testers get the app?", options: ["TestFlight", "An APK", "Google Play closed testing", "Expo Go"], correct: "a",
      explanation: "Internal at once; external after Beta App Review.",
      wrong: { b: "Android.", c: "Android.", d: "Not your build." } }),
    q({ id: "mdq141-2", atom: "a-md-beta-testing", d: 2, prompt: "How do you ship a JavaScript fix to beta testers fastest?", options: ["An EAS Update to their channel", "A new store listing", "Ask them to reinstall", "Wait for launch"], correct: "a",
      explanation: "Next launch picks it up.",
      wrong: { b: "No.", c: "Unnecessary.", d: "Too late." } }),
    q({ id: "mdq141-3", atom: "a-md-launch", d: 2, prompt: "Both stores approved the app on a Thursday night before you travel. When do you release?", options: ["When you can monitor it, with a staged rollout and phased release", "Immediately to everyone", "Never", "Only on iOS"], correct: "a",
      explanation: "Approval and release are separate.",
      wrong: { b: "No one watching.", c: "No.", d: "Both." } }),
    q({ id: "mdq141-4", atom: "a-md-launch", d: 2, prompt: "How should you ask users for a store review?", options: ["In the app, after a successful moment, without a reward", "With a discount for 5 stars", "Every time the app opens", "By e-mail to strangers"], correct: "a",
      explanation: "expo-store-review.",
      wrong: { b: "Against policy.", c: "Annoying.", d: "No." } }),
  ]),

  ...check("md-l142-portfolio-career", [
    q({ id: "mdq142-1", atom: "a-md-portfolio", d: 2, prompt: "What should come first in a portfolio README?", options: ["What the app does, for whom, and links to try it", "The licence", "The folder structure", "The changelog"], correct: "a",
      explanation: "Reviewers spend a minute.",
      wrong: { b: "Later.", c: "Later.", d: "Later." } }),
    q({ id: "mdq142-2", atom: "a-md-portfolio", d: 2, prompt: "How should setup instructions handle API keys?", options: ["Point to .env.example; never include real keys", "Paste the real keys", "Put keys in the README", "Commit .env.local"], correct: "a",
      explanation: "Secrets stay out of Git.",
      wrong: { b: "Leak.", c: "Leak.", d: "Leak." } }),
    q({ id: "mdq142-3", atom: "a-md-professional-readiness", d: 2, prompt: "Whose developer accounts should a client's app be published under?", options: ["The client's, with you added as a team member", "Yours", "A friend's", "Expo's"], correct: "a",
      explanation: "The app belongs to the client.",
      wrong: { b: "Ties them to you.", c: "No.", d: "No." } }),
    q({ id: "mdq142-4", atom: "a-md-professional-readiness", d: 2, prompt: "What makes a strong take-home task submission?", options: ["A small, clean, tested solution with a README explaining decisions", "As many features as possible", "No README", "A video only"], correct: "a",
      explanation: "Don't overbuild.",
      wrong: { b: "Overbuilding.", c: "Explain yourself.", d: "Code matters." } }),
  ]),

  ...check("md-l143-capstone", [
    q({ id: "mdq143-1", atom: "a-md-capstone", d: 2, prompt: "What makes a case study's results convincing?", options: ["Specific numbers and quotes from real testers", "Adjectives such as \"amazing\"", "A long feature list", "Your opinion only"], correct: "a",
      explanation: "Evidence.",
      wrong: { b: "Unconvincing.", c: "Not results.", d: "Not evidence." } }),
    q({ id: "mdq143-2", atom: "a-md-capstone", d: 2, prompt: "Why include challenges in the case study?", options: ["They show how you solve problems, which is what employers hire for", "To fill space", "Stores require it", "To apologise"], correct: "a",
      explanation: "Problem, approach, result.",
      wrong: { b: "No.", c: "No.", d: "No." } }),
    q({ id: "mdq143-3", atom: "a-md-capstone", d: 2, prompt: "Which links should a case study include?", options: ["Where to try the app on Android and iOS, and the code", "Only your social media", "None", "Competitors' apps"], correct: "a",
      explanation: "Let readers see for themselves.",
      wrong: { b: "Not enough.", c: "No.", d: "No." } }),
    q({ id: "mdq143-4", atom: "a-md-capstone", d: 3, prompt: "What does the capstone's mastery checkpoint ask you to show?", options: ["A live demo on both platforms, decisions you'd defend, a bug you fixed, and what testers taught you", "Only the code", "Only screenshots", "A certificate"], correct: "a",
      explanation: "Build and explain.",
      wrong: { b: "Not enough.", c: "Not enough.", d: "No." } }),
  ]),
};
