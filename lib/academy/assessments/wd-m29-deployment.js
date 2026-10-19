/**
 * ASSESSMENTS · RESPONSIVE WEB DEVELOPMENT · MODULE 29 · DEPLOYMENT AND HOSTING
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Never import this from anything under src/.
 * ═════════════════════════════════════════════════════════════════════════
 */

import { q, check } from "./wd-helpers.js";

export const ASSESSMENTS = {
  ...check("wd-l137-production-build", [
    q({ id: "wdq137-1", atom: "a-wd-dev-vs-prod", d: 2, prompt: "Which is true of production but not development?", options: ["It serves the optimised build over HTTPS to the public", "It reloads the page on every save", "It shows full error details to visitors", "It runs on localhost"], correct: "a",
      explanation: "Production is the built site, served publicly.",
      wrong: { b: "That is the dev server.", c: "Production logs errors and shows friendly messages.", d: "localhost is your own computer." } }),
    q({ id: "wdq137-2", atom: "a-wd-dev-vs-prod", d: 2, prompt: "Why should you never edit the live site directly?", options: ["Changes must flow develop → commit → build → deploy, or they are lost and untracked", "Hosts charge for edits", "It is illegal", "Browsers block it"], correct: "a",
      explanation: "The next deploy would overwrite them, and nothing records them.",
      wrong: { b: "Not the reason.", c: "It is a practice rule, not a law.", d: "Unrelated." } }),
    q({ id: "wdq137-3", atom: "a-wd-production-bundle", d: 2, prompt: "Where does npm run build put the production site in a Vite project?", options: ["dist", "src", "public", "node_modules"], correct: "a",
      explanation: "dist is the folder you deploy.",
      wrong: { b: "Your source.", c: "Static files copied into the build.", d: "Installed packages." } }),
    q({ id: "wdq137-4", atom: "a-wd-production-bundle", d: 3, prompt: "Why run npm run preview before deploying?", options: ["Some bugs, such as wrong paths or missing variables, only appear in the built site", "It deploys the site", "It speeds up the host", "It is required by GitHub"], correct: "a",
      explanation: "preview serves dist exactly as a host would.",
      wrong: { b: "It only serves locally.", c: "Unrelated.", d: "Unrelated." } }),
  ]),

  ...check("wd-l138-hosting", [
    q({ id: "wdq138-1", atom: "a-wd-hosting", d: 2, prompt: "What does a CDN do for a static site?", options: ["Serves copies of the files from data centres near each visitor", "Writes your HTML", "Hosts your database", "Removes the need for HTML"], correct: "a",
      explanation: "Shorter distance, faster pages.",
      wrong: { b: "It serves files you wrote.", c: "That is a server or database service.", d: "No." } }),
    q({ id: "wdq138-2", atom: "a-wd-static-deploy", d: 2, prompt: "Which folder is deployed for a Vite project?", options: ["dist, after npm run build", "src", "node_modules", "The whole project including node_modules"], correct: "a",
      explanation: "The built output is the site.",
      wrong: { b: "Source needs building.", c: "Tooling, not the site.", d: "Far too much, and the source cannot run directly." } }),
    q({ id: "wdq138-3", atom: "a-wd-vercel-netlify", d: 2, prompt: "Which settings does a host need to build a Vite project from GitHub?", options: ["Build command npm run build and output directory dist", "Your GitHub password", "The CSS file", "A server IP address"], correct: "a",
      explanation: "How to build, and where the result is.",
      wrong: { b: "Authorisation is handled by GitHub login.", c: "Unrelated.", d: "The host provides that." } }),
    q({ id: "wdq138-4", atom: "a-wd-vercel-netlify", d: 3, type: "scenario", prompt: "A site works locally but the deployed one cannot read import.meta.env.VITE_API_URL. Why?", options: ["The variable is in your local .env, which is not in Git; add it in the host's environment settings", "Hosts cannot read environment variables", "VITE_ variables are secret", "The variable name is too long"], correct: "a",
      explanation: "Set it in the host's dashboard.",
      wrong: { b: "They can.", c: "They are public.", d: "Not a limit." } }),
  ]),

  ...check("wd-l139-github-dns-https", [
    q({ id: "wdq139-1", atom: "a-wd-auto-deploys", d: 2, prompt: "What triggers a production deploy in a GitHub-connected workflow?", options: ["A push or merge to the production branch, usually main", "Opening the dashboard", "Running npm run dev", "Every save in VS Code"], correct: "a",
      explanation: "main is the live site.",
      wrong: { b: "No.", c: "That is local.", d: "Saving does not push." } }),
    q({ id: "wdq139-2", atom: "a-wd-auto-deploys", d: 2, prompt: "What is a preview deployment?", options: ["A temporary deploy of a branch or pull request, for checking before it goes live", "The production site", "A screenshot", "A backup of the database"], correct: "a",
      explanation: "Review changes safely.",
      wrong: { b: "Previews are separate from production.", c: "It is a real working site.", d: "Unrelated." } }),
    q({ id: "wdq139-3", atom: "a-wd-dns", d: 3, prompt: "Which DNS record points www.bisibakery.ng at your-site.netlify.app?", options: ["CNAME", "A", "MX", "TXT"], correct: "a",
      explanation: "A CNAME points a name at another name.",
      wrong: { b: "A points at an IP address.", c: "MX is for email.", d: "TXT holds text such as verification codes." } }),
    q({ id: "wdq139-4", atom: "a-wd-https", d: 2, prompt: "How do modern static hosts provide HTTPS?", options: ["They issue and renew a free certificate automatically once DNS points at them", "You must buy and upload one every month", "HTTPS is not available for static sites", "Visitors install it"], correct: "a",
      explanation: "Usually through Let's Encrypt.",
      wrong: { b: "Automatic on modern hosts.", c: "It is standard.", d: "No." } }),
  ]),

  ...check("wd-l140-config-failures-updates", [
    q({ id: "wdq140-1", atom: "a-wd-env-config", d: 2, prompt: "How should an API's address differ between local and production?", options: ["Through an environment variable set per environment, with the same code", "By editing the code before each deploy", "By committing .env", "It cannot differ"], correct: "a",
      explanation: "Configuration changes; code does not.",
      wrong: { b: "Error-prone.", c: ".env stays out of Git.", d: "It can and usually does." } }),
    q({ id: "wdq140-2", atom: "a-wd-build-failures", d: 2, prompt: "A deploy fails. What happens to the live site?", options: ["It keeps serving the last successful deploy", "It goes offline", "It shows the error to visitors", "It is deleted"], correct: "a",
      explanation: "Failed builds are never published.",
      wrong: { b: "The previous version stays up.", c: "Visitors see the old site.", d: "Nothing is deleted." } }),
    q({ id: "wdq140-3", atom: "a-wd-build-failures", d: 3, type: "scenario", prompt: "A build passes on your Windows laptop but fails on the host with \"Could not resolve './Format.js'\". The file is format.js. Why?", options: ["The host's file system is case-sensitive, so Format.js and format.js differ", "The host has no JavaScript", "The file is too big", "Windows deleted it"], correct: "a",
      explanation: "Match the import's case to the file name exactly.",
      wrong: { b: "It builds JavaScript.", c: "Size is not the issue.", d: "It exists locally." } }),
    q({ id: "wdq140-4", atom: "a-wd-updating-site", d: 2, prompt: "A deploy breaks the checkout. What is the fastest safe first step?", options: ["Roll back to the previous deploy", "Edit the server files", "Delete the site", "Wait for customers to stop complaining"], correct: "a",
      explanation: "Restore a working site, then fix calmly.",
      wrong: { b: "Not possible, and overwritten later.", c: "Breaks everything.", d: "Loses sales." } }),
  ]),
};
