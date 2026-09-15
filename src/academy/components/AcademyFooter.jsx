import { Link } from "react-router-dom";
import logo from "../../assets/memora logo.PNG";

/**
 * Academy footer — carries the Memora Smart Technologies ownership statement.
 * Links point only at routes that actually exist today; planned Academy routes
 * are rendered as plain text so nothing dead-ends.
 */

const COLUMNS = [
  {
    title: "Academy",
    links: [
      { label: "All courses", href: "#courses" },
      { label: "How we teach", href: "#method" },
      { label: "Data Analysis", href: "#flagship" },
      { label: "Curriculum", href: "#curriculum" },
      { label: "How it works", href: "#how-it-works" },
      { label: "Certification", href: "#certificate" },
      { label: "Questions", href: "#faq" },
    ],
  },
  {
    title: "Memora Smart",
    links: [
      { label: "Home", to: "/" },
      { label: "Services", to: "/#services" },
      { label: "Projects", to: "/#projects" },
      { label: "About us", to: "/#about" },
      { label: "Contact", to: "/#contact" },
    ],
  },
  {
    title: "Products",
    links: [
      { label: "CV Builder", to: "/cv-builder" },
      { label: "ATS Checker", to: "/ats-check" },
      { label: "Project Pilot", to: "/projectpilot" },
      { label: "Ebook Library", to: "/library" },
      { label: "Pricing", to: "/pricing" },
    ],
  },
];

/**
 * Social links. Add the real profile URLs here and the icons appear; an entry
 * with `url: null` is not rendered at all, because an icon that goes nowhere
 * is a broken control rather than a decoration.
 */
const SOCIALS = [
  { icon: "fab fa-linkedin-in", label: "LinkedIn", url: null },
  { icon: "fab fa-x-twitter", label: "X", url: null },
  { icon: "fab fa-youtube", label: "YouTube", url: null },
  { icon: "fab fa-instagram", label: "Instagram", url: null },
].filter((social) => social.url);

export default function AcademyFooter() {
  return (
    <footer className="ac-footer">
      <div className="ac-container ac-footer__inner">
        <div className="ac-footer__brand">
          <div className="ac-brand ac-brand--footer">
            <img src={logo} alt="" className="ac-brand__mark" />
            <span className="ac-brand__text">
              <span className="ac-brand__name">Memora Smart</span>
              <span className="ac-brand__sub">Building Smart Digital Futures</span>
            </span>
          </div>

          <p className="ac-footer__blurb">
            Memora Smart Academy is the learning arm of Memora Smart Technologies —
            structured, practical programmes that take people from absolute
            beginner to job-ready, one concept at a time.
          </p>

          {SOCIALS.length > 0 && (
            <div className="ac-footer__socials">
              {SOCIALS.map((social) => (
                <a
                  key={social.label}
                  href={social.url}
                  aria-label={social.label}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className={social.icon} aria-hidden="true" />
                </a>
              ))}
            </div>
          )}
        </div>

        <div className="ac-footer__cols">
          {COLUMNS.map((column) => (
            <div className="ac-footer__col" key={column.title}>
              <h3>{column.title}</h3>
              {column.links.map((link) =>
                link.to ? (
                  <Link key={link.label} to={link.to}>
                    {link.label}
                  </Link>
                ) : (
                  <a key={link.label} href={link.href}>
                    {link.label}
                  </a>
                )
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="ac-footer__bar">
        <div className="ac-container ac-footer__bar-inner">
          <p>
            © {new Date().getFullYear()} <strong>Memora Smart Technologies</strong>.
            All rights reserved.
          </p>
          <p className="ac-footer__owner">
            Memora Smart Academy is a product of Memora Smart Technologies.
          </p>
        </div>
      </div>
    </footer>
  );
}
