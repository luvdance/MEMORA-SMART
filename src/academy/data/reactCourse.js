/**
 * REACT DEVELOPMENT
 *
 * Authored from the Memora Smart Technologies React curriculum: sixteen
 * modules over sixteen weeks, from the web platform React is built on
 * (Module 0) to a deployed, tested, production-ready application (Module 15).
 * It is the course reserved as WD-201, the step after Responsive Web
 * Development (WD-101), and it follows React's modern, Hooks-first approach
 * with the official documentation (react.dev) as its reference: function
 * components only, Vite rather than Create React App, React Router, Vitest
 * and React Testing Library.
 *
 * Course content is DATA, never markup, in exactly the shape of the other
 * courses, so the catalog, sidebar, player, progress engine and stats band
 * render it without a change.
 *
 * ── THE PRACTICE IS BUILDING REACT APPS ──────────────────────────────────
 * Every lesson from Module 1 on contains a `webLab` that is a real Vite
 * project: index.html loading /src/main.jsx, components in src/, CSS and
 * CSS Modules, libraries imported by name. The React lab runtime
 * (src/academy/react/labRuntimeEntry.js, bundled into public/lab/) compiles
 * and runs it in the sandboxed preview with React 19 in development mode, so
 * learners see React's real warnings, Strict Mode and all. Checks click,
 * type and read the rendered page; test-writing labs run the learner's
 * Vitest-style tests and then run them again against a deliberately broken
 * component, to prove the tests would catch a real bug. `npm run
 * validate:content` loads every lab in headless Chrome: its model answer
 * must pass and its starter must fail.
 *
 * ── THE CURRICULUM TABLE ─────────────────────────────────────────────────
 * `curriculum` on each module is the source document's topic list, numbered
 * as it is there (Module 0 is 0.1 to 0.6), with N.P for the module's
 * practical assignment and `checkpoint` holding its mastery checkpoint. Every
 * lesson declares the numbers it `covers`, and `npm run test:academy` fails
 * if any topic is not taught.
 */

export const REACT_COURSE = {
  id: "react",
  slug: "react",
  title: "React Development",
  subtitle: "Modern, Hooks-first React from foundations to production",
  tagline:
    "Build real React applications the way professional teams do: components, state, Hooks, routing, APIs, TypeScript, testing and deployment.",
  description:
    "Sixteen weeks from the web platform React is built on to a deployed, tested, production-ready application. You start by making sure HTML, CSS and modern JavaScript are solid, then learn why React exists and build with it from the first week: JSX and components, props and composition, rendering lists and handling events, state and the rendering model, forms and validation, Hooks and side effects, and the architecture of larger apps with Context, reducers and Zustand. Then real applications: React Router for multi-page apps, REST APIs and TanStack Query for server data, professional styling with CSS Modules and Tailwind, and TypeScript for type-safe components. The course ends with what makes software production-ready: authentication and frontend security, testing with Vitest and React Testing Library, performance and accessibility, and Git, CI and deployment. Every lesson makes you build: you edit a real React project and your app is checked in a real browser before you move on. Follows the official React documentation's modern, Hooks-first approach.",

  status: "live",
  level: "Intermediate → Job-ready",
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
      id: "react",
      name: "React 19 & Hooks",
      short: "React",
      blurb: "Components, props, state, effects, Context and reducers, Hooks-first.",
      icon: "fab fa-react",
      accent: "#0891b2",
    },
    {
      id: "vite",
      name: "Vite, npm & React Router",
      short: "Vite",
      blurb: "A modern build setup, client-side routing and multi-page apps.",
      icon: "fas fa-bolt",
      accent: "#7c3aed",
    },
    {
      id: "data",
      name: "APIs, TanStack Query & TypeScript",
      short: "Data",
      blurb: "Server data, caching, type-safe components and API responses.",
      icon: "fas fa-database",
      accent: "#1d4ed8",
    },
    {
      id: "quality",
      name: "Testing, performance & deployment",
      short: "Production",
      blurb: "Vitest, React Testing Library, Playwright, profiling, CI and Vercel.",
      icon: "fas fa-rocket",
      accent: "#0f766e",
    },
  ],

  outcomes: [
    "Explain how React works: components, rendering, state as a snapshot and why the interface updates",
    "Create React projects with Vite and organise them into small, reusable, well-named components",
    "Render dynamic lists and conditional content, and handle clicks, typing and form submission",
    "Manage state correctly: immutable updates, lifting state up, reducers, Context and Zustand",
    "Build validated, accessible forms and synchronise components with APIs using effects and TanStack Query",
    "Build multi-page applications with React Router: nested layouts, dynamic routes and protected sections",
    "Style responsive, accessible, themeable interfaces with CSS Modules and Tailwind CSS",
    "Write type-safe React with TypeScript, and test it with Vitest and React Testing Library",
    "Measure and improve performance, and deploy a production application with Git, CI and Vercel",
  ],

  audience: [
    "Graduates of Responsive Web Development (WD-101) ready for their first framework",
    "JavaScript developers who have used React from tutorials and want to understand it properly",
    "Developers moving from class components or Create React App to modern React",
    "Anyone heading for a front-end or full-stack developer role",
  ],

  requirements: [
    "A laptop or desktop computer (Windows, macOS or Linux)",
    "A stable internet connection",
    "Permission to install free software: VS Code, Node.js and Git",
    "HTML, CSS and JavaScript basics. Module 0 checks and fills the gaps; WD-101 is the full preparation",
  ],

  /** Four phases; `weeks` are module orders. */
  phases: [
    { phase: 1, title: "Foundations and the first React apps", weeks: [1, 2, 3, 4] },
    { phase: 2, title: "State, forms, Hooks and architecture", weeks: [5, 6, 7, 8] },
    { phase: 3, title: "Real applications: routing, data, styling and TypeScript", weeks: [9, 10, 11, 12] },
    { phase: 4, title: "Production: security, testing, performance and deployment", weeks: [13, 14, 15, 16] },
  ],

  months: [
    /* ═══════════════════════ PHASE 1 ═══════════════════════ */
    {
      month: 1,
      title: "Phase 1 · Foundations and the First React Apps",
      focus: "Foundation",
      summary:
        "Make the web platform solid, then build with React from the first week: Vite, JSX, components, props, lists and events.",
      modules: [
        {
          id: "rx-m0-foundations",
          order: 1,
          phase: 1,
          week: "Week 1",
          title: "Module 0 · Web Development Foundations",
          summary:
            "The technologies React builds upon: how the web works, HTML, CSS, JavaScript from variables to modules, asynchronous code and the developer's tools.",
          objective: "Understand the technologies React builds upon.",
          atoms: 27,
          topics: [
            "How the web works",
            "HTML and CSS essentials",
            "JavaScript fundamentals",
            "Modern JavaScript: callbacks, promises and fetch",
            "Developer tools",
          ],
          curriculum: [
            ["0.0", "Welcome: the course, what you will build, and how you will work"],
            ["0.1", "How the web works: browser, server, HTTP, and how code becomes a page"],
            ["0.2", "HTML essentials: semantic, accessible page structure and forms"],
            ["0.3", "CSS essentials: the box model, Flexbox, Grid and responsive layouts"],
            ["0.4", "JavaScript fundamentals: values to modules, array methods and the DOM"],
            ["0.5", "Modern JavaScript: arrow functions, callbacks, promises, async/await and fetch"],
            ["0.6", "Developer tools: VS Code, DevTools, the terminal, npm and Git"],
            ["0.P", "Practical: a responsive student profile page rendered from a JavaScript array"],
          ],
          project:
            "Build a responsive student profile page that displays a list of courses from a JavaScript array.",
          checkpoint:
            "The student can explain functions, objects, arrays, callbacks, and asynchronous JavaScript without relying on memorized definitions.",
        },
        {
          id: "rx-m1-intro",
          order: 2,
          phase: 1,
          week: "Week 2",
          title: "Module 1 · Introduction to React and the Development Environment",
          summary:
            "Why React exists, declarative UI, single-page apps, a Vite project and its files, JSX and its rules, createRoot, React Developer Tools and Strict Mode.",
          objective: "Understand why React exists and create a working React application.",
          atoms: 13,
          topics: [
            "What React is and the problems it solves",
            "Declarative UI, SPAs and components",
            "Vite projects, package.json, dev server and build",
            "JSX and its rules",
            "createRoot, React DevTools and Strict Mode",
          ],
          curriculum: [
            ["1.1", "What React is and what problems it solves"],
            ["1.2", "Declarative UI versus manually manipulating the DOM"],
            ["1.3", "Single-page applications and component-based architecture"],
            ["1.4", "Creating a React project with Vite"],
            ["1.5", "Understanding the project structure and package.json"],
            ["1.6", "Starting the development server and building for production"],
            ["1.7", "JSX syntax and the relationship between JSX and JavaScript"],
            ["1.8", "Embedding JavaScript expressions in JSX"],
            ["1.9", "JSX rules: single parent, fragments, attributes, and expressions"],
            ["1.10", "Rendering React applications with createRoot"],
            ["1.11", "React Developer Tools and browser debugging"],
            ["1.12", "Understanding development mode and Strict Mode"],
            ["1.P", "Practical: a personal portfolio homepage with React and Vite"],
          ],
          project: "Build a simple personal portfolio homepage using React and Vite.",
          checkpoint:
            "The student can create a project, explain its major files, modify the UI, and run it locally.",
        },
        {
          id: "rx-m2-components",
          order: 3,
          phase: 1,
          week: "Week 3",
          title: "Module 2 · Components, Props and Reusable UI",
          summary:
            "Function components, naming and files, imports and exports, composition, props and defaults, children, separating data from presentation, and configurable components.",
          objective: "Learn how to divide an interface into small, reusable building blocks.",
          atoms: 13,
          topics: [
            "Function components, naming and files",
            "Importing, exporting and nesting components",
            "Props, defaults and children",
            "Data versus presentation, reusable UI",
            "Component responsibilities and composition",
          ],
          curriculum: [
            ["2.1", "Functional components"],
            ["2.2", "Component naming conventions and file organization"],
            ["2.3", "Importing and exporting components"],
            ["2.4", "Nesting components and composing layouts"],
            ["2.5", "Props: passing data from parent to child"],
            ["2.6", "Destructuring props and setting defaults"],
            ["2.7", "The children prop and reusable layout components"],
            ["2.8", "Separating data from presentation"],
            ["2.9", "Reusable buttons, cards, navigation bars, and page headers"],
            ["2.10", "Component responsibilities and avoiding oversized components"],
            ["2.11", "Component composition versus unnecessary duplication"],
            ["2.12", "Rendering different content through configurable components"],
            ["2.P", "Practical: a reusable course catalogue"],
          ],
          project:
            "Build a reusable course catalogue containing course cards, instructors, descriptions, and enrollment buttons.",
          checkpoint:
            "Students can design a component tree and explain how data flows from parent components to child components.",
        },
        {
          id: "rx-m3-rendering",
          order: 4,
          phase: 1,
          week: "Week 4",
          title: "Module 3 · Rendering Data and Handling Events",
          summary:
            "Lists with map() and keys, conditional rendering, empty states, click, input and submit events, event objects and arguments, and the mistakes to avoid.",
          objective: "Make interfaces respond to data and user actions.",
          atoms: 11,
          topics: [
            "Lists, map() and keys",
            "Conditional rendering and empty states",
            "Event handlers, event objects and arguments",
            "Updating the UI, badges and status indicators",
            "Common rendering and event mistakes",
          ],
          curriculum: [
            ["3.1", "Rendering arrays with map()"],
            ["3.2", "Understanding the purpose of the key prop"],
            ["3.3", "Conditional rendering with if, ternaries, and logical operators"],
            ["3.4", "Showing empty states and fallback content"],
            ["3.5", "Handling clicks, form submissions, and input events"],
            ["3.6", "Understanding event handlers and event objects"],
            ["3.7", "Passing arguments to event handlers"],
            ["3.8", "Updating UI based on user actions"],
            ["3.9", "Rendering badges, notifications, and status indicators"],
            ["3.10", "Avoiding common rendering and event-handling mistakes"],
            ["3.P", "Practical: an interactive course catalogue with filters, search and enrollment"],
          ],
          project:
            "Create an interactive course catalogue with category filters, search, and enrollment status.",
          checkpoint:
            "Students can render dynamic lists, handle events, and explain why React updates the interface when the underlying data changes.",
        },
      ],
    },

    /* ═══════════════════════ PHASE 2 ═══════════════════════ */
    {
      month: 2,
      title: "Phase 2 · State, Forms, Hooks and Architecture",
      focus: "Core React",
      summary:
        "The ideas that make React applications work: state and rendering, forms, effects and Hooks, and organising larger apps.",
      modules: [
        {
          id: "rx-m4-state",
          order: 5,
          phase: 2,
          week: "Week 5",
          title: "Module 4 · State and the React Rendering Model",
          summary:
            "useState, why updates render, state as a snapshot, queued and functional updates, immutable arrays and objects, lifting state, controlled components, identity and resets.",
          objective: "Understand the central idea that makes interactive React applications work.",
          atoms: 14,
          topics: [
            "What state is and useState",
            "Renders, snapshots and queued updates",
            "Immutable updates to arrays and objects",
            "Lifting state up and controlled components",
            "Identity, resets and avoiding redundant state",
          ],
          curriculum: [
            ["4.1", "What state represents and when it is necessary"],
            ["4.2", "The useState Hook"],
            ["4.3", "Updating state correctly"],
            ["4.4", "Why state updates trigger renders"],
            ["4.5", "State as a snapshot and queued updates"],
            ["4.6", "Functional state updates"],
            ["4.7", "Immutable updates to arrays and objects"],
            ["4.8", "Avoiding direct state mutation"],
            ["4.9", "Sharing state between components by lifting it up"],
            ["4.10", "Controlled components and derived values"],
            ["4.11", "Resetting state and preserving component identity"],
            ["4.12", "Avoiding duplicated or unnecessary state"],
            ["4.13", "Understanding render cycles and component re-renders"],
            ["4.P", "Practical: a task manager with add, edit, complete, delete and filter"],
          ],
          project: "Build a task manager with add, edit, complete, delete, and filter functionality.",
          checkpoint: "Students can trace a state update and predict how it affects the rendered interface.",
        },
        {
          id: "rx-m5-forms",
          order: 6,
          phase: 2,
          week: "Week 6",
          title: "Module 5 · Forms, Validation and User Input",
          summary:
            "Controlled inputs of every kind, multiple fields, submission, validation rules and field errors, duplicate submissions, async states, accessible forms, reusable fields and Zod.",
          objective: "Build reliable forms that collect and validate user information.",
          atoms: 13,
          topics: [
            "Controlled inputs, selects, checkboxes and radios",
            "Multiple fields and submission",
            "Validation rules and field-level errors",
            "Submission states and duplicate submissions",
            "Accessible, reusable forms and Zod",
          ],
          curriculum: [
            ["5.1", "Controlled inputs and text areas"],
            ["5.2", "Select boxes, checkboxes, and radio buttons"],
            ["5.3", "Managing multiple fields"],
            ["5.4", "Handling form submission"],
            ["5.5", "Required fields and custom validation rules"],
            ["5.6", "Displaying field-level error messages"],
            ["5.7", "Validating email, password, and confirmation fields"],
            ["5.8", "Preventing duplicate submissions"],
            ["5.9", "Loading, success, and failure states"],
            ["5.10", "Accessible labels, keyboard navigation, and error announcements"],
            ["5.11", "Reusable form components"],
            ["5.12", "Introduction to schema-based validation libraries such as Zod"],
            ["5.P", "Practical: a student registration form with validation and a student list"],
          ],
          project:
            "Build a student registration form with validation, confirmation feedback, and a student list.",
          checkpoint:
            "Students can implement a form that handles invalid input, successful submission, and clear user feedback.",
        },
        {
          id: "rx-m6-hooks",
          order: 7,
          phase: 2,
          week: "Week 7",
          title: "Module 6 · React Hooks and Side Effects",
          summary:
            "The Rules of Hooks, useReducer, useEffect and external systems, dependencies and cleanup, fetching with race conditions handled, useRef, custom Hooks, and when not to use an effect.",
          objective: "Understand Hooks and use them correctly.",
          atoms: 15,
          topics: [
            "Rules of Hooks and useReducer",
            "useEffect, dependencies and cleanup",
            "Fetching data and race conditions",
            "useRef and custom Hooks",
            "Unnecessary effects and memoization",
          ],
          curriculum: [
            ["6.1", "Rules of Hooks"],
            ["6.2", "useState recap and useReducer fundamentals"],
            ["6.3", "The purpose of useEffect"],
            ["6.4", "Synchronizing components with external systems"],
            ["6.5", "Dependency arrays and effect execution"],
            ["6.6", "Cleanup functions and subscriptions"],
            ["6.7", "Fetching data and managing request lifecycles"],
            ["6.8", "Handling loading, empty, and error states"],
            ["6.9", "Preventing stale requests and handling race conditions"],
            ["6.10", "useRef for DOM references and mutable values"],
            ["6.11", "Creating custom Hooks to reuse logic"],
            ["6.12", "Common useEffect mistakes and when an effect is unnecessary"],
            ["6.13", "Introduction to useMemo and useCallback"],
            ["6.14", "Understanding why premature memoization can complicate code"],
            ["6.P", "Practical: a searchable user directory powered by an API"],
          ],
          project: "Build a weather dashboard or searchable user directory powered by an external API.",
          checkpoint:
            "Students can explain the difference between state, refs, rendering, and side effects, and can fetch data with proper error handling.",
        },
        {
          id: "rx-m7-architecture",
          order: 8,
          phase: 2,
          week: "Week 8",
          title: "Module 7 · Component Architecture and State Management",
          summary:
            "Hierarchies and boundaries, presentational and logic components, prop drilling, Context, reducers, Context with useReducer, state shape, UI versus server state, and Zustand.",
          objective: "Organize larger applications without creating confusing data flows.",
          atoms: 14,
          topics: [
            "Hierarchy, boundaries and component roles",
            "Lifting state, prop drilling and Context",
            "Reducers, actions and Context with useReducer",
            "State shape, UI state and server data",
            "Choosing local state, Context or Zustand",
          ],
          curriculum: [
            ["7.1", "Component hierarchy and application boundaries"],
            ["7.2", "Presentational and logic-oriented components"],
            ["7.3", "Lifting state versus sharing state globally"],
            ["7.4", "Prop drilling: what it is and when it becomes a problem"],
            ["7.5", "Context API with createContext and useContext"],
            ["7.6", "Reducers and action-based state transitions"],
            ["7.7", "Combining Context and useReducer"],
            ["7.8", "Designing a sensible state shape"],
            ["7.9", "Separating UI state from server data"],
            ["7.10", "Custom Hooks for shared business logic"],
            ["7.11", "Choosing local state, Context, or a dedicated state library"],
            ["7.12", "Introduction to Redux Toolkit or Zustand"],
            ["7.13", "Avoiding unnecessary global state"],
            ["7.P", "Practical: a shopping cart with shared state, subtotals and persistence"],
          ],
          project:
            "Build a shopping cart with product quantities, subtotal calculations, cart persistence, and shared cart state.",
          checkpoint:
            "Students can justify where state belongs and choose a suitable state-management approach for a given application.",
        },
      ],
    },

    /* ═══════════════════════ PHASE 3 ═══════════════════════ */
    {
      month: 3,
      title: "Phase 3 · Real Applications",
      focus: "Applications",
      summary:
        "Multi-page apps with React Router, real server data, professional styling and type safety with TypeScript.",
      modules: [
        {
          id: "rx-m8-routing",
          order: 9,
          phase: 3,
          week: "Week 9",
          title: "Module 8 · Routing and Multi-Page Application Structure",
          summary:
            "Client-side routing with React Router: routes and pages, links and active states, dynamic parameters, search params, nested layouts, not-found pages, protected sections and navigation after submit.",
          objective: "Build React applications with multiple URLs and navigation flows.",
          atoms: 14,
          topics: [
            "Why client-side routing, and setting up React Router",
            "Routes, links and active navigation",
            "Dynamic parameters and search params",
            "Nested routes, layouts and not-found pages",
            "Protected sections and navigation flows",
          ],
          curriculum: [
            ["8.1", "Why client-side routing is needed"],
            ["8.2", "Installing and configuring React Router"],
            ["8.3", "Defining routes and page components"],
            ["8.4", "Navigation with links and active navigation states"],
            ["8.5", "Dynamic route parameters"],
            ["8.6", "Query strings and URL search parameters"],
            ["8.7", "Nested routes and shared layouts"],
            ["8.8", "Route parameters and detail pages"],
            ["8.9", "Not-found pages and fallback routes"],
            ["8.10", "Protected layouts and authentication-aware navigation"],
            ["8.11", "URL-based filtering and pagination"],
            ["8.12", "Navigation after form submissions"],
            ["8.13", "Organizing public and private application sections"],
            ["8.P", "Practical: a mini learning platform with five routed sections"],
          ],
          project:
            "Create a mini learning platform with a homepage, course catalogue, course details, student dashboard, and profile page.",
          checkpoint:
            "Students can implement nested routes, dynamic URLs, shared layouts, and a consistent navigation experience.",
        },
        {
          id: "rx-m9-apis",
          order: 10,
          phase: 3,
          week: "Week 10",
          title: "Module 9 · Working with APIs and Server Data",
          summary:
            "REST, fetch and JSON, every HTTP method, headers and bodies, API service modules, environment variables, search and pagination, tokens and expired sessions, Axios, TanStack Query and CORS.",
          objective: "Connect React interfaces to backend services and real-world data.",
          atoms: 14,
          topics: [
            "REST, fetch, JSON and HTTP methods",
            "Headers, bodies and request states",
            "API services and environment variables",
            "Tokens, failed requests and expired sessions",
            "Axios, TanStack Query and CORS",
          ],
          curriculum: [
            ["9.1", "Understanding REST APIs, endpoints, HTTP methods, and status codes"],
            ["9.2", "Using fetch() and understanding JSON"],
            ["9.3", "GET, POST, PUT, PATCH, and DELETE requests"],
            ["9.4", "Handling headers, request bodies, and response parsing"],
            ["9.5", "Loading, success, empty, and error states"],
            ["9.6", "Separating API services from UI components"],
            ["9.7", "Environment variables and configuration"],
            ["9.8", "Search, sorting, filtering, and pagination"],
            ["9.9", "Authentication tokens and request authorization"],
            ["9.10", "Handling expired sessions and failed requests"],
            ["9.11", "Introduction to Axios and TanStack Query"],
            ["9.12", "Caching, refetching, invalidation, and optimistic updates"],
            ["9.13", "Understanding CORS and why browser requests sometimes fail"],
            ["9.P", "Practical: a product management dashboard with full CRUD"],
          ],
          project:
            "Build a product management dashboard that retrieves, creates, updates, and deletes products using an API.",
          checkpoint:
            "Students can integrate an API without putting all request logic directly inside UI components.",
        },
        {
          id: "rx-m10-styling",
          order: 11,
          phase: 3,
          week: "Week 11",
          title: "Module 10 · Styling and Professional Interface Development",
          summary:
            "CSS and CSS Modules, responsive mobile-first layouts, design tokens and theming, conditional classes, Tailwind CSS, component libraries, modals, tabs, skeletons and toasts, accessibility, dark mode and Figma.",
          objective: "Build attractive, responsive, and accessible user interfaces.",
          atoms: 15,
          topics: [
            "CSS, CSS Modules and scoped styles",
            "Responsive, mobile-first layouts",
            "Design tokens, variables, themes and dynamic classes",
            "Tailwind CSS and component libraries",
            "Interactive UI, loading states, accessibility and dark mode",
          ],
          curriculum: [
            ["10.1", "Styling with regular CSS and CSS modules"],
            ["10.2", "Component-scoped styling strategies"],
            ["10.3", "Responsive layouts using Flexbox and Grid"],
            ["10.4", "Mobile-first design and media queries"],
            ["10.5", "Reusable design tokens, colors, spacing, and typography"],
            ["10.6", "CSS variables and theme switching"],
            ["10.7", "Conditional classes and dynamic styling"],
            ["10.8", "Integrating Tailwind CSS"],
            ["10.9", "Using component libraries such as shadcn/ui or Material UI"],
            ["10.10", "Responsive navigation, modals, dropdowns, and tabs"],
            ["10.11", "Skeleton loaders, empty states, and toast notifications"],
            ["10.12", "Accessible color contrast, focus states, and keyboard interactions"],
            ["10.13", "Dark mode and persisted user preferences"],
            ["10.14", "Translating a Figma design into React components"],
            ["10.P", "Practical: a professional dashboard with desktop and mobile layouts"],
          ],
          project:
            "Recreate a professional dashboard from a design reference, with desktop and mobile layouts.",
          checkpoint:
            "Students can transform a static design into a responsive, reusable React interface without sacrificing accessibility.",
        },
        {
          id: "rx-m11-typescript",
          order: 12,
          phase: 3,
          week: "Week 12",
          title: "Module 11 · TypeScript with React",
          summary:
            "Why TypeScript, types, unions, interfaces and aliases, typed props, children, events and Hooks, API responses, generics, discriminated unions, typed Context, narrowing, and converting a project.",
          objective: "Introduce type safety and practices used in maintainable React codebases.",
          atoms: 15,
          topics: [
            "Why TypeScript; types, unions, interfaces and aliases",
            "Typing props, children and events",
            "Typing Hooks and API responses",
            "Generics, discriminated unions and typed Context",
            "Narrowing, avoiding any and converting a project",
          ],
          curriculum: [
            ["11.1", "Why TypeScript is useful"],
            ["11.2", "Basic types, arrays, objects, and unions"],
            ["11.3", "Interfaces and type aliases"],
            ["11.4", "Typing component props"],
            ["11.5", "Typing children and event handlers"],
            ["11.6", "Typing useState, useReducer, and useRef"],
            ["11.7", "Optional props and default values"],
            ["11.8", "Typing API responses"],
            ["11.9", "Reusable generic components and Hooks"],
            ["11.10", "Discriminated unions for loading, success, and error states"],
            ["11.11", "Typing Context providers"],
            ["11.12", "Understanding TypeScript errors and narrowing types"],
            ["11.13", "Avoiding unnecessary use of any"],
            ["11.14", "Converting an existing JavaScript React project to TypeScript"],
            ["11.P", "Practical: the product dashboard converted to TypeScript"],
          ],
          project:
            "Convert the API-powered product dashboard into a TypeScript project with properly typed components and API responses.",
          checkpoint:
            "Students can write type-safe components and model the different states of asynchronous data.",
        },
      ],
    },

    /* ═══════════════════════ PHASE 4 ═══════════════════════ */
    {
      month: 4,
      title: "Phase 4 · Production",
      focus: "Production",
      summary:
        "What turns an app that works into software a team can ship: security, testing, performance, accessibility and deployment.",
      modules: [
        {
          id: "rx-m12-auth",
          order: 13,
          phase: 4,
          week: "Week 13",
          title: "Module 12 · Authentication and Application Security",
          summary:
            "Authentication versus authorization, account flows, auth providers, sessions and tokens, protected and role-aware routes, expired sessions, XSS and safe rendering, the limits of frontend security, secrets and testing auth.",
          objective:
            "Build authentication-aware interfaces while understanding the security boundaries of frontend applications.",
          atoms: 15,
          topics: [
            "Authentication, authorization and account flows",
            "Providers, sessions and tokens",
            "Protected routes, roles and expired sessions",
            "Safe rendering, XSS and the limits of frontend security",
            "Secrets, profiles and testing auth",
          ],
          curriculum: [
            ["12.1", "Authentication versus authorization"],
            ["12.2", "Registration, login, logout, and password-reset flows"],
            ["12.3", "Connecting React to an authentication provider or backend"],
            ["12.4", "Session persistence and token handling"],
            ["12.5", "Protected routes and role-aware interfaces"],
            ["12.6", "Displaying permissions and access-denied states"],
            ["12.7", "Handling expired sessions"],
            ["12.8", "Input validation and safe rendering"],
            ["12.9", "Cross-site scripting (XSS) risks"],
            ["12.10", "Why frontend route protection is not backend security"],
            ["12.11", "Secure session design and the trade-offs of cookies versus browser storage"],
            ["12.12", "Environment variables and avoiding exposed secrets"],
            ["12.13", "Managing user profiles and account settings"],
            ["12.14", "Testing authentication flows"],
            ["12.P", "Practical: an authentication-enabled student portal"],
          ],
          project:
            "Build an authentication-enabled student portal with registration, login, profile management, and protected dashboard pages.",
          checkpoint:
            "Students understand how the frontend participates in authentication and why the backend must enforce access permissions.",
        },
        {
          id: "rx-m13-testing",
          order: 14,
          phase: 4,
          week: "Week 14",
          title: "Module 13 · Testing and Debugging React Applications",
          summary:
            "DevTools and stack traces, unit tests with Vitest, component tests with React Testing Library, interactions, async states, mocked APIs, routing, integration and end-to-end tests, coverage, flaky tests, ESLint, Prettier and CI.",
          objective: "Ensure that applications behave correctly and remain maintainable as they grow.",
          atoms: 15,
          topics: [
            "Debugging, stack traces and common errors",
            "Unit tests and component tests",
            "Interactions, async states and mocked APIs",
            "Routing, integration and end-to-end tests",
            "Coverage, flaky tests, linting and CI",
          ],
          curriculum: [
            ["13.1", "Debugging with browser DevTools and React Developer Tools"],
            ["13.2", "Reading stack traces and diagnosing common errors"],
            ["13.3", "Unit testing pure JavaScript functions"],
            ["13.4", "Component testing with React Testing Library"],
            ["13.5", "Testing user interactions and form validation"],
            ["13.6", "Testing asynchronous loading and error states"],
            ["13.7", "Mocking API requests"],
            ["13.8", "Testing routing and navigation"],
            ["13.9", "Integration tests across multiple components"],
            ["13.10", "End-to-end testing with Playwright"],
            ["13.11", "Understanding test coverage and its limitations"],
            ["13.12", "Identifying flaky tests"],
            ["13.13", "Linting and formatting with ESLint and Prettier"],
            ["13.14", "Continuous integration fundamentals"],
            ["13.P", "Practical: tests for a form, filters, a cart and API errors"],
          ],
          project:
            "Write tests for the registration form, product filters, shopping cart, and API error handling.",
          checkpoint:
            "Students can write meaningful tests that verify user-visible behavior rather than implementation details.",
        },
        {
          id: "rx-m14-performance",
          order: 15,
          phase: 4,
          week: "Week 15",
          title: "Module 14 · Performance, Accessibility and Production Readiness",
          summary:
            "Rendering and re-rendering, measuring first, the Profiler, memo, useMemo and useCallback, lazy loading and code splitting, images and long lists, network requests, accessibility, Core Web Vitals, error boundaries and production builds.",
          objective:
            "Move beyond applications that merely work to applications that are efficient and reliable.",
          atoms: 16,
          topics: [
            "Re-rendering, measuring and the Profiler",
            "Memoization with memo, useMemo and useCallback",
            "Lazy loading, code splitting, images and lists",
            "Accessibility and Core Web Vitals",
            "Error boundaries, builds and deployment troubleshooting",
          ],
          curriculum: [
            ["14.1", "Understanding rendering and re-rendering"],
            ["14.2", "Measuring performance before optimizing"],
            ["14.3", "Avoiding unnecessary state and effects"],
            ["14.4", "Using React Profiler and browser performance tools"],
            ["14.5", "Memoization with memo, useMemo, and useCallback"],
            ["14.6", "Lazy loading and code splitting"],
            ["14.7", "Route-level loading strategies"],
            ["14.8", "Optimizing images and large lists"],
            ["14.9", "Preventing unnecessary network requests"],
            ["14.10", "Web accessibility fundamentals and semantic HTML"],
            ["14.11", "Keyboard navigation and screen-reader considerations"],
            ["14.12", "Core Web Vitals and perceived performance"],
            ["14.13", "Error boundaries and graceful failure handling"],
            ["14.14", "Production builds and bundle inspection"],
            ["14.15", "Environment configuration and deployment troubleshooting"],
            ["14.P", "Practical: audit and improve an existing React application"],
          ],
          project:
            "Audit and improve the performance, accessibility, and loading experience of an existing React application.",
          checkpoint:
            "Students can identify performance bottlenecks, explain their fixes, and verify that the application remains functional.",
        },
        {
          id: "rx-m15-deployment",
          order: 16,
          phase: 4,
          week: "Week 16",
          title: "Module 15 · Deployment, Git and Professional Workflows",
          summary:
            "Git and GitHub, pull requests and commit messages, dependencies and scripts, production configuration, Vercel and Netlify, domains and HTTPS, SPA rewrites, CI/CD, monitoring, READMEs, code review and your portfolio.",
          objective: "Prepare students to collaborate on real projects and publish their work.",
          atoms: 15,
          topics: [
            "Git, GitHub and pull requests",
            "Dependencies, scripts and production configuration",
            "Deploying to Vercel or Netlify: domains, HTTPS, variables and rewrites",
            "CI/CD and monitoring production",
            "READMEs, code review, teamwork and your portfolio",
          ],
          curriculum: [
            ["15.1", "Git repositories, commits, branches, and merges"],
            ["15.2", "GitHub workflows and pull requests"],
            ["15.3", "Writing useful commit messages and documentation"],
            ["15.4", "Managing dependencies and package scripts"],
            ["15.5", "Production builds and environment-specific configuration"],
            ["15.6", "Deploying frontend applications to Vercel or Netlify"],
            ["15.7", "Configuring custom domains and HTTPS"],
            ["15.8", "Environment variables in hosting platforms"],
            ["15.9", "Configuring SPA rewrites for client-side routing"],
            ["15.10", "CI/CD fundamentals"],
            ["15.11", "Monitoring errors and debugging production issues"],
            ["15.12", "Writing a clear README and installation instructions"],
            ["15.13", "Code review, task tracking, and team collaboration"],
            ["15.14", "Building a portfolio and presenting technical decisions"],
            ["15.P", "Practical: deploy a complete React application with its source and setup instructions"],
          ],
          project:
            "Deploy a complete React application, configure its production environment, and publish its source code with setup instructions.",
          checkpoint:
            "A reviewer can clone the repository, understand the project, run it locally, and access the deployed application.",
        },
      ],
    },
  ],

  certificate: {
    issuer: "Memora Smart Technologies",
    name: "React Development",
    covers: "Components & state • Hooks & forms • Routing & server data • Styling & TypeScript • Security, testing, performance & deployment",
    idFormat: "MST-CERT-2026-000001",
    requirements: [
      "Complete every required lesson",
      "Pass every lesson check at 70% or above",
      "Complete the practical assignment that ends each module",
      "Pass the final certification exam: 70% overall and at least 50% in every section",
    ],
  },

  checkpoints: [
    {
      afterMonth: 1,
      title: "Phase 1 checkpoint",
      format: "An interactive course catalogue built from reusable components, with filters, search and enrollment status.",
      passMark: 70,
    },
    {
      afterMonth: 2,
      title: "Phase 2 checkpoint",
      format: "A shopping cart with shared state, correct immutable updates, validated input and persisted data.",
      passMark: 70,
    },
    {
      afterMonth: 3,
      title: "Phase 3 checkpoint",
      format: "A routed, styled, type-safe product dashboard that reads and writes a real API.",
      passMark: 70,
    },
    {
      afterMonth: 4,
      title: "Final",
      format: "A deployed, tested, accessible React application that a reviewer can clone, run and understand.",
      passMark: 70,
    },
  ],
};

/** Every module id, in teaching order. The validator and tests read this. */
export const REACT_MODULE_IDS = REACT_COURSE.months.flatMap((m) => m.modules.map((mod) => mod.id));

export default REACT_COURSE;
