import { forwardRef, type ReactNode } from "react";

interface PageProps {
  children: ReactNode;
  number?: number; // Page number
  className?: string; // For "hard" covers vs paper
}

export const JournalPage = forwardRef<HTMLDivElement, PageProps>(
  (props, ref) => {
    return (
      <div className={`journal-page ${props.className || ""}`} ref={ref}>
        <div className="page-content">
          {props.children}
          {props.number && <span className="page-number">{props.number}</span>}
        </div>
      </div>
    );
  },
);

// We need a CSS file for the visuals, creating a simple style block below
JournalPage.displayName = "JournalPage";
