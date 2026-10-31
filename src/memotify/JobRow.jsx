import { Link } from "react-router-dom";
import { Monogram, ReachTag, SkillChip, Verdict } from "./Bits";
import { ago, isNew } from "./format";
import { LEVELS } from "./data/skills";
import { SealCheck } from "./icons";

/**
 * One job in a list. A row, not a card: people scan dozens of these on a
 * phone, so it holds what decides a tap and nothing more.
 */
export default function JobRow({ job, active = false, search = "" }) {
  const skills = job.fit?.skills?.filter((s) => s.must) || (job.must || []).map((id) => ({ id, tier: "none" }));
  const fresh = isNew(job.firstSeen);

  return (
    <Link
      to={`/memotify/jobs/${encodeURIComponent(job.id)}${search}`}
      className={`mf-row ${active ? "is-active" : ""}`}
      aria-current={active ? "true" : undefined}
    >
      <Monogram name={job.company} />
      <div className="mf-row__body">
        <div className="mf-row__head">
          <h3>{job.title}</h3>
          {job.fit && <Verdict verdict={job.fit.verdict} />}
        </div>
        <p className="mf-row__org">
          {job.company}
          {job.kind === "native" && <SealCheck size={15} weight="fill" aria-label="Verified employer" />}
        </p>
        <div className="mf-row__facts">
          <ReachTag reach={job.reach} remote={job.remote} />
          {job.level === "graduate" && <span className="mf-grad">{LEVELS.graduate}</span>}
        </div>
        {skills.length > 0 && (
          <div className="mf-row__skills">
            {skills.slice(0, 4).map((skill) => (
              <SkillChip key={skill.id} id={skill.id} tier={skill.tier} />
            ))}
            {skills.length > 4 && <span className="mf-row__more">+{skills.length - 4}</span>}
          </div>
        )}
        <p className="mf-row__age">
          {fresh && <b>New</b>}
          {job.postedAt ? `Posted ${ago(job.postedAt)}` : "Date not given"}
          {job.pay?.text ? ` · ${job.pay.text}` : ""}
        </p>
      </div>
    </Link>
  );
}
