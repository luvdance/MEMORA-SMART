import { useEffect, useState } from "react";
import { useMe } from "./Shell";
import { api } from "./api";

/**
 * The CV tools for one job, shared by the job page and the apply sheet so a
 * result stays put when the sheet opens. The server finds the job description
 * itself, so nobody has to copy or paste anything.
 *
 * A Premium action that hits the paywall is remembered and runs once payment
 * succeeds, so upgrading doesn't cost anyone their place.
 */
export function useCvTools(job, cvId, setCvId) {
  const { reloadMe } = useMe();
  const [fit, setFit] = useState(null);
  const [ats, setAts] = useState(null);
  const [tailored, setTailored] = useState(null);
  // The cover letter for this job, as the person has edited it.
  const [letter, setLetter] = useState("");
  const [letterAts, setLetterAts] = useState(null);
  // What the last AI call left of today's allowance ({ kind, left, limit }).
  const [quota, setQuota] = useState(null);
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");
  const [paywall, setPaywall] = useState(null);

  useEffect(() => {
    if (!cvId) return undefined;
    let alive = true;
    api("cv-fit", { body: { jobId: job.id, cvId } })
      .then((result) => {
        if (!alive) return;
        setFit(result);
        setAts(result.ats || null);
        setLetter(result.letter?.text || "");
        setLetterAts(result.letterAts || null);
        setError("");
      })
      .catch(() => alive && setFit(null));
    return () => {
      alive = false;
    };
  }, [cvId, job.id]);

  const guarded = async (name, work) => {
    setBusy(name);
    setError("");
    try {
      await work();
    } catch (err) {
      if (err.reason === "premium_feature") setPaywall({ action: name, entitlement: err.entitlement });
      else setError(err.message);
    }
    setBusy("");
  };

  const check = () =>
    guarded("check", async () => {
      const result = await api("cv-ats", { body: { jobId: job.id, cvId } });
      setAts(result.ats);
      setQuota(result.quota || null);
    });

  const optimize = () =>
    guarded("optimize", async () => {
      const result = await api("cv-tailor", { body: { jobId: job.id, cvId } });
      setTailored(result);
      setQuota(result.quota || null);
      await reloadMe();
      setCvId(result.cvId);
    });

  const writeLetter = () =>
    guarded("letter", async () => {
      const result = await api("cv-letter", { body: { jobId: job.id, cvId } });
      setLetter(result.letter.text);
      setLetterAts(null);
      setQuota(result.quota || null);
    });

  const checkLetter = () =>
    guarded("letterCheck", async () => {
      const result = await api("cv-letter-check", { body: { jobId: job.id, cvId, letterText: letter } });
      setLetterAts(result.letterAts);
      setQuota(result.quota || null);
    });

  const paid = () => {
    const pending = paywall?.action;
    setPaywall(null);
    if (pending === "check") check();
    if (pending === "optimize") optimize();
    if (pending === "letter") writeLetter();
    if (pending === "letterCheck") checkLetter();
  };

  return {
    fit, ats, tailored, letter, setLetter, letterAts, quota, busy, error, paywall,
    check, optimize, writeLetter, checkLetter, paid, closePaywall: () => setPaywall(null),
  };
}
