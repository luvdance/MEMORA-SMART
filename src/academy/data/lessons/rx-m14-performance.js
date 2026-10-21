/**
 * REACT DEVELOPMENT · MODULE 14 · PERFORMANCE, ACCESSIBILITY AND PRODUCTION READINESS
 *
 * Curriculum 14.1 – 14.P. Rendering and re-rendering, measuring first,
 * removing unnecessary state and effects, the Profiler, memo, useMemo and
 * useCallback, lazy loading and code splitting, route-level loading, images
 * and long lists, unnecessary requests, accessibility and semantic HTML,
 * keyboard and screen readers, Core Web Vitals, error boundaries, production
 * builds and deployment troubleshooting.
 *
 * Re-render labs count renders by logging from the component body. Strict
 * Mode renders twice in development, so the checks compare how the count
 * CHANGES after an action, which is the same in every mode.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

import { reactLab } from "./rx-helpers.js";

export const SECTION_ID = "rx-s14-performance";
const MODULE = "rx-m14-performance";

const renders = (name) => `logs().filter((l) => l === '${name} render').length`;

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 81 · 14.1 – 14.3
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "rx-l81-rerenders",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 1,
    covers: ["14.1", "14.2", "14.3"],
    title: "Rendering, Measuring and Removing Waste",
    subtitle: "What re-renders and why, measuring before optimizing, and removing unnecessary state and effects",
    estimatedMinutes: 40,
    intro: "Most React performance problems are not solved with clever tricks. They are solved by understanding what re-renders, measuring which part is slow, and deleting work that never needed to happen.",

    atoms: [
      {
        id: "a-rx-rerendering",
        title: "Understanding rendering and re-rendering",
        explain:
          "A component re-renders when its state changes, when its parent re-renders (by default, even if its props did not change), or when a context it reads changes. Re-rendering is usually cheap; it becomes a problem when an expensive component (a big chart, a long list) re-renders on every keystroke somewhere else. The best fix is often STRUCTURAL, not memoization: move state DOWN into the small component that uses it, so a change only re-renders that part; or pass expensive parts as children, which do not re-render when the wrapper's state changes.",
        webLab: reactLab({
          task:
            "Typing in the search box re-renders the expensive SalesChart on every keystroke, because the search state lives in Dashboard. Move the state DOWN: create a SearchBox component that owns its own query state and renders the input and the \"Searching for…\" text, so typing no longer re-renders the chart. Do not use memo.",
          files: {
            "src/App.jsx": `import { useState } from "react";

function SalesChart() {
  console.log("SalesChart render");
  return <div className="chart">Sales chart (imagine 5,000 data points)</div>;
}

export default function Dashboard() {
  const [query, setQuery] = useState("");
  return (
    <>
      <label htmlFor="q">Search orders</label>
      <input id="q" value={query} onChange={(e) => setQuery(e.target.value)} />
      <p className="hint">Searching for: {query}</p>
      <SalesChart />
    </>
  );
}
`,
          },
          tests: [
            { label: "Search still works", check: "await type('#q', 'tote'); return text('.hint') === 'Searching for: tote';", fail: "SearchBox keeps the query and renders the input and hint." },
            { label: "Typing does not re-render the chart", check: "const before = " + renders("SalesChart") + "; await type('#q', 'a'); await type('#q', 'ab'); await type('#q', 'abc'); return " + renders("SalesChart") + " === before;", fail: "Dashboard must not hold the query state any more." },
            { label: "Fixed by structure, not memo", check: "return !/memo\\(|useMemo|useCallback/.test(code('src/App.jsx')) && /function\\s+SearchBox/.test(code('src/App.jsx'));", fail: "Move the state down instead." },
          ],
          solution: {
            "src/App.jsx": `import { useState } from "react";

function SalesChart() {
  console.log("SalesChart render");
  return <div className="chart">Sales chart (imagine 5,000 data points)</div>;
}

function SearchBox() {
  const [query, setQuery] = useState("");
  return (
    <>
      <label htmlFor="q">Search orders</label>
      <input id="q" value={query} onChange={(e) => setQuery(e.target.value)} />
      <p className="hint">Searching for: {query}</p>
    </>
  );
}

export default function Dashboard() {
  return (
    <>
      <SearchBox />
      <SalesChart />
    </>
  );
}
`,
          },
          hint: "State re-renders the component that owns it and its children, nothing else.",
          successMessage: "The chart no longer pays for keystrokes it does not care about.",
        }),
      },
      {
        id: "a-rx-measure-first",
        title: "Measuring performance before optimizing",
        explain:
          "Never optimise from intuition: you will speed up the wrong thing and complicate code for nothing. MEASURE in a PRODUCTION build (npm run build, npm run preview), because the development build is deliberately slower. Use the browser Performance panel (with CPU throttling to imitate a mid-range phone), the React DevTools Profiler (which components rendered, how often, and how long each took), Lighthouse and Core Web Vitals for page load. Find the biggest cost, fix that one thing, then measure again to prove it helped.",
        decision: {
          scenario: "Users say the course list feels slow when typing in the search box. A teammate proposes wrapping every component in React.memo straight away.",
          question: "What should happen first?",
          options: [
            { id: "a", text: "Record the typing in the React Profiler on a production build, find which component takes the time, and fix that", why: "Measurement shows where the time goes, so the fix targets the real cause, and a second recording proves it worked." },
            { id: "b", text: "Wrap everything in memo", whyWrong: "Unmeasured memoization adds complexity and may not touch the real cost." },
            { id: "c", text: "Profile the development build", whyWrong: "Development React is slower on purpose and distorts the numbers." },
            { id: "d", text: "Buy a faster laptop for testing", whyWrong: "Your users' phones did not get faster." },
          ],
          correct: "a",
          aftermath: "Measure, fix the biggest cost, measure again.",
        },
      },
      {
        id: "a-rx-unnecessary-state",
        title: "Avoiding unnecessary state and effects",
        explain:
          "The cheapest render is the one that never happens. An effect that sets state from props or other state (Module 6) causes an EXTRA render every time, and shows stale values in between. Derived data calculated during render costs nothing extra; for a genuinely slow calculation, useMemo (Lesson 82). Other waste: state that changes on every mouse move but is not shown; a context value object recreated on every render (so every consumer re-renders); state stored higher in the tree than it needs to be.",
        webLab: reactLab({
          task:
            "FilteredList keeps a copy of the filtered list in state and updates it in an effect, which renders twice for every change. Remove the extra state and the effect: calculate the visible list during render. The list must behave the same, and each filter change must cost one render of FilteredList, not two.",
          files: {
            "src/App.jsx": `import { useEffect, useState } from "react";

const items = ["Tote bag", "Backpack", "Sandals", "Sneakers", "Bracelet"];

function FilteredList({ letter }) {
  console.log("FilteredList render");
  const [visible, setVisible] = useState(items);
  useEffect(() => {
    setVisible(items.filter((i) => i.startsWith(letter)));
  }, [letter]);
  return (
    <ul>
      {visible.map((i) => (
        <li key={i}>{i}</li>
      ))}
    </ul>
  );
}

export default function App() {
  const [letter, setLetter] = useState("");
  return (
    <>
      {["", "B", "S"].map((l) => (
        <button key={l} onClick={() => setLetter(l)}>
          {l || "All"}
        </button>
      ))}
      <FilteredList letter={letter} />
    </>
  );
}
`,
          },
          tests: [
            { label: "The filters still work", check: "await click($$('button')[2]); return $$('li').map((li) => text(li)).join() === 'Sandals,Sneakers';", fail: "const visible = items.filter(…) during render." },
            { label: "One render per change instead of two", check: "await click($$('button')[0]); const a = " + renders("FilteredList") + "; await click($$('button')[1]); const b = " + renders("FilteredList") + "; await click($$('button')[2]); const c = " + renders("FilteredList") + "; return (b - a) === (c - b) && (b - a) <= 2 && !/useEffect/.test(code('src/App.jsx'));", fail: "With the effect, every change renders the list twice (four logs in Strict Mode)." },
          ],
          solution: {
            "src/App.jsx": `import { useState } from "react";

const items = ["Tote bag", "Backpack", "Sandals", "Sneakers", "Bracelet"];

function FilteredList({ letter }) {
  console.log("FilteredList render");
  const visible = items.filter((i) => i.startsWith(letter));
  return (
    <ul>
      {visible.map((i) => (
        <li key={i}>{i}</li>
      ))}
    </ul>
  );
}

export default function App() {
  const [letter, setLetter] = useState("");
  return (
    <>
      {["", "B", "S"].map((l) => (
        <button key={l} onClick={() => setLetter(l)}>
          {l || "All"}
        </button>
      ))}
      <FilteredList letter={letter} />
    </>
  );
}
`,
          },
          hint: "In development Strict Mode doubles every render, so one render logs twice; the effect version logs four times.",
          successMessage: "Half the renders, no stale frame, less code.",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 82 · 14.4 – 14.6
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "rx-l82-memo-lazy",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 2,
    covers: ["14.4", "14.5", "14.6"],
    title: "Profiling, Memoization and Code Splitting",
    subtitle: "The React Profiler, memo with useMemo and useCallback, and lazy loading",
    estimatedMinutes: 45,
    intro: "With a measurement in hand, two tools fix most problems that structure cannot: memoization, so unchanged parts skip rendering, and code splitting, so users download only what they use.",

    atoms: [
      {
        id: "a-rx-profiler",
        title: "Using React Profiler and browser performance tools",
        explain:
          "React DevTools' PROFILER tab: press record, do the slow interaction, stop. The flame graph shows each commit (each time React updated the screen), which components rendered, and how long each took; grey ones did not render. Turn on \"Record why each component rendered\" to see the cause (state changed, props changed, parent rendered). The browser's PERFORMANCE panel shows the whole picture (scripting, layout, painting, long tasks over 50ms) with CPU throttling. React also has a <Profiler id onRender> component for measuring in code. React 19 adds Performance tracks to the browser's Performance panel.",
        decision: {
          scenario: "The Profiler shows that typing one letter in a search box commits in 180ms, and ProductGrid (rendering 2,000 cards) takes 170ms of it, with the reason \"parent rendered\" and no prop changes.",
          question: "What is the most targeted fix?",
          options: [
            { id: "a", text: "Stop ProductGrid re-rendering when its props have not changed: move the search state down, or wrap the grid in memo (with stable props)", why: "The Profiler says the grid re-renders only because its parent did, with identical props: exactly what memo or moving state solves." },
            { id: "b", text: "Make each card's CSS lighter", whyWrong: "The time is in rendering, not painting." },
            { id: "c", text: "Debounce the input by 2 seconds", whyWrong: "Hides the problem behind a laggy input." },
            { id: "d", text: "Upgrade React", whyWrong: "The cause is a needless re-render of a large tree." },
          ],
          correct: "a",
          aftermath: "The Profiler tells you what rendered, how long it took, and why.",
        },
      },
      {
        id: "a-rx-memo",
        title: "Memoization with memo, useMemo and useCallback",
        explain:
          "memo(Component) makes a component skip re-rendering when its props are the same as last time (compared one by one with Object.is). That only works if the props are STABLE: a new object or function created on every render is never the same, so pass memoized ones: useMemo(() => ({ … }), [deps]) for objects and arrays, useCallback(fn, [deps]) for functions. All three together: memo on the expensive child, useCallback and useMemo on what you pass it. React Compiler, when enabled, does much of this automatically.",
        webLab: reactLab({
          task:
            "ProductGrid is expensive and re-renders whenever the note changes. Wrap it in memo, and make its props stable: the onSelect callback with useCallback and the filters object with useMemo. Typing a note must not re-render the grid; choosing a product must still work.",
          files: {
            "src/App.jsx": `import { memo, useCallback, useMemo, useState } from "react";

function ProductGrid({ filters, onSelect }) {
  console.log("ProductGrid render");
  return (
    <ul>
      {["Tote bag", "Sandals"].map((p) => (
        <li key={p}>
          <button onClick={() => onSelect(p)}>
            {p} ({filters.currency})
          </button>
        </li>
      ))}
    </ul>
  );
}

export default function App() {
  const [note, setNote] = useState("");
  const [selected, setSelected] = useState("");
  const filters = { currency: "NGN" };
  const handleSelect = (p) => setSelected(p);

  return (
    <>
      <label htmlFor="note">Note</label>
      <input id="note" value={note} onChange={(e) => setNote(e.target.value)} />
      <p className="selected">Selected: {selected}</p>
      <ProductGrid filters={filters} onSelect={handleSelect} />
    </>
  );
}
`,
          },
          tests: [
            { label: "Typing a note does not re-render the grid", check: "const before = " + renders("ProductGrid") + "; await type('#note', 'x'); await type('#note', 'xy'); return " + renders("ProductGrid") + " === before;", fail: "memo(ProductGrid), plus useCallback and useMemo for its props." },
            { label: "Selecting still works", check: "await click($$('li button')[1]); return text('.selected') === 'Selected: Sandals';", fail: "Keep the callback working." },
            { label: "memo, useCallback and useMemo are used", check: "const c = code('src/App.jsx'); return /memo\\(\\s*function|memo\\(\\s*ProductGrid|=\\s*memo\\(/.test(c) && /useCallback\\(/.test(c) && /useMemo\\(/.test(c);", fail: "All three are needed." },
          ],
          solution: {
            "src/App.jsx": `import { memo, useCallback, useMemo, useState } from "react";

const ProductGrid = memo(function ProductGrid({ filters, onSelect }) {
  console.log("ProductGrid render");
  return (
    <ul>
      {["Tote bag", "Sandals"].map((p) => (
        <li key={p}>
          <button onClick={() => onSelect(p)}>
            {p} ({filters.currency})
          </button>
        </li>
      ))}
    </ul>
  );
});

export default function App() {
  const [note, setNote] = useState("");
  const [selected, setSelected] = useState("");
  const filters = useMemo(() => ({ currency: "NGN" }), []);
  const handleSelect = useCallback((p) => setSelected(p), []);

  return (
    <>
      <label htmlFor="note">Note</label>
      <input id="note" value={note} onChange={(e) => setNote(e.target.value)} />
      <p className="selected">Selected: {selected}</p>
      <ProductGrid filters={filters} onSelect={handleSelect} />
    </>
  );
}
`,
          },
          hint: "Try memo alone first and watch the console: the new filters object and function still break it.",
          successMessage: "memo only works with stable props; now the grid skips every keystroke.",
        }),
      },
      {
        id: "a-rx-lazy-loading",
        title: "Lazy loading and code splitting",
        explain:
          "By default Vite bundles the whole app into one JavaScript file, so a visitor to the home page also downloads the admin dashboard and the charting library. CODE SPLITTING puts parts into separate files loaded on demand: const Reports = lazy(() => import(\"./Reports.jsx\")) makes Vite emit Reports as its own chunk, fetched the first time it renders. Wrap lazy components in <Suspense fallback={<p>Loading…</p>}>, which shows the fallback while the chunk downloads. The lazy module must have a default export. Split by route and by heavy, rarely used features (editors, charts, maps).",
        webLab: reactLab({
          task:
            "Load the heavy Reports component lazily: replace the static import with lazy(() => import(\"./Reports.jsx\")), and render it inside <Suspense fallback={<p role=\"status\">Loading reports…</p>}> only after the Show reports button is clicked.",
          files: {
            "src/App.jsx": `import { lazy, Suspense, useState } from "react";
import Reports from "./Reports.jsx";

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <h1>Dashboard</h1>
      <button onClick={() => setShow(true)}>Show reports</button>
      {show && <Reports />}
    </>
  );
}
`,
            "src/Reports.jsx": `// Imagine a 400 KB charting library imported here.
export default function Reports() {
  return <section className="reports">Revenue up 12% this quarter</section>;
}
`,
          },
          readOnly: ["src/Reports.jsx"],
          tests: [
            { label: "Reports are not shown until asked for", check: "return !$('.reports') && !$('[role=status]');", fail: "Render Reports only when show is true." },
            { label: "Clicking shows the reports", check: "await click('button'); return await waitFor(() => text('.reports') === 'Revenue up 12% this quarter');", fail: "Wrap the lazy component in <Suspense fallback={…}>." },
            { label: "Reports is code-split with lazy and a dynamic import", check: "const c = code('src/App.jsx'); return /lazy\\(\\s*\\(\\)\\s*=>\\s*import\\(\\s*[\"']\\.\\/Reports(\\.jsx)?[\"']\\s*\\)\\s*\\)/.test(c) && !/import\\s+Reports\\s+from/.test(c) && /<Suspense\\s+fallback=/.test(c);", fail: "const Reports = lazy(() => import(\"./Reports.jsx\"));" },
          ],
          solution: {
            "src/App.jsx": `import { lazy, Suspense, useState } from "react";

const Reports = lazy(() => import("./Reports.jsx"));

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <h1>Dashboard</h1>
      <button onClick={() => setShow(true)}>Show reports</button>
      {show && (
        <Suspense fallback={<p role="status">Loading reports…</p>}>
          <Reports />
        </Suspense>
      )}
    </>
  );
}
`,
          },
          hint: "lazy() must be called at the top level of the module, not inside the component.",
          successMessage: "Visitors who never open the reports never download them.",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 83 · 14.7 – 14.9
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "rx-l83-loading",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 3,
    covers: ["14.7", "14.8", "14.9"],
    title: "Routes, Images, Lists and Requests",
    subtitle: "Route-level loading, images and large lists, and preventing unnecessary network requests",
    estimatedMinutes: 45,
    intro: "Three places apps waste the most time and data: loading every page up front, rendering thousands of rows nobody is looking at, and sending requests that were not needed.",

    atoms: [
      {
        id: "a-rx-route-splitting",
        title: "Route-level loading strategies",
        explain:
          "Routes are the natural places to split: each page becomes a lazy chunk, so the first visit downloads only the shell and the page in front of the user. Put one <Suspense> in the layout around the <Outlet />, so the header and navigation stay on screen while a page loads. Keep the fallback calm and layout-shaped (a skeleton) to avoid a jarring flash. Data routers (React Router's lazy route option and loaders) go further, starting the code and data downloads in parallel when a link is clicked; you can also prefetch a chunk on hover.",
        webLab: reactLab({
          task:
            "Make each page lazy: replace the static imports of CoursesPage and ProfilePage with lazy imports, and wrap the layout's <Outlet /> in <Suspense fallback={<p role=\"status\">Loading page…</p>}> so the header stays visible while a page loads.",
          files: {
            "src/App.jsx": `import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Link, Outlet } from "react-router";
import CoursesPage from "./pages/CoursesPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";

function Layout() {
  return (
    <>
      <header>
        <Link to="/courses">Courses</Link> <Link to="/profile">Profile</Link>
      </header>
      <main>
        <Outlet />
      </main>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
`,
            "src/pages/CoursesPage.jsx": "export default function CoursesPage() {\n  return <h1>Courses</h1>;\n}\n",
            "src/pages/ProfilePage.jsx": "export default function ProfilePage() {\n  return <h1>Profile</h1>;\n}\n",
          },
          readOnly: ["src/pages/CoursesPage.jsx", "src/pages/ProfilePage.jsx"],
          path: "/courses",
          tests: [
            { label: "Pages load inside the layout", check: "await waitFor(() => text('main h1') === 'Courses'); await click($$('header a')[1]); return await waitFor(() => text('main h1') === 'Profile') && !!$('header');", fail: "Wrap <Outlet /> in <Suspense>." },
            { label: "Both pages are lazy, with Suspense in the layout", check: "const c = code('src/App.jsx'); return (c.match(/lazy\\(\\s*\\(\\)\\s*=>\\s*import\\(/g) || []).length === 2 && !/import\\s+\\w+Page\\s+from/.test(c) && /<Suspense\\b[\\s\\S]*?<Outlet\\s*\\/>\\s*<\\/Suspense>/.test(c);", fail: "const CoursesPage = lazy(() => import(\"./pages/CoursesPage.jsx\"));" },
          ],
          solution: {
            "src/App.jsx": `import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Link, Outlet } from "react-router";

const CoursesPage = lazy(() => import("./pages/CoursesPage.jsx"));
const ProfilePage = lazy(() => import("./pages/ProfilePage.jsx"));

function Layout() {
  return (
    <>
      <header>
        <Link to="/courses">Courses</Link> <Link to="/profile">Profile</Link>
      </header>
      <main>
        <Suspense fallback={<p role="status">Loading page…</p>}>
          <Outlet />
        </Suspense>
      </main>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
`,
          },
          hint: "Suspense inside the layout, not around the whole router, keeps the header on screen.",
          successMessage: "Each page is its own download, and the shell never disappears.",
        }),
      },
      {
        id: "a-rx-images-lists",
        title: "Optimizing images and large lists",
        explain:
          "IMAGES are usually the heaviest part of a page. Serve modern formats (WebP, AVIF) at the size shown, with srcset and sizes so phones get small files; always give width and height (or aspect-ratio) so the layout does not jump when they load; loading=\"lazy\" for images below the fold, and fetchpriority=\"high\" on the main hero image. LARGE LISTS: rendering 10,000 rows creates 10,000 DOM nodes. Paginate, or VIRTUALISE (WINDOW) the list: render only the rows in view plus a few, with spacers for the rest. Libraries such as TanStack Virtual do this; the idea is simple enough to write.",
        webLab: reactLab({
          task:
            "The list renders all 10,000 students. Virtualise it: the scroll container (height 400px, overflow auto) holds an inner div 10,000 × 40px tall; on scroll, keep scrollTop in state and render only the rows from Math.floor(scrollTop / 40) to that plus 12, each absolutely positioned at top: index × 40px. Scrolling to the bottom must show \"Student 10000\".",
          files: {
            "src/App.jsx": `import { useState } from "react";

const ROW = 40;
const students = Array.from({ length: 10000 }, (_, i) => "Student " + (i + 1));

export default function App() {
  return (
    <div className="viewport" style={{ height: 400, overflow: "auto", position: "relative" }}>
      {students.map((s) => (
        <div key={s} className="row" style={{ height: ROW }}>
          {s}
        </div>
      ))}
    </div>
  );
}
`,
          },
          tests: [
            { label: "Only a few rows are in the DOM", check: "return $$('.row').length > 0 && $$('.row').length <= 20 && text($$('.row')[0]) === 'Student 1';", fail: "Render students.slice(start, start + 12)." },
            { label: "The scroll height still represents all 10,000", check: "return $('.viewport').scrollHeight >= 400000;", fail: "An inner div with height 10000 * 40." },
            { label: "Scrolling shows the right rows", check: "const v = $('.viewport'); v.scrollTop = 40 * 5000; v.dispatchEvent(new Event('scroll')); await wait(50); const t = $$('.row').map((r) => text(r)); return t.includes('Student 5001') && $$('.row').length <= 20;", fail: "onScroll: setScrollTop(e.currentTarget.scrollTop)" },
            { label: "And the last one", check: "const v = $('.viewport'); v.scrollTop = v.scrollHeight; v.dispatchEvent(new Event('scroll')); await wait(50); return $$('.row').some((r) => text(r) === 'Student 10000');", fail: "Clamp the slice to the end of the array." },
          ],
          solution: {
            "src/App.jsx": `import { useState } from "react";

const ROW = 40;
const VISIBLE = 12;
const students = Array.from({ length: 10000 }, (_, i) => "Student " + (i + 1));

export default function App() {
  const [scrollTop, setScrollTop] = useState(0);
  const start = Math.floor(scrollTop / ROW);
  const rows = students.slice(start, start + VISIBLE);

  return (
    <div
      className="viewport"
      style={{ height: 400, overflow: "auto", position: "relative" }}
      onScroll={(e) => setScrollTop(e.currentTarget.scrollTop)}
    >
      <div style={{ height: students.length * ROW, position: "relative" }}>
        {rows.map((s, i) => (
          <div key={s} className="row" style={{ height: ROW, position: "absolute", top: (start + i) * ROW, left: 0, right: 0 }}>
            {s}
          </div>
        ))}
      </div>
    </div>
  );
}
`,
          },
          hint: "The inner div provides the scroll height; the rows are placed absolutely inside it.",
          successMessage: "Twelve DOM rows instead of ten thousand, and it scrolls the same.",
        }),
      },
      {
        id: "a-rx-fewer-requests",
        title: "Preventing unnecessary network requests",
        explain:
          "Common waste: a request per keystroke (DEBOUNCE: wait until typing pauses, say 300ms); the same data fetched by several components (share it with a cache such as TanStack Query, which DEDUPLICATES identical queries and reuses cached data); refetching unchanged data on every mount (set a staleTime); fetching inside a list item component (one request per row; fetch the list once instead); and waterfalls, where a child starts fetching only after its parent's data arrived (start both together). Cancel or ignore requests that are no longer needed.",
        webLab: reactLab({
          task:
            "The search sends a request on every keystroke. Debounce it: write a useDebounce(value, delay) Hook that returns the value only after it has stopped changing for delay milliseconds (a timer in an effect, cleared in the cleanup), and fetch with the debounced query (300ms). Typing \"react\" quickly must send ONE request, for q=react.",
          files: {
            "src/App.jsx": `import { useEffect, useState } from "react";

export default function App() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (!query) return;
    let ignore = false;
    fetch("/api/search?q=" + encodeURIComponent(query))
      .then((r) => r.json())
      .then((data) => !ignore && setResults(data));
    return () => {
      ignore = true;
    };
  }, [query]);

  return (
    <>
      <label htmlFor="q">Search</label>
      <input id="q" value={query} onChange={(e) => setQuery(e.target.value)} />
      <ul>
        {results.map((r) => (
          <li key={r}>{r}</li>
        ))}
      </ul>
    </>
  );
}
`,
          },
          mocks: [{ match: "/api/search?q=react", body: ["React Development", "React Native"], delay: 30 }, { match: "/api/search", body: [], delay: 30 }],
          tests: [
            { label: "Typing quickly sends one request, after the pause", check: "for (const s of ['r', 're', 'rea', 'reac', 'react']) { await type('#q', s); await wait(40); } const during = fetchCalls().length; await wait(450); const calls = fetchCalls().filter((c) => c.url.includes('/api/search')); return during === 0 && calls.length >= 1 && calls.every((c) => c.url.endsWith('q=react')) && new Set(calls.map((c) => c.url)).size === 1;", fail: "const debounced = useDebounce(query, 300); and fetch with debounced." },
            { label: "The results arrive", check: "return await waitFor(() => $$('li').length === 2);", fail: "Render the results of the debounced request." },
            { label: "A useDebounce Hook with a cleanup", check: "const c = code('src/App.jsx'); return /function\\s+useDebounce\\s*\\(/.test(c) && /clearTimeout\\(/.test(c);", fail: "useEffect(() => { const id = setTimeout(…, delay); return () => clearTimeout(id); }, [value, delay]);" },
          ],
          solution: {
            "src/App.jsx": `import { useEffect, useState } from "react";

function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

export default function App() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const debounced = useDebounce(query, 300);

  useEffect(() => {
    if (!debounced) return;
    let ignore = false;
    fetch("/api/search?q=" + encodeURIComponent(debounced))
      .then((r) => r.json())
      .then((data) => !ignore && setResults(data));
    return () => {
      ignore = true;
    };
  }, [debounced]);

  return (
    <>
      <label htmlFor="q">Search</label>
      <input id="q" value={query} onChange={(e) => setQuery(e.target.value)} />
      <ul>
        {results.map((r) => (
          <li key={r}>{r}</li>
        ))}
      </ul>
    </>
  );
}
`,
          },
          hint: "Each keystroke's effect cleanup cancels the previous timer, so only the last one fires.",
          successMessage: "Five keystrokes, one request.",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 84 · 14.10 – 14.12
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "rx-l84-accessibility",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 4,
    covers: ["14.10", "14.11", "14.12"],
    title: "Accessibility and Core Web Vitals",
    subtitle: "Semantic HTML, keyboard and screen-reader support, and perceived performance",
    estimatedMinutes: 45,
    intro: "An app that is fast but unusable with a keyboard, or accessible but slow to appear, is not production-ready. This lesson audits both.",

    atoms: [
      {
        id: "a-rx-a11y-semantics",
        title: "Web accessibility fundamentals and semantic HTML",
        explain:
          "About one in six people lives with a disability; accessibility is also a legal requirement in many places, and it helps everyone (keyboard power users, people on a bright beach, older users). The foundation is SEMANTIC HTML: real <button>s and <a>s, headings in order, landmarks (<header>, <nav>, <main>, <footer>), labelled form controls, lists as <ul>, tables for tabular data, and alt text that says what an image MEANS (alt=\"\" for decorative ones). ARIA is for what HTML cannot express; the first rule of ARIA is not to use it when a native element does the job. Test with axe DevTools or Lighthouse's accessibility audit, then with a keyboard and a screen reader.",
        webLab: reactLab({
          task:
            "This course card is built from divs. Make it accessible: the title an <h2>; the \"Enroll\" div a real <button>; the decorative divider image alt=\"\"; the instructor photo alt=\"Ngozi Eze, instructor\"; and the whole card an <article> inside a <main>.",
          files: {
            "src/App.jsx": `export default function App() {
  return (
    <div className="page">
      <div className="card">
        <div className="title">React Development</div>
        <img src="images/profile.jpg" />
        <img src="images/logo.svg" className="divider" />
        <div className="enroll" onClick={() => console.log("enroll")}>
          Enroll
        </div>
      </div>
    </div>
  );
}
`,
          },
          tests: [
            { label: "A main landmark holding an article", check: "return !!$('main article');", fail: "<main><article>…</article></main>" },
            { label: "The title is a heading", check: "return text('article h2') === 'React Development';", fail: "Use <h2>." },
            { label: "Enroll is a real button that still works", check: "const b = $$('article button').find((x) => text(x) === 'Enroll'); if (!b) return false; await click(b); return output().includes('enroll');", fail: "<button onClick={…}>Enroll</button>" },
            { label: "Images have the right alt text", check: "const i = $$('article img'); return i.length === 2 && i.some((x) => x.getAttribute('alt') === 'Ngozi Eze, instructor') && i.some((x) => x.getAttribute('alt') === '');", fail: "Meaningful alt for the photo, alt=\"\" for the decorative divider." },
          ],
          solution: {
            "src/App.jsx": `export default function App() {
  return (
    <main className="page">
      <article className="card">
        <h2 className="title">React Development</h2>
        <img src="images/profile.jpg" alt="Ngozi Eze, instructor" />
        <img src="images/logo.svg" className="divider" alt="" />
        <button className="enroll" onClick={() => console.log("enroll")}>
          Enroll
        </button>
      </article>
    </main>
  );
}
`,
          },
          hint: "A decorative image still needs alt, but empty: alt=\"\" tells screen readers to skip it.",
          successMessage: "Same look, and now it means something to every user.",
        }),
      },
      {
        id: "a-rx-keyboard-sr",
        title: "Keyboard navigation and screen-reader considerations",
        explain:
          "KEYBOARD: everything must work with Tab, Shift+Tab, Enter, Space, the arrow keys in widgets and Escape to close; focus order follows the visual order; focus is always visible; after an SPA navigation, move focus to the new page's heading (or announce it), because the browser does not. Add a \"Skip to main content\" link as the first element. SCREEN READERS: give icon-only buttons an aria-label; announce changes that happen without a page load (results updated, item added) through a live region (role=\"status\"); hide decorative things with aria-hidden. Test with NVDA (Windows) or VoiceOver (macOS and iOS).",
        webLab: reactLab({
          task:
            "Add three things. A \"Skip to main content\" link as the first element, pointing to #main (the <main> needs id=\"main\" and tabIndex={-1}). An aria-label \"Remove from cart\" on the icon-only ✕ button. And a live region: when an item is removed, <p role=\"status\"> announces \"Tote bag removed from cart\".",
          files: {
            "src/App.jsx": `import { useState } from "react";

export default function App() {
  const [items, setItems] = useState(["Tote bag", "Sandals"]);

  return (
    <>
      <header>Memora Shop</header>
      <main>
        <ul>
          {items.map((item) => (
            <li key={item}>
              {item} <button onClick={() => setItems(items.filter((i) => i !== item))}>✕</button>
            </li>
          ))}
        </ul>
      </main>
    </>
  );
}
`,
          },
          tests: [
            { label: "A skip link first, to a focusable main", check: "const first = $('#root').firstElementChild; const m = $('main#main'); return !!first && first.tagName === 'A' && text(first) === 'Skip to main content' && first.getAttribute('href') === '#main' && !!m && m.tabIndex === -1;", fail: "<a href=\"#main\">Skip to main content</a> … <main id=\"main\" tabIndex={-1}>" },
            { label: "Icon buttons have accessible names", check: "return $$('li button').every((b) => nameOf(b).startsWith('Remove'));", fail: "aria-label=\"Remove from cart\" (or \"Remove Tote bag\")." },
            { label: "Removals are announced", check: "await click($$('li button')[0]); return text('[role=status]') === 'Tote bag removed from cart';", fail: "Keep a message in state and render it in role=\"status\"." },
          ],
          solution: {
            "src/App.jsx": `import { useState } from "react";

export default function App() {
  const [items, setItems] = useState(["Tote bag", "Sandals"]);
  const [message, setMessage] = useState("");

  function remove(item) {
    setItems(items.filter((i) => i !== item));
    setMessage(item + " removed from cart");
  }

  return (
    <>
      <a href="#main" className="skip">Skip to main content</a>
      <header>Memora Shop</header>
      <main id="main" tabIndex={-1}>
        <ul>
          {items.map((item) => (
            <li key={item}>
              {item}{" "}
              <button aria-label="Remove from cart" onClick={() => remove(item)}>
                ✕
              </button>
            </li>
          ))}
        </ul>
        <p role="status">{message}</p>
      </main>
    </>
  );
}
`,
          },
          hint: "Render the role=\"status\" element from the start (empty), so screen readers are already watching it.",
          successMessage: "Navigable by keyboard, named for screen readers, and changes announced.",
        }),
      },
      {
        id: "a-rx-web-vitals",
        title: "Core Web Vitals and perceived performance",
        explain:
          "Google's CORE WEB VITALS measure the experience real users get. LCP (Largest Contentful Paint): how soon the main content appears, good under 2.5s. INP (Interaction to Next Paint): how quickly the page responds to clicks and typing, good under 200ms. CLS (Cumulative Layout Shift): how much content jumps around while loading, good under 0.1. For React SPAs: shrink the initial bundle (code splitting) and preload the hero image for LCP; avoid long tasks and needless re-renders for INP; reserve space for images, ads and late-loading content (width and height, skeletons) for CLS. PERCEIVED performance matters too: skeletons and instant feedback feel faster. Measure in the field with the web-vitals library or Search Console.",
        decision: {
          scenario: "Lighthouse reports CLS 0.32: when the hero image and a promo banner load, the course list below jumps down.",
          question: "What fixes it?",
          options: [
            { id: "a", text: "Reserve their space: width and height (or aspect-ratio) on the image, and a fixed-height placeholder for the banner", why: "Layout shift happens because the space is not reserved. Reserved space means nothing moves when they arrive." },
            { id: "b", text: "Lazy-load the hero image", whyWrong: "That delays the most important image (hurting LCP) and does not stop the jump." },
            { id: "c", text: "Use memo on the list", whyWrong: "Re-rendering is not the cause; missing reserved space is." },
            { id: "d", text: "Make the server faster", whyWrong: "It would still jump, just sooner." },
          ],
          correct: "a",
          aftermath: "LCP: appear fast. INP: respond fast. CLS: do not move.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 85 · 14.13 – 14.15
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "rx-l85-production",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 5,
    covers: ["14.13", "14.14", "14.15"],
    title: "Error Boundaries, Builds and Deployment Issues",
    subtitle: "Graceful failure, production builds and bundle inspection, and environment troubleshooting",
    estimatedMinutes: 40,
    intro: "Production readiness is mostly about what happens when things go wrong: a component crashes, the bundle is too big, or the deployed app behaves differently from your laptop.",

    atoms: [
      {
        id: "a-rx-error-boundaries",
        title: "Error boundaries and graceful failure handling",
        explain:
          "If a component throws while rendering, React removes the WHOLE app from the screen: a blank page. An ERROR BOUNDARY catches render errors in the tree below it and shows a fallback instead, so one broken widget does not take down the page. It is still written as a class component with static getDerivedStateFromError (to switch to the fallback) and componentDidCatch (to report the error), or with the react-error-boundary package. Place boundaries around independent sections (each dashboard widget, each route), offer a Try again button that resets it, and report errors to monitoring (Module 15). Error boundaries do not catch errors in event handlers or async code: handle those with try/catch.",
        webLab: reactLab({
          task:
            "One broken widget blanks the whole dashboard. Write an ErrorBoundary class component: getDerivedStateFromError switches to the fallback; componentDidCatch logs \"Reported: \" plus the error message; the fallback is <div role=\"alert\">This widget could not be loaded.</div>. Wrap EACH widget in its own boundary so the others keep working.",
          files: {
            "src/App.jsx": `import { Component } from "react";

function Revenue() {
  return <section className="widget">Revenue: ₦4.2m</section>;
}

function Broken() {
  const data = null;
  return <section className="widget">Students: {data.count}</section>;
}

// write ErrorBoundary here

export default function App() {
  return (
    <main>
      <h1>Dashboard</h1>
      <Revenue />
      <Broken />
    </main>
  );
}
`,
          },
          allowErrors: true,
          tests: [
            { label: "The rest of the dashboard survives", check: "return text('h1') === 'Dashboard' && text('.widget') === 'Revenue: ₦4.2m';", fail: "Wrap each widget in <ErrorBoundary>." },
            { label: "The broken widget shows the fallback", check: "return text('[role=alert]') === 'This widget could not be loaded.';", fail: "static getDerivedStateFromError() { return { failed: true }; }" },
            { label: "The error is reported", check: "return logs().some((l) => /^Reported: .*null/.test(l));", fail: "componentDidCatch(error) { console.log(\"Reported: \" + error.message); }" },
          ],
          solution: {
            "src/App.jsx": `import { Component } from "react";

function Revenue() {
  return <section className="widget">Revenue: ₦4.2m</section>;
}

function Broken() {
  const data = null;
  return <section className="widget">Students: {data.count}</section>;
}

class ErrorBoundary extends Component {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error) {
    console.log("Reported: " + error.message);
  }

  render() {
    if (this.state.failed) return <div role="alert">This widget could not be loaded.</div>;
    return this.props.children;
  }
}

export default function App() {
  return (
    <main>
      <h1>Dashboard</h1>
      <ErrorBoundary>
        <Revenue />
      </ErrorBoundary>
      <ErrorBoundary>
        <Broken />
      </ErrorBoundary>
    </main>
  );
}
`,
          },
          hint: "This is the one place modern React still needs a class component.",
          successMessage: "One widget fails, the page lives on, and the error is reported.",
        }),
      },
      {
        id: "a-rx-production-builds",
        title: "Production builds and bundle inspection",
        explain:
          "npm run build produces dist/: minified JavaScript and CSS with content-hashed names (cacheable forever), React in its fast production mode, unused code removed (tree-shaking) and each lazy() import as its own chunk. Vite prints each file's size and gzip size, and warns about chunks over 500 kB. To see WHAT is inside, use a visualiser (rollup-plugin-visualizer produces an interactive treemap). Usual findings: a whole library imported for one function (import the function, or use a lighter library), moment.js locales, duplicated dependencies, and big features that could be lazy-loaded. Always check the result with npm run preview before deploying.",
        decision: {
          scenario: "The visualiser shows that 380 kB of your 520 kB main bundle is a date library, used in one component to print \"3 days ago\".",
          question: "What is the best fix?",
          options: [
            { id: "a", text: "Use the built-in Intl.RelativeTimeFormat (or a tiny function) instead of the library", why: "The browser already formats relative times, so 380 kB disappears from every visitor's download." },
            { id: "b", text: "Ignore it: users have fast internet", whyWrong: "Many do not, especially on mobile data, and they pay for it." },
            { id: "c", text: "Raise Vite's warning limit", whyWrong: "Silences the warning, not the cost." },
            { id: "d", text: "Minify the library twice", whyWrong: "It is already minified." },
          ],
          correct: "a",
          aftermath: "Look inside the bundle; the biggest wins are usually one import.",
        },
      },
      {
        id: "a-rx-deploy-troubleshooting",
        title: "Environment configuration and deployment troubleshooting",
        explain:
          "Works locally, broken in production? Check in this order. 1. The browser Console and Network panel on the deployed site: a 404 for a JS chunk, a CORS error, a request going to localhost. 2. ENVIRONMENT VARIABLES: VITE_ variables are baked in at BUILD time, so they must be set in the host's settings before building, and changing them needs a rebuild. 3. ROUTING: refreshing /courses/react gives a 404 if the host lacks an SPA rewrite to index.html (Module 15). 4. BASE PATH: an app served from a sub-folder needs Vite's base option. 5. CASE SENSITIVITY: import \"./Card.jsx\" works on Windows and macOS but fails on Linux build servers if the file is card.jsx. 6. Old cached files: hashed filenames prevent this unless index.html itself is cached too long.",
        decision: {
          scenario: "After deploying, every API call goes to http://localhost:3000/api/… and fails. The host's dashboard shows VITE_API_URL set correctly to https://api.memora.ng, added an hour after the last deploy.",
          question: "What is wrong?",
          options: [
            { id: "a", text: "VITE_ variables are baked in at build time; the current build was made before the variable existed, so redeploy to rebuild", why: "The bundle still contains the fallback value from when it was built." },
            { id: "b", text: "The API server is down", whyWrong: "Requests are going to localhost, so the address itself is wrong." },
            { id: "c", text: "The variable must be read with process.env", whyWrong: "Vite exposes it as import.meta.env.VITE_API_URL." },
            { id: "d", text: "Clear the browser cache", whyWrong: "The built JavaScript itself contains the wrong address." },
          ],
          correct: "a",
          aftermath: "Change a build-time variable, rebuild. Check the deployed Network panel first.",
        },
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 86 · 14.P
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "rx-l86-m14-project",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 6,
    covers: ["14.P"],
    title: "Practical: Audit and Improve an App",
    subtitle: "Performance, accessibility and loading experience, measured and fixed",
    estimatedMinutes: 70,
    intro: "The Module 14 practical: an existing app works, but it is slow to type in, crashes on bad data, and is hard to use without a mouse. Audit it and fix each problem, keeping it working.",

    atoms: [
      {
        id: "a-rx-m14-project",
        title: "Audit and improve the course explorer",
        explain:
          "Five problems to find and fix: typing in the filter re-renders the expensive CourseGrid; the filter sends a request per keystroke; one malformed course crashes the whole page; the grid's cards are divs with click handlers; and the reviews panel, rarely opened, is in the main bundle. Fix each without breaking the others, as you would in a real audit.",
        webLab: reactLab({
          task:
            "Improve App.jsx. (1) Typing in the filter must not re-render CourseGrid (it logs \"CourseGrid render\"). (2) The filter request is debounced: typing \"react\" quickly sends one request for q=react. (3) A course that throws while rendering must show the fallback <div role=\"alert\">This course could not be shown.</div> for that card only, inside an error boundary per card. (4) Each card's \"Open\" is a real <button> (with aria-label \"Open COURSE\"). (5) Reviews.jsx is loaded lazily with Suspense when \"Show reviews\" is clicked. Everything else keeps working.",
          files: {
            "src/App.jsx": `import { Component, lazy, Suspense, memo, useCallback, useEffect, useMemo, useState } from "react";
import Reviews from "./Reviews.jsx";

const COURSES = [
  { id: "react", title: "React" },
  { id: "ts", title: "TypeScript" },
  { id: "bad", title: null },
];

function CourseCard({ course, onOpen }) {
  return (
    <div className="card">
      <h2>{course.title.toUpperCase()}</h2>
      <div className="open" onClick={() => onOpen(course.id)}>
        Open
      </div>
    </div>
  );
}

function CourseGrid({ courses, onOpen }) {
  console.log("CourseGrid render");
  return (
    <section>
      {courses.map((c) => (
        <CourseCard key={c.id} course={c} onOpen={onOpen} />
      ))}
    </section>
  );
}

export default function App() {
  const [filter, setFilter] = useState("");
  const [results, setResults] = useState([]);
  const [opened, setOpened] = useState("");
  const [showReviews, setShowReviews] = useState(false);

  useEffect(() => {
    if (!filter) return;
    fetch("/api/search?q=" + encodeURIComponent(filter))
      .then((r) => r.json())
      .then(setResults);
  }, [filter]);

  return (
    <main>
      <label htmlFor="filter">Filter</label>
      <input id="filter" value={filter} onChange={(e) => setFilter(e.target.value)} />
      <p className="results">{results.length} matches</p>
      <p className="opened">Opened: {opened}</p>
      <CourseGrid courses={COURSES} onOpen={(id) => setOpened(id)} />
      <button onClick={() => setShowReviews(true)}>Show reviews</button>
      {showReviews && <Reviews />}
    </main>
  );
}
`,
            "src/Reviews.jsx": "export default function Reviews() {\n  return <section className=\"reviews\">4.9 out of 5 from 1,200 learners</section>;\n}\n",
          },
          readOnly: ["src/Reviews.jsx"],
          mocks: [{ match: "/api/search?q=react", body: ["React"], delay: 30 }, { match: "/api/search", body: [], delay: 30 }],
          allowErrors: true,
          revealSolution: false,
          tests: [
            { label: "A bad course shows a fallback; the others render", check: "return !!$('h2') && $$('.card h2').map((h) => text(h)).join() === 'REACT,TYPESCRIPT' && text('[role=alert]') === 'This course could not be shown.';", fail: "An error boundary around each CourseCard." },
            { label: "Open is a real, named button", check: "const b = $$('button').find((x) => nameOf(x) === 'Open React'); if (!b) return false; await click(b); return text('.opened') === 'Opened: react';", fail: "<button aria-label={\"Open \" + course.title} onClick={…}>Open</button>" },
            { label: "Typing does not re-render the grid", check: "const n = () => logs().filter((l) => l === 'CourseGrid render').length; const before = n(); await type('#filter', 'r'); await type('#filter', 're'); return n() === before;", fail: "memo(CourseGrid) and a stable onOpen (useCallback), or move the filter state down." },
            { label: "The filter request is debounced", check: "for (const s of ['r', 're', 'rea', 'reac', 'react']) { await type('#filter', s); await wait(40); } await wait(450); const calls = fetchCalls().filter((c) => c.url.includes('/api/search')); return calls.length >= 1 && new Set(calls.map((c) => c.url)).size === 1 && calls[0].url.endsWith('q=react') && text('.results') === '1 matches';", fail: "Debounce the filter before fetching." },
            { label: "Reviews are lazy-loaded", check: "const c = code('src/App.jsx'); const lazyOk = /lazy\\(\\s*\\(\\)\\s*=>\\s*import\\(\\s*[\"']\\.\\/Reviews(\\.jsx)?[\"']/.test(c) && !/import\\s+Reviews\\s+from/.test(c) && /<Suspense/.test(c); await click($$('button').find((b) => text(b) === 'Show reviews')); return lazyOk && await waitFor(() => !!$('.reviews'));", fail: "const Reviews = lazy(() => import(\"./Reviews.jsx\")); inside <Suspense>." },
          ],
          solution: {
            "src/App.jsx": `import { Component, lazy, Suspense, memo, useCallback, useEffect, useMemo, useState } from "react";

const Reviews = lazy(() => import("./Reviews.jsx"));

const COURSES = [
  { id: "react", title: "React" },
  { id: "ts", title: "TypeScript" },
  { id: "bad", title: null },
];

class CardBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(error) {
    console.log("Reported: " + error.message);
  }
  render() {
    if (this.state.failed) return <div role="alert">This course could not be shown.</div>;
    return this.props.children;
  }
}

function CourseCard({ course, onOpen }) {
  return (
    <div className="card">
      <h2>{course.title.toUpperCase()}</h2>
      <button aria-label={"Open " + course.title} onClick={() => onOpen(course.id)}>
        Open
      </button>
    </div>
  );
}

const CourseGrid = memo(function CourseGrid({ courses, onOpen }) {
  console.log("CourseGrid render");
  return (
    <section>
      {courses.map((c) => (
        <CardBoundary key={c.id}>
          <CourseCard course={c} onOpen={onOpen} />
        </CardBoundary>
      ))}
    </section>
  );
});

function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

export default function App() {
  const [filter, setFilter] = useState("");
  const [results, setResults] = useState([]);
  const [opened, setOpened] = useState("");
  const [showReviews, setShowReviews] = useState(false);
  const debounced = useDebounce(filter, 300);
  const onOpen = useCallback((id) => setOpened(id), []);

  useEffect(() => {
    if (!debounced) return;
    let ignore = false;
    fetch("/api/search?q=" + encodeURIComponent(debounced))
      .then((r) => r.json())
      .then((data) => !ignore && setResults(data));
    return () => {
      ignore = true;
    };
  }, [debounced]);

  return (
    <main>
      <label htmlFor="filter">Filter</label>
      <input id="filter" value={filter} onChange={(e) => setFilter(e.target.value)} />
      <p className="results">{results.length} matches</p>
      <p className="opened">Opened: {opened}</p>
      <CourseGrid courses={COURSES} onOpen={onOpen} />
      <button onClick={() => setShowReviews(true)}>Show reviews</button>
      {showReviews && (
        <Suspense fallback={<p role="status">Loading reviews…</p>}>
          <Reviews />
        </Suspense>
      )}
    </main>
  );
}
`,
          },
          hint: "Fix the crash first (it hides everything else), then the button, then the performance issues.",
          successMessage: "Five issues found and fixed, and the app still works: that is an audit.",
        }),
      },
    ],
    task: {
      title: "Module 14 practical: audit one of your own apps",
      intro: "Take your Module 9 or 12 app, build it for production, and audit it.",
      prompts: [
        "Run Lighthouse (performance and accessibility) and axe DevTools on the production preview; record the scores and every finding.",
        "Record a slow interaction in the React Profiler, fix the biggest cost, and record again to prove it.",
        "Add route-level code splitting, an error boundary per route, and look inside the bundle with rollup-plugin-visualizer.",
        "Complete your main journey with the keyboard only, and with a screen reader.",
        "Mastery checkpoint: present the before and after numbers, explain each fix, and show the app still passes its tests.",
      ],
      closing: "Next: Module 15, deployment and professional workflows.",
    },
    requirements: { read: true, video: false, assessment: true },
  },
];
