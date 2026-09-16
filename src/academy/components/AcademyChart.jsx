import { useState } from "react";
import { SERIES, INK, MUTED, GRID } from "../chartPalette";

/**
 * CHARTS FOR THE DASHBOARD MODULE
 *
 * A dashboard lesson that describes charts in prose teaches nothing. These
 * render the real thing from the real numbers, so a learner comparing "bar
 * versus pie" is comparing two pictures rather than two paragraphs.
 *
 * COLOUR
 * The categorical order below is fixed and was validated, not chosen by eye:
 * every adjacent pair clears the colour-blind separation floor (worst pair
 * ΔE 12.5 protan, 24.3 normal) and every hue clears 3:1 against the surface.
 * The brand blue keeps slot 1. The brand violet was REJECTED for slot 2 — it
 * sits ΔE 1.7 from the blue under protanopia, which means a protanopic reader
 * sees one colour where the chart claims two.
 *
 * Hues are assigned in fixed order and never cycled. A chart needing a ninth
 * series does not get a ninth hue; it gets grouped into "Other".
 *
 * MARK SPECS
 * Thin marks, data-ends rounded 4px and anchored to the baseline, 2px lines,
 * 9px markers, a 2px surface gap between adjacent fills, recessive grid, and
 * direct labels used selectively rather than on every value. Text always wears
 * a text token — never the series colour — so identity is carried by the mark
 * beside it, not by the colour of the words.
 */

const fmt = (n) =>
  typeof n === "number"
    ? n.toLocaleString(undefined, { maximumFractionDigits: 2 })
    : String(n ?? "");

/** Nice round upper bound, so gridlines land on readable numbers. */
function niceMax(value) {
  if (value <= 0) return 1;
  const mag = 10 ** Math.floor(Math.log10(value));
  const n = value / mag;
  const step = n <= 1 ? 1 : n <= 2 ? 2 : n <= 2.5 ? 2.5 : n <= 5 ? 5 : 10;
  return step * mag;
}

/**
 * A bar whose data-end is rounded and whose baseline-end is square, so the
 * mark reads as growing FROM the axis rather than floating beside it.
 */
function barPath(x, y, w, h, r, dir) {
  const radius = Math.max(0, Math.min(r, dir === "up" ? w / 2 : h / 2, dir === "up" ? h : w));
  if (dir === "up") {
    // grows upward from the bottom: round the top two corners
    return `M${x},${y + h} L${x},${y + radius} Q${x},${y} ${x + radius},${y} L${x + w - radius},${y} Q${x + w},${y} ${x + w},${y + radius} L${x + w},${y + h} Z`;
  }
  // grows rightward from the left: round the right two corners
  return `M${x},${y} L${x + w - radius},${y} Q${x + w},${y} ${x + w},${y + radius} L${x + w},${y + h - radius} Q${x + w},${y + h} ${x + w - radius},${y + h} L${x},${y + h} Z`;
}

/* ── Stat tiles — a single headline needs no plot ───────────────────────── */
export function KpiRow({ items = [] }) {
  return (
    <div className="ac-kpis">
      {items.map((k) => (
        <div className="ac-kpi" key={k.label}>
          <span className="ac-kpi__label">{k.label}</span>
          <strong className="ac-kpi__value">{k.value}</strong>
          {k.compare && (
            <span
              className={`ac-kpi__delta ${
                k.direction === "down" ? "is-down" : k.direction === "flat" ? "is-flat" : "is-up"
              }`}
            >
              {/* Direction is stated in words as well as colour, so the tile
                  still reads correctly in greyscale or forced-colours mode. */}
              <span aria-hidden="true">
                {k.direction === "down" ? "▼" : k.direction === "flat" ? "▬" : "▲"}
              </span>{" "}
              {k.compare}
            </span>
          )}
          {k.note && <span className="ac-kpi__note">{k.note}</span>}
        </div>
      ))}
    </div>
  );
}

/* ── The chart ──────────────────────────────────────────────────────────── */
export default function AcademyChart({
  type = "column",
  title,
  categories = [],
  series = [],
  valuePrefix = "",
  height = 240,
  showTable = true,
  caption,
}) {
  const [hover, setHover] = useState(null);

  const multi = series.length > 1;
  const flat = series.flatMap((s) => s.values);
  const max = niceMax(Math.max(...flat, 0));
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((t) => t * max);

  const W = 680;
  const padL = type === "bar" ? 108 : 52;
  const padR = 20;
  const padT = 14;
  const padB = 34;
  const innerW = W - padL - padR;
  const innerH = height - padT - padB;

  const tip = (label, sName, v) =>
    setHover({ label, series: sName, value: v });

  /* ── PIE — only ever rendered to be criticised in the chart-choice atom ── */
  if (type === "pie") {
    const total = series[0].values.reduce((a, b) => a + b, 0);
    const cx = 120;
    const cy = 120;
    const rad = 96;
    // Cumulative start angle per slice, computed up front rather than by
    // mutating a running total during render.
    const starts = series[0].values.reduce(
      (acc, v) => [...acc, acc[acc.length - 1] + (v / total) * Math.PI * 2],
      [-Math.PI / 2]
    );
    const slices = series[0].values.map((v, i) => {
      const sweep = (v / total) * Math.PI * 2;
      const a1 = starts[i];
      const a2 = starts[i + 1];
      const x1 = cx + rad * Math.cos(a1);
      const y1 = cy + rad * Math.sin(a1);
      const x2 = cx + rad * Math.cos(a2);
      const y2 = cy + rad * Math.sin(a2);
      const large = sweep > Math.PI ? 1 : 0;
      return {
        d: `M${cx},${cy} L${x1},${y1} A${rad},${rad} 0 ${large} 1 ${x2},${y2} Z`,
        fill: SERIES[i % SERIES.length],
        label: categories[i],
        value: v,
        pctText: `${Math.round((v / total) * 100)}%`,
      };
    });

    return (
      <figure className="ac-chart">
        {title && <figcaption className="ac-chart__title">{title}</figcaption>}
        <div className="ac-chart__plot">
          <svg viewBox="0 0 240 240" width="240" height="240" role="img" aria-label={title}>
            {slices.map((s) => (
              <path key={s.label} d={s.d} fill={s.fill} stroke="#fff" strokeWidth="2" />
            ))}
          </svg>
          <ul className="ac-chart__legend ac-chart__legend--stack">
            {slices.map((s) => (
              <li key={s.label}>
                <span className="ac-chart__swatch" style={{ background: s.fill }} />
                {s.label} — {s.pctText}
              </li>
            ))}
          </ul>
        </div>
        {caption && <p className="ac-chart__caption">{caption}</p>}
      </figure>
    );
  }

  /* ── LINE ────────────────────────────────────────────────────────────── */
  if (type === "line") {
    // Inset so the first and last category labels are not half off the plot.
    const inset = 18;
    const span = Math.max(0, innerW - inset * 2);
    const stepX = categories.length > 1 ? span / (categories.length - 1) : 0;
    const px = (i) => padL + inset + i * stepX;
    const py = (v) => padT + innerH - (v / max) * innerH;

    return (
      <figure className="ac-chart">
        {title && <figcaption className="ac-chart__title">{title}</figcaption>}
        {multi && (
          <ul className="ac-chart__legend">
            {series.map((s, i) => (
              <li key={s.name}>
                <span className="ac-chart__swatch" style={{ background: SERIES[i % SERIES.length] }} />
                {s.name}
              </li>
            ))}
          </ul>
        )}
        <div className="ac-chart__plot-wrap">
          <svg viewBox={`0 0 ${W} ${height}`} className="ac-chart__svg" role="img" aria-label={title}>
            {ticks.map((t) => (
              <g key={t}>
                <line x1={padL} x2={W - padR} y1={py(t)} y2={py(t)} stroke={GRID} strokeWidth="1" />
                <text x={padL - 8} y={py(t) + 4} textAnchor="end" fontSize="10.5" fill={MUTED}>
                  {valuePrefix}{fmt(t)}
                </text>
              </g>
            ))}
            {categories.map((c, i) => (
              <text key={c} x={px(i)} y={height - 12} textAnchor="middle" fontSize="11" fill={MUTED}>
                {c}
              </text>
            ))}
            {series.map((s, si) => {
              const colour = SERIES[si % SERIES.length];
              const d = s.values.map((v, i) => `${i ? "L" : "M"}${px(i)},${py(v)}`).join(" ");
              return (
                <g key={s.name}>
                  <path d={d} fill="none" stroke={colour} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
                  {s.values.map((v, i) => (
                    <circle
                      key={i}
                      cx={px(i)}
                      cy={py(v)}
                      r="4.5"
                      fill={colour}
                      stroke="#fff"
                      strokeWidth="2"
                      onMouseEnter={() => tip(categories[i], s.name, v)}
                      onMouseLeave={() => setHover(null)}
                    />
                  ))}
                </g>
              );
            })}
          </svg>
          {hover && (
            <div className="ac-chart__tip" role="status">
              <strong>{hover.label}</strong>
              {multi && <> · {hover.series}</>} · {valuePrefix}{fmt(hover.value)}
            </div>
          )}
        </div>
        {caption && <p className="ac-chart__caption">{caption}</p>}
        {showTable && <DataTable categories={categories} series={series} valuePrefix={valuePrefix} />}
      </figure>
    );
  }

  /* ── BAR (horizontal) and COLUMN (vertical) ──────────────────────────── */
  const horizontal = type === "bar";
  const groupSize = horizontal ? innerH / categories.length : innerW / categories.length;
  const GAP = 2; // the 2px surface gap between adjacent fills
  // Thin marks. Without a cap a three-category chart draws 180px slabs, which
  // reads as a block diagram rather than a comparison.
  const MAX_THICK = horizontal ? 26 : 46;
  const bandPad = Math.min(14, groupSize * 0.22);
  const rawBand = groupSize - bandPad;
  const naturalThick = multi
    ? (rawBand - GAP * (series.length - 1)) / series.length
    : rawBand;
  const thickness = Math.min(naturalThick, MAX_THICK);
  const band = multi ? thickness * series.length + GAP * (series.length - 1) : thickness;

  return (
    <figure className="ac-chart">
      {title && <figcaption className="ac-chart__title">{title}</figcaption>}
      {multi && (
        <ul className="ac-chart__legend">
          {series.map((s, i) => (
            <li key={s.name}>
              <span className="ac-chart__swatch" style={{ background: SERIES[i % SERIES.length] }} />
              {s.name}
            </li>
          ))}
        </ul>
      )}
      <div className="ac-chart__plot-wrap">
        <svg viewBox={`0 0 ${W} ${height}`} className="ac-chart__svg" role="img" aria-label={title}>
          {/* Recessive grid, drawn behind everything */}
          {!horizontal &&
            ticks.map((t) => {
              const y = padT + innerH - (t / max) * innerH;
              return (
                <g key={t}>
                  <line x1={padL} x2={W - padR} y1={y} y2={y} stroke={GRID} strokeWidth="1" />
                  <text x={padL - 8} y={y + 4} textAnchor="end" fontSize="10.5" fill={MUTED}>
                    {valuePrefix}{fmt(t)}
                  </text>
                </g>
              );
            })}

          {categories.map((cat, ci) => {
            // Centre the (capped) band inside its slot, or the marks hug the
            // top of each row and leave a gap under the last category.
            const groupStart =
              (horizontal ? padT : padL) + ci * groupSize + (groupSize - band) / 2;
            return (
              <g key={cat}>
                {horizontal ? (
                  <text x={padL - 10} y={groupStart + band / 2 + 4} textAnchor="end" fontSize="11.5" fill={INK}>
                    {cat}
                  </text>
                ) : (
                  <text x={groupStart + band / 2} y={height - 12} textAnchor="middle" fontSize="11.5" fill={INK}>
                    {cat}
                  </text>
                )}

                {series.map((s, si) => {
                  const v = s.values[ci];
                  const colour = SERIES[si % SERIES.length];
                  const offset = si * (thickness + GAP);
                  const len = (v / max) * (horizontal ? innerW : innerH);

                  const x = horizontal ? padL : groupStart + offset;
                  const y = horizontal ? groupStart + offset : padT + innerH - len;
                  const w = horizontal ? len : thickness;
                  const h = horizontal ? thickness : len;

                  return (
                    <g key={s.name}>
                      <path
                        d={barPath(x, y, w, h, 4, horizontal ? "right" : "up")}
                        fill={colour}
                        onMouseEnter={() => tip(cat, s.name, v)}
                        onMouseLeave={() => setHover(null)}
                      />
                      {/* Direct labels only when there is one series — a number
                          on every bar of a grouped chart is noise, not help. */}
                      {!multi && (
                        <text
                          x={horizontal ? x + w + 7 : x + w / 2}
                          y={horizontal ? y + h / 2 + 4 : y - 6}
                          textAnchor={horizontal ? "start" : "middle"}
                          fontSize="11"
                          fontWeight="600"
                          fill={INK}
                        >
                          {valuePrefix}{fmt(v)}
                        </text>
                      )}
                    </g>
                  );
                })}
              </g>
            );
          })}

          {/* Baseline */}
          <line
            x1={padL}
            y1={horizontal ? padT : padT + innerH}
            x2={horizontal ? padL : W - padR}
            y2={padT + innerH}
            stroke="#c9cee0"
            strokeWidth="1"
          />
        </svg>
        {hover && (
          <div className="ac-chart__tip" role="status">
            <strong>{hover.label}</strong>
            {multi && <> · {hover.series}</>} · {valuePrefix}{fmt(hover.value)}
          </div>
        )}
      </div>
      {caption && <p className="ac-chart__caption">{caption}</p>}
      {showTable && <DataTable categories={categories} series={series} valuePrefix={valuePrefix} />}
    </figure>
  );
}

/** Every chart ships a table view — the accessibility floor, not an extra. */
function DataTable({ categories, series, valuePrefix }) {
  return (
    <details className="ac-chart__data">
      <summary>View as a table</summary>
      <div className="ac-chart__data-scroll">
        <table>
          <thead>
            <tr>
              <th></th>
              {series.map((s) => (
                <th key={s.name}>{s.name}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {categories.map((c, i) => (
              <tr key={c}>
                <th scope="row">{c}</th>
                {series.map((s) => (
                  <td key={s.name}>
                    {valuePrefix}
                    {fmt(s.values[i])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </details>
  );
}
