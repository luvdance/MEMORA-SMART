/**
 * OBJECT ORIENTED PROGRAMMING (JAVASCRIPT) · WEEK 12 · WORKING WITH DATA & APIS
 *
 * Curriculum 12.1 – 12.10. Phase 6.
 *
 * The content validator runs offline, and a lesson whose output depends on
 * somebody else's server would drift. So the runnable snippets here use a
 * stand-in, `fakeFetch`, that returns REAL Response objects — the same class
 * fetch() returns in every browser and in Node — built from data written in
 * the snippet. Everything after the network call (status checks, .json(),
 * promise chains, async/await, error handling) is the genuine API, executed
 * and verified. Calls to real public APIs are shown as worked examples.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

export const SECTION_ID = "js-s12-apis";

const JS = "javascript";

/** The stand-in used by every runnable snippet in this week. */
const FAKE_FETCH =
  "// A stand-in for fetch(): same Response objects, no network.\n" +
  "function fakeFetch(url) {\n" +
  "  const routes = {\n" +
  "    \"/weather/lagos\": [200, { city: \"Lagos\", tempC: 31, sky: \"Cloudy\" }],\n" +
  "    \"/weather/abuja\": [200, { city: \"Abuja\", tempC: 27, sky: \"Sunny\" }],\n" +
  "    \"/weather/atlantis\": [404, { error: \"City not found\" }],\n" +
  "    \"/weather/busy\": [503, { error: \"Try again later\" }],\n" +
  "  };\n" +
  "  const [status, body] = routes[url] || [404, { error: \"Unknown route\" }];\n" +
  "  return new Promise((resolve) =>\n" +
  "    setTimeout(() => resolve(new Response(JSON.stringify(body), { status })), 10)\n" +
  "  );\n" +
  "}\n\n";

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 42 · 12.1 – 12.3
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "js-l42-apis-http-json",
    moduleId: "js-w12-apis",
    sectionId: SECTION_ID,
    order: 1,
    covers: ["12.1", "12.2", "12.3"],
    title: "APIs, HTTP and JSON",
    subtitle: "How applications ask each other for data",
    estimatedMinutes: 16,
    intro:
      "Your weather app does not measure the weather. It asks a service that does, over the internet, and gets an answer back as data. Almost every modern application works this way. This lesson is about the conversation: what an API is, how HTTP requests are shaped, and the JSON the answers come back in.",

    atoms: [
      {
        id: "a-js-what-is-api",
        title: "What APIs are and why applications use them",
        explain:
          "An API, Application Programming Interface, is a set of requests one program agrees to answer for another. A web API is reached over HTTP at addresses called endpoints, such as https://api.example.com/weather?city=Lagos. You send a request; it sends back a response, usually JSON. You never see its code or its database, only the requests it accepts.",
        table: {
          caption: "APIs you have already used without knowing it.",
          headers: ["When you…", "An app asks…", "for…"],
          rows: [
            ["Pay with a card online", "A payment API (Paystack, Flutterwave)", "Approval of the charge"],
            ["See a map in a delivery app", "A maps API", "Map tiles and a route"],
            ["Log in with Google", "Google's identity API", "Proof of who you are"],
            ["Check the weather", "A weather API", "The forecast for a location"],
          ],
        },
        why: "APIs let one small team build an application on top of services that would take years to build themselves. Learning to use them is learning to stand on everyone else's work.",
      },
      {
        id: "a-js-http-basics",
        title: "HTTP basics and request methods",
        explain:
          "HTTP is the protocol of the web. Every request has a method saying what you want to do, a URL saying what to do it to, headers carrying extra information, and sometimes a body carrying data. Every response has a status code, headers and usually a body.",
        table: {
          caption: "The request methods, and what each one means.",
          headers: ["Method", "Meaning", "Example"],
          rows: [
            ["GET", "Read something; never changes data", "GET /tasks"],
            ["POST", "Create something new", "POST /tasks with the new task in the body"],
            ["PUT / PATCH", "Replace / partly update something", "PATCH /tasks/7 with { done: true }"],
            ["DELETE", "Remove something", "DELETE /tasks/7"],
          ],
        },
        example:
          "A request, as it actually travels:\n\n  GET /weather?city=Lagos HTTP/1.1\n  Host: api.example.com\n  Accept: application/json\n\nThe response:\n\n  HTTP/1.1 200 OK\n  Content-Type: application/json\n\n  {\"city\":\"Lagos\",\"tempC\":31,\"sky\":\"Cloudy\"}",
        why: "In Week 11 you saw a form submit and reload the page: that was a POST. In the cybersecurity course, injection and access-control flaws live in exactly these requests. Every web skill rests on knowing what is in them.",
      },
      {
        id: "a-js-json-parsing",
        title: "JSON and parsing data",
        explain:
          "API responses arrive as text. JSON.parse turns JSON text into JavaScript objects and arrays you can work with, and JSON.stringify turns your data into text to send. Real API data is usually nested: arrays of objects containing objects, which is the shape you practised in Week 8.",
        codeExercise: {
          language: JS,
          code: 'const text = \'{"city":"Lagos","days":[{"day":"Mon","maxC":32},{"day":"Tue","maxC":29},{"day":"Wed","maxC":33}]}\';\nconst forecast = JSON.parse(text);\n\nconsole.log(forecast.city);\nconsole.log(forecast.days.length);\nconsole.log(forecast.days[1].day);\nconst hottest = forecast.days.reduce((a, b) => (b.maxC > a.maxC ? b : a));\nconsole.log(`${hottest.day}: ${hottest.maxC}°C`);\n',
          question: "This is a forecast as an API might return it. What is printed?",
          expectedOutput: "Lagos\n3\nTue\nWed: 33°C",
          hint: "days is an array of three objects. reduce keeps whichever day has the higher maxC.",
          successMessage: "Once the text is parsed, it is just the arrays and objects you already know. Most API work is exactly this: parse, then navigate and transform with Week 8's methods.",
        },
        mistake:
          "Parsing something that is not JSON. If a server returns an HTML error page, JSON.parse throws a SyntaxError such as \"Unexpected token '<'\". The < is the start of the HTML. Check the status before parsing, which Lesson 44 covers.",
      },
      {
        id: "a-js-json-shape",
        title: "Reading an API's documentation",
        explain:
          "Every API documents its endpoints, the parameters each accepts, and the shape of the JSON it returns. Before writing code, read one real response and note the path to each value you need, such as data.current.temperature_2m. Then write a small function that turns the API's shape into the shape your app wants.",
        code: {
          language: JS,
          code: 'const apiResponse = {\n  latitude: 6.5,\n  longitude: 3.4,\n  current: { temperature_2m: 30.6, wind_speed_10m: 12.1 },\n  current_units: { temperature_2m: "°C", wind_speed_10m: "km/h" },\n};\n\nfunction toWeather(raw) {\n  return {\n    temp: `${Math.round(raw.current.temperature_2m)}${raw.current_units.temperature_2m}`,\n    wind: `${raw.current.wind_speed_10m} ${raw.current_units.wind_speed_10m}`,\n  };\n}\n\nconsole.log(toWeather(apiResponse));\n',
          expectedOutput: "{ temp: '31°C', wind: '12.1 km/h' }",
        },
        why: "The shape above is modelled on Open-Meteo, a free weather API that needs no key, which is a good choice for this week's project. A converter like toWeather means the rest of your app never depends on the API's exact field names: if the API changes, you change one function.",
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 43 · 12.4 – 12.6
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "js-l43-promises",
    moduleId: "js-w12-apis",
    sectionId: SECTION_ID,
    order: 2,
    covers: ["12.4", "12.5", "12.6"],
    title: "Promises and async/await",
    subtitle: "Working with answers that have not arrived yet",
    estimatedMinutes: 19,
    intro:
      "A network request takes time: tens of milliseconds on a good connection, seconds on a bad one. JavaScript does not stop and wait, or the whole page would freeze. Instead the request gives you a promise of an answer, and your code says what to do when it arrives.",

    atoms: [
      {
        id: "a-js-promise-states",
        title: "Promises and promise states",
        explain:
          "A Promise is an object representing a value that will be available later. It is always in one of three states: pending (still waiting), fulfilled (succeeded, with a value) or rejected (failed, with an error). Once it is fulfilled or rejected it is settled, and it never changes again.",
        code: {
          language: JS,
          code: 'const order = new Promise((resolve) => {\n  setTimeout(() => resolve("Jollof rice ready"), 50);\n});\n\nconsole.log(order);\norder.then((meal) => console.log(meal));\nconsole.log("Waiting for the kitchen...");\n',
          expectedOutput: "Promise { <pending> }\nWaiting for the kitchen...\nJollof rice ready",
        },
        why: "Read the output order carefully. The promise is pending when printed, and the last line of code runs BEFORE the meal arrives, because JavaScript carries on while it waits. That ordering is the single most important idea in asynchronous programming.",
        analogy:
          "Ordering at a restaurant counter and being given a buzzer. The buzzer is the promise: you can sit down and do other things, and when it goes off (fulfilled) you collect your food, or the server tells you they have run out (rejected).",
      },
      {
        id: "a-js-then-catch",
        title: ".then(), .catch() and .finally()",
        explain:
          ".then(callback) runs when the promise is fulfilled, receiving the value. .catch(callback) runs if it is rejected, receiving the error. .finally(callback) runs either way, which is where you hide a loading spinner. Each returns a new promise, so they chain: whatever a .then returns is passed to the next .then.",
        codeExercise: {
          language: JS,
          code: 'function getScore(ok) {\n  return new Promise((resolve, reject) => {\n    setTimeout(() => (ok ? resolve(70) : reject(new Error("Server down"))), 10);\n  });\n}\n\ngetScore(true)\n  .then((score) => score + 10)\n  .then((score) => console.log("Score:", score))\n  .catch((err) => console.log("Error:", err.message))\n  .finally(() => console.log("Done 1"));\n\nsetTimeout(() => {\n  getScore(false)\n    .then((score) => console.log("Score:", score))\n    .catch((err) => console.log("Error:", err.message))\n    .finally(() => console.log("Done 2"));\n}, 50);\n',
          question: "The first chain succeeds; the second fails. What is printed, in order?",
          expectedOutput: "Score: 80\nDone 1\nError: Server down\nDone 2",
          hint: "In the first chain, the value passes through both .then calls, so 10 is added. In the second, rejection skips .then and goes straight to .catch. finally runs in both.",
          successMessage:
            "A rejected promise skips every .then until it reaches a .catch, the way an error skips lines until it is caught. And finally ran both times, which is why it is the place for clean-up.",
        },
      },
      {
        id: "a-js-async-await",
        title: "async and await",
        explain:
          "async and await let you write promise code that reads like ordinary step-by-step code. Mark a function async, and inside it write await before a promise: the function pauses there until the promise settles, then continues with its value. An async function always returns a promise. Errors from an awaited promise are caught with an ordinary try / catch.",
        code: {
          language: JS,
          code: 'const wait = (ms, value) => new Promise((resolve) => setTimeout(() => resolve(value), ms));\n\nasync function makeTea() {\n  console.log("Boiling water");\n  const water = await wait(20, "hot water");\n  console.log(`Got ${water}, steeping`);\n  const tea = await wait(20, "tea");\n  return `A cup of ${tea}`;\n}\n\nmakeTea().then((cup) => console.log(cup));\nconsole.log("Meanwhile, setting the table");\n',
          expectedOutput: "Boiling water\nMeanwhile, setting the table\nGot hot water, steeping\nA cup of tea",
        },
        why: "It is the tea algorithm from Week 1, made asynchronous. Inside makeTea the steps happen in order; outside it, the rest of the program keeps going. await pauses only the async function it is in, never the whole page.",
      },
      {
        id: "a-js-await-errors",
        title: "Handling errors with await",
        explain:
          "With await, a rejected promise throws at the await line, so you handle it with try / catch exactly like any other error. finally works too. This is usually clearer than a .catch at the end of a long chain.",
        codeExercise: {
          language: JS,
          code: 'function charge(amount) {\n  return new Promise((resolve, reject) =>\n    setTimeout(() => (amount > 0 ? resolve(`Charged ${amount}`) : reject(new Error("Invalid amount"))), 10)\n  );\n}\n\nasync function pay(amount) {\n  try {\n    const receipt = await charge(amount);\n    console.log(receipt);\n  } catch (err) {\n    console.log("Payment failed:", err.message);\n  } finally {\n    console.log("Spinner hidden");\n  }\n}\n\nasync function main() {\n  await pay(5000);\n  await pay(0);\n}\nmain();\n',
          question: "main pays twice, waiting for each to finish. What is printed?",
          expectedOutput: "Charged 5000\nSpinner hidden\nPayment failed: Invalid amount\nSpinner hidden",
          hint: "The first payment succeeds; the second rejects, which throws at the await and jumps to catch. finally runs both times.",
          successMessage: "try, catch and finally behave exactly as they do for synchronous code. That is the whole point of await: asynchronous code with the familiar structure.",
        },
      },
      {
        id: "a-js-parallel",
        title: "Waiting for several at once",
        explain:
          "Awaiting promises one after another makes each wait for the last. When requests do not depend on each other, start them all, then wait for all of them with Promise.all, which fulfils with an array of results in the same order, or rejects as soon as any one fails.",
        code: {
          language: JS,
          code: 'const wait = (ms, value) => new Promise((resolve) => setTimeout(() => resolve(value), ms));\n\nasync function main() {\n  const start = Date.now();\n  const [a, b, c] = await Promise.all([wait(100, "Lagos"), wait(100, "Abuja"), wait(100, "Kano")]);\n  const took = Date.now() - start;\n  console.log(a, b, c);\n  console.log(took < 250 ? "about 100ms, not 300" : "sequential");\n}\nmain();\n',
          expectedOutput: "Lagos Abuja Kano\nabout 100ms, not 300",
        },
        why: "Three weather requests for three cities, one after another, take three times as long. Started together, they take as long as the slowest one. On a slow mobile connection that is the difference between a page that feels quick and one that feels broken.",
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 44 · 12.7 – 12.8
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "js-l44-fetch-status",
    moduleId: "js-w12-apis",
    sectionId: SECTION_ID,
    order: 3,
    covers: ["12.7", "12.8"],
    title: "fetch() and Status Codes",
    subtitle: "Making real requests, and reading the answer properly",
    estimatedMinutes: 18,
    intro:
      "fetch is the browser's built-in function for HTTP requests, and Node has it too. It returns a promise of a Response. The part beginners get wrong is not the request; it is assuming every response is a success.",

    atoms: [
      {
        id: "a-js-fetch",
        title: "The fetch() API",
        explain:
          "fetch(url) sends a GET request and returns a promise that fulfils with a Response object as soon as the headers arrive. The body is read separately with response.json() (or .text()), which returns another promise. So a fetch takes two awaits: one for the response, one for its body. For other methods, pass an options object with method, headers and body.",
        example:
          "Reading the current weather in Lagos from Open-Meteo, a free API with no key:\n\nasync function lagosWeather() {\n  const url =\n    \"https://api.open-meteo.com/v1/forecast\" +\n    \"?latitude=6.45&longitude=3.39&current=temperature_2m\";\n  const response = await fetch(url);\n  const data = await response.json();\n  return data.current.temperature_2m;\n}\n\nlagosWeather().then((t) => console.log(`Lagos: ${t}°C`));\n\nSending data with POST:\n\nawait fetch(\"/api/tasks\", {\n  method: \"POST\",\n  headers: { \"Content-Type\": \"application/json\" },\n  body: JSON.stringify({ title: \"Buy rice\" }),\n});",
        why: "The two awaits exist for a reason: the status code arrives before the body, so you can decide whether to read the body at all. That is the subject of the next atom.",
      },
      {
        id: "a-js-fetch-practice",
        title: "Fetching, verified",
        explain:
          "This snippet uses a stand-in for fetch that returns real Response objects without needing the internet, so the output is always the same. Everything from the Response onwards is the genuine API.",
        codeExercise: {
          language: JS,
          code:
            FAKE_FETCH +
            'async function showWeather(city) {\n  const response = await fakeFetch(`/weather/${city}`);\n  const data = await response.json();\n  console.log(`${data.city}: ${data.tempC}°C, ${data.sky}`);\n}\n\nasync function main() {\n  await showWeather("lagos");\n  await showWeather("abuja");\n}\nmain();\n',
          question: "Two requests, each awaited in turn. What is printed?",
          expectedOutput: "Lagos: 31°C, Cloudy\nAbuja: 27°C, Sunny",
          hint: "Look up each route in the routes table. Both return status 200 with a city, tempC and sky.",
          successMessage: "Two awaits per request: the response, then its JSON body. Now see what happens with a city the server does not know.",
        },
      },
      {
        id: "a-js-status-codes",
        title: "HTTP status codes",
        explain:
          "Every response carries a three-digit status code. The first digit is the category. 2xx means success, 3xx a redirect, 4xx a problem with your request, and 5xx a problem on the server. response.ok is true only for 200 to 299, and response.status gives the exact code.",
        table: {
          caption: "The codes you will meet most.",
          headers: ["Code", "Meaning", "What your app should do"],
          rows: [
            ["200 OK", "Success, here is the data", "Use the data"],
            ["201 Created", "Success, something was created", "Show the new item"],
            ["400 Bad Request", "Your request was malformed", "Fix the input; show a validation message"],
            ["401 / 403", "Not signed in / not allowed", "Ask the user to sign in, or say they lack access"],
            ["404 Not Found", "Nothing at that address", "Say it was not found; check the URL or ID"],
            ["429 Too Many Requests", "Rate limited", "Wait and retry later"],
            ["500 / 503", "The server failed / is unavailable", "Apologise, offer a retry"],
          ],
        },
        why: "Different failures need different messages. \"City not found\" and \"The weather service is down, try again\" mean the user should do different things. A single \"Something went wrong\" for everything is unhelpful.",
      },
      {
        id: "a-js-fetch-ok-trap",
        title: "The trap: fetch does not reject on 404",
        explain:
          "fetch only rejects when the request could not be made at all: no network, a blocked request, an invalid URL. A 404 or a 500 is a perfectly successful HTTP conversation, so fetch FULFILS with a Response whose ok is false. If you do not check response.ok yourself, your code carries on and treats an error message as data.",
        codeExercise: {
          language: JS,
          code:
            FAKE_FETCH +
            'async function getWeather(city) {\n  const response = await fakeFetch(`/weather/${city}`);\n  if (!response.ok) {\n    throw new Error(`HTTP ${response.status}`);\n  }\n  return response.json();\n}\n\nasync function main() {\n  for (const city of ["lagos", "atlantis", "busy"]) {\n    try {\n      const w = await getWeather(city);\n      console.log(`${w.city}: ${w.tempC}°C`);\n    } catch (err) {\n      console.log(`${city}: ${err.message}`);\n    }\n  }\n}\nmain();\n',
          question: "getWeather checks response.ok and throws its own error otherwise. What is printed for the three cities?",
          expectedOutput: "Lagos: 31°C\natlantis: HTTP 404\nbusy: HTTP 503",
          hint: "Find each route's status in the table. Only a 2xx status passes the ok check.",
          successMessage:
            "Without the ok check, the atlantis line would print \"undefined: undefined°C\", because the error body has no city or tempC. Checking response.ok and throwing turns an HTTP failure into a real error that try / catch can handle.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 45 · 12.9 – 12.10
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "js-l45-ui-states-secrets",
    moduleId: "js-w12-apis",
    sectionId: SECTION_ID,
    order: 4,
    covers: ["12.9", "12.10"],
    title: "Loading, Error States and Secrets",
    subtitle: "What the user sees while waiting, and what they must never see",
    estimatedMinutes: 17,
    intro:
      "A request takes time and can fail. A professional interface shows what is happening at every moment: loading, success, empty or failed. And many APIs need a key, which raises a question every beginner gets wrong at least once: where can that key safely live?",

    atoms: [
      {
        id: "a-js-ui-states",
        title: "Loading, success and error states",
        explain:
          "Model the request as a state with a status field: \"idle\", \"loading\", \"success\" or \"error\", plus the data or the error message. Set loading before the request, success or error after, and render the interface from the state. Then every possible moment has a defined appearance, and none is forgotten.",
        code: {
          language: JS,
          code:
            FAKE_FETCH +
            'function view(state) {\n  switch (state.status) {\n    case "loading": return "Loading...";\n    case "success": return `${state.data.city}: ${state.data.tempC}°C`;\n    case "error": return `Could not load: ${state.error}`;\n    default: return "Search for a city";\n  }\n}\n\nasync function search(city, render) {\n  render({ status: "loading" });\n  try {\n    const response = await fakeFetch(`/weather/${city}`);\n    if (!response.ok) throw new Error(response.status === 404 ? "city not found" : "service unavailable");\n    render({ status: "success", data: await response.json() });\n  } catch (err) {\n    render({ status: "error", error: err.message });\n  }\n}\n\nconst render = (state) => console.log(view(state));\nrender({ status: "idle" });\nsearch("abuja", render).then(() => search("atlantis", render));\n',
          expectedOutput: "Search for a city\nLoading...\nAbuja: 27°C\nLoading...\nCould not load: city not found",
        },
        why: "In the page, render would set textContent and toggle classes; here it prints, so the whole flow can be checked. The same pattern, a status plus data or error, is what React components use in Week 15.",
      },
      {
        id: "a-js-empty-state",
        title: "Do not forget the empty state",
        explain:
          "A request can succeed and return nothing: a search with no results, a new user with no tasks. That is not an error, and it is not the same as loading. It needs its own message, ideally one that tells the user what to do next.",
        decision: {
          scenario: "A product search API returns 200 with an empty array for the search \"purple elephant\".",
          question: "What should the page show?",
          options: [
            {
              id: "a",
              text: "\"No products match 'purple elephant'. Try a shorter search or browse categories.\"",
              why: "It confirms the search worked, repeats what was searched so typos are visible, and offers a next step. Empty is a real, successful outcome and deserves its own message.",
            },
            {
              id: "b",
              text: "\"Error: something went wrong.\"",
              whyWrong: "Nothing went wrong: the request succeeded. Calling it an error makes the user think the site is broken and retry pointlessly.",
            },
            {
              id: "c",
              text: "Keep showing the loading spinner",
              whyWrong: "Loading has finished. A spinner that never stops looks like a hung page.",
            },
            {
              id: "d",
              text: "Nothing at all: an empty area",
              whyWrong: "A blank area is indistinguishable from a page that failed to render. The user cannot tell whether to wait, retry or search again.",
            },
          ],
          correct: "a",
          aftermath: "Four states, four designs: loading, success with data, success but empty, and error. Write all four before calling a data feature finished.",
        },
      },
      {
        id: "a-js-api-keys",
        title: "API keys and why browser code cannot keep secrets",
        explain:
          "Many APIs require a key that identifies who is calling and often who is paying. Anything in your front-end JavaScript is downloaded to every visitor's browser, so anyone can read it with View Source or the Network panel. A secret key in browser code is not a secret: it is public, and someone can use it to run up your bill or abuse the API in your name.",
        table: {
          caption: "Where a key can live.",
          headers: ["Kind of key", "Safe in browser code?", "Example"],
          rows: [
            ["No key needed", "Nothing to protect", "Open-Meteo weather"],
            ["Publishable key, designed to be public", "Yes, with domain restrictions", "Paystack public key, Firebase web config"],
            ["Secret key", "Never", "Paystack secret key, OpenAI or Anthropic API keys, database passwords"],
          ],
        },
        why: "Bots scan public GitHub repositories for keys around the clock, and leaked keys are commonly abused within minutes. The fix is architectural, which the next atom covers.",
      },
      {
        id: "a-js-env-vars",
        title: "Environment variables and the server in between",
        explain:
          "Secrets are kept out of the code itself in environment variables, read at runtime from a .env file that is listed in .gitignore and never committed. But in a front-end build tool like Vite, any variable you expose to the browser (VITE_ prefixed) is baked into the downloaded JavaScript. So a secret key must only ever be used by a server, or a serverless function, that your front end calls instead.",
        example:
          ".env  (listed in .gitignore, never committed)\n\n  WEATHER_SECRET_KEY=sk_live_8f2a…\n\nA small server function (for example on Vercel) holds the key:\n\n  // api/weather.js — runs on the server, never in the browser\n  export default async function handler(req, res) {\n    const city = encodeURIComponent(req.query.city);\n    const r = await fetch(\n      `https://paid-weather.example.com/v1?city=${city}`,\n      { headers: { Authorization: `Bearer ${process.env.WEATHER_SECRET_KEY}` } }\n    );\n    res.status(r.status).json(await r.json());\n  }\n\nThe browser only ever calls YOUR endpoint, and never sees the key:\n\n  const r = await fetch(`/api/weather?city=${city}`);",
        decision: {
          scenario:
            "Your weather dashboard uses a paid API with a secret key. A classmate suggests putting it in .env as VITE_WEATHER_KEY and reading import.meta.env.VITE_WEATHER_KEY in the front end, since .env is not committed.",
          question: "Is the key safe?",
          options: [
            {
              id: "a",
              text: "No. VITE_ variables are inserted into the built JavaScript, so every visitor downloads the key. It must be used from a server-side function instead",
              why: ".gitignore keeps it out of the repository, but the build puts it straight into the bundle. Not committing a secret and not publishing it are two different things, and browser code publishes it.",
            },
            {
              id: "b",
              text: "Yes, because .env is in .gitignore",
              whyWrong: "That only keeps it off GitHub. Vite copies VITE_ values into the JavaScript it builds, and that JavaScript is sent to every visitor.",
            },
            {
              id: "c",
              text: "Yes, if the code is minified",
              whyWrong: "Minifying shortens variable names; it does not hide string values. The key is still there in plain text, and visible in the Network panel on every request.",
            },
            {
              id: "d",
              text: "Yes, if the key is split into two strings and joined at runtime",
              whyWrong: "Anyone can run the code, or simply watch the outgoing request in DevTools, and see the joined key. Obfuscation is not security.",
            },
          ],
          correct: "a",
          aftermath: "The rule: if the browser has it, the user has it. Secrets live on servers; browsers call your server.",
        },
      },
    ],

    task: {
      title: "Project: weather app or data dashboard",
      intro:
        "Build a single-page app that loads real data from a public API. Open-Meteo (no key needed) for weather, or a public data API of your choice, such as REST Countries.",
      prompts: [
        "A search form for a city or item, handled with submit and preventDefault, validated before any request is sent.",
        "An async function that calls fetch, checks response.ok and throws a meaningful error for 404 and for 5xx responses.",
        "A state object with status idle, loading, success, empty or error, and a render function that shows a distinct message for each.",
        "A converter function that turns the API's response shape into the shape your page needs, so no other code reads the API's field names.",
        "Load three cities or items in parallel with Promise.all for a comparison view. If the API you choose needs a secret key, do not put it in the browser: use Open-Meteo instead, or call it through a serverless function.",
      ],
      closing:
        "Turn on network throttling in DevTools (Network → Slow 4G) and use your app. If you cannot always tell what it is doing, a state is missing.",
    },

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
