/**
 * ASSESSMENTS · UI/UX DESIGN · MODULE 10 · INTERACTIVE PROTOTYPING
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Never import this from anything under src/.
 * ═════════════════════════════════════════════════════════════════════════
 */

import { q, check } from "./ux-helpers.js";

export const ASSESSMENTS = {
  ...check("ux-l41-prototypes", [
    q({
      id: "uxq41-1", atom: "a-ux-what-prototype", d: 2,
      prompt: "What is the main purpose of a prototype?",
      options: ["To learn how a design works in use before building the real thing", "To replace the finished product", "To decorate a presentation", "To store the design files"],
      correct: "a",
      explanation: "Prototypes reveal problems static screens hide.",
      wrong: { b: "It simulates the product; it is not the product.", c: "It is a learning tool.", d: "Files are stored in Figma." },
    }),
    q({
      id: "uxq41-2", atom: "a-ux-prototype-fidelity", d: 3, type: "scenario",
      prompt: "You want to know whether people can find the transfer feature at all. What fidelity do you need?",
      options: ["Low fidelity: linked wireframes or paper are enough", "Only a fully coded app", "High fidelity with final animations", "None; ask people to imagine it"],
      correct: "a",
      explanation: "Findability is about structure and flow.",
      wrong: { b: "Far more than the question needs.", c: "Unnecessary for this question.", d: "People must interact with something." },
    }),
    q({
      id: "uxq41-3", atom: "a-ux-figma-prototype-tab", d: 2,
      prompt: "In a Figma interaction, which is a trigger?",
      options: ["While hovering", "Navigate to", "Smart Animate", "Ease out"],
      correct: "a",
      explanation: "Triggers start interactions; actions and animations follow.",
      wrong: { b: "An action.", c: "An animation.", d: "An easing curve." },
    }),
    q({
      id: "uxq41-4", atom: "a-ux-connecting-frames", d: 2,
      prompt: "When connecting frames, what must every screen have?",
      options: ["A way forward and a way back, so testers never get stuck", "At least five connections", "An animation", "A video"],
      correct: "a",
      explanation: "Dead ends ruin a test session.",
      wrong: { b: "The number depends on the screen.", c: "Not required.", d: "Unrelated." },
    }),
  ]),

  ...check("ux-l42-interactions", [
    q({
      id: "uxq42-1", atom: "a-ux-interactive-components", d: 2,
      prompt: "What is an interactive component in Figma?",
      options: ["A component whose variants are connected, so every instance responds in the prototype without extra wiring", "A component with a video", "Any component in a library", "A component that cannot be edited"],
      correct: "a",
      explanation: "The interaction lives inside the component.",
      wrong: { b: "Unrelated.", c: "Library components are not necessarily interactive.", d: "Unrelated." },
    }),
    q({
      id: "uxq42-2", atom: "a-ux-navigation-interactions", d: 2,
      prompt: "Which action returns the user to wherever they came from?",
      options: ["Back", "Navigate to", "Open link", "Scroll to"],
      correct: "a",
      explanation: "Back behaves like a back button.",
      wrong: { b: "Goes to one fixed frame.", c: "Opens an external URL.", d: "Moves within a frame." },
    }),
    q({
      id: "uxq42-3", atom: "a-ux-hover-interactions", d: 3,
      prompt: "Why must nothing essential be available only on hover?",
      options: ["Touch and keyboard users cannot hover", "Hover is slow", "Hover breaks Figma", "Hover uses too much data"],
      correct: "a",
      explanation: "Phones, tablets and keyboards have no hover.",
      wrong: { b: "Speed is not the issue.", c: "It works in Figma.", d: "Unrelated." },
    }),
    q({
      id: "uxq42-4", atom: "a-ux-drag-interactions", d: 2,
      prompt: "A carousel only moves by swiping. What should be added?",
      options: ["Signifiers such as a peek of the next card or dots, and visible arrow buttons", "Nothing; everyone knows to swipe", "A longer animation", "A sound"],
      correct: "a",
      explanation: "Gestures are invisible; give clues and an alternative.",
      wrong: { b: "Not everyone discovers or can perform gestures.", c: "Does not help discovery.", d: "Does not help discovery." },
    }),
  ]),

  ...check("ux-l43-motion-overlays", [
    q({
      id: "uxq43-1", atom: "a-ux-smart-animate", d: 3,
      prompt: "Smart Animate is not animating a card between two frames. What should you check first?",
      options: ["That the card layer has the same name in both frames", "The file's colour profile", "The export settings", "The font licence"],
      correct: "a",
      explanation: "Smart Animate matches layers by name.",
      wrong: { b: "Unrelated.", c: "Unrelated.", d: "Unrelated." },
    }),
    q({
      id: "uxq43-2", atom: "a-ux-transitions", d: 2,
      prompt: "What duration suits most interface transitions?",
      options: ["About 150 to 300 milliseconds", "About 2 seconds", "About 5 seconds", "Under 10 milliseconds"],
      correct: "a",
      explanation: "Fast enough to feel responsive, slow enough to follow.",
      wrong: { b: "Feels sluggish.", c: "Far too slow.", d: "Too fast to perceive." },
    }),
    q({
      id: "uxq43-3", atom: "a-ux-overlays", d: 2,
      prompt: "Why dim the page behind a modal overlay?",
      options: ["To separate figure from ground and focus attention on the decision", "To save battery", "To hide errors", "Because Figma requires it"],
      correct: "a",
      explanation: "The overlay becomes the clear focus.",
      wrong: { b: "Not the reason.", c: "Unrelated.", d: "It is optional in Figma." },
    }),
    q({
      id: "uxq43-4", atom: "a-ux-scroll-behaviour", d: 2,
      prompt: "What does a sticky element do?",
      options: ["Scrolls with the page until it reaches the top, then stays there", "Never scrolls at all from the start", "Disappears when scrolling", "Scrolls faster than the page"],
      correct: "a",
      explanation: "Like section headers that stay in view.",
      wrong: { b: "That is fixed.", c: "Not what sticky means.", d: "That is parallax." },
    }),
    q({
      id: "uxq43-5", atom: "a-ux-interactive-forms", d: 3, type: "scenario",
      prompt: "Every participant completes a prototype's sign-up, but all fields were pre-filled and Continue always succeeded. What did the test show about the form?",
      options: ["Very little, because people never typed, chose or made a mistake", "That the form is perfect", "That users never make mistakes", "That forms need no testing"],
      correct: "a",
      explanation: "A prototype tests only what it simulates.",
      wrong: { b: "Nobody actually filled it in.", c: "Mistakes were impossible.", d: "Forms are error-prone." },
    }),
  ]),

  ...check("ux-l44-presenting", [
    q({
      id: "uxq44-1", atom: "a-ux-realistic-experiences", d: 2,
      prompt: "Why use realistic content such as ₦48,200.00 instead of 00000 in a prototype?",
      options: ["People react as they would to the real product instead of noticing it is fake", "It makes the file smaller", "Developers require it", "It is required by banks"],
      correct: "a",
      explanation: "Fake details pull people out of the scenario.",
      wrong: { b: "Unrelated.", c: "Not the reason.", d: "Not the reason." },
    }),
    q({
      id: "uxq44-2", atom: "a-ux-sharing-prototypes", d: 2,
      prompt: "Why keep a named version for each round of testing?",
      options: ["So you know exactly what each participant saw", "To make the link shorter", "Because Figma deletes unnamed files", "To hide the prototype"],
      correct: "a",
      explanation: "Findings must be tied to the version tested.",
      wrong: { b: "Unrelated.", c: "It does not.", d: "Unrelated." },
    }),
    q({
      id: "uxq44-3", atom: "a-ux-presenting-concepts", d: 3,
      prompt: "How should a design presentation begin?",
      options: ["With the problem, the users and what success looks like", "With the colour palette", "With every screen in order", "With the designer's biography"],
      correct: "a",
      explanation: "Context lets people judge whether the design works.",
      wrong: { b: "Invites taste debates.", c: "A tour without a story loses people.", d: "Not relevant." },
    }),
    q({
      id: "uxq44-4", atom: "a-ux-banking-lab", d: 2,
      prompt: "Why should the transfer screen show the recipient's name before sending?",
      options: ["It prevents sending money to the wrong account", "It looks nicer", "It is faster", "It hides the account number"],
      correct: "a",
      explanation: "People recognise a wrong name instantly: error prevention.",
      wrong: { b: "The point is safety.", c: "It adds a moment, deliberately.", d: "Both can be shown." },
    }),
  ]),
};
