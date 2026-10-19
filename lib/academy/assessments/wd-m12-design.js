/**
 * ASSESSMENTS · RESPONSIVE WEB DEVELOPMENT · MODULE 12 · DESIGN IMPLEMENTATION
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Never import this from anything under src/.
 * ═════════════════════════════════════════════════════════════════════════
 */

import { q, check } from "./wd-helpers.js";

export const ASSESSMENTS = {
  ...check("wd-l48-hierarchy", [
    q({
      id: "wdq48-1", atom: "a-wd-layout-hierarchy", d: 2,
      prompt: "How do people usually scan a text-heavy web page?",
      options: ["In an F shape: across the top, then down the left side", "Every word, top to bottom", "From the bottom up", "Right to left"],
      correct: "a",
      explanation: "Eye-tracking studies show F-shaped scanning on text-heavy pages.",
      wrong: { b: "Almost nobody reads every word online.", c: "Not a pattern people follow.", d: "Not for left-to-right languages." },
    }),
    q({
      id: "wdq48-2", atom: "a-wd-visual-hierarchy", d: 3,
      prompt: "What contrast ratio does WCAG require for normal-size body text?",
      options: ["At least 4.5:1", "At least 1.5:1", "At least 10:1", "There is no requirement"],
      correct: "a",
      explanation: "4.5:1 for normal text; 3:1 for large text.",
      wrong: { b: "Far too low to read reliably.", c: "More than required, though good.", d: "WCAG 1.4.3 sets it." },
    }),
    q({
      id: "wdq48-3", atom: "a-wd-whitespace", d: 2,
      prompt: "Why should there be more space above a heading than below it?",
      options: ["So the heading visibly belongs to the text it introduces", "To save space", "Browsers require it", "So the heading looks smaller"],
      correct: "a",
      explanation: "Proximity groups the heading with what follows it.",
      wrong: { b: "It is about grouping, not space.", c: "Browsers do not require it.", d: "Size is unchanged." },
    }),
    q({
      id: "wdq48-4", atom: "a-wd-colour-type-pairing", d: 2,
      prompt: "How many font families should a typical page use?",
      options: ["One or two", "As many as possible", "Exactly five", "A different one for every paragraph"],
      correct: "a",
      explanation: "Often a heading face and a body face.",
      wrong: { b: "Many families look chaotic and load slowly.", c: "Five is far too many.", d: "Destroys consistency." },
    }),
  ]),

  ...check("wd-l49-mockups", [
    q({
      id: "wdq49-1", atom: "a-wd-reading-design", d: 2,
      prompt: "A design shows only a laptop layout with short names. What should you do before building?",
      options: ["Ask how it should behave on phones, with long content, and in error and loading states", "Build only the laptop layout", "Make up the phone layout without asking", "Refuse the work"],
      correct: "a",
      explanation: "Designs usually show the happy path; the developer asks about the rest.",
      wrong: { b: "Most visitors use phones.", c: "Better to ask; but if you must decide, decide deliberately.", d: "Missing states are normal and easy to resolve." },
    }),
    q({
      id: "wdq49-2", atom: "a-wd-mockup-to-code", d: 2,
      prompt: "What should you write first when converting a mockup?",
      options: ["The HTML, based on what the content is", "The animations", "The hover colours", "The dark theme"],
      correct: "a",
      explanation: "Structure first, then tokens, layout, components and states.",
      wrong: { b: "Motion comes last.", c: "States come after components.", d: "Themes come after the base styles." },
    }),
    q({
      id: "wdq49-3", atom: "a-wd-mockup-to-code", d: 3, type: "scenario",
      prompt: "A mockup uses 32px gaps everywhere except one 31px gap. What should you do?",
      options: ["Use 32px: the odd value is almost certainly an accident", "Use exactly 31px", "Ask for a new mockup", "Use 0"],
      correct: "a",
      explanation: "Build to the design system's intent, and confirm with the designer if unsure.",
      wrong: { b: "Copying accidents makes the system inconsistent.", c: "Out of proportion for one pixel.", d: "Changes the design." },
    }),
    q({
      id: "wdq49-4", atom: "a-wd-icons-svg", d: 3,
      prompt: "An SVG icon sits next to the word Download inside a button. What should it have?",
      options: ["aria-hidden=\"true\", because the text already says what it means", "An alt attribute", "A title saying \"icon\"", "Nothing; it should be announced"],
      correct: "a",
      explanation: "A decorative icon would otherwise add noise.",
      wrong: { b: "Inline svg has no alt.", c: "\"icon\" tells the listener nothing.", d: "It would be announced as an unnamed graphic." },
    }),
  ]),

  ...check("wd-l50-components-errors", [
    q({
      id: "wdq50-1", atom: "a-wd-reusable-components", d: 2,
      prompt: "In a reusable button component, what belongs in the base .btn class?",
      options: ["Everything every variant shares: size, radius, font, focus ring", "Only the colour of the primary variant", "Margins pushing on neighbouring elements", "Nothing; each variant should repeat everything"],
      correct: "a",
      explanation: "Modifiers then change only what differs, usually colour.",
      wrong: { b: "Colours belong in modifiers.", c: "Components should not push on their surroundings.", d: "Repeating defeats the point." },
    }),
    q({
      id: "wdq50-2", atom: "a-wd-error-states", d: 3,
      prompt: "Which attribute makes a screen reader read an error message when the invalid field is focused?",
      options: ["aria-describedby pointing at the message's id", "aria-label on the message", "role=\"error\"", "class=\"error\""],
      correct: "a",
      explanation: "aria-describedby attaches the message to the field.",
      wrong: { b: "That names the message, not the field.", c: "There is no such role.", d: "Classes mean nothing to assistive technology." },
    }),
    q({
      id: "wdq50-3", atom: "a-wd-error-states", d: 2,
      prompt: "Which error message is best?",
      options: ["Enter the 16 digits on the front of your card", "Invalid input", "Error 422", "Wrong"],
      correct: "a",
      explanation: "It says what is wrong and how to fix it.",
      wrong: { b: "Says nothing about how to fix it.", c: "A code means nothing to a visitor.", d: "Unhelpful and rude." },
    }),
    q({
      id: "wdq50-4", atom: "a-wd-cross-browser", d: 2,
      prompt: "What does an @supports rule let you do?",
      options: ["Apply CSS only in browsers that support a feature, so others get a simpler working page", "Make every browser support new CSS", "Detect the visitor's device model", "Block old browsers"],
      correct: "a",
      explanation: "That is progressive enhancement.",
      wrong: { b: "It cannot add support.", c: "It tests features, not devices.", d: "It never blocks anyone." },
    }),
  ]),
};
