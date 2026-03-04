import { useState, useEffect } from "react";
import { useGameStore } from "./store/useGameStore";
import { parseScript } from "./engine/parser";

// Components
import { BackgroundLayer } from "./components/Game/BackgroundLayer";
import { CharacterStage } from "./components/Game/CharacterStage";
import { DialogueBox } from "./components/Game/DialogueBox";
import { EnergyMeter } from "./components/UI/EnergyMeter";
import { JournalOverlay } from "./components/UI/JournalOverlay";

function App() {
  // Global Store
  // We grab advanceLine here...
  const { currentLineIndex, scriptLines, advanceLine, loadScript } =
    useGameStore();

  // Local UI State
  const [isJournalOpen, setJournalOpen] = useState(false);

  // Load Script on Start
  useEffect(() => {
    fetch("/assets/scripts/chapter1.efs")
      .then((res) => res.text())
      .then((text) => {
        const parsed = parseScript(text);
        loadScript(parsed);
      });
    // FIXED: Added 'loadScript' to the dependency array
  }, [loadScript]);

  const handleNextClick = () => {
    // 1. Stop if Journal is open
    if (isJournalOpen) return;

    // 2. Advance logic
    if (currentLineIndex < scriptLines.length) {
      // Manually bump the index to the next line...
      useGameStore.setState((state) => ({
        currentLineIndex: state.currentLineIndex + 1,
      }));

      // FIXED: Use the 'advanceLine' variable we extracted above
      advanceLine();
    }
  };

  const currentLine = scriptLines[currentLineIndex];

  return (
    <div className="game-container" onClick={handleNextClick}>
      {/* 1. Game Layers */}
      <BackgroundLayer />
      <CharacterStage />

      {/* 2. HUD Layer */}
      <EnergyMeter />

      {/* 3. The Journal Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          setJournalOpen(true);
        }}
        style={{
          position: "absolute",
          top: 20,
          right: 20,
          zIndex: 50,
          background: "#5d4037",
          color: "#ffd700",
          border: "2px solid #3e2723",
          padding: "10px 20px",
          fontFamily: "Courier New, monospace",
          fontWeight: "bold",
          cursor: "pointer",
          boxShadow: "0 4px 6px rgba(0,0,0,0.3)",
        }}
      >
        OPEN JOURNAL
      </button>

      {/* 4. The Overlay */}
      {isJournalOpen && (
        <JournalOverlay onClose={() => setJournalOpen(false)} />
      )}

      {/* 5. Dialogue Box */}
      {!isJournalOpen && currentLine?.type === "dialogue" && (
        <DialogueBox charId={currentLine.characterId} text={currentLine.text} />
      )}
    </div>
  );
}

export default App;
