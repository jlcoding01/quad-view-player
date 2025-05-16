import React, { useState } from "react";
import { PanelState } from "./types";
import VideoPanel from "./components/VideoPanel";

function App() {
  const [panels, setPanels] = useState<PanelState[]>([
    {
      id: 1,
      inputValue: "",
      videoSource: { url: "", type: "unknown", isLoaded: false },
    },
    {
      id: 2,
      inputValue: "",
      videoSource: { url: "", type: "unknown", isLoaded: false },
    },
    {
      id: 3,
      inputValue: "",
      videoSource: { url: "", type: "unknown", isLoaded: false },
    },
    {
      id: 4,
      inputValue: "",
      videoSource: { url: "", type: "unknown", isLoaded: false },
    },
  ]);

  const handlePanelUpdate = (updatedPanel: PanelState) => {
    setPanels((prevPanels) =>
      prevPanels.map((panel) =>
        panel.id === updatedPanel.id ? updatedPanel : { ...panel }
      )
    );
  };

  return (
    <div className="h-screen bg-slate-900">
      <div className="grid grid-cols-2 h-full">
        {panels.map((panel) => (
          <VideoPanel
            key={`panel-${panel.id}`}
            panelState={panel}
            onPanelUpdate={handlePanelUpdate}
          />
        ))}
      </div>
    </div>
  );
}

export default App;
