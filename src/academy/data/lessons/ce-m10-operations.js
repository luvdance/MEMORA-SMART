/**
 * CODEBASE ENGINEERING · MODULE 10 · ADVANCED CODEBASE OPERATIONS
 *
 * Curriculum 10.1 – 10.10 and the practical, 10.P. Inspection checklists and
 * reusable scripts; automated reports and dependency inventories; Git
 * worktrees; task decomposition, parallel agents and their conflicts; review
 * gates; repository rules, agent instructions and reusable workflows; MCP;
 * judging when a tool helps; a personal workflow.
 *
 * The scripts in this module (scripts/inspect.sh, scripts/review-gate.sh,
 * scripts/deps-report.mjs) were written for Kobo Market and run for real; the
 * review gate genuinely fails the AI change from Module 5 and passes a clean
 * refactor. The .mcp.json is an example configuration: it was read, not
 * connected.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

import { term, out } from "./ce-helpers.js";

export const SECTION_ID = "ce-s10-operations";
const MODULE = "ce-m10-operations";

const GATE = 'bash scripts/review-gate.sh; echo "exit=$?"';

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 60 · 10.1 – 10.2
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ce-l60-checklists-scripts",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 1,
    covers: ["10.1", "10.2"],
    title: "Repeatable Inspection Checklists and Reusable Shell Scripts",
    subtitle: "Turning what you did by hand in Modules 1 to 3 into something you can run in seconds",
    estimatedMinutes: 30,
    intro:
      "You have now inspected Kobo Market by hand many times: the stack, the scripts, the notes, the tests. Anything you do more than twice should become a checklist, and any checklist made of commands should become a script.",

    atoms: [
      {
        id: "a-ce-checklist",
        title: "A project-inspection checklist",
        explain:
          "A checklist makes sure nothing is skipped when you are tired, rushed or new to a project. A good inspection checklist is ordered (cheapest and most informative first), states the command or place for each item, and says what \"good\" looks like. It is the written form of Modules 1 to 3.",
        example:
          "Project inspection checklist\n[ ] Git: branch, last commit, uncommitted changes     git status; git log -1\n[ ] Stack: languages, frameworks, versions            cat package.json (or pyproject.toml, pom.xml)\n[ ] Scripts: how to run, test, build                  npm run\n[ ] Entry points and routes                           rg -l \"createServer|createRoot\"\n[ ] Configuration needed                              cat .env.example; rg -n \"process\\.env\"\n[ ] Notes left in the code                            rg -n \"TODO|FIXME\"\n[ ] Checks: tests and lint pass?                      npm test; npm run lint\n[ ] Dependencies: outdated, vulnerable, unused        npm outdated; npm audit\n[ ] Open questions written down",
        decision: {
          scenario: "Your checklist has twenty items. Which should come first?",
          question: "Choose the best ordering principle.",
          options: [
            { id: "a", text: "Cheap, read-only and most informative first (Git state, manifest, scripts), slower or riskier ones later (running the app, installing)", why: "You learn the most for the least effort, and nothing changes the project before you know its state." },
            { id: "b", text: "Alphabetical", whyWrong: "Order should follow information and risk." },
            { id: "c", text: "Run the app first, then look", whyWrong: "Running before knowing the configuration produces confusing failures." },
            { id: "d", text: "Install the latest versions first", whyWrong: "That changes the project before you have a baseline." },
          ],
          correct: "a",
          aftermath: "Read before you run; run before you change.",
        },
      },
      {
        id: "a-ce-shell-script",
        title: "A reusable inspection script",
        explain:
          "A shell script is the checklist made executable: the same commands, in a file, run with bash scripts/inspect.sh. Kobo Market's version prints a Markdown report: Git state, stack, scripts, key files, size, notes left in the code, and whether the tests and lint pass. It only reads; it changes nothing.",
        example: out("m10-inspect", "cat scripts/inspect.sh"),
        terminalExercise: term("m10-inspect", {
          goal: "Run the inspection script on the project.",
          accept: ["bash scripts/inspect.sh"],
          hint: "bash and the script's path.",
          success: "The whole of Modules 1 to 3's first look, in one command: branch and last commit, the stack, seven scripts, key files, 39 tracked files, the two notes, tests and lint passing. (\"Uncommitted files: 1\" is the script itself, not yet committed.)",
        }),
      },
      {
        id: "a-ce-script-safety",
        title: "Writing scripts that are safe to run",
        explain:
          "Maintenance scripts get run by other people, on other machines, often without reading them. Make them safe: say at the top what they do and how to run them; default to read-only; set -u to stop on unset variables (and set -e to stop on errors where that is wanted); quote every variable (\"$f\"); never hard-code secrets; and make anything destructive ask first or require an explicit flag.",
        decision: {
          scenario: "A teammate's clean-up script contains rm -rf $BUILD_DIR/. BUILD_DIR is set by another script that is not always run first.",
          question: "What is the danger?",
          options: [
            { id: "a", text: "If BUILD_DIR is empty, the command becomes rm -rf /, deleting everything it can reach; set -u would stop the script, and the variable should be checked and quoted", why: "An unset variable silently becomes an empty string. This exact bug has wiped real systems." },
            { id: "b", text: "It might be slow", whyWrong: "Speed is not the risk." },
            { id: "c", text: "rm does not work in scripts", whyWrong: "It works, which is the problem." },
            { id: "d", text: "Nothing, as long as BUILD_DIR is usually set", whyWrong: "\"Usually\" is how disasters happen." },
          ],
          correct: "a",
          aftermath: "set -u, quote variables, and guard every destructive line.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 61 · 10.3 – 10.4
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ce-l61-reports-worktrees",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 2,
    covers: ["10.3", "10.4"],
    title: "Automated Reports and Dependency Inventories; Git Worktrees",
    subtitle: "Reports that write themselves, and working on two things at once without stashing",
    estimatedMinutes: 30,
    intro:
      "A report you can regenerate in a second is a report you can keep current. And when an urgent fix interrupts a half-finished feature, Git worktrees let you handle both without mixing them up.",

    atoms: [
      {
        id: "a-ce-report-file",
        title: "Saving the report",
        explain:
          "Redirect the script's output into a Markdown file to get a maintenance report you can attach to a ticket, commit to docs/, or compare week to week (diff last week's report with this week's to see what changed). The same script can run in CI on a schedule.",
        terminalExercise: term("m10-inspect-save", {
          intro: "The cart heading has just been edited, so the working tree is not clean.",
          goal: "Write the inspection report into maintenance-report.md.",
          accept: ["bash scripts/inspect.sh > maintenance-report.md"],
          near: [{ command: "head -n 8 maintenance-report.md", why: "That reads the report; create it first by redirecting the script's output." }],
          hint: "Run the script and redirect with >.",
          success: "Nothing printed: it all went into maintenance-report.md. A file you can attach, commit or diff.",
        }),
      },
      {
        id: "a-ce-report-check",
        title: "Reading a generated report critically",
        explain:
          "Generated reports are only as true as the commands behind them, and they report what they see at the moment they run, including side effects of running them. Read them as you would any evidence.",
        terminalExercise: term("m10-inspect-save", {
          goal: "Read the first eight lines of the saved report.",
          accept: ["head -n 8 maintenance-report.md"],
          near: [{ command: "tail -n 3 maintenance-report.md", why: "That shows the checks at the end. Read the top, the Git section." }],
          hint: "head -n 8 and the file.",
          success: "\"Uncommitted files: 3\": the edited Cart.jsx, the script itself, and maintenance-report.md, which the shell created (empty) before the script ran. The report counted itself. Exclude its own outputs, or write them outside the repository.",
        }),
      },
      {
        id: "a-ce-deps-inventory",
        title: "A dependency inventory",
        explain:
          "A dependency inventory lists every direct dependency with the range wanted and the version actually locked, and counts the total. It is the basis for upgrade planning, licence checks and security reviews. scripts/deps-report.mjs builds it from package.json and package-lock.json in a few lines of Node.",
        terminalExercise: term("m10-deps-report", {
          goal: "Produce the dependency inventory.",
          accept: ["node scripts/deps-report.mjs"],
          near: [{ command: "npm ls --all | wc -l", why: "That counts the lines of the full tree. The inventory script lists each direct dependency with wanted and locked versions." }],
          hint: "node and the script's path.",
          success: "Three runtime and five development dependencies, wanted and locked side by side, and 158 packages in the lockfile in all: eight chosen, 150 inherited.",
        }),
      },
      {
        id: "a-ce-worktree-add",
        title: "Git worktrees: a second working folder",
        explain:
          "A worktree is an extra working folder attached to the same repository, checked out on a different branch. git worktree add ../FOLDER -b BRANCH creates it. Unlike stash and switch, nothing in your main folder is disturbed: two branches are open side by side, each with its own files. It is how you handle an urgent fix mid-feature, and how several AI agents can work in parallel without overwriting each other.",
        terminalExercise: term("m10-worktree", {
          goal: "An urgent cart fix comes in. Create a separate working folder ../kobo-hotfix on a new branch hotfix/cart-delivery.",
          accept: ["git worktree add ../kobo-hotfix -b hotfix/cart-delivery"],
          near: [{ command: "git worktree list", why: "That lists worktrees (just one so far). Create a new one with git worktree add." }],
          hint: "git worktree add, the folder, then -b and the branch.",
          success: "A new folder, /c/Users/ada/kobo-hotfix, on hotfix/cart-delivery, starting from 222c42e. Your main folder is untouched.",
        }),
      },
      {
        id: "a-ce-worktree-list",
        title: "Seeing every worktree",
        explain:
          "git worktree list shows each working folder, its commit and its branch. One branch can be checked out in only one worktree at a time, which is a useful safety rule: two agents cannot edit the same branch at once.",
        terminalExercise: term("m10-worktree", {
          goal: "List every working folder attached to this repository.",
          accept: ["git worktree list"],
          near: [{ command: "cd ../kobo-hotfix && git status --short --branch", why: "That checks one worktree. List them all with git worktree list." }],
          hint: "git worktree list.",
          success: "Two: kobo-market on main and kobo-hotfix on hotfix/cart-delivery, both at 222c42e for now.",
        }),
      },
      {
        id: "a-ce-worktree-remove",
        title: "Removing a worktree",
        explain:
          "When the work is merged, remove the worktree with git worktree remove FOLDER (deleting the folder by hand leaves Git's record behind; git worktree prune cleans that up). The branch remains until you delete it.",
        terminalExercise: term("m10-worktree", {
          goal: "The hotfix is merged. Remove the extra working folder.",
          accept: ["git worktree remove ../kobo-hotfix"],
          near: [{ command: "git worktree list", why: "That lists them. Remove the hotfix one with git worktree remove." }],
          hint: "git worktree remove and the folder.",
          success: "Removed, with no output. Git refuses if the folder has uncommitted changes, so work is not lost by accident.",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 62 · 10.5 – 10.6
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ce-l62-parallel-gates",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 3,
    covers: ["10.5", "10.6"],
    title: "Task Decomposition, Parallel Agents and Merge Conflicts; Review Gates",
    subtitle: "Splitting work so it can run in parallel, and the checks every AI change must pass before merging",
    estimatedMinutes: 32,
    intro:
      "Several agents can work at once, each in its own worktree. That multiplies output, and multiplies the chance that two of them change the same thing. Decompose the work so they do not collide, and put an automatic gate in front of main.",

    atoms: [
      {
        id: "a-ce-decompose",
        title: "Decomposing a task for parallel work",
        explain:
          "Split a large task into pieces that touch different files and can be verified on their own: one per layer, per feature, or per module. Pieces that touch the same file or the same rule must be done in sequence, not in parallel. Write each piece as a well-scoped agent task (Module 6), with its own branch.",
        decision: {
          scenario: "You want three agents to work in parallel on: (A) free delivery shown in the cart, (B) no delivery fee on an empty cart, (C) a wishlist page.",
          question: "Which split avoids conflicts?",
          options: [
            { id: "a", text: "Run C in parallel with the others; do A and B one after the other, because both change the same delivery line in Cart.jsx", why: "C touches its own files. A and B change the same rule in the same place: in parallel they will conflict, as the next exercise shows." },
            { id: "b", text: "All three in parallel", whyWrong: "A and B will conflict." },
            { id: "c", text: "All three in sequence", whyWrong: "Safe, but C could have run in parallel." },
            { id: "d", text: "One agent does all three in one change", whyWrong: "One large, mixed change is hard to review." },
          ],
          correct: "a",
          aftermath: "Parallelise across files; serialise within a rule.",
        },
      },
      {
        id: "a-ce-parallel-conflict",
        title: "When parallel agents collide",
        explain:
          "Two agents each changed the cart's delivery line on their own branches. Each change is fine on its own. Merging the first is a fast-forward; merging the second conflicts, because both rewrote the same lines.",
        terminalExercise: term("m10-parallel", {
          intro: "agent/cart-free-delivery has already been merged (a fast-forward).",
          goal: "Merge the second agent's branch, agent/cart-quantities.",
          accept: ["git merge --no-edit agent/cart-quantities"],
          near: [{ command: "git merge --no-edit agent/cart-free-delivery", why: "That one merged cleanly. Now merge agent/cart-quantities." }],
          hint: "git merge --no-edit and the second branch.",
          success: "CONFLICT in src/pages/Cart.jsx. Neither agent did anything wrong; the work was decomposed badly.",
        }),
      },
      {
        id: "a-ce-parallel-read",
        title: "Resolving a conflict between agents",
        explain:
          "Read both sides as two intentions, exactly as in Module 5. Here both are wanted: free delivery from ₦50,000, and no fee on an empty cart. The resolution combines them, ideally by moving the whole rule into the shared function from the capstone, so the next two agents cannot collide on it.",
        terminalExercise: term("m10-parallel", {
          goal: "See both agents' versions of the conflicting lines.",
          accept: ["git diff"],
          near: [{ command: "git merge --abort", why: "Read the conflict before deciding to back out." }],
          hint: "git diff.",
          success: "HEAD: delivery free from 5000000. agent/cart-quantities: no fee when the cart is empty. Combined: const delivery = !items.length || subtotal >= 5000000 ? 0 : DELIVERY_FEE.",
        }),
      },
      {
        id: "a-ce-gate-fail",
        title: "A review gate",
        explain:
          "A review gate is a set of checks every change must pass before it can be merged: run by CI on every pull request, and runnable locally. Some gates block automatically (lint, tests, a secret scan); others flag the change for a human (it edits CI or lint configuration; it is too big to review). scripts/review-gate.sh does both, and exits non-zero if anything needs attention, so CI fails the check.",
        example: out("m10-gate-pass", "cat scripts/review-gate.sh"),
        terminalExercise: term("m10-gate-fail", {
          intro: "The AI's 12-file change from Module 5 is applied.",
          goal: "Run the review gate on the AI's change.",
          accept: [GATE],
          hint: "bash scripts/review-gate.sh, then echo the exit code.",
          success: "Tests FAILED, quality settings changed (needs human review), 12 files (needs splitting); exit=1. Every problem you found by hand in Module 5, found automatically before a human spent a minute.",
        }),
      },
      {
        id: "a-ce-gate-pass",
        title: "A change that passes",
        explain:
          "A gate is only useful if good changes pass it cleanly, otherwise people learn to ignore it. Run it on a small, correct change.",
        terminalExercise: term("m10-gate-pass", {
          intro: "The ProductCard refactor from Module 8 is applied.",
          goal: "Run the review gate on the refactor.",
          accept: [GATE],
          hint: "The same command.",
          success: "All five gates ok, 1 file; exit=0. A clean change gets through with no friction, so the gate only costs time when it is saving it.",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 63 · 10.7 – 10.8
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ce-l63-rules-mcp",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 4,
    covers: ["10.7", "10.8"],
    title: "Repository Rules, Agent Instructions and Reusable Workflows; MCP",
    subtitle: "Making the right way the default, and connecting AI tools to the systems around the code",
    estimatedMinutes: 30,
    intro:
      "The best workflow is one people (and agents) follow without thinking, because the repository enforces it. And the next step for AI tools is reaching beyond the code, into issues, docs and data, through a common protocol.",

    atoms: [
      {
        id: "a-ce-repo-rules",
        title: "Repository rules",
        explain:
          "Platforms like GitHub let a repository enforce its own rules. Branch protection (or rulesets) on main: no direct pushes, pull requests only, required status checks (CI must pass), required approvals, no force pushes. CODEOWNERS assigns reviewers by path (payments code needs the payments owner). Pull request templates ask every author the same questions (what, why, how tested, what AI did). Together they make the safe path the only path, for humans and agents alike.",
        table: {
          caption: "Repository rules on GitHub.",
          headers: ["Rule", "Enforces"],
          rows: [
            ["Branch protection / rulesets on main", "PRs only, no force push, no deletion"],
            ["Required status checks", "CI (lint, tests, build, review gate) must pass"],
            ["Required reviews", "At least one approval; CODEOWNERS for sensitive paths"],
            ["CODEOWNERS", "server/payments/ @payments-lead, eslint.config.js @tech-lead"],
            ["PR template", "What, why, how tested, AI involvement"],
          ],
        },
        decision: {
          scenario: "An agent with repository access tries to push straight to main.",
          question: "What should stop it?",
          options: [
            { id: "a", text: "Branch protection: main accepts changes only through pull requests that pass the required checks and reviews", why: "A rule in the repository applies to every person and tool, however their own settings are configured." },
            { id: "b", text: "Asking the agent politely in AGENTS.md", whyWrong: "Instructions guide; protection enforces. Use both." },
            { id: "c", text: "Nothing: agents should be trusted", whyWrong: "Trust is not a control." },
            { id: "d", text: "Deleting main", whyWrong: "Absurd." },
          ],
          correct: "a",
          aftermath: "Instructions say what should happen; rules make sure it does.",
        },
      },
      {
        id: "a-ce-reusable-workflows",
        title: "Agent instructions and reusable workflows",
        explain:
          "Instruction files (AGENTS.md, CLAUDE.md) tell agents how to work in the repository; reusable workflows package a procedure so it runs the same way every time: a GitHub Actions workflow called from several repositories, a shared review-gate script, or a saved agent command or skill (\"/inspect\", \"/review\") that runs your checklist. Keep them in version control and review changes to them like code.",
        decision: {
          scenario: "Every repository at your company has slightly different CI steps, copied and edited by hand over the years.",
          question: "What improves this?",
          options: [
            { id: "a", text: "One reusable workflow (lint, test, build, review gate) that every repository calls, versioned and reviewed in one place", why: "A fix or improvement to the procedure then reaches every project at once." },
            { id: "b", text: "Copy the best one again into every repository", whyWrong: "They will drift apart again." },
            { id: "c", text: "Remove CI", whyWrong: "No." },
            { id: "d", text: "Let each agent write its own CI", whyWrong: "More drift, less review." },
          ],
          correct: "a",
          aftermath: "One procedure, many callers.",
        },
      },
      {
        id: "a-ce-mcp",
        title: "MCP: connecting AI tools to external systems",
        explain:
          "The Model Context Protocol (MCP) is an open standard for connecting AI applications to external tools and data. An MCP server exposes capabilities (tools such as \"search issues\" or \"query the database\", and resources such as documents); an MCP client, built into tools like Claude Code, Cursor, GitHub Copilot and Codex, connects to it and offers those capabilities to the model. One server works with every compatible client. Projects can declare the servers they use in a configuration file such as .mcp.json.",
        terminalExercise: term("m10-mcp", {
          intro: "An example MCP configuration has been added (the read-only database server it names is illustrative, not part of Kobo Market).",
          goal: "Read which MCP servers this project configures.",
          accept: ["cat .mcp.json"],
          near: [{ command: "node -e \"console.log(Object.keys(require('./.mcp.json').mcpServers))\"", why: "That lists the names. Read the whole file to see how each is connected." }],
          hint: "cat .mcp.json.",
          success: "Two servers: GitHub's hosted MCP server over HTTP (issues, pull requests), and a local one started with node, deliberately --read-only, pointed at the seeded data. An agent with these could read an issue and look up an order, without you copying either into a prompt.",
        }),
      },
      {
        id: "a-ce-mcp-risk",
        title: "MCP and permissions",
        explain:
          "Every MCP server you connect extends what the AI can do, so it extends what can go wrong. Prefer read-only servers; give each the narrowest credentials it needs; never point one at production data with write access; trust only servers from sources you would trust with the same access in a script; and remember that text the server returns (an issue body, a web page) can contain instructions written to mislead the model.",
        decision: {
          scenario: "A colleague wants to connect an MCP server that can run any SQL on the production database, \"so the agent can investigate bugs\".",
          question: "What do you recommend?",
          options: [
            { id: "a", text: "A read-only server on a staging copy (or narrowly scoped read-only production access), with approvals for each query and no write tools", why: "Investigation needs reading, not writing; the narrowest access that does the job." },
            { id: "b", text: "Full access: agents are careful", whyWrong: "One mistaken DELETE, or one injected instruction, reaches real customers." },
            { id: "c", text: "Give it the admin password in the prompt", whyWrong: "A secret in a prompt, and full access." },
            { id: "d", text: "Ban MCP", whyWrong: "Scoped access is useful; unlimited access is the problem." },
          ],
          correct: "a",
          aftermath: "Least privilege applies to AI tools too.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 64 · 10.9 – 10.10
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ce-l64-tools-workflow",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 5,
    covers: ["10.9", "10.10"],
    title: "When Tools Help and When They Hurt; Your Personal Workflow",
    subtitle: "Judging new tools by their cost, and assembling the habits from this course into one routine",
    estimatedMinutes: 28,
    intro:
      "There will always be a new tool. The skill is not adopting all of them; it is knowing which problem each solves and what it costs, and having a workflow solid enough that new tools slot into it rather than replace it.",

    atoms: [
      {
        id: "a-ce-tool-value",
        title: "Does this tool earn its place?",
        explain:
          "Judge a tool by the problem it removes, measured on your own work: time saved per week, errors prevented, onboarding made easier. Against that, count its costs: setup and maintenance, another thing to learn, another place for configuration and secrets, another failure mode, and lock-in. A tool that solves a problem you do not have is pure cost.",
        decision: {
          scenario: "A three-person team considers adding: a monorepo build orchestrator, a second AI coding tool, a Kubernetes cluster, and a secret scanner in CI.",
          question: "Which is most likely to earn its place now?",
          options: [
            { id: "a", text: "The secret scanner: cheap to add, no maintenance, and it prevents a costly, likely mistake", why: "Small cost, real risk removed, no new workflow to learn." },
            { id: "b", text: "The Kubernetes cluster", whyWrong: "Large ongoing cost for a scale problem they do not have." },
            { id: "c", text: "The monorepo orchestrator", whyWrong: "They have one repository with one app." },
            { id: "d", text: "A second AI coding tool", whyWrong: "Possibly useful, but two tools mean two sets of configuration and habits for the same job." },
          ],
          correct: "a",
          aftermath: "Name the problem, then count the cost.",
        },
      },
      {
        id: "a-ce-tool-cost",
        title: "Needless complexity",
        explain:
          "Signs a tool is adding complexity rather than removing it: the team spends more time configuring it than it saves; only one person understands it; it duplicates something you already have; failures in it block work unrelated to it; or nobody can say which problem it solved. Removing a tool is a legitimate improvement.",
        decision: {
          scenario: "A team adopted an AI agent that opens pull requests automatically. Review queues have tripled, and most of its PRs are rejected.",
          question: "What is the sensible response?",
          options: [
            { id: "a", text: "Measure it, then narrow it to the task types where its PRs are accepted (or remove it), and tighten its instructions and gates", why: "Judge the tool by outcomes. It is costing review time; keep only what pays." },
            { id: "b", text: "Approve its PRs faster to clear the queue", whyWrong: "That turns review into a rubber stamp." },
            { id: "c", text: "Add a second agent to review the first", whyWrong: "More complexity on top of an unsolved problem." },
            { id: "d", text: "Keep it as it is: AI is the future", whyWrong: "The future is not a reason to accept today's cost." },
          ],
          correct: "a",
          aftermath: "Tools are hired for a job, and can be let go.",
        },
      },
      {
        id: "a-ce-personal-workflow",
        title: "Your workflow, end to end",
        explain:
          "Everything in this course fits one loop. Inspect: baseline and map (script). Understand: trace the feature you will change. Plan: a small, scoped task with a definition of done. Change: on a branch or worktree, by hand or with an agent under its instruction file. Verify: tests (a failing one first for a bug), lint, build, the review gate. Review: read the diff against the plan. Merge through a pull request. Record: commit messages, README, ADRs, the map.",
        example:
          "My codebase workflow\n1. Inspect   bash scripts/inspect.sh > report.md; read open questions\n2. Understand   trace the feature (file:line, both ways); verify AI claims\n3. Plan     one goal, files, limits, definition of done\n4. Change   own branch/worktree; agent with AGENTS.md and narrow permissions\n5. Verify   red test first → green; npm test; npm run lint; npm run build; review gate\n6. Review   git diff --stat main...; read every unexpected file\n7. Merge    PR linked to the issue: why, how tested, what AI did\n8. Record   update map/README/ADR in the same PR",
        decision: {
          scenario: "Which step is most often skipped, and most expensive to skip?",
          question: "Choose one.",
          options: [
            { id: "a", text: "Understand: changing a feature before tracing how it works now", why: "Every later step assumes you know what the code does. Skip it and you verify, review and merge a change built on a guess." },
            { id: "b", text: "Record", whyWrong: "Costly over time, but less immediately than changing what you do not understand." },
            { id: "c", text: "Merge", whyWrong: "Rarely skipped." },
            { id: "d", text: "None: every step is optional", whyWrong: "No." },
          ],
          correct: "a",
          aftermath: "Understand before you change: Module 1's rule, still the most important.",
        },
      },
      {
        id: "a-ce-workflow-loop",
        title: "Keeping the workflow alive",
        explain:
          "A workflow is a living thing. Review it every few months: which steps catch real problems, which only cost time, which tools changed. Add a step when a mistake gets through (and say which mistake); remove one when it has not caught anything in a long time and costs effort. Write it down where your team (and your agents) can read it.",
        decision: {
          scenario: "A bug reached production because a migration was run against production instead of staging.",
          question: "How should the workflow change?",
          options: [
            { id: "a", text: "Add a specific, enforced step for that mistake: migrations run only by the pipeline, against a named environment, after a staging run and a backup; update the runbook", why: "A real failure, a specific guard, written down where it will be followed." },
            { id: "b", text: "Tell everyone to be more careful", whyWrong: "Care is not a process." },
            { id: "c", text: "Add ten new steps to every change", whyWrong: "General friction for a specific problem." },
            { id: "d", text: "Nothing: it was a one-off", whyWrong: "Unguarded mistakes repeat." },
          ],
          correct: "a",
          aftermath: "Each step in a good workflow can name the mistake it prevents.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 65 · 10.P
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ce-l65-workflow-practical",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 6,
    covers: ["10.P"],
    title: "Practical: A Reusable Project-Inspection Workflow",
    subtitle: "Stack, key files, Git status, test and build commands, and a concise maintenance report, in one run",
    estimatedMinutes: 36,
    intro:
      "Build your own version of the inspection workflow, make it work on more than one kind of project, and run it on a project you did not write.",

    atoms: [
      {
        id: "a-ce-p10-output",
        title: "What the report must contain",
        explain:
          "The assignment's report covers five things: the stack, the key files, the Git status, how to test and build, and the open issues. Check the saved report's ending, where the checks are.",
        terminalExercise: term("m10-inspect-save", {
          goal: "Read the last three lines of the saved report.",
          accept: ["tail -n 3 maintenance-report.md"],
          near: [{ command: "head -n 8 maintenance-report.md", why: "That is the beginning. The checks are at the end: tail." }],
          hint: "tail -n 3 and the file.",
          success: "Tests: pass. Lint: pass. A report that ends with the project's health, as measured, not as claimed.",
        }),
      },
      {
        id: "a-ce-p10-extend",
        title: "Making it work on other projects",
        explain:
          "Kobo Market's script assumes Node and npm. A reusable workflow detects the stack first (package.json, pyproject.toml, pom.xml, go.mod) and runs the right commands for it, and skips checks it cannot run rather than failing. Start with the ecosystems you actually meet.",
        decision: {
          scenario: "You run your Node-only script on a Python project with pyproject.toml and no package.json.",
          question: "How should a reusable script behave?",
          options: [
            { id: "a", text: "Detect pyproject.toml, report the Python stack and run its test command (for example pytest) if available, and say clearly which checks were skipped", why: "It adapts where it can and is honest where it cannot." },
            { id: "b", text: "Crash on the first node command", whyWrong: "Useless on the next project." },
            { id: "c", text: "Report \"Tests: pass\" anyway", whyWrong: "A false report is worse than none." },
            { id: "d", text: "Install Node into the project", whyWrong: "An inspection must not change the project." },
          ],
          correct: "a",
          aftermath: "Skipped is honest; silently passed is not.",
        },
      },
      {
        id: "a-ce-p10-deps",
        title: "Sizing the dependency tree",
        explain:
          "Include a measure of dependency weight in the report: it changes over time, and a sudden jump (a new package that pulled in hundreds of others) deserves a question.",
        terminalExercise: term("m10-deps-report", {
          goal: "Count the lines of the full installed dependency tree.",
          accept: ["npm ls --all | wc -l"],
          near: [{ command: "node scripts/deps-report.mjs", why: "That is the inventory of direct dependencies. Count the full tree with npm ls --all." }],
          hint: "npm ls --all, piped into wc -l.",
          success: "220 lines: the full tree, including duplicates marked \"deduped\". Record it each time the report runs, and a jump will stand out.",
        }),
      },
      {
        id: "a-ce-p10-ci",
        title: "Running the workflow automatically",
        explain:
          "A workflow that runs only when someone remembers will stop running. Schedule it (a weekly CI job that writes the report as an artifact, or opens an issue when a check fails), and run the review gate on every pull request.",
        decision: {
          scenario: "Where should the inspection report and the review gate run?",
          question: "Choose the best arrangement.",
          options: [
            { id: "a", text: "The review gate on every pull request (required check); the inspection report on a weekly schedule, saved as an artifact and compared with last week's", why: "Gates belong where changes enter; reports belong on a rhythm that shows trends." },
            { id: "b", text: "Only on your laptop, when you remember", whyWrong: "It will stop running." },
            { id: "c", text: "The full report on every commit, blocking merges", whyWrong: "Slow, and a report is not a gate." },
            { id: "d", text: "Never: reading code is enough", whyWrong: "Automation catches what tired people miss." },
          ],
          correct: "a",
          aftermath: "Gates at the door, reports on a schedule.",
        },
      },
    ],

    task: {
      title: "Module practical: a reusable project-inspection workflow",
      intro:
        "Build a project-inspection workflow (a script, plus a short checklist for what a script cannot check) and run it on two projects you did not write, in at least one language other than JavaScript if you can.",
      prompts: [
        "It identifies the stack, with versions, from the manifest it finds.",
        "It maps the key files: entry points, configuration, routes, tests.",
        "It checks Git status: branch, last commit, uncommitted files, unmerged branches.",
        "It locates and runs the test and build commands, and reports which it skipped and why.",
        "It produces a concise Markdown maintenance report, including notes left in the code and dependency weight.",
        "A review-gate script (lint, tests, a secret scan, a size limit) and the CI workflow that runs it on every pull request.",
        "Both reports, and one improvement you made after running it on the second project.",
      ],
      closing: "Next: the capstone, where you take ownership of a codebase from start to finish.",
    },
    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
