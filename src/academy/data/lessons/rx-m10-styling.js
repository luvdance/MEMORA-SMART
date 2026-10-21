/**
 * REACT DEVELOPMENT · MODULE 10 · STYLING AND PROFESSIONAL INTERFACE DEVELOPMENT
 *
 * Curriculum 10.1 – 10.P. CSS and CSS Modules, scoping strategies,
 * responsive Flexbox and Grid, mobile-first media queries, design tokens and
 * CSS variables, themes, conditional classes, Tailwind CSS (its browser
 * build runs in the lab whenever a stylesheet imports "tailwindcss"),
 * component libraries, accessible navigation, modals and tabs, skeletons and
 * toasts, contrast and focus, dark mode, and turning a design into code.
 *
 * Responsive checks run at the harness's real widths: 375px phone, 768px
 * tablet and 1280px laptop.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

import { reactLab } from "./rx-helpers.js";

export const SECTION_ID = "rx-s10-styling";
const MODULE = "rx-m10-styling";

const RESET = "*, *::before, *::after { box-sizing: border-box; }\nbody { margin: 0; font-family: system-ui, Arial, sans-serif; color: #1f2937; }\nbutton { font: inherit; min-height: 44px; padding: 8px 14px; cursor: pointer; }\n";

const lab = (spec) => reactLab({ css: RESET, ...spec });

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 58 · 10.1 – 10.3
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "rx-l58-css-modules",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 1,
    covers: ["10.1", "10.2", "10.3"],
    title: "CSS, CSS Modules and Layout",
    subtitle: "Styling components, keeping styles scoped, and responsive Flexbox and Grid layouts",
    estimatedMinutes: 40,
    intro: "In a component app, CSS's biggest problem is that every class is global: two components that both use .title will fight. Scoping solves it.",

    atoms: [
      {
        id: "a-rx-css-modules",
        title: "Styling with regular CSS and CSS Modules",
        explain:
          "Regular CSS imported by a component (import \"./Card.css\") is still GLOBAL once the app is built: Card's .title and Modal's .title collide, and the winner depends on load order. A CSS MODULE is a file named X.module.css; import styles from \"./Card.module.css\" gives an object mapping your class names to unique generated ones (styles.title might become Card_title__x7a2), so classes never clash. Write className={styles.title}. Vite supports CSS Modules with no setup. Keep truly global styles (reset, fonts, variables) in one index.css.",
        webLab: lab({
          task:
            "Card and Banner both style a global .title, so the banner's big white title rules also hit the card. Convert both components to CSS Modules: rename their stylesheets to Card.module.css and Banner.module.css (create the new files), import them as styles, and use className={styles.title}. The card title must end up 18px and the banner title 32px.",
          files: {
            "src/App.jsx": `import Card from "./Card.jsx";
import Banner from "./Banner.jsx";

export default function App() {
  return (
    <>
      <Banner />
      <Card />
    </>
  );
}
`,
            "src/Card.jsx": `import "./Card.css";

export default function Card() {
  return (
    <article className="card">
      <h2 className="title">React Development</h2>
    </article>
  );
}
`,
            "src/Banner.jsx": `import "./Banner.css";

export default function Banner() {
  return (
    <section className="banner">
      <h1 className="title">Learn to build for the web</h1>
    </section>
  );
}
`,
            "src/Card.css": ".card { border: 1px solid #cbd5e1; padding: 16px; }\n.title { font-size: 18px; }\n",
            "src/Banner.css": ".banner { background: #0e7490; padding: 32px; }\n.title { font-size: 32px; color: white; }\n",
            "src/Card.module.css": "",
            "src/Banner.module.css": "",
          },
          tests: [
            { label: "The card title is 18px and dark", check: "return style('article h2', 'font-size') === '18px' && style('article h2', 'color') !== 'rgb(255, 255, 255)';", fail: "Use CSS Modules so the banner's .title cannot reach the card." },
            { label: "The banner title is 32px and white", check: "return style('section h1', 'font-size') === '32px' && style('section h1', 'color') === 'rgb(255, 255, 255)';", fail: "Move the banner styles to Banner.module.css." },
            { label: "Both components use CSS Modules", check: "return ['Card', 'Banner'].every((n) => /import\\s+styles\\s+from\\s+[\"']\\.\\/\\w+\\.module\\.css[\"']/.test(code('src/' + n + '.jsx')) && /className=\\{\\s*styles\\.title\\s*\\}/.test(code('src/' + n + '.jsx')));", fail: "import styles from \"./Card.module.css\"; className={styles.title}" },
          ],
          solution: {
            "src/Card.jsx": `import styles from "./Card.module.css";

export default function Card() {
  return (
    <article className={styles.card}>
      <h2 className={styles.title}>React Development</h2>
    </article>
  );
}
`,
            "src/Banner.jsx": `import styles from "./Banner.module.css";

export default function Banner() {
  return (
    <section className={styles.banner}>
      <h1 className={styles.title}>Learn to build for the web</h1>
    </section>
  );
}
`,
            "src/Card.css": "",
            "src/Banner.css": "",
            "src/Card.module.css": ".card { border: 1px solid #cbd5e1; padding: 16px; }\n.title { font-size: 18px; }\n",
            "src/Banner.module.css": ".banner { background: #0e7490; padding: 32px; }\n.title { font-size: 32px; color: white; }\n",
          },
          hint: "Look at an element in the preview's DOM after the change: its class name is generated and unique.",
          successMessage: "Same class names in two files, no collision.",
        }),
      },
      {
        id: "a-rx-scoping-strategies",
        title: "Component-scoped styling strategies",
        explain:
          "The main options: CSS MODULES (plain CSS, scoped by file; no runtime cost); a NAMING CONVENTION such as BEM (.card__title--featured) with global CSS (no tooling, relies on discipline); UTILITY CLASSES with Tailwind (styles written as classes in the JSX, Lesson 60); and CSS-IN-JS (styled-components, Emotion: styles written in JavaScript, dynamic but with a runtime cost and friction with server components). Most new projects choose Tailwind or CSS Modules. Whatever you choose, use one approach consistently across a codebase.",
        decision: {
          scenario: "A team of six is starting a new Vite React app. Some like writing ordinary CSS; nobody wants class-name collisions or a runtime styling library.",
          question: "Which approach fits best?",
          options: [
            { id: "a", text: "CSS Modules, with shared design tokens as CSS variables in index.css", why: "Plain CSS, automatically scoped, no runtime, built into Vite." },
            { id: "b", text: "One huge global stylesheet", whyWrong: "Six people adding global classes is exactly how collisions happen." },
            { id: "c", text: "Inline style objects everywhere", whyWrong: "No media queries, no hover states, and designs scattered through the JSX." },
            { id: "d", text: "Each developer picks their own approach", whyWrong: "Mixed styling systems make every component harder to maintain." },
          ],
          correct: "a",
          aftermath: "Pick one strategy and apply it everywhere.",
        },
      },
      {
        id: "a-rx-responsive-layout",
        title: "Responsive layouts using Flexbox and Grid",
        explain:
          "App layouts are usually GRID for the page skeleton and FLEXBOX inside components. A dashboard shell: grid-template-columns: 240px 1fr on a laptop (sidebar and content), one column on a phone. Inside: a header bar with display: flex; justify-content: space-between; align-items: center; a card grid with repeat(auto-fill, minmax(240px, 1fr)). min-width: 0 on grid and flex children lets long content shrink instead of forcing the page wider than the screen.",
        webLab: lab({
          task:
            "Lay out the dashboard with Dashboard.module.css. On a laptop: the shell is a grid with a 240px sidebar and the content beside it; the header inside the content is a flex row with the title on the left and the button on the right; the four stat cards sit in one row (repeat(auto-fill, minmax(200px, 1fr)) with a 16px gap). On a phone: one column, sidebar on top, cards stacked, and nothing scrolls sideways.",
          files: {
            "src/Dashboard.jsx": `import styles from "./Dashboard.module.css";

export default function Dashboard() {
  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar}>Menu</aside>
      <section className={styles.content}>
        <header className={styles.header}>
          <h1>Overview</h1>
          <button>New course</button>
        </header>
        <div className={styles.cards}>
          {["Students", "Courses", "Revenue", "Completion"].map((t) => (
            <div key={t} className={styles.card}>
              {t}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
`,
            "src/Dashboard.module.css": ".sidebar { background: #0f172a; color: white; padding: 16px; }\n.content { padding: 16px; }\n.card { border: 1px solid #cbd5e1; border-radius: 8px; padding: 16px; }\n",
            "src/App.jsx": `import Dashboard from "./Dashboard.jsx";

export default function App() {
  return <Dashboard />;
}
`,
          },
          readOnly: ["src/Dashboard.jsx", "src/App.jsx"],
          tests: [
            { label: "Laptop: a 240px sidebar beside the content", viewport: "desktop", check: "return Math.round(rect('aside').width) === 240 && Math.round(rect('section').left) === 240;", fail: "@media (min-width: 768px) { .shell { display: grid; grid-template-columns: 240px 1fr; } }" },
            { label: "Laptop: header title left, button right", viewport: "desktop", check: "return style('header', 'display') === 'flex' && Math.round(rect('header h1').top) < rect('header button').bottom && rect('header button').right > window.innerWidth - 40;", fail: ".header { display: flex; justify-content: space-between; align-items: center; }" },
            { label: "Laptop: the four cards in one row with a 16px gap", viewport: "desktop", check: "const c = $$('section > div > div'); return new Set(c.map((x) => Math.round(rect(x).top))).size === 1 && Math.round(rect(c[1]).left - rect(c[0]).right) === 16;", fail: ".cards { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 16px; }" },
            { label: "Phone: one column, cards stacked, no sideways scroll", viewport: "mobile", check: "const c = $$('section > div > div'); return rect('aside').bottom <= rect('section').top + 1 && new Set(c.map((x) => Math.round(rect(x).left))).size === 1 && !overflowX();", fail: "Keep the phone layout single-column by default." },
          ],
          solution: {
            "src/Dashboard.module.css": `.shell { display: grid; grid-template-columns: 1fr; }
.sidebar { background: #0f172a; color: white; padding: 16px; }
.content { padding: 16px; min-width: 0; }
.header { display: flex; justify-content: space-between; align-items: center; gap: 16px; }
.cards { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 16px; }
.card { border: 1px solid #cbd5e1; border-radius: 8px; padding: 16px; }

@media (min-width: 768px) {
  .shell { grid-template-columns: 240px 1fr; }
}
`,
          },
          hint: "Write the phone layout first; add the two-column shell in a min-width media query.",
          successMessage: "Grid for the skeleton, Flexbox inside, and a phone layout that never overflows.",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 59 · 10.4 – 10.6
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "rx-l59-tokens",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 2,
    covers: ["10.4", "10.5", "10.6"],
    title: "Mobile First, Design Tokens and Themes",
    subtitle: "Media queries, reusable colours, spacing and type, and switching themes with CSS variables",
    estimatedMinutes: 40,
    intro: "A design system is a set of decisions written down once: these colours, these spacings, this type scale. CSS variables make those decisions reusable and switchable.",

    atoms: [
      {
        id: "a-rx-mobile-first",
        title: "Mobile-first design and media queries",
        explain:
          "Write the phone styles as the default and add complexity as the screen grows: @media (min-width: 768px) for tablets, (min-width: 1024px) for laptops. Phones get the simplest, lightest CSS, and you are forced to decide what matters most. Common responsive patterns in apps: a sidebar that becomes a top bar or a drawer on phones, a table that becomes a list of cards, two columns that stack. Use the same few breakpoints everywhere (store them in one place) and test at the real widths in DevTools.",
        webLab: lab({
          task:
            "Make the course page mobile first. Default (phone): the filters panel is hidden and a \"Filters\" button is shown; the course list is one column. From 1024px: the filters panel is visible as a 260px column beside the list (grid), the Filters button is hidden, and the list shows three columns.",
          files: {
            "src/App.jsx": `import styles from "./Courses.module.css";

export default function App() {
  return (
    <div className={styles.page}>
      <button className={styles.filterButton}>Filters</button>
      <aside className={styles.filters}>Level, price, duration</aside>
      <ul className={styles.list}>
        {["HTML", "CSS", "JavaScript", "React", "Node", "Testing"].map((c) => (
          <li key={c} className={styles.item}>{c}</li>
        ))}
      </ul>
    </div>
  );
}
`,
            "src/Courses.module.css": ".page { padding: 16px; }\n.list { list-style: none; padding: 0; display: grid; gap: 12px; }\n.item { border: 1px solid #cbd5e1; padding: 12px; border-radius: 8px; }\n",
          },
          readOnly: ["src/App.jsx"],
          tests: [
            { label: "Phone: filters hidden, button shown, one column", viewport: "mobile", check: "return !visible('aside') && visible('button') && new Set($$('li').map((l) => Math.round(rect(l).left))).size === 1;", fail: "Hide .filters by default; show .filterButton." },
            { label: "Tablet is still the phone layout", viewport: "tablet", check: "return !visible('aside') && visible('button');", fail: "The change happens at 1024px." },
            { label: "Laptop: a 260px filter column, no button, three columns", viewport: "desktop", check: "return visible('aside') && !visible('button') && Math.round(rect('aside').width) === 260 && new Set($$('li').map((l) => Math.round(rect(l).left))).size === 3;", fail: "@media (min-width: 1024px) { … }" },
            { label: "Written mobile first", check: "return media().some((m) => /min-width:\\s*1024px/.test(m)) && !media().some((m) => /max-width/.test(m));", fail: "Use min-width, not max-width." },
          ],
          solution: {
            "src/Courses.module.css": `.page { padding: 16px; }
.filters { display: none; }
.list { list-style: none; padding: 0; margin: 0; display: grid; gap: 12px; }
.item { border: 1px solid #cbd5e1; padding: 12px; border-radius: 8px; }

@media (min-width: 1024px) {
  .page { display: grid; grid-template-columns: 260px 1fr; gap: 24px; align-items: start; }
  .filterButton { display: none; }
  .filters { display: block; }
  .list { grid-template-columns: repeat(3, 1fr); }
}
`,
          },
          hint: "Inside the query, the page becomes a two-column grid; the hidden button no longer takes a cell.",
          successMessage: "Phones get the simple layout; larger screens add to it.",
        }),
      },
      {
        id: "a-rx-design-tokens",
        title: "Reusable design tokens: colours, spacing and typography",
        explain:
          "DESIGN TOKENS are the named values of a design: --color-primary: #0e7490; --color-text: #1f2937; --space-2: 8px; --space-4: 16px; --radius: 8px; --font-size-lg: 20px. Define them once on :root and use var(--space-4) everywhere instead of typing 16px or #0e7490 in every file. A redesign then changes the tokens, not hundreds of rules, and every component stays consistent. Use a SCALE (4, 8, 12, 16, 24, 32px) rather than arbitrary numbers, so spacing looks deliberate.",
        webLab: lab({
          task:
            "Define tokens on :root in tokens.css: --color-primary #0e7490, --color-surface #ffffff, --space-4 16px, --space-6 24px, --radius 12px. Then rewrite Card.module.css to use ONLY var(...) for its colour, padding, gap and radius (no hard-coded hex values or pixel sizes). The card must look the same.",
          files: {
            "src/tokens.css": "/* design tokens */\n",
            "src/Card.module.css": ".card {\n  background: #ffffff;\n  border: 2px solid #0e7490;\n  border-radius: 12px;\n  padding: 24px;\n  display: grid;\n  gap: 16px;\n}\n.title { color: #0e7490; margin: 0; }\n",
            "src/App.jsx": `import "./tokens.css";
import styles from "./Card.module.css";

export default function App() {
  return (
    <article className={styles.card}>
      <h2 className={styles.title}>React Development</h2>
      <p>Sixteen weeks, Hooks-first.</p>
    </article>
  );
}
`,
          },
          readOnly: ["src/App.jsx"],
          tests: [
            { label: "The card looks the same", check: "return style('article', 'padding-top') === '24px' && style('article', 'row-gap') === '16px' && style('article', 'border-top-left-radius') === '12px' && style('article h2', 'color') === 'rgb(14, 116, 144)';", fail: "Use the tokens with the same values." },
            { label: "The tokens are defined on :root", check: "const r = getComputedStyle(document.documentElement); return r.getPropertyValue('--color-primary').trim() === '#0e7490' && r.getPropertyValue('--space-6').trim() === '24px' && r.getPropertyValue('--radius').trim() === '12px';", fail: ":root { --color-primary: #0e7490; … }" },
            { label: "The card uses only tokens", check: "const c = code('src/Card.module.css'); return !/#[0-9a-f]{3,6}\\b|\\d+px/i.test(c) && (c.match(/var\\(--/g) || []).length >= 5;", fail: "Replace every hex colour and px size with var(--…)." },
          ],
          solution: {
            "src/tokens.css": ":root {\n  --color-primary: #0e7490;\n  --color-surface: #ffffff;\n  --space-4: 16px;\n  --space-6: 24px;\n  --radius: 12px;\n  --border-width: 2px;\n}\n",
            "src/Card.module.css": ".card {\n  background: var(--color-surface);\n  border: var(--border-width) solid var(--color-primary);\n  border-radius: var(--radius);\n  padding: var(--space-6);\n  display: grid;\n  gap: var(--space-4);\n}\n.title { color: var(--color-primary); margin: 0; }\n",
          },
          hint: "The 2px border width can stay a token too: add --border-width, or use a keyword such as medium.",
          successMessage: "Change one token, and every component using it follows.",
        }),
      },
      {
        id: "a-rx-theme-switching",
        title: "CSS variables and theme switching",
        explain:
          "Because CSS variables cascade, a THEME is just a different set of token values on an ancestor: :root { --bg: white; --text: #1f2937 } and [data-theme=\"dark\"] { --bg: #0f172a; --text: #e2e8f0 }. Components only ever use var(--bg) and var(--text). React switches the theme by setting one attribute: document.documentElement.dataset.theme = theme, in an effect. Nothing re-renders except that attribute change, and the browser repaints every component at once.",
        webLab: lab({
          // No body colour in this lab's base stylesheet: the theme sets it.
          css: "body { margin: 0; font-family: system-ui, Arial, sans-serif; }\nbutton { font: inherit; min-height: 44px; padding: 8px 14px; }\n",
          task:
            "Add a dark theme. In theme.css, define --bg and --text for the light default (#ffffff, #1f2937) and for [data-theme=\"dark\"] (#0f172a, #e2e8f0), and make body use them. In App, keep theme in state and set document.documentElement.dataset.theme in an effect; the button toggles it and says \"Dark mode\" or \"Light mode\".",
          files: {
            "src/theme.css": "/* theme tokens */\n",
            "src/App.jsx": `import { useEffect, useState } from "react";
import "./theme.css";

export default function App() {
  return (
    <main>
      <h1>Settings</h1>
      <button>Dark mode</button>
    </main>
  );
}
`,
          },
          tests: [
            { label: "Light by default", check: "return style('body', 'background-color') === 'rgb(255, 255, 255)' && style('body', 'color') === 'rgb(31, 41, 55)';", fail: ":root { --bg: #ffffff; --text: #1f2937; } body { background: var(--bg); color: var(--text); }" },
            { label: "The button switches to dark", check: "await click('button'); await waitFor(() => document.documentElement.dataset.theme === 'dark'); return style('body', 'background-color') === 'rgb(15, 23, 42)' && style('body', 'color') === 'rgb(226, 232, 240)' && text('button') === 'Light mode';", fail: "[data-theme=\"dark\"] { --bg: #0f172a; --text: #e2e8f0; } and an effect setting dataset.theme." },
            { label: "And back to light", check: "await click('button'); await waitFor(() => document.documentElement.dataset.theme === 'light'); return style('body', 'background-color') === 'rgb(255, 255, 255)';", fail: "Toggle between \"light\" and \"dark\"." },
          ],
          solution: {
            "src/theme.css": ":root {\n  --bg: #ffffff;\n  --text: #1f2937;\n}\n[data-theme=\"dark\"] {\n  --bg: #0f172a;\n  --text: #e2e8f0;\n}\nbody {\n  background: var(--bg);\n  color: var(--text);\n}\n",
            "src/App.jsx": `import { useEffect, useState } from "react";
import "./theme.css";

export default function App() {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  return (
    <main>
      <h1>Settings</h1>
      <button onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
        {theme === "light" ? "Dark mode" : "Light mode"}
      </button>
    </main>
  );
}
`,
          },
          hint: "document.documentElement is the <html> element; the attribute selector matches it.",
          successMessage: "One attribute, every colour in the app switches.",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 60 · 10.7 – 10.9
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "rx-l60-tailwind",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 3,
    covers: ["10.7", "10.8", "10.9"],
    title: "Dynamic Classes, Tailwind CSS and Component Libraries",
    subtitle: "Conditional class names, utility-first styling, and when to use shadcn/ui or Material UI",
    estimatedMinutes: 40,
    intro: "Styles often depend on state: a selected tab, an invalid field, a disabled button. And many teams no longer write CSS files at all, but utility classes. Both start with class names.",

    atoms: [
      {
        id: "a-rx-conditional-classes",
        title: "Conditional classes and dynamic styling",
        explain:
          "Build className from state, not inline styles: className={isActive ? \"tab tab-active\" : \"tab\"}. With several conditions, a helper that joins the truthy ones keeps it readable; the popular one is the tiny clsx library: clsx(\"btn\", variant === \"primary\" && \"btn-primary\", disabled && \"btn-disabled\"). Use inline style={{ … }} only for values that are truly dynamic and continuous, such as a progress bar's width (style={{ width: percent + \"%\" }}) or a colour chosen by the user. For state that assistive technology should know, prefer ARIA attributes and style them: [aria-selected=\"true\"] { … }.",
        webLab: lab({
          task:
            "Write cx(...parts) in src/cx.js: it joins the arguments that are truthy strings with single spaces (like clsx). Then use it in Button for the classes \"btn\", \"btn-<variant>\", \"btn-loading\" when loading and \"btn-block\" when block. Finally the progress bar's fill gets an inline width from the percent prop.",
          files: {
            "src/cx.js": `export function cx(...parts) {
  return "";
}
`,
            "src/App.jsx": `import { cx } from "./cx.js";

function Button({ variant = "primary", loading = false, block = false, children }) {
  return <button className="btn">{children}</button>;
}

function Progress({ percent }) {
  return (
    <div className="track" role="progressbar" aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100}>
      <div className="fill" />
    </div>
  );
}

export default function App() {
  return (
    <>
      <Button>Save</Button>
      <Button variant="danger" loading>Delete</Button>
      <Button variant="ghost" block>Cancel</Button>
      <Progress percent={65} />
    </>
  );
}
`,
            "src/index.css": RESET + ".track { width: 200px; height: 8px; background: #e2e8f0; }\n.fill { height: 100%; background: #0e7490; }\n",
          },
          tests: [
            { label: "cx joins only truthy strings", check: "const m = await import('data:text/javascript;charset=utf-8,' + encodeURIComponent(raw('src/cx.js'))); return m.cx('a', false, 'b', null, undefined, '', 'c') === 'a b c' && m.cx() === '';", fail: "parts.filter(Boolean).join(\" \")" },
            { label: "Buttons get classes from their props", check: "return $$('button').map((b) => b.className).join('|') === 'btn btn-primary|btn btn-danger btn-loading|btn btn-ghost btn-block';", fail: "cx(\"btn\", \"btn-\" + variant, loading && \"btn-loading\", block && \"btn-block\")" },
            { label: "The progress fill width is dynamic", check: "return $('.fill').style.width === '65%' && Math.round(rect('.fill').width) === 130;", fail: "style={{ width: percent + \"%\" }}" },
          ],
          solution: {
            "src/cx.js": `export function cx(...parts) {
  return parts.filter((p) => typeof p === "string" && p !== "").join(" ");
}
`,
            "src/App.jsx": `import { cx } from "./cx.js";

function Button({ variant = "primary", loading = false, block = false, children }) {
  return <button className={cx("btn", "btn-" + variant, loading && "btn-loading", block && "btn-block")}>{children}</button>;
}

function Progress({ percent }) {
  return (
    <div className="track" role="progressbar" aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100}>
      <div className="fill" style={{ width: percent + "%" }} />
    </div>
  );
}

export default function App() {
  return (
    <>
      <Button>Save</Button>
      <Button variant="danger" loading>Delete</Button>
      <Button variant="ghost" block>Cancel</Button>
      <Progress percent={65} />
    </>
  );
}
`,
          },
          hint: "false, null, undefined and \"\" should all disappear.",
          successMessage: "Classes for discrete states, inline styles only for continuous values.",
        }),
      },
      {
        id: "a-rx-tailwind",
        title: "Integrating Tailwind CSS",
        explain:
          "TAILWIND is utility-first: instead of writing .card { padding: 24px; border-radius: 12px }, you write className=\"p-6 rounded-xl\" in the JSX. Each class does one thing on a fixed scale (p-4 is 16px, p-6 is 24px; text-sm, text-lg; bg-cyan-700). Responsive and state variants are prefixes: md:grid-cols-3 applies from 768px, hover:bg-cyan-800, focus-visible:ring-2, dark:bg-slate-900. Tailwind v4 is set up in Vite with npm install tailwindcss @tailwindcss/vite, the plugin in vite.config.js, and @import \"tailwindcss\"; in your CSS; it scans your files and generates only the classes you use. Repeated class lists belong in components (a <Button>), not copied around.",
        example: "npm install tailwindcss @tailwindcss/vite\n\n// vite.config.js\nimport tailwindcss from \"@tailwindcss/vite\";\nexport default defineConfig({ plugins: [react(), tailwindcss()] });\n\n/* src/index.css */\n@import \"tailwindcss\";",
        webLab: reactLab({
          css: '@import "tailwindcss";\n',
          task:
            "Style the course card with Tailwind classes only (this lab's index.css already imports Tailwind). The <article>: padding p-6 (24px), rounded-xl corners (12px), a 1px border (border) and a white background (bg-white). The <h2>: text-xl (20px) and font-semibold (600). The grid of cards: grid, gap-4 (16px), one column by default and md:grid-cols-2 from 768px.",
          files: {
            "src/App.jsx": `const courses = ["React", "TypeScript"];

export default function App() {
  return (
    <section>
      {courses.map((c) => (
        <article key={c}>
          <h2>{c}</h2>
          <p>Hooks-first, from foundations to production.</p>
        </article>
      ))}
    </section>
  );
}
`,
          },
          tests: [
            { label: "Card spacing, corners and border", check: "return await waitFor(() => style('article', 'padding-top') === '24px' && style('article', 'border-top-left-radius') === '12px' && style('article', 'border-top-width') === '1px', 3000);", fail: "className=\"p-6 rounded-xl border bg-white\"" },
            { label: "Heading size and weight", check: "return await waitFor(() => style('h2', 'font-size') === '20px' && style('h2', 'font-weight') === '600', 3000);", fail: "className=\"text-xl font-semibold\"" },
            { label: "Two columns from tablet width", viewport: "tablet", check: "await waitFor(() => style('section', 'display') === 'grid', 3000); const a = $$('article'); return style('section', 'row-gap') === '16px' && Math.round(rect(a[0]).top) === Math.round(rect(a[1]).top);", fail: "className=\"grid gap-4 md:grid-cols-2\"" },
            { label: "One column on a phone", viewport: "mobile", check: "await waitFor(() => style('section', 'display') === 'grid', 3000); const a = $$('article'); return rect(a[1]).top > rect(a[0]).bottom - 1;", fail: "No column count without the md: prefix." },
          ],
          solution: {
            "src/App.jsx": `const courses = ["React", "TypeScript"];

export default function App() {
  return (
    <section className="grid gap-4 md:grid-cols-2">
      {courses.map((c) => (
        <article key={c} className="p-6 rounded-xl border bg-white">
          <h2 className="text-xl font-semibold">{c}</h2>
          <p>Hooks-first, from foundations to production.</p>
        </article>
      ))}
    </section>
  );
}
`,
          },
          hint: "md: means \"from 768px up\", so the unprefixed classes are the phone layout.",
          successMessage: "Styled without leaving the JSX, and responsive with one prefix.",
        }),
      },
      {
        id: "a-rx-component-libraries",
        title: "Using component libraries such as shadcn/ui or Material UI",
        explain:
          "A COMPONENT LIBRARY gives you ready-made, accessible components (dialogs, menus, date pickers, data tables). MATERIAL UI (MUI) is a package you install and theme, implementing Google's Material Design: fast to start, harder to make look unlike Material. SHADCN/UI is not a dependency: a CLI copies each component's source (built on Radix UI primitives and Tailwind) into your project, and you own and edit it. HEADLESS libraries (Radix UI, React Aria, Headless UI) provide behaviour and accessibility with no styling. Libraries save weeks on complex widgets such as comboboxes and dialogs, whose keyboard and focus behaviour is hard to get right yourself.",
        decision: {
          scenario: "Your startup's app needs accessible dialogs, dropdown menus and a date picker, styled to the company's own brand with Tailwind, and the team wants to customise components freely.",
          question: "Which fits best?",
          options: [
            { id: "a", text: "shadcn/ui: the components' source lands in your repo, built on Radix and styled with Tailwind", why: "Accessible behaviour from Radix, your own Tailwind styling, and full freedom to edit the code you own." },
            { id: "b", text: "Build every widget from scratch", whyWrong: "Accessible menus and date pickers are weeks of subtle keyboard and focus work." },
            { id: "c", text: "Material UI, then override its look everywhere", whyWrong: "Possible, but fighting Material Design to match another brand is a lot of overriding." },
            { id: "d", text: "Copy components from random tutorials", whyWrong: "Inconsistent and rarely accessible." },
          ],
          correct: "a",
          aftermath: "Use a library for complex widgets; choose by how much you need to own the design.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 61 · 10.10 – 10.12
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "rx-l61-widgets",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 4,
    covers: ["10.10", "10.11", "10.12"],
    title: "Interactive UI and Accessibility",
    subtitle: "Navigation, modals and tabs; skeletons, empty states and toasts; contrast, focus and keyboard",
    estimatedMinutes: 45,
    intro: "Widgets are where accessibility is usually lost: a modal you cannot close with Escape, tabs you cannot reach with the keyboard, grey text nobody can read.",

    atoms: [
      {
        id: "a-rx-tabs-modals",
        title: "Responsive navigation, modals, dropdowns and tabs",
        explain:
          "Follow the ARIA Authoring Practices patterns. TABS: a role=\"tablist\" of role=\"tab\" buttons with aria-selected and aria-controls, each panel role=\"tabpanel\"; Left and Right arrow keys move between tabs. MODALS: use the native <dialog> element with showModal() (it traps focus and closes on Escape) or a library; return focus to the button that opened it. DROPDOWNS: a button with aria-expanded that opens a list, closing on Escape and on outside click. A RESPONSIVE NAV is a row of links on wide screens and a button with aria-expanded toggling the menu on phones.",
        webLab: lab({
          task:
            "Make the tabs accessible. The container has role=\"tablist\"; each button has role=\"tab\", aria-selected (true only for the active one), and aria-controls pointing at its panel's id; the visible panel has role=\"tabpanel\". Inactive tabs get tabIndex -1. ArrowRight and ArrowLeft move to the next or previous tab (wrapping around) and move focus to it.",
          files: {
            "src/App.jsx": `import { useRef, useState } from "react";

const TABS = [
  { id: "overview", label: "Overview", body: "Sixteen weeks, Hooks-first." },
  { id: "syllabus", label: "Syllabus", body: "Sixteen modules, from JSX to deployment." },
  { id: "reviews", label: "Reviews", body: "4.9 out of 5 from 1,200 learners." },
];

export default function App() {
  const [active, setActive] = useState(0);

  return (
    <>
      <div>
        {TABS.map((t, i) => (
          <button key={t.id} onClick={() => setActive(i)}>
            {t.label}
          </button>
        ))}
      </div>
      <div>{TABS[active].body}</div>
    </>
  );
}
`,
          },
          tests: [
            { label: "Tab roles and selection", check: "const t = $$('[role=tablist] [role=tab]'); return t.length === 3 && t.map((x) => x.getAttribute('aria-selected')).join() === 'true,false,false' && t[1].tabIndex === -1 && t[0].tabIndex === 0;", fail: "role=\"tab\", aria-selected={i === active}, tabIndex={i === active ? 0 : -1}" },
            { label: "The panel is connected to its tab", check: "const t = $('[role=tab][aria-selected=true]'); const p = $('[role=tabpanel]'); return !!p && t.getAttribute('aria-controls') === p.id && text(p) === 'Sixteen weeks, Hooks-first.';", fail: "id={\"panel-\" + tab.id} on the panel and aria-controls on the tab." },
            { label: "Arrow keys move selection and focus, wrapping", check: "const t = () => $$('[role=tab]'); t()[0].focus(); await key(t()[0], 'ArrowRight'); const one = t()[1].getAttribute('aria-selected') === 'true' && document.activeElement === t()[1]; await key(t()[1], 'ArrowLeft'); await key(t()[0], 'ArrowLeft'); return one && t()[2].getAttribute('aria-selected') === 'true' && document.activeElement === t()[2] && text('[role=tabpanel]') === '4.9 out of 5 from 1,200 learners.';", fail: "onKeyDown: (i + 1) % n and (i - 1 + n) % n, then focus that tab with a ref." },
          ],
          solution: {
            "src/App.jsx": `import { useRef, useState } from "react";

const TABS = [
  { id: "overview", label: "Overview", body: "Sixteen weeks, Hooks-first." },
  { id: "syllabus", label: "Syllabus", body: "Sixteen modules, from JSX to deployment." },
  { id: "reviews", label: "Reviews", body: "4.9 out of 5 from 1,200 learners." },
];

export default function App() {
  const [active, setActive] = useState(0);
  const refs = useRef([]);

  function select(i) {
    setActive(i);
    refs.current[i].focus();
  }

  function handleKeyDown(e, i) {
    const n = TABS.length;
    if (e.key === "ArrowRight") select((i + 1) % n);
    if (e.key === "ArrowLeft") select((i - 1 + n) % n);
  }

  return (
    <>
      <div role="tablist" aria-label="Course information">
        {TABS.map((t, i) => (
          <button
            key={t.id}
            ref={(el) => (refs.current[i] = el)}
            role="tab"
            id={"tab-" + t.id}
            aria-selected={i === active}
            aria-controls={"panel-" + t.id}
            tabIndex={i === active ? 0 : -1}
            onClick={() => setActive(i)}
            onKeyDown={(e) => handleKeyDown(e, i)}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div role="tabpanel" id={"panel-" + TABS[active].id} aria-labelledby={"tab-" + TABS[active].id}>
        {TABS[active].body}
      </div>
    </>
  );
}
`,
          },
          hint: "A ref callback can collect several elements into an array: ref={(el) => (refs.current[i] = el)}.",
          successMessage: "Tabs that a screen reader announces and a keyboard can drive.",
        }),
      },
      {
        id: "a-rx-skeletons-toasts",
        title: "Skeleton loaders, empty states and toast notifications",
        explain:
          "A SKELETON is grey placeholder shapes in the layout of the coming content: the page does not jump when data arrives, and it feels faster than a spinner. Mark the region aria-busy=\"true\" while loading. EMPTY STATES explain and suggest the next action (Module 3). A TOAST is a short, temporary message after an action (\"Course saved\"): render it in a role=\"status\" region so screen readers announce it, dismiss it automatically after a few seconds (with the timer cleaned up), and let people close it. Never put the only copy of important information, or an action, in a toast that disappears.",
        webLab: lab({
          task:
            "While courses load, show three <div className=\"skeleton\"> placeholders inside the list region, which has aria-busy=\"true\" until loaded. Clicking Save shows a toast <div role=\"status\" className=\"toast\">Course saved</div> that disappears by itself after 1.5 seconds (clear the timer in a cleanup) or when its close button (aria-label \"Dismiss\") is clicked.",
          files: {
            "src/App.jsx": `import { useEffect, useState } from "react";

const load = () => new Promise((r) => setTimeout(() => r(["HTML", "CSS", "React"]), 300));

export default function App() {
  const [courses, setCourses] = useState(null);

  useEffect(() => {
    load().then(setCourses);
  }, []);

  return (
    <>
      <section className="list">
        {courses && courses.map((c) => <p key={c}>{c}</p>)}
      </section>
      <button>Save</button>
    </>
  );
}
`,
            "src/index.css": RESET + ".skeleton { height: 20px; background: #e2e8f0; border-radius: 4px; margin: 8px 0; }\n",
          },
          tests: [
            { label: "Skeletons while loading, marked busy", check: "return $$('.list .skeleton').length === 3 && $('.list').getAttribute('aria-busy') === 'true';", fail: "{courses === null ? [0, 1, 2].map(…) : …} and aria-busy={courses === null}" },
            { label: "Then the content, not busy", check: "await waitFor(() => $$('.list p').length === 3); return $$('.list .skeleton').length === 0 && $('.list').getAttribute('aria-busy') !== 'true';", fail: "Replace the skeletons when the data arrives." },
            { label: "Save shows a toast that disappears by itself", check: "await click($$('button').find((b) => text(b) === 'Save')); const shown = text('[role=status].toast').startsWith('Course saved'); await wait(1800); return shown && !$('.toast');", fail: "An effect that sets a 1.5s timer when the toast shows, and clears it in a cleanup." },
            { label: "Dismiss closes it at once", check: "await click($$('button').find((b) => text(b) === 'Save')); await click('[aria-label=Dismiss]'); return !$('.toast');", fail: "aria-label=\"Dismiss\" on a close button." },
          ],
          solution: {
            "src/App.jsx": `import { useEffect, useState } from "react";

const load = () => new Promise((r) => setTimeout(() => r(["HTML", "CSS", "React"]), 300));

function Toast({ message, onClose }) {
  useEffect(() => {
    const id = setTimeout(onClose, 1500);
    return () => clearTimeout(id);
  }, [onClose]);
  return (
    <div role="status" className="toast">
      {message}{" "}
      <button aria-label="Dismiss" onClick={onClose}>
        ×
      </button>
    </div>
  );
}

export default function App() {
  const [courses, setCourses] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    load().then(setCourses);
  }, []);

  return (
    <>
      <section className="list" aria-busy={courses === null}>
        {courses === null
          ? [0, 1, 2].map((i) => <div key={i} className="skeleton" />)
          : courses.map((c) => <p key={c}>{c}</p>)}
      </section>
      <button onClick={() => setToast("Course saved")}>Save</button>
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </>
  );
}
`,
          },
          hint: "Give the toast its own component, so its timer effect starts when it appears and is cleaned up when it goes.",
          successMessage: "Loading that holds its shape, and feedback that announces itself and tidies up.",
        }),
      },
      {
        id: "a-rx-contrast-focus",
        title: "Accessible colour contrast, focus states and keyboard interactions",
        explain:
          "CONTRAST: WCAG AA requires 4.5:1 between normal text and its background, 3:1 for large text (24px, or 19px bold) and for UI parts such as input borders and focus indicators. Light grey on white usually fails; check with DevTools' contrast picker. FOCUS: never remove outlines without a replacement; style :focus-visible (shown for keyboard users, not on mouse clicks) with a clear 2px+ outline. KEYBOARD: everything clickable must be reachable with Tab and operable with Enter or Space, which native <button> and <a> give you for free, and focus order must follow the visual order.",
        webLab: lab({
          task:
            "Fix the accessibility failures in Button.module.css. The button text (#9ca3af on white) fails contrast: use #0e7490 for the background with white text instead (contrast above 4.5:1). The CSS removes the focus outline: replace it with a 3px solid #f59e0b outline on :focus-visible, offset by 2px.",
          files: {
            "src/Button.module.css": ".button {\n  background: #ffffff;\n  color: #9ca3af;\n  border: 1px solid #e5e7eb;\n  border-radius: 8px;\n  min-height: 44px;\n  padding: 8px 16px;\n}\n.button:focus {\n  outline: none;\n}\n",
            "src/App.jsx": `import styles from "./Button.module.css";

export default function App() {
  return <button className={styles.button}>Enroll now</button>;
}
`,
          },
          readOnly: ["src/App.jsx"],
          tests: [
            { label: "Text contrast is at least 4.5:1", check: "return contrast(style('button', 'color'), style('button', 'background-color')) >= 4.5;", fail: "background: #0e7490; color: #ffffff;" },
            { label: "Keyboard focus shows a visible outline", check: "const r = rules(/focus-visible/); return r.some((x) => /3px/.test(x.style.outlineWidth) && x.style.outlineStyle === 'solid' && /2px/.test(x.style.outlineOffset));", fail: ".button:focus-visible { outline: 3px solid #f59e0b; outline-offset: 2px; }" },
            { label: "Outlines are not removed", check: "return !/outline:\\s*(none|0)/.test(code('src/Button.module.css'));", fail: "Delete the outline: none rule." },
          ],
          solution: {
            "src/Button.module.css": ".button {\n  background: #0e7490;\n  color: #ffffff;\n  border: 1px solid #0e7490;\n  border-radius: 8px;\n  min-height: 44px;\n  padding: 8px 16px;\n}\n.button:focus-visible {\n  outline: 3px solid #f59e0b;\n  outline-offset: 2px;\n}\n",
          },
          hint: ":focus-visible appears for keyboard focus but not on mouse clicks.",
          successMessage: "Readable text and a focus ring keyboard users can actually see.",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 62 · 10.13 – 10.14
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "rx-l62-dark-figma",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 5,
    covers: ["10.13", "10.14"],
    title: "Dark Mode and Designs into Components",
    subtitle: "Respecting system preferences and remembering choices, and translating a Figma design",
    estimatedMinutes: 40,
    intro: "Two last skills of professional interface work: a dark mode that respects what the user already chose, and turning a designer's file into components that match it.",

    atoms: [
      {
        id: "a-rx-dark-mode",
        title: "Dark mode and persisted user preferences",
        explain:
          "A good dark mode offers three choices: Light, Dark and System. System follows the operating system through the prefers-color-scheme media query (window.matchMedia(\"(prefers-color-scheme: dark)\").matches in JavaScript, and @media (prefers-color-scheme: dark) in CSS). Save an explicit choice in localStorage and apply it on load; with no saved choice, follow the system. To avoid a flash of the wrong theme, real apps set the attribute in a tiny inline script in index.html before React loads. Dark themes need their own contrast checks, not just inverted colours.",
        webLab: lab({
          task:
            "Build a three-way theme picker (radio buttons Light, Dark, System). The choice is saved in localStorage under \"theme\" and restored on load (default \"system\"). The applied theme is set as document.documentElement.dataset.theme: \"light\" or \"dark\", where System uses window.matchMedia(\"(prefers-color-scheme: dark)\").matches. The <p className=\"applied\"> says \"Applied: light\" or \"Applied: dark\".",
          files: {
            "src/App.jsx": `import { useEffect, useState } from "react";

const CHOICES = ["light", "dark", "system"];

export default function App() {
  return (
    <fieldset>
      <legend>Theme</legend>
      {CHOICES.map((c) => (
        <label key={c}>
          <input type="radio" name="theme" value={c} /> {c}
        </label>
      ))}
      <p className="applied">Applied: light</p>
    </fieldset>
  );
}
`,
          },
          tests: [
            { label: "With nothing saved, it follows the system", check: "const sys = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'; return $$('input')[2].checked && text('.applied') === 'Applied: ' + sys && document.documentElement.dataset.theme === sys;", fail: "Default to \"system\" and resolve it with matchMedia." },
            { label: "Choosing Dark applies and saves it", check: "await click($$('input')[1]); await wait(20); return document.documentElement.dataset.theme === 'dark' && text('.applied') === 'Applied: dark' && storage.getItem('theme') === 'dark';", fail: "Save the choice to localStorage and set dataset.theme in an effect." },
            { label: "A saved choice is restored", seed: { theme: "light" }, check: "await wait(20); return $$('input')[0].checked && document.documentElement.dataset.theme === 'light';", fail: "useState(() => localStorage.getItem(\"theme\") ?? \"system\")" },
          ],
          solution: {
            "src/App.jsx": `import { useEffect, useState } from "react";

const CHOICES = ["light", "dark", "system"];
const systemTheme = () => (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");

export default function App() {
  const [choice, setChoice] = useState(() => localStorage.getItem("theme") ?? "system");
  const applied = choice === "system" ? systemTheme() : choice;

  useEffect(() => {
    document.documentElement.dataset.theme = applied;
    localStorage.setItem("theme", choice);
  }, [choice, applied]);

  return (
    <fieldset>
      <legend>Theme</legend>
      {CHOICES.map((c) => (
        <label key={c}>
          <input type="radio" name="theme" value={c} checked={choice === c} onChange={() => setChoice(c)} /> {c}
        </label>
      ))}
      <p className="applied">Applied: {applied}</p>
    </fieldset>
  );
}
`,
          },
          hint: "The saved value is the CHOICE (possibly \"system\"); the applied theme is derived from it.",
          successMessage: "Respects the system, remembers a decision, and derives the rest.",
        }),
      },
      {
        id: "a-rx-figma",
        title: "Translating a Figma design into React components",
        explain:
          "Read a design in layers. 1. TOKENS first: Figma's colour, text and spacing styles (or variables) become your CSS variables. 2. COMPONENTS: designers build with components and variants in Figma (Button: primary, secondary; size md, lg); mirror them as React components with matching props. 3. LAYOUT: Figma's Auto Layout is Flexbox: direction, gap, padding and alignment map one-to-one. Use Dev Mode (or the Inspect panel) to read exact values, but do not copy absolute positions: build with flex and grid so it adapts to real content and screen sizes. Ask the designer about states the file does not show: hover, focus, error, empty, loading, long text.",
        webLab: lab({
          task:
            "Build StatCard to match this design spec. Card: Auto Layout vertical, padding 24, gap 8, corner radius 16, fill #ffffff, stroke 1px #e2e8f0. Label: 14px, weight 500, colour #64748b. Value: 32px, weight 700, colour #0f172a. Trend: 14px, colour #15803d. Write the styles in StatCard.module.css with flex for the Auto Layout.",
          files: {
            "src/StatCard.jsx": `import styles from "./StatCard.module.css";

export default function StatCard({ label, value, trend }) {
  return (
    <article className={styles.card}>
      <span className={styles.label}>{label}</span>
      <strong className={styles.value}>{value}</strong>
      <span className={styles.trend}>{trend}</span>
    </article>
  );
}
`,
            "src/StatCard.module.css": "",
            "src/App.jsx": `import StatCard from "./StatCard.jsx";

export default function App() {
  return <StatCard label="Active students" value="1,240" trend="▲ 12% this month" />;
}
`,
          },
          readOnly: ["src/StatCard.jsx", "src/App.jsx"],
          tests: [
            { label: "Card: vertical Auto Layout as flex, padding 24, gap 8", check: "return style('article', 'display') === 'flex' && style('article', 'flex-direction') === 'column' && style('article', 'padding-top') === '24px' && style('article', 'row-gap') === '8px';", fail: "display: flex; flex-direction: column; padding: 24px; gap: 8px;" },
            { label: "Card: radius 16, white fill, 1px #e2e8f0 stroke", check: "return style('article', 'border-top-left-radius') === '16px' && style('article', 'background-color') === 'rgb(255, 255, 255)' && style('article', 'border-top-width') === '1px' && style('article', 'border-top-color') === 'rgb(226, 232, 240)';", fail: "border-radius: 16px; background: #ffffff; border: 1px solid #e2e8f0;" },
            { label: "Label, value and trend typography", check: "const l = $('article span'); const t = $$('article span')[1]; return style(l, 'font-size') === '14px' && style(l, 'font-weight') === '500' && style(l, 'color') === 'rgb(100, 116, 139)' && style('strong', 'font-size') === '32px' && style('strong', 'font-weight') === '700' && style('strong', 'color') === 'rgb(15, 23, 42)' && style(t, 'font-size') === '14px' && style(t, 'color') === 'rgb(21, 128, 61)';", fail: "Match each text style in the spec." },
          ],
          solution: {
            "src/StatCard.module.css": `.card {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 24px;
  border-radius: 16px;
  background: #ffffff;
  border: 1px solid #e2e8f0;
}
.label { font-size: 14px; font-weight: 500; color: #64748b; }
.value { font-size: 32px; font-weight: 700; color: #0f172a; }
.trend { font-size: 14px; color: #15803d; }
`,
          },
          hint: "Auto Layout's padding, gap and direction are exactly Flexbox's.",
          successMessage: "Matches the spec, and still adapts, because it is flex rather than fixed positions.",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 63 · 10.P
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "rx-l63-m10-project",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 6,
    covers: ["10.P"],
    title: "Practical: A Professional Dashboard",
    subtitle: "A design reference recreated, with desktop and mobile layouts",
    estimatedMinutes: 70,
    intro: "The Module 10 practical: turn a dashboard design into a responsive, accessible, themeable React interface.",

    atoms: [
      {
        id: "a-rx-m10-project",
        title: "Build the dashboard from the design",
        explain:
          "The design reference: on a laptop, a 240px dark sidebar of navigation links, and a content area with a top bar (page title on the left, a theme toggle on the right), a row of four stat cards and a panel below. On a phone, the sidebar becomes a top bar with a Menu button that opens the links, and the cards stack. Tokens: primary #0e7490, surface #ffffff, text #0f172a; dark theme surface #0f172a and text #e2e8f0.",
        webLab: lab({
          task:
            "Build it in Dashboard.jsx and Dashboard.module.css. Define the tokens as CSS variables (--surface and --text at least, with a [data-theme=\"dark\"] override) and use them for the content's background and text. Laptop (1280px): the <nav aria-label=\"Main\"> sidebar is 240px wide beside the content, its links always visible; four <article> stat cards in one row. Phone (375px): the nav is above the content, its links hidden behind a <button aria-expanded> labelled \"Menu\" that toggles them; cards stacked; no sideways scrolling. The theme toggle button (aria-label \"Toggle dark mode\") switches document.documentElement.dataset.theme between light and dark. Every text/background pair must have at least 4.5:1 contrast.",
          files: {
            "src/Dashboard.jsx": `import { useEffect, useState } from "react";
import styles from "./Dashboard.module.css";

const STATS = [
  ["Students", "1,240"],
  ["Courses", "16"],
  ["Completion", "78%"],
  ["Revenue", "₦4.2m"],
];
const LINKS = ["Overview", "Courses", "Students", "Settings"];

export default function Dashboard() {
  return <h1>Overview</h1>;
}
`,
            "src/Dashboard.module.css": "",
            "src/App.jsx": `import Dashboard from "./Dashboard.jsx";

export default function App() {
  return <Dashboard />;
}
`,
          },
          readOnly: ["src/App.jsx"],
          revealSolution: false,
          tests: [
            { label: "Laptop: 240px sidebar with visible links", viewport: "desktop", check: "const nav = $('nav[aria-label=Main]'); return !!nav && Math.round(rect(nav).width) === 240 && $$('nav a').length === 4 && $$('nav a').every((a) => visible(a)) && !visible($$('button').find((b) => text(b) === 'Menu') || document.createElement('i'));", fail: "A 240px grid column for the nav from 768px or 1024px up; hide the Menu button there." },
            { label: "Laptop: four stat cards in one row", viewport: "desktop", check: "const c = $$('article'); return c.length === 4 && new Set(c.map((x) => Math.round(rect(x).top))).size === 1;", fail: "A grid of four columns (or auto-fill) for the cards." },
            { label: "Phone: links behind a Menu button", viewport: "mobile", check: "const m = $$('button').find((b) => text(b) === 'Menu'); if (!m || !visible(m)) return false; const hidden = $$('nav a').every((a) => !visible(a)) && m.getAttribute('aria-expanded') === 'false'; await click(m); return hidden && m.getAttribute('aria-expanded') === 'true' && $$('nav a').every((a) => visible(a));", fail: "On phones, hide the links until the Menu button sets an open state." },
            { label: "Phone: cards stacked, no sideways scroll", viewport: "mobile", check: "const c = $$('article'); return new Set(c.map((x) => Math.round(rect(x).left))).size === 1 && !overflowX();", fail: "One column on phones." },
            { label: "Theme tokens switch the colours", viewport: "desktop", check: "const main = $('main'); if (!main) return false; const light = style(main, 'background-color'); await click($$('button').find((b) => nameOf(b) === 'Toggle dark mode')); await waitFor(() => document.documentElement.dataset.theme === 'dark'); return light !== style(main, 'background-color') && /var\\(--/.test(code('src/Dashboard.module.css')) && /data-theme/.test(code('src/Dashboard.module.css'));", fail: "Use var(--surface) and var(--text) on <main>, with a [data-theme=\"dark\"] override." },
            { label: "Text is readable in both themes", viewport: "desktop", check: "const ok = () => contrast(style('main', 'color'), style('main', 'background-color')) >= 4.5; const dark = ok(); await click($$('button').find((b) => nameOf(b) === 'Toggle dark mode')); await waitFor(() => document.documentElement.dataset.theme === 'light'); return dark && ok();", fail: "Check your token pairs for 4.5:1 contrast." },
          ],
          solution: {
            "src/Dashboard.jsx": `import { useEffect, useState } from "react";
import styles from "./Dashboard.module.css";

const STATS = [
  ["Students", "1,240"],
  ["Courses", "16"],
  ["Completion", "78%"],
  ["Revenue", "₦4.2m"],
];
const LINKS = ["Overview", "Courses", "Students", "Settings"];

export default function Dashboard() {
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  return (
    <div className={styles.shell}>
      <nav aria-label="Main" className={styles.nav}>
        <span className={styles.brand}>Memora</span>
        <button className={styles.menu} aria-expanded={open} onClick={() => setOpen(!open)}>
          Menu
        </button>
        <div className={open ? styles.links + " " + styles.open : styles.links}>
          {LINKS.map((l) => (
            <a key={l} href={"#" + l.toLowerCase()}>
              {l}
            </a>
          ))}
        </div>
      </nav>
      <main className={styles.main}>
        <header className={styles.top}>
          <h1>Overview</h1>
          <button aria-label="Toggle dark mode" onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
            {theme === "light" ? "☾" : "☀"}
          </button>
        </header>
        <section className={styles.cards}>
          {STATS.map(([label, value]) => (
            <article key={label} className={styles.card}>
              <span>{label}</span>
              <strong>{value}</strong>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}
`,
            "src/Dashboard.module.css": `:root { --primary: #0e7490; --surface: #ffffff; --text: #0f172a; --nav: #0f172a; --nav-text: #e2e8f0; }
:global([data-theme="dark"]) { --surface: #0f172a; --text: #e2e8f0; --nav: #020617; }

.shell { display: grid; grid-template-columns: 1fr; min-height: 100vh; }
.nav { background: var(--nav); color: var(--nav-text); padding: 12px 16px; display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; }
.brand { font-weight: 700; }
.menu { min-height: 44px; }
.links { display: none; width: 100%; flex-direction: column; gap: 8px; }
.links.open { display: flex; }
.links a { color: var(--nav-text); padding: 8px 0; }
.main { background: var(--surface); color: var(--text); padding: 16px; min-width: 0; }
.top { display: flex; justify-content: space-between; align-items: center; }
.cards { display: grid; gap: 16px; }
.card { border: 1px solid #94a3b8; border-radius: 12px; padding: 16px; display: flex; flex-direction: column; gap: 4px; }

@media (min-width: 1024px) {
  .shell { grid-template-columns: 240px 1fr; }
  .nav { flex-direction: column; align-items: stretch; justify-content: flex-start; gap: 16px; }
  .menu { display: none; }
  .links { display: flex; }
  .cards { grid-template-columns: repeat(4, 1fr); }
}
`,
          },
          hint: "Start with the phone layout and the Menu toggle; then add the 1024px grid that turns the nav into a sidebar.",
          successMessage: "A design recreated responsively, themeable and accessible.",
        }),
      },
    ],
    task: {
      title: "Module 10 practical: your dashboard from a design",
      intro: "Pick a free dashboard design from the Figma Community and recreate it.",
      prompts: [
        "Extract the design's tokens (colours, type, spacing, radii) into CSS variables or a Tailwind theme first.",
        "Build it with either CSS Modules or Tailwind, consistently, mirroring the design's components as React components.",
        "Implement desktop and mobile layouts, a dark theme that follows the system and remembers a choice, and accessible tabs or a modal.",
        "Check contrast with DevTools, tab through the whole page, and test at 320px, 768px and 1280px.",
        "Mastery checkpoint: show the static design next to your app at two widths, and explain how you kept it accessible.",
      ],
      closing: "Next: Module 11, TypeScript with React.",
    },
    requirements: { read: true, video: false, assessment: true },
  },
];
