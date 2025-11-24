import React from "react";
import type { ElementType } from "../../types";

const SIDEBAR_ITEMS: ElementType[] = [
  "header",
  "card",
  "text-content",
  "slider",
  "footer",
];

export const Sidebar: React.FC = () => {
  const onDragStart = (e: React.DragEvent, type: ElementType) => {
    e.dataTransfer.setData("application/x-element-type", type);
    e.dataTransfer.setData("type", type);
    e.dataTransfer.setData("text/plain", type);

    try {
      (window as any).__DRAG_ELEMENT_TYPE = type;
    } catch (err) {
      /* ignore */
    }
    e.dataTransfer.effectAllowed = "copy";
    const el = e.currentTarget as HTMLElement;
    el.style.opacity = "0.5";
    el.style.cursor = "grabbing";
  };

  const onDragEnd = (e: React.DragEvent) => {
    const el = e.currentTarget as HTMLElement;
    el.style.opacity = "1";
    el.style.cursor = "grab";
    try {
      (window as any).__DRAG_ELEMENT_TYPE = undefined;
    } catch (err) {}
  };

  return (
    <aside className="sidebar-container">
      {SIDEBAR_ITEMS.map((type) => (
        <div
          key={type}
          draggable
          className="sidebar-item"
          onDragStart={(e) => onDragStart(e, type)}
          onDragEnd={onDragEnd}
          style={{ userSelect: "none", cursor: "grab", padding: 12 }}
        >
          {type.charAt(0).toUpperCase() + type.slice(1).replace("-", " ")}
        </div>
      ))}
    </aside>
  );
};
