import { FONT_OPTIONS } from "../utils/constants";

function Slider({ label, value, min, max, step = 1, onChange, unit = "" }) {
  return (
    <div className="fmt-field">
      <div className="fmt-field__label">
        {label} <span className="fmt-field__value">{value}{unit}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="fmt-slider"
      />
      <div className="fmt-field__range">
        <span>{min}{unit}</span>
        <span>{max}{unit}</span>
      </div>
    </div>
  );
}

function Toggle({ label, value, onChange, style }) {
  return (
    <button
      className={`fmt-toggle ${value ? "fmt-toggle--active" : ""}`}
      onClick={() => onChange(!value)}
      style={style}
    >
      {label}
    </button>
  );
}

export default function FormatPanel({ format, setFormat }) {
  const upd = (key, val) => setFormat((f) => ({ ...f, [key]: val }));

  const resetFormat = () => setFormat({
    fontFamily: "Georgia, serif",
    nameFontSize: 24,
    nameBold: true,
    nameItalic: false,
    headingFontSize: 11,
    headingBold: true,
    headingItalic: false,
    headingUppercase: true,
    bodyFontSize: 11,
    lineHeight: 1.6,
    pagePadding: 40,
  });

  return (
    <div className="fmt-panel">
      <div className="fmt-panel__header">
        <div className="fmt-panel__title">
          <i className="fas fa-sliders-h"></i> Format
        </div>
        <button className="fmt-reset" onClick={resetFormat}>
          <i className="fas fa-undo"></i> Reset
        </button>
      </div>

      {/* FONT FAMILY */}
      <div className="fmt-section">
        <div className="fmt-section__label">Font Family</div>
        <div className="fmt-fonts">
          {FONT_OPTIONS.map((f) => (
            <button
              key={f.value}
              className={`fmt-font-btn ${format.fontFamily === f.value ? "fmt-font-btn--active" : ""}`}
              style={{ fontFamily: f.value }}
              onClick={() => upd("fontFamily", f.value)}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* NAME STYLE */}
      <div className="fmt-section">
        <div className="fmt-section__label">Name Style</div>
        <Slider
          label="Name Size"
          value={format.nameFontSize}
          min={16}
          max={32}
          onChange={(v) => upd("nameFontSize", v)}
          unit="px"
        />
        <div className="fmt-toggles">
          <Toggle
            label="B"
            value={format.nameBold}
            onChange={(v) => upd("nameBold", v)}
            style={{ fontWeight: "bold" }}
          />
          <Toggle
            label="I"
            value={format.nameItalic}
            onChange={(v) => upd("nameItalic", v)}
            style={{ fontStyle: "italic" }}
          />
        </div>
      </div>

      {/* HEADING STYLE */}
      <div className="fmt-section">
        <div className="fmt-section__label">Section Headings</div>
        <Slider
          label="Heading Size"
          value={format.headingFontSize}
          min={8}
          max={16}
          onChange={(v) => upd("headingFontSize", v)}
          unit="px"
        />
        <div className="fmt-toggles">
          <Toggle
            label="B"
            value={format.headingBold}
            onChange={(v) => upd("headingBold", v)}
            style={{ fontWeight: "bold" }}
          />
          <Toggle
            label="I"
            value={format.headingItalic}
            onChange={(v) => upd("headingItalic", v)}
            style={{ fontStyle: "italic" }}
          />
          <Toggle
            label="AA"
            value={format.headingUppercase}
            onChange={(v) => upd("headingUppercase", v)}
          />
        </div>
      </div>

      {/* BODY */}
      <div className="fmt-section">
        <div className="fmt-section__label">Body Text</div>
        <Slider
          label="Body Size"
          value={format.bodyFontSize}
          min={8}
          max={14}
          onChange={(v) => upd("bodyFontSize", v)}
          unit="px"
        />
      </div>

      {/* SPACING */}
      <div className="fmt-section">
        <div className="fmt-section__label">Spacing</div>
        <Slider
          label="Line Height"
          value={format.lineHeight}
          min={1.2}
          max={2.0}
          step={0.1}
          onChange={(v) => upd("lineHeight", v)}
        />
        <Slider
          label="Page Padding"
          value={format.pagePadding}
          min={20}
          max={60}
          onChange={(v) => upd("pagePadding", v)}
          unit="px"
        />
      </div>
    </div>
  );
}