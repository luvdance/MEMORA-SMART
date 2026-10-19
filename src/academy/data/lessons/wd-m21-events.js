/**
 * RESPONSIVE WEB DEVELOPMENT · MODULE 21 · EVENTS AND INTERACTION
 *
 * Curriculum 21.1 – 21.12. What events are; click, input, change, submit and
 * keyboard events; listeners and the event object; bubbling, capturing and
 * delegation; preventing default behaviour; accessible menus and modals;
 * and handling repeated actions. The checks click, type and press keys on
 * the learner's page and inspect what changed.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

export const SECTION_ID = "wd-s21-events";

const page = (title, body) => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title}</title>
  <link rel="stylesheet" href="style.css">
  <script src="app.js" defer></script>
</head>
<body>
${body}
</body>
</html>
`;

const CSS = "body { font-family: Arial, sans-serif; padding: 16px; }\nbutton { min-height: 44px; padding: 8px 14px; }\n";

const COUNTER_HTML = page("Counter", `  <section>
    <h1>Plates of jollof</h1>
    <button id="minus" aria-label="One fewer">−</button>
    <output id="count">0</output>
    <button id="plus" aria-label="One more">+</button>
  </section>
  <section>
    <label for="note">Delivery note</label>
    <textarea id="note" maxlength="100"></textarea>
    <p id="chars">0 / 100</p>
    <label for="city">City</label>
    <select id="city">
      <option value="lagos">Lagos</option>
      <option value="abuja">Abuja</option>
    </select>
    <p id="fee">Delivery: ₦1000</p>
  </section>`);

const FORM_HTML = page("Shopping list", `  <form id="add-form">
    <label for="item">Add an item</label>
    <input id="item" name="item" type="text" autocomplete="off">
    <button type="submit">Add</button>
  </form>
  <ul id="list"></ul>
  <p>Press / to jump to the box, Escape to clear it.</p>`);

const DELEGATE_HTML = page("Tasks", `  <ul id="tasks">
    <li data-id="1"><span class="title">Buy rice</span> <button class="delete" aria-label="Delete Buy rice">✕</button></li>
    <li data-id="2"><span class="title">Call Mum</span> <button class="delete" aria-label="Delete Call Mum">✕</button></li>
  </ul>
  <button id="add">Add a task</button>
  <a id="help" href="https://example.com/help">Help</a>
  <p id="status"></p>`);

const MODAL_HTML = page("FAQ", `  <section class="faq">
    <h2>
      <button class="faq__q" aria-expanded="false" aria-controls="a1">Do you deliver on Sundays?</button>
    </h2>
    <div id="a1" class="faq__a" hidden><p>Yes, from noon to 6pm.</p></div>
  </section>
  <button id="open-modal">Subscribe</button>
  <div id="backdrop" class="backdrop" hidden>
    <div class="modal" role="dialog" aria-modal="true" aria-labelledby="m-title">
      <h2 id="m-title">Get our weekly deals</h2>
      <button id="close-modal">Close</button>
      <button id="pay">Pay ₦500</button>
    </div>
  </div>
  <p id="payments">0</p>`);

const MODAL_CSS = `${CSS}
.backdrop { position: fixed; inset: 0; display: grid; place-items: center; background: rgba(0, 0, 0, 0.5); }
.backdrop[hidden] { display: none; }
.modal { padding: 24px; background: white; border-radius: 12px; }
`;

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 95 · 21.1 – 21.3
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "wd-l95-events-click-input",
    moduleId: "wd-m21-events",
    sectionId: SECTION_ID,
    order: 1,
    covers: ["21.1", "21.2", "21.3"],
    title: "Events, Clicks, Input and Change",
    subtitle: "Making a page respond to what the visitor does",
    estimatedMinutes: 24,
    intro: "Until now your scripts ran once when the page loaded. Events let them run again whenever something happens: a click, a key press, a change of selection. This is what makes a page interactive.",

    atoms: [
      {
        id: "a-wd-what-events",
        title: "What events are",
        explain:
          "An event is the browser's announcement that something happened: a click, a key press, typing in a field, a form submitted, the page finished loading. You choose which events to listen for and give the browser a function to call each time one happens. That function, the event handler, is a callback, exactly as in Module 16.",
        table: {
          caption: "Events you will handle most often.",
          headers: ["Event", "Fires when"],
          rows: [
            ["click", "An element is clicked, tapped, or activated with Enter or Space (buttons)"],
            ["input", "The value of a field changes, on every keystroke"],
            ["change", "A field's value is committed: a select changes, a checkbox ticks, a text field loses focus"],
            ["submit", "A form is submitted, by a button or Enter"],
            ["keydown", "A key is pressed"],
            ["DOMContentLoaded", "The HTML has been parsed into the DOM"],
          ],
        },
      },
      {
        id: "a-wd-click",
        title: "Click events",
        explain:
          "button.addEventListener(\"click\", handler) calls handler every time the button is clicked. A click on a real <button> also fires for keyboard users pressing Enter or Space, which is another reason to use buttons for actions. Keep state in a variable and update the page from it in the handler.",
        example: "let count = 0;\nconst out = document.querySelector(\"#count\");\n\ndocument.querySelector(\"#plus\").addEventListener(\"click\", () => {\n  count++;\n  out.textContent = count;\n});",
      },
      {
        id: "a-wd-input-change",
        title: "Input and change events",
        explain:
          "input fires on every keystroke in a text field, so use it for live feedback: a character count, a search that filters as you type. change fires when the value is committed: immediately for selects, checkboxes and radios, and when a text field loses focus. Read the field's current value with field.value, which is always a string.",
        webLab: {
          task:
            "Make the order panel interactive. (1) The + and − buttons change the count shown in #count; it must never go below 0. (2) Typing in the delivery note updates #chars live, such as \"12 / 100\". (3) Changing the city select updates #fee: Lagos is ₦1000, Abuja is ₦1500.",
          files: { "index.html": COUNTER_HTML, "style.css": CSS, "app.js": "// Wire up the buttons, the note and the city\n" },
          readOnly: ["index.html", "style.css"],
          tests: [
            { label: "+ adds one each time", check: "await click('#plus'); await click('#plus'); await click('#plus'); return text('#count') === '3';", fail: "Listen for click on #plus, add one to a count variable and show it." },
            { label: "− takes one away", check: "await click('#minus'); return text('#count') === '2';", fail: "Listen for click on #minus too." },
            { label: "The count never goes below 0", check: "for (let i = 0; i < 5; i++) await click('#minus'); return text('#count') === '0';", fail: "Only subtract when the count is above 0." },
            { label: "Typing in the note updates the character count live", check: "await type('#note', 'Gate code 4471'); return text('#chars') === '14 / 100';", fail: "Listen for input on #note and show note.value.length + \" / 100\"." },
            { label: "Choosing Abuja shows ₦1500, and Lagos ₦1000", check: "const s = $('#city'); s.value = 'abuja'; s.dispatchEvent(new Event('change', { bubbles: true })); await tick(); const a = text('#fee'); s.value = 'lagos'; s.dispatchEvent(new Event('change', { bubbles: true })); await tick(); return a === 'Delivery: ₦1500' && text('#fee') === 'Delivery: ₦1000';", fail: "Listen for change on #city and set the fee from its value." },
          ],
          solution: { "app.js": "let count = 0;\nconst countOut = document.querySelector(\"#count\");\n\ndocument.querySelector(\"#plus\").addEventListener(\"click\", () => {\n  count++;\n  countOut.textContent = count;\n});\n\ndocument.querySelector(\"#minus\").addEventListener(\"click\", () => {\n  if (count > 0) count--;\n  countOut.textContent = count;\n});\n\nconst note = document.querySelector(\"#note\");\nnote.addEventListener(\"input\", () => {\n  document.querySelector(\"#chars\").textContent = `${note.value.length} / 100`;\n});\n\nconst fees = { lagos: 1000, abuja: 1500 };\ndocument.querySelector(\"#city\").addEventListener(\"change\", (event) => {\n  document.querySelector(\"#fee\").textContent = `Delivery: ₦${fees[event.target.value]}`;\n});\n" },
          hint: "Keep the count in a variable outside the handlers; each handler updates it and then the page.",
          successMessage: "Three kinds of event, each used for its job: click for actions, input for live feedback, change for committed choices.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 96 · 21.4 – 21.7
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "wd-l96-submit-keys",
    moduleId: "wd-m21-events",
    sectionId: SECTION_ID,
    order: 2,
    covers: ["21.4", "21.5", "21.6", "21.7"],
    title: "Form Submission, Keyboard Events, Listeners and the Event Object",
    subtitle: "Handling forms without reloading, keys, and what the browser tells your handler",
    estimatedMinutes: 26,
    intro: "Forms are the main way visitors give a page information, and by default submitting one reloads the page. This lesson handles submission in JavaScript, adds keyboard shortcuts, and looks inside the event object every handler receives.",

    atoms: [
      {
        id: "a-wd-form-submission",
        title: "Form submission",
        explain:
          "Listen for submit on the FORM, not click on its button: submit fires for the button and for Enter in a field, and native validation runs first. Call event.preventDefault() to stop the browser loading a new page, then read the values and update the page yourself. form.reset() clears the fields afterwards.",
        example: "form.addEventListener(\"submit\", (event) => {\n  event.preventDefault();               // no page reload\n  const value = form.elements.item.value.trim();\n  if (!value) return;\n  addToList(value);\n  form.reset();\n});",
      },
      {
        id: "a-wd-keyboard-events",
        title: "Keyboard events",
        explain:
          "keydown fires when a key is pressed (and repeats while held); keyup when it is released. event.key is the key's value: \"Enter\", \"Escape\", \"ArrowDown\", \"a\", \"/\". Use keyboard shortcuts to help, never as the only way to do something, and do not hijack keys while the visitor is typing in a field.",
        example: "document.addEventListener(\"keydown\", (event) => {\n  if (event.key === \"Escape\") closeMenu();\n});",
      },
      {
        id: "a-wd-event-listeners",
        title: "Event listeners",
        explain:
          "addEventListener(type, handler, options) can be called many times on the same element; every handler runs. Pass the function itself (handler), never its result (handler()). removeEventListener(type, handler) removes one, which needs the same named function. { once: true } removes it automatically after the first time. Avoid the old onclick property: it allows only one handler.",
      },
      {
        id: "a-wd-event-object",
        title: "The event object",
        explain:
          "Every handler receives an event object describing what happened. event.type is the event's name, event.target is the element where it started (the exact thing clicked), event.currentTarget is the element the listener is on, event.key is the key for keyboard events, and event.preventDefault() cancels the browser's own action.",
        webLab: {
          task:
            "Build the shopping list's behaviour. (1) Submitting the form adds the trimmed text to #list as a new li, without the page reloading, then clears the input; empty or blank entries are ignored. (2) Pressing / anywhere (except while typing in the box) puts focus in the box. (3) Pressing Escape while in the box clears it.",
          files: { "index.html": FORM_HTML, "style.css": CSS, "app.js": "// Handle submit, the / shortcut and Escape\n" },
          readOnly: ["index.html", "style.css"],
          tests: [
            { label: "Submitting adds the item to the list", check: "await type('#item', '  Garri  '); await submit('#add-form'); return $$('#list li').length === 1 && text('#list li') === 'Garri';", fail: "Listen for submit on the form, trim the value and append an li." },
            { label: "The page does not reload (the default is prevented)", check: "return submissions().length === 0;", fail: "Call event.preventDefault() in the submit handler." },
            { label: "The input is cleared after adding", check: "return $('#item').value === '';", fail: "Call form.reset() or set the input's value to \"\"." },
            { label: "Blank entries are ignored", check: "await type('#item', '   '); await submit('#add-form'); return $$('#list li').length === 1;", fail: "If the trimmed value is empty, return without adding." },
            { label: "Pressing / focuses the box", check: "$('#item').blur(); await key(document.body, '/'); return document.activeElement === $('#item');", fail: "On keydown, if event.key === \"/\" and the box is not focused, call preventDefault and item.focus()." },
            { label: "Escape clears the box", check: "await type('#item', 'Beans'); await key('#item', 'Escape'); return $('#item').value === '';", fail: "On keydown in the box, if event.key === \"Escape\", clear its value." },
          ],
          solution: { "app.js": "const form = document.querySelector(\"#add-form\");\nconst input = document.querySelector(\"#item\");\nconst list = document.querySelector(\"#list\");\n\nform.addEventListener(\"submit\", (event) => {\n  event.preventDefault();\n  const value = input.value.trim();\n  if (!value) return;\n  const li = document.createElement(\"li\");\n  li.textContent = value;\n  list.append(li);\n  form.reset();\n});\n\ndocument.addEventListener(\"keydown\", (event) => {\n  if (event.key === \"/\" && document.activeElement !== input) {\n    event.preventDefault();\n    input.focus();\n  }\n});\n\ninput.addEventListener(\"keydown\", (event) => {\n  if (event.key === \"Escape\") input.value = \"\";\n});\n" },
          hint: "The / shortcut listens on document; Escape listens on the input itself.",
          successMessage: "A form that works without reloading, plus two keyboard shortcuts that help without getting in the way.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 97 · 21.8 – 21.10
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "wd-l97-bubbling-delegation",
    moduleId: "wd-m21-events",
    sectionId: SECTION_ID,
    order: 3,
    covers: ["21.8", "21.9", "21.10"],
    title: "Bubbling, Delegation and Default Behaviour",
    subtitle: "How events travel, one listener for many elements, and overriding the browser",
    estimatedMinutes: 24,
    intro: "Lists change: items are added and removed while the page is open. Attaching a listener to every item breaks as soon as new ones appear. Understanding how events travel through the tree gives a much better way.",

    atoms: [
      {
        id: "a-wd-bubbling",
        title: "Event bubbling and capturing",
        explain:
          "An event travels in three phases. Capturing: down from the document to the target. Target: at the element itself. Bubbling: back up through every ancestor to the document. Listeners run in the bubbling phase by default, so a click on a button inside an li inside a ul also triggers click listeners on the li and the ul. Pass { capture: true } to listen during the capture phase instead; event.stopPropagation() stops the journey, but use it rarely, because other code may depend on the event arriving.",
        example: "document (capture ↓)\n  └ ul#tasks\n     └ li\n        └ button   ← target\n     ↑ li       (bubble)\n  ↑ ul#tasks    (bubble)  ← a listener here sees every click inside the list\n↑ document",
      },
      {
        id: "a-wd-delegation",
        title: "Event delegation",
        explain:
          "Event delegation puts ONE listener on a parent and uses event.target to find which child was clicked. It works for elements added later, needs one listener instead of hundreds, and pairs perfectly with closest(): const button = event.target.closest(\".delete\"); if (!button) return; then button.closest(\"li\") is the item.",
      },
      {
        id: "a-wd-prevent-default",
        title: "Preventing default browser behavior",
        explain:
          "Many events have a default action: a link navigates, a form submits and reloads, a key scrolls or types. event.preventDefault() cancels it, so your code can do something else instead. Cancel defaults only when you replace them with equivalent behaviour; a link that does not go anywhere is usually a sign it should have been a button.",
        webLab: {
          task:
            "Use ONE click listener on #tasks to handle every delete button, including on tasks added later: clicking a ✕ removes its li and shows \"Deleted: TITLE\" in #status. The Add button adds a new task (\"New task\", with its own delete button) to the list. And clicking the Help link should not leave the page: prevent its default and show \"Help is coming soon\" in #status.",
          files: { "index.html": DELEGATE_HTML, "style.css": CSS, "app.js": "// One listener on #tasks for every delete button\n" },
          readOnly: ["index.html", "style.css"],
          tests: [
            { label: "Clicking a ✕ removes its own task", check: "await click($$('#tasks .delete')[1]); return $$('#tasks li').length === 1 && text('#tasks li .title') === 'Buy rice';", fail: "In the #tasks listener, find event.target.closest(\".delete\") and remove its closest(\"li\")." },
            { label: "#status says which task was deleted", check: "return text('#status') === 'Deleted: Call Mum';", fail: "Read the title from the li's .title before removing it." },
            { label: "Tasks added later can be deleted too", check: "await click('#add'); const before = $$('#tasks li').length; await click($$('#tasks .delete').at(-1)); return before === 2 && $$('#tasks li').length === 1;", fail: "Add creates an li with a .title and a .delete button; delegation handles its click automatically." },
            { label: "There is a single click listener on the list, not one per button", check: "return (code('app.js').match(/addEventListener\\(\\s*['\"]click/g) || []).length <= 3 && /closest\\(/.test(code('app.js'));", fail: "Use one listener on #tasks (plus one for Add and one for Help)." },
            { label: "Clicking a task's text does nothing", check: "const n = $$('#tasks li').length; await click('#tasks .title'); return $$('#tasks li').length === n;", fail: "If closest(\".delete\") is null, return without doing anything." },
            { label: "The Help link does not navigate, and shows a message", check: "await click('#help'); return text('#status') === 'Help is coming soon';", fail: "In the link's click handler, call event.preventDefault() and set #status." },
          ],
          solution: { "app.js": "const tasks = document.querySelector(\"#tasks\");\nconst status = document.querySelector(\"#status\");\n\ntasks.addEventListener(\"click\", (event) => {\n  const button = event.target.closest(\".delete\");\n  if (!button) return;\n  const li = button.closest(\"li\");\n  status.textContent = `Deleted: ${li.querySelector(\".title\").textContent}`;\n  li.remove();\n});\n\ndocument.querySelector(\"#add\").addEventListener(\"click\", () => {\n  const li = document.createElement(\"li\");\n  const title = document.createElement(\"span\");\n  title.className = \"title\";\n  title.textContent = \"New task\";\n  const del = document.createElement(\"button\");\n  del.className = \"delete\";\n  del.setAttribute(\"aria-label\", \"Delete New task\");\n  del.textContent = \"✕\";\n  li.append(title, \" \", del);\n  tasks.append(li);\n});\n\ndocument.querySelector(\"#help\").addEventListener(\"click\", (event) => {\n  event.preventDefault();\n  status.textContent = \"Help is coming soon\";\n});\n" },
          hint: "The new task's delete button needs no listener of its own: the click bubbles up to #tasks.",
          successMessage: "One listener handles every task, present and future. Delegation is how professional lists, tables and menus are wired.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 98 · 21.11 – 21.12
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "wd-l98-menus-modals",
    moduleId: "wd-m21-events",
    sectionId: SECTION_ID,
    order: 4,
    covers: ["21.11", "21.12"],
    title: "Menus, Modals and Repeated Actions",
    subtitle: "Interactive components everyone can use, and clicks that happen twice",
    estimatedMinutes: 26,
    intro: "Accordions, dropdowns and modal dialogs are on almost every site, and are among the most commonly broken things for keyboard and screen-reader users. And real visitors double-click, mash buttons and type fast; your page must cope.",

    atoms: [
      {
        id: "a-wd-menus-modals",
        title: "Building interactive menus and modals",
        explain:
          "An accordion or dropdown is a <button> with aria-expanded and aria-controls that shows or hides a region with the hidden attribute. A modal dialog needs more: it opens on a button, moves focus into itself, closes on its Close button, on Escape and on a click on the backdrop, and returns focus to the button that opened it. The native <dialog> element with showModal() does much of this for you; building it by hand teaches what it must do.",
        table: {
          caption: "What an accessible modal must do.",
          headers: ["Requirement", "Why"],
          rows: [
            ["role=\"dialog\", aria-modal and a label", "Screen readers announce it as a dialog with its title"],
            ["Focus moves into it on open", "Keyboard users are taken to it"],
            ["Escape closes it", "The expected keyboard way out"],
            ["A click on the backdrop closes it", "The expected pointer way out"],
            ["Focus returns to the opening button", "Users are not dropped at the top of the page"],
          ],
        },
      },
      {
        id: "a-wd-repeated-actions",
        title: "Handling repeated user actions",
        explain:
          "People click twice, and networks are slow, so a Pay button clicked twice can charge twice. Disable the button (button.disabled = true) as soon as the action starts and re-enable it only if it fails. For events that fire rapidly, such as input or scroll, debounce: wait until the events stop for a moment (say 300ms) before running the expensive work, so searching while typing sends one request, not one per letter.",
        example: "function debounce(fn, ms) {\n  let timer;\n  return (...args) => {\n    clearTimeout(timer);\n    timer = setTimeout(() => fn(...args), ms);\n  };\n}\n\nsearch.addEventListener(\"input\", debounce(runSearch, 300));",
        webLab: {
          task:
            "Wire up three components. (1) The FAQ question toggles its answer's hidden attribute and keeps aria-expanded truthful. (2) Subscribe opens the modal (remove hidden from #backdrop) and moves focus to its Close button; Close, Escape and a click on the backdrop itself (not the white box) all close it and return focus to Subscribe. (3) Pay can only count once: increase #payments by one and disable the button, so further clicks do nothing.",
          files: { "index.html": MODAL_HTML, "style.css": MODAL_CSS, "app.js": "// FAQ, modal and pay button\n" },
          readOnly: ["index.html", "style.css"],
          tests: [
            { label: "The FAQ answer opens and closes, with aria-expanded kept in step", check: "const q = $('.faq__q'), a = $('#a1'); await click(q); const open = !a.hidden && q.getAttribute('aria-expanded') === 'true'; await click(q); return open && a.hidden && q.getAttribute('aria-expanded') === 'false';", fail: "Toggle a.hidden and set aria-expanded to String(!a.hidden)." },
            { label: "Subscribe opens the modal and focuses Close", check: "await click('#open-modal'); return !$('#backdrop').hidden && document.activeElement === $('#close-modal');", fail: "Remove hidden from #backdrop and call closeButton.focus()." },
            { label: "Close shuts it and returns focus to Subscribe", check: "await click('#close-modal'); return $('#backdrop').hidden && document.activeElement === $('#open-modal');", fail: "On close, set hidden again and call openButton.focus()." },
            { label: "Escape closes the modal", check: "await click('#open-modal'); await key(document.activeElement, 'Escape'); return $('#backdrop').hidden;", fail: "Listen for keydown on document; if the modal is open and event.key is \"Escape\", close it." },
            { label: "A click on the backdrop closes it, but a click inside the box does not", check: "await click('#open-modal'); $('.modal').click(); await tick(); const stillOpen = !$('#backdrop').hidden; $('#backdrop').click(); await tick(); return stillOpen && $('#backdrop').hidden;", fail: "In the backdrop's click listener, close only when event.target === backdrop." },
            { label: "Pay counts once, however many times it is clicked", check: "await click('#open-modal'); for (let i = 0; i < 3; i++) $('#pay').click(); await tick(); return text('#payments') === '1' && $('#pay').disabled === true;", fail: "Increase the count, then set pay.disabled = true straight away." },
          ],
          solution: { "app.js": "// FAQ\nconst q = document.querySelector(\".faq__q\");\nconst answer = document.querySelector(\"#a1\");\nq.addEventListener(\"click\", () => {\n  answer.hidden = !answer.hidden;\n  q.setAttribute(\"aria-expanded\", String(!answer.hidden));\n});\n\n// Modal\nconst openBtn = document.querySelector(\"#open-modal\");\nconst closeBtn = document.querySelector(\"#close-modal\");\nconst backdrop = document.querySelector(\"#backdrop\");\n\nfunction openModal() {\n  backdrop.hidden = false;\n  closeBtn.focus();\n}\nfunction closeModal() {\n  backdrop.hidden = true;\n  openBtn.focus();\n}\nopenBtn.addEventListener(\"click\", openModal);\ncloseBtn.addEventListener(\"click\", closeModal);\nbackdrop.addEventListener(\"click\", (event) => {\n  if (event.target === backdrop) closeModal();\n});\ndocument.addEventListener(\"keydown\", (event) => {\n  if (event.key === \"Escape\" && !backdrop.hidden) closeModal();\n});\n\n// Pay once\nconst pay = document.querySelector(\"#pay\");\nlet payments = 0;\npay.addEventListener(\"click\", () => {\n  pay.disabled = true;\n  payments++;\n  document.querySelector(\"#payments\").textContent = payments;\n});\n" },
          hint: "event.target is the element that was actually clicked: for a click on the dark backdrop it is the backdrop itself; for a click on the box it is the box or something inside it.",
          successMessage: "An accordion and a modal that keyboard and screen-reader users can operate, and a payment that cannot be triggered twice.",
        },
      },
    ],

    task: {
      title: "Module project: an FAQ and a modal sign-up",
      intro: "Build faq.html on your own computer.",
      prompts: [
        "At least five FAQ questions as accordion buttons with aria-expanded and aria-controls, using one delegated listener on the FAQ section.",
        "A Subscribe modal that meets every row of the accessible-modal table, including returning focus.",
        "Inside the modal, a form whose submit is handled without reloading, and whose button is disabled while \"sending\" for two seconds (use setTimeout).",
        "A search box above the FAQ that filters the questions as you type, debounced by 300ms.",
        "Test everything using only the keyboard, then with a screen reader.",
      ],
      closing: "Next module: validating what people type before it is accepted.",
    },
    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
