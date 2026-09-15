/**
 * MediaSlot — a reserved space for artwork.
 *
 * Every image on the Academy landing page goes through this component. While a
 * slot is empty it renders a labelled placeholder at the exact aspect ratio the
 * final image needs, so the layout never shifts when the real file arrives.
 *
 * To fill a slot: drop the file into src/academy/assets/ and point the matching
 * entry in src/academy/academyMedia.js at it. Nothing else changes.
 */
export default function MediaSlot({
  src,
  alt = "",
  label,
  hint,
  icon = "fas fa-image",
  ratio = "4 / 3",
  className = "",
  rounded = true,
}) {
  const classes = [
    "ac-media",
    rounded ? "ac-media--rounded" : "",
    src ? "ac-media--filled" : "ac-media--empty",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  // The ratio travels as a custom property rather than an inline
  // `aspect-ratio`, so a breakpoint can reshape the slot — an inline style
  // would win over every media query.
  const style = { "--ac-ratio": ratio };

  if (src) {
    return (
      <div className={classes} style={style}>
        <img src={src} alt={alt} loading="lazy" />
      </div>
    );
  }

  return (
    <div
      className={classes}
      style={style}
      role="img"
      aria-label={label ? `${label} — image placeholder` : "Image placeholder"}
    >
      <i className={icon} aria-hidden="true" />
      {label && <span className="ac-media__label">{label}</span>}
      {hint && <span className="ac-media__hint">{hint}</span>}
    </div>
  );
}
