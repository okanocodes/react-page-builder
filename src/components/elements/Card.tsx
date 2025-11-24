import type { BuilderElement } from "../../types";

export default function Card({ element }: { element: BuilderElement }) {
  if (element.type !== "card") return null;
  const { title, description, image } = element.content;

  return (
    <article
      style={{
        width: element.position.width,
        height: element.position.height,
        padding: "0 12px",
        boxShadow: "0 2px 5px rgba(0,0,0,0.15)",
      }}
    >
      <h3>{title}</h3>
      <p>{description}</p>
      {image && <img src={image} alt={title} />}
    </article>
  );
}
