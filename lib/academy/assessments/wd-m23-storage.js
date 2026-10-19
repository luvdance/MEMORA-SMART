/**
 * ASSESSMENTS · RESPONSIVE WEB DEVELOPMENT · MODULE 23 · BROWSER STORAGE
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Never import this from anything under src/.
 * ═════════════════════════════════════════════════════════════════════════
 */

import { q, check } from "./wd-helpers.js";

export const ASSESSMENTS = {
  ...check("wd-l102-storage-basics", [
    q({ id: "wdq102-1", atom: "a-wd-what-storage", d: 2, prompt: "Who can see a site's localStorage data?", options: ["Only pages from that same site, in that same browser on that device", "Every website", "The person on any device they log in from", "Search engines"], correct: "a",
      explanation: "It is per origin and per browser.",
      wrong: { b: "Other sites cannot read it.", c: "It does not sync between devices.", d: "It never leaves the browser." } }),
    q({ id: "wdq102-2", atom: "a-wd-localstorage", d: 2, prompt: "What does localStorage.getItem(\"x\") return when nothing was saved under x?", options: ["null", "undefined", "\"\"", "An error"], correct: "a",
      explanation: "null means nothing is saved.",
      wrong: { b: "Storage returns null.", c: "Not an empty string.", d: "Not an error." } }),
    q({ id: "wdq102-3", atom: "a-wd-sessionstorage", d: 2, prompt: "When is sessionStorage data removed?", options: ["When that tab is closed", "On every refresh", "Never", "After one minute"], correct: "a",
      explanation: "It survives refreshes but not closing the tab.",
      wrong: { b: "It survives a refresh.", c: "That is localStorage.", d: "No timer." } }),
    q({ id: "wdq102-4", atom: "a-wd-storage-strings", d: 3, type: "scenario", prompt: "A page saves visits as 4, then on the next load shows getItem(\"visits\") + 1 as \"41\". Why?", options: ["Storage returns the string \"4\", and + joins strings", "localStorage cannot store numbers so it corrupted it", "The visit was counted twice", "getItem adds 1 itself"], correct: "a",
      explanation: "Convert with Number() when reading.",
      wrong: { b: "It stored \"4\" faithfully.", c: "Nothing was counted twice.", d: "It does not." } }),
  ]),

  ...check("wd-l103-json-preferences", [
    q({ id: "wdq103-1", atom: "a-wd-json", d: 2, prompt: "What is stored by localStorage.setItem(\"s\", { size: 20 })?", options: ["The string \"[object Object]\"", "The object", "{\"size\":20}", "Nothing"], correct: "a",
      explanation: "Storage converts it to a string the useless way; use JSON.stringify.",
      wrong: { b: "Only strings are stored.", c: "Only with JSON.stringify.", d: "Something useless is stored." } }),
    q({ id: "wdq103-2", atom: "a-wd-json", d: 2, prompt: "Which turns JSON text back into an object?", options: ["JSON.parse(text)", "JSON.stringify(text)", "Object(text)", "text.toObject()"], correct: "a",
      explanation: "parse reads, stringify writes.",
      wrong: { b: "That makes text.", c: "Wraps the string.", d: "Not a method." } }),
    q({ id: "wdq103-3", atom: "a-wd-update-delete", d: 3, prompt: "How do you change one property of an object saved in storage?", options: ["Read and parse it, change the object, then stringify and save it again", "setItem(\"settings.fontSize\", 24)", "Edit the string with replace", "It cannot be changed"], correct: "a",
      explanation: "Storage holds a string; you replace it.",
      wrong: { b: "That saves a separate key.", c: "Fragile and error-prone.", d: "It can." } }),
    q({ id: "wdq103-4", atom: "a-wd-persist-preferences", d: 3, prompt: "Why load preferences as { ...DEFAULTS, ...saved }?", options: ["Any setting missing from older saved data still gets its default", "It is faster", "It deletes old settings", "It encrypts them"], correct: "a",
      explanation: "Saved values override defaults; new settings fall back.",
      wrong: { b: "Not about speed.", c: "It keeps them.", d: "No encryption." } }),
  ]),

  ...check("wd-l104-saving-data-limits", [
    q({ id: "wdq104-1", atom: "a-wd-saving-lists", d: 2, prompt: "When should a persisted task list be saved?", options: ["Every time the array changes", "Only when the tab closes", "Once a day", "Never"], correct: "a",
      explanation: "Closing events are unreliable; save on each change.",
      wrong: { b: "The browser may not let it finish.", c: "Changes would be lost.", d: "Then nothing persists." } }),
    q({ id: "wdq104-2", atom: "a-wd-storage-limits", d: 3, prompt: "Why wrap JSON.parse of stored data in try...catch?", options: ["Stored data may be corrupted or from an older version, and parse throws on invalid JSON", "parse is slow", "It makes the data smaller", "try is required for storage"], correct: "a",
      explanation: "Fall back to a safe default instead of crashing.",
      wrong: { b: "Not about speed.", c: "No effect on size.", d: "Not required, but wise." } }),
    q({ id: "wdq104-3", atom: "a-wd-storage-limits", d: 2, prompt: "Roughly how much can localStorage hold per site?", options: ["About 5MB", "Unlimited", "1KB", "1GB"], correct: "a",
      explanation: "Use IndexedDB for larger data.",
      wrong: { b: "It is limited.", c: "Much more than that.", d: "Far less." } }),
    q({ id: "wdq104-4", atom: "a-wd-no-secrets", d: 3, prompt: "Which may safely be kept in localStorage?", options: ["The visitor's chosen theme", "Their password", "A card number", "An API secret key"], correct: "a",
      explanation: "Anything a script on the page could read must not be secret.",
      wrong: { b: "Never.", c: "Never.", d: "Never in frontend code at all." } }),
  ]),
};
