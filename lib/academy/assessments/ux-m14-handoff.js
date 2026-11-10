/**
 * ASSESSMENTS · UI/UX DESIGN · MODULE 14 · DEVELOPER HANDOFF AND UI/UX COLLABORATION
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Never import this from anything under src/.
 * ═════════════════════════════════════════════════════════════════════════
 */

import { q, check } from "./ux-helpers.js";

export const ASSESSMENTS = {
  ...check("ux-l57-sdlc", [
    q({
      id: "uxq57-1", atom: "a-ux-sdlc", d: 2,
      prompt: "How does Agile differ from the waterfall model?",
      options: ["Small pieces go through every stage in short cycles, instead of each stage finishing before the next", "Agile has no testing", "Agile skips design", "Waterfall releases more often"],
      correct: "a",
      explanation: "Agile works in sprints of one to two weeks.",
      wrong: { b: "Testing happens in every sprint.", c: "Design happens continuously.", d: "Waterfall releases rarely." },
    }),
    q({
      id: "uxq57-2", atom: "a-ux-designer-developer", d: 3, type: "scenario",
      prompt: "A developer says your custom chart would take two weeks, but a standard library would take two days. What should you do?",
      options: ["Check whether the library meets the users' needs, and adapt the design if it does", "Insist on the original design", "Remove the chart", "Let the developer decide everything"],
      correct: "a",
      explanation: "Hold firm on user needs, be flexible on how they are met.",
      wrong: { b: "Costly without evidence that it matters.", c: "Users still need the data.", d: "Decide together." },
    }),
    q({
      id: "uxq57-3", atom: "a-ux-html-css-designers", d: 2,
      prompt: "In CSS, what is the equivalent of a Figma fill?",
      options: ["background", "border", "margin", "font-family"],
      correct: "a",
      explanation: "Fills become backgrounds; strokes become borders.",
      wrong: { b: "That is a stroke.", c: "Space outside the box.", d: "Typography." },
    }),
    q({
      id: "uxq57-4", atom: "a-ux-html-css-designers", d: 3,
      prompt: "With box-sizing: border-box, a card has width 320px, padding 24px and a 1px border. How wide is its content area?",
      options: ["270px", "320px", "370px", "296px"],
      correct: "a",
      explanation: "320 − 2 × 24 − 2 × 1 = 270.",
      wrong: { b: "That is the total width.", c: "That adds instead of subtracting.", d: "Forgets the padding on one side and the border." },
    }),
  ]),

  ...check("ux-l58-layout", [
    q({
      id: "uxq58-1", atom: "a-ux-layout-implementation", d: 2,
      prompt: "In normal flow, how do block elements such as paragraphs arrange themselves?",
      options: ["Stacked top to bottom, each as wide as its container", "Side by side like words", "In a grid automatically", "Overlapping each other"],
      correct: "a",
      explanation: "Inline elements flow like words; blocks stack.",
      wrong: { b: "That is inline behaviour.", c: "Grids need display: grid.", d: "Overlap needs positioning." },
    }),
    q({
      id: "uxq58-2", atom: "a-ux-flex-grid", d: 2,
      prompt: "Which CSS creates three equal columns with 16px gaps?",
      options: ["display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px;", "display: block; width: 33%;", "float: left;", "position: absolute;"],
      correct: "a",
      explanation: "Grid with three fractional columns and a gap.",
      wrong: { b: "Blocks stack and ignore gaps.", c: "An old technique without gaps.", d: "Removes elements from layout." },
    }),
    q({
      id: "uxq58-3", atom: "a-ux-design-to-code", d: 2,
      prompt: "Which makes a design translate badly to code?",
      options: ["One-off values such as 13px and 15px, and elements positioned by hand", "Auto Layout and tokens", "Named components", "Every state designed"],
      correct: "a",
      explanation: "One-offs have no system for developers to follow.",
      wrong: { b: "These translate well.", c: "These help.", d: "This helps a lot." },
    }),
    q({
      id: "uxq58-4", atom: "a-ux-pixel-practical", d: 3,
      prompt: "In design QA, which issue matters most?",
      options: ["A missing error state", "A heading 1px lower on one phone", "A line break in a different place at an unusual width", "Fonts rendering slightly differently on Android"],
      correct: "a",
      explanation: "States and behaviour change the experience; sub-pixel differences do not.",
      wrong: { b: "Nobody will notice.", c: "Expected with real content.", d: "Normal platform differences." },
    }),
  ]),

  ...check("ux-l59-specs", [
    q({
      id: "uxq59-1", atom: "a-ux-inspecting-figma", d: 2,
      prompt: "How do you measure the distance between two layers in Figma?",
      options: ["Select one, hold Alt (Option on Mac) and hover over the other", "Draw a ruler with the pen tool", "Export both and compare", "Count the pixels by eye"],
      correct: "a",
      explanation: "Figma shows the distance in red.",
      wrong: { b: "Unnecessary.", c: "Far slower.", d: "Inaccurate." },
    }),
    q({
      id: "uxq59-2", atom: "a-ux-exporting-assets", d: 2,
      prompt: "Which format should a logo be exported in for the web?",
      options: ["SVG", "JPG", "GIF", "BMP"],
      correct: "a",
      explanation: "Sharp at every size, small, recolourable.",
      wrong: { b: "Blurs edges, no transparency.", c: "Limited colours.", d: "Huge, uncompressed files." },
    }),
    q({
      id: "uxq59-3", atom: "a-ux-developer-handoff", d: 3,
      prompt: "Which belongs in a complete handoff package?",
      options: ["Every state of every screen, responsive behaviour and accessibility annotations", "Only the happy-path screens", "Only a PDF of the home screen", "The designer's working sketches only"],
      correct: "a",
      explanation: "Developers should not have to guess.",
      wrong: { b: "Missing states get built badly or not at all.", c: "Far from enough.", d: "Not a buildable specification." },
    }),
    q({
      id: "uxq59-4", atom: "a-ux-component-docs-handoff", d: 2,
      prompt: "Which asset file name follows good conventions?",
      options: ["icon-arrow-back.svg", "Icon Arrow Back FINAL.PNG", "image1.jpg", "arrow (copy 2).svg"],
      correct: "a",
      explanation: "Lowercase, hyphenated, descriptive, the right format.",
      wrong: { b: "Spaces, capitals, \"FINAL\" and a raster format for an icon.", c: "Says nothing about the content.", d: "Spaces and copy numbers." },
    }),
  ]),

  ...check("ux-l60-collaboration", [
    q({
      id: "uxq60-1", atom: "a-ux-communicating-requirements", d: 2,
      prompt: "Which acceptance criterion is checkable?",
      options: ["Given the payment fails, the user sees \"You have not been charged\" and a Try again button", "Error handling should be good", "The page should feel nice", "Make it user-friendly"],
      correct: "a",
      explanation: "Specific, observable and testable.",
      wrong: { b: "Vague.", c: "Subjective.", d: "Not testable." },
    }),
    q({
      id: "uxq60-2", atom: "a-ux-git-workflows", d: 2,
      prompt: "Where should designers review a built feature before it is merged?",
      options: ["On the pull request's preview deployment, on real devices", "Only after it is live for all users", "In the developer's code editor", "Nowhere; reviewing is not their job"],
      correct: "a",
      explanation: "Preview links make design review part of the workflow.",
      wrong: { b: "Too late and too costly.", c: "Code is not the experience.", d: "Design QA is the designer's job." },
    }),
    q({
      id: "uxq60-3", atom: "a-ux-feedback-revisions", d: 2,
      prompt: "A stakeholder says \"make the button bigger\". What should you listen for?",
      options: ["The problem behind the suggestion, such as not being able to find the button", "Nothing; just make it bigger", "A reason to reject the feedback", "Their preferred colour"],
      correct: "a",
      explanation: "Suggestions are often solutions to an unstated problem.",
      wrong: { b: "The real problem may need a different fix.", c: "Feedback deserves understanding.", d: "Unrelated." },
    }),
    q({
      id: "uxq60-4", atom: "a-ux-agile-teams", d: 3,
      prompt: "What does it mean for designers to work \"one sprint ahead\"?",
      options: ["Designing and researching the next sprint's work while developers build the current one", "Finishing design a year before development", "Skipping sprint planning", "Building the code themselves"],
      correct: "a",
      explanation: "Dual-track: discovery and delivery run in parallel.",
      wrong: { b: "Far too far ahead.", c: "Designers attend planning.", d: "Not the designer's role." },
    }),
  ]),
};
