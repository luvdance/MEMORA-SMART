/**
 * ASSESSMENTS · OBJECT ORIENTED PROGRAMMING (JAVASCRIPT) · WEEK 15
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Never import this from anything under src/.
 * ═════════════════════════════════════════════════════════════════════════
 */

export const ASSESSMENTS = {
  /* ═══════════════════════════════════════════════════════════════════ */
  "js-l56-components-jsx": {
    lessonId: "js-l56-components-jsx",
    passMark: 70,
    questions: [
      {
        id: "jsq56-1",
        type: "mcq",
        difficulty: 2,
        atomId: "a-js-why-components",
        prompt: "What is the central idea of React?",
        options: [
          { id: "a", text: "You write code that patches individual DOM elements after each event" },
          { id: "b", text: "You describe the UI for the current data, and React updates the DOM to match" },
          { id: "c", text: "Pages are rendered on the server only" },
          { id: "d", text: "HTML is replaced by CSS" },
        ],
        correct: "b",
        explanation: "UI is a function of state. Change the state and React works out which DOM changes are needed.",
        whyWrong: {
          a: "That is the hand-written approach React replaces.",
          c: "React normally runs in the browser.",
          d: "React components still produce HTML elements.",
        },
      },
      {
        id: "jsq56-2",
        type: "mcq",
        difficulty: 2,
        atomId: "a-js-components-jsx",
        prompt: "Which JSX is correct?",
        options: [
          { id: "a", text: "<div class=\"card\">{title}</div>" },
          { id: "b", text: "<div className=\"card\">{title}</div>" },
          { id: "c", text: "<div className=\"card\">title</div> to show the variable" },
          { id: "d", text: "<Div className=\"card\">{title}</Div> for a normal div" },
        ],
        correct: "b",
        explanation: "JSX uses className, and braces insert the value of title.",
        whyWrong: {
          a: "class is a reserved word in JavaScript; JSX uses className.",
          c: "Without braces, the word title is shown as text.",
          d: "Capitalised tags are treated as components, not HTML elements.",
        },
      },
      {
        id: "jsq56-3",
        type: "mcq",
        difficulty: 2,
        atomId: "a-js-react-setup",
        prompt: "In a Vite React project, which file connects React to the page's <div id=\"root\">?",
        options: [
          { id: "a", text: "App.jsx" },
          { id: "b", text: "main.jsx, with createRoot(…).render(<App />)" },
          { id: "c", text: "package.json" },
          { id: "d", text: "style.css" },
        ],
        correct: "b",
        explanation: "main.jsx finds the root element and tells React to render the App component into it.",
        whyWrong: {
          a: "App.jsx defines the top component but does not attach it to the page.",
          c: "package.json lists dependencies and scripts.",
          d: "CSS styles the page; it cannot render components.",
        },
      },
      {
        id: "jsq56-4",
        type: "scenario",
        difficulty: 3,
        atomId: "a-js-jsx-is-js",
        prompt: "A comment containing <img src=x onerror=alert(1)> is rendered as <p>{comment}</p>. What happens?",
        options: [
          { id: "a", text: "The script runs" },
          { id: "b", text: "The characters are shown as text; React escapes values in braces" },
          { id: "c", text: "React throws an error" },
          { id: "d", text: "The comment is hidden" },
        ],
        correct: "b",
        explanation: "React inserts brace values as text, like textContent. Only dangerouslySetInnerHTML inserts raw HTML.",
        whyWrong: {
          a: "That would require dangerouslySetInnerHTML.",
          c: "Any string can be rendered as text.",
          d: "It is shown, harmlessly, as text.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "js-l57-props-state": {
    lessonId: "js-l57-props-state",
    passMark: 70,
    questions: [
      {
        id: "jsq57-1",
        type: "mcq",
        difficulty: 2,
        atomId: "a-js-props",
        prompt: "What are props?",
        options: [
          { id: "a", text: "Data a component owns and changes" },
          { id: "b", text: "Read-only data passed into a component by its parent" },
          { id: "c", text: "CSS properties" },
          { id: "d", text: "Global variables" },
        ],
        correct: "b",
        explanation: "Props flow from parent to child, like function arguments. A component must not change its own props.",
        whyWrong: {
          a: "That describes state.",
          c: "Props are JavaScript values passed to components.",
          d: "Props are scoped to the component that receives them.",
        },
      },
      {
        id: "jsq57-2",
        type: "scenario",
        difficulty: 3,
        atomId: "a-js-state",
        prompt: "const [count, setCount] = useState(0);\nA click handler runs count = count + 1. What happens on screen?",
        options: [
          { id: "a", text: "The count goes up" },
          { id: "b", text: "Nothing; React is never told, and count is a const anyway, so this throws" },
          { id: "c", text: "The component disappears" },
          { id: "d", text: "The count goes up on the next click" },
        ],
        correct: "b",
        explanation: "count is a const snapshot for this render, so reassigning it throws, and in any case only setCount triggers a re-render.",
        whyWrong: {
          a: "Only calling setCount updates the screen.",
          c: "Nothing removes the component.",
          d: "No click ever updates the screen without setCount.",
        },
      },
      {
        id: "jsq57-3",
        type: "scenario",
        difficulty: 3,
        atomId: "a-js-immutable-updates",
        prompt: "tasks.push(newTask); setTasks(tasks);\nWhy does the list not update?",
        options: [
          { id: "a", text: "push does not work on arrays in React" },
          { id: "b", text: "The array reference is unchanged, so React sees no change. Use setTasks([...tasks, newTask])" },
          { id: "c", text: "setTasks only accepts strings" },
          { id: "d", text: "The list needs a key" },
        ],
        correct: "b",
        explanation: "React compares old and new state with Object.is. Mutating and setting the same array looks like no change.",
        whyWrong: {
          a: "push works; it mutates the existing array, which is the problem.",
          c: "State can hold any value.",
          d: "Keys matter for list items, but they do not cause this.",
        },
      },
      {
        id: "jsq57-4",
        type: "scenario",
        difficulty: 3,
        atomId: "a-js-state-updater",
        prompt: "count is 0. A handler calls setCount(count + 1) three times. What is count after the re-render?",
        options: [
          { id: "a", text: "3" },
          { id: "b", text: "1" },
          { id: "c", text: "0" },
          { id: "d", text: "An error" },
        ],
        correct: "b",
        explanation: "count is the snapshot 0 in all three calls, so each sets it to 1. setCount((c) => c + 1) would give 3.",
        whyWrong: {
          a: "That needs the updater-function form.",
          c: "The updates are applied; they just all set the same value.",
          d: "Calling setCount several times is allowed.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "js-l58-events-lists-conditional": {
    lessonId: "js-l58-events-lists-conditional",
    passMark: 70,
    questions: [
      {
        id: "jsq58-1",
        type: "scenario",
        difficulty: 3,
        atomId: "a-js-react-events",
        prompt: "<button onClick={remove(task.id)}>Delete</button>\nWhat goes wrong?",
        options: [
          { id: "a", text: "Nothing" },
          { id: "b", text: "remove runs during every render instead of on click" },
          { id: "c", text: "onClick must be lower case" },
          { id: "d", text: "Buttons cannot have onClick" },
        ],
        correct: "b",
        explanation: "The brackets call remove immediately while rendering. Wrap it: onClick={() => remove(task.id)}.",
        whyWrong: {
          a: "Every render would delete the task.",
          c: "React event props are camelCase: onClick.",
          d: "onClick is exactly how buttons handle clicks.",
        },
      },
      {
        id: "jsq58-2",
        type: "mcq",
        difficulty: 3,
        atomId: "a-js-lists-keys",
        prompt: "Why use task.id rather than the array index as a key?",
        options: [
          { id: "a", text: "Indexes are not allowed" },
          { id: "b", text: "An id stays attached to the same item when the list is reordered or an item is removed; an index does not" },
          { id: "c", text: "ids are faster to type" },
          { id: "d", text: "Keys are only for styling" },
        ],
        correct: "b",
        explanation: "React matches elements between renders by key. Index keys shift when items move, so state can attach to the wrong item.",
        whyWrong: {
          a: "Indexes are allowed and work for lists that never change order, but they break when they do.",
          c: "Typing speed is irrelevant.",
          d: "Keys are used by React to identify elements, not for styles.",
        },
      },
      {
        id: "jsq58-3",
        type: "scenario",
        difficulty: 3,
        atomId: "a-js-conditional-rendering",
        prompt: "{items.length && <List />} with an empty items array. What appears?",
        options: [
          { id: "a", text: "Nothing" },
          { id: "b", text: "A 0" },
          { id: "c", text: "The List" },
          { id: "d", text: "false" },
        ],
        correct: "b",
        explanation: "0 && … evaluates to 0, and React renders numbers. Use items.length > 0 && <List />.",
        whyWrong: {
          a: "React renders nothing for false, but 0 is a number and is rendered.",
          c: "&& stops at the falsy 0.",
          d: "React renders nothing for false; the value here is 0, not false.",
        },
      },
      {
        id: "jsq58-4",
        type: "mcq",
        difficulty: 2,
        atomId: "a-js-conditional-rendering",
        prompt: "What should a component return to render nothing at all?",
        options: [
          { id: "a", text: "0" },
          { id: "b", text: "null" },
          { id: "c", text: "\"\" with a space" },
          { id: "d", text: "An empty object" },
        ],
        correct: "b",
        explanation: "Returning null tells React to render nothing for that component.",
        whyWrong: {
          a: "0 is rendered as the character 0.",
          c: "A space is still text.",
          d: "Objects are not valid React children and cause an error.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "js-l59-forms-effects": {
    lessonId: "js-l59-forms-effects",
    passMark: 70,
    questions: [
      {
        id: "jsq59-1",
        type: "mcq",
        difficulty: 2,
        atomId: "a-js-controlled-inputs",
        prompt: "What makes an input \"controlled\"?",
        options: [
          { id: "a", text: "It has a CSS class" },
          { id: "b", text: "Its value comes from state, and onChange updates that state" },
          { id: "c", text: "It is disabled" },
          { id: "d", text: "It is inside a form" },
        ],
        correct: "b",
        explanation: "With value={state} and onChange={…setState…}, React state is the single source of truth for the field.",
        whyWrong: {
          a: "Styling does not affect where the value lives.",
          c: "Disabled inputs can be controlled or not.",
          d: "Being in a form is unrelated.",
        },
      },
      {
        id: "jsq59-2",
        type: "scenario",
        difficulty: 3,
        atomId: "a-js-form-state",
        prompt: "form = { a: 1, b: 2 }; const name = \"b\";\nform = { ...form, [name]: 9 };\nWhat is form?",
        options: [
          { id: "a", text: "{ a: 1, b: 2, name: 9 }" },
          { id: "b", text: "{ a: 1, b: 9 }" },
          { id: "c", text: "{ b: 9 }" },
          { id: "d", text: "{ a: 9, b: 2 }" },
        ],
        correct: "b",
        explanation: "[name] is a computed key, so the property is b. The spread copies a and b, then b is overridden.",
        whyWrong: {
          a: "Without brackets the key would be the word name; with them, it is the variable's value.",
          c: "The spread keeps the other properties.",
          d: "name is \"b\", not \"a\".",
        },
      },
      {
        id: "jsq59-3",
        type: "mcq",
        difficulty: 2,
        atomId: "a-js-use-effect",
        prompt: "useEffect(fetchWeather, [city]) — when does fetchWeather run?",
        options: [
          { id: "a", text: "Only once, ever" },
          { id: "b", text: "After the first render, and again whenever city changes" },
          { id: "c", text: "Before every render" },
          { id: "d", text: "Only when the component is removed" },
        ],
        correct: "b",
        explanation: "Effects run after rendering. The dependency array makes it re-run only when city differs from the previous render.",
        whyWrong: {
          a: "That is the behaviour of an empty array [].",
          c: "Effects run after rendering, never before.",
          d: "That is when a clean-up function runs.",
        },
      },
      {
        id: "jsq59-4",
        type: "scenario",
        difficulty: 3,
        atomId: "a-js-effect-deps",
        prompt: "An effect depends on options, an object created fresh inside the component on every render, and the effect sets state. What happens?",
        options: [
          { id: "a", text: "It runs once" },
          { id: "b", text: "It runs after every render, and because it sets state, it loops forever" },
          { id: "c", text: "It never runs" },
          { id: "d", text: "React merges the objects" },
        ],
        correct: "b",
        explanation: "A new object is never Object.is equal to the previous one, so the effect always re-runs. Setting state causes another render, and so on.",
        whyWrong: {
          a: "The dependency changes on every render.",
          c: "It runs after the first render and every render after.",
          d: "React compares dependencies; it never merges them.",
        },
      },
      {
        id: "jsq59-5",
        type: "mcq",
        difficulty: 3,
        atomId: "a-js-effect-choice",
        prompt: "Which of these needs a useEffect?",
        options: [
          { id: "a", text: "Calculating the number of completed tasks" },
          { id: "b", text: "Saving the tasks to localStorage whenever they change" },
          { id: "c", text: "Formatting a date for display" },
          { id: "d", text: "Filtering the tasks by a search term" },
        ],
        correct: "b",
        explanation: "Writing to localStorage is a side effect: it talks to something outside React. The others are calculations to do during render.",
        whyWrong: {
          a: "Derived from state; calculate it in render.",
          c: "A pure calculation; do it in render.",
          d: "Derived from state and props; calculate it in render.",
        },
      },
    ],
  },
};
