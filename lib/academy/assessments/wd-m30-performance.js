/**
 * ASSESSMENTS · RESPONSIVE WEB DEVELOPMENT · MODULE 30 · ACCESSIBILITY, SEO AND PERFORMANCE
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Never import this from anything under src/.
 * ═════════════════════════════════════════════════════════════════════════
 */

import { q, check } from "./wd-helpers.js";

export const ASSESSMENTS = {
  ...check("wd-l141-a11y-review", [
    q({ id: "wdq141-1", atom: "a-wd-semantic-review", d: 2, prompt: "Which DevTools view shows what assistive technology receives for an element?", options: ["The accessibility tree", "The Network panel", "The Sources panel", "The Application panel"], correct: "a",
      explanation: "It shows each element's role, name and state.",
      wrong: { b: "Network shows requests.", c: "Sources shows code.", d: "Application shows storage." } }),
    q({ id: "wdq141-2", atom: "a-wd-keyboard-a11y", d: 2, prompt: "What is the first test in a keyboard review?", options: ["Use the whole page with Tab, Enter, Space, arrows and Escape, without a mouse", "Check the colours", "Run the build", "Resize the window"], correct: "a",
      explanation: "Every interactive thing must be reachable, visible and operable.",
      wrong: { b: "A separate check.", c: "Unrelated.", d: "That is a responsive test." } }),
    q({ id: "wdq141-3", atom: "a-wd-forms-nav-review", d: 3, type: "scenario", prompt: "A \"Submit\" control is a styled div with a click listener. What does a keyboard user experience?", options: ["They cannot reach or press it, and Enter in a field does not submit", "It works the same as a button", "It submits twice", "The screen reader announces it as a button"], correct: "a",
      explanation: "Use a real button inside a real form.",
      wrong: { b: "A div is not focusable or operable by keyboard.", c: "It does not submit at all.", d: "It has no button role." } }),
    q({ id: "wdq141-4", atom: "a-wd-forms-nav-review", d: 2, prompt: "How do you mark the current page's link in the navigation?", options: ["aria-current=\"page\"", "class=\"current\" only", "tabindex=\"-1\"", "aria-hidden=\"true\""], correct: "a",
      explanation: "Screen readers announce it as the current page.",
      wrong: { b: "A class is visual only.", c: "That removes it from the tab order.", d: "That hides it from assistive technology." } }),
    q({ id: "wdq141-5", atom: "a-wd-contrast-focus", d: 3, prompt: "What is wrong with *:focus { outline: none; } on its own?", options: ["Keyboard users can no longer see where they are", "It makes the page slower", "It breaks the form", "Nothing, it is best practice"], correct: "a",
      explanation: "Replace it with a visible :focus-visible style instead.",
      wrong: { b: "Not a speed issue.", c: "The form still works.", d: "It is a common accessibility failure." } }),
  ]),

  ...check("wd-l142-seo", [
    q({ id: "wdq142-1", atom: "a-wd-titles-metadata", d: 2, prompt: "Which is the best title for a restaurant's homepage?", options: ["Iya Basira's Kitchen · Amala and Yoruba food in Ibadan", "Home", "Welcome to our website", "Page 1"], correct: "a",
      explanation: "Specific, with the words people search for first.",
      wrong: { b: "Says nothing in search results.", c: "Generic.", d: "Meaningless." } }),
    q({ id: "wdq142-2", atom: "a-wd-titles-metadata", d: 3, prompt: "What does <link rel=\"canonical\"> do?", options: ["Tells search engines which address is the real one for this page", "Loads a stylesheet", "Redirects visitors", "Hides the page from search"], correct: "a",
      explanation: "It stops duplicate addresses splitting a page's ranking.",
      wrong: { b: "That is rel=stylesheet.", c: "It does not redirect.", d: "That is noindex." } }),
    q({ id: "wdq142-3", atom: "a-wd-titles-metadata", d: 3, prompt: "What is JSON-LD structured data for?", options: ["Describing the business, product or article to search engines, which can earn rich results", "Styling the page", "Storing user data", "Speeding up JavaScript"], correct: "a",
      explanation: "It uses schema.org vocabulary in a script tag.",
      wrong: { b: "Unrelated to CSS.", c: "It is a public description, not storage.", d: "Unrelated." } }),
    q({ id: "wdq142-4", atom: "a-wd-search-structure", d: 2, prompt: "Why avoid \"click here\" as link text?", options: ["The link's text should say where it goes, for search engines and screen-reader users", "It is too long", "Search engines block it", "It breaks on mobile"], correct: "a",
      explanation: "Descriptive link text helps everyone.",
      wrong: { b: "It is short but meaningless.", c: "Not blocked, just unhelpful.", d: "It works, it is just poor." } }),
  ]),

  ...check("wd-l143-images-fonts", [
    q({ id: "wdq143-1", atom: "a-wd-image-formats", d: 2, prompt: "In <picture>, which element carries the alt text?", options: ["The <img> inside it", "The first <source>", "The <picture> itself", "Each <source>"], correct: "a",
      explanation: "The img is the fallback and the accessible image.",
      wrong: { b: "Sources only offer files.", c: "picture has no alt.", d: "Sources have no alt." } }),
    q({ id: "wdq143-2", atom: "a-wd-image-formats", d: 2, prompt: "For the same quality, which format is usually smallest?", options: ["AVIF", "JPEG", "PNG", "BMP"], correct: "a",
      explanation: "AVIF, then WebP, then JPEG.",
      wrong: { b: "Larger than WebP and AVIF.", c: "Best for flat graphics, large for photos.", d: "Uncompressed." } }),
    q({ id: "wdq143-3", atom: "a-wd-lazy-loading", d: 3, type: "scenario", prompt: "Lighthouse reports a slow LCP. The hero image at the top has loading=\"lazy\". What should you do?", options: ["Remove loading=\"lazy\" from the hero and add fetchpriority=\"high\"", "Lazy-load every image", "Remove the hero's alt", "Make the hero a background colour"], correct: "a",
      explanation: "The first image seen must load as early as possible.",
      wrong: { b: "Makes the hero even later.", c: "Alt does not affect speed.", d: "Removes content rather than fixing loading." } }),
    q({ id: "wdq143-4", atom: "a-wd-font-loading", d: 2, prompt: "What prevents images from making the page jump when they load?", options: ["width and height attributes (or aspect-ratio)", "loading=\"lazy\"", "alt text", "font-display: swap"], correct: "a",
      explanation: "The browser reserves their space before they arrive.",
      wrong: { b: "Delays loading; does not reserve space.", c: "Accessibility, not layout.", d: "That is for fonts." } }),
    q({ id: "wdq143-5", atom: "a-wd-font-loading", d: 2, prompt: "What does font-display: swap do?", options: ["Shows text at once in a fallback font, then swaps in the web font", "Hides text until the font loads", "Downloads all font weights", "Converts the font to WOFF2"], correct: "a",
      explanation: "Text is never invisible while waiting.",
      wrong: { b: "That is the problem it solves.", c: "No.", d: "No." } }),
  ]),

  ...check("wd-l144-js-vitals", [
    q({ id: "wdq144-1", atom: "a-wd-minimise-js", d: 3, prompt: "A chart library is needed only when a button is pressed. How do you keep it off the initial load?", options: ["Load it with a dynamic import() inside the click handler", "Put the script tag at the top of the head", "Inline it in the HTML", "Minify it twice"], correct: "a",
      explanation: "The bundler splits it into its own file, fetched on demand.",
      wrong: { b: "That blocks the page.", c: "Still loaded for everyone.", d: "Still loaded for everyone." } }),
    q({ id: "wdq144-2", atom: "a-wd-lighthouse", d: 2, prompt: "Why run Lighthouse in an incognito window?", options: ["Browser extensions can skew the results", "It is faster", "Lighthouse only works there", "It hides your IP"], correct: "a",
      explanation: "Extensions add scripts the visitor does not have.",
      wrong: { b: "Not the reason.", c: "It works anywhere.", d: "Irrelevant." } }),
    q({ id: "wdq144-3", atom: "a-wd-web-vitals", d: 2, prompt: "Which Core Web Vital measures how much content jumps?", options: ["CLS", "LCP", "INP", "TTFB"], correct: "a",
      explanation: "Cumulative Layout Shift; good is under 0.1.",
      wrong: { b: "Loading.", c: "Responsiveness.", d: "Server response, not a Core Web Vital." } }),
    q({ id: "wdq144-4", atom: "a-wd-responsive-image-strategies", d: 3, prompt: "What does the sizes attribute tell the browser?", options: ["How wide the image will be displayed, so it can pick the right file from srcset", "The file size of each image", "The image's height", "Which format to use"], correct: "a",
      explanation: "srcset lists files; sizes describes the layout.",
      wrong: { b: "Width descriptors describe the files.", c: "No.", d: "That is <picture> with type." } }),
    q({ id: "wdq144-5", atom: "a-wd-measure-improve", d: 2, prompt: "What is a performance budget?", options: ["Limits such as \"under 200kB of JavaScript\" checked on every release", "The money spent on hosting", "The number of developers", "A Lighthouse setting"], correct: "a",
      explanation: "It stops the site slowly getting heavier.",
      wrong: { b: "Not money.", c: "No.", d: "It is your own rule." } }),
  ]),
};
