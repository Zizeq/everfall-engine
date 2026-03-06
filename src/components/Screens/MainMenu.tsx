// src/components/Screens/MainMenu.tsx

import { useState } from "react";
import { useGameStore } from "../../store/useGameStore";
import { parseScript } from "../../engine/parser";
import { SaveLoadMenu } from "./SaveLoadMenu";
// 1. Import the new button
import { RuneButton } from "../UI/RuneButton";
import "./Screens.css";

export const MainMenu = () => {
  const { loadScript, resetGame, setScreen } = useGameStore();
  const [showLoad, setShowLoad] = useState(false);

  const handleNewGame = async () => {
    resetGame();
    try {
      const res = await fetch("/assets/scripts/chapter1.efs");
      const text = await res.text();
      const parsed = parseScript(text);
      loadScript(parsed);
      setScreen("game");
    } catch (e) {
      console.error("Failed to load script:", e);
    }
  };

  return (
    <div className="main-menu-container">
      <div className="menu-content">
        <h1 className="game-title">EVERFALL</h1>

        {/* 2. REPLACE BUTTONS HERE */}
        <div className="menu-buttons">
          <RuneButton onClick={handleNewGame} variant="shard" isPrimary={true}>
            New Game
          </RuneButton>

          <RuneButton onClick={() => setShowLoad(true)} variant="tablet">
            Load Game
          </RuneButton>

          <RuneButton onClick={() => setScreen("options")} variant="jagged">
            Options
          </RuneButton>

          <RuneButton onClick={() => window.close()} variant="shard">
            Quit
          </RuneButton>
        </div>
      </div>
      <div className="version-tag">v0.2.0-Alpha</div>

      {showLoad && (
        <SaveLoadMenu mode="load" onClose={() => setShowLoad(false)} />
      )}
    </div>
  );
};
