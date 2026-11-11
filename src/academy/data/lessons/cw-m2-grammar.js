/**
 * CONTENT WRITING · MODULE 2 · GRAMMAR, VOCABULARY AND SENTENCE CONSTRUCTION
 *
 * Curriculum 2.1 – 2.14 and the practical 2.P. Parts of speech, sentence
 * structures, agreement, tenses, punctuation and capitals, active and passive
 * voice, reported speech, paragraphs, word choice, common errors and concise
 * sentences.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

export const SECTION_ID = "cw-s2-grammar";

/* ── Lesson 5 lab: run-ons and fragments ───────────────────────────────── */
const RUNON = `Our bakery opened in 2019 we started with one oven and two staff now we have four branches across Port Harcourt and we deliver to offices every morning customers love our coconut bread it sells out by 10am most days. Because we bake fresh every night. Which is why we need more drivers.`;

const RUNON_DOC = `# Fixing sentence boundaries

## Original
${RUNON}

## Rewrite
[Rewrite the paragraph as complete, correctly punctuated sentences.]
`;

const RUNON_DONE = `# Fixing sentence boundaries

## Original
${RUNON}

## Rewrite
Our bakery opened in 2019. We started with one oven and two staff, but now we have four branches across Port Harcourt. We deliver to offices every morning. Customers love our coconut bread, and it sells out by 10am most days because we bake fresh every night. That is why we need more drivers.
`;

/* ── Lesson 6 lab: the error hunt ──────────────────────────────────────── */
const ERRORS = `the list of new products are ready for approval. Each of our sales officers have a copy, and the team are meeting on monday in abuja. Yesterday we visit three suppliers, its clear that prices has gone up since january. We need three things a new supplier, a bigger budget and more time.`;

const ERRORS_DOC = `# Proofreading: agreement, tense, capitals and punctuation

## Original
${ERRORS}

## Corrected
[Copy the paragraph here and correct every error. Change as little as possible.]
`;

const ERRORS_DONE = `# Proofreading: agreement, tense, capitals and punctuation

## Original
${ERRORS}

## Corrected
The list of new products is ready for approval. Each of our sales officers has a copy, and the team is meeting on Monday in Abuja. Yesterday we visited three suppliers; it's clear that prices have gone up since January. We need three things: a new supplier, a bigger budget and more time.
`;

/* ── Lesson 7 lab: voice, reported speech and a paragraph ──────────────── */
const VOICE_DOC = `# Voice, speech and paragraphs

## Active memo
[Rewrite in the active voice: "The new leave policy was approved by the board. Leave requests must be submitted by staff two weeks in advance. Late requests will be rejected by managers."]

## Reported speech
[Turn this into indirect speech: The CEO said, "We will open our Kano office next month."]

## Paragraph
[One paragraph on why customers leave a business: a topic sentence, at least two supporting sentences with an example, and a closing sentence.]
`;

const VOICE_DONE = `# Voice, speech and paragraphs

## Active memo
The board has approved the new leave policy. Staff must submit leave requests two weeks in advance. Managers will reject late requests.

## Reported speech
The CEO said that they would open their Kano office the following month.

## Paragraph
Most customers leave a business because of how it treats them, not because of its prices. A customer who waits forty minutes for a reply on WhatsApp starts to look elsewhere. For example, one Lagos salon lost a third of its regular clients in a year after it stopped confirming bookings. Small courtesies keep customers loyal far longer than discounts do.
`;

/* ── Lesson 8 lab: the practical ───────────────────────────────────────── */
const POOR_ONE = `In order to ensure that each and every customer is able to receive their orders in a timely manner, it is important to note that our company has made a decision to take into consideration the possibility of hiring additional delivery personnel at this point in time.`;

const POOR_TWO = `The training was very really useful. The training taught us alot of things about customer service. The trainer which was from Lagos explained that customers who is angry needs to be listened to first. Me and my colleagues think we should of had this training earlier, irregardless of the cost.`;

const PRACTICAL_DOC = `# Practical: correct and rewrite

## Paragraph 1: original
${POOR_ONE}

## Paragraph 1: rewrite
[Say the same thing in 25 words or fewer.]

## Paragraph 2: original
${POOR_TWO}

## Paragraph 2: rewrite
[Correct every error and remove the repetition.]

## What I changed
[Three bullets naming the kinds of change you made.]
`;

const PRACTICAL_DONE = `# Practical: correct and rewrite

## Paragraph 1: original
${POOR_ONE}

## Paragraph 1: rewrite
We plan to hire more delivery staff so that every customer receives their order on time.

## Paragraph 2: original
${POOR_TWO}

## Paragraph 2: rewrite
The customer service training was extremely useful and taught us a lot. The trainer, who came from Lagos, explained that we should listen to angry customers first. My colleagues and I think we should have had this training earlier, regardless of the cost.

## What I changed
- Cut wordy phrases such as "in order to" and "at this point in time"
- Fixed agreement ("customers who are angry"), "should have", "a lot" and "regardless"
- Merged two sentences that repeated "the training" and used "who" for a person
`;

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 5 · 2.1 – 2.3
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "cw-l5-sentences",
    moduleId: "cw-m2-grammar",
    sectionId: SECTION_ID,
    order: 1,
    covers: ["2.1", "2.2", "2.3"],
    title: "Words and Sentences",
    subtitle: "Parts of speech and how sentences are built",
    estimatedMinutes: 30,
    intro:
      "Grammar is not a set of rules to fear. It is the way words fit together so a reader understands you the first time. This lesson names the jobs words do and shows how they combine into sentences.",

    atoms: [
      {
        id: "a-cw-parts-of-speech",
        title: "Parts of speech",
        explain:
          "Every word in a sentence does a job, and the name of that job is its part of speech. English has eight traditional parts of speech: nouns (name things), pronouns (stand in for nouns), verbs (actions or states), adjectives (describe nouns), adverbs (describe verbs, adjectives or other adverbs), prepositions (show relationships such as in, on, under, after), conjunctions (join words and clauses: and, but, because) and interjections (exclamations: oh, wow). The same word can do different jobs: in \"We email clients\", email is a verb; in \"Send the email\", it is a noun. You need these names because editors, style guides and grammar tools use them, and because most errors are a word doing the wrong job.",
        table: {
          caption: "The eight parts of speech in one sentence: \"Wow, our new driver quickly delivered the bread to the office and it arrived warm.\"",
          headers: ["Part of speech", "Job", "Example from the sentence"],
          rows: [
            ["Interjection", "Shows feeling", "Wow"],
            ["Noun", "Names a person, place, thing or idea", "driver, bread, office"],
            ["Pronoun", "Replaces a noun", "it, our"],
            ["Verb", "Action or state", "delivered, arrived"],
            ["Adjective", "Describes a noun", "new, warm"],
            ["Adverb", "Describes a verb, adjective or adverb", "quickly"],
            ["Preposition", "Shows a relationship", "to"],
            ["Conjunction", "Joins words or clauses", "and"],
          ],
        },
      },
      {
        id: "a-cw-five-parts",
        title: "Nouns, pronouns, verbs, adjectives and adverbs",
        explain:
          "Five parts of speech carry most of the meaning. Nouns can be common (city, manager) or proper (Kano, Mrs Bello, capitalised), countable (one invoice, two invoices) or uncountable (information, equipment, advice; never \"informations\" or \"equipments\"). Pronouns must clearly point to one noun: in \"Ada told Ngozi she was promoted\", who is she? Rewrite until it is clear. Verbs are the engine of a sentence; strong, specific verbs (\"cut\", \"doubled\", \"launched\") beat weak verbs propped up by nouns (\"made a reduction\"). Adjectives should add information, not decoration: \"a 12-hour battery\" tells more than \"an amazing battery\". Adverbs often end in -ly; many can be removed by choosing a stronger verb (\"walked quickly\" becomes \"hurried\").",
        mistake: "Adding \"s\" to uncountable nouns: informations, advices, equipments, furnitures, feedbacks. They have no plural; use \"pieces of advice\" or \"items of equipment\" if you must count them.",
        decision: {
          scenario: "A draft reads: \"The manager gave the supplier his feedbacks after he made a reduction of the prices.\"",
          question: "Which rewrite fixes the noun, pronoun and verb problems?",
          options: [
            { id: "a", text: "\"After the supplier cut his prices, the manager gave him feedback.\"", why: "Right. \"Feedback\" is uncountable, \"cut\" is a strong verb instead of \"made a reduction of\", and the order makes clear who \"his\" and \"him\" refer to." },
            { id: "b", text: "\"The manager gave the supplier his feedbacks after he reduced the prices.\"", whyWrong: "\"Feedbacks\" is still wrong, and \"he\" could still be either man." },
            { id: "c", text: "\"Feedbacks were given by the manager to the supplier after a price reduction was made.\"", whyWrong: "Still \"feedbacks\", and now nobody is doing anything: the sentence is slower and vaguer." },
            { id: "d", text: "\"The manager made the giving of feedback to the supplier.\"", whyWrong: "That buries the action in nouns and loses the price cut altogether." },
          ],
          correct: "a",
        },
      },
      {
        id: "a-cw-sentence-structure",
        title: "Sentence structures and construction",
        explain:
          "A sentence needs a subject (who or what) and a verb (does or is), and it must express a complete thought. A clause is a group of words with its own subject and verb; an independent clause can stand alone, a dependent clause (starting with because, although, when, if, which) cannot. From these come four structures. Simple: one independent clause (\"We deliver daily.\"). Compound: two independent clauses joined by a comma and a conjunction such as and, but, or, so (\"We deliver daily, but we close on Sundays.\"). Complex: an independent clause plus a dependent one (\"Because demand grew, we hired drivers.\"). Compound-complex: both. Two errors break these rules. A fragment is a dependent clause or phrase punctuated as a sentence (\"Because we bake every night.\"). A run-on joins independent clauses with no punctuation, or only a comma (a comma splice: \"We opened in 2019, we now have four branches.\"). Good writers mix structures: mostly short, simple sentences, with longer ones to connect ideas.",
        samples: [
          { label: "Run-on and fragment", tone: "bad", text: "We opened in 2019 we now have four branches. Because customers love our bread." },
          { label: "Correct", tone: "good", text: "We opened in 2019, and we now have four branches because customers love our bread." },
        ],
        writingLab: {
          task:
            "The paragraph under \"Original\" is one long run-on followed by two fragments. Under \"Rewrite\", turn it into complete, correctly punctuated sentences. Keep every fact. Use at least four sentences, keep each to 30 words or fewer, join at least one pair of ideas with \", and\", \", but\" or \", so\", and leave no sentence starting with \"Because\" or \"Which\" on its own.",
          doc: RUNON_DOC,
          spellcheck: true,
          tests: [
            { label: "At least four sentences, none over 30 words", check: "const r = section('Rewrite'); return sentences(r).length >= 4 && longest(r) <= 30;", fail: "Put a full stop where each complete thought ends. The original has at least six." },
            { label: "Every fact kept (2019, Port Harcourt, coconut bread, 10am, drivers)", check: String.raw`const r = section('Rewrite') || ''; return ['2019', 'Port Harcourt', 'coconut bread', '10am', 'drivers'].every((f) => r.toLowerCase().includes(f.toLowerCase()));`, fail: "A rewrite fixes the grammar without losing facts. Check each one against the original." },
            { label: "At least one compound sentence (\", and\", \", but\" or \", so\")", check: String.raw`return /,\s(and|but|so|or)\s/i.test(section('Rewrite') || '');`, fail: "Join two related complete thoughts with a comma and a conjunction, such as \"…two staff, but now we have four branches.\"" },
            { label: "No fragments starting with \"Because\" or \"Which\"", check: String.raw`return !sentences(section('Rewrite')).some((s) => /^(Because|Which)\b/.test(s) && !/,/.test(s));`, fail: "Attach the \"because\" clause to the sentence it explains, and replace \"Which is why\" with \"That is why\"." },
          ],
          solution: RUNON_DONE,
          hint: "Read the original aloud and stop at every point where your voice drops and a new idea starts. Each of those is a full stop.",
          successMessage: "Every complete thought now has its own boundary, and related thoughts are joined on purpose.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 6 · 2.4 – 2.7
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "cw-l6-agreement",
    moduleId: "cw-m2-grammar",
    sectionId: SECTION_ID,
    order: 2,
    covers: ["2.4", "2.5", "2.6", "2.7"],
    title: "Agreement, Tense and Punctuation",
    subtitle: "Verbs that match their subjects, the right time, and the marks that guide a reader",
    estimatedMinutes: 35,
    intro:
      "These are the errors readers notice instantly and judge harshly: a verb that does not match its subject, a tense that jumps around, a missing capital, a comma in the wrong place. Each has a small set of rules.",

    atoms: [
      {
        id: "a-cw-agreement",
        title: "Subject-verb agreement",
        explain:
          "A verb must agree with its subject in number: a singular subject takes a singular verb (\"The report is ready\"), a plural subject a plural verb (\"The reports are ready\"). Errors happen when words come between them. Find the true subject: in \"The list of products is ready\", the subject is list (singular), not products. Each, every, either, neither, everyone, someone and nobody are singular: \"Each of the officers has a copy.\" Two subjects joined by and are plural (\"Ada and Musa are here\"); with or and nor, the verb agrees with the nearer one (\"Neither the manager nor the staff are here\"). Collective nouns (team, company, board, government) take a singular verb in standard international and Nigerian business English when the group acts as one unit: \"The team is meeting on Monday.\" Whatever you choose, be consistent within a document.",
        decision: {
          scenario: "Which sentence is correct?",
          question: "Choose the sentence with correct subject-verb agreement.",
          options: [
            { id: "a", text: "\"The quality of our products has improved.\"", why: "Right. The subject is quality (singular); \"of our products\" is only describing it." },
            { id: "b", text: "\"The quality of our products have improved.\"", whyWrong: "The verb has been attracted to the nearer word, products. The subject is quality." },
            { id: "c", text: "\"Every one of the drivers are on time.\"", whyWrong: "\"Every one\" is singular: \"Every one of the drivers is on time.\"" },
            { id: "d", text: "\"Neither of the proposals were accepted.\"", whyWrong: "\"Neither\" is singular in formal writing: \"Neither of the proposals was accepted.\"" },
          ],
          correct: "a",
        },
      },
      {
        id: "a-cw-tenses",
        title: "Tenses and their correct use",
        explain:
          "Tense places an action in time. The ones you will use most at work are: simple present for facts and habits (\"We deliver daily\"); present continuous for now or planned soon (\"We are reviewing the contract\"; \"The team is meeting on Monday\"); present perfect for past actions that matter now, without a stated time (\"Prices have risen\"); simple past for finished actions at a stated time (\"Prices rose in January\"; \"Yesterday we visited three suppliers\"); past perfect for the earlier of two past actions (\"The client had paid before we shipped\"); and the future with will or going to (\"We will open in May\"). Two rules prevent most errors. Do not use present perfect with a finished time: \"I have visited them yesterday\" is wrong; say \"I visited them yesterday\". And do not switch tenses within a piece without a reason in time: if a story is told in the past, keep it in the past.",
        table: {
          caption: "Workplace tenses and when to use each.",
          headers: ["Tense", "Use it for", "Example"],
          rows: [
            ["Simple present", "Facts, habits, schedules", "The office opens at 8am."],
            ["Present continuous", "Now, or arranged plans", "We are hiring two drivers."],
            ["Present perfect", "Past action relevant now, no time given", "Sales have doubled."],
            ["Simple past", "Finished action at a known time", "Sales doubled last year."],
            ["Past perfect", "The earlier of two past events", "We had finished before the client arrived."],
            ["Future (will / going to)", "Decisions, predictions, plans", "We will send the invoice on Friday."],
          ],
        },
      },
      {
        id: "a-cw-punctuation-capitals",
        title: "Punctuation and capitalisation",
        explain:
          "Punctuation tells a reader how to read: where to pause, where a thought ends, what belongs together. End every sentence with a full stop, a question mark or (rarely, in business writing) an exclamation mark. Use an apostrophe for possession (the company's policy; the companies' policies) and for contractions (it's = it is; don't = do not). The most common apostrophe error is its versus it's: its is possessive (\"the company and its staff\"), it's always means it is or it has. Capitalise the first word of a sentence; proper nouns such as names of people, places, organisations, days and months (Ngozi, Abuja, Dangote Group, Monday, January); titles before a name (Dr Okafor) and the main words of headings in title case. Do not capitalise seasons, general job titles (\"our manager\") or ordinary nouns for emphasis (\"our Valued Customers\").",
        mistake: "Writing \"it's\" for possession. Test it: if \"it is\" or \"it has\" does not fit, write its. \"The team lost it's way\" fails the test, so it is \"its way\".",
      },
      {
        id: "a-cw-commas-colons",
        title: "Commas, semicolons, colons and quotation marks",
        explain:
          "Commas separate. Use one before and, but, or, so when they join two complete sentences (\"We called, but nobody answered\"); after an introductory word or clause (\"However, …\", \"When the order arrived, …\"); around extra information that could be removed (\"Mr Bello, our supplier, called\"); and between items in a list. Never join two complete sentences with a comma alone (the comma splice from Lesson 5). A semicolon joins two closely related complete sentences without a conjunction (\"Sales rose; costs fell.\") and separates list items that already contain commas. A colon introduces what follows: a list, an explanation or an example (\"We need three things: a supplier, a budget and time.\"). The words before a colon must be a complete sentence. Quotation marks enclose someone's exact words (\"She said, \"We are ready.\"\") and titles of articles. In British and Nigerian usage single quotation marks are also common; choose one style and keep it.",
        writingLab: {
          task:
            "The paragraph under \"Original\" has twelve errors: agreement, tense, capital letters, its/it's, and punctuation (a comma splice and a missing colon before a list). Under \"Corrected\", rewrite it with every error fixed and as little else changed as possible.",
          doc: ERRORS_DOC,
          spellcheck: false,
          tests: [
            { label: "Sentences and proper nouns start with capitals (The, Monday, Abuja, January)", check: String.raw`const c = section('Corrected') || ''; return /^The list/.test(c) && /\bMonday\b/.test(c) && /\bAbuja\b/.test(c) && /\bJanuary\b/.test(c);`, fail: "Capitalise the first word, days of the week, cities and months." },
            { label: "Agreement fixed: \"list … is\", \"Each … has\", \"team is\", \"prices have\"", check: String.raw`const c = section('Corrected') || ''; return /list of new products is/i.test(c) && /each of our sales officers has/i.test(c) && /team is meeting/i.test(c) && /prices have/i.test(c);`, fail: "Find the true subject of each verb: list (one), each (one), the team (one unit), prices (many)." },
            { label: "Tense fixed: \"Yesterday we visited\"", check: String.raw`return /yesterday we visited/i.test(section('Corrected') || '');`, fail: "Yesterday is a finished time, so the verb is simple past." },
            { label: "Comma splice fixed and \"it's\" used for \"it is\"", check: String.raw`const c = section('Corrected') || ''; return /suppliers(;|\.)\s+it'?’?s clear/i.test(c) && /it['’]s clear/i.test(c);`, fail: "\"it is clear\" needs an apostrophe, and two complete sentences need a full stop or a semicolon between them, not a comma." },
            { label: "A colon introduces the list of three things", check: String.raw`return /three things:\s+a new supplier/i.test(section('Corrected') || '');`, fail: "The words \"We need three things\" form a complete sentence, so a colon introduces the list." },
            { label: "Nothing else rewritten", check: "return words(section('Corrected')) >= 50 && words(section('Corrected')) <= 58;", fail: "Proofreading corrects errors; it does not rewrite. Keep the paragraph's words." },
          ],
          solution: ERRORS_DONE,
          hint: "Read it once for each kind of error: first capitals, then each verb and its subject, then the commas.",
          successMessage: "Twelve errors, all fixed without rewriting the writer's paragraph. That restraint is what proofreaders are paid for.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 7 · 2.8 – 2.10
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "cw-l7-voice",
    moduleId: "cw-m2-grammar",
    sectionId: SECTION_ID,
    order: 3,
    covers: ["2.8", "2.9", "2.10"],
    title: "Voice, Reported Speech and Paragraphs",
    subtitle: "Who does what, how to report what people said, and how to build a paragraph",
    estimatedMinutes: 35,
    intro:
      "Three skills that turn correct sentences into clear writing: putting the doer first, reporting other people's words accurately, and grouping sentences into paragraphs that each make one point.",

    atoms: [
      {
        id: "a-cw-active-passive",
        title: "Active and passive voice",
        explain:
          "In the active voice the subject does the action: \"The board approved the policy.\" In the passive voice the subject receives the action, and the doer moves to the end after \"by\", or disappears: \"The policy was approved (by the board).\" You can spot the passive by a form of be (is, are, was, were, been, being) followed by a past participle (approved, written, sent). Prefer the active voice: it is shorter, clearer and says who is responsible. \"Mistakes were made\" hides who made them; \"Our team made mistakes\" owns them. The passive is right in three cases: when the doer is unknown (\"The office was broken into\"), when the doer does not matter (\"The bridge was built in 1965\"), or when you want the reader's attention on the thing acted on (\"Your order has been shipped\"). The Writing Desk's style report lists probable passives so you can decide each one.",
        samples: [
          { label: "Passive", tone: "bad", text: "Your application has been reviewed and it has been decided by the committee that an interview will be offered." },
          { label: "Active", tone: "good", text: "The committee has reviewed your application and would like to invite you to an interview." },
        ],
      },
      {
        id: "a-cw-reported-speech",
        title: "Direct and indirect speech",
        explain:
          "Direct speech quotes a person's exact words inside quotation marks: The CEO said, \"We will open our Kano office next month.\" Indirect (reported) speech reports what they said without quotation marks, usually after \"said that\" or \"told [someone] that\": The CEO said that they would open their Kano office the following month. When the reporting verb is in the past, three things shift. The tense moves one step back (will → would, is → was, open → opened, have done → had done). Pronouns change to fit the reporter (we → they, I → she). Time and place words shift (next month → the following month, tomorrow → the next day, here → there). Use direct speech when the exact words matter, such as a strong quotation in an article or a testimonial; use indirect speech in minutes, reports and summaries, where the meaning matters more than the wording. Never put quotation marks around words a person did not actually say.",
        table: {
          caption: "What shifts in reported speech after a past reporting verb.",
          headers: ["Direct", "Indirect"],
          rows: [
            ["\"I am busy.\"", "She said that she was busy."],
            ["\"We will call you tomorrow.\"", "They said that they would call me the next day."],
            ["\"I have sent the invoice.\"", "He said that he had sent the invoice."],
            ["\"Can you attend?\"", "She asked whether I could attend."],
          ],
        },
        decision: {
          scenario: "You are taking minutes. The finance director says: \"We have exceeded the budget by 10% and I will present a plan tomorrow.\"",
          question: "Which line belongs in the minutes?",
          options: [
            { id: "a", text: "The finance director said that they had exceeded the budget by 10% and that she would present a plan the next day.", why: "Right. Minutes report meaning in indirect speech with the tense, pronouns and time words shifted." },
            { id: "b", text: "The finance director said that we have exceeded the budget by 10% and I will present a plan tomorrow.", whyWrong: "The pronouns and time word still belong to the speaker, so \"I\" now seems to mean the minute-taker." },
            { id: "c", text: "The finance director said, \"We are over budget, and a plan is coming.\"", whyWrong: "Quotation marks claim these are her exact words, and they are not." },
            { id: "d", text: "The budget has been exceeded.", whyWrong: "It loses the amount, the plan and who will present it." },
          ],
          correct: "a",
        },
      },
      {
        id: "a-cw-paragraphs",
        title: "Paragraph development",
        explain:
          "A paragraph is a group of sentences about one main idea. A strong paragraph has three parts. The topic sentence states the main idea, usually first, so a reader skimming only first sentences still gets your argument. Supporting sentences develop it with explanation, evidence, an example or a number. A closing sentence wraps it up or links to the next paragraph. Keep paragraphs short for screens: three to five sentences for most web and business writing, one or two for social media and emails. Start a new paragraph when the idea changes. Paragraphs connect with transition words that show the relationship: addition (also, in addition), contrast (however, but), cause (because, as a result), example (for example), sequence (first, then, finally).",
        writingLab: {
          task:
            "Three exercises. Active memo: rewrite the three passive sentences in the active voice, keeping all the meaning (no more than one passive left). Reported speech: report the CEO's words in indirect speech, shifting tense, pronoun and time words. Paragraph: write one paragraph (60 to 120 words, at least four sentences) on why customers leave a business, with a topic sentence first, an example introduced with \"For example\" or \"For instance\", and a closing sentence.",
          doc: VOICE_DOC,
          tests: [
            { label: "Active memo: three sentences, at most one passive", check: "const m = section('Active memo'); return sentences(m).length >= 3 && passive(m).length <= 1;", fail: "Put the doer first: \"The board approved…\", \"Staff must submit…\", \"Managers will reject…\"." },
            { label: "Active memo keeps the board, staff, two weeks and managers", check: String.raw`const m = section('Active memo') || ''; return /board/i.test(m) && /staff/i.test(m) && /two weeks/i.test(m) && /manager/i.test(m);`, fail: "Every doer and every detail in the original must still be there." },
            { label: "Reported speech: \"said that\", \"would\", no quotation marks", check: String.raw`const r = section('Reported speech') || ''; return /said (that )?/i.test(r) && /\bwould\b/i.test(r) && !/["“”]/.test(r) && /Kano/.test(r);`, fail: "Report it without quotation marks: \"The CEO said that they would open…\"." },
            { label: "Reported speech shifts \"next month\" and \"we\"", check: String.raw`const r = section('Reported speech') || ''; return !/next month/i.test(r) && !/\bwe\b/i.test(r) && /(following|next) month|the month after/i.test(r.replace(/next month/i, ''));`, fail: "\"next month\" becomes \"the following month\", and \"we\" becomes \"they\" (or the company's name)." },
            { label: "Paragraph: 60 to 120 words, at least four sentences", check: "const p = section('Paragraph'); return words(p) >= 60 && words(p) <= 120 && sentences(p).length >= 4 && paragraphs(p).length === 1;", fail: "One paragraph (no blank lines inside it) of four or more sentences and 60 to 120 words." },
            { label: "Paragraph: a supporting example", check: String.raw`return /\bfor (example|instance)\b/i.test(section('Paragraph') || '');`, fail: "Introduce a concrete example with \"For example\" or \"For instance\"." },
          ],
          solution: VOICE_DONE,
          hint: "For each passive sentence ask \"who did it?\" and make that the first words of the sentence.",
          successMessage: "Doers first, other people's words reported faithfully, and a paragraph a reader can skim by its first sentence.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 8 · 2.11 – 2.14 · PRACTICAL 2.P
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "cw-l8-concise",
    moduleId: "cw-m2-grammar",
    sectionId: SECTION_ID,
    order: 4,
    covers: ["2.11", "2.12", "2.13", "2.14", "2.P"],
    title: "Word Choice, Errors and Concise Sentences",
    subtitle: "The right word, the mistakes to stop making, and sentences with nothing wasted",
    estimatedMinutes: 40,
    intro:
      "Correct is not enough: the best sentence is the one that says exactly what you mean in the fewest words the reader needs. This lesson covers vocabulary, the errors that appear in almost every draft, and how to cut.",

    atoms: [
      {
        id: "a-cw-word-choice",
        title: "Vocabulary development and word choice",
        explain:
          "A large vocabulary helps you choose the exact word, not the longest one. Prefer the plain word to the formal one (use, not utilise; help, not facilitate; start, not commence; buy, not purchase, unless the context is formal). Prefer the specific to the general (\"cut costs by 15%\" beats \"improved efficiency\"). Watch connotation, the feeling a word carries: cheap and affordable mean similar things, but only one flatters your product; stubborn and determined describe the same behaviour from different sides. Avoid jargon your reader does not share and clichés that have lost meaning (\"at the end of the day\", \"think outside the box\"). Build vocabulary by reading widely in the fields you write for, noting good words in a list, and using a thesaurus to find candidates, then a dictionary to check the exact meaning before you use one.",
        table: {
          caption: "Plain alternatives to inflated words.",
          headers: ["Instead of", "Write"],
          rows: [
            ["utilise", "use"],
            ["commence", "start"],
            ["facilitate", "help, run"],
            ["endeavour", "try"],
            ["in the event that", "if"],
            ["prior to", "before"],
            ["subsequent to", "after"],
            ["remuneration", "pay"],
          ],
        },
      },
      {
        id: "a-cw-common-errors",
        title: "Common grammatical errors",
        explain:
          "A short list of errors causes most of the damage in professional writing. Confused words: its/it's, your/you're, their/there/they're, affect (verb)/effect (noun), lose/loose, principal/principle, stationary/stationery, advice (noun)/advise (verb), loan/borrow. Wrong forms: \"should of\" for should have, \"alot\" for a lot, \"irregardless\" for regardless, \"me and my colleague went\" for my colleague and I went. Who and which: use who for people and which for things (\"the trainer who\", \"the report which\"). Errors common in Nigerian English that international readers notice: \"on the light\" (switch on the light), \"borrow me\" (lend me), \"I am having a car\" (I have a car), \"severally\" to mean often (it means separately), \"revert back\" (reply), and \"kindly do the needful\" (say exactly what you need). None of these make a writer less intelligent; they make a client less confident, so learn them.",
        mistake: "\"Please revert back to me.\" Revert means return to a previous state, and back repeats it. Write \"Please reply\" or \"Please let me know\".",
        decision: {
          scenario: "A cover letter contains: \"I have work severally on projects that effected the companies revenue, irregardless of budget limits.\"",
          question: "How many distinct errors are there?",
          options: [
            { id: "a", text: "Five: \"have work\", \"severally\", \"effected\", \"companies\" (missing apostrophe) and \"irregardless\"", why: "Right: \"I have worked many times on projects that affected the company's revenue, regardless of budget limits.\"" },
            { id: "b", text: "One: \"irregardless\"", whyWrong: "That is only one of five. \"have work\", \"severally\", \"effected\" and \"companies\" are also wrong." },
            { id: "c", text: "None: it is formal English", whyWrong: "Several words are misused; formality does not make them correct." },
            { id: "d", text: "Two: \"severally\" and \"irregardless\"", whyWrong: "It also needs \"worked\", \"affected\" and \"company's\"." },
          ],
          correct: "a",
        },
      },
      {
        id: "a-cw-clear-sentences",
        title: "Writing clear, concise and complete sentences",
        explain:
          "A clear sentence has one main idea, a subject and verb close together near the start, and its key information where readers look first or last. Aim for an average of 15 to 20 words, and treat any sentence over 25 words as a candidate to split; mix short and medium sentences so the rhythm does not become choppy. Concise means no word the reader does not need, not necessarily short: a 30-word sentence can be concise if every word works. Complete means it gives the reader every fact they need to understand and act (who, what, when, where, how much). Put conditions before instructions (\"If you are late, call the office\"), keep numbers in digits for business writing (\"5 days\", \"₦20,000\"), and put one instruction in each sentence.",
      },
      {
        id: "a-cw-cutting",
        title: "Avoiding unnecessary words and repetition",
        explain:
          "Most first drafts are 20 to 40 percent longer than they need to be. Cut in four ways. Replace wordy phrases with one word: in order to → to; due to the fact that → because; at this point in time → now; make a decision → decide; take into consideration → consider. Delete empty openers and intensifiers: it is important to note that, needless to say, very, really, actually, basically, just. Remove redundancy, where one word repeats another: each and every, end result, past history, future plans, free gift, return back, revert back, completely finished. Remove repetition: if two sentences say the same thing, keep the better one, and replace a repeated noun with a pronoun or merge the sentences. The Writing Desk's style report flags wordy phrases with their replacements. Cutting is not only for style: shorter text is read more, understood more and acted on more.",
        samples: [
          { label: "Before: 39 words", tone: "bad", text: "Due to the fact that we are at this point in time experiencing a very high volume of calls, it is important to note that each and every customer may experience delays in getting a response from our team." },
          { label: "After: 13 words", tone: "good", text: "We are receiving a lot of calls, so replies may take longer than usual." },
        ],
      },
      {
        id: "a-cw-m2-practical",
        title: "Practical: correct and rewrite poorly constructed paragraphs",
        explain:
          "This is the practical for Module 2 and the kind of task that appears in real writing tests. The first paragraph is grammatically acceptable but bloated: rewrite it so it says the same thing in 25 words or fewer. The second has errors of agreement, word form, relative pronouns and repetition: correct and tighten it. Then list what you changed. Use the Style report as you work: a clean report on your rewrites is part of the goal.",
        writingLab: {
          task:
            "Paragraph 1: rewrite it in 25 words or fewer, keeping its meaning (more delivery staff so orders arrive on time), with no wordy phrases. Paragraph 2: correct every error (\"very really\", \"alot\", \"which\" for a person, \"customers who is … needs\", \"me and my colleagues\", \"should of\", \"irregardless\") and remove the repetition of \"the training\" (use it at most twice). Then write three bullets under \"What I changed\".",
          doc: PRACTICAL_DOC,
          spellcheck: false,
          tests: [
            { label: "Paragraph 1: 25 words or fewer, meaning kept", check: String.raw`const p = section('Paragraph 1: rewrite') || ''; return words(p) >= 8 && words(p) <= 25 && /deliver/i.test(p) && /(time|quick|fast|promptly|sooner)/i.test(p);`, fail: "Say it in one short sentence: who will be hired, and why." },
            { label: "Paragraph 1: no wordy phrases left", check: "return wordy(section('Paragraph 1: rewrite')).length === 0;", fail: "Open the Style report: it lists the wordy phrases still in your rewrite." },
            { label: "Paragraph 2: the word-form errors are gone", check: String.raw`const p = section('Paragraph 2: rewrite') || ''; return !/\balot\b|should of|irregardless|very really|\bme and my\b/i.test(p) && /a lot/i.test(p) && /should have/i.test(p) && /regardless/i.test(p);`, fail: "Fix \"alot\" (a lot), \"should of\" (should have), \"irregardless\" (regardless), \"very really\" and \"me and my colleagues\" (my colleagues and I)." },
            { label: "Paragraph 2: \"who\" for the trainer and correct agreement", check: String.raw`const p = section('Paragraph 2: rewrite') || ''; return /trainer,? who/i.test(p) && !/trainer,? which/i.test(p) && !/customers who is|customers [^.]*needs to be/i.test(p);`, fail: "Use \"who\" for a person, and make \"customers\" (plural) agree: \"customers who are angry need…\", or rephrase." },
            { label: "Paragraph 2: \"the training\" appears at most twice", check: String.raw`return count(section('Paragraph 2: rewrite'), /\bthe (customer service )?training\b/gi) <= 2;`, fail: "Merge the first two sentences or use \"it\" instead of repeating \"the training\"." },
            { label: "Three bullets under \"What I changed\"", check: "return bullets(section('What I changed')).filter((b) => words(b) >= 4).length >= 3;", fail: "Name three kinds of change, such as \"cut wordy phrases\" or \"fixed agreement\"." },
          ],
          solution: PRACTICAL_DONE,
          hint: "For Paragraph 1, write the meaning in your own words first, then check nothing important is missing.",
          successMessage: "From 46 words to 16 in the first paragraph, and a second paragraph a client could publish. That is the Module 2 practical done.",
        },
      },
    ],

    task: {
      title: "Module 2 practical: a correction portfolio",
      intro: "Find real writing that needs work, and fix it.",
      prompts: [
        "Collect five poorly constructed paragraphs from real sources: notices, emails, social posts or websites (remove any names).",
        "For each, list every error by type: agreement, tense, punctuation, capitals, word choice, wordiness, repetition.",
        "Rewrite each one, aiming to cut at least 25% of the words without losing meaning.",
        "Run your rewrites through the Writing Desk style report or the Hemingway Editor and fix what they flag, using judgement.",
        "Keep a personal list of the errors you made most often in this module, and check every future draft for them.",
      ],
      closing: "Module 3 moves from correct to appropriate: choosing the style and tone each reader needs.",
    },

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
