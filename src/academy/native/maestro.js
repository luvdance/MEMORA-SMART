/**
 * MAESTRO FLOWS ON THE PRACTICE PHONE
 *
 * End-to-end tests drive the whole app the way a user does: launch it, tap,
 * type, and check what is on the screen. Expo's own CI (EAS Workflows) runs
 * them with Maestro, whose tests are YAML "flows" in a .maestro/ folder. The
 * practice phone runs the same flow files with the commands most flows use:
 *
 *   launchApp (clearState), tapOn, longPressOn, inputText, eraseText,
 *   assertVisible, assertNotVisible, scrollUntilVisible, scroll, back,
 *   hideKeyboard, pressKey, openLink, waitForAnimationToEnd,
 *   extendedWaitUntil, takeScreenshot, setLocation, stopApp.
 *
 * Text selectors are regular expressions matched against the whole text, as
 * in Maestro; `id` matches a testID. Like Maestro, every command waits a
 * moment for its element before it fails. Output is printed in the style of
 * `maestro test`.
 */

import yaml from "js-yaml";
import { isHidden } from "./testing.js";

const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const norm = (s) => String(s ?? "").replace(/\s+/g, " ").trim();

function fullMatch(pattern, text) {
  const t = norm(text);
  if (t === norm(pattern)) return true;
  try {
    return new RegExp(`^(?:${pattern})$`, "s").test(t);
  } catch {
    return false;
  }
}

/** Visible elements matching a Maestro selector, best match first. */
function find(root, selector) {
  const sel = typeof selector === "string" ? { text: selector } : selector || {};
  const all = [...root.querySelectorAll("*")].filter((el) => !isHidden(el, root) && el.getBoundingClientRect().width > 0);
  let hits = all.filter((el) => {
    if (sel.id && el.getAttribute("data-testid") !== sel.id && !fullMatch(sel.id, el.getAttribute("data-testid") || "")) return false;
    if (sel.text !== undefined) {
      const label = el.getAttribute("aria-label");
      const own = el.getAttribute("dir") === "auto" && !/^(INPUT|TEXTAREA)$/.test(el.tagName) ? el.textContent : null;
      const field = /^(INPUT|TEXTAREA)$/.test(el.tagName) ? el.value || el.getAttribute("placeholder") : null;
      if (![label, own, field].some((t) => t != null && fullMatch(sel.text, t))) return false;
    }
    if (sel.enabled !== undefined && (el.getAttribute("aria-disabled") === "true") === sel.enabled) return false;
    return true;
  });
  hits = hits.filter((el) => !hits.some((o) => o !== el && el.contains(o)) || el.hasAttribute("aria-label"));
  if (sel.index !== undefined) hits = hits[sel.index] ? [hits[sel.index]] : [];
  return hits;
}

async function waitFind(root, selector, ms = 2500) {
  const end = Date.now() + ms;
  for (;;) {
    const hits = find(root(), selector);
    if (hits.length) return hits[0];
    if (Date.now() > end) return null;
    await wait(60);
  }
}

const describe = (s) => (typeof s === "string" ? `"${s}"` : s.id ? `id: "${s.id}"` : `"${s.text}"`);
const setNative = (node, value) => {
  let proto = Object.getPrototypeOf(node);
  while (proto && !Object.getOwnPropertyDescriptor(proto, "value")) proto = Object.getPrototypeOf(proto);
  Object.getOwnPropertyDescriptor(proto, "value").set.call(node, value);
  node.dispatchEvent(new Event("input", { bubbles: true }));
};
const pressable = (el) => el.closest("[role=button],[role=link],[role=tab],[role=switch],[role=checkbox],[role=menuitem],[tabindex],a,button,input,textarea") || el;

/**
 * Run a flow. `phone` gives the runtime's controls: root(), restart({ clearState }),
 * back(), openLink(url), setLocation(lat, lng), stop(), appId.
 */
export async function runFlow(source, phone, { name = "flow" } = {}) {
  const docs = yaml.loadAll(String(source));
  const config = docs.length > 1 ? docs[0] || {} : {};
  const commands = (docs.length > 1 ? docs[1] : docs[0]) || [];
  const steps = [];
  const lines = [`Running on ${phone.deviceName}`, " ║", ` ║  > Flow: ${name}`, " ║"];
  let failed = false;
  let focused = null;
  for (const raw of commands) {
    const [command, arg] = typeof raw === "string" ? [raw, null] : Object.entries(raw)[0];
    let label = command;
    let error = "";
    if (failed) {
      steps.push({ command, label, passed: false, skipped: true });
      continue;
    }
    try {
      switch (command) {
        case "launchApp":
          label = `Launch app "${config.appId || phone.appId}"${arg?.clearState ? " with clear state" : ""}`;
          await phone.restart({ clearState: Boolean(arg?.clearState) });
          break;
        case "stopApp":
          label = "Stop app";
          await phone.stop();
          break;
        case "tapOn":
        case "longPressOn": {
          label = `${command === "tapOn" ? "Tap" : "Long press"} on ${describe(arg)}`;
          const el = await waitFind(phone.root, arg);
          if (!el) throw new Error(`Element not found: ${typeof arg === "string" ? `Text matching regex: ${arg}` : JSON.stringify(arg)}`);
          const target = pressable(el);
          if (/^(INPUT|TEXTAREA)$/.test(target.tagName)) {
            target.focus();
            focused = target;
          } else if (command === "longPressOn") await phone.longPress(target);
          else target.click();
          await wait(250);
          break;
        }
        case "inputText": {
          label = `Input text ${arg}`;
          const el = focused && focused.isConnected ? focused : document.activeElement;
          if (!el || !/^(INPUT|TEXTAREA)$/.test(el.tagName)) throw new Error("No text field is focused. Tap on the field first.");
          setNative(el, (el.value || "") + String(arg));
          await wait(80);
          break;
        }
        case "eraseText": {
          const n = typeof arg === "number" ? arg : 50;
          label = `Erase ${n} characters`;
          const el = focused && focused.isConnected ? focused : document.activeElement;
          if (el && /^(INPUT|TEXTAREA)$/.test(el.tagName)) setNative(el, el.value.slice(0, Math.max(0, el.value.length - n)));
          await wait(60);
          break;
        }
        case "assertVisible":
          label = `Assert that ${describe(arg)} is visible`;
          if (!(await waitFind(phone.root, arg))) throw new Error(`Assertion is false: ${describe(arg)} is visible`);
          break;
        case "assertNotVisible": {
          label = `Assert that ${describe(arg)} is not visible`;
          const end = Date.now() + 2500;
          while (find(phone.root(), arg).length && Date.now() < end) await wait(60);
          if (find(phone.root(), arg).length) throw new Error(`Assertion is false: ${describe(arg)} is not visible`);
          break;
        }
        case "extendedWaitUntil": {
          const target = arg.visible ?? arg.notVisible;
          label = `Wait until ${describe(target)} is ${arg.visible !== undefined ? "visible" : "not visible"}`;
          const ms = Math.min(Number(arg.timeout) || 5000, 3500);
          const end = Date.now() + ms;
          const want = arg.visible !== undefined;
          while ((find(phone.root(), target).length > 0) !== want && Date.now() < end) await wait(60);
          if ((find(phone.root(), target).length > 0) !== want) throw new Error(`Timed out waiting for ${describe(target)}`);
          break;
        }
        case "scrollUntilVisible": {
          const target = arg.element ?? arg;
          label = `Scroll ${String(arg.direction || "DOWN").toLowerCase()} until ${describe(target)} is visible`;
          for (let i = 0; i < 12 && !find(phone.root(), target).length; i++) {
            for (const sc of phone.root().querySelectorAll("*")) {
              if (sc.scrollHeight > sc.clientHeight + 4 && /(auto|scroll)/.test(getComputedStyle(sc).overflowY)) {
                sc.scrollTop += 250;
                sc.dispatchEvent(new Event("scroll"));
              }
            }
            await wait(120);
          }
          if (!find(phone.root(), target).length) throw new Error(`Element not found: ${describe(target)}`);
          break;
        }
        case "scroll":
          label = "Scroll vertically";
          for (const sc of phone.root().querySelectorAll("*")) if (sc.scrollHeight > sc.clientHeight + 4) sc.scrollTop += 300;
          await wait(120);
          break;
        case "back":
          label = "Press back";
          await phone.back();
          await wait(250);
          break;
        case "hideKeyboard":
          label = "Hide keyboard";
          document.activeElement?.blur?.();
          focused = null;
          await wait(60);
          break;
        case "pressKey":
          label = `Press ${arg} key`;
          if (/^enter$/i.test(arg)) {
            const el = focused || document.activeElement;
            el?.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true, cancelable: true }));
            el?.dispatchEvent(new KeyboardEvent("keypress", { key: "Enter", bubbles: true, cancelable: true }));
          } else if (/^back$/i.test(arg)) await phone.back();
          await wait(200);
          break;
        case "openLink":
          label = `Open ${typeof arg === "string" ? arg : arg.link}`;
          await phone.openLink(typeof arg === "string" ? arg : arg.link);
          await wait(300);
          break;
        case "setLocation":
          label = `Set location (${arg.latitude}, ${arg.longitude})`;
          phone.setLocation(Number(arg.latitude), Number(arg.longitude));
          break;
        case "waitForAnimationToEnd":
          label = "Wait for animation to end";
          await wait(300);
          break;
        case "takeScreenshot":
          label = `Take screenshot ${typeof arg === "string" ? arg : arg?.path || ""}`.trim();
          break;
        default:
          throw new Error(`Unknown command: ${command}`);
      }
    } catch (err) {
      error = err.message || String(err);
      failed = true;
    }
    steps.push({ command, label, passed: !error, error });
    lines.push(` ║    ${error ? "❌" : "✅"}   ${label}${error ? `\n ║         ${error}` : ""}`);
  }
  for (const s of steps.filter((x) => x.skipped)) lines.push(` ║    🔲   ${s.label}`);
  lines.push(" ║", failed ? `\n==== Debug output\n1 Flow Failed` : "\n1/1 Flow Passed");
  const output = lines.join("\n");
  console.log(output);
  return { passed: !failed && steps.length > 0, steps, output, appId: config.appId || phone.appId };
}
