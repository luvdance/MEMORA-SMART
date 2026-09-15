import { fetchAllJobs } from "./providers.js";
import { buildLearnerProfile, rankJobs } from "./skills.js";

/**
 * JOB RECOMMENDATION SERVICE
 *
 * Caching is not an optimisation here, it is a requirement. Jooble's free plan
 * allows 500 requests for the LIFETIME of the key, so calling a provider once
 * per page view would exhaust it in an afternoon. Everything is fetched on a
 * timer and served from memory.
 *
 * The cache lives in module scope, so it survives warm serverless invocations
 * and the whole dev session. A cold start simply refetches.
 */

const TTL_MS = 30 * 60 * 1000; // 30 minutes
const cache = new Map();

async function getPool(query) {
  const key = query.toLowerCase();
  const hit = cache.get(key);

  if (hit && Date.now() - hit.at < TTL_MS) {
    return { ...hit.payload, cached: true, ageMinutes: Math.round((Date.now() - hit.at) / 60000) };
  }

  const payload = await fetchAllJobs({ query });
  cache.set(key, { at: Date.now(), payload });
  return { ...payload, cached: false, ageMinutes: 0 };
}

/**
 * Recommend jobs for one learner.
 *
 * @param {object} progress
 *   completedModuleIds  modules whose assessments were passed
 *   inProgressModuleIds modules started but not passed
 *   level               Academy level, drives the seniority ceiling
 */
export async function recommendJobs(progress = {}, { query = "data analyst", limit = 24 } = {}) {
  const profile = buildLearnerProfile(progress);
  const pool = await getPool(query);
  const jobs = rankJobs(pool.jobs, profile, limit);

  return {
    jobs,
    profile: {
      proved: profile.proved,
      learning: profile.learning,
      seniority: profile.seniority,
    },
    meta: {
      scanned: pool.jobs.length,
      matched: jobs.length,
      sources: pool.sources,
      errors: pool.errors,
      cached: pool.cached,
      ageMinutes: pool.ageMinutes,
      keyConfigured: pool.keyConfigured,
      keyedProvider: pool.keyedProvider,
    },
  };
}
