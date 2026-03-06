import { useGameStore } from "../../store/useGameStore";
import "./Screens.css";

export const OptionsMenu = () => {
  const { setScreen, settings, setSetting } = useGameStore();

  return (
    <div className="options-container">
      <div className="options-panel">
        <h2>System Settings</h2>

        <div className="setting-row">
          <label>Music Volume</label>
          <input
            type="range"
            min="0"
            max="100"
            value={settings.musicVolume}
            onChange={(e) =>
              setSetting("musicVolume", parseInt(e.target.value))
            }
          />
          <span>{settings.musicVolume}%</span>
        </div>

        <div className="setting-row">
          <label>Text Speed</label>
          <input
            type="range"
            min="0"
            max="100"
            value={settings.textSpeed}
            onChange={(e) => setSetting("textSpeed", parseInt(e.target.value))}
          />
          <span>
            {settings.textSpeed === 100 ? "Instant" : settings.textSpeed}
          </span>
        </div>

        <div className="options-actions">
          <button onClick={() => setScreen("main_menu")}>Back to Menu</button>
        </div>
      </div>
    </div>
  );
};
