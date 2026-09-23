import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import useSEO from "../../hooks/useSEO";
import AcademyNav from "../components/AcademyNav";
import { ERROR_CODES, reportError } from "../services/errors";
import AcademyFooter from "../components/AcademyFooter";
import { getCourseLessons } from "../data/lessons";
import {
  getAllProgress,
  getEnrollments,
  getStudent,
} from "../services/academyService";
import "../academy.css";

/**
 * JOBS
 *
 * Real, live postings, ranked against what this learner has actually proved.
 *
 * Every card states why it was recommended. A job board that cannot explain
 * itself is just a list, and a list nobody trusts gets ignored. The ranking
 * happens server-side in lib/academy/jobs so the scoring rules and the skill
 * taxonomy never ship to the browser.
 */
export default function AcademyJobs() {
  const { user } = useAuth();

  const [state, setState] = useState("loading"); // loading | ready | error
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("data analyst");
  const [remoteOnly, setRemoteOnly] = useState(false);

  useSEO({
    title: "Jobs — Memora Smart Academy",
    description:
      "Live job postings matched to the skills you have proved in your Academy courses.",
  });

  useEffect(() => {
    if (!user) return;
    let alive = true;
    setState("loading");

    (async () => {
      try {
        // Work out what the learner has proved, from their real progress
        const enrollments = await getEnrollments(user.uid);
        const student = await getStudent(user.uid);

        const completedModules = new Set();
        const startedModules = new Set();

        for (const enrollment of enrollments) {
          const lessons = getCourseLessons(enrollment.courseId);
          const progress = await getAllProgress(user.uid, enrollment.courseId);

          // A module counts as complete when every WRITTEN lesson in it passed
          const byModule = new Map();
          for (const lesson of lessons) {
            if (!byModule.has(lesson.moduleId)) byModule.set(lesson.moduleId, []);
            byModule.get(lesson.moduleId).push(lesson.id);
          }

          for (const [moduleId, lessonIds] of byModule) {
            const passed = lessonIds.filter(
              (id) => progress[id]?.assessment?.passed
            );
            if (passed.length === lessonIds.length && lessonIds.length > 0) {
              completedModules.add(moduleId);
            } else if (passed.length > 0 || lessonIds.some((id) => progress[id])) {
              startedModules.add(moduleId);
            }
          }
        }

        const params = new URLSearchParams({
          completed: [...completedModules].join(","),
          inProgress: [...startedModules].join(","),
          level: String(student?.xp ? Math.max(1, Math.floor(student.xp / 400) + 1) : 1),
          query,
        });

        const res = await fetch(`/api/academy/jobs?${params}`);
        if (!res.ok) {
          const failure = new Error("jobs-load-failed");
          failure.code = "unavailable";
          throw failure;
        }

        const payload = await res.json();
        if (!alive) return;
        setData(payload);
        setState("ready");
      } catch (err) {
        if (!alive) return;
        setError(reportError("jobs:load", err, ERROR_CODES.UNAVAILABLE).message);
        setState("error");
      }
    })();

    return () => {
      alive = false;
    };
  }, [user, query]);

  const jobs = useMemo(() => {
    if (!data?.jobs) return [];
    return remoteOnly ? data.jobs.filter((j) => j.remote) : data.jobs;
  }, [data, remoteOnly]);

  const proved = data?.profile?.proved || [];

  return (
    <div className="academy">
      <AcademyNav />

      <main className="ac-section ac-section--learn">
        <div className="ac-container">
          <header className="ac-head">
            <div>
              <span className="ac-kicker">Jobs</span>
              <h1 className="ac-h2">Roles matched to what you have proved</h1>
            </div>
            <p className="ac-head__sub">
              Every role here needs a skill you have already passed an
              assessment in. Each one shows what you have covered and what is
              still missing, so you know exactly what to learn next to reach it.
            </p>
          </header>

          {/* ── YOUR SKILL PROFILE ── */}
          {state === "ready" && (
            <section className="ac-jobprofile">
              <div>
                <span className="ac-note__label">Matching on</span>
                {proved.length > 0 ? (
                  <div className="ac-jobprofile__skills">
                    {proved.map((s) => (
                      <span key={s} className="is-proved">
                        <i className="fas fa-circle-check" aria-hidden="true" />
                        {s}
                      </span>
                    ))}
                    {(data.profile.learning || []).map((s) => (
                      <span key={s}>
                        <i className="fas fa-circle-half-stroke" aria-hidden="true" />
                        {s}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="ac-body ac-body--muted">
                    You have not passed a module yet, so matching is limited.{" "}
                    <Link to="/academy/learn">Finish a module</Link> and this page
                    gets sharper.
                  </p>
                )}
              </div>

              <div className="ac-jobprofile__meta">
                <strong>{data.meta.matched}</strong> matched of{" "}
                {data.meta.scanned} scanned
                <span>
                  {data.meta.sources.map((s) => s.name).join(" · ")}
                  {data.meta.cached ? ` · cached ${data.meta.ageMinutes}m ago` : ""}
                </span>
              </div>
            </section>
          )}

          {/* ── CONTROLS ── */}
          <div className="ac-coursebar">
            <div className="ac-search">
              <i className="fas fa-search" aria-hidden="true" />
              <input
                type="search"
                defaultValue={query}
                onKeyDown={(e) => {
                  if (e.key === "Enter") setQuery(e.currentTarget.value.trim() || "data analyst");
                }}
                onBlur={(e) => setQuery(e.currentTarget.value.trim() || "data analyst")}
                placeholder="Search a role, then press Enter"
                aria-label="Search jobs"
              />
            </div>
            <label className="ac-toggle">
              <input
                type="checkbox"
                checked={remoteOnly}
                onChange={(e) => setRemoteOnly(e.target.checked)}
              />
              <span>Remote only</span>
            </label>
          </div>

          {state === "loading" && (
            <div className="ac-boot ac-boot--inline">
              <i className="fas fa-spinner fa-spin" aria-hidden="true" />
              <p>Scanning live job boards…</p>
            </div>
          )}

          {state === "error" && (
            <div className="ac-empty ac-empty--panel">
              <p className="ac-body">We could not reach the job sources.</p>
              <p className="ac-body ac-body--muted">{error}</p>
            </div>
          )}

          {state === "ready" && jobs.length === 0 && (
            <div className="ac-empty ac-empty--panel">
              <p className="ac-body">
                No postings matched your current skills for “{query}”.
              </p>
              <p className="ac-body ac-body--muted">
                We would rather show you nothing than pad this page with roles you
                cannot get. Try a different search, or complete another module to
                widen the match.
              </p>
            </div>
          )}

          {state === "ready" && jobs.length > 0 && (
            <div className="ac-jobs">
              {jobs.map((job) => (
                <article className="ac-job" key={job.id}>
                  <div className="ac-job__head">
                    <div className="ac-job__logo">
                      {job.companyLogo ? (
                        <img src={job.companyLogo} alt="" loading="lazy" />
                      ) : (
                        <i className="fas fa-building" aria-hidden="true" />
                      )}
                    </div>
                    <div className="ac-job__title">
                      <h2>{job.title}</h2>
                      <p>
                        {job.company}
                        {job.location ? ` · ${job.location}` : ""}
                      </p>
                    </div>
                    <div className="ac-job__score" title="How well this matches your record">
                      <strong>{job.score}</strong>
                      <span>match</span>
                    </div>
                  </div>

                  <div className="ac-job__tags">
                    <span className={`ac-job__level ac-job__level--${job.seniority}`}>
                      {job.seniority === "entry"
                        ? "Entry level"
                        : job.seniority === "mid"
                        ? "Mid level"
                        : "Senior"}
                    </span>
                    {job.remote && <span className="ac-job__remote">Remote</span>}
                    {job.salary && <span className="ac-job__salary">{job.salary}</span>}
                    <span className="ac-job__source">{job.source}</span>
                  </div>

                  <p className="ac-job__reason">
                    <i className="fas fa-wand-magic-sparkles" aria-hidden="true" />
                    {job.reason}
                  </p>

                  {job.match.missing.length > 0 && (
                    <p className="ac-job__gap">
                      Still to learn for this role:{" "}
                      <strong>{job.match.missing.join(", ")}</strong>
                    </p>
                  )}

                  <div className="ac-job__foot">
                    <a
                      className="ac-btn ac-btn--primary"
                      href={job.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View and apply
                      <i className="fas fa-arrow-up-right-from-square" aria-hidden="true" />
                    </a>
                    {job.postedAt && (
                      <span className="ac-job__age">
                        Posted {daysAgo(job.postedAt)}
                      </span>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}

          {state === "ready" && jobs.length > 0 && (
            <p className="ac-jobnote">
              <i className="fas fa-circle-info" aria-hidden="true" />
              Applications are made on the employer's own site. Memora Smart
              does not collect your application or charge a fee for it. Roles
              are refreshed through the day and older postings drop off
              automatically.
            </p>
          )}
        </div>
      </main>

      <AcademyFooter />
    </div>
  );
}

function daysAgo(iso) {
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);
  if (days <= 0) return "today";
  if (days === 1) return "yesterday";
  if (days < 7) return `${days} days ago`;
  const weeks = Math.floor(days / 7);
  return weeks === 1 ? "a week ago" : `${weeks} weeks ago`;
}
