/**
 * RESPONSIVE WEB DEVELOPMENT · MODULE 23 · BROWSER STORAGE
 *
 * Curriculum 23.1 – 23.10. localStorage and sessionStorage, strings and JSON,
 * updating and deleting stored values, persisting preferences, tasks and
 * expenses, the limits of browser storage, and why secrets never belong in
 * it. The labs are checked twice: once after the learner's page saves
 * something, and once on a fresh page load with that data already stored,
 * which is the only real proof that persistence works.
 *
 * The practice page gives every load its own in-memory storage (a sandboxed
 * frame has none of its own), so the "fresh load" checks seed it first.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

export const SECTION_ID = "wd-s23-storage";

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

const THEME_HTML = page("Reader", `  <button id="theme-toggle" aria-pressed="false">Dark mode</button>
  <article>
    <h1>Half of a Yellow Sun</h1>
    <p>Chapter one.</p>
  </article>
  <p id="visits"></p>`);

const THEME_CSS = `body { font-family: Georgia, serif; padding: 16px; background: #ffffff; color: #111827; }
body.dark { background: #111827; color: #f9fafb; }
`;

const SETTINGS_HTML = page("Settings", `  <form id="settings">
    <label for="font-size">Text size</label>
    <select id="font-size" name="fontSize">
      <option value="16">Normal</option>
      <option value="20">Large</option>
      <option value="24">Extra large</option>
    </select>
    <label><input type="checkbox" id="notify" name="notify"> Email me about new chapters</label>
    <button type="submit">Save settings</button>
    <button type="button" id="reset">Reset to defaults</button>
  </form>
  <p id="saved" role="status"></p>`);

const TASKS_HTML = page("Tasks", `  <form id="task-form">
    <label for="task">New task</label>
    <input id="task" name="task" autocomplete="off">
    <button type="submit">Add</button>
  </form>
  <ul id="tasks"></ul>
  <p id="warning" role="status"></p>`);

const CSS = "body { font-family: Arial, sans-serif; padding: 16px; }\nbutton { min-height: 44px; }\n.done { text-decoration: line-through; color: #6b7280; }\n";

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 102 · 23.1 – 23.4
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "wd-l102-storage-basics",
    moduleId: "wd-m23-storage",
    sectionId: SECTION_ID,
    order: 1,
    covers: ["23.1", "23.2", "23.3", "23.4"],
    title: "localStorage, sessionStorage and Strings",
    subtitle: "Letting a page remember things after it is closed",
    estimatedMinutes: 24,
    intro: "Refresh a normal page and everything JavaScript did is gone: the variables start again. Browser storage lets a page remember a visitor's choices and data between visits, with no server at all.",

    atoms: [
      {
        id: "a-wd-what-storage",
        title: "What browser storage is",
        explain:
          "Web Storage is a small key-value store the browser keeps for each website (each origin: scheme, domain and port). Your page can save strings under names and read them back later. It is private to that browser on that device: the same person on another phone sees nothing, and other sites cannot read it. It is perfect for preferences, drafts and small personal data, and wrong for anything shared or secret.",
      },
      {
        id: "a-wd-localstorage",
        title: "localStorage",
        explain:
          "localStorage keeps data until it is deliberately removed: it survives refreshes, closing the tab and restarting the browser. setItem(key, value) saves, getItem(key) reads (or returns null if nothing is saved), removeItem(key) deletes one entry and clear() deletes everything for the site. You can watch it in DevTools → Application → Local Storage.",
        example: "localStorage.setItem(\"theme\", \"dark\");\nlocalStorage.getItem(\"theme\");     // \"dark\"\nlocalStorage.getItem(\"missing\");   // null\nlocalStorage.removeItem(\"theme\");",
      },
      {
        id: "a-wd-sessionstorage",
        title: "sessionStorage",
        explain:
          "sessionStorage has exactly the same methods, but its data lasts only for one tab's session: it survives a refresh, and is gone when that tab is closed. Each tab has its own. Use it for things that should not outlive the visit, such as the step a visitor has reached in a multi-page form, or whether they have dismissed a banner this time.",
        table: {
          caption: "Choosing storage.",
          headers: ["", "localStorage", "sessionStorage"],
          rows: [
            ["Lasts", "Until removed", "Until the tab closes"],
            ["Shared between tabs of the site", "Yes", "No, each tab has its own"],
            ["Good for", "Theme, saved tasks, drafts", "Form progress, one-visit flags"],
          ],
        },
      },
      {
        id: "a-wd-storage-strings",
        title: "Saving and retrieving strings",
        explain:
          "Web Storage stores only strings. A number or boolean you save comes back as text: save 3 and you get \"3\"; save true and you get \"true\", which is truthy, and so is \"false\". Convert when reading: Number(localStorage.getItem(\"visits\")), and compare with the string, getItem(\"theme\") === \"dark\". Always handle null, which means nothing has been saved yet.",
        webLab: {
          task:
            "Make the reader remember its theme. On load, if localStorage's \"theme\" is \"dark\", add the dark class to the body and set the button's aria-pressed to \"true\". Clicking the button toggles the theme and saves \"dark\" or \"light\" under \"theme\". Also count visits: read \"visits\" (treating nothing saved as 0), add one, save it, and show \"Visit number N\" in #visits.",
          files: { "index.html": THEME_HTML, "style.css": THEME_CSS, "app.js": "// Load the saved theme, wire the toggle, count visits\n" },
          readOnly: ["index.html", "style.css"],
          tests: [
            { label: "A first visit is light and shows \"Visit number 1\"", check: "return !document.body.classList.contains('dark') && text('#visits') === 'Visit number 1' && storage.getItem('visits') === '1';", fail: "Read visits with Number(getItem(\"visits\")) or 0, add one, save and show it." },
            { label: "Clicking the toggle switches to dark and saves \"dark\"", check: "await click('#theme-toggle'); return document.body.classList.contains('dark') && storage.getItem('theme') === 'dark' && $('#theme-toggle').getAttribute('aria-pressed') === 'true';", fail: "Toggle the dark class, then setItem(\"theme\", isDark ? \"dark\" : \"light\") and update aria-pressed." },
            { label: "Clicking again switches back and saves \"light\"", check: "await click('#theme-toggle'); return !document.body.classList.contains('dark') && storage.getItem('theme') === 'light';", fail: "The same handler should handle both directions." },
            { label: "On a fresh load with \"dark\" saved, the page starts dark", seed: { theme: "dark", visits: "4" }, check: "return document.body.classList.contains('dark') && $('#theme-toggle').getAttribute('aria-pressed') === 'true';", fail: "On load, read getItem(\"theme\") and apply the dark class if it is \"dark\"." },
            { label: "On that fresh load, the visit count continues: \"Visit number 5\"", seed: { theme: "dark", visits: "4" }, check: "return text('#visits') === 'Visit number 5' && storage.getItem('visits') === '5';", fail: "Convert the saved string with Number() before adding one, or \"4\" + 1 becomes \"41\"." },
          ],
          solution: { "app.js": "const toggle = document.querySelector(\"#theme-toggle\");\n\nfunction applyTheme(theme) {\n  const dark = theme === \"dark\";\n  document.body.classList.toggle(\"dark\", dark);\n  toggle.setAttribute(\"aria-pressed\", String(dark));\n}\n\napplyTheme(localStorage.getItem(\"theme\"));\n\ntoggle.addEventListener(\"click\", () => {\n  const next = document.body.classList.contains(\"dark\") ? \"light\" : \"dark\";\n  localStorage.setItem(\"theme\", next);\n  applyTheme(next);\n});\n\nconst visits = Number(localStorage.getItem(\"visits\") || 0) + 1;\nlocalStorage.setItem(\"visits\", visits);\ndocument.querySelector(\"#visits\").textContent = `Visit number ${visits}`;\n" },
          hint: "getItem returns null on a first visit; Number(null || 0) is 0.",
          successMessage: "The checks loaded the page a second time with your saved values, and it came back exactly as the visitor left it. That is persistence.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 103 · 23.5 – 23.7
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "wd-l103-json-preferences",
    moduleId: "wd-m23-storage",
    sectionId: SECTION_ID,
    order: 2,
    covers: ["23.5", "23.6", "23.7"],
    title: "JSON, Updating and Deleting, and Saving Preferences",
    subtitle: "Storing whole objects, and keeping them up to date",
    estimatedMinutes: 24,
    intro: "Storage holds strings, but your data is objects and arrays. JSON converts between the two, and is also the format every API in Module 24 speaks.",

    atoms: [
      {
        id: "a-wd-json",
        title: "Converting objects using JSON",
        explain:
          "JSON (JavaScript Object Notation) is a text format for data. JSON.stringify(value) turns an object or array into a JSON string; JSON.parse(text) turns it back. Keys and strings use double quotes; functions, undefined and Dates are not preserved as such (a Date becomes a string). Saving an object without stringify stores the useless text \"[object Object]\".",
        codeExercise: {
          language: "javascript",
          code: 'const settings = { fontSize: 20, notify: true };\nconst text = JSON.stringify(settings);\nconsole.log(text);\nconsole.log(typeof text);\nconst back = JSON.parse(text);\nconsole.log(back.fontSize + 4);\nconsole.log(String(settings));\n',
          question: "What is printed?",
          expectedOutput: '{"fontSize":20,"notify":true}\nstring\n24\n[object Object]',
          hint: "stringify gives text; parse gives back a real object with a real number in it.",
          successMessage: "The last line is what you would have saved without JSON.stringify: unrecoverable.",
        },
      },
      {
        id: "a-wd-update-delete",
        title: "Updating and deleting stored values",
        explain:
          "To change part of a stored object, read it, parse it, change the object, stringify it and save it again: storage cannot edit inside a string. setItem with an existing key replaces the old value. removeItem(key) deletes one entry, which is how \"reset to defaults\" works: remove the saved settings and the defaults apply again on the next read.",
        example: "const saved = JSON.parse(localStorage.getItem(\"settings\")) || {};\nsaved.fontSize = 24;                                   // change one property\nlocalStorage.setItem(\"settings\", JSON.stringify(saved)); // save the whole object\n\nlocalStorage.removeItem(\"settings\");                   // back to defaults",
      },
      {
        id: "a-wd-persist-preferences",
        title: "Persisting user preferences",
        explain:
          "A preferences pattern: keep DEFAULTS in code, load saved settings and merge them over the defaults ({ ...DEFAULTS, ...saved }) so a new setting added later still has a value, apply them to the page and the form, and save whenever the visitor changes them. Store preferences under one key, as one JSON object.",
        webLab: {
          task:
            "Build the settings page. DEFAULTS is { fontSize: 16, notify: false }. On load, merge saved settings from localStorage \"settings\" (JSON) over the defaults, set the form's controls to match, and apply the text size to the body (font-size in px). Saving the form stores the settings as JSON under \"settings\", applies the size and shows \"Saved\". Reset removes the saved settings and restores the defaults on the page and in the form.",
          files: { "index.html": SETTINGS_HTML, "style.css": CSS, "app.js": "const DEFAULTS = { fontSize: 16, notify: false };\n\n// Load, save and reset the settings\n" },
          readOnly: ["index.html", "style.css"],
          tests: [
            { label: "With nothing saved, the defaults apply", check: "return style('body', 'font-size') === '16px' && $('#font-size').value === '16' && $('#notify').checked === false;", fail: "Merge saved settings over DEFAULTS and apply them on load." },
            { label: "Saving stores the settings as JSON", check: "const s = $('#font-size'); s.value = '24'; s.dispatchEvent(new Event('change', { bubbles: true })); await choose('#notify'); await submit('#settings'); const saved = JSON.parse(storage.getItem('settings') || 'null'); return saved && saved.fontSize === 24 && saved.notify === true && text('#saved') === 'Saved' && submissions().length === 0;", fail: "On submit, preventDefault, build { fontSize: Number(select.value), notify: checkbox.checked } and setItem(\"settings\", JSON.stringify(…))." },
            { label: "Saving applies the new text size", check: "return style('body', 'font-size') === '24px';", fail: "Set document.body.style.fontSize = settings.fontSize + \"px\"." },
            { label: "Reset removes the saved settings and restores the defaults", check: "await click('#reset'); return storage.getItem('settings') === null && style('body', 'font-size') === '16px' && $('#font-size').value === '16' && !$('#notify').checked;", fail: "removeItem(\"settings\"), then apply DEFAULTS to the page and the form." },
            { label: "A fresh load with saved settings restores them", seed: { settings: "{\"fontSize\":20,\"notify\":true}" }, check: "return style('body', 'font-size') === '20px' && $('#font-size').value === '20' && $('#notify').checked === true;", fail: "On load, JSON.parse the saved settings and apply them." },
            { label: "Settings saved before a new option existed still get its default", seed: { settings: "{\"fontSize\":24}" }, check: "return style('body', 'font-size') === '24px' && $('#notify').checked === false;", fail: "Merge: { ...DEFAULTS, ...saved }." },
          ],
          solution: { "app.js": "const DEFAULTS = { fontSize: 16, notify: false };\n\nconst form = document.querySelector(\"#settings\");\nconst size = document.querySelector(\"#font-size\");\nconst notify = document.querySelector(\"#notify\");\n\nfunction load() {\n  const saved = JSON.parse(localStorage.getItem(\"settings\") || \"null\");\n  return { ...DEFAULTS, ...saved };\n}\n\nfunction apply(settings) {\n  document.body.style.fontSize = `${settings.fontSize}px`;\n  size.value = String(settings.fontSize);\n  notify.checked = settings.notify;\n}\n\napply(load());\n\nform.addEventListener(\"submit\", (event) => {\n  event.preventDefault();\n  const settings = { fontSize: Number(size.value), notify: notify.checked };\n  localStorage.setItem(\"settings\", JSON.stringify(settings));\n  apply(settings);\n  document.querySelector(\"#saved\").textContent = \"Saved\";\n});\n\ndocument.querySelector(\"#reset\").addEventListener(\"click\", () => {\n  localStorage.removeItem(\"settings\");\n  apply(DEFAULTS);\n});\n" },
          hint: "Write load() and apply(settings) first. Then submit is \"build, save, apply\" and reset is \"remove, apply defaults\".",
          successMessage: "Preferences that survive a reload, merge safely with new defaults and can be reset in one click.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 104 · 23.8 – 23.10
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "wd-l104-saving-data-limits",
    moduleId: "wd-m23-storage",
    sectionId: SECTION_ID,
    order: 3,
    covers: ["23.8", "23.9", "23.10"],
    title: "Saving Tasks and Expenses, Limits and Secrets",
    subtitle: "Persisting a whole list, coping when storage fails, and what never to store",
    estimatedMinutes: 26,
    intro: "A to-do list or expense tracker that forgets everything on refresh is useless. This lesson persists a whole list safely, and sets out the limits and risks of browser storage that professionals design around.",

    atoms: [
      {
        id: "a-wd-saving-lists",
        title: "Saving tasks and expenses",
        explain:
          "Keep the list in an array in memory (the state), render the page from it, and save the WHOLE array to storage as JSON every time it changes. On load, parse the saved array, or start with [] if there is none. That gives one source of truth: the array. The page is a picture of it; storage is a copy of it.",
        example: "let tasks = load();\n\nfunction save() {\n  localStorage.setItem(\"tasks\", JSON.stringify(tasks));\n}\n\nfunction addTask(title) {\n  tasks = [...tasks, { id: Date.now(), title, done: false }];\n  save();\n  render();\n}",
      },
      {
        id: "a-wd-storage-limits",
        title: "Storage limitations",
        explain:
          "Web Storage is limited to about 5MB per site, holds only strings, and is synchronous: large reads and writes pause the page. Visitors can clear it, private browsing may discard it, and it can contain anything, including data that is corrupted or from an older version of your app. So always wrap JSON.parse in try...catch, check the shape of what you read, and fall back to a safe default. For large or structured data, IndexedDB is the browser's bigger database.",
        example: "function load() {\n  try {\n    const data = JSON.parse(localStorage.getItem(\"tasks\"));\n    return Array.isArray(data) ? data : [];\n  } catch {\n    return [];      // corrupted: start fresh instead of crashing\n  }\n}",
        webLab: {
          task:
            "Persist the task list. Keep tasks in an array of { id, title, done }. On load, read \"tasks\" from localStorage, but if it is missing, not valid JSON or not an array, start with [] (and, if it was corrupted, show \"Saved tasks could not be read\" in #warning). Render each task as an li with its title; clicking an li toggles its done class and saves. The form adds a task, saves and re-renders.",
          files: { "index.html": TASKS_HTML, "style.css": CSS, "app.js": "// Load, render, add, toggle and save the tasks\n" },
          readOnly: ["index.html", "style.css"],
          tests: [
            { label: "Adding a task shows it and saves the array as JSON", check: "await type('#task', 'Buy rice'); await submit('#task-form'); const saved = JSON.parse(storage.getItem('tasks') || 'null'); return $$('#tasks li').length === 1 && text('#tasks li') === 'Buy rice' && Array.isArray(saved) && saved[0].title === 'Buy rice' && saved[0].done === false;", fail: "Add { id, title, done: false } to the array, setItem(\"tasks\", JSON.stringify(tasks)), then render." },
            { label: "Clicking a task toggles done, on the page and in storage", check: "await click('#tasks li'); const saved = JSON.parse(storage.getItem('tasks')); return $('#tasks li').classList.contains('done') && saved[0].done === true;", fail: "Use a delegated click on #tasks: find the task by data-id, flip done, save and render." },
            { label: "A fresh load restores the saved tasks", seed: { tasks: "[{\"id\":1,\"title\":\"Call Mum\",\"done\":true},{\"id\":2,\"title\":\"Read\",\"done\":false}]" }, check: "const li = $$('#tasks li'); return li.length === 2 && text(li[0]) === 'Call Mum' && li[0].classList.contains('done') && !li[1].classList.contains('done');", fail: "On load, JSON.parse the saved tasks and render them." },
            { label: "Corrupted storage does not crash the page", seed: { tasks: "this is not json" }, check: "return errors().length === 0 && $$('#tasks li').length === 0 && text('#warning') === 'Saved tasks could not be read';", fail: "Wrap JSON.parse in try...catch; on failure start with [] and show the warning." },
            { label: "A saved value that is not an array is ignored", seed: { tasks: "{\"title\":\"oops\"}" }, check: "await type('#task', 'New'); await submit('#task-form'); return errors().length === 0 && $$('#tasks li').length === 1;", fail: "After parsing, check Array.isArray(data); otherwise start with []." },
          ],
          solution: { "app.js": "const list = document.querySelector(\"#tasks\");\nconst form = document.querySelector(\"#task-form\");\nconst input = document.querySelector(\"#task\");\nconst warning = document.querySelector(\"#warning\");\n\nfunction load() {\n  const raw = localStorage.getItem(\"tasks\");\n  if (raw === null) return [];\n  try {\n    const data = JSON.parse(raw);\n    return Array.isArray(data) ? data : [];\n  } catch {\n    warning.textContent = \"Saved tasks could not be read\";\n    return [];\n  }\n}\n\nlet tasks = load();\n\nfunction save() {\n  localStorage.setItem(\"tasks\", JSON.stringify(tasks));\n}\n\nfunction render() {\n  list.replaceChildren();\n  for (const task of tasks) {\n    const li = document.createElement(\"li\");\n    li.textContent = task.title;\n    li.dataset.id = task.id;\n    li.classList.toggle(\"done\", task.done);\n    list.append(li);\n  }\n}\n\nform.addEventListener(\"submit\", (event) => {\n  event.preventDefault();\n  const title = input.value.trim();\n  if (!title) return;\n  tasks = [...tasks, { id: Date.now() + Math.random(), title, done: false }];\n  save();\n  render();\n  form.reset();\n});\n\nlist.addEventListener(\"click\", (event) => {\n  const li = event.target.closest(\"li\");\n  if (!li) return;\n  tasks = tasks.map((t) => (String(t.id) === li.dataset.id ? { ...t, done: !t.done } : t));\n  save();\n  render();\n});\n\nrender();\n" },
          hint: "dataset.id is always a string, so compare String(task.id) === li.dataset.id.",
          successMessage: "A list that survives refreshes, copes with corrupted storage and keeps one source of truth. This is the core of the Phase 4 to-do project.",
        },
      },
      {
        id: "a-wd-no-secrets",
        title: "Why sensitive secrets should not be stored in browser storage",
        explain:
          "Any JavaScript running on the page can read localStorage: your own code, every third-party script you include (analytics, chat widgets, ads) and any attacker who manages a cross-site scripting injection. Nothing in it is encrypted, and it stays on shared computers. Never store passwords, card numbers, API secret keys or long-lived login tokens there. Sessions belong in secure, HttpOnly cookies that JavaScript cannot read, set by the server.",
        decision: {
          scenario: "To keep users logged in, a developer suggests saving the user's password in localStorage and re-sending it on every visit.",
          question: "What is the right response?",
          options: [
            { id: "a", text: "No: any script on the page could read it. The server should create a session in a secure, HttpOnly cookie instead", why: "Passwords must never be stored in the browser. A session cookie marked HttpOnly is unreadable by JavaScript, so a script injection cannot steal it." },
            { id: "b", text: "Yes, if it is saved under an unusual key name", whyWrong: "Any script can list every key. Obscurity is not protection." },
            { id: "c", text: "Yes, if it is saved in sessionStorage instead", whyWrong: "sessionStorage is just as readable by scripts on the page." },
            { id: "d", text: "Yes, if the password is base64-encoded first", whyWrong: "Base64 is an encoding, not encryption; anyone can decode it." },
          ],
          correct: "a",
          aftermath: "Browser storage is for preferences and data the user would not mind a stranger reading on a shared computer.",
        },
      },
    ],

    task: {
      title: "Module project: a notes page that remembers",
      intro: "Build notes.html on your own computer.",
      prompts: [
        "Notes are { id, text, created } objects in an array, saved as JSON under one key and rendered with textContent.",
        "Add, edit (with a prompt or an inline form) and delete notes, saving after every change.",
        "A theme toggle and a text-size setting saved as one preferences object, merged over defaults.",
        "Load safely: missing, corrupted or wrongly-shaped data falls back to defaults without an error.",
        "Open DevTools → Application → Local Storage and watch your data change; then clear it and confirm the page starts cleanly.",
      ],
      closing: "Next module: data from servers, through APIs.",
    },
    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
