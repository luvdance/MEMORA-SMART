/**
 * ASSESSMENTS · CONTENT WRITING · MODULE 17 · EDITING AND PROOFREADING
 *
 * SERVER ONLY. One check per lesson, four or five questions each.
 */
import { q, check } from "./cw-helpers.js";

export const ASSESSMENTS = {
  ...check("cw-l63-editing-levels", [
    q({
      id: "cw-q63-01", atom: "a-cw-edit-vs-proof", d: 2,
      prompt: "What is the main difference between editing and proofreading?",
      options: ["Editing improves content, structure and language; proofreading catches surface errors at the end", "They are the same", "Proofreading changes the structure", "Editing only fixes commas"],
      correct: "a",
      explanation: "Editing can change a lot; proofreading as little as possible.",
      wrong: { b: "They differ.", c: "That is structural editing.", d: "Editing is broader." },
    }),
    q({
      id: "cw-q63-02", atom: "a-cw-edit-vs-proof", d: 2,
      prompt: "In what order do the editing levels usually happen?",
      options: ["Developmental, structural, line, copy, proofreading", "Proofreading first, then the rest", "Copy, line, structural, developmental", "Any order"],
      correct: "a",
      explanation: "Biggest changes first, smallest last.",
      wrong: { b: "Wasted if text is later cut.", c: "Backwards.", d: "Order saves effort." },
    }),
    q({
      id: "cw-q63-03", atom: "a-cw-developmental", d: 2,
      prompt: "Which question belongs to developmental editing?",
      options: ["Is anything important missing for this reader and purpose?", "Is this comma correct?", "Is \"organisation\" spelled consistently?", "Is there a typo in the footer?"],
      correct: "a",
      explanation: "Developmental editing looks at the whole piece's content.",
      wrong: { b: "Copy editing.", c: "Copy editing.", d: "Proofreading." },
    }),
    q({
      id: "cw-q63-04", atom: "a-cw-structural", d: 2,
      prompt: "What is a reverse outline?",
      options: ["One line per paragraph summarising what it does, used to check structure", "An outline written backwards", "A list of typos", "The table of contents"],
      correct: "a",
      explanation: "It shows paragraphs that are out of place, doubled or repeated.",
      wrong: { b: "Not the meaning.", c: "Not the meaning.", d: "Not the same." },
    }),
    q({
      id: "cw-q63-05", atom: "a-cw-copy-editing", d: 3,
      prompt: "A copy editor finds 58% on page 1 and 56% on page 3 for the same figure. What should they do?",
      options: ["Query the writer to confirm the correct figure", "Pick one at random", "Leave both", "Delete both"],
      correct: "a",
      explanation: "Flag doubtful facts; do not silently change them.",
      wrong: { b: "Risks publishing the wrong figure.", c: "Inconsistent.", d: "Loses evidence." },
    }),
  ]),

  ...check("cw-l64-checks", [
    q({
      id: "cw-q64-01", atom: "a-cw-grammar-checks", d: 2,
      prompt: "Which sentence is correct?",
      options: ["The loan amounts range from ₦100,000 to ₦2 million.", "The loan amount range from ₦100,000 to ₦2 million.", "The product is design for traders.", "Six month's history is required."],
      correct: "a",
      explanation: "Plural subject, plural verb.",
      wrong: { b: "Agreement error.", c: "Needs \"designed\".", d: "Plural, not possessive: months." },
    }),
    q({
      id: "cw-q64-02", atom: "a-cw-spelling", d: 2,
      prompt: "Which error will a spellchecker usually miss?",
      options: ["\"apply on there phone\"", "\"recieve\"", "\"busness\"", "\"beleive\""],
      correct: "a",
      explanation: "\"there\" is a real word, used wrongly.",
      wrong: { b: "Not a word; flagged.", c: "Not a word; flagged.", d: "Not a word; flagged." },
    }),
    q({
      id: "cw-q64-03", atom: "a-cw-flow", d: 2,
      prompt: "What is the best simple test of sentence flow?",
      options: ["Read it aloud", "Count the commas", "Check the font", "Run a spellchecker"],
      correct: "a",
      explanation: "Where you stumble, readers will too.",
      wrong: { b: "Not a flow test.", c: "Irrelevant.", d: "Checks spelling only." },
    }),
    q({
      id: "cw-q64-04", atom: "a-cw-redundancy", d: 2,
      prompt: "Which phrase is redundant?",
      options: ["current business environment of today", "small business owner", "monthly budget", "written plan"],
      correct: "a",
      explanation: "\"current\" and \"of today\" say the same thing.",
      wrong: { b: "Not redundant.", c: "Not redundant.", d: "Not redundant." },
    }),
    q({
      id: "cw-q64-05", atom: "a-cw-coherence", d: 3,
      prompt: "Why use one term consistently for one product in a professional document?",
      options: ["Readers may think different terms mean different products", "Variety is always bad", "Style guides ban synonyms", "To make the text longer"],
      correct: "a",
      explanation: "Consistency supports coherence and accuracy.",
      wrong: { b: "Variety helps elsewhere, not for key terms.", c: "Not a universal ban.", d: "Not the aim." },
    }),
  ]),

  ...check("cw-l65-standards", [
    q({
      id: "cw-q65-01", atom: "a-cw-tone-consistency", d: 2,
      prompt: "What is a project style sheet?",
      options: ["A short list of style decisions for that project, so every piece follows them", "A spreadsheet of prices", "A design template", "A list of writers"],
      correct: "a",
      explanation: "E.g. \"Harvest Hub, two words\"; \"12%\"; \"5 March 2026\".",
      wrong: { b: "Unrelated.", c: "Design, not style decisions.", d: "Unrelated." },
    }),
    q({
      id: "cw-q65-02", atom: "a-cw-verifying-claims", d: 3,
      prompt: "An article states a competitor \"cheats its customers\". What should the editor do?",
      options: ["Flag it as a defamation risk and require evidence or removal", "Approve it", "Make it stronger", "Move it to the headline"],
      correct: "a",
      explanation: "Claims that harm reputation need evidence and legal care.",
      wrong: { b: "Legal risk.", c: "Greater risk.", d: "Greater risk." },
    }),
    q({
      id: "cw-q65-03", atom: "a-cw-editing-audiences", d: 2,
      prompt: "Editing a report for senior decision-makers, what should you move to the top?",
      options: ["Conclusions and recommendations", "The method", "The appendices", "The acknowledgements"],
      correct: "a",
      explanation: "Decision-makers need the answer first.",
      wrong: { b: "Supporting detail.", c: "Supporting detail.", d: "Least important." },
    }),
    q({
      id: "cw-q65-04", atom: "a-cw-style-guides", d: 2,
      prompt: "A client's house style says \"per cent\"; you prefer \"%\". What do you use?",
      options: ["\"per cent\": the client's style guide overrides personal preference", "\"%\"", "Both", "Neither"],
      correct: "a",
      explanation: "The house style wins.",
      wrong: { b: "Ignores the client's rules.", c: "Inconsistent.", d: "The value still needs a unit." },
    }),
    q({
      id: "cw-q65-05", atom: "a-cw-sign-off", d: 2,
      prompt: "Why proofread the final published form (web preview, PDF, test email)?",
      options: ["Layout can introduce new errors such as broken links and bad line breaks", "The text changes by itself", "It is faster", "Clients prefer PDFs"],
      correct: "a",
      explanation: "Check the version readers will actually see.",
      wrong: { b: "It does not, but layout does.", c: "Not the reason.", d: "Not the reason." },
    }),
  ]),

  ...check("cw-l66-edit-practical", [
    q({
      id: "cw-q66-01", atom: "a-cw-editor-notes", d: 2,
      prompt: "How should editor's notes describe changes?",
      options: ["By type and benefit to the reader, respectfully", "As a list of every comma changed", "By criticising the writer", "They are unnecessary"],
      correct: "a",
      explanation: "Notes build the client's trust in your edit.",
      wrong: { b: "Too detailed; tracked changes do that.", c: "Unprofessional.", d: "Clients value them." },
    }),
    q({
      id: "cw-q66-02", atom: "a-cw-m17-practical", d: 3,
      prompt: "A draft's strongest evidence is in paragraph two after a warm-up opening. What should the edited version do?",
      options: ["Lead with the evidence and remove the warm-up", "Keep the order", "Delete the evidence", "Put the evidence in a footnote"],
      correct: "a",
      explanation: "Structural editing puts the strongest material first.",
      wrong: { b: "Loses readers.", c: "Loses the point.", d: "Hides it." },
    }),
    q({
      id: "cw-q66-03", atom: "a-cw-m17-practical", d: 2,
      prompt: "A paragraph lists four steps as \"Then you should… Then you should… Then compare…\". What is the best edit?",
      options: ["Turn them into a numbered list of steps starting with verbs", "Add more \"then\"s", "Remove the steps", "Merge them into one long sentence"],
      correct: "a",
      explanation: "Numbered steps are easier to scan and follow.",
      wrong: { b: "Worse flow.", c: "Loses useful content.", d: "Harder to follow." },
    }),
    q({
      id: "cw-q66-04", atom: "a-cw-m17-practical", d: 2,
      prompt: "\"Tradewise Consulting offer a free template\". What is the error?",
      options: ["Agreement: the company is singular, so \"offers\"", "Spelling of \"template\"", "Capitalisation of \"Consulting\"", "No error"],
      correct: "a",
      explanation: "A company name takes a singular verb in standard business English.",
      wrong: { b: "Spelled correctly.", c: "Part of the name.", d: "There is an error." },
    }),
  ]),
};

export default ASSESSMENTS;
