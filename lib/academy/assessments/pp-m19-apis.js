/**
 * ASSESSMENTS · PYTHON PROGRAMMING · MODULE 19
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Never import this from anything under src/.
 * ═════════════════════════════════════════════════════════════════════════
 */

export const ASSESSMENTS = {
  /* ═══════════════════════════════════════════════════════════════════ */
  "pp-l78-http": {
    lessonId: "pp-l78-http",
    passMark: 70,
    questions: [
      {
        id: "ppq78-1",
        type: "mcq",
        difficulty: 1,
        atomId: "a-pp-client-server",
        prompt: "In a weather app, which is the client and which is the server?",
        options: [
          { id: "a", text: "The app on the phone is the client; the computer that holds the weather data and answers requests is the server" },
          { id: "b", text: "The phone is the server; the weather service is the client" },
          { id: "c", text: "Both are servers" },
          { id: "d", text: "There is no server" },
        ],
        correct: "a",
        explanation: "Clients send requests; servers process them and respond.",
        whyWrong: {
          b: "It is the other way round.",
          c: "The phone app initiates requests, which makes it a client.",
          d: "The data has to come from somewhere.",
        },
      },
      {
        id: "ppq78-2",
        type: "mcq",
        difficulty: 2,
        atomId: "a-pp-http-request-response",
        prompt: "Which part of an HTTP request carries the JSON data for a new student?",
        options: [
          { id: "a", text: "The body" },
          { id: "b", text: "The status code" },
          { id: "c", text: "The method" },
          { id: "d", text: "The host name" },
        ],
        correct: "a",
        explanation: "The body carries data; headers describe it (Content-Type: application/json).",
        whyWrong: {
          b: "Status codes belong to responses.",
          c: "The method says what to do (POST), not the data.",
          d: "The host says which server.",
        },
      },
      {
        id: "ppq78-3",
        type: "mcq",
        difficulty: 2,
        atomId: "a-pp-methods-status-json",
        prompt: "A request returns 404. What does that mean?",
        options: [
          { id: "a", text: "The requested resource was not found" },
          { id: "b", text: "Success" },
          { id: "c", text: "The server crashed" },
          { id: "d", text: "You are sending requests too fast" },
        ],
        correct: "a",
        explanation: "404 Not Found is a client error: that URL or item does not exist.",
        whyWrong: {
          b: "Success is 2xx.",
          c: "Server failures are 5xx.",
          d: "That is 429.",
        },
      },
      {
        id: "ppq78-4",
        type: "mcq",
        difficulty: 2,
        atomId: "a-pp-methods-status-json",
        prompt: "Which HTTP method should create a new resource?",
        options: [
          { id: "a", text: "POST" },
          { id: "b", text: "GET" },
          { id: "c", text: "DELETE" },
          { id: "d", text: "HEAD" },
        ],
        correct: "a",
        explanation: "POST creates; GET reads; DELETE removes.",
        whyWrong: {
          b: "GET must only read, never change data.",
          c: "DELETE removes resources.",
          d: "HEAD fetches headers only.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "pp-l79-consuming-apis": {
    lessonId: "pp-l79-consuming-apis",
    passMark: 70,
    questions: [
      {
        id: "ppq79-1",
        type: "mcq",
        difficulty: 2,
        atomId: "a-pp-rest",
        prompt: "In a REST API, which URL and method update student 41?",
        options: [
          { id: "a", text: "PATCH /students/41" },
          { id: "b", text: "GET /updateStudent?id=41" },
          { id: "c", text: "POST /students/41/delete" },
          { id: "d", text: "GET /students/41" },
        ],
        correct: "a",
        explanation: "REST uses the resource URL with a method as the verb; PATCH (or PUT) updates.",
        whyWrong: {
          b: "Verbs belong in the method, not the URL, and GET must not change data.",
          c: "That describes deletion, awkwardly.",
          d: "GET reads the student.",
        },
      },
      {
        id: "ppq79-2",
        type: "mcq",
        difficulty: 2,
        atomId: "a-pp-requests",
        prompt: "What does response.raise_for_status() do in requests?",
        options: [
          { id: "a", text: "Raises an exception if the status code is 4xx or 5xx" },
          { id: "b", text: "Prints the status code" },
          { id: "c", text: "Retries the request" },
          { id: "d", text: "Converts the body to JSON" },
        ],
        correct: "a",
        explanation: "It turns an error response into an exception you can catch.",
        whyWrong: {
          b: "It does not print.",
          c: "requests does not retry by itself.",
          d: "That is response.json().",
        },
      },
      {
        id: "ppq79-3",
        type: "mcq",
        difficulty: 2,
        atomId: "a-pp-timeouts-errors",
        prompt: "Why always pass timeout= to requests.get?",
        options: [
          { id: "a", text: "Without it, a server that never answers can freeze your program forever" },
          { id: "b", text: "Requests are illegal without a timeout" },
          { id: "c", text: "It makes the server faster" },
          { id: "d", text: "It encrypts the request" },
        ],
        correct: "a",
        explanation: "requests waits indefinitely by default. A timeout turns a hang into a catchable error.",
        whyWrong: {
          b: "It is allowed, just risky.",
          c: "It changes nothing on the server.",
          d: "HTTPS does the encryption.",
        },
      },
      {
        id: "ppq79-4",
        type: "mcq",
        difficulty: 3,
        atomId: "a-pp-timeouts-errors",
        prompt: "Which response is NOT worth retrying automatically?",
        options: [
          { id: "a", text: "400 Bad Request" },
          { id: "b", text: "503 Service Unavailable" },
          { id: "c", text: "429 Too Many Requests" },
          { id: "d", text: "A timeout" },
        ],
        correct: "a",
        explanation: "A 400 means your request is wrong; sending it again will fail again. Fix the request instead.",
        whyWrong: {
          b: "503 is usually temporary.",
          c: "429 asks you to wait and try again.",
          d: "Timeouts are often temporary network problems.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "pp-l80-building-apis": {
    lessonId: "pp-l80-building-apis",
    passMark: 70,
    questions: [
      {
        id: "ppq80-1",
        type: "mcq",
        difficulty: 2,
        atomId: "a-pp-flask",
        prompt: "In Flask, what does @app.get(\"/students\") above a function do?",
        options: [
          { id: "a", text: "Runs that function for GET requests to /students and sends its return value as the response" },
          { id: "b", text: "Downloads all students" },
          { id: "c", text: "Creates a students table" },
          { id: "d", text: "Imports the students module" },
        ],
        correct: "a",
        explanation: "The decorator registers the function as the handler for that method and URL.",
        whyWrong: {
          b: "It defines how to answer requests; it does not fetch anything itself.",
          c: "Flask does not create database tables.",
          d: "It is a route, not an import.",
        },
      },
      {
        id: "ppq80-2",
        type: "mcq",
        difficulty: 2,
        atomId: "a-pp-api-validation",
        prompt: "A POST arrives without the required name field. What should the API return?",
        options: [
          { id: "a", text: "400 with a JSON error saying the name is required" },
          { id: "b", text: "200 and create the record anyway" },
          { id: "c", text: "500 Internal Server Error" },
          { id: "d", text: "404 Not Found" },
        ],
        correct: "a",
        explanation: "400 tells the client its request was invalid; the message tells it how to fix it.",
        whyWrong: {
          b: "Accepting invalid data corrupts the database.",
          c: "500 means the server failed; here the client did.",
          d: "The URL exists; the data is the problem.",
        },
      },
      {
        id: "ppq80-3",
        type: "mcq",
        difficulty: 2,
        atomId: "a-pp-api-auth",
        prompt: "What is the difference between 401 and 403?",
        options: [
          { id: "a", text: "401: no valid credentials were supplied; 403: credentials were understood but do not allow this action" },
          { id: "b", text: "They mean the same" },
          { id: "c", text: "401 is a server error" },
          { id: "d", text: "403 means not found" },
        ],
        correct: "a",
        explanation: "Unauthenticated versus unauthorised: who are you, versus you may not.",
        whyWrong: {
          b: "They describe different situations.",
          c: "Both are 4xx client errors.",
          d: "That is 404.",
        },
      },
      {
        id: "ppq80-4",
        type: "mcq",
        difficulty: 3,
        atomId: "a-pp-api-auth",
        prompt: "Why compare API keys with hmac.compare_digest instead of ==?",
        options: [
          { id: "a", text: "It takes the same time whether the keys differ early or late, preventing timing attacks" },
          { id: "b", text: "== cannot compare strings" },
          { id: "c", text: "It encrypts the key" },
          { id: "d", text: "It is shorter to write" },
        ],
        correct: "a",
        explanation: "== can stop at the first different character, leaking how much of a guess was right.",
        whyWrong: {
          b: "== compares strings fine; it just leaks timing.",
          c: "It compares; it does not encrypt.",
          d: "It is longer to write.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "pp-l81-async": {
    lessonId: "pp-l81-async",
    passMark: 70,
    questions: [
      {
        id: "ppq81-1",
        type: "mcq",
        difficulty: 2,
        atomId: "a-pp-async-concepts",
        prompt: "What does calling an async def function return, before it is awaited?",
        options: [
          { id: "a", text: "A coroutine object; the body has not run yet" },
          { id: "b", text: "Its final result" },
          { id: "c", text: "None" },
          { id: "d", text: "An error" },
        ],
        correct: "a",
        explanation: "The body runs when the coroutine is awaited or scheduled by the event loop.",
        whyWrong: {
          b: "The result comes from awaiting it.",
          c: "It returns a coroutine object.",
          d: "Calling it is fine; forgetting to await it is the bug.",
        },
      },
      {
        id: "ppq81-2",
        type: "mcq",
        difficulty: 2,
        atomId: "a-pp-async-concepts",
        prompt: "Which job benefits most from async/await?",
        options: [
          { id: "a", text: "Fetching 100 web pages, where most of the time is spent waiting for responses" },
          { id: "b", text: "Calculating a large factorial" },
          { id: "c", text: "Sorting a list in memory" },
          { id: "d", text: "Adding two numbers" },
        ],
        correct: "a",
        explanation: "Async lets waits overlap. CPU-heavy work does not wait, so it does not speed up.",
        whyWrong: {
          b: "Pure calculation never waits.",
          c: "Sorting is CPU work.",
          d: "There is nothing to wait for.",
        },
      },
      {
        id: "ppq81-3",
        type: "mcq",
        difficulty: 2,
        atomId: "a-pp-async-concepts",
        prompt: "asyncio.gather(a(), b(), c()) returns results in which order?",
        options: [
          { id: "a", text: "The order the coroutines were passed in, whichever finished first" },
          { id: "b", text: "The order they finished" },
          { id: "c", text: "Random order" },
          { id: "d", text: "Alphabetical order" },
        ],
        correct: "a",
        explanation: "gather keeps results aligned with its arguments.",
        whyWrong: {
          b: "Completion order is not used for the results.",
          c: "The order is guaranteed.",
          d: "Names play no part.",
        },
      },
      {
        id: "ppq81-4",
        type: "scenario",
        difficulty: 3,
        atomId: "a-pp-async-practice",
        prompt: "Inside an async function, a developer writes price = fetch_price(\"rice\") without await, where fetch_price is async. What is price?",
        options: [
          { id: "a", text: "A coroutine object, not the price; the request never actually ran" },
          { id: "b", text: "The price" },
          { id: "c", text: "None" },
          { id: "d", text: "A string" },
        ],
        correct: "a",
        explanation: "Without await, the coroutine is created but never executed. Python warns \"coroutine was never awaited\".",
        whyWrong: {
          b: "Only await produces the result.",
          c: "It is a coroutine object.",
          d: "It is a coroutine object.",
        },
      },
    ],
  },
};

export default ASSESSMENTS;
