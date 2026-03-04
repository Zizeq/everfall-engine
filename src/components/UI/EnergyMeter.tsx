export const EnergyMeter = () => {
  return (
    <div
      style={{
        position: "absolute",
        top: 20,
        left: 20,
        color: "white",
        zIndex: 10,
        background: "rgba(0,0,0,0.5)",
        padding: "5px 10px",
        borderRadius: "4px",
      }}
    >
      Energy: 100%
    </div>
  );
};
