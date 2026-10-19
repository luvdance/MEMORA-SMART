/**
 * ASSESSMENTS · RESPONSIVE WEB DEVELOPMENT · PHASE 4 PROJECTS AND GATE
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Never import this from anything under src/.
 * ═════════════════════════════════════════════════════════════════════════
 */

import { q, check } from "./wd-helpers.js";

export const ASSESSMENTS = {
  ...check("wd-l114-todo", [
    q({ id: "wdq114-1", atom: "a-wd-p4-todo-plan", d: 2, prompt: "In the to-do app, what is the single source of truth?", options: ["The todos array", "The li elements on the page", "localStorage", "The form"], correct: "a",
      explanation: "The page and storage are both copies of the array.",
      wrong: { b: "The page is rendered from the array.", c: "Storage is a saved copy.", d: "The form only collects input." } }),
    q({ id: "wdq114-2", atom: "a-wd-p4-todo-build", d: 2, prompt: "Why use one listener on the list for Done and Delete buttons?", options: ["New tasks' buttons work without adding listeners to each one", "Buttons cannot have listeners", "It is required by localStorage", "It makes the page prettier"], correct: "a",
      explanation: "Event delegation handles elements added later.",
      wrong: { b: "They can.", c: "Unrelated.", d: "Unrelated." } }),
    q({ id: "wdq114-3", atom: "a-wd-p4-todo-brief", d: 2, prompt: "When should the to-do list be saved?", options: ["After every change", "Only when the tab closes", "Once an hour", "Only when the user asks"], correct: "a",
      explanation: "Every add, toggle and delete.",
      wrong: { b: "Unreliable.", c: "Changes would be lost.", d: "People expect it to just remember." } }),
    q({ id: "wdq114-4", atom: "a-wd-p4-todo-build", d: 3, type: "scenario", prompt: "A task titled <b>bold</b> appears in bold. What is wrong?", options: ["The title is inserted with innerHTML instead of textContent", "The CSS makes it bold", "localStorage changed it", "Nothing"], correct: "a",
      explanation: "User text must be set with textContent.",
      wrong: { b: "The markup became a real element.", c: "Storage keeps text exactly.", d: "It is an injection risk." } }),
  ]),

  ...check("wd-l115-weather", [
    q({ id: "wdq115-1", atom: "a-wd-p4-weather-plan", d: 2, prompt: "Which weather API suits a frontend-only project?", options: ["One that needs no key, or offers a publishable key restricted to your domain", "One that needs a secret key", "None can be used", "Any; keys are not a concern"], correct: "a",
      explanation: "Secret keys must never be in frontend code.",
      wrong: { b: "The key would be public.", c: "Many are designed for browsers.", d: "Leaked keys can be abused." } }),
    q({ id: "wdq115-2", atom: "a-wd-p4-weather-brief", d: 2, prompt: "How do you keep the last three searches, newest first, without repeats?", options: ["[city, ...recent.filter((c) => c !== city)].slice(0, 3)", "recent.push(city)", "recent.slice(3)", "[...recent, city]"], correct: "a",
      explanation: "Put the new city first, remove its old copy, keep three.",
      wrong: { b: "Adds to the end and keeps repeats.", c: "Drops the first three.", d: "Adds to the end with repeats." } }),
    q({ id: "wdq115-3", atom: "a-wd-p4-weather-build", d: 3, prompt: "Where should the button be re-enabled after a request?", options: ["In finally, so it happens on success and on every kind of failure", "Only in the success branch", "Only in catch", "Never"], correct: "a",
      explanation: "finally always runs.",
      wrong: { b: "Errors would leave it disabled.", c: "Success would leave it disabled.", d: "Then it can never be used again." } }),
    q({ id: "wdq115-4", atom: "a-wd-p4-weather-build", d: 2, prompt: "The API returns 404 for an unknown city. What should the page show?", options: ["A clear message such as \"City not found\"", "An empty page", "The raw response", "The previous city's weather"], correct: "a",
      explanation: "Say what happened, in plain words.",
      wrong: { b: "Looks broken.", c: "Meaningless to visitors.", d: "Misleading." } }),
  ]),

  ...check("wd-l116-quiz-app", [
    q({ id: "wdq116-1", atom: "a-wd-p4-quiz-plan", d: 2, prompt: "Why disable the options once one is chosen?", options: ["So an answer cannot be changed after seeing the feedback", "To save memory", "Buttons must be disabled after one click", "To make the page faster"], correct: "a",
      explanation: "Guarded state prevents gaming the score.",
      wrong: { b: "Unrelated.", c: "Not a general rule.", d: "Unrelated." } }),
    q({ id: "wdq116-2", atom: "a-wd-p4-quiz-brief", d: 2, prompt: "How should the best score be saved?", options: ["As Math.max(current score, saved best)", "Always the latest score", "Only the first score ever", "As the average"], correct: "a",
      explanation: "A lower score never replaces a higher one.",
      wrong: { b: "That would lower the best.", c: "Better scores would be ignored.", d: "Not a best score." } }),
    q({ id: "wdq116-3", atom: "a-wd-p4-quiz-build", d: 2, prompt: "What state does the quiz need to track?", options: ["The current question index, the score and whether it has been answered", "Only the score", "The HTML of each question", "Nothing"], correct: "a",
      explanation: "The interface is drawn from this state.",
      wrong: { b: "It must also know which question.", c: "HTML is generated from data.", d: "It needs state to move on." } }),
    q({ id: "wdq116-4", atom: "a-wd-p4-quiz-build", d: 2, prompt: "Storage returns the saved best score \"2\". What must you do before comparing it?", options: ["Convert it with Number()", "Nothing", "JSON.stringify it", "Add a space"], correct: "a",
      explanation: "Storage holds strings.",
      wrong: { b: "Comparing strings and numbers invites bugs.", c: "That makes another string.", d: "Irrelevant." } }),
  ]),

  ...check("wd-l117-catalog", [
    q({ id: "wdq117-1", atom: "a-wd-p4-cat-plan", d: 3, prompt: "Why must the full product array never be overwritten by search results?", options: ["Clearing or changing the search needs the products that were filtered out", "Arrays cannot be reassigned", "It would use too much memory", "Search results are strings"], correct: "a",
      explanation: "Visible items are derived, not stored.",
      wrong: { b: "They can; it loses data.", c: "Memory is not the issue.", d: "They are product objects." } }),
    q({ id: "wdq117-2", atom: "a-wd-p4-cat-build", d: 2, prompt: "How do you make search ignore capital letters?", options: ["Compare name.toLowerCase() with the query lower-cased", "Use ===", "Use .length", "Sort first"], correct: "a",
      explanation: "Both sides in the same case.",
      wrong: { b: "Case-sensitive.", c: "Unrelated.", d: "Unrelated." } }),
    q({ id: "wdq117-3", atom: "a-wd-p4-cat-build", d: 3, prompt: "Which sorts product names alphabetically in a way people expect?", options: ["a.name.localeCompare(b.name)", "a.name - b.name", "a.price - b.price", "sort() with no compare function on objects"], correct: "a",
      explanation: "localeCompare handles case and accents sensibly.",
      wrong: { b: "Subtracting strings gives NaN.", c: "That sorts by price.", d: "Objects become \"[object Object]\"." } }),
    q({ id: "wdq117-4", atom: "a-wd-p4-cat-brief", d: 2, prompt: "When should the catalogue fetch the products?", options: ["Once, when the page loads", "On every keystroke", "Every second", "Never"], correct: "a",
      explanation: "Search and filter work on the loaded data.",
      wrong: { b: "Wasteful and slow.", c: "Wasteful.", d: "Then there is nothing to show." } }),
  ]),

  ...check("wd-l118-expense-tracker", [
    q({ id: "wdq118-1", atom: "a-wd-p4-exp-plan", d: 3, prompt: "What does parseInt(\"2,500\") return?", options: ["2", "2500", "NaN", "\"2500\""], correct: "a",
      explanation: "It stops at the comma. Remove commas, then use Number().",
      wrong: { b: "Only after removing the comma.", c: "It reads the leading 2.", d: "It returns a number." } }),
    q({ id: "wdq118-2", atom: "a-wd-p4-exp-brief", d: 2, prompt: "Where should the total and the category breakdown come from?", options: ["Recalculated from the expenses array on every render", "Typed in by the user", "Stored separately and updated by hand", "Hard-coded"], correct: "a",
      explanation: "Derived values cannot drift from the data.",
      wrong: { b: "They are calculated.", c: "Two copies drift apart.", d: "They change with the data." } }),
    q({ id: "wdq118-3", atom: "a-wd-p4-exp-build", d: 2, prompt: "Why could the Phase 3 totals functions be reused unchanged?", options: ["They are pure and do not touch the DOM", "They were copied", "JavaScript reuses functions automatically", "They were written in HTML"], correct: "a",
      explanation: "Pure logic works anywhere.",
      wrong: { b: "Reuse does not need copying when logic is separate.", c: "Not automatic.", d: "They are JavaScript." } }),
    q({ id: "wdq118-4", atom: "a-wd-p4-exp-build", d: 2, prompt: "Which amount should be refused?", options: ["\"0\"", "\"1500\"", "\"2,500\"", "\"99.50\""], correct: "a",
      explanation: "The amount must be greater than 0.",
      wrong: { b: "Valid.", c: "Valid once commas are removed.", d: "Valid." } }),
  ]),

  ...check("wd-l119-p4-gate", [
    q({ id: "wdq119-1", atom: "a-wd-p4-gate-brief", d: 2, prompt: "Why validate the ISBN before calling the API?", options: ["To avoid pointless requests and give instant, clear feedback", "The API cannot read numbers", "To make the page longer", "It is not needed"], correct: "a",
      explanation: "Invalid input never needs a network round trip.",
      wrong: { b: "Unrelated.", c: "Unrelated.", d: "It saves time and requests." } }),
    q({ id: "wdq119-2", atom: "a-wd-p4-gate-build", d: 3, prompt: "Which check correctly accepts only 10 or 13 digits?", options: ["/^(\\d{10}|\\d{13})$/", "/\\d{10,13}/", "/^\\d+$/", "isbn.length > 9"], correct: "a",
      explanation: "Anchored, and exactly one of the two lengths.",
      wrong: { b: "Unanchored, and allows 11 and 12.", c: "Any number of digits.", d: "Allows letters and any length above 9." } }),
    q({ id: "wdq119-3", atom: "a-wd-p4-gate-build", d: 2, prompt: "A 503 response arrives. Which message fits?", options: ["The book service is unavailable", "Book not found", "Check your connection", "Success"], correct: "a",
      explanation: "5xx means the server failed.",
      wrong: { b: "That is for 404.", c: "That is for network failures.", d: "Not ok." } }),
    q({ id: "wdq119-4", atom: "a-wd-p4-gate-review", d: 2, prompt: "Your app passes every automated check. What should you still do?", options: ["Test it with the keyboard, a screen reader and a phone", "Nothing", "Delete the tests", "Rewrite it"], correct: "a",
      explanation: "Manual testing finds what checks miss.",
      wrong: { b: "Checks do not cover everything.", c: "Tests protect future changes.", d: "Unnecessary." } }),
  ]),
};
