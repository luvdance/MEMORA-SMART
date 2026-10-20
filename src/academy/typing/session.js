import { advanceStreak, localDateKey } from "../data/gamification.js";
import { earnedAchievements } from "./achievements.js";
import { isVerifiedRun, mergeKeyStats, typingLevel, xpForRun } from "./engine.js";

/**
 * The typing profile and how a finished run changes it. Pure — no storage,
 * no Firebase — so the self-test can exercise exactly what the app runs.
 */

const VERSION = 1;
const HISTORY_MAX = 80;

export function emptyProfile() {
  return {
    version: VERSION,
    xp: 0,
    lessons: {},
    bests: { test15: 0, test30: 0, test60: 0, test120: 0, rainScore: 0, rainWave: 0, combo: 0, raceWpm: 0 },
    bestVerifiedWpm: 0,
    bestVerifiedAcc: 0,
    keyStats: {},
    history: [],
    achievements: [],
    streak: { current: 0, longest: 0, lastActiveDate: null, freezes: 0 },
    totalKeys: 0,
    totalMs: 0,
    sessions: 0,
    flawlessRuns: 0,
    raceWins: 0,
    eliteWins: 0,
    updatedAt: 0,
  };
}

export function normalise(p) {
  const base = emptyProfile();
  if (!p || typeof p !== "object") return base;
  return { ...base, ...p, bests: { ...base.bests, ...(p.bests || {}) }, streak: { ...base.streak, ...(p.streak || {}) } };
}

/**
 * Fold a finished run into the profile.
 *
 * @param profile   current profile (not mutated)
 * @param session   { mode, stats, keys, lessonId?, stars?, bonusXp?, extra? }
 * @returns { profile, xp, levelUp, newAchievements, newBest }
 */
export function recordSession(profile, session) {
  const { mode, stats, keys = {}, lessonId, stars = 0, bonusXp = 0, extra = {} } = session;
  const p = normalise(JSON.parse(JSON.stringify(profile)));
  const beforeLevel = typingLevel(p.xp).level;
  const beforeAch = new Set(p.achievements);
  let newBest = false;

  // Lesson record — keep the best of each measure, and pay new stars only once.
  let starBonus = 0;
  if (lessonId) {
    const prev = p.lessons[lessonId] || { stars: 0, bestWpm: 0, bestAcc: 0, attempts: 0 };
    starBonus = Math.max(0, stars - prev.stars) * 25;
    p.lessons[lessonId] = {
      stars: Math.max(prev.stars, stars),
      bestWpm: Math.max(prev.bestWpm, stats.wpm),
      bestAcc: Math.max(prev.bestAcc, stats.accuracy),
      attempts: prev.attempts + 1,
    };
  }

  // Speed tests
  if (mode.startsWith("test")) {
    const key = mode; // test15 | test30 | test60 | test120
    if (stats.accuracy >= 90 && stats.wpm > (p.bests[key] || 0)) {
      p.bests[key] = stats.wpm;
      newBest = true;
    }
  }
  if (isVerifiedRun(stats) && stats.wpm > p.bestVerifiedWpm) {
    p.bestVerifiedWpm = stats.wpm;
    p.bestVerifiedAcc = stats.accuracy;
    newBest = true;
  }

  if (stats.bestCombo > p.bests.combo) p.bests.combo = stats.bestCombo;
  if (stats.accuracy === 100 && stats.correctChars >= 150) p.flawlessRuns++;

  if (extra.rainScore > p.bests.rainScore) {
    p.bests.rainScore = extra.rainScore;
    newBest = true;
  }
  if (extra.rainWave > p.bests.rainWave) p.bests.rainWave = extra.rainWave;
  if (extra.raceWon) p.raceWins++;
  if (extra.raceWon && extra.league === "elite") p.eliteWins++;
  if (mode === "race" && stats.wpm > p.bests.raceWpm && stats.accuracy >= 90) p.bests.raceWpm = stats.wpm;

  p.keyStats = mergeKeyStats(p.keyStats, keys || {});
  p.totalKeys += stats.correctChars;
  p.totalMs += Math.round(stats.ms);
  p.sessions++;
  p.streak = advanceStreak(p.streak, localDateKey());
  delete p.streak.usedFreeze;

  p.history = [
    ...p.history,
    { at: Date.now(), mode, wpm: stats.wpm, acc: stats.accuracy, ms: Math.round(stats.ms) },
  ].slice(-HISTORY_MAX);

  const xp = xpForRun(stats, bonusXp + starBonus);
  p.xp += xp;

  p.achievements = earnedAchievements(p);
  const newAchievements = p.achievements.filter((a) => !beforeAch.has(a));
  // Each new achievement is worth a little, once.
  if (newAchievements.length) p.xp += newAchievements.length * 30;

  p.updatedAt = Date.now();
  const levelUp = typingLevel(p.xp).level > beforeLevel ? typingLevel(p.xp) : null;

  return { profile: p, xp: xp + newAchievements.length * 30, levelUp, newAchievements, newBest };
}
