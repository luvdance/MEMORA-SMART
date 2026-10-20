/**
 * ASSESSMENTS · CODEBASE ENGINEERING · MODULE 6 · AI ASSISTANTS AND AGENTS
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Never import this from anything under src/.
 * ═════════════════════════════════════════════════════════════════════════
 */

import { q, check } from "./ce-helpers.js";

export const ASSESSMENTS = {
  ...check("ce-l32-assistants-agents", [
    q({ id: "ceq32-1", atom: "a-ce-assist-vs-agent", d: 2, prompt: "What does an AI coding agent do that an assistant does not?", options: ["Works in a loop on a goal: reads, edits several files, runs commands and tests, and iterates", "Completes the current line", "Answers one question", "Formats code"], correct: "a",
      explanation: "Agents act; assistants suggest.",
      wrong: { b: "Autocomplete.", c: "Chat assistant.", d: "A formatter." } }),
    q({ id: "ceq32-2", atom: "a-ce-tool-landscape", d: 2, prompt: "Which tool is Anthropic's agentic coding tool, used mainly from the terminal and reading CLAUDE.md?", options: ["Claude Code", "Cursor", "GitHub Copilot", "OpenAI Codex"], correct: "a",
      explanation: "It explores, edits, runs commands and works with Git.",
      wrong: { b: "An AI code editor.", c: "GitHub's assistant and coding agent.", d: "OpenAI's agent, reading AGENTS.md." } }),
    q({ id: "ceq32-3", atom: "a-ce-tool-landscape", d: 3, prompt: "Your team wants issues turned into pull requests that go through normal review. Which capability fits?", options: ["A coding agent that takes an issue and opens a PR", "Inline completions", "Letting an agent push to main", "A linter"], correct: "a",
      explanation: "The work arrives as a reviewable PR.",
      wrong: { b: "Helps typing only.", c: "Skips review.", d: "Unrelated." } }),
    q({ id: "ceq32-4", atom: "a-ce-shared-concepts", d: 2, prompt: "Which skill transfers to any AI coding tool?", options: ["Giving focused context and reviewing diffs against tests", "Memorising one tool's shortcuts", "Trusting summaries", "Avoiding instruction files"], correct: "a",
      explanation: "The discipline outlives the product.",
      wrong: { b: "Tool-specific.", c: "Never a skill.", d: "Instruction files help every tool." } }),
  ]),

  ...check("ce-l33-map-first", [
    q({ id: "ceq33-1", atom: "a-ce-map-prompt", d: 2, prompt: "What should your first instruction to an agent on an unfamiliar repository be?", options: ["A read-only request for a map, with evidence for each claim", "The feature you need", "\"Fix everything\"", "Delete unused files"], correct: "a",
      explanation: "Understand before you change.",
      wrong: { b: "Changes before understanding.", c: "Unbounded.", d: "Destructive and premature." } }),
    q({ id: "ceq33-2", atom: "a-ce-verify-claims", d: 3, prompt: "The AI says passwords use bcrypt; the code uses scrypt. What does this show?", options: ["Plausible guesses are stated as facts; verify claims that matter", "bcrypt and scrypt are the same", "The code is wrong", "The AI is always wrong"], correct: "a",
      explanation: "Check, then record what is true.",
      wrong: { b: "Different algorithms.", c: "The code is what runs.", d: "Usually it is mostly right; that is the danger." } }),
    q({ id: "ceq33-3", atom: "a-ce-verify-absence", d: 3, prompt: "rg -il redis finds nothing. When is that good evidence that Redis is not used?", options: ["When the search itself was right: spelling, case and (on Git Bash) no leading-slash trap", "Always", "Never", "Only on Linux"], correct: "a",
      explanation: "An empty result is only as good as the search.",
      wrong: { b: "A wrong search also returns nothing.", c: "A sound search is good evidence.", d: "Applies everywhere." } }),
    q({ id: "ceq33-4", atom: "a-ce-focused-question", d: 3, prompt: "Which question gets the most checkable answer?", options: ["\"In authService.js, when does verifyToken return null? Quote each line that causes it.\"", "\"Explain the auth system.\"", "\"Is the code good?\"", "\"What would you change?\""], correct: "a",
      explanation: "File, function, behaviour, lines.",
      wrong: { b: "Broad answers are partly guessed.", c: "An opinion.", d: "Not about understanding." } }),
  ]),

  ...check("ce-l34-context", [
    q({ id: "ceq34-1", atom: "a-ce-give-context", d: 2, prompt: "What should you give an AI about a failing test?", options: ["The verbatim output: test name, assertion, file, line and stack", "\"It's broken\"", "A screenshot of your desktop", "Your .env"], correct: "a",
      explanation: "Exact evidence to reason from.",
      wrong: { b: "Nothing to work with.", c: "Imprecise.", d: "Never share secrets." } }),
    q({ id: "ceq34-2", atom: "a-ce-context-diff", d: 2, prompt: "What does git diff -U1 change?", options: ["Shows one line of context around each change instead of three", "Shows one file only", "Undoes one change", "Shows the first commit"], correct: "a",
      explanation: "Compact diffs fit into prompts.",
      wrong: { b: "Files are chosen by path.", c: "Diff only shows.", d: "No." } }),
    q({ id: "ceq34-3", atom: "a-ce-context-choice", d: 3, prompt: "A production log excerpt contains customers' emails. Before pasting it into an AI tool you should:", options: ["Remove the personal data, or not paste it", "Paste it; AI tools are private", "Paste it and delete the chat later", "Email it to yourself first"], correct: "a",
      explanation: "Personal data must not leave its systems casually.",
      wrong: { b: "Do not assume.", c: "It may already be stored.", d: "Irrelevant." } }),
    q({ id: "ceq34-4", atom: "a-ce-targeted-refs", d: 2, prompt: "Why reference the two relevant files rather than attach the whole project?", options: ["Less to wade through and less chance of latching onto the wrong code", "Whole projects are illegal to share", "Files cannot be referenced", "It is slower"], correct: "a",
      explanation: "Targeted context gives sharper answers.",
      wrong: { b: "Not the reason.", c: "Every tool supports references.", d: "Targeted is faster." } }),
  ]),

  ...check("ce-l35-trace-instructions", [
    q({ id: "ceq35-1", atom: "a-ce-ai-trace", d: 2, prompt: "Why ask an AI for file:line for every hop of a trace?", options: ["It forces it to read the code, and lets you check each hop", "It looks professional", "Line numbers never change", "It makes the answer shorter"], correct: "a",
      explanation: "Checkable claims.",
      wrong: { b: "The value is verification.", c: "They do change, but a current trace is checkable now.", d: "Not the reason." } }),
    q({ id: "ceq35-2", atom: "a-ce-ai-deps", d: 3, prompt: "The AI says the app uses axios everywhere, but only fetch is used. Where did the claim likely come from?", options: ["axios is in package.json; the AI assumed installed meant used", "The code changed", "fetch is part of axios", "Git is wrong"], correct: "a",
      explanation: "Installed is not used.",
      wrong: { b: "It never used axios.", c: "fetch is built in.", d: "Git is not involved." } }),
    q({ id: "ceq35-3", atom: "a-ce-agents-md", d: 2, prompt: "What is AGENTS.md?", options: ["A file at the repository root with instructions every AI agent reads before working", "A list of employees", "A test file", "A secrets file"], correct: "a",
      explanation: "CLAUDE.md is Claude Code's equivalent.",
      wrong: { b: "No.", c: "No.", d: "Never." } }),
    q({ id: "ceq35-4", atom: "a-ce-instruction-content", d: 3, prompt: "Which line belongs in an instruction file?", options: ["\"Run npm test before finishing; never weaken eslint.config.js.\"", "\"Be smart.\"", "The production password", "The entire README"], correct: "a",
      explanation: "Specific, checkable rules.",
      wrong: { b: "Vague.", c: "Never.", d: "Duplicated and stale." } }),
  ]),

  ...check("ce-l36-limits-review", [
    q({ id: "ceq36-1", atom: "a-ce-context-window", d: 2, prompt: "What is a context window?", options: ["The limited amount of text a model can consider at once", "The editor window", "A time limit", "A type of prompt"], correct: "a",
      explanation: "Measured in tokens.",
      wrong: { b: "No.", c: "No.", d: "No." } }),
    q({ id: "ceq36-2", atom: "a-ce-stale-context", d: 3, prompt: "An agent calls a function renamed this morning. What is this?", options: ["Stale context: it worked from an outdated view of the code", "A hallucination about the future", "A Git bug", "A permission error"], correct: "a",
      explanation: "Pull, let it re-read, run the tests.",
      wrong: { b: "The function existed before.", c: "No.", d: "No." } }),
    q({ id: "ceq36-3", atom: "a-ce-hallucination", d: 3, prompt: "Code reads totals.deliveryFee but orderTotals returns delivery. What happens?", options: ["It gets undefined, silently", "It throws an error", "It gets 0", "It reads delivery automatically"], correct: "a",
      explanation: "A missing property is undefined in JavaScript.",
      wrong: { b: "Reading a missing property does not throw.", c: "undefined, not 0.", d: "No." } }),
    q({ id: "ceq36-4", atom: "a-ce-diff-vs-claim", d: 3, prompt: "An agent says it changed 4 files; git diff --stat main...BRANCH shows 12. What now?", options: ["Read every file it did not mention before considering a merge", "Merge: summaries are approximate", "Ask it to recount", "Trust the summary"], correct: "a",
      explanation: "The diff is the evidence.",
      wrong: { b: "Unmentioned changes are the risk.", c: "Git already counted.", d: "It is demonstrably wrong." } }),
    q({ id: "ceq36-5", atom: "a-ce-incomplete", d: 3, prompt: "An explanation describes the happy path only. What do you ask next?", options: ["What happens on failure, and what else does it change?", "Nothing", "To make it shorter", "For more adjectives"], correct: "a",
      explanation: "Failures and side effects are where production breaks.",
      wrong: { b: "Incomplete.", c: "Wrong direction.", d: "No." } }),
  ]),

  ...check("ce-l37-delegation", [
    q({ id: "ceq37-1", atom: "a-ce-delegate-scope", d: 2, prompt: "What makes an agent task well scoped?", options: ["One goal, where to work, explicit limits, and a checkable definition of done", "As few words as possible", "\"Improve things\"", "No limits, so it can be creative"], correct: "a",
      explanation: "If you cannot say when it is done, neither can the agent.",
      wrong: { b: "Brevity without clarity.", c: "Vague.", d: "Produces unreviewable diffs." } }),
    q({ id: "ceq37-2", atom: "a-ce-agent-permissions", d: 3, prompt: "Which agent action should always require asking, or be denied?", options: ["Force-pushing or touching production data", "Reading files", "Running the tests", "Searching the code"], correct: "a",
      explanation: "Hard or impossible to undo.",
      wrong: { b: "Harmless.", c: "How it checks its work.", d: "Harmless." } }),
    q({ id: "ceq37-3", atom: "a-ce-agent-branch", d: 2, prompt: "Why should an agent work on its own branch?", options: ["Its work becomes one reviewable unit that can be merged, changed or discarded", "Branches make it faster", "main is read-only for everyone", "Agents cannot commit to main"], correct: "a",
      explanation: "Isolation makes review possible.",
      wrong: { b: "Not about speed.", c: "Not necessarily.", d: "They can, which is the problem." } }),
    q({ id: "ceq37-4", atom: "a-ce-agent-review-gate", d: 3, prompt: "At the review gate, what should you look at first?", options: ["Changes the summary did not mention: configuration, dependencies, CI, security-sensitive code", "The commit message only", "The number of commits", "Nothing; the tests ran"], correct: "a",
      explanation: "Unmentioned changes carry the most risk.",
      wrong: { b: "A claim.", c: "Not the risk.", d: "Tests do not check config weakening." } }),
  ]),

  ...check("ce-l38-ai-map", [
    q({ id: "ceq38-1", atom: "a-ce-p6-prompt", d: 2, prompt: "Why ask the AI to say \"unknown\" rather than guess?", options: ["It reduces invented claims and surfaces real gaps", "It makes answers shorter", "AIs never guess", "It is polite"], correct: "a",
      explanation: "Permission not to know.",
      wrong: { b: "A side effect.", c: "They do.", d: "Not the reason." } }),
    q({ id: "ceq38-2", atom: "a-ce-p6-structure", d: 2, prompt: "How do you move a map claim from \"claimed\" to \"verified\"?", options: ["Check it yourself with a command or file:line, and record the evidence", "Ask the AI if it is sure", "Wait a week", "Ask a second AI"], correct: "a",
      explanation: "Evidence, recorded.",
      wrong: { b: "It will say yes.", c: "Time verifies nothing.", d: "Two claims are still claims." } }),
    q({ id: "ceq38-3", atom: "a-ce-p6-verify", d: 3, prompt: "You find the map invented a database. What else must you do?", options: ["Re-check every claim built on it (backups, scaling, migrations)", "Nothing else", "Delete the map", "Rename the JSON file to postgres"], correct: "a",
      explanation: "Errors propagate.",
      wrong: { b: "Dependent claims are suspect.", c: "Most of it may be right.", d: "Absurd." } }),
    q({ id: "ceq38-4", atom: "a-ce-p6-activity", d: 2, prompt: "Which tells you who has worked on the code recently?", options: ["git log with --since and --format='%an'", "The README's author list", "package.json", "The AI's guess"], correct: "a",
      explanation: "History is the record.",
      wrong: { b: "Often out of date.", c: "Names the project, not people.", d: "It cannot know." } }),
    q({ id: "ceq38-5", atom: "a-ce-p6-questions", d: 2, prompt: "A good open question:", options: ["Is specific, says why it matters, and says how to get the answer", "Is one word", "Is an opinion", "Asks whether everything works"], correct: "a",
      explanation: "Actionable.",
      wrong: { b: "Not actionable.", c: "Not a question.", d: "Too broad." } }),
  ]),
};
