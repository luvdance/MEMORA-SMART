/**
 * CODEBASE ENGINEERING · MODULE 7 · DEBUGGING, LOGS, TESTS AND RUNTIME INVESTIGATION
 *
 * Curriculum 7.1 – 7.12 and the practical, 7.P. Terminal errors, stack
 * traces and the browser console; DevTools; server logs, build errors and
 * failed requests; kinds of error; reproduction and minimal cases; searching
 * for the failing code; unit, integration and end-to-end tests; tests as a
 * specification; a test before the fix; regressions; lint and static
 * analysis; evidence that a fix worked. The practical is four faults at once.
 *
 * Every error here was produced for real: faults were introduced into Kobo
 * Market and the commands, the API and its log were recorded.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

import { term, shown } from "./ce-helpers.js";

export const SECTION_ID = "ce-s7-debugging";
const MODULE = "ce-m7-debugging";

const READS_RESPONSE = 'rg -n "data\\.(items|products)" src';
const LIST_TESTS = 'rg -n "^test\\(" tests';

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 39 · 7.1 – 7.2
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ce-l39-errors-devtools",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 1,
    covers: ["7.1", "7.2"],
    title: "Reading Errors and Stack Traces; Browser DevTools",
    subtitle: "Most error messages tell you exactly what is wrong, and where, if you read them",
    estimatedMinutes: 30,
    intro:
      "The most common debugging mistake is not reading the error. Messages look intimidating, but they have a structure: what went wrong, where, and how the program got there. Read them top to bottom and most bugs are found in a minute.",

    atoms: [
      {
        id: "a-ce-read-errors",
        title: "The anatomy of an error message",
        explain:
          "A typical error has three parts. The location: the file, line and column (orders.js:11), often with the line printed and a caret ^ under the exact spot. The type and message: SyntaxError: Unexpected token ';', TypeError: Cannot read properties of null. And, for runtime errors, the stack trace. node --check FILE parses a file without running it, which isolates syntax errors.",
        terminalExercise: term("m7-syntax", {
          intro: "A change has broken the API: it will not start.",
          goal: "Check server/routes/orders.js for syntax errors without running anything.",
          accept: ["node --check server/routes/orders.js"],
          near: [{ command: "npm start", why: "That shows the same SyntaxError, but buried under ten frames of Node's module loader. node --check gives you just the file's problem." }],
          hint: "node with --check and the file.",
          success: "orders.js line 11, caret under the ;: \"const lines = [;\". Unexpected token ';' means the parser expected the array to continue. One character, found in ten seconds.",
        }),
      },
      {
        id: "a-ce-stack-trace",
        title: "Stack traces",
        explain:
          "A stack trace lists the chain of function calls that were active when the error happened, most recent first. The top frame is where it failed; lower frames are how execution got there. Frames inside node:internal or node_modules are rarely the cause: scan down to the first frame in your own code. That is almost always where to look.",
        terminalExercise: term("m7-stack", {
          intro: "The server now logs the whole error object. A request for an unknown product returned 500.",
          goal: "Read the server's log to find the exact line that failed.",
          accept: ["cat server.log"],
          near: [{ command: "curl -s localhost:4000/api/products/nope", why: "That shows what the client got: a generic 500. The details are in the server's log." }],
          hint: "The server writes to server.log.",
          success: "TypeError: Cannot read properties of null (reading 'name'), at getProduct, products.js line 11, column 62. findProduct returned null for \"nope\", and the handler read .name from it without checking.",
        }),
      },
      {
        id: "a-ce-browser-console",
        title: "Browser console messages",
        explain:
          "In the browser, uncaught errors appear in DevTools' Console (F12, or Ctrl+Shift+J / Cmd+Option+J) with the same anatomy: type, message, and a stack with file:line links. The browser runs the same JavaScript engine as Node (V8 in Chrome and Edge), so the messages read the same. React also prints which component was rendering. Click the file:line to jump to the source; source maps take you to src/ rather than the bundled file.",
        example: shown("m7-minimal", "node repro.mjs"),
        decision: {
          scenario: "After a deploy, the products page is blank. The console shows: TypeError: Cannot read properties of undefined (reading 'map'), at Products (Products.jsx:31).",
          question: "What does the message tell you?",
          options: [
            { id: "a", text: "On line 31 of Products.jsx, something that should be an array is undefined: the products list, so trace where it is set", why: "\"reading 'map'\" names the property; \"undefined\" names what it was read from. Products.jsx:31 maps over products, so products was never set to an array." },
            { id: "b", text: "React is broken", whyWrong: "The error is in your component, at your line." },
            { id: "c", text: "The map component failed to load", whyWrong: "map is the array method, not a map on screen." },
            { id: "d", text: "The server is down", whyWrong: "Possibly related, but the message is about a variable on line 31. Follow that first." },
          ],
          correct: "a",
          aftermath: "Type, message, location: three facts before any guess.",
        },
      },
      {
        id: "a-ce-devtools",
        title: "DevTools: breakpoints, variables and network requests",
        explain:
          "DevTools is a debugger for the browser. Sources lets you set a breakpoint on a line (click the line number, or write debugger; in the code): execution pauses there, and you can hover over variables, see the scope and the call stack, and step line by line. Network lists every request the page made, with its URL, method, status, headers, request body and response: the fastest way to tell a frontend bug from a backend one. Application shows localStorage, cookies and cached data.",
        table: {
          caption: "DevTools panels for debugging.",
          headers: ["Panel", "Answers"],
          rows: [
            ["Console", "What errors happened, and where?"],
            ["Sources (breakpoints)", "What were the variables at this line? Which path did execution take?"],
            ["Network", "What did the page ask the server for, and what came back?"],
            ["Application", "What is stored in localStorage, cookies, the cache?"],
          ],
        },
        decision: {
          scenario: "The products page is empty. In the Network panel, the request goes to /api/product?category= and the status is 404.",
          question: "Where is the bug most likely to be?",
          options: [
            { id: "a", text: "In the frontend code that builds the URL: the API's route is /api/products, and the page is asking for /api/product", why: "Network shows exactly what the page requested. The server correctly answers 404 for a URL it does not have." },
            { id: "b", text: "In the server's product handler", whyWrong: "The request never reached it: the URL did not match the route." },
            { id: "c", text: "In the CSS", whyWrong: "The data never arrived." },
            { id: "d", text: "In the database", whyWrong: "No query ran: the URL was wrong." },
          ],
          correct: "a",
          aftermath: "Network separates \"asked for the wrong thing\" from \"got the wrong answer\".",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 40 · 7.3 – 7.4
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ce-l40-server-errors",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 2,
    covers: ["7.3", "7.4"],
    title: "Server Logs, Build Errors, Failed Requests; Kinds of Error",
    subtitle: "Where errors are recorded, and sorting them by kind",
    estimatedMinutes: 32,
    intro:
      "When the server fails, the browser only sees \"Internal server error\": deliberately, so internal details do not leak to users. The real story is in the server's log. And knowing what KIND of error you are facing tells you where to look next.",

    atoms: [
      {
        id: "a-ce-server-logs",
        title: "The server log",
        explain:
          "A server writes what it is doing, and what went wrong, to its log: the terminal it runs in, a file, or (in production) a logging service. A 500 response tells the client only that something failed; the matching log line says what. Find the log line for the failing request by its time, method and path.",
        terminalExercise: term("m7-runtime", {
          intro: "A request for an unknown product returns 500 Internal Server Error.",
          goal: "Find out what really happened on the server.",
          accept: ["cat server.log"],
          near: [{ command: "curl -si localhost:4000/api/products/nope", why: "That is what the client sees: 500 and a generic message. The cause is in the server's log." }],
          hint: "Read server.log.",
          success: "[error] GET /api/products/nope: Cannot read properties of null (reading 'name'). The log names the request and the error, though not the line.",
        }),
      },
      {
        id: "a-ce-log-quality",
        title: "Logs that help: the error, not just the message",
        explain:
          "Kobo Market's original logging records err.message, which says what went wrong but not where. Logging the error object itself (console.error(..., err)) includes the stack. Good logs also include what was being attempted (method, path, an id) and never include secrets, tokens or personal data.",
        example: [
          "Logging err.message:",
          shown("m7-runtime", "cat server.log"),
          "",
          "Logging the error object:",
          shown("m7-stack", "cat server.log"),
        ].join("\n"),
        decision: {
          scenario: "You are reviewing a pull request that changes the error log from err.message to the whole err object.",
          question: "Is it an improvement, and is there anything to watch?",
          options: [
            { id: "a", text: "Yes: the stack gives the file and line; but make sure no error object can carry secrets or personal data into the logs", why: "Stacks make server errors findable. Logs are read by many people and kept for a long time, so what goes into them still matters." },
            { id: "b", text: "No: stack traces are only useful in development", whyWrong: "They are most useful in production, where you cannot attach a debugger." },
            { id: "c", text: "Yes, and also send the stack to the client", whyWrong: "Internal details in responses help attackers. Logs, not responses." },
            { id: "d", text: "It makes no difference", whyWrong: "Compare the two logs above." },
          ],
          correct: "a",
          aftermath: "Log enough to find the bug; never enough to leak.",
        },
      },
      {
        id: "a-ce-error-kinds",
        title: "Six kinds of error",
        explain:
          "Sorting an error by kind tells you where the cause lives. Syntax: the code cannot be parsed (a missing bracket). Runtime: valid code fails while running (reading a property of null). Dependency: a package is missing, the wrong version, or broken. Configuration: the code is fine but a setting is wrong (a bad environment variable, a wrong path). Network: something cannot be reached (server down, wrong port, DNS, CORS). Logic: no error at all, just the wrong result, like the cart's total.",
        table: {
          caption: "Kinds of error, with Kobo Market examples.",
          headers: ["Kind", "Looks like", "Look in"],
          rows: [
            ["Syntax", "SyntaxError: Unexpected token ';'", "The file and line named"],
            ["Runtime", "TypeError: Cannot read properties of null", "The first stack frame in your code"],
            ["Dependency", "ERR_MODULE_NOT_FOUND: Cannot find package 'dayjs'", "package.json, npm ls, the importing file"],
            ["Configuration", "ENOENT ... data/kobo.jsn", ".env, the host's settings, config files"],
            ["Network", "curl: (7) Failed to connect", "Is it running? Which port? Which host?"],
            ["Logic", "No error; the cart says ₦61,000", "The trace, the rule, the tests"],
          ],
        },
        decision: {
          scenario: "The server logs: ENOENT: no such file or directory, open 'C:\\Users\\ada\\kobo-market\\data\\kobo.jsn'. data/kobo.json exists.",
          question: "What kind of error is it?",
          options: [
            { id: "a", text: "Configuration: a setting (DATA_FILE) points to a misspelled path; the code and the data are fine", why: "The file the code is asked to open does not exist; the one that exists is not the one configured." },
            { id: "b", text: "Syntax", whyWrong: "The code parsed and ran." },
            { id: "c", text: "Dependency", whyWrong: "No package is involved." },
            { id: "d", text: "Logic", whyWrong: "There is an explicit error, about a path." },
          ],
          correct: "a",
          aftermath: "Configuration errors are fixed in configuration, not code.",
        },
      },
      {
        id: "a-ce-network-error",
        title: "Failed requests: when nothing answers",
        explain:
          "When a request fails before reaching any code, there is no log line on the server, because the server never saw it. curl -s, which you have used for quiet output, also hides curl's own errors: the request just prints nothing. curl -sS stays quiet on success but shows errors; echo $? shows the exit code (7 means could not connect).",
        terminalExercise: term("m7-network", {
          intro: "The API is not running in this terminal.",
          goal: "A request prints nothing. Make curl show you why.",
          accept: ["curl -sS localhost:4000/api/products"],
          near: [
            { command: "curl -s localhost:4000/api/products", why: "-s silences curl's errors too, which is why nothing appears. Add -S to show errors." },
            { command: "curl -s localhost:4000/api/products; echo \" exit=$?\"", why: "Exit code 7 says it failed to connect, but -S makes curl say it in words." },
          ],
          hint: "-s keeps it quiet; add -S to show errors anyway.",
          success: "curl: (7) Failed to connect to localhost port 4000: nothing is listening. A network error: start the server, or check the port.",
        }),
      },
      {
        id: "a-ce-build-errors",
        title: "Build-time errors: found before anything runs",
        explain:
          "Build errors are reported by tools that read the code without running it: the bundler (npm run build), the type checker, the linter. They are the cheapest errors there are: found in seconds, on every file at once, before a user can hit them. ESLint parses every file, so it reports syntax errors across the whole project.",
        terminalExercise: term("m7-syntax", {
          goal: "Check every file in the project for parse errors at once, without starting the server.",
          accept: ["npm run lint"],
          near: [{ command: "node --check server/routes/orders.js", why: "That checks one file you already suspect. The linter parses every file in the project." }],
          hint: "The project's lint script.",
          success: "One problem, in orders.js at 11:18: Parsing error: Unexpected token ;. On a big project this finds the syntax error you did not know about.",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 41 · 7.5 – 7.6
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ce-l41-reproduce",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 3,
    covers: ["7.5", "7.6"],
    title: "Reproduce It, Reduce It, Find It",
    subtitle: "A bug you can trigger on demand is half fixed",
    estimatedMinutes: 30,
    intro:
      "You cannot fix what you cannot see. The first job with any bug report is to make it happen on purpose, every time, then to strip away everything that is not needed to make it happen.",

    atoms: [
      {
        id: "a-ce-reproduce",
        title: "Reproducing a bug consistently",
        explain:
          "A reproduction is a recipe: the exact steps, data, environment and expected versus actual result. Collect them from the report, then try. If it does not happen for you, the difference between your setup and the reporter's (browser, account, data, configuration, version) is itself the clue. Write the recipe down: it becomes the bug's test.",
        decision: {
          scenario: "A bug report says: \"Checkout sometimes shows the wrong total.\"",
          question: "What do you need before you can investigate?",
          options: [
            { id: "a", text: "A recipe: which products and quantities, the total shown, the total charged, and when; then reproduce it with that cart", why: "\"Sometimes\" usually means \"under conditions nobody has written down\". Here the condition turns out to be a subtotal of ₦50,000 or more." },
            { id: "b", text: "Nothing: rewrite the checkout", whyWrong: "Without a reproduction you cannot tell whether a rewrite fixed it." },
            { id: "c", text: "Ask an AI to fix \"wrong totals\"", whyWrong: "It has even less information than you." },
            { id: "d", text: "Close it as cannot-reproduce", whyWrong: "You have not tried to reproduce it yet." },
          ],
          correct: "a",
          aftermath: "\"Sometimes\" is a condition you have not found yet.",
        },
      },
      {
        id: "a-ce-minimal-case",
        title: "Reducing it to a minimal case",
        explain:
          "A minimal case is the smallest program, input or set of steps that still shows the bug. Remove everything else: the UI, the network, the other features. If the bug disappears when you remove something, that something is involved. Minimal cases make causes obvious, make good test cases, and are the best thing to give an AI or a colleague.",
        terminalExercise: term("m7-minimal", {
          intro: "The products page is blank, with the TypeError from Lesson 39. repro.mjs is a five-line copy of what Products.jsx does with the API's response.",
          goal: "Run the minimal case and see whether it shows the same error.",
          accept: ["node repro.mjs"],
          near: [{ command: "cat repro.mjs", why: "That shows the case. Run it to see whether five lines reproduce the bug." }],
          hint: "node and the file.",
          success: "The same TypeError, from five lines: data.items is undefined because the response's key is products. No React, no network, no server: the cause is reading the wrong key.",
        }),
      },
      {
        id: "a-ce-search-failing",
        title: "Searching for the failing code",
        explain:
          "With a minimal case in hand you know what to look for: here, code that reads the wrong property of the response. Search for both the wrong and the right spelling at once; seeing which files use which is often the whole answer.",
        terminalExercise: term("m7-broken-3", {
          intro: "The frontend has been broken in two ways. The API is running.",
          goal: "Find the frontend code that reads the products response, whether it uses data.items or data.products.",
          accept: [READS_RESPONSE],
          near: [{ command: 'curl -s "localhost:4000/api/products?category=fashion"', why: "That confirms the API returns a products key. Now find the code that reads it." }],
          hint: "Search src for data.items or data.products (escape the dot).",
          success: "Products.jsx line 14 reads data.items, while the API (as curl shows) returns products. One word.",
        }),
      },
      {
        id: "a-ce-search-endpoint",
        title: "Searching for an endpoint",
        explain:
          "For a failed request, search the code for the URL as it was requested. Network (or a 404 in the server log) gives you the exact path; a fixed-string search (rg -F) finds where it is built. Remember Git Bash's leading-slash trap: search without the leading /.",
        terminalExercise: term("m7-broken-3", {
          goal: "The page requests /api/product, which does not exist. Find where the frontend builds that URL.",
          accept: ['rg -n -F "api/product" src'],
          near: [{ command: "curl -si localhost:4000/api/product", why: "That proves the URL is wrong (404, router's \"Not found\"). Now find where it is built: search src." }],
          hint: "A fixed-string search for api/product in src.",
          success: "src/api/products.js line 5 requests /api/product${query}: an s missing. (Products.jsx also matches, because \"../api/products.js\" contains the text: a search result is a lead, not a verdict.)",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 42 · 7.7 – 7.8
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ce-l42-tests",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 4,
    covers: ["7.7", "7.8"],
    title: "Unit, Integration and End-to-End Tests; Tests as the Specification",
    subtitle: "What each kind of test proves, how to run just the ones you need, and what tests tell you about intent",
    estimatedMinutes: 30,
    intro:
      "Tests are the project's statement of what it is supposed to do, written in code that checks itself. Learn what each kind can prove, how to run them selectively, and how to read them as documentation.",

    atoms: [
      {
        id: "a-ce-test-kinds",
        title: "Three kinds of test",
        explain:
          "A unit test checks one function or component in isolation: fast, precise, many of them (Kobo Market's tests are unit tests). An integration test checks several parts together: a route, its service and the data layer, with a real request. An end-to-end (E2E) test drives the whole application as a user would, in a real browser (Playwright, Cypress): slow, but the only kind that proves a user can actually sign in. Most teams have many unit tests, fewer integration tests, and a handful of E2E tests on the critical paths.",
        table: {
          caption: "Kinds of test.",
          headers: ["Kind", "Checks", "Speed", "Kobo Market example"],
          rows: [
            ["Unit", "One function", "Milliseconds", "orderTotals adds delivery correctly"],
            ["Integration", "Parts together, e.g. route + service + data", "Seconds", "POST /api/login returns 401 for a wrong password"],
            ["End-to-end", "The whole app, through the UI", "Seconds to minutes", "A user signs in and sees \"Hello, Bola\""],
          ],
        },
        decision: {
          scenario: "You want to be sure the cart page and the server agree on the total a customer pays.",
          question: "Which test proves that?",
          options: [
            { id: "a", text: "An end-to-end test: add products worth ₦59,500 in the browser, check the total shown, check out, and compare with the order the server created", why: "The bug lives between the two layers, so only a test that crosses both can catch it." },
            { id: "b", text: "The existing unit test of orderTotals", whyWrong: "It tests the server's rule only. It passed the whole time the bug existed." },
            { id: "c", text: "A unit test of formatPrice", whyWrong: "Formatting is not the problem." },
            { id: "d", text: "No test can check that", whyWrong: "An E2E test can; or remove the duplication so a unit test is enough." },
          ],
          correct: "a",
          aftermath: "Choose the kind of test by where the bug can live.",
        },
      },
      {
        id: "a-ce-run-one-file",
        title: "Running one test file",
        explain:
          "On a big project the whole suite can take minutes. While working on one area, run just its tests: node --test FILE (Jest: npx jest FILE; pytest: pytest FILE). Run the whole suite before you commit.",
        terminalExercise: term("m7-tests", {
          goal: "Run only the order-totals tests.",
          accept: ["node --test tests/orderService.test.js"],
          near: [{ command: "npm test -- --test-name-pattern=delivery", why: "That filters by test name across all files. The goal is one file: node --test and its path." }],
          hint: "node --test and the file.",
          success: "2 tests, 2 pass, in about a tenth of a second.",
        }),
      },
      {
        id: "a-ce-filter-tests",
        title: "Running tests by name",
        explain:
          "Most runners can select tests by name: node --test --test-name-pattern=TEXT (Jest -t, pytest -k). Through npm, arguments after -- are passed on to the script: npm test -- --test-name-pattern=delivery. Read the output carefully: here, files with no matching test are still loaded and reported as a whole.",
        terminalExercise: term("m7-tests", {
          goal: "Through npm, run only the tests whose names mention delivery.",
          accept: ["npm test -- --test-name-pattern=delivery"],
          near: [{ command: "node --test tests/orderService.test.js", why: "That runs one file. Filter by name across the suite: npm test -- --test-name-pattern=delivery." }],
          hint: "npm test, then --, then the pattern flag.",
          success: "Both delivery tests run (the -- passed the flag through to node --test). The auth and price files show as passing files with no tests run in them: \"4 tests\" is two delivery tests plus two file-level entries.",
        }),
      },
      {
        id: "a-ce-tests-as-spec",
        title: "Reading tests to discover intended behaviour",
        explain:
          "When code is unclear, its tests often say what it is meant to do, with concrete examples: inputs, expected outputs, edge cases someone thought worth checking. List the test names first: together they read like a specification. A behaviour with no test is a behaviour nobody has promised.",
        terminalExercise: term("m7-tests", {
          goal: "List every behaviour the test suite promises, by test name.",
          accept: [LIST_TESTS],
          near: [{ command: "npm test -- --test-name-pattern=delivery", why: "That runs some tests. To read the promises, list the test definitions: lines starting with test(." }],
          hint: "Search tests for lines that start with test(.",
          success: "Eight promises: two about prices, four about passwords and tokens, two about order totals. Nothing about routes, sign-in as a whole, the cart page or payments: those behaviours are unspecified.",
        }),
      },
      {
        id: "a-ce-missing-tests",
        title: "What the absence of tests tells you",
        explain:
          "An untested area is not necessarily broken, but any change there is unprotected: nothing will tell you if you break it. Before changing untested code, add a test that pins down its current behaviour (a characterisation test), so your change cannot alter it unnoticed.",
        decision: {
          scenario: "You must change createOrder in server/routes/orders.js. No test covers it.",
          question: "What do you do first?",
          options: [
            { id: "a", text: "Write a test that records what createOrder does now (empty cart → 400, unknown product → 400, valid cart → 201 with server-side prices), see it pass, then make the change", why: "Now the change is protected: if it alters anything you did not intend, a test fails." },
            { id: "b", text: "Make the change carefully and test by hand once", whyWrong: "Next month's change gets no protection either." },
            { id: "c", text: "Ask an AI to make the change and write tests afterwards", whyWrong: "Tests written after the change describe the new behaviour, bugs included." },
            { id: "d", text: "Avoid changing untested code ever", whyWrong: "Then nothing improves. Add the test, then change it." },
          ],
          correct: "a",
          aftermath: "Pin behaviour down before you move it.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 43 · 7.9 – 7.10
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ce-l43-test-first",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 5,
    covers: ["7.9", "7.10"],
    title: "A Failing Test Before the Fix; Proving Nothing Else Broke",
    subtitle: "Making the bug measurable first, with AI's help, then guarding against regressions",
    estimatedMinutes: 30,
    intro:
      "The most reliable way to fix a bug is to first write a test that fails because of it. The test proves you understood the bug, proves the fix works, and stops it coming back. AI is very good at writing that test, if you ask for it before the fix.",

    atoms: [
      {
        id: "a-ce-ai-test-prompt",
        title: "Asking AI for the test first",
        explain:
          "Refunds are displayed as \"₦-1,500.00\"; finance wants \"-₦1,500.00\". Instead of \"fix formatPrice\", ask: \"Write a test in tests/formatPrice.test.js asserting formatPrice(-150000) returns '-₦1,500.00'. Do not change formatPrice. Run it and show me that it fails.\" Keeping the test and the fix separate means the AI cannot quietly write a test that agrees with a wrong implementation.",
        decision: {
          scenario: "You ask an agent to \"fix the refund formatting and add a test\". It changes formatPrice and adds a test, and everything passes.",
          question: "What can you not tell from this?",
          options: [
            { id: "a", text: "Whether the test would have failed before the fix: it might pass with the old code too, and so prove nothing", why: "A test only proves a fix if you have seen it fail without the fix. Ask for the failing test first, separately." },
            { id: "b", text: "Whether the tests pass", whyWrong: "They do; that is the one thing you can tell." },
            { id: "c", text: "Which file was changed", whyWrong: "git diff shows that." },
            { id: "d", text: "Nothing is uncertain", whyWrong: "The test's value is unproven." },
          ],
          correct: "a",
          aftermath: "Red, then green. A test you never saw fail proves nothing.",
        },
      },
      {
        id: "a-ce-test-first",
        title: "Red: the test fails for the right reason",
        explain:
          "Run the new test before touching the code. It must fail, and fail for the reason you expect: the assertion about the minus sign, not an import error or a typo in the test. node:test shows actual and expected side by side.",
        terminalExercise: term("m7-test-first", {
          intro: "The new refund test has been added. formatPrice has not been changed.",
          goal: "Run the price tests and check the new one fails for the right reason.",
          accept: ["node --test tests/formatPrice.test.js"],
          hint: "node --test and the price test file.",
          success: "1 fail: actual '₦-1,500.00', expected '-₦1,500.00'. It fails exactly because of the bug. Now you may fix it.",
        }),
      },
      {
        id: "a-ce-fix-proves",
        title: "Green: the fix makes it pass",
        explain:
          "Make the smallest change that makes the test pass: here, format the absolute value and put the sign in front. Then run the same test again.",
        terminalExercise: term("m7-test-fixed", {
          intro: "formatPrice now puts the minus sign before ₦.",
          goal: "Run the price tests again.",
          accept: ["node --test tests/formatPrice.test.js"],
          near: [{ command: "git diff --stat", why: "That shows the change is small. First prove it works: run the price tests." }],
          hint: "The same command as before.",
          success: "3 of 3 pass: the refund test is green, and the two existing price tests still pass.",
        }),
      },
      {
        id: "a-ce-regression",
        title: "Verifying nothing else broke",
        explain:
          "A regression is something that used to work and no longer does. After any fix, run the whole suite, not just the test for the bug: the change may have affected code you were not thinking about. For a change to shared code, also exercise the main features by hand or with E2E tests.",
        terminalExercise: term("m7-test-fixed", {
          goal: "Run the entire test suite to check the fix did not break anything else.",
          accept: ["npm test 2>&1 | tail -n 8"],
          near: [{ command: "node --test tests/formatPrice.test.js", why: "That runs only the price tests. Run the whole suite to rule out regressions." }],
          hint: "npm test, keeping just the summary at the end.",
          success: "9 tests, 9 pass: the original eight plus the new one. No regressions, by evidence.",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 44 · 7.11 – 7.12
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ce-l44-static-evidence",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 6,
    covers: ["7.11", "7.12"],
    title: "Linting, Formatting, Type Checking and Static Analysis; Evidence",
    subtitle: "Tools that find bugs without running the code, and how to prove a fix worked",
    estimatedMinutes: 28,
    intro:
      "Some bugs are found by reading the code automatically: an undefined variable, an unused value, a type mismatch. And whatever the bug, \"I fixed it\" means nothing without the evidence to show it.",

    atoms: [
      {
        id: "a-ce-lint",
        title: "What a linter catches that tests miss",
        explain:
          "A linter (ESLint for JavaScript, Ruff for Python) reads every file and reports likely mistakes: undefined names, unused variables, unreachable code, dangerous patterns. It needs no tests and checks code no test reaches. Kobo Market has no tests for its routes, so a typo there would only be found by a customer, or by lint.",
        terminalExercise: term("m7-lint", {
          intro: "Two small mistakes have been introduced. The tests still pass.",
          goal: "Find problems the tests cannot see, without running the code.",
          accept: ["npm run lint"],
          near: [{ command: "npm test 2>&1 | tail -n 3", why: "The tests pass: nothing tests the orders route. Run the linter." }],
          hint: "The project's lint script.",
          success: "Two errors: 'ordr' is not defined in orders.js:19 (a typo that would crash every order) and an unused 'discount' in Cart.jsx:9. Both invisible to the tests.",
        }),
      },
      {
        id: "a-ce-static-kinds",
        title: "Formatting, type checking and static analysis",
        explain:
          "Formatters (Prettier, Black) rewrite code into one consistent style, so reviews are about substance; they never change behaviour. Type checkers (TypeScript's tsc, mypy) check that values are used consistently with their types, catching \"passed a string where a number was expected\" before running. Static analysis is the general term for all of these, plus security scanners (CodeQL, Semgrep) that look for patterns like injection or leaked secrets. Run them in CI so every change gets them.",
        table: {
          caption: "Tools that read code without running it.",
          headers: ["Tool", "Finds", "Examples"],
          rows: [
            ["Linter", "Likely mistakes, risky patterns", "ESLint, Ruff"],
            ["Formatter", "Inconsistent style (and fixes it)", "Prettier, Black"],
            ["Type checker", "Values used with the wrong type", "TypeScript (tsc), mypy"],
            ["Security scanner", "Vulnerable patterns, secrets", "CodeQL, Semgrep, secret scanners"],
          ],
        },
        decision: {
          scenario: "Lint reports 'ordr' is not defined in orders.js. A colleague says: \"Tests pass, so ship it, and fix lint later.\"",
          question: "What is the right call?",
          options: [
            { id: "a", text: "Fix it now: an undefined name in createOrder will throw on every order; the tests pass only because nothing tests that route", why: "Lint found a real crash. \"Tests pass\" means only \"the tested paths work\"." },
            { id: "b", text: "Ship: lint is about style", whyWrong: "no-undef is a correctness rule, not style." },
            { id: "c", text: "Disable the rule", whyWrong: "That hides a crash, the Module 5 AI's move." },
            { id: "d", text: "Ship and watch the error logs", whyWrong: "Customers would find it for you." },
          ],
          correct: "a",
          aftermath: "Lint errors are bugs found early. Treat them like failing tests.",
        },
      },
      {
        id: "a-ce-evidence",
        title: "The scope of a fix is evidence too",
        explain:
          "Part of proving a fix is showing that it changed only what it should. git diff --stat after a fix should list the files you meant to touch and nothing else, with small numbers: a two-line bug rarely needs a two-hundred-line fix.",
        terminalExercise: term("m7-test-fixed", {
          goal: "Show the scope of the refund fix: which files changed and by how much.",
          accept: ["git diff --stat"],
          near: [{ command: "npm test 2>&1 | tail -n 8", why: "That proves it works. The scope is shown by git diff --stat." }],
          hint: "git diff --stat.",
          success: "Two files: the function (3 lines) and its test (4 lines). Small, targeted, and the test arrived with the fix.",
        }),
      },
      {
        id: "a-ce-evidence-report",
        title: "What proof looks like",
        explain:
          "Evidence that a fix worked is concrete and repeatable: the failing output before, the passing output after, from the same command; the whole suite passing; lint passing; the diff's scope; and, for user-facing bugs, the reproduction recipe now giving the right result. Put it in the pull request, so the reviewer does not have to take your word for it.",
        decision: {
          scenario: "Which pull request description proves the refund fix?",
          question: "Choose one.",
          options: [
            { id: "a", text: "\"Before: node --test tests/formatPrice.test.js → 1 fail (actual '₦-1,500.00', expected '-₦1,500.00'). After: 3/3 pass; full suite 9/9; lint clean. Diff: formatPrice.js (+2 −1), test (+4).\"", why: "The same command before and after, the whole suite, lint, and the scope: anyone can re-run it." },
            { id: "b", text: "\"Fixed it, works on my machine.\"", whyWrong: "No evidence, and \"my machine\" is the problem Module 9 is about." },
            { id: "c", text: "\"AI says it's fixed.\"", whyWrong: "A claim about a claim." },
            { id: "d", text: "A screenshot of the code", whyWrong: "Code is not evidence that it works." },
          ],
          correct: "a",
          aftermath: "Show, don't tell: before, after, scope.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 45 · 7.P
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ce-l45-four-faults",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 7,
    covers: ["7.P"],
    title: "Practical: Four Faults, Four Root Causes",
    subtitle: "A dependency error, a bad environment variable, a frontend bug and a failed API request, all at once",
    estimatedMinutes: 40,
    intro:
      "Kobo Market has been handed back to you with four faults. They hide behind each other: you cannot see the second until the first is fixed. Find each root cause with evidence, fix it, and prove the fix, in order.",

    atoms: [
      {
        id: "a-ce-p7-dependency",
        title: "Fault 1: the API will not start",
        explain:
          "Start where the system stops. If the server will not start, nothing else can be tested, so this fault comes first.",
        terminalExercise: term("m7-broken-1", {
          goal: "Start the API and read why it fails.",
          accept: ["npm start"],
          near: [{ command: "npm ls dayjs", why: "That is the right next question, but first see the failure: start the API." }],
          hint: "Start it the normal way.",
          success: "ERR_MODULE_NOT_FOUND: Cannot find package 'dayjs' imported from server/services/orderService.js. A dependency error, naming the package and the importer.",
        }),
      },
      {
        id: "a-ce-p7-dependency-cause",
        title: "Fault 1: the root cause",
        explain:
          "A missing package has two possible fixes: install it (if the code genuinely needs it) or remove the import (if it should not be there). Decide from the evidence: is it in package.json, and what uses it?",
        terminalExercise: term("m7-broken-1", {
          goal: "Find every use of dayjs, to decide whether to install it or remove it.",
          accept: ['rg -n "dayjs"'],
          near: [{ command: "npm ls dayjs", why: "That confirms it is not installed (empty). Find what uses it, to decide." }],
          hint: "Search for dayjs everywhere.",
          success: "Only orderService.js: an import and a quoteDate helper that nothing calls. It was added without its dependency and is unused: remove both lines rather than add a package.",
        }),
      },
      {
        id: "a-ce-p7-config",
        title: "Fault 2: every request fails",
        explain:
          "With the import removed, the API starts. Now every request returns 500. The response says nothing useful by design; the log says everything.",
        terminalExercise: term("m7-broken-2", {
          intro: "Fault 1 fixed: the API starts.",
          goal: "Requests return 500. Find out why.",
          accept: ["cat server.log"],
          near: [{ command: "curl -s localhost:4000/api/products/solar-lamp", why: "That reproduces the 500. The reason is in the log." }],
          hint: "Read the server's log.",
          success: "ENOENT: no such file or directory, open '...data\\kobo.jsn'. The data file path is misspelled: a configuration error.",
        }),
      },
      {
        id: "a-ce-p7-config-cause",
        title: "Fault 2: the root cause",
        explain:
          "Find where the bad value comes from. The code reads DATA_FILE from the environment (config.js); locally the environment comes from .env. Compare it with the documented value.",
        terminalExercise: term("m7-broken-2", {
          goal: "Compare DATA_FILE in .env with the documented value in .env.example.",
          accept: ["rg -n DATA_FILE .env .env.example"],
          near: [{ command: "cat server.log", why: "The log told you the path is wrong. Now find where the wrong path is set." }],
          hint: "Search both files for DATA_FILE.",
          success: ".env says data/kobo.jsn; .env.example says data/kobo.json. Fix .env; no code change at all.",
        }),
      },
      {
        id: "a-ce-p7-request",
        title: "Fault 3: the failed API request",
        explain:
          "With the server healthy, the products page is still empty, and the Network panel shows a 404 for /api/product. The server is right to refuse it; the frontend asked for the wrong URL.",
        terminalExercise: term("m7-broken-3", {
          intro: "Faults 1 and 2 fixed. The API is running.",
          goal: "Find where the frontend builds the wrong products URL.",
          accept: ['rg -n -F "api/product" src'],
          near: [{ command: "curl -si localhost:4000/api/product", why: "That confirms the 404. Now find the code: search src." }],
          hint: "Fixed-string search for api/product.",
          success: "src/api/products.js:5 requests /api/product. Add the s back.",
        }),
      },
      {
        id: "a-ce-p7-frontend",
        title: "Fault 4: the frontend bug",
        explain:
          "With the URL fixed, the request succeeds (200), yet the console shows TypeError: Cannot read properties of undefined (reading 'map'). The data arrives; the page reads it wrongly. This one was hidden behind fault 3: the page never got a response to misread until now.",
        terminalExercise: term("m7-broken-3", {
          goal: "Find the line that reads the products response with the wrong key.",
          accept: [READS_RESPONSE],
          near: [{ command: 'curl -s "localhost:4000/api/products?category=fashion"', why: "That shows the API returns products. Find the code that reads the response." }],
          hint: "Search for data.items or data.products in src.",
          success: "Products.jsx:14 uses data.items; the API returns products. Fix the key.",
        }),
      },
      {
        id: "a-ce-p7-proof",
        title: "Proof: all four fixed",
        explain:
          "Finish with evidence for the whole system, not just the last fault: the suite, lint, and the feature working end to end.",
        terminalExercise: term("m7-broken-fixed", {
          intro: "All four faults fixed.",
          goal: "Prove the test suite passes again.",
          accept: ["npm test 2>&1 | tail -n 8"],
          near: [{ command: "npm run lint", why: "Lint passing is part of the proof; start with the test suite." }],
          hint: "npm test, last 8 lines.",
          success: "8 of 8 pass, lint is clean, and the products request returns data. Each fault had its own kind (dependency, configuration, request, frontend), its own evidence and its own fix.",
        }),
      },
    ],

    task: {
      title: "Module practical: four faults, four root causes",
      intro:
        "In a copy of your own project (or with a partner breaking it for you), introduce four faults: a missing dependency, a bad environment variable, a frontend bug and a failed API request. Then diagnose them as if you had not seen them introduced.",
      prompts: [
        "For each fault: the symptom as a user would report it.",
        "The evidence that located it (error, log line, Network entry, search), verbatim.",
        "Its kind (syntax, runtime, dependency, configuration, network or logic) and its root cause, file and line.",
        "The fix, and why it is the root-cause fix rather than a symptom fix.",
        "Proof: before and after outputs of the same command, then the full suite and lint.",
        "Which fault hid another, and how you would make that kind of fault visible sooner next time.",
      ],
      closing: "Next module: architecture, refactoring and technical debt, so that fewer faults like these are possible.",
    },
    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
