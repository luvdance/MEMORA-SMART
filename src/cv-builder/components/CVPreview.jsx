import { useState, useEffect, useRef } from "react";
import {
  ClassicPro, ModernEdge, ExecutivePlus,
  MinimalClean, CreativeSide, CorporateBold, TraditionalProfile,
  EditorialModern, ModernTimeline, CompactPro, BoldStatement
} from "./CVTemplates";
import FormatPanel from "./FormatPanel";
import SectionOrderPanel from "./SectionOrderPanel";

const templates = [ClassicPro, ModernEdge, ExecutivePlus, MinimalClean, CreativeSide, CorporateBold, TraditionalProfile, EditorialModern, ModernTimeline, CompactPro, BoldStatement,];

export default function CVPreview({
  cv, accent, template, previewRef, tab,
  format, setFormat, sectionOrder, setSectionOrder, theme
}) {
  const TemplateComponent = templates[template];
  const [showFormat, setShowFormat] = useState(false);
  const [showOrder, setShowOrder] = useState(false);
  const [mobileScale, setMobileScale] = useState(1);
  const wrapperRef = useRef();

  // Compute mobile scale in JS — avoids unreliable CSS calc()-in-scale() across browsers
  useEffect(() => {
    const computeScale = () => {
      const isMobile = window.innerWidth <= 900;
      if (!isMobile) {
        setMobileScale(1);
        return;
      }
      const availableWidth = window.innerWidth - 32; // 16px padding each side
      const ratio = availableWidth / 794;
      setMobileScale(ratio);
    };

    computeScale();
    window.addEventListener("resize", computeScale);
    return () => window.removeEventListener("resize", computeScale);
  }, []);

  const handleFormatToggle = () => {
    setShowFormat(!showFormat);
    setShowOrder(false);
  };
  const handleOrderToggle = () => {
    setShowOrder(!showOrder);
    setShowFormat(false);
  };

  const isMobile = mobileScale !== 1;

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
        <div
          className="cv-preview__page-wrapper"
          ref={wrapperRef}
          style={isMobile ? { height: `${1123 * mobileScale}px`, overflow: "hidden" } : undefined}
        >
          <div
            className="cv-preview__page"
            ref={previewRef}
            style={{
              background: theme.bg,
              width: "794px",
              minHeight: "1123px",
              transform: isMobile ? `scale(${mobileScale})` : undefined,
              transformOrigin: "top left",
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