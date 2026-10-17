/**
 * OBJECT ORIENTED PROGRAMMING (JAVASCRIPT)
 *
 * Authored from the Memora Smart Technologies curriculum: seven phases over
 * sixteen weeks, starting with programming itself and ending with a deployed
 * React application.
 *
 * Course content is DATA, never markup. This object mirrors the shape of
 * dataAnalysisCourse.js and cybersecurityCourse.js exactly, so the catalog,
 * the curriculum sidebar, the lesson player, the progress engine and the stats
 * band render it without a single change.
 *
 *   courses/{courseId}
 *     └── modules/{moduleId}          one module per WEEK
 *           └── lessons/{lessonId}    two or three curriculum topics
 *                 └── atoms/{atomId}  one idea each
 *
 * ── WHY THE FIRST TWO WEEKS HAVE NO JAVASCRIPT ───────────────────────────
 * The commonest way to fail at programming is to memorise syntax without the
 * logic underneath it. So Phase 1 teaches algorithms, pseudocode, flowcharts,
 * decomposition and dry-running before a single line of JavaScript, and the
 * Week 2 assessment must be passed before Week 3 opens. That ordering is the
 * course's design, not an introduction to skim.
 *
 * ── EVERY ATOM IS A-T-O-M ────────────────────────────────────────────────
 * The same model as the Mathematics course, adapted for code:
 *
 *   Anchor    the idea stated plainly (`explain`, a `table` when there are
 *             rules to set side by side)
 *   Trace     a worked example: real code and the output it really prints
 *             (`code`), or a dry-run table (`trace`) for the logic weeks
 *   Operate   a graded practice that must be got right before the atom can
 *             be left (`codeExercise` — predict the output — or `decision`)
 *   Master    the lesson check, graded on the server
 *
 * Every snippet in this course is RUN by `npm run validate:content`, in Node,
 * and its real output compared with what the lesson claims. A beginner cannot
 * tell when a tutorial is wrong about what code prints, so this one is not
 * allowed to be.
 *
 * ── WHY "OBJECT ORIENTED" ────────────────────────────────────────────────
 * The thread through the course is modelling the world as objects with state
 * and behaviour. It starts informally in Week 8 (objects, methods), becomes
 * explicit in Week 13 (classes, prototypes, inheritance, encapsulation), is
 * how components are reasoned about in Week 15, and the capstone is assessed
 * on it. The weeks before that are the foundations it stands on.
 *
 * ── THE CURRICULUM TABLE ─────────────────────────────────────────────────
 * `curriculum` on each module is the lesson table from the source document,
 * numbered exactly as it is there. Every lesson declares which numbers it
 * `covers`, and `npm run test:academy` fails if any number in the table is
 * not taught, so the course cannot quietly drop a topic.
 */

export const JAVASCRIPT_COURSE = {
  id: "javascript",
  slug: "javascript",
  title: "Object Oriented Programming (JavaScript)",
  subtitle: "Logic first, then JavaScript to React",
  tagline:
    "Learn to think like a programmer before you write a line, then build all the way to a deployed, object-oriented web application.",
  description:
    "A sixteen-week programme in seven phases. You start with what a program actually is: algorithms, pseudocode, flowcharts and dry-run tables, so the logic is solid before any syntax arrives. Then JavaScript itself, from variables to closures, objects, classes and inheritance; the browser, the DOM, events and storage; promises, async/await and real APIs; and finally the professional toolchain and React. Every code example is run and verified, every lesson ends with a check you must pass, and the course finishes with a capstone you deploy and defend. No prior programming experience required.",

  status: "live", // "live" | "coming-soon" | "draft"
  level: "Absolute beginner → Job-ready",
  durationMonths: 4,
  hoursPerWeek: "8–12",
  language: "English",
  instructor: {
    name: "Memora Smart Academy",
    role: "Industry-led curriculum",
  },

  access: {
    accessType: "free",
    price: 0,
    currency: "NGN",
    enrollmentStatus: "open",
  },

  tools: [
    {
      id: "logic",
      name: "Pseudocode & flowcharts",
      short: "Logic",
      blurb: "Algorithms, dry-run tables and decomposition, before any syntax.",
      icon: "fas fa-diagram-project",
      accent: "#7c3aed",
    },
    {
      id: "javascript",
      name: "JavaScript & Node.js",
      short: "JavaScript",
      blurb: "The language, properly: types, functions, closures, objects and classes.",
      icon: "fab fa-js",
      accent: "#b45309",
    },
    {
      id: "browser",
      name: "The DOM & browser APIs",
      short: "Browser",
      blurb: "Events, forms, localStorage, fetch and the developer tools.",
      icon: "fas fa-window-maximize",
      accent: "#1d4ed8",
    },
    {
      id: "toolchain",
      name: "Git, npm, Vite & React",
      short: "Toolchain",
      blurb: "Version control, packages, a modern build and component-based UI.",
      icon: "fab fa-react",
      accent: "#0e7490",
    },
  ],

  outcomes: [
    "Break any problem into an algorithm, write it as pseudocode and a flowchart, and dry-run it before coding",
    "Write clear, correct JavaScript with variables, types, operators, conditions, loops and functions",
    "Model data with arrays, objects, Sets and Maps, and transform it with map, filter and reduce",
    "Explain scope, hoisting, closures, references and the call stack, and debug with breakpoints",
    "Design object-oriented code with classes, constructors, prototypes, inheritance and encapsulation",
    "Build interactive browser applications with the DOM, events, forms, validation and localStorage",
    "Load data from real APIs with fetch, promises and async/await, handling loading and error states",
    "Ship a React application with Git, npm and Vite, deployed and defended as a portfolio piece",
  ],

  audience: [
    "Complete beginners who have never written a line of code",
    "Learners who tried a tutorial and memorised syntax without understanding it",
    "Students heading into computer science or software engineering",
    "Career switchers aiming for a first developer role",
  ],

  requirements: [
    "A laptop or desktop computer (Windows, macOS or Linux). A phone is enough for Weeks 1 and 2 only",
    "A stable internet connection",
    "Permission to install free software: VS Code, Node.js and Git",
    "No prior programming experience",
  ],

  /**
   * The seven phases of the source curriculum. The months below group weeks
   * for the sidebar; `phase` on each module is the curriculum's own grouping.
   */
  phases: [
    { phase: 1, title: "Understand programming before JavaScript", weeks: [1, 2] },
    { phase: 2, title: "JavaScript fundamentals", weeks: [3, 4, 5] },
    { phase: 3, title: "Functions and data structures", weeks: [6, 7, 8] },
    { phase: 4, title: "How JavaScript behaves", weeks: [9] },
    { phase: 5, title: "JavaScript in the browser", weeks: [10, 11] },
    { phase: 6, title: "APIs and advanced JavaScript", weeks: [12, 13] },
    { phase: 7, title: "Professional development and React", weeks: [14, 15, 16] },
  ],

  months: [
    {
      month: 1,
      title: "Thinking Like a Programmer",
      focus: "Beginner",
      summary:
        "Phase 1 and the start of Phase 2. What programming is, how to design logic on paper, and then your first JavaScript: variables, types and operators.",
      modules: [
        {
          id: "js-w1-foundations",
          order: 1,
          phase: 1,
          title: "Week 1 · The Foundation of Everything",
          summary:
            "What a program is and why code works, before any syntax: algorithms, pseudocode, flowcharts and decomposition.",
          atoms: 19,
          topics: [
            "What programming is, and what a program is",
            "Input, processing and output",
            "Source code, compilers and interpreters",
            "Algorithms and pseudocode",
            "Flowcharts: sequence, decisions and repetition",
            "Decomposition, computational thinking and debugging",
          ],
          curriculum: [
            ["1.1", "What is programming? What is a program?"],
            ["1.2", "How computers process instructions: input, processing, output"],
            ["1.3", "Programming languages, source code, compilers and interpreters"],
            ["1.4", "Algorithms: breaking problems into steps"],
            ["1.5", "Pseudocode: writing program logic in plain English"],
            ["1.6", "Flowcharts: sequence, decisions and repetition"],
            ["1.7", "Decomposition: breaking large problems into small tasks"],
            ["1.8", "Introduction to computational thinking and debugging"],
          ],
          project: "Design the logic for a student grade calculator using pseudocode and a flowchart.",
        },
        {
          id: "js-w2-logic",
          order: 2,
          phase: 1,
          title: "Week 2 · Programming Logic & Problem-Solving",
          summary:
            "Sequence, selection and iteration; variables and constants; and the dry-run table that finds a logic error before a computer does.",
          atoms: 14,
          topics: [
            "Sequence, selection and iteration",
            "Variables, constants and storing information",
            "Arithmetic and logical reasoning",
            "Tracing algorithms with a dry-run table",
            "Finding and correcting logical errors",
          ],
          curriculum: [
            ["2.1", "Sequence: executing instructions in order"],
            ["2.2", "Selection: making decisions"],
            ["2.3", "Iteration: repeating instructions"],
            ["2.4", "Variables and the idea of storing information"],
            ["2.5", "Constants and changing versus fixed values"],
            ["2.6", "Basic arithmetic and logical reasoning"],
            ["2.7", "Tracing algorithms manually with a dry-run table"],
            ["2.8", "Finding logical errors and correcting them"],
          ],
          project:
            "Five everyday problems: develop an algorithm, write pseudocode and explain your reasoning before moving into JavaScript.",
        },
        {
          id: "js-w3-intro",
          order: 3,
          phase: 2,
          title: "Week 3 · Introduction to JavaScript",
          summary:
            "Where JavaScript runs, setting up VS Code and Node.js, and your first statements, variables and output.",
          atoms: 21,
          topics: [
            "What JavaScript is and where it runs",
            "VS Code, the browser console and Node.js",
            "Statements, expressions, comments and readable code",
            "let, const and var",
            "Naming conventions",
            "Output with console.log() and basic input",
          ],
          curriculum: [
            ["3.1", "What JavaScript is and where it is used"],
            ["3.2", "Setting up VS Code and running JavaScript"],
            ["3.3", "Browser console and Node.js basics"],
            ["3.4", "JavaScript syntax, statements and expressions"],
            ["3.5", "Comments, indentation and readable code"],
            ["3.6", "Variables: let, const and var"],
            ["3.7", "Naming conventions and identifiers"],
            ["3.8", "Output using console.log()"],
            ["3.9", "Basic input using browser prompts and Node.js alternatives"],
          ],
          project: "Personal information and introduction generator.",
        },
        {
          id: "js-w4-types",
          order: 4,
          phase: 2,
          title: "Week 4 · Data Types & Operators",
          summary:
            "The primitive types, every operator a beginner needs, precedence, coercion and template literals.",
          atoms: 15,
          topics: [
            "Primitive types: strings, numbers, booleans, undefined and null",
            "typeof",
            "Arithmetic, assignment, comparison and logical operators",
            "Operator precedence",
            "Type conversion and coercion",
            "Template literals",
          ],
          curriculum: [
            ["4.1", "Primitive data types"],
            ["4.2", "Strings and numbers"],
            ["4.3", "Booleans, undefined and null"],
            ["4.4", "typeof and type inspection"],
            ["4.5", "Arithmetic operators"],
            ["4.6", "Assignment and comparison operators"],
            ["4.7", "Logical operators: &&, ||, !"],
            ["4.8", "Operator precedence"],
            ["4.9", "Type conversion and coercion"],
            ["4.10", "Template literals and string interpolation"],
          ],
          project: "Shopping cost calculator: subtotal, discount, tax and final price.",
        },
      ],
    },
    {
      month: 2,
      title: "Control, Functions & Data",
      focus: "Beginner → Intermediate",
      summary:
        "The end of Phase 2 and all of Phase 3. Decisions and loops, functions as reusable logic, and the data structures every real program is built on: arrays, strings and objects.",
      modules: [
        {
          id: "js-w5-control",
          order: 5,
          phase: 2,
          title: "Week 5 · Conditional Statements & Loops",
          summary:
            "if, else, switch and the ternary; truthy and falsy; for, while and do…while; break, continue and nested loops.",
          atoms: 19,
          topics: [
            "Boolean expressions and if / else if / else",
            "Nested conditions",
            "Truthy and falsy values, and the ternary operator",
            "switch statements",
            "for, while and do…while",
            "break, continue and nested loops",
          ],
          curriculum: [
            ["5.1", "Boolean expressions and comparisons"],
            ["5.2", "if, else if and else"],
            ["5.3", "Nested conditions"],
            ["5.4", "Truthy and falsy values"],
            ["5.5", "The ternary operator"],
            ["5.6", "switch statements"],
            ["5.7", "The for loop"],
            ["5.8", "while and do...while"],
            ["5.9", "break and continue"],
            ["5.10", "Nested loops and loop tracing"],
          ],
          project:
            "Grade classifier, even/odd checker, multiplication table, number guessing game and an ATM menu simulator.",
        },
        {
          id: "js-w6-functions",
          order: 6,
          phase: 3,
          title: "Week 6 · Functions & Reusable Logic",
          summary:
            "Declarations, parameters, return versus console.log, scope, expressions, arrows, defaults and your first callbacks.",
          atoms: 18,
          topics: [
            "Why functions exist",
            "Declarations, parameters and arguments",
            "return versus console.log()",
            "Function scope",
            "Function expressions, arrow functions and default parameters",
            "Callbacks, and breaking problems into functions",
          ],
          curriculum: [
            ["6.1", "Why functions exist"],
            ["6.2", "Function declarations"],
            ["6.3", "Parameters and arguments"],
            ["6.4", "The return statement versus console.log()"],
            ["6.5", "Function scope and local variables"],
            ["6.6", "Function expressions"],
            ["6.7", "Arrow functions"],
            ["6.8", "Default parameters"],
            ["6.9", "Callback function introduction"],
            ["6.10", "Breaking problems into reusable functions"],
          ],
          project: "A calculator with separate functions for addition, subtraction, multiplication and division.",
        },
        {
          id: "js-w7-arrays-strings",
          order: 7,
          phase: 3,
          title: "Week 7 · Arrays & Strings",
          summary:
            "Your first data structure: creating, indexing, changing and looping arrays, slice versus splice, string methods and grids.",
          atoms: 17,
          topics: [
            "What data structures are",
            "Creating, indexing and updating arrays",
            "push, pop, shift and unshift",
            "slice() versus splice()",
            "Looping through arrays",
            "String methods, split and join",
            "Multidimensional arrays and classic problems",
          ],
          curriculum: [
            ["7.1", "What data structures are"],
            ["7.2", "Creating arrays and accessing elements"],
            ["7.3", "Indexes, length and updating elements"],
            ["7.4", "Adding and removing elements with push, pop, shift and unshift"],
            ["7.5", "slice() versus splice()"],
            ["7.6", "Looping through arrays"],
            ["7.7", "String methods and searching strings"],
            ["7.8", "Splitting and joining strings"],
            ["7.9", "Multidimensional arrays"],
            ["7.10", "Common array and string problems"],
          ],
          project: "Student score analyser, word counter and shopping list manager.",
        },
        {
          id: "js-w8-objects",
          order: 8,
          phase: 3,
          title: "Week 8 · Objects & Modern JavaScript",
          summary:
            "Objects and methods, destructuring, spread and rest, the array methods that return something, and Sets and Maps.",
          atoms: 20,
          topics: [
            "Objects, properties and methods",
            "Dot versus bracket notation",
            "Nested objects and arrays of objects",
            "Destructuring, spread and rest",
            "forEach, map, filter, find and reduce",
            "some, every and sort",
            "Sets, Maps and choosing the right structure",
          ],
          curriculum: [
            ["8.1", "Objects and key-value pairs"],
            ["8.2", "Properties and methods"],
            ["8.3", "Dot notation versus bracket notation"],
            ["8.4", "Nested objects and arrays of objects"],
            ["8.5", "Object destructuring"],
            ["8.6", "Spread and rest syntax"],
            ["8.7", "Array methods: forEach() and map()"],
            ["8.8", "filter(), find() and reduce()"],
            ["8.9", "some(), every() and sort()"],
            ["8.10", "Sets, maps and choosing the right data structure"],
          ],
          project: "Student records manager that stores, searches, filters and summarises student results.",
        },
      ],
    },
    {
      month: 3,
      title: "How JavaScript Behaves, and the Browser",
      focus: "Intermediate",
      summary:
        "Phases 4, 5 and the start of 6. What really happens when code runs, then the browser: the DOM, events, forms and storage, and finally data from real APIs.",
      modules: [
        {
          id: "js-w9-scope-debugging",
          order: 9,
          phase: 4,
          title: "Week 9 · Scope, Execution & Debugging",
          summary:
            "Scope, hoisting and the temporal dead zone, the call stack, closures, references, equality, and a real debugger.",
          atoms: 18,
          topics: [
            "Global, function, block and lexical scope",
            "Hoisting and the temporal dead zone",
            "The call stack and execution contexts",
            "Closures and higher-order functions",
            "Pass-by-value and object references",
            "== versus ===",
            "Errors, and debugging with breakpoints",
          ],
          curriculum: [
            ["9.1", "Global, function and block scope"],
            ["9.2", "Lexical scope"],
            ["9.3", "Hoisting and the temporal dead zone"],
            ["9.4", "The call stack and execution contexts"],
            ["9.5", "Closures"],
            ["9.6", "Higher-order functions"],
            ["9.7", "Pass-by-value and object references"],
            ["9.8", "Equality: == versus ==="],
            ["9.9", "Common runtime, syntax and logic errors"],
            ["9.10", "Debugging with breakpoints and the VS Code debugger"],
          ],
          project:
            "Refactor the student records manager into small, reusable functions, then debug a deliberately broken version.",
        },
        {
          id: "js-w10-dom",
          order: 10,
          phase: 5,
          title: "Week 10 · DOM Manipulation",
          summary:
            "The page as a tree of objects: selecting, reading, changing, creating and removing elements, safely.",
          atoms: 14,
          topics: [
            "What the DOM is",
            "querySelector() and related methods",
            "Reading and changing text and HTML",
            "Styles and CSS classes",
            "Creating, appending, removing and traversing",
            "Dynamic lists, and textContent versus innerHTML",
          ],
          curriculum: [
            ["10.1", "What the DOM is"],
            ["10.2", "Selecting elements with querySelector() and related methods"],
            ["10.3", "Reading and changing text and HTML"],
            ["10.4", "Modifying styles and CSS classes"],
            ["10.5", "Creating, appending and removing elements"],
            ["10.6", "Traversing the DOM"],
            ["10.7", "Updating lists dynamically"],
            ["10.8", "Safe text rendering and textContent versus innerHTML"],
          ],
          project: "An interactive task manager with add, edit, delete and completion features.",
        },
        {
          id: "js-w11-events-storage",
          order: 11,
          phase: 5,
          title: "Week 11 · Events, Forms & Browser Storage",
          summary:
            "Listeners and event objects, form validation, bubbling and delegation, localStorage and JSON, devtools and accessibility.",
          atoms: 17,
          topics: [
            "Event listeners, event objects and targets",
            "Click, input, submit and keyboard events",
            "Form handling, validation and preventDefault()",
            "Bubbling and delegation",
            "localStorage, JSON and saving application state",
            "Browser developer tools",
            "Accessible interactive elements",
          ],
          curriculum: [
            ["11.1", "Event listeners"],
            ["11.2", "Event objects and event targets"],
            ["11.3", "Click, input, submit and keyboard events"],
            ["11.4", "Form handling and validation"],
            ["11.5", "preventDefault() and default browser behavior"],
            ["11.6", "Event bubbling and delegation"],
            ["11.7", "localStorage and JSON serialization"],
            ["11.8", "Saving and restoring application state"],
            ["11.9", "Browser developer tools"],
            ["11.10", "Accessibility considerations for interactive elements"],
          ],
          project:
            "A persistent to-do application with search, filters, form validation and saved tasks.",
        },
        {
          id: "js-w12-apis",
          order: 12,
          phase: 6,
          title: "Week 12 · Working with Data & APIs",
          summary:
            "HTTP and JSON, promises and their states, async/await, fetch, status codes, loading and error states, and keeping secrets secret.",
          atoms: 17,
          topics: [
            "What APIs are, and HTTP basics",
            "JSON and parsing data",
            "Promises, .then(), .catch() and .finally()",
            "async and await",
            "fetch() and HTTP status codes",
            "Loading, success and error states",
            "API keys and protecting secrets",
          ],
          curriculum: [
            ["12.1", "What APIs are and why applications use them"],
            ["12.2", "HTTP basics and request methods"],
            ["12.3", "JSON and parsing data"],
            ["12.4", "Promises and promise states"],
            ["12.5", ".then(), .catch() and .finally()"],
            ["12.6", "async and await"],
            ["12.7", "The fetch() API"],
            ["12.8", "HTTP status codes and response handling"],
            ["12.9", "Loading, success and error states"],
            ["12.10", "API keys, environment variables and protecting secrets"],
          ],
          project: "A weather application or searchable data dashboard using a public API.",
        },
      ],
    },
    {
      month: 4,
      title: "Object-Oriented Design, Tooling & React",
      focus: "Professional",
      summary:
        "The end of Phase 6 and all of Phase 7. Classes, prototypes and object-oriented design; the professional toolchain; React; and a capstone you deploy and defend.",
      modules: [
        {
          id: "js-w13-advanced",
          order: 13,
          phase: 6,
          title: "Week 13 · Advanced Language Concepts & OOP",
          summary:
            "Modules, classes, prototypes, inheritance and encapsulation; errors; iterators, regular expressions, dates and timers; testing and the event loop.",
          atoms: 26,
          topics: [
            "ES modules: import and export",
            "Classes, constructors and instances",
            "Prototypes and inheritance",
            "Encapsulation and object-oriented design",
            "try / catch / finally and custom errors",
            "Iterators, generators and regular expressions",
            "Dates, timers and internationalisation",
            "Unit testing, and the event loop",
          ],
          curriculum: [
            ["13.1", "ES modules: import and export"],
            ["13.2", "Classes, constructors and instances"],
            ["13.3", "Prototypes and inheritance"],
            ["13.4", "Encapsulation and object-oriented design"],
            ["13.5", "Error handling with try, catch and finally"],
            ["13.6", "Throwing custom errors"],
            ["13.7", "Iterators and generators (introduction)"],
            ["13.8", "Regular expressions"],
            ["13.9", "Dates, timers and internationalization"],
            ["13.10", "Unit testing and test-driven problem-solving"],
            ["13.EL", "The event loop, microtasks and the task queue"],
          ],
          project:
            "Rebuild the student records manager as classes with encapsulated state, custom errors and unit tests.",
        },
        {
          id: "js-w14-tooling",
          order: 14,
          phase: 7,
          title: "Week 14 · Development Tools & Code Quality",
          summary:
            "Git and GitHub, Node and npm, package.json, Vite, modular architecture, linting, configuration, security and deployment.",
          atoms: 15,
          topics: [
            "Git, commits and branches",
            "GitHub repositories",
            "Node.js, npm and package.json",
            "Vite and modern project setup",
            "Code organisation, linting and formatting",
            "Environment configuration and basic security",
            "Deployment and troubleshooting",
          ],
          curriculum: [
            ["14.1", "Git and version control"],
            ["14.2", "GitHub repositories, commits and branches"],
            ["14.3", "Node.js and npm fundamentals"],
            ["14.4", "package.json and dependencies"],
            ["14.5", "Vite and modern project setup"],
            ["14.6", "Code organization and modular architecture"],
            ["14.7", "Linting, formatting and readable code"],
            ["14.8", "Environment configuration and secrets"],
            ["14.9", "Basic security practices"],
            ["14.10", "Deployment and troubleshooting"],
          ],
          project: "Move your to-do application into a Vite project under Git, linted, and deployed.",
        },
        {
          id: "js-w15-react",
          order: 15,
          phase: 7,
          title: "Week 15 · Introduction to React",
          summary:
            "Components and JSX, props, state, events, lists and keys, conditional rendering, controlled forms and effects.",
          atoms: 16,
          topics: [
            "Why component-based UI exists",
            "React with Vite, components and JSX",
            "Props and composition",
            "State with useState()",
            "Events, lists, keys and conditional rendering",
            "Controlled forms",
            "useEffect() and data fetching",
          ],
          curriculum: [
            ["15.1", "Why component-based UI development exists"],
            ["15.2", "Setting up React with Vite"],
            ["15.3", "Components and JSX"],
            ["15.4", "Props and component composition"],
            ["15.5", "State with useState()"],
            ["15.6", "Event handling in React"],
            ["15.7", "Rendering lists and using keys"],
            ["15.8", "Conditional rendering"],
            ["15.9", "Forms and controlled inputs"],
            ["15.10", "Effects with useEffect() and basic data fetching"],
          ],
          project: "Rebuild the to-do application in React with controlled forms and saved state.",
        },
        {
          id: "js-w16-capstone",
          order: 16,
          phase: 7,
          type: "capstone",
          title: "Week 16 · Capstone Project",
          summary:
            "One complete application, built with everything in the course, version-controlled, deployed and defended.",
          atoms: 11,
          topics: [
            "Choosing and scoping a capstone you can finish",
            "Object-oriented design of the data layer",
            "Data handling, validation and error states",
            "GitHub history and a README that explains the work",
            "Deployment, and defending your decisions",
          ],
          curriculum: [
            ["16.1", "Choosing and scoping the capstone"],
            ["16.2", "Designing the data model and architecture"],
            ["16.3", "A working interface with appropriate data handling"],
            ["16.4", "Form validation and error states"],
            ["16.5", "GitHub version control and a deployed version"],
          ],
          project:
            "Student dashboard, expense tracker, product catalogue, task manager or API-powered dashboard: working UI, data handling, validation, error states, Git history and a live deployment.",
        },
      ],
    },
  ],

  capstone: {
    title: "A Complete, Deployed Application",
    summary:
      "Choose one: a student management dashboard, an expense tracker with charts, a product catalogue with search and filtering, a task manager with persistent data, or an API-powered information dashboard. Whichever you pick, it is designed with objects and classes, built in React with Vite, kept in Git from the first commit, and deployed where anyone can use it.",
    deliverables: [
      "A working interface that a stranger can use without instructions",
      "Appropriate data handling: a modelled data layer, saved or fetched data",
      "Form validation and visible loading, empty and error states",
      "A GitHub repository with a meaningful commit history and a README",
      "A deployed version at a public URL",
      "A short walkthrough explaining one design decision and one bug you fixed",
    ],
  },

  certificate: {
    issuer: "Memora Smart Technologies",
    name: "Object Oriented Programming (JavaScript)",
    covers: "Programming logic • JavaScript • Browser & APIs • OOP • React",
    idFormat: "MST-CERT-2026-000001",
    requirements: [
      "Complete every required lesson",
      "Pass every required assessment at 70% or above",
      "Pass all four monthly checkpoints",
      "Complete and deploy the capstone",
    ],
  },

  checkpoints: [
    {
      afterMonth: 1,
      title: "Month 1 checkpoint",
      format:
        "Five everyday problems solved as algorithm, pseudocode and dry-run table, then a JavaScript shopping calculator.",
      passMark: 70,
    },
    {
      afterMonth: 2,
      title: "Month 2 checkpoint",
      format: "The student records manager: arrays of objects searched, filtered and summarised.",
      passMark: 70,
    },
    {
      afterMonth: 3,
      title: "Month 3 checkpoint",
      format: "A persistent, validated to-do application, then an API dashboard with real error states.",
      passMark: 70,
    },
    {
      afterMonth: 4,
      title: "Final",
      format: "The deployed capstone, assessed against the deliverables above.",
      passMark: 70,
    },
  ],
};

/** Every module id, in teaching order. The validator and tests read this. */
export const JAVASCRIPT_MODULE_IDS = JAVASCRIPT_COURSE.months.flatMap((m) =>
  m.modules.map((mod) => mod.id)
);

export default JAVASCRIPT_COURSE;
