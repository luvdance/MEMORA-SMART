/**
 * ASSESSMENTS · OBJECT ORIENTED PROGRAMMING (JAVASCRIPT) · WEEK 10
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Never import this from anything under src/.
 * ═════════════════════════════════════════════════════════════════════════
 */

export const ASSESSMENTS = {
  /* ═══════════════════════════════════════════════════════════════════ */
  "js-l35-the-dom": {
    lessonId: "js-l35-the-dom",
    passMark: 70,
    questions: [
      {
        id: "jsq35-1",
        type: "mcq",
        difficulty: 1,
        atomId: "a-js-what-is-dom",
        prompt: "What is the DOM?",
        options: [
          { id: "a", text: "The HTML file saved on the server" },
          { id: "b", text: "A tree of objects the browser builds from the page, which JavaScript can change" },
          { id: "c", text: "A CSS framework" },
          { id: "d", text: "A JavaScript library you must install" },
        ],
        correct: "b",
        explanation: "The browser parses the HTML into the Document Object Model. Changing those objects changes what is displayed.",
        whyWrong: {
          a: "JavaScript in the page never edits the file; it changes the in-memory tree.",
          c: "The DOM is not about styling, though it exposes styles.",
          d: "It is built into every browser.",
        },
      },
      {
        id: "jsq35-2",
        type: "scenario",
        difficulty: 2,
        atomId: "a-js-query-selector",
        prompt: "document.querySelector(\"#cart\") finds no element. What does it return?",
        options: [
          { id: "a", text: "undefined" },
          { id: "b", text: "null" },
          { id: "c", text: "An empty array" },
          { id: "d", text: "It throws an error" },
        ],
        correct: "b",
        explanation: "querySelector returns null when nothing matches. The error comes when you then read a property of null.",
        whyWrong: {
          a: "The DOM APIs use null, not undefined, for \"no element\".",
          c: "querySelectorAll returns an empty list; querySelector returns one element or null.",
          d: "A non-matching selector is not an error.",
        },
      },
      {
        id: "jsq35-3",
        type: "scenario",
        difficulty: 3,
        atomId: "a-js-read-change-text",
        prompt: "p.textContent = \"<em>Hi</em>\"; What does the page show?",
        options: [
          { id: "a", text: "Hi in italics" },
          { id: "b", text: "The characters <em>Hi</em> as plain text" },
          { id: "c", text: "Nothing" },
          { id: "d", text: "An error" },
        ],
        correct: "b",
        explanation: "textContent treats everything as text, so the tags are displayed, not interpreted.",
        whyWrong: {
          a: "That is what innerHTML would do.",
          c: "The text replaces the paragraph's content, so it is shown.",
          d: "Any string can be set as text.",
        },
      },
      {
        id: "jsq35-4",
        type: "mcq",
        difficulty: 2,
        atomId: "a-js-running-in-page",
        prompt: "A script in the <head> without defer runs document.querySelector(\"h1\").textContent and throws. Why?",
        options: [
          { id: "a", text: "h1 elements cannot be selected" },
          { id: "b", text: "The script ran before the body, including the h1, existed" },
          { id: "c", text: "textContent only works on paragraphs" },
          { id: "d", text: "querySelector must be called on window" },
        ],
        correct: "b",
        explanation: "Without defer, a head script runs as soon as it is reached, before the browser has built the body. querySelector returns null.",
        whyWrong: {
          a: "Any element can be selected once it exists.",
          c: "textContent works on every element.",
          d: "querySelector is a method of document and of every element.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "js-l36-styles-elements": {
    lessonId: "js-l36-styles-elements",
    passMark: 70,
    questions: [
      {
        id: "jsq36-1",
        type: "mcq",
        difficulty: 2,
        atomId: "a-js-classlist",
        prompt: "item.classList.toggle(\"done\") is called on an element that already has the class done. What happens?",
        options: [
          { id: "a", text: "Nothing" },
          { id: "b", text: "The class is removed" },
          { id: "c", text: "A second done class is added" },
          { id: "d", text: "An error" },
        ],
        correct: "b",
        explanation: "toggle removes the class if present and adds it if absent.",
        whyWrong: {
          a: "toggle always changes the state.",
          c: "A class list cannot contain the same class twice.",
          d: "toggle works whether or not the class is present.",
        },
      },
      {
        id: "jsq36-2",
        type: "mcq",
        difficulty: 2,
        atomId: "a-js-style-property",
        prompt: "How do you set the CSS property background-color from JavaScript?",
        options: [
          { id: "a", text: "el.style.background-color = \"red\"" },
          { id: "b", text: "el.style.backgroundColor = \"red\"" },
          { id: "c", text: "el.backgroundColor = \"red\"" },
          { id: "d", text: "el.style(\"background-color\")" },
        ],
        correct: "b",
        explanation: "CSS names with dashes become camelCase on the style object.",
        whyWrong: {
          a: "The dash would be read as a minus sign.",
          c: "Styles live on el.style, not directly on the element.",
          d: "style is an object, not a function.",
        },
      },
      {
        id: "jsq36-3",
        type: "scenario",
        difficulty: 2,
        atomId: "a-js-create-append",
        prompt: "const li = document.createElement(\"li\"); li.textContent = \"New\";\nNothing else is done. Is the item visible on the page?",
        options: [
          { id: "a", text: "Yes, at the end of the body" },
          { id: "b", text: "No, it exists but has not been attached to the page" },
          { id: "c", text: "Yes, inside the first list" },
          { id: "d", text: "No, createElement failed" },
        ],
        correct: "b",
        explanation: "createElement only creates the object. It must be attached with append, prepend or similar to appear.",
        whyWrong: {
          a: "New elements are never attached automatically.",
          c: "The browser does not guess a parent.",
          d: "It succeeded; the element simply is not in the tree yet.",
        },
      },
      {
        id: "jsq36-4",
        type: "scenario",
        difficulty: 3,
        atomId: "a-js-traversal",
        prompt: "A Delete button sits inside a span inside an <li class=\"task\">. Which expression reliably gives the li?",
        options: [
          { id: "a", text: "button.parentElement" },
          { id: "b", text: "button.closest(\".task\")" },
          { id: "c", text: "button.children[0]" },
          { id: "d", text: "button.nextElementSibling" },
        ],
        correct: "b",
        explanation: "closest walks up the tree to the nearest ancestor matching the selector, however deep the button is nested.",
        whyWrong: {
          a: "That gives the span, the button's immediate parent.",
          c: "children are elements inside the button.",
          d: "That is the button's neighbour, not its container.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "js-l37-dynamic-lists-safely": {
    lessonId: "js-l37-dynamic-lists-safely",
    passMark: 70,
    questions: [
      {
        id: "jsq37-1",
        type: "mcq",
        difficulty: 2,
        atomId: "a-js-state-render",
        prompt: "In the data-then-render pattern, what happens when a task is added?",
        options: [
          { id: "a", text: "A new li is patched into the page and the array is left alone" },
          { id: "b", text: "The task is added to the array, then render rebuilds the list from the array" },
          { id: "c", text: "The page is reloaded" },
          { id: "d", text: "The HTML file is edited" },
        ],
        correct: "b",
        explanation: "The array is the source of truth. Every change updates it, then render makes the page match.",
        whyWrong: {
          a: "That makes the page the source of truth, and the two drift apart.",
          c: "Reloading would lose the data.",
          d: "JavaScript in the page cannot edit the HTML file.",
        },
      },
      {
        id: "jsq37-2",
        type: "scenario",
        difficulty: 3,
        atomId: "a-js-state-updates",
        prompt: "tasks = tasks.filter((t) => t.id !== 4); What does this do?",
        options: [
          { id: "a", text: "Keeps only the task with id 4" },
          { id: "b", text: "Removes the task with id 4, keeping all the others" },
          { id: "c", text: "Marks task 4 as done" },
          { id: "d", text: "Changes task 4's id" },
        ],
        correct: "b",
        explanation: "filter keeps every task whose id is not 4, which removes exactly that one.",
        whyWrong: {
          a: "That would be t.id === 4.",
          c: "Toggling done uses map with a spread copy.",
          d: "filter decides which elements stay; it does not change them.",
        },
      },
      {
        id: "jsq37-3",
        type: "scenario",
        difficulty: 3,
        atomId: "a-js-xss",
        prompt: "A comment containing <img src=x onerror=\"…\"> is shown with innerHTML. What can happen?",
        options: [
          { id: "a", text: "Nothing; images are harmless" },
          { id: "b", text: "The attacker's code runs in the page for every visitor who sees the comment" },
          { id: "c", text: "The comment fails to save" },
          { id: "d", text: "Only the attacker sees anything unusual" },
        ],
        correct: "b",
        explanation: "innerHTML creates a real img element; when it fails to load, onerror runs the attacker's JavaScript. This is stored cross-site scripting.",
        whyWrong: {
          a: "The image tag is only the vehicle; the onerror attribute runs code.",
          c: "Saving is unaffected; the danger is in rendering.",
          d: "It runs for everyone whose page renders that comment.",
        },
      },
      {
        id: "jsq37-4",
        type: "mcq",
        difficulty: 3,
        atomId: "a-js-escaping",
        prompt: "In an escapeHtml function, why must & be replaced before < and >?",
        options: [
          { id: "a", text: "It does not matter" },
          { id: "b", text: "Otherwise the & in &lt; and &gt; would itself be escaped, producing &amp;lt;" },
          { id: "c", text: "& is the most common character" },
          { id: "d", text: "Browsers require it" },
        ],
        correct: "b",
        explanation: "Replacing & last would double-escape every entity already produced, so &lt; would display as the text &lt; instead of <.",
        whyWrong: {
          a: "The order changes the output, as the double-escaping shows.",
          c: "Frequency is irrelevant; correctness is the reason.",
          d: "Browsers do not care about your function; the output is what matters.",
        },
      },
    ],
  },
};
