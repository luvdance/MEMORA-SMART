/**
 * REACT DEVELOPMENT · MODULE 15 · DEPLOYMENT, GIT AND PROFESSIONAL WORKFLOWS
 *
 * Curriculum 15.1 – 15.P. Git and GitHub, pull requests, commit messages and
 * documentation, dependencies and scripts, production configuration,
 * Vercel and Netlify, domains and HTTPS, hosting environment variables, SPA
 * rewrites, CI/CD, monitoring production errors, READMEs, code review and
 * teamwork, and presenting your work in a portfolio.
 *
 * Most of this module's practice is on the files a deployable project
 * really contains (package.json, vercel.json, Netlify's _redirects, .env
 * files, a CI workflow, a README, a pull request template, a decision
 * record). The checks parse those files as the tools would.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

import { reactLab } from "./rx-helpers.js";

export const SECTION_ID = "rx-s15-deployment";
const MODULE = "rx-m15-deployment";

const FILES_APP = (what) => `export default function App() {
  return <p>This lab checks ${what}.</p>;
}
`;

/** A lab about project files: the app itself is a read-only placeholder. */
function fileLab({ files, open, what = "your project files", ...rest }) {
  return reactLab({
    files: { ...files, "src/App.jsx": FILES_APP(what) },
    readOnly: ["src/App.jsx", ...(rest.readOnly || [])],
    open: open || Object.keys(files)[0],
    ...rest,
  });
}

const PACKAGE_JSON = `{
  "name": "memora-courses",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite"
  },
  "dependencies": {
    "react": "^19.2.4",
    "react-dom": "^19.2.4",
    "react-router": "^7.14.2",
    "vite": "^8.0.1"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^6.0.1",
    "eslint": "^9.39.4",
    "vitest": "^4.0.0"
  }
}
`;

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 87 · 15.1 – 15.3
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "rx-l87-git",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 1,
    covers: ["15.1", "15.2", "15.3"],
    title: "Git, GitHub and Pull Requests",
    subtitle: "Repositories, branches and merges, pull requests, and commit messages people can use",
    estimatedMinutes: 40,
    intro: "Professional code is written on branches, reviewed in pull requests and recorded in commits that explain themselves. This is the workflow almost every team uses.",

    atoms: [
      {
        id: "a-rx-git-branches",
        title: "Git repositories, commits, branches and merges",
        explain:
          "A BRANCH is a movable pointer to a line of commits. main holds working, releasable code; each change happens on its own short-lived branch: git switch -c feature/course-search, commit as you go, git push -u origin feature/course-search, open a pull request, merge when reviewed and green, delete the branch. MERGING combines branches; a CONFLICT means both changed the same lines, so you edit the file to the intended result, git add it and commit. git pull --rebase (or rebasing your branch on main) keeps history linear; never rewrite history others have already pulled.",
        example: "git switch main\ngit pull\ngit switch -c feature/course-search\n# … edit, then:\ngit add src/components/SearchBox.jsx\ngit commit -m \"Add course search box with debounced API query\"\ngit push -u origin feature/course-search\n# open a pull request on GitHub",
        decision: {
          scenario: "You are halfway through a new search feature when a production bug needs fixing urgently.",
          question: "What is the right Git workflow?",
          options: [
            { id: "a", text: "Commit (or stash) your work on the feature branch, switch to main, create a fix branch, fix, open a PR, then return to the feature", why: "Each change on its own branch keeps the fix small, reviewable and releasable without half-finished feature code." },
            { id: "b", text: "Fix the bug on the feature branch and merge everything", whyWrong: "Ships an unfinished feature with the fix, and makes both harder to review." },
            { id: "c", text: "Push the fix directly to main without review", whyWrong: "Urgent fixes are exactly when mistakes happen; review and CI still matter." },
            { id: "d", text: "Delete your feature branch and start again later", whyWrong: "Throws away work." },
          ],
          correct: "a",
          aftermath: "One change, one branch, one pull request.",
        },
      },
      {
        id: "a-rx-pull-requests",
        title: "GitHub workflows and pull requests",
        explain:
          "A PULL REQUEST (PR) proposes merging a branch, and is where review happens. A good PR is SMALL (a few hundred lines at most), does one thing, and has a description saying what changed, why, how it was tested, and screenshots for UI changes; it links the issue it closes (\"Closes #42\"). CI runs on it (Module 13). Branch protection on main can require approvals and passing checks. A pull request TEMPLATE (.github/pull_request_template.md) pre-fills the description so nobody forgets the testing notes.",
        webLab: fileLab({
          what: "your pull request template",
          task:
            "Write the repository's pull request template in .github/pull_request_template.md. It needs four sections as level-2 headings, in this order: \"## What changed\", \"## Why\", \"## How it was tested\" and \"## Screenshots\", and a checklist (Markdown task items \"- [ ]\") with at least these: tests added or updated; lint and tests pass locally; checked on a phone-width screen.",
          files: { ".github/pull_request_template.md": "" },
          tests: [
            { label: "The four sections, in order", check: "const t = raw('.github/pull_request_template.md'); const h = ['## What changed', '## Why', '## How it was tested', '## Screenshots'].map((s) => t.indexOf(s)); return h.every((i) => i > -1) && h.every((v, i, a) => i === 0 || v > a[i - 1]);", fail: "Four ## headings in that order." },
            { label: "A checklist of at least three items", check: "const items = raw('.github/pull_request_template.md').match(/^- \\[ \\] .+$/gm) || []; return items.length >= 3 && items.some((i) => /test/i.test(i)) && items.some((i) => /lint/i.test(i)) && items.some((i) => /phone|mobile/i.test(i));", fail: "- [ ] Tests added or updated (and so on)." },
          ],
          solution: {
            ".github/pull_request_template.md": `## What changed

## Why

Closes #

## How it was tested

## Screenshots

## Checklist

- [ ] Tests added or updated
- [ ] Lint and tests pass locally (npm run lint, npm test)
- [ ] Checked on a phone-width screen
- [ ] No secrets or console.log left in the code
`,
          },
          hint: "Task list items are written \"- [ ] text\" with a space inside the brackets.",
          successMessage: "Every pull request now starts with the questions a reviewer will ask.",
        }),
      },
      {
        id: "a-rx-commit-messages",
        title: "Writing useful commit messages and documentation",
        explain:
          "A commit message is a note to a future developer (often you) running git log or git blame. Subject line: under about 72 characters, in the imperative (\"Add\", \"Fix\", \"Remove\", as in \"this commit will…\"), saying WHAT changed; a blank line; then a body saying WHY, if it is not obvious. Many teams use Conventional Commits: feat(cart): add quantity stepper, fix(auth): keep draft after session expiry, docs: …, refactor: …, test: …, chore: …, which tools can turn into changelogs. Commit related changes together and unrelated ones separately. DOCUMENTATION belongs next to the code: the README, comments that explain why (not what), and decision records (Lesson 91).",
        decision: {
          scenario: "Your change fixes the cart total, which was wrong when a coupon and free delivery applied together.",
          question: "Which commit message is best?",
          options: [
            { id: "a", text: "fix(cart): apply coupon before checking the free-delivery threshold\n\nTotals over ₦30,000 only after a coupon were charged delivery.", why: "Says what changed and why, in a form someone searching history months later will understand." },
            { id: "b", text: "fixed stuff", whyWrong: "Tells nobody anything." },
            { id: "c", text: "Update Cart.jsx", whyWrong: "Git already records which file changed; the message should say what and why." },
            { id: "d", text: "WIP", whyWrong: "Fine locally, but should not be the message that reaches main." },
          ],
          correct: "a",
          aftermath: "Imperative subject, what changed; body, why.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 88 · 15.4 – 15.5
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "rx-l88-package-config",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 2,
    covers: ["15.4", "15.5"],
    title: "Dependencies, Scripts and Production Configuration",
    subtitle: "Managing package.json, and environment-specific builds",
    estimatedMinutes: 35,
    intro: "A project anyone can run starts with an honest package.json and configuration that differs between your laptop and production in exactly the ways it should.",

    atoms: [
      {
        id: "a-rx-deps-scripts",
        title: "Managing dependencies and package scripts",
        explain:
          "DEPENDENCIES are needed by the app at runtime (react, react-router); DEVDEPENDENCIES only build or check it (vite, vitest, eslint, typescript). Version ranges: ^19.2.4 allows minor and patch updates (19.x); package-lock.json records the exact versions installed, so commit it and use npm ci in CI. Keep dependencies few and maintained; check npm audit and update regularly (npm outdated, then upgrade with care and run the tests). SCRIPTS in package.json are the project's commands, so nobody has to remember flags: dev, build, preview, lint, test, and often format and typecheck.",
        webLab: fileLab({
          what: "your package.json",
          task:
            "Fix package.json. Vite is a build tool, so move it from dependencies to devDependencies (keep its version). Add the scripts every Vite project needs: \"build\": \"vite build\", \"preview\": \"vite preview\", \"lint\": \"eslint .\" and \"test\": \"vitest\". The file must stay valid JSON.",
          files: { "package.json": PACKAGE_JSON },
          tests: [
            { label: "Valid JSON", check: "try { JSON.parse(raw('package.json')); return true; } catch { return false; }", fail: "Check commas and quotes." },
            { label: "Vite is a devDependency", check: "const p = JSON.parse(raw('package.json')); return !p.dependencies.vite && p.devDependencies.vite === '^8.0.1' && p.dependencies.react === '^19.2.4';", fail: "Move \"vite\" into devDependencies." },
            { label: "The standard scripts", check: "const s = JSON.parse(raw('package.json')).scripts; return s.dev === 'vite' && s.build === 'vite build' && s.preview === 'vite preview' && s.lint === 'eslint .' && s.test === 'vitest';", fail: "Add build, preview, lint and test." },
          ],
          solution: {
            "package.json": `{
  "name": "memora-courses",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint .",
    "test": "vitest"
  },
  "dependencies": {
    "react": "^19.2.4",
    "react-dom": "^19.2.4",
    "react-router": "^7.14.2"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^6.0.1",
    "eslint": "^9.39.4",
    "vite": "^8.0.1",
    "vitest": "^4.0.0"
  }
}
`,
          },
          hint: "JSON allows no trailing commas and no comments.",
          successMessage: "A package.json that tells the truth about what runs and what builds.",
        }),
      },
      {
        id: "a-rx-env-config",
        title: "Production builds and environment-specific configuration",
        explain:
          "Vite loads .env, then .env.[mode] (development for npm run dev, production for npm run build), then .env.[mode].local, each overriding the previous. So the development API URL goes in .env.development, the production one in .env.production (or, better, in the host's settings), and anything personal in .env.local, which is git-ignored. Commit a .env.example listing every variable with placeholder values, so a new developer knows what to set. Remember: every VITE_ value ends up in the public bundle, so none of them may be secret.",
        webLab: fileLab({
          what: "your environment files",
          task:
            "Set up the environment files. .env.development: VITE_API_URL=http://localhost:3000/api. .env.production: VITE_API_URL=https://api.memora.ng. .env.example: lists VITE_API_URL and VITE_SENTRY_DSN with empty or placeholder values (no real values). .gitignore must ignore .env.local and *.local but NOT .env.example.",
          files: {
            ".env.development": "",
            ".env.production": "",
            ".env.example": "",
            ".gitignore": "node_modules\ndist\n",
          },
          tests: [
            { label: "Development and production API URLs", check: "return /^VITE_API_URL=http:\\/\\/localhost:3000\\/api\\s*$/m.test(raw('.env.development')) && /^VITE_API_URL=https:\\/\\/api\\.memora\\.ng\\s*$/m.test(raw('.env.production'));", fail: "One VITE_API_URL line in each file." },
            { label: ".env.example lists every variable without real values", check: "const e = raw('.env.example'); return /^VITE_API_URL=/m.test(e) && /^VITE_SENTRY_DSN=/m.test(e) && !/memora\\.ng|localhost/.test(e);", fail: "VITE_API_URL= and VITE_SENTRY_DSN= with placeholders." },
            { label: ".gitignore keeps local env files out, and the example in", check: "const g = raw('.gitignore'); return /^\\*\\.local$/m.test(g) && /^\\.env\\.local$/m.test(g) && !/^\\.env\\*?$/m.test(g) && !/\\.env\\.example/.test(g);", fail: "Add .env.local and *.local; do not ignore .env.example." },
          ],
          solution: {
            ".env.development": "VITE_API_URL=http://localhost:3000/api\n",
            ".env.production": "VITE_API_URL=https://api.memora.ng\n",
            ".env.example": "# Copy to .env.local and fill in. None of these may be secret: they are public.\nVITE_API_URL=\nVITE_SENTRY_DSN=\n",
            ".gitignore": "node_modules\ndist\n.env.local\n*.local\n",
          },
          hint: "A pattern like .env* would also ignore .env.example, which you want committed.",
          successMessage: "Right settings in each environment, and a newcomer knows what to configure.",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 89 · 15.6 – 15.9
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "rx-l89-hosting",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 3,
    covers: ["15.6", "15.7", "15.8", "15.9"],
    title: "Deploying to Vercel or Netlify",
    subtitle: "Deploying, custom domains and HTTPS, hosting environment variables, and SPA rewrites",
    estimatedMinutes: 45,
    intro: "Deploying a Vite app is a few clicks. Deploying it correctly means a custom domain, the right variables at build time, and every client-side route working on refresh.",

    atoms: [
      {
        id: "a-rx-deploy",
        title: "Deploying frontend applications to Vercel or Netlify",
        explain:
          "Both connect to your GitHub repository: import the project, confirm the build command (npm run build) and output directory (dist), and deploy. From then on every push to main deploys to production automatically, and every pull request gets its own PREVIEW DEPLOYMENT with a unique URL, so reviewers can try the change before it is merged. Each deploy is immutable, so rolling back is choosing an earlier deployment. Both offer serverless functions for small backends (where secrets can live). Other options: Cloudflare Pages, GitHub Pages, Firebase Hosting, or any static file server.",
        decision: {
          scenario: "A reviewer wants to try a pull request's new checkout page on their phone before approving it.",
          question: "What is the easiest way?",
          options: [
            { id: "a", text: "Open the PR's preview deployment URL that Vercel or Netlify posts on the pull request", why: "Every PR gets its own live, shareable build, separate from production." },
            { id: "b", text: "Merge it to main and test production", whyWrong: "Untested code reaches real users." },
            { id: "c", text: "Send them a zip of the dist folder", whyWrong: "Awkward, and they cannot open it on a phone." },
            { id: "d", text: "Run npm run dev on your laptop and share your IP address", whyWrong: "Insecure, unreliable, and a development build." },
          ],
          correct: "a",
          aftermath: "Production from main; a preview for every pull request.",
        },
      },
      {
        id: "a-rx-domains-https",
        title: "Configuring custom domains and HTTPS",
        explain:
          "Add the domain (academy.memora.ng) in the host's dashboard, then create the DNS records it asks for at your domain registrar: usually a CNAME record pointing a subdomain at the host (cname.vercel-dns.com), or an A record for the bare domain (memora.ng). DNS can take minutes to hours to propagate. The host then issues a free TLS certificate (Let's Encrypt) automatically, so the site is served over HTTPS; redirect HTTP to HTTPS and pick one canonical address (with or without www) and redirect the other to it. HTTPS is required for many browser features (geolocation, service workers, secure cookies).",
        decision: {
          scenario: "You added academy.memora.ng in Vercel, but visiting it shows \"This site can't be reached\".",
          question: "What is most likely missing?",
          options: [
            { id: "a", text: "The DNS record at the registrar (a CNAME for academy pointing to the host), or it has not propagated yet", why: "The host only serves the domain once DNS sends visitors to it." },
            { id: "b", text: "An HTTPS certificate you must buy", whyWrong: "The host issues one free, automatically, once DNS points to it." },
            { id: "c", text: "A change to vite.config.js", whyWrong: "The build does not know or care about the domain." },
            { id: "d", text: "A new React version", whyWrong: "Unrelated." },
          ],
          correct: "a",
          aftermath: "Domain in the host, DNS at the registrar, HTTPS automatic.",
        },
      },
      {
        id: "a-rx-hosting-env",
        title: "Environment variables in hosting platforms",
        explain:
          "Set VITE_ variables in the host's project settings (Vercel: Settings → Environment Variables; Netlify: Site configuration → Environment variables), separately for Production, Preview and Development, so preview deployments can use a staging API. Because Vite inlines them at BUILD time, changing one needs a REDEPLOY. Server-side secrets for serverless functions are set the same way but WITHOUT the VITE_ prefix, so they never reach the bundle. vercel env pull or netlify env:list let you sync them to a local .env.local.",
        decision: {
          scenario: "Preview deployments of pull requests are creating real orders in the production database.",
          question: "What is the right fix?",
          options: [
            { id: "a", text: "Give the Preview environment its own VITE_API_URL pointing to a staging API, and redeploy", why: "Hosts let each environment have its own values; previews should never touch production data." },
            { id: "b", text: "Stop using preview deployments", whyWrong: "Throws away a valuable review tool; separate the environments instead." },
            { id: "c", text: "Hard-code the staging URL in the code", whyWrong: "Production would then use staging too." },
            { id: "d", text: "Ask reviewers not to place orders", whyWrong: "Relies on everyone remembering, every time." },
          ],
          correct: "a",
          aftermath: "One set of variables per environment, and a rebuild after changing them.",
        },
      },
      {
        id: "a-rx-spa-rewrites",
        title: "Configuring SPA rewrites for client-side routing",
        explain:
          "Your app has one real file, index.html, and React Router handles /courses/react in the browser. But when someone opens or REFRESHES that URL, the browser asks the SERVER for /courses/react, and a static host finds no such file: 404. The fix is a REWRITE: serve index.html for every path that is not a real file, and let the router take over. Vercel: vercel.json with { \"rewrites\": [{ \"source\": \"/(.*)\", \"destination\": \"/index.html\" }] }. Netlify: a public/_redirects file with /*  /index.html  200 (200 makes it a rewrite, not a redirect). Real files (your JS and CSS assets) are still served as they are.",
        webLab: fileLab({
          what: "your hosting configuration",
          task:
            "Make deep links work on both hosts. In vercel.json, add a rewrites array that sends every path (\"/(.*)\") to \"/index.html\". In public/_redirects (Netlify), add the single rule that rewrites everything to /index.html with status 200.",
          files: {
            "vercel.json": "{\n}\n",
            "public/_redirects": "",
          },
          tests: [
            { label: "vercel.json rewrites every path to index.html", check: "let j; try { j = JSON.parse(raw('vercel.json')); } catch { return false; } return Array.isArray(j.rewrites) && j.rewrites.some((r) => r.source === '/(.*)' && r.destination === '/index.html');", fail: "{ \"rewrites\": [{ \"source\": \"/(.*)\", \"destination\": \"/index.html\" }] }" },
            { label: "Netlify's _redirects rewrites with 200", check: "return /^\\/\\*\\s+\\/index\\.html\\s+200\\s*$/m.test(raw('public/_redirects'));", fail: "/*    /index.html   200" },
          ],
          solution: {
            "vercel.json": "{\n  \"rewrites\": [{ \"source\": \"/(.*)\", \"destination\": \"/index.html\" }]\n}\n",
            "public/_redirects": "/*    /index.html   200\n",
          },
          hint: "Files in Vite's public/ folder are copied to dist/ as they are, which is where Netlify looks for _redirects.",
          successMessage: "Refresh any page, open any shared link: the router gets it every time.",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 90 · 15.10 – 15.11
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "rx-l90-cicd-monitoring",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 4,
    covers: ["15.10", "15.11"],
    title: "CI/CD and Monitoring Production",
    subtitle: "Automated delivery, and finding out about errors before users report them",
    estimatedMinutes: 40,
    intro: "Continuous integration checks every change; continuous delivery ships the ones that pass. Monitoring tells you what happens after that.",

    atoms: [
      {
        id: "a-rx-cicd",
        title: "CI/CD fundamentals",
        explain:
          "CI (Module 13) checks each change. CD (continuous DELIVERY or DEPLOYMENT) releases it automatically once checks pass: merge to main → CI passes → deploy to production. With Vercel or Netlify, the host does the deploy step for you; with other hosts, a CI job does it, usually needing the check job to pass first (needs: check in GitHub Actions) and running only on main. Good CD is boring: small changes, shipped often, easy to roll back, with secrets (deploy tokens) stored as repository secrets (${{ secrets.DEPLOY_TOKEN }}), never in the workflow file.",
        webLab: fileLab({
          what: "your CI/CD workflow",
          task:
            "Extend the workflow with a deploy job. It must run only after the check job succeeds (needs: check), only for pushes to main (if: github.ref == 'refs/heads/main' && github.event_name == 'push'), on ubuntu-latest; check out the code, then run \"npx vercel deploy --prod --token=${{ secrets.VERCEL_TOKEN }}\". The token must come from secrets, never written in the file.",
          files: {
            ".github/workflows/ci.yml": `name: CI

on:
  pull_request:
  push:
    branches: [main]

jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - run: npm run lint
      - run: npm test -- --run
      - run: npm run build
`,
          },
          tests: [
            { label: "A deploy job that needs check", check: "const y = raw('.github/workflows/ci.yml'); const d = y.slice(y.indexOf('deploy:')); return y.includes('\\n  deploy:') && /needs:\\s*\\[?\\s*check\\s*\\]?/.test(d) && /runs-on:\\s*ubuntu-latest/.test(d);", fail: "  deploy:\n    needs: check\n    runs-on: ubuntu-latest" },
            { label: "Only for pushes to main", check: "const d = raw('.github/workflows/ci.yml').split('\\n  deploy:')[1] || ''; return /if:\\s*github\\.ref\\s*==\\s*'refs\\/heads\\/main'\\s*&&\\s*github\\.event_name\\s*==\\s*'push'/.test(d);", fail: "if: github.ref == 'refs/heads/main' && github.event_name == 'push'" },
            { label: "Deploys with the token from secrets", check: "const d = raw('.github/workflows/ci.yml').split('\\n  deploy:')[1] || ''; return /uses:\\s*actions\\/checkout@v4/.test(d) && /npx vercel deploy --prod --token=\\$\\{\\{\\s*secrets\\.VERCEL_TOKEN\\s*\\}\\}/.test(d);", fail: "--token=${{ secrets.VERCEL_TOKEN }}" },
          ],
          solution: {
            ".github/workflows/ci.yml": `name: CI

on:
  pull_request:
  push:
    branches: [main]

jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - run: npm run lint
      - run: npm test -- --run
      - run: npm run build

  deploy:
    needs: check
    if: github.ref == 'refs/heads/main' && github.event_name == 'push'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npx vercel deploy --prod --token=\${{ secrets.VERCEL_TOKEN }}
`,
          },
          hint: "Jobs sit two spaces in under jobs:, at the same level as check.",
          successMessage: "Checked on every change, shipped automatically when main is green.",
        }),
      },
      {
        id: "a-rx-monitoring",
        title: "Monitoring errors and debugging production issues",
        explain:
          "In production you cannot see users' consoles. An ERROR MONITORING service (Sentry, LogRocket, Bugsnag, or your own endpoint) collects uncaught errors and unhandled promise rejections, with the stack trace (de-minified using SOURCE MAPS uploaded at build time), the browser, the URL and the release version; error boundaries report what they catch too. Then: triage by how many users are affected, reproduce with the details, fix, and confirm the error stops in the next release. Never send personal data or tokens in error reports, and pair errors with simple uptime and Web Vitals monitoring.",
        webLab: reactLab({
          task:
            "Write src/monitoring.js: installMonitoring() listens for window \"error\" and \"unhandledrejection\" events and reports each to POST /api/errors as JSON { message, url: location.pathname, release } (release is the RELEASE constant). main.jsx already calls it. The Break button throws in a click handler, which an error boundary cannot catch, so only this handler sees it.",
          files: {
            "src/monitoring.js": `export const RELEASE = "2026.10.21";

export function installMonitoring() {
  // report window errors and unhandled rejections here
}
`,
            "src/main.jsx": `import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { installMonitoring } from "./monitoring.js";
import "./index.css";

installMonitoring();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
`,
            "src/App.jsx": `export default function App() {
  return (
    <>
      <button
        onClick={() => {
          throw new Error("Checkout total is NaN");
        }}
      >
        Break
      </button>
      <button onClick={() => Promise.reject(new Error("Payment API timed out"))}>Reject</button>
    </>
  );
}
`,
          },
          readOnly: ["src/main.jsx", "src/App.jsx"],
          allowErrors: true,
          mocks: [{ match: "/api/errors", method: "POST", status: 204, delay: 10 }],
          tests: [
            { label: "Uncaught errors are reported", check: "setTimeout(() => $$('button')[0].click(), 0); await waitFor(() => fetchCalls().some((c) => c.url.includes('/api/errors'))); const b = JSON.parse(fetchCalls().find((c) => c.url.includes('/api/errors')).body); return b.message.includes('Checkout total is NaN') && b.release === '2026.10.21' && typeof b.url === 'string';", fail: "window.addEventListener(\"error\", (e) => report(e.message))" },
            { label: "Unhandled rejections are reported", check: "$$('button')[1].click(); await waitFor(() => fetchCalls().filter((c) => c.url.includes('/api/errors')).length >= 2); return fetchCalls().some((c) => c.url.includes('/api/errors') && JSON.parse(c.body).message.includes('Payment API timed out'));", fail: "window.addEventListener(\"unhandledrejection\", (e) => report(e.reason?.message ?? String(e.reason)))" },
          ],
          solution: {
            "src/monitoring.js": `export const RELEASE = "2026.10.21";

function report(message) {
  fetch("/api/errors", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, url: location.pathname, release: RELEASE }),
  }).catch(() => {
    /* never let reporting break the app */
  });
}

export function installMonitoring() {
  window.addEventListener("error", (event) => report(event.message || String(event.error)));
  window.addEventListener("unhandledrejection", (event) => report(event.reason?.message ?? String(event.reason)));
}
`,
          },
          hint: "Catch the report's own failure, so a down monitoring endpoint never causes more errors.",
          successMessage: "Errors your users hit now reach you, with the release they happened in.",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 91 · 15.12 – 15.14
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "rx-l91-teamwork",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 5,
    covers: ["15.12", "15.13", "15.14"],
    title: "READMEs, Teamwork and Your Portfolio",
    subtitle: "Installation instructions, code review and collaboration, and presenting technical decisions",
    estimatedMinutes: 45,
    intro: "Software is a team sport, and your work is judged by people who were not there when you wrote it: reviewers, new teammates, and employers looking at your portfolio.",

    atoms: [
      {
        id: "a-rx-readme",
        title: "Writing a clear README and installation instructions",
        explain:
          "The README is the front door of a repository. It should say: what the project is (one or two sentences and a screenshot or live link); the tech stack; how to run it (requirements such as Node 22, then git clone, npm install, copying .env.example to .env.local, npm run dev), as commands someone can paste; how to test and build; the project structure in brief; and how to deploy or contribute. Test it by following it yourself on a clean machine (or a fresh folder): if a step is missing, a reviewer will get stuck exactly there.",
        webLab: fileLab({
          what: "your README",
          task:
            "Write README.md for the course app. It needs: a level-1 title; a line with the live demo link https://memora-courses.vercel.app; a \"## Tech stack\" section naming React, Vite and React Router; a \"## Getting started\" section with a fenced code block containing, in order, git clone, npm install, cp .env.example .env.local and npm run dev; and a \"## Scripts\" section mentioning npm test and npm run build.",
          files: { "README.md": "" },
          tests: [
            { label: "A title and the live link", check: "const r = raw('README.md'); return /^# .+/m.test(r) && r.includes('https://memora-courses.vercel.app');", fail: "# Memora Courses, then the link." },
            { label: "The tech stack", check: "const r = raw('README.md'); const s = r.split('## Tech stack')[1] || ''; return ['React', 'Vite', 'React Router'].every((t) => s.includes(t));", fail: "## Tech stack listing React, Vite and React Router." },
            { label: "Getting started commands, in order, in a code block", check: "const r = raw('README.md'); const s = r.split('## Getting started')[1] || ''; const block = (s.match(/```[\\s\\S]*?```/) || [''])[0]; const order = ['git clone', 'npm install', 'cp .env.example .env.local', 'npm run dev'].map((c) => block.indexOf(c)); return order.every((i) => i > -1) && order.every((v, i, a) => i === 0 || v > a[i - 1]);", fail: "One fenced block with the four commands in order." },
            { label: "Test and build scripts are documented", check: "const s = raw('README.md').split('## Scripts')[1] || ''; return s.includes('npm test') && s.includes('npm run build');", fail: "## Scripts with npm test and npm run build." },
          ],
          solution: {
            "README.md": `# Memora Courses

A course catalogue and student portal built with React. Live demo: https://memora-courses.vercel.app

## Tech stack

- React 19 with Hooks
- Vite
- React Router
- TanStack Query and Zod
- Vitest and React Testing Library

## Getting started

Requires Node.js 22 or newer.

\`\`\`bash
git clone https://github.com/memora/memora-courses.git
cd memora-courses
npm install
cp .env.example .env.local
npm run dev
\`\`\`

Then open http://localhost:5173.

## Scripts

- \`npm run dev\`: start the development server
- \`npm test\`: run the tests
- \`npm run lint\`: check the code
- \`npm run build\`: build for production into dist/

## Project structure

- \`src/pages/\`: one component per route
- \`src/components/\`: shared UI
- \`src/api/\`: all requests to the backend
`,
          },
          hint: "A fenced code block starts and ends with three backticks on their own lines.",
          successMessage: "A stranger can now clone, run and understand the project.",
        }),
      },
      {
        id: "a-rx-code-review",
        title: "Code review, task tracking and team collaboration",
        explain:
          "CODE REVIEW is two people's eyes on every change: it catches bugs, spreads knowledge and keeps the codebase consistent. As a REVIEWER: run it (the preview deployment), read for correctness first, then clarity, then style (which linters should handle); comment on the code, not the person; ask questions (\"what happens if the list is empty?\"); separate must-fix from suggestions (\"nit:\"). As an AUTHOR: keep PRs small, explain the why, respond to every comment, and do not take it personally. TASK TRACKING (GitHub Issues and Projects, Jira, Linear) turns work into small, clearly described tickets with acceptance criteria, linked from the PRs that close them.",
        decision: {
          scenario: "You are reviewing a teammate's PR. The feature works, but a function that fetches data is copied into three components, and one variable is named x.",
          question: "Which review comment is most helpful?",
          options: [
            { id: "a", text: "\"This fetch logic appears in three places; could it become a useProducts Hook so a fix lands in one place? Also, nit: x could be selectedProduct.\"", why: "Specific, explains the reason, suggests a direction, and marks the naming point as minor." },
            { id: "b", text: "\"This is messy, please clean it up.\"", whyWrong: "Vague and personal; the author does not know what to change." },
            { id: "c", text: "Approve without comment because it works", whyWrong: "The duplication will cost the team later; review is the cheapest time to raise it." },
            { id: "d", text: "Rewrite it yourself and push to their branch", whyWrong: "Takes ownership away and teaches nothing." },
          ],
          correct: "a",
          aftermath: "Specific, kind, and clear about what is required versus optional.",
        },
      },
      {
        id: "a-rx-portfolio",
        title: "Building a portfolio and presenting technical decisions",
        explain:
          "Employers hire evidence. A strong portfolio has three to five real, deployed projects (not tutorial copies), each with a live link, its source on GitHub with a good README, and a short case study: the problem, your role, the stack, the hardest part and how you solved it, and what you would do next. Explain DECISIONS, not just features: why Zustand rather than Context, why TanStack Query, why virtualised lists. Teams record these as ARCHITECTURE DECISION RECORDS (ADRs): short files in docs/decisions/ with Context, Decision and Consequences, which make excellent interview material.",
        webLab: fileLab({
          what: "your decision record",
          task:
            "Write an architecture decision record in docs/decisions/0001-server-state.md. Title it \"# 1. Use TanStack Query for server state\". Include a \"Status: Accepted\" line and three sections, as level-2 headings in order: \"## Context\" (why a decision was needed), \"## Decision\" (what you chose, mentioning TanStack Query), and \"## Consequences\" (at least one positive and one negative consequence, as bullet points).",
          files: { "docs/decisions/0001-server-state.md": "" },
          tests: [
            { label: "Title and status", check: "const d = raw('docs/decisions/0001-server-state.md'); return /^# 1\\. Use TanStack Query for server state\\s*$/m.test(d) && /^Status: Accepted\\s*$/m.test(d);", fail: "# 1. Use TanStack Query for server state, then Status: Accepted" },
            { label: "Context, Decision and Consequences, in order", check: "const d = raw('docs/decisions/0001-server-state.md'); const i = ['## Context', '## Decision', '## Consequences'].map((h) => d.indexOf(h)); return i.every((x) => x > -1) && i[0] < i[1] && i[1] < i[2] && (d.split('## Decision')[1] || '').includes('TanStack Query');", fail: "Three ## sections; the Decision names TanStack Query." },
            { label: "Consequences list good and bad", check: "const c = raw('docs/decisions/0001-server-state.md').split('## Consequences')[1] || ''; return (c.match(/^[-*] .+/gm) || []).length >= 2;", fail: "At least two bullet points." },
          ],
          solution: {
            "docs/decisions/0001-server-state.md": `# 1. Use TanStack Query for server state

Status: Accepted

## Context

Products, orders and the user's profile come from the API. Each page fetched them in its own effects, with hand-written loading flags, no caching and occasional race conditions. Several components needed the same data and fetched it separately.

## Decision

Use TanStack Query for all server data: useQuery for reads with keys per resource, and useMutation with invalidation for writes. UI-only state stays in useState or Zustand.

## Consequences

- Positive: caching, deduplication, retries and race handling come built in, and components lose their effect code.
- Positive: every page shows the same loading and error behaviour.
- Negative: a new dependency the whole team must learn, and query keys need a naming convention.
`,
          },
          hint: "Good ADRs are short: half a page, written when the decision is made.",
          successMessage: "A decision explained the way senior engineers do, and a story for your next interview.",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 92 · 15.P
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "rx-l92-m15-project",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 6,
    covers: ["15.P"],
    title: "Practical: Ship a Complete React Application",
    subtitle: "A deployable project with its production configuration and setup instructions",
    estimatedMinutes: 90,
    intro: "The final practical of the course: take a React app and make it something a reviewer can clone, run, understand and visit live. In the lab you prepare every file the deployment needs; then you deploy it for real.",

    atoms: [
      {
        id: "a-rx-m15-project",
        title: "Prepare the app for deployment",
        explain:
          "Everything a deployed React app needs besides its code: correct dependencies and scripts, environment files and an example, ignore rules, SPA rewrites for the host, a CI workflow, and a README a stranger can follow. The app in the lab is complete and uses React Router and an API URL from the environment.",
        webLab: fileLab({
          what: "your deployment files",
          task:
            "Make the project deployable. package.json: react, react-dom and react-router in dependencies, vite and vitest in devDependencies, scripts dev, build, preview, lint and test. .env.example: VITE_API_URL=. .gitignore: node_modules, dist and *.local. vercel.json: the SPA rewrite. .github/workflows/ci.yml: on pull_request and push to main, Node 22, npm ci, lint, test (npm test -- --run) and build. README.md: a title, the live URL https://my-react-app.vercel.app, a \"## Getting started\" section with npm install and npm run dev in a code block, and a \"## Environment\" section naming VITE_API_URL.",
          files: {
            "package.json": PACKAGE_JSON,
            ".env.example": "",
            ".gitignore": "",
            "vercel.json": "{\n}\n",
            ".github/workflows/ci.yml": "",
            "README.md": "",
          },
          revealSolution: false,
          tests: [
            { label: "package.json: dependencies and scripts", check: "let p; try { p = JSON.parse(raw('package.json')); } catch { return false; } const d = p.dependencies || {}, dv = p.devDependencies || {}, s = p.scripts || {}; return d.react && d['react-dom'] && d['react-router'] && !d.vite && dv.vite && dv.vitest && ['dev', 'build', 'preview', 'lint', 'test'].every((k) => s[k]);", fail: "Move vite to devDependencies and add the five scripts." },
            { label: ".env.example and .gitignore", check: "const g = raw('.gitignore'); return /^VITE_API_URL=\\s*$/m.test(raw('.env.example')) && ['node_modules', 'dist', '*.local'].every((x) => new RegExp('^' + x.replace('*', '\\\\*') + '\\\\/?\\\\s*$', 'm').test(g));", fail: "VITE_API_URL= in the example; node_modules, dist and *.local ignored." },
            { label: "SPA rewrite for Vercel", check: "let j; try { j = JSON.parse(raw('vercel.json')); } catch { return false; } return (j.rewrites || []).some((r) => r.source === '/(.*)' && r.destination === '/index.html');", fail: "{ \"rewrites\": [{ \"source\": \"/(.*)\", \"destination\": \"/index.html\" }] }" },
            { label: "A CI workflow that checks every change", check: "const y = raw('.github/workflows/ci.yml'); const o = ['npm ci', 'npm run lint', 'npm test -- --run', 'npm run build'].map((s) => y.indexOf('run: ' + s)); return /pull_request/.test(y) && /branches:\\s*\\[?\\s*\"?main/.test(y) && /node-version:\\s*\"?22/.test(y) && o.every((i) => i > -1) && o.every((v, i, a) => i === 0 || v > a[i - 1]);", fail: "The workflow from Lesson 79." },
            { label: "A README a reviewer can follow", check: "const r = raw('README.md'); const gs = r.split('## Getting started')[1] || ''; const block = (gs.match(/```[\\s\\S]*?```/) || [''])[0]; return /^# .+/m.test(r) && r.includes('https://my-react-app.vercel.app') && block.indexOf('npm install') > -1 && block.indexOf('npm run dev') > block.indexOf('npm install') && (r.split('## Environment')[1] || '').includes('VITE_API_URL');", fail: "Title, live link, Getting started commands and an Environment section." },
          ],
          solution: {
            "package.json": `{
  "name": "memora-courses",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint .",
    "test": "vitest"
  },
  "dependencies": {
    "react": "^19.2.4",
    "react-dom": "^19.2.4",
    "react-router": "^7.14.2"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^6.0.1",
    "eslint": "^9.39.4",
    "vite": "^8.0.1",
    "vitest": "^4.0.0"
  }
}
`,
            ".env.example": "VITE_API_URL=\n",
            ".gitignore": "node_modules\ndist\n*.local\n",
            "vercel.json": "{\n  \"rewrites\": [{ \"source\": \"/(.*)\", \"destination\": \"/index.html\" }]\n}\n",
            ".github/workflows/ci.yml": "name: CI\n\non:\n  pull_request:\n  push:\n    branches: [main]\n\njobs:\n  check:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - uses: actions/setup-node@v4\n        with:\n          node-version: 22\n          cache: npm\n      - run: npm ci\n      - run: npm run lint\n      - run: npm test -- --run\n      - run: npm run build\n",
            "README.md": "# My React App\n\nLive: https://my-react-app.vercel.app\n\n## Getting started\n\n```bash\nnpm install\ncp .env.example .env.local\nnpm run dev\n```\n\n## Environment\n\n- VITE_API_URL: the base URL of the API\n",
          },
          hint: "Each file is a lesson from this module; revisit the lesson if a check stays red.",
          successMessage: "Every file a deployment needs, ready. Now ship it.",
        }),
      },
    ],
    task: {
      title: "Module 15 practical: deploy your capstone-quality app",
      intro: "Choose your strongest project from this course and ship it properly.",
      prompts: [
        "Push it to a public GitHub repository with a clear history of small, well-described commits made on branches and merged through pull requests.",
        "Deploy it to Vercel or Netlify from GitHub, with production and preview environment variables, SPA rewrites and, if you can, a custom domain over HTTPS.",
        "Add the CI workflow, protect main so pull requests need a passing check, and add error monitoring.",
        "Write the README and at least one decision record, and add the project to your portfolio with a short case study.",
        "Mastery checkpoint: ask someone to clone the repository and run it locally using only your README, then open the live URL; note every place they got stuck and fix it.",
      ],
      closing: "You have finished React Development. Take the certification exam when you are ready.",
    },
    requirements: { read: true, video: false, assessment: true },
  },
];
