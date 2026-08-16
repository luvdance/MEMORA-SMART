import { useState, useMemo } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import useSEO from "../hooks/useSEO";
import { freeBooks, paidBooks } from "../data/books";
import BookCover from "../components/BookCover";
import FreeBookCard from "../components/FreeBookCard";
import PaidBookCard from "../components/PaidBookCard";
import BuyBookModal from "../components/BuyBookModal";
import "./Library.css";

const freeRouteBySlug = Object.fromEntries(freeBooks.map((b) => [b.slug, b.route]));

export default function Library() {
  const [activeBook, setActiveBook] = useState(null);
  const [wishlist, setWishlist] = useState(() => new Set());
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterState, setNewsletterState] = useState("idle"); // idle | loading | done | error

  useSEO({
    title:
      "Ebook Library | Excel, AI, Remote Jobs & Digital Skills — Memora Smart Technologies",
    description:
      "Practical ebooks on Excel, AI side hustles, remote jobs from Nigeria, content creation, and digital skills. Free previews available. Instant digital delivery after secure payment.",
    structuredData: {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "Memora Smart Technologies Ebook Library",
      itemListElement: paidBooks.map((book, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: {
          "@type": "Book",
          name: book.title,
          description: book.description,
          offers: {
            "@type": "Offer",
            price: book.price,
            priceCurrency: "NGN",
            availability: "https://schema.org/InStock",
          },
        },
      })),
    },
  });

  const categories = useMemo(() => {
    const unique = [...new Set(paidBooks.map((b) => b.category))];
    return ["All", ...unique];
  }, []);

  const filteredBooks = useMemo(() => {
    return paidBooks.filter((b) => {
      const matchesCategory = activeCategory === "All" || b.category === activeCategory;
      const matchesQuery =
        !query.trim() ||
        b.title.toLowerCase().includes(query.toLowerCase()) ||
        b.category.toLowerCase().includes(query.toLowerCase());
      return matchesCategory && matchesQuery;
    });
  }, [activeCategory, query]);

  const spotlightBook = paidBooks.find((b) => b.spotlight) || paidBooks[0];

  function toggleWishlist(slug) {
    setWishlist((prev) => {
      const next = new Set(prev);
      next.has(slug) ? next.delete(slug) : next.add(slug);
      return next;
    });
  }

  async function handleNewsletterSubmit(e) {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    setNewsletterState("loading");
    try {
      await addDoc(collection(db, "newsletter_subscribers"), {
        email: newsletterEmail.trim().toLowerCase(),
        source: "library_page",
        createdAt: serverTimestamp(),
      });
      setNewsletterState("done");
      setNewsletterEmail("");
    } catch (err) {
      console.error("Newsletter signup failed:", err);
      setNewsletterState("error");
    }
  }

  function scrollTo(id) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <div className="lib-page">
      {/* ══════════════ NAV ══════════════ */}
      <nav className="lib-nav">
        <div className="lib-nav-inner">
          <a href="/" className="lib-nav-brand">
            <div className="lib-nav-logo-fallback">M</div>
            <span>Memora Smart</span>
          </a>

          <div className="lib-nav-links">
            <a href="/">Home</a>
            <button onClick={() => scrollTo("lib-ebooks")}>Browse Ebooks</button>
            <button onClick={() => scrollTo("lib-categories")}>Categories</button>
            <button onClick={() => scrollTo("lib-spotlight")}>Spotlight</button>
            <a href="/">About</a>
          </div>

          <div className="lib-nav-actions">
            <button
              className="lib-nav-icon-btn"
              onClick={() => setSearchOpen((s) => !s)}
              aria-label="Search ebooks"
            >
              <i className="fa-solid fa-magnifying-glass" />
            </button>
            <button className="lib-nav-cta" onClick={() => scrollTo("lib-ebooks")}>
              Browse Ebooks
            </button>
          </div>
        </div>

        {searchOpen && (
          <div className="lib-nav-search">
            <i className="fa-solid fa-magnifying-glass" />
            <input
              autoFocus
              type="text"
              placeholder="Search ebooks by title or category..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        )}
      </nav>

      {/* ══════════════ HERO ══════════════ */}
      <section className="lib-hero">
        <div className="lib-hero-text">
          <h1>
            Knowledge That Fits<br />
            <span className="lib-gradient-text">in Your Pocket.</span>
          </h1>
          <p>
            Discover practical, expertly crafted ebooks designed to help you learn
            faster, earn more, and build better skills.
          </p>
          <div className="lib-hero-actions">
            <button className="lib-btn-primary" onClick={() => scrollTo("lib-ebooks")}>
              Explore Ebooks <i className="fa-solid fa-arrow-right" />
            </button>
            <button className="lib-btn-secondary" onClick={() => scrollTo("lib-free")}>
              Read Free Previews
            </button>
          </div>

          <div className="lib-trust-row">
            <span><i className="fa-solid fa-bolt" /> Instant Digital Delivery</span>
            <span><i className="fa-solid fa-lock" /> Secure Payment</span>
            <span><i className="fa-solid fa-mobile-screen" /> Read Anywhere</span>
          </div>
        </div>

        <div className="lib-hero-covers">
          <div className="lib-hero-covers">
            <BookCover image={paidBooks[0]?.cover} icon="fa-solid fa-table-cells" title="Excel Master Class" size="lg" tilt={-8} floating />
            <BookCover image={paidBooks[2]?.cover} icon="fa-solid fa-robot" title="AI Side Hustles" size="md" tilt={10} floating />
            <BookCover image={paidBooks[1]?.cover} icon="fa-solid fa-earth-africa" title="Remote Jobs Guide" size="sm" tilt={-4} floating />
          </div>
        </div>
      </section>

      {/* ══════════════ FREE PREVIEWS ══════════════ */}
      <section id="lib-free" className="lib-section">
        <div className="lib-section-head">
          <h2>Free Previews</h2>
          <p>Try before you buy — no payment required.</p>
        </div>
        <div className="lib-free-grid">
          {freeBooks.map((book) => (
            <FreeBookCard key={book.slug} book={book} />
          ))}
        </div>
      </section>

      {/* ══════════════ CATEGORIES + EBOOKS ══════════════ */}
      <section id="lib-ebooks" className="lib-section lib-section--tinted">
        <div id="lib-categories" className="lib-section-head">
          <h2>Browse Ebooks</h2>
          <p>Filter by what you're trying to learn.</p>
        </div>

        <div className="lib-category-chips">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`lib-chip${activeCategory === cat ? " is-active" : ""}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {filteredBooks.length > 0 ? (
          <div className="lib-ebook-grid">
            {filteredBooks.map((book) => (
              <PaidBookCard
                key={book.slug}
                book={book}
                freeRoute={book.freeSlug ? freeRouteBySlug[book.freeSlug] : null}
                onBuy={setActiveBook}
                wishlisted={wishlist.has(book.slug)}
                onToggleWishlist={toggleWishlist}
              />
            ))}
          </div>
        ) : (
          <p className="lib-empty">No ebooks match "{query}". Try a different search.</p>
        )}
      </section>

      {/* ══════════════ SPOTLIGHT ══════════════ */}
      {spotlightBook && (
        <section id="lib-spotlight" className="lib-spotlight">
          <div className="lib-spotlight-cover">
            <BookCover image={spotlightBook.cover} icon={spotlightBook.icon} title={spotlightBook.title} size="xl" />
          </div>
          <div className="lib-spotlight-info">
            <span className="lib-hero-eyebrow">Featured Ebook</span>
            <h2>{spotlightBook.title}</h2>
            <p>{spotlightBook.description}</p>

            <ul className="lib-spotlight-features">
              {spotlightBook.features.map((f, i) => (
                <li key={i}>
                  <i className="fa-solid fa-circle-check" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>

            <div className="lib-spotlight-actions">
              <span className="lib-spotlight-price">₦{spotlightBook.price.toLocaleString()}</span>
              <button className="lib-btn-primary" onClick={() => setActiveBook(spotlightBook)}>
                Buy Now
              </button>
              {spotlightBook.freeSlug && (
                <a href={freeRouteBySlug[spotlightBook.freeSlug]} className="lib-btn-secondary">
                  Preview Ebook
                </a>
              )}
            </div>
            <p className="lib-spotlight-note">
              <i className="fa-solid fa-bolt" /> Instant download the moment payment is confirmed
            </p>
          </div>
        </section>
      )}

      {/* ══════════════ WHY CHOOSE US ══════════════ */}
      <section className="lib-why">
        <div className="lib-section-head lib-section-head--center">
          <h2>Why Readers Choose Memora Smart</h2>
        </div>
        <div className="lib-why-grid">
          <div className="lib-why-card">
            <i className="fa-solid fa-graduation-cap" />
            <h4>Practical Knowledge</h4>
            <p>No filler — every book is built around skills you can use the same day.</p>
          </div>
          <div className="lib-why-card">
            <i className="fa-solid fa-bolt" />
            <h4>Instant Access</h4>
            <p>Pay and download immediately. No waiting, no shipping.</p>
          </div>
          <div className="lib-why-card">
            <i className="fa-solid fa-tags" />
            <h4>Affordable Learning</h4>
            <p>Real skills, priced for beginners — not premium course fees.</p>
          </div>
          <div className="lib-why-card">
            <i className="fa-solid fa-mobile-screen" />
            <h4>Learn Anywhere</h4>
            <p>Read on your phone, tablet, or laptop — your pace, your schedule.</p>
          </div>
        </div>
      </section>

      {/* ══════════════ NEWSLETTER ══════════════ */}
      <section className="lib-newsletter">
        <div className="lib-newsletter-inner">
          <h2>Get Smarter. One Ebook at a Time.</h2>
          <p>
            Join our newsletter and get updates about new ebooks, exclusive
            discounts, and useful learning resources.
          </p>

          {newsletterState === "done" ? (
            <p className="lib-newsletter-success">
              <i className="fa-solid fa-circle-check" /> You're subscribed — welcome aboard!
            </p>
          ) : (
            <form className="lib-newsletter-form" onSubmit={handleNewsletterSubmit}>
              <input
                type="email"
                placeholder="Your email address"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                required
              />
              <button type="submit" disabled={newsletterState === "loading"}>
                {newsletterState === "loading" ? "Subscribing..." : "Subscribe"}
              </button>
            </form>
          )}
          {newsletterState === "error" && (
            <p className="lib-newsletter-error">Something went wrong. Please try again.</p>
          )}
        </div>
      </section>

      {/* ══════════════ FOOTER ══════════════ */}
      <footer className="lib-footer">
        <div className="lib-footer-inner">
          <div className="lib-footer-brand">
            <div className="lib-nav-logo-fallback">M</div>
            <span>Memora Smart</span>
            <p>Practical ebooks for beginners who want real results — Excel, AI, remote work, content, and digital skills.</p>
          </div>

          <div className="lib-footer-col">
            <h4>Categories</h4>
            {categories.filter((c) => c !== "All").map((cat) => (
              <button key={cat} onClick={() => { setActiveCategory(cat); scrollTo("lib-ebooks"); }}>
                {cat}
              </button>
            ))}
          </div>

          <div className="lib-footer-col">
            <h4>Quick Links</h4>
            <a href="/">Home</a>
            <a href="/library">Ebook Library</a>
            <a href="/cv-builder">CV Builder</a>
          </div>

          <div className="lib-footer-col">
            <h4>Support</h4>
            <a href="/">Contact</a>
            <a href="/">Privacy Policy</a>
            <a href="/">Terms & Conditions</a>
          </div>
        </div>

        <div className="lib-footer-bottom">
          © {new Date().getFullYear()} Memora Smart Technologies. All rights reserved.
        </div>
      </footer>

      {activeBook && (
        <BuyBookModal
          book={activeBook}
          freeRoute={activeBook.freeSlug ? freeRouteBySlug[activeBook.freeSlug] : null}
          onClose={() => setActiveBook(null)}
        />
      )}
    </div>
  );
}
