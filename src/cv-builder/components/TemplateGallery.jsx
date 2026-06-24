import { useState } from "react";
import {
  ClassicPro, ModernEdge, ExecutivePlus, MinimalClean,
  CreativeSide, CorporateBold, TraditionalProfile,
} from "./CVTemplates";
import { SAMPLE_CV, SAMPLE_FORMAT, SAMPLE_SECTION_ORDER, TEMPLATE_INFO } from "../utils/sampleCV";

const TEMPLATE_COMPONENTS = [
  ClassicPro, ModernEdge, ExecutivePlus, MinimalClean,
  CreativeSide, CorporateBold, TraditionalProfile,
];

export default function TemplateGallery({ onSelectTemplate }) {
  const [expandedIndex, setExpandedIndex] = useState(null);

  return (
    <>
      <div className="cvl__gallery-grid">
        {TEMPLATE_COMPONENTS.map((TemplateComp, i) => {
          const info = TEMPLATE_INFO[i];
          return (
            <div className="cvl__gallery-card" key={i}>
              <div
                className="cvl__gallery-thumb"
                onClick={() => setExpandedIndex(i)}
                >
                <div className="cvl__gallery-thumb-inner">
                    <div
                    className="cvl__gallery-page"
                    style={{ background: info.theme.bg, width: "794px", minHeight: "1123px" }}
                    >
                    <TemplateComp
                        cv={SAMPLE_CV}
                        accent={info.accent}
                        format={SAMPLE_FORMAT}
                        sectionOrder={SAMPLE_SECTION_ORDER}
                        theme={info.theme}
                    />
                    </div>
                </div>
                <div className="cvl__gallery-expand">
                    <i className="fas fa-search-plus"></i> Click to preview
                </div>
                </div>
              <div className="cvl__gallery-footer">
                <span className="cvl__gallery-name">{info.name}</span>
                <button
                  className="cvl__gallery-use-btn"
                  onClick={() => onSelectTemplate(i)}
                >
                  Use This <i className="fas fa-arrow-right"></i>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* EXPANDED MODAL */}
      {expandedIndex !== null && (
        <div className="cvl__gallery-modal" onClick={() => setExpandedIndex(null)}>
          <div className="cvl__gallery-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="cvl__gallery-modal-header">
              <h3>{TEMPLATE_INFO[expandedIndex].name}</h3>
              <button onClick={() => setExpandedIndex(null)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="cvl__gallery-modal-body">
            {(() => {
                const TemplateComp = TEMPLATE_COMPONENTS[expandedIndex];
                const info = TEMPLATE_INFO[expandedIndex];
                return (
                <div
                    className="cvl__gallery-page"
                    style={{ background: info.theme.bg, width: "794px", minHeight: "1123px" }}
                >
                    <TemplateComp
                    cv={SAMPLE_CV}
                    accent={info.accent}
                    format={SAMPLE_FORMAT}
                    sectionOrder={SAMPLE_SECTION_ORDER}
                    theme={info.theme}
                    />
                </div>
                );
            })()}
            </div>
            <div className="cvl__gallery-modal-footer">
              <button
                className="cvl__btn-primary"
                onClick={() => onSelectTemplate(expandedIndex)}
              >
                <i className="fas fa-magic"></i> Use This Template
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
