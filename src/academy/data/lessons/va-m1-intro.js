/**
 * VIRTUAL ASSISTANT · MODULE 1 · INTRODUCTION TO VIRTUAL ASSISTANCE
 *
 * Curriculum 1.0 – 1.10 and the practical 1.P. What virtual assistance is
 * and how it grew, who a VA is, roles and responsibilities, the eight types
 * of VA, industries, remote work, qualities and ethics, and the
 * client–assistant relationship; then five businesses and the services a
 * VA could offer each.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

export const SECTION_ID = "va-s1-intro";

const TYPE_OPTIONS = [
  "General VA",
  "Administrative VA",
  "Executive VA",
  "Social media VA",
  "Customer support VA",
  "E-commerce VA",
  "Real estate VA",
  "Technical VA",
];

/* ── Lesson 5 lab: a "how we will work together" note ─────────────────── */
const WORK_BRIEF = `You are **Amaka Obi**, a virtual assistant based in Enugu (West Africa Time, WAT). You have just been hired by **Daniel Reyes**, owner of **Reyes Interiors**, a design studio in London (UK time, one hour behind Lagos in winter).

He has asked you to send him a short note on how you will work together. Your facts:

- Working hours: Monday to Friday, 9:00 to 17:00 WAT.
- You reply to messages within 2 working hours; anything urgent should go by WhatsApp call.
- Daily tasks go in your shared Trello board; questions go to Slack.
- You send an end-of-day update every working day by 17:00 WAT.
- You keep every client document and password confidential and use his password manager, never email, for logins.`;

const WORK_DOC = `# How we will work together

## Working hours

[Your hours, with the time zone, and his equivalent time.]

## Response times

## Communication

## Updates

## Confidentiality
`;

const WORK_DONE = `# How we will work together

Dear Daniel,

Thank you for choosing me as your virtual assistant. Here is how we will work together, so you always know when and how to reach me.

## Working hours

I work Monday to Friday, 9:00 to 17:00 WAT, which is 8:00 to 16:00 in London during your winter.

## Response times

I reply to messages within 2 working hours. If something is urgent, please call me on WhatsApp and I will act on it at once.

## Communication

- Daily tasks: add them to our shared Trello board, with a due date.
- Questions and quick decisions: send them on Slack.
- Urgent matters: a WhatsApp call.

## Updates

Every working day by 17:00 WAT, I will send you an end-of-day update: what I finished, what is in progress and anything I need from you.

## Confidentiality

I keep every document, email and password confidential. I will use your password manager for all logins and never send passwords by email or chat.

Kind regards,
Amaka Obi
Virtual Assistant
`;

/* ── Lesson 6 lab: the practical ──────────────────────────────────────── */
const PRAC_BRIEF = `Choose **five real or realistic businesses** in your city or online, **each from a different industry**. For each one, think about what slows the owner down every week: unanswered emails, missed appointments, slow replies to customers, no time for social media, messy records.

Then outline the services you, as a virtual assistant, could provide to fix that. Use the roles and types from this module: each business should be served by the VA type that fits it best.

**Example of one entry** (do not reuse it):

> ## Business 1: Glow Skin Clinic
> - Industry: Health and beauty
> - What slows them down: The owner answers WhatsApp bookings herself between clients and often double-books.
> - VA type: Customer support VA
> - Services I would provide:
>   - Manage bookings and reminders in a shared calendar
>   - Answer customer inquiries on WhatsApp and Instagram within an hour
>   - Send follow-up messages asking for reviews
> - Value to the owner: About 8 hours a week back and fewer missed appointments.`;

const PRAC_DOC = `# Five businesses that could use a virtual assistant

## Business 1:
- Industry:
- What slows them down:
- VA type:
- Services I would provide:
- Value to the owner:

## Business 2:
- Industry:
- What slows them down:
- VA type:
- Services I would provide:
- Value to the owner:

## Business 3:
- Industry:
- What slows them down:
- VA type:
- Services I would provide:
- Value to the owner:

## Business 4:
- Industry:
- What slows them down:
- VA type:
- Services I would provide:
- Value to the owner:

## Business 5:
- Industry:
- What slows them down:
- VA type:
- Services I would provide:
- Value to the owner:
`;

const PRAC_DONE = `# Five businesses that could use a virtual assistant

## Business 1: Mama Nkechi Kitchen
- Industry: Food and catering
- What slows them down: The owner takes catering orders by phone while cooking and loses track of deposits and delivery dates.
- VA type: Customer support VA
- Services I would provide:
  - Answer order inquiries on WhatsApp and Instagram within one hour
  - Record every order, deposit and delivery date in a shared Google Sheet
  - Send customers a confirmation and a reminder the day before delivery
- Value to the owner: She cooks without interruptions and stops losing orders.

## Business 2: Okafor & Partners Law Firm
- Industry: Legal services
- What slows them down: The senior partner spends two hours a day sorting email and rescheduling client meetings.
- VA type: Executive VA
- Services I would provide:
  - Manage his inbox daily with labels and a priority list
  - Schedule and confirm client meetings in his calendar
  - Prepare meeting agendas and type up notes
- Value to the owner: About ten hours a week back for billable legal work.

## Business 3: Kora Threads
- Industry: E-commerce and fashion
- What slows them down: Product listings are out of date and orders are packed late because no one tracks stock.
- VA type: E-commerce VA
- Services I would provide:
  - Upload and update product listings with photos, prices and sizes
  - Track orders and update the stock sheet every day
  - Reply to customer questions about delivery and returns
- Value to the owner: Faster deliveries, fewer complaints and more time to design.

## Business 4: Prime Homes Realty
- Industry: Real estate
- What slows them down: Agents miss leads from property websites and forget to follow up after viewings.
- VA type: Real estate VA
- Services I would provide:
  - Post new listings on property websites and social media
  - Log every new lead in the CRM and book viewings
  - Send follow-up messages after each viewing
- Value to the owner: More viewings booked and fewer lost leads.

## Business 5: BrightPath Tutors
- Industry: Education
- What slows them down: The founder has no time to post on social media or answer parents' messages.
- VA type: Social media VA
- Services I would provide:
  - Plan and schedule three posts a week on Facebook and Instagram
  - Design simple graphics for classes and results in Canva
  - Reply to comments and messages from parents within the day
- Value to the owner: A steady online presence that brings in new students.
`;

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 1 · 1.0 – 1.2
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "va-l1-welcome",
    moduleId: "va-m1-intro",
    sectionId: SECTION_ID,
    order: 1,
    covers: ["1.0", "1.1", "1.2"],
    title: "What Virtual Assistance Is",
    subtitle: "Welcome, the meaning and evolution of virtual assistance, and who a VA is",
    estimatedMinutes: 35,
    intro:
      "Businesses everywhere need help with emails, calendars, customers, documents and social media, and much of that help can now be given from anywhere with a laptop and an internet connection. This course trains you to give it professionally.",

    atoms: [
      {
        id: "a-va-welcome",
        title: "Welcome: what you will be able to do",
        explain:
          "By the end of this course you will be able to work as a professional virtual assistant: manage a busy person's inbox and calendar, prepare documents, spreadsheets and presentations, research and build lead lists, run a customer support desk, coordinate projects, support social media, use AI tools and automation safely, and find, win and keep clients. The course has twelve modules in four parts. You will not just read about the work: almost every lesson puts you at the VA Workdesk, a simulated inbox, help desk, calendar, project board, shared drive or lead list where you sort, schedule, route and record items, and \"Check my work\" tells you item by item what is right. Writing tasks (emails, minutes, proposals) happen on the Writing Desk, and spreadsheet tasks in a live grid. Each module ends with a practical that becomes part of your portfolio.",
        table: {
          caption: "The road ahead: twelve modules in four parts.",
          headers: ["Part", "Modules", "You will be able to"],
          rows: [
            ["1 · Foundations", "1 Introduction · 2 Digital skills · 3 Communication", "Explain the job, work safely and confidently on a computer, and communicate like a professional"],
            ["2 · Core services", "4 Executive assistance · 5 Office applications · 6 Research and data", "Run an inbox and calendar, produce documents and spreadsheets, research and build lead lists"],
            ["3 · Client-facing", "7 Customer service · 8 Project management · 9 Social media", "Run a support desk, coordinate projects and support marketing"],
            ["4 · Modern skills and career", "10 AI and automation · 11 Freelancing · 12 Portfolio and career", "Work faster with AI, win clients and present a portfolio that gets you hired"],
          ],
        },
      },
      {
        id: "a-va-meaning",
        title: "Meaning, concept and evolution of virtual assistance",
        explain:
          "Virtual assistance is administrative, technical, creative or customer-facing support given to a business or a busy professional from a remote location, using the internet and digital tools. The concept is simple: the work an office assistant or secretary once did at a desk outside the manager's door (answering correspondence, keeping the diary, filing, typing, booking travel) does not need the assistant to be in the same building. It evolved in stages. Secretaries and typing pools did this work in person. Email, mobile phones and the web in the 1990s made remote support possible, and the job title \"virtual assistant\" appeared. Freelance marketplaces such as Upwork and Fiverr then connected clients with assistants in other countries. Cloud tools (Google Workspace, Microsoft 365, Slack, Trello, Zoom) made shared work easy, and the rise of remote work after 2020 made hiring remote help normal. Today, VAs also support social media, online stores, customer service and automation, not only office tasks.",
        why: "Knowing where the job comes from explains what clients expect: the reliability and discretion of a good personal assistant, delivered through digital tools.",
      },
      {
        id: "a-va-who",
        title: "Who is a virtual assistant?",
        explain:
          "A virtual assistant (VA) is a person who provides support services to clients remotely. Most VAs are either self-employed freelancers who serve several clients (billing by the hour, by task or by monthly package) or remote employees of one company or a VA agency. A VA is not the same as a \"virtual assistant\" app such as Siri, Alexa or Google Assistant: those are software voice assistants. A human VA brings judgement, initiative and a relationship with the client that software does not. A VA is also different from an in-office assistant: the work may be similar, but the VA uses their own equipment and workspace, communicates through digital channels and is often in a different city or time zone. Successful VAs are organised, reliable, discreet and good communicators, and they are comfortable learning new software quickly.",
        mistake:
          "Calling yourself \"a virtual assistant\" on a profile without saying what you do. Clients search for help with specific problems (inbox management, bookings, customer replies), so describe the services, not just the title.",
      },
      {
        id: "a-va-first-desk",
        title: "Your first Workdesk: who does this work?",
        explain:
          "This is the VA Workdesk. Each row is an item; open it to read the details, choose a value in each field, then press \"Check my work\". Rows turn green or red, and red rows give a hint. When everything is right, each row's \"Why\" explains the answer. Here, decide who is doing the work described in each item: a human virtual assistant working remotely, an assistant in the client's office, or a software voice assistant.",
        deskLab: {
          app: "generic",
          title: "Who is doing this work?",
          task:
            "Open each item and choose who is doing the work: a virtual assistant (a person, working remotely), an in-office assistant, or a software voice assistant. Then press Check my work.",
          fields: [
            { key: "who", label: "Who", type: "select", options: ["Virtual assistant (person, remote)", "In-office assistant", "Software voice assistant"] },
          ],
          items: [
            { id: "w1", title: "Ngozi, in Abuja, manages the inbox of a coach in Toronto every morning", expect: { who: "Virtual assistant (person, remote)" }, hint: "A person, working for a client in another country.", why: "A person doing assistant work for a client far away, through email: a virtual assistant." },
            { id: "w2", title: "\"Hey Siri, set a timer for ten minutes\"", expect: { who: "Software voice assistant" }, hint: "Siri is an app.", why: "Siri, Alexa and Google Assistant are software, not people. They follow commands; they do not use judgement." },
            { id: "w3", title: "Tunde sits at the reception of a law firm and greets visitors", expect: { who: "In-office assistant" }, hint: "Where is he working?", why: "He works in the client's building, in person." },
            { id: "w4", title: "Fatima answers customer chats for an online shop from her home in Kano", expect: { who: "Virtual assistant (person, remote)" }, hint: "A person, working from home for a business.", why: "Remote customer support by a person is virtual assistance (a customer support VA)." },
            { id: "w5", title: "An Alexa speaker reads out tomorrow's weather", expect: { who: "Software voice assistant" }, hint: "Alexa is a device and an app.", why: "A smart speaker is a software assistant." },
            { id: "w6", title: "Chidi books flights and hotels for a CEO in Dubai, working from Lagos over Slack and email", expect: { who: "Virtual assistant (person, remote)" }, hint: "A person, a different country, digital tools.", why: "Travel booking for an executive, done remotely: an executive VA's work." },
            { id: "w7", title: "Grace files paper invoices in the cabinet next to her manager's office", expect: { who: "In-office assistant" }, hint: "Paper files, in the office.", why: "Physical filing in the office needs a person on site." },
            { id: "w8", title: "Emeka updates a realtor's property listings online from Port Harcourt", expect: { who: "Virtual assistant (person, remote)" }, hint: "A person, updating listings online for a client.", why: "Online listing management is typical real estate VA work." },
          ],
          solution: {
            w1: { who: "Virtual assistant (person, remote)" },
            w2: { who: "Software voice assistant" },
            w3: { who: "In-office assistant" },
            w4: { who: "Virtual assistant (person, remote)" },
            w5: { who: "Software voice assistant" },
            w6: { who: "Virtual assistant (person, remote)" },
            w7: { who: "In-office assistant" },
            w8: { who: "Virtual assistant (person, remote)" },
          },
          hint: "Ask two questions: is it a person or software? If a person, are they in the client's building or working remotely?",
          successMessage: "That is the Workdesk. Every module gives you a harder desk: an inbox, a calendar, a help desk, a project board.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 2 · 1.3
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "va-l2-roles",
    moduleId: "va-m1-intro",
    sectionId: SECTION_ID,
    order: 2,
    covers: ["1.3"],
    title: "Roles and Responsibilities of a VA",
    subtitle: "What VAs do, what they must not do, and a day in the life",
    estimatedMinutes: 35,
    intro:
      "Clients hire a VA to take work off their plate. This lesson maps that work into eight areas, draws the line between responsibility and authority, and shows a real working day.",

    atoms: [
      {
        id: "a-va-roles-core",
        title: "The eight areas of VA work",
        explain:
          "Almost everything a VA does falls into eight areas. Knowing them helps you describe your services and spot what a client needs.",
        table: {
          caption: "The core responsibilities of a virtual assistant.",
          headers: ["Area", "Typical tasks"],
          rows: [
            ["Communication management", "Sort and answer email, reply to messages, screen calls, send follow-ups"],
            ["Calendar and scheduling", "Book meetings and appointments, send invitations and reminders, avoid clashes across time zones"],
            ["Documents and data", "Type, format and proofread documents, enter and update data, keep records and files organised"],
            ["Research", "Find suppliers, venues, flights, prices, competitors and leads; summarise what you find"],
            ["Customer service", "Answer customer inquiries, handle complaints, manage tickets, follow up"],
            ["Social media and marketing support", "Schedule posts, design simple graphics, reply to comments, send newsletters"],
            ["Finance administration", "Prepare invoices, track expenses and payments, chase unpaid invoices (not accounting decisions)"],
            ["Project and task coordination", "Keep the task board up to date, remind people of deadlines, report progress"],
          ],
        },
      },
      {
        id: "a-va-roles-authority",
        title: "Responsibility versus authority",
        explain:
          "A VA is responsible for doing tasks well; the client keeps the authority to decide. Some tasks are routine and you simply do them. Some need the client's written permission first: paying a supplier from the client's account, signing or accepting an agreement on their behalf, sending a message in their name on a sensitive matter, deleting files. And some are outside a VA's role entirely because they need a licensed professional: giving legal advice, preparing audited accounts or tax filings as an accountant, giving medical advice. In those cases you help by finding and booking the right professional. When you are not sure whether you have authority, ask, and keep the answer in writing (an email or a message), so that both of you can refer back to it.",
        decision: {
          scenario: "Your client, a dentist, forwards an invoice from a supplier and writes: \"This needs paying.\" You have access to her online banking to download statements.",
          question: "What do you do?",
          options: [
            { id: "a", text: "Reply asking her to confirm in writing that you should pay this invoice from the business account, with the amount and the due date", why: "Right. Paying money needs explicit written authority. \"This needs paying\" could mean \"remind me\" or \"pay it\"; one message removes the doubt and protects you both." },
            { id: "b", text: "Pay it straight away, since she said it needs paying", whyWrong: "Access to statements is not authority to make payments. If the invoice were fraudulent or already paid, you would have moved her money without permission." },
            { id: "c", text: "Ignore it until she mentions it again", whyWrong: "The invoice may have a due date and late fees. A good VA closes the loop with a quick question." },
            { id: "d", text: "Forward it to her accountant and ask him to pay it", whyWrong: "That passes the problem on without asking the client what she wants, and may share information she did not intend to share." },
          ],
          correct: "a",
        },
      },
      {
        id: "a-va-roles-day",
        title: "A day in the life of a VA",
        explain:
          "A typical day for a VA with two or three clients has a rhythm: start with communication (the inbox and messages), then scheduled work in focused blocks, then updates. Most VAs plan the day the evening before and protect time for deep work, because constant interruptions are the biggest threat to quality. Here is a realistic day for a VA in Lagos working for a coach in London and an online shop in Nigeria.",
        table: {
          caption: "A realistic day (times in WAT).",
          headers: ["Time", "Work"],
          rows: [
            ["8:30", "Check both clients' inboxes and messages; flag anything urgent"],
            ["9:00", "Coach: reply to emails, confirm today's calls, send reminders"],
            ["10:00", "Shop: answer customer chats, update the order sheet"],
            ["12:00", "Break"],
            ["13:00", "Coach: research three podcast guest opportunities, draft pitches"],
            ["15:00", "Shop: schedule tomorrow's Instagram posts in Meta Business Suite"],
            ["16:30", "Both: update task boards, send end-of-day updates"],
          ],
        },
      },
      {
        id: "a-va-roles-desk",
        title: "Sorting client requests by area and authority",
        explain:
          "A new client has sent you a list of things she wants help with. For each request, decide which of the eight areas it belongs to and whether a VA can do it as routine, can do it only with written authority, or should not do it (and instead should help the client find a professional).",
        deskLab: {
          app: "tasks",
          title: "Mrs Adeyemi's wish list for her catering business",
          task:
            "For each request, choose the area of VA work it belongs to, and whether you can do it as routine, only with written authority, or not at all (refer to a professional).",
          fields: [
            { key: "area", label: "Area", type: "select", options: ["Communication management", "Calendar and scheduling", "Documents and data", "Research", "Customer service", "Social media and marketing support", "Finance administration", "Project and task coordination"] },
            { key: "scope", label: "Can a VA do it?", type: "select", options: ["Yes, routine", "Only with written authority", "No: refer to a professional"] },
          ],
          items: [
            { id: "r1", title: "Answer customer questions about menu prices on WhatsApp", expect: { area: "Customer service", scope: "Yes, routine" }, why: "Answering customers with information the client has given you is routine customer service." },
            { id: "r2", title: "Book my meetings with event planners for next week", expect: { area: "Calendar and scheduling", scope: "Yes, routine" }, why: "Scheduling is core, routine VA work." },
            { id: "r3", title: "Pay the gas supplier ₦180,000 from the business account", expect: { area: "Finance administration", scope: "Only with written authority" }, hint: "Money leaves the client's account.", why: "Making payments needs explicit, written permission for each payment or a written standing rule." },
            { id: "r4", title: "File my company's annual tax returns", expect: { area: "Finance administration", scope: "No: refer to a professional" }, hint: "This needs a qualified accountant or tax professional.", why: "Tax filings need a qualified professional; a VA can gather documents and book the accountant." },
            { id: "r5", title: "Find three suppliers of chafing dishes in Lagos and compare prices", expect: { area: "Research", scope: "Yes, routine" }, why: "Supplier research and comparison is routine research work." },
            { id: "r6", title: "Type up my recipes into a formatted document", expect: { area: "Documents and data", scope: "Yes, routine" }, why: "Document preparation is routine." },
            { id: "r7", title: "Post our new menu on Instagram three times this week", expect: { area: "Social media and marketing support", scope: "Yes, routine" }, why: "Scheduling approved posts is routine social media support." },
            { id: "r8", title: "Accept the hotel's catering contract on my behalf", expect: { area: "Communication management", scope: "Only with written authority" }, hint: "Accepting a contract commits the client legally.", why: "Accepting an agreement in the client's name commits her; do it only when she has told you, in writing, to accept that specific agreement." },
            { id: "r9", title: "Remind my two staff of their deadlines for the wedding order", expect: { area: "Project and task coordination", scope: "Yes, routine" }, why: "Reminding people of deadlines is routine task coordination." },
            { id: "r10", title: "Tell a customer whether her allergy will react to our groundnut stew", expect: { area: "Customer service", scope: "No: refer to a professional" }, hint: "Is this a menu fact or medical advice?", why: "Whether a person will have a reaction is medical advice. Give the ingredient list the client provides and advise the customer to consult a doctor." },
          ],
          solution: {
            r1: { area: "Customer service", scope: "Yes, routine" },
            r2: { area: "Calendar and scheduling", scope: "Yes, routine" },
            r3: { area: "Finance administration", scope: "Only with written authority" },
            r4: { area: "Finance administration", scope: "No: refer to a professional" },
            r5: { area: "Research", scope: "Yes, routine" },
            r6: { area: "Documents and data", scope: "Yes, routine" },
            r7: { area: "Social media and marketing support", scope: "Yes, routine" },
            r8: { area: "Communication management", scope: "Only with written authority" },
            r9: { area: "Project and task coordination", scope: "Yes, routine" },
            r10: { area: "Customer service", scope: "No: refer to a professional" },
          },
          hint: "Money leaving the account or commitments in the client's name need written authority; licensed advice (tax, legal, medical) needs a professional.",
          successMessage: "You can now read a client's wish list the way an experienced VA does: what it is, and whether it is yours to do.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 3 · 1.4 – 1.6
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "va-l3-types",
    moduleId: "va-m1-intro",
    sectionId: SECTION_ID,
    order: 3,
    covers: ["1.4", "1.5", "1.6"],
    title: "The Eight Types of Virtual Assistant",
    subtitle: "General, administrative, executive, social media, customer support, e-commerce, real estate and technical",
    estimatedMinutes: 40,
    intro:
      "Job adverts rarely say \"virtual assistant\" alone. They say executive VA, e-commerce VA, real estate VA. Each type has its own tasks, tools and pay level, and knowing them helps you choose a direction.",

    atoms: [
      {
        id: "a-va-types-office",
        title: "General, administrative and executive VAs",
        explain:
          "A general VA handles a wide mix of everyday tasks for small business owners: email, scheduling, data entry, simple research, document formatting, some social media. It is the usual starting point. An administrative VA focuses on office administration: inbox and calendar management, document preparation, data entry and records, filing, invoicing support, travel bookings. An executive VA supports one senior person (a CEO, founder, director): managing their inbox and diary closely, preparing for meetings, writing agendas and minutes, booking travel, screening contacts, handling confidential information and acting as a gatekeeper. Executive VAs need the highest level of discretion and judgement and are usually paid the most of the three.",
        table: {
          caption: "The office-based types.",
          headers: ["Type", "Works for", "Typical tasks", "Common tools"],
          rows: [
            ["General VA", "Small business owners, solo professionals", "Email, scheduling, data entry, simple research, formatting", "Gmail, Google Calendar, Docs, Sheets"],
            ["Administrative VA", "Small and medium businesses", "Inbox, calendar, documents, records, invoices, travel", "Outlook, Word, Excel, Drive, OneDrive"],
            ["Executive VA", "One senior executive", "Close diary and inbox control, meeting preparation, minutes, travel, gatekeeping", "Outlook or Gmail, Teams or Zoom, Notion, password manager"],
          ],
        },
      },
      {
        id: "a-va-types-customer",
        title: "Social media, customer support and e-commerce VAs",
        explain:
          "A social media VA helps brands stay active online: planning a content calendar, creating simple graphics in Canva, writing captions, scheduling posts with Meta Business Suite, Buffer or Hootsuite, replying to comments and messages, and reporting basic analytics. A customer support VA answers customers by email, live chat, social media and phone; uses help desks such as Zendesk, Freshdesk or Intercom; handles complaints, refunds and returns within the client's rules; and escalates what they cannot resolve. An e-commerce VA keeps an online store running: uploading and updating product listings, processing and tracking orders, updating stock, handling returns, answering buyers, and working in platforms such as Shopify, WooCommerce, Amazon Seller Central, Jumia or Etsy.",
      },
      {
        id: "a-va-types-specialist",
        title: "Real estate and technical VAs",
        explain:
          "A real estate VA supports estate agents, realtors and property managers: posting listings on property websites and social media, managing leads in a CRM, booking viewings, following up after viewings, coordinating paperwork and tenant communication. Real estate clients often work in the US, UK or Canada and pay well for VAs who learn their tools (for example a property CRM and the main listing websites). A technical VA handles the technical side of a small business: updating a website (often on WordPress), setting up and maintaining email newsletters, building automations in Zapier or Make, managing online forms, fixing simple tool problems and connecting apps. Technical VAs do not need to be programmers, but they must be confident learning software and following documentation.",
        mistake:
          "Trying to be all eight types at once. Beginners usually start as general or administrative VAs and specialise once they know which work they enjoy and are good at. Module 11 shows how to choose a niche.",
      },
      {
        id: "a-va-types-desk",
        title: "Which type of VA is this advert for?",
        explain:
          "Here are ten real-style job adverts. For each one, decide which type of VA the client is really looking for. Read the tasks, not the job title: clients often use the wrong title.",
        deskLab: {
          app: "generic",
          title: "Ten job adverts from a freelance marketplace",
          task: "Open each advert and choose the type of VA it is really for. Read the tasks, not the title.",
          fields: [{ key: "type", label: "VA type", type: "select", options: TYPE_OPTIONS }],
          items: [
            { id: "j1", title: "CEO needs help managing an overflowing inbox, diary and board meeting prep", body: "You will manage my inbox and calendar, prepare board packs and agendas, take minutes, book my travel and keep confidential information confidential. I travel a lot and need someone who can act as a gatekeeper.", expect: { type: "Executive VA" }, why: "One senior person, close diary and inbox control, board meetings, gatekeeping: an executive VA." },
            { id: "j2", title: "Shopify store needs someone to upload products and track orders", body: "Add 40 new products a week with photos and descriptions, update stock levels, process returns and reply to buyers about delivery.", expect: { type: "E-commerce VA" }, why: "Listings, orders, stock and returns in an online store: e-commerce." },
            { id: "j3", title: "Realtor seeks assistant for listings and lead follow-up", body: "Post my new listings on Zillow and Facebook, enter every lead in our CRM, schedule viewings and follow up with buyers after each viewing.", expect: { type: "Real estate VA" }, why: "Property listings, leads and viewings: real estate." },
            { id: "j4", title: "Virtual assistant wanted (various tasks)", body: "I run a small cleaning business. I need help with emails, booking appointments, some data entry and simple research when it comes up.", expect: { type: "General VA" }, hint: "A wide mix of everyday tasks for a small business.", why: "A broad mix of everyday tasks for a small business owner is general VA work." },
            { id: "j5", title: "Help desk agent for SaaS startup", body: "Answer customer tickets in Zendesk and live chat, handle refund requests within our policy, escalate bugs to our engineers and keep response time under two hours.", expect: { type: "Customer support VA" }, why: "Tickets, live chat, refunds and escalation: customer support." },
            { id: "j6", title: "Instagram and Facebook manager for a bakery", body: "Plan a monthly content calendar, design posts in Canva, schedule them in Meta Business Suite, reply to comments and DMs and send me a monthly report.", expect: { type: "Social media VA" }, why: "Content calendar, Canva, scheduling, community replies and reports: social media." },
            { id: "j7", title: "Assistant to set up our Zapier automations and WordPress updates", body: "Connect our forms to our CRM with Zapier, update plugins and pages on our WordPress site and set up our Mailchimp newsletter templates.", expect: { type: "Technical VA" }, why: "Automations, website updates and newsletter set-up are technical VA work." },
            { id: "j8", title: "Office administrator (remote) for a consulting firm", body: "Manage the shared inbox, keep client records up to date in Excel, format reports in Word, prepare invoices and book travel for our consultants.", expect: { type: "Administrative VA" }, why: "Office administration for a whole firm (records, documents, invoices, travel) is administrative VA work." },
            { id: "j9", title: "Executive assistant (title) for a growing online shop", body: "Mainly: answer customer emails about orders and delivery, update order status, process exchanges, and keep the product catalogue current.", expect: { type: "E-commerce VA" }, hint: "The title says executive; the tasks say something else.", why: "Despite the title, every task is about running an online store." },
            { id: "j10", title: "Social media help (title) for a property agency", body: "We need someone to answer our phone and email inquiries from tenants, log maintenance requests and book viewings for available flats. No content creation needed.", expect: { type: "Real estate VA" }, hint: "Read the tasks: tenants, maintenance, viewings.", why: "The tasks are tenant communication and viewings for a property agency: real estate work." },
          ],
          solution: {
            j1: { type: "Executive VA" }, j2: { type: "E-commerce VA" }, j3: { type: "Real estate VA" }, j4: { type: "General VA" }, j5: { type: "Customer support VA" },
            j6: { type: "Social media VA" }, j7: { type: "Technical VA" }, j8: { type: "Administrative VA" }, j9: { type: "E-commerce VA" }, j10: { type: "Real estate VA" },
          },
          hint: "Underline the verbs in each advert (upload, schedule, answer, connect) and match them to the type whose tasks they are.",
          successMessage: "Reading the tasks rather than the title is exactly how you will choose which jobs to apply for.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 4 · 1.7 – 1.8
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "va-l4-industries-remote",
    moduleId: "va-m1-intro",
    sectionId: SECTION_ID,
    order: 4,
    covers: ["1.7", "1.8"],
    title: "Industries and Remote Work",
    subtitle: "Who hires VAs, and the opportunities, benefits and challenges of working remotely",
    estimatedMinutes: 35,
    intro:
      "Almost every industry now hires remote help. This lesson shows where the demand is, and how to make remote work work for you, including the challenges people do not mention.",

    atoms: [
      {
        id: "a-va-industries",
        title: "Industries that employ virtual assistants",
        explain:
          "Small and medium businesses are the biggest employers of VAs, because they need help but cannot justify a full-time office employee. Some industries hire VAs especially often, and each has its own tasks and sometimes its own rules about privacy.",
        table: {
          caption: "Where VAs work, and what they do there.",
          headers: ["Industry", "Typical VA work"],
          rows: [
            ["E-commerce and retail", "Listings, orders, stock, returns, customer replies"],
            ["Real estate", "Listings, lead management, viewings, tenant communication"],
            ["Coaching, consulting and speaking", "Inbox, calendar, client onboarding, podcasts and events"],
            ["Healthcare and clinics", "Appointment booking, reminders, patient inquiries (with strict privacy rules)"],
            ["Legal and accounting firms", "Scheduling, document formatting, client intake, records (no legal or tax advice)"],
            ["Marketing and creative agencies", "Social media scheduling, reporting, client communication"],
            ["Technology startups", "Customer support, CRM updates, research, operations"],
            ["Hospitality, travel and events", "Bookings, itineraries, vendor coordination"],
            ["Education and training", "Course admin, student questions, scheduling classes"],
            ["Non-profits and NGOs", "Donor records, reports, events, volunteer communication"],
          ],
        },
        why: "Healthcare and legal clients handle sensitive data protected by law (for example HIPAA in the United States, GDPR in the UK and EU, and the Nigeria Data Protection Act). Those clients will expect you to know that confidentiality is a legal duty, not a courtesy.",
      },
      {
        id: "a-va-remote-benefits",
        title: "Remote work: opportunities and benefits",
        explain:
          "Remote work opens the whole world as your market. A VA in Ibadan can work for a coach in Texas, a shop in Lagos and an agency in London in the same week, and clients abroad often pay in dollars, pounds or euros. For the VA, the benefits are flexibility (you choose your clients and often your hours), no commuting time or cost, the chance to start with little money (a laptop, internet and skills), and a career that grows with your skills. For clients, a VA means paying only for the hours or tasks they need, no office space or equipment, access to skills they could not find locally, and cover across time zones (a VA in West Africa can handle a US client's inbox before the client wakes up).",
      },
      {
        id: "a-va-remote-challenges",
        title: "Remote work: the challenges and how to handle them",
        explain:
          "Remote work has real challenges, and professionals plan for them instead of hoping they will not happen. Power and internet: keep a backup (a power bank or inverter, a second mobile data plan or a mi-fi device) and know where you can work if both fail. Time zones: use a world clock and always write times with the time zone. Isolation and motivation: keep regular working hours, a dedicated workspace and contact with other VAs. Distractions at home: agree boundaries with family and close unrelated tabs. Getting paid: use reliable platforms or written agreements, and learn which payment methods work in your country. Scams: genuine employers never ask you to pay for a job, a \"training kit\" or equipment, and never ask you to receive money into your account and forward it. Visibility: in an office your effort is seen; remotely you must make it visible with clear updates.",
        decision: {
          scenario: "A message on Telegram offers you a VA job paying $1,200 a month. To start, you must pay ₦25,000 for \"onboarding software and a training certificate\".",
          question: "What is the right response?",
          options: [
            { id: "a", text: "Decline and do not pay: legitimate employers do not charge you to start a job", why: "Right. Paying to get a job is the classic advance-fee scam. Real clients pay you; they never ask you to pay them." },
            { id: "b", text: "Pay, because $1,200 a month is worth ₦25,000", whyWrong: "The salary is the bait. Once you pay, the \"employer\" disappears or asks for more." },
            { id: "c", text: "Negotiate the fee down to ₦10,000", whyWrong: "The amount does not matter; any fee to start a job is the warning sign." },
            { id: "d", text: "Pay with a friend's card so your own money is safe", whyWrong: "Your friend loses the money instead, and you have still fallen for the scam." },
          ],
          correct: "a",
        },
      },
      {
        id: "a-va-remote-desk",
        title: "Planning for remote-work challenges",
        explain:
          "Before you take your first client, plan what you will do when things go wrong. For each situation below, choose the professional response.",
        deskLab: {
          app: "tasks",
          title: "Your remote-work readiness plan",
          task: "For each challenge, choose the response a professional VA plans in advance.",
          fields: [
            { key: "plan", label: "Your plan", type: "select", options: [
              "Switch to a backup connection or power source and tell the client if a deadline is affected",
              "Write every time with its time zone and check a world clock",
              "Keep set working hours and a dedicated workspace",
              "Decline: real employers never ask you to pay or move money",
              "Send a short end-of-day update on what you completed",
              "Ask the client a clarifying question before starting",
            ] },
          ],
          items: [
            { id: "c1", title: "NEPA takes the light during a client call and your router goes off", expect: { plan: "Switch to a backup connection or power source and tell the client if a deadline is affected" }, why: "Backups are part of being professional in a place with unreliable power. Tell the client early if a deadline is at risk." },
            { id: "c2", title: "A client in New York asks for a call \"at 10 tomorrow\"", expect: { plan: "Write every time with its time zone and check a world clock" }, hint: "10 in which city?", why: "10:00 in New York is 15:00 or 16:00 in Lagos, depending on the season. Confirm with time zones." },
            { id: "c3", title: "You keep starting work at noon and finishing at midnight", expect: { plan: "Keep set working hours and a dedicated workspace" }, why: "Routine and a dedicated space protect both your output and your rest." },
            { id: "c4", title: "A \"client\" wants to send ₦400,000 into your account for you to forward to a supplier", expect: { plan: "Decline: real employers never ask you to pay or move money" }, hint: "Whose money is it, really?", why: "Receiving and forwarding money for strangers is how money laundering works, and you could be held responsible." },
            { id: "c5", title: "Your client says she never knows what you have been doing all day", expect: { plan: "Send a short end-of-day update on what you completed" }, why: "Remote work is invisible unless you make it visible." },
            { id: "c6", title: "A task says \"sort out the files\" with no other detail", expect: { plan: "Ask the client a clarifying question before starting" }, why: "Vague tasks waste hours. One good question saves them (Module 3 teaches how to ask it)." },
          ],
          solution: {
            c1: { plan: "Switch to a backup connection or power source and tell the client if a deadline is affected" },
            c2: { plan: "Write every time with its time zone and check a world clock" },
            c3: { plan: "Keep set working hours and a dedicated workspace" },
            c4: { plan: "Decline: real employers never ask you to pay or move money" },
            c5: { plan: "Send a short end-of-day update on what you completed" },
            c6: { plan: "Ask the client a clarifying question before starting" },
          },
          successMessage: "A plan made before the problem happens is what separates a professional from a beginner.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 5 · 1.9 – 1.10
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "va-l5-ethics-clients",
    moduleId: "va-m1-intro",
    sectionId: SECTION_ID,
    order: 5,
    covers: ["1.9", "1.10"],
    title: "Qualities, Ethics and the Client Relationship",
    subtitle: "What makes a VA trusted, the ethics of the job, and how the client–assistant relationship works",
    estimatedMinutes: 40,
    intro:
      "Clients give a VA access to their email, calendar, customers, files and sometimes money. They hire for skill, but they keep a VA for trust. This lesson is about earning it.",

    atoms: [
      {
        id: "a-va-qualities",
        title: "The essential qualities of a VA",
        explain:
          "Eight qualities appear in almost every client review of a great VA. Reliability: doing what you said, when you said, every time. Clear communication: short, precise updates and questions. Organisation: nothing gets lost, and you can find any file in seconds. Attention to detail: names spelled correctly, figures checked, the right attachment. Initiative (being proactive): noticing what needs doing and suggesting it (\"Your passport expires in May; shall I book the renewal?\"). Discretion: keeping private things private. Adaptability: learning a new tool or process quickly without complaint. Good judgement: knowing when to act, when to ask and when something is urgent.",
        analogy:
          "A good VA is like a good goalkeeper: when they do their job well, nobody notices the things that did not go wrong.",
      },
      {
        id: "a-va-ethics",
        title: "Professional ethics of a VA",
        explain:
          "Ethics are the rules you follow even when nobody is checking. Confidentiality: client information (emails, customers, prices, plans, passwords) is never shared, discussed or used for your own benefit, during or after the contract. Honesty: report your hours and progress accurately, admit mistakes quickly, and never claim skills you do not have. Data protection: use the client's systems, keep files in their accounts rather than your personal ones, use a password manager, and delete local copies when the work ends. Conflicts of interest: tell a client if you also work for a direct competitor. No hidden subcontracting: do not pass a client's work to someone else without their permission. Respect authority: act on the client's behalf only within what they have authorised. Professional conduct: be respectful to everyone you deal with in the client's name, because you represent their brand.",
        decision: {
          scenario: "You manage the inbox of a fashion designer. Her biggest competitor offers you a well-paid weekly task and casually asks what your current client is launching next month.",
          question: "What is the ethical response?",
          options: [
            { id: "a", text: "Say you cannot share anything about other clients, and tell your current client about the offer before accepting any work from the competitor", why: "Right. Client information is never shared, and working for a direct competitor is a conflict of interest your client deserves to know about." },
            { id: "b", text: "Share only general information, nothing specific", whyWrong: "Any information about an unreleased launch is confidential, general or not." },
            { id: "c", text: "Accept the task and keep both clients without telling either", whyWrong: "A hidden conflict of interest destroys trust when it comes out, and it usually does." },
            { id: "d", text: "Share the information but ask the competitor to keep it secret", whyWrong: "You have already broken confidentiality the moment you share it." },
          ],
          correct: "a",
        },
      },
      {
        id: "a-va-relationship",
        title: "Understanding the client–assistant relationship",
        explain:
          "The relationship between a client and a VA is a professional partnership built on trust, and it is usually a business-to-business arrangement: a freelance VA is an independent contractor, not an employee, so you agree the scope of work, rates and terms rather than receiving a salary and instructions on how to work. A healthy relationship has five parts. Clear expectations: what you do, what you do not do, deadlines and quality standards. An agreed communication rhythm: which channels to use for what, response times, and when you send updates. Boundaries: working hours, how urgent matters are handled, and what is outside the scope. Feedback: ask regularly what is working and what could be better, and act on it. Growing trust: start with small tasks, deliver them perfectly, and the client gives you more responsibility over time. Most problems between clients and VAs come from unclear expectations, which is why professionals put the basics in writing at the start.",
      },
      {
        id: "a-va-working-note",
        title: "Putting the relationship in writing",
        explain:
          "A short \"how we will work together\" note, sent in your first week, sets expectations before problems can start. It covers your working hours (with time zones), response times, which channel is for what, how you will update the client, and how you protect their information. Write one now for a real-feeling client.",
        writingLab: {
          task:
            "Write Amaka's note to Daniel. Use the five headings in the starter. Working hours: her hours with WAT and his London equivalent (one hour behind). Response times: 2 working hours, and the WhatsApp call for urgent matters. Communication: what goes on Trello and what goes on Slack, as bullets. Updates: the daily end-of-day update by 17:00 WAT and what it contains. Confidentiality: documents and passwords kept confidential and the password manager used, never email. Start with a greeting to Daniel and end with a sign-off and Amaka's name. 120 to 260 words.",
          brief: WORK_BRIEF,
          doc: WORK_DOC,
          tests: [
            { label: "Greeting to Daniel and a sign-off with Amaka's name", check: String.raw`return /^(Dear|Hi|Hello) Daniel,?\s*$/m.test(doc) && /(regards|thank you|best wishes|sincerely)[\s\S]*Amaka/i.test(doc);`, fail: "Open with \"Dear Daniel,\" (or Hi/Hello) and close with a sign-off and your name." },
            { label: "Working hours with both time zones", check: String.raw`const s = section('Working hours') || ''; return /9:00|9am|9 am|09:00/i.test(s) && /17:00|5pm|5 pm/i.test(s) && /WAT/.test(s) && /(8:00|8am|8 am|08:00)/i.test(s) && /london|uk/i.test(s);`, fail: "Give your hours in WAT and the London equivalent (8:00 to 16:00)." },
            { label: "Response time and the urgent channel", check: String.raw`const s = section('Response') || ''; return /2 (working )?hours|two (working )?hours/i.test(s) && /whatsapp/i.test(s) && /urgent/i.test(s);`, fail: "Say you reply within 2 working hours, and that urgent matters go by WhatsApp call." },
            { label: "Communication: Trello and Slack, as bullets", check: String.raw`const s = section('Communication') || ''; return bullets(s).length >= 2 && /trello/i.test(s) && /slack/i.test(s);`, fail: "List which channel is for what as bullets: tasks on Trello, questions on Slack." },
            { label: "The daily update: when and what", check: String.raw`const s = section('Updates') || ''; return /17:00|5pm|5 pm/i.test(s) && /(finished|completed|done)/i.test(s) && /(need|progress)/i.test(s);`, fail: "Say the update arrives by 17:00 WAT and what it contains (finished, in progress, what you need)." },
            { label: "Confidentiality and passwords", check: String.raw`const s = section('Confidentiality') || ''; return /confidential/i.test(s) && /password manager/i.test(s) && /(never|not)[^.]*email/i.test(s);`, fail: "Promise confidentiality, and say you use his password manager and never send passwords by email." },
            { label: "120 to 260 words", check: String.raw`return words(doc) >= 120 && words(doc) <= 260;`, fail: "Keep the note between 120 and 260 words: complete, but easy to read." },
          ],
          solution: WORK_DONE,
          hint: "Each heading answers one question the client would otherwise have to ask you: when, how fast, where, how will I know, and is my information safe?",
          successMessage: "A client who receives this in your first week knows exactly how to work with you. That is how trust starts.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 6 · 1.P
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "va-l6-practical",
    moduleId: "va-m1-intro",
    sectionId: SECTION_ID,
    order: 6,
    covers: ["1.P"],
    title: "Practical: Businesses That Need a VA",
    subtitle: "Five businesses, their problems and the services you would offer",
    estimatedMinutes: 45,
    intro:
      "Every client you will ever have hired a VA to solve a problem. This practical trains the habit that wins work: look at a business, see what slows it down, and describe the services that would help.",

    atoms: [
      {
        id: "a-va-m1-spotting",
        title: "Spotting a business that needs help",
        explain:
          "Signs that a business needs a VA are easy to see once you look for them: messages and comments left unanswered for days; an owner who answers the phone while serving customers; a social media page last updated months ago; appointments booked on paper or in someone's head; complaints about late replies in reviews; an owner who says \"I don't have time\". Each sign points to a service: unanswered messages to customer support, missed bookings to calendar management, a quiet page to social media support, messy records to data entry. Describe the value to the owner in their terms: hours saved, fewer missed customers, more sales, less stress.",
        decision: {
          scenario: "A busy pharmacy's Google reviews say: \"Called five times, no answer\", \"Nobody replied to my WhatsApp about stock\".",
          question: "Which VA service most directly fixes this problem?",
          options: [
            { id: "a", text: "Customer support: answer calls and WhatsApp inquiries and check stock questions with staff", why: "Right. The reviews are about unanswered customers; customer support fixes exactly that." },
            { id: "b", text: "Social media posts three times a week", whyWrong: "More posts would bring more messages that nobody answers." },
            { id: "c", text: "Bookkeeping support", whyWrong: "Useful, perhaps, but not the problem the reviews describe." },
            { id: "d", text: "A new website", whyWrong: "The problem is response, not presence." },
          ],
          correct: "a",
        },
      },
      {
        id: "a-va-m1-practical",
        title: "Practical: five businesses and your services",
        explain:
          "Choose five businesses from five different industries and complete one entry for each: the business, its industry, what slows the owner down, the VA type that fits, at least three services written as actions, and the value to the owner. This document is the first item in your portfolio, and it is also the start of your prospect list for Module 11.",
        writingLab: {
          task:
            "Complete five entries, one per \"## Business N: name\" heading. Each entry needs the business name in its heading, an Industry, What slows them down (one specific sentence), a VA type from this module (General, Administrative, Executive, Social media, Customer support, E-commerce, Real estate or Technical VA), at least three services as indented bullets that start with a verb, and the Value to the owner. Use at least four different industries and at least three different VA types.",
          brief: PRAC_BRIEF,
          doc: PRAC_DOC,
          tests: [
            { label: "Five businesses, each named in its heading", check: String.raw`const b = sections('Business '); return b.length === 5 && b.every((x) => /^Business \d+:\s*\S.{2,}/.test(x.heading));`, fail: "Give each of the five headings the business name: \"## Business 1: Mama Nkechi Kitchen\"." },
            { label: "Each has an industry and a specific problem", check: String.raw`return sections('Business ').every((x) => (field(x.text, 'Industry') || '').length >= 3 && words(field(x.text, 'What slows them down') || '') >= 8);`, fail: "Fill in the Industry and describe what slows each owner down in one specific sentence (8 words or more)." },
            { label: "Each names a VA type from this module", check: String.raw`return sections('Business ').every((x) => /(general|administrative|executive|social media|customer support|e-commerce|ecommerce|real estate|technical) VA/i.test(field(x.text, 'VA type') || ''));`, fail: "Name one of the eight types for each business, such as \"Executive VA\"." },
            { label: "At least three services each, starting with a verb", check: String.raw`return sections('Business ').every((x) => { const s = (x.text.split(/Services I would provide:/i)[1] || '').split(/Value to the owner:/i)[0]; const b = bullets(s); return b.length >= 3 && b.every((t) => isAction(t) || /^(manage|answer|record|track|post|log|design|reply|upload|prepare|type|research|organise|organize|handle|process|monitor|draft|coordinate|update|book|send|schedule|plan)/i.test(t)); });`, fail: "List at least three services under \"Services I would provide:\" as bullets that start with a verb (Manage, Answer, Schedule…)." },
            { label: "Each states the value to the owner", check: String.raw`return sections('Business ').every((x) => words(field(x.text, 'Value to the owner') || '') >= 4);`, fail: "Say what each owner gains: hours saved, customers kept, sales, less stress." },
            { label: "Variety: four industries and three VA types", check: String.raw`const b = sections('Business '); const ind = new Set(b.map((x) => (field(x.text, 'Industry') || '').toLowerCase().trim())); const t = new Set(b.map((x) => ((field(x.text, 'VA type') || '').toLowerCase().match(/(general|administrative|executive|social media|customer support|e-?commerce|real estate|technical)/) || [''])[0])); return ind.size >= 4 && t.size >= 3;`, fail: "Choose businesses from at least four industries, served by at least three different VA types." },
          ],
          solution: PRAC_DONE,
          hint: "Walk down a street (or scroll Instagram) and ask of each business: what are they too busy to do well?",
          successMessage: "Five businesses, five problems, five service plans: this is how you will talk to prospective clients in Module 11.",
        },
      },
    ],

    task: {
      title: "Module 1 practical: your first prospect list",
      intro: "Turn this module into the start of your VA career.",
      prompts: [
        "Visit or look up the five businesses you chose and check one thing you guessed about them (their reviews, their last social media post, how fast they reply to a message).",
        "Decide which two of the eight VA types interest you most, and write one sentence on why.",
        "Write your own \"how we will work together\" note with your real hours and channels, ready for your first client.",
        "List the equipment you have and what you need as backup (power, data, a headset), with a date to get each item.",
      ],
      closing: "Module 2 builds the digital skills every VA uses every day: files, shortcuts, cloud storage, troubleshooting and online safety.",
    },

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
