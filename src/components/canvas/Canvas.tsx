import React, { useContext, useRef, useState } from "react";
import { BuilderContext } from "../../context/BuilderContext";
import { ElementRenderer } from "./ElementRenderer";
import {
  computeDropPosition,
  findNonOverlappingPosition,
} from "../../utils/positionUtils";
import type { ElementType } from "../../types";
import { GridOverlay } from "../GidOverlay";
import { createElement } from "../../utils/createElement";
import { defaultSizeForDataType } from "../../utils/defaulSizeDataType";

const DEFAULT_CANVAS_HEIGHT = 800;

export const Canvas: React.FC = () => {
  const ctx = useContext(BuilderContext);
  const ref = useRef<HTMLDivElement | null>(null);
  const [dropIndicator, setDropIndicator] = useState<{
    x: number;
    y: number;
    w: number;
    h: number;
    visible: boolean;
  }>({
    x: 0,
    y: 0,
    w: 0,
    h: 0,
    visible: false,
  });

  if (!ctx) return null;
  const { addElement, elements, gridEnabled, gridSize } = ctx;

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    const types = Array.from(e.dataTransfer.types || []);
    const valid = types.includes("application/x-element-type");
    e.dataTransfer.dropEffect = valid ? "copy" : "none";

    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;

    const { x, y } = computeDropPosition(e.clientX, e.clientY, rect, {
      gridSize,
      snap: gridEnabled,
    });

    const availableTypes = Array.from(e.dataTransfer.types || []);
    let dragType =
      e.dataTransfer.getData("application/x-element-type") ||
      e.dataTransfer.getData("type") ||
      e.dataTransfer.getData("text/plain") ||
      "";
    if (!dragType) {
      dragType = (window as any).__DRAG_ELEMENT_TYPE || "";
      // eslint-disable-next-line no-console
      console.debug(
        "drag types:",
        availableTypes,
        "->",
        dragType,
        "(window fallback)"
      );
    } else {
      // eslint-disable-next-line no-console
      console.debug("drag types:", availableTypes, "->", dragType);
    }

    let w = 300,
      h = 200;

    const dummy = createElement(dragType as ElementType, { x: 0, y: 0 });
    w =
      typeof dummy.position.width === "number"
        ? dummy.position.width
        : rect.width;
    h = typeof dummy.position.height === "number" ? dummy.position.height : 200;

    setDropIndicator({ x, y, w, h, visible: valid });
  };

  const handleDragLeave = () => {
    setDropIndicator((d) => ({ ...d, visible: false }));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDropIndicator((d) => ({ ...d, visible: false }));

    const type = e.dataTransfer.getData("application/x-element-type");
    const elementType = (type || "") as ElementType;
    if (!type) return;

    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;

    const base = computeDropPosition(e.clientX, e.clientY, rect, {
      gridSize,
      snap: gridEnabled,
    });

    const defaultSize = defaultSizeForDataType(type, rect.width);

    // collision prevention
    const otherRects = elements.map((el) => ({
      x: el.position.x,
      y: el.position.y,
      w:
        typeof el.position.width === "number"
          ? el.position.width
          : (ref.current?.querySelector(`[data-id="${el.id}"]`) as HTMLElement)
              ?.offsetWidth ??
            ((el.position.width as unknown as number) || 0),
      h:
        typeof el.position.height === "number"
          ? el.position.height
          : (ref.current?.querySelector(`[data-id="${el.id}"]`) as HTMLElement)
              ?.offsetHeight ??
            ((el.position.height as unknown as number) || 0),
    }));

    const desired = {
      x: base.x,
      y: base.y,
      w: defaultSize.w,
      h: defaultSize.h,
    };

    const safe = findNonOverlappingPosition(desired, otherRects, {
      canvasWidth: rect.width,
      canvasHeight: rect.height || DEFAULT_CANVAS_HEIGHT,
      step: gridEnabled ? gridSize : 10,
      maxAttempts: 1000,
    });

    if (!elementType) {
      return;
    }

    let newElement;
    if (elementType === "card" && typeof ctx.nextCardNumber === "function") {
      const idx = ctx.nextCardNumber();
      newElement = createElement(
        elementType,
        { x: safe.x, y: safe.y },
        { cardIndex: idx }
      );
    } else {
      newElement = createElement(elementType, { x: safe.x, y: safe.y });
    }

    if (newElement.type === "text-content") {
      newElement = {
        ...newElement,
        position: { ...newElement.position, width: "auto", height: "auto" },
      };
    }

    addElement(newElement);

    // clear global drag fallback
    try {
      (window as any).__DRAG_ELEMENT_TYPE = undefined;
    } catch (err) {
      /* ignore */
    }
  };

  return (
    <div style={{ position: "relative", width: "100%" }}>
      <div
        ref={ref}
        className="canvas-container"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onDragLeave={handleDragLeave}
        style={{
          position: "relative",
          width: "100%",
          height: DEFAULT_CANVAS_HEIGHT,
          background: "#f6f8fb",
          border: "1px solid #d8dee9",
          overflow: "auto",
        }}
      >
        <GridOverlay gridSize={gridSize} visible={gridEnabled} />

        {elements.map((el) => (
          <div key={el.id} data-id={el.id}>
            <ElementRenderer element={el} />
          </div>
        ))}

        {dropIndicator.visible && (
          <div
            style={{
              position: "absolute",
              left: dropIndicator.x,
              top: dropIndicator.y,
              width: dropIndicator.w,
              height: dropIndicator.h,
              border: "2px dashed #3b82f6",
              background: "rgba(59,130,246,0.04)",
              pointerEvents: "none",
              zIndex: 9999,
            }}
          />
        )}
      </div>
    </div>
  );
};
