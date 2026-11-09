/**
 * ACADEMY THEME — light, dark, or follow the device.
 *
 * The choice is a per-device convenience, so it lives in localStorage (never
 * Firestore: no read on page load, and a phone and a laptop can differ). The
 * default is "system", which tracks the OS setting live.
 *
 * The resolved theme is written to <html data-ac-theme>, and the Academy CSS
 * keys off that attribute. index.html runs the same resolution inline before
 * the first paint so a dark-mode learner never sees a white flash; this module
 * takes over once React is running. Outside the Academy the attribute is
 * inert, because every dark rule is scoped to `.academy`.
 */
import { useSyncExternalStore } from "react";

const KEY = "ac-theme";
const CHOICES = ["light", "dark", "system"];
const listeners = new Set();
const media =
  typeof window !== "undefined" && window.matchMedia
    ? window.matchMedia("(prefers-color-scheme: dark)")
    : null;

function readChoice() {
  try {
    const v = localStorage.getItem(KEY);
    return CHOICES.includes(v) ? v : "system";
  } catch {
    return "system"; // private mode or blocked storage
  }
}

let choice = readChoice();

const resolve = (c) => (c === "system" ? (media?.matches ? "dark" : "light") : c);

let snapshot = { choice, theme: resolve(choice) };

function apply() {
  snapshot = { choice, theme: resolve(choice) };
  if (typeof document !== "undefined") {
    document.documentElement.dataset.acTheme = snapshot.theme;
  }
  listeners.forEach((fn) => fn());
}

media?.addEventListener?.("change", () => {
  if (choice === "system") apply();
});

// Another tab changed the setting: follow it.
if (typeof window !== "undefined") {
  window.addEventListener("storage", (e) => {
    if (e.key !== KEY) return;
    choice = readChoice();
    apply();
  });
}

apply();
// index.html painted the page dark while the Academy loaded; its stylesheet
// is here now (this module ships with the Academy's pages), so hand over.
if (typeof document !== "undefined") document.documentElement.classList.remove("ac-preboot");

/**
 * Change the theme. `origin` (a DOM element, usually the button pressed) is
 * where the new theme grows from, as an expanding circle, when the browser
 * supports view transitions and the learner has not asked for reduced motion.
 */
export function setAcademyTheme(next, origin) {
  if (!CHOICES.includes(next)) return;
  const before = snapshot.theme;
  const commit = () => {
    choice = next;
    try {
      localStorage.setItem(KEY, next);
    } catch {
      /* the choice still applies for this visit */
    }
    apply();
  };

  const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  if (resolve(next) === before || !document.startViewTransition || reduced) {
    commit();
    return;
  }

  const root = document.documentElement;
  const rect = origin?.getBoundingClientRect?.();
  const x = rect ? rect.left + rect.width / 2 : window.innerWidth / 2;
  const y = rect ? rect.top + rect.height / 2 : 0;
  // Radius that reaches the farthest corner from the origin.
  const r = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
  root.style.setProperty("--ac-tx", `${x}px`);
  root.style.setProperty("--ac-ty", `${y}px`);
  root.style.setProperty("--ac-tr", `${r}px`);
  root.classList.add("ac-theme-switching");
  const t = document.startViewTransition(commit);
  t.finished.finally(() => root.classList.remove("ac-theme-switching"));
}

const subscribe = (fn) => {
  listeners.add(fn);
  return () => listeners.delete(fn);
};

/** { choice: "light"|"dark"|"system", theme: "light"|"dark", setTheme } */
export function useAcademyTheme() {
  const snap = useSyncExternalStore(subscribe, () => snapshot, () => snapshot);
  return { ...snap, setTheme: setAcademyTheme };
}
