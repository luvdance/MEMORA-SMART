/**
 * ASSESSMENTS · UI/UX DESIGN · MODULE 16 · PORTFOLIO, FREELANCING AND CAREER PREPARATION
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Never import this from anything under src/.
 * ═════════════════════════════════════════════════════════════════════════
 */

import { q, check } from "./ux-helpers.js";

export const ASSESSMENTS = {
  ...check("ux-l66-industry", [
    q({
      id: "uxq66-1", atom: "a-ux-industry", d: 2,
      prompt: "What do hiring managers look for most in a junior designer?",
      options: ["Evidence of problem solving, a clear process and collaboration", "Mastery of every design tool", "The number of screens designed", "A design degree only"],
      correct: "a",
      explanation: "Judgement and process matter more than any single tool.",
      wrong: { b: "Tools are learnable.", c: "Quantity is not quality.", d: "Evidence of skill matters more." },
    }),
    q({
      id: "uxq66-2", atom: "a-ux-roles", d: 2,
      prompt: "Which role combines UX, UI and product thinking about what to build?",
      options: ["Product designer", "UI designer", "UX researcher", "Content designer"],
      correct: "a",
      explanation: "Product designers work end to end, including strategy and metrics.",
      wrong: { b: "Focuses on visual and interaction design.", c: "Focuses on research.", d: "Focuses on words." },
    }),
    q({
      id: "uxq66-3", atom: "a-ux-building-portfolio", d: 2,
      prompt: "How many case studies should a strong junior portfolio usually have?",
      options: ["Three to five strong ones", "One screen", "Twenty or more", "None; screens are enough"],
      correct: "a",
      explanation: "Quality beats quantity.",
      wrong: { b: "Too little to judge.", c: "Nobody reads twenty.", d: "Screens without stories show little." },
    }),
    q({
      id: "uxq66-4", atom: "a-ux-selecting-projects", d: 3, type: "scenario",
      prompt: "You want a FinTech product designer role. Which project set fits best?",
      options: ["A researched savings app, a payments dashboard and an accessible web redesign", "Three logo designs", "Three Dribbble shots of the same screen", "Three posters"],
      correct: "a",
      explanation: "Relevant domains, both platforms and the full range of skills.",
      wrong: { b: "Branding, not product design.", c: "No process or range.", d: "Not digital products." },
    }),
  ]),

  ...check("ux-l67-case-studies", [
    q({
      id: "uxq67-1", atom: "a-ux-case-study-structure", d: 2,
      prompt: "Why lead a case study with the outcome?",
      options: ["Many readers only read the top", "Outcomes are always impressive", "It is a legal requirement", "It hides the process"],
      correct: "a",
      explanation: "Give busy readers the headline first.",
      wrong: { b: "Not necessarily.", c: "No such rule.", d: "The process still follows." },
    }),
    q({
      id: "uxq67-2", atom: "a-ux-documenting-decisions", d: 3,
      prompt: "Which line best documents a design decision?",
      options: ["\"We chose a daily reminder because 5 of 6 traders said they forget to save\"", "\"I made the home screen\"", "\"The colours are purple\"", "\"It looks modern\""],
      correct: "a",
      explanation: "A decision, a reason and evidence.",
      wrong: { b: "An output, not a decision.", c: "A fact without a reason.", d: "An opinion." },
    }),
    q({
      id: "uxq67-3", atom: "a-ux-showcasing-research", d: 2,
      prompt: "How should research be shown in a case study?",
      options: ["Through key insights with their evidence", "By pasting every interview transcript", "By listing the methods only", "It should be left out"],
      correct: "a",
      explanation: "Findings, not raw materials.",
      wrong: { b: "Nobody will read it, and it risks privacy.", c: "Methods without findings show little.", d: "Research is central to UX." },
    }),
    q({
      id: "uxq67-4", atom: "a-ux-presenting-prototypes", d: 2,
      prompt: "Which is the strongest evidence of a usability improvement?",
      options: ["\"Task completion rose from 60% to 100%; median time fell from 95s to 41s\"", "\"Users loved it\"", "\"It is much better now\"", "\"The client was happy\""],
      correct: "a",
      explanation: "Before-and-after metrics are concrete and credible.",
      wrong: { b: "Vague.", c: "Unsupported.", d: "Nice, but not evidence of usability." },
    }),
  ]),

  ...check("ux-l68-presence", [
    q({
      id: "uxq68-1", atom: "a-ux-behance", d: 2,
      prompt: "What is Behance best suited for?",
      options: ["Long-form project presentations such as case studies", "Single animated shots only", "Hosting code", "Sending invoices"],
      correct: "a",
      explanation: "Each project is a scrolling story.",
      wrong: { b: "That is closer to Dribbble.", c: "Not a code host.", d: "Unrelated." },
    }),
    q({
      id: "uxq68-2", atom: "a-ux-dribbble", d: 2,
      prompt: "What is Dribbble's main weakness for UX designers?",
      options: ["Shots show outputs without the process behind them", "It is not free to browse", "It only accepts code", "It has no community"],
      correct: "a",
      explanation: "Link shots to full case studies.",
      wrong: { b: "Browsing is free.", c: "It accepts visuals.", d: "It is a community." },
    }),
    q({
      id: "uxq68-3", atom: "a-ux-portfolio-website", d: 2,
      prompt: "Why must a designer's portfolio site itself be accessible and responsive?",
      options: ["It is evidence of the designer's skills, and recruiters often open it on a phone", "Search engines require it", "It loads faster", "It is cheaper"],
      correct: "a",
      explanation: "Practise what you preach.",
      wrong: { b: "Not the main reason.", c: "Not necessarily.", d: "Unrelated." },
    }),
    q({
      id: "uxq68-4", atom: "a-ux-remote-opportunities", d: 2,
      prompt: "Where do many design roles come from without ever being advertised?",
      options: ["Relationships built through communities and sharing your work", "Random emails to every company", "Paid job lists", "Nowhere"],
      correct: "a",
      explanation: "People hire people they know or have seen.",
      wrong: { b: "Rarely effective.", c: "Often low value.", d: "Many roles are filled through networks." },
    }),
    q({
      id: "uxq68-5", atom: "a-ux-freelancing-platforms", d: 3, type: "scenario",
      prompt: "A freelancer's copied proposals get no replies. What should change?",
      options: ["Fewer proposals, each tailored to the client's problem with a relevant project", "More copies per day", "Working for free", "Listing more skills"],
      correct: "a",
      explanation: "Clients choose people who understand their problem.",
      wrong: { b: "Still ignored.", c: "Attracts the wrong clients.", d: "Still not about the client." },
    }),
  ]),

  ...check("ux-l69-clients", [
    q({
      id: "uxq69-1", atom: "a-ux-working-clients", d: 2,
      prompt: "A brief says only \"we need a new website\". What should you do first?",
      options: ["Run a discovery conversation about goals, users, problems and success", "Start designing the home page", "Send a price immediately", "Copy a competitor's site"],
      correct: "a",
      explanation: "Understand the problem behind the requested solution.",
      wrong: { b: "Premature.", c: "You cannot price an unclear scope.", d: "Not a plan." },
    }),
    q({
      id: "uxq69-2", atom: "a-ux-client-communication", d: 2,
      prompt: "Why write down decisions after every client meeting?",
      options: ["So nothing is disputed later", "To make the project longer", "Because clients cannot remember anything", "To avoid speaking"],
      correct: "a",
      explanation: "Written records prevent misunderstandings.",
      wrong: { b: "Not the purpose.", c: "Everyone forgets details.", d: "It complements conversation." },
    }),
    q({
      id: "uxq69-3", atom: "a-ux-pricing", d: 3, type: "scenario",
      prompt: "A project is estimated at 40 hours at ₦20,000 per hour, plus 10% contingency. What is the total?",
      options: ["₦880,000", "₦800,000", "₦840,000", "₦1,000,000"],
      correct: "a",
      explanation: "40 × 20,000 = 800,000; × 1.10 = 880,000.",
      wrong: { b: "Forgot the contingency.", c: "Added 5%, not 10%.", d: "Added 25%." },
    }),
    q({
      id: "uxq69-4", atom: "a-ux-proposals", d: 2,
      prompt: "Why should a proposal list what is out of scope?",
      options: ["To prevent disagreements about work that was never included", "To look longer", "To discourage the client", "Because it is required by law"],
      correct: "a",
      explanation: "Clear limits protect both sides.",
      wrong: { b: "Not the purpose.", c: "It clarifies, not discourages.", d: "Not a legal requirement." },
    }),
    q({
      id: "uxq69-5", atom: "a-ux-client-feedback", d: 2,
      prompt: "A client asks you to \"also design the mobile app\" midway through a website project. What is the professional response?",
      options: ["Welcome it as new work with its own price and timeline", "Do it for free to keep them happy", "Refuse to discuss it", "Do it quietly and miss the website deadline"],
      correct: "a",
      explanation: "Scope creep is handled with a change request.",
      wrong: { b: "Sets a costly precedent.", c: "Loses an opportunity.", d: "Damages the original project." },
    }),
  ]),

  ...check("ux-l70-career", [
    q({
      id: "uxq70-1", atom: "a-ux-job-interviews", d: 2,
      prompt: "What does STAR stand for in behavioural interview answers?",
      options: ["Situation, Task, Action, Result", "Skills, Tools, Achievements, References", "Start, Try, Adjust, Repeat", "Story, Theme, Audience, Response"],
      correct: "a",
      explanation: "A clear structure for describing real experiences.",
      wrong: { b: "Not the acronym.", c: "Not the acronym.", d: "Not the acronym." },
    }),
    q({
      id: "uxq70-2", atom: "a-ux-job-interviews", d: 3,
      prompt: "In a whiteboard design challenge, what do interviewers mainly judge?",
      options: ["How you clarify the problem and reason about solutions", "How beautiful the final drawing is", "How fast you finish", "Which tool you use"],
      correct: "a",
      explanation: "Process and reasoning, not polish.",
      wrong: { b: "Pixels matter little on a whiteboard.", c: "Speed without thinking is not valued.", d: "There is no tool." },
    }),
    q({
      id: "uxq70-3", atom: "a-ux-continuous-learning", d: 2,
      prompt: "Which habit best supports long-term growth as a designer?",
      options: ["Regular feedback, stretch projects, communities and mentoring", "Collecting tool certificates", "Waiting for company training", "Avoiding difficult projects"],
      correct: "a",
      explanation: "Deliberate practice and other people's perspectives drive growth.",
      wrong: { b: "Tools are the least important part.", c: "Growth is your own responsibility.", d: "Comfort stops growth." },
    }),
    q({
      id: "uxq70-4", atom: "a-ux-final-practical", d: 2,
      prompt: "Together, what should your three final case studies cover?",
      options: ["Research, interaction design, visual design and systems, on mobile and web", "Three versions of the same screen", "Only visual design", "Only research"],
      correct: "a",
      explanation: "Range shows you can work end to end.",
      wrong: { b: "No range.", c: "Too narrow.", d: "Too narrow." },
    }),
  ]),
};
