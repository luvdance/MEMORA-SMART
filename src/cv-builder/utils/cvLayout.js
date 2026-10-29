// ── CV LAYOUT MEASUREMENT (for print + PDF) ──
// How tall the CV really is and whether it's a sidebar (flex-row) template.
// Measured on an off-screen copy at A4 width, so it works even when the
// preview is hidden (e.g. the phone's Edit tab) or scaled down on screen.
export function measureCvLayout(previewEl) {
  const probe = previewEl.cloneNode(true);
  Object.assign(probe.style, {
    position: "absolute",
    left: "-10000px",
    top: "0",
    width: "794px",
    minHeight: "0",
    transform: "none",
    margin: "0",
    visibility: "hidden",
    pointerEvents: "none",
  });
  document.body.appendChild(probe);
  const root = probe.firstElementChild;
  const height = root?.offsetHeight || probe.scrollHeight;
  const sidebar = !!root && getComputedStyle(root).display === "flex";
  probe.remove();
  return {
    height,
    sidebar,
    // A4 page = 1123px at 96dpi; the buffer absorbs small font differences.
    singlePage: height <= 1123 - 40,
    pages: Math.max(1, Math.ceil((height + 40) / 1123)),
  };
}
