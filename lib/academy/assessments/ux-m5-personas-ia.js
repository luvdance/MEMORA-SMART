/**
 * ASSESSMENTS · UI/UX DESIGN · MODULE 5 · PERSONAS, JOURNEYS AND INFORMATION ARCHITECTURE
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Never import this from anything under src/.
 * ═════════════════════════════════════════════════════════════════════════
 */

import { q, check } from "./ux-helpers.js";

export const ASSESSMENTS = {
  ...check("ux-l19-personas", [
    q({
      id: "uxq19-1", atom: "a-ux-personas", d: 2,
      prompt: "What makes a persona evidence-based?",
      options: ["Its goals, behaviours and frustrations trace back to real research participants", "It has a realistic photo", "It was agreed in a team meeting", "It includes the user's hobbies"],
      correct: "a",
      explanation: "Evidence, not invention, is what makes a persona trustworthy.",
      wrong: { b: "A photo adds realism, not evidence.", c: "Agreement is not evidence.", d: "Hobbies are usually irrelevant." },
    }),
    q({
      id: "uxq19-2", atom: "a-ux-persona-parts", d: 2,
      prompt: "Which persona detail is most useful for design?",
      options: ["\"Studies on her phone on the bus, 20 to 30 minutes at a time\"", "\"Her favourite colour is blue\"", "\"She supports Arsenal\"", "\"She has two brothers\""],
      correct: "a",
      explanation: "A behaviour with context drives design decisions such as lesson length.",
      wrong: { b: "Trivia; no design decision follows.", c: "Irrelevant to the product.", d: "Irrelevant unless research shows it matters." },
    }),
    q({
      id: "uxq19-3", atom: "a-ux-scenarios-stories", d: 2,
      prompt: "Why is the \"so that\" part of a user story important?",
      options: ["It explains why the user wants it, so the team can find the best way to deliver it", "It makes the story longer", "Developers ignore the rest", "It names the developer"],
      correct: "a",
      explanation: "Knowing the benefit lets the team judge solutions.",
      wrong: { b: "Length is not the point.", c: "The whole story matters.", d: "It describes the user's benefit." },
    }),
    q({
      id: "uxq19-4", atom: "a-ux-jtbd", d: 3,
      prompt: "Which is a correctly formed job statement?",
      options: ["When I have a spare half hour, I want to make progress on a skill, so I can change careers", "As a learner, I want short lessons", "Chiamaka is 27 and lives in Lekki", "The app shall have a progress bar"],
      correct: "a",
      explanation: "When [situation], I want to [motivation], so I can [outcome].",
      wrong: { b: "That is a user story fragment.", c: "That is a persona profile.", d: "That is a feature requirement." },
    }),
  ]),

  ...check("ux-l20-journeys", [
    q({
      id: "uxq20-1", atom: "a-ux-journey-mapping", d: 2,
      prompt: "What does a journey map show along its timeline?",
      options: ["Stages, with the person's actions, thoughts, emotions, pain points and opportunities", "Only the screens of the app", "The company's organisation chart", "The code architecture"],
      correct: "a",
      explanation: "It maps one persona's experience of one goal, stage by stage.",
      wrong: { b: "Screens are a small part of a journey.", c: "That is internal structure.", d: "Unrelated." },
    }),
    q({
      id: "uxq20-2", atom: "a-ux-customer-vs-user", d: 2,
      prompt: "How does a customer journey differ from a user journey?",
      options: ["It covers the whole relationship across every channel, not just one task in one product", "It is always shorter", "It ignores emotions", "It only covers payment"],
      correct: "a",
      explanation: "User journeys are narrower: one person, one product, one task.",
      wrong: { b: "Usually longer.", c: "Both include emotions.", d: "It covers far more than payment." },
    }),
    q({
      id: "uxq20-3", atom: "a-ux-friction-points", d: 2,
      prompt: "On a journey map, where are the best design opportunities usually found?",
      options: ["At the deepest dips in emotion", "At the highest points", "At the first stage only", "Where nothing happens"],
      correct: "a",
      explanation: "The lowest points show the most painful friction.",
      wrong: { b: "Peaks are already working well.", c: "Friction can be anywhere.", d: "No activity, no opportunity to act." },
    }),
    q({
      id: "uxq20-4", atom: "a-ux-friction-points", d: 3, type: "scenario",
      prompt: "A person pays online and then waits several minutes with no confirmation. What kind of friction is this?",
      options: ["Uncertainty at a transition, which an instant receipt would fix", "Too many form fields", "Poor colour choice", "No friction"],
      correct: "a",
      explanation: "\"Did it work?\" moments are classic friction.",
      wrong: { b: "The form is already done.", c: "Colour is not the issue.", d: "Uncertainty with money is serious friction." },
    }),
  ]),

  ...check("ux-l21-ia", [
    q({
      id: "uxq21-1", atom: "a-ux-ia", d: 2,
      prompt: "A bank website's menu uses its internal department names. What is this called?",
      options: ["Inside-out information architecture", "Good IA", "A breadcrumb trail", "A card sort"],
      correct: "a",
      explanation: "It mirrors the organisation, not the users' mental model.",
      wrong: { b: "Customers do not think in departments.", c: "Breadcrumbs show location.", d: "A card sort is a research method." },
    }),
    q({
      id: "uxq21-2", atom: "a-ux-organising-information", d: 2,
      prompt: "Which organisation scheme suits a list of bank transactions?",
      options: ["Chronological", "Alphabetical", "By audience", "By topic"],
      correct: "a",
      explanation: "Time is what matters for transactions.",
      wrong: { b: "People rarely look up transactions by name.", c: "There is one audience: the account holder.", d: "Topics do not fit transaction history." },
    }),
    q({
      id: "uxq21-3", atom: "a-ux-site-maps", d: 3,
      prompt: "Why are broad, shallow site maps usually better than narrow, deep ones?",
      options: ["People find things faster choosing among a few clear options per level than clicking through many levels", "Deep structures look more professional", "Shallow maps have fewer pages", "Browsers limit depth"],
      correct: "a",
      explanation: "Each extra level is another decision where people can go wrong.",
      wrong: { b: "Depth slows people down.", c: "The number of pages can be the same.", d: "There is no such limit." },
    }),
    q({
      id: "uxq21-4", atom: "a-ux-navigation-structures", d: 2,
      prompt: "What do breadcrumbs show?",
      options: ["Where you are in the hierarchy, such as Home › Courses › Design", "Your recent purchases", "The site's cookies", "The main navigation on mobile"],
      correct: "a",
      explanation: "They show location and let you step back up.",
      wrong: { b: "That is history.", c: "Unrelated to cookies.", d: "Mobile global navigation is usually a tab bar." },
    }),
  ]),

  ...check("ux-l22-sorting-testing", [
    q({
      id: "uxq22-1", atom: "a-ux-card-sorting", d: 2,
      prompt: "What does an open card sort reveal that a closed one does not?",
      options: ["The groups and labels users would create themselves", "Whether your categories work", "How fast the site loads", "The visual design users prefer"],
      correct: "a",
      explanation: "Open sorts show users' own mental models and vocabulary.",
      wrong: { b: "That is what a closed sort tests.", c: "Unrelated.", d: "Card sorts have no visual design." },
    }),
    q({
      id: "uxq22-2", atom: "a-ux-tree-testing", d: 3, type: "scenario",
      prompt: "In a tree test, 3 of 8 participants found the right page. What is the success rate?",
      options: ["37.5%", "3%", "62.5%", "80%"],
      correct: "a",
      explanation: "3 ÷ 8 × 100 = 37.5%.",
      wrong: { b: "That is the count, not a percentage.", c: "That is the failure rate.", d: "Not supported by the numbers." },
    }),
    q({
      id: "uxq22-3", atom: "a-ux-tree-testing", d: 2,
      prompt: "Why are the wrong first clicks in a tree test so useful?",
      options: ["They show where people expected to find the content", "They show who is careless", "They measure loading speed", "They are not useful"],
      correct: "a",
      explanation: "Wrong answers reveal users' expectations, which guide the fix.",
      wrong: { b: "Failures are the structure's fault, not the users'.", c: "Tree tests have no loading.", d: "They are often the most useful data." },
    }),
    q({
      id: "uxq22-4", atom: "a-ux-intuitive-navigation", d: 2,
      prompt: "Which three questions should intuitive navigation answer at every moment?",
      options: ["Where am I, where can I go, and how do I get back?", "Who made this, when, and why?", "How much, how long, and how far?", "What is new, what is popular, and what is free?"],
      correct: "a",
      explanation: "Location, options and return are the core of wayfinding.",
      wrong: { b: "Not navigation questions.", c: "Not about navigation.", d: "Content questions, not wayfinding." },
    }),
  ]),
};
