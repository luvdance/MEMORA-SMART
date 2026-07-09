import { useState, useEffect, useRef } from "react";
import {
  ClassicPro, ModernEdge, ExecutivePlus, MinimalClean,
  CreativeSide, CorporateBold, TraditionalProfile, EditorialModern, ModernTimeline, CompactPro, BoldStatement, SignatureEdge, DarkGeo
} from "./CVTemplates";
import { SAMPLE_CV, SAMPLE_FORMAT, SAMPLE_SECTION_ORDER, TEMPLATE_INFO } from "../utils/sampleCV";



const TEMPLATE_COMPONENTS = [
  ClassicPro, ModernEdge, ExecutivePlus, MinimalClean,
  CreativeSide, CorporateBold, TraditionalProfile, EditorialModern, ModernTimeline, CompactPro, BoldStatement, SignatureEdge, DarkGeo
];

export default function TemplateGallery({ onSelectTemplate }) {
  const [activeIndex, setActiveIndex] = useState(2); // start centered-ish
  const [expandedIndex, setExpandedIndex] = useState(null);

  const goTo = (i) => {
    const total = TEMPLATE_COMPONENTS.length;
    setActiveIndex(((i % total) + total) % total);
  };

  const goPrev = () => goTo(activeIndex - 1);
  const goNext = () => goTo(activeIndex + 1);

  const total = TEMPLATE_COMPONENTS.length;

  const modalPrev = () => {
    setExpandedIndex((prev) => (prev - 1 + total) % total);
  };

  const modalNext = () => {
    setExpandedIndex((prev) => (prev + 1) % total);
  };

  // Compute each card's offset from the active center (-3..-1, 0, 1..3)
  const getOffset = (i) => {
    const total = TEMPLATE_COMPONENTS.length;
    let diff = i - activeIndex;
    if (diff > total / 2) diff -= total;
    if (diff < -total / 2) diff += total;
    return diff;
  };

  //keyboard buttons
  useEffect(() => {
  if (expandedIndex === null) return;
  const handleKey = (e) => {
    if (e.key === "ArrowLeft") modalPrev();
    if (e.key === "ArrowRight") modalNext();
    if (e.key === "Escape") setExpandedIndex(null);
  };
  window.addEventListener("keydown", handleKey);
  return () => window.removeEventListener("keydown", handleKey);
}, [expandedIndex]);

//swipe gestures
const touchStartX = useRef(0);
const touchEndX = useRef(0);

const handleTouchStart = (e) => {
  touchStartX.current = e.touches[0].clientX;
};

const handleTouchMove = (e) => {
  touchEndX.current = e.touches[0].clientX;
};

const handleTouchEnd = () => {
  const swipeDistance = touchStartX.current - touchEndX.current;
  const minSwipeDistance = 50;

  if (swipeDistance > minSwipeDistance) {
    modalNext(); // swiped left → next
  } else if (swipeDistance < -minSwipeDistance) {
    modalPrev(); // swiped right → previous
  }

  touchStartX.current = 0;
  touchEndX.current = 0;
};

//scale down use effect for modal preview
const [modalScale, setModalScale] = useState(0.72);

useEffect(() => {
  const computeModalScale = () => {
    const isMobile = window.innerWidth <= 600;
    if (!isMobile) {
      setModalScale(0.72);
      return;
    }
    const modalPadding = 32; // matches the modal body's horizontal padding
    const availableWidth = window.innerWidth - modalPadding;
    setModalScale(availableWidth / 794);
  };

  computeModalScale();
  window.addEventListener("resize", computeModalScale);
  return () => window.removeEventListener("resize", computeModalScale);
}, []);


// Swipe gestures for the main carousel (mobile)
const carouselTouchStartX = useRef(0);
const carouselTouchStartY = useRef(0);
const carouselTouchEndX = useRef(0);
const carouselTouchEndY = useRef(0);

const handleCarouselTouchStart = (e) => {
  carouselTouchStartX.current = e.touches[0].clientX;
  carouselTouchStartY.current = e.touches[0].clientY;
};

const handleCarouselTouchMove = (e) => {
  carouselTouchEndX.current = e.touches[0].clientX;
  carouselTouchEndY.current = e.touches[0].clientY;
};

const handleCarouselTouchEnd = () => {
  const deltaX = carouselTouchStartX.current - carouselTouchEndX.current;
  const deltaY = carouselTouchStartY.current - carouselTouchEndY.current;
  const minSwipeDistance = 40;

  // Only treat as a horizontal swipe if X movement clearly dominates Y movement
  const isHorizontalSwipe = Math.abs(deltaX) > Math.abs(deltaY) * 1.5;

  if (isHorizontalSwipe && Math.abs(deltaX) > minSwipeDistance) {
    if (deltaX > 0) {
      goNext(); // swiped left → next template
    } else {
      goPrev(); // swiped right → previous template
    }
  }

  carouselTouchStartX.current = 0;
  carouselTouchStartY.current = 0;
  carouselTouchEndX.current = 0;
  carouselTouchEndY.current = 0;
};

  return (
    <>
      <div className="cvl__carousel">
        <button className="cvl__carousel-arrow cvl__carousel-arrow--left" onClick={goPrev} aria-label="Previous template">
          <i className="fas fa-chevron-left"></i>
        </button>

        <div
          className="cvl__carousel-track"
          onTouchStart={handleCarouselTouchStart}
          onTouchMove={handleCarouselTouchMove}
          onTouchEnd={handleCarouselTouchEnd}
        >
          {TEMPLATE_COMPONENTS.map((TemplateComp, i) => {
            const info = TEMPLATE_INFO[i];
            const offset = getOffset(i);
            const isActive = offset === 0;
            // Only render cards within visual range for performance
            if (Math.abs(offset) > 3) return null;
            <span className="cvl__gallery-modal-swipe-hint">
            <i className="fas fa-hand-pointer"></i> Swipe to browse
          </span>
            return (
              <div
                key={i}
                className={`cvl__carousel-card ${isActive ? "cvl__carousel-card--active" : ""}`}
                style={{
                  "--offset": offset,
                }}
                onClick={() => {
                  if (isActive) {
                    if (window.innerWidth > 600) {
                      setExpandedIndex(i);
                    }
                    // On mobile: clicking the active card does nothing extra —
                    // "Use This" button is still tappable separately
                  } else {
                    goTo(i);
                  }
                }}
              >
                <div className="cvl__carousel-card-inner">
                  <div className="cvl__carousel-thumb">
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
                  </div>
                  {isActive && (
                    <div className="cvl__carousel-expand-hint">
                      <i className="fas fa-search-plus"></i> Click to preview
                    </div>
                  )}
                </div>
                <div className="cvl__carousel-card-footer">
                  <span className="cvl__carousel-card-name">{info.name}</span>
                  {isActive && (
                    <button
                      className="cvl__gallery-use-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectTemplate(i);
                      }}
                    >
                      Use This <i className="fas fa-arrow-right"></i>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <button className="cvl__carousel-arrow cvl__carousel-arrow--right" onClick={goNext} aria-label="Next template">
          <i className="fas fa-chevron-right"></i>
        </button>
      </div>

      {/* DOTS */}
      <div className="cvl__carousel-dots">
        {TEMPLATE_COMPONENTS.map((_, i) => (
          <button
            key={i}
            className={`cvl__carousel-dot ${i === activeIndex ? "cvl__carousel-dot--active" : ""}`}
            onClick={() => goTo(i)}
            aria-label={`Go to ${TEMPLATE_INFO[i].name}`}
          />
        ))}
      </div>

      {/* EXPANDED MODAL */}
        {expandedIndex !== null && (
          <div className="cvl__gallery-modal" onClick={() => setExpandedIndex(null)}>
            <div className="cvl__gallery-modal-box" onClick={(e) => e.stopPropagation()}>
              <div className="cvl__gallery-modal-header">
                <h3>{TEMPLATE_INFO[expandedIndex].name}</h3>
                <span className="cvl__gallery-modal-counter">
                  {expandedIndex + 1} / {total}
                </span>
                <button onClick={() => setExpandedIndex(null)}>
                  <i className="fas fa-times"></i>
                </button>
              </div>

              <div
                className="cvl__gallery-modal-body-wrap"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                <div className="cvl__gallery-modal-body">
                  {(() => {
                    const TemplateComp = TEMPLATE_COMPONENTS[expandedIndex];
                    const info = TEMPLATE_INFO[expandedIndex];
                    return (
                      <div
                        className="cvl__gallery-page"
                        style={{
                          background: info.theme.bg,
                          width: "794px",
                          minHeight: "1123px",
                          transform: `scale(${modalScale})`,
                          transformOrigin: "top center",
                          marginBottom: `${1123 * modalScale - 1123 + 40}px`,
                        }}
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

                <button
                  className="cvl__gallery-modal-nav cvl__gallery-modal-nav--left"
                  onClick={modalPrev}
                  aria-label="Previous template"
                >
                  <i className="fas fa-chevron-left"></i>
                </button>

                <button
                  className="cvl__gallery-modal-nav cvl__gallery-modal-nav--right"
                  onClick={modalNext}
                  aria-label="Next template"
                >
                  <i className="fas fa-chevron-right"></i>
                </button>
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