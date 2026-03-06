import { useState } from "react";
import { useGameStore } from "../../store/useGameStore";
import "./Screens.css";

interface SaveLoadMenuProps {
  mode: "save" | "load";
  onClose: () => void;
}

interface SaveSlotData {
  date: string;
  previewText: string;
}

export const SaveLoadMenu = ({ mode, onClose }: SaveLoadMenuProps) => {
  const { saveGame, loadGame } = useGameStore();

  // FIXED: Lazy initialization reads localStorage only once on mount.
  // No useEffect needed!
  const [slots, setSlots] = useState<(SaveSlotData | null)[]>(() => {
    return [1, 2, 3].map((id) => {
      const data = localStorage.getItem(`save_slot-${id}`);
      return data ? JSON.parse(data) : null;
    });
  });

  const handleSlotClick = (index: number) => {
    const slotId = `slot-${index + 1}`;

    if (mode === "save") {
      // SAVE GAME
      if (window.confirm(`Overwrite Slot ${index + 1}?`)) {
        saveGame(slotId);
        // Update local state immediately to reflect changes
        const newData = localStorage.getItem(`save_${slotId}`);
        const newSlots = [...slots];
        newSlots[index] = newData ? JSON.parse(newData) : null;
        setSlots(newSlots);
      }
    } else {
      // LOAD GAME
      if (slots[index]) {
        if (
          window.confirm(
            `Load Slot ${index + 1}? Unsaved progress will be lost.`,
          )
        ) {
          const success = loadGame(slotId);
          if (success) onClose();
        }
      }
    }
  };

  return (
    <div className="save-load-overlay">
      <div className="save-load-panel">
        <h2>{mode === "save" ? "SAVE GAME" : "LOAD GAME"}</h2>

        <div className="slots-grid">
          {slots.map((slot, idx) => (
            <div
              key={idx}
              className={`save-slot ${!slot && mode === "load" ? "empty" : "filled"}`}
              onClick={() => handleSlotClick(idx)}
            >
              <div className="slot-header">SLOT {idx + 1}</div>
              <div className="slot-content">
                {slot ? (
                  <>
                    <div className="slot-date">{slot.date}</div>
                    <div className="slot-preview">{slot.previewText}</div>
                  </>
                ) : (
                  <div className="slot-empty-text">-- EMPTY --</div>
                )}
              </div>
            </div>
          ))}
        </div>

        <button className="back-btn" onClick={onClose}>
          BACK
        </button>
      </div>
    </div>
  );
};
