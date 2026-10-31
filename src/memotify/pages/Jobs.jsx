import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import useSEO from "../../hooks/useSEO";
import Shell, { useMe } from "../Shell";
import { api, useLoad } from "../api";
import { Notice, Spinner } from "../Bits";
import { ago } from "../format";
import JobRow from "../JobRow";
import JobDetail from "../JobDetail";
import { FIELDS, VERDICTS, skillLabel } from "../data/skills";
import { ArrowsClockwise, MagnifyingGlass, ShieldCheck, X } from "../icons";

const WHERE = [
  { id: "any", label: "Everywhere" },
  { id: "remote", label: "Remote" },
  { id: "nigeria", label: "In Nigeria" },
];

const LAST_VISIT = "memotifyLastVisit";

function readVisit() {
  try {
    return Number(localStorage.getItem(LAST_VISIT)) || 0;
  } catch {
    return 0;
  }
}

/**
 * The board. One component for the list and the open job: on a phone the job
 * replaces the list, and from 1024px they sit side by side. The list stays
 * mounted either way, so coming back keeps your place.
 */
export default function Jobs() {
  useSEO({
    title: "Jobs Open to Nigerians, Remote and Local — Memotify",
    description: "Current graduate, remote and Nigerian roles, each checked for location limits, freshness and scam signs.",
  });

  const { signedIn } = useMe();
  const { id } = useParams();
  const navigate = useNavigate();
  const [search, setSearch] = useSearchParams();
  const [draft, setDraft] = useState(search.get("q") || "");
  const [page, setPage] = useState(1);
  const [extra, setExtra] = useState([]);
  const [firstRunDone, setFirstRunDone] = useState(false);
  const [since] = useState(readVisit);
  const asked = useRef(false);

  const filters = {
    q: search.get("q") || "",
    where: search.get("where") || "any",
    level: search.get("level") || "any",
    field: search.get("field") || "",
    skill: search.get("skill") || "",
    verdict: search.get("verdict") || "",
    sort: search.get("sort") || "",
  };

  const { data, error, loading, reload } = useLoad("feed", { ...filters, since }, [filters, signedIn]);

  const setFilter = (key, value) => {
    setPage(1);
    setExtra([]);
    const next = new URLSearchParams(search);
    if (value && value !== "any") next.set(key, value);
    else next.delete(key);
    setSearch(next, { replace: true });
  };

  useEffect(() => {
    if (!data?.meta) return;
    try {
      localStorage.setItem(LAST_VISIT, String(Date.now()));
    } catch {
      /* A remembered visit is a convenience. */
    }
    if (!data.meta.stale || asked.current) return;
    asked.current = true;
    api("refresh", { body: {} })
      .then((result) => result.refreshed && reload())
      .catch(() => {})
      .finally(() => setFirstRunDone(true));
  }, [data, reload]);

  // Only ever true on a brand-new board with nothing to show yet.
  const filling = Boolean(data?.meta) && !data.meta.count && !firstRunDone;

  const more = async () => {
    const next = page + 1;
    const result = await api("feed", { params: { ...filters, page: next } });
    setExtra((list) => [...list, ...result.jobs]);
    setPage(next);
  };

  const jobs = [...(data?.jobs || []), ...extra];
  const query = search.toString() ? `?${search}` : "";
  const skillFilter = filters.skill;

  return (
    <Shell wide>
      <div className={`mf-board ${id ? "has-job" : ""}`}>
        <section className="mf-board__list" aria-label="Jobs">
          <form
            className="mf-search"
            role="search"
            onSubmit={(e) => {
              e.preventDefault();
              setFilter("q", draft.trim());
            }}
          >
            <MagnifyingGlass size={19} />
            <input
              type="search"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Role, skill or company"
              aria-label="Search jobs"
            />
          </form>

          <div className="mf-filters">
            {WHERE.map((option) => (
              <button
                key={option.id}
                type="button"
                className={`mf-pill ${filters.where === option.id ? "is-on" : ""}`}
                onClick={() => setFilter("where", option.id)}
              >
                {option.label}
              </button>
            ))}
            <button
              type="button"
              className={`mf-pill ${filters.level === "graduate" ? "is-on" : ""}`}
              onClick={() => setFilter("level", filters.level === "graduate" ? "any" : "graduate")}
            >
              Graduate friendly
            </button>
            <select
              className="mf-pill mf-pill--select"
              value={filters.field}
              onChange={(e) => setFilter("field", e.target.value)}
              aria-label="Field"
            >
              <option value="">All fields</option>
              {FIELDS.map((field) => (
                <option key={field.id} value={field.id}>{field.label}</option>
              ))}
            </select>
            {data?.signedIn && (
              <select
                className="mf-pill mf-pill--select"
                value={filters.verdict}
                onChange={(e) => setFilter("verdict", e.target.value)}
                aria-label="Your fit"
              >
                <option value="">Any fit</option>
                {Object.entries(VERDICTS).map(([key, verdict]) => (
                  <option key={key} value={key}>{verdict.label}</option>
                ))}
              </select>
            )}
          </div>

          {skillFilter && (
            <button type="button" className="mf-clear" onClick={() => setFilter("skill", "")}>
              Needs {skillLabel(skillFilter)} <X size={14} weight="bold" />
            </button>
          )}

          {data && (
            <div className="mf-count">
              <p>
                <b>{data.total.toLocaleString("en-US")}</b> {data.total === 1 ? "job" : "jobs"}
                {data.newSince > 0 && <span className="mf-count__new">{data.newSince} new since your last visit</span>}
              </p>
              {data.meta?.checkedAt && (
                <p className="mf-count__checked">
                  <ShieldCheck size={15} weight="fill" /> Checked {ago(data.meta.checkedAt)}
                </p>
              )}
            </div>
          )}

          {data && !data.signedIn && (
            <Notice
              tone="violet"
              title="See where you stand on every job"
              action={<Link className="mf-link" to="/memotify/passport">Build your Passport</Link>}
            >
              Add your CV and each job shows which skills you have, and which you still need.
            </Notice>
          )}

          {filling && <Spinner label="Checking today's jobs. The first run takes about 20 seconds." />}
          {!filling && loading && !data && <Spinner label="Loading jobs" />}
          {error && !data && (
            <Notice
              tone="warn"
              title="The board did not load"
              action={<button type="button" className="mf-btn mf-btn--ghost" onClick={reload}><ArrowsClockwise size={16} /> Try again</button>}
            >
              {error.message}
            </Notice>
          )}

          {data && !filling && jobs.length === 0 && (
            <Notice title="Nothing matches those filters today">
              We would rather show nothing than pad the list. Try fewer filters: new jobs arrive through the day.
            </Notice>
          )}

          <div className="mf-list">
            {jobs.map((job) => (
              <JobRow key={job.id} job={job} active={job.id === id} search={query} />
            ))}
          </div>

          {data && data.total > jobs.length && (
            <button type="button" className="mf-btn mf-btn--ghost mf-btn--wide" onClick={more}>
              Show more jobs
            </button>
          )}
        </section>

        <section className="mf-board__job" aria-label="Job details">
          {id ? (
            <JobDetail key={id} id={id} onBack={() => navigate(`/memotify/jobs${query}`)} />
          ) : (
            <div className="mf-board__empty">
              <ShieldCheck size={38} weight="duotone" />
              <p>Pick a job to see what we checked and where you stand.</p>
            </div>
          )}
        </section>
      </div>
    </Shell>
  );
}
