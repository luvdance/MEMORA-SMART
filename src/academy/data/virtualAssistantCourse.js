/**
 * VIRTUAL ASSISTANCE — FROM BEGINNER TO HIRED VIRTUAL ASSISTANT
 *
 * Authored from the Memora Smart Technologies curriculum: twelve modules,
 * from "what is a virtual assistant?" to a complete portfolio and a career
 * action plan. Foundations (the profession, digital skills, professional
 * communication), core services (executive and administrative support,
 * office applications, research and data), client-facing services (customer
 * support, project coordination, social media), and the modern and
 * business skills (AI and automation, freelancing and client acquisition,
 * portfolio and career readiness).
 *
 * Course content is DATA, never markup, in exactly the shape of the other
 * courses, so the catalog, sidebar, player, progress engine and stats band
 * render it without a change.
 *
 *   courses/{courseId}
 *     └── modules/{moduleId}          one curriculum module (one week)
 *           └── lessons/{lessonId}    one to three curriculum topics
 *                 └── atoms/{atomId}  one idea each
 *
 * ── THE PRACTICE IS THE JOB ──────────────────────────────────────────────
 * A virtual assistant is hired to do work, so every lesson makes the learner
 * do some, checked by machine:
 *   - `deskLab`, the VA Workdesk (src/academy/components/DeskLab.jsx): a
 *     simulated inbox, help desk, calendar, project board, shared drive,
 *     lead list or social inbox. The learner labels, prioritises, schedules,
 *     routes, assigns and corrects; each item is graded, and rules check the
 *     desk as a whole (no meeting clashes, no task before its dependency).
 *   - `writingLab`, the Writing Desk: emails, minutes, agendas, itineraries,
 *     reports, proposals and profiles, checked against the brief.
 *   - `exercise`, the live spreadsheet: real formulas in a grid.
 *   - `decision`: the judgement calls (confidentiality, scope, escalation).
 * `npm run validate:content` proves every lab: the model passes, the
 * untouched starter fails.
 *
 * ── THE CURRICULUM TABLE ─────────────────────────────────────────────────
 * `curriculum` on each module is the source document's topic list, numbered
 * N.1, N.2 … with N.P for the module's practical exercise. Every lesson
 * declares the numbers it `covers`, and `npm run test:academy` fails if any
 * topic is not taught.
 */

export const VIRTUAL_ASSISTANT_COURSE = {
  id: "virtual-assistant",
  slug: "virtual-assistant",
  title: "Virtual Assistance: From Beginner to Hired VA",
  subtitle: "Run a client's inbox, calendar, customers and projects from anywhere",
  tagline:
    "Inbox and calendar management, office tools, research, customer support, project coordination, social media, AI and automation, and the freelancing skills to win clients.",
  description:
    "A twelve-week programme that takes you from \"what is a virtual assistant?\" to a portfolio that wins clients. You learn the profession and its ethics; the digital skills every remote worker needs (files, shortcuts, cloud storage, troubleshooting, online safety); and professional communication with international clients across time zones. You then master the core services clients pay for: inbox and calendar management, travel itineraries, agendas and minutes, data entry, Word, Excel, Google Workspace and PDFs, online research, lead generation and CRMs. You run a customer support desk, coordinate projects on a board, support social media and email marketing, and use AI tools and automation responsibly. Finally you choose a niche, price and package your services, write proposals, build profiles on Upwork, Fiverr and LinkedIn, and assemble a complete portfolio. Every lesson makes you do the work on a simulated Workdesk (a real-looking inbox, help desk, calendar, project board, drive and lead list) or a Writing Desk, and checks it. No experience required.",

  status: "live",
  level: "Beginner → Job-ready",
  durationMonths: 3,
  hoursPerWeek: "6–8",
  language: "English",
  instructor: {
    name: "Memora Smart Academy",
    role: "Industry-led curriculum",
  },

  access: {
    accessType: "free",
    price: 0,
    currency: "NGN",
    enrollmentStatus: "open",
  },

  tools: [
    {
      id: "desk",
      name: "The VA Workdesk",
      short: "Workdesk",
      blurb: "A simulated inbox, help desk, calendar, board, drive and lead list, checked as you work.",
      icon: "fas fa-briefcase",
      accent: "#1d4ed8",
    },
    {
      id: "google",
      name: "Google Workspace",
      short: "Google Workspace",
      blurb: "Gmail, Calendar, Drive, Docs, Sheets and Slides: the toolkit most small clients run on.",
      icon: "fab fa-google",
      accent: "#15803d",
    },
    {
      id: "microsoft",
      name: "Microsoft 365",
      short: "Microsoft 365",
      blurb: "Outlook, Word, Excel, PowerPoint, OneDrive and Teams for corporate clients.",
      icon: "fab fa-microsoft",
      accent: "#b45309",
    },
    {
      id: "work",
      name: "Trello, Asana, HubSpot, Zendesk, Canva & Zapier",
      short: "Client tools",
      blurb: "Boards, CRMs, help desks, design and automation, learned by what they do.",
      icon: "fas fa-toolbox",
      accent: "#7c3aed",
    },
  ],

  outcomes: [
    "Explain what virtual assistants do, the main types of VA and the industries that hire them",
    "Work confidently with files, folders, shortcuts, cloud storage, sharing permissions and basic troubleshooting",
    "Stay safe online: spot phishing, use strong passwords and two-factor authentication, protect client data",
    "Write clear, professional emails and messages, and communicate across cultures and time zones",
    "Manage an executive's inbox and calendar, schedule meetings, prepare itineraries, agendas and minutes",
    "Produce documents, spreadsheets with formulas, presentations and PDFs in Microsoft 365 and Google Workspace",
    "Research online, judge sources, build verified lead lists and keep a CRM accurate",
    "Run a customer support desk: answer inquiries, handle complaints, classify and escalate tickets",
    "Coordinate projects on a board with owners, deadlines, dependencies and status reports",
    "Support social media and email marketing: calendars, simple graphics, community replies and reports",
    "Use AI tools and automation responsibly to work faster without losing accuracy or privacy",
    "Choose a niche, package and price services, write winning proposals and onboard clients professionally",
    "Present a complete VA portfolio, CV and LinkedIn profile, and follow a career action plan",
  ],

  audience: [
    "Complete beginners who want to work remotely as virtual assistants",
    "Graduates, job seekers and career changers looking for remote work",
    "Administrative staff, secretaries and office managers moving online",
    "Stay-at-home parents and students who want flexible, paid work",
  ],

  requirements: [
    "A laptop or desktop computer; a phone works for reading but not for the practicals",
    "A stable internet connection",
    "A free Google account (Gmail, Drive, Docs, Sheets); Microsoft 365 is optional",
    "Basic English reading and writing; no previous experience",
  ],

  /** The four parts of the course; `weeks` are module orders. */
  phases: [
    { phase: 1, title: "Foundations of virtual assistance", weeks: [1, 2, 3] },
    { phase: 2, title: "Core administrative services", weeks: [4, 5, 6] },
    { phase: 3, title: "Client-facing services", weeks: [7, 8, 9] },
    { phase: 4, title: "Modern skills, business and career", weeks: [10, 11, 12] },
  ],

  months: [
    /* ═══════════════════════ MONTH 1 · WEEKS 1–4 ═══════════════════════ */
    {
      month: 1,
      title: "Foundations and executive support",
      focus: "Weeks 1–4",
      summary:
        "What a virtual assistant is and does; the digital skills of remote work; professional communication with clients anywhere in the world; and the heart of the job: inbox, calendar, travel, meetings, documents and records for a busy executive.",
      modules: [
        {
          id: "va-m1-intro",
          order: 1,
          phase: 1,
          week: "Week 1",
          title: "Module 1 · Introduction to Virtual Assistance",
          summary:
            "The meaning and evolution of virtual assistance, who a VA is, roles and responsibilities, the eight types of VA, the industries that hire them, remote work, the qualities and ethics of a VA, and the client–assistant relationship.",
          atoms: 22,
          topics: [
            "What virtual assistance is and how it evolved",
            "Roles and responsibilities of a VA",
            "Eight types of virtual assistant",
            "Industries and remote work",
            "Qualities, ethics and the client relationship",
          ],
          curriculum: [
            ["1.0", "Welcome: what a virtual assistant does, and the road ahead"],
            ["1.1", "Meaning, concept and evolution of virtual assistance"],
            ["1.2", "Who is a virtual assistant (VA)?"],
            ["1.3", "Roles and responsibilities of a virtual assistant"],
            ["1.4", "Types of VA: general, administrative and executive"],
            ["1.5", "Types of VA: social media, customer support and e-commerce"],
            ["1.6", "Types of VA: real estate and technical"],
            ["1.7", "Industries that employ virtual assistants"],
            ["1.8", "Remote work: opportunities, benefits and challenges"],
            ["1.9", "Essential qualities and professional ethics of a VA"],
            ["1.10", "Understanding the client–assistant relationship"],
            ["1.P", "Practical: five businesses that could use a VA, and the services you would offer each"],
          ],
          project: "Identify five businesses that could benefit from virtual assistant services and outline the services you could provide to each.",
        },
        {
          id: "va-m2-digital",
          order: 2,
          phase: 1,
          week: "Week 2",
          title: "Module 2 · Essential Digital Skills and Computer Proficiency",
          summary:
            "Computer and operating system fundamentals on Windows and macOS, file and folder management, keyboard shortcuts, effective browsing, downloading, uploading and sharing, cloud storage and sync, basic troubleshooting, and internet safety.",
          atoms: 26,
          topics: [
            "Computers, Windows and macOS",
            "Files, folders and naming conventions",
            "Keyboard shortcuts and browsing",
            "Cloud storage, sharing and troubleshooting",
            "Internet safety and digital hygiene",
          ],
          curriculum: [
            ["2.1", "Computer fundamentals: hardware, software and the operating system"],
            ["2.2", "Windows and macOS fundamentals"],
            ["2.3", "File and folder management"],
            ["2.4", "Keyboard shortcuts and productivity techniques"],
            ["2.5", "Internet navigation and effective web browsing"],
            ["2.6", "Downloading, uploading and sharing files"],
            ["2.7", "Cloud storage and file synchronisation: Google Drive, OneDrive and Dropbox"],
            ["2.8", "Basic troubleshooting"],
            ["2.9", "Internet safety and digital hygiene"],
            ["2.P", "Practical: a professional digital filing system for a fictional company, shared with the right permissions"],
          ],
          project: "Create a professional digital filing system for a fictional company, organise its documents, and share selected folders with appropriate permissions.",
        },
        {
          id: "va-m3-communication",
          order: 3,
          phase: 1,
          week: "Week 3",
          title: "Module 3 · Professional Communication and Business Etiquette",
          summary:
            "The principles of professional communication; written, verbal and non-verbal; email, business messaging, phone and video; active listening and good questions; international clients, cultures and time zones; difficult conversations, confidentiality and boundaries.",
          atoms: 25,
          topics: [
            "Principles and channels of communication",
            "Professional email",
            "Messaging, phone and video calls",
            "Listening, questions and international clients",
            "Difficult conversations, confidentiality and boundaries",
          ],
          curriculum: [
            ["3.1", "Principles of professional communication"],
            ["3.2", "Written, verbal and non-verbal communication"],
            ["3.3", "Professional email writing and etiquette"],
            ["3.4", "Business messaging and instant communication: Slack and Microsoft Teams"],
            ["3.5", "Telephone and video communication: Zoom, Teams and Google Meet"],
            ["3.6", "Active listening and asking effective questions"],
            ["3.7", "Communicating with international clients"],
            ["3.8", "Cross-cultural communication and time-zone differences"],
            ["3.9", "Handling difficult conversations"],
            ["3.10", "Confidentiality and professional boundaries"],
            ["3.P", "Practical: professional responses to five client situations"],
          ],
          project: "Write professional responses to five client situations: a complaint, a meeting request, a delayed delivery, a clarification request and a project update.",
        },
        {
          id: "va-m4-admin",
          order: 4,
          phase: 2,
          week: "Week 4",
          title: "Module 4 · Administrative and Executive Assistance",
          summary:
            "Daily administration, inbox management with labels, filters and priorities, calendar management and scheduling, travel research and itineraries, agendas and minutes, documents, data entry and records, confidential information and executive support.",
          atoms: 28,
          topics: [
            "The daily admin routine",
            "Inbox management: labels, filters, priorities, archiving",
            "Calendars, scheduling and travel itineraries",
            "Agendas, minutes, documents and records",
            "Confidentiality and executive support",
          ],
          curriculum: [
            ["4.1", "Managing daily administrative responsibilities"],
            ["4.2", "Email inbox management and organisation"],
            ["4.3", "Email filtering, labelling, prioritisation and archiving"],
            ["4.4", "Calendar management"],
            ["4.5", "Scheduling appointments and meetings"],
            ["4.6", "Travel research and itinerary preparation"],
            ["4.7", "Preparing agendas and meeting minutes"],
            ["4.8", "Document preparation and formatting"],
            ["4.9", "Data entry and record keeping"],
            ["4.10", "Managing confidential information"],
            ["4.11", "Executive support and task prioritisation"],
            ["4.P", "Practical: a week as executive assistant to a fictional CEO"],
          ],
          project: "Act as an executive assistant for a fictional CEO: organise their inbox, schedule a week's meetings, prepare a meeting agenda and create a travel itinerary.",
        },
      ],
    },

    /* ═══════════════════════ MONTH 2 · WEEKS 5–8 ═══════════════════════ */
    {
      month: 2,
      title: "Office tools, research and client services",
      focus: "Weeks 5–8",
      summary:
        "The office applications every client uses, online research and lead generation with CRMs, a customer support desk, and the project coordination that keeps a client's work moving.",
      modules: [
        {
          id: "va-m5-office",
          order: 5,
          phase: 2,
          week: "Week 5",
          title: "Module 5 · Productivity and Office Applications",
          summary:
            "Microsoft Word and Google Docs, Excel and Google Sheets from data entry to formulas, PowerPoint and Google Slides, PDFs, and collaborative document workflows in Microsoft 365 and Google Workspace.",
          atoms: 20,
          topics: [
            "Word and Google Docs",
            "Excel and Google Sheets: data, sorting, filtering",
            "Spreadsheet formulas",
            "PowerPoint, Google Slides and PDFs",
            "Collaborative workflows",
          ],
          curriculum: [
            ["5.1", "Microsoft Word: document creation, formatting, tables, templates and reports"],
            ["5.2", "Google Docs: collaborative document creation"],
            ["5.3", "Microsoft Excel and Google Sheets: data entry, formatting, sorting and filtering"],
            ["5.4", "Excel and Google Sheets: basic formulas"],
            ["5.5", "PowerPoint and Google Slides: presentation design and formatting"],
            ["5.6", "PDF creation, conversion, editing and management"],
            ["5.7", "Collaborative document workflows"],
            ["5.P", "Practical: a business report, an expense spreadsheet and a client presentation"],
          ],
          project: "Prepare a professional business report, an expense spreadsheet and a presentation for a client.",
        },
        {
          id: "va-m6-research",
          order: 6,
          phase: 2,
          week: "Week 6",
          title: "Module 6 · Online Research and Data Management",
          summary:
            "Online research and advanced search, credible sources, competitor and market research, lead generation and contact lists, data collection, analysis and reporting, accuracy and verification, and databases and CRMs.",
          atoms: 21,
          topics: [
            "Search techniques and advanced Google searches",
            "Credible sources",
            "Competitor and market research",
            "Lead generation and contact lists",
            "Data, verification and CRMs",
          ],
          curriculum: [
            ["6.1", "Understanding online research"],
            ["6.2", "Search engine techniques and advanced Google searches"],
            ["6.3", "Finding reliable and credible information"],
            ["6.4", "Competitor and market research"],
            ["6.5", "Lead generation and prospect research"],
            ["6.6", "Contact list building"],
            ["6.7", "Data collection and organisation"],
            ["6.8", "Basic data analysis and reporting"],
            ["6.9", "Data accuracy and verification"],
            ["6.10", "Introduction to databases and CRM systems: HubSpot CRM and Airtable"],
            ["6.P", "Practical: a verified lead-generation spreadsheet of 20 potential clients"],
          ],
          project: "Research 20 potential business clients in a selected industry and create a verified lead-generation spreadsheet with company names, websites, contact information and notes.",
        },
        {
          id: "va-m7-customer",
          order: 7,
          phase: 3,
          week: "Week 7",
          title: "Module 7 · Customer Service and Client Relationship Management",
          summary:
            "Customer service fundamentals and expectations, inquiries, complaints and conflict, support by email, chat and phone, feedback and satisfaction, tickets and escalation, retention, support systems, onboarding and follow-up.",
          atoms: 23,
          topics: [
            "Service fundamentals and expectations",
            "Inquiries, complaints and conflict",
            "Email, chat and phone support",
            "Feedback, tickets and escalation",
            "Retention, help desks and onboarding",
          ],
          curriculum: [
            ["7.1", "Fundamentals of customer service"],
            ["7.2", "Understanding customer expectations"],
            ["7.3", "Handling customer inquiries"],
            ["7.4", "Responding to complaints and resolving conflicts"],
            ["7.5", "Customer support via email, chat and phone"],
            ["7.6", "Customer feedback and satisfaction"],
            ["7.7", "Ticket management and escalation"],
            ["7.8", "Customer retention and relationship building"],
            ["7.9", "Introduction to customer support systems: Zendesk, Freshdesk and Intercom"],
            ["7.10", "Professional client onboarding and follow-up"],
            ["7.P", "Practical: run a support desk of ten customer inquiries"],
          ],
          project: "Simulate a customer support desk: handle 10 customer inquiries, classify tickets, resolve common issues and escalate complex complaints.",
        },
        {
          id: "va-m8-projects",
          order: 8,
          phase: 3,
          week: "Week 8",
          title: "Module 8 · Project Management and Task Coordination",
          summary:
            "Projects, tasks and deliverables, assignment and prioritisation, deadlines and tracking, several projects at once, task lists and workflows, collaboration and accountability, progress reports, urgent work and the main methodologies.",
          atoms: 17,
          topics: [
            "Projects, tasks and deliverables",
            "Assigning, prioritising and tracking",
            "Workflows and multiple projects",
            "Collaboration and progress reports",
            "Urgent work and methodologies",
          ],
          curriculum: [
            ["8.1", "Introduction to project management"],
            ["8.2", "Understanding tasks, projects and deliverables"],
            ["8.3", "Task assignment and prioritisation"],
            ["8.4", "Setting deadlines and tracking progress"],
            ["8.5", "Managing multiple projects"],
            ["8.6", "Creating task lists and workflows"],
            ["8.7", "Team collaboration and accountability"],
            ["8.8", "Reporting project progress"],
            ["8.9", "Managing urgent tasks and competing priorities"],
            ["8.10", "Introduction to project management methodologies"],
            ["8.P", "Practical: a project board for a fictional business launch"],
          ],
          project: "Create and manage a project board for a fictional business launch, with tasks, deadlines, responsibilities, dependencies and progress updates.",
        },
      ],
    },

    /* ═══════════════════════ MONTH 3 · WEEKS 9–12 ══════════════════════ */
    {
      month: 3,
      title: "Marketing support, AI, clients and career",
      focus: "Weeks 9–12",
      summary:
        "Social media and email marketing support, AI tools and automation, the business of freelancing and winning clients, and the portfolio, CV and plan that get you hired.",
      modules: [
        {
          id: "va-m9-social",
          order: 9,
          phase: 3,
          week: "Week 9",
          title: "Module 9 · Social Media and Basic Digital Marketing Support",
          summary:
            "Social platforms and social media management, scheduling and publishing, simple graphics, content calendars, community management, comments and DMs, analytics, email marketing and campaign support.",
          atoms: 20,
          topics: [
            "Platforms and social media management",
            "Scheduling, graphics and content calendars",
            "Community management, comments and DMs",
            "Engagement and performance analytics",
            "Email marketing and campaigns",
          ],
          curriculum: [
            ["9.1", "Understanding social media platforms"],
            ["9.2", "Introduction to social media management"],
            ["9.3", "Content scheduling and publishing: Meta Business Suite, Buffer and Hootsuite"],
            ["9.4", "Creating simple graphics and social media posts with Canva"],
            ["9.5", "Content calendars"],
            ["9.6", "Community management"],
            ["9.7", "Responding to comments and direct messages"],
            ["9.8", "Basic engagement and performance analytics"],
            ["9.9", "Introduction to email marketing with Mailchimp"],
            ["9.10", "Supporting digital marketing campaigns"],
            ["9.P", "Practical: a seven-day content calendar, three graphics and a monthly report"],
          ],
          project: "Develop a seven-day content calendar, create three social media graphics and prepare a simple monthly performance report.",
        },
        {
          id: "va-m10-ai",
          order: 10,
          phase: 4,
          week: "Week 10",
          title: "Module 10 · Artificial Intelligence and Automation for Virtual Assistants",
          summary:
            "Artificial intelligence and generative AI, AI for research, effective prompts, AI-assisted writing and summaries, task lists, spreadsheets and customer support with AI, workflow automation with Zapier and Make, and ethical, private, fact-checked AI use.",
          atoms: 20,
          topics: [
            "AI, generative AI and research",
            "Writing effective prompts",
            "AI for emails, documents and summaries",
            "AI for tasks, spreadsheets and support",
            "Automation, ethics, privacy and fact-checking",
          ],
          curriculum: [
            ["10.1", "Understanding artificial intelligence and generative AI"],
            ["10.2", "Using AI for research and information gathering"],
            ["10.3", "Writing effective prompts"],
            ["10.4", "AI-assisted email and document writing"],
            ["10.5", "Summarising meetings and documents"],
            ["10.6", "Creating task lists and workflows with AI"],
            ["10.7", "AI-assisted spreadsheet operations"],
            ["10.8", "Using AI for customer support"],
            ["10.9", "Introduction to workflow automation: Zapier and Make"],
            ["10.10", "Ethical AI use, privacy and fact-checking"],
            ["10.P", "Practical: an AI-assisted email, meeting summary, research report and automated workflow"],
          ],
          project: "Use AI to create a client email response, summarise a meeting, prepare a research report and design a simple automated workflow.",
        },
        {
          id: "va-m11-freelancing",
          order: 11,
          phase: 4,
          week: "Week 11",
          title: "Module 11 · Freelancing, Business Development and Client Acquisition",
          summary:
            "The VA job market, freelancing versus employment, your niche and target clients, service packages and pricing, proposals and profiles, prospecting and interviews, onboarding and contracts, expectations, invoicing and records, and long-term clients.",
          atoms: 26,
          topics: [
            "The market, niches and target clients",
            "Packages and pricing",
            "Proposals, profiles and outreach",
            "Onboarding, contracts and expectations",
            "Invoicing, records and long-term clients",
          ],
          curriculum: [
            ["11.1", "Understanding the virtual assistant job market"],
            ["11.2", "Freelancing versus remote employment"],
            ["11.3", "Identifying your VA niche and services"],
            ["11.4", "Defining your target clients"],
            ["11.5", "Creating service packages"],
            ["11.6", "Pricing your services"],
            ["11.7", "Writing compelling proposals"],
            ["11.8", "Creating professional profiles: Upwork, Fiverr, LinkedIn, Freelancer and PeoplePerHour"],
            ["11.9", "Client prospecting and outreach"],
            ["11.10", "Interview preparation"],
            ["11.11", "Client onboarding and contracts"],
            ["11.12", "Managing expectations and delivering value"],
            ["11.13", "Invoicing, payments and basic financial record keeping"],
            ["11.14", "Building long-term client relationships"],
            ["11.P", "Practical: a freelancing profile, three service packages and a proposal"],
          ],
          project: "Create a professional freelancing profile, define three service packages and write a proposal responding to a fictional client job advertisement.",
        },
        {
          id: "va-m12-career",
          order: 12,
          phase: 4,
          week: "Week 12",
          title: "Module 12 · Professional Portfolio, Practical Internship and Career Readiness",
          summary:
            "A professional VA portfolio, showcasing skills, sample work and case studies, CV and LinkedIn, interviews, client expectations and service delivery, time management, continuous learning and a personal career action plan.",
          atoms: 18,
          topics: [
            "Portfolio, samples and case studies",
            "CV and LinkedIn",
            "Interviews and service delivery",
            "Time management and growth",
            "Your career action plan",
          ],
          curriculum: [
            ["12.1", "Building a professional VA portfolio"],
            ["12.2", "Showcasing administrative and technical skills"],
            ["12.3", "Preparing sample work and case studies"],
            ["12.4", "Creating a professional resume/CV"],
            ["12.5", "Optimising a LinkedIn profile"],
            ["12.6", "Preparing for virtual assistant interviews"],
            ["12.7", "Understanding client expectations and service delivery"],
            ["12.8", "Time management and productivity habits"],
            ["12.9", "Professional growth and continuous learning"],
            ["12.10", "Developing a personal career action plan"],
            ["12.P", "Practical: a complete Virtual Assistant portfolio"],
          ],
          project: "Build a complete Virtual Assistant portfolio with sample documents, spreadsheets, email correspondence, research work, project boards and social media content.",
        },
      ],
    },
  ],

  certificate: {
    issuer: "Memora Smart Technologies",
    name: "Professional Virtual Assistant",
    covers: "Executive & administrative support • Office tools & research • Customer support & project coordination • Social media, AI & automation • Freelancing & client management",
    idFormat: "MST-CERT-2026-000001",
    requirements: [
      "Complete every required lesson",
      "Pass every lesson check at 70% or above",
      "Complete the practical exercise that ends each module",
      "Complete the Virtual Assistant portfolio",
      "Pass the final certification exam: 70% overall and at least 50% in every section",
    ],
  },

  checkpoints: [
    {
      afterMonth: 1,
      title: "Foundations checkpoint",
      format: "Five businesses and the services you would offer them, a shared filing system with permissions, five client responses, and a week as a CEO's executive assistant.",
      passMark: 70,
    },
    {
      afterMonth: 2,
      title: "Services checkpoint",
      format: "A business report, expense spreadsheet and presentation; a verified 20-lead list; a ten-ticket support desk; and a business launch project board.",
      passMark: 70,
    },
    {
      afterMonth: 3,
      title: "Final",
      format: "A content calendar and monthly report, an AI-assisted work pack with an automation, a profile with three packages and a proposal, and the complete VA portfolio.",
      passMark: 70,
    },
  ],
};

/** Every module id, in teaching order. The validator and tests read this. */
export const VIRTUAL_ASSISTANT_MODULE_IDS = VIRTUAL_ASSISTANT_COURSE.months.flatMap((m) =>
  m.modules.map((mod) => mod.id)
);

export default VIRTUAL_ASSISTANT_COURSE;
