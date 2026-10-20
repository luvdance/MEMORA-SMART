/**
 * ASSESSMENTS · CODEBASE ENGINEERING · MODULE 7 · DEBUGGING AND TESTING
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Never import this from anything under src/.
 * ═════════════════════════════════════════════════════════════════════════
 */

import { q, check } from "./ce-helpers.js";

export const ASSESSMENTS = {
  ...check("ce-l39-errors-devtools", [
    q({ id: "ceq39-1", atom: "a-ce-read-errors", d: 2, prompt: "What does node --check FILE do?", options: ["Parses the file for syntax errors without running it", "Runs the tests", "Formats the file", "Checks for updates"], correct: "a",
      explanation: "It isolates syntax errors.",
      wrong: { b: "No.", c: "No.", d: "No." } }),
    q({ id: "ceq39-2", atom: "a-ce-stack-trace", d: 3, prompt: "In a stack trace, which frame do you usually look at first?", options: ["The first one in your own code, scanning down from the top", "The last line", "Any node:internal frame", "The one in node_modules"], correct: "a",
      explanation: "Your code is where you can act.",
      wrong: { b: "The bottom is where execution began.", c: "Rarely the cause.", d: "Rarely the cause." } }),
    q({ id: "ceq39-3", atom: "a-ce-browser-console", d: 3, prompt: "\"Cannot read properties of undefined (reading 'map')\" means:", options: ["Code called .map on something that was undefined", "The map library failed", "The server is down", "A CSS error"], correct: "a",
      explanation: "The message names the property and what it was read from.",
      wrong: { b: "map is the array method.", c: "Possibly related, but the message is about a variable.", d: "No." } }),
    q({ id: "ceq39-4", atom: "a-ce-devtools", d: 2, prompt: "Which DevTools panel shows the requests a page made and their status codes?", options: ["Network", "Console", "Elements", "Application"], correct: "a",
      explanation: "URL, method, status, request and response.",
      wrong: { b: "Errors and logs.", c: "The page's HTML.", d: "Storage." } }),
  ]),

  ...check("ce-l40-server-errors", [
    q({ id: "ceq40-1", atom: "a-ce-server-logs", d: 2, prompt: "Why does the client see only \"Internal server error\"?", options: ["Internal details are kept out of responses deliberately; they go to the server's log", "The server does not know what happened", "The error was in the browser", "curl hides it"], correct: "a",
      explanation: "Details help attackers; logs are for developers.",
      wrong: { b: "The log says exactly.", c: "It was on the server.", d: "curl shows what it received." } }),
    q({ id: "ceq40-2", atom: "a-ce-log-quality", d: 3, prompt: "Logging the error object rather than err.message adds:", options: ["The stack trace, with the file and line", "Colour", "The user's password", "Nothing"], correct: "a",
      explanation: "Compare the two logs in the lesson.",
      wrong: { b: "No.", c: "Never log that.", d: "It adds the most useful part." } }),
    q({ id: "ceq40-3", atom: "a-ce-error-kinds", d: 3, prompt: "Cannot find package 'dayjs' is which kind of error?", options: ["Dependency", "Logic", "Network", "Syntax"], correct: "a",
      explanation: "A package is missing.",
      wrong: { b: "There is an explicit error.", c: "No network involved.", d: "The code parsed." } }),
    q({ id: "ceq40-4", atom: "a-ce-network-error", d: 3, prompt: "curl -s prints nothing. Why might that hide a failure?", options: ["-s silences curl's own error messages; add -S to show them", "-s means success", "The server sent an empty body", "curl is broken"], correct: "a",
      explanation: "-sS: quiet on success, loud on errors.",
      wrong: { b: "s is silent.", c: "Possible, but you cannot tell without -S or $?.", d: "No." } }),
    q({ id: "ceq40-5", atom: "a-ce-build-errors", d: 2, prompt: "Why are build-time errors the cheapest?", options: ["They are found on every file in seconds, before any user can hit them", "They never matter", "They fix themselves", "They only happen in production"], correct: "a",
      explanation: "Lint, types and the bundler run before deploy.",
      wrong: { b: "A syntax error breaks everything.", c: "No.", d: "The opposite." } }),
  ]),

  ...check("ce-l41-reproduce", [
    q({ id: "ceq41-1", atom: "a-ce-reproduce", d: 2, prompt: "A report says a bug happens \"sometimes\". What does that usually mean?", options: ["It happens under a condition nobody has written down yet", "It is random and cannot be fixed", "The user is wrong", "It is a hardware fault"], correct: "a",
      explanation: "Find the condition.",
      wrong: { b: "Almost always a hidden condition.", c: "Investigate first.", d: "Rarely." } }),
    q({ id: "ceq41-2", atom: "a-ce-minimal-case", d: 3, prompt: "What is a minimal case?", options: ["The smallest program or steps that still show the bug", "A shorter bug report", "The cheapest fix", "A unit test name"], correct: "a",
      explanation: "Remove everything not needed.",
      wrong: { b: "It is runnable.", c: "No.", d: "It can become a test, but is not a name." } }),
    q({ id: "ceq41-3", atom: "a-ce-search-failing", d: 2, prompt: "The API returns {products: [...]}; the page reads data.items. What will it get?", options: ["undefined", "An empty array", "An error from the server", "The products"], correct: "a",
      explanation: "A missing key is undefined.",
      wrong: { b: "Not unless written.", c: "The server responded fine.", d: "Wrong key." } }),
    q({ id: "ceq41-4", atom: "a-ce-search-endpoint", d: 3, prompt: "Why might rg -F \"api/product\" also list files that are not the bug?", options: ["Any text containing it matches, such as an import of api/products.js", "rg is unreliable", "-F ignores case", "It searches node_modules"], correct: "a",
      explanation: "A search result is a lead, not a verdict.",
      wrong: { b: "It did exactly what it was asked.", c: "-F means fixed string.", d: "rg skips ignored folders." } }),
  ]),

  ...check("ce-l42-tests", [
    q({ id: "ceq42-1", atom: "a-ce-test-kinds", d: 2, prompt: "Which kind of test drives the whole application through the UI, like a user?", options: ["End-to-end", "Unit", "Lint", "Type check"], correct: "a",
      explanation: "Playwright, Cypress.",
      wrong: { b: "One function.", c: "Not a test of behaviour.", d: "Not a test of behaviour." } }),
    q({ id: "ceq42-2", atom: "a-ce-run-one-file", d: 2, prompt: "How do you run just one test file with Node's test runner?", options: ["node --test path/to/file.test.js", "npm install", "node --check file", "git test"], correct: "a",
      explanation: "Fast feedback while working.",
      wrong: { b: "Installs.", c: "Syntax only.", d: "No such command." } }),
    q({ id: "ceq42-3", atom: "a-ce-filter-tests", d: 3, prompt: "In npm test -- --test-name-pattern=delivery, what does the -- do?", options: ["Passes the flags after it to the script's command instead of to npm", "Comments out the rest", "Runs twice", "Means \"all tests\""], correct: "a",
      explanation: "npm forwards arguments after --.",
      wrong: { b: "No.", c: "No.", d: "It filters." } }),
    q({ id: "ceq42-4", atom: "a-ce-tests-as-spec", d: 3, prompt: "Why read a project's test names?", options: ["Together they state what the code is promised to do, with examples", "To count them", "To delete slow ones", "They are the documentation for users"], correct: "a",
      explanation: "Tests are an executable specification.",
      wrong: { b: "The content matters.", c: "No.", d: "For developers, not users." } }),
    q({ id: "ceq42-5", atom: "a-ce-missing-tests", d: 3, prompt: "Before changing untested code, what do you do?", options: ["Write a test that pins its current behaviour, then change it", "Change it carefully", "Never change it", "Delete it"], correct: "a",
      explanation: "A characterisation test.",
      wrong: { b: "No protection.", c: "Then nothing improves.", d: "No." } }),
  ]),

  ...check("ce-l43-test-first", [
    q({ id: "ceq43-1", atom: "a-ce-ai-test-prompt", d: 3, prompt: "Why ask an AI for the failing test separately, before the fix?", options: ["So you see the test fail first; a test never seen failing proves nothing", "AIs cannot write fixes", "Tests are cheaper", "It is faster"], correct: "a",
      explanation: "Red, then green.",
      wrong: { b: "They can.", c: "Not the reason.", d: "Not the reason." } }),
    q({ id: "ceq43-2", atom: "a-ce-test-first", d: 3, prompt: "A new test fails with \"Cannot find module\". Is it ready?", options: ["No: it must fail for the bug's reason, not because the test is broken", "Yes, it fails", "Yes, any failure counts", "Delete it"], correct: "a",
      explanation: "Fail for the right reason.",
      wrong: { b: "Wrong failure.", c: "Wrong failure.", d: "Fix the test." } }),
    q({ id: "ceq43-3", atom: "a-ce-fix-proves", d: 2, prompt: "After the fix, the same test passes. What has that proved?", options: ["The fix addresses the behaviour the test describes", "There are no other bugs", "The code is fast", "Lint passes"], correct: "a",
      explanation: "Exactly that, and no more.",
      wrong: { b: "Run the whole suite for that.", c: "No.", d: "Separate check." } }),
    q({ id: "ceq43-4", atom: "a-ce-regression", d: 2, prompt: "What is a regression?", options: ["Something that used to work and no longer does", "A new feature", "A slow test", "A type of graph"], correct: "a",
      explanation: "Run the whole suite to catch them.",
      wrong: { b: "No.", c: "No.", d: "Not here." } }),
  ]),

  ...check("ce-l44-static-evidence", [
    q({ id: "ceq44-1", atom: "a-ce-lint", d: 3, prompt: "Tests pass but lint reports 'ordr' is not defined in a route. Why did the tests not catch it?", options: ["No test runs that route's code", "Lint is wrong", "Undefined names are allowed", "Tests never check routes"], correct: "a",
      explanation: "Lint checks code no test reaches.",
      wrong: { b: "It found a real crash.", c: "They throw.", d: "They can, if written." } }),
    q({ id: "ceq44-2", atom: "a-ce-static-kinds", d: 2, prompt: "What does a formatter like Prettier change?", options: ["Only the code's style, never its behaviour", "The logic", "The tests", "The dependencies"], correct: "a",
      explanation: "So reviews can focus on substance.",
      wrong: { b: "No.", c: "No.", d: "No." } }),
    q({ id: "ceq44-3", atom: "a-ce-evidence", d: 2, prompt: "Why include git diff --stat in a fix's evidence?", options: ["It shows the fix touched only what it should", "It runs the tests", "It is required by Git", "It proves the fix works"], correct: "a",
      explanation: "Scope is part of the proof.",
      wrong: { b: "No.", c: "No.", d: "Tests prove that." } }),
    q({ id: "ceq44-4", atom: "a-ce-evidence-report", d: 3, prompt: "Which is the strongest evidence a fix worked?", options: ["The same command failing before and passing after, plus the full suite and lint", "\"Works on my machine\"", "The AI's confirmation", "A screenshot of the code"], correct: "a",
      explanation: "Repeatable and specific.",
      wrong: { b: "Not evidence.", c: "A claim.", d: "Code is not proof." } }),
  ]),

  ...check("ce-l45-four-faults", [
    q({ id: "ceq45-1", atom: "a-ce-p7-dependency", d: 2, prompt: "With several faults, which do you fix first?", options: ["The one that stops the system running at all", "The easiest", "The frontend", "The newest"], correct: "a",
      explanation: "Nothing else can be tested until it runs.",
      wrong: { b: "Order by blocking, not ease.", c: "The API must run first.", d: "Not the criterion." } }),
    q({ id: "ceq45-2", atom: "a-ce-p7-dependency-cause", d: 3, prompt: "An import of a missing package is used by nothing. Best fix?", options: ["Remove the import and the unused code", "Install the package", "Ignore the error", "Downgrade Node"], correct: "a",
      explanation: "Do not add a dependency nobody needs.",
      wrong: { b: "Adds unused weight.", c: "The server will not start.", d: "Unrelated." } }),
    q({ id: "ceq45-3", atom: "a-ce-p7-config", d: 3, prompt: "Every request returns 500 and the log shows ENOENT for data/kobo.jsn. The fix is in:", options: ["The configuration (.env), not the code", "server/db/index.js", "The test suite", "The frontend"], correct: "a",
      explanation: "A configuration error.",
      wrong: { b: "The code is correct.", c: "No.", d: "No." } }),
    q({ id: "ceq45-4", atom: "a-ce-p7-frontend", d: 3, prompt: "Why did the data.items bug only appear after the URL was fixed?", options: ["Until the request succeeded, there was no response for the page to misread", "It was introduced then", "The server changed", "Caching"], correct: "a",
      explanation: "Faults hide behind each other.",
      wrong: { b: "It was there all along.", c: "No.", d: "No." } }),
    q({ id: "ceq45-5", atom: "a-ce-p7-proof", d: 2, prompt: "After fixing several faults, what is the final proof?", options: ["The whole system checked: full tests, lint and the feature working end to end", "The last fault's test only", "No errors in the terminal right now", "A teammate's opinion"], correct: "a",
      explanation: "Evidence for the system, not just the last fix.",
      wrong: { b: "Too narrow.", c: "Not evidence of correctness.", d: "Not evidence." } }),
  ]),
};
