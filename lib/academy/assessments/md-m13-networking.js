/**
 * ASSESSMENTS · MOBILE APP DEVELOPMENT · MODULE 13 · REST APIS AND NETWORKING
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Never import this from anything under src/.
 * ═════════════════════════════════════════════════════════════════════════
 */

import { q, check } from "./md-helpers.js";

export const ASSESSMENTS = {
  ...check("md-l77-endpoints-methods", [
    q({ id: "mdq77-1", atom: "a-md-endpoints", d: 1, prompt: "In GET /v1/products/p2?currency=NGN, what is p2?", options: ["A path parameter choosing one resource", "A query parameter", "The API version", "A header"], correct: "a",
      explanation: "currency=NGN is the query parameter; v1 the version.",
      wrong: { b: "That's currency.", c: "That's v1.", d: "Headers aren't in the URL." } }),
    q({ id: "mdq77-2", atom: "a-md-endpoints", d: 2, prompt: "Why encodeURIComponent(\"home & garden\") before putting it in a path?", options: ["Spaces and & would break or change the URL", "To encrypt it", "Servers require lowercase", "To make it shorter"], correct: "a",
      explanation: "It becomes home%20%26%20garden.",
      wrong: { b: "Encoding isn't encryption.", c: "No.", d: "It gets longer." } }),
    q({ id: "mdq77-3", atom: "a-md-http-methods", d: 2, prompt: "Which method changes only the fields you send?", options: ["PATCH", "PUT", "POST", "GET"], correct: "a",
      explanation: "PUT replaces the whole resource.",
      wrong: { b: "Replaces everything.", c: "Creates.", d: "Reads." } }),
    q({ id: "mdq77-4", atom: "a-md-http-methods", d: 3, prompt: "DELETE answers 204 and your code calls response.json(). What happens?", options: ["It throws: 204 has no body", "It returns {}", "It returns null", "It retries"], correct: "a",
      explanation: "Check for 204 first.",
      wrong: { b: "No.", c: "No.", d: "No." } }),
    q({ id: "mdq77-5", atom: "a-md-http-methods", d: 3, prompt: "Which of these is NOT idempotent?", options: ["POST", "GET", "PUT", "DELETE"], correct: "a",
      explanation: "Repeating a POST can create duplicates.",
      wrong: { b: "Safe to repeat.", c: "Same result each time.", d: "Gone is gone." } }),
  ]),

  ...check("md-l78-status-json", [
    q({ id: "mdq78-1", atom: "a-md-status-headers", d: 2, prompt: "What does 401 mean, and what should the app do?", options: ["Not signed in or session expired: ask the user to sign in", "Not allowed: hide the feature", "Not found: show 404", "Server error: retry"], correct: "a",
      explanation: "403 is signed in but not allowed.",
      wrong: { b: "That's 403.", c: "That's 404.", d: "That's 5xx." } }),
    q({ id: "mdq78-2", atom: "a-md-status-headers", d: 2, prompt: "A 429 response includes Retry-After: 30. What does it mean?", options: ["Wait 30 seconds before trying again", "Retry 30 times", "The request took 30 ms", "The token lasts 30 minutes"], correct: "a",
      explanation: "Respect it.",
      wrong: { b: "No.", c: "No.", d: "No." } }),
    q({ id: "mdq78-3", atom: "a-md-status-headers", d: 1, prompt: "Which status class means the SERVER failed?", options: ["5xx", "4xx", "3xx", "2xx"], correct: "a",
      explanation: "4xx means the request was wrong.",
      wrong: { b: "Client errors.", c: "Redirects.", d: "Success." } }),
    q({ id: "mdq78-4", atom: "a-md-json-api", d: 2, prompt: "Why validate JSON responses with a schema?", options: ["response.json() is untyped, and a server change could silently break screens", "JSON is slow", "Servers require it", "To compress it"], correct: "a",
      explanation: "Check at the edge, trust inside.",
      wrong: { b: "No.", c: "No.", d: "No." } }),
    q({ id: "mdq78-5", atom: "a-md-json-api", d: 2, prompt: "How do dates travel in JSON?", options: ["As ISO 8601 strings, converted to Date in the app", "As Date objects", "As images", "They can't"], correct: "a",
      explanation: "\"2026-10-03T09:30:00Z\"",
      wrong: { b: "JSON has no Date type.", c: "No.", d: "They can, as text." } }),
  ]),

  ...check("md-l79-client-cancel", [
    q({ id: "mdq79-1", atom: "a-md-http-client", d: 2, prompt: "What does URLSearchParams do for query parameters?", options: ["Builds and encodes the query string", "Sends the request", "Parses JSON", "Adds tokens"], correct: "a",
      explanation: "A space becomes +, & becomes %26.",
      wrong: { b: "fetch does.", c: "No.", d: "No." } }),
    q({ id: "mdq79-2", atom: "a-md-http-client", d: 2, prompt: "Why use one HTTP client for the whole app?", options: ["Base URL, headers, errors and tokens are handled in one place", "fetch only works once", "Libraries are faster", "Stores require it"], correct: "a",
      explanation: "No repetition.",
      wrong: { b: "No.", c: "Not necessarily.", d: "No." } }),
    q({ id: "mdq79-3", atom: "a-md-cancellation", d: 3, prompt: "Search for \"ank\" then \"ankara\": why can the \"ank\" results end up on screen?", options: ["Replies can arrive in any order; the older one arrived last", "The server ignores the second", "React caches it", "fetch retries"], correct: "a",
      explanation: "Abort the older request.",
      wrong: { b: "No.", c: "No.", d: "No." } }),
    q({ id: "mdq79-4", atom: "a-md-cancellation", d: 2, prompt: "What does an aborted fetch do?", options: ["Rejects with an AbortError, which you should ignore", "Resolves with null", "Retries", "Crashes the app"], correct: "a",
      explanation: "Not a real failure.",
      wrong: { b: "It rejects.", c: "No.", d: "Not if handled." } }),
  ]),

  ...check("md-l80-auth-pagination", [
    q({ id: "mdq80-1", atom: "a-md-auth-headers", d: 2, prompt: "Where does a token go in a request?", options: ["Authorization: Bearer <token>", "?token=<token> in the URL", "The request body of a GET", "A cookie named token"], correct: "a",
      explanation: "URLs end up in logs.",
      wrong: { b: "Leaks into logs and histories.", c: "GETs have no body.", d: "Not how mobile APIs work usually." } }),
    q({ id: "mdq80-2", atom: "a-md-auth-headers", d: 2, prompt: "A private endpoint answers 401. What should the app do?", options: ["Clear the token and ask the user to sign in, with a clear message", "Retry forever", "Ignore it", "Show the raw response"], correct: "a",
      explanation: "Module 15 adds refresh tokens first.",
      wrong: { b: "It won't change.", c: "Broken screens.", d: "Confusing." } }),
    q({ id: "mdq80-3", atom: "a-md-pagination", d: 2, prompt: "Why prefer cursor pagination for a feed?", options: ["Items aren't skipped or repeated when new ones are added", "It is shorter", "It needs no server", "Pages are bigger"], correct: "a",
      explanation: "Offsets shift when the list changes.",
      wrong: { b: "No.", c: "No.", d: "No." } }),
    q({ id: "mdq80-4", atom: "a-md-pagination", d: 3, prompt: "onEndReached fires several times. How do you avoid loading a page twice?", options: ["Only fetch when hasNextPage and not isFetchingNextPage", "Use a bigger page", "Disable scrolling", "Add a delay"], correct: "a",
      explanation: "Guard it.",
      wrong: { b: "Still fires repeatedly.", c: "No.", d: "Unreliable." } }),
  ]),

  ...check("md-l81-timeouts-retries", [
    q({ id: "mdq81-1", atom: "a-md-timeouts", d: 2, prompt: "How long does fetch wait by default?", options: ["It has no timeout of its own", "5 seconds", "30 seconds exactly", "Until the screen closes"], correct: "a",
      explanation: "Add one with AbortController.",
      wrong: { b: "No.", c: "No.", d: "No." } }),
    q({ id: "mdq81-2", atom: "a-md-timeouts", d: 2, prompt: "Which failure makes fetch REJECT rather than resolve?", options: ["No network", "A 500 response", "A 404 response", "A 429 response"], correct: "a",
      explanation: "Responses with error statuses still resolve.",
      wrong: { b: "Resolves.", c: "Resolves.", d: "Resolves." } }),
    q({ id: "mdq81-3", atom: "a-md-retry", d: 2, prompt: "Which response should NOT be retried?", options: ["400 Bad Request", "503 Service Unavailable", "429 Too Many Requests", "A network failure"], correct: "a",
      explanation: "The same request will fail again.",
      wrong: { b: "May recover.", c: "Retry after waiting.", d: "May recover." } }),
    q({ id: "mdq81-4", atom: "a-md-retry", d: 3, prompt: "Why add random jitter to backoff delays?", options: ["So many phones don't retry at the same instant", "To confuse attackers", "Servers require it", "To make tests pass"], correct: "a",
      explanation: "Avoids a thundering herd.",
      wrong: { b: "No.", c: "No.", d: "No." } }),
    q({ id: "mdq81-5", atom: "a-md-retry", d: 3, prompt: "Why is automatically retrying a payment POST dangerous?", options: ["It may charge twice unless the server deduplicates (an idempotency key)", "POSTs can't be retried", "It's slower", "It needs a new token"], correct: "a",
      explanation: "Retry only idempotent requests.",
      wrong: { b: "They can, unsafely.", c: "Not the issue.", d: "No." } }),
  ]),

  ...check("md-l82-uploads-testing", [
    q({ id: "mdq82-1", atom: "a-md-uploads", d: 2, prompt: "How is a file appended to React Native's FormData?", options: ["{ uri, name, type }", "A Blob from the disk", "A base64 string in JSON", "The file path as text"], correct: "a",
      explanation: "React Native reads the file from the uri.",
      wrong: { b: "Not on React Native.", c: "Big and slow.", d: "Not enough." } }),
    q({ id: "mdq82-2", atom: "a-md-uploads", d: 3, prompt: "Why not set Content-Type: multipart/form-data yourself?", options: ["fetch must add the boundary; a hand-written header lacks it", "It's not allowed", "It makes uploads slower", "Servers ignore it"], correct: "a",
      explanation: "Let fetch write it.",
      wrong: { b: "Allowed but broken.", c: "No.", d: "They need it." } }),
    q({ id: "mdq82-3", atom: "a-md-uploads", d: 2, prompt: "What should happen when the user cancels the picker?", options: ["Nothing: no upload and no error", "Show an error", "Upload a placeholder", "Close the app"], correct: "a",
      explanation: "Check result.canceled.",
      wrong: { b: "They chose to cancel.", c: "No.", d: "No." } }),
    q({ id: "mdq82-4", atom: "a-md-api-testing", d: 2, prompt: "Why test the unhappy paths (400, 401, 404) of an API?", options: ["The app relies on them, and they break silently", "They are faster", "Happy paths can't be tested", "Postman requires it"], correct: "a",
      explanation: "A missing 401 is a security hole.",
      wrong: { b: "No.", c: "They can.", d: "No." } }),
    q({ id: "mdq82-5", atom: "a-md-api-testing", d: 1, prompt: "What does an environment in Postman or Bruno hold?", options: ["Values such as {{baseUrl}} for local, staging and production", "The phone's settings", "Test results", "The database"], correct: "a",
      explanation: "One collection, many targets.",
      wrong: { b: "No.", c: "No.", d: "No." } }),
  ]),

  ...check("md-l83-m13-project", [
    q({ id: "mdq83-1", atom: "a-md-m13-project", d: 2, prompt: "Why turn off TanStack Query's own retries in the news reader?", options: ["The service already retries; both would multiply the attempts", "They don't work", "To load faster", "Retries aren't needed"], correct: "a",
      explanation: "One layer retries.",
      wrong: { b: "They do work.", c: "No.", d: "The server is flaky." } }),
    q({ id: "mdq83-2", atom: "a-md-m13-project", d: 2, prompt: "The phone goes offline with articles on screen. What should happen?", options: ["Keep showing them, with an offline banner", "Clear the list", "Show an error page", "Close the app"], correct: "a",
      explanation: "Keep what you have.",
      wrong: { b: "Throws away good data.", c: "Unhelpful.", d: "No." } }),
    q({ id: "mdq83-3", atom: "a-md-m13-project", d: 2, prompt: "Why pass TanStack Query's signal to fetch?", options: ["Outdated queries (an old search) are cancelled", "To sign requests", "To add a token", "For caching"], correct: "a",
      explanation: "Cancellation for free.",
      wrong: { b: "No.", c: "No.", d: "No." } }),
    q({ id: "mdq83-4", atom: "a-md-m13-project", d: 3, prompt: "How can you test a bad network on a real phone?", options: ["Android developer options / iOS Network Link Conditioner, and airplane mode", "Only in the simulator", "You can't", "By editing app.json"], correct: "a",
      explanation: "Test slow and offline.",
      wrong: { b: "Real phones too.", c: "You can.", d: "No." } }),
  ]),
};
