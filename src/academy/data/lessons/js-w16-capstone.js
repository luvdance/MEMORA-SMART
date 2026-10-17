/**
 * OBJECT ORIENTED PROGRAMMING (JAVASCRIPT) · WEEK 16 · CAPSTONE PROJECT
 *
 * The curriculum's capstone: one complete application, built with the skills
 * of the whole course. Its stated requirements are recorded as 16.1 – 16.5 in
 * the course outline — choosing and scoping, the data model, a working
 * interface with appropriate data handling, validation and error states, and
 * GitHub with a deployed version — and these lessons cover them in order.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

export const SECTION_ID = "js-s16-capstone";

const JS = "javascript";

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 60 · 16.1 – 16.2
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "js-l60-capstone-scope",
    moduleId: "js-w16-capstone",
    sectionId: SECTION_ID,
    order: 1,
    covers: ["16.1", "16.2"],
    title: "Choosing, Scoping and Designing Your Capstone",
    subtitle: "Pick a project you can finish, then model it as objects",
    estimatedMinutes: 18,
    intro:
      "The capstone is where you prove you can build a complete application on your own, from an empty folder to a public URL. Most capstones that fail do not fail on code. They fail on scope: too big to finish, or too vague to know when it is done. This lesson is about getting that right first.",

    atoms: [
      {
        id: "a-js-capstone-options",
        title: "The five capstone options",
        explain:
          "Choose one. Each exercises the whole course, and each can be built well in a week if it is scoped carefully. Pick the one whose data you understand best, because you will be making dozens of small decisions about it.",
        table: {
          caption: "The options, and what each one tests most.",
          headers: ["Option", "Core data", "Stretches you on"],
          rows: [
            ["Student management dashboard", "Students, classes, scores", "Classes and encapsulation, aggregation with reduce"],
            ["Expense tracker with charts", "Expenses, categories, months", "Dates, Intl money formatting, summarising for a chart"],
            ["Product catalogue with search and filtering", "Products, categories, prices", "Filtering, sorting, derived state, empty states"],
            ["Task manager with persistent data", "Tasks, projects, due dates", "localStorage, immutable updates, overdue logic"],
            ["API-powered information dashboard", "Whatever the API returns", "async/await, status codes, loading and error states"],
          ],
        },
        why: "Every option, whichever you choose, must meet the same requirements: a working interface, appropriate data handling, form validation, error states, a GitHub history and a deployed version. The data is different; the standard is the same.",
      },
      {
        id: "a-js-scoping",
        title: "Scoping: the smallest version that is genuinely useful",
        explain:
          "Write down the minimum viable product: the smallest set of features a real user would find useful. Build that completely, including validation and error states, before adding anything else. List the extras separately as \"if time allows\". A finished small app is worth far more than an unfinished big one.",
        decision: {
          scenario:
            "You chose the expense tracker. Your idea list: add, edit and delete expenses; categories; monthly totals; a pie chart; multiple currencies; user accounts with login; bank import; budgets with alerts; dark mode.",
          question: "What is a good minimum viable product for one week?",
          options: [
            {
              id: "a",
              text: "Add, edit and delete expenses with validation; categories; monthly totals and a simple chart; saved in localStorage. Everything else goes on the \"if time allows\" list",
              why: "It is a complete, useful tracker that exercises the whole course, and every part can be finished to a high standard in a week. Accounts and bank import each need a back end and would consume the week on their own.",
            },
            {
              id: "b",
              text: "Everything on the list, because more features impress employers",
              whyWrong: "A week is not enough, so most features end up half-built and buggy. Employers are impressed by finished, polished work, and they will click on the broken parts.",
            },
            {
              id: "c",
              text: "Only adding expenses, nothing else",
              whyWrong: "Too small to be useful, and it does not exercise editing, deleting, summarising or charts. A minimum viable product still has to be viable.",
            },
            {
              id: "d",
              text: "Start coding immediately and decide the scope as you go",
              whyWrong: "Without a written scope you cannot tell when you are finished, and the project grows until the deadline arrives with nothing complete.",
            },
          ],
          correct: "a",
          aftermath: "Write the scope in your README before you write any code. When you are tempted to add a feature, check the list. If it is not in the MVP, it waits.",
        },
      },
      {
        id: "a-js-data-model",
        title: "Designing the data model",
        explain:
          "Before any interface, design the objects. What are the things in your app, what does each one know (its properties), what can it do or answer (its methods), and what rules must always hold (validation in its constructor and setters)? Then which class is responsible for the collection, and for summaries across it? This is Week 13's design, applied to your own project.",
        code: {
          language: JS,
          code: 'class Expense {\n  constructor({ id, title, amount, category, date }) {\n    if (!title?.trim()) throw new Error("An expense needs a title");\n    if (!(amount > 0)) throw new Error("Amount must be greater than zero");\n    this.id = id;\n    this.title = title.trim();\n    this.amount = amount;\n    this.category = category;\n    this.date = date;\n  }\n  get month() {\n    return this.date.slice(0, 7);\n  }\n}\n\nclass Ledger {\n  #expenses = [];\n  add(data) {\n    const expense = new Expense({ id: this.#expenses.length + 1, ...data });\n    this.#expenses.push(expense);\n    return expense;\n  }\n  totalFor(month) {\n    return this.#expenses.filter((e) => e.month === month).reduce((sum, e) => sum + e.amount, 0);\n  }\n  byCategory(month) {\n    const totals = {};\n    for (const e of this.#expenses.filter((x) => x.month === month)) {\n      totals[e.category] = (totals[e.category] ?? 0) + e.amount;\n    }\n    return totals;\n  }\n}\n\nconst ledger = new Ledger();\nledger.add({ title: "Rice", amount: 18000, category: "Food", date: "2026-10-03" });\nledger.add({ title: "Bus fare", amount: 2500, category: "Transport", date: "2026-10-05" });\nledger.add({ title: "Fish", amount: 6500, category: "Food", date: "2026-10-09" });\nledger.add({ title: "Data", amount: 5000, category: "Bills", date: "2026-09-28" });\n\nconsole.log(ledger.totalFor("2026-10"));\nconsole.log(ledger.byCategory("2026-10"));\n',
          expectedOutput: "27000\n{ Food: 24500, Transport: 2500 }",
        },
        why: "The chart needs exactly what byCategory returns, and the monthly total needs totalFor. Designing the model first means the interface code is mostly just calling these methods and displaying the answers.",
      },
      {
        id: "a-js-model-practice",
        title: "Test your model before any interface",
        explain:
          "A model with no interface can be checked straight away, in Node, with plain calls. Try every rule: the normal case, the boundaries and the invalid inputs. If the model is right, every screen built on top of it starts from correct data.",
        codeExercise: {
          language: JS,
          code: 'class Expense {\n  constructor({ title, amount }) {\n    if (!title?.trim()) throw new Error("An expense needs a title");\n    if (!(amount > 0)) throw new Error("Amount must be greater than zero");\n    this.title = title.trim();\n    this.amount = amount;\n  }\n}\n\nconst attempts = [\n  { title: "  Lunch  ", amount: 3500 },\n  { title: "", amount: 1000 },\n  { title: "Refund", amount: -200 },\n  { title: "Snack", amount: "500" },\n  { title: "Taxi" },\n];\n\nfor (const a of attempts) {\n  try {\n    const e = new Expense(a);\n    console.log(`ok: ${e.title} ${e.amount}`);\n  } catch (err) {\n    console.log(`rejected: ${err.message}`);\n  }\n}\n',
          question: "Five attempts to create an expense. Watch the fourth: \"500\" > 0 is true in JavaScript, because the string is converted. What is printed?",
          expectedOutput: "ok: Lunch 3500\nrejected: An expense needs a title\nrejected: Amount must be greater than zero\nok: Snack 500\nrejected: Amount must be greater than zero",
          hint: "The title is trimmed. An empty title fails. -200 fails. \"500\" > 0 is true, so it passes even though it is a string. A missing amount is undefined, and undefined > 0 is false.",
          successMessage:
            "The model test found a real bug: the string \"500\" was accepted, and it would later be joined, not added, in a total. The fix is a type check in the constructor: typeof amount === \"number\". That is exactly why you test the model before building anything on it.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 61 · 16.3 – 16.4
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "js-l61-capstone-build",
    moduleId: "js-w16-capstone",
    sectionId: SECTION_ID,
    order: 2,
    covers: ["16.3", "16.4"],
    title: "Building It Properly",
    subtitle: "A working interface, real data handling, validation and every state",
    estimatedMinutes: 18,
    intro:
      "With the model designed and tested, the interface is built on top of it. The standard for the capstone is not \"it works when I use it carefully\". It is \"a stranger can use it, make mistakes, lose their connection, and still understand what is happening\".",

    atoms: [
      {
        id: "a-js-build-order",
        title: "Build in vertical slices",
        explain:
          "Do not build all the screens, then all the logic, then all the saving. Build one complete feature at a time, from model to screen to storage, and commit it working. Then the next. At every point you have a working app that does slightly more than before, and if time runs out, what you have is finished.",
        example:
          "Day 1  Model classes + tests (no UI yet)                  commit\nDay 2  Add an expense: form → validation → list → saved     commit\nDay 3  Edit and delete, with confirmation                     commit\nDay 4  Monthly totals and the category chart                  commit\nDay 5  Empty, loading and error states; keyboard pass         commit\nDay 6  README, deploy, test on a phone, fix what you find     commit\nDay 7  Buffer: things always take longer than planned\n\nEach line leaves you with an app that works.",
        why: "Vertical slices also expose integration problems early. A model that looked right in isolation and turns out to be awkward for the interface is found on Day 2, not Day 6.",
      },
      {
        id: "a-js-data-handling",
        title: "Appropriate data handling",
        explain:
          "\"Appropriate data handling\" means four things in practice. Data has one source of truth, the model, and the UI is derived from it. Updates create new values rather than mutating in place. Saved and fetched data is validated on the way in, never trusted. And every derived figure, such as a total or a count, is calculated from the data rather than stored separately.",
        codeExercise: {
          language: JS,
          code: 'function summarise(expenses, month) {\n  const inMonth = expenses.filter((e) => e.date.startsWith(month));\n  const total = inMonth.reduce((sum, e) => sum + e.amount, 0);\n  const top = [...inMonth].sort((a, b) => b.amount - a.amount)[0] ?? null;\n  return {\n    count: inMonth.length,\n    total: new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN" }).format(total),\n    largest: top ? top.title : "none",\n  };\n}\n\nconst expenses = [\n  { title: "Rent", amount: 150000, date: "2026-10-01" },\n  { title: "Rice", amount: 18000, date: "2026-10-03" },\n  { title: "Fuel", amount: 25000, date: "2026-09-30" },\n];\n\nconsole.log(summarise(expenses, "2026-10"));\nconsole.log(summarise(expenses, "2026-11"));\n',
          question: "A summary derived entirely from the data, including for a month with nothing in it. What is printed?",
          expectedOutput: "{ count: 2, total: '₦168,000.00', largest: 'Rent' }\n{ count: 0, total: '₦0.00', largest: 'none' }",
          hint: "Only the two October expenses count. For November, the filter is empty, the total is 0, and ?? null handles the missing top expense.",
          successMessage:
            "The empty month is handled without a special case and without crashing, because every step was written to cope with an empty list. The summary is never stored, so it can never be out of date.",
        },
      },
      {
        id: "a-js-validation-states",
        title: "Form validation and error states",
        explain:
          "Every form validates before it acts, shows each problem next to its field, and keeps what the user typed. Every data operation has visible states: loading, success, empty and error. For a capstone, list every state on paper for every screen, and check each one is designed.",
        table: {
          caption: "The states a capstone screen must handle.",
          headers: ["State", "What the user should see"],
          rows: [
            ["Empty (first visit)", "A friendly message and the obvious first action, such as \"Add your first expense\""],
            ["Loading", "A clear indicator; buttons disabled so nothing is submitted twice"],
            ["Success", "The data, and confirmation of what just changed"],
            ["Validation error", "The message beside the field, focus moved to it, input kept"],
            ["Operation error", "What failed, in plain words, and a way to retry"],
            ["Not found", "A useful message rather than a blank page or a crash"],
          ],
        },
        why: "Examiners and employers test capstones by doing the wrong thing on purpose: submitting empty forms, typing letters into amounts, turning off the network. The states you designed are what they see.",
      },
      {
        id: "a-js-state-machine",
        title: "Making impossible states impossible",
        explain:
          "Using separate booleans such as isLoading and hasError allows contradictions, like loading and error at the same time. A single status field with a fixed set of values, changed only through allowed transitions, means the screen can only ever be in one sensible state.",
        codeExercise: {
          language: JS,
          code: 'const TRANSITIONS = {\n  idle: ["loading"],\n  loading: ["success", "empty", "error"],\n  success: ["loading"],\n  empty: ["loading"],\n  error: ["loading"],\n};\n\nfunction move(current, next) {\n  if (!TRANSITIONS[current].includes(next)) {\n    console.log(`ignored: ${current} -> ${next}`);\n    return current;\n  }\n  return next;\n}\n\nlet status = "idle";\nfor (const next of ["loading", "success", "error", "loading", "empty"]) {\n  status = move(status, next);\n}\nconsole.log(status);\n',
          question: "A list of attempted transitions, checked against the allowed ones. What is printed?",
          expectedOutput: "ignored: success -> error\nempty",
          hint: "idle → loading → success is allowed. success → error is not in the table. Then success → loading → empty is allowed.",
          successMessage:
            "A stale error arriving after a success was ignored, instead of replacing good data with an error message. This small table is a state machine, and it is a standard professional technique for exactly the bugs that make interfaces flicker or contradict themselves.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 62 · 16.5
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "js-l62-capstone-ship",
    moduleId: "js-w16-capstone",
    sectionId: SECTION_ID,
    order: 3,
    covers: ["16.5"],
    title: "Shipping and Defending It",
    subtitle: "Version control, deployment, the README and the walkthrough",
    estimatedMinutes: 16,
    intro:
      "A capstone is not finished when the code works. It is finished when it is in a public repository with a history that shows how it was built, deployed where anyone can use it, documented so a stranger understands it, and explained by you in your own words.",

    atoms: [
      {
        id: "a-js-repo-quality",
        title: "A repository worth reading",
        explain:
          "Your repository is part of the submission. It should have a meaningful history of small commits, at least one feature built on a branch and merged, no node_modules, no secrets, and a README at the top that answers the questions a visitor will have.",
        example:
          "README.md\n\n  # Kobo — a monthly expense tracker\n\n  Live: https://kobo-yourname.vercel.app\n\n  Track spending by category and see where each month's money went.\n  Built with React, Vite and plain JavaScript classes; data is saved\n  in your browser's localStorage.\n\n  ## Features\n  - Add, edit and delete expenses, with validation\n  - Monthly totals and a spending-by-category chart\n  - Works with the keyboard alone; tested with Lighthouse\n\n  ## Running it locally\n      npm install\n      npm run dev\n      npm test\n\n  ## How it is built\n  src/models (Expense, Ledger), src/logic (summaries),\n  src/services (storage), src/ui (React components).\n\n  ## What I would do next\n  Accounts and sync across devices, which need a back end.",
        why: "Recruiters often spend under a minute on a repository. A README with a live link, a one-line description and clear instructions means that minute is spent on your work rather than on working out what it is.",
      },
      {
        id: "a-js-final-checks",
        title: "The pre-submission checklist",
        explain:
          "Before submitting, test the deployed version, not your laptop, on a phone as well as a computer. Try the empty state, a validation error, a refresh on an inner page, and the keyboard alone. Most capstone bugs are found in the first five minutes of doing this.",
        decision: {
          scenario:
            "It is the evening before the deadline. The app works on your laptop. You have one hour left.",
          question: "What is the best use of that hour?",
          options: [
            {
              id: "a",
              text: "Test the deployed version on a phone and a computer, fix anything broken, check the README and the live link, then commit and push",
              why: "The deployed version is what will be assessed. Finding that a refresh 404s, or that the layout breaks on a phone, now is far better than an examiner finding it tomorrow.",
            },
            {
              id: "b",
              text: "Add dark mode, because it would impress",
              whyWrong: "A new feature the night before is the most common way to submit a broken capstone. It is not in the MVP, and it risks breaking what already works.",
            },
            {
              id: "c",
              text: "Rewrite the main component, which you are not proud of",
              whyWrong: "A late rewrite trades a working, slightly untidy component for an untested one. Note it under \"what I would do next\" instead.",
            },
            {
              id: "d",
              text: "Nothing; it works on your laptop",
              whyWrong: "Your laptop has your .env file, your cached data and your browser. The deployed version has none of them, and it is the one being assessed.",
            },
          ],
          correct: "a",
          aftermath: "\"Works on my machine\" is not a submission standard. \"Works at the URL, on a phone, for a stranger\" is.",
        },
      },
      {
        id: "a-js-defending",
        title: "Defending your decisions",
        explain:
          "You will record a short walkthrough and may be asked questions about your project. Prepare three things: a demonstration of the main flow, including one error state; one design decision you made and the alternative you rejected, with the reason; and one bug you found, how you found it and how you fixed it. These show that you understand the code, not only that it runs.",
        practice: {
          prompt:
            "Write the one-paragraph answer you would give to: \"Why did you use a class for your Ledger instead of a plain array?\"",
          answer:
            "A strong answer names the rule the class protects and what would go wrong without it. For example: \"The Ledger keeps its expenses private and only accepts new ones through add, which creates an Expense and validates it. With a plain array, any part of the code could push an expense with a negative amount or a string amount, and the totals would silently be wrong. The class also gives the interface exactly the summaries it needs, totalFor and byCategory, so the components only display data and never calculate it. The trade-off is a little more code up front, which I accepted because it made the model easy to test.\"",
        },
        why: "Being able to explain a trade-off, what you chose, what you rejected and why, is what technical interviews actually test. Every week of this course gave you a decision like that to practise on.",
      },
    ],

    task: {
      title: "Capstone deliverables",
      intro:
        "Build one of the five applications. It must include every item below. Submit the repository link, the live link and your walkthrough recording.",
      prompts: [
        "A working interface that a stranger can use without instructions, built with React and Vite, usable with the keyboard alone.",
        "Appropriate data handling: model classes with validation and encapsulated state, tested in Node, with every derived figure calculated rather than stored.",
        "Form validation on every form, with messages beside the fields, and visible loading, empty and error states on every screen that handles data.",
        "A GitHub repository with a meaningful history of small commits, at least one feature built on a branch, no secrets and no node_modules, and a README with the live link, features, how to run it and how it is built.",
        "A deployed version at a public URL, tested on a phone, plus a short recorded walkthrough covering the main flow, one design decision and one bug you fixed.",
      ],
      closing:
        "Sixteen weeks ago, the first lesson asked what a program is. This one is yours, it is live, and you can explain every line of it. That is what the certificate certifies.",
    },

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
