/**
 * REACT DEVELOPMENT · MODULE 6 · REACT HOOKS AND SIDE EFFECTS
 *
 * Curriculum 6.1 – 6.P. The Rules of Hooks, useReducer, useEffect and
 * external systems, dependencies and cleanup, fetching with loading, empty
 * and error states, race conditions, useRef, custom Hooks, effects you do
 * not need, and an honest introduction to useMemo and useCallback.
 *
 * The labs run under Strict Mode, which in development mounts every
 * component twice (mount, clean up, mount again). A missing cleanup shows up
 * as a doubled timer or listener, which is exactly why React does it.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

import { reactLab } from "./rx-helpers.js";

export const SECTION_ID = "rx-s6-hooks";
const MODULE = "rx-m6-hooks";

const USERS = [
  { id: 1, name: "Ada Obi", city: "Lagos", role: "Engineer" },
  { id: 2, name: "Tunde Bello", city: "Ibadan", role: "Designer" },
  { id: 3, name: "Ngozi Eze", city: "Enugu", role: "Engineer" },
  { id: 4, name: "Musa Ali", city: "Kano", role: "Analyst" },
];

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 35 · 6.1 – 6.3
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "rx-l35-hooks-reducer",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 1,
    covers: ["6.1", "6.2", "6.3"],
    title: "The Rules of Hooks, useReducer and useEffect",
    subtitle: "How Hooks work, reducers for complex state, and what effects are for",
    estimatedMinutes: 35,
    intro: "Hooks are functions starting with use that let a component remember things and connect to the world outside React. They come with two rules, and those rules explain how they work.",

    atoms: [
      {
        id: "a-rx-rules-of-hooks",
        title: "Rules of Hooks",
        explain:
          "1. Call Hooks only at the TOP LEVEL of a component or custom Hook: never inside conditions, loops, nested functions or after an early return. 2. Call them only from React function components or custom Hooks, never from ordinary functions or event handlers. The reason: React does not know Hooks by name; it remembers them by CALL ORDER. The first useState is slot 1, the second slot 2, on every render. If a condition skips one, every later Hook gets the wrong slot's data. The eslint-plugin-react-hooks rule that every Vite project includes reports violations as you type.",
        decision: {
          scenario:
            "function Profile({ user }) {\n  if (!user) return <p>Loading…</p>;\n  const [tab, setTab] = useState(\"posts\");\n  …\n}",
          question: "What is wrong?",
          options: [
            { id: "a", text: "useState comes after an early return, so it is called on some renders and not others", why: "When user goes from null to an object, the Hook count changes and React's slots shift. Move every Hook above the return." },
            { id: "b", text: "Nothing: it only runs when user exists", whyWrong: "That is exactly the problem: Hooks must run on every render, in the same order." },
            { id: "c", text: "useState must be imported inside the function", whyWrong: "Imports go at the top of the file." },
            { id: "d", text: "Early returns are not allowed in components", whyWrong: "They are fine, after all the Hooks." },
          ],
          correct: "a",
          aftermath: "All Hooks first, then any early returns.",
        },
      },
      {
        id: "a-rx-usereducer",
        title: "useState recap and useReducer fundamentals",
        explain:
          "useState is perfect for independent values. When the next state depends on the previous one in several different ways (add, remove, change quantity, clear), the update logic spreads across many handlers. useReducer gathers it in one pure function: function reducer(state, action) { switch (action.type) { case \"added\": return …; default: throw new Error(\"Unknown action\"); } }. In the component: const [cart, dispatch] = useReducer(reducer, []); and handlers just describe what happened: dispatch({ type: \"added\", product }). The reducer must be pure and return new state, never mutate.",
        webLab: reactLab({
          task:
            "Write cartReducer in cart.js. It handles three actions: \"added\" (action.product; if the product is already in the cart, add 1 to its qty, otherwise add it with qty 1), \"removed\" (action.id) and \"cleared\". Unknown actions throw an Error. App.jsx already dispatches them.",
          files: {
            "src/cart.js": `export function cartReducer(cart, action) {
  return cart;
}
`,
            "src/App.jsx": `import { useReducer } from "react";
import { cartReducer } from "./cart.js";

const products = [
  { id: "p1", name: "Tote bag", price: 7500 },
  { id: "p2", name: "Sandals", price: 18000 },
];

export default function App() {
  const [cart, dispatch] = useReducer(cartReducer, []);
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <>
      {products.map((p) => (
        <button key={p.id} onClick={() => dispatch({ type: "added", product: p })}>
          Add {p.name}
        </button>
      ))}
      <ul className="cart">
        {cart.map((item) => (
          <li key={item.id}>
            {item.name} × {item.qty}{" "}
            <button onClick={() => dispatch({ type: "removed", id: item.id })}>Remove</button>
          </li>
        ))}
      </ul>
      <p className="total">Total: {total}</p>
      <button onClick={() => dispatch({ type: "cleared" })}>Clear</button>
    </>
  );
}
`,
          },
          readOnly: ["src/App.jsx"],
          tests: [
            { label: "Adding twice increases the quantity", check: "const add = (n) => $$('button').find((b) => text(b) === 'Add ' + n); await click(add('Tote bag')); await click(add('Tote bag')); await click(add('Sandals')); return $$('.cart li').map((li) => text(li).replace(/ Remove$/, '')).join('|') === 'Tote bag × 2|Sandals × 1' && text('.total') === 'Total: 33000';", fail: "If the product exists, map it to { ...item, qty: item.qty + 1 }; otherwise append { ...product, qty: 1 }." },
            { label: "Remove removes that line", check: "await click($$('.cart li')[0].querySelector('button')); return $$('.cart li').length === 1 && text('.total') === 'Total: 18000';", fail: "filter out action.id." },
            { label: "Clear empties the cart", check: "await click($$('button').find((b) => text(b) === 'Clear')); return $$('.cart li').length === 0;", fail: "return [] for \"cleared\"." },
            { label: "Unknown actions throw, and the reducer never mutates", check: "const m = await import('data:text/javascript;charset=utf-8,' + encodeURIComponent(raw('src/cart.js'))); const start = Object.freeze([Object.freeze({ id: 'p1', name: 'Tote bag', price: 1, qty: 1 })]); const next = m.cartReducer(start, { type: 'added', product: { id: 'p1', name: 'Tote bag', price: 1 } }); let threw = false; try { m.cartReducer([], { type: 'nonsense' }); } catch { threw = true; } return threw && next !== start && next[0].qty === 2 && start[0].qty === 1;", fail: "Return new arrays and objects; throw new Error(\"Unknown action: \" + action.type) by default." },
          ],
          solution: {
            "src/cart.js": `export function cartReducer(cart, action) {
  switch (action.type) {
    case "added": {
      const existing = cart.find((item) => item.id === action.product.id);
      if (existing) {
        return cart.map((item) => (item.id === action.product.id ? { ...item, qty: item.qty + 1 } : item));
      }
      return [...cart, { ...action.product, qty: 1 }];
    }
    case "removed":
      return cart.filter((item) => item.id !== action.id);
    case "cleared":
      return [];
    default:
      throw new Error("Unknown action: " + action.type);
  }
}
`,
          },
          hint: "A switch on action.type, each case returning a new array.",
          successMessage: "All the cart's logic in one pure function, and the component only says what happened.",
        }),
      },
      {
        id: "a-rx-purpose-effect",
        title: "The purpose of useEffect",
        explain:
          "Rendering must be pure, but apps must also do things that are not rendering: set the page title, start a timer, connect to a chat server, listen for window resizes, fetch data. These are SIDE EFFECTS. useEffect(() => { … }) runs your code AFTER React has updated the screen, so it never blocks or corrupts rendering. Use it to SYNCHRONISE a component with something outside React. Do not use it for things you can calculate during render, or for responding to a click (put that in the click handler).",
        webLab: reactLab({
          task:
            "Keep the browser tab's title in sync with the unread count: \"(N) Inbox\" when there are unread messages, and just \"Inbox\" when there are none. Use useEffect so it runs after rendering, with unread as its dependency.",
          files: {
            "src/App.jsx": `import { useEffect, useState } from "react";

export default function App() {
  const [unread, setUnread] = useState(3);

  return (
    <>
      <p>{unread} unread</p>
      <button onClick={() => setUnread(unread + 1)}>New message</button>
      <button onClick={() => setUnread(0)}>Mark all read</button>
    </>
  );
}
`,
          },
          tests: [
            { label: "The title shows the count", check: "return await waitFor(() => document.title === '(3) Inbox');", fail: "useEffect(() => { document.title = … }, [unread]);" },
            { label: "It follows new messages", check: "await click($$('button')[0]); return await waitFor(() => document.title === '(4) Inbox');", fail: "List unread in the dependency array." },
            { label: "No count when all are read", check: "await click($$('button')[1]); return await waitFor(() => document.title === 'Inbox');", fail: "unread > 0 ? … : \"Inbox\"" },
          ],
          solution: {
            "src/App.jsx": `import { useEffect, useState } from "react";

export default function App() {
  const [unread, setUnread] = useState(3);

  useEffect(() => {
    document.title = unread > 0 ? "(" + unread + ") Inbox" : "Inbox";
  }, [unread]);

  return (
    <>
      <p>{unread} unread</p>
      <button onClick={() => setUnread(unread + 1)}>New message</button>
      <button onClick={() => setUnread(0)}>Mark all read</button>
    </>
  );
}
`,
          },
          hint: "document.title is outside React: exactly what effects are for.",
          successMessage: "React renders; the effect keeps the world outside in step.",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 36 · 6.4 – 6.6
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "rx-l36-effects",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 2,
    covers: ["6.4", "6.5", "6.6"],
    title: "Effects: Synchronising, Dependencies and Cleanup",
    subtitle: "Connecting to external systems, when effects run, and cleaning up after them",
    estimatedMinutes: 40,
    intro: "An effect is a connection between your component and something React does not control. Every connection needs to know when to reconnect and how to disconnect.",

    atoms: [
      {
        id: "a-rx-external-systems",
        title: "Synchronising components with external systems",
        explain:
          "External systems are anything outside React's rendering: browser APIs (window events, timers, localStorage, the network status), third-party widgets (a map, a chart), and connections (a WebSocket, a chat room). Think of an effect as \"while this component is on screen, stay connected to X\": the effect body STARTS the connection; the function it returns STOPS it. React runs the start after the component appears and the stop when it disappears, and also stop-then-start whenever the values it depends on change.",
        webLab: reactLab({
          task:
            "Show the window's width live. Keep width in state (start with window.innerWidth). In an effect, add a \"resize\" listener on window that updates the state, and return a cleanup that removes the same listener. Show \"Width: N px\" and, below 600px, the text \"Compact layout\" in <p className=\"mode\">, otherwise \"Wide layout\".",
          files: {
            "src/App.jsx": `import { useEffect, useState } from "react";

export default function App() {
  return <p className="width">Width: ? px</p>;
}
`,
          },
          tests: [
            { label: "It shows the current width", check: "return text('.width') === 'Width: ' + window.innerWidth + ' px' && text('.mode') === 'Wide layout';", fail: "useState(window.innerWidth)" },
            { label: "It updates on resize", check: "Object.defineProperty(window, 'innerWidth', { value: 480, configurable: true }); window.dispatchEvent(new Event('resize')); return await waitFor(() => text('.width') === 'Width: 480 px' && text('.mode') === 'Compact layout');", fail: "window.addEventListener(\"resize\", handler) in the effect." },
            { label: "The listener is removed in a cleanup", check: "return /removeEventListener\\(\\s*[\"']resize[\"']/.test(code('src/App.jsx')) && /return\\s*\\(\\)\\s*=>|return\\s+function/.test(code('src/App.jsx'));", fail: "return () => window.removeEventListener(\"resize\", handler);" },
          ],
          solution: {
            "src/App.jsx": `import { useEffect, useState } from "react";

export default function App() {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    function handleResize() {
      setWidth(window.innerWidth);
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <p className="width">Width: {width} px</p>
      <p className="mode">{width < 600 ? "Compact layout" : "Wide layout"}</p>
    </>
  );
}
`,
          },
          hint: "The cleanup must remove the SAME function, so define handleResize inside the effect.",
          successMessage: "Connect on mount, disconnect on unmount: the shape of every subscription.",
        }),
      },
      {
        id: "a-rx-dependencies",
        title: "Dependency arrays and effect execution",
        explain:
          "The second argument says WHEN the effect re-runs. No array: after every render (rarely what you want). An empty array []: once after the component first appears. [a, b]: after the first render and whenever a or b changed since the last render (compared with Object.is). The array must list EVERY prop, state or variable from the component that the effect reads; the react-hooks/exhaustive-deps lint rule checks this. Leaving one out makes the effect use a stale value. If listing something causes a loop, the fix is to restructure (move the object inside the effect, use a functional update), never to lie about dependencies.",
        webLab: reactLab({
          task:
            "The room label never updates when you switch rooms, because the effect's dependency array is empty although it reads roomId. Fix the dependencies, and make the cleanup log \"Left ROOM\" so that switching from general to random logs \"Left general\" and then \"Joined random\".",
          files: {
            "src/chat.js": `// A pretend chat server connection.
export function connect(roomId) {
  console.log("Joined " + roomId);
  return { disconnect: () => console.log("Left " + roomId) };
}
`,
            "src/App.jsx": `import { useEffect, useState } from "react";
import { connect } from "./chat.js";

function ChatRoom({ roomId }) {
  const [status, setStatus] = useState("");

  useEffect(() => {
    const connection = connect(roomId);
    setStatus("Connected to " + roomId);
  }, []);

  return <p className="status">{status}</p>;
}

export default function App() {
  const [room, setRoom] = useState("general");
  return (
    <>
      <select aria-label="Room" value={room} onChange={(e) => setRoom(e.target.value)}>
        <option value="general">general</option>
        <option value="random">random</option>
      </select>
      <ChatRoom roomId={room} />
    </>
  );
}
`,
          },
          readOnly: ["src/chat.js"],
          tests: [
            { label: "It connects to general", check: "return await waitFor(() => text('.status') === 'Connected to general');", fail: "The effect runs after the first render." },
            { label: "Switching room reconnects", check: "await type('select', 'random'); return await waitFor(() => text('.status') === 'Connected to random');", fail: "Put roomId in the dependency array." },
            { label: "It leaves the old room before joining the new one", check: "const l = logs(); const i = l.lastIndexOf('Left general'); return i > -1 && l.indexOf('Joined random') > i;", fail: "return () => connection.disconnect();" },
          ],
          solution: {
            "src/App.jsx": `import { useEffect, useState } from "react";
import { connect } from "./chat.js";

function ChatRoom({ roomId }) {
  const [status, setStatus] = useState("");

  useEffect(() => {
    const connection = connect(roomId);
    setStatus("Connected to " + roomId);
    return () => connection.disconnect();
  }, [roomId]);

  return <p className="status">{status}</p>;
}

export default function App() {
  const [room, setRoom] = useState("general");
  return (
    <>
      <select aria-label="Room" value={room} onChange={(e) => setRoom(e.target.value)}>
        <option value="general">general</option>
        <option value="random">random</option>
      </select>
      <ChatRoom roomId={room} />
    </>
  );
}
`,
          },
          hint: "Look at the console: Strict Mode already shows Joined, Left, Joined on the first load once the cleanup exists.",
          successMessage: "Every value the effect reads is a dependency; the cleanup undoes the previous run.",
        }),
      },
      {
        id: "a-rx-cleanup",
        title: "Cleanup functions and subscriptions",
        explain:
          "The function an effect returns is its CLEANUP. React calls it before re-running the effect with new dependencies, and when the component is removed. Every effect that starts something must stop it: setInterval → clearInterval; addEventListener → removeEventListener; subscribe → unsubscribe; open a connection → close it; start a fetch → ignore or abort it (next lesson). Without cleanup, intervals keep running after the component has gone, listeners pile up, and in development Strict Mode's mount-unmount-mount makes the leak visible immediately: a clock that ticks twice as fast.",
        webLab: reactLab({
          task:
            "The clock ticks twice as fast as it should (Strict Mode mounted it twice and nothing stopped the first interval), and it keeps logging after you hide it. Return a cleanup that clears the interval, and use a functional update so the effect does not depend on seconds.",
          files: {
            "src/App.jsx": `import { useEffect, useState } from "react";

function Clock() {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    setInterval(() => {
      console.log("tick");
      setSeconds((s) => s + 1);
    }, 100);
  }, []);

  return <p className="clock">{seconds} ticks</p>;
}

export default function App() {
  const [show, setShow] = useState(true);
  return (
    <>
      <button onClick={() => setShow(!show)}>{show ? "Hide clock" : "Show clock"}</button>
      {show && <Clock />}
    </>
  );
}
`,
          },
          tests: [
            { label: "It ticks once per interval", check: "await wait(560); const n = Number(text('.clock').split(' ')[0]); return n >= 3 && n <= 6;", fail: "Two intervals are running. Clear the interval in a cleanup." },
            { label: "Hiding the clock stops the ticking", check: "await click('button'); const before = logs().filter((l) => l === 'tick').length; await wait(350); return !$('.clock') && logs().filter((l) => l === 'tick').length === before;", fail: "const id = setInterval(…); return () => clearInterval(id);" },
          ],
          solution: {
            "src/App.jsx": `import { useEffect, useState } from "react";

function Clock() {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      console.log("tick");
      setSeconds((s) => s + 1);
    }, 100);
    return () => clearInterval(id);
  }, []);

  return <p className="clock">{seconds} ticks</p>;
}

export default function App() {
  const [show, setShow] = useState(true);
  return (
    <>
      <button onClick={() => setShow(!show)}>{show ? "Hide clock" : "Show clock"}</button>
      {show && <Clock />}
    </>
  );
}
`,
          },
          hint: "setInterval returns an id; clearInterval(id) stops it.",
          successMessage: "Started, stopped, and Strict Mode proved it before any user could notice.",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 37 · 6.7 – 6.9
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "rx-l37-fetching",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 3,
    covers: ["6.7", "6.8", "6.9"],
    title: "Fetching Data in Effects",
    subtitle: "Request lifecycles, loading, empty and error states, and race conditions",
    estimatedMinutes: 40,
    intro: "Loading data when a component appears is the most common effect of all, and the easiest to get subtly wrong. Here is the version that holds up in real use.",

    atoms: [
      {
        id: "a-rx-fetch-effect",
        title: "Fetching data and managing request lifecycles",
        explain:
          "An effect cannot be async itself (it must return a cleanup or nothing), so define an async function inside it and call it: useEffect(() => { async function load() { const res = await fetch(url); setData(await res.json()); } load(); }, [url]);. The request's LIFECYCLE is: started, then either succeeded or failed, and possibly made obsolete because the component disappeared or the url changed. Strict Mode runs the effect twice in development, so you will see two requests in the Network panel; in production there is one. Module 9 introduces TanStack Query, which handles caching and much of this for you; it is still essential to know what it does.",
        webLab: reactLab({
          task:
            "Load the users from /api/users when the component appears and render each name in an <li>. Use an async function inside the effect.",
          files: {
            "src/App.jsx": `import { useEffect, useState } from "react";

export default function App() {
  const [users, setUsers] = useState([]);

  return (
    <ul>
      {users.map((u) => (
        <li key={u.id}>{u.name}</li>
      ))}
    </ul>
  );
}
`,
          },
          mocks: [{ match: "/api/users", body: USERS, delay: 80 }],
          tests: [
            { label: "The four users appear", check: "return await waitFor(() => $$('li').map((li) => text(li)).join() === 'Ada Obi,Tunde Bello,Ngozi Eze,Musa Ali');", fail: "In an effect: fetch, res.json(), setUsers." },
            { label: "It requests /api/users", check: "return fetchCalls().some((c) => c.url.includes('/api/users'));", fail: "fetch(\"/api/users\")" },
            { label: "The effect itself is not async", check: "return !/useEffect\\(\\s*async/.test(code('src/App.jsx'));", fail: "Define an async function inside the effect and call it." },
          ],
          solution: {
            "src/App.jsx": `import { useEffect, useState } from "react";

export default function App() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/users");
      setUsers(await res.json());
    }
    load();
  }, []);

  return (
    <ul>
      {users.map((u) => (
        <li key={u.id}>{u.name}</li>
      ))}
    </ul>
  );
}
`,
          },
          hint: "useEffect(() => { async function load() { … } load(); }, []);",
          successMessage: "Data from a server, rendered by React. Next: what happens when it is slow, empty or broken.",
        }),
      },
      {
        id: "a-rx-loading-empty-error",
        title: "Handling loading, empty and error states",
        explain:
          "Every fetch has four outcomes to design for: LOADING (show a message or skeleton so the screen is not blank), SUCCESS with data, success but EMPTY (an empty state, Module 3), and ERROR (a message and a Retry). Check res.ok. Model it with a status value, as in Module 5. A Retry button can bump a counter that is in the effect's dependency list, which re-runs the effect.",
        webLab: reactLab({
          task:
            "Handle every state. While loading: <p role=\"status\">Loading users…</p>. Error (non-ok response or network failure): <p role=\"alert\">Could not load users</p> and a Retry button that loads again. Empty array: <p className=\"empty\">No users yet</p>. Otherwise the list.",
          files: {
            "src/App.jsx": `import { useEffect, useState } from "react";

export default function App() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/users");
      setUsers(await res.json());
    }
    load();
  }, []);

  return (
    <ul>
      {users.map((u) => (
        <li key={u.id}>{u.name}</li>
      ))}
    </ul>
  );
}
`,
          },
          mocks: [{ match: "/api/users", body: USERS, delay: 150 }],
          tests: [
            { label: "Loading shows first", check: "return text('[role=status]') === 'Loading users…';", fail: "Start with status \"loading\"." },
            { label: "Then the list", check: "return await waitFor(() => $$('li').length === 4 && !$('[role=status]'));", fail: "On success, show the list and remove the loading message." },
            { label: "An empty list shows the empty state", mocks: [{ match: "/api/users", body: [], delay: 40 }], check: "return await waitFor(() => text('.empty') === 'No users yet') && !$('ul li');", fail: "if (users.length === 0) show the empty message." },
            { label: "An error shows an alert with Retry", mocks: [{ match: "/api/users", status: 500, body: { error: "down" }, delay: 40 }], check: "await waitFor(() => !!$('[role=alert]')); const msg = text('[role=alert]'); const retry = $$('button').find((b) => text(b) === 'Retry'); const before = fetchCalls().length; if (!retry) return false; await click(retry); await wait(30); return msg === 'Could not load users' && fetchCalls().length > before;", fail: "Check res.ok, set an error status, and let Retry re-run the effect." },
          ],
          solution: {
            "src/App.jsx": `import { useEffect, useState } from "react";

export default function App() {
  const [users, setUsers] = useState([]);
  const [status, setStatus] = useState("loading");
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    async function load() {
      setStatus("loading");
      try {
        const res = await fetch("/api/users");
        if (!res.ok) throw new Error("HTTP " + res.status);
        setUsers(await res.json());
        setStatus("success");
      } catch {
        setStatus("error");
      }
    }
    load();
  }, [attempt]);

  if (status === "loading") return <p role="status">Loading users…</p>;
  if (status === "error") {
    return (
      <>
        <p role="alert">Could not load users</p>
        <button onClick={() => setAttempt((a) => a + 1)}>Retry</button>
      </>
    );
  }
  if (users.length === 0) return <p className="empty">No users yet</p>;
  return (
    <ul>
      {users.map((u) => (
        <li key={u.id}>{u.name}</li>
      ))}
    </ul>
  );
}
`,
          },
          hint: "An attempt counter in the dependency array makes Retry re-run the effect.",
          successMessage: "Loading, success, empty and error: four states, four honest screens.",
        }),
      },
      {
        id: "a-rx-race-conditions",
        title: "Preventing stale requests and handling race conditions",
        explain:
          "Type \"a\", then \"ad\": two requests are in flight. If the \"a\" request is slower, it finishes LAST and overwrites the \"ad\" results with the wrong list. That is a RACE CONDITION. The fix uses the cleanup: let ignore = false at the start of the effect; the cleanup sets ignore = true; only call setState if !ignore. When the query changes, React runs the old effect's cleanup, so its late answer is ignored. An AbortController goes further and cancels the request itself: pass controller.signal to fetch and call controller.abort() in the cleanup.",
        webLab: reactLab({
          task:
            "Type \"a\" and then quickly \"ad\": the slow \"a\" results arrive last and replace the right ones. Fix the race with an ignore flag set in the effect's cleanup, so only the latest query's results are shown.",
          files: {
            "src/App.jsx": `import { useEffect, useState } from "react";

export default function App() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (!query) return;
    async function search() {
      const res = await fetch("/api/search?q=" + encodeURIComponent(query));
      const data = await res.json();
      setResults(data);
    }
    search();
  }, [query]);

  return (
    <>
      <label htmlFor="q">Search people</label>
      <input id="q" value={query} onChange={(e) => setQuery(e.target.value)} />
      <ul>
        {results.map((r) => (
          <li key={r}>{r}</li>
        ))}
      </ul>
    </>
  );
}
`,
          },
          mocks: [
            { match: "/api/search?q=ad", body: ["Ada Obi", "Adamu Sani"], delay: 60 },
            { match: "/api/search?q=a", body: ["Ada Obi", "Adamu Sani", "Musa Ali", "Tunde Bello"], delay: 400 },
          ],
          tests: [
            { label: "Only the latest query's results show", check: "await type('#q', 'a'); await wait(20); await type('#q', 'ad'); await wait(600); return $$('li').map((li) => text(li)).join() === 'Ada Obi,Adamu Sani';", fail: "let ignore = false; … if (!ignore) setResults(data); … return () => { ignore = true; };" },
            { label: "The fix is in the effect's cleanup", check: "return /ignore\\s*=\\s*true|\\.abort\\(\\)/.test(code('src/App.jsx'));", fail: "Return a cleanup that marks the old request as stale." },
          ],
          solution: {
            "src/App.jsx": `import { useEffect, useState } from "react";

export default function App() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (!query) return;
    let ignore = false;
    async function search() {
      const res = await fetch("/api/search?q=" + encodeURIComponent(query));
      const data = await res.json();
      if (!ignore) setResults(data);
    }
    search();
    return () => {
      ignore = true;
    };
  }, [query]);

  return (
    <>
      <label htmlFor="q">Search people</label>
      <input id="q" value={query} onChange={(e) => setQuery(e.target.value)} />
      <ul>
        {results.map((r) => (
          <li key={r}>{r}</li>
        ))}
      </ul>
    </>
  );
}
`,
          },
          hint: "Each run of the effect has its own ignore variable, closed over by its own search().",
          successMessage: "Late answers to old questions are now ignored. This bug ships in many real apps.",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 38 · 6.10 – 6.11
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "rx-l38-refs-custom",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 4,
    covers: ["6.10", "6.11"],
    title: "useRef and Custom Hooks",
    subtitle: "References to DOM nodes and values that do not render, and reusing logic as your own Hooks",
    estimatedMinutes: 35,
    intro: "Two tools that complete the Hook toolbox: refs, for what should not cause renders, and custom Hooks, for logic you want to write once and use everywhere.",

    atoms: [
      {
        id: "a-rx-useref",
        title: "useRef for DOM references and mutable values",
        explain:
          "const ref = useRef(initial) returns an object { current: initial } that React keeps for the life of the component. Changing ref.current does NOT re-render. Two uses: 1. DOM REFERENCES: <input ref={inputRef} /> makes inputRef.current the real <input> after rendering, so you can call inputRef.current.focus(), scroll an element into view, or measure it. 2. MUTABLE VALUES that the screen does not show: an interval id, a previous value, a \"busy\" flag (Module 5). Do not read or write ref.current during rendering; do it in handlers and effects. If the screen should show a value, it belongs in state.",
        webLab: reactLab({
          task:
            "Build a stopwatch. Start begins counting tenths of a second (state elapsed, +1 every 100ms) and focuses nothing; Stop stops it. Store the interval id in a ref (not state), so Stop can clear it. Reset stops and sets elapsed to 0, and moves focus to the Start button using a DOM ref. Show \"N.N s\" in <output>.",
          files: {
            "src/App.jsx": `import { useRef, useState } from "react";

export default function App() {
  const [elapsed, setElapsed] = useState(0);

  return (
    <>
      <output>{(elapsed / 10).toFixed(1)} s</output>
      <button>Start</button>
      <button>Stop</button>
      <button>Reset</button>
    </>
  );
}
`,
          },
          tests: [
            { label: "Start counts up", check: "const b = (n) => $$('button').find((x) => text(x) === n); await click(b('Start')); await wait(450); return parseFloat(text('output')) >= 0.3;", fail: "intervalRef.current = setInterval(() => setElapsed((e) => e + 1), 100);" },
            { label: "Stop stops it", check: "const b = (n) => $$('button').find((x) => text(x) === n); await click(b('Stop')); const t = text('output'); await wait(300); return text('output') === t;", fail: "clearInterval(intervalRef.current);" },
            { label: "Reset zeroes it and focuses Start", check: "const b = (n) => $$('button').find((x) => text(x) === n); await click(b('Start')); await wait(150); await click(b('Reset')); await wait(250); return text('output') === '0.0 s' && document.activeElement === b('Start');", fail: "Stop, setElapsed(0), and startRef.current.focus()." },
            { label: "The interval id lives in a ref", check: "const c = code('src/App.jsx'); return (c.match(/useRef\\(/g) || []).length >= 2 && (c.match(/useState\\(/g) || []).length === 1;", fail: "One ref for the interval, one for the Start button; elapsed is the only state." },
          ],
          solution: {
            "src/App.jsx": `import { useRef, useState } from "react";

export default function App() {
  const [elapsed, setElapsed] = useState(0);
  const intervalRef = useRef(null);
  const startRef = useRef(null);

  function start() {
    if (intervalRef.current) return;
    intervalRef.current = setInterval(() => setElapsed((e) => e + 1), 100);
  }
  function stop() {
    clearInterval(intervalRef.current);
    intervalRef.current = null;
  }
  function reset() {
    stop();
    setElapsed(0);
    startRef.current.focus();
  }

  return (
    <>
      <output>{(elapsed / 10).toFixed(1)} s</output>
      <button ref={startRef} onClick={start}>
        Start
      </button>
      <button onClick={stop}>Stop</button>
      <button onClick={reset}>Reset</button>
    </>
  );
}
`,
          },
          hint: "The interval id never appears on screen, so it does not need to be state.",
          successMessage: "State for what you see; refs for what you only need to remember.",
        }),
      },
      {
        id: "a-rx-custom-hooks",
        title: "Creating custom Hooks to reuse logic",
        explain:
          "A CUSTOM HOOK is a function whose name starts with use and that calls other Hooks. It lets several components share stateful LOGIC (not state: each component that calls it gets its own). useLocalStorage(key, initial) works like useState but saves to localStorage; useOnlineStatus() returns whether the browser is online; useFetch(url) returns { data, status }. Extract one when two components contain the same effect and state, or when a component's logic is easier to read with a name on it. The use prefix tells React's lint rules to check it with the Rules of Hooks.",
        webLab: reactLab({
          task:
            "Write useLocalStorage(key, initialValue) in src/hooks/useLocalStorage.js. It works like useState, returning [value, setValue], but starts from the saved value (JSON) if there is one, and saves every change to localStorage as JSON. Both components in App use it.",
          files: {
            "src/hooks/useLocalStorage.js": `import { useEffect, useState } from "react";

export function useLocalStorage(key, initialValue) {
  return useState(initialValue);
}
`,
            "src/App.jsx": `import { useLocalStorage } from "./hooks/useLocalStorage.js";

function ThemePicker() {
  const [theme, setTheme] = useLocalStorage("theme", "light");
  return (
    <button className="theme" onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
      Theme: {theme}
    </button>
  );
}

function FontSize() {
  const [size, setSize] = useLocalStorage("fontSize", 16);
  return (
    <button className="size" onClick={() => setSize(size + 2)}>
      Text size: {size}
    </button>
  );
}

export default function App() {
  return (
    <>
      <ThemePicker />
      <FontSize />
    </>
  );
}
`,
          },
          readOnly: ["src/App.jsx"],
          tests: [
            { label: "Changes are saved as JSON", check: "await click('.theme'); await click('.size'); await wait(20); return storage.getItem('theme') === '\"dark\"' && storage.getItem('fontSize') === '18';", fail: "useEffect(() => localStorage.setItem(key, JSON.stringify(value)), [key, value]);" },
            { label: "Saved values are used on load", seed: { theme: "\"dark\"", fontSize: "20" }, check: "return text('.theme') === 'Theme: dark' && text('.size') === 'Text size: 20';", fail: "useState(() => { const saved = localStorage.getItem(key); return saved !== null ? JSON.parse(saved) : initialValue; })" },
            { label: "Each component gets its own value", seed: { theme: "\"light\"" }, check: "await click('.size'); return text('.theme') === 'Theme: light' && text('.size') === 'Text size: 18';", fail: "Each call to the Hook has its own state." },
          ],
          solution: {
            "src/hooks/useLocalStorage.js": `import { useEffect, useState } from "react";

export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    const saved = localStorage.getItem(key);
    return saved !== null ? JSON.parse(saved) : initialValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}
`,
          },
          hint: "useState(() => …) with a function runs it only on the first render: a lazy initial value.",
          successMessage: "Logic with a name, used twice, each with its own state.",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 39 · 6.12 – 6.14
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "rx-l39-effect-mistakes",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 5,
    covers: ["6.12", "6.13", "6.14"],
    title: "Effects You Do Not Need, and Memoization",
    subtitle: "Common useEffect mistakes, useMemo and useCallback, and when not to use them",
    estimatedMinutes: 35,
    intro: "The most common React advice from the React team itself: you probably have effects that should not exist. And the second most common: do not memoize until you have measured.",

    atoms: [
      {
        id: "a-rx-unneeded-effects",
        title: "Common useEffect mistakes and when an effect is unnecessary",
        explain:
          "You do NOT need an effect to: calculate something from props or state (do it during render: const visible = items.filter(…)); respond to a user event (do it in the handler: a purchase POST belongs in onClick, not in an effect watching a \"bought\" flag); reset state when a prop changes (use a key, Module 4); or update a parent (call its callback in the handler). An effect that sets state from other state causes an extra render with stale values in between. Other mistakes: missing dependencies, missing cleanup, async effect functions, and fetching without handling races.",
        webLab: reactLab({
          task:
            "This component uses two effects that are not needed. The first copies a filtered list into state; the second resets the page number when the query changes. Remove BOTH effects and the extra state: calculate the filtered list during render, and reset the page in the input's change handler. Behaviour must not change.",
          files: {
            "src/App.jsx": `import { useEffect, useState } from "react";

const names = ["Ada", "Adamu", "Bola", "Chidi", "Dayo", "Emeka", "Funke", "Gbenga"];

export default function App() {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [visible, setVisible] = useState(names);

  useEffect(() => {
    setVisible(names.filter((n) => n.toLowerCase().includes(query.toLowerCase())));
  }, [query]);

  useEffect(() => {
    setPage(1);
  }, [query]);

  const shown = visible.slice((page - 1) * 3, page * 3);

  return (
    <>
      <label htmlFor="q">Filter</label>
      <input id="q" value={query} onChange={(e) => setQuery(e.target.value)} />
      <ul>
        {shown.map((n) => (
          <li key={n}>{n}</li>
        ))}
      </ul>
      <p className="page">Page {page}</p>
      <button onClick={() => setPage(page + 1)}>Next page</button>
    </>
  );
}
`,
          },
          tests: [
            { label: "Paging still works", check: "await click('button'); return text('.page') === 'Page 2' && $$('li').map((li) => text(li)).join() === 'Chidi,Dayo,Emeka';", fail: "Keep page in state." },
            { label: "Filtering still works and resets to page 1", check: "await type('#q', 'ad'); return text('.page') === 'Page 1' && $$('li').map((li) => text(li)).join() === 'Ada,Adamu';", fail: "In onChange: setQuery(value); setPage(1);" },
            { label: "No effects, and the list is calculated", check: "const c = code('src/App.jsx'); return !/useEffect\\(/.test(c) && (c.match(/useState\\(/g) || []).length === 2;", fail: "Remove both effects and the visible state." },
          ],
          solution: {
            "src/App.jsx": `import { useState } from "react";

const names = ["Ada", "Adamu", "Bola", "Chidi", "Dayo", "Emeka", "Funke", "Gbenga"];

export default function App() {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const visible = names.filter((n) => n.toLowerCase().includes(query.toLowerCase()));
  const shown = visible.slice((page - 1) * 3, page * 3);

  function handleChange(e) {
    setQuery(e.target.value);
    setPage(1);
  }

  return (
    <>
      <label htmlFor="q">Filter</label>
      <input id="q" value={query} onChange={handleChange} />
      <ul>
        {shown.map((n) => (
          <li key={n}>{n}</li>
        ))}
      </ul>
      <p className="page">Page {page}</p>
      <button onClick={() => setPage(page + 1)}>Next page</button>
    </>
  );
}
`,
          },
          hint: "Ask of each effect: is this synchronising with something outside React? If not, it should not be an effect.",
          successMessage: "Fewer effects, fewer renders, fewer bugs, same behaviour.",
        }),
      },
      {
        id: "a-rx-usememo-usecallback",
        title: "Introduction to useMemo and useCallback",
        explain:
          "useMemo(() => compute(a, b), [a, b]) CACHES a calculated value between renders and recalculates it only when a dependency changes: useful when the calculation is genuinely slow (filtering 10,000 rows) or when a stable object identity matters. useCallback(fn, [deps]) caches a FUNCTION so it keeps the same identity between renders; it only helps when that function is passed to a child wrapped in memo (Module 14) or listed in an effect's dependencies. Both take a dependency array with the same rules as effects. Neither changes WHAT is rendered, only how often work is redone.",
        webLab: reactLab({
          task:
            "The report recalculates its expensive statistics on every keystroke in the unrelated notes box. Wrap the calculation in useMemo with scores as its only dependency, so typing a note does not recompute it. The function logs \"computing\" each time it runs, so you can watch the console.",
          files: {
            "src/App.jsx": `import { useMemo, useState } from "react";

function computeStats(scores) {
  console.log("computing");
  const total = scores.reduce((a, b) => a + b, 0);
  return { average: Math.round(total / scores.length), best: Math.max(...scores) };
}

export default function App() {
  const [scores, setScores] = useState([72, 88, 91, 64]);
  const [note, setNote] = useState("");
  const stats = computeStats(scores);

  return (
    <>
      <p className="stats">
        Average {stats.average} · Best {stats.best}
      </p>
      <button onClick={() => setScores([...scores, 100])}>Add a 100</button>
      <label htmlFor="note">Notes</label>
      <input id="note" value={note} onChange={(e) => setNote(e.target.value)} />
    </>
  );
}
`,
          },
          tests: [
            { label: "The stats are right", check: "return text('.stats') === 'Average 79 · Best 91';", fail: "Keep computeStats as it is." },
            { label: "Typing notes does not recompute", check: "const before = logs().filter((l) => l === 'computing').length; await type('#note', 'a'); await type('#note', 'ab'); await type('#note', 'abc'); return logs().filter((l) => l === 'computing').length === before;", fail: "const stats = useMemo(() => computeStats(scores), [scores]);" },
            { label: "Changing scores does recompute", check: "await click('button'); return text('.stats') === 'Average 83 · Best 100';", fail: "scores must be the dependency." },
          ],
          solution: {
            "src/App.jsx": `import { useMemo, useState } from "react";

function computeStats(scores) {
  console.log("computing");
  const total = scores.reduce((a, b) => a + b, 0);
  return { average: Math.round(total / scores.length), best: Math.max(...scores) };
}

export default function App() {
  const [scores, setScores] = useState([72, 88, 91, 64]);
  const [note, setNote] = useState("");
  const stats = useMemo(() => computeStats(scores), [scores]);

  return (
    <>
      <p className="stats">
        Average {stats.average} · Best {stats.best}
      </p>
      <button onClick={() => setScores([...scores, 100])}>Add a 100</button>
      <label htmlFor="note">Notes</label>
      <input id="note" value={note} onChange={(e) => setNote(e.target.value)} />
    </>
  );
}
`,
          },
          hint: "useMemo(() => value, [dependencies])",
          successMessage: "Cached until its input changes. Use it when the work is really expensive, as the next atom explains.",
        }),
      },
      {
        id: "a-rx-premature-memo",
        title: "Why premature memoization can complicate code",
        explain:
          "Memoization is not free: every useMemo and useCallback adds a dependency array that must be kept correct (a missing dependency gives stale values, the same bug as in effects), extra code to read, and a comparison on every render. For cheap calculations it is often SLOWER than just recomputing. Wrapping every function in useCallback does nothing unless something actually compares its identity. The order is: write the plain version, measure with the React Profiler if something feels slow (Module 14), and memoize only the measured bottleneck. React's compiler (React Compiler) can add memoization automatically, which makes hand-written memoization rarer still.",
        decision: {
          scenario:
            "A teammate's pull request wraps every function in every component in useCallback and every calculation (including a + b) in useMemo, \"for performance\". Nothing was measured.",
          question: "What is the best review comment?",
          options: [
            { id: "a", text: "Remove them unless profiling shows a real problem; they add dependency bugs and noise, and can even be slower", why: "Memoize measured bottlenecks only. The plain code is easier to read and usually just as fast." },
            { id: "b", text: "Approve: more memoization is always faster", whyWrong: "Each one has a cost, and wrong dependencies cause stale-value bugs." },
            { id: "c", text: "Ask them to add useMemo to the JSX too", whyWrong: "More of the same problem." },
            { id: "d", text: "Ask them to convert to class components", whyWrong: "Unrelated, and a step backwards." },
          ],
          correct: "a",
          aftermath: "Measure first. Memoize the bottleneck, not everything.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 40 · 6.P
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "rx-l40-m6-project",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 6,
    covers: ["6.P"],
    title: "Practical: A Searchable User Directory",
    subtitle: "An API-powered directory with search, states and no race conditions",
    estimatedMinutes: 60,
    intro: "The Module 6 practical brings effects together: a directory that searches an API as you type, handles every request state and never shows stale results.",

    atoms: [
      {
        id: "a-rx-m6-project",
        title: "Build the user directory",
        explain:
          "Put the fetching logic in a custom Hook, useUsers(query), so the component only renders. The API is GET /api/users?q=QUERY (empty q returns everyone), and it is slow for some queries, so handle the race. A role filter on the results is calculated during render, not fetched.",
        webLab: reactLab({
          task:
            "Write useUsers(query) in src/hooks/useUsers.js returning { users, status } where status is \"loading\", \"success\" or \"error\"; it fetches /api/users?q=QUERY (URL-encoded) whenever query changes and ignores stale responses. In App: a labelled \"Search\" input; a role <select> labelled \"Role\" (All, Engineer, Designer, Analyst) that filters the fetched users during render; <p role=\"status\">Loading…</p> while loading; <p role=\"alert\">Could not load the directory</p> on error; <p className=\"empty\">No people found</p> when the filtered list is empty; otherwise <li className=\"person\"> per user with the name in <strong> and \"ROLE · CITY\" in a <span>.",
          files: {
            "src/hooks/useUsers.js": `import { useEffect, useState } from "react";

export function useUsers(query) {
  return { users: [], status: "loading" };
}
`,
            "src/App.jsx": `import { useState } from "react";
import { useUsers } from "./hooks/useUsers.js";

const ROLES = ["All", "Engineer", "Designer", "Analyst"];

export default function App() {
  return <h1>Directory</h1>;
}
`,
          },
          mocks: [
            { match: "/api/users?q=ad", body: [USERS[0]], delay: 50 },
            { match: "/api/users?q=a", body: USERS, delay: 400 },
            { match: "/api/users?q=zz", body: [], delay: 40 },
            { match: "/api/users?q=", body: USERS, delay: 80 },
          ],
          revealSolution: false,
          tests: [
            { label: "Loading, then everyone", check: "const l = text('[role=status]') === 'Loading…'; await waitFor(() => $$('li.person').length === 4); return l && text($$('li.person')[1].querySelector('span')) === 'Designer · Ibadan';", fail: "Fetch /api/users?q= on first render; show Loading… meanwhile." },
            { label: "The role filter works on the fetched list", check: "const role = $$('select').find((s) => nameOf(s) === 'Role'); if (!role) return false; await type(role, 'Engineer'); return $$('li.person strong').map((s) => text(s)).join() === 'Ada Obi,Ngozi Eze' && fetchCalls().filter((c) => /q=E|role/i.test(c.url)).length === 0;", fail: "Filter users by role during render; do not fetch for it." },
            { label: "Typing searches, and stale answers are ignored", check: "const role = $$('select').find((s) => nameOf(s) === 'Role'); await type(role, 'All'); const s = $$('input').find((i) => nameOf(i) === 'Search'); await type(s, 'a'); await wait(20); await type(s, 'ad'); await wait(600); return $$('li.person strong').map((x) => text(x)).join() === 'Ada Obi';", fail: "useUsers needs an ignore flag in its cleanup." },
            { label: "No results: the empty state", check: "const s = $$('input').find((i) => nameOf(i) === 'Search'); await type(s, 'zz'); return await waitFor(() => text('.empty') === 'No people found');", fail: "Show the empty message when the filtered list is empty." },
            { label: "Errors are reported", mocks: [{ match: "/api/users", status: 503, body: { error: "down" }, delay: 40 }], check: "return await waitFor(() => text('[role=alert]') === 'Could not load the directory');", fail: "Check res.ok in useUsers and return status \"error\"." },
            { label: "The fetching lives in the custom Hook", check: "return /useEffect/.test(code('src/hooks/useUsers.js')) && !/useEffect|fetch\\(/.test(code('src/App.jsx')) && /encodeURIComponent/.test(code('src/hooks/useUsers.js'));", fail: "Keep fetch and the effect in useUsers; encode the query." },
          ],
          solution: {
            "src/hooks/useUsers.js": `import { useEffect, useState } from "react";

export function useUsers(query) {
  const [users, setUsers] = useState([]);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    let ignore = false;
    async function load() {
      setStatus("loading");
      try {
        const res = await fetch("/api/users?q=" + encodeURIComponent(query));
        if (!res.ok) throw new Error("HTTP " + res.status);
        const data = await res.json();
        if (!ignore) {
          setUsers(data);
          setStatus("success");
        }
      } catch {
        if (!ignore) setStatus("error");
      }
    }
    load();
    return () => {
      ignore = true;
    };
  }, [query]);

  return { users, status };
}
`,
            "src/App.jsx": `import { useState } from "react";
import { useUsers } from "./hooks/useUsers.js";

const ROLES = ["All", "Engineer", "Designer", "Analyst"];

export default function App() {
  const [query, setQuery] = useState("");
  const [role, setRole] = useState("All");
  const { users, status } = useUsers(query);
  const visible = users.filter((u) => role === "All" || u.role === role);

  return (
    <main>
      <h1>Directory</h1>
      <label htmlFor="search">Search</label>
      <input id="search" value={query} onChange={(e) => setQuery(e.target.value)} />
      <label htmlFor="role">Role</label>
      <select id="role" value={role} onChange={(e) => setRole(e.target.value)}>
        {ROLES.map((r) => (
          <option key={r} value={r}>{r}</option>
        ))}
      </select>
      {status === "loading" && <p role="status">Loading…</p>}
      {status === "error" && <p role="alert">Could not load the directory</p>}
      {status === "success" && visible.length === 0 && <p className="empty">No people found</p>}
      {status === "success" && visible.length > 0 && (
        <ul>
          {visible.map((u) => (
            <li key={u.id} className="person">
              <strong>{u.name}</strong> <span>{u.role} · {u.city}</span>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
`,
          },
          hint: "Write and check the Hook first with a plain list, then add the filter and the states.",
          successMessage: "Effects in a Hook, derived filtering, every state handled, and no races.",
        }),
      },
    ],
    task: {
      title: "Module 6 practical: your API dashboard",
      intro: "Build a weather dashboard or a user directory against a real, free API (Open-Meteo needs no key; randomuser.me or JSONPlaceholder for people).",
      prompts: [
        "Put the data loading in a custom Hook that returns data and status, with race handling (or an AbortController).",
        "Design the loading, empty and error states, with a Retry.",
        "Debounce the search: wait 300ms after typing stops before fetching (a timer in an effect, with cleanup).",
        "Open the Network panel and confirm only the latest request's response is shown when you type fast.",
        "Mastery checkpoint: explain the difference between state, a ref, rendering and an effect, using one example of each from your project, and show how your app handles a failed request.",
      ],
      closing: "Next: Module 7, architecture and state management.",
    },
    requirements: { read: true, video: false, assessment: true },
  },
];
