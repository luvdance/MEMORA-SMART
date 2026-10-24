/**
 * ASSESSMENTS · MOBILE APP DEVELOPMENT · MODULE 6 · PLANNING APP SCREENS AND NAVIGATION
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Never import this from anything under src/.
 * ═════════════════════════════════════════════════════════════════════════
 */

import { q, check } from "./md-helpers.js";

export const ASSESSMENTS = {
  ...check("md-l25-first-screens", [
    q({ id: "mdq25-1", atom: "a-md-splash-onboarding", d: 2, prompt: "Where is an Expo app's splash screen configured?", options: ["In app.json, with the expo-splash-screen plugin", "In the home screen's code", "In the Google Play listing", "It cannot be changed"], correct: "a",
      explanation: "The OS shows it instantly from the build's configuration.",
      wrong: { b: "Screens are drawn after it.", c: "Store listings are separate.", d: "It is configurable." } }),
    q({ id: "mdq25-2", atom: "a-md-splash-onboarding", d: 2, prompt: "What is good onboarding practice?", options: ["At most about three skippable screens about benefits", "Ten screens explaining every feature", "Asking for every permission up front", "No way to skip"], correct: "a",
      explanation: "Short, skippable, value-focused.",
      wrong: { b: "Too long.", c: "Ask when the permission makes sense.", d: "Let users skip." } }),
    q({ id: "mdq25-3", atom: "a-md-auth-screens", d: 2, prompt: "After a user logs in, why replace the history instead of pushing home?", options: ["So Back cannot return to the login form", "It is faster", "To log them out", "To clear their data"], correct: "a",
      explanation: "The login form no longer makes sense once signed in.",
      wrong: { b: "Not about speed.", c: "No.", d: "No." } }),
    q({ id: "mdq25-4", atom: "a-md-auth-screens", d: 2, prompt: "What should a login screen always offer besides logging in?", options: ["A way to recover a forgotten password or PIN", "A promotions banner", "A link to the app store", "Nothing else"], correct: "a",
      explanation: "People forget; give them a path.",
      wrong: { b: "Distracting.", c: "They already have the app.", d: "A dead end for forgetful users." } }),
  ]),

  ...check("md-l26-core-screens", [
    q({ id: "mdq26-1", atom: "a-md-dashboards", d: 2, prompt: "What should a home dashboard show first?", options: ["The answer to the question users open the app with", "Promotions", "Every feature as tiles", "Terms and conditions"], correct: "a",
      explanation: "Balance, today's tasks, an order's status.",
      wrong: { b: "Not why users came.", c: "Highlights nothing.", d: "No." } }),
    q({ id: "mdq26-2", atom: "a-md-dashboards", d: 2, prompt: "What does home show a brand-new user with no data?", options: ["A designed empty state guiding them to their first action", "A blank screen", "An error", "Fake data"], correct: "a",
      explanation: "Empty states are part of the design.",
      wrong: { b: "Looks broken.", c: "Nothing went wrong.", d: "Misleading." } }),
    q({ id: "mdq26-3", atom: "a-md-list-detail-profile", d: 2, prompt: "What should each row of a list show?", options: ["The one or two facts needed to choose, with the whole row tappable", "Every detail of the item", "Only an ID number", "A large image only"], correct: "a",
      explanation: "Lists help people choose; details come after.",
      wrong: { b: "That belongs on the detail page.", c: "Meaningless.", d: "Often not enough to choose." } }),
    q({ id: "mdq26-4", atom: "a-md-list-detail-profile", d: 2, prompt: "Where should Sign out usually live?", options: ["On the profile or account screen", "Hidden in a long settings list three levels deep", "On the welcome screen", "Nowhere"], correct: "a",
      explanation: "Easy to find, alongside account settings.",
      wrong: { b: "Too hard to find.", c: "They are not signed in there.", d: "Users must be able to sign out." } }),
  ]),

  ...check("md-l27-navigation-patterns", [
    q({ id: "mdq27-1", atom: "a-md-tabs", d: 2, prompt: "What are bottom tabs for?", options: ["Separate top-level areas of the app", "The steps of a checkout", "Confirming a payment", "Error messages"], correct: "a",
      explanation: "Tabs for places, stacks for paths.",
      wrong: { b: "Steps belong in a stack.", c: "That is a modal or a step.", d: "No." } }),
    q({ id: "mdq27-2", atom: "a-md-stack-modal", d: 2, prompt: "What does Back do in a stack?", options: ["Pops the top screen, returning to the one before", "Opens the first tab", "Closes the app", "Reloads the screen"], correct: "a",
      explanation: "A stack is a pile of screens.",
      wrong: { b: "That is tab behaviour.", c: "Only from the root on Android.", d: "No." } }),
    q({ id: "mdq27-3", atom: "a-md-stack-modal", d: 2, prompt: "Which task suits a modal?", options: ["Composing a short message", "Browsing a product catalogue", "The app's home screen", "A list of orders"], correct: "a",
      explanation: "Short, self-contained, with done or cancel.",
      wrong: { b: "Browsing belongs in tabs and stacks.", c: "A top-level place.", d: "A top-level place." } }),
    q({ id: "mdq27-4", atom: "a-md-back", d: 3, prompt: "A user presses Back halfway through a long form. What should happen?", options: ["Ask before discarding what they typed", "Silently discard it", "Submit the form", "Close the app"], correct: "a",
      explanation: "Never lose work without asking.",
      wrong: { b: "Losing work is frustrating.", c: "They did not ask to submit.", d: "No." } }),
    q({ id: "mdq27-5", atom: "a-md-back", d: 2, prompt: "How do iOS users usually go back?", options: ["The back arrow at the top left, or a swipe from the left edge", "A system Back button", "Shaking the phone", "Pressing the power button"], correct: "a",
      explanation: "Android has a system Back; iOS uses the header and swipe.",
      wrong: { b: "That is Android.", c: "That opens developer tools in Expo.", d: "No." } }),
  ]),

  ...check("md-l28-flows-components", [
    q({ id: "mdq28-1", atom: "a-md-flow-diagrams", d: 2, prompt: "What is a screen with no arrows leaving it in a flow diagram?", options: ["A dead end users can get stuck on", "A finished design", "A modal", "A tab"], correct: "a",
      explanation: "Every screen needs a way forward or back.",
      wrong: { b: "It is a problem.", c: "Modals have ways out.", d: "Tabs always connect." } }),
    q({ id: "mdq28-2", atom: "a-md-design-components", d: 2, prompt: "Why design a Button component with variants instead of many separate buttons?", options: ["Consistency for users, and one component to build and change", "It uses fewer colours", "Stores require it", "Figma charges per button"], correct: "a",
      explanation: "One change updates every use.",
      wrong: { b: "Not the point.", c: "No.", d: "No." } }),
    q({ id: "mdq28-3", atom: "a-md-responsive-phones", d: 2, prompt: "Which React Native hook gives the current screen width, updating on rotation?", options: ["useWindowDimensions", "useState", "useEffect", "useRouter"], correct: "a",
      explanation: "It re-renders the component when the size changes.",
      wrong: { b: "Local state.", c: "Side effects.", d: "Navigation." } }),
    q({ id: "mdq28-4", atom: "a-md-responsive-phones", d: 3, prompt: "Which test matters most for a layout?", options: ["The smallest and largest phones your users have, in both orientations, with large text", "Only your own phone", "Only a tablet", "Only portrait"], correct: "a",
      explanation: "Layouts break at the extremes.",
      wrong: { b: "Your phone is one size.", c: "Phones matter most.", d: "Rotation changes the width." } }),
  ]),

  ...check("md-l29-m6-project", [
    q({ id: "mdq29-1", atom: "a-md-m6-project", d: 2, prompt: "In the booking flow, why does Confirm replace the history?", options: ["So Back from bookings does not reopen a booking that is already confirmed", "To delete the booking", "To log out", "To make it faster"], correct: "a",
      explanation: "A finished task should not be reachable with Back.",
      wrong: { b: "It keeps it.", c: "No.", d: "No." } }),
    q({ id: "mdq29-2", atom: "a-md-m6-project", d: 2, prompt: "Which screen in the booking app is best as a modal?", options: ["Confirm booking", "Home", "Bookings", "Profile"], correct: "a",
      explanation: "A short, focused step with confirm or cancel.",
      wrong: { b: "A tab.", c: "A tab.", d: "A tab." } }),
    q({ id: "mdq29-3", atom: "a-md-m6-project", d: 2, prompt: "Why build a clickable prototype before writing the app?", options: ["Testing it with people finds problems while they are cheap to fix", "Stores require a prototype", "It replaces the app", "It is required by Expo"], correct: "a",
      explanation: "Change a prototype in minutes, not days.",
      wrong: { b: "No.", c: "It does not.", d: "No." } }),
    q({ id: "mdq29-4", atom: "a-md-m6-project", d: 3, prompt: "A tester cannot find how to cancel a booking. What does that tell you?", options: ["The flow needs a visible path to cancel; fix the prototype before building", "The tester is wrong", "Remove cancelling", "Add it to onboarding"], correct: "a",
      explanation: "If testers cannot find it, users will not either.",
      wrong: { b: "Testers represent users.", c: "Users need it.", d: "Wrong place." } }),
  ]),
};
