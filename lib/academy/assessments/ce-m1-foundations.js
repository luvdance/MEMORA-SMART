/**
 * ASSESSMENTS · CODEBASE ENGINEERING · MODULE 1 · FOUNDATIONS
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Never import this from anything under src/.
 * ═════════════════════════════════════════════════════════════════════════
 */

import { q, check } from "./ce-helpers.js";

export const ASSESSMENTS = {
  ...check("ce-l1-welcome", [
    q({ id: "ceq1-1", atom: "a-ce-welcome-why", d: 2, prompt: "Which of these is part of OWNING a codebase rather than generating code?", options: ["Knowing why a part works the way it does and fixing it when it breaks", "Typing code quickly", "Asking an AI to produce a new file", "Choosing a code editor"], correct: "a",
      explanation: "Ownership is long-term responsibility: understanding, maintaining and fixing.",
      wrong: { b: "Speed of typing is generation.", c: "That is generation, done by a tool.", d: "A preference, not ownership." } }),
    q({ id: "ceq1-2", atom: "a-ce-welcome-phases", d: 2, prompt: "You inherit a project. According to this course, what comes first?", options: ["Understanding it without changing anything", "Refactoring the messiest file", "Upgrading every dependency", "Asking an agent to add the requested feature"], correct: "a",
      explanation: "Phase 1 is understanding: map before you modify.",
      wrong: { b: "Changing code you do not understand risks breaking it.", c: "Upgrades are changes, and risky ones.", d: "Delegating before understanding means you cannot review the result." } }),
    q({ id: "ceq1-3", atom: "a-ce-welcome-roadmap", d: 2, prompt: "Which module is about finding out what changed, who changed it, and undoing a change safely?", options: ["Module 5: Git, GitHub and safe codebase management", "Module 2: terminal mastery", "Module 8: architecture", "Module 10: advanced operations"], correct: "a",
      explanation: "Git is the record of every change.",
      wrong: { b: "The terminal is the tool, not the subject.", c: "Architecture is about structure.", d: "Module 10 builds workflows on top of Git." } }),
    q({ id: "ceq1-4", atom: "a-ce-welcome-project", d: 3, prompt: "Which command lists the people who have committed to a repository, with how many commits each?", options: ["git shortlog -sn HEAD", "git status", "ls -la", "git log --oneline | wc -l"], correct: "a",
      explanation: "shortlog groups commits by author; -s counts and -n sorts.",
      wrong: { b: "Status shows the working tree, not authors.", c: "ls lists files.", d: "That counts all commits, not per author." } }),
  ]),

  ...check("ce-l2-ai-era", [
    q({ id: "ceq2-1", atom: "a-ce-manual-to-agentic", d: 2, prompt: "What distinguishes an AI coding AGENT from a chat assistant?", options: ["It reads and edits several files and runs commands on its own to complete a task", "It suggests the next line as you type", "It only answers questions", "It never makes mistakes"], correct: "a",
      explanation: "Agents act; assistants suggest.",
      wrong: { b: "That is autocomplete.", c: "That is a chat assistant.", d: "No AI tool is mistake-free." } }),
    q({ id: "ceq2-2", atom: "a-ce-manual-to-agentic", d: 3, type: "scenario", prompt: "An agent reports \"all tests pass\" after a task. What should you check?", options: ["The diff: what it actually changed, including whether it edited the tests themselves", "Nothing, the report is enough", "Only the agent's summary", "The number of files in the project"], correct: "a",
      explanation: "Review what was done, not what was reported.",
      wrong: { b: "A report is a claim, not evidence.", c: "Summaries can omit the important change.", d: "Irrelevant to the task." } }),
    q({ id: "ceq2-3", atom: "a-ce-vocabulary", d: 2, prompt: "In Kobo Market, what is react?", options: ["A dependency: third-party code installed with npm", "A module the team wrote", "A repository", "A component"], correct: "a",
      explanation: "It is listed in package.json and installed into node_modules.",
      wrong: { b: "The team did not write it.", c: "It is a package used inside the repository.", d: "React is a library for building components, not one of them." } }),
    q({ id: "ceq2-4", atom: "a-ce-find-dependencies", d: 2, prompt: "In package.json, what is the difference between dependencies and devDependencies?", options: ["dependencies are needed when the app runs; devDependencies only to develop, test and build it", "devDependencies are newer", "dependencies are optional", "There is no difference"], correct: "a",
      explanation: "A production server can omit devDependencies.",
      wrong: { b: "Age has nothing to do with it.", c: "Runtime dependencies are required.", d: "npm treats them differently." } }),
  ]),

  ...check("ce-l3-ownership", [
    q({ id: "ceq3-1", atom: "a-ce-gen-comp-own", d: 2, prompt: "Which skill has AI made cheap?", options: ["Code generation", "Code comprehension", "Code ownership", "Accountability for production"], correct: "a",
      explanation: "Producing code is now fast; understanding and owning it are not.",
      wrong: { b: "Understanding still takes a person.", c: "Ownership is a person's responsibility.", d: "Accountability cannot be delegated to a tool." } }),
    q({ id: "ceq3-2", atom: "a-ce-source-vs-generated", d: 3, prompt: "Kobo Market's folder holds more than 2,000 files, but git ls-files lists 39. What are most of the others?", options: ["Installed dependencies in node_modules, build output in dist, and Git's own data", "Deleted files", "Secret files", "Duplicates of the source"], correct: "a",
      explanation: "The source is a small fraction of what is on disk.",
      wrong: { b: "Deleted files are not on disk.", c: "Only .env is secret.", d: "They are not copies of the source." } }),
    q({ id: "ceq3-3", atom: "a-ce-source-vs-generated", d: 2, prompt: "You want to change how the app looks. Which folder should you edit?", options: ["src/, the source", "dist/, the build output", "node_modules/react", "data/"], correct: "a",
      explanation: "Edit the source; regenerate the output.",
      wrong: { b: "The next build overwrites dist/.", c: "Never edit installed packages; reinstalling wipes the change.", d: "That is seeded data." } }),
    q({ id: "ceq3-4", atom: "a-ce-gitignore-tells", d: 2, prompt: "Why read .gitignore on an unfamiliar project?", options: ["It lists what the team treats as not source: generated, installed, local or secret files", "It lists the most important files", "It contains the project's passwords", "It configures the build"], correct: "a",
      explanation: "It tells you which folders you can usually ignore.",
      wrong: { b: "It lists files to exclude.", c: "It names files like .env, not their contents.", d: "Builds are configured elsewhere." } }),
  ]),

  ...check("ce-l4-system", [
    q({ id: "ceq4-1", atom: "a-ce-parts-connect", d: 2, prompt: "What is an API, in a web application?", options: ["A set of URLs the backend answers, through which the frontend requests and sends data", "The database", "The browser", "A CSS framework"], correct: "a",
      explanation: "For example POST /api/login.",
      wrong: { b: "The database is behind the API.", c: "The browser calls the API.", d: "Unrelated." } }),
    q({ id: "ceq4-2", atom: "a-ce-parts-connect", d: 3, prompt: "In Kobo Market's development setup, how does a browser request to /api/products reach the Node API on port 4000?", options: ["Vite's dev server proxies /api requests to localhost:4000, as set in vite.config.js", "The browser connects to the JSON file directly", "React sends it to Paystack", "It does not; the API is unused in development"], correct: "a",
      explanation: "One proxy line connects frontend and backend.",
      wrong: { b: "Browsers cannot read server files.", c: "Paystack is the payment service.", d: "The frontend loads all its data from the API." } }),
    q({ id: "ceq4-3", atom: "a-ce-lifecycle", d: 2, prompt: "Which command lists every script a Node project defines?", options: ["npm run", "npm start", "npm install", "node --version"], correct: "a",
      explanation: "With no script name, npm run lists them.",
      wrong: { b: "That runs one script.", c: "That installs dependencies.", d: "That prints Node's version." } }),
    q({ id: "ceq4-4", atom: "a-ce-lifecycle-stage", d: 3, type: "scenario", prompt: "The site works locally, but the build on the Linux build server fails to find a file whose name differs only in capital letters. Why?", options: ["Linux file names are case-sensitive and Windows/macOS defaults are not", "The build server has no internet", "The tests are failing", "Linux cannot run JavaScript"], correct: "a",
      explanation: "Match import paths to file names exactly.",
      wrong: { b: "The error is about resolving a file, not the network.", c: "No test is involved.", d: "It can." } }),
  ]),

  ...check("ce-l5-debt-baseline", [
    q({ id: "ceq5-1", atom: "a-ce-tech-debt", d: 2, prompt: "What is technical debt?", options: ["The future cost of a shortcut taken now", "Money owed for software licences", "Any bug", "Code written by AI"], correct: "a",
      explanation: "Like a loan, its interest is paid every time someone works around it.",
      wrong: { b: "Not financial debt.", c: "Debt is often working code that is hard to change.", d: "Anyone's code can carry debt." } }),
    q({ id: "ceq5-2", atom: "a-ce-duplication-spot", d: 3, prompt: "Why is duplicated business logic especially dangerous?", options: ["The copies drift apart when one is updated, silently, and nothing reports it", "It makes files longer", "It slows the build", "Linters reject it"], correct: "a",
      explanation: "Kobo Market's delivery fee is defined in two places.",
      wrong: { b: "Length is the least of it.", c: "Not noticeably.", d: "Most linters do not detect it." } }),
    q({ id: "ceq5-3", atom: "a-ce-baseline", d: 2, prompt: "Why take a baseline before changing an unfamiliar project?", options: ["So that when something fails later, you can tell whether your change caused it", "To make the project faster", "Because Git requires it", "To impress the team"], correct: "a",
      explanation: "It is the known-good point to compare against.",
      wrong: { b: "Measuring changes nothing.", c: "Git does not require it.", d: "Its value is practical." } }),
    q({ id: "ceq5-4", atom: "a-ce-baseline-record", d: 2, prompt: "Which belongs in a baseline record?", options: ["The commit id, tool versions, and each check's result as the tool reported it", "Your opinion of the code", "The list of every file", "The README, copied"], correct: "a",
      explanation: "Facts you can compare against later.",
      wrong: { b: "Opinions cannot be re-checked.", c: "git ls-files gives that any time.", d: "The README is a claim, not a measurement." } }),
  ]),

  ...check("ce-l6-report", [
    q({ id: "ceq6-1", atom: "a-ce-report-purpose", d: 2, prompt: "How should you treat what a README says?", options: ["As claims to verify against the code and the tools", "As the truth", "As irrelevant", "As something to delete"], correct: "a",
      explanation: "READMEs are often out of date.",
      wrong: { b: "It may be stale.", c: "It is the best first overview.", d: "It is valuable documentation." } }),
    q({ id: "ceq6-2", atom: "a-ce-report-claims", d: 3, prompt: "You read the payment code but never saw a payment succeed. How do you report payments?", options: ["As claimed or unknown, saying what you saw and what would verify it", "As verified", "Leave it out", "As broken"], correct: "a",
      explanation: "Report evidence and gaps, not guesses.",
      wrong: { b: "You have not seen it work.", c: "It hides the key open question.", d: "That is also a guess." } }),
    q({ id: "ceq6-3", atom: "a-ce-report-shape", d: 2, prompt: "Which heading lists what you could not determine yet?", options: ["Open questions", "Stack", "Purpose", "Components"], correct: "a",
      explanation: "It becomes your investigation plan.",
      wrong: { b: "Stack lists technologies.", c: "Purpose describes the project.", d: "Components lists the parts." } }),
    q({ id: "ceq6-4", atom: "a-ce-report-shape", d: 3, prompt: "How should open questions be ordered?", options: ["By risk to users and the business, highest first", "Alphabetically", "By file size", "In the order you found them"], correct: "a",
      explanation: "The first item may be the only one read.",
      wrong: { b: "Alphabetical order ignores risk.", c: "Size is not risk.", d: "Discovery order is accidental." } }),
  ]),
};
