/**
 * REACT DEVELOPMENT · MODULE 4 · STATE AND THE REACT RENDERING MODEL
 *
 * Curriculum 4.1 – 4.P. What state is, useState, correct updates, why
 * updates render, state as a snapshot, functional updates, immutable arrays
 * and objects, lifting state up, controlled components and derived values,
 * identity and resets, redundant state and the render cycle.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

import { reactLab } from "./rx-helpers.js";

export const SECTION_ID = "rx-s4-state";
const MODULE = "rx-m4-state";

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 24 · 4.1 – 4.3
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "rx-l24-use-state",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 1,
    covers: ["4.1", "4.2", "4.3"],
    title: "State and useState",
    subtitle: "What state represents, when you need it, and how to update it",
    estimatedMinutes: 30,
    intro: "Module 3 used state as a recipe. This module explains exactly what it is, which makes most React bugs easy to predict and fix.",

    atoms: [
      {
        id: "a-rx-what-state",
        title: "What state represents and when it is necessary",
        explain:
          "STATE is data a component remembers between renders and that changes over time because of something that happens: the user types, clicks, data arrives. Ask three questions about any value. Does it come from a parent? Then it is a PROP. Does it never change? Then it is a CONSTANT outside the component. Can it be CALCULATED from props or other state (a total, a filtered list, a full name)? Then calculate it during render. Only what is left needs state: the text in a search box, whether a menu is open, which tab is selected, the items in a cart.",
        decision: {
          scenario:
            "A checkout page has: the list of products (passed in as a prop), the quantity of each item the user chose, the delivery fee (always ₦1,500), and the order total.",
          question: "Which of these should be state in the checkout component?",
          options: [
            { id: "a", text: "Only the chosen quantities", why: "The products are a prop, the fee is a constant, and the total can be calculated from the other three on every render." },
            { id: "b", text: "All four", whyWrong: "Storing the total means updating it by hand every time a quantity changes, and one day you will forget." },
            { id: "c", text: "The quantities and the total", whyWrong: "The total is derived: calculate it." },
            { id: "d", text: "None: use normal variables", whyWrong: "Normal variables are reset every render and do not trigger re-renders." },
          ],
          correct: "a",
          aftermath: "The less state, the fewer things that can disagree with each other.",
        },
      },
      {
        id: "a-rx-usestate-hook",
        title: "The useState Hook",
        explain:
          "const [quantity, setQuantity] = useState(1). useState takes the INITIAL value (used only on the first render) and returns a pair: the current value and a function to change it. The square brackets are array destructuring, so you name them yourself; the convention is thing and setThing. Call useState at the top level of the component, never inside an if, a loop or a nested function (Module 6 explains why). A component can have as many useState calls as it needs, one per independent value.",
        webLab: reactLab({
          task:
            "Build a quantity stepper. Keep quantity in state, starting at 1. The − button lowers it and the + button raises it; the number shows in <output>. Quantity may not go below 1 or above 10: disable − at 1 and + at 10.",
          files: {
            "src/App.jsx": `export default function App() {
  return (
    <div className="stepper">
      <button aria-label="Decrease">−</button>
      <output>1</output>
      <button aria-label="Increase">+</button>
    </div>
  );
}
`,
          },
          tests: [
            { label: "It starts at 1 with − disabled", check: "return text('output') === '1' && $('[aria-label=Decrease]').disabled && !$('[aria-label=Increase]').disabled;", fail: "useState(1), and disabled={quantity === 1} on the − button." },
            { label: "+ and − change the quantity", check: "await click('[aria-label=Increase]'); await click('[aria-label=Increase]'); await click('[aria-label=Decrease]'); return text('output') === '2';", fail: "onClick={() => setQuantity(quantity + 1)} and the same for −." },
            { label: "It stops at 10", check: "for (let i = 0; i < 12; i++) await click('[aria-label=Increase]'); return text('output') === '10' && $('[aria-label=Increase]').disabled;", fail: "disabled={quantity === 10} on +." },
          ],
          solution: {
            "src/App.jsx": `import { useState } from "react";

export default function App() {
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="stepper">
      <button aria-label="Decrease" disabled={quantity === 1} onClick={() => setQuantity(quantity - 1)}>
        −
      </button>
      <output>{quantity}</output>
      <button aria-label="Increase" disabled={quantity === 10} onClick={() => setQuantity(quantity + 1)}>
        +
      </button>
    </div>
  );
}
`,
          },
          hint: "A disabled button ignores clicks, so the limits enforce themselves.",
          successMessage: "One piece of state, two buttons, and limits that come straight from the value.",
        }),
      },
      {
        id: "a-rx-update-correctly",
        title: "Updating state correctly",
        explain:
          "Only the setter changes state: quantity = 5 changes a local copy and nothing else. The setter REPLACES the value with what you give it, so for an object you must pass the whole new object (Lesson 26). Updates are triggered by events, effects or data arriving, never during rendering itself: calling a setter in the body of the component causes an infinite render loop (\"Too many re-renders\"). Keep each independent value in its own state variable rather than one big object, unless the values always change together.",
        webLab: reactLab({
          task:
            "This sign-in toggle crashes with \"Too many re-renders\", because setSignedIn is called while rendering. Remove that call so the page starts signed out, and make the button switch between signed in and out: it says \"Sign out\" when signed in and \"Sign in\" when not, and the heading says \"Welcome back, Ada\" or \"Hello, guest\".",
          files: {
            "src/App.jsx": `import { useState } from "react";

export default function App() {
  const [signedIn, setSignedIn] = useState(false);
  setSignedIn(false);

  return (
    <header>
      <h1>{signedIn ? "Welcome back, Ada" : "Hello, guest"}</h1>
      <button>Sign in</button>
    </header>
  );
}
`,
          },
          tests: [
            { label: "It renders, signed out", check: "return text('h1') === 'Hello, guest' && text('button') === 'Sign in';", fail: "Delete the setter call in the component body." },
            { label: "The button signs in and out", check: "await click('button'); const a = text('h1') === 'Welcome back, Ada' && text('button') === 'Sign out'; await click('button'); return a && text('h1') === 'Hello, guest';", fail: "onClick={() => setSignedIn(!signedIn)} and a ternary for the label." },
          ],
          solution: {
            "src/App.jsx": `import { useState } from "react";

export default function App() {
  const [signedIn, setSignedIn] = useState(false);

  return (
    <header>
      <h1>{signedIn ? "Welcome back, Ada" : "Hello, guest"}</h1>
      <button onClick={() => setSignedIn(!signedIn)}>{signedIn ? "Sign out" : "Sign in"}</button>
    </header>
  );
}
`,
          },
          hint: "The initial value belongs in useState(false); setters belong in event handlers.",
          successMessage: "Setters in handlers, never in the render itself.",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 25 · 4.4 – 4.6
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "rx-l25-render-snapshot",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 2,
    covers: ["4.4", "4.5", "4.6"],
    title: "Renders, Snapshots and Queued Updates",
    subtitle: "Why setting state renders, why the value does not change straight away, and functional updates",
    estimatedMinutes: 30,
    intro: "The single most surprising thing about state: after setCount(count + 1), count has not changed. Once you see why, a whole family of bugs disappears.",

    atoms: [
      {
        id: "a-rx-why-render",
        title: "Why state updates trigger renders",
        explain:
          "Rendering in React has three steps. TRIGGER: a setter is called (or the app first starts). RENDER: React calls your component function again to get the new JSX; nothing on screen has changed yet. COMMIT: React compares the new JSX with the previous one and changes only the DOM nodes that differ. If you set state to the value it already has (compared with Object.is), React skips the render. This is why the screen always matches state: the only way to change what is shown is to change state, and every change runs your component again.",
        example: "click → setCount(4)        TRIGGER\n      → React calls App()     RENDER (returns new JSX)\n      → compare with last JSX\n      → update <output> text  COMMIT (only what changed)",
        decision: {
          scenario: "A component shows <p>{total}</p>. You call setTotal(500) when total is already 500.",
          question: "What does React do?",
          options: [
            { id: "a", text: "Nothing: the value is the same, so it skips re-rendering", why: "React compares the new value with the old using Object.is and bails out when they are equal." },
            { id: "b", text: "Rebuilds the whole page", whyWrong: "React never rebuilds the whole page; it changes only what differs, and here nothing does." },
            { id: "c", text: "Throws an error", whyWrong: "Setting the same value is harmless." },
            { id: "d", text: "Reloads the browser", whyWrong: "React never reloads the page." },
          ],
          correct: "a",
          aftermath: "Trigger, render, commit, and nothing at all when nothing changed.",
        },
      },
      {
        id: "a-rx-snapshot",
        title: "State as a snapshot and queued updates",
        explain:
          "Each render has its OWN state values, fixed for that render, like a photograph. Event handlers created during that render see that photograph. So inside a handler, after setCount(count + 1), count still holds the old number: the setter does not change the variable, it QUEUES a new value for the NEXT render. React also batches: several setters in one handler produce one re-render after the handler finishes. That is why setCount(count + 1) three times in a row only adds one: all three read the same snapshot.",
        decision: {
          scenario: "count is 5. A handler runs: setCount(count + 1); console.log(count); setCount(count + 1);",
          question: "What is logged, and what is count after the re-render?",
          options: [
            { id: "a", text: "Logs 5; count becomes 6", why: "count is 5 throughout this render's snapshot, so both calls queue 5 + 1." },
            { id: "b", text: "Logs 6; count becomes 7", whyWrong: "The setter does not change count in the current render." },
            { id: "c", text: "Logs 5; count becomes 7", whyWrong: "Both updates read count as 5, so both ask for 6." },
            { id: "d", text: "Logs 6; count becomes 6", whyWrong: "Nothing changes count during the handler." },
          ],
          correct: "a",
          aftermath: "A setter asks for the next render's value; this render's value never changes.",
        },
      },
      {
        id: "a-rx-functional-updates",
        title: "Functional state updates",
        explain:
          "To update state based on its previous value, pass a FUNCTION to the setter: setScore((s) => s + 1). React queues the function and, when it processes the queue, calls it with the latest pending value, so three of them in a row add three. Use the functional form whenever the new value depends on the old one and more than one update may happen before the next render: repeated updates, updates inside timers or after an await. Name the parameter after the state (s, prev, items).",
        webLab: reactLab({
          task:
            "\"+1\" works, but \"Bonus +3\" calls setScore(score + 1) three times and only adds one. Change both handlers to the functional form so +1 adds one and Bonus +3 adds three.",
          files: {
            "src/App.jsx": `import { useState } from "react";

export default function App() {
  const [score, setScore] = useState(0);

  function addOne() {
    setScore(score + 1);
  }

  function bonus() {
    setScore(score + 1);
    setScore(score + 1);
    setScore(score + 1);
  }

  return (
    <>
      <p>
        Score: <output>{score}</output>
      </p>
      <button onClick={addOne}>+1</button>
      <button onClick={bonus}>Bonus +3</button>
    </>
  );
}
`,
          },
          tests: [
            { label: "Bonus +3 adds three", check: "await click($$('button')[1]); return text('output') === '3';", fail: "setScore((s) => s + 1), three times." },
            { label: "+1 still adds one", check: "await click($$('button')[0]); return text('output') === '4';", fail: "Use the functional form there too." },
            { label: "Every update uses the functional form", check: "return !/setScore\\(\\s*score/.test(code('src/App.jsx'));", fail: "No setScore(score + …) left." },
          ],
          solution: {
            "src/App.jsx": `import { useState } from "react";

export default function App() {
  const [score, setScore] = useState(0);

  function addOne() {
    setScore((s) => s + 1);
  }

  function bonus() {
    setScore((s) => s + 1);
    setScore((s) => s + 1);
    setScore((s) => s + 1);
  }

  return (
    <>
      <p>
        Score: <output>{score}</output>
      </p>
      <button onClick={addOne}>+1</button>
      <button onClick={bonus}>Bonus +3</button>
    </>
  );
}
`,
          },
          hint: "The function receives the latest pending value, not this render's snapshot.",
          successMessage: "Queued functions: each one starts from where the previous one ended.",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 26 · 4.7 – 4.8
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "rx-l26-immutable",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 3,
    covers: ["4.7", "4.8"],
    title: "Immutable Updates to Arrays and Objects",
    subtitle: "Making new copies instead of changing state in place",
    estimatedMinutes: 35,
    intro: "Module 0 showed that arrays and objects are references. React decides whether state changed by comparing references, which is why you must always give it a NEW array or object.",

    atoms: [
      {
        id: "a-rx-immutable-updates",
        title: "Immutable updates to arrays and objects",
        explain:
          "Treat state as read-only and build a new value. Objects: setProfile({ ...profile, city: \"Abuja\" }); nested: setProfile({ ...profile, address: { ...profile.address, city: \"Abuja\" } }), copying each level you change. Arrays: ADD with [...items, newItem] (or [newItem, ...items]); REMOVE with items.filter((i) => i.id !== id); UPDATE one with items.map((i) => (i.id === id ? { ...i, done: true } : i)); INSERT with [...items.slice(0, n), x, ...items.slice(n)]; SORT a copy with [...items].sort(…) or items.toSorted(…). Avoid push, pop, splice, sort and reverse on state, and assignments like items[0].done = true: they change the existing array.",
        webLab: reactLab({
          task:
            "Finish the three handlers with immutable updates. moveToCity changes the student's address.city to \"Abuja\" while keeping the street. addCourse adds { id: \"c3\", title: \"React\" } to the end of courses. dropCourse removes a course by id. All three must create new objects or arrays.",
          files: {
            "src/App.jsx": `import { useState } from "react";

export default function App() {
  const [student, setStudent] = useState({
    name: "Ada",
    address: { street: "12 Marina Road", city: "Lagos" },
    courses: [
      { id: "c1", title: "HTML & CSS" },
      { id: "c2", title: "JavaScript" },
    ],
  });

  function moveToCity() {}
  function addCourse() {}
  function dropCourse(id) {}

  return (
    <>
      <p className="address">
        {student.address.street}, {student.address.city}
      </p>
      <ul>
        {student.courses.map((c) => (
          <li key={c.id}>
            {c.title} <button onClick={() => dropCourse(c.id)}>Drop</button>
          </li>
        ))}
      </ul>
      <button onClick={moveToCity}>Move to Abuja</button>
      <button onClick={addCourse}>Add React</button>
    </>
  );
}
`,
          },
          tests: [
            { label: "Moving keeps the street and changes the city", check: "await click($$('button').find((b) => text(b) === 'Move to Abuja')); return text('.address') === '12 Marina Road, Abuja';", fail: "setStudent({ ...student, address: { ...student.address, city: \"Abuja\" } })" },
            { label: "Add React adds a third course", check: "await click($$('button').find((b) => text(b) === 'Add React')); return $$('li').map((li) => li.firstChild.textContent.trim()).join() === 'HTML & CSS,JavaScript,React';", fail: "courses: [...student.courses, { id: \"c3\", title: \"React\" }]" },
            { label: "Drop removes that course", check: "await click($$('li')[1].querySelector('button')); return $$('li').map((li) => li.firstChild.textContent.trim()).join() === 'HTML & CSS,React' && text('.address') === '12 Marina Road, Abuja';", fail: "courses: student.courses.filter((c) => c.id !== id)" },
            { label: "No mutating array methods or assignments", check: "const c = code('src/App.jsx'); return !/\\.push\\(|\\.splice\\(|student\\.[\\w.]+\\s*=[^=]/.test(c);", fail: "Build new arrays and objects with spread, filter and map." },
          ],
          solution: {
            "src/App.jsx": `import { useState } from "react";

export default function App() {
  const [student, setStudent] = useState({
    name: "Ada",
    address: { street: "12 Marina Road", city: "Lagos" },
    courses: [
      { id: "c1", title: "HTML & CSS" },
      { id: "c2", title: "JavaScript" },
    ],
  });

  function moveToCity() {
    setStudent({ ...student, address: { ...student.address, city: "Abuja" } });
  }
  function addCourse() {
    setStudent({ ...student, courses: [...student.courses, { id: "c3", title: "React" }] });
  }
  function dropCourse(id) {
    setStudent({ ...student, courses: student.courses.filter((c) => c.id !== id) });
  }

  return (
    <>
      <p className="address">
        {student.address.street}, {student.address.city}
      </p>
      <ul>
        {student.courses.map((c) => (
          <li key={c.id}>
            {c.title} <button onClick={() => dropCourse(c.id)}>Drop</button>
          </li>
        ))}
      </ul>
      <button onClick={moveToCity}>Move to Abuja</button>
      <button onClick={addCourse}>Add React</button>
    </>
  );
}
`,
          },
          hint: "Copy every level on the way down to what you change: ...student, then ...student.address.",
          successMessage: "New objects at every level you changed; everything else shared. That is an immutable update.",
        }),
      },
      {
        id: "a-rx-no-mutation",
        title: "Avoiding direct state mutation",
        explain:
          "Mutation fails silently. items.push(x); setItems(items) passes React the SAME array it already has; Object.is says nothing changed, so React skips the render and the screen stays stale, even though the data really changed. Worse, the change may appear later, when something unrelated re-renders, which makes the bug look random. Mutation also breaks features that compare old and new values (memo, effects, undo history). If you see a stale screen after an update, look for push, splice, sort or an assignment to a property of state.",
        webLab: reactLab({
          task:
            "Adding a todo does nothing on screen, and marking one done does nothing either, because both handlers mutate state. Rewrite both immutably: add creates a new array with the new todo at the end; toggle creates a new array with a new object for the toggled todo.",
          files: {
            "src/App.jsx": `import { useState } from "react";

let nextId = 3;

export default function App() {
  const [todos, setTodos] = useState([
    { id: 1, text: "Read the useState docs", done: false },
    { id: 2, text: "Build the stepper", done: true },
  ]);

  function add() {
    todos.push({ id: nextId++, text: "New task", done: false });
    setTodos(todos);
  }

  function toggle(id) {
    const todo = todos.find((t) => t.id === id);
    todo.done = !todo.done;
    setTodos(todos);
  }

  return (
    <>
      <ul>
        {todos.map((t) => (
          <li key={t.id}>
            <label>
              <input type="checkbox" checked={t.done} onChange={() => toggle(t.id)} /> {t.text}
            </label>
          </li>
        ))}
      </ul>
      <button onClick={add}>Add task</button>
    </>
  );
}
`,
          },
          tests: [
            { label: "Add task adds a row", check: "await click('button'); return $$('li').length === 3 && text($$('li')[2]) === 'New task';", fail: "setTodos([...todos, { id: nextId++, text: \"New task\", done: false }])" },
            { label: "Ticking the first task marks it done", check: "await click($$('li input')[0]); return $$('li input')[0].checked === true && $$('li input')[1].checked === true;", fail: "setTodos(todos.map((t) => (t.id === id ? { ...t, done: !t.done } : t)))" },
            { label: "Unticking works too", check: "await click($$('li input')[1]); return $$('li input')[1].checked === false;", fail: "Toggle with !t.done." },
            { label: "No mutation left", check: "const c = code('src/App.jsx'); return !/todos\\.push|\\.done\\s*=[^=]/.test(c);", fail: "Remove push and the assignment." },
          ],
          solution: {
            "src/App.jsx": `import { useState } from "react";

let nextId = 3;

export default function App() {
  const [todos, setTodos] = useState([
    { id: 1, text: "Read the useState docs", done: false },
    { id: 2, text: "Build the stepper", done: true },
  ]);

  function add() {
    setTodos([...todos, { id: nextId++, text: "New task", done: false }]);
  }

  function toggle(id) {
    setTodos(todos.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  }

  return (
    <>
      <ul>
        {todos.map((t) => (
          <li key={t.id}>
            <label>
              <input type="checkbox" checked={t.done} onChange={() => toggle(t.id)} /> {t.text}
            </label>
          </li>
        ))}
      </ul>
      <button onClick={add}>Add task</button>
    </>
  );
}
`,
          },
          hint: "Same array in, no render out. Give the setter a new array.",
          successMessage: "New array, new object, and the screen follows every time.",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 27 · 4.9 – 4.10
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "rx-l27-lifting",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 4,
    covers: ["4.9", "4.10"],
    title: "Lifting State Up and Controlled Components",
    subtitle: "Sharing state between components, controlled inputs and derived values",
    estimatedMinutes: 35,
    intro: "State belongs to one component. When two components need the same state, it moves up to their closest common parent and comes back down as props.",

    atoms: [
      {
        id: "a-rx-lifting-state",
        title: "Sharing state between components by lifting it up",
        explain:
          "If two siblings each keep their own copy of something, they can disagree. LIFT the state to their closest common parent; pass the value down as a prop and a function to change it (onSelect, onToggle) as another prop. The children become CONTROLLED by the parent: they display what they are told and report events upward. This is how React components \"talk\": data down through props, events up through callback props. Choose the lowest component that is above everyone who needs the value; higher than that and you re-render more than you need to.",
        webLab: reactLab({
          task:
            "Each FaqItem keeps its own open state, so several answers can be open at once. Only one should be open at a time. Lift the state into Faq: keep openId there, pass each item isOpen and an onToggle callback, and remove useState from FaqItem. Clicking an open item's question closes it.",
          files: {
            "src/App.jsx": `import { useState } from "react";

const faqs = [
  { id: "q1", question: "How long is the course?", answer: "Sixteen weeks." },
  { id: "q2", question: "Do I need to know JavaScript?", answer: "Module 0 covers what you need." },
  { id: "q3", question: "Is there a certificate?", answer: "Yes, after the final exam." },
];

function FaqItem({ faq }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="faq">
      <button aria-expanded={open} onClick={() => setOpen(!open)}>
        {faq.question}
      </button>
      {open && <p>{faq.answer}</p>}
    </div>
  );
}

export default function Faq() {
  return (
    <section>
      {faqs.map((faq) => (
        <FaqItem key={faq.id} faq={faq} />
      ))}
    </section>
  );
}
`,
          },
          tests: [
            { label: "Opening one closes the other", check: "const b = () => $$('.faq button'); await click(b()[0]); await click(b()[1]); return $$('.faq p').length === 1 && text('.faq p') === 'Module 0 covers what you need.' && b()[1].getAttribute('aria-expanded') === 'true' && b()[0].getAttribute('aria-expanded') === 'false';", fail: "Keep a single openId in Faq." },
            { label: "Clicking the open one closes it", check: "await click($$('.faq button')[1]); return $$('.faq p').length === 0;", fail: "onToggle sets openId to null when the item is already open." },
            { label: "FaqItem has no state of its own", check: "const c = code('src/App.jsx'); const item = c.slice(c.indexOf('function FaqItem'), c.indexOf('export default')); return !/useState/.test(item) && /isOpen/.test(item) && /onToggle/.test(item);", fail: "function FaqItem({ faq, isOpen, onToggle })" },
          ],
          solution: {
            "src/App.jsx": `import { useState } from "react";

const faqs = [
  { id: "q1", question: "How long is the course?", answer: "Sixteen weeks." },
  { id: "q2", question: "Do I need to know JavaScript?", answer: "Module 0 covers what you need." },
  { id: "q3", question: "Is there a certificate?", answer: "Yes, after the final exam." },
];

function FaqItem({ faq, isOpen, onToggle }) {
  return (
    <div className="faq">
      <button aria-expanded={isOpen} onClick={onToggle}>
        {faq.question}
      </button>
      {isOpen && <p>{faq.answer}</p>}
    </div>
  );
}

export default function Faq() {
  const [openId, setOpenId] = useState(null);
  return (
    <section>
      {faqs.map((faq) => (
        <FaqItem
          key={faq.id}
          faq={faq}
          isOpen={openId === faq.id}
          onToggle={() => setOpenId(openId === faq.id ? null : faq.id)}
        />
      ))}
    </section>
  );
}
`,
          },
          hint: "One openId in the parent; each item asks \"is it me?\" with openId === faq.id.",
          successMessage: "One source of truth, so the items cannot disagree.",
        }),
      },
      {
        id: "a-rx-controlled-derived",
        title: "Controlled components and derived values",
        explain:
          "An input is CONTROLLED when React state holds its value: <input value={amount} onChange={(e) => setAmount(e.target.value)} />. The state is the single source of truth: you can clear it, format it or validate it from anywhere. (An input with value but no onChange is read-only, and React warns.) DERIVED VALUES are calculated from state during render, not stored: const total = Number(amount) * rate. They are always correct, because they are recalculated every render. Remember that input values are strings: convert with Number() before doing arithmetic.",
        webLab: reactLab({
          task:
            "Build a fee calculator. A controlled number input labelled \"Number of students\" holds the count in state (start at \"1\"). Show the subtotal (count × ₦15,000), a 10% discount when the count is 5 or more, and the total, each in its own <output> with the ids subtotal, discount and total, formatted like \"₦75,000\". Do not store any of the three in state.",
          files: {
            "src/App.jsx": `const FEE = 15000;
const naira = (n) => "₦" + n.toLocaleString("en-NG");

export default function App() {
  return (
    <form>
      <label htmlFor="count">Number of students</label>
      <input id="count" type="number" min="1" />
      <p>Subtotal: <output id="subtotal"></output></p>
      <p>Discount: <output id="discount"></output></p>
      <p>Total: <output id="total"></output></p>
    </form>
  );
}
`,
          },
          tests: [
            { label: "It starts at 1 student: ₦15,000", check: "return $('#count').value === '1' && text('#subtotal') === '₦15,000' && text('#discount') === '₦0' && text('#total') === '₦15,000';", fail: "useState(\"1\") and value={count} on the input." },
            { label: "5 students get 10% off", check: "await type('#count', '5'); return text('#subtotal') === '₦75,000' && text('#discount') === '₦7,500' && text('#total') === '₦67,500';", fail: "discount = students >= 5 ? subtotal * 0.1 : 0" },
            { label: "The input is controlled", check: "return /value=\\{\\s*count\\s*\\}/.test(code('src/App.jsx')) && /onChange=/.test(code('src/App.jsx'));", fail: "value={count} onChange={(e) => setCount(e.target.value)}" },
            { label: "Only the count is state", check: "return (code('src/App.jsx').match(/useState\\(/g) || []).length === 1;", fail: "Calculate subtotal, discount and total during render." },
          ],
          solution: {
            "src/App.jsx": `import { useState } from "react";

const FEE = 15000;
const naira = (n) => "₦" + n.toLocaleString("en-NG");

export default function App() {
  const [count, setCount] = useState("1");
  const students = Number(count) || 0;
  const subtotal = students * FEE;
  const discount = students >= 5 ? subtotal * 0.1 : 0;
  const total = subtotal - discount;

  return (
    <form>
      <label htmlFor="count">Number of students</label>
      <input id="count" type="number" min="1" value={count} onChange={(e) => setCount(e.target.value)} />
      <p>Subtotal: <output id="subtotal">{naira(subtotal)}</output></p>
      <p>Discount: <output id="discount">{naira(discount)}</output></p>
      <p>Total: <output id="total">{naira(total)}</output></p>
    </form>
  );
}
`,
          },
          hint: "Keep the raw string in state; convert it with Number() for the arithmetic.",
          successMessage: "One input in state, three values derived from it, and none of them can be wrong.",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 28 · 4.11 – 4.13
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "rx-l28-identity",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 5,
    covers: ["4.11", "4.12", "4.13"],
    title: "Identity, Redundant State and Re-renders",
    subtitle: "When state is kept or reset, what not to store, and what re-renders when",
    estimatedMinutes: 35,
    intro: "Three ideas that separate React developers who guess from those who know: where state lives in the tree, what does not deserve to be state, and exactly which components run again.",

    atoms: [
      {
        id: "a-rx-identity-reset",
        title: "Resetting state and preserving component identity",
        explain:
          "React keeps a component's state as long as the SAME component type renders at the SAME position in the tree. Render <MessageBox /> for Ada, then for Tunde at the same place, and React treats it as the same box: the half-typed draft stays, now addressed to the wrong person. To get a fresh component, give it a different KEY: <MessageBox key={contact.id} contact={contact} />. A changed key tells React it is a different component, so the old one is removed with its state and a new one starts from its initial values. Rendering a different component type at a position also resets everything below it.",
        webLab: reactLab({
          task:
            "Type a message to Ada, then switch to Tunde: your draft is still there, addressed to Tunde. Make each contact get a fresh MessageBox by giving it a key from the contact's id. Do not move the state.",
          files: {
            "src/App.jsx": `import { useState } from "react";

const contacts = [
  { id: "ada", name: "Ada" },
  { id: "tunde", name: "Tunde" },
];

function MessageBox({ contact }) {
  const [draft, setDraft] = useState("");
  return (
    <div className="box">
      <label htmlFor="msg">Message to {contact.name}</label>
      <textarea id="msg" value={draft} onChange={(e) => setDraft(e.target.value)} />
    </div>
  );
}

export default function App() {
  const [to, setTo] = useState(contacts[0]);
  return (
    <>
      {contacts.map((c) => (
        <button key={c.id} onClick={() => setTo(c)}>
          {c.name}
        </button>
      ))}
      <MessageBox contact={to} />
    </>
  );
}
`,
          },
          tests: [
            { label: "Switching contact starts an empty draft", check: "await type('#msg', 'See you at 5'); await click($$('button')[1]); return nameOf('#msg') === 'Message to Tunde' && $('#msg').value === '';", fail: "<MessageBox key={to.id} contact={to} />" },
            { label: "Typing still works after switching", check: "await type('#msg', 'Hello Tunde'); return $('#msg').value === 'Hello Tunde';", fail: "The textarea is still controlled by MessageBox's own state." },
            { label: "The key comes from the contact", check: "return /<MessageBox[^>]*key=\\{\\s*to\\.id\\s*\\}/.test(code('src/App.jsx'));", fail: "key={to.id}" },
          ],
          solution: {
            "src/App.jsx": `import { useState } from "react";

const contacts = [
  { id: "ada", name: "Ada" },
  { id: "tunde", name: "Tunde" },
];

function MessageBox({ contact }) {
  const [draft, setDraft] = useState("");
  return (
    <div className="box">
      <label htmlFor="msg">Message to {contact.name}</label>
      <textarea id="msg" value={draft} onChange={(e) => setDraft(e.target.value)} />
    </div>
  );
}

export default function App() {
  const [to, setTo] = useState(contacts[0]);
  return (
    <>
      {contacts.map((c) => (
        <button key={c.id} onClick={() => setTo(c)}>
          {c.name}
        </button>
      ))}
      <MessageBox key={to.id} contact={to} />
    </>
  );
}
`,
          },
          hint: "A key is not only for lists: on any component, a new key means a new instance.",
          successMessage: "Same position and type keeps state; a new key resets it.",
        }),
      },
      {
        id: "a-rx-redundant-state",
        title: "Avoiding duplicated or unnecessary state",
        explain:
          "Common redundant state: a fullName next to firstName and lastName (derive it); a filtered list next to the list and the filter (derive it); a copy of a prop in state (use the prop, or name it initialX if you really only want its first value); and a selected OBJECT that duplicates an item in a list. Store the selected ID instead and look the item up: const selected = items.find((i) => i.id === selectedId). Then editing the item in the list automatically updates the selection, because there is only one copy.",
        webLab: reactLab({
          task:
            "The app stores the selected product as a copy of the object. Renaming a product updates the list but the \"Selected\" panel keeps showing the old name. Fix it by storing only selectedId in state and finding the selected product from the list during render.",
          files: {
            "src/App.jsx": `import { useState } from "react";

export default function App() {
  const [products, setProducts] = useState([
    { id: 1, name: "Tote bag" },
    { id: 2, name: "Sandals" },
  ]);
  const [selected, setSelected] = useState(products[0]);

  function rename(id) {
    setProducts(products.map((p) => (p.id === id ? { ...p, name: p.name + " (new)" } : p)));
  }

  return (
    <>
      <ul>
        {products.map((p) => (
          <li key={p.id}>
            <button onClick={() => setSelected(p)}>{p.name}</button>
            <button onClick={() => rename(p.id)} aria-label={"Rename " + p.name}>
              ✎
            </button>
          </li>
        ))}
      </ul>
      <p className="selected">Selected: {selected.name}</p>
    </>
  );
}
`,
          },
          tests: [
            { label: "Selecting shows the product", check: "await click($$('li')[1].querySelector('button')); return text('.selected') === 'Selected: Sandals';", fail: "Store the id: setSelectedId(p.id)." },
            { label: "Renaming the selected product updates the panel", check: "await click($$('li')[1].querySelectorAll('button')[1]); return text('.selected') === 'Selected: Sandals (new)';", fail: "const selected = products.find((p) => p.id === selectedId);" },
            { label: "State holds the id, not a copy", check: "return /selectedId/.test(code('src/App.jsx')) && !/setSelected\\(\\s*p\\s*\\)/.test(code('src/App.jsx'));", fail: "useState(1) for selectedId." },
          ],
          solution: {
            "src/App.jsx": `import { useState } from "react";

export default function App() {
  const [products, setProducts] = useState([
    { id: 1, name: "Tote bag" },
    { id: 2, name: "Sandals" },
  ]);
  const [selectedId, setSelectedId] = useState(1);
  const selected = products.find((p) => p.id === selectedId);

  function rename(id) {
    setProducts(products.map((p) => (p.id === id ? { ...p, name: p.name + " (new)" } : p)));
  }

  return (
    <>
      <ul>
        {products.map((p) => (
          <li key={p.id}>
            <button onClick={() => setSelectedId(p.id)}>{p.name}</button>
            <button onClick={() => rename(p.id)} aria-label={"Rename " + p.name}>
              ✎
            </button>
          </li>
        ))}
      </ul>
      <p className="selected">Selected: {selected.name}</p>
    </>
  );
}
`,
          },
          hint: "One copy of each product: the one in the list.",
          successMessage: "Store ids, derive objects. Duplicates are where stale data hides.",
        }),
      },
      {
        id: "a-rx-render-cycles",
        title: "Understanding render cycles and component re-renders",
        explain:
          "When a component's state changes, React re-renders THAT component and, by default, every component it renders, all the way down, whether their props changed or not. Parents above it, and siblings beside it, do not re-render. Re-rendering is usually cheap: it calls functions and compares JSX; the DOM only changes where the output differs. So a re-render is not a problem in itself, and you should not try to prevent them until something is measurably slow (Module 14). What matters for correctness is that rendering is pure, so running a component again is always safe.",
        example: "App\n├── Header\n└── Catalogue        ← setSearch() called here\n    ├── SearchBox    re-renders\n    └── CourseList   re-renders\n        └── CourseCard × 12   re-render\n\nApp and Header do not re-render.",
        decision: {
          scenario: "In the tree above, the search text is state in Catalogue. The user types one letter.",
          question: "Which components re-render?",
          options: [
            { id: "a", text: "Catalogue and everything inside it: SearchBox, CourseList and every CourseCard", why: "A state change re-renders its component and its whole subtree. App and Header are outside it." },
            { id: "b", text: "Only SearchBox", whyWrong: "The state lives in Catalogue, so Catalogue renders, and its children render with it." },
            { id: "c", text: "The whole app, including Header", whyWrong: "Parents and siblings of Catalogue are not affected." },
            { id: "d", text: "Nothing re-renders; only the DOM changes", whyWrong: "React has to re-render to know what the DOM should be." },
          ],
          correct: "a",
          aftermath: "State changes re-render downward from where the state lives. Keep state as low as it can be.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 29 · 4.P
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "rx-l29-m4-project",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 6,
    covers: ["4.P"],
    title: "Practical: A Task Manager",
    subtitle: "Add, edit, complete, delete and filter, with immutable state updates",
    estimatedMinutes: 60,
    intro: "The Module 4 practical is the classic test of whether state makes sense to you: a task manager where every action is one immutable update and every count is derived.",

    atoms: [
      {
        id: "a-rx-m4-project",
        title: "Build the task manager",
        explain:
          "Two pieces of state are enough: the array of tasks and the current filter. Each action is a new array (spread to add, filter to delete, map to complete or rename). The visible list and the \"N left\" count are calculated during render.",
        webLab: reactLab({
          task:
            "Build the task manager. A form with an input labelled \"New task\" and an Add button adds a task (ignore blank input; clear the input after adding). Each task is an <li className=\"task\"> with a checkbox labelled by the task's text that toggles done (done tasks get the class \"done\"), an Edit button that turns the text into an input labelled \"Edit TEXT\" which saves on Enter or a Save button, and a Delete button with aria-label \"Delete TEXT\". Filter buttons All, Active and Done (with aria-pressed) choose which tasks show, and <p role=\"status\"> shows \"N tasks left\" (tasks not done, in the whole list).",
          files: {
            "src/App.jsx": `import { useState } from "react";

const START = [
  { id: 1, text: "Read about state", done: true },
  { id: 2, text: "Build the stepper", done: false },
];

export default function App() {
  return <h1>Tasks</h1>;
}
`,
          },
          revealSolution: false,
          tests: [
            { label: "Starts with two tasks and \"1 tasks left\"", check: "return $$('li.task').length === 2 && text('[role=status]') === '1 tasks left' && $$('li.task')[0].classList.contains('done');", fail: "Render START with the done class and the derived count." },
            { label: "Adding a task (blank input ignored, input cleared)", check: "const input = $$('input').find((i) => nameOf(i) === 'New task'); if (!input) return false; await submit(input.form); const blank = $$('li.task').length === 2; await type(input, 'Write tests'); await submit(input.form); return blank && $$('li.task').length === 3 && $$('li.task')[2].textContent.includes('Write tests') && input.value === '' && text('[role=status]') === '2 tasks left';", fail: "In onSubmit: preventDefault, trim, ignore empty, add a new task, clear the input." },
            { label: "The checkbox toggles done", check: "const box = $$('li.task input[type=checkbox]').find((b) => nameOf(b) === 'Build the stepper'); if (!box) return false; await click(box); return $$('li.task')[1].classList.contains('done') && text('[role=status]') === '1 tasks left';", fail: "A checkbox inside a <label> with the task text; toggle with map." },
            { label: "Edit renames a task", check: "const li = $$('li.task')[2]; const edit = [...li.querySelectorAll('button')].find((b) => text(b) === 'Edit'); if (!edit) return false; await click(edit); const input = $$('input').find((i) => nameOf(i) === 'Edit Write tests'); if (!input) return false; await type(input, 'Write component tests'); await submit(input.form); return !$$('input').some((i) => nameOf(i).startsWith('Edit ')) && $$('li.task')[2].textContent.includes('Write component tests');", fail: "Keep the id being edited in state; save the new text on Enter." },
            { label: "Filters show active and done tasks", check: "const f = (n) => $$('button').find((b) => text(b) === n); await click(f('Done')); const done = $$('li.task').length === 2 && f('Done').getAttribute('aria-pressed') === 'true'; await click(f('Active')); const active = $$('li.task').length === 1 && $$('li.task')[0].textContent.includes('Write component tests'); await click(f('All')); return done && active && $$('li.task').length === 3;", fail: "filter state: \"all\", \"active\" or \"done\"; derive the visible list." },
            { label: "Delete removes a task", check: "const del = $$('button').find((b) => nameOf(b) === 'Delete Read about state'); if (!del) return false; await click(del); return $$('li.task').length === 2 && !text('#root').includes('Read about state');", fail: "aria-label={\"Delete \" + task.text}, and filter it out." },
            { label: "Every update is immutable", check: "const c = code('src/App.jsx'); return !/\\.push\\(|\\.splice\\(|\\.done\\s*=[^=]|\\.text\\s*=[^=]/.test(c);", fail: "Use spread, map and filter." },
          ],
          solution: {
            "src/App.jsx": `import { useState } from "react";

const START = [
  { id: 1, text: "Read about state", done: true },
  { id: 2, text: "Build the stepper", done: false },
];

const FILTERS = { All: () => true, Active: (t) => !t.done, Done: (t) => t.done };

export default function App() {
  const [tasks, setTasks] = useState(START);
  const [filter, setFilter] = useState("All");
  const [draft, setDraft] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  const visible = tasks.filter(FILTERS[filter]);
  const left = tasks.filter((t) => !t.done).length;

  function add(e) {
    e.preventDefault();
    const text = draft.trim();
    if (!text) return;
    setTasks([...tasks, { id: Date.now(), text, done: false }]);
    setDraft("");
  }
  const toggle = (id) => setTasks(tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  const remove = (id) => setTasks(tasks.filter((t) => t.id !== id));
  function startEdit(task) {
    setEditingId(task.id);
    setEditText(task.text);
  }
  function save(e) {
    e.preventDefault();
    setTasks(tasks.map((t) => (t.id === editingId ? { ...t, text: editText.trim() || t.text } : t)));
    setEditingId(null);
  }

  return (
    <main>
      <h1>Tasks</h1>
      <form onSubmit={add}>
        <label htmlFor="new">New task</label>
        <input id="new" value={draft} onChange={(e) => setDraft(e.target.value)} />
        <button>Add</button>
      </form>
      <div>
        {Object.keys(FILTERS).map((f) => (
          <button key={f} aria-pressed={filter === f} onClick={() => setFilter(f)}>
            {f}
          </button>
        ))}
      </div>
      <p role="status">{left} tasks left</p>
      <ul>
        {visible.map((task) => (
          <li key={task.id} className={task.done ? "task done" : "task"}>
            {editingId === task.id ? (
              <form onSubmit={save}>
                <input aria-label={"Edit " + task.text} value={editText} onChange={(e) => setEditText(e.target.value)} />
                <button>Save</button>
              </form>
            ) : (
              <>
                <label>
                  <input type="checkbox" checked={task.done} onChange={() => toggle(task.id)} /> {task.text}
                </label>
                <button onClick={() => startEdit(task)}>Edit</button>
                <button aria-label={"Delete " + task.text} onClick={() => remove(task.id)}>
                  🗑
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
    </main>
  );
}
`,
          },
          hint: "A form inside the edit row makes Enter save without any key handling.",
          successMessage: "Every action an immutable update, every count derived. You can now trace any state change in your head.",
        }),
      },
    ],
    task: {
      title: "Module 4 practical: your task manager",
      intro: "Build the task manager in your own Vite project and extend it.",
      prompts: [
        "Add, edit, complete, delete and filter, as in the lab.",
        "Add a \"Clear completed\" button and a \"Mark all done\" toggle, both immutable.",
        "Show the task counts per filter on the filter buttons (\"Active (3)\"), derived, not stored.",
        "Open React DevTools and watch the tasks state change as you work.",
        "Mastery checkpoint: pick one action (say, completing a task) and trace it aloud: the event, the setter, the new array, the re-render, and exactly what changes on screen.",
      ],
      closing: "Next: Module 5, forms and validation.",
    },
    requirements: { read: true, video: false, assessment: true },
  },
];
