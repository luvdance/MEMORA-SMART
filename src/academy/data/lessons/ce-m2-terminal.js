/**
 * CODEBASE ENGINEERING · MODULE 2 · TERMINAL MASTERY
 *
 * Curriculum 2.1 – 2.9 and the practical, 2.P. Shells, commands, paths;
 * navigating and inspecting; hidden files and permissions; searching names
 * and contents; output, exit codes, errors and pipes; redirection and safe
 * chaining; environment variables, PATH and scripts; Bash versus PowerShell.
 *
 * Recorded in Git Bash and Windows PowerShell on Kobo Market. Two real
 * Windows behaviours are taught rather than hidden: ripgrep prints paths with
 * backslashes, and Git Bash rewrites arguments that start with "/".
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

import { term, shown } from "./ce-helpers.js";

export const SECTION_ID = "ce-s2-terminal";
const MODULE = "ce-m2-terminal";

const ROUTES_PATTERN = 'rg -n "\\[\\"(GET|POST)\\"" server/router.js';

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 7 · 2.1 – 2.2
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ce-l7-shell",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 1,
    covers: ["2.1", "2.2"],
    title: "Terminal, Shell, Command, Path",
    subtitle: "The words, and the difference between an absolute and a relative path",
    estimatedMinutes: 22,
    intro:
      "The terminal is the fastest way to ask a project questions: which files exist, where a word appears, whether the tests pass. It looks austere because it is precise. Ten words make it make sense.",

    atoms: [
      {
        id: "a-ce-shell-words",
        title: "Terminal, shell, command and working directory",
        explain:
          "The terminal is the window you type into. The shell is the program inside it that reads what you type and runs it: Bash on Linux, Git Bash on Windows and (Bash-compatible) zsh on macOS; PowerShell on Windows. A command is a program name such as ls. The working directory is the folder the shell is currently in; every command runs there unless told otherwise. The prompt (ada@laptop:~/kobo-market$) usually shows it, and pwd (print working directory) states it exactly.",
        terminalExercise: term("m2-basics", {
          goal: "Find out exactly which folder this terminal is working in.",
          accept: ["pwd"],
          near: [{ command: "ls", why: "ls lists what is IN the current folder, not which folder it is. pwd prints the folder itself." }],
          hint: "Three letters: print working directory.",
          success: "/c/Users/ada/kobo-market. In Git Bash, C:\\Users\\ada is written /c/Users/ada, because Bash paths use forward slashes and no drive letters.",
        }),
      },
      {
        id: "a-ce-args-flags",
        title: "Arguments and flags",
        explain:
          "After the command come arguments, separated by spaces. A plain argument usually names what to act on: in ls server, server is the folder to list. A flag (also called an option) starts with a dash and changes how the command behaves: ls -l means \"long format\" (permissions, size, date). Short flags can be combined (-la is -l plus -a). Long flags use two dashes (--short). Most commands explain their flags with --help.",
        table: {
          caption: "Reading a command.",
          headers: ["Part", "In ls -l server/routes", "Meaning"],
          rows: [
            ["Command", "ls", "List directory contents"],
            ["Flag", "-l", "Long format: permissions, size, date"],
            ["Argument", "server/routes", "Which folder to list"],
          ],
        },
        terminalExercise: term("m2-basics", {
          goal: "See the size and last-modified time of each file in server/routes, not just the names.",
          accept: ["ls -l server/routes"],
          near: [
            { command: "ls server", why: "That lists the server folder, by name only. Add the long-format flag and point it at server/routes." },
            { command: "ls -F server", why: "-F marks folders with a slash, but shows no sizes. The long format is -l." },
          ],
          hint: "ls, the long-format flag, then the folder.",
          success: "Three route files: auth.js (563 bytes), orders.js (1016) and products.js (492). The size alone tells you orders.js is where the most happens.",
        }),
      },
      {
        id: "a-ce-abs-rel",
        title: "Absolute versus relative paths",
        explain:
          "A path names a file or folder. An absolute path starts from the root of the file system (/ in Bash, C:\\ in PowerShell) and means the same thing wherever you are: /c/Users/ada/kobo-market/server/routes. A relative path starts from the working directory: server/routes means \"the server/routes inside wherever I am now\". Two shortcuts: . is the current folder (./server/routes is the same as server/routes) and .. is the folder above. Relative paths are shorter; absolute paths are safer in scripts that may be run from anywhere.",
        terminalExercise: term("m2-paths", {
          goal: "List the route files using a path that would work no matter which folder the terminal was in.",
          accept: ["ls /c/Users/ada/kobo-market/server/routes"],
          near: [
            { command: "ls server/routes", why: "That is a relative path: it only works from the project folder. An absolute path starts with /." },
            { command: "ls ./server/routes", why: "./ means \"from here\", so this is still relative to the working directory." },
          ],
          hint: "Start from the root: /c/Users/ada/kobo-market/...",
          success: "Same three files, found by an address that does not depend on where you are standing.",
        }),
      },
      {
        id: "a-ce-relative-errors",
        title: "When a relative path fails",
        explain:
          "Most \"No such file or directory\" errors on a correct-looking path are a relative path used from the wrong folder. The file exists; it is just not where the path says, relative to here. Run pwd and re-read the path from that folder.",
        example: [shown("m2-paths", "pwd"), shown("m2-paths", "ls routes"), shown("m2-paths", "cd server/routes && pwd")].join("\n\n"),
        decision: {
          scenario: "In the example, ls routes fails with \"No such file or directory\", yet ls server/routes works.",
          question: "Why?",
          options: [
            { id: "a", text: "The working directory is the project root, and there is no routes folder directly in it; routes is inside server", why: "A relative path is read from the working directory. From kobo-market, routes means kobo-market/routes, which does not exist." },
            { id: "b", text: "The routes folder was deleted", whyWrong: "ls server/routes, run from the same place, shows it." },
            { id: "c", text: "ls cannot list folders", whyWrong: "It lists folders all the time." },
            { id: "d", text: "You need administrator rights", whyWrong: "That would be \"Permission denied\", not \"No such file or directory\"." },
          ],
          correct: "a",
          aftermath: "pwd first, then read the path from there. It solves most path errors in seconds.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 8 · 2.3 – 2.4
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ce-l8-inspect",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 2,
    covers: ["2.3", "2.4"],
    title: "Navigating, Inspecting, Hidden Files and Permissions",
    subtitle: "Look inside a project without opening an editor",
    estimatedMinutes: 24,
    intro:
      "You can learn most of what a file is for from its first few lines, and most of what a folder holds from one listing. These commands are the ones you will type most.",

    atoms: [
      {
        id: "a-ce-navigate",
        title: "Moving around and telling files from folders",
        explain:
          "cd FOLDER changes the working directory (cd .. goes up one level, cd on its own goes home). ls lists the working directory; ls FOLDER lists another. Plain ls output does not say which entries are folders, which matters when you are exploring: ls -F adds a / after every folder, and ls -l starts each folder's line with d.",
        terminalExercise: term("m2-basics", {
          goal: "Find out which entries inside server/ are folders and which are files.",
          accept: ["ls -F server"],
          near: [{ command: "ls server", why: "Plain ls does not mark folders. Add -F, which puts a / after each one." }],
          hint: "ls with the flag that classifies entries.",
          success: "Five folders (db, middleware, payments, routes, services) and four files (config.js, http.js, index.js, router.js). The folder names already outline the server's design.",
        }),
      },
      {
        id: "a-ce-head-tail",
        title: "Reading files: cat, less, head and tail",
        explain:
          "cat FILE prints a whole file, fine for short ones. For long files, less FILE opens a scrollable view (space for the next page, / to search, q to quit). head -n 20 FILE prints the first 20 lines, which for a source file is usually its imports and its purpose; tail -n 20 FILE prints the last 20, which for a log file is the most recent events (tail -f keeps following a log as it grows).",
        terminalExercise: term("m2-inspect", {
          goal: "See only the first 8 lines of server/index.js, where its imports and first actions are.",
          accept: ["head -n 8 server/index.js"],
          near: [
            { command: "tail -n 4 server/index.js", why: "tail shows the END of the file. The imports are at the top: head." },
            { command: "cat .env.example", why: "Different file. The question is about server/index.js." },
          ],
          hint: "head, -n with a line count, then the file.",
          success: "Three imports (Node's http, the config, the router) and then assertConfig(): the server checks its configuration before anything else. Eight lines told you the file's job.",
        }),
      },
      {
        id: "a-ce-wc",
        title: "Counting lines with wc -l",
        explain:
          "wc -l counts lines. On one file it measures its size; on several it lists each plus a total, a quick way to see where the code is concentrated. Large files are where complexity and bugs tend to live, so a line count is a cheap first map.",
        terminalExercise: term("m2-inspect", {
          goal: "Compare the sizes, in lines, of all the route files at once.",
          accept: ["wc -l server/routes/*.js"],
          near: [{ command: "wc -l server/router.js", why: "That counts one file, the router. The routes are server/routes/*.js; the * matches every .js file there." }],
          hint: "wc -l with a pattern that matches every .js file in server/routes.",
          success: "auth 16, orders 22, products 13: 51 lines in total. Small files; the whole API's routes fit on one screen.",
        }),
      },
      {
        id: "a-ce-hidden",
        title: "Hidden files",
        explain:
          "On Linux, macOS and in Git Bash, a file whose name starts with a dot is hidden: plain ls skips it. Some of the most important files in a project are hidden: .git (the whole history), .gitignore, .env (secrets) and .env.example. ls -a shows them; ls -la shows them in long format. Never assume a folder holds only what plain ls shows.",
        terminalExercise: term("m2-hidden", {
          goal: "List every file in the project root, including hidden ones.",
          accept: ["ls -a", "ls -la"],
          near: [{ command: "ls", why: "Plain ls hides names that begin with a dot. Add -a (all)." }],
          hint: "ls with -a for all.",
          success: "Four entries plain ls hid: .env, .env.example, .git and .gitignore. .env holds this machine's secrets; .git holds every version of every file.",
        }),
      },
      {
        id: "a-ce-permissions",
        title: "File permissions, where they apply",
        explain:
          "On Linux and macOS, ls -l starts each line with ten characters such as -rw-r--r--. The first is the type (- file, d directory); then three groups of three for the owner, the group and everyone else: r read, w write, x execute. -rw-r--r-- means the owner can read and write, everyone else can only read. Permissions matter on servers: a script needs x to run, and a secrets file should not be readable by everyone. On Windows, Git Bash shows these letters but Windows enforces its own access rules, so treat them there as approximate.",
        example: shown("m2-hidden", "ls -l .env"),
        decision: {
          scenario: "On a Linux server, ls -l shows the production .env as -rw-r--r--, owned by the deploy user.",
          question: "What does that mean, and is it a problem?",
          options: [
            { id: "a", text: "Every account on the server can read the secrets; it should be -rw------- (chmod 600), readable only by its owner", why: "The last r means \"others can read\". For a file of secrets, only the account running the app should." },
            { id: "b", text: "Nobody can read it, so it is safe", whyWrong: "r appears in all three groups: owner, group and others can all read it." },
            { id: "c", text: "It can be executed as a program", whyWrong: "There is no x anywhere in the permissions." },
            { id: "d", text: "Permissions do not matter on servers", whyWrong: "On a shared server they are a main line of defence." },
          ],
          correct: "a",
          aftermath: "chmod 600 .env: owner read and write, nobody else anything.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 9 · 2.5
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ce-l9-search",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 3,
    covers: ["2.5"],
    title: "Searching Filenames, File Contents and References",
    subtitle: "find, grep and ripgrep: the commands that make a big project small",
    estimatedMinutes: 28,
    intro:
      "In a real project you rarely know where something is; you know what it is called. Searching by name and by content is how you go from \"there is a login somewhere\" to the exact file and line in seconds.",

    atoms: [
      {
        id: "a-ce-find-names",
        title: "Finding files by name with find",
        explain:
          "find PLACE -name PATTERN searches a folder and everything beneath it for names matching a pattern (* matches anything; quote the pattern so the shell does not expand it first). -type f limits it to files, -type d to folders, -not -path excludes a path, which you almost always want for node_modules. find answers \"which files exist\", not \"what is in them\".",
        terminalExercise: term("m2-find", {
          goal: "Find every test file (names ending in .test.js) in the project, ignoring installed packages.",
          accept: ['find . -name "*.test.js" -not -path "./node_modules/*"'],
          near: [
            { command: 'find . -name "*.jsx" -not -path "./node_modules/*"', why: "Right technique, wrong pattern: that finds React component files. Test files end in .test.js." },
            { command: "find server -type f", why: "That lists every server file. The tests are elsewhere; search the whole project by name." },
          ],
          hint: "find from . with -name \"*.test.js\", excluding ./node_modules/*.",
          success: "Three test files in tests/: one each for auth, prices and orders. You now know what is tested and, by implication, what is not (no tests for routes or the UI).",
        }),
      },
      {
        id: "a-ce-scale",
        title: "Hundreds of files, or thousands",
        explain:
          "Real projects are big, and almost all of the bulk is not the project's own code. Counting files in and out of node_modules shows where the size really is, and why every search must exclude installed packages unless you are investigating one.",
        terminalExercise: term("m2-find", {
          goal: "Count how many files the installed dependencies (node_modules) contain.",
          accept: ["find node_modules -type f | wc -l"],
          near: [{ command: 'find . -type f -not -path "./node_modules/*" -not -path "./.git/*" | wc -l', why: "That counts the files OUTSIDE node_modules and .git (41). The question is about node_modules itself." }],
          hint: "find node_modules -type f, piped into wc -l.",
          success: "1,965 files of dependencies, against 41 of the project's own. A search that does not exclude node_modules searches fifty times more code than you care about.",
        }),
      },
      {
        id: "a-ce-grep-contents",
        title: "Searching contents with grep",
        explain:
          "grep PATTERN FILE prints the lines of FILE that contain PATTERN. -r searches a folder recursively, -n adds line numbers, -i ignores case, -l prints only the names of matching files, and --exclude-dir skips folders. grep is everywhere: every Linux server and macOS has it, and Git Bash includes it.",
        terminalExercise: term("m2-grep", {
          goal: "Using grep, find every line in the project (outside node_modules) that mentions SESSION_SECRET, with file names and line numbers.",
          accept: ['grep -rn "SESSION_SECRET" --exclude-dir=node_modules .'],
          near: [{ command: "rg SESSION_SECRET", why: "That is ripgrep, the next atom's tool. The goal asks for grep, which is on every server you will ever log in to." }],
          hint: "grep -rn, the pattern in quotes, --exclude-dir=node_modules, and . for \"here\".",
          success: "Six lines: config.js reads it, the test sets one, the README mentions it, .env.example has a placeholder, and .env holds the real value, which grep has just printed on your screen. Hold that thought.",
        }),
      },
      {
        id: "a-ce-ripgrep",
        title: "ripgrep: search built for codebases",
        explain:
          "ripgrep (rg) does what grep -rn does, faster, and with defaults made for code: it searches recursively, shows line numbers in a terminal, and skips everything the project's .gitignore excludes (node_modules, dist, .env) as well as hidden and binary files. rg -l prints only file names, rg -w matches whole words, rg -i ignores case. It is the search engine inside VS Code and many AI coding tools. On Windows it prints paths with backslashes, even in Git Bash.",
        terminalExercise: term("m2-grep", {
          goal: "List just the names of the files that mention requireAuth.",
          accept: ["rg -l requireAuth"],
          near: [
            { command: "rg -w login src", why: "Right tool, wrong word. Search for requireAuth, and use -l to list only file names." },
            { command: "rg SESSION_SECRET", why: "Different word. -l with requireAuth lists only the files that contain it." },
          ],
          hint: "rg with -l (list files) and the word.",
          success: "Two files: where requireAuth is defined (middleware/requireAuth.js) and where it is used (router.js). That is a reference search: every place a name appears.",
        }),
      },
      {
        id: "a-ce-grep-leak",
        title: "What your search prints is what you share",
        explain:
          "Compare the two searches for SESSION_SECRET: grep -r printed the real secret from .env, while rg did not, because rg skips files .gitignore excludes. That difference matters whenever terminal output leaves your machine: a screenshot in a team chat, a log pasted into an issue, or output given to an AI assistant as context.",
        example: [
          shown("m2-grep", 'grep -rn "SESSION_SECRET" --exclude-dir=node_modules .'),
          shown("m2-grep", "rg SESSION_SECRET"),
        ].join("\n\n"),
        decision: {
          scenario: "You want an AI assistant's help understanding how SESSION_SECRET is used, so you plan to paste search output into the chat.",
          question: "Which output should you paste?",
          options: [
            { id: "a", text: "The rg output, after checking it contains no secret values; never output that includes .env", why: "rg respected .gitignore and left .env out. Whatever you paste into a chat tool leaves your machine." },
            { id: "b", text: "The grep output, because it is more complete", whyWrong: "\"More complete\" here means it includes the real secret. Rotate any secret you paste by accident." },
            { id: "c", text: "Either, because AI tools never store anything", whyWrong: "Do not assume. Treat anything you paste as shared." },
            { id: "d", text: "The contents of .env, so the AI has full context", whyWrong: "The AI needs to know how the variable is used, not its value." },
          ],
          correct: "a",
          aftermath: "In Module 9 you will learn what to do when a secret leaks: revoke it and issue a new one.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 10 · 2.6 – 2.7
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ce-l10-pipes",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 4,
    covers: ["2.6", "2.7"],
    title: "Output, Exit Codes, Errors, Pipes, Redirection and Chaining",
    subtitle: "How commands report success, and how to combine them safely",
    estimatedMinutes: 30,
    intro:
      "Every command reports back in three ways: what it prints, what errors it prints, and a number that says whether it worked. Once you can use all three, small commands combine into answers to big questions.",

    atoms: [
      {
        id: "a-ce-exit-codes",
        title: "Exit codes",
        explain:
          "When a command finishes it returns an exit code: 0 means success, anything else means failure (and the number can say which kind). The shell keeps the last one in $? (in PowerShell, $LASTEXITCODE). grep -q prints nothing at all and answers only through its exit code: 0 if it found the pattern, 1 if not. Scripts, CI pipelines and && chains all decide what to do next from exit codes, not from what was printed.",
        terminalExercise: term("m2-pipes", {
          goal: "Check, using only the exit code, whether .env.example mentions STRIPE.",
          accept: ["grep -q STRIPE .env.example; echo $?"],
          near: [
            { command: "grep -q PAYSTACK .env.example; echo $?", why: "That checks for PAYSTACK (0: found). The question is STRIPE." },
            { command: "ls server; echo $?", why: "That shows ls succeeding (0). The goal is to search .env.example for STRIPE." },
          ],
          hint: "grep -q STRIPE .env.example, then echo $? to print the exit code.",
          success: "1: not found. No output, just the number: exactly what a script needs to make a decision.",
        }),
      },
      {
        id: "a-ce-stderr",
        title: "Standard output and standard error",
        explain:
          "Commands write to two separate streams. Standard output (stdout, stream 1) carries the results; standard error (stderr, stream 2) carries messages and errors. They both appear in your terminal, but they can be redirected separately: 2>/dev/null throws away errors, 2>&1 merges errors into the output so both can be saved or piped together. Discarding the message does not change the exit code: the command still failed.",
        terminalExercise: term("m2-pipes", {
          goal: "Run ls on a folder that does not exist, hide its error message, but still see the exit code.",
          accept: ["ls nowhere 2>/dev/null; echo $?"],
          near: [
            { command: "ls nowhere; echo $?", why: "That shows the error message AND the code. Redirect stream 2 to /dev/null to hide the message." },
            { command: "ls nowhere", why: "That prints the error and no code. Hide stream 2, then echo $?." },
          ],
          hint: "2> sends stream 2 (errors) somewhere; /dev/null is the bin.",
          success: "No message, but 2: the failure is still there. Hiding an error never fixes it, which is worth remembering when an AI suggests adding 2>/dev/null to make output \"cleaner\".",
        }),
      },
      {
        id: "a-ce-pipes",
        title: "Pipes",
        explain:
          "A pipe, |, sends one command's output into the next command's input. Each command does one small thing; the pipeline answers the question. sort sorts lines, uniq -c collapses identical neighbouring lines and counts them, wc -l counts lines, head and tail keep the first or last few. Read a pipeline left to right, as a sentence.",
        terminalExercise: term("m2-pipes", {
          goal: "Produce a ranking of who wrote the most commits, by combining small commands with pipes.",
          accept: ["git log --format=%an | sort | uniq -c | sort -rn"],
          near: [{ command: "rg -l import src | wc -l", why: "A pipe, but a different question (how many files import something). Start from git log --format=%an, which prints one author per commit." }],
          hint: "git log --format=%an prints authors; sort; uniq -c counts; sort -rn ranks.",
          success: "Tolu 5, Chidi 3, Amaka 3: the same answer git shortlog gave in Lesson 1, built from four general tools. That is the point of pipes: small tools, any question.",
        }),
      },
      {
        id: "a-ce-redirect",
        title: "Redirection into files",
        explain:
          "> FILE sends a command's output into a file, replacing what was there; >> FILE appends to it. Use it to keep evidence: a list of TODOs before a clean-up, a test log before and after a fix. Be careful: > silently overwrites, and redirecting into the file you are reading (sort data.txt > data.txt) empties it before the command reads it.",
        terminalExercise: term("m2-redirect", {
          goal: "Save the list of TODO and FIXME notes into a file called todo.txt, so you can attach it to your report.",
          accept: ['rg -n "TODO|FIXME" > todo.txt'],
          near: [{ command: "cat todo.txt", why: "That shows the file once it exists. First create it by redirecting the search's output with >." }],
          hint: "Run the search, and redirect its output with > todo.txt.",
          success: "Nothing printed, because the output went into todo.txt instead (cat todo.txt shows it). Now it is evidence you can keep.",
        }),
      },
      {
        id: "a-ce-chaining",
        title: "Chaining commands: ;, && and ||",
        explain:
          "A ; B runs B whatever happened to A. A && B runs B only if A succeeded (exit code 0); A || B runs B only if A failed. && is how you write \"only continue if this worked\": npm run lint && npm test means tests only run if lint passed. Use ; only when you genuinely do not care whether the first command worked.",
        terminalExercise: term("m2-redirect", {
          goal: "Run lint, then the tests (output hidden), and print a success message only if both passed.",
          accept: ['npm run lint && npm test > /dev/null && echo "lint and tests passed"'],
          near: [{ command: 'npm test > test.log 2>&1 && echo "tests passed"', why: "That chains the tests and a message, but skips lint. The goal is lint, then tests, then the message, each only if the previous worked." }],
          hint: "Three commands joined by &&.",
          success: "Lint ran, the tests ran silently, and the message printed because both exited with 0. If lint had failed, nothing after it would have run.",
        }),
      },
      {
        id: "a-ce-safe-delete",
        title: "Deleting safely: look before you remove",
        explain:
          "rm deletes immediately: there is no recycle bin, and rm -rf deletes folders and everything inside without asking. Make a habit of listing exactly what a destructive command will touch before running it: ls or find the same path first, and use dry-run modes where tools offer them. git clean deletes untracked files; git clean -n only says what it WOULD delete.",
        terminalExercise: term("m2-redirect", {
          goal: "You want to remove the scratch files that are not part of the project. First see exactly what git clean would delete, without deleting anything.",
          accept: ["git clean -n"],
          near: [{ command: "cat todo.txt", why: "That reads one file. Ask git clean for a dry run with -n." }],
          hint: "git clean with the dry-run flag.",
          success: "It would remove old-notes.txt and todo.txt. test.log is not listed because *.log is in .gitignore: git clean leaves ignored files alone unless told otherwise (Module 9 shows why that matters).",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 11 · 2.8 – 2.9
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ce-l11-env-shells",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 5,
    covers: ["2.8", "2.9"],
    title: "Environment Variables, PATH, Scripts; Bash and PowerShell",
    subtitle: "How configuration reaches a program, and the two shells you will meet",
    estimatedMinutes: 30,
    intro:
      "A program learns how to behave from its environment: which port, which database, which secret. And depending on the machine, you will type into Bash or PowerShell, which agree on the ideas and disagree on almost every word.",

    atoms: [
      {
        id: "a-ce-env-vars",
        title: "Environment variables",
        explain:
          "An environment variable is a named value the shell passes to every program it starts: PORT=4000, NODE_ENV=production. Programs read them (in Node, process.env.PORT) instead of hard-coding settings, so one codebase runs differently on a laptop and a server. In Bash, NAME=value command sets a variable for that one command only; export NAME=value sets it for the rest of the session; echo $NAME prints it. A variable that is not set reads as empty (undefined in Node).",
        terminalExercise: term("m2-env", {
          goal: "Show that a variable set just for one command reaches the program: run Node with PORT set to 4100 and print it.",
          accept: ['PORT=4100 node -e "console.log(process.env.PORT)"'],
          near: [{ command: 'node -e "console.log(process.env.PORT)"', why: "That runs Node with no PORT set, so it prints undefined. Put PORT=4100 in front of the command." }],
          hint: "NAME=value before the command sets it for that command only.",
          success: "4100. The next command, without the prefix, would print undefined again: the variable lived only for that one run.",
        }),
      },
      {
        id: "a-ce-path",
        title: "PATH: how the shell finds a command",
        explain:
          "When you type node, the shell looks for a program called node in each folder listed in the PATH environment variable, in order, and runs the first one it finds. \"command not found\" means it is in none of them: not installed, or installed somewhere PATH does not include. which node (Get-Command node in PowerShell) shows which file actually runs, the first thing to check when two versions are installed.",
        terminalExercise: term("m2-env", {
          goal: "Find out which file actually runs when you type node.",
          accept: ["which node"],
          near: [{ command: "echo $HOME", why: "That prints your home folder. which shows where a command lives on PATH." }],
          hint: "which, then the command's name.",
          success: "/c/Program Files/nodejs/node: the Windows Node.js install, found on PATH. If a project needed a different Node version, this is the line that would tell you which one you are really using.",
        }),
      },
      {
        id: "a-ce-dev-scripts",
        title: "Running development scripts with the right settings",
        explain:
          "npm start runs the start script from package.json; here it is node --env-file-if-exists=.env server/index.js, which loads the .env file into the environment before the server starts. One subtlety decides a lot of debugging: --env-file does not override a variable that is already set. So a variable given on the command line wins over the same variable in .env.",
        terminalExercise: term("m2-env", {
          goal: ".env says PORT=4000. Start the API on port 4100 instead, without editing any file.",
          accept: ["PORT=4100 npm start"],
          near: [
            { command: "npm start", why: "That starts it with the .env setting, port 4000. Set PORT for this one command." },
            { command: "cat .env", why: "That shows PORT=4000 in .env; the goal is to override it without editing the file." },
          ],
          hint: "Set PORT for the one command, in front of npm start.",
          success: "Listening on 4100: the command-line value won over .env. Keep it in mind for Module 9: a variable set on a server beats whatever .env says.",
        }),
      },
      {
        id: "a-ce-powershell",
        title: "The same work in PowerShell",
        explain:
          "PowerShell is Windows' own shell. Its commands are Verb-Noun cmdlets: Get-Location (pwd), Get-ChildItem (ls; -Force shows hidden items), Get-Content (cat; -TotalCount 5 is like head), Select-String (grep). It passes objects between commands rather than text, so output is formatted in tables. Variables are $env:NAME, set with $env:PORT = '4100'. PowerShell also accepts many familiar aliases (ls, cat, pwd), but their flags differ, so ls -la fails there.",
        table: {
          caption: "Bash and PowerShell equivalents.",
          headers: ["Task", "Bash", "PowerShell"],
          rows: [
            ["Where am I?", "pwd", "Get-Location"],
            ["List, with hidden", "ls -la", "Get-ChildItem -Force"],
            ["First lines", "head -n 5 FILE", "Get-Content FILE -TotalCount 5"],
            ["Search contents", "grep -rn TEXT .", "Get-ChildItem -Recurse | Select-String TEXT"],
            ["Read a variable", "echo $PORT", "$env:PORT"],
            ["Set for the session", "export PORT=4100", "$env:PORT = '4100'"],
            ["Last exit code", "echo $?", "$LASTEXITCODE"],
          ],
        },
        terminalExercise: term("m2-powershell", {
          shell: "powershell",
          intro: "Windows PowerShell, in the same project folder.",
          goal: "In PowerShell, find which server files mention assertConfig, with line numbers.",
          accept: ["Select-String -Path server\\*.js -Pattern assertConfig"],
          near: [
            { command: "Get-ChildItem server", why: "That lists the files; it does not search inside them. Select-String is PowerShell's grep." },
            { command: "Get-ChildItem -Recurse -Path server -Filter *.js | Select-String SESSION_SECRET", why: "Right approach, wrong word: search for assertConfig." },
          ],
          hint: "Select-String, -Path server\\*.js, -Pattern assertConfig.",
          success: "Defined in config.js line 9, imported and called in index.js. Same answer grep would give, in PowerShell's words.",
        }),
      },
      {
        id: "a-ce-bash-vs-ps",
        title: "A Git Bash trap: arguments that start with /",
        explain:
          "Git Bash on Windows tries to be helpful: when it runs a Windows program (rg.exe, node.exe) it converts any argument that looks like a Unix path into a Windows path. An argument starting with /, such as \"/api/login\", becomes C:/Program Files/Git/api/login before the program sees it, so the search silently finds nothing. Linux, macOS and PowerShell do not do this. The fixes: drop the leading slash (\"api/login\"), or turn the conversion off for one command with MSYS_NO_PATHCONV=1.",
        terminalExercise: term("m2-grep", {
          goal: "rg -n \"/api/login\" printed nothing, yet the login URL is used in the code. Run the search so that Git Bash does not rewrite the pattern.",
          accept: ['MSYS_NO_PATHCONV=1 rg -n "/api/login"', 'rg -n "api/login"'],
          near: [{ command: 'rg -n "/api/login"', why: "That is the search Git Bash rewrites. Turn conversion off with MSYS_NO_PATHCONV=1, or search without the leading slash." }],
          hint: "Prefix the command with MSYS_NO_PATHCONV=1, or leave out the first /.",
          success: "Found: the frontend's API call (src/api/auth.js) and the route (server/router.js). An empty search result is not proof of absence; on Git Bash, check for this trap first.",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 12 · 2.P
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ce-l12-investigate",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 6,
    covers: ["2.P"],
    title: "Practical: Investigate a Project from the Terminal",
    subtitle: "Entry point, routing, configuration, authentication and data, without opening an editor",
    estimatedMinutes: 32,
    intro:
      "Five questions every developer asks of a new project, answered with the commands from this module. Each answer is one search; together they are a map.",

    atoms: [
      {
        id: "a-ce-inv-entry",
        title: "Where does it start?",
        explain:
          "An entry point is the file that runs first. For a Node server it is usually the file that creates the server and calls listen(); for a React app it is the file that calls createRoot(). Searching for those two calls finds both entry points at once, and the start and dev scripts in package.json confirm them.",
        terminalExercise: term("m2-investigate", {
          goal: "Find the entry point of both applications: the file that creates the server and the file that mounts the React app.",
          accept: ['rg -l "createServer|createRoot"'],
          near: [{ command: "npm pkg get scripts.start scripts.dev", why: "That shows how each is started (server/index.js and vite). Searching for the calls that start them finds both entry files directly." }],
          hint: "Search for either createServer or createRoot, listing file names.",
          success: "server/index.js (the API) and src/main.jsx (the browser app). Everything else is reached from these two files.",
        }),
      },
      {
        id: "a-ce-inv-routes",
        title: "What URLs does it answer?",
        explain:
          "Routing is the code that decides which function handles which URL. Frameworks spell it differently (app.get in Express, @GetMapping in Spring, path() in Django) but every API has it. In Kobo Market the table is in server/router.js, one line per route with its method in quotes, so a search for those lines lists the whole API.",
        terminalExercise: term("m2-investigate", {
          goal: "List every route the API defines, with its HTTP method and line number.",
          accept: [ROUTES_PATTERN],
          near: [{ command: 'rg -l "createServer|createRoot"', why: "That finds the entry points. The routes are the GET and POST lines in server/router.js." }],
          hint: "Search server/router.js for lines containing [\"GET\" or [\"POST\".",
          success: "Five routes: login, me, the product list, one product, and creating an order. Two are wrapped in requireAuth, so they need a signed-in user.",
        }),
      },
      {
        id: "a-ce-inv-config",
        title: "What configuration does it read?",
        explain:
          "Configuration that changes between machines comes from environment variables. Searching for where the code reads them (process.env in Node, os.environ in Python, System.getenv in Java) gives you the full list of settings the application depends on, which is exactly the list a deployment must provide.",
        terminalExercise: term("m2-investigate", {
          goal: "Find every environment variable the code reads.",
          accept: ['rg -n "process\\.env" server src'],
          near: [{ command: 'rg -n "readFile|writeFile" server', why: "That finds file access (the data). Configuration is read from process.env." }],
          hint: "Search server and src for process.env (escape the dot).",
          success: "All four are read in one file, server/config.js: PORT, SESSION_SECRET, DATA_FILE, PAYSTACK_SECRET_KEY. One place for configuration is a good sign. (The frontend's VITE_API_URL is read as import.meta.env, a Vite convention you will meet in Module 9.)",
        }),
      },
      {
        id: "a-ce-inv-auth",
        title: "Where is authentication?",
        explain:
          "Authentication code usually has a recognisable vocabulary: auth, login, session, token, password. Search for the names you already know (authService, requireAuth) to find every file involved in signing in and protecting routes.",
        terminalExercise: term("m2-investigate", {
          goal: "List every file that uses either authService or requireAuth.",
          accept: ['rg -l "authService|requireAuth"'],
          near: [{ command: 'rg -n "process\\.env" server src', why: "That finds configuration. Search for the two auth names instead." }],
          hint: "rg -l with authService|requireAuth.",
          success: "Five files: the middleware, the router, the login route, and two you might not expect: the seed script (which hashes the demo passwords) and the test. authService.js itself is not listed, because it never mentions its own name. Authentication touches more than the login page.",
        }),
      },
      {
        id: "a-ce-inv-db",
        title: "Where does data live?",
        explain:
          "Find data access by searching for what talks to storage: query, find, save, SQL keywords, an ORM's name, or, as here, file reads and writes. The aim is to know which file is the only door to the data, if there is one.",
        terminalExercise: term("m2-investigate", {
          goal: "Find every place the server reads or writes files, which is where Kobo Market keeps its data.",
          accept: ['rg -n "readFile|writeFile" server'],
          near: [{ command: 'rg -l "authService|requireAuth"', why: "That finds authentication. Data is read and written with readFile and writeFile." }],
          hint: "Search server for readFile or writeFile.",
          success: "Only server/db/index.js reads and writes the data (and the seed script creates it). Every other file reaches the data through that one module: the data layer.",
        }),
      },
    ],

    task: {
      title: "Module practical: investigate a project from the terminal",
      intro:
        "On the project you chose in Module 1 (or a larger one: aim for hundreds of files), answer each question using only the terminal. Record each command and the part of its output that answers the question.",
      prompts: [
        "How many files does the project track (git ls-files | wc -l), and how many are in the folder in all?",
        "Entry point(s): which file starts each application, and how do you know?",
        "Routing: where are the URLs or pages defined? List them.",
        "Configuration: every environment variable or config file the code reads.",
        "Authentication: every file involved in signing in or protecting access.",
        "Data: where the code reads and writes its data, and whether one module is the only door to it.",
        "Do it in both Bash and PowerShell for at least two questions, and note one difference you hit.",
      ],
      closing: "Next module: project archaeology, reading a project's manifests, structure and configuration in depth.",
    },
    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
