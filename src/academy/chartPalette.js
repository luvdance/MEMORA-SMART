/**
 * CATEGORICAL PALETTE — validated, not chosen by eye.
 *
 * Verified with the six-check validator against the white chart surface:
 *   lightness band PASS · chroma floor PASS · contrast PASS
 *   CVD separation  worst adjacent pair ΔE 12.5 (protan)
 *   normal vision   worst adjacent pair ΔE 24.3
 *
 * Slot 1 is the brand blue. The brand violet (#8b2cff) was REJECTED for slot 2:
 * it sits ΔE 1.7 from that blue under protanopia, so a protanopic reader would
 * see one colour where the chart claims two.
 *
 * Hues are assigned in this fixed order and never cycled. A chart that needs a
 * ninth series does not get a ninth hue — it gets an "Other" group.
 *
 * Lives in its own module so the chart component exports only components and
 * keeps fast refresh working.
 */
/*
 * Each colour is a CSS variable with the light value as its fallback, so the
 * SVG follows the Academy theme without re-rendering. The dark-mode values
 * (academy.css, --ac-chart-*) are the same hues lifted to hold contrast on the
 * dark card; slot order and the CVD separation are unchanged.
 */
export const SERIES = [
  "var(--ac-chart-s1, #3b52f0)",
  "var(--ac-chart-s2, #d97706)",
  "var(--ac-chart-s3, #0d9488)",
  "var(--ac-chart-s4, #c026d3)",
];

/** Ink and grid tokens. Text never wears a series colour. */
export const INK = "var(--ac-chart-ink, #2a3050)";
export const MUTED = "var(--ac-chart-muted, #7a819b)";
export const GRID = "var(--ac-chart-grid, #e5e8f2)";
/** The baseline axis, a step stronger than the grid. */
export const AXIS = "var(--ac-chart-axis, #c9cee0)";
/** Gaps between marks (pie slices, dots) are cut in the card colour. */
export const SURFACE = "var(--ac-surface, #fff)";
