/**
 * ASSESSMENTS · CODEBASE ENGINEERING · MODULE 3 · PROJECT ARCHAEOLOGY
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Never import this from anything under src/.
 * ═════════════════════════════════════════════════════════════════════════
 */

import { q, check } from "./ce-helpers.js";

export const ASSESSMENTS = {
  ...check("ce-l13-layout", [
    q({ id: "ceq13-1", atom: "a-ce-root-dir", d: 2, prompt: "You are deep inside a repository's folders. Which command prints the repository's root folder?", options: ["git rev-parse --show-toplevel", "pwd", "cd ..", "ls -a"], correct: "a",
      explanation: "Git always knows the root.",
      wrong: { b: "pwd prints where you are, not the root.", c: "That moves up one level.", d: "That lists files." } }),
    q({ id: "ceq13-2", atom: "a-ce-layouts", d: 3, prompt: "tree is not installed. Which command shows the folder structure two levels deep, without node_modules?", options: ["find . -maxdepth 2 -type d -not -path \"./node_modules*\"", "ls -la", "cat .gitignore", "wc -l *"], correct: "a",
      explanation: "find can do what tree does, everywhere.",
      wrong: { b: "One level only, files included.", c: "That reads one file.", d: "That counts lines." } }),
    q({ id: "ceq13-3", atom: "a-ce-common-layouts", d: 3, prompt: "A repository has apps/web, apps/api and packages/ui, and a root package.json with workspaces. What is it?", options: ["A monorepo holding several projects", "A single frontend", "A Django project", "A broken clone"], correct: "a",
      explanation: "Workspaces and apps/ plus packages/ are the monorepo signature.",
      wrong: { b: "There is an API and shared packages too.", c: "No Python.", d: "Several manifests are normal here." } }),
    q({ id: "ceq13-4", atom: "a-ce-manifests", d: 2, prompt: "Which file is the manifest of a Python project?", options: ["pyproject.toml (or requirements.txt)", "package.json", "pom.xml", "Cargo.toml"], correct: "a",
      explanation: "Every ecosystem has one.",
      wrong: { b: "Node.", c: "Java (Maven).", d: "Rust." } }),
    q({ id: "ceq13-5", atom: "a-ce-manifest-engines", d: 3, prompt: "npm pkg get engines prints {}. Why is that worth reporting?", options: ["The project does not declare which Node version it needs, so it may break on a different version", "It means there are no dependencies", "It means the project is empty", "It is never worth reporting"], correct: "a",
      explanation: "Undeclared runtime versions cause \"works for me\" failures.",
      wrong: { b: "Dependencies are a separate field.", c: "It says nothing about the code.", d: "Absences are findings." } }),
  ]),

  ...check("ce-l14-folders", [
    q({ id: "ceq14-1", atom: "a-ce-standard-dirs", d: 2, prompt: "Which folder should you never edit by hand?", options: ["dist/ (generated build output)", "src/", "tests/", "public/"], correct: "a",
      explanation: "It is regenerated on every build.",
      wrong: { b: "That is the source.", c: "Tests are source.", d: "Served as-is, edited by hand." } }),
    q({ id: "ceq14-2", atom: "a-ce-html-entry", d: 2, prompt: "In a Vite app, where does the browser learn which script to run first?", options: ["The <script type=\"module\"> tag in index.html", "package.json", "vite.config.js", ".gitignore"], correct: "a",
      explanation: "index.html loads the entry script.",
      wrong: { b: "Read by npm, not the browser.", c: "Configures Vite.", d: "Read by Git." } }),
    q({ id: "ceq14-3", atom: "a-ce-entry-points", d: 2, prompt: "What does a React entry point such as src/main.jsx usually do?", options: ["Renders the top component (App) into an element in the page", "Defines the database", "Holds every page's code", "Configures ESLint"], correct: "a",
      explanation: "Set up and hand over.",
      wrong: { b: "Server-side concern.", c: "Pages are separate files.", d: "That is eslint.config.js." } }),
    q({ id: "ceq14-4", atom: "a-ce-mvc-words", d: 3, prompt: "Where does a business rule such as \"free delivery from ₦50,000\" belong?", options: ["In a service, so every route and test uses the same rule", "In the router", "In every component that shows a price", "In the CSS"], correct: "a",
      explanation: "One owner for each rule.",
      wrong: { b: "Routers map URLs.", c: "Copies drift apart.", d: "Unrelated." } }),
  ]),

  ...check("ce-l15-modules", [
    q({ id: "ceq15-1", atom: "a-ce-imports", d: 2, prompt: "In import { orderTotals } from \"../services/orderService.js\", what does the ../ tell you?", options: ["It is one of the project's own modules, one folder up", "It is an npm package", "It is a built-in Node module", "It is a CSS file"], correct: "a",
      explanation: "Relative paths are the project's own files.",
      wrong: { b: "Packages are bare names (react).", c: "Built-ins look like node:http.", d: "It is a .js module." } }),
    q({ id: "ceq15-2", atom: "a-ce-dependents", d: 3, prompt: "Why find a module's dependents before changing it?", options: ["They are what might break: the blast radius of the change", "To delete them", "To make the change faster", "Git requires it"], correct: "a",
      explanation: "Four files depend on Kobo Market's data module.",
      wrong: { b: "They are needed.", c: "It is about safety, not speed.", d: "Git does not." } }),
    q({ id: "ceq15-3", atom: "a-ce-import-styles", d: 3, prompt: "A search for \"api/client.js\" finds no importers, yet three files use the client. Why?", options: ["They import it by a different relative path, \"./client.js\"", "The client is unused", "ripgrep is broken", "The files are generated"], correct: "a",
      explanation: "Search for how imports are actually written.",
      wrong: { b: "It is used by all three API modules.", c: "The search did what it was asked.", d: "They are source files." } }),
    q({ id: "ceq15-4", atom: "a-ce-generated-check", d: 2, prompt: "What does git check-ignore -v PATH tell you?", options: ["Whether Git ignores PATH, and which .gitignore line causes it", "Who last changed PATH", "Whether PATH has errors", "The size of PATH"], correct: "a",
      explanation: "A quick proof that a file is not source.",
      wrong: { b: "That is git blame.", c: "Not a linter.", d: "Not a size tool." } }),
    q({ id: "ceq15-5", atom: "a-ce-minified", d: 3, type: "scenario", prompt: "A bug was fixed by editing a file in dist/ on the server. What happens at the next deploy?", options: ["The build regenerates dist/ from src/ and the bug returns", "The fix is kept", "The build fails", "Git records the fix"], correct: "a",
      explanation: "Fix the source, not the output.",
      wrong: { b: "dist/ is overwritten.", c: "The build succeeds, with the bug.", d: "dist/ is ignored by Git." } }),
  ]),

  ...check("ce-l16-config", [
    q({ id: "ceq16-1", atom: "a-ce-config-inventory", d: 2, prompt: "Which file decides what Git never tracks?", options: [".gitignore", ".env.example", "vite.config.js", "tsconfig.json"], correct: "a",
      explanation: "The team's list of non-source files.",
      wrong: { b: "Documents required variables.", c: "Configures Vite.", d: "Configures TypeScript." } }),
    q({ id: "ceq16-2", atom: "a-ce-eslint-config", d: 3, type: "scenario", prompt: "An AI change edits eslint.config.js to turn a rule off. How should you treat it?", options: ["Review it as carefully as a code change: it changes what the project checks", "Ignore it, config is unimportant", "Accept it if lint passes", "Revert all configuration changes always"], correct: "a",
      explanation: "Configuration changes behaviour project-wide.",
      wrong: { b: "Config is code with wide effect.", c: "Of course lint passes: the rule is off.", d: "Some config changes are legitimate; review them." } }),
    q({ id: "ceq16-3", atom: "a-ce-tsconfig", d: 2, prompt: "A project has no tsconfig.json. What does that suggest?", options: ["It is plain JavaScript without TypeScript checking", "It is broken", "It has no configuration at all", "It uses Python"], correct: "a",
      explanation: "Type mistakes will only show up at run time or in tests.",
      wrong: { b: "Plenty of projects are plain JavaScript.", c: "Other config files exist.", d: "Unrelated." } }),
    q({ id: "ceq16-4", atom: "a-ce-env-example", d: 2, prompt: "What belongs in .env.example?", options: ["Every required variable, with safe placeholder values", "The real production secrets", "Nothing; it should be empty", "The code that reads the variables"], correct: "a",
      explanation: "It is the committed documentation of required settings.",
      wrong: { b: "Never commit secrets.", c: "Then it documents nothing.", d: "Code lives in source files." } }),
  ]),

  ...check("ce-l17-inventory", [
    q({ id: "ceq17-1", atom: "a-ce-inventory", d: 2, prompt: "Why find the largest source files first?", options: ["Complexity, bugs and core logic tend to concentrate in them", "Large files are always generated", "They are easiest to delete", "They load fastest"], correct: "a",
      explanation: "A cheap guide to where to read first.",
      wrong: { b: "Here they are source.", c: "Size says nothing about safety to delete.", d: "Irrelevant." } }),
    q({ id: "ceq17-2", atom: "a-ce-folder-counts", d: 2, prompt: "In ... | sort | uniq -c, why sort before uniq?", options: ["uniq only merges identical lines that are next to each other", "uniq needs alphabetical order to run", "sort removes duplicates", "It makes no difference"], correct: "a",
      explanation: "Sorting puts identical lines together.",
      wrong: { b: "It runs, but miscounts unsorted input.", c: "sort -u would, plain sort does not.", d: "Without sort the counts split." } }),
    q({ id: "ceq17-3", atom: "a-ce-dep-map", d: 3, prompt: "In a healthy dependency map, which way do arrows mostly point?", options: ["Inwards: routes → services → data", "Data → routes", "Randomly", "Every module to every other"], correct: "a",
      explanation: "Lower layers do not know about higher ones.",
      wrong: { b: "That is the reversed, warning-sign direction.", c: "Structure should be visible.", d: "That is a tangle." } }),
    q({ id: "ceq17-4", atom: "a-ce-feature-files", d: 3, prompt: "Searching for \"cart\" misses orderService.js, which computes cart totals. What does that teach?", options: ["A feature's vocabulary changes across layers; search several words and follow imports", "orderService.js is unrelated", "ripgrep is case-sensitive", "The file is generated"], correct: "a",
      explanation: "The server calls it an order.",
      wrong: { b: "It computes the totals.", c: "-i made it case-insensitive.", d: "It is source." } }),
    q({ id: "ceq17-5", atom: "a-ce-feature-history", d: 2, prompt: "What does git log --oneline -- FILE1 FILE2 show?", options: ["Only the commits that changed those files", "Every commit in the repository", "The files' contents", "Who is online"], correct: "a",
      explanation: "History narrowed to a feature's files.",
      wrong: { b: "The paths filter it.", c: "That is cat or git show.", d: "Unrelated." } }),
  ]),

  ...check("ce-l18-map", [
    q({ id: "ceq18-1", atom: "a-ce-map-start", d: 2, prompt: "What should a codebase map's \"Start\" section say for each application?", options: ["The command, the script it runs, the entry file and the port", "The author's name", "The number of tests", "The list of dependencies"], correct: "a",
      explanation: "What a new developer needs on day one.",
      wrong: { b: "Not about starting it.", c: "Belongs in the baseline.", d: "Belongs in the stack section." } }),
    q({ id: "ceq18-2", atom: "a-ce-map-pages", d: 2, prompt: "Kobo Market has no router library. What decides which page is shown?", options: ["A page value in App.jsx's state", "The URL path", "The server", "CSS"], correct: "a",
      explanation: "useState(\"products\") in App.jsx.",
      wrong: { b: "Not without a router.", c: "The server only provides data.", d: "CSS styles, it does not choose." } }),
    q({ id: "ceq18-3", atom: "a-ce-map-data", d: 3, prompt: "Which statement of where data comes from is most useful in a map?", options: ["Each hop by file and function, from screen to storage", "\"From the database\"", "\"From React\"", "\"From the internet\""], correct: "a",
      explanation: "Specific enough for someone else to follow.",
      wrong: { b: "Too vague to act on.", c: "React displays it.", d: "Too vague." } }),
    q({ id: "ceq18-4", atom: "a-ce-map-format", d: 2, prompt: "Where should the codebase map live?", options: ["In the repository, so it is reviewed and updated with the code", "In your personal notes", "In an email", "Nowhere; maps go stale"], correct: "a",
      explanation: "Docs as code.",
      wrong: { b: "Nobody else can update it.", c: "Lost in an inbox.", d: "In the repository, it can be kept current." } }),
  ]),
};
