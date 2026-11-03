// ── RETURN TRIP ──
// Lets another app send someone into the CV Builder and bring them back.
// sessionStorage, because the builder changes its own URL when a new CV is
// saved. Only paths inside Memotify are accepted, so a crafted link can't
// use the builder to send anyone to another site.
const KEY = "memora_cv_return";

const isSafe = (path) => typeof path === "string" && path.startsWith("/memotify/") && !path.startsWith("//");

export function readReturnTrip(searchParams) {
  const path = searchParams.get("returnTo");
  try {
    if (isSafe(path)) {
      const trip = { path, label: (searchParams.get("returnLabel") || "your application").slice(0, 120) };
      sessionStorage.setItem(KEY, JSON.stringify(trip));
      return trip;
    }
    const held = JSON.parse(sessionStorage.getItem(KEY));
    return isSafe(held?.path) ? held : null;
  } catch {
    return isSafe(path) ? { path, label: "your application" } : null;
  }
}

export function clearReturnTrip() {
  try {
    sessionStorage.removeItem(KEY);
  } catch {
    /* Nothing was stored. */
  }
}
