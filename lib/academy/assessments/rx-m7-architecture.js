/**
 * ASSESSMENTS · REACT DEVELOPMENT · MODULE 7 · COMPONENT ARCHITECTURE AND STATE MANAGEMENT
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Never import this from anything under src/.
 * ═════════════════════════════════════════════════════════════════════════
 */

import { q, check } from "./rx-helpers.js";

export const ASSESSMENTS = {
  ...check("rx-l41-boundaries", [
    q({ id: "rxq41-1", atom: "a-rx-hierarchy", d: 2, prompt: "Which direction should dependencies point in a well-structured app?", options: ["Features depend on shared UI; shared UI never imports from features", "Shared UI imports from features", "Every file imports every other", "Features import each other freely"], correct: "a",
      explanation: "Shared pieces stay reusable.",
      wrong: { b: "Couples shared UI to one feature.", c: "Unmaintainable.", d: "Creates tangles." } }),
    q({ id: "rxq41-2", atom: "a-rx-presentational-logic", d: 2, prompt: "What does a presentational component do?", options: ["Turns props into JSX, without fetching or business rules", "Fetches data and stores it", "Manages global state", "Talks to the database"], correct: "a",
      explanation: "Easy to reuse and test with any data.",
      wrong: { b: "That is a logic component or Hook.", c: "Not its job.", d: "Never in the browser." } }),
    q({ id: "rxq41-3", atom: "a-rx-local-vs-global", d: 2, prompt: "Where should state start?", options: ["As local as possible, in the component that uses it", "In a global store", "In localStorage", "In the URL"], correct: "a",
      explanation: "Lift or globalise only when needed.",
      wrong: { b: "Only for truly app-wide data.", c: "Only for persistence.", d: "Only for shareable view state." } }),
    q({ id: "rxq41-4", atom: "a-rx-presentational-logic", d: 2, prompt: "Today, where does a logic component's fetching and state usually live?", options: ["In a custom Hook the component calls", "In the presentational component", "In CSS", "In index.html"], correct: "a",
      explanation: "The container shrinks to a call to the Hook.",
      wrong: { b: "Keep presentational components pure.", c: "Unrelated.", d: "Unrelated." } }),
  ]),

  ...check("rx-l42-context", [
    q({ id: "rxq42-1", atom: "a-rx-prop-drilling", d: 2, prompt: "What is prop drilling?", options: ["Passing a prop through components that do not use it, to reach a nested one", "Passing too many props to one component", "Changing props in a child", "Using props in effects"], correct: "a",
      explanation: "Fine for a level or two; noisy beyond that.",
      wrong: { b: "Related but different.", c: "Props are read-only.", d: "Unrelated." } }),
    q({ id: "rxq42-2", atom: "a-rx-prop-drilling", d: 3, prompt: "Before using Context to avoid drilling, what simpler technique should you try?", options: ["Composition: pass the finished child element as children or a prop", "A global variable", "Copying the value into every component", "useMemo"], correct: "a",
      explanation: "The middle layers never see the value.",
      wrong: { b: "Does not re-render.", c: "Copies go stale.", d: "Unrelated." } }),
    q({ id: "rxq42-3", atom: "a-rx-context", d: 2, prompt: "What happens when a context's provided value changes?", options: ["Every component that reads it with useContext re-renders", "Nothing until the page reloads", "Only the provider re-renders", "The context resets to its default"], correct: "a",
      explanation: "Readers subscribe automatically.",
      wrong: { b: "It is live.", c: "Readers re-render too.", d: "The default is used only without a provider." } }),
    q({ id: "rxq42-4", atom: "a-rx-context", d: 2, prompt: "When is the argument to createContext(defaultValue) used?", options: ["When a component reads the context with no provider above it", "Always", "When the provider's value is null", "Only in tests"], correct: "a",
      explanation: "It is the fallback.",
      wrong: { b: "Providers override it.", c: "null is a provided value.", d: "Anywhere without a provider." } }),
  ]),

  ...check("rx-l43-reducer-context", [
    q({ id: "rxq43-1", atom: "a-rx-action-transitions", d: 2, prompt: "Which action name follows the recommended style?", options: ["\"paymentFailed\"", "\"setError\"", "\"updateState\"", "\"doStuff\""], correct: "a",
      explanation: "Describe what happened; let the reducer decide the change.",
      wrong: { b: "A command to set a field.", c: "Says nothing.", d: "Says nothing." } }),
    q({ id: "rxq43-2", atom: "a-rx-action-transitions", d: 3, prompt: "How does a reducer prevent an impossible transition, such as Back from \"done\"?", options: ["It returns the state unchanged for that action in that state", "It throws an error to the user", "It reloads the page", "It cannot"], correct: "a",
      explanation: "Ignored transitions are just state returned as it is.",
      wrong: { b: "Throwing is for unknown actions.", c: "No.", d: "It can." } }),
    q({ id: "rxq43-3", atom: "a-rx-context-reducer", d: 3, prompt: "Why provide state and dispatch in two separate contexts?", options: ["Components that only dispatch do not re-render when the state changes", "React requires it", "dispatch cannot go in a context with state", "It saves memory"], correct: "a",
      explanation: "dispatch never changes identity.",
      wrong: { b: "Optional.", c: "It can.", d: "Not the reason." } }),
    q({ id: "rxq43-4", atom: "a-rx-context-reducer", d: 2, prompt: "What should a file sharing a reducer through Context export?", options: ["The provider component and custom Hooks such as useTasks and useTasksDispatch", "The raw context objects only", "The reducer's internal state variable", "Nothing"], correct: "a",
      explanation: "Components never touch the context objects directly.",
      wrong: { b: "Hooks give a cleaner API.", c: "Not exportable.", d: "Components need access." } }),
  ]),

  ...check("rx-l44-state-design", [
    q({ id: "rxq44-1", atom: "a-rx-state-shape", d: 2, prompt: "isSending and isSent as two booleans: what is the risk?", options: ["They can both be true, a state that makes no sense", "Booleans are slow", "React allows only one boolean", "No risk"], correct: "a",
      explanation: "Use one status value.",
      wrong: { b: "Not about speed.", c: "Not true.", d: "Contradictions are the risk." } }),
    q({ id: "rxq44-2", atom: "a-rx-state-shape", d: 3, prompt: "What is normalised state?", options: ["Records stored flat and keyed by id, instead of nested copies", "State converted to strings", "State saved to the server", "State with default values"], correct: "a",
      explanation: "Easier immutable updates and no duplicates.",
      wrong: { b: "Unrelated.", c: "Unrelated.", d: "Unrelated." } }),
    q({ id: "rxq44-3", atom: "a-rx-ui-vs-server", d: 2, prompt: "Which is server data rather than UI state?", options: ["The user's order history", "Whether the mobile menu is open", "The selected tab", "Text typed in a search box"], correct: "a",
      explanation: "The server owns it and it can go stale.",
      wrong: { b: "UI state.", c: "UI state.", d: "UI state." } }),
    q({ id: "rxq44-4", atom: "a-rx-business-hooks", d: 2, prompt: "Why put a free-delivery rule in a custom Hook like useCartTotals?", options: ["Every component that shows money applies the same rule", "Hooks run faster than components", "Rules cannot go in components", "To avoid using state"], correct: "a",
      explanation: "One place for business rules.",
      wrong: { b: "Not about speed.", c: "They can, but then they get duplicated.", d: "Unrelated." } }),
  ]),

  ...check("rx-l45-stores", [
    q({ id: "rxq45-1", atom: "a-rx-choosing-state", d: 2, prompt: "Which state belongs in the URL's search params?", options: ["Filters and a page number a user may want to share or bookmark", "A password", "Whether a tooltip is hovered", "A half-typed comment"], correct: "a",
      explanation: "URLs are shareable state.",
      wrong: { b: "Never put secrets in URLs.", c: "Too fleeting.", d: "Local state." } }),
    q({ id: "rxq45-2", atom: "a-rx-zustand", d: 2, prompt: "In Zustand, what does useCart((s) => s.items.length) give a component?", options: ["Just that value, re-rendering only when it changes", "The whole store, re-rendering on every change", "A copy of the items", "A Context provider"], correct: "a",
      explanation: "Selectors subscribe to a slice.",
      wrong: { b: "Only the selected slice.", c: "A number.", d: "Zustand needs no provider." } }),
    q({ id: "rxq45-3", atom: "a-rx-zustand", d: 3, prompt: "Redux Toolkit reducers write state.items.push(x). Why is that allowed there?", options: ["Immer records the changes and produces a new immutable state", "Redux allows mutation", "push is immutable in Redux", "It is not allowed"], correct: "a",
      explanation: "createSlice uses Immer.",
      wrong: { b: "The result is still immutable.", c: "push always mutates; Immer handles it.", d: "Inside createSlice it is fine." } }),
    q({ id: "rxq45-4", atom: "a-rx-avoid-global", d: 2, prompt: "A store value is read by only one screen. What should you do?", options: ["Move it into that screen's components as local state", "Leave it in case it is needed later", "Copy it to Context too", "Save it in localStorage"], correct: "a",
      explanation: "If only one screen reads it, it is not global.",
      wrong: { b: "\"Just in case\" fills stores.", c: "More global state.", d: "Unrelated." } }),
  ]),

  ...check("rx-l46-m7-project", [
    q({ id: "rxq46-1", atom: "a-rx-m7-project", d: 2, prompt: "Why store cart lines as { id, qty } instead of whole product objects?", options: ["Names and prices stay in one place, the product data, so they cannot go stale", "Objects cannot go in localStorage", "It is required by useReducer", "It makes the cart slower"], correct: "a",
      explanation: "Store ids, look up the rest.",
      wrong: { b: "They can, as JSON.", c: "Not required.", d: "Not the reason." } }),
    q({ id: "rxq46-2", atom: "a-rx-m7-project", d: 3, prompt: "Where should a cart be loaded from localStorage?", options: ["When the initial state is created, for example useReducer's init function", "In every component's render", "In an effect that sets state after the first render", "In the click handlers"], correct: "a",
      explanation: "Lazy initial state: read once, no flash of an empty cart.",
      wrong: { b: "Reads storage every render.", c: "Renders empty first, then the cart.", d: "Too late." } }),
    q({ id: "rxq46-3", atom: "a-rx-m7-project", d: 2, prompt: "Which justifies a store like Zustand over Context for a cart?", options: ["Many distant components read small slices that change often", "The app has two components", "The cart never changes", "Context cannot hold arrays"], correct: "a",
      explanation: "Selectors avoid re-rendering everything.",
      wrong: { b: "Local or lifted state is enough.", c: "Then a constant would do.", d: "It can." } }),
    q({ id: "rxq46-4", atom: "a-rx-m7-project", d: 2, prompt: "Where should the cart's subtotal be calculated?", options: ["During render, from the cart lines and product prices", "In its own state, updated by every action", "On the server for every click", "In localStorage"], correct: "a",
      explanation: "Derived values are not state.",
      wrong: { b: "Can drift out of sync.", c: "Unnecessary for display.", d: "Storage is not a calculator." } }),
  ]),
};
