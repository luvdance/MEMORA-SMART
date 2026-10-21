/**
 * ASSESSMENTS · REACT DEVELOPMENT · MODULE 9 · WORKING WITH APIs AND SERVER DATA
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Never import this from anything under src/.
 * ═════════════════════════════════════════════════════════════════════════
 */

import { q, check } from "./rx-helpers.js";

export const ASSESSMENTS = {
  ...check("rx-l52-rest", [
    q({ id: "rxq52-1", atom: "a-rx-rest-basics", d: 2, prompt: "Which request changes only a product's price?", options: ["PATCH /api/products/7 with { \"price\": 8000 }", "GET /api/products/7?price=8000", "POST /api/products", "DELETE /api/products/7"], correct: "a",
      explanation: "PATCH sends the changed fields.",
      wrong: { b: "GET must not change data.", c: "POST creates a new product.", d: "Removes it." } }),
    q({ id: "rxq52-2", atom: "a-rx-rest-basics", d: 2, prompt: "What is the difference between 401 and 403?", options: ["401: not signed in; 403: signed in but not allowed", "They are the same", "401 is a server crash", "403 means not found"], correct: "a",
      explanation: "Only 401 calls for signing in again.",
      wrong: { b: "Different meanings.", c: "That is 5xx.", d: "That is 404." } }),
    q({ id: "rxq52-3", atom: "a-rx-fetch-json", d: 3, prompt: "A server sends { \"createdAt\": \"2026-03-01T09:30:00Z\" }. After res.json(), what is createdAt?", options: ["A string; convert it with new Date()", "A Date object", "A number", "undefined"], correct: "a",
      explanation: "JSON has no date type.",
      wrong: { b: "JSON cannot carry Dates.", c: "It is the ISO text.", d: "It is present." } }),
    q({ id: "rxq52-4", atom: "a-rx-http-methods", d: 2, prompt: "Why update the screen from the server's response after a POST?", options: ["The server may add an id, timestamps or corrections", "The response is faster", "React requires it", "The request body is lost"], correct: "a",
      explanation: "The server's version is the truth.",
      wrong: { b: "Not about speed.", c: "Not required.", d: "You still have it, but it lacks the server's additions." } }),
  ]),

  ...check("rx-l53-requests", [
    q({ id: "rxq53-1", atom: "a-rx-headers-bodies", d: 2, prompt: "What does the Content-Type: application/json request header say?", options: ["The body you are sending is JSON", "You want HTML back", "You are signed in", "The response is cached"], correct: "a",
      explanation: "Accept says what you want back.",
      wrong: { b: "That is Accept.", c: "That is Authorization.", d: "Unrelated." } }),
    q({ id: "rxq53-2", atom: "a-rx-headers-bodies", d: 3, prompt: "Why must a request helper not always call res.json()?", options: ["A 204 has no body, and broken servers may return HTML", "res.json() is slow", "It is deprecated", "It only works for GET"], correct: "a",
      explanation: "Check the status and parse defensively.",
      wrong: { b: "Not the reason.", c: "It is not.", d: "It works for any response with a JSON body." } }),
    q({ id: "rxq53-3", atom: "a-rx-request-states-api", d: 2, prompt: "A background refetch fails while old data is on screen. What is best?", options: ["Keep showing the data with a small \"could not refresh\" note", "Replace everything with an error page", "Clear the data", "Reload the page"], correct: "a",
      explanation: "Do not throw away data you have.",
      wrong: { b: "Loses useful data.", c: "Same problem.", d: "Unhelpful." } }),
    q({ id: "rxq53-4", atom: "a-rx-api-services", d: 2, prompt: "Why put API calls in service modules like src/api/products.js?", options: ["Components stay free of URLs and HTTP details, and changes happen in one file", "Services run on the server", "It makes requests faster", "fetch only works in .js files"], correct: "a",
      explanation: "Also easy to mock in tests.",
      wrong: { b: "They run in the browser.", c: "Not about speed.", d: "Not true." } }),
  ]),

  ...check("rx-l54-config-queries", [
    q({ id: "rxq54-1", atom: "a-rx-env-vars", d: 2, prompt: "Which variable from .env can your Vite React code read?", options: ["VITE_API_URL", "API_URL", "DATABASE_PASSWORD", "SECRET_KEY"], correct: "a",
      explanation: "Only the VITE_ prefix is exposed.",
      wrong: { b: "No prefix: not exposed.", c: "Not exposed, and must never be.", d: "Not exposed." } }),
    q({ id: "rxq54-2", atom: "a-rx-env-vars", d: 3, prompt: "Is a VITE_ variable secret once the app is built?", options: ["No: it is written into the JavaScript anyone can download", "Yes, it is encrypted", "Only in production", "Only if .env is in .gitignore"], correct: "a",
      explanation: "Never put secrets in frontend variables.",
      wrong: { b: "No encryption.", c: "Visible in every build.", d: ".gitignore keeps it out of Git, not out of the bundle." } }),
    q({ id: "rxq54-3", atom: "a-rx-api-queries", d: 2, prompt: "Why build query strings with URLSearchParams?", options: ["It encodes values, so \"tote & bag\" stays one value", "It is shorter", "It sends the request", "It sorts the results"], correct: "a",
      explanation: "An unencoded & starts a new parameter.",
      wrong: { b: "Not the reason.", c: "It only builds text.", d: "The server sorts." } }),
    q({ id: "rxq54-4", atom: "a-rx-api-queries", d: 2, prompt: "Why sort and page large lists on the server?", options: ["Only one page of data travels to the browser", "Browsers cannot sort", "It is required by REST", "It avoids JSON"], correct: "a",
      explanation: "Downloading 100,000 rows to show 20 is wasteful.",
      wrong: { b: "They can, for small lists.", c: "Not required.", d: "Still JSON." } }),
  ]),

  ...check("rx-l55-auth-requests", [
    q({ id: "rxq55-1", atom: "a-rx-auth-tokens", d: 2, prompt: "How is a bearer token usually sent?", options: ["Authorization: Bearer <token> header", "In the URL query string", "In the request body of every GET", "In a CSS file"], correct: "a",
      explanation: "One header, added by the API client.",
      wrong: { b: "URLs end up in logs and history.", c: "GET requests have no body.", d: "Unrelated." } }),
    q({ id: "rxq55-2", atom: "a-rx-auth-tokens", d: 2, prompt: "Where should the Authorization header be added?", options: ["In one API client function every request uses", "In each component", "In index.html", "In the server's database"], correct: "a",
      explanation: "One place, never forgotten.",
      wrong: { b: "Easy to forget one.", c: "Unrelated.", d: "Unrelated." } }),
    q({ id: "rxq55-3", atom: "a-rx-expired-sessions", d: 3, prompt: "An API call returns 403. What should happen?", options: ["Explain the user does not have access; keep them signed in", "Sign them out", "Retry forever", "Reload the page"], correct: "a",
      explanation: "403 is about permission, not the session.",
      wrong: { b: "That is for 401.", c: "Retrying gives 403 again.", d: "Unhelpful." } }),
    q({ id: "rxq55-4", atom: "a-rx-expired-sessions", d: 2, prompt: "Where should a 401 be handled?", options: ["Centrally, in the API client, with a callback that signs the user out", "In every component separately", "Nowhere; ignore it", "In CSS"], correct: "a",
      explanation: "One handler for every request.",
      wrong: { b: "Duplicated and forgotten.", c: "The user is stuck.", d: "Unrelated." } }),
  ]),

  ...check("rx-l56-query", [
    q({ id: "rxq56-1", atom: "a-rx-axios-query", d: 2, prompt: "How does Axios differ from fetch on a 500 response?", options: ["Axios rejects; fetch fulfils with ok false", "They behave the same", "fetch rejects; Axios fulfils", "Neither can see a 500"], correct: "a",
      explanation: "Axios treats non-2xx as errors.",
      wrong: { b: "They differ.", c: "Reversed.", d: "Both see it." } }),
    q({ id: "rxq56-2", atom: "a-rx-axios-query", d: 2, prompt: "What does TanStack Query's queryKey do?", options: ["Identifies the data in the cache, so components asking for the same key share it", "Encrypts the request", "Sets the URL", "Names the component"], correct: "a",
      explanation: "Same key, same cached data.",
      wrong: { b: "Unrelated.", c: "The queryFn does the request.", d: "Unrelated." } }),
    q({ id: "rxq56-3", atom: "a-rx-cache-invalidate", d: 2, prompt: "After creating a product with a mutation, how does the list update?", options: ["invalidateQueries([\"products\"]) marks it stale and refetches it", "It updates itself without anything", "You must reload the page", "You call setState on the cache by hand every time"], correct: "a",
      explanation: "Invalidate, then the query refetches.",
      wrong: { b: "Not without invalidation or an update.", c: "Unnecessary.", d: "Possible (setQueryData), but invalidation is the normal way." } }),
    q({ id: "rxq56-4", atom: "a-rx-cache-invalidate", d: 3, prompt: "What must an optimistic update do if the server then fails?", options: ["Roll the cache back to its previous value", "Nothing", "Show the optimistic value forever", "Delete the cache"], correct: "a",
      explanation: "onError restores the snapshot taken in onMutate.",
      wrong: { b: "The screen would show a lie.", c: "Same problem.", d: "Loses data." } }),
    q({ id: "rxq56-5", atom: "a-rx-cors", d: 3, prompt: "Who can fix a CORS error for a third-party API?", options: ["The API's server, by allowing your origin, or you, by calling it from your own server", "Your React code, with a header", "The user, by refreshing", "Nobody"], correct: "a",
      explanation: "CORS is the server's permission, enforced by the browser.",
      wrong: { b: "The header must come from the server's response.", c: "Same result.", d: "Proxies and server calls work." } }),
  ]),

  ...check("rx-l57-m9-project", [
    q({ id: "rxq57-1", atom: "a-rx-m9-project", d: 2, prompt: "In the dashboard, why does every mutation invalidate [\"products\"]?", options: ["So the list refetches and shows what the server now holds", "To clear the browser's cache", "To sign the user out", "To retry failed requests"], correct: "a",
      explanation: "The server's state is the truth.",
      wrong: { b: "It is TanStack Query's cache only.", c: "Unrelated.", d: "Unrelated." } }),
    q({ id: "rxq57-2", atom: "a-rx-m9-project", d: 2, prompt: "Delete returns 204. What should deleteProduct return?", options: ["null, without parsing a body", "res.json()", "An error", "The deleted product, from the response"], correct: "a",
      explanation: "204 has no body.",
      wrong: { b: "Parsing an empty body throws.", c: "It succeeded.", d: "There is no body." } }),
    q({ id: "rxq57-3", atom: "a-rx-m9-project", d: 3, prompt: "Which shows the dashboard's API logic is well separated?", options: ["No component contains a URL or fetch; they call service functions", "Every component has its own fetch", "URLs are in CSS", "The API key is in App.jsx"], correct: "a",
      explanation: "Components speak in products, not HTTP.",
      wrong: { b: "The opposite.", c: "Meaningless.", d: "Never put keys in the frontend." } }),
    q({ id: "rxq57-4", atom: "a-rx-m9-project", d: 2, prompt: "An add-product request fails with 422 and a message. What should the dashboard show?", options: ["The server's message in an alert, keeping the form values", "A blank page", "Nothing; retry silently", "A full page reload"], correct: "a",
      explanation: "Show what went wrong; keep the user's input.",
      wrong: { b: "Looks broken.", c: "The same data will fail again.", d: "Loses the input." } }),
  ]),
};
