/**
 * CODEBASE ENGINEERING · MODULE 4 · TRACING FEATURES, DATA FLOW AND DEPENDENCIES
 *
 * Curriculum 4.1 – 4.10 and the practical, 4.P. Following a user action from
 * the interface through state, the API, authentication and the data, and
 * back; packages, versions and lockfiles; navigation tools; and the
 * difference between a symptom and its root cause.
 *
 * The API sessions were recorded against the running Kobo Market API. The
 * JavaScript programs learners predict are run in Node by validate:content.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

import { term, shown, JS } from "./ce-helpers.js";

export const SECTION_ID = "ce-s4-tracing";
const MODULE = "ce-m4-tracing";

const LOGIN_WRONG =
  'curl -s -X POST localhost:4000/api/login -H "Content-Type: application/json" -d \'{"email":"bola@kobo.test","password":"wrong"}\'';
const ME_TOKEN = 'curl -s localhost:4000/api/me -H "Authorization: Bearer $TOKEN"';
const ME_FORGED = 'curl -s localhost:4000/api/me -H "Authorization: Bearer ${TOKEN/u_1001/u_1002}"';
const LOCK_REACT = 'rg -n -A 3 "\\"node_modules/react\\": \\{" package-lock.json';

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 19 · 4.1 – 4.2
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ce-l19-user-action",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 1,
    covers: ["4.1", "4.2"],
    title: "From a Click to the Database and Back",
    subtitle: "The path of a user action, and tracing a feature from what is on screen",
    estimatedMinutes: 28,
    intro:
      "Every feature is a chain: something the user sees, the code that reacts, a request, a handler, a rule, some data, and the way back to the screen. Tracing the chain, link by link, is how you understand a feature well enough to change it.",

    atoms: [
      {
        id: "a-ce-action-path",
        title: "The layers a user action passes through",
        explain:
          "When Bola clicks Sign In, the action passes through every layer you mapped in Module 3, then comes back. The interface catches the event; application logic in the browser validates and calls the API; the server routes the request to a handler; the handler calls business logic; that reads the data; and the response travels back up until the screen changes. Tracing starts at the only part you can see for certain: the words on the screen.",
        table: {
          caption: "The sign-in chain, layer by layer.",
          headers: ["Layer", "What happens", "Where"],
          rows: [
            ["Interface", "The form is submitted", "src/pages/Login.jsx"],
            ["Browser logic", "The email is checked; sign-in is called", "Login.jsx → hooks/useAuth.js"],
            ["Request", "POST /api/login with the email and password", "src/api/auth.js → api/client.js"],
            ["Routing", "The URL is matched to a handler", "server/router.js"],
            ["Handler", "The body is read and checked", "server/routes/auth.js"],
            ["Business logic", "The password is verified; a token is signed", "server/services/authService.js"],
            ["Data", "The user is looked up by email", "server/db/index.js → data/kobo.json"],
          ],
        },
        terminalExercise: term("m4-trace-login", {
          goal: "Start the trace from what the user sees: find the code that displays the Sign In button.",
          accept: ['rg -n "Sign In" src'],
          near: [{ command: 'rg -n "api/login"', why: "That jumps to the middle of the chain. Start from the visible words, exactly as they appear on the button." }],
          hint: "Search src for the button's text.",
          success: "src/pages/Login.jsx line 40. The visible text is the one fact you are sure of; now follow the code outward from it.",
        }),
      },
      {
        id: "a-ce-ui-to-handler",
        title: "From the element to its handler",
        explain:
          "An element on screen is connected to code by an event: onClick on a button, onSubmit on a form. The name after the = is the handler, the function that runs. A submit button inside a form triggers the form's onSubmit, so for a form you look for onSubmit, then for the function it names.",
        terminalExercise: term("m4-trace-login", {
          goal: "The button is inside a form. Find the function that runs when the form is submitted.",
          accept: ["rg -n handleSubmit src"],
          near: [{ command: "rg -n onSignIn src", why: "That is the next link. First find the handler the form calls: handleSubmit." }],
          hint: "Search for handleSubmit, the name used in onSubmit={...}.",
          success: "Defined on line 9, attached to the form on line 28. Read lines 9 to 25 of Login.jsx and you know everything that happens in the browser on submit.",
        }),
      },
      {
        id: "a-ce-prop-hop",
        title: "Following a function passed in from outside",
        explain:
          "Inside handleSubmit the code calls onSignIn(email, password), but onSignIn is not defined in Login.jsx: it arrives as a prop, passed in by whichever component renders <Login>. To follow it, search for its name and look for where it is given a value (onSignIn={...}).",
        terminalExercise: term("m4-trace-login", {
          goal: "Find where onSignIn gets its value: what actually runs when Login calls it.",
          accept: ["rg -n onSignIn src"],
          near: [{ command: 'rg -n "signIn" src/hooks/useAuth.js', why: "That is where you will land, but find the link first: the place onSignIn={...} is set." }],
          hint: "Search src for onSignIn.",
          success: "App.jsx line 30: onSignIn={auth.signIn}. So Login calls signIn from the useAuth hook. One prop, one hop.",
        }),
      },
      {
        id: "a-ce-trace-order",
        title: "Predicting the order of events",
        explain:
          "A trace is not only which functions run, but in what order, and where it can stop early. Here is the sign-in chain reduced to its skeleton, with the network replaced by a function that returns at once. Read it the way you would read the real code: line by line, following each call and each early return.",
        codeExercise: {
          language: JS,
          code:
            'async function login(email) {\n  console.log("3. request sent for " + email);\n  return { user: { name: "Bola Ade" } };\n}\n\nasync function signIn(email) {\n  console.log("2. signIn");\n  const result = await login(email);\n  console.log("4. session saved");\n  return result.user;\n}\n\nasync function handleSubmit(email) {\n  console.log("1. submit");\n  if (!email.includes("@")) {\n    console.log("stopped: invalid email");\n    return;\n  }\n  const user = await signIn(email);\n  console.log("5. hello " + user.name);\n}\n\nhandleSubmit("bola").then(() => handleSubmit("bola@kobo.test"));\n',
          question: "What does this print?",
          expectedOutput:
            "1. submit\nstopped: invalid email\n1. submit\n2. signIn\n3. request sent for bola@kobo.test\n4. session saved\n5. hello Bola Ade",
          hint: "The first call has no @, so it stops early. The second goes all the way down to login and back up.",
          successMessage: "The first attempt never reaches the server: validation in the browser stops it. That is why a sign-in bug can be in the browser even when the server is fine.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 20 · 4.3 – 4.4
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ce-l20-state",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 2,
    covers: ["4.3", "4.4"],
    title: "Handlers, State Updates, Props and Hooks",
    subtitle: "How data changes in the browser, and how components pass it to each other",
    estimatedMinutes: 28,
    intro:
      "In a frontend, a feature is mostly about state: the data the screen is drawn from. Find where state lives, what changes it, and how it is passed down, and the screen's behaviour stops being mysterious.",

    atoms: [
      {
        id: "a-ce-state-updates",
        title: "Finding state and what changes it",
        explain:
          "In React, a component keeps data in state with useState: const [cart, setCart] = useState([]). cart is the current value; setCart is the only way to change it, and calling it redraws the screen. So to find what can change a piece of state, search for its setter: every call to setCart is a place the cart can change.",
        terminalExercise: term("m4-state", {
          goal: "Find every line that declares or changes the cart or the current page in the app.",
          accept: ['rg -n "setCart|setPage" src'],
          near: [{ command: "rg -n useState src", why: "That lists all state in the app (sixteen lines). Narrow it to the two setters you care about." }],
          hint: "Search src for setCart or setPage.",
          success: "Both live in App.jsx. setCart is called in one place (addToCart, line 18). setPage is passed to Navbar as onNavigate and called after sign-in. Two pieces of state, and you now know every way they change.",
        }),
      },
      {
        id: "a-ce-state-transform",
        title: "Data transformations in a state update",
        explain:
          "State updates often transform data: add an item, change a quantity, filter a list. React requires a NEW value rather than a changed old one, so updates are written with spreads ([...items, newItem]) and functions that receive the previous value. Here is App.jsx's addToCart, reduced to plain JavaScript. Predict what happens when a customer adds the same solar lamp twice.",
        codeExercise: {
          language: JS,
          code:
            'let cart = [];\nfunction setCart(update) {\n  cart = update(cart);\n}\n\nconst solar = { id: "solar-lamp", name: "Solar lamp", price: 1590000 };\n\nfunction addToCart(product) {\n  setCart((items) => [...items, { id: product.id, price: product.price, quantity: 1 }]);\n}\n\naddToCart(solar);\naddToCart(solar);\nconsole.log(cart.length);\nconsole.log(cart.reduce((sum, item) => sum + item.price * item.quantity, 0));\n',
          question: "What are the cart's length and total (in kobo)?",
          expectedOutput: "2\n3180000",
          hint: "Each call appends a new line with quantity 1; nothing looks for an existing line.",
          successMessage: "Two separate lines of one lamp each, not one line of two. The total is right, but the cart lists the lamp twice: a behaviour you only see by tracing the transformation. Worth a line in your report.",
        },
      },
      {
        id: "a-ce-props",
        title: "Props: how components pass data and functions down",
        explain:
          "Props are the inputs a component receives from its parent: <Products onAdd={addToCart} />. A prop can be data (a product) or a function (onAdd). Functions passed as props are how a child tells its parent something happened. Tracing a click often means following one prop down through several components, or back up.",
        terminalExercise: term("m4-state", {
          goal: "Follow the onAdd prop: find every component it passes through, from App down to the Add to cart button.",
          accept: ["rg -n onAdd src"],
          near: [{ command: 'rg -n "setCart|setPage" src', why: "That finds the state. The chain of components is followed through the onAdd prop." }],
          hint: "Search src for onAdd.",
          success: "App gives addToCart to Products as onAdd; Products passes it to each ProductCard; ProductCard calls onAdd(product) when the button is clicked. Three components, one function, handed down twice.",
        }),
      },
      {
        id: "a-ce-hooks",
        title: "Hooks: shared logic with state",
        explain:
          "A hook is a function whose name starts with use that holds state and logic for components to share: useState is built in; useAuth is Kobo Market's own. Reading a custom hook tells you where a whole area of state lives and how it is kept, which for sign-in also means: where is the session stored between visits?",
        terminalExercise: term("m4-state", {
          goal: "Find where the signed-in session is kept, and how it survives a page reload.",
          accept: ["cat src/hooks/useAuth.js"],
          near: [{ command: "rg -n useState src", why: "That shows useAuth uses state; read the hook itself to see where the session is saved." }],
          hint: "Read the useAuth hook.",
          success: "The session (token and user) is held in state and saved to localStorage under \"session\", which is how it survives a reload. Any script on the page can read localStorage, so it is a security decision worth knowing about (Module 9).",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 21 · 4.5 – 4.6
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ce-l21-api-auth",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 3,
    covers: ["4.5", "4.6"],
    title: "Endpoints, Requests and Responses; Authentication and Authorization",
    subtitle: "Talking to the API directly, and following who is allowed to do what",
    estimatedMinutes: 32,
    intro:
      "You do not need the frontend to trace the backend. curl sends requests straight to the API and shows exactly what comes back, which separates \"the server is wrong\" from \"the page is wrong\" in one command.",

    atoms: [
      {
        id: "a-ce-endpoints",
        title: "Requests and responses, in full",
        explain:
          "An endpoint is one method plus one URL: GET /api/products/solar-lamp. A request carries a method, a URL, headers and sometimes a body; a response carries a status code, headers and a body. curl -s URL prints the body; curl -si also prints the status line and headers. Status codes group by their first digit: 2xx success, 4xx the client asked for something wrong, 5xx the server failed.",
        terminalExercise: term("m4-api", {
          intro: "The Kobo Market API is running on port 4000.",
          goal: "Request one product and see the status code and headers as well as the body.",
          accept: ["curl -si localhost:4000/api/products/solar-lamp"],
          near: [{ command: "curl -s localhost:4000/api/products/solar-lamp", why: "That shows only the body. Add -i to include the status line and headers." }],
          hint: "curl with -s (quiet) and -i (include headers).",
          success: "HTTP/1.1 200 OK, Content-Type: application/json, then the product. The price is 1590000: kobo, not naira, which the frontend must format.",
        }),
      },
      {
        id: "a-ce-status-codes",
        title: "Two kinds of Not Found",
        explain:
          "The same status code can come from different code. In Kobo Market a 404 can come from the product handler (the URL matched a route, but there is no such product) or from the router itself (no route matched the URL at all). The body's wording tells you which code answered, and so where to look.",
        terminalExercise: term("m4-api", {
          goal: "Ask for a product that does not exist, and find out which code answers.",
          accept: ["curl -s localhost:4000/api/products/nope"],
          near: [{ command: "curl -s localhost:4000/api/product", why: "That URL matches no route, so the router answers \"Not found\". Ask for a missing product on the real route: /api/products/nope." }],
          hint: "The products route with an id that does not exist.",
          success: "{\"error\":\"Product not found\"}: the product handler answered (server/routes/products.js). Compare /api/product, which gives the router's generic {\"error\":\"Not found\"}. Same status family, different code, different fix.",
        }),
      },
      {
        id: "a-ce-authn",
        title: "Authentication: who are you?",
        explain:
          "Authentication proves identity. Kobo Market's login handler checks that both fields are present (400 if not), asks the auth service to verify the password, and answers 401 if it fails or 200 with a token if it succeeds. Good login code gives the same message for an unknown email and a wrong password, so an attacker cannot use it to discover which emails have accounts.",
        terminalExercise: term("m4-auth", {
          intro: "The API is running. TOKEN holds a token from a successful login.",
          goal: "Find out exactly what the API answers when the password is wrong.",
          accept: [LOGIN_WRONG],
          near: [{ command: 'curl -s -X POST localhost:4000/api/login -H "Content-Type: application/json" -d \'{"email":"bola@kobo.test"}\'', why: "That request has no password at all, so it is rejected earlier (400, \"required\"). Send a wrong password." }],
          hint: "POST to /api/login with the right email and a wrong password.",
          success: "{\"error\":\"Invalid email or password\"}: one message for both cases, as it should be. The status is 401, from routes/auth.js line 10.",
        }),
      },
      {
        id: "a-ce-token",
        title: "The token: proof on every later request",
        explain:
          "After login, the browser sends the token with every request that needs a signed-in user, in an Authorization: Bearer TOKEN header. On the server, requireAuth reads the header, verifies the token's signature with SESSION_SECRET, loads the user and puts it on req.user. Without a valid token, it answers 401 before the handler ever runs.",
        terminalExercise: term("m4-auth", {
          goal: "Call /api/me as Bola, by sending the token from the login.",
          accept: [ME_TOKEN],
          near: [{ command: "curl -s localhost:4000/api/me", why: "Without the Authorization header, requireAuth stops the request: \"Sign in required\". Send the token." }],
          hint: "Add -H \"Authorization: Bearer $TOKEN\".",
          success: "{\"user\":{\"id\":\"u_1001\",\"name\":\"Bola Ade\",...}}: the server knows who is asking, from the token alone.",
        }),
      },
      {
        id: "a-ce-authz",
        title: "Authorization: what are you allowed to do?",
        explain:
          "Authorization decides what an authenticated user may do. Its foundation is that identity cannot be forged: if a user could edit their token to say they are someone else, every permission check would be meaningless. Kobo Market's tokens are signed with an HMAC: change one character and the signature no longer matches. Always test that the server rejects a tampered token, not only that it accepts a good one.",
        terminalExercise: term("m4-auth", {
          goal: "Edit Bola's token to claim it belongs to user u_1002, and prove the server rejects it.",
          accept: [ME_FORGED],
          near: [{ command: ME_TOKEN, why: "That sends the genuine token, which is accepted. Send it with u_1001 replaced by u_1002." }],
          hint: "Bash can substitute inside a variable: ${TOKEN/u_1001/u_1002}.",
          success: "{\"error\":\"Sign in required\"}: the signature no longer matches the edited token, so verifyToken returns null. Identity cannot be forged without the server's secret.",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 22 · 4.7 – 4.8
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ce-l22-data-deps",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 4,
    covers: ["4.7", "4.8"],
    title: "Data, External Integrations, Packages and Lockfiles",
    subtitle: "What the data looks like, who else the system talks to, and what is really installed",
    estimatedMinutes: 30,
    intro:
      "At the bottom of every trace is data, and at the edges are other people's code: services the app calls and packages it installs. Knowing all three is knowing what the system really depends on.",

    atoms: [
      {
        id: "a-ce-data-model",
        title: "Data models: what a record looks like",
        explain:
          "A data model (or schema) is the shape of a record: which fields a user, product or order has. In a SQL database you read it in the table definitions or migrations; with an ORM, in model classes; in Kobo Market, in the seed script and the data file. Looking at one real record answers questions no amount of reading code will: is the password stored in plain text? Are prices in naira or kobo?",
        terminalExercise: term("m4-data", {
          goal: "Look at one real user record to see exactly which fields are stored.",
          accept: ["node -e \"console.log(require('./data/kobo.json').users[0])\""],
          near: [{ command: "node -e \"const d = require('./data/kobo.json'); console.log(Object.keys(d), d.users.length, d.products.length)\"", why: "That summarises the store (users, products, orders; 2 users, 6 products). Print one user record to see its fields." }],
          hint: "Print users[0] from data/kobo.json with node -e.",
          success: "id, name, email, role, salt and passwordHash, and no password: it is stored only as a salted scrypt hash. (This is local demo data; never print real users' records while debugging, as Module 9 explains.)",
        }),
      },
      {
        id: "a-ce-queries",
        title: "Queries: every way the data is read and written",
        explain:
          "A query is any operation that reads or changes stored data: SELECT and UPDATE in SQL, find() and save() with an ORM. When all data access goes through one module, its exported functions are the complete list of the application's queries.",
        terminalExercise: term("m4-data", {
          goal: "List every data operation the data module offers.",
          accept: ['rg -n "export async function" server/db/index.js'],
          near: [{ command: 'rg -n "fetch\\(" server', why: "That finds calls to other services. The data operations are the data module's exported functions." }],
          hint: "Search server/db/index.js for exported async functions.",
          success: "Five: findUserByEmail, findUserById, listProducts, findProduct, saveOrder. Only orders are ever written; users and products are read-only to the API.",
        }),
      },
      {
        id: "a-ce-integrations",
        title: "External integrations",
        explain:
          "An external integration is a call to someone else's system: a payment provider, an email service, a maps API. They matter disproportionately: they fail independently of your code, they need their own secrets, and they cost money. Find them by searching for outgoing requests (fetch, axios, an SDK's name) in the server code.",
        terminalExercise: term("m4-data", {
          goal: "Find every place the server calls another system over the network.",
          accept: ['rg -n "fetch\\(" server'],
          near: [{ command: 'rg -n "export async function" server/db/index.js', why: "That finds data operations. Outgoing network calls are made with fetch." }],
          hint: "Search server for fetch(.",
          success: "One: server/payments/paystack.js calls api.paystack.co to start a payment. That file is where payment failures will come from, and it needs PAYSTACK_SECRET_KEY.",
        }),
      },
      {
        id: "a-ce-transitive",
        title: "Direct and transitive dependencies",
        explain:
          "A direct dependency is listed in your package.json. A transitive dependency is a dependency of a dependency: you never asked for it, but it is installed and runs. Most of node_modules is transitive. npm ls PACKAGE shows why a package is installed by printing the path that leads to it.",
        terminalExercise: term("m4-deps", {
          goal: "scheduler is installed, but it is not in package.json. Find out why.",
          accept: ["npm ls scheduler"],
          near: [{ command: "npm ls react", why: "That shows react's place in the tree. Ask about scheduler itself." }],
          hint: "npm ls, then the package's name.",
          success: "react-dom@18.3.1 depends on scheduler@0.23.2. You did not choose it, but a vulnerability in it would be yours to deal with.",
        }),
      },
      {
        id: "a-ce-lockfile",
        title: "Versions and the lockfile",
        explain:
          "package.json states acceptable version RANGES: ^18.3.1 means \"18.3.1 or any later 18.x\". The lockfile (package-lock.json) records the EXACT version that was installed for every package, direct and transitive, with the address it came from and an integrity hash. Committing it means every machine installs exactly the same code (npm ci installs strictly from it).",
        terminalExercise: term("m4-deps", {
          goal: "Find the exact version of react the lockfile pins, and its integrity hash.",
          accept: [LOCK_REACT],
          near: [{ command: "npm ls react", why: "That shows what is installed on this machine. The lockfile is what guarantees every machine gets the same: search it." }],
          hint: "Search package-lock.json for the \"node_modules/react\" entry, with 3 lines after it.",
          success: "18.3.1, from registry.npmjs.org, with a sha512 integrity hash. If the downloaded file does not match that hash, npm refuses to install it.",
        }),
      },
      {
        id: "a-ce-unused-dep",
        title: "Is a dependency actually used?",
        explain:
          "A package can be installed and never imported: added for an idea that was dropped, or replaced by something else. It still costs install time, bundle size and security exposure. Check by searching the source for imports of it; an empty result is your answer (on Git Bash, after ruling out the leading-slash trap).",
        terminalExercise: term("m4-deps", {
          goal: "axios is a runtime dependency. Find out whether any source file uses it.",
          accept: ["rg -l axios src server"],
          near: [{ command: "npm ls axios", why: "That confirms axios@1.20.0 is installed. It cannot tell you whether anything imports it. Search the source." }],
          hint: "Search src and server for axios, listing files.",
          success: "Nothing: no file uses axios. The frontend uses fetch through src/api/client.js. An unused runtime dependency: note it for Module 8, where you remove it safely.",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 23 · 4.9 – 4.10
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ce-l23-navigation",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 5,
    covers: ["4.9", "4.10"],
    title: "Navigation Tools, and Root Cause Versus Symptom",
    subtitle: "The editor's map of the code, and finding why rather than what",
    estimatedMinutes: 30,
    intro:
      "Editors understand code: they know where a function is defined and every place it is called. Use that, and use the trace to reach the real cause of a problem rather than the place it shows up.",

    atoms: [
      {
        id: "a-ce-ide-nav",
        title: "References, definitions, symbols and call hierarchies",
        explain:
          "Your editor's language tools answer tracing questions directly. Go to Definition jumps to where a name is defined. Find All References lists every use. Call Hierarchy shows who calls a function, and who calls those, as a tree. Go to Symbol finds a function or class by name across the project. The terminal equivalent of Find All References is a whole-word search (rg -w), which also works on a server or in a project your editor cannot load.",
        table: {
          caption: "Navigation in VS Code (and Cursor, which is built on it).",
          headers: ["Question", "Command", "Shortcut (Windows/Linux)"],
          rows: [
            ["Where is this defined?", "Go to Definition", "F12"],
            ["Where is this used?", "Find All References", "Shift+F12"],
            ["Who calls this, and who calls them?", "Show Call Hierarchy", "Shift+Alt+H"],
            ["Find a function by name", "Go to Symbol in Workspace", "Ctrl+T"],
            ["Open a file by name", "Go to File", "Ctrl+P"],
          ],
        },
        terminalExercise: term("m4-nav", {
          goal: "From the terminal, find every reference to requireAuth as a whole word, with line numbers.",
          accept: ["rg -nw requireAuth"],
          near: [{ command: 'rg -n "function requireAuth"', why: "That finds the definition only. References are every use: search the whole word." }],
          hint: "rg with -n and -w (whole word).",
          success: "One definition (middleware/requireAuth.js:6), one import and two uses (router.js:11 and 14). /api/me and /api/orders are protected; nothing else is.",
        }),
      },
      {
        id: "a-ce-git-grep",
        title: "git grep: searching exactly what is committed",
        explain:
          "git grep searches only tracked files, so it ignores node_modules, build output and anything untracked without being told, prints forward-slash paths on every platform, and can search any past commit (git grep TEXT v1.0.0). It is installed wherever Git is, which makes it the reference search you can rely on in any repository.",
        terminalExercise: term("m4-nav", {
          goal: "Search only the committed source for requireAuth, with line numbers.",
          accept: ["git grep -n requireAuth"],
          near: [{ command: "rg -nw requireAuth", why: "Same results here, but rg searches the folder. git grep searches what Git tracks, and can search old versions too." }],
          hint: "git grep with -n.",
          success: "The same four lines, with forward-slash paths. Add a tag at the end (git grep -n requireAuth v1.0.0) and you search the code as it was at that release.",
        }),
      },
      {
        id: "a-ce-symptom-cause",
        title: "A symptom: the cart shows the wrong total",
        explain:
          "A customer reports: \"The cart said ₦61,000, but I was charged ₦59,500.\" That is a symptom: what someone observed. You traced both totals in this module: the cart page computes its own (src/pages/Cart.jsx) and the server computes another (server/services/orderService.js). Here are both calculations, as they are in the code, for that customer's cart: a fan (₦47,000) and a tote bag (₦12,500).",
        codeExercise: {
          language: JS,
          code:
            '// Cart.jsx\nconst DELIVERY_FEE = 150000;\n// orderService.js\nconst FREE_DELIVERY_FROM = 5000000;\n\nconst items = [\n  { name: "Rechargeable standing fan", price: 4700000, quantity: 1 },\n  { name: "Ankara tote bag", price: 1250000, quantity: 1 },\n];\nconst subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);\n\nconst cartPageTotal = subtotal + DELIVERY_FEE;\nconst serverTotal = subtotal + (subtotal >= FREE_DELIVERY_FROM ? 0 : DELIVERY_FEE);\n\nconsole.log("subtotal", subtotal / 100);\nconsole.log("cart page shows", cartPageTotal / 100);\nconsole.log("server charges", serverTotal / 100);\n',
          question: "What does it print? (Divide by 100 to get naira.)",
          expectedOutput: "subtotal 59500\ncart page shows 61000\nserver charges 59500",
          hint: "The subtotal is above ₦50,000. Which of the two calculations knows that?",
          successMessage: "The cart page adds ₦1,500 the server does not charge: exactly the customer's complaint, reproduced from the code.",
        },
      },
      {
        id: "a-ce-root-cause",
        title: "The root cause: when and why they diverged",
        explain:
          "The root cause is the reason the symptom exists, the change that, if undone or done properly, makes it impossible. Here the symptom is a wrong total; the cause is a business rule that lives in two places, one of which was updated. Git's pickaxe search (git log -S TEXT) finds the commits that added or removed a piece of text: the moment the two copies diverged.",
        terminalExercise: term("m4-rootcause", {
          goal: "Find the commit that introduced the free-delivery threshold on the server.",
          accept: ["git log --oneline -S FREE_DELIVERY_FROM"],
          near: [{ command: 'rg -n "DELIVERY_FEE|FREE_DELIVERY_FROM"', why: "That shows the current state: two definitions, one with a threshold. The pickaxe search finds WHEN the threshold arrived." }],
          hint: "git log with -S and the constant's name.",
          success: "68cb4b8, \"Free delivery on orders over ₦50,000\". Its --stat shows it changed only orderService.js and its test: the cart page was never updated.",
        }),
      },
      {
        id: "a-ce-fix-where",
        title: "Fixing the cause, not the symptom",
        explain:
          "A symptom fix makes this report go away; a root-cause fix makes the whole class of problem impossible. Both have their place (sometimes a quick patch buys time), but you should always know which one you are doing.",
        decision: {
          scenario: "You now know the cart page and the server each have their own delivery rule.",
          question: "Which is the root-cause fix?",
          options: [
            { id: "a", text: "Make the cart use the same rule as the server, from one shared definition (or show the server's totals), and add a test", why: "With one definition the two can never diverge again, and the test guards it. Module 8 and the capstone carry this out." },
            { id: "b", text: "Copy the threshold into Cart.jsx as well", whyWrong: "That fixes today's numbers and keeps two copies, ready to drift again." },
            { id: "c", text: "Add a note to the checkout page: \"total may differ\"", whyWrong: "That documents the symptom and leaves the cause." },
            { id: "d", text: "Remove free delivery", whyWrong: "That changes the business to hide a bug." },
          ],
          correct: "a",
          aftermath: "Symptom: where it shows. Cause: why it can happen. Fix the why.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 24 · 4.P
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ce-l24-trace-practical",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 6,
    covers: ["4.P"],
    title: "Practical: Trace the Sign-In, End to End",
    subtitle: "From the click, through validation, authentication and the data, to what the user sees",
    estimatedMinutes: 34,
    intro:
      "You traced the browser half of sign-in in Lesson 19. Now finish it: the server half, the data, and the way the answer travels back to the screen. Explain the actual code path, file by file, not a summary.",

    atoms: [
      {
        id: "a-ce-p-handler",
        title: "From the request to the business logic",
        explain:
          "The browser's request reaches server/router.js, which hands POST /api/login to login() in server/routes/auth.js. The handler reads the body and calls one function to do the real work. Find it, and where it is defined.",
        terminalExercise: term("m4-trace-login", {
          goal: "Find the function the login handler calls to check the password, and where it is defined.",
          accept: ['rg -n "authenticate" server'],
          near: [{ command: 'rg -n "api/login"', why: "That confirms the route and the frontend call. Now follow the handler into the service: authenticate." }],
          hint: "The handler calls authenticate. Search server for it.",
          success: "Defined in server/services/authService.js:38, imported and called by routes/auth.js:9.",
        }),
      },
      {
        id: "a-ce-p-db",
        title: "From the business logic to the data",
        explain:
          "authenticate normalises the email (trim, lowercase), looks the user up, verifies the password against the stored salted hash, and signs a token. The lookup is the link to the data layer.",
        terminalExercise: term("m4-trace-login", {
          goal: "Follow the user lookup into the data layer.",
          accept: ['rg -n "findUserByEmail" server'],
          near: [{ command: 'rg -n "authenticate" server', why: "You have found authenticate; now follow the call it makes to look the user up." }],
          hint: "authenticate calls findUserByEmail.",
          success: "Called at authService.js:39 with email.trim().toLowerCase(), defined at db/index.js:14. So BOLA@kobo.test signs in fine, because the email is normalised first.",
        }),
      },
      {
        id: "a-ce-p-storage",
        title: "From the data layer to storage",
        explain:
          "The data layer's load() reads the file named by config.dataFile once and keeps it in memory. That setting is the final link of the chain, and the one most likely to differ between machines.",
        terminalExercise: term("m4-trace-login", {
          goal: "Find where the data file's location is set and where it is read.",
          accept: ['rg -n "dataFile" server'],
          near: [{ command: 'rg -n "findUserByEmail" server', why: "That is one step back. Follow config.dataFile to where the file is set and read." }],
          hint: "Search server for dataFile.",
          success: "Set in config.js:5 (DATA_FILE, default data/kobo.json), read in db/index.js:10. If DATA_FILE is wrong on a server, every login fails: remember this in Module 7.",
        }),
      },
      {
        id: "a-ce-p-response",
        title: "The way back: from a 401 to the message on screen",
        explain:
          "The trace is not done until the answer reaches the screen. For a wrong password: the handler responds 401 with {\"error\":\"Invalid email or password\"}; request() in src/api/client.js sees response.ok is false and throws new Error(data.error); signIn in useAuth does not catch it, so it reaches handleSubmit's catch in Login.jsx, which calls setError(err.message); the form re-renders with <p role=\"alert\">.",
        example: shown("m4-auth", LOGIN_WRONG),
        decision: {
          scenario: "A tester reports: \"With a wrong password, the form shows nothing and the button stays on 'Signing in…' for ever.\"",
          question: "Given the path above, which link would you check first?",
          options: [
            { id: "a", text: "Whether the error reaches handleSubmit's catch and finally: if request() did not throw on a 401, or the catch were missing, busy would never be reset", why: "\"Signing in…\" is shown while busy is true, and only the finally block sets it back. A broken link in the error path leaves it set." },
            { id: "b", text: "The password hashing", whyWrong: "The server answered correctly; the symptom is in how the browser handles the answer." },
            { id: "c", text: "The CSS for the error message", whyWrong: "The button is stuck too, which CSS cannot cause." },
            { id: "d", text: "The data file", whyWrong: "The lookup worked: the server answered 401." },
          ],
          correct: "a",
          aftermath: "Knowing the return path tells you which layer a symptom can come from.",
        },
      },
      {
        id: "a-ce-p-writeup",
        title: "Writing the trace",
        explain:
          "A trace write-up lists each hop as \"file:line function: what it does\", in order, there and back, and notes every place the chain can stop early (validation, 400, 401). It is evidence: anyone can open each file at the line you give and check it.",
        decision: {
          scenario: "Two write-ups of the sign-in flow are submitted.",
          question: "Which one meets the assignment?",
          options: [
            { id: "a", text: "\"Login.jsx:9 handleSubmit checks for @ (stops if missing) → App.jsx:30 onSignIn = useAuth.signIn → api/auth.js login → client.js request POST /api/login → router.js:10 → routes/auth.js:4 login (400 if a field is missing) → authService.js:38 authenticate → db/index.js:14 findUserByEmail → data/kobo.json; verifyPassword; 401 or 200 + token → client.js throws on 401 → Login.jsx catch → setError → alert\"", why: "Every hop has a file, a line and a job, both directions, with the early exits. It can be checked line by line." },
            { id: "b", text: "\"The login form sends the details to the backend, which checks them in the database and logs the user in.\"", whyWrong: "True, and could describe any app. No file, no line, nothing to check." },
            { id: "c", text: "An AI-generated summary of the whole repository", whyWrong: "The assignment asks for the actual code path, verified by you." },
            { id: "d", text: "A screenshot of the login page", whyWrong: "That shows the start of the chain only." },
          ],
          correct: "a",
          aftermath: "Specific, ordered, checkable: the standard for every trace you write.",
        },
      },
    ],

    task: {
      title: "Module practical: trace the sign-in, end to end",
      intro:
        "On your own project (or Kobo Market's code, following the lessons), trace what happens from clicking Sign In to the final screen. Explain the actual code path; do not ask an AI to summarise the project.",
      prompts: [
        "The click: the element, its event and its handler, with file and line.",
        "Validation: what the browser checks before sending anything, and what happens if it fails.",
        "The request: the function that sends it, the method, URL and body (show it with curl).",
        "The server: route, handler, service and data access, hop by hop, with files and lines.",
        "Authentication: how the password is checked and how the session or token is created.",
        "The return path: what the user sees on success, on a wrong password, and on a server error, and the code that decides each.",
        "One thing you discovered along the way that you would raise with the team.",
      ],
      closing: "Next module: Git, where you learn to see exactly what changed in a path like this one, and to recover when a change breaks it.",
    },
    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
