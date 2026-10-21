/**
 * REACT DEVELOPMENT · MODULE 9 · WORKING WITH APIs AND SERVER DATA
 *
 * Curriculum 9.1 – 9.P. REST, fetch and JSON, every HTTP method, headers,
 * bodies and parsing, request states, API service modules, environment
 * variables, search, sorting and pagination, tokens and expired sessions,
 * Axios and TanStack Query (both bundled in the lab runtime), caching,
 * invalidation and optimistic updates, and CORS.
 *
 * Every request goes to the lab's declared mock API: real Response objects,
 * real status codes and headers, and failures on demand. Checks can read the
 * method, URL, body and headers of every request the app made.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

import { reactLab } from "./rx-helpers.js";

export const SECTION_ID = "rx-s9-apis";
const MODULE = "rx-m9-apis";
const JS = "javascript";

const PRODUCTS = [
  { id: 1, name: "Ankara tote bag", price: 7500, stock: 12 },
  { id: 2, name: "Leather sandals", price: 18000, stock: 0 },
  { id: 3, name: "Beaded bracelet", price: 3000, stock: 40 },
];

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 52 · 9.1 – 9.3
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "rx-l52-rest",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 1,
    covers: ["9.1", "9.2", "9.3"],
    title: "REST APIs, fetch and HTTP Methods",
    subtitle: "Endpoints, methods and status codes, JSON, and GET, POST, PUT, PATCH and DELETE",
    estimatedMinutes: 35,
    intro: "Almost every React app talks to a backend. Most backends speak REST: resources at URLs, verbs for what to do with them, and status codes for what happened.",

    atoms: [
      {
        id: "a-rx-rest-basics",
        title: "REST APIs, endpoints, HTTP methods and status codes",
        explain:
          "A REST API exposes RESOURCES at ENDPOINTS: /api/products is the collection, /api/products/7 one product. The METHOD says what to do: GET reads, POST creates (in a collection), PUT replaces a resource, PATCH changes some fields, DELETE removes. The STATUS CODE says what happened: 200 OK, 201 Created, 204 No Content (success, empty body), 400 Bad Request (your data was invalid), 401 Unauthorized (not signed in), 403 Forbidden (signed in, not allowed), 404 Not Found, 409 Conflict, 422 validation failed, 429 Too Many Requests, 500 server error, 503 unavailable. The API's documentation lists its endpoints, what each accepts and returns, and its errors.",
        table: {
          caption: "A typical REST API for products.",
          headers: ["Request", "Meaning", "Success"],
          rows: [
            ["GET /api/products", "List products", "200 with an array"],
            ["GET /api/products/7", "One product", "200 with an object, or 404"],
            ["POST /api/products", "Create one (JSON body)", "201 with the new product"],
            ["PATCH /api/products/7", "Change some fields", "200 with the updated product"],
            ["PUT /api/products/7", "Replace it entirely", "200"],
            ["DELETE /api/products/7", "Remove it", "204, no body"],
          ],
        },
        decision: {
          scenario: "Saving a profile form returns 422 with the body { \"errors\": { \"phone\": \"Must be 11 digits\" } }.",
          question: "What should the app do?",
          options: [
            { id: "a", text: "Show \"Must be 11 digits\" next to the phone field and keep the form", why: "4xx means the request was wrong; 422 carries validation errors the user can fix." },
            { id: "b", text: "Show \"Server error, try later\"", whyWrong: "That is for 5xx. Retrying the same data will fail the same way." },
            { id: "c", text: "Retry automatically until it works", whyWrong: "The same invalid data will always get 422." },
            { id: "d", text: "Sign the user out", whyWrong: "That would be for 401." },
          ],
          correct: "a",
          aftermath: "4xx: the request needs changing. 5xx: the server failed; retrying may help.",
        },
      },
      {
        id: "a-rx-fetch-json",
        title: "Using fetch() and understanding JSON",
        explain:
          "JSON is TEXT: JSON.stringify(value) turns data into it (to send), JSON.parse(text) turns it back (on receipt), and response.json() reads and parses a response body. Only plain data survives the trip: strings, numbers, booleans, null, arrays and objects. undefined properties disappear, functions disappear, Dates become strings (convert them back with new Date(text)), and NaN becomes null. That is why API data needs care: a field that is a Date on the server arrives as a string.",
        codeExercise: {
          language: JS,
          code: 'const order = {\n  id: 7,\n  placed: new Date("2026-03-01T09:30:00Z"),\n  coupon: undefined,\n  total: NaN,\n  items: [{ name: "Tote", qty: 2 }],\n};\nconst text = JSON.stringify(order);\nconsole.log(text);\nconst back = JSON.parse(text);\nconsole.log(typeof back.placed, "coupon" in back, back.items[0].qty);\n',
          question: "What prints?",
          expectedOutput: '{"id":7,"placed":"2026-03-01T09:30:00.000Z","total":null,"items":[{"name":"Tote","qty":2}]}\nstring false 2',
          hint: "undefined properties are dropped; Dates become ISO strings; NaN becomes null.",
          successMessage: "JSON is plain data only. Convert dates back yourself when you receive them.",
        },
      },
      {
        id: "a-rx-http-methods",
        title: "GET, POST, PUT, PATCH and DELETE requests",
        explain:
          "fetch(url) is a GET. For the others pass an options object: fetch(\"/api/products\", { method: \"POST\", headers: { \"Content-Type\": \"application/json\" }, body: JSON.stringify(product) }). PATCH sends only the changed fields ({ price: 8000 }); PUT sends the whole resource; DELETE usually has no body. After a write, update the screen from the server's answer (the created or updated object), because the server may add ids, timestamps or corrections.",
        webLab: reactLab({
          task:
            "Wire up the three buttons. \"Add\" POSTs { name: \"Clay pot\", price: 4000 } as JSON to /api/products and appends the product the server returns. \"Discount\" PATCHes /api/products/1 with { price: 6000 } and replaces product 1 with the server's answer. \"Delete\" sends DELETE to /api/products/3 and removes it from the list when the response is ok (the server answers 204).",
          files: {
            "src/App.jsx": `import { useState } from "react";

const START = ${JSON.stringify(PRODUCTS.map(({ id, name, price }) => ({ id, name, price })), null, 2).replace(/"(\w+)":/g, "$1:")};

export default function App() {
  const [products, setProducts] = useState(START);

  async function add() {}
  async function discount() {}
  async function remove() {}

  return (
    <>
      <ul>
        {products.map((p) => (
          <li key={p.id}>
            {p.name}: {p.price}
          </li>
        ))}
      </ul>
      <button onClick={add}>Add</button>
      <button onClick={discount}>Discount</button>
      <button onClick={remove}>Delete</button>
    </>
  );
}
`,
          },
          mocks: [
            { match: "/api/products/1", method: "PATCH", status: 200, body: { id: 1, name: "Ankara tote bag", price: 6000 }, delay: 40 },
            { match: "/api/products/3", method: "DELETE", status: 204, delay: 40 },
            { match: "/api/products", method: "POST", status: 201, body: { id: 4, name: "Clay pot", price: 4000 }, delay: 40 },
          ],
          tests: [
            { label: "Add POSTs JSON and shows the new product", check: "await click($$('button')[0]); await waitFor(() => $$('li').length === 4); const c = fetchCalls().find((x) => x.method === 'POST'); return !!c && c.url.endsWith('/api/products') && c.headers['content-type'] === 'application/json' && JSON.parse(c.body).name === 'Clay pot' && text($$('li')[3]) === 'Clay pot: 4000';", fail: "method: \"POST\", the JSON header, body: JSON.stringify(…), then append await res.json()." },
            { label: "Discount PATCHes only the changed field", check: "await click($$('button')[1]); await waitFor(() => text($$('li')[0]) === 'Ankara tote bag: 6000'); const c = fetchCalls().find((x) => x.method === 'PATCH'); return !!c && c.url.endsWith('/api/products/1') && JSON.stringify(JSON.parse(c.body)) === '{\"price\":6000}';", fail: "PATCH /api/products/1 with { price: 6000 }; replace with the server's product." },
            { label: "Delete removes product 3 after a 204", check: "await click($$('button')[2]); await waitFor(() => $$('li').length === 3); const c = fetchCalls().find((x) => x.method === 'DELETE'); return !!c && c.url.endsWith('/api/products/3') && !text('ul').includes('Beaded bracelet');", fail: "method: \"DELETE\"; do not call res.json() on a 204." },
          ],
          solution: {
            "src/App.jsx": `import { useState } from "react";

const START = ${JSON.stringify(PRODUCTS.map(({ id, name, price }) => ({ id, name, price })), null, 2).replace(/"(\w+)":/g, "$1:")};

const JSON_HEADERS = { "Content-Type": "application/json" };

export default function App() {
  const [products, setProducts] = useState(START);

  async function add() {
    const res = await fetch("/api/products", {
      method: "POST",
      headers: JSON_HEADERS,
      body: JSON.stringify({ name: "Clay pot", price: 4000 }),
    });
    if (!res.ok) return;
    const created = await res.json();
    setProducts((list) => [...list, created]);
  }

  async function discount() {
    const res = await fetch("/api/products/1", {
      method: "PATCH",
      headers: JSON_HEADERS,
      body: JSON.stringify({ price: 6000 }),
    });
    if (!res.ok) return;
    const updated = await res.json();
    setProducts((list) => list.map((p) => (p.id === updated.id ? updated : p)));
  }

  async function remove() {
    const res = await fetch("/api/products/3", { method: "DELETE" });
    if (res.ok) setProducts((list) => list.filter((p) => p.id !== 3));
  }

  return (
    <>
      <ul>
        {products.map((p) => (
          <li key={p.id}>
            {p.name}: {p.price}
          </li>
        ))}
      </ul>
      <button onClick={add}>Add</button>
      <button onClick={discount}>Discount</button>
      <button onClick={remove}>Delete</button>
    </>
  );
}
`,
          },
          hint: "A 204 response has no body: check res.ok and do not call res.json().",
          successMessage: "Create, update, delete, each followed by updating the screen from the server's answer.",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 53 · 9.4 – 9.6
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "rx-l53-requests",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 2,
    covers: ["9.4", "9.5", "9.6"],
    title: "Requests, Responses and API Services",
    subtitle: "Headers, bodies and parsing, request states, and keeping API code out of components",
    estimatedMinutes: 40,
    intro: "Real APIs return errors with useful messages, empty bodies and the occasional HTML error page. A small API layer handles all of that once, so components do not have to.",

    atoms: [
      {
        id: "a-rx-headers-bodies",
        title: "Handling headers, request bodies and response parsing",
        explain:
          "REQUEST HEADERS describe the request: Content-Type: application/json says the body is JSON; Accept: application/json asks for JSON back; Authorization carries credentials (Lesson 55). The BODY is a string (JSON.stringify), FormData (for file uploads; then do not set Content-Type yourself) or URLSearchParams. On the response, check res.ok first. Error bodies often carry a message ({ \"message\": \"Email already registered\" }); read it to show something better than a status code. Some responses have no body (204), and a broken server may return HTML, so parsing must not assume JSON.",
        webLab: reactLab({
          task:
            "Write request(path, options) in src/api/request.js: it calls fetch with \"Accept: application/json\" always added (plus Content-Type JSON and a stringified body when options.json is given), returns null for a 204, returns the parsed JSON for ok responses, and for errors throws an Error whose message is the server's JSON message if there is one, else \"Request failed with status N\". App uses it to sign up.",
          files: {
            "src/api/request.js": `export async function request(path, options = {}) {
  const res = await fetch(path);
  return res.json();
}
`,
            "src/App.jsx": `import { useState } from "react";
import { request } from "./api/request.js";

export default function App() {
  const [email, setEmail] = useState("");
  const [result, setResult] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const user = await request("/api/signup", { method: "POST", json: { email } });
      setResult("Welcome, " + user.email);
    } catch (err) {
      setResult(err.message);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="email">Email</label>
      <input id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <button>Sign up</button>
      <p role="status">{result}</p>
    </form>
  );
}
`,
          },
          readOnly: ["src/App.jsx"],
          mocks: [{ match: "/api/signup", method: "POST", status: 201, body: { id: 9, email: "ada@example.com" }, delay: 40 }],
          tests: [
            { label: "Sends JSON with the right headers and reads the reply", check: "await type('#email', 'ada@example.com'); await submit('form'); await waitFor(() => text('[role=status]') !== ''); const c = fetchCalls()[0]; return text('[role=status]') === 'Welcome, ada@example.com' && c.method === 'POST' && c.headers['accept'] === 'application/json' && c.headers['content-type'] === 'application/json' && JSON.parse(c.body).email === 'ada@example.com';", fail: "Merge the headers and JSON.stringify(options.json)." },
            { label: "Uses the server's error message", mocks: [{ match: "/api/signup", method: "POST", status: 409, body: { message: "Email already registered" }, delay: 30 }], check: "await type('#email', 'ada@example.com'); await submit('form'); return await waitFor(() => text('[role=status]') === 'Email already registered');", fail: "On !res.ok, read the JSON body's message and throw new Error(message)." },
            { label: "Falls back when the error body is not JSON", mocks: [{ match: "/api/signup", method: "POST", status: 502, body: "<html>Bad gateway</html>", delay: 30 }], check: "await type('#email', 'x@y.z'); await submit('form'); return await waitFor(() => text('[role=status]') === 'Request failed with status 502');", fail: "Wrap the error-body parsing in try/catch." },
            { label: "A 204 returns null", check: "const m = await import('data:text/javascript;charset=utf-8,' + encodeURIComponent(raw('src/api/request.js'))); const original = window.fetch; window.fetch = () => Promise.resolve(new Response(null, { status: 204 })); try { return (await m.request('/x')) === null; } finally { window.fetch = original; }", fail: "if (res.status === 204) return null;" },
          ],
          solution: {
            "src/api/request.js": `export async function request(path, options = {}) {
  const { json, headers, ...rest } = options;
  const res = await fetch(path, {
    ...rest,
    headers: {
      Accept: "application/json",
      ...(json !== undefined ? { "Content-Type": "application/json" } : {}),
      ...headers,
    },
    body: json !== undefined ? JSON.stringify(json) : rest.body,
  });

  if (res.status === 204) return null;
  if (!res.ok) {
    let message = "Request failed with status " + res.status;
    try {
      const data = await res.json();
      if (data && data.message) message = data.message;
    } catch {
      /* not JSON: keep the generic message */
    }
    throw new Error(message);
  }
  return res.json();
}
`,
          },
          hint: "Build the headers object first; JSON.stringify only when json was given.",
          successMessage: "One function that every request goes through, handling the awkward cases once.",
        }),
      },
      {
        id: "a-rx-request-states-api",
        title: "Loading, success, empty and error states",
        explain:
          "Module 6 built these states by hand. With an API layer, the component's job shrinks to: call the service, keep { status, data, error }, and render one screen per status, using the error's message from the server. Do not throw away data you already have when a REFETCH fails: show the old data with a small \"Could not refresh\" note rather than replacing the whole screen with an error. A skeleton (grey placeholder shapes, Module 10) often feels faster than a spinner for the loading state.",
        webLab: reactLab({
          task:
            "The product list shows nothing while loading and crashes on errors. Render: <p role=\"status\">Loading products…</p> while loading; the server's error message in <p role=\"alert\"> on failure (getProducts throws Errors with it); <p className=\"empty\">No products yet</p> for an empty list; otherwise each product as <li> with \"NAME — N in stock\", or \"NAME — Sold out\" when stock is 0.",
          files: {
            "src/api/products.js": `export async function getProducts() {
  const res = await fetch("/api/products");
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || "Could not load products");
  }
  return res.json();
}
`,
            "src/App.jsx": `import { useEffect, useState } from "react";
import { getProducts } from "./api/products.js";

export default function App() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    getProducts().then(setProducts);
  }, []);

  return (
    <ul>
      {products.map((p) => (
        <li key={p.id}>{p.name}</li>
      ))}
    </ul>
  );
}
`,
          },
          readOnly: ["src/api/products.js"],
          mocks: [{ match: "/api/products", body: PRODUCTS, delay: 120 }],
          tests: [
            { label: "Loading, then the products with stock", check: "const l = text('[role=status]') === 'Loading products…'; await waitFor(() => $$('li').length === 3); return l && $$('li').map((li) => text(li)).join('|') === 'Ankara tote bag — 12 in stock|Leather sandals — Sold out|Beaded bracelet — 40 in stock';", fail: "Track a status; render stock or Sold out." },
            { label: "Empty list", mocks: [{ match: "/api/products", body: [], delay: 30 }], check: "return await waitFor(() => text('.empty') === 'No products yet');", fail: "Show the empty message for []." },
            { label: "The server's error message is shown", mocks: [{ match: "/api/products", status: 503, body: { message: "Shop is under maintenance" }, delay: 30 }], check: "return await waitFor(() => text('[role=alert]') === 'Shop is under maintenance');", fail: "catch the Error and show err.message." },
          ],
          solution: {
            "src/App.jsx": `import { useEffect, useState } from "react";
import { getProducts } from "./api/products.js";

export default function App() {
  const [state, setState] = useState({ status: "loading", products: [], error: "" });

  useEffect(() => {
    let ignore = false;
    getProducts()
      .then((products) => !ignore && setState({ status: "success", products, error: "" }))
      .catch((err) => !ignore && setState({ status: "error", products: [], error: err.message }));
    return () => {
      ignore = true;
    };
  }, []);

  if (state.status === "loading") return <p role="status">Loading products…</p>;
  if (state.status === "error") return <p role="alert">{state.error}</p>;
  if (state.products.length === 0) return <p className="empty">No products yet</p>;
  return (
    <ul>
      {state.products.map((p) => (
        <li key={p.id}>
          {p.name} — {p.stock > 0 ? p.stock + " in stock" : "Sold out"}
        </li>
      ))}
    </ul>
  );
}
`,
          },
          hint: "One state object { status, products, error } keeps the three in step.",
          successMessage: "Every outcome has a screen, and the error says what the server said.",
        }),
      },
      {
        id: "a-rx-api-services",
        title: "Separating API services from UI components",
        explain:
          "Components should not know URLs, headers or status codes. Put each resource's calls in a SERVICE module: src/api/products.js exports getProducts(params), getProduct(id), createProduct(data), updateProduct(id, changes), deleteProduct(id), all built on one request() helper. Components call createProduct(form) and get data or an Error. When the API changes (a new base URL, an extra header, a renamed endpoint), you change one file, and services are easy to mock in tests (Module 13).",
        webLab: reactLab({
          task:
            "Move the API calls out of the component. Write src/api/products.js exporting getProducts() (GET /api/products) and createProduct(data) (POST JSON, returning the created product), both throwing an Error on non-ok responses. Then App.jsx must use them and contain no fetch calls or URLs.",
          files: {
            "src/api/products.js": "",
            "src/App.jsx": `import { useEffect, useState } from "react";

export default function App() {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState("");

  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then(setProducts);
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    const res = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, price: 1000 }),
    });
    const created = await res.json();
    setProducts((list) => [...list, created]);
    setName("");
  }

  return (
    <>
      <ul>
        {products.map((p) => (
          <li key={p.id}>{p.name}</li>
        ))}
      </ul>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Product name</label>
        <input id="name" value={name} onChange={(e) => setName(e.target.value)} />
        <button>Add product</button>
      </form>
    </>
  );
}
`,
          },
          mocks: [
            { match: "/api/products", method: "POST", status: 201, body: { id: 4, name: "Clay pot", price: 1000 }, delay: 30 },
            { match: "/api/products", method: "GET", body: PRODUCTS, delay: 30 },
          ],
          tests: [
            { label: "The list still loads", check: "return await waitFor(() => $$('li').length === 3);", fail: "useEffect calls getProducts().then(setProducts)." },
            { label: "Adding still works", check: "await type('#name', 'Clay pot'); await submit('form'); return await waitFor(() => $$('li').length === 4 && text($$('li')[3]) === 'Clay pot');", fail: "const created = await createProduct({ name, price: 1000 });" },
            { label: "The component has no fetch or URLs", check: "const c = code('src/App.jsx'); return !/fetch\\(|[\"'`]\\/api\\//.test(c) && /import\\s*\\{[^}]*getProducts[^}]*\\}\\s*from\\s*[\"']\\.\\/api\\/products/.test(c);", fail: "import { getProducts, createProduct } from \"./api/products.js\";" },
            { label: "The service throws on errors", check: "const m = await import('data:text/javascript;charset=utf-8,' + encodeURIComponent(raw('src/api/products.js'))); const original = window.fetch; window.fetch = () => Promise.resolve(new Response('{}', { status: 500 })); try { await m.getProducts(); return false; } catch (e) { return e instanceof Error; } finally { window.fetch = original; }", fail: "if (!res.ok) throw new Error(…)" },
          ],
          solution: {
            "src/api/products.js": `async function request(path, options) {
  const res = await fetch(path, options);
  if (!res.ok) throw new Error("Request failed with status " + res.status);
  return res.json();
}

export function getProducts() {
  return request("/api/products");
}

export function createProduct(data) {
  return request("/api/products", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}
`,
            "src/App.jsx": `import { useEffect, useState } from "react";
import { getProducts, createProduct } from "./api/products.js";

export default function App() {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState("");

  useEffect(() => {
    getProducts().then(setProducts);
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    const created = await createProduct({ name, price: 1000 });
    setProducts((list) => [...list, created]);
    setName("");
  }

  return (
    <>
      <ul>
        {products.map((p) => (
          <li key={p.id}>{p.name}</li>
        ))}
      </ul>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Product name</label>
        <input id="name" value={name} onChange={(e) => setName(e.target.value)} />
        <button>Add product</button>
      </form>
    </>
  );
}
`,
          },
          hint: "A private request() helper inside the service keeps each exported function to one line.",
          successMessage: "The component speaks in products; only the service speaks HTTP.",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 54 · 9.7 – 9.8
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "rx-l54-config-queries",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 3,
    covers: ["9.7", "9.8"],
    title: "Configuration and Query Parameters",
    subtitle: "Environment variables, and search, sorting, filtering and pagination through the API",
    estimatedMinutes: 35,
    intro: "The same app talks to a local API on your laptop, a staging API for testing and the real one in production. Configuration makes that a setting, not a code change.",

    atoms: [
      {
        id: "a-rx-env-vars",
        title: "Environment variables and configuration",
        explain:
          "Vite reads .env files at build time: .env (all modes), .env.development (npm run dev), .env.production (npm run build). Only variables starting with VITE_ reach your code, as import.meta.env.VITE_API_URL; Vite also provides import.meta.env.MODE, DEV and PROD. These values are written INTO the built JavaScript, so anyone can read them: never put secrets (database passwords, private API keys) in a VITE_ variable (Module 12). Commit a .env.example listing the variable names, and keep real .env files out of Git.",
        webLab: reactLab({
          task:
            "Stop hard-coding the API's address. The .env file defines VITE_API_URL. Make src/api/client.js build every request URL from import.meta.env.VITE_API_URL, so getCourses() fetches VITE_API_URL + \"/courses\".",
          files: {
            "src/api/client.js": `export async function getCourses() {
  const res = await fetch("http://localhost:3000/courses");
  return res.json();
}
`,
            ".env": "VITE_API_URL=https://api.memora.test/v1\n",
            "src/App.jsx": `import { useEffect, useState } from "react";
import { getCourses } from "./api/client.js";

export default function App() {
  const [courses, setCourses] = useState([]);
  useEffect(() => {
    getCourses().then(setCourses);
  }, []);
  return (
    <ul>
      {courses.map((c) => (
        <li key={c.id}>{c.title}</li>
      ))}
    </ul>
  );
}
`,
          },
          readOnly: [".env", "src/App.jsx"],
          mocks: [{ match: "https://api.memora.test/v1/courses", body: [{ id: 1, title: "React" }], delay: 30 }],
          tests: [
            { label: "It fetches from the configured API", check: "await waitFor(() => $$('li').length === 1); return fetchCalls().some((c) => c.url === 'https://api.memora.test/v1/courses');", fail: "fetch(import.meta.env.VITE_API_URL + \"/courses\")" },
            { label: "No hard-coded address", check: "return /import\\.meta\\.env\\.VITE_API_URL/.test(code('src/api/client.js')) && !/localhost/.test(code('src/api/client.js'));", fail: "Read the base URL from import.meta.env." },
          ],
          solution: {
            "src/api/client.js": `const BASE_URL = import.meta.env.VITE_API_URL;

export async function getCourses() {
  const res = await fetch(BASE_URL + "/courses");
  return res.json();
}
`,
          },
          hint: "Only VITE_ variables are exposed to your code.",
          successMessage: "Change .env, not code, to point the app at another API.",
        }),
      },
      {
        id: "a-rx-api-queries",
        title: "Search, sorting, filtering and pagination",
        explain:
          "Large lists are searched, sorted, filtered and paged on the SERVER, which sends back only one page: GET /api/products?q=bag&sort=price&order=asc&category=bags&page=2&limit=20. Build the query with URLSearchParams so values are encoded (a search for \"tote & bag\" must not start a new parameter), leave out empty values, and read the total from the response (often { items, total } or an X-Total-Count header) to show \"Page 2 of 5\". Keep these values in the page's URL too (Module 8) and pass them to the API, so a shared link shows the same results.",
        webLab: reactLab({
          task:
            "Write buildProductQuery({ q, category, sort, page }) in src/api/query.js. It returns \"/api/products?\" plus a query string with: q and category only if they are not empty; sort only if given; page (default 1) and limit=20 always. Use URLSearchParams so values are encoded. Example: { q: \"tote & bag\", page: 2 } → /api/products?q=tote+%26+bag&page=2&limit=20.",
          files: {
            "src/api/query.js": `export function buildProductQuery({ q, category, sort, page }) {
  return "/api/products?q=" + q + "&page=" + page;
}
`,
            "src/App.jsx": `import { buildProductQuery } from "./api/query.js";

const examples = [
  { q: "tote & bag", page: 2 },
  { q: "", category: "shoes", sort: "price" },
  {},
];

export default function App() {
  return (
    <ul>
      {examples.map((e, i) => (
        <li key={i}>{buildProductQuery(e)}</li>
      ))}
    </ul>
  );
}
`,
          },
          readOnly: ["src/App.jsx"],
          tests: [
            { label: "Encodes values and adds paging", check: "return text($$('li')[0]) === '/api/products?q=tote+%26+bag&page=2&limit=20';", fail: "const params = new URLSearchParams(); params.set(\"q\", q) …" },
            { label: "Leaves out empty values", check: "return text($$('li')[1]) === '/api/products?category=shoes&sort=price&page=1&limit=20';", fail: "Only set q and category when they are not empty." },
            { label: "Works with nothing given", check: "return text($$('li')[2]) === '/api/products?page=1&limit=20';", fail: "Default page to 1." },
          ],
          solution: {
            "src/api/query.js": `export function buildProductQuery({ q, category, sort, page = 1 }) {
  const params = new URLSearchParams();
  if (q) params.set("q", q);
  if (category) params.set("category", category);
  if (sort) params.set("sort", sort);
  params.set("page", String(page));
  params.set("limit", "20");
  return "/api/products?" + params.toString();
}
`,
          },
          hint: "URLSearchParams encodes & as %26 and spaces as +.",
          successMessage: "Safe, tidy query strings, whatever the user types.",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 55 · 9.9 – 9.10
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "rx-l55-auth-requests",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 4,
    covers: ["9.9", "9.10"],
    title: "Authorised Requests and Expired Sessions",
    subtitle: "Sending tokens with requests, and handling 401s and failed requests",
    estimatedMinutes: 35,
    intro: "Once users sign in, every request must prove who is asking, and the app must cope gracefully when that proof expires.",

    atoms: [
      {
        id: "a-rx-auth-tokens",
        title: "Authentication tokens and request authorization",
        explain:
          "After sign-in, many APIs give the client a TOKEN (often a JWT: a signed string saying who you are and when it expires). The client sends it with each request in the Authorization header: Authorization: Bearer eyJhbGci…. The server checks the signature and expiry, then decides what that user may do. Add the header in ONE place, the API client, not in every call. Other designs use an httpOnly cookie that the browser sends automatically (fetch needs credentials: \"include\" for another origin); Module 12 compares the two.",
        webLab: reactLab({
          task:
            "Make the API client authorise every request: authFetch(path, options) adds \"Authorization: Bearer TOKEN\" using getToken() from session.js, keeps any headers the caller passed, and leaves the header out entirely when there is no token. App uses it for both calls.",
          files: {
            "src/session.js": `let token = "tok_ada_123";
export const getToken = () => token;
export const setToken = (t) => {
  token = t;
};
`,
            "src/api/client.js": `import { getToken } from "../session.js";

export function authFetch(path, options = {}) {
  return fetch(path, options);
}
`,
            "src/App.jsx": `import { useEffect, useState } from "react";
import { authFetch } from "./api/client.js";
import { setToken } from "./session.js";

export default function App() {
  const [name, setName] = useState("");
  useEffect(() => {
    authFetch("/api/me").then((r) => r.json()).then((me) => setName(me.name));
  }, []);

  function signOutAndPing() {
    setToken(null);
    authFetch("/api/ping", { headers: { "X-Client": "web" } });
  }

  return (
    <>
      <p className="me">{name}</p>
      <button onClick={signOutAndPing}>Sign out and ping</button>
    </>
  );
}
`,
          },
          readOnly: ["src/session.js", "src/App.jsx"],
          mocks: [
            { match: "/api/me", body: { name: "Ada Obi" }, delay: 30 },
            { match: "/api/ping", body: { ok: true }, delay: 30 },
          ],
          tests: [
            { label: "Requests carry the bearer token", check: "await waitFor(() => text('.me') === 'Ada Obi'); const c = fetchCalls().find((x) => x.url.includes('/api/me')); return c.headers['authorization'] === 'Bearer tok_ada_123';", fail: "headers: { ...options.headers, Authorization: \"Bearer \" + token }" },
            { label: "No token, no Authorization header; other headers kept", check: "await click('button'); await wait(60); const c = fetchCalls().find((x) => x.url.includes('/api/ping')); return !!c && !('authorization' in c.headers) && c.headers['x-client'] === 'web';", fail: "Add the header only when getToken() returns a token, and spread options.headers." },
          ],
          solution: {
            "src/api/client.js": `import { getToken } from "../session.js";

export function authFetch(path, options = {}) {
  const token = getToken();
  return fetch(path, {
    ...options,
    headers: {
      ...options.headers,
      ...(token ? { Authorization: "Bearer " + token } : {}),
    },
  });
}
`,
          },
          hint: "Spread the caller's headers first, then add Authorization only when there is a token.",
          successMessage: "Every request identified, in one place.",
        }),
      },
      {
        id: "a-rx-expired-sessions",
        title: "Handling expired sessions and failed requests",
        explain:
          "Tokens expire. When any request gets 401 Unauthorized, the session is over: clear the stored token, tell the user (\"Your session expired. Please sign in again.\") and send them to the login page, remembering where they were. Handle it centrally in the API client (a callback such as onUnauthorized), not in every component. Some apps first try a REFRESH TOKEN to get a new access token silently, and only sign out if that fails. Distinguish the failures: 401 means sign in again; 403 means signed in but not allowed (do not sign out); network errors and 5xx mean try again later.",
        webLab: reactLab({
          task:
            "In src/api/client.js, when a response is 401, call the onUnauthorized handler (registered by App with setUnauthorizedHandler) and throw an Error \"Session expired\". App's handler clears the user and shows <p role=\"alert\">Your session expired. Please sign in again.</p> with the login form. A 403 must NOT sign the user out: it shows \"You do not have access to this report.\" instead.",
          files: {
            "src/api/client.js": `let onUnauthorized = () => {};
export function setUnauthorizedHandler(fn) {
  onUnauthorized = fn;
}

export async function api(path) {
  const res = await fetch(path);
  if (!res.ok) throw new Error("Request failed");
  return res.json();
}
`,
            "src/App.jsx": `import { useEffect, useState } from "react";
import { api, setUnauthorizedHandler } from "./api/client.js";

export default function App() {
  const [user, setUser] = useState({ name: "Ada" });
  const [expired, setExpired] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    setUnauthorizedHandler(() => {
      setUser(null);
      setExpired(true);
    });
  }, []);

  async function loadReport() {
    try {
      const report = await api("/api/report");
      setMessage("Report: " + report.total);
    } catch (err) {
      setMessage(err.message === "Forbidden" ? "You do not have access to this report." : "");
    }
  }

  if (!user) {
    return (
      <>
        {expired && <p role="alert">Your session expired. Please sign in again.</p>}
        <button onClick={() => setUser({ name: "Ada" })}>Sign in</button>
      </>
    );
  }
  return (
    <>
      <p>Signed in as {user.name}</p>
      <button onClick={loadReport}>Load report</button>
      <p className="msg">{message}</p>
    </>
  );
}
`,
          },
          readOnly: ["src/App.jsx"],
          mocks: [{ match: "/api/report", status: 401, body: { message: "Token expired" }, delay: 30 }],
          tests: [
            { label: "A 401 signs the user out with a message", check: "await click($$('button').find((b) => text(b) === 'Load report')); return await waitFor(() => text('[role=alert]') === 'Your session expired. Please sign in again.' && !!$$('button').find((b) => text(b) === 'Sign in'));", fail: "if (res.status === 401) { onUnauthorized(); throw new Error(\"Session expired\"); }" },
            { label: "A 403 keeps the session and explains", mocks: [{ match: "/api/report", status: 403, body: { message: "Forbidden" }, delay: 30 }], check: "await click($$('button').find((b) => text(b) === 'Load report')); await waitFor(() => text('.msg') !== ''); return text('.msg') === 'You do not have access to this report.' && !$('[role=alert]');", fail: "For 403, throw new Error(\"Forbidden\") without calling onUnauthorized." },
          ],
          solution: {
            "src/api/client.js": `let onUnauthorized = () => {};
export function setUnauthorizedHandler(fn) {
  onUnauthorized = fn;
}

export async function api(path) {
  const res = await fetch(path);
  if (res.status === 401) {
    onUnauthorized();
    throw new Error("Session expired");
  }
  if (res.status === 403) throw new Error("Forbidden");
  if (!res.ok) throw new Error("Request failed");
  return res.json();
}
`,
          },
          hint: "Check 401 and 403 before the general !res.ok case.",
          successMessage: "Expired sessions handled once, centrally, and 403 kept separate.",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 56 · 9.11 – 9.13
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "rx-l56-query",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 5,
    covers: ["9.11", "9.12", "9.13"],
    title: "Axios, TanStack Query and CORS",
    subtitle: "Libraries for requests and server state, caching and invalidation, and why browsers block some requests",
    estimatedMinutes: 45,
    intro: "Everything in this module so far, loading states, caching, refetching, races, is solved once and well by a server-state library. Here is the industry's most popular one.",

    atoms: [
      {
        id: "a-rx-axios-query",
        title: "Introduction to Axios and TanStack Query",
        explain:
          "AXIOS is a request library: axios.get(url) parses JSON for you, REJECTS on 4xx and 5xx (unlike fetch), and supports instances with a base URL and interceptors (axios.create({ baseURL }), then an interceptor to add the token). It solves the request; it does not manage state. TANSTACK QUERY (formerly React Query) manages SERVER STATE: wrap the app in <QueryClientProvider client={queryClient}>, then const { data, isPending, isError, error } = useQuery({ queryKey: [\"products\"], queryFn: getProducts }). It caches by key, removes duplicate requests, handles races, retries failures, and refetches when data is stale. Any request function works as the queryFn: fetch, Axios or your service module.",
        webLab: reactLab({
          task:
            "Replace the hand-written effect with TanStack Query. Create a QueryClient (with retry: false in defaultOptions.queries, so errors show at once in this lab), wrap ProductList in QueryClientProvider, and use useQuery with queryKey [\"products\"] and queryFn getProducts. Show \"Loading…\" while pending, the error message on error, and the list on success.",
          files: {
            "src/App.jsx": `import { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";
import { getProducts } from "./api.js";

function ProductList() {
  const [products, setProducts] = useState([]);
  useEffect(() => {
    getProducts().then(setProducts);
  }, []);
  return (
    <ul>
      {products.map((p) => (
        <li key={p.id}>{p.name}</li>
      ))}
    </ul>
  );
}

export default function App() {
  return <ProductList />;
}
`,
            "src/api.js": `import axios from "axios";

export async function getProducts() {
  const res = await axios.get("/api/products");
  return res.data;
}
`,
          },
          readOnly: ["src/api.js"],
          mocks: [{ match: "/api/products", body: PRODUCTS, delay: 100 }],
          tests: [
            { label: "Pending, then the list", check: "const l = text('#root') === 'Loading…'; await waitFor(() => $$('li').length === 3); return l;", fail: "if (isPending) return <p>Loading…</p>;" },
            { label: "Errors show their message", mocks: [{ match: "/api/products", status: 500, body: { message: "down" }, delay: 30 }], check: "return await waitFor(() => /Request failed with status code 500/.test(text('#root')));", fail: "if (isError) return <p role=\"alert\">{error.message}</p>; (Axios rejects on 500.)" },
            { label: "It uses useQuery inside a QueryClientProvider", check: "const c = code('src/App.jsx'); return /useQuery\\(\\s*\\{[^}]*queryKey:\\s*\\[\\s*[\"']products[\"']\\s*\\]/.test(c) && /<QueryClientProvider\\s+client=/.test(c) && !/useEffect\\(/.test(c);", fail: "useQuery({ queryKey: [\"products\"], queryFn: getProducts })" },
          ],
          solution: {
            "src/App.jsx": `import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";
import { getProducts } from "./api.js";

const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });

function ProductList() {
  const { data, isPending, isError, error } = useQuery({ queryKey: ["products"], queryFn: getProducts });
  if (isPending) return <p>Loading…</p>;
  if (isError) return <p role="alert">{error.message}</p>;
  return (
    <ul>
      {data.map((p) => (
        <li key={p.id}>{p.name}</li>
      ))}
    </ul>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ProductList />
    </QueryClientProvider>
  );
}
`,
          },
          hint: "Create the QueryClient outside the component, so it is not recreated on every render.",
          successMessage: "No effect, no race code, no loading flags: the library owns the server state.",
        }),
      },
      {
        id: "a-rx-cache-invalidate",
        title: "Caching, refetching, invalidation and optimistic updates",
        explain:
          "TanStack Query keeps each query's data in a CACHE under its key; staleTime says how long data counts as fresh; stale data is REFETCHED in the background when a component mounts or the window regains focus, while the cached data shows instantly. Changes go through useMutation({ mutationFn: createProduct, onSuccess: () => queryClient.invalidateQueries({ queryKey: [\"products\"] }) }): INVALIDATING marks the list stale and refetches it, so the screen shows what the server now holds. An OPTIMISTIC UPDATE changes the cache before the server answers (onMutate with setQueryData), and rolls back in onError, so the UI feels instant.",
        webLab: reactLab({
          task:
            "Add products through a mutation. useMutation calls createProduct; on success it invalidates the [\"products\"] query so the list refetches, and clears the input. While the mutation is pending the Add button is disabled. (The second GET of the list returns the new product.)",
          files: {
            "src/App.jsx": `import { useState } from "react";
import { QueryClient, QueryClientProvider, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getProducts, createProduct } from "./api.js";

const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });

function Products() {
  const [name, setName] = useState("");
  const { data = [] } = useQuery({ queryKey: ["products"], queryFn: getProducts });

  return (
    <>
      <ul>
        {data.map((p) => (
          <li key={p.id}>{p.name}</li>
        ))}
      </ul>
      <form onSubmit={(e) => e.preventDefault()}>
        <label htmlFor="name">Name</label>
        <input id="name" value={name} onChange={(e) => setName(e.target.value)} />
        <button>Add</button>
      </form>
    </>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Products />
    </QueryClientProvider>
  );
}
`,
            "src/api.js": `let saved = [{ id: 1, name: "Tote bag" }];

export async function getProducts() {
  const res = await fetch("/api/products");
  await res.json();
  return saved;
}

export async function createProduct(product) {
  const res = await fetch("/api/products", { method: "POST", body: JSON.stringify(product) });
  const created = await res.json();
  saved = [...saved, created];
  return created;
}
`,
          },
          readOnly: ["src/api.js"],
          mocks: [
            { match: "/api/products", method: "POST", status: 201, body: { id: 2, name: "Clay pot" }, delay: 150 },
            { match: "/api/products", method: "GET", body: [], delay: 30 },
          ],
          tests: [
            { label: "Adding disables the button while pending", check: "await waitFor(() => $$('li').length === 1); await type('#name', 'Clay pot'); await submit('form'); return $('button').disabled;", fail: "const mutation = useMutation({ mutationFn: createProduct, … }); disabled={mutation.isPending}" },
            { label: "On success the list refetches and the input clears", check: "await waitFor(() => $$('li').length === 2); return text($$('li')[1]) === 'Clay pot' && $('#name').value === '' && fetchCalls().filter((c) => c.method === 'GET').length >= 2;", fail: "onSuccess: () => { queryClient.invalidateQueries({ queryKey: [\"products\"] }); setName(\"\"); }" },
            { label: "It uses a mutation and invalidation", check: "return /useMutation\\(/.test(code('src/App.jsx')) && /invalidateQueries\\(/.test(code('src/App.jsx'));", fail: "Use useMutation and invalidateQueries." },
          ],
          solution: {
            "src/App.jsx": `import { useState } from "react";
import { QueryClient, QueryClientProvider, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getProducts, createProduct } from "./api.js";

const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });

function Products() {
  const [name, setName] = useState("");
  const client = useQueryClient();
  const { data = [] } = useQuery({ queryKey: ["products"], queryFn: getProducts });
  const mutation = useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["products"] });
      setName("");
    },
  });

  return (
    <>
      <ul>
        {data.map((p) => (
          <li key={p.id}>{p.name}</li>
        ))}
      </ul>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          mutation.mutate({ name });
        }}
      >
        <label htmlFor="name">Name</label>
        <input id="name" value={name} onChange={(e) => setName(e.target.value)} />
        <button disabled={mutation.isPending}>Add</button>
      </form>
    </>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Products />
    </QueryClientProvider>
  );
}
`,
          },
          hint: "useQueryClient() gives you the client inside a component.",
          successMessage: "Write, invalidate, refetch: the screen always ends up showing the server's truth.",
        }),
      },
      {
        id: "a-rx-cors",
        title: "Understanding CORS and why browser requests sometimes fail",
        explain:
          "Browsers enforce the SAME-ORIGIN POLICY: a page from https://app.memora.ng can read responses from that exact origin (scheme, host and port) but not from https://api.other.com, unless that server says it may, with CORS headers such as Access-Control-Allow-Origin: https://app.memora.ng. For requests with JSON bodies or custom headers, the browser first sends a PREFLIGHT OPTIONS request to ask. A CORS error means the server did not allow your origin: it is fixed on the SERVER (add the headers) or by calling the API through your own backend or a proxy (Vite's server.proxy in development). It cannot be fixed in React code, and tools like curl or Postman ignore CORS, which is why \"it works in Postman\".",
        decision: {
          scenario:
            "Your app at http://localhost:5173 calls https://api.partner.com/rates. The console says: \"blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present\". The same request works in Postman.",
          question: "What is the correct fix?",
          options: [
            { id: "a", text: "Ask the API owner to allow your origins, or call the API through your own server or Vite's dev proxy", why: "The browser is enforcing the partner server's (missing) permission. Only the server can grant it, or you avoid the browser rule by calling server-to-server." },
            { id: "b", text: "Add an Access-Control-Allow-Origin header to the fetch call", whyWrong: "That is a RESPONSE header the server must send; adding it to your request does nothing." },
            { id: "c", text: "Use mode: \"no-cors\" in fetch", whyWrong: "It makes the response opaque: you cannot read the data at all." },
            { id: "d", text: "Install a browser extension that disables CORS", whyWrong: "It only \"works\" on your machine; every user would still be blocked." },
          ],
          correct: "a",
          aftermath: "CORS is the server's permission, enforced by the browser.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 57 · 9.P
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "rx-l57-m9-project",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 6,
    covers: ["9.P"],
    title: "Practical: A Product Management Dashboard",
    subtitle: "Retrieve, create, update and delete products through an API",
    estimatedMinutes: 70,
    intro: "The Module 9 practical is a CRUD dashboard of the kind every company has internally: a list from the API, a form to add, inline edits, and deletes, with API logic kept out of the components.",

    atoms: [
      {
        id: "a-rx-m9-project",
        title: "Build the product dashboard",
        explain:
          "Structure: src/api/products.js holds every request; App.jsx uses TanStack Query (useQuery for the list, useMutation for create, update and delete, invalidating [\"products\"] after each). The lab's API is stateful: it really stores your changes, so a refetch shows them.",
        webLab: reactLab({
          task:
            "Write the service and the dashboard. src/api/products.js exports listProducts(), createProduct(data), updateProduct(id, changes) (PATCH) and deleteProduct(id), against /api/products, throwing on non-ok responses. App shows <p role=\"status\">Loading products…</p> while pending, then a table with a <tr className=\"product\"> per product (name, price, stock) and, in the last cell, a \"Restock\" button (aria-label \"Restock NAME\") that PATCHes stock to stock + 10, and a \"Delete\" button (aria-label \"Delete NAME\"). A form with \"Name\" and \"Price\" inputs adds a product with stock 0. After every change, the list is refetched. API errors show <p role=\"alert\"> with the message.",
          files: {
            "src/api/products.js": "",
            "src/App.jsx": `import { useState } from "react";
import { QueryClient, QueryClientProvider, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });

export default function App() {
  return <h1>Products</h1>;
}
`,
            "src/fakeServer.js": `// The lab's API keeps real state, so refetches show your changes.
// You do not need to edit this file.
let products = ${JSON.stringify(PRODUCTS)};
let nextId = 4;
const json = (body, status = 200) => new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });
window.__apiLog = [];
window.fetch = async (input, init = {}) => {
  const url = String(input);
  const method = (init.method || "GET").toUpperCase();
  window.__apiLog.push(method + " " + url);
  await new Promise((r) => setTimeout(r, 250));
  const m = url.match(/\\/api\\/products(?:\\/(\\d+))?$/);
  if (!m) return json({ message: "Not found" }, 404);
  const id = m[1] && Number(m[1]);
  if (method === "GET" && !id) return json(products);
  if (method === "POST" && !id) {
    const data = JSON.parse(init.body || "{}");
    if (!data.name) return json({ message: "Name is required" }, 422);
    const created = { id: nextId++, name: data.name, price: Number(data.price) || 0, stock: Number(data.stock) || 0 };
    products = [...products, created];
    return json(created, 201);
  }
  const found = products.find((p) => p.id === id);
  if (!found) return json({ message: "No such product" }, 404);
  if (method === "PATCH") {
    const updated = { ...found, ...JSON.parse(init.body || "{}") };
    products = products.map((p) => (p.id === id ? updated : p));
    return json(updated);
  }
  if (method === "DELETE") {
    products = products.filter((p) => p.id !== id);
    return new Response(null, { status: 204 });
  }
  return json({ message: "Method not allowed" }, 405);
};
`,
            "src/main.jsx": `import "./fakeServer.js";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
`,
          },
          readOnly: ["src/fakeServer.js", "src/main.jsx"],
          revealSolution: false,
          tests: [
            { label: "Loading, then a row per product", check: "const l = text('[role=status]') === 'Loading products…'; await waitFor(() => $$('tr.product').length === 3); return l && text($$('tr.product')[1]).includes('Leather sandals');", fail: "useQuery({ queryKey: [\"products\"], queryFn: listProducts })" },
            { label: "Restock PATCHes stock + 10 and the row updates", check: "await click($$('button').find((b) => nameOf(b) === 'Restock Leather sandals')); await waitFor(() => window.__apiLog.some((l) => l === 'PATCH /api/products/2')); return await waitFor(() => text($$('tr.product')[1].children[2]) === '10');", fail: "updateProduct(product.id, { stock: product.stock + 10 }), then invalidate." },
            { label: "The form adds a product with stock 0", check: "const by = (n) => $$('input').find((i) => nameOf(i) === n); await type(by('Name'), 'Clay pot'); await type(by('Price'), '4000'); await submit(by('Name').form); return await waitFor(() => $$('tr.product').length === 4 && text($$('tr.product')[3]).includes('Clay pot') && text($$('tr.product')[3]).includes('4000'));", fail: "createProduct({ name, price: Number(price), stock: 0 })" },
            { label: "Delete removes a product", check: "await click($$('button').find((b) => nameOf(b) === 'Delete Beaded bracelet')); return await waitFor(() => $$('tr.product').length === 3 && !text('table').includes('Beaded bracelet'));", fail: "deleteProduct(id); a 204 has no body." },
            { label: "API errors are shown", check: "const by = (n) => $$('input').find((i) => nameOf(i) === n); await type(by('Name'), ''); await submit(by('Name').form); return await waitFor(() => text('[role=alert]') === 'Name is required');", fail: "Throw the server's message; show mutation.error.message." },
            { label: "The components contain no URLs", check: "return !/[\"'`]\\/api\\//.test(code('src/App.jsx')) && ['listProducts', 'createProduct', 'updateProduct', 'deleteProduct'].every((f) => new RegExp('export\\\\s+(async\\\\s+)?function\\\\s+' + f + '\\\\b').test(code('src/api/products.js')));", fail: "All requests live in src/api/products.js." },
          ],
          solution: {
            "src/api/products.js": `async function request(path, options = {}) {
  const res = await fetch(path, {
    ...options,
    headers: { "Content-Type": "application/json", ...options.headers },
  });
  if (res.status === 204) return null;
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body.message || "Request failed with status " + res.status);
  return body;
}

export function listProducts() {
  return request("/api/products");
}

export function createProduct(data) {
  return request("/api/products", { method: "POST", body: JSON.stringify(data) });
}

export function updateProduct(id, changes) {
  return request("/api/products/" + id, { method: "PATCH", body: JSON.stringify(changes) });
}

export function deleteProduct(id) {
  return request("/api/products/" + id, { method: "DELETE" });
}
`,
            "src/App.jsx": `import { useState } from "react";
import { QueryClient, QueryClientProvider, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { listProducts, createProduct, updateProduct, deleteProduct } from "./api/products.js";

const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });

function useProductMutation(mutationFn, after) {
  const client = useQueryClient();
  return useMutation({
    mutationFn,
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["products"] });
      after?.();
    },
  });
}

function Dashboard() {
  const [form, setForm] = useState({ name: "", price: "" });
  const { data, isPending, isError, error } = useQuery({ queryKey: ["products"], queryFn: listProducts });
  const create = useProductMutation(createProduct, () => setForm({ name: "", price: "" }));
  const update = useProductMutation(({ id, changes }) => updateProduct(id, changes));
  const remove = useProductMutation(deleteProduct);
  const failure = create.error || update.error || remove.error;

  if (isPending) return <p role="status">Loading products…</p>;
  if (isError) return <p role="alert">{error.message}</p>;

  return (
    <main>
      <h1>Products</h1>
      {failure && <p role="alert">{failure.message}</p>}
      <table>
        <thead>
          <tr><th>Name</th><th>Price</th><th>Stock</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {data.map((p) => (
            <tr key={p.id} className="product">
              <td>{p.name}</td>
              <td>{p.price}</td>
              <td>{p.stock}</td>
              <td>
                <button aria-label={"Restock " + p.name} onClick={() => update.mutate({ id: p.id, changes: { stock: p.stock + 10 } })}>Restock</button>
                <button aria-label={"Delete " + p.name} onClick={() => remove.mutate(p.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          create.mutate({ name: form.name.trim(), price: Number(form.price), stock: 0 });
        }}
      >
        <label htmlFor="name">Name</label>
        <input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <label htmlFor="price">Price</label>
        <input id="price" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
        <button disabled={create.isPending}>Add product</button>
      </form>
    </main>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Dashboard />
    </QueryClientProvider>
  );
}
`,
          },
          hint: "Write and check the service functions first (call them from the console), then the queries, then the mutations.",
          successMessage: "Full CRUD against an API, with every request in one service file.",
        }),
      },
    ],
    task: {
      title: "Module 9 practical: your product dashboard",
      intro: "Build the dashboard against a real or local API: json-server (npx json-server db.json) gives you a full REST API from a JSON file in seconds.",
      prompts: [
        "Put every request in src/api/products.js, with the base URL from VITE_API_URL.",
        "Use TanStack Query for the list and mutations for create, update and delete, invalidating after each.",
        "Add server-side search, sort and pagination through query parameters, kept in the page URL too.",
        "Make one mutation optimistic (delete is a good one), with a rollback when it fails.",
        "Mastery checkpoint: show that no component contains a URL or a fetch call, and walk someone through what happens, request by request, when you edit a product.",
      ],
      closing: "Next: Module 10, professional styling.",
    },
    requirements: { read: true, video: false, assessment: true },
  },
];
