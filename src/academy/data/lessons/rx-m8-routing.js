/**
 * REACT DEVELOPMENT · MODULE 8 · ROUTING AND MULTI-PAGE APPLICATION STRUCTURE
 *
 * Curriculum 8.1 – 8.P. Client-side routing with React Router v7 (imported
 * from "react-router"): routes and pages, links and NavLink, dynamic
 * parameters, search parameters, nested routes with layouts, detail pages,
 * not-found routes, protected sections, URL-based filtering and pagination,
 * and navigating after a form is submitted.
 *
 * A sandboxed practice page has no real address, so the lab runtime backs
 * BrowserRouter with an in-memory history. The code is exactly what you
 * write in a real project, the preview's address bar shows the current path,
 * and checks can start the app at any URL.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

import { reactLab } from "./rx-helpers.js";

export const SECTION_ID = "rx-s8-routing";
const MODULE = "rx-m8-routing";

const COURSES = `export const courses = [
  { id: "html", title: "HTML & CSS", level: "Beginner", weeks: 4 },
  { id: "js", title: "JavaScript", level: "Beginner", weeks: 6 },
  { id: "react", title: "React", level: "Intermediate", weeks: 16 },
  { id: "ts", title: "TypeScript", level: "Intermediate", weeks: 3 },
  { id: "node", title: "Node.js", level: "Intermediate", weeks: 8 },
  { id: "testing", title: "Testing", level: "Advanced", weeks: 2 },
  { id: "a11y", title: "Accessibility", level: "Beginner", weeks: 2 },
];

export const findCourse = (id) => courses.find((c) => c.id === id);
`;

const ROUTER_CSS = `:root { font-family: system-ui, Arial, sans-serif; color: #1f2937; }
body { margin: 0; padding: 16px; }
nav { display: flex; gap: 16px; margin-bottom: 16px; }
nav a.active { font-weight: 700; text-decoration: underline; }
button { min-height: 44px; padding: 8px 14px; font: inherit; }
`;

const lab = (spec) => reactLab({ css: ROUTER_CSS, ...spec });

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 47 · 8.1 – 8.3
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "rx-l47-router-setup",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 1,
    covers: ["8.1", "8.2", "8.3"],
    title: "Client-Side Routing with React Router",
    subtitle: "Why SPAs need routing, installing and configuring React Router, and routes with page components",
    estimatedMinutes: 35,
    intro: "A single-page app still needs pages: addresses people can bookmark, share and go back to. Routing maps URLs to components without ever reloading the page.",

    atoms: [
      {
        id: "a-rx-why-routing",
        title: "Why client-side routing is needed",
        explain:
          "Without routing, an SPA has one URL. Refreshing loses your place, the Back button leaves the app, you cannot share a link to a course, and search engines see one page. CLIENT-SIDE ROUTING keeps the URL in sync with what is shown: clicking a link updates the address with the History API and swaps the component, with no request to the server for a new HTML page. Visiting /courses/react directly (or refreshing it) loads the app, which reads the URL and shows the right page. That last part needs the host to send index.html for every path, a REWRITE (Module 15).",
        decision: {
          scenario: "A learner bookmarks the React course page in your SPA, which has no routing. The URL is just https://academy.example/.",
          question: "What happens when they open the bookmark tomorrow?",
          options: [
            { id: "a", text: "They land on the home screen, not the course: the URL never said which page they were on", why: "Without routing, what is shown is not reflected in the URL, so it cannot be bookmarked, shared or restored." },
            { id: "b", text: "They see the React course", whyWrong: "Nothing recorded which course was open." },
            { id: "c", text: "The browser remembers the component", whyWrong: "Browsers remember URLs, not React state." },
            { id: "d", text: "An error page", whyWrong: "The app loads; it just starts at its default screen." },
          ],
          correct: "a",
          aftermath: "Routing makes every screen an address.",
        },
      },
      {
        id: "a-rx-router-install",
        title: "Installing and configuring React Router",
        explain:
          "npm install react-router (version 7; the old react-router-dom package now just re-exports it). Wrap the app in <BrowserRouter> once, usually in main.jsx or at the top of App, so every component below can use routing. Inside, <Routes> holds a list of <Route path=\"…\" element={<Page />} />; for each URL React Router renders the element of the best-matching route. React Router v7 can also run as a full framework with data loading and server rendering; this course uses it as a library, which is how most existing SPAs use it.",
        example: "npm install react-router",
        webLab: lab({
          task:
            "Set up routing in App.jsx: wrap everything in <BrowserRouter>, and inside a <Routes> define \"/\" rendering <h1>Home</h1> and \"/about\" rendering <h1>About us</h1>. Keep the <nav> outside <Routes> so it shows on every page, and make its two links <Link>s to those paths.",
          files: {
            "src/App.jsx": `export default function App() {
  return (
    <>
      <nav>
        <a href="/">Home</a>
        <a href="/about">About</a>
      </nav>
      <h1>Home</h1>
    </>
  );
}
`,
          },
          tests: [
            { label: "\"/\" shows Home", check: "return text('h1') === 'Home' && path() === '/';", fail: "<Route path=\"/\" element={<h1>Home</h1>} />" },
            { label: "Clicking About goes to /about without a reload", check: "await click($$('nav a')[1]); await waitFor(() => text('h1') === 'About us'); return path() === '/about';", fail: "Use <Link to=\"/about\"> and a route for /about." },
            { label: "Opening /about directly shows About", path: "/about", check: "return text('h1') === 'About us' && $$('nav a').length === 2;", fail: "The nav stays outside <Routes>." },
            { label: "Built with BrowserRouter, Routes and Link", check: "const c = code('src/App.jsx'); return /<BrowserRouter>/.test(c) && /<Routes>/.test(c) && /<Link\\s+to=/.test(c) && /from\\s+[\"']react-router(-dom)?[\"']/.test(c);", fail: "import { BrowserRouter, Routes, Route, Link } from \"react-router\";" },
          ],
          solution: {
            "src/App.jsx": `import { BrowserRouter, Routes, Route, Link } from "react-router";

export default function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
      </nav>
      <Routes>
        <Route path="/" element={<h1>Home</h1>} />
        <Route path="/about" element={<h1>About us</h1>} />
      </Routes>
    </BrowserRouter>
  );
}
`,
          },
          hint: "A plain <a> reloads the page; <Link> changes the URL inside the app.",
          successMessage: "Two URLs, one page load. Watch the address bar above the preview.",
        }),
      },
      {
        id: "a-rx-routes-pages",
        title: "Defining routes and page components",
        explain:
          "Each screen is a PAGE COMPONENT in src/pages/ (HomePage.jsx, CoursesPage.jsx, ProfilePage.jsx). Pages are ordinary components that compose feature and UI components; the route table in App connects URLs to them. Keep the route table in one place so anyone can read the app's whole map at a glance. Route order does not matter: React Router picks the most specific match, so /courses/new beats /courses/:id.",
        webLab: lab({
          task:
            "Create three page components, each the default export of its own file in src/pages/: HomePage (<h1>Welcome to Memora</h1>), CoursesPage (<h1>All courses</h1>) and ProfilePage (<h1>Your profile</h1>). Route them at \"/\", \"/courses\" and \"/profile\" in App.",
          files: {
            "src/App.jsx": `import { BrowserRouter, Routes, Route, Link } from "react-router";

export default function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/courses">Courses</Link>
        <Link to="/profile">Profile</Link>
      </nav>
      <Routes>{/* routes here */}</Routes>
    </BrowserRouter>
  );
}
`,
            "src/pages/HomePage.jsx": "",
            "src/pages/CoursesPage.jsx": "",
            "src/pages/ProfilePage.jsx": "",
          },
          tests: [
            { label: "Each URL shows its page", check: "const ok1 = text('h1') === 'Welcome to Memora'; await click($$('nav a')[1]); await waitFor(() => text('h1') === 'All courses'); await click($$('nav a')[2]); await waitFor(() => text('h1') === 'Your profile'); return ok1 && path() === '/profile';", fail: "Three <Route>s, one per page." },
            { label: "Each page is its own file's default export", check: "return [['HomePage', 'Welcome'], ['CoursesPage', 'All courses'], ['ProfilePage', 'Your profile']].every(([n]) => new RegExp('export\\\\s+default\\\\s+function\\\\s+' + n + '\\\\b').test(code('src/pages/' + n + '.jsx')));", fail: "export default function HomePage() in src/pages/HomePage.jsx, and so on." },
            { label: "App imports the pages", check: "const c = code('src/App.jsx'); return ['HomePage', 'CoursesPage', 'ProfilePage'].every((n) => new RegExp('import\\\\s+' + n + '\\\\s+from\\\\s+[\"\\']\\\\./pages/' + n).test(c));", fail: "import HomePage from \"./pages/HomePage.jsx\";" },
          ],
          solution: {
            "src/pages/HomePage.jsx": `export default function HomePage() {
  return <h1>Welcome to Memora</h1>;
}
`,
            "src/pages/CoursesPage.jsx": `export default function CoursesPage() {
  return <h1>All courses</h1>;
}
`,
            "src/pages/ProfilePage.jsx": `export default function ProfilePage() {
  return <h1>Your profile</h1>;
}
`,
            "src/App.jsx": `import { BrowserRouter, Routes, Route, Link } from "react-router";
import HomePage from "./pages/HomePage.jsx";
import CoursesPage from "./pages/CoursesPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/courses">Courses</Link>
        <Link to="/profile">Profile</Link>
      </nav>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/courses" element={<CoursesPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </BrowserRouter>
  );
}
`,
          },
          hint: "element takes JSX: element={<HomePage />}, not element={HomePage}.",
          successMessage: "A route table you can read in one glance, with each page in its own file.",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 48 · 8.4 – 8.6
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "rx-l48-links-params",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 2,
    covers: ["8.4", "8.5", "8.6"],
    title: "Links, Parameters and Search Params",
    subtitle: "Active navigation, dynamic route segments and the query string",
    estimatedMinutes: 40,
    intro: "Real URLs carry information: which course, which page of results, which filter. React Router hands each part to your components.",

    atoms: [
      {
        id: "a-rx-navlink",
        title: "Navigation with links and active navigation states",
        explain:
          "<Link to=\"/courses\"> navigates without reloading. <NavLink> is a Link that knows whether it is ACTIVE (its path matches the current URL): it adds the class \"active\" and aria-current=\"page\" automatically, so you can style the current section and screen readers announce it. className and style can also be functions: className={({ isActive }) => (isActive ? \"tab tab-on\" : \"tab\")}. The end prop makes \"/\" active only on exactly \"/\", not on every page below it.",
        webLab: lab({
          task:
            "Replace the plain links with NavLinks so the current section is marked active. \"/\" (Home) must be active ONLY on the home page, not on /courses, so give it the end prop.",
          files: {
            "src/App.jsx": `import { BrowserRouter, Routes, Route, Link } from "react-router";

export default function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/courses">Courses</Link>
        <Link to="/profile">Profile</Link>
      </nav>
      <Routes>
        <Route path="/" element={<h1>Home</h1>} />
        <Route path="/courses" element={<h1>Courses</h1>} />
        <Route path="/profile" element={<h1>Profile</h1>} />
      </Routes>
    </BrowserRouter>
  );
}
`,
          },
          tests: [
            { label: "On /, only Home is active", check: "const a = $$('nav a'); return a[0].classList.contains('active') && a[0].getAttribute('aria-current') === 'page' && !a[1].classList.contains('active');", fail: "Use <NavLink>." },
            { label: "On /courses, only Courses is active", path: "/courses", check: "const a = $$('nav a'); return a[1].getAttribute('aria-current') === 'page' && !a[0].classList.contains('active') && !a[2].classList.contains('active');", fail: "Add end to the Home NavLink so it is not active on every page." },
          ],
          solution: {
            "src/App.jsx": `import { BrowserRouter, Routes, Route, NavLink } from "react-router";

export default function App() {
  return (
    <BrowserRouter>
      <nav>
        <NavLink to="/" end>
          Home
        </NavLink>
        <NavLink to="/courses">Courses</NavLink>
        <NavLink to="/profile">Profile</NavLink>
      </nav>
      <Routes>
        <Route path="/" element={<h1>Home</h1>} />
        <Route path="/courses" element={<h1>Courses</h1>} />
        <Route path="/profile" element={<h1>Profile</h1>} />
      </Routes>
    </BrowserRouter>
  );
}
`,
          },
          hint: "<NavLink to=\"/\" end>",
          successMessage: "Active state for free, styled by CSS and announced to screen readers.",
        }),
      },
      {
        id: "a-rx-route-params",
        title: "Dynamic route parameters",
        explain:
          "A segment starting with a colon is a PARAMETER: <Route path=\"/courses/:courseId\" element={<CoursePage />} /> matches /courses/react, /courses/ts and so on. Inside, const { courseId } = useParams() gives \"react\". Parameters are always strings. One route and one component serve every course; the component uses the parameter to find or fetch the right data. Build links to them with template strings or concatenation: <Link to={\"/courses/\" + course.id}>.",
        webLab: lab({
          task:
            "Add a route /courses/:courseId rendering CoursePage. CoursePage reads courseId with useParams, finds the course with findCourse, and shows its title in an <h1> and \"LEVEL · N weeks\" in a <p>. On /courses, each course in the list must link to its page.",
          files: {
            "src/App.jsx": `import { BrowserRouter, Routes, Route, Link, useParams } from "react-router";
import { courses, findCourse } from "./data.js";

function CourseList() {
  return (
    <ul>
      {courses.map((c) => (
        <li key={c.id}>{c.title}</li>
      ))}
    </ul>
  );
}

function CoursePage() {
  return <h1>Course</h1>;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/courses" element={<CourseList />} />
      </Routes>
    </BrowserRouter>
  );
}
`,
            "src/data.js": COURSES,
          },
          readOnly: ["src/data.js"],
          path: "/courses",
          tests: [
            { label: "Each course links to its own URL", check: "const a = $$('li a'); return a.length === 7 && a[2].getAttribute('href') === '/courses/react';", fail: "<Link to={\"/courses/\" + c.id}>{c.title}</Link>" },
            { label: "Clicking a course opens its page", check: "await click($$('li a')[2]); await waitFor(() => text('h1') === 'React'); return path() === '/courses/react' && text('main p, p') === 'Intermediate · 16 weeks';", fail: "const { courseId } = useParams(); const course = findCourse(courseId);" },
            { label: "Any course URL works directly", path: "/courses/ts", check: "return text('h1') === 'TypeScript' && text('p') === 'Intermediate · 3 weeks';", fail: "<Route path=\"/courses/:courseId\" element={<CoursePage />} />" },
          ],
          solution: {
            "src/App.jsx": `import { BrowserRouter, Routes, Route, Link, useParams } from "react-router";
import { courses, findCourse } from "./data.js";

function CourseList() {
  return (
    <ul>
      {courses.map((c) => (
        <li key={c.id}>
          <Link to={"/courses/" + c.id}>{c.title}</Link>
        </li>
      ))}
    </ul>
  );
}

function CoursePage() {
  const { courseId } = useParams();
  const course = findCourse(courseId);
  return (
    <>
      <h1>{course.title}</h1>
      <p>
        {course.level} · {course.weeks} weeks
      </p>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/courses" element={<CourseList />} />
        <Route path="/courses/:courseId" element={<CoursePage />} />
      </Routes>
    </BrowserRouter>
  );
}
`,
          },
          hint: "The name after the colon is the name useParams gives you.",
          successMessage: "One route, one component, every course. (What if the id does not exist? Next lesson.)",
        }),
      },
      {
        id: "a-rx-search-params",
        title: "Query strings and URL search parameters",
        explain:
          "The QUERY STRING is the part after ?: /courses?level=Beginner&sort=weeks. It is for optional view settings (filters, sorting, a search term, a page number) rather than for which resource is shown. const [searchParams, setSearchParams] = useSearchParams(); searchParams.get(\"level\") reads one (null if missing); setSearchParams({ level: \"Beginner\" }) changes the URL, which re-renders the component. Because the filter lives in the URL, it survives a refresh and can be shared, and the Back button undoes it. The URL becomes the state, so there is no useState for it.",
        webLab: lab({
          task:
            "Make the level filter live in the URL. The select reads its value from the \"level\" search param (empty means all levels) and, when changed, sets ?level=VALUE (or removes the param for \"All\"). The list shows only courses at that level. Do not use useState.",
          files: {
            "src/App.jsx": `import { BrowserRouter, Routes, Route, useSearchParams } from "react-router";
import { courses } from "./data.js";

function CoursesPage() {
  const level = "";
  const visible = courses;
  return (
    <>
      <label htmlFor="level">Level</label>
      <select id="level" value={level}>
        <option value="">All</option>
        <option value="Beginner">Beginner</option>
        <option value="Intermediate">Intermediate</option>
        <option value="Advanced">Advanced</option>
      </select>
      <ul>
        {visible.map((c) => (
          <li key={c.id}>{c.title}</li>
        ))}
      </ul>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/courses" element={<CoursesPage />} />
      </Routes>
    </BrowserRouter>
  );
}
`,
            "src/data.js": COURSES,
          },
          readOnly: ["src/data.js"],
          path: "/courses",
          tests: [
            { label: "Choosing a level updates the URL and the list", check: "await type('#level', 'Advanced'); await waitFor(() => path() === '/courses?level=Advanced'); return $$('li').map((li) => text(li)).join() === 'Testing';", fail: "setSearchParams({ level: e.target.value })" },
            { label: "A shared link opens filtered", path: "/courses?level=Beginner", check: "return $('#level').value === 'Beginner' && $$('li').map((li) => text(li)).join() === 'HTML & CSS,JavaScript,Accessibility';", fail: "const level = searchParams.get(\"level\") ?? \"\";" },
            { label: "All removes the parameter", path: "/courses?level=Beginner", check: "await type('#level', ''); await waitFor(() => path() === '/courses'); return $$('li').length === 7;", fail: "For \"\", call setSearchParams({})." },
            { label: "No useState: the URL is the state", check: "return !/useState/.test(code('src/App.jsx')) && /useSearchParams\\(\\)/.test(code('src/App.jsx'));", fail: "Read and write the filter with useSearchParams." },
          ],
          solution: {
            "src/App.jsx": `import { BrowserRouter, Routes, Route, useSearchParams } from "react-router";
import { courses } from "./data.js";

function CoursesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const level = searchParams.get("level") ?? "";
  const visible = level ? courses.filter((c) => c.level === level) : courses;

  function handleChange(e) {
    setSearchParams(e.target.value ? { level: e.target.value } : {});
  }

  return (
    <>
      <label htmlFor="level">Level</label>
      <select id="level" value={level} onChange={handleChange}>
        <option value="">All</option>
        <option value="Beginner">Beginner</option>
        <option value="Intermediate">Intermediate</option>
        <option value="Advanced">Advanced</option>
      </select>
      <ul>
        {visible.map((c) => (
          <li key={c.id}>{c.title}</li>
        ))}
      </ul>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/courses" element={<CoursesPage />} />
      </Routes>
    </BrowserRouter>
  );
}
`,
          },
          hint: "searchParams.get returns null when the parameter is missing.",
          successMessage: "A filter you can bookmark, share, refresh and undo with Back.",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 49 · 8.7 – 8.9
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "rx-l49-nested",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 3,
    covers: ["8.7", "8.8", "8.9"],
    title: "Nested Routes, Detail Pages and Not Found",
    subtitle: "Shared layouts with Outlet, robust detail pages, and fallback routes",
    estimatedMinutes: 40,
    intro: "Real apps share layouts between pages, show details for things that may not exist, and must handle URLs nobody planned for.",

    atoms: [
      {
        id: "a-rx-nested-layouts",
        title: "Nested routes and shared layouts",
        explain:
          "Routes can nest: <Route element={<AppLayout />}> with child routes inside renders AppLayout for all of them, and AppLayout puts the matched child where it renders <Outlet />. That is how a header, navigation and footer are written once and wrap every page. A parent route with a path (path=\"dashboard\") prefixes its children (\"dashboard/settings\"); a child with index (no path) renders at the parent's own URL. A route with an element but no path is a LAYOUT ROUTE: it only wraps.",
        webLab: lab({
          task:
            "Create AppLayout (a <header> with the NavLinks, then <main> containing an <Outlet />, then a <footer> \"© Memora\") and nest the routes inside a layout route that uses it: the index route shows <h1>Home</h1>, \"courses\" shows <h1>Courses</h1>, \"profile\" shows <h1>Profile</h1>. Every page must have the same header and footer, with its own heading inside <main>.",
          files: {
            "src/App.jsx": `import { BrowserRouter, Routes, Route, NavLink, Outlet } from "react-router";

function AppLayout() {
  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<h1>Home</h1>} />
        <Route path="/courses" element={<h1>Courses</h1>} />
        <Route path="/profile" element={<h1>Profile</h1>} />
      </Routes>
    </BrowserRouter>
  );
}
`,
          },
          tests: [
            { label: "Home renders inside the layout", check: "return !!$('header nav') && text('main h1') === 'Home' && text('footer') === '© Memora';", fail: "AppLayout renders header, <main><Outlet /></main>, footer." },
            { label: "Other pages share it", path: "/profile", check: "return text('main h1') === 'Profile' && !!$('header nav') && text('footer') === '© Memora';", fail: "Nest every route inside <Route element={<AppLayout />}>." },
            { label: "Navigation swaps only the outlet", check: "const header = $('header'); await click($$('header a')[1]); await waitFor(() => text('main h1') === 'Courses'); return $('header') === header && path() === '/courses';", fail: "The header stays mounted; only the outlet changes." },
            { label: "An index route and an Outlet are used", check: "const c = code('src/App.jsx'); return /<Outlet\\s*\\/>/.test(c) && /<Route\\s+index\\b/.test(c);", fail: "<Route index element={<h1>Home</h1>} />" },
          ],
          solution: {
            "src/App.jsx": `import { BrowserRouter, Routes, Route, NavLink, Outlet } from "react-router";

function AppLayout() {
  return (
    <>
      <header>
        <nav>
          <NavLink to="/" end>Home</NavLink>
          <NavLink to="/courses">Courses</NavLink>
          <NavLink to="/profile">Profile</NavLink>
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
      <footer>© Memora</footer>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<h1>Home</h1>} />
          <Route path="courses" element={<h1>Courses</h1>} />
          <Route path="profile" element={<h1>Profile</h1>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
`,
          },
          hint: "The layout route has element but no path; children use paths without a leading slash.",
          successMessage: "One layout, every page, and the header never re-mounts as you navigate.",
        }),
      },
      {
        id: "a-rx-detail-pages",
        title: "Route parameters and detail pages",
        explain:
          "A detail page must handle the parameter not matching anything: someone edits the URL, follows an old link, or the item was deleted. If find returns undefined, show a useful \"not found\" message with a link back, instead of crashing on course.title. Detail pages often nest under their list (courses/:courseId inside courses) and link onward to related items, and they use the parameter as the key when they fetch, so switching between two details refetches correctly.",
        webLab: lab({
          task:
            "Make CoursePage robust. When the course exists, show its <h1> and a link \"← All courses\" to /courses. When it does not, show <h1>Course not found</h1>, the text \"No course with id ID.\" in a <p>, and the same link back. The page currently crashes for unknown ids.",
          files: {
            "src/App.jsx": `import { BrowserRouter, Routes, Route, Link, useParams } from "react-router";
import { courses, findCourse } from "./data.js";

function CoursePage() {
  const { courseId } = useParams();
  const course = findCourse(courseId);
  return <h1>{course.title}</h1>;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/courses" element={<h1>All courses</h1>} />
        <Route path="/courses/:courseId" element={<CoursePage />} />
      </Routes>
    </BrowserRouter>
  );
}
`,
            "src/data.js": COURSES,
          },
          readOnly: ["src/data.js"],
          tests: [
            { label: "A real course shows with a link back", path: "/courses/node", check: "const a = $$('a').find((x) => text(x) === '← All courses'); return text('h1') === 'Node.js' && !!a && a.getAttribute('href') === '/courses';", fail: "Add <Link to=\"/courses\">← All courses</Link>." },
            { label: "An unknown id shows a not-found message", path: "/courses/cobol", check: "return text('h1') === 'Course not found' && text('p') === 'No course with id cobol.' && errors().length === 0;", fail: "if (!course) return …" },
            { label: "The link back works", path: "/courses/cobol", check: "await click($$('a').find((x) => text(x) === '← All courses')); await waitFor(() => text('h1') === 'All courses'); return path() === '/courses';", fail: "The link goes to /courses." },
          ],
          solution: {
            "src/App.jsx": `import { BrowserRouter, Routes, Route, Link, useParams } from "react-router";
import { courses, findCourse } from "./data.js";

function CoursePage() {
  const { courseId } = useParams();
  const course = findCourse(courseId);
  const back = <Link to="/courses">← All courses</Link>;

  if (!course) {
    return (
      <>
        <h1>Course not found</h1>
        <p>No course with id {courseId}.</p>
        {back}
      </>
    );
  }
  return (
    <>
      <h1>{course.title}</h1>
      {back}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/courses" element={<h1>All courses</h1>} />
        <Route path="/courses/:courseId" element={<CoursePage />} />
      </Routes>
    </BrowserRouter>
  );
}
`,
          },
          hint: "Check for undefined before using any property of course.",
          successMessage: "Edited URLs and stale links now get a helpful page, not a crash.",
        }),
      },
      {
        id: "a-rx-not-found",
        title: "Not-found pages and fallback routes",
        explain:
          "path=\"*\" matches any URL that no other route matches, so <Route path=\"*\" element={<NotFoundPage />} /> is the app's 404 page. Put it inside the layout route so the 404 still has the site's header and navigation. Make it helpful: say the page does not exist, link to the home page and the main sections, and maybe offer search. Note that a client-side 404 still returns HTTP 200 from the server; for search engines, server rendering or host configuration is needed.",
        webLab: lab({
          task:
            "Add a catch-all route inside the layout that renders NotFoundPage: an <h1> \"Page not found\", a <p> naming the path the user tried (\"Nothing lives at /PATH.\", using useLocation().pathname), and a link \"Go home\" to \"/\".",
          files: {
            "src/App.jsx": `import { BrowserRouter, Routes, Route, Link, Outlet, useLocation } from "react-router";

function Layout() {
  return (
    <>
      <header>Memora Academy</header>
      <main>
        <Outlet />
      </main>
    </>
  );
}

function NotFoundPage() {
  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<h1>Home</h1>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
`,
          },
          tests: [
            { label: "An unknown URL shows the not-found page in the layout", path: "/pricing/old", check: "return text('main h1') === 'Page not found' && text('header') === 'Memora Academy';", fail: "<Route path=\"*\" element={<NotFoundPage />} /> inside the layout route." },
            { label: "It names the missing path", path: "/pricing/old", check: "return text('main p') === 'Nothing lives at /pricing/old.';", fail: "const { pathname } = useLocation();" },
            { label: "Go home goes home", path: "/nope", check: "await click($$('a').find((a) => text(a) === 'Go home')); await waitFor(() => text('main h1') === 'Home'); return path() === '/';", fail: "<Link to=\"/\">Go home</Link>" },
          ],
          solution: {
            "src/App.jsx": `import { BrowserRouter, Routes, Route, Link, Outlet, useLocation } from "react-router";

function Layout() {
  return (
    <>
      <header>Memora Academy</header>
      <main>
        <Outlet />
      </main>
    </>
  );
}

function NotFoundPage() {
  const { pathname } = useLocation();
  return (
    <>
      <h1>Page not found</h1>
      <p>Nothing lives at {pathname}.</p>
      <Link to="/">Go home</Link>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<h1>Home</h1>} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
`,
          },
          hint: "useLocation() returns the current location, including pathname.",
          successMessage: "Every URL now leads somewhere useful.",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 50 · 8.10 – 8.13
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "rx-l50-protected",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 4,
    covers: ["8.10", "8.11", "8.12", "8.13"],
    title: "Protected Sections and Navigation Flows",
    subtitle: "Authentication-aware layouts, URL-based pagination, navigating after submit, and app structure",
    estimatedMinutes: 45,
    intro: "The last pieces of a real app's navigation: pages only signed-in users see, lists that page through the URL, forms that take you somewhere when they succeed, and a clear split between public and private.",

    atoms: [
      {
        id: "a-rx-protected-routes",
        title: "Protected layouts and authentication-aware navigation",
        explain:
          "A PROTECTED LAYOUT is a layout route that checks the user before rendering its children: if there is no user, it returns <Navigate to=\"/login\" replace state={{ from: location }} /> instead of the <Outlet />. replace means the protected URL is not left in the history, so Back does not bounce into a redirect loop; state.from remembers where they were going, so the login page can send them there afterwards. Remember (Module 12): this only controls what the UI shows. The server must still refuse data to anyone not signed in.",
        webLab: lab({
          task:
            "Write RequireAuth: if user is null, redirect to /login (replace, with state { from: location }); otherwise render the <Outlet />. Wrap the dashboard route with it. The login page's button calls signIn and must then navigate to the page the user originally wanted (location.state?.from?.pathname, or /dashboard).",
          files: {
            "src/App.jsx": `import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, Outlet, useLocation, useNavigate } from "react-router";

function RequireAuth({ user }) {
  return <Outlet />;
}

function LoginPage({ onSignIn }) {
  const location = useLocation();
  const navigate = useNavigate();
  return (
    <>
      <h1>Sign in</h1>
      <button onClick={() => onSignIn()}>Sign in as Ada</button>
    </>
  );
}

export default function App() {
  const [user, setUser] = useState(null);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<h1>Home</h1>} />
        <Route path="/login" element={<LoginPage onSignIn={() => setUser({ name: "Ada" })} />} />
        <Route path="/dashboard" element={<h1>Dashboard</h1>} />
        <Route path="/settings" element={<h1>Settings</h1>} />
      </Routes>
    </BrowserRouter>
  );
}
`,
          },
          tests: [
            { label: "Signed out, /settings redirects to /login", path: "/settings", check: "return await waitFor(() => path() === '/login' && text('h1') === 'Sign in');", fail: "if (!user) return <Navigate to=\"/login\" replace state={{ from: location }} />;" },
            { label: "Signing in returns to the page they wanted", path: "/settings", check: "await waitFor(() => text('h1') === 'Sign in'); await click('button'); return await waitFor(() => path() === '/settings' && text('h1') === 'Settings');", fail: "navigate(location.state?.from?.pathname ?? \"/dashboard\", { replace: true })" },
            { label: "Public pages stay public", check: "return text('h1') === 'Home' && path() === '/';", fail: "Only the private routes go inside RequireAuth." },
            { label: "Both private routes are inside one protected layout", check: "return /<Route\\s+element=\\{\\s*<RequireAuth/.test(code('src/App.jsx')) && /<Navigate[^>]*replace/.test(code('src/App.jsx'));", fail: "<Route element={<RequireAuth user={user} />}> around dashboard and settings." },
          ],
          solution: {
            "src/App.jsx": `import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, Outlet, useLocation, useNavigate } from "react-router";

function RequireAuth({ user }) {
  const location = useLocation();
  if (!user) return <Navigate to="/login" replace state={{ from: location }} />;
  return <Outlet />;
}

function LoginPage({ onSignIn }) {
  const location = useLocation();
  const navigate = useNavigate();
  function signIn() {
    onSignIn();
    navigate(location.state?.from?.pathname ?? "/dashboard", { replace: true });
  }
  return (
    <>
      <h1>Sign in</h1>
      <button onClick={signIn}>Sign in as Ada</button>
    </>
  );
}

export default function App() {
  const [user, setUser] = useState(null);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<h1>Home</h1>} />
        <Route path="/login" element={<LoginPage onSignIn={() => setUser({ name: "Ada" })} />} />
        <Route element={<RequireAuth user={user} />}>
          <Route path="/dashboard" element={<h1>Dashboard</h1>} />
          <Route path="/settings" element={<h1>Settings</h1>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
`,
          },
          hint: "Navigate is a component; useNavigate gives you a function for use in handlers.",
          successMessage: "Private pages guarded in one place, and users land where they meant to go.",
        }),
      },
      {
        id: "a-rx-url-pagination",
        title: "URL-based filtering and pagination",
        explain:
          "Put the page number in the URL, as ?page=2, alongside any filters, so a page of results can be linked, refreshed and navigated with Back. Read it with Number(searchParams.get(\"page\")) || 1, slice the data for that page (or pass page and pageSize to the API), and build Previous and Next as Links that keep the other parameters. Clamp out-of-range values, and reset to page 1 when a filter changes, because page 4 of the old results may not exist in the new ones.",
        webLab: lab({
          task:
            "Paginate the courses 3 per page using ?page=N. Show the page's courses, \"Page N of 3\" in <p className=\"pager\">, and Previous and Next links (Previous is not rendered on page 1, Next not on the last page). An invalid or too-large page shows page 1 or the last page.",
          files: {
            "src/App.jsx": `import { BrowserRouter, Routes, Route, Link, useSearchParams } from "react-router";
import { courses } from "./data.js";

const PAGE_SIZE = 3;

function CoursesPage() {
  const shown = courses;
  return (
    <>
      <ul>
        {shown.map((c) => (
          <li key={c.id}>{c.title}</li>
        ))}
      </ul>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/courses" element={<CoursesPage />} />
      </Routes>
    </BrowserRouter>
  );
}
`,
            "src/data.js": COURSES,
          },
          readOnly: ["src/data.js"],
          path: "/courses",
          tests: [
            { label: "Page 1: three courses and only Next", check: "return $$('li').map((li) => text(li)).join() === 'HTML & CSS,JavaScript,React' && text('.pager') === 'Page 1 of 3' && !$$('a').some((a) => text(a) === 'Previous') && $$('a').some((a) => text(a) === 'Next');", fail: "courses.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)" },
            { label: "Next goes to ?page=2", check: "await click($$('a').find((a) => text(a) === 'Next')); await waitFor(() => path() === '/courses?page=2'); return $$('li').map((li) => text(li)).join() === 'TypeScript,Node.js,Testing' && $$('a').some((a) => text(a) === 'Previous');", fail: "<Link to={\"?page=\" + (page + 1)}>Next</Link>" },
            { label: "The last page has no Next", path: "/courses?page=3", check: "return $$('li').map((li) => text(li)).join() === 'Accessibility' && !$$('a').some((a) => text(a) === 'Next');", fail: "Render Next only when page < pages." },
            { label: "Bad page numbers are clamped", path: "/courses?page=99", check: "return text('.pager') === 'Page 3 of 3';", fail: "Math.min(Math.max(page, 1), pages)" },
          ],
          solution: {
            "src/App.jsx": `import { BrowserRouter, Routes, Route, Link, useSearchParams } from "react-router";
import { courses } from "./data.js";

const PAGE_SIZE = 3;

function CoursesPage() {
  const [searchParams] = useSearchParams();
  const pages = Math.ceil(courses.length / PAGE_SIZE);
  const asked = Number(searchParams.get("page")) || 1;
  const page = Math.min(Math.max(asked, 1), pages);
  const shown = courses.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <>
      <ul>
        {shown.map((c) => (
          <li key={c.id}>{c.title}</li>
        ))}
      </ul>
      <p className="pager">
        Page {page} of {pages}
      </p>
      {page > 1 && <Link to={"?page=" + (page - 1)}>Previous</Link>}
      {page < pages && <Link to={"?page=" + (page + 1)}>Next</Link>}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/courses" element={<CoursesPage />} />
      </Routes>
    </BrowserRouter>
  );
}
`,
          },
          hint: "A Link to \"?page=2\" keeps the current path and changes the query string.",
          successMessage: "Pages you can link to, and no URL that breaks the list.",
        }),
      },
      {
        id: "a-rx-navigate-after-submit",
        title: "Navigation after form submissions",
        explain:
          "After a form succeeds, take the user somewhere sensible: to the thing they created (/courses/new-id), to the list with a success message, or back to where they came from. const navigate = useNavigate(); then, after the save succeeds, navigate(\"/courses/\" + saved.id). Pass { replace: true } when the form should not be reachable with Back (a login page), and { state: { message } } to show a one-off notice on the next page (read with useLocation().state). Only navigate after success: on failure, stay and show the error.",
        webLab: lab({
          task:
            "After a successful POST to /api/courses, navigate to the new course's page, /courses/ID, passing state { message: \"Course created\" }. The CoursePage already reads and shows the message. On failure (non-ok), stay on the form and show <p role=\"alert\">Could not create the course</p>.",
          files: {
            "src/App.jsx": `import { useState } from "react";
import { BrowserRouter, Routes, Route, useLocation, useNavigate, useParams } from "react-router";

function NewCoursePage() {
  const [title, setTitle] = useState("");
  const [error, setError] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    const res = await fetch("/api/courses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });
  }

  return (
    <form onSubmit={handleSubmit}>
      <h1>New course</h1>
      <label htmlFor="title">Title</label>
      <input id="title" value={title} onChange={(e) => setTitle(e.target.value)} />
      <button>Create</button>
      {error && <p role="alert">Could not create the course</p>}
    </form>
  );
}

function CoursePage() {
  const { courseId } = useParams();
  const { state } = useLocation();
  return (
    <>
      {state?.message && <p role="status">{state.message}</p>}
      <h1>Course {courseId}</h1>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/courses/new" element={<NewCoursePage />} />
        <Route path="/courses/:courseId" element={<CoursePage />} />
      </Routes>
    </BrowserRouter>
  );
}
`,
          },
          path: "/courses/new",
          mocks: [{ match: "/api/courses", method: "POST", status: 201, body: { id: "c42", title: "GraphQL" }, delay: 60 }],
          tests: [
            { label: "Success goes to the new course with a message", check: "await type('#title', 'GraphQL'); await submit('form'); await waitFor(() => path() === '/courses/c42'); return text('h1') === 'Course c42' && text('[role=status]') === 'Course created';", fail: "const saved = await res.json(); navigate(\"/courses/\" + saved.id, { state: { message: \"Course created\" } });" },
            { label: "Failure stays on the form with an alert", mocks: [{ match: "/api/courses", method: "POST", status: 500, body: {}, delay: 40 }], check: "await type('#title', 'GraphQL'); await submit('form'); await waitFor(() => !!$('[role=alert]')); return path() === '/courses/new' && $('#title').value === 'GraphQL';", fail: "if (!res.ok) { setError(true); return; }" },
          ],
          solution: {
            "src/App.jsx": `import { useState } from "react";
import { BrowserRouter, Routes, Route, useLocation, useNavigate, useParams } from "react-router";

function NewCoursePage() {
  const [title, setTitle] = useState("");
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError(false);
    const res = await fetch("/api/courses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });
    if (!res.ok) {
      setError(true);
      return;
    }
    const saved = await res.json();
    navigate("/courses/" + saved.id, { state: { message: "Course created" } });
  }

  return (
    <form onSubmit={handleSubmit}>
      <h1>New course</h1>
      <label htmlFor="title">Title</label>
      <input id="title" value={title} onChange={(e) => setTitle(e.target.value)} />
      <button>Create</button>
      {error && <p role="alert">Could not create the course</p>}
    </form>
  );
}

function CoursePage() {
  const { courseId } = useParams();
  const { state } = useLocation();
  return (
    <>
      {state?.message && <p role="status">{state.message}</p>}
      <h1>Course {courseId}</h1>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/courses/new" element={<NewCoursePage />} />
        <Route path="/courses/:courseId" element={<CoursePage />} />
      </Routes>
    </BrowserRouter>
  );
}
`,
          },
          hint: "useNavigate() must be called at the top of the component, then used inside the handler.",
          successMessage: "Success takes you to what you made; failure keeps your work and explains.",
        }),
      },
      {
        id: "a-rx-public-private",
        title: "Organising public and private application sections",
        explain:
          "Split the route table by audience. PUBLIC routes (home, catalogue, course details, login, sign-up) sit in a public layout with the marketing header. PRIVATE routes (dashboard, profile, settings, my courses) sit inside a protected layout with the app's own navigation. Optionally a third group for roles, such as /admin inside a RequireRole layout. Mirror it in folders: src/pages/public/, src/pages/app/. Lazy-load the private section (Module 14) so visitors who never sign in never download it. And the login page should redirect signed-in users onward instead of showing the form again.",
        example: "<Routes>\n  <Route element={<PublicLayout />}>\n    <Route index element={<HomePage />} />\n    <Route path=\"courses\" element={<CatalogPage />} />\n    <Route path=\"courses/:courseId\" element={<CoursePage />} />\n    <Route path=\"login\" element={<LoginPage />} />\n  </Route>\n  <Route element={<RequireAuth />}>\n    <Route element={<AppLayout />}>\n      <Route path=\"dashboard\" element={<DashboardPage />} />\n      <Route path=\"profile\" element={<ProfilePage />} />\n    </Route>\n  </Route>\n  <Route path=\"*\" element={<NotFoundPage />} />\n</Routes>",
        decision: {
          scenario: "Course detail pages (/courses/:courseId) should be visible to everyone, but the \"Continue learning\" page for each course (/learn/:courseId) only to enrolled, signed-in students.",
          question: "Where do these routes go?",
          options: [
            { id: "a", text: "Course details in the public layout; /learn/:courseId inside the protected layout", why: "Group routes by who may see them, so the protection is applied once, structurally, not page by page." },
            { id: "b", text: "Both in the protected layout", whyWrong: "Visitors could no longer see the catalogue they need to decide to enroll." },
            { id: "c", text: "Both public, with an if (user) inside the learn page", whyWrong: "Scattered checks are easy to forget on the next new page." },
            { id: "d", text: "In separate React apps", whyWrong: "Unnecessary: layout routes already separate them." },
          ],
          correct: "a",
          aftermath: "Structure the route table by audience; protect sections, not individual pages.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 51 · 8.P
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "rx-l51-m8-project",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 5,
    covers: ["8.P"],
    title: "Practical: A Mini Learning Platform",
    subtitle: "Homepage, catalogue, course details, student dashboard and profile",
    estimatedMinutes: 60,
    intro: "The Module 8 practical is the structure of a real learning platform: public pages for visitors, a protected area for students, shared layouts, dynamic URLs and a 404.",

    atoms: [
      {
        id: "a-rx-m8-project",
        title: "Build the learning platform's routes",
        explain:
          "Sketch the route table first: which routes are public, which are private, which layout each uses, and what every URL looks like. The sign-in here is simulated with state so you can concentrate on routing; Module 12 makes it real.",
        webLab: lab({
          task:
            "Build the platform. A layout with a <header> containing NavLinks: Home (/), Courses (/courses), Dashboard (/dashboard), Profile (/profile), and a <main> outlet. Public: / shows <h1>Memora Academy</h1>; /courses lists every course as a Link to /courses/ID and filters by ?level=; /courses/:courseId shows the course title in <h1> (or \"Course not found\"). Private, behind a protected layout that redirects to /login: /dashboard (<h1>Dashboard</h1>) and /profile (<h1>Profile</h1>). /login has a \"Sign in\" button that signs in and returns to the page wanted (or /dashboard). Any other URL shows <h1>Page not found</h1> inside the layout.",
          files: {
            "src/App.jsx": `import { useState } from "react";
import { BrowserRouter, Routes, Route, NavLink, Link, Navigate, Outlet, useLocation, useNavigate, useParams, useSearchParams } from "react-router";
import { courses, findCourse } from "./data.js";

export default function App() {
  return <h1>Memora Academy</h1>;
}
`,
            "src/data.js": COURSES,
          },
          readOnly: ["src/data.js"],
          revealSolution: false,
          tests: [
            { label: "Home inside the layout, with four NavLinks", check: "return text('main h1') === 'Memora Academy' && $$('header a').map((a) => a.getAttribute('href')).join() === '/,/courses,/dashboard,/profile' && $$('header a')[0].getAttribute('aria-current') === 'page';", fail: "A layout route with header NavLinks and <main><Outlet /></main>." },
            { label: "The catalogue links to course pages", path: "/courses", check: "const a = $$('main a'); return a.length === 7 && a[2].getAttribute('href') === '/courses/react' && $$('header a')[1].getAttribute('aria-current') === 'page';", fail: "Link each course to \"/courses/\" + c.id." },
            { label: "The catalogue filters by ?level=", path: "/courses?level=Advanced", check: "return $$('main a').map((a) => text(a)).join() === 'Testing';", fail: "useSearchParams().get(\"level\")" },
            { label: "Course details, including unknown ids", path: "/courses/node", check: "return text('main h1') === 'Node.js';", fail: "useParams and findCourse." },
            { label: "Unknown course id", path: "/courses/cobol", check: "return text('main h1') === 'Course not found';", fail: "Handle a missing course." },
            { label: "Private pages redirect, and sign-in returns", path: "/profile", check: "await waitFor(() => path() === '/login'); await click($$('button').find((b) => text(b) === 'Sign in')); await waitFor(() => path() === '/profile'); return text('main h1') === 'Profile';", fail: "Navigate to /login with state.from, then navigate back after signing in." },
            { label: "Unknown URLs show Page not found in the layout", path: "/nowhere", check: "return text('main h1') === 'Page not found' && !!$('header nav, header a');", fail: "<Route path=\"*\"> inside the layout route." },
          ],
          solution: {
            "src/App.jsx": `import { useState } from "react";
import { BrowserRouter, Routes, Route, NavLink, Link, Navigate, Outlet, useLocation, useNavigate, useParams, useSearchParams } from "react-router";
import { courses, findCourse } from "./data.js";

function Layout() {
  return (
    <>
      <header>
        <nav>
          <NavLink to="/" end>Home</NavLink>
          <NavLink to="/courses">Courses</NavLink>
          <NavLink to="/dashboard">Dashboard</NavLink>
          <NavLink to="/profile">Profile</NavLink>
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
    </>
  );
}

function CatalogPage() {
  const [params] = useSearchParams();
  const level = params.get("level");
  const visible = level ? courses.filter((c) => c.level === level) : courses;
  return (
    <>
      <h1>Courses</h1>
      <ul>
        {visible.map((c) => (
          <li key={c.id}>
            <Link to={"/courses/" + c.id}>{c.title}</Link>
          </li>
        ))}
      </ul>
    </>
  );
}

function CoursePage() {
  const { courseId } = useParams();
  const course = findCourse(courseId);
  return <h1>{course ? course.title : "Course not found"}</h1>;
}

function RequireAuth({ user }) {
  const location = useLocation();
  if (!user) return <Navigate to="/login" replace state={{ from: location }} />;
  return <Outlet />;
}

function LoginPage({ onSignIn }) {
  const location = useLocation();
  const navigate = useNavigate();
  return (
    <>
      <h1>Sign in</h1>
      <button
        onClick={() => {
          onSignIn();
          navigate(location.state?.from?.pathname ?? "/dashboard", { replace: true });
        }}
      >
        Sign in
      </button>
    </>
  );
}

export default function App() {
  const [user, setUser] = useState(null);
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<h1>Memora Academy</h1>} />
          <Route path="courses" element={<CatalogPage />} />
          <Route path="courses/:courseId" element={<CoursePage />} />
          <Route path="login" element={<LoginPage onSignIn={() => setUser({ name: "Ada" })} />} />
          <Route element={<RequireAuth user={user} />}>
            <Route path="dashboard" element={<h1>Dashboard</h1>} />
            <Route path="profile" element={<h1>Profile</h1>} />
          </Route>
          <Route path="*" element={<h1>Page not found</h1>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
`,
          },
          hint: "Write the route table first, with placeholder elements, then fill in each page.",
          successMessage: "Public and private sections, shared layout, dynamic URLs and a 404: the skeleton of a real platform.",
        }),
      },
    ],
    task: {
      title: "Module 8 practical: your learning platform",
      intro: "Build the platform in your own project with npm install react-router.",
      prompts: [
        "Organise pages into src/pages/public/ and src/pages/app/, with a PublicLayout and an AppLayout.",
        "Add a course search with ?q= alongside ?level=, both kept when paging with ?page=.",
        "On the course page, add a \"Start learning\" button that goes to /learn/:courseId, a protected route.",
        "Run npm run build and npm run preview, open /courses/react directly, and refresh: notice that preview handles it, and note what a real host must do (Module 15).",
        "Mastery checkpoint: show nested routes, a dynamic URL, a shared layout and consistent navigation, and explain how a protected route decides what to render.",
      ],
      closing: "Next: Module 9, APIs and server data.",
    },
    requirements: { read: true, video: false, assessment: true },
  },
];
