/**
 * ASSESSMENTS · REACT DEVELOPMENT · MODULE 2 · COMPONENTS, PROPS AND REUSABLE UI
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Never import this from anything under src/.
 * ═════════════════════════════════════════════════════════════════════════
 */

import { q, check } from "./rx-helpers.js";

export const ASSESSMENTS = {
  ...check("rx-l14-components", [
    q({ id: "rxq14-1", atom: "a-rx-function-components", d: 1, prompt: "What is a React function component?", options: ["A capitalised function that returns JSX", "A CSS class", "An HTML file", "A function that must return a string"], correct: "a",
      explanation: "Capital letter, returns JSX (or null).",
      wrong: { b: "Unrelated.", c: "Components live in .jsx files.", d: "It returns JSX." } }),
    q({ id: "rxq14-2", atom: "a-rx-naming-files", d: 2, prompt: "Where would you expect to find a reusable CourseCard component?", options: ["src/components/CourseCard.jsx", "public/coursecard.html", "package.json", "src/main.jsx"], correct: "a",
      explanation: "PascalCase file named after the component, in components/.",
      wrong: { b: "public holds static files.", c: "Configuration.", d: "main.jsx only starts the app." } }),
    q({ id: "rxq14-3", atom: "a-rx-import-export", d: 3, prompt: "format.js has export function naira(). You write import naira from \"./format.js\". What happens when you call naira(5)?", options: ["An error: naira is undefined, because there is no default export", "It works", "It imports every export", "Vite converts it automatically"], correct: "a",
      explanation: "Named exports need braces: import { naira }.",
      wrong: { b: "The default export does not exist.", c: "That would be import * as format.", d: "Vite reports the problem; it does not rewrite your code." } }),
    q({ id: "rxq14-4", atom: "a-rx-import-export", d: 2, prompt: "How many default exports can a file have?", options: ["At most one", "Any number", "Exactly two", "None; only named exports exist"], correct: "a",
      explanation: "One default, many named.",
      wrong: { b: "Only one default.", c: "Only one.", d: "Default exports exist." } }),
  ]),

  ...check("rx-l15-props", [
    q({ id: "rxq15-1", atom: "a-rx-nesting", d: 3, prompt: "Why should you not define a component inside another component's function?", options: ["It is recreated on every render, which resets its state", "It is not allowed by JavaScript", "It makes the bundle bigger", "React cannot render it at all"], correct: "a",
      explanation: "Define components at the top level of a module.",
      wrong: { b: "JavaScript allows nested functions.", c: "Size is not the issue.", d: "It renders, but loses state." } }),
    q({ id: "rxq15-2", atom: "a-rx-props", d: 2, prompt: "Which passes the number 16 as a prop?", options: ["weeks={16}", "weeks=\"16\"", "weeks=16", "{weeks: 16}"], correct: "a",
      explanation: "Non-string values go in braces.",
      wrong: { b: "That is the string \"16\".", c: "Not valid JSX.", d: "Not attribute syntax." } }),
    q({ id: "rxq15-3", atom: "a-rx-props", d: 2, prompt: "Which way does data flow through props?", options: ["From parent to child", "From child to parent", "Between siblings directly", "From the browser to the server"], correct: "a",
      explanation: "One-way data flow.",
      wrong: { b: "Children cannot set their parents' props.", c: "Siblings share via their parent.", d: "Unrelated." } }),
    q({ id: "rxq15-4", atom: "a-rx-props-defaults", d: 3, prompt: "function Tag({ tone = \"info\" }). Which call makes tone \"info\"?", options: ["<Tag />", "<Tag tone={null} />", "<Tag tone=\"\" />", "<Tag tone=\"warn\" />"], correct: "a",
      explanation: "Defaults apply only when the prop is undefined.",
      wrong: { b: "null is a value; the default is not used.", c: "\"\" is a value.", d: "That passes warn." } }),
  ]),

  ...check("rx-l16-reusable-ui", [
    q({ id: "rxq16-1", atom: "a-rx-children", d: 2, prompt: "In <Card><p>Hi</p></Card>, how does Card receive the <p>?", options: ["As the children prop", "As props.content", "It cannot", "Through a global variable"], correct: "a",
      explanation: "Content between the tags is props.children.",
      wrong: { b: "The name is children.", c: "It can.", d: "Unrelated." } }),
    q({ id: "rxq16-2", atom: "a-rx-data-presentation", d: 2, prompt: "What should a presentational CourseCard contain?", options: ["Only JSX built from its props", "The full list of courses", "A fetch call to the server", "Hard-coded course details"], correct: "a",
      explanation: "Data comes in through props; the card only presents it.",
      wrong: { b: "That belongs to a parent or a data module.", c: "Data loading belongs elsewhere.", d: "Then it can show only one course." } }),
    q({ id: "rxq16-3", atom: "a-rx-reusable-ui", d: 3, prompt: "Which marks the current page's link for screen readers?", options: ["aria-current=\"page\"", "className=\"current\" only", "a bold font", "disabled"], correct: "a",
      explanation: "aria-current is announced; you can style it too.",
      wrong: { b: "A class is visual only.", c: "Visual only.", d: "Links are not disabled." } }),
    q({ id: "rxq16-4", atom: "a-rx-reusable-ui", d: 2, prompt: "{subtitle && <p>{subtitle}</p>} renders what when subtitle is undefined?", options: ["Nothing", "An empty <p>", "The word undefined", "An error"], correct: "a",
      explanation: "undefined renders nothing.",
      wrong: { b: "The <p> is not created.", c: "undefined is not shown.", d: "It is valid." } }),
  ]),

  ...check("rx-l17-composition", [
    q({ id: "rxq17-1", atom: "a-rx-responsibilities", d: 2, prompt: "Which is a sign a component should be split?", options: ["Its JSX has comments labelling separate sections such as {/* Sidebar */}", "It is 15 lines long", "It has a prop", "It returns a fragment"], correct: "a",
      explanation: "Labelled sections are components waiting to be extracted.",
      wrong: { b: "Small components are fine.", c: "Normal.", d: "Normal." } }),
    q({ id: "rxq17-2", atom: "a-rx-composition", d: 2, prompt: "SuccessAlert and ErrorAlert differ only in colour and icon. What is the better design?", options: ["One Alert component with a tone prop", "Add a WarningAlert copy too", "Use inline styles in each", "Put both in one file and leave them"], correct: "a",
      explanation: "One component; the prop holds what varies.",
      wrong: { b: "More duplication.", c: "Still duplicated.", d: "Still duplicated." } }),
    q({ id: "rxq17-3", atom: "a-rx-configurable", d: 3, prompt: "Which prop design keeps a configurable component's design consistent?", options: ["variant=\"compact\"", "marginTop={7} arrowColor=\"#f00\"", "style={anything}", "className={anything}"], correct: "a",
      explanation: "Props should describe purpose, not raw styles.",
      wrong: { b: "Raw styles let every caller invent a design.", c: "Same problem.", d: "Same problem." } }),
    q({ id: "rxq17-4", atom: "a-rx-composition", d: 2, prompt: "When the content inside a component varies a lot, what keeps it reusable?", options: ["Composition: accept children (or JSX props) and stay out of the details", "A flag prop for every possible layout", "Copying it for each use", "Inline styles"], correct: "a",
      explanation: "Let the caller provide the content.",
      wrong: { b: "Grows into an unmaintainable switch.", c: "Duplication.", d: "Unrelated." } }),
  ]),

  ...check("rx-l18-m2-project", [
    q({ id: "rxq18-1", atom: "a-rx-m2-project", d: 2, prompt: "In the catalogue, how does the instructor's name reach InstructorBadge?", options: ["courses.js → App → CourseCard (course prop) → InstructorBadge (name prop)", "InstructorBadge imports courses.js", "The browser passes it", "Through CSS"], correct: "a",
      explanation: "Data flows down through props.",
      wrong: { b: "Then the badge is tied to that data file.", c: "Unrelated.", d: "Unrelated." } }),
    q({ id: "rxq18-2", atom: "a-rx-m2-project", d: 2, prompt: "Why does each Enroll button have aria-label \"Enroll in React\" and not just the visible \"Enroll\"?", options: ["Screen reader users hear a list of links and buttons; four identical \"Enroll\" buttons are meaningless", "Search engines need it", "It changes the colour", "It is required by React"], correct: "a",
      explanation: "Accessible names must make sense out of context.",
      wrong: { b: "This is for people using assistive technology.", c: "It is not visual.", d: "React does not require it." } }),
    q({ id: "rxq18-3", atom: "a-rx-m2-project", d: 3, prompt: "Why is CatalogLayout written to take children?", options: ["So it can wrap any content, not only course cards", "Because layouts cannot take other props", "It makes it faster", "To avoid using keys"], correct: "a",
      explanation: "Composition keeps layouts reusable.",
      wrong: { b: "It also takes title.", c: "Unrelated.", d: "Keys are still needed in the list." } }),
    q({ id: "rxq18-4", atom: "a-rx-m2-project", d: 2, prompt: "Where does the course data for the catalogue live?", options: ["In src/data/courses.js, separate from the components that present it", "Inside CourseCard", "Inside EnrollButton", "In index.html"], correct: "a",
      explanation: "Separate data from presentation.",
      wrong: { b: "Then it can show one course only.", c: "Unrelated.", d: "Not a data module." } }),
  ]),
};
