/**
 * ASSESSMENTS · RESPONSIVE WEB DEVELOPMENT · PHASE 5 PROJECTS AND GATE
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Never import this from anything under src/.
 * ═════════════════════════════════════════════════════════════════════════
 */

import { q, check } from "./wd-helpers.js";

export const ASSESSMENTS = {
  ...check("wd-l131-task-manager", [
    q({ id: "wdq131-1", atom: "a-wd-p5-task-plan", d: 2, prompt: "In the store pattern, how should a component change the state?", options: ["By calling setState, which notifies every subscriber", "By editing the state object directly", "By editing the DOM", "By reloading the page"], correct: "a",
      explanation: "One door for changes keeps every view in step.",
      wrong: { b: "Nobody would be told.", c: "The DOM is derived from the state.", d: "Unnecessary and loses state." } }),
    q({ id: "wdq131-2", atom: "a-wd-p5-task-brief", d: 2, prompt: "What does aria-pressed=\"true\" on a filter button communicate?", options: ["That the toggle button is currently on", "That the button is disabled", "That the button was clicked once", "That it is a link"], correct: "a",
      explanation: "Screen readers announce \"pressed\".",
      wrong: { b: "That is disabled.", c: "It describes state, not history.", d: "It is a button." } }),
    q({ id: "wdq131-3", atom: "a-wd-p5-task-build", d: 3, prompt: "Why does the render function never get called directly from event handlers?", options: ["It is subscribed to the store, so it runs whenever any handler changes the state", "Handlers cannot call functions", "It would be too slow", "It must only run once"], correct: "a",
      explanation: "Handlers change state; the subscription re-renders.",
      wrong: { b: "They can.", c: "Not the reason.", d: "It runs on every change." } }),
    q({ id: "wdq131-4", atom: "a-wd-p5-task-build", d: 2, prompt: "Why keep visibleTasks in logic.js with no DOM code?", options: ["It can be tested on its own and reused anywhere", "Modules cannot use the DOM", "It loads faster", "It hides the tasks"], correct: "a",
      explanation: "Pure logic is portable and testable.",
      wrong: { b: "They can; it is a design choice.", c: "Not the point.", d: "Unrelated." } }),
  ]),

  ...check("wd-l132-catalog-filters", [
    q({ id: "wdq132-1", atom: "a-wd-p5-cat-plan", d: 3, prompt: "Why compute results from the full product list and ALL filters every time?", options: ["Filters cannot interfere, and removing one brings its products back", "It uses less memory", "Forms require it", "It is faster to code"], correct: "a",
      explanation: "Derived results from complete inputs are always right.",
      wrong: { b: "Not the reason.", c: "Unrelated.", d: "Correctness is the point." } }),
    q({ id: "wdq132-2", atom: "a-wd-p5-cat-brief", d: 2, prompt: "How do you read every ticked checkbox named category?", options: ["new FormData(form).getAll(\"category\")", "form.category.value", "document.querySelector(\"[name=category]\").value", "localStorage.getItem(\"category\")"], correct: "a",
      explanation: "getAll returns every value for a name.",
      wrong: { b: "Not reliable for several checkboxes.", c: "Only the first checkbox's value, ticked or not.", d: "Unrelated." } }),
    q({ id: "wdq132-3", atom: "a-wd-p5-cat-build", d: 2, prompt: "An empty maximum-price field should mean what?", options: ["No price limit", "A limit of ₦0", "An error", "Hide all products"], correct: "a",
      explanation: "Number(\"\") is 0, so check for empty first.",
      wrong: { b: "That would hide everything.", c: "Empty is a normal state.", d: "Unhelpful." } }),
    q({ id: "wdq132-4", atom: "a-wd-p5-cat-build", d: 3, prompt: "Why render a moment after the form's reset event?", options: ["The fields are cleared after the event fires", "reset does not fire", "Rendering must be delayed always", "To animate"], correct: "a",
      explanation: "Wait for the reset to apply, then render.",
      wrong: { b: "It fires.", c: "Only here.", d: "Unrelated." } }),
  ]),

  ...check("wd-l133-course-site", [
    q({ id: "wdq133-1", atom: "a-wd-p5-site-plan", d: 2, prompt: "A new page must be added to the site's menu. With a shared nav module, what do you change?", options: ["One entry in PAGES", "Every page's HTML", "The CSS", "Nothing"], correct: "a",
      explanation: "The menu is rendered from data.",
      wrong: { b: "That is what sharing avoids.", c: "Style is unrelated.", d: "Something must list the page." } }),
    q({ id: "wdq133-2", atom: "a-wd-p5-site-brief", d: 2, prompt: "How does each page mark itself as current in the shared nav?", options: ["It calls renderNav with its own file name, which sets aria-current", "The browser does it automatically", "With a separate CSS file per page", "It cannot"], correct: "a",
      explanation: "The current page is a parameter.",
      wrong: { b: "Not automatic.", c: "Unnecessary.", d: "It can." } }),
    q({ id: "wdq133-3", atom: "a-wd-p5-site-build", d: 2, prompt: "Why put course data in its own module?", options: ["Every page that shows courses reads the same source, so they never disagree", "Data must always be in modules", "It is faster", "To hide it"], correct: "a",
      explanation: "One source of truth.",
      wrong: { b: "A convention for good reasons, not a rule.", c: "Not the point.", d: "It is public either way." } }),
    q({ id: "wdq133-4", atom: "a-wd-p5-site-build", d: 3, prompt: "Two page modules both import nav.js. How many times does nav.js run?", options: ["Once per page load: each page is a separate document", "Twice on every page", "Never", "Once for the whole site, forever"], correct: "a",
      explanation: "A module runs once per document, however many imports.",
      wrong: { b: "Modules are evaluated once per document.", c: "It runs when imported.", d: "Each page load is separate." } }),
  ]),

  ...check("wd-l134-student-dashboard", [
    q({ id: "wdq134-1", atom: "a-wd-p5-dash-plan", d: 3, prompt: "What does aria-sort=\"descending\" on a table header do?", options: ["Tells assistive technology the table is sorted by that column, highest first", "Sorts the table", "Hides the column", "Makes the header bold"], correct: "a",
      explanation: "It describes the sort; your code does the sorting.",
      wrong: { b: "It only announces.", c: "No.", d: "No." } }),
    q({ id: "wdq134-2", atom: "a-wd-p5-dash-brief", d: 2, prompt: "Why put buttons inside sortable column headers?", options: ["So the headers can be used with the keyboard and are announced as controls", "Buttons look nicer", "Tables need buttons", "To submit the table"], correct: "a",
      explanation: "A clickable th is not keyboard-focusable.",
      wrong: { b: "Accessibility is the reason.", c: "Only for interaction.", d: "Nothing is submitted." } }),
    q({ id: "wdq134-3", atom: "a-wd-p5-dash-build", d: 2, prompt: "Why does sortRows return a sorted copy?", options: ["sort changes the array it is called on; a copy keeps the original order intact", "Copies sort faster", "sort needs a copy to work", "To delete duplicates"], correct: "a",
      explanation: "Pure functions do not change their input.",
      wrong: { b: "Same speed.", c: "It works in place.", d: "Unrelated." } }),
    q({ id: "wdq134-4", atom: "a-wd-p5-dash-build", d: 2, prompt: "Which layout gives one, two then four stat cards per row as the screen grows?", options: ["A grid with media queries at about 600px and 1024px", "A table", "position: absolute", "float: left"], correct: "a",
      explanation: "Mobile first: one column, then two, then four.",
      wrong: { b: "Tables are for data.", c: "Breaks the flow.", d: "Fragile." } }),
  ]),

  ...check("wd-l135-api-app", [
    q({ id: "wdq135-1", atom: "a-wd-p5-api-plan", d: 2, prompt: "Why put every request in an api.js module?", options: ["The API's details live in one place, easy to change and to fake in tests", "fetch only works in api.js", "It hides the API from visitors", "It makes requests faster"], correct: "a",
      explanation: "Isolation makes change and testing easy.",
      wrong: { b: "fetch works anywhere.", c: "Network requests are always visible.", d: "Not the reason." } }),
    q({ id: "wdq135-2", atom: "a-wd-p5-api-brief", d: 2, prompt: "When should the Load more button be hidden?", options: ["When nextPage is null: there are no more pages", "After the first click", "While loading", "Never"], correct: "a",
      explanation: "It disappears at the end of the data.",
      wrong: { b: "There may be more pages.", c: "Disable it while loading instead.", d: "Then it would fetch nothing." } }),
    q({ id: "wdq135-3", atom: "a-wd-p5-api-build", d: 3, prompt: "Why does fetchRepos throw when res.ok is false?", options: ["So the caller's catch handles every failure the same way", "fetch requires it", "To retry automatically", "To hide the error"], correct: "a",
      explanation: "One error path for the page to handle.",
      wrong: { b: "fetch does not require it.", c: "Nothing retries.", d: "It surfaces the error." } }),
    q({ id: "wdq135-4", atom: "a-wd-p5-api-build", d: 2, prompt: "Why disable Load more while a page is loading?", options: ["So rapid clicks do not fetch the same page twice", "To save colours", "Buttons must be disabled when hidden", "It is not needed"], correct: "a",
      explanation: "Handle repeated actions.",
      wrong: { b: "Unrelated.", c: "Unrelated.", d: "Duplicates appear without it." } }),
  ]),

  ...check("wd-l136-p5-gate", [
    q({ id: "wdq136-1", atom: "a-wd-p5-gate-brief", d: 2, prompt: "What should getSaved() return when the stored data is corrupted?", options: ["An empty array", "An error", "null", "The corrupted text"], correct: "a",
      explanation: "Fail safe, so pages keep working.",
      wrong: { b: "Would break the page.", c: "Callers expect an array.", d: "Not usable." } }),
    q({ id: "wdq136-2", atom: "a-wd-p5-gate-build", d: 3, prompt: "Saved events must appear on a different page. What makes that possible?", options: ["Both pages read the same saved ids from localStorage through the shared saved.js", "Global variables shared between pages", "The URL", "Cookies set by CSS"], correct: "a",
      explanation: "Each page is a fresh document; storage persists between them.",
      wrong: { b: "Globals reset on every page load.", c: "Not used here.", d: "CSS does not set cookies." } }),
    q({ id: "wdq136-3", atom: "a-wd-p5-gate-build", d: 2, prompt: "What does \"documented source code\" mean in the gate?", options: ["Every exported function has a /** … */ comment describing it", "The code is printed", "Comments on every line", "A separate Word document"], correct: "a",
      explanation: "Doc comments are shown by editors and read by teammates.",
      wrong: { b: "No.", c: "Over-commenting is noise.", d: "Documentation lives with the code." } }),
    q({ id: "wdq136-4", atom: "a-wd-p5-gate-review", d: 2, prompt: "What turns a working app into a professional deliverable?", options: ["Git history, a README and tests, alongside the working code", "More colours", "Fewer files", "Removing comments"], correct: "a",
      explanation: "Others must be able to understand and maintain it.",
      wrong: { b: "Unrelated.", c: "Structure matters more than count.", d: "Documentation is valuable." } }),
  ]),
};
