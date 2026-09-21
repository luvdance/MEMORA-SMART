/**
 * ONBOARDING — WHAT WE ASK A NEW STUDENT, AND WHY
 *
 * Defined as data rather than inline in a form, so the questions, their
 * options and their stated purpose are one auditable list. A privacy notice
 * that drifts from the form it describes is worse than none.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * THIS IS PERSONAL DATA. READ BEFORE ADDING A FIELD.
 *
 * The Nigeria Data Protection Act 2023 applies to this platform, and so does
 * the GDPR for any learner in the EU. Three obligations shape this file:
 *
 *   PURPOSE LIMITATION — every field carries a `why`, shown to the student.
 *     "Data we can use to run analysis" is not a lawful purpose on its own;
 *     "so we know whether to build for phones first" is. If a field cannot be
 *     given an honest, specific `why`, it should not be collected.
 *
 *   DATA MINIMISATION — only two fields are required, and neither is
 *     sensitive. Everything used for analysis is OPTIONAL and marked so. An
 *     age BAND is collected rather than a date of birth, because the band is
 *     enough for every analysis we actually run and a birth date is not.
 *
 *   CONSENT — the analytics use is consented explicitly and separately from
 *     the operational use. A learner who declines still gets their course.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * AND ONE SAFEGUARDING CONSEQUENCE, WHICH IS WHY `ageBand` IS REQUIRED.
 *
 * The Academy now has private, end-to-end encrypted student-to-student chat.
 * Nobody at Memora can read it, which means nobody can moderate it. Putting a
 * 15-year-old into unmoderated private messages with adult strangers is a
 * risk this platform should not take by default.
 *
 * So asking the age is not for analytics — it is so that UNDER_18 accounts
 * can have chat off by default (see `chatDefaultFor`). Knowing a learner is a
 * child creates a duty to act on it; collecting the field and ignoring it
 * would be worse than not asking.
 * ═══════════════════════════════════════════════════════════════════════════
 */

export const UNDER_18 = "under-18";

/**
 * The questions.
 *
 * `required` is true for exactly two: how to reach the learner, and their age
 * band. Everything else improves the platform and is optional, which is
 * stated on the form rather than implied by an absent asterisk.
 */
/**
 * Names that must not be claimed as a username.
 *
 * A learner called "admin" or "memora" in a chat list can impersonate the
 * platform, and that is the one thing a display name must never be able to
 * do. Checked case-insensitively against the trimmed value.
 */
export const RESERVED_USERNAMES = [
  "admin", "administrator", "memora", "memorasmart", "memora-smart",
  "moderator", "mod", "staff", "support", "help", "official", "team",
  "system", "root", "owner", "tutor", "instructor", "academy",
];

export const ONBOARDING_FIELDS = [
  {
    id: "username",
    label: "Username",
    type: "text",
    required: true,
    placeholder: "e.g. ada_codes",
    maxLength: 20,
    /**
     * WHY THIS IS FIRST AND REQUIRED
     *
     * This is the ONLY name other learners ever see — the leaderboard, the
     * active list and a chat header all read it. Before it existed those
     * surfaces published `displayName`, which comes from the Google account
     * and is a learner's real full name. A teenager studying Excel had their
     * legal name shown to every stranger on the platform.
     *
     * It is required because there is no safe fallback: defaulting to the
     * real name is the very thing this removes, and defaulting to something
     * anonymous makes the leaderboard meaningless.
     */
    why: "This is the name other students see on the leaderboard and in chat. Your real name is never shown to anyone.",
    validate: (v) => {
      const value = String(v || "").trim();
      if (value.length < 3) return "Pick at least 3 characters.";
      if (value.length > 20) return "Keep it to 20 characters or fewer.";
      if (!/^[a-zA-Z0-9_.]+$/.test(value)) {
        return "Letters, numbers, underscore and full stop only.";
      }
      if (/^[._]|[._]$/.test(value)) {
        return "It cannot start or end with a full stop or underscore.";
      }
      // "ada..codes" and "ada__codes" read as near-duplicates of a real
      // name at a glance, which is the impersonation the reserved list is
      // also guarding against.
      if (/[._]{2}/.test(value)) {
        return "No two dots or underscores in a row.";
      }
      // Without this, "admin" and "Memora Support" are claimable and a
      // learner can pose as the platform in a chat list.
      if (RESERVED_USERNAMES.includes(value.toLowerCase())) {
        return "That name is reserved. Please choose another.";
      }
      return null;
    },
  },
  {
    id: "phone",
    label: "Phone number",
    type: "tel",
    required: true,
    placeholder: "0803 123 4567",
    why: "So we can reach you about your course, and add you to a cohort group if one opens. We do not sell it or use it for advertising.",
    // Deliberately permissive: Nigerian numbers are written many ways and a
    // strict pattern would reject real numbers. Length and digits only.
    validate: (v) => {
      const digits = String(v || "").replace(/[^\d]/g, "");
      if (digits.length < 10) return "That looks too short for a phone number.";
      if (digits.length > 15) return "That looks too long for a phone number.";
      return null;
    },
  },
  {
    id: "ageBand",
    label: "Your age",
    type: "select",
    required: true,
    why: "Under-18 accounts have private messaging switched off by default, because those messages are encrypted and cannot be moderated by anyone. We ask for a band, never your date of birth.",
    options: [
      { value: UNDER_18, label: "Under 18" },
      { value: "18-24", label: "18 to 24" },
      { value: "25-34", label: "25 to 34" },
      { value: "35-44", label: "35 to 44" },
      { value: "45-plus", label: "45 or older" },
    ],
  },
  {
    id: "state",
    label: "Where you are",
    type: "select",
    required: false,
    why: "So we know where our learners actually are, and can plan live sessions in the right time zone.",
    options: [
      "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue",
      "Borno", "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu",
      "FCT — Abuja", "Gombe", "Imo", "Jigawa", "Kaduna", "Kano", "Katsina",
      "Kebbi", "Kogi", "Kwara", "Lagos", "Nasarawa", "Niger", "Ogun", "Ondo",
      "Osun", "Oyo", "Plateau", "Rivers", "Sokoto", "Taraba", "Yobe",
      "Zamfara", "Outside Nigeria",
    ].map((s) => ({ value: s, label: s })),
  },
  {
    id: "device",
    label: "What will you learn on, mostly?",
    type: "select",
    required: false,
    why: "This one changes what we build. If most of you are on a phone, the lesson player has to be designed for a phone first — and some courses need a computer, which we would then say louder.",
    options: [
      { value: "phone", label: "A phone" },
      { value: "laptop", label: "My own laptop or desktop" },
      { value: "shared", label: "A shared or borrowed computer" },
      { value: "cafe", label: "A cyber cafe or business centre" },
      { value: "tablet", label: "A tablet" },
    ],
  },
  {
    id: "situation",
    label: "What are you doing right now?",
    type: "select",
    required: false,
    why: "So we can pitch the pace and the examples at the right people, and know who to talk to about jobs.",
    options: [
      { value: "student", label: "In school or university" },
      { value: "employed", label: "Working" },
      { value: "self-employed", label: "Running my own thing" },
      { value: "seeking", label: "Looking for work" },
      { value: "career-change", label: "Changing career" },
    ],
  },
  {
    id: "education",
    label: "Highest level of education",
    type: "select",
    required: false,
    why: "So we can check our courses really do start from zero for the people who need that.",
    options: [
      { value: "secondary", label: "Secondary school" },
      { value: "nd-nce", label: "ND or NCE" },
      { value: "hnd-bsc", label: "HND or degree" },
      { value: "postgrad", label: "Postgraduate" },
      { value: "self-taught", label: "Self-taught" },
    ],
  },
  {
    id: "interests",
    label: "What else are you interested in?",
    type: "multi",
    required: false,
    why: "So we build the next course in the order you actually want it, rather than guessing.",
    options: [
      { value: "data", label: "Data & Analytics" },
      { value: "web", label: "Web Development" },
      { value: "ai", label: "AI & Automation" },
      { value: "creative", label: "Design & Content" },
      { value: "skills", label: "Digital Skills" },
      { value: "cyber", label: "Cybersecurity" },
    ],
  },
  {
    id: "goal",
    label: "What do you want out of this?",
    type: "textarea",
    required: false,
    maxLength: 300,
    placeholder: "A job, a promotion, a side business, or just to understand it…",
    why: "So we know whether the course is delivering what you came for. Read by a person, not a machine.",
  },
  {
    id: "source",
    label: "How did you hear about us?",
    type: "select",
    required: false,
    why: "So we stop spending effort where it is not reaching anyone.",
    options: [
      { value: "friend", label: "A friend or colleague" },
      { value: "whatsapp", label: "WhatsApp" },
      { value: "instagram", label: "Instagram" },
      { value: "x", label: "X / Twitter" },
      { value: "linkedin", label: "LinkedIn" },
      { value: "tiktok", label: "TikTok" },
      { value: "search", label: "Google or a search" },
      { value: "school", label: "My school or employer" },
      { value: "other", label: "Somewhere else" },
    ],
  },
];

/** Required ids, derived so the form and any check cannot disagree. */
export const REQUIRED_FIELDS = ONBOARDING_FIELDS.filter((f) => f.required).map(
  (f) => f.id
);

/**
 * The consent. Separate from the fields, and separate from getting the
 * course: a learner who says no still enrols.
 */
export const CONSENT = {
  id: "analyticsConsent",
  label:
    "Use my answers to improve the Academy, and contact me about my course.",
  detail:
    "We look at these answers in aggregate to decide what to build and how to teach it. We will message you about your own course and any cohort you join. We do not sell your details or use them for advertising, and you can ask us to delete them at any time.",
};

/** Has this student answered enough to be considered onboarded? */
export function isProfileComplete(profile) {
  if (!profile) return false;
  return REQUIRED_FIELDS.every((id) => {
    const value = profile[id];
    return typeof value === "string" ? value.trim().length > 0 : Boolean(value);
  });
}

/**
 * Whether private messaging should be ON by default for this profile.
 *
 * Off for under-18s, and off when the age is unknown — the safe default when
 * we cannot tell is the protective one, not the permissive one. A learner can
 * still be given access deliberately; this only decides the default.
 */
/**
 * The name other learners see. Never the real one.
 *
 * Every public surface must call this rather than reaching for displayName,
 * which is the Google account's real name. The fallback is deliberately
 * anonymous: showing a real name because a username is missing would defeat
 * the entire point of having one.
 */
/**
 * The key a username is claimed under.
 *
 * Lower-cased, so "Ada_Codes" and "ada_codes" cannot both exist — two names
 * that look identical in a chat list are the same impersonation problem the
 * reserved list exists to prevent.
 */
export function usernameKey(username) {
  return String(username || "").trim().toLowerCase();
}

export function publicNameFor(student) {
  const username = String(student?.username || student?.profile?.username || "").trim();
  return username || "Memora learner";
}

export function chatDefaultFor(profile) {
  if (!profile?.ageBand) return false;
  return profile.ageBand !== UNDER_18;
}

/** Validate a whole submission. Returns { fieldId: message } for what failed. */
export function validateProfile(values) {
  const errors = {};
  for (const field of ONBOARDING_FIELDS) {
    const raw = values?.[field.id];
    const empty =
      raw === undefined ||
      raw === null ||
      (typeof raw === "string" && !raw.trim()) ||
      (Array.isArray(raw) && raw.length === 0);

    if (field.required && empty) {
      errors[field.id] = "This one we do need.";
      continue;
    }
    if (empty) continue;

    if (field.validate) {
      const message = field.validate(raw);
      if (message) errors[field.id] = message;
    }
    if (field.maxLength && String(raw).length > field.maxLength) {
      errors[field.id] = `Please keep this under ${field.maxLength} characters.`;
    }
  }
  return errors;
}

export default ONBOARDING_FIELDS;
