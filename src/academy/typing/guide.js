/**
 * The learner's keyboard-guidance preference.
 *   auto   follow the lesson (guidance fades as the path goes on)
 *   full | hint | blind   force one level everywhere
 */

export const GUIDE_KEY = "ac-typing-guide";

export function readGuidePref() {
  try {
    return localStorage.getItem(GUIDE_KEY) || "auto";
  } catch {
    return "auto";
  }
}

export function saveGuidePref(guide) {
  try {
    localStorage.setItem(GUIDE_KEY, guide);
  } catch {
    /* applies for this visit */
  }
}

export function resolveGuide(pref, lessonGuide) {
  return pref === "auto" ? lessonGuide : pref;
}
