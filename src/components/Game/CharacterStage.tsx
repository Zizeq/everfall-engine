import { useGameStore } from "../../store/useGameStore";

export const CharacterStage = () => {
  const activeSprites = useGameStore((state) => state.activeSprites);

  // Convert the object { "Willow": "happy" } into an array to map over
  const charactersOnStage = Object.entries(activeSprites);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 1,
        pointerEvents: "none",
      }}
    >
      {charactersOnStage.map(([name, emotion]) => {
        // LOGIC: Construct the file path based on your folder structure
        // Folder: Capitalized Name (Willow)
        // File: lowercase-name-emotion.png (willow-happy.png)
        const folderName = name;
        const fileName = `${name.toLowerCase()}-${emotion}.png`;
        const spritePath = `/assets/images/sprites/${folderName}/${fileName}`;

        return (
          <img
            key={name}
            src={spritePath}
            alt={name}
            style={{
              position: "absolute",
              bottom: 0,
              left: "50%",
              transform: "translateX(-50%)",
              height: "85%", // Adjust height to fit screen
              transition: "all 0.3s ease",
            }}
            // Add error handling to see if path is wrong in console
            onError={(e) => console.error(`Missing sprite: ${spritePath}`, e)}
          />
        );
      })}
    </div>
  );
};
