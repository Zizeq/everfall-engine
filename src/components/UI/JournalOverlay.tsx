import HTMLFlipBook from "react-pageflip";
import { useGameStore } from "../../store/useGameStore";
import { JournalPage } from "./Journal/JournalPage";
import "./Journal/Journal.css";

// Update mock data to include image paths if you want
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

  return (
    <div className="journal-overlay-container">
      {/* 1. BACKDROP */}
      <div className="backdrop" onClick={onClose} />

      {/* 2. BOOK WRAPPER */}
      <div className="book-wrapper" onClick={(e) => e.stopPropagation()}>
        {/* @ts-expect-error - Library types */}
        <HTMLFlipBook width={500} height={700} showCover={true}>
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

          {/* DYNAMIC SPREADS (FIXED: Using flatMap) */}
          {Object.entries(CHAR_DATA).flatMap(([id, data]) => {
            const isUnlocked = unlockedCharacters.includes(id);
            const notes = journalNotes[id] || "";
            const facts = journalFacts[id] || [];

            return [
              // PAGE LEFT: The Dossier
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

              // PAGE RIGHT: Player Notes
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
