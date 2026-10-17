/**
 * ASSESSMENTS · OBJECT ORIENTED PROGRAMMING (JAVASCRIPT) · WEEK 12
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Never import this from anything under src/.
 * ═════════════════════════════════════════════════════════════════════════
 */

export const ASSESSMENTS = {
  /* ═══════════════════════════════════════════════════════════════════ */
  "js-l42-apis-http-json": {
    lessonId: "js-l42-apis-http-json",
    passMark: 70,
    questions: [
      {
        id: "jsq42-1",
        type: "mcq",
        difficulty: 1,
        atomId: "a-js-what-is-api",
        prompt: "What is a web API?",
        options: [
          { id: "a", text: "A website for humans to read" },
          { id: "b", text: "A set of HTTP requests a service agrees to answer for other programs, usually with JSON" },
          { id: "c", text: "A JavaScript library" },
          { id: "d", text: "A database" },
        ],
        correct: "b",
        explanation: "An API exposes endpoints that programs call. You see the requests it accepts and the responses it gives, not its internals.",
        whyWrong: {
          a: "APIs are for programs; they usually return data, not pages.",
          c: "A library runs inside your program. An API is called over the network.",
          d: "An API may use a database internally, but you never touch it directly.",
        },
      },
      {
        id: "jsq42-2",
        type: "mcq",
        difficulty: 2,
        atomId: "a-js-http-basics",
        prompt: "Which HTTP method should be used to create a new task on a server?",
        options: [
          { id: "a", text: "GET" },
          { id: "b", text: "POST" },
          { id: "c", text: "DELETE" },
          { id: "d", text: "HEAD" },
        ],
        correct: "b",
        explanation: "POST creates a new resource, with its data in the request body.",
        whyWrong: {
          a: "GET reads data and must never change anything.",
          c: "DELETE removes a resource.",
          d: "HEAD fetches only headers, like a GET without the body.",
        },
      },
      {
        id: "jsq42-3",
        type: "scenario",
        difficulty: 2,
        atomId: "a-js-json-parsing",
        prompt: "const d = JSON.parse('{\"items\":[{\"n\":\"a\"},{\"n\":\"b\"}]}');\nconsole.log(d.items[1].n);\n\nWhat is printed?",
        options: [
          { id: "a", text: "a" },
          { id: "b", text: "b" },
          { id: "c", text: "undefined" },
          { id: "d", text: "{ n: 'b' }" },
        ],
        correct: "b",
        explanation: "items is an array of two objects; [1] is the second, and .n is its value.",
        whyWrong: {
          a: "That is items[0].n.",
          c: "Every step of the path exists.",
          d: "That would be d.items[1] without .n.",
        },
      },
      {
        id: "jsq42-4",
        type: "scenario",
        difficulty: 3,
        atomId: "a-js-json-parsing",
        prompt: "JSON.parse throws \"Unexpected token '<'\". What is the most likely cause?",
        options: [
          { id: "a", text: "The JSON has a trailing comma" },
          { id: "b", text: "The server returned an HTML page, such as an error page, instead of JSON" },
          { id: "c", text: "The data is too large" },
          { id: "d", text: "JSON.parse does not support arrays" },
        ],
        correct: "b",
        explanation: "< is the first character of HTML like <!DOCTYPE html>. The request probably failed and returned an error page; check the status first.",
        whyWrong: {
          a: "A trailing comma produces a different message about an unexpected token near the end.",
          c: "Size does not cause syntax errors.",
          d: "JSON fully supports arrays.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "js-l43-promises": {
    lessonId: "js-l43-promises",
    passMark: 70,
    questions: [
      {
        id: "jsq43-1",
        type: "mcq",
        difficulty: 2,
        atomId: "a-js-promise-states",
        prompt: "Which is NOT one of a promise's states?",
        options: [
          { id: "a", text: "pending" },
          { id: "b", text: "fulfilled" },
          { id: "c", text: "rejected" },
          { id: "d", text: "paused" },
        ],
        correct: "d",
        explanation: "A promise is pending, then settles as fulfilled or rejected, and never changes again.",
        whyWrong: {
          a: "pending is the state before it settles.",
          b: "fulfilled means it succeeded with a value.",
          c: "rejected means it failed with an error.",
        },
      },
      {
        id: "jsq43-2",
        type: "scenario",
        difficulty: 3,
        atomId: "a-js-promise-states",
        prompt: "console.log(\"A\");\nsetTimeout(() => console.log(\"B\"), 0);\nPromise.resolve().then(() => console.log(\"C\"));\nconsole.log(\"D\");\n\nWhat is printed?",
        options: [
          { id: "a", text: "A B C D" },
          { id: "b", text: "A D C B" },
          { id: "c", text: "A D B C" },
          { id: "d", text: "A C D B" },
        ],
        correct: "b",
        explanation: "Synchronous code runs first (A, D). Promise callbacks run next, before timers, even a 0 ms timer (C, then B). Week 13 explains why: microtasks before tasks.",
        whyWrong: {
          a: "Callbacks never run in the middle of synchronous code.",
          c: "Promise callbacks are microtasks, which run before timer callbacks.",
          d: "D is synchronous and runs before any callback.",
        },
      },
      {
        id: "jsq43-3",
        type: "scenario",
        difficulty: 3,
        atomId: "a-js-then-catch",
        prompt: "Promise.reject(new Error(\"x\"))\n  .then(() => console.log(\"then\"))\n  .catch(() => console.log(\"catch\"))\n  .finally(() => console.log(\"finally\"));\n\nWhat is printed?",
        options: [
          { id: "a", text: "then, catch, finally" },
          { id: "b", text: "catch, finally" },
          { id: "c", text: "then, finally" },
          { id: "d", text: "finally" },
        ],
        correct: "b",
        explanation: "A rejection skips .then and goes to .catch. finally runs regardless.",
        whyWrong: {
          a: ".then only runs for a fulfilled promise.",
          c: "The promise was rejected, so .then is skipped and .catch runs.",
          d: ".catch handles the rejection before finally.",
        },
      },
      {
        id: "jsq43-4",
        type: "mcq",
        difficulty: 2,
        atomId: "a-js-async-await",
        prompt: "What does an async function always return?",
        options: [
          { id: "a", text: "undefined" },
          { id: "b", text: "A promise" },
          { id: "c", text: "The value after return, directly" },
          { id: "d", text: "A boolean" },
        ],
        correct: "b",
        explanation: "An async function's return value is wrapped in a promise, so callers use await or .then to get it.",
        whyWrong: {
          a: "Even with no return statement it returns a promise of undefined.",
          c: "The value is delivered through a promise, not directly.",
          d: "It can resolve to any type, always via a promise.",
        },
      },
      {
        id: "jsq43-5",
        type: "mcq",
        difficulty: 3,
        atomId: "a-js-parallel",
        prompt: "Three independent requests each take about 1 second. How long does await Promise.all([a(), b(), c()]) take?",
        options: [
          { id: "a", text: "About 3 seconds" },
          { id: "b", text: "About 1 second" },
          { id: "c", text: "About 0 seconds" },
          { id: "d", text: "It depends on the order" },
        ],
        correct: "b",
        explanation: "All three start at once and Promise.all waits for the slowest, so the total is roughly the longest single request.",
        whyWrong: {
          a: "That is the time for awaiting them one after another.",
          c: "The requests still take time; they just overlap.",
          d: "Results come back in the given order, but the wait does not depend on it.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "js-l44-fetch-status": {
    lessonId: "js-l44-fetch-status",
    passMark: 70,
    questions: [
      {
        id: "jsq44-1",
        type: "mcq",
        difficulty: 2,
        atomId: "a-js-fetch",
        prompt: "Why does reading JSON with fetch take two awaits?",
        options: [
          { id: "a", text: "It is a style choice" },
          { id: "b", text: "fetch resolves when the headers arrive; reading the body with response.json() is a second asynchronous step" },
          { id: "c", text: "The first await sends the request twice" },
          { id: "d", text: "JSON must always be parsed twice" },
        ],
        correct: "b",
        explanation: "The status and headers arrive first, so you can check them before choosing to read the body.",
        whyWrong: {
          a: "Both promises are part of the API.",
          c: "The request is sent once.",
          d: "The body is parsed once, by response.json().",
        },
      },
      {
        id: "jsq44-2",
        type: "mcq",
        difficulty: 2,
        atomId: "a-js-status-codes",
        prompt: "A request returns 503. What does that tell you?",
        options: [
          { id: "a", text: "Success" },
          { id: "b", text: "Your request was malformed" },
          { id: "c", text: "The server is unavailable; it is worth retrying later" },
          { id: "d", text: "You need to sign in" },
        ],
        correct: "c",
        explanation: "5xx codes are server-side failures. 503 means the service is temporarily unavailable.",
        whyWrong: {
          a: "Success codes are 2xx.",
          b: "That is 400, a client error.",
          d: "That is 401.",
        },
      },
      {
        id: "jsq44-3",
        type: "scenario",
        difficulty: 3,
        atomId: "a-js-fetch-ok-trap",
        prompt: "A fetch to a missing page returns 404. What happens to the promise fetch returned?",
        options: [
          { id: "a", text: "It rejects, so .catch runs" },
          { id: "b", text: "It fulfils with a Response whose ok is false" },
          { id: "c", text: "It stays pending forever" },
          { id: "d", text: "It throws synchronously" },
        ],
        correct: "b",
        explanation: "fetch only rejects for network-level failure. An HTTP error status is still a completed response, so you must check response.ok.",
        whyWrong: {
          a: "That is the common mistaken assumption. A 404 does not reject.",
          c: "The server answered, so the promise settles.",
          d: "fetch never throws synchronously for a bad status.",
        },
      },
      {
        id: "jsq44-4",
        type: "mcq",
        difficulty: 2,
        atomId: "a-js-status-codes",
        prompt: "For which status codes is response.ok true?",
        options: [
          { id: "a", text: "Any code below 400" },
          { id: "b", text: "200 to 299" },
          { id: "c", text: "Only exactly 200" },
          { id: "d", text: "Any code at all, if the server answered" },
        ],
        correct: "b",
        explanation: "ok is true for the 2xx success range only.",
        whyWrong: {
          a: "3xx redirects are not ok, though fetch usually follows them automatically.",
          c: "201 Created and 204 No Content are also ok.",
          d: "4xx and 5xx responses have ok set to false.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "js-l45-ui-states-secrets": {
    lessonId: "js-l45-ui-states-secrets",
    passMark: 70,
    questions: [
      {
        id: "jsq45-1",
        type: "mcq",
        difficulty: 2,
        atomId: "a-js-ui-states",
        prompt: "When should a data request set its state to \"loading\"?",
        options: [
          { id: "a", text: "After the response arrives" },
          { id: "b", text: "Immediately before the request is sent" },
          { id: "c", text: "Only if the request fails" },
          { id: "d", text: "Never; the browser shows a spinner automatically" },
        ],
        correct: "b",
        explanation: "Set loading first so the user sees that something is happening for the whole wait, then replace it with success, empty or error.",
        whyWrong: {
          a: "By then the wait is over.",
          c: "That is the error state.",
          d: "Browsers do not show progress for fetch requests made by your code.",
        },
      },
      {
        id: "jsq45-2",
        type: "scenario",
        difficulty: 2,
        atomId: "a-js-empty-state",
        prompt: "A search succeeds with status 200 and returns []. Which state is it?",
        options: [
          { id: "a", text: "Error" },
          { id: "b", text: "Loading" },
          { id: "c", text: "Empty: a successful result with nothing in it" },
          { id: "d", text: "Idle" },
        ],
        correct: "c",
        explanation: "The request worked; there were simply no matches. It deserves its own helpful message.",
        whyWrong: {
          a: "Nothing failed.",
          b: "The response has arrived.",
          d: "A search was performed.",
        },
      },
      {
        id: "jsq45-3",
        type: "scenario",
        difficulty: 3,
        atomId: "a-js-api-keys",
        prompt: "A secret API key is written into a front-end JavaScript file, which is minified for production. Who can read the key?",
        options: [
          { id: "a", text: "Nobody, because it is minified" },
          { id: "b", text: "Only the developers" },
          { id: "c", text: "Anyone who visits the site, through the source or the Network panel" },
          { id: "d", text: "Only Google" },
        ],
        correct: "c",
        explanation: "Every visitor downloads the JavaScript. Minification renames variables but leaves string values readable, and the key appears in outgoing requests.",
        whyWrong: {
          a: "Minification is not encryption.",
          b: "The file is sent to every visitor's browser.",
          d: "Anyone can read it, not only search engines.",
        },
      },
      {
        id: "jsq45-4",
        type: "mcq",
        difficulty: 3,
        atomId: "a-js-env-vars",
        prompt: "Where should a secret API key be used?",
        options: [
          { id: "a", text: "In a VITE_ environment variable read by the front end" },
          { id: "b", text: "In a server or serverless function that the front end calls" },
          { id: "c", text: "In localStorage" },
          { id: "d", text: "In a comment at the top of app.js" },
        ],
        correct: "b",
        explanation: "Only code that runs on a server keeps a secret. The browser calls your endpoint, and your endpoint calls the API with the key.",
        whyWrong: {
          a: "Vite copies VITE_ variables into the built JavaScript that every visitor downloads.",
          c: "localStorage is readable by anyone using the browser, and by any script on the page.",
          d: "Comments are shipped with the source and readable by anyone.",
        },
      },
    ],
  },
};
