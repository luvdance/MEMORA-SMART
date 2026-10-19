/**
 * ASSESSMENTS · RESPONSIVE WEB DEVELOPMENT · MODULE 24 · ASYNCHRONOUS JAVASCRIPT AND APIs
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Never import this from anything under src/.
 * ═════════════════════════════════════════════════════════════════════════
 */

import { q, check } from "./wd-helpers.js";

export const ASSESSMENTS = {
  ...check("wd-l105-async-http", [
    q({ id: "wdq105-1", atom: "a-wd-sync-async", d: 2, prompt: "Why is network code asynchronous in the browser?", options: ["Waiting synchronously would freeze the whole page until the response arrived", "Networks are faster that way", "Browsers forbid loops", "To save data"], correct: "a",
      explanation: "Asynchronous code lets the page stay responsive while it waits.",
      wrong: { b: "The network is the same speed.", c: "Unrelated.", d: "Unrelated." } }),
    q({ id: "wdq105-2", atom: "a-wd-sync-async", d: 3, prompt: "console.log(1); setTimeout(() => console.log(2), 0); console.log(3); prints what?", options: ["1 3 2", "1 2 3", "2 1 3", "3 2 1"], correct: "a",
      explanation: "The timer's callback waits until current code finishes.",
      wrong: { b: "A 0ms timer still runs later.", c: "2 cannot come first.", d: "1 runs first." } }),
    q({ id: "wdq105-3", atom: "a-wd-what-api", d: 1, prompt: "What does a web API usually return?", options: ["Data, often as JSON", "Full HTML pages for people to read", "Images of the server", "CSS files"], correct: "a",
      explanation: "APIs serve data to programs.",
      wrong: { b: "Websites return pages; APIs return data.", c: "Unrelated.", d: "Unrelated." } }),
    q({ id: "wdq105-4", atom: "a-wd-http-requests", d: 2, prompt: "Which method is used to delete a record through an API?", options: ["DELETE", "GET", "POST", "FETCH"], correct: "a",
      explanation: "DELETE removes.",
      wrong: { b: "GET reads.", c: "POST creates.", d: "Not an HTTP method." } }),
  ]),

  ...check("wd-l106-json-fetch", [
    q({ id: "wdq106-1", atom: "a-wd-json-data", d: 2, prompt: "Which is valid JSON?", options: ["{\"name\": \"Ada\", \"age\": 16}", "{name: 'Ada', age: 16}", "{\"name\": \"Ada\", \"age\": 16,}", "{\"greet\": function () {}}"], correct: "a",
      explanation: "JSON needs double-quoted keys and strings, no trailing commas, no functions.",
      wrong: { b: "Keys and strings must use double quotes.", c: "Trailing commas are not allowed.", d: "Functions are not JSON." } }),
    q({ id: "wdq106-2", atom: "a-wd-fetch", d: 3, prompt: "Why are there two awaits: await fetch(url) then await res.json()?", options: ["The response headers arrive first; reading and parsing the body is a second wait", "fetch must always be called twice", "json() is synchronous", "To retry the request"], correct: "a",
      explanation: "The body streams in after the response starts.",
      wrong: { b: "One fetch.", c: "json() returns a promise.", d: "Nothing is retried." } }),
    q({ id: "wdq106-3", atom: "a-wd-fetch", d: 2, prompt: "How do you send JSON in a POST with fetch?", options: ["fetch(url, { method: \"POST\", headers: { \"Content-Type\": \"application/json\" }, body: JSON.stringify(data) })", "fetch(url + data)", "fetch.post(url, data)", "fetch(url, data)"], correct: "a",
      explanation: "Method, content type and a JSON string body.",
      wrong: { b: "That only makes a strange URL.", c: "Not an API.", d: "The second argument is an options object." } }),
    q({ id: "wdq106-4", atom: "a-wd-json-data", d: 2, prompt: "Before using an unfamiliar API, what should you do?", options: ["Read its documentation or log the data to learn its shape", "Guess property names", "Copy another API's code", "Nothing"], correct: "a",
      explanation: "Code must match the data's actual shape.",
      wrong: { b: "Guesses give undefined everywhere.", c: "Different APIs differ.", d: "You need to know the shape." } }),
  ]),

  ...check("wd-l107-promises", [
    q({ id: "wdq107-1", atom: "a-wd-promises", d: 2, prompt: "What are the possible outcomes of a promise?", options: ["Fulfilled with a value or rejected with an error, once", "It can switch between them many times", "It always succeeds", "It returns immediately"], correct: "a",
      explanation: "Pending, then settled permanently.",
      wrong: { b: "It settles once.", c: "It can reject.", d: "Its value comes later." } }),
    q({ id: "wdq107-2", atom: "a-wd-then-catch", d: 3, prompt: "In a .then().then().catch() chain, the first then throws. What runs?", options: ["The catch; the second then is skipped", "The second then", "Nothing", "Both thens"], correct: "a",
      explanation: "A rejection jumps to the next catch.",
      wrong: { b: "It is skipped.", c: "The catch runs.", d: "The second is skipped." } }),
    q({ id: "wdq107-3", atom: "a-wd-async-await", d: 3, type: "scenario", prompt: "const data = getProducts(); console.log(data.length) prints undefined, where getProducts is async. Why?", options: ["data is a Promise because await is missing", "The API is empty", "length only works on strings", "async functions return undefined"], correct: "a",
      explanation: "Write const data = await getProducts().",
      wrong: { b: "data is not the array at all.", c: "Arrays have length.", d: "They return promises." } }),
    q({ id: "wdq107-4", atom: "a-wd-async-await", d: 2, prompt: "How do you handle errors in an async function using await?", options: ["try...catch", "if...else only", "switch", "They cannot be handled"], correct: "a",
      explanation: "A rejected await throws, which catch handles.",
      wrong: { b: "Rejections throw; if cannot catch them.", c: "Unrelated.", d: "They can." } }),
  ]),

  ...check("wd-l108-loading-errors", [
    q({ id: "wdq108-1", atom: "a-wd-loading", d: 2, prompt: "Why disable the button while a request is loading?", options: ["So it cannot be clicked again and send duplicate requests", "To hide it", "To make the request faster", "Buttons must be disabled for fetch"], correct: "a",
      explanation: "Prevents repeated actions.",
      wrong: { b: "Disabled is still visible.", c: "No effect on speed.", d: "Not required." } }),
    q({ id: "wdq108-2", atom: "a-wd-errors-unsuccessful", d: 3, prompt: "fetch receives a 404 response. What happens?", options: ["The promise fulfils with a response whose ok is false", "The promise rejects", "An exception is thrown automatically", "The page reloads"], correct: "a",
      explanation: "Only network failures reject. Check res.ok.",
      wrong: { b: "A response arrived, so it fulfils.", c: "Nothing throws until you check.", d: "Nothing reloads." } }),
    q({ id: "wdq108-3", atom: "a-wd-status-codes", d: 2, prompt: "Which status family means the server failed?", options: ["5xx", "2xx", "3xx", "4xx"], correct: "a",
      explanation: "500, 502 and 503 are server errors.",
      wrong: { b: "Success.", c: "Redirects.", d: "The request was wrong." } }),
    q({ id: "wdq108-4", atom: "a-wd-status-codes", d: 2, prompt: "What does 401 usually mean?", options: ["Not logged in or missing credentials", "Not found", "Created", "Server crashed"], correct: "a",
      explanation: "401 Unauthorized: authenticate first.",
      wrong: { b: "That is 404.", c: "That is 201.", d: "That is 500." } }),
  ]),

  ...check("wd-l109-keys-cors-urls", [
    q({ id: "wdq109-1", atom: "a-wd-api-keys", d: 3, prompt: "Where must a secret API key be kept?", options: ["On a server, which calls the API for the page", "In app.js", "In localStorage", "In an HTML comment"], correct: "a",
      explanation: "Everything in the frontend is public.",
      wrong: { b: "Anyone can read it.", c: "Anyone can read it.", d: "Anyone can read it." } }),
    q({ id: "wdq109-2", atom: "a-wd-cors", d: 3, prompt: "The console shows a CORS error for another site's API. Who can fix it?", options: ["The API's server, by sending CORS headers, or you, by calling it from your own server", "Your frontend code, by setting a header", "The visitor", "Nobody"], correct: "a",
      explanation: "The browser enforces what the other server allows.",
      wrong: { b: "The frontend cannot switch CORS off.", c: "Not their responsibility.", d: "There are fixes." } }),
    q({ id: "wdq109-3", atom: "a-wd-query-params", d: 2, prompt: "Why use URLSearchParams to build a query string?", options: ["It encodes spaces and special characters such as & correctly", "It is shorter than strings", "It makes requests faster", "It adds API keys"], correct: "a",
      explanation: "Unencoded & would start a new parameter.",
      wrong: { b: "Not the reason.", c: "Speed is unchanged.", d: "It does not." } }),
    q({ id: "wdq109-4", atom: "a-wd-render-api-safely", d: 2, prompt: "How should a product name from an API be put on the page?", options: ["With textContent", "With innerHTML", "With document.write", "As an onclick attribute"], correct: "a",
      explanation: "API data is untrusted, like user input.",
      wrong: { b: "Markup in it would run.", c: "Obsolete and unsafe.", d: "Executes as code." } }),
  ]),
};
