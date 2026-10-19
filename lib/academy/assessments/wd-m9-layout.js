/**
 * ASSESSMENTS · RESPONSIVE WEB DEVELOPMENT · MODULE 9 · LAYOUT AND POSITIONING
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Never import this from anything under src/.
 * ═════════════════════════════════════════════════════════════════════════
 */

import { q, check } from "./wd-helpers.js";

export const ASSESSMENTS = {
  ...check("wd-l34-flow-display", [
    q({
      id: "wdq34-1", atom: "a-wd-normal-flow", d: 2,
      prompt: "In normal flow, how are block elements such as paragraphs arranged?",
      options: ["Stacked top to bottom, each as wide as its container", "Side by side in a row", "In a grid", "Overlapping each other"],
      correct: "a",
      explanation: "Blocks stack vertically and fill the available width.",
      wrong: { b: "That needs Flexbox or inline-block.", c: "That needs Grid.", d: "Overlap needs positioning or negative margins." },
    }),
    q({
      id: "wdq34-2", atom: "a-wd-display", d: 2,
      prompt: "What is the difference between display: none and visibility: hidden?",
      options: ["none removes the element and its space; hidden keeps an empty space", "They are identical", "hidden also hides it from search engines; none does not", "none only works on images"],
      correct: "a",
      explanation: "display: none takes the element out of the layout entirely.",
      wrong: { b: "One leaves a gap, one does not.", c: "That is not the difference.", d: "It works on any element." },
    }),
    q({
      id: "wdq34-3", atom: "a-wd-block-inline", d: 3, type: "scenario",
      prompt: "You give a plain <a> in a sentence height: 50px and it does not change. Why?",
      options: ["Inline elements ignore width and height; use inline-block", "Links cannot be styled", "Heights must be in rem", "The link needs an id"],
      correct: "a",
      explanation: "Inline boxes take their size from their text.",
      wrong: { b: "Links can be styled.", c: "Any unit is ignored on inline elements.", d: "ids do not affect sizing." },
    }),
    q({
      id: "wdq34-4", atom: "a-wd-block-inline", d: 2,
      prompt: "Which display value lets an element stay in a line of text but accept padding, width and height?",
      options: ["inline-block", "inline", "block", "none"],
      correct: "a",
      explanation: "inline-block combines inline flow with block sizing.",
      wrong: { b: "inline ignores width and height.", c: "block starts a new line.", d: "none removes it." },
    }),
  ]),

  ...check("wd-l35-flexbox", [
    q({
      id: "wdq35-1", atom: "a-wd-flex-basics", d: 2,
      prompt: "Which elements become flex items when you set display: flex on a container?",
      options: ["Its direct children only", "Every element inside it, at any depth", "Only images", "Its parent"],
      correct: "a",
      explanation: "Only direct children are laid out by the flex container.",
      wrong: { b: "Grandchildren are laid out by their own parent.", c: "Any child element becomes an item.", d: "The parent is unaffected." },
    }),
    q({
      id: "wdq35-2", atom: "a-wd-flex-axes", d: 3,
      prompt: "In a container with flex-direction: column, which property centres items horizontally?",
      options: ["align-items: center", "justify-content: center", "text-align: center", "vertical-align: middle"],
      correct: "a",
      explanation: "In a column the cross axis is horizontal, and align-items works on the cross axis.",
      wrong: { b: "justify-content now works vertically.", c: "That centres inline text, not flex items.", d: "That is for inline and table cells." },
    }),
    q({
      id: "wdq35-3", atom: "a-wd-flex-alignment", d: 2,
      prompt: "Which justify-content value puts the logo at the left edge and the menu at the right edge of a header?",
      options: ["space-between", "center", "flex-start", "stretch"],
      correct: "a",
      explanation: "space-between pushes the first and last items to the edges.",
      wrong: { b: "Both would be in the middle.", c: "Both would be on the left.", d: "stretch is an align-items value." },
    }),
    q({
      id: "wdq35-4", atom: "a-wd-flex-wrap-sizing", d: 3,
      prompt: "What does flex: 1 1 240px with flex-wrap: wrap give you?",
      options: ["Items about 240px wide that grow to share each row and wrap onto new rows when they do not fit", "Items exactly 240px, never wrapping", "Items 1px wide", "A grid of 240 columns"],
      correct: "a",
      explanation: "Grow 1, shrink 1, start at 240px, and wrapping moves extra items to the next line.",
      wrong: { b: "Grow 1 lets them get wider; wrap lets them move.", c: "The 1s are grow and shrink factors, not sizes.", d: "Flexbox makes rows, not grid columns." },
    }),
  ]),

  ...check("wd-l36-grid", [
    q({
      id: "wdq36-1", atom: "a-wd-grid-basics", d: 2,
      prompt: "What does grid-template-columns: 2fr 1fr create?",
      options: ["Two columns: the first twice as wide as the second", "Two columns of 2px and 1px", "Three equal columns", "Two rows"],
      correct: "a",
      explanation: "fr shares out free space: two parts and one part.",
      wrong: { b: "fr is a fraction, not a pixel.", c: "There are two values, so two columns.", d: "This property defines columns." },
    }),
    q({
      id: "wdq36-2", atom: "a-wd-grid-tracks", d: 2,
      prompt: "How do you make one grid item take up two columns?",
      options: ["grid-column: span 2", "width: 200%", "colspan=\"2\"", "flex: 2"],
      correct: "a",
      explanation: "span 2 makes the item cover two column tracks.",
      wrong: { b: "Width does not change grid placement.", c: "colspan is a table cell attribute.", d: "flex is for flex items." },
    }),
    q({
      id: "wdq36-3", atom: "a-wd-grid-tracks", d: 3,
      prompt: "In a three-column grid, what does grid-column: 1 / -1 do?",
      options: ["Makes the item span every column, a full-width row", "Places it in column -1 only", "Hides it", "Reverses the columns"],
      correct: "a",
      explanation: "From the first line to the last line: all columns.",
      wrong: { b: "-1 is the last line, used as the end.", c: "Nothing is hidden.", d: "Order is unchanged." },
    }),
    q({
      id: "wdq36-4", atom: "a-wd-grid-vs-flex", d: 2, type: "scenario",
      prompt: "Which job is better suited to Grid than to Flexbox?",
      options: ["A photo gallery whose rows and columns must line up", "A row of three buttons", "A logo beside a menu", "Tags flowing in a line"],
      correct: "a",
      explanation: "Two-dimensional alignment is Grid's strength.",
      wrong: { b: "One direction: Flexbox.", c: "One row: Flexbox.", d: "A flowing line: Flexbox." },
    }),
  ]),

  ...check("wd-l37-positioning", [
    q({
      id: "wdq37-1", atom: "a-wd-position", d: 3, type: "scenario",
      prompt: "A badge with position: absolute; top: 0; right: 0 appears at the top right of the whole page instead of its card. What is missing?",
      options: ["position: relative on the card", "z-index on the badge", "display: flex on the card", "A width on the badge"],
      correct: "a",
      explanation: "Absolute elements position against the nearest positioned ancestor.",
      wrong: { b: "z-index affects stacking, not the reference box.", c: "Flex does not make the card a positioning reference.", d: "Width does not change where it is placed." },
    }),
    q({
      id: "wdq37-2", atom: "a-wd-position", d: 2,
      prompt: "Which position value keeps an element in the same place on screen while the page scrolls?",
      options: ["fixed", "relative", "static", "absolute"],
      correct: "a",
      explanation: "fixed is positioned against the window.",
      wrong: { b: "relative moves with the page.", c: "static is normal flow.", d: "absolute scrolls with its ancestor." },
    }),
    q({
      id: "wdq37-3", atom: "a-wd-position", d: 2,
      prompt: "What does position: sticky; top: 0 do to a header?",
      options: ["It scrolls normally until it reaches the top, then sticks there", "It is always fixed to the bottom", "It is removed from the flow", "It cannot scroll at all"],
      correct: "a",
      explanation: "sticky is normal flow until the offset is reached.",
      wrong: { b: "top: 0 sticks it to the top.", c: "It stays in the flow until it sticks.", d: "It scrolls until it reaches its offset." },
    }),
    q({
      id: "wdq37-4", atom: "a-wd-z-index", d: 3,
      prompt: "A dropdown with z-index: 9999 still appears behind a header. Its parent has opacity: 0.95. Why?",
      options: ["The parent's opacity creates a stacking context, so the dropdown is stacked only within its parent", "9999 is too small", "z-index only works on images", "Opacity hides z-index"],
      correct: "a",
      explanation: "Inside a stacking context, a child cannot rise above things outside its parent.",
      wrong: { b: "No number escapes a stacking context.", c: "It works on positioned elements.", d: "Opacity does not hide anything; it groups." },
    }),
  ]),
};
