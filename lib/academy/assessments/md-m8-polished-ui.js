/**
 * ASSESSMENTS · MOBILE APP DEVELOPMENT · MODULE 8 · BUILDING POLISHED MOBILE INTERFACES
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Never import this from anything under src/.
 * ═════════════════════════════════════════════════════════════════════════
 */

import { q, check } from "./md-helpers.js";

export const ASSESSMENTS = {
  ...check("md-l43-component-kit", [
    q({ id: "mdq43-1", atom: "a-md-component-kit", d: 2, prompt: "Why should a loading button ignore taps?", options: ["So a slow request cannot be sent twice, such as a double payment", "To save battery", "Stores require it", "To hide the title"], correct: "a",
      explanation: "Disable while busy, and say so to screen readers.",
      wrong: { b: "Not the reason.", c: "No.", d: "A side effect, not the reason." } }),
    q({ id: "mdq43-2", atom: "a-md-component-kit", d: 2, prompt: "How should a Button component express \"danger\" or \"secondary\"?", options: ["A typed variant prop", "A separate component per colour", "Inline styles on every screen", "A global variable"], correct: "a",
      explanation: "variant?: \"primary\" | \"secondary\" | \"danger\"",
      wrong: { b: "Duplication.", c: "Inconsistent.", d: "No." } }),
    q({ id: "mdq43-3", atom: "a-md-responsive-dimensions", d: 2, prompt: "Why limit text content with maxWidth on tablets and in landscape?", options: ["Very long lines are hard to read", "To save memory", "Tablets require it", "To hide content"], correct: "a",
      explanation: "Comfortable line length matters.",
      wrong: { b: "No.", c: "No.", d: "No." } }),
    q({ id: "mdq43-4", atom: "a-md-responsive-dimensions", d: 2, prompt: "Which hook gives the size and updates on rotation?", options: ["useWindowDimensions", "useState", "useFonts", "useColorScheme"], correct: "a",
      explanation: "It re-renders with the new size.",
      wrong: { b: "Local state.", c: "Fonts.", d: "Theme." } }),
  ]),

  ...check("md-l44-assets", [
    q({ id: "mdq44-1", atom: "a-md-assets", d: 2, prompt: "Why keep the splash screen up until custom fonts load?", options: ["So users never see text jump from one font to another", "Fonts cannot load otherwise", "The stores require it", "To make the app slower"], correct: "a",
      explanation: "preventAutoHideAsync, then hideAsync once loaded.",
      wrong: { b: "They load either way.", c: "No.", d: "No." } }),
    q({ id: "mdq44-2", atom: "a-md-assets", d: 2, prompt: "What are logo@2x.png and logo@3x.png for?", options: ["Sharper versions the phone picks for its screen density", "Two different logos", "Android and iOS", "Light and dark mode"], correct: "a",
      explanation: "The bundler chooses by density.",
      wrong: { b: "Same logo.", c: "By density, not platform.", d: "No." } }),
    q({ id: "mdq44-3", atom: "a-md-assets", d: 2, prompt: "Which package provides Ionicons and MaterialIcons in an Expo app?", options: ["@expo/vector-icons", "expo-camera", "expo-font only", "react-native-maps"], correct: "a",
      explanation: "And TypeScript checks icon names.",
      wrong: { b: "Camera.", c: "Fonts in general.", d: "Maps." } }),
    q({ id: "mdq44-4", atom: "a-md-gradients", d: 2, prompt: "A LinearGradient with start {x:0,y:0} and end {x:1,y:1} runs…", options: ["From the top-left corner to the bottom-right", "Top to bottom", "Left to right", "In a circle"], correct: "a",
      explanation: "Fractions of the box.",
      wrong: { b: "That is x 0.5 to 0.5.", c: "That is y unchanged.", d: "Linear, not radial." } }),
    q({ id: "mdq44-5", atom: "a-md-gradients", d: 3, prompt: "Why use heavy shadows and blurs sparingly?", options: ["They can cost frames on cheaper Android phones and add noise", "They are not allowed", "They only work on iOS", "They need a server"], correct: "a",
      explanation: "Polish, not decoration overload.",
      wrong: { b: "Allowed.", c: "boxShadow works on both.", d: "No." } }),
  ]),

  ...check("md-l45-scroll-search", [
    q({ id: "mdq45-1", atom: "a-md-search-filter", d: 2, prompt: "Where should a filtered product list come from?", options: ["Calculated during render from the data, the query and the category", "A separate copy kept in state", "A global variable", "The server every keystroke, always"], correct: "a",
      explanation: "Derived state; only the inputs are state.",
      wrong: { b: "Copies go stale.", c: "No re-render.", d: "Fine for big data, with debouncing, but not needed here." } }),
    q({ id: "mdq45-2", atom: "a-md-search-filter", d: 2, prompt: "Which prop makes a ScrollView scroll sideways?", options: ["horizontal", "sideways", "flexDirection row", "scrollX"], correct: "a",
      explanation: "horizontal, usually with the indicator hidden.",
      wrong: { b: "Not a prop.", c: "Lays out but does not scroll.", d: "Not a prop." } }),
    q({ id: "mdq45-3", atom: "a-md-validation-feedback", d: 2, prompt: "When should a field's error message first appear?", options: ["After the user leaves the field or tries to submit", "Before they type anything", "Only after the request fails", "Never"], correct: "a",
      explanation: "Do not shout at someone still typing.",
      wrong: { b: "Hostile.", c: "Too late.", d: "They need it." } }),
    q({ id: "mdq45-4", atom: "a-md-validation-feedback", d: 2, prompt: "Is a red border alone enough to show an error?", options: ["No: add a message saying how to fix it", "Yes", "Only on Android", "Only for passwords"], correct: "a",
      explanation: "Colour alone does not carry meaning for everyone.",
      wrong: { b: "Colour-blind and screen-reader users miss it.", c: "Both.", d: "All fields." } }),
  ]),

  ...check("md-l46-themes-loading", [
    q({ id: "mdq46-1", atom: "a-md-dark-mode", d: 2, prompt: "Which app.json setting lets an app follow the phone's dark mode?", options: ["\"userInterfaceStyle\": \"automatic\"", "\"orientation\": \"default\"", "\"scheme\": \"dark\"", "\"darkMode\": true"], correct: "a",
      explanation: "The template's default.",
      wrong: { b: "Rotation.", c: "Deep links.", d: "Not a setting." } }),
    q({ id: "mdq46-2", atom: "a-md-dark-mode", d: 2, prompt: "What does useColorScheme() return?", options: ["\"light\" or \"dark\", following the phone", "A colour", "The app's brand", "true or false"], correct: "a",
      explanation: "It re-renders when the setting changes.",
      wrong: { b: "A name.", c: "No.", d: "A string." } }),
    q({ id: "mdq46-3", atom: "a-md-dark-mode", d: 3, prompt: "Which is good dark-mode practice?", options: ["Dark greys for surfaces, and check contrast again", "Invert every colour", "Pure black everywhere with pure white text", "Keep light colours"], correct: "a",
      explanation: "Dark mode is designed, not inverted.",
      wrong: { b: "Inverted brand colours look wrong.", c: "Harsh, and smears on some screens.", d: "That is light mode." } }),
    q({ id: "mdq46-4", atom: "a-md-skeletons", d: 2, prompt: "When is a skeleton better than a spinner?", options: ["For a screen of content, so users see what is coming", "Inside a button", "Never", "For errors"], correct: "a",
      explanation: "Spinners suit buttons and short waits.",
      wrong: { b: "Use a spinner there.", c: "Skeletons help.", d: "Errors need messages." } }),
  ]),

  ...check("md-l47-a11y-orientation", [
    q({ id: "mdq47-1", atom: "a-md-a11y-labels", d: 2, prompt: "What four things does every control need for screen readers?", options: ["A role, a name, its state, and a hint when needed", "A colour, a size, a shadow and a border", "An id, a key, a ref and a style", "Nothing"], correct: "a",
      explanation: "\"Bold, button, selected.\"",
      wrong: { b: "Visual only.", c: "Code details.", d: "Then it is unusable." } }),
    q({ id: "mdq47-2", atom: "a-md-a11y-labels", d: 2, prompt: "How does a toggle button report that it is on?", options: ["accessibilityState={{ selected: true }}", "A green colour", "Bold text", "testID=\"on\""], correct: "a",
      explanation: "State is announced.",
      wrong: { b: "Not announced.", c: "Not announced.", d: "For tests only." } }),
    q({ id: "mdq47-3", atom: "a-md-orientation", d: 2, prompt: "Which app.json value lets the app rotate?", options: ["\"orientation\": \"default\"", "\"orientation\": \"portrait\"", "\"rotate\": true", "\"landscape\": \"yes\""], correct: "a",
      explanation: "portrait locks it.",
      wrong: { b: "Locks.", c: "Not a setting.", d: "Not a setting." } }),
    q({ id: "mdq47-4", atom: "a-md-orientation", d: 3, prompt: "How can a screen decide to lay out side by side?", options: ["When width > height from useWindowDimensions", "When Platform.OS is ios", "Always", "When the battery is low"], correct: "a",
      explanation: "The screen's shape, not the platform.",
      wrong: { b: "Unrelated.", c: "Bad on portrait phones.", d: "Unrelated." } }),
  ]),

  ...check("md-l48-m8-project", [
    q({ id: "mdq48-1", atom: "a-md-m8-project", d: 2, prompt: "Which role suits choosing one text size out of three?", options: ["radio", "button", "header", "image"], correct: "a",
      explanation: "One of a group, with a checked state.",
      wrong: { b: "Does not say it is a choice.", c: "No.", d: "No." } }),
    q({ id: "mdq48-2", atom: "a-md-m8-project", d: 2, prompt: "Why build the stats from a Card component?", options: ["One component keeps every card consistent and changes in one place", "Cards are required", "It is faster to type inline styles", "Tabs need it"], correct: "a",
      explanation: "Reuse.",
      wrong: { b: "No.", c: "It is not.", d: "No." } }),
    q({ id: "mdq48-3", atom: "a-md-m8-project", d: 2, prompt: "A search returns nothing. What should the list show?", options: ["A message saying nothing matches the query", "A blank screen", "The full list", "An error"], correct: "a",
      explanation: "Empty states need words.",
      wrong: { b: "Looks broken.", c: "Ignores the query.", d: "Nothing failed." } }),
    q({ id: "mdq48-4", atom: "a-md-m8-project", d: 3, prompt: "Which test best proves the dashboard is accessible?", options: ["Using every control with VoiceOver or TalkBack", "Looking at it", "Running it in landscape", "Making it dark"], correct: "a",
      explanation: "You hear what screen-reader users hear.",
      wrong: { b: "Misses names and roles.", c: "Different check.", d: "Different check." } }),
  ]),
};
