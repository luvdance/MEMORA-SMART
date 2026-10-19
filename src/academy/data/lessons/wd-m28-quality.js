/**
 * RESPONSIVE WEB DEVELOPMENT · MODULE 28 · FRONTEND QUALITY AND TESTING
 *
 * Curriculum 28.1 – 28.12. Readable code, refactoring, ESLint, unit tests,
 * testing UI components, forms and API error handling, accessibility audits,
 * browser compatibility, performance profiling, responsive regression
 * testing and debugging production issues.
 *
 * The testing labs use a small test kit with the same shape as Vitest
 * (test, expect(…).toBe and friends), so the habits transfer directly. The
 * checks then do what real teams do to judge tests: they run the learner's
 * tests against the correct code (all must pass) and against deliberately
 * broken versions (some must fail). A test that cannot catch a bug is not
 * doing its job.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

export const SECTION_ID = "wd-s28-quality";

const CSS = "body { font-family: Arial, sans-serif; padding: 16px; }\n.pass { color: #15803d; }\n.fail { color: #b91c1c; }\n";

/** A Vitest-shaped kit: test(), expect(), and runTests() for the checks. */
const KIT = `// A tiny test kit with the same shape as Vitest.
const __tests = [];

function test(name, fn) {
  __tests.push({ name, fn });
}

function expect(actual) {
  const show = (v) => JSON.stringify(v);
  return {
    toBe(expected) {
      if (!Object.is(actual, expected)) throw new Error(\`Expected \${show(expected)} but got \${show(actual)}\`);
    },
    toEqual(expected) {
      if (show(actual) !== show(expected)) throw new Error(\`Expected \${show(expected)} but got \${show(actual)}\`);
    },
    toContain(part) {
      if (!String(actual).includes(part)) throw new Error(\`Expected \${show(actual)} to contain \${show(part)}\`);
    },
  };
}

async function runTests() {
  const results = [];
  for (const t of __tests) {
    try {
      await t.fn();
      results.push({ name: t.name, passed: true });
    } catch (err) {
      results.push({ name: t.name, passed: false, error: err.message });
    }
  }
  return results;
}

// Show the results on the page and in the console.
window.addEventListener("load", async () => {
  const report = document.querySelector("#report");
  for (const r of await runTests()) {
    console.log(\`\${r.passed ? "✓" : "✗"} \${r.name}\${r.error ? " — " + r.error : ""}\`);
    const li = document.createElement("li");
    li.className = r.passed ? "pass" : "fail";
    li.textContent = \`\${r.passed ? "✓" : "✗"} \${r.name}\`;
    report.append(li);
  }
});
`;

const testPage = (title) => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title}</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <h1>${title}</h1>
  <ul id="report"></ul>
  <script src="test-kit.js"></script>
  <script src="src.js"></script>
  <script src="tests.js"></script>
</body>
</html>
`;

const UNIT_SRC = `// The code under test.
function formatNaira(amount) {
  const whole = Math.round(amount);
  return "₦" + String(whole).replace(/\\B(?=(\\d{3})+(?!\\d))/g, ",");
}

function renderCart(container, items) {
  container.replaceChildren();
  for (const item of items) {
    const li = document.createElement("li");
    li.textContent = \`\${item.name} × \${item.qty}\`;
    container.append(li);
  }
}
`;

const FORM_SRC = `// The code under test.
function validateEmail(text) {
  return /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(String(text).trim());
}

// fetchFn is passed in, so a test can give it a fake fetch.
async function loadUser(id, fetchFn) {
  try {
    const res = await fetchFn(\`/api/users/\${id}\`);
    if (!res.ok) return { error: res.status === 404 ? "not-found" : "server" };
    return { user: await res.json() };
  } catch {
    return { error: "network" };
  }
}
`;

/** Run the learner's tests with one global swapped for a broken version. */
const mutant = (name, impl) =>
  `const orig = window.${name}; window.${name} = ${impl}; const r = await runTests(); window.${name} = orig; return r.length > 0 && r.some((x) => !x.passed);`;

const AUDIT_HTML = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Pay your school fees</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <main>
    <h1>Pay your school fees</h1>
    <img src="images/hero.jpg" alt="Students outside the school gate">
    <form>
      <input id="ref" name="ref" placeholder="Student reference">
      <button type="submit">Pay now</button>
    </form>
    <p class="note">Payments are confirmed within 24 hours.</p>
    <table class="fees">
      <tr><th>Term</th><th>Tuition</th><th>Books</th><th>Uniform</th><th>Transport</th><th>Total</th></tr>
      <tr><td>First</td><td>₦85,000</td><td>₦15,000</td><td>₦12,000</td><td>₦30,000</td><td>₦142,000</td></tr>
    </table>
  </main>
</body>
</html>
`;

const AUDIT_CSS = `body { margin: 0; font-family: Arial, sans-serif; padding: 16px; }
.note { color: #b8b8b8; }
.fees td, .fees th { padding: 8px 16px; white-space: nowrap; }
button:focus { outline: none; }
`;

const AUDIT_HTML_DONE = AUDIT_HTML.replace("<html>", '<html lang="en">')
  .replace('<img src="images/hero.jpg" alt="Students outside the school gate">', '<img src="images/hero.jpg" alt="Students outside the school gate" width="1600" height="900">')
  .replace('      <input id="ref" name="ref" placeholder="Student reference">', '      <label for="ref">Student reference</label>\n      <input id="ref" name="ref">')
  .replace('    <table class="fees">', '    <div class="table-wrap">\n    <table class="fees">')
  .replace("    </table>\n", "    </table>\n    </div>\n");

const AUDIT_CSS_DONE = `body { margin: 0; font-family: Arial, sans-serif; padding: 16px; }
img { display: block; max-width: 100%; height: auto; }
.note { color: #4b5563; }
.table-wrap { overflow-x: auto; }
.fees td, .fees th { padding: 8px 16px; white-space: nowrap; }
button:focus-visible { outline: 3px solid #1d4ed8; outline-offset: 2px; }
`;

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 127 · 28.1 – 28.3
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "wd-l127-readable-refactor",
    moduleId: "wd-m28-quality",
    sectionId: SECTION_ID,
    order: 1,
    covers: ["28.1", "28.2", "28.3"],
    title: "Readable Code, Refactoring and ESLint",
    subtitle: "Code is read far more often than it is written",
    estimatedMinutes: 24,
    intro: "Working code is the starting line. Code that the next developer, or you in three months, can read, change and trust is the finish. This lesson covers the habits and the tool that get you there.",

    atoms: [
      {
        id: "a-wd-readable-code",
        title: "Writing readable code",
        explain:
          "Readable code says what it does: names that describe (totalWithVat, not tv; isLoggedIn, not flag), small functions that do one thing, consistent formatting (let Prettier do it), early returns instead of deep nesting, and named constants instead of magic numbers (const VAT_RATE = 7.5 rather than a bare 7.5 in a formula). Comments explain WHY something is done, not WHAT the code already says.",
        table: {
          caption: "Less readable and more readable.",
          headers: ["Less readable", "More readable"],
          rows: [
            ["const d = p * 0.075;", "const vat = price * VAT_RATE / 100;"],
            ["function proc(a) { … }", "function applyDiscount(order) { … }"],
            ["if (u) { if (u.ok) { if (u.age > 17) { … } } }", "if (!user?.ok) return; if (user.age < 18) return; …"],
            ["// add 1 to i", "// Pages are numbered from 1 for readers"],
          ],
        },
      },
      {
        id: "a-wd-refactoring",
        title: "Refactoring duplicated code",
        explain:
          "Refactoring is changing the structure of code without changing what it does. The most common target is duplication: the same few lines copied in several places, which then have to be fixed in several places. Extract them into a function with a good name and parameters for whatever differed. Refactor in small steps, checking after each one that the behaviour is unchanged; tests (next lesson) make that check automatic.",
        webLab: {
          task:
            "The receipt is right, but the same price-with-VAT formatting is copied three times. Refactor: write one function, formatPrice(amount), that returns the amount with 7.5% VAT added, rounded, as \"₦N\", use a named constant VAT_RATE for 7.5, and use the function for all three lines. The output must not change.",
          files: {
            "app.js": "const rice = 9500;\nconst oil = 2800;\nconst beans = 4200;\n\nconsole.log(\"Rice: ₦\" + Math.round(rice + (rice * 7.5) / 100));\nconsole.log(\"Oil: ₦\" + Math.round(oil + (oil * 7.5) / 100));\nconsole.log(\"Beans: ₦\" + Math.round(beans + (beans * 7.5) / 100));\n",
          },
          tests: [
            { label: "The output is unchanged", check: "return output() === 'Rice: ₦10213\\nOil: ₦3010\\nBeans: ₦4515';", fail: "Refactoring must not change behaviour: the three lines must print exactly as before." },
            { label: "formatPrice(amount) does the formatting", check: "return typeof formatPrice === 'function' && formatPrice(1000) === '₦1075' && formatPrice(9500) === '₦10213';", fail: "Write formatPrice(amount) returning \"₦\" + Math.round(amount + amount * VAT_RATE / 100)." },
            { label: "7.5 appears once, as the constant VAT_RATE", check: "const c = code('app.js'); return (c.match(/7\\.5/g) || []).length === 1 && /const\\s+VAT_RATE\\s*=\\s*7\\.5/.test(c);", fail: "Define const VAT_RATE = 7.5; once and use the name everywhere else." },
            { label: "The formula is written once", check: "return (code('app.js').match(/Math\\.round/g) || []).length === 1;", fail: "Math.round should appear only inside formatPrice." },
          ],
          solution: { "app.js": "const VAT_RATE = 7.5;\n\nfunction formatPrice(amount) {\n  return \"₦\" + Math.round(amount + (amount * VAT_RATE) / 100);\n}\n\nconst rice = 9500;\nconst oil = 2800;\nconst beans = 4200;\n\nconsole.log(\"Rice: \" + formatPrice(rice));\nconsole.log(\"Oil: \" + formatPrice(oil));\nconsole.log(\"Beans: \" + formatPrice(beans));\n" },
          hint: "Change one line at a time and watch the console: the three lines should never change.",
          successMessage: "Same output, one formula, one named rate. When VAT changes, there is now exactly one place to edit.",
        },
      },
      {
        id: "a-wd-eslint",
        title: "ESLint and code-quality checks",
        explain:
          "ESLint reads your code without running it and reports likely bugs and bad patterns: variables declared but never used, == instead of ===, variables used before they are defined, unreachable code. Install it with npm init @eslint/config@latest, run it with npx eslint . (or an npm run lint script), and add the VS Code extension to see problems as you type. Prettier is the partner tool for formatting: let it decide spacing so code reviews can be about what matters.",
        decision: {
          scenario: "ESLint reports: 'total' is assigned a value but never used (no-unused-vars), in code that otherwise works.",
          question: "What should you do?",
          options: [
            { id: "a", text: "Look at why it is unused: either it is left over and should be deleted, or it was meant to be used and there is a bug", why: "Lint warnings are often the first sign of a real bug, such as calculating a total and then displaying the wrong variable." },
            { id: "b", text: "Turn the rule off for the whole project", whyWrong: "That hides this warning and every future real bug it would have caught." },
            { id: "c", text: "Ignore it: the code works", whyWrong: "Unused code confuses readers, and this may be a bug in disguise." },
            { id: "d", text: "Rename the variable", whyWrong: "It would still be unused." },
          ],
          correct: "a",
          aftermath: "Treat a clean lint run as part of \"done\", like passing tests.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 128 · 28.4 – 28.5
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "wd-l128-unit-component-tests",
    moduleId: "wd-m28-quality",
    sectionId: SECTION_ID,
    order: 2,
    covers: ["28.4", "28.5"],
    title: "Unit Tests and Testing Components",
    subtitle: "Code that checks your code, every time it changes",
    estimatedMinutes: 28,
    intro: "In Module 19 you wrote test cases and checked them by hand. Automated tests do it for you, in seconds, every time you change anything, so you can refactor and add features without fear of quietly breaking something.",

    atoms: [
      {
        id: "a-wd-unit-tests",
        title: "Unit testing fundamentals",
        explain:
          "A unit test checks one small piece, usually one function, in isolation: given this input, expect that output. Each test has three parts: arrange the input, act by calling the function, assert the result with expect(actual).toBe(expected) (toEqual compares arrays and objects by content). Test the typical case, the boundaries and the edge cases from Module 19. In a Vite project, install Vitest (npm install -D vitest), name files *.test.js and run npm test.",
        example: "import { test, expect } from \"vitest\";\nimport { formatNaira } from \"./format.js\";\n\ntest(\"adds thousands separators\", () => {\n  expect(formatNaira(1500)).toBe(\"₦1,500\");\n});\n\ntest(\"rounds to the nearest naira\", () => {\n  expect(formatNaira(99.6)).toBe(\"₦100\");\n});",
      },
      {
        id: "a-wd-component-tests",
        title: "Testing components",
        explain:
          "A component is a piece of interface, such as a function that renders a cart into an element. To test it, create an element that is not on the page (document.createElement(\"ul\")), call the render function with test data, and assert on the DOM it produced: how many items, what text, which classes. Test what a user would see, not internal details, so tests survive refactoring. Frameworks have helpers for this, but the idea is identical.",
        webLab: {
          task:
            "src.js holds formatNaira(amount) and renderCart(container, items). Write tests in tests.js with test() and expect() (from test-kit.js) good enough to catch bugs: test that formatNaira adds thousands separators, rounds, and handles 0; and test that renderCart renders one li per item with text such as \"Rice × 2\" (create a ul with document.createElement to render into). The checks run your tests against the real code, then against broken versions.",
          files: {
            "index.html": testPage("Cart tests"),
            "style.css": CSS,
            "test-kit.js": KIT,
            "src.js": UNIT_SRC,
            "tests.js": "// Write your tests here, for example:\n// test(\"formats 1500\", () => {\n//   expect(formatNaira(1500)).toBe(\"₦1,500\");\n// });\n",
          },
          readOnly: ["index.html", "style.css", "test-kit.js", "src.js"],
          tests: [
            { label: "You wrote at least four tests, and all pass against the real code", check: "const r = await runTests(); return r.length >= 4 && r.every((x) => x.passed);", fail: "Write at least four tests; each must pass on the code in src.js." },
            { label: "Your tests catch formatNaira losing its thousands separators", check: mutant("formatNaira", "(a) => '₦' + Math.round(a)"), fail: "Add a test with an amount of at least 1,000, such as expect(formatNaira(1500)).toBe(\"₦1,500\")." },
            { label: "Your tests catch formatNaira not rounding", check: mutant("formatNaira", "(a) => '₦' + String(a).replace(/\\B(?=(\\d{3})+(?!\\d))/g, ',')"), fail: "Add a test with a decimal amount, such as 99.6, which should become \"₦100\"." },
            { label: "Your tests catch renderCart dropping the quantity", check: mutant("renderCart", "(c, items) => { c.replaceChildren(); for (const i of items) { const li = document.createElement('li'); li.textContent = i.name; c.append(li); } }"), fail: "Test the li's text, such as \"Rice × 2\", not only the number of items." },
            { label: "Your tests catch renderCart rendering only the first item", check: mutant("renderCart", "(c, items) => { c.replaceChildren(); const i = items[0]; if (!i) return; const li = document.createElement('li'); li.textContent = `${i.name} × ${i.qty}`; c.append(li); }"), fail: "Test a cart of two or more items and check how many li elements there are." },
          ],
          solution: {
            "tests.js": "test(\"adds thousands separators\", () => {\n  expect(formatNaira(1500)).toBe(\"₦1,500\");\n  expect(formatNaira(1250000)).toBe(\"₦1,250,000\");\n});\n\ntest(\"rounds to the nearest naira\", () => {\n  expect(formatNaira(99.6)).toBe(\"₦100\");\n});\n\ntest(\"formats zero\", () => {\n  expect(formatNaira(0)).toBe(\"₦0\");\n});\n\ntest(\"renders one item per product, with quantities\", () => {\n  const ul = document.createElement(\"ul\");\n  renderCart(ul, [{ name: \"Rice\", qty: 2 }, { name: \"Oil\", qty: 1 }]);\n  const items = ul.querySelectorAll(\"li\");\n  expect(items.length).toBe(2);\n  expect(items[0].textContent).toBe(\"Rice × 2\");\n  expect(items[1].textContent).toBe(\"Oil × 1\");\n});\n",
          },
          hint: "A good test fails when the code is wrong. For each requirement, ask: what input would expose a bug in exactly this?",
          successMessage: "Your tests caught four different broken versions of the code. That is the difference between tests that exist and tests that protect you.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 129 · 28.6 – 28.7
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "wd-l129-form-api-tests",
    moduleId: "wd-m28-quality",
    sectionId: SECTION_ID,
    order: 3,
    covers: ["28.6", "28.7"],
    title: "Testing Form Behaviour and API Error Handling",
    subtitle: "The two places real applications break most",
    estimatedMinutes: 26,
    intro: "Forms and network calls are where users and the outside world meet your code, and where most production bugs live. Both can be tested without a real user or a real server.",

    atoms: [
      {
        id: "a-wd-test-forms",
        title: "Testing form behavior",
        explain:
          "Test form logic at two levels. Unit-test the pure rules (validateEmail(\"ada@\") is false) with many inputs, including the edge cases a user will eventually type. Then test the behaviour: fill a form element in a test, dispatch submit, and assert on what appears (the error message, aria-invalid, that nothing was sent). Keeping the rules in pure functions, as in Module 22, is what makes the first level easy.",
      },
      {
        id: "a-wd-test-api-errors",
        title: "Testing API error handling",
        explain:
          "Tests must never depend on a real API: it may be slow, down or rate-limited, and you cannot make it fail on demand. Instead, pass the fetch function in as a parameter (dependency injection) and give it a fake in each test: one that resolves with { ok: true, json: () => data }, one with { ok: false, status: 404 }, one that rejects to simulate no connection. Then assert your code handles each: the error paths are precisely the ones you never see while developing.",
        example: "const fake404 = async () => ({ ok: false, status: 404 });\n\ntest(\"reports a missing user\", async () => {\n  const result = await loadUser(7, fake404);\n  expect(result).toEqual({ error: \"not-found\" });\n});",
        webLab: {
          task:
            "src.js holds validateEmail(text) and loadUser(id, fetchFn). Write tests that would catch bugs in both. For validateEmail: valid addresses pass; ones missing the @, the domain or the dot fail. For loadUser, use fake fetch functions (no real network): a success returns { user }, a 404 returns { error: \"not-found\" }, a 500 returns { error: \"server\" }, and a rejected fetch returns { error: \"network\" }. Mark async tests with async and await loadUser.",
          files: {
            "index.html": testPage("Form and API tests"),
            "style.css": CSS,
            "test-kit.js": KIT,
            "src.js": FORM_SRC,
            "tests.js": "// Write your tests here.\n// A fake fetch for a 404:\n// const fake404 = async () => ({ ok: false, status: 404 });\n",
          },
          readOnly: ["index.html", "style.css", "test-kit.js", "src.js"],
          tests: [
            { label: "At least five tests, all passing against the real code", check: "const r = await runTests(); return r.length >= 5 && r.every((x) => x.passed);", fail: "Write at least five tests that pass on the code in src.js." },
            { label: "Your tests catch validateEmail accepting an address with no domain dot", check: mutant("validateEmail", "(t) => /^[^\\s@]+@[^\\s@]+$/.test(String(t).trim())"), fail: "Test that an address such as \"ada@example\" is rejected." },
            { label: "Your tests catch validateEmail rejecting good addresses", check: mutant("validateEmail", "() => false"), fail: "Test that a valid address such as \"ada@example.com\" is accepted." },
            { label: "Your tests catch loadUser ignoring an unsuccessful status", check: mutant("loadUser", "async (id, f) => { try { const r = await f(`/api/users/${id}`); return { user: await r.json() }; } catch { return { error: 'network' }; } }"), fail: "Test a fake fetch that returns { ok: false, status: 404 } and expect { error: \"not-found\" }." },
            { label: "Your tests catch loadUser treating every failure as not-found", check: mutant("loadUser", "async (id, f) => { try { const r = await f(`/api/users/${id}`); if (!r.ok) return { error: 'not-found' }; return { user: await r.json() }; } catch { return { error: 'not-found' }; } }"), fail: "Also test a 500 response and a fetch that rejects." },
            { label: "Your tests never use the real network", check: "return !/\\bfetch\\s*\\(/.test(code('tests.js'));", fail: "Pass fake fetch functions to loadUser; do not call fetch() in tests." },
          ],
          solution: {
            "tests.js": "test(\"accepts a valid email\", () => {\n  expect(validateEmail(\"ada@example.com\")).toBe(true);\n});\n\ntest(\"rejects emails missing parts\", () => {\n  expect(validateEmail(\"ada.example.com\")).toBe(false);\n  expect(validateEmail(\"ada@\")).toBe(false);\n  expect(validateEmail(\"ada@example\")).toBe(false);\n});\n\ntest(\"returns the user on success\", async () => {\n  const fakeOk = async () => ({ ok: true, json: async () => ({ id: 7, name: \"Ada\" }) });\n  expect(await loadUser(7, fakeOk)).toEqual({ user: { id: 7, name: \"Ada\" } });\n});\n\ntest(\"reports not-found for a 404\", async () => {\n  const fake404 = async () => ({ ok: false, status: 404 });\n  expect(await loadUser(7, fake404)).toEqual({ error: \"not-found\" });\n});\n\ntest(\"reports a server error for a 500\", async () => {\n  const fake500 = async () => ({ ok: false, status: 500 });\n  expect(await loadUser(7, fake500)).toEqual({ error: \"server\" });\n});\n\ntest(\"reports a network failure\", async () => {\n  const offline = async () => {\n    throw new TypeError(\"Failed to fetch\");\n  };\n  expect(await loadUser(7, offline)).toEqual({ error: \"network\" });\n});\n",
          },
          hint: "A fake fetch is just an async function that returns an object shaped like a Response ({ ok, status, json }) or throws.",
          successMessage: "Every error path tested without touching a network. Those are the paths you never see in development and your users see in production.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 130 · 28.8 – 28.12
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "wd-l130-audits-production",
    moduleId: "wd-m28-quality",
    sectionId: SECTION_ID,
    order: 4,
    covers: ["28.8", "28.9", "28.10", "28.11", "28.12"],
    title: "Audits, Compatibility, Performance, Regressions and Production Bugs",
    subtitle: "Checking what tests do not, and fixing what only happens live",
    estimatedMinutes: 30,
    intro: "Unit tests check logic. A professional release also checks accessibility, browsers, speed and layout at every width, and has a plan for the bugs that only appear once real people use the site.",

    atoms: [
      {
        id: "a-wd-a11y-audits",
        title: "Accessibility audits",
        explain:
          "Automated tools find many accessibility problems quickly: DevTools → Lighthouse → Accessibility, or the free axe DevTools extension. They catch missing labels and alt text, low contrast, missing lang, and buttons without names. They cannot judge everything, perhaps a third of issues, so follow the automated audit with a manual one: use the page with the keyboard alone, with a screen reader, and zoomed to 200%.",
      },
      {
        id: "a-wd-browser-compat",
        title: "Browser compatibility",
        explain:
          "Check features on caniuse.com before relying on them, and decide which browsers you support (often: the last two versions of each major browser, plus Safari on iOS). Use progressive enhancement and @supports (Module 12) for newer CSS, and feature detection in JavaScript (if (\"share\" in navigator)) rather than guessing from the browser's name. Test on real Safari: every iPhone browser uses Safari's engine, and it is the most common source of surprises.",
      },
      {
        id: "a-wd-perf-profiling",
        title: "Performance profiling",
        explain:
          "Measure before optimising. DevTools → Performance records what the browser did while you used the page: long JavaScript tasks (over 50ms) block clicks, and layout and paint work show up as purple and green bars. Lighthouse's Performance score summarises load speed. Throttle the CPU and network to \"Slow 4G\" to experience the page as many visitors do. Module 30 covers the fixes.",
      },
      {
        id: "a-wd-responsive-regression",
        title: "Responsive regression testing",
        explain:
          "A regression is something that used to work and broke. CSS is especially prone: a change for laptops can break phones. Before each release, check every page at your key widths (320, 375, 768, 1024, 1440) for sideways scrolling, overlapping and cut-off content; teams automate this with screenshot comparisons (Playwright, Percy). The labs in this course are themselves regression tests: they check layouts at fixed widths every time.",
        webLab: {
          task:
            "An audit of this fees page found five problems. Fix them all: the page has no lang; the reference input has only a placeholder, no label; the note's text fails contrast (it needs 4.5:1 on white); the button's focus outline is removed with nothing in its place; and at phone width the page scrolls sideways (the photo has no responsive sizing or dimensions, and the fees table is too wide: wrap it so it scrolls on its own).",
          files: { "index.html": AUDIT_HTML, "style.css": AUDIT_CSS },
          tests: [
            { label: "The page declares its language", check: "return document.documentElement.lang === 'en';", fail: "Add lang=\"en\" to the html element." },
            { label: "The reference input has a real label", check: "const i = $('#ref'); return i.labels.length === 1 && text(i.labels[0]).length > 3;", fail: "Add <label for=\"ref\">Student reference</label>." },
            { label: "The note passes 4.5:1 contrast", check: "return contrast(style('.note', 'color'), 'rgb(255, 255, 255)') >= 4.5;", fail: "Use a darker grey for .note, such as #4b5563." },
            { label: "The button has a visible :focus-visible outline", check: "return !rules().some((r) => /button:focus\\b(?!-)/.test(r.selector) && /none/.test(r.style.outline)) && rules(/button:focus-visible/).some((r) => px(r.style.outlineWidth || (r.style.outline.match(/([0-9.]+)px/) || [])[1]) >= 2);", fail: "Delete button:focus { outline: none; } and add a button:focus-visible outline of at least 2px." },
            { label: "No sideways scrolling at phone width", viewport: "mobile", check: "return !overflowX();", fail: "Make images responsive and wrap the table in a scrolling container." },
            { label: "The photo has width and height, so it cannot shift the layout", check: "const img = $('img'); return img.hasAttribute('width') && img.hasAttribute('height');", fail: "Add width=\"1600\" height=\"900\" to the img." },
            { label: "The fees table scrolls inside its own box on a phone", viewport: "mobile", check: "const w = $('.fees').parentElement; return w !== document.querySelector('main') && ['auto', 'scroll'].includes(style(w, 'overflow-x')) && w.scrollWidth > w.clientWidth;", fail: "Wrap the table in <div class=\"table-wrap\"> with overflow-x: auto." },
          ],
          solution: { "index.html": AUDIT_HTML_DONE, "style.css": AUDIT_CSS_DONE },
          hint: "Two files to change. Each finding is one small fix; check after each.",
          successMessage: "Five audit findings fixed, each verified by measurement. Run Lighthouse on your own projects and work through its list the same way.",
        },
      },
      {
        id: "a-wd-production-debugging",
        title: "Debugging production issues",
        explain:
          "A bug that only appears live needs evidence: the browser and device, the steps, the console errors, and the time it happened. Ask for a screenshot of the console, reproduce it in DevTools with the same device emulation and throttling, and use source maps (Vite can build them) so stack traces point at your real source lines. Error-monitoring services (such as Sentry) capture errors from real visitors automatically. Then write a test that reproduces the bug before fixing it, so it can never return.",
        decision: {
          scenario: "A customer reports that the checkout button does nothing on their phone. It works on every device you own.",
          question: "What is the best first step?",
          options: [
            { id: "a", text: "Gather evidence: their phone, browser and version, and a screenshot of any error, then reproduce it with the same conditions", why: "Production bugs are found from evidence, not guesses. Device, browser and the exact error usually point straight at the cause, often an unsupported feature or a script that failed to load." },
            { id: "b", text: "Tell them to use a laptop", whyWrong: "Most visitors are on phones; this loses customers." },
            { id: "c", text: "Rewrite the checkout", whyWrong: "Without knowing the cause, a rewrite may keep the bug and add new ones." },
            { id: "d", text: "Assume it is their internet and ignore it", whyWrong: "Guessing without evidence leaves a real bug in place." },
          ],
          correct: "a",
          aftermath: "After fixing it, add a test that reproduces it so it cannot come back.",
        },
      },
    ],

    task: {
      title: "Module project: lint and test your to-do app",
      intro: "Bring the to-do app from Module 27 up to a professional standard.",
      prompts: [
        "Add ESLint and Prettier with npm scripts, and fix every warning.",
        "Install Vitest and write unit tests for every pure function in logic.js, including edge cases.",
        "Write a component test for your render function, using a detached element.",
        "Refactor storage.js so fetch or localStorage is passed in, and test its failure paths with fakes.",
        "Run a Lighthouse audit, fix every accessibility finding, and record the scores before and after in the README.",
      ],
      closing: "Phase 5's projects combine Git, Vite and tests on complete applications.",
    },
    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
