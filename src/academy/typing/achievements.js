import { LESSONS, STAGES } from "./curriculum.js";

/**
 * TYPING ACHIEVEMENTS
 *
 * Same rule as the Academy badges: each one is a real milestone. Speed
 * badges only count VERIFIED runs (60s+, 95%+ accuracy), so a lucky
 * ten-second burst cannot claim a speed nobody can repeat.
 */

const stageDone = (p, id) =>
  STAGES.find((s) => s.id === id).lessons.every((l) => (p.lessons?.[l.id]?.stars || 0) >= 1);

export const ACHIEVEMENTS = [
  { id: "first-keys", name: "First Keys", icon: "fas fa-keyboard", desc: "Finished your first lesson.", check: (p) => Object.keys(p.lessons || {}).length >= 1 },
  { id: "home-row", name: "Home Row Hero", icon: "fas fa-house", desc: "Passed every Home Row lesson.", check: (p) => stageDone(p, "home") },
  { id: "alphabet", name: "Alphabet Master", icon: "fas fa-font", desc: "Know every letter — finished the Bottom Row.", check: (p) => stageDone(p, "bottom") },
  { id: "shift", name: "Shift Shifter", icon: "fas fa-up-long", desc: "Mastered capitals with opposite-hand Shift.", check: (p) => stageDone(p, "shift") },
  { id: "numbers", name: "Number Cruncher", icon: "fas fa-hashtag", desc: "Finished the Number Row.", check: (p) => stageDone(p, "numbers") },
  { id: "symbols", name: "Symbol Slayer", icon: "fas fa-at", desc: "Finished the Symbols stage.", check: (p) => stageDone(p, "symbols") },
  { id: "coder", name: "Code Typist", icon: "fas fa-code", desc: "Finished every Code lesson.", check: (p) => stageDone(p, "code") },
  { id: "graduate", name: "Touch Typing Graduate", icon: "fas fa-graduation-cap", desc: "Passed every lesson on the path.", check: (p) => LESSONS.every((l) => (p.lessons?.[l.id]?.stars || 0) >= 1) },
  { id: "three-stars", name: "Perfectionist", icon: "fas fa-star", desc: "Earned three stars on a lesson.", check: (p) => Object.values(p.lessons || {}).some((l) => l.stars >= 3) },
  { id: "all-stars", name: "Constellation", icon: "fas fa-meteor", desc: "Three stars on every lesson.", check: (p) => LESSONS.every((l) => (p.lessons?.[l.id]?.stars || 0) >= 3) },
  { id: "flawless", name: "Flawless", icon: "fas fa-bullseye", desc: "100% accuracy on a run of 150+ characters.", check: (p) => (p.flawlessRuns || 0) >= 1 },
  { id: "wpm-30", name: "30 WPM", icon: "fas fa-gauge", desc: "Verified 30 WPM (60s+ test, 95%+ accuracy).", check: (p) => (p.bestVerifiedWpm || 0) >= 30 },
  { id: "wpm-40", name: "Job Ready", icon: "fas fa-briefcase", desc: "Verified 40 WPM — the typical office requirement.", check: (p) => (p.bestVerifiedWpm || 0) >= 40 },
  { id: "wpm-60", name: "60 WPM", icon: "fas fa-gauge-high", desc: "Verified 60 WPM.", check: (p) => (p.bestVerifiedWpm || 0) >= 60 },
  { id: "wpm-80", name: "80 WPM", icon: "fas fa-bolt", desc: "Verified 80 WPM.", check: (p) => (p.bestVerifiedWpm || 0) >= 80 },
  { id: "wpm-100", name: "Century", icon: "fas fa-rocket", desc: "Verified 100 WPM.", check: (p) => (p.bestVerifiedWpm || 0) >= 100 },
  { id: "keys-10k", name: "10,000 Keys", icon: "fas fa-hand", desc: "Typed ten thousand correct keystrokes.", check: (p) => (p.totalKeys || 0) >= 10000 },
  { id: "keys-100k", name: "100,000 Keys", icon: "fas fa-hands", desc: "A hundred thousand correct keystrokes.", check: (p) => (p.totalKeys || 0) >= 100000 },
  { id: "streak-3", name: "Three-Day Habit", icon: "fas fa-fire", desc: "Practised three days in a row.", check: (p) => (p.streak?.longest || 0) >= 3 },
  { id: "streak-7", name: "Week of Keys", icon: "fas fa-fire-flame-curved", desc: "Practised seven days in a row.", check: (p) => (p.streak?.longest || 0) >= 7 },
  { id: "rain-5", name: "Storm Chaser", icon: "fas fa-cloud-showers-heavy", desc: "Reached wave 5 in Word Rain.", check: (p) => (p.bests?.rainWave || 0) >= 5 },
  { id: "rain-10", name: "Eye of the Storm", icon: "fas fa-tornado", desc: "Reached wave 10 in Word Rain.", check: (p) => (p.bests?.rainWave || 0) >= 10 },
  { id: "combo-50", name: "Combo 50", icon: "fas fa-link", desc: "50 correct keys in a row.", check: (p) => (p.bests?.combo || 0) >= 50 },
  { id: "combo-200", name: "Unbroken", icon: "fas fa-infinity", desc: "200 correct keys in a row.", check: (p) => (p.bests?.combo || 0) >= 200 },
  { id: "race-win", name: "Podium Top", icon: "fas fa-trophy", desc: "Won a race against the bots.", check: (p) => (p.raceWins || 0) >= 1 },
  { id: "race-elite", name: "Elite Racer", icon: "fas fa-flag-checkered", desc: "Won a race in the Elite league.", check: (p) => (p.eliteWins || 0) >= 1 },
];

export function earnedAchievements(profile) {
  return ACHIEVEMENTS.filter((a) => {
    try {
      return a.check(profile);
    } catch {
      return false;
    }
  }).map((a) => a.id);
}
