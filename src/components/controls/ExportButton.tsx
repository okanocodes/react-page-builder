import React, { useContext } from "react";
import { BuilderContext } from "../../context/BuilderContext";
import Modal from "react-modal";
import { IoIosCopy } from "react-icons/io";

Modal.setAppElement("#root");

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    maxHeight: "90vh",
    backgroundColor: "#111827",
    color: "#d1d5db",
  },
  overlay: {
    zIndex: 1000,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
};
export const exportJSON = (elements: any, lastModified?: string) => {
  const json = {
    project: {
      name: "Test Builder Layout",
      version: "1.0",
      created: new Date().toISOString(),
      lastModified: lastModified ?? new Date().toISOString(),
    },
    canvas: {
      width: 1200,
      height: 800,
      grid: { enabled: true, size: 10, snap: true },
    },
    elements,
    metadata: {
      totalElements: elements.length,
      exportFormat: "json",
      exportVersion: "2.0",
    },
  };
  return JSON.stringify(json, null, 2);
};

export const ExportButton: React.FC = () => {
  const [modalIsOpen, setIsOpen] = React.useState(false);

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  const ctx = useContext(BuilderContext);
  if (!ctx) return null;
  const { elements, lastModified } = ctx;

  const formatted = exportJSON(elements, lastModified);

  const onCopy = () => {
    navigator.clipboard?.writeText(formatted).then(
      () => {
        alert("JSON copied to clipboard!");
      }
      // () => {
      //   const blob = new Blob([formatted], { type: "application/json" });
      //   const url = URL.createObjectURL(blob);
      //   const a = document.createElement("a");
      //   a.href = url;
      //   a.download = "layout.json";
      //   a.click();
      //   URL.revokeObjectURL(url);
      // }
    );
  };

  return (
    <>
      <button onClick={openModal}>Export JSON</button>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="JSON Export Modal"
      >
        <h2>JSON</h2>
        <pre
          style={{
            backgroundColor: "#1f2937",
            borderRadius: "10px",
            padding: "10px",
            color: "#d1d5db",
            maxHeight: "70vh",
            overflowY: "auto",
            position: "relative",
          }}
        >
          <div
            style={{
              position: "sticky",
              top: "5px",
              right: "1px",
              float: "right",
              padding: "5px 10px",
              borderRadius: "5px",
              border: "1px solid #ccc",
              backgroundColor: "white",
              color: "black",
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
            }}
            onClick={onCopy}
          >
            <span>Click to copy!</span>
            <IoIosCopy />
          </div>

          {formatted}
        </pre>
        <button onClick={closeModal}>close</button>
      </Modal>
    </>
  );
};
