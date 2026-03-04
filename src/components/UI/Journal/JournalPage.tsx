import { forwardRef, type ReactNode } from "react";

interface PageProps {
  children: ReactNode;
  number?: number;
  className?: string;
}

// CRITICAL: wrapping the component in forwardRef
export const JournalPage = forwardRef<HTMLDivElement, PageProps>(
  (props, ref) => {
    return (
      <div
        className={`journal-page ${props.className || ""}`}
        ref={ref} // <--- THIS IS THE MAGIC KEY. WITHOUT THIS, THE LEFT PAGE VANISHES.
      >
        <div className="page-content">
          {props.children}
          {props.number && <span className="page-number">{props.number}</span>}
        </div>
      </div>
    );
  },
);

// Required for debugging/React DevTools
JournalPage.displayName = "JournalPage";
