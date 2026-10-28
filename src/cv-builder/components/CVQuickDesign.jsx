import { useState } from "react";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { TEMPLATES, ACCENT, THEME_PRESETS, FONT_OPTIONS } from "../utils/constants";
import { sidebarSectionsFor, isPremiumTemplate } from "../utils/templateMeta";
import { useReorderSensors } from "../utils/reorderSensors";

const SECTION_LABELS = {
  biodata: "Personal Details",
  summary: "Summary",
  objective: "Objective",
  experience: "Experience",
  education: "Education",
  skills: "Skills",
  achievements: "Achievements",
  volunteer: "Volunteer",
  publications: "Publications",
  languages: "Languages",
  certifications: "Certifications",
  hobbies: "Hobbies",
  references: "References",
};

function SortableItem({ id, inSidebar, isFirst, isLast, onMove }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  const label = SECTION_LABELS[id] || id;
  return (
    <div ref={setNodeRef} style={style} className="cvb-quick-design__reorder-item">
      {/* Only the grip starts a drag, so the list itself still scrolls by touch. */}
      <span
        className="cvb-quick-design__reorder-handle"
        {...attributes}
        {...listeners}
        aria-label={`Drag to move ${label}`}
      >
        <i className="fas fa-grip-vertical"></i>
      </span>
      <span className="section-order__label">
        {label}
        {inSidebar && <span className="section-order__col">Sidebar</span>}
      </span>
      <span className="section-order__moves">
        <button type="button" className="section-order__move" onClick={() => onMove(id, -1)} disabled={isFirst} aria-label={`Move ${label} up`}>
          <i className="fas fa-chevron-up"></i>
        </button>
        <button type="button" className="section-order__move" onClick={() => onMove(id, 1)} disabled={isLast} aria-label={`Move ${label} down`}>
          <i className="fas fa-chevron-down"></i>
        </button>
      </span>
    </div>
  );
}

export default function CVQuickDesign({
  template, setTemplate,
  accent, setAccent,
  theme, setTheme,
  sectionOrder, setSectionOrder,
  format, setFormat,
}) {
  const [activeTab, setActiveTab] = useState("templates");
  const sensors = useReorderSensors();
  const sidebar = sidebarSectionsFor(template);

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = sectionOrder.indexOf(active.id);
      const newIndex = sectionOrder.indexOf(over.id);
      setSectionOrder(arrayMove(sectionOrder, oldIndex, newIndex));
    }
  };

  const moveSection = (id, dir) => {
    const from = sectionOrder.indexOf(id);
    const to = from + dir;
    if (from < 0 || to < 0 || to >= sectionOrder.length) return;
    setSectionOrder(arrayMove(sectionOrder, from, to));
  };

  const setFont = (fontValue) => {
    setFormat({ ...format, fontFamily: fontValue });
  };

  return (
    <div className="cvb-quick-design">

      {/* Tab pills */}
      <div className="cvb-quick-design__tabs">
        <button
          onClick={() => setActiveTab("templates")}
          className={`cvb-quick-design__tab ${activeTab === "templates" ? "cvb-quick-design__tab--active" : ""}`}
        >
          <i className="fas fa-th-large"></i> Templates
        </button>
        <button
          onClick={() => setActiveTab("font")}
          className={`cvb-quick-design__tab ${activeTab === "font" ? "cvb-quick-design__tab--active" : ""}`}
        >
          <i className="fas fa-font"></i> Font
        </button>
        <button
          onClick={() => setActiveTab("accent")}
          className={`cvb-quick-design__tab ${activeTab === "accent" ? "cvb-quick-design__tab--active" : ""}`}
        >
          <i className="fas fa-palette"></i> Accent
        </button>
        <button
          onClick={() => setActiveTab("theme")}
          className={`cvb-quick-design__tab ${activeTab === "theme" ? "cvb-quick-design__tab--active" : ""}`}
        >
          <i className="fas fa-fill-drip"></i> Theme
        </button>
        <button
          onClick={() => setActiveTab("reorder")}
          className={`cvb-quick-design__tab ${activeTab === "reorder" ? "cvb-quick-design__tab--active" : ""}`}
        >
          <i className="fas fa-arrows-alt-v"></i> Reorder
        </button>
      </div>

      {/* Content panel */}
      <div className="cvb-quick-design__content">

        {/* TEMPLATES */}
        {activeTab === "templates" && (
          <div className="cvb-quick-design__row">
            {TEMPLATES.map((name, i) => (
              <button
                key={i}
                onClick={() => setTemplate(i)}
                className={`cvb-quick-design__chip ${template === i ? "cvb-quick-design__chip--active" : ""}`}
                title={isPremiumTemplate(i) ? "Premium template" : undefined}
              >
                {name}
                {isPremiumTemplate(i) && <i className="fas fa-crown cvb-premium-crown" aria-label="Premium"></i>}
              </button>
            ))}
          </div>
        )}

        {/* FONT */}
        {activeTab === "font" && (
        <div className="cvb-quick-design__font-panel">

            {/* Font family cards — horizontal scroll */}
            <div className="cvb-quick-design__row">
            {FONT_OPTIONS.map((font) => (
                <button
                key={font.value}
                onClick={() => setFont(font.value)}
                className={`cvb-quick-design__font-card ${format.fontFamily === font.value ? "cvb-quick-design__font-card--active" : ""}`}
                style={{ fontFamily: font.value }}
                >
                <span className="cvb-quick-design__font-card-name">Aa</span>
                <span className="cvb-quick-design__font-card-label">{font.label}</span>
                </button>
            ))}
            </div>

            {/* Size steppers */}
            <div className="cvb-quick-design__sizes">

            {/* Name size */}
            <div className="cvb-quick-design__size-row">
                <span className="cvb-quick-design__size-label">Name</span>
                <div className="cvb-quick-design__stepper">
                <button
                    className="cvb-quick-design__step-btn"
                    onClick={() => setFormat({ ...format, nameFontSize: Math.max(16, format.nameFontSize - 1) })}
                >−</button>
                <span className="cvb-quick-design__step-val">{format.nameFontSize}px</span>
                <button
                    className="cvb-quick-design__step-btn"
                    onClick={() => setFormat({ ...format, nameFontSize: Math.min(32, format.nameFontSize + 1) })}
                >+</button>
                </div>
            </div>

            {/* Body size */}
            <div className="cvb-quick-design__size-row">
                <span className="cvb-quick-design__size-label">Body</span>
                <div className="cvb-quick-design__stepper">
                <button
                    className="cvb-quick-design__step-btn"
                    onClick={() => setFormat({ ...format, bodyFontSize: Math.max(8, format.bodyFontSize - 1) })}
                >−</button>
                <span className="cvb-quick-design__step-val">{format.bodyFontSize}px</span>
                <button
                    className="cvb-quick-design__step-btn"
                    onClick={() => setFormat({ ...format, bodyFontSize: Math.min(14, format.bodyFontSize + 1) })}
                >+</button>
                </div>
            </div>

            {/* Heading size */}
            <div className="cvb-quick-design__size-row">
                <span className="cvb-quick-design__size-label">Heading</span>
                <div className="cvb-quick-design__stepper">
                <button
                    className="cvb-quick-design__step-btn"
                    onClick={() => setFormat({ ...format, headingFontSize: Math.max(9, format.headingFontSize - 1) })}
                >−</button>
                <span className="cvb-quick-design__step-val">{format.headingFontSize}px</span>
                <button
                    className="cvb-quick-design__step-btn"
                    onClick={() => setFormat({ ...format, headingFontSize: Math.min(16, format.headingFontSize + 1) })}
                >+</button>
                </div>
            </div>

            </div>
        </div>
        )}

        {/* ACCENT COLORS */}
        {activeTab === "accent" && (
          <div className="cvb-quick-design__row">
            {ACCENT.map((color, i) => (
              <button
                key={i}
                onClick={() => setAccent(color)}
                className={`cvb-quick-design__dot ${accent === color ? "cvb-quick-design__dot--active" : ""}`}
                style={{ background: color }}
                aria-label={`Accent ${color}`}
              />
            ))}
          </div>
        )}

        {/* THEME PRESETS */}
        {activeTab === "theme" && (
          <div className="cvb-quick-design__row">
            {THEME_PRESETS.map((preset, i) => (
              <button
                key={i}
                onClick={() => setTheme({ bg: preset.bg, text: preset.text, sidebar: preset.sidebar })}
                className={`cvb-quick-design__theme-card ${theme.bg === preset.bg ? "cvb-quick-design__theme-card--active" : ""}`}
                title={preset.label}
              >
                <div
                  className="cvb-quick-design__theme-card-top"
                  style={{ background: preset.bg }}
                />
                <div
                  className="cvb-quick-design__theme-card-bottom"
                  style={{ background: preset.sidebar, color: preset.text }}
                >
                  Aa
                </div>
              </button>
            ))}
          </div>
        )}

        {/* REORDER SECTIONS */}
        {activeTab === "reorder" && (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={sectionOrder} strategy={verticalListSortingStrategy}>
              <div className="cvb-quick-design__reorder">
                {sectionOrder.map((id, i) => (
                  <SortableItem
                    key={id}
                    id={id}
                    inSidebar={sidebar.includes(id)}
                    isFirst={i === 0}
                    isLast={i === sectionOrder.length - 1}
                    onMove={moveSection}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}

      </div>
    </div>
  );
}