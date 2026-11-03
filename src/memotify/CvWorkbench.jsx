import { Link } from "react-router-dom";
import { skillLabel } from "./data/skills";
import { ago, builderLink } from "./format";
import { Notice } from "./Bits";
import { ArrowRight, FileText, Lightning, PencilSimple, ShieldCheck } from "./icons";

const RATING_TONE = { Excellent: "ok", Good: "ok", "Needs Work": "warn", Critical: "bad" };

/**
 * Everything needed to get a CV ready for this job, without leaving the page.
 * Used on the job page and inside the apply sheet.
 */
export default function CvWorkbench({ job, me, cvId, setCvId, tools, resume = "cv" }) {
  const { fit, ats, tailored, busy, error, check, optimize } = tools;

  if (!me?.cvs?.length) {
    return (
      <>
        <p className="mf-panel__sub">You have no saved CV yet. Build one and you'll come straight back here.</p>
        <Link className="mf-link" to={builderLink("/dashboard/cv-builder", job, resume)}>
          <FileText size={17} /> Build my CV
        </Link>
      </>
    );
  }

  return (
    <div className="mf-bench">
      {me.cvs.length > 1 && (
        <select className="mf-input" value={cvId} onChange={(e) => setCvId(e.target.value)} aria-label="Choose a CV">
          {me.cvs.map((cv) => <option key={cv.id} value={cv.id}>{cv.title}</option>)}
        </select>
      )}

      {fit && (
        fit.missing.length > 0 ? (
          <p className="mf-panel__sub">
            This CV doesn't mention <b>{fit.missing.map(skillLabel).join(", ")}</b>. If you have the skill, name it:
            screening software matches words literally.
          </p>
        ) : (
          <p className="mf-panel__sub">This CV names every skill the role lists.</p>
        )
      )}

      {ats && (
        <div className={`mf-ats mf-ats--${RATING_TONE[ats.rating] || "warn"}`}>
          <div className="mf-ats__score">
            <b>{ats.overallScore}</b>
            <span>/100</span>
            <em>{ats.rating}</em>
          </div>
          <p className="mf-ats__when"><ShieldCheck size={14} weight="fill" /> Matched against this job {ats.at ? ago(ats.at) : ""}</p>
          {ats.atsRedFlags?.length > 0 && (
            <ul className="mf-ats__list mf-ats__list--flags">
              {ats.atsRedFlags.map((flag) => <li key={flag}>{flag}</li>)}
            </ul>
          )}
          {ats.topImprovements?.length > 0 && (
            <>
              <h3>Biggest fixes</h3>
              <ul className="mf-ats__list">
                {ats.topImprovements.slice(0, 3).map((item) => (
                  <li key={item.title}><b>{item.title}.</b> {item.description}</li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}

      {tailored && (
        <div className="mf-tailored">
          <h3>Saved as a new CV: {tailored.title}</h3>
          <p className="mf-panel__sub">Your original is untouched, and this copy is now selected for this job.</p>
          {tailored.changes.skillsAdded.length > 0 && (
            <p className="mf-panel__sub"><b>Skills now listed:</b> {tailored.changes.skillsAdded.map(skillLabel).join(", ")}</p>
          )}
          {tailored.changes.summary && (
            <p className="mf-tailored__after"><b>New summary:</b> {tailored.changes.summary}</p>
          )}
          {(tailored.changes.unverified.figures.length > 0 || tailored.changes.unverified.skills.length > 0) && (
            <Notice tone="warn" title="Check these before you send it">
              They weren't in your original CV:{" "}
              <b>{[...tailored.changes.unverified.figures, ...tailored.changes.unverified.skills.map(skillLabel)].join(", ")}</b>.
              {" "}Remove anything that isn't true.
            </Notice>
          )}
          <p className="mf-note">Read it before you send it. Everything on your CV must be true, because you'll be asked about it.</p>
        </div>
      )}

      {error && <Notice tone="warn">{error}</Notice>}

      <div className="mf-bench__do">
        <button type="button" className="mf-btn mf-btn--small" disabled={!cvId || Boolean(busy)} onClick={check}>
          <ShieldCheck size={16} weight="fill" />
          {busy === "check" ? "Checking" : ats ? "Check again" : "Check against this job"}
        </button>
        {!fit?.tailored && (
          <button type="button" className="mf-btn mf-btn--small mf-btn--ghost" disabled={!cvId || Boolean(busy)} onClick={optimize}>
            <Lightning size={16} weight="fill" />
            {busy === "optimize" ? "Rewriting, about a minute" : "Optimize for this job"}
          </button>
        )}
        <Link className="mf-link" to={builderLink(`/cv/${cvId}`, job, resume)}>
          <PencilSimple size={16} /> Edit in the builder <ArrowRight size={14} />
        </Link>
      </div>
      {!me.premium && <p className="mf-note">The ATS check and optimizing are part of CV Premium.</p>}
    </div>
  );
}
