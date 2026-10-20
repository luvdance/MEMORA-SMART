/**
 * CODEBASE ENGINEERING · CAPSTONE · TAKE OWNERSHIP OF A CODEBASE
 *
 * Curriculum C.1 – C.3. The whole course on one problem: a customer
 * complaint about Kobo Market's totals, taken from the first inspection to a
 * merged, tested fix and a maintenance report. The fix (one shared delivery
 * rule in shared/pricing.js) was really made, tested, built and merged in the
 * recorded sessions.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

import { term } from "./ce-helpers.js";

export const SECTION_ID = "ce-sc-capstone";
const MODULE = "ce-c-capstone";

const MERGE = 'git merge --no-ff fix/cart-delivery-rule -m "Merge fix/cart-delivery-rule"';

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 66 · C.1
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ce-l66-inherit",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 1,
    covers: ["C.1"],
    title: "Capstone 1: Inherit the Project",
    subtitle: "The brief, the baseline, and a plan you can defend",
    estimatedMinutes: 34,
    intro:
      "Kobo Market's owner writes: \"Customers say the cart shows one total and they are charged another. Can you fix it, and tell me what state the code is in?\" That is the whole brief. Everything you need, you have learned. Work it as a professional would, from the first command to the handover.",

    atoms: [
      {
        id: "a-ce-c-brief",
        title: "Reading the brief",
        explain:
          "A brief contains two jobs: fix one reported problem, and report on the codebase's health. Separate them. The fix needs a reproduction, a root cause and a proof. The report needs a baseline, a map and your open questions. Neither starts with changing code.",
        decision: {
          scenario: "You have the brief and a fresh clone.",
          question: "What is your first hour?",
          options: [
            { id: "a", text: "Baseline and inspect (state, tests, lint), then reproduce the complaint and locate the totals logic, before changing anything", why: "Understand, then change: the course's first rule, applied to a real brief." },
            { id: "b", text: "Ask an agent to \"fix the totals\" straight away", whyWrong: "Changes on a guess, with no baseline to compare against." },
            { id: "c", text: "Rewrite the cart", whyWrong: "The rewrite trap, for an unexplained bug." },
            { id: "d", text: "Write the health report first, from the README", whyWrong: "The README is a claim; the report needs evidence." },
          ],
          correct: "a",
          aftermath: "Baseline, reproduce, locate.",
        },
      },
      {
        id: "a-ce-c-baseline",
        title: "The baseline, in one command",
        explain:
          "Your inspection script from Module 10 gives the baseline and the first page of the report at once: state, stack, scripts, key files, size, notes in the code, and whether tests and lint pass.",
        terminalExercise: term("c-baseline", {
          intro: "A fresh clone, with your inspection script in scripts/.",
          goal: "Take the project's baseline.",
          accept: ["bash scripts/inspect.sh"],
          hint: "Run your inspection script.",
          success: "main at 222c42e, tests and lint passing, two notes left in the code. Whatever you change from here can be compared with this.",
        }),
      },
      {
        id: "a-ce-c-locate",
        title: "Locating the logic behind the complaint",
        explain:
          "The complaint names two totals: one shown, one charged. In Module 4 terms: two layers, so look for the rule in both.",
        terminalExercise: term("c-baseline", {
          goal: "Find every definition and use of the delivery rule in the frontend and the server.",
          accept: ['rg -n "DELIVERY_FEE|FREE_DELIVERY_FROM" src server'],
          near: [{ command: "git log --oneline -S FREE_DELIVERY_FROM", why: "That is the history. First locate the rule in the current code." }],
          hint: "Search src and server for either constant.",
          success: "The cart page adds DELIVERY_FEE always (Cart.jsx lines 5, 10, 34); the server waives it from ₦50,000 (orderService.js lines 3 and 7). Two rules: the complaint, explained.",
        }),
      },
      {
        id: "a-ce-c-history",
        title: "When and why they diverged",
        explain:
          "The fix should be informed by the history: what the change that introduced the difference was trying to do, so your fix keeps its intent.",
        terminalExercise: term("c-baseline", {
          goal: "Find the commit that introduced the free-delivery threshold.",
          accept: ["git log --oneline -S FREE_DELIVERY_FROM"],
          near: [{ command: 'rg -n "DELIVERY_FEE|FREE_DELIVERY_FROM" src server', why: "That is the current state. The pickaxe search finds when the threshold arrived." }],
          hint: "git log -S with the constant.",
          success: "68cb4b8, \"Free delivery on orders over ₦50,000\": the business wants free delivery, and the server is right. The cart page is the one to change.",
        }),
      },
      {
        id: "a-ce-c-plan",
        title: "The plan",
        explain:
          "Write the plan before the change: the root cause, the fix that removes it, how you will prove it, and what you will deliberately not do in this change.",
        decision: {
          scenario: "Choose the plan.",
          question: "Which plan would a reviewer approve?",
          options: [
            { id: "a", text: "Move the rule into one shared module used by both the server and the cart page; add a test at the boundary (₦49,999 charged, ₦50,000 free); prove with tests, lint and build; leave the other debt (OldCheckout, axios) for separate changes", why: "Root-cause fix, a test where the bug was, proof, and a tight scope." },
            { id: "b", text: "Change Cart.jsx's constant to match", whyWrong: "A symptom fix: the copies can drift again." },
            { id: "c", text: "Fix the totals and also remove OldCheckout, axios and upgrade React", whyWrong: "Unrelated changes make the fix hard to review and to revert." },
            { id: "d", text: "Delete the cart page's total", whyWrong: "Customers need to see what they will pay." },
          ],
          correct: "a",
          aftermath: "One cause, one change, one proof.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 67 · C.2
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ce-l67-fix-review",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 2,
    covers: ["C.2"],
    title: "Capstone 2: Diagnose, Fix and Review",
    subtitle: "An agent makes the change on a branch; you verify every part of it before it is merged",
    estimatedMinutes: 40,
    intro:
      "You delegate the change to an AI agent, with a well-scoped task, its own branch and the project's instruction file. Then you do the part that cannot be delegated: checking that the change does what the plan says, nothing more, and that the evidence proves it.",

    atoms: [
      {
        id: "a-ce-c-agent-task",
        title: "The task you give the agent",
        explain:
          "The plan becomes the agent's task: the goal, the files, the limits, and the definition of done, on a branch of its own, with AGENTS.md in place.",
        decision: {
          scenario: "Write the agent's task.",
          question: "Which is best?",
          options: [
            { id: "a", text: "\"On branch fix/cart-delivery-rule: move DELIVERY_FEE, FREE_DELIVERY_FROM and orderTotals into shared/pricing.js; make server/services/orderService.js re-export them and src/pages/Cart.jsx use orderTotals. Add a test that ₦49,999 is still charged delivery. No other changes, no new dependencies. Done when npm test, npm run lint and npm run build pass. List every file you touch.\"", why: "Goal, files, limits, definition of done, and a request that makes its report checkable." },
            { id: "b", text: "\"Fix the cart totals.\"", whyWrong: "No scope, no definition of done." },
            { id: "c", text: "\"Refactor pricing however you think best.\"", whyWrong: "Unbounded." },
            { id: "d", text: "\"Fix the totals and push to main.\"", whyWrong: "Skips the review this lesson is about." },
          ],
          correct: "a",
          aftermath: "A task you can check is a task you can delegate.",
        },
      },
      {
        id: "a-ce-c-scope",
        title: "Review: the scope, including new files",
        explain:
          "Start the review with git status, not git diff: a diff of tracked files does not show NEW files, and new files are where an agent can add things nobody asked for. Every entry must be in the plan.",
        terminalExercise: term("c-fix", {
          intro: "The agent has finished on fix/cart-delivery-rule; nothing is committed yet.",
          goal: "See every file the change touches, including new ones.",
          accept: ["git status --short"],
          near: [{ command: "git diff --stat", why: "That lists only tracked files: it misses the new shared/ folder. git status shows everything." }],
          hint: "git status --short.",
          success: "Three modified files (orderService, Cart.jsx, the test) and one new folder, shared/. All four are in the plan; nothing else.",
        }),
      },
      {
        id: "a-ce-c-tests",
        title: "Review: the evidence",
        explain:
          "Run the checks yourself rather than trusting the agent's report: the full suite (including the new boundary test), lint and the build.",
        terminalExercise: term("c-fix", {
          goal: "Run the full test suite on the change.",
          accept: ["npm test 2>&1 | tail -n 9"],
          near: [{ command: "npm run lint", why: "Lint is part of the proof; start with the tests." }],
          hint: "npm test, keeping the last 9 lines.",
          success: "9 of 9 pass, including the new test. Lint is clean and the build succeeds. The evidence matches the agent's claim this time; you know because you checked.",
        }),
      },
      {
        id: "a-ce-c-single-rule",
        title: "Review: is the cause really gone?",
        explain:
          "The plan's claim is that the rule now lives in one place. Verify that directly: search for the constants again across all three folders.",
        terminalExercise: term("c-fix", {
          goal: "Confirm the delivery rule is now defined in exactly one place.",
          accept: ['rg -n "DELIVERY_FEE|FREE_DELIVERY_FROM" src server shared'],
          near: [{ command: "git status --short", why: "That shows which files changed. Search for the constants to prove where the rule now lives." }],
          hint: "The same search as in C.1, now including shared.",
          success: "Defined only in shared/pricing.js; orderService.js re-exports it; Cart.jsx no longer mentions it at all (it calls orderTotals). The root cause is gone, not hidden.",
        }),
      },
      {
        id: "a-ce-c-diff",
        title: "Review: the size of the change",
        explain:
          "Finally the diff itself, read line by line. Its size should match the plan: a few lines in each file, and more lines removed than added is often a sign of a good refactor.",
        terminalExercise: term("c-fix", {
          goal: "Summarise the changes to tracked files.",
          accept: ["git diff --stat"],
          near: [{ command: "npm run build 2>&1 | tail -n 4", why: "The build passes. Now look at the size of the change itself." }],
          hint: "git diff --stat.",
          success: "3 tracked files, 10 lines added and 14 removed (plus the new 10-line shared/pricing.js, which git status showed). Smaller after the fix than before: duplication removed.",
        }),
      },
      {
        id: "a-ce-c-merge",
        title: "Merging the reviewed fix",
        explain:
          "With the review done, the change is committed on its branch with a message explaining the cause, and merged. A merge commit (--no-ff) keeps the fix visible as one unit in the history, easy to find and, if ever needed, to revert as a whole. On a team this is the moment the pull request is approved and merged.",
        terminalExercise: term("c-merge", {
          intro: "The fix is committed on fix/cart-delivery-rule.",
          goal: "Merge the fix into main with a merge commit.",
          accept: [MERGE],
          near: [{ command: "git log --oneline main..fix/cart-delivery-rule", why: "That confirms the branch holds one commit. Now merge it with --no-ff." }],
          hint: "git merge --no-ff with the branch and a message.",
          success: "Merged: four files, including the new shared/pricing.js and the new test.",
        }),
      },
      {
        id: "a-ce-c-history-after",
        title: "The history tells the story",
        explain:
          "Anyone who inherits the project after you should be able to see what happened from the history alone.",
        terminalExercise: term("c-merge", {
          goal: "Draw the last few commits as a graph.",
          accept: ["git log --oneline --graph -n 4"],
          near: [{ command: "git branch -d fix/cart-delivery-rule", why: "Tidy up afterwards. First look at the history." }],
          hint: "git log --oneline --graph, last 4.",
          success: "The fix commit on its own branch, joined into main by the merge commit. The next owner can find it, read why it was made, and revert it as one unit.",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 68 · C.3
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ce-l68-handover",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 3,
    covers: ["C.3"],
    title: "Capstone 3: Hand Over",
    subtitle: "The maintenance report, the next steps, and leaving the repository better than you found it",
    estimatedMinutes: 36,
    intro:
      "Ownership ends with a handover: to the owner who asked, to your team, or to whoever inherits the project next. Make it easy for them to know what you did, what state the code is in, and what to do next.",

    atoms: [
      {
        id: "a-ce-c-branch-clean",
        title: "Tidying up",
        explain:
          "A merged branch has done its job; delete it so the branch list shows only work in progress. git branch -d refuses to delete a branch that is not merged, which makes it a safe habit.",
        terminalExercise: term("c-merge", {
          goal: "Delete the merged fix branch.",
          accept: ["git branch -d fix/cart-delivery-rule"],
          near: [{ command: "git log --oneline --graph -n 4", why: "The history is fine. Delete the merged branch with git branch -d." }],
          hint: "git branch with lowercase -d.",
          success: "Deleted (Git names the commit it pointed to, now part of main). Lowercase -d is the safe one; -D would delete even unmerged work.",
        }),
      },
      {
        id: "a-ce-c-pr",
        title: "The pull request description",
        explain:
          "The pull request (or merge commit message) is the permanent explanation of the change. It links the complaint, states the root cause, describes the fix, shows the evidence, and says what AI did and what you verified.",
        decision: {
          scenario: "Choose the description for the fix.",
          question: "Which one?",
          options: [
            { id: "a", text: "\"Fixes #12 (cart shows a higher total than charged). Cause: the cart page had its own delivery rule; the server's changed in 68cb4b8 (free from ₦50,000) and the cart's did not. Fix: one rule in shared/pricing.js, used by both. Evidence: new boundary test; 9/9 tests, lint, build. Agent-written; scope, tests and rule location verified by me.\"", why: "Issue, cause, fix, evidence and AI involvement: everything the next reader needs." },
            { id: "b", text: "\"Fixed cart\"", whyWrong: "Explains nothing." },
            { id: "c", text: "\"Done by AI\"", whyWrong: "Says who typed, not what or why." },
            { id: "d", text: "The full diff pasted again", whyWrong: "The diff is already there; the description explains it." },
          ],
          correct: "a",
          aftermath: "The PR is documentation that never goes stale, because it describes one moment.",
        },
      },
      {
        id: "a-ce-c-report",
        title: "The maintenance report",
        explain:
          "The health report answers the owner's second question. Use the inspection output as the skeleton and add your judgement: what you verified, what you fixed, what remains, ordered by risk, each with evidence.",
        example:
          "# Kobo Market: maintenance report (20 Oct 2026)\n\nState: main @ merge of fix/cart-delivery-rule; 9/9 tests, lint and build pass.\n\nFixed: cart and server now share one delivery rule (shared/pricing.js);\n  customers were shown ₦1,500 more than charged from ₦50,000. Test added.\n\nRemaining, by risk:\n 1. Payments never verified end to end (no test key locally; no tests).\n 2. No tests for API routes or the UI; one route typo would only be caught by lint.\n 3. Node version not declared (engines); start script needs Node ≥ 22.\n 4. Session token in localStorage; consider httpOnly cookies (needs an ADR).\n 5. Debt: OldCheckout.jsx unused; axios unused; ProductCard formats prices itself.\n 6. Dependencies: React 19, ESLint 10 available (majors; plan separately).\n\nDocs: codebase map in docs/; AGENTS.md added; ADR 0001 explains the JSON store.",
        decision: {
          scenario: "The owner has five minutes. Which item goes first in \"Remaining\"?",
          question: "Choose one.",
          options: [
            { id: "a", text: "Payments never verified end to end", why: "Money is the highest-risk path, and it is the one nobody has seen work." },
            { id: "b", text: "OldCheckout.jsx is unused", whyWrong: "Harmless clutter." },
            { id: "c", text: "React 19 is available", whyWrong: "An upgrade is not urgent." },
            { id: "d", text: "The CSS could be tidier", whyWrong: "Not a risk." },
          ],
          correct: "a",
          aftermath: "Risk to users and money first, always.",
        },
      },
      {
        id: "a-ce-c-next",
        title: "What you would do next",
        explain:
          "End with a short, ordered plan for the next owner, each item small enough to be one change, with the reason and the evidence that will show it is done. That plan is the difference between handing over a codebase and handing over a problem.",
        decision: {
          scenario: "Which next-steps list is most useful?",
          question: "Choose one.",
          options: [
            { id: "a", text: "\"1. Verify a Paystack test payment end to end; add an integration test for POST /api/orders. 2. Add engines: node >= 24 and set it on the host. 3. Remove OldCheckout and axios (one commit each, tests + build). 4. Plan React 19 on its own branch.\"", why: "Ordered by risk, each item one change with a clear way to know it is done." },
            { id: "b", text: "\"Improve the code.\"", whyWrong: "Not actionable." },
            { id: "c", text: "\"Rewrite in a modern framework.\"", whyWrong: "The rewrite trap, with no problem named." },
            { id: "d", text: "No next steps: the bug is fixed", whyWrong: "The report found more risks; say what to do about them." },
          ],
          correct: "a",
          aftermath: "You have taken ownership: understood it, changed it safely, and left a clear path forward.",
        },
      },
    ],

    task: {
      title: "Capstone: take ownership of a codebase",
      intro:
        "Choose an application you did not write: an open-source project with an open bug, a client's or employer's app, or a project a classmate built with AI. Take ownership of it from start to finish, and hand it over.",
      prompts: [
        "Baseline and inspection report (your Module 10 workflow), and a one-page codebase map.",
        "A reported or discovered problem: its reproduction, symptom, root cause (with git history) and plan.",
        "The fix, made by you or by an AI agent under an instruction file, on its own branch, with a failing test written first.",
        "Your review of the change: scope (including new files), evidence (tests, lint, build), and confirmation the cause is gone.",
        "The pull request description: issue, cause, fix, evidence, and exactly what AI did and what you verified.",
        "A maintenance report: state, what you fixed, remaining risks ordered by severity, and a next-steps plan of single, checkable changes.",
        "Present it in ten minutes to someone who has never seen the project, and answer their questions from the evidence.",
      ],
      closing: "That is codebase engineering: understand it, change it safely, prove it, and leave it better than you found it.",
    },
    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
