import { BuilderProvider } from "./context/BuilderContext";
import { Sidebar } from "./components/sidebar/Sidebar";
import { Canvas } from "./components/canvas/Canvas";
import { ExportButton } from "./components/controls/ExportButton";
import "./index.css";

export const App = () => {
  return (
    <BuilderProvider>
      <title>Page Builder</title>
      <div style={{ display: "flex", gap: 12, padding: 12 }}>
        <div className="canvas">
          <Canvas />
        </div>
        <div className="sidebar">
          <h3>Page Builder</h3>
          <Sidebar />
          <div style={{ marginTop: 12 }}>
            <ExportButton />
          </div>
        </div>
      </div>
    </BuilderProvider>
  );
};

export default App;
