/**
 * RESPONSIVE WEB DEVELOPMENT · MODULE 29 · DEPLOYMENT AND HOSTING
 *
 * Curriculum 29.1 – 29.12. Phase 6 begins: putting work where anyone can use
 * it. Development versus production, production builds, hosting, static
 * deploys, Vercel and Netlify, GitHub-connected automatic deploys, domains
 * and DNS, HTTPS, environment-specific configuration, failed builds and
 * updating a live site.
 *
 * Terminal transcripts were recorded from real sessions (Vite 8.3, curl).
 * The failed build is a real one, caused by importing a file that did not
 * exist; folder paths are shortened with "…". Hosting dashboards change
 * their wording often, so their steps are described rather than simulated.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

export const SECTION_ID = "wd-s29-deployment";

const PROMPT = "ada@laptop:~/shop-app$";

const BUILD_OK = `> shop-app@1.0.0 build
> vite build

vite v8.3.4 building client environment for production...
transforming...
✓ 5 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                0.21 kB │ gzip: 0.18 kB
dist/assets/index-DkPmS8Zt.js  8.50 kB │ gzip: 3.73 kB

✓ built in 151ms`;

const PREVIEW = `> shop-app@1.0.0 preview
> vite preview --port 4199

  ➜  Local:   http://localhost:4199/
  ➜  Network: use --host to expose`;

const BUILD_FAIL = `> shop-app@1.0.0 build
> vite build

vite v8.3.4 building client environment for production...
transforming...
✓ 4 modules transformed.
✗ Build failed in 89ms
error during build:
Build failed with 1 error:

[UNRESOLVED_IMPORT] Could not resolve './format.js' in src/main.js
   ╭─[ src/main.js:2:29 ]
   │
 2 │ import { formatNaira } from "./format.js";
   │                             ──────┬──────
   │                                   ╰──────── Module not found.
   │
   │ Help: 'src/main.js' is imported by the following path:
   │         - src/main.js
   │         - index.html
───╯`;

const CURL_HTTPS = `HTTP/1.1 200 OK
Date: Mon, 19 Oct 2026 15:53:45 GMT
Content-Type: text/html; charset=utf-8
Connection: keep-alive
Server: cloudflare
last-modified: Tue, 13 Oct 2026 22:05:48 GMT
allow: GET, HEAD
Accept-Ranges: bytes
Age: 9
cf-cache-status: HIT
CF-RAY: a4d0f51e5eaf661b-AMS
alt-svc: h3=":443"; ma=86400`;

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 137 · 29.1 – 29.2
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "wd-l137-production-build",
    moduleId: "wd-m29-deployment",
    sectionId: SECTION_ID,
    order: 1,
    covers: ["29.1", "29.2"],
    title: "Development versus Production, and the Production Bundle",
    subtitle: "Two versions of every site, and how to make the one visitors get",
    estimatedMinutes: 20,
    intro: "Until now every site you built lived on your laptop. Phase 6 puts your work on the internet, where it must be fast, secure and always available. It starts with understanding the difference between the site you work on and the site people visit.",

    atoms: [
      {
        id: "a-wd-dev-vs-prod",
        title: "Development versus production",
        explain:
          "Development is your working copy: source files, a dev server that reloads on save, readable code, detailed errors and test data. Production is what the public uses: optimised files from a build, served by a host over HTTPS, real data, and errors that are logged rather than shown to visitors. Changes always flow one way: develop locally, commit, build, deploy. Never edit the live site directly.",
        table: {
          caption: "Development and production.",
          headers: ["", "Development", "Production"],
          rows: [
            ["Served by", "npm run dev on your laptop", "A host such as Netlify or Vercel"],
            ["Code", "Source modules, readable", "Built bundle: minified, hashed"],
            ["Address", "http://localhost:5173", "https://your-domain.ng"],
            ["Data and settings", "Test data, .env", "Real data, the host's environment settings"],
            ["Errors", "Shown in full", "Logged; visitors see a friendly message"],
          ],
        },
      },
      {
        id: "a-wd-production-bundle",
        title: "Building a production bundle",
        explain:
          "npm run build writes the production site into dist: the HTML, the bundled and minified JavaScript and CSS with hashed names, and anything from public/. Check it before deploying with npm run preview, which serves dist exactly as a host would, because a few bugs (wrong paths, missing environment variables) only appear in a build. dist is what you deploy; it is never edited by hand and never committed.",
        terminalExercise: {
          prompt: PROMPT,
          intro: "Recorded from a real session in a Vite project.",
          goal: "The build has finished. Serve the built dist folder locally, the way a host will, to check it before deploying.",
          commands: {
            "npm run build": BUILD_OK,
            "npm run preview -- --port 4199": PREVIEW,
          },
          available: ["npm run build", "npm run preview -- --port 4199"],
          accept: ["npm run preview -- --port 4199"],
          near: [
            { command: "npm run build", why: "That already ran. Now serve its output with the preview script." },
          ],
          hint: "The preview script; the -- passes --port 4199 through to Vite.",
          success: "Open http://localhost:4199/ and click through the site: this is exactly what visitors will receive.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 138 · 29.3 – 29.5
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "wd-l138-hosting",
    moduleId: "wd-m29-deployment",
    sectionId: SECTION_ID,
    order: 2,
    covers: ["29.3", "29.4", "29.5"],
    title: "Hosting, Static Deploys, Vercel and Netlify",
    subtitle: "Where a site lives, and putting it there",
    estimatedMinutes: 22,
    intro: "A host is a computer that is always on and always connected, serving your files to anyone who asks. For the sites in this course you do not need to manage one: modern hosts take your built files and handle the rest.",

    atoms: [
      {
        id: "a-wd-hosting",
        title: "Hosting fundamentals",
        explain:
          "Hosting comes in kinds. Static hosting serves files exactly as they are (HTML, CSS, JavaScript, images), which is everything this course builds, and is fast, cheap or free, and very secure because nothing runs on the server. Server hosting runs your own backend code. Most static hosts also put your files on a CDN (content delivery network): copies in data centres worldwide, so a visitor in Lagos is served from nearby rather than from another continent.",
        table: {
          caption: "Kinds of hosting.",
          headers: ["Kind", "Serves", "Examples", "Fits"],
          rows: [
            ["Static", "Files as they are", "Netlify, Vercel, GitHub Pages, Cloudflare Pages", "Everything in this course"],
            ["Serverless functions", "Small pieces of backend code on demand", "Netlify Functions, Vercel Functions", "Hiding an API secret key"],
            ["Server (VPS)", "Your own long-running server", "DigitalOcean, AWS EC2", "Full backends you manage yourself"],
          ],
        },
      },
      {
        id: "a-wd-static-deploy",
        title: "Deploying static websites",
        explain:
          "Deploying a static site means putting the built files on a host. For a plain HTML/CSS/JS project, the files are the site. For a Vite project, it is the dist folder after npm run build, never the source. The simplest deploy is a drag-and-drop of that folder onto Netlify's dashboard; the professional one, next lesson, builds automatically from GitHub.",
        decision: {
          scenario: "Your Vite project's folder contains src/, public/, node_modules/, dist/, index.html and package.json. You are dragging a folder onto a host to deploy it by hand.",
          question: "Which folder do you upload?",
          options: [
            { id: "a", text: "dist, after running npm run build", why: "dist is the built site: bundled, minified and with correct paths. The source needs Vite to run, and node_modules is development tooling." },
            { id: "b", text: "The whole project folder", whyWrong: "That uploads source and tooling; the browser cannot run Vite's source directly, and node_modules is huge." },
            { id: "c", text: "src", whyWrong: "Source modules import npm packages by name, which only the build resolves." },
            { id: "d", text: "node_modules", whyWrong: "That is installed tooling, not the site." },
          ],
          correct: "a",
          aftermath: "When a host builds for you, you tell it the build command (npm run build) and the publish directory (dist).",
        },
      },
      {
        id: "a-wd-vercel-netlify",
        title: "Deploying with Vercel or Netlify",
        explain:
          "Vercel and Netlify both have free plans suited to portfolio projects. Sign up with your GitHub account, choose Add new project (Vercel) or Add new site (Netlify), and import your repository. Both detect Vite and fill in the settings; check them. Every deploy gets a public address such as your-site.vercel.app or your-site.netlify.app, served over HTTPS automatically.",
        table: {
          caption: "The settings a host needs for a Vite project.",
          headers: ["Setting", "Value", "Why"],
          rows: [
            ["Build command", "npm run build", "How the host makes the production site"],
            ["Publish / output directory", "dist", "Where the built files end up"],
            ["Node version", "The LTS you use locally", "So the build behaves as it does on your laptop"],
            ["Environment variables", "Your VITE_ values", "Set in the host's dashboard, because .env is not in Git"],
          ],
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 139 · 29.6 – 29.9
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "wd-l139-github-dns-https",
    moduleId: "wd-m29-deployment",
    sectionId: SECTION_ID,
    order: 3,
    covers: ["29.6", "29.7", "29.8", "29.9"],
    title: "GitHub Deploys, Domains, DNS and HTTPS",
    subtitle: "Deploying on every push, and putting a site at your own address",
    estimatedMinutes: 24,
    intro: "Professional sites are never uploaded by hand. A push to GitHub triggers a build and a deploy, and the site is reachable at the business's own domain, always over HTTPS.",

    atoms: [
      {
        id: "a-wd-connect-github",
        title: "Connecting GitHub repositories",
        explain:
          "When you import a repository into Vercel or Netlify, you give the host permission to read it. From then on, the host watches the repository: it knows which branch is production (usually main), and it can report each deploy's result back to GitHub next to the commit. Only grant access to the repositories you actually want to deploy.",
      },
      {
        id: "a-wd-auto-deploys",
        title: "Automatic deployment workflows",
        explain:
          "With the repository connected, every push to main triggers a new production build and deploy, and every pull request or other branch gets its own preview deployment at a temporary address, so you (or a client) can check a change before it goes live. This is continuous deployment: the main branch always IS the live site, which is why work happens on branches and is merged only when it is ready.",
        decision: {
          scenario: "A client wants to review a new homepage design before it goes live. The site deploys automatically from main.",
          question: "What is the professional workflow?",
          options: [
            { id: "a", text: "Build it on a branch, open a pull request, and send the client the preview deployment's link; merge when they approve", why: "The preview URL shows exactly what will go live, without touching the real site. Merging to main then deploys it." },
            { id: "b", text: "Push it to main and tell the client to look quickly", whyWrong: "Every visitor sees the unapproved design too." },
            { id: "c", text: "Email the client screenshots", whyWrong: "They cannot try it on their own phone or click through it." },
            { id: "d", text: "Copy the site to a second hosting account by hand", whyWrong: "Preview deployments do this automatically, for every branch." },
          ],
          correct: "a",
          aftermath: "Branch, preview, approve, merge, deploy.",
        },
      },
      {
        id: "a-wd-dns",
        title: "Domain names and DNS basics",
        explain:
          "A domain is rented yearly from a registrar (for .ng domains, through an accredited Nigerian registrar; for .com, many international ones). DNS (Module 1) maps it to the host. You add DNS records at the registrar, or move the domain's DNS to the host. The two records you will meet: an A record points a name at an IP address, and a CNAME points a name at another name. Changes can take minutes to hours to spread, which is called propagation.",
        table: {
          caption: "Typical DNS records for a site on a static host.",
          headers: ["Type", "Name", "Value", "Means"],
          rows: [
            ["A", "@ (the bare domain, bisibakery.ng)", "The host's IP address", "The domain itself goes to the host"],
            ["CNAME", "www", "your-site.netlify.app", "www.bisibakery.ng goes to the same place"],
            ["MX", "@", "The mail provider's servers", "Email for the domain (not the website)"],
          ],
        },
      },
      {
        id: "a-wd-https",
        title: "HTTPS and SSL certificates",
        explain:
          "HTTPS needs a TLS (often still called SSL) certificate proving the server really is your domain. Modern hosts issue and renew one automatically and free (through Let's Encrypt) once your DNS points at them, and redirect http:// to https://. Every site must use HTTPS: browsers mark plain HTTP as Not secure, many features (geolocation, service workers, the clipboard) require it, and search engines rank it higher. curl -I shows a site's response headers, a quick way to check what a server sends.",
        terminalExercise: {
          prompt: "ada@laptop:~$",
          intro: "Recorded from a real session.",
          goal: "Check that example.com answers over HTTPS, by asking for its response headers only.",
          commands: {
            "curl -sI https://example.com": CURL_HTTPS,
          },
          available: ["curl -sI https://example.com"],
          accept: ["curl -sI https://example.com"],
          hint: "curl with -s (silent) and -I (headers only), then the https:// address.",
          success: "200 OK over HTTPS. The Server and cf-cache-status headers show the site is served by Cloudflare's CDN, from a nearby cache (HIT).",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 140 · 29.10 – 29.12
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "wd-l140-config-failures-updates",
    moduleId: "wd-m29-deployment",
    sectionId: SECTION_ID,
    order: 4,
    covers: ["29.10", "29.11", "29.12"],
    title: "Environment Configuration, Failed Builds and Updating a Live Site",
    subtitle: "Settings per environment, reading a broken deploy, and shipping changes safely",
    estimatedMinutes: 24,
    intro: "Deploys fail. Settings differ between your laptop and the live site. And a live site has to change without ever being broken for its visitors. This lesson covers all three.",

    atoms: [
      {
        id: "a-wd-env-config",
        title: "Environment-specific configuration",
        explain:
          "The same code runs in several environments (local, preview, production) with different settings: an API's base URL, an analytics ID, a feature flag. Keep them out of the code: in .env for local work, and in the host's Environment Variables settings for each deployed environment, where you can set different values for production and previews. Remember Module 27's rule: anything VITE_ is public in the bundle, so it is configuration, never a secret.",
        decision: {
          scenario: "Your app calls http://localhost:3000/api on your laptop and https://api.bisibakery.ng in production. The URL is currently written in app.js.",
          question: "What is the right approach?",
          options: [
            { id: "a", text: "Read it from import.meta.env.VITE_API_URL, set in .env locally and in the host's environment settings for production", why: "One codebase, different settings per environment, no code changes to deploy." },
            { id: "b", text: "Change app.js by hand before every deploy", whyWrong: "Error-prone, and the next deploy from Git will undo it." },
            { id: "c", text: "Commit .env so the host can read it", whyWrong: ".env stays out of Git; the host has its own settings for this." },
            { id: "d", text: "Use an if statement checking the computer's name", whyWrong: "Fragile and impossible in the browser." },
          ],
          correct: "a",
          aftermath: "Code is the same everywhere; configuration is what changes.",
        },
      },
      {
        id: "a-wd-build-failures",
        title: "Managing build failures",
        explain:
          "When a deploy fails, the live site keeps serving the last successful version, so visitors are not affected; your new change simply has not gone out. Open the deploy's log in the host's dashboard and read it like a stack trace: find the first error. The classic causes: a file name whose case differs (Format.js on Windows, format.js on the host's Linux), a dependency installed locally but not in package.json, a missing environment variable, or a Node version difference. Reproduce it locally with npm run build, fix, commit and push.",
        terminalExercise: {
          prompt: PROMPT,
          intro: "Recorded from a real session. The host reported that the latest deploy failed.",
          goal: "Reproduce the failed deploy on your own computer to read the error.",
          commands: {
            "npm run build": BUILD_FAIL,
          },
          available: ["npm run build"],
          accept: ["npm run build"],
          hint: "Run exactly what the host runs.",
          success: "The error names the file and line: src/main.js line 2 imports ./format.js, which does not exist. Create the file (or fix the name, minding capital letters), build again, then push.",
        },
      },
      {
        id: "a-wd-updating-site",
        title: "Updating a deployed website",
        explain:
          "To change a live site: make the change on a branch, check it in its preview deployment, merge to main, and the host deploys it. Every deploy is kept, so if something is wrong you can roll back to the previous deploy in one click while you fix it. Because built files have hashed names, visitors get the new version straight away without stale caches. Test the live site after each deploy, on a phone as well as a laptop.",
        decision: {
          scenario: "Ten minutes after a deploy, customers report the checkout button has disappeared. The fix will take an hour.",
          question: "What do you do first?",
          options: [
            { id: "a", text: "Roll back to the previous deploy in the host's dashboard, then fix the bug on a branch", why: "Rolling back restores a working site in seconds. The fix can then be made and checked calmly." },
            { id: "b", text: "Edit the files on the server directly", whyWrong: "Static hosts do not allow it, and the next deploy would overwrite it anyway." },
            { id: "c", text: "Leave it broken while you fix it", whyWrong: "Every minute loses sales." },
            { id: "d", text: "Delete the site", whyWrong: "That breaks everything, not just checkout." },
          ],
          correct: "a",
          aftermath: "Every deploy being kept is what makes deploying many times a day safe.",
        },
      },
    ],

    task: {
      title: "Module project: deploy your Phase 5 application",
      intro: "Put your strongest Phase 5 project online, professionally.",
      prompts: [
        "Run npm run build and npm run preview, and fix anything that only breaks in the build.",
        "Import the GitHub repository into Netlify or Vercel, check the build command, output directory and Node version, and add your VITE_ variables in the host's settings.",
        "Make a change on a branch, open a pull request, and check its preview deployment on your phone before merging.",
        "Break the build on purpose (an import of a missing file), push it, read the failed deploy's log, then fix it.",
        "Optional: connect a domain you own, with the A and CNAME records the host gives you, and confirm HTTPS works.",
      ],
      closing: "Next module: making the live site accessible, findable and fast.",
    },
    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
