/**
 * ASSESSMENTS · VIRTUAL ASSISTANT · MODULE 12 · PORTFOLIO AND CAREER
 *
 * SERVER ONLY. One check per lesson, four or five questions each.
 */
import { q, check } from "./va-helpers.js";

export const ASSESSMENTS = {
  ...check("va-l77-portfolio", [
    q({
      id: "va-q77-01", atom: "a-va-portfolio", d: 1,
      prompt: "What is the main purpose of a VA portfolio?",
      options: ["To give clients evidence of what you can do, in one shareable place", "To list every job you applied for", "To store your passwords", "To replace your contract"],
      correct: "a",
      explanation: "Evidence beats claims.",
      wrong: { b: "No.", c: "Never.", d: "No." },
    }),
    q({
      id: "va-q77-02", atom: "a-va-showcase", d: 2,
      prompt: "How can you make invisible admin work visible in a portfolio?",
      options: ["Screenshots, before-and-after examples and short screen-recorded walkthroughs", "Long paragraphs of claims", "Client passwords", "Nothing can show it"],
      correct: "a",
      explanation: "Show results and systems.",
      wrong: { b: "Claims are weak.", c: "Never.", d: "It can be shown." },
    }),
    q({
      id: "va-q77-03", atom: "a-va-case-studies", d: 2,
      prompt: "What makes a case study convincing?",
      options: ["A clear challenge, specific actions and results with numbers", "Lots of adjectives", "Real client names without permission", "No results"],
      correct: "a",
      explanation: "Evidence and numbers.",
      wrong: { b: "Weak.", c: "Breaks confidentiality.", d: "Results are the point." },
    }),
    q({
      id: "va-q77-04", atom: "a-va-case-studies", d: 2,
      prompt: "Can course practicals go in your portfolio?",
      options: ["Yes, labelled honestly as practice projects", "Yes, presented as real paid client work", "No, never", "Only if you change the dates"],
      correct: "a",
      explanation: "Honest labelling keeps them legitimate.",
      wrong: { b: "Misleading.", c: "They are valid samples.", d: "Dishonest." },
    }),
  ]),

  ...check("va-l78-cv-linkedin", [
    q({
      id: "va-q78-01", atom: "a-va-cv", d: 2,
      prompt: "Which CV bullet is strongest?",
      options: ["Reduced a CEO's unread emails from 300 to under 20 within two weeks", "Responsible for emails", "Good with emails", "I did email stuff"],
      correct: "a",
      explanation: "Action verb plus a measurable result.",
      wrong: { b: "Duty, not achievement.", c: "A claim.", d: "Vague." },
    }),
    q({
      id: "va-q78-02", atom: "a-va-cv", d: 2,
      prompt: "Why keep a CV layout simple, without tables and graphics?",
      options: ["So applicant tracking systems can read it", "Because colour is forbidden", "To make it longer", "It does not matter"],
      correct: "a",
      explanation: "ATS software screens many CVs.",
      wrong: { b: "No.", c: "No.", d: "It does." },
    }),
    q({
      id: "va-q78-03", atom: "a-va-linkedin", d: 2,
      prompt: "Which LinkedIn headline is best?",
      options: ["Virtual Assistant for Coaches | Inbox, Calendar and Client Onboarding", "VA | Open to work", "Hardworking", "Looking for opportunities"],
      correct: "a",
      explanation: "Who you help and how.",
      wrong: { b: "Says little.", c: "Says nothing.", d: "Says nothing." },
    }),
    q({
      id: "va-q78-04", atom: "a-va-linkedin", d: 2,
      prompt: "Which LinkedIn section shows your portfolio and case studies?",
      options: ["Featured", "Headline", "Location", "Languages"],
      correct: "a",
      explanation: "Featured shows links and media.",
      wrong: { b: "Short text only.", c: "No.", d: "No." },
    }),
  ]),

  ...check("va-l79-interviews-delivery", [
    q({
      id: "va-q79-01", atom: "a-va-interview-prep", d: 2,
      prompt: "Why do many candidates fail VA test tasks?",
      options: ["They do not follow the instructions exactly", "The tasks are impossible", "They finish early", "They ask questions"],
      correct: "a",
      explanation: "Following instructions is part of the test.",
      wrong: { b: "No.", c: "Not a problem.", d: "Good questions help." },
    }),
    q({
      id: "va-q79-02", atom: "a-va-interview-prep", d: 2,
      prompt: "You are asked about a tool you have never used. What do you say?",
      options: ["Be honest and explain how you would learn it quickly", "Claim you are an expert", "Change the subject", "Say tools are unimportant"],
      correct: "a",
      explanation: "Honesty plus a learning plan.",
      wrong: { b: "Will be exposed.", c: "Evasive.", d: "Clients care about tools." },
    }),
    q({
      id: "va-q79-03", atom: "a-va-service-delivery", d: 2,
      prompt: "What should you do before sending any deliverable?",
      options: ["Run a quality checklist: names, dates, figures, attachments, spelling, links, tone", "Send it fast", "Ask the client to check it", "Nothing"],
      correct: "a",
      explanation: "Checking is part of the service.",
      wrong: { b: "Errors cost more.", c: "That is your job.", d: "Risky." },
    }),
    q({
      id: "va-q79-04", atom: "a-va-service-delivery", d: 2,
      prompt: "Which five things do clients consistently expect from a VA?",
      options: ["Reliability, responsiveness, accuracy, proactivity and discretion", "Speed only", "Lowest price", "Constant availability at any hour"],
      correct: "a",
      explanation: "The pillars of good service.",
      wrong: { b: "Incomplete.", c: "Not the main expectation.", d: "Not sustainable or expected." },
    }),
  ]),

  ...check("va-l80-time-growth", [
    q({
      id: "va-q80-01", atom: "a-va-time-management", d: 2,
      prompt: "What is time blocking?",
      options: ["Giving each client or type of work its own block in your calendar", "Blocking clients on WhatsApp", "Working without breaks", "Refusing meetings"],
      correct: "a",
      explanation: "Planned blocks protect focus.",
      wrong: { b: "No.", c: "No.", d: "No." },
    }),
    q({
      id: "va-q80-02", atom: "a-va-time-management", d: 2,
      prompt: "Why track your time with a tool like Toggl?",
      options: ["Accurate billing and seeing where hours go", "To spy on clients", "Because it is fun", "Clients require it by law"],
      correct: "a",
      explanation: "Data for billing and planning.",
      wrong: { b: "No.", c: "Not the reason.", d: "No." },
    }),
    q({
      id: "va-q80-03", atom: "a-va-growth", d: 2,
      prompt: "Which is a free way to learn tools clients use?",
      options: ["HubSpot Academy, Google Skillshop, Canva Design School, Zapier University", "Paying for fake certificates", "Waiting for clients to train you", "There are none"],
      correct: "a",
      explanation: "Many vendors offer free training.",
      wrong: { b: "Dishonest.", c: "Too passive.", d: "Many exist." },
    }),
    q({
      id: "va-q80-04", atom: "a-va-growth", d: 2,
      prompt: "You are exhausted and making errors at 50 hours a week. The best long-term fix is to…",
      options: ["Protect breaks and a day off, and raise rates or reduce scope rather than adding hours", "Take another client", "Work faster without checking", "Ignore it"],
      correct: "a",
      explanation: "Sustainability protects quality.",
      wrong: { b: "Worse.", c: "More errors.", d: "It will worsen." },
    }),
  ]),

  ...check("va-l81-action-plan", [
    q({
      id: "va-q81-01", atom: "a-va-smart", d: 2,
      prompt: "Which goal is SMART?",
      options: ["Win two paying clients with $500 a month in retainers by 30 September", "Get clients", "Be successful", "Work hard this year"],
      correct: "a",
      explanation: "Specific, measurable, achievable, relevant, time-bound.",
      wrong: { b: "A wish.", c: "Vague.", d: "Vague." },
    }),
    q({
      id: "va-q81-02", atom: "a-va-smart", d: 2,
      prompt: "Why include actions you control, like proposals sent, in your plan?",
      options: ["You can do them every week even when results take time", "Results never matter", "Clients ask for them", "They are easier to fake"],
      correct: "a",
      explanation: "Actions drive results.",
      wrong: { b: "Results matter too.", c: "No.", d: "No." },
    }),
    q({
      id: "va-q81-03", atom: "a-va-plan-tracking", d: 2,
      prompt: "40 proposals produced 1 reply. What does that suggest?",
      options: ["Improve the proposals and profile", "Send the same proposal more", "Give up", "Halve your rate immediately"],
      correct: "a",
      explanation: "The data points to what to fix.",
      wrong: { b: "Repeats the problem.", c: "Too early.", d: "Price is rarely the main issue." },
    }),
    q({
      id: "va-q81-04", atom: "a-va-plan-tracking", d: 1,
      prompt: "How often should you review your plan?",
      options: ["Weekly", "Once a year", "Never", "Only when you win a client"],
      correct: "a",
      explanation: "Weekly reviews allow quick adjustments.",
      wrong: { b: "Too slow.", c: "No.", d: "Too rarely." },
    }),
  ]),

  ...check("va-l82-practical", [
    q({
      id: "va-q82-01", atom: "a-va-m12-assemble", d: 2,
      prompt: "How should you check that portfolio links work for clients?",
      options: ["Open each in a private browser window", "Trust that they work", "Click them while logged in only", "Ask the client to report broken links"],
      correct: "a",
      explanation: "A private window sees what a stranger sees.",
      wrong: { b: "Risky.", c: "You may have access others lack.", d: "Unprofessional." },
    }),
    q({
      id: "va-q82-02", atom: "a-va-m12-practical", d: 2,
      prompt: "Which six types of work should a complete VA portfolio show?",
      options: ["Documents, spreadsheets, email correspondence, research, project boards and social media content", "Only emails", "Only certificates", "Your social media selfies"],
      correct: "a",
      explanation: "The full range of VA services.",
      wrong: { b: "Too narrow.", c: "Evidence of work matters more.", d: "No." },
    }),
    q({
      id: "va-q82-03", atom: "a-va-m12-assemble", d: 2,
      prompt: "How should shared portfolio files be set?",
      options: ["View-only links", "Editor access for anyone", "Private, so no one can open them", "Sent as large email attachments"],
      correct: "a",
      explanation: "Visible but protected.",
      wrong: { b: "Anyone could change them.", c: "Clients cannot see them.", d: "Inconvenient." },
    }),
    q({
      id: "va-q82-04", atom: "a-va-m12-practical", d: 2,
      prompt: "You have no testimonials yet. What should your portfolio say?",
      options: ["References are available on request (and add testimonials as you get them)", "Invent testimonials", "Copy testimonials from another VA", "Leave a blank section with no explanation"],
      correct: "a",
      explanation: "Honest and professional.",
      wrong: { b: "Dishonest.", c: "Dishonest.", d: "Looks unfinished." },
    }),
  ]),
};

export default ASSESSMENTS;
