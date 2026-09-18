/**
 * Verifies the two claims made about the leaderboard on a lesson page:
 *   1. it starts collapsed
 *   2. it issues NO Firestore request while collapsed
 * and that opening it neither covers content nor causes a page-wide reflow.
 */
import { spawn } from "node:child_process";
import { writeFileSync, mkdirSync } from "node:fs";
import WebSocket from "ws";

const OUT = process.argv[2];
const URL_ = process.argv[3];
mkdirSync(OUT, { recursive: true });

const CHROME = String.raw`C:\Program Files\Google\Chrome\Application\chrome.exe`;
const chrome = spawn(CHROME, [
  "--remote-debugging-port=9377",
  "--headless=new",
  "--disable-gpu",
  "--no-first-run",
  `--user-data-dir=${OUT}/p`,
  "about:blank",
]);
chrome.on("error", (e) => {
  console.error("chrome:", e.message);
  process.exit(1);
});
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

let wsUrl = null;
for (let i = 0; i < 40 && !wsUrl; i += 1) {
  await sleep(300);
  try {
    const l = await (await fetch("http://127.0.0.1:9377/json/list")).json();
    wsUrl = l.find((t) => t.type === "page")?.webSocketDebuggerUrl;
  } catch {
    /* not up */
  }
}
const ws = new WebSocket(wsUrl);
let id = 0;
const pending = new Map();
const requests = [];
ws.on("message", (raw) => {
  const m = JSON.parse(raw.toString());
  if (m.id && pending.has(m.id)) {
    pending.get(m.id)(m.result);
    pending.delete(m.id);
  }
  if (m.method === "Network.requestWillBeSent") {
    requests.push(m.params.request.url);
  }
});
const send = (method, params = {}) =>
  new Promise((res) => {
    id += 1;
    pending.set(id, res);
    ws.send(JSON.stringify({ id, method, params }));
  });

await new Promise((r) => ws.on("open", r));
await send("Runtime.enable");
await send("Page.enable");
await send("Network.enable");
await send("Emulation.setDeviceMetricsOverride", {
  width: 390,
  height: 860,
  deviceScaleFactor: 2,
  mobile: true,
});
await send("Page.navigate", { url: URL_ });
await sleep(4500);

const ev = async (e) =>
  (await send("Runtime.evaluate", { expression: e, returnByValue: true })).result.value;

const firestoreCalls = () =>
  requests.filter((u) => /firestore|googleapis\.com\/google\.firestore/i.test(u)).length;

console.log("── CLOSED STATE ──");
console.log("leaderboard present:", await ev("!!document.querySelector('.ac-lb')"));
console.log("starts collapsed:", await ev("document.querySelector('.ac-lb__toggle')?.getAttribute('aria-expanded')"));
console.log("body mounted while closed:", await ev("!!document.querySelector('.ac-lb__body')"));
console.log("collapsed bar height:", await ev("Math.round(document.querySelector('.ac-lb')?.getBoundingClientRect().height || 0) + 'px'"));
console.log("is it position:fixed/overlay?:", await ev(
  "(()=>{const el=document.querySelector('.ac-lb');if(!el)return 'n/a';const cs=getComputedStyle(el);return cs.position + ' z-index:' + cs.zIndex})()"
));
const closedCalls = firestoreCalls();
console.log("firestore requests so far:", closedCalls);

// Does it sit after the lesson content, rather than over it?
console.log("sits below the lesson content:", await ev(`(() => {
  const lb = document.querySelector('.ac-lb');
  const main = document.querySelector('main');
  if (!lb || !main) return 'n/a';
  const l = lb.getBoundingClientRect(), m = main.getBoundingClientRect();
  return (l.top >= m.top) ? 'yes, top=' + Math.round(l.top) : 'NO - overlaps';
})()`));

const heightBefore = await ev("document.body.scrollHeight");
const scrollBefore = await ev("window.scrollY");

console.log("\n── OPENING IT ──");
await ev("document.querySelector('.ac-lb__toggle')?.click()");
await sleep(9000);

console.log("now expanded:", await ev("document.querySelector('.ac-lb__toggle')?.getAttribute('aria-expanded')"));
console.log("body mounted:", await ev("!!document.querySelector('.ac-lb__body')"));
console.log("body text:", await ev("(document.querySelector('.ac-lb__body')?.innerText || '').replace(/\\n/g,' | ').slice(0,150)"));
console.log("firestore requests after opening:", firestoreCalls(), `(was ${closedCalls})`);
console.log("page height", heightBefore, "->", await ev("document.body.scrollHeight"));
console.log("scroll position unchanged:", (await ev("window.scrollY")) === scrollBefore);
console.log("no horizontal overflow:", await ev("document.documentElement.scrollWidth <= window.innerWidth"));

await ev("document.querySelector('.ac-lb')?.scrollIntoView({block:'center'})");
await sleep(500);
const { data } = await send("Page.captureScreenshot", { format: "png" });
writeFileSync(`${OUT}/leaderboard-open.png`, Buffer.from(data, "base64"));

console.log("\n── COLLAPSING AGAIN ──");
await ev("document.querySelector('.ac-lb__toggle')?.click()");
await sleep(500);
console.log("collapsed:", await ev("document.querySelector('.ac-lb__toggle')?.getAttribute('aria-expanded')"));
console.log("body unmounted:", !(await ev("!!document.querySelector('.ac-lb__body')")));

ws.close();
chrome.kill();
process.exit(0);
