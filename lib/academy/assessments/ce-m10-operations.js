/**
 * ASSESSMENTS · CODEBASE ENGINEERING · MODULE 10 · ADVANCED OPERATIONS
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Never import this from anything under src/.
 * ═════════════════════════════════════════════════════════════════════════
 */

import { q, check } from "./ce-helpers.js";

export const ASSESSMENTS = {
  ...check("ce-l60-checklists-scripts", [
    q({ id: "ceq60-1", atom: "a-ce-checklist", d: 2, prompt: "In an inspection checklist, what should come first?", options: ["Cheap, read-only, informative checks such as Git state and the manifest", "Installing the latest versions", "Running a database migration", "Deleting the build folder"], correct: "a",
      explanation: "Read before you run; run before you change.",
      wrong: { b: "Changes the project first.", c: "Destructive.", d: "Destructive." } }),
    q({ id: "ceq60-2", atom: "a-ce-shell-script", d: 2, prompt: "When should a checklist become a script?", options: ["When it is made of commands and you run it repeatedly", "Never", "Only for production", "When it has one item"], correct: "a",
      explanation: "Repeatable work, automated.",
      wrong: { b: "Scripts save time and mistakes.", c: "Useful everywhere.", d: "Not worth it." } }),
    q({ id: "ceq60-3", atom: "a-ce-script-safety", d: 4, prompt: "Why use set -u in a shell script?", options: ["It stops the script when an unset variable is used, instead of treating it as empty", "It makes the script faster", "It hides errors", "It runs as administrator"], correct: "a",
      explanation: "An empty variable in rm -rf \"$DIR/\" is catastrophic.",
      wrong: { b: "No.", c: "The opposite.", d: "No." } }),
    q({ id: "ceq60-4", atom: "a-ce-script-safety", d: 3, prompt: "A maintenance script should by default be:", options: ["Read-only, with anything destructive behind an explicit flag or confirmation", "Destructive, to save time", "Silent about what it does", "Full of hard-coded secrets"], correct: "a",
      explanation: "Others run scripts without reading them.",
      wrong: { b: "No.", c: "Say what it does.", d: "Never." } }),
  ]),

  ...check("ce-l61-reports-worktrees", [
    q({ id: "ceq61-1", atom: "a-ce-report-file", d: 2, prompt: "Why save the inspection report to a file?", options: ["So it can be attached, committed or compared with earlier reports", "Files run faster", "The terminal cannot show it", "Git requires it"], correct: "a",
      explanation: "Reports over time show trends.",
      wrong: { b: "No.", c: "It can.", d: "No." } }),
    q({ id: "ceq61-2", atom: "a-ce-report-check", d: 3, prompt: "Why did the saved report count maintenance-report.md as an uncommitted file?", options: ["The shell created the file before the script ran, so the script saw it", "Git is wrong", "The script is broken", "It was committed"], correct: "a",
      explanation: "Reports see their own side effects.",
      wrong: { b: "Git is right.", c: "It reported accurately.", d: "It was not." } }),
    q({ id: "ceq61-3", atom: "a-ce-deps-inventory", d: 2, prompt: "What does a dependency inventory list?", options: ["Each direct dependency, the range wanted and the version locked", "Only the newest versions", "The source code", "The test names"], correct: "a",
      explanation: "The basis for upgrades and security reviews.",
      wrong: { b: "No.", c: "No.", d: "No." } }),
    q({ id: "ceq61-4", atom: "a-ce-worktree-add", d: 3, prompt: "What does a Git worktree give you that stash and switch do not?", options: ["Two branches checked out side by side, in separate folders, without disturbing either", "A new repository", "A remote", "Faster commits"], correct: "a",
      explanation: "Also how parallel agents avoid overwriting each other.",
      wrong: { b: "Same repository.", c: "No.", d: "No." } }),
    q({ id: "ceq61-5", atom: "a-ce-worktree-remove", d: 2, prompt: "How do you remove a worktree properly?", options: ["git worktree remove FOLDER", "Delete the folder and forget it", "git branch -D", "git reset --hard"], correct: "a",
      explanation: "It also refuses if there is uncommitted work.",
      wrong: { b: "Leaves Git's record behind (prune cleans it).", c: "That deletes a branch.", d: "Unrelated." } }),
  ]),

  ...check("ce-l62-parallel-gates", [
    q({ id: "ceq62-1", atom: "a-ce-decompose", d: 3, prompt: "Two tasks change the same rule in the same file. How should they be run?", options: ["One after the other", "In parallel by two agents", "Combined with five other tasks", "Not at all"], correct: "a",
      explanation: "Parallelise across files; serialise within a rule.",
      wrong: { b: "They will conflict.", c: "Unreviewable.", d: "They can be done." } }),
    q({ id: "ceq62-2", atom: "a-ce-parallel-conflict", d: 2, prompt: "Two agents' correct changes conflict on merge. Whose fault is it?", options: ["The decomposition: both were given the same lines", "The first agent", "The second agent", "Git"], correct: "a",
      explanation: "Fix the split, not the agents.",
      wrong: { b: "Its change was fine.", c: "Its change was fine.", d: "Git reported it correctly." } }),
    q({ id: "ceq62-3", atom: "a-ce-parallel-read", d: 3, prompt: "Both sides of a conflict are wanted features. The resolution should:", options: ["Combine both intentions, ideally moving the rule to one shared place", "Keep the first merged", "Keep the newest", "Drop both"], correct: "a",
      explanation: "Honour both, then prevent the next collision.",
      wrong: { b: "Loses a feature.", c: "Loses a feature.", d: "Loses both." } }),
    q({ id: "ceq62-4", atom: "a-ce-gate-fail", d: 3, prompt: "Which belongs in an automated review gate?", options: ["Lint, tests, a secret scan, and flags for config changes and oversized diffs", "The author's mood", "A coin toss", "Only the commit message length"], correct: "a",
      explanation: "Blocking checks and human-review flags.",
      wrong: { b: "No.", c: "No.", d: "Too little." } }),
    q({ id: "ceq62-5", atom: "a-ce-gate-pass", d: 2, prompt: "Why must good changes pass a gate cleanly?", options: ["Otherwise people learn to ignore or bypass it", "Gates are optional", "To finish faster", "It does not matter"], correct: "a",
      explanation: "A gate that cries wolf stops protecting.",
      wrong: { b: "Required gates are not.", c: "Not the reason.", d: "It does." } }),
  ]),

  ...check("ce-l63-rules-mcp", [
    q({ id: "ceq63-1", atom: "a-ce-repo-rules", d: 2, prompt: "Which repository rule stops anyone, human or agent, pushing straight to main?", options: ["Branch protection (or a ruleset) requiring pull requests", "A README note", "AGENTS.md", ".gitignore"], correct: "a",
      explanation: "Rules enforce; instructions guide.",
      wrong: { b: "Not enforced.", c: "Guides agents, does not enforce.", d: "Unrelated." } }),
    q({ id: "ceq63-2", atom: "a-ce-reusable-workflows", d: 3, prompt: "Why one reusable CI workflow for many repositories?", options: ["One fix or improvement reaches every project, and they cannot drift apart", "It runs faster", "It is required by GitHub", "It hides failures"], correct: "a",
      explanation: "One procedure, many callers.",
      wrong: { b: "Not necessarily.", c: "No.", d: "No." } }),
    q({ id: "ceq63-3", atom: "a-ce-mcp", d: 2, prompt: "What is MCP?", options: ["An open protocol connecting AI applications to external tools and data through servers", "A code editor", "A test runner", "A package manager"], correct: "a",
      explanation: "One server, many compatible clients.",
      wrong: { b: "No.", c: "No.", d: "No." } }),
    q({ id: "ceq63-4", atom: "a-ce-mcp-risk", d: 4, prompt: "Which MCP setup follows least privilege for investigating bugs?", options: ["A read-only server on a staging copy, with approvals per query", "Full SQL access to production", "The admin password in the prompt", "Write access, for convenience"], correct: "a",
      explanation: "Investigation needs reading, not writing.",
      wrong: { b: "Far too much access.", c: "Never.", d: "Unneeded risk." } }),
  ]),

  ...check("ce-l64-tools-workflow", [
    q({ id: "ceq64-1", atom: "a-ce-tool-value", d: 2, prompt: "How should you judge whether to adopt a tool?", options: ["The problem it removes on your work, against its setup, maintenance and failure costs", "Its popularity", "Whether competitors use it", "Its logo"], correct: "a",
      explanation: "Name the problem, count the cost.",
      wrong: { b: "Not fitness.", c: "Their problems differ.", d: "No." } }),
    q({ id: "ceq64-2", atom: "a-ce-tool-cost", d: 3, prompt: "A tool's PRs are mostly rejected and review queues tripled. What do you do?", options: ["Measure, narrow it to what works (or remove it), and tighten its instructions and gates", "Approve faster", "Add another agent to review it", "Ignore the queue"], correct: "a",
      explanation: "Keep only what pays.",
      wrong: { b: "Rubber-stamping.", c: "More complexity.", d: "The cost is real." } }),
    q({ id: "ceq64-3", atom: "a-ce-personal-workflow", d: 2, prompt: "In the workflow loop, what comes before Change?", options: ["Inspect, Understand and Plan", "Merge", "Record", "Nothing"], correct: "a",
      explanation: "Understand before you change.",
      wrong: { b: "After.", c: "After.", d: "Changing first is the mistake." } }),
    q({ id: "ceq64-4", atom: "a-ce-workflow-loop", d: 3, prompt: "A specific mistake reached production. How should the workflow respond?", options: ["Add a specific, enforced step that would have caught it, and write it down", "Tell people to be careful", "Add many general steps", "Nothing"], correct: "a",
      explanation: "Each step names the mistake it prevents.",
      wrong: { b: "Not a process.", c: "Friction without focus.", d: "It will repeat." } }),
  ]),

  ...check("ce-l65-workflow-practical", [
    q({ id: "ceq65-1", atom: "a-ce-p10-output", d: 2, prompt: "Which belongs in the maintenance report?", options: ["Stack, key files, Git status, test and build results, and open notes", "Your opinions of past developers", "The full source code", "Secrets, for completeness"], correct: "a",
      explanation: "Concise and factual.",
      wrong: { b: "No.", c: "Too much.", d: "Never." } }),
    q({ id: "ceq65-2", atom: "a-ce-p10-extend", d: 3, prompt: "A check cannot run on a project (wrong ecosystem). The script should:", options: ["Say it was skipped and why", "Report it as passed", "Crash", "Install software into the project"], correct: "a",
      explanation: "Skipped is honest; silently passed is not.",
      wrong: { b: "A false report.", c: "Useless.", d: "An inspection must not change the project." } }),
    q({ id: "ceq65-3", atom: "a-ce-p10-deps", d: 2, prompt: "Why record the size of the dependency tree over time?", options: ["A sudden jump flags a new package that brought many others", "To make the report longer", "npm requires it", "It never changes"], correct: "a",
      explanation: "Trends reveal surprises.",
      wrong: { b: "No.", c: "No.", d: "It does." } }),
    q({ id: "ceq65-4", atom: "a-ce-p10-ci", d: 3, prompt: "Where should the review gate run?", options: ["On every pull request, as a required check", "Once a year", "Only on your laptop", "Only after merging"], correct: "a",
      explanation: "Gates at the door.",
      wrong: { b: "Too rare.", c: "Forgotten.", d: "Too late." } }),
  ]),
};
