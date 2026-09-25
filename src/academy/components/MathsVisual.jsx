/**
 * THE TRACE STAGE, DRAWN
 *
 * The T in A-T-O-M is a picture, and WAEC's Chief Examiners have reported for
 * over a decade that what candidates cannot do is turn a situation into a
 * diagram. A course that teaches bar modelling in prose has not taught it.
 *
 * So every visual a lesson or an item can ask for is drawn here, from a spec
 * that travels as data: `{ kind: "barModel", parts: 5, shaded: 2 }`. Generators
 * on the server attach these to items, teaching files attach them to lessons,
 * and neither has to know anything about SVG.
 *
 * Everything is inline SVG or a plain table, sized in a viewBox and scaled by
 * CSS, so it is sharp on a phone and legible in both themes. An unknown kind
 * renders nothing rather than an error — a missing picture must never take a
 * lesson down with it.
 */

const INK = "var(--ac-mx-ink, #1f2937)";
const MUTED = "var(--ac-mx-muted, #6b7280)";
const FILL = "var(--ac-mx-accent, #1d4ed8)";
const LINE = "var(--ac-mx-line, #d1d5db)";

export default function MathsVisual({ spec }) {
  if (!spec?.kind) return null;
  const Renderer = RENDERERS[spec.kind];
  if (!Renderer) return null;

  return (
    <figure className="ac-mx-visual">
      <Renderer {...spec} />
      {spec.caption && <figcaption>{spec.caption}</figcaption>}
    </figure>
  );
}

/* ── Bar models ──────────────────────────────────────────────────────── */

function BarModel({ parts = 4, shaded = 1, label, total, stage2 }) {
  const width = 480;
  const height = 64;
  const cell = width / parts;

  return (
    <div className="ac-mx-visual__stack">
      <svg viewBox={`0 0 ${width} ${height + 26}`} role="img" aria-label={`Bar divided into ${parts} equal parts with ${shaded} shaded`}>
        {Array.from({ length: parts }, (_, i) => (
          <rect
            key={i}
            x={i * cell}
            y={18}
            width={cell}
            height={height - 18}
            fill={i < shaded ? FILL : "transparent"}
            fillOpacity={i < shaded ? 0.85 : 1}
            stroke={INK}
            strokeWidth="1.5"
          />
        ))}
        {label && (
          <text x={width / 2} y={12} textAnchor="middle" fontSize="13" fill={MUTED}>
            {label}
          </text>
        )}
        {total !== undefined && (
          <text x={width / 2} y={height + 20} textAnchor="middle" fontSize="12" fill={MUTED}>
            {`each part = ${Math.round((total / parts) * 100) / 100}`}
          </text>
        )}
      </svg>

      {/* The second stage of a two-step problem: only what REMAINS is
          re-divided, which is the whole point students miss. */}
      {stage2 && (
        <svg viewBox={`0 0 ${width} 50`} role="img" aria-label="The remainder, divided again">
          <text x={0} y={12} fontSize="12" fill={MUTED}>
            what is left, divided into {stage2.of}:
          </text>
          {Array.from({ length: stage2.of }, (_, i) => {
            const remainderWidth = width * ((parts - shaded) / parts);
            const cell2 = remainderWidth / stage2.of;
            return (
              <rect
                key={i}
                x={width * (shaded / parts) + i * cell2}
                y={20}
                width={cell2}
                height={26}
                fill={i < stage2.take ? "#c2410c" : "transparent"}
                fillOpacity={0.8}
                stroke={INK}
                strokeWidth="1.5"
              />
            );
          })}
        </svg>
      )}
    </div>
  );
}

function FractionBars({ parts = [], operation }) {
  return (
    <div className="ac-mx-visual__stack">
      {parts.map(([n, d], i) => (
        <div key={i} className="ac-mx-visual__row">
          <span className="ac-mx-visual__tag">
            {n}/{d}
          </span>
          <BarModel parts={d} shaded={n} />
          {operation && i === 0 && (
            <span className="ac-mx-visual__op">{operation === "add" ? "+" : "−"}</span>
          )}
        </div>
      ))}
    </div>
  );
}

function EquivalentBars({ fractions = [] }) {
  return <FractionBars parts={fractions} />;
}

function MixedBars({ whole = 1, numerator = 1, denominator = 2 }) {
  return (
    <div className="ac-mx-visual__stack">
      {Array.from({ length: whole }, (_, i) => (
        <BarModel key={`w${i}`} parts={denominator} shaded={denominator} />
      ))}
      <BarModel parts={denominator} shaded={numerator} />
    </div>
  );
}

function PercentBar({ percent = 50 }) {
  const width = 480;
  return (
    <svg viewBox={`0 0 ${width} 56`} role="img" aria-label={`${percent} per cent of a bar shaded`}>
      <rect x={0} y={14} width={width} height={28} fill="none" stroke={INK} strokeWidth="1.5" />
      <rect x={0} y={14} width={(width * percent) / 100} height={28} fill={FILL} fillOpacity="0.85" />
      {[0, 25, 50, 75, 100].map((t) => (
        <text key={t} x={(width * t) / 100} y={54} textAnchor="middle" fontSize="11" fill={MUTED}>
          {t}%
        </text>
      ))}
    </svg>
  );
}

function FdpBar({ fraction = [1, 4] }) {
  const [n, d] = fraction;
  const percent = Math.round((n / d) * 1000) / 10;
  return (
    <div className="ac-mx-visual__stack">
      <PercentBar percent={percent} />
      <p className="ac-mx-visual__note">
        {n}/{d} &nbsp;=&nbsp; {Math.round((n / d) * 10000) / 10000} &nbsp;=&nbsp; {percent}%
      </p>
    </div>
  );
}

function AreaFraction({ a = [1, 2], b = [1, 2] }) {
  const [an, ad] = a;
  const [bn, bd] = b;
  const size = 220;
  const cw = size / bd;
  const ch = size / ad;

  return (
    <svg viewBox={`0 0 ${size + 2} ${size + 2}`} role="img" aria-label="An area model for multiplying two fractions">
      {Array.from({ length: ad }, (_, row) =>
        Array.from({ length: bd }, (_, col) => (
          <rect
            key={`${row}-${col}`}
            x={col * cw + 1}
            y={row * ch + 1}
            width={cw}
            height={ch}
            fill={row < an && col < bn ? FILL : "transparent"}
            fillOpacity={0.8}
            stroke={LINE}
            strokeWidth="1"
          />
        ))
      )}
      <rect x={1} y={1} width={size} height={size} fill="none" stroke={INK} strokeWidth="1.5" />
    </svg>
  );
}

/* ── Number lines ────────────────────────────────────────────────────── */

function NumberLine({ from = 0, to = 10, marks = [], jump, unit }) {
  const width = 520;
  const y = 44;
  const span = to - from || 1;
  const at = (v) => 20 + ((v - from) / span) * (width - 40);

  const ticks = [];
  const step = niceStep(span);
  for (let v = Math.ceil(from / step) * step; v <= to; v += step) ticks.push(v);

  return (
    <svg viewBox={`0 0 ${width} 86`} role="img" aria-label="A number line">
      <line x1={12} y1={y} x2={width - 12} y2={y} stroke={INK} strokeWidth="1.5" />
      {ticks.map((v) => (
        <g key={v}>
          <line x1={at(v)} y1={y - 6} x2={at(v)} y2={y + 6} stroke={v === 0 ? INK : LINE} strokeWidth={v === 0 ? 2 : 1} />
          <text x={at(v)} y={y + 22} textAnchor="middle" fontSize="11" fill={MUTED}>
            {formatTick(v)}
            {unit && v === ticks[ticks.length - 1] ? unit : ""}
          </text>
        </g>
      ))}

      {marks.map((v) => (
        <circle key={v} cx={at(v)} cy={y} r="5" fill={FILL} />
      ))}

      {jump && (
        <g>
          <path
            d={`M ${at(jump.from)} ${y - 8} Q ${(at(jump.from) + at(jump.to)) / 2} ${y - 34} ${at(jump.to)} ${y - 8}`}
            fill="none"
            stroke="#c2410c"
            strokeWidth="2"
          />
          <circle cx={at(jump.from)} cy={y} r="5" fill={MUTED} />
          <circle cx={at(jump.to)} cy={y} r="6" fill="#c2410c" />
          <text x={(at(jump.from) + at(jump.to)) / 2} y={y - 38} textAnchor="middle" fontSize="12" fill="#c2410c">
            {jump.to > jump.from ? `+${round(jump.to - jump.from)}` : round(jump.to - jump.from)}
          </text>
        </g>
      )}
    </svg>
  );
}

function RoundingLine({ value, to = 10 }) {
  const down = Math.floor(value / to) * to;
  const up = down + to;
  const mid = (down + up) / 2;
  return (
    <div className="ac-mx-visual__stack">
      <NumberLine from={down} to={up} marks={[value]} />
      <p className="ac-mx-visual__note">
        Halfway is {round(mid)}. {value} is {value >= mid ? "past" : "short of"} it, so it rounds to{" "}
        <strong>{value >= mid ? round(up) : round(down)}</strong>.
      </p>
    </div>
  );
}

function TimeLine({ from = "00:00", to = "00:00" }) {
  const mins = (t) => {
    const [h, m] = String(t).split(":").map(Number);
    return h * 60 + m;
  };
  const start = mins(from);
  const end = mins(to);
  const hour = Math.ceil(start / 60) * 60;

  return (
    <div className="ac-mx-visual__stack">
      <NumberLine from={start - 5} to={end + 5} marks={[start, end]} />
      <p className="ac-mx-visual__note">
        {from} → {pad(hour)} is {hour - start} min, then {pad(hour)} → {to} is {end - hour} min.
        Total {end - start} min.
      </p>
    </div>
  );
}

const pad = (m) => `${String(Math.floor(m / 60) % 24).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;

/* ── Place value and arithmetic layouts ──────────────────────────────── */

const WHOLE_PLACES = ["Billions", "Hundred M", "Ten M", "Millions", "Hundred Th", "Ten Th", "Thousands", "Hundreds", "Tens", "Units"];
const DECIMAL_PLACES = ["Tenths", "Hundredths", "Thousandths"];

function PlaceChart({ number, decimals }) {
  const [wholeText, decimalText = ""] = String(number).split(".");
  const digits = wholeText.split("");
  const places = WHOLE_PLACES.slice(WHOLE_PLACES.length - digits.length);

  return (
    <div className="ac-mx-chart">
      <table>
        <thead>
          <tr>
            {places.map((p) => (
              <th key={p}>{p}</th>
            ))}
            {decimals &&
              decimalText.split("").map((_, i) => (
                <th key={`d${i}`} className="ac-mx-chart__dec">
                  {DECIMAL_PLACES[i] || `10^-${i + 1}`}
                </th>
              ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            {digits.map((d, i) => (
              <td key={i}>{d}</td>
            ))}
            {decimals &&
              decimalText.split("").map((d, i) => (
                <td key={`dv${i}`} className="ac-mx-chart__dec">
                  {d}
                </td>
              ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}

function CompareColumns({ a, b }) {
  const as = String(a).padStart(Math.max(String(a).length, String(b).length), " ").split("");
  const bs = String(b).padStart(as.length, " ").split("");
  const firstDiff = as.findIndex((d, i) => d !== bs[i]);

  return (
    <div className="ac-mx-chart ac-mx-chart--compare">
      <table>
        <tbody>
          <tr>
            {as.map((d, i) => (
              <td key={i} className={i === firstDiff ? "is-decider" : ""}>{d}</td>
            ))}
          </tr>
          <tr>
            {bs.map((d, i) => (
              <td key={i} className={i === firstDiff ? "is-decider" : ""}>{d}</td>
            ))}
          </tr>
        </tbody>
      </table>
      <p className="ac-mx-visual__note">
        The highlighted column is the first place where they differ. Nothing to its right matters.
      </p>
    </div>
  );
}

function ColumnSum({ a, b, operation = "add" }) {
  const dp = Math.max((String(a).split(".")[1] || "").length, (String(b).split(".")[1] || "").length);
  return (
    <pre className="ac-mx-columns">
      {`  ${Number(a).toFixed(dp)}\n${operation === "add" ? "+" : "−"} ${Number(b).toFixed(dp)}\n  ${"—".repeat(Number(a).toFixed(dp).length)}`}
    </pre>
  );
}

function GridMultiply({ a, b }) {
  const tens = Math.floor(b / 10) * 10;
  const units = b % 10;
  return (
    <div className="ac-mx-chart">
      <table>
        <thead>
          <tr>
            <th>×</th>
            <th>{tens}</th>
            <th>{units}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th>{a}</th>
            <td>{a * tens}</td>
            <td>{a * units}</td>
          </tr>
        </tbody>
      </table>
      <p className="ac-mx-visual__note">
        {a * tens} + {a * units} = <strong>{a * b}</strong>
      </p>
    </div>
  );
}

function BodmasTree({ expression }) {
  return (
    <div className="ac-mx-visual__stack">
      <pre className="ac-mx-columns">{expression}</pre>
      <p className="ac-mx-visual__note">
        Brackets · Orders · Division and Multiplication · Addition and Subtraction. The middle
        two rank equally, and so do the last two — work each rank left to right.
      </p>
    </div>
  );
}

/* ── Number theory ───────────────────────────────────────────────────── */

function FactorPairs({ n }) {
  const pairs = [];
  for (let i = 1; i * i <= n; i += 1) if (n % i === 0) pairs.push([i, n / i]);
  return (
    <div className="ac-mx-chart">
      <table>
        <tbody>
          {pairs.map(([x, y]) => (
            <tr key={x}>
              <td>{x}</td>
              <td>×</td>
              <td>{y}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="ac-mx-visual__note">
        Once the pair crosses over, every further factor is one you already have.
      </p>
    </div>
  );
}

function FactorTree({ n }) {
  const primes = [];
  let m = n;
  const rows = [];
  for (let p = 2; p * p <= m; p += 1) {
    while (m % p === 0) {
      rows.push([m, p, m / p]);
      primes.push(p);
      m /= p;
    }
  }
  if (m > 1) primes.push(m);

  return (
    <div className="ac-mx-visual__stack">
      <pre className="ac-mx-columns">
        {rows.map(([from, by, to]) => `${from} = ${by} × ${to}`).join("\n")}
      </pre>
      <p className="ac-mx-visual__note">
        {n} = {primes.join(" × ")}
      </p>
    </div>
  );
}

function HcfLcmVenn({ a, b }) {
  const factorise = (n) => {
    const out = [];
    let m = n;
    for (let p = 2; p * p <= m; p += 1) while (m % p === 0) { out.push(p); m /= p; }
    if (m > 1) out.push(m);
    return out;
  };
  const fa = factorise(a);
  const fb = factorise(b);
  const shared = [];
  const restB = [...fb];
  for (const p of fa) {
    const i = restB.indexOf(p);
    if (i >= 0) { shared.push(p); restB.splice(i, 1); }
  }
  const onlyA = [...fa];
  for (const p of shared) onlyA.splice(onlyA.indexOf(p), 1);

  return (
    <div className="ac-mx-venn">
      <div className="ac-mx-venn__side">
        <span>only {a}</span>
        <strong>{onlyA.join(" × ") || "—"}</strong>
      </div>
      <div className="ac-mx-venn__mid">
        <span>shared → HCF</span>
        <strong>{shared.join(" × ") || "1"}</strong>
      </div>
      <div className="ac-mx-venn__side">
        <span>only {b}</span>
        <strong>{restB.join(" × ") || "—"}</strong>
      </div>
    </div>
  );
}

function Sieve({ upTo = 100 }) {
  const isPrime = (n) => {
    if (n < 2) return false;
    for (let i = 2; i * i <= n; i += 1) if (n % i === 0) return false;
    return true;
  };
  return (
    <div className="ac-mx-sieve">
      {Array.from({ length: upTo }, (_, i) => i + 1).map((n) => (
        <span key={n} className={isPrime(n) ? "is-prime" : ""}>
          {n}
        </span>
      ))}
    </div>
  );
}

function TimesTable({ upTo = 12 }) {
  return (
    <div className="ac-mx-chart ac-mx-chart--tight">
      <table>
        <tbody>
          {Array.from({ length: upTo }, (_, r) => (
            <tr key={r}>
              {Array.from({ length: upTo }, (_, c) => (
                <td key={c}>{(r + 1) * (c + 1)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SignTable() {
  return (
    <div className="ac-mx-chart">
      <table>
        <thead>
          <tr><th>×</th><th>+</th><th>−</th></tr>
        </thead>
        <tbody>
          <tr><th>+</th><td>+</td><td>−</td></tr>
          <tr><th>−</th><td>−</td><td>+</td></tr>
        </tbody>
      </table>
      <p className="ac-mx-visual__note">Same signs give +. Different signs give −. Division behaves identically.</p>
    </div>
  );
}

function DivisibilityTable() {
  const rules = [
    ["2", "last digit is even"],
    ["3", "digits add to a multiple of 3"],
    ["4", "last two digits divide by 4"],
    ["5", "ends in 0 or 5"],
    ["6", "passes the 2 test and the 3 test"],
    ["9", "digits add to a multiple of 9"],
    ["10", "ends in 0"],
  ];
  return (
    <div className="ac-mx-chart">
      <table>
        <thead><tr><th>Divisible by</th><th>Test</th></tr></thead>
        <tbody>
          {rules.map(([n, rule]) => (
            <tr key={n}><th>{n}</th><td>{rule}</td></tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ── Measurement and shape ───────────────────────────────────────────── */

function UnitLadder({ family = "length" }) {
  const rungs = {
    length: ["km", "×1000", "m", "×100", "cm", "×10", "mm"],
    mass: ["kg", "×1000", "g"],
    capacity: ["litre", "×1000", "ml"],
  }[family] || [];

  return (
    <div className="ac-mx-ladder">
      {rungs.map((r, i) =>
        i % 2 === 0 ? (
          <span key={i} className="ac-mx-ladder__unit">{r}</span>
        ) : (
          <span key={i} className="ac-mx-ladder__step">{r} ↓ &nbsp; ÷ ↑</span>
        )
      )}
    </div>
  );
}

function Rectangle({ width = 10, height = 6, label }) {
  const w = 300;
  const h = (height / width) * w;
  return (
    <svg viewBox={`0 0 ${w + 70} ${h + 50}`} role="img" aria-label={`A rectangle ${width} by ${height}`}>
      <rect x={35} y={10} width={w} height={h} fill={label === "area" ? FILL : "none"} fillOpacity="0.15" stroke={INK} strokeWidth="2" />
      <text x={35 + w / 2} y={h + 32} textAnchor="middle" fontSize="13" fill={MUTED}>{width}</text>
      <text x={20} y={10 + h / 2} textAnchor="middle" fontSize="13" fill={MUTED}>{height}</text>
    </svg>
  );
}

function AreaGrid({ width = 8, height = 5 }) {
  const cell = 26;
  return (
    <svg viewBox={`0 0 ${width * cell + 4} ${height * cell + 4}`} role="img" aria-label="An area grid of unit squares">
      {Array.from({ length: height }, (_, r) =>
        Array.from({ length: width }, (_, c) => (
          <rect key={`${r}-${c}`} x={c * cell + 2} y={r * cell + 2} width={cell} height={cell} fill={FILL} fillOpacity="0.12" stroke={LINE} />
        ))
      )}
    </svg>
  );
}

function LShape({ width = 10, height = 7, cutWidth = 4, cutHeight = 3 }) {
  const scale = 300 / width;
  const w = width * scale;
  const h = height * scale;
  const cw = cutWidth * scale;
  const ch = cutHeight * scale;
  const path = `M 10 10 H ${10 + w} V ${10 + h - ch} H ${10 + w - cw} V ${10 + h} H 10 Z`;

  return (
    <svg viewBox={`0 0 ${w + 60} ${h + 40}`} role="img" aria-label="An L-shaped plot">
      <path d={path} fill={FILL} fillOpacity="0.12" stroke={INK} strokeWidth="2" />
      <text x={10 + w / 2} y={h + 32} textAnchor="middle" fontSize="12" fill={MUTED}>{width}</text>
      <text x={w + 30} y={10 + h / 2} textAnchor="middle" fontSize="12" fill={MUTED}>{height}</text>
    </svg>
  );
}

function Ruler({ cm = 5, mm = 0 }) {
  const perCm = 30;
  const total = Math.max(cm + 2, 8);
  return (
    <svg viewBox={`0 0 ${total * perCm + 10} 62`} role="img" aria-label="A ruler">
      <rect x={4} y={10} width={total * perCm} height={30} fill="none" stroke={INK} />
      {Array.from({ length: total * 10 + 1 }, (_, i) => (
        <line
          key={i}
          x1={4 + i * (perCm / 10)}
          y1={10}
          x2={4 + i * (perCm / 10)}
          y2={i % 10 === 0 ? 28 : i % 5 === 0 ? 22 : 17}
          stroke={LINE}
        />
      ))}
      {Array.from({ length: total + 1 }, (_, i) => (
        <text key={i} x={4 + i * perCm} y={52} textAnchor="middle" fontSize="10" fill={MUTED}>{i}</text>
      ))}
      <line x1={4} y1={44} x2={4 + (cm + mm / 10) * perCm} y2={44} stroke="#c2410c" strokeWidth="3" />
    </svg>
  );
}

function Scale({ major = 100, divisions = 5, notches = 3 }) {
  const width = 460;
  const count = divisions * 4;
  return (
    <svg viewBox={`0 0 ${width} 70`} role="img" aria-label="A weighing scale">
      <line x1={10} y1={34} x2={width - 10} y2={34} stroke={INK} strokeWidth="1.5" />
      {Array.from({ length: count + 1 }, (_, i) => (
        <g key={i}>
          <line
            x1={10 + (i * (width - 20)) / count}
            y1={34}
            x2={10 + (i * (width - 20)) / count}
            y2={i % divisions === 0 ? 18 : 26}
            stroke={LINE}
          />
          {i % divisions === 0 && (
            <text x={10 + (i * (width - 20)) / count} y={14} textAnchor="middle" fontSize="10" fill={MUTED}>
              {(i / divisions) * major}
            </text>
          )}
        </g>
      ))}
      <polygon
        points={`${10 + (notches * (width - 20)) / count},44 ${10 + (notches * (width - 20)) / count - 6},58 ${10 + (notches * (width - 20)) / count + 6},58`}
        fill="#c2410c"
      />
    </svg>
  );
}

function Clock({ hour = 3, minute = 0 }) {
  const hourAngle = ((hour % 12) + minute / 60) * 30 - 90;
  const minuteAngle = minute * 6 - 90;
  const hand = (angle, length) => ({
    x: 60 + length * Math.cos((angle * Math.PI) / 180),
    y: 60 + length * Math.sin((angle * Math.PI) / 180),
  });
  const h = hand(hourAngle, 28);
  const m = hand(minuteAngle, 42);

  return (
    <svg viewBox="0 0 120 120" role="img" aria-label={`A clock showing ${hour}:${String(minute).padStart(2, "0")}`}>
      <circle cx="60" cy="60" r="54" fill="none" stroke={INK} strokeWidth="2" />
      {Array.from({ length: 12 }, (_, i) => {
        const a = i * 30 - 90;
        return (
          <line
            key={i}
            x1={60 + 48 * Math.cos((a * Math.PI) / 180)}
            y1={60 + 48 * Math.sin((a * Math.PI) / 180)}
            x2={60 + 54 * Math.cos((a * Math.PI) / 180)}
            y2={60 + 54 * Math.sin((a * Math.PI) / 180)}
            stroke={MUTED}
          />
        );
      })}
      <line x1="60" y1="60" x2={h.x} y2={h.y} stroke={INK} strokeWidth="4" strokeLinecap="round" />
      <line x1="60" y1="60" x2={m.x} y2={m.y} stroke={FILL} strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="60" cy="60" r="3" fill={INK} />
    </svg>
  );
}

function GroupingModel({ total = 20, groupSize = 6 }) {
  const full = Math.floor(total / groupSize);
  const left = total % groupSize;
  return (
    <div className="ac-mx-groups">
      {Array.from({ length: Math.min(full, 12) }, (_, i) => (
        <span key={i} className="ac-mx-groups__full">{groupSize}</span>
      ))}
      {full > 12 && <span className="ac-mx-groups__more">+{full - 12} more</span>}
      {left > 0 && <span className="ac-mx-groups__left">{left} left</span>}
    </div>
  );
}

/* ── Data ────────────────────────────────────────────────────────────── */

function DataTable({ headers = [], rows = [] }) {
  return (
    <div className="ac-mx-chart">
      <table>
        <thead>
          <tr>{headers.map((h) => <th key={h}>{h}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => (j === 0 ? <th key={j}>{cell}</th> : <td key={j}>{cell}</td>))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function BarChart({ data = [], axisStep = 5 }) {
  const width = 480;
  const height = 220;
  const pad = 42;
  const max = Math.max(...data.map((d) => d.value), axisStep);
  const top = Math.ceil(max / axisStep) * axisStep;
  const barWidth = (width - pad - 12) / data.length;

  const ticks = [];
  for (let v = 0; v <= top; v += axisStep) ticks.push(v);

  return (
    <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label="A bar chart">
      {ticks.map((v) => {
        const y = height - 34 - ((height - 54) * v) / top;
        return (
          <g key={v}>
            <line x1={pad} y1={y} x2={width - 6} y2={y} stroke={LINE} strokeDasharray="3 3" />
            <text x={pad - 6} y={y + 4} textAnchor="end" fontSize="10" fill={MUTED}>{v}</text>
          </g>
        );
      })}
      {data.map((d, i) => {
        const h = ((height - 54) * d.value) / top;
        return (
          <g key={d.label}>
            <rect
              x={pad + i * barWidth + barWidth * 0.18}
              y={height - 34 - h}
              width={barWidth * 0.64}
              height={h}
              fill={FILL}
              fillOpacity="0.85"
            />
            <text x={pad + i * barWidth + barWidth / 2} y={height - 18} textAnchor="middle" fontSize="10" fill={MUTED}>
              {d.label}
            </text>
          </g>
        );
      })}
      <line x1={pad} y1={height - 34} x2={width - 6} y2={height - 34} stroke={INK} strokeWidth="1.5" />
    </svg>
  );
}

/* ── Algebra ─────────────────────────────────────────────────────────── */

function TermStrip({ expression, group }) {
  const terms = String(expression).match(/[+−-]?\s*[^+−-]+/g) || [];
  return (
    <div className="ac-mx-terms">
      {terms.map((t, i) => (
        <span key={i} className={group && /[a-z]/.test(t) ? "is-like" : ""}>
          {t.trim()}
        </span>
      ))}
    </div>
  );
}

function SubstitutionStrip({ expression, value }) {
  return (
    <pre className="ac-mx-columns">
      {`${expression}\n  with x = ${value}\n= ${String(expression).replace(/x/g, `(${value})`)}`}
    </pre>
  );
}

function TranslateStrip({ phrase, expression }) {
  return (
    <div className="ac-mx-translate">
      <span>{phrase}</span>
      <i className="fas fa-arrow-right" aria-hidden="true" />
      <strong>{expression}</strong>
    </div>
  );
}

function Balance({ left, right }) {
  return (
    <div className="ac-mx-balance">
      <div className="ac-mx-balance__pan">{left}</div>
      <span className="ac-mx-balance__eq">=</span>
      <div className="ac-mx-balance__pan">{right}</div>
    </div>
  );
}

function Machine({ steps = [], output }) {
  return (
    <div className="ac-mx-machine">
      <span className="ac-mx-machine__io">x</span>
      {steps.map((s) => (
        <span key={s} className="ac-mx-machine__step">{s}</span>
      ))}
      <span className="ac-mx-machine__io">{output}</span>
    </div>
  );
}

function SigFigStrip({ value, sf }) {
  const text = String(value);
  const firstSignificant = text.search(/[1-9]/);
  return (
    <div className="ac-mx-terms ac-mx-terms--digits">
      {text.split("").map((c, i) => (
        <span key={i} className={i >= firstSignificant && /[0-9]/.test(c) ? "is-like" : ""}>
          {c}
        </span>
      ))}
      <span className="ac-mx-visual__tag">{sf} s.f.</span>
    </div>
  );
}

function EstimateStrip({ a, b }) {
  const round1 = (n) => Number(Number(n).toPrecision(1));
  return (
    <pre className="ac-mx-columns">
      {`${a} × ${b}\n≈ ${round1(a)} × ${round1(b)}\n= ${round1(a) * round1(b)}`}
    </pre>
  );
}

/* ── Helpers ─────────────────────────────────────────────────────────── */

function niceStep(span) {
  const raw = span / 8;
  const magnitude = Math.pow(10, Math.floor(Math.log10(Math.max(raw, 1e-9))));
  const normalised = raw / magnitude;
  const step = normalised <= 1 ? 1 : normalised <= 2 ? 2 : normalised <= 5 ? 5 : 10;
  return step * magnitude;
}

const round = (v) => Math.round(v * 1000) / 1000;
const formatTick = (v) => (Math.abs(v) >= 10000 ? `${round(v / 1000)}k` : round(v));

const RENDERERS = {
  barModel: BarModel,
  fractionBars: FractionBars,
  equivalentBars: EquivalentBars,
  mixedBars: MixedBars,
  percentBar: PercentBar,
  fdpBar: FdpBar,
  areaFraction: AreaFraction,
  numberLine: NumberLine,
  roundingLine: RoundingLine,
  timeLine: TimeLine,
  placeChart: PlaceChart,
  compareColumns: CompareColumns,
  columnSum: ColumnSum,
  gridMultiply: GridMultiply,
  bodmasTree: BodmasTree,
  factorPairs: FactorPairs,
  factorTree: FactorTree,
  hcfLcmVenn: HcfLcmVenn,
  sieve: Sieve,
  timesTable: TimesTable,
  signTable: SignTable,
  divisibilityTable: DivisibilityTable,
  unitLadder: UnitLadder,
  rectangle: Rectangle,
  areaGrid: AreaGrid,
  lshape: LShape,
  ruler: Ruler,
  scale: Scale,
  clock: Clock,
  groupingModel: GroupingModel,
  table: DataTable,
  barChart: BarChart,
  termStrip: TermStrip,
  substitutionStrip: SubstitutionStrip,
  translateStrip: TranslateStrip,
  balance: Balance,
  machine: Machine,
  sigFigStrip: SigFigStrip,
  estimateStrip: EstimateStrip,
};
