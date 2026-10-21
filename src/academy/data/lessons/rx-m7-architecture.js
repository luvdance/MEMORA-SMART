/**
 * REACT DEVELOPMENT · MODULE 7 · COMPONENT ARCHITECTURE AND STATE MANAGEMENT
 *
 * Curriculum 7.1 – 7.P. Hierarchies and boundaries, presentational and logic
 * components, local versus shared state, prop drilling, Context, reducers,
 * Context with useReducer, state shape, UI state versus server data, custom
 * Hooks for business logic, choosing a tool, Zustand (bundled in the lab
 * runtime; Redux Toolkit shown for comparison) and avoiding global state.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

import { reactLab } from "./rx-helpers.js";

export const SECTION_ID = "rx-s7-architecture";
const MODULE = "rx-m7-architecture";

const PRODUCTS = `export const products = [
  { id: "p1", name: "Ankara tote bag", price: 7500 },
  { id: "p2", name: "Leather sandals", price: 18000 },
  { id: "p3", name: "Beaded bracelet", price: 3000 },
];

export const naira = (n) => "₦" + n.toLocaleString("en-NG");
`;

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 41 · 7.1 – 7.3
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "rx-l41-boundaries",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 1,
    covers: ["7.1", "7.2", "7.3"],
    title: "Component Hierarchy and Boundaries",
    subtitle: "Where an app divides, presentational and logic components, and local versus shared state",
    estimatedMinutes: 30,
    intro: "Small apps survive any structure. Large ones live or die by where the boundaries are: which components own data, which only show it, and how far each piece of state reaches.",

    atoms: [
      {
        id: "a-rx-hierarchy",
        title: "Component hierarchy and application boundaries",
        explain:
          "Draw the app as a tree before building it. The top levels are BOUNDARIES: the app shell (layout, navigation, providers), then PAGES or FEATURES (catalogue, cart, profile), each owning its own data and state, then shared UI components (Button, Card) that know nothing about any feature. A feature should be understandable in its own folder (src/features/cart/ with its components, Hooks and API calls). Dependencies point downwards: features use shared UI; shared UI never imports from a feature; one feature reaches another only through the app's shared state or the URL.",
        decision: {
          scenario: "Button.jsx, a shared component used across the app, imports useCart from src/features/cart/ to show a cart badge when its label is \"Checkout\".",
          question: "What is the problem?",
          options: [
            { id: "a", text: "A shared component now depends on a feature, so every page using Button is tied to the cart", why: "Shared UI must not know about features. Pass the badge in as a prop or children from the cart feature instead." },
            { id: "b", text: "There is no problem; it saves code", whyWrong: "It couples every button to the cart feature and makes Button impossible to reuse or test alone." },
            { id: "c", text: "Buttons cannot use Hooks", whyWrong: "They can; the problem is the direction of the dependency." },
            { id: "d", text: "The label should be lower case", whyWrong: "Unrelated." },
          ],
          correct: "a",
          aftermath: "Features depend on shared UI, never the other way round.",
        },
      },
      {
        id: "a-rx-presentational-logic",
        title: "Presentational and logic-oriented components",
        explain:
          "A PRESENTATIONAL component turns props into JSX: no fetching, no business rules, often no state beyond UI details like \"is this tooltip open\". A LOGIC component (sometimes called a container) owns data and behaviour: it fetches, holds state, applies rules, and renders presentational components with the results. Today the logic usually lives in a custom Hook, and the \"container\" is just a small component calling it. The payoff: presentational components are easy to reuse, restyle and test with any data, including in a design catalogue such as Storybook.",
        webLab: reactLab({
          task:
            "OrderHistory both fetches and renders. Split it: move the markup into a presentational OrderList component (src/components/OrderList.jsx) that takes orders and renders the <ul>; keep the fetching in OrderHistory, which renders <OrderList orders={orders} />. OrderList must not fetch or hold state.",
          files: {
            "src/App.jsx": `import { useEffect, useState } from "react";

function OrderHistory() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    let ignore = false;
    fetch("/api/orders")
      .then((r) => r.json())
      .then((data) => {
        if (!ignore) setOrders(data);
      });
    return () => {
      ignore = true;
    };
  }, []);

  return (
    <ul className="orders">
      {orders.map((o) => (
        <li key={o.id}>
          {o.id}: {o.status}
        </li>
      ))}
    </ul>
  );
}

export default function App() {
  return <OrderHistory />;
}
`,
            "src/components/OrderList.jsx": "",
          },
          mocks: [{ match: "/api/orders", body: [{ id: "A17", status: "Delivered" }, { id: "B09", status: "Shipped" }], delay: 50 }],
          tests: [
            { label: "The orders still appear", check: "return await waitFor(() => $$('.orders li').map((li) => text(li)).join() === 'A17: Delivered,B09: Shipped');", fail: "OrderHistory renders <OrderList orders={orders} />." },
            { label: "OrderList is presentational", check: "const c = code('src/components/OrderList.jsx'); return /export\\s+default\\s+function\\s+OrderList\\s*\\(\\s*\\{\\s*orders\\s*\\}/.test(c) && !/useState|useEffect|fetch\\(/.test(c);", fail: "export default function OrderList({ orders }) with only JSX." },
            { label: "The fetching stays in OrderHistory", check: "const c = code('src/App.jsx'); return /fetch\\(/.test(c) && /<OrderList\\s+orders=\\{\\s*orders\\s*\\}/.test(c) && !/<ul/.test(c);", fail: "Remove the markup from App.jsx." },
          ],
          solution: {
            "src/components/OrderList.jsx": `export default function OrderList({ orders }) {
  return (
    <ul className="orders">
      {orders.map((o) => (
        <li key={o.id}>
          {o.id}: {o.status}
        </li>
      ))}
    </ul>
  );
}
`,
            "src/App.jsx": `import { useEffect, useState } from "react";
import OrderList from "./components/OrderList.jsx";

function OrderHistory() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    let ignore = false;
    fetch("/api/orders")
      .then((r) => r.json())
      .then((data) => {
        if (!ignore) setOrders(data);
      });
    return () => {
      ignore = true;
    };
  }, []);

  return <OrderList orders={orders} />;
}

export default function App() {
  return <OrderHistory />;
}
`,
          },
          hint: "Cut the <ul> into the new file; leave the state and effect where they are.",
          successMessage: "One component knows where orders come from; the other only how they look.",
        }),
      },
      {
        id: "a-rx-local-vs-global",
        title: "Lifting state versus sharing state globally",
        explain:
          "Start every piece of state as LOCAL as possible: in the component that uses it. If siblings need it, LIFT it to their common parent (Module 4). Only when many components in distant parts of the tree need the same data (the signed-in user, the theme, the cart, the language) does it become GLOBAL: shared through Context or a store. Global state is convenient but costly: any component can change it, so it is harder to trace who changed what, and changes can re-render large parts of the app.",
        decision: {
          scenario: "A product page has an image gallery. Only the gallery and its thumbnail strip, both inside ProductPage, need to know which image is selected.",
          question: "Where should selectedImage live?",
          options: [
            { id: "a", text: "In the closest common parent of the gallery and thumbnails, inside ProductPage", why: "Only two nearby components need it; lifting a short way is enough and keeps it easy to trace." },
            { id: "b", text: "In a global store, in case other pages need it", whyWrong: "Nothing else needs it. \"In case\" is how stores fill with state nobody can trace." },
            { id: "c", text: "In localStorage", whyWrong: "It is temporary UI state; nobody expects it to survive a reload." },
            { id: "d", text: "Duplicated in both components", whyWrong: "Two copies will disagree." },
          ],
          correct: "a",
          aftermath: "Local first, lifted when shared, global only when truly app-wide.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 42 · 7.4 – 7.5
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "rx-l42-context",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 2,
    covers: ["7.4", "7.5"],
    title: "Prop Drilling and Context",
    subtitle: "When passing props through many layers becomes a problem, and createContext and useContext",
    estimatedMinutes: 35,
    intro: "Props are explicit, which is good. But when a value must travel through five components that never use it, the explicitness becomes noise. Context is React's answer.",

    atoms: [
      {
        id: "a-rx-prop-drilling",
        title: "Prop drilling: what it is and when it becomes a problem",
        explain:
          "PROP DRILLING is passing a prop through components that do not use it, only to reach a deeply nested one: App → Layout → Sidebar → Menu → UserAvatar, with user passed at every step. Two or three levels is fine, and often clearer than anything else. It becomes a problem when many intermediate components are forced to accept and forward props they do not care about, when renaming the prop means editing every layer, and when the same value is drilled to many different places. Before reaching for Context, try COMPOSITION: pass the finished <UserAvatar user={user} /> as children or a prop, so the middle layers never see user at all.",
        example: "// Drilling: Layout and Sidebar only forward user\n<Layout user={user} />\nfunction Layout({ user }) { return <Sidebar user={user} />; }\nfunction Sidebar({ user }) { return <Menu user={user} />; }\n\n// Composition: the middle layers never see user\n<Layout sidebar={<Menu avatar={<UserAvatar user={user} />} />} />",
        decision: {
          scenario: "The theme (light or dark) is needed by 40 components across every page, and is currently drilled through up to six levels.",
          question: "What is the most appropriate fix?",
          options: [
            { id: "a", text: "Provide the theme with Context near the root and read it with useContext where needed", why: "Truly app-wide, widely read data is exactly what Context is for." },
            { id: "b", text: "Keep drilling: explicit is always better", whyWrong: "At this scale the drilling is pure noise in dozens of components." },
            { id: "c", text: "Store the theme in a global variable", whyWrong: "Changing a global variable does not re-render anything." },
            { id: "d", text: "Copy the theme into each component's own state", whyWrong: "Forty copies that cannot change together." },
          ],
          correct: "a",
          aftermath: "Drill a little; compose when you can; use Context for app-wide values.",
        },
      },
      {
        id: "a-rx-context",
        title: "Context API with createContext and useContext",
        explain:
          "1. CREATE: export const ThemeContext = createContext(\"light\") (the argument is the default when no provider is above). 2. PROVIDE: wrap part of the tree: <ThemeContext value={theme}>…</ThemeContext> (React 19; older code writes ThemeContext.Provider). 3. CONSUME anywhere below: const theme = useContext(ThemeContext). When the provided value changes, every component that reads it re-renders. Usually you provide state and its setter together, and export a custom Hook (useTheme) so components never touch the context object directly. Context is not a store: it passes a value down, nothing more.",
        webLab: reactLab({
          task:
            "The user is drilled through Layout and Sidebar, which never use it. Create a UserContext in src/UserContext.jsx, provide the user in App, and read it with useContext in Greeting and Avatar. Remove the user prop from Layout and Sidebar.",
          files: {
            "src/UserContext.jsx": `import { createContext } from "react";

// export const UserContext = …
`,
            "src/App.jsx": `const ada = { name: "Ada Obi", initials: "AO" };

function Avatar({ user }) {
  return <span className="avatar">{user.initials}</span>;
}

function Greeting({ user }) {
  return <h1>Welcome, {user.name}</h1>;
}

function Sidebar({ user }) {
  return (
    <aside>
      <Avatar user={user} />
    </aside>
  );
}

function Layout({ user }) {
  return (
    <div className="layout">
      <Sidebar user={user} />
      <main>
        <Greeting user={user} />
      </main>
    </div>
  );
}

export default function App() {
  return <Layout user={ada} />;
}
`,
          },
          tests: [
            { label: "Greeting and Avatar still show the user", check: "return text('h1') === 'Welcome, Ada Obi' && text('.avatar') === 'AO';", fail: "Provide the user and read it with useContext(UserContext)." },
            { label: "The context is created and exported", check: "return /export\\s+const\\s+UserContext\\s*=\\s*createContext\\(/.test(code('src/UserContext.jsx'));", fail: "export const UserContext = createContext(null);" },
            { label: "No more drilling through Layout and Sidebar", check: "const c = code('src/App.jsx'); return /useContext\\(\\s*UserContext\\s*\\)/.test(c) && !/function\\s+(Layout|Sidebar)\\s*\\(\\s*\\{\\s*user/.test(c) && !/user=\\{/.test(c);", fail: "Remove every user={…} prop." },
          ],
          solution: {
            "src/UserContext.jsx": `import { createContext } from "react";

export const UserContext = createContext(null);
`,
            "src/App.jsx": `import { useContext } from "react";
import { UserContext } from "./UserContext.jsx";

const ada = { name: "Ada Obi", initials: "AO" };

function Avatar() {
  const user = useContext(UserContext);
  return <span className="avatar">{user.initials}</span>;
}

function Greeting() {
  const user = useContext(UserContext);
  return <h1>Welcome, {user.name}</h1>;
}

function Sidebar() {
  return (
    <aside>
      <Avatar />
    </aside>
  );
}

function Layout() {
  return (
    <div className="layout">
      <Sidebar />
      <main>
        <Greeting />
      </main>
    </div>
  );
}

export default function App() {
  return (
    <UserContext value={ada}>
      <Layout />
    </UserContext>
  );
}
`,
          },
          hint: "In React 19 the context itself is the provider: <UserContext value={ada}>.",
          successMessage: "The middle layers are clean again, and the user is still exactly one value.",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 43 · 7.6 – 7.7
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "rx-l43-reducer-context",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 3,
    covers: ["7.6", "7.7"],
    title: "Reducers and Context Together",
    subtitle: "Action-based state transitions, and sharing a reducer through Context",
    estimatedMinutes: 40,
    intro: "Module 6 introduced useReducer. Combined with Context it becomes a complete, dependency-free way to share and update app-wide state.",

    atoms: [
      {
        id: "a-rx-action-transitions",
        title: "Reducers and action-based state transitions",
        explain:
          "Think of state as a STATE MACHINE: a set of states and the actions that move between them. A checkout is \"cart\" → \"details\" → \"payment\" → \"done\"; \"back\" moves one step back; \"payment failed\" returns to \"payment\" with an error. A reducer makes those transitions explicit and makes impossible ones impossible: the reducer simply ignores \"next\" from \"done\". Name actions in the past tense after what HAPPENED (\"itemAdded\", \"paymentFailed\"), not as commands to set fields (\"setStep\"), so the reducer, not every caller, decides what the change means.",
        webLab: reactLab({
          task:
            "Write checkoutReducer in checkout.js. State is { step, error }, steps in order \"cart\", \"details\", \"payment\", \"done\". Actions: \"next\" moves forward one step (no further than \"done\") and clears the error; \"back\" moves back one step (not before \"cart\", and never back from \"done\"); \"paymentFailed\" (only from \"payment\") keeps the step and sets error to action.message. Unknown actions throw.",
          files: {
            "src/checkout.js": `export const STEPS = ["cart", "details", "payment", "done"];

export function checkoutReducer(state, action) {
  return state;
}
`,
            "src/App.jsx": `import { useReducer } from "react";
import { checkoutReducer } from "./checkout.js";

export default function App() {
  const [state, dispatch] = useReducer(checkoutReducer, { step: "cart", error: null });
  return (
    <>
      <p className="step">Step: {state.step}</p>
      {state.error && <p role="alert">{state.error}</p>}
      <button onClick={() => dispatch({ type: "back" })}>Back</button>
      <button onClick={() => dispatch({ type: "next" })}>Next</button>
      <button onClick={() => dispatch({ type: "paymentFailed", message: "Card declined" })}>Fail payment</button>
    </>
  );
}
`,
          },
          readOnly: ["src/App.jsx"],
          tests: [
            { label: "Next and Back move through the steps", check: "const b = (n) => $$('button').find((x) => text(x) === n); await click(b('Next')); await click(b('Next')); const a = text('.step') === 'Step: payment'; await click(b('Back')); return a && text('.step') === 'Step: details';", fail: "Use the index in STEPS." },
            { label: "Back stops at cart", check: "const b = (n) => $$('button').find((x) => text(x) === n); await click(b('Back')); await click(b('Back')); return text('.step') === 'Step: cart';", fail: "Never go below index 0." },
            { label: "A failed payment shows an error only on the payment step", check: "const b = (n) => $$('button').find((x) => text(x) === n); await click(b('Fail payment')); const none = !$('[role=alert]'); await click(b('Next')); await click(b('Next')); await click(b('Fail payment')); return none && text('.step') === 'Step: payment' && text('[role=alert]') === 'Card declined';", fail: "Only set the error when state.step is \"payment\"." },
            { label: "Next clears the error, stops at done, and Back cannot leave done", check: "const b = (n) => $$('button').find((x) => text(x) === n); await click(b('Next')); const cleared = !$('[role=alert]') && text('.step') === 'Step: done'; await click(b('Next')); await click(b('Back')); return cleared && text('.step') === 'Step: done';", fail: "Clear the error on next; ignore back from done." },
            { label: "Unknown actions throw", check: "const m = await import('data:text/javascript;charset=utf-8,' + encodeURIComponent(raw('src/checkout.js'))); try { m.checkoutReducer({ step: 'cart', error: null }, { type: 'nope' }); return false; } catch { return true; }", fail: "throw new Error(\"Unknown action\") in default." },
          ],
          solution: {
            "src/checkout.js": `export const STEPS = ["cart", "details", "payment", "done"];

export function checkoutReducer(state, action) {
  const i = STEPS.indexOf(state.step);
  switch (action.type) {
    case "next":
      return { step: STEPS[Math.min(i + 1, STEPS.length - 1)], error: null };
    case "back":
      if (state.step === "done") return state;
      return { ...state, step: STEPS[Math.max(i - 1, 0)] };
    case "paymentFailed":
      if (state.step !== "payment") return state;
      return { ...state, error: action.message };
    default:
      throw new Error("Unknown action: " + action.type);
  }
}
`,
          },
          hint: "Work with the step's index in STEPS, and return state unchanged for ignored transitions.",
          successMessage: "Every transition in one place, and the impossible ones simply do not happen.",
        }),
      },
      {
        id: "a-rx-context-reducer",
        title: "Combining Context and useReducer",
        explain:
          "The pattern for app-wide state without a library: a PROVIDER component calls useReducer and provides state and dispatch through Context, often as two separate contexts so components that only dispatch do not re-render when state changes. Export the provider and two custom Hooks (useTasks and useTasksDispatch) from one file. Any component below the provider can read state or dispatch actions, and all the update logic still lives in one reducer.",
        webLab: reactLab({
          task:
            "Finish src/TasksContext.jsx: TasksProvider uses useReducer(tasksReducer, initialTasks) and provides tasks through TasksContext and dispatch through TasksDispatchContext; export useTasks() and useTasksDispatch() Hooks. AddTask and TaskList (already written) use them. Wrap the app in TasksProvider.",
          files: {
            "src/TasksContext.jsx": `import { createContext, useContext, useReducer } from "react";

const TasksContext = createContext(null);
const TasksDispatchContext = createContext(null);

const initialTasks = [{ id: 1, text: "Learn Context", done: false }];

function tasksReducer(tasks, action) {
  switch (action.type) {
    case "added":
      return [...tasks, { id: action.id, text: action.text, done: false }];
    case "toggled":
      return tasks.map((t) => (t.id === action.id ? { ...t, done: !t.done } : t));
    default:
      throw new Error("Unknown action: " + action.type);
  }
}

export function TasksProvider({ children }) {
  return children;
}

export function useTasks() {}
export function useTasksDispatch() {}
`,
            "src/App.jsx": `import { useState } from "react";
import { useTasks, useTasksDispatch } from "./TasksContext.jsx";

let nextId = 2;

function AddTask() {
  const [text, setText] = useState("");
  const dispatch = useTasksDispatch();
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        dispatch({ type: "added", id: nextId++, text });
        setText("");
      }}
    >
      <label htmlFor="t">New task</label>
      <input id="t" value={text} onChange={(e) => setText(e.target.value)} />
      <button>Add</button>
    </form>
  );
}

function TaskList() {
  const tasks = useTasks();
  const dispatch = useTasksDispatch();
  return (
    <ul>
      {tasks.map((t) => (
        <li key={t.id}>
          <label>
            <input type="checkbox" checked={t.done} onChange={() => dispatch({ type: "toggled", id: t.id })} /> {t.text}
          </label>
        </li>
      ))}
    </ul>
  );
}

export default function App() {
  return (
    <>
      <AddTask />
      <TaskList />
    </>
  );
}
`,
          },
          tests: [
            { label: "The initial task renders", check: "return text('li') === 'Learn Context';", fail: "Provide the reducer's state, and wrap App's content in <TasksProvider>." },
            { label: "Adding from one component shows in another", check: "await type('#t', 'Use a reducer'); await submit('form'); return $$('li').map((li) => text(li)).join() === 'Learn Context,Use a reducer';", fail: "useTasksDispatch() must return dispatch." },
            { label: "Toggling works", check: "await click('li input'); return $$('li input')[0].checked;", fail: "Provide dispatch through TasksDispatchContext." },
            { label: "Two contexts, read through the custom Hooks", check: "const c = code('src/TasksContext.jsx'); return /useReducer\\(\\s*tasksReducer/.test(c) && /<TasksContext\\b/.test(c) && /<TasksDispatchContext\\b/.test(c) && /useContext\\(\\s*TasksContext\\s*\\)/.test(c) && /<TasksProvider>/.test(code('src/App.jsx'));", fail: "Provide each through its own context, read with useContext in the Hooks." },
          ],
          solution: {
            "src/TasksContext.jsx": `import { createContext, useContext, useReducer } from "react";

const TasksContext = createContext(null);
const TasksDispatchContext = createContext(null);

const initialTasks = [{ id: 1, text: "Learn Context", done: false }];

function tasksReducer(tasks, action) {
  switch (action.type) {
    case "added":
      return [...tasks, { id: action.id, text: action.text, done: false }];
    case "toggled":
      return tasks.map((t) => (t.id === action.id ? { ...t, done: !t.done } : t));
    default:
      throw new Error("Unknown action: " + action.type);
  }
}

export function TasksProvider({ children }) {
  const [tasks, dispatch] = useReducer(tasksReducer, initialTasks);
  return (
    <TasksContext value={tasks}>
      <TasksDispatchContext value={dispatch}>{children}</TasksDispatchContext>
    </TasksContext>
  );
}

export function useTasks() {
  return useContext(TasksContext);
}

export function useTasksDispatch() {
  return useContext(TasksDispatchContext);
}
`,
            "src/App.jsx": `import { useState } from "react";
import { TasksProvider, useTasks, useTasksDispatch } from "./TasksContext.jsx";

let nextId = 2;

function AddTask() {
  const [text, setText] = useState("");
  const dispatch = useTasksDispatch();
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        dispatch({ type: "added", id: nextId++, text });
        setText("");
      }}
    >
      <label htmlFor="t">New task</label>
      <input id="t" value={text} onChange={(e) => setText(e.target.value)} />
      <button>Add</button>
    </form>
  );
}

function TaskList() {
  const tasks = useTasks();
  const dispatch = useTasksDispatch();
  return (
    <ul>
      {tasks.map((t) => (
        <li key={t.id}>
          <label>
            <input type="checkbox" checked={t.done} onChange={() => dispatch({ type: "toggled", id: t.id })} /> {t.text}
          </label>
        </li>
      ))}
    </ul>
  );
}

export default function App() {
  return (
    <TasksProvider>
      <AddTask />
      <TaskList />
    </TasksProvider>
  );
}
`,
          },
          hint: "The provider renders both contexts, one inside the other, around children.",
          successMessage: "Shared state, one reducer, and components that only ask for what they use.",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 44 · 7.8 – 7.10
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "rx-l44-state-design",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 4,
    covers: ["7.8", "7.9", "7.10"],
    title: "Designing State",
    subtitle: "A sensible state shape, UI state versus server data, and custom Hooks for business logic",
    estimatedMinutes: 35,
    intro: "Most state bugs are shape bugs: data stored twice, flags that contradict each other, server data treated like local data. Good shape prevents them.",

    atoms: [
      {
        id: "a-rx-state-shape",
        title: "Designing a sensible state shape",
        explain:
          "Principles from the React documentation: GROUP values that always change together (x and y into position). AVOID CONTRADICTIONS: isSending and isSent as two booleans can both be true; one status value cannot. AVOID REDUNDANCY: never store what you can calculate. AVOID DUPLICATION: store ids, not copies of objects. AVOID DEEP NESTING: deeply nested state is painful to update immutably; for related records, store them flat and keyed by id ({ byId: { p1: {...} }, ids: [\"p1\"] }), which is called NORMALISED state.",
        webLab: reactLab({
          task:
            "The upload widget uses three booleans that can contradict each other (it can show \"Uploading\" and \"Done\" at once). Replace them with ONE status value: \"idle\", \"uploading\", \"done\" or \"failed\". Upload goes to uploading then done (the fake upload is already written); Reset returns to idle; the paragraph shows exactly one message.",
          files: {
            "src/App.jsx": `import { useState } from "react";

const fakeUpload = () => new Promise((resolve) => setTimeout(resolve, 150));

export default function App() {
  const [isUploading, setIsUploading] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [isFailed, setIsFailed] = useState(false);

  async function upload() {
    setIsUploading(true);
    await fakeUpload();
    setIsDone(true);
  }

  function reset() {
    setIsDone(false);
  }

  return (
    <>
      <p className="msg">
        {isUploading && "Uploading… "}
        {isDone && "Done "}
        {isFailed && "Failed "}
        {!isUploading && !isDone && !isFailed && "Choose a file"}
      </p>
      <button onClick={upload}>Upload</button>
      <button onClick={reset}>Reset</button>
    </>
  );
}
`,
          },
          tests: [
            { label: "Idle at first", check: "return text('.msg') === 'Choose a file';", fail: "useState(\"idle\")" },
            { label: "Uploading, then only Done", check: "await click($$('button')[0]); const up = text('.msg') === 'Uploading…'; await wait(250); return up && text('.msg') === 'Done';", fail: "setStatus(\"uploading\"), then setStatus(\"done\")." },
            { label: "Reset returns to idle", check: "await click($$('button')[1]); return text('.msg') === 'Choose a file';", fail: "setStatus(\"idle\")" },
            { label: "One status value", check: "const c = code('src/App.jsx'); return (c.match(/useState\\(/g) || []).length === 1 && /useState\\(\\s*[\"']idle[\"']\\s*\\)/.test(c);", fail: "Replace the three booleans with one status." },
          ],
          solution: {
            "src/App.jsx": `import { useState } from "react";

const fakeUpload = () => new Promise((resolve) => setTimeout(resolve, 150));

const MESSAGES = { idle: "Choose a file", uploading: "Uploading…", done: "Done", failed: "Failed" };

export default function App() {
  const [status, setStatus] = useState("idle");

  async function upload() {
    setStatus("uploading");
    try {
      await fakeUpload();
      setStatus("done");
    } catch {
      setStatus("failed");
    }
  }

  return (
    <>
      <p className="msg">{MESSAGES[status]}</p>
      <button onClick={upload}>Upload</button>
      <button onClick={() => setStatus("idle")}>Reset</button>
    </>
  );
}
`,
          },
          hint: "A lookup object turns the status into its message.",
          successMessage: "Four states that cannot overlap, instead of eight combinations of booleans.",
        }),
      },
      {
        id: "a-rx-ui-vs-server",
        title: "Separating UI state from server data",
        explain:
          "UI STATE belongs to the browser: is the menu open, which tab is selected, what is typed in the search box. SERVER DATA (server state) is a copy of something the server owns: the products, the user's orders, their profile. Server data is different: it can be stale the moment you load it, other users change it, it needs loading and error states, caching, refetching and invalidation after you change it. Keeping it in useState or a global store means re-implementing all of that by hand. Use a server-state library for it (TanStack Query, Module 9) and keep stores and Context for genuine UI and session state.",
        decision: {
          scenario: "Your global store holds: the product list from the API, the cart, the theme, the open/closed state of the mobile menu, and the user's order history from the API.",
          question: "Which of these are server data, better handled by a tool like TanStack Query?",
          options: [
            { id: "a", text: "The product list and the order history", why: "Both are owned by the server, can go stale and need loading, caching and refetching." },
            { id: "b", text: "All five", whyWrong: "The theme and the menu are pure UI state; the cart here is client state until checkout." },
            { id: "c", text: "Only the theme", whyWrong: "The theme is a UI preference, not server data." },
            { id: "d", text: "None: everything belongs in one store", whyWrong: "Then the store must re-implement caching, staleness and refetching." },
          ],
          correct: "a",
          aftermath: "Server data in a server-state tool; UI state local or in a small store.",
        },
      },
      {
        id: "a-rx-business-hooks",
        title: "Custom Hooks for shared business logic",
        explain:
          "BUSINESS LOGIC is the rules of the domain: a 10% discount over ₦50,000, free delivery for orders over ₦30,000, a maximum of 5 of any item. Put it in a custom Hook (or plain functions the Hook uses), not scattered through components, so the cart page, the checkout summary and the header badge all apply the same rules. Return values and functions with domain names: { items, subtotal, discount, delivery, total, add, remove }. Components then read like the business: const { total } = useCartTotals(items).",
        webLab: reactLab({
          task:
            "Write useCartTotals(items) in src/hooks/useCartTotals.js returning { subtotal, discount, delivery, total }. Rules: subtotal is price × qty summed; 10% discount when the subtotal is ₦50,000 or more; delivery is ₦2,000, but free when the subtotal AFTER discount is ₦30,000 or more; total = subtotal − discount + delivery. CartSummary and Header both use the Hook.",
          files: {
            "src/hooks/useCartTotals.js": `export function useCartTotals(items) {
  return { subtotal: 0, discount: 0, delivery: 0, total: 0 };
}
`,
            "src/App.jsx": `import { useState } from "react";
import { useCartTotals } from "./hooks/useCartTotals.js";

const naira = (n) => "₦" + n.toLocaleString("en-NG");

function Header({ items }) {
  const { total } = useCartTotals(items);
  return <header className="badge">Cart: {naira(total)}</header>;
}

function CartSummary({ items }) {
  const t = useCartTotals(items);
  return (
    <dl>
      <dt>Subtotal</dt><dd className="subtotal">{naira(t.subtotal)}</dd>
      <dt>Discount</dt><dd className="discount">{naira(t.discount)}</dd>
      <dt>Delivery</dt><dd className="delivery">{naira(t.delivery)}</dd>
      <dt>Total</dt><dd className="total">{naira(t.total)}</dd>
    </dl>
  );
}

export default function App() {
  const [qty, setQty] = useState(1);
  const items = [{ id: "p2", price: 18000, qty }];
  return (
    <>
      <Header items={items} />
      <label htmlFor="qty">Sandals</label>
      <input id="qty" type="number" value={qty} onChange={(e) => setQty(Number(e.target.value))} />
      <CartSummary items={items} />
    </>
  );
}
`,
          },
          readOnly: ["src/App.jsx"],
          tests: [
            { label: "One item: delivery is charged", check: "return text('.subtotal') === '₦18,000' && text('.discount') === '₦0' && text('.delivery') === '₦2,000' && text('.total') === '₦20,000' && text('.badge') === 'Cart: ₦20,000';", fail: "subtotal 18,000 is under both thresholds." },
            { label: "Two items: free delivery, no discount", check: "await type('#qty', '2'); return text('.subtotal') === '₦36,000' && text('.discount') === '₦0' && text('.delivery') === '₦0' && text('.total') === '₦36,000';", fail: "Free delivery when subtotal − discount >= 30,000." },
            { label: "Three items: 10% discount and free delivery", check: "await type('#qty', '3'); return text('.subtotal') === '₦54,000' && text('.discount') === '₦5,400' && text('.delivery') === '₦0' && text('.total') === '₦48,600' && text('.badge') === 'Cart: ₦48,600';", fail: "discount = subtotal >= 50000 ? subtotal * 0.1 : 0" },
          ],
          solution: {
            "src/hooks/useCartTotals.js": `export function useCartTotals(items) {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const discount = subtotal >= 50000 ? subtotal * 0.1 : 0;
  const delivery = subtotal - discount >= 30000 || subtotal === 0 ? 0 : 2000;
  const total = subtotal - discount + delivery;
  return { subtotal, discount, delivery, total };
}
`,
          },
          hint: "Calculate in order: subtotal, discount, delivery (which depends on the discounted amount), total.",
          successMessage: "The rules live in one place; every component that shows money agrees.",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 45 · 7.11 – 7.13
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "rx-l45-stores",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 5,
    covers: ["7.11", "7.12", "7.13"],
    title: "Choosing a State Tool, and Zustand",
    subtitle: "Local state, Context or a store; Zustand and Redux Toolkit; and keeping global state small",
    estimatedMinutes: 35,
    intro: "There is no single right state tool, only a right tool for each kind of state. This lesson gives you the decision and one store library to try it with.",

    atoms: [
      {
        id: "a-rx-choosing-state",
        title: "Choosing local state, Context or a dedicated state library",
        explain:
          "A decision list. Used by one component: useState. Shared by a few nearby components: lift it. Read by many, changed rarely (theme, signed-in user, language): Context. Complex transitions: useReducer (with Context if shared). Changed often and read by many distant components (a cart, an editor, a dashboard's filters), where Context's re-render-everything-below behaviour hurts: a STORE library such as Zustand or Redux Toolkit, whose components subscribe to just the slice they read. Server data: TanStack Query. In the URL (filters, page, selected tab you want to share or bookmark): React Router's search params (Module 8).",
        decision: {
          scenario: "An analytics dashboard has 30 widgets. A date-range filter in the header and five other filters change often, and every widget reads one or two of them.",
          question: "What fits best?",
          options: [
            { id: "a", text: "A small store (such as Zustand) where each widget subscribes to only the filters it reads", why: "Frequent changes read by many distant components is the case stores are built for; each widget re-renders only for its slice." },
            { id: "b", text: "useState in each widget", whyWrong: "Thirty copies of the filters that the header cannot update." },
            { id: "c", text: "One Context holding all the filters", whyWrong: "It works, but every filter change re-renders all thirty widgets, even those that do not read it." },
            { id: "d", text: "localStorage, read by each widget on every render", whyWrong: "Nothing re-renders when it changes." },
          ],
          correct: "a",
          aftermath: "Match the tool to how the state is read and changed.",
        },
      },
      {
        id: "a-rx-zustand",
        title: "Introduction to Redux Toolkit or Zustand",
        explain:
          "ZUSTAND creates a store with a Hook: const useCart = create((set) => ({ items: [], add: (p) => set((s) => ({ items: [...s.items, p] })) })). Components call it with a SELECTOR that picks what they need: const count = useCart((s) => s.items.length); they re-render only when that value changes. No provider is needed. REDUX TOOLKIT (RTK) is the official, modern way to write Redux: createSlice defines state and reducers (written in a mutating style that Immer turns into immutable updates), configureStore builds the store, and react-redux's useSelector and useDispatch connect components. Redux brings strict conventions, DevTools time-travel and a large ecosystem; Zustand is smaller and quicker to learn. Both apply the same ideas as Context with useReducer.",
        example: "// Redux Toolkit, for comparison\nconst cartSlice = createSlice({\n  name: \"cart\",\n  initialState: { items: [] },\n  reducers: {\n    added(state, action) { state.items.push(action.payload); }, // Immer makes this immutable\n  },\n});\nexport const { added } = cartSlice.actions;\nexport const store = configureStore({ reducer: { cart: cartSlice.reducer } });\n// in a component: const count = useSelector((s) => s.cart.items.length);",
        webLab: reactLab({
          task:
            "Create a Zustand store in src/store.js: useCounter with count (start 0), increment() and reset(). Then make the two separate components share it: Display shows \"Count: N\" using a selector, and Controls has buttons that call increment and reset.",
          files: {
            "src/store.js": `import { create } from "zustand";

// export const useCounter = create(…)
`,
            "src/App.jsx": `function Display() {
  return <p className="count">Count: 0</p>;
}

function Controls() {
  return (
    <>
      <button>Increment</button>
      <button>Reset</button>
    </>
  );
}

export default function App() {
  return (
    <>
      <Display />
      <Controls />
    </>
  );
}
`,
          },
          tests: [
            { label: "Increment in one component updates the other", check: "await click($$('button')[0]); await click($$('button')[0]); return text('.count') === 'Count: 2';", fail: "const count = useCounter((s) => s.count); and onClick={increment}." },
            { label: "Reset sets it to 0", check: "await click($$('button')[1]); return text('.count') === 'Count: 0';", fail: "reset: () => set({ count: 0 })" },
            { label: "A Zustand store with selectors", check: "const s = code('src/store.js'); return /export\\s+const\\s+useCounter\\s*=\\s*create\\(/.test(s) && /useCounter\\(\\s*\\(?\\s*\\w+\\s*\\)?\\s*=>/.test(code('src/App.jsx'));", fail: "create((set) => ({ … })) and useCounter((s) => s.count)." },
          ],
          solution: {
            "src/store.js": `import { create } from "zustand";

export const useCounter = create((set) => ({
  count: 0,
  increment: () => set((s) => ({ count: s.count + 1 })),
  reset: () => set({ count: 0 }),
}));
`,
            "src/App.jsx": `import { useCounter } from "./store.js";

function Display() {
  const count = useCounter((s) => s.count);
  return <p className="count">Count: {count}</p>;
}

function Controls() {
  const increment = useCounter((s) => s.increment);
  const reset = useCounter((s) => s.reset);
  return (
    <>
      <button onClick={increment}>Increment</button>
      <button onClick={reset}>Reset</button>
    </>
  );
}

export default function App() {
  return (
    <>
      <Display />
      <Controls />
    </>
  );
}
`,
          },
          hint: "set((s) => ({ count: s.count + 1 })) is a functional update, like setState.",
          successMessage: "Shared state with no provider, and each component subscribes only to what it reads.",
        }),
      },
      {
        id: "a-rx-avoid-global",
        title: "Avoiding unnecessary global state",
        explain:
          "Once a store exists, everything drifts into it: whether a modal is open, a form's draft, the hovered row. That makes components depend on far-away code, makes them harder to reuse and test, and keeps data alive after the screen that needed it has gone (a half-filled form reappears next week). Keep global state for what is genuinely global; move the rest back into the component that owns it. A good test: if only one screen ever reads it, it is not global.",
        webLab: reactLab({
          task:
            "The store holds isDeleteDialogOpen, which only DeleteButton ever reads. Move it back into DeleteButton as local state and remove it from the store. The dialog must still open with Delete and close with Cancel.",
          files: {
            "src/store.js": `import { create } from "zustand";

export const useAppStore = create((set) => ({
  user: { name: "Ada" },
  isDeleteDialogOpen: false,
  setDeleteDialogOpen: (open) => set({ isDeleteDialogOpen: open }),
}));
`,
            "src/App.jsx": `import { useAppStore } from "./store.js";

function DeleteButton() {
  const open = useAppStore((s) => s.isDeleteDialogOpen);
  const setOpen = useAppStore((s) => s.setDeleteDialogOpen);
  return (
    <>
      <button onClick={() => setOpen(true)}>Delete</button>
      {open && (
        <div role="dialog" aria-label="Confirm delete">
          <p>Delete this course?</p>
          <button onClick={() => setOpen(false)}>Cancel</button>
        </div>
      )}
    </>
  );
}

export default function App() {
  const user = useAppStore((s) => s.user);
  return (
    <>
      <p>Signed in as {user.name}</p>
      <DeleteButton />
    </>
  );
}
`,
          },
          tests: [
            { label: "Delete opens the dialog, Cancel closes it", check: "await click($$('button').find((b) => text(b) === 'Delete')); const open = !!$('[role=dialog]'); await click($$('button').find((b) => text(b) === 'Cancel')); return open && !$('[role=dialog]');", fail: "const [open, setOpen] = useState(false); in DeleteButton." },
            { label: "The dialog state is no longer global", check: "return !/isDeleteDialogOpen|setDeleteDialogOpen/.test(code('src/store.js') + code('src/App.jsx')) && /useState/.test(code('src/App.jsx'));", fail: "Remove it from the store and use useState." },
            { label: "The user is still read from the store", check: "return text('#root p') === 'Signed in as Ada';", fail: "Keep user in the store." },
          ],
          solution: {
            "src/store.js": `import { create } from "zustand";

export const useAppStore = create(() => ({
  user: { name: "Ada" },
}));
`,
            "src/App.jsx": `import { useState } from "react";
import { useAppStore } from "./store.js";

function DeleteButton() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button onClick={() => setOpen(true)}>Delete</button>
      {open && (
        <div role="dialog" aria-label="Confirm delete">
          <p>Delete this course?</p>
          <button onClick={() => setOpen(false)}>Cancel</button>
        </div>
      )}
    </>
  );
}

export default function App() {
  const user = useAppStore((s) => s.user);
  return (
    <>
      <p>Signed in as {user.name}</p>
      <DeleteButton />
    </>
  );
}
`,
          },
          hint: "If only one component reads it, it belongs in that component.",
          successMessage: "The store holds what is global; the button owns its own dialog.",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 46 · 7.P
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "rx-l46-m7-project",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 6,
    covers: ["7.P"],
    title: "Practical: A Shopping Cart",
    subtitle: "Quantities, subtotals, persistence and cart state shared across the app",
    estimatedMinutes: 60,
    intro: "The Module 7 practical is the classic shared-state problem: a cart read by the header, changed from product cards, summarised on its own panel, and remembered after a reload.",

    atoms: [
      {
        id: "a-rx-m7-project",
        title: "Build the shopping cart",
        explain:
          "Choose your tool and be ready to justify it: Context with useReducer, or a Zustand store. Either way the update rules live in one place, the totals are derived, the cart is saved to localStorage under \"cart\" and read back on load, and the components only render and dispatch.",
        webLab: reactLab({
          task:
            "Build the shop with shared cart state in src/cart.jsx (Context + useReducer, or a Zustand store: your choice). Header shows <span className=\"cart-count\"> with the total quantity. Each product card (<article className=\"product\">) has an \"Add to cart\" button. The CartPanel lists each line as <li className=\"line\"> with the name, the quantity in <output>, + and − buttons (aria-labels \"Increase NAME\" and \"Decrease NAME\"; decreasing from 1 removes the line) and a line total; under it <p className=\"subtotal\">Subtotal: ₦N</p>. The cart is saved to localStorage as JSON under \"cart\" (an array of { id, qty }) and restored on load.",
          files: {
            "src/cart.jsx": `// shared cart state: Context + useReducer, or Zustand
`,
            "src/App.jsx": `import { products, naira } from "./data.js";

export default function App() {
  return <h1>Shop</h1>;
}
`,
            "src/data.js": PRODUCTS,
          },
          readOnly: ["src/data.js"],
          revealSolution: false,
          tests: [
            { label: "Adding products updates the header and the panel", check: "const add = (i) => $$('article.product')[i].querySelector('button'); await click(add(0)); await click(add(0)); await click(add(1)); const lines = $$('li.line'); return text('.cart-count') === '3' && lines.length === 2 && text(lines[0].querySelector('output')) === '2';", fail: "Adding an existing product increases its quantity." },
            { label: "The subtotal is derived", check: "return text('.subtotal') === 'Subtotal: ₦33,000';", fail: "Sum price × qty using the product data." },
            { label: "+ and − change quantities; − from 1 removes the line", check: "await click($$('button').find((b) => nameOf(b) === 'Increase Leather sandals')); const two = text($$('li.line')[1].querySelector('output')) === '2'; await click($$('button').find((b) => nameOf(b) === 'Decrease Leather sandals')); await click($$('button').find((b) => nameOf(b) === 'Decrease Leather sandals')); return two && $$('li.line').length === 1 && text('.cart-count') === '2';", fail: "Decrease removes the line at quantity 1." },
            { label: "The cart is saved as JSON", check: "await wait(30); const saved = JSON.parse(storage.getItem('cart') || 'null'); return Array.isArray(saved) && saved.length === 1 && saved[0].id === 'p1' && saved[0].qty === 2;", fail: "Save [{ id, qty }] under \"cart\" whenever it changes." },
            { label: "A saved cart is restored on load", seed: { cart: "[{\"id\":\"p3\",\"qty\":4}]" }, check: "return text('.cart-count') === '4' && $$('li.line').length === 1 && text('.subtotal') === 'Subtotal: ₦12,000';", fail: "Read localStorage when creating the initial state." },
            { label: "The cart logic lives in cart.jsx, not in the components", check: "const c = code('src/cart.jsx'); return (/useReducer|create\\(/.test(c)) && /localStorage/.test(c) && !/localStorage/.test(code('src/App.jsx'));", fail: "Keep the rules and persistence in cart.jsx." },
          ],
          solution: {
            "src/cart.jsx": `import { createContext, useContext, useEffect, useReducer } from "react";

const CartContext = createContext(null);

function load() {
  try {
    return JSON.parse(localStorage.getItem("cart")) || [];
  } catch {
    return [];
  }
}

function cartReducer(lines, action) {
  switch (action.type) {
    case "added": {
      const found = lines.find((l) => l.id === action.id);
      if (found) return lines.map((l) => (l.id === action.id ? { ...l, qty: l.qty + 1 } : l));
      return [...lines, { id: action.id, qty: 1 }];
    }
    case "decreased":
      return lines.flatMap((l) => (l.id !== action.id ? [l] : l.qty > 1 ? [{ ...l, qty: l.qty - 1 }] : []));
    default:
      throw new Error("Unknown action: " + action.type);
  }
}

export function CartProvider({ children }) {
  const [lines, dispatch] = useReducer(cartReducer, undefined, load);
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(lines));
  }, [lines]);
  return <CartContext value={{ lines, dispatch }}>{children}</CartContext>;
}

export function useCart() {
  return useContext(CartContext);
}
`,
            "src/App.jsx": `import { products, naira } from "./data.js";
import { CartProvider, useCart } from "./cart.jsx";

const byId = Object.fromEntries(products.map((p) => [p.id, p]));

function Header() {
  const { lines } = useCart();
  const count = lines.reduce((n, l) => n + l.qty, 0);
  return (
    <header>
      Shop · Cart <span className="cart-count">{count}</span>
    </header>
  );
}

function ProductCard({ product }) {
  const { dispatch } = useCart();
  return (
    <article className="product">
      <h2>{product.name}</h2>
      <p>{naira(product.price)}</p>
      <button onClick={() => dispatch({ type: "added", id: product.id })}>Add to cart</button>
    </article>
  );
}

function CartPanel() {
  const { lines, dispatch } = useCart();
  const subtotal = lines.reduce((sum, l) => sum + byId[l.id].price * l.qty, 0);
  return (
    <aside>
      <ul>
        {lines.map((l) => {
          const p = byId[l.id];
          return (
            <li key={l.id} className="line">
              {p.name}
              <button aria-label={"Decrease " + p.name} onClick={() => dispatch({ type: "decreased", id: l.id })}>−</button>
              <output>{l.qty}</output>
              <button aria-label={"Increase " + p.name} onClick={() => dispatch({ type: "added", id: l.id })}>+</button>
              {naira(p.price * l.qty)}
            </li>
          );
        })}
      </ul>
      <p className="subtotal">Subtotal: {naira(subtotal)}</p>
    </aside>
  );
}

export default function App() {
  return (
    <CartProvider>
      <Header />
      <main>
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </main>
      <CartPanel />
    </CartProvider>
  );
}
`,
          },
          hint: "Store only { id, qty } per line, and look up names and prices from the product data.",
          successMessage: "One source of truth for the cart, shared, derived and persisted.",
        }),
      },
    ],
    task: {
      title: "Module 7 practical: your cart, two ways",
      intro: "Build the cart in your own project, then build it again with the other tool.",
      prompts: [
        "Version 1: Context with useReducer. Version 2: a Zustand store with selectors.",
        "Add a \"remove line\" action and a \"clear cart\" action to both.",
        "Use React DevTools' Profiler (or console.count in each component) to see which components re-render when you add an item, in each version.",
        "Write down where each piece of state in your app lives and why.",
        "Mastery checkpoint: justify, for a given app (a chat app, a dashboard, a blog), where each kind of state should live and which tool you would use.",
      ],
      closing: "Next: Module 8, routing and multi-page apps.",
    },
    requirements: { read: true, video: false, assessment: true },
  },
];
