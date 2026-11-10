/**
 * ASSESSMENTS · UI/UX DESIGN · MODULE 6 · USER FLOWS AND INTERACTION DESIGN
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Never import this from anything under src/.
 * ═════════════════════════════════════════════════════════════════════════
 */

import { q, check } from "./ux-helpers.js";

export const ASSESSMENTS = {
  ...check("ux-l23-flows", [
    q({
      id: "uxq23-1", atom: "a-ux-interaction-design", d: 2,
      prompt: "What does interaction design focus on?",
      options: ["What people can do, how the product responds, and how each step leads to the next", "Choosing the brand's colours", "Writing the backend code", "Printing marketing materials"],
      correct: "a",
      explanation: "IxD designs the conversation between person and product.",
      wrong: { b: "That is visual design.", c: "That is engineering.", d: "Not digital interaction." },
    }),
    q({
      id: "uxq23-2", atom: "a-ux-user-task-flows", d: 2,
      prompt: "How does a user flow differ from a task flow?",
      options: ["A user flow includes decisions, errors and alternative paths; a task flow is one straight path", "A task flow is longer", "A user flow has no screens", "They are identical"],
      correct: "a",
      explanation: "Task flows show the happy path; user flows add the branches.",
      wrong: { b: "Usually shorter.", c: "User flows reference screens.", d: "They differ in branching." },
    }),
    q({
      id: "uxq23-3", atom: "a-ux-flow-diagrams", d: 2,
      prompt: "In a flowchart, which shape represents a decision?",
      options: ["A diamond", "An oval", "A rectangle", "A circle with an arrow"],
      correct: "a",
      explanation: "Diamonds hold questions with labelled branches.",
      wrong: { b: "Ovals mark start and end.", c: "Rectangles are steps or screens.", d: "Not a standard decision symbol." },
    }),
    q({
      id: "uxq23-4", atom: "a-ux-flow-diagrams", d: 3, type: "scenario",
      prompt: "A flow's decision \"Is the code correct?\" has a Yes arrow but no No arrow. What is wrong?",
      options: ["The flow does not say what happens after a wrong code, so that state will not be designed", "Nothing; No is implied", "Decisions should only have No arrows", "It needs a third Maybe arrow"],
      correct: "a",
      explanation: "Every answer needs an exit, or the unhappy path is missed.",
      wrong: { b: "Implied paths are where missing screens come from.", c: "Both answers need a path.", d: "Yes/No covers this question." },
    }),
  ]),

  ...check("ux-l24-patterns-forms", [
    q({
      id: "uxq24-1", atom: "a-ux-navigation-patterns", d: 2,
      prompt: "Which navigation pattern suits the four main areas of a mobile banking app?",
      options: ["A bottom tab bar", "Breadcrumbs", "A footer sitemap", "A stepper"],
      correct: "a",
      explanation: "Three to five always-visible top-level destinations.",
      wrong: { b: "For deep hierarchies on websites.", c: "Website footers, not app navigation.", d: "For sequential tasks." },
    }),
    q({
      id: "uxq24-2", atom: "a-ux-interaction-patterns", d: 2,
      prompt: "Why prefer an established interaction pattern over inventing a new one?",
      options: ["People already know how to use it", "New patterns are illegal", "Established patterns load faster", "It is cheaper to buy"],
      correct: "a",
      explanation: "Familiar patterns need no learning.",
      wrong: { b: "Not illegal, just costly to users.", c: "Performance is unrelated.", d: "Patterns are not bought." },
    }),
    q({
      id: "uxq24-3", atom: "a-ux-buttons-forms", d: 2,
      prompt: "Why use type=\"tel\" for a phone number field?",
      options: ["Phones show the number keypad", "It validates the number automatically", "It makes the field larger", "It hides the number"],
      correct: "a",
      explanation: "The right type gives the right keyboard.",
      wrong: { b: "Validation still needs designing.", c: "Size is set by CSS.", d: "That is type=\"password\"." },
    }),
    q({
      id: "uxq24-4", atom: "a-ux-validation-errors", d: 3,
      prompt: "Which error message is best for a phone field?",
      options: ["\"Enter an 11-digit phone number, like 0803 123 4567\"", "\"Invalid input\"", "\"Error\"", "\"Phone number format incorrect (ERR_TEL_01)\""],
      correct: "a",
      explanation: "It says what to do, with an example.",
      wrong: { b: "Says nothing about how to fix it.", c: "Even less helpful.", d: "Technical and unhelpful." },
    }),
  ]),

  ...check("ux-l25-feedback-states", [
    q({
      id: "uxq25-1", atom: "a-ux-feedback-responses", d: 2,
      prompt: "An action takes about five seconds. What feedback should people see?",
      options: ["A sign of progress, such as a loading indicator", "Nothing, until it finishes", "A sound only", "The previous screen, unchanged"],
      correct: "a",
      explanation: "After about a second people need to know work is happening.",
      wrong: { b: "They will think it failed and tap again.", c: "Sound alone is not enough.", d: "Unchanged screens look broken." },
    }),
    q({
      id: "uxq25-2", atom: "a-ux-states", d: 2,
      prompt: "What should an empty state show?",
      options: ["Why it is empty and the next step to take", "Nothing at all", "An error code", "A loading spinner forever"],
      correct: "a",
      explanation: "\"No courses yet. Browse courses\" turns a blank into a path.",
      wrong: { b: "A blank looks broken.", c: "Empty is not an error.", d: "Misleading." },
    }),
    q({
      id: "uxq25-3", atom: "a-ux-error-prevention", d: 3,
      prompt: "Which is error prevention rather than error recovery?",
      options: ["Showing the account holder's name before confirming a transfer", "\"Message deleted. Undo\"", "\"Payment failed. You have not been charged\"", "Keeping form data after an error"],
      correct: "a",
      explanation: "It stops the mistake before it happens.",
      wrong: { b: "Recovery after an action.", c: "Recovery after a failure.", d: "Supports recovery." },
    }),
    q({
      id: "uxq25-4", atom: "a-ux-affordances", d: 2,
      prompt: "What is a signifier?",
      options: ["A visible clue that shows what an element can do, such as a button's filled shape", "A hidden feature", "The product's logo", "A user's signature"],
      correct: "a",
      explanation: "Signifiers communicate affordances.",
      wrong: { b: "Hidden features lack signifiers.", c: "A logo is branding.", d: "Unrelated." },
    }),
    q({
      id: "uxq25-5", atom: "a-ux-microinteractions", d: 3,
      prompt: "Why should animations respect the reduced-motion setting?",
      options: ["Motion can make some people dizzy or ill", "Animations break on phones", "It saves battery only", "Browsers block animation otherwise"],
      correct: "a",
      explanation: "Vestibular disorders make motion uncomfortable.",
      wrong: { b: "They work on phones.", c: "Battery is not the main reason.", d: "Browsers do not block it." },
    }),
  ]),

  ...check("ux-l26-laws", [
    q({
      id: "uxq26-1", atom: "a-ux-jakobs-law", d: 2,
      prompt: "What does Jakob's Law say?",
      options: ["Users prefer your product to work like the products they already know", "Decisions take longer with more options", "Bigger targets are easier to hit", "People remember about seven items"],
      correct: "a",
      explanation: "People spend most of their time on other products.",
      wrong: { b: "Hick's Law.", c: "Fitts's Law.", d: "Miller's Law." },
    }),
    q({
      id: "uxq26-2", atom: "a-ux-fitts-law", d: 3, type: "scenario",
      prompt: "On a phone, where should the main action of a payment screen usually go, according to Fitts's Law?",
      options: ["Large, at the bottom, where the thumb rests", "Small, at the top left", "Hidden in a menu", "Next to the Delete button"],
      correct: "a",
      explanation: "Close and big targets are fastest to hit.",
      wrong: { b: "Far from the thumb and small.", c: "Hidden targets are slowest.", d: "Invites accidental destructive taps." },
    }),
    q({
      id: "uxq26-3", atom: "a-ux-hicks-law", d: 2,
      prompt: "Which change applies Hick's Law?",
      options: ["Grouping 18 plans into Daily, Weekly and Monthly tabs with a recommended plan", "Making buttons bigger", "Chunking a phone number", "Matching a familiar layout"],
      correct: "a",
      explanation: "It reduces and organises choices.",
      wrong: { b: "Fitts's Law.", c: "Miller's Law.", d: "Jakob's Law." },
    }),
    q({
      id: "uxq26-4", atom: "a-ux-millers-law", d: 2,
      prompt: "What is the practical lesson of Miller's Law?",
      options: ["Do not make people remember things; chunk information and prefer recognition", "Never show more than seven items anywhere", "Use seven colours", "Menus must have exactly seven items"],
      correct: "a",
      explanation: "Working memory is limited; design around it.",
      wrong: { b: "A common misreading of the law.", c: "Unrelated.", d: "Another misreading." },
    }),
    q({
      id: "uxq26-5", atom: "a-ux-gestalt", d: 2,
      prompt: "A card groups a product's photo, name and price. Which Gestalt principle is at work?",
      options: ["Common region", "Closure", "Continuity", "Figure and ground"],
      correct: "a",
      explanation: "Things inside one boundary are seen as a group.",
      wrong: { b: "Completing incomplete shapes.", c: "Following lines.", d: "Separating object from background." },
    }),
  ]),

  ...check("ux-l27-flow-practical", [
    q({
      id: "uxq27-1", atom: "a-ux-unhappy-paths", d: 2,
      prompt: "What is an unhappy path?",
      options: ["A route through the flow where something goes wrong, such as a declined card", "A flow users dislike", "The longest path", "A path with no screens"],
      correct: "a",
      explanation: "Errors, edge cases and interruptions.",
      wrong: { b: "It is about failures, not feelings.", c: "Length is not the point.", d: "Unhappy paths need screens." },
    }),
    q({
      id: "uxq27-2", atom: "a-ux-unhappy-paths", d: 3, type: "scenario",
      prompt: "A payment fails. What must the failure screen always make clear?",
      options: ["Whether the person was charged, and what they can do next", "The bank's error code", "That it was the user's fault", "Nothing; return to the home screen"],
      correct: "a",
      explanation: "Money must feel safe, and there must be a way forward.",
      wrong: { b: "Codes mean nothing to people.", c: "Blaming users destroys trust.", d: "Silence causes double payments." },
    }),
    q({
      id: "uxq27-3", atom: "a-ux-flow-practical-lab", d: 2,
      prompt: "After writing a complete user flow, what does the list of its screen steps give you?",
      options: ["The list of screens and states to design", "The project's budget", "The code", "The marketing plan"],
      correct: "a",
      explanation: "Every [Screen] is something to design.",
      wrong: { b: "Unrelated.", c: "Developers write code later.", d: "Unrelated." },
    }),
    q({
      id: "uxq27-4", atom: "a-ux-flow-practical-lab", d: 2,
      prompt: "Where in a flow should you add a decision?",
      options: ["Wherever the product checks something and the answer changes what happens next", "Only at the start", "Only at the end", "Nowhere; flows should be straight"],
      correct: "a",
      explanation: "Each check has at least two outcomes to design.",
      wrong: { b: "Checks happen throughout.", c: "Checks happen throughout.", d: "Straight flows miss the unhappy paths." },
    }),
  ]),
};
