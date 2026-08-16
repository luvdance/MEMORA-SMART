import BookCover from "./BookCover";

/**
 * `freeRoute` is resolved by the parent (Library.jsx) by looking up
 * book.freeSlug against the freeBooks list — keeps this component
 * free of any assumption about URL shape.
 */
export default function PaidBookCard({ book, freeRoute, onBuy, wishlisted, onToggleWishlist }) {
  return (
    <div className="ecard">
      <div className="ecard-cover-wrap">
        <BookCover image={book.cover} icon={book.icon} title={book.title} size="md" />
        <button
          className={`ecard-wishlist${wishlisted ? " is-active" : ""}`}
          onClick={() => onToggleWishlist(book.slug)}
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
          aria-pressed={wishlisted}
        >
          <i className={wishlisted ? "fa-solid fa-heart" : "fa-regular fa-heart"} />
        </button>
        {book.badge && <span className="ecard-badge">{book.badge}</span>}
      </div>

      <div className="ecard-body">
        <span className="ecard-category">{book.category}</span>
        <h3>{book.title}</h3>
        <p className="ecard-desc">{book.description}</p>

        {freeRoute && (
          <a href={freeRoute} className="ecard-preview-link">
            Read a free preview <i className="fa-solid fa-arrow-right" />
          </a>
        )}

        <div className="ecard-footer">
          <div className="ecard-price-block">
            {book.originalPrice && (
              <span className="ecard-price-original">₦{book.originalPrice.toLocaleString()}</span>
            )}
            <span className="ecard-price">₦{book.price.toLocaleString()}</span>
          </div>
          <button className="ecard-buy-btn" onClick={() => onBuy(book)}>
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}
