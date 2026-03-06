/* src/components/UI/RuneButton.tsx */
import React from "react";
import "./RuneButton.css";

interface RuneButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "shard" | "tablet" | "jagged";
}

export const RuneButton = ({
  children,
  variant = "shard",
  className,
  ...props
}: RuneButtonProps) => {
  // Sharp, faceted crystal shapes
  const crystalShapes = {
    shard: "polygon(5% 20%, 90% 10%, 100% 50%, 90% 90%, 10% 95%, 0% 50%)",
    tablet:
      "polygon(0% 15%, 15% 0%, 85% 5%, 100% 20%, 95% 85%, 80% 100%, 15% 95%)",
    jagged: "polygon(10% 25%, 90% 0%, 100% 40%, 85% 90%, 10% 100%, 0% 60%)",
  };

  return (
    <button
      className={`crystal-btn-root ${className || ""}`}
      style={{ clipPath: crystalShapes[variant] }}
      {...props}
    >
      {/* Internal layers for depth */}
      <div className="crystal-layer-bg" />
      <div className="crystal-layer-facets" />
      <div className="crystal-layer-glow" />
      <span className="crystal-text">{children}</span>
    </button>
  );
};
