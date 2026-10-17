/**
 * OBJECT ORIENTED PROGRAMMING (JAVASCRIPT) · WEEK 11 · EVENTS, FORMS & BROWSER STORAGE
 *
 * Curriculum 11.1 – 11.10.
 *
 * Event listeners are taught on real EventTarget objects, which exist in Node
 * as well as the browser, so those snippets are genuinely executed by the
 * content validator. Page-only code (forms, bubbling through a real DOM,
 * localStorage, DevTools) is shown as worked examples, and the graded
 * practices work on the logic underneath: validation, serialisation and
 * restoring state.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

export const SECTION_ID = "js-s11-events-storage";

const JS = "javascript";

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 38 · 11.1 – 11.3
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "js-l38-events",
    moduleId: "js-w11-events-storage",
    sectionId: SECTION_ID,
    order: 1,
    covers: ["11.1", "11.2", "11.3"],
    title: "Events",
    subtitle: "Listeners, event objects and the events you will use every day",
    estimatedMinutes: 16,
    intro:
      "A web page spends almost all its time waiting: for a click, a key press, a form being sent. An event is a signal that something happened, and a listener is a function you hand over to be called when it does. That is a callback, from Week 6, put to its most important use.",

    atoms: [
      {
        id: "a-js-event-listeners",
        title: "Event listeners",
        explain:
          "element.addEventListener(type, callback) registers a function to run every time that type of event happens on that element. You can add several listeners for the same event; they run in the order they were added. removeEventListener takes one away, and only works if you pass the very same function, which is why named functions are useful for listeners you may remove.",
        code: {
          language: JS,
          code: 'const button = new EventTarget();\n\nfunction onClick() {\n  console.log("first listener");\n}\nbutton.addEventListener("click", onClick);\nbutton.addEventListener("click", () => console.log("second listener"));\n\nbutton.dispatchEvent(new Event("click"));\nbutton.removeEventListener("click", onClick);\nbutton.dispatchEvent(new Event("click"));\n',
          expectedOutput: "first listener\nsecond listener\nsecond listener",
        },
        why: "EventTarget is the object every page element inherits its listener methods from, and it exists in Node too, so this code really runs. dispatchEvent simulates the click; on a page, the browser dispatches it for you when the user clicks. The page version is identical: document.querySelector(\"button\").addEventListener(\"click\", onClick).",
        mistake:
          "Writing addEventListener(\"click\", onClick()) with brackets. That calls onClick immediately, once, and registers its return value, undefined, as the listener. Pass the function, not its result.",
      },
      {
        id: "a-js-event-object",
        title: "The event object and its target",
        explain:
          "When the browser calls your listener, it passes one argument: an event object describing what happened. event.type is the kind of event; event.target is the element where it happened. Other properties depend on the event: key for keyboard events, clientX and clientY for mouse position.",
        codeExercise: {
          language: JS,
          code: 'const saveBtn = new EventTarget();\nconst cancelBtn = new EventTarget();\n\nfunction report(event) {\n  const which = event.target === saveBtn ? "save" : "cancel";\n  console.log(`${event.type} on ${which}`);\n}\n\nsaveBtn.addEventListener("click", report);\ncancelBtn.addEventListener("click", report);\ncancelBtn.addEventListener("focus", report);\n\nsaveBtn.dispatchEvent(new Event("click"));\ncancelBtn.dispatchEvent(new Event("focus"));\ncancelBtn.dispatchEvent(new Event("click"));\n',
          question: "One listener function is attached to two buttons. It uses the event object to tell them apart. What is printed?",
          expectedOutput: "click on save\nfocus on cancel\nclick on cancel",
          hint: "event.type is the name of the event that was dispatched. event.target is the object it was dispatched on.",
          successMessage: "One function, three different reports, all from the event object. This is what makes a single listener able to serve many elements, which is the idea behind delegation in Lesson 40.",
        },
      },
      {
        id: "a-js-common-events",
        title: "Click, input, submit and keyboard events",
        explain:
          "A handful of event types cover most interfaces. click fires when an element is clicked or activated with the keyboard. input fires on every change to a text field, as the user types. change fires when a field's value is committed. submit fires on a form when it is sent. keydown fires when a key is pressed, with event.key naming it.",
        table: {
          caption: "The events you will use most.",
          headers: ["Event", "Fires on", "Useful property"],
          rows: [
            ["click", "Buttons, links, any element", "event.target"],
            ["input", "Text fields, on every keystroke", "event.target.value"],
            ["change", "Selects, checkboxes, fields when committed", "event.target.checked or .value"],
            ["submit", "A <form>, when sent", "event.preventDefault()"],
            ["keydown", "The focused element, on each key press", "event.key, e.g. \"Enter\", \"Escape\""],
          ],
        },
        example:
          "const search = document.querySelector(\"#search\");\nsearch.addEventListener(\"input\", (event) => {\n  console.log(\"Searching for:\", event.target.value);\n});\n\ndocument.addEventListener(\"keydown\", (event) => {\n  if (event.key === \"Escape\") closeDialog();\n});",
        why: "input is what makes live search feel instant: the list filters with every character typed. Prefer click over listening for mouse events on buttons, because click also fires for keyboard users pressing Enter or Space.",
      },
      {
        id: "a-js-event-choice",
        title: "Choosing the right event",
        explain:
          "Pick the event that matches the user's intention, not the physical action. The difference decides whether your page works for everyone.",
        decision: {
          scenario: "A sign-up form has a name field, an email field and a Create account button inside a <form>.",
          question: "Where should the code that creates the account listen?",
          options: [
            {
              id: "a",
              text: "The form's submit event",
              why: "submit fires however the form is sent: clicking the button, pressing Enter in a field, or an assistive technology. It also lets you validate and cancel in one place with preventDefault(), which is the next lesson.",
            },
            {
              id: "b",
              text: "The button's click event",
              whyWrong: "It misses a user who presses Enter in the email field, which sends the form without clicking. You would also have to stop the form's own submission separately.",
            },
            {
              id: "c",
              text: "The email field's keydown event, checking for Enter",
              whyWrong: "That handles only one route in, and duplicates behaviour the browser already provides through submit.",
            },
            {
              id: "d",
              text: "The page's mousemove event",
              whyWrong: "Movement has nothing to do with intent to submit, and keyboard users never trigger it.",
            },
          ],
          correct: "a",
          aftermath: "Listen to the meaning (submit, click, change), not the mechanism (mouse button, specific key). Meaningful events work for keyboards, touchscreens and screen readers automatically.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 39 · 11.4 – 11.5
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "js-l39-forms-validation",
    moduleId: "js-w11-events-storage",
    sectionId: SECTION_ID,
    order: 2,
    covers: ["11.4", "11.5"],
    title: "Forms and Validation",
    subtitle: "Reading input, checking it, and stopping the browser's default",
    estimatedMinutes: 17,
    intro:
      "Forms are where your program meets real, messy input. People leave fields empty, add spaces, type letters into number fields and paste emails with a trailing full stop. This lesson is about handling all of that before it reaches your data.",

    atoms: [
      {
        id: "a-js-form-handling",
        title: "Handling a form",
        explain:
          "Listen for submit on the form. Read each field's value property, which is always a string. Trim it, convert it if it should be a number, check it, and only then use it. FormData can read every named field at once.",
        example:
          "<form id=\"signup\">\n  <label for=\"name\">Name</label>\n  <input id=\"name\" name=\"name\" />\n  <label for=\"age\">Age</label>\n  <input id=\"age\" name=\"age\" type=\"number\" />\n  <button>Create account</button>\n  <p id=\"errors\" role=\"alert\"></p>\n</form>\n\nconst form = document.querySelector(\"#signup\");\nform.addEventListener(\"submit\", (event) => {\n  event.preventDefault();\n  const data = new FormData(form);\n  const input = {\n    name: data.get(\"name\").trim(),\n    age: Number(data.get(\"age\")),\n  };\n  const errors = validate(input);\n  document.querySelector(\"#errors\").textContent = errors.join(\" \");\n  if (errors.length === 0) createAccount(input);\n});",
        why: "Notice that the checking happens in a separate validate function. As in Week 10, the logic is kept out of the DOM code, so it can be tested on its own, which you will do in a moment.",
      },
      {
        id: "a-js-prevent-default",
        title: "preventDefault() and default behaviour",
        explain:
          "Many events have a default action the browser performs after your listener runs: a submitted form reloads the page with its data, a clicked link navigates away, a checkbox ticks. event.preventDefault() cancels that action. For forms handled by JavaScript you almost always call it first, or the page reloads and your work disappears.",
        code: {
          language: JS,
          code: 'const form = new EventTarget();\n\nform.addEventListener("submit", (event) => {\n  event.preventDefault();\n  console.log("Handled in JavaScript");\n});\n\nconst submit = new Event("submit", { cancelable: true });\nform.dispatchEvent(submit);\nconsole.log("Default prevented:", submit.defaultPrevented);\n',
          expectedOutput: "Handled in JavaScript\nDefault prevented: true",
        },
        mistake:
          "Forgetting preventDefault on a form. The page flashes and reloads, your console clears, and it looks as if your code never ran. If a form \"does nothing\", this is the first thing to check.",
      },
      {
        id: "a-js-validation",
        title: "Writing a validator",
        explain:
          "A validator takes the input and returns a list of problems, empty if there are none. Returning a list, rather than true or false, lets you tell the user about every problem at once, each in plain words. Check required fields first, then formats, then ranges.",
        codeExercise: {
          language: JS,
          code: 'function validate({ name, email, age }) {\n  const errors = [];\n  if (!name.trim()) errors.push("Name is required.");\n  if (!email.includes("@") || email.endsWith("@")) errors.push("Enter a valid email.");\n  if (!Number.isInteger(age) || age < 13 || age > 120) errors.push("Age must be a whole number from 13 to 120.");\n  return errors;\n}\n\nconsole.log(validate({ name: "Ada", email: "ada@memora.ng", age: 19 }));\nconsole.log(validate({ name: "  ", email: "ada@", age: 19 }));\nconsole.log(validate({ name: "Bisi", email: "bisi.com", age: 12.5 }).length);\n',
          question: "validate returns a list of problems. What is printed for each call?",
          expectedOutput: "[]\n[ 'Name is required.', 'Enter a valid email.' ]\n2",
          hint: "The first input is valid. In the second, a name of only spaces is empty after trim, and an email ending in @ fails. In the third, the email has no @ and 12.5 is not a whole number.",
          successMessage: "An empty array means valid. Each problem is a sentence ready to show the user, and the whole function was tested without a form in sight.",
        },
      },
      {
        id: "a-js-html-validation",
        title: "HTML validation, and why it is not enough",
        explain:
          "HTML can do simple validation for you: required, type=\"email\", min, max and pattern on an input make the browser refuse to submit and show a message. Use them, because they are free and accessible. But anyone can bypass them, so a real application always validates again in JavaScript, and again on the server.",
        decision: {
          scenario:
            "Your to-do app's add form has required on the title input. A teammate says that means the JavaScript validation can be deleted.",
          question: "What is the right response?",
          options: [
            {
              id: "a",
              text: "Keep both: HTML validation for quick feedback, JavaScript validation because HTML attributes can be bypassed and do not cover every rule",
              why: "required stops an empty field, but not a title of only spaces, and anyone can remove the attribute in DevTools. Each layer catches what the one before can miss.",
            },
            {
              id: "b",
              text: "Agree, and delete the JavaScript validation",
              whyWrong: "A title of three spaces passes required. Any user can also delete the attribute in DevTools in two seconds.",
            },
            {
              id: "c",
              text: "Delete the HTML validation instead, because JavaScript is stronger",
              whyWrong: "HTML validation is free, instant and announced by screen readers. There is no reason to remove a layer that helps users.",
            },
            {
              id: "d",
              text: "Validate only when the data is displayed",
              whyWrong: "By then the bad data is already saved. Validate at the boundary where data comes in.",
            },
          ],
          correct: "a",
          aftermath: "Browser validation is for the user's convenience. JavaScript validation is for your program's correctness. Server validation, which you will meet when you build back ends, is for security. A professional application has all three.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 40 · 11.6 – 11.8
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "js-l40-delegation-storage",
    moduleId: "js-w11-events-storage",
    sectionId: SECTION_ID,
    order: 3,
    covers: ["11.6", "11.7", "11.8"],
    title: "Delegation and Saving State",
    subtitle: "Bubbling, one listener for many items, localStorage and JSON",
    estimatedMinutes: 18,
    intro:
      "Two things make a to-do app feel real. Its buttons keep working however many tasks you add, and your tasks are still there when you come back tomorrow. The first is event delegation; the second is localStorage.",

    atoms: [
      {
        id: "a-js-bubbling",
        title: "Event bubbling",
        explain:
          "When an event happens on an element, it first fires there, then on its parent, then on that element's parent, all the way up to document. This is called bubbling. So a click on a button inside an <li> inside a <ul> is also a click on the <li> and on the <ul>, and a listener on any of them will hear it. event.target is always the element that was actually clicked.",
        example:
          "<ul id=\"tasks\">\n  <li>\n    <button>Delete</button>\n  </li>\n</ul>\n\nClick the button and the click travels upward:\n\n   button   ← event.target, fires first\n     ↑\n    li\n     ↑\n    ul      ← a listener here hears it too\n     ↑\n  document\n\nevent.stopPropagation() stops it travelling further,\nbut you rarely need it, and it can break other listeners.",
        why: "Bubbling is not an accident to work around; it is the feature that makes the next atom possible.",
      },
      {
        id: "a-js-delegation",
        title: "Event delegation",
        explain:
          "Instead of attaching a listener to every Delete button, attach ONE listener to the list that contains them. When a click bubbles up to it, check event.target to see what was actually clicked, and use closest() to find the item it belongs to. New items added later work automatically, because the listener is on the container, which never changes.",
        example:
          "<ul id=\"tasks\">\n  <li data-id=\"1\">Buy rice <button data-action=\"delete\">Delete</button></li>\n  <li data-id=\"2\">Call Mum <button data-action=\"delete\">Delete</button></li>\n</ul>\n\ndocument.querySelector(\"#tasks\").addEventListener(\"click\", (event) => {\n  const button = event.target.closest(\"[data-action]\");\n  if (!button) return;                       // clicked something else\n  const id = Number(button.closest(\"li\").dataset.id);\n  if (button.dataset.action === \"delete\") removeTask(id);\n  if (button.dataset.action === \"toggle\") toggleTask(id);\n  render();\n});",
        why: "One listener instead of hundreds, nothing to re-attach after every render, and every action handled in one place. This replaces the onclick-per-button approach from last week's project.",
      },
      {
        id: "a-js-delegation-logic",
        title: "Routing actions, testably",
        explain:
          "The heart of a delegated listener is a decision: given which action was clicked on which item, what changes? That decision can be a plain function of data, tested without a page.",
        codeExercise: {
          language: JS,
          code: 'function handleAction(tasks, action, id) {\n  switch (action) {\n    case "toggle":\n      return tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t));\n    case "delete":\n      return tasks.filter((t) => t.id !== id);\n    default:\n      return tasks;\n  }\n}\n\nlet tasks = [\n  { id: 1, title: "Buy rice", done: false },\n  { id: 2, title: "Call Mum", done: false },\n];\ntasks = handleAction(tasks, "toggle", 1);\ntasks = handleAction(tasks, "archive", 2);\ntasks = handleAction(tasks, "delete", 2);\nconsole.log(tasks.length, tasks[0].title, tasks[0].done);\n',
          question: "Three clicks are routed through handleAction. One of them is an action it does not know. What is printed?",
          expectedOutput: "1 Buy rice true",
          hint: "toggle marks task 1 done. archive falls to default and changes nothing. delete removes task 2.",
          successMessage: "One task left, done. The unknown action was handled safely by default rather than crashing, which matters because data-action values come from HTML that anyone can edit.",
        },
      },
      {
        id: "a-js-json",
        title: "JSON serialisation",
        explain:
          "JSON is a text format for data, written almost exactly like JavaScript objects and arrays, but with double-quoted keys. JSON.stringify(value) turns an object or array into a JSON string; JSON.parse(text) turns it back. Strings are what get saved to storage and sent over networks, so this pair is how data travels.",
        code: {
          language: JS,
          code: 'const tasks = [{ id: 1, title: "Buy rice", done: false }];\nconst text = JSON.stringify(tasks);\nconsole.log(text);\nconsole.log(typeof text);\n\nconst back = JSON.parse(text);\nconsole.log(back[0].title);\n\nconsole.log(JSON.stringify({ when: undefined, run: () => 1, n: 5 }));\n',
          expectedOutput: "[{\"id\":1,\"title\":\"Buy rice\",\"done\":false}]\nstring\nBuy rice\n{\"n\":5}",
        },
        mistake:
          "Expecting JSON to save everything. Functions and undefined values are silently dropped, as the last line shows, and Dates become strings. JSON holds data, not behaviour: strings, numbers, booleans, null, arrays and plain objects.",
      },
      {
        id: "a-js-localstorage",
        title: "localStorage: saving and restoring state",
        explain:
          "localStorage is a small key-value store in the browser, kept per website, that survives closing the tab. It stores strings only, so save with JSON.stringify and load with JSON.parse. Loading must cope with nothing saved yet, and with saved data that is corrupt, or one bad value breaks your whole app on start-up.",
        example:
          "const KEY = \"memora-tasks\";\n\nfunction save(tasks) {\n  localStorage.setItem(KEY, JSON.stringify(tasks));\n}\n\nfunction load() {\n  try {\n    const saved = localStorage.getItem(KEY);   // null if nothing saved\n    return saved ? JSON.parse(saved) : [];\n  } catch {\n    return [];                                 // corrupt data: start fresh\n  }\n}\n\nlet tasks = load();\nrender();\n// …and call save(tasks) after every change, next to render().",
        codeExercise: {
          language: JS,
          code: 'function restore(saved) {\n  try {\n    const data = saved ? JSON.parse(saved) : [];\n    return Array.isArray(data) ? data : [];\n  } catch {\n    return [];\n  }\n}\n\nconsole.log(restore(null).length);\nconsole.log(restore(\'[{"id":1},{"id":2}]\').length);\nconsole.log(restore("{broken").length);\nconsole.log(restore(\'{"id":1}\').length);\n',
          question: "restore turns whatever localStorage returned into a task list, safely. What is printed?",
          expectedOutput: "0\n2\n0\n0",
          hint: "null means nothing was saved. \"{broken\" is not valid JSON, so parse throws. The last one is valid JSON, but it is an object, not an array.",
          successMessage: "Every bad case falls back to an empty list instead of crashing on start-up. Saved data is input like any other, and input is never trusted.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 41 · 11.9 – 11.10
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "js-l41-devtools-accessibility",
    moduleId: "js-w11-events-storage",
    sectionId: SECTION_ID,
    order: 4,
    covers: ["11.9", "11.10"],
    title: "Developer Tools and Accessibility",
    subtitle: "Seeing inside the page, and making it work for everyone",
    estimatedMinutes: 15,
    intro:
      "Two professional habits to finish the browser weeks. The first is knowing your way around the browser's developer tools, where you will spend a good part of every working day. The second is building interfaces that work for people using a keyboard or a screen reader, which is required by law in many countries and simply good engineering everywhere.",

    atoms: [
      {
        id: "a-js-devtools",
        title: "The browser's developer tools",
        explain:
          "Press F12 to open DevTools. Five panels cover almost everything. Elements shows the live DOM, with styles you can edit. Console shows errors and runs code. Sources has the debugger, with the same breakpoints as VS Code. Network lists every request the page makes. Application shows what is in localStorage.",
        table: {
          caption: "Which panel answers which question.",
          headers: ["Question", "Panel"],
          rows: [
            ["Did my element actually get added? What classes does it have?", "Elements"],
            ["Is there an error? What is in this variable right now?", "Console"],
            ["Why does this function return the wrong thing?", "Sources (breakpoints)"],
            ["Did my request go out? What came back, with what status?", "Network"],
            ["What is saved in localStorage? Can I clear it?", "Application → Local Storage"],
          ],
        },
        why: "In the Elements panel, select an element and type $0 in the Console: it refers to the selected element, so you can try $0.classList.add(\"done\") and see the result instantly. Experimenting in DevTools is the fastest way to find out what a line of code will do before you write it.",
      },
      {
        id: "a-js-a11y-elements",
        title: "Use the right element",
        explain:
          "The single most important accessibility rule: use the HTML element that means what you are building. A <button> can be reached with Tab, activated with Enter or Space, and is announced as a button by screen readers, all for free. A <div> with a click listener does none of that. Links go somewhere; buttons do something.",
        decision: {
          scenario: "Each task in your list needs a delete control.",
          question: "Which markup is right?",
          options: [
            {
              id: "a",
              text: "<button type=\"button\" aria-label=\"Delete Buy rice\">✕</button>",
              why: "A real button is focusable and keyboard-operable by default. Because its visible text is only a symbol, aria-label gives screen-reader users a meaningful name that includes which task it deletes.",
            },
            {
              id: "b",
              text: "<div class=\"delete\">✕</div> with a click listener",
              whyWrong: "Keyboard users cannot Tab to it or activate it, and a screen reader announces only \"✕\", if anything. You would need tabindex, a role and key handling to rebuild what button gives you.",
            },
            {
              id: "c",
              text: "<a href=\"#\">✕</a>",
              whyWrong: "A link announces that it will take you somewhere. Deleting is an action, so it is a button. href=\"#\" also scrolls the page to the top when clicked.",
            },
            {
              id: "d",
              text: "<span onclick=\"del()\">✕</span>",
              whyWrong: "The same problems as the div, plus an inline handler that mixes behaviour into markup.",
            },
          ],
          correct: "a",
          aftermath: "type=\"button\" matters too: a button inside a form defaults to type=\"submit\", so without it, deleting a task would submit the form.",
        },
      },
      {
        id: "a-js-a11y-labels-focus",
        title: "Labels, focus and announcements",
        explain:
          "Every input needs a <label> linked by for and id, so screen readers announce what it is for and clicking the label focuses the field. Never remove the focus outline without replacing it, because keyboard users rely on it to know where they are. When your JavaScript changes something important, such as showing a validation error, put the message in an element with role=\"alert\" or aria-live so it is announced.",
        example:
          "<label for=\"title\">New task</label>\n<input id=\"title\" name=\"title\" required />\n<p id=\"form-error\" role=\"alert\"></p>\n\n/* never just  outline: none  — replace it */\n:focus-visible { outline: 3px solid #1d4ed8; outline-offset: 2px; }\n\n// after a failed submit:\ndocument.querySelector(\"#form-error\").textContent = \"Enter a task title.\";\ndocument.querySelector(\"#title\").focus();",
        why: "Moving focus to the field with the problem, and announcing the message, means a screen-reader user knows immediately what went wrong and where. A sighted mouse user benefits too.",
      },
      {
        id: "a-js-a11y-check",
        title: "A quick accessibility check",
        explain:
          "You can catch most problems in two minutes. Put the mouse away and use only Tab, Shift+Tab, Enter, Space and Escape: can you do everything? Is it always clear where the focus is? Then run the Lighthouse panel in DevTools with the Accessibility category ticked, and fix what it reports.",
        codeExercise: {
          language: JS,
          code: 'function a11yProblems(controls) {\n  const problems = [];\n  for (const c of controls) {\n    if (c.tag !== "button" && c.onClick) problems.push(`${c.id}: clickable ${c.tag} is not a button`);\n    if (!c.label) problems.push(`${c.id}: no accessible name`);\n  }\n  return problems;\n}\n\nconst controls = [\n  { id: "add", tag: "button", onClick: true, label: "Add task" },\n  { id: "del", tag: "div", onClick: true, label: "" },\n  { id: "menu", tag: "button", onClick: true, label: "" },\n];\nfor (const p of a11yProblems(controls)) console.log(p);\n',
          question: "This simplified checker reports two kinds of problem. What does it print?",
          expectedOutput: "del: clickable div is not a button\ndel: no accessible name\nmenu: no accessible name",
          hint: "Check each control against both rules in turn. del breaks both; menu is a button but has no label.",
          successMessage: "Three problems from three controls. Real tools such as Lighthouse and axe apply hundreds of rules like these automatically, and the first two they report are almost always these.",
        },
      },
    ],

    task: {
      title: "Project: a persistent to-do application",
      intro:
        "Upgrade last week's task manager into an application you would actually use. It must survive a page reload and work entirely from the keyboard.",
      prompts: [
        "Replace every per-button onclick with ONE delegated click listener on the list, routing data-action values through a handleAction function.",
        "Use a <form> with a submit listener and preventDefault. Validate the title with your own validate function and show errors in a role=\"alert\" element.",
        "Add a search box that filters the visible tasks on every input event, and filter buttons for All, Active and Completed.",
        "Save the tasks to localStorage after every change, and restore them safely on load with a function that copes with missing or corrupt data.",
        "Test it with the keyboard only, then run Lighthouse's accessibility audit and fix everything it reports. Use the Application panel to inspect and clear what you saved.",
      ],
      closing:
        "Keep the logic (validate, handleAction, filtering, restore) in plain functions and the DOM code thin. In Week 14 this becomes a Vite project, and in Week 15 you rebuild it in React using exactly those functions.",
    },

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
