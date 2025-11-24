import type { BuilderElement } from "../../types";

export default function Footer({ element }: { element: BuilderElement }) {
  if (element.type !== "footer") return null;

  return (
    <footer
      style={{
        width: "100%",
        height: "100%",
        background: "#e0e0e0",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "sticky",
        bottom: 0,
      }}
    >
      <div>{(element.content?.copyright as React.ReactNode) ?? "Footer"}</div>
      {element.content?.links && element.content.links.length > 0 && (
        <ul style={{ listStyle: "none", padding: 0, margin: "0 0 0 20px" }}>
          {element.content.links.map((link, index) => (
            <li key={index} style={{ display: "inline", marginRight: 10 }}>
              <a href={link} target="_blank" rel="noopener noreferrer">
                {link}
              </a>
            </li>
          ))}
        </ul>
      )}
    </footer>
  );
}
