/**
 * ASSESSMENTS · REACT DEVELOPMENT · MODULE 6 · REACT HOOKS AND SIDE EFFECTS
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Never import this from anything under src/.
 * ═════════════════════════════════════════════════════════════════════════
 */

import { q, check } from "./rx-helpers.js";

export const ASSESSMENTS = {
  ...check("rx-l35-hooks-reducer", [
    q({ id: "rxq35-1", atom: "a-rx-rules-of-hooks", d: 2, prompt: "How does React tell one useState call from another in the same component?", options: ["By the order the Hooks are called in", "By the variable names", "By a hidden id you pass", "By their initial values"], correct: "a",
      explanation: "Which is why the order must never change between renders.",
      wrong: { b: "React never sees your variable names.", c: "There is no id.", d: "Values can repeat." } }),
    q({ id: "rxq35-2", atom: "a-rx-usereducer", d: 2, prompt: "In useReducer, what does a component do to change state?", options: ["dispatch an action describing what happened", "Call the reducer directly", "Mutate the state", "Call setState with the action"], correct: "a",
      explanation: "React calls the reducer with the current state and the action.",
      wrong: { b: "React calls it.", c: "Never mutate.", d: "useReducer has no setState." } }),
    q({ id: "rxq35-3", atom: "a-rx-usereducer", d: 3, prompt: "What must a reducer be?", options: ["A pure function returning new state from (state, action)", "An async function that fetches", "A component", "A function that mutates state and returns nothing"], correct: "a",
      explanation: "No side effects, no mutation.",
      wrong: { b: "Side effects do not belong in reducers.", c: "It returns state, not JSX.", d: "It must return the new state." } }),
    q({ id: "rxq35-4", atom: "a-rx-purpose-effect", d: 2, prompt: "Which belongs in a useEffect?", options: ["Keeping document.title in sync with state", "Calculating a total from the cart", "Handling a Buy button click", "Formatting a date for display"], correct: "a",
      explanation: "Effects synchronise with things outside React.",
      wrong: { b: "Calculate during render.", c: "That belongs in the click handler.", d: "Calculate during render." } }),
  ]),

  ...check("rx-l36-effects", [
    q({ id: "rxq36-1", atom: "a-rx-external-systems", d: 2, prompt: "When does React run an effect's cleanup?", options: ["Before re-running the effect with new dependencies, and when the component is removed", "Only when the page closes", "Before the first render", "Never automatically"], correct: "a",
      explanation: "Stop the old connection, then start the new one.",
      wrong: { b: "Much earlier than that.", c: "Effects run after rendering.", d: "React calls it." } }),
    q({ id: "rxq36-2", atom: "a-rx-dependencies", d: 2, prompt: "useEffect(fn, []) runs…", options: ["Once, after the component first appears (twice in development under Strict Mode)", "After every render", "Never", "Before rendering"], correct: "a",
      explanation: "An empty array means no dependencies to change.",
      wrong: { b: "That is with no array.", c: "It runs once.", d: "Effects run after." } }),
    q({ id: "rxq36-3", atom: "a-rx-dependencies", d: 3, prompt: "An effect reads roomId but its array is []. What happens when roomId changes?", options: ["The effect keeps using the old roomId", "The effect re-runs automatically", "React throws", "The component unmounts"], correct: "a",
      explanation: "List every value the effect reads.",
      wrong: { b: "Only listed values trigger it.", c: "The lint rule warns; React does not throw.", d: "Unrelated." } }),
    q({ id: "rxq36-4", atom: "a-rx-cleanup", d: 3, prompt: "In development, a clock with setInterval and no cleanup ticks twice as fast. Why?", options: ["Strict Mode mounted it twice and the first interval was never cleared", "The browser is fast", "setInterval always runs twice", "React renders twice in production"], correct: "a",
      explanation: "Return () => clearInterval(id).",
      wrong: { b: "Unrelated.", c: "It runs once per call.", d: "Production mounts once; the leak is still real." } }),
  ]),

  ...check("rx-l37-fetching", [
    q({ id: "rxq37-1", atom: "a-rx-fetch-effect", d: 2, prompt: "Why not write useEffect(async () => { … })?", options: ["An async function returns a promise, but an effect must return a cleanup function or nothing", "async is not allowed in React", "It runs too slowly", "It is fine"], correct: "a",
      explanation: "Define an async function inside and call it.",
      wrong: { b: "Async functions are fine inside the effect.", c: "Not about speed.", d: "React warns." } }),
    q({ id: "rxq37-2", atom: "a-rx-fetch-effect", d: 2, prompt: "You see each request twice in the Network panel during development. Why?", options: ["Strict Mode runs effects twice in development", "fetch always sends twice", "The server is broken", "A production bug"], correct: "a",
      explanation: "In production it runs once; handle the second run correctly.",
      wrong: { b: "Once per call.", c: "Unrelated.", d: "Development only." } }),
    q({ id: "rxq37-3", atom: "a-rx-loading-empty-error", d: 2, prompt: "Which four outcomes should a data-loading screen design for?", options: ["Loading, success, empty and error", "Success only", "Loading and success", "Error only"], correct: "a",
      explanation: "Each needs its own honest screen.",
      wrong: { b: "Ignores the rest.", c: "Ignores empty and error.", d: "Ignores the rest." } }),
    q({ id: "rxq37-4", atom: "a-rx-race-conditions", d: 3, prompt: "How does an ignore flag prevent a race condition?", options: ["The old effect's cleanup sets it, so a late response from an old query does not update state", "It cancels the network", "It makes requests faster", "It sorts the responses"], correct: "a",
      explanation: "Only the latest effect's response is applied. AbortController also cancels.",
      wrong: { b: "That is AbortController.", c: "Unrelated.", d: "Unrelated." } }),
  ]),

  ...check("rx-l38-refs-custom", [
    q({ id: "rxq38-1", atom: "a-rx-useref", d: 2, prompt: "What happens when you change ref.current?", options: ["The value changes immediately, and nothing re-renders", "The component re-renders", "React throws", "It resets on the next render"], correct: "a",
      explanation: "Refs remember without rendering.",
      wrong: { b: "Only state does that.", c: "Allowed in handlers and effects.", d: "It persists." } }),
    q({ id: "rxq38-2", atom: "a-rx-useref", d: 2, prompt: "Which should be a ref rather than state?", options: ["An interval id the screen never shows", "The text in a search box", "Whether a modal is open", "The list of items"], correct: "a",
      explanation: "If it is not on screen, a ref is enough.",
      wrong: { b: "Shown on screen: state.", c: "Changes what is shown: state.", d: "Shown on screen: state." } }),
    q({ id: "rxq38-3", atom: "a-rx-custom-hooks", d: 2, prompt: "Two components call useLocalStorage(\"theme\", \"light\"). Do they share one state value?", options: ["No: each call has its own state; a custom Hook shares logic, not state", "Yes, always", "Only if they are siblings", "Only in production"], correct: "a",
      explanation: "Sharing state needs lifting or Context (Module 7).",
      wrong: { b: "Each call is independent.", c: "Position does not matter.", d: "Same in every mode." } }),
    q({ id: "rxq38-4", atom: "a-rx-custom-hooks", d: 1, prompt: "What must a custom Hook's name start with?", options: ["use", "hook", "get", "Anything"], correct: "a",
      explanation: "The prefix lets the lint rules check it.",
      wrong: { b: "Convention is use.", c: "That is not a Hook name.", d: "It must start with use." } }),
  ]),

  ...check("rx-l39-effect-mistakes", [
    q({ id: "rxq39-1", atom: "a-rx-unneeded-effects", d: 3, prompt: "An effect watches items and calls setVisible(items.filter(…)). What is better?", options: ["Calculate visible during render", "Add more dependencies", "Use useLayoutEffect", "Store visible in a ref"], correct: "a",
      explanation: "Derived data does not need an effect or state.",
      wrong: { b: "Still an unnecessary effect.", c: "Same problem.", d: "Then it would not render." } }),
    q({ id: "rxq39-2", atom: "a-rx-unneeded-effects", d: 2, prompt: "Where should a \"send order\" POST go?", options: ["In the Buy button's click handler", "In an effect watching a \"bought\" flag", "In the render body", "In a reducer"], correct: "a",
      explanation: "User events belong in handlers.",
      wrong: { b: "Indirect and easy to trigger twice.", c: "Rendering must be pure.", d: "Reducers must be pure." } }),
    q({ id: "rxq39-3", atom: "a-rx-usememo-usecallback", d: 2, prompt: "What does useMemo(() => compute(x), [x]) do?", options: ["Reuses the last result until x changes", "Runs compute in a separate thread", "Saves the result to localStorage", "Makes compute asynchronous"], correct: "a",
      explanation: "A cache keyed on the dependencies.",
      wrong: { b: "It runs on the main thread.", c: "In memory only.", d: "Still synchronous." } }),
    q({ id: "rxq39-4", atom: "a-rx-premature-memo", d: 2, prompt: "When should you add useMemo or useCallback?", options: ["When profiling shows a real bottleneck they fix", "Around every function and calculation", "Never", "Only in class components"], correct: "a",
      explanation: "Measure first.",
      wrong: { b: "Adds cost and bugs.", c: "They have real uses.", d: "Hooks do not work in classes." } }),
  ]),

  ...check("rx-l40-m6-project", [
    q({ id: "rxq40-1", atom: "a-rx-m6-project", d: 2, prompt: "Why put the fetching in useUsers instead of the component?", options: ["The component only renders; the logic is named, reusable and testable", "Hooks run faster", "Components cannot fetch", "It removes the need for state"], correct: "a",
      explanation: "Separation of concerns.",
      wrong: { b: "Not about speed.", c: "They can.", d: "The Hook still uses state." } }),
    q({ id: "rxq40-2", atom: "a-rx-m6-project", d: 2, prompt: "Why is the role filter calculated during render instead of fetched?", options: ["The data is already loaded; filtering it is a derived value", "The API cannot filter", "Selects cannot trigger requests", "It must be stored in state"], correct: "a",
      explanation: "Derive what you can.",
      wrong: { b: "It might, but there is no need.", c: "They can.", d: "Derived values need no state." } }),
    q({ id: "rxq40-3", atom: "a-rx-m6-project", d: 3, prompt: "What is the difference between a ref and state?", options: ["Changing state re-renders; changing a ref does not", "Refs are global", "State cannot hold objects", "There is no difference"], correct: "a",
      explanation: "State is for what you see; refs for what you remember.",
      wrong: { b: "Each component has its own ref.", c: "It can.", d: "Rendering differs." } }),
    q({ id: "rxq40-4", atom: "a-rx-m6-project", d: 3, prompt: "Typing quickly in the directory search shows old results. What is missing?", options: ["An ignore flag (or AbortController) in the effect's cleanup", "A key on the input", "useMemo on the list", "A longer delay on the server"], correct: "a",
      explanation: "Stale responses must be dropped.",
      wrong: { b: "Unrelated.", c: "Unrelated.", d: "Does not fix the order." } }),
  ]),
};
