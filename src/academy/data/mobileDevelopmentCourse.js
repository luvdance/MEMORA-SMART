/**
 * MOBILE APP DEVELOPMENT
 *
 * Authored from the Memora Smart Technologies mobile app development
 * curriculum: twelve phases over twenty-four weeks, from what a mobile app is
 * (Module 1) to a capstone app built, tested and released to Android and iOS
 * testers (Module 21). Its stack is the one Expo recommends for new apps in
 * October 2026: React Native 0.88 through Expo SDK 58, TypeScript, Expo
 * Router, EAS Build, EAS Submit and EAS Update, with Jest, React Native
 * Testing Library and Maestro for testing.
 *
 * Course content is DATA, never markup, in exactly the shape of the other
 * courses, so the catalog, sidebar, player, progress engine and stats band
 * render it without a change.
 *
 * ── THE PRACTICE IS BUILDING APPS ON A PHONE ─────────────────────────────
 * From Module 3 on, almost every lesson contains a `webLab` that is a real
 * Expo project: app.json, package.json and routes in src/app/, exactly as
 * `npx create-expo-app` lays them out. The practice phone
 * (src/academy/native/, bundled into public/lab/native-runtime.js) runs it
 * with the real Expo Router on react-native-web, as an iPhone or an Android
 * phone, with the device simulated: safe areas and a keyboard that covers
 * inputs, permission prompts the user can refuse, photos with real sizes,
 * GPS, notifications, SecureStore, a real SQLite engine, the Android back
 * button and app restarts. Checks press, type and read the screen.
 * `npm run validate:content` loads every lab in headless Chrome (its model
 * answer must pass, its starter must fail) and type-checks every model
 * answer against the real Expo SDK 58 type definitions.
 *
 * What a simulation cannot prove (it runs on your phone, it builds in the
 * cloud, the store accepts it) is practised on your own phone and accounts,
 * in each module's practical.
 *
 * ── THE CURRICULUM TABLE ─────────────────────────────────────────────────
 * `curriculum` on each module is the source curriculum's topic list, numbered
 * in order (Module 1 is 1.1 to 1.10), with N.P for the module's practical
 * and `checkpoint` holding its mastery checkpoint. Every lesson declares the
 * numbers it `covers`, and `npm run test:academy` fails if any topic is not
 * taught. Where the source gives a phase one practical project, it belongs
 * to the phase's last module; the other modules end with a smaller practical
 * of their own.
 */

export const MOBILE_DEVELOPMENT_COURSE = {
  id: "mobile-development",
  slug: "mobile-development",
  title: "Mobile App Development",
  subtitle: "Build, test and publish Android and iOS apps with React Native and Expo",
  tagline:
    "Go from your first line of code to an app your users install from Google Play and the App Store.",
  description:
    "Twenty-four weeks from what a mobile app is to your own app in the hands of Android and iOS users. You set up a professional environment and learn JavaScript and TypeScript from zero, then design screens the way product teams do, before building real interfaces with React Native and Expo: components, styling, lists, forms, themes and accessibility. Then the architecture of real apps: Expo Router navigation, maintainable code, state management, local storage with SecureStore and SQLite, REST APIs, a backend and database, and secure accounts. You use the phone itself (camera, photos, location, maps, notifications, biometrics), add production features such as payments, offline sync and animation, and learn to test and secure your app. Finally you build release versions with EAS, create your Google Play Console and Apple Developer accounts, prepare store listings and privacy disclosures, release through testing tracks to production, ship over-the-air updates, and finish with a capstone app and a portfolio. Every lesson from Module 3 on makes you build: your code runs on a practice iPhone and Android phone in the lesson and is checked before you move on, and every practical is done on your own phone.",

  status: "live",
  level: "Beginner → Job-ready",
  durationMonths: 6,
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
      id: "react-native",
      name: "React Native & Expo SDK 58",
      short: "React Native",
      blurb: "One TypeScript codebase for Android and iOS, with Expo's modules and tools.",
      icon: "fas fa-mobile-screen-button",
      accent: "#0f766e",
    },
    {
      id: "router",
      name: "Expo Router, state & storage",
      short: "App architecture",
      blurb: "Stacks, tabs and deep links; Context and reducers; SecureStore and SQLite.",
      icon: "fas fa-route",
      accent: "#7c3aed",
    },
    {
      id: "backend",
      name: "APIs, backends & device features",
      short: "Backend & device",
      blurb: "REST, authentication and databases; camera, location, maps and notifications.",
      icon: "fas fa-cloud",
      accent: "#1d4ed8",
    },
    {
      id: "release",
      name: "Testing, security & the app stores",
      short: "Release",
      blurb: "Jest, Maestro and security reviews; EAS Build, Google Play Console and App Store Connect.",
      icon: "fas fa-rocket",
      accent: "#b45309",
    },
  ],

  outcomes: [
    "Explain how mobile apps work: platforms, native versus cross-platform, clients and servers, and how apps reach users",
    "Set up a professional environment and run your own app on an Android phone and an iPhone",
    "Program confidently in JavaScript and TypeScript, including asynchronous code and APIs",
    "Design usable, accessible mobile screens and plan an app's navigation before writing code",
    "Build polished React Native interfaces with Expo: components, layout, lists, forms, themes and safe areas",
    "Structure multi-screen apps with Expo Router, maintainable folders, custom Hooks and well-managed state",
    "Store data on the device with AsyncStorage, SecureStore and SQLite, and work offline",
    "Connect apps to REST APIs, a backend and a database, with secure registration, login and authorization",
    "Use the phone's camera, photos, location, maps, notifications and biometrics, handling permissions properly",
    "Test, debug and secure an app, then build it with EAS and publish it on Google Play and the App Store",
  ],

  audience: [
    "Complete beginners who want to build mobile apps; no programming experience is assumed",
    "Web developers who know JavaScript or React and want to build for phones",
    "Founders and freelancers who want to build and publish their own apps",
    "Anyone heading for a mobile or cross-platform developer role",
  ],

  requirements: [
    "A laptop or desktop computer (Windows, macOS or Linux) with permission to install free software",
    "An Android phone or an iPhone (both is better) to run your apps on",
    "A stable internet connection",
    "To publish: a Google Play Console account (one-time US$25 fee) and, for iOS, the Apple Developer Program (US$99 a year). Both are optional until Module 20",
  ],

  /** Twelve phases; `weeks` are module orders. */
  phases: [
    { phase: 1, title: "The foundations of mobile app development", weeks: [1, 2], span: "Weeks 1–2" },
    { phase: 2, title: "Programming fundamentals for mobile developers", weeks: [3, 4], span: "Weeks 3–5" },
    { phase: 3, title: "UI/UX design and mobile interface development", weeks: [5, 6], span: "Weeks 6–7" },
    { phase: 4, title: "React Native and Expo fundamentals", weeks: [7, 8], span: "Weeks 8–10" },
    { phase: 5, title: "Navigation and application architecture", weeks: [9, 10], span: "Week 11" },
    { phase: 6, title: "State management, forms and local storage", weeks: [11, 12], span: "Weeks 12–13" },
    { phase: 7, title: "APIs, backends and databases", weeks: [13, 14, 15], span: "Weeks 14–16" },
    { phase: 8, title: "Native device features and integrations", weeks: [16], span: "Week 17" },
    { phase: 9, title: "Advanced mobile development", weeks: [17], span: "Week 18" },
    { phase: 10, title: "Testing, debugging and application security", weeks: [18, 19], span: "Week 19" },
    { phase: 11, title: "Building, deployment and publishing", weeks: [20], span: "Week 20" },
    { phase: 12, title: "Capstone project and professional readiness", weeks: [21], span: "Weeks 21–24" },
  ],

  months: [
    /* ═══════════════════════ MONTH 1 · PHASES 1–2 ═══════════════════════ */
    {
      month: 1,
      title: "Month 1 · Foundations and Programming",
      focus: "Foundation",
      summary:
        "What mobile apps are and how they reach users, a professional environment with your first app on your own phone, then JavaScript from zero to asynchronous code and TypeScript.",
      modules: [
        {
          id: "md-m1-intro",
          order: 1,
          phase: 1,
          week: "Week 1",
          title: "Module 1 · Introduction to Mobile Applications",
          summary:
            "What mobile apps are, apps versus websites and PWAs, Android and iOS, native, cross-platform and hybrid development, frontend and backend, clients and servers, the development lifecycle, APK, AAB and IPA files, and the app stores.",
          objective: "Understand the environment you are entering before you start building applications.",
          atoms: 14,
          topics: [
            "What mobile apps are and how they work",
            "Android and iOS; native, cross-platform and hybrid",
            "Frontend, backend and client-server communication",
            "The app development lifecycle",
            "App packages and app store distribution",
          ],
          curriculum: [
            ["1.0", "Welcome: the course, the road to Google Play and the App Store, and how you will practise"],
            ["1.1", "What mobile applications are and how they work"],
            ["1.2", "Mobile apps versus websites and progressive web apps"],
            ["1.3", "Android versus iOS"],
            ["1.4", "Native, cross-platform, and hybrid development"],
            ["1.5", "Frontend versus backend development"],
            ["1.6", "Client-server architecture"],
            ["1.7", "How applications communicate with servers"],
            ["1.8", "The app development lifecycle: idea, design, development, testing, deployment, maintenance"],
            ["1.9", "Understanding APK, AAB, and IPA files"],
            ["1.10", "How applications are distributed through app stores"],
            ["1.P", "Practical: analyse three popular apps: screens, features, data requirements and likely backend services"],
          ],
          project:
            "Analyze three popular apps and identify their screens, features, data requirements, and likely backend services.",
          checkpoint:
            "You can explain, for any app on your phone, what runs on the device, what runs on a server, and how the two talk to each other.",
        },
        {
          id: "md-m2-setup",
          order: 2,
          phase: 1,
          week: "Week 2",
          title: "Module 2 · Computer and Development Environment Setup",
          summary:
            "VS Code, files and folders, the terminal, Node.js and npm, packages and dependencies, Git and GitHub, creating an Expo project, running it on an Android phone and an iPhone, emulators and simulators, and configuration files.",
          objective: "Set up a professional development environment and run your first app on a real phone.",
          atoms: 13,
          topics: [
            "VS Code, files, folders and the terminal",
            "Node.js, npm, packages and dependencies",
            "Git and GitHub",
            "Creating an Expo project and running it on your phone",
            "Emulators, simulators, environment variables and configuration",
          ],
          curriculum: [
            ["2.1", "Installing and configuring Visual Studio Code"],
            ["2.2", "Understanding files, folders, and project directories"],
            ["2.3", "Using the terminal and command-line interface"],
            ["2.4", "Installing Node.js and npm"],
            ["2.5", "Understanding packages and dependencies"],
            ["2.6", "Introduction to Git and GitHub"],
            ["2.7", "Installing Expo tooling and creating a project"],
            ["2.8", "Running an app on a physical Android device (and an iPhone)"],
            ["2.9", "Using Android emulators where available (and the iOS Simulator on a Mac)"],
            ["2.10", "Understanding environment variables and configuration files"],
            ["2.P", "Practical: create a starter app, run it on your phone, change its interface and save it to GitHub"],
          ],
          project:
            "Create a starter app, run it on a phone, modify its interface, and save the project to GitHub.",
          checkpoint:
            "You can create an Expo project from the terminal, open it on your own phone, make a change you can see, and push the change to GitHub.",
        },
        {
          id: "md-m3-javascript",
          order: 3,
          phase: 2,
          week: "Weeks 3–4",
          title: "Module 3 · JavaScript Fundamentals",
          summary:
            "Variables, data types and conversion, operators, conditions, loops, functions and scope, arrays and their methods, objects, destructuring and spread, template literals, modules, and error handling, practised in a real app.",
          objective: "Learn the programming fundamentals every later module depends on. No experience is assumed.",
          atoms: 20,
          topics: [
            "Variables, types, operators and conditions",
            "Loops and functions",
            "Arrays and objects",
            "Destructuring, spread and template literals",
            "Modules and error handling",
          ],
          curriculum: [
            ["3.1", "Variables: let and const"],
            ["3.2", "Data types and type conversion"],
            ["3.3", "Strings, numbers, booleans, and null"],
            ["3.4", "Operators and expressions"],
            ["3.5", "Conditional statements: if, else, and switch"],
            ["3.6", "Loops: for, while, and array iteration"],
            ["3.7", "Functions, parameters, arguments, and return values"],
            ["3.8", "Scope and common programming errors"],
            ["3.9", "Arrays and array methods"],
            ["3.10", "Objects and object properties"],
            ["3.11", "Destructuring and spread syntax"],
            ["3.12", "Template literals"],
            ["3.13", "Modules: import and export"],
            ["3.14", "Error handling with try, catch, and finally"],
            ["3.P", "Practical: the logic of a shopping cart, written in modules and shown on a phone screen"],
          ],
          project:
            "Write the logic of a shopping cart (totals, discounts, validation and receipts) as JavaScript modules, and show it in a real app screen.",
          checkpoint:
            "You can read a short JavaScript program and say what it prints, and explain why, without running it.",
        },
        {
          id: "md-m4-modern-js",
          order: 4,
          phase: 2,
          week: "Week 5",
          title: "Module 4 · Modern JavaScript and Asynchronous Programming",
          summary:
            "Arrow functions, callbacks and higher-order functions, map, filter, find and reduce, promises, async and await, fetching from APIs, JSON, HTTP requests and responses, loading and error states, and an introduction to TypeScript.",
          objective: "Write the modern, asynchronous JavaScript that apps use to talk to servers, and start typing it with TypeScript.",
          atoms: 16,
          topics: [
            "Arrow, callback and higher-order functions",
            "map, filter, find and reduce",
            "Promises, async and await",
            "fetch, JSON, HTTP and request states",
            "Introduction to TypeScript",
          ],
          curriculum: [
            ["4.1", "Arrow functions"],
            ["4.2", "Callback functions"],
            ["4.3", "Higher-order functions"],
            ["4.4", "map(), filter(), find(), and reduce()"],
            ["4.5", "Promises and asynchronous operations"],
            ["4.6", "async and await"],
            ["4.7", "Fetching data from APIs"],
            ["4.8", "JSON data and parsing"],
            ["4.9", "Understanding HTTP requests and responses"],
            ["4.10", "Handling loading states and errors"],
            ["4.11", "Introduction to TypeScript: types, interfaces, and typed functions"],
            ["4.P", "Practical: an app that loads a list from an API and handles loading and error states"],
          ],
          project:
            "Build a small application that retrieves a list of items from a public API, displays them, and handles loading and error states.",
          checkpoint:
            "You can explain what happens, in order, between pressing Refresh and the list appearing, including what the user sees if the network fails.",
        },
      ],
    },

    /* ═══════════════════════ MONTH 2 · PHASES 3–4 ═══════════════════════ */
    {
      month: 2,
      title: "Month 2 · Design and React Native",
      focus: "Interfaces",
      summary:
        "Design screens that are easy to use on a small, touch-driven device and plan an app before writing code; then build real interfaces with React Native and Expo.",
      modules: [
        {
          id: "md-m5-uiux",
          order: 5,
          phase: 3,
          week: "Week 6",
          title: "Module 5 · UI/UX Principles for Mobile Apps",
          summary:
            "User-centred design, user needs, personas and journeys, information architecture, wireframes and Figma, layout, spacing, type and colour, mobile-first design, touch targets, accessibility, forms, interface states and the platform conventions of Android and iOS.",
          objective: "Understand how people use phones and design screens that let them finish their task comfortably.",
          atoms: 14,
          topics: [
            "User-centred design, personas and journeys",
            "Information architecture and wireframes",
            "Visual design and mobile-first layout",
            "Touch, accessibility and forms",
            "Interface states and platform conventions",
          ],
          curriculum: [
            ["5.1", "User-centered design"],
            ["5.2", "Understanding user needs and use cases"],
            ["5.3", "User personas and user journeys"],
            ["5.4", "Information architecture"],
            ["5.5", "Wireframing and low-fidelity prototypes"],
            ["5.6", "High-fidelity interface design using Figma"],
            ["5.7", "Layout hierarchy, spacing, typography, and color"],
            ["5.8", "Mobile-first design principles"],
            ["5.9", "Touch targets and gesture-friendly interfaces"],
            ["5.10", "Accessibility and readable text"],
            ["5.11", "Form design and validation"],
            ["5.12", "Empty states, error states, loading indicators, and success messages"],
            ["5.13", "Platform conventions for Android and iOS"],
            ["5.P", "Practical: a persona, a user journey and a usability fix for a real screen"],
          ],
          project:
            "Write a persona and a user journey for an app idea, then find and fix the usability problems of a screen built by someone else.",
          checkpoint:
            "You can look at any phone screen and name what makes it easy or hard to use, with a reason a user would recognise.",
        },
        {
          id: "md-m6-screens",
          order: 6,
          phase: 3,
          week: "Week 7",
          title: "Module 6 · Planning App Screens and Navigation",
          summary:
            "Splash screens and onboarding, welcome, sign-up and login, home dashboards, lists, details and profiles, tabs, stacks and modals, back navigation, screen flow diagrams, reusable components and layouts for every phone size.",
          objective: "Plan every screen of an app and how the user moves between them before writing the code.",
          atoms: 11,
          topics: [
            "Splash, onboarding, welcome and login screens",
            "Dashboards, lists, details and profiles",
            "Tabs, stacks, modals and back navigation",
            "Screen flow diagrams and reusable components",
            "Layouts for different phone sizes",
          ],
          curriculum: [
            ["6.1", "Splash screens and onboarding"],
            ["6.2", "Welcome, registration, and login screens"],
            ["6.3", "Home dashboards"],
            ["6.4", "Lists, detail pages, and profile screens"],
            ["6.5", "Bottom-tab navigation"],
            ["6.6", "Stack navigation and modal screens"],
            ["6.7", "Back navigation"],
            ["6.8", "Screen flow and navigation diagrams"],
            ["6.9", "Reusable design components"],
            ["6.10", "Responsive layouts for different phone sizes"],
            ["6.P", "Practical: design and prototype a multi-screen app in Figma, then as a clickable prototype"],
          ],
          project:
            "Design and prototype a multi-screen app in Figma before writing the application code.",
          checkpoint:
            "Someone who has never seen your app can follow your screen flow diagram and find every screen in your prototype.",
        },
        {
          id: "md-m7-react-native",
          order: 7,
          phase: 4,
          week: "Weeks 8–9",
          title: "Module 7 · Understanding React Native",
          summary:
            "What React Native is and how it differs from React on the web, the Expo workflow and project structure, JSX, components and props, state, events, conditional rendering, lists, the core components, text inputs, StyleSheet and Flexbox, safe areas, the status bar, the keyboard, and platform differences.",
          objective: "Build real mobile interfaces with React Native's components, state and styling.",
          atoms: 20,
          topics: [
            "React Native, Expo and the project structure",
            "JSX, components, props and state",
            "Events, conditional rendering and lists",
            "Core components, inputs and styling with Flexbox",
            "Safe areas, status bar, keyboard and platform differences",
          ],
          curriculum: [
            ["7.1", "What React Native is and how it differs from React for the web"],
            ["7.2", "Understanding Expo and the development workflow"],
            ["7.3", "Creating a project with the current Expo tooling"],
            ["7.4", "Understanding the project structure"],
            ["7.5", "JavaScript and JSX in mobile development"],
            ["7.6", "Components, props, and reusable UI"],
            ["7.7", "State management with useState"],
            ["7.8", "Handling user interactions and events"],
            ["7.9", "Conditional rendering"],
            ["7.10", "Rendering lists with FlatList and ScrollView"],
            ["7.11", "Understanding View, Text, Image, and Pressable"],
            ["7.12", "Text inputs and form controls"],
            ["7.13", "Styling with StyleSheet"],
            ["7.14", "Flexbox layouts on mobile"],
            ["7.15", "Safe areas, status bars, and keyboard behavior"],
            ["7.16", "Platform-specific behavior for Android and iOS"],
            ["7.P", "Practical: a habit tracker screen built from your own components"],
          ],
          project:
            "Build a habit tracker screen from your own components: a header, a list of habits you can tick off, an input to add one, and a summary.",
          checkpoint:
            "You can explain why the screen re-renders when you tick a habit, and what changes on Android compared with iOS.",
        },
        {
          id: "md-m8-polished-ui",
          order: 8,
          phase: 4,
          week: "Week 10",
          title: "Module 8 · Building Polished Mobile Interfaces",
          summary:
            "Reusable buttons, cards, headers and inputs, responsive layouts, images, icons, fonts and assets, gradients, scrolling sections, search and filtering, validation and feedback, light and dark themes, skeletons and spinners, accessibility labels, and screen sizes and orientation.",
          objective: "Turn working screens into polished, consistent, accessible interfaces.",
          atoms: 11,
          topics: [
            "A component kit: buttons, cards, headers, inputs",
            "Images, icons, fonts, gradients and assets",
            "Scrolling, search, filtering and feedback",
            "Light and dark themes and loading states",
            "Accessibility, screen sizes and orientation",
          ],
          curriculum: [
            ["8.1", "Creating reusable buttons, cards, headers, and input fields"],
            ["8.2", "Responsive layouts for different screen dimensions"],
            ["8.3", "Images, icons, fonts, and local assets"],
            ["8.4", "Gradients and visual effects"],
            ["8.5", "Scrollable pages and horizontally scrolling sections"],
            ["8.6", "Lists with search and filtering"],
            ["8.7", "Form validation and user feedback"],
            ["8.8", "Light and dark themes"],
            ["8.9", "Loading skeletons and activity indicators"],
            ["8.10", "Accessibility labels and touch-friendly controls"],
            ["8.11", "Handling different screen sizes and orientations"],
            ["8.P", "Practical: a polished dashboard with a profile, a searchable list, settings and reusable components"],
          ],
          project:
            "Build a polished mobile dashboard with a profile screen, searchable list, settings page, and reusable components.",
          checkpoint:
            "Your dashboard looks right on a small Android phone and a large iPhone, in light and dark mode, and a screen reader can use every control.",
        },
      ],
    },

    /* ═══════════════════════ MONTH 3 · PHASES 5–6 ═══════════════════════ */
    {
      month: 3,
      title: "Month 3 · Architecture, State and Storage",
      focus: "Architecture",
      summary:
        "Multi-screen apps with Expo Router and a codebase that stays maintainable as it grows; state shared across screens; forms; and data that survives a restart.",
      modules: [
        {
          id: "md-m9-navigation",
          order: 9,
          phase: 5,
          week: "Week 11",
          title: "Module 9 · Navigation and Multi-Screen Applications",
          summary:
            "Expo Router: stacks, tabs and drawers, route parameters, going back and resetting, nested navigators, signed-in and signed-out navigation, protected screens, deep links and URL schemes, notification links, and organising a project's folders.",
          objective: "Build multi-screen apps whose navigation behaves the way Android and iOS users expect.",
          atoms: 13,
          topics: [
            "Expo Router: stacks, tabs and drawers",
            "Parameters, back navigation and nested navigators",
            "Authentication-based navigation and protected screens",
            "Deep links, URL schemes and notification links",
            "Organising screens, components, hooks and services",
          ],
          curriculum: [
            ["9.1", "Installing and configuring a navigation solution supported by Expo"],
            ["9.2", "Stack navigation"],
            ["9.3", "Tab navigation"],
            ["9.4", "Drawer navigation where appropriate"],
            ["9.5", "Passing parameters between screens"],
            ["9.6", "Navigating back and resetting navigation state"],
            ["9.7", "Nested navigators"],
            ["9.8", "Authentication-based navigation"],
            ["9.9", "Protected screens"],
            ["9.10", "Deep links and URL schemes"],
            ["9.11", "Handling notification links"],
            ["9.12", "Organizing screens, components, hooks, services, and utilities"],
            ["9.P", "Practical: a recipe app with tabs, a details stack, a protected favourites screen and deep links"],
          ],
          project:
            "Build a recipe app with tabs, a stack of recipe details, a favourites screen that needs signing in, and links that open a recipe directly.",
          checkpoint:
            "You can draw your app's route tree from its src/app folder and predict what Back does on every screen, on Android and on iOS.",
        },
        {
          id: "md-m10-architecture",
          order: 10,
          phase: 5,
          week: "Week 11",
          title: "Module 10 · Codebase Structure and Maintainability",
          summary:
            "Separating UI from logic, shared components, custom Hooks, a central API layer, constants and configuration, environment variables, app-wide error handling, avoiding duplication, dependencies, reading documentation and debugging libraries, and Git branches, commits and pull requests.",
          objective: "Organise an app so that it stays easy to change, debug and share with a team.",
          atoms: 12,
          topics: [
            "UI versus logic, shared components and custom Hooks",
            "API services, constants, configuration and environment variables",
            "App-wide error handling and avoiding duplication",
            "Dependencies, documentation and debugging libraries",
            "Git branches, commits and pull requests",
          ],
          curriculum: [
            ["10.1", "Separating UI from business logic"],
            ["10.2", "Building shared components"],
            ["10.3", "Creating custom hooks"],
            ["10.4", "Centralizing API calls"],
            ["10.5", "Managing constants and configuration"],
            ["10.6", "Using environment variables correctly"],
            ["10.7", "Handling application-wide errors"],
            ["10.8", "Avoiding duplicated code"],
            ["10.9", "Understanding dependency management"],
            ["10.10", "Reading documentation and debugging unfamiliar libraries"],
            ["10.11", "Using Git branches, commits, and pull requests"],
            ["10.P", "Practical: a multi-screen task manager with tabs, details, reusable components and a maintainable structure"],
          ],
          project:
            "Build a multi-screen task manager with tabs, detail pages, reusable components, and a maintainable folder structure.",
          checkpoint:
            "Another developer can find where any piece of your task manager lives, change it in one place, and open a pull request for it.",
        },
        {
          id: "md-m11-state",
          order: 11,
          phase: 6,
          week: "Week 12",
          title: "Module 11 · Managing Application State",
          summary:
            "What state is, local state, sharing data between components, derived state, Context, useReducer, choosing between Context, a state library such as Zustand and server-state tools such as TanStack Query, request states, separating server data from UI state, and avoiding unnecessary re-renders.",
          objective: "Decide where every piece of data lives, and keep screens correct as the app grows.",
          atoms: 11,
          topics: [
            "Local, shared and derived state",
            "Context and useReducer",
            "Context, Zustand or TanStack Query",
            "Request states and server data",
            "Avoiding unnecessary re-renders",
          ],
          curriculum: [
            ["11.1", "What state is and why it matters"],
            ["11.2", "Local component state"],
            ["11.3", "Sharing data between components"],
            ["11.4", "Derived state and avoiding unnecessary duplication"],
            ["11.5", "Context API"],
            ["11.6", "useReducer for more complex state transitions"],
            ["11.7", "Choosing between Context, a lightweight state library, and server-state tools"],
            ["11.8", "Managing loading, success, empty, and error states"],
            ["11.9", "Separating remote server data from local UI state"],
            ["11.10", "Avoiding unnecessary re-renders"],
            ["11.P", "Practical: a shopping cart shared across screens with a reducer, Context and server data"],
          ],
          project:
            "Build a shop whose cart is shared by every screen through Context and a reducer, while products come from a server and are cached.",
          checkpoint:
            "For each piece of data in your app you can say where it lives and why, and which screens re-render when it changes.",
        },
        {
          id: "md-m12-forms-storage",
          order: 12,
          phase: 6,
          week: "Week 13",
          title: "Module 12 · Forms and Persistent Data",
          summary:
            "Inputs, pickers, switches and selections, required fields and validation, keyboard types and secure entry, submission and errors, saving preferences, AsyncStorage, SecureStore for tokens, SQLite for structured data, offline-first design, caching, synchronisation and conflicts, and clearing data on logout.",
          objective: "Collect data reliably through forms and keep it on the phone, safely, between launches.",
          atoms: 13,
          topics: [
            "Inputs, controls and validation",
            "Keyboards, secure entry and submission",
            "AsyncStorage, SecureStore and SQLite",
            "Offline-first, caching and synchronisation",
            "Clearing data on logout",
          ],
          curriculum: [
            ["12.1", "Text inputs, dropdowns, switches, and selection controls"],
            ["12.2", "Required fields and input validation"],
            ["12.3", "Email, password, number, and date validation"],
            ["12.4", "Handling keyboard types and secure text entry"],
            ["12.5", "Form submission and error messages"],
            ["12.6", "Saving preferences locally"],
            ["12.7", "AsyncStorage or an appropriate alternative"],
            ["12.8", "SecureStore for sensitive local values such as session tokens"],
            ["12.9", "SQLite for structured local data"],
            ["12.10", "Offline-first principles"],
            ["12.11", "Caching, synchronization, and conflict handling"],
            ["12.12", "Clearing data during logout"],
            ["12.P", "Practical: an expense tracker that saves transactions locally, with categories and filters"],
          ],
          project:
            "Build an expense tracker that saves transactions locally, supports categories, filters records, and preserves data after restarting the app.",
          checkpoint:
            "You can close and reopen your app and lose nothing, and explain which store each piece of data is in and why.",
        },
      ],
    },

    /* ═══════════════════════ MONTH 4 · PHASES 7–8 ═══════════════════════ */
    {
      month: 4,
      title: "Month 4 · APIs, Backends and Device Features",
      focus: "Connected apps",
      summary:
        "How an app talks to the outside world: REST APIs, a backend and database, secure accounts; and how it uses the phone: camera, photos, location, maps, notifications and more.",
      modules: [
        {
          id: "md-m13-networking",
          order: 13,
          phase: 7,
          week: "Week 14",
          title: "Module 13 · REST APIs and Networking",
          summary:
            "APIs and endpoints, HTTP methods, status codes and headers, JSON, fetch and HTTP clients, cancelling requests, authentication headers, pagination and search, timeouts and network errors, retries and rate limits, uploading files, and testing APIs.",
          objective: "Make an app's network code correct, efficient and resilient on a real mobile connection.",
          atoms: 13,
          topics: [
            "Endpoints, methods, status codes and headers",
            "fetch, HTTP clients and cancellation",
            "Authentication headers, pagination and search",
            "Timeouts, errors, retries and rate limits",
            "Uploads and testing APIs",
          ],
          curriculum: [
            ["13.1", "Understanding APIs and endpoints"],
            ["13.2", "HTTP methods: GET, POST, PUT, PATCH, and DELETE"],
            ["13.3", "Status codes and response headers"],
            ["13.4", "JSON requests and responses"],
            ["13.5", "Using fetch or an HTTP client"],
            ["13.6", "Async operations and request cancellation"],
            ["13.7", "Authentication headers"],
            ["13.8", "Pagination and search parameters"],
            ["13.9", "Loading, timeout, and network error handling"],
            ["13.10", "Retry strategies and rate limits"],
            ["13.11", "Uploading images and documents"],
            ["13.12", "Testing APIs with Postman or an equivalent tool"],
            ["13.P", "Practical: a news reader with search, infinite scrolling, retries and offline handling"],
          ],
          project:
            "Build a news reader that searches an API, loads more stories as you scroll, retries failed requests and tells the user when they are offline.",
          checkpoint:
            "You can open your app's network log and explain every request: its method, its status code, and what the user saw.",
        },
        {
          id: "md-m14-backend",
          order: 14,
          phase: 7,
          week: "Week 15",
          title: "Module 14 · Backend and Database Integration",
          summary:
            "Frontend and backend responsibilities, server architecture, tables, records, relationships and queries, SQL, Firebase and Supabase, accounts, CRUD, file storage, realtime updates, access rules, indexes, and relational versus document databases.",
          objective: "Understand the server side well enough to design, use and question an app's backend.",
          atoms: 13,
          topics: [
            "Frontend and backend responsibilities",
            "Tables, relationships and SQL",
            "Firebase and Supabase: accounts, CRUD and storage",
            "Realtime updates and access rules",
            "Indexes, efficiency and choosing a database",
          ],
          curriculum: [
            ["14.1", "Frontend versus backend responsibilities"],
            ["14.2", "Introduction to server-side application architecture"],
            ["14.3", "Database tables, records, relationships, and queries"],
            ["14.4", "SQL fundamentals"],
            ["14.5", "Introduction to Firebase or Supabase"],
            ["14.6", "User authentication and account management"],
            ["14.7", "Database CRUD operations"],
            ["14.8", "Cloud storage for images and files"],
            ["14.9", "Realtime updates where needed"],
            ["14.10", "Data access rules and authorization"],
            ["14.11", "Database indexes and query efficiency"],
            ["14.12", "Choosing between relational and document databases"],
            ["14.P", "Practical: a community noticeboard backed by a database, with uploads and live updates"],
          ],
          project:
            "Build a community noticeboard: posts in a database, images in storage, live updates when someone posts, and rules that stop people editing others' posts.",
          checkpoint:
            "You can explain where each check in your noticeboard happens, in the app or on the server, and why the server's checks are the ones that matter.",
        },
        {
          id: "md-m15-auth",
          order: 15,
          phase: 7,
          week: "Week 16",
          title: "Module 15 · Authentication and Account Management",
          summary:
            "Registration and login, email verification, password reset, sessions, access and refresh tokens, secure logout, roles, expired sessions, OAuth and sign in with Google and Apple, protecting endpoints, stopping users reaching other users' records, and handling credentials and secrets.",
          objective: "Give an app secure accounts that users can trust with their data.",
          atoms: 13,
          topics: [
            "Registration, login, verification and password reset",
            "Sessions, access and refresh tokens",
            "Logout, roles and expired sessions",
            "OAuth and third-party sign-in",
            "Protecting endpoints, records and secrets",
          ],
          curriculum: [
            ["15.1", "Registration and login flows"],
            ["15.2", "Email verification"],
            ["15.3", "Password reset"],
            ["15.4", "Session persistence"],
            ["15.5", "Access tokens and refresh tokens"],
            ["15.6", "Secure logout"],
            ["15.7", "Role-based access control"],
            ["15.8", "Handling expired sessions"],
            ["15.9", "OAuth and third-party sign-in"],
            ["15.10", "Protecting backend endpoints"],
            ["15.11", "Preventing users from accessing another user's records"],
            ["15.12", "Secure handling of credentials and secrets"],
            ["15.P", "Practical: an account-based app with registration, login, profiles, cloud records and image uploads"],
          ],
          project:
            "Build a complete account-based application with registration, login, user profiles, cloud-saved records, and image uploads.",
          checkpoint:
            "You can show that a signed-in user cannot read or change another user's records, even with a hand-made request.",
        },
        {
          id: "md-m16-device",
          order: 16,
          phase: 8,
          week: "Week 17",
          title: "Module 16 · Accessing Mobile Device Capabilities",
          summary:
            "Camera and photo library, picking, compressing and uploading images, location permissions and GPS, maps, push and local notifications, documents, sharing, the clipboard, haptics, biometrics, permission refusal, background tasks, and the battery, network and privacy costs of each.",
          objective: "Use the phone's hardware the way good apps do: only when needed, with permission, and gracefully when refused.",
          atoms: 15,
          topics: [
            "Camera, photos, compression and uploads",
            "Location, GPS and maps",
            "Push and local notifications",
            "Documents, sharing, clipboard, haptics and biometrics",
            "Permissions, background tasks and privacy",
          ],
          curriculum: [
            ["16.1", "Camera and gallery access"],
            ["16.2", "Image selection, compression, and uploads"],
            ["16.3", "Location permissions and GPS"],
            ["16.4", "Maps and location-based features"],
            ["16.5", "Push notifications"],
            ["16.6", "Local notifications and reminders"],
            ["16.7", "Document and file selection"],
            ["16.8", "Sharing content from the app"],
            ["16.9", "Clipboard access"],
            ["16.10", "Haptic feedback"],
            ["16.11", "Biometric authentication where appropriate"],
            ["16.12", "Handling permission denial and restricted access"],
            ["16.13", "Background tasks and their platform limitations"],
            ["16.14", "Understanding battery, network, and privacy implications"],
            ["16.P", "Practical: a field-reporting app that captures photos and locations, uploads reports and notifies users"],
          ],
          project:
            "Build a field-reporting application that captures photos, records locations, uploads reports, and notifies users when their reports are updated.",
          checkpoint:
            "Your field app keeps working, and says why, when the user refuses each permission it asks for.",
        },
      ],
    },

    /* ═══════════════════════ MONTH 5 · PHASES 9–11 ═══════════════════════ */
    {
      month: 5,
      title: "Month 5 · Production, Quality and the App Stores",
      focus: "Production",
      summary:
        "The features production apps need, the testing and security that make them trustworthy, and everything between a working app and one users install from Google Play and the App Store.",
      modules: [
        {
          id: "md-m17-advanced",
          order: 17,
          phase: 9,
          week: "Week 18",
          title: "Module 17 · Production-Level Functionality",
          summary:
            "Payments through a provider's hosted checkout, webhooks and server-side verification, subscriptions and in-app purchases, universal links, offline sync, background work, performance, image caching and large lists, animations and gestures, charts, localisation, accessibility testing, app lifecycle events, third-party SDKs, and when native Kotlin or Swift is needed.",
          objective: "Add the features that turn a working app into a production product.",
          atoms: 16,
          topics: [
            "Payments, webhooks, subscriptions and in-app purchases",
            "Universal links, offline sync and background work",
            "Performance, images and large lists",
            "Animations, gestures and charts",
            "Localisation, accessibility, lifecycle, SDKs and native code",
          ],
          curriculum: [
            ["17.1", "Payment gateway integration using a provider-supported mobile or hosted checkout flow"],
            ["17.2", "Webhooks and server-side payment verification"],
            ["17.3", "Subscription and in-app purchase fundamentals"],
            ["17.4", "Deep linking and universal links"],
            ["17.5", "Offline synchronization"],
            ["17.6", "Background processing"],
            ["17.7", "Performance optimization"],
            ["17.8", "Image caching and large-list optimization"],
            ["17.9", "Animations and gesture interactions"],
            ["17.10", "Charts and data visualization"],
            ["17.11", "Internationalization and localization"],
            ["17.12", "Accessibility testing"],
            ["17.13", "Handling app lifecycle events"],
            ["17.14", "Integrating third-party SDKs"],
            ["17.15", "Understanding when native Kotlin or Swift code is necessary"],
            ["17.P", "Practical: add one advanced feature to an existing app"],
          ],
          project:
            "Add one advanced feature to an existing app, such as payments, offline synchronization, animated onboarding, or interactive analytics.",
          checkpoint:
            "You can explain how your advanced feature fails safely: a payment that never completes, a sync conflict, a slow phone.",
        },
        {
          id: "md-m18-testing",
          order: 18,
          phase: 10,
          week: "Week 19",
          title: "Module 18 · Testing Mobile Applications",
          summary:
            "Manual testing on devices, emulators and simulators, unit, component, integration and end-to-end tests with Jest, React Native Testing Library and Maestro, testing forms, navigation, authentication and APIs, mocking networks, screen sizes and slow connections, debugging, logs and stack traces, profiling, regression testing and crash reports.",
          objective: "Prove an app works, find out quickly when it stops working, and fix what users report.",
          atoms: 16,
          topics: [
            "Manual testing on devices, emulators and simulators",
            "Unit and component tests with Jest and React Native Testing Library",
            "Integration and end-to-end tests with Maestro",
            "Mocking, screen sizes and bad networks",
            "Debugging, profiling, regressions and crash reports",
          ],
          curriculum: [
            ["18.1", "Manual testing on physical devices"],
            ["18.2", "Testing with Android emulators and iOS simulators where available"],
            ["18.3", "Unit testing"],
            ["18.4", "Component testing"],
            ["18.5", "Integration testing"],
            ["18.6", "End-to-end testing"],
            ["18.7", "Testing forms, navigation, authentication, and API requests"],
            ["18.8", "Mocking network responses"],
            ["18.9", "Testing on different screen sizes"],
            ["18.10", "Handling slow networks and interrupted connections"],
            ["18.11", "Debugging JavaScript errors and rendering issues"],
            ["18.12", "Reading logs and stack traces"],
            ["18.13", "Profiling performance and identifying memory problems"],
            ["18.14", "Regression testing after changes"],
            ["18.15", "Collecting crash reports and diagnosing failures"],
            ["18.P", "Practical: a test suite for an app: unit, component, integration and an end-to-end flow"],
          ],
          project:
            "Write a test suite for an existing app: unit tests for its logic, component tests for its screens, an integration test with a mocked API and a Maestro flow for its main journey.",
          checkpoint:
            "Break any feature of the app on purpose and at least one of your tests fails, with a message that says what broke.",
        },
        {
          id: "md-m19-security",
          order: 19,
          phase: 10,
          week: "Week 19",
          title: "Module 19 · Mobile Application Security",
          summary:
            "Secure coding, input validation, storing credentials and tokens, HTTPS, authentication versus authorization, keeping secrets out of the app, protecting backends and database rules, logs without secrets, the OWASP Mobile Top 10, permissions and privacy, dependency updates, threat modelling and privacy notices.",
          objective: "Build apps that protect their users' data, and review an app the way an attacker would.",
          atoms: 14,
          topics: [
            "Secure coding, validation and safe storage",
            "HTTPS, authentication and authorization",
            "Secrets, backends, rules and logs",
            "Common mobile vulnerabilities and privacy",
            "Dependencies, threat modelling and privacy notices",
          ],
          curriculum: [
            ["19.1", "Secure coding principles"],
            ["19.2", "Input validation and safe data handling"],
            ["19.3", "Secure storage of credentials and tokens"],
            ["19.4", "HTTPS and secure communication"],
            ["19.5", "Authentication versus authorization"],
            ["19.6", "Avoiding hardcoded API secrets"],
            ["19.7", "Protecting backend services and database rules"],
            ["19.8", "Avoiding sensitive information in logs"],
            ["19.9", "Understanding common mobile vulnerabilities"],
            ["19.10", "Permission minimization and user privacy"],
            ["19.11", "Dependency updates and vulnerability checks"],
            ["19.12", "Basic threat modeling"],
            ["19.13", "Privacy notices and responsible collection of user data"],
            ["19.P", "Practical: test an existing app, fix its defects and write a security and quality report"],
          ],
          project:
            "Test an existing application, document defects, fix them, and produce a basic security and quality report.",
          checkpoint:
            "You can name the three most likely ways your own app could leak a user's data, and show what stops each one.",
        },
        {
          id: "md-m20-release",
          order: 20,
          phase: 11,
          week: "Week 20",
          title: "Module 20 · Preparing Apps for Release and Publishing",
          summary:
            "Development, preview and production builds, identifiers, icons and splash screens, versions and release notes, environments, APK versus AAB, IPA and distribution, signing and provisioning, EAS Build and build profiles, testing release builds, crash reporting, screenshots and descriptions, creating a Google Play Console account and releasing through its testing tracks, the Apple Developer Program and App Store Connect, privacy disclosures and review, staged releases and rollback, over-the-air updates, and monitoring.",
          objective: "Take an app from your computer to Google Play and the App Store, and keep it healthy once it is there.",
          atoms: 20,
          topics: [
            "Builds, identifiers, branding, versions and environments",
            "APK, AAB, IPA, signing and provisioning",
            "EAS Build, build profiles and release testing",
            "Google Play Console and App Store Connect, step by step",
            "Privacy, review, staged releases, updates and monitoring",
          ],
          curriculum: [
            ["20.1", "Development, preview, and production builds"],
            ["20.2", "App identifiers and package names"],
            ["20.3", "App icons, splash screens, and branding"],
            ["20.4", "Version numbers and release notes"],
            ["20.5", "Environment-specific configuration"],
            ["20.6", "Android APK versus AAB"],
            ["20.7", "iOS IPA and distribution requirements"],
            ["20.8", "Code signing and provisioning concepts"],
            ["20.9", "Expo Application Services (EAS) Build"],
            ["20.10", "Managing build profiles"],
            ["20.11", "Installing and testing release builds"],
            ["20.12", "Crash reporting and production diagnostics"],
            ["20.13", "Preparing screenshots and store descriptions"],
            ["20.14", "Google Play Console setup and release workflow"],
            ["20.15", "Apple Developer account and App Store submission workflow"],
            ["20.16", "Privacy disclosures and app review requirements"],
            ["20.17", "Staged releases and rollback planning"],
            ["20.18", "Over-the-air updates and their compatibility limitations"],
            ["20.19", "Post-release monitoring and maintenance"],
            ["20.P", "Practical: a release build tested on a real device, and a complete store-submission package"],
          ],
          project:
            "Produce a release build, install and test it on a real device, and prepare a complete store-submission package. Publish when you have the required accounts and meet the relevant store requirements.",
          checkpoint:
            "You can explain, step by step, what stands between your release build and a user's phone on each store, and why a build that works can still be rejected.",
        },
      ],
    },

    /* ═══════════════════════ MONTH 6 · PHASE 12 ═══════════════════════ */
    {
      month: 6,
      title: "Month 6 · Capstone and Professional Readiness",
      focus: "Capstone",
      summary:
        "Four weeks to plan, build, test and release your own app to Android and iOS testers, then present it, and yourself, as a professional mobile developer.",
      modules: [
        {
          id: "md-m21-capstone",
          order: 21,
          phase: 12,
          week: "Weeks 21–24",
          title: "Module 21 · Capstone Project and Professional Readiness",
          summary:
            "Choosing and scoping a real app, requirements and user stories, a technical design, a plan in milestones, building the core, quality and security reviews, beta testing on Android and iOS through Google Play closed testing and TestFlight, launch, your portfolio and case study, and preparing for interviews, client work and the next steps of your career.",
          objective: "Prove everything you have learned by shipping your own app, and get ready for paid work.",
          atoms: 11,
          topics: [
            "Scoping, requirements and technical design",
            "Planning and building the core",
            "Quality, security and beta testing on both platforms",
            "Launch, portfolio and case study",
            "Interviews, client work and continuing to grow",
          ],
          curriculum: [
            ["21.1", "Choosing and scoping a capstone: a real problem, real users and a minimum viable product"],
            ["21.2", "Product requirements: user stories and acceptance criteria"],
            ["21.3", "Technical design: architecture, data model and API contract"],
            ["21.4", "Planning the build: milestones, issues and a Git workflow"],
            ["21.5", "Building the core flows of the app"],
            ["21.6", "Quality pass: tests, accessibility, performance and a security review"],
            ["21.7", "Beta testing on Android and iOS: Google Play closed testing, TestFlight and feedback"],
            ["21.8", "Launch: store listings, release and monitoring"],
            ["21.9", "Your portfolio: the README, a case study and a demo video"],
            ["21.10", "Professional readiness: interviews, take-home tasks, freelancing and continued learning"],
            ["21.P", "Capstone: a complete app released to Android and iOS testers, with its case study"],
          ],
          project:
            "Build, test and release your own app to testers on Android and iOS, and present it with a case study, a demo video and a README a reviewer can follow.",
          checkpoint:
            "A reviewer can install your app on an Android phone and an iPhone, use its main journey, read your code and understand every decision in your case study.",
        },
      ],
    },
  ],

  certificate: {
    issuer: "Memora Smart Technologies",
    name: "Mobile App Development",
    covers: "JavaScript & TypeScript • React Native & Expo • Navigation, state & storage • APIs, backends & security • Device features • Testing & publishing to Google Play and the App Store",
    idFormat: "MST-CERT-2026-000001",
    requirements: [
      "Complete every required lesson",
      "Pass every lesson check at 70% or above",
      "Complete the practical that ends each module",
      "Pass the final certification exam: 70% overall and at least 50% in every section",
    ],
  },

  checkpoints: [
    { afterMonth: 1, title: "Month 1 checkpoint", format: "An app on your own phone that loads a list from an API, with loading and error states, saved to GitHub.", passMark: 70 },
    { afterMonth: 2, title: "Month 2 checkpoint", format: "A polished, accessible dashboard in light and dark mode, built from your own design.", passMark: 70 },
    { afterMonth: 3, title: "Month 3 checkpoint", format: "A multi-screen app with Expo Router, shared state and data that survives a restart.", passMark: 70 },
    { afterMonth: 4, title: "Month 4 checkpoint", format: "An account-based app with a backend, secure login, uploads and device features.", passMark: 70 },
    { afterMonth: 5, title: "Month 5 checkpoint", format: "A tested, reviewed app with a release build and a complete store-submission package.", passMark: 70 },
    { afterMonth: 6, title: "Final", format: "Your capstone app released to Android and iOS testers, with its case study and demo.", passMark: 70 },
  ],
};

/** Every module id, in teaching order. The validator and tests read this. */
export const MOBILE_DEVELOPMENT_MODULE_IDS = MOBILE_DEVELOPMENT_COURSE.months.flatMap((m) => m.modules.map((mod) => mod.id));

export default MOBILE_DEVELOPMENT_COURSE;
