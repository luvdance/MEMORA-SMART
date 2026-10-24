/**
 * ASSESSMENTS · MOBILE APP DEVELOPMENT · MODULE 4 · MODERN JAVASCRIPT AND ASYNCHRONOUS PROGRAMMING
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Never import this from anything under src/.
 * ═════════════════════════════════════════════════════════════════════════
 */

import { q, check } from "./md-helpers.js";

export const ASSESSMENTS = {
  ...check("md-l13-functions", [
    q({ id: "mdq13-1", atom: "a-md-arrow", d: 2, prompt: "What does (n) => n * 2 return when called with 5?", options: ["10", "undefined", "5", "\"n * 2\""], correct: "a",
      explanation: "A single-expression arrow function returns its value.",
      wrong: { b: "Without braces, the value is returned.", c: "It doubles.", d: "It is evaluated, not text." } }),
    q({ id: "mdq13-2", atom: "a-md-arrow", d: 3, prompt: "Which arrow function returns an object?", options: ["(name) => ({ name })", "(name) => { name }", "(name) => [name]", "name => name"], correct: "a",
      explanation: "Brackets around the braces make them an object, not a block.",
      wrong: { b: "Braces alone are a function body; it returns undefined.", c: "Returns an array.", d: "Returns the string." } }),
    q({ id: "mdq13-3", atom: "a-md-callbacks", d: 2, prompt: "setTimeout(fn, 0) is called, then console.log(\"after\"). What runs first?", options: ["console.log(\"after\")", "fn", "They run at the same time", "Neither"], correct: "a",
      explanation: "Callbacks run after the current code finishes, even with 0 ms.",
      wrong: { b: "The timer waits for the current code.", c: "JavaScript runs one thing at a time.", d: "Both run." } }),
    q({ id: "mdq13-4", atom: "a-md-higher-order", d: 2, prompt: "Which is a higher-order function?", options: ["One that takes or returns a function", "One with more than three parameters", "One defined at the top of a file", "One that returns a number"], correct: "a",
      explanation: "map, filter and your own cheaperThan are examples.",
      wrong: { b: "Parameter count is irrelevant.", c: "Position is irrelevant.", d: "Unrelated." } }),
    q({ id: "mdq13-5", atom: "a-md-higher-order", d: 3, prompt: "over(limit) returns (item) => item.price > limit. What is over(100)({ price: 150 })?", options: ["true", "false", "A function", "150"], correct: "a",
      explanation: "over(100) gives the test; calling it with the item gives 150 > 100.",
      wrong: { b: "150 is more than 100.", c: "The second call runs the function.", d: "It returns a boolean." } }),
  ]),

  ...check("md-l14-array-methods", [
    q({ id: "mdq14-1", atom: "a-md-map-filter-find", d: 2, prompt: "Which method returns a new array of only the items that pass a test?", options: ["filter", "map", "find", "forEach"], correct: "a",
      explanation: "filter keeps the matching items.",
      wrong: { b: "map transforms every item.", c: "find returns one item.", d: "forEach returns nothing." } }),
    q({ id: "mdq14-2", atom: "a-md-map-filter-find", d: 2, prompt: "What does find return when nothing matches?", options: ["undefined", "An empty array", "null", "false"], correct: "a",
      explanation: "find gives the first match or undefined.",
      wrong: { b: "That is filter.", c: "undefined, not null.", d: "It returns an item or undefined." } }),
    q({ id: "mdq14-3", atom: "a-md-map-filter-find", d: 3, prompt: "What is [1, 2, 3].map((n) => n * 10).filter((n) => n > 15)?", options: ["[20, 30]", "[2, 3]", "[10, 20, 30]", "[30]"], correct: "a",
      explanation: "map gives [10, 20, 30]; filter keeps 20 and 30.",
      wrong: { b: "Those are the originals.", c: "filter removes 10.", d: "20 is also over 15." } }),
    q({ id: "mdq14-4", atom: "a-md-reduce", d: 2, prompt: "What is [5, 10, 20].reduce((sum, n) => sum + n, 0)?", options: ["35", "0", "20", "[5, 10, 20]"], correct: "a",
      explanation: "0 + 5 + 10 + 20.",
      wrong: { b: "That is the start.", c: "That is the last item.", d: "reduce returns one value." } }),
    q({ id: "mdq14-5", atom: "a-md-reduce", d: 3, prompt: "Why always give reduce a starting value?", options: ["Without one, an empty array throws and the first item becomes the start", "It is faster", "It sorts the array", "It is required by the screen"], correct: "a",
      explanation: "[].reduce(fn) throws a TypeError.",
      wrong: { b: "Not about speed.", c: "Unrelated.", d: "Unrelated." } }),
  ]),

  ...check("md-l15-async", [
    q({ id: "mdq15-1", atom: "a-md-promises", d: 2, prompt: "What are the possible outcomes of a promise?", options: ["Fulfilled with a value or rejected with an error, once", "It can fulfil many times", "It always fulfils", "It runs synchronously"], correct: "a",
      explanation: "Pending, then settled exactly once.",
      wrong: { b: "Only once.", c: "It can reject.", d: "Its callbacks run later." } }),
    q({ id: "mdq15-2", atom: "a-md-promises", d: 3, prompt: "Promise.all([a, b]) where b rejects. What happens?", options: ["The combined promise rejects", "It fulfils with only a's value", "It waits forever", "It retries b"], correct: "a",
      explanation: "If any promise fails, Promise.all fails.",
      wrong: { b: "That is not how all works.", c: "It settles as soon as one rejects.", d: "No automatic retry." } }),
    q({ id: "mdq15-3", atom: "a-md-async-await", d: 2, prompt: "What does an async function always return?", options: ["A promise", "undefined", "The value directly", "An error"], correct: "a",
      explanation: "Its return value is wrapped in a promise.",
      wrong: { b: "It returns a promise.", c: "Callers must await it.", d: "Only if it throws, as a rejected promise." } }),
    q({ id: "mdq15-4", atom: "a-md-async-await", d: 3, prompt: "You wrote const user = getUser(); without await. What is user?", options: ["A promise, not the user", "The user", "undefined", "An error"], correct: "a",
      explanation: "Forgetting await gives you the promise object.",
      wrong: { b: "Only with await.", c: "It is a Promise.", d: "No error is thrown." } }),
    q({ id: "mdq15-5", atom: "a-md-async-lab", d: 3, prompt: "Two independent requests take 1 second each. How do you get both in about 1 second?", options: ["await Promise.all([a(), b()])", "await a(); await b();", "a(); b(); with no await", "Use a for loop"], correct: "a",
      explanation: "Start both, then wait for both.",
      wrong: { b: "That takes 2 seconds.", c: "You would not have the results.", d: "A loop still awaits one at a time." } }),
  ]),

  ...check("md-l16-fetch", [
    q({ id: "mdq16-1", atom: "a-md-fetch", d: 2, prompt: "Why are there two awaits in const data = await (await fetch(url)).json()?", options: ["The response arrives first; reading its body is a second async step", "fetch must be awaited twice", "json() is synchronous", "To make it slower"], correct: "a",
      explanation: "Headers arrive, then the body is read and parsed.",
      wrong: { b: "Each await is for a different promise.", c: "json() returns a promise.", d: "Not the reason." } }),
    q({ id: "mdq16-2", atom: "a-md-json", d: 2, prompt: "What happens to a Date when you JSON.stringify an object containing it?", options: ["It becomes an ISO date string", "It is removed", "It stays a Date after parsing", "It throws"], correct: "a",
      explanation: "Convert back with new Date(text).",
      wrong: { b: "undefined is removed; dates become strings.", c: "Parsing gives a string.", d: "No error." } }),
    q({ id: "mdq16-3", atom: "a-md-http", d: 3, prompt: "The server answers 404. What does fetch do?", options: ["Resolves with a response whose ok is false", "Rejects with an error", "Retries automatically", "Returns undefined"], correct: "a",
      explanation: "fetch only rejects when the network fails; check response.ok.",
      wrong: { b: "A 404 is still a response.", c: "No automatic retry.", d: "It resolves with a Response." } }),
    q({ id: "mdq16-4", atom: "a-md-http", d: 2, prompt: "Which status code means the server itself failed?", options: ["500", "404", "201", "401"], correct: "a",
      explanation: "5xx codes are server errors.",
      wrong: { b: "Not found: a client-side request problem.", c: "Created: success.", d: "Unauthorized: not signed in." } }),
    q({ id: "mdq16-5", atom: "a-md-request-states", d: 2, prompt: "On React Native, what does fetch throw when the phone is offline?", options: ["TypeError: Network request failed", "404 Not Found", "SyntaxError", "Nothing: it waits forever"], correct: "a",
      explanation: "Turn it into a human message.",
      wrong: { b: "That is a response from a server.", c: "That is invalid JSON.", d: "It fails." } }),
  ]),

  ...check("md-l17-typescript", [
    q({ id: "mdq17-1", atom: "a-md-ts-types", d: 2, prompt: "An Expo app has a type error. What happens when you run it?", options: ["It runs; types are stripped without checking, so run npx tsc --noEmit", "It refuses to start", "It shows a type error screen", "TypeScript fixes it"], correct: "a",
      explanation: "Checking types is a separate step.",
      wrong: { b: "The bundler does not type-check.", c: "No such screen.", d: "TypeScript only reports." } }),
    q({ id: "mdq17-2", atom: "a-md-ts-types", d: 2, prompt: "type Status = \"loading\" | \"done\". Which assignment is an error?", options: ["const s: Status = \"failed\"", "const s: Status = \"done\"", "const s: Status = \"loading\"", "None"], correct: "a",
      explanation: "\"failed\" is not one of the allowed literals.",
      wrong: { b: "Allowed.", c: "Allowed.", d: "\"failed\" is rejected." } }),
    q({ id: "mdq17-3", atom: "a-md-ts-interfaces", d: 2, prompt: "What does the ? in imageUrl?: string mean?", options: ["The property is optional", "It can only be null", "It is a question for the user", "It is private"], correct: "a",
      explanation: "Optional properties may be missing.",
      wrong: { b: "Optional, not null-only.", c: "No.", d: "No." } }),
    q({ id: "mdq17-4", atom: "a-md-ts-interfaces", d: 3, prompt: "Why describe an API response with an interface?", options: ["The compiler then checks every use of the data and autocompletes it", "It makes the request faster", "The server reads it", "It replaces validation on the server"], correct: "a",
      explanation: "Types help you; the server still validates its own input.",
      wrong: { b: "Types do not run.", c: "The server never sees it.", d: "Never a replacement." } }),
    q({ id: "mdq17-5", atom: "a-md-ts-functions", d: 3, prompt: "findUser returns User | undefined. Which line compiles under strict mode?", options: ["findUser(1)?.name ?? \"Unknown\"", "findUser(1).name", "findUser(1)!!", "(findUser(1) as number).name"], correct: "a",
      explanation: "Narrowing handles the missing case.",
      wrong: { b: "Object is possibly undefined.", c: "Not valid.", d: "Wrong cast." } }),
  ]),

  ...check("md-l18-m4-project", [
    q({ id: "mdq18-1", atom: "a-md-m4-project", d: 2, prompt: "In getEvents, where is the network failure caught?", options: ["Around the fetch call, turning it into the offline message", "After response.json()", "In the server", "It is not caught"], correct: "a",
      explanation: "fetch rejects only when the network fails.",
      wrong: { b: "By then the network worked.", c: "The server never sees it.", d: "Then the user sees a raw TypeError." } }),
    q({ id: "mdq18-2", atom: "a-md-m4-project", d: 2, prompt: "Why sort with a copy (events.slice().sort(...))?", options: ["So the original array is not changed", "slice is required by sort", "It sorts faster", "It removes duplicates"], correct: "a",
      explanation: "sort changes the array it is called on.",
      wrong: { b: "Not required.", c: "Not faster.", d: "No." } }),
    q({ id: "mdq18-3", atom: "a-md-m4-project", d: 3, prompt: "The server returns 503 the first time. What should the user see?", options: ["A clear message and a Try again button", "A spinner forever", "An empty list", "A crash"], correct: "a",
      explanation: "Every failure needs words and a way forward.",
      wrong: { b: "Spinners must end.", c: "Empty means no events, which is not true.", d: "Never." } }),
    q({ id: "mdq18-4", atom: "a-md-m4-project", d: 2, prompt: "Which list state is different from an error?", options: ["Empty: the request worked but there are no events", "Offline", "A 503", "A 404"], correct: "a",
      explanation: "Empty is a success with nothing to show.",
      wrong: { b: "An error.", c: "An error.", d: "An error." } }),
  ]),
};
