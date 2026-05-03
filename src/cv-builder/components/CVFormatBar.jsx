const FONTS = [
  { label: "Georgia (Classic)", value: "Georgia, serif" },
  { label: "Times New Roman", value: "'Times New Roman', Times, serif" },
  { label: "Garamond", value: "Garamond, serif" },
  { label: "Helvetica", value: "'Helvetica Neue', Helvetica, sans-serif" },
  { label: "Arial", value: "Arial, sans-serif" },
  { label: "Calibri", value: "Calibri, sans-serif" },
  { label: "Raleway", value: "Raleway, sans-serif" },
  { label: "Lato", value: "Lato, sans-serif" },
];

const LINE_HEIGHTS = [
  { label: "Compact", value: 1.4 },
  { label: "Normal", value: 1.6 },
  { label: "Relaxed", value: 1.8 },
];

export default function CVFormatBar({ formatting, setFormatting }) {
  const update = (key, value) =>
    setFormatting((prev) => ({ ...prev, [key]: value }));

  return (
    <div className="cv-format-bar">

      {/* FONT FAMILY */}
      <div className="cv-format-bar__group">
        <span className="cv-format-bar__label">Font:</span>
        <select
          className="cv-format-bar__select"
          value={formatting.font}
          onChange={(e) => update("font", e.target.value)}
          style={{ fontFamily: formatting.font }}
        >
          {FONTS.map((f) => (
            <option key={f.value} value={f.value} style={{ fontFamily: f.value }}>
              {f.label}
            </option>
          ))}
        </select>
      </div>

      <div className="cv-format-bar__divider" />

      {/* FONT SIZE */}
      <div className="cv-format-bar__group">
        <span className="cv-format-bar__label">Size:</span>
        <div className="cv-format-bar__size-row">
          <button
            className="cv-format-bar__size-btn"
            onClick={() => update("fontSize", Math.max(9, formatting.fontSize - 1))}
          >
            −
          </button>
          <span className="cv-format-bar__size-val">{formatting.fontSize}pt</span>
          <button
            className="cv-format-bar__size-btn"
            onClick={() => update("fontSize", Math.min(14, formatting.fontSize + 1))}
          >
            +
          </button>
        </div>
      </div>

      <div className="cv-format-bar__divider" />

      {/* LINE HEIGHT */}
      <div className="cv-format-bar__group">
        <span className="cv-format-bar__label">Spacing:</span>
        {LINE_HEIGHTS.map((l) => (
          <button
            key={l.value}
            className={`cv-format-bar__spacing-btn ${formatting.lineHeight === l.value ? "cv-format-bar__spacing-btn--active" : ""}`}
            onClick={() => update("lineHeight", l.value)}
          >
            {l.label}
          </button>
        ))}
      </div>

      <div className="cv-format-bar__divider" />

      {/* HEADING WEIGHT */}
      <div className="cv-format-bar__group">
        <span className="cv-format-bar__label">Headings:</span>
        <button
          className={`cv-format-bar__spacing-btn ${formatting.headingWeight === "normal" ? "cv-format-bar__spacing-btn--active" : ""}`}
          onClick={() => update("headingWeight", "normal")}
        >
          Regular
        </button>
        <button
          className={`cv-format-bar__spacing-btn ${formatting.headingWeight === "bold" ? "cv-format-bar__spacing-btn--active" : ""}`}
          onClick={() => update("headingWeight", "bold")}
        >
          Bold
        </button>
        <button
          className={`cv-format-bar__spacing-btn ${formatting.headingWeight === "900" ? "cv-format-bar__spacing-btn--active" : ""}`}
          onClick={() => update("headingWeight", "900")}
        >
          Heavy
        </button>
      </div>

      <div className="cv-format-bar__divider" />

      {/* RESET */}
      <div className="cv-format-bar__group">
        <button
          className="cv-format-bar__spacing-btn"
          onClick={() => setFormatting({
            font: "Georgia, serif",
            fontSize: 11,
            lineHeight: 1.6,
            headingWeight: "bold",
            spacing: "normal",
          })}
        >
          <i className="fas fa-undo" style={{ fontSize: "0.7rem" }}></i> Reset
        </button>
      </div>

    </div>
  );
}