/**
 * Stylized ebook cover — since we don't have real cover photography,
 * this renders a consistent, branded "cover" using the gradient +
 * icon + title. Swap for a real <img> per book later without
 * touching any layout that uses this component.
 */
export default function BookCover({ image, icon, title, size = "md", tilt = 0, floating = false }) {
  if (image) {
    return (
      <div
        className={`bcv bcv--${size} bcv--image${floating ? " bcv--floating" : ""}`}
        style={{ transform: `rotate(${tilt}deg)` }}
      >
        <img src={image} alt={title} className="bcv-img" />
      </div>
    );
  }

  return (
    <div
      className={`bcv bcv--${size}${floating ? " bcv--floating" : ""}`}
      style={{ transform: `rotate(${tilt}deg)` }}
    >
      <div className="bcv-shine" />
      <i className={icon} />
      <span className="bcv-title">{title}</span>
      <span className="bcv-spine" />
    </div>
  );
}