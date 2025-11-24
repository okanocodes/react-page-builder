// src/components/Controls/GridToggle.tsx
import React, { useContext } from "react";
import { BuilderContext } from "../../context/BuilderContext";

export const GridToggle: React.FC = () => {
  const ctx = useContext(BuilderContext);
  if (!ctx) return null;
  const { gridEnabled, setGridEnabled, gridSize, setGridSize } = ctx;

  return (
    <div
      style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 8 }}
    >
      <label style={{ display: "flex", gap: 6, alignItems: "center" }}>
        <input
          type="checkbox"
          checked={gridEnabled}
          onChange={(e) => setGridEnabled(e.target.checked)}
        />
        Grid
      </label>

      <label style={{ display: "flex", gap: 6, alignItems: "center" }}>
        Size:
        <input
          type="number"
          min={4}
          max={100}
          value={gridSize}
          onChange={(e) => setGridSize(Math.max(4, Number(e.target.value)))}
          style={{ width: 64 }}
        />
      </label>
    </div>
  );
};
