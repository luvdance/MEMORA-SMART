/**
 * UI/UX DESIGN · MODULE 10 · INTERACTIVE PROTOTYPING
 *
 * Curriculum 10.1 – 10.18 and the practical 10.P. What prototypes are for,
 * fidelity, the Figma prototyping workspace, connecting frames, interactive
 * components, navigation, click, hover and drag interactions, Smart Animate,
 * transitions, overlays, scrolling, interactive forms, realism, sharing and
 * presenting. The labs are real prototypes: linked screens, a working
 * switch, a modal overlay and a banking flow, checked in the browser.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

import { BASE, page, CONTRAST } from "./ux-kit.js";

export const SECTION_ID = "ux-s10-prototyping";

/* ── Lesson 41 lab: connecting frames ──────────────────────────────────── */
const PROTO_CSS = `${BASE}
body { color: #111827; background: #f8fafc; }
.screen { max-width: 400px; margin: 0 auto; padding: 24px 16px; }
h1 { font-size: 1.5rem; margin: 0 0 16px; }
.big { font-size: 2rem; font-weight: 700; margin: 0 0 16px; }
.btn { display: block; margin-bottom: 12px; padding: 14px; border-radius: 10px; background: #0f766e; color: #ffffff; font-weight: 700; text-align: center; text-decoration: none; }
.link { display: block; padding: 12px; text-align: center; color: #0f766e; font-weight: 700; }
`;

const protoPage = (title, body) => page(title, `  <main class="screen">\n${body}\n  </main>`);

const PROTO = {
  "index.html": protoPage("Home", `    <h1>Good morning, Amaka</h1>
    <p class="big">₦48,200</p>
    <a class="btn" id="to-send" href="#">Send money</a>`),
  "send.html": protoPage("Send money", `    <h1>Send money</h1>
    <p>To: Tunde Bakare · GTBank ···6789</p>
    <p class="big">₦5,000</p>
    <a class="btn" id="to-confirm" href="#">Continue</a>
    <a class="link" id="send-back" href="#">Back</a>`),
  "confirm.html": protoPage("Confirm", `    <h1>Confirm transfer</h1>
    <p>Send ₦5,000 to Tunde Bakare?</p>
    <a class="btn" id="to-done" href="#">Confirm and send</a>
    <a class="link" id="to-edit" href="#">Edit</a>`),
  "done.html": protoPage("Sent", `    <h1>Money sent</h1>
    <p>₦5,000 is on its way to Tunde Bakare.</p>
    <a class="btn" id="to-home" href="#">Back to home</a>`),
};

const wire = (html, pairs) => pairs.reduce((h, [id, target]) => h.replace(`id="${id}" href="#"`, `id="${id}" href="${target}"`), html);

const PROTO_DONE = {
  "index.html": wire(PROTO["index.html"], [["to-send", "send.html"]]),
  "send.html": wire(PROTO["send.html"], [["to-confirm", "confirm.html"], ["send-back", "index.html"]]),
  "confirm.html": wire(PROTO["confirm.html"], [["to-done", "done.html"], ["to-edit", "send.html"]]),
  "done.html": wire(PROTO["done.html"], [["to-home", "index.html"]]),
};

const hrefIs = (id, target) => `const h = ($('#${id}')?.getAttribute('href') || '').replace(/^\\.\\//, ''); return h === '${target}';`;

/* ── Lesson 42 lab: an interactive switch component ────────────────────── */
const SWITCH_HTML = page(
  "Notifications",
  `  <main class="settings">
    <h1>Notifications</h1>
    <div class="row">
      <span id="sms-label">SMS alerts for every transaction</span>
      <button class="switch" type="button" role="switch" aria-checked="false" aria-labelledby="sms-label"><span class="knob"></span></button>
    </div>
  </main>`,
  { js: true }
);

const SWITCH_JS = `// Read-only: clicking the switch flips aria-checked between "true" and "false".
document.querySelectorAll(".switch").forEach((s) => {
  s.addEventListener("click", () => {
    s.setAttribute("aria-checked", String(s.getAttribute("aria-checked") !== "true"));
  });
});
`;

const SWITCH_CSS = `${BASE}
body { color: #111827; }
.settings { max-width: 480px; margin: 0 auto; padding: 24px 16px; }
.row { display: flex; justify-content: space-between; align-items: center; gap: 16px; padding: 12px 0; border-bottom: 1px solid #e5e7eb; }

.switch { width: 30px; height: 16px; border: 0; background: #e5e7eb; padding: 0; outline: none; }
.knob { display: block; width: 12px; height: 12px; background: #ffffff; }
`;

const SWITCH_CSS_DONE = `${BASE}
body { color: #111827; }
.settings { max-width: 480px; margin: 0 auto; padding: 24px 16px; }
.row { display: flex; justify-content: space-between; align-items: center; gap: 16px; padding: 12px 0; border-bottom: 1px solid #e5e7eb; }

/* Off variant: grey track with a 3:1 border, knob on the left */
.switch {
  position: relative;
  flex: none;
  width: 52px;
  height: 32px;
  padding: 0;
  border: 2px solid #6b7280;
  border-radius: 999px;
  background: #f3f4f6;
  cursor: pointer;
  transition: background-color 150ms ease-out, border-color 150ms ease-out;
}

/* A 44px hit area around the 32px switch */
.switch::before { content: ""; position: absolute; inset: -8px -4px; }

.knob {
  position: absolute;
  top: 3px;
  left: 3px;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: #4b5563;
  transition: transform 150ms ease-out;
}

/* On variant: filled track, knob slides right */
.switch[aria-checked="true"] { background: #0f766e; border-color: #0f766e; }
.switch[aria-checked="true"] .knob { background: #ffffff; transform: translateX(20px); }

.switch:focus-visible { outline: 3px solid #1d4ed8; outline-offset: 3px; }

@media (prefers-reduced-motion: reduce) {
  .switch, .knob { transition: none; }
}
`;

/* ── Lesson 43 lab: an overlay and a sticky header ─────────────────────── */
const MODAL_HTML = page(
  "Transfer",
  `  <header class="bar"><h1 class="bar__title">Transfer</h1></header>
  <main class="content">
    <p>Recipient: Tunde Bakare · GTBank ···6789</p>
    <p>Amount: ₦5,000</p>
    <p>Fee: ₦10</p>
    <button class="btn" id="open" type="button">Send ₦5,000</button>
    <div class="spacer"></div>
  </main>
  <dialog class="sheet" id="sheet" aria-labelledby="sheet-title">
    <h2 id="sheet-title">Send ₦5,000 to Tunde Bakare?</h2>
    <p>The money will leave your account immediately.</p>
    <div class="sheet__actions">
      <button class="btn" type="button" id="confirm">Confirm and send</button>
      <button class="ghost" type="button" id="cancel">Cancel</button>
    </div>
  </dialog>`,
  { js: true }
);

const MODAL_JS = `// Read-only: the button opens the dialog as a modal overlay; Cancel closes it.
const sheet = document.getElementById("sheet");
document.getElementById("open").addEventListener("click", () => sheet.showModal());
document.getElementById("cancel").addEventListener("click", () => sheet.close());
`;

const MODAL_CSS = `${BASE}
body { color: #111827; }
.bar { padding: 16px; background: #0f766e; color: #ffffff; }
.bar__title { margin: 0; font-size: 1.25rem; }
.content { max-width: 480px; margin: 0 auto; padding: 16px; }
.spacer { height: 1600px; }
.btn { min-height: 48px; padding: 12px 20px; border: 0; border-radius: 10px; background: #0f766e; color: #ffffff; font: inherit; font-weight: 700; }
.ghost { min-height: 48px; padding: 12px 20px; border: 0; background: transparent; color: #0f766e; font: inherit; font-weight: 700; }
`;

const MODAL_CSS_DONE = `${BASE}
body { color: #111827; }

/* Scroll behaviour: the header stays fixed at the top while content scrolls */
.bar { position: sticky; top: 0; z-index: 1; padding: 16px; background: #0f766e; color: #ffffff; }
.bar__title { margin: 0; font-size: 1.25rem; }
.content { max-width: 480px; margin: 0 auto; padding: 16px; }
.spacer { height: 1600px; }
.btn { min-height: 48px; padding: 12px 20px; border: 0; border-radius: 10px; background: #0f766e; color: #ffffff; font: inherit; font-weight: 700; }
.ghost { min-height: 48px; padding: 12px 20px; border: 0; background: transparent; color: #0f766e; font: inherit; font-weight: 700; }

/* The overlay: centred, a fixed maximum width, rounded */
.sheet {
  width: calc(100% - 32px);
  max-width: 400px;
  padding: 24px;
  border: 0;
  border-radius: 16px;
  animation: pop-in 200ms ease-out;
}
.sheet h2 { margin: 0 0 8px; font-size: 1.25rem; }
.sheet p { margin: 0 0 24px; color: #4b5563; }
.sheet__actions { display: flex; flex-direction: column; gap: 8px; }

/* Figure and ground: dim the page behind the overlay */
.sheet::backdrop { background: rgba(15, 23, 42, 0.55); }

@keyframes pop-in {
  from { opacity: 0; transform: translateY(16px) scale(0.98); }
  to { opacity: 1; transform: none; }
}

@media (prefers-reduced-motion: reduce) {
  .sheet { animation: none; }
}
`;

/* ── Lesson 44 lab: a mobile banking prototype ─────────────────────────── */
const BANK_CSS = `${BASE}
body { color: #111827; background: #f8fafc; }
.screen { max-width: 400px; margin: 0 auto; padding: 24px 16px; }
h1 { margin: 0 0 16px; font-size: 1.5rem; }
.big { margin: 0 0 16px; font-size: 2rem; font-weight: 700; }
.btn { display: block; margin-bottom: 12px; padding: 14px; border-radius: 10px; background: #0f766e; color: #ffffff; font-weight: 700; text-align: center; text-decoration: none; }
.link { display: block; padding: 12px; text-align: center; color: #0f766e; font-weight: 700; }
.note { color: #4b5563; }
`;

const bankPage = (title, body) => page(title, `  <main class="screen">\n${body}\n  </main>`);

const BANK = {
  "index.html": bankPage("Log in", `    <h1>Welcome back</h1>
    <p class="note">Log in with your 6-digit PIN.</p>
    <a class="btn" id="login" href="#">Log in</a>`),
  "home.html": bankPage("Home", `    <h1>Hello, Amaka</h1>
    <p class="big" id="balance">₦00000</p>
    <a class="btn" id="to-transfer" href="#">Transfer</a>`),
  "transfer.html": bankPage("Transfer", `    <h1>Transfer</h1>
    <p>Account: 0123456789 · GTBank</p>
    <p id="recipient"></p>
    <p class="big">₦5,000</p>
    <a class="btn" id="send" href="#">Send ₦5,000</a>
    <a class="link" id="simulate-fail" href="#">(Prototype: simulate a failed transfer)</a>`),
  "success.html": bankPage("Sent", `    <h1>Transfer successful</h1>
    <p id="summary"></p>
    <a class="btn" id="done-home" href="#">Done</a>`),
  "failed.html": bankPage("Transfer failed", `    <h1>Transfer failed</h1>
    <p id="reason"></p>
    <a class="btn" id="retry" href="#">Try again</a>`),
};

const BANK_DONE = {
  "index.html": wire(BANK["index.html"], [["login", "home.html"]]),
  "home.html": wire(BANK["home.html"], [["to-transfer", "transfer.html"]]).replace("₦00000", "₦48,200.00"),
  "transfer.html": wire(BANK["transfer.html"], [["send", "success.html"], ["simulate-fail", "failed.html"]]).replace(
    '<p id="recipient"></p>',
    '<p id="recipient">Name: Tunde Bakare</p>'
  ),
  "success.html": wire(BANK["success.html"], [["done-home", "home.html"]]).replace(
    '<p id="summary"></p>',
    '<p id="summary">₦5,000 sent to Tunde Bakare. Ref: TRF-20480913</p>'
  ),
  "failed.html": wire(BANK["failed.html"], [["retry", "transfer.html"]]).replace(
    '<p id="reason"></p>',
    '<p id="reason">The bank did not respond. You have not been charged.</p>'
  ),
};

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 41 · 10.1 – 10.5
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ux-l41-prototypes",
    moduleId: "ux-m10-prototyping",
    sectionId: SECTION_ID,
    order: 1,
    covers: ["10.1", "10.2", "10.3", "10.4", "10.5"],
    title: "Prototypes and Connecting Frames",
    subtitle: "Why prototypes matter, how much fidelity they need, and the first connections",
    estimatedMinutes: 28,
    intro:
      "Phase 4 is about proving that designs work. It starts with prototypes: versions of a product people can click through as if it were real. This lesson explains what prototypes are for, how much fidelity they need, Figma's prototyping workspace, and how to connect screens into a flow.",

    atoms: [
      {
        id: "a-ux-what-prototype",
        title: "What is prototyping, and why it matters",
        explain:
          "A prototype is a simulation of a product that people can interact with, made to learn something before building the real thing. It can be a stack of paper screens, a clickable Figma file, or coded pages. Prototypes matter because static screens hide problems that only appear in use: a missing back button, a confusing step, an interaction that feels slow. They let you test flows with real users, communicate ideas to stakeholders far better than a slide, and give developers a clear picture of how the product should behave. Every hour spent on a prototype that reveals a problem saves many hours of engineering.",
        why: "People react to what they can touch. A prototype turns \"I think users will understand\" into \"we watched five people and three got stuck here\".",
      },
      {
        id: "a-ux-prototype-fidelity",
        title: "Low-fidelity and high-fidelity prototypes",
        explain:
          "Low-fidelity prototypes (paper screens, or linked wireframes) are fast and cheap, and people feel free to criticise them, which is exactly what you want early. They test structure and flow. High-fidelity prototypes look and behave like the real product, with real content, visual design, animations and realistic states. They test details (does this button read as tappable? is the animation clear?), impress stakeholders, and guide developers. The right fidelity depends on the question: \"can people find the transfer feature?\" needs only low fidelity; \"do people trust this payment screen?\" needs high.",
      },
      {
        id: "a-ux-figma-prototype-tab",
        title: "The Figma prototyping workspace",
        explain:
          "Switch the right sidebar to the Prototype tab. Select a layer and drag the blue connection handle (the \"noodle\") to a destination frame to create an interaction. Each interaction has a trigger (On click/tap, While hovering, On drag, After delay, Key press), an action (Navigate to, Back, Open overlay, Swap overlay, Scroll to, Open link, Set variable) and an animation (Instant, Dissolve, Move in, Push, Slide, Smart Animate) with easing and duration. Flow starting points mark where a prototype begins; you can have several flows in one file (Onboarding, Transfer). Press Present (the play button) to try it, choosing a device frame such as an iPhone or Android phone.",
        table: {
          caption: "The parts of a Figma interaction.",
          headers: ["Part", "Examples"],
          rows: [
            ["Trigger", "On click, While hovering, On drag, After delay, Key press"],
            ["Action", "Navigate to, Back, Open overlay, Scroll to, Open link, Set variable"],
            ["Animation", "Instant, Dissolve, Move in, Push, Slide, Smart Animate"],
            ["Easing and duration", "Ease out, 200ms"],
          ],
        },
      },
      {
        id: "a-ux-connecting-frames",
        title: "Connecting frames",
        explain:
          "Connecting frames turns screens into a flow: every button and link that should go somewhere gets a connection to its destination frame. Work from your user flow (Module 6): for each screen, wire the primary action forward and give every screen a way back, so testers never get stuck. Make the whole button the hotspot, not just its text. Name frames clearly so the connection list reads like a flow. Test the prototype yourself from the starting point, clicking every connection, before you show it to anyone.",
        webLab: {
          task:
            "This four-screen transfer prototype has no connections: every button goes nowhere (href=\"#\"). Wire it in the HTML files like Figma connections: Home's Send money → send.html; Send's Continue → confirm.html and Back → index.html; Confirm's Confirm and send → done.html and Edit → send.html; Done's Back to home → index.html.",
          files: { ...PROTO, "style.css": PROTO_CSS },
          readOnly: ["style.css"],
          tests: [
            { label: "Home: Send money goes to the Send screen", check: hrefIs("to-send", "send.html"), fail: "In index.html: href=\"send.html\" on Send money." },
            { label: "Send: Continue goes forward, Back goes home", page: "send.html", check: "const f = (id) => ($('#' + id)?.getAttribute('href') || '').replace(/^\\.\\//, ''); return f('to-confirm') === 'confirm.html' && f('send-back') === 'index.html';", fail: "In send.html: Continue → confirm.html, Back → index.html." },
            { label: "Confirm: Confirm and send goes to Done, Edit goes back", page: "confirm.html", check: "const f = (id) => ($('#' + id)?.getAttribute('href') || '').replace(/^\\.\\//, ''); return f('to-done') === 'done.html' && f('to-edit') === 'send.html';", fail: "In confirm.html: Confirm and send → done.html, Edit → send.html." },
            { label: "Done: Back to home closes the loop", page: "done.html", check: hrefIs("to-home", "index.html"), fail: "In done.html: Back to home → index.html." },
          ],
          solution: PROTO_DONE,
          hint: "Every screen needs a way forward and a way back, so a tester can never get stuck.",
          successMessage: "A prototype someone can click through from start to finish and back again: the minimum for any usability test.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 42 · 10.6 – 10.10
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ux-l42-interactions",
    moduleId: "ux-m10-prototyping",
    sectionId: SECTION_ID,
    order: 2,
    covers: ["10.6", "10.7", "10.8", "10.9", "10.10"],
    title: "Interactive Components and Interactions",
    subtitle: "Click, hover and drag, and components that respond by themselves",
    estimatedMinutes: 30,
    intro:
      "Linking screens is only the start. Real interfaces respond on the spot: a switch flips, a button darkens on hover, a carousel slides under your finger. This lesson covers interactive components and the main interaction types.",

    atoms: [
      {
        id: "a-ux-interactive-components",
        title: "Interactive components",
        explain:
          "Interactive components are components whose variants are connected to each other inside the component itself: the Off variant of a switch has an On click interaction that changes to the On variant, and back. Every instance of the switch, on every screen, then works in the prototype without wiring each one. Use them for switches, checkboxes, radio buttons, tabs, accordions, dropdowns and buttons with hover and pressed states. They make prototypes far more realistic with far less work, and they document exactly how each component behaves for developers.",
        webLab: {
          task:
            "Design the two variants of this notification switch in style.css (the script flips aria-checked when it is clicked). Off: a light track with a border of at least 3:1 contrast against the page, the knob on the left. On ([aria-checked=\"true\"]): a filled, clearly different track, the knob moved to the right. Make the switch at least 44px wide and 28px tall, give it a visible :focus-visible outline, and animate the knob with a transition of 300ms or less.",
          files: { "index.html": SWITCH_HTML, "style.css": SWITCH_CSS, "app.js": SWITCH_JS },
          readOnly: ["index.html", "app.js"],
          tests: [
            { label: "The switch is at least 44px wide and 28px tall", check: "const r = rect('.switch'); return r.width >= 44 && r.height >= 28;", fail: ".switch { width: 52px; height: 32px; }" },
            { label: "Off: the track's border has at least 3:1 contrast", check: "return px(style('.switch', 'border-top-width')) >= 1 && contrast(style('.switch', 'border-top-color'), 'rgb(255, 255, 255)') >= 3;", fail: "border: 2px solid #6b7280;" },
            { label: "On: the track fill changes and the knob moves right", check: "const still = document.createElement('style'); still.textContent = '*, *::before, *::after { transition: none !important; }'; document.head.append(still); const offBg = style('.switch', 'background-color'); const offX = rect('.knob').left; await click('.switch'); await tick(); const ok = $('.switch').getAttribute('aria-checked') === 'true' && style('.switch', 'background-color') !== offBg && rect('.knob').left - offX >= 12; await click('.switch'); await tick(); still.remove(); return ok;", fail: ".switch[aria-checked=\"true\"] { background: #0f766e; } .switch[aria-checked=\"true\"] .knob { transform: translateX(20px); }" },
            { label: "Keyboard focus shows an outline", check: "return rules(/\\.switch:focus-visible/).some((r) => parseFloat(r.style.outlineWidth) >= 2);", fail: ".switch:focus-visible { outline: 3px solid #1d4ed8; }" },
            { label: "The knob animates in 300ms or less", check: "const d = style('.knob', 'transition-duration').split(',').map((x) => parseFloat(x) * 1000); return d.some((ms) => ms > 0 && ms <= 300);", fail: ".knob { transition: transform 150ms ease-out; }" },
          ],
          solution: { "style.css": SWITCH_CSS_DONE },
          hint: "Position the knob absolutely inside a relatively positioned track, then translate it for the On variant.",
          successMessage: "A switch with two clear variants and a smooth transition between them: an interactive component, just like one built with variants in Figma.",
        },
      },
      {
        id: "a-ux-navigation-interactions",
        title: "Navigation and on-click interactions",
        explain:
          "On click (On tap on touch devices) is the most common trigger. Navigation actions move between screens: Navigate to (a specific frame), Back (wherever the user came from, like a back button), Scroll to (a section on the same frame, such as \"Jump to reviews\"), and Open link (an external URL). Click can also open and close overlays, change a component's variant, or set a variable (for example, adding an item to a cart counter). Make sure every clickable thing in the prototype looks clickable, and that nothing that looks clickable is a dead end.",
      },
      {
        id: "a-ux-hover-interactions",
        title: "Hover interactions",
        explain:
          "Hover triggers exist only where there is a pointer: desktop and laptop web. While hovering shows a change only while the pointer is over the element and reverts when it leaves (a button darkening, a tooltip appearing); Mouse enter and Mouse leave fire once each. Use hover to signal interactivity and preview information, never to hide something essential, because phones and tablets have no hover and keyboard users never trigger it. Anything shown on hover must also be reachable by tap and by keyboard focus.",
        decision: {
          scenario: "A dashboard hides each row's Edit and Delete buttons until the row is hovered.",
          question: "What problem does this cause?",
          options: [
            { id: "a", text: "Touch and keyboard users may never discover the actions, because they cannot hover", why: "Show actions always (or on focus and tap too). Hover can enhance, but must never be the only way in." },
            { id: "b", text: "Hover effects slow the page down", whyWrong: "Performance is not the issue." },
            { id: "c", text: "None: everyone uses a mouse on dashboards", whyWrong: "Tablets, touch laptops and keyboard users are common." },
            { id: "d", text: "The buttons should appear only on double-click", whyWrong: "Even less discoverable." },
          ],
          correct: "a",
          aftermath: "Hover is a bonus, never a requirement.",
        },
      },
      {
        id: "a-ux-drag-interactions",
        title: "Drag interactions",
        explain:
          "On drag triggers an interaction when the user presses and moves: swiping through onboarding screens, a carousel of cards, pulling down to refresh, swiping a row to reveal actions, or a slider. In Figma, combine On drag with Smart Animate so the content follows the finger, or use horizontal scrolling inside a frame for carousels. Drag gestures are invisible, so give signifiers (a peek of the next card, dots showing pages, a handle) and always provide a visible alternative (arrow buttons, a Delete button) for people who cannot or do not drag.",
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 43 · 10.11 – 10.15
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ux-l43-motion-overlays",
    moduleId: "ux-m10-prototyping",
    sectionId: SECTION_ID,
    order: 3,
    covers: ["10.11", "10.12", "10.13", "10.14", "10.15"],
    title: "Animation, Overlays, Scrolling and Forms",
    subtitle: "Making prototypes move and behave like the real thing",
    estimatedMinutes: 32,
    intro:
      "Motion and behaviour make the difference between a slideshow and a convincing product. This lesson covers Smart Animate, transitions and animation, overlays and modals, scroll behaviour, and making forms feel real in a prototype.",

    atoms: [
      {
        id: "a-ux-smart-animate",
        title: "Smart Animate",
        explain:
          "Smart Animate looks for layers with the same name in the starting and destination frames and animates the differences between them: position, size, rotation, colour and opacity. Rename a card \"Card\" in both frames, make it bigger in the second, and Smart Animate grows it smoothly. It is how designers prototype expanding cards, moving tab indicators, toggles, progress bars and shared-element transitions without any animation software. Matching layer names (and similar layer structure) is the whole trick; when Smart Animate does something odd, check the names first.",
      },
      {
        id: "a-ux-transitions",
        title: "Transitions and animations",
        explain:
          "Transitions between screens should explain where you are going: Push or Slide in from the right when moving forward through a flow and back to the left when returning; Move in from the bottom for a sheet that will be dismissed; Dissolve for changes of context. Durations of about 150 to 300 milliseconds feel responsive; longer feels sluggish for everyday interactions. Easing makes motion feel natural: Ease out (fast start, gentle stop) for things entering, Ease in for things leaving. Motion must have a purpose (orientation, feedback, continuity) and respect the reduced-motion setting.",
        table: {
          caption: "Choosing a transition.",
          headers: ["Situation", "Transition", "Duration and easing"],
          rows: [
            ["Forward in a flow", "Push / slide from the right", "250ms, ease out"],
            ["Back", "Push / slide to the right", "250ms, ease out"],
            ["Bottom sheet or modal", "Move in from the bottom, dim behind", "200–300ms, ease out"],
            ["Small state change", "Smart Animate", "150–200ms, ease out"],
            ["Switching context", "Dissolve", "200ms"],
          ],
        },
      },
      {
        id: "a-ux-overlays",
        title: "Overlays and modal interactions",
        explain:
          "An overlay opens a frame on top of the current screen instead of replacing it: menus, bottom sheets, dialogs, tooltips, toasts. In Figma, choose Open overlay, set its position (centred, bottom, manual), whether clicking outside closes it, and a background dim. Good modal overlays dim the page behind (so the overlay is the figure and the page the ground), are centred or attached to the bottom on phones, have a clear title and a specific primary action, and can always be dismissed. Use them for focused decisions; never stack overlays on overlays.",
        webLab: {
          task:
            "Make this transfer screen behave like a polished prototype, in style.css. The header (.bar) must stay at the top of the screen while the content scrolls (position: sticky). The confirmation overlay (opened by Send ₦5,000) must be centred horizontally, at most 400px wide, with rounded corners (at least 12px); dim the page behind it with a ::backdrop whose colour is at least 40% opaque; and animate its entrance with an animation between 150ms and 300ms, removed when the user prefers reduced motion.",
          files: { "index.html": MODAL_HTML, "style.css": MODAL_CSS, "app.js": MODAL_JS },
          readOnly: ["index.html", "app.js"],
          tests: [
            { label: "The header stays at the top while scrolling", check: "window.scrollTo(0, 600); await wait(50); const t = rect('.bar').top; window.scrollTo(0, 0); return style('.bar', 'position') === 'sticky' && Math.abs(t) < 1;", fail: ".bar { position: sticky; top: 0; }" },
            { label: "The overlay is centred and at most 400px wide", check: "await click('#open'); await wait(350); const r = rect('#sheet'); const ok = $('#sheet').open && r.width <= 400 && r.width >= 280 && Math.abs(r.left - (width() - r.right)) < 2; $('#sheet').close(); return ok;", fail: ".sheet { width: calc(100% - 32px); max-width: 400px; }" },
            { label: "The overlay has rounded corners", check: "return px(style('#sheet', 'border-top-left-radius')) >= 12;", fail: ".sheet { border-radius: 16px; }" },
            { label: "The page behind is dimmed by at least 40%", check: "await click('#open'); const c = getComputedStyle($('#sheet'), '::backdrop').backgroundColor; $('#sheet').close(); const m = c.match(/rgba?\\(([^)]+)\\)/); const a = m ? (m[1].split(',')[3] === undefined ? 1 : parseFloat(m[1].split(',')[3])) : 0; return a >= 0.4;", fail: ".sheet::backdrop { background: rgba(15, 23, 42, 0.55); }" },
            { label: "The overlay animates in, 150–300ms, with a reduced-motion fallback", check: "const d = parseFloat(style('#sheet', 'animation-duration')) * 1000; const name = style('#sheet', 'animation-name'); return name !== 'none' && d >= 150 && d <= 300 && rules().some((r) => /prefers-reduced-motion/.test(r.media || '') && /sheet/.test(r.selector) && /none/.test(r.style.animation || r.style.animationName || ''));", fail: ".sheet { animation: pop-in 200ms ease-out; } and @media (prefers-reduced-motion: reduce) { .sheet { animation: none; } }" },
          ],
          solution: { "style.css": MODAL_CSS_DONE },
          hint: "The dialog element has its own ::backdrop pseudo-element for the dim layer behind it.",
          successMessage: "A header that stays put, and an overlay that arrives quickly, focuses attention and can be calmed down for people who need less motion.",
        },
      },
      {
        id: "a-ux-scroll-behaviour",
        title: "Scroll behaviour",
        explain:
          "When a frame's content is taller than the device screen, Figma lets it scroll vertically in the prototype; you can also allow horizontal scrolling for carousels, or both directions for maps. Set elements to stay fixed while scrolling (headers, tab bars, floating buttons) or to be sticky (they scroll until they reach the top, then stay, like section headers in a long list). Use Scroll to for in-page links. Realistic scrolling matters in testing: a prototype that shows a whole long page squeezed onto one screen hides problems such as important buttons ending up far below the fold.",
      },
      {
        id: "a-ux-interactive-forms",
        title: "Interactive forms",
        explain:
          "Forms are where prototypes most often feel fake: typing does nothing and every field is pre-filled. Make them feel real by using component variants for each field state (empty, focused, filled, error), interactions that move between them, and Figma variables with conditionals to store what was chosen (a selected plan, a quantity) and show it on later screens or show an error when a condition fails. Prototype at least one error state, because how people react to errors is one of the most valuable things a test reveals. When a form is the main thing being tested, consider a coded prototype where real typing works.",
        decision: {
          scenario: "In a prototype, every form field is already filled and tapping Continue always succeeds. In testing, every participant completes sign-up.",
          question: "What can the team conclude?",
          options: [
            { id: "a", text: "Very little about the form: the prototype never let people type, choose or make a mistake", why: "A prototype can only test what it simulates. Add field states and at least one error path to learn how people really cope." },
            { id: "b", text: "The sign-up form is perfect", whyWrong: "Nobody actually filled it in." },
            { id: "c", text: "Users never make mistakes", whyWrong: "The prototype made mistakes impossible." },
            { id: "d", text: "Testing is unnecessary for forms", whyWrong: "Forms are among the most error-prone parts of any product." },
          ],
          correct: "a",
          aftermath: "A prototype tests only what it simulates.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 44 · 10.16 – 10.18, 10.P
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ux-l44-presenting",
    moduleId: "ux-m10-prototyping",
    sectionId: SECTION_ID,
    order: 4,
    covers: ["10.16", "10.17", "10.18", "10.P"],
    title: "Realistic Prototypes, Sharing and Presenting",
    subtitle: "Making it believable, putting it in people's hands, and telling its story",
    estimatedMinutes: 32,
    intro:
      "A prototype is only as useful as the reactions it gets. This lesson covers building realistic experiences, sharing prototypes properly, and presenting design concepts, then sets your practical: an interactive mobile banking prototype.",

    atoms: [
      {
        id: "a-ux-realistic-experiences",
        title: "Building realistic user experiences",
        explain:
          "Realism makes people react as they would to the real product. Use real content: real names, realistic amounts formatted properly (₦48,200.00, not 00000), real dates, and plausible account numbers. Include the states people will meet: an empty list, an error, a slow load (use After delay to simulate waiting). Show feedback after actions (a success screen with a reference number). Use a device frame and test on a real phone with the Figma mobile app, at real size. Fake details (lorem ipsum, \"John Doe\", round numbers everywhere) remind people they are in a test, and they start judging the design instead of using it.",
      },
      {
        id: "a-ux-sharing-prototypes",
        title: "Sharing prototypes",
        explain:
          "Share a prototype with the Share prototype button, which creates a link that opens in presentation view. Set the starting flow, the device frame, and who can view (anyone with the link, or only invited people, with an optional password for client work). Stakeholders can leave comments in the prototype view. For usability tests, send the link to the moderator's device or open it in the Figma mobile app; hide the Figma interface (hotspot hints, flow list) so participants are not guided. Keep a named version for each round of testing so you know exactly what each participant saw.",
      },
      {
        id: "a-ux-presenting-concepts",
        title: "Presenting design concepts",
        explain:
          "Present the problem before the solution: who the users are, what they struggle with, and what success looks like. Then walk through the prototype as a story, following one persona through one scenario, rather than touring every screen. Explain the key decisions and the evidence behind them (\"we show the recipient's name because three of five testers sent money to the wrong account\"). Ask for specific feedback (\"does this flow meet the compliance team's requirements?\") rather than \"what do you think?\", which invites opinions on colours. Note feedback without defending every choice on the spot, and follow up with what you will change.",
        decision: {
          scenario: "In a design review, a stakeholder says: \"I don't like the green.\" The rest of the meeting turns into a debate about colour.",
          question: "How could the designer have prevented this?",
          options: [
            { id: "a", text: "Start with the problem and goals, present decisions with their evidence, and ask for feedback on specific questions", why: "Framing the review around goals and evidence keeps feedback focused on whether the design works." },
            { id: "b", text: "Never show colour in a review", whyWrong: "High-fidelity reviews need colour; the framing is what matters." },
            { id: "c", text: "Change the colour immediately to end the debate", whyWrong: "Changing things without reasons undermines the design's logic." },
            { id: "d", text: "Ask the stakeholder to stop talking", whyWrong: "Stakeholders' views matter; direct them instead." },
          ],
          correct: "a",
          aftermath: "The way you present decides the kind of feedback you get.",
        },
      },
      {
        id: "a-ux-banking-lab",
        title: "Practical: a mobile banking prototype",
        explain:
          "A convincing banking prototype needs a complete transfer flow with realistic content, a confirmation that shows the recipient's name before sending (error prevention), a success screen with a reference, and a failure path that reassures people about their money and lets them try again. In a Figma test you would add a prototype-only control to reach the failure path; this lab does the same.",
        webLab: {
          task:
            "Finish the banking prototype in its HTML files. Wire it: Log in → home.html; Transfer → transfer.html; Send ₦5,000 → success.html; the simulate-failure link → failed.html; Done → home.html; Try again → transfer.html. Make it realistic: the home balance formatted like ₦48,200.00 (with a comma and kobo); the transfer screen showing the recipient's name, \"Tunde Bakare\", in #recipient before sending; the success screen saying how much was sent to whom, with a reference such as \"Ref: TRF-20480913\"; and the failed screen saying the person has not been charged.",
          files: { ...BANK, "style.css": BANK_CSS },
          readOnly: ["style.css"],
          tests: [
            { label: "Log in goes to the home screen", check: "return ($('#login')?.getAttribute('href') || '').replace(/^\\.\\//, '') === 'home.html';", fail: "In index.html: Log in → home.html." },
            { label: "Home: a realistic balance and a wired Transfer button", page: "home.html", check: "return /^₦\\d{1,3}(,\\d{3})+\\.\\d{2}$/.test(text('#balance')) && $('#to-transfer').getAttribute('href') === 'transfer.html';", fail: "Balance like ₦48,200.00, and Transfer → transfer.html." },
            { label: "Transfer: shows the recipient's name, and both paths are wired", page: "transfer.html", check: "return /Tunde Bakare/.test(text('#recipient')) && $('#send').getAttribute('href') === 'success.html' && $('#simulate-fail').getAttribute('href') === 'failed.html';", fail: "Put \"Name: Tunde Bakare\" in #recipient; Send → success.html; simulate → failed.html." },
            { label: "Success: amount, recipient and a reference, then back home", page: "success.html", check: "const t = text('#summary'); return /₦5,000/.test(t) && /Tunde Bakare/.test(t) && /Ref[:.]?\\s*[A-Z0-9-]{6,}/i.test(t) && $('#done-home').getAttribute('href') === 'home.html';", fail: "\"₦5,000 sent to Tunde Bakare. Ref: TRF-20480913\" and Done → home.html." },
            { label: "Failed: reassures about money and offers a retry", page: "failed.html", check: "return /not been charged|no money (was|has been) taken|not charged/i.test(text('#reason')) && $('#retry').getAttribute('href') === 'transfer.html';", fail: "\"The bank did not respond. You have not been charged.\" and Try again → transfer.html." },
          ],
          solution: BANK_DONE,
          hint: "Realism is in the details: formatted money, a real name before sending, and a reference after.",
          successMessage: "A complete, believable banking flow, including the failure people fear most. That is a prototype worth testing with real users.",
        },
      },
    ],

    task: {
      title: "Module 10 practical: an interactive prototype of a mobile banking application",
      intro: "Build it in Figma, on a 375px phone frame, using your components.",
      prompts: [
        "Design the screens for log in, home (balance and recent transactions), transfer (enter amount, choose recipient), confirm (showing the recipient's name), success and failure.",
        "Connect every screen with appropriate transitions: push forward and back, a bottom sheet overlay for confirmation, and Smart Animate for hiding and showing the balance.",
        "Make components interactive: a balance show/hide toggle, a PIN keypad with button states, and tabs in the bottom navigation.",
        "Use realistic content throughout, add an After delay loading state before success, and include a prototype-only path to the failure screen.",
        "Share the prototype with a link, test it on your own phone with the Figma app, and present it to one person as a story.",
      ],
      closing: "Module 11 puts your prototype in front of real users and measures how well it works.",
    },

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
