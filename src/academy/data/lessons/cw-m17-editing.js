/**
 * CONTENT WRITING · MODULE 17 · EDITING AND PROOFREADING
 *
 * Curriculum 17.1 – 17.15 and the practical 17.P. Editing versus
 * proofreading, developmental, structural, line and copy editing, grammar,
 * punctuation and spelling checks, flow, redundancy, readability and
 * coherence, consistency, fact-checking, editing for audiences, style guides
 * and signing off; then a poorly written business article edited to a
 * polished final version.
 *
 * Spellcheck is switched off on the proofreading labs, as it would give the
 * answers away.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

export const SECTION_ID = "cw-s17-editing";

/* ── Lesson 63 lab: a line edit ────────────────────────────────────────── */
const LINE_ORIGINAL = `It is a well-known fact that in the current business environment of today, small and medium enterprises are faced with a large number of challenges which are making it very difficult for them to be able to grow their businesses. A decision was made by our organisation to conduct a survey in order to find out what these challenges actually are. The survey was completed by 300 business owners in Lagos and Kano, and it was discovered that access to finance was identified as the biggest challenge by 58% of respondents.`;

const LINE_DOC = `# Line edit

## Original
${LINE_ORIGINAL}

## Edited
[Your line edit: same facts, tighter sentences.]
`;

const LINE_DONE = `# Line edit

## Original
${LINE_ORIGINAL}

## Edited
Small and medium businesses face many challenges that make growth difficult. To find out what they are, we surveyed 300 business owners in Lagos and Kano. Access to finance was the biggest challenge, named by 58% of them.
`;

/* ── Lesson 64 lab: a proofread ────────────────────────────────────────── */
const PROOF_ORIGINAL = `Our new loan product, PayGrow, is design for small busineses that need working capital quickly. Customers can apply on there phone in under ten minutes, and recieve a decision within 24 hours. The loan amount range from ₦100,000 to ₦2 million, and their is no collateral required for loans below ₦500,000. We beleive this will help thousands of traders who's businesses have been held back by slow, complicated bank procedures. To apply, customers must have a BVN, a valid ID and atleast six months of transaction history in there business account.`;

const PROOF_DOC = `# Proofread

## Original
${PROOF_ORIGINAL}

## Corrected
[Copy the paragraph and correct every error. Change nothing else.]
`;

const PROOF_DONE = `# Proofread

## Original
${PROOF_ORIGINAL}

## Corrected
Our new loan product, PayGrow, is designed for small businesses that need working capital quickly. Customers can apply on their phone in under ten minutes, and receive a decision within 24 hours. The loan amounts range from ₦100,000 to ₦2 million, and there is no collateral required for loans below ₦500,000. We believe this will help thousands of traders whose businesses have been held back by slow, complicated bank procedures. To apply, customers must have a BVN, a valid ID and at least six months of transaction history in their business account.
`;

/* ── Lesson 65 lab: consistency against a style sheet ──────────────────── */
const STYLE_BRIEF = `**House style sheet: Harvest Hub newsletter**

- Dates: day month year, no "th" or "st" (5 March 2026, not March 5th or 05/03/2026).
- Money: the ₦ sign with commas, no "N" and no "naira" after a number (₦45,000).
- Percentages: the % sign with no space (12%), never "per cent" or "percent".
- The company is always "Harvest Hub" (two words, capital H in both).
- Job titles are lower case unless they come directly before a name (the operations manager; Operations Manager Ngozi Eze).
- Numbers: words for one to nine, figures for 10 and above.`;

const STYLE_ORIGINAL = `HarvestHub will open its new warehouse in Kaduna on March 12th. The warehouse cost N45,000,000 and will hold 2,000 tonnes of grain, about 30 per cent more than our current site. The Operations Manager said the move will let harvest hub deliver to 3 more states. From 05/04/2026, customers in these states will pay 12 percent less for delivery, saving an average of 8000 naira on each order.`;

const STYLE_DOC = `# Make it consistent

## Original
${STYLE_ORIGINAL}

## Edited
[Apply the house style sheet. Change only what the style sheet requires.]
`;

const STYLE_DONE = `# Make it consistent

## Original
${STYLE_ORIGINAL}

## Edited
Harvest Hub will open its new warehouse in Kaduna on 12 March. The warehouse cost ₦45,000,000 and will hold 2,000 tonnes of grain, about 30% more than our current site. The operations manager said the move will let Harvest Hub deliver to three more states. From 5 April 2026, customers in these states will pay 12% less for delivery, saving an average of ₦8,000 on each order.
`;

/* ── Lesson 66 lab: the practical ──────────────────────────────────────── */
const ARTICLE_BRIEF = `A client, **Tradewise Consulting**, sent this draft article for its website and LinkedIn page. The facts are correct (the client confirmed them). Edit and proofread it into a polished final version for small business owners, and write editor's notes for the client.

> **why every small busness needs a budget**
>
> In todays economy, it is very important to note that a large number of small businesses in Nigeria are failing. Infact, according to a survey which was conducted by Tradewise Consulting in 2025 of 400 small businesses in Lagos and Abuja, 6 out of 10 of the businesses that closed down had no written budget. This is a big problem.
>
> A budget is basically a plan for your money. It is a plan that shows how much money you expect to come in and how much money you expect to go out. Without a budget you can not know if your business is making profit or loosing money, you also cannot plan for big expenses like rent which in Lagos is often paid yearly in advance.
>
> There are many benefits of having a budget. Firstly it helps you to control costs. Secondly it helps you to plan ahead. Thirdly, banks and investors will ask to see it before they will give you a loan, and it also helps you to make decisions. Each and every business owner should therefore make a budget at this point in time.
>
> In order to start, you should write down all your income for the past three month's. Then you should write down all your expenses. Then compare them. Then you should make a plan for next month. Tradewise Consulting offer a free budget template on our website which you can download.`;

const ARTICLE_DOC = `# Edited article

[The polished final version: a headline as the "# " line, an introduction, at least two "## " sections, and a closing call to action.]

## Editor's notes
[At least four "- " bullets explaining your main changes to the client.]
`;

const ARTICLE_DONE = `# Why Every Small Business Needs a Budget

Six in ten small businesses that closed had no written budget. That is what Tradewise Consulting found in a 2025 survey of 400 small businesses in Lagos and Abuja. A budget will not guarantee success, but running a business without one makes failure far more likely.

## What a budget is

A budget is a plan for your money. It shows how much you expect to earn and how much you expect to spend over a period, usually a month. Without one, you cannot tell whether your business is making a profit or losing money. You also cannot plan for large costs such as rent, which in Lagos is often paid a year in advance.

## Why your business needs one

A budget helps you in four ways:

- It helps you control costs, because you can see where your money goes.
- It helps you plan for large expenses before they arrive.
- It helps you make better decisions, such as when to hire or buy stock.
- It helps you get finance, because banks and investors ask to see one before they lend.

## How to start your first budget

1. List all your income for the past three months.
2. List all your expenses for the same three months.
3. Compare the two to see whether you made a profit or a loss.
4. Use what you learn to plan your income and spending for next month.

Start this week. Download Tradewise Consulting's free budget template from our website and complete your first budget in an afternoon.

## Editor's notes
- Fixed spelling and grammar errors, including "busness", "Infact", "loosing", "can not", "month's" and "Tradewise Consulting offer".
- Moved the survey finding to the opening so the article starts with its strongest evidence instead of a warm-up.
- Removed wordy and empty phrases such as "it is very important to note", "basically", "each and every" and "at this point in time".
- Restructured the article with headings, a bulleted list of benefits and numbered steps, so readers can scan it on a phone.
- Rewrote the ending as a clear call to action to download the free template.
`;

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 63 · 17.1 – 17.5
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "cw-l63-editing-levels",
    moduleId: "cw-m17-editing",
    sectionId: SECTION_ID,
    order: 1,
    covers: ["17.1", "17.2", "17.3", "17.4", "17.5"],
    title: "Editing and Its Four Levels",
    subtitle: "Editing versus proofreading, and developmental, structural, line and copy editing",
    estimatedMinutes: 40,
    intro:
      "Part Five is about quality. Editing is where good writing is made: most professional writers spend as long editing as drafting. This lesson separates the kinds of editing and the order they happen in.",

    atoms: [
      {
        id: "a-cw-edit-vs-proof",
        title: "The difference between editing and proofreading",
        explain:
          "Editing improves the content, structure and language of a piece: is it doing its job for its reader, is it organised well, are the sentences clear, is it accurate and consistent? Proofreading is the final check for surface errors (spelling, typing errors, punctuation, formatting, missing words) after editing is finished, usually on the final layout. Editing can change a lot; proofreading should change as little as possible. They happen in order, from the biggest changes to the smallest: developmental, structural, line, copy editing, then proofreading. Doing them in the wrong order wastes effort, because perfecting the commas in a paragraph that will be cut is pointless. As a freelancer, agree with the client which level they are paying for, because \"Can you just proofread it?\" often means \"Can you make it good?\"",
        table: {
          caption: "The levels of editing, from biggest to smallest.",
          headers: ["Level", "Asks", "Changes"],
          rows: [
            ["Developmental", "Is this the right piece for the reader and purpose?", "Content, argument, angle"],
            ["Structural", "Is it in the best order?", "Sections, paragraphs, flow of ideas"],
            ["Line", "Is every sentence clear and strong?", "Sentences, word choice, rhythm"],
            ["Copy", "Is it correct and consistent?", "Grammar, style, facts, consistency"],
            ["Proofreading", "Are there any surface errors left?", "Typos, punctuation, formatting"],
          ],
        },
      },
      {
        id: "a-cw-developmental",
        title: "Developmental editing",
        explain:
          "Developmental (or substantive) editing looks at the whole piece before any sentences: does it serve its reader and purpose? A developmental editor asks: Is the audience clear, and is the content right for them? Is the main message clear and supported? Is anything important missing (evidence, examples, a counter-argument, a call to action)? Is anything there that does not belong? Is the angle strong enough to be worth reading? Is the length right? The result is usually a set of notes or a short report with recommendations, and sometimes rewriting of whole sections. For articles and business documents, a quick developmental pass can be done by writing the piece's purpose and key message in one sentence each, then checking every section against them.",
      },
      {
        id: "a-cw-structural",
        title: "Structural editing",
        explain:
          "Structural editing arranges the content in the best order for the reader. Check that the most important information comes first (the key finding, the main point, the answer); that each section and paragraph has one job and they follow a logical sequence (chronological, problem–solution, most to least important); that headings describe their sections; that related material is together and repetition is removed; and that transitions connect the parts. Techniques: write a reverse outline (one line per paragraph summarising what it does) and look for paragraphs out of place, doing two jobs, or repeating others; read only the headings and first sentences; and turn lists hidden in paragraphs into bullets or numbered steps.",
        decision: {
          scenario: "An article about budgeting opens with two paragraphs of general background, and its strongest evidence (a survey finding) appears in paragraph three.",
          question: "What is the structural edit?",
          options: [
            { id: "a", text: "Move the survey finding to the opening and cut or shorten the general background", why: "Right. Lead with the strongest material; background that delays the point loses readers." },
            { id: "b", text: "Fix the commas in the first two paragraphs", whyWrong: "That is copy editing; the structure problem remains." },
            { id: "c", text: "Add more background to the opening", whyWrong: "That delays the point even further." },
            { id: "d", text: "Delete the survey finding", whyWrong: "It is the strongest evidence in the piece." },
          ],
          correct: "a",
        },
      },
      {
        id: "a-cw-line-editing",
        title: "Line editing",
        explain:
          "Line editing works sentence by sentence on clarity, style and rhythm, keeping the writer's meaning and voice. It cuts wordiness (Module 2), turns unnecessary passives into active sentences, replaces vague or inflated words with precise ones, splits sentences that are too long, varies sentence length for rhythm, removes clichés and filler (\"It is a well-known fact that\"), and makes sure each sentence leads naturally to the next. A good line edit often cuts 20 to 40% of the words without losing a single fact. The Writing Desk's style report, the Hemingway Editor and Grammarly's clarity suggestions all help find candidates, but the editor decides each change: not every passive or adverb is wrong.",
      },
      {
        id: "a-cw-copy-editing",
        title: "Copy editing",
        explain:
          "Copy editing makes text correct and consistent so it is ready to publish. A copy editor corrects grammar, spelling, punctuation and usage; checks consistency of spelling (British or American), capitalisation, numbers, dates, abbreviations, names and terms, applying the house style guide (Lesson 65); checks facts, figures, names and quotations where required, and flags anything doubtful for the writer (\"Please confirm: 58% here, 56% on page 2\"); checks that headings, lists and cross-references are correct; and watches for legal risks such as defamation, plagiarism or unsupported claims. Copy editors usually work with tracked changes and comments, so the writer can accept or reject each change and answer queries.",
        writingLab: {
          task:
            "Line edit the paragraph. Keep every fact (the survey, 300 business owners, Lagos and Kano, access to finance, 58%). Cut it to 60 words or fewer (from 92), leave no wordy phrases, no more than one passive construction, no sentence over 25 words, and rewrite rather than trim (no more than half of your three-word sequences may come from the original).",
          doc: LINE_DOC,
          tests: [
            { label: "Every fact kept", check: String.raw`const e = section('Edited') || ''; return /300/.test(e) && /lagos/i.test(e) && /kano/i.test(e) && /financ/i.test(e) && /58\s?%/.test(e) && /survey/i.test(e);`, fail: "Keep every fact: the survey, 300 owners, Lagos and Kano, access to finance and 58%." },
            { label: "60 words or fewer", check: "const n = words(section('Edited')); return n >= 25 && n <= 60;", fail: "Cut to 60 words or fewer." },
            { label: "No wordy phrases, at most one passive", check: "const e = section('Edited'); return wordy(e).length === 0 && passive(e).length <= 1;", fail: "Open the Style report: remove the wordy phrases and put doers first." },
            { label: "No sentence over 25 words", check: "return longest(section('Edited')) <= 25;", fail: "Split long sentences." },
            { label: "A real rewrite", check: "return overlap(section('Edited'), section('Original')) <= 0.5;", fail: "Rewrite the sentences rather than deleting a few words from the original." },
          ],
          solution: LINE_DONE,
          hint: "Underline the facts first. Then write the shortest clear sentences that carry all of them.",
          successMessage: "From 92 words to under 40, with every fact intact. That is what a line edit is worth.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 64 · 17.6 – 17.10
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "cw-l64-checks",
    moduleId: "cw-m17-editing",
    sectionId: SECTION_ID,
    order: 2,
    covers: ["17.6", "17.7", "17.8", "17.9", "17.10"],
    title: "Grammar, Spelling, Flow and Readability",
    subtitle: "The checks editors run on every page",
    estimatedMinutes: 40,
    intro:
      "This lesson turns the grammar of Module 2 into an editor's routine: systematic checks for grammar and punctuation, spelling, sentence flow, redundancy, readability and coherence.",

    atoms: [
      {
        id: "a-cw-grammar-checks",
        title: "Grammar and punctuation checks",
        explain:
          "Editors check grammar systematically rather than hoping to notice errors. Read once for each common problem: subject-verb agreement (\"The loan amounts range\", not \"range\" with \"amount\"); verb forms and tenses (\"is designed\", not \"is design\"); pronouns and their antecedents; apostrophes (its/it's, whose/who's, plural versus possessive: \"three months\", not \"three month's\"); commas (comma splices, missing commas after introductory phrases); and sentence boundaries (fragments and run-ons). Grammar tools flag many of these, but they miss errors and sometimes suggest wrong changes, so check every suggestion against the rules from Module 2. Keep a personal list of the errors a particular writer makes repeatedly, and search for them.",
      },
      {
        id: "a-cw-spelling",
        title: "Identifying spelling mistakes",
        explain:
          "Spellcheckers catch words that do not exist (\"busness\", \"recieve\") but not real words used wrongly, which are the most common errors in professional text: there/their/they're, your/you're, its/it's, whose/who's, lose/loose, affect/effect, principal/principle, stationary/stationery, and a lot/alot or at least/atleast (joined wrongly). Check names, places and brand names against the source, because a misspelled client name is the most damaging error of all. Choose British or American spelling (organisation or organization, colour or color) according to the house style, and stay consistent. Proofreading techniques: read slowly, aloud or with text-to-speech; read on paper or in a different font; read backwards sentence by sentence to see words rather than meaning; and proofread when rested, not straight after writing.",
        mistake: "Trusting the spellchecker. \"Customers can apply on there phone\" passes a spellchecker. Only a careful reader catches it.",
        writingLab: {
          task:
            "Proofread the PayGrow paragraph. Copy it under \"Corrected\" and fix every error: verb forms, spelling, there/their/whose and joined words, and agreement. There are ten errors. Change nothing else (spellcheck is switched off for this lab).",
          doc: PROOF_DOC,
          spellcheck: false,
          tests: [
            { label: "Spelling fixed: businesses, receive, believe", check: String.raw`const c = section('Corrected') || ''; return /small businesses/i.test(c) && /\breceive\b/i.test(c) && /\bbelieve\b/i.test(c) && !/busineses|recieve|beleive/i.test(c);`, fail: "Find the three misspelled words: busineses, recieve, beleive." },
            { label: "Verb form and agreement fixed: designed, amounts range", check: String.raw`const c = section('Corrected') || ''; return /is designed for/i.test(c) && /(amounts range|amount ranges)/i.test(c);`, fail: "\"is design\" needs a past participle, and \"amount\" must agree with \"range\"." },
            { label: "Their, there and whose used correctly", check: String.raw`const c = section('Corrected') || ''; return /on their phone/i.test(c) && /there is no collateral/i.test(c) && /traders whose businesses/i.test(c) && /in their business account/i.test(c);`, fail: "Check every there/their and who's/whose: possession or place?" },
            { label: "\"at least\" written as two words", check: String.raw`const c = section('Corrected') || ''; return /at least six/i.test(c) && !/atleast/i.test(c);`, fail: "\"atleast\" is two words." },
            { label: "Nothing else changed", check: "const c = section('Corrected'); return Math.abs(words(c) - words(section('Original'))) <= 3 && overlap(c, section('Original')) >= 0.6;", fail: "Proofreading corrects errors only. Keep the rest of the paragraph exactly as written." },
          ],
          solution: PROOF_DONE,
          hint: "Read it once for spelling, once for there/their/whose, and once for verbs.",
          successMessage: "Ten errors fixed and nothing else touched. That restraint is what clients pay proofreaders for.",
        },
      },
      {
        id: "a-cw-flow",
        title: "Improving sentence flow",
        explain:
          "Flow is how smoothly a reader moves from one sentence and idea to the next. Improve it by connecting sentences with transition words (however, as a result, for example, then) and by linking ideas: start a sentence with something from the end of the previous one (\"…a written budget. A budget is…\"); vary sentence length and openings so the rhythm does not drone (several sentences in a row beginning \"Then you should\" are a warning); keep subjects and verbs close together; and put old, familiar information before new information in each sentence. Reading aloud is the best flow test: wherever you stumble or run out of breath, the reader will too.",
      },
      {
        id: "a-cw-redundancy",
        title: "Eliminating redundancy and unnecessary expressions",
        explain:
          "Redundancy is saying the same thing twice. At word level: \"current business environment of today\", \"each and every\", \"past history\", \"completely finished\", \"plan ahead\" where \"plan\" is enough. At sentence level: \"A budget is a plan for your money. It is a plan that shows…\" repeats \"plan\"; combine them. At paragraph level: two paragraphs making the same point. Unnecessary expressions are words that add nothing: throat-clearing openers (\"It is a well-known fact that\", \"It is important to note that\"), intensifiers (very, really, extremely), hedges with no purpose (basically, actually, kind of), and empty conclusions (\"This is a big problem.\" after the problem has been shown). Cut them, then reread to check the meaning and voice survived.",
        samples: [
          { label: "Redundant", tone: "bad", text: "In the current business environment of today, each and every small business owner should plan ahead for future expenses." },
          { label: "Edited", tone: "good", text: "Every small business owner should plan for future expenses." },
        ],
      },
      {
        id: "a-cw-coherence",
        title: "Improving readability and coherence",
        explain:
          "Readability is how easy text is to read; coherence is how well it holds together as one argument. For readability, use the tools from Module 3 (sentence length, word length, reading grade) and formatting (short paragraphs, headings, lists). For coherence, check that every paragraph supports the main message, that each paragraph has a clear topic sentence, that the order is logical, that terms are used consistently (do not switch between \"loan\", \"credit facility\" and \"advance\" for the same thing), and that pronouns clearly point back to their nouns. A coherent piece can be summarised in one sentence, and its headings alone tell its story (Module 4). An editor checks both: a text can be easy to read sentence by sentence and still not add up.",
        decision: {
          scenario: "A report uses \"loan\", \"facility\", \"advance\" and \"credit\" for the same product on one page.",
          question: "What should the editor do?",
          options: [
            { id: "a", text: "Choose one term (\"loan\"), use it throughout, and add it to the project's style sheet", why: "Right. Switching terms makes readers wonder whether they are different products." },
            { id: "b", text: "Keep the variety to avoid repetition", whyWrong: "In professional and technical writing, consistent terms matter more than variety." },
            { id: "c", text: "Use a different term in every paragraph", whyWrong: "That increases confusion." },
            { id: "d", text: "Delete all four words", whyWrong: "The product still needs a name." },
          ],
          correct: "a",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 65 · 17.11 – 17.15
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "cw-l65-standards",
    moduleId: "cw-m17-editing",
    sectionId: SECTION_ID,
    order: 3,
    covers: ["17.11", "17.12", "17.13", "17.14", "17.15"],
    title: "Consistency, Facts, Audiences, Style Guides and Sign-off",
    subtitle: "The standards that make writing publishable",
    estimatedMinutes: 40,
    intro:
      "The final layer of editing is about standards: consistent tone and style, verified facts, the right level for the reader, the house style guide, and a sign-off process that catches what everyone else missed.",

    atoms: [
      {
        id: "a-cw-tone-consistency",
        title: "Maintaining consistency in tone and style",
        explain:
          "Inconsistency makes writing feel careless or written by several people, which it often is. Check that the tone stays the same throughout (a warm, conversational article should not switch into stiff legal language in the last paragraph, unless a legal note is required), that the voice matches the brand's voice chart (Module 3), and that mechanical style is consistent: spelling standard, dates, numbers, money, percentages, capitalisation of titles and headings, abbreviations, list punctuation and the names of products and the organisation. Editors keep a style sheet for each project: a short list of the decisions made (\"Harvest Hub, two words\"; \"12%\"; \"5 March 2026\") so every later piece follows them.",
      },
      {
        id: "a-cw-verifying-claims",
        title: "Fact-checking and verifying claims",
        explain:
          "In Module 4 you fact-checked your own research. As an editor, you check other writers' claims, and you are often the last line of defence before publication. Flag and verify every statistic (source, date, what it measures), every name and title, every quotation, every date and figure, every comparison (\"the cheapest\", \"the first\"), every claim about a person or company that could harm their reputation (defamation risk), and every health, legal or financial claim. Check internal consistency too: the same figure must be the same everywhere in the document. When you cannot verify a claim, query the writer or client in a comment rather than silently deleting or approving it: \"Source please for 6 out of 10?\"",
      },
      {
        id: "a-cw-editing-audiences",
        title: "Editing for different audiences",
        explain:
          "An editor reads as the intended reader, not as themselves. For a general audience: reduce the reading grade, explain or remove jargon, add examples and use headings and lists. For experts: keep precise technical terms, remove over-explanation, and check accuracy rigorously. For senior decision-makers: move conclusions and recommendations to the top and cut detail into appendices. For international readers: remove local idioms and ambiguous dates, and explain local references. For mobile readers: shorter paragraphs and front-loaded sentences. For readers with disabilities: plain language, descriptive links, alt text and logical headings (Module 3). The same text often needs two different edits for two audiences, for example a technical report and its public summary.",
        decision: {
          scenario: "You are editing a bank's article about a new loan for market traders. It contains \"amortisation schedule\", \"APR\" and \"collateralisation requirements\".",
          question: "What is the best edit for this audience?",
          options: [
            { id: "a", text: "Replace or explain the terms in plain words, such as \"repayment plan\" and \"what you must offer as security\"", why: "Right. Edit for the reader: traders need to understand the loan to use it." },
            { id: "b", text: "Keep the terms: they are accurate", whyWrong: "Accurate but unclear to this audience; the article fails its purpose." },
            { id: "c", text: "Add more financial terms to sound credible", whyWrong: "That makes it harder still for traders." },
            { id: "d", text: "Delete the loan details", whyWrong: "Readers need the details, in words they understand." },
          ],
          correct: "a",
        },
      },
      {
        id: "a-cw-style-guides",
        title: "Introduction to editorial style guides",
        explain:
          "A style guide is a set of rules for writing and formatting that an organisation or publication follows, so that everything it publishes is consistent. Major published guides include the AP Stylebook (news, mainly American), the Chicago Manual of Style (books and publishing), the Guardian and Observer style guide and the Economist Style Guide (British journalism), and the Microsoft and Google style guides (technical writing). Most organisations also have a house style guide covering their own decisions: name and product spellings, voice and tone, dates, numbers, money, capitalisation, inclusive language and formatting. When a client has a style guide, it overrides your personal preferences; when they have none, choose a recognised guide, write a short style sheet of key decisions, and share it with them.",
        writingLab: {
          task:
            "Apply Harvest Hub's house style sheet to the paragraph. Fix the company name, dates, money, percentages, the job title and numbers under 10, exactly as the style sheet requires. Change nothing else.",
          brief: STYLE_BRIEF,
          doc: STYLE_DOC,
          spellcheck: false,
          tests: [
            { label: "Company name: always \"Harvest Hub\"", check: String.raw`const e = section('Edited') || ''; return count(e, /Harvest Hub/g) === 2 && !/HarvestHub|harvest hub/.test(e);`, fail: "The style sheet says \"Harvest Hub\": two words, both capitalised." },
            { label: "Dates in day month year format", check: String.raw`const e = section('Edited') || ''; return /12 March/.test(e) && /5 April 2026/.test(e) && !/12th|05\/04/.test(e);`, fail: "Write 12 March and 5 April 2026." },
            { label: "Money with ₦ and commas", check: String.raw`const e = section('Edited') || ''; return /₦45,000,000/.test(e) && /₦8,000/.test(e) && !/N45|naira/i.test(e);`, fail: "Use ₦ with commas: ₦45,000,000 and ₦8,000, with no \"N\" or \"naira\"." },
            { label: "Percentages with % and no space", check: String.raw`const e = section('Edited') || ''; return /30%/.test(e) && /12%/.test(e) && !/per ?cent/i.test(e);`, fail: "Write 30% and 12%." },
            { label: "Job title lower case; \"three\" in words", check: String.raw`const e = section('Edited') || ''; return /[Tt]he operations manager/.test(e) && !/Operations Manager said/.test(e) && /three more states/.test(e);`, fail: "A title not before a name is lower case, and numbers under 10 are words." },
            { label: "Nothing else changed", check: "return overlap(section('Edited'), section('Original')) >= 0.45 && Math.abs(words(section('Edited')) - words(section('Original'))) <= 4;", fail: "Change only what the style sheet requires." },
          ],
          solution: STYLE_DONE,
          hint: "Go through the style sheet one rule at a time, searching the paragraph for each.",
          successMessage: "Every rule in the style sheet applied, and nothing else touched.",
        },
      },
      {
        id: "a-cw-sign-off",
        title: "Reviewing and approving final drafts",
        explain:
          "Before a document is published or sent, someone must approve it. A sign-off process usually has these steps: the writer self-edits; an editor edits and queries; the writer resolves queries; a subject expert or legal reviewer checks accuracy and risk where needed; the client or manager approves; and a final proofread is done on the actual published form (the web page preview, the PDF, the email test), because layout introduces new errors (broken links, missing images, bad line breaks). Use a final checklist: purpose and audience met; facts, names, numbers and links checked; style guide applied; headings, captions and alt text present; spelling and grammar clean; and the correct version approved. Record who approved what and when.",
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 66 · PRACTICAL 17.P
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "cw-l66-edit-practical",
    moduleId: "cw-m17-editing",
    sectionId: SECTION_ID,
    order: 4,
    covers: ["17.P"],
    title: "Practical: From Poor Draft to Polished Article",
    subtitle: "A full edit, every level, with notes for the client",
    estimatedMinutes: 60,
    intro:
      "Now edit a real client draft through every level: developmental, structural, line, copy and proofreading, and explain your changes as a professional editor would.",

    atoms: [
      {
        id: "a-cw-editor-notes",
        title: "Writing editor's notes for a client",
        explain:
          "When you return an edited piece, include short editor's notes so the client understands and trusts your changes. Summarise the main changes by type rather than listing every comma: structure (\"Moved the survey finding to the opening\"), clarity and length (\"Cut wordy phrases; reduced from 330 to 290 words\"), correctness (\"Fixed spelling and grammar errors\"), formatting (\"Added headings and lists for mobile readers\"), and anything you need from the client (\"Please confirm the survey date\"). Be respectful of the writer's work: explain changes by their benefit to the reader, not by criticism of the writer. In real projects, also return a tracked-changes version so the client can see every change.",
      },
      {
        id: "a-cw-m17-practical",
        title: "Practical: edit and proofread a business article",
        explain:
          "Edit Tradewise Consulting's draft into a polished article for small business owners. Work through the levels in order: decide what the reader needs; restructure (strongest evidence first, headings, a list of benefits, numbered steps); line edit; correct every error; proofread; then write your notes for the client. Keep every confirmed fact.",
        writingLab: {
          task:
            "Final version: a title-case headline on the \"# \" line; an introduction that leads with the survey finding (6 in 10 or 60%, 400 businesses, Lagos and Abuja, 2025); at least two \"## \" sections; the benefits as bullets and the steps as a numbered list; a closing call to action to download the free template. 200 to 380 words, reading grade 9 or below, no wordy phrases, at most one passive. Every error from the draft must be gone. Editor's notes: at least four bullets.",
          brief: ARTICLE_BRIEF,
          doc: ARTICLE_DOC,
          spellcheck: false,
          tests: [
            { label: "Title-case headline", check: String.raw`const h = (lines(doc).find((l) => /^#\s/.test(l)) || '').replace(/^#\s*/, ''); return words(h) >= 5 && /budget/i.test(h) && h.split(/\s+/).filter((w) => w.length > 3).every((w) => /^[A-Z0-9"']/.test(w));`, fail: "Write a headline in title case (major words capitalised), mentioning budgets." },
            { label: "Leads with the survey finding", check: String.raw`const intro = doc.split(/^##\s/m)[0].replace(/^#.*$/m, ''); const first = sentences(intro).slice(0, 2).join(' '); return /(6|six) (in|out of) (10|ten)|60\s?%/i.test(first) && /400/.test(intro) && /lagos/i.test(intro) && /abuja/i.test(intro) && /2025/.test(intro);`, fail: "Open with the survey finding in the first two sentences, with 400 businesses, Lagos and Abuja, and 2025." },
            { label: "Sections, bulleted benefits and numbered steps", check: String.raw`const body = doc.split(/^##\s+Editor/m)[0]; return headings(2).filter((h) => !/editor/i.test(h)).length >= 2 && bullets(body).length >= 3 && numbered(body).length >= 3;`, fail: "Use at least two \"## \" sections, the benefits as bullets and the steps as a numbered list." },
            { label: "Closing call to action to download the template", check: String.raw`const body = doc.split(/^##\s+Editor/m)[0]; return /download/i.test(sentences(body).slice(-2).join(' ')) && /template/i.test(sentences(body).slice(-2).join(' ')) && sentences(body).slice(-2).some((s) => isAction(s));`, fail: "End the article with an instruction to download the free template." },
            { label: "Every draft error gone", check: String.raw`return !/busness|infact|loosing|can not|month's|todays|consulting offer\b|it is very important to note|basically|each and every|at this point in time|in order to/i.test(doc.split(/^##\s+Editor/m)[0]);`, fail: "Check for the draft's errors and wordy phrases: busness, Infact, loosing, can not, month's, \"Consulting offer\"…" },
            { label: "200–380 words, grade 9 or below, clean style", check: String.raw`const body = doc.split(/^##\s+Editor/m)[0]; const n = words(body); return n >= 200 && n <= 380 && grade(body) <= 9 && wordy(body).length === 0 && passive(body).length <= 1;`, fail: "Keep the article to 200 to 380 words at grade 9 or below, with a clean style report." },
            { label: "At least four editor's notes", check: "return bullets(section(\"Editor's notes\")).filter((b) => words(b) >= 6).length >= 4;", fail: "Explain your main changes to the client in at least four bullets." },
          ],
          solution: ARTICLE_DONE,
          hint: "Do the structure first on paper: survey finding, what a budget is, four benefits, four steps, call to action. Then write each part cleanly.",
          successMessage: "A client's rough draft turned into a publishable article, with notes that show exactly what you did and why. Portfolio piece.",
        },
      },
    ],

    task: {
      title: "Module 17 practical: an editing portfolio",
      intro: "Editing is a service clients pay for. Build evidence that you can do it.",
      prompts: [
        "Find three real pieces of writing that need editing (with the writers' permission): a business article, a website page and a report or proposal.",
        "Edit each through every level, using tracked changes or suggestion mode in Word or Google Docs.",
        "Write a style sheet for one of the clients and apply it consistently.",
        "Write editor's notes for each piece, and ask each writer for feedback on your edit.",
        "Present before-and-after pairs in your portfolio, with a one-line summary of what changed.",
      ],
      closing: "Module 18 covers the tools changing the industry: AI writing assistants, and how to use them without lowering your standards.",
    },

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
