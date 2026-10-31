import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import useSEO from "../../hooks/useSEO";
import Shell, { SiteFooter } from "../Shell";
import { api, useLoad } from "../api";
import { ago } from "../format";
import JobRow from "../JobRow";
import { skillLabel } from "../data/skills";
import { ArrowRight, Buildings, Prohibit, ShieldCheck } from "../icons";
import CvBanner from "../CvBanner";
// A 72 KB copy of assets/memotify_hero.jpg (2.8 MB), for mobile data.
import heroImage from "../../assets/memotify/hero.webp";


const LADDER = [
  { tier: "Claimed", text: "It is on your CV. A start, and exactly what every other applicant has." },
  { tier: "Studied", text: "You passed lessons in the Academy. It sharpens your matches." },
  { tier: "Verified", text: "You passed a timed 15-minute check that we graded. Employers can see it." },
  { tier: "Certified", text: "You passed the Academy's final exam, with a certificate number anyone can quote." },
];

const fmt = (n) => Number(n || 0).toLocaleString("en-US");
const minus = (n) => (n ? `−${fmt(n)}` : "0");

export default function Landing() {
  useSEO({
    title: "Memotify — Jobs for Nigerian Graduates, Checked and Current",
    description:
      "Real jobs open to people in Nigeria. We check the job. You prove the skill.",
  });

  const { data, reload } = useLoad("stats");
  const asked = useRef(false);

  // The first visitor after the pool goes stale refreshes it for everyone.
  useEffect(() => {
    if (!data?.meta?.stale || asked.current) return;
    asked.current = true;
    api("refresh", { body: {} }).then((result) => result.refreshed && reload()).catch(() => {});
  }, [data, reload]);

  const counts = data?.meta?.counts;
  const turnedAway = counts ? counts.closedToNigeria + counts.stale + counts.scam : 0;

  return (
    <Shell tabs={false} dark wide>
      <section className="mf-hero">
        <div className="mf-hero__in">
          <p className="mf-eyebrow">For Nigerian graduates</p>
          <h1>
            We check the job.
            <br />
            <em>You prove the skill.</em>
          </h1>
          <p className="mf-hero__lede">
            Most "remote" jobs quietly reject Nigeria. Memotify shows only roles that accept you, are
            still open, and do not smell like a scam. Then it shows you exactly what stands between you
            and each one.
          </p>
          <div className="mf-hero__go">
            <Link className="mf-btn mf-btn--light" to="/memotify/jobs">
              See today's jobs <ArrowRight size={18} weight="bold" />
            </Link>
            <Link className="mf-hero__alt" to="/memotify/hire">
              I'm hiring
            </Link>
          </div>
        </div>

        <div className="mf-hero__photo">
          <img
            src={heroImage}
            alt="A smiling young professional in a shirt and tie, arms folded, in a bright office"
            width="1400"
            height="1045"
            fetchPriority="high"
          />
        </div>
      </section>

      <section className="mf-tape" aria-label="Today's job check">
        <div className="mf-tape__in">
          <p className="mf-tape__head">
            <b>Today's check</b>
            {data?.meta?.checkedAt && <span>{ago(data.meta.checkedAt)}</span>}
          </p>
          {counts ? (
            <>
              <dl>
                <div><dt>Postings read</dt><dd>{fmt(counts.seen - counts.duplicate)}</dd></div>
                <div><dt>Closed to Nigeria</dt><dd>{minus(counts.closedToNigeria)}</dd></div>
                <div><dt>Too old to trust</dt><dd>{minus(counts.stale)}</dd></div>
                <div><dt>Failed the scam check</dt><dd>{minus(counts.scam)}</dd></div>
                <div className="mf-tape__total"><dt>On the board</dt><dd>{fmt(data.meta.count)}</dd></div>
              </dl>
              <p className="mf-tape__foot">{fmt(turnedAway)} turned away so you don't waste an evening on them.</p>
            </>
          ) : (
            <p className="mf-tape__foot">Running today's check. The numbers land here shortly.</p>
          )}
        </div>
      </section>

      <section className="mf-band">
        <div className="mf-band__in">
          <header className="mf-sect">
            <h2>Open right now</h2>
            {data && (
              <p>
                {fmt(data.total)} jobs from {fmt(data.companies)} employers. {fmt(data.nigeria)} in Nigeria,{" "}
                {fmt(data.worldwide)} open worldwide, {fmt(data.graduate)} graduate friendly.
              </p>
            )}
          </header>
          {data?.latest?.length > 0 && (
            <div className="mf-list mf-list--sheet">
              {data.latest.map((job) => <JobRow key={job.id} job={job} />)}
            </div>
          )}
          <Link className="mf-more" to="/memotify/jobs">
            All {data ? fmt(data.total) : ""} jobs <ArrowRight size={17} weight="bold" />
          </Link>
        </div>
      </section>

      <section className="mf-band mf-band--flush">
        <div className="mf-band__in"><CvBanner /></div>
      </section>

      <section className="mf-band mf-band--paper">
        <div className="mf-split">
          <header className="mf-sect">
            <h2>A CV says you can. A Passport shows you did.</h2>
            <p>
              Every skill on your Memotify Passport sits on one of four rungs, and we tell you and
              employers exactly which. Each rung you climb moves you up every job that needs that skill.
            </p>
            <Link className="mf-link" to="/memotify/passport">Start your Passport</Link>
          </header>
          <ol className="mf-ladder">
            {LADDER.map((rung, i) => (
              <li key={rung.tier} className={`mf-ladder__rung mf-ladder__rung--${i}`}>
                <strong>{rung.tier}</strong>
                <span>{rung.text}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {data?.demand?.length > 0 && (
        <section className="mf-band">
          <div className="mf-band__in">
            <header className="mf-sect">
              <h2>What employers are asking for today</h2>
              <p>Counted from the live board, so it changes when the market does.</p>
            </header>
            <ol className="mf-demand">
              {data.demand.map((item) => (
                <li key={item.id}>
                  <Link to={`/memotify/jobs?skill=${item.id}`}>
                    <span>{skillLabel(item.id)}</span>
                    <i style={{ "--w": `${Math.max(8, (item.jobs / data.demand[0].jobs) * 100)}%` }} />
                    <b>{item.jobs}</b>
                  </Link>
                </li>
              ))}
            </ol>
          </div>
        </section>
      )}

      <section className="mf-band mf-band--paper">
        <div className="mf-band__in mf-three">
          <div>
            <ShieldCheck size={30} weight="duotone" />
            <h3>Nobody pays to apply</h3>
            <p>Ask for a "registration fee" and your job does not go up. Three reports take a listing down until we review it.</p>
          </div>
          <div>
            <Prohibit size={30} weight="duotone" />
            <h3>No dead ends</h3>
            <p>Most listings come straight from the employer's own hiring system. When they close a role, it leaves here too.</p>
          </div>
          <div>
            <Buildings size={30} weight="duotone" />
            <h3>Hiring? Skip the pile</h3>
            <p>Applicants arrive ranked by what they have proved, with real pay on every post. <Link className="mf-link" to="/memotify/hire">Post a role</Link></p>
          </div>
        </div>
      </section>
      <SiteFooter />
    </Shell>
  );
}
