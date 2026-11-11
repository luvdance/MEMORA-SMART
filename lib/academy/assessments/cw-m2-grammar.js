/**
 * ASSESSMENTS · CONTENT WRITING · MODULE 2 · GRAMMAR AND SENTENCES
 *
 * SERVER ONLY. One check per lesson, four or five questions each.
 */
import { q, check } from "./cw-helpers.js";

export const ASSESSMENTS = {
  ...check("cw-l5-sentences", [
    q({
      id: "cw-q5-01", atom: "a-cw-parts-of-speech", d: 1,
      prompt: "In \"Please email the client today\", what part of speech is \"email\"?",
      options: ["Verb", "Noun", "Adjective", "Preposition"],
      correct: "a",
      explanation: "It is the action being requested. In \"Send the email\" the same word is a noun.",
      wrong: { b: "Here it is an action, not a thing.", c: "It does not describe a noun.", d: "It shows no relationship between words." },
    }),
    q({
      id: "cw-q5-02", atom: "a-cw-five-parts", d: 2,
      prompt: "Which sentence uses its nouns correctly?",
      options: [
        "We received useful feedback and some new equipment.",
        "We received useful feedbacks and some new equipments.",
        "We received many informations about the equipments.",
        "She gave us three advices.",
      ],
      correct: "a",
      explanation: "Feedback, equipment, information and advice are uncountable and have no plural form.",
      wrong: { b: "Feedbacks and equipments are not standard English.", c: "Informations and equipments are not standard English.", d: "Advice is uncountable: \"three pieces of advice\"." },
    }),
    q({
      id: "cw-q5-03", atom: "a-cw-sentence-structure", d: 2,
      prompt: "\"We opened in 2019, we now have four branches.\" What is the error?",
      options: ["A comma splice", "A fragment", "A subject-verb agreement error", "No error"],
      correct: "a",
      explanation: "Two complete sentences joined only by a comma. Use a full stop, a semicolon or \", and\".",
      wrong: { b: "Both halves are complete sentences, so neither is a fragment.", c: "The verbs agree with their subjects.", d: "A comma alone cannot join two complete sentences." },
    }),
    q({
      id: "cw-q5-04", atom: "a-cw-sentence-structure", d: 3,
      prompt: "\"Because demand grew, we hired more drivers.\" What structure is this?",
      options: ["Complex", "Simple", "Compound", "A fragment"],
      correct: "a",
      explanation: "A dependent clause (Because demand grew) plus an independent clause (we hired more drivers).",
      wrong: { b: "It has two clauses.", c: "Compound joins two independent clauses with and/but/so.", d: "The independent clause makes it a complete sentence." },
    }),
  ]),

  ...check("cw-l6-agreement", [
    q({
      id: "cw-q6-01", atom: "a-cw-agreement", d: 2,
      prompt: "Choose the correct sentence.",
      options: [
        "Each of the managers has approved the plan.",
        "Each of the managers have approved the plan.",
        "The box of files are on the desk.",
        "Neither of the drivers were late.",
      ],
      correct: "a",
      explanation: "Each is singular, so it takes has.",
      wrong: { b: "Each is singular: has.", c: "The subject is box: is.", d: "Neither is singular in formal writing: was." },
    }),
    q({
      id: "cw-q6-02", atom: "a-cw-tenses", d: 2,
      prompt: "Which sentence uses the correct tense?",
      options: [
        "I sent the invoice yesterday.",
        "I have sent the invoice yesterday.",
        "I am sending the invoice yesterday.",
        "I had send the invoice yesterday.",
      ],
      correct: "a",
      explanation: "A finished time (yesterday) takes the simple past, not the present perfect.",
      wrong: { b: "Present perfect cannot be used with a finished time like yesterday.", c: "Present continuous does not fit a past time.", d: "Past perfect needs the participle sent, and there is no second past event." },
    }),
    q({
      id: "cw-q6-03", atom: "a-cw-punctuation-capitals", d: 2,
      prompt: "Which is correct?",
      options: [
        "The company announced its results on Monday.",
        "The company announced it's results on monday.",
        "The Company announced its results on monday.",
        "The company announced it's results on Monday.",
      ],
      correct: "a",
      explanation: "Its (possessive) has no apostrophe; days of the week take capitals; a general noun like company does not.",
      wrong: { b: "It's means it is, and Monday needs a capital.", c: "Company is not a proper noun here, and Monday needs a capital.", d: "It's means it is." },
    }),
    q({
      id: "cw-q6-04", atom: "a-cw-commas-colons", d: 3,
      prompt: "Which sentence uses the colon correctly?",
      options: [
        "We need three documents: your CV, a cover letter and a reference.",
        "We need: your CV, a cover letter and a reference.",
        "Please send: the files.",
        "The meeting is at: 3pm.",
      ],
      correct: "a",
      explanation: "The words before a colon must form a complete sentence; the colon then introduces the list.",
      wrong: { b: "\"We need\" is not a complete thought; drop the colon.", c: "\"Please send\" is incomplete; drop the colon.", d: "No colon between a preposition and its object." },
    }),
    q({
      id: "cw-q6-05", atom: "a-cw-commas-colons", d: 3,
      prompt: "When do you use a semicolon?",
      options: [
        "To join two closely related complete sentences without a conjunction",
        "Before every list",
        "After a greeting such as \"Dear Sir\"",
        "Instead of every comma in long sentences",
      ],
      correct: "a",
      explanation: "\"Sales rose; costs fell.\" It also separates list items that contain commas.",
      wrong: { b: "Lists are usually introduced with a colon.", c: "Greetings take a comma (or a colon in American business letters).", d: "Semicolons and commas have different jobs." },
    }),
  ]),

  ...check("cw-l7-voice", [
    q({
      id: "cw-q7-01", atom: "a-cw-active-passive", d: 2,
      prompt: "Which sentence is in the active voice?",
      options: [
        "Our team fixed the bug overnight.",
        "The bug was fixed overnight.",
        "The bug was fixed by our team overnight.",
        "The bug has been fixed.",
      ],
      correct: "a",
      explanation: "The subject (our team) does the action (fixed).",
      wrong: { b: "Be + past participle: passive, with no doer.", c: "Passive with the doer after \"by\".", d: "Passive: has been + fixed." },
    }),
    q({
      id: "cw-q7-02", atom: "a-cw-active-passive", d: 3,
      prompt: "When is the passive voice the better choice?",
      options: [
        "\"Your order has been shipped\", where the reader cares about the order, not who shipped it",
        "Whenever you want to sound more formal",
        "When you want to hide who made a mistake",
        "In every sentence of a report",
      ],
      correct: "a",
      explanation: "Use the passive when the doer is unknown, unimportant, or the focus belongs on the thing acted on.",
      wrong: { b: "Formality is not a reason; it makes writing slower.", c: "Hiding responsibility damages trust.", d: "Reports are clearer in the active voice." },
    }),
    q({
      id: "cw-q7-03", atom: "a-cw-reported-speech", d: 2,
      prompt: "Direct: She said, \"I will call you tomorrow.\" Which is the correct indirect speech?",
      options: [
        "She said that she would call me the next day.",
        "She said that I will call you tomorrow.",
        "She said that she will call you tomorrow.",
        "She said, she would call me tomorrow.",
      ],
      correct: "a",
      explanation: "Tense moves back (will → would), pronouns change, and tomorrow becomes the next day.",
      wrong: { b: "The pronouns and tense have not been shifted.", c: "Tense and time word not shifted.", d: "Time word not shifted, and the comma is not needed." },
    }),
    q({
      id: "cw-q7-04", atom: "a-cw-paragraphs", d: 2,
      prompt: "Where should the topic sentence of a business paragraph usually go?",
      options: ["First", "In the middle", "Last", "In a footnote"],
      correct: "a",
      explanation: "A reader who skims first sentences should still get your argument.",
      wrong: { b: "Hidden in the middle, it is easily missed.", c: "Last forces readers to read everything to find the point.", d: "Footnotes are for sources, not main ideas." },
    }),
  ]),

  ...check("cw-l8-concise", [
    q({
      id: "cw-q8-01", atom: "a-cw-word-choice", d: 1,
      prompt: "Which is the plainest replacement for \"utilise\"?",
      options: ["use", "employ", "leverage", "harness"],
      correct: "a",
      explanation: "Plain words read faster and sound confident.",
      wrong: { b: "Acceptable but less plain.", c: "Business jargon.", d: "Still inflated." },
    }),
    q({
      id: "cw-q8-02", atom: "a-cw-common-errors", d: 2,
      prompt: "Which sentence is correct?",
      options: [
        "The new policy will affect every branch.",
        "The new policy will effect every branch.",
        "Can you borrow me your laptop?",
        "We should of finished yesterday.",
      ],
      correct: "a",
      explanation: "Affect is the verb (to influence); effect is usually the noun (a result).",
      wrong: { b: "Effect as a verb means to bring about, which is not meant here.", c: "Lend me, not borrow me.", d: "Should have, not should of." },
    }),
    q({
      id: "cw-q8-03", atom: "a-cw-clear-sentences", d: 2,
      prompt: "What average sentence length suits most business and web writing?",
      options: ["15 to 20 words", "35 to 40 words", "5 words", "Length does not matter"],
      correct: "a",
      explanation: "Average 15 to 20, with any sentence over 25 words checked for splitting.",
      wrong: { b: "Far too long for most readers.", c: "An average this short sounds choppy.", d: "Sentence length strongly affects readability." },
    }),
    q({
      id: "cw-q8-04", atom: "a-cw-cutting", d: 2,
      prompt: "Which phrase is redundant?",
      options: ["free gift", "monthly report", "final decision", "new customer"],
      correct: "a",
      explanation: "A gift is free by definition, so \"free\" repeats it.",
      wrong: { b: "Monthly adds information.", c: "Final distinguishes from a provisional decision.", d: "New distinguishes from an existing customer." },
    }),
    q({
      id: "cw-q8-05", atom: "a-cw-m2-practical", d: 3,
      prompt: "Rewrite \"Due to the fact that the meeting has been postponed, we will make a decision at a later date.\" Which is best?",
      options: [
        "Because the meeting was postponed, we will decide later.",
        "The meeting was postponed due to the fact that we will decide later.",
        "At a later date a decision will be made.",
        "Due to the postponement, a decision-making process will occur later.",
      ],
      correct: "a",
      explanation: "\"Because\" replaces \"due to the fact that\" and \"decide\" replaces \"make a decision\".",
      wrong: { b: "It changes the meaning and keeps the wordy phrase.", c: "Loses the reason and uses the passive.", d: "Still wordy and abstract." },
    }),
  ]),
};

export default ASSESSMENTS;
