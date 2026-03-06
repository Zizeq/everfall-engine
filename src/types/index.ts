// src/types/index.ts

export interface ScriptLine {
  type: "dialogue" | "command";
  characterId?: string;
  emotion?: string;
  text?: string;
  command?: string;
  args?: string[];
}

export interface GameState {
  currentChapter: number;
  currentLineIndex: number;
  scriptLines: ScriptLine[];
  energy: number;
  inventory: string[];
  relationships: Record<string, { comfort: number; bond: number }>;
  currentBg: string;
  activeSprites: Record<string, string>;

  // Journal
  journalNotes: Record<string, string>;
  journalFacts: Record<string, { text: string; crossed: boolean }[]>;
  unlockedCharacters: string[];
}

// FIXED: Replaced 'any' with 'GameState'
export interface SaveFile {
  id: string;
  date: string;
  previewText: string;
  gameState: GameState;
}
