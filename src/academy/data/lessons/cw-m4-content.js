/**
 * CONTENT WRITING · MODULE 4 · INTRODUCTION TO CONTENT WRITING
 *
 * Curriculum 4.1 – 4.12 and the practical 4.P. What content writing is, its
 * types, formats and platforms, informational, educational and entertaining
 * content, briefs, research, reliable sources, fact-checking, ideas,
 * outlines, introductions and conclusions, and long-form structure; then a
 * researched informative article.
 *
 * Sources in this module's briefs are invented for practice and say so; a
 * learner must never cite them as real.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

export const SECTION_ID = "cw-s4-content";

/* ── Lesson 12 lab: a content plan for one business ────────────────────── */
const PLAN_BRIEF = `**FitFuel** is a meal-prep delivery business in Abuja. It cooks healthy lunches for office workers and delivers them by 12 noon. Its customers are busy professionals aged 25 to 45 who want to eat better but have no time to cook. FitFuel is active on Instagram, has a blog on its website, and sends a weekly email newsletter.`;

const PLAN_DOC = `# FitFuel content ideas

Purpose must be exactly one of: Informational, Educational, Entertaining.

| Working title | Format | Platform | Purpose | What the reader gains |
|---------------|--------|----------|---------|-----------------------|
|  |  |  |  |  |
`;

const PLAN_DONE = `# FitFuel content ideas

Purpose must be exactly one of: Informational, Educational, Entertaining.

| Working title | Format | Platform | Purpose | What the reader gains |
|---------------|--------|----------|---------|-----------------------|
| How to build a balanced lunch plate in five minutes | How-to guide | Blog | Educational | A simple method to eat better at work without counting calories |
| Our new delivery areas: Gwarinpa and Lugbe from 1 May | News update | Email newsletter | Informational | Whether FitFuel now delivers to their office and from when |
| Things only Abuja office workers understand about lunch break | Carousel | Instagram | Entertaining | A laugh about a shared experience, and a reason to follow the page |
| Is jollof rice healthy? What a dietitian says | Article | Blog | Educational | Honest facts about a favourite meal and how to make it lighter |
`;

/* ── Lesson 13 lab: fact-checking a draft ──────────────────────────────── */
const FACT_BRIEF = `**Research notes from the client.** These sources are invented for this exercise.

- **Source 1, Nigerian Savings Survey 2025 (practice source):** 62% of working adults in the survey saved money in at least one month of 2025. 38% used a mobile app to save. Women were slightly more likely to save than men (64% versus 60%).
- **Source 2, Kora app internal data, January 2026 (practice source):** Kora has 210,000 active users. The average user saves ₦18,000 a month.
- **Source 3, a Facebook post shared 40,000 times:** "9 out of 10 Nigerians have no savings at all."

**The draft paragraph to check:**

> (A) Saving is more common than many people think: 62% of working adults saved in at least one month of 2025. (B) Most savers now use mobile apps. (C) Men are more likely to save than women. (D) Kora alone has over 200,000 active users, (E) and 90% of Nigerians have no savings at all.`;

const FACT_DOC = `# Fact-check

Verdict must be exactly one of: Accurate, Inaccurate, Unsupported.

| Claim | Verdict | Source checked | Correction or note |
|-------|---------|----------------|--------------------|
| A |  |  |  |
| B |  |  |  |
| C |  |  |  |
| D |  |  |  |
| E |  |  |  |

## Corrected paragraph
[Rewrite the paragraph so every claim is accurate and supported.]
`;

const FACT_DONE = `# Fact-check

Verdict must be exactly one of: Accurate, Inaccurate, Unsupported.

| Claim | Verdict | Source checked | Correction or note |
|-------|---------|----------------|--------------------|
| A | Accurate | Source 1 | Matches the survey figure exactly |
| B | Inaccurate | Source 1 | Only 38% used an app, which is not most savers or most adults |
| C | Inaccurate | Source 1 | It is the other way round: 64% of women and 60% of men saved |
| D | Accurate | Source 2 | 210,000 active users is over 200,000; it is the company's own data, so say so |
| E | Unsupported | Source 3 | A viral post is not evidence and it contradicts the survey; remove it |

## Corrected paragraph
Saving is more common than many people think: 62% of working adults saved in at least one month of 2025, according to the Nigerian Savings Survey. More than a third of them, 38%, used a mobile app to do it. Women were slightly more likely to save than men. Kora says it alone has over 200,000 active users.
`;

/* ── Lesson 14 lab: outline, introduction and conclusion ──────────────── */
const OUTLINE_BRIEF = `**Content brief from the editor of a careers blog**

- Working title: How to prepare for your first job interview
- Audience: final-year students and recent graduates in Nigeria applying for their first full-time job
- Purpose: educate; the reader should finish knowing exactly what to do in the week before an interview
- Length: about 1,200 words
- Must cover: researching the company, preparing answers with examples, practical preparation (documents, clothes, travel), questions to ask the interviewer, and following up
- Tone: encouraging, practical, never patronising`;

const OUTLINE_DOC = `# How to prepare for your first job interview

## Outline
[At least five "- " points in a logical order, one for each section of the article.]

## Introduction
[The opening of the article: 60 to 120 words. Start with a hook, show the reader's problem, and promise what the article will give them.]

## Conclusion
[The closing: 40 to 100 words. Sum up and tell the reader one thing to do next.]
`;

const OUTLINE_DONE = `# How to prepare for your first job interview

## Outline
- Research the company: what it does, its customers and its recent news
- Prepare your answers: the five questions almost every interviewer asks, each with an example
- Get the practical details right: documents, clothes, route and timing
- Prepare two or three questions to ask the interviewer
- After the interview: a short thank-you email and how to follow up

## Introduction
You have spent four years earning your degree, and now thirty minutes in a room will decide whether you get the job. That is why so many graduates walk into their first interview nervous and leave thinking of everything they should have said. The good news is that most interview success is decided before you arrive. This guide walks you through the week before your interview, step by step, so you walk in prepared, calm and ready to show what you can do.

## Conclusion
Interviews reward preparation more than talent. If you research the company, practise your examples, settle the practical details and prepare your own questions, you will already be ahead of most candidates. Start today: write down three achievements you are proud of and the story behind each one.
`;

/* ── Lesson 15 lab: the practical article ──────────────────────────────── */
const ARTICLE_BRIEF = `**Brief:** an informative article for the blog of **Harvest Hub**, a farm-produce marketplace in Kaduna. Audience: households and small traders who buy beans, maize and rice in bulk. Purpose: inform and educate; readers should be able to store grain without losing it to weevils and mould. Length: 450 to 800 words.

**Research notes.** These sources are invented for this exercise; cite them by these names.

- **Grain Storage Handbook (practice source), https://example.org/grain-handbook:** grain must be dry before storage; moisture above about 13% encourages mould. Store in a cool, dry, shaded place, off the floor on pallets.
- **Farmers' Extension Bulletin No. 12 (practice source), https://example.org/bulletin-12:** airtight (hermetic) bags or containers starve insects of oxygen, so weevils die without chemicals. Triple-layer hermetic bags are sold in many markets.
- **Kitchen Science Guide (practice source), https://example.org/kitchen-science:** freezing small quantities of beans for three to four days kills weevil eggs. Let them return to room temperature in a closed container before opening, to avoid condensation.
- **Harvest Hub customer survey (practice source):** in a survey of 120 customers, 7 in 10 had lost stored beans to weevils in the past year.`;

const ARTICLE_DOC = `# [Your headline]

[Introduction: hook, problem and promise.]

## [First section heading]

## [Second section heading]

## [Third section heading]

## Conclusion

## Sources
[At least three sources as Markdown links: - [Name](https://...)]
`;

const ARTICLE_DONE = `# How to Store Beans, Maize and Rice Without Losing Them to Weevils

You buy a bag of beans at a good price, and two months later you open it to find holes, dust and tiny black insects. In a survey of 120 Harvest Hub customers, 7 in 10 had lost stored beans to weevils in the past year. Most of that loss can be prevented with three simple habits: dry it, seal it and store it in the right place. This guide explains each one.

## Dry your grain before you store it

Moisture is the starting point for most storage losses. According to the Grain Storage Handbook, grain that holds more than about 13% moisture encourages mould, which spoils the grain and can make it unsafe to eat. Damp grain also gives insects a comfortable place to breed.

You do not need a meter to start. Spread grain in a thin layer on a clean tarpaulin in the sun for a day or two, turning it a few times. A simple test for beans is to bite one: if it cracks cleanly, it is dry; if it squashes, it needs more drying. Never store grain that feels cool and soft.

## Seal it so insects cannot breathe

Weevils need oxygen, just like us. The Farmers' Extension Bulletin explains that airtight, or hermetic, storage starves insects of oxygen, so they die without any chemicals. This is why triple-layer hermetic bags, now sold in many markets, work so well. Fill the inner bag, squeeze out as much air as you can, twist and tie each layer separately, and keep the bag closed.

At home, food-grade plastic containers or glass jars with tight lids do the same job for smaller amounts. Old paint buckets are not safe for food. If you buy beans that may already carry eggs, freeze small quantities for three to four days to kill them, as the Kitchen Science Guide recommends. Let the beans warm up in a closed container before you open it, so water does not form on them.

## Store it in the right place

Even dry, sealed grain spoils faster in heat. Choose a cool, shaded room away from the kitchen fire and direct sunlight. Keep bags and containers off the floor, on wooden pallets or a raised shelf, so damp from the ground cannot reach them and air can move underneath. Check your store every two weeks: look for holes in bags, dust, insects or a musty smell, and deal with any problem bag at once before it spreads.

Label each container with the date you stored it, and use the oldest grain first. Traders often call this "first in, first out", and it means nothing sits forgotten at the back of the store for a year.

## Conclusion

Losing grain to weevils is common, but it is not bad luck. Dry your grain until it cracks cleanly, seal it in hermetic bags or airtight containers, and keep it cool, off the floor and checked every two weeks. Start with the next bag you buy: dry it, seal it and date it, and see the difference in three months.

## Sources
- [Grain Storage Handbook (practice source)](https://example.org/grain-handbook)
- [Farmers' Extension Bulletin No. 12 (practice source)](https://example.org/bulletin-12)
- [Kitchen Science Guide (practice source)](https://example.org/kitchen-science)
`;

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 12 · 4.1 – 4.4
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "cw-l12-content",
    moduleId: "cw-m4-content",
    sectionId: SECTION_ID,
    order: 1,
    covers: ["4.1", "4.2", "4.3", "4.4"],
    title: "What Content Writing Is",
    subtitle: "Types, formats and platforms, and content that informs, educates or entertains",
    estimatedMinutes: 30,
    intro:
      "Part Two is about content writing: the writing people choose to read. This lesson maps the field: the kinds of content, the formats and platforms they live on, and the three jobs content does.",

    atoms: [
      {
        id: "a-cw-content-defined",
        title: "What is content writing?",
        explain:
          "Content writing is planning, researching and writing material that gives a specific audience something of value (information, a skill, an answer, entertainment) so that they trust and remember the organisation that published it. It differs from copywriting in its timing and its ask: content earns attention over months and asks for little, while copy asks for an action now. A content writer's job includes more than writing: understanding the brief and audience, researching, checking facts, structuring the piece, writing in the brand's voice, optimising it to be found (Module 6), and often formatting and publishing it. Businesses pay for content because it brings visitors from search engines and social media, answers customers' questions before they ask, builds authority, and nurtures people who are not ready to buy yet.",
        why: "Most buying journeys now start with a search or a scroll. The business that answers the question is the business the customer remembers.",
      },
      {
        id: "a-cw-content-types",
        title: "Types of content writing",
        explain:
          "The main types are: blog posts and articles (Module 5); SEO content written to rank for searches (Module 6); website content such as About and service pages (Module 7); social media content (Module 7); email newsletters (Module 12); how-to guides and tutorials; case studies, which tell how a real customer solved a problem; white papers and reports, long authoritative documents for professional readers; e-books and lead magnets, offered free in exchange for an email address; scripts for video and podcasts; press releases and news; product guides and FAQs; and user-generated content curation. Each type has its own conventions for length, structure and tone, which this course teaches one by one.",
        table: {
          caption: "Common content types and what they do.",
          headers: ["Type", "Typical length", "Main job"],
          rows: [
            ["Blog post", "600–2,000 words", "Answer a question, share expertise, attract search traffic"],
            ["How-to guide", "800–2,500 words", "Teach a task step by step"],
            ["Case study", "500–1,500 words", "Prove results with a real customer story"],
            ["White paper", "2,500–6,000 words", "Build authority with professional readers"],
            ["Newsletter", "200–800 words", "Keep subscribers informed and engaged"],
            ["Social post", "1–300 words", "Start conversations, reach new people"],
            ["Video script", "150 words per minute of video", "Inform or entertain on video platforms"],
          ],
        },
      },
      {
        id: "a-cw-formats-platforms",
        title: "Understanding content formats and platforms",
        explain:
          "A format is the shape content takes: long article, short post, list, carousel (a set of slides on Instagram or LinkedIn), infographic, video script, podcast, thread, newsletter, e-book or checklist. A platform is where it is published and read: a website or blog, Google search, Instagram, Facebook, LinkedIn, X, TikTok, YouTube, WhatsApp channels, email inboxes, Medium or Substack. The platform shapes the format: LinkedIn rewards professional insight, Instagram rewards visual carousels and short captions, a blog rewards depth and search value, an email rewards a single clear idea. Before writing, confirm both: the same idea written as a 1,500-word blog post and as a 7-slide carousel are two different pieces of writing.",
        decision: {
          scenario: "A dentist wants to teach parents how to brush toddlers' teeth. Her audience is mothers aged 25 to 35 who follow her on Instagram.",
          question: "Which format and platform fit best?",
          options: [
            { id: "a", text: "A short step-by-step carousel on Instagram, with a caption that links to a longer guide on her website", why: "Right. Meet the audience where they already are, in the format that platform rewards, and offer depth for those who want it." },
            { id: "b", text: "A 5,000-word white paper sent by post", whyWrong: "Far too long and formal for busy parents, and the wrong channel." },
            { id: "c", text: "A LinkedIn article for other dentists", whyWrong: "That reaches professionals, not the parents she wants to teach." },
            { id: "d", text: "A press release", whyWrong: "Press releases announce news to journalists; they do not teach parents." },
          ],
          correct: "a",
        },
      },
      {
        id: "a-cw-content-purposes",
        title: "Informational, educational and entertaining content",
        explain:
          "Content does one of three main jobs, sometimes more than one. Informational content tells readers what is happening or what is true: news, updates, announcements, explanations of a policy, product information, research results. Educational content teaches readers how to do something or understand something: how-to guides, tutorials, explainers, checklists, courses. Entertaining content gives enjoyment: stories, humour, quizzes, behind-the-scenes posts, relatable memes, challenges. A good content plan mixes all three: education builds authority, information keeps people up to date, and entertainment builds affection and reach. Each piece should still have one main job, because a piece that tries to do everything does nothing well.",
        writingLab: {
          task:
            "Plan four content pieces for FitFuel. For each row give a working title (at least 5 words), a format, a platform FitFuel actually uses (Instagram, Blog or Email newsletter), a purpose (exactly Informational, Educational or Entertaining) and what the reader gains (at least 6 words). Use each of the three purposes at least once.",
          brief: PLAN_BRIEF,
          doc: PLAN_DOC,
          tests: [
            { label: "At least four complete rows", check: String.raw`return rows(doc).filter((c) => words(c[0]) >= 5 && words(c[1]) >= 1 && words(c[2]) >= 1 && /^(informational|educational|entertaining)$/i.test(c[3] || '') && words(c[4]) >= 6).length >= 4;`, fail: "Fill every column for four rows. The purpose must be exactly Informational, Educational or Entertaining." },
            { label: "All three purposes are used", check: String.raw`const p = rows(doc).map((c) => (c[3] || '').toLowerCase()); return ['informational', 'educational', 'entertaining'].every((x) => p.includes(x));`, fail: "A balanced plan mixes all three jobs. Add an Informational, Educational or Entertaining piece." },
            { label: "Only FitFuel's platforms (Instagram, Blog, Email newsletter)", check: String.raw`const r = rows(doc).filter((c) => words(c[0]) >= 1); return r.length >= 4 && r.every((c) => /instagram|blog|email|newsletter/i.test(c[2] || ''));`, fail: "Use the platforms in the brief. A plan for a platform the client is not on cannot be published." },
          ],
          solution: PLAN_DONE,
          hint: "Start from the customer: what does a busy office worker in Abuja want to know, learn or laugh about at lunchtime?",
          successMessage: "A small, balanced content plan, tied to the client's real platforms and the reader's real needs.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 13 · 4.5 – 4.8
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "cw-l13-research",
    moduleId: "cw-m4-content",
    sectionId: SECTION_ID,
    order: 2,
    covers: ["4.5", "4.6", "4.7", "4.8"],
    title: "Briefs, Research and Facts",
    subtitle: "Reading a content brief, researching, judging sources and checking every claim",
    estimatedMinutes: 40,
    intro:
      "Readers trust content because they assume someone checked it. This lesson makes you the person who did: you will read a brief properly, research before you write, judge whether a source deserves trust, and verify every claim.",

    atoms: [
      {
        id: "a-cw-content-briefs",
        title: "Understanding content briefs",
        explain:
          "A content brief is the instruction a client or editor gives for one piece. A good brief contains: the working title or topic; the audience; the purpose and the action the reader should take; the main points or questions to cover; the target keyword, if it is for search (Module 6); length; tone and voice; format; deadline; sources to use or avoid; examples the client likes; and how the piece will be published. Read the brief twice before writing. Then write back to confirm anything missing or unclear, especially the audience, purpose and length. A ten-minute question at the start saves a full rewrite at the end. When there is no brief, write one yourself and get it approved: it protects you if the client later says \"that's not what I wanted\".",
        mistake: "Starting to write from a one-line request such as \"write something about our new product\". Ask who it is for, where it will appear, how long it should be and what the reader should do next.",
      },
      {
        id: "a-cw-research",
        title: "Researching topics before writing",
        explain:
          "Research before writing, not during: it gives you material to shape and stops you inventing. Start with what the client provides (product information, data, interviews with their staff), then search widely: what do the top articles on this topic already say, and what do they miss? Read primary sources where possible: the original study, the official statistics, the law itself, rather than someone's summary of it. Talk to people: an expert quote or a customer story makes content original. Keep research notes with every fact and exactly where it came from (title, author or organisation, date, link), so you can cite and re-check it. Set a time limit: research for a 1,000-word article usually takes one to three hours. Stop when new sources only repeat what you already have.",
      },
      {
        id: "a-cw-sources",
        title: "Identifying reliable sources",
        explain:
          "Judge every source with five questions, known as the CRAAP test. Currency: is it recent enough for the topic? Relevance: does it actually address your question and audience? Authority: who wrote it, and are they qualified (a government statistics office, a university, a professional body, a named expert)? Accuracy: is it supported by evidence, and do other reliable sources agree? Purpose: why does it exist: to inform, or to sell, persuade or provoke? Generally reliable: official statistics (such as the National Bureau of Statistics), peer-reviewed research, recognised international organisations, established news organisations with corrections policies, and primary documents. Use with care: company data (accurate about itself, biased about competitors), Wikipedia (a starting point for finding sources, not a source to cite), and blogs. Not evidence: viral social media posts, forwarded WhatsApp messages, anonymous websites and AI chatbot answers without a verified source.",
        table: {
          caption: "The CRAAP test for sources.",
          headers: ["Question", "Ask yourself", "Warning sign"],
          rows: [
            ["Currency", "When was it published or updated?", "Old data on a fast-changing topic"],
            ["Relevance", "Does it answer my question for my audience?", "Different country, population or product"],
            ["Authority", "Who wrote it and are they qualified?", "No author, no organisation, no credentials"],
            ["Accuracy", "Is there evidence? Do others agree?", "No sources, emotional language, numbers that do not add up"],
            ["Purpose", "Why does it exist?", "Selling something, or written to provoke shares"],
          ],
        },
        decision: {
          scenario: "You need a figure for Nigeria's inflation rate for an article.",
          question: "Which source should you cite?",
          options: [
            { id: "a", text: "The latest consumer price index report from the National Bureau of Statistics, with its date", why: "Right. The official primary source, dated, so readers know exactly which month the figure describes." },
            { id: "b", text: "A screenshot of a figure shared on X", whyWrong: "You cannot verify where it came from or which month it describes." },
            { id: "c", text: "An AI chatbot's answer", whyWrong: "Chatbots can produce out-of-date or invented numbers. Find the original report." },
            { id: "d", text: "A blog post from 2019", whyWrong: "Inflation changes every month; a 2019 figure fails the currency test." },
          ],
          correct: "a",
        },
      },
      {
        id: "a-cw-fact-checking",
        title: "Fact-checking and information verification",
        explain:
          "Fact-checking means checking every factual claim in a draft against a reliable source before it is published, including your own claims. Check: names and titles (spelling and current role), numbers and statistics (exact figure, unit, date and what it measures), dates, quotations (exact words, said by that person), and cause-and-effect claims (does the source really say A caused B, or only that they happened together?). Watch for three common distortions: rounding up (38% becomes \"most\"), reversing a finding (women saved more becomes men saved more), and quoting a viral claim as fact. For each claim decide: accurate (matches a reliable source), inaccurate (a source says otherwise; correct it), or unsupported (no reliable source; remove it or find one). A professional writer never publishes a number they cannot trace.",
        writingLab: {
          task:
            "Fact-check the five claims (A to E) in the draft paragraph against the client's research notes. For each, give a verdict (exactly Accurate, Inaccurate or Unsupported), the source you checked, and a correction or note of at least 5 words. Then rewrite the paragraph under \"Corrected paragraph\" so every claim is accurate and supported: keep the true claims, correct the wrong ones, and remove the unsupported one.",
          brief: FACT_BRIEF,
          doc: FACT_DOC,
          tests: [
            { label: "Five rows with a verdict, a source and a note", check: String.raw`return rows(doc).filter((c) => /^[A-E]$/.test(c[0]) && /^(accurate|inaccurate|unsupported)$/i.test(c[1] || '') && words(c[2]) >= 1 && words(c[3]) >= 5).length === 5;`, fail: "Every claim needs a verdict from the list, the source you checked and a note of five words or more." },
            { label: "A and D are accurate", check: String.raw`const r = rows(doc); const v = (k) => ((r.find((c) => c[0] === k) || [])[1] || '').toLowerCase(); return v('A') === 'accurate' && v('D') === 'accurate';`, fail: "Check A and D against Sources 1 and 2: both match." },
            { label: "B and C are inaccurate", check: String.raw`const r = rows(doc); const v = (k) => ((r.find((c) => c[0] === k) || [])[1] || '').toLowerCase(); return v('B') === 'inaccurate' && v('C') === 'inaccurate';`, fail: "Compare B with the 38% figure, and C with the 64% and 60% figures." },
            { label: "E is unsupported", check: String.raw`const r = rows(doc); return ((r.find((c) => c[0] === 'E') || [])[1] || '').toLowerCase() === 'unsupported';`, fail: "A viral post is not evidence. What does a reliable source say?" },
            { label: "Corrected paragraph keeps 62% and 38%, fixes the gender claim, drops the viral claim", check: String.raw`const p = section('Corrected paragraph') || ''; return /62%/.test(p) && /38%/.test(p) && /women[^.]*more likely[^.]*than men/i.test(p) && !/90%|9 out of 10|no savings at all/i.test(p) && !/most savers/i.test(p);`, fail: "Keep the accurate figures, write that women were more likely to save than men, and delete the 90% claim." },
          ],
          solution: FACT_DONE,
          hint: "Read each claim word by word: \"most\", \"more likely\" and \"over\" are claims too.",
          successMessage: "Two errors and a viral myth stopped before publication. That is what fact-checking is for.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 14 · 4.9 – 4.12
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "cw-l14-structure",
    moduleId: "cw-m4-content",
    sectionId: SECTION_ID,
    order: 3,
    covers: ["4.9", "4.10", "4.11", "4.12"],
    title: "Ideas, Outlines and Structure",
    subtitle: "Finding ideas, outlining, opening and closing, and structuring long-form content",
    estimatedMinutes: 40,
    intro:
      "Structure is what makes long content readable. This lesson covers where good ideas come from, how to outline before you draft, how to open and close, and how long-form content is organised.",

    atoms: [
      {
        id: "a-cw-content-ideas",
        title: "Developing content ideas",
        explain:
          "The best content ideas come from the audience's real questions, not from what the business wants to say. Sources of ideas: questions customers ask sales and support staff; comments and messages on social media; reviews of the business and its competitors; Google's \"People also ask\" box and autocomplete suggestions; forums and groups where the audience talks (Nairaland, Reddit, Facebook groups); keyword tools (Module 6); news and seasonal events (school resumption, Ramadan, Christmas, budget season); and the business's own data and expertise. Test each idea with three questions: does our audience care about this? Can we say something more useful than what already exists? Does it connect to what the business offers? Turn a topic into an angle: \"savings\" is a topic; \"how to save ₦100,000 in six months on a ₦150,000 salary\" is an angle a reader can picture.",
      },
      {
        id: "a-cw-outlines",
        title: "Creating outlines and content structures",
        explain:
          "An outline is the plan of a piece: its main sections in order, with the key point and evidence for each. Outlining before drafting is the single habit that most improves long content, because it lets you fix the structure while it is cheap to change. A simple outline has: a working headline, the introduction's angle, three to seven main sections (each a heading and one sentence saying what it proves or teaches), and the conclusion's takeaway. Common structures: chronological (steps in order, for how-tos), problem–solution, list (a set of tips or examples), question–answer (FAQs), comparison (option A versus option B) and the inverted pyramid (most important facts first, for news). Send the outline to the client before drafting a long piece; agreeing the structure first prevents most rewrites.",
        decision: {
          scenario: "You are writing \"How to register a business name with the CAC\".",
          question: "Which structure fits best?",
          options: [
            { id: "a", text: "Chronological: the steps in the order the reader will do them", why: "Right. A process article follows the reader's sequence, so they can do each step as they read." },
            { id: "b", text: "Comparison of CAC with registries in other countries", whyWrong: "Interesting, but it does not help the reader register." },
            { id: "c", text: "Inverted pyramid, like breaking news", whyWrong: "That suits news, not a process." },
            { id: "d", text: "No structure: write freely", whyWrong: "Readers following a process need clear, ordered steps." },
          ],
          correct: "a",
        },
      },
      {
        id: "a-cw-intros-conclusions",
        title: "Writing engaging introductions and conclusions",
        explain:
          "An introduction has one job: make the right reader decide to keep reading. Most readers decide within the first two or three sentences. A strong introduction has three moves. The hook: a specific scene, a surprising fact, a question or a bold statement that makes the reader feel \"this is about me\". The problem: name the reader's difficulty or need precisely. The promise: tell them what the piece will give them. Keep it short (50 to 150 words for most articles) and cut warm-up sentences such as \"In today's world…\" or \"Since time immemorial…\". A conclusion is not a repeat of everything. It sums up the main idea in a sentence or two, and gives the reader one clear next step: something to do, try, decide or read. End on the action, not on a cliché such as \"In conclusion, interviews are very important.\"",
        samples: [
          { label: "Weak introduction", tone: "bad", text: "In today's competitive world, job interviews are very important. Many people attend interviews every year. This article will discuss interviews." },
          { label: "Strong introduction", tone: "good", text: "You have spent four years earning your degree, and now thirty minutes in a room will decide whether you get the job. Most interview success is decided before you arrive. This guide walks you through the week before your interview, step by step." },
        ],
      },
      {
        id: "a-cw-long-form",
        title: "Structuring articles and long-form content",
        explain:
          "Long-form content (usually 1,200 words or more) must be easy to navigate, because most readers scan before they read. Use a clear headline; a short introduction; descriptive subheadings every 200 to 300 words that tell the reader what each section gives them (\"Seal it so insects cannot breathe\", not \"Part 2\"); short paragraphs of two to four sentences; bullet or numbered lists for steps and sets of items; examples, numbers and quotes to support each point; and a conclusion with a next step. Put the most useful information early in each section. For very long pieces add a summary at the top or a table of contents. Read the headings alone, top to bottom: if they tell the story of the article, the structure works.",
        writingLab: {
          task:
            "Using the careers blog's brief, write: an outline of at least five points in a logical order that covers all five required topics (company research, answers with examples, practical preparation, questions to ask, follow-up); an introduction of 60 to 120 words with a hook, the reader's problem and a promise, without warm-up clichés (\"In today's\", \"Since time immemorial\", \"This article will discuss\"); and a conclusion of 40 to 100 words that ends with one action the reader should take, starting with a verb.",
          brief: OUTLINE_BRIEF,
          doc: OUTLINE_DOC,
          tests: [
            { label: "Outline: at least five points", check: "return bullets(section('Outline')).filter((b) => words(b) >= 4).length >= 5;", fail: "Write five or more \"- \" points, one per section of the article." },
            { label: "Outline covers all five required topics", check: String.raw`const o = section('Outline') || ''; return /research/i.test(o) && /(answer|example)/i.test(o) && /(document|clothes|dress|travel|route|practical)/i.test(o) && /question/i.test(o) && /follow/i.test(o);`, fail: "Check the brief's \"Must cover\" list: research, answers with examples, practical preparation, questions to ask, following up." },
            { label: "Introduction: 60 to 120 words, no warm-up clichés", check: String.raw`const i = section('Introduction') || ''; return words(i) >= 60 && words(i) <= 120 && !/in today'?s|since time immemorial|this article will discuss|in this article,? we will/i.test(i);`, fail: "Open with a hook about the reader, not a warm-up. Keep it between 60 and 120 words." },
            { label: "Introduction speaks to the reader", check: "return you(section('Introduction')) >= 2;", fail: "Talk to the reader as \"you\": it is their interview." },
            { label: "Conclusion: 40 to 100 words, ending with a verb-first action", check: "const c = section('Conclusion'); return words(c) >= 40 && words(c) <= 100 && sentences(c).some((s) => isAction(s.replace(/^[A-Za-z ]+:\\s*/, '')));", fail: "Sum up in a sentence or two, then tell the reader one thing to do, starting with a verb." },
          ],
          solution: OUTLINE_DONE,
          hint: "Write the outline first. The introduction then promises what the outline delivers, and the conclusion tells the reader where to start.",
          successMessage: "A structure an editor can approve before a word of the body is written, with an opening that earns the next paragraph.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 15 · PRACTICAL 4.P
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "cw-l15-article",
    moduleId: "cw-m4-content",
    sectionId: SECTION_ID,
    order: 4,
    covers: ["4.P"],
    title: "Practical: A Researched Informative Article",
    subtitle: "From research notes to a structured, referenced article",
    estimatedMinutes: 60,
    intro:
      "Everything in this module comes together in one piece: you will turn a brief and research notes into a complete informative article with a headline, an introduction, sections, a conclusion and sources.",

    atoms: [
      {
        id: "a-cw-citing",
        title: "Citing sources in web content",
        explain:
          "Web content cites sources differently from academic writing. Name the source in the sentence where you use it (\"According to the Grain Storage Handbook, …\"), link to it with descriptive link text, and list your main sources at the end under a heading such as Sources or Further reading. Link to the original source, not to an article that mentions it. Give enough detail for a reader to find it: organisation or author, title, and date when it matters. In Markdown, which the Writing Desk and many publishing tools use, a link is written as [text the reader sees](https://the-address). Cite every statistic, research finding and quotation; you do not need to cite common knowledge (\"Lagos is in Nigeria\").",
        example: "According to the Farmers' Extension Bulletin, airtight bags starve insects of oxygen.\n\n## Sources\n- [Farmers' Extension Bulletin No. 12](https://example.org/bulletin-12)",
      },
      {
        id: "a-cw-m4-practical",
        title: "Practical: research and write an informative article",
        explain:
          "Write the article Harvest Hub's brief asks for, using the research notes as your sources. Follow the whole process from Module 1: plan (audience, purpose, key message, outline), draft from the outline, then edit with the style report. The checklist checks the structure, the length, that every source is cited both in the text and in the Sources list, that the customer survey figure is used accurately, and that the article is plain English for households and traders.",
        writingLab: {
          task:
            "Write the article: a specific headline (the \"# \" line, at least 6 words), an introduction with the reader's problem, at least three \"## \" sections with descriptive headings, a Conclusion that ends with a next step, and a Sources section listing at least three sources as Markdown links. Length 450 to 800 words, reading grade 9 or below. Name at least two sources in the body text, and use the survey figure accurately (7 in 10, or 70%).",
          brief: ARTICLE_BRIEF,
          doc: ARTICLE_DOC,
          words: [450, 800],
          tests: [
            { label: "A specific headline of at least 6 words", check: String.raw`const h = (lines(doc).find((l) => /^#\s/.test(l)) || '').replace(/^#\s*/, ''); return words(h) >= 6;`, fail: "Replace \"[Your headline]\" on the first line with a headline that says what the reader will learn." },
            { label: "At least three descriptive sections plus Conclusion and Sources", check: String.raw`const h = headings(2).filter((x) => !/^(conclusion|sources)$/i.test(x) && words(x) >= 3); return h.length >= 3 && headings(2).some((x) => /^conclusion/i.test(x)) && headings(2).some((x) => /^sources/i.test(x));`, fail: "Write three or more \"## \" section headings of three words or more that say what each section gives the reader." },
            { label: "450 to 800 words", check: "const n = words(doc); return n >= 450 && n <= 800;", fail: "The stats bar shows your total. Aim for 450 to 800 words." },
            { label: "At least three sources listed as links", check: "return links(section('Sources')).filter((l) => /^https?:/.test(l.url)).length >= 3;", fail: "List three sources under Sources as \"- [Name](https://…)\"." },
            { label: "At least two sources named in the body text", check: String.raw`const body = doc.split(/^##\s+Sources/m)[0]; return ['Grain Storage Handbook', 'Extension Bulletin', 'Kitchen Science'].filter((s) => body.includes(s)).length >= 2;`, fail: "Name your sources where you use them: \"According to the Grain Storage Handbook, …\"." },
            { label: "The survey figure is used accurately", check: String.raw`return /7 in 10|70\s?%|seven in ten/i.test(doc) && !/(8|9) in 10|80\s?%|90\s?%/i.test(doc);`, fail: "The survey found 7 in 10 customers lost beans to weevils. Use it exactly." },
            { label: "Plain English: grade 9 or below", check: "return grade(doc) <= 9;", fail: "Shorten long sentences and use everyday words: the readers are households and traders." },
          ],
          solution: ARTICLE_DONE,
          hint: "Outline first: one section per habit (dry, seal, store). Then each section explains why, how, and cites its source.",
          successMessage: "A complete researched article: structured, cited, accurate and readable. Download it: it is your first portfolio piece.",
        },
      },
    ],

    task: {
      title: "Module 4 practical: a researched article on a topic you choose",
      intro: "Repeat the whole process with real research.",
      prompts: [
        "Choose a topic useful to a specific audience you know, and write a one-page brief for it: audience, purpose, key message, length, tone.",
        "Research it from at least four reliable sources, keeping notes with every fact and its source. Run each source through the CRAAP test.",
        "Outline the article and send the outline to a friend in the target audience: do they want to read it?",
        "Write 800 to 1,200 words, then fact-check every claim against your notes.",
        "Edit with the Writing Desk style report or Hemingway Editor and publish it on a free blog platform such as Medium or Substack, or keep it for your portfolio.",
      ],
      closing: "Module 5 takes the article further: blogs, headlines, arguments, opinion pieces, guides, listicles, reviews and editorial calendars.",
    },

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
