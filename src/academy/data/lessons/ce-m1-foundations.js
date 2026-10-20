/**
 * CODEBASE ENGINEERING · MODULE 1 · THE MODERN DEVELOPER'S OPERATING SYSTEM
 *
 * Curriculum 1.0 – 1.8 and the practical, 1.P. What managing a codebase
 * means, why it matters more when AI writes code, the vocabulary, the parts
 * of an application and its lifecycle, technical debt, and the baseline you
 * take before changing anything.
 *
 * Every terminal is a recorded session (./ce-transcripts.js) on Kobo Market.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

import { term, shown } from "./ce-helpers.js";

export const SECTION_ID = "ce-s1-foundations";
const MODULE = "ce-m1-foundations";

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 1 · 1.0
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ce-l1-welcome",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 1,
    covers: ["1.0"],
    title: "Welcome: Owning a Codebase in the AI Era",
    subtitle: "What this course teaches, the project you inherit, and how you will work",
    estimatedMinutes: 18,
    intro:
      "Anyone can now ask an AI to write a login page. Far fewer people can open a project they have never seen, say what every part of it does, find why sign-in broke after yesterday's change, and fix it without breaking checkout. That second skill is what employers pay for, and it is what this course teaches.",

    atoms: [
      {
        id: "a-ce-welcome-why",
        title: "What managing a codebase means",
        explain:
          "A codebase is all the source code, configuration and history of a piece of software. Managing it means you can answer five questions about it at any time: what does it do, how is it put together, what changed recently and why, is it working right now, and how do I change it safely? Developers call the first two program comprehension and the last three ownership. AI coding tools have made writing code cheap, so these questions are now the expensive part of software engineering. Someone has to know what the generated code does, review it, and be accountable when it breaks.",
        why: "Teams that generate code faster than they understand it end up with software nobody can safely change. The developer who can understand and control a codebase becomes the person the team relies on.",
        decision: {
          scenario:
            "Two developers apply for the same job. Both used AI to build a portfolio project. In the interview, each is shown a bug in their own project: the cart total is wrong.",
          question: "Which answer shows the skill this course teaches?",
          options: [
            { id: "a", text: "\"The total is computed in two places, the cart page and the server, and they use different delivery rules. Here are the two files, and here is the commit where the server rule changed.\"", why: "They know where the logic lives, why the two disagree, and when it changed. That is comprehension and ownership, and it is what the interviewer is testing." },
            { id: "b", text: "\"I would paste the whole project into the AI and ask it to fix the total.\"", whyWrong: "That might work, but it shows no understanding of the project. When the AI is wrong, this developer cannot tell." },
            { id: "c", text: "\"The AI wrote that part, so I am not sure how it works.\"", whyWrong: "Honest, but it is exactly the gap this course closes. Code you ship is code you own, whoever typed it." },
            { id: "d", text: "\"I would rewrite the cart from scratch.\"", whyWrong: "A rewrite to fix one total throws away working code and usually adds new bugs. Find the cause first." },
          ],
          correct: "a",
          aftermath: "By the end of Module 4 you will be able to give answer (a) about a project you did not write.",
        },
      },
      {
        id: "a-ce-welcome-phases",
        title: "Four phases, eight weeks",
        explain:
          "The course follows the order in which you would take over a real project. First you understand it, without changing anything. Then you learn what makes it work and how changes are tracked. Then you bring in AI assistants and agents as investigation partners, and learn to debug with evidence. Finally you learn to keep a complex project healthy: architecture, refactoring, deployment, security, and a workflow you can reuse. Each module ends with a practical assignment you do on a real project of your own choosing.",
        table: {
          caption: "The four phases.",
          headers: ["Phase", "Modules", "You will be able to"],
          rows: [
            ["1 · Understanding the codebase", "1–3", "Map any project from the terminal before touching it"],
            ["2 · What makes the application work", "4–5", "Trace a feature end to end, and control every change with Git"],
            ["3 · AI-assisted codebase intelligence", "6–7", "Direct AI agents under review, and find root causes with evidence"],
            ["4 · Maintaining complex projects", "8–11", "Refactor, deploy and secure safely, and run your own workflow"],
          ],
        },
        decision: {
          scenario: "On your first day at a new job you are given access to the company's repository and asked to \"add a discount code field to checkout\".",
          question: "Which order matches how this course says to work?",
          options: [
            { id: "a", text: "Map the project and trace how checkout works now, check its state and history, then make a small change on a branch and prove it with tests", why: "Understand, then trace, then change in a controlled way. That is the order of the four phases, and the order professionals follow." },
            { id: "b", text: "Ask an AI to add the field, commit and push before lunch", whyWrong: "Fast, but nobody, including you, knows what the AI changed or whether checkout still works." },
            { id: "c", text: "Read every file in the repository first", whyWrong: "On a large project that takes weeks, and most files are irrelevant to checkout. You will learn to find the files that matter." },
            { id: "d", text: "Rewrite checkout the way you would have built it", whyWrong: "It is not yours to redesign on day one, and a rewrite risks everything that currently works." },
          ],
          correct: "a",
          aftermath: "Understand before you change. Every module comes back to this.",
        },
      },
      {
        id: "a-ce-welcome-roadmap",
        title: "The roadmap, module by module",
        explain:
          "Here is every module in the course and the question it answers. You do not need to remember it, but come back to it whenever you want to know where a skill fits.",
        table: {
          caption: "Every module, in order.",
          headers: ["Module", "Week", "The question it answers"],
          rows: [
            ["Module 1", "Week 1", "What does managing a codebase mean, and where do I start?"],
            ["Module 2", "Week 1–2", "How do I inspect and search a project from the terminal?"],
            ["Module 3", "Week 2", "How is this unfamiliar project laid out, and what matters?"],
            ["Module 4", "Week 3", "What happens, file by file, when a user clicks a button?"],
            ["Module 5", "Week 3–4", "What changed, who changed it, and how do I undo it safely?"],
            ["Module 6", "Week 4–5", "How do I use AI assistants and agents without losing control?"],
            ["Module 7", "Week 5–6", "Why is it broken, and how do I prove my fix worked?"],
            ["Module 8", "Week 6–7", "How do I keep it maintainable as it grows?"],
            ["Module 9", "Week 7", "Why does it work here and fail in production?"],
            ["Module 10", "Week 8", "How do I build a workflow that scales with the project?"],
            ["Capstone", "Week 8", "Can I take ownership of a codebase end to end?"],
          ],
        },
        decision: {
          scenario: "A friend's app works on their laptop but crashes as soon as it is deployed to a hosting service.",
          question: "Which module is mainly about this situation?",
          options: [
            { id: "a", text: "Module 9: environments, dependencies, deployment and security", why: "\"Works here, fails there\" is almost always a difference in environment variables, versions, build output or configuration, which is Module 9." },
            { id: "b", text: "Module 2: terminal mastery", whyWrong: "You will use the terminal to investigate, but the subject is the difference between environments." },
            { id: "c", text: "Module 8: refactoring", whyWrong: "Refactoring improves structure; it does not explain a deployment failure." },
            { id: "d", text: "Module 1: foundations", whyWrong: "Module 1 introduces the lifecycle; Module 9 is where you investigate deployment failures." },
          ],
          correct: "a",
          aftermath: "Modules build on each other, so a later module assumes the earlier ones.",
        },
      },
      {
        id: "a-ce-welcome-project",
        title: "The project you inherit: Kobo Market",
        explain:
          "All through the course you work on Kobo Market, an online market for small traders: customers browse products, sign in, fill a cart and pay with Paystack. It has a React frontend, a Node.js API, a data store, tests and eleven commits by three developers who are no longer around to ask. You are Ada, the new developer who has just inherited it. Every terminal in the lessons is a recording of real commands run on this project, so every output you see is what really happened. To follow along on your own computer, install Git (on Windows it includes Git Bash, the terminal the recordings use), Node.js 24 and ripgrep (winget install BurntSushi.ripgrep.MSVC on Windows, brew install ripgrep on macOS, sudo apt install ripgrep on Ubuntu). In the terminal, type a command from the list under it, or pick one, and read what it prints.",
        terminalExercise: term("m1-first-look", {
          intro: "You have just cloned Kobo Market and opened a terminal in its folder.",
          goal: "Before reading any code, find out who has worked on this project and how many commits each person made.",
          accept: ["git shortlog -sn HEAD"],
          near: [
            { command: "git log --oneline | wc -l", why: "That counts all the commits (11), but not who made them. git shortlog groups commits by author." },
            { command: "ls", why: "ls shows the files in the folder, not the people who wrote them. History is in Git." },
          ],
          hint: "git shortlog summarises the history by author; -s counts, -n sorts by the count.",
          success: "Three developers: Tolu (5 commits), Amaka (3) and Chidi (3). When you have a question about part of the code, Git can tell you whose it was.",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 2 · 1.1 – 1.2
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ce-l2-ai-era",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 2,
    covers: ["1.1", "1.2"],
    title: "From Typing Every Line to Agents, and the Words for What You Manage",
    subtitle: "How development changed, and the vocabulary every later lesson uses",
    estimatedMinutes: 22,
    intro:
      "In ten years software development went from typing every line, to autocomplete, to chat assistants, to agents that edit many files and run commands on their own. What did not change is the thing being managed: a codebase made of repositories, applications, modules, components and dependencies.",

    atoms: [
      {
        id: "a-ce-manual-to-agentic",
        title: "From manual to AI-assisted and agentic development",
        explain:
          "There are four broad ways code gets written today, and most teams use all of them. Manual: a developer types every line. Autocomplete: the editor suggests the next line or block as you type (early GitHub Copilot). Chat assistant: you ask a question or request a change in a chat beside your code, and paste or apply what it suggests. Agent: you describe a task and an AI reads files, edits several of them, runs commands and tests, and reports back (Claude Code, OpenAI Codex, Cursor's agent mode, Copilot's coding agent). Each step up hands more of the typing to the machine, and makes the human's job more about direction and review.",
        table: {
          caption: "Who does what.",
          headers: ["Mode", "The AI", "The human"],
          rows: [
            ["Manual", "Nothing", "Designs, types, tests, reviews"],
            ["Autocomplete", "Suggests the next lines", "Accepts or rejects each suggestion"],
            ["Chat assistant", "Answers questions, proposes code", "Decides what to apply, and where"],
            ["Agent", "Reads, edits many files, runs commands", "Sets the task and limits, reviews every change"],
          ],
        },
        decision: {
          scenario: "An agent is asked to \"fix the failing test\". It reports success. The test now passes because the agent changed the test's expected value to match the wrong output.",
          question: "What does this show about agentic development?",
          options: [
            { id: "a", text: "The more an AI does on its own, the more the human's job is to review what it actually did, not what it says it did", why: "The agent achieved the literal goal (a passing test) by the wrong means. Only a human reviewing the diff would notice." },
            { id: "b", text: "Agents should never be used", whyWrong: "Agents save real time. The lesson is about oversight, not avoidance." },
            { id: "c", text: "The test was wrong anyway", whyWrong: "Nothing says so. Changing a test to match the code is how real bugs get hidden." },
            { id: "d", text: "This only happens with cheap AI tools", whyWrong: "Every current tool can do this. It is a property of delegating, not of one product." },
          ],
          correct: "a",
          aftermath: "Module 5 teaches you to read exactly what changed; Module 6 to delegate with review gates.",
        },
      },
      {
        id: "a-ce-vocabulary",
        title: "Codebase, repository, application, module, component, dependency",
        explain:
          "These words are used loosely, so it pays to be precise. A repository (repo) is a folder whose history is tracked by Git, usually one project. A codebase is all the code an organisation or product has, in one repository or many. An application is something that runs: Kobo Market has two, a browser app and an API server, living in one repository. A module is one file of code that exports things other files import (server/db/index.js is the data module). A component is a reusable piece of user interface (src/components/Navbar.jsx). A dependency is code your project uses but did not write, installed by a package manager (React, Vite).",
        table: {
          caption: "The words, as they apply to Kobo Market.",
          headers: ["Term", "Meaning", "In Kobo Market"],
          rows: [
            ["Repository", "A Git-tracked project folder", "kobo-market/"],
            ["Application", "Something that runs", "The React app, and the Node API"],
            ["Module", "One file that exports code", "server/db/index.js"],
            ["Component", "A reusable piece of interface", "src/components/ProductCard.jsx"],
            ["Dependency", "Someone else's code you install", "react, vite, eslint"],
          ],
        },
        decision: {
          scenario: "A colleague says: \"The login bug is in the auth dependency.\" You check, and the login code is in server/services/authService.js, written by Chidi, a former teammate.",
          question: "Is \"dependency\" the right word?",
          options: [
            { id: "a", text: "No: it is a module in this repository. A dependency is third-party code installed with npm, which you would fix very differently", why: "The difference matters: you can edit your own module, but a bug in a dependency means upgrading, patching or replacing someone else's package." },
            { id: "b", text: "Yes: anything about authentication is a dependency", whyWrong: "\"Dependency\" means external code your project installs, not a topic." },
            { id: "c", text: "Yes: every file depends on others, so every file is a dependency", whyWrong: "Files do depend on each other, but in a project the word means installed third-party packages." },
            { id: "d", text: "It does not matter which word is used", whyWrong: "It decides where you look and what you can change. Precise words save hours." },
          ],
          correct: "a",
          aftermath: "You will see the two kinds side by side in package.json, next.",
        },
      },
      {
        id: "a-ce-find-dependencies",
        title: "Seeing the dependencies for yourself",
        explain:
          "Every Node.js project lists its dependencies in package.json, in two groups: dependencies, needed when the application runs, and devDependencies, needed only to develop, test and build it. Other ecosystems have their own file (Python: pyproject.toml or requirements.txt; Java: pom.xml), but the idea is identical. Reading this one file tells you the project's main technologies in seconds.",
        terminalExercise: term("m1-first-look", {
          goal: "Find out which third-party libraries Kobo Market depends on, without opening any source code.",
          accept: ["cat package.json"],
          near: [
            { command: "cat README.md", why: "The README describes the stack in words, and might be out of date. package.json is what npm actually installs." },
            { command: "ls", why: "ls shows a node_modules folder, but not what is in it or why. The list of dependencies is in package.json." },
          ],
          hint: "The manifest that npm reads is package.json. Print it with cat.",
          success: "Runtime: react, react-dom and axios. Development: vite, eslint and friends. Keep axios in mind: you will find out in Module 4 whether anything uses it.",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 3 · 1.3 – 1.4
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ce-l3-ownership",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 3,
    covers: ["1.3", "1.4"],
    title: "Generation, Comprehension and Ownership; Source and Everything Else",
    subtitle: "Why writing code is not the same as owning it, and which files are really yours",
    estimatedMinutes: 22,
    intro:
      "A project folder holds thousands of files, and only a few dozen of them are the project. Learning to tell the source from the generated output and the installed dependencies is the first thing that makes a big folder feel small.",

    atoms: [
      {
        id: "a-ce-gen-comp-own",
        title: "Generation, comprehension and ownership",
        explain:
          "Code generation is producing code, by typing or by AI. Code comprehension is understanding what code does: being able to predict its behaviour, explain it, and find where something happens. Code ownership is being responsible for code over time: knowing why it is the way it is, keeping it working, reviewing changes to it, and fixing it when it breaks. AI has made generation almost free. It has not made comprehension or ownership free, and code that is generated faster than it is understood becomes code nobody can safely change.",
        decision: {
          scenario: "An AI agent generated a whole payment module in ten minutes. All tests pass. Your team lead asks: \"Who owns this?\"",
          question: "What is the honest answer, and what does it imply?",
          options: [
            { id: "a", text: "Whoever merges it owns it, so before merging they must understand what it does, review it and be able to maintain it", why: "The AI will not be paged at 2am when payments fail. Ownership belongs to a person, so comprehension has to come before the merge." },
            { id: "b", text: "The AI owns it, because the AI wrote it", whyWrong: "An AI cannot be responsible for production code. Someone on the team is." },
            { id: "c", text: "Nobody needs to own it, because the tests pass", whyWrong: "Tests show the cases someone thought of. Owning code means handling the cases nobody did." },
            { id: "d", text: "The tool vendor owns it", whyWrong: "Vendors' terms make clear that you are responsible for the code you ship." },
          ],
          correct: "a",
          aftermath: "Generation is the cheap step. This course is about the other two.",
        },
      },
      {
        id: "a-ce-source-vs-generated",
        title: "Source code versus generated code, build output and dependencies",
        explain:
          "Source code is what people (or AIs on their behalf) write and maintain: here, src/, server/ and tests/. Generated code is produced by a tool from something else, and is rebuilt rather than edited: dist/ is created by npm run build, data/kobo.json by npm run seed. Dependencies are installed into node_modules/ by npm install. Configuration is source too (package.json, vite.config.js), just a different kind. The quickest way to see the split is to compare the files Git tracks (the source, as the team decided) with every file in the folder.",
        terminalExercise: term("m1-artifacts", {
          intro: "The project has just been built with npm run build.",
          goal: "Find out how many files Git actually tracks in this project, to compare with every file in the folder.",
          accept: ["git ls-files | wc -l"],
          near: [
            { command: "find . -type f | wc -l", why: "That counts every file in the folder, over 2,000 of them, including node_modules, dist and Git's own files. The tracked source is far smaller. Ask Git with git ls-files." },
            { command: "ls node_modules | wc -l", why: "That counts installed packages (119), which are dependencies, not the project's source." },
          ],
          hint: "git ls-files lists the tracked files; pipe it into wc -l to count them.",
          success: "39 tracked files, out of more than 2,000 in the folder. About 98% of what is on disk is dependencies, build output and Git's own data. The project you have to understand is the 39.",
        }),
      },
      {
        id: "a-ce-gitignore-tells",
        title: "The .gitignore tells you what is generated",
        explain:
          "A project's .gitignore lists files Git must not track. It is written by the team, so it is a statement of what they consider not source: things that are generated (dist/), installed (node_modules/), local data (data/), secrets (.env) and logs. On an unfamiliar project, reading it is a two-second way to learn which folders you can ignore.",
        terminalExercise: term("m1-artifacts", {
          goal: "Find out which folders and files the team decided are NOT part of the source.",
          accept: ["cat .gitignore"],
          near: [
            { command: "ls dist dist/assets", why: "That shows what is inside dist, but not that it is generated. The team's decision is recorded in .gitignore." },
            { command: "ls", why: "ls lists everything; it does not say which items are source." },
          ],
          hint: "The file is called .gitignore, at the root of the project.",
          success: "node_modules (installed), dist (built), data (seeded), .env (secrets), logs. None of these is edited by hand, and none belongs in a commit.",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 4 · 1.5 – 1.6
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ce-l4-system",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 4,
    covers: ["1.5", "1.6"],
    title: "How the Parts Connect, and a Project's Lifecycle",
    subtitle: "Frontend, backend, API, database and services; developing, testing, building and deploying",
    estimatedMinutes: 24,
    intro:
      "Almost every web application has the same five parts and goes through the same four stages. Once you can name them, you can place any file in any project.",

    atoms: [
      {
        id: "a-ce-parts-connect",
        title: "Frontend, backend, APIs, databases and external services",
        explain:
          "The frontend is the code that runs in the user's browser (or phone) and draws the interface: Kobo Market's src/. The backend is code that runs on a server the user never sees: server/. They talk through an API (application programming interface), a set of URLs such as POST /api/login that accept requests and return responses, usually as JSON. The backend keeps data in a database (here, a JSON file standing in for one) and calls external services for things it does not do itself (Paystack, for payments). In development, Vite serves the frontend on port 5173 and forwards API requests to the backend on port 4000.",
        table: {
          caption: "Kobo Market's parts.",
          headers: ["Part", "Runs", "Where in the project"],
          rows: [
            ["Frontend", "In the browser", "src/ (React), index.html"],
            ["API", "On the server, answering URLs", "server/router.js, server/routes/"],
            ["Business logic", "On the server", "server/services/"],
            ["Data", "Stored on the server", "server/db/, data/kobo.json"],
            ["External service", "Someone else's servers", "server/payments/paystack.js → Paystack"],
          ],
        },
        terminalExercise: term("m1-lifecycle", {
          goal: "The frontend runs on port 5173 and the API on port 4000. Find the configuration that connects the two in development.",
          accept: ["cat vite.config.js"],
          near: [{ command: "npm run", why: "That lists the scripts that start each part, but the link between them is in Vite's configuration." }],
          hint: "The frontend is served by Vite. Its settings are in vite.config.js.",
          success: "The proxy line: every request the browser makes to /api is forwarded by Vite to http://localhost:4000. That one line is the bridge between frontend and backend.",
        }),
      },
      {
        id: "a-ce-lifecycle",
        title: "Development, testing, building and deployment",
        explain:
          "Code moves through four stages. Development: running it locally with fast feedback (npm run dev, npm start). Testing: running automated checks (npm test, npm run lint). Building: turning source into what will actually run in production, optimised and bundled (npm run build creates dist/). Deployment: putting the build on a server where users can reach it. In a Node project the commands for each stage are scripts in package.json, so npm run, with nothing after it, lists the project's whole lifecycle.",
        terminalExercise: term("m1-lifecycle", {
          goal: "List every script this project defines, to see how it is developed, tested and built.",
          accept: ["npm run"],
          near: [{ command: "cat vite.config.js", why: "That configures the dev server and build, but does not list the commands you run. npm run does." }],
          hint: "npm run with no script name lists all the scripts.",
          success: "dev and start (development), test and lint (testing), build and preview (building). There is no deploy script: deployment is done somewhere else, which you will investigate in Module 9.",
        }),
      },
      {
        id: "a-ce-lifecycle-stage",
        title: "Which stage is a problem in?",
        explain:
          "Naming the stage where something goes wrong halves the search. A problem in development shows in your terminal or browser as you work. A test failure is caught before anyone else sees it. A build failure stops a release from being produced at all. A deployment problem means the build exists but does not run correctly on the server. Each stage has its own logs and its own usual causes.",
        decision: {
          scenario: "On a Windows laptop, npm run dev, npm test and npm run build all work. The build on the team's Linux build server fails with \"Could not resolve './Navbar.jsx'\". In the repository the file is called navbar.jsx.",
          question: "Which stage has the problem, and why did the laptop not catch it?",
          options: [
            { id: "a", text: "The build, on a different machine: Linux file names are case-sensitive, so Navbar.jsx and navbar.jsx are different files there, while Windows treats them as the same", why: "The code is identical; the environment the build stage runs in is not. That is why builds are run on a clean server, not only on a laptop." },
            { id: "b", text: "Testing: the tests should have caught it", whyWrong: "The tests do not import Navbar, and on the laptop the import resolves anyway. Not every problem is reachable by every stage." },
            { id: "c", text: "Deployment: the server is broken", whyWrong: "Nothing has been deployed: the build never finished." },
            { id: "d", text: "Development: npm run dev is lying", whyWrong: "The dev server worked correctly for the laptop's file system. The two machines simply differ." },
          ],
          correct: "a",
          aftermath: "Case-sensitive file names are a classic \"works on my machine\" failure. Module 9 returns to environment differences.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 5 · 1.7 – 1.8
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ce-l5-debt-baseline",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 5,
    covers: ["1.7", "1.8"],
    title: "Technical Debt, and the Baseline Before You Change Anything",
    subtitle: "Spotting duplicated, abandoned and over-complicated code, and recording what works today",
    estimatedMinutes: 26,
    intro:
      "Every inherited project carries debt: shortcuts someone meant to fix later. Spotting it is a search skill, and the most important thing to record before you touch anything is what works right now.",

    atoms: [
      {
        id: "a-ce-tech-debt",
        title: "Recognising technical debt",
        explain:
          "Technical debt is the future cost of a shortcut taken now, like a loan: it was often the right call at the time, but the interest is paid every time someone has to work around it. It comes in recognisable forms: duplicated code (the same logic in two places, which will drift apart), unnecessary complexity (more layers or options than the problem needs), abandoned files (code nothing uses any more, which still misleads readers), and notes left for later (TODO and FIXME comments). The cheapest first look at a project's debt is to search for the notes developers left themselves.",
        terminalExercise: term("m1-debt", {
          goal: "Find every TODO or FIXME note the previous developers left in the code, with file names and line numbers.",
          accept: ['rg -n "TODO|FIXME"'],
          near: [{ command: "rg -l OldCheckout", why: "That finds one specific file. Search for the notes themselves: the words TODO and FIXME." }],
          hint: "rg (ripgrep) searches every file; -n adds line numbers; the pattern TODO|FIXME matches either word.",
          success: "Two notes. A FIXME on OldCheckout.jsx asking whether anything still uses it (an abandoned file?), and a TODO in ProductCard.jsx saying the price formatting should use a shared helper (duplication). Notice that ripgrep on Windows prints paths with backslashes, even in Git Bash.",
        }),
      },
      {
        id: "a-ce-duplication-spot",
        title: "Duplicated logic: the debt that causes bugs",
        explain:
          "Duplication is the most dangerous form of debt because it fails silently. Two copies of a rule start identical; one gets updated, the other does not, and nothing tells you. Searching for a constant's name across the whole project is the quickest way to see whether a rule lives in one place or several.",
        terminalExercise: term("m1-debt", {
          goal: "The delivery fee is ₦1,500. Find every place in the code where it is defined.",
          accept: ['rg -n "DELIVERY_FEE ="'],
          near: [{ command: 'rg -n "TODO|FIXME"', why: "The duplicated fee has no TODO next to it, which is exactly why duplication is dangerous. Search for the definition itself." }],
          hint: "Search for the constant's name followed by = to find where it is defined, not every place it is used.",
          success: "Defined twice: once on the server (server/services/orderService.js) and once in the cart page (src/pages/Cart.jsx). Two definitions of a business rule, in the frontend and the backend. Remember this: it is a real bug, and you will find it in Module 4.",
        }),
      },
      {
        id: "a-ce-baseline",
        title: "Establishing a baseline",
        explain:
          "Before you change an unfamiliar project, record its current state: is the working tree clean, which commit are you on, which versions of the tools are installed, do the tests pass, does lint pass, does it build and start. This is your baseline. Without it, when something fails after your change you cannot tell whether you broke it or it was already broken. With it, every later check has something to be compared against.",
        terminalExercise: term("m1-baseline", {
          goal: "Find out whether the project's automated tests pass right now, before you change anything.",
          accept: ["npm test"],
          near: [
            { command: "git status", why: "Status tells you the working tree is clean, which is part of the baseline, but not whether the code works. Run the tests." },
            { command: "npm run lint", why: "Lint checks style and some mistakes; it does not run the behaviour tests." },
          ],
          hint: "The test script is run with npm test.",
          success: "8 tests, 8 pass, 0 fail. Now you know: if a test fails after your change, your change caused it.",
        }),
      },
      {
        id: "a-ce-baseline-record",
        title: "What goes in the baseline record",
        explain:
          "A baseline is only useful if it is written down where you can find it later. Keep a short note with the date, the commit id, the tool versions and the result of each check, exactly as the tools reported it.",
        example: [
          "Baseline · Kobo Market",
          shown("m1-baseline", "git log -1 --format=\"%h %an %ad %s\" --date=short"),
          shown("m1-baseline", "node --version"),
          "$ git status  →  clean, up to date with origin/main",
          "$ npm test    →  8 tests, 8 pass, 0 fail",
          "$ npm run lint →  no problems",
        ].join("\n"),
        decision: {
          scenario: "You record a baseline: tests pass, lint passes. A week later, after your change, one test fails. A colleague says the test was always flaky.",
          question: "What does the baseline let you do?",
          options: [
            { id: "a", text: "Check out the baseline commit and run the tests again: if they pass there and fail on your change, your change is the cause", why: "The baseline gives you a known-good point to compare against, so the question becomes a fact rather than an opinion." },
            { id: "b", text: "Nothing: a baseline only records the past", whyWrong: "The point of recording the past is that you can return to it and compare." },
            { id: "c", text: "Prove your colleague wrong without running anything", whyWrong: "One passing run does not prove a test is not flaky. Re-run at the baseline to get evidence." },
            { id: "d", text: "Delete the failing test", whyWrong: "That hides a possible bug. The baseline is there so you can find out instead." },
          ],
          correct: "a",
          aftermath: "In Module 5 you will learn the Git commands that take you back to any commit in seconds.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 6 · 1.P
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ce-l6-report",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 6,
    covers: ["1.P"],
    title: "Practical: The One-Page Project Report",
    subtitle: "What it does, what it is built with, its parts, and what you still do not know",
    estimatedMinutes: 30,
    intro:
      "Your first deliverable on any inherited project is a one-page report. It forces you to look before you touch, and it is the document your manager, your client or your future self will want.",

    atoms: [
      {
        id: "a-ce-report-purpose",
        title: "Start with what the project says about itself",
        explain:
          "The README is the project's own description: what it is, how to run it, how it is organised. Read it first, but treat it as a claim to verify rather than the truth. READMEs are written once and rarely updated, so every statement in it is something to check against the code.",
        terminalExercise: term("m1-first-look", {
          goal: "Find the project's own description of what it does and how to run it.",
          accept: ["cat README.md"],
          near: [{ command: "cat package.json", why: "package.json lists what is installed. The human description of the project is in the README." }],
          hint: "The file at the root that describes the project, in Markdown.",
          success: "It describes the stack, a five-step local setup, a demo login and the scripts. Every one of those is a claim you can now check: you already verified the scripts (npm run) and the tests.",
        }),
      },
      {
        id: "a-ce-report-claims",
        title: "Verified, claimed and unknown",
        explain:
          "A good report separates three kinds of statement. Verified: you saw it yourself (\"8 tests pass, recorded on 20 October\"). Claimed: the README or a colleague says it, but you have not checked (\"payments work in production\"). Unknown: questions you cannot answer yet (\"is OldCheckout.jsx used anywhere?\"). The unknowns are the most valuable part, because they are your investigation plan for the next modules.",
        decision: {
          scenario: "Your draft report says: \"Payments: Paystack, works.\" You have read server/payments/paystack.js but never seen a payment succeed, and the local .env has no Paystack key.",
          question: "How should the report state it?",
          options: [
            { id: "a", text: "Claimed / unknown: \"Paystack integration exists (server/payments/paystack.js). Not verified: no key locally, payment is skipped without one. Need: test keys and a test transaction.\"", why: "It says exactly what you saw, what you did not, and what would settle it. Nobody reading it will be misled." },
            { id: "b", text: "Verified: \"Paystack works\"", whyWrong: "You have not seen it work. Reports that overstate are how teams ship broken payments with confidence." },
            { id: "c", text: "Leave payments out until you are sure", whyWrong: "Leaving it out hides the most important open question in the project." },
            { id: "d", text: "\"Payments are probably broken\"", whyWrong: "That is a guess the other way. State the evidence and the gap." },
          ],
          correct: "a",
          aftermath: "\"I don't know yet, and here is how I will find out\" is a professional answer.",
        },
      },
      {
        id: "a-ce-report-shape",
        title: "The shape of the report",
        explain:
          "Keep it to one page so it gets read. Five headings are enough: Purpose (one paragraph), Stack (languages, frameworks, key dependencies, with versions), Components (the major parts and the folder each lives in), Current state (your baseline), and Open questions (what still needs investigation, most important first).",
        example:
          "# Kobo Market: project report\n\nPurpose: online market for small traders; browse, sign in, cart, Paystack checkout.\n\nStack: React 18 + Vite 8 (src/); Node 24 API, no framework (server/);\n       JSON file data store (data/kobo.json); node:test; ESLint 9.\n\nComponents: UI pages and components (src/pages, src/components); API routes\n       (server/router.js, server/routes/); auth (server/services/authService.js);\n       orders and totals (server/services/orderService.js); payments (server/payments/).\n\nCurrent state (20 Oct): main @ 222c42e, clean; 8/8 tests pass; lint clean.\n\nOpen questions:\n 1. Delivery fee defined twice (Cart.jsx and orderService.js): do they agree?\n 2. Is OldCheckout.jsx used? (FIXME says maybe not)\n 3. Is axios used? It is a dependency.\n 4. Paystack never verified locally.",
        decision: {
          scenario: "Your manager has five minutes to read your report before a meeting.",
          question: "Which open question should be listed first?",
          options: [
            { id: "a", text: "The delivery fee defined in two places, because if they disagree customers may be shown one total and charged another", why: "Order open questions by risk to users and the business. A wrong total at checkout is more urgent than an unused file." },
            { id: "b", text: "Whether OldCheckout.jsx is used", whyWrong: "Worth knowing, but an unused file costs confusion, not money." },
            { id: "c", text: "Whether axios is used", whyWrong: "An unused dependency is minor debt." },
            { id: "d", text: "The order does not matter", whyWrong: "With five minutes, the first item may be the only one read." },
          ],
          correct: "a",
          aftermath: "Put the risk to real users first.",
        },
      },
    ],

    task: {
      title: "Module practical: the one-page project report",
      intro:
        "Choose a real application you did not write, or wrote long ago: a client's project, a former teammate's, or a small open-source app from GitHub. Clone it, and produce a one-page report.",
      prompts: [
        "Purpose: what the application does, in one paragraph, from its README and from what you can see it do.",
        "Stack: languages, frameworks and key dependencies with versions, read from its manifest (package.json, pyproject.toml, pom.xml).",
        "Components: the major parts and the folder each lives in, from the folder structure.",
        "Current state: your baseline (commit, tool versions, whether it installs, starts, passes tests and lint), exactly as the tools reported it.",
        "Open questions: at least five things you could not determine yet, ordered by risk, each marked verified, claimed or unknown where it applies.",
      ],
      closing: "Next module: the terminal, where you will learn to answer most of those questions without opening a single file.",
    },
    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
