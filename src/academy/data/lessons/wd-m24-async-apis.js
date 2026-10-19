/**
 * RESPONSIVE WEB DEVELOPMENT · MODULE 24 · ASYNCHRONOUS JAVASCRIPT AND APIs
 *
 * Curriculum 24.1 – 24.15. Synchronous versus asynchronous code, APIs and
 * HTTP, JSON, fetch, promises, .then and .catch, async and await, loading
 * and error states, status codes, API keys and environment variables, CORS,
 * query strings and rendering API data safely.
 *
 * The labs' fetch() is answered by declared mock responses (real Response
 * objects, real status codes, real network failures on demand), so every
 * check is repeatable and no lesson depends on a third-party API being up.
 * The event-loop exercises are run in Node and print in the order shown.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

export const SECTION_ID = "wd-s24-async-apis";

const JS = "javascript";

const page = (title, body) => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title}</title>
  <link rel="stylesheet" href="style.css">
  <script src="app.js" defer></script>
</head>
<body>
${body}
</body>
</html>
`;

const CSS = "body { font-family: Arial, sans-serif; padding: 16px; }\nbutton { min-height: 44px; }\n.error { color: #b91c1c; }\n";

const PRODUCTS_API = [
  { id: 1, name: "Ankara tote bag", price: 7500 },
  { id: 2, name: "Leather sandals", price: 18000 },
  { id: 3, name: "Beaded bracelet", price: 3000 },
];

const WEATHER_HTML = page("Weather", `  <form id="weather-form">
    <label for="city">City</label>
    <input id="city" name="city" autocomplete="off">
    <button type="submit">Get weather</button>
  </form>
  <p id="status" role="status"></p>
  <section id="result" hidden>
    <h2 id="place"></h2>
    <p id="temp"></p>
  </section>`);

const WEATHER_MOCKS = [
  { match: "/api/weather?city=lagos", status: 200, body: { city: "Lagos", tempC: 31, summary: "Humid, some cloud" }, delay: 80 },
  { match: "/api/weather?city=jos", status: 200, body: { city: "Jos", tempC: 21, summary: "Cool and clear" }, delay: 80 },
  { match: "/api/weather?city=atlantis", status: 404, body: { error: "City not found" }, delay: 80 },
  { match: "/api/weather?city=broken", status: 500, body: { error: "Server error" }, delay: 80 },
  { match: "/api/weather?city=offline", networkError: true, delay: 80 },
];

const SEARCH_HTML = page("Recipe search", `  <form id="search-form">
    <label for="q">Search recipes</label>
    <input id="q" name="q">
    <label for="max">Max minutes</label>
    <select id="max" name="max"><option value="30">30</option><option value="60">60</option></select>
    <button type="submit">Search</button>
  </form>
  <ul id="results"></ul>`);

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 105 · 24.1 – 24.3
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "wd-l105-async-http",
    moduleId: "wd-m24-async-apis",
    sectionId: SECTION_ID,
    order: 1,
    covers: ["24.1", "24.2", "24.3"],
    title: "Asynchronous Code, APIs and HTTP",
    subtitle: "Code that waits without freezing, and how pages talk to servers",
    estimatedMinutes: 24,
    intro: "Weather, exchange rates, products, messages: most of what a modern page shows comes from a server, and arrives later than the page itself. Handling \"later\" is what asynchronous code is for.",

    atoms: [
      {
        id: "a-wd-sync-async",
        title: "Synchronous versus asynchronous execution",
        explain:
          "Synchronous code runs one line after another; each line waits for the previous one. If a line had to wait two seconds for a server, the whole page, every click and scroll, would freeze for two seconds. Asynchronous code starts a slow task (a timer, a network request) and carries on; when the task finishes, a callback runs. setTimeout(fn, ms) is the simplest example: fn runs later, after everything currently running has finished.",
        codeExercise: {
          language: JS,
          code: 'console.log("1. Order placed");\nsetTimeout(() => console.log("3. Food delivered"), 0);\nconsole.log("2. Carry on with your day");\n',
          question: "The timer is 0 milliseconds. In what order do the lines print?",
          expectedOutput: "1. Order placed\n2. Carry on with your day\n3. Food delivered",
          hint: "A timer's callback never interrupts code that is already running, even with a delay of 0.",
          successMessage: "The callback waited for the current code to finish, even with zero delay. That is the heart of asynchronous JavaScript.",
        },
      },
      {
        id: "a-wd-what-api",
        title: "What an API is",
        explain:
          "An API (application programming interface) is a way for one program to use another. A web API is a set of URLs on a server that return data instead of pages: GET https://api.example.com/weather?city=lagos returns the weather in Lagos as JSON. Its documentation says which URLs exist, what parameters they take, what they return and what errors they give. Your page is the API's client.",
        table: {
          caption: "Typical web API endpoints.",
          headers: ["Request", "Returns"],
          rows: [
            ["GET /api/products", "A list of products"],
            ["GET /api/products/7", "Product 7"],
            ["POST /api/orders (with a JSON body)", "The new order, created"],
            ["GET /api/weather?city=lagos", "The weather in Lagos"],
          ],
        },
        webLab: {
          task:
            "api.js is a pretend delivery API: getDeliveryStatus(orderId, callback) answers about a quarter of a second later by calling callback with a status string. Wire up the Track button: show \"Checking…\" in #status immediately, ask the API about order 1042, and show its answer in #status when it arrives. The page must stay usable while waiting: the Like button keeps counting.",
          files: {
            "index.html": `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Track order</title>
  <link rel="stylesheet" href="style.css">
  <script src="api.js" defer></script>
  <script src="app.js" defer></script>
</head>
<body>
  <button id="track">Track order 1042</button>
  <p id="status" role="status"></p>
  <button id="like">Like</button> <span id="likes">0</span>
</body>
</html>
`,
            "style.css": CSS,
            "api.js": "// A pretend API: it answers later, through a callback.\nfunction getDeliveryStatus(orderId, callback) {\n  setTimeout(() => callback(`Order ${orderId}: out for delivery`), 250);\n}\n",
            "app.js": "let likes = 0;\ndocument.querySelector(\"#like\").addEventListener(\"click\", () => {\n  likes++;\n  document.querySelector(\"#likes\").textContent = likes;\n});\n\n// Wire up the Track button here\n",
          },
          readOnly: ["index.html", "style.css", "api.js"],
          tests: [
            { label: "Clicking Track shows \"Checking…\" straight away", check: "$('#track').click(); return text('#status') === 'Checking…';", fail: "Set the status text before calling getDeliveryStatus." },
            { label: "The page stays usable while waiting: Like still counts", check: "await click('#like'); await click('#like'); return text('#likes') === '2' && text('#status') === 'Checking…';", fail: "Do not wait in a loop: give the API a callback and let the page carry on." },
            { label: "The API's answer appears when it arrives", check: "await waitFor(() => text('#status') !== 'Checking…', 2000); return text('#status') === 'Order 1042: out for delivery';", fail: "In the callback, set #status to the status the API passed in." },
          ],
          solution: { "app.js": "let likes = 0;\ndocument.querySelector(\"#like\").addEventListener(\"click\", () => {\n  likes++;\n  document.querySelector(\"#likes\").textContent = likes;\n});\n\nconst status = document.querySelector(\"#status\");\ndocument.querySelector(\"#track\").addEventListener(\"click\", () => {\n  status.textContent = \"Checking…\";\n  getDeliveryStatus(1042, (answer) => {\n    status.textContent = answer;\n  });\n});\n" },
          hint: "getDeliveryStatus(1042, (answer) => { … }) — the second argument is the function the API calls back later.",
          successMessage: "You asked another program for data and the page kept working while it answered. fetch, next lesson, is the real version of this.",
        },
      },
      {
        id: "a-wd-http-requests",
        title: "HTTP requests and responses",
        explain:
          "Every API call is an HTTP request: a method (GET to read, POST to create, PUT or PATCH to update, DELETE to remove), a URL, headers (such as Content-Type: application/json or an Authorization token) and, for POST and PUT, a body. The response has a status code (Module 1), headers and a body. In DevTools → Network you can click any request to see all of these, which is the first place to look when an API call goes wrong.",
        decision: {
          scenario: "Your page sends a new customer's details to the server to create an account.",
          question: "Which method fits?",
          options: [
            { id: "a", text: "POST, with the details as a JSON body", why: "POST creates something on the server, and its body carries the data, out of the URL." },
            { id: "b", text: "GET, with the details in the query string", whyWrong: "GET is for reading. Putting personal data in a URL puts it in history and server logs." },
            { id: "c", text: "DELETE", whyWrong: "That removes things." },
            { id: "d", text: "Any method; they are the same", whyWrong: "Servers, caches and browsers treat methods differently. GET requests may be repeated or cached." },
          ],
          correct: "a",
          aftermath: "GET reads; POST creates; PUT and PATCH update; DELETE removes.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 106 · 24.4 – 24.5
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "wd-l106-json-fetch",
    moduleId: "wd-m24-async-apis",
    sectionId: SECTION_ID,
    order: 2,
    covers: ["24.4", "24.5"],
    title: "JSON Data and fetch()",
    subtitle: "The format APIs speak, and the browser's tool for asking them",
    estimatedMinutes: 22,
    intro: "You met JSON in Module 23 as a way to store objects. It is also the language almost every web API speaks, and fetch() is how the browser asks for it.",

    atoms: [
      {
        id: "a-wd-json-data",
        title: "JSON data",
        explain:
          "API responses are JSON text: objects and arrays with double-quoted keys, strings, numbers, booleans and null. After parsing, it is ordinary JavaScript data, usually an array of objects or an object containing one, which you already know how to filter, map and render. Read the API's documentation (or log the data) to learn its shape before writing code that uses it.",
        example: "[\n  { \"id\": 1, \"name\": \"Ankara tote bag\", \"price\": 7500 },\n  { \"id\": 2, \"name\": \"Leather sandals\", \"price\": 18000 }\n]",
      },
      {
        id: "a-wd-fetch",
        title: "Using fetch()",
        explain:
          "fetch(url) sends a GET request and returns a promise of a Response. The response's body arrives separately, so response.json() returns a second promise, of the parsed data. With async and await (Lesson 107) the two waits read top to bottom. For a POST, pass options: fetch(url, { method: \"POST\", headers: { \"Content-Type\": \"application/json\" }, body: JSON.stringify(data) }).",
        example: "async function loadProducts() {\n  const response = await fetch(\"/api/products\");\n  const products = await response.json();\n  render(products);\n}",
        webLab: {
          task:
            "Load the shop's products from the API at /api/products (it returns a JSON array of { id, name, price }) and render each one into #products as an li with the text \"NAME · ₦PRICE\". Use fetch and response.json().",
          files: {
            "index.html": page("Shop", "  <h1>Products</h1>\n  <ul id=\"products\"></ul>"),
            "style.css": CSS,
            "app.js": "// Fetch /api/products and render the list\n",
          },
          readOnly: ["index.html", "style.css"],
          mocks: [{ match: "/api/products", status: 200, body: PRODUCTS_API, delay: 50 }],
          tests: [
            { label: "The page requests /api/products", check: "await waitFor(() => fetchCalls().length > 0); return fetchCalls().some((c) => c.url.includes('/api/products'));", fail: "Call fetch(\"/api/products\")." },
            { label: "All three products appear, with name and price", check: "await waitFor(() => $$('#products li').length === 3); const li = $$('#products li'); return li.length === 3 && text(li[0]) === 'Ankara tote bag · ₦7500' && text(li[1]) === 'Leather sandals · ₦18000';", fail: "await response.json(), then create one li per product." },
            { label: "No errors in the console", check: "await waitFor(() => $$('#products li').length === 3); return errors().length === 0;", fail: "Check that you await both fetch and response.json()." },
          ],
          solution: { "app.js": "async function loadProducts() {\n  const response = await fetch(\"/api/products\");\n  const products = await response.json();\n  const list = document.querySelector(\"#products\");\n  for (const p of products) {\n    const li = document.createElement(\"li\");\n    li.textContent = `${p.name} · ₦${p.price}`;\n    list.append(li);\n  }\n}\n\nloadProducts();\n" },
          hint: "Two awaits: one for the response, one for response.json().",
          successMessage: "Your page just loaded data from an API and rendered it. Every dashboard, feed and catalogue on the web starts like this.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 107 · 24.6 – 24.8
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "wd-l107-promises",
    moduleId: "wd-m24-async-apis",
    sectionId: SECTION_ID,
    order: 3,
    covers: ["24.6", "24.7", "24.8"],
    title: "Promises, .then(), .catch(), async and await",
    subtitle: "Values that arrive later, and code that reads as if they had already arrived",
    estimatedMinutes: 26,
    intro: "fetch returns a promise. Understanding promises turns asynchronous code from mysterious to predictable, and async and await make it read almost like ordinary code.",

    atoms: [
      {
        id: "a-wd-promises",
        title: "Promises",
        explain:
          "A promise is an object standing for a value that is not ready yet. It is pending, then either fulfilled with a value or rejected with an error, once, permanently. You do not wait for it by stopping the program; you attach what should happen next. Promise callbacks run before timers: after the current code, but ahead of any setTimeout.",
        codeExercise: {
          language: JS,
          code: 'console.log("A");\nsetTimeout(() => console.log("B"), 0);\nPromise.resolve().then(() => console.log("C"));\nconsole.log("D");\n',
          question: "In what order are the four letters printed?",
          expectedOutput: "A\nD\nC\nB",
          hint: "Synchronous code first. Then promise callbacks. Then timers.",
          successMessage: "A and D run straight away; the promise's callback runs next; the timer runs last. Module 25 explains why, with the event loop.",
        },
      },
      {
        id: "a-wd-then-catch",
        title: ".then() and .catch()",
        explain:
          ".then(fn) runs fn with the promise's value when it is fulfilled, and returns a new promise of fn's result, so steps can be chained: fetch(url).then((r) => r.json()).then(render). .catch(fn) runs if any step before it rejects or throws, so one catch at the end handles every failure in the chain. .finally(fn) runs either way, which suits hiding a loading message.",
        codeExercise: {
          language: JS,
          code: "Promise.resolve(5)\n  .then((n) => n * 2)\n  .then((n) => {\n    if (n > 5) throw new Error(\"Too big: \" + n);\n    return n;\n  })\n  .then((n) => console.log(\"Got\", n))\n  .catch((err) => console.log(\"Caught:\", err.message))\n  .finally(() => console.log(\"Done\"));\n",
          question: "What is printed?",
          expectedOutput: "Caught: Too big: 10\nDone",
          hint: "5 becomes 10; 10 > 5 throws; the next then is skipped and catch runs.",
          successMessage: "An error anywhere in a chain jumps straight to the catch, and finally runs whatever happened.",
        },
      },
      {
        id: "a-wd-async-await",
        title: "async and await",
        explain:
          "Inside a function marked async, await pauses THAT function until a promise settles, then gives you its value, without blocking the rest of the page. Errors become exceptions you handle with try...catch. An async function always returns a promise. Forgetting await is a classic bug: you get a pending Promise object instead of the data.",
        example: "async function totalStock() {\n  try {\n    const res = await fetch(\"/api/products\");\n    const products = await res.json();\n    return products.reduce((t, p) => t + p.price, 0);\n  } catch (err) {\n    console.error(\"Could not load\", err);\n    return 0;\n  }\n}",
        webLab: {
          task:
            "Write async function cheapest() that fetches /api/products, and returns the NAME of the cheapest product. Write async function totalValue() that returns the sum of all prices. Then, when the page loads, show \"Cheapest: NAME\" in #cheapest and \"Total: ₦N\" in #total, awaiting both functions. Use async and await, not .then.",
          files: {
            "index.html": page("Stats", "  <p id=\"cheapest\"></p>\n  <p id=\"total\"></p>"),
            "style.css": CSS,
            "app.js": "async function cheapest() {\n}\n\nasync function totalValue() {\n}\n\n// Show both on the page\n",
          },
          readOnly: ["index.html", "style.css"],
          mocks: [{ match: "/api/products", status: 200, body: PRODUCTS_API, delay: 40 }],
          tests: [
            { label: "cheapest() resolves to \"Beaded bracelet\"", check: "return (await cheapest()) === 'Beaded bracelet';", fail: "await fetch, await res.json(), then find the product with the lowest price and return its name." },
            { label: "totalValue() resolves to 28500", check: "return (await totalValue()) === 28500;", fail: "Sum the prices with reduce." },
            { label: "Both are async functions that return promises", check: "return cheapest() instanceof Promise && totalValue() instanceof Promise;", fail: "Mark both functions async." },
            { label: "The page shows both results", check: "await waitFor(() => text('#total') !== ''); return text('#cheapest') === 'Cheapest: Beaded bracelet' && text('#total') === 'Total: ₦28500';", fail: "In an async function (or with top-level await in a module), await each and set the text." },
            { label: "Written with await, not .then()", check: "return /await/.test(code('app.js')) && !/\\.then\\(/.test(code('app.js'));", fail: "Use await for every promise." },
          ],
          solution: { "app.js": "async function getProducts() {\n  const res = await fetch(\"/api/products\");\n  return res.json();\n}\n\nasync function cheapest() {\n  const products = await getProducts();\n  return products.reduce((a, b) => (b.price < a.price ? b : a)).name;\n}\n\nasync function totalValue() {\n  const products = await getProducts();\n  return products.reduce((t, p) => t + p.price, 0);\n}\n\nasync function show() {\n  document.querySelector(\"#cheapest\").textContent = `Cheapest: ${await cheapest()}`;\n  document.querySelector(\"#total\").textContent = `Total: ₦${await totalValue()}`;\n}\n\nshow();\n" },
          hint: "A small async getProducts() helper keeps both functions short.",
          successMessage: "Asynchronous code that reads top to bottom. await is how almost all modern API code is written.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 108 · 24.9 – 24.11
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "wd-l108-loading-errors",
    moduleId: "wd-m24-async-apis",
    sectionId: SECTION_ID,
    order: 4,
    covers: ["24.9", "24.10", "24.11"],
    title: "Loading States, Errors and Status Codes",
    subtitle: "What the page shows while waiting, and when things go wrong",
    estimatedMinutes: 26,
    intro: "On a slow phone connection a request can take seconds, and sometimes it fails. A page that shows nothing while waiting, or freezes with a blank space when it fails, feels broken. Professional pages handle all three states: loading, success and error.",

    atoms: [
      {
        id: "a-wd-loading",
        title: "Handling loading states",
        explain:
          "Show that something is happening as soon as a request starts: a message (\"Loading weather…\") in a role=\"status\" region so screen readers hear it, a spinner, or a skeleton shape. Disable the button that started it so it cannot be clicked again. Remove the loading state when the request finishes, whether it succeeded or failed: finally (or code after try...catch) is the place.",
      },
      {
        id: "a-wd-errors-unsuccessful",
        title: "Handling errors and unsuccessful responses",
        explain:
          "fetch only rejects when the request could not be made at all: no connection, a blocked request. A 404 or 500 response is NOT a rejection: fetch succeeds and gives you a response whose ok property is false. So check response.ok (true for status 200 to 299) and treat anything else as an error, then catch network failures separately. Show the visitor a message that tells them what to do, not a raw error.",
        example: "try {\n  const res = await fetch(url);\n  if (!res.ok) {\n    showError(res.status === 404 ? \"City not found\" : \"The service is having problems\");\n    return;\n  }\n  render(await res.json());\n} catch {\n  showError(\"Check your connection and try again\");\n}",
      },
      {
        id: "a-wd-status-codes",
        title: "HTTP status codes",
        explain:
          "Status codes come in families. 2xx: success (200 OK, 201 Created, 204 No Content). 3xx: redirection. 4xx: the request was wrong (400 Bad Request, 401 not logged in, 403 not allowed, 404 Not Found, 429 Too Many Requests). 5xx: the server failed (500, 503 unavailable). The family tells you whose problem it is: a 4xx usually needs the visitor or your code to change the request; a 5xx is worth retrying later.",
        webLab: {
          task:
            "Build the weather widget. On submit: prevent the default, show \"Loading weather…\" in #status and disable the button; fetch /api/weather?city=CITY using the lower-cased, trimmed city. On success show the section, put the city name in #place and \"31°C · Humid, some cloud\" (from tempC and summary) in #temp, and clear the status. On a 404 show \"City not found\"; on any other unsuccessful status show \"The weather service is having problems\"; on a network failure show \"Check your connection and try again\". Always re-enable the button. (The API knows lagos and jos; atlantis gives 404, broken gives 500, offline fails.)",
          files: { "index.html": WEATHER_HTML, "style.css": CSS, "app.js": "// Fetch the weather with loading and error states\n" },
          readOnly: ["index.html", "style.css"],
          mocks: WEATHER_MOCKS,
          tests: [
            { label: "While loading: a message, and the button disabled", check: "await type('#city', ' Lagos '); $('#weather-form').requestSubmit(); await wait(10); return text('#status') === 'Loading weather…' && $('#weather-form button').disabled === true;", fail: "Before awaiting fetch, set the status text and button.disabled = true." },
            { label: "Success shows the city and its weather, and clears the status", check: "await waitFor(() => text('#temp') !== ''); return !$('#result').hidden && text('#place') === 'Lagos' && text('#temp') === '31°C · Humid, some cloud' && text('#status') === '' && $('#weather-form button').disabled === false;", fail: "On success: show #result, fill #place and #temp, clear #status, re-enable the button." },
            { label: "The request uses the trimmed, lower-cased city", check: "return fetchCalls().some((c) => c.url.includes('/api/weather?city=lagos'));", fail: "Use city.trim().toLowerCase() in the URL." },
            { label: "A 404 shows \"City not found\"", check: "await type('#city', 'Atlantis'); await submit('#weather-form'); await waitFor(() => text('#status') === 'City not found'); return text('#status') === 'City not found' && $('#weather-form button').disabled === false;", fail: "Check response.ok; if the status is 404, show \"City not found\"." },
            { label: "A 500 shows the service message", check: "await type('#city', 'broken'); await submit('#weather-form'); await waitFor(() => text('#status').includes('problems')); return text('#status') === 'The weather service is having problems';", fail: "Any other unsuccessful status shows \"The weather service is having problems\"." },
            { label: "A network failure shows the connection message", check: "await type('#city', 'offline'); await submit('#weather-form'); await waitFor(() => text('#status').includes('connection')); return text('#status') === 'Check your connection and try again' && $('#weather-form button').disabled === false && errors().length === 0;", fail: "Wrap the fetch in try...catch; in catch show the connection message." },
            { label: "The page never reloads", check: "return submissions().length === 0;", fail: "preventDefault in the submit handler." },
          ],
          solution: { "app.js": "const form = document.querySelector(\"#weather-form\");\nconst input = document.querySelector(\"#city\");\nconst button = form.querySelector(\"button\");\nconst status = document.querySelector(\"#status\");\nconst result = document.querySelector(\"#result\");\n\nform.addEventListener(\"submit\", async (event) => {\n  event.preventDefault();\n  const city = input.value.trim().toLowerCase();\n  if (!city) return;\n  status.textContent = \"Loading weather…\";\n  button.disabled = true;\n  try {\n    const res = await fetch(`/api/weather?city=${encodeURIComponent(city)}`);\n    if (!res.ok) {\n      result.hidden = true;\n      status.textContent = res.status === 404 ? \"City not found\" : \"The weather service is having problems\";\n      return;\n    }\n    const data = await res.json();\n    document.querySelector(\"#place\").textContent = data.city;\n    document.querySelector(\"#temp\").textContent = `${data.tempC}°C · ${data.summary}`;\n    result.hidden = false;\n    status.textContent = \"\";\n  } catch {\n    result.hidden = true;\n    status.textContent = \"Check your connection and try again\";\n  } finally {\n    button.disabled = false;\n  }\n});\n" },
          hint: "Three outcomes need three branches: !res.ok (with 404 special), success, and catch. Put button.disabled = false in finally so it always runs.",
          successMessage: "Loading, success, not found, server error and offline: five states, each handled. That is what makes an API-driven page feel reliable.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 109 · 24.12 – 24.15
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "wd-l109-keys-cors-urls",
    moduleId: "wd-m24-async-apis",
    sectionId: SECTION_ID,
    order: 5,
    covers: ["24.12", "24.13", "24.14", "24.15"],
    title: "API Keys, CORS, Query Strings and Safe Rendering",
    subtitle: "The rules around calling real APIs, building their URLs, and showing their data",
    estimatedMinutes: 26,
    intro: "Real APIs come with keys, browser security rules and URLs that must be built carefully. And their data, like user input, must never be trusted when it reaches your page.",

    atoms: [
      {
        id: "a-wd-api-keys",
        title: "API keys and environment variables",
        explain:
          "Many APIs need a key that identifies your app. Anything in frontend code, including a key in a .env file built into it, is visible to every visitor through View Source or the Network panel. So only publishable keys (designed to be public, usually restricted to your domain) may go in the frontend. Secret keys, which can spend money or read private data, must stay on a server: your page calls your own small backend or serverless function, which adds the secret key and calls the API. Build tools read environment variables at build time (Module 27).",
        decision: {
          scenario: "A weather API's documentation says: \"Keep your secret key private.\" A developer puts it in app.js so the page can call the API directly.",
          question: "What is the problem, and the fix?",
          options: [
            { id: "a", text: "Every visitor can read the key in the source and use it on your account; call your own server function, which holds the key, instead", why: "Frontend code is public. A secret must stay server-side, where only your code can use it." },
            { id: "b", text: "No problem, as long as the file is minified", whyWrong: "Minified code is still readable, and the key appears in plain text in every request." },
            { id: "c", text: "Put it in localStorage instead", whyWrong: "Just as visible to anyone." },
            { id: "d", text: "Split it into two strings and join them", whyWrong: "Trivial to undo; it is still in the page." },
          ],
          correct: "a",
          aftermath: "If it is secret, it is not in the browser. Module 31 returns to this.",
        },
      },
      {
        id: "a-wd-cors",
        title: "CORS fundamentals",
        explain:
          "By default a page may only read responses from its own origin. Cross-Origin Resource Sharing (CORS) is how a server on another origin says \"pages from these sites may read my responses\", using headers such as Access-Control-Allow-Origin. If an API does not send them, the browser blocks your page from reading the response, and the console shows a CORS error. It is the SERVER that must allow it; nothing in your frontend code can switch CORS off. The usual fixes: use an API that supports CORS, or call it from your own server.",
        example: "Access to fetch at 'https://api.other.com/data' from origin 'https://myshop.ng'\nhas been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present\non the requested resource.",
      },
      {
        id: "a-wd-query-params",
        title: "Query parameters and URL construction",
        explain:
          "Build URLs with the URL and URLSearchParams objects instead of gluing strings together: they encode spaces, ampersands and other special characters correctly. new URL(\"/api/recipes\", location.origin) creates the URL, url.searchParams.set(\"q\", text) adds a parameter, and url.toString() gives the final string. By hand, encodeURIComponent(value) does the encoding for a single value.",
        codeExercise: {
          language: JS,
          code: 'const url = new URL("https://api.example.com/recipes");\nurl.searchParams.set("q", "jollof rice & plantain");\nurl.searchParams.set("max", 30);\nconsole.log(url.toString());\nconsole.log(encodeURIComponent("a&b c"));\n',
          question: "What URL is built, and how is \"a&b c\" encoded?",
          expectedOutput: "https://api.example.com/recipes?q=jollof+rice+%26+plantain&max=30\na%26b%20c",
          hint: "URLSearchParams writes spaces as + and & as %26. encodeURIComponent writes a space as %20.",
          successMessage: "Without encoding, the & in the search would have started a new parameter and broken the request.",
        },
      },
      {
        id: "a-wd-render-api-safely",
        title: "Rendering API data safely",
        explain:
          "Data from an API is someone else's data: product names, reviews and usernames can contain anything, including markup that would run as code if inserted with innerHTML. Treat it exactly like user input: render with textContent, check its shape before using it (is it an array? does each item have a name?), and supply defaults for missing fields so one bad record does not break the page.",
        webLab: {
          task:
            "Build the recipe search. On submit, build the URL /api/recipes with URLSearchParams: q is the search text and max is the chosen minutes, so \"jollof rice\" and 30 request /api/recipes?q=jollof+rice&max=30. Render each result into #results as an li with its title, using textContent, because one recipe's title contains HTML. If the response is not an array, show nothing. Skip any result without a title.",
          files: { "index.html": SEARCH_HTML, "style.css": CSS, "app.js": "// Search recipes safely\n" },
          readOnly: ["index.html", "style.css"],
          mocks: [
            {
              match: "/api/recipes?q=jollof+rice&max=30",
              status: 200,
              body: [
                { id: 1, title: "Party jollof rice" },
                { id: 2, title: "<img src=x onerror=\"document.title='hacked'\">Smoky jollof" },
                { id: 3 },
              ],
              delay: 40,
            },
            { match: "/api/recipes?q=weird", status: 200, body: { message: "not a list" }, delay: 40 },
          ],
          tests: [
            { label: "The URL is built with URLSearchParams: ?q=jollof+rice&max=30", check: "await type('#q', 'jollof rice'); await submit('#search-form'); await waitFor(() => fetchCalls().length > 0); return fetchCalls().some((c) => c.url.includes('/api/recipes?q=jollof+rice&max=30')) && /URLSearchParams|searchParams/.test(code('app.js'));", fail: "Use new URL(\"/api/recipes\", location.href) and url.searchParams.set(\"q\", …) and (\"max\", …)." },
            { label: "The results with titles are listed", check: "await waitFor(() => $$('#results li').length === 2); const li = $$('#results li'); return li.length === 2 && text(li[0]) === 'Party jollof rice';", fail: "Render one li per result that has a title." },
            { label: "Markup in a title is shown as text and never runs", check: "await waitFor(() => $$('#results li').length === 2); await wait(30); return !$('#results img') && $$('#results li')[1].textContent.includes('<img') && document.title !== 'hacked';", fail: "Use textContent for the title, never innerHTML." },
            { label: "A response that is not an array shows no results and no errors", check: "await type('#q', 'weird'); await submit('#search-form'); await wait(150); return $$('#results li').length === 0 && errors().length === 0;", fail: "If !Array.isArray(data), clear the list and stop." },
            { label: "The page does not reload on search", check: "return submissions().length === 0;", fail: "preventDefault in the submit handler." },
          ],
          solution: { "app.js": "const form = document.querySelector(\"#search-form\");\nconst results = document.querySelector(\"#results\");\n\nform.addEventListener(\"submit\", async (event) => {\n  event.preventDefault();\n  const url = new URL(\"/api/recipes\", location.href);\n  url.searchParams.set(\"q\", form.elements.q.value.trim());\n  url.searchParams.set(\"max\", form.elements.max.value);\n  results.replaceChildren();\n  try {\n    const res = await fetch(url.pathname + url.search);\n    if (!res.ok) return;\n    const data = await res.json();\n    if (!Array.isArray(data)) return;\n    for (const recipe of data) {\n      if (!recipe || typeof recipe.title !== \"string\") continue;\n      const li = document.createElement(\"li\");\n      li.textContent = recipe.title;\n      results.append(li);\n    }\n  } catch {\n    /* show nothing on failure in this exercise */\n  }\n});\n" },
          hint: "url.pathname + url.search gives \"/api/recipes?q=…&max=…\" for fetch.",
          successMessage: "A correctly encoded request, defensive handling of the response's shape, and rendering that no API data can turn into an attack.",
        },
      },
    ],

    task: {
      title: "Module project: a country explorer",
      intro: "Use a real, free API that supports CORS, such as REST Countries (restcountries.com).",
      prompts: [
        "A search form whose URL is built with URL and URLSearchParams or encodeURIComponent.",
        "Loading, empty (no results), not-found and network-error states, each with a clear message in a role=\"status\" region.",
        "Results rendered with textContent: name, capital, population (formatted with toLocaleString) and flag image with alt text.",
        "A debounced live search (Module 21) that cancels nothing but never sends more than one request per pause.",
        "Open the Network panel, find your request, and note its status code, response size and time.",
      ],
      closing: "Next module: modern JavaScript features that tidy all of this up.",
    },
    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
