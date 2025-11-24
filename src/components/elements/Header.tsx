import type { BuilderElement } from "../../types";

export default function Header({ element }: { element: BuilderElement }) {
  if (element.type !== "header") return null;

  const { text } = element.content;

  return (
    <header
      style={{
        width: "100%",
        height: "100%",
        background: "#f3f3f3",
        display: "flex",
        alignItems: "center",
        paddingLeft: 20,
        fontWeight: 600,
        position: "sticky",
        top: 0,
      }}
    >
      {text ?? "Header"}
    </header>
  );
}
