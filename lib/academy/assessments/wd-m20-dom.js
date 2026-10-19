/**
 * ASSESSMENTS · RESPONSIVE WEB DEVELOPMENT · MODULE 20 · THE DOM
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Never import this from anything under src/.
 * ═════════════════════════════════════════════════════════════════════════
 */

import { q, check } from "./wd-helpers.js";

export const ASSESSMENTS = {
  ...check("wd-l91-dom-tree", [
    q({ id: "wdq91-1", atom: "a-wd-what-dom", d: 1, prompt: "What does JavaScript change when it updates a page?", options: ["The DOM, the tree of objects the browser built from the HTML", "The HTML file on the server", "The CSS file", "The browser's settings"], correct: "a",
      explanation: "The file is untouched; the in-memory tree changes and the page is redrawn.",
      wrong: { b: "Scripts in the page never edit the file.", c: "Styles can change in the DOM, not in the file.", d: "Unrelated." } }),
    q({ id: "wdq91-2", atom: "a-wd-html-to-tree", d: 2, prompt: "In <ul><li>Rice</li></ul>, what is the li to the ul?", options: ["A child", "A parent", "A sibling", "An attribute"], correct: "a",
      explanation: "Nested elements become children.",
      wrong: { b: "The ul is the li's parent.", c: "Siblings share a parent.", d: "Attributes are inside tags." } }),
    q({ id: "wdq91-3", atom: "a-wd-html-to-tree", d: 2, prompt: "What does the Elements panel in the developer tools show?", options: ["The live DOM, including changes made by JavaScript", "The original HTML file", "Only the CSS", "The server's code"], correct: "a",
      explanation: "It reflects the current tree.",
      wrong: { b: "View Source shows the file.", c: "Styles are one part.", d: "Server code is never sent." } }),
    q({ id: "wdq91-4", atom: "a-wd-selecting", d: 3, type: "scenario", prompt: "getElementById(\"cart\") returns null although the page has <div id=\"cart\">. The script is in the head without defer. What fixes it?", options: ["Add defer, or move the script to the end of the body", "Use #cart in getElementById", "Rename the id", "Use innerHTML"], correct: "a",
      explanation: "The script must run after the element exists.",
      wrong: { b: "getElementById takes the plain id.", c: "The name is fine.", d: "Unrelated." } }),
  ]),

  ...check("wd-l92-query-text-attributes", [
    q({ id: "wdq92-1", atom: "a-wd-query-selector", d: 2, prompt: "What does document.querySelector(\".price\") return when there are five .price elements?", options: ["The first one", "All five", "The last one", "null"], correct: "a",
      explanation: "querySelectorAll returns all of them.",
      wrong: { b: "That is querySelectorAll.", c: "It returns the first.", d: "It found matches." } }),
    q({ id: "wdq92-2", atom: "a-wd-query-selector", d: 3, prompt: "Why might you write [...document.querySelectorAll(\"li\")]?", options: ["To turn the NodeList into an array so map and filter work", "To make it faster", "To select only the first li", "It is required to loop"], correct: "a",
      explanation: "NodeLists support forEach and for...of, but not map or filter.",
      wrong: { b: "Not for speed.", c: "It keeps all of them.", d: "for...of works on a NodeList." } }),
    q({ id: "wdq92-3", atom: "a-wd-text", d: 2, prompt: "p.textContent = \"<em>Hi</em>\". What appears on the page?", options: ["The characters <em>Hi</em>", "Hi in italics", "Nothing", "An error"], correct: "a",
      explanation: "textContent treats everything as text.",
      wrong: { b: "That is innerHTML.", c: "The text is shown.", d: "Valid." } }),
    q({ id: "wdq92-4", atom: "a-wd-attributes", d: 3, prompt: "An element has data-product-id=\"7\". How do you read it?", options: ["el.dataset.productId, which gives \"7\"", "el.dataset.product-id", "el.productId", "el.dataset[\"7\"]"], correct: "a",
      explanation: "Dashes become camelCase, and the value is a string.",
      wrong: { b: "Not valid property syntax.", c: "data attributes live on dataset.", d: "7 is the value, not the key." } }),
  ]),

  ...check("wd-l93-styles-create", [
    q({ id: "wdq93-1", atom: "a-wd-styles-classes", d: 2, prompt: "When is element.style the right tool?", options: ["For values calculated at runtime, such as a progress bar's width", "For all styling", "Never", "Only for colours"], correct: "a",
      explanation: "Otherwise change classes and keep the look in CSS.",
      wrong: { b: "That mixes presentation into JavaScript.", c: "It has a real use.", d: "Any property." } }),
    q({ id: "wdq93-2", atom: "a-wd-create-elements", d: 2, prompt: "After const li = document.createElement(\"li\"), when does it appear on the page?", options: ["Only once it is appended to an element on the page", "Immediately", "After a reload", "When it is given text"], correct: "a",
      explanation: "It is detached until appended.",
      wrong: { b: "It is not attached yet.", c: "A reload would lose it.", d: "Text alone does not attach it." } }),
    q({ id: "wdq93-3", atom: "a-wd-append-remove", d: 2, prompt: "Which call empties a list element so it can be rebuilt?", options: ["list.replaceChildren()", "list.remove()", "list.append()", "list.classList.clear()"], correct: "a",
      explanation: "With no arguments it removes every child.",
      wrong: { b: "That removes the list itself.", c: "Adds nothing.", d: "Not a classList method." } }),
    q({ id: "wdq93-4", atom: "a-wd-classlist", d: 3, prompt: "What does li.classList.toggle(\"done\", task.done) do?", options: ["Adds done when task.done is true and removes it when false", "Always adds done", "Flips the class twice", "Sets task.done"], correct: "a",
      explanation: "The second argument forces the result.",
      wrong: { b: "It depends on the condition.", c: "It sets it once.", d: "It reads task.done; it does not change it." } }),
  ]),

  ...check("wd-l94-traversal-efficiency", [
    q({ id: "wdq94-1", atom: "a-wd-traversal", d: 2, prompt: "A Delete button sits inside a span, inside a td, inside a tr. How do you get the tr?", options: ["button.closest(\"tr\")", "button.parentElement", "button.nextElementSibling", "document.querySelector(\"tr\")"], correct: "a",
      explanation: "closest walks up to the nearest match, however deep.",
      wrong: { b: "That is the span.", c: "A sibling, not an ancestor.", d: "That is the first row on the page." } }),
    q({ id: "wdq94-2", atom: "a-wd-traversal", d: 2, prompt: "What does element.children contain?", options: ["The elements directly inside it", "Every descendant at any depth", "Its parent", "Its text"], correct: "a",
      explanation: "Only direct child elements.",
      wrong: { b: "Use querySelectorAll for all descendants.", c: "That is parentElement.", d: "That is textContent." } }),
    q({ id: "wdq94-3", atom: "a-wd-efficient-updates", d: 3, prompt: "Why build 500 list items in a DocumentFragment?", options: ["The live page is updated once instead of 500 times", "Fragments are prettier", "It is required for lists", "It hides the items"], correct: "a",
      explanation: "Fewer updates, less layout work.",
      wrong: { b: "No visual difference.", c: "Not required.", d: "The items are shown when it is appended." } }),
    q({ id: "wdq94-4", atom: "a-wd-efficient-updates", d: 3, prompt: "What makes a loop that sets a height and then reads offsetHeight on each item slow?", options: ["Reading a layout value after a write forces the browser to recalculate layout each time", "offsetHeight is a string", "Loops are always slow", "Heights cannot be set"], correct: "a",
      explanation: "Batch the reads, then the writes.",
      wrong: { b: "It is a number.", c: "Not inherently.", d: "They can." } }),
  ]),
};
