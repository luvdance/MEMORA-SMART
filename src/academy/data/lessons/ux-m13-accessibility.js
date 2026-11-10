/**
 * UI/UX DESIGN · MODULE 13 · ACCESSIBILITY, INCLUSIVE DESIGN AND DESIGN ETHICS
 *
 * Curriculum 13.1 – 13.19 and the practical 13.P. Digital accessibility,
 * inclusive design, WCAG and POUR, contrast, typography, keyboard, screen
 * readers, focus, forms, visual, motor and cognitive impairments, literacy,
 * culture and language, ethics, dark patterns, privacy and responsible data.
 * Labs are checked against WCAG criteria in the rendered page: contrast
 * ratios, accessible names, heading order, focus styles and text that scales.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

import { BASE, page, CONTRAST } from "./ux-kit.js";

export const SECTION_ID = "ux-s13-accessibility";

/* ── Lesson 53 lab: accessible typography ──────────────────────────────── */
const TYPE_HTML = page(
  "Clinic notice",
  `  <main class="notice">
    <h1 class="notice__title">Changes to clinic opening hours</h1>
    <p class="notice__lead">From Monday 2 March, the clinic opens at 7am and closes at 6pm on weekdays.</p>
    <p class="notice__body">Saturday clinics continue from 8am to 1pm. Emergency services remain open at all times. If you have an appointment booked after 6pm, we will call you to move it to a new time that suits you.</p>
  </main>`
);

const TYPE_CSS = `${BASE}
body { color: #111827; }

.notice { max-width: 640px; margin: 0 auto; padding: 24px 16px; }
.notice__title { font-size: 26px; line-height: 1.2; }
.notice__lead { font-size: 13px; line-height: 1.1; text-transform: uppercase; color: #9ca3af; }
.notice__body { font-size: 12px; line-height: 1.1; text-align: justify; color: #a1a1aa; }
`;

const TYPE_CSS_DONE = `${BASE}
body { color: #111827; }

.notice { max-width: 640px; margin: 0 auto; padding: 24px 16px; }

/* rem units grow with the reader's browser text size */
.notice__title { font-size: 1.75rem; line-height: 1.2; }
.notice__lead { font-size: 1.125rem; line-height: 1.5; color: #374151; }
.notice__body { font-size: 1rem; line-height: 1.6; text-align: left; color: #374151; }
`;

/* ── Lesson 54 lab: keyboard and screen readers ────────────────────────── */
const KB_HTML = page(
  "Health portal",
  `  <header class="top">
    <a class="logo" href="/">Lafia Health</a>
    <div class="menu-btn" onclick="this.classList.toggle('on')"><svg viewBox="0 0 24 24" width="24" height="24"><path d="M3 6h18v2H3zm0 5h18v2H3zm0 5h18v2H3z" fill="currentColor"/></svg></div>
  </header>
  <main class="content">
    <h1>Book an appointment</h1>
    <img class="photo" src="images/profile.jpg">
    <img class="decor" src="images/logo.svg">
    <h4>Your details</h4>
    <form class="form" action="/book" method="post">
      <input id="patient" name="patient" placeholder="Full name">
      <input id="phone" name="phone" type="tel" placeholder="Phone number">
      <button class="submit" type="submit">Book appointment</button>
    </form>
  </main>`
);

const KB_HTML_DONE = page(
  "Health portal",
  `  <a class="skip" href="#main">Skip to main content</a>
  <header class="top">
    <a class="logo" href="/">Lafia Health</a>
    <button class="menu-btn" type="button" aria-label="Open menu" aria-expanded="false"><svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" focusable="false"><path d="M3 6h18v2H3zm0 5h18v2H3zm0 5h18v2H3z" fill="currentColor"/></svg></button>
  </header>
  <main class="content" id="main">
    <h1>Book an appointment</h1>
    <img class="photo" src="images/profile.jpg" alt="Dr Hauwa Bello, family doctor, smiling in her consulting room">
    <img class="decor" src="images/logo.svg" alt="">
    <h2>Your details</h2>
    <form class="form" action="/book" method="post">
      <label for="patient">Full name</label>
      <input id="patient" name="patient" autocomplete="name">
      <label for="phone">Phone number</label>
      <input id="phone" name="phone" type="tel" autocomplete="tel">
      <button class="submit" type="submit">Book appointment</button>
    </form>
  </main>`
);

const KB_CSS = `${BASE}
body { color: #111827; }
.top { display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; border-bottom: 1px solid #e5e7eb; }
.logo { font-weight: 700; color: #065f46; }
.menu-btn { display: inline-flex; align-items: center; justify-content: center; width: 44px; height: 44px; border: 0; background: transparent; color: #065f46; cursor: pointer; }
.content { max-width: 560px; margin: 0 auto; padding: 24px 16px; }
.photo { width: 160px; border-radius: 12px; }
.decor { width: 48px; margin-top: 16px; }
.form label { display: block; margin: 16px 0 4px; font-weight: 700; }
.form input { display: block; width: 100%; min-height: 44px; padding: 10px 12px; border: 1px solid #6b7280; border-radius: 8px; font: inherit; }
.submit { margin-top: 24px; min-height: 48px; padding: 12px 24px; border: 0; border-radius: 8px; background: #065f46; color: #ffffff; font: inherit; font-weight: 700; }
*:focus { outline: none; }
`;

const KB_CSS_DONE = `${BASE}
body { color: #111827; }

/* Skip link: hidden until focused, then visible at the top */
.skip { position: absolute; left: 16px; top: -100px; padding: 12px 16px; background: #065f46; color: #ffffff; font-weight: 700; z-index: 10; }
.skip:focus { top: 8px; }

.top { display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; border-bottom: 1px solid #e5e7eb; }
.logo { font-weight: 700; color: #065f46; }
.menu-btn { display: inline-flex; align-items: center; justify-content: center; width: 44px; height: 44px; border: 0; background: transparent; color: #065f46; cursor: pointer; }
.content { max-width: 560px; margin: 0 auto; padding: 24px 16px; }
.photo { width: 160px; border-radius: 12px; }
.decor { width: 48px; margin-top: 16px; }
.form label { display: block; margin: 16px 0 4px; font-weight: 700; }
.form input { display: block; width: 100%; min-height: 44px; padding: 10px 12px; border: 1px solid #6b7280; border-radius: 8px; font: inherit; }
.submit { margin-top: 24px; min-height: 48px; padding: 12px 24px; border: 0; border-radius: 8px; background: #065f46; color: #ffffff; font: inherit; font-weight: 700; }

/* A strong, visible focus indicator for every interactive element */
:focus-visible { outline: 3px solid #1d4ed8; outline-offset: 2px; }
`;

/* ── Lesson 55 lab: colour-blind-safe status and plain language ────────── */
const STATUS_HTML = page(
  "School fees",
  `  <main class="page">
    <h1>Fee status</h1>
    <ul class="list">
      <li class="item"><span>Adaeze Nnamdi</span><span class="badge badge--paid"></span></li>
      <li class="item"><span>Ibrahim Musa</span><span class="badge badge--pending"></span></li>
      <li class="item"><span>Grace Etim</span><span class="badge badge--overdue"></span></li>
    </ul>
    <p class="error" role="alert">Authentication failure: credentials invalid. Error code 401.</p>
  </main>`
);

const STATUS_HTML_DONE = page(
  "School fees",
  `  <main class="page">
    <h1>Fee status</h1>
    <ul class="list">
      <li class="item"><span>Adaeze Nnamdi</span><span class="badge badge--paid">Paid</span></li>
      <li class="item"><span>Ibrahim Musa</span><span class="badge badge--pending">Pending</span></li>
      <li class="item"><span>Grace Etim</span><span class="badge badge--overdue">Overdue</span></li>
    </ul>
    <p class="error" role="alert">That phone number or password is wrong. Please try again.</p>
  </main>`
);

const STATUS_CSS = `${BASE}
body { color: #111827; }
.page { max-width: 480px; margin: 0 auto; padding: 24px 16px; }
.list { list-style: none; margin: 0 0 24px; padding: 0; }
.item { display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid #e5e7eb; }

.badge { display: inline-block; width: 12px; height: 12px; border-radius: 50%; }
.badge--paid { background: #4ade80; }
.badge--pending { background: #facc15; }
.badge--overdue { background: #f87171; }

.error { padding: 12px 16px; border-radius: 8px; background: #fef2f2; color: #b91c1c; }
`;

const STATUS_CSS_DONE = `${BASE}
body { color: #111827; }
.page { max-width: 480px; margin: 0 auto; padding: 24px 16px; }
.list { list-style: none; margin: 0 0 24px; padding: 0; }
.item { display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid #e5e7eb; }

/* Status shown by words AND a symbol AND colour */
.badge { display: inline-flex; align-items: center; gap: 4px; padding: 4px 10px; border-radius: 999px; font-size: 14px; font-weight: 700; }
.badge--paid { background: #dcfce7; color: #166534; }
.badge--paid::before { content: "✓"; }
.badge--pending { background: #fef9c3; color: #854d0e; }
.badge--pending::before { content: "…"; }
.badge--overdue { background: #fee2e2; color: #991b1b; }
.badge--overdue::before { content: "!"; }

.error { padding: 12px 16px; border-radius: 8px; background: #fef2f2; color: #b91c1c; }
`;

/* ── Lesson 56 lab: removing dark patterns ─────────────────────────────── */
const DARK_HTML = page(
  "Checkout",
  `  <main class="checkout">
    <h1>Your order</h1>
    <ul class="lines">
      <li><span>Data bundle, 10GB</span><span>₦3,500</span></li>
      <li class="fee"><span>Service fee</span><span>₦350</span></li>
      <li class="total"><span>Total</span><span>₦3,850</span></li>
    </ul>
    <label class="opt"><input type="checkbox" id="marketing" checked> Send me offers from partner companies</label>
    <label class="opt"><input type="checkbox" id="renew" checked> Renew automatically every month</label>
    <div class="actions">
      <button class="pay" type="button">Pay ₦3,850</button>
      <a class="decline" href="/">No thanks, I prefer paying more for data</a>
    </div>
  </main>`
);

const DARK_HTML_DONE = page(
  "Checkout",
  `  <main class="checkout">
    <h1>Your order</h1>
    <ul class="lines">
      <li><span>Data bundle, 10GB</span><span>₦3,500</span></li>
      <li class="fee"><span>Service fee</span><span>₦350</span></li>
      <li class="total"><span>Total</span><span>₦3,850</span></li>
    </ul>
    <label class="opt"><input type="checkbox" id="marketing"> Send me offers from partner companies</label>
    <label class="opt"><input type="checkbox" id="renew"> Renew automatically every month (you can cancel any time in Settings)</label>
    <div class="actions">
      <button class="pay" type="button">Pay ₦3,850</button>
      <a class="decline" href="/">No thanks</a>
    </div>
  </main>`
);

const DARK_CSS = `${BASE}
body { color: #111827; }
.checkout { max-width: 440px; margin: 0 auto; padding: 24px 16px; }
.lines { list-style: none; margin: 0 0 16px; padding: 0; }
.lines li { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e5e7eb; }
.fee { display: none !important; }
.total { font-weight: 700; }
.opt { display: flex; gap: 8px; align-items: flex-start; margin: 12px 0; font-size: 11px; color: #9ca3af; }
.actions { margin-top: 24px; }
.pay { width: 100%; min-height: 52px; border: 0; border-radius: 10px; background: #15803d; color: #ffffff; font: inherit; font-weight: 700; }
.decline { display: block; margin-top: 12px; font-size: 11px; color: #d1d5db; text-align: center; }
`;

const DARK_CSS_DONE = `${BASE}
body { color: #111827; }
.checkout { max-width: 440px; margin: 0 auto; padding: 24px 16px; }
.lines { list-style: none; margin: 0 0 16px; padding: 0; }
.lines li { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e5e7eb; }
.total { font-weight: 700; }
.opt { display: flex; gap: 8px; align-items: flex-start; margin: 12px 0; font-size: 15px; color: #374151; }
.actions { margin-top: 24px; }
.pay { width: 100%; min-height: 52px; border: 0; border-radius: 10px; background: #15803d; color: #ffffff; font: inherit; font-weight: 700; }
.decline { display: block; margin-top: 12px; padding: 12px; font-size: 15px; color: #374151; text-align: center; }
`;

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 53 · 13.1 – 13.6
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ux-l53-a11y-foundations",
    moduleId: "ux-m13-accessibility",
    sectionId: SECTION_ID,
    order: 1,
    covers: ["13.1", "13.2", "13.3", "13.4", "13.5", "13.6"],
    title: "Accessibility, Inclusion, WCAG and Readable Text",
    subtitle: "Designing for the full range of people who use digital products",
    estimatedMinutes: 32,
    intro:
      "Phase 5 starts with the most important professional responsibility a designer has: making products that everyone can use. This lesson covers what digital accessibility and inclusive design mean, the WCAG standard and its four principles, colour contrast requirements and accessible typography.",

    atoms: [
      {
        id: "a-ux-digital-accessibility",
        title: "Introduction to digital accessibility",
        explain:
          "Digital accessibility means people with disabilities can perceive, understand, navigate and interact with digital products. The World Health Organization estimates that about 1.3 billion people, one in six, live with a significant disability: blind and low-vision users, deaf and hard-of-hearing users, people with motor impairments who cannot use a mouse or touch precisely, and people with cognitive or learning disabilities. Disability can also be temporary (a broken arm) or situational (bright sunlight on a screen, a noisy bus, holding a baby in one arm). Accessible design helps all of them, and it is increasingly a legal requirement for public and commercial services.",
        why: "Accessibility is not a feature for a few users. Everyone will be temporarily or situationally disabled at some point, and most people become less able as they age.",
      },
      {
        id: "a-ux-inclusive-design",
        title: "Understanding inclusive design",
        explain:
          "Inclusive design is a broader approach: designing with and for the full range of human diversity, including ability, age, language, literacy, culture, income, devices and connectivity. Microsoft's inclusive design principles summarise it: recognise exclusion (notice who your design leaves out), solve for one and extend to many (a solution designed for one-armed users helps a parent holding a child), and learn from diversity (involve people with different experiences). Accessibility is the standard to meet; inclusive design is the mindset that gets you there and beyond.",
        table: {
          caption: "Permanent, temporary and situational: one solution, many people.",
          headers: ["", "Permanent", "Temporary", "Situational"],
          rows: [
            ["Touch", "One arm", "Arm injury", "Holding a baby"],
            ["See", "Blind", "Eye infection", "Bright sunlight"],
            ["Hear", "Deaf", "Ear infection", "Noisy bus park"],
            ["Speak", "Non-verbal", "Laryngitis", "Strong accent in another language"],
          ],
        },
      },
      {
        id: "a-ux-wcag-pour",
        title: "WCAG fundamentals and the POUR principles",
        explain:
          "The Web Content Accessibility Guidelines (WCAG), from the W3C, are the international standard; version 2.2 is current. Its success criteria are testable and grouped into three levels: A (the minimum), AA (the usual legal and industry target) and AAA (enhanced). Every criterion sits under one of four principles, remembered as POUR. Perceivable: people can perceive the content (text alternatives, captions, contrast). Operable: people can operate the interface (keyboard access, enough time, no seizure-causing flashes, targets large enough). Understandable: content and operation are understandable (plain language, predictable behaviour, help with errors). Robust: it works with assistive technologies such as screen readers, now and in future (valid, semantic code).",
        table: {
          caption: "POUR, with an example criterion for each.",
          headers: ["Principle", "Means", "Example criterion"],
          rows: [
            ["Perceivable", "Information can be seen, heard or felt", "1.4.3 Contrast (minimum): 4.5:1 for text"],
            ["Operable", "Everything can be used, whatever the input", "2.1.1 Keyboard: all functions available from a keyboard"],
            ["Understandable", "Content and behaviour make sense", "3.3.1 Error identification: errors described in text"],
            ["Robust", "Works with assistive technologies", "4.1.2 Name, role, value: controls expose their purpose"],
          ],
        },
      },
      {
        id: "a-ux-contrast-requirements",
        title: "Colour contrast requirements",
        explain:
          "WCAG's contrast requirements, at level AA: normal text needs a contrast ratio of at least 4.5:1 against its background (1.4.3); large text (24px and above, or about 19px bold) needs 3:1; and user interface components and meaningful graphics (input borders, icons, focus indicators, chart lines) need 3:1 against adjacent colours (1.4.11). Level AAA raises text to 7:1 (4.5:1 for large text). Disabled controls and pure decoration are exempt. Check every pair, in every state and mode, with a contrast checker (Figma plugins, WebAIM's checker, browser developer tools). Separately, never use colour as the only way to convey information (1.4.1).",
      },
      {
        id: "a-ux-accessible-typography",
        title: "Accessible typography",
        explain:
          "Readable text for everyone: body text of at least 16px, specified in relative units (rem) so it grows when people increase their browser or phone text size; line height of about 1.5 for body text; left-aligned text (justified text creates uneven gaps that make reading hard for people with dyslexia); no long passages in capital letters or italics; comfortable line lengths; clear, familiar typefaces; and layouts that still work when text is enlarged to 200% (WCAG 1.4.4) and when people increase letter and line spacing (1.4.12). Never put essential text inside images.",
        webLab: {
          task:
            "This clinic notice is hard to read for many people. Fix style.css: every text at least 4.5:1 against the background; body and lead text at least 16px, specified in rem so they grow with the reader's text-size setting (the check doubles the root text size and expects the text to double); line height of at least 1.5 for the lead and body; no justified text; and no paragraph written in capital letters.",
          files: { "index.html": TYPE_HTML, "style.css": TYPE_CSS },
          readOnly: ["index.html"],
          tests: [
            { label: "All text passes 4.5:1", check: CONTRAST + "return passes('.notice__title', 4.5) && passes('.notice__lead', 4.5) && passes('.notice__body', 4.5);", fail: "Use a darker grey such as #374151." },
            { label: "Lead and body at least 16px", check: "return px(style('.notice__lead', 'font-size')) >= 16 && px(style('.notice__body', 'font-size')) >= 16;", fail: "font-size: 1rem or more." },
            { label: "Text grows with the reader's text size (rem)", check: "const before = [px(style('.notice__lead', 'font-size')), px(style('.notice__body', 'font-size'))]; document.documentElement.style.fontSize = '32px'; await tick(); const after = [px(style('.notice__lead', 'font-size')), px(style('.notice__body', 'font-size'))]; document.documentElement.style.fontSize = ''; return after.every((a, i) => Math.abs(a - 2 * before[i]) < 1);", fail: "Use rem units, not px, for font sizes." },
            { label: "Line height at least 1.5 for lead and body", check: "return ['.notice__lead', '.notice__body'].every((s) => px(style(s, 'line-height')) / px(style(s, 'font-size')) >= 1.5);", fail: "line-height: 1.5 or more." },
            { label: "No justified text and no all-caps paragraphs", check: "return $$('p').every((p) => style(p, 'text-align') !== 'justify' && style(p, 'text-transform') !== 'uppercase');", fail: "text-align: left; and remove text-transform: uppercase." },
          ],
          solution: { "style.css": TYPE_CSS_DONE },
          hint: "Most phones and browsers let people choose a larger text size. rem respects that choice; px ignores it.",
          successMessage: "The same notice, now readable by people with low vision, dyslexia or a large-text setting, and easier for everyone else.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 54 · 13.7 – 13.10
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ux-l54-keyboard-sr",
    moduleId: "ux-m13-accessibility",
    sectionId: SECTION_ID,
    order: 2,
    covers: ["13.7", "13.8", "13.9", "13.10"],
    title: "Keyboard, Screen Readers, Focus and Forms",
    subtitle: "Designing for people who do not see or do not touch the screen",
    estimatedMinutes: 32,
    intro:
      "Many people never use a mouse: they navigate with a keyboard, a switch device or a screen reader that reads the interface aloud. This lesson covers what designers must specify so these people can use a product: keyboard behaviour, screen reader semantics, focus indicators and accessible forms.",

    atoms: [
      {
        id: "a-ux-keyboard",
        title: "Keyboard navigation considerations",
        explain:
          "Keyboard users press Tab to move between interactive elements, Shift+Tab to go back, Enter or Space to activate, arrow keys inside components such as menus and tabs, and Escape to close. Design so that: every interactive element can be reached and used with the keyboard (real buttons and links, not clickable divs); the focus order follows the visual reading order; focus never gets trapped (except deliberately inside an open modal, which Escape closes); and a \"Skip to main content\" link appears first, so people do not tab through the whole header on every page. Annotate tab order and keyboard behaviour in your design specs.",
      },
      {
        id: "a-ux-screen-readers",
        title: "Screen reader considerations",
        explain:
          "Screen readers (TalkBack on Android, VoiceOver on Apple devices, NVDA and JAWS on Windows) read the interface aloud and let blind users navigate by headings, landmarks, links and form fields. They depend on structure the designer specifies: a logical heading hierarchy (one h1, then h2s, without skipping levels); landmarks (header, navigation, main, footer); text alternatives for meaningful images (describing what matters in context) and empty alt text for decorative ones; accessible names for icon-only buttons (\"Open menu\"); labels for every field; and announcements for changes (\"3 results found\", \"Item added to cart\"). Annotate these in handoff, because they are invisible in a mockup.",
        decision: {
          scenario: "A product photo on a shop page has alt=\"image\". A decorative swirl next to the heading has alt=\"decorative swirl graphic\".",
          question: "What should they be?",
          options: [
            { id: "a", text: "The photo describes what matters (\"Ankara tote bag in orange and blue with leather handles\"); the swirl has empty alt text (alt=\"\")", why: "Meaningful images need useful descriptions; decorative ones should be silent so screen reader users are not slowed down." },
            { id: "b", text: "Both should say \"image\"", whyWrong: "\"image\" tells the listener nothing." },
            { id: "c", text: "Both should be described in detail", whyWrong: "Describing decoration wastes the listener's time." },
            { id: "d", text: "Remove alt from both", whyWrong: "With no alt at all, screen readers may read the file name." },
          ],
          correct: "a",
          aftermath: "Describe what an image contributes; silence what it does not.",
        },
      },
      {
        id: "a-ux-focus-indicators",
        title: "Focus indicators",
        explain:
          "The focus indicator shows keyboard users where they are, like a mouse pointer. WCAG requires it to be visible (2.4.7), not hidden behind sticky headers or banners (2.4.11), and the stricter 2.4.13 describes a clear indicator: at least as large as a 2px outline around the element, with at least 3:1 contrast between focused and unfocused states. Never remove the browser's focus outline without replacing it (outline: none is a common, serious mistake). Design one consistent focus style for the whole system, such as a 3px blue outline offset by 2px, and include it in every component's states. :focus-visible shows it for keyboard users without distracting mouse users.",
      },
      {
        id: "a-ux-accessible-forms",
        title: "Accessible forms",
        explain:
          "Accessible forms have a visible label for every field, programmatically connected to it (for and id); instructions and format hints before the field, not only in placeholders; required fields marked in text, not just with colour or an asterisk alone; errors identified in text next to the field, connected with aria-describedby, and summarised at the top on submit; logical grouping of related fields (fieldset and legend for radio groups); appropriate input types and autocomplete so people can fill them quickly; and no time limits, or a way to extend them.",
        webLab: {
          task:
            "This booking page fails keyboard and screen reader users. Fix it in index.html and style.css: add a \"Skip to main content\" link as the first focusable element, pointing at the main element (give main an id); turn the menu <div> into a real <button> with an accessible name (aria-label) and its svg hidden from screen readers (aria-hidden=\"true\"); give the doctor's photo a meaningful alt text (at least 4 words) and the decorative logo an empty alt=\"\"; fix the heading levels so nothing is skipped (h1 then h2); give both fields visible labels; and replace the rule that removes focus outlines with a visible :focus-visible outline of at least 2px.",
          files: { "index.html": KB_HTML, "style.css": KB_CSS },
          tests: [
            { label: "A skip link is the first focusable element and points at main", check: "const f = $$('a[href], button, input, select, textarea')[0]; const id = (f?.getAttribute('href') || '').replace('#', ''); return !!f && f.tagName === 'A' && /skip/i.test(text(f)) && !!id && document.getElementById(id) === $('main');", fail: "First thing in the body: <a class=\"skip\" href=\"#main\">Skip to main content</a>, and <main id=\"main\">." },
            { label: "The menu is a real button with a name, its icon hidden", check: "const b = $('.menu-btn'); return b.tagName === 'BUTTON' && nameOf(b).length >= 4 && b.querySelector('svg')?.getAttribute('aria-hidden') === 'true';", fail: "<button class=\"menu-btn\" type=\"button\" aria-label=\"Open menu\"> with aria-hidden=\"true\" on the svg." },
            { label: "Meaningful alt on the photo, empty alt on decoration", check: "const p = $('.photo').getAttribute('alt'), d = $('.decor').getAttribute('alt'); return p !== null && p.trim().split(/\\s+/).length >= 4 && !/^(image|photo|picture)$/i.test(p.trim()) && d === '';", fail: "alt=\"Dr Hauwa Bello, family doctor, smiling…\" on the photo and alt=\"\" on the logo." },
            { label: "Headings do not skip levels", check: "const lv = $$('h1, h2, h3, h4, h5, h6').map((h) => Number(h.tagName[1])); return lv[0] === 1 && lv.every((l, i) => i === 0 || l <= lv[i - 1] + 1);", fail: "Change the h4 to an h2." },
            { label: "Both fields have visible, connected labels", check: "return ['#patient', '#phone'].every((s) => $(s).labels.length > 0 && visible($(s).labels[0]));", fail: "<label for=\"patient\">Full name</label> and <label for=\"phone\">Phone number</label>." },
            { label: "A visible focus outline of at least 2px", check: "return !/outline:\\s*none/.test(code('style.css')) && rules(/:focus-visible/).some((r) => parseFloat(r.style.outlineWidth) >= 2);", fail: "Remove *:focus { outline: none; } and add :focus-visible { outline: 3px solid #1d4ed8; }" },
          ],
          solution: { "index.html": KB_HTML_DONE, "style.css": KB_CSS_DONE },
          hint: "Most fixes are about using the right element: a button for actions, a label for fields, the right heading level.",
          successMessage: "Keyboard users can skip straight to the form and see where they are; screen reader users hear a named menu, a described photo, a clear outline and labelled fields.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 55 · 13.11 – 13.15
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ux-l55-inclusion",
    moduleId: "ux-m13-accessibility",
    sectionId: SECTION_ID,
    order: 3,
    covers: ["13.11", "13.12", "13.13", "13.14", "13.15"],
    title: "Designing for Different Abilities, Literacy and Cultures",
    subtitle: "Vision, movement, cognition, reading and language",
    estimatedMinutes: 32,
    intro:
      "Accessibility standards are a floor. This lesson looks at specific groups of people, what they experience, and what design choices help them: people with visual, motor and cognitive impairments, people with different literacy levels, and people of different languages and cultures.",

    atoms: [
      {
        id: "a-ux-visual-impairments",
        title: "Designing for visual impairments",
        explain:
          "Visual impairments range from blindness (screen reader users) to low vision (people who zoom to 200% to 400% or use screen magnifiers) and colour vision deficiency (about 1 in 12 men and 1 in 200 women, most often difficulty telling red from green). Design with strong contrast, text that scales and layouts that reflow when zoomed (no sideways scrolling at 400% on a 1280px screen, WCAG 1.4.10), and never colour alone: add text, icons, patterns or position, so a status reads as \"Overdue\" with a symbol, not merely a red dot. Test your designs with a colour-blindness simulator (Figma plugins, Chrome developer tools).",
        webLab: {
          task:
            "The fee-status list shows Paid, Pending and Overdue as coloured dots only, which colour-blind users cannot tell apart, and the error message is written in technical jargon. Fix both. In index.html: put the status word (Paid, Pending or Overdue) inside each badge, and rewrite the error in plain language: at most 15 words, mentioning the phone number or password, with no jargon (no \"authentication\", \"credentials\", \"invalid\" or error codes). In style.css: make each badge a readable label (its text at least 4.5:1 against its own background) with a symbol added by ::before, so colour is not the only signal.",
          files: { "index.html": STATUS_HTML, "style.css": STATUS_CSS },
          tests: [
            { label: "Each badge says its status in words", check: "const want = { paid: 'Paid', pending: 'Pending', overdue: 'Overdue' }; return Object.entries(want).every(([k, w]) => text('.badge--' + k).replace(/[^A-Za-z]/g, '') === w && visible('.badge--' + k));", fail: "<span class=\"badge badge--paid\">Paid</span>, and the same for Pending and Overdue." },
            { label: "Badge text is readable on its background", check: "return $$('.badge').every((b) => contrast(style(b, 'color'), style(b, 'background-color')) >= 4.5);", fail: "Pale backgrounds with dark text of the same hue, such as #dcfce7 with #166534." },
            { label: "Each badge has a symbol as well as colour", check: "return $$('.badge').every((b) => { const c = pseudo(b, '::before', 'content'); return c && c !== 'none' && c !== 'normal' && c !== '\"\"'; });", fail: ".badge--paid::before { content: \"✓\"; } and symbols for the others." },
            { label: "The error is in plain language", check: "const t = text('.error'); return t.split(/\\s+/).filter(Boolean).length <= 15 && /password|phone/i.test(t) && !/authentication|credential|invalid|\\b\\d{3}\\b|error code/i.test(t);", fail: "For example: \"That phone number or password is wrong. Please try again.\"" },
          ],
          solution: { "index.html": STATUS_HTML_DONE, "style.css": STATUS_CSS_DONE },
          hint: "Words, a symbol and colour together: anyone can read the status, whatever colours they see.",
          successMessage: "Statuses anyone can read, with or without colour vision, and an error message anyone can understand.",
        },
      },
      {
        id: "a-ux-motor-impairments",
        title: "Designing for motor impairments",
        explain:
          "Motor impairments (tremors, limited dexterity, paralysis, missing limbs, arthritis) affect how precisely and quickly people can point, tap and type. Some use keyboards, switch devices, voice control or eye tracking instead of a mouse or touch. Design large targets with space between them (44px or more), avoid gestures that need precision or multiple fingers (always offer a simple tap alternative to dragging, swiping or pinching, WCAG 2.5.1 and 2.5.7), avoid time limits or let people extend them, prevent accidental activation (actions happen on release, with undo), and make everything keyboard and voice operable with visible, sensible labels.",
      },
      {
        id: "a-ux-cognitive",
        title: "Cognitive accessibility",
        explain:
          "Cognitive and learning disabilities (dyslexia, ADHD, memory impairments, intellectual disabilities, the effects of brain injury or ageing) affect attention, memory, reading and problem solving. Help everyone think less: plain language and short sentences; one main task per screen; consistent navigation and component behaviour; clear headings and chunked content; recognition rather than recall (show, do not make people remember); generous time; forgiving inputs (accept 0803 123 4567 and 08031234567); clear, specific error messages; confirmation before irreversible actions; and minimal distractions (no autoplaying video or flashing banners).",
        decision: {
          scenario: "A government form times out after 5 minutes without warning and deletes everything entered. Many older applicants complain.",
          question: "What is the best accessible fix?",
          options: [
            { id: "a", text: "Warn before the time-out, let people extend it easily, and save progress so nothing is lost", why: "People who read, think or type slowly need time; saving progress removes the cost of interruptions for everyone." },
            { id: "b", text: "Shorten the form's instructions so people type faster", whyWrong: "The time limit is still the barrier." },
            { id: "c", text: "Add a countdown timer at the top", whyWrong: "Adds pressure without solving the loss of data." },
            { id: "d", text: "Tell applicants to prepare their answers in advance", whyWrong: "That shifts the burden to users without fixing the design." },
          ],
          correct: "a",
          aftermath: "WCAG 2.2.1: let people turn off, adjust or extend time limits.",
        },
      },
      {
        id: "a-ux-literacy",
        title: "Designing for different literacy levels",
        explain:
          "Many users read slowly, read in a second language, or read very little: in Nigeria, literacy varies widely by region, age and language. Design for low literacy with plain words and short sentences (aim for a reading age of about 9 to 11 for public services); familiar icons always paired with text labels; numbers and examples instead of abstract descriptions; step-by-step flows with one question per screen; voice and audio alternatives (voice notes, read-aloud, IVR); and channels people already use (USSD, WhatsApp). Test with people of different literacy levels, not only with educated city users.",
      },
      {
        id: "a-ux-cultural-linguistic",
        title: "Cultural and linguistic considerations",
        explain:
          "Nigeria has more than 500 languages; products often need English, Hausa, Yoruba, Igbo and Nigerian Pidgin. Design for translation: allow text to expand (translations can be 30% to 50% longer), never put text in images, avoid idioms and wordplay, and let people choose their language easily (written in that language, not as flags). Some scripts read right to left (Arabic and Ajami), so layouts must mirror. Respect local formats (₦12,500.00, dates as day/month/year, phone numbers starting 080), names that do not fit \"first name, last name\" fields, and imagery, colours and gestures that may mean different things in different cultures and religions.",
        table: {
          caption: "Designing for language and culture.",
          headers: ["Consideration", "Design response"],
          rows: [
            ["Translations are longer", "Flexible layouts; test with the longest language"],
            ["Language choice", "List languages in their own names: Hausa, Yorùbá, Igbo"],
            ["Right-to-left scripts", "Mirror layouts for Arabic and Ajami"],
            ["Local formats", "₦, day/month/year, local phone formats"],
            ["Names", "One \"Full name\" field instead of forcing first/last"],
            ["Imagery", "Show local people, places and contexts"],
          ],
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 56 · 13.16 – 13.19, 13.P
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ux-l56-ethics",
    moduleId: "ux-m13-accessibility",
    sectionId: SECTION_ID,
    order: 4,
    covers: ["13.16", "13.17", "13.18", "13.19", "13.P"],
    title: "Ethics, Dark Patterns, Privacy and Data",
    subtitle: "Designing in people's interests, not against them",
    estimatedMinutes: 32,
    intro:
      "Design has power: it can help people make good decisions or trick them into bad ones. This lesson covers ethical design, the deceptive patterns to refuse, privacy-conscious design and the responsible use of user data, then sets your practical: an accessibility audit and redesign.",

    atoms: [
      {
        id: "a-ux-ethical-design",
        title: "Ethical design",
        explain:
          "Ethical design means making products that respect people's interests, autonomy, wellbeing and rights, even when a less ethical design would make more money in the short term. Ask of every design: does this help people do what they want, or push them into what we want? Would they be upset if they understood what we did? Who could be harmed, including people who are not our users? Ethics covers honesty (no deception), respect for attention (no manipulative notifications or endless feeds designed to addict), fairness (no discrimination by algorithms or exclusion by design), and privacy. Designers often have to raise these questions; they are part of the job.",
      },
      {
        id: "a-ux-dark-patterns",
        title: "Dark patterns and deceptive interfaces",
        explain:
          "Dark patterns (deceptive patterns) are interface designs that trick or pressure people into doing things they did not intend. They work in the short term and destroy trust in the long term, and regulators increasingly fine companies for them. Learn to recognise and refuse them.",
        table: {
          caption: "Common dark patterns.",
          headers: ["Pattern", "What it does", "Example"],
          rows: [
            ["Hidden costs", "Reveals fees only at the last step", "A service fee hidden until payment"],
            ["Preselection", "Ticks options in the company's favour by default", "Marketing consent already ticked"],
            ["Confirmshaming", "Guilt-trips people who decline", "\"No thanks, I prefer paying more\""],
            ["Roach motel", "Easy to get in, hard to get out", "One tap to subscribe, a phone call to cancel"],
            ["Forced continuity", "A free trial silently becomes paid", "Card charged with no reminder"],
            ["Disguised ads", "Ads made to look like content or buttons", "A fake \"Download\" button"],
            ["Trick questions", "Confusing wording to get the wrong answer", "\"Untick to not receive no emails\""],
            ["Nagging", "Repeated interruptions until people give in", "Daily pop-ups to enable notifications"],
          ],
        },
        webLab: {
          task:
            "This checkout uses four dark patterns. Remove them. In style.css: show the service fee line that is hidden from the order summary, and make the two option labels and the decline link readable (at least 14px and 4.5:1). In index.html: untick both pre-ticked options (marketing consent and automatic renewal must be opt-in), and replace the confirmshaming decline link with a neutral \"No thanks\".",
          files: { "index.html": DARK_HTML, "style.css": DARK_CSS },
          tests: [
            { label: "The service fee is visible before paying", check: "return visible('.fee') && /350/.test(text('.fee'));", fail: "Remove the rule that hides .fee." },
            { label: "Marketing and renewal are not pre-ticked", check: "return !$('#marketing').checked && !$('#renew').checked;", fail: "Remove the checked attribute from both checkboxes." },
            { label: "The decline link is neutral", check: "const t = text('.decline'); return /no thanks/i.test(t) && !/prefer|pay(ing)? more|miss out|don't care|don't want to save/i.test(t);", fail: "Just \"No thanks\"." },
            { label: "Options and decline link are readable", check: CONTRAST + "return ['.opt', '.decline'].every((s) => $$(s).every((n) => px(style(n, 'font-size')) >= 14)) && passes('.opt', 4.5) && passes('.decline', 4.5);", fail: "font-size: 15px; color: #374151;" },
          ],
          solution: { "index.html": DARK_HTML_DONE, "style.css": DARK_CSS_DONE },
          hint: "Every hidden, pre-ticked or tiny thing on this page is working against the customer.",
          successMessage: "An honest checkout: every cost visible, every choice the customer's own, and no guilt. That is how trust, and repeat customers, are earned.",
        },
      },
      {
        id: "a-ux-privacy-design",
        title: "Privacy-conscious design",
        explain:
          "Privacy by design builds privacy in from the start rather than adding it later. Collect only the data you need for a clear purpose (data minimisation: does a data-bundle shop need a date of birth?); make the most private option the default; ask for permissions just in time, when the feature needs them, explaining why (\"Allow location to find agents near you\"), and keep the product working if people say no; make consent specific, informed and as easy to withdraw as to give; and let people see, download and delete their data. In Nigeria the Nigeria Data Protection Act 2023 sets legal requirements for consent, purpose and data subjects' rights, alongside international laws such as the EU's GDPR.",
        decision: {
          scenario: "A new savings app asks for access to contacts, location, camera and SMS the moment it opens, before the user has even signed up.",
          question: "What is the privacy-conscious approach?",
          options: [
            { id: "a", text: "Ask for each permission only when a feature needs it, explain why, and let the app keep working if people decline", why: "Just-in-time requests with reasons build trust and avoid collecting data that is never needed." },
            { id: "b", text: "Ask for all permissions at once, so users only see one prompt", whyWrong: "Front-loading permissions without context alarms people and collects data that may never be used." },
            { id: "c", text: "Hide the permissions in the terms and conditions", whyWrong: "Deceptive, and against data protection law." },
            { id: "d", text: "Refuse to open the app without every permission", whyWrong: "Coercive and unnecessary." },
          ],
          correct: "a",
          aftermath: "Ask when it matters, say why, and accept no.",
        },
      },
      {
        id: "a-ux-responsible-data",
        title: "Responsible use of user data",
        explain:
          "Responsible data use goes beyond legal compliance. Be transparent: explain in plain words what data you collect, why, who you share it with and for how long, at the moment it matters, not only in a long policy. Use data only for the purpose people agreed to, and never in ways that could surprise or harm them (selling contacts, shaming borrowers by messaging their contacts, as some predatory loan apps have done). Protect it (designers specify masked account numbers and confirmation before showing sensitive data) and delete what is no longer needed. When data trains algorithms or AI, check for bias that could treat groups unfairly.",
      },
    ],

    task: {
      title: "Module 13 practical: audit a website for accessibility and redesign problem sections",
      intro: "Choose a real, public Nigerian website or app (a bank, a university portal, a government service).",
      prompts: [
        "Run an automated check (Lighthouse or a browser extension) and record the issues it finds.",
        "Audit manually: keyboard-only use of a key task, zoom to 200%, contrast of every text and control, colour-only meaning, images and their alt text, form labels and errors, and a screen reader pass with TalkBack or VoiceOver.",
        "Write up each issue with the WCAG criterion it fails, its severity and who it affects, and check the site for dark patterns and privacy problems.",
        "Redesign the three worst sections in Figma, annotated with the accessibility fixes (focus order, names, alt text, contrast values).",
        "Present the audit and redesign as a short report you could send to the site's owners.",
      ],
      closing: "Module 14 prepares your designs for the developers who will build them.",
    },

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
