/**
 * ASSESSMENTS · RESPONSIVE WEB DEVELOPMENT · MODULE 7 · COLORS, TYPOGRAPHY AND STYLING
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Never import this from anything under src/.
 * ═════════════════════════════════════════════════════════════════════════
 */

import { q, check } from "./wd-helpers.js";

export const ASSESSMENTS = {
  ...check("wd-l28-colour", [
    q({
      id: "wdq28-1", atom: "a-wd-colour-formats", d: 2,
      prompt: "Which colour format makes it easiest to create a lighter shade of the same colour by hand?",
      options: ["HSL, by raising only the lightness value", "HEX", "Named colours", "RGB"],
      correct: "a",
      explanation: "HSL separates hue, saturation and lightness, so a lighter shade is one number.",
      wrong: { b: "HEX mixes all three channels in one code.", c: "There are only about 140 named colours.", d: "RGB needs all three channels changed together." },
    }),
    q({
      id: "wdq28-2", atom: "a-wd-colour-formats", d: 2,
      prompt: "What does the 0.5 in rgba(0, 0, 0, 0.5) mean?",
      options: ["50% opacity: half transparent", "50% brightness", "Half the font size", "A 0.5px border"],
      correct: "a",
      explanation: "The fourth value is alpha, from 0 (invisible) to 1 (solid).",
      wrong: { b: "Brightness would change the channels.", c: "Colours do not set sizes.", d: "Unrelated to borders." },
    }),
    q({
      id: "wdq28-3", atom: "a-wd-backgrounds", d: 2,
      prompt: "Why set a background-color as well as a background-image gradient or photo?",
      options: ["It shows while the image loads, or if it fails, so text stays readable", "Gradients need it to work", "It makes the image sharper", "It is required by HTML"],
      correct: "a",
      explanation: "A fallback colour keeps contrast before and without the image.",
      wrong: { b: "Gradients work without it.", c: "It does not affect sharpness.", d: "HTML does not care about CSS backgrounds." },
    }),
    q({
      id: "wdq28-4", atom: "a-wd-backgrounds", d: 3, type: "scenario",
      prompt: "White text over a busy photo is hard to read. What is the usual fix?",
      options: ["Place a semi-transparent dark layer between the photo and the text", "Make the text smaller", "Use a brighter photo", "Add more text"],
      correct: "a",
      explanation: "An rgba overlay evens out the background so contrast is reliable.",
      wrong: { b: "Smaller text is even harder to read.", c: "A brighter photo makes white text worse.", d: "More text does not improve contrast." },
    }),
  ]),

  ...check("wd-l29-typography", [
    q({
      id: "wdq29-1", atom: "a-wd-font-stacks", d: 2,
      prompt: "Why should a font stack end with a generic family such as sans-serif?",
      options: ["It is guaranteed to exist on every device, so text never falls back to an unsuitable font", "It makes the font load faster", "It is required for Google Fonts", "It makes text bold"],
      correct: "a",
      explanation: "If every named font is missing, the generic family still gives the right style.",
      wrong: { b: "Speed is not affected.", c: "Google Fonts work without it, but you should still include it.", d: "Weight is separate." },
    }),
    q({
      id: "wdq29-2", atom: "a-wd-font-size-weight", d: 3,
      prompt: "Why use rem for font sizes rather than px?",
      options: ["rem scales with the visitor's browser font setting, so enlarged text works", "rem is always smaller", "px does not work on phones", "rem loads fonts faster"],
      correct: "a",
      explanation: "1rem follows the root size the user can change; px ignores it.",
      wrong: { b: "1rem is normally 16px.", c: "px works everywhere; it just ignores user settings.", d: "Units do not affect loading." },
    }),
    q({
      id: "wdq29-3", atom: "a-wd-text-align-decoration", d: 2,
      prompt: "Where is it reasonable to remove the underline from links?",
      options: ["In a navigation bar, where it is obvious they are links", "In every paragraph", "Nowhere, ever", "Only on visited links"],
      correct: "a",
      explanation: "In running text the underline is how people recognise a link; in a menu, context does that.",
      wrong: { b: "Links in paragraphs then look like plain text.", c: "Navigation is a well-accepted exception.", d: "Visited state is unrelated." },
    }),
    q({
      id: "wdq29-4", atom: "a-wd-web-fonts", d: 3,
      prompt: "What does display=swap (or font-display: swap) do?",
      options: ["Shows text in a fallback font immediately, then swaps in the web font when it arrives", "Swaps bold and italic", "Downloads all weights", "Hides text until the font loads"],
      correct: "a",
      explanation: "Text is never invisible while the font downloads.",
      wrong: { b: "It is about loading, not styles.", c: "Only the weights you list are downloaded.", d: "That is the behaviour swap prevents." },
    }),
  ]),

  ...check("wd-l30-borders-tokens", [
    q({
      id: "wdq30-1", atom: "a-wd-borders-radius", d: 2,
      prompt: "How do you make a square image display as a circle?",
      options: ["border-radius: 50%", "border: circle", "shape: round", "border-radius: 0"],
      correct: "a",
      explanation: "A 50% radius on every corner of a square makes a circle.",
      wrong: { b: "Not valid CSS.", c: "Not a CSS property.", d: "That gives square corners." },
    }),
    q({
      id: "wdq30-2", atom: "a-wd-shadows", d: 2,
      prompt: "Which shadow looks most natural for a resting card?",
      options: ["0 2px 6px rgba(0, 0, 0, 0.1)", "10px 10px 0 black", "0 0 50px red", "none, shadows are never used"],
      correct: "a",
      explanation: "Small offset, soft blur, low-opacity black.",
      wrong: { b: "Hard, dark and offset: looks dated.", c: "A red glow is decoration, not depth.", d: "Subtle shadows are common and useful." },
    }),
    q({
      id: "wdq30-3", atom: "a-wd-links-buttons", d: 3,
      prompt: "What is the minimum comfortable size for a touch target such as a button?",
      options: ["About 44 by 44 pixels", "10 by 10 pixels", "Exactly the size of its text", "200 pixels wide"],
      correct: "a",
      explanation: "Fingers are imprecise; small targets cause mis-taps.",
      wrong: { b: "Far too small for a finger.", c: "Text alone is usually too small.", d: "Width is not the constraint." },
    }),
    q({
      id: "wdq30-4", atom: "a-wd-css-variables", d: 2,
      prompt: "Where should site-wide CSS variables usually be defined?",
      options: [":root", "On every element", "In the HTML head as meta tags", "Inside a media query only"],
      correct: "a",
      explanation: ":root is the top of the document, so every element inherits them.",
      wrong: { b: "Defining them once is the point.", c: "Meta tags are not CSS.", d: "They are defined globally and can be redefined in media queries." },
    }),
  ]),
};
