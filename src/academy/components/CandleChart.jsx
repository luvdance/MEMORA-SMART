import { useMemo, useState } from "react";
import { PATTERNS, findPattern, toCandle } from "../../../lib/academy/forex/engine";

/**
 * CANDLESTICK CHART — the forex course's chart, drawn from the lesson's data.
 *
 * Two modes, the same contract as every other Academy sim:
 *
 *   candles           read-only. Draws the candles, optional horizontal
 *                     levels (support, resistance, entry, stop, target), an
 *                     optional simple moving average and candle labels.
 *   candleExercise    graded. The learner clicks every candle that matches
 *                     a named pattern. The correct set is NOT typed by the
 *                     author: it is computed by findPattern() from the same
 *                     definitions the lesson teaches, and the validator
 *                     checks that the author's `pattern` really occurs.
 *
 * Candles are [open, high, low, close]. Price runs up the page; time runs
 * left to right, oldest first, exactly as on TradingView or MetaTrader.
 */

const W = 640;
const H = 300;
const PAD = { top: 16, right: 64, bottom: 26, left: 10 };

const LEVEL_COLOURS = {
  support: "#15803d",
  resistance: "#b91c1c",
  entry: "#1d4ed8",
  stop: "#b91c1c",
  target: "#15803d",
  zone: "#7c3aed",
  level: "#64748b",
};

function decimalsFor(prices) {
  // Yen pairs quote to 3 places, the rest to 5; the chart only needs 2 or 4.
  return Math.max(...prices) > 20 ? 2 : 4;
}

function Chart({ data, levels = [], zones = [], ma, labels = {}, selected, revealed, onPick, interactive }) {
  const candles = data.map(toCandle);
  const prices = candles.flatMap((c) => [c.h, c.l]).concat(levels.map((l) => l.price));
  zones.forEach((z) => prices.push(z.from, z.to));
  const hi = Math.max(...prices);
  const lo = Math.min(...prices);
  const span = hi - lo || 1;
  const top = hi + span * 0.06;
  const bottom = lo - span * 0.06;
  const y = (p) => PAD.top + ((top - p) / (top - bottom)) * (H - PAD.top - PAD.bottom);
  const slot = (W - PAD.left - PAD.right) / candles.length;
  const x = (i) => PAD.left + slot * i + slot / 2;
  const bw = Math.max(3, Math.min(16, slot * 0.6));
  const dp = decimalsFor(prices);

  // A few dozen points at most: cheap enough to recompute on every render.
  let maPath = null;
  if (ma) {
    const pts = [];
    candles.forEach((_, i) => {
      if (i + 1 < ma) return;
      const avg = candles.slice(i + 1 - ma, i + 1).reduce((a, c) => a + c.c, 0) / ma;
      pts.push(`${pts.length ? "L" : "M"}${x(i).toFixed(1)},${y(avg).toFixed(1)}`);
    });
    maPath = pts.join(" ");
  }

  const ticks = [0, 0.25, 0.5, 0.75, 1].map((t) => bottom + (top - bottom) * t);

  return (
    <svg
      className="ac-candles__svg"
      viewBox={`0 0 ${W} ${H}`}
      role="img"
      aria-label={`Candlestick chart of ${candles.length} candles`}
    >
      {ticks.map((t) => (
        <g key={t}>
          <line x1={PAD.left} x2={W - PAD.right} y1={y(t)} y2={y(t)} className="ac-candles__grid" />
          <text x={W - PAD.right + 6} y={y(t) + 4} className="ac-candles__axis">
            {t.toFixed(dp)}
          </text>
        </g>
      ))}

      {zones.map((z, i) => (
        <g key={`z${i}`}>
          <rect
            x={PAD.left}
            width={W - PAD.left - PAD.right}
            y={y(Math.max(z.from, z.to))}
            height={Math.abs(y(z.from) - y(z.to))}
            fill={LEVEL_COLOURS[z.kind] || LEVEL_COLOURS.zone}
            opacity="0.12"
          />
          <text x={PAD.left + 4} y={y(Math.max(z.from, z.to)) + 12} className="ac-candles__label">
            {z.label}
          </text>
        </g>
      ))}

      {levels.map((l, i) => (
        <g key={`l${i}`}>
          <line
            x1={PAD.left}
            x2={W - PAD.right}
            y1={y(l.price)}
            y2={y(l.price)}
            stroke={LEVEL_COLOURS[l.kind] || LEVEL_COLOURS.level}
            strokeDasharray="5 4"
            strokeWidth="1.5"
          />
          <text
            x={W - PAD.right - 4}
            y={y(l.price) - 4}
            textAnchor="end"
            className="ac-candles__label"
            fill={LEVEL_COLOURS[l.kind] || LEVEL_COLOURS.level}
          >
            {l.label}
          </text>
        </g>
      ))}

      {maPath && <path d={maPath} className="ac-candles__ma" />}

      {candles.map((c, i) => {
        const up = c.c >= c.o;
        const isSel = selected?.has(i);
        const isAnswer = revealed?.has(i);
        return (
          <g
            key={i}
            className={`ac-candles__candle ${up ? "is-up" : "is-down"} ${isSel ? "is-selected" : ""} ${
              isAnswer ? "is-answer" : ""
            }`}
            onClick={interactive ? () => onPick(i) : undefined}
            style={interactive ? { cursor: "pointer" } : undefined}
          >
            {interactive && (
              <rect
                x={x(i) - slot / 2}
                width={slot}
                y={PAD.top}
                height={H - PAD.top - PAD.bottom}
                className="ac-candles__hit"
              />
            )}
            <line x1={x(i)} x2={x(i)} y1={y(c.h)} y2={y(c.l)} className="ac-candles__wick" />
            <rect
              x={x(i) - bw / 2}
              width={bw}
              y={y(Math.max(c.o, c.c))}
              height={Math.max(1.5, Math.abs(y(c.o) - y(c.c)))}
              className="ac-candles__body"
            />
            {labels[i] && (
              <text x={x(i)} y={H - 8} textAnchor="middle" className="ac-candles__tag">
                {labels[i]}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

/** Read-only chart. */
export function CandleView({ pair, timeframe, caption, data, levels, zones, ma, labels }) {
  return (
    <figure className="ac-candles">
      <div className="ac-candles__head">
        <strong>{pair}</strong>
        {timeframe && <span>{timeframe}</span>}
        {ma && <span className="ac-candles__legend">— {ma}-period SMA</span>}
      </div>
      <Chart data={data} levels={levels} zones={zones} ma={ma} labels={labels} />
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  );
}

/** Graded: select every candle matching the pattern. */
export default function CandleExercise({
  pair,
  timeframe,
  task,
  data,
  pattern,
  levels,
  ma,
  explain,
  onSolved,
  alreadySolved = false,
}) {
  const answer = useMemo(() => new Set(findPattern(data, pattern)), [data, pattern]);
  const [selected, setSelected] = useState(() => (alreadySolved ? new Set(answer) : new Set()));
  const [result, setResult] = useState(() =>
    alreadySolved ? { ok: true, message: "You already found these correctly." } : null
  );
  const [misses, setMisses] = useState(0);

  const pick = (i) => {
    if (result?.ok) return;
    setResult(null);
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  };

  const submit = () => {
    if (!selected.size) {
      setResult({ ok: false, message: "Click a candle to select it. Click again to unselect." });
      return;
    }
    const extra = [...selected].filter((i) => !answer.has(i));
    const missing = [...answer].filter((i) => !selected.has(i));
    if (!extra.length && !missing.length) {
      setResult({ ok: true, message: explain || `Correct — ${answer.size === 1 ? "that is the" : "those are every"} ${PATTERNS[pattern].label.toLowerCase()}.` });
      onSolved?.();
      return;
    }
    setMisses((m) => m + 1);
    const parts = [];
    if (extra.length) {
      parts.push(extra.length === 1 ? "one of your picks does not meet the definition" : `${extra.length} of your picks do not meet the definition`);
    }
    if (missing.length) {
      parts.push(missing.length === 1 ? "one qualifying candle is not selected yet" : `${missing.length} qualifying candles are not selected yet`);
    }
    setResult({
      ok: false,
      message: `Not yet: ${parts.join(", and ")}. Check each pick against the definition, not the overall look.`,
    });
  };

  return (
    <div className="ac-candles ac-candles--exercise">
      <div className="ac-candles__task">
        <span className="ac-note__label">Read the chart</span>
        <p>{task}</p>
      </div>
      <div className="ac-candles__head">
        <strong>{pair}</strong>
        {timeframe && <span>{timeframe}</span>}
        {ma && <span className="ac-candles__legend">— {ma}-period SMA</span>}
        <span className="ac-candles__count">{selected.size} selected</span>
      </div>
      <Chart
        data={data}
        levels={levels}
        ma={ma}
        selected={selected}
        revealed={misses >= 3 && !result?.ok ? answer : null}
        onPick={pick}
        interactive={!result?.ok}
      />
      <div className="ac-candles__check">
        <button className="ac-decide__btn" onClick={submit} disabled={result?.ok}>
          {result?.ok ? "Found" : "Check my candles"}
        </button>
        {result && (
          <p className={`ac-decide__feedback ${result.ok ? "is-ok" : "is-bad"}`} role="status">
            {result.message}
          </p>
        )}
        {misses >= 3 && !result?.ok && (
          <p className="ac-fxcalc__hint">
            <i className="fas fa-lightbulb" aria-hidden="true" /> The qualifying candles are outlined. Select
            exactly those, and look at why each one meets the definition.
          </p>
        )}
      </div>
    </div>
  );
}
