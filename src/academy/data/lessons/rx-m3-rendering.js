/**
 * REACT DEVELOPMENT · MODULE 3 · RENDERING DATA AND HANDLING EVENTS
 *
 * Curriculum 3.1 – 3.P. Lists with map() and keys, conditional rendering,
 * empty states, click, submit and input events, event objects, passing
 * arguments, updating the UI (useState, introduced here and taught fully in
 * Module 4), badges and status indicators, and the classic mistakes.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

import { reactLab } from "./rx-helpers.js";

export const SECTION_ID = "rx-s3-rendering";
const MODULE = "rx-m3-rendering";

const CATALOGUE = `export const courses = [
  { id: 1, title: "HTML & CSS", category: "Design", level: "Beginner", price: 0 },
  { id: 2, title: "JavaScript", category: "Programming", level: "Beginner", price: 15000 },
  { id: 3, title: "React", category: "Programming", level: "Intermediate", price: 30000 },
  { id: 4, title: "UI Design", category: "Design", level: "Beginner", price: 20000 },
  { id: 5, title: "Data Analysis", category: "Data", level: "Beginner", price: 25000 },
];
`;

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 19 · 3.1 – 3.2
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "rx-l19-lists-keys",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 1,
    covers: ["3.1", "3.2"],
    title: "Rendering Lists and Keys",
    subtitle: "Turning arrays into elements with map(), and why every item needs a key",
    estimatedMinutes: 30,
    intro: "Almost every screen is a list of something: courses, messages, orders, students. In React, a list of data becomes a list of elements with one array method.",

    atoms: [
      {
        id: "a-rx-map-render",
        title: "Rendering arrays with map()",
        explain:
          "JSX can render an array of elements: {[<li>A</li>, <li>B</li>]} shows both. So to render data, map it to elements: {students.map((s) => <li key={s.id}>{s.name}</li>)}. map returns a new array of JSX, which React renders in order. Chain with filter to show part of a list: {students.filter((s) => s.active).map(…)}. Keep the mapping readable: when an item's JSX grows past a few lines, move it into its own component and map to that.",
        webLab: reactLab({
          task:
            "Render the students as rows of the table: one <tr> per student in <tbody>, with three <td>s for name, course and score. Then, under the table, render a <ul className=\"top\"> listing ONLY the names of students who scored 70 or more (filter, then map).",
          files: {
            "src/App.jsx": `const students = [
  { id: "s1", name: "Ada", course: "React", score: 88 },
  { id: "s2", name: "Tunde", course: "CSS", score: 64 },
  { id: "s3", name: "Ngozi", course: "React", score: 91 },
  { id: "s4", name: "Musa", course: "JavaScript", score: 70 },
];

export default function App() {
  return (
    <>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Course</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>{/* one row per student */}</tbody>
      </table>
      {/* top students */}
    </>
  );
}
`,
          },
          tests: [
            { label: "One row per student, with name, course and score", check: "const r = $$('tbody tr'); return r.length === 4 && [...r[1].children].map((td) => text(td)).join() === 'Tunde,CSS,64';", fail: "students.map((s) => <tr key={s.id}><td>{s.name}</td>…</tr>)" },
            { label: "The top list shows only scores of 70 or more", check: "return $$('ul.top li').map((li) => text(li)).join() === 'Ada,Ngozi,Musa';", fail: "students.filter((s) => s.score >= 70).map(…)" },
            { label: "Rendered with map, not typed by hand", check: "const c = code('src/App.jsx'); return (c.match(/\\.map\\(/g) || []).length >= 2 && /\\.filter\\(/.test(c) && !/<td>Tunde/.test(c);", fail: "Generate the rows from the array." },
          ],
          solution: {
            "src/App.jsx": `const students = [
  { id: "s1", name: "Ada", course: "React", score: 88 },
  { id: "s2", name: "Tunde", course: "CSS", score: 64 },
  { id: "s3", name: "Ngozi", course: "React", score: 91 },
  { id: "s4", name: "Musa", course: "JavaScript", score: 70 },
];

export default function App() {
  return (
    <>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Course</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          {students.map((s) => (
            <tr key={s.id}>
              <td>{s.name}</td>
              <td>{s.course}</td>
              <td>{s.score}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <ul className="top">
        {students
          .filter((s) => s.score >= 70)
          .map((s) => (
            <li key={s.id}>{s.name}</li>
          ))}
      </ul>
    </>
  );
}
`,
          },
          hint: "Inside <tbody>, open braces and map each student to a <tr>.",
          successMessage: "Data in, rows out. Add a fifth student and a fifth row appears.",
        }),
      },
      {
        id: "a-rx-keys",
        title: "Understanding the purpose of the key prop",
        explain:
          "When a list changes, React compares the new list with the old one to decide which elements to keep, move, add or remove. The KEY tells it which item is which: an element with key=\"c3\" is the same item as last time, even if it moved. Keys must be unique among siblings and STABLE: the item's id from the data. Do not use the array index when items can be added, removed or reordered: inserting at the top shifts every index, so React thinks each item became the next one, and anything held inside the elements (typed text, focus, state) ends up on the wrong item. A missing key gives the warning \"Each child in a list should have a unique key prop\". Try it below: type a note on the first course, then press the button.",
        webLab: reactLab({
          task:
            "Type a note next to \"JavaScript\", then press Add course to the top. With key={index}, the note jumps to the new first row, the wrong course. Fix it by giving each row a stable key from the data.",
          files: {
            "src/App.jsx": `import { useState } from "react";

const initial = [
  { id: "c2", title: "JavaScript" },
  { id: "c3", title: "React" },
];

export default function App() {
  const [courses, setCourses] = useState(initial);

  function addToTop() {
    setCourses([{ id: "c1", title: "HTML & CSS" }, ...courses]);
  }

  return (
    <>
      <button onClick={addToTop} disabled={courses.length === 3}>
        Add course to the top
      </button>
      <ul>
        {courses.map((course, index) => (
          <li key={index}>
            <span>{course.title}</span> <input aria-label={"Notes for " + course.title} />
          </li>
        ))}
      </ul>
    </>
  );
}
`,
          },
          tests: [
            { label: "A typed note stays with its course when a course is added above", check: "await type('li input', 'Finish module 3'); await click('button'); const row = $$('li').find((li) => li.querySelector('span').textContent === 'JavaScript'); return !!row && row.querySelector('input').value === 'Finish module 3' && $$('li input')[0].value === '';", fail: "Use key={course.id} so React knows which row is which." },
            { label: "The key comes from the data, not the index", check: "return /key=\\{\\s*course\\.id\\s*\\}/.test(code('src/App.jsx'));", fail: "key={course.id}" },
          ],
          solution: {
            "src/App.jsx": `import { useState } from "react";

const initial = [
  { id: "c2", title: "JavaScript" },
  { id: "c3", title: "React" },
];

export default function App() {
  const [courses, setCourses] = useState(initial);

  function addToTop() {
    setCourses([{ id: "c1", title: "HTML & CSS" }, ...courses]);
  }

  return (
    <>
      <button onClick={addToTop} disabled={courses.length === 3}>
        Add course to the top
      </button>
      <ul>
        {courses.map((course) => (
          <li key={course.id}>
            <span>{course.title}</span> <input aria-label={"Notes for " + course.title} />
          </li>
        ))}
      </ul>
    </>
  );
}
`,
          },
          hint: "Each course already has an id. Use it.",
          successMessage: "Stable keys keep each element attached to its own data. Index keys only work for lists that never change order.",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 20 · 3.3 – 3.4
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "rx-l20-conditional",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 2,
    covers: ["3.3", "3.4"],
    title: "Conditional Rendering and Empty States",
    subtitle: "if, ternaries and &&, and what to show when there is nothing to show",
    estimatedMinutes: 30,
    intro: "The same component often shows different things: a sign-in button or a profile picture, a list or \"no results\". There are three ways to choose, each best at something.",

    atoms: [
      {
        id: "a-rx-conditionals",
        title: "Conditional rendering with if, ternaries and logical operators",
        explain:
          "1. if with an early return, for whole different outputs: if (!user) return <p>Please sign in</p>; 2. A TERNARY inside JSX, to pick one of two pieces: {paid ? <Receipt /> : <PayButton />}. 3. && to show something or nothing: {isAdmin && <AdminLink />}. Beware && with numbers: {count && <Badge />} renders a 0 on screen when count is 0, because 0 is falsy and && returns it. Write {count > 0 && <Badge />} instead. Returning null renders nothing at all.",
        webLab: reactLab({
          task:
            "Finish OrderStatus. With no order (order is null) it returns <p>No order yet</p> using an early return. Otherwise it shows <h2>Order ORDER_ID</h2>, then \"Paid\" or \"Awaiting payment\" in <p className=\"payment\"> using a ternary on order.paid, then <p className=\"warning\">N items out of stock</p> ONLY when order.outOfStock is more than 0. Watch the 0: the second order must not show a stray 0.",
          files: {
            "src/App.jsx": `function OrderStatus({ order }) {
  return <div className="order">Order</div>;
}

export default function App() {
  return (
    <>
      <OrderStatus order={null} />
      <OrderStatus order={{ id: "A17", paid: true, outOfStock: 2 }} />
      <OrderStatus order={{ id: "B09", paid: false, outOfStock: 0 }} />
    </>
  );
}
`,
          },
          tests: [
            { label: "No order: \"No order yet\"", check: "return text($('#root').children[0]) === 'No order yet';", fail: "if (!order) return <p>No order yet</p>;" },
            { label: "Order heading and payment status", check: "const o = $$('.order'); return o.length === 2 && text(o[0].querySelector('h2')) === 'Order A17' && text(o[0].querySelector('.payment')) === 'Paid' && text(o[1].querySelector('.payment')) === 'Awaiting payment';", fail: "{order.paid ? \"Paid\" : \"Awaiting payment\"}" },
            { label: "The warning shows only when items are out of stock", check: "const o = $$('.order'); return text(o[0].querySelector('.warning')) === '2 items out of stock' && !o[1].querySelector('.warning');", fail: "{order.outOfStock > 0 && <p className=\"warning\">…</p>}" },
            { label: "No stray 0 on the second order", check: "return text($$('.order')[1]) === 'Order B09Awaiting payment';", fail: "Compare with > 0 instead of using the number itself." },
          ],
          solution: {
            "src/App.jsx": `function OrderStatus({ order }) {
  if (!order) return <p>No order yet</p>;
  return (
    <div className="order">
      <h2>Order {order.id}</h2>
      <p className="payment">{order.paid ? "Paid" : "Awaiting payment"}</p>
      {order.outOfStock > 0 && <p className="warning">{order.outOfStock} items out of stock</p>}
    </div>
  );
}

export default function App() {
  return (
    <>
      <OrderStatus order={null} />
      <OrderStatus order={{ id: "A17", paid: true, outOfStock: 2 }} />
      <OrderStatus order={{ id: "B09", paid: false, outOfStock: 0 }} />
    </>
  );
}
`,
          },
          hint: "{order.outOfStock && …} shows 0 for the second order; compare with > 0.",
          successMessage: "if for whole outputs, ternary for either-or, && (with a real boolean) for show-or-hide.",
        }),
      },
      {
        id: "a-rx-empty-states",
        title: "Showing empty states and fallback content",
        explain:
          "Every list can be empty: no courses yet, no search results, an empty cart. A blank space looks broken, so show an EMPTY STATE: what is missing, why, and what to do next (\"No courses match \\\"rust\\\". Try another search.\"). Fallbacks also cover missing data inside items: a missing photo shows initials; a missing description shows \"No description yet\". The ?? operator gives a fallback for null or undefined: {course.description ?? \"No description yet\"}.",
        webLab: reactLab({
          task:
            "CourseList must handle an empty list: when courses is empty, render <p className=\"empty\">No courses match \"QUERY\". Try another search.</p> instead of an empty <ul> (the query prop holds the search text). Inside each item, show the description, or \"No description yet\" when it is missing (use ??).",
          files: {
            "src/App.jsx": `function CourseList({ courses, query }) {
  return (
    <ul>
      {courses.map((c) => (
        <li key={c.id}>
          <strong>{c.title}</strong> <span className="desc">{c.description}</span>
        </li>
      ))}
    </ul>
  );
}

export default function App() {
  return (
    <>
      <section className="results-1">
        <CourseList query="react" courses={[{ id: 1, title: "React", description: "Components and Hooks" }, { id: 2, title: "React Native" }]} />
      </section>
      <section className="results-2">
        <CourseList query="rust" courses={[]} />
      </section>
    </>
  );
}
`,
          },
          tests: [
            { label: "An empty list shows the empty-state message", check: "return text('.results-2 .empty') === 'No courses match \"rust\". Try another search.';", fail: "if (courses.length === 0) return <p className=\"empty\">…</p>;" },
            { label: "No empty <ul> is rendered", check: "return !$('.results-2 ul');", fail: "Return the message instead of the list." },
            { label: "Missing descriptions get a fallback", check: "return $$('.results-1 .desc').map((s) => text(s)).join('|') === 'Components and Hooks|No description yet';", fail: "{c.description ?? \"No description yet\"}" },
          ],
          solution: {
            "src/App.jsx": `function CourseList({ courses, query }) {
  if (courses.length === 0) {
    return <p className="empty">No courses match "{query}". Try another search.</p>;
  }
  return (
    <ul>
      {courses.map((c) => (
        <li key={c.id}>
          <strong>{c.title}</strong> <span className="desc">{c.description ?? "No description yet"}</span>
        </li>
      ))}
    </ul>
  );
}

export default function App() {
  return (
    <>
      <section className="results-1">
        <CourseList query="react" courses={[{ id: 1, title: "React", description: "Components and Hooks" }, { id: 2, title: "React Native" }]} />
      </section>
      <section className="results-2">
        <CourseList query="rust" courses={[]} />
      </section>
    </>
  );
}
`,
          },
          hint: "Quotes inside JSX text are fine: <p>No courses match \"{query}\".</p>",
          successMessage: "Empty is a state too, and now it explains itself.",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 21 · 3.5 – 3.7
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "rx-l21-events",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 3,
    covers: ["3.5", "3.6", "3.7"],
    title: "Handling Events",
    subtitle: "Clicks, form submissions and input, event objects, and passing arguments",
    estimatedMinutes: 35,
    intro: "Events are how users talk to your app. React handles them with props that take functions, so the handler lives right next to the element it belongs to.",

    atoms: [
      {
        id: "a-rx-event-types",
        title: "Handling clicks, form submissions and input events",
        explain:
          "Pass a FUNCTION to an event prop: <button onClick={handleClick}>, <form onSubmit={handleSubmit}>, <input onChange={handleChange}>. Names are camelCase (onClick, not onclick). In React, onChange fires on every keystroke, like the DOM's input event. For forms, handle onSubmit on the <form>, not onClick on the button, so pressing Enter works too, and call event.preventDefault() first, or the browser reloads the page. By convention handlers are named handleSomething and props that take them onSomething.",
        webLab: reactLab({
          task:
            "Wire up the three events. Clicking \"Save draft\" logs \"Draft saved\". Submitting the form (button or Enter) must NOT reload the page and logs \"Subscribed: \" followed by the email typed. Typing in the input logs nothing yet; instead the form's onSubmit reads the value with new FormData(event.target).get(\"email\").",
          files: {
            "src/App.jsx": `export default function App() {
  return (
    <>
      <button type="button">Save draft</button>
      <form>
        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" />
        <button type="submit">Subscribe</button>
      </form>
    </>
  );
}
`,
          },
          tests: [
            { label: "Save draft logs \"Draft saved\"", check: "await click('button[type=button]'); return output().includes('Draft saved');", fail: "onClick={() => console.log(\"Draft saved\")}" },
            { label: "Submitting logs the email and does not reload", check: "await type('#email', 'ada@example.com'); await submit('form'); return output().includes('Subscribed: ada@example.com') && submissions().length === 0;", fail: "onSubmit: event.preventDefault(), then log the FormData value." },
            { label: "The form is handled with onSubmit, not a click on the button", check: "return /<form[^>]*onSubmit=/.test(code('src/App.jsx'));", fail: "Put onSubmit on the <form>." },
          ],
          solution: {
            "src/App.jsx": `export default function App() {
  function handleSubmit(event) {
    event.preventDefault();
    const email = new FormData(event.target).get("email");
    console.log("Subscribed: " + email);
  }

  return (
    <>
      <button type="button" onClick={() => console.log("Draft saved")}>
        Save draft
      </button>
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" />
        <button type="submit">Subscribe</button>
      </form>
    </>
  );
}
`,
          },
          hint: "submissions() is the list of real page-reloading submits the checker saw; preventDefault keeps it empty.",
          successMessage: "Click, submit, and no reload. Module 5 builds full forms on this.",
        }),
      },
      {
        id: "a-rx-event-objects",
        title: "Event handlers and event objects",
        explain:
          "React calls your handler with an EVENT OBJECT: function handleChange(event). It is React's wrapper around the browser's event, with the same useful parts: event.target is the element (event.target.value is an input's text, event.target.checked a checkbox's state); event.key is the key pressed in keyboard events; event.preventDefault() cancels the default action; event.stopPropagation() stops the event reaching parent elements' handlers. A handler is defined inside the component so it can read the component's props and variables (a closure, Module 0).",
        webLab: reactLab({
          task:
            "Build a search box that reacts to keys. In handleKeyDown: when event.key is \"Enter\", log \"Search: \" plus the input's current value (event.target.value); when it is \"Escape\", clear the input (event.target.value = \"\") and log \"Cleared\".",
          files: {
            "src/App.jsx": `export default function App() {
  function handleKeyDown(event) {
    // your code here
  }

  return (
    <>
      <label htmlFor="search">Search courses</label>
      <input id="search" onKeyDown={handleKeyDown} />
    </>
  );
}
`,
          },
          tests: [
            { label: "Enter logs the search text", check: "$('#search').value = 'hooks'; await key('#search', 'Enter'); return output().includes('Search: hooks');", fail: "if (event.key === \"Enter\") console.log(\"Search: \" + event.target.value);" },
            { label: "Escape clears the input and logs Cleared", check: "$('#search').value = 'css'; await key('#search', 'Escape'); return $('#search').value === '' && output().includes('Cleared');", fail: "On Escape, set event.target.value to \"\" and log Cleared." },
            { label: "Other keys do nothing", check: "const before = logs().length; await key('#search', 'a'); return logs().length === before;", fail: "Only react to Enter and Escape." },
          ],
          solution: {
            "src/App.jsx": `export default function App() {
  function handleKeyDown(event) {
    if (event.key === "Enter") {
      console.log("Search: " + event.target.value);
    } else if (event.key === "Escape") {
      event.target.value = "";
      console.log("Cleared");
    }
  }

  return (
    <>
      <label htmlFor="search">Search courses</label>
      <input id="search" onKeyDown={handleKeyDown} />
    </>
  );
}
`,
          },
          hint: "event.key holds names such as \"Enter\" and \"Escape\".",
          successMessage: "The event object tells you what happened and where.",
        }),
      },
      {
        id: "a-rx-event-arguments",
        title: "Passing arguments to event handlers",
        explain:
          "To tell a handler WHICH item was clicked, wrap the call in an arrow function: onClick={() => handleEnroll(course.id)}. The arrow is the function React calls later; it then calls your handler with the argument. Writing onClick={handleEnroll(course.id)} is a bug: it CALLS handleEnroll during rendering, once per item, and passes its return value (undefined) as the handler. If you also need the event: onClick={(e) => handleEnroll(course.id, e)}.",
        webLab: reactLab({
          task:
            "Each Enroll button should call handleEnroll with its course's id and title, which logs \"Enrolled in TITLE (ID)\". Right now the handler runs during rendering for every course (look at the console before clicking anything) and clicks do nothing. Fix the onClick.",
          files: {
            "src/App.jsx": `const courses = [
  { id: "c1", title: "HTML & CSS" },
  { id: "c2", title: "JavaScript" },
  { id: "c3", title: "React" },
];

export default function App() {
  function handleEnroll(id, title) {
    console.log("Enrolled in " + title + " (" + id + ")");
  }

  return (
    <ul>
      {courses.map((course) => (
        <li key={course.id}>
          {course.title} <button onClick={handleEnroll(course.id, course.title)}>Enroll</button>
        </li>
      ))}
    </ul>
  );
}
`,
          },
          tests: [
            { label: "Nothing is logged until a button is clicked", check: "return !output().includes('Enrolled');", fail: "onClick={handleEnroll(…)} calls it while rendering. Wrap it in an arrow function." },
            { label: "Clicking React's button enrolls in React", check: "await click($$('li button')[2]); return output().trim() === 'Enrolled in React (c3)';", fail: "onClick={() => handleEnroll(course.id, course.title)}" },
          ],
          solution: {
            "src/App.jsx": `const courses = [
  { id: "c1", title: "HTML & CSS" },
  { id: "c2", title: "JavaScript" },
  { id: "c3", title: "React" },
];

export default function App() {
  function handleEnroll(id, title) {
    console.log("Enrolled in " + title + " (" + id + ")");
  }

  return (
    <ul>
      {courses.map((course) => (
        <li key={course.id}>
          {course.title} <button onClick={() => handleEnroll(course.id, course.title)}>Enroll</button>
        </li>
      ))}
    </ul>
  );
}
`,
          },
          hint: "Pass React a function: () => handleEnroll(…)",
          successMessage: "Hand React a function to call later, never the result of calling it now.",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 22 · 3.8 – 3.10
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "rx-l22-updating-ui",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 4,
    covers: ["3.8", "3.9", "3.10"],
    title: "Updating the UI from User Actions",
    subtitle: "A first look at state, badges and status indicators, and the mistakes to avoid",
    estimatedMinutes: 35,
    intro: "Logging is not a user interface. To change what is on screen after a click, a component needs to remember something between renders, which is what state is for.",

    atoms: [
      {
        id: "a-rx-first-state",
        title: "Updating UI based on user actions",
        explain:
          "A normal variable inside a component is recreated on every render, and changing it does not tell React to render again, so the screen never changes. STATE is a value React remembers for the component, and changing it re-renders: const [open, setOpen] = useState(false) gives you the current value and a setter; calling setOpen(true) asks React to render the component again, this time with open as true. Module 4 explains exactly how this works; for now, the pattern is: event → setter → React re-renders → the JSX reflects the new value.",
        webLab: reactLab({
          task:
            "The \"Show details\" button changes a normal variable, so nothing happens on screen. Use state instead: const [showDetails, setShowDetails] = useState(false). The button toggles it; the details paragraph shows only when it is true; and the button's text switches between \"Show details\" and \"Hide details\".",
          files: {
            "src/App.jsx": `export default function App() {
  let showDetails = false;

  return (
    <article>
      <h2>React Development</h2>
      <button onClick={() => (showDetails = !showDetails)}>Show details</button>
      {showDetails && <p className="details">16 weeks · Intermediate · Certificate included</p>}
    </article>
  );
}
`,
          },
          tests: [
            { label: "Details are hidden at first", check: "return !$('.details') && text('button') === 'Show details';", fail: "Start with useState(false)." },
            { label: "Clicking shows them and the button says Hide details", check: "await click('button'); return !!$('.details') && text('button') === 'Hide details';", fail: "onClick={() => setShowDetails(!showDetails)}, and a ternary for the button text." },
            { label: "Clicking again hides them", check: "await click('button'); return !$('.details') && text('button') === 'Show details';", fail: "Toggle: set it to the opposite of its current value." },
            { label: "It uses useState", check: "return /useState\\(\\s*false\\s*\\)/.test(code('src/App.jsx'));", fail: "import { useState } from \"react\";" },
          ],
          solution: {
            "src/App.jsx": `import { useState } from "react";

export default function App() {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <article>
      <h2>React Development</h2>
      <button onClick={() => setShowDetails(!showDetails)}>{showDetails ? "Hide details" : "Show details"}</button>
      {showDetails && <p className="details">16 weeks · Intermediate · Certificate included</p>}
    </article>
  );
}
`,
          },
          hint: "Import useState from \"react\" and replace the let.",
          successMessage: "Event → setter → re-render. That loop is the heart of React, and Module 4 is all about it.",
        }),
      },
      {
        id: "a-rx-badges-status",
        title: "Rendering badges, notifications and status indicators",
        explain:
          "Status UI is conditional rendering plus a little care. A count badge hides at zero and caps big numbers (\"99+\"). A status pill maps a status value to a label and a class with an object, not a chain of ifs: const STATUS = { active: \"Active\", paused: \"Paused\" }. Do not rely on colour alone: include text or an icon, because some users cannot tell red from green. A notification that appears after an action goes in an element with role=\"status\" (polite) or role=\"alert\" (urgent) so screen readers announce it.",
        webLab: reactLab({
          task:
            "Finish NotificationBell: the <span className=\"badge\"> shows the count, shows \"99+\" above 99, and is not rendered at all at 0. Its button needs aria-label \"Notifications, N unread\" (with the real count). Then finish StatusPill: it renders <span className=\"pill pill-STATUS\"> with the label from the LABELS object.",
          files: {
            "src/App.jsx": `const LABELS = { active: "Active", paused: "Paused", ended: "Ended" };

function NotificationBell({ count }) {
  return (
    <button className="bell">
      🔔 <span className="badge">{count}</span>
    </button>
  );
}

function StatusPill({ status }) {
  return <span className="pill">{status}</span>;
}

export default function App() {
  return (
    <>
      <NotificationBell count={0} />
      <NotificationBell count={7} />
      <NotificationBell count={250} />
      <StatusPill status="active" />
      <StatusPill status="ended" />
    </>
  );
}
`,
          },
          tests: [
            { label: "No badge at 0, the count at 7, 99+ at 250", check: "const b = $$('.bell'); return !b[0].querySelector('.badge') && text(b[1].querySelector('.badge')) === '7' && text(b[2].querySelector('.badge')) === '99+';", fail: "{count > 0 && <span className=\"badge\">{count > 99 ? \"99+\" : count}</span>}" },
            { label: "Each bell is labelled with the unread count", check: "const b = $$('.bell'); return nameOf(b[0]) === 'Notifications, 0 unread' && nameOf(b[2]) === 'Notifications, 250 unread';", fail: "aria-label={\"Notifications, \" + count + \" unread\"}" },
            { label: "Pills use the label and a status class", check: "const p = $$('.pill'); return p[0].className === 'pill pill-active' && text(p[0]) === 'Active' && p[1].className === 'pill pill-ended' && text(p[1]) === 'Ended';", fail: "className={\"pill pill-\" + status} and {LABELS[status]}" },
          ],
          solution: {
            "src/App.jsx": `const LABELS = { active: "Active", paused: "Paused", ended: "Ended" };

function NotificationBell({ count }) {
  return (
    <button className="bell" aria-label={"Notifications, " + count + " unread"}>
      🔔 {count > 0 && <span className="badge">{count > 99 ? "99+" : count}</span>}
    </button>
  );
}

function StatusPill({ status }) {
  return <span className={"pill pill-" + status}>{LABELS[status]}</span>;
}

export default function App() {
  return (
    <>
      <NotificationBell count={0} />
      <NotificationBell count={7} />
      <NotificationBell count={250} />
      <StatusPill status="active" />
      <StatusPill status="ended" />
    </>
  );
}
`,
          },
          hint: "The aria-label gives the real number even when the badge shows 99+.",
          successMessage: "Readable to everyone, including people who cannot see the colours.",
        }),
      },
      {
        id: "a-rx-event-mistakes",
        title: "Avoiding common rendering and event-handling mistakes",
        explain:
          "The usual suspects: onClick={doThing()} (calls it during render; pass doThing or () => doThing(x)); onclick or onchange in lower case (React ignores them); a form submit without preventDefault (the page reloads and state is lost); {count && …} printing 0; keys from Math.random() (a new key every render, so React rebuilds every item); changing an array or object in place and expecting the screen to update (Module 4); a <div onClick> where a <button> belongs (no keyboard access). The lab has four of them.",
        webLab: reactLab({
          task:
            "This cart has four bugs. Fix them all: the Remove buttons run during render (and the handler is called with no click); the \"Clear cart\" button uses a lower-case onclick so it does nothing; keys are random; and the empty-cart check renders a stray 0. Clicking Remove must remove that item; Clear cart empties the cart and then the message \"Your cart is empty\" shows.",
          files: {
            "src/App.jsx": `import { useState } from "react";

const start = [
  { id: "p1", name: "Ankara tote bag" },
  { id: "p2", name: "Leather sandals" },
  { id: "p3", name: "Beaded bracelet" },
];

export default function App() {
  const [items, setItems] = useState(start);

  function remove(id) {
    setItems(items.filter((item) => item.id !== id));
  }

  return (
    <>
      <ul>
        {items.map((item) => (
          <li key={Math.random()}>
            {item.name} <button onClick={remove(item.id)}>Remove</button>
          </li>
        ))}
      </ul>
      {items.length && <button onclick={() => setItems([])}>Clear cart</button>}
      {items.length === 0 && <p className="empty">Your cart is empty</p>}
    </>
  );
}
`,
          },
          tests: [
            { label: "All three items show at first", check: "return $$('li').length === 3;", fail: "remove(item.id) runs while rendering; wrap it: () => remove(item.id)." },
            { label: "Remove removes that item", check: "await click($$('li button')[1]); return $$('li').map((li) => li.firstChild.textContent.trim()).join() === 'Ankara tote bag,Beaded bracelet';", fail: "onClick={() => remove(item.id)}" },
            { label: "Clear cart empties it, with no stray 0", check: "const clear = $$('button').find((b) => text(b) === 'Clear cart'); if (!clear) return false; await click(clear); return $$('li').length === 0 && text('#root') === 'Your cart is empty';", fail: "Use onClick, and items.length > 0 && … so 0 is not rendered." },
            { label: "Keys are stable ids", check: "return /key=\\{\\s*item\\.id\\s*\\}/.test(code('src/App.jsx')) && !/Math\\.random/.test(code('src/App.jsx'));", fail: "key={item.id}" },
          ],
          solution: {
            "src/App.jsx": `import { useState } from "react";

const start = [
  { id: "p1", name: "Ankara tote bag" },
  { id: "p2", name: "Leather sandals" },
  { id: "p3", name: "Beaded bracelet" },
];

export default function App() {
  const [items, setItems] = useState(start);

  function remove(id) {
    setItems(items.filter((item) => item.id !== id));
  }

  return (
    <>
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            {item.name} <button onClick={() => remove(item.id)}>Remove</button>
          </li>
        ))}
      </ul>
      {items.length > 0 && <button onClick={() => setItems([])}>Clear cart</button>}
      {items.length === 0 && <p className="empty">Your cart is empty</p>}
    </>
  );
}
`,
          },
          hint: "Read the console too: React warns about the lower-case onclick.",
          successMessage: "Four classic bugs found and fixed. You will spot them instantly in code reviews now.",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 23 · 3.P
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "rx-l23-m3-project",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 5,
    covers: ["3.P"],
    title: "Practical: An Interactive Course Catalogue",
    subtitle: "Category filters, live search and enrollment status",
    estimatedMinutes: 55,
    intro: "The Module 3 practical turns the catalogue from Module 2 into something people can use: filter it, search it, and enroll, with the screen following every action.",

    atoms: [
      {
        id: "a-rx-m3-project",
        title: "Build the interactive catalogue",
        explain:
          "Three pieces of state drive everything: the selected category, the search text and the set of enrolled course ids. The visible list is not state: it is CALCULATED from the data and those three values on every render, with filter. That is the idea Module 4 makes precise.",
        webLab: reactLab({
          task:
            "Build the catalogue in App.jsx. Category buttons (All, Design, Programming, Data) filter the list; the selected one has aria-pressed=\"true\". A search input labelled \"Search courses\" filters by title, ignoring case. Each course is an <li className=\"course\"> with its title in an <h3>, and a button that says \"Enroll\" or, once clicked, \"Enrolled ✓\" (clicking again un-enrolls). A <p role=\"status\"> shows \"N courses\" for the visible list, and when nothing matches, show <p className=\"empty\">No courses found</p> instead of the list.",
          files: {
            "src/App.jsx": `import { useState } from "react";
import { courses } from "./data/courses.js";

const CATEGORIES = ["All", "Design", "Programming", "Data"];

export default function App() {
  return <h1>Courses</h1>;
}
`,
            "src/data/courses.js": CATALOGUE,
          },
          readOnly: ["src/data/courses.js"],
          revealSolution: false,
          tests: [
            { label: "All five courses show at first, with a count", check: "return $$('li.course').length === 5 && text('[role=status]') === '5 courses';", fail: "Render every course as <li className=\"course\"> and the count in a role=status paragraph." },
            { label: "Category buttons filter, and mark the selected one", check: "const b = $$('button').find((x) => text(x) === 'Design'); if (!b) return false; await click(b); return $$('li.course h3').map((h) => text(h)).join() === 'HTML & CSS,UI Design' && b.getAttribute('aria-pressed') === 'true' && $$('button').find((x) => text(x) === 'All').getAttribute('aria-pressed') === 'false' && text('[role=status]') === '2 courses';", fail: "Keep the selected category in state; aria-pressed={category === c}." },
            { label: "Search filters by title, ignoring case", check: "const all = $$('button').find((x) => text(x) === 'All'); await click(all); const input = $$('input').find((i) => nameOf(i) === 'Search courses'); if (!input) return false; await type(input, 'JAVA'); return $$('li.course h3').map((h) => text(h)).join() === 'JavaScript';", fail: "Compare title.toLowerCase().includes(search.toLowerCase())." },
            { label: "Search and category combine, with an empty state", check: "const input = $$('input').find((i) => nameOf(i) === 'Search courses'); await type(input, 'react'); const d = $$('button').find((x) => text(x) === 'Design'); await click(d); return $$('li.course').length === 0 && text('.empty') === 'No courses found';", fail: "Apply both filters, and show the empty message when none are left." },
            { label: "Enroll toggles each course's status", check: "const all = $$('button').find((x) => text(x) === 'All'); await click(all); const input = $$('input').find((i) => nameOf(i) === 'Search courses'); await type(input, ''); const btn = () => $$('li.course')[2].querySelector('button'); await click(btn()); const on = text(btn()) === 'Enrolled ✓' && text($$('li.course')[1].querySelector('button')) === 'Enroll'; await click(btn()); return on && text(btn()) === 'Enroll';", fail: "Keep enrolled ids in state; toggle one on click." },
            { label: "The visible list is calculated, not stored in state", check: "return (code('src/App.jsx').match(/useState\\(/g) || []).length === 3 && /\\.filter\\(/.test(code('src/App.jsx'));", fail: "Three pieces of state (category, search, enrolled); calculate the visible list with filter." },
          ],
          solution: {
            "src/App.jsx": `import { useState } from "react";
import { courses } from "./data/courses.js";

const CATEGORIES = ["All", "Design", "Programming", "Data"];

export default function App() {
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [enrolled, setEnrolled] = useState([]);

  const visible = courses.filter(
    (c) =>
      (category === "All" || c.category === category) &&
      c.title.toLowerCase().includes(search.toLowerCase())
  );

  function toggle(id) {
    setEnrolled(enrolled.includes(id) ? enrolled.filter((x) => x !== id) : [...enrolled, id]);
  }

  return (
    <main>
      <h1>Courses</h1>
      <div className="filters">
        {CATEGORIES.map((c) => (
          <button key={c} aria-pressed={category === c} onClick={() => setCategory(c)}>
            {c}
          </button>
        ))}
      </div>
      <label htmlFor="search">Search courses</label>
      <input id="search" value={search} onChange={(e) => setSearch(e.target.value)} />
      <p role="status">{visible.length} courses</p>
      {visible.length === 0 ? (
        <p className="empty">No courses found</p>
      ) : (
        <ul>
          {visible.map((c) => (
            <li key={c.id} className="course">
              <h3>{c.title}</h3>
              <button onClick={() => toggle(c.id)}>{enrolled.includes(c.id) ? "Enrolled ✓" : "Enroll"}</button>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
`,
          },
          hint: "Write the three useState lines first, then compute visible from them, then the JSX.",
          successMessage: "Filter, search and enroll, all from three pieces of state. Module 4 explains why this works so reliably.",
        }),
      },
    ],
    task: {
      title: "Module 3 practical: extend your catalogue",
      intro: "Take your Module 2 catalogue project and make it interactive.",
      prompts: [
        "Add category filters as buttons with aria-pressed, and a labelled search input.",
        "Show an enrolled count in the header (\"2 enrolled\") and an empty state with a \"Clear filters\" button.",
        "Add a level filter (Beginner, Intermediate) as a <select>, combined with the others.",
        "Check every item has a stable key, and that nothing logs a warning in the console.",
        "Mastery checkpoint: explain, step by step, what happens between clicking a category button and the list changing on screen, and why the visible list does not need its own state.",
      ],
      closing: "Next: Module 4, state and the rendering model in depth.",
    },
    requirements: { read: true, video: false, assessment: true },
  },
];
