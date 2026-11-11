/**
 * ASSESSMENTS · CONTENT WRITING · MODULE 13 · BUSINESS AND CORPORATE WRITING
 *
 * SERVER ONLY. One check per lesson, four or five questions each.
 */
import { q, check } from "./cw-helpers.js";

export const ASSESSMENTS = {
  ...check("cw-l47-business", [
    q({
      id: "cw-q47-01", atom: "a-cw-business-writing", d: 1,
      prompt: "What three questions does a business reader want answered quickly?",
      options: ["What is this about, what do you need from me, and by when?", "Who wrote it, where, and why now?", "How long is it, what font, what colour?", "Is it formal, is it long, is it signed?"],
      correct: "a",
      explanation: "Purpose, request and deadline come first in business writing.",
      wrong: { b: "Secondary.", c: "Irrelevant.", d: "Secondary." },
    }),
    q({
      id: "cw-q47-02", atom: "a-cw-corporate-comms", d: 2,
      prompt: "Why must corporate statements be checked and approved before release?",
      options: ["They can have legal and financial consequences and must be consistent", "To make them longer", "Because writers cannot spell", "Approval is optional decoration"],
      correct: "a",
      explanation: "Accuracy and consistency protect the organisation.",
      wrong: { b: "Not the aim.", c: "Not the reason.", d: "It matters." },
    }),
    q({
      id: "cw-q47-03", atom: "a-cw-formal-letters", d: 2,
      prompt: "A letter begins \"Dear Sir or Madam\". How should it close?",
      options: ["Yours faithfully", "Yours sincerely", "Cheers", "Love"],
      correct: "a",
      explanation: "Unknown name → Yours faithfully; known name → Yours sincerely.",
      wrong: { b: "Used when the name is known.", c: "Too casual.", d: "Inappropriate." },
    }),
    q({
      id: "cw-q47-04", atom: "a-cw-formal-letters", d: 2,
      prompt: "In block format, where does each part of the letter start?",
      options: ["At the left margin", "Centred", "At the right margin", "Indented by five spaces"],
      correct: "a",
      explanation: "Everything is left-aligned, with blank lines between parts.",
      wrong: { b: "Not block format.", c: "Not block format.", d: "That is an older indented style." },
    }),
    q({
      id: "cw-q47-05", atom: "a-cw-business-email", d: 2,
      prompt: "Why keep one main topic per business email?",
      options: ["So it can be actioned and filed clearly", "Because emails have a word limit", "To send more emails", "Topics are illegal"],
      correct: "a",
      explanation: "Mixed topics get half-answered and lost.",
      wrong: { b: "No such limit.", c: "Not the aim.", d: "Untrue." },
    }),
  ]),

  ...check("cw-l48-memos", [
    q({
      id: "cw-q48-01", atom: "a-cw-memos", d: 2,
      prompt: "What replaces the greeting and sign-off in a memo?",
      options: ["The To, From, Date and Subject heading block", "A logo", "A signature image", "Nothing; memos have no structure"],
      correct: "a",
      explanation: "The heading block identifies sender, readers and topic.",
      wrong: { b: "Decoration.", c: "Not standard.", d: "Memos are structured." },
    }),
    q({
      id: "cw-q48-02", atom: "a-cw-proposals", d: 2,
      prompt: "What should a proposal show before presenting its solution?",
      options: ["That it understands the client's problem in their terms", "The writer's CV", "A long company history", "The price"],
      correct: "a",
      explanation: "Clients trust solutions from those who understand their problem.",
      wrong: { b: "Not first.", c: "Not first.", d: "Price comes after value." },
    }),
    q({
      id: "cw-q48-03", atom: "a-cw-exec-summaries", d: 3,
      prompt: "Which statement about executive summaries is true?",
      options: ["It should let a reader decide without reading the rest", "It introduces topics without conclusions", "It is written first, before the document", "It should be at least half the document"],
      correct: "a",
      explanation: "It is the whole document in miniature, written last.",
      wrong: { b: "That is a teaser.", c: "Written last.", d: "About 5–10%." },
    }),
    q({
      id: "cw-q48-04", atom: "a-cw-business-reports", d: 2,
      prompt: "In a business report, what follows the findings?",
      options: ["Conclusions, then recommendations", "The title page", "The introduction", "The table of contents"],
      correct: "a",
      explanation: "Findings → what they mean → what to do.",
      wrong: { b: "Comes first.", c: "Comes before findings.", d: "Comes at the front." },
    }),
  ]),

  ...check("cw-l49-records", [
    q({
      id: "cw-q49-01", atom: "a-cw-agendas-minutes", d: 2,
      prompt: "What should minutes mainly record?",
      options: ["Decisions and action points with owners and deadlines", "Every word spoken", "The minute-taker's opinions", "Only the attendance"],
      correct: "a",
      explanation: "Minutes are the record of what was decided and who will act.",
      wrong: { b: "Not a transcript.", c: "Must be neutral.", d: "Incomplete." },
    }),
    q({
      id: "cw-q49-02", atom: "a-cw-project-docs", d: 2,
      prompt: "What does a RACI chart show?",
      options: ["Who is Responsible, Accountable, Consulted and Informed for each task", "The project budget", "The risks", "The meeting dates"],
      correct: "a",
      explanation: "It clarifies roles for every task.",
      wrong: { b: "That is the budget.", c: "That is the risk register.", d: "That is the schedule." },
    }),
    q({
      id: "cw-q49-03", atom: "a-cw-policies", d: 3,
      prompt: "In a policy, what is the difference between \"must\" and \"may\"?",
      options: ["Must is a requirement; may is a permission", "They mean the same", "May is stronger", "Must is only used in procedures"],
      correct: "a",
      explanation: "Precise modal verbs make policies enforceable.",
      wrong: { b: "They differ.", c: "The reverse.", d: "Used in policies too." },
    }),
    q({
      id: "cw-q49-04", atom: "a-cw-company-profiles", d: 2,
      prompt: "Which line is strongest in a company profile?",
      options: ["\"We delivered 96% of orders on time in 2025.\"", "\"We offer world-class service.\"", "\"We are the best.\"", "\"We are very committed.\""],
      correct: "a",
      explanation: "Specific facts beat adjectives.",
      wrong: { b: "Empty claim.", c: "Unprovable.", d: "Vague." },
    }),
  ]),

  ...check("cw-l50-proposal", [
    q({
      id: "cw-q50-01", atom: "a-cw-official-correspondence", d: 2,
      prompt: "Why do official letters carry a reference number?",
      options: ["So they can be tracked and filed", "To make them look longer", "It is decoration", "To hide the sender"],
      correct: "a",
      explanation: "References link correspondence to records.",
      wrong: { b: "Not the purpose.", c: "Functional.", d: "Untrue." },
    }),
    q({
      id: "cw-q50-02", atom: "a-cw-formatting", d: 2,
      prompt: "Why use built-in heading styles in Word or Google Docs?",
      options: ["Consistent formatting, an automatic table of contents, and screen-reader navigation", "They make text red", "They are required to print", "They add page numbers"],
      correct: "a",
      explanation: "Styles carry structure, not just appearance.",
      wrong: { b: "Colour is a style setting, not the point.", c: "Not required.", d: "Page numbers are separate." },
    }),
    q({
      id: "cw-q50-03", atom: "a-cw-formatting", d: 2,
      prompt: "How should an abbreviation such as GPS appear the first time?",
      options: ["Spelled out with the abbreviation in brackets", "Only as GPS", "In capitals and bold", "In a footnote"],
      correct: "a",
      explanation: "\"global positioning system (GPS)\", then GPS afterwards.",
      wrong: { b: "Some readers may not know it.", c: "Not the convention.", d: "Not the convention." },
    }),
    q({
      id: "cw-q50-04", atom: "a-cw-professionalism", d: 3,
      prompt: "Which habit best protects accuracy in an important document?",
      options: ["Checking every name, date and figure against the source, and asking a colleague to review", "Adding a disclaimer", "Writing faster", "Using more adjectives"],
      correct: "a",
      explanation: "Verification and a second reader catch costly errors.",
      wrong: { b: "Does not fix errors.", c: "Increases errors.", d: "Unrelated." },
    }),
    q({
      id: "cw-q50-05", atom: "a-cw-m13-practical", d: 3,
      prompt: "Where in a proposal should the client's decision deadline appear?",
      options: ["In the next steps and the covering email", "Nowhere", "Only in the appendix", "Only in the pricing table"],
      correct: "a",
      explanation: "Make the next step and its deadline obvious.",
      wrong: { b: "The client needs to know.", c: "Too hidden.", d: "Not the right place alone." },
    }),
  ]),
};

export default ASSESSMENTS;
