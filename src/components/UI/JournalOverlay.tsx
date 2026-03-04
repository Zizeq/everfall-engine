import { useEffect, useRef, useState } from "react";
import HTMLFlipBook from "react-pageflip";
import { useGameStore } from "../../store/useGameStore";
import { JournalPage } from "./Journal/JournalPage";
import "./Journal/Journal.css";

const CHAR_DATA: Record<string, { name: string; bio: string; img: string }> = {
  willow: { name: "Willow", bio: "Childhood Friend", img: "willow-happy.png" },
  ash: { name: "Ash", bio: "The Prince", img: "ash-tired.png" },
  nova: { name: "Nova", bio: "The Wolf", img: "nova-happy.png" },
};

export const JournalOverlay = ({ onClose }: { onClose: () => void }) => {
  const {
    journalNotes,
    journalFacts,
    unlockedCharacters,
    setJournalNote,
    toggleFact,
  } = useGameStore();

  // 1. Ref to control the book API
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const bookRef = useRef<any>(null);

  // 2. State for the entrance animation
  const [isEntering, setIsEntering] = useState(true);

  // 3. The Cinematic Sequence
  useEffect(() => {
    // Step A: Wait 100ms, then float the book up (remove 'entering' class)
    const floatTimer = setTimeout(() => {
      setIsEntering(false);
    }, 100);

    // Step B: Wait for the float to finish (1.2s), then flip the cover open automatically
    const flipTimer = setTimeout(() => {
      if (bookRef.current) {
        // The library exposes a .pageFlip() object with methods
        bookRef.current.pageFlip().flipNext();
      }
    }, 1200);

    return () => {
      clearTimeout(floatTimer);
      clearTimeout(flipTimer);
    };
  }, []);

  return (
    <div className="journal-overlay-container">
      <div className="backdrop" onClick={onClose} />

      <div
        // Apply the 'entering' class if the animation state is true
        className={`book-wrapper ${isEntering ? "entering" : ""}`}
        onClick={(e) => {
          e.stopPropagation();
          e.nativeEvent.stopImmediatePropagation();
        }}
      >
        {/* @ts-expect-error - Library types */}
        <HTMLFlipBook
          width={500}
          height={700}
          size="fixed"
          minWidth={500}
          minHeight={700}
          showCover={true}
          useMouseEvents={true}
          ref={bookRef} // Attach the ref here
          flippingTime={1000} // Slower flip looks more "cinematic"
        >
          {/* Cover */}
          <JournalPage className="cover-hard">
            <h1>CONFIDENTIAL</h1>
            <p>Subject: Clover</p>
          </JournalPage>

          <JournalPage>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
                color: "#888",
              }}
            >
              <p>Property of Everfall Academy</p>
            </div>
          </JournalPage>

          {/* Table of Contents */}
          <JournalPage>
            <h3>Personnel Files</h3>
            <ul className="toc-list">
              {Object.keys(CHAR_DATA).map((id) => (
                <li
                  key={id}
                  className={unlockedCharacters.includes(id) ? "" : "locked"}
                >
                  {unlockedCharacters.includes(id)
                    ? CHAR_DATA[id].name
                    : "UNKNOWN"}
                </li>
              ))}
            </ul>
          </JournalPage>

          {/* DYNAMIC SPREADS */}
          {Object.entries(CHAR_DATA).flatMap(([id, data]) => {
            const isUnlocked = unlockedCharacters.includes(id);
            const notes = journalNotes[id] || "";
            const facts = journalFacts[id] || [];

            return [
              <JournalPage key={`${id}-left`}>
                {isUnlocked ? (
                  <div className="dossier-layout">
                    <div className="polaroid">
                      <img
                        src={`/assets/images/sprites/${data.name}/${data.img}`}
                        alt={data.name}
                      />
                    </div>
                    <h2>{data.name}</h2>
                    <p className="bio-sub">{data.bio}</p>

                    <div className="facts-section">
                      <h4>OBSERVATIONS:</h4>
                      <ul>
                        {facts.map((fact, idx) => (
                          <li
                            key={idx}
                            className={fact.crossed ? "crossed-out" : ""}
                            onClick={() => toggleFact(id, idx)}
                            title="Click to toggle"
                          >
                            {fact.text}
                          </li>
                        ))}
                        {facts.length === 0 && (
                          <li>
                            <em>No data collected.</em>
                          </li>
                        )}
                      </ul>
                    </div>
                  </div>
                ) : (
                  <div className="locked-page">
                    <h2>ACCESS DENIED</h2>
                  </div>
                )}
              </JournalPage>,

              <JournalPage key={`${id}-right`}>
                {isUnlocked ? (
                  <div className="notes-layout">
                    <h3>Field Notes</h3>
                    <textarea
                      value={notes}
                      onChange={(e) => setJournalNote(id, e.target.value)}
                      placeholder={`Write your private thoughts about ${data.name}...`}
                    />
                  </div>
                ) : (
                  <div className="locked-page">
                    <p>...</p>
                  </div>
                )}
              </JournalPage>,
            ];
          })}

          {/* Back Cover */}
          <JournalPage className="cover-hard">
            <div className="end-logo">EVERFALL</div>
          </JournalPage>
        </HTMLFlipBook>
      </div>
    </div>
  );
};
