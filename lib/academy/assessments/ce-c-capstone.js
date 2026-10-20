/**
 * ASSESSMENTS · CODEBASE ENGINEERING · CAPSTONE
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Never import this from anything under src/.
 * ═════════════════════════════════════════════════════════════════════════
 */

import { q, check } from "./ce-helpers.js";

export const ASSESSMENTS = {
  ...check("ce-l66-inherit", [
    q({ id: "ceqc1-1", atom: "a-ce-c-brief", d: 2, prompt: "A brief asks you to fix a bug and report on the code's health. What comes first?", options: ["Baseline, reproduce the bug and locate the logic, before changing anything", "Ask an agent to fix it", "Rewrite the feature", "Write the report from the README"], correct: "a",
      explanation: "Understand, then change.",
      wrong: { b: "A change on a guess.", c: "The rewrite trap.", d: "Claims, not evidence." } }),
    q({ id: "ceqc1-2", atom: "a-ce-c-baseline", d: 2, prompt: "Why take the baseline before the fix?", options: ["So anything that changes afterwards can be compared with a known state", "It is required by Git", "It fixes the bug", "To impress the owner"], correct: "a",
      explanation: "The reference point for every later check.",
      wrong: { b: "No.", c: "No.", d: "Its value is practical." } }),
    q({ id: "ceqc1-3", atom: "a-ce-c-locate", d: 3, prompt: "The complaint names a total shown and a total charged. Where do you look?", options: ["Both layers: the page that shows it and the server that charges it", "Only the CSS", "Only the database", "Only the tests"], correct: "a",
      explanation: "Two totals, two places.",
      wrong: { b: "No.", c: "Totals are computed in code.", d: "They pass." } }),
    q({ id: "ceqc1-4", atom: "a-ce-c-history", d: 3, prompt: "Why read the commit that introduced the difference?", options: ["To keep its intent: here the server's free-delivery rule is the correct one", "To blame someone", "To revert it", "To copy its message"], correct: "a",
      explanation: "Fix in the direction the business intended.",
      wrong: { b: "Context, not blame.", c: "The rule is wanted.", d: "No." } }),
    q({ id: "ceqc1-5", atom: "a-ce-c-plan", d: 3, prompt: "Which belongs OUT of the fix's change?", options: ["Removing unrelated dead code and upgrading React", "The shared rule", "The boundary test", "Running lint"], correct: "a",
      explanation: "Keep the fix reviewable and revertible.",
      wrong: { b: "The fix itself.", c: "The proof.", d: "Part of the proof." } }),
  ]),

  ...check("ce-l67-fix-review", [
    q({ id: "ceqc2-1", atom: "a-ce-c-agent-task", d: 2, prompt: "What makes the agent's task checkable?", options: ["Named files, limits, a definition of done, and a list of files touched", "A friendly tone", "Brevity", "No limits"], correct: "a",
      explanation: "A task you can check is one you can delegate.",
      wrong: { b: "Irrelevant.", c: "Clarity matters more.", d: "Unbounded." } }),
    q({ id: "ceqc2-2", atom: "a-ce-c-scope", d: 3, prompt: "Why start a review with git status rather than git diff?", options: ["git diff does not show new, untracked files", "git status is faster", "git diff is unreliable", "No reason"], correct: "a",
      explanation: "shared/ appeared only in git status.",
      wrong: { b: "Not the reason.", c: "It is reliable for tracked files.", d: "There is." } }),
    q({ id: "ceqc2-3", atom: "a-ce-c-tests", d: 2, prompt: "The agent reports that all checks pass. What do you do?", options: ["Run the tests, lint and build yourself", "Accept the report", "Ask it again", "Merge immediately"], correct: "a",
      explanation: "Evidence over claims.",
      wrong: { b: "A claim.", c: "Still a claim.", d: "Unreviewed." } }),
    q({ id: "ceqc2-4", atom: "a-ce-c-single-rule", d: 3, prompt: "How do you prove the root cause is gone, not just this symptom?", options: ["Search shows the rule defined in exactly one place, used by both layers", "The customer stops complaining", "The diff is small", "Lint passes"], correct: "a",
      explanation: "One definition cannot drift.",
      wrong: { b: "Absence of complaints is weak evidence.", c: "Size is not proof.", d: "Lint does not check this." } }),
    q({ id: "ceqc2-5", atom: "a-ce-c-merge", d: 3, prompt: "Why merge the fix with --no-ff?", options: ["The merge commit keeps the fix visible as one unit that can be reverted as a whole", "It is faster", "Git requires it", "It deletes the branch"], correct: "a",
      explanation: "Visible history.",
      wrong: { b: "No.", c: "Optional.", d: "No." } }),
  ]),

  ...check("ce-l68-handover", [
    q({ id: "ceqc3-1", atom: "a-ce-c-branch-clean", d: 2, prompt: "What is the difference between git branch -d and -D?", options: ["-d refuses to delete an unmerged branch; -D deletes it anyway", "No difference", "-D is safer", "-d deletes the remote"], correct: "a",
      explanation: "Use -d by habit.",
      wrong: { b: "There is.", c: "The opposite.", d: "Local only." } }),
    q({ id: "ceqc3-2", atom: "a-ce-c-pr", d: 3, prompt: "Which belongs in the fix's pull request description?", options: ["The issue, root cause, fix, evidence, and what AI did and what you verified", "Only \"fixed\"", "Your opinion of the previous developer", "The whole diff again"], correct: "a",
      explanation: "The permanent explanation of the change.",
      wrong: { b: "Explains nothing.", c: "No.", d: "Already shown." } }),
    q({ id: "ceqc3-3", atom: "a-ce-c-report", d: 3, prompt: "How should remaining risks be ordered in the report?", options: ["By risk to users and money, highest first", "Alphabetically", "By file name", "By how easy they are"], correct: "a",
      explanation: "The first item may be the only one read.",
      wrong: { b: "Ignores risk.", c: "Ignores risk.", d: "Ease is for planning, not severity." } }),
    q({ id: "ceqc3-4", atom: "a-ce-c-next", d: 2, prompt: "A good next-steps item is:", options: ["One change, with its reason and how you will know it is done", "\"Improve the code\"", "\"Rewrite everything\"", "Empty"], correct: "a",
      explanation: "Actionable and checkable.",
      wrong: { b: "Not actionable.", c: "The rewrite trap.", d: "Unhelpful." } }),
  ]),
};
