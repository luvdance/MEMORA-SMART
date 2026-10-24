/**
 * BACKEND ENGINEERING · WEEK 1 · INTRODUCTION TO BACKEND DEVELOPMENT
 *
 * Curriculum 1.1 – 1.P. What software development is, frontend, backend and
 * database, client-server architecture, what happens when a user visits a
 * website, the request-response lifecycle, HTTP, HTTPS, DNS, IP addresses,
 * ports and hosting, static and dynamic applications, backend roles, and the
 * week's exercises and deliverable.
 *
 * The learner meets a real backend on day one: a small Node.js server they
 * run, send requests to and change (nodeLab), real recorded terminals of
 * curl and DNS, and documents (an architecture diagram, a request trace)
 * whose checks read what they wrote.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

import { decide, shown, term } from "./be-helpers.js";
import { W1_SERVER } from "./be-projects.js";

export const SECTION_ID = "be-s1-web";
const MODULE = "be-w1-web";

/* ── The Week 1 server, as labs start from it ─────────────────────────── */

const COURSES = `const courses = [
  { id: 1, title: "Backend Engineering", weeks: 24 },
  { id: 2, title: "Relational Databases", weeks: 16 },
];
`;

/** A server that answers every request with the home page. */
const HOME_ONLY = `// server.js
const http = require("node:http");

${COURSES}
const server = http.createServer((req, res) => {
  console.log(req.method + " " + req.url);
  if (req.url === "/") {
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.end("<h1>Memora Academy</h1><p>Two courses are open.</p>");
  } else {
    // Every other path gets the home page too, for now.
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.end("<h1>Memora Academy</h1><p>Two courses are open.</p>");
  }
});

server.listen(3000, () => console.log("Listening on http://localhost:3000"));
`;

const WITH_API = HOME_ONLY.replace(
  `  } else {
    // Every other path gets the home page too, for now.`,
  `  } else if (req.url === "/api/courses") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(courses));
  } else {
    // Every other path gets the home page too, for now.`
);

const WITH_404 = WITH_API.replace(
  `  } else {
    // Every other path gets the home page too, for now.
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.end("<h1>Memora Academy</h1><p>Two courses are open.</p>");
  }`,
  `  } else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not found");
  }`
);

const REQUESTS = [
  { label: "GET /", method: "GET", path: "/" },
  { label: "GET /api/courses", method: "GET", path: "/api/courses" },
  { label: "GET /nope", method: "GET", path: "/nope" },
];

/* ── The login example: a backend, a database, a password check ───────── */

const LOGIN_DB = `CREATE TABLE users (
  id            integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  email         text NOT NULL UNIQUE,
  full_name     text NOT NULL,
  password_hash text NOT NULL
);
INSERT INTO users (email, full_name, password_hash) VALUES
  ('ada@example.com', 'Ada Obi', '$2b$10$bTaW6Hn7t7kfluKolD97UOKxwzsX2Hr9X1fcovFWWJ9pXSuiNkK..');`;

const LOGIN_SERVER = `// server.js — what happens to one login request, step by step
import express from "express";
import pg from "pg";
import bcrypt from "bcryptjs";
import { randomUUID } from "node:crypto";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const sessions = new Map();
const app = express();
app.use(express.json());

app.post("/login", async (req, res) => {
  console.log("1. Request arrived:", req.method, req.path, "from", req.get("user-agent"));
  const { email, password } = req.body;
  if (!email || !password) {
    console.log("2. Rejected: email and password are required");
    return res.status(400).json({ error: "Email and password are required" });
  }
  const { rows } = await pool.query(
    "SELECT id, full_name, password_hash FROM users WHERE email = $1",
    [email]
  );
  console.log("2. Database answered:", rows.length, "matching user(s)");
  const ok = rows.length === 1 && (await bcrypt.compare(password, rows[0].password_hash));
  console.log("3. Password check:", ok ? "matches" : "does not match");
  if (!ok) return res.status(401).json({ error: "Wrong email or password" });
  const sessionId = randomUUID();
  sessions.set(sessionId, rows[0].id);
  res.cookie("session", sessionId, { httpOnly: true, secure: true, sameSite: "lax" });
  console.log("4. Session created; responding 200 with a cookie");
  res.json({ message: "Welcome back, " + rows[0].full_name });
});

app.listen(3000, () => console.log("Login API on http://localhost:3000"));
`;

const LOGIN_PKG = `{
  "name": "login-demo",
  "version": "1.0.0",
  "type": "module",
  "scripts": { "start": "node --env-file=.env server.js" },
  "dependencies": { "bcryptjs": "^3.0.3", "express": "^5.3.0", "pg": "^8.23.1" }
}
`;

const LOGIN_ENV = "DATABASE_URL=postgres://academy_app:app-password@localhost:5432/academy\n";

/* ── Document checks: Markdown and a Mermaid flowchart ────────────────── */

/** JavaScript (a check's body) that parses a Mermaid flowchart out of a Markdown file. */
const PARSE_DIAGRAM = (file) => `
const doc = file(${JSON.stringify(file)}) || "";
const block = /\`\`\`mermaid\\s*([\\s\\S]*?)\`\`\`/.exec(doc);
const nodes = {};
const edges = [];
if (block) {
  const shape = /([A-Za-z][\\w-]*)\\s*(\\[\\[?[^\\]]*\\]?\\]|\\(\\(?[^)]*\\)?\\)|\\{[^}]*\\}|\\[\\([^)]*\\)\\])?/;
  for (const raw of block[1].split("\\n")) {
    const line = raw.trim();
    if (!line || /^(flowchart|graph)\\b/i.test(line) || line.startsWith("%%")) continue;
    const parts = line.split(/\\s*(?:-->|---|-\\.->|==>)\\s*(?:\\|[^|]*\\|\\s*)?/);
    const ids = [];
    for (const p of parts) {
      const m = shape.exec(p.trim());
      if (!m) continue;
      const id = m[1];
      const label = m[2] ? m[2].replace(/^[\\[({]+|[\\])}]+$/g, "") : nodes[id] || id;
      if (!nodes[id] || m[2]) nodes[id] = label;
      ids.push(id);
    }
    for (let i = 0; i + 1 < ids.length; i++) edges.push([ids[i], ids[i + 1]]);
  }
}
const label = (id) => String(nodes[id] || id);
const is = (re) => (id) => re.test(label(id)) || re.test(id);
const browser = is(/browser|web app|client|frontend|mobile/i);
const api = is(/api|server|backend/i);
const database = is(/postgres|database|\\bdb\\b|mysql/i);
`;

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 1 · 1.1 – 1.2 · HOW APPLICATIONS WORK
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "be-l1-applications",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 1,
    covers: ["1.1", "1.2"],
    title: "How Applications Work",
    subtitle: "Software, and the three parts of every web application",
    estimatedMinutes: 40,
    intro:
      "A backend engineer builds the part of an application nobody sees and everybody depends on. Before writing any of it, you need a clear picture of what an application is made of and where the backend sits. You will run a real one in this lesson.",
    atoms: [
      {
        id: "a-be-what-is-software",
        title: "What software development is",
        explain:
          "Software is a set of instructions a computer follows, plus the data it works on. Software DEVELOPMENT is the whole job of turning a need into working software and keeping it working: understanding the problem and the people who have it (requirements), deciding how the software will be structured (design), writing the code, testing that it does what it should, deploying it so people can use it, and then maintaining it as needs change and problems appear. Writing code is one step of six. Most professional time goes into understanding what to build and keeping it working, which is why this course spends as long on design, testing, security and operations as on code.",
        decision: decide({
          scenario:
            "A school asks your team for an application where students can check their exam results online. A teammate opens an editor and starts writing code.",
          question: "What should happen before any code is written?",
          right: ["Find out who will use it and what they need: which results, who may see whose, how results arrive, what happens on results day", "Requirements come first: they decide what the code must do."],
          wrong: [
            ["Choose the fastest programming language", "Speed does not matter until you know what is being built."],
            ["Design the logo and colour scheme", "Appearance is a small part, and still comes after knowing what the system does."],
            ["Buy a server", "You cannot size or choose hosting without knowing the requirements."],
          ],
          at: 0,
          aftermath: "Only after the requirements are clear do design, code, tests and deployment follow, and each of them is checked against those requirements.",
        }),
      },
      {
        id: "a-be-how-apps-work",
        title: "What a web application is made of",
        explain:
          "A web application is split across computers. The part you see runs in your browser or on your phone: pages, buttons, forms. The part that does the work runs on a SERVER: a program that waits for requests, decides what to do, reads and writes data, and sends answers back. The data itself lives in a DATABASE, a program built to store information safely and find it fast. Below is a real server, the one this week is built around. Press Run, then send it the two requests: GET / gets back a page of HTML for a browser to show; GET /api/courses gets back data (JSON) for an app to use. Watch the terminal: the server prints a line for every request it receives.",
        nodeDemo: {
          files: { "server.js": W1_SERVER },
          requests: REQUESTS.slice(0, 2),
        },
        decision: decide({
          scenario: "You run the server above and open http://localhost:3000/ in a browser. The heading Memora Academy appears.",
          question: "Which program produced the HTML that the browser shows?",
          right: ["server.js, the backend: it sent the HTML in its response, and the browser drew it", "The terminal shows the request arriving: GET /."],
          wrong: [
            ["The browser wrote it", "The browser only displays what the server sent."],
            ["The database", "This server has no database: the courses are in its own code."],
            ["Node.js itself, without server.js", "Node runs the program; the program decides what to send."],
          ],
          at: 0,
          aftermath: "The browser asked, the server answered. Every web page you have ever seen arrived this way.",
        }),
      },
      {
        id: "a-be-three-layers",
        title: "Frontend, backend and database",
        explain:
          "Every web application has three layers, each with its own job. The FRONTEND runs on the user's device: it shows information and collects input. Because it runs on the user's machine, anything in it can be read and changed by the user, so it must never be trusted with secrets or decisions. The BACKEND runs on servers you control: it checks who is asking, enforces the business rules (a student sees only their own results; a course cannot be over-booked), talks to other services, and decides what each response contains. The DATABASE stores the data and enforces the rules that must always hold, whichever program writes (every enrollment refers to a real student; an email address is used once). A rule checked only in the frontend is not a rule: anyone can send the backend a request directly, as you just did.",
        decision: decide({
          scenario:
            "In a results app, students must only ever see their own results. A developer hides other students' results with code in the web page.",
          question: "Where must this rule be enforced?",
          right: ["In the backend, on every request: it checks who is logged in and only returns that student's results", "The frontend can be bypassed; the backend cannot."],
          wrong: [
            ["In the web page, as the developer did", "Anyone can call the backend directly and read every result."],
            ["Nowhere: students will not try", "Some will, and the data is personal."],
            ["In the browser's settings", "The server cannot rely on anything the user controls."],
          ],
          at: 1,
          aftermath: "The frontend is for showing and collecting; the backend is for deciding; the database is for keeping. Week 14 tests this rule on every endpoint.",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 2 · 1.3 – 1.5 · CLIENTS, SERVERS AND ONE REQUEST
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "be-l2-request",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 2,
    covers: ["1.3", "1.4", "1.5"],
    title: "Clients, Servers and One Request",
    subtitle: "Client-server architecture and the request-response lifecycle",
    estimatedMinutes: 55,
    intro:
      "The web runs on one pattern: a client asks, a server answers. In this lesson you follow one request all the way through, watch a real one with curl, and change a real server so it answers new requests correctly.",
    atoms: [
      {
        id: "a-be-client-server",
        title: "Client-server architecture",
        explain:
          "A CLIENT is any program that sends requests: a browser, a mobile app, another server, a command like curl. A SERVER is a program that waits for requests and answers them. One server serves many clients at once, and a client can talk to many servers (a page may fetch from your API, a map service and a payment provider). Clients start every conversation; servers only answer. That is why your backend never 'pushes' to a browser that did not ask (Week 18 shows the exceptions). Below, the server answers every path with the home page. A mobile app needs the course list as data, so add the route it will call.",
        nodeLab: {
          task:
            "Change server.js so that a request for /api/courses gets the list of courses as JSON: status 200, the header Content-Type: application/json, and the body JSON.stringify(courses). The home page at / must keep working. Run it and send both requests to see the difference.",
          files: { "server.js": HOME_ONLY },
          solution: { "server.js": WITH_API },
          requests: REQUESTS.slice(0, 2),
          tests: [
            { label: "GET / still answers the home page (200, HTML)", check: `const r = await get("/"); eq(r.status, 200, "GET / should answer 200"); has(r.headers["content-type"], "text/html", "GET / should still be HTML"); has(r.text, "Memora Academy", "the home page should still show the heading");` },
            { label: "GET /api/courses answers 200 with Content-Type: application/json", check: `const r = await get("/api/courses"); eq(r.status, 200, "GET /api/courses should answer 200"); has(r.headers["content-type"], "application/json", "the Content-Type should be application/json, so clients know the body is JSON");` },
            { label: "Its body is the list of courses, as JSON", check: `const r = await get("/api/courses"); eq(r.json, [{ id: 1, title: "Backend Engineering", weeks: 24 }, { id: 2, title: "Relational Databases", weeks: 16 }], "the body should be JSON.stringify(courses)");` },
          ],
          hint: 'Add a branch before the final else: } else if (req.url === "/api/courses") { res.writeHead(200, { "Content-Type": "application/json" }); res.end(JSON.stringify(courses)); }',
          successMessage:
            "Same server, two kinds of answer: HTML for a browser to show, JSON for a program to use. Most backends you will build answer with JSON; the frontend decides how to display it.",
        },
      },
      {
        id: "a-be-visiting-a-site",
        title: "What happens when a user visits a website",
        explain:
          "Typing https://academy.example/courses and pressing Enter starts a chain: (1) the browser splits the URL into scheme (https), host (academy.example) and path (/courses); (2) it asks DNS for the host's IP address (Lesson 3); (3) it opens a TCP connection to that address on port 443; (4) for https it performs a TLS handshake, checking the site's certificate and agreeing on encryption; (5) it sends an HTTP request: GET /courses plus headers; (6) the server's program handles it, perhaps querying a database; (7) the server sends a response: a status, headers and a body; (8) the browser renders the HTML and, for each image, stylesheet and script it references, repeats steps 5 to 8, usually over the same connection. curl -v shows steps 3, 5 and 7 for real: lines with * are curl's notes, > is what it sent, < is what came back.",
        example: shown("w1-http", "curl -v http://localhost:3000/"),
        terminalExercise: term("w1-http", {
          only: ["curl -v http://localhost:3000/", "curl -i http://localhost:3000/api/courses", "curl -i http://localhost:3000/nope", "node server.js"],
          goal: "Show the whole exchange for the home page: the connection, the request curl sent, and the response, headers included.",
          accept: ["curl -v http://localhost:3000/"],
          near: [{ command: "curl -i http://localhost:3000/api/courses", why: "-i shows the response's headers, but not the connection or the request. -v (verbose) shows all three." }],
          hint: "curl -v (verbose) prints the connection, the request lines starting with > and the response lines starting with <.",
          success: "Trying, Established connection, the request (> GET / HTTP/1.1), the response (< HTTP/1.1 200 OK), then the body. That is one round trip, as every request makes.",
        }),
      },
      {
        id: "a-be-request-response",
        title: "The request-response lifecycle",
        explain:
          "Every HTTP exchange is one REQUEST and one RESPONSE. The request has a method and a path (GET /api/courses), headers (Host, User-Agent, Accept …) and sometimes a body (the JSON of a form). The response has a status line (HTTP/1.1 200 OK), headers (Content-Type tells the client what the body is) and a body. The status code says how it went: 2xx success, 3xx go elsewhere, 4xx the client asked for something wrong, 5xx the server failed. HTTP is STATELESS: each request stands alone, and the server remembers nothing between them unless it is told (a cookie or token, Week 13). Right now the server answers 200 with the home page for any path, so a typo looks like success. A missing page must be a 404.",
        nodeLab: {
          task:
            "Make the server answer any path it does not know with status 404, Content-Type: text/plain, and the body Not found. / and /api/courses must keep working. Send GET /nope before and after your change and compare the status line.",
          files: { "server.js": WITH_API },
          solution: { "server.js": WITH_404 },
          requests: REQUESTS,
          tests: [
            { label: "GET /nope answers 404 Not Found", check: `const r = await get("/nope"); eq(r.status, 404, "an unknown path should answer 404");` },
            { label: "… with the body Not found, as text/plain", check: `const r = await get("/courses-typo"); eq(r.text, "Not found", "the body should be Not found"); has(r.headers["content-type"], "text/plain", "the Content-Type should be text/plain");` },
            { label: "/ and /api/courses still answer 200", check: `eq((await get("/")).status, 200, "GET / should still answer 200"); eq((await get("/api/courses")).status, 200, "GET /api/courses should still answer 200");` },
          ],
          hint: 'In the final else, change 200 to 404, the Content-Type to "text/plain", and the body to "Not found".',
          successMessage:
            "Now the status code tells the truth. Clients, monitoring and search engines all read it before anything else, so a wrong 200 hides real problems. Week 6 covers every status code you will use.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 3 · 1.6 · HTTP, HTTPS, DNS, IP ADDRESSES, PORTS AND HOSTING
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "be-l3-network",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 3,
    covers: ["1.6"],
    title: "HTTP, HTTPS, DNS, IP Addresses, Ports and Hosting",
    subtitle: "How a request finds your server, and how it stays private",
    estimatedMinutes: 55,
    intro:
      "A request has to find the right computer, then the right program on it, and then travel safely. This lesson covers the addresses, names, ports and encryption that make that happen, and where servers actually live.",
    atoms: [
      {
        id: "a-be-ip-ports",
        title: "IP addresses and ports",
        explain:
          "Every computer on a network has an IP ADDRESS: IPv4 looks like 203.0.113.10, IPv6 like 2001:db8::10. Some addresses are special: 127.0.0.1 (IPv4) and ::1 (IPv6) always mean this same computer, which is what localhost names; 10.x, 172.16–31.x and 192.168.x are private addresses used inside networks. An address finds the computer; a PORT, a number from 1 to 65535, finds the program on it. Only one program can listen on a port at a time. Some ports are conventions: 80 for HTTP, 443 for HTTPS, 5432 for PostgreSQL, 6379 for Redis, and 3000 or 8080 for development servers. When you deploy, the hosting platform often tells your app which port to listen on.",
        nodeLab: {
          task:
            "The platform you are deploying to runs another program on port 3000 and gives your app port 8080. Change server.js so it listens on port 8080, and update the message it prints so it tells the truth. Run it: the terminal shows where it is listening.",
          files: { "server.js": WITH_404 },
          solution: { "server.js": WITH_404.replace("server.listen(3000, () => console.log(\"Listening on http://localhost:3000\"));", "server.listen(8080, () => console.log(\"Listening on http://localhost:8080\"));") },
          requests: REQUESTS.slice(0, 2).map((r) => ({ ...r, port: 8080 })),
          tests: [
            { label: "The server answers on port 8080", check: `const r = await get("/api/courses", { port: 8080 }); eq(r.status, 200, "a request to localhost:8080 should reach the server" + (r.error ? " (" + r.error + ")" : ""));` },
            { label: "Nothing answers on port 3000 any more", check: `const r = await get("/", { port: 3000 }); eq(r.status, 0, "port 3000 belongs to another program now: the server should not listen there");` },
            { label: "The startup message names the right port", check: `has(output(), "localhost:8080", "the message should say http://localhost:8080"); lacks(output(), "localhost:3000", "the message still mentions port 3000");` },
          ],
          hint: "server.listen(8080, …), and change the message inside the callback to match.",
          successMessage:
            "A request for port 3000 now gets 'connection refused': nothing is listening there. Week 5 reads the port from the environment instead (process.env.PORT), so the platform can choose it without a code change.",
        },
      },
      {
        id: "a-be-dns",
        title: "Domains and DNS",
        explain:
          "People remember names; networks route numbers. A DOMAIN such as academy.example is a name you register; the DOMAIN NAME SYSTEM (DNS) is the worldwide directory that turns names into IP addresses. When a browser needs academy.example, it asks a DNS resolver, which asks the servers responsible for that domain and returns its records: an A record (an IPv4 address), an AAAA record (IPv6), a CNAME (another name to look up instead). Answers are cached for a time (the TTL), which is why DNS changes take a while to reach everyone. Node.js can ask DNS too. Below, lookup.js does exactly what a browser does first: it asks for example.com's addresses.",
        example: `lookup.js\n${"-".repeat(9)}\n// lookup.js — ask DNS for a domain's IP addresses, the browser's first step\nconst dns = require("node:dns/promises");\n…\n\n${shown("w1-dns", "node lookup.js example.com")}`,
        terminalExercise: term("w1-dns", {
          only: ["node lookup.js example.com", "node lookup.js localhost", "node lookup.js no-such-site.example"],
          goal: "Find out what localhost really is: ask DNS for its addresses.",
          accept: ["node lookup.js localhost"],
          near: [{ command: "node lookup.js example.com", why: "That shows example.com's public addresses. The goal is localhost." }],
          hint: "lookup.js takes the domain to look up as its argument.",
          success: "::1 and 127.0.0.1: localhost is this computer, in IPv6 and IPv4. And a name nobody registered gives ENOTFOUND: no records, so no address to connect to.",
        }),
      },
      {
        id: "a-be-https",
        title: "HTTP and HTTPS",
        explain:
          "Plain HTTP travels as readable text: anyone on the network path (the café's Wi-Fi, an internet provider) can read and change it, passwords and session cookies included. HTTPS is HTTP inside TLS (Transport Layer Security): before any HTTP is sent, the client and server agree on encryption keys, and the server proves its identity with a CERTIFICATE signed by an authority the client trusts. After that the request and response are encrypted and tamper-proof. The HTTP itself is unchanged, as the two recordings below show: same status line, same headers. Production backends serve only HTTPS, usually on port 443, and redirect any plain HTTP to it.",
        example: `${shown("w1-dns", "curl -sI http://example.com")}\n\n${shown("w1-dns", "curl -sI https://example.com")}`,
        decision: decide({
          scenario: "A login form on a public Wi-Fi network posts the email and password to http://academy.example/login (not https).",
          question: "What is the risk?",
          right: ["Anyone on the same network can read the password and the session cookie as they travel, and even change the response", "Without TLS, HTTP is readable text."],
          wrong: [
            ["None: passwords are always encrypted by the browser", "Browsers encrypt only with HTTPS."],
            ["Only that the page loads slower", "Speed is not the problem; exposure is."],
            ["The server will refuse the password", "The server receives it fine; so can everyone else."],
          ],
          at: 0,
          aftermath: "This is why every API in this course is deployed behind HTTPS (Week 19) and cookies are marked Secure (Week 13).",
        }),
      },
      {
        id: "a-be-hosting",
        title: "Hosting: where servers live",
        explain:
          "Your server has to run on a computer that is always on and reachable. Options range from most control to least: a VIRTUAL PRIVATE SERVER (VPS) you manage yourself; CONTAINER platforms that run your Docker image (Week 19); PLATFORMS AS A SERVICE (Render, Railway, Fly.io, Heroku) that run your code from Git; SERVERLESS functions that run per request. Whatever you choose, a request reaches you the same way: DNS turns your domain into the host's IP address; the request arrives on port 443; a REVERSE PROXY or load balancer terminates TLS and forwards it to your app's port (such as 3000) on a private address. Your app never needs to know the user's domain or handle certificates itself.",
        decision: decide({
          scenario: "Your API runs on a VPS at 203.0.113.10 and listens on port 3000. Users must reach it at https://api.academy.example.",
          question: "What is needed?",
          right: ["A DNS A record for api.academy.example pointing to 203.0.113.10, and a reverse proxy on port 443 with a TLS certificate forwarding to port 3000", "DNS finds the machine; the proxy handles HTTPS and forwards to the app."],
          wrong: [
            ["Tell users to visit http://203.0.113.10:3000", "No name, no HTTPS, and the port exposed."],
            ["Change the app to listen on port 443 and nothing else", "Without DNS and a certificate, the name and HTTPS still do not work."],
            ["A CNAME from api.academy.example to localhost", "localhost means the user's own computer."],
          ],
          at: 2,
          aftermath: "Week 19 sets this up for real: Docker, a reverse proxy, a certificate and a deployment.",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 4 · 1.7 – 1.8 · STATIC SITES, DYNAMIC APPLICATIONS, BACKEND WORK
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "be-l4-dynamic",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 4,
    covers: ["1.7", "1.8"],
    title: "Static Sites, Dynamic Applications and Backend Work",
    subtitle: "When you need a backend, and what backend developers do",
    estimatedMinutes: 40,
    intro: "Not every website needs a backend. This lesson draws the line, then looks at the work and the roles on the other side of it.",
    atoms: [
      {
        id: "a-be-static-dynamic",
        title: "Static websites and dynamic applications",
        explain:
          "A STATIC site is a set of files (HTML, CSS, images) sent exactly as stored: everyone gets the same page, and a content delivery network (CDN) can serve it from anywhere, fast and cheaply. Brochure sites, documentation and blogs often need nothing more. A DYNAMIC application builds each response from data at the moment of the request: your own results, the courses still open, a search for 'SQL'. It needs a backend, because something has to look up the data, check who is asking and assemble the answer. Below, add a dynamic answer: a count computed from the data, so it stays right when the data changes.",
        nodeLab: {
          task:
            "Add a route GET /api/stats that answers 200 with JSON of the form { \"courses\": <number of courses> }. Compute the number from the courses array (courses.length), do not type it, so the answer changes when a course is added.",
          files: { "server.js": WITH_404 },
          solution: {
            "server.js": WITH_404.replace(
              `  } else {
    res.writeHead(404`,
              `  } else if (req.url === "/api/stats") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ courses: courses.length }));
  } else {
    res.writeHead(404`
            ),
          },
          requests: [...REQUESTS.slice(0, 2), { label: "GET /api/stats", method: "GET", path: "/api/stats" }],
          tests: [
            { label: "GET /api/stats answers 200 with JSON", check: `const r = await get("/api/stats"); eq(r.status, 200, "GET /api/stats should answer 200"); has(r.headers["content-type"], "application/json", "the Content-Type should be application/json");` },
            { label: 'The body is { "courses": 2 }', check: `eq((await get("/api/stats")).json, { courses: 2 }, "the body should count the courses");` },
            { label: "The number is computed from the data, not typed", check: `has(source("server.js"), "courses.length", "use courses.length so the count follows the data");` },
          ],
          hint: 'Another branch: } else if (req.url === "/api/stats") { res.writeHead(200, { "Content-Type": "application/json" }); res.end(JSON.stringify({ courses: courses.length })); }',
          successMessage:
            "That answer is dynamic: add a third course and it says 3 without anyone touching the route. Real backends compute from a database rather than an array, from Week 11.",
        },
      },
      {
        id: "a-be-roles",
        title: "Backend developer roles",
        explain:
          "Backend work splits into roles that overlap in small teams. A BACKEND or API DEVELOPER builds the endpoints, business logic and data access (most of this course). A PLATFORM or INFRASTRUCTURE engineer builds the systems other developers deploy onto. A DEVOPS or SITE RELIABILITY ENGINEER (SRE) automates deployment and keeps services up: monitoring, alerting, incidents (Weeks 19–20). A DATA ENGINEER builds pipelines that move and transform data. A SECURITY ENGINEER finds and fixes weaknesses (Week 14). A FULL-STACK developer does frontend and backend. Job titles vary; the skills do not: HTTP, a language, databases, security, testing and operations.",
        decision: decide({
          scenario:
            "A job advert says: 'You will design REST endpoints for our learning platform, write the business logic for enrollments and payments, model data in PostgreSQL, and write automated tests for your code.'",
          question: "Which role is this?",
          right: ["Backend (API) developer", "Endpoints, business logic, data modelling and tests: the core backend job."],
          wrong: [
            ["Site reliability engineer", "SREs focus on running services: monitoring, incidents, capacity."],
            ["Data engineer", "Data engineers build pipelines and warehouses, not product endpoints."],
            ["Frontend developer", "Nothing here runs in the browser."],
          ],
          at: 1,
          aftermath: "This course prepares you for exactly that advert, and gives you enough of the neighbouring roles to work well with them.",
        }),
      },
      {
        id: "a-be-use-cases",
        title: "Real-world backends",
        explain:
          "Every product you use leans on a backend. An E-LEARNING platform tracks enrollments, progress, grades and certificates, and must never lose a learner's work. A JOB PLATFORM matches candidates to listings with search and filters, and keeps applications private. A PAYMENTS system moves money: every charge must happen exactly once, even when networks fail (Week 16). A RIDE-HAILING app matches riders and drivers in real time (Week 18). Each makes different demands: some above all need correctness, some speed, some real-time updates. Recognising the demand tells you what to design for.",
        decision: decide({
          scenario: "Three features: (A) a list of popular courses on the home page; (B) charging a student's card for a course; (C) live typing indicators in a chat.",
          question: "Which one must above all never happen twice, even if the user's network drops mid-request and the app retries?",
          right: ["B: the card charge", "Money must move exactly once; Week 16 builds this with idempotency keys."],
          wrong: [
            ["A: the popular courses list", "Showing it twice harms nobody; it is a read."],
            ["C: typing indicators", "Duplicates are harmless; it is a hint, not a record."],
            ["All three equally", "Only one of them changes something that matters if repeated."],
          ],
          at: 1,
          aftermath: "Telling reads from writes, and harmless repeats from harmful ones, is one of the most useful habits in backend work.",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 5 · 1.9 · EXERCISE: TRACE A LOGIN REQUEST
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "be-l5-trace-login",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 5,
    covers: ["1.9"],
    title: "Exercise: Trace a Login Request",
    subtitle: "From the browser to the server, the database and back",
    estimatedMinutes: 50,
    intro:
      "Logging in touches every layer: the browser, the network, the backend, the database and a cookie on the way back. Here is a real login API on a real PostgreSQL database. Run it, log in, fail to log in, and trace what happened at each step.",
    atoms: [
      {
        id: "a-be-login-flow",
        title: "A login, step by step",
        explain:
          "The backend below logs each step of a login as it happens. Run it and send the three requests: the right password (ada@example.com / correct-horse), a wrong one, and a missing field. Read the terminal: (1) the request arrives at POST /login with a JSON body; (2) the backend asks the database for the user with that email, using a parameter ($1) so the input cannot change the SQL; (3) it compares the password with the stored HASH (the database never holds the password itself, Week 13); (4) on success it creates a session and sends it back as a cookie, which the browser will attach to every later request. On failure it answers 401 and says nothing about which part was wrong.",
        nodeDemo: {
          files: { "package.json": LOGIN_PKG, ".env": LOGIN_ENV, "server.js": LOGIN_SERVER },
          readOnly: ["package.json", ".env"],
          open: "server.js",
          db: LOGIN_DB,
          requests: [
            { label: "Right password", method: "POST", path: "/login", body: { email: "ada@example.com", password: "correct-horse" } },
            { label: "Wrong password", method: "POST", path: "/login", body: { email: "ada@example.com", password: "guess123" } },
            { label: "Missing password", method: "POST", path: "/login", body: { email: "ada@example.com" } },
          ],
        },
        decision: decide({
          scenario: "You send the right password and the backend answers 200 with a Set-Cookie header.",
          question: "In what order did the backend do its work?",
          right: ["Read the JSON body → look up the user by email in the database → compare the password with the stored hash → create a session and send the cookie", "Each step needs the one before it."],
          wrong: [
            ["Create the session → look up the user → check the password", "A session before checking the password would log anyone in."],
            ["Compare the password → look up the user", "There is nothing to compare against until the user's hash is fetched."],
            ["Send the cookie → read the body", "The response comes last."],
          ],
          at: 0,
          aftermath: "The order is the logic. Week 13 builds this flow yourself, with lockouts, verification and secure cookies.",
        }),
      },
      {
        id: "a-be-login-trace",
        title: "Write the trace",
        explain:
          "Tracing a request in writing is how engineers explain systems to each other, design them, and debug them. A good trace is a numbered list of steps, each saying which component does what and what passes between them: the browser resolves the name with DNS, connects with HTTPS, sends POST /login; the backend queries the database; the database answers; the backend checks the hash; the response carries a status and a cookie. Write the trace of a SUCCESSFUL login in TRACE.md, from the user pressing 'Log in' to the browser storing the cookie.",
        nodeLab: {
          task:
            "Complete TRACE.md: a numbered list of at least 8 steps tracing one successful login, in order. Mention, in this order, DNS, HTTPS (or TLS), POST /login, the database query, the password hash check, the response status (200), and the cookie. Keep the title.",
          command: false,
          files: {
            "TRACE.md": "# Trace: one successful login\n\n1. The user types their email and password and presses Log in.\n2. \n",
          },
          solution: {
            "TRACE.md":
              "# Trace: one successful login\n\n1. The user types their email and password and presses Log in.\n2. The browser asks DNS for the IP address of academy.example.\n3. It opens a connection to that address on port 443 and performs the HTTPS (TLS) handshake.\n4. It sends POST /login with a JSON body holding the email and password.\n5. The backend reads the body and checks both fields are present.\n6. It runs a database query: SELECT the user's id and password hash WHERE email = $1.\n7. The database answers with one matching row.\n8. The backend compares the password with the stored hash using bcrypt: they match.\n9. It creates a session and answers 200 with a Set-Cookie header holding the session id.\n10. The browser stores the cookie and sends it with every later request.\n",
          },
          tests: [
            { label: "TRACE.md keeps its title", check: `has(file("TRACE.md"), "# Trace: one successful login", "keep the title line");` },
            { label: "It has at least 8 numbered steps", check: `const steps = (file("TRACE.md").match(/^\\s*\\d+\\.\\s+\\S.*$/gm) || []).length; assert(steps >= 8, "write at least 8 numbered steps (found " + steps + ")");` },
            { label: "It mentions DNS, HTTPS, POST /login, the database, the hash, 200 and the cookie", check: `const t = file("TRACE.md").toLowerCase(); for (const [word, re] of [["DNS", /\\bdns\\b/], ["HTTPS or TLS", /https|tls/], ["POST /login", /post \\/login/], ["the database query", /database|select/], ["the password hash", /hash/], ["status 200", /\\b200\\b/], ["the cookie", /cookie/]]) assert(re.test(t), "the trace does not mention " + word);` },
            { label: "… in the order they happen", check: `const t = file("TRACE.md").toLowerCase(); const at = [/\\bdns\\b/, /https|tls/, /post \\/login/, /database|select/, /hash/, /\\b200\\b/, /cookie/].map((re) => t.search(re)); for (let i = 1; i < at.length; i++) assert(at[i] > at[i - 1], "the steps are out of order: check where you mention each one");` },
          ],
          hint: "One line per step: DNS lookup → HTTPS connection → POST /login → database query → hash comparison → 200 response with a cookie → the browser stores the cookie.",
          successMessage:
            "That trace is the system, in words. Keep it: the deliverable at the end of the week builds a whole system diagram around it.",
        },
      },
      {
        id: "a-be-login-failures",
        title: "Where a login can fail",
        explain:
          "Each step can fail, and each failure has its own symptom. DNS cannot find the name: the browser shows 'site can't be reached' and the backend never hears of it. The connection is refused: nothing listens on the port. The certificate is invalid: the browser warns and stops. The request is malformed: the backend answers 400 Bad Request. The password is wrong: 401 Unauthorized. Too many attempts: 429 Too Many Requests (Week 13). The database is down: 500 or 503, and the backend's logs say why. Knowing where a request died tells you where to look, and the status code is your first clue.",
        decision: decide({
          scenario: "Users report that logging in shows 'Something went wrong'. The backend's logs show: 'connect ECONNREFUSED 127.0.0.1:5432' for every POST /login.",
          question: "Where did the requests fail?",
          right: ["Between the backend and the database: nothing is accepting connections on PostgreSQL's port, 5432", "The request reached the backend; the backend could not reach the database."],
          wrong: [
            ["DNS could not resolve the site", "Then the requests would never reach the backend to be logged."],
            ["The users typed the wrong password", "That would be a 401 and no connection error."],
            ["The browser's cookie expired", "The error is about port 5432, the database."],
          ],
          at: 2,
          aftermath: "Logs that say which step failed and why turn a vague complaint into a five-minute fix. Week 16 makes your own logs that useful.",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 6 · 1.10 – 1.11 · EXERCISES: DRAW A PLATFORM, SPLIT A PLATFORM
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "be-l6-architecture",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 6,
    covers: ["1.10", "1.11"],
    title: "Exercises: Draw an E-Learning Platform, Split a Job Platform",
    subtitle: "Architecture diagrams, and what belongs where",
    estimatedMinutes: 55,
    intro:
      "An architecture diagram shows a system's parts and how requests and data move between them. You will draw one for an e-learning platform, as text that renders as a diagram, then decide what belongs to the frontend, backend and database of a job platform.",
    atoms: [
      {
        id: "a-be-arch-diagram",
        title: "Draw the e-learning platform",
        explain:
          "Engineers draw architecture as boxes (components) and arrows (who talks to whom). Mermaid lets you write the drawing as text, which GitHub and most documentation tools render: flowchart LR starts a left-to-right chart, Browser[Web browser] declares a box with a label, and Browser --> API draws an arrow. An e-learning platform has: the WEB APP in the browser and a MOBILE APP; the API (your backend); PostgreSQL for the data; OBJECT STORAGE for videos and certificates; an EMAIL service for notifications; a PAYMENT provider. Arrows go from the caller to the called: the browser calls the API, the API calls the database. The browser never calls the database directly: that would mean giving every user the database password.",
        nodeLab: {
          task:
            "Complete the Mermaid diagram in ARCHITECTURE.md for the e-learning platform. It must have the web browser, a mobile app, the API, PostgreSQL, object storage and an email service, with arrows: browser → API, mobile app → API, API → PostgreSQL, API → object storage, API → email. Nothing may connect a client straight to the database.",
          command: false,
          files: {
            "ARCHITECTURE.md": "# Memora Academy: architecture\n\n```mermaid\nflowchart LR\n  Browser[Web browser] --> API[Academy API]\n```\n",
          },
          solution: {
            "ARCHITECTURE.md":
              "# Memora Academy: architecture\n\n```mermaid\nflowchart LR\n  Browser[Web browser] --> API[Academy API]\n  Mobile[Mobile app] --> API\n  API --> DB[(PostgreSQL)]\n  API --> Storage[Object storage: videos and certificates]\n  API --> Email[Email service]\n```\n",
          },
          tests: [
            { label: "It is a Mermaid flowchart", check: `${PARSE_DIAGRAM("ARCHITECTURE.md")} assert(block, "keep the diagram inside a \`\`\`mermaid block"); assert(/^\\s*(flowchart|graph)\\b/.test(block[1]), "start the diagram with flowchart LR");` },
            { label: "It has the browser, mobile app, API, PostgreSQL, object storage and email", check: `${PARSE_DIAGRAM("ARCHITECTURE.md")} const ids = Object.keys(nodes); for (const [what, re] of [["the web browser", /browser/i], ["a mobile app", /mobile/i], ["the API", /api|backend|server/i], ["PostgreSQL", /postgres|database/i], ["object storage", /storage|s3|bucket/i], ["an email service", /e-?mail/i]]) assert(ids.some((id) => re.test(label(id)) || re.test(id)), "the diagram has no box for " + what);` },
            { label: "Both clients call the API, and the API calls PostgreSQL", check: `${PARSE_DIAGRAM("ARCHITECTURE.md")} assert(edges.some(([a, b]) => is(/browser/i)(a) && api(b)), "draw an arrow from the browser to the API"); assert(edges.some(([a, b]) => is(/mobile/i)(a) && api(b)), "draw an arrow from the mobile app to the API"); assert(edges.some(([a, b]) => api(a) && database(b)), "draw an arrow from the API to PostgreSQL");` },
            { label: "No client talks to the database directly", check: `${PARSE_DIAGRAM("ARCHITECTURE.md")} assert(!edges.some(([a, b]) => (browser(a) && database(b)) || (database(a) && browser(b))), "a client is connected straight to the database: only the API may talk to it");` },
          ],
          hint: "One line per arrow, for example: Mobile[Mobile app] --> API, then API --> DB[(PostgreSQL)], API --> Storage[Object storage], API --> Email[Email service].",
          successMessage:
            "A diagram anyone on the team can read, kept as text beside the code, so it changes when the system does. Paste it into any Markdown file on GitHub and it renders as boxes and arrows.",
        },
      },
      {
        id: "a-be-arch-video",
        title: "Following data through the diagram",
        explain:
          "A diagram earns its keep when you trace a feature through it. Watching a video lesson: the browser asks the API for the lesson; the API checks the learner is enrolled and answers with the lesson's details and a time-limited link to the video file in object storage; the browser then downloads the video from object storage directly (usually through a CDN), so gigabytes of video never pass through your API. Finishing the lesson: the browser tells the API; the API records progress in PostgreSQL; if that completes the course, it queues a certificate and an email (Week 18). Different features take different paths through the same boxes.",
        decision: decide({
          scenario: "Thousands of learners watch 500 MB video lessons at the same time. A developer proposes that the API read each video from storage and stream it to the browser itself.",
          question: "What is the better design?",
          right: ["The API checks access and returns a short-lived signed link; the browser downloads the video from object storage or a CDN directly", "The API decides who may watch; storage does the heavy lifting."],
          wrong: [
            ["Store the videos in PostgreSQL", "Databases are poor at serving huge files."],
            ["Stream every byte through the API, as proposed", "The API's servers and bandwidth become the bottleneck for no benefit."],
            ["Put the videos in the frontend's code", "Every user would download every video."],
          ],
          at: 0,
          aftermath: "Keep the backend in charge of decisions, and let specialised services carry the bytes. Week 18 builds signed links to object storage.",
        }),
      },
      {
        id: "a-be-job-filters",
        title: "A job platform: searching listings",
        explain:
          "Now split a job listing platform into its layers. Take searching: a candidate filters jobs by skill (Node.js), location (Lagos) and type (full-time). The FRONTEND shows the filter controls and the results. The BACKEND turns the filters into a database query, applies business rules (hide closed listings, hide jobs from suspended employers) and pages through the results. The DATABASE stores the listings and, with the right indexes (Week 12), finds matches among millions in milliseconds. Downloading every listing and filtering in the browser would be slow, expensive and would leak listings the user should not see.",
        decision: decide({
          scenario: "The job platform has 2 million listings. A teammate suggests the API return all of them and let the web page filter by skill, location and type.",
          question: "Where should the filtering happen?",
          right: ["In the database, through the backend's query: the API sends back only the matching page of results", "The database is built to find matching rows fast; the network and the browser are not."],
          wrong: [
            ["In the browser, as suggested", "2 million listings would take minutes to download and would include hidden ones."],
            ["In the browser for skills, in the database for location", "Splitting the filter still sends far too much to the browser."],
            ["Nowhere: show all listings", "Users need to filter."],
          ],
          at: 1,
          aftermath: "Week 6 builds filtering, sorting and pagination into an API; Week 12 makes it fast with indexes.",
        }),
      },
      {
        id: "a-be-job-applications",
        title: "A job platform: one application per job",
        explain:
          "Take another rule: a candidate may apply to each job only once. The FRONTEND can grey out the Apply button after applying, which is helpful but not a guarantee: a double-click, two open tabs or a direct API call would all get past it. The BACKEND checks before inserting and answers 409 Conflict for a duplicate. The DATABASE makes it impossible with a UNIQUE constraint on (candidate, job): even if two requests arrive at the same instant and both pass the backend's check, the second insert fails. Important rules belong in more than one layer, and the last line of defence is the database.",
        decision: decide({
          scenario: "Two of a candidate's browser tabs submit the same application at the same instant. The backend checks 'has this candidate applied?' before inserting, and both checks say no.",
          question: "What stops a duplicate application being stored?",
          right: ["A UNIQUE constraint on (candidate_id, job_id) in the database: the second insert fails, and the backend answers 409", "Only the database sees both inserts in order."],
          wrong: [
            ["The disabled Apply button", "Two tabs, or a direct API call, bypass it."],
            ["The backend's check alone", "Both checks ran before either insert: both said no."],
            ["Nothing can stop it", "A database constraint can."],
          ],
          at: 3,
          aftermath: "Week 12 reproduces exactly this race, and fixes it with a constraint.",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 7 · 1.P · DELIVERABLE: A DOCUMENTED SYSTEM DIAGRAM
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "be-l7-system-diagram",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 7,
    covers: ["1.P"],
    title: "Deliverable: A Documented System Diagram",
    subtitle: "How a web application works, explained by you",
    estimatedMinutes: 60,
    intro:
      "This week's deliverable is a document a new teammate could read on their first day: a diagram of a web application, what each part does, and one request traced through it. Build it here, where each requirement is checked, then put it in a repository of your own.",
    atoms: [
      {
        id: "a-be-w1-deliverable",
        title: "SYSTEM.md",
        explain:
          "A system document has a predictable shape, so readers find what they need: an OVERVIEW (what the application does and for whom), its COMPONENTS (each box, and its one job), a DIAGRAM, A REQUEST STEP BY STEP (one important request traced through every component, with the status codes), its DATA (what is stored, and where), and SECURITY (what protects what: HTTPS, passwords stored as hashes, the database reachable only from the backend). Choose any application you know well: this academy, a job platform, a shop. Write it in SYSTEM.md.",
        nodeLab: {
          task:
            "Write SYSTEM.md for a web application of your choice. It needs the six sections as ## headings (Overview, Components, Diagram, A request step by step, Data, Security); a Mermaid flowchart in Diagram with at least 4 components where a client calls the API and the API calls the database (and no client reaches the database directly); at least 6 numbered steps in the request section, including an HTTP method and path and a status code; and a Security section that mentions HTTPS.",
          command: false,
          files: {
            "SYSTEM.md":
              "# System: <your application>\n\n## Overview\n\n## Components\n\n## Diagram\n\n```mermaid\nflowchart LR\n```\n\n## A request step by step\n\n## Data\n\n## Security\n",
          },
          solution: {
            "SYSTEM.md":
              "# System: Memora Academy\n\n## Overview\n\nAn online academy where learners enroll in courses, work through lessons and earn certificates. Instructors publish courses; administrators manage both.\n\n## Components\n\n- **Web app**: runs in the learner's browser; shows lessons and collects answers.\n- **Mobile app**: the same for phones.\n- **Academy API**: the backend; checks who is asking, applies the rules, reads and writes data.\n- **PostgreSQL**: stores users, courses, enrollments, progress and certificates.\n- **Object storage**: holds lesson videos and certificate PDFs.\n- **Email service**: sends verification and enrollment emails.\n\n## Diagram\n\n```mermaid\nflowchart LR\n  Browser[Web app] --> API[Academy API]\n  Mobile[Mobile app] --> API\n  API --> DB[(PostgreSQL)]\n  API --> Storage[Object storage]\n  API --> Email[Email service]\n```\n\n## A request step by step\n\nEnrolling in a course:\n\n1. The learner presses Enroll in the web app.\n2. The browser resolves api.academy.example with DNS and connects over HTTPS.\n3. It sends POST /courses/42/enrollments with the session cookie.\n4. The API checks the session and finds the learner.\n5. It checks the course is open and has seats, then inserts the enrollment in PostgreSQL in one transaction.\n6. It answers 201 Created with the enrollment; the web app shows the first lesson.\n7. In the background, the API asks the email service to send a welcome email.\n\n## Data\n\nPostgreSQL holds users (passwords as hashes), courses, lessons, enrollments, progress and certificates. Videos and PDFs are files in object storage; the database stores their keys.\n\n## Security\n\nEvery request uses HTTPS. Passwords are stored only as hashes. Only the API can reach the database, with its own limited database role. Every endpoint checks who is asking and what they may do.\n",
          },
          tests: [
            { label: "The six sections are there, as ## headings", check: `const t = file("SYSTEM.md"); for (const h of ["Overview", "Components", "Diagram", "A request step by step", "Data", "Security"]) assert(new RegExp("^##\\\\s+" + h + "\\\\s*$", "mi").test(t), "missing the section ## " + h);` },
            { label: "Every section has something in it", check: `const t = file("SYSTEM.md"); const parts = t.split(/^##\\s+/m).slice(1); for (const p of parts) { const [head, ...body] = p.split("\\n"); assert(body.join("\\n").replace(/\`\`\`mermaid\\s*(flowchart|graph)\\s*\\w*\\s*\`\`\`/, "").trim().length > 20, "the section " + head.trim() + " is empty or too short"); }` },
            { label: "The diagram has at least 4 components: a client calls the API, the API calls the database", check: `${PARSE_DIAGRAM("SYSTEM.md")} assert(Object.keys(nodes).length >= 4, "draw at least 4 components (found " + Object.keys(nodes).length + ")"); assert(edges.some(([a, b]) => browser(a) && api(b)), "draw an arrow from a client (web or mobile app) to the API"); assert(edges.some(([a, b]) => api(a) && database(b)), "draw an arrow from the API to the database");` },
            { label: "No client reaches the database directly", check: `${PARSE_DIAGRAM("SYSTEM.md")} assert(!edges.some(([a, b]) => browser(a) && database(b)), "a client is connected straight to the database: route it through the API");` },
            { label: "The request has 6+ numbered steps, an HTTP method and path, and a status code", check: `const t = file("SYSTEM.md"); const sec = (t.split(/^##\\s+A request step by step\\s*$/mi)[1] || "").split(/^##\\s+/m)[0]; const steps = (sec.match(/^\\s*\\d+\\.\\s+\\S/gm) || []).length; assert(steps >= 6, "trace the request in at least 6 numbered steps (found " + steps + ")"); assert(/\\b(GET|POST|PUT|PATCH|DELETE)\\s+\\/\\S*/.test(sec), "name the request's method and path, for example POST /courses/42/enrollments"); assert(/\\b[1-5]\\d\\d\\b/.test(sec), "say which status code the response carries");` },
            { label: "The Security section mentions HTTPS", check: `const t = file("SYSTEM.md"); const sec = (t.split(/^##\\s+Security\\s*$/mi)[1] || "").split(/^##\\s+/m)[0]; assert(/https/i.test(sec), "say how data is protected in transit: HTTPS");` },
          ],
          hint: "Start from your ARCHITECTURE.md diagram and TRACE.md steps; give each component one line saying what it does; end with how HTTPS, password hashes and a database only the API can reach protect the data.",
          successMessage:
            "That is a real engineering document: the kind written before a system is built and kept up to date after. Push it to a repository of your own; Week 4 turns that repository into a professional one.",
        },
      },
    ],
    task: {
      title: "Week 1 deliverable: a documented system diagram",
      intro: "Write it here first, where each requirement is checked; then keep it.",
      prompts: [
        "Choose a web application you know well (this academy, a job platform, an online shop) and write SYSTEM.md in the lab above until every check is green.",
        "Render the diagram: paste the Mermaid block into a Markdown file on GitHub, or into the Mermaid Live Editor, and check the boxes and arrows say what you mean.",
        "Trace a second request of your own (for example, a failed login) and add it below the first, including the status code it ends with and why.",
        "Keep SYSTEM.md: in Week 4 it becomes the first document in your course repository.",
        "Checkpoint: given any web application, you can draw its clients, servers and database and explain every step of one request through them.",
      ],
      closing: "Next: Week 2, JavaScript fundamentals, the language your backend will be written in.",
    },
    requirements: { read: true, video: false, assessment: true },
  },
];
