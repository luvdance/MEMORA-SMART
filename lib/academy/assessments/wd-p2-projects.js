/**
 * ASSESSMENTS · RESPONSIVE WEB DEVELOPMENT · PHASE 2 PROJECTS AND GATE
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Never import this from anything under src/.
 * ═════════════════════════════════════════════════════════════════════════
 */

import { q, check } from "./wd-helpers.js";

export const ASSESSMENTS = {
  ...check("wd-l51-portfolio", [
    q({
      id: "wdq51-1", atom: "a-wd-p2-port-plan", d: 2,
      prompt: "Which single rule lets a card grid show one column on phones and several on laptops?",
      options: ["grid-template-columns: repeat(auto-fit, minmax(240px, 1fr))", "grid-template-columns: 240px 240px 240px", "float: left", "display: inline"],
      correct: "a",
      explanation: "auto-fit with minmax fits as many columns as there is room for.",
      wrong: { b: "Three fixed columns overflow a phone.", c: "Floats are fragile and not responsive by themselves.", d: "Inline layout does not make a grid." },
    }),
    q({
      id: "wdq51-2", atom: "a-wd-p2-port-brief", d: 2,
      prompt: "Why is a portfolio built mobile first?",
      options: ["Employers and clients often open it first on a phone", "Laptops cannot show portfolios", "It is required by GitHub", "Phones load CSS faster"],
      correct: "a",
      explanation: "First impressions frequently happen on a phone.",
      wrong: { b: "Laptops show it too; the phone is the harder case.", c: "Unrelated.", d: "Not the reason." },
    }),
    q({
      id: "wdq51-3", atom: "a-wd-p2-port-build", d: 3, type: "scenario",
      prompt: "Your project screenshots are different shapes and the cards look uneven. What fixes it?",
      options: ["aspect-ratio on the images with object-fit: cover", "Removing the images", "height: auto", "A table"],
      correct: "a",
      explanation: "Every image gets the same box and is cropped to fill it.",
      wrong: { b: "The images are the content.", c: "That keeps the uneven shapes.", d: "Tables are not for layout." },
    }),
    q({
      id: "wdq51-4", atom: "a-wd-p2-port-build", d: 2,
      prompt: "What makes the portfolio's name scale smoothly from phone to laptop?",
      options: ["font-size with clamp()", "font-size: 56px", "text-transform", "font-weight: bold"],
      correct: "a",
      explanation: "clamp() keeps a fluid size between limits.",
      wrong: { b: "Fixed and too large for phones.", c: "Changes case, not size.", d: "Changes weight, not size." },
    }),
  ]),

  ...check("wd-l52-landing", [
    q({
      id: "wdq52-1", atom: "a-wd-p2-land-plan", d: 2,
      prompt: "Why should a landing page's hero have one clearly primary button?",
      options: ["Competing equal choices dilute the one action the page exists for", "Browsers allow only one button", "Buttons slow pages down", "It is a legal requirement"],
      correct: "a",
      explanation: "Visual hierarchy guides the visitor to the goal.",
      wrong: { b: "Any number is allowed.", c: "Buttons cost almost nothing.", d: "Not a law." },
    }),
    q({
      id: "wdq52-2", atom: "a-wd-p2-land-build", d: 2,
      prompt: "Which CSS centres a hero's content both horizontally and vertically?",
      options: ["display: grid; place-content: center;", "text-align: center; only", "vertical-align: middle;", "margin: center;"],
      correct: "a",
      explanation: "place-content on a grid centres in both directions.",
      wrong: { b: "Only horizontal, and only inline content.", c: "Works for inline and table cells, not blocks.", d: "Not valid CSS." },
    }),
    q({
      id: "wdq52-3", atom: "a-wd-p2-land-brief", d: 2,
      prompt: "What does min-height: 70vh do for the hero?",
      options: ["Makes it at least 70% of the window's height, growing if the content is taller", "Fixes it at exactly 70px", "Hides it below 70% width", "Makes it 70% of its parent's width"],
      correct: "a",
      explanation: "vh is relative to the viewport height, and min-height can grow.",
      wrong: { b: "vh is not pixels.", c: "Nothing is hidden.", d: "That would be width: 70%." },
    }),
    q({
      id: "wdq52-4", atom: "a-wd-p2-land-build", d: 3,
      prompt: "A yellow button has white text. What does the contrast check say?",
      options: ["It fails: white on yellow is far below 4.5:1, so use dark text", "It passes: yellow is bright", "Contrast does not apply to buttons", "It passes if the text is bold"],
      correct: "a",
      explanation: "Both colours are light; dark text on yellow passes easily.",
      wrong: { b: "Brightness is the problem, not the solution.", c: "It applies to all text.", d: "Bold helps only for large text, and not this much." },
    }),
  ]),

  ...check("wd-l53-dashboard", [
    q({
      id: "wdq53-1", atom: "a-wd-p2-dash-plan", d: 3,
      prompt: "A wide table inside a grid item pushes the page wider than the phone, even with overflow-x: auto on its wrapper. What fixes it?",
      options: ["min-width: 0 on the grid item", "max-width: 9999px", "Removing the wrapper", "display: inline on the table"],
      correct: "a",
      explanation: "Grid items default to min-width: auto and refuse to shrink below their content.",
      wrong: { b: "Raises the limit instead of allowing shrinking.", c: "The wrapper is what scrolls.", d: "Does not fix the grid item's minimum." },
    }),
    q({
      id: "wdq53-2", atom: "a-wd-p2-dash-brief", d: 2,
      prompt: "On a phone, why put the dashboard's main content above its navigation?",
      options: ["The numbers are what the owner opens it to see; navigation can follow", "Navigation is not allowed on phones", "Grids cannot place nav first", "It loads faster"],
      correct: "a",
      explanation: "Priority on a small screen goes to the content that matters most.",
      wrong: { b: "Navigation is still there, lower down.", c: "Grid can place it anywhere.", d: "Order does not change load time." },
    }),
    q({
      id: "wdq53-3", atom: "a-wd-p2-dash-build", d: 2,
      prompt: "Why use two breakpoints (600px and 1024px) here?",
      options: ["The stat cards have room for two columns long before the sidebar fits", "Every page needs exactly two", "Browsers require them", "To match two phone models"],
      correct: "a",
      explanation: "Each component changes where its content needs it.",
      wrong: { b: "There is no fixed number.", c: "Browsers do not.", d: "Breakpoints follow content, not devices." },
    }),
    q({
      id: "wdq53-4", atom: "a-wd-p2-dash-build", d: 2,
      prompt: "Which property defines named regions such as header, nav and main in a grid?",
      options: ["grid-template-areas", "grid-gap", "flex-direction", "z-index"],
      correct: "a",
      explanation: "Areas are drawn as strings; elements join them with grid-area.",
      wrong: { b: "gap sets spacing.", c: "That is Flexbox.", d: "That sets stacking." },
    }),
  ]),

  ...check("wd-l54-product-site", [
    q({
      id: "wdq54-1", atom: "a-wd-p2-prod-plan", d: 2,
      prompt: "How do you make square product images from photos of different shapes?",
      options: ["aspect-ratio: 1 with object-fit: cover", "width: 100% only", "height: 100px only", "Rotating them"],
      correct: "a",
      explanation: "A square box and a crop that fills it.",
      wrong: { b: "Keeps the original shape.", c: "Squashes without object-fit.", d: "Irrelevant." },
    }),
    q({
      id: "wdq54-2", atom: "a-wd-p2-prod-build", d: 3,
      prompt: "With grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)) inside a 343px container with a 16px gap, how many columns are there?",
      options: ["2", "1", "3", "4"],
      correct: "a",
      explanation: "Two columns need 160 + 16 + 160 = 336px, which fits in 343; three would need 512.",
      wrong: { b: "There is room for two.", c: "Three need 512px.", d: "Far too many for 343px." },
    }),
    q({
      id: "wdq54-3", atom: "a-wd-p2-prod-build", d: 2,
      prompt: "Why does each product card need position: relative?",
      options: ["So the absolutely positioned badge is placed on that card's corner", "To make the card sticky", "To make the image square", "To centre the price"],
      correct: "a",
      explanation: "Absolute elements position against the nearest positioned ancestor.",
      wrong: { b: "Sticky is a different value.", c: "That is aspect-ratio.", d: "Unrelated." },
    }),
    q({
      id: "wdq54-4", atom: "a-wd-p2-prod-brief", d: 2,
      prompt: "Why make the shop header sticky?",
      options: ["The logo and navigation stay within reach while browsing a long product list", "It makes the page shorter", "Search engines require it", "It hides the header"],
      correct: "a",
      explanation: "Shoppers scroll a lot; navigation stays available.",
      wrong: { b: "Page length is unchanged.", c: "Not required.", d: "It keeps it visible." },
    }),
  ]),

  ...check("wd-l55-mobile-nav", [
    q({
      id: "wdq55-1", atom: "a-wd-p2-nav-plan", d: 3,
      prompt: "Why style the current page's link with a[aria-current=\"page\"] rather than a separate .active class?",
      options: ["One attribute drives both what screen readers hear and what everyone sees, so they cannot disagree", "Classes do not work in nav", "aria-current is faster", "It hides the link"],
      correct: "a",
      explanation: "A single source of truth.",
      wrong: { b: "Classes work; the point is consistency.", c: "Speed is unaffected.", d: "Nothing is hidden." },
    }),
    q({
      id: "wdq55-2", atom: "a-wd-p2-nav-brief", d: 2,
      prompt: "Why must the current page be marked by more than colour?",
      options: ["Colour alone is not seen by everyone, including colour-blind users", "Colours cannot be used on links", "It is faster", "Browsers ignore colour"],
      correct: "a",
      explanation: "Add an underline, border or weight change as well.",
      wrong: { b: "Colour is fine as one of the signals.", c: "Unrelated.", d: "Browsers show colour." },
    }),
    q({
      id: "wdq55-3", atom: "a-wd-p2-nav-build", d: 2,
      prompt: "What does the given app.js change when Menu is pressed?",
      options: ["It toggles the is-open class on the nav and updates aria-expanded", "It deletes the nav", "It changes the page", "It reloads the CSS"],
      correct: "a",
      explanation: "CSS shows or hides the nav based on is-open.",
      wrong: { b: "The nav stays in the page.", c: "No navigation happens.", d: "CSS is not reloaded." },
    }),
    q({
      id: "wdq55-4", atom: "a-wd-p2-nav-build", d: 2,
      prompt: "What should a :focus-visible style on navigation links look like?",
      options: ["A clear, high-contrast outline offset from the link", "outline: none", "A colour change of one shade", "Nothing; links do not receive focus"],
      correct: "a",
      explanation: "Keyboard users must see where they are.",
      wrong: { b: "Removes focus visibility.", c: "Too subtle to see.", d: "Links are focusable." },
    }),
  ]),

  ...check("wd-l56-p2-gate", [
    q({
      id: "wdq56-1", atom: "a-wd-p2-gate-brief", d: 2,
      prompt: "At which widths does the Phase 2 gate check your page?",
      options: ["375px, 768px and 1280px", "Only 1280px", "Only 375px", "1920px only"],
      correct: "a",
      explanation: "Phone, tablet and laptop.",
      wrong: { b: "Laptops are one of three.", c: "Phones are one of three.", d: "Not tested." },
    }),
    q({
      id: "wdq56-2", atom: "a-wd-p2-gate-build", d: 3, type: "scenario",
      prompt: "Your gate page scrolls sideways at 375px only when the menu is open. Where do you look first?",
      options: ["The open menu's width, padding or links", "The footer", "The page title", "The fonts"],
      correct: "a",
      explanation: "The overflow appears with the menu, so the menu causes it.",
      wrong: { b: "The footer does not change when the menu opens.", c: "Titles are not displayed in the page.", d: "Fonts are unchanged." },
    }),
    q({
      id: "wdq56-3", atom: "a-wd-p2-gate-build", d: 2,
      prompt: "Which order of work makes the gate easiest?",
      options: ["Get the phone layout right first, then add each breakpoint one at a time", "Write all media queries first", "Style the laptop, then shrink it", "Start with colours and finish with layout"],
      correct: "a",
      explanation: "Mobile first: simple defaults, then additions.",
      wrong: { b: "Queries need a base to build on.", c: "That is desktop first, which is harder to undo.", d: "Layout problems surface late." },
    }),
    q({
      id: "wdq56-4", atom: "a-wd-p2-gate-review", d: 2,
      prompt: "After passing checks at three widths, what else should you test?",
      options: ["The widths in between, by dragging slowly through them", "Nothing", "Only print", "Only 4K screens"],
      correct: "a",
      explanation: "Real screens come in every width.",
      wrong: { b: "In-between widths often break.", c: "Print is a separate concern.", d: "Rare compared with in-between sizes." },
    }),
  ]),
};
