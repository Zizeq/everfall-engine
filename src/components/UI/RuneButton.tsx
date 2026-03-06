import React from "react";
import "./RuneButton.css";

interface RuneButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "shard" | "tablet" | "jagged";
  isPrimary?: boolean;
}

export const RuneButton = ({
  children,
  variant = "shard",
  isPrimary = false,
  className,
  style,
  ...props
}: RuneButtonProps) => {
  // NEW SHAPES: Deliberately asymmetric to look organic
  const shapes = {
    // A lopsided shard
    shard: "polygon(15% 5%, 95% 0%, 100% 60%, 85% 100%, 5% 95%, 0% 30%)",
    // A chipped ancient tablet
    tablet:
      "polygon(2% 15%, 8% 2%, 95% 0%, 100% 85%, 92% 100%, 10% 95%, 0% 80%)",
    // A jagged raw crystal
    jagged: "polygon(5% 0%, 100% 10%, 90% 100%, 20% 90%, 0% 20%)",
  };

  return (
    <button
      className={`rune-btn-root ${className || ""}`}
      style={style}
      {...props}
    >
      <div
        className={`rune-layer-rock ${isPrimary ? "primary" : ""}`}
        style={{ clipPath: shapes[variant] }}
      />
      <span className="rune-layer-text">{children}</span>
    </button>
  );
};
