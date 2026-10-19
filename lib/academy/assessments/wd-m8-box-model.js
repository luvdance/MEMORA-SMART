/**
 * ASSESSMENTS · RESPONSIVE WEB DEVELOPMENT · MODULE 8 · THE CSS BOX MODEL
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Never import this from anything under src/.
 * ═════════════════════════════════════════════════════════════════════════
 */

import { q, check } from "./wd-helpers.js";

export const ASSESSMENTS = {
  ...check("wd-l31-box", [
    q({
      id: "wdq31-1", atom: "a-wd-box-layers", d: 2,
      prompt: "Which layer of the box shows the element's background colour and sits between the content and the border?",
      options: ["Padding", "Margin", "Outline", "Content"],
      correct: "a",
      explanation: "Padding is inside the border and shows the background; margin is outside and transparent.",
      wrong: { b: "Margin is outside the border and always transparent.", c: "Outline is drawn outside the border and takes no space.", d: "Content is inside the padding." },
    }),
    q({
      id: "wdq31-2", atom: "a-wd-box-sizing", d: 3, type: "scenario",
      prompt: "With the default box-sizing, a box has width: 200px, padding: 10px and border: 5px. How wide is it on screen?",
      options: ["230px", "200px", "215px", "210px"],
      correct: "a",
      explanation: "content-box: 200 + 10 + 10 + 5 + 5 = 230px.",
      wrong: { b: "That would be border-box.", c: "Padding and border are added on both sides.", d: "The border is missing from that sum." },
    }),
    q({
      id: "wdq31-3", atom: "a-wd-width-height", d: 2,
      prompt: "Why is a fixed height on a box of text risky?",
      options: ["Text that wraps onto more lines, or is enlarged, overflows the box", "Heights are not allowed on text", "It makes text smaller", "It removes the padding"],
      correct: "a",
      explanation: "Let height come from the content; use min-height if you need a minimum.",
      wrong: { b: "They are allowed, just risky.", c: "Height does not change font size.", d: "Padding is unaffected." },
    }),
    q({
      id: "wdq31-4", atom: "a-wd-min-max", d: 2,
      prompt: "Which rule centres a text column that is never wider than 640px but shrinks on phones?",
      options: ["max-width: 640px; margin: 0 auto;", "width: 640px; margin: 0 auto;", "min-width: 640px;", "max-height: 640px;"],
      correct: "a",
      explanation: "max-width caps the width without forcing it; auto side margins centre it.",
      wrong: { b: "A fixed width overflows a 375px phone.", c: "min-width forces at least 640px.", d: "That limits height, not width." },
    }),
  ]),

  ...check("wd-l32-units-overflow", [
    q({
      id: "wdq32-1", atom: "a-wd-margin-collapse", d: 3,
      prompt: "A heading has margin-bottom: 20px and the paragraph below it margin-top: 12px. How far apart are they?",
      options: ["20px", "32px", "12px", "8px"],
      correct: "a",
      explanation: "Adjacent vertical margins collapse: the larger one wins.",
      wrong: { b: "Vertical margins do not add.", c: "The larger margin wins, not the smaller.", d: "Margins are never subtracted." },
    }),
    q({
      id: "wdq32-2", atom: "a-wd-overflow", d: 2,
      prompt: "A wide table makes the whole page scroll sideways on a phone. Which fix keeps the page still and lets the table scroll?",
      options: ["Wrap the table in a container with overflow-x: auto", "overflow: hidden on the body", "Make the font size 4px", "Delete columns"],
      correct: "a",
      explanation: "Only the wrapper scrolls; the page stays the width of the screen.",
      wrong: { b: "Clipping hides data that then cannot be reached.", c: "Unreadable.", d: "Removing information is a last resort." },
    }),
    q({
      id: "wdq32-3", atom: "a-wd-units", d: 3,
      prompt: "Why might button padding be written in em?",
      options: ["So the padding scales with the button's own font size", "em is always 16px", "em is relative to the screen width", "px does not work on buttons"],
      correct: "a",
      explanation: "A button with larger text gets proportionally larger padding.",
      wrong: { b: "em depends on the element's font size.", c: "That is vw.", d: "px works; it just does not scale." },
    }),
    q({
      id: "wdq32-4", atom: "a-wd-viewport-units", d: 2,
      prompt: "What does min-height: 100vh do?",
      options: ["Makes the element at least as tall as the browser window", "Sets the height to 100 pixels", "Makes it 100% of the parent's height", "Sets the width to the screen"],
      correct: "a",
      explanation: "1vh is 1% of the viewport height.",
      wrong: { b: "vh is not pixels.", c: "That would be a percentage of the parent.", d: "Width would be vw." },
    }),
  ]),

  ...check("wd-l33-spacing", [
    q({
      id: "wdq33-1", atom: "a-wd-debug-spacing", d: 2,
      prompt: "What is the fastest way to find where an unexpected gap comes from?",
      options: ["Inspect the element and read its box-model diagram in the developer tools", "Add negative margins until it disappears", "Delete CSS rules at random", "Rewrite the page"],
      correct: "a",
      explanation: "The diagram shows margin, border and padding with real values.",
      wrong: { b: "Hides the cause and creates new problems.", c: "Slow and destructive.", d: "Out of proportion to the problem." },
    }),
    q({
      id: "wdq33-2", atom: "a-wd-debug-spacing", d: 3, type: "scenario",
      prompt: "A coloured section has a gap above it, caused by its h2's top margin escaping outside. Which fix works?",
      options: ["Add padding-top to the section (or display: flow-root)", "Add margin-top to the section", "Make the h2 bold", "Remove the background colour"],
      correct: "a",
      explanation: "Padding or a new formatting context stops the child's margin collapsing through.",
      wrong: { b: "That adds more margin, which also collapses.", c: "Weight does not affect margins.", d: "That hides the gap without fixing it." },
    }),
    q({
      id: "wdq33-3", atom: "a-wd-spacing-system", d: 2,
      prompt: "What is a spacing system?",
      options: ["A small scale of allowed values, such as 4, 8, 16, 24 and 32px, used for every margin and padding", "Using as many different values as possible", "Spacing set only in pixels", "A tool that adds space automatically"],
      correct: "a",
      explanation: "A consistent scale gives a page visual rhythm.",
      wrong: { b: "Random values look uneven.", c: "Units are separate from the idea of a scale.", d: "It is a design decision, not a tool." },
    }),
    q({
      id: "wdq33-4", atom: "a-wd-spacing-system", d: 2,
      prompt: "Why store the spacing scale as CSS variables?",
      options: ["The whole site can be re-spaced by changing a few values in one place", "Variables make pages load faster", "Browsers require it", "It removes the need for padding"],
      correct: "a",
      explanation: "One change to --space-3 updates every component that uses it.",
      wrong: { b: "Variables do not speed up loading.", c: "Browsers do not require variables.", d: "Variables hold padding values; they do not replace padding." },
    }),
  ]),
};
