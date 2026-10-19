import { LAB_HEIGHT, buildLabDocument, groupTests, summarise } from "./webHarness.js";

/**
 * GRADING A WEB LAB IN THE LESSON
 *
 * Each group of checks (same page, same width, same saved storage) gets its
 * own hidden iframe at exactly that width, so a check written for a 375px
 * phone really is measured on a 375px viewport. The frame is sandboxed with
 * scripts and forms only: no same-origin access, so the learner's page can
 * read nothing of the Academy's, and results come back by postMessage tagged
 * with a one-time nonce.
 *
 * The validator runs the same documents in headless Chrome
 * (lib/academy/web/run.mjs), so what passes there passes here.
 */

export const SANDBOX = "allow-scripts allow-forms";
const TIMEOUT_MS = 10000;

export function makeNonce() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function runGroup(files, group, mocks) {
  return new Promise((resolve) => {
    const nonce = makeNonce();
    const frame = document.createElement("iframe");
    frame.setAttribute("sandbox", SANDBOX);
    frame.setAttribute("aria-hidden", "true");
    frame.tabIndex = -1;
    // Inside the viewport but invisible. A frame moved off screen, or hidden
    // with visibility, is throttled by the browser and its timers crawl.
    Object.assign(frame.style, {
      position: "fixed",
      left: "0",
      top: "0",
      width: `${group.width}px`,
      height: `${LAB_HEIGHT}px`,
      border: "0",
      opacity: "0",
      zIndex: "-1",
      pointerEvents: "none",
    });

    const finish = (load) => {
      window.removeEventListener("message", onMessage);
      clearTimeout(timer);
      frame.remove();
      resolve(load);
    };
    const onMessage = (event) => {
      if (event.source !== frame.contentWindow) return;
      const data = event.data || {};
      if (data.__lab !== nonce || data.type !== "results") return;
      finish({ results: data.results, errors: data.errors });
    };
    const timer = setTimeout(
      () =>
        finish({
          results: group.tests.map((t) => ({
            index: t.index,
            passed: false,
            error: "Your page took too long to load. Is a loop running forever?",
          })),
          errors: [],
        }),
      TIMEOUT_MS
    );

    window.addEventListener("message", onMessage);
    frame.srcdoc = buildLabDocument(files, {
      page: group.page,
      mode: "grade",
      tests: group.tests,
      mocks,
      seed: group.seed,
      nonce,
    });
    document.body.appendChild(frame);
  });
}

/** Run every check of a lab against these files. */
export async function gradeLab(lab, files) {
  const loads = [];
  for (const group of groupTests({ ...lab, files })) {
    loads.push(await runGroup(files, group, group.mocks));
  }
  return summarise(lab, loads);
}
