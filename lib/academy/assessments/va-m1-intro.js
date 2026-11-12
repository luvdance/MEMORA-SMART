/**
 * ASSESSMENTS · VIRTUAL ASSISTANT · MODULE 1 · INTRODUCTION
 *
 * SERVER ONLY. One check per lesson, four or five questions each.
 */
import { q, check } from "./va-helpers.js";

export const ASSESSMENTS = {
  ...check("va-l1-welcome", [
    q({
      id: "va-q1-01", atom: "a-va-meaning", d: 1,
      prompt: "What is virtual assistance?",
      options: ["Support services given to a business or professional from a remote location using digital tools", "A smartphone app that answers voice commands", "Office work that must be done in the client's building", "Selling products online"],
      correct: "a",
      explanation: "Virtual assistance is remote support (administrative, technical, creative or customer-facing) delivered with digital tools.",
      wrong: { b: "That describes software voice assistants such as Siri.", c: "The point of virtual assistance is that it is done remotely.", d: "That is e-commerce, which a VA may support but is not the definition." },
    }),
    q({
      id: "va-q1-02", atom: "a-va-meaning", d: 2,
      prompt: "Which change made hiring remote assistants from other countries common?",
      options: ["Freelance marketplaces and cloud tools such as shared documents and video calls", "The invention of the typewriter", "Fax machines", "Paper filing systems"],
      correct: "a",
      explanation: "Marketplaces connected clients and VAs across borders, and cloud tools made shared work easy.",
      wrong: { b: "Typewriters belong to the in-office secretary era.", c: "Fax did not make remote assistance practical at scale.", d: "Paper filing needs someone on site." },
    }),
    q({
      id: "va-q1-03", atom: "a-va-who", d: 1,
      prompt: "How is a human virtual assistant different from Siri or Alexa?",
      options: ["A human VA uses judgement and initiative and builds a working relationship with the client", "There is no difference", "Siri can manage a client relationship better", "A human VA only answers voice commands"],
      correct: "a",
      explanation: "Voice assistants are software that follow commands; a VA is a professional who thinks, decides and anticipates.",
      wrong: { b: "One is a person, the other is software.", c: "Software does not manage relationships.", d: "That describes the software, not the person." },
    }),
    q({
      id: "va-q1-04", atom: "a-va-who", d: 2,
      prompt: "A freelance VA usually works as…",
      options: ["A self-employed contractor serving one or more clients", "A government employee", "A full-time employee of every client", "An unpaid volunteer"],
      correct: "a",
      explanation: "Most VAs are self-employed contractors; some are remote employees of one company or agency.",
      wrong: { b: "Not the usual arrangement.", c: "A freelancer is not an employee of their clients.", d: "VAs are paid professionals." },
    }),
    q({
      id: "va-q1-05", atom: "a-va-welcome", d: 1,
      prompt: "How do the Workdesk practices in this course check your work?",
      options: ["Each item you set is marked right or wrong, and rules check the desk as a whole", "A tutor marks them a week later", "They are not checked", "Only your final score is shown, never which items were wrong"],
      correct: "a",
      explanation: "\"Check my work\" grades every item and any rules (such as no meeting clashes), with hints for red items.",
      wrong: { b: "The checks run instantly.", c: "Every Workdesk is checked.", d: "Each item shows green or red." },
    }),
  ]),

  ...check("va-l2-roles", [
    q({
      id: "va-q2-01", atom: "a-va-roles-core", d: 1,
      prompt: "Booking meetings and sending reminders belongs to which area of VA work?",
      options: ["Calendar and scheduling", "Research", "Finance administration", "Social media support"],
      correct: "a",
      explanation: "Meetings, appointments, invitations and reminders are calendar and scheduling work.",
      wrong: { b: "Research is finding and summarising information.", c: "Finance administration is invoices and payments.", d: "Social media support is posts and comments." },
    }),
    q({
      id: "va-q2-02", atom: "a-va-roles-core", d: 2,
      prompt: "Which task is finance administration that a VA can do routinely?",
      options: ["Prepare an invoice from agreed details and chase it when unpaid", "Decide which expenses are tax-deductible", "Audit the company accounts", "File the annual tax return"],
      correct: "a",
      explanation: "Invoices, expense tracking and payment reminders are administrative; accounting decisions need a professional.",
      wrong: { b: "That is tax advice.", c: "Audits need a qualified accountant.", d: "Tax filing needs a qualified professional." },
    }),
    q({
      id: "va-q2-03", atom: "a-va-roles-authority", d: 2,
      prompt: "Your client writes \"This needs paying\" about an invoice. You can see her bank account. What should you do?",
      options: ["Ask her to confirm in writing that you should pay it, with the amount and date", "Pay it immediately", "Do nothing", "Ask a friend what they would do"],
      correct: "a",
      explanation: "Payments need explicit written authority; a short question removes the doubt.",
      wrong: { b: "Access is not authority.", c: "Leaving it risks late fees; close the loop.", d: "The client decides, not a friend." },
    }),
    q({
      id: "va-q2-04", atom: "a-va-roles-authority", d: 2,
      prompt: "A customer asks whether a product is safe with their medical condition. What does a VA do?",
      options: ["Share the product information the client provided and advise them to consult a doctor", "Give your own medical opinion", "Say it is definitely safe", "Ignore the question"],
      correct: "a",
      explanation: "Medical advice needs a licensed professional; the VA shares facts and refers.",
      wrong: { b: "A VA is not qualified to give medical advice.", c: "That could harm the customer and the client.", d: "The customer still deserves a helpful reply." },
    }),
    q({
      id: "va-q2-05", atom: "a-va-roles-day", d: 1,
      prompt: "Why do many VAs start the day with the inbox and messages?",
      options: ["To catch anything urgent before starting focused work", "Because email is the only task", "To avoid doing other work", "Clients require it by law"],
      correct: "a",
      explanation: "A quick scan first means urgent matters are not missed, then focused blocks follow.",
      wrong: { b: "Email is one area of eight.", c: "It is a triage step, not avoidance.", d: "There is no such law." },
    }),
  ]),

  ...check("va-l3-types", [
    q({
      id: "va-q3-01", atom: "a-va-types-office", d: 2,
      prompt: "Which type of VA supports one senior person closely, including gatekeeping and board meetings?",
      options: ["Executive VA", "General VA", "E-commerce VA", "Technical VA"],
      correct: "a",
      explanation: "An executive VA works closely with one executive, with a high level of discretion.",
      wrong: { b: "General VAs do a broad mix for small businesses.", c: "E-commerce VAs run online stores.", d: "Technical VAs handle websites and automations." },
    }),
    q({
      id: "va-q3-02", atom: "a-va-types-customer", d: 1,
      prompt: "Uploading product listings, updating stock and processing returns is the work of…",
      options: ["An e-commerce VA", "A real estate VA", "An executive VA", "A social media VA"],
      correct: "a",
      explanation: "Running the operations of an online store is e-commerce VA work.",
      wrong: { b: "Real estate VAs handle property listings and viewings.", c: "Executive VAs support one senior person.", d: "Social media VAs handle posts and community." },
    }),
    q({
      id: "va-q3-03", atom: "a-va-types-customer", d: 2,
      prompt: "Which tools does a customer support VA typically use?",
      options: ["Help desks such as Zendesk, Freshdesk or Intercom", "Video editing software", "Architectural drawing tools", "Accounting audit software"],
      correct: "a",
      explanation: "Help desks organise customer conversations into tickets.",
      wrong: { b: "Not a support tool.", c: "Not a support tool.", d: "Not a support tool." },
    }),
    q({
      id: "va-q3-04", atom: "a-va-types-specialist", d: 2,
      prompt: "Connecting a web form to a CRM with Zapier is typical work for a…",
      options: ["Technical VA", "Real estate VA", "Customer support VA", "General VA only"],
      correct: "a",
      explanation: "Automations and connecting apps are technical VA work.",
      wrong: { b: "Real estate VAs focus on property work.", c: "Support VAs answer customers.", d: "A general VA might learn it, but it is a technical skill." },
    }),
    q({
      id: "va-q3-05", atom: "a-va-types-desk", d: 3,
      prompt: "An advert titled \"Executive assistant\" lists only: answer buyer emails, update order status, process exchanges. What is it really?",
      options: ["An e-commerce VA role", "An executive VA role", "A technical VA role", "A real estate VA role"],
      correct: "a",
      explanation: "Read the tasks, not the title: they are online store operations.",
      wrong: { b: "Nothing in the tasks is executive support.", c: "No technical tasks are listed.", d: "No property work is listed." },
    }),
  ]),

  ...check("va-l4-industries-remote", [
    q({
      id: "va-q4-01", atom: "a-va-industries", d: 2,
      prompt: "Why must a VA working for a clinic be especially careful with information?",
      options: ["Patient data is protected by privacy laws such as HIPAA, GDPR or the Nigeria Data Protection Act", "Clinics never use email", "Healthcare work is not real VA work", "Doctors dislike VAs"],
      correct: "a",
      explanation: "Health data is legally protected; confidentiality is a legal duty.",
      wrong: { b: "Clinics use email and booking systems.", c: "Appointment and inquiry work is common VA work.", d: "Not a reason." },
    }),
    q({
      id: "va-q4-02", atom: "a-va-remote-benefits", d: 1,
      prompt: "Which is a benefit of hiring a VA for a small business?",
      options: ["Paying only for the hours or tasks needed, with no office space or equipment", "The VA must be in the office every day", "Higher fixed costs", "Fewer skills available"],
      correct: "a",
      explanation: "Clients save on space, equipment and full-time salaries.",
      wrong: { b: "VAs work remotely.", c: "Costs are usually lower and flexible.", d: "Remote hiring widens the skills available." },
    }),
    q({
      id: "va-q4-03", atom: "a-va-remote-challenges", d: 2,
      prompt: "A recruiter asks you to pay ₦25,000 for a training certificate before starting a job. What is this?",
      options: ["A scam: real employers do not charge you to start work", "A normal onboarding fee", "A sign of a high-paying job", "A legal requirement"],
      correct: "a",
      explanation: "Being asked to pay to get a job is the classic advance-fee scam.",
      wrong: { b: "Legitimate employers do not charge.", c: "High pay is the bait.", d: "No law requires it." },
    }),
    q({
      id: "va-q4-04", atom: "a-va-remote-challenges", d: 2,
      prompt: "What is the professional way to handle frequent power cuts as a remote VA?",
      options: ["Have backup power and data, and tell the client early if a deadline is affected", "Hope it does not happen during work", "Blame the power company to the client after a missed deadline", "Only work when the power is on and say nothing"],
      correct: "a",
      explanation: "Plan backups and communicate early.",
      wrong: { b: "Hope is not a plan.", c: "Excuses after the fact damage trust.", d: "Silence leaves the client guessing." },
    }),
  ]),

  ...check("va-l5-ethics-clients", [
    q({
      id: "va-q5-01", atom: "a-va-qualities", d: 1,
      prompt: "\"Your passport expires in May; shall I book the renewal?\" shows which quality?",
      options: ["Initiative (being proactive)", "Discretion", "Adaptability", "Reliability only"],
      correct: "a",
      explanation: "Noticing what needs doing and suggesting it is initiative.",
      wrong: { b: "Discretion is keeping things private.", c: "Adaptability is learning new tools and processes.", d: "Reliability is doing what you promised." },
    }),
    q({
      id: "va-q5-02", atom: "a-va-ethics", d: 2,
      prompt: "A competitor of your client asks what your client is launching next month. What do you do?",
      options: ["Decline to share anything, and tell your client about the competitor's approach before taking any of their work", "Share general details only", "Share it if they promise secrecy", "Take both clients without telling either"],
      correct: "a",
      explanation: "Client information is confidential, and a potential conflict of interest must be disclosed.",
      wrong: { b: "Any launch information is confidential.", c: "Sharing breaks confidentiality regardless of promises.", d: "A hidden conflict of interest destroys trust." },
    }),
    q({
      id: "va-q5-03", atom: "a-va-ethics", d: 2,
      prompt: "Where should a VA keep a client's files?",
      options: ["In the client's own accounts and systems", "In the VA's personal Google Drive", "On a USB stick shared with friends", "In a public folder for easy access"],
      correct: "a",
      explanation: "Client data stays in client systems; local copies are deleted when the work ends.",
      wrong: { b: "Personal accounts mix data and risk loss when the contract ends.", c: "That risks a data leak.", d: "Public folders expose confidential data." },
    }),
    q({
      id: "va-q5-04", atom: "a-va-relationship", d: 2,
      prompt: "What causes most problems between clients and VAs?",
      options: ["Unclear expectations about scope, deadlines and communication", "Different favourite colours", "Using Slack instead of email", "The VA being in another country"],
      correct: "a",
      explanation: "Agreeing expectations in writing at the start prevents most problems.",
      wrong: { b: "Irrelevant.", c: "The tool matters less than agreeing which one to use.", d: "Distance is manageable with clear communication." },
    }),
    q({
      id: "va-q5-05", atom: "a-va-working-note", d: 2,
      prompt: "Which belongs in a \"how we will work together\" note?",
      options: ["Working hours with time zones, response times, channels, updates and confidentiality", "Your opinion of the client's business", "Your other clients' names", "Your personal bank PIN"],
      correct: "a",
      explanation: "The note answers when, how fast, where, how the client will know, and how information is protected.",
      wrong: { b: "Not relevant to working arrangements.", c: "That breaks other clients' confidentiality.", d: "Never share a PIN." },
    }),
  ]),

  ...check("va-l6-practical", [
    q({
      id: "va-q6-01", atom: "a-va-m1-spotting", d: 2,
      prompt: "Reviews say \"Nobody replied to my WhatsApp\". Which service fits best?",
      options: ["Customer support", "A new logo", "Bookkeeping", "Travel booking"],
      correct: "a",
      explanation: "Unanswered customers need customer support.",
      wrong: { b: "Branding does not answer messages.", c: "Not the problem described.", d: "Not related." },
    }),
    q({
      id: "va-q6-02", atom: "a-va-m1-spotting", d: 2,
      prompt: "How should you describe the value of your services to a business owner?",
      options: ["In their terms: hours saved, customers kept, more sales, less stress", "As a list of software you know", "With technical jargon", "By your hourly rate only"],
      correct: "a",
      explanation: "Owners buy results, not tools.",
      wrong: { b: "Tools are a means, not the value.", c: "Jargon hides the value.", d: "Price without value is just a cost." },
    }),
    q({
      id: "va-q6-03", atom: "a-va-m1-practical", d: 2,
      prompt: "Which is the best way to write a service in a proposal or plan?",
      options: ["Manage bookings and reminders in a shared calendar", "Calendar", "I am good with calendars", "Calendars and stuff"],
      correct: "a",
      explanation: "Start with a verb and say exactly what you will do.",
      wrong: { b: "A single noun says nothing about the work.", c: "A claim, not a service.", d: "Vague and unprofessional." },
    }),
    q({
      id: "va-q6-04", atom: "a-va-m1-practical", d: 1,
      prompt: "A social media page last updated eight months ago suggests the business could use…",
      options: ["A social media VA", "A real estate VA", "A technical audit", "Tax advice"],
      correct: "a",
      explanation: "An inactive page signals no time for social media.",
      wrong: { b: "Not related to property.", c: "The issue is content, not technology.", d: "Not related." },
    }),
  ]),
};

export default ASSESSMENTS;
