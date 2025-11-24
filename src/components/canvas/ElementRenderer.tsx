import React, { useContext, useEffect, useRef, useState } from "react";
import type { BuilderElement } from "../../types";
import { BuilderContext } from "../../context/BuilderContext";
import { overlaps } from "../../utils/positionUtils";
import { ELEMENT_REGISTRY } from "../registry";
import { BsTextareaResize } from "react-icons/bs";

export const ElementRenderer: React.FC<{ element: BuilderElement }> = ({
  element,
}) => {
  const ctx = useContext(BuilderContext);
  if (!ctx) return null;
  const {
    selectedId,
    setSelectedId,
    updateElementPosition,
    deleteElement,
    bringToFront,
  } = ctx;

  const Component = ELEMENT_REGISTRY[element.type];

  const isSelected = selectedId === element.id;
  const elRef = useRef<HTMLDivElement | null>(null);

  // Drag-to-move handling (mousedown -> mousemove -> mouseup)
  const [dragging, setDragging] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMouseMove = (ev: MouseEvent) => {
      if (!dragging) return;
      const canvasRect = elRef.current?.parentElement?.getBoundingClientRect();
      if (!canvasRect) return;
      const x = ev.clientX - canvasRect.left - dragOffset.current.x;
      const y = ev.clientY - canvasRect.top - dragOffset.current.y;

      updateElementPosition(element.id, {
        x: Math.max(0, x),
        y: Math.max(0, y),
      });
    };

    const onMouseUp = () => setDragging(false);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [dragging, element.id, updateElementPosition]);

  const onMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedId(element.id);
    bringToFront(element.id);
    setDragging(true);
    const rect = elRef.current?.getBoundingClientRect();
    if (!rect) return;
    const canvasRect = elRef.current!.parentElement!.getBoundingClientRect();
    dragOffset.current = {
      x: e.clientX - rect.left + (canvasRect.left - canvasRect.left),
      y: e.clientY - rect.top,
    };
  };

  const onDeleteKey = (e: KeyboardEvent) => {
    if (isSelected && (e.key === "Delete" || e.key === "Backspace"))
      deleteElement(element.id);
  };

  useEffect(() => {
    window.addEventListener("keydown", onDeleteKey);
    return () => window.removeEventListener("keydown", onDeleteKey);
  }, [isSelected, deleteElement, element.id]);

  // Simple resize handle bottom-right
  const startResize = (e: React.MouseEvent) => {
    e.stopPropagation();
    const startW =
      typeof element.position.width === "number"
        ? element.position.width
        : elRef.current!.offsetWidth;
    const startH =
      typeof element.position.height === "number"
        ? element.position.height
        : elRef.current!.offsetHeight;
    const startX = e.clientX;
    const startY = e.clientY;

    const onMove = (ev: MouseEvent) => {
      const dx = ev.clientX - startX;
      const dy = ev.clientY - startY;
      updateElementPosition(element.id, {
        width: Math.max(50, startW + dx),
        height: Math.max(30, startH + dy),
      });
    };

    const onUp = () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  //  highlight if overlapping any other element
  const [overlapping, setOverlapping] = useState(false);
  useEffect(() => {
    const check = () => {
      const rectA = {
        x: element.position.x,
        y: element.position.y,
        w:
          typeof element.position.width === "number"
            ? element.position.width
            : elRef.current?.offsetWidth ?? 0,
        h:
          typeof element.position.height === "number"
            ? element.position.height
            : elRef.current?.offsetHeight ?? 0,
      };

      // brief overlap check with siblings
      const ctxEls = (ctx.elements || []).filter((e) => e.id !== element.id);
      const anyOverlap = ctxEls.some((e) => {
        const rectB = {
          x: e.position.x,
          y: e.position.y,
          w: typeof e.position.width === "number" ? e.position.width : 0,
          h: typeof e.position.height === "number" ? e.position.height : 0,
        };
        return overlaps(rectA, rectB);
      });
      setOverlapping(anyOverlap);
    };

    check();
  }, [element, ctx.elements]);

  if (!Component) {
    return <div>Unknown component: {element.type}</div>;
  }

  return (
    <div
      ref={elRef}
      onMouseDown={onMouseDown}
      style={{
        position: "absolute",
        left: element.position.x,
        top: element.position.y,
        boxSizing: "border-box",
        overflow: "hidden",
        width:
          typeof element.position.width === "number"
            ? element.position.width
            : element.position.width,
        height:
          typeof element.position.height === "number"
            ? element.position.height
            : element.position.height,
        zIndex: element.position.zIndex,
        border: isSelected
          ? "2px solid #2563eb"
          : overlapping
          ? "1px dashed #ff9900"
          : "1px solid transparent",
        background: "white",
        boxShadow: "0 6px 14px rgba(0,0,0,0.06)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        userSelect: "none",
      }}
    >
      <Component element={element} />

      {isSelected && (
        <BsTextareaResize
          onMouseDown={startResize}
          style={{
            position: "absolute",
            right: 2,
            bottom: 0,
            width: 12,
            height: 12,
            cursor: "nwse-resize",
            zIndex: 9999,
            backgroundColor: "white",
            padding: 2,
            borderRadius: 2,
          }}
        />
      )}
    </div>
  );
};
