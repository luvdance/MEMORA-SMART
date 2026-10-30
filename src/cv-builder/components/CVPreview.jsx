import { useState, useEffect, useRef } from "react";
import {
  ClassicPro, ModernEdge, ExecutivePlus,
  MinimalClean, CreativeSide, CorporateBold, TraditionalProfile,
  EditorialModern, ModernTimeline, CompactPro, BoldStatement, Horizon, Refined, SignatureEdge, DarkGeo, Summit, Vantage,
} from "./CVTemplates";
import FormatPanel from "./FormatPanel";
import SectionOrderPanel from "./SectionOrderPanel";

const templates = [ClassicPro, ModernEdge, ExecutivePlus, MinimalClean, CreativeSide, CorporateBold, TraditionalProfile, EditorialModern, ModernTimeline, CompactPro, BoldStatement, Horizon, Refined, SignatureEdge, DarkGeo, Summit, Vantage,];

// A4 at 96dpi
const PAGE_WIDTH = 794;
const PAGE_HEIGHT = 1123;

//cv preview component
export default function CVPreview({
  cv, accent, template, previewRef, tab,
  format, setFormat, sectionOrder, setSectionOrder, theme,
  showFormat, setShowFormat,
  showOrder, setShowOrder,
}) {
  const TemplateComponent = templates[template];
  const [scale, setScale] = useState(1);
  const [pageHeight, setPageHeight] = useState(PAGE_HEIGHT);
  const wrapperRef = useRef();

  // Scale the A4 page to whatever width the preview actually has. Measuring the
  // wrapper (not the window) covers phones, small laptops and the open
  // Format/Reorder side panel alike. The page height is tracked too so the
  // scaled page's layout box can be shrunk to its visual size (see margins below),
  // which keeps multi-page CVs fully visible and scrollable.
  useEffect(() => {
    const wrapper = wrapperRef.current;
    const page = previewRef.current;
    if (!wrapper || !page) return;

    const measure = () => {
      const available = wrapper.clientWidth;
      // 0 while the panel is hidden (mobile form tab) — keep the last scale
      if (available > 0) {
        setScale(Math.min(1, Math.floor((available / PAGE_WIDTH) * 1000) / 1000));
      }
      if (page.offsetHeight > 0) setPageHeight(page.offsetHeight);
    };

    measure();
    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", measure);
      return () => window.removeEventListener("resize", measure);
    }
    const ro = new ResizeObserver(measure);
    ro.observe(wrapper);
    ro.observe(page);
    return () => ro.disconnect();
  }, [previewRef]);

  const handleFormatToggle = () => {
  setShowFormat(v => !v);
  setShowOrder(false);
};

const handleOrderToggle = () => {
  setShowOrder(v => !v);
  setShowFormat(false);
};

  const isScaled = scale < 1;

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
              template={template}
            />
          )}
        </div>
        {/* A4 PAGE */}
        <div className="cv-preview__page-wrapper" ref={wrapperRef}>
          <div
            className="cv-preview__page"
            ref={previewRef}
            style={{
              background: theme.bg,
              width: `${PAGE_WIDTH}px`,
              minHeight: `${PAGE_HEIGHT}px`,
              transform: isScaled ? `scale(${scale})` : undefined,
              transformOrigin: "top left",
              // A transform doesn't change layout size, so pull the right and
              // bottom edges in to match what's drawn. Print and PDF reset
              // margin/transform, so exports stay full-size A4.
              marginRight: isScaled ? `${-PAGE_WIDTH * (1 - scale)}px` : undefined,
              marginBottom: isScaled ? `${-pageHeight * (1 - scale)}px` : undefined,
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