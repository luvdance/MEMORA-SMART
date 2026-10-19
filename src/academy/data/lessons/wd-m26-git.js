/**
 * RESPONSIVE WEB DEVELOPMENT · MODULE 26 · GIT, GITHUB AND DEVELOPMENT TOOLS
 *
 * Curriculum 26.1 – 26.12. Phase 5 begins: the professional workflow. Version
 * control, configuring Git, repositories and commits, the add–commit cycle,
 * history and diffs, branches and merging, GitHub, pushing and pulling,
 * conflicts, commit messages, READMEs and .gitignore.
 *
 * Every terminal transcript here was recorded from a real Git 2.54 session.
 * Two things were shortened and are labelled as such: long folder paths, and
 * the remote, which was a repository on the same machine (../remote.git); on
 * GitHub the "To" line shows your repository's address instead.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

export const SECTION_ID = "wd-s26-git";

const PROMPT = "ada@laptop:~/portfolio$";

const STATUS_UNTRACKED = `On branch main

No commits yet

Untracked files:
  (use "git add <file>..." to include in what will be committed)
	css/
	index.html

nothing added to commit but untracked files present (use "git add" to track)`;

const STATUS_STAGED = `On branch main

No commits yet

Changes to be committed:
  (use "git rm --cached <file>..." to unstage)
	new file:   css/style.css
	new file:   index.html`;

const STATUS_MODIFIED = `On branch main
Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git restore <file>..." to discard changes in working directory)
	modified:   index.html

no changes added to commit (use "git add" and/or "git commit -a")`;

const DIFF = `diff --git a/index.html b/index.html
index 385471f..4945c13 100644
--- a/index.html
+++ b/index.html
@@ -1,3 +1,4 @@
 <!DOCTYPE html>
 <title>Ada</title>
 <h1>Ada Obi</h1>
+<p>Front-end developer in Lagos.</p>`;

const LOG_TWO = "745bce0 Add introduction to homepage\nd2ac521 Add homepage and base styles";

const COMMIT_FIRST = `[main (root-commit) d2ac521] Add homepage and base styles
 2 files changed, 4 insertions(+)
 create mode 100644 css/style.css
 create mode 100644 index.html`;

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 120 · 26.1 – 26.3
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "wd-l120-git-basics",
    moduleId: "wd-m26-git",
    sectionId: SECTION_ID,
    order: 1,
    covers: ["26.1", "26.2", "26.3"],
    title: "Version Control, Installing Git, Repositories and Commits",
    subtitle: "Never losing work again, and the tool every developer uses",
    estimatedMinutes: 22,
    intro:
      "Phase 5 is about working the way professional teams work. It starts with the tool every one of them uses, every day: Git. After this module you will never again have a folder of files called final, final2 and final-REALLY-final.",

    atoms: [
      {
        id: "a-wd-version-control",
        title: "Version control concepts",
        explain:
          "Version control records snapshots of a project over time, so you can see what changed, when, why and by whom, go back to any earlier version, and work on several changes in parallel without them interfering. Git is a distributed version control system: every developer has the complete history on their own machine, and GitHub is a website that hosts a shared copy so a team (or your future self on another laptop) can sync with it.",
        decision: {
          scenario: "A freelancer keeps versions of a client site as folders: site-v1, site-v2-final, site-v2-final-fixed. A change made last week broke the contact form, and they cannot tell which change.",
          question: "What would version control give them?",
          options: [
            { id: "a", text: "A history of every change with its message, the exact lines changed, and the ability to return to any earlier version", why: "Git shows each commit's message and diff, so finding the change that broke the form, and undoing just that change, takes minutes." },
            { id: "b", text: "Automatic bug fixing", whyWrong: "Git records changes; it does not fix them. It makes finding the bad change easy." },
            { id: "c", text: "Faster websites", whyWrong: "Version control affects how you work, not how fast the site loads." },
            { id: "d", text: "Nothing that folders do not already give", whyWrong: "Folders record states, not what changed between them or why." },
          ],
          correct: "a",
          aftermath: "Every professional project, from a one-page site to the Linux kernel, is kept in version control.",
        },
      },
      {
        id: "a-wd-install-git",
        title: "Installing and configuring Git",
        explain:
          "Install Git from git-scm.com (on Windows, Git for Windows also gives you Git Bash, the terminal from Module 2; macOS offers to install it the first time you type git). Then tell Git who you are, once per computer: your name and email are written into every commit you make. Set the default branch name to main, which GitHub uses.",
        table: {
          caption: "One-time setup.",
          headers: ["Command", "Does"],
          rows: [
            ["git --version", "Confirms Git is installed"],
            ["git config --global user.name \"Ada Obi\"", "Your name on every commit"],
            ["git config --global user.email \"ada@example.com\"", "Your email on every commit (use the one on your GitHub account)"],
            ["git config --global init.defaultBranch main", "New repositories start on a branch called main"],
            ["git config --global --list", "Shows your settings"],
          ],
        },
        terminalExercise: {
          prompt: "ada@laptop:~$",
          intro: "Recorded from a real Git 2.54 session on a computer where Git has just been installed.",
          goal: "Git is installed. Tell it your name, Ada Obi, so that it appears on every commit you make.",
          commands: {
            "git --version": "git version 2.54.0.windows.1",
            "git config --global user.name \"Ada Obi\"": "",
            "git config --global user.email \"ada@example.com\"": "",
            "git config --global --list": "user.name=Ada Obi\nuser.email=ada@example.com\ninit.defaultbranch=main",
          },
          available: ["git --version", "git config --global --list"],
          accept: ["git config --global user.name \"Ada Obi\""],
          near: [
            { command: "git config --global user.email \"ada@example.com\"", why: "That sets your email. The goal was your name: user.name." },
            { command: "git config --global --list", why: "That shows your settings; it does not change them. Use git config --global user.name \"Ada Obi\"." },
          ],
          hint: "git config --global user.name followed by the name in quotes.",
          success: "Nothing printed means it worked. Run git config --global --list to see it saved.",
        },
      },
      {
        id: "a-wd-repos-commits",
        title: "Repositories and commits",
        explain:
          "A repository (repo) is a project folder whose history Git tracks, stored in a hidden .git folder inside it. A commit is one snapshot of the project, with a unique id (a hash such as d2ac521), the author, a date and a message saying what changed and why. Files move through three areas: the working directory (your files as they are now), the staging area (changes you have chosen for the next commit) and the repository (committed history).",
        table: {
          caption: "The three areas.",
          headers: ["Area", "Holds", "Moved on by"],
          rows: [
            ["Working directory", "Your files, as you edit them", "git add"],
            ["Staging area", "The changes chosen for the next commit", "git commit"],
            ["Repository", "Every commit ever made", "(permanent history)"],
          ],
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 121 · 26.4 – 26.5
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "wd-l121-commit-cycle",
    moduleId: "wd-m26-git",
    sectionId: SECTION_ID,
    order: 2,
    covers: ["26.4", "26.5"],
    title: "git init, add and commit; Viewing Changes and History",
    subtitle: "The cycle you will repeat hundreds of times a week",
    estimatedMinutes: 24,
    intro: "Four commands do most of the daily work: start tracking a project, choose changes, record them, and look at what happened. You will type them so often that they become reflex.",

    atoms: [
      {
        id: "a-wd-init-add-commit",
        title: "git init, git add and git commit",
        explain:
          "git init turns the current folder into a repository (once per project). git add FILE stages a file's current changes; git add . stages everything in the folder. git commit -m \"message\" records the staged changes as a commit. git status, at any moment, tells you which files are untracked, modified or staged, and suggests the next command.",
        terminalExercise: {
          prompt: PROMPT,
          intro: "Recorded from a real session. index.html and css/style.css have just been created and staged with git add. (git init's output is shown with the long folder path shortened.)",
          goal: "Both files are staged. Record them as the first commit, with the message Add homepage and base styles.",
          commands: {
            "git init": "Initialized empty Git repository in …/portfolio/.git/",
            "git status": STATUS_STAGED,
            "git add index.html css/style.css": "",
            "git commit -m \"Add homepage and base styles\"": COMMIT_FIRST,
            "git log --oneline": "d2ac521 Add homepage and base styles",
          },
          available: ["git status", "git commit -m \"Add homepage and base styles\""],
          accept: ["git commit -m \"Add homepage and base styles\""],
          near: [
            { command: "git status", why: "Status confirms the files are staged (\"Changes to be committed\"). The next step is to commit them." },
            { command: "git add index.html css/style.css", why: "They are already staged. Now record them with git commit -m and the message." },
          ],
          hint: "git commit -m followed by the message in double quotes.",
          success: "\"root-commit\" means it is the first commit in the repository; d2ac521 is its id. Two files, four lines, safely recorded.",
        },
      },
      {
        id: "a-wd-changes-history",
        title: "Viewing changes and history",
        explain:
          "git status lists which files changed. git diff shows exactly which lines changed and have not been staged yet: lines starting with + were added and - were removed. git diff --staged shows what is staged. git log --oneline lists commits newest first, one per line; git log shows full details; git show ID shows one commit's changes.",
        terminalExercise: {
          prompt: PROMPT,
          intro: "Recorded from a real session. After the first commit, a line was added to index.html. Nothing has been staged yet.",
          goal: "Before committing, see exactly which lines of index.html have changed since the last commit.",
          commands: {
            "git status": STATUS_MODIFIED,
            "git diff": DIFF,
            "git log --oneline": "d2ac521 Add homepage and base styles",
          },
          available: ["git status", "git diff", "git log --oneline"],
          accept: ["git diff"],
          near: [
            { command: "git status", why: "Status tells you index.html is modified, but not WHICH lines. git diff shows the lines." },
            { command: "git log --oneline", why: "The log lists past commits. Uncommitted changes are not in it yet." },
          ],
          hint: "The command that shows differences line by line.",
          success: "The + line is the one you added. Reading the diff before every commit is how you catch the debugging console.log you forgot to delete.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 122 · 26.6 – 26.8
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "wd-l122-branches-github",
    moduleId: "wd-m26-git",
    sectionId: SECTION_ID,
    order: 3,
    covers: ["26.6", "26.7", "26.8"],
    title: "Branches, Merging, GitHub, Pushing and Pulling",
    subtitle: "Working on a change in isolation, and sharing your work",
    estimatedMinutes: 26,
    intro: "Branches let you try something without risking the working version. GitHub lets you back up and share your repository, and pushing and pulling keep your copy and the shared copy in step.",

    atoms: [
      {
        id: "a-wd-branches",
        title: "Branches and merging",
        explain:
          "A branch is an independent line of work. main holds the working version; for each new feature or fix you create a branch (git switch -c contact-page), commit on it, and when it is ready you switch back to main and merge it in (git merge contact-page). If main has not changed meanwhile, Git simply moves main forward (a fast-forward). git branch lists branches, with * marking the current one.",
        terminalExercise: {
          prompt: PROMPT,
          intro: "Recorded from a real session, on the main branch with two commits.",
          goal: "Start a new contact page without touching main: create a branch called contact-page and switch to it.",
          commands: {
            "git switch -c contact-page": "Switched to a new branch 'contact-page'",
            "git branch": "* main",
            "git switch main": "Already on 'main'",
            "git merge contact-page": "Updating 745bce0..1046b33\nFast-forward\n contact.html | 3 +++\n 1 file changed, 3 insertions(+)\n create mode 100644 contact.html",
          },
          available: ["git branch", "git switch -c contact-page"],
          accept: ["git switch -c contact-page"],
          near: [
            { command: "git branch", why: "That lists branches; there is only main so far. Create one with git switch -c NAME." },
            { command: "git merge contact-page", why: "Merging comes after the work is done on the branch. First create the branch." },
          ],
          hint: "git switch with -c creates a branch and switches to it in one step.",
          success: "You are now on contact-page. Commits here do not touch main until you merge them.",
        },
      },
      {
        id: "a-wd-github",
        title: "GitHub repositories",
        explain:
          "GitHub (github.com) hosts Git repositories online. Create a free account, then a New repository (leave it empty if you already have a local one), and GitHub shows its address, such as https://github.com/ada-obi/portfolio.git. Public repositories are visible to everyone and form your portfolio; private ones are visible only to people you invite. GitHub adds collaboration around Git: issues, pull requests for reviewing changes, and Pages for free hosting.",
        decision: {
          scenario: "Your portfolio project is ready to share with employers, but its folder contains a .env file with an API secret key.",
          question: "Before pushing it to a public GitHub repository, what must you do?",
          options: [
            { id: "a", text: "Make sure .env is listed in .gitignore and was never committed, and keep the secret out of the code", why: "Anything pushed to a public repository can be read, and automated bots scan GitHub for keys within minutes. Ignored files are never committed." },
            { id: "b", text: "Make the repository public and delete .env later", whyWrong: "Deleting it later leaves it in the history, where it can still be read." },
            { id: "c", text: "Rename .env to secrets.txt", whyWrong: "It would still be committed and pushed." },
            { id: "d", text: "Nothing: GitHub hides secrets automatically", whyWrong: "GitHub can warn about some leaked keys, but by then it is already public." },
          ],
          correct: "a",
          aftermath: "If a secret is ever pushed, treat it as leaked: revoke it and create a new one.",
        },
      },
      {
        id: "a-wd-push-pull",
        title: "Pushing and pulling changes",
        explain:
          "Connect your local repository to GitHub once with git remote add origin ADDRESS (origin is the conventional name). git push -u origin main uploads your commits and remembers the link, so afterwards plain git push and git pull work. git pull downloads commits others (or you, on another computer) have pushed and merges them into your branch. Pull before you start work, push when you finish.",
        terminalExercise: {
          prompt: PROMPT,
          intro: "Recorded from a real session. The remote was a repository on the same machine (../remote.git); with GitHub, the To line shows your GitHub address instead.",
          goal: "The remote called origin has been added. Upload the main branch to it for the first time, and set it up so that later a plain git push works.",
          commands: {
            "git remote add origin ../remote.git": "",
            "git push -u origin main": "To ../remote.git\n * [new branch]      main -> main\nbranch 'main' set up to track 'origin/main'.",
            "git push": "fatal: The current branch main has no upstream branch.\nTo push the current branch and set the remote as upstream, use\n\n    git push --set-upstream origin main\n\nTo have this happen automatically for branches without a tracking\nupstream, see 'push.autoSetupRemote' in 'git help config'.",
            "git pull": "There is no tracking information for the current branch.\nPlease specify which branch you want to merge with.\nSee git-pull(1) for details.\n\n    git pull <remote> <branch>\n\nIf you wish to set tracking information for this branch you can do so with:\n\n    git branch --set-upstream-to=origin/<branch> main",
          },
          available: ["git push -u origin main", "git pull"],
          accept: ["git push -u origin main"],
          near: [
            { command: "git push", why: "The very first push must say where to: git push -u origin main. After that, git push alone works." },
            { command: "git pull", why: "Pull downloads changes. The goal was to upload yours." },
          ],
          hint: "push, -u to remember the link, then the remote's name and the branch.",
          success: "\"set up to track 'origin/main'\" is the -u at work: from now on git push and git pull need no arguments.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 123 · 26.9 – 26.12
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "wd-l123-conflicts-docs",
    moduleId: "wd-m26-git",
    sectionId: SECTION_ID,
    order: 4,
    covers: ["26.9", "26.10", "26.11", "26.12"],
    title: "Merge Conflicts, Commit Messages, READMEs and .gitignore",
    subtitle: "When changes collide, and how to keep a repository clean and understandable",
    estimatedMinutes: 26,
    intro: "Sooner or later two changes touch the same line, and Git asks you to decide. And a repository others can understand needs good messages, a README, and nothing in it that should not be there.",

    atoms: [
      {
        id: "a-wd-merge-conflicts",
        title: "Resolving basic merge conflicts",
        explain:
          "A conflict happens when two branches change the same lines differently: Git cannot know which you want, so it stops and marks both versions in the file between <<<<<<<, ======= and >>>>>>> lines. To resolve it: open the file, decide what the final text should be (one version, the other, or a combination), delete the three marker lines, save, then git add the file and git commit. git merge --abort cancels the merge instead.",
        example:
          "$ git merge new-tagline\nAuto-merging index.html\nCONFLICT (content): Merge conflict in index.html\nAutomatic merge failed; fix conflicts and then commit the result.\n\nindex.html now contains:\n\n<h1>Ada Obi</h1>\n<<<<<<< HEAD\n<p>Front-end developer in Lagos and Abuja.</p>\n=======\n<p>Web developer building accessible sites.</p>\n>>>>>>> new-tagline",
        decision: {
          scenario: "You see the conflict above. The client wants the new wording AND both cities.",
          question: "How do you resolve it?",
          options: [
            { id: "a", text: "Replace everything from <<<<<<< to >>>>>>> with one line, <p>Web developer building accessible sites in Lagos and Abuja.</p>, then git add index.html and git commit", why: "You write the final version you actually want, remove all three markers, then stage and commit to finish the merge." },
            { id: "b", text: "Delete only the ======= line and commit", whyWrong: "The <<<<<<< and >>>>>>> markers would be left in the page, and visitors would see them." },
            { id: "c", text: "Run git merge again until it works", whyWrong: "Git will not guess; the conflict stays until you resolve it." },
            { id: "d", text: "Delete the repository and start again", whyWrong: "A conflict is normal and takes a minute to resolve." },
          ],
          correct: "a",
          aftermath: "VS Code highlights conflicts and offers Accept Current, Accept Incoming or Accept Both buttons, but you still decide what is right.",
        },
      },
      {
        id: "a-wd-commit-messages",
        title: "Writing useful commit messages",
        explain:
          "A commit message is a note to everyone who reads the history later, including you in six months. Write a short summary line (about 50 characters) in the imperative mood, as if completing \"This commit will…\": \"Add contact form validation\", \"Fix menu not closing on Escape\". If more explanation is needed, leave a blank line and explain why. Commit one logical change at a time, so each message can describe it.",
        decision: {
          scenario: "You fixed a bug where the mobile menu stayed open after a link was tapped, and also changed the footer colour.",
          question: "What is the best way to commit this?",
          options: [
            { id: "a", text: "Two commits: \"Close mobile menu after a link is tapped\" and \"Darken footer for better contrast\"", why: "One logical change per commit, each with a clear imperative summary. Either can be undone or reviewed on its own." },
            { id: "b", text: "One commit: \"stuff\"", whyWrong: "Tells the reader nothing and mixes two changes." },
            { id: "c", text: "One commit: \"Fixed a bug and also changed some colours and tidied things up a bit\"", whyWrong: "Too long, vague, and still two changes in one." },
            { id: "d", text: "No commit until the end of the week", whyWrong: "Large, rare commits lose the detail that makes history useful." },
          ],
          correct: "a",
          aftermath: "Good history reads like a changelog of the project.",
        },
      },
      {
        id: "a-wd-readme",
        title: "README files and project documentation",
        explain:
          "README.md, at the root of a repository, is the first thing anyone sees on its GitHub page. It is written in Markdown (# for headings, - for lists, `backticks` for code). A good README answers: what is this, a screenshot or live link, how to run it locally, what technologies it uses, and any decisions or known limitations. For a portfolio project, it is how an employer understands your work in a minute.",
        example: "# Ada's Portfolio\n\nA responsive portfolio site built with HTML, CSS and JavaScript.\n\n**Live:** https://ada-obi.github.io/portfolio\n\n## Run it locally\n\n1. Clone the repository\n2. Open the folder in VS Code\n3. Start Live Server\n\n## Built with\n\n- Semantic HTML and accessible forms\n- CSS Grid, Flexbox and custom properties\n- Vanilla JavaScript modules",
      },
      {
        id: "a-wd-gitignore",
        title: "Using .gitignore",
        explain:
          ".gitignore lists files and folders Git should never track: dependencies you can reinstall (node_modules/), build output (dist/), secrets (.env) and system clutter (.DS_Store, Thumbs.db). Each line is a pattern. Create it at the very start of a project: once a file has been committed, adding it to .gitignore does not remove it from history.",
        terminalExercise: {
          prompt: PROMPT,
          intro: "Recorded from a real session. A .env file containing a secret and a new .gitignore listing node_modules/, .env and .DS_Store have just been created.",
          goal: "Confirm, with the short form of status, that Git will not pick up the .env file.",
          commands: {
            "git status --short": "?? .gitignore",
            "git status": "On branch main\nYour branch is up to date with 'origin/main'.\n\nUntracked files:\n  (use \"git add <file>...\" to include in what will be committed)\n\t.gitignore\n\nnothing added to commit but untracked files present (use \"git add\" to track)",
            "git add .gitignore": "",
            "git commit -m \"Ignore dependencies and local secrets\"": "[main e2c5054] Ignore dependencies and local secrets\n 1 file changed, 3 insertions(+)\n create mode 100644 .gitignore",
          },
          available: ["git status --short", "git status"],
          accept: ["git status --short"],
          near: [
            { command: "git status", why: "That works too, and shows the same thing at length. The goal asked for the short form: git status --short." },
          ],
          hint: "git status with the --short flag.",
          success: "Only .gitignore is listed (?? means untracked). .env is not, because .gitignore hides it. Now commit .gitignore.",
        },
      },
    ],

    task: {
      title: "Module project: your work under version control",
      intro: "Put your Phase 4 to-do application under Git and publish it on GitHub.",
      prompts: [
        "Install and configure Git, then git init the project and add a .gitignore before the first commit.",
        "Make at least five small commits with clear, imperative messages.",
        "Create a branch, add a feature on it (for example a \"clear all\" button), and merge it into main.",
        "Deliberately create a merge conflict on a second branch, and resolve it.",
        "Create a public GitHub repository, push to it, and write a README with a description, how to run it and a screenshot.",
      ],
      closing: "Next module: npm and Vite, the tools that build modern frontend projects.",
    },
    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
