/**
 * KOBO MARKET — THE CODEBASE ENGINEERING COURSE'S SAMPLE PROJECT
 *
 * The unfamiliar codebase every module investigates: a small but real
 * marketplace (React and Vite in src/, a framework-free Node API in server/,
 * a JSON data store, Paystack, node:test tests, ESLint). It is built as a
 * real Git repository by ./build.mjs, with the history below, so `git log`,
 * `git blame` and `git show` in the lessons return real answers.
 *
 * Files live in ./fixture. A path is the file's final version; `path@cN` is
 * the version introduced by commit cN, used until a later version replaces
 * it. `_gitignore` and `_env.example` are renamed to their dotted names at
 * build time (a real .gitignore here would apply to this repository too).
 *
 * The history is deliberately imperfect, as inherited code is: an unused
 * dependency (axios), an abandoned component (OldCheckout.jsx), a delivery fee
 * duplicated between the cart page and the server, and a TODO nobody did.
 * Lessons find each of these.
 */

const TOLU = { name: "Tolu Adebayo", email: "tolu@kobo.example" };
const CHIDI = { name: "Chidi Okeke", email: "chidi@kobo.example" };
const AMAKA = { name: "Amaka Eze", email: "amaka@kobo.example" };

/** The developer the learner plays: new to the team, inheriting the code. */
export const LEARNER = { name: "Ada Obi", email: "ada@kobo.example" };

export const COMMITS = [
  {
    id: "c1",
    author: TOLU,
    date: "2026-03-02T09:14:00+01:00",
    message: "Scaffold Vite and React app",
    files: [
      "package.json@c1",
      "index.html",
      "vite.config.js@c1",
      "src/main.jsx",
      "src/App.jsx@c1",
      "src/styles.css",
      "_gitignore",
      "README.md@c1",
    ],
  },
  {
    id: "c2",
    author: TOLU,
    date: "2026-03-04T11:02:00+01:00",
    message: "Add products API with a JSON data store",
    files: [
      "package.json@c2",
      "vite.config.js",
      "server/config.js@c2",
      "server/index.js@c2",
      "server/http.js",
      "server/router.js@c2",
      "server/routes/products.js",
      "server/db/index.js@c2",
      "server/db/seed.js@c2",
    ],
  },
  {
    id: "c3",
    author: TOLU,
    date: "2026-03-06T15:40:00+01:00",
    message: "Show products on the home page",
    files: [
      "package.json@c3",
      "src/App.jsx@c3",
      "src/api/client.js",
      "src/api/products.js",
      "src/pages/Products.jsx",
      "src/components/ProductCard.jsx",
      "src/components/OldCheckout.jsx",
    ],
  },
  {
    id: "c4",
    author: CHIDI,
    date: "2026-03-09T10:21:00+01:00",
    message:
      "Add email and password login\n\nPasswords are hashed with scrypt and a per-user salt. Sessions are\nHMAC-signed tokens, so SESSION_SECRET must be set for the API to start.",
    files: [
      "package.json@c4",
      "_env.example@c4",
      "server/config.js@c4",
      "server/index.js",
      "server/router.js@c4",
      "server/routes/auth.js@c4",
      "server/services/authService.js",
      "server/db/index.js@c4",
      "server/db/seed.js",
      "src/App.jsx@c4",
      "src/api/auth.js",
      "src/hooks/useAuth.js",
      "src/pages/Login.jsx",
      "src/components/Navbar.jsx",
      "tests/authService.test.js",
    ],
  },
  {
    id: "c5",
    author: AMAKA,
    date: "2026-03-11T13:05:00+01:00",
    message: "Add cart and order totals",
    files: [
      "server/router.js@c5",
      "server/routes/orders.js@c5",
      "server/services/orderService.js@c5",
      "server/db/index.js@c5",
      "src/App.jsx@c5",
      "src/api/orders.js",
      "src/pages/Cart.jsx",
      "src/utils/formatPrice.js",
      "tests/orderService.test.js@c5",
      "tests/formatPrice.test.js",
    ],
  },
  {
    id: "c6",
    author: CHIDI,
    date: "2026-03-12T09:48:00+01:00",
    message:
      "Require sign-in for orders\n\nAnyone could POST /api/orders without an account. Orders now need a\nvalid token, and the order records which user placed it.",
    files: [
      "server/middleware/requireAuth.js",
      "server/router.js",
      "server/routes/auth.js",
      "server/routes/orders.js@c6",
      "server/db/index.js",
    ],
  },
  {
    id: "c7",
    author: CHIDI,
    date: "2026-03-16T16:30:00+01:00",
    message: "Initialise Paystack payment for new orders",
    files: ["_env.example", "server/config.js", "server/payments/paystack.js", "server/routes/orders.js"],
  },
  {
    id: "c8",
    author: TOLU,
    date: "2026-03-18T12:10:00+01:00",
    message: "Add ESLint and commit the lockfile",
    files: ["package.json", "package-lock.json@c8", "eslint.config.js"],
    tag: { name: "v1.0.0", message: "First release" },
  },
  {
    id: "c9",
    author: AMAKA,
    date: "2026-03-25T14:55:00+01:00",
    message: "Free delivery on orders over ₦50,000",
    files: ["server/services/orderService.js", "tests/orderService.test.js"],
  },
  {
    id: "c10",
    author: TOLU,
    date: "2026-03-27T10:00:00+01:00",
    message: "Document setup and scripts in README",
    files: ["README.md"],
  },
  {
    id: "c11",
    author: AMAKA,
    date: "2026-04-02T17:20:00+01:00",
    message: "Keep the cart when the page reloads",
    files: ["src/App.jsx"],
    run: "npm version 1.1.0 --no-git-tag-version",
    tag: { name: "v1.1.0", message: "Cart survives reloads; free delivery from ₦50,000" },
  },
];

/** Pushed to the remote and left unmerged, as real teams' branches are. */
export const BRANCHES = [
  {
    name: "feature/wishlist",
    from: "c11",
    commits: [
      {
        id: "w1",
        author: AMAKA,
        date: "2026-04-06T11:45:00+01:00",
        message: "Start a wishlist page",
        files: ["src/pages/Wishlist.jsx@w1"],
      },
    ],
  },
];
