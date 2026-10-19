/**
 * ASSESSMENTS · RESPONSIVE WEB DEVELOPMENT · MODULE 31 · SECURITY AND MAINTENANCE
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Never import this from anything under src/.
 * ═════════════════════════════════════════════════════════════════════════
 */

import { q, check } from "./wd-helpers.js";

export const ASSESSMENTS = {
  ...check("wd-l145-xss", [
    q({ id: "wdq145-1", atom: "a-wd-client-vs-server", d: 2, prompt: "Which job must always be done on the server?", options: ["Calculating the price to charge", "Showing a friendly form error", "Opening a menu", "Formatting a date for display"], correct: "a",
      explanation: "Anything trusted belongs on the server; the visitor controls the browser.",
      wrong: { b: "A browser convenience (the server validates again).", c: "Presentation.", d: "Presentation." } }),
    q({ id: "wdq145-2", atom: "a-wd-client-vs-server", d: 3, type: "scenario", prompt: "An admin-only Delete button is hidden with CSS for normal users. Is the delete action protected?", options: ["No: anyone can send the delete request; the server must refuse it", "Yes: hidden buttons cannot be pressed", "Yes, if the CSS is minified", "Yes, on HTTPS"], correct: "a",
      explanation: "Hiding is tidiness, not security.",
      wrong: { b: "DevTools or a direct request bypass it.", c: "Minifying hides nothing.", d: "HTTPS encrypts; it does not authorize." } }),
    q({ id: "wdq145-3", atom: "a-wd-xss", d: 2, prompt: "What is cross-site scripting (XSS)?", options: ["An attacker's code running on your page in other visitors' browsers", "Styling across sites", "Loading scripts from a CDN", "A slow script"], correct: "a",
      explanation: "Usually through data inserted as HTML.",
      wrong: { b: "Unrelated.", c: "A normal practice.", d: "That is performance." } }),
    q({ id: "wdq145-4", atom: "a-wd-safe-dom", d: 2, prompt: "Which line safely shows a visitor's comment?", options: ["p.textContent = comment;", "p.innerHTML = comment;", "p.outerHTML = comment;", "document.write(comment);"], correct: "a",
      explanation: "textContent never parses HTML.",
      wrong: { b: "Parses the comment as HTML.", c: "Also parses HTML.", d: "Also parses HTML." } }),
    q({ id: "wdq145-5", atom: "a-wd-safe-dom", d: 3, prompt: "A blog must display formatted HTML from its CMS. What is the safe approach?", options: ["Sanitise it with a library such as DOMPurify before inserting it", "Insert it with innerHTML as-is", "Put it in an onclick attribute", "Run it with eval"], correct: "a",
      explanation: "The sanitiser removes scripts and event attributes.",
      wrong: { b: "Any script in it would run.", c: "Runs as code.", d: "Runs as code." } }),
  ]),

  ...check("wd-l146-validation-https-secrets", [
    q({ id: "wdq146-1", atom: "a-wd-frontend-validation-limits", d: 2, prompt: "Why must the server validate input that the form already checks?", options: ["Anyone can bypass the browser and send any values", "Browsers validate incorrectly", "It makes forms faster", "It is only needed for passwords"], correct: "a",
      explanation: "Frontend validation is for the visitor's convenience.",
      wrong: { b: "Browser validation works; it is just optional for an attacker.", c: "It adds a step.", d: "Every input." } }),
    q({ id: "wdq146-2", atom: "a-wd-https-connections", d: 2, prompt: "What is mixed content?", options: ["An http:// resource loaded by an HTTPS page", "Images and text together", "CSS inside HTML", "Two fonts on one page"], correct: "a",
      explanation: "Browsers block or warn about it.",
      wrong: { b: "Normal.", c: "Unrelated.", d: "Unrelated." } }),
    q({ id: "wdq146-3", atom: "a-wd-dependency-updates", d: 2, prompt: "Which command lists known vulnerabilities in your installed packages?", options: ["npm audit", "npm outdated", "npm run build", "npm init"], correct: "a",
      explanation: "npm audit fix applies compatible fixes.",
      wrong: { b: "Lists newer versions, not vulnerabilities.", c: "Builds the site.", d: "Creates package.json." } }),
    q({ id: "wdq146-4", atom: "a-wd-protect-credentials", d: 3, type: "scenario", prompt: "A Paystack secret key is in VITE_PAYSTACK_SECRET, used by the frontend. What is wrong?", options: ["VITE_ variables are in the public bundle; the secret must stay on a server", "Nothing, .env files are private", "The name should not start with VITE_ for style", "Paystack does not use keys"], correct: "a",
      explanation: "Rotate the key and move the call to your own server.",
      wrong: { b: "The value is built into the downloaded JavaScript.", c: "The issue is exposure, not naming.", d: "It does." } }),
    q({ id: "wdq146-5", atom: "a-wd-protect-credentials", d: 2, prompt: "A secret key was committed to GitHub last week and then deleted. What must you do?", options: ["Rotate it: issue a new key and revoke the old one", "Nothing, it was deleted", "Make the repository private and keep the key", "Rename the file"], correct: "a",
      explanation: "It remains in the Git history and may already be copied.",
      wrong: { b: "History keeps it.", c: "It may already be copied.", d: "History keeps it." } }),
  ]),

  ...check("wd-l147-auth", [
    q({ id: "wdq147-1", atom: "a-wd-authentication", d: 2, prompt: "How should a login form send the password?", options: ["Once, in the body of a POST request over HTTPS", "In the URL as a query parameter", "Saved in localStorage for next time", "In a cookie set by JavaScript"], correct: "a",
      explanation: "URLs end up in logs and history.",
      wrong: { b: "Leaks into logs and history.", c: "Readable by any script on the page.", d: "Never store the password." } }),
    q({ id: "wdq147-2", atom: "a-wd-authentication", d: 3, prompt: "Why are HttpOnly session cookies safer?", options: ["JavaScript cannot read them, so XSS cannot steal the session", "They never expire", "They are faster", "They work without HTTPS"], correct: "a",
      explanation: "Add Secure and SameSite too.",
      wrong: { b: "Unrelated.", c: "Unrelated.", d: "Secure requires HTTPS." } }),
    q({ id: "wdq147-3", atom: "a-wd-authorization", d: 2, prompt: "A signed-in editor requests admin data. Which status should the server return?", options: ["403 Forbidden", "401 Unauthorized", "200 OK", "404 Not Found"], correct: "a",
      explanation: "Known user, not allowed.",
      wrong: { b: "401 means not signed in.", c: "That would leak the data.", d: "Means it does not exist." } }),
    q({ id: "wdq147-4", atom: "a-wd-security-mistakes", d: 3, type: "scenario", prompt: "The page shows the admin panel when localStorage.isAdmin is \"true\". What can an attacker do?", options: ["Set it themselves in DevTools; if the data is in the frontend, they see it", "Nothing, localStorage is encrypted", "Only read it on their own computer, which is safe", "Nothing on HTTPS"], correct: "a",
      explanation: "Access must be decided by the server, and admin data must never be in the frontend.",
      wrong: { b: "It is plain text.", c: "That is exactly the leak.", d: "HTTPS does not stop the visitor editing their own browser." } }),
  ]),

  ...check("wd-l148-live-maintenance", [
    q({ id: "wdq148-1", atom: "a-wd-debug-live", d: 2, prompt: "What usually causes bugs that appear only on the live site?", options: ["Real data, services or build differences that local testing never had", "The domain name", "The colour scheme", "Too many comments"], correct: "a",
      explanation: "Missing fields, outages and build-only paths.",
      wrong: { b: "Rarely.", c: "Not a cause of errors.", d: "Comments are stripped." } }),
    q({ id: "wdq148-2", atom: "a-wd-debug-live", d: 3, prompt: "Why use an error-tracking service such as Sentry?", options: ["It reports errors from visitors' browsers so you know before customers complain", "It fixes bugs automatically", "It speeds up the site", "It replaces testing"], correct: "a",
      explanation: "You cannot see visitors' consoles otherwise.",
      wrong: { b: "It reports; you fix.", c: "Unrelated.", d: "It complements tests." } }),
    q({ id: "wdq148-3", atom: "a-wd-maintenance-docs", d: 2, prompt: "What does a CHANGELOG record?", options: ["Each release's version, date and what changed", "Every keystroke", "The passwords used", "Visitors' names"], correct: "a",
      explanation: "A history people can read.",
      wrong: { b: "Git records commits; a changelog summarises releases.", c: "Never.", d: "No." } }),
    q({ id: "wdq148-4", atom: "a-wd-maintenance-docs", d: 2, prompt: "Which belongs in a project's README?", options: ["How to run, build and deploy it, and which environment variables it needs", "The secret keys", "The full Git history", "Unrelated personal notes"], correct: "a",
      explanation: "Enough for the next developer to start.",
      wrong: { b: "Never in a repository.", c: "Git already has it.", d: "Keep it focused." } }),
  ]),
};
