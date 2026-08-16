import { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import "./LeadMagnetPage.css";

/**
 * Reusable lead magnet landing page.
 *
 * Each book's page file (see src/pages/LeadMagnet*.jsx) just passes in
 * its own copy + links as props — this component handles layout,
 * the opt-in form, and saving the lead to Firestore.
 *
 * Firestore collection: "leadmagnet_subscribers"
 * Fields saved: name, email, leadMagnet (slug), bookTitle, createdAt
 */
export default function LeadMagnetPage({
  slug, // unique id for this lead magnet, e.g. "excel-masterclass"
  bookTitle, // full book title, saved with each lead for reference
  eyebrow = "Free Download",
  headline, // JSX or string — can include a <span className="lm-gradient-text"> for accent
  subhead,
  benefits = [], // array of short strings, shown as a checklist
  mockupIcon = "fa-solid fa-book", // Font Awesome class
  mockupTag = "Free Resource",
  mockupTitle,
  insideItems = [], // array of { icon, title, description }
  ctaLabel = "Send Me the Free Guide",
  successTitle = "Check your inbox 🎉",
  successMessage = "Your free download is on its way. If you don't see it in a minute, check your spam folder.",
  downloadUrl, // direct link to the PDF/resource — fill this in
  fullBookHeadline,
  fullBookDescription,
  selarUrl, // link to the full book on Selar — fill this in
  homeUrl = "/",
  brandName = "Memora Smart Technologies",
  logoSrc, // imported logo image — pass this in from the page file
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!name.trim() || !email.trim()) {
      setError("Please fill in your name and email.");
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, "leadmagnet_subscribers"), {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        leadMagnet: slug,
        bookTitle,
        createdAt: serverTimestamp(),
      });
      setSubmitted(true);
    } catch (err) {
      console.error("Lead magnet submit failed:", err);
      setError("Something went wrong. Please try again in a moment.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="lm-page">
      <nav className="lm-nav">
        <div className="lm-nav-inner">
          <a href={homeUrl} className="lm-nav-brand">
            {logoSrc ? (
              <img src={logoSrc} alt={brandName} className="lm-nav-logo" />
            ) : (
              <i className="fa-solid fa-book lm-nav-logo-fallback" />
            )}
            <span className="lm-nav-name">{brandName}</span>
          </a>

          <a href={homeUrl} className="lm-nav-cta">
            <span>Explore All Books</span>
            <i className="fa-solid fa-arrow-right" />
          </a>
        </div>
      </nav>

      <section className="lm-hero">
        <div className="lm-hero-inner">
          <div className="lm-hero-content">
            <span className="lm-eyebrow">
              <i className="fa-solid fa-sparkles" /> {eyebrow}
            </span>

            <h1>{headline}</h1>
            <p className="lm-subhead">{subhead}</p>

            {benefits.length > 0 && (
              <ul className="lm-benefits">
                {benefits.map((b, i) => (
                  <li key={i}>
                    <i className="fa-solid fa-circle-check" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            )}

            {!submitted ? (
              <form className="lm-form" onSubmit={handleSubmit}>
                <input
                  type="text"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <input
                  type="email"
                  placeholder="Your best email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <button type="submit" className="lm-submit-btn" disabled={loading}>
                  {loading ? "Sending..." : ctaLabel}
                  {!loading && <i className="fa-solid fa-arrow-right" />}
                </button>
                {error && <p className="lm-error">{error}</p>}
              </form>
            ) : (
              <div className="lm-success">
                <div className="lm-success-icon">
                  <i className="fa-solid fa-check" />
                </div>
                <h3>{successTitle}</h3>
                <p>{successMessage}</p>
                {downloadUrl && (
                  <a
                    href={downloadUrl}
                    className="lm-download-btn"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i className="fa-solid fa-download" /> Download Now
                  </a>
                )}
              </div>
            )}

            <p className="lm-privacy">No spam. Unsubscribe anytime.</p>
          </div>

          <div className="lm-hero-visual">
            <div className="lm-mockup">
              <i className={mockupIcon} />
              <span className="lm-mockup-tag">{mockupTag}</span>
              <span className="lm-mockup-title">{mockupTitle}</span>
            </div>
          </div>
        </div>
      </section>

      {insideItems.length > 0 && (
        <section className="lm-inside">
          <div className="lm-inside-inner">
            <h2>What's inside</h2>
            <div className="lm-inside-grid">
              {insideItems.map((item, i) => (
                <div className="lm-inside-card" key={i}>
                  <i className={item.icon} />
                  <h4>{item.title}</h4>
                  <p>{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="lm-fullbook">
        <div className="lm-fullbook-inner">
          <h2>{fullBookHeadline}</h2>
          <p>{fullBookDescription}</p>
          <a
            href={selarUrl}
            className="lm-fullbook-btn"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="fa-solid fa-cart-shopping" /> Get the Full Book
          </a>
        </div>
      </section>

      <p className="lm-footnote">© {new Date().getFullYear()} {brandName}. All rights reserved.</p>
    </div>
  );
}
