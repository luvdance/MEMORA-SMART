/**
 * ENROLLMENT INTENT
 *
 * When a signed-out visitor clicks "Start this course" we need to remember
 * which course they wanted, send them through the existing signup, and land
 * them back on it afterwards.
 *
 * Router state alone is not enough. A brand-new user must verify their email,
 * and the verification link opens a FRESH page load from their mail client —
 * `location.state` is gone by then. So the intent is also written to
 * localStorage, and whichever survives is used.
 *
 * It expires after 24 hours so a forgotten intent can never hijack an
 * unrelated login weeks later.
 */

const KEY = "academy:intent";
const MAX_AGE_MS = 24 * 60 * 60 * 1000;

export function rememberIntent(slug) {
  try {
    localStorage.setItem(
      KEY,
      // `slug` may be null, meaning "they pressed Enrol without having picked
      // a course yet". That is a real intent and must survive sign-up just as
      // a specific course does — otherwise a new learner verifies their email
      // and lands on the flagship they never chose.
      JSON.stringify({ action: "enroll", slug: slug || null, at: Date.now() })
    );
  } catch {
    // Private browsing or blocked storage — router state still covers the
    // common case, so this is a soft failure by design.
  }
}

export function readIntent() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;

    const intent = JSON.parse(raw);
    // A slug-less enrol intent is valid; only a malformed or stale one is not.
    if (intent?.action !== "enroll" || Date.now() - intent.at > MAX_AGE_MS) {
      clearIntent();
      return null;
    }
    return intent;
  } catch {
    return null;
  }
}

export function clearIntent() {
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}

/**
 * Where a pending intent should send someone once they are signed in.
 *
 * No slug means they had not chosen a course yet, so they go to the chooser —
 * NOT to /academy/learn, which would silently drop the intent, and not to the
 * flagship, which would enrol them in something they never picked.
 */
export function intentPath(intent) {
  if (!intent) return "/academy/learn";
  if (!intent.slug) return "/academy/enroll";
  return `/academy/enroll/${intent.slug}`;
}

/**
 * The single entry point into the Academy funnel.
 *
 * Signed in  → straight to enrolment, or to the chooser if no course is named.
 * Signed out → the existing /auth flow, with the destination remembered twice.
 *
 * NO DEFAULT COURSE. This used to default to "data-analysis", which meant a
 * button labelled "Enrol now" enrolled you in a specific course without
 * asking. Called without a slug it now routes to the chooser, so the learner
 * picks and the system records what they actually chose. A slug passed
 * explicitly — from a course card, say — still goes straight through, because
 * there the choice has already been made.
 *
 * Deliberately never routes to /dashboard: the Academy is its own product and
 * a learner should never be dropped into the CV-builder dashboard.
 */
export function startAcademyJourney(navigate, user, slug = null) {
  // No course named yet: everyone goes to the chooser, signed in or not. The
  // signup wall belongs AFTER the choice, not before it — a visitor asked to
  // create an account before seeing what is on offer usually just leaves.
  if (!slug) {
    navigate("/academy/enroll");
    return;
  }

  const destination = `/academy/enroll/${slug}`;

  if (user) {
    navigate(destination);
    return;
  }

  rememberIntent(slug);
  navigate("/auth", { state: { from: destination } });
}
