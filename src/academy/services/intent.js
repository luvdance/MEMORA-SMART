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
      JSON.stringify({ action: "enroll", slug, at: Date.now() })
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
    if (!intent?.slug || Date.now() - intent.at > MAX_AGE_MS) {
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

/** Where a pending intent should send someone once they are signed in. */
export function intentPath(intent) {
  if (!intent?.slug) return "/academy/learn";
  return `/academy/enroll/${intent.slug}`;
}

/**
 * The single entry point into the Academy funnel.
 *
 * Signed in  → straight to enrollment.
 * Signed out → the existing /auth flow, with the destination remembered twice.
 *
 * Deliberately never routes to /dashboard: the Academy is its own product and
 * a learner should never be dropped into the CV-builder dashboard.
 */
export function startAcademyJourney(navigate, user, slug = "data-analysis") {
  const destination = `/academy/enroll/${slug}`;

  if (user) {
    navigate(destination);
    return;
  }

  rememberIntent(slug);
  navigate("/auth", { state: { from: destination } });
}
