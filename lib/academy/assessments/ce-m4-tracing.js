/**
 * ASSESSMENTS · CODEBASE ENGINEERING · MODULE 4 · TRACING
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Never import this from anything under src/.
 * ═════════════════════════════════════════════════════════════════════════
 */

import { q, check } from "./ce-helpers.js";

export const ASSESSMENTS = {
  ...check("ce-l19-user-action", [
    q({ id: "ceq19-1", atom: "a-ce-action-path", d: 2, prompt: "Where should a trace of a feature usually start?", options: ["From something you can see for certain, such as the text on the button", "From the database", "From the largest file", "From package.json"], correct: "a",
      explanation: "Start from a known fact and follow the code outward.",
      wrong: { b: "You do not yet know which data is involved.", c: "Size is not relevance.", d: "It lists tools, not the feature's path." } }),
    q({ id: "ceq19-2", atom: "a-ce-ui-to-handler", d: 2, prompt: "A submit button sits inside a <form onSubmit={handleSubmit}>. What runs when it is clicked?", options: ["handleSubmit, the form's submit handler", "Nothing, buttons need onClick", "The router", "The server's login function directly"], correct: "a",
      explanation: "A submit button submits its form.",
      wrong: { b: "Submit buttons trigger the form's onSubmit.", c: "The router is on the server.", d: "The browser code runs first." } }),
    q({ id: "ceq19-3", atom: "a-ce-prop-hop", d: 3, prompt: "Login.jsx calls onSignIn(), but it is not defined in Login.jsx. How do you find what runs?", options: ["Search for onSignIn to find where it is passed in as a prop (onSignIn={...})", "Assume it is a browser built-in", "It is undefined, so nothing runs", "Read node_modules/react"], correct: "a",
      explanation: "Props come from the parent component.",
      wrong: { b: "It is the app's own function.", c: "The parent provides it.", d: "React does not define your props." } }),
    q({ id: "ceq19-4", atom: "a-ce-trace-order", d: 3, prompt: "handleSubmit(\"bola\") prints \"stopped: invalid email\". What does that tell you about a sign-in bug report?", options: ["Some failures never reach the server: check browser-side validation too", "The server is down", "The password was wrong", "The token expired"], correct: "a",
      explanation: "The chain can stop early in the browser.",
      wrong: { b: "No request was sent.", c: "The password was never checked.", d: "No token was involved." } }),
  ]),

  ...check("ce-l20-state", [
    q({ id: "ceq20-1", atom: "a-ce-state-updates", d: 2, prompt: "In React, how do you find every place a piece of state can change?", options: ["Search for its setter function (for example setCart)", "Search for its CSS class", "Read index.html", "Search for useEffect"], correct: "a",
      explanation: "The setter is the only way to change it.",
      wrong: { b: "Styling, not state.", c: "Holds only the root element.", d: "Effects react to changes; setters make them." } }),
    q({ id: "ceq20-2", atom: "a-ce-state-transform", d: 3, prompt: "addToCart always appends {quantity: 1}. What happens when the same product is added twice?", options: ["The cart has two separate lines for it", "One line with quantity 2", "The second add is ignored", "The app crashes"], correct: "a",
      explanation: "Nothing looks for an existing line.",
      wrong: { b: "No merging code exists.", c: "Nothing checks for duplicates.", d: "It appends normally." } }),
    q({ id: "ceq20-3", atom: "a-ce-props", d: 2, prompt: "What is a prop?", options: ["An input a component receives from its parent, data or a function", "A global variable", "A CSS property", "A database field"], correct: "a",
      explanation: "<Products onAdd={addToCart} /> passes onAdd.",
      wrong: { b: "Props are passed explicitly.", c: "Unrelated.", d: "Unrelated." } }),
    q({ id: "ceq20-4", atom: "a-ce-hooks", d: 2, prompt: "Where does Kobo Market keep the session between page reloads?", options: ["localStorage, under \"session\", saved by useAuth", "In a cookie set by the server", "In the URL", "Nowhere; users sign in on every reload"], correct: "a",
      explanation: "useAuth reads and writes localStorage.",
      wrong: { b: "No cookies are used.", c: "Not in the URL.", d: "The session survives reloads." } }),
  ]),

  ...check("ce-l21-api-auth", [
    q({ id: "ceq21-1", atom: "a-ce-endpoints", d: 2, prompt: "What does curl -si add compared with curl -s?", options: ["The status line and response headers", "A login", "Colour", "A request body"], correct: "a",
      explanation: "-i includes the headers.",
      wrong: { b: "No.", c: "No.", d: "-d sends a body." } }),
    q({ id: "ceq21-2", atom: "a-ce-status-codes", d: 3, prompt: "Which status family means the server itself failed?", options: ["5xx", "2xx", "3xx", "4xx"], correct: "a",
      explanation: "4xx is the request's fault; 5xx the server's.",
      wrong: { b: "Success.", c: "Redirects.", d: "Client errors." } }),
    q({ id: "ceq21-3", atom: "a-ce-authn", d: 3, prompt: "Why should login answer the same message for an unknown email and a wrong password?", options: ["So attackers cannot use it to find out which emails have accounts", "To save code", "Because the server cannot tell them apart", "To make users try harder"], correct: "a",
      explanation: "Different messages leak which accounts exist.",
      wrong: { b: "It is a security choice.", c: "It can tell them apart.", d: "Not the reason." } }),
    q({ id: "ceq21-4", atom: "a-ce-token", d: 2, prompt: "How does the browser prove who it is on requests after login?", options: ["It sends the token in an Authorization: Bearer header", "It sends the password every time", "The server remembers its IP address", "It does not need to"], correct: "a",
      explanation: "requireAuth reads that header.",
      wrong: { b: "Only at login.", c: "IP addresses are not identity.", d: "Protected routes require it." } }),
    q({ id: "ceq21-5", atom: "a-ce-authz", d: 4, prompt: "Editing u_1001 to u_1002 inside a token gets \"Sign in required\". Why?", options: ["The signature was made over the original text with a secret only the server has, so it no longer matches", "u_1002 does not exist", "Tokens are encrypted", "curl corrupted it"], correct: "a",
      explanation: "An HMAC signature detects any change.",
      wrong: { b: "u_1002 exists (the admin).", c: "They are signed, not encrypted: the content is readable.", d: "curl sent exactly what was asked." } }),
  ]),

  ...check("ce-l22-data-deps", [
    q({ id: "ceq22-1", atom: "a-ce-data-model", d: 2, prompt: "Kobo Market's user record has salt and passwordHash but no password. What does that show?", options: ["Passwords are stored only as salted hashes", "Users have no passwords", "The data is corrupted", "Passwords are in another file"], correct: "a",
      explanation: "Verified by hashing the attempt the same way.",
      wrong: { b: "They do, hashed.", c: "It is the intended shape.", d: "No plaintext copy exists." } }),
    q({ id: "ceq22-2", atom: "a-ce-integrations", d: 2, prompt: "Why do external integrations deserve special attention?", options: ["They fail independently of your code, need their own secrets, and may cost money", "They are always slow", "They cannot be tested", "They are written in other languages"], correct: "a",
      explanation: "Paystack is Kobo Market's one integration.",
      wrong: { b: "Not always.", c: "They can be tested, with care.", d: "Irrelevant." } }),
    q({ id: "ceq22-3", atom: "a-ce-transitive", d: 3, prompt: "What is a transitive dependency?", options: ["A dependency of one of your dependencies", "A dependency you wrote", "A dev dependency", "A deleted dependency"], correct: "a",
      explanation: "scheduler arrives through react-dom.",
      wrong: { b: "Your own code is not a dependency.", c: "A different distinction.", d: "No." } }),
    q({ id: "ceq22-4", atom: "a-ce-lockfile", d: 3, prompt: "package.json says ^18.3.1. What guarantees every machine installs the same exact React?", options: ["The committed lockfile, installed with npm ci", "The caret", "The README", "node_modules in Git"], correct: "a",
      explanation: "The lockfile pins exact versions and hashes.",
      wrong: { b: "The caret allows newer 18.x versions.", c: "Documentation is not enforcement.", d: "node_modules is never committed." } }),
    q({ id: "ceq22-5", atom: "a-ce-unused-dep", d: 2, prompt: "npm ls axios shows it installed. What proves whether it is used?", options: ["Searching the source for imports of it", "Its version number", "Its file size", "npm ls again"], correct: "a",
      explanation: "Installed is not the same as used.",
      wrong: { b: "Says nothing about use.", c: "Same.", d: "Same answer." } }),
  ]),

  ...check("ce-l23-navigation", [
    q({ id: "ceq23-1", atom: "a-ce-ide-nav", d: 2, prompt: "Which editor feature shows who calls a function, and who calls those?", options: ["Call Hierarchy", "Go to File", "Format Document", "Zen Mode"], correct: "a",
      explanation: "Shift+Alt+H in VS Code.",
      wrong: { b: "Opens files by name.", c: "Formats.", d: "Hides the interface." } }),
    q({ id: "ceq23-2", atom: "a-ce-git-grep", d: 3, prompt: "What can git grep do that a plain folder search cannot?", options: ["Search the code as it was at any commit or tag", "Search faster than anything", "Search images", "Edit files"], correct: "a",
      explanation: "git grep TEXT v1.0.0 searches that release.",
      wrong: { b: "Not its distinguishing feature.", c: "No.", d: "It only reads." } }),
    q({ id: "ceq23-3", atom: "a-ce-symptom-cause", d: 3, prompt: "\"The cart showed ₦61,000 but I was charged ₦59,500\" is:", options: ["A symptom: what was observed", "The root cause", "A fix", "A test"], correct: "a",
      explanation: "The cause is the duplicated rule.",
      wrong: { b: "It is what was seen, not why.", c: "No.", d: "No." } }),
    q({ id: "ceq23-4", atom: "a-ce-root-cause", d: 3, prompt: "What does git log -S FREE_DELIVERY_FROM find?", options: ["Commits that added or removed that text", "Commits with that word in the message", "The current value", "Who is online"], correct: "a",
      explanation: "The pickaxe search finds when code appeared.",
      wrong: { b: "That is --grep.", c: "That is a search of the files.", d: "No." } }),
    q({ id: "ceq23-5", atom: "a-ce-fix-where", d: 3, prompt: "Which fix addresses the root cause of the cart/server mismatch?", options: ["One shared definition of the delivery rule, plus a test", "Copy the threshold into Cart.jsx too", "A warning on the checkout page", "Remove free delivery"], correct: "a",
      explanation: "One definition cannot drift.",
      wrong: { b: "Still two copies.", c: "Documents the symptom.", d: "Changes the business to hide a bug." } }),
  ]),

  ...check("ce-l24-trace-practical", [
    q({ id: "ceq24-1", atom: "a-ce-p-handler", d: 2, prompt: "In Kobo Market, which function does the login handler call to do the real work?", options: ["authenticate, in server/services/authService.js", "findProduct", "sendJson only", "createRoot"], correct: "a",
      explanation: "The handler delegates to the service.",
      wrong: { b: "Products.", c: "That only writes the response.", d: "Frontend entry point." } }),
    q({ id: "ceq24-2", atom: "a-ce-p-db", d: 3, prompt: "Why does BOLA@kobo.test sign in successfully?", options: ["authenticate trims and lowercases the email before looking it up", "Emails are case-insensitive in JSON", "The browser lowercases it", "It does not"], correct: "a",
      explanation: "email.trim().toLowerCase() at authService.js:39.",
      wrong: { b: "JSON comparisons are exact.", c: "Login.jsx sends it as typed.", d: "It does." } }),
    q({ id: "ceq24-3", atom: "a-ce-p-storage", d: 3, prompt: "On a server, DATA_FILE points to a file that does not exist. What happens to sign-in?", options: ["It fails, because the user lookup cannot read the data", "It works with an empty user list", "Only the frontend breaks", "Nothing changes"], correct: "a",
      explanation: "The data layer reads config.dataFile on first use.",
      wrong: { b: "Reading a missing file throws.", c: "The API fails.", d: "The path is used on every lookup." } }),
    q({ id: "ceq24-4", atom: "a-ce-p-response", d: 3, prompt: "After a 401, how does the error message reach the screen?", options: ["request() throws, handleSubmit catches it and calls setError, which shows the alert", "The server writes it into the HTML", "The browser shows it automatically", "It does not reach the screen"], correct: "a",
      explanation: "The return path, link by link.",
      wrong: { b: "The API sends JSON only.", c: "fetch does not display errors.", d: "It does." } }),
    q({ id: "ceq24-5", atom: "a-ce-p-writeup", d: 2, prompt: "What makes a trace write-up checkable?", options: ["Each hop names a file, line and function, in order, both ways", "It is long", "It was written by AI", "It includes screenshots"], correct: "a",
      explanation: "Anyone can open each location and verify it.",
      wrong: { b: "Length is not precision.", c: "Authorship does not make it checkable.", d: "Screenshots show the surface only." } }),
  ]),
};
