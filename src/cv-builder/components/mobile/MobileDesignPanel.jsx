import { memo, useEffect, useRef, useState } from "react";
import { TEMPLATES, ACCENT, THEME_PRESETS, FONT_OPTIONS } from "../../utils/constants";
import { TEMPLATE_INFO } from "../../utils/sampleCV";
import { isPremiumTemplate } from "../../utils/templateMeta";
import { TEMPLATE_COMPONENTS } from "../templateRegistry";
import SectionOrderPanel from "../SectionOrderPanel";
import FormatPanel from "../FormatPanel";

const SEGMENTS = [
  { id: "templates", label: "Templates", icon: "fa-table-cells-large" },
  { id: "colors", label: "Colours", icon: "fa-droplet" },
  { id: "fonts", label: "Fonts", icon: "fa-font" },
  { id: "order", label: "Order", icon: "fa-arrow-down-short-wide" },
  { id: "format", label: "Spacing", icon: "fa-sliders" },
];

// A few extra accents that print well, alongside the brand set.
const EXTRA_ACCENTS = ["#0f172a", "#0ea5e9", "#16a34a", "#b45309", "#be185d"];

// The user's own CV drawn small in a template — the real thing, not a stock image.
const TemplateThumb = memo(function TemplateThumb({ index, cv, accent, format, sectionOrder, theme }) {
  const Template = TEMPLATE_COMPONENTS[index];
  return (
    <div className="mapp-thumb__viewport" aria-hidden="true">
      <div className="mapp-thumb__page" style={{ background: theme.bg }}>
        <Template cv={cv} accent={accent} format={format} sectionOrder={sectionOrder} theme={theme} />
      </div>
    </div>
  );
});

export default function MobileDesignPanel({
  cv, template, setTemplate, accent, setAccent, theme, setTheme,
  format, setFormat, sectionOrder, setSectionOrder, entitlement,
}) {
  const [segment, setSegment] = useState("templates");
  const [thumbScale, setThumbScale] = useState(0.2);
  const gridRef = useRef(null);

  // Scale the 794px-wide A4 page to the real thumbnail width.
  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return undefined;
    const measure = () => {
      const viewport = grid.querySelector(".mapp-thumb__viewport");
      if (viewport?.clientWidth) setThumbScale(viewport.clientWidth / 794);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(grid);
    return () => ro.disconnect();
  }, [segment]);

  const accents = [...new Set([TEMPLATE_INFO[template]?.accent, ...ACCENT, ...EXTRA_ACCENTS].filter(Boolean))];

  return (
    <div className="mapp-design">
      <div className="mapp-segments" role="tablist" aria-label="Design options">
        {SEGMENTS.map((s) => (
          <button
            key={s.id}
            role="tab"
            aria-selected={segment === s.id}
            className={`mapp-segments__btn ${segment === s.id ? "mapp-segments__btn--active" : ""}`}
            onClick={() => setSegment(s.id)}
          >
            <i className={`fas ${s.icon}`}></i>
            <span>{s.label}</span>
          </button>
        ))}
      </div>

      {segment === "templates" && (
        <div className="mapp-thumbs" ref={gridRef} style={{ "--thumb-scale": thumbScale }}>
          {TEMPLATES.map((name, i) => {
            const selected = template === i;
            const locked = isPremiumTemplate(i) && !entitlement?.premium;
            return (
              <button
                key={name}
                className={`mapp-thumb ${selected ? "mapp-thumb--selected" : ""}`}
                onClick={() => setTemplate(i)}
                aria-pressed={selected}
                aria-label={`${name}${isPremiumTemplate(i) ? ", Premium template" : ""}`}
              >
                <TemplateThumb
                  index={i}
                  cv={cv}
                  accent={selected ? accent : TEMPLATE_INFO[i]?.accent || accent}
                  format={format}
                  sectionOrder={sectionOrder}
                  theme={theme}
                />
                {isPremiumTemplate(i) && (
                  <span className={`mapp-thumb__badge ${locked ? "" : "mapp-thumb__badge--owned"}`}>
                    <i className="fas fa-crown"></i> {locked ? "Premium" : "Unlocked"}
                  </span>
                )}
                {selected && <span className="mapp-thumb__check"><i className="fas fa-check"></i></span>}
                <span className="mapp-thumb__name">{name}</span>
              </button>
            );
          })}
        </div>
      )}

      {segment === "colors" && (
        <div className="mapp-card">
          <h4 className="mapp-card__title">Accent colour</h4>
          <div className="mapp-swatches">
            {accents.map((c) => (
              <button
                key={c}
                className={`mapp-swatch ${accent === c ? "mapp-swatch--active" : ""}`}
                style={{ background: c }}
                onClick={() => setAccent(c)}
                aria-label={`Accent ${c}`}
                aria-pressed={accent === c}
              >
                {accent === c && <i className="fas fa-check"></i>}
              </button>
            ))}
            <label className="mapp-swatch mapp-swatch--custom" aria-label="Custom colour">
              <i className="fas fa-eye-dropper"></i>
              <input type="color" value={accent} onChange={(e) => setAccent(e.target.value)} />
            </label>
          </div>

          <h4 className="mapp-card__title">Page theme</h4>
          <div className="mapp-themes">
            {THEME_PRESETS.map((p) => {
              const active = theme.bg === p.bg && theme.text === p.text;
              return (
                <button
                  key={p.label}
                  className={`mapp-theme ${active ? "mapp-theme--active" : ""}`}
                  onClick={() => setTheme({ bg: p.bg, text: p.text, sidebar: p.sidebar })}
                  aria-pressed={active}
                >
                  <span className="mapp-theme__preview" style={{ background: p.bg }}>
                    <span style={{ background: p.sidebar }} />
                    <em style={{ color: p.text }}>Aa</em>
                  </span>
                  <span className="mapp-theme__name">{p.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {segment === "fonts" && (
        <div className="mapp-card mapp-fonts">
          {FONT_OPTIONS.map((f) => {
            const active = format.fontFamily === f.value;
            return (
              <button
                key={f.label}
                className={`mapp-font ${active ? "mapp-font--active" : ""}`}
                onClick={() => setFormat({ ...format, fontFamily: f.value })}
                aria-pressed={active}
              >
                <span className="mapp-font__sample" style={{ fontFamily: f.value }}>Aa</span>
                <span className="mapp-font__name" style={{ fontFamily: f.value }}>{f.label}</span>
                {active && <i className="fas fa-circle-check"></i>}
              </button>
            );
          })}
        </div>
      )}

      {segment === "order" && (
        <div className="mapp-card">
          <SectionOrderPanel sectionOrder={sectionOrder} setSectionOrder={setSectionOrder} template={template} />
        </div>
      )}

      {segment === "format" && (
        <div className="mapp-card">
          <FormatPanel format={format} setFormat={setFormat} />
        </div>
      )}
    </div>
  );
}
