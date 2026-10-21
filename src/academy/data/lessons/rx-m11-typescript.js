/**
 * REACT DEVELOPMENT · MODULE 11 · TYPESCRIPT WITH REACT
 *
 * Curriculum 11.1 – 11.P. Why TypeScript, basic types and unions, interfaces
 * and aliases, typed props, children and events, typed Hooks, optional props,
 * API responses, generics, discriminated unions, typed Context, errors and
 * narrowing, avoiding any, and converting a JavaScript project.
 *
 * HOW TYPES ARE CHECKED. The practice page runs TypeScript the way Vite
 * does in development: it strips the types and runs the JavaScript, without
 * checking them. Type checking is your editor's and tsc's job, exactly as in
 * a real project. So every lab here declares `typecheck: true` and
 * `npm run validate:content` compiles it with the real TypeScript compiler
 * under strict mode (lib/academy/react/typecheck.mjs): the model answer must
 * have no type errors, and starters marked `starterTypeErrors` must have
 * some. Every compiler message a lesson quotes is listed in the atom's
 * `tsCheck` and must be what tsc really prints.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

import { reactLab } from "./rx-helpers.js";

export const SECTION_ID = "rx-s11-typescript";
const MODULE = "rx-m11-typescript";

const tsLab = (spec) => reactLab({ ts: true, typecheck: true, ...spec });

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 64 · 11.1 – 11.3
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "rx-l64-ts-basics",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 1,
    covers: ["11.1", "11.2", "11.3"],
    title: "Why TypeScript, and Its Basic Types",
    subtitle: "What types buy you, primitives, arrays, objects and unions, interfaces and type aliases",
    estimatedMinutes: 35,
    intro:
      "TypeScript is JavaScript with types: annotations that describe what values are allowed, checked before the code runs. Most professional React codebases use it. A note on practice: this page runs your TypeScript the way Vite does, stripping the types without checking them; your editor checks them as you type. The checklist checks the types you write.",

    atoms: [
      {
        id: "a-rx-why-ts",
        title: "Why TypeScript is useful",
        explain:
          "In JavaScript, total(\"500\", 2) quietly returns \"5002\" and the bug surfaces later, somewhere else. With types, the editor underlines it the moment you type it. TypeScript catches typos in property names, missing arguments, possibly-undefined values and wrong prop types before the code runs; it makes autocomplete know every prop of every component; and it makes refactoring safe, because renaming a field shows every place that breaks. The types are erased at build time: the browser runs plain JavaScript, so types cost nothing at runtime. They are also not a runtime check: data from an API still needs validating (Lesson 66).",
        example:
          "function total(price: number, qty: number) {\n  return price * qty;\n}\ntotal(\"500\", 2);\n\n// error TS2345: Argument of type 'string' is not assignable\n// to parameter of type 'number'.",
        tsCheck: {
          code: 'export function total(price: number, qty: number) {\n  return price * qty;\n}\ntotal("500", 2);\n',
          errors: ["TS2345"],
          quotes: ["Argument of type 'string' is not assignable to parameter of type 'number'."],
        },
        decision: {
          scenario: "A teammate says: \"TypeScript checks the data the API sends us at runtime, so we no longer need validation.\"",
          question: "Is that right?",
          options: [
            { id: "a", text: "No: types are erased when the app is built; data from outside must still be validated at runtime, for example with Zod", why: "TypeScript checks your code before it runs. It has no idea what a server will actually send." },
            { id: "b", text: "Yes: typed fetch calls are checked by the browser", whyWrong: "The browser only ever runs JavaScript; the types are gone." },
            { id: "c", text: "Yes, if strict mode is on", whyWrong: "Strict mode makes compile-time checks stricter; it adds no runtime checks." },
            { id: "d", text: "Only in development", whyWrong: "No mode checks types at runtime." },
          ],
          correct: "a",
          aftermath: "Types for your code; runtime validation for data from the outside world.",
        },
      },
      {
        id: "a-rx-ts-types",
        title: "Basic types, arrays, objects and unions",
        explain:
          "Annotate with a colon: let name: string; count: number; done: boolean. Arrays: string[] (or Array<string>). Objects: { id: number; title: string }. Function parameters and return values: function format(n: number): string. A UNION allows one of several types: string | number, or a set of exact values (a LITERAL union): type Status = \"idle\" | \"loading\" | \"error\". Most of the time TypeScript INFERS types (const x = 5 is a number), so annotate parameters, return values of exported functions and anything inference cannot see; leave the rest.",
        webLab: tsLab({
          task:
            "Add types to price.ts: formatNaira takes a number and returns a string; totalOf takes an array of { price: number; qty: number } and returns a number; and level takes a score number and returns the union \"fail\" | \"pass\" | \"distinction\" (under 50, under 75, otherwise). App already uses them.",
          files: {
            "src/price.ts": `export function formatNaira(amount) {
  return "₦" + amount.toLocaleString("en-NG");
}

export function totalOf(lines) {
  return lines.reduce((sum, l) => sum + l.price * l.qty, 0);
}

export function level(score) {
  if (score < 50) return "fail";
  if (score < 75) return "pass";
  return "distinction";
}
`,
            "src/App.tsx": `import { formatNaira, totalOf, level } from "./price";

const lines = [
  { price: 7500, qty: 2 },
  { price: 3000, qty: 1 },
];

export default function App() {
  return (
    <>
      <p className="total">{formatNaira(totalOf(lines))}</p>
      <p className="level">{level(81)}</p>
    </>
  );
}
`,
          },
          readOnly: ["src/App.tsx"],
          starterTypeErrors: true,
          tests: [
            { label: "It still works", check: "return text('.total') === '₦18,000' && text('.level') === 'distinction';", fail: "Only add types; do not change the logic." },
            { label: "formatNaira: number in, string out", check: "return /formatNaira\\s*\\(\\s*amount\\s*:\\s*number\\s*\\)\\s*:\\s*string/.test(code('src/price.ts'));", fail: "export function formatNaira(amount: number): string" },
            { label: "totalOf takes typed lines and returns a number", check: "return /totalOf\\s*\\(\\s*lines\\s*:\\s*(\\{[^}]*price\\s*:\\s*number[^}]*qty\\s*:\\s*number[^}]*\\}\\s*\\[\\]|Array<\\{[^}]*\\}>|\\w+\\[\\])\\s*\\)\\s*:\\s*number/.test(code('src/price.ts'));", fail: "lines: { price: number; qty: number }[] and : number" },
            { label: "level returns a literal union", check: "return /level\\s*\\(\\s*score\\s*:\\s*number\\s*\\)\\s*:\\s*(\"fail\"\\s*\\|\\s*\"pass\"\\s*\\|\\s*\"distinction\"|\\w+)/.test(code('src/price.ts')) && /\"fail\"\\s*\\|\\s*\"pass\"\\s*\\|\\s*\"distinction\"/.test(code('src/price.ts'));", fail: ": \"fail\" | \"pass\" | \"distinction\"" },
          ],
          solution: {
            "src/price.ts": `export type Level = "fail" | "pass" | "distinction";

export function formatNaira(amount: number): string {
  return "₦" + amount.toLocaleString("en-NG");
}

export function totalOf(lines: { price: number; qty: number }[]): number {
  return lines.reduce((sum, l) => sum + l.price * l.qty, 0);
}

export function level(score: number): Level {
  if (score < 50) return "fail";
  if (score < 75) return "pass";
  return "distinction";
}
`,
          },
          hint: "Under strict mode, an unannotated parameter is an error: \"implicitly has an 'any' type\".",
          successMessage: "Now total(\"500\", 2) would be underlined before it ever ran.",
        }),
      },
      {
        id: "a-rx-interfaces-aliases",
        title: "Interfaces and type aliases",
        explain:
          "Name a shape to reuse it. An INTERFACE: interface Course { id: string; title: string; weeks: number }. A TYPE ALIAS: type Course = { id: string; title: string; weeks: number }. For object shapes they are nearly interchangeable; interfaces can be extended (interface PaidCourse extends Course { price: number }) and merged, while only type aliases can name unions, literal types and other combinations (type Id = string | number; type PaidCourse = Course & { price: number }). Pick one convention for object shapes (many React codebases use type for everything) and export shared types from a types.ts file.",
        webLab: tsLab({
          task:
            "In types.ts, define and export: an interface Course (id: string, title: string, weeks: number); an interface PaidCourse that extends Course with price: number; and a type alias CourseLevel for \"beginner\" | \"intermediate\" | \"advanced\". Then use them in App.tsx: annotate courses as PaidCourse[] and the level constant as CourseLevel.",
          files: {
            "src/types.ts": "// your types here\n",
            "src/App.tsx": `const courses = [
  { id: "react", title: "React", weeks: 16, price: 30000 },
  { id: "ts", title: "TypeScript", weeks: 3, price: 12000 },
];

const level = "intermediate";

export default function App() {
  return (
    <ul data-level={level}>
      {courses.map((c) => (
        <li key={c.id}>
          {c.title}: {c.weeks} weeks, ₦{c.price}
        </li>
      ))}
    </ul>
  );
}
`,
          },
          tests: [
            { label: "It still renders", check: "return $$('li').map((li) => text(li)).join('|') === 'React: 16 weeks, ₦30000|TypeScript: 3 weeks, ₦12000';", fail: "Only add types." },
            { label: "Course and PaidCourse interfaces, with extends", check: "const c = code('src/types.ts'); return /export\\s+interface\\s+Course\\s*\\{[^}]*id\\s*:\\s*string[^}]*title\\s*:\\s*string[^}]*weeks\\s*:\\s*number/.test(c) && /export\\s+interface\\s+PaidCourse\\s+extends\\s+Course\\s*\\{[^}]*price\\s*:\\s*number/.test(c);", fail: "export interface PaidCourse extends Course { price: number }" },
            { label: "A CourseLevel union type alias", check: "return /export\\s+type\\s+CourseLevel\\s*=\\s*\"beginner\"\\s*\\|\\s*\"intermediate\"\\s*\\|\\s*\"advanced\"/.test(code('src/types.ts'));", fail: "export type CourseLevel = \"beginner\" | \"intermediate\" | \"advanced\";" },
            { label: "App uses the types", check: "const c = code('src/App.tsx'); return /courses\\s*:\\s*PaidCourse\\[\\]/.test(c) && /level\\s*:\\s*CourseLevel/.test(c) && /import\\s+(type\\s+)?\\{[^}]*PaidCourse/.test(c);", fail: "import type { PaidCourse, CourseLevel } from \"./types\";" },
          ],
          solution: {
            "src/types.ts": `export interface Course {
  id: string;
  title: string;
  weeks: number;
}

export interface PaidCourse extends Course {
  price: number;
}

export type CourseLevel = "beginner" | "intermediate" | "advanced";
`,
            "src/App.tsx": `import type { PaidCourse, CourseLevel } from "./types";

const courses: PaidCourse[] = [
  { id: "react", title: "React", weeks: 16, price: 30000 },
  { id: "ts", title: "TypeScript", weeks: 3, price: 12000 },
];

const level: CourseLevel = "intermediate";

export default function App() {
  return (
    <ul data-level={level}>
      {courses.map((c) => (
        <li key={c.id}>
          {c.title}: {c.weeks} weeks, ₦{c.price}
        </li>
      ))}
    </ul>
  );
}
`,
          },
          hint: "import type imports only types; it disappears completely from the built JavaScript.",
          successMessage: "Named, shared shapes: misspell a field anywhere and the editor says so.",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 65 · 11.4 – 11.5
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "rx-l65-typed-props",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 2,
    covers: ["11.4", "11.5"],
    title: "Typing Components",
    subtitle: "Typed props, children and event handlers",
    estimatedMinutes: 35,
    intro: "Typed props turn a component's inputs into a contract: callers get autocomplete, and a missing or misspelled prop is an error at the call site.",

    atoms: [
      {
        id: "a-rx-typed-props",
        title: "Typing component props",
        explain:
          "Describe the props with a type and annotate the destructured parameter: type CourseCardProps = { title: string; weeks: number; level: CourseLevel }; function CourseCard({ title, weeks, level }: CourseCardProps). Now <CourseCard title=\"React\" /> is an error because weeks and level are missing, and weeks=\"16\" is an error because it is a string. You do not need React.FC: annotating the props parameter is the recommended style. Callback props are typed as functions: onEnroll: (courseId: string) => void.",
        example: "<CourseCard title=\"React\" />\n\n// error TS2739: Type '{ title: string; }' is missing the following\n// properties from type 'CourseCardProps': weeks, level",
        tsCheck: {
          code: 'type CourseCardProps = { title: string; weeks: number; level: "beginner" | "advanced" };\nfunction CourseCard({ title, weeks, level }: CourseCardProps) {\n  return <p>{title} {weeks} {level}</p>;\n}\nexport const x = <CourseCard title="React" />;\n',
          errors: ["TS2739"],
          quotes: ["missing the following properties from type 'CourseCardProps': weeks, level"],
        },
        webLab: tsLab({
          task:
            "Type CourseCard's props with a CourseCardProps type: title (string), weeks (number) and onEnroll, a function that takes the course title (a string) and returns nothing. The button calls onEnroll(title). App logs the enrolment.",
          files: {
            "src/CourseCard.tsx": `export default function CourseCard({ title, weeks, onEnroll }) {
  return (
    <article>
      <h2>{title}</h2>
      <p>{weeks} weeks</p>
      <button onClick={() => onEnroll(title)}>Enroll</button>
    </article>
  );
}
`,
            "src/App.tsx": `import CourseCard from "./CourseCard";

export default function App() {
  return <CourseCard title="React" weeks={16} onEnroll={(t) => console.log("Enrolled in " + t)} />;
}
`,
          },
          readOnly: ["src/App.tsx"],
          starterTypeErrors: true,
          tests: [
            { label: "It renders and enrolls", check: "await click('button'); return text('h2') === 'React' && output().includes('Enrolled in React');", fail: "Keep the behaviour; add the types." },
            { label: "A props type with the three props", check: "const c = code('src/CourseCard.tsx'); return /(type|interface)\\s+CourseCardProps/.test(c) && /title\\s*:\\s*string/.test(c) && /weeks\\s*:\\s*number/.test(c) && /onEnroll\\s*:\\s*\\(\\s*\\w+\\s*:\\s*string\\s*\\)\\s*=>\\s*void/.test(c);", fail: "onEnroll: (courseTitle: string) => void" },
            { label: "The destructured props are annotated", check: "return /\\}\\s*:\\s*CourseCardProps\\s*\\)/.test(code('src/CourseCard.tsx'));", fail: "function CourseCard({ title, weeks, onEnroll }: CourseCardProps)" },
          ],
          solution: {
            "src/CourseCard.tsx": `type CourseCardProps = {
  title: string;
  weeks: number;
  onEnroll: (courseTitle: string) => void;
};

export default function CourseCard({ title, weeks, onEnroll }: CourseCardProps) {
  return (
    <article>
      <h2>{title}</h2>
      <p>{weeks} weeks</p>
      <button onClick={() => onEnroll(title)}>Enroll</button>
    </article>
  );
}
`,
          },
          hint: "Notice that App's (t) => … now knows t is a string, without an annotation: TypeScript infers it from the prop's type.",
          successMessage: "The component's contract, written down and enforced at every call site.",
        }),
      },
      {
        id: "a-rx-typed-children-events",
        title: "Typing children and event handlers",
        explain:
          "children is typed as React.ReactNode (import type { ReactNode } from \"react\"), which allows anything React can render: elements, strings, numbers, arrays, null. For handlers, React provides event types: React.ChangeEvent<HTMLInputElement> for an input's onChange, React.FormEvent<HTMLFormElement> for onSubmit, React.MouseEvent<HTMLButtonElement> for onClick. Write the handler inline and TypeScript infers the event type for you; annotate when the handler is a separate function. To accept every native attribute of an element plus your own: type ButtonProps = React.ComponentProps<\"button\"> & { variant?: \"primary\" | \"ghost\" }.",
        webLab: tsLab({
          task:
            "Type the reusable form pieces. Panel takes title (string) and children (ReactNode). In SearchForm, the separate handlers must be typed: handleChange with React.ChangeEvent<HTMLInputElement> and handleSubmit with React.FormEvent<HTMLFormElement>.",
          files: {
            "src/Panel.tsx": `export default function Panel({ title, children }) {
  return (
    <section>
      <h2>{title}</h2>
      {children}
    </section>
  );
}
`,
            "src/SearchForm.tsx": `import { useState } from "react";

export default function SearchForm() {
  const [q, setQ] = useState("");

  function handleChange(e) {
    setQ(e.target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();
    console.log("Search: " + q);
  }

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="q">Search</label>
      <input id="q" value={q} onChange={handleChange} />
      <button>Go</button>
    </form>
  );
}
`,
            "src/App.tsx": `import Panel from "./Panel";
import SearchForm from "./SearchForm";

export default function App() {
  return (
    <Panel title="Find a course">
      <SearchForm />
    </Panel>
  );
}
`,
          },
          readOnly: ["src/App.tsx"],
          starterTypeErrors: true,
          tests: [
            { label: "It works", check: "await type('#q', 'hooks'); await submit('form'); return text('h2') === 'Find a course' && output().includes('Search: hooks');", fail: "Keep the behaviour." },
            { label: "Panel's children are ReactNode", check: "return /children\\s*:\\s*(React\\.)?ReactNode/.test(code('src/Panel.tsx')) && /title\\s*:\\s*string/.test(code('src/Panel.tsx'));", fail: "{ title: string; children: ReactNode }" },
            { label: "The handlers have React event types", check: "const c = code('src/SearchForm.tsx'); return /handleChange\\s*\\(\\s*e\\s*:\\s*(React\\.)?ChangeEvent<HTMLInputElement>/.test(c) && /handleSubmit\\s*\\(\\s*e\\s*:\\s*(React\\.)?FormEvent<HTMLFormElement>/.test(c);", fail: "e: React.ChangeEvent<HTMLInputElement> and e: React.FormEvent<HTMLFormElement>" },
          ],
          solution: {
            "src/Panel.tsx": `import type { ReactNode } from "react";

type PanelProps = { title: string; children: ReactNode };

export default function Panel({ title, children }: PanelProps) {
  return (
    <section>
      <h2>{title}</h2>
      {children}
    </section>
  );
}
`,
            "src/SearchForm.tsx": `import { useState } from "react";
import type React from "react";

export default function SearchForm() {
  const [q, setQ] = useState("");

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setQ(e.target.value);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    console.log("Search: " + q);
  }

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="q">Search</label>
      <input id="q" value={q} onChange={handleChange} />
      <button>Go</button>
    </form>
  );
}
`,
          },
          hint: "Hover over an inline onChange={(e) => …} in your editor and it shows the exact event type to copy.",
          successMessage: "Typed children and events: e.target.value now autocompletes, and is known to be a string.",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 66 · 11.6 – 11.8
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "rx-l66-typed-hooks",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 3,
    covers: ["11.6", "11.7", "11.8"],
    title: "Typing Hooks, Optional Props and API Data",
    subtitle: "useState, useReducer and useRef with types, optional props and defaults, and typed responses",
    estimatedMinutes: 40,
    intro: "Hooks mostly infer their types. The places they cannot (an empty initial value, a null ref, data from a server) are where you add types.",

    atoms: [
      {
        id: "a-rx-typed-hooks",
        title: "Typing useState, useReducer and useRef",
        explain:
          "useState infers from the initial value: useState(0) is a number. Give the type explicitly when the initial value does not show it: useState<User | null>(null), useState<string[]>([]). useReducer infers from a typed reducer: type the state and the ACTIONS as a union, type Action = { type: \"added\"; text: string } | { type: \"removed\"; id: number }, and inside a switch on action.type TypeScript knows which fields each case has. useRef for the DOM: useRef<HTMLInputElement>(null), then inputRef.current?.focus(); for a mutable value: useRef<number | null>(null).",
        webLab: tsLab({
          task:
            "Type the Hooks. user is useState<User | null>(null). The reducer's actions are a union Action: { type: \"added\"; text: string } | { type: \"cleared\" }, and todosReducer is typed (todos: string[], action: Action): string[]. The input ref is useRef<HTMLInputElement>(null) and is focused with optional chaining.",
          files: {
            "src/App.tsx": `import { useReducer, useRef, useState } from "react";

type User = { name: string };

function todosReducer(todos, action) {
  switch (action.type) {
    case "added":
      return [...todos, action.text];
    case "cleared":
      return [];
  }
}

export default function App() {
  const [user, setUser] = useState(null);
  const [todos, dispatch] = useReducer(todosReducer, []);
  const inputRef = useRef(null);

  return (
    <>
      <p className="user">{user ? "Hi " + user.name : "Signed out"}</p>
      <button onClick={() => setUser({ name: "Ada" })}>Sign in</button>
      <input ref={inputRef} aria-label="Todo" />
      <button onClick={() => dispatch({ type: "added", text: "Learn TypeScript" })}>Add</button>
      <button onClick={() => inputRef.current.focus()}>Focus</button>
      <ul>
        {todos.map((t) => (
          <li key={t}>{t}</li>
        ))}
      </ul>
    </>
  );
}
`,
          },
          starterTypeErrors: true,
          tests: [
            { label: "Everything still works", check: "const b = (n) => $$('button').find((x) => text(x) === n); await click(b('Sign in')); await click(b('Add')); await click(b('Focus')); return text('.user') === 'Hi Ada' && text('li') === 'Learn TypeScript' && document.activeElement === $('input');", fail: "Keep the behaviour." },
            { label: "useState and useRef have explicit types", check: "const c = code('src/App.tsx'); return /useState<\\s*User\\s*\\|\\s*null\\s*>\\(\\s*null\\s*\\)/.test(c) && /useRef<\\s*HTMLInputElement\\s*>\\(\\s*null\\s*\\)/.test(c) && /current\\?\\.focus\\(\\)/.test(c);", fail: "useState<User | null>(null), useRef<HTMLInputElement>(null), inputRef.current?.focus()" },
            { label: "Actions are a typed union", check: "const c = code('src/App.tsx'); return /type\\s+Action\\s*=\\s*\\|?\\s*\\{\\s*type\\s*:\\s*\"added\"\\s*;\\s*text\\s*:\\s*string\\s*;?\\s*\\}\\s*\\|\\s*\\{\\s*type\\s*:\\s*\"cleared\"\\s*;?\\s*\\}/.test(c) && /todosReducer\\s*\\(\\s*todos\\s*:\\s*string\\[\\]\\s*,\\s*action\\s*:\\s*Action\\s*\\)\\s*:\\s*string\\[\\]/.test(c);", fail: "type Action = { type: \"added\"; text: string } | { type: \"cleared\" };" },
          ],
          solution: {
            "src/App.tsx": `import { useReducer, useRef, useState } from "react";

type User = { name: string };
type Action = { type: "added"; text: string } | { type: "cleared" };

function todosReducer(todos: string[], action: Action): string[] {
  switch (action.type) {
    case "added":
      return [...todos, action.text];
    case "cleared":
      return [];
  }
}

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [todos, dispatch] = useReducer(todosReducer, []);
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <p className="user">{user ? "Hi " + user.name : "Signed out"}</p>
      <button onClick={() => setUser({ name: "Ada" })}>Sign in</button>
      <input ref={inputRef} aria-label="Todo" />
      <button onClick={() => dispatch({ type: "added", text: "Learn TypeScript" })}>Add</button>
      <button onClick={() => inputRef.current?.focus()}>Focus</button>
      <ul>
        {todos.map((t) => (
          <li key={t}>{t}</li>
        ))}
      </ul>
    </>
  );
}
`,
          },
          hint: "With the union typed, try writing action.text in the \"cleared\" case: the editor refuses, because that action has no text.",
          successMessage: "Hooks that know their types, and actions the compiler checks case by case.",
        }),
      },
      {
        id: "a-rx-optional-props",
        title: "Optional props and default values",
        explain:
          "A question mark makes a prop optional: subtitle?: string means string | undefined. Inside the component, TypeScript makes you handle the undefined case, or you give a default in the destructuring: { size = \"md\" }: Props, after which size is a plain string. Booleans are usually optional and default to false (disabled?: boolean). Use a union for options (size?: \"sm\" | \"md\" | \"lg\"), so callers cannot pass \"medium\".",
        webLab: tsLab({
          task:
            "Type Badge with BadgeProps: label is required (string); tone is optional and one of \"info\" | \"success\" | \"danger\", defaulting to \"info\"; count is an optional number, shown in parentheses only when given. The class is \"badge badge-<tone>\".",
          files: {
            "src/Badge.tsx": `export default function Badge({ label, tone, count }) {
  return (
    <span className={"badge badge-" + tone}>
      {label}
      {count}
    </span>
  );
}
`,
            "src/App.tsx": `import Badge from "./Badge";

export default function App() {
  return (
    <>
      <Badge label="New" />
      <Badge label="Messages" tone="danger" count={3} />
    </>
  );
}
`,
          },
          readOnly: ["src/App.tsx"],
          starterTypeErrors: true,
          tests: [
            { label: "Default tone, and count only when given", check: "const b = $$('.badge'); return b[0].className === 'badge badge-info' && text(b[0]) === 'New' && b[1].className === 'badge badge-danger' && text(b[1]) === 'Messages (3)';", fail: "tone = \"info\", and {count !== undefined && \" (\" + count + \")\"}" },
            { label: "Optional props typed with ? and a union", check: "const c = code('src/Badge.tsx'); return /label\\s*:\\s*string/.test(c) && /tone\\?\\s*:\\s*\"info\"\\s*\\|\\s*\"success\"\\s*\\|\\s*\"danger\"/.test(c) && /count\\?\\s*:\\s*number/.test(c) && /tone\\s*=\\s*\"info\"/.test(c);", fail: "tone?: \"info\" | \"success\" | \"danger\"; count?: number" },
          ],
          solution: {
            "src/Badge.tsx": `type BadgeProps = {
  label: string;
  tone?: "info" | "success" | "danger";
  count?: number;
};

export default function Badge({ label, tone = "info", count }: BadgeProps) {
  return (
    <span className={"badge badge-" + tone}>
      {label}
      {count !== undefined && " (" + count + ")"}
    </span>
  );
}
`,
          },
          hint: "count could be 0, so test count !== undefined rather than count &&.",
          successMessage: "Required where it must be, optional where it may be, and only valid tones allowed.",
        }),
      },
      {
        id: "a-rx-typed-api",
        title: "Typing API responses",
        explain:
          "res.json() returns Promise<any>: TypeScript cannot know what a server sends. Two ways to type it. 1. DECLARE it: async function getCourses(): Promise<Course[]> { … return (await res.json()) as Course[]; }. Quick, but if the server sends something else, your types lie. 2. VALIDATE it: describe the response with a Zod schema, const CourseSchema = z.object({ … }), derive the type with type Course = z.infer<typeof CourseSchema>, and parse: return z.array(CourseSchema).parse(await res.json()). Now the type is guaranteed at runtime as well, and bad data fails loudly at the boundary instead of deep inside a component.",
        webLab: tsLab({
          task:
            "Validate the API response with Zod in api.ts: a CourseSchema with id (string), title (string) and weeks (a number), the type Course derived with z.infer, and getCourses(): Promise<Course[]> that parses the response with z.array(CourseSchema). When the server sends a bad course (weeks as a string), App shows the error instead of rendering bad data.",
          files: {
            "src/api.ts": `import { z } from "zod";

export async function getCourses() {
  const res = await fetch("/api/courses");
  return res.json();
}
`,
            "src/App.tsx": `import { useEffect, useState } from "react";
import { getCourses, type Course } from "./api";

export default function App() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    getCourses()
      .then(setCourses)
      .catch(() => setError("The server sent unexpected data"));
  }, []);

  if (error) return <p role="alert">{error}</p>;
  return (
    <ul>
      {courses.map((c) => (
        <li key={c.id}>
          {c.title}: {c.weeks.toFixed(0)} weeks
        </li>
      ))}
    </ul>
  );
}
`,
          },
          readOnly: ["src/App.tsx"],
          starterTypeErrors: true,
          mocks: [{ match: "/api/courses", body: [{ id: "react", title: "React", weeks: 16 }, { id: "ts", title: "TypeScript", weeks: 3 }], delay: 30 }],
          tests: [
            { label: "Valid data renders", check: "return await waitFor(() => $$('li').map((li) => text(li)).join('|') === 'React: 16 weeks|TypeScript: 3 weeks');", fail: "return z.array(CourseSchema).parse(await res.json());" },
            { label: "Bad data is rejected at the boundary", mocks: [{ match: "/api/courses", body: [{ id: "react", title: "React", weeks: "sixteen" }], delay: 30 }], check: "return await waitFor(() => text('[role=alert]') === 'The server sent unexpected data') && errors().length === 0;", fail: "parse() throws on the wrong type, which App catches." },
            { label: "The type is derived from the schema", check: "const c = code('src/api.ts'); return /export\\s+type\\s+Course\\s*=\\s*z\\.infer<\\s*typeof\\s+CourseSchema\\s*>/.test(c) && /Promise<\\s*Course\\[\\]\\s*>/.test(c);", fail: "export type Course = z.infer<typeof CourseSchema>;" },
          ],
          solution: {
            "src/api.ts": `import { z } from "zod";

const CourseSchema = z.object({
  id: z.string(),
  title: z.string(),
  weeks: z.number(),
});

export type Course = z.infer<typeof CourseSchema>;

export async function getCourses(): Promise<Course[]> {
  const res = await fetch("/api/courses");
  if (!res.ok) throw new Error("HTTP " + res.status);
  return z.array(CourseSchema).parse(await res.json());
}
`,
          },
          hint: "Without validation, \"sixteen\".toFixed would crash inside the list. With it, the problem is caught where the data enters.",
          successMessage: "One schema: a runtime check and a compile-time type, guaranteed to agree.",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 67 · 11.9 – 11.11
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "rx-l67-generics-unions",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 4,
    covers: ["11.9", "11.10", "11.11"],
    title: "Generics, Discriminated Unions and Typed Context",
    subtitle: "Reusable typed components and Hooks, modelling async states, and typing providers",
    estimatedMinutes: 45,
    intro: "Three patterns that make large TypeScript React codebases pleasant: components that work for any data type, state that cannot be in an impossible combination, and Context that is never accidentally empty.",

    atoms: [
      {
        id: "a-rx-generics",
        title: "Reusable generic components and Hooks",
        explain:
          "A GENERIC has a type parameter, a placeholder filled in by each use. function List<T>({ items, renderItem, getKey }: { items: T[]; renderItem: (item: T) => ReactNode; getKey: (item: T) => string }) works for courses, users or anything else, and in <List items={courses} renderItem={(c) => c.title} … /> TypeScript infers T as Course, so c.title autocompletes and c.price (if it does not exist) is an error. Custom Hooks are often generic too: function useLocalStorage<T>(key: string, initial: T): [T, (value: T) => void].",
        webLab: tsLab({
          task:
            "Write the generic List<T> component in List.tsx: props items (T[]), getKey ((item: T) => string) and renderItem ((item: T) => ReactNode), rendering a <ul> with one <li> per item. App uses it for both courses and people.",
          files: {
            "src/List.tsx": `import type { ReactNode } from "react";

export default function List(props) {
  return <ul />;
}
`,
            "src/App.tsx": `import List from "./List";

type Course = { id: string; title: string };
type Person = { email: string; name: string };

const courses: Course[] = [
  { id: "react", title: "React" },
  { id: "ts", title: "TypeScript" },
];
const people: Person[] = [{ email: "ada@example.com", name: "Ada Obi" }];

export default function App() {
  return (
    <>
      <List items={courses} getKey={(c) => c.id} renderItem={(c) => <strong>{c.title}</strong>} />
      <List items={people} getKey={(p) => p.email} renderItem={(p) => p.name} />
    </>
  );
}
`,
          },
          readOnly: ["src/App.tsx"],
          starterTypeErrors: true,
          tests: [
            { label: "Both lists render their items", check: "const u = $$('ul'); return u.length === 2 && $$('li', u[0]) && [...u[0].querySelectorAll('li strong')].map((s) => text(s)).join() === 'React,TypeScript' && text(u[1].querySelector('li')) === 'Ada Obi';", fail: "items.map((item) => <li key={getKey(item)}>{renderItem(item)}</li>)" },
            { label: "List is generic", check: "return /function\\s+List\\s*<\\s*T\\s*>/.test(code('src/List.tsx')) && /items\\s*:\\s*T\\[\\]/.test(code('src/List.tsx')) && /renderItem\\s*:\\s*\\(\\s*\\w+\\s*:\\s*T\\s*\\)\\s*=>\\s*ReactNode/.test(code('src/List.tsx'));", fail: "export default function List<T>({ items, getKey, renderItem }: ListProps<T>)" },
            { label: "No missing-key warnings", check: "return !/unique \"key\"/.test(output());", fail: "key={getKey(item)}" },
          ],
          solution: {
            "src/List.tsx": `import type { ReactNode } from "react";

type ListProps<T> = {
  items: T[];
  getKey: (item: T) => string;
  renderItem: (item: T) => ReactNode;
};

export default function List<T>({ items, getKey, renderItem }: ListProps<T>) {
  return (
    <ul>
      {items.map((item) => (
        <li key={getKey(item)}>{renderItem(item)}</li>
      ))}
    </ul>
  );
}
`,
          },
          hint: "In App, hover over c in renderItem: TypeScript has worked out it is a Course.",
          successMessage: "One component, any item type, and full type checking for each use.",
        }),
      },
      {
        id: "a-rx-discriminated-unions",
        title: "Discriminated unions for loading, success and error states",
        explain:
          "Model async data as a DISCRIMINATED UNION: type AsyncState<T> = { status: \"loading\" } | { status: \"error\"; message: string } | { status: \"success\"; data: T }. The shared literal field (status) is the DISCRIMINANT. After if (state.status === \"success\"), TypeScript knows state.data exists; in the error branch, only message does. It is impossible to have data and an error at the same time, or to read data while loading. A switch with a default that assigns the value to never makes the compiler tell you when a new status is added but not handled.",
        webLab: tsLab({
          task:
            "In state.ts, define and export the generic AsyncState<T> discriminated union (loading; error with message: string; success with data: T). In App, type the state as AsyncState<string[]> and render each status: \"Loading…\", the message in role=\"alert\", or a list of the data.",
          files: {
            "src/state.ts": "// export type AsyncState<T> = …\n",
            "src/App.tsx": `import { useEffect, useState } from "react";

export default function App() {
  const [state, setState] = useState({ status: "loading" });

  useEffect(() => {
    fetch("/api/tags")
      .then((r) => {
        if (!r.ok) throw new Error("Could not load tags");
        return r.json();
      })
      .then((data) => setState({ status: "success", data }))
      .catch((e) => setState({ status: "error", message: e.message }));
  }, []);

  return <p>{state.status}</p>;
}
`,
          },
          starterTypeErrors: true,
          mocks: [{ match: "/api/tags", body: ["hooks", "jsx", "routing"], delay: 120 }],
          tests: [
            { label: "Loading, then the list", check: "const l = text('#root') === 'Loading…'; await waitFor(() => $$('li').length === 3); return l && $$('li').map((li) => text(li)).join() === 'hooks,jsx,routing';", fail: "Render each status in its own branch." },
            { label: "Errors show their message", mocks: [{ match: "/api/tags", status: 500, body: {}, delay: 30 }], check: "return await waitFor(() => text('[role=alert]') === 'Could not load tags');", fail: "In the error branch, show state.message." },
            { label: "A generic discriminated union types the state", check: "const s = code('src/state.ts'); return /export\\s+type\\s+AsyncState<\\s*T\\s*>\\s*=/.test(s) && /status\\s*:\\s*\"loading\"/.test(s) && /status\\s*:\\s*\"error\"\\s*;\\s*message\\s*:\\s*string/.test(s) && /status\\s*:\\s*\"success\"\\s*;\\s*data\\s*:\\s*T/.test(s) && /useState<\\s*AsyncState<\\s*string\\[\\]\\s*>\\s*>/.test(code('src/App.tsx'));", fail: "useState<AsyncState<string[]>>({ status: \"loading\" })" },
          ],
          solution: {
            "src/state.ts": `export type AsyncState<T> =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "success"; data: T };
`,
            "src/App.tsx": `import { useEffect, useState } from "react";
import type { AsyncState } from "./state";

export default function App() {
  const [state, setState] = useState<AsyncState<string[]>>({ status: "loading" });

  useEffect(() => {
    fetch("/api/tags")
      .then((r) => {
        if (!r.ok) throw new Error("Could not load tags");
        return r.json();
      })
      .then((data: string[]) => setState({ status: "success", data }))
      .catch((e: Error) => setState({ status: "error", message: e.message }));
  }, []);

  switch (state.status) {
    case "loading":
      return <p>Loading…</p>;
    case "error":
      return <p role="alert">{state.message}</p>;
    case "success":
      return (
        <ul>
          {state.data.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      );
  }
}
`,
          },
          hint: "In each case of the switch, TypeScript narrows state to that member of the union.",
          successMessage: "Impossible states are now impossible to write.",
        }),
      },
      {
        id: "a-rx-typed-context",
        title: "Typing Context providers",
        explain:
          "Type the value: type AuthValue = { user: User | null; signIn: (name: string) => void }. Create the context with null as the default, createContext<AuthValue | null>(null), because there is no sensible fake value. Then export a custom Hook that checks for the provider: function useAuth() { const ctx = useContext(AuthContext); if (!ctx) throw new Error(\"useAuth must be used inside <AuthProvider>\"); return ctx; }. Components calling useAuth() get a value typed AuthValue, never null, and a missing provider fails loudly with a clear message instead of a confusing undefined later.",
        webLab: tsLab({
          task:
            "Finish auth.tsx: type AuthValue (user: User | null, signIn: (name: string) => void, signOut: () => void), create AuthContext with createContext<AuthValue | null>(null), write AuthProvider (children: ReactNode, holding user in state) and useAuth(), which throws \"useAuth must be used inside <AuthProvider>\" when there is no provider.",
          files: {
            "src/auth.tsx": `import { createContext, useContext, useState, type ReactNode } from "react";

export type User = { name: string };

export function AuthProvider({ children }) {
  return children;
}

export function useAuth() {}
`,
            "src/App.tsx": `import { AuthProvider, useAuth } from "./auth";

function Header() {
  const { user, signIn, signOut } = useAuth();
  return user ? (
    <p>
      Hi {user.name} <button onClick={signOut}>Sign out</button>
    </p>
  ) : (
    <button onClick={() => signIn("Ada")}>Sign in</button>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Header />
    </AuthProvider>
  );
}
`,
          },
          readOnly: ["src/App.tsx"],
          starterTypeErrors: true,
          tests: [
            { label: "Sign in and out through the context", check: "await click('button'); const inn = text('p').startsWith('Hi Ada'); await click('button'); return inn && text('button') === 'Sign in';", fail: "Provide { user, signIn, signOut } from AuthProvider." },
            { label: "Typed context, null by default", check: "const c = code('src/auth.tsx'); return /createContext<\\s*AuthValue\\s*\\|\\s*null\\s*>\\(\\s*null\\s*\\)/.test(c) && /signIn\\s*:\\s*\\(\\s*\\w+\\s*:\\s*string\\s*\\)\\s*=>\\s*void/.test(c) && /children\\s*:\\s*ReactNode/.test(c);", fail: "createContext<AuthValue | null>(null)" },
            { label: "useAuth throws without a provider", check: "const c = code('src/auth.tsx'); return /throw\\s+new\\s+Error\\(\\s*\"useAuth must be used inside <AuthProvider>\"\\s*\\)/.test(c);", fail: "if (!ctx) throw new Error(\"useAuth must be used inside <AuthProvider>\");" },
          ],
          solution: {
            "src/auth.tsx": `import { createContext, useContext, useState, type ReactNode } from "react";

export type User = { name: string };

type AuthValue = {
  user: User | null;
  signIn: (name: string) => void;
  signOut: () => void;
};

const AuthContext = createContext<AuthValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const value: AuthValue = {
    user,
    signIn: (name) => setUser({ name }),
    signOut: () => setUser(null),
  };
  return <AuthContext value={value}>{children}</AuthContext>;
}

export function useAuth(): AuthValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
`,
          },
          hint: "After the if (!ctx) throw, TypeScript knows ctx is AuthValue, not null.",
          successMessage: "A context that is always typed and never silently missing.",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 68 · 11.12 – 11.14
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "rx-l68-narrowing",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 5,
    covers: ["11.12", "11.13", "11.14"],
    title: "Errors, Narrowing, any, and Converting a Project",
    subtitle: "Reading compiler errors, narrowing types, replacing any with unknown, and migrating JavaScript",
    estimatedMinutes: 45,
    intro: "Day to day, TypeScript is mostly reading its error messages and narrowing values until they are safe to use. Here is how to do both, and how to bring an existing JavaScript project across.",

    atoms: [
      {
        id: "a-rx-ts-errors-narrowing",
        title: "Understanding TypeScript errors and narrowing types",
        explain:
          "Read an error from the end: the LAST line usually says what is wrong. The most common: \"'user' is possibly 'null'\" (handle the null case first), \"Property 'x' does not exist on type 'Y'\" (a typo, or the type is wrong), \"Type 'A' is not assignable to type 'B'\". NARROWING is how you resolve them: checks TypeScript understands, after which the type is more specific. typeof x === \"string\"; if (user) or user?.name; Array.isArray(x); \"price\" in item; x instanceof Error; and comparing a discriminant (state.status === \"success\"). A non-null assertion (user!.name) silences the check: use it only when you truly know better than the compiler, such as document.getElementById(\"root\")!.",
        example: "function initials(name: string | null) {\n  return name.slice(0, 2);\n}\n\n// error TS18047: 'name' is possibly 'null'.",
        tsCheck: {
          code: "export function initials(name: string | null) {\n  return name.slice(0, 2);\n}\n",
          errors: ["TS18047"],
          quotes: ["'name' is possibly 'null'."],
        },
        webLab: tsLab({
          task:
            "describe(value) in describe.ts receives a string, a number, an array of strings, null, or an Error. Narrow each case: a string returns it trimmed; a number returns it with two decimal places; an array returns its items joined with \", \"; an Error returns \"Error: \" + its message; null returns \"(empty)\". No any and no type assertions.",
          files: {
            "src/describe.ts": `export type Value = string | number | string[] | Error | null;

export function describe(value: Value): string {
  return value.trim();
}
`,
            "src/App.tsx": `import { describe } from "./describe";

const values = ["  React  ", 3.14159, ["jsx", "hooks"], new Error("offline"), null];

export default function App() {
  return (
    <ul>
      {values.map((v, i) => (
        <li key={i}>{describe(v)}</li>
      ))}
    </ul>
  );
}
`,
          },
          readOnly: ["src/App.tsx"],
          starterTypeErrors: true,
          tests: [
            { label: "Every case is described", check: "return $$('li').map((li) => text(li)).join('|') === 'React|3.14|jsx, hooks|Error: offline|(empty)';", fail: "One narrowing check per case." },
            { label: "Narrowed, not asserted", check: "const c = code('src/describe.ts'); return /typeof\\s+value\\s*===\\s*\"string\"/.test(c) && (/Array\\.isArray\\(\\s*value\\s*\\)/.test(c) || /instanceof\\s+Error/.test(c)) && !/\\bany\\b|\\bas\\s+\\w/.test(c);", fail: "Use typeof, Array.isArray or instanceof, never as or any." },
          ],
          solution: {
            "src/describe.ts": `export type Value = string | number | string[] | Error | null;

export function describe(value: Value): string {
  if (value === null) return "(empty)";
  if (typeof value === "string") return value.trim();
  if (typeof value === "number") return value.toFixed(2);
  if (Array.isArray(value)) return value.join(", ");
  return "Error: " + value.message;
}
`,
          },
          hint: "After the null, string, number and array checks, the only thing left is Error, and TypeScript knows it.",
          successMessage: "Each check narrows the type; by the last line only Error is possible.",
        }),
      },
      {
        id: "a-rx-avoid-any",
        title: "Avoiding unnecessary use of any",
        explain:
          "any switches type checking OFF for a value, and it spreads: anything computed from an any is any too, so one any can silently disable checking across a feature. Alternatives: UNKNOWN for values whose type you do not know yet (data from JSON.parse, a catch block's error): it allows nothing until you narrow it. A specific type or a union when you do know. Generics when the type depends on the caller. Record<string, number> for dictionaries. If you must, any at a boundary with a comment explaining why, never as a habit. Turn on the noImplicitAny check (part of strict) and lint rules against explicit any.",
        webLab: tsLab({
          task:
            "parseSettings in settings.ts uses any. Replace it: the parameter is a string, JSON.parse's result is typed unknown, and a type guard isSettings(value: unknown): value is Settings checks that it is an object with a theme of \"light\" or \"dark\" and a fontSize number. Return the settings, or the defaults { theme: \"light\", fontSize: 16 } for anything else, including invalid JSON.",
          files: {
            "src/settings.ts": `export type Settings = { theme: "light" | "dark"; fontSize: number };

export function parseSettings(text: any): any {
  return JSON.parse(text);
}
`,
            "src/App.tsx": `import { parseSettings } from "./settings";

const inputs = ['{"theme":"dark","fontSize":18}', '{"theme":"neon","fontSize":18}', "not json", '{"theme":"light"}'];

export default function App() {
  return (
    <ul>
      {inputs.map((t) => {
        const s = parseSettings(t);
        return <li key={t}>{s.theme + " " + s.fontSize}</li>;
      })}
    </ul>
  );
}
`,
          },
          readOnly: ["src/App.tsx"],
          tests: [
            { label: "Valid settings are used, everything else gets defaults", check: "return $$('li').map((li) => text(li)).join('|') === 'dark 18|light 16|light 16|light 16' && errors().length === 0;", fail: "try JSON.parse; if (isSettings(value)) return value; otherwise the defaults." },
            { label: "unknown and a type guard instead of any", check: "const c = code('src/settings.ts'); return !/\\bany\\b/.test(c) && /:\\s*unknown/.test(c) && /isSettings\\s*\\(\\s*value\\s*:\\s*unknown\\s*\\)\\s*:\\s*value\\s+is\\s+Settings/.test(c);", fail: "function isSettings(value: unknown): value is Settings" },
          ],
          solution: {
            "src/settings.ts": `export type Settings = { theme: "light" | "dark"; fontSize: number };

const DEFAULTS: Settings = { theme: "light", fontSize: 16 };

function isSettings(value: unknown): value is Settings {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Record<string, unknown>;
  return (v.theme === "light" || v.theme === "dark") && typeof v.fontSize === "number";
}

export function parseSettings(text: string): Settings {
  let value: unknown;
  try {
    value = JSON.parse(text);
  } catch {
    return DEFAULTS;
  }
  return isSettings(value) ? value : DEFAULTS;
}
`,
          },
          hint: "A type guard's return type, value is Settings, tells TypeScript what a true result means.",
          successMessage: "Unknown in, checked, typed out: no any left to leak.",
        }),
      },
      {
        id: "a-rx-converting-js",
        title: "Converting an existing JavaScript React project to TypeScript",
        explain:
          "Migrate gradually; nobody rewrites a working app in one go. 1. Install typescript, @types/react and @types/react-dom, and add a tsconfig.json (copy Vite's react-ts template), with allowJs so .js and .ts files live side by side. 2. Rename one file at a time, leaves first (utilities, then small components), from .js/.jsx to .ts/.tsx. 3. Fix the errors that appear: usually parameters that \"implicitly have an 'any' type\" and values that are \"possibly undefined\". 4. Add shared types (types.ts) for the data the app passes around. 5. When everything is converted, turn on strict and add tsc --noEmit to the build or CI. Each step leaves a working app.",
        example: "error TS7006: Parameter 'items' implicitly has an 'any' type.",
        tsCheck: {
          code: "export function count(items) {\n  return items.length;\n}\n",
          errors: ["TS7006"],
          quotes: ["Parameter 'items' implicitly has an 'any' type."],
        },
        webLab: tsLab({
          task:
            "This cart summary was just renamed from .jsx to .tsx, and strict mode reports errors: its parameters implicitly have any types and an optional coupon is not handled. Add a CartLine type ({ name: string; price: number; qty: number }), type the props as { lines: CartLine[]; coupon?: string }, type subtotal's parameter, and handle a missing coupon (show \"No coupon\"). Behaviour must not change otherwise.",
          files: {
            "src/CartSummary.tsx": `function subtotal(lines) {
  return lines.reduce((sum, l) => sum + l.price * l.qty, 0);
}

export default function CartSummary({ lines, coupon }) {
  return (
    <section>
      <p className="subtotal">Subtotal: {subtotal(lines)}</p>
      <p className="coupon">Coupon: {coupon.toUpperCase()}</p>
    </section>
  );
}
`,
            "src/App.tsx": `import CartSummary from "./CartSummary";

const lines = [{ name: "Tote bag", price: 7500, qty: 2 }];

export default function App() {
  return (
    <>
      <CartSummary lines={lines} coupon="welcome10" />
      <CartSummary lines={lines} />
    </>
  );
}
`,
          },
          readOnly: ["src/App.tsx"],
          starterTypeErrors: true,
          tests: [
            { label: "Both summaries render, with and without a coupon", check: "const c = $$('.coupon').map((p) => text(p)); return c.join('|') === 'Coupon: WELCOME10|Coupon: No coupon' && $$('.subtotal').every((p) => text(p) === 'Subtotal: 15000');", fail: "{coupon ? coupon.toUpperCase() : \"No coupon\"}" },
            { label: "The types are added", check: "const c = code('src/CartSummary.tsx'); return /(type|interface)\\s+CartLine/.test(c) && /lines\\s*:\\s*CartLine\\[\\]/.test(c) && /coupon\\?\\s*:\\s*string/.test(c) && /subtotal\\s*\\(\\s*lines\\s*:\\s*CartLine\\[\\]\\s*\\)/.test(c);", fail: "type CartLine = { … }; and annotate the props and subtotal." },
          ],
          solution: {
            "src/CartSummary.tsx": `type CartLine = { name: string; price: number; qty: number };

type CartSummaryProps = { lines: CartLine[]; coupon?: string };

function subtotal(lines: CartLine[]): number {
  return lines.reduce((sum, l) => sum + l.price * l.qty, 0);
}

export default function CartSummary({ lines, coupon }: CartSummaryProps) {
  return (
    <section>
      <p className="subtotal">Subtotal: {subtotal(lines)}</p>
      <p className="coupon">Coupon: {coupon ? coupon.toUpperCase() : "No coupon"}</p>
    </section>
  );
}
`,
          },
          hint: "The second CartSummary has no coupon: in the JavaScript version that crashed at runtime; TypeScript reported it before it ran.",
          successMessage: "Converted, typed, and a real crash found by the compiler on the way.",
        }),
      },
    ],
    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 69 · 11.P
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "rx-l69-m11-project",
    moduleId: MODULE,
    sectionId: SECTION_ID,
    order: 6,
    covers: ["11.P"],
    title: "Practical: The Product Dashboard in TypeScript",
    subtitle: "Typed components, a validated API layer and modelled async states",
    estimatedMinutes: 60,
    intro: "The Module 11 practical converts a version of the Module 9 dashboard to TypeScript: shared types, a validated API service, a typed generic table and an AsyncState union.",

    atoms: [
      {
        id: "a-rx-m11-project",
        title: "Convert the product dashboard",
        explain:
          "Work leaves first: the types, then the API service, then the presentational table, then the page. The model answer is compiled with tsc in strict mode, so it has no any and no type errors; aim for the same in yours, using your editor to see the errors as you go.",
        webLab: tsLab({
          task:
            "Convert the dashboard. types.ts: a Zod ProductSchema (id number, name string, price number, stock number) and type Product = z.infer<typeof ProductSchema>; plus AsyncState<T> (loading | error with message | success with data). api.ts: listProducts(): Promise<Product[]> that validates with z.array(ProductSchema) and throws on non-ok. DataTable.tsx: a generic DataTable<T> taking rows: T[], getKey: (row: T) => number, and columns: { header: string; cell: (row: T) => ReactNode }[], rendering a table with a <th> per column and a <tr> per row. App.tsx: loads products into an AsyncState<Product[]>, shows \"Loading…\", errors in role=\"alert\", or the DataTable with Name, Price (₦ formatted) and Stock columns. No any anywhere.",
          files: {
            "src/types.ts": "",
            "src/api.ts": "",
            "src/DataTable.tsx": "",
            "src/App.tsx": `export default function App() {
  return <h1>Products</h1>;
}
`,
          },
          mocks: [{ match: "/api/products", body: [{ id: 1, name: "Ankara tote bag", price: 7500, stock: 12 }, { id: 2, name: "Leather sandals", price: 18000, stock: 0 }], delay: 120 }],
          revealSolution: false,
          tests: [
            { label: "Loading, then the table", check: "const l = text('#root').includes('Loading…'); await waitFor(() => $$('tbody tr').length === 2); return l && $$('th').map((t) => text(t)).join() === 'Name,Price,Stock' && [...$$('tbody tr')[1].children].map((td) => text(td)).join('|') === 'Leather sandals|₦18,000|0';", fail: "AsyncState<Product[]> with a DataTable on success." },
            { label: "Invalid API data shows an error", mocks: [{ match: "/api/products", body: [{ id: "one", name: "Tote" }], delay: 30 }], check: "return await waitFor(() => !!$('[role=alert]') && text('[role=alert]').length > 0) && !$('tbody tr');", fail: "Validate with z.array(ProductSchema).parse(…)." },
            { label: "Typed with Zod, AsyncState and a generic table", check: "const t = code('src/types.ts'); const d = code('src/DataTable.tsx'); return /z\\.infer<\\s*typeof\\s+ProductSchema\\s*>/.test(t) && /AsyncState<\\s*T\\s*>/.test(t) && /function\\s+DataTable\\s*<\\s*T\\s*>/.test(d) && /Promise<\\s*Product\\[\\]\\s*>/.test(code('src/api.ts'));", fail: "Follow the structure in the task." },
            { label: "No any", check: "return !['src/types.ts', 'src/api.ts', 'src/DataTable.tsx', 'src/App.tsx'].some((f) => /:\\s*any\\b|<any>|as\\s+any/.test(code(f)));", fail: "Replace any with real types or unknown." },
          ],
          solution: {
            "src/types.ts": `import { z } from "zod";

export const ProductSchema = z.object({
  id: z.number(),
  name: z.string(),
  price: z.number(),
  stock: z.number(),
});

export type Product = z.infer<typeof ProductSchema>;

export type AsyncState<T> =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "success"; data: T };
`,
            "src/api.ts": `import { z } from "zod";
import { ProductSchema, type Product } from "./types";

export async function listProducts(): Promise<Product[]> {
  const res = await fetch("/api/products");
  if (!res.ok) throw new Error("Could not load products (" + res.status + ")");
  return z.array(ProductSchema).parse(await res.json());
}
`,
            "src/DataTable.tsx": `import type { ReactNode } from "react";

export type Column<T> = { header: string; cell: (row: T) => ReactNode };

type DataTableProps<T> = {
  rows: T[];
  getKey: (row: T) => number;
  columns: Column<T>[];
};

export default function DataTable<T>({ rows, getKey, columns }: DataTableProps<T>) {
  return (
    <table>
      <thead>
        <tr>
          {columns.map((c) => (
            <th key={c.header}>{c.header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={getKey(row)}>
            {columns.map((c) => (
              <td key={c.header}>{c.cell(row)}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
`,
            "src/App.tsx": `import { useEffect, useState } from "react";
import DataTable, { type Column } from "./DataTable";
import { listProducts } from "./api";
import type { AsyncState, Product } from "./types";

const naira = (n: number) => "₦" + n.toLocaleString("en-NG");

const columns: Column<Product>[] = [
  { header: "Name", cell: (p) => p.name },
  { header: "Price", cell: (p) => naira(p.price) },
  { header: "Stock", cell: (p) => p.stock },
];

export default function App() {
  const [state, setState] = useState<AsyncState<Product[]>>({ status: "loading" });

  useEffect(() => {
    let ignore = false;
    listProducts()
      .then((data) => !ignore && setState({ status: "success", data }))
      .catch((e: unknown) => !ignore && setState({ status: "error", message: e instanceof Error ? e.message : "Unknown error" }));
    return () => {
      ignore = true;
    };
  }, []);

  return (
    <main>
      <h1>Products</h1>
      {state.status === "loading" && <p>Loading…</p>}
      {state.status === "error" && <p role="alert">{state.message}</p>}
      {state.status === "success" && <DataTable rows={state.data} getKey={(p) => p.id} columns={columns} />}
    </main>
  );
}
`,
          },
          hint: "Write types.ts first; everything else imports from it.",
          successMessage: "Typed end to end: the data is validated where it enters and typed everywhere it goes.",
        }),
      },
    ],
    task: {
      title: "Module 11 practical: convert your Module 9 dashboard",
      intro: "Take your own Module 9 product dashboard and convert it to TypeScript.",
      prompts: [
        "Add TypeScript to the Vite project (or start from the react-ts template and move files across), with strict on.",
        "Convert leaves first: types and Zod schemas, then the API service, then components, then pages.",
        "Model every request's state with a discriminated union, and type your TanStack Query hooks with your Product type.",
        "Add tsc --noEmit (Vite's template calls it in npm run build) and get it to zero errors, with no any.",
        "Mastery checkpoint: show a component's props type, an API response validated with Zod, and the AsyncState union, and explain what each prevents.",
      ],
      closing: "Next: Module 12, authentication and security.",
    },
    requirements: { read: true, video: false, assessment: true },
  },
];
