/**
 * MEMOTIFY JOB SOURCES
 *
 * Two kinds of feed, on purpose.
 *
 * EMPLOYER BOARDS are the backbone: the public Greenhouse, Lever, Ashby,
 * Workable and SmartRecruiters boards of named companies. A posting there is
 * the employer's own record, so when it closes it disappears from the feed.
 * That is how Memotify can say "live on the employer's site" and mean it. The
 * list below was checked against each board on 2026-10-30 (right company,
 * real roles reachable from Nigeria). Slugs like "access" and "lumos" that
 * belong to unrelated companies were left out.
 *
 * REMOTE BOARDS add breadth, but skew heavily to US-only roles, so everything
 * they send goes through the reach check in screen.js. Remotive and RemoteOK
 * come from the Academy's providers, as do the optional keyed sources (Jooble,
 * JSearch, Adzuna: set JOBS_API_PROVIDER and JOBS_API_KEY to add one).
 *
 * No LinkedIn or Indeed, for the reason in lib/academy/jobs/providers.js.
 *
 * Raw shape, consumed by feed.js:
 *   { id, title, company, location, countries?, remote, url, postedAt (ISO),
 *     description, tags[], source, direct, salary?, feedTrustsRemote? }
 */

import {
  fetchRemotive,
  fetchRemoteOk,
  fetchJooble,
  fetchAdzuna,
  fetchJSearch,
} from "../academy/jobs/providers.js";

const UA = "Memotify/1.0 (+https://memorasmart.com/memotify)";
const MAX_TEXT = 6000;

async function fetchJson(url, options = {}) {
  const res = await fetch(url, {
    ...options,
    signal: AbortSignal.timeout(14000),
    headers: { "User-Agent": UA, Accept: "application/json", ...options.headers },
  });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json();
}

const ENTITIES = { nbsp: " ", amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", rsquo: "’", lsquo: "‘", ldquo: "“", rdquo: "”", ndash: "–", mdash: "—", hellip: "…", bull: "•" };

function decodeEntities(text) {
  return text
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&([a-z]+);/gi, (m, name) => ENTITIES[name.toLowerCase()] ?? m);
}

/**
 * Feed HTML to plain text that keeps its paragraphs and bullets. Descriptions
 * are stored and rendered as text: third-party markup never reaches the page.
 * Runs twice because Greenhouse double-encodes its HTML.
 */
export function toText(html = "") {
  const once = decodeEntities(String(html));
  return decodeEntities(
    once
      .replace(/<\s*(script|style)[^>]*>[\s\S]*?<\/\s*\1\s*>/gi, " ")
      .replace(/<\s*li[^>]*>/gi, "\n• ")
      .replace(/<\s*(br|\/p|\/div|\/h[1-6]|\/ul|\/ol|\/li)[^>]*>/gi, "\n")
      .replace(/<[^>]*>/g, " ")
  )
    .replace(/[ \t\u00a0]+/g, " ")
    .replace(/ ?\n ?/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
    .slice(0, MAX_TEXT);
}

const iso = (value) => {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
};

/* ── Employer boards ─────────────────────────────────────────────────── */

async function greenhouse(slug, company) {
  const data = await fetchJson(`https://boards-api.greenhouse.io/v1/boards/${slug}/jobs?content=true`);
  return (data.jobs || []).map((j) => ({
    id: `gh-${slug}-${j.id}`,
    title: j.title,
    company,
    location: j.location?.name || "",
    url: j.absolute_url,
    postedAt: iso(j.first_published || j.updated_at),
    description: toText(j.content),
    tags: (j.departments || []).map((d) => d.name),
    source: company,
    direct: true,
  }));
}

async function lever(slug, company) {
  const data = await fetchJson(`https://api.lever.co/v0/postings/${slug}?mode=json`);
  return (data || []).map((j) => ({
    id: `lv-${slug}-${j.id}`,
    title: j.text,
    company,
    location: (j.categories?.allLocations || [j.categories?.location]).filter(Boolean).join("; "),
    remote: j.workplaceType === "remote",
    url: j.hostedUrl,
    postedAt: iso(j.createdAt),
    description: toText(`${j.descriptionPlain || ""}\n${(j.lists || []).map((l) => `${l.text}\n${l.content}`).join("\n")}`),
    tags: [j.categories?.department, j.categories?.team].filter(Boolean),
    salary: j.salaryRange
      ? { min: j.salaryRange.min, max: j.salaryRange.max, currency: j.salaryRange.currency, period: j.salaryRange.interval === "per-year-salary" ? "year" : "month" }
      : null,
    source: company,
    direct: true,
  }));
}

function ashbyPay(job) {
  const pay = job.compensation?.summaryComponents?.find((c) => c.compensationType === "Salary");
  if (!pay?.minValue) return null;
  return {
    min: pay.minValue,
    max: pay.maxValue,
    currency: pay.currencyCode,
    period: /year/i.test(pay.interval || "") ? "year" : "month",
  };
}

async function ashby(slug, company) {
  const data = await fetchJson(`https://api.ashbyhq.com/posting-api/job-board/${slug}?includeCompensation=true`);
  return (data.jobs || [])
    .filter((j) => j.isListed !== false)
    .map((j) => ({
      id: `ab-${slug}-${j.id}`,
      title: j.title,
      company,
      location: [j.location, ...(j.secondaryLocations || []).map((l) => l.location)].filter(Boolean).join("; "),
      remote: Boolean(j.isRemote) || j.workplaceType === "Remote",
      url: j.jobUrl,
      postedAt: iso(j.publishedAt),
      description: toText(j.descriptionHtml || j.descriptionPlain),
      tags: [j.department, j.team].filter(Boolean),
      salary: ashbyPay(j),
      source: company,
      direct: true,
    }));
}

async function workable(slug, company) {
  const data = await fetchJson(`https://apply.workable.com/api/v1/widget/accounts/${slug}?details=true`);
  return (data.jobs || []).map((j) => ({
    id: `wk-${slug}-${j.shortcode}`,
    title: j.title,
    company,
    location: [j.city, j.state, j.country].filter(Boolean).join(", "),
    remote: Boolean(j.telecommuting),
    url: j.url,
    postedAt: iso(j.published_on || j.created_at),
    description: toText(j.description),
    tags: [j.department, j.function].filter(Boolean),
    source: company,
    direct: true,
  }));
}

async function smartRecruiters(slug, company) {
  const data = await fetchJson(`https://api.smartrecruiters.com/v1/companies/${slug}/postings?limit=100`);
  const open = (data.content || []).filter((j) => /^ng$/i.test(j.location?.country || "") || j.location?.remote);
  const details = await Promise.all(open.map((j) => fetchJson(j.ref).catch(() => null)));
  return details.filter((j) => j?.active !== false && j?.postingUrl).map((j) => ({
    id: `sr-${slug}-${j.id}`,
    title: j.name,
    company,
    location: j.location?.fullLocation || "",
    remote: Boolean(j.location?.remote),
    url: j.postingUrl,
    postedAt: iso(j.releasedDate),
    description: toText(
      Object.values(j.jobAd?.sections || {}).map((s) => s?.text || "").join("\n")
    ),
    tags: [j.function?.label, j.department?.label].filter(Boolean),
    source: company,
    direct: true,
  }));
}

/**
 * Add an employer here. A dead slug costs one error line, never the feed.
 * remoteMeansGlobal: only for a company whose careers page confirms that a bare
 * "Remote" has no country limit. Everyone else's "Remote" is treated as unclear.
 */
export const EMPLOYER_BOARDS = [
  // Hiring in Nigeria
  ["Moniepoint", greenhouse, "moniepoint"],
  ["Jumia", greenhouse, "jumia"],
  ["Kuda", workable, "kuda"],
  ["FairMoney", workable, "fairmoney"],
  ["Renmoney", workable, "renmoney"],
  ["Helium Health", workable, "helium-health"],
  ["M-KOPA", ashby, "m-kopa"],
  ["Vendease", smartRecruiters, "vendease"],
  ["PalmPay", smartRecruiters, "palmpay"],
  // Remote employers that hire across borders
  ["Canonical", greenhouse, "canonical"],
  ["GitLab", greenhouse, "gitlab"],
  ["Consensys", greenhouse, "consensys"],
  ["OKX", greenhouse, "okx"],
  ["Supabase", ashby, "supabase", { remoteMeansGlobal: true }],
  ["PostHog", ashby, "posthog", { remoteMeansGlobal: true }],
  ["Oyster", ashby, "oyster"],
  ["Circle", ashby, "circle"],
  ["Toptal", lever, "toptal"],
  ["Appen", lever, "appen"],
];

/* ── Remote boards ───────────────────────────────────────────────────── */

async function himalayas() {
  // country=Nigeria returns the roles that accept Nigerian residents, which
  // is the filter the plain feed lacks. Results come back 20 to a page.
  const pages = await Promise.allSettled(
    [1, 2, 3].map((page) => fetchJson(`https://himalayas.app/jobs/api/search?country=Nigeria&page=${page}&limit=20`))
  );
  const jobs = pages.flatMap((p) => (p.status === "fulfilled" ? p.value.jobs || [] : []));
  return jobs.map((j) => {
    const countries = j.locationRestrictions || [];
    return {
      id: `hm-${String(j.guid).split("/").filter(Boolean).pop()}`,
      title: j.title,
      company: j.companyName,
      // No list doesn't mean no limit: US state agencies arrive with an empty
      // one. Left blank so that the reach check wants the body to confirm it.
      location: countries.length ? countries.join(", ") : "",
      countries,
      remote: true,
      url: j.applicationLink,
      postedAt: iso((j.pubDate || 0) * 1000),
      description: toText(j.description || j.excerpt),
      tags: j.categories || [],
      salary: j.minSalary
        ? { min: j.minSalary, max: j.maxSalary, currency: j.currency, period: /month/i.test(j.salaryPeriod || "") ? "month" : "year" }
        : null,
      source: "Himalayas",
      direct: false,
    };
  });
}

async function jobicy() {
  const data = await fetchJson("https://jobicy.com/api/v2/remote-jobs?count=50&geo=anywhere");
  return (data.jobs || []).map((j) => ({
    id: `jc-${j.id}`,
    title: toText(j.jobTitle),
    company: toText(j.companyName),
    location: j.jobGeo || "",
    remote: true,
    url: j.url,
    postedAt: iso(j.pubDate),
    description: toText(j.jobDescription || j.jobExcerpt),
    tags: [].concat(j.jobIndustry || [], j.jobType || []),
    source: "Jobicy",
    direct: false,
  }));
}

async function workingNomads() {
  const data = await fetchJson("https://www.workingnomads.com/api/exposed_jobs/");
  return (Array.isArray(data) ? data : []).map((j) => ({
    id: `wn-${Buffer.from(j.url).toString("base64url").slice(-24)}`,
    title: j.title,
    company: j.company_name,
    location: j.location || "",
    remote: true,
    url: j.url,
    postedAt: iso(j.pub_date),
    description: toText(j.description),
    tags: String(j.tags || "").split(",").map((t) => t.trim()).filter(Boolean),
    source: "Working Nomads",
    direct: false,
  }));
}

const viaBoard = (fetcher) => async () =>
  (await fetcher()).map((job) => ({ ...job, direct: false }));

const KEYED = { jooble: fetchJooble, adzuna: fetchAdzuna, jsearch: fetchJSearch };

/**
 * Pull every source. One dead feed costs its own roles and is reported; it
 * never takes the board down.
 */
export async function fetchSources() {
  const tasks = [
    ...EMPLOYER_BOARDS.map(([name, fetcher, slug, options]) => ({
      name,
      run: async () =>
        (await fetcher(slug, name)).map((job) => ({ ...job, feedTrustsRemote: Boolean(options?.remoteMeansGlobal) })),
    })),
    { name: "Himalayas", run: himalayas },
    { name: "Jobicy", run: jobicy },
    { name: "Working Nomads", run: workingNomads },
    { name: "Remotive", run: viaBoard(() => fetchRemotive("")) },
    { name: "RemoteOK", run: viaBoard(fetchRemoteOk) },
  ];

  const provider = (process.env.JOBS_API_PROVIDER || "").toLowerCase();
  const key = process.env.JOBS_API_KEY;
  if (key && KEYED[provider]) {
    tasks.push({
      name: provider,
      run: viaBoard(() => KEYED[provider](key, { query: "graduate", location: "Nigeria", country: "ng" })),
    });
  }

  const settled = await Promise.allSettled(tasks.map((task) => task.run()));
  const jobs = [];
  const report = [];
  settled.forEach((result, i) => {
    const name = tasks[i].name;
    if (result.status === "fulfilled") {
      jobs.push(...result.value);
      report.push({ name, count: result.value.length });
    } else {
      report.push({ name, count: 0, error: String(result.reason?.message || result.reason).slice(0, 120) });
    }
  });
  return { jobs, report };
}

/** Naira to the dollar, for the "about ₦X a month" line. Null if unreachable. */
export async function fetchNgnRate() {
  try {
    const data = await fetchJson("https://open.er-api.com/v6/latest/USD");
    const rate = Number(data?.rates?.NGN);
    return rate > 0 ? rate : null;
  } catch {
    return null;
  }
}
