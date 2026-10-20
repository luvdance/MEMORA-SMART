/**
 * CODEBASE ENGINEERING · MODULE 8 · ARCHITECTURE, REFACTORING AND TECHNICAL DEBT
 *
 * Curriculum 8.1 – 8.11 and the practical, 8.P. Layers and separation of
 * concerns; coupling and duplicated business logic; oversized files, nesting
 * and naming; dead code and unused dependencies; debt versus harmless
 * complexity; behaviour-preserving refactoring; small reversible steps;
 * dependency upgrades; diagrams; evaluating AI-generated architecture;
 * READMEs, setup guides and architecture decision records.
 *
 * The refactors are real: Kobo Market's dead component and unused package
 * were removed, and its price formatting unified, with tests, lint and a
 * production build recorded before and after.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

import { term, JS } from "./ce-helpers.js";

export const SECTION_ID = "ce-s8-architecture";
const MODULE = "ce-m8-architecture";

const TOTALS = 'rg -n "reduce\\(\\(sum"';
const LARGEST = "git ls-files src server | xargs wc -l | sort -rn | head -n 6";
const AXIOS_USES = 'rg -n "axios"  --glob "!package*.json"';

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 46 · 8.1 – 8.2
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ce-l46-layers",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 1,
    covers: ["8.1", "8.2"],
    title: "Layers, Separation of Concerns, Coupling and Duplication",
    subtitle: "Why code is split the way it is, and the two problems that break that split",
    estimatedMinutes: 30,
    intro:
      "A codebase that works today can still be hard to change tomorrow. Architecture is the set of decisions about what goes where, so that one change stays in one place. AI-generated code tends to work, and to ignore those decisions.",

    atoms: [
      {
        id: "a-ce-layers",
        title: "Architectural layers and separation of concerns",
        explain:
          "Separation of concerns means each part of the code has one job. Most applications are organised in layers: presentation (what the user sees: React components), application or API (receiving requests, checking input, sending responses: routes), business or domain logic (the rules: prices, permissions: services), and data access (reading and writing storage: the db module). Each layer calls only the one below it. When a rule lives in exactly one layer, changing the rule means changing one file.",
        table: {
          caption: "Kobo Market's layers.",
          headers: ["Layer", "Job", "Kobo Market"],
          rows: [
            ["Presentation", "Show things, collect input", "src/pages, src/components"],
            ["API", "Requests in, responses out, input checks", "server/router.js, server/routes"],
            ["Business logic", "The rules", "server/services"],
            ["Data access", "Storage", "server/db"],
          ],
        },
        decision: {
          scenario: "Where should the rule \"an email must contain @\" be enforced?",
          question: "Choose the best answer.",
          options: [
            { id: "a", text: "On the server, where it cannot be bypassed; also in the browser, purely as a convenience for the user", why: "The browser check gives instant feedback; the server check is the one that counts, because anyone can call the API directly." },
            { id: "b", text: "Only in the browser", whyWrong: "A request sent with curl skips the browser entirely." },
            { id: "c", text: "Only in the CSS", whyWrong: "Styling cannot enforce anything." },
            { id: "d", text: "In the database file", whyWrong: "The data layer stores; it should receive input already checked." },
          ],
          correct: "a",
          aftermath: "Convenience in the presentation layer, enforcement below it.",
        },
      },
      {
        id: "a-ce-coupling",
        title: "Tight coupling",
        explain:
          "Two parts are coupled when changing one forces a change in the other. Some coupling is unavoidable (a route depends on its service), but tight coupling makes changes spread. The worst kind is hidden: two parts that must agree but have no visible link, like the cart page and the server's delivery rule. Nothing in Cart.jsx says \"keep me in step with orderService.js\", so when one changed, the other silently did not.",
        decision: {
          scenario: "Which of these is hidden coupling?",
          question: "Choose one.",
          options: [
            { id: "a", text: "Cart.jsx defines its own DELIVERY_FEE that must always equal the one in orderService.js", why: "They must agree, and nothing connects them: no import, no test. That is exactly how the totals diverged." },
            { id: "b", text: "routes/orders.js imports orderTotals from orderService.js", whyWrong: "That coupling is explicit and visible: change the function and you can find its importers." },
            { id: "c", text: "App.jsx imports Navbar.jsx", whyWrong: "Explicit and normal." },
            { id: "d", text: "tests import the functions they test", whyWrong: "Intended and visible." },
          ],
          correct: "a",
          aftermath: "Visible coupling can be followed; hidden coupling has to be found.",
        },
      },
      {
        id: "a-ce-duplicated-logic",
        title: "Finding duplicated business logic",
        explain:
          "Duplicated logic is often written slightly differently each time, so search for its shape rather than its exact text. Every order total starts as a sum over the items, so a search for reduce((sum finds every copy, including ones that have already drifted.",
        terminalExercise: term("m8-duplication", {
          goal: "Find every place the code adds up a cart or order total.",
          accept: [TOTALS],
          near: [{ command: 'rg -n "150000"', why: "That finds the fee. Search for the summing code itself: reduce((sum." }],
          hint: "Search for reduce((sum (escape the brackets).",
          success: "Three copies: the server, the cart page, and OldCheckout.jsx, which sums item.price without quantity: a third rule, and a wrong one. Duplication drifts.",
        }),
      },
      {
        id: "a-ce-duplicate-format",
        title: "Duplicated presentation logic",
        explain:
          "Duplication is not only about business rules. Formatting, validation and API-calling code is copied too, and every copy is a place where a fix has to be made twice. Kobo Market already has formatPrice; the question is who is not using it.",
        terminalExercise: term("m8-duplication", {
          goal: "Find every place in src that formats a number as money itself.",
          accept: ['rg -n "toLocaleString" src'],
          near: [{ command: TOTALS, why: "That finds totals. Formatting is done with toLocaleString: search for it." }],
          hint: "Search src for toLocaleString.",
          success: "Two: formatPrice (the shared helper) and ProductCard.jsx, which formats inline, under the TODO from Module 1. One duplicate, one obvious refactor.",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 47 · 8.3 – 8.4
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ce-l47-smells",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 2,
    covers: ["8.3", "8.4"],
    title: "Oversized Files, Deep Nesting, Unclear Names; Dead Code and Unused Dependencies",
    subtitle: "The warning signs of hard-to-maintain code, and removing what nothing uses",
    estimatedMinutes: 32,
    intro:
      "Some problems are visible from a distance: files that keep growing, logic nested five levels deep, names that say nothing. Others are invisible until you look: code and packages that nothing uses any more. Both make every future change harder.",

    atoms: [
      {
        id: "a-ce-oversized",
        title: "Oversized files",
        explain:
          "A file that does many jobs grows: a 900-line component that fetches data, validates forms, formats prices and draws three screens. Every change to it risks the other jobs, two developers editing it collide, and it is hard to test. Size alone is a signal, not a verdict: a long file of simple data is fine. Look for long files whose contents do several unrelated things, and split them by job.",
        terminalExercise: term("m8-size", {
          goal: "Rank the tracked source files in src and server by size, largest first.",
          accept: [LARGEST],
          near: [{ command: "rg -c useState src", why: "That counts state per component, another complexity signal. First rank the files by size." }],
          hint: "git ls-files src server, wc -l through xargs, sort -rn, head.",
          success: "The largest is 55 lines (styles.css); no code file passes 45. Kobo Market has no oversized files yet. In a real project, run this monthly: files that keep climbing are the ones to split before they reach 500.",
        }),
      },
      {
        id: "a-ce-nesting",
        title: "Deeply nested logic and unclear naming",
        explain:
          "Each level of if inside if makes code harder to follow: you have to hold every condition in your head to know when a line runs. Guard clauses (handle the special cases first and return early) flatten it. Names matter as much: data, handle, temp and doStuff2 tell the reader nothing; deliveryFor(order) tells them what to expect. Here is nested code an AI produced. Trace each call.",
        codeExercise: {
          language: JS,
          code:
            "function deliveryFor(order) {\n  if (order) {\n    if (order.lines.length > 0) {\n      if (order.subtotal >= 5000000) {\n        return 0;\n      } else {\n        return 150000;\n      }\n    } else {\n      return null;\n    }\n  }\n  return null;\n}\n\nconsole.log(deliveryFor({ lines: [1], subtotal: 5000000 }));\nconsole.log(deliveryFor({ lines: [1], subtotal: 4999900 }));\nconsole.log(deliveryFor({ lines: [], subtotal: 0 }));\nconsole.log(deliveryFor(undefined));\n",
          question: "What are the four results?",
          expectedOutput: "0\n150000\nnull\nnull",
          hint: "Follow the conditions from the outside in for each call.",
          successMessage: "Four lines of output needed four levels of reading. The same function with guard clauses: if (!order || !order.lines.length) return null; return order.subtotal >= 5000000 ? 0 : 150000; Same results, two lines, nothing to hold in your head.",
        },
      },
      {
        id: "a-ce-dead-code",
        title: "Finding dead code",
        explain:
          "Dead code is code nothing uses: an abandoned component, a function no one calls, a feature flag that is always off. It misleads readers (OldCheckout.jsx looks like a checkout), gets updated for nothing, and sometimes hides bugs that come back when someone revives it. To check whether a file is dead, search for imports of it, remembering the many ways an import can be written.",
        terminalExercise: term("m8-dead", {
          goal: "Is OldCheckout used anywhere? Find every file that mentions it.",
          accept: ["rg -l OldCheckout"],
          near: [{ command: "git log --oneline -- src/components/OldCheckout.jsx", why: "That tells you when it was added. First check whether anything uses it." }],
          hint: "rg -l and the name.",
          success: "Only its own file mentions it. Nothing imports it; it was added in the very first frontend commit and never used since. Dead.",
        }),
      },
      {
        id: "a-ce-unused-deps",
        title: "Unused dependencies",
        explain:
          "An unused dependency still costs install time, disk, attack surface (its vulnerabilities are yours) and confusion. Confirm it is unused by searching the source while excluding the manifest and lockfile, which always mention it. Tools such as depcheck or knip automate this, but read their results the same way: as leads to verify.",
        terminalExercise: term("m8-dead", {
          goal: "Search the whole project for axios, excluding package.json and package-lock.json.",
          accept: [AXIOS_USES],
          near: [{ command: "npm ls axios", why: "That shows it is installed. Search the code (excluding the manifests) for anything that uses it." }],
          hint: "rg for axios with --glob \"!package*.json\" to exclude the manifests.",
          success: "Nothing. Installed, never imported: safe to remove, with tests and a build to prove it.",
        }),
      },
      {
        id: "a-ce-safe-removal",
        title: "Removing dead code safely",
        explain:
          "Remove dead code in its own commit, with evidence: git rm the file (so the deletion is staged and visible), npm uninstall the package (which updates package.json and the lockfile together), then run the build and the tests. If something did use it after all, you find out now, in a commit that is trivial to revert.",
        terminalExercise: term("m8-remove-dead", {
          intro: "OldCheckout.jsx has been removed with git rm, and axios with npm uninstall.",
          goal: "Prove the production build still works after the removals.",
          accept: ["npm run build 2>&1 | tail -n 4"],
          near: [{ command: "git status --short", why: "That shows what changed (the deletion, the manifests). Prove the app still builds." }],
          hint: "npm run build, last 4 lines.",
          success: "Built, and the tests pass (8/8). npm reported removing 25 packages: axios and its own dependencies. A smaller, clearer project, with proof.",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 48 · 8.5 – 8.6
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ce-l48-debt-refactor",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 3,
    covers: ["8.5", "8.6"],
    title: "Real Debt Versus Harmless Complexity; Refactoring Without Changing Behaviour",
    subtitle: "Deciding what is worth fixing, and changing structure while proving nothing else changed",
    estimatedMinutes: 30,
    intro:
      "Not everything that looks complicated is a problem, and not every problem is worth fixing now. Spend effort where the code actually slows change down or causes bugs, and when you do refactor, prove the behaviour is unchanged.",

    atoms: [
      {
        id: "a-ce-debt-vs-complexity",
        title: "Harmless complexity versus genuine debt",
        explain:
          "Complexity is harmless when it is contained, tested and rarely changed: a tricky regular expression in a router that has worked for a year. It is genuine debt when it slows down changes people actually make, causes bugs, or hides risk. Ask of each item: how often is this touched? What breaks when it is? What would it cost to leave it another six months?",
        decision: {
          scenario: "Two candidates for clean-up: the router's regular expression for product URLs (dense, but tested by use, unchanged since March), and the duplicated delivery rule (simple, but already caused wrong totals).",
          question: "Which is genuine debt?",
          options: [
            { id: "a", text: "The duplicated rule: it has already caused a customer-facing bug and will again whenever the fee changes", why: "Debt is measured by cost: bugs caused and changes slowed. The dense regex costs nothing today." },
            { id: "b", text: "The regex, because it is harder to read", whyWrong: "Hard to read but contained, stable and working: complexity, not debt." },
            { id: "c", text: "Both equally", whyWrong: "One has a cost, the other does not." },
            { id: "d", text: "Neither: it all works", whyWrong: "The totals do not." },
          ],
          correct: "a",
          aftermath: "Fix what costs you, not what offends you.",
        },
      },
      {
        id: "a-ce-debt-register",
        title: "Prioritising debt",
        explain:
          "Keep a short debt register: each item, its cost (bugs, slowed changes, risk) and an estimate of the effort to fix. Fix the items with the highest cost for the lowest effort first, and fold debt work into feature work that touches the same code (\"leave it better than you found it\").",
        decision: {
          scenario: "Your register: (1) duplicated delivery rule: caused a bug, 1 hour. (2) OldCheckout.jsx: misleading, 5 minutes. (3) No route tests: risk, 1 day. (4) Rewrite the router with a framework: no current cost, 3 days.",
          question: "What order makes sense?",
          options: [
            { id: "a", text: "2 and 1 now (cheap; 1 is causing harm), then 3 before the next change to the routes; 4 not until there is a reason", why: "Highest cost per effort first, risk reduction next, and no big rewrite without a problem to solve." },
            { id: "b", text: "4 first: the biggest improvement", whyWrong: "Three days for no current benefit, while the bug keeps costing customers." },
            { id: "c", text: "Alphabetically", whyWrong: "Not a prioritisation." },
            { id: "d", text: "None: debt work is not real work", whyWrong: "Item 1 is a customer-facing bug." },
          ],
          correct: "a",
          aftermath: "Cheap and harmful first; expensive and harmless last, if ever.",
        },
      },
      {
        id: "a-ce-refactor-def",
        title: "Refactoring preserves behaviour",
        explain:
          "Refactoring means changing the structure of code without changing what it does. That definition gives you the test: for the same inputs, the old and new code must give the same outputs. Replacing ProductCard's inline formatting with formatPrice is a refactor only if every price looks exactly the same afterwards. Check it the direct way: run both on real prices.",
        codeExercise: {
          language: JS,
          code:
            '// ProductCard.jsx, before: formats inline\nconst inline = (kobo) => "₦" + (kobo / 100).toLocaleString("en-NG", { minimumFractionDigits: 2 });\n// src/utils/formatPrice.js\nconst formatPrice = (kobo) =>\n  "₦" + (kobo / 100).toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 });\n\nfor (const kobo of [21950000, 850000, 1590050]) {\n  console.log(inline(kobo), formatPrice(kobo), inline(kobo) === formatPrice(kobo));\n}\n',
          question: "What does it print for the three prices?",
          expectedOutput: "₦219,500.00 ₦219,500.00 true\n₦8,500.00 ₦8,500.00 true\n₦15,900.50 ₦15,900.50 true",
          hint: "Kobo divided by 100 has at most two decimal places, so the extra maximumFractionDigits never changes anything here.",
          successMessage: "Identical for every price, including one with kobo. The refactor preserves behaviour, and you have shown it rather than assumed it.",
        },
      },
      {
        id: "a-ce-refactor-check",
        title: "Proving a refactor with the project's own checks",
        explain:
          "After the refactor, run every check the project has: tests, lint and a build. Be honest about their limits: Kobo Market has no test for ProductCard, so the tests prove the rest of the app is unaffected, while the comparison above is what proves the prices.",
        terminalExercise: term("m8-refactor", {
          intro: "ProductCard.jsx now uses formatPrice.",
          goal: "Run the project's test suite after the refactor.",
          accept: ["npm test 2>&1 | tail -n 8"],
          near: [{ command: "git diff --stat", why: "That shows a small change (one file). Now run the checks." }],
          hint: "npm test, last 8 lines.",
          success: "8/8 pass, lint is clean and the build succeeds: nothing else was affected. Together with the price comparison, that is a proven refactor.",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 49 · 8.7 – 8.8
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ce-l49-small-steps",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 4,
    covers: ["8.7", "8.8"],
    title: "Small Reversible Changes; Dependency Upgrades and Breaking Changes",
    subtitle: "Why rewrites fail, and how to move a project forward one safe step at a time",
    estimatedMinutes: 30,
    intro:
      "When code is messy the temptation is to start again. Rewrites take longer than planned, reintroduce old bugs, and freeze everything else meanwhile. The professional alternative is a series of small steps, each one working, each one reversible.",

    atoms: [
      {
        id: "a-ce-small-steps",
        title: "Small, reversible steps",
        explain:
          "A good refactoring plan is a list of steps where the application works after every one, each step is its own commit, and each can be reverted alone. Small steps are easy to review, easy to test, and if one turns out wrong you lose an hour, not a month. With AI help this matters more: ask an agent for one step at a time, and review each.",
        terminalExercise: term("m8-plan", {
          intro: "Three refactoring steps have been made, one commit each.",
          goal: "List the last four commits to see the steps on top of the starting point.",
          accept: ["git log --oneline -n 4"],
          near: [{ command: "git diff --stat HEAD~3", why: "That shows the combined effect. First see the steps themselves." }],
          hint: "git log --oneline, last 4.",
          success: "Three steps on top of 222c42e: format prices with formatPrice, remove OldCheckout, remove axios. Each could be reverted on its own with git revert.",
        }),
      },
      {
        id: "a-ce-rewrite-trap",
        title: "The rewrite trap",
        explain:
          "Rewrites look attractive because the new code will be clean. But the old code encodes years of fixes for cases nobody remembers, and a rewrite rediscovers them one bug at a time, while the old system still needs maintaining. The safer pattern replaces a system piece by piece behind the same interface (often called the strangler fig pattern): new code takes over one route, one screen, one module at a time, and the old code shrinks until it can be deleted.",
        decision: {
          scenario: "An AI agent offers to \"rewrite Kobo Market in Next.js with a proper database, in one go\".",
          question: "What do you do?",
          options: [
            { id: "a", text: "Decline the one-shot rewrite; if a database is needed, replace server/db/index.js behind its existing functions first, as the ADR anticipated, then move other pieces one at a time", why: "The data layer already has one door. Replacing what is behind it is a contained step; everything else keeps working." },
            { id: "b", text: "Accept: the AI can do it in minutes", whyWrong: "Generating it is fast; verifying a whole new system, and its forgotten edge cases, is not." },
            { id: "c", text: "Accept, but only on Fridays", whyWrong: "Timing does not reduce the risk." },
            { id: "d", text: "Never change the architecture", whyWrong: "Change it, in steps." },
          ],
          correct: "a",
          aftermath: "Big change, small steps.",
        },
      },
      {
        id: "a-ce-outdated",
        title: "Which dependencies are behind?",
        explain:
          "npm outdated compares what is installed with what package.json allows (Wanted) and with the newest release (Latest). Wanted newer than Current means a safe update within your ranges (npm update). Latest newer than Wanted usually means a new MAJOR version: by semantic versioning, one that may contain breaking changes.",
        terminalExercise: term("m8-outdated", {
          goal: "Find which dependencies have newer versions available.",
          accept: ["npm outdated"],
          near: [{ command: "npm ls react react-dom", why: "That shows what is installed. npm outdated compares with what is available." }],
          hint: "npm outdated.",
          success: "react and react-dom 18 → 19, eslint 9 → 10, @eslint/js 9 → 10, globals 16 → 17: all major versions, all outside the ^ ranges, so each may break something.",
        }),
      },
      {
        id: "a-ce-breaking-changes",
        title: "Upgrading across a breaking change",
        explain:
          "A major upgrade is a project, not a command. Read the release notes and migration guide; upgrade one major dependency at a time, on its own branch; run the full test suite, lint and a build; check the parts the tests do not cover; and keep the lockfile change in the same commit, so the upgrade can be reverted as one unit. Dependencies that go together (react and react-dom) move together.",
        decision: {
          scenario: "You want to upgrade React 18 to 19 and ESLint 9 to 10.",
          question: "What is the safe plan?",
          options: [
            { id: "a", text: "Two separate branches: React and react-dom together in one, ESLint in the other; read each migration guide, run tests, lint and build, review, merge one at a time", why: "If something breaks, you know which upgrade caused it, and can revert just that one." },
            { id: "b", text: "npm install react@latest eslint@latest on main and push", whyWrong: "Two breaking upgrades at once, unreviewed, on main." },
            { id: "c", text: "Upgrade react but not react-dom", whyWrong: "They must match versions." },
            { id: "d", text: "Never upgrade", whyWrong: "Old versions stop getting security fixes." },
          ],
          correct: "a",
          aftermath: "One breaking change per branch.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 50 · 8.9 – 8.10
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ce-l50-diagrams-ai-arch",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 5,
    covers: ["8.9", "8.10"],
    title: "Diagrams of Components, Services and Data; Evaluating AI-Generated Architecture",
    subtitle: "Pictures that answer questions, and judging a design instead of accepting it",
    estimatedMinutes: 28,
    intro:
      "A good diagram answers one question at a glance. And when an AI proposes an architecture, the question is not whether it sounds professional, but whether it fits this project's actual needs.",

    atoms: [
      {
        id: "a-ce-diagrams",
        title: "Choosing the diagram for the question",
        explain:
          "A component diagram shows the parts and which depends on which (your dependency map from Module 3). A sequence diagram shows the order of calls for one interaction (the sign-in trace). A data or entity-relationship diagram shows records and how they relate (a user has orders; an order has lines of products). Draw them as text with Mermaid, which GitHub, GitLab and many editors render, so the diagram lives in the repository and is reviewed like code.",
        example:
          "```mermaid\nsequenceDiagram\n  participant U as Login.jsx\n  participant H as useAuth\n  participant C as api/client.js\n  participant R as routes/auth.js\n  participant S as authService\n  participant D as db/index.js\n  U->>H: signIn(email, password)\n  H->>C: login() → POST /api/login\n  C->>R: request\n  R->>S: authenticate(email, password)\n  S->>D: findUserByEmail(email)\n  D-->>S: user (salt, passwordHash)\n  S-->>R: token + user, or null\n  R-->>C: 200, or 401 {error}\n  C-->>H: data, or throws Error\n  H-->>U: user, or error shown\n```",
        decision: {
          scenario: "A new teammate asks: \"What happens, in order, when someone signs in?\"",
          question: "Which diagram answers that?",
          options: [
            { id: "a", text: "A sequence diagram of the sign-in, like the one above", why: "\"In order\" is a sequence question; the diagram shows each call and response in turn." },
            { id: "b", text: "A data diagram of users and orders", whyWrong: "That shows what is stored, not what happens." },
            { id: "c", text: "The folder tree", whyWrong: "Where files are, not what they do in order." },
            { id: "d", text: "A screenshot of the login page", whyWrong: "The surface only." },
          ],
          correct: "a",
          aftermath: "One diagram, one question.",
        },
      },
      {
        id: "a-ce-data-diagram",
        title: "A data diagram",
        explain:
          "Data diagrams show the records the system keeps and their relationships: one-to-many (a user places many orders), many-to-many (orders and products, through order lines). They expose design questions quickly: Kobo Market's orders copy each product's name and price into the order, which is correct (the order must remember the price paid, even if the product's price changes later).",
        example:
          "```mermaid\nerDiagram\n  USER ||--o{ ORDER : places\n  ORDER ||--|{ LINE : contains\n  PRODUCT ||--o{ LINE : \"appears in\"\n  USER { string id string email string role string passwordHash }\n  PRODUCT { string id string name string category int price }\n  ORDER { string id string userId int subtotal int delivery int total string status }\n  LINE { string id string name int price int quantity }\n```",
        decision: {
          scenario: "Someone proposes storing only the product id in each order line, and looking the price up from the product when the order is displayed.",
          question: "What is wrong with that?",
          options: [
            { id: "a", text: "If a product's price changes, old orders would show the new price, not what the customer paid", why: "An order is a record of a past transaction; it must keep the price as it was." },
            { id: "b", text: "Nothing: it saves space", whyWrong: "It saves a little space and corrupts history." },
            { id: "c", text: "Product ids are too long", whyWrong: "Not the issue." },
            { id: "d", text: "It would be faster", whyWrong: "Speed is not the concern; correctness is." },
          ],
          correct: "a",
          aftermath: "Diagrams make design questions like this visible.",
        },
      },
      {
        id: "a-ce-ai-architecture",
        title: "Evaluating an AI's proposed architecture",
        explain:
          "AI suggests architectures that are common in its training data: microservices, message queues, Kubernetes, several databases. They are right for some systems and wildly wrong for others. Evaluate any proposal against the real situation: the size of the team, the expected load, what actually hurts today, the cost to build and run it, and what it makes harder. The simplest design that meets real needs usually wins.",
        decision: {
          scenario: "Asked how to improve Kobo Market (three developers, six products, a few hundred orders a month), an AI proposes splitting it into five microservices with Kafka between them and Kubernetes to run them.",
          question: "What is your evaluation?",
          options: [
            { id: "a", text: "Reject it for now: it multiplies the operational work many times over and solves no problem this team has; fix the real issues (duplicated rules, missing tests, a real database when load requires it)", why: "Architecture should answer present needs. None of the proposal's benefits apply at this size, and all of its costs do." },
            { id: "b", text: "Accept it: it is how large companies build software", whyWrong: "They build it that way for problems of scale Kobo Market does not have." },
            { id: "c", text: "Accept half of it", whyWrong: "Half of an architecture for the wrong problem is still for the wrong problem." },
            { id: "d", text: "Ask the AI if it is sure", whyWrong: "The evaluation is yours to make, against the facts." },
          ],
          correct: "a",
          aftermath: "Ask: what problem does this solve, here, now?",
        },
      },
      {
        id: "a-ce-ai-arch-questions",
        title: "Questions to put to any proposed design",
        explain:
          "Before accepting a design, from an AI or a person, ask: what problem does it solve that we actually have? What will it cost to build, run and debug? What does it make harder? How do we get there in small steps, and back if it fails? Who on the team can maintain it? A proposal that cannot answer these is not ready.",
        decision: {
          scenario: "Which question best tests a proposal to move Kobo Market's data from the JSON file to PostgreSQL?",
          question: "Choose one.",
          options: [
            { id: "a", text: "\"What is the smallest first step, and how do we roll it back?\" (Answer: reimplement server/db/index.js's five functions on PostgreSQL behind the same interface, switch with a setting, keep the JSON version until proven.)", why: "It forces a concrete, reversible path, which the existing data layer happens to make easy." },
            { id: "b", text: "\"Is PostgreSQL popular?\"", whyWrong: "Popularity is not fitness." },
            { id: "c", text: "\"Can the AI write it?\"", whyWrong: "Writing it was never the hard part." },
            { id: "d", text: "\"Will it be faster?\"", whyWrong: "At this size, speed is not the problem it solves." },
          ],
          correct: "a",
          aftermath: "A design you cannot step into and back out of is a gamble.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 51 · 8.11
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ce-l51-docs",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 6,
    covers: ["8.11"],
    title: "READMEs, Setup Guides and Architecture Decision Records",
    subtitle: "Documentation that stays true, and records of why things are the way they are",
    estimatedMinutes: 26,
    intro:
      "Code says what the system does. Documentation says what it is for, how to run it, and why it was built this way: the things the next developer, or AI agent, cannot work out from the code alone.",

    atoms: [
      {
        id: "a-ce-readme",
        title: "A useful README",
        explain:
          "A README answers, in order: what this is and who it is for; how to run it locally (exact commands, tested on a clean machine); how to run the tests and build; how it is organised (or a link to the codebase map); and where to go next (contributing guide, decisions, deployment). Keep it short and true: a README that is wrong is worse than one that is brief.",
        decision: {
          scenario: "Kobo Market's README setup steps work today. Next month a teammate adds a required PAYSTACK_PUBLIC_KEY setting in a pull request that does not touch the README.",
          question: "What keeps a README true over time?",
          options: [
            { id: "a", text: "Test the setup steps on a clean machine (or a fresh clone) whenever they change, and update the README in the same pull request as the change", why: "Documentation is only true if it is checked, and kept with the code that makes it true." },
            { id: "b", text: "Write it once and never touch it", whyWrong: "It goes stale with the first change to setup." },
            { id: "c", text: "Assume new developers will figure it out", whyWrong: "That is the cost the README exists to remove." },
            { id: "d", text: "Ask an AI to regenerate it daily", whyWrong: "Unreviewed regeneration produces confident, untested instructions." },
          ],
          correct: "a",
          aftermath: "A reviewer's question for every setup change: is the README still true?",
        },
      },
      {
        id: "a-ce-setup-guide",
        title: "Setup guides that work first time",
        explain:
          "A setup guide is a sequence of commands someone can follow on a fresh machine without help: prerequisites with versions (Node 24, Git), cloning, installing (npm ci), configuring (cp .env.example .env, and which values to set), seeding, starting, and how to tell it worked (\"open http://localhost:5173 and sign in as bola@kobo.test\"). Every step either succeeds visibly or says what to do when it does not.",
        decision: {
          scenario: "Which setup step is written best?",
          question: "Choose one.",
          options: [
            { id: "a", text: "\"Copy .env.example to .env (cp .env.example .env) and set SESSION_SECRET to any long random string. Without it, npm start stops with 'SESSION_SECRET is not set'.\"", why: "The exact command, the value needed, and what failure looks like if you skip it." },
            { id: "b", text: "\"Configure the environment.\"", whyWrong: "Which variables? To what?" },
            { id: "c", text: "\"Ask Chidi for the .env file.\"", whyWrong: "Chidi has left, and .env files should not be passed around." },
            { id: "d", text: "\"See the code.\"", whyWrong: "That is what the guide was supposed to save." },
          ],
          correct: "a",
          aftermath: "Exact commands, expected results, and what failure looks like.",
        },
      },
      {
        id: "a-ce-adr",
        title: "Architecture decision records",
        explain:
          "An architecture decision record (ADR) is a short document, one per significant decision: the context (what situation forced a choice), the decision, and its consequences (good and bad). They are numbered, kept in the repository (docs/decisions/), and never rewritten: if a decision changes, a new ADR supersedes the old one. They answer the question every inheritor asks: why on earth is it built like this?",
        terminalExercise: term("m8-adr", {
          goal: "Read the decision record explaining why Kobo Market stores its data in a JSON file.",
          accept: ["cat docs/decisions/0001-json-file-store.md"],
          near: [{ command: "ls docs/decisions", why: "That lists the ADRs. Read the one about the data store." }],
          hint: "cat the file in docs/decisions.",
          success: "Context (three people, a demo), decision (one JSON file behind server/db/index.js), consequences, including that it will not scale past one server and that moving to a database means rewriting one file. The design was deliberate, and its limits were known.",
        }),
      },
      {
        id: "a-ce-adr-when",
        title: "When to write an ADR",
        explain:
          "Write one when a decision is significant (hard to reverse, affects many parts, or chooses between real alternatives), and when someone will later wonder why. Not for every library or naming choice. Writing the ADR before implementing also forces the alternatives and consequences to be thought through, and gives AI agents, which read the repository, the reasons as well as the code.",
        decision: {
          scenario: "Which of these deserves an ADR?",
          question: "Choose one.",
          options: [
            { id: "a", text: "Moving sessions from signed tokens in the browser to server-side sessions", why: "It changes security properties, touches the frontend and backend, and has real alternatives with trade-offs." },
            { id: "b", text: "Renaming a variable", whyWrong: "Trivial and easy to reverse." },
            { id: "c", text: "Fixing a typo in the README", whyWrong: "Not a decision." },
            { id: "d", text: "Adding a test", whyWrong: "Good practice, not an architectural decision." },
          ],
          correct: "a",
          aftermath: "Significant, hard to reverse, real alternatives: write it down.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 52 · 8.P
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ce-l52-refactor-plan",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 7,
    covers: ["8.P"],
    title: "Practical: A Refactoring Plan, Carried Out in Small Steps",
    subtitle: "Inventory, plan, one commit per step, and proof that every feature still works",
    estimatedMinutes: 38,
    intro:
      "Put the module together: survey the problems, plan small steps in a sensible order, carry them out one commit at a time, and prove after each that nothing broke.",

    atoms: [
      {
        id: "a-ce-p8-inventory",
        title: "Step 0: the inventory",
        explain:
          "Before planning, list the concrete problems with evidence. For the delivery rule, that means every place the fee appears, tests included: they tell you what will need updating, and what already guards the behaviour.",
        terminalExercise: term("m8-duplication", {
          goal: "Find every hard-coded 150000 (the ₦1,500 delivery fee) in the project.",
          accept: ['rg -n "150000"'],
          near: [{ command: 'rg -n "toLocaleString" src', why: "That is the formatting duplication. Search for the fee's value." }],
          hint: "rg for the number.",
          success: "Three: the server's constant, the cart page's copy, and the test's expected value. The test is good news: it will tell you if the server's rule changes by accident.",
        }),
      },
      {
        id: "a-ce-p8-plan",
        title: "Step 1: order the plan",
        explain:
          "Order steps so the app works after each one, the safest and most independent come first, and each step's purpose fits in a commit message. Each step also states how it will be verified.",
        decision: {
          scenario: "Planned steps: A) remove OldCheckout.jsx; B) remove axios; C) ProductCard uses formatPrice; D) the cart page uses the server's delivery rule (with a new test).",
          question: "Which plan is sound?",
          options: [
            { id: "a", text: "C, A, B as three separate commits, each followed by tests, lint and a build; then D on its own branch with a new test first, because it changes behaviour customers see", why: "The first three change no behaviour and are independent; D fixes a bug, so it gets a test first and its own review." },
            { id: "b", text: "All four in one commit called \"cleanup\"", whyWrong: "Impossible to review or revert separately, and it mixes a behaviour change with refactors." },
            { id: "c", text: "D first, without a test, because it matters most", whyWrong: "It matters most, so it most needs the test." },
            { id: "d", text: "Skip verification until the end", whyWrong: "Then you cannot tell which step broke something." },
          ],
          correct: "a",
          aftermath: "Refactors and behaviour changes never share a commit.",
        },
      },
      {
        id: "a-ce-p8-commits",
        title: "Step 2: the scope of the steps",
        explain:
          "After the three refactoring commits, look at their combined effect. The numbers should match the plan: a few lines in the component, a file deleted, and a lockfile change from the uninstall.",
        terminalExercise: term("m8-plan", {
          goal: "See the combined effect of the last three commits.",
          accept: ["git diff --stat HEAD~3"],
          near: [{ command: "git log --oneline -n 4", why: "That lists the steps. git diff --stat HEAD~3 shows what they changed together." }],
          hint: "git diff --stat against HEAD~3.",
          success: "4 files: ProductCard (+3 −2), OldCheckout deleted (−12), package.json (−1) and package-lock.json (−311, axios's dependency tree). Exactly the plan, nothing more.",
        }),
      },
      {
        id: "a-ce-p8-prove",
        title: "Step 3: the original features still work",
        explain:
          "Prove the app as a whole is intact: the test suite, lint and the production build. Then check by hand what the tests do not cover: here, that product prices display exactly as before.",
        terminalExercise: term("m8-plan", {
          goal: "Run the test suite after all three steps.",
          accept: ["npm test 2>&1 | tail -n 8"],
          near: [{ command: "npm run lint", why: "Lint passing is part of it; run the test suite too." }],
          hint: "npm test, last 8 lines.",
          success: "8/8 tests pass, lint is clean and the build succeeds. With the formatting comparison from Lesson 48, every feature is accounted for.",
        }),
      },
      {
        id: "a-ce-p8-manual",
        title: "Checking what the tests do not cover",
        explain:
          "Automated checks rarely cover everything, so a refactor's proof includes a short, explicit manual checklist for the uncovered behaviour, written down and repeatable, ideally as the first draft of the tests you add next.",
        decision: {
          scenario: "Which manual checklist best covers the gaps after these three steps?",
          question: "Choose one.",
          options: [
            { id: "a", text: "\"npm run dev; products page shows ₦219,500.00 for the Tecno Spark 30 and ₦8,500.00 for the Aso-oke cap; add both to the cart; cart total unchanged from before (₦229,500.00 incl. delivery shown).\"", why: "Specific inputs and expected outputs for exactly the behaviour the tests do not reach: prices on cards and in the cart." },
            { id: "b", text: "\"Click around and see if it looks okay.\"", whyWrong: "Not repeatable, not specific." },
            { id: "c", text: "\"Tests pass, so no manual check needed.\"", whyWrong: "No test covers ProductCard." },
            { id: "d", text: "\"Ask a customer.\"", whyWrong: "Customers are not your test suite." },
          ],
          correct: "a",
          aftermath: "Repeatable manual checks are tomorrow's automated tests.",
        },
      },
    ],

    task: {
      title: "Module practical: a refactoring plan, carried out",
      intro:
        "Take an application with oversized components, duplicated functions or poorly organised files (your own, or a deliberately messy AI-generated one). Plan the refactor, carry it out in small steps, and prove the original features still work.",
      prompts: [
        "Inventory: each problem with its evidence (search output, line counts, the duplicated lines).",
        "Debt register: cost and effort for each item, and which you will not fix now, with reasons.",
        "The plan: ordered steps, each with its verification, refactors separate from behaviour changes.",
        "The commits: one per step, with meaningful messages (git log --oneline).",
        "Proof after every step: tests, lint, build, and a written manual checklist for what tests do not cover.",
        "A diagram (Mermaid) of the part you changed, before and after, and an ADR if you made a significant decision.",
      ],
      closing: "Next module: environments, dependencies, deployment and security: why code that works here fails there.",
    },
    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
