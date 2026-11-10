/**
 * UI/UX DESIGN · MODULE 15 · ADVANCED PRODUCT DESIGN AND REAL-WORLD APPLICATIONS
 *
 * Curriculum 15.1 – 15.20 and the practical 15.P. Product design, UX
 * strategy, discovery, requirements, prioritisation and MVPs; dashboards,
 * SaaS, FinTech, e-commerce, healthcare and education; data visualisation,
 * complex forms and large datasets; AI-powered and conversational
 * interfaces, AI states, and judging AI-generated design suggestions.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

import { BASE, page, MD, CONTRAST } from "./ux-kit.js";

export const SECTION_ID = "ux-s15-product";

/* ── Lesson 61 lab: RICE prioritisation ────────────────────────────────── */
const FEATURES = [
  ["F1", "Save beneficiaries", "4,000", "2", "80%", "2"],
  ["F2", "Dark mode", "6,000", "0.5", "50%", "3"],
  ["F3", "Transfer receipts by SMS", "5,000", "1", "100%", "1"],
  ["F4", "Budget insights", "2,000", "3", "50%", "5"],
  ["F5", "USSD fallback", "3,000", "2", "80%", "4"],
];

const RICE_PAGE = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Feature candidates</title>
  <style>
    body { margin: 0; padding: 24px 16px; font-family: Arial, Helvetica, sans-serif; line-height: 1.5; color: #1f2937; background: #f8fafc; }
    main { max-width: 760px; margin: 0 auto; }
    h1 { margin: 0 0 8px; font-size: 1.5rem; color: #111827; }
    .wrap { overflow-x: auto; }
    table { border-collapse: collapse; background: #ffffff; }
    th, td { padding: 6px 10px; border: 1px solid #e2e8f0; text-align: left; font-size: 15px; }
    th { background: #f1f5f9; }
    code { background: #eef2ff; padding: 2px 6px; border-radius: 4px; }
  </style>
</head>
<body>
  <main>
    <h1>KoboSave: feature candidates</h1>
    <p>Reach = users affected per quarter. Impact: 3 massive, 2 high, 1 medium, 0.5 low. Effort = person-months. RICE = Reach × Impact × Confidence ÷ Effort. The team has 3 person-months for the MVP. Write your analysis in <code>rice.md</code>.</p>
    <div class="wrap"><table>
      <thead><tr><th>ID</th><th>Feature</th><th>Reach</th><th>Impact</th><th>Confidence</th><th>Effort</th></tr></thead>
      <tbody>
${FEATURES.map((r) => `        <tr>${r.map((c) => `<td>${c}</td>`).join("")}</tr>`).join("\n")}
      </tbody>
    </table></div>
  </main>
</body>
</html>
`;

const RICE_MD = `# RICE prioritisation

| ID | RICE score |
|----|------------|
| F1 |            |
| F2 |            |
| F3 |            |
| F4 |            |
| F5 |            |

## Priority order
1.
2.
3.
4.
5.

## MVP within 3 person-months

## Why
`;

const RICE_MD_DONE = `# RICE prioritisation

| ID | RICE score |
|----|------------|
| F1 | 3200 |
| F2 | 500 |
| F3 | 5000 |
| F4 | 600 |
| F5 | 1200 |

## Priority order
1. F3
2. F1
3. F5
4. F4
5. F2

## MVP within 3 person-months
F3 and F1

## Why
SMS receipts and saved beneficiaries have the highest scores and together use exactly three person-months; they reach most users and remove the biggest worries about transfers.
`;

const RICE = { F1: 3200, F2: 500, F3: 5000, F4: 600, F5: 1200 };

/* ── Lesson 62 lab: trust on a FinTech confirmation screen ─────────────── */
const FIN_HTML = page(
  "Confirm transfer",
  `  <main class="confirm">
    <h1>Confirm transfer</h1>
    <dl class="details">
      <div><dt>To</dt><dd id="to">Tunde Bakare</dd></div>
      <div><dt>Account</dt><dd id="acct">GTBank 0123456789</dd></div>
      <div><dt>Amount</dt><dd id="amount">₦5,000</dd></div>
    </dl>
    <p class="secure">Protected by your 4-digit PIN</p>
    <button class="go" type="button">Continue</button>
  </main>`
);

const FIN_HTML_DONE = page(
  "Confirm transfer",
  `  <main class="confirm">
    <h1>Confirm transfer</h1>
    <dl class="details">
      <div><dt>To</dt><dd id="to">Tunde Bakare</dd></div>
      <div><dt>Account</dt><dd id="acct">GTBank ···6789</dd></div>
      <div><dt>Amount</dt><dd id="amount">₦5,000</dd></div>
      <div><dt>Fee</dt><dd id="fee">₦10</dd></div>
      <div><dt>Total</dt><dd id="total">₦5,010</dd></div>
    </dl>
    <p class="secure">Protected by your 4-digit PIN</p>
    <button class="go" type="button">Send ₦5,010</button>
    <a class="cancel" href="home.html">Cancel</a>
  </main>`
);

const FIN_CSS = `${BASE}
body { color: #111827; }
.confirm { max-width: 420px; margin: 0 auto; padding: 24px 16px; }
h1 { margin: 0 0 16px; font-size: 1.5rem; }
.details { margin: 0 0 16px; }
.details div { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #e5e7eb; }
.details dt { color: #4b5563; }
.details dd { margin: 0; font-weight: 700; }
#amount { font-size: 16px; }
.secure { color: #4b5563; font-size: 14px; }
.go { width: 100%; min-height: 52px; border: 0; border-radius: 12px; background: #0f766e; color: #ffffff; font: inherit; font-weight: 700; }
.cancel { display: block; margin-top: 8px; padding: 12px; text-align: center; color: #0f766e; font-weight: 700; }
`;

const FIN_CSS_DONE = FIN_CSS.replace("#amount { font-size: 16px; }", "#amount { font-size: 28px; }\n#total { font-size: 18px; }");

/* ── Lesson 63 lab: an accessible bar chart ────────────────────────────── */
const SALES = [["Lagos", 420], ["Abuja", 260], ["Kano", 180], ["Rivers", 140]];
const CHART_HTML = page(
  "Orders by state",
  `  <main class="page">
    <figure class="chart">
      <figcaption class="chart__title">Orders by state, March</figcaption>
      <ul class="bars">
${SALES.map(([s, v]) => `        <li class="bar" style="--value: ${v}"><span class="bar__label">${s}</span><span class="bar__track"><span class="bar__fill"></span></span><span class="bar__value"></span></li>`).join("\n")}
      </ul>
    </figure>
  </main>`
);

const CHART_HTML_DONE = CHART_HTML.replace(/style="--value: (\d+)"><span class="bar__label">([A-Za-z]+)<\/span><span class="bar__track"><span class="bar__fill"><\/span><\/span><span class="bar__value"><\/span>/g,
  'style="--value: $1"><span class="bar__label">$2</span><span class="bar__track"><span class="bar__fill"></span></span><span class="bar__value">$1</span>');

const CHART_CSS = `${BASE}
body { color: #111827; }
.page { max-width: 640px; margin: 0 auto; padding: 24px 16px; }
.chart { margin: 0; }
.chart__title { margin-bottom: 16px; font-weight: 700; }
.bars { list-style: none; margin: 0; padding: 0; }
.bar { display: grid; grid-template-columns: 72px 1fr 48px; align-items: center; gap: 12px; margin-bottom: 12px; }
.bar__track { display: block; height: 24px; background: #f3f4f6; }
.bar__fill { display: block; height: 100%; width: 50%; background: #c4b5fd; }
.bar__value { text-align: right; }
`;

const CHART_CSS_DONE = `${BASE}
body { color: #111827; }
.page { max-width: 640px; margin: 0 auto; padding: 24px 16px; }
.chart { margin: 0; }
.chart__title { margin-bottom: 16px; font-weight: 700; }
.bars { list-style: none; margin: 0; padding: 0; }
.bar { display: grid; grid-template-columns: 72px 1fr 48px; align-items: center; gap: 12px; margin-bottom: 12px; }
.bar__track { display: block; height: 24px; background: #f3f4f6; }

/* Length proportional to the value, starting at zero; 420 is the largest value */
.bar__fill { display: block; height: 100%; width: calc(var(--value) / 420 * 100%); background: #6d28d9; }
.bar__value { text-align: right; font-weight: 700; font-variant-numeric: tabular-nums; }
`;

/* ── Lesson 64 lab: an AI assistant's states ───────────────────────────── */
const CHAT_HTML = page(
  "KoboSave assistant",
  `  <main class="chat">
    <h1 class="chat__title">Assistant</h1>
    <ol class="thread">
      <li class="msg msg--bot"><p>Hello! I can explain your transactions, fees and savings goals. What would you like to know?</p></li>
      <li class="msg msg--user"><p>Why was I charged ₦50?</p></li>
      <li class="msg msg--bot"><p>That was the SMS alert fee for March: ₦5 for each of 10 alerts.</p><div class="feedback"><button type="button" class="fb">👍</button><button type="button" class="fb">👎</button></div></li>
    </ol>
    <p class="typing">...</p>
    <div class="chips"><button type="button" class="chip">Show my fees</button><button type="button" class="chip">Change my goal</button></div>
  </main>`
);

const CHAT_HTML_DONE = page(
  "KoboSave assistant",
  `  <main class="chat">
    <h1 class="chat__title">Assistant</h1>
    <p class="note">This assistant uses AI and can make mistakes. Check important details in your statement.</p>
    <ol class="thread">
      <li class="msg msg--bot"><span class="ai-tag">AI</span><p>Hello! I can explain your transactions, fees and savings goals. What would you like to know?</p></li>
      <li class="msg msg--user"><p>Why was I charged ₦50?</p></li>
      <li class="msg msg--bot"><span class="ai-tag">AI</span><p>That was the SMS alert fee for March: ₦5 for each of 10 alerts.</p><div class="feedback"><button type="button" class="fb" aria-label="Helpful">👍</button><button type="button" class="fb" aria-label="Not helpful">👎</button></div></li>
    </ol>
    <p class="typing" role="status">Thinking…</p>
    <div class="chips"><button type="button" class="chip">Show my fees</button><button type="button" class="chip">Change my goal</button></div>
    <a class="human" href="support.html">Talk to a person</a>
  </main>`
);

const CHAT_CSS = `${BASE}
body { color: #111827; }
.chat { max-width: 480px; margin: 0 auto; padding: 24px 16px; }
.chat__title { margin: 0 0 8px; font-size: 1.5rem; }
.note { margin: 0 0 16px; color: #4b5563; font-size: 14px; }
.thread { list-style: none; margin: 0; padding: 0; }
.msg { margin-bottom: 12px; padding: 12px 16px; border-radius: 16px; }
.msg p { margin: 0; }
.msg--bot { background: #f3f4f6; }
.msg--user { background: #0f766e; color: #ffffff; margin-left: 48px; }
.ai-tag { display: inline-block; margin-bottom: 4px; padding: 2px 8px; border-radius: 999px; background: #e0e7ff; color: #3730a3; font-size: 12px; font-weight: 700; }
.feedback { display: flex; gap: 8px; margin-top: 8px; }
.fb { min-width: 44px; min-height: 44px; border: 1px solid #d1d5db; border-radius: 8px; background: #ffffff; }
.typing { color: #4b5563; }
.chips { display: flex; flex-wrap: wrap; gap: 8px; margin: 16px 0; }
.chip { padding: 4px 10px; border: 1px solid #0f766e; border-radius: 999px; background: #ffffff; color: #0f766e; font: inherit; }
.human { display: inline-block; padding: 12px 0; color: #0f766e; font-weight: 700; }
`;

const CHAT_CSS_DONE = CHAT_CSS.replace(
  ".chip { padding: 4px 10px;",
  ".chip { min-height: 44px; padding: 8px 16px;"
);

/* ── Lesson 65 lab: KPI cards for a SaaS dashboard ─────────────────────── */
const KPIS = [
  ["Revenue", "₦4.2m", "up", "12%"],
  ["Active customers", "1,284", "up", "5%"],
  ["Churn", "3.1%", "down", "0.4 pts"],
  ["Open tickets", "37", "up", "9"],
];
const KPI_HTML = page(
  "Overview",
  `  <main class="page">
    <h1>Overview · March</h1>
    <section class="kpis">
${KPIS.map(([l, v, dir]) => `      <article class="kpi"><p class="kpi__label">${l}</p><p class="kpi__value">${v}</p><p class="kpi__delta kpi__delta--${dir}"></p></article>`).join("\n")}
    </section>
  </main>`
);

const KPI_DELTAS = ["▲ 12% vs February", "▲ 5% vs February", "▼ 0.4 pts vs February", "▲ 9 vs February"];
const KPI_HTML_FILLED = (() => {
  let i = 0;
  return KPI_HTML.replace(/(<p class="kpi__delta kpi__delta--(?:up|down)">)(<\/p>)/g, (m, open, close) => `${open}${KPI_DELTAS[i++]}${close}`);
})();

const KPI_CSS = `${BASE}
body { color: #111827; background: #f8fafc; }
.page { max-width: 1200px; margin: 0 auto; padding: 24px 16px; }
h1 { font-size: 1.5rem; }
.kpis { }
.kpi { padding: 20px; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; }
.kpi__label { margin: 0; color: #9ca3af; font-size: 14px; }
.kpi__value { margin: 4px 0; font-size: 18px; font-weight: 400; }
.kpi__delta--up { color: #86efac; }
.kpi__delta--down { color: #fca5a5; }
`;

const KPI_CSS_DONE = `${BASE}
body { color: #111827; background: #f8fafc; }
.page { max-width: 1200px; margin: 0 auto; padding: 24px 16px; }
h1 { font-size: 1.5rem; }

/* 1 column on phones, 2 on tablets, 4 on laptops */
.kpis { display: grid; grid-template-columns: 1fr; gap: 16px; }
@media (min-width: 600px) { .kpis { grid-template-columns: repeat(2, 1fr); } }
@media (min-width: 1024px) { .kpis { grid-template-columns: repeat(4, 1fr); } }

.kpi { padding: 20px; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; }
.kpi__label { margin: 0; color: #4b5563; font-size: 14px; }
.kpi__value { margin: 4px 0; font-size: 28px; font-weight: 700; font-variant-numeric: tabular-nums; }
.kpi__delta { margin: 0; font-size: 14px; font-weight: 700; }
.kpi__delta--up { color: #15803d; }
.kpi__delta--down { color: #b91c1c; }
`;

const KPI_COLS = "const r = $$('.kpi').map((n) => Math.round(rect(n).top)); const cols = r.filter((t) => t === r[0]).length;";

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 61 · 15.1 – 15.6
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ux-l61-product",
    moduleId: "ux-m15-product",
    sectionId: SECTION_ID,
    order: 1,
    covers: ["15.1", "15.2", "15.3", "15.4", "15.5", "15.6"],
    title: "Product Design, Strategy and Prioritisation",
    subtitle: "Deciding what to build, in what order, and what to build first",
    estimatedMinutes: 32,
    intro:
      "Phase 6 widens the lens from screens to products. This lesson covers product design fundamentals, UX strategy, product discovery, defining requirements, prioritising features with frameworks such as RICE, and designing a minimum viable product.",

    atoms: [
      {
        id: "a-ux-product-design",
        title: "Product design fundamentals",
        explain:
          "Product design covers the whole of a product, not just its interface: the problem it solves, who for, what it does, how it works and looks, and how it succeeds as a business. Product designers combine UX and UI skills with product thinking: understanding business models, metrics (activation, retention, revenue), constraints, and the trade-offs between user value, business value and feasibility. The sweet spot is where something is desirable (people want it), viable (the business can sustain it) and feasible (it can be built). Product designers are involved from discovery to measuring results after launch.",
      },
      {
        id: "a-ux-ux-strategy",
        title: "UX strategy and product discovery",
        explain:
          "UX strategy is the long-term plan for the experience: the vision (what the experience should become), the target users and their key jobs, the principles that guide decisions (\"works on a ₦50,000 phone on 3G\"), and the measures of success, aligned with the business strategy. Product discovery is the continuous work of deciding what to build next: understanding problems through research and data, generating and testing solutions with prototypes and experiments, and killing weak ideas early. Discovery answers \"should we build this?\" before delivery answers \"how do we build it well?\".",
      },
      {
        id: "a-ux-requirements",
        title: "Defining product requirements",
        explain:
          "Requirements describe what the product must do and the conditions it must meet. Functional requirements say what it does (\"users can save a beneficiary\"); non-functional requirements say how well (\"the home screen loads in under 3 seconds on 3G\", \"meets WCAG 2.2 AA\"). Requirements are usually captured in a product requirements document (PRD) or as user stories with acceptance criteria, linked to the problem, the users, success metrics and what is explicitly out of scope. Designers help write requirements that describe outcomes, not solutions, so that design keeps the freedom to find the best answer.",
      },
      {
        id: "a-ux-prioritisation",
        title: "Feature prioritisation and MVP design",
        explain:
          "There are always more ideas than time, so teams prioritise with frameworks. MoSCoW sorts features into Must, Should, Could and Won't (this time). An impact/effort grid finds quick wins (high impact, low effort). RICE scores each feature: Reach (how many people per period) × Impact (3 massive, 2 high, 1 medium, 0.5 low) × Confidence (how sure you are, as a percentage) ÷ Effort (person-months). A minimum viable product (MVP) is the smallest version that delivers real value to real users and lets you learn whether the product works; it should be minimal but viable: a complete, usable slice, not a broken whole.",
        example: "RICE = Reach × Impact × Confidence ÷ Effort\n\nSave beneficiaries: 4,000 × 2 × 0.8 ÷ 2 = 3,200\nDark mode:          6,000 × 0.5 × 0.5 ÷ 3 = 500",
        webLab: {
          task:
            "KoboSave has five feature candidates (in the preview). In rice.md, calculate the RICE score of each feature, list the features in priority order (highest score first), choose the features for an MVP that fits within 3 person-months by taking the highest-priority features whose effort fits, and explain why in at least 15 words.",
          files: { "index.html": RICE_PAGE, "rice.md": RICE_MD },
          readOnly: ["index.html"],
          tests: [
            { label: "Every RICE score is correct", check: MD + `const want = ${JSON.stringify(RICE)}; const r = rows(raw('rice.md')); return Object.entries(want).every(([id, s]) => r.some((c) => (c[0] || '').trim().toUpperCase() === id && Math.abs(num(c[1]) - s) < 0.5));`, fail: "For example F1: 4,000 × 2 × 0.8 ÷ 2 = 3,200. Confidence is a percentage: 80% is 0.8." },
            { label: "The priority order is correct", check: MD + String.raw`const o = (section('rice.md', 'Priority order') || '').split('\n').map((l) => (l.match(/\bF\d\b/i) || [''])[0].toUpperCase()).filter(Boolean); return o.join() === 'F3,F1,F5,F4,F2';`, fail: "Sort the five scores from highest to lowest." },
            { label: "The MVP fits 3 person-months", check: MD + String.raw`const s = (section('rice.md', 'MVP') || '').toUpperCase(); const ids = [...new Set(s.match(/\bF\d\b/g) || [])].sort(); return ids.join() === 'F1,F3';`, fail: "Take features in priority order while the total effort is 3 or less." },
            { label: "The reasoning is explained", check: MD + "return words(section('rice.md', 'Why')) >= 15;", fail: "Explain the choice in a sentence or two." },
          ],
          solution: { "rice.md": RICE_MD_DONE },
          hint: "Convert the confidence to a decimal before multiplying. F3's effort is 1 and F1's is 2.",
          successMessage: "A defensible plan: numbers anyone can check, an order, and an MVP that fits the time available.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 62 · 15.7 – 15.12
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ux-l62-domains",
    moduleId: "ux-m15-product",
    sectionId: SECTION_ID,
    order: 2,
    covers: ["15.7", "15.8", "15.9", "15.10", "15.11", "15.12"],
    title: "Dashboards, SaaS, FinTech, Commerce, Health and Education",
    subtitle: "What each kind of product demands from its design",
    estimatedMinutes: 34,
    intro:
      "Every industry adds its own demands: money needs trust, health needs safety, education needs motivation. This lesson covers complex dashboards and SaaS products, and the specific design priorities of FinTech, e-commerce, healthcare and educational technology.",

    atoms: [
      {
        id: "a-ux-complex-dashboards",
        title: "Designing complex dashboards",
        explain:
          "Complex dashboards serve experts who use them for hours. Start from the decisions and tasks, not the available data. Use progressive disclosure: an overview first (key numbers and alerts), then drill down into detail. Give context to every number (period, comparison, target). Keep the layout stable so people build muscle memory, let them filter, save views and export, and design for density (more information per screen, compact rows) without sacrificing legibility. Role-based views show each user what matters to them.",
      },
      {
        id: "a-ux-saas",
        title: "SaaS product interfaces",
        explain:
          "Software as a service (SaaS) products are subscribed to and used through a browser by teams and businesses: accounting tools, school management systems, CRMs. Their key experiences: sign-up and onboarding that gets people to the first moment of value quickly (\"create your first invoice\"); empty states that teach; workspaces with team members, roles and permissions; settings that are organised and findable; billing and plans that are transparent; and consistent navigation (usually a sidebar) across many features. SaaS products succeed through retention, so the everyday experience matters more than the first impression.",
      },
      {
        id: "a-ux-fintech",
        title: "Financial technology (FinTech) interfaces",
        explain:
          "In FinTech, trust is the product. Show exactly what will happen before it happens: the recipient's name, amount, fee and total, with a confirm button that states the amount (\"Send ₦5,010\"). Mask sensitive data (···6789) and let people choose to reveal balances. Give instant, clear receipts with reference numbers, and say plainly what happens when something fails (\"You have not been charged\"). Use security cues people understand (PIN, biometrics) without scaring them, design for fraud prevention (confirmation for new beneficiaries, warnings about suspicious requests), and comply with regulations such as the Central Bank's rules and data protection law.",
        webLab: {
          task:
            "Make this transfer confirmation trustworthy. In index.html: mask the account number so only its last four digits show (for example \"GTBank ···6789\"); add a Fee row (#fee, ₦10) and a Total row (#total, ₦5,010); change the button so it says exactly what will happen, including the total amount; and add a visible Cancel link. In style.css: make the amount (#amount) the most prominent value, at least 24px.",
          files: { "index.html": FIN_HTML, "style.css": FIN_CSS },
          tests: [
            { label: "The account number is masked to its last four digits", check: String.raw`const t = text('#acct'); return /6789/.test(t) && !/\d{5,}/.test(t.replace(/\s/g, ''));`, fail: "Show \"GTBank ···6789\"." },
            { label: "Fee and total are shown before confirming", check: "return /₦\\s?10\\b/.test(text('#fee')) && /5,010/.test(text('#total')) && visible('#fee') && visible('#total');", fail: "Add rows for the fee (₦10) and the total (₦5,010)." },
            { label: "The button states the action and the total", check: "return /send|pay|transfer/i.test(text('.go')) && /5,010/.test(text('.go'));", fail: "\"Send ₦5,010\"." },
            { label: "A visible Cancel", check: "const c = $$('a, button').find((n) => /cancel/i.test(text(n))); return !!c && visible(c);", fail: "Add <a class=\"cancel\" href=\"home.html\">Cancel</a>." },
            { label: "The amount is the most prominent value", check: "const a = px(style('#amount', 'font-size')); return a >= 24 && $$('.details dd').every((d) => d.id === 'amount' || px(style(d, 'font-size')) < a);", fail: "#amount { font-size: 28px; }" },
          ],
          solution: { "index.html": FIN_HTML_DONE, "style.css": FIN_CSS_DONE },
          hint: "Before money moves, people need to see exactly who, how much and what it costs, and have a way out.",
          successMessage: "A confirmation screen people can trust: who, how much, what it costs, protected details, and a clear way out.",
        },
      },
      {
        id: "a-ux-ecommerce-experiences",
        title: "E-commerce experiences",
        explain:
          "Beyond the product page (Module 8), e-commerce experiences must handle search and filtering across thousands of items, comparison, wish lists, a cart that persists across devices, a short checkout with guest options and familiar payment methods (cards, transfers, USSD, pay on delivery), clear delivery and returns information, order tracking, and post-purchase support. In Nigeria, trust signals (reviews, seller ratings, verified badges, pay on delivery) and accurate delivery estimates by location matter especially. Every extra step or surprise in checkout loses sales.",
      },
      {
        id: "a-ux-healthcare",
        title: "Healthcare interfaces",
        explain:
          "In healthcare, errors can harm people, so safety and clarity come first. Prevent errors (confirm doses and patient identity, use constraints rather than free text where possible), make critical information impossible to miss (allergies, alerts) without overwhelming staff with constant warnings that they learn to ignore (alarm fatigue), protect privacy strictly, and design for stressful conditions: tired clinicians, worried patients, low literacy, poor connectivity in rural clinics. Patient-facing tools should use plain language, support local languages and work on basic phones, for example through SMS reminders.",
        decision: {
          scenario: "A clinic's prescribing tool shows a pop-up warning for almost every prescription, most of them minor. Doctors now click \"OK\" without reading.",
          question: "What is the design problem?",
          options: [
            { id: "a", text: "Alarm fatigue: too many low-value warnings train people to ignore the dangerous ones; show only serious alerts as interruptions", why: "Reserve interruptions for critical risks and show minor notes inline, so the important warnings get attention." },
            { id: "b", text: "The pop-ups need brighter colours", whyWrong: "Brighter does not fix habituation." },
            { id: "c", text: "Doctors should be trained to read every pop-up", whyWrong: "Blaming users does not fix a design that overwhelms them." },
            { id: "d", text: "Remove all warnings", whyWrong: "Critical warnings save lives." },
          ],
          correct: "a",
          aftermath: "When everything is urgent, nothing is.",
        },
      },
      {
        id: "a-ux-edtech",
        title: "Educational technology interfaces",
        explain:
          "Educational technology must help people learn, not just consume content. Show progress clearly and celebrate milestones; break learning into short lessons that fit real schedules; give immediate, specific feedback on practice; support different starting levels; remember where learners stopped; and design motivation carefully (streaks and badges help, but must not punish people for missing a day). For Nigerian learners, design for low bandwidth (downloads, text alternatives to video), shared and older devices, and data costs. Teachers and parents are often users too, with their own dashboards.",
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 63 · 15.13 – 15.16
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ux-l63-data",
    moduleId: "ux-m15-product",
    sectionId: SECTION_ID,
    order: 3,
    covers: ["15.13", "15.14", "15.15", "15.16"],
    title: "Data Visualisation, Complex Forms and Large Datasets",
    subtitle: "Making information-heavy products clear",
    estimatedMinutes: 32,
    intro:
      "Many real products are full of data, long forms and huge lists. This lesson covers the fundamentals of data visualisation, designing charts and analytical dashboards, complex forms and workflows, and interfaces for large datasets.",

    atoms: [
      {
        id: "a-ux-dataviz",
        title: "Data visualisation fundamentals",
        explain:
          "Choose the chart by the question it answers. Comparing categories: a bar chart (horizontal when labels are long), sorted by value. Change over time: a line chart. Part of a whole: a stacked bar, or a pie or donut only for two or three parts. Distribution: a histogram. Relationship between two measures: a scatter plot. Rules that keep charts honest and readable: bar charts start at zero (otherwise differences look larger than they are); label directly instead of relying on legends; one highlight colour for what matters and grey for the rest; never use colour alone to distinguish series; and give every chart a title that states the takeaway (\"Lagos drives 42% of orders\").",
        table: {
          caption: "Choosing a chart by the question.",
          headers: ["Question", "Chart"],
          rows: [
            ["How do categories compare?", "Bar chart, sorted"],
            ["How has it changed over time?", "Line chart"],
            ["What share is each part?", "Stacked bar (pie only for 2–3 parts)"],
            ["How are values spread?", "Histogram"],
            ["Are two measures related?", "Scatter plot"],
          ],
        },
      },
      {
        id: "a-ux-charts-dashboards",
        title: "Designing charts and analytical dashboards",
        explain:
          "Analytical dashboards let people explore data, not just glance at it. Arrange charts by the questions people ask, in order: overview metrics, then trends, then breakdowns. Make charts interactive where it helps (hover or tap for exact values, filters for date range and segment, drill down from a total to its parts), keep scales and colours consistent across charts, and always offer the underlying numbers (a table view or export) for people who need precision or use screen readers. Design the empty, loading and error states of every chart.",
        webLab: {
          task:
            "Build this orders-by-state bar chart properly in style.css (and index.html for the value labels). Each bar's length must be proportional to its value (each bar has its value in a --value custom property; Lagos, the largest, is 420 and should fill the track); bars start at zero; each bar shows its value as a visible label (fill in the empty .bar__value spans in index.html); and the bar colour has at least 3:1 contrast against the white page.",
          files: { "index.html": CHART_HTML, "style.css": CHART_CSS },
          tests: [
            { label: "Bar lengths are proportional to the values", check: "const b = $$('.bar'); const max = rect(b[0].querySelector('.bar__track')).width; return b.every((n) => { const v = Number(n.style.getPropertyValue('--value')); return Math.abs(rect(n.querySelector('.bar__fill')).width - (v / 420) * max) < 2; });", fail: ".bar__fill { width: calc(var(--value) / 420 * 100%); }" },
            { label: "Bars start at zero, at the left of the track", check: "return $$('.bar').every((n) => Math.abs(rect(n.querySelector('.bar__fill')).left - rect(n.querySelector('.bar__track')).left) < 1);", fail: "Do not offset or centre the fill." },
            { label: "Every bar shows its value", check: "return $$('.bar').every((n) => text(n.querySelector('.bar__value')) === n.style.getPropertyValue('--value').trim() && visible(n.querySelector('.bar__value')));", fail: "Fill each .bar__value span with its number, for example 420." },
            { label: "Bars have at least 3:1 contrast with the page", check: "return contrast(style('.bar__fill', 'background-color'), 'rgb(255, 255, 255)') >= 3;", fail: "#c4b5fd is too pale. Try #6d28d9." },
          ],
          solution: { "index.html": CHART_HTML_DONE, "style.css": CHART_CSS_DONE },
          hint: "calc(var(--value) / 420 * 100%) turns each value into a percentage of the longest bar.",
          successMessage: "An honest chart: lengths you can trust, starting at zero, with the numbers right there for anyone who needs them.",
        },
      },
      {
        id: "a-ux-complex-forms",
        title: "Designing complex forms and workflows",
        explain:
          "Long forms (loan applications, school admissions, tax returns) need structure: break them into logical steps with a progress indicator showing where people are and how much is left; ask one topic per step; show only the questions that apply (conditional logic); save progress automatically and let people return later; tell people at the start what documents they will need; allow reviewing and editing everything before submitting; and confirm clearly afterwards, with what happens next. Workflows that involve several people (an application reviewed by an officer) need clear statuses and notifications at each stage.",
        decision: {
          scenario: "A loan application has 48 fields on one long page. Most people abandon it halfway, and many who finish have to come back because they lacked a document.",
          question: "Which redesign helps most?",
          options: [
            { id: "a", text: "List the required documents at the start, split the form into short steps with progress, show only relevant questions, and save progress", why: "Preparation, structure, relevance and saved progress address every cause of abandonment described." },
            { id: "b", text: "Make the fields smaller so the page is shorter", whyWrong: "Smaller fields are harder to use; the form is just as long." },
            { id: "c", text: "Add a progress bar to the single long page only", whyWrong: "Helps a little, but the missing documents and length remain." },
            { id: "d", text: "Remove all optional fields only", whyWrong: "A good step, but not enough on its own." },
          ],
          correct: "a",
          aftermath: "Long forms succeed when people are prepared, guided and never lose their work.",
        },
      },
      {
        id: "a-ux-large-datasets",
        title: "Handling large datasets in interfaces",
        explain:
          "When there are thousands of records (transactions, students, products), help people find and act on the right ones: search that is forgiving and fast; filters with counts that show what each will return; sorting by the columns that matter; pagination (good for finding your place again) or infinite scroll and virtualised lists (good for browsing); saved views; bulk selection and actions, with confirmation for destructive ones; and density options (comfortable or compact rows). Show the total and the current range (\"1–50 of 3,204\"), keep filters visible and easy to clear, and design the no-results state with suggestions.",
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 64 · 15.17 – 15.20
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ux-l64-ai",
    moduleId: "ux-m15-product",
    sectionId: SECTION_ID,
    order: 4,
    covers: ["15.17", "15.18", "15.19", "15.20"],
    title: "AI-Powered and Conversational Interfaces",
    subtitle: "Designing products that use AI, and designing with AI",
    estimatedMinutes: 32,
    intro:
      "AI is now part of many products, from chat assistants to recommendations to automatic categorisation. It brings new design challenges: it can be wrong, it can be slow, and people need to know when they are dealing with it. This lesson covers AI-powered interfaces, chatbots, AI feedback and error states, and how to judge AI-generated design suggestions.",

    atoms: [
      {
        id: "a-ux-ai-interfaces",
        title: "AI-powered product interfaces",
        explain:
          "AI features (recommendations, smart categorisation, summaries, generated text and images, predictions) behave differently from ordinary software: their output is probabilistic, so it can be wrong, inconsistent or biased. Design for that. Set expectations about what the AI can and cannot do; make it clear when content is AI-generated; keep people in control (they can review, edit, undo or turn the feature off); explain where it helps (\"Suggested because you often send money on Fridays\"); and make it easy to correct mistakes, which also improves the system. Never let AI take irreversible actions, such as sending money, without explicit human confirmation.",
      },
      {
        id: "a-ux-conversational",
        title: "Conversational interfaces and chatbots",
        explain:
          "Conversational interfaces let people interact by typing or speaking. Good ones introduce themselves and what they can help with, offer suggested prompts or quick replies so people are not faced with a blank box, keep responses short and scannable, confirm before acting, remember context within the conversation, and always provide a way to reach a human (\"Talk to a person\") when the bot cannot help or the issue is sensitive. Conversation design includes writing the bot's personality and messages, mapping the main intents and their flows, and designing what happens when the bot does not understand.",
        decision: {
          scenario: "A bank's chatbot keeps replying \"I didn't understand that\" to a customer reporting a fraudulent transaction, with no other option.",
          question: "What is missing from the design?",
          options: [
            { id: "a", text: "A clear route to a human, especially for urgent or sensitive issues such as fraud", why: "Bots must hand over gracefully. Fraud is urgent and stressful; a dead-end loop is dangerous and destroys trust." },
            { id: "b", text: "More polite wording for \"I didn't understand\"", whyWrong: "Politeness does not solve a dead end." },
            { id: "c", text: "A longer list of keywords for the bot", whyWrong: "Helpful, but there must still be an exit for what it cannot handle." },
            { id: "d", text: "Nothing: customers should rephrase", whyWrong: "Putting the burden on a stressed customer is poor design." },
          ],
          correct: "a",
          aftermath: "Every conversational interface needs a way out to a human.",
        },
      },
      {
        id: "a-ux-ai-states",
        title: "Designing AI feedback and error states",
        explain:
          "AI features need their own states. Thinking: a visible, announced indicator while the AI works (\"Thinking…\"), and streaming text so people see progress. Uncertainty: signal confidence honestly and show sources or citations so people can check. Feedback: simple controls (helpful and not helpful, with accessible names) and a way to regenerate or edit. Limits: a clear, friendly message when the AI cannot or should not help, with an alternative. Errors: say what failed and what to do. And a persistent note that the AI can make mistakes, so people verify important details.",
        webLab: {
          task:
            "Design the AI states of KoboSave's assistant. In index.html: label every bot message with a visible \"AI\" tag (a span with class ai-tag); add a note (class note) saying the assistant uses AI and can make mistakes; give the two feedback buttons accessible names (aria-label \"Helpful\" and \"Not helpful\"); replace the \"...\" typing indicator with text that says it is thinking, announced with role=\"status\"; and add a visible \"Talk to a person\" link. In style.css: make the suggested-prompt chips at least 44px tall.",
          files: { "index.html": CHAT_HTML, "style.css": CHAT_CSS },
          tests: [
            { label: "Every bot message has a visible AI tag", check: "return $$('.msg--bot').every((m) => { const t = m.querySelector('.ai-tag'); return !!t && visible(t) && /\\bAI\\b/.test(text(t)); });", fail: "Add <span class=\"ai-tag\">AI</span> inside each bot message." },
            { label: "A note says the AI can make mistakes", check: "return visible('.note') && /\\bAI\\b/.test(text('.note')) && /mistake|wrong|error/i.test(text('.note'));", fail: "<p class=\"note\">This assistant uses AI and can make mistakes…</p>" },
            { label: "Feedback buttons have accessible names", check: "const n = $$('.fb').map((b) => nameOf(b)); return n.length === 2 && /not helpful/i.test(n[1]) && /helpful/i.test(n[0]) && !/not/i.test(n[0]);", fail: "aria-label=\"Helpful\" and aria-label=\"Not helpful\"." },
            { label: "The thinking indicator is announced and says what is happening", check: "const t = $('.typing'); return t.getAttribute('role') === 'status' && /think|working|typing/i.test(text(t));", fail: "<p class=\"typing\" role=\"status\">Thinking…</p>" },
            { label: "A visible route to a human", check: "const h = $$('a, button').find((n) => /person|human|agent/i.test(text(n))); return !!h && visible(h);", fail: "<a class=\"human\" href=\"support.html\">Talk to a person</a>" },
            { label: "Suggested prompts are at least 44px tall", check: "return $$('.chip').every((c) => rect(c).height >= 44);", fail: ".chip { min-height: 44px; }" },
          ],
          solution: { "index.html": CHAT_HTML_DONE, "style.css": CHAT_CSS_DONE },
          hint: "Every state people meet with AI needs a signal: who is talking, what it is doing, how to rate it, and how to escape it.",
          successMessage: "An assistant that is honest about being AI, shows when it is working, accepts feedback, and never traps anyone.",
        },
      },
      {
        id: "a-ux-ai-suggestions",
        title: "Evaluating AI-generated design suggestions",
        explain:
          "AI tools can now generate layouts, copy, user personas, research summaries and even whole screens. They are useful for speed and exploration, but their output must be judged like any junior contribution. Check it against your research (an AI persona is not evidence about your users), your design system (tokens, components, patterns), accessibility (AI layouts often fail contrast, target sizes and semantics), your brand and voice, real content and edge cases, and the actual problem. Use AI to generate options and first drafts; keep the decisions, the evidence and the responsibility with you.",
        decision: {
          scenario: "An AI tool generates a polished onboarding flow in seconds. A teammate proposes shipping it as is.",
          question: "What should happen first?",
          options: [
            { id: "a", text: "Review it against research, the design system and accessibility, test it with users, then adapt it", why: "AI output can look finished while being wrong for your users, inconsistent with your system, or inaccessible." },
            { id: "b", text: "Ship it: AI designs are optimised", whyWrong: "The AI knows nothing about your users or constraints." },
            { id: "c", text: "Reject it because AI was involved", whyWrong: "It may be a useful starting point; judge it on its merits." },
            { id: "d", text: "Ask the AI if the design is good", whyWrong: "That is not evidence." },
          ],
          correct: "a",
          aftermath: "AI can draft; designers decide.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 65 · 15.P
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ux-l65-saas-dashboard",
    moduleId: "ux-m15-product",
    sectionId: SECTION_ID,
    order: 5,
    covers: ["15.P"],
    title: "Practical: A Complete SaaS Dashboard",
    subtitle: "Authentication, navigation, analytics and settings",
    estimatedMinutes: 36,
    intro:
      "Your module practical is a complete SaaS dashboard. This lesson outlines what each part needs, then has you build the heart of its analytics: KPI cards that are readable, honest and responsive.",

    atoms: [
      {
        id: "a-ux-saas-anatomy",
        title: "The anatomy of a SaaS dashboard",
        explain:
          "A complete SaaS dashboard has four parts. Authentication: sign up, log in, forgotten password, and invitations to a team, with clear errors and security that does not get in the way. Navigation: a sidebar with the main sections and the current one highlighted, a header with search, notifications and the account menu, and a workspace switcher for people in several teams. Analytics: an overview of key performance indicators (KPIs) with comparisons, trend charts, and tables you can filter and export. Settings: profile, team members and roles, billing and plan, notifications, and a separated danger zone for destructive actions such as deleting the workspace.",
        table: {
          caption: "What each part of a SaaS dashboard needs.",
          headers: ["Part", "Must include"],
          rows: [
            ["Authentication", "Sign up, log in, reset password, invitations, clear errors"],
            ["Navigation", "Sidebar with current section, header with search and account"],
            ["Analytics", "KPI cards with comparisons, trend charts, filterable tables"],
            ["Settings", "Profile, team and roles, billing, notifications, danger zone"],
          ],
        },
      },
      {
        id: "a-ux-kpi-lab",
        title: "Build the KPI overview",
        explain:
          "A KPI card answers three questions at a glance: what is measured, what is the number, and is it getting better or worse compared with what? The comparison must not rely on colour alone: an arrow and words (\"▲ 12% vs February\") carry the meaning for everyone, and colour adds emphasis.",
        webLab: {
          task:
            "Build the dashboard's KPI overview. In index.html: fill each empty delta paragraph with an arrow (▲ for up, ▼ for down), the change and what it is compared with, for example \"▲ 12% vs February\" (the changes are 12%, 5%, 0.4 pts and 9). In style.css: lay the four cards out in 4 columns on a laptop, 2 on a tablet and 1 on a phone; make each value at least 24px and bold; make every label and delta readable (4.5:1).",
          files: { "index.html": KPI_HTML, "style.css": KPI_CSS },
          tests: [
            { label: "Every delta has an arrow, a change and a comparison", check: "return $$('.kpi__delta').every((d) => /[▲▼]/.test(text(d)) && /\\d/.test(text(d)) && /\\bvs\\b|compared|than/i.test(text(d)));", fail: "\"▲ 12% vs February\" in each delta paragraph." },
            { label: "Arrows match the direction", check: "return $$('.kpi__delta--up').every((d) => text(d).includes('▲')) && $$('.kpi__delta--down').every((d) => text(d).includes('▼'));", fail: "▲ for the up deltas, ▼ for Churn." },
            { label: "Values at least 24px and bold", check: "return $$('.kpi__value').every((v) => px(style(v, 'font-size')) >= 24 && Number(style(v, 'font-weight')) >= 700);", fail: ".kpi__value { font-size: 28px; font-weight: 700; }" },
            { label: "Labels and deltas are readable", check: CONTRAST + "return passes('.kpi__label', 4.5) && passes('.kpi__delta', 4.5);", fail: "Use #4b5563 for labels, #15803d and #b91c1c for deltas." },
            { label: "Laptop: 4 columns", check: KPI_COLS + "return cols === 4;", fail: "@media (min-width: 1024px) { .kpis { grid-template-columns: repeat(4, 1fr); } }" },
            { label: "Tablet: 2 columns", viewport: "tablet", check: KPI_COLS + "return cols === 2;", fail: "@media (min-width: 600px) { .kpis { grid-template-columns: repeat(2, 1fr); } }" },
            { label: "Phone: 1 column, no sideways scroll", viewport: "mobile", check: KPI_COLS + "return cols === 1 && !overflowX();", fail: ".kpis { display: grid; grid-template-columns: 1fr; gap: 16px; }" },
          ],
          solution: { "index.html": KPI_HTML_FILLED, "style.css": KPI_CSS_DONE },
          hint: "Words and arrows carry the meaning; colour only emphasises it.",
          successMessage: "Four KPI cards anyone can read in a second, on any screen, with or without colour vision. Now design the rest of the dashboard in Figma.",
        },
      },
    ],

    task: {
      title: "Module 15 practical: a complete SaaS dashboard",
      intro: "Choose a SaaS product (a school management system, an invoicing tool, a logistics tracker) and design it in Figma.",
      prompts: [
        "Authentication: sign up, log in, forgotten password and team invitation screens, with error states.",
        "Navigation: a sidebar with the main sections and the current one highlighted, and a header with search, notifications and an account menu, at desktop and mobile sizes.",
        "Analytics: an overview with four KPI cards (comparison by arrow and words), two trend charts chosen by the question they answer, and a filterable table with pagination.",
        "Settings: profile, team members and roles, billing and plan, notifications, and a separated danger zone with confirmation.",
        "Use your design system throughout, design empty, loading and error states for the analytics, and build a clickable prototype of the main flow.",
      ],
      closing: "Module 16, the last, turns all of this into a portfolio and a career.",
    },

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
