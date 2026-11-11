/**
 * CONTENT WRITING · MODULE 6 · SEO CONTENT WRITING
 *
 * Curriculum 6.1 – 6.17 and the practical 6.P. What SEO is, how search
 * engines crawl, index and rank, search intent, keyword research, primary,
 * secondary and long-tail keywords, placement, SEO headlines, meta titles and
 * descriptions, slugs, heading hierarchy, links, alt text, readability and
 * relevance, updating, keyword stuffing and SEO tools; then an optimised
 * article.
 *
 * Search volumes in briefs are invented for practice and say so.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

export const SECTION_ID = "cw-s6-seo";

/* ── Lesson 20 lab: search intent ──────────────────────────────────────── */
const INTENT_BRIEF = `You write for **BasketNG**, an online grocery store in Lagos. Six searches people type into Google:

1. basketng login
2. how to keep vegetables fresh longer
3. best online grocery delivery lagos
4. buy 50kg bag of rice online lagos
5. what is the difference between basmati and long grain rice
6. basketng vs quickcart`;

const INTENT_DOC = `# Search intent

Intent must be exactly one of: Informational, Navigational, Commercial, Transactional.

| Search | Intent | Best page to show |
|--------|--------|-------------------|
| 1 |  |  |
| 2 |  |  |
| 3 |  |  |
| 4 |  |  |
| 5 |  |  |
| 6 |  |  |
`;

const INTENT_DONE = `# Search intent

Intent must be exactly one of: Informational, Navigational, Commercial, Transactional.

| Search | Intent | Best page to show |
|--------|--------|-------------------|
| 1 | Navigational | The BasketNG login page |
| 2 | Informational | A blog guide on storing vegetables |
| 3 | Commercial | A comparison page showing why BasketNG suits Lagos shoppers |
| 4 | Transactional | The product page for 50kg rice with price and delivery |
| 5 | Informational | A blog article explaining the two kinds of rice |
| 6 | Commercial | An honest comparison page of BasketNG and QuickCart |
`;

/* ── Lesson 21 lab: a keyword plan, headline and opening ───────────────── */
const KW_BRIEF = `**Brief:** a blog post for **SafeHome Security**, which installs CCTV cameras for homes and small businesses in Abuja. Keyword research (volumes invented for practice):

| Keyword | Monthly searches |
|---------|------------------|
| cctv camera | 9,900 |
| cctv installation in abuja | 320 |
| how much does cctv installation cost in nigeria | 210 |
| best cctv camera for home | 880 |
| cctv camera price | 2,400 |
| wireless cctv camera | 1,300 |

The post will explain what affects the cost of installing CCTV at home, for homeowners in Abuja planning a budget.`;

const KW_DOC = `# Keyword plan

## Primary keyword
[One keyword from the list that matches this post's purpose.]

## Secondary keywords
[Two or three "- " bullets from the list, closely related to the primary.]

## Headline
[The post's headline. Include the primary keyword or a close natural form of it.]

## Opening
[The first 60 to 120 words. Use the primary keyword once, naturally, in the first two sentences.]
`;

const KW_DONE = `# Keyword plan

## Primary keyword
how much does cctv installation cost in nigeria

## Secondary keywords
- cctv installation in abuja
- cctv camera price
- wireless cctv camera

## Headline
How Much Does CCTV Installation Cost in Nigeria? A 2026 Guide for Homes

## Opening
How much does CCTV installation cost in Nigeria? The honest answer is that it depends on a few choices you control: how many cameras you need, whether they are wired or wireless, how long you want to keep recordings, and who installs them. This guide explains each of those choices for homeowners in Abuja, with typical price ranges, so you can plan a realistic budget before you ask anyone for a quote.
`;

/* ── Lesson 22 lab: the on-page SEO package ────────────────────────────── */
const META_BRIEF = `You have written a blog post for **JobLink NG**, a job board, titled "How to Write a CV With No Work Experience". The primary keyword is **cv with no experience**. The post has four sections: choosing a CV format, writing a profile, showing education and projects, and adding skills and volunteering.

Related pages already on JobLink NG's site:
- /blog/cover-letter-for-first-job (How to write a cover letter for your first job)
- /jobs/graduate-trainee (graduate trainee vacancies)

The post has two images: (1) a photo of a young woman at a laptop editing her CV; (2) a one-page sample CV with the sections labelled.`;

const META_DOC = `# On-page SEO package

## Meta title
[50 to 60 characters, primary keyword near the start.]

## Meta description
[120 to 160 characters: what the reader gets, with the keyword and a reason to click.]

## Slug
[Lowercase words joined by hyphens, no dates or stop-words padding, e.g. /blog/example-slug]

## Heading outline
[The H1 and four H2s, one per line, e.g. "H1: …" then "H2: …"]

## Links
[At least two internal links and one external link as Markdown links, each with descriptive link text.]

## Alt text
- Image 1:
- Image 2:
`;

const META_DONE = `# On-page SEO package

## Meta title
CV With No Experience: How to Write One That Gets Calls

## Meta description
Writing a CV with no experience? Learn which format to use, what to put in your profile and how to show projects and skills employers notice.

## Slug
/blog/cv-with-no-experience

## Heading outline
H1: How to Write a CV With No Work Experience
H2: Choose a CV format that puts your strengths first
H2: Write a profile that shows what you can offer
H2: Show your education and projects as evidence
H2: Add skills and volunteering that employers value

## Links
- Internal: [how to write a cover letter for your first job](/blog/cover-letter-for-first-job)
- Internal: [current graduate trainee vacancies](/jobs/graduate-trainee)
- External: [the Nigerian Youth Service Corps official website](https://www.nysc.gov.ng)

## Alt text
- Image 1: Young woman at a laptop editing her CV at a desk
- Image 2: One-page sample CV with profile, education, projects and skills sections labelled
`;

/* ── Lesson 23 lab: the optimised article ──────────────────────────────── */
const SEO_BRIEF = `**Brief:** an SEO blog article for **JobLink NG**. Primary keyword: **cv with no experience**. Secondary keywords: **first job cv**, **cv for fresh graduates**. Audience: Nigerian school leavers and fresh graduates writing their first CV. Purpose: educate, then invite readers to browse graduate jobs on JobLink NG (internal link: /jobs/graduate-trainee). Length: 600 to 900 words. Include the meta title and meta description at the top.`;

const SEO_DOC = `# [H1 headline with the primary keyword]

Meta title: [50 to 60 characters]
Meta description: [120 to 160 characters]

[Introduction: use the primary keyword in the first 100 words.]

## [Section heading]

## [Section heading]

## [Section heading]

## [Closing heading]
`;

const SEO_DONE = `# How to Write a CV With No Experience (and Still Get Interviews)

Meta title: CV With No Experience: A Simple Guide for Graduates
Meta description: Writing a CV with no experience? Learn what to include, how to show your projects and skills, and the mistakes that get first-job CVs rejected.

You have finished school or NYSC, you are ready to work, and every job advert asks for experience you do not have yet. Writing a CV with no experience feels impossible, but employers who hire graduates know exactly what they are looking at. They are not asking for years of work. They want evidence that you can learn, deliver and work with people. This guide shows you how to give them that evidence on one page.

## Choose a format that shows your strengths first

Most CVs list work experience first. A first job CV should not, because that section is empty or thin. Use a skills-based format instead: after your contact details, put a short profile, then your education, then projects and skills, then any volunteering or part-time work.

Keep it to one page. A recruiter reading a CV for fresh graduates spends seconds on the first scan, so make the strongest evidence easy to find. Use clear headings, plenty of white space and one simple font.

## Write a profile that says what you can offer

Your profile is three or four lines at the top that tell the employer who you are and what you can do for them. Avoid empty phrases such as "hardworking team player seeking a challenging role". Every graduate writes that.

Be specific instead. For example: "Economics graduate from the University of Ibadan with strong Excel skills, who analysed sales data for a student business that grew orders by 40% in one semester. Looking for a graduate trainee role in finance or operations." Tailor this paragraph for every job you apply for, using words from the job advert.

## Turn your education and projects into evidence

Education is your main qualification, so give it detail. Add your degree, class and year, and then list the two or three courses or projects most relevant to the job. A final-year project, a group assignment, a business you ran, a website you built or an event you organised all count.

Describe each project with what you did and what happened, not only what it was. "Led a team of four to survey 200 traders on mobile payments, and presented the findings to the department" shows research, leadership and communication in one line. Numbers make every claim stronger.

## Add skills and volunteering employers value

List skills you can prove: Microsoft Excel, Canva, a programming language, a second language, customer service. Group them, and avoid rating yourself with stars or percentages, which mean nothing to a recruiter.

Then add volunteering, NYSC community development work, church or mosque roles, student union positions and part-time jobs. Serving as a class representative, teaching in a community school or selling in a family shop all show responsibility. Present them exactly as you would present paid work: your role, what you did and what you achieved.

## Avoid the mistakes that get first CVs rejected

Recruiters see the same errors again and again. Leave out your date of birth, religion, state of origin and a photo unless the advert asks for them, because they take space and say nothing about your ability. Do not copy a template's sample text, and do not list every course you took. Never claim a skill you cannot demonstrate in an interview, since a good interviewer will test it. Finally, avoid an unprofessional email address: create a simple one with your name.

## Check it, then start applying

Before you send your first job CV, check four things: no spelling mistakes, a professional email address, a file name with your name, and a profile that matches the job. Ask a friend to read it for ten seconds and tell you what they remember.

A CV with no experience is not a weak CV. It is a CV that shows potential with evidence. When yours is ready, [browse current graduate trainee vacancies on JobLink NG](/jobs/graduate-trainee) and send your first application today.
`;

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 20 · 6.1 – 6.4
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "cw-l20-search",
    moduleId: "cw-m6-seo",
    sectionId: SECTION_ID,
    order: 1,
    covers: ["6.1", "6.2", "6.3", "6.4"],
    title: "How Search Works",
    subtitle: "What SEO is, how search engines rank pages, search intent and keyword research",
    estimatedMinutes: 35,
    intro:
      "Most people find content by typing a question into a search engine. SEO writing makes sure that when someone asks a question your client can answer, your page is the one they find, and the one that actually helps them.",

    atoms: [
      {
        id: "a-cw-seo-intro",
        title: "Introduction to Search Engine Optimization (SEO)",
        explain:
          "Search Engine Optimization (SEO) is the practice of making web pages easy for search engines to find, understand and recommend for the searches that matter to a business. It has three parts. Technical SEO (site speed, mobile-friendliness, secure https, a site structure search engines can crawl) is usually handled by developers. Off-page SEO (other reputable sites linking to yours) comes from publicity and great content. On-page SEO is the writer's part: choosing what to write about from real searches, matching the searcher's intent, using the words they use, and structuring the page with clear titles, headings, links and descriptions. Organic (unpaid) search traffic matters because it keeps arriving month after month without paying for each visit, unlike adverts. Good SEO writing is not tricking a machine: search engines now reward pages that genuinely help people, so the best SEO writing is simply excellent, well-structured content that answers the search.",
      },
      {
        id: "a-cw-crawl-index-rank",
        title: "How search engines discover and rank content",
        explain:
          "Search engines work in three stages. Crawling: automated programs called crawlers or bots follow links from page to page and download what they find, including your new article once it is linked from somewhere or listed in a sitemap. Indexing: the engine analyses each page (its text, headings, images, links and structure) and stores it in a giant index, a library catalogue of the web. Ranking: when someone searches, the engine picks the pages from its index that best answer that search and orders them. Google uses hundreds of signals, but the ones writers influence most are relevance (does the page answer this exact query?), quality and helpfulness (is it accurate, thorough, original and written with real experience and expertise; Google calls this E-E-A-T: experience, expertise, authoritativeness, trustworthiness), freshness for time-sensitive topics, and user experience (is it easy to read on a phone?). Search results now often include AI-generated summaries too, which draw on pages that answer clearly and are trusted.",
        table: {
          caption: "The three stages of search.",
          headers: ["Stage", "What happens", "What helps your page"],
          rows: [
            ["Crawling", "Bots follow links and download pages", "Links to the page from your site; a sitemap"],
            ["Indexing", "The page is analysed and stored", "Clear headings, descriptive text, alt text, no duplicate pages"],
            ["Ranking", "Pages are ordered for each search", "Relevance to the query, helpfulness, expertise, readability"],
          ],
        },
      },
      {
        id: "a-cw-search-intent",
        title: "Understanding search intent",
        explain:
          "Search intent is the reason behind a search: what the person actually wants. There are four types. Informational: they want to know or learn something (\"how to keep vegetables fresh\", \"what is a treasury bill\"); serve them a guide or explainer. Navigational: they want a specific site or page (\"basketng login\"); serve them that page. Commercial investigation: they are comparing options before buying (\"best online grocery delivery lagos\", \"basketng vs quickcart\"); serve them comparisons, reviews and buying guides. Transactional: they are ready to act (\"buy 50kg bag of rice online lagos\"); serve them a product or booking page. Matching intent matters more than any keyword trick: a sales page will not rank for an informational question, and a long essay will frustrate someone ready to buy. Before writing, search the keyword yourself and look at what already ranks: the results show you what the search engine believes the intent is.",
        writingLab: {
          task:
            "Classify each of BasketNG's six searches by intent (exactly Informational, Navigational, Commercial or Transactional) and say which page would best serve it (at least 4 words).",
          brief: INTENT_BRIEF,
          doc: INTENT_DOC,
          tests: [
            { label: "Six rows, each with an intent and a page", check: String.raw`return rows(doc).filter((c) => /^[1-6]$/.test(c[0]) && /^(informational|navigational|commercial|transactional)$/i.test(c[1] || '') && words(c[2]) >= 4).length === 6;`, fail: "Every search needs one of the four intents and a page of four words or more." },
            { label: "Searches 1 and 4 are classified correctly", check: String.raw`const r = rows(doc); const v = (k) => ((r.find((c) => c[0] === k) || [])[1] || '').toLowerCase(); return v('1') === 'navigational' && v('4') === 'transactional';`, fail: "Search 1 names the site's login page; search 4 says \"buy\"." },
            { label: "Searches 2 and 5 are classified correctly", check: String.raw`const r = rows(doc); const v = (k) => ((r.find((c) => c[0] === k) || [])[1] || '').toLowerCase(); return v('2') === 'informational' && v('5') === 'informational';`, fail: "\"How to\" and \"what is\" searches want to learn something." },
            { label: "Searches 3 and 6 are classified correctly", check: String.raw`const r = rows(doc); const v = (k) => ((r.find((c) => c[0] === k) || [])[1] || '').toLowerCase(); return v('3') === 'commercial' && v('6') === 'commercial';`, fail: "\"best\" and \"vs\" mean the searcher is comparing before buying." },
            { label: "Transactional search goes to a product page", check: String.raw`const r = rows(doc).find((c) => c[0] === '4') || []; return /product|order|buy|shop|checkout/i.test(r[2] || '');`, fail: "Someone ready to buy needs the product page, not an article." },
          ],
          solution: INTENT_DONE,
          hint: "Look for the signal words: brand names, \"how\" and \"what\", \"best\" and \"vs\", and \"buy\".",
          successMessage: "Six searches, six intents, six right pages. Intent decides what you write before any keyword does.",
        },
      },
      {
        id: "a-cw-keyword-research",
        title: "Keyword research fundamentals",
        explain:
          "A keyword is the word or phrase people type into a search engine. Keyword research finds the searches your audience actually makes, so you write about what they want in the words they use. Start with seed topics from the business (\"cctv\", \"grocery delivery\"), then expand them with tools that show related searches, monthly search volume (roughly how many searches a month) and keyword difficulty (how hard it is to rank, usually because strong sites already do). Also mine free sources: Google autocomplete, \"People also ask\", \"Related searches\" at the bottom of results, and questions customers ask. Choose keywords by three tests: relevance (does it match what the business offers?), intent (can we write the page that serves it?), and opportunity (enough searches to matter, but a realistic chance to rank). A small business blog usually wins first with specific, lower-volume phrases rather than broad, competitive ones.",
        decision: {
          scenario: "A new bakery blog in Owerri is choosing between two keywords: \"bread\" (huge volume, dominated by national sites and recipes) and \"where to buy fresh bread in owerri\" (small volume, few strong pages).",
          question: "Which should it target first?",
          options: [
            { id: "a", text: "\"where to buy fresh bread in owerri\": it is relevant, matches local buying intent and is realistic to rank for", why: "Right. A small site wins with specific, relevant searches whose intent it can serve completely." },
            { id: "b", text: "\"bread\", because more volume always means more customers", whyWrong: "Most people searching \"bread\" want recipes or general information, and the bakery has little chance of ranking." },
            { id: "c", text: "Both, by repeating them many times on one page", whyWrong: "Repeating keywords is stuffing, and the two searches have different intents." },
            { id: "d", text: "Neither: keywords do not matter", whyWrong: "Writing without knowing what people search means guessing what they want." },
          ],
          correct: "a",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 21 · 6.5 – 6.8
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "cw-l21-keywords",
    moduleId: "cw-m6-seo",
    sectionId: SECTION_ID,
    order: 2,
    covers: ["6.5", "6.6", "6.7", "6.8"],
    title: "Choosing and Using Keywords",
    subtitle: "Primary, secondary and long-tail keywords, natural placement and SEO headlines",
    estimatedMinutes: 35,
    intro:
      "Once you know what people search, you decide which searches each page should serve, and where those words belong on the page.",

    atoms: [
      {
        id: "a-cw-primary-secondary",
        title: "Primary and secondary keywords",
        explain:
          "Every SEO page has one primary keyword: the main search it is built to answer. It decides the headline, the meta title, the slug and the core of the content, and no other page on the same site should target it (two pages competing for one search weaken each other, which SEOs call cannibalisation). Secondary keywords are closely related searches that the same page can answer naturally because they share its intent: for \"how much does cctv installation cost in nigeria\", secondaries might be \"cctv camera price\" and \"cctv installation in abuja\". They appear in subheadings and body text where they fit, broadening the searches the page can rank for. Choose two to five secondaries; more than that usually means the page is trying to do too many jobs.",
      },
      {
        id: "a-cw-long-tail",
        title: "Long-tail keywords",
        explain:
          "Long-tail keywords are longer, more specific searches, usually three words or more: \"best cctv camera for home\" rather than \"cctv\". Each has a small search volume, but together they make up most of all searches, and they have three advantages. They show clearer intent (the searcher knows exactly what they want), they face less competition, and they often convert better because the searcher is further along in deciding. Questions are especially valuable long-tail keywords (\"how much does cctv installation cost in nigeria\"), and they map neatly to headings and FAQ sections. Long-tail keywords are where new and small sites should start.",
        table: {
          caption: "From short head terms to long-tail keywords.",
          headers: ["Keyword", "Length", "Typical volume", "Intent clarity", "Competition"],
          rows: [
            ["cctv", "Head term", "Very high", "Unclear", "Very high"],
            ["wireless cctv camera", "Mid-tail", "Medium", "Clearer", "Medium"],
            ["how much does cctv installation cost in nigeria", "Long-tail", "Low", "Very clear", "Low"],
          ],
        },
      },
      {
        id: "a-cw-placement",
        title: "Keyword placement and natural integration",
        explain:
          "Place the primary keyword (or a natural variation of it) where search engines and readers look first: the meta title, the H1 headline, the slug, the first 100 words, at least one H2 where it fits, and the meta description. After that, write naturally. Modern search engines understand synonyms and related terms, so use the words a human expert would use: an article about CCTV costs will naturally mention cameras, DVR, installation, cabling, storage and quotes. You may adjust a keyword's grammar to read naturally (\"how much CCTV installation costs in Nigeria\" inside a sentence) and use capitals and punctuation normally. Read every keyword sentence aloud: if it sounds odd to a human, rewrite it.",
        samples: [
          { label: "Forced", tone: "bad", text: "Cctv installation in abuja is what we do. If you need cctv installation in abuja, our cctv installation in abuja service is the best." },
          { label: "Natural", tone: "good", text: "Planning CCTV installation in Abuja? Here is what affects the price, from the number of cameras to how long you keep recordings." },
        ],
      },
      {
        id: "a-cw-seo-headlines",
        title: "Writing SEO-friendly headlines",
        explain:
          "An SEO headline has two readers: the search engine, which uses it to understand the page, and the searcher, who decides from it whether to click. It should contain the primary keyword, ideally near the start; match the intent (a question for an informational search, \"best\" or \"vs\" for a commercial one); promise a specific benefit; and stay readable. Add details that raise clicks: the year for time-sensitive topics (\"2026 guide\"), a number, the audience (\"for homes\", \"for beginners\") or the location. The H1 on the page and the meta title (next lesson) can differ slightly: the H1 can be fuller and more conversational, while the meta title must fit in the search result.",
        writingLab: {
          task:
            "Plan SafeHome's post. Choose the primary keyword from the list that best matches the post's purpose (homeowners budgeting for installation), and two or three secondary keywords from the list. Write a headline that contains the primary keyword (or its natural form). Then write the opening: 60 to 120 words that use the primary keyword once within the first two sentences, and do not repeat any keyword more than twice.",
          brief: KW_BRIEF,
          doc: KW_DOC,
          tests: [
            { label: "The primary keyword matches the post's purpose", check: String.raw`return /how much does cctv installation cost in nigeria/i.test(section('Primary keyword') || '');`, fail: "The post explains what installation costs. Which keyword asks exactly that question?" },
            { label: "Two or three secondary keywords from the list", check: String.raw`const list = ['cctv camera', 'cctv installation in abuja', 'best cctv camera for home', 'cctv camera price', 'wireless cctv camera']; const b = bullets(section('Secondary keywords')).map((x) => x.toLowerCase().trim()); return b.length >= 2 && b.length <= 3 && b.every((x) => list.includes(x));`, fail: "Pick two or three related keywords from the table, written exactly as listed." },
            { label: "The headline contains the primary keyword", check: String.raw`return /how much (does )?cctv installation cost(s)? in nigeria/i.test(section('Headline') || '');`, fail: "Put the primary keyword, or its natural form, in the headline." },
            { label: "Opening: 60 to 120 words, keyword in the first two sentences", check: String.raw`const o = section('Opening') || ''; const first = sentences(o).slice(0, 2).join(' '); return words(o) >= 60 && words(o) <= 120 && /how much (does )?cctv installation cost(s)? in nigeria/i.test(first);`, fail: "Use the primary keyword once, naturally, in the first two sentences, and keep the opening to 60 to 120 words." },
            { label: "No keyword stuffing in the opening", check: String.raw`const o = section('Opening') || ''; return count(o, /cctv installation/gi) <= 2 && count(o, /cctv camera/gi) <= 2;`, fail: "Say it once and then write naturally. Repeating keywords hurts readers and rankings." },
          ],
          solution: KW_DONE,
          hint: "Match the post's question to the keyword that asks it. A question keyword makes a natural first sentence.",
          successMessage: "A keyword chosen for intent, placed where it counts, and an opening that still reads like a human wrote it.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 22 · 6.9 – 6.13
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "cw-l22-onpage",
    moduleId: "cw-m6-seo",
    sectionId: SECTION_ID,
    order: 3,
    covers: ["6.9", "6.10", "6.11", "6.12", "6.13"],
    title: "On-Page SEO Elements",
    subtitle: "Meta titles and descriptions, slugs, heading hierarchy, links and alt text",
    estimatedMinutes: 40,
    intro:
      "Around every article sits a set of small pieces of writing that readers may never notice on the page but that decide how it appears in search: the meta title and description, the URL, the headings, the links and the image descriptions.",

    atoms: [
      {
        id: "a-cw-meta",
        title: "Meta titles and meta descriptions",
        explain:
          "The meta title (or title tag) is the clickable blue headline in search results and the text on the browser tab. Write it for the search result: primary keyword near the start, a clear benefit, and 50 to 60 characters so it is not cut off (search engines display roughly 600 pixels). Brand names go at the end if there is room (\"… | JobLink NG\"). The meta description is the short summary under the title in search results. It does not directly change rankings, but it strongly affects whether people click. Write 120 to 160 characters (longer ones are cut off) that say what the reader will get, include the keyword (search engines often bold matching words), and give a reason to click. Search engines sometimes rewrite these, but a well-written one is usually used. Every page needs its own unique title and description.",
        table: {
          caption: "Meta title and description at a glance.",
          headers: ["", "Meta title", "Meta description"],
          rows: [
            ["Where it shows", "Blue headline in results, browser tab", "Grey summary under the title"],
            ["Length", "50–60 characters", "120–160 characters"],
            ["Keyword", "Near the start", "Included naturally"],
            ["Job", "Rank and earn the click", "Earn the click"],
          ],
        },
      },
      {
        id: "a-cw-slugs",
        title: "URL structures and slugs",
        explain:
          "A URL is a page's address; the slug is the last part that identifies the page: in joblink.ng/blog/cv-with-no-experience, the slug is cv-with-no-experience. A good slug is short, readable and descriptive: lowercase words separated by hyphens, containing the primary keyword, with no spaces, underscores, special characters or random numbers. Leave out filler words (a, the, and, of) unless they are needed for meaning, and avoid dates and years if you plan to update the article, because changing a URL later breaks links. A clean URL structure also shows where the page sits on the site (/blog/…, /jobs/…, /services/…), which helps both readers and search engines.",
        decision: {
          scenario: "Choose the slug for \"How Much Does CCTV Installation Cost in Nigeria? A 2026 Guide\".",
          question: "Which slug is best?",
          options: [
            { id: "a", text: "/blog/cctv-installation-cost-nigeria", why: "Right. Short, lowercase, hyphenated, contains the keyword, and stays valid when the guide is updated next year." },
            { id: "b", text: "/blog/How_Much_Does_CCTV_Installation_Cost_In_Nigeria?_A_2026_Guide", whyWrong: "Capitals, underscores, a question mark and a year that will date the URL." },
            { id: "c", text: "/blog/post-48213", whyWrong: "Tells readers and search engines nothing about the page." },
            { id: "d", text: "/blog/the-complete-and-ultimate-guide-to-the-cost-of-cctv", whyWrong: "Too long, padded with filler words, and it loses \"installation\" and \"Nigeria\"." },
          ],
          correct: "a",
        },
      },
      {
        id: "a-cw-heading-hierarchy",
        title: "Heading hierarchy (H1, H2, H3)",
        explain:
          "You met headings in Module 5. For SEO the rules are strict. Each page has exactly one H1, the on-page headline, containing the primary keyword. H2s divide the page into its main sections and are the best place for secondary keywords and question-style long-tail keywords, which can win featured answers in search. H3s divide an H2 section and never appear without an H2 above them. Headings must describe the content below them, because search engines use them to understand and summarise the page, and screen readers use them to navigate. In a content management system such as WordPress, choose Heading 2 or Heading 3 from the menu; never make text look like a heading just by making it bold and large.",
      },
      {
        id: "a-cw-linking",
        title: "Internal and external linking",
        explain:
          "Internal links point to other pages on the same website. They help readers find related content, help crawlers discover pages, and pass authority from strong pages to newer ones. Add two to five relevant internal links to every article, including one to the page you want readers to act on (a service or product page). External links point to other websites: the sources of your facts and genuinely useful resources. Linking to reputable sources supports trust and helps readers verify claims. For both, write descriptive anchor text, the clickable words: \"read our guide to cover letters for your first job\", not \"click here\". Anchor text tells search engines and screen-reader users what the destination is. Do not link the same words to many pages, and check every link works before publishing.",
        mistake: "Linking with \"click here\" or \"this link\". Use anchor text that describes the destination: \"see current graduate trainee vacancies\".",
      },
      {
        id: "a-cw-alt-text",
        title: "Image alt text",
        explain:
          "Alt text (alternative text) is a short written description of an image, stored in the page code. Screen readers read it aloud to blind and low-vision users, browsers show it if the image fails to load, and search engines use it to understand images and show them in image search. Good alt text describes what the image shows that matters for this page, in roughly 125 characters or fewer: \"One-page sample CV with profile, education, projects and skills sections labelled\". Do not start with \"image of\" or \"picture of\" (screen readers already announce an image), do not stuff keywords, and include text that appears in the image if it matters. A purely decorative image (a background pattern) gets empty alt text so screen readers skip it.",
        writingLab: {
          task:
            "Write JobLink NG's on-page SEO package. Meta title: 50 to 60 characters, the primary keyword (\"cv with no experience\") in the first half. Meta description: 120 to 160 characters, containing the keyword. Slug: lowercase words joined by hyphens, starting /blog/ and containing the keyword. Heading outline: one H1 line (with the keyword) and four H2 lines. Links: at least two internal links (starting with /) and one external link (starting with https://), each with descriptive anchor text of at least three words and none saying \"click here\". Alt text: both images, each under 125 characters, not starting \"image of\" or \"picture of\".",
          brief: META_BRIEF,
          doc: META_DOC,
          tests: [
            { label: "Meta title: 50 to 60 characters, keyword in the first half", check: String.raw`const t = (section('Meta title') || '').trim(); const i = t.toLowerCase().indexOf('cv with no experience'); return t.length >= 50 && t.length <= 60 && i >= 0 && i <= t.length / 2;`, fail: "Count the characters (spaces included): 50 to 60, and put \"CV with no experience\" near the start." },
            { label: "Meta description: 120 to 160 characters with the keyword", check: String.raw`const d = (section('Meta description') || '').trim(); return d.length >= 120 && d.length <= 160 && /cv with no experience/i.test(d);`, fail: "Write 120 to 160 characters that say what the reader gets, including the keyword." },
            { label: "Slug: /blog/ plus lowercase hyphenated words with the keyword", check: String.raw`const s = (section('Slug') || '').trim(); return /^\/blog\/[a-z0-9]+(-[a-z0-9]+)+$/.test(s) && s.includes('cv-with-no-experience');`, fail: "Use lowercase words joined by hyphens, such as /blog/cv-with-no-experience." },
            { label: "One H1 with the keyword and four H2s", check: String.raw`const l = lines(section('Heading outline')); const h1 = l.filter((x) => /^H1:/i.test(x)); const h2 = l.filter((x) => /^H2:/i.test(x) && words(x) >= 4); return h1.length === 1 && /cv with no (work )?experience/i.test(h1[0]) && h2.length >= 4;`, fail: "Write \"H1: …\" once (with the keyword) and four \"H2: …\" lines." },
            { label: "Two internal and one external link with descriptive anchors", check: String.raw`const k = links(section('Links')); const good = (l) => words(l.text) >= 3 && !/click here|this link|read more/i.test(l.text); return k.filter((l) => l.url.startsWith('/') && good(l)).length >= 2 && k.filter((l) => /^https:\/\//.test(l.url) && good(l)).length >= 1;`, fail: "Link the two related JobLink pages (starting with /) and one reputable external site (https://), each with anchor text that describes the destination." },
            { label: "Alt text for both images, under 125 characters, no \"image of\"", check: String.raw`const a = [field(section('Alt text'), 'Image 1'), field(section('Alt text'), 'Image 2')]; return a.every((x) => x && words(x) >= 5 && x.length <= 125 && !/^(an? )?(image|picture|photo) of/i.test(x));`, fail: "Describe what each image shows in five words or more, under 125 characters, without \"image of\"." },
          ],
          solution: META_DONE,
          hint: "Draft the meta title and description, then watch the character counts: copy each into the Writing Desk alone if it helps.",
          successMessage: "Every small piece of on-page SEO, written to the limits search engines and screen readers actually use.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 23 · 6.14 – 6.17 · PRACTICAL 6.P
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "cw-l23-optimise",
    moduleId: "cw-m6-seo",
    sectionId: SECTION_ID,
    order: 4,
    covers: ["6.14", "6.15", "6.16", "6.17", "6.P"],
    title: "Optimising, Updating and the SEO Article",
    subtitle: "Readability, relevance, updates, keyword stuffing, SEO tools and the practical",
    estimatedMinutes: 75,
    intro:
      "The last part of SEO writing is judgement: keeping content readable and relevant, updating it so it stays useful, never stuffing keywords, and using tools without letting them write for you. Then you write a fully optimised article.",

    atoms: [
      {
        id: "a-cw-seo-readability",
        title: "Content readability and search relevance",
        explain:
          "Readability and relevance work together. A page ranks when it is the most relevant, helpful answer to a search, and it keeps ranking when people who arrive stay, read and do not rush back to the results to try another page. That means answering the main question early (often in the first paragraph), covering the related questions a searcher will have next, using headings so they can jump to what they need, and writing in plain English (around grade 8 for general audiences). Relevance comes from completeness, not repetition: cover the topic the way an expert would, with the specific details, examples and terms the subject requires. Ask: if this were the only page the searcher read, would they have everything they need?",
      },
      {
        id: "a-cw-updating",
        title: "Content optimization and updating",
        explain:
          "Content optimisation means improving an existing page so it serves its search better. Use data from Google Search Console (free from Google): which searches show the page, its position, how many people see it and how many click. Common improvements: rewrite a meta title and description that are seen but rarely clicked; add a section answering a related question the page already appears for; improve the introduction so it answers faster; add internal links from newer articles; replace outdated facts, prices, screenshots and years; and merge two weak pages on the same topic into one strong one (redirecting the old URL). Review important pages at least once a year, and time-sensitive ones (prices, laws, \"best of\" lists) more often. Updating a good page is usually faster and more effective than writing a new one.",
      },
      {
        id: "a-cw-stuffing",
        title: "Avoiding keyword stuffing",
        explain:
          "Keyword stuffing is repeating a keyword unnaturally often in the hope of ranking higher: in sentences, in hidden text, in long lists of locations, or in alt text. It is an old tactic that search engines now treat as spam: it can push a page down or out of results, and it makes writing unreadable and untrustworthy to humans. There is no ideal keyword density to hit. As a rough warning sign, if your exact primary keyword makes up more than about 2 to 3% of your words, or appears in nearly every paragraph, read the page aloud and rewrite. Use the keyword in the key places, then use synonyms, pronouns and related terms like a normal writer.",
        samples: [
          { label: "Stuffed", tone: "bad", text: "Looking for a cv with no experience? Our cv with no experience guide shows how to write a cv with no experience, because a cv with no experience needs a cv with no experience template." },
          { label: "Natural", tone: "good", text: "Writing your first CV with no experience? Here is how to show employers what you can do, using your education, projects and skills." },
        ],
        decision: {
          scenario: "An SEO plugin says your 800-word article uses the keyword \"cv with no experience\" only twice and shows a red warning.",
          question: "What is the best response?",
          options: [
            { id: "a", text: "Check it appears in the title, H1, slug, first 100 words and meta description; if so, ignore the warning and keep writing naturally", why: "Right. Placement in the key spots matters; repetition does not. Tools apply simple rules, and your judgement decides." },
            { id: "b", text: "Add the keyword to every paragraph until the plugin turns green", whyWrong: "That is keyword stuffing: worse for readers and for rankings." },
            { id: "c", text: "Hide the keyword in white text at the bottom", whyWrong: "Hidden text is a spam tactic that search engines penalise." },
            { id: "d", text: "Delete the article", whyWrong: "A plugin colour is not a reason to delete good content." },
          ],
          correct: "a",
        },
      },
      {
        id: "a-cw-seo-tools",
        title: "Introduction to SEO tools",
        explain:
          "SEO tools help you research and measure; they do not write for you. Google Search Console (free) shows which searches your pages appear for, positions, impressions and clicks, and indexing problems. Google Keyword Planner (free with a Google Ads account) gives search volume ranges. Google Trends (free) shows whether interest in a topic is rising, falling or seasonal, by country. Paid suites such as Ahrefs and Semrush, and lower-cost options such as Ubersuggest, show keyword volumes, difficulty, competitors' rankings and backlinks. AnswerThePublic and \"People also ask\" reveal questions. On WordPress sites, plugins such as Yoast SEO and Rank Math check titles, descriptions and readability as you write. Treat tool numbers as estimates, compare trends rather than exact figures, and remember that the best test is still the search results page itself.",
        table: {
          caption: "SEO tools and what each is for.",
          headers: ["Tool", "Cost", "Use it to"],
          rows: [
            ["Google Search Console", "Free", "See searches, clicks and positions for your own pages"],
            ["Google Keyword Planner", "Free (Ads account)", "Estimate search volume"],
            ["Google Trends", "Free", "See rising, falling or seasonal interest"],
            ["Ahrefs / Semrush", "Paid", "Keyword difficulty, competitors, backlinks"],
            ["Ubersuggest / AnswerThePublic", "Free tier, paid", "Keyword ideas and questions"],
            ["Yoast SEO / Rank Math", "Free tier, paid", "On-page checks inside WordPress"],
          ],
        },
      },
      {
        id: "a-cw-m6-practical",
        title: "Practical: write and optimise an SEO article",
        explain:
          "Write JobLink NG's article around the primary keyword \"cv with no experience\". Bring everything together: intent (informational, with a final internal link for the next step), keyword placement, a meta title and description to the right lengths, an H1 and descriptive H2s, natural use of the secondary keywords, plain English, and no stuffing.",
        writingLab: {
          task:
            "Write the article. H1 (the \"# \" line) with the primary keyword. Meta title (50 to 60 characters) and meta description (120 to 160 characters) on the lines starting \"Meta title:\" and \"Meta description:\". The primary keyword in the first 100 words of the introduction. At least four descriptive \"## \" sections. Each secondary keyword (\"first job cv\", \"cv for fresh graduates\") used at least once. An internal link to /jobs/graduate-trainee with descriptive anchor text. 600 to 900 words, grade 9 or below, and the primary keyword making up no more than 2% of the body text (headings and meta lines are not counted).",
          brief: SEO_BRIEF,
          doc: SEO_DOC,
          words: [600, 900],
          tests: [
            { label: "H1 contains the primary keyword", check: String.raw`const h = lines(doc).find((l) => /^#\s/.test(l)) || ''; return /cv with no experience/i.test(h);`, fail: "Put \"CV with no experience\" in the \"# \" headline." },
            { label: "Meta title 50–60 characters; meta description 120–160", check: String.raw`const t = field(doc, 'Meta title') || ''; const d = field(doc, 'Meta description') || ''; return t.length >= 50 && t.length <= 60 && d.length >= 120 && d.length <= 160 && /cv with no experience/i.test(t + ' ' + d);`, fail: "Check both character counts, and include the keyword in at least one of them." },
            { label: "Primary keyword in the first 100 words of the introduction", check: String.raw`const intro = units(doc).filter((u) => !/^meta (title|description):/i.test(u)).join(' '); return /cv with no experience/i.test(wordList(intro).slice(0, 100).join(' '));`, fail: "Use the primary keyword naturally in the first paragraph." },
            { label: "At least four descriptive sections", check: String.raw`return headings(2).filter((h) => words(h) >= 4 && !/^\[/.test(h)).length >= 4;`, fail: "Write four or more \"## \" headings of four words or more." },
            { label: "Both secondary keywords used", check: String.raw`return /first job cv/i.test(doc) && /cv for fresh graduates/i.test(doc);`, fail: "Work \"first job CV\" and \"CV for fresh graduates\" into sentences where they fit." },
            { label: "Internal link to graduate jobs with descriptive anchor text", check: String.raw`return links(doc).some((l) => l.url === '/jobs/graduate-trainee' && words(l.text) >= 3 && !/click here/i.test(l.text));`, fail: "Link to /jobs/graduate-trainee with anchor text that says where it goes." },
            { label: "600 to 900 words, grade 9 or below, no stuffing (keyword 2% or less)", check: String.raw`const n = words(doc); const body = units(doc).filter((u) => !/^meta (title|description):/i.test(u)).join('\n'); return n >= 600 && n <= 900 && grade(doc) <= 9 && (count(body, /cv with no experience/gi) * 4) / words(body) <= 0.02;`, fail: "Check the length and reading grade, and use the exact keyword only in the key places." },
          ],
          solution: SEO_DONE,
          hint: "Write the article for a nervous graduate first. Then check the keyword is in the six key places, and nowhere it sounds forced.",
          successMessage: "An article built for its search and its reader: the right intent, keywords in the right places, and nothing stuffed.",
        },
      },
    ],

    task: {
      title: "Module 6 practical: an SEO article for a real keyword",
      intro: "Do the full process with real data.",
      prompts: [
        "Choose a real local business and brainstorm ten searches its customers might make.",
        "Use Google autocomplete, \"People also ask\" and Google Trends (or Ubersuggest) to choose a primary keyword and three secondary keywords.",
        "Search the primary keyword and study the top five results: what intent do they serve, and what do they miss?",
        "Write and optimise an 800 to 1,200-word article with a meta title, meta description, slug, headings, links and alt text for two images.",
        "Publish it if you can, add it to Google Search Console, and check after a month which searches it appears for.",
      ],
      closing: "Module 7 turns to the pages every business needs: website copy, microcopy and social media.",
    },

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
