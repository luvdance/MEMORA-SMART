import { Link } from "react-router-dom";
import vantage from "../assets/vantage_template.png";
import { ArrowRight } from "./icons";

/** The CV Builder, shown where someone is about to need a CV. */
export default function CvBanner({ compact = false }) {
  return (
    <aside className={`mf-cvban ${compact ? "mf-cvban--compact" : ""}`} aria-label="Memora CV Builder">
      <div className="mf-cvban__text">
        <p className="mf-eyebrow">Memora CV Builder</p>
        <h2>Every proven skill still needs a CV that gets read.</h2>
        <p>Build one that passes screening software, checked against the job you want. It's ready for your Passport the moment you save it.</p>
        <Link className="mf-btn mf-btn--light" to="/cv-builder">
          Build my CV <ArrowRight size={18} weight="bold" />
        </Link>
      </div>
      <div className="mf-cvban__shot">
        <img src={vantage} alt="The CV Builder editing a Vantage template CV, with a CV strength score of 88%" loading="lazy" width="1270" height="564" />
      </div>
    </aside>
  );
}
