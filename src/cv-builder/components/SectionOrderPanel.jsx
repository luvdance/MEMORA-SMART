import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

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

function SortableItem({ id }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="section-order__item">
      <div className="section-order__drag" {...attributes} {...listeners}>
        <i className="fas fa-grip-vertical"></i>
      </div>
      <i className={`${SECTION_ICONS[id]} section-order__icon`}></i>
      <span>{SECTION_LABELS[id]}</span>
    </div>
  );
}

export default function SectionOrderPanel({ sectionOrder, setSectionOrder }) {
  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = sectionOrder.indexOf(active.id);
      const newIndex = sectionOrder.indexOf(over.id);
      setSectionOrder(arrayMove(sectionOrder, oldIndex, newIndex));
    }
  };

  return (
    <div className="section-order">
      <div className="section-order__title">
        <i className="fas fa-sort"></i> Section Order
      </div>
      <p className="section-order__hint">Drag to reorder sections in your CV</p>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={sectionOrder} strategy={verticalListSortingStrategy}>
          {sectionOrder.map((id) => (
            <SortableItem key={id} id={id} />
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
}