/**
 * ASSESSMENTS · CODEBASE ENGINEERING · MODULE 8 · ARCHITECTURE AND REFACTORING
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Never import this from anything under src/.
 * ═════════════════════════════════════════════════════════════════════════
 */

import { q, check } from "./ce-helpers.js";

export const ASSESSMENTS = {
  ...check("ce-l46-layers", [
    q({ id: "ceq46-1", atom: "a-ce-layers", d: 2, prompt: "What does separation of concerns mean?", options: ["Each part of the code has one job, so a change stays in one place", "Every file is in its own folder", "Frontend and backend use different languages", "Code is split by author"], correct: "a",
      explanation: "Layers are one way to achieve it.",
      wrong: { b: "Folders do not guarantee it.", c: "Unrelated.", d: "No." } }),
    q({ id: "ceq46-2", atom: "a-ce-coupling", d: 3, prompt: "What makes hidden coupling worse than explicit coupling?", options: ["Nothing links the two parts, so a change to one silently breaks the other", "It is slower", "Linters forbid it", "It uses more memory"], correct: "a",
      explanation: "Explicit imports can be followed; hidden agreements cannot.",
      wrong: { b: "Not a performance issue.", c: "They cannot see it.", d: "No." } }),
    q({ id: "ceq46-3", atom: "a-ce-duplicated-logic", d: 3, prompt: "Why search for the shape of logic (reduce((sum) rather than its exact text?", options: ["Copies are written slightly differently, and drifted copies are exactly the ones you need to find", "Exact searches are slower", "Shapes are case-insensitive", "It finds tests only"], correct: "a",
      explanation: "OldCheckout's copy had already drifted.",
      wrong: { b: "No.", c: "No.", d: "No." } }),
    q({ id: "ceq46-4", atom: "a-ce-duplicate-format", d: 2, prompt: "A shared formatPrice exists, but one component formats inline. What is the risk?", options: ["A fix to price formatting must be made twice, and may be made once", "None", "The app will not build", "Prices load slower"], correct: "a",
      explanation: "Duplicates are places where fixes are missed.",
      wrong: { b: "It is debt.", c: "It builds.", d: "No." } }),
  ]),

  ...check("ce-l47-smells", [
    q({ id: "ceq47-1", atom: "a-ce-oversized", d: 2, prompt: "When is a long file a real problem?", options: ["When it does several unrelated jobs, so changes to one risk the others", "Always", "Never", "Only if it is CSS"], correct: "a",
      explanation: "Size is a signal, not a verdict.",
      wrong: { b: "Long simple data is fine.", c: "Mixed jobs are a problem.", d: "No." } }),
    q({ id: "ceq47-2", atom: "a-ce-nesting", d: 3, prompt: "What do guard clauses do?", options: ["Handle special cases first and return early, flattening nested ifs", "Protect files from deletion", "Encrypt code", "Add tests"], correct: "a",
      explanation: "Less to hold in your head.",
      wrong: { b: "No.", c: "No.", d: "No." } }),
    q({ id: "ceq47-3", atom: "a-ce-dead-code", d: 2, prompt: "Why remove dead code?", options: ["It misleads readers, gets maintained for nothing, and can hide bugs that return if revived", "It slows the CPU", "Git requires it", "It is never harmful"], correct: "a",
      explanation: "OldCheckout looks like a checkout and is not.",
      wrong: { b: "Unused code does not run.", c: "No.", d: "It is." } }),
    q({ id: "ceq47-4", atom: "a-ce-unused-deps", d: 3, prompt: "Why exclude package.json and the lockfile when searching for a dependency's use?", options: ["They always mention it, so they say nothing about whether code uses it", "They are too large", "They are generated", "rg cannot read JSON"], correct: "a",
      explanation: "Search the code, not the manifests.",
      wrong: { b: "Not the reason.", c: "package.json is source.", d: "It can." } }),
    q({ id: "ceq47-5", atom: "a-ce-safe-removal", d: 3, prompt: "After removing dead code, what proves it was safe?", options: ["The build and the tests pass, in a commit that can be reverted alone", "Nobody complains for a day", "The file is gone", "Lint is slower"], correct: "a",
      explanation: "Evidence, and an easy way back.",
      wrong: { b: "Silence is not evidence.", c: "That is the change, not proof.", d: "Irrelevant." } }),
  ]),

  ...check("ce-l48-debt-refactor", [
    q({ id: "ceq48-1", atom: "a-ce-debt-vs-complexity", d: 3, prompt: "Complex, stable, tested code that nobody needs to change is:", options: ["Harmless complexity, not urgent debt", "Urgent debt", "Dead code", "A security flaw"], correct: "a",
      explanation: "Debt is measured by its cost.",
      wrong: { b: "It costs nothing today.", c: "It is used.", d: "Not by itself." } }),
    q({ id: "ceq48-2", atom: "a-ce-debt-register", d: 3, prompt: "Which debt item should usually be fixed first?", options: ["High cost (bugs, slowed changes), low effort", "The largest rewrite", "The oldest item", "The one the AI suggests"], correct: "a",
      explanation: "Cost per effort.",
      wrong: { b: "Large effort, often low benefit.", c: "Age is not cost.", d: "Not a criterion." } }),
    q({ id: "ceq48-3", atom: "a-ce-refactor-def", d: 2, prompt: "What is refactoring?", options: ["Changing the structure of code without changing its behaviour", "Adding features", "Fixing bugs", "Rewriting in another language"], correct: "a",
      explanation: "Same inputs, same outputs.",
      wrong: { b: "Behaviour change.", c: "Behaviour change.", d: "A rewrite." } }),
    q({ id: "ceq48-4", atom: "a-ce-refactor-check", d: 3, prompt: "Tests pass after a refactor of a component no test covers. What else is needed?", options: ["Direct evidence for that component's behaviour, such as comparing outputs or a manual check", "Nothing", "Delete the component", "Disable the tests"], correct: "a",
      explanation: "Know your checks' limits.",
      wrong: { b: "The tests do not reach it.", c: "No.", d: "No." } }),
  ]),

  ...check("ce-l49-small-steps", [
    q({ id: "ceq49-1", atom: "a-ce-small-steps", d: 2, prompt: "What makes a refactoring step \"small and reversible\"?", options: ["The app works after it, it is its own commit, and it can be reverted alone", "It changes one character", "It is done on Friday", "It has no commit message"], correct: "a",
      explanation: "Each step is safe on its own.",
      wrong: { b: "Size is about scope, not characters.", c: "Irrelevant.", d: "Messages matter." } }),
    q({ id: "ceq49-2", atom: "a-ce-rewrite-trap", d: 3, prompt: "Why do big rewrites often fail?", options: ["The old code encodes forgotten fixes, rediscovered one bug at a time while both systems need work", "New code is always worse", "Rewrites are illegal", "Git cannot handle them"], correct: "a",
      explanation: "Replace piece by piece instead.",
      wrong: { b: "Not always.", c: "No.", d: "No." } }),
    q({ id: "ceq49-3", atom: "a-ce-outdated", d: 3, prompt: "In npm outdated, Latest is a new major version above Wanted. What does that suggest?", options: ["A possibly breaking upgrade outside your declared range", "A safe patch", "The package is deprecated", "Nothing"], correct: "a",
      explanation: "Major versions may break things.",
      wrong: { b: "Patches stay within Wanted.", c: "Not necessarily.", d: "It matters." } }),
    q({ id: "ceq49-4", atom: "a-ce-breaking-changes", d: 3, prompt: "How should two major upgrades be done?", options: ["Separately, each on its own branch, with its migration guide read and all checks run", "Together, on main", "Without reading anything", "Never"], correct: "a",
      explanation: "So a failure points to one upgrade.",
      wrong: { b: "Unreviewable and entangled.", c: "Risky.", d: "Security fixes stop eventually." } }),
  ]),

  ...check("ce-l50-diagrams-ai-arch", [
    q({ id: "ceq50-1", atom: "a-ce-diagrams", d: 2, prompt: "Which diagram shows the order of calls in one interaction?", options: ["A sequence diagram", "A data diagram", "A folder tree", "A pie chart"], correct: "a",
      explanation: "Time flows down the page.",
      wrong: { b: "Records and relationships.", c: "Locations of files.", d: "No." } }),
    q({ id: "ceq50-2", atom: "a-ce-data-diagram", d: 3, prompt: "Why does an order line store the price, not just the product id?", options: ["The order must keep the price actually paid, even if the product's price changes", "To save space", "Because ids are long", "It is faster to display"], correct: "a",
      explanation: "Orders are historical records.",
      wrong: { b: "It uses more.", c: "No.", d: "Not the reason." } }),
    q({ id: "ceq50-3", atom: "a-ce-ai-architecture", d: 3, prompt: "An AI proposes microservices for a three-person team's small app. Your first question?", options: ["What problem we actually have does this solve, and at what cost?", "Is it modern?", "Can the AI build it?", "Which cloud is cheapest?"], correct: "a",
      explanation: "Architecture answers present needs.",
      wrong: { b: "Fashion is not fitness.", c: "Building is the easy part.", d: "Premature." } }),
    q({ id: "ceq50-4", atom: "a-ce-ai-arch-questions", d: 3, prompt: "Why ask for the smallest first step of a proposed design?", options: ["It shows whether the change can be made, and undone, safely in increments", "It is the cheapest", "AIs like small steps", "To delay the work"], correct: "a",
      explanation: "A design you cannot step into and back out of is a gamble.",
      wrong: { b: "Not necessarily.", c: "Irrelevant.", d: "No." } }),
  ]),

  ...check("ce-l51-docs", [
    q({ id: "ceq51-1", atom: "a-ce-readme", d: 2, prompt: "How do you keep a README true?", options: ["Update it in the same pull request as the change, and test setup steps on a fresh clone", "Write it once", "Let users report errors", "Regenerate it with AI daily"], correct: "a",
      explanation: "Docs as code.",
      wrong: { b: "It goes stale.", c: "Too late.", d: "Unreviewed and untested." } }),
    q({ id: "ceq51-2", atom: "a-ce-setup-guide", d: 2, prompt: "A good setup step includes:", options: ["The exact command, the values needed, and what failure looks like", "\"Configure it\"", "A link to the source code", "Nothing; developers figure it out"], correct: "a",
      explanation: "Followable on a fresh machine.",
      wrong: { b: "Vague.", c: "Not a guide.", d: "That is the cost being avoided." } }),
    q({ id: "ceq51-3", atom: "a-ce-adr", d: 2, prompt: "What does an ADR record?", options: ["A significant decision's context, the decision, and its consequences", "Every commit", "Meeting notes", "The test results"], correct: "a",
      explanation: "Why it is built this way.",
      wrong: { b: "Git does that.", c: "Too broad.", d: "No." } }),
    q({ id: "ceq51-4", atom: "a-ce-adr-when", d: 3, prompt: "A decision in an ADR changes. What do you do?", options: ["Write a new ADR that supersedes it, leaving the old one as history", "Edit the old ADR", "Delete it", "Nothing"], correct: "a",
      explanation: "ADRs are a record, not a plan.",
      wrong: { b: "History is lost.", c: "History is lost.", d: "The record would be wrong." } }),
  ]),

  ...check("ce-l52-refactor-plan", [
    q({ id: "ceq52-1", atom: "a-ce-p8-inventory", d: 2, prompt: "Why include tests in a search for a hard-coded value before refactoring?", options: ["They show what will need updating and what already guards the behaviour", "Tests are always wrong", "To delete them", "They are the largest files"], correct: "a",
      explanation: "The test's 150000 guards the server's rule.",
      wrong: { b: "No.", c: "No.", d: "No." } }),
    q({ id: "ceq52-2", atom: "a-ce-p8-plan", d: 3, prompt: "Why never put a refactor and a behaviour change in the same commit?", options: ["If something breaks, you cannot tell which caused it, or revert one without the other", "Commits have size limits", "Git forbids it", "It is slower"], correct: "a",
      explanation: "Separate concerns, separate commits.",
      wrong: { b: "Not the reason.", c: "No.", d: "No." } }),
    q({ id: "ceq52-3", atom: "a-ce-p8-commits", d: 2, prompt: "What does git diff --stat HEAD~3 show?", options: ["The combined changes of the last three commits", "Three files", "Commits from three days ago", "Three branches"], correct: "a",
      explanation: "HEAD~3 is three commits back.",
      wrong: { b: "Any number of files.", c: "Commits, not days.", d: "No." } }),
    q({ id: "ceq52-4", atom: "a-ce-p8-manual", d: 3, prompt: "What makes a manual check useful evidence?", options: ["It is written down with specific inputs and expected results, so anyone can repeat it", "It was done quickly", "It was done by a senior developer", "It found nothing"], correct: "a",
      explanation: "Repeatable and specific.",
      wrong: { b: "Speed is not evidence.", c: "Authority is not evidence.", d: "Finding nothing proves little if unspecified." } }),
  ]),
};
