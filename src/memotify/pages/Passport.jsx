import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import useSEO from "../../hooks/useSEO";
import Shell, { useMe, useRequireSignIn } from "../Shell";
import { api } from "../api";
import { Notice, SkillChip, Spinner, Stamp } from "../Bits";
import { isFuture, longDate } from "../format";
import { FIELDS, SKILLS, STAGES, TIERS, skillLabel, skillsByField } from "../data/skills";
import { ArrowRight, Copy, FileText, Fingerprint, GraduationCap, Plus, SignOut, Timer } from "../icons";
import { useAuth } from "../../context/AuthContext";

/**
 * The Skill Passport: the person's record and settings on one page, starting
 * with whichever single step would help them most right now.
 */
export default function Passport() {
  useSEO({ title: "Your Skill Passport — Memotify", description: "Your proven skills in one place." });
  const { signedIn, authLoading, me, meError, reloadMe } = useMe();
  const signIn = useRequireSignIn();

  if (authLoading) return <Shell><Spinner /></Shell>;

  if (!signedIn) {
    return (
      <Shell>
        <section className="mf-intro">
          <Fingerprint size={40} weight="duotone" />
          <h1>Your skills, with proof attached</h1>
          <p>
            Bring in your CV, pass short graded checks, and link your Academy certificates. Your Passport
            then shows you which jobs you are ready for, and shows employers what you have actually proved.
          </p>
          <button type="button" className="mf-btn" onClick={signIn}>
            Sign in to start <ArrowRight size={18} weight="bold" />
          </button>
          <p className="mf-panel__sub">Free, on the same account as your CV Builder and Academy.</p>
        </section>
      </Shell>
    );
  }

  if (!me && meError) {
    return (
      <Shell>
        <Notice
          tone="warn"
          title="Your Passport did not load"
          action={<button type="button" className="mf-btn mf-btn--ghost" onClick={() => reloadMe().catch(() => {})}>Try again</button>}
        >
          {meError.message}
        </Notice>
      </Shell>
    );
  }
  if (!me) return <Shell><Spinner label="Opening your Passport" /></Shell>;
  if (!me.profile.onboarded) return <Shell><Setup /></Shell>;
  return <Shell><Book /></Shell>;
}

function Setup() {
  const { setMe, me } = useMe();
  const [stage, setStage] = useState("");
  const [fields, setFields] = useState([]);
  const [city, setCity] = useState("");
  const [cvId, setCvId] = useState(me.cvs[0]?.id || "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const toggle = (id) =>
    setFields((list) => (list.includes(id) ? list.filter((f) => f !== id) : [...list, id].slice(0, 4)));

  const finish = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await api("profile", { body: { stage, fields, city, name: me.name || "" } });
      if (cvId) await api("import-cv", { body: { cvId } });
      setMe(await api("me"));
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  };

  return (
    <form className="mf-setup" onSubmit={finish}>
      <h1>Set up your Passport</h1>
      <p className="mf-panel__sub">About a minute. It decides which jobs come first for you.</p>

      <fieldset>
        <legend>Where are you right now?</legend>
        <div className="mf-choices">
          {STAGES.map((option) => (
            <button
              key={option.id}
              type="button"
              className={`mf-choice ${stage === option.id ? "is-on" : ""}`}
              aria-pressed={stage === option.id}
              onClick={() => setStage(option.id)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend>What work do you want? <small>Up to four</small></legend>
        <div className="mf-choices mf-choices--wrap">
          {FIELDS.filter((f) => f.id !== "other").map((field) => (
            <button
              key={field.id}
              type="button"
              className={`mf-pill ${fields.includes(field.id) ? "is-on" : ""}`}
              aria-pressed={fields.includes(field.id)}
              onClick={() => toggle(field.id)}
            >
              {field.label}
            </button>
          ))}
        </div>
      </fieldset>

      <label className="mf-field">
        <span>Which city are you in?</span>
        <input className="mf-input" value={city} maxLength={60} onChange={(e) => setCity(e.target.value)} placeholder="e.g. Enugu" />
      </label>

      {me.cvs.length > 0 ? (
        <label className="mf-field">
          <span>Read your skills from a CV</span>
          <select className="mf-input" value={cvId} onChange={(e) => setCvId(e.target.value)}>
            {me.cvs.map((cv) => <option key={cv.id} value={cv.id}>{cv.title}</option>)}
            <option value="">Skip for now</option>
          </select>
        </label>
      ) : (
        <p className="mf-panel__sub">No saved CV yet. You can add skills by hand next, or <Link className="mf-link" to="/dashboard/cv-builder">build a CV</Link>.</p>
      )}

      {error && <Notice tone="warn">{error}</Notice>}
      <button type="submit" className="mf-btn mf-btn--wide" disabled={busy || !stage}>
        {busy ? "Saving" : "Open my Passport"}
      </button>
    </form>
  );
}

function Book() {
  const { me, reloadMe } = useMe();
  const { logout } = useAuth();
  const [picking, setPicking] = useState(false);
  const [copied, setCopied] = useState(false);
  const [message, setMessage] = useState("");

  const held = useMemo(
    () =>
      Object.entries(me.passport.skills)
        .map(([id, entry]) => ({ id, ...entry }))
        .sort((a, b) => TIERS[b.tier].rank - TIERS[a.tier].rank),
    [me.passport]
  );
  const proven = held.filter((s) => TIERS[s.tier].proof);
  const unproven = held.filter((s) => !TIERS[s.tier].proof);
  const running = me.checks.find((c) => c.status === "open" && isFuture(c.expiresAt));
  const publicUrl = me.profile.publicId ? `${window.location.origin}/memotify/p/${me.profile.publicId}` : "";

  const save = async (patch) => {
    await api("profile", { body: patch });
    await reloadMe();
  };

  const copy = async () => {
    await navigator.clipboard.writeText(publicUrl);
    setCopied(true);
  };

  const addToCv = async () => {
    const cvId = me.profile.cvId || me.cvs[0]?.id;
    const { added } = await api("cv-proof", { body: { cvId } });
    setMessage(added ? `Added ${added} proof ${added === 1 ? "entry" : "entries"} to your CV's certifications.` : "Your CV already lists everything you've verified.");
  };

  return (
    <div className="mf-book">
      <header className="mf-book__cover">
        <p className="mf-eyebrow">Skill Passport</p>
        <h1>{me.name || me.email}</h1>
        <p>
          {STAGES.find((s) => s.id === me.profile.stage)?.label}
          {me.profile.city ? ` · ${me.profile.city}` : ""}
        </p>
        <div className="mf-book__tally">
          <div><b>{proven.length}</b><span>Proven</span></div>
          <div><b>{unproven.length}</b><span>To prove</span></div>
          <div><b>{me.tracked}</b><span>Tracked</span></div>
        </div>
      </header>

      {running && (
        <Notice
          tone="violet"
          title={`Your ${skillLabel(running.skill)} check is still running`}
          action={<Link className="mf-link" to={`/memotify/check/${running.skill}`}>Back to the check</Link>}
        />
      )}

      <section aria-labelledby="stamps">
        <h2 id="stamps" className="mf-h2">Proven</h2>
        {proven.length === 0 ? (
          <p className="mf-panel__sub">No stamps yet. Your first takes 15 minutes.</p>
        ) : (
          <div className="mf-stamps">
            {proven.map((skill) => (
              <Stamp
                key={skill.id}
                tier={skill.tier}
                skill={skill.id}
                line={`${skill.score != null ? `${skill.score}% · ` : ""}${skill.at ? longDate(skill.at) : skill.ref || skill.source}`}
              />
            ))}
          </div>
        )}
      </section>

      {me.nextProofs.length > 0 && (
        <section className="mf-panel" aria-labelledby="next">
          <h2 id="next">What would open the most doors</h2>
          <p className="mf-panel__sub">From today's board{me.profile.fields.length ? ", in your fields" : ""}.</p>
          <ul className="mf-doors">
            {me.nextProofs.map((item) => (
              <NextProof key={item.id} item={item} checks={me.checks} />
            ))}
          </ul>
        </section>
      )}

      <section className="mf-panel" aria-labelledby="claims">
        <div className="mf-panel__head">
          <h2 id="claims">Not proven yet</h2>
          <button type="button" className="mf-link" onClick={() => setPicking(true)}>
            <Plus size={15} weight="bold" /> Edit skills
          </button>
        </div>
        {unproven.length === 0 ? (
          <p className="mf-panel__sub">Add skills you have, so that jobs can see them.</p>
        ) : (
          <div className="mf-row__skills">
            {unproven.map((skill) => <SkillChip key={skill.id} id={skill.id} tier={skill.tier} />)}
          </div>
        )}
        <p className="mf-note">Employers see these marked as unproven, never as verified.</p>
      </section>

      <section className="mf-panel" aria-labelledby="share">
        <h2 id="share">Who can see this</h2>
        <label className="mf-switch">
          <input type="checkbox" checked={me.profile.openToWork} onChange={(e) => save({ openToWork: e.target.checked })} />
          <span>
            <b>Open to work</b>
            Verified employers can find your proven skills and invite you. They get your first name and initial only, until you apply.
          </span>
        </label>
        <label className="mf-switch">
          <input type="checkbox" checked={me.profile.passportPublic} onChange={(e) => save({ passportPublic: e.target.checked })} />
          <span>
            <b>Public link</b>
            A page showing only your proven skills, to put on a CV or LinkedIn.
          </span>
        </label>
        {me.profile.passportPublic && publicUrl && (
          <button type="button" className="mf-link" onClick={copy}><Copy size={16} /> {copied ? "Link copied" : "Copy your link"}</button>
        )}
        {proven.some((s) => s.tier === "verified") && me.cvs.length > 0 && (
          <button type="button" className="mf-link" onClick={addToCv}><FileText size={16} /> Add verified skills to my CV</button>
        )}
        {message && <p className="mf-panel__sub">{message}</p>}
      </section>

      <div className="mf-actions">
        <Link className="mf-link" to="/academy"><GraduationCap size={17} /> Academy</Link>
        <Link className="mf-link" to="/dashboard/cv-builder"><FileText size={17} /> CV Builder</Link>
        <button type="button" className="mf-link" onClick={logout}><SignOut size={17} /> Sign out</button>
      </div>

      {picking && <SkillPicker claimed={me.profile.claimed} onClose={() => setPicking(false)} onSave={(claimed) => save({ claimed })} />}
    </div>
  );
}

function NextProof({ item, checks }) {
  const record = checks.find((c) => c.skill === item.id);
  const lastSat = record?.status === "failed" ? record.finishedAt : null;
  const retryAt = lastSat ? lastSat + 7 * 86400000 : 0;
  return (
    <li>
      <div>
        <strong>{skillLabel(item.id)}</strong>
        <span>{item.jobs} open {item.jobs === 1 ? "job" : "jobs"} ask for it</span>
      </div>
      {isFuture(retryAt) ? (
        <span className="mf-doors__wait">Retake from {longDate(retryAt)}</span>
      ) : SKILLS[item.id]?.check ? (
        <Link className="mf-btn mf-btn--small" to={`/memotify/check/${item.id}`}><Timer size={15} /> Prove it</Link>
      ) : SKILLS[item.id]?.course ? (
        <Link className="mf-link" to={`/academy/enroll/${SKILLS[item.id].course}`}>Learn it</Link>
      ) : (
        <Link className="mf-link" to={`/memotify/jobs?skill=${item.id}`}>See jobs</Link>
      )}
    </li>
  );
}

function SkillPicker({ claimed, onClose, onSave }) {
  const [chosen, setChosen] = useState(claimed);
  const [busy, setBusy] = useState(false);
  const toggle = (id) => setChosen((list) => (list.includes(id) ? list.filter((s) => s !== id) : [...list, id]));

  return (
    <div className="mf-sheet" role="dialog" aria-modal="true" aria-label="Edit your skills">
      <div className="mf-sheet__in">
        <h2>Your skills</h2>
        {skillsByField().map((group) => (
          <div key={group.id} className="mf-picker">
            <h3>{group.label}</h3>
            <div className="mf-choices--wrap mf-choices">
              {group.skills.map((skill) => (
                <button
                  key={skill.id}
                  type="button"
                  className={`mf-pill ${chosen.includes(skill.id) ? "is-on" : ""}`}
                  aria-pressed={chosen.includes(skill.id)}
                  onClick={() => toggle(skill.id)}
                >
                  {skill.label}
                </button>
              ))}
            </div>
          </div>
        ))}
        <div className="mf-actions mf-sheet__foot">
          <button
            type="button"
            className="mf-btn"
            disabled={busy}
            onClick={async () => {
              setBusy(true);
              await onSave(chosen);
              onClose();
            }}
          >
            Save
          </button>
          <button type="button" className="mf-btn mf-btn--ghost" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}
