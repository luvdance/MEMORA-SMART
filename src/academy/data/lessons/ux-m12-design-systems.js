/**
 * UI/UX DESIGN · MODULE 12 · DESIGN SYSTEMS AND COMPONENT ARCHITECTURE
 *
 * Curriculum 12.1 – 12.18 and the practical 12.P. Design systems and style
 * guides, design tokens (colour, typography, spacing), grid systems,
 * component architecture, atomic design, reusable components, variants,
 * states, naming, shared libraries, documentation, consistency, scaling and
 * accessibility inside a design system. The token lab proves the tiers work
 * by rebranding the page live.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

import { BASE, page, docPage, MD, CONTRAST } from "./ux-kit.js";

export const SECTION_ID = "ux-s12-design-systems";

/* ── Lesson 49 lab: token tiers ────────────────────────────────────────── */
const TOKENS_HTML = page(
  "Shop components",
  `  <main class="page">
    <article class="card">
      <h2 class="card__title">Ankara tote bag</h2>
      <p class="card__meta">Handmade in Aba · Free delivery</p>
      <p class="card__price">₦18,500</p>
      <a class="btn" href="cart.html">Add to cart</a>
    </article>
    <p class="alert">Only 2 left in stock</p>
  </main>`
);

const PRIMITIVES = `/* Tier 1: primitive tokens, the raw palette. Do not use these in components. */
:root {
  --purple-700: #6d28d9;
  --purple-50: #f5f3ff;
  --gray-900: #111827;
  --gray-600: #4b5563;
  --gray-200: #e5e7eb;
  --white: #ffffff;
  --red-700: #b91c1c;
  --red-50: #fef2f2;
  --space-2: 8px;
  --space-3: 16px;
  --space-4: 24px;
}`;

const TOKENS_CSS = `${BASE}
${PRIMITIVES}

/* Tier 2: semantic tokens go here. */
:root {
}

/* Components */
body { background: var(--white); color: var(--gray-900); }
.page { max-width: 420px; margin: 0 auto; padding: var(--space-4) var(--space-3); }
.card { padding: var(--space-4); border: 1px solid var(--gray-200); border-radius: 12px; background: var(--white); }
.card__title { margin: 0 0 var(--space-2); font-size: 20px; color: var(--gray-900); }
.card__meta { margin: 0 0 var(--space-2); color: var(--gray-600); }
.card__price { margin: 0 0 var(--space-3); font-size: 24px; font-weight: 700; color: var(--gray-900); }
.btn { display: inline-block; padding: 12px 20px; border-radius: 8px; background: var(--purple-700); color: var(--white); font-weight: 700; text-decoration: none; }
.alert { margin-top: var(--space-3); padding: var(--space-3); border-radius: 8px; background: var(--red-50); color: var(--red-700); font-weight: 700; }
`;

const TOKENS_CSS_DONE = `${BASE}
${PRIMITIVES}

/* Tier 2: semantic tokens: what a colour is FOR */
:root {
  --color-surface: var(--white);
  --color-border: var(--gray-200);
  --color-text: var(--gray-900);
  --color-text-muted: var(--gray-600);
  --color-action: var(--purple-700);
  --color-on-action: var(--white);
  --color-danger: var(--red-700);
  --color-danger-surface: var(--red-50);
}

/* Components use semantic tokens only */
body { background: var(--color-surface); color: var(--color-text); }
.page { max-width: 420px; margin: 0 auto; padding: var(--space-4) var(--space-3); }
.card { padding: var(--space-4); border: 1px solid var(--color-border); border-radius: 12px; background: var(--color-surface); }
.card__title { margin: 0 0 var(--space-2); font-size: 20px; color: var(--color-text); }
.card__meta { margin: 0 0 var(--space-2); color: var(--color-text-muted); }
.card__price { margin: 0 0 var(--space-3); font-size: 24px; font-weight: 700; color: var(--color-text); }
.btn { display: inline-block; padding: 12px 20px; border-radius: 8px; background: var(--color-action); color: var(--color-on-action); font-weight: 700; text-decoration: none; }
.alert { margin-top: var(--space-3); padding: var(--space-3); border-radius: 8px; background: var(--color-danger-surface); color: var(--color-danger); font-weight: 700; }
`;

const COMPONENT_CSS = String.raw`const comp = code('style.css').replace(/:root\s*\{[^}]*\}/g, '');
`;

/* ── Lesson 50 lab: atomic design ──────────────────────────────────────── */
const PARTS = [
  "Button",
  "Label",
  "Text input",
  "Search form: a label, a text input and a button",
  "Form field: a label, an input and an error message",
  "Site header: logo, navigation and search form",
  "Product grid: filters and a grid of product cards",
  "Category page layout with placeholder content in every slot",
  "The \"Women's shoes\" page with real products and prices",
  "Icon",
];

const ATOMIC_MD = `# Atomic design: classify the parts

Write the number of each part under its level, one "- " line each.

## Atoms
-

## Molecules
-

## Organisms
-

## Templates
-

## Pages
-
`;

const ATOMIC_MD_DONE = `# Atomic design: classify the parts

## Atoms
- 1
- 2
- 3
- 10

## Molecules
- 4
- 5

## Organisms
- 6
- 7

## Templates
- 8

## Pages
- 9
`;

const levelCheck = (level, nums) =>
  MD + `const got = bullets(section('atomic.md', '${level}')).map((l) => num(l)).filter((n) => !Number.isNaN(n)).sort((a, b) => a - b); return got.join() === '${nums.join()}';`;

/* ── Lesson 51 lab: a button with variants and states ──────────────────── */
const BTN_HTML = page(
  "Button component",
  `  <main class="demo">
    <h1>Button</h1>
    <div class="row">
      <button class="btn btn--primary" type="button">Add to cart</button>
      <button class="btn btn--secondary" type="button">Save for later</button>
      <button class="btn btn--danger" type="button">Remove item</button>
    </div>
    <div class="row">
      <button class="btn btn--primary" type="button" disabled>Add to cart</button>
      <button class="btn btn--primary" type="button" aria-busy="true">Adding…</button>
    </div>
  </main>`
);

const BTN_CSS = `${BASE}
body { color: #111827; }
.demo { max-width: 640px; margin: 0 auto; padding: 24px 16px; }
.row { display: flex; flex-wrap: wrap; gap: 16px; margin-bottom: 16px; }

.btn--primary { padding: 12px 20px; background: #6d28d9; color: #ffffff; border: 0; border-radius: 8px; }
.btn--secondary { padding: 8px 12px; background: #ffffff; color: #6d28d9; border: 1px solid #6d28d9; border-radius: 0; }
.btn--danger { padding: 10px; background: #fca5a5; color: #ffffff; border: 0; border-radius: 20px; }
`;

const BTN_CSS_DONE = `${BASE}
body { color: #111827; }
.demo { max-width: 640px; margin: 0 auto; padding: 24px 16px; }
.row { display: flex; flex-wrap: wrap; gap: 16px; margin-bottom: 16px; }

/* Base: everything every variant shares */
.btn {
  position: relative;
  min-height: 44px;
  padding: 12px 20px;
  border: 2px solid transparent;
  border-radius: 8px;
  font: inherit;
  font-weight: 700;
  cursor: pointer;
}

/* Variants: only what differs */
.btn--primary { background: #6d28d9; border-color: #6d28d9; color: #ffffff; }
.btn--secondary { background: transparent; border-color: #6d28d9; color: #6d28d9; }
.btn--danger { background: #b91c1c; border-color: #b91c1c; color: #ffffff; }

/* States */
.btn--primary:hover { background: #5b21b6; border-color: #5b21b6; }
.btn--secondary:hover { background: #f5f3ff; }
.btn--danger:hover { background: #991b1b; border-color: #991b1b; }
.btn:focus-visible { outline: 3px solid #1d4ed8; outline-offset: 2px; }
.btn:disabled { background: #e5e7eb; border-color: #e5e7eb; color: #4b5563; cursor: not-allowed; }

/* Loading: busy cursor and a spinner after the label */
.btn[aria-busy="true"] { cursor: progress; padding-right: 44px; }
.btn[aria-busy="true"]::after {
  content: "";
  position: absolute;
  right: 16px;
  top: 50%;
  width: 16px;
  height: 16px;
  margin-top: -8px;
  border: 2px solid currentColor;
  border-right-color: transparent;
  border-radius: 50%;
  animation: spin 800ms linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }
`;

/* ── Lesson 52 lab: component documentation ────────────────────────────── */
const DOCS_MD = `# Button

## Description

## Anatomy
-

## Variants
| Variant | When to use |
|---------|-------------|
|         |             |

## States
-

## Do
-

## Don't
-

## Accessibility

## Tokens
-
`;

const DOCS_MD_DONE = `# Button

## Description
Buttons start actions, such as adding an item to the cart or submitting a form. Use links, not buttons, to go to another page.

## Anatomy
- Container with padding and a border radius
- Label: a short verb phrase
- Optional leading icon, 20 × 20
- Optional loading spinner after the label

## Variants
| Variant | When to use |
|---------|-------------|
| Primary | The single most important action on a screen |
| Secondary | Supporting actions next to a primary button |
| Danger | Destructive actions such as removing or deleting |

## States
- Default
- Hover
- Focus (keyboard)
- Pressed
- Disabled
- Loading

## Do
- Use one primary button per screen
- Write labels as verbs that say what happens: "Add to cart"

## Don't
- Don't use more than one primary button in the same area
- Don't use the danger variant for actions that cannot harm anything

## Accessibility
Text has at least 4.5:1 contrast against the button in every state, the minimum height is 44px, and the focus ring is always visible for keyboard users. Loading buttons set aria-busy="true" and keep their label.

## Tokens
- --color-action
- --color-on-action
- --color-danger
- --radius-md
- --space-3
`;

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 49 · 12.1 – 12.7
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ux-l49-tokens",
    moduleId: "ux-m12-design-systems",
    sectionId: SECTION_ID,
    order: 1,
    covers: ["12.1", "12.2", "12.3", "12.4", "12.5", "12.6", "12.7"],
    title: "Design Systems and Design Tokens",
    subtitle: "The shared language that keeps large products consistent",
    estimatedMinutes: 32,
    intro:
      "When dozens of designers and developers work on one product, consistency cannot depend on memory. Design systems solve this. This lesson explains what a design system is, how it differs from a style guide, and its foundation: design tokens for colour, type and spacing, and the grid.",

    atoms: [
      {
        id: "a-ux-design-system",
        title: "What is a design system, and how it differs from a style guide",
        explain:
          "A design system is the single source of truth for building a product's interface: design tokens (named values for colour, type, spacing and more), reusable components in Figma and in code, patterns for common tasks, guidelines for content and accessibility, and documentation explaining how and when to use everything, maintained by a team with a process for change. A style guide is narrower: it documents the visual style (logo, colours, typography), usually as a static reference. A design system includes a style guide, but adds working components that designers and developers both use, which is what actually keeps hundreds of screens consistent.",
        table: {
          caption: "Style guide and design system compared.",
          headers: ["", "Style guide", "Design system"],
          rows: [
            ["Contains", "Colours, type, logo usage", "Tokens, components, patterns, guidelines, code"],
            ["Form", "A document", "A living library in Figma and code"],
            ["Used by", "Mostly designers and marketers", "Designers and developers, every day"],
            ["Changes", "Occasionally, by editing the document", "Versioned releases, with a contribution process"],
            ["Examples", "A brand book PDF", "Material Design, Apple HIG, IBM Carbon, Shopify Polaris"],
          ],
        },
      },
      {
        id: "a-ux-design-tokens",
        title: "Design tokens",
        explain:
          "Design tokens are named design decisions stored as data, so they can be used identically in Figma, on the web, in Android and in iOS. Systems usually have tiers. Primitive (global) tokens name raw values: --purple-700: #6d28d9. Semantic (alias) tokens name a purpose and point at a primitive: --color-action: var(--purple-700). Component tokens, in large systems, name a specific use: --button-primary-background: var(--color-action). Components use semantic or component tokens, never primitives, so a rebrand or a dark mode changes a few semantic mappings instead of every component.",
        example: "Primitive   --purple-700: #6d28d9\n    ↓\nSemantic    --color-action: var(--purple-700)\n    ↓\nComponent   .btn { background: var(--color-action); }\n\nRebrand to green: change ONE line, --color-action: var(--green-700)",
      },
      {
        id: "a-ux-colour-tokens",
        title: "Colour tokens",
        explain:
          "Colour tokens are usually built in two layers. The primitive palette has each hue in a scale of lightness (purple-50 to purple-900, gray-50 to gray-900), chosen so that steps have predictable contrast. Semantic colour tokens assign roles: surface, surface-raised, border, text, text-muted, action, on-action (text on the action colour), danger, success, warning, focus. Name tokens by role, not appearance (\"--color-danger\", not \"--red\"), because roles stay the same when colours change, and check the contrast of every text role against every surface role it can appear on, in every mode.",
        webLab: {
          task:
            "The shop's components use primitive tokens directly (var(--purple-700) on the button), so a rebrand means editing every component. Add semantic tokens in the second :root block, each pointing at a primitive with var(): at least --color-surface, --color-border, --color-text, --color-text-muted, --color-action, --color-on-action, --color-danger and --color-danger-surface. Then make every component rule use semantic colour tokens only (spacing tokens may stay). The check rebrands the action colour at runtime to prove the button follows it.",
          files: { "index.html": TOKENS_HTML, "style.css": TOKENS_CSS },
          readOnly: ["index.html"],
          tests: [
            { label: "Semantic tokens point at primitives", check: "const s = getComputedStyle(document.documentElement); const names = ['--color-surface', '--color-border', '--color-text', '--color-text-muted', '--color-action', '--color-on-action', '--color-danger', '--color-danger-surface']; const decl = code('style.css'); return names.every((n) => s.getPropertyValue(n).trim() !== '' && new RegExp(n + '\\\\s*:\\\\s*var\\\\(--').test(decl));", fail: "For example --color-action: var(--purple-700);" },
            { label: "Components use no primitive colour tokens", check: COMPONENT_CSS + String.raw`return !/var\(--(purple|gray|red|white)-?\d*\)/.test(comp);`, fail: "Replace var(--purple-700), var(--gray-…), var(--red-…) and var(--white) in the component rules." },
            { label: "Rebranding the action colour changes the button", check: "document.documentElement.style.setProperty('--color-action', 'rgb(4, 120, 87)'); await tick(); const ok = style('.btn', 'background-color') === 'rgb(4, 120, 87)'; document.documentElement.style.removeProperty('--color-action'); return ok;", fail: ".btn { background: var(--color-action); }" },
            { label: "Changing the danger colour changes the alert", check: "document.documentElement.style.setProperty('--color-danger', 'rgb(1, 2, 3)'); await tick(); const ok = style('.alert', 'color') === 'rgb(1, 2, 3)'; document.documentElement.style.removeProperty('--color-danger'); return ok;", fail: ".alert { color: var(--color-danger); }" },
            { label: "Everything still looks the same and stays readable", check: CONTRAST + "return style('.btn', 'background-color') === 'rgb(109, 40, 217)' && passes('.card__meta', 4.5) && passes('.alert', 4.5) && ratio('.btn') >= 4.5;", fail: "The semantic tokens should map to the same primitives the components used before." },
          ],
          solution: { "style.css": TOKENS_CSS_DONE },
          hint: "Map one semantic token for every job a colour does, then swap each var(--primitive) in the components for the matching semantic token.",
          successMessage: "Same look, new foundation: a rebrand or a dark mode now changes a handful of semantic tokens, not every component.",
        },
      },
      {
        id: "a-ux-type-spacing-tokens",
        title: "Typography and spacing tokens",
        explain:
          "Typography tokens capture the type system: font families (--font-family-heading, --font-family-body), a size scale (--font-size-100 to --font-size-900, or named sizes such as body, title, headline), weights, and line heights; many systems combine them into composite text styles (heading-lg: 32px, 700, 1.2). Spacing tokens capture the spacing scale (--space-1: 4px to --space-8: 64px) and are used for every margin, padding and gap. Systems also tokenise radii (--radius-sm, --radius-md), shadows (--elevation-1), border widths, motion durations and breakpoints. In Figma these become variables and text styles; in code, CSS custom properties.",
      },
      {
        id: "a-ux-grid-systems",
        title: "Grid systems",
        explain:
          "A design system defines its grids once, as tokens and guidelines: the number of columns at each breakpoint (4, 8, 12), gutter and margin widths (from the spacing scale), maximum content widths, and how common layouts use the grid (a sidebar spans 3 of 12 columns, a card 4 of 12). Figma grid styles and code utilities apply the same grid everywhere, so every team's screens align. A good grid system also defines a baseline rhythm: spacing in multiples of 4 or 8 so that text and components line up vertically.",
        decision: {
          scenario: "Three product teams each invent their own grid: one uses 16px gutters, one 20px, one 24px. Screens from different teams look subtly misaligned when users move between them.",
          question: "What should the design system provide?",
          options: [
            { id: "a", text: "One grid definition per breakpoint (columns, gutters, margins, maximum widths) as shared tokens and grid styles", why: "A single grid makes every team's screens align and speeds up layout decisions." },
            { id: "b", text: "Let each team keep its own grid for creative freedom", whyWrong: "Users experience one product; the differences show." },
            { id: "c", text: "Remove grids entirely", whyWrong: "That makes alignment worse." },
            { id: "d", text: "Average the three gutters to 20px and tell nobody", whyWrong: "A grid only works if it is documented and shared." },
          ],
          correct: "a",
          aftermath: "Grids belong in the system, not in each team's head.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 50 · 12.8 – 12.10
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ux-l50-atomic",
    moduleId: "ux-m12-design-systems",
    sectionId: SECTION_ID,
    order: 2,
    covers: ["12.8", "12.9", "12.10"],
    title: "Component Architecture and Atomic Design",
    subtitle: "Building big interfaces from small, reusable parts",
    estimatedMinutes: 28,
    intro:
      "Large interfaces are assembled from smaller parts, and how those parts fit together decides whether a system stays manageable. This lesson covers component architecture, Brad Frost's atomic design methodology, and what makes a component truly reusable.",

    atoms: [
      {
        id: "a-ux-component-architecture",
        title: "Component architecture",
        explain:
          "Component architecture is how components are structured and combined. Each component has an anatomy (its named parts: container, label, icon, helper text), properties that change it (variant, size, state, text, show icon), and slots where other components or content can be placed (a card's body slot can hold text, a list or a form). Good architecture favours composition: small components combined into larger ones (an input field is built from a label, an input and a message), rather than one giant component with dozens of options. Clear boundaries mean a change to the input automatically improves every form that uses it.",
      },
      {
        id: "a-ux-atomic-design",
        title: "Atomic design methodology",
        explain:
          "Atomic design, by Brad Frost, describes interfaces in five levels borrowed from chemistry. Atoms are the smallest functional elements: a button, a label, an input, an icon. Molecules are simple groups of atoms working together as a unit: a search form (label, input, button) or a form field (label, input, error message). Organisms are complex sections made of molecules and atoms: a site header (logo, navigation, search form), a product grid with filters. Templates are page layouts that place organisms in a structure, with placeholder content. Pages are templates filled with real content, which is where you test whether the system holds up.",
        table: {
          caption: "The five levels of atomic design.",
          headers: ["Level", "What it is", "Example"],
          rows: [
            ["Atoms", "Smallest functional elements", "Button, label, input, icon"],
            ["Molecules", "Simple groups of atoms working as a unit", "Search form, form field"],
            ["Organisms", "Complex sections of molecules and atoms", "Site header, product grid"],
            ["Templates", "Page layouts with placeholder content", "Category page layout"],
            ["Pages", "Templates with real content", "The \"Women's shoes\" page"],
          ],
        },
        webLab: {
          task:
            "Classify the ten parts of an e-commerce interface listed in the preview into the five levels of atomic design. Under each heading in atomic.md, write the number of every part that belongs there, one \"- \" line each.",
          files: {
            "index.html": docPage("Classify ten parts with atomic design", "atomic.md", PARTS.map((p, i) => `<strong>${i + 1}.</strong> ${p}`)),
            "atomic.md": ATOMIC_MD,
          },
          readOnly: ["index.html"],
          tests: [
            { label: "Atoms: the smallest elements", check: levelCheck("Atoms", [1, 2, 3, 10]), fail: "Which parts cannot be broken down further and still work? There are four." },
            { label: "Molecules: simple groups of atoms", check: levelCheck("Molecules", [4, 5]), fail: "Two parts are small groups of atoms that work as one unit." },
            { label: "Organisms: complex sections", check: levelCheck("Organisms", [6, 7]), fail: "Two parts are whole sections made of molecules and atoms." },
            { label: "Templates: layouts with placeholders", check: levelCheck("Templates", [8]), fail: "One part is a layout with placeholder content." },
            { label: "Pages: real content", check: levelCheck("Pages", [9]), fail: "One part is a layout filled with real products." },
          ],
          solution: { "atomic.md": ATOMIC_MD_DONE },
          hint: "Ask of each part: what is it made of? Atoms are made of nothing smaller; molecules of atoms; organisms of molecules.",
          successMessage: "Ten parts in five levels. Thinking this way tells you what to build first and what each change will affect.",
        },
      },
      {
        id: "a-ux-reusable-components",
        title: "Reusable components",
        explain:
          "A reusable component works in many places without modification. It does not depend on where it sits (no outer margins pushing on neighbours; its container controls spacing), adapts to its content (long labels wrap, Auto Layout hugs or fills), exposes the right properties and no more, and covers all the states and variants the product needs. Before creating a new component, check whether an existing one (perhaps with a new variant) can do the job: every extra component is something to maintain. A component is ready for the system when it has been used successfully in at least two different contexts.",
        decision: {
          scenario: "A designer needs a card for a promotion. The system already has a Card component, but the designer builds a new \"Promo card\" from scratch with slightly different padding and radius.",
          question: "What is the better approach?",
          options: [
            { id: "a", text: "Use the existing Card, adding a Promo variant or using its slots if something genuinely new is needed", why: "Reusing keeps padding, radius and behaviour consistent, and a new variant is documented and maintained in one place." },
            { id: "b", text: "Keep the new card; small differences add variety", whyWrong: "Small, unintended differences are exactly what design systems exist to prevent." },
            { id: "c", text: "Delete the existing Card component", whyWrong: "It is used across the product." },
            { id: "d", text: "Detach every instance of Card in the product", whyWrong: "That breaks the link to the system everywhere." },
          ],
          correct: "a",
          aftermath: "Extend before you create.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 51 · 12.11 – 12.14
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ux-l51-variants",
    moduleId: "ux-m12-design-systems",
    sectionId: SECTION_ID,
    order: 3,
    covers: ["12.11", "12.12", "12.13", "12.14"],
    title: "Variants, States, Naming and Shared Libraries",
    subtitle: "Designing every version of a component, naming it well, and sharing it",
    estimatedMinutes: 30,
    intro:
      "A component in a design system must cover every version and every situation the product needs, have a name everyone understands, and be available to every team. This lesson covers variants, states, naming conventions and shared libraries.",

    atoms: [
      {
        id: "a-ux-component-variants",
        title: "Component variants",
        explain:
          "Variants are the designed versions of a component that serve different purposes: a button's primary, secondary, tertiary and danger variants; small, medium and large sizes; with or without an icon. Define each variant by what it is for (\"Danger: destructive actions such as delete\"), keep everything shared in the base (height, radius, font, focus ring) and change only what differs (usually colour and border). Resist adding variants for one-off needs: a variant used once is a sign of drift. In Figma, variants live in one component set with properties; in code, as modifiers or props.",
      },
      {
        id: "a-ux-component-states",
        title: "Component states",
        explain:
          "States describe how a component looks in each situation: default, hover (pointer over it), focus (selected by keyboard, always with a visible ring), pressed or active, disabled (unavailable, clearly different, still readable), loading (busy, often with a spinner, preventing double submission), and for inputs also filled, error and success; for selectable items, selected. Every variant needs every relevant state. Missing states are the most common gap between design files and what developers need, and the reason interfaces feel unfinished.",
        table: {
          caption: "States a button and an input need.",
          headers: ["State", "Button", "Input"],
          rows: [
            ["Default", "✓", "✓ (empty)"],
            ["Hover", "✓", "✓"],
            ["Focus", "✓ visible ring", "✓ visible ring"],
            ["Pressed / filled", "✓ pressed", "✓ filled"],
            ["Disabled", "✓", "✓"],
            ["Loading", "✓", "(rarely)"],
            ["Error", "(no)", "✓ with message"],
          ],
        },
        webLab: {
          task:
            "Rebuild this button as a proper component in style.css: a base .btn class holding what all variants share (at least 44px tall, the same padding, radius and bold text on every button); three variants (.btn--primary filled, .btn--secondary with a transparent background and a border, .btn--danger in a red, all with readable text); a :focus-visible ring; a :disabled state that looks different and uses cursor: not-allowed; and a loading state for [aria-busy=\"true\"] with cursor: progress and a spinner drawn with ::after.",
          files: { "index.html": BTN_HTML, "style.css": BTN_CSS },
          readOnly: ["index.html"],
          tests: [
            { label: "The base is shared: same height (44px+), padding, radius and weight", check: "const v = $$('.btn').map((b) => [Math.round(rect(b).height), style(b, 'padding-top'), style(b, 'padding-left'), style(b, 'border-top-left-radius'), style(b, 'font-weight')].join()); return $$('.btn').every((b) => rect(b).height >= 44) && new Set($$('.btn:not([aria-busy])').map((b) => [Math.round(rect(b).height), style(b, 'padding-top'), style(b, 'padding-left'), style(b, 'border-top-left-radius'), style(b, 'font-weight')].join())).size === 1;", fail: "Move size, padding, radius and weight into .btn; keep only colours in the modifiers." },
            { label: "Three distinct variants, all readable", check: CONTRAST + "const p = $('.btn--primary:not(:disabled):not([aria-busy])'), s = $('.btn--secondary'), d = $('.btn--danger'); const bg = (n) => style(n, 'background-color'); const red = (bg(d).match(/\\d+/g) || []).map(Number); return bg(p) !== 'rgba(0, 0, 0, 0)' && bg(s) === 'rgba(0, 0, 0, 0)' && style(s, 'border-top-style') === 'solid' && red[0] > 120 && red[1] < 80 && [p, s, d].every((n) => contrast(style(n, 'color'), bgOf(n)) >= 4.5);", fail: "Primary filled, secondary transparent with a border, danger a deep red such as #b91c1c, all with readable text." },
            { label: "A visible focus ring", check: "return rules(/\\.btn(--\\w+)?:focus-visible/).some((r) => parseFloat(r.style.outlineWidth) >= 2);", fail: ".btn:focus-visible { outline: 3px solid #1d4ed8; }" },
            { label: "Disabled looks different and says not-allowed", check: CONTRAST + "const d = $('.btn:disabled'); return style(d, 'background-color') !== style('.btn--primary:not(:disabled):not([aria-busy])', 'background-color') && style(d, 'cursor') === 'not-allowed' && contrast(style(d, 'color'), bgOf(d)) >= 4.5;", fail: ".btn:disabled { background: #e5e7eb; color: #4b5563; cursor: not-allowed; }" },
            { label: "Loading shows progress and a spinner", check: "const b = $('.btn[aria-busy=\"true\"]'); return style(b, 'cursor') === 'progress' && pseudo(b, '::after', 'content') !== 'none' && pseudo(b, '::after', 'content') !== 'normal';", fail: ".btn[aria-busy=\"true\"] { cursor: progress; } .btn[aria-busy=\"true\"]::after { content: \"\"; … }" },
          ],
          solution: { "style.css": BTN_CSS_DONE },
          hint: "Base first: write .btn with everything shared. Then each modifier sets only colours. States come last.",
          successMessage: "One component, three variants and five states, each defined once. That is what a design system's button looks like.",
        },
      },
      {
        id: "a-ux-naming-conventions",
        title: "Naming conventions",
        explain:
          "Consistent names make a system searchable and unambiguous. Name components by what they are, not how they look (\"Button\", not \"Purple box\"), and use the same structure everywhere: in Figma, Component / Variant / Size (\"Button / Primary / Large\") with property names such as Type, Size and State reused across components; in code, a convention such as BEM (block__element--modifier: .card__title, .btn--danger). Tokens follow category-role-variant-state (color-text-muted, color-action-hover, space-4). Agree the conventions early, document them, and apply them to designers' and developers' work alike so a name means the same thing in Figma and in code.",
        decision: {
          scenario: "In Figma the component is \"CTA Big\"; in code it is .primary-btn-lg; the documentation calls it \"Main button\".",
          question: "What problem does this create?",
          options: [
            { id: "a", text: "Designers, developers and documentation cannot reliably tell they mean the same thing, so mistakes and duplicates follow", why: "One name, in one structure, in Figma, code and docs: \"Button / Primary / Large\" and .btn--primary.btn--lg." },
            { id: "b", text: "None, as long as it looks right", whyWrong: "Mismatched names cause duplicate components and confusion in handoff." },
            { id: "c", text: "It makes the file slower", whyWrong: "Names do not affect performance." },
            { id: "d", text: "Only the code name matters", whyWrong: "Designers and writers use the system too." },
          ],
          correct: "a",
          aftermath: "A name is a contract between design and code.",
        },
      },
      {
        id: "a-ux-shared-libraries",
        title: "Shared libraries",
        explain:
          "A design system reaches teams through shared libraries: a published Figma library (components, styles, variables) and a code package (for example, an npm package of React components or a set of CSS files) that implement the same components with the same names and tokens. When the system team publishes a new version, product teams update and get the improvements. Version the libraries (1.4.0 to 1.5.0), publish release notes saying what changed and whether anything breaks, and keep the Figma and code libraries in step, so what designers place is exactly what developers can use.",
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 52 · 12.15 – 12.18, 12.P
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "ux-l52-documentation",
    moduleId: "ux-m12-design-systems",
    sectionId: SECTION_ID,
    order: 4,
    covers: ["12.15", "12.16", "12.17", "12.18", "12.P"],
    title: "Documentation, Scale and Accessibility in a System",
    subtitle: "Keeping a design system useful as the product and team grow",
    estimatedMinutes: 32,
    intro:
      "A design system is only as good as people's ability to use it correctly. This lesson covers documentation, keeping things consistent over time, scaling a system to more products and teams, and building accessibility into the system itself. It ends with your practical: a design system for an e-commerce platform.",

    atoms: [
      {
        id: "a-ux-design-documentation",
        title: "Design documentation",
        explain:
          "Every component needs documentation that answers: what is it and when should I use it (and when not)? Good component pages include a short description; the anatomy with named parts; the variants and when to use each; all states; do and don't examples; content guidelines (how to write labels); accessibility notes (contrast, keyboard behaviour, ARIA); the tokens it uses; and links to the Figma component and the code. Tools such as Zeroheight, Storybook, Notion or a page in the Figma file itself host it. Short, visual documentation with examples gets used; long text does not.",
        webLab: {
          task:
            "Write the documentation page for the system's Button in button.md: a Description of at least 12 words; at least three Anatomy parts; a Variants table with at least three variants, each with when to use it (at least 4 words); States that include default, hover, focus and disabled; at least two Do and two Don't guidelines; an Accessibility section (at least 15 words) that mentions contrast and keyboard focus; and at least three tokens the button uses, written as --token-names.",
          files: {
            "index.html": docPage("Document the Button component", "button.md", [
              "Description: at least 12 words",
              "Anatomy: three or more parts",
              "Variants: three or more, each with when to use it",
              "States: default, hover, focus and disabled (at least)",
              "Do and Don't: two or more each",
              "Accessibility: contrast and keyboard focus",
              "Tokens: three or more, as --token-names",
            ]),
            "button.md": DOCS_MD,
          },
          readOnly: ["index.html"],
          tests: [
            { label: "Description and anatomy", check: MD + "return words(section('button.md', 'Description')) >= 12 && bullets(section('button.md', 'Anatomy')).filter((l) => words(l) >= 1).length >= 3;", fail: "Describe what the button is for, and list at least three parts." },
            { label: "Three variants, each with when to use it", check: MD + "return rows(section('button.md', 'Variants')).filter((c) => words(c[0]) >= 1 && words(c[1]) >= 4).length >= 3;", fail: "Primary, Secondary and Danger, each with a use." },
            { label: "States include default, hover, focus and disabled", check: MD + "const s = bullets(section('button.md', 'States')).join(' ').toLowerCase(); return ['default', 'hover', 'focus', 'disabled'].every((k) => s.includes(k));", fail: "List at least Default, Hover, Focus and Disabled." },
            { label: "Two do's and two don'ts", check: MD + "return bullets(section('button.md', 'Do')).filter((l) => words(l) >= 4).length >= 2 && bullets(section('button.md', \"Don't\")).filter((l) => words(l) >= 4).length >= 2;", fail: "At least two lines under Do and two under Don't." },
            { label: "Accessibility covers contrast and keyboard focus", check: MD + "const s = section('button.md', 'Accessibility') || ''; return words(s) >= 15 && /contrast/i.test(s) && /focus|keyboard/i.test(s);", fail: "Mention the contrast ratio and the visible focus ring." },
            { label: "At least three tokens", check: MD + String.raw`return bullets(section('button.md', 'Tokens')).filter((l) => /^--[a-z0-9-]+$/i.test(l)).length >= 3;`, fail: "List tokens like --color-action, one per line." },
          ],
          solution: { "button.md": DOCS_MD_DONE },
          hint: "Write for a designer who has never seen the system: what is it for, how do I choose, what must I never do?",
          successMessage: "A component page that lets anyone use the Button correctly without asking. Multiply this by every component and you have a system people trust.",
        },
      },
      {
        id: "a-ux-maintaining-consistency",
        title: "Maintaining consistency",
        explain:
          "Systems drift unless someone looks after them. Governance defines who owns the system (a dedicated team, or representatives from product teams), how changes are proposed, reviewed and released, and how teams contribute new components or variants. Regular audits compare live products against the system to find detached instances, one-off colours and duplicate components. Make the right thing the easy thing: if the system's components are quicker to use than drawing from scratch, people use them. Listen to teams who work around the system: a workaround often means the system is missing something real.",
      },
      {
        id: "a-ux-scaling-systems",
        title: "Scaling design systems",
        explain:
          "As products grow, systems must support more teams, platforms and brands. Strategies: tiered tokens so several brands or themes (light, dark, high contrast) share components and differ only in semantic token values; platform-specific implementations (web, Android, iOS) generated from one token source with tools such as Tokens Studio or Style Dictionary; versioning with clear release notes so teams can upgrade on their own schedule; and a core set of components owned centrally, with specialised components owned by product teams. Start small (tokens, buttons, inputs, cards) and grow from real needs, not a giant upfront catalogue.",
        decision: {
          scenario: "A bank runs a consumer app and a business app with different brand colours. Each has its own copy of every component, and fixes have to be made twice.",
          question: "How can one design system serve both?",
          options: [
            { id: "a", text: "Share one set of components built on semantic tokens, with a token set (theme) per brand", why: "Components are written once; each brand maps --color-action and the other roles to its own palette." },
            { id: "b", text: "Keep two copies and fix everything twice", whyWrong: "That doubles the work forever and the copies drift apart." },
            { id: "c", text: "Force both apps to use one brand colour", whyWrong: "The business requirement is two brands; theming solves it without compromise." },
            { id: "d", text: "Abandon the design system", whyWrong: "That makes the problem worse." },
          ],
          correct: "a",
          aftermath: "Theming through tokens is how one system scales to many brands.",
        },
      },
      {
        id: "a-ux-system-accessibility",
        title: "Accessibility standards within design systems",
        explain:
          "A design system is the most effective place to build in accessibility, because every product inherits it. Bake it into the foundations: colour tokens whose text and surface pairs all meet WCAG AA contrast (4.5:1 for text, 3:1 for borders and icons); a type scale whose smallest size is readable; touch targets of at least 44px in every interactive component; a visible focus style shared by every component; and components that use the right semantics and keyboard behaviour (a dialog that traps and returns focus, tabs operated with arrow keys, form fields connected to their labels and errors). Document the accessibility of each component so teams know what is handled and what they must still do.",
      },
    ],

    task: {
      title: "Module 12 practical: a reusable design system for an e-commerce platform",
      intro: "Build it in Figma as a published library, starting from your Module 3 style guide.",
      prompts: [
        "Create variables for primitive and semantic colour tokens (with a light and a dark mode), typography and spacing, and check every text and surface pair for contrast.",
        "Build atoms and molecules: buttons (three variants, all states), inputs (all states including error), checkbox, radio, badge, price, rating and a search form.",
        "Build organisms: header, product card, product grid with filters, cart summary and footer, using only your atoms and molecules with Auto Layout.",
        "Assemble a product listing template and a product detail page from the organisms, then a real page with real products.",
        "Document at least three components (description, variants, states, do and don't, accessibility, tokens) and publish the library.",
      ],
      closing: "Phase 5 begins: Module 13 makes sure everything you design works for everyone.",
    },

    requirements: { read: true, video: false, assessment: true },
  },
];

export default LESSONS;
