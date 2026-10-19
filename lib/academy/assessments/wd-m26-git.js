/**
 * ASSESSMENTS · RESPONSIVE WEB DEVELOPMENT · MODULE 26 · GIT AND GITHUB
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Never import this from anything under src/.
 * ═════════════════════════════════════════════════════════════════════════
 */

import { q, check } from "./wd-helpers.js";

export const ASSESSMENTS = {
  ...check("wd-l120-git-basics", [
    q({ id: "wdq120-1", atom: "a-wd-version-control", d: 2, prompt: "What is the difference between Git and GitHub?", options: ["Git tracks history on your machine; GitHub hosts repositories online for sharing and collaboration", "They are the same thing", "GitHub is a programming language", "Git only works online"], correct: "a",
      explanation: "Git is the tool; GitHub is one place to host what it tracks.",
      wrong: { b: "Different things.", c: "It is a hosting service.", d: "Git works entirely offline." } }),
    q({ id: "wdq120-2", atom: "a-wd-install-git", d: 2, prompt: "Why set user.name and user.email after installing Git?", options: ["They are recorded as the author of every commit", "Git will not install without them", "They are your GitHub password", "They speed Git up"], correct: "a",
      explanation: "Every commit says who made it.",
      wrong: { b: "Installation is separate.", c: "They are not passwords.", d: "No effect on speed." } }),
    q({ id: "wdq120-3", atom: "a-wd-repos-commits", d: 2, prompt: "What is a commit?", options: ["A snapshot of the project with an id, an author, a date and a message", "A file", "A branch", "A server"], correct: "a",
      explanation: "Commits are the units of history.",
      wrong: { b: "A commit records many files' changes.", c: "Branches point to commits.", d: "Unrelated." } }),
    q({ id: "wdq120-4", atom: "a-wd-repos-commits", d: 3, prompt: "Which area holds the changes chosen for the next commit?", options: ["The staging area", "The working directory", "The remote", "The .gitignore"], correct: "a",
      explanation: "git add moves changes into it.",
      wrong: { b: "That holds your files as edited.", c: "That is the online copy.", d: "That lists ignored files." } }),
  ]),

  ...check("wd-l121-commit-cycle", [
    q({ id: "wdq121-1", atom: "a-wd-init-add-commit", d: 2, prompt: "In what order do you record a change?", options: ["git add, then git commit", "git commit, then git add", "git push, then git add", "git init every time"], correct: "a",
      explanation: "Stage, then commit.",
      wrong: { b: "Nothing is staged to commit.", c: "Push sends commits that already exist.", d: "init is once per project." } }),
    q({ id: "wdq121-2", atom: "a-wd-init-add-commit", d: 2, prompt: "What does git status tell you?", options: ["Which files are untracked, modified or staged, and what to do next", "Your GitHub password", "The project's size", "Who else is online"], correct: "a",
      explanation: "Run it whenever unsure.",
      wrong: { b: "Unrelated.", c: "Unrelated.", d: "Unrelated." } }),
    q({ id: "wdq121-3", atom: "a-wd-changes-history", d: 2, prompt: "In git diff output, what does a line starting with + mean?", options: ["A line that was added", "A line that was removed", "A comment", "An error"], correct: "a",
      explanation: "- marks removed lines.",
      wrong: { b: "That is -.", c: "Not a comment.", d: "Not an error." } }),
    q({ id: "wdq121-4", atom: "a-wd-changes-history", d: 2, prompt: "Which command lists commits newest first, one per line?", options: ["git log --oneline", "git status", "git diff", "git add ."], correct: "a",
      explanation: "A compact history.",
      wrong: { b: "Shows the current state.", c: "Shows uncommitted line changes.", d: "Stages changes." } }),
  ]),

  ...check("wd-l122-branches-github", [
    q({ id: "wdq122-1", atom: "a-wd-branches", d: 2, prompt: "Why build a new feature on its own branch?", options: ["main stays working while the feature is unfinished", "Branches run faster", "GitHub requires it", "To delete history"], correct: "a",
      explanation: "Merge only when ready.",
      wrong: { b: "Speed is not the point.", c: "Not required, but standard practice.", d: "Branches keep history." } }),
    q({ id: "wdq122-2", atom: "a-wd-branches", d: 3, prompt: "git merge reports \"Fast-forward\". What happened?", options: ["main had no new commits, so Git just moved main forward to the branch's commits", "The merge failed", "Commits were deleted", "A conflict occurred"], correct: "a",
      explanation: "No merge commit was needed.",
      wrong: { b: "It succeeded.", c: "Nothing was deleted.", d: "Conflicts are reported as CONFLICT." } }),
    q({ id: "wdq122-3", atom: "a-wd-github", d: 3, type: "scenario", prompt: "A secret key was committed and pushed to a public repository, then deleted in the next commit. Is it safe?", options: ["No: it is still in the history; revoke it and issue a new one", "Yes, it was deleted", "Yes, if the repository is renamed", "Yes, GitHub hides old commits"], correct: "a",
      explanation: "History keeps everything that was ever committed.",
      wrong: { b: "Older commits still contain it.", c: "Renaming changes nothing.", d: "Old commits are visible." } }),
    q({ id: "wdq122-4", atom: "a-wd-push-pull", d: 2, prompt: "What does git pull do?", options: ["Downloads commits from the remote and merges them into your branch", "Uploads your commits", "Deletes the remote", "Creates a branch"], correct: "a",
      explanation: "Pull before you start, push when you finish.",
      wrong: { b: "That is push.", c: "No.", d: "No." } }),
  ]),

  ...check("wd-l123-conflicts-docs", [
    q({ id: "wdq123-1", atom: "a-wd-merge-conflicts", d: 3, prompt: "After editing a conflicted file to the version you want, what finishes the merge?", options: ["Remove the conflict markers, then git add the file and git commit", "git push", "git merge again", "Delete the branch"], correct: "a",
      explanation: "Stage the resolved file and commit.",
      wrong: { b: "Push sends commits; the merge is not committed yet.", c: "The conflict stays until resolved.", d: "Unrelated." } }),
    q({ id: "wdq123-2", atom: "a-wd-commit-messages", d: 2, prompt: "Which commit message follows good practice?", options: ["Fix menu not closing on Escape", "fixed stuff", "changes", "asdfgh"], correct: "a",
      explanation: "Short, imperative, specific.",
      wrong: { b: "Vague.", c: "Says nothing.", d: "Meaningless." } }),
    q({ id: "wdq123-3", atom: "a-wd-readme", d: 2, prompt: "What should a portfolio project's README include?", options: ["What it is, a live link or screenshot, how to run it and what it is built with", "Only the licence", "Your passwords", "Nothing; code speaks for itself"], correct: "a",
      explanation: "It is how an employer understands the project quickly.",
      wrong: { b: "Too little.", c: "Never.", d: "Readers need context." } }),
    q({ id: "wdq123-4", atom: "a-wd-gitignore", d: 3, prompt: "You add .env to .gitignore after it was already committed. What happens?", options: ["It stays in the history; .gitignore only stops untracked files being added", "It is removed from history", "Git deletes the file", "GitHub hides it"], correct: "a",
      explanation: "Create .gitignore first; remove committed secrets and revoke them.",
      wrong: { b: "History is unchanged.", c: "The local file remains.", d: "It does not." } }),
  ]),
};
