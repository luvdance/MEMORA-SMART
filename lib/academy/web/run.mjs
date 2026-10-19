/**
 * WEB LABS, VERIFIED IN A REAL BROWSER
 *
 * The Responsive Web Development course grades pages, not printed output, so
 * its practices can only be proved by rendering them. Every `webLab` is
 * loaded here in headless Chrome with exactly the document the lesson builds
 * (src/academy/webHarness.js), at exactly the viewport width each check
 * names:
 *
 *   · the model answer must pass every check, with no uncaught errors;
 *   · the starter must FAIL at least one check, or the lab is already solved;
 *   · every `webDemo` must render without an uncaught error, and print what
 *     it claims when it declares `expectedOutput`.
 *
 * Each page load is a real navigation to an intercepted http://lab.test/ URL,
 * so every load starts with a fresh window, as a fresh iframe does in the
 * lesson. Every other request is aborted: labs never touch the network.
 *
 * A browser is optional, like Python and g++. Without Chrome, Edge or
 * Chromium the labs are reported as NOT verified rather than failing the
 * build. Set CHROME_PATH to point at a browser somewhere unusual.
 */

import { existsSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { buildLabDocument, groupTests, solvedFiles, summarise } from "../../../src/academy/webHarness.js";

export function findBrowser() {
  const env = process.env.CHROME_PATH || process.env.PUPPETEER_EXECUTABLE_PATH;
  const candidates = [
    env,
    "C:/Program Files/Google/Chrome/Application/chrome.exe",
    "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
    "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
    "C:/Program Files/Microsoft/Edge/Application/msedge.exe",
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/Applications/Chromium.app/Contents/MacOS/Chromium",
    "/usr/bin/google-chrome",
    "/usr/bin/google-chrome-stable",
    "/usr/bin/chromium",
    "/usr/bin/chromium-browser",
  ].filter(Boolean);
  return candidates.find((p) => existsSync(p)) || null;
}

const PARALLEL = 6;

/** Load one document at one width and collect what the harness reports. */
async function load(page, doc, width) {
  page.__doc = doc;
  await page.setViewport({ width, height: 800 });
  page.__n = (page.__n || 0) + 1;
  await page.goto(`http://lab.test/${page.__n}`, { waitUntil: "load", timeout: 15000 });
  return page.evaluate(
    () =>
      Promise.race([
        window.__labDone,
        new Promise((resolve) => setTimeout(() => resolve({ results: [], errors: ["(the checks timed out)"] }), 12000)),
      ]),
  );
}

async function runLab(page, lab, files) {
  const loads = [];
  for (const group of groupTests({ ...lab, files })) {
    const doc = buildLabDocument(files, {
      page: group.page,
      mode: "grade",
      tests: group.tests,
      mocks: group.mocks,
      seed: group.seed,
    });
    loads.push(await load(page, doc, group.width));
  }
  return summarise(lab, loads);
}

function shape(id, lab, errors) {
  if (!lab.task) errors.push(`${id}: webLab has no task`);
  if (!lab.files || !Object.keys(lab.files).length) errors.push(`${id}: webLab has no files`);
  if (!lab.tests?.length) errors.push(`${id}: webLab has no checks`);
  if (!lab.solution || !Object.keys(lab.solution).length) errors.push(`${id}: webLab has no model answer`);
  for (const name of Object.keys(lab.solution || {})) {
    if (!(name in (lab.files || {}))) errors.push(`${id}: the model answer writes ${name}, which is not one of the lab's files`);
    if ((lab.readOnly || []).includes(name)) errors.push(`${id}: the model answer changes ${name}, which the learner cannot edit`);
  }
  (lab.tests || []).forEach((t, i) => {
    if (!t.label) errors.push(`${id}: check ${i + 1} has no label`);
    if (!t.check) errors.push(`${id}: check ${i + 1} has no code`);
    if (t.page && !(t.page in (lab.files || {}))) errors.push(`${id}: check ${i + 1} names page ${t.page}, which does not exist`);
  });
}

/**
 * labs:  [{ id, lab }]   graded practices
 * demos: [{ id, demo }]  worked examples
 */
export async function verifyLabs(labs, demos, browserPath) {
  const errors = [];
  for (const { id, lab } of labs) shape(id, lab, errors);
  for (const { id, demo } of demos) {
    if (!demo.files || !Object.keys(demo.files).length) errors.push(`${id}: webDemo has no files`);
  }
  if (!browserPath) return { checked: 0, demosChecked: 0, errors };

  const { default: puppeteer } = await import("puppeteer-core");
  const profile = mkdtempSync(join(tmpdir(), "academy-weblab-"));
  const browser = await puppeteer.launch({
    executablePath: browserPath,
    headless: true,
    // A fresh profile every run: a Chrome left behind by an interrupted run
    // would otherwise hold the default profile and block the launch.
    userDataDir: profile,
    args: [
      "--no-first-run",
      "--no-default-browser-check",
      "--disable-extensions",
      "--mute-audio",
      // Six tabs run at once, and only one is ever "in front". Without these a
      // background tab's timers are throttled and every check crawls.
      "--disable-background-timer-throttling",
      "--disable-renderer-backgrounding",
      "--disable-backgrounding-occluded-windows",
    ],
  });

  async function makePage() {
    const page = await browser.newPage();
    await page.setRequestInterception(true);
    page.on("request", (req) => {
      if (/^http:\/\/lab\.test\/\d+$/.test(req.url())) {
        req.respond({ status: 200, contentType: "text/html; charset=utf-8", body: page.__doc || "" });
      } else if (req.url().startsWith("http://lab.test/")) {
        // A path that is none of the lab's files: a broken link, as on a real server.
        req.respond({ status: 404, contentType: "text/plain", body: "Not found" });
      } else if (req.url().startsWith("data:")) {
        req.continue();
      } else {
        req.abort();
      }
    });
    return page;
  }

  const pages = [];
  for (let i = 0; i < PARALLEL; i += 1) pages.push(await makePage());

  let checked = 0;
  let demosChecked = 0;
  const jobs = [
    ...labs.map((x) => ({ kind: "lab", ...x })),
    ...demos.map((x) => ({ kind: "demo", ...x })),
  ];
  let next = 0;

  async function runJob(page, job) {
      {
        if (job.kind === "lab") {
          const { id, lab } = job;
          const solved = await runLab(page, lab, solvedFiles(lab));
          const failing = solved.checks.filter((c) => !c.passed);
          if (failing.length) {
            errors.push(
              `${id}: the model answer fails ${failing.length} check(s): ` +
                failing.map((c) => `"${c.label}"${c.error ? ` (${c.error})` : ""}`).join("; ")
            );
          }
          if (solved.errors.length && !lab.allowErrors) {
            errors.push(`${id}: the model answer throws: ${solved.errors.join(" | ")}`);
          }
          const start = await runLab(page, lab, { ...lab.files });
          if (start.passed) errors.push(`${id}: the starter already passes every check, so there is nothing to do`);
          checked += 1;
        } else {
          const { id, demo } = job;
          const doc = buildLabDocument(demo.files, { mode: "grade", tests: [], mocks: demo.mocks || [], seed: demo.seed || null });
          const res = await load(page, doc, 1280);
          if (res.errors?.length && !demo.allowErrors) errors.push(`${id}: the demo throws: ${res.errors.join(" | ")}`);
          if (demo.expectedOutput !== undefined) {
            const got = (res.logs || []).join("\n").trim();
            if (got !== String(demo.expectedOutput).trim()) {
              errors.push(`${id}: the demo prints ${JSON.stringify(got)}, but the lesson says ${JSON.stringify(demo.expectedOutput)}`);
            }
          }
          demosChecked += 1;
        }
      }
  }

  // Each job has a time limit, so one page that never settles cannot stall
  // the whole run: the job is reported and the tab is replaced.
  const JOB_LIMIT_MS = 120000;
  async function worker(page) {
    while (next < jobs.length) {
      const job = jobs[next++];
      let timer;
      try {
        await Promise.race([
          runJob(page, job),
          new Promise((_, reject) => {
            timer = setTimeout(() => reject(new Error(`no result within ${JOB_LIMIT_MS / 1000}s`)), JOB_LIMIT_MS);
          }),
        ]);
      } catch (err) {
        errors.push(`${job.id}: could not be loaded in the browser (${err.message})`);
        if (/no result within/.test(err.message)) {
          await page.close().catch(() => {});
          page = await makePage();
        }
      } finally {
        clearTimeout(timer);
      }
    }
  }

  await Promise.all(pages.map(worker));
  await browser.close();
  try {
    rmSync(profile, { recursive: true, force: true });
  } catch {
    /* Windows can hold a file briefly after Chrome exits; the OS cleans temp */
  }
  return { checked, demosChecked, errors };
}
