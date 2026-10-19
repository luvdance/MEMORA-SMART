/**
 * ASSESSMENTS · RESPONSIVE WEB DEVELOPMENT · MODULE 32 · PORTFOLIO AND PROFESSIONAL WORKFLOW
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Never import this from anything under src/.
 * ═════════════════════════════════════════════════════════════════════════
 */

import { q, check } from "./wd-helpers.js";

export const ASSESSMENTS = {
  ...check("wd-l149-planning-projects", [
    q({ id: "wdq149-1", atom: "a-wd-choosing-projects", d: 2, prompt: "Which portfolio is strongest?", options: ["Four finished, live projects that solve believable problems and show range", "Fifteen unchanged tutorial projects", "One unfinished large project", "A list of certificates"], correct: "a",
      explanation: "Quality, range and finish beat quantity.",
      wrong: { b: "Reviewers recognise tutorials.", c: "Unfinished work shows little.", d: "Reviewers want to see work." } }),
    q({ id: "wdq149-2", atom: "a-wd-project-requirements", d: 3, prompt: "Which is a well-written requirement?", options: ["A customer can place an order from a 375px phone, and every form error is shown next to its field", "The site should be nice", "Use lots of JavaScript", "Make it modern"], correct: "a",
      explanation: "Specific and testable from the user's point of view.",
      wrong: { b: "Cannot be tested.", c: "A means, not a requirement.", d: "Cannot be tested." } }),
    q({ id: "wdq149-3", atom: "a-wd-planning-layouts", d: 2, prompt: "Why plan the content order at phone width first?", options: ["It is the narrowest layout and also the reading order for screen readers", "Phones are easier to draw", "Laptops do not matter", "CSS requires it"], correct: "a",
      explanation: "Mobile-first planning, then rearrange with more room.",
      wrong: { b: "Not the reason.", c: "They do; they come second.", d: "It is a planning choice." } }),
    q({ id: "wdq149-4", atom: "a-wd-milestones", d: 2, prompt: "What should every milestone end with?", options: ["Something that works and can be shown", "A new design", "A meeting", "A larger estimate"], correct: "a",
      explanation: "Working increments show progress and reveal delays early.",
      wrong: { b: "Not necessarily.", c: "Meetings are not results.", d: "No." } }),
  ]),

  ...check("wd-l150-components-testing", [
    q({ id: "wdq150-1", atom: "a-wd-portfolio-components", d: 2, prompt: "What makes projectCard(project) a good reusable component?", options: ["It takes everything it needs as a parameter and returns one element, used for every project", "It reads global variables", "It is copied into each page", "It builds every page of the site"], correct: "a",
      explanation: "One job, data in, element out.",
      wrong: { b: "Hidden dependencies make reuse hard.", c: "Copies drift apart.", d: "Too many jobs." } }),
    q({ id: "wdq150-2", atom: "a-wd-portfolio-components", d: 2, prompt: "Why keep projects as an array of data?", options: ["Adding a project needs only a data change, not new HTML", "Arrays load faster than HTML", "Browsers require it", "It hides projects from search"], correct: "a",
      explanation: "Content and code stay separate.",
      wrong: { b: "Not the reason.", c: "No.", d: "No." } }),
    q({ id: "wdq150-3", atom: "a-wd-test-requirements", d: 3, type: "scenario", prompt: "A client says a feature was \"agreed\" but it is not in the requirements. What protects both of you?", options: ["The written requirements list, checked at sign-off", "Your memory of the call", "The CSS file", "Lighthouse scores"], correct: "a",
      explanation: "Written, testable requirements settle what was agreed; new items become a change request.",
      wrong: { b: "Memories differ.", c: "Unrelated.", d: "Unrelated." } }),
    q({ id: "wdq150-4", atom: "a-wd-test-requirements", d: 2, prompt: "How do you check a requirement that cannot be automated, such as \"ordering takes under a minute on a real phone\"?", options: ["A written manual check, recorded as passed or failed with evidence", "Skip it", "Assume it passes", "Ask a friend if it looks fine"], correct: "a",
      explanation: "Manual checks are part of the list too.",
      wrong: { b: "It is still a requirement.", c: "Unverified.", d: "Not a check against the requirement." } }),
  ]),

  ...check("wd-l151-docs-demos", [
    q({ id: "wdq151-1", atom: "a-wd-readmes", d: 2, prompt: "What should be near the top of a portfolio README?", options: ["What the project is, the problem it solves and a live demo link", "The licence text", "Every commit message", "The node_modules list"], correct: "a",
      explanation: "Reviewers decide in seconds.",
      wrong: { b: "Usually at the end or in its own file.", c: "Git has them.", d: "Never." } }),
    q({ id: "wdq151-2", atom: "a-wd-live-demos", d: 3, type: "scenario", prompt: "Your live demo needs an account to see anything. What should you do?", options: ["Provide sample data or a demo login so reviewers never face an empty screen", "Ask reviewers to sign up", "Remove the live link", "Share your own password in the README"], correct: "a",
      explanation: "Remove every obstacle to seeing the work.",
      wrong: { b: "Most will not.", c: "The live demo is essential.", d: "Never share real credentials." } }),
    q({ id: "wdq151-3", atom: "a-wd-decision-records", d: 2, prompt: "What does an architecture decision record explain?", options: ["Why a significant technical decision was made, and its consequences", "How to install Node", "The colour palette", "The project's to-do list"], correct: "a",
      explanation: "Context, decision, consequences.",
      wrong: { b: "That is a README's job.", c: "A design document.", d: "That is the issue tracker." } }),
    q({ id: "wdq151-4", atom: "a-wd-decision-records", d: 3, prompt: "A later decision replaces an earlier one. What happens to the old record?", options: ["Its status becomes Superseded, with a link to the new record", "It is deleted", "It is edited to say the new thing", "Nothing changes"], correct: "a",
      explanation: "The history of reasoning is kept.",
      wrong: { b: "The history is the point.", c: "Rewriting loses the history.", d: "It would mislead readers." } }),
  ]),

  ...check("wd-l152-clients-freelancing", [
    q({ id: "wdq152-1", atom: "a-wd-presenting", d: 2, prompt: "What should you show first when presenting a project to a client?", options: ["The live site solving their problem", "The code editor", "The Git history", "The package.json"], correct: "a",
      explanation: "Clients care about outcomes.",
      wrong: { b: "Detail for later, if at all.", c: "Not meaningful to them.", d: "Not meaningful to them." } }),
    q({ id: "wdq152-2", atom: "a-wd-freelancing-workflow", d: 2, prompt: "What usually comes right after a client accepts the proposal?", options: ["A signed agreement and a deposit", "Final payment", "Handover", "Deployment"], correct: "a",
      explanation: "Agree in writing and take a deposit before starting.",
      wrong: { b: "At the end.", c: "At the end.", d: "Near the end." } }),
    q({ id: "wdq152-3", atom: "a-wd-estimation-handover", d: 3, prompt: "Tasks add up to 40 hours. With 20% contingency at ₦10,000 an hour, what is the quote?", options: ["₦480,000", "₦400,000", "₦420,000", "₦800,000"], correct: "a",
      explanation: "40 + 8 = 48 hours × ₦10,000.",
      wrong: { b: "Leaves out the contingency.", c: "Uses 5% contingency.", d: "Doubles the hours." } }),
    q({ id: "wdq152-4", atom: "a-wd-estimation-handover", d: 2, prompt: "Who should own the domain, hosting and repository after handover?", options: ["The client", "The developer, forever", "Whoever paid least", "Nobody"], correct: "a",
      explanation: "The client must be able to run the site without you.",
      wrong: { b: "That holds the client hostage.", c: "Not a rule.", d: "Someone must." } }),
  ]),
};
