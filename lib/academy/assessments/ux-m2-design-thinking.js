/**
 * ASSESSMENTS · UI/UX DESIGN · MODULE 2 · DESIGN THINKING AND HUMAN-CENTRED DESIGN
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Never import this from anything under src/.
 * ═════════════════════════════════════════════════════════════════════════
 */

import { q, check } from "./ux-helpers.js";

export const ASSESSMENTS = {
  ...check("ux-l6-design-thinking", [
    q({
      id: "uxq6-1", atom: "a-ux-design-thinking", d: 2,
      prompt: "What does design thinking start from?",
      options: ["The needs of the people involved", "The newest available technology", "The team's favourite solution", "The competitor's product"],
      correct: "a",
      explanation: "It starts from people, then frames the problem, then explores solutions.",
      wrong: { b: "Technology-first is what design thinking avoids.", c: "Jumping to a solution skips understanding the problem.", d: "Competitors can inform, but people come first." },
    }),
    q({
      id: "uxq6-2", atom: "a-ux-hcd-principles", d: 2,
      prompt: "Which is a principle of human-centred design?",
      options: ["Involve the people who will use it throughout, in their real context", "Show users the design only after it is built", "Design for the average user only", "Let the most senior person decide what users want"],
      correct: "a",
      explanation: "HCD involves real users in their context, all the way through.",
      wrong: { b: "Too late to change anything cheaply.", c: "HCD designs for the full range of people.", d: "Seniority is not evidence about users." },
    }),
    q({
      id: "uxq6-3", atom: "a-ux-five-stages", d: 2,
      prompt: "Which stage of design thinking produces a problem statement?",
      options: ["Define", "Empathize", "Prototype", "Test"],
      correct: "a",
      explanation: "Define turns what you learned into a clear problem to solve.",
      wrong: { b: "Empathize gathers the understanding the statement is built from.", c: "Prototype makes testable versions of solutions.", d: "Test checks solutions with users." },
    }),
    q({
      id: "uxq6-4", atom: "a-ux-stages-lab", d: 3, type: "scenario",
      prompt: "A team counts how many people completed a deposit with their clickable prototype without help. Which stage is that?",
      options: ["Test", "Prototype", "Ideate", "Empathize"],
      correct: "a",
      explanation: "Watching people use a prototype and measuring the result is testing.",
      wrong: { b: "Making the clickable version was prototyping; measuring its use is testing.", c: "Ideate generates and chooses ideas.", d: "Empathize learns about people before solutions exist." },
    }),
  ]),

  ...check("ux-l7-problems", [
    q({
      id: "uxq7-1", atom: "a-ux-problem-first", d: 2,
      prompt: "A client asks you to \"add a chatbot\". What should you do first?",
      options: ["Ask why: what problem should the chatbot solve, and for whom?", "Choose a chatbot provider", "Design the chat window", "Refuse, because chatbots are bad"],
      correct: "a",
      explanation: "Requests arrive as solutions; find the problem behind them.",
      wrong: { b: "That assumes the solution is right.", c: "Designing before understanding is guessing.", d: "Chatbots can be right; you need to find out." },
    }),
    q({
      id: "uxq7-2", atom: "a-ux-frustrations", d: 2,
      prompt: "A trader writes her mobile money PIN on the back of her phone. What is this, to a designer?",
      options: ["A workaround that reveals a strong unmet need", "Simply a careless user", "Irrelevant to design", "Proof the app is perfect"],
      correct: "a",
      explanation: "Workarounds show needs so strong that people solve them themselves.",
      wrong: { b: "Blaming users hides design problems.", c: "It is exactly the kind of clue designers look for.", d: "It suggests remembering the PIN is a problem." },
    }),
    q({
      id: "uxq7-3", atom: "a-ux-define-problem", d: 3,
      prompt: "When counting how often a frustration appears in interviews, what do you count?",
      options: ["The number of different people who mentioned it", "The number of times the word appears", "The length of the quotes", "Only the first interview"],
      correct: "a",
      explanation: "One person repeating a complaint is still one person.",
      wrong: { b: "Repetition by one person inflates the count.", c: "Length does not measure frequency.", d: "One interview is an anecdote, not a pattern." },
    }),
    q({
      id: "uxq7-4", atom: "a-ux-define-problem", d: 2,
      prompt: "What is affinity mapping?",
      options: ["Grouping similar observations together to find patterns", "Drawing a map of where users live", "Ranking users by how much they like the product", "A type of colour palette"],
      correct: "a",
      explanation: "Notes are clustered into themes, which become candidate problems.",
      wrong: { b: "It is about grouping observations, not geography.", c: "It does not rank users.", d: "Unrelated to colour." },
    }),
  ]),

  ...check("ux-l8-ideas", [
    q({
      id: "uxq8-1", atom: "a-ux-brainstorming", d: 2,
      prompt: "Which rule helps a brainstorm most?",
      options: ["Defer judgement until the idea generation is over", "Criticise weak ideas immediately", "Allow only realistic ideas", "Stop after the first good idea"],
      correct: "a",
      explanation: "Judging early stops people suggesting ideas.",
      wrong: { b: "Early criticism kills ideas before they develop.", c: "Wild ideas often lead to practical ones.", d: "The first good idea is rarely the best." },
    }),
    q({
      id: "uxq8-2", atom: "a-ux-divergent-convergent", d: 2,
      prompt: "What is convergent thinking?",
      options: ["Evaluating options against criteria and choosing", "Generating as many ideas as possible", "Ignoring user research", "Copying competitors"],
      correct: "a",
      explanation: "Convergent narrows down; divergent opens up.",
      wrong: { b: "That is divergent thinking.", c: "Neither mode ignores research.", d: "Not a thinking mode." },
    }),
    q({
      id: "uxq8-3", atom: "a-ux-problem-statements", d: 3,
      prompt: "Which is the best problem statement?",
      options: ["Working parents in Ibadan need to see a doctor without losing a day of work, because the hospital gives no appointment times", "Patients need a hospital booking app", "We need a chatbot", "Users want a better experience"],
      correct: "a",
      explanation: "A specific user, a real need, and an insight from research, with no solution named.",
      wrong: { b: "It names a solution, not a need.", c: "A solution with no user or need.", d: "Too vague to act on." },
    }),
    q({
      id: "uxq8-4", atom: "a-ux-problem-statements", d: 2,
      prompt: "What is a \"How Might We\" question for?",
      options: ["Turning a problem into an open question that invites many solutions", "Asking users to design the product", "Writing the final specification", "Measuring task completion"],
      correct: "a",
      explanation: "\"How might we …?\" is wide enough for many ideas and narrow enough to act on.",
      wrong: { b: "It is a tool for the team's ideation.", c: "It comes well before specifications.", d: "It is not a metric." },
    }),
  ]),

  ...check("ux-l9-validate-iterate", [
    q({
      id: "uxq9-1", atom: "a-ux-validate-assumptions", d: 3,
      prompt: "Why decide the pass mark for an assumption before running the test?",
      options: ["So the result cannot be reinterpreted afterwards to fit what you hoped", "Because testing tools require it", "To make the test take longer", "Because pass marks are always 100%"],
      correct: "a",
      explanation: "A pass mark set afterwards tends to bend to fit the result.",
      wrong: { b: "It is about honesty, not tools.", c: "It does not change the length.", d: "Pass marks are chosen per test." },
    }),
    q({
      id: "uxq9-2", atom: "a-ux-validate-assumptions", d: 2,
      prompt: "Which assumption should you test first?",
      options: ["The riskiest: the one that would hurt most if wrong and has least evidence", "The easiest to prove right", "The one the team likes most", "The last one on the list"],
      correct: "a",
      explanation: "Testing the riskiest first prevents building on a false foundation.",
      wrong: { b: "Easy wins do not reduce risk.", c: "Preference is not risk.", d: "Order should follow risk." },
    }),
    q({
      id: "uxq9-3", atom: "a-ux-iterative-design", d: 2,
      prompt: "What is iterative design?",
      options: ["Improving a design through repeated cycles of design, test and refine", "Designing everything once, perfectly", "Copying the previous version", "Designing without users"],
      correct: "a",
      explanation: "Small, fast loops find problems while they are cheap to fix.",
      wrong: { b: "That is what iteration replaces.", c: "Iteration changes things based on evidence.", d: "Each loop includes testing with users." },
    }),
    q({
      id: "uxq9-4", atom: "a-ux-proposal-lab", d: 2,
      prompt: "Which is real evidence for a design proposal?",
      options: ["\"Four of the six people I asked abandoned their application at least once\"", "\"I think most people find it confusing\"", "\"It is obviously badly designed\"", "\"My manager dislikes it\""],
      correct: "a",
      explanation: "Evidence comes from people's behaviour or words, with how many said it.",
      wrong: { b: "An opinion, not evidence.", c: "A judgement with nothing behind it.", d: "One person's preference." },
    }),
  ]),
};
