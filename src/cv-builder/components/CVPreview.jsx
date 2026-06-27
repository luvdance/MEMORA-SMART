import {
  ClassicPro, ModernEdge, ExecutivePlus,
  MinimalClean, CreativeSide, CorporateBold, TraditionalProfile,
  EditorialModern, ModernTimeline
} from "./CVTemplates";

const templates = [ClassicPro, ModernEdge, ExecutivePlus, MinimalClean, CreativeSide, CorporateBold, TraditionalProfile, EditorialModern, ModernTimeline];

export default function CVPreview({
  cv, accent, template, previewRef, tab,
  format, setFormat, sectionOrder, setSectionOrder, theme
}) {
  const TemplateComponent = templates[template];
  const [showFormat, setShowFormat] = useState(false);
  const [showOrder, setShowOrder] = useState(false);

  const handleFormatToggle = () => {
    setShowFormat(!showFormat);
    setShowOrder(false);
  };

  const handleOrderToggle = () => {
    setShowOrder(!showOrder);
    setShowFormat(false);
  };

  return (
    <div className={`cv-preview-panel ${tab === "form" ? "cv-preview-panel--hidden" : ""}`}>

      {/* TOOLBAR */}
      <div className="cv-preview__toolbar">
        <p className="cv-preview__label">
          <i className="fas fa-eye"></i> Live Preview (A4)
        </p>
        <div style={{ display: "flex", gap: "8px" }}>
          <button
            className={`cv-preview__format-btn ${showOrder ? "cv-preview__format-btn--active" : ""}`}
            onClick={handleOrderToggle}
          >
            <i className="fas fa-sort"></i>
            {showOrder ? "Close Order" : "Reorder"}
          </button>
          <button
            className={`cv-preview__format-btn ${showFormat ? "cv-preview__format-btn--active" : ""}`}
            onClick={handleFormatToggle}
          >
            <i className={`fas ${showFormat ? "fa-times" : "fa-sliders-h"}`}></i>
            {showFormat ? "Close Format" : "Format"}
          </button>
        </div>
      </div>

      {/* WORKSPACE */}
      <div className="cv-preview__workspace">

        {/* SIDE PANEL */}
        <div className={`fmt-panel-wrapper ${(showFormat || showOrder) ? "fmt-panel-wrapper--open" : ""}`}>
          {showFormat && <FormatPanel format={format} setFormat={setFormat} />}
          {showOrder && (
            <SectionOrderPanel
              sectionOrder={sectionOrder}
              setSectionOrder={setSectionOrder}
            />
          )}
        </div>

        {/* A4 PAGE */}
        <div className="cv-preview__page-wrapper">
          <div
            className="cv-preview__page"
            ref={previewRef}
            style={{
              background: theme.bg,
              width: "794px",
              minHeight: "1123px",
            }}
          >
            <TemplateComponent
              cv={cv}
              accent={accent}
              format={format}
              sectionOrder={sectionOrder}
              theme={theme}
            />
          </div>
        </div>

      </div>
    </div>
  );
}