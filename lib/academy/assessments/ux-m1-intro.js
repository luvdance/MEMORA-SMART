/**
 * ASSESSMENTS · UI/UX DESIGN · MODULE 1 · INTRODUCTION TO UI/UX DESIGN
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Never import this from anything under src/.
 * ═════════════════════════════════════════════════════════════════════════
 */

import { q, check } from "./ux-helpers.js";

export const ASSESSMENTS = {
  ...check("ux-l1-welcome", [
    q({
      id: "uxq1-1", atom: "a-ux-welcome", d: 1,
      prompt: "What does this course treat as the core of a designer's job?",
      options: ["Making decisions about products, backed by evidence from real users", "Learning every feature of one design tool", "Making screens look as decorative as possible", "Writing the code for every screen"],
      correct: "a",
      explanation: "Tools change; deciding well with evidence is what people hire designers for.",
      wrong: { b: "Figma is taught, but tools change every few years.", c: "Looks matter, but design is mainly about making things work.", d: "Developers write the code; designers specify what to build." },
    }),
    q({
      id: "uxq1-2", atom: "a-ux-welcome-phases", d: 1,
      prompt: "Why does the course teach user research before Figma?",
      options: ["Because real projects understand users before designing screens for them", "Because Figma is too hard for beginners", "Because research is optional and comes first to get it out of the way", "Because Figma is only used at the very end"],
      correct: "a",
      explanation: "The course follows the order real design work happens in.",
      wrong: { b: "Figma is approachable; the order is about how design works.", c: "Research is central, not optional.", d: "Figma is used from Module 7 through every later project." },
    }),
    q({
      id: "uxq1-3", atom: "a-ux-welcome-roadmap", d: 1,
      prompt: "What do the module practicals add up to by the end of the course?",
      options: ["The material for your portfolio case studies", "Nothing; they are optional extras", "A single exam paper", "A coding project"],
      correct: "a",
      explanation: "Each practical builds something you can show, and Module 16 turns them into case studies.",
      wrong: { b: "They are required and build your portfolio.", c: "The exam is separate from the practicals.", d: "The practicals are design work, mostly in Figma." },
    }),
    q({
      id: "uxq1-4", atom: "a-ux-welcome-lab", d: 2,
      prompt: "What is a design token such as --brand?",
      options: ["A named value that an interface is built from, so changing it changes every place it is used", "A password for the design tool", "A picture of the brand's logo", "A comment explaining the design"],
      correct: "a",
      explanation: "Tokens name design decisions, such as a colour or a size, and every component uses them.",
      wrong: { b: "It has nothing to do with security.", c: "A logo is an image; a token is a value such as a colour.", d: "Comments explain; tokens are the values themselves." },
    }),
  ]),

  ...check("ux-l2-ui-ux", [
    q({
      id: "uxq2-1", atom: "a-ux-what-is-ui", d: 1,
      prompt: "Which of these is a user interface (UI) decision?",
      options: ["Making the Send button the only filled green button on the screen", "Interviewing traders about how they save", "Deciding the app needs a saved-beneficiaries feature", "Measuring how many users finish a transfer"],
      correct: "a",
      explanation: "How a button looks and stands out is a visual, interface decision.",
      wrong: { b: "That is UX research.", c: "Deciding which features exist is UX.", d: "Measuring task success is UX evaluation." },
    }),
    q({
      id: "uxq2-2", atom: "a-ux-what-is-ux", d: 2,
      prompt: "Which of these is part of user experience (UX) design but not on any screen?",
      options: ["The confirmation SMS sent after a payment", "The colour of the Pay button", "The font of the headings", "The size of the app icon"],
      correct: "a",
      explanation: "UX covers the whole experience of achieving a goal, including what happens off-screen.",
      wrong: { b: "That is a UI decision on a screen.", c: "Typography is UI.", d: "The icon is part of the visual interface." },
    }),
    q({
      id: "uxq2-3", atom: "a-ux-ui-vs-ux", d: 2, type: "scenario",
      prompt: "An app looks beautiful, but most users cannot work out how to finish booking. What does it have?",
      options: ["Good UI and bad UX", "Good UX and bad UI", "Good UI and good UX", "Bad UI and bad UX"],
      correct: "a",
      explanation: "The interface looks good, but the experience of achieving the goal fails.",
      wrong: { b: "The opposite: the flow is the problem, not the looks.", c: "Users cannot finish their task, so UX is not good.", d: "The interface is described as beautiful and clear to look at." },
    }),
    q({
      id: "uxq2-4", atom: "a-ux-ui-ux-lab", d: 2,
      prompt: "Why is a placeholder (grey text inside a field) not a substitute for a label?",
      options: ["It disappears as soon as the person starts typing, so they lose the instruction", "Placeholders cannot contain text", "Labels are only for decoration", "Placeholders make the form submit twice"],
      correct: "a",
      explanation: "A visible label stays while typing and is read by screen readers.",
      wrong: { b: "Placeholders do contain text; the problem is that it vanishes.", c: "Labels tell people what to enter.", d: "Placeholders do not affect submission." },
    }),
  ]),

  ...check("ux-l3-teams-products", [
    q({
      id: "uxq3-1", atom: "a-ux-design-engineering", d: 2,
      prompt: "Why is design called the cheapest place to find mistakes?",
      options: ["Changing a design or prototype takes minutes; changing released software can take weeks", "Designers are paid less than developers", "Design tools are free", "Mistakes found in design do not matter"],
      correct: "a",
      explanation: "Testing ideas before code avoids expensive engineering rework.",
      wrong: { b: "It is about the cost of change, not salaries.", c: "Tool cost is not the point.", d: "They matter a great deal; finding them early is the benefit." },
    }),
    q({
      id: "uxq3-2", atom: "a-ux-designer-role", d: 2,
      prompt: "In a product team, who usually decides WHAT to build and WHY?",
      options: ["The product manager", "The backend developer", "The tester", "The designer alone"],
      correct: "a",
      explanation: "The product manager owns priorities; the designer shapes how it works for users.",
      wrong: { b: "Backend developers build the server side.", c: "Testers check the product works.", d: "Designers contribute strongly, but the product manager owns the decision." },
    }),
    q({
      id: "uxq3-3", atom: "a-ux-designer-role", d: 3, type: "scenario",
      prompt: "A designer hands over a Figma file and stops answering questions. What part of the role is missing?",
      options: ["Supporting developers during the build and reviewing what was built against the design", "Choosing the colours", "Drawing the screens", "Writing the backend code"],
      correct: "a",
      explanation: "Designers answer questions, specify states and review the built product.",
      wrong: { b: "Colours were part of the file already handed over.", c: "The screens were drawn.", d: "That is not the designer's job." },
    }),
    q({
      id: "uxq3-4", atom: "a-ux-digital-products", d: 2,
      prompt: "Which is a business goal rather than a user goal for an online store?",
      options: ["Reduce the number of returned orders", "Find the right shoes quickly", "Know the delivery date before paying", "Pay without creating an account"],
      correct: "a",
      explanation: "Fewer returns saves the business money; the others are what shoppers want.",
      wrong: { b: "That is what the shopper wants.", c: "That is a shopper's need.", d: "That is a shopper's preference." },
    }),
    q({
      id: "uxq3-5", atom: "a-ux-brief-lab", d: 2,
      prompt: "Why must a product brief's success measure include a number?",
      options: ["Without a number nobody can tell whether the product actually succeeded", "Numbers make the brief look professional", "Developers need numbers to write code", "Briefs are rejected without numbers"],
      correct: "a",
      explanation: "\"Help people save\" cannot be checked; \"2,000 active savers in three months\" can.",
      wrong: { b: "The purpose is measurement, not appearance.", c: "It is about judging success, not coding.", d: "There is no such rule; the reason is practical." },
    }),
  ]),

  ...check("ux-l4-interfaces-users", [
    q({
      id: "uxq4-1", atom: "a-ux-interface-types", d: 2,
      prompt: "Which interface type is most shaped by thumbs, small screens and unreliable networks?",
      options: ["Mobile applications", "Desktop applications", "Enterprise dashboards on office monitors", "Printed brochures"],
      correct: "a",
      explanation: "Mobile apps are used on the move, one-handed, often on poor connections.",
      wrong: { b: "Desktop apps use a mouse and keyboard on a large screen.", c: "Dashboards are usually used at a desk.", d: "Not a digital interface." },
    }),
    q({
      id: "uxq4-2", atom: "a-ux-interface-types", d: 2,
      prompt: "What most distinguishes a web application from an ordinary website?",
      options: ["You log in and carry out tasks, as with software, rather than mainly reading", "It is always slower", "It cannot run in a browser", "It has no forms"],
      correct: "a",
      explanation: "Online banking and email are web applications: task-based, with accounts and changing data.",
      wrong: { b: "Speed is not the difference.", c: "Web applications run in browsers.", d: "They usually have many forms." },
    }),
    q({
      id: "uxq4-3", atom: "a-ux-user-expectations", d: 2,
      prompt: "Why put the cart at the top right of a shop's header?",
      options: ["Because almost every other shop has taught people to look for it there", "Because the right side is more beautiful", "Because it is required by law", "Because it hides the cart from people who do not need it"],
      correct: "a",
      explanation: "Matching expectations makes an interface feel easy without anyone noticing.",
      wrong: { b: "It is about expectation, not beauty.", c: "There is no such law.", d: "The aim is to make it easy to find." },
    }),
    q({
      id: "uxq4-4", atom: "a-ux-misconceptions", d: 2,
      prompt: "Which statement is a misconception about UI/UX design?",
      options: ["Adding more features always makes a product better", "Users scan rather than read every word", "Products are redesigned continuously after release", "Designers need evidence from real users"],
      correct: "a",
      explanation: "Every feature adds complexity; often the best design removes things.",
      wrong: { b: "That is true and well documented.", c: "True: design is a cycle.", d: "True: evidence is central." },
    }),
  ]),

  ...check("ux-l5-good-bad-process", [
    q({
      id: "uxq5-1", atom: "a-ux-good-bad", d: 2,
      prompt: "A transfer fails. Which message is the best design?",
      options: ["\"The bank did not respond. No money left your account. Try again.\"", "\"Error 91\"", "\"Something happened.\"", "\"Transaction unsuccessful (code: TX_FAIL)\""],
      correct: "a",
      explanation: "It says what happened, reassures about the money, and gives a next step.",
      wrong: { b: "A code means nothing to the person and offers no next step.", c: "Vague and frightening when money is involved.", d: "Technical and unhelpful." },
    }),
    q({
      id: "uxq5-2", atom: "a-ux-good-bad", d: 2,
      prompt: "Which is a sign of good interface design?",
      options: ["Information is shown before you need to decide, such as delivery cost before checkout", "Important actions are hidden in menus to keep screens clean", "Pale grey text for a calm look", "Deleting happens instantly with no way to undo"],
      correct: "a",
      explanation: "People decide confidently when they have the facts in time.",
      wrong: { b: "Hiding important actions makes people hunt.", c: "Pale text is hard to read, especially outdoors.", d: "Mistakes should be easy to undo." },
    }),
    q({
      id: "uxq5-3", atom: "a-ux-design-process", d: 2,
      prompt: "In the design process, what usually happens after testing shows a problem?",
      options: ["You loop back to define or design, then test again", "You release anyway and move on", "You start a completely different product", "You stop testing"],
      correct: "a",
      explanation: "The process is a loop, not a straight line.",
      wrong: { b: "Releasing a known problem wastes the test.", c: "Usually only part of the design needs changing.", d: "Testing continues after every change." },
    }),
    q({
      id: "uxq5-4", atom: "a-ux-review-lab", d: 2,
      prompt: "Which review note is most useful to a design team?",
      options: ["\"Price text is grey on white and hard to read outdoors\"", "\"The colours are bad\"", "\"I don't like it\"", "\"Make it pop more\""],
      correct: "a",
      explanation: "It names the element, the problem and the situation, so it can be fixed.",
      wrong: { b: "Too vague to act on.", c: "An opinion with no detail.", d: "Not specific enough to change anything." },
    }),
  ]),
};
