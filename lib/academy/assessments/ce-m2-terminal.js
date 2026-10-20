/**
 * ASSESSMENTS · CODEBASE ENGINEERING · MODULE 2 · TERMINAL MASTERY
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Never import this from anything under src/.
 * ═════════════════════════════════════════════════════════════════════════
 */

import { q, check } from "./ce-helpers.js";

export const ASSESSMENTS = {
  ...check("ce-l7-shell", [
    q({ id: "ceq7-1", atom: "a-ce-shell-words", d: 2, prompt: "What is the shell?", options: ["The program that reads what you type and runs it, such as Bash or PowerShell", "The window you type into", "A file manager", "The operating system's kernel"], correct: "a",
      explanation: "The terminal is the window; the shell is the interpreter inside it.",
      wrong: { b: "That is the terminal.", c: "Not a shell.", d: "The kernel is below the shell." } }),
    q({ id: "ceq7-2", atom: "a-ce-args-flags", d: 2, prompt: "In ls -l server/routes, what is -l?", options: ["A flag that changes how ls behaves (long format)", "The folder to list", "A separate command", "An error code"], correct: "a",
      explanation: "Flags start with a dash; arguments name what to act on.",
      wrong: { b: "server/routes is the argument.", c: "It belongs to ls.", d: "Exit codes are not typed." } }),
    q({ id: "ceq7-3", atom: "a-ce-abs-rel", d: 3, prompt: "A script will be run from different folders. Which path is safest inside it?", options: ["An absolute path, such as /c/Users/ada/kobo-market/data", "A relative path such as data", "./data", "../data"], correct: "a",
      explanation: "Absolute paths mean the same thing from anywhere.",
      wrong: { b: "Depends on where the script is run from.", c: "Still relative.", d: "Relative to the working directory." } }),
    q({ id: "ceq7-4", atom: "a-ce-relative-errors", d: 3, type: "scenario", prompt: "\"cat config.js: No such file or directory\", but you can see config.js in the project. What do you check first?", options: ["pwd: you are probably in a different folder from the file", "Reinstall the shell", "Whether you are an administrator", "Whether the file is too large"], correct: "a",
      explanation: "Relative paths are read from the working directory.",
      wrong: { b: "The shell is fine.", c: "Permission errors say \"Permission denied\".", d: "Size does not cause this error." } }),
  ]),

  ...check("ce-l8-inspect", [
    q({ id: "ceq8-1", atom: "a-ce-navigate", d: 2, prompt: "What does cd .. do?", options: ["Moves the working directory up one folder", "Lists hidden files", "Deletes the current folder", "Goes to the root of the disk"], correct: "a",
      explanation: ".. is the parent folder.",
      wrong: { b: "That is ls -a.", c: "cd never deletes.", d: "That is cd /." } }),
    q({ id: "ceq8-2", atom: "a-ce-head-tail", d: 2, prompt: "Which command shows the 50 most recent lines of a log file?", options: ["tail -n 50 server.log", "head -n 50 server.log", "cat -50 server.log", "wc -l server.log"], correct: "a",
      explanation: "New entries are appended at the end.",
      wrong: { b: "head shows the oldest lines.", c: "Not a valid way to limit cat.", d: "That counts lines." } }),
    q({ id: "ceq8-3", atom: "a-ce-wc", d: 2, prompt: "What does wc -l src/pages/*.jsx show?", options: ["The line count of each page file and a total", "The number of files only", "The words in each file", "Which files changed"], correct: "a",
      explanation: "With several files, wc prints each and a total.",
      wrong: { b: "It counts lines in them.", c: "-l is lines; -w would be words.", d: "Git shows changes." } }),
    q({ id: "ceq8-4", atom: "a-ce-hidden", d: 2, prompt: "Why might plain ls not show .env?", options: ["Names starting with a dot are hidden; ls -a shows them", "It has been deleted", "ls cannot read text files", "It is in node_modules"], correct: "a",
      explanation: "Dotfiles are hidden by convention.",
      wrong: { b: "It is there; ls -a shows it.", c: "ls lists names, not contents.", d: "It is in the project root." } }),
    q({ id: "ceq8-5", atom: "a-ce-permissions", d: 3, prompt: "What does -rwx------ mean for a file?", options: ["Only the owner can read, write and run it", "Everyone can run it", "It is a directory", "Nobody can open it"], correct: "a",
      explanation: "The owner group is rwx; group and others have nothing.",
      wrong: { b: "Others have ---.", c: "A directory starts with d.", d: "The owner can." } }),
  ]),

  ...check("ce-l9-search", [
    q({ id: "ceq9-1", atom: "a-ce-find-names", d: 2, prompt: "Which tool answers \"which files are called *.test.js?\"", options: ["find", "grep", "wc", "cat"], correct: "a",
      explanation: "find searches names; grep searches contents.",
      wrong: { b: "grep searches inside files.", c: "wc counts.", d: "cat prints." } }),
    q({ id: "ceq9-2", atom: "a-ce-scale", d: 3, prompt: "Why exclude node_modules from most searches?", options: ["It holds thousands of installed files that are not the project's own code", "It is always empty", "Searching it is forbidden", "It contains only images"], correct: "a",
      explanation: "In Kobo Market it holds 1,965 files against the project's 41.",
      wrong: { b: "It is the biggest folder.", c: "Allowed, just rarely useful.", d: "It is mostly JavaScript." } }),
    q({ id: "ceq9-3", atom: "a-ce-grep-contents", d: 2, prompt: "What does grep -rn TEXT . do?", options: ["Searches every file under the current folder for TEXT, showing line numbers", "Renames files", "Counts files", "Searches only file names"], correct: "a",
      explanation: "-r recursive, -n line numbers.",
      wrong: { b: "grep does not rename.", c: "Not a count.", d: "Contents, not names." } }),
    q({ id: "ceq9-4", atom: "a-ce-ripgrep", d: 3, prompt: "Why did rg SESSION_SECRET not show the line in .env, when grep -r did?", options: ["ripgrep skips files listed in .gitignore, and .env is listed", "ripgrep is broken", ".env was empty", "grep invented the line"], correct: "a",
      explanation: "rg respects .gitignore by default.",
      wrong: { b: "That is its intended behaviour.", c: "grep showed its content.", d: "grep shows real lines." } }),
    q({ id: "ceq9-5", atom: "a-ce-grep-leak", d: 3, type: "scenario", prompt: "You pasted search output containing a real API key into a team chat. What now?", options: ["Revoke the key and issue a new one; deleting the message is not enough", "Delete the message and carry on", "Ask everyone not to look", "Nothing: chats are private"], correct: "a",
      explanation: "Treat a shared secret as leaked.",
      wrong: { b: "It may already be seen or stored.", c: "Not a control.", d: "Chats are stored and searchable." } }),
  ]),

  ...check("ce-l10-pipes", [
    q({ id: "ceq10-2", atom: "a-ce-stderr", d: 3, prompt: "What does 2>&1 do?", options: ["Sends errors (stream 2) to the same place as normal output (stream 1)", "Runs the command twice", "Deletes errors", "Writes to a file called 1"], correct: "a",
      explanation: "Used to save or pipe output and errors together.",
      wrong: { b: "Not a repeat.", c: "2>/dev/null discards them.", d: "&1 means stream 1, not a file." } }),
    q({ id: "ceq10-3", atom: "a-ce-pipes", d: 2, prompt: "In git log --format=%an | sort | uniq -c, what does | do?", options: ["Sends the output of the command on its left into the command on its right", "Runs both commands at once on separate input", "Means OR", "Comments out the rest"], correct: "a",
      explanation: "Pipelines read left to right.",
      wrong: { b: "Each command receives the previous one's output.", c: "|| means OR.", d: "# starts a comment." } }),
    q({ id: "ceq10-4", atom: "a-ce-redirect", d: 3, prompt: "What is the danger of > compared with >>?", options: [">  replaces the file's contents; >> appends to it", "> is slower", ">> deletes the file", "There is no difference"], correct: "a",
      explanation: "> silently overwrites.",
      wrong: { b: "Speed is not the issue.", c: ">> keeps what is there.", d: "They differ in the way that matters." } }),
    q({ id: "ceq10-5", atom: "a-ce-chaining", d: 3, prompt: "In npm run lint && npm test, when does npm test run?", options: ["Only if lint succeeded (exit code 0)", "Always", "Only if lint failed", "Before lint"], correct: "a",
      explanation: "&& continues only on success.",
      wrong: { b: "That is ;.", c: "That is ||.", d: "Left to right." } }),
    q({ id: "ceq10-6", atom: "a-ce-safe-delete", d: 2, prompt: "What does git clean -n do?", options: ["Lists the untracked files git clean would delete, without deleting them", "Deletes everything", "Cleans the Git history", "Renames files"], correct: "a",
      explanation: "A dry run: look before you delete.",
      wrong: { b: "-n deletes nothing.", c: "History is untouched.", d: "No renaming." } }),
  ]),

  ...check("ce-l11-env-shells", [
    q({ id: "ceq11-1", atom: "a-ce-env-vars", d: 2, prompt: "Why do programs read settings from environment variables?", options: ["So the same code can run with different settings on different machines", "Because they are faster than files", "To hide code from the user", "Because Node requires it"], correct: "a",
      explanation: "Configuration varies; code does not.",
      wrong: { b: "Speed is not the reason.", c: "They hold settings, not code.", d: "It is a convention, not a requirement." } }),
    q({ id: "ceq11-2", atom: "a-ce-path", d: 2, prompt: "\"node: command not found\" usually means:", options: ["Node is not installed, or not in a folder listed on PATH", "The project is broken", "The file is hidden", "You need sudo"], correct: "a",
      explanation: "The shell finds commands through PATH.",
      wrong: { b: "The shell never reached the project.", c: "Commands are found on PATH, not by hidden files.", d: "That gives a permission error, not this." } }),
    q({ id: "ceq11-3", atom: "a-ce-dev-scripts", d: 3, prompt: ".env says PORT=4000, but the server was started with PORT=4100 npm start. Which port does it use, and why?", options: ["4100: --env-file does not override a variable that is already set", "4000: .env always wins", "Both", "Neither: it crashes"], correct: "a",
      explanation: "The real environment beats the file.",
      wrong: { b: "The file only fills in what is missing.", c: "A server listens on the port it is given.", d: "It starts normally." } }),
    q({ id: "ceq11-4", atom: "a-ce-powershell", d: 2, prompt: "Which is PowerShell's equivalent of grep?", options: ["Select-String", "Get-ChildItem", "Get-Location", "Get-Content"], correct: "a",
      explanation: "Select-String searches text.",
      wrong: { b: "That is ls.", c: "That is pwd.", d: "That is cat." } }),
    q({ id: "ceq11-5", atom: "a-ce-bash-vs-ps", d: 3, prompt: "In Git Bash, rg \"/api/orders\" finds nothing but the text is in the code. Why?", options: ["Git Bash rewrote the leading-slash argument into a Windows path before rg saw it", "ripgrep cannot search slashes", "The file is hidden", "The text is in node_modules"], correct: "a",
      explanation: "Use MSYS_NO_PATHCONV=1 or drop the leading slash.",
      wrong: { b: "rg searches slashes fine.", c: "Source files are not hidden.", d: "It is in the project's source." } }),
  ]),

  ...check("ce-l12-investigate", [
    q({ id: "ceq12-1", atom: "a-ce-inv-entry", d: 2, prompt: "What is an application's entry point?", options: ["The file that runs first, from which everything else is reached", "The largest file", "The README", "The login page"], correct: "a",
      explanation: "server/index.js and src/main.jsx in Kobo Market.",
      wrong: { b: "Size does not decide it.", c: "Documentation, not code.", d: "A page, not where execution starts." } }),
    q({ id: "ceq12-2", atom: "a-ce-inv-routes", d: 2, prompt: "What does routing code decide?", options: ["Which function handles which URL and method", "How fast the server runs", "Which files Git ignores", "The colours of the site"], correct: "a",
      explanation: "Every API has a routing table in some form.",
      wrong: { b: "Not performance.", c: ".gitignore does that.", d: "CSS does that." } }),
    q({ id: "ceq12-3", atom: "a-ce-inv-config", d: 3, prompt: "Why list every process.env read in a project?", options: ["It is the full list of settings a deployment must provide", "To delete them", "To find the tests", "To count the routes"], correct: "a",
      explanation: "A missing one is a classic deployment failure.",
      wrong: { b: "They are needed.", c: "Tests are found by name.", d: "Unrelated." } }),
    q({ id: "ceq12-4", atom: "a-ce-inv-db", d: 3, prompt: "Only server/db/index.js reads and writes the data. Why is that good news?", options: ["All data access goes through one module, so changing storage later touches one file", "It means there is no data", "It makes the API faster", "It means there are no bugs"], correct: "a",
      explanation: "One door to the data is a sign of a clear data layer.",
      wrong: { b: "There is data in data/kobo.json.", c: "Not about speed.", d: "Structure is not correctness." } }),
  ]),
};
