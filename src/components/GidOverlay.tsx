import React from "react";

export const GridOverlay: React.FC<{ gridSize: number; visible: boolean }> = ({
  gridSize,
  visible,
}) => {
  if (!visible) return null;

  return (
    <div
      aria-hidden
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        backgroundImage: `linear-gradient(0deg, rgba(0,0,0,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.04) 1px, transparent 1px)`,
        backgroundSize: `${gridSize}px ${gridSize}px, ${gridSize}px ${gridSize}px`,
        opacity: 1,
      }}
    />
  );
};
