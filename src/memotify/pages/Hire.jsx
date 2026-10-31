import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import useSEO from "../../hooks/useSEO";
import Shell, { SiteFooter, useMe, useRequireSignIn } from "../Shell";
import { api, useLoad } from "../api";
import { Notice, SkillChip, Spinner, Stamp } from "../Bits";
import { ago, longDate } from "../format";
import { FIELDS, JOB_TYPES, LEVELS, PIPELINE, TIERS, WORK_MODES, skillLabel, skillsByField } from "../data/skills";
import {
  ArrowLeft, ArrowRight, Binoculars, Buildings, HandCoins, ListMagnifyingGlass, PencilSimple,
  Plus, SealCheck, ShieldCheck, UsersThree, Warning,
} from "../icons";

/** The recruiter's side: pitch when signed out, workspace once signed in. */
export default function Hire() {
  useSEO({
    title: "Hire Nigerian Graduates by Proven Skill — Memotify",
    description: "Post a role and see applicants ranked by skills they have proved.",
  });
  const { signedIn, authLoading } = useMe();
  if (authLoading) return <Shell><Spinner /></Shell>;
  return signedIn ? <Shell><Workspace /></Shell> : <Pitch />;
}

function Pitch() {
  const signIn = useRequireSignIn();
  return (
    <Shell wide>
      <section className="mf-pitch">
        <p className="mf-eyebrow">For employers</p>
        <h1>Read fewer CVs.<br />Meet better people.</h1>
        <p>
          Say which skills the role needs. Applicants arrive sorted by what they have proved in graded
          checks and Academy exams, with claims clearly marked as claims.
        </p>
        <button type="button" className="mf-btn" onClick={signIn}>
          Post your first role <ArrowRight size={18} weight="bold" />
        </button>
        <p className="mf-panel__sub">Free while we're in early access.</p>
      </section>
      <section className="mf-band">
        <div className="mf-band__in mf-three">
          <div>
            <ListMagnifyingGlass size={30} weight="duotone" />
            <h3>Ranked by evidence</h3>
            <p>See who passed, with what score, and how recently, before you open a single CV.</p>
          </div>
          <div>
            <Binoculars size={30} weight="duotone" />
            <h3>Find people first</h3>
            <p>Search candidates who are open to work by proven skill, and invite them to your role.</p>
          </div>
          <div>
            <HandCoins size={30} weight="duotone" />
            <h3>Rules that keep it clean</h3>
            <p>Every post states its pay. We review each new company by hand, so genuine employers stand out.</p>
          </div>
        </div>
      </section>
      <SiteFooter />
    </Shell>
  );
}

const STATUS = {
  live: { label: "Live", tone: "ok" },
  pending: { label: "In review", tone: "warn" },
  closed: { label: "Closed", tone: "plain" },
  rejected: { label: "Not approved", tone: "bad" },
};

function Workspace() {
  const { data, error, loading, reload } = useLoad("hire-home");
  const [editing, setEditing] = useState(false);

  if (loading && !data) return <Spinner label="Opening your workspace" />;
  if (error) return <Notice tone="warn" title="Your workspace did not load">{error.message}</Notice>;

  if (!data.company || editing) {
    return <CompanyForm company={data.company} onSaved={() => { setEditing(false); reload(); }} />;
  }

  const { company, jobs } = data;
  return (
    <div className="mf-work">
      <header className="mf-work__head">
        <div>
          <h1 className="mf-title">{company.name}</h1>
          <p className={`mf-status mf-status--${company.status}`}>
            {company.status === "verified" && <><SealCheck size={16} weight="fill" /> Verified employer</>}
            {company.status === "pending" && "We're reviewing your company. Your roles go live once we've approved it."}
            {company.status === "rejected" && "We couldn't verify this company. Update its details to try again."}
          </p>
        </div>
        <button type="button" className="mf-iconbtn" onClick={() => setEditing(true)} aria-label="Edit company">
          <PencilSimple size={20} />
        </button>
      </header>

      {!data.emailVerified && (
        <Notice tone="warn" title="Verify your email first">Check your inbox for the link, then sign in again.</Notice>
      )}

      <div className="mf-actions">
        <Link className="mf-btn" to="/memotify/hire/post"><Plus size={17} weight="bold" /> Post a role</Link>
        {company.status === "verified" && (
          <Link className="mf-btn mf-btn--ghost" to="/memotify/hire/talent"><UsersThree size={18} /> Find talent</Link>
        )}
      </div>

      <h2 className="mf-h2">Your roles</h2>
      {jobs.length === 0 ? (
        <Notice title="No roles yet">Your first post takes about three minutes.</Notice>
      ) : (
        <ul className="mf-tracklist">
          {jobs.map((job) => (
            <li className="mf-hirejob" key={job.id}>
              <Link to={`/memotify/hire/job/${job.id}`}>
                <h3>{job.title}</h3>
                <p>
                  <span className={`mf-dot mf-dot--${STATUS[job.status]?.tone}`} />
                  {STATUS[job.status]?.label} · {job.applicants || 0} {job.applicants === 1 ? "applicant" : "applicants"}
                </p>
                {(job.flags || []).length > 0 && job.status === "pending" && (
                  <p className="mf-track__flag"><Warning size={15} weight="fill" /> Held for a closer look: {job.flags[0].label.toLowerCase()}</p>
                )}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function CompanyForm({ company, onSaved }) {
  const [form, setForm] = useState({
    name: company?.name || "",
    website: company?.website || "https://",
    location: company?.location || "",
    size: company?.size || "",
    about: company?.about || "",
  });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await api("company", { body: form });
      onSaved();
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  };

  return (
    <form className="mf-form" onSubmit={submit}>
      <Buildings size={34} weight="duotone" />
      <h1 className="mf-title">{company ? "Your company" : "Tell us about your company"}</h1>
      <p className="mf-panel__sub">A person checks every new employer before any of its jobs go live. It's how candidates can trust what they see here.</p>
      <label className="mf-field"><span>Company name</span><input className="mf-input" required maxLength={80} value={form.name} onChange={set("name")} /></label>
      <label className="mf-field"><span>Website</span><input className="mf-input" type="url" required value={form.website} onChange={set("website")} /></label>
      <label className="mf-field"><span>Head office</span><input className="mf-input" maxLength={80} value={form.location} onChange={set("location")} placeholder="e.g. Yaba, Lagos" /></label>
      <label className="mf-field">
        <span>Team size</span>
        <select className="mf-input" value={form.size} onChange={set("size")}>
          <option value="">Choose</option>
          {["1–10", "11–50", "51–200", "201–1000", "1000+"].map((size) => <option key={size}>{size}</option>)}
        </select>
      </label>
      <label className="mf-field"><span>What does the company do?</span><textarea className="mf-input" rows={4} maxLength={800} value={form.about} onChange={set("about")} /></label>
      {error && <Notice tone="warn">{error}</Notice>}
      <button type="submit" className="mf-btn mf-btn--wide" disabled={busy}>{busy ? "Saving" : "Save company"}</button>
    </form>
  );
}

function SkillSelect({ title, chosen, other, onChange, max, open = false }) {
  return (
    <details className="mf-skillset" open={open}>
      <summary>{title} <b>{chosen.length ? chosen.map(skillLabel).join(", ") : "None chosen"}</b></summary>
      {skillsByField().map((group) => (
        <div key={group.id} className="mf-picker">
          <h3>{group.label}</h3>
          <div className="mf-choices mf-choices--wrap">
            {group.skills.filter((s) => !other.includes(s.id)).map((skill) => (
              <button
                key={skill.id}
                type="button"
                aria-pressed={chosen.includes(skill.id)}
                className={`mf-pill ${chosen.includes(skill.id) ? "is-on" : ""}`}
                onClick={() =>
                  onChange(chosen.includes(skill.id) ? chosen.filter((s) => s !== skill.id) : [...chosen, skill.id].slice(0, max))
                }
              >
                {skill.label}
              </button>
            ))}
          </div>
        </div>
      ))}
    </details>
  );
}

export function HirePost() {
  useSEO({ title: "Post a role — Memotify", description: "Post a role on Memotify." });
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "", type: "Full-time", mode: "remote", location: "", openTo: "nigeria", level: "graduate",
    field: "data", payMin: "", payMax: "", payCurrency: "NGN", text: "", question: "",
  });
  const [must, setMust] = useState([]);
  const [nice, setNice] = useState([]);
  const [requireProof, setRequireProof] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const { job } = await api("job-save", {
        body: { ...form, must, nice, requireProof, questions: form.question ? [form.question] : [] },
      });
      navigate(`/memotify/hire/job/${job.id}`);
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  };

  return (
    <Shell>
      <form className="mf-form" onSubmit={submit}>
        <Link className="mf-back" to="/memotify/hire"><ArrowLeft size={18} /> Workspace</Link>
        <h1 className="mf-title">Post a role</h1>

        <label className="mf-field"><span>Job title</span><input className="mf-input" required maxLength={100} value={form.title} onChange={set("title")} placeholder="e.g. Junior Data Analyst" /></label>

        <div className="mf-grid2">
          <label className="mf-field"><span>Type</span>
            <select className="mf-input" value={form.type} onChange={set("type")}>{JOB_TYPES.map((t) => <option key={t}>{t}</option>)}</select>
          </label>
          <label className="mf-field"><span>Work mode</span>
            <select className="mf-input" value={form.mode} onChange={set("mode")}>{WORK_MODES.map((m) => <option key={m.id} value={m.id}>{m.label}</option>)}</select>
          </label>
          <label className="mf-field"><span>Level</span>
            <select className="mf-input" value={form.level} onChange={set("level")}>{Object.entries(LEVELS).map(([id, label]) => <option key={id} value={id}>{label}</option>)}</select>
          </label>
          <label className="mf-field"><span>Field</span>
            <select className="mf-input" value={form.field} onChange={set("field")}>{FIELDS.map((f) => <option key={f.id} value={f.id}>{f.label}</option>)}</select>
          </label>
        </div>

        <label className="mf-field"><span>Location</span><input className="mf-input" maxLength={80} value={form.location} onChange={set("location")} placeholder="e.g. Lagos, Nigeria" /></label>
        <label className="mf-field"><span>Who can apply?</span>
          <select className="mf-input" value={form.openTo} onChange={set("openTo")}>
            <option value="nigeria">People in Nigeria</option>
            <option value="africa">People across Africa</option>
            <option value="worldwide">Anyone, worldwide</option>
          </select>
        </label>

        <fieldset className="mf-pay">
          <legend>Monthly pay <small>Required. Posts without pay aren't listed.</small></legend>
          <select className="mf-input" value={form.payCurrency} onChange={set("payCurrency")} aria-label="Currency">
            <option value="NGN">₦</option>
            <option value="USD">$</option>
          </select>
          <input className="mf-input" type="number" min="1" required value={form.payMin} onChange={set("payMin")} placeholder="From" aria-label="Pay from" />
          <input className="mf-input" type="number" min="1" value={form.payMax} onChange={set("payMax")} placeholder="To" aria-label="Pay to" />
        </fieldset>

        <SkillSelect title="Required skills" chosen={must} other={nice} onChange={setMust} max={6} open />
        <SkillSelect title="Nice to have" chosen={nice} other={must} onChange={setNice} max={4} />

        <label className="mf-switch">
          <input type="checkbox" checked={requireProof} onChange={(e) => setRequireProof(e.target.checked)} />
          <span><b>Require proof to apply</b>Only people verified or certified in every required skill can apply. Expect fewer, stronger applicants.</span>
        </label>

        <label className="mf-field"><span>About the role</span><textarea className="mf-input" rows={8} required minLength={80} maxLength={6000} value={form.text} onChange={set("text")} /></label>
        <label className="mf-field"><span>One screening question (optional)</span><input className="mf-input" maxLength={200} value={form.question} onChange={set("question")} /></label>

        <Notice tone="violet">Asking candidates for money of any kind gets a company removed from Memotify.</Notice>
        {error && <Notice tone="warn">{error}</Notice>}
        <button type="submit" className="mf-btn mf-btn--wide" disabled={busy}>{busy ? "Publishing" : "Publish role"}</button>
      </form>
    </Shell>
  );
}

export function HireJob() {
  const { id } = useParams();
  useSEO({ title: "Applicants — Memotify", description: "Applicants for your role." });
  const { data, error, loading, reload } = useLoad("applicants", { jobId: id });
  const [open, setOpen] = useState(null);
  const [stage, setStage] = useState("all");

  const close = async () => {
    await api("job-close", { body: { jobId: id } });
    reload();
  };

  if (loading && !data) return <Shell><Spinner label="Loading applicants" /></Shell>;
  if (error) return <Shell><Notice tone="warn" title="This job did not load">{error.message}</Notice></Shell>;

  const { job, applicants } = data;
  const shown = stage === "all" ? applicants : applicants.filter((a) => a.stage === stage);

  return (
    <Shell>
      <div className="mf-work">
        <Link className="mf-back" to="/memotify/hire"><ArrowLeft size={18} /> Workspace</Link>
        <h1 className="mf-title">{job.title}</h1>
        <p className="mf-panel__sub">
          {STATUS[job.status]?.label} · posted {ago(job.postedAt)} · needs {job.must.map(skillLabel).join(", ")}
        </p>
        {job.status === "pending" && <Notice tone="warn" title="In review">The role goes live when we've checked it.</Notice>}
        {job.reviewNote && <Notice tone="warn" title="Note from our reviewers">{job.reviewNote}</Notice>}

        <div className="mf-tabsbar" role="tablist">
          <button type="button" role="tab" aria-selected={stage === "all"} className={stage === "all" ? "is-on" : ""} onClick={() => setStage("all")}>
            All <b>{applicants.length}</b>
          </button>
          {PIPELINE.map((step) => (
            <button key={step.id} type="button" role="tab" aria-selected={stage === step.id} className={stage === step.id ? "is-on" : ""} onClick={() => setStage(step.id)}>
              {step.label} <b>{applicants.filter((a) => a.stage === step.id).length}</b>
            </button>
          ))}
        </div>

        {shown.length === 0 ? (
          <Notice title="Nobody here yet">Strong candidates often arrive through talent search. Try inviting a few.</Notice>
        ) : (
          <ul className="mf-tracklist">
            {shown.map((person) => (
              <li key={person.id} className="mf-applicant">
                <button type="button" onClick={() => setOpen(person.id)}>
                  <div className="mf-applicant__top">
                    <h3>{person.name}</h3>
                    <span className="mf-applicant__score">{person.proven}/{person.needed} proven</span>
                  </div>
                  <p>{person.city || "Location not given"} · applied {ago(person.appliedAt)}</p>
                  <div className="mf-row__skills">
                    {Object.entries(person.proof).map(([skill, held]) => <SkillChip key={skill} id={skill} tier={held.tier} />)}
                    {Object.keys(person.proof).length === 0 && <span className="mf-row__more">No proof yet</span>}
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}

        {job.status === "live" && (
          <button type="button" className="mf-link" onClick={close}>Close this role</button>
        )}
      </div>
      {open && <Applicant id={open} onClose={() => setOpen(null)} onMoved={reload} />}
    </Shell>
  );
}

function Applicant({ id, onClose, onMoved }) {
  const { data, error, loading, reload } = useLoad("applicant", { id });
  const [busy, setBusy] = useState(false);

  const move = async (stage) => {
    setBusy(true);
    await api("applicant-move", { body: { id, stage } });
    reload();
    onMoved();
    setBusy(false);
  };

  const app = data?.application;
  return (
    <div className="mf-sheet" role="dialog" aria-modal="true" aria-label="Applicant">
      <div className="mf-sheet__in">
        {loading && !data && <Spinner />}
        {error && <Notice tone="warn">{error.message}</Notice>}
        {app && (
          <>
            <h2>{app.name}</h2>
            <p className="mf-panel__sub">
              <a className="mf-link" href={`mailto:${app.email}`}>{app.email}</a>
              {app.phone ? ` · ${app.phone}` : ""}
            </p>

            <div className="mf-stamps">
              {Object.entries(app.proof).map(([skill, held]) => (
                <Stamp key={skill} tier={held.tier} skill={skill} line={`${held.score != null ? `${held.score}% · ` : ""}${held.at ? longDate(held.at) : held.ref || ""}`} />
              ))}
            </div>
            {app.claimed?.length > 0 && (
              <p className="mf-panel__sub"><b>{TIERS.claimed.label}, not proven:</b> {app.claimed.map(skillLabel).join(", ")}</p>
            )}

            {app.note && <><h3 className="mf-h3">Their note</h3><p className="mf-pre">{app.note}</p></>}
            {app.answers?.map((entry) => (
              <div key={entry.question}><h3 className="mf-h3">{entry.question}</h3><p className="mf-pre">{entry.answer}</p></div>
            ))}

            <h3 className="mf-h3">CV</h3>
            <p className="mf-pre mf-pre--cv">{app.cvText}</p>

            <div className="mf-stagepick" role="group" aria-label="Move applicant">
              {PIPELINE.map((step) => (
                <button key={step.id} type="button" className={`mf-pill ${app.stage === step.id ? "is-on" : ""}`} disabled={busy} onClick={() => move(step.id)}>
                  {step.label}
                </button>
              ))}
            </div>
            <p className="mf-note"><ShieldCheck size={14} weight="fill" /> The candidate sees each move in their tracker.</p>
          </>
        )}
        <div className="mf-actions mf-sheet__foot">
          <button type="button" className="mf-btn mf-btn--ghost" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

export function HireTalent() {
  useSEO({ title: "Find talent — Memotify", description: "Find candidates by proven skill." });
  const [skills, setSkills] = useState([]);
  const { data, error, loading } = useLoad("talent", { skills: skills.join(",") });
  const home = useLoad("hire-home");
  const [sent, setSent] = useState({});
  const live = home.data?.jobs?.filter((job) => job.status === "live") || [];
  const [jobId, setJobId] = useState("");
  const target = jobId || live[0]?.id;

  const invite = async (handle) => {
    await api("invite", { body: { handle, jobId: target } });
    setSent({ ...sent, [handle]: true });
  };

  return (
    <Shell>
      <div className="mf-work">
        <Link className="mf-back" to="/memotify/hire"><ArrowLeft size={18} /> Workspace</Link>
        <h1 className="mf-title">Find talent</h1>
        <p className="mf-panel__sub">People open to work, shown only by what they have proved. You learn their full name when they apply.</p>
        <SkillSelect title="Filter by skill" chosen={skills} other={[]} onChange={setSkills} max={5} />

        {live.length > 1 && (
          <label className="mf-field"><span>Invite to</span>
            <select className="mf-input" value={target} onChange={(e) => setJobId(e.target.value)}>
              {live.map((job) => <option key={job.id} value={job.id}>{job.title}</option>)}
            </select>
          </label>
        )}

        {loading && !data && <Spinner label="Searching" />}
        {error && <Notice tone="warn">{error.message}</Notice>}
        {data?.people?.length === 0 && <Notice title="Nobody matches yet">Try fewer skills. This list grows as people earn stamps.</Notice>}
        <ul className="mf-tracklist">
          {data?.people?.map((person) => (
            <li key={person.handle} className="mf-applicant mf-applicant--static">
              <div className="mf-applicant__top">
                <h3>{person.name}</h3>
                {sent[person.handle] ? (
                  <span className="mf-applicant__score">Invited</span>
                ) : (
                  <button type="button" className="mf-btn mf-btn--small" disabled={!target} onClick={() => invite(person.handle)}>Invite</button>
                )}
              </div>
              <p>{person.city || "Nigeria"}</p>
              <div className="mf-row__skills">
                {Object.entries(person.proof).map(([skill, held]) => <SkillChip key={skill} id={skill} tier={held.tier} />)}
              </div>
            </li>
          ))}
        </ul>
        {!target && home.data && <Notice>Post a live role first, then you can invite people to it.</Notice>}
      </div>
    </Shell>
  );
}
