/**
 * OBJECT ORIENTED PROGRAMMING (JAVASCRIPT) · WEEK 15 · INTRODUCTION TO REACT
 *
 * Curriculum 15.1 – 15.10. Phase 7.
 *
 * JSX needs a compiler, so React components are shown as worked examples.
 * The graded practices are the plain JavaScript that React is built on and
 * that beginners get wrong — UI as a function of state, immutable updates,
 * keys, conditional values, effect dependencies — and the content validator
 * executes every one of them in Node.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

export const SECTION_ID = "js-s15-react";

const JS = "javascript";

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 56 · 15.1 – 15.3
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "js-l56-components-jsx",
    moduleId: "js-w15-react",
    sectionId: SECTION_ID,
    order: 1,
    covers: ["15.1", "15.2", "15.3"],
    title: "Components and JSX",
    subtitle: "Why React exists, setting it up, and your first component",
    estimatedMinutes: 18,
    intro:
      "In Week 10 you wrote a render function that rebuilt a list from an array every time the data changed. React is that idea, made automatic and scaled up to whole applications. Everything you have learned, functions, objects, arrays, map and filter, immutability, is exactly what React code is made of.",

    atoms: [
      {
        id: "a-js-why-components",
        title: "Why component-based UI exists",
        explain:
          "Hand-written DOM code gets harder with every feature: each event must remember which elements to update, and pages drift out of sync with the data. React flips it around. You describe what the interface should look like for the current data, and React works out the DOM changes. Interfaces are built from components: small, reusable functions that each own one piece of the screen.",
        codeExercise: {
          language: JS,
          code: 'const TaskItem = (task) => `<li class="${task.done ? "done" : ""}">${task.title}</li>`;\nconst TaskList = (tasks) => `<ul>${tasks.map(TaskItem).join("")}</ul>`;\nconst Counter = (tasks) => `<p>${tasks.filter((t) => !t.done).length} left</p>`;\nconst App = (state) => TaskList(state.tasks) + Counter(state.tasks);\n\nlet state = { tasks: [{ title: "Rice", done: true }, { title: "Read", done: false }] };\nconsole.log(App(state));\n\nstate = { tasks: [...state.tasks, { title: "Run", done: false }] };\nconsole.log(App(state));\n',
          question: "Here the idea is shown with plain functions returning strings: each component is a function of data. What is printed after each state?",
          expectedOutput: "<ul><li class=\"done\">Rice</li><li class=\"\">Read</li></ul><p>1 left</p>\n<ul><li class=\"done\">Rice</li><li class=\"\">Read</li><li class=\"\">Run</li></ul><p>2 left</p>",
          hint: "App calls TaskList and Counter with the same tasks. Adding a task changes the data; the same functions then produce the new output.",
          successMessage:
            "UI = f(state). You changed the data and called the same function, and both the list and the counter updated, with no code that patches individual elements. React does exactly this, except it produces real DOM, and updates only the parts that changed.",
        },
        why: "Notice that the counter could never disagree with the list: both are computed from the same data every time. That consistency is the reason React took over front-end development.",
      },
      {
        id: "a-js-react-setup",
        title: "Setting up React with Vite",
        explain:
          "Vite from Week 14 creates React projects too. The template gives you an index.html with an empty <div id=\"root\">, a main.jsx that tells React to render your App component into it, and App.jsx, your first component. Files containing JSX use the .jsx extension.",
        example:
          "> npm create vite@latest my-tasks\n    ✔ Select a framework: › React\n    ✔ Select a variant:   › JavaScript\n> cd my-tasks\n> npm install\n> npm run dev\n\nsrc/main.jsx\n\n  import { StrictMode } from \"react\";\n  import { createRoot } from \"react-dom/client\";\n  import App from \"./App.jsx\";\n\n  createRoot(document.getElementById(\"root\")).render(\n    <StrictMode>\n      <App />\n    </StrictMode>\n  );",
        why: "That is the only place your code touches the real DOM directly. From here on, you describe components and React manages the page.",
      },
      {
        id: "a-js-components-jsx",
        title: "Components and JSX",
        explain:
          "A React component is a JavaScript function, named with a capital letter, that returns JSX. JSX looks like HTML but is JavaScript: it is compiled into function calls. Inside JSX, curly braces { } insert any JavaScript expression. A few attribute names differ from HTML because they are JavaScript property names: className instead of class, htmlFor instead of for.",
        example:
          "function Greeting() {\n  const name = \"Ada\";\n  const tasksLeft = 3;\n  return (\n    <section className=\"greeting\">\n      <h1>Welcome back, {name}!</h1>\n      <p>You have {tasksLeft} {tasksLeft === 1 ? \"task\" : \"tasks\"} left.</p>\n    </section>\n  );\n}\n\nexport default function App() {\n  return (\n    <main>\n      <Greeting />\n      <Greeting />\n    </main>\n  );\n}\n\nOn the page: the greeting appears twice. A component is used\nlike a tag, <Greeting />, and can be reused as often as you like.",
        table: {
          caption: "JSX rules that catch people.",
          headers: ["Rule", "Wrong", "Right"],
          rows: [
            ["Component names start with a capital", "<greeting />", "<Greeting />"],
            ["className, not class", "<div class=\"card\">", "<div className=\"card\">"],
            ["One parent element (or a fragment)", "return <h1/><p/>;", "return <><h1/><p/></>;"],
            ["Every tag is closed", "<img src={url}>", "<img src={url} />"],
            ["Braces hold expressions, not statements", "{if (x) {…}}", "{x ? a : b}"],
          ],
        },
        why: "Because JSX is JavaScript, everything you know applies directly: braces take any expression, including function calls, template literals and the ternary operator from Week 5. React also escapes text placed in braces automatically, so the cross-site scripting risk from Week 10 is handled for you.",
      },
      {
        id: "a-js-jsx-is-js",
        title: "JSX is safe text by default",
        explain:
          "When you write {comment} in JSX, React inserts it as text, exactly like textContent. A user's \"<script>\" appears as characters, not code. The only way to insert raw HTML is a property deliberately named dangerouslySetInnerHTML, so the dangerous version cannot be used by accident.",
        decision: {
          scenario: "A React review component must show a customer's comment, which may contain any characters at all.",
          question: "How should it be rendered?",
          options: [
            {
              id: "a",
              text: "<p className=\"review\">{review.comment}</p>",
              why: "React escapes values in braces, so whatever the comment contains is shown as text and can never run. Safe by default, with nothing to remember.",
            },
            {
              id: "b",
              text: "<p dangerouslySetInnerHTML={{ __html: review.comment }} />",
              whyWrong: "This is React's innerHTML, and the name is a warning. Any markup in a customer's comment would become live HTML: the XSS hole from Week 10.",
            },
            {
              id: "c",
              text: "Build the HTML with a template literal and insert it with document.querySelector",
              whyWrong: "That bypasses React entirely, fights React for control of the DOM, and reintroduces the injection risk.",
            },
            {
              id: "d",
              text: "Strip every < and > character from the comment first, then use dangerouslySetInnerHTML",
              whyWrong: "Hand-rolled filtering is fragile and unnecessary. Plain braces already render it safely.",
            },
          ],
          correct: "a",
          aftermath: "If you find yourself typing dangerouslySetInnerHTML, stop and ask whether the content could ever have come from a user. If it could, do not.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 57 · 15.4 – 15.5
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "js-l57-props-state",
    moduleId: "js-w15-react",
    sectionId: SECTION_ID,
    order: 2,
    covers: ["15.4", "15.5"],
    title: "Props and State",
    subtitle: "Data passed in, and data a component owns",
    estimatedMinutes: 19,
    intro:
      "A component that always shows the same thing is not much use. Props let a parent pass data into a component, the way arguments pass data into a function. State lets a component remember data that changes over time, such as what has been typed or how many times a button was pressed. Together they are almost all of React.",

    atoms: [
      {
        id: "a-js-props",
        title: "Props and component composition",
        explain:
          "Props are the attributes you write on a component's tag. React collects them into one object and passes it as the function's first argument, which is usually destructured, exactly as in Week 8. Props are read-only: a component must never change its own props. Building bigger components out of smaller ones, passing data down through props, is called composition.",
        example:
          "function TaskItem({ title, done }) {\n  return <li className={done ? \"done\" : \"\"}>{title}</li>;\n}\n\nfunction Card({ heading, children }) {\n  return (\n    <section className=\"card\">\n      <h2>{heading}</h2>\n      {children}\n    </section>\n  );\n}\n\nexport default function App() {\n  return (\n    <Card heading=\"Today\">\n      <ul>\n        <TaskItem title=\"Buy rice\" done={true} />\n        <TaskItem title=\"Call Mum\" done={false} />\n      </ul>\n    </Card>\n  );\n}\n\nchildren is a special prop: whatever is written between\n<Card> and </Card>. It is how layout components wrap content.",
        why: "Props make components reusable the way parameters made functions reusable in Week 6. TaskItem knows how to show any task; the parent decides which.",
      },
      {
        id: "a-js-state",
        title: "State with useState()",
        explain:
          "useState(initial) gives a component a piece of memory. It returns an array of two things: the current value and a function to change it, usually destructured as [value, setValue]. Calling setValue tells React the data has changed, and React calls your component again to get the new UI. You never change the value directly.",
        example:
          "import { useState } from \"react\";\n\nfunction LikeButton() {\n  const [likes, setLikes] = useState(0);\n\n  return (\n    <button onClick={() => setLikes(likes + 1)}>\n      ♥ {likes}\n    </button>\n  );\n}\n\nClick 1: setLikes(1) → React runs LikeButton again → shows ♥ 1\nClick 2: setLikes(2) → shows ♥ 2\n\nlikes = likes + 1 would change a local variable,\nReact would never know, and the button would never update.",
        why: "Each time the component function runs, likes is a fresh constant holding the value for that render. setLikes does not change it; it schedules a new render with a new value. Thinking of each render as a snapshot is the key to understanding React.",
      },
      {
        id: "a-js-immutable-updates",
        title: "Updating objects and arrays in state",
        explain:
          "React decides whether state changed by comparing the old and new values with Object.is, the same reference comparison as === from Week 9. If you push into the existing array and set it again, it is the same array, React sees no change, and nothing updates. So state is always updated by creating a NEW array or object, with spread, map and filter.",
        codeExercise: {
          language: JS,
          code: 'let tasks = [{ id: 1, title: "Rice", done: false }];\n\nconst mutated = tasks;\nmutated.push({ id: 2, title: "Read", done: false });\nconsole.log("after push, same array?", Object.is(tasks, mutated));\n\nconst added = [...tasks, { id: 3, title: "Run", done: false }];\nconsole.log("after spread, same array?", Object.is(tasks, added));\n\nconst toggled = added.map((t) => (t.id === 1 ? { ...t, done: true } : t));\nconsole.log(Object.is(added[0], toggled[0]), Object.is(added[1], toggled[1]));\nconsole.log(toggled.map((t) => `${t.title}:${t.done}`).join(" "));\n',
          question: "React notices a change only when Object.is(old, new) is false. Which of these updates would React notice? What is printed?",
          expectedOutput: "after push, same array? true\nafter spread, same array? false\nfalse true\nRice:true Read:false Run:false",
          hint: "push changes the existing array, so the reference is the same. Spread and map create new arrays. In the map, only the toggled task becomes a new object; the others are reused.",
          successMessage:
            "push kept the same reference, so React would ignore it. Spread and map produced new arrays that React would see. And map with a spread copied only the object that changed: unchanged tasks keep their identity, which lets React skip re-rendering them.",
        },
        mistake:
          "tasks.push(newTask); setTasks(tasks); The data changed but the reference did not, so the screen does not update, and the bug looks like React is broken. Write setTasks([...tasks, newTask]).",
      },
      {
        id: "a-js-state-updater",
        title: "Updating from the previous value",
        explain:
          "When the new state depends on the old, pass setState a function: setCount((c) => c + 1). React calls it with the latest value. This matters when several updates happen at once, because each render's count is a fixed snapshot, so setCount(count + 1) three times in a row only adds one.",
        codeExercise: {
          language: JS,
          code: 'function makeState(initial) {\n  let value = initial;\n  const queue = [];\n  const set = (next) => queue.push(next);\n  const render = () => {\n    for (const next of queue) value = typeof next === "function" ? next(value) : next;\n    queue.length = 0;\n    return value;\n  };\n  return { get: () => value, set, render };\n}\n\nconst a = makeState(0);\nconst snapshotA = a.get();\na.set(snapshotA + 1);\na.set(snapshotA + 1);\na.set(snapshotA + 1);\nconsole.log(a.render());\n\nconst b = makeState(0);\nb.set((c) => c + 1);\nb.set((c) => c + 1);\nb.set((c) => c + 1);\nconsole.log(b.render());\n',
          question: "makeState imitates how React queues updates until the next render. One counter uses the snapshot value, the other uses updater functions. What is printed?",
          expectedOutput: "1\n3",
          hint: "snapshotA is 0 for all three calls, so each queued value is 1. Updater functions each receive the result of the previous one.",
          successMessage:
            "1 and 3. snapshotA + 1 is 1 every time, because the snapshot never changes during a render. Updater functions chain, because each one receives the latest value. Use the function form whenever the next state is calculated from the current one.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 58 · 15.6 – 15.8
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "js-l58-events-lists-conditional",
    moduleId: "js-w15-react",
    sectionId: SECTION_ID,
    order: 3,
    covers: ["15.6", "15.7", "15.8"],
    title: "Events, Lists and Conditional Rendering",
    subtitle: "Making components respond, repeat and change",
    estimatedMinutes: 18,
    intro:
      "Three things every real interface needs: responding to the user, showing a list of things, and showing different things in different situations. In React all three are plain JavaScript you already know, written inside JSX.",

    atoms: [
      {
        id: "a-js-react-events",
        title: "Event handling in React",
        explain:
          "In JSX you attach a handler with a camelCase prop such as onClick, onChange or onSubmit, passing a function. React gives the handler an event object much like the DOM's, with preventDefault and target. To pass data to a handler, wrap the call in an arrow function, so it runs on click rather than during render.",
        example:
          "function TaskItem({ task, onToggle, onDelete }) {\n  return (\n    <li>\n      <label>\n        <input\n          type=\"checkbox\"\n          checked={task.done}\n          onChange={() => onToggle(task.id)}\n        />\n        {task.title}\n      </label>\n      <button type=\"button\" onClick={() => onDelete(task.id)}>\n        Delete\n      </button>\n    </li>\n  );\n}\n\nonClick={onDelete(task.id)}   ✗ calls it during render, on every render\nonClick={() => onDelete(task.id)}   ✓ calls it when clicked",
        why: "The child does not change the tasks itself: it calls functions passed down as props. State lives in the parent that owns the list, and children report events upwards. Data down, events up is the shape of every React application.",
      },
      {
        id: "a-js-lists-keys",
        title: "Rendering lists and using keys",
        explain:
          "To render a list, map an array to JSX inside braces. Each element must have a key prop: a value that identifies that item uniquely and stays the same across renders, almost always the item's id. React uses keys to match old and new elements when the list changes, so it can update, move or remove exactly the right ones.",
        example:
          "function TaskList({ tasks, onToggle, onDelete }) {\n  return (\n    <ul>\n      {tasks.map((task) => (\n        <TaskItem\n          key={task.id}\n          task={task}\n          onToggle={onToggle}\n          onDelete={onDelete}\n        />\n      ))}\n    </ul>\n  );\n}",
        codeExercise: {
          language: JS,
          code: 'const before = ["Rice", "Read", "Run"];\nconst after = ["Read", "Run"];\n\nconst byIndex = (list) => list.map((title, i) => `${i}=${title}`);\nconst byId = (list) => list.map((title) => `${title.toLowerCase()}=${title}`);\n\nconsole.log(byIndex(before).join(" "), "|", byIndex(after).join(" "));\nconsole.log(byId(before).join(" "), "|", byId(after).join(" "));\n\nconst stillThere = (keysBefore, keysAfter) =>\n  keysBefore.filter((k) => keysAfter.includes(k)).length;\nconsole.log(stillThere(byIndex(before), byIndex(after)), stillThere(byId(before), byId(after)));\n',
          question: "The first task is deleted. Compare which key=title pairs survive when keys are positions versus stable ids. What is printed?",
          expectedOutput: "0=Rice 1=Read 2=Run | 0=Read 1=Run\nrice=Rice read=Read run=Run | read=Read run=Run\n0 2",
          hint: "With index keys, every remaining item's key now points at a different title. With id keys, Read and Run keep the same keys.",
          successMessage:
            "With index keys, no key still matches its old item, so React thinks every row changed: a checkbox's ticked state or a half-typed edit can end up on the wrong task. With stable ids, the two surviving items are recognised. Use ids, not indexes.",
        },
      },
      {
        id: "a-js-conditional-rendering",
        title: "Conditional rendering",
        explain:
          "To show different UI in different situations, use the tools from Week 5 inside braces: the ternary for one thing or another, and && for something or nothing. For more than two cases, decide in ordinary JavaScript before the return, or return early. Returning null renders nothing.",
        example:
          "function TaskPanel({ status, tasks, error }) {\n  if (status === \"loading\") return <p>Loading…</p>;\n  if (status === \"error\") return <p role=\"alert\">Could not load: {error}</p>;\n\n  return (\n    <section>\n      {tasks.length === 0 ? (\n        <p>No tasks yet. Add your first one above.</p>\n      ) : (\n        <TaskList tasks={tasks} />\n      )}\n      {tasks.some((t) => t.done) && <button>Clear completed</button>}\n    </section>\n  );\n}",
        codeExercise: {
          language: JS,
          code: 'const show = (value) => (value === false || value === null || value === undefined || value === true ? "(nothing)" : String(value));\n\nconst tasks = [];\nconsole.log(show(tasks.length && "You have tasks"));\nconsole.log(show(tasks.length > 0 && "You have tasks"));\nconsole.log(show(tasks.length === 0 ? "No tasks yet" : "List"));\nconsole.log(show(null));\n',
          question: "React renders nothing for false, null, undefined and true, but it DOES render numbers, including 0. show imitates that rule. What is printed?",
          expectedOutput: "0\n(nothing)\nNo tasks yet\n(nothing)",
          hint: "tasks.length is 0. 0 && anything gives 0, and 0 is a number, so it is rendered.",
          successMessage:
            "The first line is the famous React bug: {tasks.length && <List />} prints a stray 0 on the page when the list is empty. Make the left side a real boolean, tasks.length > 0, and it renders nothing.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 59 · 15.9 – 15.10
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "js-l59-forms-effects",
    moduleId: "js-w15-react",
    sectionId: SECTION_ID,
    order: 4,
    covers: ["15.9", "15.10"],
    title: "Forms and Effects",
    subtitle: "Controlled inputs, useEffect and fetching data",
    estimatedMinutes: 19,
    intro:
      "The last two pieces. Controlled inputs make form fields part of your state, so validation is ordinary JavaScript. And useEffect lets a component do things outside rendering, such as fetching data from an API or saving to localStorage, at the right moments.",

    atoms: [
      {
        id: "a-js-controlled-inputs",
        title: "Forms and controlled inputs",
        explain:
          "A controlled input takes its value from state and reports every change through onChange, which updates the state. The state is then the single source of truth for what is in the field, so you can validate as the user types, clear the field after submitting, or disable the button while it is empty.",
        example:
          "function AddTask({ onAdd }) {\n  const [title, setTitle] = useState(\"\");\n  const [error, setError] = useState(\"\");\n\n  function handleSubmit(event) {\n    event.preventDefault();\n    const clean = title.trim();\n    if (!clean) {\n      setError(\"Enter a task title.\");\n      return;\n    }\n    onAdd(clean);\n    setTitle(\"\");\n    setError(\"\");\n  }\n\n  return (\n    <form onSubmit={handleSubmit}>\n      <label htmlFor=\"title\">New task</label>\n      <input\n        id=\"title\"\n        value={title}\n        onChange={(e) => setTitle(e.target.value)}\n      />\n      <button disabled={!title.trim()}>Add</button>\n      {error && <p role=\"alert\">{error}</p>}\n    </form>\n  );\n}",
        why: "Everything from Week 11 is still here: submit, preventDefault, trimming, an alert region and a real label. React only changes where the value lives: in state rather than in the DOM.",
        mistake:
          "Setting value={title} and forgetting onChange. The field becomes read-only, because every keystroke is immediately replaced by the unchanged state. React warns about it in the console.",
      },
      {
        id: "a-js-form-state",
        title: "Form state as one object",
        explain:
          "For forms with several fields, keep one state object and update a single field with a spread, using each input's name to choose which. It is Week 8's spread and Week 8's bracket notation, together.",
        codeExercise: {
          language: JS,
          code: 'let form = { name: "", email: "", age: "" };\n\nfunction handleChange(event) {\n  const { name, value } = event.target;\n  form = { ...form, [name]: value };\n}\n\nhandleChange({ target: { name: "name", value: "Ada" } });\nhandleChange({ target: { name: "email", value: "ada@memora.ng" } });\nhandleChange({ target: { name: "name", value: "Ada Obi" } });\n\nconsole.log(form);\n',
          question: "One handler serves every field, using the input's name. Three changes arrive. What is the final form state?",
          expectedOutput: "{ name: 'Ada Obi', email: 'ada@memora.ng', age: '' }",
          hint: "[name]: value uses the VALUE of name as the key. The third change replaces the first.",
          successMessage:
            "One handler, any number of fields. The square brackets around name are a computed key: the property's name comes from a variable, exactly like bracket notation for reading.",
        },
      },
      {
        id: "a-js-use-effect",
        title: "Effects with useEffect()",
        explain:
          "Rendering must only calculate UI. Anything else, a side effect such as fetching data, saving to localStorage or starting a timer, goes in useEffect(callback, dependencies). React runs the callback after rendering. The dependency array says when to run it again: [] means only after the first render; [city] means whenever city changes. The callback may return a clean-up function, run before the next effect and when the component is removed.",
        example:
          "function Weather({ city }) {\n  const [state, setState] = useState({ status: \"loading\" });\n\n  useEffect(() => {\n    let cancelled = false;\n    setState({ status: \"loading\" });\n\n    fetch(`/api/weather?city=${encodeURIComponent(city)}`)\n      .then((r) => {\n        if (!r.ok) throw new Error(`HTTP ${r.status}`);\n        return r.json();\n      })\n      .then((data) => !cancelled && setState({ status: \"success\", data }))\n      .catch((err) => !cancelled && setState({ status: \"error\", error: err.message }));\n\n    return () => {\n      cancelled = true;   // city changed or component removed: ignore the old answer\n    };\n  }, [city]);\n\n  if (state.status === \"loading\") return <p>Loading…</p>;\n  if (state.status === \"error\") return <p role=\"alert\">{state.error}</p>;\n  return <p>{state.data.city}: {state.data.tempC}°C</p>;\n}",
        why: "This is Week 12's loading, success and error pattern inside a component. The clean-up matters: if the user switches from Lagos to Abuja quickly, the slow Lagos response must not overwrite Abuja's.",
      },
      {
        id: "a-js-effect-deps",
        title: "When does an effect run again?",
        explain:
          "After each render, React compares each dependency with its value from the previous render using Object.is. If any differs, the effect runs again. No array at all means after every render. That makes objects and arrays created during render a trap: they are new every time, so an effect depending on one runs after every render.",
        codeExercise: {
          language: JS,
          code: 'function shouldRun(prevDeps, nextDeps) {\n  if (nextDeps === undefined) return true;\n  if (prevDeps === undefined) return true;\n  return nextDeps.some((dep, i) => !Object.is(dep, prevDeps[i]));\n}\n\nconsole.log(shouldRun(["Lagos"], ["Lagos"]));\nconsole.log(shouldRun(["Lagos"], ["Abuja"]));\nconsole.log(shouldRun([], []));\nconsole.log(shouldRun([{ city: "Lagos" }], [{ city: "Lagos" }]));\nconsole.log(shouldRun(["Lagos"], undefined));\n',
          question: "shouldRun mirrors React's rule for re-running an effect. What is printed?",
          expectedOutput: "false\ntrue\nfalse\ntrue\ntrue",
          hint: "Strings compare by value. An empty array has no dependencies to differ. Two separately created objects are never Object.is equal. No dependency array means always.",
          successMessage:
            "The fourth line is the infinite-loop bug: an object dependency created during render is new every time, so the effect re-runs every render, and if it sets state, forever. Depend on primitives, like city, wherever you can.",
        },
      },
      {
        id: "a-js-effect-choice",
        title: "Does this need an effect?",
        explain:
          "Effects are for synchronising with something outside React. Values that can be calculated from props and state do not need an effect at all; calculate them during render.",
        decision: {
          scenario: "A component has tasks in state and needs to show how many are done. A teammate writes a doneCount state and a useEffect that recalculates it whenever tasks change.",
          question: "What is the better approach?",
          options: [
            {
              id: "a",
              text: "Calculate it during render: const doneCount = tasks.filter((t) => t.done).length;",
              why: "It is derived data: it can always be worked out from tasks. Calculating it in render means it can never be out of date, and it avoids an extra render every time tasks change.",
            },
            {
              id: "b",
              text: "Keep the effect; it is the React way to update values",
              whyWrong: "It renders twice for every change, first with a stale count and then with the right one, and it duplicates information that already exists in tasks.",
            },
            {
              id: "c",
              text: "Store doneCount in localStorage",
              whyWrong: "Storage is for persisting data between visits. A count that can be calculated in a microsecond does not need persisting.",
            },
            {
              id: "d",
              text: "Recalculate it in every event handler that changes tasks",
              whyWrong: "Every handler must now remember to update it, and the one that forgets introduces a bug. Derive it once, in render.",
            },
          ],
          correct: "a",
          aftermath: "A good test: if it can be computed from props and state, it is not state and it does not need an effect. Use effects to talk to the outside world: the network, storage, timers, the document.",
        },
      },
    ],

    task: {
      title: "Project: the to-do app, in React",
      intro:
        "Rebuild your Week 14 to-do application with React and Vite. Reuse the models and logic modules unchanged; rewrite only the UI.",
      prompts: [
        "Break the interface into components: App, AddTask, TaskList, TaskItem, FilterBar and StatusLine. Pass data down as props and events up as callback props.",
        "Keep the tasks in useState in App, and update them only with new arrays and objects (spread, map, filter). Render the list with map and a stable key from each task's id.",
        "Make AddTask a controlled form with validation, an error message in a role=\"alert\" element, and a button disabled while the field is empty.",
        "Use conditional rendering for the empty state and for a Clear completed button that only appears when something is done. Derive counts during render instead of storing them.",
        "Save tasks to localStorage in a useEffect that depends on tasks, and load them once with a lazy initial state: useState(() => restore(localStorage.getItem(KEY))). Deploy it.",
      ],
      closing:
        "If your Week 14 structure was right, the models and logic folders did not change at all. That is the real lesson of the last three weeks: frameworks change; well-separated logic survives them.",
    },

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
