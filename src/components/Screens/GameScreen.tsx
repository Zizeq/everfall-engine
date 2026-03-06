import { useState } from "react";
import { useGameStore } from "../../store/useGameStore";
import { BackgroundLayer } from "../Game/BackgroundLayer";
import { CharacterStage } from "../Game/CharacterStage";
import { DialogueBox } from "../Game/DialogueBox";
import { EnergyMeter } from "../UI/EnergyMeter";
import { JournalOverlay } from "../UI/JournalOverlay";
import { SaveLoadMenu } from "./SaveLoadMenu";
import "./Screens.css";

export const GameScreen = () => {
  const { currentLineIndex, scriptLines, advanceLine, setScreen } =
    useGameStore();
  const [isJournalOpen, setJournalOpen] = useState(false);
  const [showSave, setShowSave] = useState(false); // Local state for Save Menu

  const handleNextClick = () => {
    if (isJournalOpen) return;

    // Advance if lines exist
    if (currentLineIndex < scriptLines.length) {
      useGameStore.setState((state) => ({
        currentLineIndex: state.currentLineIndex + 1,
      }));
      advanceLine();
    }
  };

  const currentLine = scriptLines[currentLineIndex];

  return (
    <div className="game-container" onClick={handleNextClick}>
      <BackgroundLayer />
      <CharacterStage />
      <EnergyMeter />

      {/* In-Game UI Buttons */}
      <div className="hud-buttons">
        <button
          className="hud-btn quit-btn"
          onClick={(e) => {
            e.stopPropagation();
            setScreen("main_menu");
          }}
        >
          EXIT
        </button>
        <button
          className="hud-btn"
          onClick={(e) => {
            e.stopPropagation();
            setShowSave(true);
          }}
        >
          SAVE
        </button>
        <button
          className="hud-btn journal-btn"
          onClick={(e) => {
            e.stopPropagation();
            setJournalOpen(true);
          }}
        >
          JOURNAL
        </button>
      </div>

      {/* Render Save Menu if active */}
      {showSave && (
        <SaveLoadMenu mode="save" onClose={() => setShowSave(false)} />
      )}

      {isJournalOpen && (
        <JournalOverlay onClose={() => setJournalOpen(false)} />
      )}

      {!isJournalOpen && currentLine?.type === "dialogue" && (
        <DialogueBox charId={currentLine.characterId} text={currentLine.text} />
      )}
    </div>
  );
};
