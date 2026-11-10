/**
 * ASSESSMENTS · UI/UX DESIGN · MODULE 3 · VISUAL DESIGN FUNDAMENTALS
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Never import this from anything under src/.
 * ═════════════════════════════════════════════════════════════════════════
 */

import { q, check } from "./ux-helpers.js";

export const ASSESSMENTS = {
  ...check("ux-l10-colour", [
    q({
      id: "uxq10-1", atom: "a-ux-visual-principles", d: 2,
      prompt: "Which visual principle says related items should sit close together?",
      options: ["Proximity", "Balance", "Contrast", "Repetition"],
      correct: "a",
      explanation: "Proximity uses distance to show what belongs together.",
      wrong: { b: "Balance is about distributing visual weight.", c: "Contrast is about difference.", d: "Repetition is about reusing the same styles." },
    }),
    q({
      id: "uxq10-2", atom: "a-ux-colour-theory", d: 2,
      prompt: "In the painter's colour wheel, which are the secondary colours?",
      options: ["Orange, green and purple", "Red, yellow and blue", "Red-orange, blue-green and yellow-green", "Black, white and grey"],
      correct: "a",
      explanation: "Each is a mix of two primaries.",
      wrong: { b: "Those are the primaries.", c: "Those are tertiary colours.", d: "Those are neutrals, not wheel hues." },
    }),
    q({
      id: "uxq10-3", atom: "a-ux-colour-psychology", d: 2,
      prompt: "Why should an interface never rely on colour alone to show an error?",
      options: ["About 1 in 12 men cannot reliably tell red from green, and some users cannot see the screen", "Red is too bright", "Colour does not display on phones", "Errors should never be shown"],
      correct: "a",
      explanation: "Add words, icons or signs so the meaning survives without colour.",
      wrong: { b: "Brightness is not the issue.", c: "Phones display colour.", d: "Errors must be shown clearly." },
    }),
    q({
      id: "uxq10-4", atom: "a-ux-palettes", d: 3, type: "scenario",
      prompt: "White button text on a pale lilac (#c4b5fd) fails contrast. What is the best fix that keeps the brand hue?",
      options: ["Use a deeper shade of the same purple for the button", "Make the text pale lilac too", "Add a shadow and keep the colours", "Switch the brand to yellow"],
      correct: "a",
      explanation: "Readability depends on lightness; a deeper purple carries white text.",
      wrong: { b: "That removes all contrast.", c: "A shadow does not fix the ratio reliably.", d: "Changing the brand is unnecessary." },
    }),
  ]),

  ...check("ux-l11-typography", [
    q({
      id: "uxq11-1", atom: "a-ux-typography-fundamentals", d: 2,
      prompt: "What is a comfortable line length for body text?",
      options: ["About 45 to 75 characters", "About 10 to 20 characters", "As wide as the screen", "Exactly 100 characters"],
      correct: "a",
      explanation: "Longer lines make it hard to find the start of the next line; shorter ones break reading rhythm.",
      wrong: { b: "Too short; reading becomes choppy.", c: "On wide screens that is far too long.", d: "Too long for comfortable reading." },
    }),
    q({
      id: "uxq11-2", atom: "a-ux-font-classifications", d: 2,
      prompt: "Which classification is the usual default for interface text?",
      options: ["Sans-serif", "Script", "Display", "Monospace"],
      correct: "a",
      explanation: "Sans-serifs stay clear at small sizes on screens.",
      wrong: { b: "Script imitates handwriting and is hard to read small.", c: "Display faces are for large, short text.", d: "Monospace suits code and aligned numbers." },
    }),
    q({
      id: "uxq11-3", atom: "a-ux-font-pairing", d: 2,
      prompt: "Which is a classic, reliable font pairing?",
      options: ["A serif for headings with a sans-serif for body text", "Two script faces", "Two nearly identical sans-serifs", "A different face for every heading level"],
      correct: "a",
      explanation: "Clearly different classifications, each with a job.",
      wrong: { b: "Two decorative faces fight each other.", c: "Near-identical faces look like a mistake.", d: "Too many faces; use size and weight instead." },
    }),
    q({
      id: "uxq11-4", atom: "a-ux-type-settings", d: 3,
      prompt: "Which line height suits a large 40px heading?",
      options: ["About 1.1 to 1.3", "About 2.0", "About 1.6 to 1.8, the same as body text", "0.8"],
      correct: "a",
      explanation: "Large type needs tighter leading or its lines drift apart.",
      wrong: { b: "Far too loose for headings.", c: "Body-text leading is too loose at large sizes.", d: "Lines would overlap." },
    }),
  ]),

  ...check("ux-l12-hierarchy", [
    q({
      id: "uxq12-1", atom: "a-ux-visual-hierarchy", d: 2,
      prompt: "What does the \"squint test\" reveal?",
      options: ["What people will notice first on the screen", "Whether the text is spelled correctly", "How fast the page loads", "Whether the colours are on brand"],
      correct: "a",
      explanation: "Blurring the screen leaves only the strongest elements visible.",
      wrong: { b: "Spelling needs reading.", c: "Performance is measured differently.", d: "Brand fit is not what it tests." },
    }),
    q({
      id: "uxq12-2", atom: "a-ux-contrast-readability", d: 3,
      prompt: "What minimum contrast ratio does WCAG AA require for normal-size text?",
      options: ["4.5:1", "3:1", "2:1", "7:1"],
      correct: "a",
      explanation: "4.5:1 for normal text; 3:1 for large text and interface components.",
      wrong: { b: "That is for large text and components.", c: "Too low for any text.", d: "That is the stricter AAA level." },
    }),
    q({
      id: "uxq12-3", atom: "a-ux-alignment-proximity", d: 3, type: "scenario",
      prompt: "In a form, each label is 16px above its field and 16px below the previous field. What is the problem?",
      options: ["Labels are equally close to two fields, so it is unclear which they belong to", "The fields are too wide", "The labels are too bold", "There is no problem"],
      correct: "a",
      explanation: "A label should sit much closer to its own field than to the one above.",
      wrong: { b: "Width is unrelated to grouping.", c: "Weight does not cause the ambiguity.", d: "Equal spacing breaks proximity." },
    }),
    q({
      id: "uxq12-4", atom: "a-ux-balance-weight", d: 2,
      prompt: "Which makes an element feel visually heavier?",
      options: ["Being larger, darker and more saturated", "Being smaller and paler", "Being placed in a crowd of similar items", "Having thinner lines"],
      correct: "a",
      explanation: "Size, darkness, saturation and isolation add visual weight.",
      wrong: { b: "These make it lighter.", c: "Isolation adds weight; crowds dilute it.", d: "Thin lines feel lighter." },
    }),
  ]),

  ...check("ux-l13-space-grids", [
    q({
      id: "uxq13-1", atom: "a-ux-white-space", d: 2,
      prompt: "What does white space do in an interface?",
      options: ["Groups related content and gives the focal point room to stand out", "Wastes space that could hold more features", "Only matters in print", "Must always be white"],
      correct: "a",
      explanation: "Space organises and calms the layout.",
      wrong: { b: "Empty space is useful, not wasted.", c: "It matters on every screen, especially phones.", d: "It can be any colour; it is simply empty." },
    }),
    q({
      id: "uxq13-2", atom: "a-ux-consistency", d: 2,
      prompt: "What is external consistency?",
      options: ["Following platform conventions and patterns people know from other products", "Using the same colour everywhere in your product", "Making every page identical", "Keeping the logo the same size"],
      correct: "a",
      explanation: "Internal consistency is within your product; external is with the wider world.",
      wrong: { b: "That is internal consistency.", c: "Consistency is about components, not identical pages.", d: "A narrow internal detail." },
    }),
    q({
      id: "uxq13-3", atom: "a-ux-grids", d: 2,
      prompt: "Why is a 12-column grid common on desktop?",
      options: ["12 divides into 2, 3, 4 and 6 equal parts", "Screens are 12 inches wide", "Browsers require it", "It is the only grid Figma supports"],
      correct: "a",
      explanation: "It allows many equal layouts on one grid.",
      wrong: { b: "Unrelated to screen size in inches.", c: "Browsers have no such requirement.", d: "Figma supports any number of columns." },
    }),
    q({
      id: "uxq13-4", atom: "a-ux-spacing-systems", d: 3, type: "scenario",
      prompt: "A design has gaps of 13px, 22px and 15px. What does an 8-point spacing system suggest?",
      options: ["Replace them with values from the scale, such as 12, 24 and 16", "Keep them; designers chose them by eye", "Make them all 0", "Use random values for variety"],
      correct: "a",
      explanation: "Odd values are usually accidents; the scale gives consistent rhythm.",
      wrong: { b: "By-eye values drift and look inconsistent.", c: "Removes the spacing entirely.", d: "Randomness is the problem a system solves." },
    }),
    q({
      id: "uxq13-5", atom: "a-ux-composition", d: 2,
      prompt: "A screen \"feels wrong\" but you cannot say why. What should you check first?",
      options: ["Whether there is one clear focal point, and whether everything aligns", "Whether the logo is big enough", "Whether there are enough colours", "Whether the screen has animations"],
      correct: "a",
      explanation: "Most composition problems are hierarchy or alignment.",
      wrong: { b: "Rarely the cause.", c: "More colours usually make it worse.", d: "Animation does not fix composition." },
    }),
  ]),

  ...check("ux-l14-style-guide", [
    q({
      id: "uxq14-1", atom: "a-ux-style-guide", d: 2,
      prompt: "What is the main purpose of a visual style guide?",
      options: ["To record visual decisions so everyone applies them the same way", "To replace user research", "To list every screen in the product", "To store the product's code"],
      correct: "a",
      explanation: "It keeps colours, type, spacing and elements consistent.",
      wrong: { b: "It is about visuals, not research.", c: "It records styles, not every screen.", d: "Code lives in the codebase." },
    }),
    q({
      id: "uxq14-2", atom: "a-ux-style-guide", d: 2,
      prompt: "Why name values as tokens such as --color-primary?",
      options: ["Everyone refers to the same named decision, and changing it in one place updates every use", "Tokens make the file larger", "Developers cannot read hex codes", "It is required by Figma"],
      correct: "a",
      explanation: "Tokens are shared names for decisions, used by design and code alike.",
      wrong: { b: "Size is not the point.", c: "They can; tokens add meaning and a single source.", d: "Figma does not require it, though it supports variables." },
    }),
    q({
      id: "uxq14-3", atom: "a-ux-basic-elements", d: 2,
      prompt: "How tall should buttons and inputs be, at minimum, to be easy to tap?",
      options: ["About 44px", "About 20px", "About 100px", "Height does not matter"],
      correct: "a",
      explanation: "44px is the common minimum touch target size.",
      wrong: { b: "Too small for fingers.", c: "Much larger than needed.", d: "Small targets cause mis-taps." },
    }),
    q({
      id: "uxq14-4", atom: "a-ux-style-guide-lab", d: 3,
      prompt: "In a token-based style guide, what does a raw colour value inside a component rule suggest?",
      options: ["A decision has escaped the system and will not update with the tokens", "Good practice for speed", "That the colour is accessible", "Nothing in particular"],
      correct: "a",
      explanation: "Every value should come from a token so the system stays consistent.",
      wrong: { b: "It creates inconsistency later.", c: "It says nothing about accessibility.", d: "It is a sign of drift." },
    }),
  ]),
};
