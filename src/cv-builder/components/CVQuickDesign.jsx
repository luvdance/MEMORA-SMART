import { useState } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { TEMPLATES, ACCENT, THEME_PRESETS, FONT_OPTIONS } from "../utils/constants";

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

function SortableItem({ id }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="cvb-quick-design__reorder-item">
      <i className="fas fa-grip-vertical"></i>
      <span>{SECTION_LABELS[id] || id}</span>
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
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = sectionOrder.indexOf(active.id);
      const newIndex = sectionOrder.indexOf(over.id);
      setSectionOrder(arrayMove(sectionOrder, oldIndex, newIndex));
    }
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
              >
                {name}
              </button>
            ))}
          </div>
        )}

        {/* FONT */}
        {activeTab === "font" && (
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
                {sectionOrder.map((id) => (
                  <SortableItem key={id} id={id} />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}

      </div>
    </div>
  );
}