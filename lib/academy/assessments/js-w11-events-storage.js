/**
 * ASSESSMENTS · OBJECT ORIENTED PROGRAMMING (JAVASCRIPT) · WEEK 11
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Never import this from anything under src/.
 * ═════════════════════════════════════════════════════════════════════════
 */

export const ASSESSMENTS = {
  /* ═══════════════════════════════════════════════════════════════════ */
  "js-l38-events": {
    lessonId: "js-l38-events",
    passMark: 70,
    questions: [
      {
        id: "jsq38-1",
        type: "scenario",
        difficulty: 3,
        atomId: "a-js-event-listeners",
        prompt: "btn.addEventListener(\"click\", save());\n\nWhat is wrong?",
        options: [
          { id: "a", text: "Nothing" },
          { id: "b", text: "save() runs immediately and its return value, not the function, is registered" },
          { id: "c", text: "\"click\" should be \"onclick\"" },
          { id: "d", text: "addEventListener needs three arguments" },
        ],
        correct: "b",
        explanation: "The brackets call save straight away. Pass the function itself: addEventListener(\"click\", save).",
        whyWrong: {
          a: "save runs once on the spot, and clicks do nothing afterwards.",
          c: "Event types passed to addEventListener have no \"on\" prefix.",
          d: "The third argument is optional.",
        },
      },
      {
        id: "jsq38-2",
        type: "mcq",
        difficulty: 2,
        atomId: "a-js-event-object",
        prompt: "Inside a listener, what is event.target?",
        options: [
          { id: "a", text: "The function that is listening" },
          { id: "b", text: "The element on which the event actually happened" },
          { id: "c", text: "The name of the event" },
          { id: "d", text: "The whole document" },
        ],
        correct: "b",
        explanation: "event.target is where the event occurred, such as the exact button that was clicked. event.type is its name.",
        whyWrong: {
          a: "The listener is the callback you registered, not a property of the event.",
          c: "That is event.type.",
          d: "Only if the event happened on document itself.",
        },
      },
      {
        id: "jsq38-3",
        type: "mcq",
        difficulty: 2,
        atomId: "a-js-common-events",
        prompt: "Which event should a live search box listen for, so results update as the user types?",
        options: [
          { id: "a", text: "submit" },
          { id: "b", text: "input" },
          { id: "c", text: "click" },
          { id: "d", text: "load" },
        ],
        correct: "b",
        explanation: "input fires on every change to the field's value, including each keystroke and paste.",
        whyWrong: {
          a: "submit fires only when a form is sent.",
          c: "click fires on clicking, not typing.",
          d: "load fires once when the page or a resource finishes loading.",
        },
      },
      {
        id: "jsq38-4",
        type: "scenario",
        difficulty: 3,
        atomId: "a-js-event-choice",
        prompt: "Why listen for submit on a form rather than click on its button?",
        options: [
          { id: "a", text: "submit is faster" },
          { id: "b", text: "submit fires however the form is sent, including pressing Enter in a field" },
          { id: "c", text: "Buttons cannot have click listeners" },
          { id: "d", text: "There is no difference" },
        ],
        correct: "b",
        explanation: "A form can be sent by clicking, by Enter in a text field, or by assistive technology. submit catches all of them.",
        whyWrong: {
          a: "Speed is not the difference; coverage is.",
          c: "Buttons can have click listeners; it just misses the other routes.",
          d: "A click listener misses the Enter key.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "js-l39-forms-validation": {
    lessonId: "js-l39-forms-validation",
    passMark: 70,
    questions: [
      {
        id: "jsq39-1",
        type: "scenario",
        difficulty: 2,
        atomId: "a-js-prevent-default",
        prompt: "A form's submit listener runs but the page immediately reloads and the console clears. What is missing?",
        options: [
          { id: "a", text: "event.stopPropagation()" },
          { id: "b", text: "event.preventDefault()" },
          { id: "c", text: "return true" },
          { id: "d", text: "A second listener" },
        ],
        correct: "b",
        explanation: "Submitting a form reloads the page by default. preventDefault cancels that so JavaScript can handle it.",
        whyWrong: {
          a: "That stops bubbling, not the browser's default action.",
          c: "Return values from addEventListener listeners are ignored.",
          d: "Adding listeners does not cancel the default.",
        },
      },
      {
        id: "jsq39-2",
        type: "mcq",
        difficulty: 2,
        atomId: "a-js-form-handling",
        prompt: "An <input type=\"number\"> holds 25. What type is input.value?",
        options: [
          { id: "a", text: "number" },
          { id: "b", text: "string" },
          { id: "c", text: "bigint" },
          { id: "d", text: "It depends on the browser" },
        ],
        correct: "b",
        explanation: "value is always a string, even for number inputs. Convert it with Number() before arithmetic.",
        whyWrong: {
          a: "The type attribute affects the keyboard and validation, not the value's JavaScript type.",
          c: "Form values are never bigints.",
          d: "Every browser returns a string.",
        },
      },
      {
        id: "jsq39-3",
        type: "scenario",
        difficulty: 3,
        atomId: "a-js-validation",
        prompt: "A validator checks if (!name) errors.push(\"Name required\"). A user types three spaces. What happens?",
        options: [
          { id: "a", text: "The error is shown" },
          { id: "b", text: "The check passes, because \"   \" is a non-empty string and truthy" },
          { id: "c", text: "It throws" },
          { id: "d", text: "The spaces are removed automatically" },
        ],
        correct: "b",
        explanation: "Spaces make a non-empty string, which is truthy. Use !name.trim() so whitespace-only names fail.",
        whyWrong: {
          a: "Only the empty string is falsy; \"   \" is not empty.",
          c: "Checking a string's truthiness never throws.",
          d: "Nothing trims input unless you call trim().",
        },
      },
      {
        id: "jsq39-4",
        type: "mcq",
        difficulty: 2,
        atomId: "a-js-html-validation",
        prompt: "Why validate in JavaScript when the input already has the required attribute?",
        options: [
          { id: "a", text: "You do not need to" },
          { id: "b", text: "HTML attributes can be bypassed and do not cover rules such as \"not only spaces\"" },
          { id: "c", text: "required only works in Chrome" },
          { id: "d", text: "JavaScript validation is required by the HTML standard" },
        ],
        correct: "b",
        explanation: "Anyone can remove an attribute in DevTools, and required accepts whitespace. Each validation layer covers what the previous one cannot.",
        whyWrong: {
          a: "Relying on HTML alone lets bad data through.",
          c: "required works in every modern browser.",
          d: "The standard does not require it; good engineering does.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "js-l40-delegation-storage": {
    lessonId: "js-l40-delegation-storage",
    passMark: 70,
    questions: [
      {
        id: "jsq40-1",
        type: "mcq",
        difficulty: 2,
        atomId: "a-js-bubbling",
        prompt: "A button inside an li inside a ul is clicked. Which elements receive the click event as it bubbles?",
        options: [
          { id: "a", text: "Only the button" },
          { id: "b", text: "The button, then the li, then the ul, and on up to document" },
          { id: "c", text: "The ul first, then down to the button" },
          { id: "d", text: "Only the ul" },
        ],
        correct: "b",
        explanation: "Bubbling goes from the target upward through every ancestor.",
        whyWrong: {
          a: "The event continues upward unless stopped.",
          c: "Bubbling goes up, not down.",
          d: "The button is the target and receives it first.",
        },
      },
      {
        id: "jsq40-2",
        type: "mcq",
        difficulty: 3,
        atomId: "a-js-delegation",
        prompt: "What is the main advantage of event delegation for a list that is re-rendered often?",
        options: [
          { id: "a", text: "Events fire faster" },
          { id: "b", text: "One listener on the container works for every item, including items added later" },
          { id: "c", text: "It prevents bubbling" },
          { id: "d", text: "It removes the need for event.target" },
        ],
        correct: "b",
        explanation: "The container survives every render, so its single listener never needs re-attaching, and it handles new items automatically.",
        whyWrong: {
          a: "Speed is a minor side benefit, not the point.",
          c: "Delegation relies on bubbling.",
          d: "Delegation depends on event.target to know what was clicked.",
        },
      },
      {
        id: "jsq40-3",
        type: "scenario",
        difficulty: 2,
        atomId: "a-js-json",
        prompt: "console.log(JSON.stringify({ a: 1, f() {} }));\n\nWhat is printed?",
        options: [
          { id: "a", text: "{\"a\":1,\"f\":{}}" },
          { id: "b", text: "{\"a\":1}" },
          { id: "c", text: "{ a: 1, f: [Function: f] }" },
          { id: "d", text: "An error" },
        ],
        correct: "b",
        explanation: "JSON stores data only. Functions are silently left out.",
        whyWrong: {
          a: "Functions are dropped, not turned into empty objects.",
          c: "That is how console.log shows an object, not JSON text.",
          d: "stringify skips unsupported values rather than throwing.",
        },
      },
      {
        id: "jsq40-4",
        type: "scenario",
        difficulty: 3,
        atomId: "a-js-localstorage",
        prompt: "localStorage.setItem(\"tasks\", tasks) is called with an array, without JSON.stringify. What is stored?",
        options: [
          { id: "a", text: "The array, intact" },
          { id: "b", text: "A string such as \"[object Object],[object Object]\", which cannot be turned back into the tasks" },
          { id: "c", text: "Nothing" },
          { id: "d", text: "JSON automatically" },
        ],
        correct: "b",
        explanation: "localStorage stores strings only, so the array is converted with String(), which loses all the data in each object.",
        whyWrong: {
          a: "localStorage cannot store arrays or objects directly.",
          c: "Something is stored, just something useless.",
          d: "Conversion to JSON only happens if you call JSON.stringify.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "js-l41-devtools-accessibility": {
    lessonId: "js-l41-devtools-accessibility",
    passMark: 70,
    questions: [
      {
        id: "jsq41-1",
        type: "mcq",
        difficulty: 2,
        atomId: "a-js-devtools",
        prompt: "You want to check whether your page's request to an API was sent and what status came back. Which DevTools panel?",
        options: [
          { id: "a", text: "Elements" },
          { id: "b", text: "Network" },
          { id: "c", text: "Application" },
          { id: "d", text: "Lighthouse" },
        ],
        correct: "b",
        explanation: "The Network panel lists every request, with its method, status, timing and response.",
        whyWrong: {
          a: "Elements shows the DOM and styles.",
          c: "Application shows storage such as localStorage.",
          d: "Lighthouse audits the page; it is not a request log.",
        },
      },
      {
        id: "jsq41-2",
        type: "mcq",
        difficulty: 2,
        atomId: "a-js-a11y-elements",
        prompt: "Why use <button> instead of a <div> with a click listener?",
        options: [
          { id: "a", text: "Buttons look nicer" },
          { id: "b", text: "Buttons are keyboard-focusable, activate with Enter and Space, and are announced as buttons by screen readers" },
          { id: "c", text: "divs cannot have listeners" },
          { id: "d", text: "There is no difference" },
        ],
        correct: "b",
        explanation: "A button brings focus, keyboard activation and its role for free. A div provides none of these.",
        whyWrong: {
          a: "Appearance is entirely controlled by CSS.",
          c: "divs can have listeners; keyboard and screen-reader users still cannot use them.",
          d: "The difference is whether everyone can use your interface.",
        },
      },
      {
        id: "jsq41-3",
        type: "scenario",
        difficulty: 3,
        atomId: "a-js-a11y-elements",
        prompt: "A Delete <button> inside a form submits the form when clicked. What fixes it?",
        options: [
          { id: "a", text: "type=\"button\"" },
          { id: "b", text: "Changing it to a div" },
          { id: "c", text: "Removing the form" },
          { id: "d", text: "tabindex=\"-1\"" },
        ],
        correct: "a",
        explanation: "A button inside a form defaults to type=\"submit\". type=\"button\" makes it an ordinary button.",
        whyWrong: {
          b: "That breaks keyboard and screen-reader access.",
          c: "The form is still needed for adding tasks.",
          d: "That only removes it from the Tab order, which harms keyboard users.",
        },
      },
      {
        id: "jsq41-4",
        type: "mcq",
        difficulty: 2,
        atomId: "a-js-a11y-labels-focus",
        prompt: "How should a validation error be shown so screen-reader users hear it?",
        options: [
          { id: "a", text: "Change the input's border to red only" },
          { id: "b", text: "Put the message in an element with role=\"alert\" and move focus to the field" },
          { id: "c", text: "Use alert() every time" },
          { id: "d", text: "Log it to the console" },
        ],
        correct: "b",
        explanation: "role=\"alert\" causes the message to be announced, and focusing the field tells the user where to fix it.",
        whyWrong: {
          a: "Colour alone is invisible to screen readers and to many colour-blind users.",
          c: "alert boxes are disruptive and block the page.",
          d: "Users never see the console.",
        },
      },
    ],
  },
};
