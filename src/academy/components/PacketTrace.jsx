import { useMemo, useState } from "react";
import { applyFilter, scoreCapture } from "../../../lib/academy/cyber/packets";

/**
 * PACKET CAPTURE — Wireshark in miniature.
 *
 * Every networking module tells a learner to install Wireshark and then
 * teaches it with screenshots, which cannot show the one skill that matters:
 * narrowing thousands of packets down to the handful that answer your
 * question. That skill is the display filter, and it is typed, not clicked.
 *
 * So the filter box here takes the REAL Wireshark syntax — `dns`,
 * `ip.addr == 10.0.1.5`, `tcp.port == 443`, joined with `&&` — and what a
 * learner types here is what they will type in the real tool. A graded capture
 * asks for two things, because both are the job: narrow the capture, then read
 * the rows well enough to pick the packet that answers the question.
 *
 * The filter itself lives in lib/academy/cyber/packets.js, so the validator
 * can prove every exercise is solvable before it ships.
 */
export default function PacketTrace({
  title,
  task,
  packets = [],
  initialFilter = "",
  expect,
  hint,
  note,
  onSolved,
  alreadySolved = false,
}) {
  const graded = Boolean(expect);
  const [filter, setFilter] = useState(initialFilter);
  const [applied, setApplied] = useState(initialFilter);
  const [selected, setSelected] = useState(null);
  const [result, setResult] = useState(() =>
    alreadySolved && graded
      ? { ok: true, message: "You already found this one. The capture is here if you want another look." }
      : null
  );

  const run = useMemo(() => applyFilter(packets, applied), [packets, applied]);
  const shown = run.ok ? run.packets : [];

  const apply = () => {
    setApplied(filter);
    setSelected(null);
    setResult(null);
  };

  const check = () => {
    const scored = scoreCapture(packets, expect, { filter: applied, selected });
    setResult(scored);
    if (scored.ok) onSolved?.();
  };

  return (
    <div className="ac-pcap">
      <div className="ac-pcap__task">
        <span className="ac-note__label">{graded ? "Find it in the capture" : title || "Packet capture"}</span>
        <p>{task}</p>
      </div>

      <div className="ac-pcap__filterbar">
        <label className="ac-pcap__filterlabel" htmlFor="ac-pcap-filter">
          Display filter
        </label>
        <input
          id="ac-pcap-filter"
          className={`ac-pcap__filter ${run.ok ? "" : "is-bad"}`}
          value={filter}
          spellCheck={false}
          placeholder="dns, or tcp.port == 443"
          onChange={(e) => setFilter(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") apply();
          }}
        />
        <button className="ac-pcap__apply" onClick={apply}>
          Apply
        </button>
        {applied && (
          <button
            className="ac-pcap__clear"
            onClick={() => {
              setFilter("");
              setApplied("");
              setResult(null);
            }}
          >
            Clear
          </button>
        )}
      </div>

      {!run.ok && <p className="ac-pcap__error">{run.error}</p>}

      <div className="ac-pcap__tablewrap">
        <table className="ac-pcap__table">
          <thead>
            <tr>
              <th>No.</th>
              <th>Time</th>
              <th>Source</th>
              <th>Destination</th>
              <th>Protocol</th>
              <th>Length</th>
              <th>Info</th>
            </tr>
          </thead>
          <tbody>
            {shown.map((p) => (
              <tr
                key={p.no}
                className={`ac-pcap__row ac-pcap__row--${String(p.proto).toLowerCase()} ${
                  selected === p.no ? "is-selected" : ""
                }`}
                onClick={() => {
                  if (!graded) return;
                  setSelected(p.no);
                  setResult(null);
                }}
              >
                <td>{p.no}</td>
                <td>{p.time}</td>
                <td>{p.src}</td>
                <td>{p.dst}</td>
                <td>{p.proto}</td>
                <td>{p.length}</td>
                <td className="ac-pcap__info">{p.info}</td>
              </tr>
            ))}
            {!shown.length && run.ok && (
              <tr>
                <td colSpan={7} className="ac-pcap__empty">
                  No packets match that filter. In Wireshark this looks like a broken capture and is
                  almost always a typed filter that is narrower than you meant.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <p className="ac-pcap__count">
        Showing {shown.length} of {packets.length} packets
        {applied ? ` · filter: ${applied}` : " · no filter"}
      </p>

      {note && <p className="ac-pcap__note">{note}</p>}

      {graded && (
        <div className="ac-pcap__check">
          <button className="ac-pcap__btn" onClick={check}>
            Check my answer
          </button>
          {selected !== null && (
            <span className="ac-pcap__selected">Packet {selected} selected</span>
          )}
          {result && (
            <p className={`ac-pcap__feedback ${result.ok ? "is-ok" : "is-bad"}`} role="status">
              {result.message}
            </p>
          )}
          {result && !result.ok && hint && <p className="ac-pcap__hint">{hint}</p>}
        </div>
      )}
    </div>
  );
}
