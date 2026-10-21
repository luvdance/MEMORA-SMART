/**
 * ASSESSMENTS · REACT DEVELOPMENT · MODULE 3 · RENDERING DATA AND HANDLING EVENTS
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Never import this from anything under src/.
 * ═════════════════════════════════════════════════════════════════════════
 */

import { q, check } from "./rx-helpers.js";

export const ASSESSMENTS = {
  ...check("rx-l19-lists-keys", [
    q({ id: "rxq19-1", atom: "a-rx-map-render", d: 2, prompt: "How do you render a list of students as <li> elements?", options: ["{students.map((s) => <li key={s.id}>{s.name}</li>)}", "{for (const s of students) <li>{s.name}</li>}", "{students.forEach((s) => <li>{s.name}</li>)}", "<li repeat={students}>"], correct: "a",
      explanation: "map returns an array of elements, which JSX renders.",
      wrong: { b: "for is a statement; it cannot go inside braces.", c: "forEach returns undefined, so nothing renders.", d: "No such attribute." } }),
    q({ id: "rxq19-2", atom: "a-rx-keys", d: 2, prompt: "What should a list item's key usually be?", options: ["A stable, unique id from the data", "The array index, always", "Math.random()", "The item's text"], correct: "a",
      explanation: "Stable ids let React match items between renders.",
      wrong: { b: "Index keys break when items are added, removed or reordered.", c: "A new key every render rebuilds everything.", d: "Text may repeat or change." } }),
    q({ id: "rxq19-3", atom: "a-rx-keys", d: 3, prompt: "A list uses key={index}. You add an item at the top. What can go wrong?", options: ["Typed text or state in each row moves to the wrong item", "Nothing at all", "The list sorts itself", "The app crashes"], correct: "a",
      explanation: "Every index shifts, so React matches each element with the wrong item.",
      wrong: { b: "Element state follows the key.", c: "No sorting happens.", d: "It renders, wrongly." } }),
    q({ id: "rxq19-4", atom: "a-rx-keys", d: 2, prompt: "Where does the key go when you map to a component?", options: ["On the component in the map: <CourseCard key={c.id} … />", "Inside CourseCard's JSX", "On the <ul> only", "In package.json"], correct: "a",
      explanation: "The key belongs to the element the map returns.",
      wrong: { b: "React reads it at the list level.", c: "Each item needs one.", d: "Unrelated." } }),
  ]),

  ...check("rx-l20-conditional", [
    q({ id: "rxq20-1", atom: "a-rx-conditionals", d: 3, prompt: "count is 0. What does {count && <Badge />} render?", options: ["The number 0", "Nothing", "<Badge />", "An error"], correct: "a",
      explanation: "&& returns 0, and React renders numbers. Use count > 0 &&.",
      wrong: { b: "0 is rendered.", c: "The right side is skipped.", d: "Valid." } }),
    q({ id: "rxq20-2", atom: "a-rx-conditionals", d: 2, prompt: "Which picks one of two elements inside JSX?", options: ["{paid ? <Receipt /> : <PayButton />}", "{if (paid) <Receipt />}", "{paid || <Receipt />}", "<if paid><Receipt /></if>"], correct: "a",
      explanation: "The ternary is an expression.",
      wrong: { b: "if is a statement.", c: "That renders Receipt only when paid is falsy.", d: "Not JSX." } }),
    q({ id: "rxq20-3", atom: "a-rx-conditionals", d: 2, prompt: "What does a component render when it returns null?", options: ["Nothing", "The text null", "An empty div", "An error"], correct: "a",
      explanation: "null is a valid return meaning \"nothing\".",
      wrong: { b: "null is not shown.", c: "No element is created.", d: "It is allowed." } }),
    q({ id: "rxq20-4", atom: "a-rx-empty-states", d: 2, prompt: "What makes a good empty state?", options: ["It says what is missing and what to do next", "A blank area", "An error message in red", "Hiding the whole page"], correct: "a",
      explanation: "Explain, then guide.",
      wrong: { b: "Looks broken.", c: "Empty is not an error.", d: "Confusing." } }),
  ]),

  ...check("rx-l21-events", [
    q({ id: "rxq21-1", atom: "a-rx-event-types", d: 2, prompt: "Why handle a form with onSubmit on the <form> rather than onClick on its button?", options: ["onSubmit also fires when the user presses Enter in a field", "onClick does not exist", "onSubmit is faster", "Buttons cannot have handlers"], correct: "a",
      explanation: "Submission has several triggers; onSubmit catches them all.",
      wrong: { b: "It exists.", c: "Speed is not the reason.", d: "They can." } }),
    q({ id: "rxq21-2", atom: "a-rx-event-types", d: 2, prompt: "In a submit handler, what must happen first to stop the page reloading?", options: ["event.preventDefault()", "return true", "event.target.reset()", "nothing; React stops it"], correct: "a",
      explanation: "React does not cancel the browser's default for you.",
      wrong: { b: "Return values are ignored.", c: "That clears the form.", d: "React does not." } }),
    q({ id: "rxq21-3", atom: "a-rx-event-objects", d: 2, prompt: "In an onChange handler for a text input, where is the typed text?", options: ["event.target.value", "event.value", "event.key", "event.text"], correct: "a",
      explanation: "target is the input element.",
      wrong: { b: "Not on the event itself.", c: "key is for keyboard events.", d: "No such property." } }),
    q({ id: "rxq21-4", atom: "a-rx-event-arguments", d: 3, prompt: "What does onClick={remove(item.id)} do?", options: ["Calls remove during render and passes its return value as the handler", "Calls remove when clicked", "Nothing", "Removes every item on click"], correct: "a",
      explanation: "Wrap it: onClick={() => remove(item.id)}.",
      wrong: { b: "It runs immediately.", c: "It runs during render.", d: "It runs for each item during render." } }),
  ]),

  ...check("rx-l22-updating-ui", [
    q({ id: "rxq22-1", atom: "a-rx-first-state", d: 2, prompt: "Why does changing a normal let variable in a click handler not update the screen?", options: ["React is not told to re-render, and the variable is recreated on the next render anyway", "let is not allowed in components", "The browser blocks it", "It does update the screen"], correct: "a",
      explanation: "State setters are how you ask React to render again.",
      wrong: { b: "It is allowed, just useless for this.", c: "Unrelated.", d: "It does not." } }),
    q({ id: "rxq22-2", atom: "a-rx-first-state", d: 2, prompt: "const [open, setOpen] = useState(false). What does setOpen(true) do?", options: ["Stores true and re-renders the component with open as true", "Changes open immediately on that line", "Reloads the page", "Nothing until the next click"], correct: "a",
      explanation: "The new value appears on the next render. Module 4 explains the snapshot.",
      wrong: { b: "open in the current render keeps its value.", c: "No reload.", d: "It schedules a render now." } }),
    q({ id: "rxq22-3", atom: "a-rx-badges-status", d: 2, prompt: "Why give a status pill a text label and not just a colour?", options: ["Some users cannot tell colours apart, and screen readers do not announce colours", "Colours are slow", "It is required by JSX", "Text is cheaper"], correct: "a",
      explanation: "Never use colour as the only signal.",
      wrong: { b: "Unrelated.", c: "JSX does not require it.", d: "Unrelated." } }),
    q({ id: "rxq22-4", atom: "a-rx-event-mistakes", d: 3, prompt: "Why is key={Math.random()} a bug?", options: ["Every render gives every item a new key, so React rebuilds every element and loses their state", "Random numbers are not allowed in JSX", "Keys must be strings", "It is fine"], correct: "a",
      explanation: "Keys must be stable.",
      wrong: { b: "They are allowed, just wrong here.", c: "Numbers work as keys.", d: "It is not." } }),
    q({ id: "rxq22-5", atom: "a-rx-event-mistakes", d: 2, prompt: "<button onclick={save}> does nothing. Why?", options: ["React event props are camelCase: onClick", "save is not defined", "Buttons need type=\"submit\"", "onclick only works on links"], correct: "a",
      explanation: "React ignores the lower-case name and warns in the console.",
      wrong: { b: "The prop name is the problem.", c: "Not required for clicks.", d: "Not true." } }),
  ]),

  ...check("rx-l23-m3-project", [
    q({ id: "rxq23-1", atom: "a-rx-m3-project", d: 3, prompt: "In the catalogue, why is the filtered list not stored in its own state?", options: ["It can be calculated from the courses and the filters on every render, so it can never get out of sync", "State cannot hold arrays", "It would be slower to store", "React forbids it"], correct: "a",
      explanation: "Derived values should be calculated, not stored.",
      wrong: { b: "State can hold arrays.", c: "Speed is not the reason.", d: "Allowed, but a source of bugs." } }),
    q({ id: "rxq23-2", atom: "a-rx-m3-project", d: 2, prompt: "What does aria-pressed=\"true\" tell a screen reader about a filter button?", options: ["That it is a toggle and currently on", "That it is disabled", "That it is a link", "Nothing"], correct: "a",
      explanation: "It announces the toggle's state.",
      wrong: { b: "That is disabled.", c: "It is still a button.", d: "It is announced." } }),
    q({ id: "rxq23-3", atom: "a-rx-m3-project", d: 3, prompt: "Click the Design button. Put the steps in order: (1) React re-renders App, (2) setCategory(\"Design\") runs, (3) the filter runs with the new category, (4) the screen shows two courses.", options: ["2, 1, 3, 4", "1, 2, 3, 4", "3, 2, 1, 4", "2, 3, 4, 1"], correct: "a",
      explanation: "Setter, re-render, calculation during the render, then the new screen.",
      wrong: { b: "The setter comes first.", c: "The filter runs inside the render.", d: "The render is what runs the filter." } }),
    q({ id: "rxq23-4", atom: "a-rx-m3-project", d: 2, prompt: "How should the enrolled courses be stored so a toggle is easy?", options: ["An array of enrolled ids in state, adding or removing an id immutably", "A boolean on each course object, set by mutation", "In a global variable", "In the button's text"], correct: "a",
      explanation: "Store ids; derive each button's label.",
      wrong: { b: "Mutation will not re-render.", c: "Not React state.", d: "Text is output, not data." } }),
  ]),
};
