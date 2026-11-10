/**
 * ASSESSMENTS · UI/UX DESIGN · MODULE 9 · RESPONSIVE DESIGN AND CROSS-PLATFORM INTERFACES
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Never import this from anything under src/.
 * ═════════════════════════════════════════════════════════════════════════
 */

import { q, check } from "./ux-helpers.js";

export const ASSESSMENTS = {
  ...check("ux-l37-responsive", [
    q({
      id: "uxq37-1", atom: "a-ux-responsive", d: 2,
      prompt: "What is responsive design?",
      options: ["One interface that adapts its layout to the screen it is viewed on", "A separate website for every device", "A design that responds to voice commands", "A design that loads instantly"],
      correct: "a",
      explanation: "Fluid layouts, flexible media and breakpoints, from one design.",
      wrong: { b: "That is closer to adaptive or separate sites.", c: "Unrelated.", d: "Performance is a separate concern." },
    }),
    q({
      id: "uxq37-2", atom: "a-ux-responsive-adaptive", d: 2,
      prompt: "How does adaptive design differ from responsive design?",
      options: ["It uses several fixed layouts and serves the nearest one, instead of one fluid layout", "It only works on phones", "It has no breakpoints", "It cannot use images"],
      correct: "a",
      explanation: "Adaptive snaps between fixed layouts; responsive flows.",
      wrong: { b: "It works on any device.", c: "It has fixed layouts at set widths.", d: "Images are fine." },
    }),
    q({
      id: "uxq37-3", atom: "a-ux-mobile-desktop-first", d: 3, type: "scenario",
      prompt: "82% of a site's visitors use phones. Which approach fits best?",
      options: ["Mobile first: design the phone layout, then expand", "Desktop first: shrink the desktop layout", "Desktop only", "Design for tablets first"],
      correct: "a",
      explanation: "Start where your users are; it also forces priorities.",
      wrong: { b: "Shrinking keeps desktop priorities and tiny targets.", c: "Ignores most users.", d: "Tablets are a minority here." },
    }),
    q({
      id: "uxq37-4", atom: "a-ux-breakpoints", d: 2,
      prompt: "How should breakpoints be chosen?",
      options: ["Where the content needs the layout to change", "To match this year's most popular phone exactly", "At random", "Only at 1920px"],
      correct: "a",
      explanation: "Devices change; content-driven breakpoints last.",
      wrong: { b: "Devices change every year.", c: "Random breakpoints break layouts.", d: "One breakpoint at desktop does not help phones." },
    }),
    q({
      id: "uxq37-5", atom: "a-ux-viewports", d: 3,
      prompt: "A phone has 1080 physical pixels across and a device pixel ratio of 3. About how wide is its viewport in CSS pixels?",
      options: ["360", "1080", "3240", "120"],
      correct: "a",
      explanation: "1080 ÷ 3 = 360 CSS pixels.",
      wrong: { b: "That is physical pixels.", c: "Multiplied instead of divided.", d: "Divided by 9." },
    }),
  ]),

  ...check("ux-l38-fluid", [
    q({
      id: "uxq38-1", atom: "a-ux-fluid-layouts", d: 2,
      prompt: "Why give a fluid text column a maximum width?",
      options: ["So lines do not become uncomfortably long on wide screens", "To make the page load faster", "Because browsers require it", "To hide content on desktops"],
      correct: "a",
      explanation: "Comfortable line length is about 45 to 75 characters.",
      wrong: { b: "Unrelated to speed.", c: "No such requirement.", d: "Nothing is hidden." },
    }),
    q({
      id: "uxq38-2", atom: "a-ux-fixed-flexible", d: 2,
      prompt: "Which should stay fixed rather than flexible?",
      options: ["The minimum size of a touch target", "Column widths", "Image widths", "Side padding on large screens"],
      correct: "a",
      explanation: "A target must stay at least 44px whatever the screen.",
      wrong: { b: "Columns should flex.", c: "Images should scale.", d: "Padding can grow with space." },
    }),
    q({
      id: "uxq38-3", atom: "a-ux-responsive-grids", d: 2,
      prompt: "A card spans 4 columns at every size, on a 4-, 8- and 12-column grid. How many cards per row on each?",
      options: ["One on phones, two on tablets, three on desktops", "Four everywhere", "Three everywhere", "One everywhere"],
      correct: "a",
      explanation: "4 of 4, 4 of 8 and 4 of 12 columns.",
      wrong: { b: "Spanning 4 columns gives fewer per row.", c: "Only on the 12-column desktop grid.", d: "Only on the phone grid." },
    }),
    q({
      id: "uxq38-4", atom: "a-ux-flexible-type", d: 3,
      prompt: "What does font-size: clamp(28px, 1.45rem + 1.8vw, 48px) do?",
      options: ["Scales with the viewport but never below 28px or above 48px", "Always uses 28px", "Always uses 48px", "Picks a random size between 28 and 48"],
      correct: "a",
      explanation: "Minimum, preferred (fluid) and maximum.",
      wrong: { b: "Only on narrow screens.", c: "Only on wide screens.", d: "It is deterministic." },
    }),
  ]),

  ...check("ux-l39-nav-touch", [
    q({
      id: "uxq39-1", atom: "a-ux-responsive-navigation", d: 2,
      prompt: "What must a mobile menu button do for screen reader users?",
      options: ["Announce whether the menu is open, for example with aria-expanded", "Play a sound", "Be hidden from them", "Use only an icon with no name"],
      correct: "a",
      explanation: "aria-expanded tells assistive technology the state.",
      wrong: { b: "Sounds are not the mechanism.", c: "They need navigation too.", d: "An unnamed button is unusable." },
    }),
    q({
      id: "uxq39-2", atom: "a-ux-device-layouts", d: 3, type: "scenario",
      prompt: "On phones, twenty filters stack above the product list. What is better?",
      options: ["Products first, with a Filter button that opens the filters", "Smaller filters on top", "No filters on phones", "Filters at the very bottom"],
      correct: "a",
      explanation: "Phone order follows priority, not desktop position.",
      wrong: { b: "Still buries the products.", c: "Phone users need filters.", d: "Few would find them." },
    }),
    q({
      id: "uxq39-3", atom: "a-ux-responsive-images", d: 2,
      prompt: "Why serve smaller image files to phones?",
      options: ["Large files waste data and slow loading, especially where data is expensive", "Phones cannot display large images", "Smaller images are sharper", "It is required by law"],
      correct: "a",
      explanation: "srcset lets the browser choose a suitable size.",
      wrong: { b: "They can, at a cost.", c: "Not necessarily.", d: "No such law." },
    }),
    q({
      id: "uxq39-4", atom: "a-ux-touch-targets", d: 2,
      prompt: "What minimum touch target does Apple recommend?",
      options: ["44 × 44 points", "20 × 20 points", "100 × 100 points", "12 × 12 points"],
      correct: "a",
      explanation: "Material Design recommends 48 × 48 dp.",
      wrong: { b: "Too small for fingers.", c: "Far larger than needed.", d: "Far too small." },
    }),
  ]),

  ...check("ux-l40-platforms", [
    q({
      id: "uxq40-1", atom: "a-ux-platform-considerations", d: 2,
      prompt: "Which differs between Android and iOS?",
      options: ["How back navigation works", "The need for readable text", "The need for clear labels", "Whether users have goals"],
      correct: "a",
      explanation: "Android has a system back gesture; iOS uses a top-left back button and an edge swipe.",
      wrong: { b: "Universal.", c: "Universal.", d: "Universal." },
    }),
    q({
      id: "uxq40-2", atom: "a-ux-material", d: 2,
      prompt: "What minimum touch target does Material Design recommend?",
      options: ["48 × 48 dp", "32 × 32 dp", "24 × 24 dp", "64 × 64 dp"],
      correct: "a",
      explanation: "Material uses an 8dp grid and 48dp targets.",
      wrong: { b: "Below the recommendation.", c: "The WCAG AA minimum with spacing, not Material's.", d: "Larger than needed." },
    }),
    q({
      id: "uxq40-3", atom: "a-ux-apple-hig", d: 2,
      prompt: "What does Dynamic Type do on iOS?",
      options: ["Lets text grow or shrink with the user's text size setting", "Animates text", "Translates text", "Changes the font every day"],
      correct: "a",
      explanation: "Designs must accommodate larger text sizes.",
      wrong: { b: "Not animation.", c: "Not translation.", d: "Not what it does." },
    }),
    q({
      id: "uxq40-4", atom: "a-ux-cross-platform", d: 3,
      prompt: "Across Android, iOS and the web, what should stay consistent?",
      options: ["Brand, content, features, terminology and information architecture", "System controls such as date pickers", "Back navigation behaviour", "The system font for body text"],
      correct: "a",
      explanation: "Keep the product consistent; adapt platform conventions.",
      wrong: { b: "Use each platform's native controls.", c: "Follow each platform.", d: "Body fonts often follow the platform." },
    }),
  ]),
};
