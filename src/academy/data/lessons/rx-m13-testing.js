/**
 * REACT DEVELOPMENT · MODULE 13 · TESTING AND DEBUGGING REACT APPLICATIONS
 *
 * Curriculum 13.1 – 13.P. DevTools and stack traces, unit tests of pure
 * functions, component tests with React Testing Library, interactions and
 * form validation, async states, mocked APIs, routing, integration tests,
 * Playwright end-to-end tests, coverage, flaky tests, ESLint and Prettier,
 * and continuous integration.
 *
 * HOW TEST LABS ARE GRADED. The lab runtime runs *.test.jsx files with a
 * Vitest-compatible describe/it/expect/vi and the real React Testing Library
 * and user-event. A test-writing lab is checked twice: the learner's tests
 * must pass against the real code, and must FAIL when the checker swaps in a
 * deliberately broken version of it (`swap`), so a test that cannot fail does
 * not count. That is exactly what makes a test meaningful.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

import { reactLab } from "./rx-helpers.js";

export const SECTION_ID = "rx-s13-testing";
const MODULE = "rx-m13-testing";

const RESULTS_APP = `export default function App() {
  return <p>This lab runs your tests. The results appear in the console below.</p>;
}
`;

/** A test-writing lab: the given code is read-only, the test file is the learner's. */
function testLab({ testFile, files, readOnly = [], ...rest }) {
  return reactLab({
    files: { [testFile]: files[testFile], ...files, "src/App.jsx": RESULTS_APP },
    readOnly: [...new Set([...readOnly, ...Object.keys(files).filter((f) => f !== testFile), "src/App.jsx"])],
    open: testFile,
    ...rest,
  });
}

const passes = { label: "Your tests pass against the real code", check: "const r = await tests(); return !!r && r.total >= 1 && r.failed === 0;", fail: "Read the console: each failing test prints why." };
const atLeast = (n) => ({ label: `You wrote at least ${n} tests`, check: `const r = await tests(); return !!r && r.total >= ${n};`, fail: `Write at least ${n} it(...) blocks.` });
const catches = (label, swap, fail) => ({ label, swap, check: "const r = await tests(); return !!r && r.failed > 0;", fail });

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 75 · 13.1 – 13.3
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "rx-l75-debugging-unit",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 1,
    covers: ["13.1", "13.2", "13.3"],
    title: "Debugging and Unit Tests",
    subtitle: "DevTools and React DevTools, stack traces and common errors, and testing pure functions",
    estimatedMinutes: 40,
    intro: "Debugging is finding out why code does what it does; testing is proving it does what it should. Both start with evidence, not guesses.",

    atoms: [
      {
        id: "a-rx-debug-tools",
        title: "Debugging with browser DevTools and React Developer Tools",
        explain:
          "A method, not luck: REPRODUCE the bug reliably; LOCATE it (which component, which value is wrong); find the CAUSE; fix it and VERIFY. The tools: React DevTools' Components tab shows each component's props, state and Hooks, and which component rendered a given element (and lets you edit state live); the Console shows errors with a component stack; the Sources panel sets BREAKPOINTS (or write debugger; in your code) so you can pause, inspect every variable and step through; the Network panel shows each request's status and response; console.log with labels (console.log(\"cart\", cart)) is fine for quick checks, and remove them afterwards.",
        decision: {
          scenario: "The cart total shows ₦0 although three items are listed. You do not yet know whether the bug is in the data, the calculation or the rendering.",
          question: "What is the most efficient first step?",
          options: [
            { id: "a", text: "Select CartTotal in React DevTools and look at the props it actually received", why: "In seconds you learn whether it got the items (calculation bug) or an empty array (data bug), halving the search." },
            { id: "b", text: "Rewrite the total calculation", whyWrong: "The calculation may be fine; you would be guessing." },
            { id: "c", text: "Add console.log to every component", whyWrong: "Slower and noisier than reading the props directly." },
            { id: "d", text: "Clear the browser cache", whyWrong: "Unrelated to a wrong total." },
          ],
          correct: "a",
          aftermath: "Narrow down with evidence before changing code.",
        },
      },
      {
        id: "a-rx-stack-traces",
        title: "Reading stack traces and diagnosing common errors",
        explain:
          "An error has a MESSAGE and a STACK: the chain of function calls that led to it, most recent first; the first line in YOUR code (not in react-dom) is where to look. React also prints the component stack. The classics: \"Cannot read properties of undefined (reading 'map')\" means the value before .map is undefined, often data that has not loaded yet; \"Objects are not valid as a React child\" means you rendered an object, not its fields; \"Too many re-renders\" means a setter is called during render; \"Each child in a list should have a unique key\"; \"Rendered more hooks than during the previous render\" means a Hook inside a condition; and \"X is not a function\" usually a wrong import.",
        webLab: reactLab({
          task:
            "The page crashes with \"TypeError: Cannot read properties of undefined (reading 'map')\" (see the console and the overlay). Two bugs: the courses state starts as undefined before the data arrives, and one course is rendered as an object. Fix both so the list shows each title.",
          files: {
            "src/App.jsx": `import { useEffect, useState } from "react";

export default function App() {
  const [courses, setCourses] = useState();

  useEffect(() => {
    setTimeout(() => setCourses([{ id: 1, title: "React" }, { id: 2, title: "Testing" }]), 100);
  }, []);

  return (
    <ul>
      {courses.map((c) => (
        <li key={c.id}>{c}</li>
      ))}
    </ul>
  );
}
`,
          },
          tests: [
            { label: "No crash while loading", check: "return overlay() === '' && errors().length === 0;", fail: "Start with an empty array: useState([])." },
            { label: "The titles render once loaded", check: "return await waitFor(() => $$('li').map((li) => text(li)).join() === 'React,Testing');", fail: "Render {c.title}, not the object." },
          ],
          solution: {
            "src/App.jsx": `import { useEffect, useState } from "react";

export default function App() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const id = setTimeout(() => setCourses([{ id: 1, title: "React" }, { id: 2, title: "Testing" }]), 100);
    return () => clearTimeout(id);
  }, []);

  return (
    <ul>
      {courses.map((c) => (
        <li key={c.id}>{c.title}</li>
      ))}
    </ul>
  );
}
`,
          },
          hint: "Read the message literally: what is undefined, and when?",
          successMessage: "Two classic errors, diagnosed from their messages.",
        }),
      },
      {
        id: "a-rx-unit-tests",
        title: "Unit testing pure JavaScript functions",
        explain:
          "A UNIT TEST checks one small piece in isolation, and pure functions (input in, output out) are the easiest: expect(applyDiscount(10000, 10)).toBe(9000). Vitest is the test runner for Vite projects (npm install -D vitest; npm test): describe groups tests, it (or test) is one case, expect(value) makes assertions with matchers such as toBe (same value), toEqual (same contents, for objects and arrays), toThrow, toContain, toHaveLength. Test the normal case, the edges (0, empty, the maximum) and invalid input. A good test name says the behaviour: \"never discounts below zero\".",
        webLab: testLab({
          testFile: "src/pricing.test.js",
          task:
            "Write unit tests for applyDiscount(price, percent) in pricing.js: it returns the discounted price rounded to the nearest naira, never below 0, and throws a RangeError for a percent below 0 or above 100. Write at least 3 tests. The checker then runs them against three broken versions.",
          files: {
            "src/pricing.test.js": `import { describe, it, expect } from "vitest";
import { applyDiscount } from "./pricing.js";

describe("applyDiscount", () => {
  // your tests here
});
`,
            "src/pricing.js": `export function applyDiscount(price, percent) {
  if (percent < 0 || percent > 100) throw new RangeError("percent must be between 0 and 100");
  return Math.max(0, Math.round(price * (1 - percent / 100)));
}
`,
          },
          tests: [
            passes,
            atLeast(3),
            catches("They catch a version that forgets to round", { "src/pricing.js": "export function applyDiscount(price, percent) {\n  if (percent < 0 || percent > 100) throw new RangeError(\"bad\");\n  return Math.max(0, price * (1 - percent / 100));\n}\n" }, "Test a price whose discount is not a whole number, such as applyDiscount(999, 15) → 849."),
            catches("They catch a version that accepts 150%", { "src/pricing.js": "export function applyDiscount(price, percent) {\n  return Math.max(0, Math.round(price * (1 - percent / 100)));\n}\n" }, "expect(() => applyDiscount(1000, 150)).toThrow(RangeError)"),
            catches("They catch a version that applies the discount wrongly", { "src/pricing.js": "export function applyDiscount(price, percent) {\n  if (percent < 0 || percent > 100) throw new RangeError(\"bad\");\n  return Math.max(0, Math.round(price - percent));\n}\n" }, "expect(applyDiscount(10000, 10)).toBe(9000)"),
          ],
          solution: {
            "src/pricing.test.js": `import { describe, it, expect } from "vitest";
import { applyDiscount } from "./pricing.js";

describe("applyDiscount", () => {
  it("takes the percentage off the price", () => {
    expect(applyDiscount(10000, 10)).toBe(9000);
  });

  it("rounds to the nearest naira", () => {
    expect(applyDiscount(999, 15)).toBe(849);
  });

  it("gives 0 at a 100% discount and full price at 0%", () => {
    expect(applyDiscount(5000, 100)).toBe(0);
    expect(applyDiscount(5000, 0)).toBe(5000);
  });

  it("rejects percentages outside 0 to 100", () => {
    expect(() => applyDiscount(1000, 150)).toThrow(RangeError);
    expect(() => applyDiscount(1000, -5)).toThrow(RangeError);
  });
});
`,
          },
          hint: "To test a throw, pass a FUNCTION to expect: expect(() => applyDiscount(1, 150)).toThrow().",
          successMessage: "Tests that catch three different real bugs.",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 76 · 13.4 – 13.6
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "rx-l76-component-tests",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 2,
    covers: ["13.4", "13.5", "13.6"],
    title: "Component Tests with React Testing Library",
    subtitle: "Rendering components, user interactions and validation, and async states",
    estimatedMinutes: 45,
    intro: "React Testing Library's guiding principle: the more your tests resemble the way your software is used, the more confidence they give you. Test what users see and do, not how the component works inside.",

    atoms: [
      {
        id: "a-rx-rtl-basics",
        title: "Component testing with React Testing Library",
        explain:
          "render(<Component />) draws it into a test document; screen queries it the way a user would. Prefer, in order: getByRole(\"button\", { name: \"Enroll\" }) (also checks accessibility), getByLabelText(\"Email\"), getByText(\"No courses\"), and getByTestId only as a last resort. getBy throws if nothing matches; queryBy returns null (for asserting absence); findBy waits (for things that appear later). Assert with expect(…).toBeInTheDocument(), toHaveTextContent, toBeDisabled. Do NOT test implementation details (state variable names, class names, which Hook is used): those tests break on every refactor and miss real bugs.",
        webLab: testLab({
          testFile: "src/CourseCard.test.jsx",
          task:
            "Write component tests for CourseCard: it shows the title as a heading, shows \"Free\" when price is 0 and the formatted price (\"₦30,000\") otherwise, and shows a \"New\" badge only when isNew is true. Query by role and text, as a user would.",
          files: {
            "src/CourseCard.test.jsx": `import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import CourseCard from "./CourseCard.jsx";

describe("CourseCard", () => {
  // your tests here
});
`,
            "src/CourseCard.jsx": `export default function CourseCard({ title, price, isNew = false }) {
  return (
    <article>
      <h2>{title}</h2>
      <p>{price === 0 ? "Free" : "₦" + price.toLocaleString("en-NG")}</p>
      {isNew && <span>New</span>}
    </article>
  );
}
`,
          },
          tests: [
            passes,
            atLeast(3),
            catches("They catch a card that always says Free", { "src/CourseCard.jsx": "export default function CourseCard({ title, price, isNew = false }) {\n  return (<article><h2>{title}</h2><p>Free</p>{isNew && <span>New</span>}</article>);\n}\n" }, "Render a paid course and expect \"₦30,000\"."),
            catches("They catch a badge that always shows", { "src/CourseCard.jsx": "export default function CourseCard({ title, price }) {\n  return (<article><h2>{title}</h2><p>{price === 0 ? \"Free\" : \"₦\" + price.toLocaleString(\"en-NG\")}</p><span>New</span></article>);\n}\n" }, "expect(screen.queryByText(\"New\")).toBeNull() when isNew is false."),
            catches("They catch a title that is not a heading", { "src/CourseCard.jsx": "export default function CourseCard({ title, price, isNew = false }) {\n  return (<article><b>{title}</b><p>{price === 0 ? \"Free\" : \"₦\" + price.toLocaleString(\"en-NG\")}</p>{isNew && <span>New</span>}</article>);\n}\n" }, "screen.getByRole(\"heading\", { name: \"React\" })"),
          ],
          solution: {
            "src/CourseCard.test.jsx": `import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import CourseCard from "./CourseCard.jsx";

describe("CourseCard", () => {
  it("shows the title as a heading and the formatted price", () => {
    render(<CourseCard title="React" price={30000} />);
    expect(screen.getByRole("heading", { name: "React" })).toBeInTheDocument();
    expect(screen.getByText("₦30,000")).toBeInTheDocument();
  });

  it("says Free for a price of 0", () => {
    render(<CourseCard title="HTML" price={0} />);
    expect(screen.getByText("Free")).toBeInTheDocument();
  });

  it("shows the New badge only for new courses", () => {
    render(<CourseCard title="TypeScript" price={12000} isNew />);
    expect(screen.getByText("New")).toBeInTheDocument();
  });

  it("hides the badge otherwise", () => {
    render(<CourseCard title="CSS" price={8000} />);
    expect(screen.queryByText("New")).toBeNull();
  });
});
`,
          },
          hint: "Each it() renders afresh; the previous render is cleaned up automatically.",
          successMessage: "Tests written from the user's side of the screen.",
        }),
      },
      {
        id: "a-rx-interaction-tests",
        title: "Testing user interactions and form validation",
        explain:
          "user-event simulates real interactions, keystroke by keystroke: const user = userEvent.setup(); await user.type(screen.getByLabelText(\"Email\"), \"ada@\"); await user.click(screen.getByRole(\"button\", { name: \"Sign up\" })). Every user action is awaited. Test a form like a user would: submit it empty and expect the error messages; fill it badly and expect specific errors; fill it correctly and expect the success (or that onSubmit was called with the right values, using a mock function from vi.fn()).",
        webLab: testLab({
          testFile: "src/SignupForm.test.jsx",
          task:
            "Test the SignupForm with user-event. Submitting it empty shows \"Enter your email\"; an email without @ shows \"Enter a valid email\"; a valid email calls the onSubmit prop (a vi.fn()) with { email } and shows no error. Write at least 3 tests.",
          files: {
            "src/SignupForm.test.jsx": `import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SignupForm from "./SignupForm.jsx";

describe("SignupForm", () => {
  // your tests here
});
`,
            "src/SignupForm.jsx": `import { useState } from "react";

export default function SignupForm({ onSubmit }) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (!email) return setError("Enter your email");
    if (!email.includes("@")) return setError("Enter a valid email");
    setError("");
    onSubmit({ email });
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <label htmlFor="email">Email</label>
      <input id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <button>Sign up</button>
      {error && <p role="alert">{error}</p>}
    </form>
  );
}
`,
          },
          tests: [
            passes,
            atLeast(3),
            catches("They catch a form that never validates", { "src/SignupForm.jsx": "import { useState } from \"react\";\nexport default function SignupForm({ onSubmit }) {\n  const [email, setEmail] = useState(\"\");\n  return (<form onSubmit={(e) => { e.preventDefault(); onSubmit({ email }); }} noValidate><label htmlFor=\"email\">Email</label><input id=\"email\" value={email} onChange={(e) => setEmail(e.target.value)} /><button>Sign up</button></form>);\n}\n" }, "Submit empty and expect the \"Enter your email\" alert."),
            catches("They catch a form that never calls onSubmit", { "src/SignupForm.jsx": "import { useState } from \"react\";\nexport default function SignupForm() {\n  const [email, setEmail] = useState(\"\");\n  const [error, setError] = useState(\"\");\n  function handleSubmit(e) { e.preventDefault(); if (!email) return setError(\"Enter your email\"); if (!email.includes(\"@\")) return setError(\"Enter a valid email\"); setError(\"\"); }\n  return (<form onSubmit={handleSubmit} noValidate><label htmlFor=\"email\">Email</label><input id=\"email\" value={email} onChange={(e) => setEmail(e.target.value)} /><button>Sign up</button>{error && <p role=\"alert\">{error}</p>}</form>);\n}\n" }, "const onSubmit = vi.fn(); … expect(onSubmit).toHaveBeenCalledWith({ email: \"ada@example.com\" })"),
            catches("They catch a form that accepts any email", { "src/SignupForm.jsx": "import { useState } from \"react\";\nexport default function SignupForm({ onSubmit }) {\n  const [email, setEmail] = useState(\"\");\n  const [error, setError] = useState(\"\");\n  function handleSubmit(e) { e.preventDefault(); if (!email) return setError(\"Enter your email\"); setError(\"\"); onSubmit({ email }); }\n  return (<form onSubmit={handleSubmit} noValidate><label htmlFor=\"email\">Email</label><input id=\"email\" value={email} onChange={(e) => setEmail(e.target.value)} /><button>Sign up</button>{error && <p role=\"alert\">{error}</p>}</form>);\n}\n" }, "Type \"ada\" and expect \"Enter a valid email\"."),
          ],
          solution: {
            "src/SignupForm.test.jsx": `import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SignupForm from "./SignupForm.jsx";

describe("SignupForm", () => {
  it("asks for an email when submitted empty", async () => {
    const user = userEvent.setup();
    render(<SignupForm onSubmit={vi.fn()} />);
    await user.click(screen.getByRole("button", { name: "Sign up" }));
    expect(screen.getByRole("alert")).toHaveTextContent("Enter your email");
  });

  it("rejects an email without @", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<SignupForm onSubmit={onSubmit} />);
    await user.type(screen.getByLabelText("Email"), "ada");
    await user.click(screen.getByRole("button", { name: "Sign up" }));
    expect(screen.getByRole("alert")).toHaveTextContent("Enter a valid email");
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("submits a valid email", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<SignupForm onSubmit={onSubmit} />);
    await user.type(screen.getByLabelText("Email"), "ada@example.com");
    await user.click(screen.getByRole("button", { name: "Sign up" }));
    expect(onSubmit).toHaveBeenCalledWith({ email: "ada@example.com" });
    expect(screen.queryByRole("alert")).toBeNull();
  });
});
`,
          },
          hint: "Await every user.type and user.click.",
          successMessage: "The form is tested by filling it in, the way a person would.",
        }),
      },
      {
        id: "a-rx-async-tests",
        title: "Testing asynchronous loading and error states",
        explain:
          "When something appears later, use the findBy queries, which wait (up to a second by default) for it: expect(await screen.findByText(\"React\")).toBeInTheDocument(). For something that should DISAPPEAR, use waitFor or waitForElementToBeRemoved. Assert the loading state immediately after render, then await the final state. Make the data source controllable: pass the loader in as a prop or mock the service module, so the test chooses success, empty or failure. Never wait with fixed timeouts (setTimeout in tests): they are slow and flaky.",
        webLab: testLab({
          testFile: "src/CourseList.test.jsx",
          task:
            "CourseList takes a load prop (a function returning a promise of courses). Test three states: it shows \"Loading…\" first and then the titles; it shows \"No courses yet\" for an empty list; and it shows the alert \"Could not load courses\" when load rejects. Use vi.fn().mockResolvedValue / mockRejectedValue and findBy queries.",
          files: {
            "src/CourseList.test.jsx": `import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import CourseList from "./CourseList.jsx";

describe("CourseList", () => {
  // your tests here
});
`,
            "src/CourseList.jsx": `import { useEffect, useState } from "react";

export default function CourseList({ load }) {
  const [state, setState] = useState({ status: "loading", courses: [] });

  useEffect(() => {
    let ignore = false;
    load()
      .then((courses) => !ignore && setState({ status: "ready", courses }))
      .catch(() => !ignore && setState({ status: "error", courses: [] }));
    return () => {
      ignore = true;
    };
  }, [load]);

  if (state.status === "loading") return <p>Loading…</p>;
  if (state.status === "error") return <p role="alert">Could not load courses</p>;
  if (state.courses.length === 0) return <p>No courses yet</p>;
  return (
    <ul>
      {state.courses.map((c) => (
        <li key={c.id}>{c.title}</li>
      ))}
    </ul>
  );
}
`,
          },
          tests: [
            passes,
            atLeast(3),
            catches("They catch a list that never shows the loading state", { "src/CourseList.jsx": "import { useEffect, useState } from \"react\";\nexport default function CourseList({ load }) {\n  const [state, setState] = useState({ status: \"ready\", courses: [] });\n  useEffect(() => { load().then((courses) => setState({ status: \"ready\", courses })).catch(() => setState({ status: \"error\", courses: [] })); }, [load]);\n  if (state.status === \"error\") return <p role=\"alert\">Could not load courses</p>;\n  if (state.courses.length === 0) return <p>No courses yet</p>;\n  return <ul>{state.courses.map((c) => <li key={c.id}>{c.title}</li>)}</ul>;\n}\n" }, "Right after render, expect(screen.getByText(\"Loading…\")).toBeInTheDocument()."),
            catches("They catch a list that hides errors", { "src/CourseList.jsx": "import { useEffect, useState } from \"react\";\nexport default function CourseList({ load }) {\n  const [state, setState] = useState({ status: \"loading\", courses: [] });\n  useEffect(() => { load().then((courses) => setState({ status: \"ready\", courses })).catch(() => setState({ status: \"ready\", courses: [] })); }, [load]);\n  if (state.status === \"loading\") return <p>Loading…</p>;\n  if (state.courses.length === 0) return <p>No courses yet</p>;\n  return <ul>{state.courses.map((c) => <li key={c.id}>{c.title}</li>)}</ul>;\n}\n" }, "load: vi.fn().mockRejectedValue(new Error(\"down\")), then await screen.findByRole(\"alert\")."),
          ],
          solution: {
            "src/CourseList.test.jsx": `import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import CourseList from "./CourseList.jsx";

describe("CourseList", () => {
  it("shows Loading, then the courses", async () => {
    const load = vi.fn().mockResolvedValue([{ id: 1, title: "React" }]);
    render(<CourseList load={load} />);
    expect(screen.getByText("Loading…")).toBeInTheDocument();
    expect(await screen.findByText("React")).toBeInTheDocument();
  });

  it("shows an empty state", async () => {
    render(<CourseList load={vi.fn().mockResolvedValue([])} />);
    expect(await screen.findByText("No courses yet")).toBeInTheDocument();
  });

  it("shows an error when loading fails", async () => {
    render(<CourseList load={vi.fn().mockRejectedValue(new Error("down"))} />);
    expect(await screen.findByRole("alert")).toHaveTextContent("Could not load courses");
  });
});
`,
          },
          hint: "getBy for what is there now; await findBy for what appears later.",
          successMessage: "Every state of an async component, tested without a single fixed wait.",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 77 · 13.7 – 13.9
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "rx-l77-mocks-routing",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 3,
    covers: ["13.7", "13.8", "13.9"],
    title: "Mocking APIs, Routing and Integration Tests",
    subtitle: "Faking the network, testing navigation, and testing components together",
    estimatedMinutes: 45,
    intro: "Real apps fetch data and navigate between pages. Tests need to control both, without a real server and without a real browser address bar.",

    atoms: [
      {
        id: "a-rx-mock-api",
        title: "Mocking API requests",
        explain:
          "Tests must not depend on a real server: it is slow, changes, and may be down. Options: replace fetch for the test with vi.stubGlobal(\"fetch\", vi.fn().mockResolvedValue(new Response(JSON.stringify(data), { status: 200 }))); mock your service module with vi.mock(\"./api/products.js\") in Vitest; or, the most realistic, Mock Service Worker (MSW), which intercepts requests at the network level so your real fetch code runs unchanged. Assert on what users see, and, where it matters, that the right request was made (expect(fetch).toHaveBeenCalledWith(\"/api/products?q=bag\", expect.anything()) or by checking the mock's calls).",
        webLab: testLab({
          testFile: "src/ProductSearch.test.jsx",
          task:
            "Test ProductSearch with fetch stubbed (vi.stubGlobal(\"fetch\", vi.fn()...)). Test 1: searching \"bag\" requests /api/products?q=bag and shows the returned product names. Test 2: a 500 response shows the alert \"Search failed\". Use new Response(JSON.stringify(...), { status }) for the fake responses.",
          files: {
            "src/ProductSearch.test.jsx": `import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ProductSearch from "./ProductSearch.jsx";

describe("ProductSearch", () => {
  // your tests here
});
`,
            "src/ProductSearch.jsx": `import { useState } from "react";

export default function ProductSearch() {
  const [q, setQ] = useState("");
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/products?q=" + encodeURIComponent(q));
    if (!res.ok) return setError("Search failed");
    setResults(await res.json());
  }

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="q">Search products</label>
      <input id="q" value={q} onChange={(e) => setQ(e.target.value)} />
      <button>Search</button>
      {error && <p role="alert">{error}</p>}
      <ul>
        {results.map((p) => (
          <li key={p.id}>{p.name}</li>
        ))}
      </ul>
    </form>
  );
}
`,
          },
          tests: [
            passes,
            atLeast(2),
            catches("They catch a search that ignores the query", { "src/ProductSearch.jsx": "import { useState } from \"react\";\nexport default function ProductSearch() {\n  const [q, setQ] = useState(\"\");\n  const [results, setResults] = useState([]);\n  const [error, setError] = useState(\"\");\n  async function handleSubmit(e) { e.preventDefault(); const res = await fetch(\"/api/products\"); if (!res.ok) return setError(\"Search failed\"); setResults(await res.json()); }\n  return (<form onSubmit={handleSubmit}><label htmlFor=\"q\">Search products</label><input id=\"q\" value={q} onChange={(e) => setQ(e.target.value)} /><button>Search</button>{error && <p role=\"alert\">{error}</p>}<ul>{results.map((p) => <li key={p.id}>{p.name}</li>)}</ul></form>);\n}\n" }, "Check the URL the mock was called with: expect(fetch.mock.calls[0][0]).toBe(\"/api/products?q=bag\")."),
            catches("They catch a search that hides server errors", { "src/ProductSearch.jsx": "import { useState } from \"react\";\nexport default function ProductSearch() {\n  const [q, setQ] = useState(\"\");\n  const [results, setResults] = useState([]);\n  async function handleSubmit(e) { e.preventDefault(); const res = await fetch(\"/api/products?q=\" + encodeURIComponent(q)); if (!res.ok) return; setResults(await res.json()); }\n  return (<form onSubmit={handleSubmit}><label htmlFor=\"q\">Search products</label><input id=\"q\" value={q} onChange={(e) => setQ(e.target.value)} /><button>Search</button><ul>{results.map((p) => <li key={p.id}>{p.name}</li>)}</ul></form>);\n}\n" }, "Stub a 500 response and expect the \"Search failed\" alert."),
          ],
          solution: {
            "src/ProductSearch.test.jsx": `import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ProductSearch from "./ProductSearch.jsx";

const respond = (body, status = 200) => new Response(JSON.stringify(body), { status });

describe("ProductSearch", () => {
  it("searches with the query and shows the results", async () => {
    const fetchMock = vi.fn().mockResolvedValue(respond([{ id: 1, name: "Ankara tote bag" }]));
    vi.stubGlobal("fetch", fetchMock);
    const user = userEvent.setup();
    render(<ProductSearch />);
    await user.type(screen.getByLabelText("Search products"), "bag");
    await user.click(screen.getByRole("button", { name: "Search" }));
    expect(await screen.findByText("Ankara tote bag")).toBeInTheDocument();
    expect(fetchMock.mock.calls[0][0]).toBe("/api/products?q=bag");
  });

  it("shows an error when the server fails", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(respond({}, 500)));
    const user = userEvent.setup();
    render(<ProductSearch />);
    await user.type(screen.getByLabelText("Search products"), "bag");
    await user.click(screen.getByRole("button", { name: "Search" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("Search failed");
  });
});
`,
          },
          hint: "vi.stubGlobal is undone after each test automatically here (as with Vitest's unstubGlobals option).",
          successMessage: "The network under your control: success and failure, on demand.",
        }),
      },
      {
        id: "a-rx-routing-tests",
        title: "Testing routing and navigation",
        explain:
          "Render the component inside a MemoryRouter (from react-router) with initialEntries set to the URL you want to start at, plus the Routes the test needs: render(<MemoryRouter initialEntries={[\"/courses/react\"]}><Routes><Route path=\"/courses/:id\" element={<CoursePage />} /></Routes></MemoryRouter>). Then test like a user: click a link and expect the next page's heading. For pages that read search params, start at a URL with them. A small renderWithRouter(ui, { route }) helper keeps tests short.",
        webLab: testLab({
          testFile: "src/Catalogue.test.jsx",
          task:
            "Test the catalogue's navigation. Test 1: starting at /courses, clicking the \"React\" link shows the heading \"React\" on its course page. Test 2: starting at /courses/cobol, the page shows \"Course not found\". Use the renderAt(path) helper in routes.jsx.",
          files: {
            "src/Catalogue.test.jsx": `import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderAt } from "./routes.jsx";

describe("catalogue navigation", () => {
  // your tests here
});
`,
            "src/routes.jsx": `import { render } from "@testing-library/react";
import { MemoryRouter, Routes, Route, Link, useParams } from "react-router";

const courses = [
  { id: "react", title: "React" },
  { id: "ts", title: "TypeScript" },
];

function List() {
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

function Course() {
  const { id } = useParams();
  const course = courses.find((c) => c.id === id);
  return <h1>{course ? course.title : "Course not found"}</h1>;
}

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/courses" element={<List />} />
      <Route path="/courses/:id" element={<Course />} />
    </Routes>
  );
}

export function renderAt(path) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <AppRoutes />
    </MemoryRouter>
  );
}
`,
          },
          tests: [
            passes,
            atLeast(2),
            catches("They catch links that go to the wrong course", { "src/routes.jsx": "import { render } from \"@testing-library/react\";\nimport { MemoryRouter, Routes, Route, Link, useParams } from \"react-router\";\nconst courses = [{ id: \"react\", title: \"React\" }, { id: \"ts\", title: \"TypeScript\" }];\nfunction List() { return <ul>{courses.map((c) => <li key={c.id}><Link to=\"/courses/ts\">{c.title}</Link></li>)}</ul>; }\nfunction Course() { const { id } = useParams(); const course = courses.find((c) => c.id === id); return <h1>{course ? course.title : \"Course not found\"}</h1>; }\nexport function renderAt(path) { return render(<MemoryRouter initialEntries={[path]}><Routes><Route path=\"/courses\" element={<List />} /><Route path=\"/courses/:id\" element={<Course />} /></Routes></MemoryRouter>); }\n" }, "After clicking React, expect the heading named React."),
            catches("They catch a missing not-found state", { "src/routes.jsx": "import { render } from \"@testing-library/react\";\nimport { MemoryRouter, Routes, Route, Link, useParams } from \"react-router\";\nconst courses = [{ id: \"react\", title: \"React\" }, { id: \"ts\", title: \"TypeScript\" }];\nfunction List() { return <ul>{courses.map((c) => <li key={c.id}><Link to={\"/courses/\" + c.id}>{c.title}</Link></li>)}</ul>; }\nfunction Course() { const { id } = useParams(); const course = courses.find((c) => c.id === id) ?? courses[0]; return <h1>{course.title}</h1>; }\nexport function renderAt(path) { return render(<MemoryRouter initialEntries={[path]}><Routes><Route path=\"/courses\" element={<List />} /><Route path=\"/courses/:id\" element={<Course />} /></Routes></MemoryRouter>); }\n" }, "renderAt(\"/courses/cobol\") and expect \"Course not found\"."),
          ],
          solution: {
            "src/Catalogue.test.jsx": `import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderAt } from "./routes.jsx";

describe("catalogue navigation", () => {
  it("opens a course from the list", async () => {
    const user = userEvent.setup();
    renderAt("/courses");
    await user.click(screen.getByRole("link", { name: "React" }));
    expect(await screen.findByRole("heading", { name: "React" })).toBeInTheDocument();
  });

  it("shows not found for an unknown course", () => {
    renderAt("/courses/cobol");
    expect(screen.getByRole("heading", { name: "Course not found" })).toBeInTheDocument();
  });
});
`,
          },
          hint: "getByRole(\"link\", { name: \"React\" }) finds the link by its text.",
          successMessage: "Navigation tested by clicking, starting from any URL.",
        }),
      },
      {
        id: "a-rx-integration-tests",
        title: "Integration tests across multiple components",
        explain:
          "An INTEGRATION TEST renders several real components together and tests a whole user flow: type in the search box, pick a filter, and check the list updates; add to cart in a product card and check the header badge. These catch the bugs unit tests miss: wrong props passed between components, state lifted to the wrong place, a callback not wired up. Kent C. Dodds' \"testing trophy\" puts most tests here, with fewer unit tests underneath and a few end-to-end tests on top: they give the most confidence per test.",
        webLab: testLab({
          testFile: "src/Shop.test.jsx",
          task:
            "Write an integration test of the whole Shop (header, product cards and cart panel are separate components sharing state). Add the tote bag twice and the sandals once with the Add buttons, then expect the header to say \"Cart (3)\" and the cart total to show \"Total: ₦33,000\". Write at least 1 test, and query only by what a user sees.",
          files: {
            "src/Shop.test.jsx": `import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Shop from "./Shop.jsx";

describe("Shop", () => {
  // your integration test here
});
`,
            "src/Shop.jsx": `import { useState } from "react";

const products = [
  { id: "p1", name: "Tote bag", price: 7500 },
  { id: "p2", name: "Sandals", price: 18000 },
];
const naira = (n) => "₦" + n.toLocaleString("en-NG");

function Header({ count }) {
  return <header>Cart ({count})</header>;
}

function ProductCard({ product, onAdd }) {
  return (
    <article>
      <h2>{product.name}</h2>
      <button onClick={() => onAdd(product)} aria-label={"Add " + product.name}>Add</button>
    </article>
  );
}

function CartPanel({ items }) {
  const total = items.reduce((s, i) => s + i.price, 0);
  return <p>Total: {naira(total)}</p>;
}

export default function Shop() {
  const [items, setItems] = useState([]);
  const add = (p) => setItems((list) => [...list, p]);
  return (
    <>
      <Header count={items.length} />
      {products.map((p) => (
        <ProductCard key={p.id} product={p} onAdd={add} />
      ))}
      <CartPanel items={items} />
    </>
  );
}
`,
          },
          tests: [
            passes,
            catches("They catch a header that is not wired to the cart", { "src/Shop.jsx": "import { useState } from \"react\";\nconst products = [{ id: \"p1\", name: \"Tote bag\", price: 7500 }, { id: \"p2\", name: \"Sandals\", price: 18000 }];\nconst naira = (n) => \"₦\" + n.toLocaleString(\"en-NG\");\nexport default function Shop() {\n  const [items, setItems] = useState([]);\n  return (<><header>Cart (0)</header>{products.map((p) => <article key={p.id}><h2>{p.name}</h2><button aria-label={\"Add \" + p.name} onClick={() => setItems((l) => [...l, p])}>Add</button></article>)}<p>Total: {naira(items.reduce((s, i) => s + i.price, 0))}</p></>);\n}\n" }, "Expect the header text \"Cart (3)\" after adding."),
            catches("They catch a total that only counts the last item", { "src/Shop.jsx": "import { useState } from \"react\";\nconst products = [{ id: \"p1\", name: \"Tote bag\", price: 7500 }, { id: \"p2\", name: \"Sandals\", price: 18000 }];\nconst naira = (n) => \"₦\" + n.toLocaleString(\"en-NG\");\nexport default function Shop() {\n  const [items, setItems] = useState([]);\n  const last = items[items.length - 1];\n  return (<><header>Cart ({items.length})</header>{products.map((p) => <article key={p.id}><h2>{p.name}</h2><button aria-label={\"Add \" + p.name} onClick={() => setItems((l) => [...l, p])}>Add</button></article>)}<p>Total: {naira(last ? last.price : 0)}</p></>);\n}\n" }, "Expect \"Total: ₦33,000\"."),
          ],
          solution: {
            "src/Shop.test.jsx": `import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Shop from "./Shop.jsx";

describe("Shop", () => {
  it("adds products to the cart and updates the header and total", async () => {
    const user = userEvent.setup();
    render(<Shop />);
    await user.click(screen.getByRole("button", { name: "Add Tote bag" }));
    await user.click(screen.getByRole("button", { name: "Add Tote bag" }));
    await user.click(screen.getByRole("button", { name: "Add Sandals" }));
    expect(screen.getByRole("banner")).toHaveTextContent("Cart (3)");
    expect(screen.getByText("Total: ₦33,000")).toBeInTheDocument();
  });
});
`,
          },
          hint: "A <header> has the role banner.",
          successMessage: "One test, three components, and the wiring between them proven.",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 78 · 13.10 – 13.12
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "rx-l78-e2e-flaky",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 4,
    covers: ["13.10", "13.11", "13.12"],
    title: "End-to-End Tests, Coverage and Flaky Tests",
    subtitle: "Playwright, what coverage does and does not tell you, and tests that fail at random",
    estimatedMinutes: 35,
    intro: "Component tests run in a simulated page. End-to-end tests drive a real browser through the real app. Both can mislead you, through coverage numbers and through flakiness.",

    atoms: [
      {
        id: "a-rx-playwright",
        title: "End-to-end testing with Playwright",
        explain:
          "An END-TO-END (E2E) test runs the whole application, frontend and backend, in a real browser, exactly as a user would: open the page, sign in, add to cart, check out. PLAYWRIGHT (npm init playwright@latest) drives Chromium, Firefox and WebKit, waits automatically for elements, and records traces for failed runs. Its locators mirror Testing Library: page.getByRole(\"button\", { name: \"Sign in\" }). E2E tests are the most realistic and the slowest and most fragile, so keep a few for the critical journeys (sign-up, login, checkout) and run them against a test environment with test accounts.",
        example: "// tests/checkout.spec.js\nimport { test, expect } from \"@playwright/test\";\n\ntest(\"a student can enroll in a course\", async ({ page }) => {\n  await page.goto(\"/courses/react\");\n  await page.getByRole(\"button\", { name: \"Enroll\" }).click();\n  await page.getByLabel(\"Email\").fill(\"test-student@example.com\");\n  await page.getByLabel(\"Password\").fill(process.env.TEST_PASSWORD);\n  await page.getByRole(\"button\", { name: \"Sign in\" }).click();\n  await expect(page.getByRole(\"heading\", { name: \"You are enrolled\" })).toBeVisible();\n});\n\n// run: npx playwright test",
        decision: {
          scenario: "Your app has 400 component tests. You want confidence that checkout works with the real payment sandbox, the real API and the real browser.",
          question: "What should you add?",
          options: [
            { id: "a", text: "A small number of Playwright E2E tests for the checkout journey, run against a test environment", why: "Only an E2E test exercises every real layer together; a few for critical paths give that confidence without a slow, fragile suite." },
            { id: "b", text: "Convert all 400 component tests into E2E tests", whyWrong: "The suite would become very slow and fragile, and failures harder to locate." },
            { id: "c", text: "Run the component tests twice", whyWrong: "They still never touch the real API or payment sandbox." },
            { id: "d", text: "Test checkout manually before each release only", whyWrong: "Manual checks are slow and easy to skip under pressure." },
          ],
          correct: "a",
          aftermath: "Many fast tests underneath, a few E2E tests on top for the journeys that matter most.",
        },
      },
      {
        id: "a-rx-coverage",
        title: "Understanding test coverage and its limitations",
        explain:
          "COVERAGE (vitest run --coverage) reports which lines, branches and functions your tests executed. It is useful for finding UNTESTED code: a whole error branch never run. But 100% coverage does not mean the code is correct: a test can execute a line without checking its result (no expect at all), and coverage cannot see missing code (a validation you never wrote). Chasing the number produces shallow tests. Use it as a map of gaps, aim for meaningful tests of important behaviour, and judge tests by whether they would catch real bugs, as this module's labs do.",
        decision: {
          scenario: "A pull request raises coverage from 60% to 95% with tests like: it(\"renders\", () => { render(<Checkout />); }) and no assertions.",
          question: "What is the best review comment?",
          options: [
            { id: "a", text: "These tests execute code but check nothing; add assertions about what users see, or they cannot catch any bug", why: "Coverage measures what ran, not what was verified." },
            { id: "b", text: "Approve: 95% coverage", whyWrong: "The number rose; the confidence did not." },
            { id: "c", text: "Ask for 100%", whyWrong: "More empty tests would not help either." },
            { id: "d", text: "Delete all the tests", whyWrong: "Improve them; rendering without crashing is a start." },
          ],
          correct: "a",
          aftermath: "Coverage finds untested code; only assertions catch bugs.",
        },
      },
      {
        id: "a-rx-flaky-tests",
        title: "Identifying flaky tests",
        explain:
          "A FLAKY test sometimes passes and sometimes fails with no code change. Causes: asserting before async work finishes (use findBy or waitFor, never fixed sleeps); depending on test ORDER or shared state (each test must set up its own data; mocks reset between tests); real time and dates (fake the clock); random data; animations; and real network calls. Flaky tests are worse than no tests: people learn to ignore failures, and real bugs slip through. Find them by running the suite repeatedly; fix them, or quarantine them until fixed.",
        webLab: testLab({
          testFile: "src/Notice.test.jsx",
          task:
            "This test is flaky: it checks for the message right after clicking, but the message appears after a short delay, so it fails (and on a slow machine a fixed wait would fail too). Fix the test so it reliably waits for the message, without any fixed timeout.",
          files: {
            "src/Notice.test.jsx": `import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Notice from "./Notice.jsx";

describe("Notice", () => {
  it("shows a confirmation after saving", async () => {
    const user = userEvent.setup();
    render(<Notice />);
    await user.click(screen.getByRole("button", { name: "Save" }));
    expect(screen.getByText("Saved!")).toBeInTheDocument();
  });
});
`,
            "src/Notice.jsx": `import { useState } from "react";

export default function Notice() {
  const [saved, setSaved] = useState(false);
  return (
    <>
      <button onClick={() => setTimeout(() => setSaved(true), 150)}>Save</button>
      {saved && <p role="status">Saved!</p>}
    </>
  );
}
`,
          },
          tests: [
            passes,
            { label: "No fixed waits", check: "return !/setTimeout|new Promise/.test(code('src/Notice.test.jsx')) && /findBy|waitFor/.test(code('src/Notice.test.jsx'));", fail: "expect(await screen.findByText(\"Saved!\")).toBeInTheDocument();" },
            catches("It still catches a button that never saves", { "src/Notice.jsx": "export default function Notice() {\n  return <button>Save</button>;\n}\n" }, "The test must fail when the message never appears."),
          ],
          solution: {
            "src/Notice.test.jsx": `import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Notice from "./Notice.jsx";

describe("Notice", () => {
  it("shows a confirmation after saving", async () => {
    const user = userEvent.setup();
    render(<Notice />);
    await user.click(screen.getByRole("button", { name: "Save" }));
    expect(await screen.findByText("Saved!")).toBeInTheDocument();
  });
});
`,
          },
          hint: "findByText waits up to a second, checking repeatedly.",
          successMessage: "A test that waits for the thing itself, not for an arbitrary amount of time.",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 79 · 13.13 – 13.14
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "rx-l79-lint-ci",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 5,
    covers: ["13.13", "13.14"],
    title: "Linting, Formatting and Continuous Integration",
    subtitle: "ESLint and Prettier, and running every check automatically on every change",
    estimatedMinutes: 35,
    intro: "Tests only help if they run. Linters catch whole classes of bugs before tests do. CI makes both happen on every change, whoever makes it.",

    atoms: [
      {
        id: "a-rx-eslint-prettier",
        title: "Linting and formatting with ESLint and Prettier",
        explain:
          "ESLINT analyses code for BUGS and risky patterns; a Vite React project includes it (npm run lint) with eslint-plugin-react-hooks, whose rules catch Hooks called conditionally (rules-of-hooks) and effects with missing dependencies (exhaustive-deps), and eslint-plugin-react-refresh. PRETTIER only FORMATS: indentation, quotes, line length, with almost no options, so a team never argues about style; run it on save in your editor and check it in CI (prettier --check .). Keep their jobs separate (eslint-config-prettier turns off ESLint's formatting rules). Treat lint errors as bugs, not noise.",
        example: "src/Profile.jsx\n  12:9   error    React Hook \"useState\" is called conditionally. React Hooks must be called in the exact same order in every component render   react-hooks/rules-of-hooks\n  20:6   warning  React Hook useEffect has a missing dependency: 'userId'. Either include it or remove the dependency array   react-hooks/exhaustive-deps",
        decision: {
          scenario: "ESLint reports \"React Hook useEffect has a missing dependency: 'userId'\" on an effect that fetches the user's profile. A teammate suggests adding // eslint-disable-next-line to silence it.",
          question: "What should you do?",
          options: [
            { id: "a", text: "Add userId to the dependency array, so the profile reloads when the user changes", why: "The rule found a real bug: switching users would keep showing the old profile." },
            { id: "b", text: "Disable the rule for that line", whyWrong: "The stale-data bug stays; the warning was correct." },
            { id: "c", text: "Turn the rule off for the whole project", whyWrong: "It hides this bug and every future one like it." },
            { id: "d", text: "Run Prettier to fix it", whyWrong: "Prettier only formats; it does not change logic." },
          ],
          correct: "a",
          aftermath: "Lint warnings about Hooks are almost always real bugs.",
        },
      },
      {
        id: "a-rx-ci",
        title: "Continuous integration fundamentals",
        explain:
          "CONTINUOUS INTEGRATION (CI) runs the project's checks automatically on every push and pull request, on a clean machine, so \"works on my laptop\" is not enough to merge. GitHub Actions workflows live in .github/workflows/*.yml: on: pull_request and push; a job that checks out the code, sets up Node, runs npm ci (a clean install from package-lock.json), then npm run lint, npm test (vitest run, once, not in watch mode) and npm run build. A failing step blocks the merge (with branch protection). Keep CI fast, cache dependencies, and never let it stay red.",
        webLab: reactLab({
          task:
            "Write the GitHub Actions workflow in .github/workflows/ci.yml. It must run on pull_request and on push to main; use ubuntu-latest; check out the code (actions/checkout@v4) and set up Node 22 with npm caching (actions/setup-node@v4); then run, in this order, npm ci, npm run lint, npm test -- --run and npm run build.",
          files: {
            ".github/workflows/ci.yml": "name: CI\n",
            "src/App.jsx": "export default function App() {\n  return <p>This lab checks your workflow file.</p>;\n}\n",
          },
          readOnly: ["src/App.jsx"],
          open: ".github/workflows/ci.yml",
          tests: [
            { label: "Runs on pull requests and pushes to main", check: "const y = raw('.github/workflows/ci.yml'); return /\\bon:\\s*\\n[\\s\\S]*pull_request/.test(y) && /push:\\s*\\n\\s+branches:\\s*\\[?\\s*\"?main\"?/.test(y);", fail: "on:\n  pull_request:\n  push:\n    branches: [main]" },
            { label: "Checks out the code and sets up Node 22 with caching", check: "const y = raw('.github/workflows/ci.yml'); return /runs-on:\\s*ubuntu-latest/.test(y) && /uses:\\s*actions\\/checkout@v4/.test(y) && /uses:\\s*actions\\/setup-node@v4/.test(y) && /node-version:\\s*\"?22/.test(y) && /cache:\\s*\"?npm/.test(y);", fail: "with:\n  node-version: 22\n  cache: npm" },
            { label: "Installs, lints, tests and builds, in order", check: "const y = raw('.github/workflows/ci.yml'); const order = ['npm ci', 'npm run lint', 'npm test -- --run', 'npm run build'].map((s) => y.indexOf('run: ' + s)); return order.every((i) => i > -1) && order.every((v, i, a) => i === 0 || v > a[i - 1]);", fail: "Four run: steps in that order." },
          ],
          solution: {
            ".github/workflows/ci.yml": `name: CI

on:
  pull_request:
  push:
    branches: [main]

jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - run: npm run lint
      - run: npm test -- --run
      - run: npm run build
`,
          },
          hint: "YAML is indentation-sensitive: two spaces per level, never tabs.",
          successMessage: "Every pull request now proves itself before it can be merged.",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 80 · 13.P
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "rx-l80-m13-project",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 6,
    covers: ["13.P"],
    title: "Practical: A Test Suite",
    subtitle: "Tests for a registration form, product filters, a shopping cart and API error handling",
    estimatedMinutes: 70,
    intro: "The Module 13 practical: four test files for four features. Each is checked against a broken version of its feature, so only tests that verify real, user-visible behaviour will pass.",

    atoms: [
      {
        id: "a-rx-m13-project",
        title: "Write the test suite",
        explain:
          "Test behaviour a user would notice, through the UI: what they see, type and click. The features are in src/features.jsx (read-only). Write your tests in src/features.test.jsx: at least one test per feature, and enough that every broken version below is caught.",
        webLab: testLab({
          testFile: "src/features.test.jsx",
          task:
            "Write tests for the four features in features.jsx: RegistrationForm (an empty submit shows \"Name is required\"; a valid one calls onRegister with { name }), ProductFilters (choosing \"Shoes\" in the Category select leaves only Sandals listed), Cart (adding two items shows \"2 items\" and \"Total: ₦25,500\") and ProductLoader (a failed load prop shows the alert \"Products could not be loaded\" and a Retry button that calls load again). Every broken version must be caught.",
          files: {
            "src/features.test.jsx": `import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RegistrationForm, ProductFilters, Cart, ProductLoader } from "./features.jsx";

// your tests here
`,
            "src/features.jsx": `import { useEffect, useState } from "react";

export function RegistrationForm({ onRegister }) {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        if (!name.trim()) return setError("Name is required");
        setError("");
        onRegister({ name: name.trim() });
      }}
    >
      <label htmlFor="name">Name</label>
      <input id="name" value={name} onChange={(e) => setName(e.target.value)} />
      <button>Register</button>
      {error && <p role="alert">{error}</p>}
    </form>
  );
}

const PRODUCTS = [
  { id: 1, name: "Tote bag", category: "Bags" },
  { id: 2, name: "Sandals", category: "Shoes" },
  { id: 3, name: "Backpack", category: "Bags" },
];

export function ProductFilters() {
  const [category, setCategory] = useState("All");
  const visible = PRODUCTS.filter((p) => category === "All" || p.category === category);
  return (
    <>
      <label htmlFor="cat">Category</label>
      <select id="cat" value={category} onChange={(e) => setCategory(e.target.value)}>
        <option>All</option>
        <option>Bags</option>
        <option>Shoes</option>
      </select>
      <ul aria-label="Products">
        {visible.map((p) => (
          <li key={p.id}>{p.name}</li>
        ))}
      </ul>
    </>
  );
}

const ITEMS = [
  { id: "a", name: "Tote bag", price: 7500 },
  { id: "b", name: "Sandals", price: 18000 },
];

export function Cart() {
  const [lines, setLines] = useState([]);
  const total = lines.reduce((s, l) => s + l.price, 0);
  return (
    <>
      {ITEMS.map((i) => (
        <button key={i.id} onClick={() => setLines((l) => [...l, i])}>
          Add {i.name}
        </button>
      ))}
      <p>{lines.length} items</p>
      <p>Total: ₦{total.toLocaleString("en-NG")}</p>
    </>
  );
}

export function ProductLoader({ load }) {
  const [state, setState] = useState("loading");
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    let ignore = false;
    setState("loading");
    load()
      .then(() => !ignore && setState("ready"))
      .catch(() => !ignore && setState("error"));
    return () => {
      ignore = true;
    };
  }, [load, attempt]);
  if (state === "loading") return <p>Loading…</p>;
  if (state === "error")
    return (
      <>
        <p role="alert">Products could not be loaded</p>
        <button onClick={() => setAttempt((a) => a + 1)}>Retry</button>
      </>
    );
  return <p>Products loaded</p>;
}
`,
          },
          revealSolution: false,
          tests: [
            passes,
            atLeast(4),
            catches("Catches a registration form that skips validation", { "src/features.jsx": null }, "Submit the form empty and expect \"Name is required\"."),
            catches("Catches filters that ignore the category", { "src/features.jsx": null }, "Choose Shoes and expect only Sandals."),
            catches("Catches a cart total that is wrong", { "src/features.jsx": null }, "Add both items and expect \"Total: ₦25,500\"."),
            catches("Catches a loader with no Retry", { "src/features.jsx": null }, "Fail the load, click Retry, and expect load to have been called twice."),
          ],
          solution: {
            "src/features.test.jsx": `import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RegistrationForm, ProductFilters, Cart, ProductLoader } from "./features.jsx";

describe("RegistrationForm", () => {
  it("requires a name", async () => {
    const user = userEvent.setup();
    const onRegister = vi.fn();
    render(<RegistrationForm onRegister={onRegister} />);
    await user.click(screen.getByRole("button", { name: "Register" }));
    expect(screen.getByRole("alert")).toHaveTextContent("Name is required");
    expect(onRegister).not.toHaveBeenCalled();
  });

  it("registers a valid name", async () => {
    const user = userEvent.setup();
    const onRegister = vi.fn();
    render(<RegistrationForm onRegister={onRegister} />);
    await user.type(screen.getByLabelText("Name"), "Ada");
    await user.click(screen.getByRole("button", { name: "Register" }));
    expect(onRegister).toHaveBeenCalledWith({ name: "Ada" });
  });
});

describe("ProductFilters", () => {
  it("filters by category", async () => {
    const user = userEvent.setup();
    render(<ProductFilters />);
    await user.selectOptions(screen.getByLabelText("Category"), "Shoes");
    const items = screen.getAllByRole("listitem").map((li) => li.textContent);
    expect(items).toEqual(["Sandals"]);
  });
});

describe("Cart", () => {
  it("counts items and totals them", async () => {
    const user = userEvent.setup();
    render(<Cart />);
    await user.click(screen.getByRole("button", { name: "Add Tote bag" }));
    await user.click(screen.getByRole("button", { name: "Add Sandals" }));
    expect(screen.getByText("2 items")).toBeInTheDocument();
    expect(screen.getByText("Total: ₦25,500")).toBeInTheDocument();
  });
});

describe("ProductLoader", () => {
  it("shows an error and retries", async () => {
    const user = userEvent.setup();
    const load = vi.fn().mockRejectedValue(new Error("down"));
    render(<ProductLoader load={load} />);
    expect(await screen.findByRole("alert")).toHaveTextContent("Products could not be loaded");
    await user.click(screen.getByRole("button", { name: "Retry" }));
    expect(load).toHaveBeenCalledTimes(2);
  });
});
`,
          },
          hint: "Write one describe block per feature, and run each broken version in your head: which of your expects would fail?",
          successMessage: "A suite that would catch real regressions in all four features.",
        }),
      },
    ],
    task: {
      title: "Module 13 practical: test your own app",
      intro: "Add a real test setup to one of your earlier projects: npm install -D vitest @testing-library/react @testing-library/user-event @testing-library/jest-dom jsdom, with test: { environment: \"jsdom\" } in vite.config.js.",
      prompts: [
        "Write tests for your registration form (Module 5), product filters, shopping cart (Module 7) and API error handling (Module 9).",
        "Mock the API with MSW or vi.mock, never the real server.",
        "Add one Playwright test for the most important journey.",
        "Add the CI workflow from Lesson 79 and see it pass on a pull request; then break a test on purpose and see it block the merge.",
        "Mastery checkpoint: for one test, show the bug it would catch by breaking the code and watching it fail, and explain why it tests behaviour rather than implementation.",
      ],
      closing: "Next: Module 14, performance and accessibility.",
    },
    requirements: { read: true, video: false, assessment: true },
  },
];

/* The four broken versions of the practical's features, built from the real
 * file so each changes exactly one behaviour. */
const project = LESSONS[LESSONS.length - 1].atoms[0].webLab;
const real = project.files["src/features.jsx"];
const broken = [
  real.replace('if (!name.trim()) return setError("Name is required");', ""),
  real.replace('category === "All" || p.category === category', "true"),
  real.replace("s + l.price, 0", "l.price, 0"),
  real.replace("<button onClick={() => setAttempt((a) => a + 1)}>Retry</button>", "<button>Retry</button>"),
];
project.tests.filter((t) => t.swap).forEach((t, i) => {
  t.swap = { "src/features.jsx": broken[i] };
});
