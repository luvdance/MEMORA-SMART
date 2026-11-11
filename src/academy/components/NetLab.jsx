import { useEffect, useMemo, useRef, useState } from "react";
import {
  createWorld,
  exec,
  promptOf,
  checkGoals,
  linkStates,
  wifiStates,
} from "../../../lib/academy/network/netsim";

/**
 * NETLAB — a network on the page, configured the way real ones are.
 *
 * The topology is drawn from the lab's spec; click a device to open its
 * console. Routers and switches take real Cisco IOS commands (enable,
 * configure terminal, interface g0/0, ip address …), PCs take the Packet
 * Tracer command prompt (ipconfig, ping, tracert …), and access points take
 * their wireless settings. Nothing is scripted: every ping, lease and route is
 * computed from the configuration by lib/academy/network/netsim.js.
 *
 * A graded lab (`goals`) passes when every goal holds on the live network.
 * The goals are visible from the start, because a network engineer is always
 * told what has to work. What they are not told is how, or what is broken.
 */

const KIND_LABEL = { router: "Router", switch: "Switch", pc: "PC", server: "Server", laptop: "Laptop", ap: "Access point" };

function DeviceGlyph({ kind }) {
  // Simple, recognisable shapes drawn in the same stroke as the links.
  switch (kind) {
    case "router":
      return (
        <g>
          <circle r="5.2" className="ac-net__shape" />
          <path d="M-3 -1.2 L3 -1.2 M1.6 -2.6 L3 -1.2 L1.6 0.2 M3 1.2 L-3 1.2 M-1.6 2.6 L-3 1.2 L-1.6 -0.2" className="ac-net__mark" />
        </g>
      );
    case "switch":
      return (
        <g>
          <rect x="-6.5" y="-3.4" width="13" height="6.8" rx="1.4" className="ac-net__shape" />
          <path d="M-4 -1 L4 -1 M2.6 -2.2 L4 -1 L2.6 0.2 M4 1.3 L-4 1.3 M-2.6 2.5 L-4 1.3 L-2.6 0.1" className="ac-net__mark" />
        </g>
      );
    case "server":
      return (
        <g>
          <rect x="-3.6" y="-5.4" width="7.2" height="10.8" rx="1" className="ac-net__shape" />
          <path d="M-2.2 -2.6 L2.2 -2.6 M-2.2 0 L2.2 0 M-2.2 2.6 L2.2 2.6" className="ac-net__mark" />
        </g>
      );
    case "ap":
      return (
        <g>
          <rect x="-4.6" y="-1.2" width="9.2" height="4.4" rx="1.2" className="ac-net__shape" />
          <path d="M-3.4 -3.2 Q0 -6.4 3.4 -3.2 M-1.8 -2.2 Q0 -3.8 1.8 -2.2" className="ac-net__mark ac-net__mark--wave" />
        </g>
      );
    case "laptop":
      return (
        <g>
          <rect x="-4.4" y="-3.6" width="8.8" height="5.6" rx="0.8" className="ac-net__shape" />
          <path d="M-6 3.2 L6 3.2" className="ac-net__mark ac-net__mark--base" />
        </g>
      );
    default:
      return (
        <g>
          <rect x="-4.8" y="-4.2" width="9.6" height="6.6" rx="0.9" className="ac-net__shape" />
          <path d="M-2.2 4.6 L2.2 4.6 M0 2.4 L0 4.6" className="ac-net__mark ac-net__mark--base" />
        </g>
      );
  }
}

export default function NetLab({
  task,
  intro,
  devices = [],
  links = [],
  config = {},
  goals = [],
  hint,
  successMessage,
  start,
  height = 46,
  onSolved,
  alreadySolved = false,
}) {
  const spec = useMemo(() => ({ devices, links, config }), [devices, links, config]);
  // The simulated network is mutable by design (commands change it in place),
  // so it lives in state once and a tick counter re-renders after each change.
  const [world, setWorld] = useState(() => createWorld(spec));

  const graded = goals.length > 0;
  const [active, setActive] = useState(start || devices[0]?.id);
  const [logs, setLogs] = useState({});
  const [input, setInput] = useState("");
  const [recall, setRecall] = useState(-1);
  const [tick, setTick] = useState(0);
  const [results, setResults] = useState(null);
  const [solved, setSolved] = useState(alreadySolved);
  const [showHint, setShowHint] = useState(false);
  const endRef = useRef(null);
  const inputRef = useRef(null);

  const log = logs[active] || [];
  const typed = log.filter((e) => e.command !== undefined).map((e) => e.command);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "nearest" });
  }, [log.length, active]);

  const states = useMemo(() => linkStates(world), [world, tick]); // eslint-disable-line react-hooks/exhaustive-deps
  const wifi = useMemo(() => wifiStates(world), [world, tick]); // eslint-disable-line react-hooks/exhaustive-deps
  const pos = useMemo(() => Object.fromEntries(devices.map((d) => [d.id, d])), [devices]);

  const submit = () => {
    const line = input;
    setInput("");
    setRecall(-1);
    const prompt = promptOf(world, active);
    if (/^(cls|clear)$/i.test(line.trim())) {
      setLogs((prev) => ({ ...prev, [active]: [] }));
      return;
    }
    const { output } = exec(world, active, line);
    setLogs((prev) => ({ ...prev, [active]: [...(prev[active] || []), { prompt, command: line, output }] }));
    setTick((t) => t + 1);
    setResults(null);
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      submit();
    } else if (e.key === "ArrowUp" && typed.length) {
      e.preventDefault();
      const next = recall < 0 ? typed.length - 1 : Math.max(0, recall - 1);
      setRecall(next);
      setInput(typed[next]);
    } else if (e.key === "ArrowDown" && recall >= 0) {
      e.preventDefault();
      const next = recall + 1;
      if (next >= typed.length) {
        setRecall(-1);
        setInput("");
      } else {
        setRecall(next);
        setInput(typed[next]);
      }
    }
  };

  const check = () => {
    const r = checkGoals(world, goals);
    setResults(r);
    setTick((t) => t + 1);
    if (r.every((g) => g.ok)) {
      setSolved(true);
      onSolved?.();
    }
  };

  const reset = () => {
    setWorld(createWorld(spec));
    setLogs({});
    setResults(null);
    setTick((t) => t + 1);
  };

  const open = (id) => {
    setActive(id);
    setRecall(-1);
    setTimeout(() => inputRef.current?.focus({ preventScroll: true }), 0);
  };

  const failed = results ? results.filter((g) => !g.ok).length : 0;
  const activeDev = devices.find((d) => d.id === active);
  const hostname = (id) => {
    const d = world.devices[id];
    return d && (d.kind === "router" || d.kind === "switch") ? d.hostname : d?.label || id;
  };

  return (
    <div className="ac-net">
      <div className="ac-net__task">
        <span className="ac-net__badge">
          <i className="fas fa-network-wired" aria-hidden="true" /> NetLab
        </span>
        {task && <p>{task}</p>}
        {intro && <p className="ac-net__intro">{intro}</p>}
      </div>

      <svg
        className="ac-net__map"
        viewBox={`0 0 100 ${height}`}
        role="img"
        aria-label={`Network diagram: ${devices.map((d) => d.label || d.id).join(", ")}`}
      >
        {states.map((s, i) => {
          const a = pos[s.a.dev];
          const b = pos[s.b.dev];
          if (!a || !b) return null;
          const lx = a.x + (b.x - a.x) * 0.34;
          const ly = a.y + (b.y - a.y) * 0.34;
          const rx = b.x + (a.x - b.x) * 0.34;
          const ry = b.y + (a.y - b.y) * 0.34;
          return (
            <g key={i}>
              <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} className={`ac-net__link ${s.up ? "is-up" : "is-down"}`} />
              <text x={lx} y={ly - 1} className="ac-net__port">{s.a.port}</text>
              <text x={rx} y={ry - 1} className="ac-net__port">{s.b.port}</text>
            </g>
          );
        })}
        {wifi.map((w) => {
          const a = pos[w.client];
          const b = w.ap && pos[w.ap];
          if (!a || !b) return null;
          return <line key={w.client} x1={a.x} y1={a.y} x2={b.x} y2={b.y} className="ac-net__link ac-net__link--wifi" />;
        })}
        {devices.map((d) => (
          <g
            key={d.id}
            transform={`translate(${d.x} ${d.y})`}
            className={`ac-net__dev ac-net__dev--${d.kind} ${d.id === active ? "is-active" : ""}`}
            onClick={() => open(d.id)}
            role="button"
            tabIndex={0}
            aria-label={`Open ${d.label || d.id} console`}
            onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), open(d.id))}
          >
            <circle r="7.5" className="ac-net__hit" />
            <DeviceGlyph kind={d.kind} />
            <text y="10" className="ac-net__name">{hostname(d.id)}</text>
            {d.note && <text y="13.4" className="ac-net__note">{d.note}</text>}
          </g>
        ))}
      </svg>

      <div className="ac-net__tabs" role="tablist" aria-label="Device consoles">
        {devices.map((d) => (
          <button
            key={d.id}
            type="button"
            role="tab"
            aria-selected={d.id === active}
            className={`ac-net__tab ${d.id === active ? "is-active" : ""}`}
            onClick={() => open(d.id)}
          >
            {hostname(d.id)}
          </button>
        ))}
      </div>

      <div className="ac-net__console" onClick={() => inputRef.current?.focus({ preventScroll: true })}>
        <div className="ac-net__screen" aria-live="polite">
          {!log.length && (
            <p className="ac-net__hello">
              {activeDev ? `${KIND_LABEL[activeDev.kind] || "Device"} ${hostname(active)}. ` : ""}
              {activeDev?.kind === "router" || activeDev?.kind === "switch"
                ? "Cisco IOS commands: enable, configure terminal, show ip interface brief …"
                : "Type help for the commands this device understands."}
            </p>
          )}
          {log.map((e, i) => (
            <div key={i}>
              <div className="ac-net__line">
                <span className="ac-net__prompt">{e.prompt}</span>
                {e.command}
              </div>
              {e.output && <pre className="ac-net__out">{e.output}</pre>}
            </div>
          ))}
          <div className="ac-net__line ac-net__line--input">
            <label htmlFor={`net-in-${active}`} className="ac-net__prompt">{promptOf(world, active)}</label>
            <input
              id={`net-in-${active}`}
              ref={inputRef}
              className="ac-net__input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              spellCheck={false}
              autoCapitalize="off"
              autoComplete="off"
              autoCorrect="off"
            />
          </div>
          <div ref={endRef} />
        </div>
      </div>

      {graded && (
        <ul className="ac-net__goals">
          {goals.map((g, i) => {
            const r = results?.[i];
            return (
              <li key={i} className={r ? (r.ok ? "is-ok" : "is-bad") : ""}>
                <i className={`fas ${r ? (r.ok ? "fa-circle-check" : "fa-circle-xmark") : "fa-circle"}`} aria-hidden="true" />
                <span>{r?.label || g.label}</span>
              </li>
            );
          })}
        </ul>
      )}

      <div className="ac-net__check">
        {graded && (
          <button type="button" className="ac-net__btn" onClick={check}>
            Check my network
          </button>
        )}
        <button type="button" className="ac-net__ghost" onClick={reset}>
          Reset lab
        </button>
        {hint && (
          <button type="button" className="ac-net__ghost" onClick={() => setShowHint((v) => !v)} aria-expanded={showHint}>
            {showHint ? "Hide hint" : "Hint"}
          </button>
        )}
        {results && (
          <p className={`ac-net__feedback ${failed ? "is-bad" : "is-ok"}`} role="status">
            {failed
              ? `${failed} of ${results.length} goal${results.length > 1 ? "s" : ""} not met yet. Test from the devices with ping and the show commands to find out why.`
              : successMessage || "Every goal is met. The network works."}
          </p>
        )}
        {!results && solved && graded && (
          <p className="ac-net__feedback is-ok" role="status">You have already solved this lab. The network is still live, so keep exploring.</p>
        )}
      </div>
      {showHint && hint && <p className="ac-net__hint">{hint}</p>}
      <p className="ac-net__fine">
        NetLab is a simulator, like Packet Tracer: it implements the IOS commands this course uses and computes every result from your configuration. Unsupported commands get IOS&apos;s own &ldquo;Invalid input&rdquo; message.
      </p>
    </div>
  );
}
