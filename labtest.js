// Temporary: runs a Prisma lab in the browser's lab worker (delete when the course is finished).
import { gradeProgram, onMachineEvent } from "/src/academy/node/runner.js";
const out = [];
onMachineEvent((e) => e.type === "output" && out.push(e.text));
const schema = `generator client {
  provider = "prisma-client"
  output   = "../src/generated/prisma"
}

datasource db {
  provider = "postgresql"
}

model Course {
  id    Int    @id @default(autoincrement())
  code  String @unique
  title String
}
`;
const migration = `-- CreateTable
CREATE TABLE "Course" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "title" TEXT NOT NULL,

    CONSTRAINT "Course_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Course_code_key" ON "Course"("code");
`;
const lab = {
  files: {
    "package.json": JSON.stringify({ name: "course-api", version: "1.0.0", type: "module", dependencies: { "@prisma/adapter-pg": "^7.10.1", "@prisma/client": "^7.10.1", dotenv: "^18.0.9" }, devDependencies: { prisma: "^7.10.1" } }),
    ".env": "DATABASE_URL=postgres://academy_app:app-password@localhost:5432/academy\n",
    "prisma.config.ts": `import "dotenv/config";\nimport { defineConfig, env } from "prisma/config";\n\nexport default defineConfig({\n  schema: "prisma/schema.prisma",\n  migrations: { path: "prisma/migrations" },\n  datasource: { url: env("DATABASE_URL") },\n});\n`,
    "prisma/schema.prisma": schema,
    "prisma/migrations/migration_lock.toml": 'provider = "postgresql"\n',
    "prisma/migrations/20261023203421_init/migration.sql": migration,
    "main.ts": `import "dotenv/config";\nimport { PrismaPg } from "@prisma/adapter-pg";\nimport { PrismaClient } from "./src/generated/prisma/client.ts";\n\nconst prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) });\nawait prisma.course.create({ data: { code: "BE-101", title: "Backend" } });\nconsole.log(await prisma.course.findMany());\nawait prisma.$disconnect();\n`,
  },
  db: { setup: "" },
  command: false,
  tests: [
    { label: "deploy", check: `await run("npx prisma migrate deploy"); has(output(), "All migrations have been successfully applied.", "deploy");` },
    { label: "generate", check: `await run("npx prisma generate"); has(output(), "Generated Prisma Client (7.10.1)", "generate");` },
    { label: "client", check: `await run("node main.ts"); has(output(), "code: 'BE-101'", "the client wrote and read a row");` },
  ],
};
try {
  const t0 = performance.now();
  const g = await gradeProgram(lab, lab.files);
  window.__result = { checks: g.checks, out: out.join("").slice(-3000), ms: Math.round(performance.now() - t0) };
} catch (e) {
  window.__result = { error: String(e.stack || e) };
}
document.getElementById("out").textContent = JSON.stringify(window.__result, null, 2);
