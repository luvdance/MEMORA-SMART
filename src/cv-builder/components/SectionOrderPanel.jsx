import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { sidebarSectionsFor } from "../utils/templateMeta";
import { useReorderSensors } from "../utils/reorderSensors";

const SECTION_LABELS = {
  summary: "Professional Summary",
  objective: "Career Objective",
  experience: "Work Experience",
  education: "Education",
  achievements: "Achievements & Awards",
  volunteer: "Volunteer Work",
  skills: "Skills",
  languages: "Languages",
  certifications: "Certifications",
  references: "References",
  publications: "Publications",
  biodata: "Personal Details",
  hobbies: "Hobbies & Interests",
};

const SECTION_ICONS = {
  summary: "fas fa-align-left",
  objective: "fas fa-bullseye",
  experience: "fas fa-briefcase",
  education: "fas fa-graduation-cap",
  achievements: "fas fa-trophy",
  volunteer: "fas fa-hands-helping",
  skills: "fas fa-tools",
  languages: "fas fa-language",
  certifications: "fas fa-certificate",
  references: "fas fa-user-check",
  publications: "fas fa-book-open",
  biodata: "fas fa-id-card",
  hobbies: "fas fa-heart",
};

function SortableItem({ id, label, inSidebar, isFirst, isLast, onMove }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="section-order__item">
      <div
        className="section-order__drag"
        {...attributes}
        {...listeners}
        aria-label={`Drag to move ${label}`}
      >
        <i className="fas fa-grip-vertical"></i>
      </div>
      <i className={`${SECTION_ICONS[id]} section-order__icon`}></i>
      <span className="section-order__label">
        {label}
        {inSidebar && <span className="section-order__col">Sidebar</span>}
      </span>
      <span className="section-order__moves">
        <button
          type="button"
          className="section-order__move"
          onClick={() => onMove(id, -1)}
          disabled={isFirst}
          aria-label={`Move ${label} up`}
        >
          <i className="fas fa-chevron-up"></i>
        </button>
        <button
          type="button"
          className="section-order__move"
          onClick={() => onMove(id, 1)}
          disabled={isLast}
          aria-label={`Move ${label} down`}
        >
          <i className="fas fa-chevron-down"></i>
        </button>
      </span>
    </div>
  );
}

export default function SectionOrderPanel({ sectionOrder, setSectionOrder, template }) {
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

  const move = (id, dir) => {
    const from = sectionOrder.indexOf(id);
    const to = from + dir;
    if (from < 0 || to < 0 || to >= sectionOrder.length) return;
    setSectionOrder(arrayMove(sectionOrder, from, to));
  };

  return (
    <div className="section-order">
      <div className="section-order__title">
        <i className="fas fa-sort"></i> Section Order
      </div>
      <p className="section-order__hint">Drag, or use the arrows, to reorder sections in your CV</p>
      {sidebar.length > 0 && (
        <p className="section-order__note">
          This template has a sidebar. Sections tagged <b>Sidebar</b> are ordered within the
          sidebar; the rest within the main column.
        </p>
      )}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={sectionOrder} strategy={verticalListSortingStrategy}>
          {sectionOrder.map((id, i) => (
            <SortableItem
              key={id}
              id={id}
              label={SECTION_LABELS[id] || id}
              inSidebar={sidebar.includes(id)}
              isFirst={i === 0}
              isLast={i === sectionOrder.length - 1}
              onMove={move}
            />
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
}
