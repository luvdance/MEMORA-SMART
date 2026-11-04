// ── SUPPORT (browser side) ──
// Calls /api/support/* (lib/support/handlers.js) and lets any page open the
// support dialog with openSupport(), without importing the dialog itself.
import { auth } from "../firebase";

const OPEN_EVENT = "memora:open-support";

/** Open the support dialog from anywhere. `opts`: { app, subject, view: "new"|"inbox" } */
export function openSupport(opts = {}) {
  window.dispatchEvent(new CustomEvent(OPEN_EVENT, { detail: opts }));
}

export function onOpenSupport(handler) {
  const listener = (e) => handler(e.detail || {});
  window.addEventListener(OPEN_EVENT, listener);
  return () => window.removeEventListener(OPEN_EVENT, listener);
}

/** GET when `payload` is omitted. Returns the JSON body; throws with the server's message. */
export async function supportApi(action, payload) {
  const headers = payload ? { "Content-Type": "application/json" } : {};
  const user = auth.currentUser;
  if (user) headers.Authorization = `Bearer ${await user.getIdToken()}`;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 20000);
  try {
    const res = await fetch(`/api/support/${action}`, {
      method: payload ? "POST" : "GET",
      headers,
      body: payload ? JSON.stringify(payload) : undefined,
      signal: controller.signal,
    });
    const data = await res.json().catch(() => ({ success: false, error: `Server returned ${res.status}` }));
    if (!res.ok || data.success === false) throw new Error(data.error || "Something went wrong. Please try again.");
    return data;
  } catch (err) {
    if (err.name === "AbortError") throw new Error("The connection timed out. Please try again.");
    throw err;
  } finally {
    clearTimeout(timer);
  }
}

/** Which product a path belongs to, so the inbox shows where a message came from. */
export function appForPath(path) {
  if (/^\/(cv-builder|cv\/|dashboard\/cv-builder|dashboard\/my-works|ats-check)/.test(path)) return "cv-builder";
  if (path.startsWith("/academy")) return "academy";
  if (path.startsWith("/memotify")) return "memotify";
  if (/^\/(projectpilot|dashboard\/project-formatter)/.test(path)) return "projectpilot";
  if (path.startsWith("/library")) return "library";
  if (path.startsWith("/dashboard")) return "dashboard";
  return "site";
}

export const APP_NAMES = {
  "cv-builder": "CV Builder",
  academy: "Academy",
  memotify: "Memotify",
  projectpilot: "ProjectPilot",
  library: "Library",
  dashboard: "Dashboard",
  site: "Website",
};

export const CATEGORIES = [
  { id: "question", label: "A question" },
  { id: "problem", label: "Something isn't working" },
  { id: "billing", label: "Payments or plan" },
  { id: "request", label: "A request or suggestion" },
  { id: "other", label: "Something else" },
];

export function timeAgo(ms) {
  const s = Math.max(0, (Date.now() - ms) / 1000);
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  if (s < 604800) return `${Math.floor(s / 86400)}d ago`;
  return new Date(ms).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });
}
