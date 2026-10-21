/**
 * REACT DEVELOPMENT — LAB HELPERS
 *
 * Every React lab is a Vite project: index.html with a #root element loading
 * /src/main.jsx, which renders <App /> inside <StrictMode>, exactly as
 * `npm create vite@latest` scaffolds it. These helpers write that scaffold so
 * each lab declares only the files the lesson is about.
 *
 * THIS FILE IS CLIENT-SAFE. It holds no answers to graded checks.
 */

export const viteHtml = (title = "React app", entry = "/src/main.jsx") => `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${title}</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="${entry}"></script>
  </body>
</html>
`;

export const MAIN_JSX = `import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
`;

export const MAIN_TSX = `import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
`;

export const BASE_CSS = `:root {
  font-family: system-ui, Arial, sans-serif;
  line-height: 1.5;
  color: #1f2937;
}
body {
  margin: 0;
  padding: 16px;
}
button {
  min-height: 44px;
  padding: 8px 14px;
  font: inherit;
  cursor: pointer;
}
`;

/**
 * A React lab. `files` are the lesson's own files (src/App.jsx and any
 * components); the scaffold is added read-only around them unless the lab
 * provides its own version of a scaffold file.
 *
 *   reactLab({ task, files: { "src/App.jsx": … }, solution: { … }, tests, … })
 *
 * `ts: true` scaffolds main.tsx instead of main.jsx.
 */
export function reactLab({ files = {}, readOnly, title, ts = false, css = BASE_CSS, open, ...rest }) {
  const main = ts ? "src/main.tsx" : "src/main.jsx";
  const scaffold = {
    "index.html": viteHtml(title, `/${main}`),
    [main]: ts ? MAIN_TSX : MAIN_JSX,
    "src/index.css": css,
  };
  const all = { ...scaffold, ...files };
  const given = Object.keys(scaffold).filter((name) => !(name in files));
  // The learner opens on the first file they are meant to edit.
  const first = open || Object.keys(files).find((n) => !(readOnly || []).includes(n));
  return {
    files: orderFiles(all, first),
    readOnly: [...new Set([...given, ...(readOnly || [])])],
    open: first,
    ...rest,
  };
}

/** A worked example: the same scaffold, nothing graded. */
export function reactDemo({ files = {}, title, ts = false, css = BASE_CSS, ...rest }) {
  const lab = reactLab({ files, title, ts, css });
  return { files: lab.files, open: lab.open, ...rest };
}

/** Editable files first, in declaration order; the scaffold after them. */
function orderFiles(all, first) {
  const names = Object.keys(all);
  const scaffold = ["index.html", "src/main.jsx", "src/main.tsx", "src/index.css"];
  const own = names.filter((n) => !scaffold.includes(n));
  const sorted = [...(first ? [first] : []), ...own.filter((n) => n !== first), ...scaffold.filter((n) => names.includes(n))];
  return Object.fromEntries(sorted.map((n) => [n, all[n]]));
}
