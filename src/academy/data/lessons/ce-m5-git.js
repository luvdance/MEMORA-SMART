/**
 * CODEBASE ENGINEERING · MODULE 5 · GIT, GITHUB AND SAFE CODEBASE MANAGEMENT
 *
 * Curriculum 5.1 – 5.12 and the practical, 5.P. The model; status, diff and
 * log; blame and show; branches and meaningful commits; reviewing AI
 * changes; staging; reverting and the risks of reset, restore and force
 * push; conflicts; pull requests, reviews and issues; tags, releases and
 * rollback; .gitignore. The practical is the AI change that broke sign-in.
 *
 * Every Git session was recorded on Kobo Market's real history. The remote
 * is a bare repository beside the clone (../kobo-market.git) standing in for
 * GitHub; on GitHub the address would be a github.com URL.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

import { term, shown } from "./ce-helpers.js";

export const SECTION_ID = "ce-s5-git";
const MODULE = "ce-m5-git";

const COMMIT = 'git commit -m "Show free delivery in the cart from ₦50,000"';

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 25 · 5.1 – 5.2
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ce-l25-git-model",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 1,
    covers: ["5.1", "5.2"],
    title: "How Git Sees a Project; status, diff and log",
    subtitle: "Repositories, commits, branches, remotes and working trees, and the three commands you run most",
    estimatedMinutes: 30,
    intro:
      "Git is the project's memory. Everything this module teaches rests on a handful of ideas, and on three commands that answer the questions you will ask a hundred times a week: what is different right now, exactly how, and what happened before.",

    atoms: [
      {
        id: "a-ce-git-concepts",
        title: "Repository, commit, branch, remote, working tree",
        explain:
          "A repository is the project plus its full history, kept in the .git folder. A commit is a saved snapshot of every tracked file, with an author, a date, a message and an id (a hash such as 68cb4b8). A branch is a movable name pointing at a commit (main); committing moves it forward. A remote is another copy of the repository you push to and pull from, usually on GitHub, conventionally called origin; origin/main is your clone's record of where main was on the remote. The working tree is the files on your disk, which you edit; the staging area (index) holds the changes you have chosen for the next commit.",
        table: {
          caption: "The pieces.",
          headers: ["Term", "Is", "In Kobo Market"],
          rows: [
            ["Commit", "A snapshot with id, author, date, message", "68cb4b8 Free delivery on orders over ₦50,000"],
            ["Branch", "A name pointing at a commit", "main, feature/wishlist"],
            ["Remote", "Another copy you sync with", "origin (../kobo-market.git)"],
            ["origin/main", "Where main was on the remote at your last fetch", "222c42e"],
            ["Working tree", "The files on your disk", "~/kobo-market"],
            ["Staging area", "Changes chosen for the next commit", "(empty: clean tree)"],
          ],
        },
        terminalExercise: term("m5-basics", {
          goal: "List every branch, including the ones that exist only on the remote.",
          accept: ["git branch -a"],
          near: [{ command: "git branch", why: "That lists local branches only (main). -a includes the remote-tracking ones." }],
          hint: "git branch with -a (all).",
          success: "Locally only main; on the remote also feature/wishlist, a branch Amaka pushed and never merged. Unmerged branches are part of the inheritance: work someone started.",
        }),
      },
      {
        id: "a-ce-remotes",
        title: "Where the code is shared",
        explain:
          "git remote -v shows each remote's name and address, for fetching and pushing. On a real team it is a GitHub (or GitLab, Bitbucket) URL. It tells you where the shared truth lives, and therefore where pull requests, issues and CI happen.",
        terminalExercise: term("m5-basics", {
          goal: "Find out where this repository fetches from and pushes to.",
          accept: ["git remote -v"],
          near: [{ command: "git branch -a", why: "That shows remote branches. The remote's address is shown by git remote -v." }],
          hint: "git remote, verbose.",
          success: "origin, at ../kobo-market.git, for both fetch and push. In this course the remote is a folder beside your clone; at work it would be github.com/your-company/kobo-market.git.",
        }),
      },
      {
        id: "a-ce-graph",
        title: "Seeing branches as a graph",
        explain:
          "History is a graph: each commit points to its parent, and branches are names on commits. git log --oneline --graph --all draws it, which shows at a glance where branches split off, which are ahead, and what has not been merged.",
        terminalExercise: term("m5-basics", {
          goal: "Draw the history of all branches, to see where feature/wishlist sits relative to main.",
          accept: ["git log --oneline --graph --all -n 4"],
          near: [{ command: "git log --oneline -n 5", why: "That shows the current branch only. Add --graph and --all to see every branch." }],
          hint: "git log --oneline --graph --all, last 4 commits.",
          success: "1ab07b0 \"Start a wishlist page\" sits one commit on top of main's latest (222c42e): the branch is one commit ahead and could be merged without conflict.",
        }),
      },
      {
        id: "a-ce-status",
        title: "git status: what is different right now",
        explain:
          "git status compares the working tree and staging area with the last commit, and lists files as modified, staged, untracked (new to Git) or deleted, with hints for what to do next. git status --short (-s) prints one line per file: the first column is the staging area, the second the working tree, M for modified, A added, D deleted, ?? untracked.",
        terminalExercise: term("m5-status-diff", {
          intro: "Someone has been editing. You have just sat down at the computer.",
          goal: "Get a compact, one-line-per-file summary of what has changed and what is new.",
          accept: ["git status --short"],
          near: [{ command: "git status", why: "That gives the full version with hints. The compact form is --short." }],
          hint: "git status with --short.",
          success: " M src/components/ProductCard.jsx (modified, not staged) and ?? notes.txt (untracked: Git has never seen it). Two changes, one of them probably not meant for a commit.",
        }),
      },
      {
        id: "a-ce-diff",
        title: "git diff: exactly what changed",
        explain:
          "git diff shows the changes in the working tree that are not staged yet, line by line: lines starting with - were removed, + were added, others are unchanged context. Each @@ -1,6 +1,7 @@ header says where the hunk is: from line 1, 6 lines before and 7 after. git diff --stat summarises the files and the size of each change. Untracked files never appear in git diff, because Git has nothing to compare them with.",
        terminalExercise: term("m5-status-diff", {
          goal: "See exactly which lines of ProductCard.jsx were changed.",
          accept: ["git diff"],
          near: [{ command: "git diff --stat", why: "That shows one file, 3 lines added and 2 removed, but not which lines. Run git diff without --stat." }],
          hint: "git diff on its own.",
          success: "The inline price formatting (and its TODO) was replaced by a call to formatPrice, with an import added. Someone did the TODO. notes.txt is not in the diff: it is untracked.",
        }),
      },
      {
        id: "a-ce-log",
        title: "git log: what happened before",
        explain:
          "git log lists commits newest first, with the full id, author, date and message. git log --oneline shows one line each; -n 5 limits the count; -- FILE limits it to commits that touched a file; --since, --author and --grep filter it further. The full form is worth reading when you need the date and the author together.",
        terminalExercise: term("m5-status-diff", {
          goal: "See the last two commits in full: id, author, date and message.",
          accept: ["git log -n 2"],
          near: [{ command: "git status", why: "Status describes the uncommitted present. The past is git log." }],
          hint: "git log, limited to 2.",
          success: "Amaka's \"Keep the cart when the page reloads\" (2 April) and Tolu's README update (27 March): the most recent work, and who to ask about it if they were still here.",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 26 · 5.3 – 5.4
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ce-l26-blame-show",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 2,
    covers: ["5.3", "5.4"],
    title: "Who Changed This Line, When, and Why: blame and show",
    subtitle: "From a puzzling line of code to the commit, the author and the reason",
    estimatedMinutes: 28,
    intro:
      "Every line of code was put there by a commit, and the commit usually says why. When a line puzzles you, two commands take you from the line to its reason.",

    atoms: [
      {
        id: "a-ce-blame",
        title: "git blame: the commit behind every line",
        explain:
          "git blame FILE prints every line of a file with the commit, author and date that last changed it. -L 1,9 limits it to lines 1 to 9. Despite the name it is not about blame: it is how you find the context for a line, so you can read the commit that explains it. Editors show the same information inline (GitLens in VS Code, the blame view on GitHub).",
        terminalExercise: term("m5-blame", {
          goal: "Find who wrote each line of orderService.js's first nine lines, and when.",
          accept: ["git blame -L 1,9 server/services/orderService.js"],
          near: [{ command: "git log --oneline -- server/services/orderService.js", why: "That lists the two commits that touched the file, but not which lines each wrote. git blame maps lines to commits." }],
          hint: "git blame with -L 1,9 and the file.",
          success: "Amaka wrote it all, in two commits: d34d21d5 (11 March, the original) and 68cb4b86 (25 March: the threshold and the new delivery logic, lines 3, 7 and 8).",
        }),
      },
      {
        id: "a-ce-blame-line",
        title: "Blaming one line",
        explain:
          "Often you care about one line: the one that is wrong. Blame just that line and compare its date with the related change elsewhere.",
        terminalExercise: term("m5-blame", {
          goal: "When was the cart page's DELIVERY_FEE line (Cart.jsx line 5) last changed?",
          accept: ["git blame -L 5,5 src/pages/Cart.jsx"],
          near: [{ command: "git blame -L 1,9 server/services/orderService.js", why: "That is the server's file. Blame line 5 of src/pages/Cart.jsx." }],
          hint: "git blame -L 5,5 and the cart page.",
          success: "d34d21d5, 11 March: never touched since. The server's rule changed on 25 March; the cart's copy did not. Two dates, one root cause.",
        }),
      },
      {
        id: "a-ce-show",
        title: "git show: everything about one commit",
        explain:
          "git show ID prints a commit's full message and its complete diff. It answers \"what exactly did this commit do?\". git show --stat ID lists only the files and sizes; git show ID -- FILE shows just one file's part of it. It works on tags too (git show v1.0.0).",
        terminalExercise: term("m5-show", {
          goal: "See exactly what the free-delivery commit (68cb4b8) changed.",
          accept: ["git show 68cb4b8"],
          near: [{ command: "git show --stat 66c82ac", why: "That is a different commit (the sign-in fix). Show 68cb4b8 in full." }],
          hint: "git show and the commit id.",
          success: "It added FREE_DELIVERY_FROM, changed how delivery is computed, and added a test, in two files: the service and its test. The cart page is not in it.",
        }),
      },
      {
        id: "a-ce-show-file",
        title: "One file's part of a large commit",
        explain:
          "Big commits are hard to read whole. git show ID -- PATH limits the diff to one file, with the full message kept on top so you still see why.",
        terminalExercise: term("m5-show", {
          goal: "Chidi's \"Require sign-in for orders\" commit (66c82ac) touched five files. See only what it changed in server/router.js.",
          accept: ["git show 66c82ac -- server/router.js"],
          near: [{ command: "git show --stat 66c82ac", why: "That lists the five files. Add -- server/router.js to see just that file's diff." }],
          hint: "git show 66c82ac, then -- and the path.",
          success: "Two routes wrapped in requireAuth: GET /api/me (new) and POST /api/orders (previously open to anyone). The commit message explains why: anyone could place orders without an account.",
        }),
      },
      {
        id: "a-ce-blame-why",
        title: "Read the message: commits explain decisions",
        explain:
          "A good commit message has a short summary line and, when it matters, a body explaining why. That body is often the only record of a decision. Before you change or \"clean up\" a line that looks odd, blame it and read the message: the oddness may be deliberate.",
        example: shown("m5-show", "git show --stat 66c82ac"),
        decision: {
          scenario: "You find requireAuth wrapping POST /api/orders and think it is unnecessary, because the frontend only shows Checkout to signed-in users.",
          question: "What does the commit above tell you, and what should you do?",
          options: [
            { id: "a", text: "Keep it: the message says the endpoint was open to anyone. Hiding a button does not stop someone calling the API directly", why: "The commit records the reason. The server must enforce access whatever the interface shows." },
            { id: "b", text: "Remove it: the frontend already handles it", whyWrong: "Anyone can send a request with curl, as you did in Module 4." },
            { id: "c", text: "Ask an AI whether to remove it", whyWrong: "The answer is already in the history, written by the person who made the decision." },
            { id: "d", text: "Rewrite the commit message", whyWrong: "History records what happened; it is not edited after it is shared." },
          ],
          correct: "a",
          aftermath: "Blame, then show, then decide.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 27 · 5.5 – 5.6
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ce-l27-branches-commits",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 3,
    covers: ["5.5", "5.6"],
    title: "Feature Branches, Meaningful Commits, and Reviewing AI Changes",
    subtitle: "Isolating your work, recording it well, and reading what an AI changed before you accept it",
    estimatedMinutes: 30,
    intro:
      "Every change should happen on its own branch and be recorded in commits that explain themselves. And when the change came from an AI, reading the diff before accepting it is not optional: it is the job.",

    atoms: [
      {
        id: "a-ce-feature-branch",
        title: "Creating a feature branch",
        explain:
          "A feature branch isolates one piece of work from main, so main stays releasable while you work. git switch -c NAME creates a branch from where you are and switches to it (git checkout -b NAME is the older spelling). Teams name branches by type and purpose: fix/cart-free-delivery, feature/wishlist, chore/upgrade-vite.",
        terminalExercise: term("m5-branch", {
          goal: "Start work on the cart's delivery bug on a new branch called fix/cart-free-delivery.",
          accept: ["git switch -c fix/cart-free-delivery"],
          near: [{ command: "git branch", why: "That lists branches. Create and switch with git switch -c NAME." }],
          hint: "git switch with -c (create) and the name.",
          success: "You are on fix/cart-free-delivery. Anything you commit now leaves main untouched until the branch is reviewed and merged.",
        }),
      },
      {
        id: "a-ce-meaningful-commit",
        title: "Meaningful commits",
        explain:
          "A meaningful commit holds one logical change and says what it does in a short imperative summary (\"Show free delivery in the cart from ₦50,000\", not \"fixes\" or \"wip\"), with a body when the why is not obvious. Small, single-purpose commits can be reviewed, reverted and understood on their own; one giant commit of \"various changes\" can only be taken or rejected whole.",
        terminalExercise: term("m5-commit", {
          intro: "On fix/cart-free-delivery, the cart page has been fixed and staged.",
          goal: "Record the staged change with a clear, imperative message.",
          accept: [COMMIT],
          near: [{ command: "git add src/pages/Cart.jsx", why: "Staging is done. Now commit it with a message that says what the change does." }],
          hint: "git commit -m and the message in quotes.",
          success: "A new commit on fix/cart-free-delivery (the first line names the branch and the new commit's id): one file, 5 insertions and 3 deletions. Someone reading git log in a year will know what this commit was for.",
        }),
      },
      {
        id: "a-ce-review-ai-stat",
        title: "Reviewing an AI change: start with its size",
        explain:
          "When an AI assistant or agent has edited files, review its work the way a senior developer reviews a pull request. First the scope: git diff --stat shows which files changed and by how much. Compare it with what you asked for. Files you did not expect are the first thing to question.",
        terminalExercise: term("m5-ai-review", {
          intro: "You asked an AI assistant to \"make API errors easier to debug\". It has finished.",
          goal: "Before reading any code, see which files the AI changed and how much.",
          accept: ["git diff --stat"],
          near: [{ command: "git diff", why: "Read the details next. Start with the overview: --stat." }],
          hint: "git diff with --stat.",
          success: "Two files: the API client (5 lines added) and Products.jsx (1 line). The client fits the request. Why did the products page change? Read the diff.",
        }),
      },
      {
        id: "a-ce-review-ai-diff",
        title: "Reading the AI's diff",
        explain:
          "Then read every line of the diff, asking of each change: does it do what was asked, does it do anything else, and could it leak data, hide errors or weaken a check? AI changes are often mostly right, with one or two lines that are quietly wrong.",
        terminalExercise: term("m5-ai-review", {
          goal: "Read exactly what the AI changed.",
          accept: ["git diff"],
          near: [{ command: "git diff --stat", why: "That is the summary. Read the actual lines with git diff." }],
          hint: "git diff.",
          success: "Two problems. The client now logs the user's session token to the browser console with every failed request (a leak). And Products.jsx's .catch now does nothing, so a failed product load shows an empty page with no error: the opposite of \"easier to debug\".",
        }),
      },
      {
        id: "a-ce-review-verdict",
        title: "Accept, change or reject",
        explain:
          "A review ends in a decision. You can accept the change, accept part of it, ask for (or make) specific changes, or reject it. Be precise about which lines are wrong and why, because that is what gets a better second attempt from a person or an AI.",
        example: shown("m5-ai-review", "git diff"),
        decision: {
          scenario: "This is the AI's diff for \"make API errors easier to debug\".",
          question: "What is the right review outcome?",
          options: [
            { id: "a", text: "Request changes: log the path and the error, never the token; and restore setError in Products.jsx so failures are shown, not swallowed", why: "The intent is fine, but one line leaks a credential and the other hides errors. Name both lines and why." },
            { id: "b", text: "Accept: more logging always helps debugging", whyWrong: "Not when it logs a session token to a console anyone with the browser can read." },
            { id: "c", text: "Accept the Products.jsx change only", whyWrong: "That is the change that HIDES errors." },
            { id: "d", text: "Reject the whole thing without comment", whyWrong: "The next attempt will make the same mistakes. Say what is wrong." },
          ],
          correct: "a",
          aftermath: "Review the diff, not the description. Module 6 makes this a habit with agents.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 28 · 5.7 – 5.8
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ce-l28-staging-undo",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 4,
    covers: ["5.7", "5.8"],
    title: "Staging, Unstaging, and Undoing Safely",
    subtitle: "Choosing exactly what to commit, and the difference between revert, restore, reset and force push",
    estimatedMinutes: 34,
    intro:
      "Git can undo almost anything, but its undo commands differ in one crucial way: some create new history, some throw work away, and some rewrite history other people already have. Knowing which is which is what makes Git safe.",

    atoms: [
      {
        id: "a-ce-staging",
        title: "Staging only what belongs in the commit",
        explain:
          "git add FILE stages a file's changes; git add . stages everything in the folder, which is how unrelated edits end up in a commit. git restore --staged FILE unstages a file (the edit stays in your working tree, it just will not be committed). For finer control, git add -p walks through each hunk and asks whether to stage it.",
        terminalExercise: term("m5-staging", {
          intro: "Two unrelated edits: the cart heading, and a README tweak. git add . has staged both.",
          goal: "You want this commit to contain only the cart change. Unstage README.md without losing the edit.",
          accept: ["git restore --staged README.md"],
          near: [{ command: "git add .", why: "That is what staged both. Unstage README.md with git restore --staged." }],
          hint: "git restore with --staged, then the file.",
          success: "README.md is back to \"not staged\" and still modified on disk; Cart.jsx stays staged. The commit will now hold exactly one change.",
        }),
      },
      {
        id: "a-ce-staged-view",
        title: "Seeing exactly what will be committed",
        explain:
          "git diff shows unstaged changes; git diff --staged shows staged ones, which is exactly what git commit will record. Check it before every commit: it is the last moment to catch a debug line, a secret or an unrelated file.",
        terminalExercise: term("m5-staging", {
          goal: "Right after git add ., see a summary of everything that is staged to be committed.",
          accept: ["git diff --staged --stat"],
          near: [{ command: "git status --short", why: "That shows the state before staging. Ask for the staged diff, summarised: git diff --staged --stat." }],
          hint: "git diff with --staged and --stat.",
          success: "Two files staged: README.md and Cart.jsx, one line each. One of them does not belong, which is why the next step unstaged it.",
        }),
      },
      {
        id: "a-ce-restore",
        title: "git restore: discarding an edit",
        explain:
          "git restore FILE throws away the uncommitted changes to a file, returning it to the last commit. It is the right tool for an accidental edit, and it is permanent: those changes were never committed, so Git cannot bring them back. Check with git diff FILE first.",
        terminalExercise: term("m5-restore", {
          intro: "App.jsx was changed by mistake (the start page set to \"cart\"); the README edit is wanted.",
          goal: "Discard the accidental App.jsx change and keep the README edit.",
          accept: ["git restore src/App.jsx"],
          near: [{ command: "git stash", why: "Stash sets aside ALL changes, the README edit included. Discard just the one file." }],
          hint: "git restore and the file.",
          success: "git diff --stat now shows only README.md. App.jsx is back as it was committed; the mistaken edit is gone for good.",
        }),
      },
      {
        id: "a-ce-stash",
        title: "git stash: setting work aside",
        explain:
          "git stash saves all your uncommitted changes and gives you a clean working tree, so you can switch to something urgent. git stash list shows what is saved; git stash pop brings the latest back and removes it from the list. It is a short-term shelf, not storage: for anything longer, commit on a branch.",
        terminalExercise: term("m5-restore", {
          goal: "An urgent bug comes in. Put your README edit aside so the working tree is clean, without losing it.",
          accept: ["git stash"],
          near: [{ command: "git restore src/App.jsx", why: "That discards a change for good. Setting work aside to get it back later is git stash." }],
          hint: "One word after git.",
          success: "\"Saved working directory and index state\": the tree is clean (git status confirms it), and git stash pop later brings the README edit back.",
        }),
      },
      {
        id: "a-ce-revert",
        title: "git revert: undoing a commit by adding one",
        explain:
          "git revert ID creates a NEW commit that does the opposite of the commit you name. History is preserved: anyone can see the change and its undoing. Because it only adds, it is safe on shared branches like main, and it is the standard way to undo something that has already been pushed.",
        terminalExercise: term("m5-undo", {
          intro: "The last commit put a typo (\"Kobo Markett\") in the navbar.",
          goal: "Undo the last commit in the way that is safe on a shared branch.",
          accept: ["git revert --no-edit HEAD"],
          near: [{ command: "git reset --hard HEAD~2", why: "reset moves the branch back and discards commits, rewriting history. On a shared branch, revert adds an undoing commit instead." }],
          hint: "git revert, the last commit (HEAD), without opening an editor.",
          success: "A new commit, Revert \"Update navbar title\". Both commits are in the history; the code is back as it was.",
        }),
      },
      {
        id: "a-ce-reset-danger",
        title: "Why reset and force push are dangerous",
        explain:
          "git reset --hard ID moves your branch back to an older commit and discards everything after it, including uncommitted work. That is fine for commits only you have. But if those commits were already pushed, your branch now disagrees with the remote's, and Git refuses a normal push. The tempting fix, git push --force, overwrites the remote: everyone else's copy of the discarded commits, and anything they pushed since, is now orphaned.",
        terminalExercise: term("m5-force", {
          intro: "A commit was pushed, then removed locally with git reset --hard HEAD~1.",
          goal: "Try to push, and see how Git protects the shared branch.",
          accept: ["git push"],
          near: [{ command: "git status", why: "Status warns you are behind origin/main. Try the push to see the rejection itself." }],
          hint: "Just git push.",
          success: "Rejected (non-fast-forward): the remote has a commit your branch does not. Git will not throw away shared history unless you force it.",
        }),
      },
      {
        id: "a-ce-force-push",
        title: "Choosing the safe undo",
        explain:
          "The rule of thumb: on your own unpushed commits, reset and amend freely. On anything pushed to a shared branch, use revert. If you ever must rewrite a pushed branch (your own feature branch, say), use git push --force-with-lease, which refuses if someone else has pushed since your last fetch, never plain --force.",
        decision: {
          scenario: "You pushed a commit to main that broke checkout. Two teammates have pulled since.",
          question: "How do you undo it?",
          options: [
            { id: "a", text: "git revert the commit and push the revert", why: "It undoes the change with a new commit; your teammates simply pull it. Nobody's history breaks." },
            { id: "b", text: "git reset --hard HEAD~1 and git push --force", whyWrong: "It rewrites main under your teammates; their clones now hold a commit the remote has lost." },
            { id: "c", text: "Delete the repository and push again", whyWrong: "Destroys everyone's shared history." },
            { id: "d", text: "git restore the files and do nothing else", whyWrong: "That changes your working tree only; main on the remote stays broken." },
          ],
          correct: "a",
          aftermath: "Shared history: add, never rewrite.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 29 · 5.9 – 5.10
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ce-l29-conflicts-prs",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 5,
    covers: ["5.9", "5.10"],
    title: "Merge Conflicts, Pull Requests, Code Review and Issues",
    subtitle: "When two changes collide, and how teams agree on what gets merged",
    estimatedMinutes: 32,
    intro:
      "Conflicts are not errors: they are Git asking a person to decide. And on a team, nothing reaches main without a pull request someone else has reviewed.",

    atoms: [
      {
        id: "a-ce-conflict",
        title: "How a conflict happens",
        explain:
          "When you merge a branch, Git combines the changes on both sides. If both changed the same lines differently, it cannot know which you want: it stops, marks the file as conflicted and leaves the decision to you. Parallel work by several people (or several AI agents) makes this routine.",
        terminalExercise: term("m5-conflict", {
          intro: "A branch fix/delivery-fee changed the cart's fee to ₦2,000. Meanwhile main added a comment on the same line.",
          goal: "Merge fix/delivery-fee into main.",
          accept: ["git merge fix/delivery-fee"],
          near: [{ command: "git status", why: "Merge first, then check status." }],
          hint: "git merge and the branch name.",
          success: "CONFLICT (content) in src/pages/Cart.jsx: both sides edited line 5. git status now lists it under \"Unmerged paths\" as both modified.",
        }),
      },
      {
        id: "a-ce-conflict-read",
        title: "Reading the conflict",
        explain:
          "Git writes both versions into the file between markers: <<<<<<< HEAD (your branch's version), ======= and >>>>>>> BRANCH (the incoming version). git diff during a conflict shows them in a combined format. Read both sides and work out what each change was trying to do before deciding.",
        terminalExercise: term("m5-conflict", {
          goal: "See both conflicting versions of the line.",
          accept: ["git diff"],
          near: [{ command: "git status", why: "Status names the conflicted file. git diff shows the conflicting lines." }],
          hint: "git diff.",
          success: "HEAD (main): fee 150000 with a comment that it must match orderService.js. fix/delivery-fee: fee 200000. One change is a note, the other a business decision.",
        }),
      },
      {
        id: "a-ce-conflict-resolve",
        title: "Resolving it",
        explain:
          "To resolve: edit the file to the version you actually want (which may combine both), delete the three marker lines, then git add the file and git commit to finish the merge. Editors show Accept Current, Accept Incoming and Accept Both buttons, but you still decide. If you are not ready to decide, git merge --abort returns everything to before the merge.",
        example: shown("m5-conflict", "git diff"),
        decision: {
          scenario: "The fee really is going up to ₦2,000, and main's comment that the cart must match orderService.js is true.",
          question: "What should line 5 become?",
          options: [
            { id: "a", text: "const DELIVERY_FEE = 200000; // ₦2,000, must match orderService.js, and orderService.js must be changed to ₦2,000 in the same merge", why: "It keeps both intentions: the new fee and the warning. And the warning itself tells you the server needs the same change." },
            { id: "b", text: "Keep main's line and drop the fee change", whyWrong: "That loses the business decision the branch was made for." },
            { id: "c", text: "Keep the branch's line and drop the comment", whyWrong: "That loses the warning, and the server would still charge ₦1,500." },
            { id: "d", text: "Leave the conflict markers in and commit", whyWrong: "The file would not even run." },
          ],
          correct: "a",
          aftermath: "A conflict is two intentions. The resolution should honour both, or consciously drop one.",
        },
      },
      {
        id: "a-ce-merge-abort",
        title: "Backing out of a merge",
        explain:
          "git merge --abort undoes a merge in progress and restores the files as they were before it started. Use it when the conflict needs someone else's input, or when you merged the wrong branch.",
        terminalExercise: term("m5-conflict", {
          goal: "You need to ask the product owner about the fee before deciding. Back out of the merge.",
          accept: ["git merge --abort"],
          near: [{ command: "git diff", why: "That shows the conflict. Back out of the merge with --abort." }],
          hint: "git merge with --abort.",
          success: "The merge is undone; git status --short shows nothing: clean, as before you started.",
        }),
      },
      {
        id: "a-ce-pull-requests",
        title: "Pull requests and issues",
        explain:
          "On GitHub, an issue records a bug or a task: what is wrong, how to reproduce it, who is on it. A pull request (PR; merge request on GitLab) proposes merging a branch into main: it shows the diff, runs automated checks (CI), and collects review comments and approvals. A good PR links its issue (\"Fixes #42\"), says what changed and why, how it was tested, and stays small enough to review in one sitting.",
        table: {
          caption: "A good pull request.",
          headers: ["Part", "Contains"],
          rows: [
            ["Title", "What it does: \"Show free delivery in the cart from ₦50,000\""],
            ["Link", "Fixes #42 (the issue), so the issue closes when merged"],
            ["Why", "The customer complaint and the root cause"],
            ["How tested", "New test, existing tests, manual check with a ₦59,500 cart"],
            ["Scope", "One concern; small enough to review in one sitting"],
            ["AI use", "Which parts were AI-generated, and what you verified"],
          ],
        },
        decision: {
          scenario: "Your fix is ready on fix/cart-free-delivery. The team's main branch is protected: it requires one approval and passing checks.",
          question: "What do you do?",
          options: [
            { id: "a", text: "Push the branch, open a PR linked to the issue that explains the cause and how you tested it, and wait for checks and a review", why: "That is exactly what protected branches are for: a second pair of eyes and the automated checks before anything reaches main." },
            { id: "b", text: "Merge it into main locally and push", whyWrong: "A protected branch rejects the push, and the point is to have it reviewed." },
            { id: "c", text: "Ask an admin to turn off protection for you", whyWrong: "The rule exists for exactly this kind of change." },
            { id: "d", text: "Open a PR titled \"fix\" with no description", whyWrong: "Reviewers cannot review what they do not understand." },
          ],
          correct: "a",
          aftermath: "Small PRs, linked to issues, explained: the currency of a team.",
        },
      },
      {
        id: "a-ce-code-review",
        title: "Reviewing someone else's pull request",
        explain:
          "As a reviewer you are checking: does it do what it says, is it correct (including edge cases), is it safe (secrets, permissions, data), is it tested, and will the next person understand it. Comment on specific lines with the reason and, where you can, a suggestion. Separate blocking problems from preferences.",
        decision: {
          scenario: "A PR adds a discount code feature. In it you notice the discount is applied in the cart page, and the server recalculates the order total without it.",
          question: "What is the most useful review comment?",
          options: [
            { id: "a", text: "Blocking: \"The discount is only applied in Cart.jsx; orderTotals on the server ignores it, so customers will be shown one total and charged another. The rule should live in orderService.js, with a test.\"", why: "Specific, explains the consequence, points to where the fix belongs. It is also the bug you found in Module 4, prevented before it ships." },
            { id: "b", text: "\"Looks good to me\"", whyWrong: "It approves a known bug." },
            { id: "c", text: "\"I would have used a different variable name\"", whyWrong: "A preference, while the real problem goes unmentioned." },
            { id: "d", text: "Rewrite the feature yourself and push it to their branch", whyWrong: "Explain the problem; let the author fix their PR." },
          ],
          correct: "a",
          aftermath: "Good review comments name the line, the consequence and the fix.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 30 · 5.11 – 5.12
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ce-l30-releases-ignore",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 6,
    covers: ["5.11", "5.12"],
    title: "Tags, Releases, Rollback, and .gitignore",
    subtitle: "Naming the versions you ship, getting back to one, and keeping what does not belong out",
    estimatedMinutes: 30,
    intro:
      "When production breaks, the first questions are \"which version is running?\" and \"what changed since the last good one?\". Tags answer both. And a good .gitignore keeps secrets and generated files out of history in the first place.",

    atoms: [
      {
        id: "a-ce-tags",
        title: "Tags and releases",
        explain:
          "A tag is a permanent name for one commit, used to mark releases: v1.0.0, v1.1.0. Unlike a branch, it never moves. An annotated tag (git tag -a) also stores who tagged it, when and a message. Version numbers usually follow semantic versioning: MAJOR.MINOR.PATCH, where a MAJOR bump means breaking changes. On GitHub a Release is a tag plus release notes.",
        terminalExercise: term("m5-tags", {
          goal: "List the project's releases with their messages.",
          accept: ["git tag -n"],
          near: [{ command: "git log --oneline v1.0.0..v1.1.0", why: "That compares two releases. First list them all: git tag -n." }],
          hint: "git tag with -n to show messages.",
          success: "v1.0.0 \"First release\" and v1.1.0 \"Cart survives reloads; free delivery from ₦50,000\". The free-delivery bug shipped in v1.1.0.",
        }),
      },
      {
        id: "a-ce-release-diff",
        title: "What changed between two releases",
        explain:
          "A..B in git log means \"commits in B that are not in A\": exactly what a release added. git diff --stat A B summarises the file changes between two versions. When v1.1.0 misbehaves and v1.0.0 did not, the cause is in this list.",
        terminalExercise: term("m5-tags", {
          goal: "List the commits that are in v1.1.0 but not in v1.0.0.",
          accept: ["git log --oneline v1.0.0..v1.1.0"],
          near: [{ command: "git diff --stat v1.0.0 v1.1.0", why: "That shows the file changes. The commits themselves come from git log v1.0.0..v1.1.0." }],
          hint: "git log --oneline with the range v1.0.0..v1.1.0.",
          success: "Three commits: the cart persistence, the README, and free delivery. If v1.1.0 brought a bug, one of these three is responsible.",
        }),
      },
      {
        id: "a-ce-rollback",
        title: "Getting the released code back",
        explain:
          "git switch --detach TAG puts your working tree exactly as it was at a release, without moving any branch (\"detached HEAD\": you are on a commit, not a branch). It is how you reproduce \"was this bug in the last release?\". git switch main returns you.",
        terminalExercise: term("m5-tags", {
          goal: "Check out the code exactly as it was released in v1.0.0, without changing any branch.",
          accept: ["git switch --detach v1.0.0"],
          near: [{ command: "git tag -n", why: "That lists releases. Switch to one with git switch --detach TAG." }],
          hint: "git switch --detach and the tag.",
          success: "HEAD is now at 80b0f1a, the v1.0.0 commit. Run the tests here to see whether a bug existed then. git switch main brings you back.",
        }),
      },
      {
        id: "a-ce-rollback-strategy",
        title: "Rollback strategies",
        explain:
          "When a release breaks production, you have two broad options. Roll back: redeploy the previous good release (the tag) immediately, then fix forward at leisure. Roll forward: fix the bug and deploy a new release. Rolling back is usually fastest and safest when the previous release is known good and no data change prevents it; rolling forward is needed when a database change cannot be undone.",
        decision: {
          scenario: "v1.1.0 went live an hour ago. Customers are being shown wrong totals. v1.0.0 ran for a week with no complaints, and v1.1.0 changed no data formats.",
          question: "What is the best immediate action?",
          options: [
            { id: "a", text: "Redeploy v1.0.0 now to stop the harm, then fix the bug on a branch and release v1.1.1 after review", why: "A known-good release, no data migration in the way: roll back first, fix properly second." },
            { id: "b", text: "Fix it live on the server by editing files", whyWrong: "Untracked, unreviewed, and overwritten by the next deploy." },
            { id: "c", text: "Leave it running while you investigate for a few days", whyWrong: "Customers keep being harmed while you investigate." },
            { id: "d", text: "Force-push main back to v1.0.0", whyWrong: "Rewrites shared history; deploying the tag achieves the rollback without that." },
          ],
          correct: "a",
          aftermath: "Tags make rollback a deployment, not an emergency.",
        },
      },
      {
        id: "a-ce-ignore-check",
        title: ".gitignore: keeping things out",
        explain:
          ".gitignore lists patterns Git must not track: dependencies (node_modules/), build output (dist/), local data, logs and secrets (.env). Write it before the first commit: once a file is committed, ignoring it later does not remove it from history. git check-ignore -v PATH tells you whether a path is ignored and which line is responsible.",
        terminalExercise: term("m5-ignore", {
          goal: "Prove that .env, which holds this machine's secrets, can never be committed by accident.",
          accept: ["git check-ignore -v .env"],
          near: [{ command: "cat .gitignore", why: "That shows the rules. check-ignore proves which rule matches .env." }],
          hint: "git check-ignore -v and the file.",
          success: ".gitignore line 4, .env. And git ls-files .env .env.example lists only .env.example: the placeholder is committed, the real secrets are not.",
        }),
      },
      {
        id: "a-ce-ignored-list",
        title: "Everything Git is ignoring",
        explain:
          "git status --short --ignored adds the ignored files to the status, marked !!. It is worth running once on an inherited project: an ignored file you did not expect may be a secret, or something important that is not being backed up.",
        terminalExercise: term("m5-ignore", {
          goal: "List every file and folder Git is currently ignoring.",
          accept: ["git status --short --ignored"],
          near: [{ command: "git check-ignore -v data/kobo.json", why: "That checks one path. Ask for all ignored items with git status --short --ignored." }],
          hint: "git status --short with --ignored.",
          success: "!! .env, !! data/ and !! node_modules/. All three expected. Note data/: the data is not in Git, so if this were production, it would need its own backups.",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 31 · 5.P
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ce-l31-ai-broke",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 7,
    covers: ["5.P"],
    title: "Practical: An AI Change Broke Sign-In",
    subtitle: "Twelve files changed, authentication broken: isolate the fault without losing the rest",
    estimatedMinutes: 36,
    intro:
      "An AI assistant was asked to \"greet customers by first name and add a spinner to sign-in\". It reports success. Now nobody can sign in. Most of its work is fine; somewhere in twelve files, something is not. Find it, fix only that, and keep everything else.",

    atoms: [
      {
        id: "a-ce-p5-scope",
        title: "Step 1: the scope of the change",
        explain:
          "Start with the size and shape of the change, not with the code. Which files, how much in each? Compare with the request: a greeting and a spinner should touch the user object, the navbar, the login page and some CSS. Anything else needs a reason.",
        terminalExercise: term("m5-ai-broke", {
          goal: "See which files the AI changed and how much.",
          accept: ["git diff --stat"],
          near: [{ command: "git status --short", why: "That lists the 12 files. --stat also shows how much changed in each." }],
          hint: "git diff --stat.",
          success: "12 files, 31 lines added, 8 removed. Expected: authService, requireAuth, Navbar, Login, styles.css. Unexpected for this request: eslint.config.js, package.json, api/client.js. Note them.",
        }),
      },
      {
        id: "a-ce-p5-evidence",
        title: "Step 2: evidence of what broke",
        explain:
          "Before reading code, get evidence. The tests were green at the baseline (Module 1). Run them: a failing test names the behaviour that broke and the file and line where it was checked.",
        terminalExercise: term("m5-ai-broke", {
          goal: "Find out, with evidence, which behaviour is broken.",
          accept: ["npm test"],
          near: [{ command: "git diff --stat", why: "That shows what changed, not what broke. Run the tests." }],
          hint: "npm test.",
          success: "7 pass, 1 fails: \"the right password verifies\" (tests/authService.test.js:9), false !== true. A correct password is being rejected. The fault is in password verification.",
        }),
      },
      {
        id: "a-ce-p5-culprit",
        title: "Step 3: the exact line",
        explain:
          "The failing test points at verifyPassword in authService.js, one of the twelve files. Read only that file's diff, hunk by hunk.",
        terminalExercise: term("m5-ai-broke", {
          goal: "Read exactly what the AI changed in the auth service.",
          accept: ["git diff server/services/authService.js"],
          near: [{ command: "git diff eslint.config.js package.json", why: "Those are suspicious too, but the test points at authService.js. Read its diff first." }],
          hint: "git diff and the file's path.",
          success: "Two hunks. The second adds firstName: fine, that was the request. The first drops \"hex\" from Buffer.from(hashPassword(...)): the 64-character hex string is now read as text, 64 bytes instead of 32, so the length check always fails. One word, deleted.",
        }),
      },
      {
        id: "a-ce-p5-sneaky",
        title: "Step 4: changes nobody asked for",
        explain:
          "A broken test is the loud problem. The quiet ones are changes that weaken the project without breaking anything today. Check every file outside the request's scope.",
        terminalExercise: term("m5-ai-broke", {
          goal: "Read what the AI changed in the two files that have nothing to do with a greeting or a spinner.",
          accept: ["git diff eslint.config.js package.json"],
          near: [{ command: "git diff server/services/authService.js", why: "You have found the auth fault. Now check the out-of-scope files: eslint.config.js and package.json." }],
          hint: "git diff with both file names.",
          success: "It switched off the no-unused-vars lint rule entirely, and added a format script for prettier, which is not installed. Neither breaks a test; both should be reverted.",
        }),
      },
      {
        id: "a-ce-p5-keep",
        title: "Step 5: fix the fault, keep the work",
        explain:
          "Do not throw away all twelve files. git restore FILE would revert authService.js entirely, losing the firstName change you want. Instead put back the one deleted word by hand (or use git restore -p, which offers each hunk in turn), and restore the two out-of-scope files completely.",
        decision: {
          scenario: "You know: one bad hunk in authService.js; two unwanted files (eslint.config.js, package.json); nine files of wanted work.",
          question: "Which plan restores sign-in without losing unrelated work?",
          options: [
            { id: "a", text: "Put \"hex\" back in verifyPassword (or git restore -p and revert only that hunk), git restore eslint.config.js package.json, then run the tests and lint", why: "Surgical: the fault and the unwanted changes are undone, the greeting and spinner stay, and the checks prove it." },
            { id: "b", text: "git restore . and ask the AI to start again", whyWrong: "Loses the nine files of good work along with the bad." },
            { id: "c", text: "git restore server/services/authService.js", whyWrong: "Fixes sign-in but also removes firstName, which the navbar now needs: the greeting would break." },
            { id: "d", text: "Change the test's expected value to false", whyWrong: "That makes the test lie, and nobody could sign in." },
          ],
          correct: "a",
          aftermath: "Undo the fault, not the work around it.",
        },
      },
      {
        id: "a-ce-p5-fix",
        title: "Step 6: prove it",
        explain:
          "A fix is not finished until the evidence says so: the same tests that failed now pass, lint passes with its rule restored, and the diff contains only the intended changes.",
        terminalExercise: term("m5-ai-fixed", {
          intro: "The bad hunk has been undone, and eslint.config.js and package.json restored.",
          goal: "Prove that sign-in works again.",
          accept: ["npm test"],
          near: [{ command: "git diff --stat", why: "That shows 10 files still changed (the wanted work). Run the tests for proof that sign-in works." }],
          hint: "npm test.",
          success: "8 of 8 pass. Lint passes with the rule back in force, and git diff --stat shows 10 files: the greeting and spinner, kept. authService.js now contains only the firstName hunk.",
        }),
      },
    ],

    task: {
      title: "Module practical: an AI change broke authentication",
      intro:
        "On a branch of your own project (or a copy), have an AI assistant make a multi-file change, or deliberately introduce one small fault among several good edits. Then recover it as in this lesson, without losing unrelated work.",
      prompts: [
        "Record the baseline (tests, lint) before the change.",
        "Scope: git diff --stat, and a list of which files fit the request and which do not.",
        "Evidence: the failing test or error output, verbatim.",
        "The exact faulty lines, from git diff of that file, and why they are wrong.",
        "The fix: what you restored (file or hunk) and what you kept, with the commands.",
        "Proof: tests and lint passing, and the final git diff --stat.",
        "Commit the good work with a meaningful message on a branch, and write the pull request description you would submit.",
      ],
      closing: "Next module: AI coding assistants and agents as partners, so you can direct them well and catch their mistakes before they reach a diff like this.",
    },
    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
