/**
 * UI/UX DESIGN · MODULE 1 · INTRODUCTION TO UI/UX DESIGN
 *
 * Curriculum 1.0 – 1.11 and the practical 1.P. What UI and UX are, how they
 * differ, how design fits into building software, the kinds of interface,
 * what users expect, the myths, good and bad design, and the design process.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

import { BASE, page, docPage, MD, CONTRAST } from "./ux-kit.js";
import { UIUX_DESIGN_COURSE } from "../uiuxDesignCourse.js";

export const SECTION_ID = "ux-s1-intro";

const MODULES = UIUX_DESIGN_COURSE.months.flatMap((m) => m.modules);

/* ── Lesson 1 lab: the first design change ─────────────────────────────── */
const BAKERY_HTML = page(
  "Ada's Bakery",
  `  <main class="card">
    <p class="eyebrow">Ada's Bakery · Surulere</p>
    <h1 class="title">Fresh bread, delivered before 8am</h1>
    <p class="body">Order by 9pm tonight and wake up to warm agege bread at your door.</p>
    <a class="button" href="order.html">Order for tomorrow</a>
  </main>`
);

const bakeryCss = (tokens) => `${BASE}
/* Design tokens: the named decisions this card is built from.
   Change these three values, not the rules below. */
:root {
${tokens}
}

.card {
  max-width: 420px;
  margin: 32px auto;
  padding: 24px;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
}

.eyebrow {
  margin: 0 0 8px;
  font-size: 14px;
  color: #4b5563;
}

.title {
  margin: 0 0 8px;
  font-size: var(--title-size);
  line-height: 1.2;
  color: #111827;
}

.body {
  margin: 0 0 24px;
  color: #374151;
}

.button {
  display: inline-block;
  padding: 12px 20px;
  border-radius: 8px;
  background: var(--brand);
  color: var(--on-brand);
  font-weight: 700;
  text-decoration: none;
}
`;

const BAKERY_CSS = bakeryCss(`  --brand: #fcd34d;      /* the button's colour */
  --on-brand: #ffffff;   /* the text on the button */
  --title-size: 18px;    /* the headline */`);

const BAKERY_CSS_DONE = bakeryCss(`  --brand: #fcd34d;      /* the button's colour */
  --on-brand: #1f2937;   /* dark text: yellow is a light colour */
  --title-size: 32px;    /* the headline */`);

/* ── Lesson 2 lab: UI and UX on one screen ─────────────────────────────── */
const POWER_HTML = page(
  "Buy electricity",
  `  <main class="pay">
    <h1>Buy electricity</h1>
    <form action="/pay" method="post">
      <input id="meter" name="meter" placeholder="Meter number">
      <input id="amount" name="amount" placeholder="Amount">
      <button class="btn" type="submit">Submit</button>
    </form>
  </main>`
);

const POWER_HTML_DONE = page(
  "Buy electricity",
  `  <main class="pay">
    <h1>Buy electricity</h1>
    <form action="/pay" method="post">
      <label for="meter">Meter number</label>
      <input id="meter" name="meter" inputmode="numeric" placeholder="e.g. 0123 4567 890">
      <label for="amount">Amount (₦)</label>
      <input id="amount" name="amount" inputmode="numeric" placeholder="e.g. 5000">
      <button class="btn" type="submit">Buy electricity</button>
    </form>
  </main>`
);

const POWER_CSS = `${BASE}
body { color: #111827; }

.pay {
  max-width: 420px;
  margin: 0 auto;
  padding: 24px 16px;
}

h1 { margin: 0 0 24px; font-size: 1.75rem; }

label {
  display: block;
  margin-bottom: 4px;
  font-weight: 700;
}

input {
  display: block;
  width: 100%;
  margin-bottom: 16px;
  padding: 12px;
  border: 1px solid #6b7280;
  border-radius: 8px;
  font: inherit;
}

.btn {
  padding: 4px 12px;
  border: 0;
  border-radius: 8px;
  background: #15803d;
  color: #ffffff;
  font: inherit;
  font-weight: 700;
}
`;

const POWER_CSS_DONE = POWER_CSS.replace(
  "  padding: 4px 12px;\n  border: 0;",
  "  width: 100%;\n  min-height: 48px;\n  padding: 12px 16px;\n  border: 0;"
);

/* ── Lesson 3 lab: a product brief ─────────────────────────────────────── */
const BRIEF_MD = `# Product brief: KoboSave

## Product
_One sentence: what is KoboSave and what does it do?_

## Users
-

## Problem
_What problem does it solve for those users?_

## Platforms
-

## Team
| Role | Responsible for |
|------|-----------------|
|      |                 |

## Success
_How will the team know it worked? Include a number._
`;

const BRIEF_MD_DONE = `# Product brief: KoboSave

## Product
KoboSave is a mobile savings app that lets traders put aside small amounts every day and lock them until a goal date.

## Users
- Market traders in Lagos and Onitsha who earn daily in cash
- Young salary earners who struggle to save before month end

## Problem
Daily earners have no simple way to save small amounts regularly, so money meant for rent or school fees is spent before it is needed.

## Platforms
- Android mobile application (most target users have Android phones)
- A simple web dashboard for the support team

## Team
| Role | Responsible for |
|------|-----------------|
| Product manager | Decides what to build first and why, and owns the roadmap |
| UI/UX designer | Researches users, designs flows, screens and prototypes, and tests them |
| Frontend developer | Builds the screens the designer specified, for Android and the web |
| Backend developer | Builds the server, database and payment integrations behind the screens |
| QA tester | Checks every release against the requirements before it ships |

## Success
Within three months of launch, 2,000 active savers, and at least 60% of new users complete their first deposit within one day.
`;

/* ── Lesson 4 lab: meeting expectations ────────────────────────────────── */
const SHOP_HTML = page(
  "Mama Put Market",
  `  <header class="top">
    <a class="cart" href="cart.html">Basket of joy (2)</a>
    <span class="logo">Mama Put Market</span>
    <nav class="links">
      <a href="deals.html">Deals</a>
      <a href="help.html">Help</a>
    </nav>
  </header>
  <main class="content">
    <h1>Fresh produce, delivered in Abuja</h1>
    <p>Rice, yam, tomatoes and pepper from local farms, at market prices.</p>
  </main>`
);

const SHOP_HTML_DONE = page(
  "Mama Put Market",
  `  <header class="top">
    <a class="logo" href="/">Mama Put Market</a>
    <form class="search" role="search" action="/search">
      <input type="search" name="q" aria-label="Search products" placeholder="Search rice, yam, pepper…">
    </form>
    <nav class="links">
      <a href="deals.html">Deals</a>
      <a href="help.html">Help</a>
    </nav>
    <a class="cart" href="cart.html">Cart (2)</a>
  </header>
  <main class="content">
    <h1>Fresh produce, delivered in Abuja</h1>
    <p>Rice, yam, tomatoes and pepper from local farms, at market prices.</p>
  </main>`
);

const SHOP_CSS = `${BASE}
body { color: #111827; }

.top {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px 24px;
  border-bottom: 1px solid #e5e7eb;
}

.top a { color: #065f46; font-weight: 700; text-decoration: none; }
.logo { font-size: 1.25rem; font-weight: 700; color: #065f46; }
.links { display: flex; gap: 16px; }

.content { max-width: 720px; padding: 32px 24px; }
`;

const SHOP_CSS_DONE = `${SHOP_CSS}
.search { flex: 1; max-width: 420px; }
.search input { width: 100%; padding: 10px 12px; border: 1px solid #6b7280; border-radius: 8px; font: inherit; }
.cart { margin-left: auto; }
`;

/* ── Lesson 5 lab: reviewing three applications ────────────────────────── */
const REVIEW_MD = `# UI and UX review of three applications

## App 1:
- UI strength:
- UI weakness:
- UX strength:
- UX weakness:

## App 2:
- UI strength:
- UI weakness:
- UX strength:
- UX weakness:

## App 3:
- UI strength:
- UI weakness:
- UX strength:
- UX weakness:

## What I learned
`;

const REVIEW_MD_DONE = `# UI and UX review of three applications

## App 1: A ride-hailing app
- UI strength: The map fills the screen and the single "Where to?" field is the most obvious thing on it.
- UI weakness: Grey price text on a white sheet is hard to read in sunlight.
- UX strength: Booking a ride takes three taps and the driver's arrival time updates live.
- UX weakness: Cancelling a ride is hidden behind two menus, and the cancellation fee is shown only afterwards.

## App 2: A mobile banking app
- UI strength: Consistent colours: green for money in, red for money out, with signs as well as colour.
- UI weakness: Eight icons of the same size on the home screen, so nothing stands out.
- UX strength: Saved beneficiaries make a repeat transfer quick.
- UX weakness: A failed transfer shows "Error 91" with no explanation and no next step.

## App 3: An online store
- UI strength: Large product photos and a clear price on every card.
- UI weakness: The "Add to cart" button changes colour between pages.
- UX strength: Delivery cost and date are shown before checkout.
- UX weakness: Account creation is forced before you can pay, which made me abandon the cart.

## What I learned
Good visual design did not guarantee a good experience: the banking app looked polished but left me stuck when something went wrong. The best experiences told me what would happen before it happened and helped me recover from mistakes.
`;

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 1 · 1.0
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ux-l1-welcome",
    moduleId: "ux-m1-intro",
    sectionId: SECTION_ID,
    order: 1,
    covers: ["1.0"],
    title: "Welcome: What You Will Design",
    subtitle: "The course, the road ahead, and your first design change",
    estimatedMinutes: 18,
    intro:
      "Every app you use was designed by someone who decided what it should do, how it should be organised and how it should look. In sixteen weeks you will learn to make those decisions well, prove them with real users, and hand them to developers. This lesson shows you the road, then has you make your first design change.",

    atoms: [
      {
        id: "a-ux-welcome",
        title: "What you will be able to do",
        explain:
          "By the end of this course you will be able to take a vague idea (\"we want an app that helps traders save\"), research the people it is for, decide what the product should do and how it should be organised, design its screens in Figma, make an interactive prototype, test it with real users, fix what they struggle with, and hand the result to developers with everything they need to build it. You will finish with three portfolio case studies that show employers or clients exactly how you work.",
        why: "Design is a decision-making job. Tools change every few years; the ability to decide well, with evidence, is what people hire.",
      },
      {
        id: "a-ux-welcome-phases",
        title: "Six phases, sixteen weeks",
        explain:
          "The course follows the order real design work happens in. First the foundations: what design is, how designers think, and the visual basics. Then UX: understanding users and structuring the experience. Then UI: building screens in Figma for every device. Then proving and scaling: prototypes, testing and design systems. Then professional practice: accessibility, ethics and working with developers. Finally, real products and your career.",
        table: {
          caption: "The six phases of the course.",
          headers: ["Phase", "Focus", "Weeks"],
          rows: UIUX_DESIGN_COURSE.phases.map((ph) => [
            `Phase ${ph.phase}`,
            ph.title.charAt(0).toUpperCase() + ph.title.slice(1),
            ph.weeks.length > 1 ? `${ph.weeks[0]}–${ph.weeks[ph.weeks.length - 1]}` : String(ph.weeks[0]),
          ]),
        },
      },
      {
        id: "a-ux-welcome-roadmap",
        title: "The whole road, module by module",
        explain:
          "Here is every module and the practical exercise that ends it. Each practical builds something you can show: by Module 16 those pieces become your portfolio. Projects are made in Figma (you set it up in Module 7) and in FigJam, Google Forms and spreadsheets for research. Every lesson also has practice in the design lab below the lesson, checked the moment you finish.",
        table: {
          caption: "Every module and its practical exercise.",
          headers: ["Module", "Topic", "Practical"],
          rows: MODULES.map((m) => [m.title.split(" · ")[0], m.title.split(" · ")[1], m.project]),
        },
      },
      {
        id: "a-ux-welcome-lab",
        title: "How the design lab works",
        explain:
          "Most lessons end with a lab: a real interface or a real design document you change while a live preview shows the result at phone, tablet and laptop sizes. \"Check my work\" then measures what you made: whether text is readable against its background, whether buttons are big enough to tap, whether spacing follows a system, whether a layout survives a phone. The checks measure; they do not guess your taste. Your first lab uses design tokens: named values such as --brand that a whole interface is built from, so changing one value changes every place it is used. You will meet tokens properly in Modules 3 and 12.",
        webLab: {
          task:
            "Ada's Bakery has a card for its delivery service, and it has two problems you can fix by changing tokens only. The white button text is unreadable on yellow, and the headline is barely bigger than the paragraph under it. In style.css, change --on-brand so the button text passes the readability ratio (4.5:1, explained in Module 3), and change --title-size so the headline is at least 28px. Do not change the rules under the tokens.",
          files: { "index.html": BAKERY_HTML, "style.css": BAKERY_CSS },
          readOnly: ["index.html"],
          tests: [
            { label: "The button text is readable on the button (4.5:1 or better)", check: CONTRAST + "return ratio('.button') >= 4.5;", fail: "Yellow is a light colour, so white text disappears on it. Try a very dark --on-brand such as #1f2937." },
            { label: "The headline is at least 28px", check: "return px(style('.title', 'font-size')) >= 28;", fail: "Set --title-size to 28px or more, for example 32px." },
            { label: "The headline is the largest text on the card", check: "return ['.eyebrow', '.body', '.button'].every((s) => px(style('.title', 'font-size')) > px(style(s, 'font-size')));", fail: "The headline should be clearly bigger than everything else." },
            { label: "The rules still use the tokens", check: String.raw`const c = code('style.css'); return /background:\s*var\(--brand\)/.test(c) && /color:\s*var\(--on-brand\)/.test(c) && /font-size:\s*var\(--title-size\)/.test(c);`, fail: "Change the values in :root, not the rules that use them." },
          ],
          solution: { "style.css": BAKERY_CSS_DONE },
          hint: "Readability depends on lightness: light colours need dark text, dark colours need light text.",
          successMessage: "Two values changed and the card now says clearly what matters most, in text everyone can read. That is the whole idea of design tokens.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 2 · 1.1 – 1.3
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ux-l2-ui-ux",
    moduleId: "ux-m1-intro",
    sectionId: SECTION_ID,
    order: 2,
    covers: ["1.1", "1.2", "1.3"],
    title: "UI Design, UX Design and the Difference",
    subtitle: "What people see and touch, and what they go through",
    estimatedMinutes: 22,
    intro:
      "\"UI/UX\" is written as one word so often that people forget it names two different things. They overlap and depend on each other, but they answer different questions, and a product can be good at one and bad at the other.",

    atoms: [
      {
        id: "a-ux-what-is-ui",
        title: "What is user interface design?",
        explain:
          "The user interface (UI) is everything a person sees, hears and touches to use a product: screens, buttons, text, icons, colours, menus, form fields, sounds and animations. UI design decides how each of those looks and behaves: which colour the main button is, how big the text is, how the screen is laid out, what a field looks like when you tap it or when it has an error. A UI designer's materials are layout, typography, colour, imagery and interactive components, and their goal is an interface that is clear, consistent, attractive and easy to operate.",
        example:
          "UI decisions on one \"Send money\" screen:\n- The amount is shown in 40px bold text, because it is the most important thing\n- The Send button is the only filled green button\n- Field labels sit above the fields, not inside them\n- An error turns the field border red AND shows a message",
      },
      {
        id: "a-ux-what-is-ux",
        title: "What is user experience design?",
        explain:
          "User experience (UX) is everything a person goes through when they use a product to get something done: whether they can find what they need, understand what to do, finish their task, recover from mistakes, and how they feel before, during and after. UX design shapes that experience: researching who the users are and what they need, deciding which features exist, organising content, designing the steps of each task (the flow), and testing with real people. Much of UX happens before any screen is drawn, and some of it (such as a confirmation SMS or a refund policy) is not on a screen at all.",
        example:
          "UX decisions for the same feature:\n- Research shows most users send money to the same five people → add saved beneficiaries\n- Users fear sending to the wrong account → show the account name before confirming\n- Network failures are common → say clearly whether money left the account, and what to do",
      },
      {
        id: "a-ux-ui-vs-ux",
        title: "Differences between UI and UX",
        explain:
          "A simple way to hold the difference: UX decides what the product does and how the journey works; UI decides how each step looks and feels to operate. UX asks \"can people achieve their goal, easily?\"; UI asks \"is this screen clear, consistent and pleasant to use?\". They depend on each other. A beautiful app with a confusing flow fails (good UI, bad UX), and a well-planned flow with unreadable text and tiny buttons fails too (good UX, bad UI). In small teams one person usually does both, which is why the job is often called UI/UX or product design.",
        table: {
          caption: "UI and UX side by side.",
          headers: ["", "UX design", "UI design"],
          rows: [
            ["Main question", "Can people achieve their goal easily?", "Is each screen clear and pleasant to operate?"],
            ["Typical work", "Research, personas, flows, site maps, testing", "Layout, type, colour, components, visual states"],
            ["Typical outputs", "Journey maps, user flows, wireframes, test reports", "High-fidelity screens, style guides, design systems"],
            ["Measured by", "Task success, time, errors, satisfaction", "Readability, consistency, accessibility, brand fit"],
          ],
        },
        why: "Clients often ask for \"a nicer design\" when the real problem is the flow. Knowing the difference lets you fix the right thing.",
      },
      {
        id: "a-ux-ui-ux-lab",
        title: "Seeing both on one screen",
        explain:
          "Look at any screen with both lenses. The UX lens asks: does the person know what each field wants, does the button say what will happen, will their phone show the right keyboard? The UI lens asks: can they see and hit the button easily, does the most important action stand out? Often a single screen fails both ways, and the fixes are small.",
        webLab: {
          task:
            "This electricity purchase screen has UX and UI problems. Fix both. UX (in index.html): give each field a visible <label> connected to it with for and id (placeholders vanish when you type, so they are not labels); make the button say what it will do instead of \"Submit\"; add inputmode=\"numeric\" to both fields so phones show the number keypad. UI (in style.css): make the button at least 44px tall and as wide as the form, so it is easy to see and tap.",
          files: { "index.html": POWER_HTML, "style.css": POWER_CSS },
          tests: [
            { label: "Both fields have a visible, connected label", check: "return ['#meter', '#amount'].every((s) => $(s) && $(s).labels.length > 0 && visible($(s).labels[0]) && text($(s).labels[0]).length > 2);", fail: "Add <label for=\"meter\">Meter number</label> before the meter field, and the same for amount." },
            { label: "The button says what will happen", check: "const t = text('.btn'); return /buy|pay/i.test(t) && !/submit/i.test(t);", fail: "Use words like \"Buy electricity\" or \"Pay now\"." },
            { label: "Both fields bring up the number keypad", check: "return ['#meter', '#amount'].every((s) => $(s).getAttribute('inputmode') === 'numeric' || $(s).type === 'number');", fail: "Add inputmode=\"numeric\" to both inputs." },
            { label: "The button is at least 44px tall", check: "return rect('.btn').height >= 44;", fail: "Give .btn a min-height of 44px or more, or bigger padding." },
            { label: "On a phone the button is as wide as the form", viewport: "mobile", check: "return rect('.btn').width >= rect('form').width - 1;", fail: "Give .btn width: 100%." },
          ],
          solution: { "index.html": POWER_HTML_DONE, "style.css": POWER_CSS_DONE },
          hint: "Labels and button words are UX: they decide whether people understand. Size is UI: it decides whether they can operate it.",
          successMessage: "Same screen, same colours, but now people know what to type, get the right keyboard, and can hit a button that says what it does.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 3 · 1.4 – 1.6
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ux-l3-teams-products",
    moduleId: "ux-m1-intro",
    sectionId: SECTION_ID,
    order: 3,
    covers: ["1.4", "1.5", "1.6"],
    title: "Design, Engineering and Digital Products",
    subtitle: "Where a designer fits, and what exactly is being designed",
    estimatedMinutes: 22,
    intro:
      "Designers do not work alone. Every screen you design is built by developers, decided with product managers and checked by testers. This lesson places design inside software development, describes the designer's job in a team, and defines the thing you are all making: a digital product.",

    atoms: [
      {
        id: "a-ux-design-engineering",
        title: "UI/UX design and software engineering",
        explain:
          "Software engineering turns ideas into working software: planning, writing code, testing and releasing it. Design feeds that process at every stage. Before code, research and prototypes decide what is worth building, which is far cheaper than discovering a wrong idea after developers have spent months on it. During development, designs and specifications tell developers what to build, and designers answer the questions that come up. After release, analytics and testing show what to improve next. Designers who understand how software is built (Module 14) design things that can actually be built, on time.",
        why: "A change in a Figma file takes minutes. The same change after release can take weeks of engineering. Design is where mistakes are cheapest.",
      },
      {
        id: "a-ux-designer-role",
        title: "The designer's role in a development team",
        explain:
          "A typical product team has a product manager (decides what to build and why), designers (decide how it works and looks for the user), frontend developers (build what users see), backend developers (build the server, data and integrations behind it) and testers (check it works). The designer's job is to represent the user in that room: bring research into decisions, turn requirements into flows and screens, prototype and test ideas, specify every state a developer must build, and review the built product against the design. A designer who disappears after handing over a file is doing half the job.",
        decision: {
          scenario: "The product manager asks for a new \"Refer a friend\" feature to be designed by Friday. Nobody knows whether users would actually refer friends, or why.",
          question: "What is the most useful thing the designer can do first?",
          options: [
            { id: "a", text: "Ask what problem the feature solves and spend a little time talking to users, then design", why: "Even a few quick conversations reveal whether people would refer, what they would need, and what would put them off. Design without that is guessing." },
            { id: "b", text: "Start designing beautiful screens immediately so Friday is met", whyWrong: "Speed matters, but polished screens for an unvalidated idea are the most expensive kind of guess." },
            { id: "c", text: "Refuse until a full research study is complete", whyWrong: "A week of research is rarely needed to start. Small, fast evidence is enough to begin and adjust." },
            { id: "d", text: "Copy another app's referral screens exactly", whyWrong: "Another app's users, incentives and constraints are different. Learn from it, but do not assume it fits." },
          ],
          correct: "a",
          aftermath: "Asking \"what problem does this solve, for whom?\" before designing is the habit that separates designers from decorators.",
        },
      },
      {
        id: "a-ux-digital-products",
        title: "Understanding digital products",
        explain:
          "A digital product is software that people use to get something done or to enjoy something: a banking app, a school portal, an online store, a ride-hailing service, a game. Every digital product has users with goals, a business with goals (revenue, growth, lower costs), and constraints (budget, technology, regulation, time). Good design meets the users' goals in a way that also serves the business. A product is never finished: teams release, measure and improve it continuously, which is why design is a cycle rather than a one-off job.",
        table: {
          caption: "One product, three kinds of goal.",
          headers: ["Product", "User goal", "Business goal", "Constraint"],
          rows: [
            ["A savings app", "Save small amounts without temptation", "Grow deposits", "Central bank regulation"],
            ["An online store", "Find and buy the right item quickly", "Sell more, return less", "Delivery costs"],
            ["A school portal", "Check results and pay fees", "Fewer queues at the bursary", "Old phones, poor networks"],
          ],
        },
      },
      {
        id: "a-ux-brief-lab",
        title: "Putting it together: a product brief",
        explain:
          "Teams agree what they are building in a product brief: what the product is, who it is for, what problem it solves, where it runs, who does what, and how success will be measured. Writing one is a designer's first act on a new project, because every later decision is checked against it. A success measure must include a number, otherwise nobody can tell whether the product worked.",
        webLab: {
          task:
            "Write the product brief for KoboSave, a savings app for daily earners such as market traders. Complete brief.md: a Product sentence of at least 8 words; at least two user groups under Users; the Problem in at least 12 words; at least one platform under Platforms; a Team table with at least four roles, including a product manager, a UI/UX designer, a frontend developer and a backend developer, each with what they are responsible for; and a Success measure that contains a number.",
          files: {
            "index.html": docPage("KoboSave product brief", "brief.md", [
              "Product: one sentence, at least 8 words",
              "Users: at least two bullet points",
              "Problem: at least 12 words",
              "Platforms: at least one bullet point",
              "Team: a table with at least four roles and their responsibilities",
              "Success: a measure that includes a number",
            ]),
            "brief.md": BRIEF_MD,
          },
          readOnly: ["index.html"],
          tests: [
            { label: "Product: one sentence of at least 8 words", check: MD + String.raw`const s = section('brief.md', 'Product'); return words(s.replace(/_[^_]*_/g, '')) >= 8;`, fail: "Replace the italic prompt with a sentence such as \"KoboSave is a mobile app that…\"." },
            { label: "Users: at least two user groups", check: MD + "return bullets(section('brief.md', 'Users')).length >= 2;", fail: "Add two \"- \" lines, one per user group." },
            { label: "Problem: at least 12 words", check: MD + String.raw`return words(section('brief.md', 'Problem').replace(/_[^_]*_/g, '')) >= 12;`, fail: "Describe the problem the users have, in a sentence or two." },
            { label: "Platforms: at least one", check: MD + "return bullets(section('brief.md', 'Platforms')).length >= 1;", fail: "Add \"- Android mobile application\" or similar." },
            { label: "Team: product manager, designer, frontend and backend developer, each with a responsibility", check: MD + String.raw`const r = rows(section('brief.md', 'Team')).filter((c) => c[0] && words(c[1]) >= 3); const has = (re) => r.some((c) => re.test(c[0])); return r.length >= 4 && has(/product/i) && has(/design/i) && has(/front/i) && has(/back/i);`, fail: "Each row needs a role and at least three words saying what that role is responsible for." },
            { label: "Success: a measurable target", check: MD + String.raw`const s = section('brief.md', 'Success').replace(/_[^_]*_/g, ''); return words(s) >= 6 && !Number.isNaN(num(s));`, fail: "Write a target with a number, such as \"2,000 active savers within three months\"." },
          ],
          solution: { "brief.md": BRIEF_MD_DONE },
          hint: "Think about who earns money daily in cash and why saving is hard for them. The team table describes who does what, not names.",
          successMessage: "A one-page brief that every later design decision can be checked against. Keep the habit: every project in this course starts with one.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 4 · 1.7 – 1.9
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ux-l4-interfaces-users",
    moduleId: "ux-m1-intro",
    sectionId: SECTION_ID,
    order: 4,
    covers: ["1.7", "1.8", "1.9"],
    title: "Interfaces, Users and Misconceptions",
    subtitle: "The kinds of interface you will design, what users expect, and the myths to drop",
    estimatedMinutes: 24,
    intro:
      "A shopping website, a banking app and a hospital dashboard are all interfaces, but they are used in different places, on different devices, by people with different goals. This lesson surveys the kinds of interface, explains why meeting expectations matters so much, and clears away some common myths about design.",

    atoms: [
      {
        id: "a-ux-interface-types",
        title: "Types of interfaces",
        explain:
          "Websites are mostly for reading and finding information, opened in a browser. Mobile applications are installed on phones, used with thumbs, often on the move and on slow networks. Desktop applications run on a computer with a mouse and keyboard, for long, focused work (design tools, accounting software). Web applications run in a browser but behave like software: you log in and do tasks (email, online banking, school portals). Enterprise dashboards show many numbers and tools to staff who use them all day. E-commerce platforms guide people from browsing to paying, where every extra step loses sales. Each has its own conventions, which later modules cover one by one.",
        table: {
          caption: "The main kinds of interface and what shapes their design.",
          headers: ["Interface", "Typical use", "What shapes the design"],
          rows: [
            ["Website", "Reading and finding information", "Clear navigation, scannable content, every screen size"],
            ["Mobile application", "Quick tasks on the move", "Thumbs, small screens, poor networks, interruptions"],
            ["Desktop application", "Long, focused work", "Mouse and keyboard, shortcuts, dense information"],
            ["Web application", "Logged-in tasks in a browser", "Accounts, forms, states, data that changes"],
            ["Enterprise dashboard", "Monitoring and managing all day", "Data density, filters, efficiency for experts"],
            ["E-commerce platform", "Browsing, choosing and paying", "Trust, product imagery, a short checkout"],
          ],
        },
      },
      {
        id: "a-ux-user-expectations",
        title: "Understanding users and their expectations",
        explain:
          "Users arrive with expectations formed by every other product they have used. They expect the logo at the top left to take them home, the cart at the top right, a magnifying glass to mean search, underlined blue text to be a link, and a red message to mean something went wrong. Meeting those expectations makes a product feel easy without anyone noticing; breaking them makes people hesitate, hunt and give up. Users are also busy, distracted and goal-focused: they scan rather than read, and they do not want to learn your interface. You are not your user: your knowledge of the product makes it look obvious to you in a way it is not to them.",
        why: "People spend most of their time on other products. Your product should work the way those have taught them to expect, unless you have a very good reason not to.",
      },
      {
        id: "a-ux-misconceptions",
        title: "Common UI/UX design misconceptions",
        explain:
          "\"Design is about making things pretty.\" Looks matter, but design is mainly about making things work for people. \"UX is just wireframes.\" UX includes research, structure, flows, content and testing. \"I am a user, so I know what users want.\" Your knowledge makes you the least typical user. \"Users will read the instructions.\" They will not; the interface must explain itself. \"More features make a better product.\" Every feature adds complexity; often the best design removes things. \"Design happens once, at the start.\" Products are designed, released, measured and redesigned continuously. \"You need to be artistic.\" Most of the job is clear thinking, empathy and evidence.",
        decision: {
          scenario: "A founder says: \"I use apps every day, so I don't need research. I already know what our users want.\"",
          question: "What is the best response?",
          options: [
            { id: "a", text: "Explain that knowing the product makes them an untypical user, and propose a few quick interviews with real target users", why: "Founders know their product too well to see it as a newcomer does. A handful of interviews is cheap and usually changes something important." },
            { id: "b", text: "Agree: experienced app users make good judges of design", whyWrong: "Experience with apps does not tell you what this product's users need, know, or struggle with." },
            { id: "c", text: "Insist on a six-month research study before any design", whyWrong: "Out of proportion. Small, fast research is enough to start." },
            { id: "d", text: "Ignore the founder and do research secretly", whyWrong: "Design works with stakeholders, not around them. Make the case openly." },
          ],
          correct: "a",
          aftermath: "\"You are not your user\" is one of the oldest lessons in UX, and one of the most often forgotten.",
        },
      },
      {
        id: "a-ux-expectations-lab",
        title: "Meeting expectations in a real header",
        explain:
          "A shop header is a good test of expectations, because almost every shop on the web has trained people the same way: logo on the left, linking home; search in the middle or near it; the cart on the far right, called a cart (or bag, or basket) with a count. Creative alternatives cost people time on every visit.",
        webLab: {
          task:
            "The Mama Put Market header breaks what shoppers expect. Fix it in index.html (and style.css where needed): make the logo a link to the home page (href=\"/\") and the first item on the left; move the cart to the far right and call it \"Cart\" with its count; and add a search field to the header that has an accessible name (an aria-label or a label), so people who rely on screen readers know what it is.",
          files: { "index.html": SHOP_HTML, "style.css": SHOP_CSS },
          tests: [
            { label: "The logo is a link to the home page", check: String.raw`const l = $('.logo'); return !!l && l.tagName === 'A' && /^(\/|\.\/|index\.html)$/.test(l.getAttribute('href') || '');`, fail: "Change the span to <a class=\"logo\" href=\"/\">Mama Put Market</a>." },
            { label: "The logo is the left-most item in the header", check: "const L = rect('.logo').left; return $$('.top a, .top input, .top button').every((n) => n === $('.logo') || rect(n).left > L);", fail: "Put the logo first inside the header." },
            { label: "The cart sits at the far right", check: "const top = rect('.top'), c = rect('.cart'); return c.left > top.left + top.width / 2 && top.right - c.right <= 40;", fail: "Put the cart last in the header and give it margin-left: auto." },
            { label: "The cart is called a cart", check: "return /cart/i.test(text('.cart'));", fail: "Rename \"Basket of joy\" to \"Cart (2)\"." },
            { label: "The header has a search field with an accessible name", check: "const s = $('.top input[type=\"search\"]'); return !!s && nameOf(s).length > 2;", fail: "Add <input type=\"search\" aria-label=\"Search products\"> inside the header." },
          ],
          solution: { "index.html": SHOP_HTML_DONE, "style.css": SHOP_CSS_DONE },
          hint: "In a flex row, margin-left: auto on an item pushes it to the far right.",
          successMessage: "Nothing clever, and that is the point: every shopper already knows how to use this header.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 5 · 1.10, 1.11, 1.P
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ux-l5-good-bad-process",
    moduleId: "ux-m1-intro",
    sectionId: SECTION_ID,
    order: 5,
    covers: ["1.10", "1.11", "1.P"],
    title: "Good Design, Bad Design and the Design Process",
    subtitle: "Learning to see, and the steps every project follows",
    estimatedMinutes: 26,
    intro:
      "Designers learn to see what most people only feel: why one app is effortless and another is frustrating. This lesson trains that eye with examples, introduces the design process this course follows, and ends with your first practical: reviewing three real applications.",

    atoms: [
      {
        id: "a-ux-good-bad",
        title: "Examples of good and bad interface design",
        explain:
          "Good design is mostly invisible: you finish your task and do not think about the interface at all. Bad design makes you stop and think. Common signs of bad design: buttons that do not look tappable, labels that disappear as you type, error messages such as \"Error 91\" with no next step, important actions hidden in menus, pale grey text you cannot read in sunlight, and surprise costs at the end of checkout. Common signs of good design: one obvious next step on each screen, plain-language labels, feedback after every action, mistakes that are easy to undo, and information shown before you need to decide (delivery cost before checkout, the account name before you send money).",
        table: {
          caption: "The same moment, designed badly and well.",
          headers: ["Moment", "Bad", "Good"],
          rows: [
            ["A transfer fails", "\"Error 91\"", "\"The bank did not respond. No money left your account. Try again.\""],
            ["Entering a phone number", "Placeholder-only field, full keyboard", "Visible label, number keypad, format example"],
            ["Checkout", "Delivery fee appears on the last screen", "Delivery fee and date shown on the product page"],
            ["Deleting something", "Deleted instantly, no way back", "\"Deleted. Undo\" for ten seconds"],
          ],
        },
      },
      {
        id: "a-ux-design-process",
        title: "Introduction to the design process",
        explain:
          "Most design work follows the same broad steps, whatever a team calls them. Understand: research the users, the business and the problem. Define: decide exactly which problem to solve and what success looks like. Ideate: explore many possible solutions. Design: structure the solution (flows, site maps, wireframes) and then the interface. Prototype and test: make it clickable and watch real people use it. Build and measure: work with developers to release it and learn from how it is used. The steps loop: testing often sends you back to define or design. Module 2 turns this into the five stages of design thinking.",
        example:
          "Understand → Define → Ideate → Design → Prototype & test → Build & measure\n     ↑                                                  │\n     └──────────── learn and go round again ────────────┘",
      },
      {
        id: "a-ux-review-lab",
        title: "Practical: reviewing three applications",
        explain:
          "To review an app as a designer, use it for a real task and note what helped and what got in the way, separately for UI (what you saw and touched) and UX (whether you could achieve your goal, and how it felt). Be specific: \"the price text is grey on white and hard to read outside\" is useful; \"the colours are bad\" is not. Every weakness you can name precisely is a design problem you now know how to look for.",
        webLab: {
          task:
            "Choose three popular applications you have used (for example a bank app, a ride-hailing app and an online store). In review.md, give each app a name after \"App 1:\", \"App 2:\" and \"App 3:\", and complete its four lines: one UI strength, one UI weakness, one UX strength and one UX weakness, each at least six words and specific. Finish with \"What I learned\": at least 25 words on what the three reviews taught you.",
          files: {
            "index.html": docPage("Review of three applications", "review.md", [
              "Name each app after \"App 1:\", \"App 2:\" and \"App 3:\"",
              "For each app: a UI strength, a UI weakness, a UX strength and a UX weakness, each at least six words",
              "\"What I learned\": at least 25 words",
            ]),
            "review.md": REVIEW_MD,
          },
          readOnly: ["index.html"],
          tests: [
            { label: "Three apps, each with a name", check: MD + String.raw`const h = headings('review.md', 2).filter((x) => /^App\s*\d/i.test(x)); return h.length >= 3 && h.every((x) => /^App\s*\d\s*:\s*\S+/.test(x));`, fail: "Write a name after each \"App N:\" heading." },
            { label: "Every app has a UI strength and a UI weakness of at least six words", check: MD + String.raw`const blocks = raw('review.md').replace(/\r/g, '').split(/\n(?=## )/).filter((b) => /^## App/i.test(b)); const has = (b, re) => bullets(b).some((l) => re.test(l) && words(l.replace(re, '')) >= 6); return blocks.length >= 3 && blocks.every((b) => has(b, /^UI strength:/i) && has(b, /^UI weakness:/i));`, fail: "Complete both UI lines for all three apps, specifically." },
            { label: "Every app has a UX strength and a UX weakness of at least six words", check: MD + String.raw`const blocks = raw('review.md').replace(/\r/g, '').split(/\n(?=## )/).filter((b) => /^## App/i.test(b)); const has = (b, re) => bullets(b).some((l) => re.test(l) && words(l.replace(re, '')) >= 6); return blocks.length >= 3 && blocks.every((b) => has(b, /^UX strength:/i) && has(b, /^UX weakness:/i));`, fail: "Complete both UX lines for all three apps: could you achieve your goal, and how did it feel?" },
            { label: "What I learned: at least 25 words", check: MD + "return words(section('review.md', 'What I learned')) >= 25;", fail: "Write a short paragraph under \"What I learned\"." },
          ],
          solution: { "review.md": REVIEW_MD_DONE },
          hint: "UI is what you saw and touched. UX is whether you got what you came for, and how it felt.",
          successMessage: "Three real reviews, separated into UI and UX. You are already seeing what most users only feel.",
        },
      },
    ],

    task: {
      title: "Module 1 practical: examine three popular applications",
      intro: "Do this on your own phone and laptop, with apps you really use.",
      prompts: [
        "Choose three popular applications of different kinds (for example a bank app, a ride-hailing or delivery app, and an online store).",
        "Use each one for a real task from start to finish, and take screenshots of the key screens.",
        "For each app, list its UI strengths and weaknesses (what you see and touch) and its UX strengths and weaknesses (whether you can achieve your goal, and how it feels).",
        "Mark one moment in each app that is badly designed and describe how you would improve it.",
        "Present your review to a friend in five minutes, and keep it: it is the start of your portfolio thinking.",
      ],
      closing: "Module 2 turns this habit of looking into a process: design thinking.",
    },

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
