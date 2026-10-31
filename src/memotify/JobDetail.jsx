import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useSEO from "../hooks/useSEO";
import { track } from "../utils/analytics";
import { useMe, useRequireSignIn } from "./Shell";
import { api, useLoad } from "./api";
import { CheckLink, Monogram, Notice, SkillChip, Spinner, Verdict } from "./Bits";
import { ago, courseLink, payLine } from "./format";
import JobRow from "./JobRow";
import { LEVELS, REACH, SKILLS, TIERS, VERDICTS, skillLabel } from "./data/skills";
import {
  ArrowLeft, ArrowSquareOut, BookmarkSimple, CheckCircle, FileText, Flag, PaperPlaneTilt,
  SealCheck, Warning, WhatsappLogo,
} from "./icons";

function Checked({ ok = true, children }) {
  const Icon = ok ? CheckCircle : Warning;
  return (
    <li className={ok ? "" : "is-warn"}>
      <Icon size={19} weight="fill" />
      <span>{children}</span>
    </li>
  );
}

/** Schema.org data for posts made here. Feed jobs belong to their own sources. */
function jobPosting(job) {
  if (job?.kind !== "native") return undefined;
  return {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description: job.text,
    datePosted: job.postedAt,
    hiringOrganization: { "@type": "Organization", name: job.company },
    ...(job.remote ? { jobLocationType: "TELECOMMUTE", applicantLocationRequirements: { "@type": "Country", name: "Nigeria" } } : {}),
    jobLocation: { "@type": "Place", address: { "@type": "PostalAddress", addressLocality: job.location, addressCountry: "NG" } },
  };
}

export default function JobDetail({ id, onBack }) {
  const { signedIn, me, reloadMe } = useMe();
  const signIn = useRequireSignIn();
  const { data, error, loading, reload } = useLoad("job", { id }, [id, signedIn, me?.passport?.computedAt]);
  const [askApplied, setAskApplied] = useState(false);
  const [applying, setApplying] = useState(false);
  const [saving, setSaving] = useState(false);
  const [reported, setReported] = useState(false);
  const job = data?.job;

  useSEO({
    title: job ? `${job.title} at ${job.company} — Memotify` : "Job — Memotify",
    description: job ? `${job.title} at ${job.company}. Checked by Memotify.` : "",
    structuredData: jobPosting(job),
  });

  if (loading && !data) return <Spinner label="Opening the job" />;
  if (error || !job) {
    return (
      <div className="mf-job">
        <button type="button" className="mf-back" onClick={onBack}><ArrowLeft size={18} /> All jobs</button>
        <Notice title="This job has closed">
          It is no longer on the employer's board, so we took it off ours. That is the system working.
        </Notice>
      </div>
    );
  }

  const trackStatus = data.tracked?.status;
  const native = job.kind === "native";
  const external = job.url;
  const closed = !data.open;

  const setTrack = async (status) => {
    if (!signedIn) return signIn();
    setSaving(true);
    try {
      await api("track", { body: { jobId: job.id, status } });
      await reload();
      setAskApplied(false);
    } finally {
      setSaving(false);
    }
    return undefined;
  };

  const report = async () => {
    if (!signedIn) return signIn();
    await api("report", { body: { jobId: job.id, reason: "Reported from the job page" } });
    setReported(true);
    return undefined;
  };

  const shareText = encodeURIComponent(
    `${job.title} at ${job.company}, checked on Memotify: ${window.location.origin}/memotify/jobs/${encodeURIComponent(job.id)}`
  );

  return (
    <article className="mf-job">
      <button type="button" className="mf-back" onClick={onBack}><ArrowLeft size={18} /> All jobs</button>

      <header className="mf-job__head">
        <Monogram name={job.company} />
        <div>
          <h1>{job.title}</h1>
          <p>
            {job.company}
            {native && <SealCheck size={17} weight="fill" aria-label="Verified employer" />}
            {job.location ? ` · ${job.location}` : ""}
          </p>
        </div>
      </header>

      <dl className="mf-job__facts">
        <div><dt>Level</dt><dd>{LEVELS[job.level]}</dd></div>
        {job.type && <div><dt>Type</dt><dd>{job.type}</dd></div>}
        {job.pay?.text && <div className="is-full"><dt>Pay</dt><dd>{payLine(job.pay)}</dd></div>}
        <div><dt>Posted</dt><dd>{job.postedAt ? ago(job.postedAt) : "Not given"}</dd></div>
      </dl>

      {closed && <Notice tone="warn" title="This role has closed">The employer is no longer taking applications.</Notice>}

      <section className="mf-panel mf-ticket" aria-labelledby="checked">
        <h2 id="checked">What we checked</h2>
        <ul className="mf-checks">
          <Checked ok={job.reach !== "region"}>
            <b>{REACH[job.reach].label}.</b> {REACH[job.reach].note}
          </Checked>
          {native ? (
            <Checked>Posted here by an employer we verified.</Checked>
          ) : job.direct ? (
            <Checked>Live on {job.company}'s own hiring system at our last check ({ago(data.meta?.checkedAt)}).</Checked>
          ) : (
            <Checked ok={false}>Found on {job.source}. We can't confirm it from the employer's own system, so check before you spend time on it.</Checked>
          )}
          {(job.flags || []).length > 0 ? (
            job.flags.map((flag) => <Checked key={flag.id} ok={false}>{flag.label}. Take care with this one.</Checked>)
          ) : (
            <Checked>No request for money or other scam signs in the advert.</Checked>
          )}
        </ul>
        <p className="mf-note">Never pay to apply for a job, and never share your BVN, card or OTP.</p>
      </section>

      <Fit job={job} fit={data.fit} signedIn={signedIn} onSignIn={signIn} />

      {!closed && <CvReady job={job} me={me} signedIn={signedIn} />}

      <section className="mf-prose" aria-labelledby="role">
        <h2 id="role">About the role</h2>
        {job.text ? <p>{job.text}</p> : <p>The full advert is on the employer's page.</p>}
        {!native && job.text?.length >= 5900 && (
          <a href={job.url} target="_blank" rel="noopener noreferrer" className="mf-link">Read the rest on the employer's site</a>
        )}
      </section>

      <div className="mf-job__minor">
        <a href={`https://wa.me/?text=${shareText}`} target="_blank" rel="noopener noreferrer">
          <WhatsappLogo size={18} weight="fill" /> Share on WhatsApp
        </a>
        <button type="button" onClick={report} disabled={reported}>
          <Flag size={17} /> {reported ? "Reported. Thank you." : "Report this job"}
        </button>
      </div>

      {data.similar?.length > 0 && (
        <section aria-labelledby="similar">
          <h2 id="similar" className="mf-h2">Similar roles</h2>
          <div className="mf-list">
            {data.similar.map((other) => <JobRow key={other.id} job={other} />)}
          </div>
        </section>
      )}

      {!closed && (
        <div className="mf-applybar">
          {askApplied ? (
            <div className="mf-applybar__ask">
              <span>Did you send your application?</span>
              <button type="button" className="mf-btn" disabled={saving} onClick={() => setTrack("applied")}>Yes, track it</button>
              <button type="button" className="mf-btn mf-btn--ghost" onClick={() => setAskApplied(false)}>Not yet</button>
            </div>
          ) : (
            <>
              <button
                type="button"
                className={`mf-iconbtn ${trackStatus ? "is-on" : ""}`}
                onClick={() => setTrack(trackStatus ? "remove" : "saved")}
                disabled={saving || data.tracked?.managed}
                aria-label={trackStatus ? "Remove from tracker" : "Save to tracker"}
              >
                <BookmarkSimple size={22} weight={trackStatus ? "fill" : "regular"} />
              </button>
              {native && !job.applyUrl ? (
                data.application ? (
                  <Link className="mf-btn mf-btn--grow" to="/memotify/tracker">Applied. See your tracker</Link>
                ) : (
                  <button
                    type="button"
                    className="mf-btn mf-btn--grow"
                    onClick={() => (signedIn ? setApplying(true) : signIn())}
                  >
                    <PaperPlaneTilt size={18} weight="fill" /> Apply with Passport
                  </button>
                )
              ) : (
                <a
                  className="mf-btn mf-btn--grow"
                  href={external}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => {
                    track("memotify_apply_click", { source: job.source, verdict: data.fit?.verdict || "anon" });
                    if (signedIn && trackStatus !== "applied") setAskApplied(true);
                  }}
                >
                  Apply on employer's site <ArrowSquareOut size={18} />
                </a>
              )}
            </>
          )}
        </div>
      )}

      {applying && (
        <ApplySheet
          job={job}
          fit={data.fit}
          me={me}
          onClose={() => setApplying(false)}
          onDone={async () => {
            setApplying(false);
            await Promise.all([reload(), reloadMe()]);
          }}
        />
      )}
    </article>
  );
}

/** One line per skill: where you stand, and the next step if there is one. */
function Fit({ job, fit, signedIn, onSignIn }) {
  const skills = fit?.skills || [
    ...(job.must || []).map((id) => ({ id, tier: "none", must: true })),
    ...(job.nice || []).map((id) => ({ id, tier: "none", must: false })),
  ];

  return (
    <section className="mf-panel" aria-labelledby="fit">
      <div className="mf-panel__head">
        <h2 id="fit">Where you stand</h2>
        {fit && <Verdict verdict={fit.verdict} />}
      </div>
      {fit && <p className="mf-panel__sub">{VERDICTS[fit.verdict].hint}</p>}
      {!signedIn && (
        <p className="mf-panel__sub">
          <button type="button" className="mf-link" onClick={onSignIn}>Sign in</button> to compare this role with your skills.
        </p>
      )}
      {job.requireProof && (
        <Notice tone="violet">This employer asks for proof of every required skill before you can apply.</Notice>
      )}
      {skills.length === 0 ? (
        <p className="mf-panel__sub">The advert names no specific tools. Read it closely to judge the fit.</p>
      ) : (
        <ul className="mf-fit">
          {skills.map((skill) => {
            const proven = TIERS[skill.tier].proof;
            const learn = courseLink(skill.id);
            return (
              <li key={skill.id}>
                <div className="mf-fit__top">
                  <SkillChip id={skill.id} tier={skill.tier} />
                  <span className="mf-fit__tier">
                    {skill.tier === "none" ? (skill.must ? "Required" : "Nice to have") : TIERS[skill.tier].label}
                  </span>
                </div>
                {signedIn && !proven && (
                  <div className="mf-fit__next">
                    <CheckLink id={skill.id} />
                    {learn && skill.tier === "none" && <Link className="mf-link" to={learn}>Learn it in the Academy</Link>}
                    {!SKILLS[skill.id]?.check && !learn && <span>No check for this one yet. Show it in your CV.</span>}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

/** Which of this job's skills a CV mentions, with a route to fix the rest. */
function CvReady({ job, me, signedIn }) {
  const navigate = useNavigate();
  const [cvId, setCvId] = useState("");
  const [fit, setFit] = useState(null);
  const chosen = cvId || me?.profile?.cvId || me?.cvs?.[0]?.id || "";

  useEffect(() => {
    if (!chosen) return undefined;
    let alive = true;
    api("cv-fit", { body: { jobId: job.id, cvId: chosen } })
      .then((result) => alive && setFit(result))
      .catch(() => alive && setFit(null));
    return () => {
      alive = false;
    };
  }, [chosen, job.id]);

  if (!signedIn) return null;

  if (!me?.cvs?.length) {
    return (
      <section className="mf-panel">
        <h2>Get your CV ready</h2>
        <p className="mf-panel__sub">You have no saved CV yet. Most Nigerian employers still screen on one.</p>
        <Link className="mf-link" to="/dashboard/cv-builder"><FileText size={17} /> Build one in the CV Builder</Link>
      </section>
    );
  }

  const checkAts = () => {
    try {
      localStorage.setItem("ats_last_jd", `${job.title} at ${job.company}\n\n${fit?.jobText || job.text || ""}`.slice(0, 6000));
    } catch {
      /* The checker still opens; the job text just has to be pasted. */
    }
    navigate("/ats-check");
  };

  return (
    <section className="mf-panel" aria-labelledby="cvready">
      <h2 id="cvready">Get your CV ready</h2>
      {me.cvs.length > 1 && (
        <select className="mf-input" value={chosen} onChange={(e) => setCvId(e.target.value)} aria-label="Choose a CV">
          {me.cvs.map((cv) => <option key={cv.id} value={cv.id}>{cv.title}</option>)}
        </select>
      )}
      {fit && (
        fit.missing.length > 0 ? (
          <p className="mf-panel__sub">
            Your CV doesn't mention <b>{fit.missing.map(skillLabel).join(", ")}</b>. If you have the skill, add the
            word: screening software matches it literally.
          </p>
        ) : (
          <p className="mf-panel__sub">Your CV names every skill this role lists.</p>
        )
      )}
      <div className="mf-actions">
        <Link className="mf-link" to={`/cv/${chosen}`}>Edit this CV</Link>
        <button type="button" className="mf-link" onClick={checkAts}>Run an ATS check against this job</button>
      </div>
    </section>
  );
}

function ApplySheet({ job, fit, me, onClose, onDone }) {
  const [cvId, setCvId] = useState(me?.profile?.cvId || me?.cvs?.[0]?.id || "");
  const [note, setNote] = useState("");
  const [answers, setAnswers] = useState([]);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const blocked = job.requireProof && fit && fit.proven < fit.needed;

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await api("apply", { body: { jobId: job.id, cvId, note, answers } });
      await onDone();
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  };

  return (
    <div className="mf-sheet" role="dialog" aria-modal="true" aria-label={`Apply for ${job.title}`}>
      <form className="mf-sheet__in" onSubmit={submit}>
        <h2>Apply to {job.company}</h2>
        <p className="mf-panel__sub">
          They'll see your CV, your note and your proven skills. Anything you've only claimed is marked as claimed.
        </p>

        {blocked && (
          <Notice tone="warn" title="Proof needed first">
            Pass the checks for this role's required skills, then come back.
          </Notice>
        )}

        {me?.cvs?.length ? (
          <label className="mf-field">
            <span>CV</span>
            <select className="mf-input" value={cvId} onChange={(e) => setCvId(e.target.value)}>
              {me.cvs.map((cv) => <option key={cv.id} value={cv.id}>{cv.title}</option>)}
            </select>
          </label>
        ) : (
          <Notice tone="warn" title="You need a saved CV">
            <Link className="mf-link" to="/dashboard/cv-builder">Build one in the CV Builder</Link>
          </Notice>
        )}

        {(job.questions || []).map((question, i) => (
          <label className="mf-field" key={question}>
            <span>{question}</span>
            <textarea
              className="mf-input"
              rows={3}
              maxLength={800}
              required
              value={answers[i] || ""}
              onChange={(e) => {
                const next = [...answers];
                next[i] = e.target.value;
                setAnswers(next);
              }}
            />
          </label>
        ))}

        <label className="mf-field">
          <span>A short note (optional)</span>
          <textarea className="mf-input" rows={4} maxLength={1200} value={note} onChange={(e) => setNote(e.target.value)} />
        </label>

        {error && <Notice tone="warn">{error}</Notice>}

        <div className="mf-actions">
          <button type="submit" className="mf-btn" disabled={busy || blocked || !cvId}>
            {busy ? "Sending" : "Send application"}
          </button>
          <button type="button" className="mf-btn mf-btn--ghost" onClick={onClose}>Cancel</button>
        </div>
      </form>
    </div>
  );
}
