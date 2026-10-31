import { useState } from "react";
import { Link } from "react-router-dom";
import useSEO from "../../hooks/useSEO";
import Shell, { useMe, useRequireSignIn } from "../Shell";
import { api, useLoad } from "../api";
import { Monogram, Notice, Spinner } from "../Bits";
import { ago } from "../format";
import { TRACK_STAGES } from "../data/skills";
import { ArrowSquareOut, Kanban, Lightning, PaperPlaneTilt, UserSound } from "../icons";

const FOLLOW_UP_MS = 7 * 86400000;

/**
 * Every application in one place. Two things separate this from a spreadsheet:
 * employers on Memotify move your application themselves, and a role that has
 * gone quiet for a week tells you it is time to follow up.
 */
export default function Tracker() {
  useSEO({ title: "Your applications — Memotify", description: "Track your job applications." });
  const { signedIn, authLoading } = useMe();
  const signIn = useRequireSignIn();

  if (authLoading) return <Shell><Spinner /></Shell>;
  if (!signedIn) {
    return (
      <Shell>
        <section className="mf-intro">
          <Kanban size={40} weight="duotone" />
          <h1>Stop losing track of where you applied</h1>
          <p>Save roles, log applications, and see which ones need a follow-up.</p>
          <button type="button" className="mf-btn" onClick={signIn}>Sign in to start</button>
        </section>
      </Shell>
    );
  }
  return <Shell><Board /></Shell>;
}

function Board() {
  const { data, error, loading, reload } = useLoad("tracker");
  const [tab, setTab] = useState("saved");

  if (loading && !data) return <Spinner label="Loading your tracker" />;
  if (error) return <Notice tone="warn" title="Your tracker did not load">{error.message}</Notice>;

  const items = data.items;
  const inStage = items.filter((item) => item.status === tab);
  const count = (id) => items.filter((item) => item.status === id).length;

  return (
    <div className="mf-tracker">
      <h1 className="mf-title">Tracker</h1>
      <div className="mf-tabsbar" role="tablist">
        {TRACK_STAGES.map((stage) => (
          <button
            key={stage.id}
            type="button"
            role="tab"
            aria-selected={tab === stage.id}
            className={tab === stage.id ? "is-on" : ""}
            onClick={() => setTab(stage.id)}
          >
            {stage.label} <b>{count(stage.id)}</b>
          </button>
        ))}
      </div>

      {inStage.length === 0 ? (
        <Notice title={items.length ? `Nothing in ${TRACK_STAGES.find((s) => s.id === tab).label.toLowerCase()}` : "Nothing here yet"}
          action={<Link className="mf-link" to="/memotify/jobs">Find a job</Link>}>
          {items.length ? null : "Save a role from the board and it will appear here."}
        </Notice>
      ) : (
        <ul className="mf-tracklist">
          {inStage.map((item) => <Item key={item.jobId} item={item} onChange={reload} />)}
        </ul>
      )}
    </div>
  );
}

function Item({ item, onChange }) {
  const [busy, setBusy] = useState(false);
  const [now] = useState(() => Date.now());
  const quiet = item.status === "applied" && now - item.updatedAt > FOLLOW_UP_MS;

  const move = async (status) => {
    setBusy(true);
    await api("track", { body: { jobId: item.jobId, status } });
    await onChange();
    setBusy(false);
  };

  return (
    <li className="mf-track">
      <Monogram name={item.company} />
      <div className="mf-track__body">
        <Link to={`/memotify/jobs/${encodeURIComponent(item.jobId)}`}><h3>{item.title}</h3></Link>
        <p>{item.company}</p>
        {item.invited && (
          <p className="mf-track__flag"><PaperPlaneTilt size={15} weight="fill" /> {item.company} invited you to apply</p>
        )}
        {item.managed && <p className="mf-track__stage">{item.stageLabel}. Updated by the employer {ago(item.updatedAt)}.</p>}
        {!item.managed && <p className="mf-track__when">Updated {ago(item.updatedAt)}</p>}
        {quiet && !item.managed && (
          <p className="mf-track__flag"><Lightning size={15} weight="fill" /> A week of silence. A short follow-up is fair now.</p>
        )}
        {["applied", "interview", "offer"].includes(item.status) && (
          <Link className="mf-link mf-track__practise" to={`/memotify/interview/${encodeURIComponent(item.jobId)}`}>
            <UserSound size={16} weight="fill" /> Practise the interview
          </Link>
        )}
        {!item.managed && (
          <div className="mf-track__do">
            <select
              className="mf-input mf-input--small"
              value={item.status}
              disabled={busy}
              onChange={(e) => move(e.target.value)}
              aria-label="Stage"
            >
              {TRACK_STAGES.map((stage) => <option key={stage.id} value={stage.id}>{stage.label}</option>)}
            </select>
            {item.url && (
              <a className="mf-link" href={item.url} target="_blank" rel="noopener noreferrer">Open <ArrowSquareOut size={14} /></a>
            )}
            <button type="button" className="mf-link" disabled={busy} onClick={() => move("remove")}>Remove</button>
          </div>
        )}
      </div>
    </li>
  );
}
