/**
 * ASSESSMENTS · REACT DEVELOPMENT · MODULE 11 · TYPESCRIPT WITH REACT
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Never import this from anything under src/.
 * ═════════════════════════════════════════════════════════════════════════
 */

import { q, check } from "./rx-helpers.js";

export const ASSESSMENTS = {
  ...check("rx-l64-ts-basics", [
    q({ id: "rxq64-1", atom: "a-rx-why-ts", d: 2, prompt: "When does TypeScript check your types?", options: ["Before the code runs, in the editor and when you run tsc", "In the browser at runtime", "Only in production", "When the server responds"], correct: "a",
      explanation: "Types are erased from the JavaScript that runs.",
      wrong: { b: "The browser never sees types.", c: "No runtime checks anywhere.", d: "It cannot see server data." } }),
    q({ id: "rxq64-2", atom: "a-rx-ts-types", d: 2, prompt: "Which type allows only \"idle\", \"loading\" or \"error\"?", options: ["\"idle\" | \"loading\" | \"error\"", "string", "string[]", "any"], correct: "a",
      explanation: "A literal union.",
      wrong: { b: "Allows any text.", c: "An array.", d: "Allows anything." } }),
    q({ id: "rxq64-3", atom: "a-rx-ts-types", d: 2, prompt: "What does strict mode report for function f(x) { … }?", options: ["Parameter 'x' implicitly has an 'any' type", "Nothing", "x is not defined", "Missing return"], correct: "a",
      explanation: "noImplicitAny is part of strict.",
      wrong: { b: "Strict reports it.", c: "x is a parameter.", d: "Unrelated." } }),
    q({ id: "rxq64-4", atom: "a-rx-interfaces-aliases", d: 3, prompt: "Which can only a type alias express?", options: ["A union: type Id = string | number", "An object shape", "Extending another shape", "Optional properties"], correct: "a",
      explanation: "Interfaces describe object shapes only.",
      wrong: { b: "Both can.", c: "Interfaces extend; aliases use &.", d: "Both can." } }),
  ]),

  ...check("rx-l65-typed-props", [
    q({ id: "rxq65-1", atom: "a-rx-typed-props", d: 2, prompt: "How are a component's props typed in the recommended style?", options: ["function Card({ title }: CardProps)", "const Card: any = …", "function Card(props: object)", "Props cannot be typed"], correct: "a",
      explanation: "Annotate the destructured parameter.",
      wrong: { b: "Turns checking off.", c: "Too vague to use.", d: "They can." } }),
    q({ id: "rxq65-2", atom: "a-rx-typed-props", d: 2, prompt: "How do you type a callback prop that receives a course id?", options: ["onEnroll: (courseId: string) => void", "onEnroll: function", "onEnroll: string", "onEnroll: Event"], correct: "a",
      explanation: "A function type with its parameters and return.",
      wrong: { b: "Not a TypeScript type.", c: "It is a function.", d: "Unrelated." } }),
    q({ id: "rxq65-3", atom: "a-rx-typed-children-events", d: 2, prompt: "Which type fits a children prop that may be text, elements or null?", options: ["ReactNode", "string", "HTMLElement", "JSX.Element[] only"], correct: "a",
      explanation: "ReactNode covers everything React can render.",
      wrong: { b: "Too narrow.", c: "A DOM type, not React's.", d: "Too narrow." } }),
    q({ id: "rxq65-4", atom: "a-rx-typed-children-events", d: 3, prompt: "Which type does a separate input change handler's parameter need?", options: ["React.ChangeEvent<HTMLInputElement>", "Event", "InputEvent<string>", "React.FormEvent<HTMLFormElement>"], correct: "a",
      explanation: "So e.target.value is known to exist.",
      wrong: { b: "Too general: no target.value.", c: "Not React's type.", d: "That is for a form's submit." } }),
  ]),

  ...check("rx-l66-typed-hooks", [
    q({ id: "rxq66-1", atom: "a-rx-typed-hooks", d: 2, prompt: "Why write useState<User | null>(null) instead of useState(null)?", options: ["From null alone, TypeScript cannot know a User will be stored later", "null is not allowed", "It is faster", "useState requires a type"], correct: "a",
      explanation: "The initial value does not show the future type.",
      wrong: { b: "It is allowed.", c: "Unrelated.", d: "Only when inference cannot tell." } }),
    q({ id: "rxq66-2", atom: "a-rx-typed-hooks", d: 3, prompt: "With type Action = { type: \"added\"; text: string } | { type: \"cleared\" }, what does TypeScript know in case \"cleared\":?", options: ["That action has no text property", "Nothing", "That action.text is a string", "That the reducer must return null"], correct: "a",
      explanation: "The switch narrows the union.",
      wrong: { b: "It narrows.", c: "That is the \"added\" case.", d: "Unrelated." } }),
    q({ id: "rxq66-3", atom: "a-rx-optional-props", d: 2, prompt: "What is the type of a prop declared subtitle?: string, inside the component?", options: ["string | undefined", "string", "any", "null"], correct: "a",
      explanation: "Handle undefined or give a default.",
      wrong: { b: "It may be missing.", c: "Not any.", d: "Missing means undefined." } }),
    q({ id: "rxq66-4", atom: "a-rx-typed-api", d: 3, prompt: "Why validate an API response with Zod instead of writing as Course[]?", options: ["as only tells the compiler to trust you; Zod checks the real data at runtime", "as is not valid TypeScript", "Zod is faster than fetch", "Types are not allowed on API data"], correct: "a",
      explanation: "A wrong assertion is a lie the compiler believes.",
      wrong: { b: "It is valid, just unchecked.", c: "Unrelated.", d: "They are." } }),
  ]),

  ...check("rx-l67-generics-unions", [
    q({ id: "rxq67-1", atom: "a-rx-generics", d: 2, prompt: "What does the T in function List<T>(…) stand for?", options: ["A type parameter, filled in by each use (Course, User…)", "The word Type", "A fixed type called T", "Any value"], correct: "a",
      explanation: "TypeScript infers it from the props passed.",
      wrong: { b: "It is a placeholder.", c: "It varies per use.", d: "It is a type, not a value." } }),
    q({ id: "rxq67-2", atom: "a-rx-discriminated-unions", d: 2, prompt: "In type S = { status: \"loading\" } | { status: \"success\"; data: string[] }, what is status?", options: ["The discriminant, used to narrow which member it is", "An optional field", "A runtime check added by TypeScript", "A React prop"], correct: "a",
      explanation: "Compare it and TypeScript narrows.",
      wrong: { b: "It is required in each member.", c: "Your code compares it at runtime.", d: "Unrelated." } }),
    q({ id: "rxq67-3", atom: "a-rx-discriminated-unions", d: 3, prompt: "Why is AsyncState as a discriminated union better than { loading: boolean; error?: string; data?: T }?", options: ["Impossible combinations, like data and an error together, cannot be written", "It uses less memory", "It is required by React", "Booleans are slower"], correct: "a",
      explanation: "Each member carries only its own fields.",
      wrong: { b: "Not the reason.", c: "Not required.", d: "Not the reason." } }),
    q({ id: "rxq67-4", atom: "a-rx-typed-context", d: 2, prompt: "Why does useAuth() throw when there is no provider?", options: ["A missing provider fails clearly at once, and callers get a non-null type", "React requires it", "To sign the user out", "To improve speed"], correct: "a",
      explanation: "After the throw, the context value cannot be null.",
      wrong: { b: "A convention, not a requirement.", c: "Unrelated.", d: "Unrelated." } }),
  ]),

  ...check("rx-l68-narrowing", [
    q({ id: "rxq68-1", atom: "a-rx-ts-errors-narrowing", d: 2, prompt: "user is User | null. Which makes user.name safe?", options: ["if (user) { … user.name … }", "user.name as string", "Ignoring the error", "Casting user to any"], correct: "a",
      explanation: "The check narrows away null.",
      wrong: { b: "Asserts, does not check.", c: "Crashes when null.", d: "Turns checking off." } }),
    q({ id: "rxq68-2", atom: "a-rx-ts-errors-narrowing", d: 2, prompt: "Which check narrows a value to an array?", options: ["Array.isArray(value)", "typeof value === \"array\"", "value instanceof Object", "value.length"], correct: "a",
      explanation: "typeof gives \"object\" for arrays.",
      wrong: { b: "typeof never returns \"array\".", c: "Too broad.", d: "Strings have length too." } }),
    q({ id: "rxq68-3", atom: "a-rx-avoid-any", d: 3, prompt: "What is the difference between any and unknown?", options: ["any allows everything unchecked; unknown allows nothing until you narrow it", "They are the same", "unknown allows everything", "any is safer"], correct: "a",
      explanation: "Use unknown for values of unknown type.",
      wrong: { b: "Opposites in safety.", c: "Reversed.", d: "Reversed." } }),
    q({ id: "rxq68-4", atom: "a-rx-converting-js", d: 2, prompt: "How should an existing JavaScript React app be converted to TypeScript?", options: ["Gradually, file by file from the leaves up, with allowJs", "All files in one weekend", "Rewrite from scratch", "Add // @ts-ignore everywhere"], correct: "a",
      explanation: "Each step leaves a working app.",
      wrong: { b: "Risky and hard to review.", c: "Throws away working code.", d: "Hides every error." } }),
  ]),

  ...check("rx-l69-m11-project", [
    q({ id: "rxq69-1", atom: "a-rx-m11-project", d: 2, prompt: "Where does the dashboard's Product type come from?", options: ["z.infer<typeof ProductSchema>, so the type and the runtime check always agree", "It is typed by hand in every file", "From the server automatically", "From any"], correct: "a",
      explanation: "One schema, two guarantees.",
      wrong: { b: "Duplicates drift.", c: "TypeScript cannot see the server.", d: "No checking." } }),
    q({ id: "rxq69-2", atom: "a-rx-m11-project", d: 3, prompt: "In a catch block, error is unknown. How do you read its message safely?", options: ["e instanceof Error ? e.message : \"Unknown error\"", "e.message", "(e as any).message", "String(e.message)"], correct: "a",
      explanation: "Anything can be thrown; narrow first.",
      wrong: { b: "Not allowed on unknown.", c: "Disables checking.", d: "Still reads message unchecked." } }),
    q({ id: "rxq69-3", atom: "a-rx-m11-project", d: 2, prompt: "What does a generic DataTable<T> with columns of { header; cell: (row: T) => ReactNode } give you?", options: ["One table for any data, where each cell function is checked against the row type", "A faster table", "Automatic sorting", "Server-side rendering"], correct: "a",
      explanation: "Typos in cell functions are compile errors.",
      wrong: { b: "Not about speed.", c: "Not included.", d: "Unrelated." } }),
    q({ id: "rxq69-4", atom: "a-rx-m11-project", d: 2, prompt: "Which file should the dashboard's conversion start with?", options: ["types.ts: the shared types and schemas everything else imports", "App.tsx", "main.tsx", "index.css"], correct: "a",
      explanation: "Convert leaves first.",
      wrong: { b: "It depends on everything else.", c: "Rarely needs much.", d: "Not TypeScript." } }),
  ]),
};
