/**
 * ASSESSMENTS · RESPONSIVE WEB DEVELOPMENT · MODULE 3 · HTML FUNDAMENTALS
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Never import this from anything under src/.
 * ═════════════════════════════════════════════════════════════════════════
 */

import { q, check } from "./wd-helpers.js";

export const ASSESSMENTS = {
  ...check("wd-l9-html-structure", [
    q({
      id: "wdq9-1", atom: "a-wd-what-is-html", d: 1,
      prompt: "What kind of language is HTML?",
      options: ["A markup language that says what each piece of content is", "A programming language that calculates results", "A styling language for colours", "A database language"],
      correct: "a",
      explanation: "HTML marks up content (heading, paragraph, link) so browsers, search engines and screen readers know what it is.",
      wrong: { b: "HTML makes no decisions and does no calculations; that is JavaScript.", c: "Styling is CSS.", d: "Databases use languages such as SQL." },
    }),
    q({
      id: "wdq9-2", atom: "a-wd-document-structure", d: 2,
      prompt: "What happens if a page leaves out <!DOCTYPE html>?",
      options: ["The browser uses quirks mode and lays the page out by old, inconsistent rules", "The page cannot be opened", "The page becomes faster", "Nothing at all"],
      correct: "a",
      explanation: "The doctype switches on standards mode. Without it, sizes and spacing follow legacy rules.",
      wrong: { b: "It still opens, which is why the problem goes unnoticed.", c: "It has no speed benefit.", d: "Layout changes, often subtly." },
    }),
    q({
      id: "wdq9-3", atom: "a-wd-document-structure", d: 2, type: "scenario",
      prompt: "On a phone, a new page shows tiny text, as if a desktop page had been shrunk. Which line is probably missing?",
      options: [
        "<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">",
        "<meta charset=\"UTF-8\">",
        "<title>…</title>",
        "<html lang=\"en\">",
      ],
      correct: "a",
      explanation: "Without the viewport tag, phones pretend to be about 980px wide and scale the page down.",
      wrong: { b: "Charset affects which characters display correctly, not their size.", c: "The title is for the tab and search results.", d: "lang affects pronunciation and translation." },
    }),
    q({
      id: "wdq9-4", atom: "a-wd-element-anatomy", d: 2,
      prompt: "In <img src=\"logo.png\" alt=\"Green Leaf Farms\">, what is src=\"logo.png\"?",
      options: ["An attribute", "The content", "A closing tag", "A separate element"],
      correct: "a",
      explanation: "Attributes are name=\"value\" pairs inside the opening tag. img is a void element with no content or closing tag.",
      wrong: { b: "img has no content; it is a void element.", c: "Closing tags start with </.", d: "It is part of the img element's opening tag." },
    }),
  ]),

  ...check("wd-l10-headings-text", [
    q({
      id: "wdq10-1", atom: "a-wd-headings-paragraphs", d: 2,
      prompt: "How should you choose between <h2> and <h4> for a section title?",
      options: ["By its level in the page's outline", "By which size looks better", "Always use h4 to keep text small", "Randomly, it makes no difference"],
      correct: "a",
      explanation: "Headings are an outline. Size is changed with CSS.",
      wrong: { b: "Size is presentation; CSS changes it without breaking the outline.", c: "Using smaller levels for main sections breaks navigation for screen-reader users.", d: "Screen readers and search engines rely on the levels." },
    }),
    q({
      id: "wdq10-2", atom: "a-wd-headings-paragraphs", d: 3, type: "scenario",
      prompt: "A page has an h1, then an h3, then an h2. What is the problem?",
      options: ["A level is skipped: the h3 comes straight after the h1", "There are too many headings", "h1 must come last", "Nothing; any order is fine"],
      correct: "a",
      explanation: "Go down one level at a time: h1, then h2, then h3 inside an h2.",
      wrong: { b: "Many headings are fine if they form an outline.", c: "h1 is the top of the outline, so it comes first.", d: "Skipped levels confuse the outline that assistive technology presents." },
    }),
    q({
      id: "wdq10-3", atom: "a-wd-text-emphasis", d: 2,
      prompt: "A form's instructions say \"Your password will NOT be shown again\". Which element marks NOT as important?",
      options: ["<strong>", "<b>", "<small>", "<code>"],
      correct: "a",
      explanation: "<strong> carries strong importance, which screen readers can convey; <b> is only visual.",
      wrong: { b: "<b> looks the same but has no meaning of importance.", c: "<small> is for fine print.", d: "<code> is for code." },
    }),
    q({
      id: "wdq10-4", atom: "a-wd-text-emphasis", d: 2,
      prompt: "Which element marks a word you would stress when reading aloud?",
      options: ["<em>", "<mark>", "<blockquote>", "<br>"],
      correct: "a",
      explanation: "<em> is stress emphasis, usually shown in italics.",
      wrong: { b: "<mark> highlights, as with a search match.", c: "<blockquote> is a long quotation.", d: "<br> is a line break." },
    }),
  ]),

  ...check("wd-l11-links-images", [
    q({
      id: "wdq11-1", atom: "a-wd-links", d: 2,
      prompt: "Which link text is best?",
      options: ["Read our delivery policy", "Click here", "Read more", "Link"],
      correct: "a",
      explanation: "Link text should make sense on its own, because screen-reader users often list all links on a page.",
      wrong: { b: "\"Click here\" says nothing about the destination.", c: "\"Read more\" repeated across a page is ambiguous.", d: "\"Link\" describes nothing." },
    }),
    q({
      id: "wdq11-2", atom: "a-wd-links", d: 3,
      prompt: "Why add rel=\"noopener\" to a link with target=\"_blank\"?",
      options: [
        "So the page opened in the new tab cannot control or redirect your page",
        "To make the link open faster",
        "To make the link bold",
        "Because target=\"_blank\" does not work without it",
      ],
      correct: "a",
      explanation: "noopener stops the new page getting a reference back to yours through window.opener.",
      wrong: { b: "It does not change speed.", c: "Styling is CSS.", d: "The tab opens either way; noopener is about safety." },
    }),
    q({
      id: "wdq11-3", atom: "a-wd-absolute-relative", d: 3, type: "scenario",
      prompt: "From the page shop/products/shoes.html, which relative URL reaches shop/index.html?",
      options: ["../index.html", "index.html", "products/index.html", "./shop/index.html"],
      correct: "a",
      explanation: ".. goes up one folder, from products to shop.",
      wrong: { b: "That looks in products, next to shoes.html.", c: "That looks for products/products/index.html.", d: "That looks for products/shop/index.html." },
    }),
    q({
      id: "wdq11-4", atom: "a-wd-images-alt", d: 2,
      prompt: "A decorative divider image adds nothing to the meaning of the page. What alt should it have?",
      options: ["An empty alt=\"\"", "alt=\"decorative divider image\"", "No alt attribute at all", "alt=\"divider.png\""],
      correct: "a",
      explanation: "An empty alt tells screen readers to skip it. A missing alt makes some read out the file name.",
      wrong: { b: "Announcing decoration wastes the listener's time.", c: "Without alt, many screen readers read the file name instead.", d: "A file name is never useful alt text." },
    }),
  ]),

  ...check("wd-l12-lists-clean-markup", [
    q({
      id: "wdq12-1", atom: "a-wd-lists", d: 1,
      prompt: "Which list fits the steps of a recipe?",
      options: ["<ol>", "<ul>", "<dl>", "A paragraph for each step with typed numbers"],
      correct: "a",
      explanation: "Order matters in steps, so an ordered list, which also numbers itself.",
      wrong: { b: "<ul> is for items whose order does not matter.", c: "<dl> pairs terms with descriptions.", d: "Typed numbers break when a step is inserted." },
    }),
    q({
      id: "wdq12-2", atom: "a-wd-nesting", d: 3,
      prompt: "Which line is nested correctly?",
      options: ["<p><a href=\"/\"><strong>Home</strong></a></p>", "<p><a href=\"/\"><strong>Home</a></strong></p>", "<p><strong><a href=\"/\">Home</strong></a></p>", "<strong><p>Home</strong></p>"],
      correct: "a",
      explanation: "Each element closes before the one that contains it: last opened, first closed.",
      wrong: { b: "strong opens inside a but closes outside it.", c: "a opens inside strong but closes outside it.", d: "strong closes before the p it contains." },
    }),
    q({
      id: "wdq12-3", atom: "a-wd-entities", d: 2,
      prompt: "How do you show the text <h1> on a page without creating a heading?",
      options: ["&lt;h1&gt;", "<h1>", "\"<h1>\"", "<!-- <h1> -->"],
      correct: "a",
      explanation: "&lt; and &gt; display < and > as characters instead of starting a tag.",
      wrong: { b: "That creates a real heading.", c: "Quotes do not stop HTML reading the tag.", d: "A comment hides it completely." },
    }),
    q({
      id: "wdq12-4", atom: "a-wd-clean-markup", d: 2,
      prompt: "Why must you never put a password in an HTML comment?",
      options: ["Anyone can read comments with View Source", "Comments make the page slower", "Browsers delete comments", "Comments are shown on the page"],
      correct: "a",
      explanation: "Comments are not displayed, but they are sent to every visitor as part of the source.",
      wrong: { b: "Comments are tiny; secrecy is the issue.", c: "They are kept in the source the visitor receives.", d: "They are not displayed, which is why people wrongly assume they are private." },
    }),
  ]),
};
