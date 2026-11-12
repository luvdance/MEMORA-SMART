/**
 * CONTENT WRITING · MODULE 1 · INTRODUCTION TO WRITING AND COMMUNICATION
 *
 * Curriculum 1.0 – 1.11 and the practical 1.P. The welcome and the Writing
 * Desk; what writing is and why it matters at work; content writing,
 * copywriting and professional writing, and how they differ; the writing
 * process; the qualities of effective writing; audience and purpose; common
 * mistakes and myths; and the careers writing opens.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

import { CONTENT_WRITING_COURSE } from "../contentWritingCourse.js";

export const SECTION_ID = "cw-s1-intro";

const MODULES = CONTENT_WRITING_COURSE.months.flatMap((m) => m.modules);

/* ── Lesson 1 lab: the first draft on the Writing Desk ──────────────────── */
const INTRO_DOC = `# About me as a writer

## Who I am
[Two or three sentences about you: what you do now and where you are.]

## Why I am taking this course
[Three bullets. Start each line with "- ".]

## One piece of writing I want to be able to produce
[One sentence.]
`;

const INTRO_DONE = `# About me as a writer

## Who I am
I am Chioma, a final-year accounting student in Enugu. I run the Instagram page for my aunt's catering business. I write most of her posts, but I am never sure they are good.

## Why I am taking this course
- I want to write captions and posts that bring my aunt real orders
- I want my emails and CV to sound professional when I apply for jobs
- I want to earn money as a freelance content writer after graduation

## One piece of writing I want to be able to produce
A sales page that turns visitors into paying customers for a small business.
`;

/* ── Lesson 2 lab: one business, three disciplines ─────────────────────── */
const THREE_BRIEF = `**SunBox Solar** sells a portable solar lamp in Ibadan.

- Price: ₦18,500. Charges in 6 hours of sunlight and gives 12 hours of light.
- It has a USB port that can charge a phone.
- A new batch of 500 lamps arrives on Friday 14 March.
- Kemi Adeyemi is the sales manager. Musa Bello runs a shop in Oyo that stocks SunBox lamps.`;

const THREE_DOC = `# SunBox Solar: three kinds of writing

## Content
[Two to four sentences that inform or teach a reader something useful. No selling.]

## Copy
[Two to four sentences that persuade a buyer, ending with a call to action.]

## Professional
[A short email from Kemi to Musa about the new batch. Start with a greeting such as "Dear Musa," and end with a sign-off and Kemi's name.]
`;

const THREE_DONE = `# SunBox Solar: three kinds of writing

## Content
A solar lamp stores energy from the sun in a small battery during the day. Six hours in direct sunlight is usually enough for a full charge. Keep the panel clean and face it towards the sun, and the battery will last longer.

## Copy
When NEPA takes the light, your evening does not have to stop. SunBox gives you 12 hours of bright light from one day of sunshine, and it charges your phone too. Order yours today for ₦18,500.

## Professional
Dear Musa,

A new batch of 500 SunBox lamps arrives on Friday 14 March. Please tell me by Wednesday how many units you would like for your Oyo shop, so I can reserve them before they are allocated.

Kind regards,
Kemi Adeyemi
Sales Manager, SunBox Solar
`;

/* ── Lesson 3 lab: plan, then draft ────────────────────────────────────── */
const PLAN_BRIEF = `The community health centre in Ikeja is running a **free blood pressure check** for adults on Saturday 22 March, from 8am to 1pm, at the centre on Obafemi Awolowo Way. No appointment is needed. People should bring any medicines they already take. High blood pressure often has no symptoms, so many people do not know they have it.

The centre wants a short notice for its WhatsApp group of about 400 local residents, many of them older adults.`;

const PLAN_DOC = `# Free blood pressure check

## Audience
[Who will read this? Be specific.]

## Purpose
[Choose one word: inform, educate, persuade, instruct, request or entertain. Then explain in one sentence.]

## Key message
[One sentence a reader should remember.]

## Draft
[The WhatsApp notice: 50 to 120 words, in plain English.]
`;

const PLAN_DONE = `# Free blood pressure check

## Audience
Adults in the Ikeja community WhatsApp group, many of them older, who may not know they have high blood pressure.

## Purpose
Persuade: we want residents to come to the free check on Saturday.

## Key message
Come for a free blood pressure check this Saturday, because high blood pressure often has no symptoms.

## Draft
Free blood pressure check this Saturday

High blood pressure often has no signs, so many people have it and do not know. Find out for free this Saturday, 22 March, between 8am and 1pm at the Ikeja Community Health Centre on Obafemi Awolowo Way.

You do not need an appointment. Please bring any medicines you take now.

The check takes about ten minutes. Bring a parent or a neighbour too.
`;

/* ── Lesson 4 lab: the practical, classifying samples ──────────────────── */
const SAMPLES_BRIEF = `**Sample A.** "Tired of carrying cash? PayQuick lets you pay any shop in Nigeria with a scan. No charges on your first 50 payments. Download PayQuick today."

**Sample B.** "Dear Mrs Okafor, Further to our meeting on Tuesday, I attach the revised budget for the Abuja office move. The total is now ₦4.2 million. I would be grateful for your approval by Friday. Yours sincerely, Tunde Bakare."

**Sample C.** "How to store tomatoes so they last two weeks: keep them stem-side down, away from direct sunlight, and never in a sealed plastic bag. Here is why each step works."

**Sample D.** "Team, the office will close at 2pm on Friday for the fire safety drill. Please save your work and log out of all systems by 1:45pm. Thank you. HR."

**Sample E.** "Only 20 seats left! Join our 6-week data analysis bootcamp and land your first analyst job. Early-bird price ends Sunday. Reserve your seat now."`;

const SAMPLES_DOC = `# Writing samples: type, purpose and audience

Type must be exactly one of: Content, Copy, Professional.
Purpose must start with one of: inform, educate, persuade, instruct, request, entertain.

| Sample | Type | Purpose | Target audience | Evidence from the text |
|--------|------|---------|-----------------|------------------------|
| A |  |  |  |  |
| B |  |  |  |  |
| C |  |  |  |  |
| D |  |  |  |  |
| E |  |  |  |  |

## What I noticed
[Two or three sentences: what separates the three types?]
`;

const SAMPLES_DONE = `# Writing samples: type, purpose and audience

Type must be exactly one of: Content, Copy, Professional.
Purpose must start with one of: inform, educate, persuade, instruct, request, entertain.

| Sample | Type | Purpose | Target audience | Evidence from the text |
|--------|------|---------|-----------------|------------------------|
| A | Copy | Persuade people to download the app | Shoppers in Nigeria who carry cash | "Download PayQuick today" is a call to action, and the free offer is a reason to act |
| B | Professional | Request approval of the revised budget | Mrs Okafor, a manager who approves spending | Formal greeting and sign-off, a clear request with a deadline of Friday |
| C | Content | Educate readers about storing tomatoes | Home cooks and small food sellers | It teaches steps and explains why each one works, and it sells nothing |
| D | Professional | Instruct staff to log out before the drill | Office staff at the company | Internal notice from HR with an exact time and an instruction |
| E | Copy | Persuade people to reserve a bootcamp seat | Job seekers who want an analyst job | Scarcity ("only 20 seats"), a deadline and "Reserve your seat now" |

## What I noticed
Copy always asks the reader to act, and it gives reasons to act now. Content gives the reader something useful and asks for nothing in return. Professional writing gets work done between people, so it is direct, polite and specific about times and requests.
`;

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 1 · 1.0 · WELCOME
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "cw-l1-welcome",
    moduleId: "cw-m1-intro",
    sectionId: SECTION_ID,
    order: 1,
    covers: ["1.0"],
    title: "Welcome: What You Will Write",
    subtitle: "The destination, the road there, and the Writing Desk you will practise on",
    estimatedMinutes: 20,
    intro:
      "Every organisation depends on writing. A website brings customers. A social media post starts a conversation. An email gets a decision. A proposal wins the contract. This course teaches you to write all of it well enough to be paid for it. Start here with an overview of the whole course, then write your first draft.",

    atoms: [
      {
        id: "a-cw-welcome",
        title: "What you will be able to do",
        explain:
          "By the end of this course, you will be able to take a brief from a client or an employer. A brief is the set of instructions and facts for a piece of writing. You will turn that brief into writing that does its job. You will write clear, correct English. You will research and write articles that people read to the end and that search engines such as Google find. Writing so that search engines find your page is called SEO, which stands for search engine optimisation. You will write websites and social media content. You will write copy that persuades people to buy, sign up or act, without lying to them. Copy is writing that sells or persuades. You will write professional emails, proposals, reports and user guides. You will also learn to edit other people's writing, use AI tools without letting them lower your standards, and price and deliver writing work for clients. At the end, you will have a portfolio of ten pieces of writing for one business. A portfolio is a collection of your best work. It shows employers and clients exactly what you can do.",
        why: "Writing is one of the few skills every employer needs and few people do well. Clear writers are trusted with customers, money and decisions.",
      },
      {
        id: "a-cw-welcome-parts",
        title: "Six parts, twenty weeks",
        explain:
          "The course follows the order in which writing skill is built. First the foundations: grammar, style, tone and audience, without which nothing else works. Then content writing, which informs and educates. Then copywriting, which persuades. Then professional writing, which gets work done inside and between organisations. Then the quality layer: editing, proofreading and AI tools. Finally the career layer: freelancing and your portfolio.",
        table: {
          caption: "The six parts of the course.",
          headers: ["Part", "Focus", "Weeks"],
          rows: CONTENT_WRITING_COURSE.phases.map((ph) => [
            `Part ${ph.phase}`,
            ph.title.charAt(0).toUpperCase() + ph.title.slice(1),
            ph.weeks.length > 1 ? `${ph.weeks[0]}–${ph.weeks[ph.weeks.length - 1]}` : String(ph.weeks[0]),
          ]),
        },
      },
      {
        id: "a-cw-welcome-roadmap",
        title: "The whole road, module by module",
        explain:
          "Here is every module and the practical exercise that ends it. Each practical produces a real piece of writing you can keep. By Module 20, these pieces become your portfolio. In the capstone, which is the final project of the course, you write ten pieces for a single business. Keep every draft: the Writing Desk lets you copy or download each one.",
        table: {
          caption: "Every module and its practical exercise.",
          headers: ["Module", "Topic", "Practical"],
          rows: MODULES.map((m) => [m.title.split(" · ")[0], m.title.split(" · ")[1], m.project]),
        },
      },
      {
        id: "a-cw-welcome-desk",
        title: "Meet the Writing Desk",
        explain:
          "Every lesson ends with practice on the Writing Desk. It has four parts. The task and its checklist tell you exactly what the piece must do. The brief, when there is one, gives you the facts, as a client would. The editor is where you write. It starts with a template: a ready-made outline whose headings divide the piece into parts. Keep the headings and replace the lines in [square brackets] with your own writing. You use three marks to format the document. A line starting with \"## \" is a heading, a line starting with \"- \" is a bullet point, and a blank line starts a new paragraph. Press Preview to see the formatted result. Under the editor, a live bar counts your words and sentences. It also estimates how hard your writing is to read. This estimate is called the reading grade, and a lower grade means easier reading. Module 3 explains it properly. The Style report button lists what an editor would question, such as very long sentences. \"Check my writing\" then reads your draft against the checklist.",
        why: "The checks cannot judge whether your writing is beautiful. They check what a professional editor checks first: did you write every part of the brief, within the limits, clearly enough for the reader? A model answer appears after you try, so you can compare.",
        writingLab: {
          task:
            "Introduce yourself as a writer. Under \"Who I am\", write two or three sentences (at least 20 words). Under \"Why I am taking this course\", write three bullet points, each starting with \"- \". Under the last heading, name one piece of writing you want to be able to produce. Keep your sentences short: on average no more than 22 words.",
          doc: INTRO_DOC,
          tests: [
            { label: "\"Who I am\" has at least 20 words", check: "return words(section('Who I am')) >= 20;", fail: "Write two or three sentences under \"Who I am\", replacing the line in brackets." },
            { label: "Three bullet points under \"Why I am taking this course\"", check: "return bullets(section('Why I am')).filter((b) => words(b) >= 3).length >= 3;", fail: "Write three lines under that heading, each starting with a hyphen and a space: \"- \"." },
            { label: "One piece of writing named in the last part", check: "return words(section('One piece')) >= 4;", fail: "Name one piece of writing you want to produce, such as \"a sales page for a small business\"." },
            { label: "Sentences average 22 words or fewer", check: "return avgSentence(doc) > 0 && avgSentence(doc) <= 22;", fail: "Split your longest sentence into two. The bar under the editor shows your average." },
          ],
          solution: INTRO_DONE,
          hint: "Keep the three \"## \" headings exactly as they are and write under each one.",
          successMessage: "Your first draft on the Writing Desk. Keep it: it is the start of the \"About me\" page you will write for your portfolio in Module 20.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 2 · 1.1 – 1.6
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "cw-l2-disciplines",
    moduleId: "cw-m1-intro",
    sectionId: SECTION_ID,
    order: 2,
    covers: ["1.1", "1.2", "1.3", "1.4", "1.5", "1.6"],
    title: "Writing and Its Three Professions",
    subtitle: "What writing is, why workplaces depend on it, and content, copy and professional writing",
    estimatedMinutes: 30,
    intro:
      "Before you can write for money, you need to know what kind of writing you are being paid for. This lesson defines writing as communication, shows why it matters so much at work, and shows the difference between the three kinds of writing, or disciplines, that this course teaches.",

    atoms: [
      {
        id: "a-cw-what-is-writing",
        title: "What is writing?",
        explain:
          "Writing is communication that does not need the writer to be present. When you speak, you can watch the listener's face, repeat yourself and answer questions. When you write, the page must do all of that alone: the reader cannot ask what you meant. That is why good writing is less about fancy words and more about the reader. A useful definition for this course is: writing is the deliberate arrangement of words so that a specific reader understands, feels or does something specific. Every piece of professional writing has a reader, a purpose and a result it wants. The result might be that the reader knows how to store tomatoes, buys a solar lamp or approves a budget.",
        analogy: "Speaking is a conversation. Writing is like leaving instructions for someone you will never meet. That person reads them when you are not there to explain.",
      },
      {
        id: "a-cw-workplace",
        title: "Why effective writing matters at work",
        explain:
          "Most work today happens in writing: emails, chat messages on Slack, Teams or WhatsApp, reports, proposals, documentation, websites and social media. Remote work (working from home) and hybrid work (partly from home, partly in the office) have increased this. Many colleagues now meet each other mainly through text. Unclear writing has a real cost. A vague email produces three follow-up emails. A confusing instruction produces mistakes. A weak proposal loses a contract. A website that does not explain what a company does loses customers in seconds. Clear writing does the opposite: it saves time, prevents errors, builds trust and moves decisions forward. That is why employers repeatedly list written communication among the skills they want most, in every field, not only in writing jobs.",
        why: "Your writing is often the first and only impression a client, recruiter or manager has of you.",
        decision: {
          scenario:
            "A logistics company sent a message to 300 drivers: \"Kindly note that the new procedure regarding deliveries will commence shortly as discussed.\" Within an hour the office received 90 calls.",
          question: "What is the main problem with the message?",
          options: [
            { id: "a", text: "It does not say what the new procedure is or when it starts, so every driver had to ask", why: "Right. The reader cannot ask the page a question, so every missing fact becomes a phone call. Effective writing answers the reader's questions before they ask them." },
            { id: "b", text: "It is too short; it needed more formal language", whyWrong: "More formal words would not add the missing facts. The problem is missing information, not missing formality." },
            { id: "c", text: "It should have been sent by email instead of a message", whyWrong: "The channel was fine. Any channel would fail with a message that leaves out what and when." },
            { id: "d", text: "Drivers do not read messages", whyWrong: "They did read it, which is why they called. The message failed them." },
          ],
          correct: "a",
        },
      },
      {
        id: "a-cw-content-writing",
        title: "Understanding content writing",
        explain:
          "Content writing creates material that informs, educates or entertains an audience, usually to build trust and attention over time. Blog posts, articles, how-to guides, newsletters, social media posts, video scripts, website pages that explain things, case studies and e-books are all content. The reader chooses to read it because it is useful or interesting to them. A business publishes content so that people find it, often through search engines. Then people learn to trust it and remember it when they are ready to buy. Good content gives value first and asks for little or nothing in return. A content writer's core skills are research, structure, clarity and keeping a reader interested to the end.",
        example:
          "Content: \"How to choose the right solar lamp for a power cut: five things to check before you buy.\"",
      },
      {
        id: "a-cw-copywriting",
        title: "Understanding copywriting",
        explain:
          "Copywriting is writing that persuades a reader to take a specific action: buy, sign up, book, download, call, donate or vote. Advertisements, product descriptions, sales pages, landing pages (web pages made for one offer), promotional emails, slogans, flyers and the words on buttons are copy. The word \"copy\" comes from the newspaper trade, where it meant the text of an advertisement. Copy is measured by results: how many people clicked, signed up or bought. A copywriter needs four core skills. First, understand what the customer wants and fears. Second, turn features into benefits: say what the product does for the reader, not only what it has. Third, write headlines that make people stop and read. Fourth, ask clearly for the action. This request is called a call to action, and it usually starts with a verb such as \"Order\". Copy is usually short, so every word must do useful work.",
        example: "Copy: \"Power cut? Not tonight. 12 hours of light from one sunny day. Order your SunBox today.\"",
      },
      {
        id: "a-cw-professional-writing",
        title: "Understanding professional and business writing",
        explain:
          "Professional writing (also called business writing) is the writing that gets work done inside and between organisations. Examples are emails, letters, memos, notices, proposals, reports, minutes, policies, user guides and CVs. The reader usually has to read it to do their job. So they want it to be quick to read, accurate and easy to act on. Professional writing is judged by two questions. Does the reader understand it the first time? Can the reader then do what is needed, such as approve the budget, follow the procedure, attend the meeting or fix the problem? Its core skills are structure, precision, the right level of formality, and getting to the point.",
        example: "Professional: \"Dear Musa, 500 SunBox lamps arrive on Friday. Please confirm your order by Wednesday.\"",
        decision: {
          scenario: "A bank asks you for a page that explains how mortgages (bank loans to buy a house) work, with a button at the end that says \"Check what you can borrow\".",
          question: "How would you best describe the job?",
          options: [
            { id: "a", text: "Mainly content writing (it educates), finished with a small piece of copy (the call to action)", why: "Right. Most real pieces mix disciplines. Recognising which part does which job tells you how to write each part." },
            { id: "b", text: "Pure copywriting, because a bank is selling mortgages", whyWrong: "The page's main job is to explain. Writing it as a hard sell would lose the reader's trust." },
            { id: "c", text: "Professional writing, because banks are formal", whyWrong: "Professional writing gets work done between colleagues or partners. This page is for the public and teaches them." },
            { id: "d", text: "It does not matter which discipline it is", whyWrong: "It matters a lot: the purpose decides the tone, the structure and what success looks like." },
          ],
          correct: "a",
        },
      },
      {
        id: "a-cw-three-compared",
        title: "Differences and similarities between the three",
        explain:
          "The three disciplines differ mainly in purpose. Content informs and earns attention. Copy persuades and asks for action. Professional writing gets a task done. They also differ in how success is measured. Content is measured by the number of readers, the time they spend on the page and the trust it builds. Copy is measured by conversions: the number of readers who take the action, such as buying or signing up. Professional writing is measured by whether the right thing happens. Yet they share the same foundations: a clear reader, a clear purpose, correct grammar, a logical structure and plain words. Many real pieces mix the three. A product page informs (content) and sells (copy). A proposal is professional writing that must also persuade. That is why this course teaches all three: employers rarely hire a writer who can do only one.",
        table: {
          caption: "The three disciplines side by side.",
          headers: ["", "Content writing", "Copywriting", "Professional writing"],
          rows: [
            ["Main purpose", "Inform, educate, entertain", "Persuade to act", "Get work done"],
            ["Typical pieces", "Articles, blogs, guides, posts", "Ads, sales pages, product copy, promo emails", "Emails, memos, proposals, reports"],
            ["Reader's attitude", "Chooses to read", "Must be won over quickly", "Needs to read it for work"],
            ["Measured by", "Readers, engagement, trust, search traffic", "Clicks, sign-ups, sales", "Correct action, fewer questions"],
            ["Typical length", "Medium to long", "Short and tight", "As short as the task allows"],
          ],
        },
        writingLab: {
          task:
            "Use the SunBox Solar brief to write three short pieces about the same business. Content: two to four sentences that inform or teach, with no call to action. Copy: two to four sentences that persuade, talk to the reader as \"you\", and end with a call to action that starts with a verb such as \"Order\" or \"Buy\". Professional: a short email from Kemi to Musa about the new batch, with a greeting (\"Dear Musa,\"), a clear request and a sign-off with Kemi's name.",
          brief: THREE_BRIEF,
          doc: THREE_DOC,
          tests: [
            { label: "Content: at least 30 words that inform", check: "return words(section('Content')) >= 30;", fail: "Write two to four sentences under Content that teach something useful, such as how solar charging works." },
            { label: "Content does not sell (no price, no \"order\" or \"buy\")", check: String.raw`const c = section('Content') || ''; return !/₦|\b(order|buy|shop now|today only)\b/i.test(c);`, fail: "Content informs. Move the price and the call to action into the Copy section." },
            { label: "Copy speaks to the reader as \"you\" or \"your\"", check: "return you(section('Copy')) >= 2;", fail: "Copy talks to the reader. Use \"you\" and \"your\" at least twice." },
            { label: "Copy ends with a call to action that starts with a verb", check: "return isAction(lastSentence(section('Copy')));", fail: "Make the last sentence of the Copy an instruction that starts with a verb, such as \"Order yours today for ₦18,500.\"" },
            { label: "Professional: greeting, the date of the batch and a sign-off with Kemi's name", check: String.raw`const p = section('Professional') || ''; return /^Dear\s+Musa/im.test(p) && /14 March|Friday/i.test(p) && /(regards|sincerely|thank you|best wishes)[\s\S]*Kemi/i.test(p);`, fail: "Start with \"Dear Musa,\", mention the Friday 14 March batch, and end with a sign-off such as \"Kind regards,\" followed by Kemi's name." },
            { label: "Professional: makes a clear request", check: String.raw`return /\b(please|could you|would you|kindly let me know|let me know)\b/i.test(section('Professional') || '');`, fail: "Ask Musa to do something specific, such as \"Please tell me by Wednesday how many units you want.\"" },
          ],
          solution: THREE_DONE,
          hint: "Ask of each part: what should the reader do after reading? Learn something (content), act (copy) or reply with a decision (professional)?",
          successMessage: "One business, three jobs, three ways of writing. You will write every one of these forms at length later in the course.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 3 · 1.7 – 1.9
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "cw-l3-process",
    moduleId: "cw-m1-intro",
    sectionId: SECTION_ID,
    order: 3,
    covers: ["1.7", "1.8", "1.9"],
    title: "How Professionals Write",
    subtitle: "The writing process, the qualities of effective writing, and audience and purpose",
    estimatedMinutes: 30,
    intro:
      "Professional writers do not sit down and produce a perfect piece in one go. Before anything else, they decide who they are writing for and why. Then they follow a process, and they test their work against a set of qualities.",

    atoms: [
      {
        id: "a-cw-process",
        title: "The writing process: plan, draft, edit, publish",
        explain:
          "Writing well is a process of four stages. Planning: understand the brief (the instructions you are given for the piece), the reader and the purpose. Gather the facts. Then outline the main points: write a short list of them in the order you will cover them. Drafting: write the whole piece quickly from the outline. Do not stop to polish it (make small improvements). At this stage, a draft only has to exist. Editing: improve the draft in passes. A pass is one full reading with one focus. First check the big things: is everything there needed, and is it in the right order? Then check the sentences: are they clear, short and active (saying who does what)? Finally check the details: spelling, punctuation, facts, names and numbers. Publishing: format the piece for the place where it will appear. Check it one last time in that place. Then send or post it. Beginners try to do all four stages at once. That is why they often sit in front of a blank page and cannot start. Separating them makes writing faster and better.",
        table: {
          caption: "What happens at each stage, and the question it answers.",
          headers: ["Stage", "What you do", "Question it answers"],
          rows: [
            ["Plan", "Read the brief, define reader and purpose, research, outline", "What must this piece say, to whom, and why?"],
            ["Draft", "Write the whole thing from the outline, fast", "What does it look like on the page?"],
            ["Edit", "Big changes first, then sentences, then details", "Is it clear, correct and as short as it can be?"],
            ["Publish", "Format, final check in place, send or post", "Will it work where the reader meets it?"],
          ],
        },
        mistake: "Editing every sentence while drafting. You polish a paragraph that you later delete, and you lose the flow of your thinking. Draft first, edit after.",
      },
      {
        id: "a-cw-effective",
        title: "Characteristics of effective writing",
        explain:
          "Effective writing has seven qualities, often called the 7 Cs of communication. Clear: the reader understands it the first time. Concise: no unnecessary words. Concrete: specific facts, numbers and examples instead of vague claims (\"12 hours of light\", not \"long-lasting\"). Correct: accurate facts and correct grammar, spelling and punctuation. Coherent: ideas follow a logical order and connect to each other. Complete: it answers every question the reader needs answered, such as what, when, where, how much and what next. Courteous: it respects the reader, both in its tone and by not wasting their time. Use the seven qualities as an editing checklist: read your draft once for each quality.",
        samples: [
          { label: "Weak", tone: "bad", text: "We are pleased to inform you that our innovative product offers great benefits and will be available soon at an affordable price." },
          { label: "Effective", tone: "good", text: "The SunBox solar lamp gives 12 hours of light from 6 hours of sunshine. It costs ₦18,500 and arrives in shops on Friday 14 March." },
        ],
        decision: {
          scenario: "A notice says: \"The meeting has been moved. Please attend.\"",
          question: "Which of the 7 Cs does it fail most clearly?",
          options: [
            { id: "a", text: "Complete: it does not say when or where the meeting now is", why: "Right. The reader cannot act on it. Completeness means answering the reader's what, when, where and what next." },
            { id: "b", text: "Concise: it is too long", whyWrong: "It is very short. Being short is not the same as being concise when vital facts are missing." },
            { id: "c", text: "Courteous: it is rude", whyWrong: "It says \"please\". Its problem is missing information." },
            { id: "d", text: "Correct: it has grammar errors", whyWrong: "The grammar is fine." },
          ],
          correct: "a",
        },
      },
      {
        id: "a-cw-audience-purpose",
        title: "Audience and purpose",
        explain:
          "Every writing decision depends on two questions: who is reading, and what should happen after they read? The audience is the specific person or group you are writing for. Think about their age and job, what they already know and what they care about. Think also about how much time they have and where they will read (a phone on a bus, a laptop at a desk). The purpose is what you want them to know, feel or do. Common purposes are to inform, educate, persuade, instruct, request and entertain. Write both down before drafting, together with a key message: the one sentence the reader must remember if they forget everything else. For example, a notice for older residents on WhatsApp needs short sentences, clear facts that are easy to see, and no jargon (special words that only experts know). A report for a finance director needs the numbers first, and then a recommendation.",
        why: "A piece written for \"everyone\" is written for no one. The more precisely you picture the reader, the easier every word choice becomes.",
        writingLab: {
          task:
            "Plan, then draft. Using the brief, write four sections. Audience: describe the readers in at least 8 words, and be specific. Purpose: start with one of these words: inform, educate, persuade, instruct, request or entertain. Key message: write one sentence of 25 words or fewer. Draft: write a WhatsApp notice of 50 to 120 words in plain English. Keep it at reading grade 8 or below (a reading grade is a score for how easy text is to read; a lower number is easier). Do not write any sentence over 25 words. The notice must give the date, the time and the place, and say that no appointment is needed.",
          brief: PLAN_BRIEF,
          doc: PLAN_DOC,
          tests: [
            { label: "Audience: specific, at least 8 words", check: "return words(section('Audience')) >= 8;", fail: "Describe the readers: where they are, their age, and what they may not know." },
            { label: "Purpose starts with one of the six purpose words", check: String.raw`return /^(inform|educate|persuade|instruct|request|entertain)/i.test((section('Purpose') || '').trim());`, fail: "Begin the Purpose with one word from the list, for example \"Persuade: …\"." },
            { label: "Key message: one sentence of 25 words or fewer", check: "const k = section('Key message'); return sentences(k).length === 1 && words(k) >= 6 && words(k) <= 25;", fail: "Write a single sentence of up to 25 words that a reader should remember." },
            { label: "Draft: 50 to 120 words", check: "const d = words(section('Draft')); return d >= 50 && d <= 120;", fail: "The bar under the editor counts the words in the whole document. Count the words in the Draft section alone, and keep the Draft between 50 and 120 words." },
            { label: "Draft gives the date, the time, the place and \"no appointment\"", check: String.raw`const d = section('Draft') || ''; return /22 March|Saturday/i.test(d) && /8\s?(am|a\.m\.)/i.test(d) && /(Ikeja|Obafemi Awolowo)/i.test(d) && /appointment/i.test(d);`, fail: "Check the brief: a reader needs the day or date, the start time, the place and that no appointment is needed." },
            { label: "Draft is plain English: grade 8 or below, no sentence over 25 words", check: "const d = section('Draft'); return grade(d) <= 8 && longest(d) <= 25;", fail: "Use shorter sentences and everyday words. The audience includes older readers on phones." },
          ],
          solution: PLAN_DONE,
          hint: "Write the Key message first. Then build the Draft from that sentence, and add the facts a reader needs to act on it.",
          successMessage: "You planned before you drafted. The reader, the purpose and the key message guided every sentence of your notice.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 4 · 1.10 – 1.11 · PRACTICAL 1.P
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "cw-l4-careers",
    moduleId: "cw-m1-intro",
    sectionId: SECTION_ID,
    order: 4,
    covers: ["1.10", "1.11", "1.P"],
    title: "Mistakes, Myths and Writing Careers",
    subtitle: "What goes wrong, what people wrongly believe, and where writing can take you",
    estimatedMinutes: 30,
    intro:
      "Most bad writing fails in the same few ways. Most people who avoid writing believe the same few myths. This lesson explains both. It then shows the careers open to good writers. It ends with the practical task for this module.",

    atoms: [
      {
        id: "a-cw-mistakes",
        title: "Common writing mistakes and misconceptions",
        explain:
          "The most common mistakes are not grammar errors. Here are the eight most common mistakes. The writer does not know the reader or the purpose. The writer hides the main point at the end. The sentences are long and tangled. The words are vague instead of giving specific facts. The text uses jargon (special words of a trade) that the reader does not know. Information is missing: what, when, where or how much. There is no clear next step. The writer does not edit. The most common misconceptions (false beliefs) are equally harmful. \"Good writers are born, not made\": writing is a skill built by practice and feedback, like driving. \"Big words sound professional\": they slow readers down; plain words sound confident. \"Longer is better\": readers reward the shortest piece that does the job. \"Grammar tools will fix it\": they catch errors, but they cannot fix unclear thinking. \"AI will write it for me\": AI produces drafts. Your judgement, the facts and your voice (your own way of writing) are still your job (Module 18).",
        samples: [
          { label: "Sounds \"professional\", says little", tone: "bad", text: "In furtherance of our commitment to operational excellence, we wish to notify all stakeholders that the utilisation of the staff car park will be subject to temporary suspension." },
          { label: "Plain and complete", tone: "good", text: "The staff car park will be closed from Monday 3 to Friday 7 June for resurfacing. Please park at the church car park opposite the main gate." },
        ],
        decision: {
          scenario: "A new writer says: \"I use long words and long sentences so that my clients see I am educated.\"",
          question: "What is the best advice?",
          options: [
            { id: "a", text: "Plain words and short sentences read as confident and expert; long words make readers work harder and trust you less", why: "Right. Readers judge writing by how easily they understand it. Experts write clearly." },
            { id: "b", text: "Keep doing it for formal documents, but not for social media", whyWrong: "Even formal documents should use plain words. A report or proposal that is hard to read loses its reader too." },
            { id: "c", text: "Use even more technical terms to sound expert", whyWrong: "Jargon excludes readers who do not know it, and most readers do not." },
            { id: "d", text: "It does not matter as long as the grammar is correct", whyWrong: "Correct grammar in a confusing sentence is still confusing." },
          ],
          correct: "a",
        },
      },
      {
        id: "a-cw-careers",
        title: "Career opportunities in the writing industry",
        explain:
          "Good writers work in almost every sector, as employees or as freelancers (self-employed writers who work for several clients). Content writers and bloggers write articles, guides and web content for brands and publications. SEO (search engine optimisation) writers specialise in content that appears high in the results of search engines such as Google. Copywriters write ads, sales pages and campaigns. They work at agencies or in-house (inside one company). Email marketers and social media managers write the messages that keep customers coming back. Communications officers and PR (public relations) writers write press releases, newsletters and corporate communication. Technical writers write manuals, documentation and SOPs (standard operating procedures: step-by-step instructions for a task) for technology and industry. Proposal and grant writers win contracts and funding. UX (user experience) writers write the words inside apps and websites. Editors and proofreaders improve other people's writing. Ghostwriters write books, speeches and LinkedIn posts in someone else's name. Many writers combine several roles. Because of remote work, a writer in Lagos or Kano can serve clients anywhere.",
        table: {
          caption: "Writing roles and what each one produces.",
          headers: ["Role", "What they write", "Main discipline"],
          rows: [
            ["Content writer / blogger", "Articles, guides, web content", "Content"],
            ["SEO writer", "Search-optimised articles and pages", "Content"],
            ["Social media manager", "Posts, captions, calendars", "Content and copy"],
            ["Copywriter", "Ads, sales pages, product copy, slogans", "Copy"],
            ["Email marketer", "Campaigns, newsletters, sequences", "Copy and content"],
            ["UX writer", "Buttons, error messages, app text", "Copy and professional"],
            ["Communications / PR officer", "Press releases, newsletters, statements", "Professional and content"],
            ["Technical writer", "Manuals, documentation, SOPs", "Professional"],
            ["Proposal / grant writer", "Proposals, bids, grant applications", "Professional and copy"],
            ["Editor / proofreader", "Improves others' writing", "All three"],
          ],
        },
      },
      {
        id: "a-cw-m1-practical",
        title: "Practical: type, purpose and audience",
        explain:
          "Professional writers classify every piece before they write or edit it, because the type tells them the rules. Read the five samples in the brief. For each, decide its type (content, copy or professional), its purpose (use one of the six purpose words from Lesson 3), its target audience, and the evidence in the text that told you. Then write what you noticed about the difference between the three types. You will read a client's examples in exactly this way when the client says \"we want something like this\".",
        writingLab: {
          task:
            "Fill the table for samples A to E. Type must be exactly Content, Copy or Professional. Purpose must start with inform, educate, persuade, instruct, request or entertain. Give a target audience (at least 3 words) and evidence from the text (at least 6 words). Then, under \"What I noticed\", write at least 30 words on what separates the three types.",
          brief: SAMPLES_BRIEF,
          briefTitle: "The five samples",
          doc: SAMPLES_DOC,
          tests: [
            { label: "Five rows, each fully filled in", check: String.raw`const r = rows(doc).filter((c) => /^[A-E]$/i.test(c[0]) && /^(content|copy|professional)$/i.test(c[1] || '') && /^(inform|educate|persuade|instruct|request|entertain)/i.test(c[2] || '') && words(c[3]) >= 3 && words(c[4]) >= 6); return r.length === 5;`, fail: "Every row needs: a Type from the list, a Purpose starting with a purpose word, an audience of 3+ words and evidence of 6+ words." },
            { label: "Samples A and E are classified correctly", check: String.raw`const r = rows(doc); const t = (s) => (r.find((c) => c[0].toUpperCase() === s) || [])[1] || ''; return /^copy$/i.test(t('A')) && /^copy$/i.test(t('E'));`, fail: "Look at A and E again: both ask the reader to act and give reasons to act now." },
            { label: "Samples B and D are classified correctly", check: String.raw`const r = rows(doc); const t = (s) => (r.find((c) => c[0].toUpperCase() === s) || [])[1] || ''; return /^professional$/i.test(t('B')) && /^professional$/i.test(t('D'));`, fail: "B and D get work done between people in organisations: an approval and an instruction to staff." },
            { label: "Sample C is classified correctly", check: String.raw`const r = rows(doc); const c = r.find((x) => x[0].toUpperCase() === 'C') || []; return /^content$/i.test(c[1] || '') && /^(educate|inform|instruct)/i.test(c[2] || '');`, fail: "C teaches the reader something useful and sells nothing." },
            { label: "The purposes match the samples", check: String.raw`const r = rows(doc); const p = (s) => (r.find((c) => c[0].toUpperCase() === s) || [])[2] || ''; return /^persuade/i.test(p('A')) && /^request/i.test(p('B')) && /^(instruct|inform)/i.test(p('D')) && /^persuade/i.test(p('E'));`, fail: "A and E persuade. B asks for approval, so its purpose is to request. D tells staff what to do, so its purpose is to instruct." },
            { label: "\"What I noticed\": at least 30 words", check: "return words(section('What I noticed')) >= 30;", fail: "Write two or three sentences on what separates content, copy and professional writing." },
          ],
          solution: SAMPLES_DONE,
          hint: "For each sample ask: what does the writer want the reader to do next? Act now, learn something, or carry out a task?",
          successMessage: "You read five samples like a professional. For each one, you found the type, purpose, audience and evidence. This habit is the first step of every brief (a client's instructions for a piece of writing) you will ever take.",
        },
      },
    ],

    task: {
      title: "Module 1 practical: collect and classify real writing",
      intro: "Do this with real writing you meet this week, then keep your notes.",
      prompts: [
        "Collect ten real pieces of writing. You need: two adverts, two social media posts, two articles or blog posts, two emails or letters, one website homepage and one notice or memo.",
        "For each piece, write down four things: its type (content, copy or professional), its purpose, its target audience, and the words in the text that showed you this.",
        "Mark the piece you think works best and the piece that works worst. For each of these two pieces, write two sentences on why.",
        "Rewrite the worst piece in under 100 words. Write it for the same reader and the same purpose.",
        "Keep the collection. You will add to it throughout the course. It will become your swipe file: a collection of real examples that you keep and learn from.",
      ],
      closing: "Module 2 builds the foundation every one of those pieces depends on: grammar, vocabulary and sentence construction.",
    },

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
