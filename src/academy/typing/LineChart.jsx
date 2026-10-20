import { useEffect, useRef, useState } from "react";
import { SERIES, INK, MUTED, GRID } from "../chartPalette";

/**
 * A single-series line chart with a hover crosshair.
 *
 * Uses the Academy's validated palette (brand blue, slot 1). One series, so
 * there is no legend box — the card title names it. Optional `marks` draws
 * small ticks along the baseline (errors per second on the run chart),
 * which share the axis and so do not need a second scale.
 */

/** A round step that splits `v` into about four gridlines: 5, 10, 20, 25, 50… */
function niceStep(v) {
  const raw = Math.max(1, v) / 4;
  const mag = 10 ** Math.floor(Math.log10(raw));
  for (const m of [1, 2, 2.5, 5, 10]) if (m * mag >= raw) return m * mag;
  return 10 * mag;
}

export default function LineChart({
  points, // [{ x, y, label?, sub? }]
  height = 200,
  yLabel = "WPM",
  marks, // optional [{ x, n }]
  marksLabel = "errors",
  formatX = (x) => x,
  ariaLabel,
}) {
  const [hover, setHover] = useState(null);
  const [W, setW] = useState(640);
  const svgRef = useRef(null);
  const boxRef = useRef(null);
  const H = height;
  const pad = { l: 40, r: 14, t: 18, b: 30 };

  const hasData = points.length > 0;

  // Draw at the real pixel width, so 11px labels stay 11px on any screen.
  useEffect(() => {
    const box = boxRef.current;
    if (!box) return;
    const ro = new ResizeObserver(([entry]) => setW(Math.max(280, Math.round(entry.contentRect.width))));
    ro.observe(box);
    return () => ro.disconnect();
  }, [hasData]);

  if (!points.length) return <p className="ty-chart__empty">Not enough data yet.</p>;

  const xs = points.map((p) => p.x);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const top = Math.max(...points.map((p) => p.y));
  const step = niceStep(top);
  const maxY = Math.ceil((top * 1.05) / step) * step || step;
  const sx = (x) => pad.l + (maxX === minX ? 0.5 : (x - minX) / (maxX - minX)) * (W - pad.l - pad.r);
  const sy = (y) => H - pad.b - (y / maxY) * (H - pad.t - pad.b);

  const d = points.map((p, i) => `${i ? "L" : "M"}${sx(p.x).toFixed(1)},${sy(p.y).toFixed(1)}`).join(" ");
  const area = `${d} L${sx(points.at(-1).x)},${sy(0)} L${sx(points[0].x)},${sy(0)} Z`;
  const ticks = [];
  for (let t = 0; t <= maxY + 1e-9; t += step) ticks.push(Math.round(t * 10) / 10);
  const xCount = W < 480 ? 3 : 5;
  const xTicks =
    points.length <= xCount + 3
      ? points
      : [...new Set(Array.from({ length: xCount }, (_, i) => Math.round((i / (xCount - 1)) * (points.length - 1))))].map((i) => points[i]);

  const onMove = (e) => {
    const rect = svgRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * W;
    let best = 0;
    for (let i = 1; i < points.length; i++)
      if (Math.abs(sx(points[i].x) - x) < Math.abs(sx(points[best].x) - x)) best = i;
    setHover(best);
  };

  const hp = hover !== null ? points[hover] : null;
  const hm = hp && marks ? marks.find((m) => m.x === hp.x) : null;

  return (
    <div className="ty-chart" ref={boxRef}>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label={ariaLabel}
        onPointerMove={onMove}
        onPointerLeave={() => setHover(null)}
      >
        {ticks.map((t) => (
          <g key={t}>
            <line x1={pad.l} x2={W - pad.r} y1={sy(t)} y2={sy(t)} stroke={GRID} strokeWidth="1" />
            <text x={pad.l - 8} y={sy(t) + 4} textAnchor="end" fontSize="11" fill={MUTED}>
              {t}
            </text>
          </g>
        ))}
        <text x={pad.l} y={11} fontSize="11" fill={MUTED}>
          {yLabel}
        </text>
        {xTicks.map((p, i) => (
          <text key={i} x={sx(p.x)} y={H - 10} textAnchor="middle" fontSize="11" fill={MUTED}>
            {formatX(p.x)}
          </text>
        ))}
        <path d={area} fill={SERIES[0]} opacity="0.08" />
        <path d={d} fill="none" stroke={SERIES[0]} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
        {marks?.filter((m) => m.n > 0).map((m) => (
          <g key={m.x}>
            <line x1={sx(m.x) - 3} x2={sx(m.x) + 3} y1={sy(0) - 9} y2={sy(0) - 3} stroke="#dc2626" strokeWidth="2" />
            <line x1={sx(m.x) + 3} x2={sx(m.x) - 3} y1={sy(0) - 9} y2={sy(0) - 3} stroke="#dc2626" strokeWidth="2" />
          </g>
        ))}
        {points.length <= 40 &&
          points.map((p, i) => (
            <circle key={i} cx={sx(p.x)} cy={sy(p.y)} r={hover === i ? 5 : 3} fill="#fff" stroke={SERIES[0]} strokeWidth="2" />
          ))}
        {hp && (
          <>
            <line x1={sx(hp.x)} x2={sx(hp.x)} y1={pad.t} y2={sy(0)} stroke={INK} strokeOpacity="0.25" strokeDasharray="3 3" />
            <circle cx={sx(hp.x)} cy={sy(hp.y)} r="5" fill={SERIES[0]} stroke="#fff" strokeWidth="2" />
          </>
        )}
      </svg>
      {hp && (
        <div
          className="ty-chart__tip"
          style={{ left: `${(sx(hp.x) / W) * 100}%`, transform: `translateX(${sx(hp.x) / W > 0.7 ? "-105%" : "8px"})` }}
        >
          <strong>{hp.label ?? formatX(hp.x)}</strong>
          <span>
            {hp.y} {yLabel}
          </span>
          {hp.sub && <span>{hp.sub}</span>}
          {hm && (
            <span>
              {hm.n} {marksLabel}
            </span>
          )}
        </div>
      )}
      {marks?.some((m) => m.n > 0) && (
        <p className="ty-chart__legend">
          <span className="ty-chart__x" aria-hidden="true">×</span> {marksLabel} in that second
        </p>
      )}
    </div>
  );
}
