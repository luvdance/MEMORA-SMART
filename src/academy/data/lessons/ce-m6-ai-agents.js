/**
 * CODEBASE ENGINEERING · MODULE 6 · AI CODING ASSISTANTS AND AGENTS
 *
 * Curriculum 6.1 – 6.10 and the practical, 6.P. Assistants versus agents
 * and the four tools named in the curriculum (Cursor, Claude Code, GitHub
 * Copilot, OpenAI Codex), taught through the concepts they share; mapping a
 * project before changing it; focused questions; the right context; targeted
 * references; tracing with AI; instruction files (AGENTS.md, CLAUDE.md);
 * context windows, stale context and hallucinations; reviewing diffs against
 * explanations; delegating with oversight.
 *
 * AI tools change monthly, so lessons teach what transfers between them and
 * describe products only by capabilities they have had for some time. Every
 * claim an "AI" makes in a lesson is checked against the real project in a
 * recorded terminal: that checking is the skill.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

import { term, JS } from "./ce-helpers.js";

export const SECTION_ID = "ce-s6-ai-agents";
const MODULE = "ce-m6-ai-agents";

const TOP_LEVEL = "git ls-files | sed 's|/.*||' | sort | uniq -c";
const AGENT_RANGE_STAT = "git diff --stat main...agent/first-name-greeting";
const AGENT_RANGE_CONFIG = "git diff main...agent/first-name-greeting -- eslint.config.js package.json";

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 32 · 6.1
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ce-l32-assistants-agents",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 1,
    covers: ["6.1"],
    title: "Assistants, Agents, and the Tools You Will Meet",
    subtitle: "Cursor, Claude Code, GitHub Copilot and OpenAI Codex, through the ideas they share",
    estimatedMinutes: 26,
    intro:
      "There are many AI coding tools and they change every few months. You do not need to master all of them. Learn the shared ideas once, use one tool well, and you can pick up any other in an afternoon.",

    atoms: [
      {
        id: "a-ce-assist-vs-agent",
        title: "Assistants and autonomous agents",
        explain:
          "An AI coding assistant works turn by turn inside your editor or a chat: it completes code as you type, answers questions, and proposes edits that you accept or reject. An AI coding agent is given a goal and works in a loop on its own: it searches and reads files, edits several of them, runs commands and tests, reads the results, and keeps going until it believes the task is done. Most current tools offer both modes. The difference that matters is control: with an assistant you approve each step; with an agent you set the task and the limits up front, and review the result.",
        table: {
          caption: "Assistant mode and agent mode.",
          headers: ["", "Assistant", "Agent"],
          rows: [
            ["You give it", "A question or a small edit", "A task with a goal"],
            ["It does", "Suggests; you apply", "Reads, edits, runs commands, iterates"],
            ["You review", "Each suggestion as it comes", "The finished diff, logs and test results"],
            ["Main risk", "Accepting a suggestion unread", "Many changes you did not watch happen"],
          ],
        },
        decision: {
          scenario: "You need to rename a function used in 40 files and update the tests.",
          question: "Which mode suits it, and what must you do afterwards?",
          options: [
            { id: "a", text: "Agent mode: it can search, edit all 40 files and run the tests; then you review the whole diff and the test results", why: "Repetitive, multi-file, checkable by tests: a good agent task, as long as the review happens." },
            { id: "b", text: "Assistant mode, accepting each suggestion without reading", whyWrong: "Slower, and accepting unread suggestions is the risk, not the remedy." },
            { id: "c", text: "Neither: AI cannot rename functions", whyWrong: "This is one of the tasks agents do well." },
            { id: "d", text: "Agent mode, and merge as soon as it says it is done", whyWrong: "The agent's report is a claim. The diff and the tests are the evidence." },
          ],
          correct: "a",
          aftermath: "Delegate the typing; keep the reviewing.",
        },
      },
      {
        id: "a-ce-tool-landscape",
        title: "Four tools, side by side",
        explain:
          "Cursor is a code editor built on VS Code with AI throughout: chat that understands your codebase, multi-file edits, and an agent mode, with review of each change in the editor. Claude Code is Anthropic's agentic coding tool, used from the terminal (and from IDE extensions and the web): it explores a repository, edits files, runs commands and tests, and works with Git, reading project instructions from CLAUDE.md. GitHub Copilot lives in your editor (completions, chat, edits and an agent mode) and on GitHub, where its coding agent can be assigned an issue and opens a pull request. OpenAI Codex is OpenAI's coding agent, available as a CLI, an IDE extension and cloud tasks that work on your repository and propose changes for review, reading instructions from AGENTS.md.",
        table: {
          caption: "Where each tool lives and what it is best known for.",
          headers: ["Tool", "Lives in", "Known for"],
          rows: [
            ["Cursor", "Its own editor (a VS Code fork)", "Codebase-aware chat, multi-file edits, agent mode, in-editor review"],
            ["Claude Code", "The terminal; IDEs; web", "Exploring repositories, editing, running commands and Git workflows; CLAUDE.md"],
            ["GitHub Copilot", "VS Code, JetBrains and others; GitHub", "Completions, chat, agent mode; a coding agent that turns issues into pull requests"],
            ["OpenAI Codex", "CLI, IDE extension, cloud", "Delegated tasks in a sandbox, proposed as changes to review; AGENTS.md"],
          ],
        },
        decision: {
          scenario: "Your team already uses GitHub for everything, and wants routine, well-described issues turned into pull requests that go through normal review.",
          question: "Which capability fits best?",
          options: [
            { id: "a", text: "A coding agent that takes a GitHub issue and opens a pull request, such as Copilot's coding agent (Codex cloud tasks and Claude Code can be wired into the same flow)", why: "The work arrives as a PR, which means it meets the same checks and review as everyone else's." },
            { id: "b", text: "Inline completions only", whyWrong: "Completions help someone typing; they do not take an issue end to end." },
            { id: "c", text: "Letting an agent push directly to main", whyWrong: "That skips the review the team relies on." },
            { id: "d", text: "None: AI cannot work with issues", whyWrong: "Several tools do exactly this." },
          ],
          correct: "a",
          aftermath: "Choose by where the work must end up: in your editor, in your terminal, or as a pull request.",
        },
      },
      {
        id: "a-ce-shared-concepts",
        title: "What transfers between every tool",
        explain:
          "Whatever the brand, the same few ideas decide whether an AI helps or harms: what context it has (which files, errors and instructions it can see), what it is allowed to do (read, edit, run commands, use the network), where its instructions live (CLAUDE.md, AGENTS.md, Copilot's instructions file, Cursor's rules), how you review its output (diffs, tests, logs), and how much of the project fits in its context window. This module teaches those ideas; the practicals let you use whichever tool you have.",
        decision: {
          scenario: "Your company switches from one AI coding tool to another.",
          question: "Which of your skills carries over unchanged?",
          options: [
            { id: "a", text: "Giving focused context, writing instruction files, setting permissions, and reviewing diffs against tests", why: "These are properties of working with any AI on a codebase, not of one product." },
            { id: "b", text: "The keyboard shortcuts", whyWrong: "Those are the part that changes." },
            { id: "c", text: "Nothing: each tool needs a new way of working", whyWrong: "The interface changes; the discipline does not." },
            { id: "d", text: "Trusting the tool's summaries", whyWrong: "That was never a skill, with any tool." },
          ],
          correct: "a",
          aftermath: "Tools come and go; the review discipline stays.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 33 · 6.2 – 6.3
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ce-l33-map-first",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 2,
    covers: ["6.2", "6.3"],
    title: "Map Before You Modify; Ask Focused Questions",
    subtitle: "Using AI to understand a project, and checking what it tells you",
    estimatedMinutes: 30,
    intro:
      "The most valuable thing an AI can do on an unfamiliar project is not write code: it is read the code faster than you can and tell you what is there. Ask it to map first, then ask narrow questions, and verify the answers.",

    atoms: [
      {
        id: "a-ce-map-prompt",
        title: "Asking AI to map a project before changing it",
        explain:
          "Your first instruction on an unfamiliar project should forbid changes and ask for a map: entry points, structure, data flow, configuration, how to run and test it, and what it is unsure about. An agent will search and read the repository to answer. You get the same picture you built by hand in Modules 2 and 3, in minutes, and then you check it.",
        example:
          "Do not change any files. Explore this repository and give me:\n1. What the application does, and its stack with versions (from the manifests).\n2. The entry point of each application and how to start, test and build it.\n3. The main folders and what each is for.\n4. The data flow for one feature (sign-in), file by file.\n5. Every environment variable it reads, and where.\n6. Anything you could not determine, or are unsure of.\nCite a file (and line where possible) for every claim.",
        decision: {
          scenario: "You give an agent a new repository and type: \"Add a discount code to checkout.\"",
          question: "What is wrong with starting this way?",
          options: [
            { id: "a", text: "It changes code before anyone (you or the agent) has a checked understanding of how checkout and pricing work; ask for a map first, with no changes", why: "Changes made on a guessed understanding are how the cart and server ended up with different rules." },
            { id: "b", text: "Nothing: agents understand everything instantly", whyWrong: "They read quickly, but they still guess where the code is ambiguous, and you cannot review a guess you have not seen." },
            { id: "c", text: "The request is too short; it should be one page long", whyWrong: "Length is not the issue; order is. Understand, then change." },
            { id: "d", text: "Agents cannot work on checkout code", whyWrong: "They can. The question is whether anyone understands the result." },
          ],
          correct: "a",
          aftermath: "Same rule as Module 1, now for the AI: understand before you change.",
        },
      },
      {
        id: "a-ce-verify-claims",
        title: "Verifying what the map says",
        explain:
          "AI maps are usually mostly right and confidently wrong in places. Every claim that matters gets one check: a search, a file read, a command. Where the map cites a file and line, open it; where it does not, find it. Treat an unverified claim the way you treated the README in Module 1.",
        terminalExercise: term("m6-verify-claims", {
          intro: "An AI's project map says: \"Passwords are hashed with bcrypt.\"",
          goal: "Check that claim against the code.",
          accept: ['rg -n "bcrypt|scrypt" server'],
          near: [{ command: "npm ls bcrypt", why: "That shows bcrypt is not installed, a strong hint. Search the code to see what IS used." }],
          hint: "Search server for either bcrypt or scrypt.",
          success: "scryptSync from node:crypto, at authService.js:8. No bcrypt anywhere. A plausible guess (bcrypt is common), stated as fact, and wrong. Your corrected map says scrypt.",
        }),
      },
      {
        id: "a-ce-verify-absence",
        title: "Checking a claim about something that is not there",
        explain:
          "Some AI claims describe things that do not exist at all: a Redis cache, a migrations folder, an admin dashboard. A search that finds nothing is the evidence. Note that an empty search is only evidence if the search was right: check the spelling, use -i for case, and (on Git Bash) mind the leading-slash trap.",
        terminalExercise: term("m6-verify-claims", {
          intro: "The same map says: \"Sessions are stored in Redis.\"",
          goal: "Check whether Redis appears anywhere in the project, in any capitalisation.",
          accept: ["rg -il redis"],
          near: [{ command: 'rg -n "createHmac|timingSafeEqual" server', why: "That shows how tokens really work. First test the claim itself: search for redis, case-insensitively." }],
          hint: "rg with -i (ignore case) and -l.",
          success: "Nothing, anywhere. Sessions are signed tokens kept by the browser (Module 4), not server-side records in Redis. A whole component of the map was invented.",
        }),
      },
      {
        id: "a-ce-focused-question",
        title: "Focused questions about one function",
        explain:
          "Broad questions (\"explain the auth system\") get broad, partly guessed answers. Focused questions get checkable ones: name the file and function, ask about one behaviour, and ask for the line that decides it. \"In server/services/authService.js, when does verifyToken return null? Quote each line that causes it.\" You can verify that answer in a minute.",
        terminalExercise: term("m6-verify-claims", {
          intro: "You asked: \"Do Kobo Market's tokens expire?\" The AI answered: \"No, tokens are valid forever.\"",
          goal: "Check the answer by finding the token lifetime in the code.",
          accept: ["rg -n TOKEN_LIFETIME_MS server"],
          near: [{ command: 'rg -n "createHmac|timingSafeEqual" server', why: "That shows signing and comparison. The expiry is a lifetime constant: search for TOKEN_LIFETIME_MS." }],
          hint: "The constant is called TOKEN_LIFETIME_MS.",
          success: "One week (line 5), enforced at line 34: an older token returns null. The AI's answer was wrong. Asking \"which line decides?\" would have exposed that it had not read line 34.",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 34 · 6.4 – 6.5
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ce-l34-context",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 3,
    covers: ["6.4", "6.5"],
    title: "Giving the Right Context, and Pointing at the Right Files",
    subtitle: "Errors, logs and diffs, verbatim; targeted references instead of the whole project",
    estimatedMinutes: 30,
    intro:
      "An AI's answer can only be as good as what it is given. The exact error, the exact diff and the files involved beat a paragraph of description, and a few precise references beat \"here is my whole project\".",

    atoms: [
      {
        id: "a-ce-give-context",
        title: "The exact error, not a description of it",
        explain:
          "\"Login is broken\" gives the model nothing to reason from. The verbatim failure does: the test name, the assertion, the file and line, the stack. Copy it exactly, including the parts you do not understand: they are often the parts that matter. Trim only what is clearly repeated or irrelevant, and never include secrets.",
        terminalExercise: term("m6-context", {
          intro: "The AI's 12-file change from Module 5 is applied, and sign-in is broken.",
          goal: "Capture the last 16 lines of the test output, errors included, to give the AI as context.",
          accept: ["npm test 2>&1 | tail -n 16"],
          near: [{ command: "git diff --stat", why: "That is useful context too, but first capture the failure itself: the test output, with stderr merged (2>&1)." }],
          hint: "npm test, merge stderr into stdout, keep the last 16 lines.",
          success: "The assertion (false !== true), the file and line (authService.test.js:10) and the stack. Pasted with \"this test started failing after the change below\", that is enough for a model to look at verifyPassword.",
        }),
      },
      {
        id: "a-ce-context-diff",
        title: "The change, compactly",
        explain:
          "When something broke after a change, the diff is the most important context there is. git diff -U1 shows each change with one line of context instead of three, which keeps it short enough to paste whole. Diff plus failure plus \"what was the change supposed to do\" is usually all a model needs.",
        terminalExercise: term("m6-context", {
          goal: "Produce a compact diff of the auth service, with just one line of context around each change.",
          accept: ["git diff -U1 server/services/authService.js"],
          near: [{ command: "npm test 2>&1 | tail -n 16", why: "You have the failure. Now the change that caused it: git diff -U1 of authService.js." }],
          hint: "git diff with -U1 and the file.",
          success: "Two hunks, nine lines each. The first one (the missing \"hex\") is the cause, and a model given this and the failure can say so.",
        }),
      },
      {
        id: "a-ce-context-choice",
        title: "What to include, and what never to",
        explain:
          "Good context is specific and complete for the question: the failing output, the relevant diff, the files involved (or references to them), what you expected and what happened, and what you have already tried. Never include: secrets and .env files, real customers' data, or production credentials. When in doubt about a log, look for tokens, emails and keys before pasting.",
        decision: {
          scenario: "You want help with the broken sign-in. You have: the test output, the diff, the whole repository, the .env file, and a log excerpt from production containing customers' emails.",
          question: "What do you give the model?",
          options: [
            { id: "a", text: "The test output, the diff of authService.js, and a note on what the change was meant to do", why: "Exactly the evidence the question needs, and nothing that should not leave your machine." },
            { id: "b", text: "Everything, so it has full context", whyWrong: "That includes secrets and personal data, and buries the signal in noise." },
            { id: "c", text: "The .env file, in case the secret is wrong", whyWrong: "The test sets its own secret; and secrets never go into prompts." },
            { id: "d", text: "Only \"login is broken, please fix\"", whyWrong: "Too little to reason from; it will guess." },
          ],
          correct: "a",
          aftermath: "Specific, complete, and safe to share.",
        },
      },
      {
        id: "a-ce-targeted-refs",
        title: "Targeted references instead of the whole project",
        explain:
          "Every tool lets you point at files instead of pasting them: Cursor's @ mentions (@Files, @Folders), Claude Code's @path references, Copilot Chat's #file. Agents can also run searches themselves. Pointing at three relevant files gets a sharper answer than attaching fifty: the model has less to wade through, and less room to latch onto the wrong file.",
        table: {
          caption: "Referencing files directly.",
          headers: ["Tool", "Reference a file", "It can also"],
          rows: [
            ["Cursor", "@ mentions (files, folders, symbols)", "Search an index of the whole codebase"],
            ["Claude Code", "@path/to/file in the prompt", "Search with its own tools (like the rg you use)"],
            ["GitHub Copilot Chat", "#file, or files open in the editor", "Search the workspace"],
            ["OpenAI Codex", "Name the paths in the task", "Search and read the repository itself"],
          ],
        },
        decision: {
          scenario: "Your question is: \"Why does the cart page show a different delivery charge from the server?\"",
          question: "Which context is best?",
          options: [
            { id: "a", text: "References to src/pages/Cart.jsx and server/services/orderService.js, plus the customer's example (₦59,500 cart)", why: "The two files that hold the two rules, and a concrete case: the model can compare them directly." },
            { id: "b", text: "The whole repository, with \"find the bug\"", whyWrong: "It may find it, or it may chase something else. You already know where to look." },
            { id: "c", text: "node_modules/react", whyWrong: "Third-party code is not involved." },
            { id: "d", text: "No files: describe the bug in words", whyWrong: "Then it must guess what the code says." },
          ],
          correct: "a",
          aftermath: "Your Module 2 to 4 skills decide what you point the AI at.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 35 · 6.6 – 6.7
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ce-l35-trace-instructions",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 4,
    covers: ["6.6", "6.7"],
    title: "Tracing with AI, and Project Instruction Files",
    subtitle: "Multi-file explanations you can check, and AGENTS.md and CLAUDE.md",
    estimatedMinutes: 30,
    intro:
      "Tracing a feature across files is tedious for people and quick for AI, so it is a good job to delegate, as long as every hop comes back with a file and line you can check. And a single file at the root can tell every agent how your project works before it starts.",

    atoms: [
      {
        id: "a-ce-ai-trace",
        title: "Asking AI to trace a feature across files",
        explain:
          "Ask for the trace in the format you would write yourself (Module 4): each hop as file:line function, in order, both ways, with early exits. Then check a sample of the hops, starting with the ones that would matter most if wrong. An AI that is asked for line numbers has to actually read the code; one asked for a summary can paraphrase from memory.",
        terminalExercise: term("m6-map", {
          intro: "An AI's trace of the frontend says: \"The browser calls three API endpoints: /api/login, /api/products and /api/orders.\"",
          goal: "Check which API paths the frontend's API modules actually call.",
          accept: ['rg -n -F "api/" src/api'],
          near: [{ command: 'rg -l "fetch\\("', why: "That shows where requests are sent from (one client). Search the API modules for the paths themselves." }],
          hint: "Search src/api for the fixed text api/.",
          success: "Exactly three: /api/login, /api/products (with an optional query), /api/orders. The claim holds. Note /api/me exists on the server but the frontend never calls it: worth a line in the map.",
        }),
      },
      {
        id: "a-ce-ai-deps",
        title: "Asking AI to explain dependencies",
        explain:
          "AI is good at answering \"what does this project depend on, and what for?\": it can read the manifest, the imports and the lockfile together. Ask it to separate direct from transitive dependencies, runtime from development, and used from merely installed, then check the claims about use with a search.",
        terminalExercise: term("m6-map", {
          intro: "The AI's dependency overview says: \"Network requests are made with axios throughout the app.\"",
          goal: "Find every file that actually makes network requests.",
          accept: ['rg -l "fetch\\("'],
          near: [{ command: 'rg -n -F "api/" src/api', why: "That lists the URLs. Find what actually makes the requests: search for fetch(." }],
          hint: "Search for fetch( across the project, listing files.",
          success: "Two files use fetch: src/api/client.js and server/payments/paystack.js. axios is installed but never used (Module 4). The AI read package.json and assumed.",
        }),
      },
      {
        id: "a-ce-agents-md",
        title: "Project instruction files",
        explain:
          "An instruction file sits at the repository root and is read automatically by agents before they work: AGENTS.md (an open format read by OpenAI Codex and many other tools), CLAUDE.md (read by Claude Code), .github/copilot-instructions.md (GitHub Copilot) and Cursor's project rules. It tells the agent what a new teammate would need on day one: what the project is, how to install, test and run it, the conventions, and the rules that must not be broken.",
        terminalExercise: term("m6-agents-md", {
          goal: "Read the instructions this repository gives AI agents.",
          accept: ["cat AGENTS.md"],
          near: [{ command: "ls *.md", why: "That shows AGENTS.md exists beside the README. Read it." }],
          hint: "cat AGENTS.md.",
          success: "What the project is, the four commands, and seven rules, including two that would have stopped Module 5's AI: never weaken eslint.config.js, and list every file you touched.",
        }),
      },
      {
        id: "a-ce-instruction-content",
        title: "What belongs in an instruction file",
        explain:
          "Keep it short, specific and true: facts the agent cannot cheaply discover (how to run the tests, which commands are safe), conventions it would otherwise get wrong (money in kobo), and hard rules (never touch .env, never weaken lint). Do not paste the whole README, vague advice (\"write good code\"), or anything secret. Review changes to it like code: it steers every future AI change.",
        decision: {
          scenario: "A teammate proposes adding these lines to AGENTS.md.",
          question: "Which one belongs?",
          options: [
            { id: "a", text: "\"Prices are integers in kobo. Never compute money with floating point.\"", why: "A project-specific convention an agent would plausibly get wrong, stated as a checkable rule." },
            { id: "b", text: "\"Write clean, high-quality code.\"", whyWrong: "Vague; it changes nothing an agent does." },
            { id: "c", text: "\"The production database password is ...\"", whyWrong: "Never put secrets in a committed file, let alone one fed to AI tools." },
            { id: "d", text: "A full copy of the README", whyWrong: "Duplicates the README and goes stale. Link to it." },
          ],
          correct: "a",
          aftermath: "Specific, true, and short enough to be read every time.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 36 · 6.8 – 6.9
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ce-l36-limits-review",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 5,
    covers: ["6.8", "6.9"],
    title: "Context Windows, Stale Context, Hallucinations; Checking Explanations Against Code",
    subtitle: "Why AI is wrong in the ways it is, and how to catch it",
    estimatedMinutes: 32,
    intro:
      "AI tools fail in predictable ways. Knowing the mechanisms (limited context, outdated context, plausible invention, partial explanations) tells you where to look, and the remedy is always the same: compare what it says with what the code and the diff show.",

    atoms: [
      {
        id: "a-ce-context-window",
        title: "Context windows",
        explain:
          "A model can only consider a limited amount of text at once, its context window, measured in tokens (roughly three-quarters of a word each). Everything counts: your messages, the files it read, command output, its own replies. Large projects do not fit, so tools search and read selectively, and long sessions summarise or drop earlier material. What is not in the window, the model does not know, however confident it sounds.",
        decision: {
          scenario: "Two hours into a session, the agent suggests a change that contradicts a rule you gave it at the start.",
          question: "What is the likely cause, and the remedy?",
          options: [
            { id: "a", text: "The early instruction has fallen out of (or been summarised away from) its context; put durable rules in the instruction file, or start a fresh session with a short summary", why: "Instruction files are re-read; early chat messages in long sessions are not reliably kept." },
            { id: "b", text: "The model is being deliberately disobedient", whyWrong: "It is a limit of context, not intent." },
            { id: "c", text: "Repeat the whole conversation back to it", whyWrong: "That fills the window further. Keep rules in the instruction file; keep sessions focused." },
            { id: "d", text: "The rule must have been wrong", whyWrong: "Nothing suggests that." },
          ],
          correct: "a",
          aftermath: "Short, focused sessions; durable rules in files.",
        },
      },
      {
        id: "a-ce-stale-context",
        title: "Stale context",
        explain:
          "Context goes stale when the code changes after the model read it: a file it read an hour ago was since edited, a teammate merged a rename, or its training data describes an older version of a library. Stale context produces code that would have been right yesterday. Before acting on an AI change, make sure it was based on the current state: re-read, pull, re-run.",
        decision: {
          scenario: "An agent's change calls formatNaira() from src/utils. The function was renamed to formatPrice() in a commit merged this morning, and the change does not run.",
          question: "What happened, and how do you prevent it?",
          options: [
            { id: "a", text: "The agent worked from an outdated view of the code; pull and let it re-read before it works, and keep the tests in its loop so a stale call fails immediately", why: "Current code plus running the tests catches stale assumptions before review." },
            { id: "b", text: "The rename was a mistake; revert it", whyWrong: "The rename is fine. The agent's view was old." },
            { id: "c", text: "Add a formatNaira alias to keep the agent happy", whyWrong: "That adds clutter to cover a process gap." },
            { id: "d", text: "Agents cannot be used on active projects", whyWrong: "They can, with fresh context and tests." },
          ],
          correct: "a",
          aftermath: "Fresh context, then tests: cheap and decisive.",
        },
      },
      {
        id: "a-ce-hallucination",
        title: "Hallucinations: plausible and wrong",
        explain:
          "A hallucination is a confident statement with no basis: a function that does not exist, a parameter it does not take, a field it does not return. They are dangerous because they look exactly like correct answers. An AI explaining orderTotals said it \"returns { subtotal, deliveryFee, total }\". Here is the real function. Run it in your head.",
        codeExercise: {
          language: JS,
          code:
            "// server/services/orderService.js, exactly as committed\nconst DELIVERY_FEE = 150000;\nconst FREE_DELIVERY_FROM = 5000000;\n\nfunction orderTotals(lines) {\n  const subtotal = lines.reduce((sum, line) => sum + line.price * line.quantity, 0);\n  const delivery = subtotal >= FREE_DELIVERY_FROM ? 0 : DELIVERY_FEE;\n  return { subtotal, delivery, total: subtotal + delivery };\n}\n\nconst totals = orderTotals([{ price: 1590000, quantity: 1 }]);\nconsole.log(Object.keys(totals).join(\",\"));\nconsole.log(totals.deliveryFee);\n",
          question: "What does it print?",
          expectedOutput: "subtotal,delivery,total\nundefined",
          hint: "Read the return statement's field names exactly.",
          successMessage: "The field is delivery, not deliveryFee. Code written from the AI's explanation would read totals.deliveryFee and get undefined, silently. Explanations are claims; the code is the fact.",
        },
      },
      {
        id: "a-ce-diff-vs-claim",
        title: "Checking an agent's report against its diff",
        explain:
          "Agents end with a summary: what they did, which files, what they tested. Treat it as a claim and check it against git: the files changed, the size of each change, and whether anything outside the stated scope moved. A summary that does not match the diff is a reason to read every line.",
        terminalExercise: term("m6-agent-branch", {
          intro: "An agent worked on the branch agent/first-name-greeting. Its summary: \"Updated 4 files: authService, requireAuth, Navbar and Login. Tests pass.\"",
          goal: "Check how many files the agent's branch really changed compared with main.",
          accept: [AGENT_RANGE_STAT],
          near: [{ command: "git log --oneline main..agent/first-name-greeting", why: "That shows one commit. See what it changed with git diff --stat main...BRANCH." }],
          hint: "git diff --stat with main...agent/first-name-greeting (three dots: changes on the branch since it left main).",
          success: "12 files, not 4: including eslint.config.js and package.json, which the summary never mentions. And \"tests pass\" is false: this is Module 5's broken change. Never merge on the summary.",
        }),
      },
      {
        id: "a-ce-incomplete",
        title: "Incomplete explanations",
        explain:
          "An explanation can be accurate and still incomplete: it describes the happy path and leaves out the early returns, the error handling or the side effects. Before relying on an explanation, ask: what happens when it fails? What else does it change? Then check those parts yourself.",
        decision: {
          scenario: "Asked how an order is created, the AI says: \"createOrder computes totals with orderTotals, saves the order and returns it.\"",
          question: "What important part is missing?",
          options: [
            { id: "a", text: "It also calls Paystack (initializePayment) and returns a payment URL, and it rejects empty carts and unknown products before saving", why: "Accurate as far as it goes, but it omits an external integration and the validation, exactly the parts that fail in production." },
            { id: "b", text: "Nothing: it is complete", whyWrong: "You read routes/orders.js in Module 3: four imports, including payments." },
            { id: "c", text: "It should mention React", whyWrong: "createOrder is on the server." },
            { id: "d", text: "It should list every line of code", whyWrong: "Completeness means the behaviours that matter, not every line." },
          ],
          correct: "a",
          aftermath: "Ask about failures and side effects, then check them.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 37 · 6.10
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ce-l37-delegation",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 6,
    covers: ["6.10"],
    title: "Delegating to an Agent While Keeping Control",
    subtitle: "Scope, permissions, a branch of its own, and review before anything is merged",
    estimatedMinutes: 30,
    intro:
      "Delegating to an agent is like delegating to a fast, tireless junior developer who never says \"I'm not sure\". Give a clear task, limit what it can touch, have it work on its own branch, and review everything before it reaches main.",

    atoms: [
      {
        id: "a-ce-delegate-scope",
        title: "A well-scoped task",
        explain:
          "A good agent task has one goal, a definition of done that can be checked (tests pass, a specific behaviour), the files or area it should work in, and explicit limits (no new dependencies, do not change configuration). Vague or sprawling tasks produce sprawling diffs.",
        decision: {
          scenario: "Choose the task to give an agent.",
          question: "Which is well scoped?",
          options: [
            { id: "a", text: "\"In src/pages/Cart.jsx, use orderTotals from the server's rule so the cart shows free delivery from ₦50,000. Add a test. Do not change other files' behaviour or add dependencies. Done when npm test and npm run lint pass.\"", why: "One goal, a place, limits, and a checkable definition of done." },
            { id: "b", text: "\"Improve the cart.\"", whyWrong: "No goal, no limits, no way to know when it is done." },
            { id: "c", text: "\"Refactor the whole frontend and fix any bugs you find.\"", whyWrong: "Unbounded: the diff will be unreviewable." },
            { id: "d", text: "\"Fix the cart, you know what I mean.\"", whyWrong: "It does not." },
          ],
          correct: "a",
          aftermath: "If you cannot say when it is done, neither can the agent.",
        },
      },
      {
        id: "a-ce-agent-permissions",
        title: "Permissions: what the agent may do",
        explain:
          "Agent tools let you decide what runs without asking: reading files, editing files, running commands, using the network. A sensible default for real projects: reading and running the tests are allowed; editing needs your review (or happens on a branch); anything destructive (deleting, force-pushing, installing, touching databases or deployments) always asks. Never give an agent production credentials.",
        table: {
          caption: "A sensible permission policy.",
          headers: ["Action", "Policy", "Why"],
          rows: [
            ["Read and search files", "Allow", "Needed to understand; harmless"],
            ["Run tests and lint", "Allow", "How the agent checks its own work"],
            ["Edit files", "Review, or on its own branch", "Every change must be reviewable"],
            ["Install packages, run arbitrary scripts", "Ask each time", "New code and side effects"],
            ["Delete, reset, force-push", "Ask, or deny", "Hard or impossible to undo"],
            ["Production data, deploys, secrets", "Deny", "One mistake reaches real users"],
          ],
        },
        decision: {
          scenario: "To save time, a colleague wants to let the agent run every command without asking, on their laptop that also holds production database credentials in ~/.env.production.",
          question: "What do you advise?",
          options: [
            { id: "a", text: "No: keep destructive and networked commands on \"ask\", and keep production credentials off any machine where an agent runs unattended", why: "An agent that can run anything can use anything it can read. The fix is limits, not luck." },
            { id: "b", text: "Fine, agents never run harmful commands", whyWrong: "They can, by mistake, and quickly." },
            { id: "c", text: "Fine, as long as they check the result afterwards", whyWrong: "Some results (a dropped table) cannot be checked back into existence." },
            { id: "d", text: "Ban agents entirely", whyWrong: "The answer is limits and review, not avoidance." },
          ],
          correct: "a",
          aftermath: "Module 9 returns to agent permissions and destructive commands.",
        },
      },
      {
        id: "a-ce-agent-branch",
        title: "The agent works on its own branch",
        explain:
          "Have agents work on a branch (or a separate worktree, Module 10) and commit there, never on main. Then the agent's work is one reviewable unit: you can list its commits, diff it against main, run the checks, and merge, change or discard it without touching anything else.",
        terminalExercise: term("m6-agent-branch", {
          goal: "List the commits the agent made on its branch that are not on main.",
          accept: ["git log --oneline main..agent/first-name-greeting"],
          near: [{ command: AGENT_RANGE_STAT, why: "That shows what changed. First see the commits themselves: git log main..BRANCH." }],
          hint: "git log --oneline with main..agent/first-name-greeting.",
          success: "One commit, \"Greet customers by first name; add sign-in spinner\". Everything the agent did is inside it, isolated from main.",
        }),
      },
      {
        id: "a-ce-agent-review-gate",
        title: "Reviewing before merging",
        explain:
          "The review gate is the moment a human decides. Look first at what the agent's summary did not mention: configuration, dependencies, CI files, security-sensitive code. git diff main...BRANCH -- FILES shows just those parts of the branch's changes.",
        terminalExercise: term("m6-agent-branch", {
          goal: "Show only what the agent's branch changed in eslint.config.js and package.json.",
          accept: [AGENT_RANGE_CONFIG],
          near: [{ command: AGENT_RANGE_STAT, why: "That lists them among 12 files. Read their actual changes: add -- eslint.config.js package.json." }],
          hint: "git diff main...agent/first-name-greeting -- then the two files.",
          success: "The lint rule switched off and a prettier script added: neither requested, neither in the summary. Request changes; do not merge. (With AGENTS.md in place, the agent would have been told not to.)",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 38 · 6.P
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ce-l38-ai-map",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 7,
    covers: ["6.P"],
    title: "Practical: Make the AI Map the Project Before It Changes Anything",
    subtitle: "Project map, feature map, dependency overview and open questions, each claim verified",
    estimatedMinutes: 36,
    intro:
      "This practical combines everything in the module: a no-changes instruction, a map in four parts, and a verification pass where you check the AI's claims against the code, as you have been doing all module.",

    atoms: [
      {
        id: "a-ce-p6-prompt",
        title: "The instruction",
        explain:
          "The instruction sets the rules (no changes), the deliverables (four parts) and the standard of evidence (a file and line for every claim, and an explicit list of what it could not determine). Asking for unresolved questions is what separates a useful map from a confident one.",
        decision: {
          scenario: "Choose the opening instruction for an agent on an unfamiliar repository.",
          question: "Which is best?",
          options: [
            { id: "a", text: "\"Read-only: do not modify files. Produce (1) a project map, (2) a feature map for sign-in and checkout, (3) a dependency overview marking which packages are actually imported, (4) open questions. Cite file:line for each claim; say 'unknown' rather than guess.\"", why: "Rules, deliverables and an evidence standard, including permission not to know." },
            { id: "b", text: "\"Tell me about this project.\"", whyWrong: "You will get a fluent summary with no evidence." },
            { id: "c", text: "\"Map the project and fix anything that looks wrong.\"", whyWrong: "Mixes understanding with changing, the opposite of the point." },
            { id: "d", text: "\"Summarise the README.\"", whyWrong: "The README is one claim among many." },
          ],
          correct: "a",
          aftermath: "\"Say unknown rather than guess\" measurably reduces invention.",
        },
      },
      {
        id: "a-ce-p6-structure",
        title: "Checking the project map's structure",
        explain:
          "The project map's top level is easy to verify and worth verifying first: if the AI is wrong about which folders hold the code, everything built on it is suspect.",
        terminalExercise: term("m6-map", {
          intro: "The AI's map says: \"Most of the code is in src/ (the React app) and server/ (the API); tests are in tests/.\"",
          goal: "Count tracked files by top-level folder to check it.",
          accept: [TOP_LEVEL],
          near: [{ command: 'rg -l "fetch\\("', why: "That checks a different claim. Count files per top-level folder: git ls-files, cut each path at the first slash, count." }],
          hint: "git ls-files | sed 's|/.*||' | sort | uniq -c",
          success: "src 15, server 13, tests 3, plus root files. The claim holds: verified, and now it can go in your report as verified rather than claimed.",
        }),
      },
      {
        id: "a-ce-p6-verify",
        title: "When the map is wrong",
        explain:
          "When you find an error in an AI map, correct it in the map, note that it was corrected, and ask yourself what else was built on the wrong claim. One invented component often has dependents: a wrong database means wrong statements about backups, migrations and scaling too.",
        decision: {
          scenario: "The AI's map says \"Orders are saved to PostgreSQL via Prisma\". You find no Prisma in package.json and saveOrder writes data/kobo.json.",
          question: "What do you do?",
          options: [
            { id: "a", text: "Correct it (JSON file via server/db/index.js), mark it as corrected, and re-check every other claim that depended on it, such as backups and scaling", why: "The error propagates. Fix the claim and its consequences." },
            { id: "b", text: "Keep it: PostgreSQL is probably planned", whyWrong: "The map describes what is, not what might be." },
            { id: "c", text: "Ask the AI again until it agrees with you", whyWrong: "The code already answered. Write down the fact." },
            { id: "d", text: "Discard the whole map", whyWrong: "Most of it was checkable and right; correct it rather than start again." },
          ],
          correct: "a",
          aftermath: "Maps improve by correction, with the evidence attached.",
        },
      },
      {
        id: "a-ce-p6-activity",
        title: "Who is active, recently",
        explain:
          "A good map says who to ask. The AI cannot know who is still on the team, but Git knows who has been working where recently, which is the next best thing.",
        terminalExercise: term("m6-map", {
          goal: "Count commits per author since 20 March 2026, to see who has been active recently.",
          accept: ["git log --format='%an' --since=2026-03-20 | sort | uniq -c"],
          near: [{ command: TOP_LEVEL, why: "That counts files. Count recent commits by author: git log with --since and --format='%an'." }],
          hint: "git log --format='%an' --since=2026-03-20, then sort and uniq -c.",
          success: "Amaka 2, Tolu 1. Chidi, who built authentication and payments, has not committed since mid-March: an open question for the map (who knows payments now?).",
        }),
      },
      {
        id: "a-ce-p6-questions",
        title: "The open questions",
        explain:
          "The map's last section, unresolved questions, is your investigation plan and your agenda for the next conversation with the team. Good questions are specific, say why they matter, and say what would answer them.",
        decision: {
          scenario: "Which open question is written best?",
          question: "Choose one.",
          options: [
            { id: "a", text: "\"Paystack has never been verified locally (no key in .env). Does production have PAYSTACK_SECRET_KEY set, and has a payment succeeded since v1.0.0? Ask: whoever has access to the hosting dashboard.\"", why: "Specific, says why it matters, and says how to get the answer." },
            { id: "b", text: "\"Payments?\"", whyWrong: "Nobody can act on it." },
            { id: "c", text: "\"The code is messy.\"", whyWrong: "An opinion, not a question." },
            { id: "d", text: "\"Is everything working?\"", whyWrong: "Too broad to answer." },
          ],
          correct: "a",
          aftermath: "A good question is half an answer.",
        },
      },
    ],

    task: {
      title: "Module practical: an AI project map, verified",
      intro:
        "Choose an AI coding tool you have access to (Cursor, Claude Code, GitHub Copilot, OpenAI Codex or another) and a repository you did not write. Before it changes anything, have it produce a map, and verify it.",
      prompts: [
        "Your read-only instruction, verbatim.",
        "The AI's project map, feature map (for two features), dependency overview and open questions.",
        "For each claim: verified (with the command or file:line you checked), corrected (with the evidence), or unverified.",
        "The number of claims checked and the number that were wrong or invented.",
        "An AGENTS.md (or CLAUDE.md) for the project, based on what you verified.",
        "One paragraph: what the AI did well and where it would have misled you.",
      ],
      closing: "Next module: debugging with evidence, from stack traces and logs to tests that prove a fix.",
    },
    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
