type Props = { charId?: string; text?: string };

export const DialogueBox = ({ charId, text }: Props) => {
  return (
    <div
      style={{
        position: "absolute",
        bottom: 20,
        left: "5%",
        right: "5%",
        height: 150,
        background: "rgba(0,0,0,0.8)",
        padding: 20,
        zIndex: 20,
        border: "2px solid white",

        // ADD THESE TWO LINES:
        color: "white", // Forces text to be white
        fontFamily: "sans-serif",
      }}
    >
      <h3 style={{ margin: 0, color: "#ffcc00" }}>{charId || "???"}</h3>
      <p style={{ fontSize: "1.2rem" }}>{text}</p>
    </div>
  );
};
