import type { BuilderElement } from "../../types";

export default function Text({ element }: { element: BuilderElement }) {
  if (element.type !== "text-content") return null;

  const { html, plainText } = element.content;
  return (
    <div
      style={{
        padding: "10px",
      }}
    >
      <div>
        <span>HTML:</span> <div dangerouslySetInnerHTML={{ __html: html }} />
      </div>
      <div>Plain Text: {plainText}</div>
    </div>
  );
}
