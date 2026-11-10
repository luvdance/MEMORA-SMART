/**
 * UI/UX DESIGN
 *
 * Authored from the Memora Smart Technologies curriculum: sixteen modules in
 * six phases over sixteen weeks, from "what is UX?" to a portfolio of three
 * case studies. Research, interaction design, visual design, Figma,
 * prototyping, usability testing, design systems, accessibility, developer
 * handoff and the design career.
 *
 * Course content is DATA, never markup, in exactly the shape of the other
 * courses, so the catalog, sidebar, player, progress engine and stats band
 * render it without a change.
 *
 *   courses/{courseId}
 *     └── modules/{moduleId}          one curriculum module (one week)
 *           └── lessons/{lessonId}    three to six curriculum topics
 *                 └── atoms/{atomId}  one idea each
 *
 * ── THE PRACTICE IS REAL DESIGN WORK, CHECKED BY MEASUREMENT ─────────────
 * Every lesson carries a `webLab`: a real interface, or a real design
 * document, that the learner changes while a live preview renders it at
 * phone, tablet and laptop widths. "Check my work" measures the result in
 * the browser: WCAG contrast ratios computed from the rendered colours, tap
 * targets measured in pixels, spacing compared with a scale, type sizes,
 * focus rings, layouts at three widths, and the structure and arithmetic of
 * research documents (personas, problem statements, test results). Design
 * judgement is practised in `decision` scenarios. `npm run validate:content`
 * loads every lab in headless Chrome: its model answer must pass and its
 * starter must fail.
 *
 * Figma is the course's design tool and every module project is made in it.
 * Figma itself cannot be graded from here, so the labs practise the same
 * ideas (Auto Layout, constraints, components, variants, variables, grids,
 * prototyping) in a live renderer whose properties map one to one onto
 * Figma's, which is also exactly what a developer builds from the file.
 *
 * ── THE CURRICULUM TABLE ─────────────────────────────────────────────────
 * `curriculum` on each module is the source document's topic list, numbered
 * N.1, N.2 … with N.P for the module's practical exercise. Every lesson
 * declares the numbers it `covers`, and `npm run test:academy` fails if any
 * topic is not taught.
 */

export const UIUX_DESIGN_COURSE = {
  id: "uiux-design",
  slug: "uiux-design",
  title: "UI/UX Design",
  subtitle: "Research, design, prototype and test interfaces people can actually use",
  tagline:
    "Understand people, design interfaces that work for them, prove it with testing, and hand it to developers in a way they can build.",
  description:
    "A sixteen-week programme that takes you from the meaning of UI and UX to a portfolio of three professional case studies. You learn to think like a designer (design thinking, research with real users, personas, journeys and information architecture), then to design interactions and interfaces (user flows, the laws of UX, colour, typography, grids, Figma, wireframes and responsive layouts), then to prove them (interactive prototypes, usability testing, Nielsen's heuristics) and scale them (design systems, accessibility, ethics and developer handoff). The final phase covers real product design (dashboards, FinTech, e-commerce, AI interfaces) and your career: portfolio, case studies, freelancing, pricing and interviews. Every lesson has practice that is checked by measurement, not opinion: contrast ratios, tap targets, spacing, layouts at three screen sizes, and the structure of your research. Projects are built in Figma. No experience required.",

  status: "live",
  level: "Beginner → Professional",
  durationMonths: 4,
  hoursPerWeek: "8–10",
  language: "English",
  instructor: {
    name: "Memora Smart Academy",
    role: "Industry-led curriculum",
  },

  access: {
    accessType: "free",
    price: 0,
    currency: "NGN",
    enrollmentStatus: "open",
  },

  tools: [
    {
      id: "figma",
      name: "Figma",
      short: "Figma",
      blurb: "Frames, Auto Layout, components, variants, variables and prototypes.",
      icon: "fab fa-figma",
      accent: "#7c3aed",
    },
    {
      id: "research",
      name: "FigJam, Google Forms & spreadsheets",
      short: "Research",
      blurb: "Interviews, surveys, affinity maps, journey maps and test results.",
      icon: "fas fa-clipboard-list",
      accent: "#0f766e",
    },
    {
      id: "browser",
      name: "Design lab in the browser",
      short: "Design lab",
      blurb: "Live interfaces measured for contrast, spacing, targets and layout.",
      icon: "fas fa-pen-ruler",
      accent: "#c2410c",
    },
    {
      id: "handoff",
      name: "HTML, CSS & handoff",
      short: "Handoff",
      blurb: "Enough code to speak a developer's language and hand over cleanly.",
      icon: "fab fa-css3-alt",
      accent: "#1d4ed8",
    },
  ],

  outcomes: [
    "Explain what UI and UX design are, how they differ, and where a designer fits in a software team",
    "Run design thinking from empathy to testing, and write problem statements grounded in evidence",
    "Plan and conduct user research, then turn findings into personas, journeys and design decisions",
    "Structure products with information architecture, site maps, user flows and the laws of UX",
    "Design clear, accessible interfaces with colour, typography, hierarchy, grids and spacing systems",
    "Work professionally in Figma: Auto Layout, components, variants, variables, libraries and prototypes",
    "Design responsive, cross-platform interfaces that respect Material Design and Apple's guidelines",
    "Test with real users, measure usability, and improve designs from evidence",
    "Build and document a design system, design for accessibility and avoid dark patterns",
    "Hand designs to developers cleanly and present your work in a portfolio of case studies",
  ],

  audience: [
    "Complete beginners who want a career in UI/UX or product design",
    "Graphic designers moving into digital products",
    "Developers who want their interfaces to be easy to use",
    "Founders, product managers and freelancers who commission or review designs",
  ],

  requirements: [
    "A laptop or desktop computer. Figma runs in the browser, so any recent operating system works",
    "A stable internet connection",
    "A free Figma account (created in Module 7)",
    "No design or coding experience",
  ],

  /** The six phases of the source curriculum; `weeks` are module orders. */
  phases: [
    { phase: 1, title: "Design foundations", weeks: [1, 2, 3] },
    { phase: 2, title: "User experience (UX) design", weeks: [4, 5, 6] },
    { phase: 3, title: "User interface (UI) design", weeks: [7, 8, 9] },
    { phase: 4, title: "Prototyping, testing and design systems", weeks: [10, 11, 12] },
    { phase: 5, title: "Professional UI/UX practice", weeks: [13, 14] },
    { phase: 6, title: "Advanced practice and career development", weeks: [15, 16] },
  ],

  months: [
    /* ═══════════════════════ MONTH 1 · WEEKS 1–4 ═══════════════════════ */
    {
      month: 1,
      title: "Design foundations and user research",
      focus: "Weeks 1–4",
      summary:
        "Phase 1 and the start of Phase 2. What UI and UX are; design thinking and human-centred design; the visual fundamentals of colour, type, hierarchy and space; and how to research users before designing for them.",
      modules: [
        {
          id: "ux-m1-intro",
          order: 1,
          phase: 1,
          week: "Week 1",
          title: "Module 1 · Introduction to UI/UX Design",
          summary:
            "What user interface and user experience design mean, why they exist, how they differ and how they fit into building software.",
          atoms: 19,
          topics: [
            "What UI design and UX design are, and how they differ",
            "UI/UX and software engineering, and the designer's role",
            "Digital products and the types of interface",
            "Users, expectations and common misconceptions",
            "Good and bad design, and the design process",
          ],
          curriculum: [
            ["1.0", "Welcome: what you will design, and the road ahead"],
            ["1.1", "What is user interface design?"],
            ["1.2", "What is user experience design?"],
            ["1.3", "Differences between UI and UX"],
            ["1.4", "Relationship between UI/UX design and software engineering"],
            ["1.5", "The role of a UI/UX designer in a development team"],
            ["1.6", "Understanding digital products"],
            ["1.7", "Types of interfaces: websites, mobile, desktop and web applications, enterprise dashboards and e-commerce platforms"],
            ["1.8", "Understanding users and their expectations"],
            ["1.9", "Common UI/UX design misconceptions"],
            ["1.10", "Examples of good and bad interface design"],
            ["1.11", "Introduction to the design process"],
            ["1.P", "Practical: examine three popular applications and identify their UI and UX strengths and weaknesses"],
          ],
          project:
            "Examine three popular applications and identify their UI and UX strengths and weaknesses.",
        },
        {
          id: "ux-m2-design-thinking",
          order: 2,
          phase: 1,
          week: "Week 2",
          title: "Module 2 · Design Thinking and Human-Centred Design",
          summary:
            "Design as problem solving: the five stages of design thinking, finding the real problem, generating and choosing ideas, and validating assumptions.",
          atoms: 13,
          topics: [
            "Design thinking and human-centred design",
            "Empathize, define, ideate, prototype and test",
            "Problems before solutions, and user frustrations",
            "Brainstorming, divergent and convergent thinking",
            "Problem statements, assumptions and iteration",
          ],
          curriculum: [
            ["2.1", "What is design thinking?"],
            ["2.2", "Human-centred design principles"],
            ["2.3", "The five stages of design thinking: empathize, define, ideate, prototype and test"],
            ["2.4", "Identifying problems before designing solutions"],
            ["2.5", "Understanding user frustrations"],
            ["2.6", "Defining design problems"],
            ["2.7", "Brainstorming and idea generation"],
            ["2.8", "Divergent and convergent thinking"],
            ["2.9", "Problem statements"],
            ["2.10", "How to validate design assumptions"],
            ["2.11", "Introduction to iterative design"],
            ["2.P", "Practical: identify a problem with an existing Nigerian digital service and propose a design solution"],
          ],
          project:
            "Identify a problem with an existing Nigerian digital service and propose a design solution.",
        },
        {
          id: "ux-m3-visual",
          order: 3,
          phase: 1,
          week: "Week 3",
          title: "Module 3 · Visual Design Fundamentals",
          summary:
            "Colour, typography, hierarchy, contrast, alignment, balance, white space, grids and spacing systems: the visual knowledge behind interfaces that look good and work.",
          atoms: 20,
          topics: [
            "Colour theory, psychology and palettes",
            "Typography: families, pairing, size, weight and spacing",
            "Hierarchy, contrast, alignment and balance",
            "White space, consistency, grids and spacing systems",
            "A visual style guide",
          ],
          curriculum: [
            ["3.1", "Principles of visual design"],
            ["3.2", "Introduction to colour theory"],
            ["3.3", "Primary, secondary and tertiary colours"],
            ["3.4", "Colour psychology and emotional associations"],
            ["3.5", "Creating colour palettes"],
            ["3.6", "Typography fundamentals"],
            ["3.7", "Font families and classifications"],
            ["3.8", "Font pairing"],
            ["3.9", "Font weight, size, line height and letter spacing"],
            ["3.10", "Visual hierarchy"],
            ["3.11", "Contrast and readability"],
            ["3.12", "Alignment and proximity"],
            ["3.13", "Balance and visual weight"],
            ["3.14", "White space and negative space"],
            ["3.15", "Consistency and repetition"],
            ["3.16", "Grids and layout principles"],
            ["3.17", "Spacing systems"],
            ["3.18", "Introduction to visual composition"],
            ["3.P", "Practical: a visual style guide with a colour palette, typography system, spacing rules and basic interface elements"],
          ],
          project:
            "Create a visual style guide containing a colour palette, typography system, spacing rules and basic interface elements.",
        },
        {
          id: "ux-m4-research",
          order: 4,
          phase: 2,
          week: "Week 4",
          title: "Module 4 · User Research and Analysis",
          summary:
            "Understanding users before designing for them: research types, interviews, surveys, observation, competitor and market research, bias, and turning findings into decisions.",
          atoms: 16,
          topics: [
            "UX research and why it matters",
            "Qualitative, quantitative, primary and secondary research",
            "Interviews, surveys and observation",
            "Competitors, markets, pain points and feedback",
            "Documentation, bias, decisions and research tools",
          ],
          curriculum: [
            ["4.1", "Introduction to UX research"],
            ["4.2", "Why user research matters"],
            ["4.3", "Qualitative and quantitative research"],
            ["4.4", "Primary and secondary research"],
            ["4.5", "User interviews"],
            ["4.6", "Surveys and questionnaires"],
            ["4.7", "Observation techniques"],
            ["4.8", "Competitor analysis"],
            ["4.9", "Market research"],
            ["4.10", "Identifying user pain points"],
            ["4.11", "Gathering and interpreting user feedback"],
            ["4.12", "Research documentation"],
            ["4.13", "Identifying research biases"],
            ["4.14", "Turning research findings into design decisions"],
            ["4.15", "Research tools: Google Forms, FigJam and spreadsheets"],
            ["4.P", "Practical: research a proposed digital product with at least five potential users"],
          ],
          project:
            "Conduct research on a proposed digital product using at least five potential users.",
        },
      ],
    },

    /* ═══════════════════════ MONTH 2 · WEEKS 5–8 ═══════════════════════ */
    {
      month: 2,
      title: "Structure, interaction, Figma and wireframes",
      focus: "Weeks 5–8",
      summary:
        "The rest of Phase 2 and the start of Phase 3. Personas, journeys and information architecture; user flows, interaction design and the laws of UX; Figma from first frame to components and Auto Layout; and wireframes through to high-fidelity interfaces.",
      modules: [
        {
          id: "ux-m5-personas-ia",
          order: 5,
          phase: 2,
          week: "Week 5",
          title: "Module 5 · User Personas, User Journeys and Information Architecture",
          summary:
            "Translating research into structure: evidence-based personas, scenarios, user stories and jobs to be done, journey maps, information architecture, site maps, card sorting and tree testing.",
          atoms: 14,
          topics: [
            "Evidence-based personas, scenarios, stories and jobs to be done",
            "User journeys, customer journeys and friction points",
            "Information architecture, content hierarchy and site maps",
            "Navigation structures",
            "Card sorting and tree testing",
          ],
          curriculum: [
            ["5.1", "What are user personas?"],
            ["5.2", "Creating evidence-based user personas"],
            ["5.3", "User goals, behaviours and frustrations"],
            ["5.4", "User scenarios"],
            ["5.5", "User stories"],
            ["5.6", "Jobs to Be Done (JTBD) fundamentals"],
            ["5.7", "User journey mapping"],
            ["5.8", "Customer journey versus user journey"],
            ["5.9", "Identifying friction points"],
            ["5.10", "Information architecture (IA)"],
            ["5.11", "Organizing information"],
            ["5.12", "Content hierarchy"],
            ["5.13", "Site maps"],
            ["5.14", "Navigation structures"],
            ["5.15", "Card sorting"],
            ["5.16", "Tree testing"],
            ["5.17", "Designing intuitive navigation systems"],
            ["5.P", "Practical: a user persona, user journey map and site map for an e-learning platform"],
          ],
          project:
            "Develop a user persona, user journey map and site map for an e-learning platform.",
        },
        {
          id: "ux-m6-interaction",
          order: 6,
          phase: 2,
          week: "Week 6",
          title: "Module 6 · User Flows and Interaction Design",
          summary:
            "How people move through products and interact with them: user and task flows, interaction patterns, forms, feedback and states, affordances, mental models, the laws of UX and Gestalt.",
          atoms: 20,
          topics: [
            "Interaction design, user flows, task flows and flowcharts",
            "Navigation and interaction patterns, forms and validation",
            "Feedback, states, error prevention and microinteractions",
            "Affordances, signifiers and mental models",
            "Jakob's, Fitts's, Hick's and Miller's laws, and Gestalt",
          ],
          curriculum: [
            ["6.1", "What is interaction design?"],
            ["6.2", "Understanding user flows"],
            ["6.3", "Creating task flows"],
            ["6.4", "User flow diagrams"],
            ["6.5", "Flowchart fundamentals"],
            ["6.6", "Navigation patterns"],
            ["6.7", "Interaction patterns"],
            ["6.8", "Buttons, forms and input fields"],
            ["6.9", "Form validation and error states"],
            ["6.10", "Feedback and system responses"],
            ["6.11", "Loading, empty and success states"],
            ["6.12", "Error prevention and recovery"],
            ["6.13", "Affordances and signifiers"],
            ["6.14", "Feedback loops"],
            ["6.15", "Microinteractions"],
            ["6.16", "Understanding mental models"],
            ["6.17", "Jakob's Law"],
            ["6.18", "Fitts's Law"],
            ["6.19", "Hick's Law"],
            ["6.20", "Miller's Law"],
            ["6.21", "Gestalt principles in interface design"],
            ["6.P", "Practical: a complete user flow for registration, login, course selection and payment on an e-learning platform"],
          ],
          project:
            "Design a complete user flow for registration, login, course selection and payment on an e-learning platform.",
        },
        {
          id: "ux-m7-figma",
          order: 7,
          phase: 3,
          week: "Week 7",
          title: "Module 7 · Introduction to Figma",
          summary:
            "Figma as your primary design tool: the workspace, frames, shapes, text, images, constraints, components, variants, Auto Layout, grids, styles, variables, libraries, collaboration and export.",
          atoms: 18,
          topics: [
            "The Figma workspace, files, pages, layers, frames and sections",
            "Shapes, text, images, colour, strokes, constraints and groups",
            "Components, instances, properties, variants and Auto Layout",
            "Layout grids, styles, variables and libraries",
            "Collaboration, version history and exporting",
          ],
          curriculum: [
            ["7.1", "Introduction to Figma"],
            ["7.2", "Creating a Figma account"],
            ["7.3", "Understanding the Figma workspace"],
            ["7.4", "Files, pages and layers"],
            ["7.5", "Frames and sections"],
            ["7.6", "Shapes and vector tools"],
            ["7.7", "Text tools"],
            ["7.8", "Image placement and manipulation"],
            ["7.9", "Colour and stroke properties"],
            ["7.10", "Constraints and resizing"],
            ["7.11", "Groups and layers"],
            ["7.12", "Components and instances"],
            ["7.13", "Component properties"],
            ["7.14", "Variants"],
            ["7.15", "Auto Layout"],
            ["7.16", "Layout grids"],
            ["7.17", "Styles and variables"],
            ["7.18", "Libraries"],
            ["7.19", "Team collaboration"],
            ["7.20", "Version history"],
            ["7.21", "Exporting design assets"],
            ["7.P", "Practical: design a professional landing page from scratch in Figma"],
          ],
          project: "Design a professional landing page from scratch using Figma.",
        },
        {
          id: "ux-m8-wireframing",
          order: 8,
          phase: 3,
          week: "Week 8",
          title: "Module 8 · Wireframing and Interface Design",
          summary:
            "From flows to interfaces: low, mid and high fidelity, layout structures, websites, mobile apps, dashboards, e-commerce, landing pages, forms, tables, cards, menus, modals and states.",
          atoms: 15,
          topics: [
            "Wireframes from low to high fidelity",
            "Layout structures and the main kinds of interface",
            "Forms, tables, cards, navigation, modals and dropdowns",
            "Empty, loading and error states",
            "Consistency and hierarchy in real products",
          ],
          curriculum: [
            ["8.1", "What is wireframing?"],
            ["8.2", "Low-fidelity wireframes"],
            ["8.3", "Mid-fidelity wireframes"],
            ["8.4", "High-fidelity wireframes"],
            ["8.5", "Sketching and paper wireframes"],
            ["8.6", "Digital wireframing"],
            ["8.7", "Layout structures"],
            ["8.8", "Website interface design"],
            ["8.9", "Mobile application interface design"],
            ["8.10", "Dashboard design"],
            ["8.11", "E-commerce interface design"],
            ["8.12", "Landing page design"],
            ["8.13", "Designing forms and tables"],
            ["8.14", "Designing cards and navigation menus"],
            ["8.15", "Modal windows and dropdowns"],
            ["8.16", "Designing empty, loading and error states"],
            ["8.17", "UI consistency"],
            ["8.18", "Visual hierarchy in practical interfaces"],
            ["8.19", "Applying design principles to real products"],
            ["8.P", "Practical: wireframes and high-fidelity designs for a complete five-page website"],
          ],
          project:
            "Create wireframes and high-fidelity designs for a complete five-page website.",
        },
      ],
    },

    /* ═══════════════════════ MONTH 3 · WEEKS 9–12 ══════════════════════ */
    {
      month: 3,
      title: "Responsive design, prototypes, testing and systems",
      focus: "Weeks 9–12",
      summary:
        "The end of Phase 3 and all of Phase 4. Interfaces for every screen and platform; interactive prototypes; usability testing and heuristic evaluation; and design systems built from tokens and components.",
      modules: [
        {
          id: "ux-m9-responsive",
          order: 9,
          phase: 3,
          week: "Week 9",
          title: "Module 9 · Responsive Design and Cross-Platform Interfaces",
          summary:
            "Designing for every screen: responsive and adaptive design, mobile first, breakpoints, fluid grids, flexible type, responsive navigation, touch targets, Material Design and Apple's Human Interface Guidelines.",
          atoms: 17,
          topics: [
            "Responsive, adaptive, mobile-first and desktop-first design",
            "Breakpoints, viewports, fluid layouts and grids",
            "Flexible type, images and navigation",
            "Phones, tablets, desktops and touch targets",
            "Material Design, Apple's guidelines and cross-platform design",
          ],
          curriculum: [
            ["9.1", "What is responsive design?"],
            ["9.2", "Responsive versus adaptive design"],
            ["9.3", "Mobile-first design"],
            ["9.4", "Desktop-first design"],
            ["9.5", "Breakpoints"],
            ["9.6", "Viewports and screen resolutions"],
            ["9.7", "Fluid layouts"],
            ["9.8", "Fixed and flexible dimensions"],
            ["9.9", "Responsive grids"],
            ["9.10", "Flexible typography"],
            ["9.11", "Responsive navigation"],
            ["9.12", "Mobile navigation patterns"],
            ["9.13", "Desktop and mobile layouts"],
            ["9.14", "Tablet interface considerations"],
            ["9.15", "Responsive images and assets"],
            ["9.16", "Touch targets"],
            ["9.17", "Platform design considerations"],
            ["9.18", "Introduction to Android Material Design"],
            ["9.19", "Introduction to Apple Human Interface Guidelines"],
            ["9.20", "Designing consistent cross-platform experiences"],
            ["9.P", "Practical: design one website for desktop, tablet and mobile screen sizes"],
          ],
          project: "Design one website for desktop, tablet and mobile screen sizes.",
        },
        {
          id: "ux-m10-prototyping",
          order: 10,
          phase: 4,
          week: "Week 10",
          title: "Module 10 · Interactive Prototyping",
          summary:
            "Making static designs interactive: fidelity, connecting frames, interactive components, click, hover and drag, Smart Animate, transitions, overlays, scrolling, forms, sharing and presenting.",
          atoms: 17,
          topics: [
            "What prototypes are for, and how much fidelity they need",
            "Connecting frames and navigation interactions",
            "Click, hover, drag and interactive components",
            "Smart Animate, transitions, overlays, scrolling and forms",
            "Realistic experiences, sharing and presenting",
          ],
          curriculum: [
            ["10.1", "What is prototyping?"],
            ["10.2", "Why prototypes are important"],
            ["10.3", "Low-fidelity and high-fidelity prototypes"],
            ["10.4", "The Figma prototyping workspace"],
            ["10.5", "Connecting frames"],
            ["10.6", "Interactive components"],
            ["10.7", "Navigation interactions"],
            ["10.8", "On-click interactions"],
            ["10.9", "Hover interactions"],
            ["10.10", "Drag interactions"],
            ["10.11", "Smart Animate"],
            ["10.12", "Transitions and animations"],
            ["10.13", "Overlays and modal interactions"],
            ["10.14", "Scroll behaviour"],
            ["10.15", "Interactive forms"],
            ["10.16", "Building realistic user experiences"],
            ["10.17", "Sharing prototypes"],
            ["10.18", "Presenting design concepts"],
            ["10.P", "Practical: an interactive prototype of a mobile banking application"],
          ],
          project: "Build an interactive prototype of a mobile banking application.",
        },
        {
          id: "ux-m11-usability",
          order: 11,
          phase: 4,
          week: "Week 11",
          title: "Module 11 · Usability Testing and UX Evaluation",
          summary:
            "Finding problems before development: test methods, scenarios and objectives, completion, errors, time and satisfaction, think-aloud, A/B tests, heuristic evaluation, accessibility checks and prioritising fixes.",
          atoms: 16,
          topics: [
            "Usability and the methods for testing it",
            "Scenarios, objectives and the metrics of a test",
            "Think-aloud and A/B testing",
            "Heuristic evaluation and Nielsen's ten heuristics",
            "Analysing results, prioritising and iterating",
          ],
          curriculum: [
            ["11.1", "What is usability?"],
            ["11.2", "Usability testing fundamentals"],
            ["11.3", "Usability testing methods"],
            ["11.4", "Moderated and unmoderated testing"],
            ["11.5", "Remote and in-person testing"],
            ["11.6", "Creating usability test scenarios"],
            ["11.7", "Defining test objectives"],
            ["11.8", "Task completion rates"],
            ["11.9", "Error rates"],
            ["11.10", "Time on task"],
            ["11.11", "User satisfaction"],
            ["11.12", "Think-aloud testing"],
            ["11.13", "A/B testing fundamentals"],
            ["11.14", "Heuristic evaluation"],
            ["11.15", "Nielsen's 10 usability heuristics"],
            ["11.16", "Accessibility evaluation"],
            ["11.17", "Analysing test results"],
            ["11.18", "Prioritizing usability issues"],
            ["11.19", "Iterative design improvements"],
            ["11.P", "Practical: test a prototype with five users, document their challenges and improve the design"],
          ],
          project:
            "Test a prototype with five users, document their challenges and improve the design based on the findings.",
        },
        {
          id: "ux-m12-design-systems",
          order: 12,
          phase: 4,
          week: "Week 12",
          title: "Module 12 · Design Systems and Component Architecture",
          summary:
            "How professional teams stay consistent: design tokens, grid systems, atomic design, reusable components, variants and states, naming, shared libraries, documentation and scaling.",
          atoms: 16,
          topics: [
            "Design systems, style guides and design tokens",
            "Component architecture and atomic design",
            "Variants, states, naming and shared libraries",
            "Documentation, consistency and scale",
            "Accessibility standards inside a design system",
          ],
          curriculum: [
            ["12.1", "What is a design system?"],
            ["12.2", "Design systems versus style guides"],
            ["12.3", "Design tokens"],
            ["12.4", "Colour tokens"],
            ["12.5", "Typography tokens"],
            ["12.6", "Spacing tokens"],
            ["12.7", "Grid systems"],
            ["12.8", "Component architecture"],
            ["12.9", "Atomic design methodology: atoms, molecules, organisms, templates and pages"],
            ["12.10", "Reusable components"],
            ["12.11", "Component variants"],
            ["12.12", "Component states"],
            ["12.13", "Naming conventions"],
            ["12.14", "Shared libraries"],
            ["12.15", "Design documentation"],
            ["12.16", "Maintaining consistency"],
            ["12.17", "Scaling design systems"],
            ["12.18", "Introduction to accessibility standards within design systems"],
            ["12.P", "Practical: build a reusable design system for an e-commerce platform"],
          ],
          project: "Build a reusable design system for an e-commerce platform.",
        },
      ],
    },

    /* ═══════════════════════ MONTH 4 · WEEKS 13–16 ═════════════════════ */
    {
      month: 4,
      title: "Professional practice, product design and your career",
      focus: "Weeks 13–16",
      summary:
        "Phases 5 and 6. Accessibility, inclusive design and ethics; working with developers; designing real, complex products including AI interfaces; and the portfolio, freelancing and interviews that start a design career.",
      modules: [
        {
          id: "ux-m13-accessibility",
          order: 13,
          phase: 5,
          week: "Week 13",
          title: "Module 13 · Accessibility, Inclusive Design and Design Ethics",
          summary:
            "Designing for people with different abilities and circumstances: WCAG and POUR, contrast, type, keyboard, screen readers, focus, forms, impairments, literacy, culture, dark patterns and privacy.",
          atoms: 18,
          topics: [
            "Digital accessibility, inclusive design, WCAG and POUR",
            "Contrast, typography, keyboard, screen readers and focus",
            "Accessible forms, impairments and cognitive load",
            "Literacy, language and culture",
            "Ethics, dark patterns, privacy and user data",
          ],
          curriculum: [
            ["13.1", "Introduction to digital accessibility"],
            ["13.2", "Understanding inclusive design"],
            ["13.3", "WCAG fundamentals"],
            ["13.4", "POUR principles: perceivable, operable, understandable and robust"],
            ["13.5", "Colour contrast requirements"],
            ["13.6", "Accessible typography"],
            ["13.7", "Keyboard navigation considerations"],
            ["13.8", "Screen reader considerations"],
            ["13.9", "Focus indicators"],
            ["13.10", "Accessible forms"],
            ["13.11", "Designing for visual impairments"],
            ["13.12", "Designing for motor impairments"],
            ["13.13", "Cognitive accessibility"],
            ["13.14", "Designing for different literacy levels"],
            ["13.15", "Cultural and linguistic considerations"],
            ["13.16", "Ethical design"],
            ["13.17", "Dark patterns and deceptive interfaces"],
            ["13.18", "Privacy-conscious design"],
            ["13.19", "Responsible use of user data"],
            ["13.P", "Practical: audit an existing website for accessibility issues and redesign problematic sections"],
          ],
          project:
            "Audit an existing website for accessibility issues and redesign problematic sections.",
        },
        {
          id: "ux-m14-handoff",
          order: 14,
          phase: 5,
          week: "Week 14",
          title: "Module 14 · Developer Handoff and UI/UX Collaboration",
          summary:
            "Working with frontend and backend developers: the development lifecycle, HTML and CSS from a designer's view, Flexbox and Grid, specs, inspection, export, documentation, Git, feedback and Agile.",
          atoms: 15,
          topics: [
            "The development lifecycle and the designer-developer relationship",
            "HTML, CSS, Flexbox and Grid for designers",
            "Design-to-code translation and practical precision",
            "Inspection, measurement, export, specs and documentation",
            "Communication, Git, feedback and Agile teams",
          ],
          curriculum: [
            ["14.1", "Understanding the software development lifecycle"],
            ["14.2", "The designer-developer relationship"],
            ["14.3", "Understanding HTML and CSS from a designer's perspective"],
            ["14.4", "Understanding layout implementation"],
            ["14.5", "CSS Flexbox and Grid fundamentals"],
            ["14.6", "Design-to-code translation"],
            ["14.7", "Pixel-perfect versus practical implementation"],
            ["14.8", "Inspecting Figma designs"],
            ["14.9", "Measuring dimensions and spacing"],
            ["14.10", "Exporting images, SVGs and icons"],
            ["14.11", "Developer handoff"],
            ["14.12", "Design specifications"],
            ["14.13", "Component documentation"],
            ["14.14", "Asset organization"],
            ["14.15", "Communicating design requirements"],
            ["14.16", "Working with Git and collaborative workflows"],
            ["14.17", "Design feedback and revisions"],
            ["14.18", "Working in Agile development teams"],
            ["14.P", "Practical: prepare a complete Figma design handoff package for a frontend developer"],
          ],
          project:
            "Prepare a complete Figma design handoff package for a frontend developer.",
        },
        {
          id: "ux-m15-product",
          order: 15,
          phase: 6,
          week: "Week 15",
          title: "Module 15 · Advanced Product Design and Real-World Applications",
          summary:
            "The complexity of real products: UX strategy, discovery, requirements, prioritisation and MVPs; dashboards, SaaS, FinTech, e-commerce, health and education; data visualisation; and AI interfaces.",
          atoms: 20,
          topics: [
            "Product design, UX strategy, discovery and requirements",
            "Prioritisation and MVP design",
            "Dashboards, SaaS, FinTech, e-commerce, health and education",
            "Data visualisation, complex forms and large datasets",
            "AI-powered and conversational interfaces",
          ],
          curriculum: [
            ["15.1", "Product design fundamentals"],
            ["15.2", "UX strategy"],
            ["15.3", "Product discovery"],
            ["15.4", "Defining product requirements"],
            ["15.5", "Feature prioritization"],
            ["15.6", "MVP design"],
            ["15.7", "Designing complex dashboards"],
            ["15.8", "SaaS product interfaces"],
            ["15.9", "Financial technology (FinTech) interfaces"],
            ["15.10", "E-commerce experiences"],
            ["15.11", "Healthcare interfaces"],
            ["15.12", "Educational technology interfaces"],
            ["15.13", "Data visualization fundamentals"],
            ["15.14", "Designing charts and analytical dashboards"],
            ["15.15", "Designing complex forms and workflows"],
            ["15.16", "Handling large datasets in interfaces"],
            ["15.17", "AI-powered product interfaces"],
            ["15.18", "Conversational interfaces and chatbots"],
            ["15.19", "Designing AI feedback and error states"],
            ["15.20", "Evaluating AI-generated design suggestions"],
            ["15.P", "Practical: a complete SaaS dashboard with authentication, navigation, analytics and settings"],
          ],
          project:
            "Design a complete SaaS dashboard with authentication, navigation, analytics and settings.",
        },
        {
          id: "ux-m16-career",
          order: 16,
          phase: 6,
          week: "Week 16",
          title: "Module 16 · Portfolio Development, Freelancing and Career Preparation",
          summary:
            "Entering the industry: roles, portfolios and case studies, Behance, Dribbble and your own site, remote work and freelancing, clients, briefs, pricing, proposals, interviews and continuous learning.",
          atoms: 22,
          topics: [
            "The design industry and its roles",
            "Portfolios and case studies that show your process",
            "Behance, Dribbble, your own site and finding work",
            "Clients, briefs, pricing, proposals and revisions",
            "Interviews and continuous learning",
          ],
          curriculum: [
            ["16.1", "Understanding the UI/UX design industry"],
            ["16.2", "UI designer versus UX designer versus product designer"],
            ["16.3", "Building a professional portfolio"],
            ["16.4", "Selecting portfolio projects"],
            ["16.5", "Writing design case studies"],
            ["16.6", "Documenting design decisions"],
            ["16.7", "Presenting the problem-solving process"],
            ["16.8", "Showcasing research and wireframes"],
            ["16.9", "Presenting prototypes"],
            ["16.10", "Demonstrating usability improvements"],
            ["16.11", "Behance portfolio"],
            ["16.12", "Dribbble fundamentals"],
            ["16.13", "Personal portfolio websites"],
            ["16.14", "Finding remote design opportunities"],
            ["16.15", "Freelancing platforms"],
            ["16.16", "Working with clients"],
            ["16.17", "Understanding design briefs"],
            ["16.18", "Client communication"],
            ["16.19", "Pricing design projects"],
            ["16.20", "Preparing design proposals"],
            ["16.21", "Handling feedback and revisions"],
            ["16.22", "Preparing for UI/UX interviews"],
            ["16.23", "Continuous learning and professional development"],
            ["16.P", "Final practical: develop and present three professional portfolio case studies"],
          ],
          project: "Develop and present three professional portfolio case studies.",
        },
      ],
    },
  ],

  capstone: {
    title: "Three Professional Portfolio Case Studies",
    summary:
      "Bring the course together in three case studies that show how you think: a researched problem, the decisions you made and why, the designs and prototypes that resulted, how you tested them, and what changed because of what you learned.",
    deliverables: [
      "Three case studies, each with a problem, your role, constraints and outcome",
      "Research evidence: interviews or surveys, personas and journey maps",
      "Information architecture and user flows",
      "Wireframes through to responsive high-fidelity designs in Figma",
      "An interactive prototype for at least one project",
      "Usability test results and the improvements they led to",
      "Accessibility checked to WCAG AA, with a design system or style guide",
      "A published portfolio (Behance, Dribbble or your own site) and a presentation",
    ],
  },

  certificate: {
    issuer: "Memora Smart Technologies",
    name: "UI/UX Design",
    covers: "Design thinking & research • Interaction & visual design • Figma & prototyping • Usability, systems & accessibility • Handoff & portfolio",
    idFormat: "MST-CERT-2026-000001",
    requirements: [
      "Complete every required lesson",
      "Pass every lesson check at 70% or above",
      "Complete the practical exercise that ends each module",
      "Complete and present three portfolio case studies",
      "Pass the final certification exam: 70% overall and at least 50% in every section",
    ],
  },

  checkpoints: [
    {
      afterMonth: 1,
      title: "Phase 1 checkpoint",
      format: "An evaluation of three real applications, a researched problem statement for a Nigerian digital service, and a visual style guide that passes WCAG contrast.",
      passMark: 70,
    },
    {
      afterMonth: 2,
      title: "Phase 2 checkpoint",
      format: "Research with five users, an evidence-based persona, a journey map, a site map and a complete user flow for an e-learning platform.",
      passMark: 70,
    },
    {
      afterMonth: 3,
      title: "Phases 3 and 4 checkpoint",
      format: "A responsive five-page website designed in Figma, an interactive banking prototype tested with five users, and an e-commerce design system.",
      passMark: 70,
    },
    {
      afterMonth: 4,
      title: "Final",
      format: "An accessibility audit, a developer handoff package, a SaaS dashboard, and three portfolio case studies presented.",
      passMark: 70,
    },
  ],
};

/** Every module id, in teaching order. The validator and tests read this. */
export const UIUX_DESIGN_MODULE_IDS = UIUX_DESIGN_COURSE.months.flatMap((m) =>
  m.modules.map((mod) => mod.id)
);

export default UIUX_DESIGN_COURSE;
