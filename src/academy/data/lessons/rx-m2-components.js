/**
 * REACT DEVELOPMENT · MODULE 2 · COMPONENTS, PROPS AND REUSABLE UI
 *
 * Curriculum 2.1 – 2.P. Function components, naming and files, imports and
 * exports, nesting and layout, props, defaults, children, separating data
 * from presentation, reusable UI pieces, component size, composition and
 * configurable components. Labs grow from one file to a src/components/ and
 * src/data/ structure, the way real projects are organised.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

import { reactLab } from "./rx-helpers.js";

export const SECTION_ID = "rx-s2-components";
const MODULE = "rx-m2-components";

const COURSES_DATA = `export const courses = [
  { id: 1, title: "HTML & CSS", weeks: 4, level: "Beginner", instructor: "Ngozi Eze", description: "Structure and style accessible pages." },
  { id: 2, title: "JavaScript", weeks: 6, level: "Beginner", instructor: "Tunde Bello", description: "Program the browser from first principles." },
  { id: 3, title: "React", weeks: 16, level: "Intermediate", instructor: "Ada Obi", description: "Build modern interfaces from components." },
  { id: 4, title: "TypeScript", weeks: 3, level: "Intermediate", instructor: "Musa Ali", description: "Add type safety to JavaScript projects." },
];
`;

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 14 · 2.1 – 2.3
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "rx-l14-components",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 1,
    covers: ["2.1", "2.2", "2.3"],
    title: "Components, Files and Modules",
    subtitle: "Function components, naming conventions, file organisation, import and export",
    estimatedMinutes: 30,
    intro: "A component is the unit of a React app. Learning to write, name, place and share them is what makes a project easy to find your way around.",

    atoms: [
      {
        id: "a-rx-function-components",
        title: "Function components",
        explain:
          "A component is a JavaScript function whose name starts with a capital letter and which returns JSX. You use it like a tag: <Badge />. Each <Badge /> is a separate INSTANCE: React calls the function for each one. Components can return null to render nothing. Modern React uses function components only; class components (class X extends React.Component) are legacy and you will only meet them in old code.",
        webLab: reactLab({
          task:
            "Write a component called NewBadge that returns <span className=\"badge\">New</span>, then use it three times inside the <ul>: once after each course name.",
          files: {
            "src/App.jsx": `// write the NewBadge component here

export default function App() {
  return (
    <ul>
      <li>HTML</li>
      <li>CSS</li>
      <li>React</li>
    </ul>
  );
}
`,
          },
          tests: [
            { label: "A NewBadge component exists", check: "return /function\\s+NewBadge\\s*\\(|const\\s+NewBadge\\s*=/.test(code('src/App.jsx'));", fail: "function NewBadge() { return <span className=\"badge\">New</span>; }" },
            { label: "Each of the three items shows a New badge", check: "const li = $$('li'); return li.length === 3 && li.every((x) => x.querySelector('span.badge')?.textContent === 'New');", fail: "Put <NewBadge /> inside each <li>." },
            { label: "The badge is used as a component, three times", check: "return (code('src/App.jsx').match(/<NewBadge\\s*\\/>/g) || []).length === 3;", fail: "Use <NewBadge /> rather than repeating the <span>." },
          ],
          solution: {
            "src/App.jsx": `function NewBadge() {
  return <span className="badge">New</span>;
}

export default function App() {
  return (
    <ul>
      <li>
        HTML <NewBadge />
      </li>
      <li>
        CSS <NewBadge />
      </li>
      <li>
        React <NewBadge />
      </li>
    </ul>
  );
}
`,
          },
          hint: "Define it above App, with a capital N, and use it like a tag.",
          successMessage: "Write once, use three times. Change the text in NewBadge and all three change.",
        }),
      },
      {
        id: "a-rx-naming-files",
        title: "Component naming conventions and file organisation",
        explain:
          "Name components in PascalCase after what they ARE: CourseCard, SearchBox, PageHeader, not Box2 or Thing. Give each component that is used in more than one place its own file named exactly like it: src/components/CourseCard.jsx exports CourseCard. A common structure: src/components/ for reusable pieces, src/pages/ for whole screens (Module 8), src/data/ or src/api/ for data, src/hooks/ for custom Hooks. Files containing JSX use the .jsx extension; plain logic uses .js.",
        webLab: reactLab({
          task:
            "Move the Header component out of App.jsx into its own file, src/components/Header.jsx, as that file's default export. Then import it in App.jsx. The page must look exactly the same.",
          files: {
            "src/App.jsx": `function Header() {
  return (
    <header>
      <h1>Memora Academy</h1>
      <p>Learn to build for the web</p>
    </header>
  );
}

export default function App() {
  return (
    <>
      <Header />
      <main>
        <h2>Courses</h2>
      </main>
    </>
  );
}
`,
            "src/components/Header.jsx": "// move the Header component here\n",
          },
          tests: [
            { label: "The page still shows the header", check: "return text('header h1') === 'Memora Academy' && text('main h2') === 'Courses';", fail: "Import Header so App can still use it." },
            { label: "Header.jsx default-exports the Header component", check: "return /export\\s+default\\s+function\\s+Header\\s*\\(/.test(code('src/components/Header.jsx')) || (/function\\s+Header\\s*\\(/.test(code('src/components/Header.jsx')) && /export\\s+default\\s+Header/.test(code('src/components/Header.jsx')));", fail: "export default function Header() { … } in src/components/Header.jsx." },
            { label: "App.jsx imports it and no longer defines it", check: "const a = code('src/App.jsx'); return /import\\s+Header\\s+from\\s+[\"']\\.\\/components\\/Header(\\.jsx)?[\"']/.test(a) && !/function\\s+Header/.test(a);", fail: "import Header from \"./components/Header.jsx\"; and delete the old function." },
          ],
          solution: {
            "src/components/Header.jsx": `export default function Header() {
  return (
    <header>
      <h1>Memora Academy</h1>
      <p>Learn to build for the web</p>
    </header>
  );
}
`,
            "src/App.jsx": `import Header from "./components/Header.jsx";

export default function App() {
  return (
    <>
      <Header />
      <main>
        <h2>Courses</h2>
      </main>
    </>
  );
}
`,
          },
          hint: "The path is relative to App.jsx: ./components/Header.jsx",
          successMessage: "One component, one file, found where anyone would look for it.",
        }),
      },
      {
        id: "a-rx-import-export",
        title: "Importing and exporting components",
        explain:
          "A file has at most ONE default export, imported without braces under any name you like: import Header from \"./Header.jsx\". It can have many NAMED exports, imported with braces and their exact names: import { naira, plural } from \"./format.js\". The convention in React projects: a component file default-exports its component; a helpers file uses named exports. Importing a named export as a default (or the reverse) gives undefined, and calling or rendering undefined is one of the most common errors beginners see.",
        webLab: reactLab({
          task:
            "The page crashes: format.js has two NAMED exports, but App.jsx imports them as if format.js had a default export. Fix the import so the price shows \"₦12,000\" and the line shows \"3 lessons\".",
          files: {
            "src/App.jsx": `import format from "./utils/format.js";

export default function App() {
  return (
    <section>
      <p className="price">{format.naira(12000)}</p>
      <p className="count">{format.plural(3, "lesson")}</p>
    </section>
  );
}
`,
            "src/utils/format.js": `export function naira(amount) {
  return "₦" + amount.toLocaleString("en-NG");
}

export function plural(count, word) {
  return count + " " + word + (count === 1 ? "" : "s");
}
`,
          },
          readOnly: ["src/utils/format.js"],
          tests: [
            { label: "The price shows ₦12,000", check: "return text('.price') === '₦12,000';", fail: "Import the named exports with braces." },
            { label: "The count shows 3 lessons", check: "return text('.count') === '3 lessons';", fail: "Call plural(3, \"lesson\")." },
            { label: "Named imports are used", check: "return /import\\s*\\{[^}]*naira[^}]*\\}\\s*from/.test(code('src/App.jsx'));", fail: "import { naira, plural } from \"./utils/format.js\";" },
          ],
          solution: {
            "src/App.jsx": `import { naira, plural } from "./utils/format.js";

export default function App() {
  return (
    <section>
      <p className="price">{naira(12000)}</p>
      <p className="count">{plural(3, "lesson")}</p>
    </section>
  );
}
`,
          },
          hint: "Look at format.js: export function naira, not export default.",
          successMessage: "Braces for named exports, none for a default. You will fix this error for colleagues many times.",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 15 · 2.4 – 2.6
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "rx-l15-props",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 2,
    covers: ["2.4", "2.5", "2.6"],
    title: "Composing Components and Passing Props",
    subtitle: "Nesting and layouts, props from parent to child, destructuring and defaults",
    estimatedMinutes: 35,
    intro: "Components become useful when they are combined and when each instance can show different data. Composition is how they combine; props are how data flows into them.",

    atoms: [
      {
        id: "a-rx-nesting",
        title: "Nesting components and composing layouts",
        explain:
          "Components render other components, which render others: App renders Layout, which renders Header, Main and Footer, and Main renders CourseList, which renders CourseCards. That nesting is the COMPONENT TREE, which React DevTools shows. A good tree reads like a description of the page. Define components at the top level of a file, never inside another component: a component defined inside another is recreated on every render, which resets its state.",
        webLab: reactLab({
          task:
            "Compose the page from components. Write three components in App.jsx: SiteHeader (a <header> with an <h1> \"Memora Academy\"), CourseSection (a <main> with an <h2> \"Courses\") and SiteFooter (a <footer> with the text \"Lagos, Nigeria\"). App must render all three, in that order, inside a fragment.",
          files: {
            "src/App.jsx": `// SiteHeader, CourseSection and SiteFooter go here

export default function App() {
  return <p>Compose me</p>;
}
`,
          },
          tests: [
            { label: "Header, main and footer render in order", check: "const r = $('#root'); return [...r.children].map((e) => e.tagName).join() === 'HEADER,MAIN,FOOTER';", fail: "App returns <><SiteHeader /><CourseSection /><SiteFooter /></>." },
            { label: "Each shows its content", check: "return text('header h1') === 'Memora Academy' && text('main h2') === 'Courses' && text('footer') === 'Lagos, Nigeria';", fail: "Check each component's text." },
            { label: "They are three components, used by App", check: "const c = code('src/App.jsx'); return ['SiteHeader', 'CourseSection', 'SiteFooter'].every((n) => new RegExp('function\\\\s+' + n + '\\\\s*\\\\(').test(c) && new RegExp('<' + n + '\\\\s*/>').test(c));", fail: "Define each as a function and render it as <Name />." },
          ],
          solution: {
            "src/App.jsx": `function SiteHeader() {
  return (
    <header>
      <h1>Memora Academy</h1>
    </header>
  );
}

function CourseSection() {
  return (
    <main>
      <h2>Courses</h2>
    </main>
  );
}

function SiteFooter() {
  return <footer>Lagos, Nigeria</footer>;
}

export default function App() {
  return (
    <>
      <SiteHeader />
      <CourseSection />
      <SiteFooter />
    </>
  );
}
`,
          },
          hint: "Three top-level functions, then App renders each one.",
          successMessage: "App now reads like an outline of the page.",
        }),
      },
      {
        id: "a-rx-props",
        title: "Props: passing data from parent to child",
        explain:
          "PROPS are a component's inputs, written like attributes: <CourseCard title=\"React\" weeks={16} />. Strings can use quotes; every other value (numbers, booleans, arrays, objects, functions) goes in braces. React collects them into one object and passes it as the function's first argument: function CourseCard(props) { return <h3>{props.title}</h3>; }. Data flows ONE WAY, from parent to child. A child must never change its props; to change what it shows, the parent passes different props.",
        webLab: reactLab({
          task:
            "CourseCard currently always shows \"React\" and \"16 weeks\". Make it use its props: props.title in the <h3> and props.weeks in the <p> (\"N weeks\"). Then render three cards in App: HTML (4 weeks), JavaScript (6 weeks) and React (16 weeks). Pass weeks as a number.",
          files: {
            "src/App.jsx": `function CourseCard(props) {
  return (
    <article className="card">
      <h3>React</h3>
      <p>16 weeks</p>
    </article>
  );
}

export default function App() {
  return (
    <section>
      <CourseCard />
    </section>
  );
}
`,
          },
          tests: [
            { label: "Three cards with the right titles", check: "return $$('.card h3').map((h) => text(h)).join() === 'HTML,JavaScript,React';", fail: "Render three CourseCards with different title props." },
            { label: "Each card shows its own weeks", check: "return $$('.card p').map((p) => text(p)).join() === '4 weeks,6 weeks,16 weeks';", fail: "Use {props.weeks} weeks in the paragraph." },
            { label: "weeks is passed as a number, in braces", check: "return /weeks=\\{\\s*4\\s*\\}/.test(code('src/App.jsx'));", fail: "weeks={4}, not weeks=\"4\"." },
          ],
          solution: {
            "src/App.jsx": `function CourseCard(props) {
  return (
    <article className="card">
      <h3>{props.title}</h3>
      <p>{props.weeks} weeks</p>
    </article>
  );
}

export default function App() {
  return (
    <section>
      <CourseCard title="HTML" weeks={4} />
      <CourseCard title="JavaScript" weeks={6} />
      <CourseCard title="React" weeks={16} />
    </section>
  );
}
`,
          },
          hint: "Inside the card: {props.title}. In App: <CourseCard title=\"HTML\" weeks={4} />.",
          successMessage: "One component, three different cards: the parent decides the data, the child decides the look.",
        }),
      },
      {
        id: "a-rx-props-defaults",
        title: "Destructuring props and setting defaults",
        explain:
          "Instead of props.title everywhere, destructure in the parameter list: function CourseCard({ title, weeks }). It also documents, at a glance, what the component accepts. Defaults go in the same place: function Button({ label, variant = \"primary\", size = \"md\" }). A default applies when the prop is missing (undefined), not when it is null or an empty string. To pass every remaining prop on, use rest and spread: function Input({ label, ...rest }) { return <input {...rest} />; }.",
        webLab: reactLab({
          task:
            "Rewrite Button to destructure its props as { label, variant = \"primary\", size = \"md\" }, and give the <button> the className \"btn btn-<variant> btn-<size>\". The three buttons in App must then get the classes: btn btn-primary btn-md, btn btn-danger btn-md and btn btn-primary btn-lg.",
          files: {
            "src/App.jsx": `function Button(props) {
  return <button className="btn">{props.label}</button>;
}

export default function App() {
  return (
    <div className="toolbar">
      <Button label="Save" />
      <Button label="Delete" variant="danger" />
      <Button label="Enroll now" size="lg" />
    </div>
  );
}
`,
          },
          tests: [
            { label: "The buttons get the right classes from their props and defaults", check: "return $$('button').map((b) => b.className).join('|') === 'btn btn-primary btn-md|btn btn-danger btn-md|btn btn-primary btn-lg';", fail: "className={\"btn btn-\" + variant + \" btn-\" + size}" },
            { label: "Labels still show", check: "return $$('button').map((b) => text(b)).join() === 'Save,Delete,Enroll now';", fail: "Render {label} inside the button." },
            { label: "Props are destructured with defaults", check: "return /function\\s+Button\\s*\\(\\s*\\{[^}]*variant\\s*=\\s*[\"']primary[\"'][^}]*size\\s*=\\s*[\"']md[\"']/.test(code('src/App.jsx'));", fail: "function Button({ label, variant = \"primary\", size = \"md\" })" },
          ],
          solution: {
            "src/App.jsx": `function Button({ label, variant = "primary", size = "md" }) {
  return <button className={"btn btn-" + variant + " btn-" + size}>{label}</button>;
}

export default function App() {
  return (
    <div className="toolbar">
      <Button label="Save" />
      <Button label="Delete" variant="danger" />
      <Button label="Enroll now" size="lg" />
    </div>
  );
}
`,
          },
          hint: "Defaults go inside the destructuring braces: { variant = \"primary\" }.",
          successMessage: "Readable inputs, sensible defaults: the callers only say what is different.",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 16 · 2.7 – 2.9
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "rx-l16-reusable-ui",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 3,
    covers: ["2.7", "2.8", "2.9"],
    title: "children, Data and Reusable UI",
    subtitle: "Layout components with children, separating data from presentation, and reusable building blocks",
    estimatedMinutes: 35,
    intro: "The most reused components in any app are the boring ones: cards, buttons, headers, navigation. Building them well is most of front-end work.",

    atoms: [
      {
        id: "a-rx-children",
        title: "The children prop and reusable layout components",
        explain:
          "Whatever you put BETWEEN a component's opening and closing tags arrives as the special prop children: <Card><h3>React</h3><p>16 weeks</p></Card> passes those two elements as children, and Card decides where they go: function Card({ children }) { return <div className=\"card\">{children}</div>; }. That makes layout components (Card, Panel, Modal, PageLayout) that wrap ANY content without knowing what it is. A component can mix children with ordinary props: <Panel title=\"Profile\">…</Panel>.",
        webLab: reactLab({
          task:
            "Write a Panel component that takes a title prop and children, and renders <section className=\"panel\"> containing an <h2> with the title followed by the children. App already uses it for two panels.",
          files: {
            "src/App.jsx": `// write Panel here

export default function App() {
  return (
    <>
      <Panel title="Profile">
        <p>Ada Obi</p>
        <p>Lagos</p>
      </Panel>
      <Panel title="Progress">
        <progress value={60} max={100} />
      </Panel>
    </>
  );
}
`,
          },
          tests: [
            { label: "Two panels with their titles", check: "return $$('section.panel > h2').map((h) => text(h)).join() === 'Profile,Progress';", fail: "Render <h2>{title}</h2> first inside the section." },
            { label: "Each panel shows its own children", check: "const p = $$('section.panel'); return p.length === 2 && p[0].querySelectorAll('p').length === 2 && !!p[1].querySelector('progress');", fail: "Render {children} after the heading." },
          ],
          solution: {
            "src/App.jsx": `function Panel({ title, children }) {
  return (
    <section className="panel">
      <h2>{title}</h2>
      {children}
    </section>
  );
}

export default function App() {
  return (
    <>
      <Panel title="Profile">
        <p>Ada Obi</p>
        <p>Lagos</p>
      </Panel>
      <Panel title="Progress">
        <progress value={60} max={100} />
      </Panel>
    </>
  );
}
`,
          },
          hint: "function Panel({ title, children })",
          successMessage: "Panel knows nothing about profiles or progress bars, so it works for anything.",
        }),
      },
      {
        id: "a-rx-data-presentation",
        title: "Separating data from presentation",
        explain:
          "Keep WHAT you show (the data) apart from HOW it looks (the components). Data lives in its own module, such as src/data/courses.js, or later comes from an API; presentational components such as CourseCard only receive props and return JSX, knowing nothing about where the data came from. Then the same card works with data from a file today and from a server tomorrow, and you can change the design without touching the data. Rendering a list of components from an array uses map(), which Module 3 covers in depth, including the key prop each item needs.",
        webLab: reactLab({
          task:
            "The course data is hard-coded inside CourseCard, so it can only ever show React. Make CourseCard presentational: it takes a course prop and shows course.title, course.instructor and \"N weeks\". In App, import courses from src/data/courses.js and render a CourseCard for each with courses.map((course) => <CourseCard key={course.id} course={course} />).",
          files: {
            "src/App.jsx": `import CourseCard from "./components/CourseCard.jsx";

export default function App() {
  return (
    <section className="grid">
      <CourseCard />
    </section>
  );
}
`,
            "src/components/CourseCard.jsx": `export default function CourseCard() {
  const course = { title: "React", instructor: "Ada Obi", weeks: 16 };
  return (
    <article className="card">
      <h3>{course.title}</h3>
      <p>{course.instructor}</p>
      <p>{course.weeks} weeks</p>
    </article>
  );
}
`,
            "src/data/courses.js": COURSES_DATA,
          },
          readOnly: ["src/data/courses.js"],
          tests: [
            { label: "Four cards, one per course in the data file", check: "return $$('.card h3').map((h) => text(h)).join() === 'HTML & CSS,JavaScript,React,TypeScript';", fail: "Import courses and map over it in App." },
            { label: "Each card shows its own instructor and weeks", check: "const c = $$('.card')[1]; return !!c && c.textContent.includes('Tunde Bello') && c.textContent.includes('6 weeks');", fail: "Use course.instructor and course.weeks from the prop." },
            { label: "CourseCard has no data of its own", check: "const c = code('src/components/CourseCard.jsx'); return /\\{\\s*course\\s*\\}/.test(c) && !/Ada Obi|React/.test(c);", fail: "function CourseCard({ course }) — and delete the hard-coded object." },
            { label: "Every card has a key", check: "return !/unique \"key\"/.test(output());", fail: "Give each card key={course.id}." },
          ],
          solution: {
            "src/App.jsx": `import CourseCard from "./components/CourseCard.jsx";
import { courses } from "./data/courses.js";

export default function App() {
  return (
    <section className="grid">
      {courses.map((course) => (
        <CourseCard key={course.id} course={course} />
      ))}
    </section>
  );
}
`,
            "src/components/CourseCard.jsx": `export default function CourseCard({ course }) {
  return (
    <article className="card">
      <h3>{course.title}</h3>
      <p>{course.instructor}</p>
      <p>{course.weeks} weeks</p>
    </article>
  );
}
`,
          },
          hint: "courses.js uses a named export: import { courses } from \"./data/courses.js\".",
          successMessage: "Add a fifth course to courses.js and a fifth card appears. No component changed.",
        }),
      },
      {
        id: "a-rx-reusable-ui",
        title: "Reusable buttons, cards, navigation bars and page headers",
        explain:
          "Every app needs the same few building blocks, and each should be written once: a Button (label or children, variant, size, type), a Card (children), a NavBar (a list of links as a prop, plus which one is current), a PageHeader (title and optional subtitle). Make them accept data, not contain it: NavBar takes links={[{ href, label }]} rather than having the links typed inside. Mark the current page with aria-current=\"page\", which screen readers announce and CSS can style.",
        webLab: reactLab({
          task:
            "Finish the two reusable components. NavBar takes links (an array of { href, label }) and current (an href) and renders a <nav> with one <a> per link; the current link gets aria-current=\"page\". PageHeader takes title and an optional subtitle and renders a <header> with an <h1>, plus a <p> only when there is a subtitle.",
          files: {
            "src/components/NavBar.jsx": `export default function NavBar({ links, current }) {
  return <nav></nav>;
}
`,
            "src/components/PageHeader.jsx": `export default function PageHeader({ title, subtitle }) {
  return <header></header>;
}
`,
            "src/App.jsx": `import NavBar from "./components/NavBar.jsx";
import PageHeader from "./components/PageHeader.jsx";

const links = [
  { href: "#home", label: "Home" },
  { href: "#courses", label: "Courses" },
  { href: "#profile", label: "Profile" },
];

export default function App() {
  return (
    <>
      <NavBar links={links} current="#courses" />
      <PageHeader title="Courses" subtitle="Pick your next skill" />
      <PageHeader title="Settings" />
    </>
  );
}
`,
          },
          readOnly: ["src/App.jsx"],
          tests: [
            { label: "The nav renders one link per item", check: "const a = $$('nav a'); return a.map((x) => text(x)).join() === 'Home,Courses,Profile' && a[2].getAttribute('href') === '#profile';", fail: "Map links to <a key={link.href} href={link.href}>{link.label}</a>." },
            { label: "Only the current link has aria-current=\"page\"", check: "const a = $$('nav a'); return a.filter((x) => x.getAttribute('aria-current') === 'page').map((x) => text(x)).join() === 'Courses';", fail: "aria-current={link.href === current ? \"page\" : undefined}" },
            { label: "PageHeader shows the title and the subtitle", check: "const h = $$('header'); return text(h[0].querySelector('h1')) === 'Courses' && text(h[0].querySelector('p')) === 'Pick your next skill';", fail: "Render <h1>{title}</h1> and the subtitle in a <p>." },
            { label: "No empty paragraph when there is no subtitle", check: "const h = $$('header')[1]; return text(h.querySelector('h1')) === 'Settings' && !h.querySelector('p');", fail: "{subtitle && <p>{subtitle}</p>}" },
            { label: "No missing-key warnings", check: "return !/unique \"key\"/.test(output());", fail: "Give each link a key." },
          ],
          solution: {
            "src/components/NavBar.jsx": `export default function NavBar({ links, current }) {
  return (
    <nav>
      {links.map((link) => (
        <a key={link.href} href={link.href} aria-current={link.href === current ? "page" : undefined}>
          {link.label}
        </a>
      ))}
    </nav>
  );
}
`,
            "src/components/PageHeader.jsx": `export default function PageHeader({ title, subtitle }) {
  return (
    <header>
      <h1>{title}</h1>
      {subtitle && <p>{subtitle}</p>}
    </header>
  );
}
`,
          },
          hint: "An attribute set to undefined is left out of the HTML entirely.",
          successMessage: "Two components every app needs, driven entirely by props.",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 17 · 2.10 – 2.12
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "rx-l17-composition",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 4,
    covers: ["2.10", "2.11", "2.12"],
    title: "Designing Components",
    subtitle: "One responsibility each, composition instead of duplication, and configurable components",
    estimatedMinutes: 30,
    intro: "Knowing how to write a component is the easy half. The hard half is deciding where one component should end and the next begin.",

    atoms: [
      {
        id: "a-rx-responsibilities",
        title: "Component responsibilities and avoiding oversized components",
        explain:
          "A component should have one job you can say in a sentence: \"shows one course\", \"lays out the page\", \"lets you search\". Signs one has grown too big: hundreds of lines; a name ending in And (HeaderAndSearchAndCart); several unrelated pieces of state; sections of JSX with comments above them saying what they are, which are components waiting to be extracted. Extract when a piece is reused, when it has its own logic, or when it makes the parent easier to read. Do not split for the sake of it: a ten-line component used once can stay where it is.",
        decision: {
          scenario:
            "Dashboard.jsx is 600 lines. It fetches the user, renders a header with a search box, a sidebar of links, a grid of course cards and a footer, with comments like {/* Course grid */} above each part.",
          question: "What is the best first step?",
          options: [
            { id: "a", text: "Extract the commented sections into components (Header, SearchBox, Sidebar, CourseGrid, Footer) and let Dashboard compose them", why: "The comments already name the components. Each becomes small, testable and reusable, and Dashboard reads like an outline." },
            { id: "b", text: "Leave it: it works", whyWrong: "Every change now means reading 600 lines, and nothing in it can be reused." },
            { id: "c", text: "Split it into Dashboard1.jsx and Dashboard2.jsx at line 300", whyWrong: "Splitting by line count produces two files that make no sense on their own." },
            { id: "d", text: "Turn every single element into its own component", whyWrong: "Over-splitting makes the code harder to follow; split by responsibility." },
          ],
          correct: "a",
          aftermath: "A comment that labels a block of JSX is usually a component's name.",
        },
      },
      {
        id: "a-rx-composition",
        title: "Composition versus unnecessary duplication",
        explain:
          "When two components are nearly identical (SuccessAlert and ErrorAlert, differing only in colour and icon) the fix is not a third copy for warnings; it is one component with a prop for what varies: <Alert tone=\"success\">. When the CONTENT varies a lot, use composition instead: let the component take children (or a prop holding JSX, such as icon={<StarIcon />}) and stay out of the details. Duplication means every fix must be made in several places, and one will be missed.",
        webLab: reactLab({
          task:
            "SuccessAlert and ErrorAlert are copies of each other. Replace them with ONE component, Alert, that takes tone (\"success\" or \"error\") and children, renders <div role=\"alert\" className=\"alert alert-<tone>\"> with an icon <span className=\"icon\"> (✓ for success, ! for error) and then the children. Update App to use <Alert>, and delete the two old components.",
          files: {
            "src/App.jsx": `function SuccessAlert({ children }) {
  return (
    <div role="alert" className="alert alert-success">
      <span className="icon">✓</span>
      {children}
    </div>
  );
}

function ErrorAlert({ children }) {
  return (
    <div role="alert" className="alert alert-error">
      <span className="icon">!</span>
      {children}
    </div>
  );
}

export default function App() {
  return (
    <>
      <SuccessAlert>Profile saved.</SuccessAlert>
      <ErrorAlert>Payment failed. Try again.</ErrorAlert>
    </>
  );
}
`,
          },
          tests: [
            { label: "The two alerts still render the same", check: "const a = $$('[role=alert]'); return a.length === 2 && a[0].className === 'alert alert-success' && text(a[0].querySelector('.icon')) === '✓' && a[0].textContent.includes('Profile saved.') && a[1].className === 'alert alert-error' && text(a[1].querySelector('.icon')) === '!';", fail: "Alert must produce exactly the old markup for each tone." },
            { label: "One Alert component replaces the copies", check: "const c = code('src/App.jsx'); return /function\\s+Alert\\s*\\(/.test(c) && !/SuccessAlert|ErrorAlert/.test(c) && (c.match(/<Alert\\b/g) || []).length === 2;", fail: "Delete SuccessAlert and ErrorAlert and use <Alert tone=\"…\">." },
          ],
          solution: {
            "src/App.jsx": `const ICONS = { success: "✓", error: "!" };

function Alert({ tone, children }) {
  return (
    <div role="alert" className={"alert alert-" + tone}>
      <span className="icon">{ICONS[tone]}</span>
      {children}
    </div>
  );
}

export default function App() {
  return (
    <>
      <Alert tone="success">Profile saved.</Alert>
      <Alert tone="error">Payment failed. Try again.</Alert>
    </>
  );
}
`,
          },
          hint: "An object such as { success: \"✓\", error: \"!\" } maps the tone to its icon.",
          successMessage: "A warning tone is now one line in the icons object, not a third copy.",
        }),
      },
      {
        id: "a-rx-configurable",
        title: "Rendering different content through configurable components",
        explain:
          "A configurable component renders different content depending on its props, inside one consistent design: a StatCard that shows an up arrow and green for trend=\"up\", a down arrow and red for \"down\", and nothing extra when there is no trend; a Card with variant=\"compact\" that hides the description. Keep configuration to props that describe the purpose (trend, variant, size), not the raw styles (arrowColor, marginTop), so callers cannot produce inconsistent designs.",
        webLab: reactLab({
          task:
            "Make StatCard configurable with an optional trend prop. trend=\"up\" adds the class stat-up and a <span className=\"trend\">▲</span> after the value; trend=\"down\" adds stat-down and ▼; with no trend, the class is just stat and there is no trend span.",
          files: {
            "src/App.jsx": `function StatCard({ label, value, trend }) {
  return (
    <div className="stat">
      <p className="label">{label}</p>
      <p className="value">{value}</p>
    </div>
  );
}

export default function App() {
  return (
    <section className="stats">
      <StatCard label="Students" value={1240} trend="up" />
      <StatCard label="Drop-outs" value={31} trend="down" />
      <StatCard label="Courses" value={9} />
    </section>
  );
}
`,
          },
          tests: [
            { label: "Classes follow the trend", check: "return $$('section.stats > div').map((d) => d.className).join('|') === 'stat stat-up|stat stat-down|stat';", fail: "className={trend ? \"stat stat-\" + trend : \"stat\"}" },
            { label: "Arrows follow the trend", check: "const d = $$('section.stats > div'); return text(d[0].querySelector('.trend')) === '▲' && text(d[1].querySelector('.trend')) === '▼';", fail: "Show ▲ for up and ▼ for down." },
            { label: "No trend, no arrow", check: "return !$$('section.stats > div')[2].querySelector('.trend');", fail: "Render the span only when there is a trend." },
          ],
          solution: {
            "src/App.jsx": `const ARROWS = { up: "▲", down: "▼" };

function StatCard({ label, value, trend }) {
  return (
    <div className={trend ? "stat stat-" + trend : "stat"}>
      <p className="label">{label}</p>
      <p className="value">
        {value}
        {trend && <span className="trend">{ARROWS[trend]}</span>}
      </p>
    </div>
  );
}

export default function App() {
  return (
    <section className="stats">
      <StatCard label="Students" value={1240} trend="up" />
      <StatCard label="Drop-outs" value={31} trend="down" />
      <StatCard label="Courses" value={9} />
    </section>
  );
}
`,
          },
          hint: "{trend && <span …>} renders nothing when trend is undefined.",
          successMessage: "Three looks, one component, and every caller stays consistent.",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 18 · 2.P
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "rx-l18-m2-project",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 5,
    covers: ["2.P"],
    title: "Practical: A Reusable Course Catalogue",
    subtitle: "Course cards, instructors, descriptions and enrollment buttons, from reusable components",
    estimatedMinutes: 50,
    intro: "The Module 2 practical: a course catalogue designed as a component tree, with the data kept separate and every repeated piece written once.",

    atoms: [
      {
        id: "a-rx-m2-project",
        title: "Build the course catalogue",
        explain:
          "Plan the tree before you type: App → CatalogLayout (title and children) → CourseCard for each course → InstructorBadge and EnrollButton inside each card. Data comes from src/data/courses.js and flows down as props; no component below App knows where it came from.",
        webLab: reactLab({
          task:
            "Build the catalogue. src/components/ needs four components, each the default export of its own file: CatalogLayout (title, children: a <main> with an <h1> then the children inside <div className=\"catalog\">), CourseCard (course: an <article className=\"course-card\"> with an <h2> title, the level in <span className=\"level\">, the description in a <p>, an InstructorBadge and an EnrollButton), InstructorBadge (name: <p className=\"instructor\">Instructor: NAME</p>) and EnrollButton (courseTitle: a <button type=\"button\"> that says \"Enroll\" with aria-label \"Enroll in COURSE TITLE\"). App renders CatalogLayout titled \"Course catalogue\" with a CourseCard per course.",
          files: {
            "src/App.jsx": `import { courses } from "./data/courses.js";

export default function App() {
  return <h1>Course catalogue</h1>;
}
`,
            "src/components/CatalogLayout.jsx": "",
            "src/components/CourseCard.jsx": "",
            "src/components/InstructorBadge.jsx": "",
            "src/components/EnrollButton.jsx": "",
            "src/data/courses.js": COURSES_DATA,
          },
          readOnly: ["src/data/courses.js"],
          revealSolution: false,
          tests: [
            { label: "A main with the h1 and a .catalog of four cards", check: "return text('main > h1') === 'Course catalogue' && $$('main .catalog > article.course-card').length === 4;", fail: "CatalogLayout renders <main><h1>{title}</h1><div className=\"catalog\">{children}</div></main>." },
            { label: "Each card: title, level and description", check: "const c = $$('.course-card')[2]; return !!c && text(c.querySelector('h2')) === 'React' && text(c.querySelector('.level')) === 'Intermediate' && text(c.querySelector('p:not(.instructor)')) === 'Build modern interfaces from components.';", fail: "CourseCard shows course.title in an h2, course.level in span.level and course.description in a p." },
            { label: "Each card names its instructor", check: "return $$('.course-card .instructor').map((p) => text(p)).join('|') === 'Instructor: Ngozi Eze|Instructor: Tunde Bello|Instructor: Ada Obi|Instructor: Musa Ali';", fail: "InstructorBadge renders <p className=\"instructor\">Instructor: {name}</p>." },
            { label: "Each Enroll button names its course for screen readers", check: "const b = $$('.course-card button'); return b.length === 4 && b.every((x) => text(x) === 'Enroll' && x.type === 'button') && nameOf(b[1]) === 'Enroll in JavaScript';", fail: "aria-label={\"Enroll in \" + courseTitle}" },
            { label: "Four components, each in its own file", check: "return ['CatalogLayout', 'CourseCard', 'InstructorBadge', 'EnrollButton'].every((n) => new RegExp('export\\\\s+default\\\\s+function\\\\s+' + n + '\\\\b').test(code('src/components/' + n + '.jsx')));", fail: "export default function Name() in src/components/Name.jsx." },
            { label: "The cards are built from the data, with keys", check: "return /courses\\.map/.test(code('src/App.jsx')) && !/unique \"key\"/.test(output()) && !/Tunde|Ngozi/.test(code('src/components/CourseCard.jsx'));", fail: "Map over courses in App, with key={course.id}; keep data out of the components." },
          ],
          solution: {
            "src/App.jsx": `import { courses } from "./data/courses.js";
import CatalogLayout from "./components/CatalogLayout.jsx";
import CourseCard from "./components/CourseCard.jsx";

export default function App() {
  return (
    <CatalogLayout title="Course catalogue">
      {courses.map((course) => (
        <CourseCard key={course.id} course={course} />
      ))}
    </CatalogLayout>
  );
}
`,
            "src/components/CatalogLayout.jsx": `export default function CatalogLayout({ title, children }) {
  return (
    <main>
      <h1>{title}</h1>
      <div className="catalog">{children}</div>
    </main>
  );
}
`,
            "src/components/CourseCard.jsx": `import InstructorBadge from "./InstructorBadge.jsx";
import EnrollButton from "./EnrollButton.jsx";

export default function CourseCard({ course }) {
  return (
    <article className="course-card">
      <h2>{course.title}</h2>
      <span className="level">{course.level}</span>
      <p>{course.description}</p>
      <InstructorBadge name={course.instructor} />
      <EnrollButton courseTitle={course.title} />
    </article>
  );
}
`,
            "src/components/InstructorBadge.jsx": `export default function InstructorBadge({ name }) {
  return <p className="instructor">Instructor: {name}</p>;
}
`,
            "src/components/EnrollButton.jsx": `export default function EnrollButton({ courseTitle }) {
  return (
    <button type="button" aria-label={"Enroll in " + courseTitle}>
      Enroll
    </button>
  );
}
`,
          },
          hint: "Write the leaf components first (InstructorBadge, EnrollButton), then CourseCard, then the layout, then App.",
          successMessage: "A component tree, data flowing down through props. Module 3 makes it interactive.",
        }),
      },
    ],
    task: {
      title: "Module 2 practical: your own catalogue",
      intro: "Build the catalogue in your own Vite project, then extend it.",
      prompts: [
        "Draw the component tree on paper first, with each component's props written next to it.",
        "Put each component in src/components/ and the data in src/data/.",
        "Add a variant prop to CourseCard (\"featured\" or default) that changes its design, and use it on one course.",
        "Add a reusable PageHeader and NavBar from Lesson 16 above the catalogue.",
        "Mastery checkpoint: explain your component tree to someone, and trace one piece of data (an instructor's name) from courses.js to the screen, naming every component it passes through.",
      ],
      closing: "Next: Module 3, where the catalogue responds to the user.",
    },
    requirements: { read: true, video: false, assessment: true },
  },
];
