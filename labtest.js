import { startProgram, sendRequest, gradeProgram, onMachineEvent } from "/src/academy/node/runner.js";
const out = [];
onMachineEvent((e) => e.type === "output" && out.push(e.text));
const lab = {
  files: {
    "package.json": JSON.stringify({ name: "course-api", version: "1.0.0", type: "module", scripts: { start: "node --env-file=.env server.js" }, dependencies: { express: "^5.1.0", pg: "^8.16.0" } }),
    ".env": "DATABASE_URL=postgres://academy_app:app-password@localhost:5432/academy\n",
    "server.js": `import express from "express";\nimport pg from "pg";\nconst pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });\nconst app = express();\napp.get("/courses", async (req, res) => {\n  const { rows } = await pool.query("SELECT id, title FROM courses WHERE open ORDER BY id");\n  res.json(rows);\n});\napp.listen(3000, () => console.log("listening", new Date().toString()));\n`,
  },
  db: "CREATE TABLE courses (id int primary key, title text, open boolean); INSERT INTO courses VALUES (1,'Node',true),(2,'Old',false),(3,'SQL',true);",
  tests: [{ label: "lists open courses", check: `const r = await get("/courses"); eq(r.body.length, 2, "two");` }],
};
try {
  const t0 = performance.now();
  const s = await startProgram(lab, lab.files);
  const t1 = performance.now();
  const r = await sendRequest({ method: "GET", path: "/courses" });
  const g = await gradeProgram(lab, lab.files);
  const t2 = performance.now();
  window.__result = { s: { state: s.state, ports: s.ports }, r: { status: r.status, text: r.text }, g: g.checks, out, start: Math.round(t1 - t0), grade: Math.round(t2 - t1) };
} catch (e) {
  window.__result = { error: String(e.stack || e) };
}
document.getElementById("out").textContent = JSON.stringify(window.__result, null, 2);
