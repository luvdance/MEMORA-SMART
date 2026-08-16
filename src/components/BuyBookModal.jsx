import { useState } from "react";
import { buyBook } from "../utils/paymentService";
import BookCover from "./BookCover";
import "./BuyBookModal.css";

export default function BuyBookModal({ book, freeRoute, onClose }) {
  const [stage, setStage] = useState("details"); // details | checkout | success
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [purchase, setPurchase] = useState(null);

  function handleCheckoutSubmit(e) {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    setLoading(true);
    buyBook({
      email: email.trim().toLowerCase(),
      book,
      onSuccess: (result) => {
        setLoading(false);
        setPurchase(result);
        setStage("success");
      },
      onClose: () => setLoading(false),
    });
  }

  return (
    <div className="bbm__backdrop" onClick={onClose}>
      <div className="bbm__modal" onClick={(e) => e.stopPropagation()}>
        <button className="bbm__close" onClick={onClose} aria-label="Close">
          <i className="fa-solid fa-xmark" />
        </button>

        {/* ── STAGE 1: DETAILS / PREVIEW ── */}
        {stage === "details" && (
          <>
            <div className="bbm__cover-row">
              <BookCover image={book.cover} icon={book.icon} title={book.title} size="sm" />
              <div>
                <span className="bbm__category">{book.category}</span>
                <h2>{book.title}</h2>
              </div>
            </div>

            <p className="bbm__desc">{book.description}</p>

            {book.features?.length > 0 && (
              <ul className="bbm__features">
                {book.features.map((f, i) => (
                  <li key={i}>
                    <i className="fa-solid fa-circle-check" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            )}

            <div className="bbm__price-row">
              <div>
                {book.originalPrice && (
                  <span className="bbm__price-original">₦{book.originalPrice.toLocaleString()}</span>
                )}
                <span className="bbm__price">₦{book.price.toLocaleString()}</span>
              </div>
              <span className="bbm__instant">
                <i className="fa-solid fa-bolt" /> Instant Download
              </span>
            </div>

            <div className="bbm__actions">
              <button className="bbm__btn" onClick={() => setStage("checkout")}>
                Buy Now
              </button>
              {freeRoute && (
                <a href={freeRoute} className="bbm__btn-secondary">
                  Preview Ebook
                </a>
              )}
            </div>
          </>
        )}

        {/* ── STAGE 2: EMAIL + PAYSTACK CHECKOUT ── */}
        {stage === "checkout" && (
          <>
            <div className="bbm__header">
              <div className="bbm__icon">
                <i className={book.icon || "fa-solid fa-book"} />
              </div>
              <h2>{book.title}</h2>
              <p>Enter your email to continue — your download link goes here right after payment.</p>
            </div>

            <div className="bbm__price-row-simple">
              <span>Full book</span>
              <span className="bbm__price">₦{book.price.toLocaleString()}</span>
            </div>

            <form className="bbm__form" onSubmit={handleCheckoutSubmit}>
              <input
                type="email"
                placeholder="Email for your receipt & download"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button type="submit" className="bbm__btn" disabled={loading}>
                {loading ? (
                  <>
                    <i className="fa-solid fa-spinner fa-spin" /> Opening payment...
                  </>
                ) : (
                  <>Pay ₦{book.price.toLocaleString()}</>
                )}
              </button>
              {error && <p className="bbm__error">{error}</p>}
            </form>

            <button className="bbm__back-link" onClick={() => setStage("details")}>
              <i className="fa-solid fa-arrow-left" /> Back to details
            </button>

            <div className="bbm__footer">
              <i className="fa-solid fa-lock" />
              <span>Payments secured by Paystack. Your card details are never stored on our servers.</span>
            </div>
          </>
        )}

        {/* ── STAGE 3: SUCCESS ── */}
        {stage === "success" && (
          <div className="bbm__success">
            <div className="bbm__success-icon">
              <i className="fa-solid fa-check" />
            </div>
            <h2>You're all set 🎉</h2>
            <p>
              Payment confirmed for <b>{book.title}</b>. Your download is ready below —
              a receipt has also been sent to {purchase.email}.
            </p>
            <a
              href={book.downloadUrl}
              className="bbm__download-btn"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fa-solid fa-download" /> Download Your Book
            </a>
            <p className="bbm__ref">Reference: {purchase.reference}</p>
          </div>
        )}
      </div>
    </div>
  );
}
