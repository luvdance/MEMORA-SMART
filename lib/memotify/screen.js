/**
 * THE JOB CHECKS
 *
 * Turns a raw posting into a posting Memotify can stand behind, answering what
 * a Nigerian graduate most needs to know and what other boards leave them to
 * find out after applying:
 *
 *   reachOf     Can someone living in Nigeria actually take this job?
 *   levelOf     Is it realistic for a graduate?
 *   scamFlags   Does it look like the fee scams that target this audience?
 *   readSkills  What does it really ask for?
 *
 * Pure functions: no network, no database. Covered by selfTest.mjs against
 * location strings copied from the live feeds, because those are where
 * classifiers like this quietly go wrong.
 */

import { SKILLS } from "../../src/memotify/data/skills.js";
import { inferSeniority } from "../academy/jobs/skills.js";

/* ── Reach ───────────────────────────────────────────────────────────── */

const NIGERIA = /\b(nigeria|nigerian|lagos|abuja|port harcourt|ibadan|kano|enugu|benin city|kaduna|uyo|calabar|owerri|onitsha|akwa ibom)\b/i;
/** State names count only as a whole location: "Delta" alone, not "Delta, BC". M-KOPA lists them bare. */
const STATE_ONLY = /^(anambra|ogun|oyo|edo|delta|osun|ekiti|ondo|rivers|kwara|imo|abia|plateau|fct)$/i;
const WORLD = /\b(world\s?wide|anywhere|global(ly)?|any location|international|all countries|remote[- ]first)\b/i;
// Not South, North or East Africa: those name places Nigeria is not in.
const AFRICA = /(?<!south |north |east |southern |northern |eastern )\b(africa|sub-?saharan)\b/i;
const EMEA = /\b(emea|europe,? middle east)\b/i;

/**
 * Phrases in a body that take back what the location line offered. A posting
 * tagged "Worldwide" that says "must be authorised to work in the US" is not
 * worldwide, and this is the exact failure that wastes a Nigerian applicant's
 * evening.
 */
const LOCKED_OUT = [
  /must (be|reside|live)( legally)?( located| based)? in (the )?(us|u\.s\.|usa|united states|uk|u\.k\.|united kingdom|canada|eu|europe|australia|germany|india)\b/i,
  /(authori[sz]ed|eligible|legally able|right) to work in (the )?(us|u\.s\.|usa|united states|uk|u\.k\.|united kingdom|canada|eu|australia)\b/i,
  /(only|solely) (open to|accepting|considering) (candidates|applicants|residents)[^.]{0,40}\b(us|usa|united states|uk|canada|europe|eu)\b/i,
  /\bus[- ]based (candidates|applicants) only\b/i,
  /\bunable to (hire|sponsor|consider)[^.]{0,50}\b(africa|nigeria)\b/i,
  /\bnot (hiring|accepting|able to hire)[^.]{0,40}\b(africa|nigeria)\b/i,
];

/**
 * US employer boilerplate. Only applied to third-party boards: those label
 * postings loosely, and "State of Arizona" arrived tagged as open to everyone.
 * Employer boards are exempt, since a global company's careers page can carry
 * an EEO line while really hiring worldwide.
 */
const US_EMPLOYER = /\b(401\(?k\)?|w-?2\b|e-verify|u\.?s\.? citizen|security clearance|equal (employment )?opportunity employer|fmla|medicare|department of [a-z]+ (security|services)|state of [a-z]+)\b/i;

/** Body wording that confirms an unlabelled remote job has no country limit. */
const WORLD_BODY = /\b(work from anywhere|anywhere in the world|hire (globally|worldwide|from anywhere)|fully distributed team across|remote worldwide|worldwide remote|open to candidates (worldwide|globally))\b/i;

/**
 * A title aimed at another market. "Remote, EMEA" may be technically open, but
 * "Account Executive DACH (German-Speaking)" is not a job for this audience.
 */
const ELSEWHERE_TITLE = /\b(dach|nordics?|benelux|latam|anz|(german|spanish|portuguese|italian|dutch|japanese|korean|mandarin|polish|turkish)[- ]speaking)\b/i;

/** Words that make a job remote rather than a desk in a named city. */
const REMOTE_WORD = /\b(remote|home[- ]based|work from home|wfh|distributed|telecommut)/i;

/**
 * Where is this job open to someone living in Nigeria?
 *
 * @returns {{reach: "nigeria"|"worldwide"|"region"|null, remote: boolean}}
 *   reach null means the job is closed to this audience and is dropped. Empty
 *   and unclear locations also return null unless the feed says the job is
 *   remote anywhere: showing an unclear job as open is the mistake this
 *   whole check exists to prevent.
 */
export function reachOf(job) {
  const where = String(job.location || "").replace(/\s+/g, " ").trim();
  const countries = job.countries || [];
  const text = `${job.title || ""} ${job.description || ""}`;
  const remote = Boolean(job.remote) || REMOTE_WORD.test(where);

  // A list of countries that includes Nigeria is a remote job open to it, not
  // a job in Nigeria, unless Nigeria is the only country named.
  if (countries.some((c) => /^nigeria$/i.test(c))) {
    return { reach: countries.length === 1 ? "nigeria" : "region", remote };
  }

  // Named Nigerian location. Wins over the body: a Lagos office with a US-law
  // sentence in its boilerplate is still a Lagos job.
  if (NIGERIA.test(where) || where.split(/s*;s*/).some((part) => STATE_ONLY.test(part))) {
    return { reach: "nigeria", remote };
  }

  if (countries.length > 0) return { reach: null, remote };
  if (LOCKED_OUT.some((rule) => rule.test(text))) return { reach: null, remote };
  if (ELSEWHERE_TITLE.test(job.title || "")) return { reach: null, remote };
  if (!job.direct && US_EMPLOYER.test(text)) return { reach: null, remote };

  if (WORLD.test(where)) return { reach: "worldwide", remote: true };
  if (!where) return WORLD_BODY.test(text) ? { reach: "worldwide", remote: true } : { reach: null, remote };
  if (AFRICA.test(where)) return { reach: "region", remote };
  if (EMEA.test(where)) {
    // Regional and hybrid-only EMEA offices are not open to Nigeria.
    return remote ? { reach: "region", remote } : { reach: null, remote };
  }

  // "Remote" alone. Trust it only where the source records a real restriction
  // whenever one exists, and only if the title doesn't name a country.
  if (/^remote$/i.test(where) && job.feedTrustsRemote) {
    return { reach: "worldwide", remote: true };
  }
  return { reach: null, remote };
}

/* ── Level ───────────────────────────────────────────────────────────── */

const GRADUATE_TITLE = /\b(graduate|trainee|intern|internship|entry[- ]level|junior|jnr|jr\.?|nysc|associate|assistant|apprentice|officer i|analyst i)\b/i;
const EXCLUDED_ASSOCIATE = /\b(senior associate|associate (director|manager|partner|principal|vice))\b/i;
const NO_EXPERIENCE = /\b(no (prior |previous )?experience (is )?(required|needed)|fresh graduates?|recent graduates?|new graduates?|0\s?[-–]\s?[12] years?)\b/i;

/**
 * "graduate" | "mid" | "senior".
 *
 * Built on the Academy's inferSeniority, then corrected for how Nigerian
 * employers title early roles: "Graduate Trainee", "NYSC", "Associate".
 */
export function levelOf(job) {
  const title = String(job.title || "");
  if (job.level && ["graduate", "mid", "senior"].includes(job.level)) return job.level;

  const academy = inferSeniority(job);
  if (academy === "senior") return "senior";
  if (GRADUATE_TITLE.test(title) && !EXCLUDED_ASSOCIATE.test(title)) return "graduate";
  if (NO_EXPERIENCE.test(job.description || "")) return "graduate";
  // The Academy's rule calls anything under 3 years "entry". A graduate has
  // none, so a stated 2 years is not graduate friendly: "2-5 years" isn't.
  const years = /(\d+)\+?\s*(?:[-–]\s*\d+\s*)?years?/i.exec(job.description || "");
  if (years && Number(years[1]) >= 2) return "mid";
  return academy === "entry" ? "graduate" : "mid";
}

/* ── Scam signals ────────────────────────────────────────────────────── */

const SCAM_RULES = [
  { id: "fee", weight: 3, label: "Asks you to pay", test: /\b(registration|application|training|uniform|caution|form)\s+fees?\b|\b(pay|paying|payment of)\b[^.\n]{0,30}\b(processing|medical|verification|activation)\s+fees?\b|\byou (must|will|need to) pay\b|\bpay (a |the )?(small |refundable )?(fee|deposit)\b|\bfee of (₦|n|ngn)\s?\d/i },
  { id: "chat", weight: 2, label: "Contact only through WhatsApp or Telegram", test: /\b(apply|send|message|contact|chat|dm|reach)\b[^.\n]{0,40}\b(whatsapp|telegram)\b|\b(t\.me|wa\.me)\//i },
  { id: "free-mail", weight: 1, label: "Personal email address for applications", test: /\b(send|apply|forward|submit|cv|resume)\b[^.]{0,60}@(gmail|yahoo|hotmail|outlook)\.com/i },
  { id: "money-hook", weight: 2, label: "Promises easy money", test: /\b(earn|make)\s+(up to\s+)?(₦|\$|n)\s?\d[\d,]*\s*(daily|per day|a day|weekly|per week)\b|\bno (skills?|interview) (required|needed)\b.*\b(earn|pay)\b/i },
  { id: "crypto-task", weight: 2, label: "Task or investment scheme wording", test: /\b(task[- ]based earning|forex investment|crypto investment|double your|upfront investment|mining plan|recharge (your )?account)\b/i },
  { id: "documents", weight: 2, label: "Asks for bank or BVN details up front", test: /\b(bvn|atm card|card pin|bank (login|password)|nin slip)\b/i },
  { id: "pressure", weight: 1, label: "Pressure to act immediately", test: /\b(urgent(ly)?\s+hiring|immediate(ly)? start.{0,20}no interview|slots? (are )?(limited|left))\b/i },
];

/**
 * Warning signs in a posting. A flag is a reason to look closer, not a
 * verdict, so nothing here accuses anybody; `blocked` needs a score that no
 * single ambiguous phrase can reach alone unless it is a request for money.
 *
 * Skipped for employer boards. Those are the company's own careers system, and
 * a bank's job adverts legitimately say "transaction fee" and "WhatsApp".
 *
 * @returns {{flags: {id,label}[], score: number, blocked: boolean}}
 */
export function scamFlags(job) {
  if (job.direct) return { flags: [], score: 0, blocked: false };
  const text = `${job.title || ""} ${job.description || ""} ${job.applyNote || ""}`;
  const hits = SCAM_RULES.filter((rule) => rule.test.test(text));
  const score = hits.reduce((sum, rule) => sum + rule.weight, 0);
  return {
    flags: hits.map(({ id, label }) => ({ id, label })),
    score,
    blocked: score >= 3,
  };
}

/* ── Skills ──────────────────────────────────────────────────────────── */

const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const PATTERNS = Object.entries(SKILLS).map(([id, skill]) => ({
  id,
  pattern: new RegExp(
    `(?:^|[^a-z0-9+#])(?:${skill.aliases.map(escapeRegex).join("|")})(?:[^a-z0-9+#]|$)`,
    "i"
  ),
}));

/** Everything after one of these headings is preference, not requirement. */
const NICE_HEADING = /\b(nice[- ]to[- ]have|bonus points?|good to have|preferred qualifications|desirable|would be a plus|it'?s a plus|even better if)\b/i;

/** Every skill id a piece of text mentions. Also reads CVs. */
export function skillsIn(text) {
  const lower = String(text || "").toLowerCase();
  return PATTERNS.filter(({ pattern }) => pattern.test(lower)).map(({ id }) => id);
}

const MAX_SKILLS = 5;

/** Where the part of an advert that describes the candidate begins. */
const REQUIREMENTS_HEADING = /\b(requirements?|qualifications?|what you('ll| will)? (need|bring)|what we('re| are) looking for|what you have|you (will )?have|skills (and|&) experience|key skills|about you|who you are|you might be a fit|experience required)\b/i;

/** Tools that belong in any field, so they are not demoted by the field test. */
const ANY_FIELD = new Set(["excel", "sql", "python", "writing", "git", "analysis"]);

/**
 * Which skills a posting needs.
 *
 * Reading the whole advert does not work: company boilerplate pollutes it.
 * Every Canonical job mentions Ubuntu, so every Canonical job "required" Linux,
 * accountants included. So the title and tags count first, then the
 * requirements section alone when the advert has one; and a skill from outside
 * the job's own field is only nice to have, unless the title names it.
 *
 * @returns {{must: string[], nice: string[]}}
 */
export function readSkills(job) {
  const heading = [job.title || "", ...(job.tags || [])].join(" ");
  const body = String(job.description || "");
  const cut = body.search(NICE_HEADING);
  const core = cut === -1 ? body : body.slice(0, cut);
  const extra = cut === -1 ? "" : body.slice(cut);
  const start = core.search(REQUIREMENTS_HEADING);
  const asks = start === -1 ? core : core.slice(start);

  const field = job.field || fieldOf(job);
  const fromHead = skillsIn(heading);
  const inField = (id) => field === "other" || SKILLS[id].field === field || ANY_FIELD.has(id);
  const fromBody = skillsIn(asks).filter((id) => !fromHead.includes(id));

  const must = [...fromHead, ...fromBody.filter(inField)].slice(0, MAX_SKILLS);
  const nice = [...fromBody, ...skillsIn(extra)]
    .filter((id, i, all) => !must.includes(id) && all.indexOf(id) === i)
    .slice(0, 3);
  return { must, nice };
}

/* ── Field ───────────────────────────────────────────────────────────── */

/** Titles, most specific first. Stems end in \w* so "financ" matches "Financial". */
const FIELD_TITLES = [
  ["security", /\b(security|soc analyst|penetration|cyber\w*|fraud investigat\w*)\b/i],
  ["design", /\b(designers?|design|ux|ui\/ux|graphic|illustrator|creative director|motion)\b/i],
  ["data", /\b(data|analytics|business intelligence|bi (analyst|developer)|machine learning|ml engineer|ai trainer|annotat\w*)\b/i],
  ["product", /\bproduct (manager|owner|lead|analyst|operations|management)\b/i],
  ["software", /\b(engineer|engineering|developer|programmer|devops|sre|software|qa|full[- ]?stack|front[- ]?end|back[- ]?end|android|ios|system administrator)\b/i],
  ["support", /\b(customer (support|service|success|experience|care)|support (agent|specialist|representative|associate|officer)|contact cent\w*|call cent\w*|client services|cx)\b/i],
  ["sales", /\b(sales|account executive|account officer|business development|bdr|sdr|relationship (manager|officer)|field agent|collections?|merchant|recovery)\b/i],
  ["marketing", /\b(marketing|growth|brand|seo|social media|community|campaign|communications|pr manager)\b/i],
  ["content", /\b(writer|copywriter|editor|content|journalist|translator|proofreader)\b/i],
  ["finance", /\b(financ\w*|account(ant|ing|s)\b|audit\w*|tax|treasury|credit|risk|compliance|underwrit\w*|payroll|controller|legal|counsel|fp&a)\b/i],
  ["people", /\b(recruit\w*|talent|human resources|hr|people (partner|operations|ops)|workforce|learning and development)\b/i],
  ["operations", /\b(operations?|ops|administrat\w*|assistant|logistics|supply chain|procurement|packaging|project manager|programme manager|program manager|coordinator|office manager|team lead)\b/i],
];

export function fieldOf(job) {
  const title = String(job.title || "");
  for (const [id, pattern] of FIELD_TITLES) if (pattern.test(title)) return id;
  // The employer's own department name is the next best evidence.
  const tags = (job.tags || []).join(" ");
  for (const [id, pattern] of FIELD_TITLES) if (pattern.test(tags)) return id;
  return "other";
}

/* ── Pay ─────────────────────────────────────────────────────────────── */

/**
 * Convert an annual or monthly figure to naira a month, so a graduate can
 * compare a USD offer with a Lagos one. Rounded to the nearest ₦10,000: the
 * rate moves daily and two more digits would claim accuracy we do not have.
 */
export function nairaMonthly({ min, max, period = "year", currency = "USD" }, ngnPerUsd) {
  const low = Number(min) || Number(max) || 0;
  const high = Number(max) || Number(min) || 0;
  if (!low) return null;
  const perMonth = period === "month" ? 1 : period === "hour" ? 160 : 1 / 12;
  const rate = currency === "NGN" ? 1 : currency === "USD" ? ngnPerUsd : null;
  if (!rate) return null;
  const round = (n) => Math.round((n * perMonth * rate) / 10000) * 10000;
  return { min: round(low), max: round(high) };
}
