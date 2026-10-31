import { Link } from "react-router-dom";
import { REACH, SKILLS, TIERS, VERDICTS, skillLabel } from "./data/skills";
import { GlobeHemisphereWest, MapPin, Seal, SealCheck } from "./icons";

/** A coloured square with the company's initial. Stable per company. */
export function Monogram({ name = "" }) {
  const hue = [...name].reduce((sum, ch) => sum + ch.charCodeAt(0), 0) % 4;
  return (
    <span className={`mf-mono mf-mono--${hue}`} aria-hidden="true">
      {name.trim()[0]?.toUpperCase() || "•"}
    </span>
  );
}

export function ReachTag({ reach, remote }) {
  const entry = REACH[reach];
  if (!entry) return null;
  const Icon = reach === "nigeria" ? MapPin : GlobeHemisphereWest;
  return (
    <span className={`mf-reach mf-reach--${reach}`}>
      <Icon size={14} weight="fill" />
      {entry.label}
      {remote && reach === "nigeria" ? ", remote" : ""}
    </span>
  );
}

/** The verdict, set like a rubber stamp. */
export function Verdict({ verdict }) {
  if (!verdict) return null;
  return <span className={`mf-verdict mf-verdict--${verdict}`}>{VERDICTS[verdict].label}</span>;
}

/** A skill, marked with the strength of the evidence behind it. */
export function SkillChip({ id, tier = "none" }) {
  const proof = TIERS[tier]?.proof;
  return (
    <span className={`mf-skill mf-skill--${tier}`} title={TIERS[tier]?.note || ""}>
      {tier === "certified" ? <SealCheck size={13} weight="fill" /> : proof ? <Seal size={13} weight="fill" /> : null}
      {skillLabel(id)}
    </span>
  );
}

export function Spinner({ label = "Loading" }) {
  return (
    <div className="mf-wait" role="status">
      <span className="mf-wait__bar" />
      <p>{label}</p>
    </div>
  );
}

export function Notice({ tone = "plain", title, children, action }) {
  return (
    <div className={`mf-notice mf-notice--${tone}`}>
      {title && <strong>{title}</strong>}
      {children && <p>{children}</p>}
      {action}
    </div>
  );
}

export function Stamp({ tier, skill, line }) {
  return (
    <div className={`mf-stamp mf-stamp--${tier}`}>
      <span className="mf-stamp__tier">{TIERS[tier].label}</span>
      <strong>{skillLabel(skill)}</strong>
      {line && <span className="mf-stamp__line">{line}</span>}
    </div>
  );
}

export function CheckLink({ id, children }) {
  if (!SKILLS[id]?.check) return null;
  return (
    <Link className="mf-link" to={`/memotify/check/${id}`}>
      {children || "Take the 15-minute check"}
    </Link>
  );
}
