import React, { createContext, useCallback, useState } from "react";
import type { BuilderElement } from "../types";

interface BuilderContextValue {
  elements: BuilderElement[];
  selectedId: string | null;
  addElement: (el: BuilderElement) => void;
  updateElement: (id: string, patch: Partial<BuilderElement>) => void;
  updateElementPosition: (
    id: string,
    positionPatch: Partial<BuilderElement["position"]>
  ) => void;
  deleteElement: (id: string) => void;
  setSelectedId: (id: string | null) => void;
  bringToFront: (id: string) => void;
  sendToBack: (id: string) => void;
  nextCardNumber: () => number;
  lastModified: string;
  gridEnabled: boolean;
  setGridEnabled: (v: boolean) => void;
  gridSize: number;
  setGridSize: (s: number) => void;
}

export const BuilderContext = createContext<BuilderContextValue | undefined>(
  undefined
);

export const BuilderProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [elements, setElements] = useState<BuilderElement[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const [gridEnabled, setGridEnabled] = useState<boolean>(true);
  const [gridSize, setGridSize] = useState<number>(10);

  const [cardCounter, setCardCounter] = useState<number>(0);
  const [lastModified, setLastModified] = useState<string>(() =>
    new Date().toISOString()
  );

  const touchLastModified = useCallback(() => {
    setLastModified(new Date().toISOString());
  }, []);

  const nextCardNumber = useCallback(() => {
    let next = 0;
    setCardCounter((prev) => {
      next = prev + 1;
      return next;
    });
    return next;
  }, []);

  const addElement = useCallback((el: BuilderElement) => {
    setElements((prev) => [...prev, el]);
    touchLastModified();
  }, []);

  const updateElement = useCallback(
    (id: string, patch: Partial<BuilderElement>) => {
      setElements((prev) =>
        prev.map((e) =>
          e.id === id ? ({ ...e, ...patch } as BuilderElement) : e
        )
      );
      touchLastModified();
    },
    []
  );

  const updateElementPosition = useCallback(
    (id: string, positionPatch: Partial<BuilderElement["position"]>) => {
      setElements((prev) =>
        prev.map((e) =>
          e.id === id
            ? ({
                ...e,
                position: { ...e.position, ...positionPatch },
              } as BuilderElement)
            : e
        )
      );
      touchLastModified();
    },
    []
  );

  const deleteElement = useCallback(
    (id: string) => {
      setElements((prev) => prev.filter((e) => e.id !== id));
      if (selectedId === id) setSelectedId(null);
      touchLastModified();
    },
    [selectedId]
  );

  const bringToFront = useCallback((id: string) => {
    setElements((prev) => {
      const maxZ = prev.reduce((m, e) => Math.max(m, e.position.zIndex), 0);
      return prev.map((e) =>
        e.id === id
          ? { ...e, position: { ...e.position, zIndex: maxZ + 1 } }
          : e
      );
    });
    touchLastModified();
  }, []);

  const sendToBack = useCallback((id: string) => {
    setElements((prev) => {
      const minZ = prev.reduce(
        (m, e) => Math.min(m, e.position.zIndex),
        Number.POSITIVE_INFINITY
      );
      return prev.map((e) =>
        e.id === id
          ? { ...e, position: { ...e.position, zIndex: minZ - 1 } }
          : e
      );
    });
    touchLastModified();
  }, []);

  return (
    <BuilderContext.Provider
      value={{
        elements,
        selectedId,
        addElement,
        updateElement,
        updateElementPosition,
        deleteElement,
        setSelectedId,
        bringToFront,
        sendToBack,
        nextCardNumber,
        lastModified,
        gridEnabled,
        setGridEnabled,
        gridSize,
        setGridSize,
      }}
    >
      {children}
    </BuilderContext.Provider>
  );
};
