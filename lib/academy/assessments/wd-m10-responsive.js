/**
 * ASSESSMENTS · RESPONSIVE WEB DEVELOPMENT · MODULE 10 · RESPONSIVE WEB DESIGN
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Never import this from anything under src/.
 * ═════════════════════════════════════════════════════════════════════════
 */

import { q, check } from "./wd-helpers.js";

export const ASSESSMENTS = {
  ...check("wd-l38-mobile-first", [
    q({
      id: "wdq38-1", atom: "a-wd-what-responsive", d: 2,
      prompt: "Which three ingredients make a page responsive?",
      options: ["Fluid layouts, flexible images and media queries", "Large fonts, bright colours and animations", "A separate mobile site, an app and a desktop site", "Tables, frames and fixed widths"],
      correct: "a",
      explanation: "Fluid widths, images that shrink to fit, and CSS that adapts at chosen widths.",
      wrong: { b: "Those are styling choices, not responsiveness.", c: "Responsive design is one site for every screen.", d: "Fixed widths are exactly what breaks on phones." },
    }),
    q({
      id: "wdq38-2", atom: "a-wd-mobile-first", d: 2,
      prompt: "In mobile-first CSS, what do the default styles (outside any media query) describe?",
      options: ["The smallest screen", "The largest screen", "Tablets only", "Printing"],
      correct: "a",
      explanation: "Defaults are for phones; min-width queries add layout as space grows.",
      wrong: { b: "That is desktop first.", c: "Tablets are usually a min-width breakpoint.", d: "Print styles use @media print." },
    }),
    q({
      id: "wdq38-3", atom: "a-wd-mobile-first", d: 3,
      prompt: "Which media query fits a mobile-first stylesheet?",
      options: ["@media (min-width: 768px)", "@media (max-width: 767px)", "@media screen and (max-device-width: 480px)", "@media print"],
      correct: "a",
      explanation: "Mobile first adds styles as the screen gets wider, with min-width.",
      wrong: { b: "max-width overrides desktop defaults for small screens: desktop first.", c: "Device widths are both desktop-first and outdated.", d: "Print is a different medium." },
    }),
    q({
      id: "wdq38-4", atom: "a-wd-responsive-adaptive", d: 2,
      prompt: "What is the main weakness of an adaptive layout that snaps between fixed widths?",
      options: ["It looks awkward at all the widths between its fixed designs", "It cannot use CSS", "It is slower to download", "It only works on iPhones"],
      correct: "a",
      explanation: "Devices come in hundreds of widths; fluid layouts handle the ones in between.",
      wrong: { b: "Adaptive layouts use CSS.", c: "Download size is not the issue.", d: "It works on any device, badly between sizes." },
    }),
  ]),

  ...check("wd-l39-media-queries", [
    q({
      id: "wdq39-1", atom: "a-wd-media-queries", d: 3, type: "scenario",
      prompt: "A phone keeps showing the desktop layout although you wrote @media (min-width: 768px) for it. What is the most likely cause?",
      options: ["The page has no viewport meta tag, so the phone reports a width of about 980px", "Phones ignore media queries", "min-width only works on laptops", "The CSS file is too big"],
      correct: "a",
      explanation: "Without width=device-width the phone pretends to be a desktop.",
      wrong: { b: "Phones apply media queries.", c: "It works on every device.", d: "Size does not change which rules apply." },
    }),
    q({
      id: "wdq39-2", atom: "a-wd-media-queries", d: 2,
      prompt: "Which media query detects a device with a real hover, such as a mouse?",
      options: ["@media (hover: hover)", "@media (mouse: true)", "@media (pointer: none)", "@media (hover: none)"],
      correct: "a",
      explanation: "hover: hover is true for devices whose primary input can hover.",
      wrong: { b: "Not a media feature.", c: "pointer: none means no pointing device.", d: "That means the device cannot hover." },
    }),
    q({
      id: "wdq39-3", atom: "a-wd-content-breakpoints", d: 2,
      prompt: "How should breakpoints be chosen?",
      options: ["By widening the layout until the content starts to look wrong", "From a list of the most popular phones", "One for every device on the market", "At random"],
      correct: "a",
      explanation: "Content-based breakpoints keep working as devices change.",
      wrong: { b: "Device lists date quickly and do not match your content.", c: "Unmanageable and unnecessary.", d: "Breakpoints need a reason." },
    }),
    q({
      id: "wdq39-4", atom: "a-wd-fluid-containers", d: 3,
      prompt: "Which container rule is fluid on phones, capped on large screens and centred?",
      options: ["width: 100%; max-width: 1100px; margin-inline: auto; padding-inline: 16px;", "width: 1100px; margin: auto;", "min-width: 1100px;", "width: 50%;"],
      correct: "a",
      explanation: "Fill small screens, stop growing at 1100px, centre, and keep text off the edges.",
      wrong: { b: "A fixed width overflows phones.", c: "Forces at least 1100px everywhere.", d: "Half the screen on a phone is too narrow." },
    }),
  ]),

  ...check("wd-l40-fluid-type-images", [
    q({
      id: "wdq40-1", atom: "a-wd-responsive-type", d: 2,
      prompt: "Which text usually stays about the same size on phones and laptops?",
      options: ["Body text, around 1rem", "The main heading", "Hero titles", "Nothing; all text must scale"],
      correct: "a",
      explanation: "Phones are held closer, so body text stays readable at the same size; headings scale.",
      wrong: { b: "Large headings should shrink on phones.", c: "Hero titles scale most of all.", d: "Shrinking body text makes it unreadable." },
    }),
    q({
      id: "wdq40-2", atom: "a-wd-clamp", d: 3,
      prompt: "What does font-size: clamp(2rem, 1rem + 4vw, 4rem) do?",
      options: ["Grows with the screen width, but never below 2rem or above 4rem", "Always 2rem", "Always 4rem", "Chooses randomly between them"],
      correct: "a",
      explanation: "clamp(min, preferred, max) keeps the preferred value within limits.",
      wrong: { b: "Only on very small screens.", c: "Only on very wide screens.", d: "clamp is deterministic." },
    }),
    q({
      id: "wdq40-3", atom: "a-wd-responsive-images", d: 2,
      prompt: "Why use max-width: 100% rather than width: 100% on images?",
      options: ["Images shrink to fit but never stretch beyond their real size and blur", "max-width loads faster", "width does not work on images", "They are the same"],
      correct: "a",
      explanation: "width: 100% would also enlarge a small image beyond its resolution.",
      wrong: { b: "Neither affects download.", c: "It works, but stretches small images.", d: "They differ for images smaller than their container." },
    }),
    q({
      id: "wdq40-4", atom: "a-wd-object-fit", d: 2,
      prompt: "Product photos of different shapes must fill identical square boxes without being squashed. What do you use?",
      options: ["object-fit: cover", "object-fit: fill", "height: auto", "background-size: contain"],
      correct: "a",
      explanation: "cover keeps proportions and crops the excess.",
      wrong: { b: "fill stretches and distorts.", c: "That keeps the original shapes, so boxes differ.", d: "That is for background images, and leaves gaps." },
    }),
  ]),

  ...check("wd-l41-responsive-nav", [
    q({
      id: "wdq41-1", atom: "a-wd-responsive-navbar", d: 2,
      prompt: "A site has three short navigation links. What is usually best on phones?",
      options: ["Keep them visible, letting them wrap if needed", "Hide them behind a menu button", "Remove them on phones", "Put them in the footer only"],
      correct: "a",
      explanation: "Visible links are faster to use than a menu that must be opened.",
      wrong: { b: "An extra tap for three links is unnecessary.", c: "Phone users need navigation too.", d: "That hides them at the bottom of every page." },
    }),
    q({
      id: "wdq41-2", atom: "a-wd-hamburger", d: 3,
      prompt: "What does aria-expanded=\"false\" on a menu button tell assistive technology?",
      options: ["That the menu it controls is currently closed", "That the button is disabled", "That the menu has no links", "That the button is hidden"],
      correct: "a",
      explanation: "Screen readers announce \"Menu, button, collapsed\", and \"expanded\" once it is true.",
      wrong: { b: "Disabled is a separate state.", c: "It says nothing about the contents.", d: "Hidden is not what it means." },
    }),
    q({
      id: "wdq41-3", atom: "a-wd-hamburger", d: 3, type: "scenario",
      prompt: "A closed mobile menu is hidden with opacity: 0. What goes wrong?",
      options: ["Keyboard users still tab through the invisible links", "The links turn blue", "The page loads more slowly", "Nothing"],
      correct: "a",
      explanation: "Transparent elements are still focusable. Use display: none or the hidden attribute.",
      wrong: { b: "Colour is unaffected.", c: "Opacity does not affect loading.", d: "Focus lands on invisible links, which is confusing." },
    }),
    q({
      id: "wdq41-4", atom: "a-wd-hamburger", d: 2,
      prompt: "Which element should open a mobile menu?",
      options: ["<button>", "<div onclick>", "<span>", "<img>"],
      correct: "a",
      explanation: "A button is focusable, works with Enter and Space and is announced correctly.",
      wrong: { b: "Not keyboard accessible without extra work.", c: "No meaning or keyboard behaviour.", d: "Images are not controls." },
    }),
  ]),

  ...check("wd-l42-responsive-components", [
    q({
      id: "wdq42-1", atom: "a-wd-responsive-components", d: 3,
      prompt: "What does grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)) give you?",
      options: ["As many columns of at least 240px as fit, sharing the space, with no media query", "Exactly 240 columns", "One 240px column", "Columns that never wrap"],
      correct: "a",
      explanation: "auto-fit with minmax reflows cards from one column to many automatically.",
      wrong: { b: "240px is a minimum width.", c: "It creates as many as fit.", d: "Items move to new rows as columns are added or removed." },
    }),
    q({
      id: "wdq42-2", atom: "a-wd-prevent-overflow", d: 3,
      prompt: "Why is body { overflow-x: hidden; } a poor fix for sideways scrolling?",
      options: ["It cuts off the too-wide content instead of fixing it, so parts of the page become unreachable", "It makes the page slower", "Browsers ignore it", "It removes all scrolling"],
      correct: "a",
      explanation: "Find the element that is too wide and fix its size.",
      wrong: { b: "Speed is not the problem.", c: "Browsers apply it, which is why it hides content.", d: "Vertical scrolling still works." },
    }),
    q({
      id: "wdq42-3", atom: "a-wd-viewport-testing", d: 2,
      prompt: "Why test on a real phone as well as in the device toolbar?",
      options: ["Real touch, fonts, the on-screen keyboard and slow networks are not fully simulated", "The toolbar is inaccurate about widths", "Real phones ignore CSS", "It is not necessary"],
      correct: "a",
      explanation: "The simulation gets widths right but misses real-world behaviour.",
      wrong: { b: "Widths are accurate; behaviour is what differs.", c: "Phones apply CSS.", d: "Real devices catch real problems." },
    }),
    q({
      id: "wdq42-4", atom: "a-wd-pixel-ratio", d: 3,
      prompt: "Why can a 400px-wide photo look blurry at 400 CSS pixels on a modern phone?",
      options: ["The phone has a device pixel ratio of 2 or 3, so it needs 800 to 1200 real pixels for a sharp image", "CSS pixels are larger than inches", "Phones compress all images", "The image is in the wrong folder"],
      correct: "a",
      explanation: "High-density screens use several physical pixels per CSS pixel; srcset supplies a larger file.",
      wrong: { b: "CSS pixels are not physical units like inches.", c: "Browsers do not recompress your images.", d: "Location does not affect sharpness." },
    }),
  ]),
};
