/** Small display helpers. Kept apart from Bits.jsx, which exports only components. */
import { SKILLS } from "./data/skills";

export function ago(value) {
  const time = typeof value === "number" ? value : new Date(value).getTime();
  if (!time) return "";
  const minutes = Math.floor((Date.now() - time) / 60000);
  if (minutes < 2) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

export const naira = (n) => `₦${Number(n).toLocaleString("en-NG")}`;

export const longDate = (value) =>
  new Date(value).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

export function payLine(pay) {
  if (!pay?.text) return null;
  const { naira: ngn } = pay;
  if (!ngn?.min) return pay.text;
  const range = ngn.max && ngn.max !== ngn.min ? `${naira(ngn.min)}–${naira(ngn.max)}` : naira(ngn.min);
  return `${pay.text} (about ${range} a month)`;
}

export const isFuture = (time) => Boolean(time) && time > Date.now();

/** Seen for the first time within the last day. */
export const isNew = (firstSeen) => Boolean(firstSeen) && Date.now() - firstSeen < 86400000;

/** Where this skill can be learned, when an open course really teaches it. */
export const courseLink = (id) => (SKILLS[id]?.course ? `/academy/enroll/${SKILLS[id].course}` : null);
