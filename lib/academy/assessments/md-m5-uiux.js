/**
 * ASSESSMENTS · MOBILE APP DEVELOPMENT · MODULE 5 · UI/UX PRINCIPLES FOR MOBILE APPS
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Never import this from anything under src/.
 * ═════════════════════════════════════════════════════════════════════════
 */

import { q, check } from "./md-helpers.js";

export const ASSESSMENTS = {
  ...check("md-l19-user-centred", [
    q({ id: "mdq19-1", atom: "a-md-ucd", d: 2, prompt: "What is the core loop of user-centred design?", options: ["Research, design, test with users, learn, repeat", "Design once, then build", "Build, then ask users what they think", "Copy the market leader"], correct: "a",
      explanation: "Evidence from real users drives every iteration.",
      wrong: { b: "No testing means no learning.", c: "Learning after building is expensive.", d: "Their users and problems may differ." } }),
    q({ id: "mdq19-2", atom: "a-md-needs-use-cases", d: 2, prompt: "Which is a user NEED rather than a feature?", options: ["\"I must refill my mother's medicine before it runs out\"", "\"A reminder button\"", "\"Dark mode\"", "\"A settings screen\""], correct: "a",
      explanation: "Needs are the underlying problems; features are possible solutions.",
      wrong: { b: "A feature.", c: "A feature.", d: "A feature." } }),
    q({ id: "mdq19-3", atom: "a-md-needs-use-cases", d: 3, prompt: "Users say they want feature X, but you watch them fail at task Y. Which do you trust more?", options: ["What you observed: the failure at task Y", "What they said", "Neither", "Whichever is cheaper"], correct: "a",
      explanation: "Behaviour is stronger evidence than stated preference.",
      wrong: { b: "People predict their own needs poorly.", c: "Both are evidence; one is stronger.", d: "Cost is a later question." } }),
    q({ id: "mdq19-4", atom: "a-md-personas-journeys", d: 2, prompt: "What should a persona be based on?", options: ["Research with real users", "The team's guesses", "The founder alone", "Stock photos"], correct: "a",
      explanation: "A persona summarises what you learned.",
      wrong: { b: "Guesses mislead.", c: "One person is not your users.", d: "A photo is not evidence." } }),
    q({ id: "mdq19-5", atom: "a-md-personas-journeys", d: 2, prompt: "In a journey map, where do you find opportunities?", options: ["At the steps where the persona feels frustrated or unsure", "Only at the first step", "Only at the last step", "Nowhere: journeys are decoration"], correct: "a",
      explanation: "Negative feelings point to the problems worth solving.",
      wrong: { b: "Anywhere in the journey.", c: "Anywhere in the journey.", d: "They guide design." } }),
  ]),

  ...check("md-l20-structure", [
    q({ id: "mdq20-1", atom: "a-md-ia", d: 2, prompt: "How many destinations should a bottom tab bar usually have?", options: ["Three to five", "One", "Eight to ten", "As many as there are features"], correct: "a",
      explanation: "Both Apple and Google recommend a small number.",
      wrong: { b: "Then you need no tab bar.", c: "Too many to read or hit.", d: "Group the rest." } }),
    q({ id: "mdq20-2", atom: "a-md-ia", d: 2, prompt: "Which label is best for a money-transfer feature?", options: ["Send money", "P2P transfer", "Outbound remittance", "Module 3"], correct: "a",
      explanation: "Use your users' words.",
      wrong: { b: "Jargon.", c: "Jargon.", d: "Meaningless to users." } }),
    q({ id: "mdq20-3", atom: "a-md-wireframes", d: 2, prompt: "Why test with low-fidelity wireframes before polished designs?", options: ["They are quick to change and invite honest feedback on the flow", "Users prefer grey boxes", "Stores require them", "They are prettier"], correct: "a",
      explanation: "Learn about the flow before investing in polish.",
      wrong: { b: "Not the reason.", c: "Stores never see them.", d: "They are deliberately plain." } }),
    q({ id: "mdq20-4", atom: "a-md-figma", d: 2, prompt: "In Figma, what is Auto Layout closest to in React Native?", options: ["Flexbox", "useState", "fetch", "AsyncStorage"], correct: "a",
      explanation: "Both stack and space elements along an axis.",
      wrong: { b: "State, not layout.", c: "Networking.", d: "Storage." } }),
    q({ id: "mdq20-5", atom: "a-md-figma", d: 3, prompt: "What do shared colour styles and components in Figma become in code?", options: ["A theme of design tokens and reusable components", "Images", "Database tables", "Nothing"], correct: "a",
      explanation: "One change updates every use, in design and in code.",
      wrong: { b: "Images cannot adapt.", c: "Unrelated.", d: "They map directly." } }),
  ]),

  ...check("md-l21-visual", [
    q({ id: "mdq21-1", atom: "a-md-hierarchy", d: 2, prompt: "What contrast ratio does WCAG ask for normal-size text?", options: ["At least 4.5:1", "At least 1.5:1", "At least 10:1", "Any, if it looks nice"], correct: "a",
      explanation: "4.5:1 for normal text, 3:1 for large text.",
      wrong: { b: "Far too low.", c: "Stricter than required.", d: "Readability is measurable." } }),
    q({ id: "mdq21-2", atom: "a-md-hierarchy", d: 2, prompt: "Why keep spacing on a grid such as multiples of 8?", options: ["Consistent spacing groups related items and looks deliberate", "Phones only support multiples of 8", "It saves memory", "Stores require it"], correct: "a",
      explanation: "Consistency is what makes a layout read clearly.",
      wrong: { b: "Any value works technically.", c: "No.", d: "No." } }),
    q({ id: "mdq21-3", atom: "a-md-hierarchy", d: 2, prompt: "What is the smallest sensible body text size on a phone?", options: ["16", "10", "12", "8"], correct: "a",
      explanation: "Smaller is hard to read, especially outdoors.",
      wrong: { b: "Too small.", c: "Too small for body text.", d: "Unreadable." } }),
    q({ id: "mdq21-4", atom: "a-md-mobile-first", d: 2, prompt: "Where is the easiest place for a thumb to reach on a phone held in one hand?", options: ["The lower part of the screen", "The top corners", "The very top edge", "Behind the phone"], correct: "a",
      explanation: "Put frequent actions within thumb reach.",
      wrong: { b: "Hardest to reach.", c: "Hard to reach.", d: "No screen there." } }),
    q({ id: "mdq21-5", atom: "a-md-mobile-first", d: 3, prompt: "A call interrupts a user halfway through a form. What should a mobile-first design do?", options: ["Keep what they entered so they can continue", "Clear the form", "Show an error", "Log them out"], correct: "a",
      explanation: "Design for interruption: save progress.",
      wrong: { b: "They lose their work.", c: "Nothing went wrong.", d: "Unnecessary and annoying." } }),
  ]),

  ...check("md-l22-touch-a11y", [
    q({ id: "mdq22-1", atom: "a-md-touch-targets", d: 2, prompt: "What minimum touch target does Material Design recommend on Android?", options: ["48 × 48 dp", "24 × 24 dp", "16 × 16 dp", "100 × 100 dp"], correct: "a",
      explanation: "Apple's guideline is 44 × 44 points.",
      wrong: { b: "Too small.", c: "Far too small.", d: "Larger than needed." } }),
    q({ id: "mdq22-2", atom: "a-md-touch-targets", d: 2, prompt: "Your icon must stay 20 wide, but the target must be 48. How?", options: ["Add padding around the icon", "Make the icon 48", "Use a smaller font", "It cannot be done"], correct: "a",
      explanation: "The target can be bigger than what is drawn.",
      wrong: { b: "That changes the design.", c: "Unrelated.", d: "Padding does it." } }),
    q({ id: "mdq22-3", atom: "a-md-touch-targets", d: 2, prompt: "Why should swipe-to-delete never be the only way to delete?", options: ["Gestures are invisible, so people may never discover them", "Swipes are not allowed", "Swipes are slow", "Stores reject them"], correct: "a",
      explanation: "Offer a visible control too.",
      wrong: { b: "They are allowed.", c: "Not the issue.", d: "Not the issue." } }),
    q({ id: "mdq22-4", atom: "a-md-accessibility", d: 2, prompt: "A share button shows only an icon. What should its accessibilityLabel be?", options: ["\"Share article\"", "\"Button\"", "\"📤\"", "Nothing"], correct: "a",
      explanation: "Say what it does.",
      wrong: { b: "Tells nothing.", c: "A screen reader may read the emoji's name, not the action.", d: "Then it has no name." } }),
    q({ id: "mdq22-5", atom: "a-md-accessibility", d: 2, prompt: "Which are the built-in screen readers?", options: ["VoiceOver on iPhone and TalkBack on Android", "Siri and Google Assistant", "Expo Go and Xcode", "None exist"], correct: "a",
      explanation: "Test with them turned on.",
      wrong: { b: "Assistants, not screen readers.", c: "Development tools.", d: "Both platforms have one." } }),
  ]),

  ...check("md-l23-forms-states", [
    q({ id: "mdq23-1", atom: "a-md-form-design", d: 2, prompt: "Which error message is most helpful?", options: ["\"Enter your 11-digit phone number, starting with 0\"", "\"Invalid input\"", "\"Error 422\"", "\"Wrong\""], correct: "a",
      explanation: "Say how to fix it.",
      wrong: { b: "Says nothing useful.", c: "Technical.", d: "Unhelpful." } }),
    q({ id: "mdq23-2", atom: "a-md-form-design", d: 2, prompt: "Why use a visible label above a field instead of only a placeholder?", options: ["The placeholder disappears as soon as you type", "Placeholders are not allowed", "Labels are smaller", "It makes the form longer"], correct: "a",
      explanation: "A label stays visible while you type.",
      wrong: { b: "They are allowed.", c: "Not the reason.", d: "That is not a benefit." } }),
    q({ id: "mdq23-3", atom: "a-md-states", d: 2, prompt: "What should an empty list screen show?", options: ["Why it is empty and what to do next", "A blank screen", "An error message", "A spinner forever"], correct: "a",
      explanation: "Empty is a normal state that needs guidance.",
      wrong: { b: "Looks broken.", c: "Nothing failed.", d: "Loading is over." } }),
    q({ id: "mdq23-4", atom: "a-md-states", d: 2, prompt: "Why show a success message after placing an order?", options: ["So users know it worked and do not tap again", "Stores require it", "To slow the app down", "It is not needed"], correct: "a",
      explanation: "Confirmation prevents duplicate actions and doubt.",
      wrong: { b: "Not a store rule.", c: "No.", d: "Uncertainty leads to double orders." } }),
    q({ id: "mdq23-5", atom: "a-md-platform-conventions", d: 3, prompt: "On Android, what must always work in your app?", options: ["The system Back gesture or button", "A custom back button at the bottom", "Swipe from the right edge", "Nothing in particular"], correct: "a",
      explanation: "Android users rely on the system back.",
      wrong: { b: "Users will use the system back instead.", c: "Not a platform convention.", d: "Back is fundamental." } }),
  ]),

  ...check("md-l24-m5-project", [
    q({ id: "mdq24-1", atom: "a-md-m5-project", d: 2, prompt: "Which pay button name is best for a screen reader?", options: ["\"Pay ₦24,500\"", "\"Go\"", "\"Button\"", "\"Submit form 1\""], correct: "a",
      explanation: "What it does, and how much: and the same as the visible text.",
      wrong: { b: "Vague.", c: "Useless.", d: "Technical." } }),
    q({ id: "mdq24-2", atom: "a-md-m5-project", d: 2, prompt: "Why fix the look through a design file instead of editing the screen?", options: ["Tokens in one place keep every screen consistent and change in one edit", "Screens cannot be edited", "It is required by React Native", "It hides the changes"], correct: "a",
      explanation: "Single source of truth for design decisions.",
      wrong: { b: "They can.", c: "Not required.", d: "Not the purpose." } }),
    q({ id: "mdq24-3", atom: "a-md-m5-project", d: 3, prompt: "A user in bright sunlight cannot read grey #d1d5db text on white. What fixes it?", options: ["A darker grey with at least 4.5:1 contrast", "A bigger screen", "Bold white text", "Italics"], correct: "a",
      explanation: "Contrast is the measure; darken the text.",
      wrong: { b: "Not in your control.", c: "White on white is invisible.", d: "Italics make it harder." } }),
    q({ id: "mdq24-4", atom: "a-md-m5-project", d: 2, prompt: "Which test catches the most accessibility problems in five minutes?", options: ["Using the screen with VoiceOver or TalkBack turned on", "Looking at the colours", "Reading the code", "Asking a teammate"], correct: "a",
      explanation: "You hear exactly what a screen-reader user hears.",
      wrong: { b: "Misses names and roles.", c: "Slower and less direct.", d: "They see what you see." } }),
  ]),
};
