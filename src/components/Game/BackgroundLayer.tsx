import { useGameStore } from "../../store/useGameStore";

export const BackgroundLayer = () => {
  const currentBg = useGameStore((state) => state.currentBg);

  if (!currentBg)
    return (
      <div style={{ background: "#000", inset: 0, position: "absolute" }} />
    );

  // Construct the path: /assets/images/backgrounds/graduation.jpg
  const bgPath = `/assets/images/backgrounds/${currentBg}.jpg`;

  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
      <img
        src={bgPath}
        alt="bg"
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
    </div>
  );
};
