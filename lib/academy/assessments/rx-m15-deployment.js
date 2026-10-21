/**
 * ASSESSMENTS · REACT DEVELOPMENT · MODULE 15 · DEPLOYMENT, GIT AND PROFESSIONAL WORKFLOWS
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Never import this from anything under src/.
 * ═════════════════════════════════════════════════════════════════════════
 */

import { q, check } from "./rx-helpers.js";

export const ASSESSMENTS = {
  ...check("rx-l87-git", [
    q({ id: "rxq87-1", atom: "a-rx-git-branches", d: 2, prompt: "Where should a new feature be developed?", options: ["On its own short-lived branch, merged through a pull request", "Directly on main", "On a teammate's branch", "In a copy of the folder"], correct: "a",
      explanation: "main stays releasable.",
      wrong: { b: "Unreviewed changes reach production.", c: "Mixes unrelated work.", d: "Not version control." } }),
    q({ id: "rxq87-2", atom: "a-rx-git-branches", d: 2, prompt: "What does a merge conflict mean?", options: ["Both branches changed the same lines; you decide the final version", "Git is broken", "The branch must be deleted", "The tests failed"], correct: "a",
      explanation: "Edit, git add, commit.",
      wrong: { b: "Normal in teamwork.", c: "Resolve it instead.", d: "Unrelated." } }),
    q({ id: "rxq87-3", atom: "a-rx-pull-requests", d: 2, prompt: "What makes a pull request easy to review?", options: ["It is small, does one thing, and explains what, why and how it was tested", "It changes as much as possible at once", "It has no description", "It skips CI"], correct: "a",
      explanation: "Small and explained.",
      wrong: { b: "Large PRs hide bugs.", c: "Reviewers must guess.", d: "CI is part of review." } }),
    q({ id: "rxq87-4", atom: "a-rx-commit-messages", d: 2, prompt: "Which commit subject follows good practice?", options: ["Fix cart total when a coupon applies", "fixed stuff", "changes", "Updated files"], correct: "a",
      explanation: "Imperative, specific.",
      wrong: { b: "Says nothing.", c: "Says nothing.", d: "Git already knows files changed." } }),
  ]),

  ...check("rx-l88-package-config", [
    q({ id: "rxq88-1", atom: "a-rx-deps-scripts", d: 2, prompt: "Where does vitest belong in package.json?", options: ["devDependencies", "dependencies", "scripts", "Nowhere"], correct: "a",
      explanation: "It is only used to test, not at runtime.",
      wrong: { b: "Not needed by the running app.", c: "Scripts are commands.", d: "It must be listed to be installed." } }),
    q({ id: "rxq88-2", atom: "a-rx-deps-scripts", d: 3, prompt: "Why commit package-lock.json?", options: ["It records the exact versions installed, so every machine and CI get the same ones", "npm requires it on GitHub", "It contains secrets", "It makes the app faster"], correct: "a",
      explanation: "Reproducible installs with npm ci.",
      wrong: { b: "Not required, but essential.", c: "It must not.", d: "Unrelated." } }),
    q({ id: "rxq88-3", atom: "a-rx-env-config", d: 2, prompt: "Which env file should be committed?", options: [".env.example, with placeholder values", ".env.local", ".env with real secrets", "None ever"], correct: "a",
      explanation: "It documents what to configure.",
      wrong: { b: "Personal and ignored.", c: "Never commit secrets.", d: "The example belongs in the repository." } }),
    q({ id: "rxq88-4", atom: "a-rx-env-config", d: 2, prompt: "Which file does Vite use for npm run build?", options: [".env.production (after .env)", ".env.development", ".env.test only", "None"], correct: "a",
      explanation: "The mode decides the file.",
      wrong: { b: "That is for npm run dev.", c: "Only in test mode.", d: "It loads them." } }),
  ]),

  ...check("rx-l89-hosting", [
    q({ id: "rxq89-1", atom: "a-rx-deploy", d: 2, prompt: "What does a preview deployment give a pull request?", options: ["Its own live URL to try the change before merging", "A production release", "A backup of the database", "A faster build"], correct: "a",
      explanation: "Reviewers can test it for real.",
      wrong: { b: "Production comes from main.", c: "Unrelated.", d: "Unrelated." } }),
    q({ id: "rxq89-2", atom: "a-rx-domains-https", d: 2, prompt: "What connects your custom domain to the host?", options: ["DNS records at the domain registrar", "A setting in vite.config.js", "A meta tag in index.html", "A React component"], correct: "a",
      explanation: "Usually a CNAME or A record.",
      wrong: { b: "The build does not know the domain.", c: "Unrelated.", d: "Unrelated." } }),
    q({ id: "rxq89-3", atom: "a-rx-hosting-env", d: 3, prompt: "You change VITE_API_URL in the host's settings. When does the live site use it?", options: ["After the next build and deploy", "Immediately", "After users clear their cache", "Never"], correct: "a",
      explanation: "Vite inlines it at build time.",
      wrong: { b: "The old bundle still has the old value.", c: "The bundle itself must change.", d: "After a rebuild." } }),
    q({ id: "rxq89-4", atom: "a-rx-spa-rewrites", d: 3, prompt: "Refreshing /courses/react on a static host gives 404, but clicking to it works. Why?", options: ["The server has no file at that path; a rewrite must serve index.html", "React Router is broken", "The course was deleted", "HTTPS is missing"], correct: "a",
      explanation: "Client routing needs a server rewrite.",
      wrong: { b: "It works once index.html loads.", c: "Clicking works, so it exists.", d: "Unrelated." } }),
  ]),

  ...check("rx-l90-cicd-monitoring", [
    q({ id: "rxq90-1", atom: "a-rx-cicd", d: 2, prompt: "In GitHub Actions, how does a deploy job wait for the checks?", options: ["needs: check", "It runs first", "depends: tests", "It cannot"], correct: "a",
      explanation: "It only starts when check succeeds.",
      wrong: { b: "Then broken code could deploy.", c: "Not the keyword.", d: "needs does it." } }),
    q({ id: "rxq90-2", atom: "a-rx-cicd", d: 2, prompt: "Where does a deploy token belong?", options: ["In repository secrets, used as ${{ secrets.NAME }}", "In the workflow file", "In README.md", "In a VITE_ variable"], correct: "a",
      explanation: "Never commit credentials.",
      wrong: { b: "Anyone with read access sees it.", c: "Public.", d: "Shipped to every visitor." } }),
    q({ id: "rxq90-3", atom: "a-rx-monitoring", d: 2, prompt: "Why upload source maps to an error-monitoring service?", options: ["So minified stack traces can be shown as your original code", "To make the site faster", "To hide the code", "They are required to deploy"], correct: "a",
      explanation: "Readable stack traces from production.",
      wrong: { b: "Unrelated.", c: "The opposite.", d: "Optional." } }),
    q({ id: "rxq90-4", atom: "a-rx-monitoring", d: 3, prompt: "Which errors does window.addEventListener(\"unhandledrejection\") catch?", options: ["Promises that reject without a catch", "Render errors inside an error boundary", "CSS errors", "Server crashes"], correct: "a",
      explanation: "Pair it with the error event.",
      wrong: { b: "Boundaries handle those.", c: "Unrelated.", d: "Those are on the server." } }),
  ]),

  ...check("rx-l91-teamwork", [
    q({ id: "rxq91-1", atom: "a-rx-readme", d: 2, prompt: "What is the best test of a README?", options: ["Follow it yourself on a clean machine and see where you get stuck", "Make it long", "Add badges", "Ask if it looks nice"], correct: "a",
      explanation: "Every missing step shows up.",
      wrong: { b: "Length is not clarity.", c: "Decoration.", d: "Not a test." } }),
    q({ id: "rxq91-2", atom: "a-rx-code-review", d: 2, prompt: "Which review comment is most useful?", options: ["\"What happens if the list is empty? An empty state might be needed here.\"", "\"Bad code.\"", "\"Rewrite this.\"", "No comment, just approve"], correct: "a",
      explanation: "Specific, kind, actionable.",
      wrong: { b: "Vague and personal.", c: "No direction.", d: "Misses the gap." } }),
    q({ id: "rxq91-3", atom: "a-rx-code-review", d: 2, prompt: "What does \"nit:\" in a review comment signal?", options: ["A minor, optional suggestion", "A blocking bug", "A security issue", "Approval"], correct: "a",
      explanation: "Separate must-fix from nice-to-have.",
      wrong: { b: "Those are not nits.", c: "Never a nit.", d: "It is a comment." } }),
    q({ id: "rxq91-4", atom: "a-rx-portfolio", d: 2, prompt: "What makes a portfolio project convincing?", options: ["It is deployed, has readable source and explains your technical decisions", "It copies a popular tutorial", "It has many features nobody can try", "It is private"], correct: "a",
      explanation: "Evidence and reasoning.",
      wrong: { b: "Employers recognise tutorials.", c: "Unverifiable.", d: "Nobody can see it." } }),
  ]),

  ...check("rx-l92-m15-project", [
    q({ id: "rxq92-1", atom: "a-rx-m15-project", d: 2, prompt: "Which file makes deep links work on Vercel?", options: ["vercel.json with an SPA rewrite to /index.html", "package.json", ".gitignore", "README.md"], correct: "a",
      explanation: "The rewrite hands every path to the router.",
      wrong: { b: "Scripts and dependencies.", c: "Git only.", d: "Documentation." } }),
    q({ id: "rxq92-2", atom: "a-rx-m15-project", d: 3, prompt: "A reviewer clones the repo and npm run dev fails because VITE_API_URL is missing. What would have prevented it?", options: ["A committed .env.example and a README step copying it to .env.local", "Committing .env.local", "Hard-coding the URL", "Deleting the variable"], correct: "a",
      explanation: "Document configuration without committing secrets.",
      wrong: { b: "Personal files should not be committed.", c: "Breaks per-environment config.", d: "The app needs it." } }),
    q({ id: "rxq92-3", atom: "a-rx-m15-project", d: 2, prompt: "What should CI run before a change can merge?", options: ["Install with npm ci, lint, test and build", "Only the build", "Nothing", "Only a deploy"], correct: "a",
      explanation: "Every check, on a clean machine.",
      wrong: { b: "Misses lint and test failures.", c: "No protection.", d: "Deploying untested code." } }),
    q({ id: "rxq92-4", atom: "a-rx-m15-project", d: 2, prompt: "Where should the live site's VITE_API_URL be set?", options: ["In the host's environment settings, then redeploy", "In a committed .env.local", "Hard-coded in App.jsx", "In README.md"], correct: "a",
      explanation: "Configuration per environment, applied at build time.",
      wrong: { b: "Personal files stay out of Git.", c: "Breaks other environments.", d: "Documentation, not configuration." } }),
  ]),
};
