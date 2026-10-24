/**
 * ASSESSMENTS · MOBILE APP DEVELOPMENT · MODULE 11 · MANAGING APPLICATION STATE
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Never import this from anything under src/.
 * ═════════════════════════════════════════════════════════════════════════
 */

import { q, check } from "./md-helpers.js";

export const ASSESSMENTS = {
  ...check("md-l63-state-basics", [
    q({ id: "mdq63-1", atom: "a-md-what-state", d: 1, prompt: "Why does changing a plain let variable not update the screen?", options: ["React re-renders only when state changes through its setter", "Variables are read-only", "The phone caches the screen", "It needs await"], correct: "a",
      explanation: "And the variable is reset on every render anyway.",
      wrong: { b: "They can change; React doesn't notice.", c: "No.", d: "No." } }),
    q({ id: "mdq63-2", atom: "a-md-what-state", d: 2, prompt: "Why write setQty((q) => q + 1) rather than setQty(qty + 1)?", options: ["It always uses the latest value, even with quick repeated taps", "It is shorter", "It skips re-rendering", "TypeScript requires it"], correct: "a",
      explanation: "The function form avoids stale values.",
      wrong: { b: "It is longer.", c: "It re-renders.", d: "No." } }),
    q({ id: "mdq63-3", atom: "a-md-local-state", d: 2, prompt: "Each FAQ answer opens on its own. Where should its open state live?", options: ["In each FaqItem", "In the screen, one boolean for all", "In Context", "In SecureStore"], correct: "a",
      explanation: "Each instance has its own state.",
      wrong: { b: "Opens them all together.", c: "Nobody else needs it.", d: "No." } }),
    q({ id: "mdq63-4", atom: "a-md-local-state", d: 2, prompt: "What happens to a component's local state when it unmounts?", options: ["It is lost", "It is saved automatically", "It moves to the parent", "It goes to AsyncStorage"], correct: "a",
      explanation: "Keep it higher up or in storage if it must survive.",
      wrong: { b: "No.", c: "No.", d: "Not unless you save it." } }),
  ]),

  ...check("md-l64-sharing-derived", [
    q({ id: "mdq64-1", atom: "a-md-lifting-state", d: 2, prompt: "A filter bar and a list both need the selected category. Where does it go?", options: ["In their closest common parent, passed down as props", "In both components", "In the filter bar only", "In a global variable"], correct: "a",
      explanation: "Lifting state up.",
      wrong: { b: "Two copies disagree.", c: "The list can't see it.", d: "React won't re-render." } }),
    q({ id: "mdq64-2", atom: "a-md-lifting-state", d: 2, prompt: "What is a controlled component?", options: ["One that shows what its props say and reports changes through callbacks", "One with a lot of state", "One wrapped in Context", "One that cannot change"], correct: "a",
      explanation: "value + onChange.",
      wrong: { b: "Opposite.", c: "No.", d: "It changes via its parent." } }),
    q({ id: "mdq64-3", atom: "a-md-derived-state", d: 2, prompt: "A basket stores lines, count and total in state. What should it store?", options: ["Only lines; count and total are calculated", "All three", "Only the total", "Only the count"], correct: "a",
      explanation: "Store the minimum, derive the rest.",
      wrong: { b: "Copies drift.", c: "Loses the lines.", d: "Loses the lines." } }),
    q({ id: "mdq64-4", atom: "a-md-derived-state", d: 3, prompt: "You see useEffect(() => setTotal(…), [lines]). What does it usually mean?", options: ["total should be derived during render instead", "The effect is required", "lines should be derived", "You need useReducer"], correct: "a",
      explanation: "Syncing state with an effect is a smell; it's also one render late.",
      wrong: { b: "It isn't.", c: "Backwards.", d: "Not needed." } }),
  ]),

  ...check("md-l65-context-reducer", [
    q({ id: "mdq65-1", atom: "a-md-context", d: 2, prompt: "Why should useSettings() throw when there is no provider?", options: ["A clear message beats a confusing null error later", "Context requires it", "To make it faster", "To hide the value"], correct: "a",
      explanation: "It names the mistake.",
      wrong: { b: "No.", c: "No.", d: "No." } }),
    q({ id: "mdq65-2", atom: "a-md-context", d: 2, prompt: "Where is a provider for app-wide settings usually placed?", options: ["Around the navigator in the root layout", "In each screen", "In app.json", "In a test file"], correct: "a",
      explanation: "Then every screen is below it.",
      wrong: { b: "Each would have its own value.", c: "No.", d: "No." } }),
    q({ id: "mdq65-3", atom: "a-md-reducer", d: 2, prompt: "What must a reducer never do?", options: ["Change the state object it was given", "Return a new object", "Use a switch", "Ignore an action"], correct: "a",
      explanation: "Return new objects; React compares by identity.",
      wrong: { b: "It should.", c: "Fine.", d: "Refusing actions is fine." } }),
    q({ id: "mdq65-4", atom: "a-md-reducer", d: 3, prompt: "Why is a reducer easy to test?", options: ["It is a pure function: same state and action, same result", "It runs on a server", "It has no types", "React tests it for you"], correct: "a",
      explanation: "No screen needed.",
      wrong: { b: "No.", c: "It does.", d: "No." } }),
  ]),

  ...check("md-l66-choosing", [
    q({ id: "mdq66-1", atom: "a-md-choosing-state", d: 2, prompt: "Products loaded from your API are which kind of state?", options: ["Server state: use a tool such as TanStack Query", "Local UI state", "Context state", "Constants"], correct: "a",
      explanation: "A cached copy of server data.",
      wrong: { b: "Many screens need it.", c: "Hard to keep fresh by hand.", d: "They change." } }),
    q({ id: "mdq66-2", atom: "a-md-choosing-state", d: 2, prompt: "What does a Zustand selector such as useFavourites((s) => s.ids.length) give you?", options: ["The component re-renders only when that value changes", "A provider", "Server caching", "Persistence"], correct: "a",
      explanation: "Fine-grained subscriptions.",
      wrong: { b: "Zustand needs none.", c: "No.", d: "That is middleware." } }),
    q({ id: "mdq66-3", atom: "a-md-choosing-state", d: 1, prompt: "Which is fine in Context: the theme, or text being typed into a search box?", options: ["The theme", "The search text", "Both equally", "Neither"], correct: "a",
      explanation: "Rarely changing, widely read.",
      wrong: { b: "Fast-changing and local.", c: "No.", d: "Theme is a classic use." } }),
    q({ id: "mdq66-4", atom: "a-md-choosing-state", d: 3, prompt: "What is the most common state bug in large apps?", options: ["Keeping server data in Context or a store and refreshing it by hand", "Using too many components", "Using TypeScript", "Using useState for a toggle"], correct: "a",
      explanation: "Server-state tools cache and refetch for you.",
      wrong: { b: "Not a state bug.", c: "No.", d: "That is correct use." } }),
  ]),

  ...check("md-l67-server-state", [
    q({ id: "mdq67-1", atom: "a-md-request-state-ui", d: 2, prompt: "Which four states should a screen that fetches handle?", options: ["Loading, error, empty and success", "Loading and success", "Online and offline", "Mounted and unmounted"], correct: "a",
      explanation: "Each needs something on screen.",
      wrong: { b: "Misses error and empty.", c: "That's the network.", d: "Lifecycle." } }),
    q({ id: "mdq67-2", atom: "a-md-request-state-ui", d: 3, prompt: "Why use one union state instead of isLoading, error and data variables?", options: ["Impossible combinations, such as loading with an error, can't happen", "It is faster", "React requires it", "It caches data"], correct: "a",
      explanation: "And TypeScript narrows on status.",
      wrong: { b: "No.", c: "No.", d: "No." } }),
    q({ id: "mdq67-3", atom: "a-md-server-vs-ui", d: 2, prompt: "Two screens call useQuery with the key [\"products\"]. How many requests are made?", options: ["One, shared and cached", "Two", "None until refresh", "One per render"], correct: "a",
      explanation: "The key identifies the data.",
      wrong: { b: "Deduplicated.", c: "No.", d: "No." } }),
    q({ id: "mdq67-4", atom: "a-md-server-vs-ui", d: 2, prompt: "Where does a \"Cheapest first\" toggle belong?", options: ["useState in the screen: it is UI state", "In the query cache", "On the server", "In SecureStore"], correct: "a",
      explanation: "How this screen shows data.",
      wrong: { b: "It isn't server data.", c: "No.", d: "No." } }),
  ]),

  ...check("md-l68-rerenders", [
    q({ id: "mdq68-1", atom: "a-md-rerenders", d: 2, prompt: "With the React Compiler on, what still causes unnecessary re-renders?", options: ["Fast-changing values in a context many components read", "Parents re-rendering", "Inline functions", "Styles"], correct: "a",
      explanation: "Every consumer re-renders when the value changes.",
      wrong: { b: "The compiler memoizes children.", c: "Memoized for you.", d: "No." } }),
    q({ id: "mdq68-2", atom: "a-md-rerenders", d: 2, prompt: "Only one field uses a note's text. Where should the text live?", options: ["In that field's own state", "In a shared context", "In a Zustand store", "In AsyncStorage"], correct: "a",
      explanation: "Local state re-renders only that field.",
      wrong: { b: "Re-renders every consumer.", c: "Unnecessary.", d: "No." } }),
    q({ id: "mdq68-3", atom: "a-md-rerenders", d: 1, prompt: "What should you do before optimising re-renders?", options: ["Measure with React Native DevTools' Profiler", "Add memo everywhere", "Remove all state", "Use a class component"], correct: "a",
      explanation: "Fix what you can see.",
      wrong: { b: "Guessing.", c: "No.", d: "No." } }),
    q({ id: "mdq68-4", atom: "a-md-rerenders", d: 3, prompt: "A context holds both the cart and a fast-changing search query. What helps?", options: ["Split it, or move the query into local state", "Wrap every component in memo", "Add more providers around each screen", "Use a class component"], correct: "a",
      explanation: "Separate fast and slow values.",
      wrong: { b: "Context consumers still re-render.", c: "Each would have its own copy.", d: "No." } }),
  ]),

  ...check("md-l69-m11-project", [
    q({ id: "mdq69-1", atom: "a-md-m11-project", d: 2, prompt: "In the shop, where does the cart live?", options: ["In a reducer shared through Context", "In TanStack Query", "In each screen's useState", "On the server only"], correct: "a",
      explanation: "Shared client state with rules.",
      wrong: { b: "It isn't server data yet.", c: "Screens would disagree.", d: "Not until checkout." } }),
    q({ id: "mdq69-2", atom: "a-md-m11-project", d: 2, prompt: "Where should the products come from?", options: ["useQuery with the [\"products\"] key", "A copy in the cart reducer", "Hard-coded in the screens", "app.json"], correct: "a",
      explanation: "Server data, cached.",
      wrong: { b: "Wrong home.", c: "Stale.", d: "No." } }),
    q({ id: "mdq69-3", atom: "a-md-m11-project", d: 2, prompt: "How should the cart total be computed?", options: ["Derived from the lines with cartTotal(state)", "Stored in the reducer and updated on each action", "Fetched from the server each time", "Kept in a ref"], correct: "a",
      explanation: "Derived values can't drift.",
      wrong: { b: "Can drift.", c: "Unnecessary.", d: "No re-render." } }),
    q({ id: "mdq69-4", atom: "a-md-m11-project", d: 3, prompt: "Is the checkout's \"sending\" status server data?", options: ["No: it is local UI state of the cart screen", "Yes", "It belongs in Context", "It belongs in the reducer"], correct: "a",
      explanation: "Only that screen shows it.",
      wrong: { b: "No.", c: "Nobody else needs it.", d: "Not cart data." } }),
  ]),
};
