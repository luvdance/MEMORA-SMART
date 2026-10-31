import { useCallback, useEffect, useState } from "react";
import { auth } from "../../firebase";

/**
 * Memotify's review queue: new employers, held jobs and reported listings.
 * Every employer passes through here once; after that their clean posts
 * publish themselves. The server checks the admin claim on each call.
 */
async function call(action, body) {
  const token = await auth.currentUser.getIdToken();
  const res = await fetch(`/api/memotify/${action}`, {
    method: body ? "POST" : "GET",
    headers: { Authorization: `Bearer ${token}`, ...(body ? { "Content-Type": "application/json" } : {}) },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Request failed");
  return data;
}

const row = { padding: "14px 0", borderBottom: "1px solid #e5e7eb" };
const small = { fontSize: 13, color: "#6b7280", margin: "2px 0" };

export default function MemotifyAdmin() {
  const [queue, setQueue] = useState(null);
  const [error, setError] = useState("");
  const [note, setNote] = useState("");

  const load = useCallback(() => {
    call("admin-queue").then(setQueue).catch((err) => setError(err.message));
  }, []);

  useEffect(load, [load]);

  const decide = async (type, id, decision) => {
    await call("admin-decide", { type, id, decision, note });
    setNote("");
    load();
  };

  const Buttons = ({ type, id, yes = "Approve", no = "Reject" }) => (
    <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
      <button className="admin__back" onClick={() => decide(type, id, "approve")}>{yes}</button>
      <button className="admin__back" onClick={() => decide(type, id, "reject")}>{no}</button>
    </div>
  );

  if (error) return <p>{error}</p>;
  if (!queue) return <p>Loading the queue…</p>;

  return (
    <div>
      <p style={small}>
        Feed: {queue.feed.count ?? 0} live jobs, last checked{" "}
        {queue.feed.checkedAt ? new Date(queue.feed.checkedAt).toLocaleString() : "never"}.{" "}
        {queue.sources.filter((s) => s.error).length} sources failing:{" "}
        {queue.sources.filter((s) => s.error).map((s) => s.name).join(", ") || "none"}.
      </p>

      <input
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Optional note to the employer, for the next decision"
        style={{ width: "100%", padding: 8, margin: "12px 0", border: "1px solid #e5e7eb", borderRadius: 6 }}
      />

      <h3>Employers ({queue.companies.length})</h3>
      {queue.companies.map((company) => (
        <div key={company.id} style={row}>
          <strong>{company.name}</strong>{" "}
          <a href={company.website} target="_blank" rel="noopener noreferrer">{company.website}</a>
          <p style={small}>
            {company.ownerEmail} · {company.domainMatch ? "email matches the website" : "email does NOT match the website"}
            {company.location ? ` · ${company.location}` : ""}
          </p>
          <p style={small}>{company.about}</p>
          <Buttons type="company" id={company.id} yes="Verify" />
        </div>
      ))}

      <h3 style={{ marginTop: 24 }}>Held jobs ({queue.jobs.length})</h3>
      {queue.jobs.map((job) => (
        <div key={job.id} style={row}>
          <strong>{job.title}</strong> at {job.company}
          {job.flags?.length > 0 && <p style={{ ...small, color: "#b3261e" }}>Flags: {job.flags.map((f) => f.label).join("; ")}</p>}
          <p style={small}>{job.pay?.text}</p>
          <p style={{ ...small, whiteSpace: "pre-line" }}>{job.text}</p>
          <Buttons type="job" id={job.id} />
        </div>
      ))}

      <h3 style={{ marginTop: 24 }}>Reports ({queue.reports.length})</h3>
      {queue.reports.map((report) => (
        <div key={report.id} style={row}>
          <strong>{report.title}</strong> at {report.company}
          <p style={small}>{report.votes} report(s){report.hidden ? ", hidden from the board" : ""}: {report.reasons.join("; ")}</p>
          {report.url && <a href={report.url} target="_blank" rel="noopener noreferrer">Open the listing</a>}
          <Buttons type="report" id={report.id} yes="Keep it down" no="Restore" />
        </div>
      ))}
    </div>
  );
}
