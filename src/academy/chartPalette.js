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
export const SERIES = ["#3b52f0", "#d97706", "#0d9488", "#c026d3"];

/** Ink and grid tokens. Text never wears a series colour. */
export const INK = "#2a3050";
export const MUTED = "#7a819b";
export const GRID = "#e5e8f2";
