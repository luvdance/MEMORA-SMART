import { memo } from "react";
import { TEMPLATE_COMPONENTS } from "./templateRegistry";

// The user's own CV drawn small in a template, not a stock image.
// `scale` maps the 794px A4 page onto the thumbnail width.
const TemplateThumb = memo(function TemplateThumb({ index, cv, accent, format, sectionOrder, theme, scale }) {
  const Template = TEMPLATE_COMPONENTS[index];
  return (
    <div className="cv-thumb" aria-hidden="true">
      <div className="cv-thumb__page" style={{ background: theme.bg, transform: `scale(${scale})` }}>
        <Template cv={cv} accent={accent} format={format} sectionOrder={sectionOrder} theme={theme} />
      </div>
    </div>
  );
});

export default TemplateThumb;
