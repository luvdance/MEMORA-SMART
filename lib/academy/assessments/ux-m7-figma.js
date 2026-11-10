/**
 * ASSESSMENTS · UI/UX DESIGN · MODULE 7 · INTRODUCTION TO FIGMA
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Never import this from anything under src/.
 * ═════════════════════════════════════════════════════════════════════════
 */

import { q, check } from "./ux-helpers.js";

export const ASSESSMENTS = {
  ...check("ux-l28-figma-start", [
    q({
      id: "uxq28-1", atom: "a-ux-figma-intro", d: 2,
      prompt: "What is FigJam used for?",
      options: ["Whiteboarding: research synthesis, journey maps and flows", "Writing production code", "Hosting websites", "Editing photos professionally"],
      correct: "a",
      explanation: "FigJam is Figma's collaborative whiteboard.",
      wrong: { b: "Not a code tool.", c: "Not a host.", d: "Not a photo editor." },
    }),
    q({
      id: "uxq28-2", atom: "a-ux-figma-account", d: 1,
      prompt: "Which Figma plan is enough for this course?",
      options: ["The free Starter plan (or the free Education plan for students)", "Only the Enterprise plan", "A paid plan per lesson", "No plan; Figma needs no account"],
      correct: "a",
      explanation: "Starter covers design and prototyping; Education adds more for free.",
      wrong: { b: "Far more than needed.", c: "No such pricing.", d: "An account is required." },
    }),
    q({
      id: "uxq28-3", atom: "a-ux-figma-workspace", d: 2,
      prompt: "Where in Figma do you set a frame's size, fill, stroke and Auto Layout?",
      options: ["The Design tab of the right sidebar", "The layers panel", "The comments panel", "The file menu"],
      correct: "a",
      explanation: "The right sidebar's Design tab holds layer properties.",
      wrong: { b: "Layers shows the tree, not properties.", c: "Comments are feedback.", d: "File-level actions only." },
    }),
    q({
      id: "uxq28-4", atom: "a-ux-figma-files-frames", d: 3, type: "scenario",
      prompt: "A developer opens your file and finds frames called \"Frame 12\" and layers called \"Rectangle 4\". Why does this matter?",
      options: ["They cannot tell what anything is, which slows every task and causes mistakes", "It does not matter; names are invisible", "Figma will refuse to export", "It makes the file larger"],
      correct: "a",
      explanation: "Naming is part of professional handoff.",
      wrong: { b: "Names are visible in inspect and code.", c: "Export still works.", d: "File size is unaffected." },
    }),
  ]),

  ...check("ux-l29-figma-tools", [
    q({
      id: "uxq29-1", atom: "a-ux-figma-shapes-text", d: 2,
      prompt: "Which text resizing mode suits a paragraph?",
      options: ["Auto height: fixed width, grows downwards", "Auto width: grows sideways forever", "Fixed size: may cut off text", "Scale"],
      correct: "a",
      explanation: "Paragraphs need a set width and room to grow down.",
      wrong: { b: "A paragraph would become one long line.", c: "Long text gets clipped.", d: "Not a text resizing mode." },
    }),
    q({
      id: "uxq29-2", atom: "a-ux-figma-images-colour", d: 2,
      prompt: "In Figma, which image fill mode crops the image to cover the whole shape?",
      options: ["Fill", "Fit", "Tile", "Stroke"],
      correct: "a",
      explanation: "Fill covers the shape; developers write object-fit: cover.",
      wrong: { b: "Fit shows the whole image, possibly with gaps.", c: "Tile repeats it.", d: "Stroke is a border." },
    }),
    q({
      id: "uxq29-3", atom: "a-ux-figma-groups-layers", d: 2,
      prompt: "Why use a frame rather than a group for a card?",
      options: ["Frames have their own size, fill, clipping, constraints and Auto Layout; groups do not", "Groups cannot be moved", "Frames are always smaller", "Groups cannot contain text"],
      correct: "a",
      explanation: "A group is just a bundle; a frame is a container.",
      wrong: { b: "Groups move fine.", c: "Size depends on content.", d: "They can." },
    }),
    q({
      id: "uxq29-4", atom: "a-ux-figma-constraints", d: 3,
      prompt: "A \"New\" badge must stay in the top-right corner of a card at any width. Which constraints does it need?",
      options: ["Top and Right", "Left and Top", "Centre and Centre", "Scale and Scale"],
      correct: "a",
      explanation: "Pinned to the top and right edges, it follows that corner.",
      wrong: { b: "It would stay at the left.", c: "It would stay in the middle.", d: "It would move and grow proportionally." },
    }),
    q({
      id: "uxq29-5", atom: "a-ux-figma-constraints", d: 2,
      prompt: "In Auto Layout, what does \"Hug contents\" mean for a button?",
      options: ["The button is as wide as its label plus padding", "The button stretches to fill its parent", "The button has a fixed width", "The button is hidden"],
      correct: "a",
      explanation: "Hug wraps the content; Fill stretches.",
      wrong: { b: "That is Fill container.", c: "That is Fixed.", d: "Unrelated." },
    }),
  ]),

  ...check("ux-l30-components-autolayout", [
    q({
      id: "uxq30-1", atom: "a-ux-figma-components", d: 2,
      prompt: "You change the colour of a main component. What happens to its instances?",
      options: ["They all update, except where an instance has overridden that property", "Nothing", "They are deleted", "Only the first instance updates"],
      correct: "a",
      explanation: "Instances inherit from the main component.",
      wrong: { b: "The link is the whole point.", c: "Instances stay.", d: "All linked instances update." },
    }),
    q({
      id: "uxq30-2", atom: "a-ux-figma-properties", d: 2,
      prompt: "Which component property shows or hides an icon in a button?",
      options: ["A boolean property", "A text property", "A grid style", "An export setting"],
      correct: "a",
      explanation: "Booleans toggle a layer's visibility.",
      wrong: { b: "Text edits a label.", c: "Unrelated to components.", d: "Unrelated." },
    }),
    q({
      id: "uxq30-3", atom: "a-ux-figma-variants", d: 3,
      prompt: "A button has Type (Primary, Secondary), Size (Small, Large) and State (Default, Hover, Disabled). How many variants can its component set hold?",
      options: ["12", "7", "3", "6"],
      correct: "a",
      explanation: "2 × 2 × 3 = 12.",
      wrong: { b: "That adds the options instead of multiplying.", c: "That is the number of properties.", d: "That ignores one property." },
    }),
    q({
      id: "uxq30-4", atom: "a-ux-figma-autolayout", d: 2,
      prompt: "Auto Layout is the same model as which CSS layout?",
      options: ["Flexbox", "Floats", "Tables", "Absolute positioning"],
      correct: "a",
      explanation: "Direction, gap, padding and alignment map onto flexbox.",
      wrong: { b: "An older, different model.", c: "Different model.", d: "That is closer to constraints." },
    }),
  ]),

  ...check("ux-l31-figma-systems", [
    q({
      id: "uxq31-1", atom: "a-ux-figma-grids", d: 2,
      prompt: "What does a column layout grid set?",
      options: ["The number of columns, the gutter between them and the outer margin", "The fonts", "The prototype transitions", "The export format"],
      correct: "a",
      explanation: "Count, gutter and margin define the grid.",
      wrong: { b: "Text styles do that.", c: "Prototype settings do that.", d: "Export settings do that." },
    }),
    q({
      id: "uxq31-2", atom: "a-ux-figma-styles-variables", d: 3,
      prompt: "What do variable modes let you do?",
      options: ["Give the same variables different values, such as Light and Dark, and switch them all at once", "Animate variables", "Export variables as images", "Lock variables from editing"],
      correct: "a",
      explanation: "Modes are how themes like dark mode are designed.",
      wrong: { b: "Not what modes do.", c: "Variables are values, not images.", d: "Permissions are separate." },
    }),
    q({
      id: "uxq31-3", atom: "a-ux-figma-libraries", d: 2,
      prompt: "What is a Figma library?",
      options: ["A file whose components, styles and variables are published for other files to use", "A list of fonts", "Figma's help pages", "A folder of exported images"],
      correct: "a",
      explanation: "Libraries share a design system across files.",
      wrong: { b: "Fonts are separate.", c: "Not documentation.", d: "Exports are files, not libraries." },
    }),
    q({
      id: "uxq31-4", atom: "a-ux-figma-collaboration", d: 2,
      prompt: "Which export format is best for an icon?",
      options: ["SVG", "JPG", "A screenshot in a Word document", "GIF"],
      correct: "a",
      explanation: "SVG stays sharp at any size and can be recoloured in code.",
      wrong: { b: "Blurs sharp edges and has no transparency.", c: "Blurry and not editable.", d: "Limited colours, not for icons." },
    }),
  ]),

  ...check("ux-l32-landing-page", [
    q({
      id: "uxq32-1", atom: "a-ux-landing-anatomy", d: 2,
      prompt: "What is a landing page's single job?",
      options: ["To get a specific visitor to take one action", "To list every feature of the company", "To show the company history", "To collect as many links as possible"],
      correct: "a",
      explanation: "Everything on it should push toward one action.",
      wrong: { b: "Too broad; loses focus.", c: "Not its purpose.", d: "Many links dilute the action." },
    }),
    q({
      id: "uxq32-2", atom: "a-ux-landing-anatomy", d: 2,
      prompt: "Which hero headline is strongest?",
      options: ["\"Learn a digital skill in 20 minutes a day\"", "\"Welcome to our website\"", "\"Memora Learn v2.0\"", "\"The best platform\""],
      correct: "a",
      explanation: "It states a concrete benefit.",
      wrong: { b: "Says nothing.", c: "A version number is not a benefit.", d: "An empty claim." },
    }),
    q({
      id: "uxq32-3", atom: "a-ux-landing-lab", d: 3,
      prompt: "Why should only one element on a landing page use the primary button style?",
      options: ["So the main action is unmistakable", "Primary buttons are expensive", "Browsers allow only one", "It makes the page load faster"],
      correct: "a",
      explanation: "Hierarchy: one dominant action per screen.",
      wrong: { b: "Not a cost issue.", c: "No such limit.", d: "Unrelated." },
    }),
    q({
      id: "uxq32-4", atom: "a-ux-landing-lab", d: 2,
      prompt: "How should three feature cards behave on a phone?",
      options: ["Stack in one column", "Stay in three narrow columns", "Disappear", "Scroll sideways"],
      correct: "a",
      explanation: "Three columns are unreadably narrow on a phone.",
      wrong: { b: "Too narrow to read.", c: "Content should not vanish.", d: "Sideways scrolling is a failure." },
    }),
  ]),
};
