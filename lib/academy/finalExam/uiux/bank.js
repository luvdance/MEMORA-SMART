/**
 * EXAM BANK — UI/UX DESIGN
 *
 * SERVER ONLY. Every item carries its answer. Nothing in src/ may import this.
 *
 * Difficulty 3–4 is "core", 5 is "advanced", per ./blueprint.js. Each domain
 * holds 8 core and 3 advanced items: twice what one paper draws of the core
 * and three times the advanced. Options are shuffled per paper, so the order
 * written here is never the order a candidate sees.
 *
 * Calculation items were worked from the course's formulas: WCAG contrast
 * thresholds, completion rate, the SUS formula, RICE, and pricing with
 * contingency.
 */

const mcq = (o) => ({ type: "mcq", ...o });
const opts = (a, b, c, d) => [
  { id: "a", text: a },
  { id: "b", text: b },
  { id: "c", text: c },
  { id: "d", text: d },
];

export const ITEMS = [
  /* ═══════════════ u1 · FOUNDATIONS ═══════════════ */
  mcq({
    id: "ux-x1-001", domain: "u1-foundations", difficulty: 3, topic: "ui-vs-ux",
    skill: "UI versus UX",
    prompt: "A food delivery app looks polished, but most first-time users cannot work out how to change their delivery address. What kind of problem is this mainly?",
    options: opts("A UX problem: the experience of achieving a goal fails", "A UI problem: the colours are wrong", "A branding problem", "Not a design problem"),
    correct: "a",
    explanation: "The interface may look good; the failure is in the experience of completing the task.",
  }),
  mcq({
    id: "ux-x1-002", domain: "u1-foundations", difficulty: 3, topic: "designer-role",
    skill: "The designer's role",
    prompt: "What is a UI/UX designer's main responsibility in a product team?",
    options: opts("Representing users in decisions and specifying how the product works and looks", "Writing the backend code", "Deciding the company's budget", "Testing server performance"),
    correct: "a",
    explanation: "Designers bring research into decisions and turn requirements into flows, screens and specifications.",
  }),
  mcq({
    id: "ux-x1-003", domain: "u1-foundations", difficulty: 3, topic: "design-thinking-stages",
    skill: "Design thinking stages",
    prompt: "In design thinking, which stage turns research into a clear statement of the problem to solve?",
    options: opts("Define", "Empathize", "Ideate", "Test"),
    correct: "a",
    explanation: "Empathize gathers understanding; Define commits to a problem statement.",
  }),
  mcq({
    id: "ux-x1-004", domain: "u1-foundations", difficulty: 4, topic: "problem-statement",
    skill: "Problem statements",
    prompt: "Which is the strongest problem statement?",
    options: opts(
      "Market traders need to save small daily amounts without the temptation to withdraw, because their income arrives in cash every day",
      "Traders need a savings app with notifications",
      "We should build a chatbot for savings",
      "Users want a better experience"
    ),
    correct: "a",
    explanation: "A specific user, a need rather than a solution, and an insight from research.",
  }),
  mcq({
    id: "ux-x1-005", domain: "u1-foundations", difficulty: 3, topic: "divergent-convergent",
    skill: "Divergent and convergent thinking",
    prompt: "During a brainstorm, why should the team avoid judging ideas as they are suggested?",
    options: opts("Judging during divergent thinking stops people generating ideas", "Judging is never useful", "Ideas should be judged only by the client", "It saves time to judge immediately"),
    correct: "a",
    explanation: "Generate first, then converge against criteria.",
  }),
  mcq({
    id: "ux-x1-006", domain: "u1-foundations", difficulty: 4, topic: "contrast-aa",
    skill: "Contrast requirements",
    prompt: "Grey text (#9ca3af) on white has a contrast ratio of about 2.5:1. Can it be used for normal-size body text under WCAG AA?",
    options: opts("No: normal text needs at least 4.5:1", "Yes: 2:1 is the minimum", "Yes, if the font is bold", "Only on desktop screens"),
    correct: "a",
    explanation: "AA requires 4.5:1 for normal text and 3:1 for large text.",
  }),
  mcq({
    id: "ux-x1-007", domain: "u1-foundations", difficulty: 3, topic: "font-pairing",
    skill: "Typography",
    prompt: "How many typeface families should a typical interface use?",
    options: opts("One or two, each with a clear job", "As many as there are screens", "Exactly five", "A new one for every heading level"),
    correct: "a",
    explanation: "Hierarchy comes from size and weight, not more families.",
  }),
  mcq({
    id: "ux-x1-008", domain: "u1-foundations", difficulty: 4, topic: "spacing-system",
    skill: "Spacing systems",
    prompt: "A design uses gaps of 13px, 22px and 31px. On an 8-point spacing system, what would you replace them with?",
    options: opts("Values from the scale such as 12, 24 and 32", "Keep them, because they were chosen by eye", "All 0", "Random values for variety"),
    correct: "a",
    explanation: "Odd values are almost always accidents; the scale gives consistent rhythm.",
  }),
  mcq({
    id: "ux-x1-009", domain: "u1-foundations", difficulty: 5, topic: "validate-assumptions",
    skill: "Validating assumptions",
    prompt: "A team believes traders forget to save rather than choose not to. What is the best way to test this before building anything?",
    options: opts(
      "Interview eight traders about their last attempts to save, with a pass mark set in advance such as 6 of 8 saying they forget",
      "Build the app and see whether people use it",
      "Ask the team to vote on whether it is true",
      "Run an A/B test on the finished app"
    ),
    correct: "a",
    explanation: "Test the riskiest assumption cheaply, with a pass mark decided before the evidence arrives.",
  }),
  mcq({
    id: "ux-x1-010", domain: "u1-foundations", difficulty: 5, topic: "visual-hierarchy-squint",
    skill: "Visual hierarchy",
    prompt: "When you squint at a checkout screen, the most visible element is a promotional banner, not the Pay button. What does this tell you?",
    options: opts(
      "The visual hierarchy is wrong: the screen's main action should be its strongest element",
      "The banner is well designed and should stay dominant",
      "Squinting is not a valid test",
      "The Pay button should be removed"
    ),
    correct: "a",
    explanation: "Whatever survives the squint test is what people notice first; that should be the main action.",
  }),
  mcq({
    id: "ux-x1-011", domain: "u1-foundations", difficulty: 5, topic: "colour-meaning",
    skill: "Colour psychology",
    prompt: "A brand's main colour is red. Should a banking app show successful deposits in red?",
    options: opts(
      "No: functional colour meaning should win; show success in green with a + sign, and use the brand colour elsewhere",
      "Yes: brand colour should be used everywhere",
      "Yes, as long as the text is bold",
      "No: deposits should not be shown at all"
    ),
    correct: "a",
    explanation: "Red signals danger or loss; reversing conventions invites costly misreading.",
  }),

  /* ═══════════════ u2 · UX DESIGN ═══════════════ */
  mcq({
    id: "ux-x2-001", domain: "u2-ux", difficulty: 3, topic: "qual-quant",
    skill: "Research methods",
    prompt: "Analytics show 60% of users abandon checkout at the delivery step. Which research best explains why?",
    options: opts("Watching and talking to a few users as they go through checkout", "Counting the abandonment again next month", "A survey asking if users like the app", "Copying a competitor's checkout"),
    correct: "a",
    explanation: "Quantitative data shows what; qualitative research explains why.",
  }),
  mcq({
    id: "ux-x2-002", domain: "u2-ux", difficulty: 3, topic: "interview-question",
    skill: "User interviews",
    prompt: "Which interview question is best?",
    options: opts("Tell me about the last time you paid a bill on your phone.", "Would you use an app that pays bills?", "Don't you find paying bills stressful?", "Do you pay bills online?"),
    correct: "a",
    explanation: "Open, neutral, and about real past behaviour.",
  }),
  mcq({
    id: "ux-x2-003", domain: "u2-ux", difficulty: 4, topic: "sampling-bias",
    skill: "Research bias",
    prompt: "A designer tests a new app only with friends from their church group. Which bias most threatens the results?",
    options: opts("Sampling and social desirability bias", "Recency bias", "No bias: friends are honest", "Anchoring bias in the code"),
    correct: "a",
    explanation: "They are unrepresentative and likely to be kind.",
  }),
  mcq({
    id: "ux-x2-004", domain: "u2-ux", difficulty: 3, topic: "persona-evidence",
    skill: "Personas",
    prompt: "What makes a persona useful rather than misleading?",
    options: opts("Its goals, behaviours and frustrations come from real research", "A realistic photo and hobbies", "Agreement in a team meeting", "Including as many details as possible"),
    correct: "a",
    explanation: "Evidence-based personas guide decisions; invented ones give assumptions a face.",
  }),
  mcq({
    id: "ux-x2-005", domain: "u2-ux", difficulty: 4, topic: "tree-test-rate",
    skill: "Tree testing",
    prompt: "In a tree test, 6 of 8 participants found the right page for a task. What is the success rate?",
    options: opts("75%", "6%", "25%", "60%"),
    correct: "a",
    explanation: "6 ÷ 8 × 100 = 75%.",
  }),
  mcq({
    id: "ux-x2-006", domain: "u2-ux", difficulty: 3, topic: "site-map-shape",
    skill: "Information architecture",
    prompt: "Why are broad, shallow site maps usually better than narrow, deep ones?",
    options: opts("Each extra level is another decision where people can go wrong", "Deep structures look more professional", "Shallow sites have fewer pages", "Browsers limit depth"),
    correct: "a",
    explanation: "A few clear options per level, important content within three levels.",
  }),
  mcq({
    id: "ux-x2-007", domain: "u2-ux", difficulty: 4, topic: "error-message",
    skill: "Form validation",
    prompt: "Which is the best error message for a phone number field?",
    options: opts("Enter an 11-digit phone number, like 0803 123 4567", "Invalid input", "Error 422", "Wrong format"),
    correct: "a",
    explanation: "It says what to do, with an example.",
  }),
  mcq({
    id: "ux-x2-008", domain: "u2-ux", difficulty: 3, topic: "fitts-law",
    skill: "Fitts's Law",
    prompt: "According to Fitts's Law, where should a phone app's main payment button usually be?",
    options: opts("Large, near the bottom where the thumb rests", "Small, in the top-left corner", "Inside a menu", "Next to the Delete button"),
    correct: "a",
    explanation: "Closer, bigger targets are faster and easier to hit.",
  }),
  mcq({
    id: "ux-x2-009", domain: "u2-ux", difficulty: 5, topic: "pain-point-priority",
    skill: "Prioritising pain points",
    prompt: "Research finds: 70% of users find the colours dull, and 20% cannot finish payment because the bank page times out. What should be tackled first?",
    options: opts(
      "The payment time-out: it fully blocks users and costs sales, even though fewer mention it",
      "The colours, because more people mentioned them",
      "Neither, because 20% is a minority",
      "Both at once with equal effort"
    ),
    correct: "a",
    explanation: "Prioritise by frequency and severity together; a blocker outranks a mild preference.",
  }),
  mcq({
    id: "ux-x2-010", domain: "u2-ux", difficulty: 5, topic: "unhappy-path",
    skill: "User flows",
    prompt: "A learner's payment succeeds, but their network drops before the confirmation screen. They reopen the app and see the course still locked. What should the flow do?",
    options: opts(
      "Check for a recent successful payment on reopening, unlock the course and show the receipt",
      "Ask them to pay again",
      "Show an error code",
      "Nothing: network problems are the user's fault"
    ),
    correct: "a",
    explanation: "Flows must survive interruptions so nobody pays twice.",
  }),
  mcq({
    id: "ux-x2-011", domain: "u2-ux", difficulty: 5, topic: "hicks-law",
    skill: "Hick's Law",
    prompt: "A data-plan screen lists 18 plans in one list and many users leave without buying. Which change best applies Hick's Law?",
    options: opts(
      "Group plans into Daily, Weekly and Monthly tabs with one recommended plan in each",
      "Add more plans so everyone finds a perfect fit",
      "Increase the font size of all 18 plans",
      "Remove all plans but one"
    ),
    correct: "a",
    explanation: "Fewer visible, well-organised choices with a sensible default speed decisions.",
  }),

  /* ═══════════════ u3 · UI DESIGN ═══════════════ */
  mcq({
    id: "ux-x3-001", domain: "u3-ui", difficulty: 3, topic: "frame-vs-group",
    skill: "Figma frames and groups",
    prompt: "Why should a card in Figma be a frame rather than a group?",
    options: opts("Frames have their own size, fill, clipping, constraints and Auto Layout", "Groups cannot be moved", "Frames are always smaller", "Groups cannot contain images"),
    correct: "a",
    explanation: "A group is a bundle; a frame is a container with properties.",
  }),
  mcq({
    id: "ux-x3-002", domain: "u3-ui", difficulty: 3, topic: "auto-layout-css",
    skill: "Auto Layout",
    prompt: "Figma's Auto Layout corresponds most closely to which CSS layout model?",
    options: opts("Flexbox", "Floats", "Tables", "Absolute positioning"),
    correct: "a",
    explanation: "Direction, gap, padding and alignment map onto flexbox.",
  }),
  mcq({
    id: "ux-x3-003", domain: "u3-ui", difficulty: 4, topic: "constraints",
    skill: "Constraints",
    prompt: "A badge must stay in the top-right corner of a card at any width. Which constraints does it need?",
    options: opts("Top and Right", "Left and Top", "Centre and Centre", "Scale and Scale"),
    correct: "a",
    explanation: "Pinned to the top and right edges, it follows that corner.",
  }),
  mcq({
    id: "ux-x3-004", domain: "u3-ui", difficulty: 4, topic: "variants-count",
    skill: "Variants",
    prompt: "A button has Type (Primary, Secondary, Danger) and State (Default, Hover, Disabled). How many variants can its component set hold?",
    options: opts("9", "6", "3", "12"),
    correct: "a",
    explanation: "3 × 3 = 9.",
  }),
  mcq({
    id: "ux-x3-005", domain: "u3-ui", difficulty: 3, topic: "fidelity",
    skill: "Wireframe fidelity",
    prompt: "Which is the best use of a low-fidelity wireframe?",
    options: opts("Exploring several layout ideas quickly and cheaply", "Final handoff to developers", "Testing whether a colour feels trustworthy", "Printing marketing materials"),
    correct: "a",
    explanation: "Low fidelity is for exploration; high fidelity for detail and handoff.",
  }),
  mcq({
    id: "ux-x3-006", domain: "u3-ui", difficulty: 3, topic: "mobile-first",
    skill: "Mobile-first design",
    prompt: "Most of a bill-payment site's visitors use Android phones. Which approach fits best?",
    options: opts("Mobile first: design the phone layout, then expand for larger screens", "Shrink the desktop layout to fit phones", "Design for desktop only", "Design for tablets first"),
    correct: "a",
    explanation: "Start where users are; it also forces priorities.",
  }),
  mcq({
    id: "ux-x3-007", domain: "u3-ui", difficulty: 4, topic: "touch-target",
    skill: "Touch targets",
    prompt: "What minimum touch target sizes do Apple and Google recommend?",
    options: opts("44 × 44 points (Apple) and 48 × 48 dp (Google)", "20 × 20 for both", "100 × 100 for both", "There is no recommendation"),
    correct: "a",
    explanation: "Fingertips are imprecise; small targets cause mis-taps.",
  }),
  mcq({
    id: "ux-x3-008", domain: "u3-ui", difficulty: 4, topic: "viewport-dpr",
    skill: "Viewports",
    prompt: "A phone screen is 1170 physical pixels wide with a device pixel ratio of 3. About how wide is its viewport in CSS pixels?",
    options: opts("390", "1170", "3510", "130"),
    correct: "a",
    explanation: "1170 ÷ 3 = 390 CSS pixels.",
  }),
  mcq({
    id: "ux-x3-009", domain: "u3-ui", difficulty: 5, topic: "phone-content-order",
    skill: "Responsive layouts",
    prompt: "On desktop, a store's filters sit in a left sidebar. On phones they stack above the products, so shoppers scroll past twenty filters first. What is the better phone design?",
    options: opts(
      "Products first, with a Filter button that opens the filters in a panel",
      "Keep the filters on top but make them smaller",
      "Remove filters on phones",
      "Move the filters to the very bottom"
    ),
    correct: "a",
    explanation: "On phones, order follows priority, not desktop position.",
  }),
  mcq({
    id: "ux-x3-010", domain: "u3-ui", difficulty: 5, topic: "fluid-type",
    skill: "Flexible typography",
    prompt: "What does font-size: clamp(28px, 1.45rem + 1.8vw, 48px) achieve?",
    options: opts(
      "Type that grows with the viewport but never goes below 28px or above 48px",
      "A fixed 28px on every screen",
      "A fixed 48px on every screen",
      "A random size between 28 and 48px"
    ),
    correct: "a",
    explanation: "Minimum, fluid preferred value, maximum.",
  }),
  mcq({
    id: "ux-x3-011", domain: "u3-ui", difficulty: 5, topic: "cross-platform",
    skill: "Cross-platform design",
    prompt: "Designing one product for Android, iOS and the web, what should stay consistent across platforms?",
    options: opts(
      "Brand, content, features, terminology and information architecture",
      "System controls such as date pickers",
      "Back navigation behaviour",
      "The system font for body text"
    ),
    correct: "a",
    explanation: "Keep what defines the product; adapt each platform's conventions.",
  }),

  /* ═══════════════ u4 · PROTOTYPES, TESTING AND SYSTEMS ═══════════════ */
  mcq({
    id: "ux-x4-001", domain: "u4-validation", difficulty: 3, topic: "prototype-purpose",
    skill: "Prototyping",
    prompt: "What is the main purpose of a prototype?",
    options: opts("To learn how a design works in use before building it", "To replace the finished product", "To decorate a presentation", "To store design files"),
    correct: "a",
    explanation: "Prototypes reveal problems static screens hide.",
  }),
  mcq({
    id: "ux-x4-002", domain: "u4-validation", difficulty: 3, topic: "smart-animate",
    skill: "Smart Animate",
    prompt: "Smart Animate does not animate a card between two frames. What should you check first?",
    options: opts("That the card layer has the same name in both frames", "The export settings", "The colour profile", "The font licence"),
    correct: "a",
    explanation: "Smart Animate matches layers by name.",
  }),
  mcq({
    id: "ux-x4-003", domain: "u4-validation", difficulty: 4, topic: "completion-rate",
    skill: "Usability metrics",
    prompt: "In a test, 3 of 5 participants completed a task. What is the completion rate?",
    options: opts("60%", "3%", "40%", "35%"),
    correct: "a",
    explanation: "3 ÷ 5 × 100 = 60%.",
  }),
  mcq({
    id: "ux-x4-004", domain: "u4-validation", difficulty: 3, topic: "think-aloud",
    skill: "Think-aloud testing",
    prompt: "A participant hesitates. What should the facilitator say?",
    options: opts("\"What are you thinking right now?\"", "\"The button is at the bottom.\"", "\"You're doing it wrong.\"", "\"Let me do it for you.\""),
    correct: "a",
    explanation: "Neutral prompts keep the data honest; struggling is a finding.",
  }),
  mcq({
    id: "ux-x4-005", domain: "u4-validation", difficulty: 4, topic: "nielsen-h9",
    skill: "Nielsen's heuristics",
    prompt: "A failed payment shows only \"ERR_502\". Which heuristic does this break most directly?",
    options: opts("Help users recognise, diagnose and recover from errors", "Aesthetic and minimalist design", "Flexibility and efficiency of use", "Help and documentation"),
    correct: "a",
    explanation: "Error messages should be in plain language and suggest a solution.",
  }),
  mcq({
    id: "ux-x4-006", domain: "u4-validation", difficulty: 3, topic: "semantic-tokens",
    skill: "Design tokens",
    prompt: "Why should components use semantic tokens such as --color-action instead of --purple-700?",
    options: opts("A rebrand or dark mode then changes a few mappings instead of every component", "Primitive tokens are slower", "Semantic tokens are shorter", "Browsers cannot read primitives"),
    correct: "a",
    explanation: "Semantic tokens name purposes, which stay the same when colours change.",
  }),
  mcq({
    id: "ux-x4-007", domain: "u4-validation", difficulty: 4, topic: "atomic-level",
    skill: "Atomic design",
    prompt: "In atomic design, what is a site header made of a logo, navigation and a search form?",
    options: opts("An organism", "An atom", "A molecule", "A template"),
    correct: "a",
    explanation: "Organisms are complex sections built from molecules and atoms.",
  }),
  mcq({
    id: "ux-x4-008", domain: "u4-validation", difficulty: 4, topic: "component-states",
    skill: "Component states",
    prompt: "Which set of states should a button component include?",
    options: opts("Default, hover, focus, pressed, disabled and loading", "Default only", "Default and hover only", "Only the states shown in the mockup"),
    correct: "a",
    explanation: "Missing states are the most common gap between design and build.",
  }),
  mcq({
    id: "ux-x4-009", domain: "u4-validation", difficulty: 5, topic: "sus-score",
    skill: "SUS",
    prompt: "A participant's SUS answers give odd-item scores (answer − 1) summing to 16 and even-item scores (5 − answer) summing to 14. What is the SUS score?",
    options: opts("75", "30", "60", "150"),
    correct: "a",
    explanation: "(16 + 14) × 2.5 = 75.",
  }),
  mcq({
    id: "ux-x4-010", domain: "u4-validation", difficulty: 5, topic: "issue-priority",
    skill: "Prioritising usability issues",
    prompt: "Issue A was hit by 4 of 5 participants with severity 2. Issue B was hit by 2 of 5 with severity 4. Using frequency × severity, ties broken by severity, which comes first?",
    options: opts("B: both score 8, and B's severity is higher", "A, because more people hit it", "Neither: they are equal", "Whichever was found first"),
    correct: "a",
    explanation: "4 × 2 = 8 and 2 × 4 = 8; the tie goes to severity.",
  }),
  mcq({
    id: "ux-x4-011", domain: "u4-validation", difficulty: 5, topic: "theming-scale",
    skill: "Scaling design systems",
    prompt: "A bank's consumer and business apps have different brand colours, and each keeps its own copy of every component. How should one design system serve both?",
    options: opts(
      "One set of components on semantic tokens, with a token theme per brand",
      "Keep two copies and fix everything twice",
      "Force both apps to share one brand colour",
      "Abandon the design system"
    ),
    correct: "a",
    explanation: "Theming through tokens scales one system to many brands.",
  }),

  /* ═══════════════ u5 · PROFESSIONAL PRACTICE ═══════════════ */
  mcq({
    id: "ux-x5-001", domain: "u5-practice", difficulty: 3, topic: "pour",
    skill: "WCAG and POUR",
    prompt: "\"All functionality is available from a keyboard\" belongs to which POUR principle?",
    options: opts("Operable", "Perceivable", "Understandable", "Robust"),
    correct: "a",
    explanation: "Operable: everything can be used, whatever the input method.",
  }),
  mcq({
    id: "ux-x5-002", domain: "u5-practice", difficulty: 3, topic: "decorative-alt",
    skill: "Screen readers",
    prompt: "What alt text should a purely decorative image have?",
    options: opts("An empty alt attribute (alt=\"\")", "alt=\"decorative image\"", "No alt attribute", "A detailed description"),
    correct: "a",
    explanation: "Empty alt tells screen readers to skip it.",
  }),
  mcq({
    id: "ux-x5-003", domain: "u5-practice", difficulty: 4, topic: "ui-component-contrast",
    skill: "Contrast requirements",
    prompt: "What contrast does WCAG AA require for an input field's border against the page?",
    options: opts("3:1", "4.5:1", "7:1", "No requirement"),
    correct: "a",
    explanation: "Non-text contrast (1.4.11) requires 3:1 for interface components.",
  }),
  mcq({
    id: "ux-x5-004", domain: "u5-practice", difficulty: 3, topic: "focus-outline",
    skill: "Focus indicators",
    prompt: "What is wrong with the CSS rule *:focus { outline: none; } on its own?",
    options: opts("It removes the indicator keyboard users need to see where they are", "It slows the page", "It changes the font", "Nothing"),
    correct: "a",
    explanation: "Never remove focus styles without a visible replacement.",
  }),
  mcq({
    id: "ux-x5-005", domain: "u5-practice", difficulty: 4, topic: "dark-pattern",
    skill: "Dark patterns",
    prompt: "A checkout pre-ticks \"Send me offers from partners\". Which dark pattern is this?",
    options: opts("Preselection", "Confirmshaming", "Roach motel", "Disguised ads"),
    correct: "a",
    explanation: "Options in the company's favour should never be ticked by default.",
  }),
  mcq({
    id: "ux-x5-006", domain: "u5-practice", difficulty: 3, topic: "box-model",
    skill: "HTML and CSS for designers",
    prompt: "With box-sizing: border-box, a card is 320px wide with 24px padding and a 1px border. How wide is its content area?",
    options: opts("270px", "320px", "370px", "296px"),
    correct: "a",
    explanation: "320 − 2 × 24 − 2 × 1 = 270.",
  }),
  mcq({
    id: "ux-x5-007", domain: "u5-practice", difficulty: 4, topic: "asset-naming",
    skill: "Asset organisation",
    prompt: "Which exported asset name follows good conventions?",
    options: opts("icon-arrow-back.svg", "Icon Arrow Back FINAL.PNG", "image1.jpg", "arrow (copy 2).svg"),
    correct: "a",
    explanation: "Lowercase, hyphenated, descriptive, and SVG for icons.",
  }),
  mcq({
    id: "ux-x5-008", domain: "u5-practice", difficulty: 4, topic: "design-qa",
    skill: "Pixel-perfect versus practical",
    prompt: "During design QA you find a heading 1px out of place on one phone and a missing error state on the payment form. What should you raise first?",
    options: opts("The missing error state", "The 1px offset", "Neither: QA is the developer's job", "Both equally, in the order found"),
    correct: "a",
    explanation: "Prioritise by impact on users: states and behaviour before sub-pixel differences.",
  }),
  mcq({
    id: "ux-x5-009", domain: "u5-practice", difficulty: 5, topic: "rem-units",
    skill: "Accessible typography",
    prompt: "Why specify body text in rem rather than px?",
    options: opts(
      "rem grows with the text size the reader has chosen in their browser or phone settings",
      "rem is always larger than px",
      "px does not work on phones",
      "rem files download faster"
    ),
    correct: "a",
    explanation: "Relative units respect the reader's settings; px ignores them.",
  }),
  mcq({
    id: "ux-x5-010", domain: "u5-practice", difficulty: 5, topic: "acceptance-criteria",
    skill: "Communicating requirements",
    prompt: "Which acceptance criterion can a developer and tester actually check?",
    options: opts(
      "Given the payment fails, the user sees \"You have not been charged\" and a Try again button",
      "Error handling should be good",
      "The page should feel premium",
      "Make the checkout user-friendly"
    ),
    correct: "a",
    explanation: "Specific, observable and testable.",
  }),
  mcq({
    id: "ux-x5-011", domain: "u5-practice", difficulty: 5, topic: "permission-timing",
    skill: "Privacy-conscious design",
    prompt: "A savings app asks for contacts, location, camera and SMS access the moment it opens. What is the privacy-conscious alternative?",
    options: opts(
      "Ask for each permission only when a feature needs it, explain why, and keep working if people refuse",
      "Ask for everything at once to reduce prompts",
      "Hide the permissions in the terms and conditions",
      "Refuse to open without every permission"
    ),
    correct: "a",
    explanation: "Just-in-time, explained and optional.",
  }),

  /* ═══════════════ u6 · PRODUCT AND CAREER ═══════════════ */
  mcq({
    id: "ux-x6-001", domain: "u6-product-career", difficulty: 3, topic: "desirable-viable-feasible",
    skill: "Product design",
    prompt: "A strong product sits where which three qualities overlap?",
    options: opts("Desirable, viable and feasible", "Cheap, fast and pretty", "New, big and complex", "Popular, trendy and free"),
    correct: "a",
    explanation: "People want it, the business can sustain it, it can be built.",
  }),
  mcq({
    id: "ux-x6-002", domain: "u6-product-career", difficulty: 4, topic: "rice-score",
    skill: "Prioritisation",
    prompt: "A feature reaches 3,000 users, has impact 2, confidence 50% and effort 2 person-months. What is its RICE score?",
    options: opts("1,500", "3,000", "6,000", "750"),
    correct: "a",
    explanation: "3,000 × 2 × 0.5 ÷ 2 = 1,500.",
  }),
  mcq({
    id: "ux-x6-003", domain: "u6-product-career", difficulty: 3, topic: "fintech-confirm",
    skill: "FinTech interfaces",
    prompt: "Which button label builds most trust on a transfer confirmation screen?",
    options: opts("\"Send ₦5,010\"", "\"Continue\"", "\"Submit\"", "\"OK\""),
    correct: "a",
    explanation: "It states exactly what will happen, including the total.",
  }),
  mcq({
    id: "ux-x6-004", domain: "u6-product-career", difficulty: 3, topic: "bar-zero",
    skill: "Data visualisation",
    prompt: "Why must a bar chart's value axis start at zero?",
    options: opts("Bar length encodes value; a cut axis exaggerates differences", "Browsers require it", "It looks more modern", "It saves space"),
    correct: "a",
    explanation: "Honest bars start at zero.",
  }),
  mcq({
    id: "ux-x6-005", domain: "u6-product-career", difficulty: 4, topic: "ai-human-handoff",
    skill: "Conversational interfaces",
    prompt: "A bank chatbot keeps saying \"I didn't understand\" to a customer reporting fraud. What is missing?",
    options: opts("A clear route to a human for urgent or sensitive issues", "Politer wording", "A cartoon avatar", "Longer answers"),
    correct: "a",
    explanation: "Every conversational interface needs a way out to a person.",
  }),
  mcq({
    id: "ux-x6-006", domain: "u6-product-career", difficulty: 4, topic: "case-study-decision",
    skill: "Case studies",
    prompt: "Which line best documents a design decision in a case study?",
    options: opts(
      "We chose a closing-time reminder because 5 of 6 traders said they forget to save",
      "I designed the home screen",
      "The app uses purple",
      "It looks modern"
    ),
    correct: "a",
    explanation: "A decision, its reason and its evidence.",
  }),
  mcq({
    id: "ux-x6-007", domain: "u6-product-career", difficulty: 3, topic: "star",
    skill: "Interviews",
    prompt: "What does STAR stand for when answering behavioural interview questions?",
    options: opts("Situation, Task, Action, Result", "Skills, Tools, Achievements, References", "Start, Try, Adjust, Repeat", "Story, Theme, Audience, Response"),
    correct: "a",
    explanation: "A structure for describing real experiences with results.",
  }),
  mcq({
    id: "ux-x6-008", domain: "u6-product-career", difficulty: 4, topic: "scope-creep",
    skill: "Client work",
    prompt: "Midway through a website project, a client asks you to \"also design the mobile app\". What is the professional response?",
    options: opts("Treat it as new work with its own price and timeline", "Do it free to keep them happy", "Refuse to discuss it", "Do it quietly and let the website slip"),
    correct: "a",
    explanation: "Scope changes are handled through a change request.",
  }),
  mcq({
    id: "ux-x6-009", domain: "u6-product-career", difficulty: 5, topic: "pricing-contingency",
    skill: "Pricing design projects",
    prompt: "A project is estimated at 50 hours at ₦12,000 per hour, plus a 10% contingency, with a 50% deposit. What is the deposit?",
    options: opts("₦330,000", "₦300,000", "₦660,000", "₦600,000"),
    correct: "a",
    explanation: "50 × 12,000 = 600,000; × 1.10 = 660,000; half = 330,000.",
  }),
  mcq({
    id: "ux-x6-010", domain: "u6-product-career", difficulty: 5, topic: "ai-suggestions",
    skill: "Evaluating AI suggestions",
    prompt: "An AI tool produces a polished onboarding flow in seconds. A teammate wants to ship it unchanged. What should happen first?",
    options: opts(
      "Check it against research, the design system and accessibility, and test it with users",
      "Ship it: AI output is optimised",
      "Reject it because AI made it",
      "Ask the AI whether it is good"
    ),
    correct: "a",
    explanation: "AI can draft; designers decide, with evidence.",
  }),
  mcq({
    id: "ux-x6-011", domain: "u6-product-career", difficulty: 5, topic: "mvp-budget",
    skill: "MVP design",
    prompt: "Features in priority order have efforts of 1, 2, 4 and 1 person-months. Taking features in priority order while they fit, which go into a 3 person-month MVP?",
    options: opts("The first two (1 + 2 = 3 person-months)", "The first three", "Only the last one", "All four"),
    correct: "a",
    explanation: "1 + 2 = 3 fills the budget; the third (4) does not fit.",
  }),
];

export default ITEMS;
