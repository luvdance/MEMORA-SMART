/**
 * CONTENT WRITING · MODULE 19 · FREELANCING AND THE BUSINESS OF WRITING
 *
 * Curriculum 19.1 – 19.16 and the practical 19.P. Writing careers,
 * freelancing, services and niches, client requirements and briefs,
 * packages, pricing and proposals, finding clients and marketplaces, client
 * relationships, deadlines and revisions, contracts, ownership and payment,
 * and a sustainable business; then a service package, pricing structure
 * and client proposal.
 *
 * Rates in briefs are invented for practice; the lessons teach how to set
 * your own from your costs, time and market, not a market price list.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

export const SECTION_ID = "cw-s19-freelancing";

/* ── Lesson 71 lab: niche and positioning ──────────────────────────────── */
const NICHE_DOC = `# My writing business

## Positioning statement
[One sentence: "I help [specific clients] [achieve a result] with [services]."]

## Niche
- Industry:
- Ideal client:
- Why this niche:

## Services
[Three "- " bullets: each a specific service with what the client receives.]
`;

const NICHE_DONE = `# My writing business

## Positioning statement
I help fintech startups in Nigeria earn customers' trust with clear SEO articles, product pages and email campaigns.

## Niche
- Industry: Fintech (payments, savings and lending apps)
- Ideal client: A Nigerian fintech startup with a small marketing team and no full-time writer
- Why this niche: Fintech companies need content constantly, can pay well, and must explain money clearly to wary customers, which is where my writing is strongest.

## Services
- SEO blog articles: two 1,000-word researched articles a month, with meta titles and descriptions
- Product and landing page copy: one page written and revised, with headline options to test
- Email campaigns: a five-email onboarding or launch sequence with subject lines and preview text
`;

/* ── Lesson 72 lab: turning a messy request into a brief ───────────────── */
const MESSY_BRIEF = `A potential client, **Mrs Funke Adebayo**, owner of **Glow & Go**, a skincare shop in Ibadan, sends you this WhatsApp message:

> "Good evening. I saw your work on LinkedIn. We need content for our new website, something nice that will bring customers. Maybe blog and the pages too. We sell natural skincare for women, shea butter and black soap and so on, we also sell on Instagram (12k followers). The site is launching soon, end of the month I think. My budget is not much. Can you help? Thanks."`;

const MESSY_DOC = `# Glow & Go: draft brief

## What I understand
- Client:
- Product:
- Audience:
- Goal:
- Deliverables:
- Deadline:

## Questions for the client
[At least five "- " questions, each ending with "?", that you need answered before quoting.]
`;

const MESSY_DONE = `# Glow & Go: draft brief

## What I understand
- Client: Mrs Funke Adebayo, owner of Glow & Go, Ibadan
- Product: Natural skincare products for women, such as shea butter and black soap
- Audience: Women who buy natural skincare, many of whom already follow the shop on Instagram
- Goal: A new website that brings customers and online sales
- Deliverables: Website pages and possibly blog articles (to be confirmed)
- Deadline: Website launch around the end of the month (to be confirmed)

## Questions for the client
- Which website pages do you need written, for example Home, About, Shop, Product pages and FAQ?
- How many products will be on the site, and do they each need a description?
- How many blog articles would you like, and how often?
- What is the exact launch date, and when do you need the first drafts?
- What budget range do you have in mind for this project?
- Do you have a logo, brand colours or examples of websites and writing you like?
`;

/* ── Lesson 73 lab: packages and pricing ───────────────────────────────── */
const PRICE_BRIEF = `You have worked out your **target hourly rate: ₦8,000** (from your monthly income goal, business costs and realistic billable hours; figures for practice). Your time estimates, including research, writing, revisions and admin:

- One 1,000-word SEO blog article: 5 hours
- One website page (homepage, About or service page): 4 hours
- One marketing email: 2 hours

Build three monthly packages:
- **Starter:** 2 blog articles a month.
- **Growth:** 4 blog articles and 4 emails a month.
- **Launch (one-off project):** 5 website pages and 5 emails.

Pricing rules: price = total hours × hourly rate. The Growth package is a monthly retainer, so it gets a **10% discount**. Round nothing.`;

const PRICE_DOC = `# My service packages

| Package | What's included | Hours | Price |
|---------|-----------------|-------|-------|
| Starter |  |  |  |
| Growth |  |  |  |
| Launch |  |  |  |

## Package descriptions
[One "### " heading per package with two or three sentences on who it is for and what the client gets.]
`;

const PRICE_DONE = `# My service packages

| Package | What's included | Hours | Price |
|---------|-----------------|-------|-------|
| Starter | 2 SEO blog articles a month | 10 | ₦80,000 a month |
| Growth | 4 SEO blog articles and 4 marketing emails a month | 28 | ₦201,600 a month |
| Launch | 5 website pages and 5 marketing emails | 30 | ₦240,000 one-off |

## Package descriptions
### Starter
For small businesses that want to start ranking in search. You receive two researched 1,000-word articles a month, each with a meta title and description.

### Growth
For businesses ready to grow with content and email together. You receive four articles and four marketing emails every month, at a 10% discount for a monthly retainer.

### Launch
For businesses opening a new website. You receive five website pages and a five-email launch campaign, delivered as one project.
`;

/* ── Lesson 74 lab: a marketplace proposal ─────────────────────────────── */
const JOB_POST = `A job post on a freelance marketplace:

> **Need a writer for our pharmacy blog (Abuja)**
> We are CareFirst Pharmacy with 3 branches in Abuja. We want 4 blog articles a month on everyday health topics (malaria prevention, managing blood pressure, safe use of antibiotics) for our customers. Must be accurate and easy to read. Please tell us about relevant experience and how you will make sure the health information is correct. Budget: ₦100,000–₦150,000 a month.

Your relevant facts: you have written 45 SEO articles, including 12 for a dental clinic in Enugu (one reached position 1 on Google for its keyword); you always fact-check against reliable sources; you are happy to have a pharmacist review each article before publishing.`;

const PITCH_DOC = `# Proposal for CareFirst Pharmacy

[Your marketplace proposal. Open with their need, not your life story.]
`;

const PITCH_DONE = `# Proposal for CareFirst Pharmacy

Hello CareFirst team,

You need four accurate, easy-to-read health articles a month that your customers can trust. That is exactly the kind of writing I do.

I have written 45 SEO articles, including 12 for a dental clinic in Enugu. One of them reached position 1 on Google for its keyword and brought the clinic new patients.

Accuracy matters most in health content, so this is how I work:

- I research every article from reliable sources such as the WHO and the Nigeria Centre for Disease Control, and list them at the end.
- I write in plain English for everyday readers, at about a grade 8 reading level.
- A CareFirst pharmacist reviews each article before it is published.

For your first month, I suggest these titles: "How to protect your family from malaria in the rainy season", "5 everyday habits that help control blood pressure", "Why you should finish your antibiotics", and "When to see a pharmacist and when to see a doctor".

My price for four articles a month is ₦140,000. I can send the first article within 7 days of starting.

Would a 15-minute call this week be helpful to agree the topics?

Best regards,
Amara Obi
`;

/* ── Lesson 75 lab: the practical ──────────────────────────────────────── */
const PRAC_BRIEF = `**The client:** Mr Tayo Ogunleye, founder of **BuildRight Supplies**, a building materials company in Lagos with a website that has not been updated in two years. He wants more contractors to find the company online and request quotes. On a call, he told you:

- He wants a refreshed website (Home, About, Products, Contact) and regular blog content.
- He has no in-house writer and little time to review drafts.
- His budget is around ₦300,000 for the website and up to ₦150,000 a month after that.
- He wants the new website live by 30 June.

Your rates (practice figures): ₦8,000 an hour. A website page takes you 4 hours; a 1,000-word blog article takes 5 hours. Your terms: 50% deposit before starting one-off projects; two rounds of revisions included; copyright passes to the client on full payment.`;

const PRAC_DOC = `# BuildRight Supplies: service package and proposal

## Service package
| Package | What's included | Price |
|---------|-----------------|-------|
|  |  |  |

## Proposal
### The challenge
### What I will deliver
### Timeline
### Investment
### Terms
### Next steps
`;

const PRAC_DONE = `# BuildRight Supplies: service package and proposal

## Service package
| Package | What's included | Price |
|---------|-----------------|-------|
| Website refresh | 4 website pages (Home, About, Products, Contact), written and revised | ₦128,000 one-off |
| Monthly content | 3 SEO blog articles a month for contractors | ₦120,000 a month |

## Proposal
### The challenge
BuildRight Supplies has the products contractors need, but its website has not changed in two years, so contractors searching online find competitors first. You also have little time to write or review content yourself.

### What I will deliver
- Four new website pages: Home, About, Products and Contact, each written to help contractors request a quote
- Three SEO blog articles a month on topics contractors search for, such as choosing cement grades and estimating materials
- A short summary with every delivery, so you can approve drafts quickly

### Timeline
- Week 1 (from 2 June): a 30-minute call to agree messages, then first drafts of all four pages by 9 June
- Week 2: your feedback, then final pages by 16 June, ready for the developer
- 30 June: the website goes live
- July onwards: three blog articles delivered by the 15th of each month

### Investment
The website refresh costs ₦128,000 (16 hours at ₦8,000). Monthly content costs ₦120,000 a month for three articles (15 hours). Both are within the budget you mentioned.

### Terms
- A 50% deposit (₦64,000) is due before the website work starts, and the balance on delivery of the final pages.
- Two rounds of revisions are included for every page and article.
- Copyright in all the writing passes to BuildRight Supplies on full payment.
- Monthly content is invoiced at the start of each month and can be cancelled with 30 days' notice.

### Next steps
If you are happy with this proposal, reply to confirm and I will send the agreement and the deposit invoice. Once the deposit is paid, we can hold our first call on 2 June.
`;

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 71 · 19.1 – 19.4
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "cw-l71-freelance",
    moduleId: "cw-m19-freelancing",
    sectionId: SECTION_ID,
    order: 1,
    covers: ["19.1", "19.2", "19.3", "19.4"],
    title: "Careers, Freelancing, Services and Niches",
    subtitle: "The ways to earn from writing, and how to choose what you offer and to whom",
    estimatedMinutes: 40,
    intro:
      "Part Six turns your skills into income. Many writers work in a job, many freelance, and many do both. This lesson maps the options and helps you decide what to sell and who to sell it to.",

    atoms: [
      {
        id: "a-cw-writing-careers",
        title: "Career opportunities in professional writing",
        explain:
          "You met the writing roles in Module 1. Now consider how they are employed. In-house roles: content writer, copywriter, communications officer, technical writer, social media manager or editor employed by one organisation (banks, telecoms, fintechs, NGOs, government, media, manufacturers). Agency roles: writing for many clients at a marketing, PR, advertising or content agency, often faster-paced and a strong place to learn. Freelance: self-employed, serving several clients locally or internationally, paid per project, per word, per hour or by monthly retainer. Hybrid: a job plus freelance work, or freelance work that grows into a small agency. Each path builds the same core skills; what differs is income stability, variety, independence and the business skills required. Many writers start in-house or at an agency, build a portfolio and contacts, then freelance.",
      },
      {
        id: "a-cw-freelance-fundamentals",
        title: "Freelance writing fundamentals",
        explain:
          "A freelance writer runs a small business. Besides writing, you handle sales (finding and winning clients), client service (communication, revisions), project management (deadlines, several clients at once), finance (pricing, invoices, chasing payments, saving for quiet months and tax), legal basics (contracts, ownership, confidentiality) and marketing (your portfolio, LinkedIn, referrals). Practical foundations: a professional email address and signature, a simple portfolio (Module 20), a way to receive payments (a business bank account; for international clients, a payment service that works in Nigeria), templates for proposals, contracts and invoices, a calendar for deadlines, and a record of income and expenses. Expect income to be uneven at first: keep a buffer of three months' expenses where possible, and do not quit a job before freelance income is steady.",
      },
      {
        id: "a-cw-services",
        title: "Types of writing services to offer",
        explain:
          "Turn the skills from this course into services clients recognise and buy: blog articles and SEO content; website copy (homepages, About, service and product pages); social media content and calendars; email newsletters and campaigns; product descriptions for e-commerce; landing pages and sales pages; ad copy; case studies and white papers; press releases; business documents (proposals, reports, company profiles); technical writing (user guides, SOPs, documentation); CVs, cover letters and LinkedIn profiles; editing and proofreading; and content strategy. Start with two or three services you can deliver excellently and show in your portfolio, describe each by what the client receives (\"two 1,000-word SEO articles with meta titles\") rather than by your process, and add services as clients ask for them.",
      },
      {
        id: "a-cw-niches",
        title: "Identifying profitable writing niches",
        explain:
          "A niche is a specialism: an industry (fintech, healthcare, real estate, agriculture, education, software), a type of writing (email, SEO, technical, grant writing), or both. Specialists usually earn more than generalists because they learn the industry's language and problems, write faster and more accurately, and become the obvious choice (\"the fintech writer\"). A profitable niche has four features: businesses in it need a lot of content; they have budgets; the content matters to their revenue or reputation; and you have, or can build, real knowledge of it. Test a niche by researching companies in it, the content they publish and the job posts they write. Express your positioning in one sentence: \"I help [specific clients] [achieve a result] with [services].\" You can still accept other work; a niche guides your marketing, not every job you take.",
        decision: {
          scenario: "A new freelancer describes herself on LinkedIn as \"Writer: I write anything for anyone.\"",
          question: "What is the best advice?",
          options: [
            { id: "a", text: "Choose a niche and write a positioning statement, e.g. \"I help fintech startups earn customers' trust with SEO articles and email campaigns\"", why: "Right. Specialists are easier to find, trust and pay more. A niche guides marketing without limiting every job." },
            { id: "b", text: "Keep it: being general gets more work", whyWrong: "Clients search for specific skills and prefer writers who know their industry." },
            { id: "c", text: "List every service in the headline", whyWrong: "A long list reads as unfocused." },
            { id: "d", text: "Lower her prices instead", whyWrong: "Positioning, not price, is the problem." },
          ],
          correct: "a",
        },
      },
      {
        id: "a-cw-positioning",
        title: "Writing your positioning statement",
        explain:
          "Your positioning statement is the one sentence that tells a potential client who you help, with what, and to what end. Use the formula \"I help [specific clients] [achieve a result] with [services].\" Make each part concrete: \"fintech startups in Nigeria\" rather than \"businesses\"; \"earn customers' trust\" or \"get more quote requests\" rather than \"grow\"; \"SEO articles and email campaigns\" rather than \"content\". Then support it with a short niche profile (industry, ideal client, why this niche) and two or three services described by what the client receives. Use the same statement on LinkedIn, your portfolio, your marketplace profile and the first line of your pitches, so every place a client meets you says the same clear thing.",
        writingLab: {
          task:
            "Define your freelance positioning. Positioning statement: one sentence starting \"I help\", naming specific clients, a result and services. Niche: fill Industry, Ideal client (at least 8 words) and Why this niche (at least 20 words, giving reasons such as demand, budgets and your strengths). Services: three bullets, each naming a service and what the client receives, with at least two including a quantity (for example, number of articles or emails).",
          doc: NICHE_DOC,
          tests: [
            { label: "Positioning: one sentence starting \"I help\"", check: String.raw`const p = section('Positioning statement') || ''; return sentences(p).length === 1 && /^I help\b/.test(p.trim()) && words(p) >= 10 && / with /i.test(p);`, fail: "Write one sentence: \"I help [clients] [result] with [services].\"" },
            { label: "Positioning avoids \"anyone\" and \"everything\"", check: String.raw`return !/(anyone|everyone|everything|all kinds|any business)/i.test(section('Positioning statement') || '');`, fail: "Name specific clients, not \"anyone\"." },
            { label: "Niche fields filled with reasons", check: String.raw`const n = section('Niche'); return words(field(n, 'Industry') || '') >= 1 && words(field(n, 'Ideal client') || '') >= 8 && words(field(n, 'Why this niche') || '') >= 20;`, fail: "Fill Industry, Ideal client (8+ words) and Why this niche (20+ words)." },
            { label: "Three services with what the client receives", check: String.raw`const s = bullets(section('Services')); return s.length >= 3 && s.every((x) => /:/.test(x) && words(x) >= 8) && s.filter((x) => /\d|\b(one|two|three|four|five)\b/i.test(x)).length >= 2;`, fail: "Write three services as \"Service: what the client receives\", with quantities in at least two." },
          ],
          solution: NICHE_DONE,
          hint: "Start from the work you most enjoyed in this course and the industry you know best.",
          successMessage: "A clear position in the market. Use the statement on LinkedIn, your portfolio and every pitch.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 72 · 19.5 – 19.6
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "cw-l72-briefs",
    moduleId: "cw-m19-freelancing",
    sectionId: SECTION_ID,
    order: 2,
    covers: ["19.5", "19.6"],
    title: "Client Requirements and Briefs",
    subtitle: "Finding out what a client really needs, and writing it down",
    estimatedMinutes: 35,
    intro:
      "Most failed freelance projects fail at the start: the writer and client meant different things. This lesson shows how to uncover what a client needs and turn it into a brief you both agree.",

    atoms: [
      {
        id: "a-cw-client-requirements",
        title: "Understanding client requirements",
        explain:
          "Clients often describe what they want (\"something nice for our website\") rather than what they need (more online orders from women who already follow them on Instagram). Your job is to find the need behind the request. Ask about: the business goal (what should change because of this work?); the audience; the deliverables exactly (which pages, how many articles, what length); the deadline and why it matters; the budget range; brand voice and examples they like or dislike; who will review and approve the work; what they will provide (product information, access to experts, images); and how success will be measured. Listen more than you talk, take notes, repeat back what you heard, and never quote a price before you know the scope.",
        decision: {
          scenario: "A client writes: \"We need content for the website. Budget is small. Launch is soon.\"",
          question: "What should you do before quoting?",
          options: [
            { id: "a", text: "Summarise what you understand and ask specific questions about pages, quantities, launch date and budget range", why: "Right. You cannot price or plan work you have not defined." },
            { id: "b", text: "Quote a low price to win it, then work out the details", whyWrong: "An undefined scope at a low price usually means unpaid extra work." },
            { id: "c", text: "Start writing the homepage immediately", whyWrong: "You may write the wrong thing, and nothing protects you if they do not pay." },
            { id: "d", text: "Ignore the message because the budget is small", whyWrong: "Ask first: the scope may fit their budget." },
          ],
          correct: "a",
        },
      },
      {
        id: "a-cw-interpreting-briefs",
        title: "Writing and interpreting client briefs",
        explain:
          "When a client sends a brief, interpret it critically: what is stated, what is assumed, what is missing or contradictory (\"blog and the pages too\" with \"budget is not much\"; \"end of the month I think\")? When a client sends no brief, write one: summarise what you understand under clear headings (client, product, audience, goal, deliverables, deadline, budget, voice, approvals), mark anything uncertain as \"to be confirmed\", and send a short list of specific questions. Questions should be easy to answer (offer options: \"Which pages: Home, About, Shop, Product pages, FAQ?\"), grouped, and limited to what you need to quote and plan. Once answered, send the final brief back for confirmation; it becomes the basis of your proposal and protects both sides from \"that's not what I asked for\".",
        writingLab: {
          task:
            "Turn Mrs Adebayo's message into a draft brief. Fill each field in \"What I understand\" from her message (at least 4 words each), marking the uncertain ones (deliverables and deadline) with \"to be confirmed\". Then write at least five specific questions, each ending with \"?\", covering which pages, how many blog articles, the exact launch date, the budget range, and brand voice or examples.",
          brief: MESSY_BRIEF,
          doc: MESSY_DOC,
          tests: [
            { label: "Every field filled from the message", check: String.raw`const s = section('What I understand'); return ['Client', 'Product', 'Audience', 'Goal', 'Deliverables', 'Deadline'].every((f) => words(field(s, f) || '') >= 4);`, fail: "Fill every field with at least four words from what she told you." },
            { label: "Uncertain items marked \"to be confirmed\"", check: String.raw`const s = section('What I understand'); return /to be confirmed|tbc/i.test(field(s, 'Deliverables') || '') && /to be confirmed|tbc/i.test(field(s, 'Deadline') || '');`, fail: "Mark the deliverables and deadline as \"to be confirmed\": she was not sure." },
            { label: "Five or more questions", check: String.raw`return bullets(section('Questions')).filter((q) => /\?$/.test(q) && words(q) >= 5).length >= 5;`, fail: "Write at least five specific questions ending with \"?\"." },
            { label: "Questions cover pages, articles, date, budget and voice", check: String.raw`const q = section('Questions') || ''; return /page/i.test(q) && /(blog|article)/i.test(q) && /(date|when)/i.test(q) && /budget/i.test(q) && /(voice|logo|colour|color|example|like)/i.test(q);`, fail: "Ask about which pages, how many articles, the exact date, the budget range, and brand voice or examples." },
          ],
          solution: MESSY_DONE,
          hint: "Read her message sentence by sentence and ask, for each: is this definite, or does it need confirming?",
          successMessage: "A vague WhatsApp message turned into a brief and five questions. Now you can quote with confidence.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 73 · 19.7 – 19.9
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "cw-l73-pricing",
    moduleId: "cw-m19-freelancing",
    sectionId: SECTION_ID,
    order: 3,
    covers: ["19.7", "19.8", "19.9"],
    title: "Packages, Pricing and Proposals",
    subtitle: "Turning services into offers, setting prices that sustain you, and winning the work",
    estimatedMinutes: 45,
    intro:
      "Pricing is where many talented writers fail as businesses. This lesson shows how to package your services, calculate prices that pay your bills, and present them in proposals clients accept.",

    atoms: [
      {
        id: "a-cw-packages",
        title: "Creating service packages",
        explain:
          "A package is a defined bundle of work at a fixed price: what is included, how many, how often, how many revisions, and the timeline. Packages make buying easy (clients compare a few clear options rather than negotiating every detail), make your income more predictable, and prevent scope creep because the limits are stated. A common structure is three tiers (for example Starter, Growth and Launch or Premium), each for a different client stage, with the middle option designed as the best value. Describe each package by the client's outcome and what they receive, list exactly what is included and what is not, and include the number of revision rounds. Monthly packages paid as a retainer (a fixed monthly fee for ongoing work) give you steady income, so many freelancers offer a small discount for them.",
      },
      {
        id: "a-cw-pricing",
        title: "Pricing writing services",
        explain:
          "Writers price in four main ways: per word (common for articles, simple but rewards length over value), per hour (fair for unclear work, but punishes you for getting faster), per project (a fixed price for defined deliverables; the most common for experienced freelancers), and retainers (monthly fees for ongoing work). Whatever you show the client, calculate from your own numbers. Start with your target monthly income, add business costs (internet, power, software, equipment) and an allowance for tax and savings, and divide by realistic billable hours (often 60 to 100 a month, because marketing, admin and revisions take time). That gives your target hourly rate. Then estimate each job's hours honestly (research, writing, revisions, communication), multiply, and compare with the market and the value to the client. Raise prices as your skill, results and demand grow, and do not compete only on being cheapest.",
        example: "Target income ₦480,000 + costs ₦80,000 = ₦560,000 a month\n₦560,000 ÷ 70 billable hours = ₦8,000 an hour\nOne 1,000-word SEO article ≈ 5 hours → ₦40,000",
        writingLab: {
          task:
            "Build three packages from the brief. For each, write what is included, the total hours, and the price (hours × ₦8,000; the Growth package gets a 10% retainer discount). Show prices with ₦ and commas, and say whether each is monthly or one-off. Then describe each package under its own \"### \" heading in two or three sentences: who it is for and what the client gets.",
          brief: PRICE_BRIEF,
          doc: PRICE_DOC,
          tests: [
            { label: "Starter: 10 hours, ₦80,000", check: String.raw`const r = rows(doc).find((c) => /^starter/i.test(c[0])) || []; return num(r[2]) === 10 && /₦\s?80,000/.test(r[3] || '');`, fail: "Starter: 2 articles × 5 hours = 10 hours; 10 × ₦8,000." },
            { label: "Growth: 28 hours, ₦201,600 after the 10% discount", check: String.raw`const r = rows(doc).find((c) => /^growth/i.test(c[0])) || []; return num(r[2]) === 28 && /₦\s?201,600/.test(r[3] || '');`, fail: "Growth: (4 × 5) + (4 × 2) = 28 hours; 28 × ₦8,000 = ₦224,000; minus 10%." },
            { label: "Launch: 30 hours, ₦240,000", check: String.raw`const r = rows(doc).find((c) => /^launch/i.test(c[0])) || []; return num(r[2]) === 30 && /₦\s?240,000/.test(r[3] || '');`, fail: "Launch: (5 × 4) + (5 × 2) = 30 hours; 30 × ₦8,000." },
            { label: "Each price says monthly or one-off", check: String.raw`const r = rows(doc).filter((c) => /^(starter|growth|launch)/i.test(c[0])); return r.length === 3 && r.every((c) => /(month|one-off|one off|once)/i.test(c[3] || '')) && r.every((c) => words(c[1]) >= 4);`, fail: "Describe what's included in each row, and add \"a month\" or \"one-off\" to each price." },
            { label: "Three package descriptions", check: String.raw`return ['Starter', 'Growth', 'Launch'].every((p) => { const t = (sections(p)[0] || {}).text || ''; const n = sentences(t).length; return n >= 2 && n <= 3; });`, fail: "Write two or three sentences under a \"### \" heading for each package." },
          ],
          solution: PRICE_DONE,
          hint: "Calculate hours first, row by row, then prices. Apply the discount only to Growth.",
          successMessage: "Three packages priced from your real time and rate. No guessing, no undercharging.",
        },
      },
      {
        id: "a-cw-client-proposals",
        title: "Writing proposals for clients",
        explain:
          "A freelance proposal uses the business proposal structure from Module 13, shortened for a single client. Open with their goal and challenge in their words, so they see you listened. Then: what you will deliver (specific deliverables, quantities and formats); your approach (how you will research, write and review, especially anything that reduces their risk); the timeline with dates; the price, clearly, linked to the scope (offering two options can help); the terms (deposit, revisions, ownership, cancellation); proof (relevant results and samples); and a single next step. Keep it to one or two pages, send it quickly while the client is interested, and follow up after a few days. A proposal is persuasive writing: everything you learned about benefits, proof and calls to action applies.",
        decision: {
          scenario: "A client offers ₦3,000 for a researched 1,500-word article that will take you about 6 hours. Your target rate is ₦8,000 an hour.",
          question: "What is the best response?",
          options: [
            { id: "a", text: "Politely explain your price (about ₦48,000 for that scope), or offer a smaller scope that fits their budget", why: "Right. Price from your real time and costs; offer options instead of working at a loss." },
            { id: "b", text: "Accept to build experience, and do it fast with AI and no research", whyWrong: "Cutting quality damages your reputation and the client's." },
            { id: "c", text: "Accept and work for ₦500 an hour", whyWrong: "That is not a sustainable business." },
            { id: "d", text: "Ignore the client rudely", whyWrong: "Be professional: they may return with a bigger budget or refer others." },
          ],
          correct: "a",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 74 · 19.10 – 19.13
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "cw-l74-clients",
    moduleId: "cw-m19-freelancing",
    sectionId: SECTION_ID,
    order: 4,
    covers: ["19.10", "19.11", "19.12", "19.13"],
    title: "Finding Clients and Keeping Them",
    subtitle: "Client acquisition, finding work online, marketplaces and client relationships",
    estimatedMinutes: 45,
    intro:
      "Good writing does not find clients by itself. This lesson covers where freelance work comes from, how marketplaces work, and how to turn one project into a long relationship.",

    atoms: [
      {
        id: "a-cw-client-acquisition",
        title: "Client acquisition strategies",
        explain:
          "Freelancers win clients in five main ways. Referrals: satisfied clients and contacts recommending you, usually the best clients, so ask for referrals and testimonials when a project goes well. Your network: former colleagues, classmates, church, community and professional groups; tell people specifically what you do (your positioning statement). Content marketing: posting useful content about your niche on LinkedIn or a blog so clients find and trust you. Direct outreach: researched, personalised pitches to businesses that clearly need your services (\"Your blog has not been updated since March; here are three article ideas for your customers\"). And marketplaces and job boards (next atoms). Track every lead and conversation in a simple spreadsheet, follow up, and spend some time on acquisition every week, even when busy, to avoid feast-and-famine cycles.",
      },
      {
        id: "a-cw-online-opportunities",
        title: "Finding writing opportunities online",
        explain:
          "Online, writing work appears on: LinkedIn (job posts, and posts from companies and founders asking for writers; search \"content writer\" and filter by remote or location); job boards (Jobberman and MyJobMag in Nigeria; international remote boards; ProBlogger's job board for writers); company career pages; publications that pay contributors (read their submission guidelines and pitch editors with specific ideas); agencies that hire freelance writers; and communities and newsletters for writers. Protect yourself from scams: never pay to apply or to receive a \"starter kit\", be wary of clients who want a large free \"test\", check that a company and person really exist, keep communication and payment on safe, traceable channels, and never share bank logins or one-time codes.",
      },
      {
        id: "a-cw-marketplaces",
        title: "Introduction to freelance marketplaces",
        explain:
          "Freelance marketplaces connect clients and freelancers and handle contracts and payment, for a fee. Upwork: clients post jobs and freelancers send proposals; good for building long-term client relationships, with a service fee taken from earnings. Fiverr: freelancers list fixed-price \"gigs\" (packages) that clients buy; good for clearly defined services. Others include Contra, Freelancer.com, and niche or regional platforms. To succeed: complete your profile with a niche headline, a strong overview and portfolio samples; start with smaller, well-matched jobs to earn reviews; send tailored proposals rather than templates; deliver early and communicate well, because reviews drive future work; and read each platform's rules, fees and payment methods available in Nigeria. Treat marketplaces as one channel, not your whole business: aim to build direct relationships and referrals too, within the platform's rules.",
        decision: {
          scenario: "On a marketplace, a job asks: \"Tell us about relevant experience and how you will make sure health information is correct.\"",
          question: "Which proposal opening is best?",
          options: [
            { id: "a", text: "\"You need four accurate, easy-to-read health articles a month that your customers can trust. That is exactly the kind of writing I do.\"", why: "Right. It starts with their need, and the rest can answer their two questions directly." },
            { id: "b", text: "\"Dear Sir, I am a hardworking writer with passion. I have read your job and I am interested.\"", whyWrong: "Generic, about you, and answers neither question." },
            { id: "c", text: "\"Check my profile.\"", whyWrong: "Makes the client do the work; they will move on." },
            { id: "d", text: "A copied template sent to every job", whyWrong: "Clients recognise templates instantly." },
          ],
          correct: "a",
        },
      },
      {
        id: "a-cw-client-relationships",
        title: "Client communication and relationship management",
        explain:
          "Clients return to writers who are easy to work with, not only talented ones. Respond within one working day; confirm what you will deliver and when; send work on or before the deadline with a short note (what is attached, any questions, what you need next); make feedback easy (\"Please reply with comments in the document by Thursday\"); update clients early if something changes; keep records of agreements in writing; and be pleasant even when a client is difficult. After a project, ask for feedback and a testimonial, suggest the next useful piece of work, and keep in touch (an occasional useful article or idea). Long-term clients on retainers provide stable income and better work, because you learn their business deeply.",
        writingLab: {
          task:
            "Write your marketplace proposal to CareFirst Pharmacy. Open with their need (not \"I am\" or \"Dear Sir\"). Answer both questions in the post: your relevant experience (with numbers) and how you will ensure accuracy (at least three bullets, including reliable sources and a pharmacist review). Suggest at least three specific article titles on their topics. Give a price within their budget and a delivery time. End with one easy question. 150 to 300 words, plain English, and no promises you cannot keep (no \"guaranteed\" rankings).",
          brief: JOB_POST,
          doc: PITCH_DOC,
          tests: [
            { label: "Opens with their need", check: String.raw`const b = units(doc).filter((u) => !/^(hello|hi|dear)\b/i.test(u) && words(u) > 4); const first = b[0] || ''; return /\byou\b|\byour\b/i.test(first) && !/^(I am|I'm|Dear Sir)/i.test(first);`, fail: "Start with the client's need (\"You need…\"), not with yourself." },
            { label: "Relevant experience with numbers", check: String.raw`return /45/.test(doc) && /(12|dental|clinic)/i.test(doc) && /(position 1|top of google|ranked)/i.test(doc);`, fail: "Give your relevant experience: 45 articles, the 12 for a clinic, and the ranking." },
            { label: "Accuracy process: three bullets with sources and pharmacist review", check: String.raw`const b = bullets(doc); return b.length >= 3 && /(source|WHO|NCDC|reliable)/i.test(b.join(' ')) && /pharmacist/i.test(b.join(' '));`, fail: "Explain in three or more bullets how you will make the health information accurate, including reliable sources and a pharmacist review." },
            { label: "Three specific article titles on their topics", check: String.raw`const titles = (doc.match(/["“][^"”]{15,}["”]/g) || []); const t = titles.join(' '); return titles.length >= 3 && /malaria/i.test(t) && /(blood pressure)/i.test(t) && /antibiotic/i.test(t);`, fail: "Suggest at least three article titles in quotation marks, covering malaria, blood pressure and antibiotics." },
            { label: "Price within budget, delivery time, one closing question", check: String.raw`const p = nums(doc).filter((n) => n >= 100000 && n <= 150000); return p.length >= 1 && /(within|days|first article)/i.test(doc) && /\?/.test(sentences(doc).slice(-3).join(' '));`, fail: "Quote a price between ₦100,000 and ₦150,000, say when the first article will arrive, and end with a question." },
            { label: "150 to 300 words, no impossible promises", check: String.raw`return words(doc) >= 150 && words(doc) <= 300 && !/guarantee/i.test(doc);`, fail: "Keep to 150 to 300 words and do not guarantee rankings or results you cannot control." },
          ],
          solution: PITCH_DONE,
          hint: "The client asked two questions. Make sure a reader can find both answers in five seconds.",
          successMessage: "A proposal that answers the client's questions, shows relevant proof and makes the next step easy.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 75 · 19.14 – 19.16 · PRACTICAL 19.P
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "cw-l75-business",
    moduleId: "cw-m19-freelancing",
    sectionId: SECTION_ID,
    order: 5,
    covers: ["19.14", "19.15", "19.16", "19.P"],
    title: "Deadlines, Contracts and a Sustainable Business",
    subtitle: "Delivering reliably, protecting yourself, building to last, and the module practical",
    estimatedMinutes: 75,
    intro:
      "The final freelance skills protect your time, your money and your reputation. Then you put the whole module together: a service package, a pricing structure and a client proposal.",

    atoms: [
      {
        id: "a-cw-deadlines-revisions",
        title: "Meeting deadlines and managing revisions",
        explain:
          "Reliability is the quality clients value most. Agree realistic deadlines, add a buffer (if you think it will take three days, promise four or five), break large projects into milestones, and keep a calendar of every deadline across clients. If a delay is coming, tell the client early with a new date, never on the deadline day. Revisions are normal: state in your agreement how many rounds are included (two is common), what counts as a revision (changes within the agreed brief) versus new work (a new topic or extra pages, quoted separately), and how feedback should be given (consolidated in one document by one person, by a date). When feedback arrives, respond professionally, make the changes, and ask questions about anything unclear. If revisions go beyond the agreement, point back to it politely and offer a quote for the extra work.",
      },
      {
        id: "a-cw-contracts",
        title: "Contracts, ownership and payment terms",
        explain:
          "Use a written agreement for every project, even a short one confirmed by email. It should state: the parties; the scope and deliverables; the timeline; the price; payment terms (a deposit before starting, often 50% for one-off projects, with the balance on delivery; monthly retainers invoiced in advance; how payment is made; and what happens if payment is late); the number of revisions; ownership (in most freelance writing, copyright passes to the client when they pay in full, and you may ask to keep the right to show the work in your portfolio); confidentiality; credit or bylines; and how either side can end the agreement (notice period, payment for work done). Send professional invoices with an invoice number, date, your details, the client's details, the work, the amount and the payment details. Keep copies of everything. For large contracts, ask a lawyer to review your template once.",
        decision: {
          scenario: "A new client wants a ₦250,000 website project done, with payment \"after we launch\", and no written agreement.",
          question: "What is the professional response?",
          options: [
            { id: "a", text: "Send a short written agreement with the scope, price, a 50% deposit before starting and the balance on delivery", why: "Right. A written agreement and a deposit protect both sides and filter out clients who never intend to pay." },
            { id: "b", text: "Start immediately to show goodwill", whyWrong: "Launch dates slip, and you could wait months or never be paid." },
            { id: "c", text: "Demand 100% in advance", whyWrong: "Possible for small jobs, but a deposit is fairer and more widely accepted for projects." },
            { id: "d", text: "Refuse to work with new clients", whyWrong: "Protect yourself with terms rather than turning work away." },
          ],
          correct: "a",
        },
      },
      {
        id: "a-cw-sustainable-business",
        title: "Building a sustainable writing business",
        explain:
          "A sustainable writing business pays you reliably for years without burning you out. Its foundations: a clear niche and reputation; a mix of clients so no single client is more than about a third of your income; some recurring income (retainers); prices that rise with your skill and results; savings for quiet months and tax obligations (register your business and understand your tax position as your income grows); systems and templates (proposals, contracts, invoices, onboarding questions, checklists) so admin takes less time; continuous learning (new formats, tools and industries); and healthy limits on working hours. Review your business every quarter: income, best clients, most profitable services, time spent, and what to change. Over time, many writers specialise further, raise prices, move into strategy or editing, or build a small team or agency.",
      },
      {
        id: "a-cw-m19-practical",
        title: "Practical: service package, pricing and client proposal",
        explain:
          "Write BuildRight Supplies a service package with prices calculated from your rate, then a proposal that wins the work: their challenge in their words, what you will deliver, a dated timeline that meets their 30 June launch, the investment within their budget, your terms, and one clear next step.",
        writingLab: {
          task:
            "Service package: two rows (a website refresh of the four pages, and monthly blog content), each with what's included and a price calculated at ₦8,000 an hour (4 hours a page, 5 hours an article), within the client's budgets and marked one-off or monthly. Proposal: The challenge (in the client's terms, at least 30 words); What I will deliver (at least three bullets); Timeline (dated steps ending with the website live by 30 June); Investment (prices matching the package, with the hours); Terms (the 50% deposit with its amount, two revision rounds, copyright on full payment); Next steps (one clear action).",
          brief: PRAC_BRIEF,
          doc: PRAC_DOC,
          tests: [
            { label: "Website refresh priced correctly: ₦128,000, one-off", check: String.raw`const r = rows(section('Service package')).find((c) => /website/i.test(c[0])) || []; return /₦\s?128,000/.test(r[2] || '') && /one-off|one off/i.test(r[2] || '') && /(home|about|products|contact)/i.test(r[1] || '');`, fail: "4 pages × 4 hours × ₦8,000 = ₦128,000, one-off." },
            { label: "Monthly content priced from hours, within ₦150,000", check: String.raw`const r = rows(section('Service package')).find((c) => /(month|content|blog)/i.test(c[0])) || []; const p = num((r[2] || '').replace(/[^\d,]/g, '')); const n = num(r[1]); return /month/i.test(r[2] || '') && p > 0 && p <= 150000 && n > 0 && p === n * 5 * 8000;`, fail: "Price the monthly articles at 5 hours × ₦8,000 each, within ₦150,000 a month, and say how many articles." },
            { label: "The challenge, in the client's terms", check: String.raw`const c = sections('The challenge')[0]?.text || ''; return words(c) >= 30 && /(two years|outdated|not (been )?updated)/i.test(c) && /contractor/i.test(c);`, fail: "Describe their problem: a website unchanged for two years, contractors finding competitors." },
            { label: "Deliverables and a timeline that meets 30 June", check: String.raw`const d = bullets(sections('What I will deliver')[0]?.text || ''); const t = sections('Timeline')[0]?.text || ''; return d.length >= 3 && /30 June/i.test(t) && (t.match(/\d{1,2} (June|July)/gi) || []).length >= 2;`, fail: "List at least three deliverables, and give dated steps that end with the site live by 30 June." },
            { label: "Investment matches the package", check: String.raw`const i = sections('Investment')[0]?.text || ''; return /₦\s?128,000/.test(i) && /hours?/i.test(i);`, fail: "Restate the prices with the hours behind them." },
            { label: "Terms: deposit amount, revisions and ownership; one next step", check: String.raw`const t = sections('Terms')[0]?.text || ''; const n = sections('Next steps')[0]?.text || ''; return /50\s?%/.test(t) && /₦\s?64,000/.test(t) && /two rounds|2 rounds/i.test(t) && /copyright/i.test(t) && /full payment/i.test(t) && words(n) >= 10 && /(reply|confirm|sign|call)/i.test(n);`, fail: "State the 50% deposit (₦64,000), two revision rounds and copyright on full payment, then one clear next step." },
          ],
          solution: PRAC_DONE,
          hint: "Calculate the prices first; then every section of the proposal is built around them and the 30 June date.",
          successMessage: "A priced package and a proposal a busy founder can approve in one read. This is how freelance writers get paid properly.",
        },
      },
    ],

    task: {
      title: "Module 19 practical: launch your freelance offer",
      intro: "Set up the foundations of a real writing business.",
      prompts: [
        "Write your positioning statement, choose two or three services and build three packages priced from your own target rate.",
        "Create templates: a client questionnaire, a proposal, a short agreement and an invoice.",
        "Update your LinkedIn headline and About section with your positioning, and create a profile on one marketplace.",
        "Send five personalised pitches or proposals to real businesses or job posts that fit your niche.",
        "Set up a simple spreadsheet to track leads, projects, deadlines, invoices and income.",
      ],
      closing: "Module 20 brings everything together: your professional portfolio and the final capstone.",
    },

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
