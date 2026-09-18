import { BETA_LABEL } from "../data/catalog";

/**
 * BETA MARKER
 *
 * One component so the wording and styling of "this is still being tested"
 * cannot drift between the eight places a course is shown. Renders nothing
 * when the course is not in beta, so callers can use it unconditionally.
 *
 * `title` carries the longer explanation for anyone who hovers or uses a
 * screen reader, while the visible chip stays short enough not to fight the
 * course name for attention.
 */
export default function BetaBadge({ beta, note, size = "sm" }) {
  if (!beta) return null;
  return (
    <span
      className={`ac-beta ac-beta--${size}`}
      title={note || undefined}
      aria-label={note ? `${BETA_LABEL}. ${note}` : BETA_LABEL}
    >
      {BETA_LABEL}
    </span>
  );
}
