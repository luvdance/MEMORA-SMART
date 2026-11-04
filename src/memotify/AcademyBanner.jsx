import { Link } from "react-router-dom";
// The photo and course cards from assets/academy_banner.jpg, cropped clear of
// its own headline (which read as broken text when the banner cut it) and shrunk.
import academy from "../assets/memotify/academy.webp";
import { ArrowRight } from "./icons";

/** Memora Smart Academy, shown where someone meets a skill they don't have yet. */
export default function AcademyBanner({ compact = false }) {
  return (
    <aside className={`mf-cvban mf-cvban--academy ${compact ? "mf-cvban--compact" : ""}`} aria-label="Memora Smart Academy">
      <div className="mf-cvban__text">
        <p className="mf-eyebrow">Memora Smart Academy</p>
        <h2>Missing a skill these jobs ask for? Learn it properly.</h2>
        <p>
          Courses that start from zero and end with work you can show an employer. Pass the final exam
          and the skill goes on your Passport as Certified, the strongest proof an employer sees here.
        </p>
        <Link className="mf-btn" to="/academy/courses">
          Browse the courses <ArrowRight size={18} weight="bold" />
        </Link>
      </div>
      <div className="mf-cvban__shot">
        <img
          src={academy}
          alt="A Memora Smart Academy student enrolled in Data Analysis, 43% through the course"
          loading="lazy"
          width="579"
          height="420"
        />
      </div>
    </aside>
  );
}
