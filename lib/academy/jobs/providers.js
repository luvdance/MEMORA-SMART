/**
 * JOB SOURCES
 *
 * Every provider normalises to one shape, so the matching engine and the UI
 * never know or care where a posting came from:
 *
 *   { id, title, company, companyLogo, location, remote, url,
 *     postedAt (ISO), salary, tags[], description, source }
 *
 * ── ON LINKEDIN ───────────────────────────────────────────────────────────
 * There is deliberately no LinkedIn provider here. LinkedIn's Jobs API is a
 * POSTING api for approved Talent Solutions partners (ATS vendors under a
 * signed agreement); it cannot query or export listings at all. The
 * "LinkedIn Jobs API" products sold on API marketplaces are scrapers: they
 * breach LinkedIn's User Agreement, break without warning, and would put
 * Memora Smart at legal risk. We do not ship one.
 *
 * In practice this costs less than it sounds. Most employers syndicate the
 * same posting to LinkedIn AND to the ATS feeds below, so the roles largely
 * overlap. Each card links to the employer's own application page, which is
 * a better destination than a LinkedIn mirror anyway.
 * ──────────────────────────────────────────────────────────────────────────
 *
 * FREE providers need no key and are always on.
 * KEYED providers switch on only when both JOBS_API_PROVIDER and JOBS_API_KEY
 * are set, so a missing key degrades to fewer sources rather than an error.
 */

const UA = "MemoraSmartAcademy/1.0 (+https://memorasmart.com)";

async function fetchJson(url, options = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12000);
  try {
    const res = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: { "User-Agent": UA, Accept: "application/json", ...options.headers },
    });
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
    return await res.json();
  } finally {
    clearTimeout(timeout);
  }
}

/** Strip HTML so descriptions can be scanned for skills and shown as text. */
function stripHtml(html = "") {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#\d+;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/* ── FREE: Remotive ─────────────────────────────────────────────────── */

export async function fetchRemotive(query = "data analyst") {
  const url = `https://remotive.com/api/remote-jobs?search=${encodeURIComponent(query)}&limit=60`;
  const data = await fetchJson(url);

  return (data.jobs || []).map((j) => ({
    id: `remotive-${j.id}`,
    title: j.title,
    company: j.company_name?.trim(),
    companyLogo: j.company_logo_url || j.company_logo || null,
    location: j.candidate_required_location || "Remote",
    remote: true,
    url: j.url,
    postedAt: j.publication_date ? new Date(j.publication_date).toISOString() : null,
    salary: j.salary || null,
    tags: j.tags || [],
    description: stripHtml(j.description).slice(0, 1500),
    source: "Remotive",
  }));
}

/* ── FREE: RemoteOK ─────────────────────────────────────────────────── */

export async function fetchRemoteOk() {
  const data = await fetchJson("https://remoteok.com/api");

  // The first element is a legal notice, not a job
  return (Array.isArray(data) ? data.slice(1) : [])
    .filter((j) => j.position && j.url)
    .map((j) => ({
      id: `remoteok-${j.id}`,
      title: j.position,
      company: j.company,
      companyLogo: j.company_logo || j.logo || null,
      location: j.location || "Remote",
      remote: true,
      url: j.apply_url || j.url,
      postedAt: j.date ? new Date(j.date).toISOString() : null,
      salary:
        j.salary_min && j.salary_max
          ? `$${Math.round(j.salary_min / 1000)}k–$${Math.round(j.salary_max / 1000)}k`
          : null,
      tags: j.tags || [],
      description: stripHtml(j.description).slice(0, 1500),
      source: "RemoteOK",
    }));
}

/* ── FREE: Arbeitnow (ATS feeds, mostly EU) ─────────────────────────── */

export async function fetchArbeitnow() {
  const data = await fetchJson("https://www.arbeitnow.com/api/job-board-api");

  return (data.data || []).map((j) => ({
    id: `arbeitnow-${j.slug}`,
    title: j.title,
    company: j.company_name,
    companyLogo: null,
    location: j.location || "Not stated",
    remote: Boolean(j.remote),
    url: j.url,
    postedAt: j.created_at ? new Date(j.created_at * 1000).toISOString() : null,
    salary: null,
    tags: j.tags || [],
    description: stripHtml(j.description).slice(0, 1500),
    source: "Arbeitnow",
  }));
}

/* ── KEYED providers ────────────────────────────────────────────────── */

/**
 * Jooble. POST-only, key in the path. Covers Nigeria via ng.jooble.org.
 * Note the free plan is 500 requests for the LIFETIME of the key, which is
 * why the endpoint caches aggressively and never calls this per page view.
 */
export async function fetchJooble(key, { query = "data analyst", location = "Nigeria" } = {}) {
  const host = process.env.JOBS_API_HOST || "jooble.org";
  const data = await fetchJson(`https://${host}/api/${key}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ keywords: query, location, ResultOnPage: 40 }),
  });

  return (data.jobs || []).map((j, i) => ({
    id: `jooble-${j.id || i}`,
    title: j.title,
    company: j.company,
    companyLogo: null,
    location: j.location,
    remote: /remote/i.test(`${j.title} ${j.location}`),
    url: j.link,
    postedAt: j.updated ? new Date(j.updated).toISOString() : null,
    salary: j.salary || null,
    tags: [],
    description: stripHtml(j.snippet).slice(0, 1500),
    source: "Jooble",
  }));
}

/** Adzuna. Needs an app id alongside the key. No Nigeria coverage. */
export async function fetchAdzuna(key, { query = "data analyst", country = "gb" } = {}) {
  const appId = process.env.JOBS_API_APP_ID;
  if (!appId) throw new Error("Adzuna also needs JOBS_API_APP_ID");

  const url =
    `https://api.adzuna.com/v1/api/jobs/${country}/search/1` +
    `?app_id=${encodeURIComponent(appId)}&app_key=${encodeURIComponent(key)}` +
    `&results_per_page=40&what=${encodeURIComponent(query)}&content-type=application/json`;

  const data = await fetchJson(url);

  return (data.results || []).map((j) => ({
    id: `adzuna-${j.id}`,
    title: j.title,
    company: j.company?.display_name,
    companyLogo: null,
    location: j.location?.display_name,
    remote: /remote/i.test(`${j.title} ${j.location?.display_name || ""}`),
    url: j.redirect_url,
    postedAt: j.created || null,
    salary:
      j.salary_min && j.salary_max
        ? `${Math.round(j.salary_min / 1000)}k–${Math.round(j.salary_max / 1000)}k`
        : null,
    tags: [j.category?.label].filter(Boolean),
    description: stripHtml(j.description).slice(0, 1500),
    source: "Adzuna",
  }));
}

/** JSearch on RapidAPI. Aggregates Google for Jobs, so coverage is broad. */
export async function fetchJSearch(key, { query = "data analyst", country = "ng" } = {}) {
  const url =
    `https://jsearch.p.rapidapi.com/search` +
    `?query=${encodeURIComponent(query)}&page=1&num_pages=1&country=${country}`;

  const data = await fetchJson(url, {
    headers: {
      "X-RapidAPI-Key": key,
      "X-RapidAPI-Host": "jsearch.p.rapidapi.com",
    },
  });

  return (data.data || []).map((j) => ({
    id: `jsearch-${j.job_id}`,
    title: j.job_title,
    company: j.employer_name,
    companyLogo: j.employer_logo || null,
    location:
      [j.job_city, j.job_country].filter(Boolean).join(", ") || "Not stated",
    remote: Boolean(j.job_is_remote),
    url: j.job_apply_link,
    postedAt: j.job_posted_at_datetime_utc || null,
    salary:
      j.job_min_salary && j.job_max_salary
        ? `${j.job_salary_currency || ""}${Math.round(j.job_min_salary / 1000)}k–${Math.round(j.job_max_salary / 1000)}k`
        : null,
    tags: j.job_required_skills || [],
    description: stripHtml(j.job_description).slice(0, 1500),
    source: "JSearch",
  }));
}

const KEYED = {
  jooble: fetchJooble,
  adzuna: fetchAdzuna,
  jsearch: fetchJSearch,
};

/**
 * Pull from every source that is currently usable.
 *
 * A provider that fails does not fail the request. One dead feed must never
 * take the jobs page down, so errors are collected and reported alongside
 * whatever did come back.
 */
export async function fetchAllJobs({ query = "data analyst", location } = {}) {
  const tasks = [
    { name: "Remotive", run: () => fetchRemotive(query) },
    { name: "RemoteOK", run: () => fetchRemoteOk() },
    { name: "Arbeitnow", run: () => fetchArbeitnow() },
  ];

  const provider = (process.env.JOBS_API_PROVIDER || "").toLowerCase();
  const key = process.env.JOBS_API_KEY;

  if (key && KEYED[provider]) {
    tasks.push({
      name: provider,
      run: () => KEYED[provider](key, { query, location }),
    });
  }

  const settled = await Promise.allSettled(tasks.map((t) => t.run()));

  const jobs = [];
  const sources = [];
  const errors = [];

  settled.forEach((result, i) => {
    const name = tasks[i].name;
    if (result.status === "fulfilled") {
      jobs.push(...result.value);
      sources.push({ name, count: result.value.length });
    } else {
      errors.push({ name, error: result.reason?.message || String(result.reason) });
    }
  });

  // De-duplicate: the same role is often syndicated to several boards
  const seen = new Set();
  const unique = jobs.filter((job) => {
    const fingerprint = `${(job.title || "").toLowerCase().trim()}|${(job.company || "").toLowerCase().trim()}`;
    if (seen.has(fingerprint)) return false;
    seen.add(fingerprint);
    return true;
  });

  return {
    jobs: unique,
    sources,
    errors,
    keyedProvider: key && KEYED[provider] ? provider : null,
    // Surfaced in the API response so the page can be honest about coverage
    keyConfigured: Boolean(key),
  };
}
