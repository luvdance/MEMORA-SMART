/**
 * VIRTUAL ASSISTANT · MODULE 11 · FREELANCING, BUSINESS DEVELOPMENT AND
 * CLIENT ACQUISITION
 *
 * Curriculum 11.1 – 11.14 and the practical 11.P. The VA job market,
 * freelancing versus employment, niche and target clients, packages and
 * pricing, proposals and profiles, prospecting and interviews, onboarding
 * and contracts, expectations, invoicing and records, and long-term
 * relationships; then a profile, three packages and a proposal.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Spreadsheet model answers live in
 * lib/academy/desk/sheetSolutions.mjs; assessment answers in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

export const SECTION_ID = "va-s11-freelancing";

const PACKAGE_SHEET = {
  A1: "Item", B1: "Value",
  A2: "Hours per month", B2: 20,
  A3: "Hourly rate (USD)", B3: 12,
  A4: "Platform fee", B4: 0.1,
  A5: "You receive (USD)", B5: "",
};

const INVOICE = {
  A1: "Service", B1: "Hours", C1: "Rate (USD)", D1: "Amount (USD)",
  A2: "Inbox and calendar management", B2: 18, C2: 12,
  A3: "Travel research and booking", B3: 4, C3: 12,
  A4: "Monthly report preparation", B4: 3, C4: 15,
  A5: "Total", B5: "", C5: "", D5: "",
};

/* ── Lesson 70 lab: niche and target client ──────────────────────────── */
const NICHE_BRIEF = `Decide your own VA niche. Use what you have learned: the eight VA types (Module 1), the services you can now deliver (Modules 2–10), and what you enjoy and are good at.

**Example** (do not copy it):

> - Niche statement: I help busy real estate agents in the US manage their leads and listings so they can spend more time closing deals.
> - Who: independent real estate agents and small agencies in the US and Canada
> - Their problem: leads from websites go unanswered and listings fall out of date
> - Where they are: LinkedIn, Facebook groups for realtors, Upwork
> - Services: lead follow-up in the CRM, listing updates, viewing scheduling, inbox management, monthly reports`;

const NICHE_DOC = `# My VA niche

- Niche statement:
- Who:
- Their problem:
- Where they are:

## Services

## Why me
`;

const NICHE_DONE = `# My VA niche

- Niche statement: I help busy coaches and consultants run their inbox, calendar and client onboarding so they can spend more time coaching.
- Who: independent business and wellness coaches and small consulting firms in the UK and Nigeria
- Their problem: they lose hours to email and scheduling and new clients wait too long to get started
- Where they are: LinkedIn, Instagram and coaching communities on Facebook

## Services

- Manage the inbox daily with labels and priorities
- Schedule discovery calls and sessions across time zones
- Onboard new clients with welcome emails and intake forms
- Prepare session notes and follow-up summaries
- Send a weekly report of tasks completed

## Why me

I am organised and calm under pressure, and I have practised inbox triage, scheduling across time zones and client onboarding throughout this course. I communicate clearly with international clients.
`;

/* ── Lesson 72 lab: a proposal ────────────────────────────────────────── */
const JOB_BRIEF = `**Job post on Upwork:**

> **Virtual assistant for busy dental practice owner (10 hrs/week)**
> I own two dental clinics in Manchester, UK. I'm drowning in email and my calendar is a mess. I need someone to manage my inbox, schedule meetings with suppliers and my managers, and keep a simple weekly task list. Must be organised and have excellent written English. UK hours overlap needed (at least 9am–1pm UK time). Please start your proposal with the word "Manchester" so I know you read this.
> Budget: $10–$14/hour.

You are a VA in Lagos (WAT). In summer, UK time (BST) is the same as Lagos time; in winter, the UK is one hour behind. Your relevant work: from this course you have an executive inbox triage, a week of scheduling with time zones and a weekly status report in your portfolio. Your rate: $12/hour.`;

const PROPOSAL_DOC = `# Proposal

[Your proposal.]
`;

const PROPOSAL_DONE = `# Proposal

Manchester dental practice owner, I can take your inbox and calendar off your hands from week one.

Running two clinics means suppliers, managers and patients all competing for your attention. Here is how I would help:

- Inbox: sort your email every morning with labels and priorities, answer routine messages and flag only what needs you.
- Calendar: schedule supplier and manager meetings, with buffers and reminders.
- Weekly task list: a short list every Monday of what is done, in progress and needs your decision.

I am based in Lagos and work 9:00 to 17:00, which covers 9am to 1pm UK time all year (Lagos is the same as UK summer time and one hour ahead in winter). My portfolio includes an executive inbox triage, a week of scheduling across time zones and a weekly status report.

My rate is $12 per hour.

Could we have a 15-minute call this week? I would like to ask how you prefer to handle urgent patient issues.

Kind regards,
Amaka Obi
`;

/* ── Lesson 73 lab: outreach ──────────────────────────────────────────── */
const OUTREACH_BRIEF = `You want clients among **coaches**. You found **Tola Benson**, a career coach in London, on LinkedIn. Her recent post says: *"Booked out for May! Now if only I could keep up with my inbox..."* Her website shows she runs online workshops monthly and sells a course.

Write (1) a **LinkedIn message** (connection already accepted) of **50 to 110 words**, and (2) a **follow-up** to send **5 days later** if she does not reply, of **25 to 70 words**.`;

const OUTREACH_DOC = `# Outreach to Tola Benson

## Message

## Follow-up
`;

const OUTREACH_DONE = `# Outreach to Tola Benson

## Message

Hi Tola, congratulations on being booked out for May! Your post about keeping up with your inbox caught my eye. I'm a virtual assistant who helps coaches manage their email, scheduling and workshop admin, so they can focus on clients. With your monthly workshops and course, I imagine there's a lot of booking and follow-up behind the scenes. Would you be open to a 15-minute call next week to see if I could take some of that off your plate?

## Follow-up

Hi Tola, just following up on my message from last week. If inbox help isn't a priority right now, no problem at all. I'd be happy to send you a short checklist I use to cut inbox time for coaches. Would that be useful?
`;

/* ── Lesson 76 lab: the practical ─────────────────────────────────────── */
const PRAC_BRIEF = `Create your **freelancing profile**, **three service packages** and a **proposal** for this job post.

> **Upwork job: Admin VA for a growing online fashion store (Lagos-based owner)**
> I run Kora Threads, an online fashion store. I need a VA to answer customer emails and WhatsApp messages, update product listings on Shopify, and track orders in a Google Sheet. 15–20 hours a week, Nigerian working hours. Please mention which of these tasks you have done before.
> Budget: ₦250,000–₦350,000 per month.

Use your own name (or Amaka Obi in the example), your real skills from this course, and prices you would actually charge.`;

const PRAC_DOC = `# My freelance business

## Profile
- Title:
- Overview:
- Skills:
- Rate:

## Packages

| Package | Includes | Hours or limits | Price |
|---|---|---|---|

## Proposal
`;

const PRAC_DONE = `# My freelance business

## Profile
- Title: Virtual Assistant | Inbox, Calendar, Customer Support and E-commerce Admin
- Overview: I help busy business owners get hours back every week by managing their inbox, calendar, customers and online store admin. I am organised, fast and careful with details, and I communicate clearly with clients in Nigeria and abroad. I have a portfolio of practical work: an executive inbox triage, a scheduled week across time zones, a support desk of ten tickets, a verified lead list and a store launch project board. I work 9:00 to 17:00 WAT and reply within two working hours.
- Skills: Inbox management, Calendar management, Customer support, Shopify, Google Sheets, Canva, Trello, Data entry
- Rate: $12 per hour

## Packages

| Package | Includes | Hours or limits | Price |
|---|---|---|---|
| Starter | Inbox management and calendar scheduling | 10 hours a month | ₦120,000 a month |
| Growth | Starter plus customer emails and WhatsApp replies, order tracking sheet | 40 hours a month | ₦300,000 a month |
| Premium | Growth plus Shopify listing updates, weekly report and social media scheduling | 80 hours a month | ₦550,000 a month |

## Proposal

Kora Threads, I have done all three of the tasks you listed, and I would love to help your store grow.

- Customer emails and WhatsApp: I ran a ten-ticket support desk with replies, refunds within policy and escalations.
- Shopify listings: I planned a store launch, including uploading 40 products.
- Order tracking: I build Google Sheets with drop-downs, SUMIF totals and approval checks.

I work Nigerian hours, 9:00 to 17:00 WAT. My Growth package, 40 hours a month for ₦300,000, fits your 15–20 hours a week if we start there and review after the first month; for the full 20 hours a week I would quote ₦350,000.

Could we have a short call this week? I would like to know your busiest days for orders.

Kind regards,
Amaka Obi
`;

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 69 · 11.1 – 11.2
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "va-l69-market",
    moduleId: "va-m11-freelancing",
    sectionId: SECTION_ID,
    order: 1,
    covers: ["11.1", "11.2"],
    title: "The VA Job Market: Freelancing or Employment",
    subtitle: "Where the work is, what clients pay for, and the two ways to work",
    estimatedMinutes: 35,
    intro:
      "You now have the skills. This module turns them into income: finding clients, pricing your work, and running it as a business.",

    atoms: [
      {
        id: "a-va-job-market",
        title: "Understanding the virtual assistant job market",
        explain:
          "Demand for VAs comes from small business owners, founders, coaches, consultants, agencies, e-commerce stores and real estate agents around the world, and increasingly from local businesses. Work is found on freelance marketplaces (Upwork, Fiverr, Freelancer, PeoplePerHour), on LinkedIn and job boards, through VA agencies that place assistants with clients, through referrals, and by approaching businesses directly. Clients pay for reliability, communication, specific skills (an executive's inbox, Shopify, HubSpot, Canva) and results. Rates vary widely by skill, niche, experience, location and platform: beginners often start low to win reviews, while specialised VAs (executive support, e-commerce operations, real estate CRM, automation) earn several times more. Competition is strong for generic \"virtual assistant\" work and much weaker for clearly specialised, well-presented VAs, which is why niche and portfolio matter.",
      },
      {
        id: "a-va-freelance-vs-employed",
        title: "Freelancing versus remote employment",
        explain:
          "There are two main ways to work. As a freelancer, you are self-employed: you choose your clients, set your rates and hours, and can serve several clients, but income can be irregular, you find your own work, handle your own taxes and records, have no paid leave or benefits, and carry the risk of late payment. As a remote employee (of a company or a VA agency), you have one employer, a regular salary, often benefits and paid leave, training and colleagues, but less control over rates, hours and which work you do, and the employer sets the rules. Many VAs start one way and move to the other, or combine a part-time role with one or two freelance clients. Choose based on what you need now: stability, or flexibility and growth.",
        table: {
          caption: "The trade-offs.",
          headers: ["", "Freelancing", "Remote employment"],
          rows: [
            ["Income", "Variable; you set rates", "Regular salary"],
            ["Finding work", "You find your own clients", "The employer provides it"],
            ["Flexibility", "High: clients, hours, services", "Lower: set by the employer"],
            ["Benefits and leave", "None unless you build them in", "Often included"],
            ["Taxes and records", "Your responsibility", "Often handled by the employer"],
            ["Risk", "Late payment, gaps between clients", "Job loss, less control"],
          ],
        },
      },
      {
        id: "a-va-market-desk",
        title: "Freelancer or employee?",
        explain:
          "Decide whether each statement describes freelancing, remote employment, or both.",
        deskLab: {
          app: "generic",
          title: "Freelancing or employment?",
          task: "Choose Freelancing, Remote employment or Both for each statement.",
          fields: [{ key: "which", label: "Describes", type: "select", options: ["Freelancing", "Remote employment", "Both"] }],
          items: [
            { id: "f1", title: "You set your own rates and choose your clients", expect: { which: "Freelancing" } },
            { id: "f2", title: "You receive a fixed salary on the same day every month", expect: { which: "Remote employment" } },
            { id: "f3", title: "You work from home using digital tools", expect: { which: "Both" } },
            { id: "f4", title: "You must keep your own income records and save for tax", expect: { which: "Freelancing" } },
            { id: "f5", title: "Paid annual leave is usually included", expect: { which: "Remote employment" } },
            { id: "f6", title: "You can serve three clients at once", expect: { which: "Freelancing" } },
            { id: "f7", title: "Reliability and clear communication decide whether you keep the work", expect: { which: "Both" } },
          ],
          solution: { f1: { which: "Freelancing" }, f2: { which: "Remote employment" }, f3: { which: "Both" }, f4: { which: "Freelancing" }, f5: { which: "Remote employment" }, f6: { which: "Freelancing" }, f7: { which: "Both" } },
          successMessage: "You can now choose the path that suits your situation, with your eyes open.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 70 · 11.3 – 11.4
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "va-l70-niche",
    moduleId: "va-m11-freelancing",
    sectionId: SECTION_ID,
    order: 2,
    covers: ["11.3", "11.4"],
    title: "Your Niche and Your Target Clients",
    subtitle: "Choosing what you specialise in and exactly who you serve",
    estimatedMinutes: 40,
    intro:
      "\"I can do anything\" sounds flexible but sells badly. \"I help real estate agents never miss a lead\" sells.",

    atoms: [
      {
        id: "a-va-niche",
        title: "Identifying your VA niche and services",
        explain:
          "A niche is a focus: a type of client, a type of service, or both (\"inbox and calendar management for coaches\", \"Shopify support for fashion brands\", \"CRM and lead follow-up for real estate agents\"). A niche makes you easier to find, easier to trust (you speak the client's language and know their tools) and able to charge more. Choose it where four things overlap: skills you have (or can build fast), work you enjoy, real demand (search job posts and see what clients ask for) and clients who can pay. Write a niche statement: \"I help [who] [do what] so they can [result].\" Then list five or so services written as actions. You can change niche later; starting with one is what matters.",
      },
      {
        id: "a-va-target-clients",
        title: "Defining your target clients",
        explain:
          "Describe your ideal client as precisely as Module 6's ideal customer profile: their industry and role, business size, location and time zone, the problem that costs them time or money, what they already use (Gmail, Shopify, HubSpot), and where they spend time online (LinkedIn, Instagram, Facebook groups, Upwork). The more clearly you know them, the easier it is to write a profile that speaks to them, find them and start a conversation about their problem. Check that they can afford you and that there are enough of them.",
        decision: {
          scenario: "Two profile headlines for the same VA.",
          question: "Which is likely to win more clients?",
          options: [
            { id: "a", text: "\"Virtual assistant for coaches: inbox, calendar and client onboarding\"", why: "Right. A clear who and what: coaches recognise themselves immediately." },
            { id: "b", text: "\"Hardworking VA, I can do any task\"", whyWrong: "Generic: it competes with thousands of identical profiles." },
            { id: "c", text: "\"Jack of all trades\"", whyWrong: "Says nothing about the value or the client." },
            { id: "d", text: "\"Looking for any job, urgent\"", whyWrong: "Sounds desperate and gives no reason to choose you." },
          ],
          correct: "a",
        },
      },
      {
        id: "a-va-niche-lab",
        title: "Writing your niche",
        explain:
          "Define your own niche and target client. This becomes the foundation of your profile in the practical.",
        writingLab: {
          task:
            "Niche statement: one sentence starting \"I help\" that says who, what and the result (with \"so\" or \"so that\"). Who: the client type and location. Their problem: one specific sentence. Where they are: at least two places. Services: 4 to 6 bullets starting with verbs. Why me: 2 to 4 sentences that mention skills you have practised.",
          brief: NICHE_BRIEF,
          doc: NICHE_DOC,
          tests: [
            { label: "A niche statement: who, what and result", check: String.raw`const n = field(doc, 'Niche statement') || ''; return /^I help /i.test(n) && /\bso\b/i.test(n) && words(n) >= 12 && words(n) <= 40;`, fail: "Write one sentence: \"I help [who] [do what] so they can [result]\" (12 to 40 words)." },
            { label: "A specific client and problem", check: String.raw`return words(field(doc, 'Who') || '') >= 4 && words(field(doc, 'Their problem') || '') >= 8;`, fail: "Describe who your clients are and their specific problem." },
            { label: "Where to find them", check: String.raw`const w = field(doc, 'Where they are') || ''; return w.split(/,| and /).filter((x) => x.trim()).length >= 2;`, fail: "Name at least two places where your clients spend time." },
            { label: "4 to 6 services starting with verbs", check: String.raw`const b = bullets(section('Services') || ''); return b.length >= 4 && b.length <= 6 && b.every((x) => isAction(x) || /^(manage|schedule|onboard|prepare|send|answer|update|track|design|research|organise|organize|handle|draft|follow|coordinate|log|post|reply|build|enter|maintain|book|monitor)/i.test(x));`, fail: "List 4 to 6 services, each starting with a verb." },
            { label: "Why me: 2 to 4 sentences", check: String.raw`const n = sentences(section('Why me') || '').length; return n >= 2 && n <= 4;`, fail: "Explain in 2 to 4 sentences why a client should choose you." },
          ],
          solution: NICHE_DONE,
          hint: "Start from the module you enjoyed most in this course; that is often your niche.",
          successMessage: "A niche you can explain in one sentence. Everything you write from now on starts here.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 71 · 11.5 – 11.6
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "va-l71-packages-pricing",
    moduleId: "va-m11-freelancing",
    sectionId: SECTION_ID,
    order: 3,
    covers: ["11.5", "11.6"],
    title: "Service Packages and Pricing",
    subtitle: "Packaging your services, choosing a pricing model, and setting rates you can live on",
    estimatedMinutes: 45,
    intro:
      "Many new VAs undercharge, then resent their clients. Pricing is a skill, and packages make it much easier.",

    atoms: [
      {
        id: "a-va-packages",
        title: "Creating service packages",
        explain:
          "A package bundles services, limits and a price so clients can choose easily: for example Starter (10 hours a month: inbox and calendar), Growth (40 hours: plus customer support and reporting) and Premium (80 hours: plus social media and projects). Three tiers work well because many clients choose the middle one. Each package states what is included, the limits (hours, number of tasks or messages, response time, working days), the price and the billing (monthly in advance). A monthly retainer (a package paid monthly for a set number of hours or services) gives you predictable income and the client a reliable assistant. Say what happens with unused hours (usually they do not roll over) and with extra work (billed at your hourly rate, after approval).",
      },
      {
        id: "a-va-pricing",
        title: "Pricing your services",
        explain:
          "There are three common pricing models. Hourly: simple and fair for varied work; track time accurately with a tool such as Toggl or Clockify. Per project or task: a fixed price for a defined deliverable (a lead list of 100, a filing system set-up); estimate the hours carefully and add a buffer. Retainer packages: monthly, as above. To set your rate, research what VAs with similar skills charge on the platforms you will use; work out what you need to earn, counting your costs (internet, power, software, equipment), unpaid time (finding clients, admin) and taxes; and consider the value to the client. Quote foreign clients in their currency (usually US dollars or pounds). Remember platform fees: marketplaces take a percentage of what the client pays (often 10–20%), so build that in. Raise your rates as you gain reviews and skills, giving existing clients notice. Never compete only on being the cheapest.",
      },
      {
        id: "a-va-fee-sheet",
        title: "What you actually receive",
        explain:
          "A 20-hour monthly package at $12 an hour sounds like $240, but the platform takes a 10% fee. In B5, calculate what you receive: hours × rate × (1 − fee). =B2*B3*(1-B4)",
        exercise: {
          data: { ...PACKAGE_SHEET },
          rows: 5,
          cols: 2,
          target: "B5",
          expected: 216,
          mustUseFormula: true,
          lockedCells: ["A1", "B1", "A2", "A3", "A4", "A5"],
          task: "In B5, calculate the amount you receive after the platform fee.",
          hint: "=B2*B3*(1-B4)",
          successMessage: "$216, not $240. Price with the fee in mind, and change B3 to see what rate you would need to receive $240.",
        },
      },
      {
        id: "a-va-pricing-decision",
        title: "Holding your price",
        explain:
          "Clients sometimes push for lower rates. A professional response explains the value, offers a smaller scope rather than a lower rate, and is willing to walk away from clients who only want the cheapest.",
        decision: {
          scenario: "A prospective client likes your proposal at $12 an hour but says, \"Another VA offered $5. Can you match that?\"",
          question: "What is the best response?",
          options: [
            { id: "a", text: "Thank them, restate the value you bring, and offer a smaller package within their budget rather than cutting your rate", why: "Right. You protect your rate and still offer a way to work together." },
            { id: "b", text: "Match $5 immediately", whyWrong: "You would work for less than half your rate, and the client learns your price is negotiable." },
            { id: "c", text: "Insult the other VA", whyWrong: "Unprofessional, and it damages you, not them." },
            { id: "d", text: "Stop replying", whyWrong: "A polite, clear answer may still win the client." },
          ],
          correct: "a",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 72 · 11.7 – 11.8
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "va-l72-proposals-profiles",
    moduleId: "va-m11-freelancing",
    sectionId: SECTION_ID,
    order: 4,
    covers: ["11.7", "11.8"],
    title: "Proposals and Professional Profiles",
    subtitle: "Writing proposals that get replies, and profiles on Upwork, Fiverr, LinkedIn and more",
    estimatedMinutes: 50,
    intro:
      "Clients read dozens of proposals per job and decide in seconds. The ones that win show, in the first two lines, that the writer read the job and can solve the problem.",

    atoms: [
      {
        id: "a-va-proposals",
        title: "Writing compelling proposals",
        explain:
          "A winning proposal is short (100 to 200 words), specific to the job and about the client, not about you. Open with a line that shows you read the post and understand the need (and include any keyword the client asked for; some posts hide one to filter out copy-paste proposals). Then explain briefly how you would do the work, ideally as two to four bullets matching the client's tasks. Give proof: relevant experience, results or portfolio pieces. Address requirements such as hours and time zones directly. State your rate or price. End with a clear next step, such as a short call or a question about the work. Never send the same generic proposal to every job, never start with \"Dear Sir/Madam, I am the best candidate\", and never claim experience you do not have.",
        samples: [
          { label: "Generic", tone: "bad", text: "Dear Sir/Madam, I am a hardworking VA with many skills. I can do this job perfectly. Please hire me. Thanks." },
          { label: "Specific and about the client", tone: "good", text: "Manchester dental practice owner, I can take your inbox and calendar off your hands from week one. I work hours that cover 9am to 1pm UK time all year…" },
        ],
      },
      {
        id: "a-va-profiles",
        title: "Creating professional profiles",
        explain:
          "Every platform rewards a complete, specific profile. Use a clear, friendly, professional photo. Write a title that says your niche and services (\"Virtual Assistant | Inbox, Calendar and Customer Support for Coaches\"). Make the first two lines of the overview count, because they show in search results: who you help and the result. Then describe your services, tools, experience and how you work (hours, time zone, response time), and end with an invitation to contact you. List relevant skills, add portfolio samples, set your rate, and complete every section. On Upwork, clients post jobs and you send proposals (using Connects); a strong profile and early reviews matter. On Fiverr, you create gigs (fixed-price service packages) that clients buy. On LinkedIn, your headline, About section and posts let clients find you, and you can message them. Freelancer and PeoplePerHour work similarly to Upwork, with bids and offers. Keep profiles consistent across platforms, and never pay anyone to create fake reviews.",
        table: {
          caption: "How the main platforms work.",
          headers: ["Platform", "How clients find you", "Key profile element"],
          rows: [
            ["Upwork", "You send proposals to job posts; clients can also invite you", "Title, overview, portfolio, Job Success Score"],
            ["Fiverr", "Clients buy your gigs (fixed packages)", "Gig titles, packages, images, reviews"],
            ["LinkedIn", "Search, your posts and your messages", "Headline, About, featured work"],
            ["Freelancer / PeoplePerHour", "You bid on projects or post offers", "Profile, portfolio, reviews"],
          ],
        },
      },
      {
        id: "a-va-proposal-lab",
        title: "Writing a proposal",
        explain:
          "Write a proposal for the Manchester dental practice job.",
        writingLab: {
          task:
            "Start with the word \"Manchester\" as the client asked. Show you understand the need in the first sentence. Use 2 to 4 bullets matching the three tasks (inbox, meetings or calendar, weekly task list). Address the UK hours overlap (9am to 1pm UK time). Give proof from your portfolio. State your rate ($12 per hour, within the budget). End with a question or a call to action, then sign off. 100 to 210 words. Do not use \"Dear Sir\" or \"best candidate\".",
          brief: JOB_BRIEF,
          doc: PROPOSAL_DOC,
          tests: [
            { label: "Starts with \"Manchester\"", check: String.raw`const body = clean(doc).replace(/^#.*$/m, '').trim(); return /^Manchester\b/.test(body);`, fail: "The client asked you to start with the word \"Manchester\". Proposals that miss this are rejected without being read." },
            { label: "2 to 4 bullets covering the three tasks", check: String.raw`const b = bullets(doc); const t = b.join(' '); return b.length >= 2 && b.length <= 4 && /inbox|email/i.test(t) && /(calendar|meeting|schedul)/i.test(t) && /task list/i.test(t);`, fail: "Use 2 to 4 bullets that cover the inbox, scheduling meetings and the weekly task list." },
            { label: "Addresses the UK hours overlap", check: String.raw`return /(9\s?am|9:00)/i.test(doc) && /(1\s?pm|13:00)/i.test(doc) && /UK/i.test(doc);`, fail: "Show how your hours cover 9am to 1pm UK time." },
            { label: "Proof and rate", check: String.raw`return /portfolio/i.test(doc) && /\$\s?12/.test(doc);`, fail: "Mention proof from your portfolio and state your rate ($12 per hour)." },
            { label: "Ends with a question or call to action", check: String.raw`const p = paragraphs(doc); return p.slice(-3).some((x) => /\?/.test(x) || /(call|chat|talk)/i.test(x));`, fail: "End with a question or invite them to a short call." },
            { label: "100 to 210 words, no generic openings", check: String.raw`return words(doc) >= 100 && words(doc) <= 210 && !/(dear sir|best candidate|hardworking)/i.test(doc);`, fail: "Keep it between 100 and 210 words, without \"Dear Sir\", \"best candidate\" or \"hardworking\"." },
          ],
          solution: PROPOSAL_DONE,
          hint: "Read the job post twice. Every sentence of your proposal should answer something in it.",
          successMessage: "A proposal that proves you read the post, matches every task, and makes replying easy.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 73 · 11.9 – 11.10
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "va-l73-outreach-interviews",
    moduleId: "va-m11-freelancing",
    sectionId: SECTION_ID,
    order: 5,
    covers: ["11.9", "11.10"],
    title: "Prospecting, Outreach and Interviews",
    subtitle: "Finding clients directly, starting conversations, and preparing for interviews",
    estimatedMinutes: 45,
    intro:
      "The best clients are often not on job boards. Direct outreach, done respectfully, finds them before anyone else does.",

    atoms: [
      {
        id: "a-va-prospecting",
        title: "Client prospecting and outreach",
        explain:
          "Prospecting is finding potential clients who match your target profile: start with your warm network (former colleagues, friends with businesses, your church or community), then LinkedIn (search by role and industry, read their posts), Instagram and Facebook groups where your niche gathers, local businesses, and referrals from happy clients. Keep a simple tracker (name, business, where found, date contacted, reply, next step). Outreach is the first message. Make it personal (mention something specific about them), about their problem rather than your CV, short (under about 120 words), and end with a low-pressure question (\"Would you be open to a 15-minute call?\"). Follow up once or twice, politely, a few days apart, adding value (a useful tip or resource), then stop. Never spam, never send the same message to hundreds of people, and respect anyone who says no.",
      },
      {
        id: "a-va-interviews",
        title: "Interview preparation",
        explain:
          "Before an interview, research the client's business (website, social media, LinkedIn) and reread the job post. Prepare short stories for common questions using STAR (Situation, Task, Action, Result): \"Tell me about a time you managed several urgent tasks\", \"How do you handle a mistake?\", \"How do you keep information confidential?\", \"What tools do you use?\" Have your portfolio links ready to share. Expect a paid or short test task (an email reply, a scheduling task, a spreadsheet), and do it carefully and on time. Prepare your own questions: what success looks like in the first month, how they prefer to communicate, their busiest times, what tools they use. Test your internet, camera and headset beforehand, join early, dress professionally and confirm next steps at the end. Send a short thank-you message afterwards.",
        decision: {
          scenario: "An interviewer asks, \"Tell me about a time you handled competing priorities.\"",
          question: "Which answer is strongest?",
          options: [
            { id: "a", text: "A short STAR story: the situation, your task, what you did (asked the client to choose, delivered one on time and the other by an agreed time) and the result", why: "Right. A specific story with actions and a result is convincing." },
            { id: "b", text: "\"I'm very good at priorities.\"", whyWrong: "A claim without evidence." },
            { id: "c", text: "\"I've never had that problem.\"", whyWrong: "Unbelievable, and it avoids the question." },
            { id: "d", text: "A ten-minute story with no clear result", whyWrong: "Long and unfocused; STAR keeps it tight." },
          ],
          correct: "a",
        },
      },
      {
        id: "a-va-outreach-lab",
        title: "Writing outreach that gets replies",
        explain:
          "Write a LinkedIn message to Tola Benson and a follow-up.",
        writingLab: {
          task:
            "Message: greet Tola by name, mention her post or her business specifically, say what you do in one sentence focused on her problem, and end with a low-pressure question about a short call; 50 to 110 words; no attachments or CV talk. Follow-up: refer to your earlier message, make it easy to say no, offer something useful, and end with a question; 25 to 70 words.",
          brief: OUTREACH_BRIEF,
          doc: OUTREACH_DOC,
          tests: [
            { label: "Message: personal opening", check: String.raw`const m = section('Message') || ''; return /^(Hi|Hello|Dear) Tola/m.test(m) && /(post|booked|workshop|course|inbox)/i.test(m);`, fail: "Greet Tola by name and mention something specific: her post, her workshops or her course." },
            { label: "Message: focused on her problem, with a soft question", check: String.raw`const m = section('Message') || ''; return /(inbox|email|schedul|admin)/i.test(m) && /\?/.test(m) && /(call|chat)/i.test(m) && !/(\bCV\b|resume|attached)/i.test(m);`, fail: "Say how you help with her problem (inbox, scheduling, admin) and ask a low-pressure question about a short call. Leave out your CV." },
            { label: "Message: 50 to 110 words", check: String.raw`const w = words(section('Message') || ''); return w >= 50 && w <= 110;`, fail: "Keep the message between 50 and 110 words." },
            { label: "Follow-up: refers back, easy no, useful offer, question", check: String.raw`const f = section('Follow-up') || ''; return /(following up|my message|last week|earlier)/i.test(f) && /(no problem|not a priority|no worries|understand)/i.test(f) && /(checklist|tip|guide|template|resource)/i.test(f) && /\?/.test(f);`, fail: "Refer to your earlier message, make saying no easy, offer something useful (a checklist or tip), and end with a question." },
            { label: "Follow-up: 25 to 70 words", check: String.raw`const w = words(section('Follow-up') || ''); return w >= 25 && w <= 70;`, fail: "Keep the follow-up between 25 and 70 words." },
          ],
          solution: OUTREACH_DONE,
          hint: "Write as if you were a helpful peer who noticed her post, not a salesperson.",
          successMessage: "Outreach that respects the reader and starts a real conversation.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 74 · 11.11 – 11.12
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "va-l74-onboarding",
    moduleId: "va-m11-freelancing",
    sectionId: SECTION_ID,
    order: 6,
    covers: ["11.11", "11.12"],
    title: "Client Onboarding, Contracts and Expectations",
    subtitle: "Starting every client relationship properly, in writing, and delivering more value than expected",
    estimatedMinutes: 45,
    intro:
      "The first two weeks with a client set the tone for the whole relationship. Professionals start with a contract and a plan.",

    atoms: [
      {
        id: "a-va-client-onboarding",
        title: "Client onboarding",
        explain:
          "Onboard every new client with the same checklist. Send a welcome email that confirms what you agreed and the next steps. Use an intake questionnaire (a Google Form) to collect their goals, priorities, preferences (communication, working hours, tone), tools and key contacts. Get access properly: through their password manager or user accounts in their tools, never passwords by email or chat. Hold a kick-off call to agree priorities for the first two weeks and how you will communicate (your \"how we will work together\" note from Module 1). Set up your systems: a task board, a shared folder, a time tracker. Start with a few quick wins that show value early, and check in at the end of the first week.",
      },
      {
        id: "a-va-contracts",
        title: "Contracts",
        explain:
          "Always work under a written agreement, even with friends. On Upwork and similar platforms the platform's contract and payment protection apply, but you should still agree the scope in writing in the messages. For direct clients, use a simple contract (templates are available; for large contracts, consult a lawyer). It should cover: the scope of services (and that extra work is quoted separately); rates, package details and billing; payment terms (when invoices are sent and due, how to pay, late payment fees); working hours, response times and communication channels; confidentiality (or a separate NDA); ownership of work produced (usually it passes to the client on payment); the start date and how either side can end the agreement (notice period); and what happens with access and data at the end.",
      },
      {
        id: "a-va-expectations-value",
        title: "Managing expectations and delivering value",
        explain:
          "Most client disappointments come from a gap between what they expected and what they got. Close it: agree specific deliverables and response times, under-promise and over-deliver (say Thursday, deliver Wednesday), give regular updates without being asked, say early when something is at risk, and do not quietly absorb extra work outside the scope; raise it. Deliver value beyond tasks: track and report what you did and what it achieved (hours saved, emails handled, leads added), suggest improvements (\"I noticed you get the same five questions every week; shall I create templates?\"), and hold a short monthly review: what is working, what to change, what is next.",
      },
      {
        id: "a-va-contract-desk",
        title: "Which clause protects you?",
        explain:
          "For each situation, choose the contract clause that deals with it.",
        deskLab: {
          app: "generic",
          title: "Contract clauses",
          task: "Choose the clause that covers each situation.",
          fields: [{ key: "clause", label: "Clause", type: "select", options: ["Scope of services", "Payment terms and late fees", "Working hours and response times", "Confidentiality", "Termination and notice", "Ownership of work"] }],
          items: [
            { id: "k1", title: "The client starts asking you to manage her personal social media too", expect: { clause: "Scope of services" } },
            { id: "k2", title: "An invoice is now 30 days overdue", expect: { clause: "Payment terms and late fees" } },
            { id: "k3", title: "The client expects replies at 11pm", expect: { clause: "Working hours and response times" } },
            { id: "k4", title: "A friend asks you about the client's new product launch", expect: { clause: "Confidentiality" } },
            { id: "k5", title: "The client wants to stop working with you from tomorrow", expect: { clause: "Termination and notice" } },
            { id: "k6", title: "The client asks who owns the templates and SOPs you created for her", expect: { clause: "Ownership of work" } },
          ],
          solution: { k1: { clause: "Scope of services" }, k2: { clause: "Payment terms and late fees" }, k3: { clause: "Working hours and response times" }, k4: { clause: "Confidentiality" }, k5: { clause: "Termination and notice" }, k6: { clause: "Ownership of work" } },
          successMessage: "Every common dispute has a clause. Agree them before you start, and you rarely need to argue later.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 75 · 11.13 – 11.14
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "va-l75-money",
    moduleId: "va-m11-freelancing",
    sectionId: SECTION_ID,
    order: 7,
    covers: ["11.13", "11.14"],
    title: "Invoicing, Records and Long-Term Clients",
    subtitle: "Getting paid on time, keeping your own books, and keeping good clients for years",
    estimatedMinutes: 45,
    intro:
      "A freelance VA is a small business. Getting paid properly and keeping clients are what make it sustainable.",

    atoms: [
      {
        id: "a-va-invoicing",
        title: "Invoicing and payments",
        explain:
          "An invoice is a formal request for payment. It includes: the word Invoice and a unique invoice number (INV-2026-001, in sequence); the invoice date and the due date; your name or business name and contact details; the client's name and details; each service with the hours or quantity, the rate and the amount; the total and the currency; how to pay (bank details or payment link); and any late payment terms. Send invoices on the agreed schedule (for retainers, usually at the start of the month in advance), from an invoicing tool (Wave, Zoho Invoice, QuickBooks, PayPal invoices) or a clean template. For foreign clients, use payment services that work in your country, such as PayPal, Payoneer, Wise or a foreign-currency (domiciliary) account, and compare their fees and exchange rates. Platforms such as Upwork and Fiverr handle invoicing and payment for you. If payment is late, send a polite reminder on the due date and again a week later, then pause work if your contract allows.",
      },
      {
        id: "a-va-invoice-sheet",
        title: "Calculating an invoice total",
        explain:
          "This month's invoice has three lines with different hours and rates. =SUMPRODUCT(B2:B4,C2:C4) multiplies each row's hours by its rate and adds the results in one step. Calculate the total in D5.",
        exercise: {
          data: { ...INVOICE },
          rows: 5,
          cols: 4,
          target: "D5",
          expected: 309,
          mustUseFormula: true,
          mustUse: "SUMPRODUCT",
          lockedCells: ["A1", "B1", "C1", "D1", "A2", "B2", "C2", "A3", "B3", "C3", "A4", "B4", "C4", "A5"],
          task: "In D5, use SUMPRODUCT to total hours × rate for the three services.",
          hint: "=SUMPRODUCT(B2:B4,C2:C4)",
          successMessage: "$309: 18 × 12 + 4 × 12 + 3 × 15.",
        },
      },
      {
        id: "a-va-money-records",
        title: "Basic financial record keeping",
        explain:
          "Keep your business money organised from the first client. Use a separate bank account for business income and expenses. Keep an income and expenses sheet: each invoice (number, client, amount, date sent, date paid) and each business expense (internet, power, software, equipment) with its receipt. Review it monthly: income, expenses, profit and unpaid invoices. Set aside a percentage of every payment for tax, and learn your country's rules for self-employed income (in Nigeria, personal income tax for the self-employed is administered by your state's internal revenue service; ask an accountant). Build an emergency fund of a few months' expenses, because freelance income varies.",
      },
      {
        id: "a-va-long-term",
        title: "Building long-term client relationships",
        explain:
          "Keeping a client costs far less than finding a new one, and long-term clients bring stability, higher rates and referrals. Be consistently reliable: the same quality every week. Communicate proactively and keep learning their business, so you anticipate needs. Hold regular reviews and act on feedback. Show appreciation (a thank-you note at a milestone). Ask happy clients for a testimonial and for referrals (\"Do you know anyone else who could use help like this?\"). Review your rates once a year with notice. If a relationship ends, end it professionally: hand over documentation, return access, and leave the door open.",
        decision: {
          scenario: "Your best client's invoice is 5 days late. She has always paid on time before.",
          question: "What do you do?",
          options: [
            { id: "a", text: "Send a friendly reminder with the invoice attached and ask if anything is needed from you", why: "Right. Assume it is an oversight; a polite reminder usually solves it." },
            { id: "b", text: "Stop all work immediately without a word", whyWrong: "Too harsh for a first, small delay from a good client." },
            { id: "c", text: "Post about her on social media", whyWrong: "Unprofessional and damaging to you." },
            { id: "d", text: "Say nothing and hope she remembers", whyWrong: "Reminders are a normal part of invoicing." },
          ],
          correct: "a",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 76 · 11.P
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "va-l76-practical",
    moduleId: "va-m11-freelancing",
    sectionId: SECTION_ID,
    order: 8,
    covers: ["11.P"],
    title: "Practical: Profile, Packages and Proposal",
    subtitle: "Your freelance business on one page",
    estimatedMinutes: 75,
    intro:
      "Bring the module together: a profile clients can find, three packages they can buy, and a proposal that wins a real-looking job.",

    atoms: [
      {
        id: "a-va-m11-plan",
        title: "Putting your business together",
        explain:
          "Your profile, packages and proposals must tell the same story: the same niche, services and proof. Write the profile from your niche statement (Lesson 70). Build three packages that make the middle one the obvious choice, with clear limits and prices in the client's currency. Then tailor each proposal to the job, using your packages and portfolio as proof. After this practical, publish the profile on at least one platform and on LinkedIn, and send your first five proposals or outreach messages.",
      },
      {
        id: "a-va-m11-practical",
        title: "Practical: your freelance business",
        explain:
          "Write your profile, packages and a proposal for the Kora Threads job.",
        writingLab: {
          task:
            "Profile: a Title naming your services (with a | or similar separator); an Overview of 60 to 160 words whose first sentence says who you help and the result; at least five Skills separated by commas; a Rate. Packages: three rows (for example Starter, Growth, Premium) each with what is included, hours or limits, and a price in naira or dollars, with prices rising. Proposal: open by naming Kora Threads; say which of the three tasks (customer emails and WhatsApp, Shopify listings, order tracking) you have done, as bullets; mention Nigerian working hours and a price within the ₦250,000–₦350,000 budget; end with a question; 90 to 200 words.",
          brief: PRAC_BRIEF,
          doc: PRAC_DOC,
          tests: [
            { label: "Profile title and overview", check: String.raw`const p = section('Profile') || ''; const o = field(p, 'Overview') || ''; return words(field(p, 'Title') || '') >= 4 && /(\||·|-|:)/.test(field(p, 'Title') || '') && words(o) >= 60 && words(o) <= 160 && /help/i.test(firstSentence(o));`, fail: "Give a Title that names your services, and a 60–160 word Overview whose first sentence says who you help and the result." },
            { label: "Skills and rate", check: String.raw`const p = section('Profile') || ''; return (field(p, 'Skills') || '').split(',').filter((x) => x.trim()).length >= 5 && /(\$|₦|USD|NGN)\s?\d|\d+\s?(USD|NGN)/.test(field(p, 'Rate') || '');`, fail: "List at least five skills separated by commas, and a rate with its currency." },
            { label: "Three packages with rising prices", check: String.raw`const r = rows(section('Packages') || ''); const price = (s) => Number(String(s).replace(/[^\d.]/g, '')); return r.length === 3 && r.every((x) => x.length >= 4 && words(x[1]) >= 3 && /\d/.test(x[2]) && /(₦|\$)/.test(x[3])) && price(r[0][3]) < price(r[1][3]) && price(r[1][3]) < price(r[2][3]);`, fail: "Write three packages, each with inclusions, hours or limits, and a price in ₦ or $, with prices rising from the first to the third." },
            { label: "Proposal names the client and answers the question", check: String.raw`const p = section('Proposal') || ''; const b = bullets(p).join(' '); return /^Kora Threads\b/m.test(clean(p).trim()) && /(email|whatsapp)/i.test(b) && /shopify|listing/i.test(b) && /(order|sheet)/i.test(b);`, fail: "Open the proposal with \"Kora Threads\" and use bullets to say which of the three tasks you have done." },
            { label: "Hours, a price within budget and a question", check: String.raw`const p = section('Proposal') || ''; const prices = (p.match(/₦\s?[\d,]+/g) || []).map((x) => Number(x.replace(/[^\d]/g, ''))); return /(nigerian|WAT)/i.test(p) && prices.some((n) => n >= 250000 && n <= 350000) && /\?/.test(p);`, fail: "Mention Nigerian working hours, quote a price between ₦250,000 and ₦350,000, and end with a question." },
            { label: "Proposal: 90 to 200 words", check: String.raw`const w = words(section('Proposal') || ''); return w >= 90 && w <= 200;`, fail: "Keep the proposal between 90 and 200 words." },
          ],
          solution: PRAC_DONE,
          hint: "Write the packages first; then the proposal can simply recommend the one that fits the client's hours.",
          successMessage: "A profile, a price list and a proposal: you are ready to go and win clients.",
        },
      },
    ],

    task: {
      title: "Module 11 practical: launch your business",
      intro: "Take your business live.",
      prompts: [
        "Publish your profile on Upwork or Fiverr (or both) and update your LinkedIn headline and About section to match your niche.",
        "Create your three packages as a one-page PDF price list in Canva or Google Docs.",
        "Build a prospect tracker in Google Sheets and send five personalised outreach messages or proposals this week.",
        "Set up an invoice template with numbering, and an income and expenses sheet.",
      ],
      closing: "Module 12, the final module, brings everything together into a portfolio, a CV, interview skills and a career plan.",
    },

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
