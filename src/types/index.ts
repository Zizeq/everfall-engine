// Define what a parsed line looks like
export interface ScriptLine {
  id: string; // Unique ID for React keys
  type: "dialogue" | "command" | "choice";
  characterId?: string; // 'a', 'c', 'n'
  emotion?: string; // 'happy', 'sad'
  text?: string; // "Hello Clover."
  command?: string; // "scene kitchen" or "stat energy -10"
  args?: string[]; // Arguments for commands
}

export interface JournalFact {
  text: string;
  crossed: boolean;
}
// Define the Global Game State
export interface GameState {
  currentChapter: number;
  currentLineIndex: number;
  scriptLines: ScriptLine[]; // The loaded chapter

  // Player Stats
  energy: number; // 0-100
  inventory: string[];

  // Relationship Vitals
  relationships: {
    ash: { comfort: number; bond: number };
    nova: { comfort: number; bond: number };
    // ... others
  };

  // Visual State
  currentBg: string;
  activeSprites: Record<string, string>; // { "ash": "tired", "nova": "happy" }

  journalNotes: Record<string, string>;
  journalFacts: Record<string, JournalFact[]>;
  unlockedCharacters: string[];
}
